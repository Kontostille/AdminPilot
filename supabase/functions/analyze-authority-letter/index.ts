// ============================================================================
// analyze-authority-letter
// ============================================================================
// Wenn die Behörde einen Brief schickt (Nachforderung, Rückfrage, Bescheid),
// lädt der Nutzer ein Foto im Dashboard hoch. Diese Funktion analysiert den
// Brief mit Claude Vision und schlägt dem Nutzer vor, was zu tun ist.
//
// WICHTIG: Wir antworten NICHT für den Nutzer. Wir liefern nur eine
// Erklärung und ein optionales Mustertext-Template - der Nutzer selbst
// entscheidet, was er tut, und schreibt selbst.
//
// Input:  { document_id: uuid }  -- document mit category='sonstiges'
// Output: { success: boolean, analysis?: object }
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

const ANALYSIS_PROMPT = `Du analysierst einen Behördenbrief im Kontext eines
Sozialleistungsantrags. Gib das Ergebnis als JSON mit folgenden Feldern zurück:

- letter_type: "eingangsbestaetigung" | "nachforderung" | "ablehnung" | "bewilligung" | "rueckfrage" | "sonstiges"
- summary: Kurze Zusammenfassung in 1-2 Sätzen (für Senioren verständlich)
- requested_documents: Array von Strings, welche Unterlagen das Amt nachfordert (leer falls keine)
- requested_information: Array von Strings, welche Auskünfte das Amt braucht
- deadline: ISO-Datum YYYY-MM-DD (null falls keine Frist erkennbar)
- authority_name: Name der Behörde
- case_number: Aktenzeichen des Amts (string oder null)
- recommended_action: Kurze Empfehlung, WAS der Nutzer tun sollte (nicht: was WIR tun)
- user_response_template: Musteranschreiben (mehrzeiliger String), das der Nutzer
  anpassen und selbst versenden kann. Der Brief ist in Ich-Form geschrieben,
  damit der Nutzer ihn selbst absendet.

WICHTIG: In keinem Feld Empfehlungen geben, die einer Rechtsberatung gleichkommen.
Nur technische Hilfe (Unterlagen zusammenstellen, Fristen beachten).

Gib NUR das JSON zurück, keine Erklärung davor oder danach.`;

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
    const { document_id } = await req.json();
    if (!document_id) return json({ error: 'document_id required' }, 400);

    const { data: doc } = await supabase
      .from('documents')
      .select('*')
      .eq('id', document_id)
      .single();

    if (!doc) return json({ error: 'document not found' }, 404);

    // Signed URL + download
    const { data: signed } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(doc.storage_path, 60);

    if (!signed) return json({ error: 'no signed URL' }, 500);

    const imgRes = await fetch(signed.signedUrl);
    const buf = new Uint8Array(await imgRes.arrayBuffer());
    const b64 = btoa(String.fromCharCode(...buf));
    const mediaType = doc.mime_type || 'image/jpeg';

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: mediaType === 'application/pdf' ? 'document' : 'image',
              source: { type: 'base64', media_type: mediaType, data: b64 },
            } as any,
            { type: 'text', text: ANALYSIS_PROMPT },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b: any) => b.type === 'text');
    const txt = (textBlock as any).text.trim();
    const jsonStart = txt.indexOf('{');
    const jsonEnd = txt.lastIndexOf('}');
    const analysis = JSON.parse(txt.slice(jsonStart, jsonEnd + 1));

    // Store analysis in document
    await supabase
      .from('documents')
      .update({
        ocr_status: 'done',
        extracted_data: analysis,
      })
      .eq('id', document_id);

    // If it's a decision (bewilligung/ablehnung), update the related application
    if (doc.application_id) {
      if (analysis.letter_type === 'bewilligung' || analysis.letter_type === 'ablehnung') {
        await supabase
          .from('applications')
          .update({
            status: analysis.letter_type === 'bewilligung' ? 'approved' : 'rejected',
            decision_date: new Date().toISOString().slice(0, 10),
            decision_result: analysis.letter_type === 'bewilligung' ? 'approved' : 'rejected',
          })
          .eq('id', doc.application_id);
      } else if (analysis.letter_type === 'nachforderung') {
        await supabase
          .from('applications')
          .update({ status: 'processing' })
          .eq('id', doc.application_id);
      }

      await supabase.from('status_events').insert({
        user_id: doc.user_id,
        application_id: doc.application_id,
        event_type: 'authority_letter_analyzed',
        actor: 'system',
        metadata: {
          letter_type: analysis.letter_type,
          deadline: analysis.deadline,
        },
      });
    }

    return json({ success: true, analysis });
  } catch (err) {
    console.error('Authority letter analysis error:', err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
