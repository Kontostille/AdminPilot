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
        <p>AdminPilot ist eine technische Ausfüllhilfe für Verwaltungsanträge. Der Service umfasst: die Analyse hochgeladener Dokumente, die Erstellung von Anträgen auf staatliche Leistungen, die Einreichung der Anträge bei der zuständigen Behörde sowie die Statusverfolgung.</p>
        <p><strong>AdminPilot bietet keine Rechts- oder Sozialberatung an.</strong> Alle Anspruchsschätzungen sind unverbindliche Orientierungswerte.</p>
        <h2>§ 3 Preise und Zahlungsbedingungen</h2>
        <p><strong>Grundgebühr:</strong> Bei Antragstellung wird eine einmalige Grundgebühr von {PRICING.baseFeeLabel} fällig.</p>
        <p><strong>Erfolgsgebühr:</strong> Bei erfolgreicher Bewilligung der beantragten Leistung fällt eine Servicegebühr von {PRICING.successFeePercent} % der bewilligten monatlichen Leistung an, zahlbar im ersten Jahr nach Bewilligung.</p>
        <p><strong>Geld-zurück-Garantie:</strong> Wird der Antrag von der zuständigen Behörde abgelehnt, erstattet der Anbieter die Grundgebühr von {PRICING.baseFeeLabel} vollständig zurück.</p>
        <p>Der kostenlose Leistungscheck ist unverbindlich und begründet keine Zahlungspflicht.</p>
        <h2>§ 4 Keine Erfolgsgarantie</h2>
        <p>Der Anbieter garantiert nicht die Bewilligung der beantragten Leistung. Die Entscheidung über die Bewilligung liegt ausschließlich bei der zuständigen Behörde.</p>
        <h2>§ 5 Mitwirkungspflichten des Kunden</h2>
        <p>Der Kunde ist verpflichtet, wahrheitsgemäße und vollständige Angaben zu machen und die erforderlichen Dokumente in lesbarer Qualität bereitzustellen.</p>
        <h2>§ 6 Datenschutz</h2>
        <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den Bestimmungen der DSGVO.</p>
        <h2>§ 7 Haftung</h2>
        <p>Der Anbieter haftet nicht für die Richtigkeit der von der KI generierten Anspruchsschätzungen. Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit gesetzlich zulässig.</p>
        <h2>§ 8 Widerrufsrecht</h2>
        <p>Es gelten die gesetzlichen Bestimmungen zum Widerrufsrecht bei Fernabsatzverträgen. Siehe unsere Widerrufsbelehrung.</p>
        <h2>§ 9 Schlussbestimmungen</h2>
        <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist München, soweit gesetzlich zulässig.</p>
      </div>
    </div></section>
  </>);
}
