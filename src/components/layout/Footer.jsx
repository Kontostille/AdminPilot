import Logo from '../shared/Logo';
import { Link } from '../../utils/router';

const FOOTER_LINKS = {
  'Service': [
    { label: 'Leistungen', path: '/leistungen' },
    { label: 'So funktioniert\'s', path: '/so-funktionierts' },
    { label: 'Preise', path: '/preise' },
    { label: 'FAQ', path: '/faq' },
  ],
  'Über uns': [
    { label: 'Über AdminPilot', path: '/ueber-uns' },
    { label: 'Partner', path: '/partner' },
    { label: 'Presse', path: '/presse' },
    { label: 'Kontakt', path: '/kontakt' },
  ],
  'Rechtliches': [
    { label: 'Datenschutz', path: '/datenschutz' },
    { label: 'AGB', path: '/agb' },
    { label: 'Impressum', path: '/impressum' },
    { label: 'Widerruf', path: '/widerruf' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--ap-dark)', color: '#FFFFFF',
      padding: 'var(--space-16) 0 var(--space-8)',
    }}>
      <div className="container" style={{ maxWidth: 'var(--max-width)' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-8)',
          marginBottom: 'var(--space-12)',
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <Logo size="small" />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ap-mint)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              Ihr Begleiter durch die Bürokratie.
              <br />Behördenanträge einfach & automatisch.
            </p>
            <a href="mailto:kontakt@adminpilot.de" style={{
              fontSize: 'var(--text-sm)', color: 'var(--ap-sage)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            }}>
              ✉ kontakt@adminpilot.de
            </a>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ap-mint)',
                marginBottom: 'var(--space-4)', letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {title}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} style={{
                      fontSize: 'var(--text-sm)', color: 'var(--ap-sage)',
                      transition: 'color var(--transition-fast)',
                    }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid rgba(200, 218, 208, 0.15)',
          paddingTop: 'var(--space-6)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 'var(--space-4)',
        }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', margin: 0 }}>
            © {new Date().getFullYear()} AdminPilot. Alle Rechte vorbehalten.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--ap-sage)', margin: 0 }}>
            AdminPilot bietet keine Rechts- oder Sozialberatung an. <Link to="/hinweis-rechtsberatung" style={{ color: 'var(--ap-mint)', textDecoration: 'underline' }}>Mehr erfahren</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
