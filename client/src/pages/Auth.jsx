// client/src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { authAPI } from '../api/api.js';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';

const Auth = () => {
  const navigate = useNavigate();
  const { user, login, signup } = useAuth();
  const { addToast } = useToast();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot' | 'otp'
  
  // Form values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};
    if (mode === 'signup' && !name.trim()) nextErrors.name = 'Name is required';
    if (!email) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = 'Invalid email address';
    }
    if (mode !== 'forgot' && mode !== 'otp') {
      if (!password) {
        nextErrors.password = 'Password is required';
      } else if (password.length < 8) {
        nextErrors.password = 'Password must be at least 8 characters';
      }
    }
    if (mode === 'otp' && otpCode.length !== 6) {
      nextErrors.otpCode = 'Enter a valid 6-digit verification code';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/dashboard');
      } else if (mode === 'signup') {
        await signup(name, email, password);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        // Mocking client-side forgot password flow
        addToast(`Verification code dispatched to ${email}`, 'success');
        setMode('otp');
      } else if (mode === 'otp') {
        // Mocking client-side OTP validation
        addToast('Verification complete!', 'success');
        addToast('Authentication successful!', 'success');
        // Let's log them in as a mock user for the demo if not already authenticated
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('[Auth Page Submit Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authAPI.getGoogleOAuthUrl();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-fade-in">
        {/* Header Branding */}
        <div style={styles.branding}>
          <div style={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#FFFFFF' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
          </div>
          <h2 style={styles.title}>StudySnap</h2>
          <p style={styles.subtitle}>
            {mode === 'login' && 'Unlock study materials & practice tools'}
            {mode === 'signup' && 'Create your advanced student account'}
            {mode === 'forgot' && 'Reset your secure password'}
            {mode === 'otp' && 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Adam Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />
          )}

          {mode !== 'otp' && (
            <Input
              label="Email Address"
              type="email"
              placeholder="student@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
          )}

          {mode === 'otp' && (
            <Input
              label="6-Digit OTP Verification Code"
              type="text"
              placeholder="123456"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              error={errors.otpCode}
              required
            />
          )}

          {(mode === 'login' || mode === 'signup') && (
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />
          )}

          {mode === 'login' && (
            <div style={styles.forgotContainer}>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={styles.textBtn}
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" loading={loading} style={styles.submitBtn}>
            {mode === 'login' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Send Code'}
            {mode === 'otp' && 'Verify & Access'}
          </Button>
        </form>

        {/* Divider line */}
        {mode !== 'otp' && (
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>
        )}

        {/* Social Authentication */}
        {mode !== 'otp' && (
          <Button
            onClick={handleGoogleLogin}
            variant="secondary"
            style={styles.googleBtn}
          >
            <svg style={styles.googleIcon} viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.014c1.65 0 3.125.68 4.2 1.777l3.187-3.187C19.167 3.013 16.51 2 13.99 2c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.3 0 9.5-3.8 9.5-9.5 0-.6-.05-1.115-.15-1.615H12.24Z"
              />
            </svg>
            Google OAuth 2.0
          </Button>
        )}

        {/* Auth Switch Link */}
        <div style={styles.switchBox}>
          {mode === 'login' && (
            <>
              New to StudySnap?{' '}
              <button onClick={() => setMode('signup')} style={styles.linkBtn}>
                Register now
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} style={styles.linkBtn}>
                Sign in
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} style={styles.linkBtn}>
              Back to sign in
            </button>
          )}
          {mode === 'otp' && (
            <button
              onClick={() => {
                setMode('forgot');
                setOtpCode('');
              }}
              style={styles.linkBtn}
            >
              Resend verification code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    textAlign: 'center',
  },
  branding: {
    marginBottom: '32px',
  },
  logo: {
    fontSize: '28px',
    width: '48px',
    height: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    boxShadow: 'var(--shadow-glow)',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'var(--font-secondary)',
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  forgotContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
    marginTop: '-8px',
  },
  textBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-primary)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'color var(--transition-fast)',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    marginTop: '8px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--border-color)',
  },
  dividerText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    padding: '0 12px',
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: '0.05em',
  },
  googleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  googleIcon: {
    flexShrink: 0,
  },
  switchBox: {
    marginTop: '32px',
    fontSize: '14px',
    color: 'var(--text-secondary)',
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-primary)',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '2px',
    transition: 'color var(--transition-fast)',
  },
};

export default Auth;
