"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER = 'admin';
const FAKE_PASSWORD = 'password';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedAuth = sessionStorage.getItem('is-authenticated');
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      } else if (pathname !== '/login') {
        router.push('/login');
      }
    } catch (error) {
       if (pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const login = useCallback((user: string, pass: string): boolean => {
    if (user === FAKE_USER && pass === FAKE_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('is-authenticated', 'true');
      router.push('/');
      return true;
    }
    return false;
  }, [router]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('is-authenticated');
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
