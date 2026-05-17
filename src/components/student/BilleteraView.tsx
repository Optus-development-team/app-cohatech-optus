"use client";

import { useState, useEffect } from "react";
import { Wallet, Coins, DollarSign, QrCode, AlertCircle, CheckCircle } from "lucide-react";
import styles from "./Student.module.css";
import { SaldosWallet, getSaldos } from "@/services/api";

export default function BilleteraView() {
  const [saldos, setSaldos] = useState<SaldosWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarSaldos();
  }, []);

  const cargarSaldos = async () => {
    try {
      const data = await getSaldos();
      setSaldos(data);
    } catch (err) {
      console.error("Error cargando saldos:", err);
      setError("Error al cargar saldos");
    } finally {
      setLoading(false);
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
          <h2 className={styles.panelTitle}>Mi Billetera</h2>
          <p className={styles.panelSubtitle}>
            Consulta tus saldos y gestiona tus activos
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.statusAlert + " " + styles.statusError}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-3">
            <div className={styles.metricIconPrimary + " w-10 h-10 rounded-lg flex items-center justify-center"}>
              <DollarSign className="text-white" size={20} />
            </div>
            <span className="text-gray-400 text-sm">Efectivo (Bs)</span>
          </div>
          <p className={styles.valueLarge}>
            {saldos?.fiat_bs !== undefined && saldos?.fiat_bs !== null
              ? `Bs ${saldos.fiat_bs.toFixed(2)}`
              : "Bs 0.00"}
          </p>
        </div>

        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/20">
              <Coins className="text-yellow-400" size={20} />
            </div>
            <span className="text-gray-400 text-sm">AyniCoins</span>
          </div>
          <p className={styles.valueLarge}>
            {saldos?.puntos_ayni !== undefined && saldos?.puntos_ayni !== null
              ? saldos.puntos_ayni
              : 0}
          </p>
        </div>

        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20">
              <span className="text-blue-400 font-bold text-sm">USDC</span>
            </div>
            <span className="text-gray-400 text-sm">Crédito USDC</span>
          </div>
          <p className={styles.valueLarge}>
            {saldos?.credito_usdc !== undefined && saldos?.credito_usdc !== null
              ? `$${saldos.credito_usdc.toFixed(2)}`
              : "$0.00"}
          </p>
        </div>

        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-500/20">
              <span className="text-purple-400 font-bold text-sm">EURC</span>
            </div>
            <span className="text-gray-400 text-sm">Crédito EURC</span>
          </div>
          <p className={styles.valueLarge}>
            {saldos?.credito_eurc !== undefined && saldos?.credito_eurc !== null
              ? `€${saldos.credito_eurc.toFixed(2)}`
              : "€0.00"}
          </p>
        </div>
      </div>

      {saldos?.wallet_address && (
        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="text-[#a78bfa]" size={20} />
            <span className="text-[#a78bfa] font-medium">Wallet Conectada</span>
          </div>
          <p className="text-gray-400 text-sm font-mono break-all">
            {saldos.wallet_address}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-4">
            <div className={styles.metricIconPrimary + " w-10 h-10 rounded-lg flex items-center justify-center"}>
              <QrCode className="text-white" size={20} />
            </div>
            <h3 className="text-white font-semibold">Pagar con QR</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Escanea el código QR del comercio para realizar un pago instantánea.
          </p>
          <button className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3 px-4 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
            Escanear QR
          </button>
        </div>

        <div className={styles.panelCard}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/20">
              <Coins className="text-yellow-400" size={20} />
            </div>
            <h3 className="text-white font-semibold">Canjear Puntos</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Canjea tus AyniCoins por beneficios y descuentos en comercios aliados.
          </p>
          <button className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3 px-4 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
            Ver Beneficios
          </button>
        </div>
      </div>
    </div>
  );
}