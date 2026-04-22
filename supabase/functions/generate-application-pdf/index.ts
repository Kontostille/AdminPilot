// ============================================================================
// generate-application-pdf
// ============================================================================
// Erzeugt das finale Antragspaket für den Nutzer:
//   1. Ausgefülltes Antragsformular (als PDF)
//   2. Persönliches Anschreiben
//   3. Dokumenten-Checkliste
//   4. Einreichungs-Anleitung
//
// Das Paket wird als einzelnes PDF zusammengesetzt und in Storage gespeichert.
// Nutzer druckt aus, unterschreibt, reicht SELBST ein (oder nutzt Plus-Umschlag).
//
// Input:  { application_id: uuid }
// Output: { success: boolean, pdf_url?: string }
// ============================================================================

// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { PDFDocument, StandardFonts, rgb } from 'https://esm.sh/pdf-lib@1.17.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const BENEFIT_LABELS: Record<string, string> = {
  grundsicherung: 'Grundsicherung im Alter',
  wohngeld: 'Wohngeld',
  pflegegeld: 'Pflegegeld',
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

    // Load application, user, draft
    const { data: app } = await supabase
      .from('applications')
      .select('*')
      .eq('id', application_id)
      .single();

    if (!app) return json({ error: 'application not found' }, 404);

    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', app.user_id)
      .single();

    const { data: draft } = await supabase
      .from('application_drafts')
      .select('*')
      .eq('application_id', application_id)
      .single();

    const formData = draft?.form_data ?? {};

    // Build PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    addCoverLetter(pdfDoc, font, bold, { user, app });
    addApplicationForm(pdfDoc, font, bold, { user, app, formData });
    addChecklist(pdfDoc, font, bold, { app });
    addSubmissionGuide(pdfDoc, font, bold, { app });

    const bytes = await pdfDoc.save();

    const storagePath = `${user.id}/${application_id}/antrag-${Date.now()}.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from('user-documents')
      .upload(storagePath, bytes, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadErr) throw uploadErr;

    await supabase
      .from('applications')
      .update({
        status: 'ready_to_submit',
        final_pdf_path: storagePath,
      })
      .eq('id', application_id);

    await supabase.from('status_events').insert({
      user_id: user.id,
      application_id,
      event_type: 'pdf_generated',
      from_status: 'filling',
      to_status: 'ready_to_submit',
      actor: 'system',
    });

    // Signed URL for immediate download
    const { data: signed } = await supabase.storage
      .from('user-documents')
      .createSignedUrl(storagePath, 3600);

    return json({ success: true, pdf_url: signed?.signedUrl, path: storagePath });
  } catch (err) {
    console.error('PDF generation error:', err);
    return json({ error: String(err) }, 500);
  }
});

// ----------------------------------------------------------------------------
// PDF builders (simplified - real antragsformulare would be overlay on official PDF)
// ----------------------------------------------------------------------------

const PAGE = { w: 595, h: 842 }; // A4 points

function addCoverLetter(doc: PDFDocument, font: any, bold: any, ctx: any) {
  const page = doc.addPage([PAGE.w, PAGE.h]);
  const m = 50;
  let y = PAGE.h - m;

  // Sender block
  page.drawText(ctx.user.full_name ?? '', { x: m, y, size: 10, font });
  y -= 14;
  page.drawText(ctx.user.address_street ?? '', { x: m, y, size: 10, font });
  y -= 14;
  page.drawText(
    `${ctx.user.address_zip ?? ''} ${ctx.user.address_city ?? ''}`,
    { x: m, y, size: 10, font }
  );

  // Recipient
  y -= 60;
  page.drawText(ctx.app.authority_name ?? '[Zuständige Behörde]', {
    x: m, y, size: 11, font: bold,
  });
  y -= 14;
  const authorityAddress = (ctx.app.authority_address ?? '').split('\n');
  for (const line of authorityAddress) {
    page.drawText(line, { x: m, y, size: 10, font });
    y -= 14;
  }

  y -= 30;
  const today = new Date().toLocaleDateString('de-DE');
  page.drawText(
    `${ctx.user.address_city ?? ''}, ${today}`,
    { x: PAGE.w - m - 200, y, size: 10, font }
  );

  // Subject
  y -= 40;
  page.drawText(`Antrag auf ${BENEFIT_LABELS[ctx.app.benefit_type]}`, {
    x: m, y, size: 13, font: bold,
  });

  // Salutation + body
  y -= 40;
  page.drawText('Sehr geehrte Damen und Herren,', { x: m, y, size: 11, font });

  y -= 30;
  const bodyLines = [
    'hiermit stelle ich den Antrag auf Gewährung von',
    `${BENEFIT_LABELS[ctx.app.benefit_type]}.`,
    '',
    'Die vollständig ausgefüllten Antragsunterlagen sowie die erforderlichen',
    'Nachweise füge ich diesem Schreiben bei.',
    '',
    'Für Rückfragen stehe ich Ihnen gerne zur Verfügung.',
    '',
    'Mit freundlichen Grüßen',
    '',
    '',
    '',
    '_______________________________',
    ctx.user.full_name ?? '',
  ];
  for (const line of bodyLines) {
    page.drawText(line, { x: m, y, size: 11, font });
    y -= 16;
  }
}

function addApplicationForm(doc: PDFDocument, font: any, bold: any, ctx: any) {
  // Note: in production, we would open the official PDF form for this
  // Behörde and fill its AcroForm fields. For MVP, we render a structured
  // summary that the user attaches with the amtlichen form.
  const page = doc.addPage([PAGE.w, PAGE.h]);
  const m = 50;
  let y = PAGE.h - m;

  page.drawText('Antragsangaben (Zusammenfassung)', {
    x: m, y, size: 14, font: bold, color: rgb(0.1, 0.24, 0.17),
  });
  y -= 10;
  page.drawLine({
    start: { x: m, y }, end: { x: PAGE.w - m, y },
    thickness: 0.5, color: rgb(0.5, 0.5, 0.5),
  });

  y -= 30;
  const entries = Object.entries(ctx.formData);
  for (const [k, v] of entries) {
    page.drawText(`${humanize(k)}:`, { x: m, y, size: 10, font: bold });
    page.drawText(String(v ?? ''), { x: m + 200, y, size: 10, font });
    y -= 18;
    if (y < m + 30) {
      // New page
      const next = doc.addPage([PAGE.w, PAGE.h]);
      y = PAGE.h - m;
    }
  }
}

function addChecklist(doc: PDFDocument, font: any, bold: any, ctx: any) {
  const page = doc.addPage([PAGE.w, PAGE.h]);
  const m = 50;
  let y = PAGE.h - m;

  page.drawText('Checkliste: Das muss mit', {
    x: m, y, size: 14, font: bold, color: rgb(0.1, 0.24, 0.17),
  });
  y -= 30;

  const checklistByBenefit: Record<string, string[]> = {
    grundsicherung: [
      'Dieses Anschreiben (unterschrieben)',
      'Der ausgefüllte amtliche Antragsbogen (unterschrieben)',
      'Kopie Ihres Personalausweises',
      'Aktueller Rentenbescheid',
      'Mietvertrag und aktuelle Mietbescheinigung',
      'Kontoauszüge der letzten 3 Monate',
      'Nachweise zu weiteren Einkünften oder Vermögen (soweit vorhanden)',
    ],
    wohngeld: [
      'Dieses Anschreiben (unterschrieben)',
      'Der ausgefüllte Wohngeldantrag (unterschrieben)',
      'Kopie Ihres Personalausweises',
      'Mietvertrag',
      'Aktuelle Mietbescheinigung vom Vermieter',
      'Einkommensnachweise aller Haushaltsmitglieder',
      'Bei Nebenkosten: letzte Nebenkostenabrechnung',
    ],
    pflegegeld: [
      'Dieses Anschreiben (unterschrieben)',
      'Der ausgefüllte Antrag auf Pflegegeld',
      'Kopie der Versicherungskarte',
      'Ärztliche Diagnosen und Befunde',
      'Bei vorhandenem Pflegegrad: Bescheid der Pflegekasse',
    ],
  };

  const items = checklistByBenefit[ctx.app.benefit_type] ?? [];
  for (const item of items) {
    page.drawText('☐', { x: m, y, size: 14, font });
    page.drawText(item, { x: m + 20, y, size: 11, font });
    y -= 22;
  }

  y -= 20;
  page.drawText(
    'Tipp: Legen Sie Kopien bei, keine Originale.',
    { x: m, y, size: 10, font, color: rgb(0.42, 0.42, 0.41) }
  );
}

function addSubmissionGuide(doc: PDFDocument, font: any, bold: any, ctx: any) {
  const page = doc.addPage([PAGE.w, PAGE.h]);
  const m = 50;
  let y = PAGE.h - m;

  page.drawText('So reichen Sie den Antrag ein', {
    x: m, y, size: 14, font: bold, color: rgb(0.1, 0.24, 0.17),
  });
  y -= 30;

  const steps = [
    '1. Drucken Sie alle Seiten dieses Dokuments aus.',
    '2. Unterschreiben Sie das Anschreiben und den amtlichen Antrag.',
    '3. Legen Sie die in der Checkliste genannten Unterlagen bei.',
    '',
    `4. Senden Sie alles an folgende Adresse:`,
    '',
    `   ${ctx.app.authority_name ?? '[Behörde]'}`,
    ...(ctx.app.authority_address ?? '').split('\n').map((l: string) => `   ${l}`),
    '',
    'Mit dem Plus-Paket haben wir Ihnen einen bereits adressierten und',
    'frankierten Umschlag nach Hause geschickt. Sie müssen nur noch die',
    'Unterlagen hineinlegen und den Umschlag in den Briefkasten werfen.',
    '',
    'WICHTIG: Sie sind und bleiben Antragsteller. AdminPilot hat Sie beim',
    'Ausfüllen unterstützt, die Einreichung nehmen Sie selbst vor.',
  ];

  for (const line of steps) {
    page.drawText(line, { x: m, y, size: 10, font });
    y -= 16;
  }
}

function humanize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
  });
}
