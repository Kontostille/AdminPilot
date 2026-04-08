// AdminPilot – OCR Analyze (Vercel Serverless Function)
// Analysiert Dokumente via Claude API

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const AUTO_DETECT_PROMPT = `Analysiere dieses Dokument und bestimme den Typ. Antworte NUR mit einem der folgenden Werte:
personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, other`;

const EXTRACTION_PROMPTS = {
  personalausweis: `Extrahiere aus diesem Personalausweis: full_name, birth_date (YYYY-MM-DD), address, document_number. Antworte NUR mit JSON.`,
  mietvertrag: `Extrahiere aus diesem Mietvertrag: monthly_rent (Zahl), warm_rent (Zahl), address, landlord. Antworte NUR mit JSON.`,
  einkommensnachweis: `Extrahiere: gross_income (Brutto monatlich, Zahl), net_income (Netto monatlich, Zahl), employer. Antworte NUR mit JSON.`,
  rentenbescheid: `Extrahiere: monthly_pension (Bruttorente, Zahl), net_pension (Nettorente, Zahl), pension_type, insurance_number. Antworte NUR mit JSON.`,
  geburtsurkunde: `Extrahiere: child_name, birth_date (YYYY-MM-DD), birth_place, parent_names (Array). Antworte NUR mit JSON.`,
  kv_bescheinigung: `Extrahiere: insurance_type (gesetzlich/privat), insurance_company, monthly_premium (Zahl). Antworte NUR mit JSON.`,
  kindergeld_bescheid: `Extrahiere: monthly_amount (Zahl), number_of_children (Zahl), children_names (Array). Antworte NUR mit JSON.`,
  other: `Extrahiere alle relevanten Informationen: document_type, key_data, summary. Antworte NUR mit JSON.`,
};

async function callClaude(base64, mediaType, prompt) {
  const contentType = mediaType === 'application/pdf' ? 'document' : 'image';
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: [
        { type: contentType, source: { type: 'base64', media_type: mediaType, data: base64 } },
        { type: 'text', text: prompt },
      ]}],
    }),
  });
  return res.json();
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { document_id, application_id } = req.body;
    if (!document_id || !application_id) return res.status(400).json({ error: 'document_id and application_id required' });

    // 1. Dokument laden
    const { data: doc } = await supabase.from('documents').select('*').eq('id', document_id).single();
    if (!doc) return res.status(404).json({ error: 'Document not found' });

    await supabase.from('documents').update({ ocr_status: 'processing' }).eq('id', document_id);

    // 2. Datei herunterladen
    const { data: fileData } = await supabase.storage.from('documents').download(doc.file_path);
    if (!fileData) {
      await supabase.from('documents').update({ ocr_status: 'failed' }).eq('id', document_id);
      return res.status(500).json({ error: 'File download failed' });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const fileName = doc.file_name.toLowerCase();
    let mediaType = 'image/jpeg';
    if (fileName.endsWith('.png')) mediaType = 'image/png';
    else if (fileName.endsWith('.pdf')) mediaType = 'application/pdf';

    // 3. Dokumenttyp erkennen
    const detectResult = await callClaude(base64, mediaType, AUTO_DETECT_PROMPT);
    const detectedType = detectResult.content?.[0]?.text?.trim().toLowerCase() || 'other';
    const docType = Object.keys(EXTRACTION_PROMPTS).includes(detectedType) ? detectedType : 'other';

    await supabase.from('documents').update({ doc_type: docType }).eq('id', document_id);

    // 4. Daten extrahieren
    const extractResult = await callClaude(base64, mediaType, EXTRACTION_PROMPTS[docType]);
    const rawText = extractResult.content?.[0]?.text || '{}';

    let ocrData = {};
    try {
      ocrData = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch { ocrData = { raw_text: rawText, parse_error: true }; }

    // 5. Ergebnis speichern
    await supabase.from('documents').update({
      ocr_status: 'complete',
      ocr_result: { doc_type: docType, extracted: ocrData, processed_at: new Date().toISOString() },
    }).eq('id', document_id);

    await supabase.from('status_updates').insert({
      application_id, status: 'analyzing',
      message: `Dokument "${doc.file_name}" analysiert (${docType}).`,
    });

    return res.status(200).json({ success: true, doc_type: docType, extracted: ocrData });
  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
