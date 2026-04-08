import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY } from '../../data/siteConfig.js';
export default function WiderrufPage() {
  return (<><SEOHead title="Widerrufsbelehrung" noindex />
    <section className="section"><div className="container" style={{ maxWidth: 'var(--max-width-content)' }}>
      <h1>Widerrufsbelehrung</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Stand: April 2026 · Entwurf – wird durch Rechtsanwalt finalisiert</p>
      <div style={{ lineHeight: 1.9 }}>
        <h2>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.</p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ({COMPANY.name}, {COMPANY.address}, {COMPANY.zip} {COMPANY.city}, E-Mail: {COMPANY.email}) mittels einer eindeutigen Erklärung über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>
        <h2>Folgen des Widerrufs</h2>
        <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.</p>
        <h2>Vorzeitiger Verlust des Widerrufsrechts</h2>
        <p>Bitte beachten Sie, dass das Widerrufsrecht vorzeitig erlöschen kann, wenn die Dienstleistung (Antragstellung) vor Ablauf der Widerrufsfrist vollständig erbracht wurde und Sie dem ausdrücklich zugestimmt haben.</p>
      </div>
    </div></section>
  </>);
}
