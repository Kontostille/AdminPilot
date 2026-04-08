import { SEOHead } from '../../components/shared/index.jsx';
import Button from '../../components/shared/Button.jsx';

export default function LoginVerifyPage() {
  return (
    <>
      <SEOHead title="E-Mail prüfen" noindex />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 'var(--space-4)' }}>✉️</div>
        <h2 style={{ marginBottom: 'var(--space-3)' }}>Prüfen Sie Ihr E-Mail-Postfach</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
          Wir haben Ihnen einen Anmelde-Link gesendet. Klicken Sie auf den Link in der E-Mail.
        </p>
        <Button variant="ghost" to="/login">Neuen Link anfordern</Button>
      </div>
    </>
  );
}
