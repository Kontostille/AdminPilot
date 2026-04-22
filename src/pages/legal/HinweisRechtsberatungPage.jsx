import { SEOHead } from '../../components/shared/index.jsx';
export default function HinweisRechtsberatungPage() {
  return (<><SEOHead title="Keine Rechtsberatung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Hinweis: Keine Rechtsberatung</h1>
      <div style={{ lineHeight: 1.9, marginTop: 'var(--space-6)' }}>
        <p><strong>AdminPilot ist ein technischer Ausfüllservice nach § 2 Abs. 2 Rechtsdienstleistungsgesetz (RDG) und bietet keine Rechts- oder Sozialberatung an.</strong> Wir unterstützen beim Ausfüllen von Antragsformularen, treffen aber keine rechtliche Einzelfallprüfung.</p>

        <h2>Was AdminPilot leistet</h2>
        <p>Wir bereiten Ihren Antrag auf Basis der von Ihnen bereitgestellten Dokumente und Angaben technisch vor. Sie erhalten ein fertig ausgefülltes Antragsdokument, das Sie selbst unterschreiben und bei der zuständigen Behörde einreichen. Auf Wunsch erhalten Sie dazu eine Einreichungsanleitung und – im Plus-Paket – Versandmaterial sowie Erinnerungen.</p>

        <h2>Was AdminPilot nicht leistet</h2>
        <p>Unsere Anspruchsschätzungen sind unverbindliche Orientierungswerte auf Basis allgemeiner Berechnungsregeln. Sie ersetzen keine individuelle rechtliche Prüfung Ihres Einzelfalls. Wir nehmen weder eine juristische Bewertung Ihres Anspruchs vor, noch beraten wir zu Widerspruchsverfahren, zu Gerichtsverfahren oder zu Fragen der Sozialhilfe- oder Rentenberatung.</p>
        <p>Die endgültige Entscheidung über die Bewilligung einer Leistung liegt ausschließlich bei der zuständigen Behörde.</p>

        <h2>Für rechtliche Beratung empfehlen wir:</h2>
        <p>
          • <strong>Sozialverband VdK Deutschland</strong> – <a href="https://www.vdk.de" target="_blank" rel="noopener">www.vdk.de</a><br/>
          • <strong>Sozialverband Deutschland (SoVD)</strong> – <a href="https://www.sovd.de" target="_blank" rel="noopener">www.sovd.de</a><br/>
          • <strong>Sozialberatungsstellen</strong> in Ihrer Kommune<br/>
          • Ein auf Sozialrecht spezialisierter Rechtsanwalt
        </p>

        <h2>Bei konkreten Zweifeln</h2>
        <p>Sollten bei der Nutzung unseres Services Zweifel an Ihrem Anspruch oder der rechtlichen Bewertung Ihrer Situation entstehen, empfehlen wir ausdrücklich, sich an einen der oben genannten Sozialverbände oder einen Fachanwalt zu wenden. AdminPilot ist kein Ersatz für qualifizierte Beratung.</p>
      </div>
    </div></section>
  </>);
}
