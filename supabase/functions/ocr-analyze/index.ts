// AdminPilot – OCR Edge Function
// Analysiert Dokumente via Claude API und extrahiert strukturierte Daten
// Deploy: supabase functions deploy ocr-analyze

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Welche Daten je nach Dokumenttyp extrahiert werden sollen
const EXTRACTION_PROMPTS: Record<string, string> = {
  personalausweis: `Analysiere diesen Personalausweis/Reisepass und extrahiere:
    - full_name (Vor- und Nachname)
    - birth_date (Geburtsdatum, Format: YYYY-MM-DD)
    - address (Adresse falls vorhanden)
    - document_number (Ausweisnummer)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  mietvertrag: `Analysiere diesen Mietvertrag/Mietbescheinigung und extrahiere:
    - monthly_rent (Kaltmiete in Euro, nur Zahl)
    - warm_rent (Warmmiete in Euro, nur Zahl)
    - address (Mietadresse)
    - landlord (Vermieter Name)
    - move_in_date (Einzugsdatum, Format: YYYY-MM-DD falls vorhanden)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  einkommensnachweis: `Analysiere diese Gehaltsabrechnung/Einkommensnachweis und extrahiere:
    - gross_income (Bruttoeinkommen monatlich in Euro, nur Zahl)
    - net_income (Nettoeinkommen monatlich in Euro, nur Zahl)
    - employer (Arbeitgeber)
    - period (Abrechnungszeitraum)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  rentenbescheid: `Analysiere diesen Rentenbescheid und extrahiere:
    - monthly_pension (Monatliche Bruttorente in Euro, nur Zahl)
    - net_pension (Nettorente in Euro, nur Zahl)
    - pension_type (Art der Rente: Altersrente, Erwerbsminderungsrente, etc.)
    - insurance_number (Versicherungsnummer)
    - pension_start (Rentenbeginn, Format: YYYY-MM-DD falls vorhanden)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  geburtsurkunde: `Analysiere diese Geburtsurkunde und extrahiere:
    - child_name (Name des Kindes)
    - birth_date (Geburtsdatum, Format: YYYY-MM-DD)
    - birth_place (Geburtsort)
    - parent_names (Namen der Eltern als Array)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  kv_bescheinigung: `Analysiere diese Krankenversicherungsbescheinigung und extrahiere:
    - insurance_type (gesetzlich/privat/freiwillig gesetzlich)
    - insurance_company (Name der Krankenkasse/Versicherung)
    - monthly_premium (Monatlicher Beitrag in Euro, nur Zahl)
    - member_number (Versichertennummer)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  kindergeld_bescheid: `Analysiere diesen Kindergeld-Bescheid und extrahiere:
    - monthly_amount (Monatlicher Kindergeldbetrag in Euro, nur Zahl)
    - number_of_children (Anzahl Kinder)
    - children_names (Namen der Kinder als Array)
    - case_number (Aktenzeichen/Kindergeldnummer)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,

  other: `Analysiere dieses Dokument und extrahiere alle relevanten Informationen für einen Sozialleistungsantrag:
    - document_type (Was für ein Dokument ist das?)
    - key_data (Wichtigste Daten als Objekt)
    - summary (Kurze Zusammenfassung in einem Satz)
    Antworte NUR mit einem JSON-Objekt, kein anderer Text.`,
}

// Dokumenttyp anhand des Inhalts automatisch erkennen
const AUTO_DETECT_PROMPT = `Analysiere dieses Dokument und bestimme den Typ. Antworte NUR mit einem der folgenden Werte (genau so geschrieben):
personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, schulbescheinigung, other`

Deno.serve(async (req: Request) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { document_id, application_id } = await req.json()

    if (!document_id || !application_id) {
      return new Response(JSON.stringify({ error: 'document_id and application_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Supabase Client mit Service Role (bypasses RLS)
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // 1. Dokument-Info aus DB laden
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single()

    if (docError || !doc) {
      return new Response(JSON.stringify({ error: 'Document not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Status auf "processing" setzen
    await supabase
      .from('documents')
      .update({ ocr_status: 'processing' })
      .eq('id', document_id)

    // 2. Datei aus Storage herunterladen
    const { data: fileData, error: fileError } = await supabase
      .storage
      .from('documents')
      .download(doc.file_path)

    if (fileError || !fileData) {
      await supabase.from('documents').update({ ocr_status: 'failed' }).eq('id', document_id)
      return new Response(JSON.stringify({ error: 'File download failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Datei zu Base64 konvertieren
    const arrayBuffer = await fileData.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Medientyp bestimmen
    const fileName = doc.file_name.toLowerCase()
    let mediaType = 'image/jpeg'
    if (fileName.endsWith('.png')) mediaType = 'image/png'
    else if (fileName.endsWith('.pdf')) mediaType = 'application/pdf'
    else if (fileName.endsWith('.webp')) mediaType = 'image/webp'

    // 4. Schritt 1: Dokumenttyp automatisch erkennen
    const detectResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            { type: 'text', text: AUTO_DETECT_PROMPT },
          ],
        }],
      }),
    })

    const detectResult = await detectResponse.json()
    const detectedType = detectResult.content?.[0]?.text?.trim().toLowerCase() || 'other'

    // Validierten Typ setzen
    const validTypes = Object.keys(EXTRACTION_PROMPTS)
    const docType = validTypes.includes(detectedType) ? detectedType : 'other'

    // Dokumenttyp in DB aktualisieren
    await supabase.from('documents').update({ doc_type: docType }).eq('id', document_id)

    // 5. Schritt 2: Daten extrahieren
    const extractPrompt = EXTRACTION_PROMPTS[docType]
    const extractResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: { type: 'base64', media_type: mediaType, data: base64 },
            },
            { type: 'text', text: extractPrompt },
          ],
        }],
      }),
    })

    const extractResult = await extractResponse.json()
    const rawText = extractResult.content?.[0]?.text || '{}'

    // JSON parsen (Claude gibt manchmal Markdown-Backticks zurück)
    let ocrData = {}
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      ocrData = JSON.parse(cleaned)
    } catch {
      ocrData = { raw_text: rawText, parse_error: true }
    }

    // 6. Ergebnis in DB speichern
    await supabase
      .from('documents')
      .update({
        ocr_status: 'complete',
        ocr_result: { doc_type: docType, extracted: ocrData, processed_at: new Date().toISOString() },
      })
      .eq('id', document_id)

    // Status-Update für den Antrag
    await supabase.from('status_updates').insert({
      application_id,
      status: 'analyzing',
      message: `Dokument "${doc.file_name}" wurde analysiert (${docType}).`,
    })

    return new Response(JSON.stringify({
      success: true,
      doc_type: docType,
      extracted: ocrData,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('OCR Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
