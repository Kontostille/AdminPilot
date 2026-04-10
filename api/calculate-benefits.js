export const config = { runtime: 'edge' };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'PATCH' ? 'return=representation' : 'return=representation',
      ...options.headers,
    },
  });
  return res.json();
}

function calcWohngeld(income, rent, size) {
  const maxRent = { 1: 522, 2: 633, 3: 755, 4: 909, 5: 1041 };
  const maxR = maxRent[Math.min(size, 5)] || 522;
  const factor = Math.max(0, 1 - (income / (size * 1200)));
  return Math.round(Math.max(0, Math.min(rent, maxR) * factor * 0.6));
}

export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  try {
    const { application_id } = await request.json();
    if (!application_id) return Response.json({ error: 'application_id required' }, { status: 400 });

    const apps = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    const app = apps?.[0];
    if (!app) return Response.json({ error: 'Not found' }, { status: 404 });

    const docs = await supaFetch(`documents?application_id=eq.${application_id}&ocr_status=eq.complete&select=*`);

    let income = 0, pension = 0, rent = 0, childCount = 0, householdSize = 1;
    for (const doc of (docs || [])) {
      const e = doc.ocr_result?.extracted || {};
      if (e.net_income) income = Number(e.net_income) || income;
      if (e.gross_income && !income) income = (Number(e.gross_income) || 0) * 0.7;
      if (e.monthly_pension) pension = Number(e.monthly_pension) || pension;
      if (e.net_pension && !income) income = Number(e.net_pension) || income;
      if (e.warm_rent) rent = Number(e.warm_rent) || rent;
      if (e.monthly_rent && !rent) rent = Number(e.monthly_rent) || 0;
      if (e.number_of_children) childCount = Number(e.number_of_children) || childCount;
      if (e.child_name) childCount = Math.max(childCount, 1);
    }
    householdSize = 1 + childCount + (childCount > 0 ? 1 : 0);

    let estimated = 0, confidence = 'niedrig', details = {};
    const effectiveIncome = income || pension;

    switch (app.leistung_id) {
      case 'wohngeld':
        estimated = calcWohngeld(effectiveIncome, rent, householdSize);
        details = { income: effectiveIncome, rent, householdSize };
        confidence = effectiveIncome && rent ? 'hoch' : 'niedrig'; break;
      case 'kindergeld':
        estimated = childCount * 250; details = { childCount };
        confidence = childCount > 0 ? 'hoch' : 'niedrig'; break;
      case 'kinderzuschlag':
        const kz = Math.round(Math.max(0, 292 - Math.max(0, (effectiveIncome - 1500) * 0.1))) * childCount;
        estimated = effectiveIncome >= 900 && effectiveIncome <= 2500 ? kz : 0;
        details = { income: effectiveIncome, childCount };
        confidence = effectiveIncome && childCount ? 'hoch' : 'niedrig'; break;
      case 'kv-zuschuss':
        estimated = Math.round((pension || effectiveIncome) * 0.0875);
        confidence = pension ? 'hoch' : 'mittel'; break;
      case 'basiselterngeld':
        estimated = Math.round(Math.min(1800, Math.max(300, effectiveIncome * 0.65)));
        confidence = effectiveIncome ? 'hoch' : 'mittel'; break;
      case 'kindererziehungszeiten':
        estimated = childCount * 99; confidence = childCount ? 'mittel' : 'niedrig'; break;
      case 'em-rentenzuschlag':
        estimated = Math.round(pension * 0.1); confidence = 'niedrig'; break;
      case 'bildung-teilhabe':
        estimated = Math.round(195 / 12) + (childCount * 15); confidence = childCount ? 'mittel' : 'niedrig'; break;
    }

    // Update application
    await supaFetch(`applications?id=eq.${application_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'analysis_complete', estimated_monthly: estimated,
        confidence, notes: JSON.stringify(details), updated_at: new Date().toISOString(),
      }),
    });

    // Insert status update
    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id, status: 'analysis_complete',
        message: `Analyse: ~${estimated} €/Monat (${confidence}).`,
      }),
    });

    return Response.json({ success: true, estimated_monthly: estimated, confidence, details });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 200 });
  }
}
