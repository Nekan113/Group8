import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import HttpHelper from '../services/httpHelper';
import authConfig from '../config/authConfig';

const AuthContext = createContext(null);

const DEV_USER = import.meta.env.VITE_DEV_BYPASS === 'true'
  ? {
      _id: 'dev-user-001',
      username: 'DevPlayer',
      email: 'dev@test.com',
      country: 'Australia',
      role: 'PLAYER',
      isPremium: true,
      walletBalance: 50,
      avatarUrl: null,
      isActive: true,
    }
  : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEV_USER);
  const [loading, setLoading] = useState(!DEV_USER);

  useEffect(() => {
    if (DEV_USER) return; // skip real auth in dev bypass mode
    const token = HttpHelper.getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authConfig && HttpHelper.get(authConfig.me)
      .then(({ data, ok }) => {
        if (ok) setUser(data.user ?? data);
      })
      .catch(() => HttpHelper.removeToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    HttpHelper.setToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await HttpHelper.post(authConfig.logout);
    } catch (_) { /* ignore network errors on logout */ }
    HttpHelper.removeToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((partial) => {
    setUser((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
