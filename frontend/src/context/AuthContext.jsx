import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * Refresh current user profile from backend session
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res && res.user) {
        setUser(res.user);
        setProfile(res.profile || null);
        setCompany(res.company || null);
        return res.user;
      }
      setUser(null);
      setProfile(null);
      setCompany(null);
      return null;
    } catch (err) {
      setUser(null);
      setProfile(null);
      setCompany(null);
      return null;
    }
  }, []);

  // Initial session restoration on mount
  useEffect(() => {
    let isMounted = true;
    async function initSession() {
      try {
        const res = await authService.getCurrentUser();
        if (isMounted) {
          if (res && res.user) {
            setUser(res.user);
            setProfile(res.profile || null);
            setCompany(res.company || null);
          } else {
            setUser(null);
            setProfile(null);
            setCompany(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setProfile(null);
          setCompany(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    initSession();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Log in user with credentials
   */
  const login = async (email, password, role = 'candidate', rememberMe = false) => {
    setAuthError(null);
    try {
      const res = await authService.login({ email, password, role, rememberMe });
      const token = res.token || res.data?.token || res.data?.tokens?.accessToken;

      if (token && typeof window !== 'undefined') {
        if (rememberMe) {
          window.localStorage.setItem('hc_token', token);
        } else {
          window.sessionStorage.setItem('hc_token', token);
        }
      }

      const activeUser = res.user || res.data?.user;
      setUser(activeUser || null);
      setProfile(res.profile || res.data?.profile || null);
      setCompany(res.company || res.data?.company || null);
      return { success: true, user: activeUser, role: activeUser?.role || role };
    } catch (err) {
      const message = err.message || 'Invalid email or password';
      setAuthError(message);
      throw err;
    }
  };

  /**
   * Register a new account
   */
  const register = async (registrationData) => {
    setAuthError(null);
    try {
      const res = await authService.register(registrationData);
      const token = res.token || res.data?.token || res.data?.tokens?.accessToken;

      if (token && typeof window !== 'undefined') {
        window.localStorage.setItem('hc_token', token);
      }

      const activeUser = res.user || res.data?.user;
      setUser(activeUser || null);
      setProfile(res.profile || res.data?.profile || null);
      setCompany(res.company || res.data?.company || null);
      return { success: true, user: activeUser };
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    }
  };

  /**
   * Sign out and clear stored tokens
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Continue cleanup on network error
    } finally {
      setUser(null);
      setProfile(null);
      setCompany(null);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('hc_token');
        window.sessionStorage.removeItem('hc_token');
        window.localStorage.removeItem('hireconnect_token');
      }
    }
  };

  /**
   * Update profile state in memory without full refetch
   */
  const updateProfileState = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const isAuthenticated = !!user;
  const role = user?.role || 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        company,
        role,
        isAuthenticated,
        loading,
        authError,
        login,
        register,
        logout,
        refreshUser,
        updateProfileState,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
