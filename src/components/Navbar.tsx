"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f0a1a]/95 backdrop-blur-xl border-b border-[#8B5CF6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent group-hover:drop-shadow-[0_0_10px_rgba(167,139,250,0.5)] transition-all">
              Cohatech
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-sm font-medium text-[#a78bfa] border border-[#8B5CF6]/50 rounded-full hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6] transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-full hover:shadow-[0_0_25px_rgba(124,58,237,0.6)] transition-all duration-300 hover:scale-105"
            >
              Regístrate
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#a78bfa]"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#0f0a1a]/95 border-b border-[#8B5CF6]/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-[#a78bfa] border border-[#8B5CF6]/50 rounded-xl hover:bg-[#8B5CF6]/10 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-center text-white bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all"
            >
              Regístrate
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}