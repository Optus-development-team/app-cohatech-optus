"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff, Store, GraduationCap } from "lucide-react";
import { register } from "@/services/api";
import PhoneInput from "@/components/PhoneInput";
import styles from "../auth/AuthFormLayout.module.css";

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
    <div className={styles.authPage}>
      <div className={styles.authBackdrop} />
      <div className={styles.authShell}>
        <div className={styles.authCardWrap}>
          <div className={styles.authCardGlow} />
          
          <div className={styles.authCard}>
            <div className={styles.authSection}>
              <div className={styles.authHeader}>
                <h1 className={styles.authTitle}>
                  Crear Cuenta
                </h1>
                <p className={styles.authSubtitle}>Únete a Cohatech</p>
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
                <form onSubmit={handleSubmit} className={styles.authForm}>
                  <div className={styles.authField}>
                    <label className="block text-sm font-medium text-[#a78bfa]">
                      Tipo de cuenta
                    </label>
                    <div className={styles.authSegment}>
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

                  <div className={styles.authField}>
                    <label className="block text-sm font-medium text-[#a78bfa]">
                      Nombre
                    </label>
                    <div className={styles.authInputWrap}>
                      <User className={styles.authIcon} size={18} />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="ui-input ui-input-icon-pad"
                        placeholder="Nombre"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.authField}>
                    <label className="block text-sm font-medium text-[#a78bfa]">
                      Correo electrónico
                    </label>
                    <div className={styles.authInputWrap}>
                      <Mail className={styles.authIcon} size={18} />
                      <input
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="ui-input ui-input-icon-pad"
                        placeholder="correo@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <PhoneInput value={telefono} onChange={setTelefono} />

                  <div className={styles.authField}>
                    <label className="block text-sm font-medium text-[#a78bfa]">
                      Contraseña
                    </label>
                    <div className={styles.authInputWrap}>
                      <Lock className={styles.authIcon} size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="ui-input ui-input-icon-pad"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`${styles.authIconButton} hover:text-[#a78bfa] transition-colors`}
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
                    className="ui-btn-primary"
                  >
                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                  </button>
                </form>
              )}

              <p className={styles.authFooter}>
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                  Inicia Sesión
                </Link>
              </p>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}