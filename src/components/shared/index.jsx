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
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, text: 'DSGVO-konform' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, text: '256-Bit verschlüsselt' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, text: 'Sozialverband-Partner' },
    { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>, text: 'Server in Deutschland' },
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
  const icons = {
    info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    scale: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22V8"/><path d="m3 3 5 5"/><path d="m21 3-5 5"/></svg>,
    alert: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  };
  const variants = {
    info: { bg: 'var(--color-border-light)', border: 'var(--color-border)', color: 'var(--color-text-muted)', icon: icons.info },
    legal: { bg: '#FFF8E7', border: '#E8D5A3', color: '#8B6914', icon: icons.scale },
    warning: { bg: '#FFF5F5', border: '#E8A3A3', color: 'var(--ap-error)', icon: icons.alert },
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
      <span style={{ flexShrink: 0, marginTop: 2 }}>{v.icon}</span>
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
