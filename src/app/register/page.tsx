"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Store, GraduationCap } from "lucide-react";
import { register } from "@/services/api";
import PhoneInput from "@/components/PhoneInput";

type TipoUsuario = "estudiante" | "comercio";

export default function RegisterPage() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("estudiante");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register({
        nombre,
        correo,
        password,
        telefono: telefono || undefined,
        tipo_usuario: tipoUsuario,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.15),_transparent_50%)]" />
      
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#a78bfa] via-[#7c3aed] to-[#6d28d9] rounded-2xl blur-2xl opacity-50" />
        
        <div className="relative bg-[#1a1625]/90 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/30">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">
              Crear Cuenta
            </h1>
            <p className="text-gray-400 mt-2">Únete a Cohatech</p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-green-400 text-lg">¡Registro exitoso!</p>
              <p className="text-gray-400 text-sm mt-2">Redirigiendo al login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#a78bfa] mb-3">
                  Tipo de cuenta
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("estudiante")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      tipoUsuario === "estudiante"
                        ? "border-[#7c3aed] bg-[#7c3aed]/20 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                        : "border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60"
                    }`}
                  >
                    <GraduationCap
                      className={`mx-auto mb-2 ${tipoUsuario === "estudiante" ? "text-[#a78bfa]" : "text-gray-400"}`}
                      size={24}
                    />
                    <span className={`text-sm font-medium ${tipoUsuario === "estudiante" ? "text-[#a78bfa]" : "text-gray-400"}`}>
                      Estudiante
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("comercio")}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      tipoUsuario === "comercio"
                        ? "border-[#7c3aed] bg-[#7c3aed]/20 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                        : "border-[#8B5CF6]/30 hover:border-[#8B5CF6]/60"
                    }`}
                  >
                    <Store
                      className={`mx-auto mb-2 ${tipoUsuario === "comercio" ? "text-[#a78bfa]" : "text-gray-400"}`}
                      size={24}
                    />
                    <span className={`text-sm font-medium ${tipoUsuario === "comercio" ? "text-[#a78bfa]" : "text-gray-400"}`}>
                      Comercio
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#a78bfa] mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]" size={18} />
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0f0a1a]/80 border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
                    placeholder={ "Nombre "}
                    required
                  />
                </div>
              </div>

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

<PhoneInput value={telefono} onChange={setTelefono} />

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
                    minLength={6}
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
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </form>
          )}

          <p className="text-center text-gray-400 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}