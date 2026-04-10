export const config = { runtime: 'edge' };

export default async function handler(request) {
  // CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'POST only' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({
      success: false,
      error: 'ANTHROPIC_API_KEY not configured',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON body',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const { base64, media_type, file_name } = body;

    if (!base64) {
      return new Response(JSON.stringify({
        success: false,
        error: 'base64 field is required',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const PROMPT = `Analysiere dieses deutsche Dokument für einen Sozialleistungsantrag. Bestimme den Dokumenttyp und extrahiere die relevanten Daten.

Mögliche Typen: personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, other

Extrahiere je nach Typ:
- personalausweis: full_name, birth_date, address
- mietvertrag: monthly_rent (Kaltmiete Zahl), warm_rent (Warmmiete Zahl), address
- einkommensnachweis: gross_income (Brutto Zahl), net_income (Netto Zahl), employer
- rentenbescheid: monthly_pension (Bruttorente Zahl), net_pension (Nettorente Zahl), pension_type
- geburtsurkunde: child_name, birth_date, parent_names
- kv_bescheinigung: insurance_type, monthly_premium (Zahl)
- kindergeld_bescheid: monthly_amount (Zahl), number_of_children (Zahl)
- other: document_type, summary

Antworte NUR mit JSON: {"doc_type": "...", "extracted": {...}}`;

    const isImage = !(media_type || '').includes('pdf');
    const contentBlock = isImage
      ? { type: 'image', source: { type: 'base64', media_type: media_type || 'image/jpeg', data: base64 } }
      : { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } };

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
        messages: [{
          role: 'user',
          content: [contentBlock, { type: 'text', text: PROMPT }],
        }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.text();
      return new Response(JSON.stringify({
        success: false,
        error: `Anthropic API ${apiRes.status}`,
        details: errBody.substring(0, 300),
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    const result = await apiRes.json();
    const rawText = (result.content && result.content[0] && result.content[0].text) || '{}';

    let parsed;
    try {
      const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { doc_type: 'other', extracted: { raw_text: rawText } };
    }

    return new Response(JSON.stringify({
      success: true,
      doc_type: parsed.doc_type || 'other',
      extracted: parsed.extracted || parsed,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
