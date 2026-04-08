import { SignIn } from '@clerk/clerk-react';
import { SEOHead } from '../../components/shared/index.jsx';

export default function LoginPage() {
  return (
    <>
      <SEOHead title="Anmelden" noindex />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SignIn
          routing="hash"
          afterSignInUrl="/app"
          afterSignUpUrl="/app"
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: { boxShadow: 'none', border: 'none', background: 'transparent' },
              formButtonPrimary: {
                background: 'var(--ap-gold)',
                color: 'var(--ap-dark)',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
              },
              formFieldInput: {
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-border)',
              },
              footerActionLink: { color: 'var(--ap-sage)' },
            },
          }}
        />
      </div>
    </>
  );
}
