import Header from './Header';
import Footer from './Footer';
import { Link, getPath } from '../../utils/router.jsx';
import Logo from '../shared/Logo';
import { UserButton, useUser } from '@clerk/clerk-react';
import AppIcon from '../shared/AppIcon.jsx';

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
  { icon: 'dashboard', label: 'Dashboard', path: '/app' },
  { icon: 'plus', label: 'Neuer Antrag', path: '/app/neuer-antrag' },
  { icon: 'document', label: 'Dokumente', path: '/app/dokumente' },
  { icon: 'user', label: 'Profil', path: '/app/profil' },
  { icon: 'help', label: 'Hilfe', path: '/app/hilfe' },
];

export function AppLayout({ children }) {
  const currentPath = getPath();
  const { user } = useUser();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
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
                padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)', fontWeight: isActive ? 600 : 400,
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? '#FFF' : 'var(--ap-mint)',
                transition: 'all var(--transition-fast)', textDecoration: 'none',
              }}>
                <AppIcon name={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: '#FFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.firstName || 'Nutzer'}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.primaryEmailAddress?.emailAddress || ''}</div>
            </div>
          </div>
          <Link to="/" style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', textDecoration: 'none', display: 'block', padding: 'var(--space-2) var(--space-4)' }}>← Zurück zur Website</Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="app-mobile-bar" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--ap-dark)', height: 56, padding: '0 var(--space-4)',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size="small" />
        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: 28, height: 28 } } }} />
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="app-mobile-nav" style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#FFF', borderTop: '1px solid var(--color-border)',
        padding: '6px 0 env(safe-area-inset-bottom, 6px)',
        justifyContent: 'space-around',
      }}>
        {APP_NAV.slice(0, 4).map((item) => {
          const isActive = currentPath === item.path || (item.path !== '/app' && currentPath.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              padding: '4px 8px', textDecoration: 'none', fontSize: 10, fontWeight: 500,
              color: isActive ? 'var(--ap-dark)' : 'var(--ap-sage)',
            }}>
              <AppIcon name={item.icon} size={18} />
              {item.label.split(' ')[0]}
            </Link>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="app-content" style={{
        flex: 1, marginLeft: 240, padding: 'var(--space-8)',
        background: 'var(--color-bg)', minHeight: '100vh',
      }}>
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .app-sidebar { display: none !important; }
          .app-mobile-bar { display: flex !important; }
          .app-mobile-nav { display: flex !important; }
          .app-content {
            margin-left: 0 !important;
            padding: var(--space-4) !important;
            padding-top: 72px !important;
            padding-bottom: 80px !important;
          }
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
      background: 'var(--color-bg)', padding: 'var(--space-6)',
    }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <Logo size="large" />
      </div>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--color-bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
      }}>
        {children}
      </div>
      <p style={{ marginTop: 'var(--space-6)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
        © {new Date().getFullYear()} AdminPilot · <a href="/datenschutz" style={{ color: 'inherit' }}>Datenschutz</a> · <a href="/impressum" style={{ color: 'inherit' }}>Impressum</a>
      </p>
    </div>
  );
}
