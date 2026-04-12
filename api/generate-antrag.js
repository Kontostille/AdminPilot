export const config = { runtime: 'edge' };

// Automatische Antragserstellung via Claude API
// Nimmt OCR-Daten und generiert ausgefüllten Behördenantrag als strukturierte Daten

const FORM_TEMPLATES = {
  wohngeld: {
    name: 'Wohngeldantrag',
    behoerde: 'Wohngeldbehörde der zuständigen Gemeinde',
    fields: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'haushaltsmitglieder_anzahl', 'haushaltsmitglieder_details',
      'bruttoeinkommen_monatlich', 'nettoeinkommen_monatlich',
      'kaltmiete', 'warmmiete', 'nebenkosten', 'heizkosten',
      'wohnflaeche_qm', 'anzahl_raeume',
      'bankverbindung', 'begruendung',
    ],
  },
  kindergeld: {
    name: 'Kindergeldantrag (KG1)',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    fields: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'kinder_anzahl', 'kinder_details',
      'steuer_id_antragsteller', 'steuer_id_kinder',
      'bankverbindung',
    ],
  },
  kinderzuschlag: {
    name: 'Kinderzuschlagsantrag',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    fields: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'bruttoeinkommen_monatlich', 'nettoeinkommen_monatlich',
      'kinder_anzahl', 'kinder_details', 'warmmiete',
      'bankverbindung',
    ],
  },
  'kv-zuschuss': {
    name: 'Antrag auf Beitragszuschuss (§106 SGB VI)',
    behoerde: 'Deutsche Rentenversicherung',
    fields: [
      'antragsteller_name', 'versicherungsnummer', 'antragsteller_geburtsdatum',
      'krankenkasse', 'versicherungsart', 'monatlicher_beitrag',
      'bruttorente',
    ],
  },
};

export default async function handler(request) {
  if (request.method !== 'POST') return Response.json({ error: 'POST only' }, { status: 405 });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) return Response.json({ error: 'API key missing' }, { status: 500 });

  try {
    const { application_id, leistung_id, ocr_data, user_data } = await request.json();

    const template = FORM_TEMPLATES[leistung_id] || FORM_TEMPLATES.wohngeld;

    const prompt = `Du bist ein Experte für deutsche Behördenanträge. Erstelle einen vollständig ausgefüllten ${template.name} basierend auf den folgenden extrahierten Daten.

EXTRAHIERTE DATEN AUS DOKUMENTEN:
${JSON.stringify(ocr_data, null, 2)}

NUTZERDATEN:
${JSON.stringify(user_data, null, 2)}

ZUSTÄNDIGE BEHÖRDE: ${template.behoerde}

BENÖTIGTE FELDER: ${template.fields.join(', ')}

Erstelle den Antrag als strukturiertes JSON mit:
1. "formular_daten": Alle Felder des Antrags mit eingetragenen Werten
2. "fehlende_daten": Liste der Felder die NICHT aus den Dokumenten befüllt werden konnten
3. "anschreiben": Ein kurzes, formelles Anschreiben an die Behörde (2-3 Sätze)
4. "hinweise": Tipps für den Antragsteller (z.B. fehlende Dokumente nachreichen)
5. "behoerde_adresse": Die typische Adresse/Kontakt der zuständigen Behörde

Antworte NUR mit JSON.`;

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!apiRes.ok) {
      return Response.json({ success: false, error: `API ${apiRes.status}` });
    }

    const result = await apiRes.json();
    const rawText = result.content?.[0]?.text || '{}';

    let parsed;
    try {
      parsed = JSON.parse(rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim());
    } catch {
      parsed = { raw_text: rawText, parse_error: true };
    }

    return Response.json({
      success: true,
      antrag: parsed,
      template_name: template.name,
      behoerde: template.behoerde,
      generated_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message });
  }
}
