// client/src/components/Layout.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import Navbar from './Navbar.jsx';

const Layout = () => {
  const { user, loading } = useAuth();

  // Show a premium screen loading skeleton while validating token refresh
  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner}></div>
        <span style={styles.loadingText}>Initializing Student Portal...</span>
      </div>
    );
  }

  // Redirect unauthenticated requests to Auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  loadingScreen: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    gap: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(192, 132, 252, 0.1)',
    borderRadius: '50%',
    borderTopColor: 'var(--accent-primary)',
    animation: 'spin 1s ease-in-out infinite',
  },
  loadingText: {
    fontFamily: 'var(--font-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
};

// Define local animations inside index.css or direct injection
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleSheet);

export default Layout;
