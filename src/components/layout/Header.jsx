import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Logo from '../shared/Logo';
import Button from '../shared/Button';
import { Link, getPath } from '../../utils/router';

const NAV_ITEMS = [
  { label: 'Leistungen', path: '/leistungen' },
  { label: "So funktioniert's", path: '/so-funktionierts' },
  { label: 'Preise', path: '/preise' },
  { label: 'FAQ', path: '/faq' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = getPath();
  const { isSignedIn } = useUser();

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(248, 250, 249, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border-light)',
        height: 'var(--header-height)',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '100%', maxWidth: 'var(--max-width)',
        }}>
          <Logo />

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path} style={{
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: currentPath === item.path ? 'var(--ap-dark)' : 'var(--ap-sage)',
                transition: 'color var(--transition-fast)',
              }}>
                {item.label}
              </Link>
            ))}
            {isSignedIn ? (
              <Button variant="dark" size="small" to="/app">Mein Dashboard</Button>
            ) : (
              <Button variant="dark" size="small" to="/leistungscheck">Kostenlos prüfen</Button>
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', fontSize: '24px', color: 'var(--ap-dark)', zIndex: 1001,
          }} aria-label="Menü öffnen">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--color-bg)', zIndex: 999,
          display: 'flex', flexDirection: 'column',
          paddingTop: 'calc(var(--header-height) + var(--space-4))',
          paddingLeft: 'var(--space-6)', paddingRight: 'var(--space-6)',
        }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} onClick={closeMobile} style={{
              fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--ap-dark)',
              padding: 'var(--space-4) 0',
              borderBottom: '1px solid var(--color-border-light)',
              textDecoration: 'none', display: 'block',
            }}>
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 'var(--space-6)' }}>
            {isSignedIn ? (
              <Button variant="primary" fullWidth to="/app" onClick={closeMobile}>Mein Dashboard →</Button>
            ) : (
              <Button variant="primary" fullWidth to="/leistungscheck" onClick={closeMobile}>Kostenlos Anspruch prüfen →</Button>
            )}
          </div>
          <a href="mailto:info@adminpilot.de" style={{
            fontSize: 'var(--text-sm)', color: 'var(--ap-sage)', textAlign: 'center',
            marginTop: 'var(--space-6)', textDecoration: 'none',
          }}>
            ✉ info@adminpilot.de
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
