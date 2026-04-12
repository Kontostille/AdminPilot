import Button from './Button';
import { Helmet } from 'react-helmet-async';

/* === Card === */
export function Card({ children, className, style, variant = 'default', ...props }) {
  const variants = {
    default: {
      background: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-sm)',
    },
    highlighted: {
      background: 'var(--color-bg-card)',
      border: '2px solid var(--ap-gold)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-md)',
    },
    dark: {
      background: 'var(--ap-dark)',
      color: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
    },
  };
  return (
    <div style={{ ...variants[variant], ...style }} className={className} {...props}>
      {children}
    </div>
  );
}

/* === TrustBar === */
export function TrustBar() {
  const items = [
    { icon: 'shield', text: 'DSGVO-konform' },
    { icon: 'lock', text: '256-Bit verschlüsselt' },
    { icon: 'check', text: 'Sozialverband-Partner' },
    { icon: '🇩🇪', text: 'Server in Deutschland' },
  ];
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 'var(--space-6)',
      padding: 'var(--space-4) 0',
      borderTop: '1px solid var(--color-border-light)',
      borderBottom: '1px solid var(--color-border-light)',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)',
        }}>
          <span style={{ fontSize: '16px' }}>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
}

/* === DisclaimerBanner === */
export function DisclaimerBanner({ variant = 'info' }) {
  const variants = {
    info: { bg: 'var(--color-border-light)', border: 'var(--color-border)', color: 'var(--color-text-muted)', icon: 'info' },
    legal: { bg: '#FFF8E7', border: '#E8D5A3', color: '#8B6914', icon: 'scale' },
    warning: { bg: '#FFF5F5', border: '#E8A3A3', color: 'var(--ap-error)', icon: 'alert' },
  };
  const v = variants[variant] || variants.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
      padding: 'var(--space-3) var(--space-4)',
      background: v.bg, borderRadius: 'var(--radius-md)',
      border: `1px solid ${v.border}`,
      fontSize: 'var(--text-sm)', color: v.color, lineHeight: 1.5,
    }}>
      <span style={{ fontSize: '14px', flexShrink: 0 }}>{v.icon}</span>
      <span>Diese Übersicht dient der allgemeinen Information und stellt keine Rechts- oder Sozialberatung dar. <a href="/hinweis-rechtsberatung" style={{ color: 'inherit', textDecoration: 'underline' }}>Mehr erfahren</a></span>
    </div>
  );
}

/* === CTABlock === */

export function CTABlock({ 
  headline = 'Prüfen Sie jetzt kostenlos, worauf Sie möglicherweise Anspruch haben.', 
  buttonText = 'Zum kostenlosen Leistungscheck',
  buttonTo = '/leistungscheck',
  variant = 'light',
}) {
  const isDark = variant === 'dark';
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-12) var(--space-4)',
      background: isDark ? 'var(--ap-dark)' : 'var(--color-border-light)',
      borderRadius: 'var(--radius-xl)',
    }}>
      <h2 style={{
        fontSize: 'var(--text-2xl)', fontWeight: 600, marginBottom: 'var(--space-6)',
        color: isDark ? '#FFFFFF' : 'var(--ap-dark)',
        maxWidth: '600px', margin: '0 auto var(--space-6)',
      }}>
        {headline}
      </h2>
      <Button variant={isDark ? 'primary' : 'primary'} size="large" to={buttonTo}>
        {buttonText} →
      </Button>
    </div>
  );
}

/* === SEOHead === */

export function SEOHead({ title, description, keywords, noindex = false }) {
  const fullTitle = title ? `${title} | AdminPilot` : 'AdminPilot – Ihr Begleiter durch die Bürokratie';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="AdminPilot" />
    </Helmet>
  );
}
