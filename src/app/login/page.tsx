"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { login, saveAuth } from "@/services/api";
import styles from "../auth/AuthFormLayout.module.css";

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
    <div className={styles.authPage}>
      <div className={styles.authBackdrop} />
      <div className={styles.authShell}>
        <div className={styles.authCardWrap}>
          <div className={styles.authCardGlow} />

          <div className={styles.authCard}>
            <div className={styles.authSection}>
              <div className={styles.authHeader}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}>
                  <Zap size={28} fill="white" color="white" />
                </div>
                <h1 className={styles.authTitle}>
                  Iniciar Sesión
                </h1>
                <p className={styles.authSubtitle}>Bienvenido de vuelta</p>
              </div>

              <form onSubmit={handleSubmit} className={styles.authForm}>
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
                  {loading ? "Iniciando..." : "Iniciar Sesión"}
                </button>
              </form>

              <p className={styles.authFooter}>
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-[#a78bfa] hover:text-[#c4b5fd] transition-colors">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}