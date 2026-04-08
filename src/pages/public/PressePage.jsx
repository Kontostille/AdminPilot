import { SEOHead } from '../../components/shared/index.jsx';
import { COMPANY } from '../../data/siteConfig.js';

export default function PressePage() {
  return (
    <>
      <SEOHead title="Presse" description="Pressematerialien und Medienkontakt für AdminPilot." />
      <section className="section">
        <div className="container" style={{ maxWidth: 'var(--max-width-narrow)' }}>
          <h1 style={{ marginBottom: 'var(--space-3)' }}>Presse</h1>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>Pressematerialien und Medienkontakt. Für Anfragen wenden Sie sich bitte an:</p>
          <div style={{ padding: 'var(--space-6)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Medienkontakt</h3>
            <p style={{ lineHeight: 1.8 }}>{COMPANY.name}<br/>E-Mail: <a href={'mailto:'+COMPANY.email}>{COMPANY.email}</a><br/>{COMPANY.address}, {COMPANY.zip} {COMPANY.city}</p>
          </div>
          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-6)', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)' }}>Über AdminPilot</h3>
            <p style={{ lineHeight: 1.8 }}>AdminPilot ist ein digitaler Antragsservice der {COMPANY.name}. Der Service hilft Privatpersonen in Deutschland, staatliche Leistungen wie Wohngeld, Kindergeld oder KV-Zuschuss einfach und automatisiert zu beantragen.</p>
          </div>
        </div>
      </section>
    </>
  );
}
