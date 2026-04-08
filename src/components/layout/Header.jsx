import { useState } from 'react';
import Logo from '../shared/Logo';
import Button from '../shared/Button';
import { Link, getPath } from '../../utils/router';

const NAV_ITEMS = [
  { label: 'Leistungen', path: '/leistungen' },
  { label: 'So funktioniert\'s', path: '/so-funktionierts' },
  { label: 'Preise', path: '/preise' },
  { label: 'FAQ', path: '/faq' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = getPath();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
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
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}
             className="desktop-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                fontSize: 'var(--text-sm)', fontWeight: 500,
                color: currentPath === item.path ? 'var(--ap-dark)' : 'var(--ap-sage)',
                transition: 'color var(--transition-fast)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <Button variant="dark" size="small" to="/leistungscheck">
            Anspruch prüfen
          </Button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: 'var(--space-2)', fontSize: '24px', color: 'var(--ap-dark)',
          }}
          aria-label="Menü öffnen"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--header-height)', left: 0, right: 0, bottom: 0,
          background: 'var(--color-bg)', zIndex: 99,
          display: 'flex', flexDirection: 'column', padding: 'var(--space-8)',
          gap: 'var(--space-4)',
        }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: 'var(--text-xl)', fontWeight: 600,
                color: 'var(--ap-dark)', padding: 'var(--space-3) 0',
                borderBottom: '1px solid var(--color-border-light)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Button variant="primary" fullWidth to="/leistungscheck" onClick={() => setMobileOpen(false)}>
              Anspruch prüfen →
            </Button>
          </div>
          <a href="mailto:kontakt@adminpilot.de" style={{
            fontSize: 'var(--text-sm)', color: 'var(--ap-sage)', textAlign: 'center',
            marginTop: 'var(--space-4)',
          }}>
            ✉ kontakt@adminpilot.de
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  );
}
