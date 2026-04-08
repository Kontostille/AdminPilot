// AdminPilot – Anspruchsberechnung Edge Function
// Berechnet mögliche Leistungen basierend auf OCR-Ergebnissen
// Deploy: supabase functions deploy calculate-benefits

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Berechnungslogik pro Leistung (vereinfacht, allgemeine Regeln)
function calculateWohngeld(income: number, rent: number, householdSize: number): number {
  // Vereinfachte Wohngeld-Berechnung (Tabellenwerte 2026)
  const maxRent: Record<number, number> = { 1: 522, 2: 633, 3: 755, 4: 909, 5: 1041 }
  const maxR = maxRent[Math.min(householdSize, 5)] || 522
  const cappedRent = Math.min(rent, maxR)
  const factor = Math.max(0, 1 - (income / (householdSize * 1200)))
  return Math.round(Math.max(0, cappedRent * factor * 0.6))
}

function calculateKinderzuschlag(income: number, childCount: number): number {
  if (childCount === 0) return 0
  const minIncome = 900 // Paare
  const maxIncome = 2500
  if (income < minIncome || income > maxIncome) return 0
  const perChild = Math.round(Math.max(0, 292 - Math.max(0, (income - 1500) * 0.1)))
  return perChild * childCount
}

function calculateKVZuschuss(grossPension: number): number {
  return Math.round(grossPension * 0.0875)
}

function calculateBasiselterngeld(netIncome: number): number {
  if (netIncome <= 0) return 300 // Minimum
  const rate = netIncome < 1000 ? 0.67 + (1000 - netIncome) * 0.001 : 0.65
  return Math.round(Math.min(1800, Math.max(300, netIncome * rate)))
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { application_id } = await req.json()

    if (!application_id) {
      return new Response(JSON.stringify({ error: 'application_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Antrag laden
    const { data: app } = await supabase.from('applications').select('*').eq('id', application_id).single()
    if (!app) {
      return new Response(JSON.stringify({ error: 'Application not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Alle Dokumente mit OCR-Ergebnissen laden
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .eq('application_id', application_id)
      .eq('ocr_status', 'complete')

    if (!docs || docs.length === 0) {
      return new Response(JSON.stringify({ error: 'No analyzed documents found' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Daten aus allen Dokumenten zusammenführen
    let income = 0
    let pension = 0
    let rent = 0
    let childCount = 0
    let householdSize = 1

    for (const doc of docs) {
      const extracted = doc.ocr_result?.extracted || {}
      if (extracted.net_income) income = Number(extracted.net_income) || income
      if (extracted.gross_income) income = income || (Number(extracted.gross_income) * 0.7)
      if (extracted.monthly_pension) pension = Number(extracted.monthly_pension) || pension
      if (extracted.net_pension) income = Number(extracted.net_pension) || income
      if (extracted.warm_rent) rent = Number(extracted.warm_rent) || rent
      if (extracted.monthly_rent) rent = rent || Number(extracted.monthly_rent)
      if (extracted.number_of_children) childCount = Number(extracted.number_of_children) || childCount
      if (extracted.child_name) childCount = Math.max(childCount, 1)
    }

    // Haushaltsgröße schätzen
    householdSize = 1 + childCount + (childCount > 0 ? 1 : 0) // +Partner wenn Kinder

    // Leistung berechnen basierend auf Antragstyp
    let estimatedMonthly = 0
    let confidence = 'mittel'
    let details: Record<string, any> = {}

    switch (app.leistung_id) {
      case 'wohngeld': {
        const effectiveIncome = income || pension || 0
        estimatedMonthly = calculateWohngeld(effectiveIncome, rent, householdSize)
        details = { income: effectiveIncome, rent, householdSize }
        confidence = (income > 0 || pension > 0) && rent > 0 ? 'hoch' : 'niedrig'
        break
      }
      case 'kindergeld': {
        estimatedMonthly = childCount * 250
        details = { childCount }
        confidence = childCount > 0 ? 'hoch' : 'niedrig'
        break
      }
      case 'kinderzuschlag': {
        estimatedMonthly = calculateKinderzuschlag(income, childCount)
        details = { income, childCount }
        confidence = income > 0 && childCount > 0 ? 'hoch' : 'niedrig'
        break
      }
      case 'kv-zuschuss': {
        estimatedMonthly = calculateKVZuschuss(pension || income)
        details = { grossPension: pension || income }
        confidence = pension > 0 ? 'hoch' : 'mittel'
        break
      }
      case 'basiselterngeld': {
        estimatedMonthly = calculateBasiselterngeld(income)
        details = { netIncome: income }
        confidence = income > 0 ? 'hoch' : 'mittel'
        break
      }
      case 'kindererziehungszeiten': {
        estimatedMonthly = childCount * 33 * 3 // ~33€ pro Entgeltpunkt, 3 Jahre pro Kind
        details = { childCount }
        confidence = childCount > 0 ? 'mittel' : 'niedrig'
        break
      }
      case 'em-rentenzuschlag': {
        estimatedMonthly = Math.round(pension * 0.1) // Grobe Schätzung
        details = { pension }
        confidence = 'niedrig'
        break
      }
      case 'bildung-teilhabe': {
        estimatedMonthly = Math.round(195 / 12) + (childCount * 15) // Schulbedarf + Teilhabe
        details = { childCount }
        confidence = childCount > 0 ? 'mittel' : 'niedrig'
        break
      }
      default:
        estimatedMonthly = 0
        confidence = 'niedrig'
    }

    // Ergebnis in DB speichern
    await supabase.from('applications').update({
      status: 'analysis_complete',
      estimated_monthly: estimatedMonthly,
      confidence,
      notes: JSON.stringify(details),
      updated_at: new Date().toISOString(),
    }).eq('id', application_id)

    await supabase.from('status_updates').insert({
      application_id,
      status: 'analysis_complete',
      message: `Analyse abgeschlossen. Geschätzter möglicher Anspruch: ~${estimatedMonthly} €/Monat (Konfidenz: ${confidence}).`,
    })

    return new Response(JSON.stringify({
      success: true,
      estimated_monthly: estimatedMonthly,
      confidence,
      details,
      leistung: app.leistung_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Calculation Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
