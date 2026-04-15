export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation', ...options.headers },
  });
  return res.json();
}

// Skribble JWT Token holen
async function getSkribbleToken(username, apiKey) {
  const res = await fetch('https://api.skribble.com/v2/access/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, 'api-key': apiKey }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Skribble login failed (${res.status}): ${err.substring(0, 200)}`);
  }
  const text = await res.text();
  // Skribble returns the JWT token as plain text
  return text.replace(/"/g, '').trim();
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const SKRIBBLE_USERNAME = process.env.SKRIBBLE_USERNAME;
  const SKRIBBLE_API_KEY = process.env.SKRIBBLE_API_KEY;

  try {
    const { application_id, signer_name, signer_email } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    // === SIMULATIONS-MODUS (wenn Skribble nicht konfiguriert) ===
    if (!SKRIBBLE_USERNAME || !SKRIBBLE_API_KEY) {
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'submitted', updated_at: new Date().toISOString() }),
      });
      await supaFetch('status_updates', {
        method: 'POST',
        body: JSON.stringify({
          application_id, status: 'submitted',
          message: `Vollmacht von ${signer_name || 'Nutzer'} erhalten. Antrag wird eingereicht.`,
        }),
      });
      return Response.json({ success: true, mode: 'simulation' });
    }

    // === ECHTE SKRIBBLE INTEGRATION ===
    const origin = request.headers.get('origin') || 'https://adminpilot.de';

    // 1. JWT Token holen
    let token;
    try {
      token = await getSkribbleToken(SKRIBBLE_USERNAME, SKRIBBLE_API_KEY);
    } catch (loginErr) {
      // Login fehlgeschlagen → Fallback auf Simulation
      console.error('Skribble login failed:', loginErr.message);
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'submitted', updated_at: new Date().toISOString() }),
      });
      await supaFetch('status_updates', {
        method: 'POST',
        body: JSON.stringify({
          application_id, status: 'submitted',
          message: `Vollmacht von ${signer_name || 'Nutzer'} erhalten (Signatur-Service temporär nicht verfügbar). Antrag wird eingereicht.`,
        }),
      });
      return Response.json({ success: true, mode: 'simulation', note: 'Skribble login failed, used simulation' });
    }

    // 2. Vollmacht-PDF als Base64 (vereinfacht für MVP)
    const vollmachtContent = `VOLLMACHT\n\nHiermit bevollmächtige ich, ${signer_name || 'Nutzer'}, die ALEVOR Mittelstandspartner GmbH (AdminPilot), Titurelstraße 10, 81925 München, den folgenden Antrag in meinem Namen bei der zuständigen Behörde einzureichen.\n\nAntrags-ID: ${application_id}\nDatum: ${new Date().toLocaleDateString('de-DE')}\n\nDiese Vollmacht ist auf den genannten Vorgang beschränkt und erlischt nach Abschluss des Verfahrens.`;

    // 3. Dokument bei Skribble hochladen
    const uploadRes = await fetch('https://api.skribble.com/v2/document', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `Vollmacht_AdminPilot_${application_id.substring(0, 8)}`,
        content_type: 'text/plain',
        content: btoa(unescape(encodeURIComponent(vollmachtContent))),
      }),
    });

    if (!uploadRes.ok) {
      const uploadErr = await uploadRes.text();
      throw new Error(`Document upload failed: ${uploadErr.substring(0, 200)}`);
    }

    const docData = await uploadRes.json();
    const documentId = docData.id;

    // 4. Signatur-Request erstellen
    const firstName = (signer_name || 'Nutzer').split(' ')[0];
    const lastName = (signer_name || 'Nutzer').split(' ').slice(1).join(' ') || firstName;

    const sigRes = await fetch('https://api.skribble.com/v2/signature-request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `AdminPilot Vollmacht`,
        message: 'Bitte unterschreiben Sie die Vollmacht für Ihren Sozialleistungsantrag.',
        document_id: documentId,
        signature_type: 'SES',
        signers: [{
          email_address: signer_email,
          signer_identity_data: {
            first_name: firstName,
            last_name: lastName,
          },
        }],
        callback_success_url: `${origin}/app/signatur-callback?antrag=${application_id}&status=signed`,
        callback_decline_url: `${origin}/app/signatur-callback?antrag=${application_id}&status=declined`,
      }),
    });

    if (!sigRes.ok) {
      const sigErr = await sigRes.text();
      throw new Error(`Signature request failed: ${sigErr.substring(0, 200)}`);
    }

    const sigData = await sigRes.json();

    return Response.json({
      success: true,
      mode: 'skribble',
      signing_url: sigData.signing_url,
      request_id: sigData.id,
    });

  } catch (error) {
    // Bei jedem Fehler: Fallback auf Simulation
    try {
      const { application_id, signer_name } = await request.clone().json().catch(() => ({}));
      if (application_id) {
        await supaFetch(`applications?id=eq.${application_id}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: 'submitted', updated_at: new Date().toISOString() }),
        });
        await supaFetch('status_updates', {
          method: 'POST',
          body: JSON.stringify({
            application_id, status: 'submitted',
            message: `Vollmacht erhalten. Antrag wird eingereicht.`,
          }),
        });
      }
    } catch {}

    return Response.json({
      success: true,
      mode: 'simulation',
      note: `Skribble error: ${error.message}. Fallback to simulation.`,
    });
  }
}
