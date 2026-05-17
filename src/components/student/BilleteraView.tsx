"use client";

import { useState, useEffect, useRef } from "react";
import jsQR from "jsqr";
import {
  Wallet,
  Coins,
  DollarSign,
  QrCode,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Camera,
  Upload,
  ScanLine,
} from "lucide-react";
import styles from "./Student.module.css";
import { SaldosWallet, getSaldos } from "@/services/api";

export default function BilleteraView() {
  const [saldos, setSaldos] = useState<SaldosWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [scanStatus, setScanStatus] = useState<"idle" | "success" | "error">("idle");
  const [scanResult, setScanResult] = useState<unknown>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

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

  const resetScanState = () => {
    setScanMessage("");
    setScanStatus("idle");
    setScanResult(null);
  };

  const loadImageElement = (file: File) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file);
      const image = new Image();

      image.onload = () => {
        URL.revokeObjectURL(imageUrl);
        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("No se pudo abrir la imagen seleccionada."));
      };

      image.src = imageUrl;
    });

  const scanQrFile = async (file: File) => {
    setIsScanning(true);
    resetScanState();

    try {
      const image = await loadImageElement(file);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });

      if (!context) {
        throw new Error("No se pudo preparar el lienzo para el escaneo.");
      }

      canvas.width = image.naturalWidth || image.width;
      canvas.height = image.naturalHeight || image.height;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (!qrCode) {
        setScanStatus("error");
        setScanMessage("No se detectó ningún código QR en la imagen.");
        return;
      }

      const rawValue = qrCode.data.trim();

      try {
        const parsedJson = JSON.parse(rawValue);
        setScanResult(parsedJson);
        setScanStatus("success");
        setScanMessage("QR leído correctamente y convertido a JSON.");
      } catch {
        setScanResult(rawValue);
        setScanStatus("error");
        setScanMessage("Se leyó el QR, pero el contenido no es JSON válido.");
      }
    } catch (scanError) {
      const message = scanError instanceof Error ? scanError.message : "No se pudo leer el QR.";
      setScanStatus("error");
      setScanMessage(message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = "";

    if (!selectedFile) {
      return;
    }

    await scanQrFile(selectedFile);
  };

  const openCamera = () => cameraInputRef.current?.click();

  const openFilePicker = () => fileInputRef.current?.click();

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
          <button
            type="button"
            onClick={() => {
              setIsScannerOpen((value) => !value);
              resetScanState();
            }}
            className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3 px-4 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2"
            aria-expanded={isScannerOpen}
            aria-controls="qr-scanner-panel"
          >
            {isScannerOpen ? <EyeOff size={18} /> : <Eye size={18} />}
            {isScannerOpen ? "Ocultar lector QR" : "Escanear QR"}
          </button>

          {isScannerOpen && (
            <div id="qr-scanner-panel" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={openCamera}
                  className="min-h-[48px] flex items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-white/5 px-4 py-3 text-white font-medium transition-all hover:border-violet-300 hover:bg-white/10"
                >
                  <Camera size={18} />
                  Abrir cámara
                </button>

                <button
                  type="button"
                  onClick={openFilePicker}
                  className="min-h-[48px] flex items-center justify-center gap-2 rounded-lg border border-violet-400/30 bg-white/5 px-4 py-3 text-white font-medium transition-all hover:border-violet-300 hover:bg-white/10"
                >
                  <Upload size={18} />
                  Subir PNG/JPG
                </button>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                El QR debe contener un JSON válido. En móvil, la opción de cámara abrirá el selector nativo para tomar la foto del código.
              </p>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handleFileChange}
              />

              {isScanning && (
                <div className={styles.statusAlert + " " + styles.statusSuccess}>
                  <ScanLine size={18} />
                  Analizando la imagen del QR...
                </div>
              )}

              {!!scanMessage && (
                <div
                  className={
                    styles.statusAlert +
                    " " +
                    (scanStatus === "success" ? styles.statusSuccess : styles.statusError)
                  }
                >
                  {scanStatus === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {scanMessage}
                </div>
              )}

              {scanResult !== null && (
                <div className={styles.panelCard + " border border-violet-400/20"}>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-white font-semibold">Resultado leído</h4>
                      <p className="text-gray-400 text-xs">
                        Este contenido es el que puedes enviar a la base de datos.
                      </p>
                    </div>
                  </div>
                  <pre className="max-h-64 overflow-auto rounded-lg bg-black/30 p-3 text-xs text-violet-100 whitespace-pre-wrap break-words">
                    {typeof scanResult === "string"
                      ? scanResult
                      : JSON.stringify(scanResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
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