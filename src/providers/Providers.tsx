'use client';

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { TokenProvider } from '@/context/TokenContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TokenProvider>
        {children}
      </TokenProvider>
    </AuthProvider>
  );
}
