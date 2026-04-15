export const config = { runtime: 'edge' };

// Erstellt eine Skribble Signatur-Anfrage
// Docs: https://api-doc.skribble.com

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
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const SKRIBBLE_API_KEY = process.env.SKRIBBLE_API_KEY;
  const SKRIBBLE_USERNAME = process.env.SKRIBBLE_USERNAME;

  // Fallback: Wenn Skribble noch nicht konfiguriert, simulieren wir den Flow
  if (!SKRIBBLE_API_KEY) {
    try {
      const { application_id, signer_name, signer_email } = await request.json();

      if (!application_id) return Response.json({ success: false, error: 'application_id required' });

      // Status direkt updaten (Simulations-Modus)
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'submitted', updated_at: new Date().toISOString() }),
      });

      await supaFetch('status_updates', {
        method: 'POST',
        body: JSON.stringify({
          application_id: application_id,
          status: 'submitted',
          message: `Vollmacht von ${signer_name} erhalten. Antrag wird bei der Behörde eingereicht.`,
        }),
      });

      return Response.json({
        success: true,
        mode: 'simulation',
        message: 'Signatur simuliert (Skribble noch nicht konfiguriert). Antrag als eingereicht markiert.',
      });
    } catch (err) {
      return Response.json({ success: false, error: err.message });
    }
  }

  // === ECHTE SKRIBBLE INTEGRATION ===
  try {
    const { application_id, signer_name, signer_email } = await request.json();

    if (!application_id || !signer_name || !signer_email) {
      return Response.json({ success: false, error: 'application_id, signer_name, signer_email required' });
    }

    const origin = request.headers.get('origin') || 'https://adminpilot.de';

    // 1. Vollmacht-PDF generieren (Placeholder - in Production echtes PDF)
    // Für MVP: Einfaches Text-Dokument als Vollmacht
    const vollmachtText = `
VOLLMACHT

Hiermit bevollmächtige ich, ${signer_name}, die ALEVOR Mittelstandspartner GmbH
(AdminPilot), Titurelstraße 10, 81925 München, den folgenden Antrag in meinem
Namen bei der zuständigen Behörde einzureichen und alle damit verbundenen
Korrespondenzen zu führen.

Antrags-ID: ${application_id}
Datum: ${new Date().toLocaleDateString('de-DE')}

Diese Vollmacht ist auf den oben genannten Vorgang beschränkt und erlischt
nach Abschluss des Verfahrens.
    `.trim();

    // Base64-encode für Skribble
    const vollmachtBase64 = btoa(unescape(encodeURIComponent(vollmachtText)));

    // 2. Skribble Signatur-Request erstellen
    const skribbleRes = await fetch('https://api.skribble.com/v2/signature-requests', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(SKRIBBLE_USERNAME + ':' + SKRIBBLE_API_KEY)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `AdminPilot Vollmacht – ${application_id.substring(0, 8)}`,
        message: 'Bitte unterschreiben Sie die Vollmacht für Ihren Sozialleistungsantrag.',
        signers: [{
          email_address: signer_email,
          signer_identity_data: {
            first_name: signer_name.split(' ')[0],
            last_name: signer_name.split(' ').slice(1).join(' ') || signer_name,
          },
        }],
        content: vollmachtBase64,
        content_type: 'text/plain',
        callback_success_url: `${origin}/app/signatur-callback?antrag=${application_id}&status=signed`,
        callback_decline_url: `${origin}/app/signatur-callback?antrag=${application_id}&status=declined`,
        callback_error_url: `${origin}/app/signatur-callback?antrag=${application_id}&status=error`,
      }),
    });

    if (!skribbleRes.ok) {
      const errText = await skribbleRes.text();
      return Response.json({ success: false, error: `Skribble API: ${errText.substring(0, 200)}` });
    }

    const skribbleData = await skribbleRes.json();

    return Response.json({
      success: true,
      mode: 'skribble',
      signing_url: skribbleData.signing_url || skribbleData.url,
      request_id: skribbleData.id,
    });

  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
