import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
export default function PartnerPage() {
  return (<><SEOHead title="Partner" />
    <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 'var(--space-3)' }}>Partnerschaften</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 500, margin: '0 auto var(--space-6)' }}>Wir arbeiten an Partnerschaften mit Sozialverbänden und Beratungsstellen, um unseren Service für Sie noch besser zu machen.</p>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Sind Sie ein Sozialverband oder eine Beratungsstelle und möchten mit uns zusammenarbeiten?</p>
        <Button to="/kontakt">Kontakt aufnehmen →</Button>
      </div>
    </section>
  </>);
}
