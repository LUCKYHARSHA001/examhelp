// client/src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button.jsx';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container} className="animate-fade-in">
      <span style={styles.icon}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      </span>
      <h2 style={styles.title}>404 — Page Not Found</h2>
      <p style={styles.subtitle}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Button onClick={() => navigate('/dashboard')} style={{ marginTop: '16px' }} className="button-shine">
        Return to Portal
      </Button>
    </div>
  );
};

const styles = {
  container: {
    padding: '80px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'var(--font-secondary)',
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-secondary)',
    maxWidth: '400px',
    marginBottom: '24px',
  },
};

export default NotFound;
