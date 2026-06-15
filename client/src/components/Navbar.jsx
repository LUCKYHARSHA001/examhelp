// client/src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Determine page title based on path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Student Dashboard';
      case '/exams':
        return 'Practice Exams';
      case '/profile':
        return 'Student Profile';
      default:
        if (location.pathname.startsWith('/summary/')) {
          return 'Study Guide Guide';
        }
        return 'StudySnap';
    }
  };

  const usagePercent = user
    ? Math.min((user.dailyRequestCount / user.dailyLimit) * 100, 100)
    : 0;

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{getPageTitle()}</h1>

      {user && (
        <div style={styles.usageContainer}>
          <div style={styles.usageText}>
            <span>Daily AI Summarizer Limit</span>
            <span style={styles.usageNumbers}>
              {user.dailyRequestCount} / {user.dailyLimit}
            </span>
          </div>
          <div style={styles.progressBarBg}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${usagePercent}%`,
                background: usagePercent >= 90
                  ? 'var(--error)'
                  : usagePercent >= 70
                  ? 'var(--warning)'
                  : 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))',
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    height: 'var(--navbar-height)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)',
    paddingTop: '16px',
    paddingBottom: '16px',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-secondary)',
  },
  usageContainer: {
    width: '240px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  usageText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  usageNumbers: {
    color: 'var(--accent-primary)',
  },
  progressBarBg: {
    height: '6px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '3px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.02)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
export default Navbar;
