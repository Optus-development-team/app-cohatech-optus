'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, ArrowRight, GraduationCap, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

const DEMOS = [
  { role: 'Estudiante', email: 'estudiante@umsa.bo', icon: GraduationCap, color: '#7c3aed' },
  { role: 'Comerciante', email: 'comerciante@mercado.bo', icon: Store, color: '#06b6d4' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const role = email.includes('comerciante') ? 'merchant' : 'student';
      router.push(role === 'student' ? '/student' : '/merchant');
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 anim-fade-up">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 anim-pulse-glow"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
              <Zap size={28} fill="white" color="white" />
            </div>
            <h1 className="font-heading font-bold text-3xl mb-2">Bienvenido a <span className="gradient-text">OptusCocha</span></h1>
            <p className="text-[var(--color-text-muted)] text-sm">Plataforma de finanzas embebidas para Bolivia 🇧🇴</p>
          </div>

          {/* Demo Shortcuts */}
          <div className="grid grid-cols-2 gap-3 mb-6 anim-fade-up anim-fade-up-d1">
            {DEMOS.map(({ role, email: dEmail, icon: Icon, color }) => (
              <button key={role} onClick={() => { setEmail(dEmail); setPassword('demo123'); setError(''); }}
                className="glass p-3 rounded-xl flex flex-col items-center gap-2 card-hover text-center">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}22` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{role}</p>
                  <p className="text-[10px] text-[var(--color-text-dim)]">Demo rápido</p>
                </div>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="glass-strong p-7 rounded-2xl anim-fade-up anim-fade-up-d2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10" placeholder="tu@correo.bo" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-2 uppercase tracking-wider">Contraseña</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="input-field pl-10 pr-12" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)] hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm anim-scale-in">
                  <AlertCircle size={15} />{error}
                </div>
              )}
              <p className="text-xs text-[var(--color-text-dim)] text-center">
                Contraseña demo: <span className="text-[var(--color-primary-l)] font-mono">demo123</span>
              </p>
              <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center text-base py-3.5">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Autenticando...
                  </span>
                ) : <span className="flex items-center gap-2">Ingresar a la Plataforma <ArrowRight size={16} /></span>}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-[var(--color-text-dim)] mt-4 anim-fade-up anim-fade-up-d3">
            Sistema protegido · OptusCocha v1.0 · Bolivia 🔐
          </p>
        </div>
      </div>
    </div>
  );
}
