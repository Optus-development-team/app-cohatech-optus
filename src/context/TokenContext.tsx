'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TokenContextType {
  balance: number;
  totalEarned: number;
  addTokens: (amount: number) => void;
  recentGain: number | null;
}

const TokenContext = createContext<TokenContextType | null>(null);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(1_240);
  const [totalEarned, setTotalEarned] = useState(3_580);
  const [recentGain, setRecentGain] = useState<number | null>(null);

  const addTokens = useCallback((amount: number) => {
    setBalance(p => p + amount);
    setTotalEarned(p => p + amount);
    setRecentGain(amount);
    setTimeout(() => setRecentGain(null), 2000);
  }, []);

  return (
    <TokenContext.Provider value={{ balance, totalEarned, addTokens, recentGain }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokens() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokens must be used within TokenProvider');
  return ctx;
}
