// Edge Runtime = 30s Timeout auf Hobby (statt 10s bei Node.js)
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' },
    });
  }

  try {
    const { base64, media_type, file_name } = await request.json();
    if (!base64) return Response.json({ error: 'base64 required' }, { status: 400 });

    const PROMPT = `Analysiere dieses deutsche Dokument für einen Sozialleistungsantrag.
Bestimme den Dokumenttyp (personalausweis, mietvertrag, einkommensnachweis, rentenbescheid, geburtsurkunde, kv_bescheinigung, kindergeld_bescheid, other) und extrahiere die relevanten Daten:
- personalausweis: full_name, birth_date (YYYY-MM-DD), address
- mietvertrag: monthly_rent (Kaltmiete Zahl), warm_rent (Warmmiete Zahl), address
- einkommensnachweis: gross_income (Brutto monatlich Zahl), net_income (Netto monatlich Zahl), employer
- rentenbescheid: monthly_pension (Bruttorente Zahl), net_pension (Nettorente Zahl), pension_type
- geburtsurkunde: child_name, birth_date (YYYY-MM-DD), parent_names
- kv_bescheinigung: insurance_type, monthly_premium (Zahl)
- kindergeld_bescheid: monthly_amount (Zahl), number_of_children (Zahl)
- other: document_type, summary
Antworte NUR mit JSON: {"doc_type": "...", "extracted": {...}}`;

    const contentType = (media_type || '').includes('pdf') ? 'document' : 'image';

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
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
      const errText = await apiRes.text();
      return Response.json({ success: false, error: `Claude API ${apiRes.status}: ${errText.substring(0, 200)}` }, { status: 200 });
    }

    const result = await apiRes.json();
    const rawText = result.content?.[0]?.text || '{}';

    let parsed = { doc_type: 'other', extracted: {} };
    try {
      parsed = JSON.parse(rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
    } catch {
      parsed = { doc_type: 'other', extracted: { raw_text: rawText } };
    }

    return Response.json({ success: true, ...parsed });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 200 });
  }
}
