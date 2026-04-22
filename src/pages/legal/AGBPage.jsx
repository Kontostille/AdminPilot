import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY, PRICING } from '../../data/siteConfig.js';
export default function AGBPage() {
  return (<><SEOHead title="Allgemeine Geschäftsbedingungen" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Allgemeine Geschäftsbedingungen</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Stand: April 2026 · Entwurf – wird durch Rechtsanwalt finalisiert</p>
      <div style={{ lineHeight: 1.9 }}>
        <h2>§ 1 Geltungsbereich</h2>
        <p>Diese AGB gelten für die Nutzung des Dienstes „AdminPilot", betrieben von der {COMPANY.name}, {COMPANY.address}, {COMPANY.zip} {COMPANY.city} (nachfolgend „Anbieter").</p>

        <h2>§ 2 Leistungsbeschreibung</h2>
        <p>AdminPilot ist eine technische Ausfüllhilfe für Verwaltungsanträge im Sinne von § 2 Abs. 2 Rechtsdienstleistungsgesetz (RDG). Der Service umfasst im <strong>Basis-Paket</strong>:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>die automatische Analyse hochgeladener Dokumente</li>
          <li>die Erstellung fertig ausgefüllter Antragsdokumente auf staatliche Leistungen</li>
          <li>die Bereitstellung der Antragsdokumente als PDF zur Eigeneinreichung durch den Kunden</li>
          <li>eine schriftliche Einreichungsanleitung mit Adresse der zuständigen Behörde</li>
          <li>Status-Tracking per E-Mail</li>
        </ul>
        <p>Die <strong>Einreichung des Antrags</strong> bei der zuständigen Behörde erfolgt durch den Kunden in eigenem Namen und auf eigene Verantwortung.</p>
        <p><strong>AdminPilot bietet keine Rechts- oder Sozialberatung an.</strong> Alle Anspruchsschätzungen sind unverbindliche Orientierungswerte auf Basis allgemeiner Berechnungsregeln. Eine rechtliche Prüfung des Einzelfalls findet nicht statt.</p>

        <h2>§ 3 Preise und Zahlungsbedingungen</h2>
        <p><strong>Grundgebühr (Basis-Paket):</strong> Bei Antragsvorbereitung wird eine einmalige Grundgebühr von {PRICING.baseFeeLabel} fällig.</p>
        <p><strong>Erfolgsgebühr:</strong> Bei erfolgreicher Bewilligung der beantragten Leistung fällt eine Servicegebühr von {PRICING.successFeePercent} % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr nach Bewilligung.</p>
        <p><strong>Geld-zurück-Garantie:</strong> Wird der Antrag von der zuständigen Behörde abgelehnt, erstattet der Anbieter die Grundgebühr von {PRICING.baseFeeLabel} vollständig zurück.</p>
        <p>Der kostenlose Leistungscheck ist unverbindlich und begründet keine Zahlungspflicht.</p>

        <h2>§ 3a Plus-Paket (optional)</h2>
        <p>Zusätzlich zur Grundgebühr kann der Kunde das <strong>Plus-Paket</strong> für eine einmalige Zusatzgebühr von {PRICING.plusFeeLabel} buchen. Das Plus-Paket umfasst:</p>
        <ul style={{ paddingLeft: 24 }}>
          {PRICING.plusFeatures.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <p>Das Plus-Paket wird bei Antragsvorbereitung zusammen mit der Grundgebühr in Rechnung gestellt. Bei Ablehnung des Antrags durch die Behörde wird <strong>nur die Grundgebühr von {PRICING.baseFeeLabel}</strong> erstattet. Die Plus-Gebühr wird nicht erstattet, da die Plus-Leistungen unabhängig vom Ausgang des Antragsverfahrens erbracht werden.</p>
        <p>Das Plus-Paket enthält ausdrücklich <strong>keine Rechts- oder Sozialberatung</strong>. Die „zweite Durchsicht Ihres Bescheids" ist eine rein technische Prüfung auf Vollständigkeit und Plausibilität der Berechnung.</p>

        <h2>§ 4 Keine Erfolgsgarantie</h2>
        <p>Der Anbieter garantiert nicht die Bewilligung der beantragten Leistung. Die Entscheidung über die Bewilligung liegt ausschließlich bei der zuständigen Behörde.</p>

        <h2>§ 5 Mitwirkungspflichten des Kunden</h2>
        <p>Der Kunde ist verpflichtet, wahrheitsgemäße und vollständige Angaben zu machen und die erforderlichen Dokumente in lesbarer Qualität bereitzustellen. Der Kunde prüft den vom Anbieter vorbereiteten Antrag vor der eigenhändigen Einreichung auf Richtigkeit und Vollständigkeit.</p>

        <h2>§ 6 Datenschutz</h2>
        <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den Bestimmungen der DSGVO.</p>

        <h2>§ 7 Haftung</h2>
        <p>Der Anbieter haftet nicht für die Richtigkeit der unverbindlichen Anspruchsschätzungen. Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit gesetzlich zulässig. Unberührt bleibt die Haftung für Vorsatz, grobe Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit sowie für die schuldhafte Verletzung wesentlicher Vertragspflichten.</p>

        <h2>§ 8 Widerrufsrecht</h2>
        <p>Es gelten die gesetzlichen Bestimmungen zum Widerrufsrecht bei Fernabsatzverträgen. Details in der <a href="/widerruf">Widerrufsbelehrung</a>.</p>

        <h2>§ 9 Schlussbestimmungen</h2>
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist München, soweit gesetzlich zulässig.</p>
      </div>
    </div></section>
  </>);
}
