export const config = { runtime: 'edge' };

// GET /api/download-antrag?application_id=xxx
// Gibt einen Signed URL zurueck fuer den Download des ausgefuellten PDFs

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return res.json();
}

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' } });
  }

  try {
    const url = new URL(request.url);
    const applicationId = url.searchParams.get('application_id');
    if (!applicationId) return Response.json({ success: false, error: 'application_id required' });

    const [app] = await supaFetch(`applications?id=eq.${applicationId}&select=generated_antrag,leistung_name,clerk_id`);
    if (!app) return Response.json({ success: false, error: 'Application not found' });

    const filledPath = app.generated_antrag?.filled_pdf_path;
    if (!filledPath) {
      return Response.json({ success: false, error: 'Kein fertiges PDF vorhanden. Evtl. muss zuerst generiert werden.' });
    }

    // Signed URL (60 Sekunden gueltig)
    const signedRes = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/documents/${filledPath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 3600 }), // 1h gueltig
    });

    if (!signedRes.ok) {
      return Response.json({ success: false, error: `Sign failed: ${signedRes.status}` });
    }

    const { signedURL } = await signedRes.json();
    const fullUrl = `${SUPABASE_URL}/storage/v1${signedURL}`;

    return Response.json({
      success: true,
      download_url: fullUrl,
      filename: `Antrag_${app.generated_antrag?.meta?.kennung || 'AdminPilot'}_${applicationId.substring(0, 8)}.pdf`,
    });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
