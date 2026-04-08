import { SEOHead } from '../../components/shared/index.jsx';

export default function UeberUnsPage() {
  return (
    <>
      <SEOHead title="Über AdminPilot" description="Team, Mission und Geschichte" />
      <div className="section">
        <div className="container">
          <div style={{
            padding: 'var(--space-16) 0',
            textAlign: 'center',
          }}>
            <span style={{
              display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-full)',
              background: 'var(--ap-mint)', color: 'var(--ap-dark)',
              fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-4)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              Über uns
            </span>
            <h1 style={{ marginBottom: 'var(--space-4)' }}>Über AdminPilot</h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              Team, Mission und Geschichte
            </p>
            <div style={{
              marginTop: 'var(--space-8)',
              padding: 'var(--space-6)',
              background: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--color-border)',
              maxWidth: '400px',
              margin: 'var(--space-8) auto 0',
            }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                🚧 Diese Seite wird aktuell entwickelt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
