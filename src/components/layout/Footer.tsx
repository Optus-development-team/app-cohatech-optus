import React from 'react';
import Link from 'next/link';
import { Zap, Code2, Send, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--color-primary)]">
                <Zap size={16} color="white" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight">
                Optus<span className="gradient-text">Cocha</span>
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] text-center md:text-left max-w-sm">
              Economía circular universitaria. Construyendo el futuro financiero de Bolivia.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-6 text-sm">
              <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                Inicio
              </Link>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                Términos
              </a>
            </div>
            <span className="text-sm text-[var(--color-text-dim)]">
              © 2026 OptusCocha · Hecho en Bolivia
            </span>
          </div>
          
          <div className="flex gap-3">
            {[Code2, Send, Globe].map((Icon, i) => (
              <a key={i} href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-all">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
