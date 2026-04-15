export const config = { runtime: 'edge' };

// =====================================================
// AUTO-ANTRAGSERSTELLUNG via Claude Sonnet
// =====================================================
// Nimmt OCR-Daten + Bundesland → generiert ausgefüllte Formularfelder
// Wird nach digitaler Signatur automatisch aufgerufen

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  return res.json();
}

// === FORMULAR-TEMPLATES (Server-Seite, identisch mit bundeslaender.js) ===
const TEMPLATES = {
  kindergeld: {
    name: 'Antrag auf Kindergeld (KG1)',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    einreichung: { online: 'https://www.familienkasse.de', email_muster: '{stadt}@familienkasse.de' },
    formulare: ['KG1 (Hauptantrag)', 'KG1-AnK (Anlage Kind, pro Kind 1x)'],
    felder: {
      antragsteller_familienname: 'Familienname des Antragstellers',
      antragsteller_vorname: 'Vorname des Antragstellers',
      antragsteller_geburtsdatum: 'Geburtsdatum (TT.MM.JJJJ)',
      antragsteller_adresse: 'Straße, Hausnummer',
      antragsteller_plz_ort: 'PLZ und Wohnort',
      antragsteller_steuer_id: 'Steuer-Identifikationsnummer',
      antragsteller_staatsangehoerigkeit: 'Staatsangehörigkeit',
      antragsteller_familienstand: 'Familienstand',
      ehepartner_name: 'Name des Ehepartners/Lebenspartners',
      ehepartner_geburtsdatum: 'Geburtsdatum Ehepartner',
      kind_1_name: 'Name Kind 1',
      kind_1_geburtsdatum: 'Geburtsdatum Kind 1',
      kind_1_steuer_id: 'Steuer-ID Kind 1',
      kind_2_name: 'Name Kind 2 (falls vorhanden)',
      kind_2_geburtsdatum: 'Geburtsdatum Kind 2',
      kind_2_steuer_id: 'Steuer-ID Kind 2',
      bankverbindung_iban: 'IBAN für Auszahlung',
      bankverbindung_kontoinhaber: 'Kontoinhaber',
    },
  },
  kinderzuschlag: {
    name: 'Antrag auf Kinderzuschlag (KiZ1)',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    einreichung: { online: 'https://kiz-digital.de', email_muster: '{stadt}@familienkasse.de' },
    formulare: ['KiZ1 (Hauptantrag)', 'KiZ1-AnA (Anlage Antragsteller)', 'KiZ1-AnK (Anlage Kind, pro Kind)'],
    felder: {
      antragsteller_familienname: 'Familienname',
      antragsteller_vorname: 'Vorname',
      antragsteller_geburtsdatum: 'Geburtsdatum',
      antragsteller_adresse: 'Anschrift (Straße, Hausnummer)',
      antragsteller_plz_ort: 'PLZ und Ort',
      kindergeld_nr: 'Kindergeld-Nummer (falls vorhanden)',
      bruttoeinkommen_antragsteller: 'Bruttoeinkommen Antragsteller (Monat)',
      nettoeinkommen_antragsteller: 'Nettoeinkommen Antragsteller (Monat)',
      bruttoeinkommen_partner: 'Bruttoeinkommen Partner (Monat)',
      nettoeinkommen_partner: 'Nettoeinkommen Partner (Monat)',
      kaltmiete: 'Kaltmiete (Monat)',
      warmmiete: 'Warmmiete inkl. Nebenkosten (Monat)',
      heizkosten: 'Heizkosten (Monat)',
      kind_1_name: 'Name Kind 1',
      kind_1_geburtsdatum: 'Geburtsdatum Kind 1',
      kind_2_name: 'Name Kind 2',
      kind_2_geburtsdatum: 'Geburtsdatum Kind 2',
      bankverbindung_iban: 'IBAN',
    },
  },
  'kv-zuschuss': {
    name: 'Antrag auf Zuschuss zur KV nach §106 SGB VI (R0820)',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    einreichung: { online: 'https://www.eservice-drv.de', email_muster: 'drv@deutsche-rentenversicherung.de' },
    formulare: ['R0820 (Antrag auf Zuschuss zur Krankenversicherung)'],
    felder: {
      antragsteller_name: 'Familienname, Vorname',
      versicherungsnummer: 'Rentenversicherungsnummer',
      antragsteller_geburtsdatum: 'Geburtsdatum',
      antragsteller_adresse: 'Anschrift',
      antragsteller_plz_ort: 'PLZ und Ort',
      krankenkasse_name: 'Name der Krankenkasse',
      versicherungsart: 'freiwillig gesetzlich ODER privat versichert',
      monatlicher_kv_beitrag: 'Monatlicher KV-Beitrag in EUR',
      bruttorente_monatlich: 'Monatliche Bruttorente in EUR',
      rentenbeginn: 'Rentenbeginn (Datum)',
    },
  },
  kindererziehungszeiten: {
    name: 'Antrag auf Feststellung von Kindererziehungszeiten (V0800)',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    einreichung: { online: 'https://www.eservice-drv.de/eantrag', email_muster: 'drv@deutsche-rentenversicherung.de' },
    formulare: ['V0800 (Hauptantrag)', 'V0805 (Angaben zur Kindererziehung, pro Kind)'],
    felder: {
      antragsteller_name: 'Familienname, Vorname',
      versicherungsnummer: 'Rentenversicherungsnummer',
      antragsteller_geburtsdatum: 'Geburtsdatum',
      antragsteller_adresse: 'Anschrift',
      kind_1_name: 'Name Kind 1',
      kind_1_geburtsdatum: 'Geburtsdatum Kind 1',
      kind_1_erziehung_von_bis: 'Erziehungszeitraum Kind 1',
      kind_2_name: 'Name Kind 2',
      kind_2_geburtsdatum: 'Geburtsdatum Kind 2',
      kind_2_erziehung_von_bis: 'Erziehungszeitraum Kind 2',
    },
  },
  'em-zuschlag': {
    name: 'EM-Rentenzuschlag (automatisch)',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    formulare: [],
    hinweis: 'Wird automatisch von der DRV bei der Rentenberechnung geprüft. Kein separater Antrag nötig. Empfehlung: Kontenklärung (V0100) durchführen lassen.',
    felder: {},
  },
  wohngeld: {
    name: 'Wohngeldantrag (Mietzuschuss)',
    behoerde: 'Wohngeldbehörde der zuständigen Gemeinde/Stadt',
    typ: 'land',
    einreichung: { online: null, email: true },
    formulare: ['Wohngeldantrag Mietzuschuss (landesspezifisch)', 'Mietbescheinigung (vom Vermieter)'],
    felder: {
      antragsteller_familienname: 'Familienname',
      antragsteller_vorname: 'Vorname',
      antragsteller_geburtsdatum: 'Geburtsdatum',
      antragsteller_adresse: 'Anschrift der Wohnung',
      antragsteller_plz_ort: 'PLZ und Ort',
      haushaltsmitglieder_anzahl: 'Anzahl Personen im Haushalt',
      haushaltsmitglieder_namen: 'Namen + Geburtsdaten aller Haushaltsmitglieder',
      bruttoeinkommen_gesamt: 'Bruttoeinkommen aller Haushaltsmitglieder (Monat)',
      nettoeinkommen_gesamt: 'Nettoeinkommen aller Haushaltsmitglieder (Monat)',
      kaltmiete: 'Kaltmiete (Monat)',
      nebenkosten: 'Nebenkosten ohne Heizung (Monat)',
      heizkosten: 'Heizkosten (Monat)',
      warmmiete_gesamt: 'Gesamte Warmmiete (Monat)',
      wohnflaeche_qm: 'Wohnfläche in m²',
      anzahl_raeume: 'Anzahl der Zimmer',
      einzugsdatum: 'Einzugsdatum',
      vermieter_name: 'Name des Vermieters',
      vermieter_adresse: 'Adresse des Vermieters',
      bankverbindung_iban: 'IBAN für Auszahlung',
    },
  },
  elterngeld: {
    name: 'Elterngeldantrag',
    behoerde: 'Landeselterngeldstelle',
    typ: 'land',
    einreichung: { online: 'https://www.elterngeld-digital.de', email: true },
    formulare: ['Elterngeldantrag (landesspezifisch)', 'Geburtsurkunde', 'Einkommensnachweise'],
    felder: {
      antragsteller_name: 'Familienname, Vorname',
      antragsteller_geburtsdatum: 'Geburtsdatum',
      antragsteller_adresse: 'Anschrift',
      antragsteller_plz_ort: 'PLZ und Ort',
      antragsteller_steuer_id: 'Steuer-ID',
      kind_name: 'Name des Kindes',
      kind_geburtsdatum: 'Geburtsdatum des Kindes',
      bruttoeinkommen_vor_geburt: 'Bruttoeinkommen 12 Monate vor Geburt (Monat)',
      arbeitgeber_name: 'Arbeitgeber',
      elternzeit_von: 'Elternzeit von (Datum)',
      elternzeit_bis: 'Elternzeit bis (Datum)',
      basiselterngeld_monate: 'Gewünschte Monate BasisElterngeld',
      elterngeldplus_monate: 'Gewünschte Monate ElterngeldPlus',
      bankverbindung_iban: 'IBAN',
    },
  },
  'bildung-teilhabe': {
    name: 'Antrag auf Leistungen für Bildung und Teilhabe',
    behoerde: 'Sozialbürgerhaus / Jobcenter der Kommune',
    typ: 'kommune',
    einreichung: { online: null, email: true },
    formulare: ['BuT-Antrag (kommunal unterschiedlich)'],
    felder: {
      antragsteller_name: 'Name Antragsteller (Elternteil)',
      antragsteller_adresse: 'Anschrift',
      antragsteller_plz_ort: 'PLZ und Ort',
      leistungsbezug: 'Art des Leistungsbezugs (Wohngeld, KiZ, Bürgergeld)',
      aktenzeichen: 'Aktenzeichen / Bescheid-Nr.',
      kind_name: 'Name des Kindes',
      kind_geburtsdatum: 'Geburtsdatum',
      kind_schule: 'Name und Adresse der Schule/Kita',
      beantragte_leistungen: 'Schulbedarf, Ausflüge, Mittagessen, Nachhilfe, Teilhabe',
    },
  },
};

const BUNDESLAND_NAMES = {
  bw: 'Baden-Württemberg', by: 'Bayern', be: 'Berlin', bb: 'Brandenburg',
  hb: 'Bremen', hh: 'Hamburg', he: 'Hessen', mv: 'Mecklenburg-Vorpommern',
  ni: 'Niedersachsen', nw: 'Nordrhein-Westfalen', rp: 'Rheinland-Pfalz',
  sl: 'Saarland', sn: 'Sachsen', st: 'Sachsen-Anhalt',
  sh: 'Schleswig-Holstein', th: 'Thüringen',
};

// =====================================================
// MAIN HANDLER
// =====================================================

export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });
  if (!ANTHROPIC_API_KEY) return Response.json({ error: 'API key missing' }, { status: 500 });

  try {
    const { application_id } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    // 1. Antragsdaten aus Supabase laden
    const [appResult] = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    if (!appResult) return Response.json({ success: false, error: 'Application not found' });

    const app = appResult;
    const leistungId = app.leistung_id;
    const bundesland = app.bundesland;
    const plz = app.plz;

    // 2. OCR-Daten laden
    const docs = await supaFetch(`documents?application_id=eq.${application_id}&ocr_status=eq.complete&select=ocr_result,file_type`);
    const ocrData = (docs || []).map(d => d.ocr_result).filter(Boolean);

    // 3. Template nachschlagen
    const template = TEMPLATES[leistungId];
    if (!template) return Response.json({ success: false, error: `No template for: ${leistungId}` });

    // EM-Zuschlag: Kein Antrag nötig
    if (leistungId === 'em-zuschlag') {
      const result = {
        hinweis: template.hinweis,
        formulare: [],
        aktion: 'Nutzer informieren: EM-Zuschlag wird automatisch von der DRV geprüft.',
      };
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({ generated_antrag: result, updated_at: new Date().toISOString() }),
      });
      return Response.json({ success: true, antrag: result });
    }

    // 4. Claude Sonnet aufrufen
    const bundeslandName = BUNDESLAND_NAMES[bundesland] || bundesland;
    const felderListe = Object.entries(template.felder)
      .map(([key, desc]) => `- ${key}: ${desc}`)
      .join('\n');

    const prompt = `Du bist ein Experte für deutsche Sozialleistungsanträge. Fülle die Formularfelder für folgenden Antrag aus.

== ANTRAG ==
Leistung: ${template.name}
Zuständige Behörde: ${template.behoerde}
Bundesland: ${bundeslandName}
PLZ: ${plz}
Benötigte Formulare: ${template.formulare.join(', ')}

== FORMULARFELDER (alle ausfüllen, soweit Daten vorhanden) ==
${felderListe}

== EXTRAHIERTE DATEN AUS DOKUMENTEN (OCR) ==
${JSON.stringify(ocrData, null, 2)}

== AUFGABE ==
Erstelle ein JSON-Objekt mit genau diesen Schlüsseln:

1. "ausgefuellte_felder": Objekt mit allen Feldern die du aus den OCR-Daten befüllen konntest. Schlüssel = Feldname, Wert = eingetragener Wert.

2. "fehlende_felder": Array mit Feldnamen die NICHT aus den Dokumenten befüllt werden konnten. Diese müssen beim Nutzer nachgefragt werden.

3. "anschreiben": Formelles Anschreiben an die Behörde (3-4 Sätze, in Deutsch). Format: "Sehr geehrte Damen und Herren, hiermit beantrage ich..."

4. "einreichung": Objekt mit:
   - "behoerde": Name der zuständigen Behörde
   - "weg": "online" oder "email" (bevorzugt online wenn verfügbar)
   - "portal_url": URL des Online-Portals (falls vorhanden)
   - "email_hinweis": Hinweis zur E-Mail-Einreichung
   - "adresse": Geschätzte Adresse der zuständigen Behörde basierend auf PLZ ${plz} in ${bundeslandName}

5. "dokumente_beifuegen": Array mit Dokumenten die dem Antrag beigefügt werden müssen (z.B. "Personalausweis-Kopie", "Mietvertrag", "Einkommensnachweise der letzten 3 Monate")

6. "hinweise": Array mit wichtigen Hinweisen für das Team (z.B. "Mietbescheinigung muss vom Vermieter ausgefüllt werden")

Antworte NUR mit validem JSON. Keine Erklärungen außerhalb des JSON.`;

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return Response.json({ success: false, error: `Claude API ${apiRes.status}: ${errText.substring(0, 200)}` });
    }

    const result = await apiRes.json();
    const rawText = result.content?.[0]?.text || '{}';

    // 5. JSON parsen
    let antrag;
    try {
      const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      antrag = JSON.parse(cleaned);
    } catch {
      antrag = { raw_text: rawText, parse_error: true };
    }

    // 6. Metadaten ergänzen
    const fullResult = {
      ...antrag,
      meta: {
        leistung: template.name,
        leistung_id: leistungId,
        bundesland: bundeslandName,
        bundesland_id: bundesland,
        plz,
        template_typ: template.typ,
        formulare: template.formulare,
        generated_at: new Date().toISOString(),
        ocr_docs_count: ocrData.length,
      },
    };

    // 7. In Supabase speichern
    await supaFetch(`applications?id=eq.${application_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        generated_antrag: fullResult,
        updated_at: new Date().toISOString(),
      }),
    });

    // 8. Status-Update
    const ausgefuellt = Object.keys(antrag.ausgefuellte_felder || {}).length;
    const fehlend = (antrag.fehlende_felder || []).length;
    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id,
        status: 'submitted',
        message: `Antrag automatisch erstellt. ${ausgefuellt} Felder ausgefüllt, ${fehlend} Felder fehlen noch.`,
      }),
    });

    return Response.json({ success: true, antrag: fullResult });

  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
