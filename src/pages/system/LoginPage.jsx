import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';
export default function LoginPage() {
  return (<><SEOHead title="Anmelden" noindex />
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ marginBottom: 'var(--space-2)' }}>Anmelden</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>Geben Sie Ihre E-Mail-Adresse ein – wir senden Ihnen einen Anmelde-Link.</p>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input type="email" placeholder="Ihre E-Mail-Adresse" style={{ width: '100%', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-border)', fontSize: 'var(--text-base)', fontFamily: 'var(--font-body)', outline: 'none' }} />
      </div>
      <Button variant="primary" fullWidth>Anmelde-Link senden →</Button>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>Noch kein Konto? Wird automatisch erstellt.</p>
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--space-4)' }}>
        🔒 Kein Passwort nötig. Der Anmelde-Link ist 15 Minuten gültig.
      </p>
    </div>
  </>);
}
