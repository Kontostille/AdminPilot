import { PDFDocument } from 'pdf-lib';

export const config = { runtime: 'edge' };

// =====================================================
// ANTRAG-GENERATOR v4 - Mit echter PDF-Befuellung fuer R0820
// =====================================================
// Neu in v4:
// - Kann R0820 (KV-Zuschuss) als echt ausgefuelltes PDF erzeugen
// - Laedt Template aus Supabase Storage (templates/r0820.pdf)
// - Claude analysiert OCR-Daten und entscheidet Feldwerte
// - pdf-lib fuellt native PDF-Formularfelder
// - Speichert fertiges PDF in documents/ Bucket

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json', 'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  return res.json();
}

async function storageDownload(bucket, path) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Download failed ${bucket}/${path}: ${res.status}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function storageUpload(bucket, path, bytes, contentType = 'application/pdf') {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': contentType, 'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${res.status} ${err}`);
  }
  return await res.json();
}

// === LEISTUNGS-KONFIG ===
const L = {
  kindergeld: { name: 'Kindergeld', kennung: 'KG1', behoerde: 'Familienkasse der Bundesagentur für Arbeit', typ: 'anschreiben' },
  kinderzuschlag: { name: 'Kinderzuschlag', kennung: 'KiZ1', behoerde: 'Familienkasse der Bundesagentur für Arbeit', typ: 'anschreiben' },
  'kv-zuschuss': {
    name: 'Zuschuss zur KV (§106 SGB VI)',
    kennung: 'R0820',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'pdf_fill',
    template_path: 'r0820.pdf',
    formular_sprache: 'Der Antragsteller ist der Kunde selbst. Fuelle die Felder aus der Ich-Perspektive. Wenn Daten fehlen, lasse Felder leer anstatt zu raten.'
  },
  kindererziehungszeiten: { name: 'Kindererziehungszeiten', kennung: 'V0800', behoerde: 'Deutsche Rentenversicherung', typ: 'anschreiben' },
  'em-zuschlag': { name: 'EM-Rentenzuschlag', kennung: 'automatisch', behoerde: 'DRV', typ: 'kein_antrag', hinweis: 'Wird automatisch geprueft. Kein Antrag noetig.' },
  wohngeld: { name: 'Wohngeld', kennung: 'WG-MZ', behoerde: 'Wohngeldbehoerde', typ: 'anschreiben' },
  elterngeld: { name: 'Elterngeld', kennung: 'EG', behoerde: 'Landeselterngeldstelle', typ: 'anschreiben' },
  'bildung-teilhabe': { name: 'Bildung und Teilhabe', kennung: 'BuT', behoerde: 'Sozialbuergerhaus', typ: 'anschreiben' },
};

// === R0820 FELD-PROMPT ===
// Prompt fuer Claude, um alle Felder des R0820 zu fuellen
async function fillR0820Fields(app, profile, ocrData) {
  const today = new Date().toLocaleDateString('de-DE');

  const prompt = `Du fuellst das offizielle deutsche Formular R0820 "Antrag auf Zuschuss zur Krankenversicherung (§106 SGB VI)" der Deutschen Rentenversicherung aus. Der Antragsteller ist der Kunde selbst (nicht bevollmaechtigt).

KUNDENDATEN (Profil):
Name: ${profile?.full_name || ''}
E-Mail: ${profile?.email || ''}
Adresse: ${profile?.address || ''}
PLZ: ${profile?.zip || ''}
Wohnort: ${profile?.city || ''}
Telefon: ${profile?.phone || ''}

OCR-DATEN aus hochgeladenen Dokumenten (Rentenbescheid, KV-Bescheinigung, Personalausweis):
${JSON.stringify(ocrData, null, 2)}

DEIN AUFTRAG:
Fuelle die Formularfelder aus. Gib NUR ein JSON-Objekt zurueck mit Feld-ID als Key und Wert als String. Bei Radio-Buttons/Checkboxen muss der Wert exakt einer der vorgegebenen Optionen entsprechen. Lasse unsichere Felder leer (leerer String "").

REGELN:
- Nur Felder fuellen, fuer die Daten vorhanden sind
- Sonderfall-Felder (Hinterbliebenenrente, private KV, Ehegatte, Kinder) nur ausfuellen wenn explizit Daten dafuer vorliegen
- Datum-Format: TT.MM.JJJJ
- Keine Platzhalter wie "[...]" oder "unbekannt"
- Radio-Buttons / Checkboxen: exakt die Option-Syntax aus den Vorgaben verwenden

HAUPTFELDER (immer fuellen wenn Daten vorhanden):

SEITE 1 - Stammdaten Antragsteller:
- PAF_Ber_Name: Familienname
- PAF_Ber_Vorname: Vorname
- PAF_Ber_GebName: Geburtsname (leer falls identisch mit Familienname)
- PAF_Ber_GebDat_trim: Geburtsdatum (TT.MM.JJJJ)
- PAF_Ber_Straße_Postfach: Strasse und Hausnummer
- PAF_Ber_PLZ: PLZ
- PAF_Ber_Wohnort: Wohnort
- TEL_1: Telefon (falls vorhanden)
- MAIL_1: E-Mail (falls vorhanden)

SEITE 2 - Weiterer Rentenbezug / Versicherungspflicht:
- AW_WEITERERENTE_1: Radio. Standard: "/nein,  bitte weiter bei Ziffer 4" (Achtung: mit 2 Leerzeichen nach nein). Nur "/Ja" wenn explizit weitere Rente bekannt.
- AW_VERSICHERUNGSPFLICHT_1: Radio. Standard: "/Ja" bei gesetzlicher KV (KVdR). "/Nein" bei privater KV.
- VERS_KRANKENKASSE_1: Name + Adresse der Krankenkasse aus KV-Bescheinigung
- VERS_PFLICHTGRUND_1: "Rentner (KVdR)" wenn gesetzlich, sonst "freiwillig gesetzlich versichert" oder leer

SEITE 3:
- VERS_O_DAT_1: "${profile?.city || 'Wohnort'}, ${today}" (Ort + heutiges Datum fuer Unterschrift)
- AW_BARRIERE_1: Nur ausfuellen wenn Barrierefreiheits-Wunsch bekannt, sonst leer

SEITEN 4-6: Nur befuellen wenn KV-Typ "privat" (aus OCR erkennbar), ansonsten alle Felder dieser Seiten leer lassen.

HINTERBLIEBENENRENTE (nur wenn Witwenrente/Waisenrente beantragt):
- VERS_N_2, VERS_VN_2, VERS_GN_2, VERS_GDAT_2, PAF_Vers_TDDT_trim

JSON-Antwort, NUR diese Felder, exakte Feld-IDs:
{
  "PAF_Ber_Name": "Schmidt",
  "PAF_Ber_Vorname": "Maria",
  ...
  "fehlende_felder_hinweis": "Kurzer Text an den Kunden welche Angaben auf dem fertigen PDF noch handschriftlich ergaenzt werden muessen (1-2 Saetze)."
}`;

  const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }]
    }),
  });

  if (!apiRes.ok) throw new Error(`Claude API ${apiRes.status}`);

  const raw = (await apiRes.json()).content?.[0]?.text || '{}';
  const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parse error:', cleaned.substring(0, 500));
    throw new Error('Claude response not valid JSON');
  }
}

// === PDF FELDER BEFUELLEN ===
async function fillPdfForm(templateBytes, fieldValues) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  const filledFields = [];
  const errors = [];

  for (const [fieldId, value] of Object.entries(fieldValues)) {
    // Meta-Felder ueberspringen
    if (fieldId === 'fehlende_felder_hinweis' || !value || value === '') continue;

    try {
      // Versuche Textfeld
      try {
        const field = form.getTextField(fieldId);
        field.setText(String(value));
        filledFields.push({ fieldId, type: 'text', value: String(value) });
        continue;
      } catch (_) { /* not a text field */ }

      // Versuche Radio-Button
      try {
        const field = form.getRadioGroup(fieldId);
        field.select(String(value));
        filledFields.push({ fieldId, type: 'radio', value: String(value) });
        continue;
      } catch (_) { /* not a radio */ }

      // Versuche Checkbox
      try {
        const field = form.getCheckBox(fieldId);
        if (value === '/ja' || value === true || value === 'ja' || value === '/Yes') {
          field.check();
          filledFields.push({ fieldId, type: 'checkbox', value: 'checked' });
        } else {
          field.uncheck();
        }
        continue;
      } catch (_) { /* not a checkbox */ }

      errors.push(`Unknown field: ${fieldId}`);
    } catch (e) {
      errors.push(`Error on ${fieldId}: ${e.message}`);
    }
  }

  // Flatten = Felder fix machen, nicht mehr editierbar. Lassen wir editierbar, damit Kunde korrigieren kann.
  // form.flatten();

  const pdfBytes = await pdfDoc.save();
  return { pdfBytes, filledFields, errors };
}

// === HANDLER ===
export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });
  if (!ANTHROPIC_API_KEY) return Response.json({ error: 'ANTHROPIC_API_KEY missing' }, { status: 500 });

  try {
    const { application_id } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    const [app] = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    if (!app) return Response.json({ success: false, error: 'Application not found' });

    const cfg = L[app.leistung_id];
    if (!cfg) return Response.json({ success: false, error: `Unknown leistung: ${app.leistung_id}` });

    // === PFAD 1: Kein Antrag noetig (z.B. EM-Rentenzuschlag) ===
    if (cfg.typ === 'kein_antrag') {
      const result = { modus: 'kein_antrag', hinweis: cfg.hinweis, meta: { leistung: cfg.name } };
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          generated_antrag: result,
          status: 'antrag_bereit',
          antrag_bereit_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      return Response.json({ success: true, antrag: result });
    }

    // Profil + OCR-Daten laden
    const [profile] = await supaFetch(`profiles?clerk_id=eq.${app.clerk_id}&select=*`);
    const docs = await supaFetch(`documents?application_id=eq.${application_id}&ocr_status=eq.complete&select=ocr_result`);
    const ocr = (docs || []).map(d => d.ocr_result).filter(Boolean);

    // === PFAD 2: PDF-Befuellung (R0820) ===
    if (cfg.typ === 'pdf_fill') {
      try {
        // Template laden
        const templateBytes = await storageDownload('templates', cfg.template_path);

        // Claude-Feldwerte holen
        const fieldValues = await fillR0820Fields(app, profile, ocr);
        const hinweis = fieldValues.fehlende_felder_hinweis || '';

        // PDF ausfuellen
        const { pdfBytes, filledFields, errors } = await fillPdfForm(templateBytes, fieldValues);

        // Ausgefuelltes PDF in Storage speichern
        const filledPath = `${app.clerk_id}/${application_id}/antrag_R0820_${Date.now()}.pdf`;
        await storageUpload('documents', filledPath, pdfBytes);

        const result = {
          modus: 'pdf_fill',
          formular: 'R0820',
          filled_pdf_path: filledPath,
          filled_fields_count: filledFields.length,
          fehlende_felder_hinweis: hinweis,
          fill_errors: errors,
          meta: {
            leistung: cfg.name,
            leistung_id: app.leistung_id,
            kennung: cfg.kennung,
            behoerde: cfg.behoerde,
            generated_at: new Date().toISOString(),
            ocr_count: ocr.length,
          },
          nachweise_erforderlich: [
            'Rentenbescheid (Kopie)',
            'Nachweis der KV-Mitgliedschaft (Bescheinigung der Krankenkasse)',
            'Bei privater KV: Beitragsnachweis',
          ],
          einreichungsanleitung: `1. PDF herunterladen und ausdrucken\n2. Fehlende Angaben handschriftlich ergaenzen: ${hinweis}\n3. Auf Seite 3 eigenhaendig unterschreiben\n4. Nachweise beilegen (siehe Liste)\n5. Per Post an die Deutsche Rentenversicherung senden (Adresse siehe Rentenbescheid)`,
        };

        await supaFetch(`applications?id=eq.${application_id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            generated_antrag: result,
            status: 'antrag_bereit',
            antrag_bereit_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });

        await supaFetch('status_updates', {
          method: 'POST',
          body: JSON.stringify({
            application_id,
            status: 'antrag_bereit',
            message: `Antrag R0820 bereit. ${filledFields.length} Felder automatisch ausgefuellt. Bitte pruefen, unterschreiben und einreichen.`,
          }),
        });

        return Response.json({ success: true, antrag: result });
      } catch (pdfError) {
        console.error('PDF fill error:', pdfError);
        // Fallback: Anschreiben generieren
        return Response.json({
          success: false,
          error: `PDF-Befuellung fehlgeschlagen: ${pdfError.message}. Fallback Anschreiben wird generiert.`,
          fallback: 'anschreiben'
        });
      }
    }

    // === PFAD 3: Anschreiben generieren (fuer alle anderen Leistungen) ===
    const prompt = `Du bist Experte fuer deutsche Sozialleistungsantraege. Erstelle einen vollstaendigen ${cfg.name}-Antrag, der vom Kunden selbst unterschrieben und eingereicht wird.

WICHTIG: Der Kunde ist der Antragsteller. AdminPilot ist nur technischer Ausfuellservice.
Das Anschreiben muss aus der Ich-Perspektive des Kunden verfasst sein.
KEINE Formulierungen wie "als Bevollmaechtigter".

ANTRAG: ${cfg.name} (${cfg.kennung})
BEHOERDE: ${cfg.behoerde}
PLZ: ${app.plz}

KUNDENDATEN:
${JSON.stringify(profile, null, 2)}

OCR-DATEN:
${JSON.stringify(ocr, null, 2)}

ERSTELLE JSON:
{
  "anschreiben": "Betreff: Antrag auf ${cfg.name}\\n\\nSehr geehrte Damen und Herren,\\n\\nhiermit beantrage ich, [Name], ${cfg.name}. [3-6 Absaetze mit Daten.]\\n\\nMit freundlichen Gruessen\\n[Datum]\\n[Unterschrift]",
  "behoerde_empfaenger": {"name": "Zustaendige Behoerde", "adresse": "geschaetzte Adresse"},
  "einreichungsanleitung": "Konkrete Schritte.",
  "dokumente_beifuegen": ["Dok1", "Dok2"]
}

Antworte NUR mit JSON.`;

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 4000, messages: [{ role: 'user', content: prompt }] }),
    });

    if (!apiRes.ok) return Response.json({ success: false, error: `Claude ${apiRes.status}` });

    const raw = (await apiRes.json()).content?.[0]?.text || '{}';
    let antrag;
    try { antrag = JSON.parse(raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()); }
    catch { antrag = { parse_error: true, raw: raw.substring(0, 2000) }; }

    const fullResult = {
      ...antrag,
      modus: 'anschreiben',
      meta: {
        leistung: cfg.name, leistung_id: app.leistung_id, kennung: cfg.kennung,
        behoerde: cfg.behoerde, generated_at: new Date().toISOString(), ocr_count: ocr.length,
      },
    };

    await supaFetch(`applications?id=eq.${application_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        generated_antrag: fullResult,
        status: 'antrag_bereit',
        antrag_bereit_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id,
        status: 'antrag_bereit',
        message: `Anschreiben fuer ${cfg.name} generiert. Bitte pruefen, unterschreiben und einreichen.`,
      }),
    });

    return Response.json({ success: true, antrag: fullResult });
  } catch (e) {
    console.error('generate-antrag error:', e);
    return Response.json({ success: false, error: e.message });
  }
}
