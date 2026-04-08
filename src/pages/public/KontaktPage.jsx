import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
import { COMPANY } from '../../data/siteConfig.js';

export default function KontaktPage() {
  return (
    <>
      <SEOHead title="Kontakt" description="Schreiben Sie uns – wir helfen Ihnen gerne weiter." />
      <section className="section">
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h1 style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>Kontakt</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: 'var(--space-10)', maxWidth: 500, margin: '0 auto var(--space-10)' }}>Haben Sie Fragen zu AdminPilot? Schreiben Sie uns – wir antworten in der Regel innerhalb von 24 Stunden.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ padding: 'var(--space-6)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Per E-Mail</h3>
              <a href={'mailto:'+COMPANY.email} style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--ap-dark)' }}>{COMPANY.email}</a>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Mo–Fr, 9–17 Uhr · Antwort innerhalb von 24 Stunden</p>
            </div>
            <div style={{ padding: 'var(--space-6)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Adresse</h3>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: 1.8 }}>{COMPANY.name}<br/>{COMPANY.address}<br/>{COMPANY.zip} {COMPANY.city}<br/>{COMPANY.country}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
