import { SEOHead } from '../../components/shared/index.jsx';
import { useAppUser } from '../../utils/auth.jsx';
import { useClerk } from '@clerk/clerk-react';
import Button from '../../components/shared/Button.jsx';

export default function ProfilPage() {
  const { user, profile } = useAppUser();
  const { signOut } = useClerk();

  return (
    <>
      <SEOHead title="Profil" noindex />
      <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)' }}>Mein Profil</h1>
      <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: 'var(--space-6)', maxWidth: 500 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-full)', background: 'var(--ap-dark)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)', fontWeight: 600 }}>
            {user?.firstName?.charAt(0) || '?'}
          </div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--ap-dark)' }}>{user?.fullName || 'Nutzer'}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)' }}>
          <button onClick={() => signOut().then(() => window.location.href = '/')} style={{
            background: 'none', border: '1px solid var(--ap-error)', color: 'var(--ap-error)',
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
            cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 500,
          }}>
            Abmelden
          </button>
        </div>
      </div>
    </>
  );
}
