import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
export default function NotFoundPage() {
  return (<><SEOHead title="Seite nicht gefunden" noindex />
    <section style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 'var(--space-4)', opacity: 0.3 }}>🧭</div>
        <h1 style={{ marginBottom: 'var(--space-3)' }}>Seite nicht gefunden</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: '0 auto var(--space-6)' }}>Die gesuchte Seite existiert leider nicht. Vielleicht finden Sie hier, was Sie suchen:</p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/">Zur Startseite</Button>
          <Button variant="secondary" to="/leistungscheck">Leistungscheck</Button>
          <Button variant="ghost" to="/kontakt">Kontakt</Button>
        </div>
      </div>
    </section>
  </>);
}
