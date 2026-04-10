/* AdminPilot – Anspruchsberechnung (Client-seitig)
   Reine Mathematik, kein API-Call nötig */

export function calculateBenefitsFromDocs(leistungId, ocrResults) {
  // Daten aus allen OCR-Ergebnissen zusammenführen
  let income = 0, pension = 0, rent = 0, childCount = 0;

  for (const ocr of ocrResults) {
    const e = ocr.extracted || {};
    if (e.net_income) income = Number(e.net_income) || income;
    if (e.gross_income && !income) income = Math.round((Number(e.gross_income) || 0) * 0.7);
    if (e.monthly_pension) pension = Number(e.monthly_pension) || pension;
    if (e.net_pension && !income) income = Number(e.net_pension) || income;
    if (e.warm_rent) rent = Number(e.warm_rent) || rent;
    if (e.monthly_rent && !rent) rent = Number(e.monthly_rent) || 0;
    if (e.number_of_children) childCount = Number(e.number_of_children) || childCount;
    if (e.child_name) childCount = Math.max(childCount, 1);
  }

  const effectiveIncome = income || pension;
  const householdSize = 1 + childCount + (childCount > 0 ? 1 : 0);

  let estimated = 0;
  let confidence = 'niedrig';
  let details = {};

  switch (leistungId) {
    case 'wohngeld': {
      const maxRent = { 1: 522, 2: 633, 3: 755, 4: 909, 5: 1041 };
      const maxR = maxRent[Math.min(householdSize, 5)] || 522;
      const factor = Math.max(0, 1 - (effectiveIncome / (householdSize * 1200)));
      estimated = Math.round(Math.max(0, Math.min(rent, maxR) * factor * 0.6));
      details = { income: effectiveIncome, rent, householdSize };
      confidence = effectiveIncome && rent ? 'hoch' : 'niedrig';
      break;
    }
    case 'kindergeld':
      estimated = childCount * 250;
      details = { childCount };
      confidence = childCount > 0 ? 'hoch' : 'niedrig';
      break;
    case 'kinderzuschlag': {
      if (effectiveIncome >= 900 && effectiveIncome <= 2500 && childCount > 0) {
        estimated = Math.round(Math.max(0, 292 - Math.max(0, (effectiveIncome - 1500) * 0.1))) * childCount;
      }
      details = { income: effectiveIncome, childCount };
      confidence = effectiveIncome && childCount ? 'hoch' : 'niedrig';
      break;
    }
    case 'kv-zuschuss':
      estimated = Math.round((pension || effectiveIncome) * 0.0875);
      details = { grossPension: pension || effectiveIncome };
      confidence = pension ? 'hoch' : 'mittel';
      break;
    case 'basiselterngeld':
      estimated = Math.round(Math.min(1800, Math.max(300, effectiveIncome * 0.65)));
      details = { netIncome: effectiveIncome };
      confidence = effectiveIncome ? 'hoch' : 'mittel';
      break;
    case 'kindererziehungszeiten':
      estimated = childCount * 99;
      details = { childCount };
      confidence = childCount ? 'mittel' : 'niedrig';
      break;
    case 'em-rentenzuschlag':
      estimated = Math.round(pension * 0.1);
      details = { pension };
      confidence = 'niedrig';
      break;
    case 'bildung-teilhabe':
      estimated = Math.round(195 / 12) + (childCount * 15);
      details = { childCount };
      confidence = childCount ? 'mittel' : 'niedrig';
      break;
    default:
      estimated = 0;
  }

  return { estimated_monthly: estimated, confidence, details };
}
