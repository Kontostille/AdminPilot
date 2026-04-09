// AdminPilot – OCR (optimiert: Base64 kommt direkt vom Client)
// Kein Supabase-Download nötig → viel schneller

export const config = {
  maxDuration: 60, // Max timeout (Pro plan: 60s, Hobby: 10s)
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  try {
    const { base64, media_type, file_name } = req.body;
    if (!base64) return res.status(400).json({ error: 'base64 image data required' });

    const PROMPT = `Analysiere dieses deutsche Dokument für einen Sozialleistungsantrag.

Bestimme den Dokumenttyp (personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, other) und extrahiere die relevanten Daten:
- personalausweis: full_name, birth_date (YYYY-MM-DD), address
- mietvertrag: monthly_rent (Kaltmiete Zahl), warm_rent (Warmmiete Zahl), address
- einkommensnachweis: gross_income (Brutto monatlich Zahl), net_income (Netto monatlich Zahl), employer
- rentenbescheid: monthly_pension (Bruttorente Zahl), net_pension (Nettorente Zahl), pension_type
- geburtsurkunde: child_name, birth_date (YYYY-MM-DD), parent_names (Array)
- kv_bescheinigung: insurance_type, monthly_premium (Zahl)
- kindergeld_bescheid: monthly_amount (Zahl), number_of_children (Zahl)
- other: document_type, summary

Antworte NUR mit JSON: {"doc_type": "...", "extracted": {...}}`;

    const contentType = (media_type || '').includes('pdf') ? 'document' : 'image';

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
          { type: contentType, source: { type: 'base64', media_type: media_type || 'image/jpeg', data: base64 } },
          { type: 'text', text: PROMPT },
        ]}],
      }),
    });

    if (!apiRes.ok) {
      const err = await apiRes.text();
      console.error('Claude API error:', err);
      return res.status(500).json({ error: 'Claude API error', details: err });
    }

    const result = await apiRes.json();
    const rawText = result.content?.[0]?.text || '{}';

    let parsed = { doc_type: 'other', extracted: {} };
    try {
      parsed = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      parsed = { doc_type: 'other', extracted: { raw_text: rawText } };
    }

    return res.status(200).json({ success: true, ...parsed });
  } catch (error) {
    console.error('OCR Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
