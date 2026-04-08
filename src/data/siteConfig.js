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
  baseFeee: 49,
  baseFeeLabel: '49 €',
  successFeePercent: 10,
  successFeeLabel: '10 % der bewilligten Leistung',
  successFeePeriod: 'im ersten Jahr',
  model: 'base_plus_success',
  moneyBack: true,
  description: 'Einmalige Grundgebühr von 49 € bei Antragstellung. Bei erfolgreicher Bewilligung fällt eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr. Wird der Antrag abgelehnt, erstatten wir die 49 € Grundgebühr vollständig zurück.',
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
    quote: 'Mein Enkel hat mir AdminPilot gezeigt. Ich hätte nie gedacht, dass der Antrag so einfach sein kann. Jetzt bekomme ich jeden Monat Wohngeld und muss mir weniger Sorgen machen.',
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
    quote: 'Wir wussten gar nicht, dass uns Kinderzuschlag zusteht. AdminPilot hat das in 5 Minuten herausgefunden – jetzt bekommen wir jeden Monat fast 600 € mehr für unsere Kinder.',
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
    quote: 'Den KV-Zuschuss hätte ich ohne AdminPilot nie beantragt. Ich wusste nicht einmal, dass es das gibt. Jetzt spare ich über 200 € im Monat bei meiner Krankenversicherung.',
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
    quote: 'Als Alleinerziehende habe ich keine Zeit für Behördengänge. AdminPilot hat mir Wohngeld und den Kinderzuschlag in einem Rutsch beantragt. Unfassbar unkompliziert.',
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
    quote: 'Ich habe drei Kinder großgezogen und wusste nicht, dass mir dafür zusätzliche Rente zusteht. AdminPilot hat den Antrag für mich gestellt. Einfach wunderbar.',
    initials: 'HP',
  },
];

export const FAQ_DATA = [
  {
    category: 'Allgemein',
    items: [
      { q: 'Was ist AdminPilot?', a: 'AdminPilot ist ein digitaler Service, der Ihnen hilft, staatliche Leistungen wie Wohngeld, Kindergeld oder KV-Zuschuss einfach und automatisch zu beantragen. Sie laden Ihre Dokumente hoch, unsere KI prüft Ihren möglichen Anspruch und wir stellen den Antrag für Sie.' },
      { q: 'Für wen ist AdminPilot gedacht?', a: 'AdminPilot richtet sich an Rentner, Familien und Berufstätige in Deutschland, die staatliche Leistungen beantragen möchten – ohne sich durch komplizierte Formulare kämpfen zu müssen.' },
      { q: 'Ist AdminPilot eine Behörde?', a: 'Nein. AdminPilot ist ein privater Service der ALEVOR Mittelstandspartner GmbH. Wir sind eine technische Ausfüllhilfe und reichen Anträge in Ihrem Namen bei der zuständigen Behörde ein.' },
      { q: 'Bietet AdminPilot Rechtsberatung an?', a: 'Nein. AdminPilot bietet keine Rechts- oder Sozialberatung an. Wir sind eine technische Ausfüllhilfe. Für rechtliche Beratung empfehlen wir Sozialverbände wie den VdK oder SoVD.' },
    ],
  },
  {
    category: 'Kosten',
    items: [
      { q: 'Was kostet AdminPilot?', a: 'Die Grundgebühr beträgt einmalig 49 €. Diese wird bei Antragstellung fällig. Bei erfolgreicher Bewilligung Ihrer Leistung fällt zusätzlich eine Servicegebühr von 10 % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr.' },
      { q: 'Muss ich im Voraus bezahlen?', a: 'Die Grundgebühr von 49 € wird bei Antragstellung fällig. Die Erfolgsgebühr erst nach Bewilligung durch die Behörde – also nur, wenn Sie tatsächlich Geld erhalten.' },
      { q: 'Gibt es versteckte Kosten?', a: 'Nein. Die Grundgebühr und die Erfolgsgebühr sind transparent und werden Ihnen vor der Antragstellung klar angezeigt.' },
      { q: 'Was passiert, wenn mein Antrag abgelehnt wird?', a: 'Dann erstatten wir Ihnen die Grundgebühr von 49 € vollständig zurück. Die Erfolgsgebühr entfällt ohnehin, da sie nur bei bewilligter Leistung berechnet wird. Sie tragen also keinerlei finanzielles Risiko.' },
    ],
  },
  {
    category: 'Datenschutz',
    items: [
      { q: 'Sind meine Daten sicher?', a: 'Ja. Alle Daten werden DSGVO-konform auf Servern in Frankfurt (Deutschland) verarbeitet und mit 256-Bit verschlüsselt. Wir nutzen Supabase als Datenbank – ebenfalls in Deutschland gehostet.' },
      { q: 'Welche Daten werden erhoben?', a: 'Wir erheben nur die Daten, die für die Antragstellung notwendig sind: Persönliche Angaben, Einkommensnachweise, Mietvertrag etc. Gesundheitsdaten werden im aktuellen Angebot nicht verarbeitet.' },
      { q: 'Werden meine Daten an Dritte weitergegeben?', a: 'Ihre Daten werden ausschließlich an die zuständige Behörde zur Antragstellung übermittelt. Eine Weitergabe an andere Dritte erfolgt nicht.' },
      { q: 'Kann ich meine Daten löschen lassen?', a: 'Ja. Sie können jederzeit die Löschung Ihrer Daten beantragen. Wir kommen dem innerhalb der gesetzlichen Fristen nach (DSGVO Art. 17).' },
    ],
  },
  {
    category: 'Prozess',
    items: [
      { q: 'Wie lange dauert der Leistungscheck?', a: 'Der kostenlose Leistungscheck dauert etwa 2–5 Minuten. Sie beantworten wenige Fragen und erhalten sofort eine unverbindliche Einschätzung.' },
      { q: 'Wie lange dauert die Antragstellung?', a: 'Nachdem Sie Ihre Dokumente hochgeladen haben, dauert die Antragstellung etwa 10–15 Minuten. Den Rest erledigen wir für Sie.' },
      { q: 'Wie lange dauert es, bis die Behörde entscheidet?', a: 'Das hängt von der Leistung und der Behörde ab. In der Regel dauert es 3–8 Wochen. Wir informieren Sie per E-Mail über den aktuellen Status.' },
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
      <p>Mit AdminPilot fotografieren Sie einfach die benötigten Dokumente. Unsere KI erkennt die relevanten Daten und erstellt den Antrag automatisch für Sie.</p>
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
      <p>Den Antrag stellen Sie bei der Deutschen Rentenversicherung – am besten zusammen mit Ihrem Rentenantrag. Oder Sie nutzen AdminPilot: Laden Sie einfach Ihren Rentenbescheid hoch, und wir kümmern uns um den Rest.</p>
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
      <p>Der Antrag wird bei der Familienkasse gestellt. Mit AdminPilot geht das besonders einfach: Laden Sie Ihre Einkommensnachweise und den Kindergeld-Bescheid hoch, und wir erstellen den Antrag automatisch.</p>
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
];
