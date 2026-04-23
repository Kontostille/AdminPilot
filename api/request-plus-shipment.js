export const config = { runtime: 'edge' };

// POST /api/request-plus-shipment
// Kunde mit Plus-Paket bestellt den Versandumschlag
// Sendet interne E-Mail an info@adminpilot.de

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const INTERNAL_EMAIL = 'info@adminpilot.de';

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  return res.json();
}

async function sendInternalEmail(subject, html) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY missing - email not sent');
    return { skipped: 'no_resend_key' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AdminPilot System <system@adminpilot.de>',
        to: [INTERNAL_EMAIL],
        subject,
        html,
      }),
    });
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  try {
    const { application_id } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    // Application + Profile laden
    const [app] = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    if (!app) return Response.json({ success: false, error: 'Application not found' });

    if (!app.plus_package) {
      return Response.json({ success: false, error: 'Plus-Paket nicht gebucht' });
    }

    const [profile] = await supaFetch(`profiles?clerk_id=eq.${app.clerk_id}&select=*`);

    // Interne E-Mail vorbereiten
    const kunde = profile?.full_name || 'Unbekannt';
    const email = profile?.email || '—';
    const anschrift = profile
      ? `${profile.address || '—'}, ${profile.zip || ''} ${profile.city || ''}`.trim()
      : '—';
    const behoerde = app.generated_antrag?.behoerde_empfaenger?.name || '—';
    const behoerde_adresse = app.generated_antrag?.behoerde_empfaenger?.adresse || '—';

    const subject = `[AdminPilot Plus] Versandumschlag bestellt – ${app.leistung_name} (${kunde})`;
    const html = `
      <h2>Plus-Paket: Versandumschlag-Bestellung</h2>
      <p>Ein Kunde mit Plus-Paket hat einen Versandumschlag angefordert.</p>

      <h3>Kunde</h3>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0;"><b>Name:</b></td><td>${kunde}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><b>E-Mail:</b></td><td>${email}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><b>Anschrift:</b></td><td>${anschrift}</td></tr>
      </table>

      <h3>Antrag</h3>
      <table style="border-collapse: collapse;">
        <tr><td style="padding: 4px 12px 4px 0;"><b>Antrag-ID:</b></td><td><code>${application_id}</code></td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><b>Leistung:</b></td><td>${app.leistung_name}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><b>Behörde:</b></td><td>${behoerde}</td></tr>
        <tr><td style="padding: 4px 12px 4px 0;"><b>Behörden-Adresse:</b></td><td>${behoerde_adresse}</td></tr>
      </table>

      <h3>Nächste Schritte (manuell)</h3>
      <ol>
        <li>Antrag-PDF aus Supabase laden (applications.generated_antrag)</li>
        <li>PDF ausdrucken + Nachweise-Liste beilegen</li>
        <li>In frankierten Umschlag an Kunden-Adresse packen (mit Rückumschlag an Behörde)</li>
        <li>Abschicken</li>
      </ol>

      <hr>
      <p style="color: #666; font-size: 12px;">
        Automatisch generiert von request-plus-shipment.js am ${new Date().toLocaleString('de-DE')}.
      </p>
    `;

    const emailResult = await sendInternalEmail(subject, html);

    // Timeline-Eintrag für den Kunden
    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id,
        status: app.status,
        message: 'Versandumschlag bestellt. Wir bereiten Ihren Antrag zum Versand vor und schicken ihn in 2–3 Werktagen an Ihre Adresse.',
      }),
    });

    return Response.json({ success: true, email: emailResult });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
