// ============================================================================
// ocr-analyze
// ============================================================================
// Extrahiert strukturierte Daten aus hochgeladenen Dokumenten mit Claude
// Vision. Wird automatisch nach Upload eines Dokuments getriggert.
//
// Input:  { document_id: uuid }
// Output: { success: boolean, extracted_data?: object, error?: string }
// ============================================================================

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.30.0';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY')!,
});

const EXTRACTION_PROMPTS: Record<string, string> = {
  rentenbescheid: `Analysiere diesen Rentenbescheid und gib die Daten als JSON zurück. Felder:
- monthly_amount_gross (Zahl, Bruttomonatsbetrag in Euro)
- monthly_amount_net (Zahl, Nettomonatsbetrag in Euro, wenn sichtbar)
- pension_type (string, z.B. "Altersrente", "Erwerbsminderungsrente")
- start_date (YYYY-MM-DD)
- pension_fund_name (string, Name der Rentenversicherung)
- issue_date (YYYY-MM-DD, Datum des Bescheids)

Gib NUR das JSON-Objekt zurück, keine Erklärung. Wenn ein Feld nicht sichtbar ist, setze null.`,

  mietvertrag: `Analysiere diesen Mietvertrag und gib die Daten als JSON zurück. Felder:
- monthly_cold_rent (Zahl, Kaltmiete in Euro)
- monthly_utilities (Zahl, Nebenkosten in Euro, wenn getrennt ausgewiesen)
- monthly_heating (Zahl, Heizkosten in Euro, wenn getrennt ausgewiesen)
- monthly_warm_rent (Zahl, Warmmiete in Euro)
- apartment_size_sqm (Zahl, Wohnfläche in Quadratmetern)
- apartment_address (string)
- landlord_name (string)
- contract_start_date (YYYY-MM-DD)

Gib NUR das JSON-Objekt zurück. Bei fehlenden Feldern: null.`,

  kontoauszug: `Analysiere diesen Kontoauszug und gib die Daten als JSON zurück. Felder:
- account_holder (string)
- account_iban (string, IBAN)
- bank_name (string)
- statement_start_date (YYYY-MM-DD)
- statement_end_date (YYYY-MM-DD)
- opening_balance (Zahl)
- closing_balance (Zahl)
- recurring_incomes (Array von {description, amount}, nur regelmäßige Eingänge)
- notable_outgoings (Array von {description, amount}, hohe oder auffällige Abgänge)

Gib NUR das JSON-Objekt zurück. Bei fehlenden Feldern: null.`,

  einkommensnachweis: `Analysiere diesen Einkommensnachweis und gib die Daten als JSON zurück. Felder:
- employer_name (string)
- gross_monthly (Zahl, Bruttomonatslohn)
- net_monthly (Zahl, Nettomonatslohn)
- position (string, Jobtitel wenn sichtbar)
- period (string, Abrechnungsmonat)

Gib NUR das JSON-Objekt zurück. Bei fehlenden Feldern: null.`,

  pflegegutachten: `Analysiere dieses Pflegegutachten und gib die Daten als JSON zurück. Felder:
- pflegegrad (Zahl 1-5 oder null)
- gutachten_date (YYYY-MM-DD)
- assessed_person (string, Name der begutachteten Person)
- main_impairments (Array von Strings, wichtigste Einschränkungen)
- recommendation (string, Empfehlung des Gutachters)

Gib NUR das JSON-Objekt zurück. Bei fehlenden Feldern: null.`,

  versicherungskarte: `Analysiere diese Versicherungskarte und gib die Daten als JSON zurück. Felder:
- insurance_name (string, Name der Versicherung/Krankenkasse)
- insurance_number (string, Versichertennummer)
- insured_name (string)
- date_of_birth (YYYY-MM-DD)

Gib NUR das JSON-Objekt zurück. Bei fehlenden Feldern: null.`,

  sonstiges: `Analysiere dieses Dokument und extrahiere die wichtigsten Informationen als JSON. Versuche zu erkennen, um welche Art von Dokument es sich handelt (z.B. Bescheid, Rechnung, Bescheinigung), und liefere die wichtigsten Felder als flaches JSON-Objekt. Gib NUR das JSON zurück.`,
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { document_id } = await req.json();
    if (!document_id) {
      return json({ error: 'document_id required' }, 400);
    }

    // 1. Load document metadata
    const { data: doc, error: docErr } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (docErr || !doc) return json({ error: 'document not found' }, 404);

    // 2. Mark as processing
    await supabase
      .from('documents')
      .update({ ocr_status: 'processing' })
      .eq('id', document_id);

    // 3. Get signed URL for the file
    const { data: signed, error: signErr } = await supabase
      .storage
      .from('user-documents')
      .createSignedUrl(doc.storage_path, 60); // 1 min lifetime

    if (signErr || !signed) {
      await markFailed(document_id, 'signed_url_failed');
      return json({ error: 'could not create signed URL' }, 500);
    }

    // 4. Fetch image bytes, convert to base64
    const imgRes = await fetch(signed.signedUrl);
    const buf = new Uint8Array(await imgRes.arrayBuffer());
    const b64 = btoa(String.fromCharCode(...buf));
    const mediaType = doc.mime_type || 'image/jpeg';

    // 5. Call Claude Vision with category-specific prompt
    const prompt = EXTRACTION_PROMPTS[doc.category] ?? EXTRACTION_PROMPTS.sonstiges;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: { type: 'base64', media_type: mediaType, data: b64 },
            } as any,
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    // 6. Parse the JSON response
    const textBlock = response.content.find((b: any) => b.type === 'text');
    if (!textBlock) throw new Error('No text in Claude response');

    let extracted: any;
    try {
      const txt = (textBlock as any).text.trim();
      const jsonStart = txt.indexOf('{');
      const jsonEnd = txt.lastIndexOf('}');
      extracted = JSON.parse(txt.slice(jsonStart, jsonEnd + 1));
    } catch (err) {
      await markFailed(document_id, 'json_parse_failed');
      return json({ error: 'could not parse extraction result' }, 500);
    }

    // 7. Store result
    await supabase
      .from('documents')
      .update({
        ocr_status: 'done',
        extracted_data: extracted,
        ocr_text: (textBlock as any).text,
      })
      .eq('id', document_id);

    return json({ success: true, extracted_data: extracted });
  } catch (err) {
    console.error('OCR error:', err);
    return json({ error: String(err) }, 500);
  }
});

async function markFailed(id: string, reason: string) {
  await supabase
    .from('documents')
    .update({ ocr_status: 'failed', ocr_text: reason })
    .eq('id', id);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
