"use client";

import { useState, useEffect } from "react";
import { Gift, CheckCircle, AlertCircle, Loader2, Tag, Store, Percent } from "lucide-react";
import styles from "./Student.module.css";
import { Beneficio, BeneficioCanjeado, getBeneficios, getMisBeneficiosCanjeados, canjearBeneficio, getSaldos, SaldosWallet } from "@/services/api";

export default function BeneficiosView() {
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [misCanjes, setMisCanjes] = useState<BeneficioCanjeado[]>([]);
  const [saldos, setSaldos] = useState<SaldosWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [canjeando, setCanjeando] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [beneficiosData, canjesData, saldosData] = await Promise.all([
        getBeneficios(),
        getMisBeneficiosCanjeados(),
        getSaldos()
      ]);
      setBeneficios(beneficiosData);
      setMisCanjes(canjesData);
      setSaldos(saldosData);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCanjear = async (beneficioId: number, puntosNecesarios: number) => {
    if (!saldos || saldos.puntos_ayni < puntosNecesarios) {
      setError("No tienes suficientes AyniCoins para canjear este beneficio");
      return;
    }

    if (!confirm(`¿Canjear este beneficio por ${puntosNecesarios} AyniCoins?`)) return;

    setCanjeando(beneficioId);
    setError("");
    setSuccess("");

    try {
      await canjearBeneficio(beneficioId);
      setSuccess("¡Beneficio canjeado exitosamente!");
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al canjear beneficio");
    } finally {
      setCanjeando(null);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "DESCUENTO":
        return <Percent size={20} />;
      case "CASHBACK":
        return <Tag size={20} />;
      case "PRODUCTO_GRATIS":
        return <Gift size={20} />;
      case "SERVICIO":
        return <Store size={20} />;
      default:
        return <Gift size={20} />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "DESCUENTO":
        return "Descuento";
      case "CASHBACK":
        return "Cashback";
      case "PRODUCTO_GRATIS":
        return "Producto Gratis";
      case "SERVICIO":
        return "Servicio";
      default:
        return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "DESCUENTO":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "CASHBACK":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "PRODUCTO_GRATIS":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "SERVICIO":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>Canje de Beneficios</h2>
          <p className={styles.panelSubtitle}>
            Canjea tus AyniCoins por descuentos y beneficios
          </p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-500/20 px-4 py-2 rounded-lg border border-yellow-500/30">
          <Gift className="text-yellow-400" size={20} />
          <span className="text-yellow-400 font-semibold">
            {saldos?.puntos_ayni || 0} AyniCoins
          </span>
        </div>
      </div>

      {error && (
        <div className={styles.statusAlert + " " + styles.statusError}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className={styles.statusAlert + " " + styles.statusSuccess}>
          <CheckCircle size={18} />
          {success}
        </div>
      )}

      {beneficios.length === 0 ? (
        <div className={styles.panelCard + " text-center py-12"}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
            <Gift className="text-[#a78bfa]" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Sin beneficios disponibles
          </h3>
          <p className="text-gray-400">
            Próximamente habrá beneficios para canjear
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficios.map((beneficio) => (
            <div
              key={beneficio.id}
              className={styles.panelCard + " hover:border-[#8B5CF6]/40 transition-all flex flex-col"}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#8B5CF6]/20">
                  {getTipoIcon(beneficio.tipo)}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(beneficio.tipo)}`}>
                  {getTipoLabel(beneficio.tipo)}
                </span>
              </div>

              <h4 className="text-white font-semibold mb-1">
                {beneficio.nombre}
              </h4>
              <p className="text-gray-400 text-sm mb-3 flex-1">
                {beneficio.descripcion}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#8B5CF6]/20">
                <div className="flex items-center gap-1">
                  <Gift className="text-yellow-400" size={16} />
                  <span className="text-yellow-400 font-semibold text-sm">
                    {beneficio.valor} AyniCoins
                  </span>
                </div>
                <button
                  onClick={() => handleCanjear(beneficio.id, beneficio.valor)}
                  disabled={canjeando === beneficio.id || (saldos !== null && (saldos.puntos_ayni ?? 0) < beneficio.valor)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white text-sm rounded-lg font-medium hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {canjeando === beneficio.id ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Canjear"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {misCanjes.length > 0 && (
        <div className="mt-8">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-400" size={20} />
            Mis Beneficios Canjeados
          </h3>
          <div className="space-y-3">
            {misCanjes.map((canje) => (
              <div
                key={canje.id}
                className={styles.panelCard + " flex items-center justify-between"}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20">
                    <CheckCircle className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">
                      {canje.beneficio?.nombre || `Beneficio #${canje.beneficioId}`}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Canjeado el {new Date(canje.fecha_canje).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                  Canjeado
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}