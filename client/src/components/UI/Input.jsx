// client/src/components/UI/Input.jsx
import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  style = {},
  containerStyle = {},
  ...props
}) => {
  return (
    <div style={{ ...styles.container, ...containerStyle }}>
      {label && (
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--accent-primary)';
          e.currentTarget.style.boxShadow = error
            ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
            : '0 0 0 3px rgba(192, 132, 252, 0.15)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? 'var(--error)' : 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        style={{
          ...styles.input,
          borderColor: error ? 'var(--error)' : 'var(--border-color)',
          ...style,
        }}
        {...props}
      />
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
    marginBottom: '16px',
    textAlign: 'left',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-secondary)',
  },
  required: {
    color: 'var(--error)',
  },
  input: {
    padding: '12px 14px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    width: '100%',
  },
  errorText: {
    fontSize: '12px',
    color: 'var(--error)',
    marginTop: '2px',
    fontWeight: '500',
  },
};

export default Input;
