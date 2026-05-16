'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Zap, Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-primary)]">
            <Zap size={16} color="white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">
            Optus<span className="gradient-text">Cocha</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link href="/" className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                Inicio
              </Link>
              <Link href="/login" className="btn-primary text-sm px-6 py-2.5">
                Ingresar
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-primary)] text-white">
                  {user?.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {user?.name.split(' ')[0]}
                </span>
                <span className="badge badge-primary text-xs">
                  {user?.role === 'student' ? 'Estudiante' : 'Comerciante'}
                </span>
              </div>
              <button onClick={logout} className="btn-ghost text-sm px-4 py-2 flex items-center gap-2">
                <LogOut size={14} /> Salir
              </button>
            </div>
          )}
        </div>

        <button 
          className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)]" 
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden glass mx-4 mb-4 p-4 rounded-xl">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setOpen(false)} 
                className="text-sm text-[var(--color-text-muted)] py-2"
              >
                Inicio
              </Link>
              <Link 
                href="/login" 
                onClick={() => setOpen(false)} 
                className="btn-primary text-sm"
              >
                Ingresar a la Plataforma
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 py-2">
                <User size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button onClick={logout} className="btn-ghost text-sm w-full justify-center">
                <LogOut size={14} /> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
