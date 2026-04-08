import { navigate } from '../../utils/router';

const styles = {
  base: {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 'var(--text-base)',
    padding: '12px 28px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    textDecoration: 'none',
    lineHeight: 1.4,
  },
  primary: {
    background: 'var(--ap-gold)',
    color: 'var(--ap-dark)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--ap-dark)',
    border: '2px solid var(--ap-dark)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ap-sage)',
    border: '1px solid var(--ap-mint)',
  },
  dark: {
    background: 'var(--ap-dark)',
    color: '#FFFFFF',
  },
  large: {
    padding: '16px 36px',
    fontSize: 'var(--text-lg)',
  },
  small: {
    padding: '8px 16px',
    fontSize: 'var(--text-sm)',
  },
  fullWidth: {
    width: '100%',
  },
};

export default function Button({ 
  children, 
  variant = 'primary', 
  size, 
  fullWidth, 
  to, 
  onClick, 
  disabled,
  style: customStyle,
  ...props 
}) {
  const handleClick = (e) => {
    if (to) {
      e.preventDefault();
      navigate(to);
    }
    if (onClick) onClick(e);
  };

  const combinedStyle = {
    ...styles.base,
    ...styles[variant],
    ...(size === 'large' && styles.large),
    ...(size === 'small' && styles.small),
    ...(fullWidth && styles.fullWidth),
    ...(disabled && { opacity: 0.5, cursor: 'not-allowed' }),
    ...customStyle,
  };

  const Tag = to ? 'a' : 'button';

  return (
    <Tag
      href={to || undefined}
      onClick={handleClick}
      disabled={disabled}
      style={combinedStyle}
      {...props}
    >
      {children}
    </Tag>
  );
}
