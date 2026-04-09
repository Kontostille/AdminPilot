export const config = { maxDuration: 60 };
// AdminPilot – Anspruchsberechnung (Vercel Serverless Function)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function calcWohngeld(income, rent, size) {
  const maxRent = { 1: 522, 2: 633, 3: 755, 4: 909, 5: 1041 };
  const maxR = maxRent[Math.min(size, 5)] || 522;
  const factor = Math.max(0, 1 - (income / (size * 1200)));
  return Math.round(Math.max(0, Math.min(rent, maxR) * factor * 0.6));
}

function calcKinderzuschlag(income, kids) {
  if (kids === 0 || income < 900 || income > 2500) return 0;
  return Math.round(Math.max(0, 292 - Math.max(0, (income - 1500) * 0.1))) * kids;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { application_id } = req.body;
    if (!application_id) return res.status(400).json({ error: 'application_id required' });

    const { data: app } = await supabase.from('applications').select('*').eq('id', application_id).single();
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const { data: docs } = await supabase.from('documents').select('*')
      .eq('application_id', application_id).eq('ocr_status', 'complete');

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
    let estimated = 0, confidence = 'mittel', details = {};

    switch (app.leistung_id) {
      case 'wohngeld':
        estimated = calcWohngeld(income || pension, rent, householdSize);
        details = { income: income || pension, rent, householdSize };
        confidence = (income || pension) && rent ? 'hoch' : 'niedrig'; break;
      case 'kindergeld':
        estimated = childCount * 250; details = { childCount };
        confidence = childCount > 0 ? 'hoch' : 'niedrig'; break;
      case 'kinderzuschlag':
        estimated = calcKinderzuschlag(income, childCount);
        details = { income, childCount };
        confidence = income && childCount ? 'hoch' : 'niedrig'; break;
      case 'kv-zuschuss':
        estimated = Math.round((pension || income) * 0.0875);
        details = { grossPension: pension || income };
        confidence = pension ? 'hoch' : 'mittel'; break;
      case 'basiselterngeld':
        const rate = income < 1000 ? 0.67 : 0.65;
        estimated = Math.round(Math.min(1800, Math.max(300, income * rate)));
        details = { netIncome: income }; confidence = income ? 'hoch' : 'mittel'; break;
      case 'kindererziehungszeiten':
        estimated = childCount * 99; details = { childCount };
        confidence = childCount ? 'mittel' : 'niedrig'; break;
      case 'em-rentenzuschlag':
        estimated = Math.round(pension * 0.1); details = { pension };
        confidence = 'niedrig'; break;
      case 'bildung-teilhabe':
        estimated = Math.round(195 / 12) + (childCount * 15);
        details = { childCount }; confidence = childCount ? 'mittel' : 'niedrig'; break;
    }

    await supabase.from('applications').update({
      status: 'analysis_complete', estimated_monthly: estimated,
      confidence, notes: JSON.stringify(details), updated_at: new Date().toISOString(),
    }).eq('id', application_id);

    await supabase.from('status_updates').insert({
      application_id, status: 'analysis_complete',
      message: `Analyse abgeschlossen: ~${estimated} €/Monat (Konfidenz: ${confidence}).`,
    });

    return res.status(200).json({ success: true, estimated_monthly: estimated, confidence, details });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
