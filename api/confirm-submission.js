export const config = { runtime: 'edge' };

// POST /api/confirm-submission
// Kunde bestätigt: "Ich habe den Antrag eingereicht"
// Setzt Status auf eingereicht_durch_kunde + Timestamp

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  try {
    const { application_id, submission_method } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    // Application prüfen
    const [app] = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    if (!app) return Response.json({ success: false, error: 'Application not found' });

    // Status nur weiterschalten, wenn der Antrag wirklich bereit war
    if (app.status !== 'antrag_bereit' && app.status !== 'eingereicht_durch_kunde') {
      return Response.json({ success: false, error: `Antrag nicht im Status 'antrag_bereit' (aktuell: ${app.status})` });
    }

    const method = submission_method || 'eigenstaendig';

    await supaFetch(`applications?id=eq.${application_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'eingereicht_durch_kunde',
        eingereicht_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id,
        status: 'eingereicht_durch_kunde',
        message: method === 'post'
          ? 'Antrag vom Kunden per Post eingereicht. Bearbeitung bei Behörde 3–8 Wochen.'
          : method === 'online'
            ? 'Antrag vom Kunden online eingereicht. Bearbeitung bei Behörde 3–8 Wochen.'
            : 'Antrag vom Kunden eingereicht. Bearbeitung bei Behörde 3–8 Wochen.',
      }),
    });

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
