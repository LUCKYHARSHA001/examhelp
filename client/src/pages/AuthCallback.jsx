// client/src/pages/AuthCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthSuccess } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const processToken = async () => {
      const token = searchParams.get('token');
      if (token) {
        try {
          await handleAuthSuccess(token, 'Signed in with Google successfully!');
          navigate('/dashboard');
        } catch (err) {
          console.error('[Auth Callback] Error handling authentication success:', err);
          addToast('Google authentication failed. Please try again.', 'error');
          navigate('/auth');
        }
      } else {
        addToast('No authorization token found. Please try again.', 'error');
        navigate('/auth');
      }
    };

    processToken();
  }, [searchParams, handleAuthSuccess, navigate, addToast]);

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <span style={styles.text}>Finalizing secure authentication credentials...</span>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
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
  text: {
    fontFamily: 'var(--font-secondary)',
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default AuthCallback;
