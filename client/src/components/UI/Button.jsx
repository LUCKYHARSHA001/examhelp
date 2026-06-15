// client/src/components/UI/Button.jsx
import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      case 'danger':
        return styles.danger;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  const getHoverStyles = (e) => {
    if (disabled || loading) return;
    Object.assign(e.currentTarget.style, hoverStyles[variant] || hoverStyles.primary);
  };

  const resetStyles = (e) => {
    Object.assign(e.currentTarget.style, getVariantStyles());
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={getHoverStyles}
      onMouseLeave={resetStyles}
      onFocus={getHoverStyles}
      onBlur={resetStyles}
      style={{
        ...styles.base,
        ...getVariantStyles(),
        ...(disabled || loading ? styles.disabled : {}),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span style={styles.loadingWrapper}>
          <svg style={styles.spinner} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.15)"></circle>
            <path d="M4 12a8 8 0 0 1 8-8"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-primary)',
    transition: 'all var(--transition-fast)',
    outline: 'none',
    userSelect: 'none',
  },
  primary: {
    backgroundColor: 'var(--accent-primary)',
    color: '#0F1117',
    boxShadow: '0 4px 12px rgba(192, 132, 252, 0.25)',
  },
  secondary: {
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
  },
  danger: {
    backgroundColor: 'var(--error)',
    color: '#FFFFFF',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--accent-primary)',
    border: '1px solid var(--accent-primary)',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite',
  },
};

const hoverStyles = {
  primary: {
    backgroundColor: 'var(--highlight)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(192, 132, 252, 0.35)',
  },
  secondary: {
    backgroundColor: 'var(--bg-card-hover)',
    transform: 'translateY(-1px)',
    borderColor: 'var(--border-hover)',
  },
  danger: {
    backgroundColor: '#F87171',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(239, 68, 68, 0.3)',
  },
  outline: {
    backgroundColor: 'rgba(192, 132, 252, 0.08)',
    transform: 'translateY(-1px)',
  },
};

export default Button;
