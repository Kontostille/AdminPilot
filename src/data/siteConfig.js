/* AdminPilot – Zentrale Konfiguration */

export const COMPANY = {
  name: 'ALEVOR Mittelstandspartner GmbH',
  brandName: 'AdminPilot',
  address: 'Titurelstraße 10',
  zip: '81925',
  city: 'München',
  country: 'Deutschland',
  email: 'info@adminpilot.de',
  domain: 'adminpilot.de',
  register: 'Amtsgericht München, HRB 301846',
  directors: ['Andreas Levin', 'Linda Hoeckle', 'Julius Richter-Berghofer'],
  ustId: '[wird nachgetragen]',
};

export const PRICING = {
  // Basis-Paket
  baseFee: 49,
  baseFeeLabel: '49 €',
  successFeePercent: 10,
  successFeeLabel: '10 % der bewilligten Leistung',
  successFeePeriod: 'im ersten Jahr',
  model: 'base_plus_success',
  moneyBack: true,
  description: 'Einmalige Grundgebühr von 49 € für den fertig ausgefüllten Antrag. Bei erfolgreicher Bewilligung fällt eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr. Wird der Antrag abgelehnt, erstatten wir die 49 € Grundgebühr vollständig zurück.',

  // Plus-Paket
  plusFee: 29,
  plusFeeLabel: '29 €',
  plusDescription: 'Zusätzliche Unterstützung für Ihren Einreichungsweg: Versandumschläge mit vorbereitetem Anschreiben, Erinnerung zum Nachfassen bei der Behörde und eine zweite Durchsicht Ihres Bescheids durch unser Team.',
  plusFeatures: [
    'Kuvertierte Einreichung: Versandumschlag mit vorbereitetem Anschreiben und Rückumschlag',
    'Automatische Erinnerung zum Nachfassen bei der Behörde',
    'Zweite Durchsicht Ihres Bescheids (keine Rechtsberatung)',
  ],
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Maria K.',
    age: 72,
    type: 'Rentnerin',
    location: 'München',
    leistung: 'Wohngeld',
    amount: '310 €/Monat',
    quote: 'Mein Enkel hat mir AdminPilot gezeigt. Ich hätte nie gedacht, dass mein Antrag so einfach werden kann. Nach der Bewilligung bekomme ich jeden Monat Wohngeld und muss mir weniger Sorgen machen.',
    initials: 'MK',
  },
  {
    id: 2,
    name: 'Thomas & Lisa S.',
    age: 34,
    type: 'Familie mit 2 Kindern',
    location: 'Berlin',
    leistung: 'Kinderzuschlag',
    amount: '584 €/Monat',
    quote: 'Wir wussten gar nicht, dass Kinderzuschlag für uns in Frage kommt. AdminPilot hat uns in 5 Minuten gezeigt, wie das geht – nach Bewilligung bekommen wir fast 600 € mehr im Monat.',
    initials: 'TS',
  },
  {
    id: 3,
    name: 'Gerhard M.',
    age: 78,
    type: 'Rentner',
    location: 'Hamburg',
    leistung: 'KV-Zuschuss',
    amount: '218 €/Monat',
    quote: 'Den KV-Zuschuss hätte ich ohne AdminPilot nie beantragt. Ich wusste nicht einmal, dass es das gibt. Nach Bewilligung spare ich über 200 € im Monat bei meiner Krankenversicherung.',
    initials: 'GM',
  },
  {
    id: 4,
    name: 'Sandra W.',
    age: 29,
    type: 'Alleinerziehend',
    location: 'Köln',
    leistung: 'Wohngeld + Kindergeld',
    amount: '620 €/Monat',
    quote: 'Als Alleinerziehende habe ich keine Zeit für aufwändige Formulare. Mit AdminPilot hatte ich Wohngeld- und Kinderzuschlag-Anträge in einem Rutsch fertig – zum Einreichen musste ich sie nur noch abschicken. Unfassbar unkompliziert.',
    initials: 'SW',
  },
  {
    id: 5,
    name: 'Helga P.',
    age: 81,
    type: 'Rentnerin',
    location: 'Frankfurt',
    leistung: 'Kindererziehungszeiten',
    amount: '96 €/Monat',
    quote: 'Ich habe drei Kinder großgezogen und wusste nicht, dass mir dafür zusätzliche Rente zusteht. AdminPilot hat den Antrag für mich fertig ausgefüllt – einreichen musste ich ihn selbst, aber das war nach der Vorarbeit keine Sache mehr.',
    initials: 'HP',
  },
];

export const TESTIMONIAL_DISCLAIMER = 'Einzelerfahrungen. Die tatsächliche Leistungshöhe hängt von Ihrer individuellen Situation ab und wird ausschließlich von der zuständigen Behörde festgelegt.';

export const FAQ_DATA = [
  {
    category: 'Allgemein',
    items: [
      { q: 'Was ist AdminPilot?', a: 'AdminPilot ist ein digitaler Service, der Ihnen hilft, staatliche Leistungen wie Wohngeld, Kindergeld oder KV-Zuschuss einfacher zu beantragen. Sie laden Ihre Dokumente hoch, wir analysieren sie automatisch und erstellen für Sie einen fertig ausgefüllten Antrag. Das Einreichen des Antrags erfolgt durch Sie selbst – wir geben Ihnen dazu eine klare Anleitung.' },
      { q: 'Für wen ist AdminPilot gedacht?', a: 'AdminPilot richtet sich an Rentner, Familien und Berufstätige in Deutschland, die staatliche Leistungen beantragen möchten – ohne sich durch komplizierte Formulare kämpfen zu müssen.' },
      { q: 'Ist AdminPilot eine Behörde?', a: 'Nein. AdminPilot ist ein privater Service der ALEVOR Mittelstandspartner GmbH. Wir sind eine technische Ausfüllhilfe nach §2 Abs. 2 RDG: Wir bereiten Anträge vor, die Sie dann selbst unterschreiben und bei der zuständigen Behörde einreichen.' },
      { q: 'Bietet AdminPilot Rechtsberatung an?', a: 'Nein. AdminPilot bietet keine Rechts- oder Sozialberatung an. Wir sind eine technische Ausfüllhilfe und treffen keine rechtliche Einzelfallprüfung. Für rechtliche Beratung empfehlen wir Sozialverbände wie den VdK oder SoVD.' },
    ],
  },
  {
    category: 'Kosten',
    items: [
      { q: 'Was kostet AdminPilot?', a: 'Der Basis-Service kostet einmalig 49 € und umfasst den fertig ausgefüllten Antrag zum Selbst-Einreichen. Bei erfolgreicher Bewilligung fällt zusätzlich eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr. Optional buchbar: der Plus-Service für 29 € mit zusätzlicher Einreichungshilfe und Erinnerungen.' },
      { q: 'Was unterscheidet den Plus-Service vom Basis-Service?', a: 'Der Basis-Service liefert Ihnen den fertig ausgefüllten Antrag als PDF zum Ausdrucken und Einreichen. Mit dem Plus-Service (+29 €) erhalten Sie zusätzlich: einen vorbereiteten Versandumschlag mit Anschreiben, Erinnerungen zum Nachfassen bei der Behörde und eine zweite Durchsicht Ihres Bescheids durch unser Team. Beide Pakete enthalten keine Rechtsberatung.' },
      { q: 'Muss ich im Voraus bezahlen?', a: 'Die Grundgebühr von 49 € (und ggf. 29 € für das Plus-Paket) wird bei Antragstellung fällig. Die Erfolgsgebühr erst nach Bewilligung durch die Behörde – also nur, wenn Sie tatsächlich Geld erhalten.' },
      { q: 'Gibt es versteckte Kosten?', a: 'Nein. Alle Gebühren werden Ihnen vor der Antragstellung transparent angezeigt. Kein Abo, keine automatische Verlängerung.' },
      { q: 'Was passiert, wenn mein Antrag abgelehnt wird?', a: 'Dann erstatten wir Ihnen die 49 € Grundgebühr vollständig zurück. Die Erfolgsgebühr entfällt ohnehin, da sie nur bei bewilligter Leistung berechnet wird. Die Plus-Gebühr (sofern gebucht) wird nicht erstattet, da die Plus-Leistungen unabhängig vom Ausgang des Antrags erbracht werden.' },
    ],
  },
  {
    category: 'Datenschutz',
    items: [
      { q: 'Sind meine Daten sicher?', a: 'Ja. Alle Daten werden DSGVO-konform auf Servern in Frankfurt (Deutschland) verarbeitet und verschlüsselt übertragen. Wir nutzen Supabase als Datenbank – mit Serverstandort Deutschland.' },
      { q: 'Welche Daten werden erhoben?', a: 'Wir erheben nur die Daten, die für die Antragstellung notwendig sind: Persönliche Angaben, Einkommensnachweise, Mietvertrag etc. Gesundheitsdaten werden im aktuellen Angebot nicht verarbeitet.' },
      { q: 'Werden meine Daten an Dritte weitergegeben?', a: 'Ihre Daten werden nicht an Dritte zu Werbe- oder Analysezwecken weitergegeben. Technische Dienstleister (Auftragsverarbeiter) setzen wir nur ein, soweit sie zur Bereitstellung des Services notwendig sind – Details in unserer Datenschutzerklärung.' },
      { q: 'Kann ich meine Daten löschen lassen?', a: 'Ja. Sie können jederzeit die Löschung Ihrer Daten beantragen. Wir kommen dem innerhalb der gesetzlichen Fristen nach (DSGVO Art. 17).' },
    ],
  },
  {
    category: 'Prozess',
    items: [
      { q: 'Wie lange dauert der Leistungscheck?', a: 'Der kostenlose Leistungscheck dauert etwa 2–5 Minuten. Sie beantworten wenige Fragen und erhalten sofort eine unverbindliche Einschätzung.' },
      { q: 'Wie lange dauert die Antragstellung?', a: 'Nachdem Sie Ihre Dokumente hochgeladen haben, brauchen Sie etwa 10–15 Minuten, um alle Angaben zu bestätigen. Den fertig ausgefüllten Antrag erhalten Sie anschließend als PDF zum Ausdrucken und Einreichen.' },
      { q: 'Wie lange dauert es, bis die Behörde entscheidet?', a: 'Das hängt von der Leistung und der Behörde ab. In der Regel dauert es 3–8 Wochen. Wir informieren Sie per E-Mail, sobald Sie uns eine Rückmeldung zum Eingang bei der Behörde geben.' },
      { q: 'Welche Dokumente brauche ich?', a: 'Das hängt von der beantragten Leistung ab. In der Regel: Personalausweis, Einkommensnachweis und ggf. Mietvertrag. Die genaue Liste zeigen wir Ihnen vor dem Upload an.' },
    ],
  },
];

export const RATGEBER_ARTICLES = [
  {
    slug: 'welche-sozialleistungen-stehen-mir-zu',
    title: 'Welche Sozialleistungen stehen mir zu? Ein Überblick für 2026',
    excerpt: 'Deutschland bietet eine Vielzahl an Sozialleistungen – doch viele Menschen wissen nicht, worauf sie Anspruch haben könnten. Dieser Ratgeber gibt einen Überblick.',
    category: 'Allgemein',
    readTime: '8 Min.',
    date: '2026-03-15',
    content: `
      <p>In Deutschland gibt es über 100 verschiedene Sozialleistungen. Doch viele Berechtigte wissen gar nicht, dass ihnen Unterstützung zusteht. Laut einer Studie des Deutschen Instituts für Wirtschaftsforschung (DIW) verzichten allein rund 625.000 Rentnerhaushalte auf ihnen möglicherweise zustehende Leistungen.</p>
      <h2>Die wichtigsten Leistungen im Überblick</h2>
      <p><strong>Wohngeld-Plus:</strong> Ein Zuschuss zu den Wohnkosten für Mieter und Eigentümer mit geringem Einkommen. Seit der Reform 2023 haben deutlich mehr Haushalte Anspruch.</p>
      <p><strong>Kindergeld:</strong> 250 € pro Kind und Monat. Wird für alle Kinder bis 18 Jahre gezahlt, unter bestimmten Voraussetzungen bis 25.</p>
      <p><strong>Kinderzuschlag:</strong> Bis zu 292 € zusätzlich pro Kind für Familien mit geringem Einkommen – zusätzlich zum Kindergeld.</p>
      <p><strong>KV-Zuschuss für Rentner:</strong> Privat oder freiwillig gesetzlich versicherte Rentner können einen Zuschuss zu ihren Krankenversicherungsbeiträgen erhalten.</p>
      <h2>Wie finde ich heraus, was mir zusteht?</h2>
      <p>Der einfachste Weg: Nutzen Sie unseren kostenlosen Leistungscheck. In wenigen Minuten erhalten Sie eine unverbindliche Einschätzung, welche Leistungen für Sie in Frage kommen könnten.</p>
    `,
  },
  {
    slug: 'wohngeld-2026-was-sie-wissen-muessen',
    title: 'Wohngeld 2026: Alles was Sie wissen müssen',
    excerpt: 'Seit der Wohngeld-Reform haben deutlich mehr Menschen Anspruch. Erfahren Sie, ob Sie dazugehören könnten und wie Sie Wohngeld beantragen.',
    category: 'Wohnen',
    readTime: '6 Min.',
    date: '2026-03-01',
    content: `
      <p>Das Wohngeld-Plus wurde 2023 eingeführt und hat den Kreis der Berechtigten deutlich erweitert. Rund 2 Millionen Haushalte könnten seitdem Anspruch haben.</p>
      <h2>Wer hat Anspruch auf Wohngeld?</h2>
      <p>Grundsätzlich können alle Mieter und Eigentümer Wohngeld beantragen, deren Einkommen bestimmte Grenzen nicht überschreitet. Die genaue Höhe hängt von der Haushaltsgröße, dem Einkommen und der Miete ab.</p>
      <h2>Wie hoch ist das Wohngeld?</h2>
      <p>Die Höhe variiert stark – von etwa 100 bis über 370 € pro Monat. Entscheidend sind drei Faktoren: Anzahl der Haushaltsmitglieder, Höhe der Miete und Höhe des Einkommens.</p>
      <h2>Welche Dokumente werden benötigt?</h2>
      <p>Für den Wohngeldantrag benötigen Sie in der Regel: Personalausweis, Mietvertrag, aktuelle Mietbescheinigung, Einkommensnachweise der letzten drei Monate.</p>
      <h2>Wie beantrage ich Wohngeld?</h2>
      <p>Mit AdminPilot fotografieren Sie einfach die benötigten Dokumente. Unsere Software erkennt die relevanten Daten und bereitet den Antrag für Sie vor. Zum Einreichen drucken Sie den fertig ausgefüllten Antrag aus und senden ihn an die zuständige Wohngeldstelle – wir liefern eine Schritt-für-Schritt-Anleitung.</p>
    `,
  },
  {
    slug: 'kv-zuschuss-rentner-so-sparen-sie',
    title: 'KV-Zuschuss für Rentner: So sparen Sie bis zu 500 € im Monat',
    excerpt: 'Viele Rentner wissen nicht, dass ihnen ein Zuschuss zur Krankenversicherung zusteht. Erfahren Sie, wie Sie den Zuschuss beantragen.',
    category: 'Rente',
    readTime: '5 Min.',
    date: '2026-02-15',
    content: `
      <p>Wer als Rentner privat oder freiwillig gesetzlich krankenversichert ist, kann von der Deutschen Rentenversicherung einen Zuschuss erhalten. Dieser wird allerdings nicht automatisch gezahlt – Sie müssen ihn beantragen.</p>
      <h2>Wie hoch ist der KV-Zuschuss?</h2>
      <p>Für 2026 beträgt der Zuschuss bis zu 8,75 % Ihrer monatlichen Bruttorente. Bei einer Rente von 1.500 € sind das rund 131 € pro Monat. Der Zuschuss ist auf maximal die Hälfte Ihres tatsächlichen KV-Beitrags begrenzt.</p>
      <h2>Wer hat Anspruch?</h2>
      <p>Anspruch haben alle Rentnerinnen und Rentner, die eine gesetzliche Rente beziehen und freiwillig gesetzlich oder privat krankenversichert sind.</p>
      <h2>Wie beantrage ich den Zuschuss?</h2>
      <p>Den Antrag stellen Sie bei der Deutschen Rentenversicherung – am besten zusammen mit Ihrem Rentenantrag. Mit AdminPilot geht das besonders einfach: Laden Sie Ihren Rentenbescheid hoch, wir bereiten den Antrag für Sie vor. Das Einreichen liegt dann nur noch bei Ihnen.</p>
    `,
  },
  {
    slug: 'kinderzuschlag-beantragen-schritt-fuer-schritt',
    title: 'Kinderzuschlag beantragen: Schritt für Schritt erklärt',
    excerpt: 'Der Kinderzuschlag bietet Familien mit geringem Einkommen bis zu 292 € zusätzlich pro Kind. So beantragen Sie ihn.',
    category: 'Familie',
    readTime: '5 Min.',
    date: '2026-01-20',
    content: `
      <p>Der Kinderzuschlag ist eine der am häufigsten übersehenen Sozialleistungen in Deutschland. Dabei können Familien mit geringem Einkommen bis zu 292 € pro Kind und Monat zusätzlich zum Kindergeld erhalten.</p>
      <h2>Voraussetzungen</h2>
      <p>Sie haben Anspruch, wenn Sie Kindergeld beziehen, Ihr Einkommen eine Mindestgrenze erreicht (900 € brutto für Paare, 600 € für Alleinerziehende), aber nicht ausreicht, um den Bedarf Ihrer Familie vollständig zu decken.</p>
      <h2>So beantragen Sie den Kinderzuschlag</h2>
      <p>Der Antrag wird bei der Familienkasse gestellt. Mit AdminPilot geht das besonders einfach: Laden Sie Ihre Einkommensnachweise und den Kindergeld-Bescheid hoch, und wir bereiten den Antrag automatisch für Sie vor – fertig zum Selbst-Einreichen.</p>
    `,
  },
  {
    slug: 'bildungspaket-was-eltern-wissen-muessen',
    title: 'Bildungspaket: Was Eltern über das BuT wissen müssen',
    excerpt: 'Schulbedarf, Klassenfahrten, Mittagessen – das Bildungs- und Teilhabepaket unterstützt Kinder aus einkommensschwachen Familien.',
    category: 'Familie',
    readTime: '4 Min.',
    date: '2026-01-05',
    content: `
      <p>Das Bildungs- und Teilhabepaket (BuT) soll sicherstellen, dass Kinder aus Familien mit geringem Einkommen die gleichen Chancen haben wie andere Kinder.</p>
      <h2>Welche Leistungen umfasst das Bildungspaket?</h2>
      <p>Schulbedarf (195 € pro Jahr), Klassenfahrten und Ausflüge, Mittagessen in Schule oder Kita, Lernförderung bei Bedarf, Teilhabe am sozialen und kulturellen Leben (15 € pro Monat).</p>
      <h2>Wer hat Anspruch?</h2>
      <p>Anspruch haben Familien, die Wohngeld, Kinderzuschlag, Bürgergeld oder Sozialhilfe beziehen. Auch Familien mit Asylbewerberleistungen können BuT erhalten.</p>
    `,
  },
  {
    slug: 'umzug-checkliste-behoerdengaenge',
    title: 'Umzug-Checkliste: Alle Behördengänge auf einen Blick',
    excerpt: 'Ein Umzug bedeutet viel Papierkram. Unsere interaktive Checkliste zeigt Ihnen alle Fristen und Pflichten – von der Kündigung bis zur Ummeldung.',
    category: 'Umzug',
    readTime: '5 Min.',
    date: '2026-04-01',
    content: `
      <p>Ein Umzug innerhalb Deutschlands bringt zahlreiche Behördengänge und Fristen mit sich. Die wichtigste Pflicht: Sie müssen sich innerhalb von 14 Tagen nach dem Einzug beim Einwohnermeldeamt ummelden. Bei Versäumnis droht ein Bußgeld von bis zu 1.000 €.</p>
      <h2>Die wichtigsten Schritte</h2>
      <p><strong>3 Monate vorher:</strong> Mietvertrag kündigen (3 Monate Kündigungsfrist), neue Wohnung suchen, Umzugsunternehmen buchen.</p>
      <p><strong>4 Wochen vorher:</strong> Nachsendeauftrag bei der Post einrichten, Strom/Gas/Internet ummelden, Schule/Kita am neuen Ort anmelden.</p>
      <p><strong>Nach dem Umzug:</strong> Wohnsitz ummelden, Personalausweis aktualisieren, KFZ ummelden, Arbeitgeber informieren.</p>
      <h2>Nach dem Umzug: Neue Ansprüche prüfen</h2>
      <p>Ein neuer Wohnort kann auch neue Ansprüche auf Sozialleistungen bedeuten. Wohngeld hängt von der Miete und dem Wohnort ab – prüfen Sie nach dem Umzug, ob Ihnen Leistungen zustehen.</p>
      <p><strong>Tipp:</strong> Nutzen Sie unsere <a href="/umzugshilfe">kostenlose interaktive Umzugs-Checkliste</a> mit 23 Aufgaben in 5 Phasen.</p>
    `,
  },
];
