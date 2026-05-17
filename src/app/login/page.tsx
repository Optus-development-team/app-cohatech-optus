"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login, saveAuth } from "@/services/api";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({ correo, password });
      saveAuth(response.access_token, response.usuario);
      
      if (response.usuario.tipo_usuario === "estudiante") {
        window.location.href = "/student";
      } else if (response.usuario.tipo_usuario === "comercio") {
        window.location.href = "/merchant";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-20" style={{ paddingTop: 'calc(70px + 5rem)' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 anim-fade-up">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 anim-pulse-glow"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
              <Zap size={28} fill="white" color="white" />
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15),_transparent_50%)]" />
      
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#6d28d9] rounded-2xl blur-2xl opacity-50" />
        
        <div className="relative bg-[#1a1625]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">
              Iniciar Sesión
            </h1>
            <p className="text-gray-400 mt-2">Bienvenido de vuelta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#a78bfa] mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]" size={18} />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0f0a1a]/80 border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a78bfa] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-[#0f0a1a]/80 border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B5CF6] hover:text-[#a78bfa] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}