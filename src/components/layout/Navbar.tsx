'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-8 sm:px-10 md:px-14 lg:px-20">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/optus%20logo.gif"
            alt="OptusCocha"
            width={170}
            height={50}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Inicio
              </Link>
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
                <Image src="/iconolog.png" alt="Usuario" width={18} height={18} />
                Login
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass px-4 py-2 rounded-full">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-[var(--color-primary)] text-white">
                  {user?.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-900">
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
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900" 
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mx-4 mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setOpen(false)} 
                className="text-sm py-2 text-slate-600"
              >
                Inicio
              </Link>
              <Link 
                href="/login" 
                onClick={() => setOpen(false)} 
                className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm"
              >
                <Image src="/iconolog.png" alt="Usuario" width={18} height={18} />
                Login
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
