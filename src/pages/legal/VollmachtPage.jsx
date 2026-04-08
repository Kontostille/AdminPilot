import { SEOHead } from '../../components/shared/index.jsx';
export default function VollmachtPage() {
  return (<><SEOHead title="Vollmacht & digitale Signatur" />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Vollmacht & digitale Signatur</h1>
      <div style={{ lineHeight: 1.9, marginTop: 'var(--space-6)' }}>
        <h2>Warum braucht AdminPilot eine Vollmacht?</h2>
        <p>Damit wir den Antrag in Ihrem Namen bei der zuständigen Behörde einreichen können, benötigen wir eine Vollmacht. Diese berechtigt AdminPilot, den Antrag für Sie zu erstellen, einzureichen und den Bearbeitungsstatus zu erfragen.</p>
        <h2>Was wird genau unterzeichnet?</h2>
        <p>Sie erteilen AdminPilot eine zweckgebundene Vollmacht für die Antragstellung einer bestimmten Leistung (z.B. Wohngeld). Die Vollmacht ist auf diesen einen Vorgang beschränkt und erlischt nach Abschluss des Antragsverfahrens.</p>
        <h2>Was ist eine QES?</h2>
        <p>Die Qualifizierte Elektronische Signatur (QES) ist die rechtlich sicherste Form der digitalen Unterschrift in der EU. Sie ist einer handschriftlichen Unterschrift gleichgestellt (eIDAS-Verordnung). Die Signatur erfolgt über einen zertifizierten Anbieter (z.B. DocuSign oder Adobe Sign).</p>
        <h2>Kann ich die Vollmacht widerrufen?</h2>
        <p>Ja. Sie können die Vollmacht jederzeit schriftlich widerrufen. Ein bereits eingereichter Antrag kann allerdings nicht mehr zurückgenommen werden – die Behörde bearbeitet diesen unabhängig.</p>
      </div>
    </div></section>
  </>);
}
