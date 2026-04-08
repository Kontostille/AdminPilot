import { SEOHead } from '../../components/shared/index.jsx';
export default function HinweisRechtsberatungPage() {
  return (<><SEOHead title="Keine Rechtsberatung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Hinweis: Keine Rechtsberatung</h1>
      <div style={{ lineHeight: 1.9, marginTop: 'var(--space-6)' }}>
        <p><strong>AdminPilot ist ein technischer Ausfüllservice und bietet keine Rechts- oder Sozialberatung im Sinne des Rechtsdienstleistungsgesetzes (RDG) an.</strong></p>
        <p>Unsere Anspruchsschätzungen sind unverbindliche Orientierungswerte auf Basis allgemeiner Berechnungsregeln. Sie ersetzen keine individuelle rechtliche Prüfung Ihres Einzelfalls.</p>
        <p>Die endgültige Entscheidung über die Bewilligung einer Leistung liegt ausschließlich bei der zuständigen Behörde.</p>
        <h2>Für rechtliche Beratung empfehlen wir:</h2>
        <p>• <strong>Sozialverband VdK Deutschland</strong> – <a href="https://www.vdk.de" target="_blank" rel="noopener">www.vdk.de</a><br/>
        • <strong>Sozialverband Deutschland (SoVD)</strong> – <a href="https://www.sovd.de" target="_blank" rel="noopener">www.sovd.de</a><br/>
        • <strong>Sozialberatungsstellen</strong> in Ihrer Kommune<br/>
        • Ein auf Sozialrecht spezialisierter Rechtsanwalt</p>
      </div>
    </div></section>
  </>);
}
