/* AdminPilot – Leistungs-Icons als SVG
   Ersetzt Emojis durch saubere, einheitliche Icons */

const iconStyle = {
  width: '100%',
  height: '100%',
};

const Icons = {
  wohngeld: (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <rect x="8" y="22" width="32" height="20" rx="2" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M4 24L24 8L44 24" stroke="var(--ap-dark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="19" y="30" width="10" height="12" rx="1" fill="var(--ap-dark)" opacity="0.15"/>
      <rect x="12" y="27" width="6" height="5" rx="1" fill="var(--color-bg, #F8FAF9)" stroke="var(--ap-dark)" strokeWidth="1"/>
      <rect x="30" y="27" width="6" height="5" rx="1" fill="var(--color-bg, #F8FAF9)" stroke="var(--ap-dark)" strokeWidth="1"/>
    </svg>
  ),

  'kv-zuschuss': (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <rect x="8" y="10" width="32" height="28" rx="4" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M20 24H28M24 20V28" stroke="var(--ap-dark)" strokeWidth="2.5" strokeLinecap="round"/>
      <rect x="8" y="10" width="32" height="8" rx="4" fill="var(--ap-dark)" opacity="0.1"/>
      <circle cx="36" cy="34" r="8" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M33.5 34H38.5M36 31.5V36.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  kindererziehungszeiten: (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <circle cx="24" cy="14" r="6" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M14 38C14 31.4 18.5 26 24 26C29.5 26 34 31.4 34 38" stroke="var(--ap-dark)" strokeWidth="1.5" fill="var(--ap-mint)" strokeLinecap="round"/>
      <circle cx="36" cy="22" r="4" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.2"/>
      <path d="M30 38C30 33.6 32.7 30 36 30C38 30 39.7 31.2 40.7 33" stroke="var(--ap-dark)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M18 42L24 36L30 42" stroke="var(--ap-dark)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
    </svg>
  ),

  'em-rentenzuschlag': (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <rect x="10" y="8" width="28" height="36" rx="3" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <line x1="16" y1="16" x2="32" y2="16" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <line x1="16" y1="21" x2="28" y2="21" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <line x1="16" y1="26" x2="30" y2="26" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <circle cx="36" cy="36" r="9" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M33 36H39M36 33V39" stroke="#FFF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  kindergeld: (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <circle cx="18" cy="16" r="5" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <circle cx="32" cy="18" r="4" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.2"/>
      <path d="M10 38C10 31 13.6 26 18 26C22.4 26 26 31 26 38" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M24 38C24 33 27 29 32 29C35.5 29 38 32 38 36" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.8"/>
      <circle cx="38" cy="12" r="7" fill="var(--ap-gold, #E2C044)" stroke="var(--ap-dark)" strokeWidth="1.2"/>
      <text x="38" y="15.5" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--ap-dark)">€</text>
    </svg>
  ),

  kinderzuschlag: (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <circle cx="24" cy="24" r="16" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <text x="24" y="21" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--ap-dark)">€</text>
      <text x="24" y="32" textAnchor="middle" fontSize="7" fontWeight="500" fill="var(--ap-sage)">+</text>
      <circle cx="37" cy="12" r="7" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1.2"/>
      <path d="M34.5 12H39.5M37 9.5V14.5" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),

  basiselterngeld: (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <circle cx="24" cy="16" r="7" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <path d="M13 40C13 32 17.9 26 24 26C30.1 26 35 32 35 40" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <circle cx="24" cy="35" r="3" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1"/>
      <ellipse cx="24" cy="33" rx="2" ry="1.5" fill="var(--ap-dark)" opacity="0.1"/>
      <path d="M20 14.5C20 14.5 22 12 24 12C26 12 28 14.5 28 14.5" stroke="var(--ap-dark)" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),

  'bildung-teilhabe': (props) => (
    <svg viewBox="0 0 48 48" fill="none" style={iconStyle} {...props}>
      <rect x="10" y="14" width="22" height="28" rx="2" fill="var(--ap-mint)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <rect x="14" y="10" width="22" height="28" rx="2" fill="var(--color-bg, #F8FAF9)" stroke="var(--ap-dark)" strokeWidth="1.5"/>
      <line x1="19" y1="20" x2="31" y2="20" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <line x1="19" y1="25" x2="29" y2="25" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <line x1="19" y1="30" x2="27" y2="30" stroke="var(--ap-dark)" strokeWidth="1.2" opacity="0.3"/>
      <circle cx="25" cy="16" r="4" fill="var(--ap-dark)" opacity="0.08"/>
      <path d="M18 16L25 12L32 16L25 20Z" fill="var(--ap-sage)" stroke="var(--ap-dark)" strokeWidth="1" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function LeistungIcon({ id, size = 48 }) {
  const IconComponent = Icons[id];
  if (!IconComponent) return <div style={{ width: size, height: size, background: 'var(--ap-mint)', borderRadius: 'var(--radius-md)' }} />;
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <IconComponent />
    </div>
  );
}
