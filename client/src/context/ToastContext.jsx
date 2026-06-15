// client/src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast rendering portal container */}
      <div style={styles.toastContainer}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            style={{
              ...styles.toast,
              ...styles[t.type] || styles.info,
            }}
            className="animate-fade-in"
          >
            <div style={styles.iconWrapper}>
              {t.type === 'success' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
              )}
              {t.type === 'error' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              )}
              {t.type === 'warning' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              )}
              {t.type === 'info' && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              )}
            </div>
            <span style={styles.message}>{t.message}</span>
            <button style={styles.closeBtn}>&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  toastContainer: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '380px',
    width: '100%',
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '12px',
    backgroundColor: '#1E222D',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    userSelect: 'none',
  },
  message: {
    flex: 1,
    marginRight: '12px',
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#B4B8C5',
    fontSize: '16px',
    cursor: 'pointer',
    opacity: 0.7,
    padding: '2px',
    transition: 'opacity 150ms',
  },
  success: {
    borderLeft: '4px solid #22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.06)',
  },
  error: {
    borderLeft: '4px solid #EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.06)',
  },
  warning: {
    borderLeft: '4px solid #F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
  },
  info: {
    borderLeft: '4px solid #C084FC',
    backgroundColor: 'rgba(192, 132, 252, 0.06)',
  },
};
