export const config = { runtime: 'edge' };

// Stripe sendet Events hierher nach erfolgreicher Zahlung
// Webhook URL in Stripe Dashboard: https://adminpilot.de/api/stripe-webhook

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  return res.json();
}

async function triggerGenerateAntrag(origin, applicationId) {
  // Fire-and-forget: generate-antrag läuft im Hintergrund weiter
  try {
    const res = await fetch(`${origin}/api/generate-antrag`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const event = body.type;

    // === checkout.session.completed ===
    if (event === 'checkout.session.completed') {
      const session = body.data?.object;
      const metadata = session?.metadata || {};
      const applicationId = metadata.application_id;
      const isPlus = metadata.package_type === 'basis_plus';
      const plusAmount = Number(metadata.plus_amount || 0);

      if (!applicationId) {
        return Response.json({ received: true, skipped: 'no application_id' });
      }

      // Payment-Record anlegen (zahlungen)
      await supaFetch('payments', {
        method: 'POST',
        body: JSON.stringify({
          application_id: applicationId,
          clerk_id: session.client_reference_id || 'webhook',
          amount: (session.amount_total || 0) / 100, // Cents → Euro für NUMERIC
          status: 'paid',
          stripe_session_id: session.id,
          type: isPlus ? 'base_fee_plus' : 'base_fee',
          plus_amount: plusAmount / 100,
        }),
      });

      // Application-Status → antrag_wird_erstellt; plus_package-Flag setzen
      // Idempotent: nur updaten, wenn Status noch nicht weiter fortgeschritten ist
      await supaFetch(`applications?id=eq.${applicationId}&status=in.(analysis_complete,payment_pending,antrag_wird_erstellt)`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'antrag_wird_erstellt',
          plus_package: isPlus,
          updated_at: new Date().toISOString(),
        }),
      });

      // Timeline-Eintrag
      await supaFetch('status_updates', {
        method: 'POST',
        body: JSON.stringify({
          application_id: applicationId,
          status: 'antrag_wird_erstellt',
          message: isPlus
            ? `Zahlung von ${(session.amount_total / 100).toLocaleString('de-DE')} € bestätigt (inkl. Plus-Paket). Ihr Antrag wird jetzt vorbereitet.`
            : `Zahlung von ${(session.amount_total / 100).toLocaleString('de-DE')} € bestätigt. Ihr Antrag wird jetzt vorbereitet.`,
        }),
      });

      // generate-antrag anstoßen (fire-and-forget)
      const origin = new URL(request.url).origin;
      triggerGenerateAntrag(origin, applicationId);

      return Response.json({ received: true, processed: applicationId, is_plus: isPlus });
    }

    // Andere Events ignorieren
    return Response.json({ received: true, skipped: event });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 200 });
  }
}
