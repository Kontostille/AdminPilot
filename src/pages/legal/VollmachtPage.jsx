import { SEOHead } from '../../components/shared/index.jsx';
export default function VollmachtPage() {
  return (<><SEOHead title="Auftragserteilung" />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Auftragserteilung an AdminPilot</h1>
      <div style={{ lineHeight: 1.9, marginTop: 'var(--space-6)' }}>
        <h2>Keine Vollmacht – sondern ein Auftrag</h2>
        <p>AdminPilot reicht keine Anträge in Ihrem Namen ein. Wir benötigen deshalb <strong>keine Vollmacht</strong> von Ihnen. Was Sie uns erteilen, ist ein klar umrissener <strong>Auftrag</strong>: Auf Basis der von Ihnen bereitgestellten Dokumente und Angaben erstellen wir einen fertig ausgefüllten Antrag, den wir Ihnen zur eigenen Einreichung übergeben.</p>

        <h2>Was umfasst der Auftrag?</h2>
        <p>Mit der Nutzung von AdminPilot beauftragen Sie uns mit folgenden technischen Leistungen:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Die automatische Analyse Ihrer hochgeladenen Dokumente</li>
          <li>Die Erstellung eines fertig ausgefüllten Antragsdokuments</li>
          <li>Die Bereitstellung einer Einreichungsanleitung mit Adresse der zuständigen Behörde</li>
          <li>Im Plus-Paket zusätzlich: Versandmaterial, Erinnerungen und die zweite Durchsicht Ihres Bescheids</li>
        </ul>

        <h2>Was bleibt bei Ihnen?</h2>
        <p>Die <strong>Einreichung</strong> des Antrags bei der Behörde erfolgt ausschließlich durch Sie. Dazu gehören:</p>
        <ul style={{ paddingLeft: 24 }}>
          <li>Die Prüfung des vorbereiteten Antragsdokuments auf Richtigkeit und Vollständigkeit</li>
          <li>Die eigenhändige Unterschrift auf dem Antrag</li>
          <li>Das Absenden oder persönliche Abgeben bei der zuständigen Behörde</li>
          <li>Die Kommunikation mit der Behörde im Antragsverfahren</li>
        </ul>
        <p>Sie bleiben also zu jeder Zeit Antragsteller:in in eigenem Namen. AdminPilot handelt als technisches Werkzeug – vergleichbar mit einer Steuersoftware, die Ihre Steuererklärung vorbereitet, aber nicht bei Ihnen statt Ihnen beim Finanzamt einreicht.</p>

        <h2>Warum dieser Unterschied wichtig ist</h2>
        <p>Diese Abgrenzung ist rechtlich bedeutsam: AdminPilot ist eine technische Ausfüllhilfe nach § 2 Abs. 2 RDG und keine Rechtsdienstleisterin. Wir dürfen keine Anträge in fremdem Namen einreichen und tun dies deshalb ausdrücklich nicht.</p>

        <h2>Können Sie den Auftrag widerrufen?</h2>
        <p>Ja. Solange wir den fertig ausgefüllten Antrag noch nicht bereitgestellt haben, können Sie den Auftrag widerrufen und die Grundgebühr zurückfordern. Details regelt unsere <a href="/widerruf">Widerrufsbelehrung</a>.</p>
      </div>
    </div></section>
  </>);
}
