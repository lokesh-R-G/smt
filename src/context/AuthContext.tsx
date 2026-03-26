import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login, logout, type AuthUser } from '../services/api';

const AUTH_EXPIRED_EVENT = 'auth:expired';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const handleAuthExpired = () => {
      logout();
      setUser(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    await login(email, password);
    await refreshUser();
  };

  const signOut = () => {
    logout();
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      signIn,
      signOut,
      refreshUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
