export const config = { runtime: 'edge' };

// =====================================================
// AUTO-ANTRAGSERSTELLUNG v3 – RDG-konforme Ausfuellhilfe
// =====================================================
// 1. Prüft ob PDF-Template in Supabase vorhanden
// 2. Wenn ja: Mappt OCR-Daten auf Formularfelder
// 3. Wenn nein: Generiert formellen Antrag als Anschreiben (Kunde = Antragsteller)
// 4. Speichert Ergebnis in applications.generated_antrag
// 5. Setzt Status auf "antrag_bereit" (Kunde reicht selbst ein)

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

async function templateExists(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/public/templates/${path}`, {
      method: 'HEAD', headers: { 'apikey': SUPABASE_KEY },
    });
    return res.ok;
  } catch { return false; }
}

// === LEISTUNGS-KONFIGURATION ===
// Vollmacht-Referenzen komplett entfernt. Kunde ist Antragsteller.
const L = {
  kindergeld: {
    name: 'Kindergeld', kennung: 'KG1',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    templates: ['bundesweit/KG1_Kindergeld.pdf'],
    portal: 'https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/kindergeld-anspruch-hoehe-dauer',
    felder: ['Familienname','Vorname','Geburtsdatum (TT.MM.JJJJ)','Geburtsname','Staatsangehörigkeit','Familienstand','Straße + Hausnummer','PLZ','Wohnort','Steuer-ID','Telefon','Name Ehepartner/Partner','Geburtsdatum Ehepartner','IBAN','Kontoinhaber','Pro Kind: Name, Vorname, Geburtsdatum, Steuer-ID, wohnt im Haushalt (ja/nein)'],
    nachweise: ['Geburtsurkunde Kind (Kopie)','Steuer-ID Antragsteller + Kind','Personalausweis (Kopie)'],
  },
  kinderzuschlag: {
    name: 'Kinderzuschlag', kennung: 'KiZ1',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    templates: ['bundesweit/KiZ1_Kinderzuschlag.pdf'],
    portal: 'https://kiz-digital.de',
    felder: ['Familienname','Vorname','Geburtsdatum','Adresse','Kindergeld-Nummer','Bruttoeinkommen Antragsteller (EUR/Monat)','Nettoeinkommen Antragsteller','Bruttoeinkommen Partner','Nettoeinkommen Partner','Kaltmiete (EUR)','Nebenkosten (EUR)','Heizkosten (EUR)','Warmmiete gesamt (EUR)','IBAN','Pro Kind: Name, Geburtsdatum'],
    nachweise: ['Einkommensnachweise letzte 6 Monate','Mietvertrag/Mietbescheinigung','Kontoauszüge letzte 3 Monate','Kindergeldbescheid'],
  },
  'kv-zuschuss': {
    name: 'Zuschuss zur KV (§106 SGB VI)', kennung: 'R0820',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    templates: ['bundesweit/R0820_KV_Zuschuss.pdf'],
    portal: 'https://www.eservice-drv.de/eantrag/hinweis-ohne-karte-direkt.seam?formular=r0820',
    felder: ['Familienname, Vorname','Rentenversicherungsnummer','Geburtsdatum','Adresse','Krankenkasse','Versicherungsart (freiwillig gesetzlich/privat)','Monatlicher KV-Beitrag (EUR)','Bruttorente (EUR/Monat)','Rentenbeginn'],
    nachweise: ['Rentenbescheid (Kopie)','KV-Mitgliedsbescheinigung','Bei privater KV: Beitragsnachweis'],
  },
  kindererziehungszeiten: {
    name: 'Kindererziehungszeiten', kennung: 'V0800',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    templates: ['bundesweit/V0800_Kindererziehungszeiten.pdf'],
    portal: 'https://www.eservice-drv.de/eantrag/hinweis-ohne-karte-direkt.seam?formular=v0800',
    felder: ['Familienname, Vorname','Rentenversicherungsnummer','Geburtsdatum','Adresse','Pro Kind: Name, Geburtsdatum, von Geburt an erzogen (ja/nein)'],
    nachweise: ['Geburtsurkunden Kinder (Kopie)','Rentenversicherungsnummer'],
  },
  'em-zuschlag': {
    name: 'EM-Rentenzuschlag', kennung: 'automatisch',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'kein_antrag', templates: [], felder: [], nachweise: [],
    hinweis: 'Wird automatisch von der DRV geprüft. Kein Antrag nötig. Empfehlung: Kontenklärung (V0100) beantragen.',
  },
  wohngeld: {
    name: 'Wohngeld (Mietzuschuss)', kennung: 'WG-MZ',
    behoerde: 'Wohngeldbehörde der zuständigen Gemeinde/Stadt',
    typ: 'land', template_pfad: 'wohngeld/{bl}.pdf',
    felder: ['Familienname','Vorname','Geburtsdatum','Adresse der Wohnung','Personen im Haushalt','Name + Geburtsdatum aller Haushaltsmitglieder','Bruttoeinkommen Haushalt (EUR/Monat)','Nettoeinkommen Haushalt','Bruttorente (falls Rentner)','Kaltmiete (EUR)','Nebenkosten ohne Heizung (EUR)','Heizkosten (EUR)','Warmmiete gesamt (EUR)','Wohnfläche (m²)','Anzahl Zimmer','Einzugsdatum','Vermieter Name + Adresse','IBAN'],
    nachweise: ['Mietvertrag (Kopie)','Mietbescheinigung (vom Vermieter)','Einkommensnachweise (3 Monate)','Rentenbescheid (falls Rentner)','Personalausweis (Kopie)'],
  },
  elterngeld: {
    name: 'Elterngeld', kennung: 'EG',
    behoerde: 'Landeselterngeldstelle',
    typ: 'land', template_pfad: 'elterngeld/{bl}.pdf',
    portal: 'https://www.elterngeld-digital.de',
    felder: ['Familienname','Vorname','Geburtsdatum','Adresse','Steuer-ID','Name des Kindes','Geburtsdatum Kind','Bruttoeinkommen 12 Mon. vor Geburt (EUR/Monat)','Arbeitgeber','Elternzeit von-bis','Monate BasisElterngeld','Monate ElterngeldPlus (optional)','IBAN'],
    nachweise: ['Geburtsurkunde Kind (ORIGINAL!)','Bescheinigung Mutterschaftsgeld','Arbeitgeberbescheinigung','Gehaltsabrechnungen 12 Monate'],
    hinweis: 'Elterngeldstellen verlangen oft ORIGINALE Geburtsurkunde per Post.',
  },
  'bildung-teilhabe': {
    name: 'Bildung und Teilhabe', kennung: 'BuT',
    behoerde: 'Sozialbürgerhaus / Jobcenter',
    typ: 'kommune', template_pfad: 'but/{plz2}.pdf',
    formlos: true,
    felder: ['Name Antragsteller','Adresse','Leistungsbezug (Wohngeld/KiZ/Bürgergeld)','Aktenzeichen','Name Kind','Geburtsdatum Kind','Schule/Kita (Name + Adresse)','Beantragte Leistungen (Schulbedarf, Ausflüge, Mittagessen, Nachhilfe, Teilhabe)'],
    nachweise: ['Leistungsbescheid (Wohngeld/KiZ/Bürgergeld)','Schulbescheinigung'],
  },
};

const BL = { bw:'Baden-Württemberg',by:'Bayern',be:'Berlin',bb:'Brandenburg',hb:'Bremen',hh:'Hamburg',he:'Hessen',mv:'Mecklenburg-Vorpommern',ni:'Niedersachsen',nw:'Nordrhein-Westfalen',rp:'Rheinland-Pfalz',sl:'Saarland',sn:'Sachsen',st:'Sachsen-Anhalt',sh:'Schleswig-Holstein',th:'Thüringen' };

export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });
  if (!ANTHROPIC_API_KEY) return Response.json({ error: 'ANTHROPIC_API_KEY missing' }, { status: 500 });

  try {
    const { application_id } = await request.json();
    if (!application_id) return Response.json({ success: false, error: 'application_id required' });

    const [app] = await supaFetch(`applications?id=eq.${application_id}&select=*`);
    if (!app) return Response.json({ success: false, error: 'Application not found' });

    const cfg = L[app.leistung_id];
    if (!cfg) return Response.json({ success: false, error: `Unknown: ${app.leistung_id}` });

    // Kein Antrag nötig (z.B. EM-Rentenzuschlag)
    if (cfg.typ === 'kein_antrag') {
      const r = { modus: 'kein_antrag', hinweis: cfg.hinweis, meta: { leistung: cfg.name } };
      await supaFetch(`applications?id=eq.${application_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          generated_antrag: r,
          status: 'antrag_bereit',
          antrag_bereit_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
      return Response.json({ success: true, antrag: r });
    }

    // OCR laden
    const docs = await supaFetch(`documents?application_id=eq.${application_id}&ocr_status=eq.complete&select=ocr_result`);
    const ocr = (docs || []).map(d => d.ocr_result).filter(Boolean);

    // Template prüfen
    let tplPath = null;
    let hasTpl = false;
    if (cfg.typ === 'bundesweit' && cfg.templates?.[0]) {
      tplPath = cfg.templates[0];
      hasTpl = await templateExists(tplPath);
    } else if (cfg.template_pfad) {
      tplPath = cfg.template_pfad.replace('{bl}', app.bundesland).replace('{plz2}', (app.plz||'').substring(0,2));
      hasTpl = await templateExists(tplPath);
    }

    const modus = hasTpl ? 'pdf_vorhanden' : (cfg.formlos ? 'formloser_antrag' : 'anschreiben_generieren');
    const blName = BL[app.bundesland] || app.bundesland || '';

    // Claude Prompt – Kunde ist Antragsteller (nicht AdminPilot)
    const prompt = `Du bist Experte für deutsche Sozialleistungsanträge. Erstelle einen vollständigen ${cfg.name}-Antrag, der vom Kunden selbst unterschrieben und eingereicht wird.

WICHTIG: Der Kunde ist der Antragsteller. AdminPilot ist nur technischer Ausfüllservice.
Das Anschreiben muss aus der Ich-Perspektive des Kunden verfasst sein ("Hiermit beantrage ich...").
KEINE Formulierungen wie "als Bevollmächtigter" oder "im Namen von".

ANTRAG: ${cfg.name} (${cfg.kennung})
BEHÖRDE: ${cfg.behoerde}
BUNDESLAND: ${blName}
PLZ: ${app.plz}
MODUS: ${modus === 'pdf_vorhanden' ? 'PDF-Template vorhanden – alle Felder einzeln ausfüllen' : 'Kein PDF – formelles Anschreiben generieren das als eigenständiger Antrag funktioniert'}

FELDER DIE AUSGEFÜLLT WERDEN MÜSSEN:
${cfg.felder.map((f,i) => `${i+1}. ${f}`).join('\n')}

OCR-DATEN AUS HOCHGELADENEN DOKUMENTEN:
${JSON.stringify(ocr, null, 2)}

ERSTELLE DIESES JSON:
{
  "ausgefuellte_felder": { "Feldname": "Wert", ... },
  "fehlende_felder": ["Feld1", "Feld2"],
  "anschreiben": "Betreff: Antrag auf ${cfg.name}\\n\\nSehr geehrte Damen und Herren,\\n\\nhiermit beantrage ich, [Kundenname], ${cfg.name}. [weitere 3-6 Absätze mit ALLEN verfügbaren Daten. Kunde schreibt aus eigener Perspektive.]\\n\\nMit freundlichen Grüßen\\n[Datum]\\n[Unterschrift Kunde]",
  "behoerde_empfaenger": {
    "name": "Zuständige Behörde für PLZ ${app.plz}",
    "adresse": "geschätzte Adresse",
    "online_portal_hinweis": "Tipp zur Online-Einreichung falls möglich"
  },
  "einreichungsanleitung": "Konkrete Schritte für den Kunden: (1) PDF ausdrucken, (2) eigenhändig unterschreiben, (3) alle Nachweise beilegen, (4) per Post senden an [Adresse] ODER online einreichen über [Portal].",
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
    try { antrag = JSON.parse(raw.replace(/```json\s*/g,'').replace(/```\s*/g,'').trim()); }
    catch { antrag = { parse_error: true, raw: raw.substring(0,2000) }; }

    const fullResult = {
      ...antrag,
      meta: {
        leistung: cfg.name, leistung_id: app.leistung_id, kennung: cfg.kennung,
        bundesland: blName, bundesland_id: app.bundesland, plz: app.plz,
        modus, template_vorhanden: hasTpl, template_pfad: hasTpl ? tplPath : null,
        online_portal: cfg.portal || null,
        generated_at: new Date().toISOString(), ocr_count: ocr.length,
      },
      nachweise_erforderlich: cfg.nachweise,
      sonder_hinweis: cfg.hinweis || null,
    };

    // Status setzen auf "antrag_bereit" (Kunde muss jetzt einreichen)
    await supaFetch(`applications?id=eq.${application_id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        generated_antrag: fullResult,
        status: 'antrag_bereit',
        antrag_bereit_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    const nOk = Object.keys(antrag.ausgefuellte_felder || {}).length;
    const nMiss = (antrag.fehlende_felder || []).length;
    await supaFetch('status_updates', {
      method: 'POST',
      body: JSON.stringify({
        application_id, status: 'antrag_bereit',
        message: modus === 'pdf_vorhanden'
          ? `Antrag bereit (${nOk} Felder ausgefüllt, ${nMiss} fehlen). Template: ${cfg.kennung}. Bitte prüfen, unterschreiben und einreichen.`
          : `Anschreiben generiert (${nOk} Daten erkannt). Bitte prüfen, unterschreiben und einreichen.`,
      }),
    });

    return Response.json({ success: true, antrag: fullResult });
  } catch (e) {
    return Response.json({ success: false, error: e.message });
  }
}
