// AdminPilot – OCR Analyze (optimiert: 1 API-Call statt 2)
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// EIN Prompt der beides macht: Typ erkennen + Daten extrahieren
const COMBINED_PROMPT = `Analysiere dieses deutsche Dokument für einen Sozialleistungsantrag.

Schritt 1: Bestimme den Dokumenttyp. Mögliche Typen: personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, other

Schritt 2: Extrahiere die relevanten Daten je nach Typ:
- personalausweis: full_name, birth_date (YYYY-MM-DD), address
- mietvertrag: monthly_rent (Kaltmiete Zahl), warm_rent (Warmmiete Zahl), address
- einkommensnachweis: gross_income (Brutto monatlich Zahl), net_income (Netto monatlich Zahl), employer
- rentenbescheid: monthly_pension (Bruttorente Zahl), net_pension (Nettorente Zahl), pension_type
- geburtsurkunde: child_name, birth_date (YYYY-MM-DD), parent_names (Array)
- kv_bescheinigung: insurance_type (gesetzlich/privat), monthly_premium (Zahl)
- kindergeld_bescheid: monthly_amount (Zahl), number_of_children (Zahl)
- other: document_type, summary

Antworte NUR mit diesem JSON-Format, kein anderer Text:
{"doc_type": "...", "extracted": {...}}`;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { document_id, application_id } = req.body;
    if (!document_id || !application_id) return res.status(400).json({ error: 'document_id and application_id required' });

    const { data: doc } = await supabase.from('documents').select('*').eq('id', document_id).single();
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    await supabase.from('documents').update({ ocr_status: 'processing' }).eq('id', document_id);

    // Datei herunterladen
    const { data: fileData } = await supabase.storage.from('documents').download(doc.file_path);
    if (!fileData) {
      await supabase.from('documents').update({ ocr_status: 'failed' }).eq('id', document_id);
      return res.status(500).json({ error: 'File download failed' });
    }

    const base64 = Buffer.from(await fileData.arrayBuffer()).toString('base64');
    const fileName = doc.file_name.toLowerCase();
    let mediaType = 'image/jpeg';
    if (fileName.endsWith('.png')) mediaType = 'image/png';
    else if (fileName.endsWith('.pdf')) mediaType = 'application/pdf';

    // EIN API-Call für alles (statt vorher 2)
    const contentType = mediaType === 'application/pdf' ? 'document' : 'image';
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{ role: 'user', content: [
          { type: contentType, source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: COMBINED_PROMPT },
        ]}],
      }),
    });

    const result = await apiRes.json();
    const rawText = result.content?.[0]?.text || '{}';

    let parsed = { doc_type: 'other', extracted: {} };
    try {
      parsed = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      parsed = { doc_type: 'other', extracted: { raw_text: rawText, parse_error: true } };
    }

    // Ergebnis speichern
    await supabase.from('documents').update({
      doc_type: parsed.doc_type || 'other',
      ocr_status: 'complete',
      ocr_result: { ...parsed, processed_at: new Date().toISOString() },
    }).eq('id', document_id);

    return res.status(200).json({ success: true, ...parsed });
  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
