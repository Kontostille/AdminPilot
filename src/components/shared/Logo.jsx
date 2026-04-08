import { Link } from '../../utils/router';

export default function Logo({ size = 'default' }) {
  const sizes = {
    small: { circle: 24, star: 12, fontSize: 16, gap: 8 },
    default: { circle: 32, star: 16, fontSize: 20, gap: 10 },
    large: { circle: 40, star: 20, fontSize: 24, gap: 12 },
  };
  const s = sizes[size] || sizes.default;

  return (
    <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: s.gap, textDecoration: 'none' }}>
      <svg width={s.circle} height={s.circle} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" fill="var(--ap-dark)" />
        <polygon points="28,10 31.5,25.5 44,28 31.5,30.5 28,46 24.5,30.5 12,28 24.5,25.5" fill="#FFFFFF" />
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: s.fontSize, fontWeight: 400, letterSpacing: '0.3px' }}>
        <span style={{ color: 'var(--ap-sage)' }}>Admin</span>
        <span style={{ color: 'var(--ap-dark)' }}>Pilot</span>
      </span>
    </Link>
  );
}
