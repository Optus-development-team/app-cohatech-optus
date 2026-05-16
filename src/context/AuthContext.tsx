'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'student' | 'merchant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User & { password: string }> = {
  'estudiante@umsa.bo': { id: 'stu-001', name: 'Valentina Quispe', email: 'estudiante@umsa.bo', role: 'student', password: 'demo123' },
  'comerciante@mercado.bo': { id: 'mer-001', name: 'Don Roberto Mamani', email: 'comerciante@mercado.bo', role: 'merchant', password: 'demo123' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const found = MOCK_USERS[email.toLowerCase()];
    if (!found || found.password !== password) { setIsLoading(false); throw new Error('Credenciales incorrectas.'); }
    const { password: _, ...userData } = found;
    setUser(userData);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
