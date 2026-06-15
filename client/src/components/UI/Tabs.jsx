// client/src/components/UI/Tabs.jsx
import React from 'react';

const Tabs = ({ tabs, activeTab, onChange, style = {} }) => {
  return (
    <div style={{ ...styles.container, ...style }}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            style={{
              ...styles.tab,
              ...(isActive ? styles.activeTab : {}),
            }}
          >
            {tab.icon && <span style={styles.icon}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {isActive && <div style={styles.activeIndicator} />}
          </button>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
    gap: '24px',
    marginBottom: '24px',
  },
  tab: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '600',
    padding: '12px 4px',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-secondary)',
    transition: 'color var(--transition-fast)',
  },
  activeTab: {
    color: 'var(--accent-primary)',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: 'var(--accent-primary)',
    borderRadius: '1px',
    boxShadow: 'var(--shadow-glow)',
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
  },
};

export default Tabs;
