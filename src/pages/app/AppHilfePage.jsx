import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { COMPANY } from '../../data/siteConfig.js';

export default function AppHilfePage() {
  return (
    <>
      <SEOHead title="Hilfe" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Hilfe & Support</h1>
      <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 500 }}>
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>E-Mail-Support</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>Wir antworten innerhalb von 24 Stunden.</p>
          <a href={'mailto:'+COMPANY.email} style={{ fontWeight: 600, color: 'var(--ap-dark)' }}>{COMPANY.email}</a>
        </div>
        <div style={{ padding: 'var(--space-5)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Häufige Fragen</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>Antworten auf die wichtigsten Fragen.</p>
          <Button variant="ghost" size="small" to="/faq">FAQ ansehen →</Button>
        </div>
      </div>
    </>
  );
}
