/* AdminPilot – Bundesländer & Formular-Templates
   Zentrale Config für Bundesland-Erkennung und Template-Zuordnung */

export const BUNDESLAENDER = [
  { id: 'bw', name: 'Baden-Württemberg', short: 'BW' },
  { id: 'by', name: 'Bayern', short: 'BY' },
  { id: 'be', name: 'Berlin', short: 'BE' },
  { id: 'bb', name: 'Brandenburg', short: 'BB' },
  { id: 'hb', name: 'Bremen', short: 'HB' },
  { id: 'hh', name: 'Hamburg', short: 'HH' },
  { id: 'he', name: 'Hessen', short: 'HE' },
  { id: 'mv', name: 'Mecklenburg-Vorpommern', short: 'MV' },
  { id: 'ni', name: 'Niedersachsen', short: 'NI' },
  { id: 'nw', name: 'Nordrhein-Westfalen', short: 'NW' },
  { id: 'rp', name: 'Rheinland-Pfalz', short: 'RP' },
  { id: 'sl', name: 'Saarland', short: 'SL' },
  { id: 'sn', name: 'Sachsen', short: 'SN' },
  { id: 'st', name: 'Sachsen-Anhalt', short: 'ST' },
  { id: 'sh', name: 'Schleswig-Holstein', short: 'SH' },
  { id: 'th', name: 'Thüringen', short: 'TH' },
];

// PLZ-Bereich → Bundesland (erste 1-2 Ziffern)
const PLZ_MAP = {
  '01': 'sn', '02': 'sn', '03': 'bb', '04': 'sn', '06': 'st', '07': 'th',
  '08': 'sn', '09': 'sn', '10': 'be', '12': 'be', '13': 'be', '14': 'bb',
  '15': 'bb', '16': 'bb', '17': 'mv', '18': 'mv', '19': 'mv', '20': 'hh',
  '21': 'ni', '22': 'hh', '23': 'sh', '24': 'sh', '25': 'sh', '26': 'ni',
  '27': 'ni', '28': 'hb', '29': 'ni', '30': 'ni', '31': 'ni', '32': 'nw',
  '33': 'nw', '34': 'he', '35': 'he', '36': 'he', '37': 'ni', '38': 'ni',
  '39': 'st', '40': 'nw', '41': 'nw', '42': 'nw', '44': 'nw', '45': 'nw',
  '46': 'nw', '47': 'nw', '48': 'nw', '49': 'ni', '50': 'nw', '51': 'nw',
  '52': 'nw', '53': 'nw', '54': 'rp', '55': 'rp', '56': 'rp', '57': 'nw',
  '58': 'nw', '59': 'nw', '60': 'he', '61': 'he', '63': 'he', '64': 'he',
  '65': 'he', '66': 'sl', '67': 'rp', '68': 'bw', '69': 'bw', '70': 'bw',
  '71': 'bw', '72': 'bw', '73': 'bw', '74': 'bw', '75': 'bw', '76': 'bw',
  '77': 'bw', '78': 'bw', '79': 'bw', '80': 'by', '81': 'by', '82': 'by',
  '83': 'by', '84': 'by', '85': 'by', '86': 'by', '87': 'by', '88': 'bw',
  '89': 'bw', '90': 'by', '91': 'by', '92': 'by', '93': 'by', '94': 'by',
  '95': 'by', '96': 'by', '97': 'by', '98': 'th', '99': 'th',
};

export function bundeslandFromPLZ(plz) {
  if (!plz || plz.length < 2) return null;
  const prefix = plz.substring(0, 2);
  return PLZ_MAP[prefix] || null;
}

export function getBundeslandName(id) {
  return BUNDESLAENDER.find(b => b.id === id)?.name || id;
}

// === FORMULAR-TEMPLATES ===
// Pfade in Supabase Storage: templates/{path}
// Typ: 'bundesweit' = gleiches PDF überall, 'land' = pro Bundesland, 'kommune' = pro Stadt

export const FORM_TEMPLATES = {
  kindergeld: {
    typ: 'bundesweit',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    einreichung: { online: 'https://www.familienkasse.de', email: true },
    formulare: [
      { id: 'KG1', name: 'Antrag auf Kindergeld', path: 'bundesweit/KG1_Kindergeld.pdf', pflicht: true },
      { id: 'KG1-AnK', name: 'Anlage Kind', path: 'bundesweit/KG1-AnK_Anlage_Kind.pdf', pflicht: true, proKind: true },
    ],
    felder: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'antragsteller_steuer_id', 'ehepartner_name', 'ehepartner_geburtsdatum',
      'kinder_name', 'kinder_geburtsdatum', 'kinder_steuer_id',
      'bankverbindung_iban',
    ],
  },

  kinderzuschlag: {
    typ: 'bundesweit',
    behoerde: 'Familienkasse der Bundesagentur für Arbeit',
    einreichung: { online: 'https://kiz-digital.de', email: true },
    formulare: [
      { id: 'KiZ1', name: 'Antrag auf Kinderzuschlag', path: 'bundesweit/KiZ1_Kinderzuschlag.pdf', pflicht: true },
      { id: 'KiZ1-AnA', name: 'Anlage Antragsteller/Partner', path: 'bundesweit/KiZ1-AnA_Anlage_Antragsteller.pdf', pflicht: true },
      { id: 'KiZ1-AnK', name: 'Anlage Kind', path: 'bundesweit/KiZ1-AnK_Anlage_Kind.pdf', pflicht: true, proKind: true },
    ],
    felder: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'bruttoeinkommen', 'nettoeinkommen', 'warmmiete', 'kaltmiete',
      'kinder_name', 'kinder_geburtsdatum', 'kindergeld_nr',
      'bankverbindung_iban',
    ],
  },

  'kv-zuschuss': {
    typ: 'bundesweit',
    behoerde: 'Deutsche Rentenversicherung',
    einreichung: { online: 'https://www.eservice-drv.de', email: true },
    formulare: [
      { id: 'R0820', name: 'Antrag auf Zuschuss zur KV', path: 'bundesweit/R0820_KV_Zuschuss.pdf', pflicht: true },
    ],
    felder: [
      'antragsteller_name', 'versicherungsnummer', 'antragsteller_geburtsdatum',
      'krankenkasse_name', 'versicherungsart', 'monatlicher_kv_beitrag',
      'bruttorente',
    ],
  },

  kindererziehungszeiten: {
    typ: 'bundesweit',
    behoerde: 'Deutsche Rentenversicherung',
    einreichung: { online: 'https://www.eservice-drv.de/eantrag', email: true },
    formulare: [
      { id: 'V0800', name: 'Antrag Kindererziehungszeiten', path: 'bundesweit/V0800_Kindererziehungszeiten.pdf', pflicht: true },
      { id: 'V0805', name: 'Angaben zur Kindererziehung', path: 'bundesweit/V0805_Angaben_Kindererziehung.pdf', pflicht: true, proKind: true },
    ],
    felder: [
      'antragsteller_name', 'versicherungsnummer', 'antragsteller_geburtsdatum',
      'kinder_name', 'kinder_geburtsdatum', 'erziehungszeitraum',
    ],
  },

  'em-zuschlag': {
    typ: 'bundesweit',
    behoerde: 'Deutsche Rentenversicherung',
    einreichung: { online: 'https://www.eservice-drv.de', email: true },
    formulare: [],
    hinweis: 'Wird automatisch von der DRV bei der Rentenberechnung geprüft. Kein separater Antrag nötig.',
  },

  wohngeld: {
    typ: 'land',
    behoerde: 'Wohngeldbehörde der Gemeinde/Stadt',
    einreichung: { online: null, email: true }, // Online je nach Bundesland
    formulare_pro_land: {
      bw: [{ id: 'WG-BW', name: 'Wohngeldantrag Baden-Württemberg', path: 'wohngeld/bw.pdf', pflicht: true }],
      by: [{ id: 'WG-BY', name: 'Wohngeldantrag Bayern', path: 'wohngeld/by.pdf', pflicht: true }],
      be: [{ id: 'WG-BE', name: 'Wohngeldantrag Berlin', path: 'wohngeld/be.pdf', pflicht: true }],
      bb: [{ id: 'WG-BB', name: 'Wohngeldantrag Brandenburg', path: 'wohngeld/bb.pdf', pflicht: true }],
      hb: [{ id: 'WG-HB', name: 'Wohngeldantrag Bremen', path: 'wohngeld/hb.pdf', pflicht: true }],
      hh: [{ id: 'WG-HH', name: 'Wohngeldantrag Hamburg', path: 'wohngeld/hh.pdf', pflicht: true }],
      he: [{ id: 'WG-HE', name: 'Wohngeldantrag Hessen', path: 'wohngeld/he.pdf', pflicht: true }],
      mv: [{ id: 'WG-MV', name: 'Wohngeldantrag Mecklenburg-Vorpommern', path: 'wohngeld/mv.pdf', pflicht: true }],
      ni: [{ id: 'WG-NI', name: 'Wohngeldantrag Niedersachsen', path: 'wohngeld/ni.pdf', pflicht: true }],
      nw: [{ id: 'WG-NW', name: 'Wohngeldantrag Nordrhein-Westfalen', path: 'wohngeld/nw.pdf', pflicht: true }],
      rp: [{ id: 'WG-RP', name: 'Wohngeldantrag Rheinland-Pfalz', path: 'wohngeld/rp.pdf', pflicht: true }],
      sl: [{ id: 'WG-SL', name: 'Wohngeldantrag Saarland', path: 'wohngeld/sl.pdf', pflicht: true }],
      sn: [{ id: 'WG-SN', name: 'Wohngeldantrag Sachsen', path: 'wohngeld/sn.pdf', pflicht: true }],
      st: [{ id: 'WG-ST', name: 'Wohngeldantrag Sachsen-Anhalt', path: 'wohngeld/st.pdf', pflicht: true }],
      sh: [{ id: 'WG-SH', name: 'Wohngeldantrag Schleswig-Holstein', path: 'wohngeld/sh.pdf', pflicht: true }],
      th: [{ id: 'WG-TH', name: 'Wohngeldantrag Thüringen', path: 'wohngeld/th.pdf', pflicht: true }],
    },
    felder: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'haushaltsmitglieder_anzahl', 'haushaltsmitglieder_details',
      'bruttoeinkommen', 'nettoeinkommen',
      'kaltmiete', 'warmmiete', 'nebenkosten', 'heizkosten',
      'wohnflaeche_qm', 'anzahl_raeume', 'baujahr',
      'vermieter_name', 'vermieter_adresse',
      'bankverbindung_iban',
    ],
  },

  elterngeld: {
    typ: 'land',
    behoerde: 'Landeselterngeldstelle',
    einreichung: { online: 'https://www.elterngeld-digital.de', email: true },
    formulare_pro_land: {
      bw: [{ id: 'EG-BW', name: 'Elterngeldantrag Baden-Württemberg', path: 'elterngeld/bw.pdf', pflicht: true }],
      by: [{ id: 'EG-BY', name: 'Elterngeldantrag Bayern (ZBFS)', path: 'elterngeld/by.pdf', pflicht: true }],
      be: [{ id: 'EG-BE', name: 'Elterngeldantrag Berlin', path: 'elterngeld/be.pdf', pflicht: true }],
      bb: [{ id: 'EG-BB', name: 'Elterngeldantrag Brandenburg', path: 'elterngeld/bb.pdf', pflicht: true }],
      hb: [{ id: 'EG-HB', name: 'Elterngeldantrag Bremen', path: 'elterngeld/hb.pdf', pflicht: true }],
      hh: [{ id: 'EG-HH', name: 'Elterngeldantrag Hamburg', path: 'elterngeld/hh.pdf', pflicht: true }],
      he: [{ id: 'EG-HE', name: 'Elterngeldantrag Hessen', path: 'elterngeld/he.pdf', pflicht: true }],
      mv: [{ id: 'EG-MV', name: 'Elterngeldantrag Mecklenburg-Vorpommern', path: 'elterngeld/mv.pdf', pflicht: true }],
      ni: [{ id: 'EG-NI', name: 'Elterngeldantrag Niedersachsen', path: 'elterngeld/ni.pdf', pflicht: true }],
      nw: [{ id: 'EG-NW', name: 'Elterngeldantrag Nordrhein-Westfalen', path: 'elterngeld/nw.pdf', pflicht: true }],
      rp: [{ id: 'EG-RP', name: 'Elterngeldantrag Rheinland-Pfalz', path: 'elterngeld/rp.pdf', pflicht: true }],
      sl: [{ id: 'EG-SL', name: 'Elterngeldantrag Saarland', path: 'elterngeld/sl.pdf', pflicht: true }],
      sn: [{ id: 'EG-SN', name: 'Elterngeldantrag Sachsen', path: 'elterngeld/sn.pdf', pflicht: true }],
      st: [{ id: 'EG-ST', name: 'Elterngeldantrag Sachsen-Anhalt', path: 'elterngeld/st.pdf', pflicht: true }],
      sh: [{ id: 'EG-SH', name: 'Elterngeldantrag Schleswig-Holstein', path: 'elterngeld/sh.pdf', pflicht: true }],
      th: [{ id: 'EG-TH', name: 'Elterngeldantrag Thüringen', path: 'elterngeld/th.pdf', pflicht: true }],
    },
    felder: [
      'antragsteller_name', 'antragsteller_geburtsdatum', 'antragsteller_adresse',
      'kind_name', 'kind_geburtsdatum',
      'bruttoeinkommen_vor_geburt', 'arbeitgeber',
      'elterngeld_monate', 'elterngeldplus_monate',
      'bankverbindung_iban',
    ],
  },

  'bildung-teilhabe': {
    typ: 'kommune',
    behoerde: 'Sozialbürgerhaus / Jobcenter der Gemeinde',
    einreichung: { online: null, email: true },
    hinweis: 'Formulare sind kommunal unterschiedlich. Template wird anhand der PLZ zugeordnet.',
    formulare_default: [
      { id: 'BuT', name: 'Antrag Bildung & Teilhabe', path: 'but/default.pdf', pflicht: true },
    ],
    felder: [
      'antragsteller_name', 'antragsteller_adresse',
      'kinder_name', 'kinder_geburtsdatum', 'kinder_schule',
      'leistungsbezug_art', // Wohngeld, KiZ, Bürgergeld
      'beantragte_leistungen', // Schulbedarf, Ausflüge, Mittagessen, etc.
    ],
  },
};

// Hilfsfunktion: Hole die richtigen Formulare für eine Leistung + Bundesland
export function getFormulare(leistungId, bundeslandId) {
  const template = FORM_TEMPLATES[leistungId];
  if (!template) return { formulare: [], behoerde: 'Unbekannt', einreichung: {} };

  let formulare = [];

  if (template.typ === 'bundesweit') {
    formulare = template.formulare || [];
  } else if (template.typ === 'land' && template.formulare_pro_land) {
    formulare = template.formulare_pro_land[bundeslandId] || [];
  } else if (template.typ === 'kommune') {
    formulare = template.formulare_default || [];
  }

  return {
    formulare,
    behoerde: template.behoerde,
    einreichung: template.einreichung || {},
    felder: template.felder || [],
    hinweis: template.hinweis || null,
  };
}
