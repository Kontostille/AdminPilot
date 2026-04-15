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

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'POST only' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const event = body.type;

    // Nur checkout.session.completed verarbeiten
    if (event === 'checkout.session.completed') {
      const session = body.data?.object;
      const applicationId = session?.metadata?.application_id;

      if (!applicationId) {
        return Response.json({ received: true, skipped: 'no application_id' });
      }

      // 1. Payment record erstellen
      await supaFetch('payments', {
        method: 'POST',
        body: JSON.stringify({
          application_id: applicationId,
          clerk_id: session.client_reference_id || 'webhook',
          amount: session.amount_total || 4900,
          currency: session.currency || 'eur',
          status: 'completed',
          stripe_session_id: session.id,
          payment_type: 'base_fee',
        }),
      });

      // 2. Application Status updaten → signature_pending
      await supaFetch(`applications?id=eq.${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'signature_pending',
          updated_at: new Date().toISOString(),
        }),
      });

      // 3. Status-Update für Timeline
      await supaFetch('status_updates', {
        method: 'POST',
        body: JSON.stringify({
          application_id: applicationId,
          status: 'signature_pending',
          message: 'Zahlung von 49 € bestätigt. Bitte unterschreiben Sie die Vollmacht.',
        }),
      });

      return Response.json({ received: true, processed: applicationId });
    }

    // Andere Events ignorieren
    return Response.json({ received: true, skipped: event });

  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: error.message }, { status: 200 });
  }
}
