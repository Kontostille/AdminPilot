import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
export default function UeberUnsPage() {
  return (<><SEOHead title="Über AdminPilot" noindex />
    <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: 'var(--space-3)' }}>Über AdminPilot</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>Diese Seite wird aktuell vorbereitet. Erfahren Sie in der Zwischenzeit mehr über unseren Service.</p>
        <Button to="/so-funktionierts">So funktioniert's →</Button>
      </div>
    </section>
  </>);
}
