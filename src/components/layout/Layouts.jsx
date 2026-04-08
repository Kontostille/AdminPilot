import Header from './Header';
import Footer from './Footer';
import { Link, getPath } from '../../utils/router.jsx';
import Logo from '../shared/Logo';

/* === PublicLayout === */
export function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: 'calc(100vh - var(--header-height) - 300px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}

/* === AppLayout === */
const APP_NAV = [
  { icon: '📊', label: 'Dashboard', path: '/app' },
  { icon: '➕', label: 'Neuer Antrag', path: '/app/neuer-antrag' },
  { icon: '📄', label: 'Dokumente', path: '/app/dokumente' },
  { icon: '👤', label: 'Profil', path: '/app/profil' },
  { icon: '❓', label: 'Hilfe', path: '/app/hilfe' },
];

export function AppLayout({ children }) {
  const currentPath = getPath();
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="app-sidebar" style={{
        width: 240, background: 'var(--ap-dark)', color: '#FFF',
        padding: 'var(--space-6)', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
      }}>
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <Logo size="small" />
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
          {APP_NAV.map((item) => {
            const isActive = currentPath === item.path || (item.path !== '/app' && currentPath.startsWith(item.path));
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? '#FFF' : 'var(--ap-mint)',
                transition: 'all var(--transition-fast)',
                textDecoration: 'none',
              }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)' }}>
          <Link to="/" style={{
            fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', textDecoration: 'none',
            display: 'block', padding: 'var(--space-2) var(--space-4)',
          }}>
            ← Zurück zur Website
          </Link>
        </div>
      </aside>
      <main className="app-content" style={{
        flex: 1, marginLeft: 240, padding: 'var(--space-8)',
        background: 'var(--color-bg)', minHeight: '100vh',
      }}>
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .app-sidebar { display: none !important; }
          .app-content { margin-left: 0 !important; padding: var(--space-4) !important; }
        }
      `}</style>
    </div>
  );
}

/* === AuthLayout === */
export function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--color-bg)', padding: 'var(--space-8)',
    }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <Logo size="large" />
      </div>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
      }}>
        {children}
      </div>
      <p style={{
        marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
      }}>
        © {new Date().getFullYear()} AdminPilot · <a href="/datenschutz" style={{ color: 'inherit' }}>Datenschutz</a> · <a href="/impressum" style={{ color: 'inherit' }}>Impressum</a>
      </p>
    </div>
  );
}
