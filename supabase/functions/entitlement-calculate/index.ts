// ============================================================================
// entitlement-calculate
// ============================================================================
// Berechnet eine UNVERBINDLICHE Anspruchsschätzung für eine Application
// basierend auf den extrahierten Daten aus allen zugeordneten Dokumenten.
//
// WICHTIG: Alle Ergebnisse sind Schätzungen. Die Berechnungsformeln sind
// vereinfacht und dienen nur als Orientierung. Die echte Entscheidung
// liegt bei der Behörde.
//
// Input:  { application_id: uuid }
// Output: { success: boolean, estimate?: object, error?: string }
// ============================================================================

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// --- Reference values 2026 (approximate, for estimation only) ---

const GRUNDSICHERUNG_REGELSATZ_2026 = 563; // Regelbedarfsstufe 1 (Alleinstehend)
const GRUNDSICHERUNG_FREIBETRAG_VERMOEGEN = 10000;

const PFLEGEGELD_2026: Record<number, number> = {
  2: 347,
  3: 599,
  4: 800,
  5: 990,
};

// Wohngeld is complex (depends on Mietstufe 1-7, household size, income).
// We use a simplified model. Real values should come from a lookup table.
const WOHNGELD_MAX_BY_HOUSEHOLD: Record<number, number> = {
  1: 380,
  2: 455,
  3: 540,
  4: 625,
  5: 710,
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { application_id } = await req.json();
    if (!application_id) return json({ error: 'application_id required' }, 400);

    // 1. Load application
    const { data: app, error: appErr } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (appErr || !app) return json({ error: 'application not found' }, 404);

    // 2. Load documents with their extracted data
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', application_id)
      .eq('ocr_status', 'done');

    if (!docs || docs.length === 0) {
      return json({ error: 'no analyzed documents yet' }, 400);
    }

    // 3. Aggregate by category
    const byCategory: Record<string, any> = {};
    for (const d of docs) {
      byCategory[d.category] = d.extracted_data;
    }

    // 4. Run calculation based on benefit type
    let estimate: CalculationResult;

    switch (app.benefit_type) {
      case 'grundsicherung':
        estimate = calcGrundsicherung(byCategory);
        break;
      case 'wohngeld':
        estimate = calcWohngeld(byCategory);
        break;
      case 'pflegegeld':
        estimate = calcPflegegeld(byCategory);
        break;
      default:
        return json({ error: 'unknown benefit_type' }, 400);
    }

    // 5. Update application
    await supabase
      .from('applications')
      .update({
        status: 'analyzed',
        estimated_amount_monthly: estimate.amount_monthly,
        estimate_calculation: estimate,
      })
      .eq('id', application_id);

    // 6. Log audit event
    await supabase.from('status_events').insert({
      user_id: app.user_id,
      application_id,
      event_type: 'estimate_calculated',
      from_status: 'analyzing',
      to_status: 'analyzed',
      actor: 'system',
      metadata: { estimate },
    });

    return json({ success: true, estimate });
  } catch (err) {
    console.error('Calculation error:', err);
    return json({ error: String(err) }, 500);
  }
});

// ----------------------------------------------------------------------------
// Calculation logic
// ----------------------------------------------------------------------------

interface CalculationResult {
  benefit_type: string;
  amount_monthly: number | null;
  calculation_steps: Array<{ label: string; value: any; note?: string }>;
  confidence: 'low' | 'medium' | 'high';
  disclaimer: string;
  missing_documents?: string[];
}

const STANDARD_DISCLAIMER =
  'Dies ist eine unverbindliche Schätzung auf Basis vereinfachter Annahmen. ' +
  'Die tatsächliche Bewilligung hängt von der Prüfung durch die zuständige ' +
  'Behörde ab.';

function num(v: any): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function calcGrundsicherung(d: Record<string, any>): CalculationResult {
  const rente = d.rentenbescheid || {};
  const miete = d.mietvertrag || {};

  const monthly_net_income = num(rente.monthly_amount_net) || num(rente.monthly_amount_gross);
  const warm_rent = num(miete.monthly_warm_rent) ||
                    (num(miete.monthly_cold_rent) + num(miete.monthly_utilities) + num(miete.monthly_heating));

  // Vereinfachter Bedarf = Regelsatz + angemessene KdU
  const bedarf = GRUNDSICHERUNG_REGELSATZ_2026 + warm_rent;
  const differenz = bedarf - monthly_net_income;

  const amount_monthly = differenz > 0 ? Math.round(differenz) : 0;

  const missing: string[] = [];
  if (!d.rentenbescheid) missing.push('Rentenbescheid');
  if (!d.mietvertrag) missing.push('Mietvertrag');
  if (!d.kontoauszug) missing.push('Kontoauszug (für Vermögensprüfung)');

  return {
    benefit_type: 'grundsicherung',
    amount_monthly,
    calculation_steps: [
      { label: 'Regelbedarfssatz (Alleinstehend)', value: GRUNDSICHERUNG_REGELSATZ_2026, note: 'Referenzwert 2026' },
      { label: 'Kosten der Unterkunft (warm)', value: warm_rent },
      { label: 'Gesamtbedarf', value: bedarf },
      { label: 'Monatliches Nettoeinkommen', value: monthly_net_income },
      { label: 'Differenz (möglicher Anspruch)', value: amount_monthly },
    ],
    confidence: missing.length === 0 ? 'medium' : 'low',
    disclaimer: STANDARD_DISCLAIMER,
    missing_documents: missing.length ? missing : undefined,
  };
}

function calcWohngeld(d: Record<string, any>): CalculationResult {
  const miete = d.mietvertrag || {};
  const income = d.einkommensnachweis || d.rentenbescheid || {};

  const monthly_income = num(income.net_monthly) ||
                          num(income.monthly_amount_net) ||
                          num(income.monthly_amount_gross);
  const warm_rent = num(miete.monthly_warm_rent) ||
                    (num(miete.monthly_cold_rent) + num(miete.monthly_utilities) + num(miete.monthly_heating));

  // Sehr vereinfachte Schätzung: häufig 15–30 % der Warmmiete werden erstattet,
  // wenn das Einkommen unter einer bestimmten Schwelle liegt.
  // Dies ist NUR eine grobe Orientierung.
  const household_size = 1; // default; echte Logik müsste aus User-Profil kommen
  const max_zuschuss = WOHNGELD_MAX_BY_HOUSEHOLD[household_size] ?? 380;

  let amount_monthly = 0;
  const einkommensgrenze = 1500; // grobe Schwelle für 1-Personen-Haushalt
  if (monthly_income < einkommensgrenze) {
    // Je niedriger das Einkommen relativ zur Warmmiete, desto höher der Zuschuss
    const ratio = monthly_income / (warm_rent * 3);
    amount_monthly = Math.round(max_zuschuss * Math.max(0, 1 - ratio));
  }

  const missing: string[] = [];
  if (!d.mietvertrag) missing.push('Mietvertrag');
  if (!d.einkommensnachweis && !d.rentenbescheid) missing.push('Einkommensnachweis');

  return {
    benefit_type: 'wohngeld',
    amount_monthly: amount_monthly > 0 ? amount_monthly : null,
    calculation_steps: [
      { label: 'Warmmiete', value: warm_rent },
      { label: 'Monatliches Einkommen', value: monthly_income },
      { label: 'Haushaltsgröße angenommen', value: household_size, note: 'aus Profil ableiten' },
      { label: 'Maximaler Richtwert', value: max_zuschuss },
      { label: 'Geschätzter Zuschuss', value: amount_monthly },
    ],
    confidence: 'low',
    disclaimer: STANDARD_DISCLAIMER +
      ' Die Wohngeldberechnung ist komplex und hängt u.a. von der Mietstufe Ihrer Stadt ab. ' +
      'Diese Schätzung ist sehr vereinfacht.',
    missing_documents: missing.length ? missing : undefined,
  };
}

function calcPflegegeld(d: Record<string, any>): CalculationResult {
  const gutachten = d.pflegegutachten || {};
  const pflegegrad = gutachten.pflegegrad ? Number(gutachten.pflegegrad) : null;

  const amount_monthly = pflegegrad && PFLEGEGELD_2026[pflegegrad]
    ? PFLEGEGELD_2026[pflegegrad]
    : null;

  const missing: string[] = [];
  if (!pflegegrad) missing.push('Pflegegutachten oder Bescheid über Pflegegrad');
  if (!d.versicherungskarte) missing.push('Versicherungskarte');

  return {
    benefit_type: 'pflegegeld',
    amount_monthly,
    calculation_steps: [
      { label: 'Anerkannter Pflegegrad', value: pflegegrad ?? 'unbekannt' },
      { label: 'Regelsatz Pflegegeld', value: amount_monthly ?? '–', note: 'Richtwert 2026' },
    ],
    confidence: pflegegrad ? 'high' : 'low',
    disclaimer: STANDARD_DISCLAIMER +
      ' Ohne anerkannten Pflegegrad muss zunächst dieser bei der Pflegekasse beantragt werden.',
    missing_documents: missing.length ? missing : undefined,
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
