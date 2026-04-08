import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY } from '../../data/siteConfig.js';
export default function WartungPage() {
  return (<><SEOHead title="Wartung" noindex />
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>🔧</div>
        <h1>Wir sind gleich zurück</h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: 400, margin: 'var(--space-4) auto' }}>AdminPilot wird gerade gewartet. Wir sind in Kürze wieder für Sie da.</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Bei dringenden Fragen: <a href={'mailto:'+COMPANY.email}>{COMPANY.email}</a></p>
      </div>
    </section>
  </>);
}
