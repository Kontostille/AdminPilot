// AdminPilot – Formular-Konfiguration
// Exakte Felder, Anlagen, Nachweise und Einreichungswege pro Leistung
// Wird von generate-antrag.js verwendet

export const FORM_CONFIG = {

  // ================================================================
  // 1. KINDERGELD (KG1)
  // ================================================================
  kindergeld: {
    name: 'Antrag auf Kindergeld',
    kennung: 'KG1',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    pdf_template: 'bundesweit/KG1_Kindergeld.pdf',
    anlagen: [
      { kennung: 'KG1-AnK', name: 'Anlage Kind', pdf: 'bundesweit/KG1-AnK_Anlage_Kind.pdf', pro_kind: true },
    ],
    einreichung: {
      bevorzugt: 'email',
      online_portal: 'https://www.arbeitsagentur.de/familie-und-kinder/infos-rund-um-kindergeld/kindergeld-anspruch-hoehe-dauer',
      online_hinweis: 'Mit BundID kann der Antrag auch komplett online eingereicht werden.',
      email_an: 'Zuständige Familienkasse (wird anhand PLZ ermittelt)',
      betreff_muster: 'Antrag auf Kindergeld – {antragsteller_name}',
    },
    nachweise: [
      'Geburtsurkunde oder Geburtsbescheinigung des Kindes (Kopie)',
      'Personalausweis oder Reisepass des Antragstellers (Kopie)',
      'Steuer-Identifikationsnummer des Antragstellers',
      'Steuer-Identifikationsnummer des Kindes',
      'Vollmacht (falls durch AdminPilot eingereicht)',
    ],
    felder: {
      // Abschnitt 1: Antragsteller
      familienname: { label: 'Familienname', pdf_feld: 'Familienname', ocr_quellen: ['name', 'antragsteller_name', 'familienname'] },
      vorname: { label: 'Vorname', pdf_feld: 'Vorname', ocr_quellen: ['vorname', 'antragsteller_vorname'] },
      geburtsdatum: { label: 'Geburtsdatum', pdf_feld: 'Geburtsdatum', format: 'TT.MM.JJJJ', ocr_quellen: ['geburtsdatum'] },
      geburtsname: { label: 'Ggf. Geburtsname', pdf_feld: 'Geburtsname', optional: true },
      geschlecht: { label: 'Geschlecht', pdf_feld: 'Geschlecht', optionen: ['männlich', 'weiblich', 'divers'] },
      staatsangehoerigkeit: { label: 'Staatsangehörigkeit', pdf_feld: 'Staatsangehörigkeit', default: 'deutsch' },
      familienstand: { label: 'Familienstand', pdf_feld: 'Familienstand', optionen: ['ledig', 'verheiratet', 'geschieden', 'verwitwet'] },
      strasse_hausnr: { label: 'Straße, Hausnummer', pdf_feld: 'Strasse', ocr_quellen: ['adresse', 'strasse'] },
      plz: { label: 'PLZ', pdf_feld: 'PLZ', ocr_quellen: ['plz', 'postleitzahl'] },
      wohnort: { label: 'Wohnort', pdf_feld: 'Wohnort', ocr_quellen: ['ort', 'wohnort', 'stadt'] },
      telefon: { label: 'Telefon', pdf_feld: 'Telefon', optional: true },
      steuer_id: { label: 'Steuer-ID', pdf_feld: 'SteuerID', ocr_quellen: ['steuer_id', 'identifikationsnummer'] },
      // Abschnitt 2: Ehepartner
      ehepartner_name: { label: 'Name Ehepartner/Partner', pdf_feld: 'EhepartnerName', optional: true },
      ehepartner_geburtsdatum: { label: 'Geburtsdatum Ehepartner', pdf_feld: 'EhepartnerGeb', format: 'TT.MM.JJJJ', optional: true },
      ehepartner_staatsangehoerigkeit: { label: 'Staatsangehörigkeit Ehepartner', optional: true },
      // Abschnitt 3: Bankverbindung
      iban: { label: 'IBAN', pdf_feld: 'IBAN', ocr_quellen: ['iban', 'bankverbindung'] },
      kontoinhaber: { label: 'Kontoinhaber', pdf_feld: 'Kontoinhaber' },
      // Abschnitt Anlage Kind (pro Kind)
      kind_name: { label: 'Name des Kindes', anlage: 'KG1-AnK' },
      kind_vorname: { label: 'Vorname des Kindes', anlage: 'KG1-AnK' },
      kind_geburtsdatum: { label: 'Geburtsdatum', anlage: 'KG1-AnK', format: 'TT.MM.JJJJ' },
      kind_steuer_id: { label: 'Steuer-ID des Kindes', anlage: 'KG1-AnK' },
      kind_wohnort: { label: 'Wohnt das Kind bei Ihnen?', anlage: 'KG1-AnK', optionen: ['ja', 'nein'] },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich Kindergeld für {anzahl_kinder} Kind(er). Die erforderlichen Unterlagen (Anlage Kind, Geburtsurkunde) liegen bei.\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },

  // ================================================================
  // 2. KINDERZUSCHLAG (KiZ1)
  // ================================================================
  kinderzuschlag: {
    name: 'Antrag auf Kinderzuschlag',
    kennung: 'KiZ1',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    typ: 'bundesweit',
    pdf_template: 'bundesweit/KiZ1_Kinderzuschlag.pdf',
    anlagen: [
      { kennung: 'KiZ1-AnA', name: 'Anlage Antragsteller/Partner', pdf: 'bundesweit/KiZ1-AnA_Anlage_Antragsteller.pdf', pflicht: true },
      { kennung: 'KiZ1-AnK', name: 'Anlage Kind', pdf: 'bundesweit/KiZ1-AnK_Anlage_Kind.pdf', pro_kind: true },
    ],
    einreichung: {
      bevorzugt: 'email',
      online_portal: 'https://kiz-digital.de',
      online_hinweis: 'Mit BundID kann der Antrag komplett online eingereicht werden (kiz-digital.de).',
      email_an: 'Zuständige Familienkasse',
      betreff_muster: 'Antrag auf Kinderzuschlag – {antragsteller_name}',
    },
    nachweise: [
      'Einkommensnachweise der letzten 6 Monate (Gehaltsabrechnungen)',
      'Mietvertrag oder aktuelle Mietbescheinigung',
      'Kontoauszüge der letzten 3 Monate (Vermögensnachweis)',
      'Kindergeldbescheid (Kindergeld-Nummer)',
      'Personalausweis (Kopie)',
      'Vollmacht (falls durch AdminPilot eingereicht)',
    ],
    felder: {
      familienname: { label: 'Familienname', ocr_quellen: ['name', 'familienname'] },
      vorname: { label: 'Vorname', ocr_quellen: ['vorname'] },
      geburtsdatum: { label: 'Geburtsdatum', format: 'TT.MM.JJJJ' },
      strasse_hausnr: { label: 'Straße, Hausnummer', ocr_quellen: ['adresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      kindergeld_nr: { label: 'Kindergeld-Nummer', ocr_quellen: ['kindergeld_nr', 'kg_nr'] },
      // Anlage Antragsteller
      bruttoeinkommen: { label: 'Bruttoeinkommen/Monat (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['bruttoeinkommen', 'brutto', 'gehalt_brutto'] },
      nettoeinkommen: { label: 'Nettoeinkommen/Monat (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['nettoeinkommen', 'netto', 'gehalt_netto'] },
      partner_bruttoeinkommen: { label: 'Bruttoeinkommen Partner/Monat', anlage: 'KiZ1-AnA', optional: true },
      kaltmiete: { label: 'Kaltmiete (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['kaltmiete', 'miete_kalt', 'grundmiete'] },
      nebenkosten: { label: 'Nebenkosten ohne Heizung (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['nebenkosten'] },
      heizkosten: { label: 'Heizkosten (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['heizkosten'] },
      warmmiete: { label: 'Warmmiete gesamt (EUR)', anlage: 'KiZ1-AnA', ocr_quellen: ['warmmiete', 'miete_warm', 'gesamtmiete'] },
      iban: { label: 'IBAN', ocr_quellen: ['iban'] },
      // Anlage Kind
      kind_name: { label: 'Name Kind', anlage: 'KiZ1-AnK' },
      kind_geburtsdatum: { label: 'Geburtsdatum Kind', anlage: 'KiZ1-AnK', format: 'TT.MM.JJJJ' },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich den Kinderzuschlag gemäß §6a BKGG für {anzahl_kinder} Kind(er). Die Anlage Antragsteller/Partner sowie die Anlagen Kind und erforderliche Nachweise liegen bei.\n\nMeine Kindergeld-Nummer: {kindergeld_nr}\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },

  // ================================================================
  // 3. KV-ZUSCHUSS (R0820)
  // ================================================================
  'kv-zuschuss': {
    name: 'Antrag auf Zuschuss zur Krankenversicherung (§106 SGB VI)',
    kennung: 'R0820',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    pdf_template: 'bundesweit/R0820_KV_Zuschuss.pdf',
    anlagen: [],
    einreichung: {
      bevorzugt: 'online',
      online_portal: 'https://www.eservice-drv.de/eantrag/hinweis-ohne-karte-direkt.seam?formular=r0820',
      online_hinweis: 'Kann direkt über eService-drv.de online eingereicht werden.',
      email_an: 'Zuständiger DRV-Träger',
      betreff_muster: 'Antrag auf Zuschuss zur KV nach §106 SGB VI – Versicherungsnr. {versicherungsnummer}',
    },
    nachweise: [
      'Rentenbescheid (Kopie)',
      'Nachweis der KV-Mitgliedschaft (Bescheinigung der Krankenkasse)',
      'Bei privater KV: Beitragsnachweis',
      'Vollmacht für AdminPilot (Feld "Bevollmächtigter" im Formular!)',
    ],
    hinweis_vollmacht: 'Das R0820 hat auf Seite 1 ein eigenes Feld "Bevollmächtigter" – hier AdminPilot eintragen.',
    felder: {
      familienname_vorname: { label: 'Familienname, Vorname', ocr_quellen: ['name', 'antragsteller'] },
      versicherungsnummer: { label: 'Rentenversicherungsnummer', ocr_quellen: ['versicherungsnummer', 'rv_nummer', 'sozialversicherungsnummer'] },
      geburtsdatum: { label: 'Geburtsdatum', format: 'TT.MM.JJJJ' },
      strasse_hausnr: { label: 'Straße, Hausnummer', ocr_quellen: ['adresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      // Bevollmächtigter (AdminPilot)
      bevollmaechtigter_name: { label: 'Bevollmächtigter', default: 'ALEVOR Mittelstandspartner GmbH (AdminPilot)' },
      bevollmaechtigter_adresse: { label: 'Adresse Bevollmächtigter', default: 'Titurelstraße 10, 81925 München' },
      // KV-Angaben
      krankenkasse_name: { label: 'Name der Krankenkasse', ocr_quellen: ['krankenkasse', 'kv_name', 'versicherung'] },
      versicherungsart: { label: 'Versicherungsart', optionen: ['freiwillig gesetzlich', 'privat'], ocr_quellen: ['versicherungsart'] },
      kv_beitrag_monatlich: { label: 'Monatlicher KV-Beitrag (EUR)', ocr_quellen: ['kv_beitrag', 'versicherungsbeitrag'] },
      bruttorente: { label: 'Monatliche Bruttorente (EUR)', ocr_quellen: ['bruttorente', 'rente_brutto', 'monatsrente'] },
      rentenbeginn: { label: 'Rentenbeginn (Datum)', format: 'MM.JJJJ', ocr_quellen: ['rentenbeginn'] },
      weitere_rente: { label: 'Weitere Rente?', optionen: ['nein', 'ja'], default: 'nein' },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich als Bevollmächtigter für {antragsteller_name} (Vers.-Nr.: {versicherungsnummer}) einen Zuschuss zur Krankenversicherung nach §106 SGB VI.\n\nDie Vollmacht liegt bei. {antragsteller_name} ist {versicherungsart} krankenversichert bei {krankenkasse_name}.\n\nMit freundlichen Grüßen\nALEVOR Mittelstandspartner GmbH\n(AdminPilot)',
  },

  // ================================================================
  // 4. KINDERERZIEHUNGSZEITEN (V0800)
  // ================================================================
  kindererziehungszeiten: {
    name: 'Antrag auf Feststellung von Kindererziehungszeiten',
    kennung: 'V0800',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'bundesweit',
    pdf_template: 'bundesweit/V0800_Kindererziehungszeiten.pdf',
    anlagen: [
      { kennung: 'V0805', name: 'Angaben zur Kindererziehung', pdf: 'bundesweit/V0805_Angaben_Kindererziehung.pdf', pro_kind: true },
    ],
    einreichung: {
      bevorzugt: 'online',
      online_portal: 'https://www.eservice-drv.de/eantrag/hinweis-ohne-karte-direkt.seam?formular=v0800',
      online_hinweis: 'Kann direkt über eAntrag DRV online eingereicht werden.',
      email_an: 'Zuständiger DRV-Träger',
      betreff_muster: 'Antrag auf Kindererziehungszeiten – Versicherungsnr. {versicherungsnummer}',
    },
    nachweise: [
      'Geburtsurkunden der Kinder (Kopie)',
      'Personalausweis (Kopie)',
      'Rentenversicherungsnummer',
      'Vollmacht für AdminPilot',
    ],
    felder: {
      familienname_vorname: { label: 'Familienname, Vorname', ocr_quellen: ['name'] },
      versicherungsnummer: { label: 'Rentenversicherungsnummer', ocr_quellen: ['versicherungsnummer', 'rv_nummer'] },
      geburtsdatum: { label: 'Geburtsdatum', format: 'TT.MM.JJJJ' },
      strasse_hausnr: { label: 'Straße, Hausnummer', ocr_quellen: ['adresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      // Pro Kind (V0805)
      kind_1_name: { label: 'Name Kind 1' },
      kind_1_geburtsdatum: { label: 'Geburtsdatum Kind 1', format: 'TT.MM.JJJJ' },
      kind_1_erzogen_von_geburt: { label: 'Von Geburt an erzogen?', optionen: ['ja', 'nein'], default: 'ja' },
      kind_2_name: { label: 'Name Kind 2', optional: true },
      kind_2_geburtsdatum: { label: 'Geburtsdatum Kind 2', optional: true },
      kind_3_name: { label: 'Name Kind 3', optional: true },
      kind_3_geburtsdatum: { label: 'Geburtsdatum Kind 3', optional: true },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich die Feststellung von Kindererziehungszeiten für {anzahl_kinder} Kind(er) gemäß §56 SGB VI. Die Geburtsurkunden und der Fragebogen V0805 liegen bei.\n\nVersicherungsnummer: {versicherungsnummer}\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },

  // ================================================================
  // 5. EM-RENTENZUSCHLAG
  // ================================================================
  'em-zuschlag': {
    name: 'Erwerbsminderungsrenten-Zuschlag',
    kennung: 'automatisch',
    behoerde: 'Deutsche Rentenversicherung',
    typ: 'kein_antrag',
    pdf_template: null,
    anlagen: [],
    einreichung: { bevorzugt: 'info' },
    nachweise: [],
    felder: {},
    hinweis: 'Der EM-Rentenzuschlag wird AUTOMATISCH von der DRV geprüft. Kein separater Antrag nötig. Empfehlung: Kontenklärung (V0100) durchführen lassen, damit alle Zeiten korrekt erfasst sind.',
    anschreiben_vorlage: null,
  },

  // ================================================================
  // 6. WOHNGELD
  // ================================================================
  wohngeld: {
    name: 'Wohngeldantrag (Mietzuschuss)',
    kennung: 'WG-MZ',
    behoerde: 'Wohngeldbehörde der Gemeinde/Stadt',
    typ: 'land',
    pdf_template: 'wohngeld/{bundesland}.pdf',
    anlagen: [],
    einreichung: {
      bevorzugt: 'email',
      online_portal: null, // Wird pro Bundesland gesetzt
      online_hinweis: 'Online-Einreichung nur in einigen Bundesländern möglich (Berlin, Brandenburg, NRW).',
      email_an: 'Wohngeldbehörde der zuständigen Gemeinde (anhand PLZ ermitteln)',
      betreff_muster: 'Wohngeldantrag Mietzuschuss – {antragsteller_name}, {plz} {wohnort}',
    },
    online_pro_land: {
      be: 'https://service.berlin.de/dienstleistung/120656/',
      bb: 'https://serviceportal.gemeinsamonline.de/Onlinedienste/Service/Entry/WOGEMIZUEA',
      nw: 'https://www.mhkbd.nrw/themenportal/wohngeld',
      mv: 'https://www.mv-serviceportal.de/leistung/?leistungId=109769681',
    },
    nachweise: [
      'Mietvertrag (Kopie)',
      'Mietbescheinigung (vom Vermieter ausgefüllt)',
      'Einkommensnachweise aller Haushaltsmitglieder (letzte 3 Monate)',
      'Personalausweis (Kopie)',
      'Rentenbescheid (falls Rentner)',
      'Kontoauszüge (letzte 3 Monate)',
      'Vollmacht für AdminPilot',
    ],
    felder: {
      familienname: { label: 'Familienname', ocr_quellen: ['name', 'familienname', 'mieter'] },
      vorname: { label: 'Vorname', ocr_quellen: ['vorname'] },
      geburtsdatum: { label: 'Geburtsdatum', format: 'TT.MM.JJJJ' },
      strasse_hausnr: { label: 'Anschrift der Wohnung', ocr_quellen: ['adresse', 'mietadresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      haushalt_anzahl: { label: 'Personen im Haushalt', ocr_quellen: ['haushaltsmitglieder', 'personen'] },
      haushalt_details: { label: 'Name + Geburtsdatum aller Haushaltsmitglieder' },
      bruttoeinkommen: { label: 'Bruttoeinkommen Haushalt/Monat (EUR)', ocr_quellen: ['bruttoeinkommen', 'brutto', 'einkommen'] },
      nettoeinkommen: { label: 'Nettoeinkommen Haushalt/Monat (EUR)', ocr_quellen: ['nettoeinkommen', 'netto'] },
      bruttorente: { label: 'Bruttorente/Monat (falls Rentner)', ocr_quellen: ['bruttorente', 'rente'] },
      kaltmiete: { label: 'Kaltmiete (EUR)', ocr_quellen: ['kaltmiete', 'grundmiete', 'nettomiete'] },
      nebenkosten: { label: 'Nebenkosten ohne Heizung (EUR)', ocr_quellen: ['nebenkosten', 'betriebskosten'] },
      heizkosten: { label: 'Heizkosten (EUR)', ocr_quellen: ['heizkosten'] },
      warmmiete: { label: 'Gesamte Warmmiete (EUR)', ocr_quellen: ['warmmiete', 'gesamtmiete', 'miete'] },
      wohnflaeche: { label: 'Wohnfläche (m²)', ocr_quellen: ['wohnflaeche', 'flaeche', 'qm'] },
      zimmer: { label: 'Anzahl Zimmer', ocr_quellen: ['zimmer', 'raeume'] },
      einzugsdatum: { label: 'Einzugsdatum', format: 'TT.MM.JJJJ', ocr_quellen: ['einzug', 'mietbeginn'] },
      vermieter_name: { label: 'Name des Vermieters', ocr_quellen: ['vermieter', 'vermieter_name'] },
      vermieter_adresse: { label: 'Adresse des Vermieters', ocr_quellen: ['vermieter_adresse'] },
      iban: { label: 'IBAN', ocr_quellen: ['iban'] },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich Wohngeld als Mietzuschuss für die Wohnung in {strasse_hausnr}, {plz_ort}.\n\nIm Haushalt leben {haushalt_anzahl} Person(en). Die monatliche Warmmiete beträgt {warmmiete} EUR.\n\nDie erforderlichen Nachweise (Mietvertrag, Einkommensnachweise) liegen bei.\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },

  // ================================================================
  // 7. BASISELTERNGELD
  // ================================================================
  elterngeld: {
    name: 'Antrag auf Elterngeld',
    kennung: 'EG',
    behoerde: 'Landeselterngeldstelle',
    typ: 'land',
    pdf_template: 'elterngeld/{bundesland}.pdf',
    anlagen: [],
    einreichung: {
      bevorzugt: 'online',
      online_portal: 'https://www.elterngeld-digital.de',
      online_hinweis: 'ElterngeldDigital.de ist bundesweit verfügbar (mit BundID). Alternative: PDF an Landesstelle.',
      email_an: 'Zuständige Elterngeldstelle des Bundeslandes',
      betreff_muster: 'Antrag auf Elterngeld – {antragsteller_name}, Kind geb. {kind_geburtsdatum}',
    },
    behoerde_pro_land: {
      by: 'Zentrum Bayern Familie und Soziales (ZBFS)',
      bw: 'L-Bank Baden-Württemberg',
      be: 'Jugendamt Berlin',
      nw: 'Versorgungsamt NRW',
    },
    nachweise: [
      'Geburtsurkunde des Kindes (Original oder beglaubigte Kopie!)',
      'Bescheinigung der Krankenkasse über Mutterschaftsgeld',
      'Arbeitgeberbescheinigung über Zuschuss zum Mutterschaftsgeld',
      'Einkommensnachweise 12 Monate vor Geburt (Gehaltsabrechnungen)',
      'Personalausweis (Kopie)',
      'Vollmacht für AdminPilot',
    ],
    hinweis_original: 'ACHTUNG: Elterngeldstellen verlangen oft ORIGINALE Geburtsurkunde! Kann nicht per E-Mail gesendet werden. Nutzer muss Geburtsurkunde per Post nachreichen.',
    felder: {
      familienname: { label: 'Familienname', ocr_quellen: ['name'] },
      vorname: { label: 'Vorname', ocr_quellen: ['vorname'] },
      geburtsdatum: { label: 'Geburtsdatum Antragsteller', format: 'TT.MM.JJJJ' },
      strasse_hausnr: { label: 'Anschrift', ocr_quellen: ['adresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      steuer_id: { label: 'Steuer-Identifikationsnummer', ocr_quellen: ['steuer_id'] },
      kind_name: { label: 'Name des Kindes' },
      kind_geburtsdatum: { label: 'Geburtsdatum des Kindes', format: 'TT.MM.JJJJ' },
      bruttoeinkommen_vor_geburt: { label: 'Brutto-Einkommen 12 Mon. vor Geburt (EUR/Monat)', ocr_quellen: ['bruttoeinkommen', 'gehalt'] },
      arbeitgeber: { label: 'Arbeitgeber Name + Adresse', ocr_quellen: ['arbeitgeber'] },
      elternzeit_von: { label: 'Elternzeit von (Datum)', format: 'TT.MM.JJJJ' },
      elternzeit_bis: { label: 'Elternzeit bis (Datum)', format: 'TT.MM.JJJJ' },
      basiselterngeld_monate: { label: 'Gewünschte Monate BasisElterngeld (1-12)' },
      elterngeldplus_monate: { label: 'Gewünschte Monate ElterngeldPlus', optional: true },
      iban: { label: 'IBAN', ocr_quellen: ['iban'] },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich Elterngeld für mein Kind {kind_name}, geboren am {kind_geburtsdatum}.\n\nIch beantrage BasisElterngeld für {basiselterngeld_monate} Monate.\n\nDie Geburtsurkunde und Einkommensnachweise liegen bei.\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },

  // ================================================================
  // 8. BILDUNG & TEILHABE
  // ================================================================
  'bildung-teilhabe': {
    name: 'Antrag auf Leistungen für Bildung und Teilhabe',
    kennung: 'BuT',
    behoerde: 'Sozialbürgerhaus / Jobcenter der Kommune',
    typ: 'kommune',
    pdf_template: 'but/{plz_prefix}.pdf',
    anlagen: [],
    einreichung: {
      bevorzugt: 'email',
      online_portal: null,
      online_hinweis: 'Einige Städte bieten Online-Anträge. BuT kann auch FORMLOS beantragt werden!',
      email_an: 'Zuständiges Sozialbürgerhaus / Jobcenter (anhand PLZ)',
      betreff_muster: 'Antrag auf Bildungs- und Teilhabeleistungen – {antragsteller_name}',
    },
    hinweis_formlos: 'BuT kann formlos beantragt werden! Ein Anschreiben mit den relevanten Daten reicht aus, wenn kein kommunales Formular vorliegt.',
    nachweise: [
      'Nachweis über Leistungsbezug (Wohngeldbescheid, Kinderzuschlagbescheid oder Bürgergeld-Bescheid)',
      'Schulbescheinigung des Kindes',
      'Bei Lernförderung: Bestätigung der Schule über Bedarf',
      'Bei Mittagessen: Bestätigung der Schule/Kita',
      'Bei Teilhabe: Bestätigung des Vereins/Anbieters',
      'Personalausweis (Kopie)',
    ],
    felder: {
      antragsteller_name: { label: 'Name Antragsteller (Elternteil)', ocr_quellen: ['name'] },
      antragsteller_adresse: { label: 'Anschrift', ocr_quellen: ['adresse'] },
      plz_ort: { label: 'PLZ und Ort' },
      leistungsbezug: { label: 'Art des Leistungsbezugs', optionen: ['Wohngeld', 'Kinderzuschlag', 'Bürgergeld', 'Sozialhilfe'] },
      aktenzeichen: { label: 'Aktenzeichen / Bescheid-Nr.', ocr_quellen: ['aktenzeichen', 'bescheid_nr'] },
      kind_name: { label: 'Name des Kindes' },
      kind_geburtsdatum: { label: 'Geburtsdatum des Kindes', format: 'TT.MM.JJJJ' },
      kind_schule: { label: 'Schule/Kita (Name + Adresse)' },
      beantragte_leistungen: { label: 'Beantragte BuT-Leistungen', optionen: ['Schulbedarf', 'Ausflüge/Klassenfahrten', 'Schülerbeförderung', 'Lernförderung', 'Mittagsverpflegung', 'Teilhabe (Sport/Kultur, 15€/Monat)'] },
    },
    anschreiben_vorlage: 'Sehr geehrte Damen und Herren,\n\nhiermit beantrage ich Leistungen für Bildung und Teilhabe für mein Kind {kind_name} (geb. {kind_geburtsdatum}), das die Schule/Kita {kind_schule} besucht.\n\nWir beziehen derzeit {leistungsbezug} (Aktenzeichen: {aktenzeichen}).\n\nBeantragt werden: {beantragte_leistungen}.\n\nMit freundlichen Grüßen\n{antragsteller_name}',
  },
};

// Hilfsfunktion: OCR-Daten auf Formularfelder mappen
export function mapOcrToFields(ocrData, formConfig) {
  const result = {};
  const missing = [];

  for (const [feldId, feld] of Object.entries(formConfig.felder)) {
    let value = null;

    // 1. Versuche aus OCR-Daten zu extrahieren
    if (feld.ocr_quellen) {
      for (const ocrObj of (Array.isArray(ocrData) ? ocrData : [ocrData])) {
        for (const quelle of feld.ocr_quellen) {
          if (ocrObj[quelle] && !value) {
            value = ocrObj[quelle];
          }
        }
      }
    }

    // 2. Default-Wert
    if (!value && feld.default) {
      value = feld.default;
    }

    // 3. Ergebnis
    if (value) {
      result[feldId] = value;
    } else if (!feld.optional) {
      missing.push({ id: feldId, label: feld.label });
    }
  }

  return { ausgefuellt: result, fehlend: missing };
}
