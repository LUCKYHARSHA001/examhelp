// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI, setAccessToken } from '../api/api.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchMe = async () => {
    try {
      const userData = await userAPI.getMe();
      setUser(userData);
    } catch (err) {
      console.error('[AuthContext] FetchMe failed:', err);
      // If fetching profile fails, reset auth
      logoutLocal();
    }
  };

  const handleAuthSuccess = async (accessToken, message) => {
    setToken(accessToken);
    setAccessToken(accessToken);
    localStorage.setItem('isAuthenticated', 'true');
    await fetchMe();
    if (message) addToast(message, 'success');
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      await handleAuthSuccess(data.accessToken, 'Successfully logged in!');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Invalid email or password.';
      addToast(errMsg, 'error');
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const data = await authAPI.signup(name, email, password);
      await handleAuthSuccess(data.accessToken, 'Account created successfully!');
      return true;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to create account.';
      addToast(errMsg, 'error');
      throw err;
    }
  };

  const logoutLocal = () => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
    localStorage.removeItem('isAuthenticated');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      addToast('Logged out successfully.', 'info');
    } catch (err) {
      console.error('[AuthContext] Logout API error:', err);
    } finally {
      logoutLocal();
    }
  };

  // Attempt silent refresh on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const isAuthHint = localStorage.getItem('isAuthenticated') === 'true';
      if (!isAuthHint) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.refresh();
        if (data?.accessToken) {
          setToken(data.accessToken);
          setAccessToken(data.accessToken);
          const userData = await userAPI.getMe();
          setUser(userData);
        }
      } catch (err) {
        console.warn('[AuthContext] Silent refresh failed or expired');
        localStorage.removeItem('isAuthenticated');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        fetchMe,
        handleAuthSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
