"use client";

import { useState, useEffect } from "react";
import styles from "./Merchant.module.css";
import { Store, MapPin, Clock, AlertCircle } from "lucide-react";
import { Comercio, getComercio, createComercio, updateComercio } from "@/services/api";

interface MerchantProfileViewProps {
  onUpdate?: () => void;
}

const rubros = [
  { value: "comida", label: "Comida" },
  { value: "fotocopias", label: "Fotocopias" },
  { value: "transporte", label: "Transporte" },
  { value: "snacks", label: "Snacks" },
  { value: "librería", label: "Librería" },
  { value: "otro", label: "Otro" },
];

const zonas = [
  { value: "Central", label: "Central" },
  { value: "Norte", label: "Norte" },
  { value: "Sur", label: "Sur" },
  { value: "Este", label: "Este" },
  { value: "Oeste", label: "Oeste" },
  { value: "Otro", label: "Otro" },
];

const universidades = ["UMSS", "UPSA", "Unicen", "UAB", "UCB", "UAGRM", "EMI", "Otro"];
const tiposComercio = [
  { value: "informal", label: "Informal" },
  { value: "microempresa", label: "Microempresa" },
];

export default function MerchantProfileView({ onUpdate }: MerchantProfileViewProps) {
  const [comercio, setComercio] = useState<Comercio | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nombre_comercio: "",
    rubro: "",
    ubicacion: "",
    zona: "",
    universidad_cercana: "",
    tipo_comercio: "",
    horario_apertura: "08:00",
    horario_cierre: "22:00",
  });

  useEffect(() => {
    cargarComercio();
  }, []);

  const cargarComercio = async () => {
    try {
      const data = await getComercio();
      setComercio(data);
      if (data) {
        setFormData({
          nombre_comercio: data.nombre_comercio,
          rubro: data.rubro,
          ubicacion: data.ubicacion,
          zona: data.zona,
          universidad_cercana: data.universidad_cercana,
          tipo_comercio: data.tipo_comercio,
          horario_apertura: data.horario_apertura,
          horario_cierre: data.horario_cierre,
        });
      }
    } catch (err) {
      console.error("Error cargando comercio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    setSuccess("");

    try {
      if (comercio) {
        await updateComercio(formData);
        setSuccess("Comercio actualizado correctamente");
      } else {
        await createComercio(formData);
        setSuccess("Comercio creado correctamente");
        await cargarComercio();
      }
      setEditando(false);
      onUpdate?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando comercio");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!comercio && !editando) {
    return <ComercioForm formData={formData} setFormData={setFormData} guardando={guardando} onSubmit={handleSubmit} onEdit={() => setEditando(true)} />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className={styles.statusAlert + " " + styles.statusError}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className={styles.statusAlert + " " + styles.statusSuccess}>
          <AlertCircle size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className={styles.panelCard}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={styles.titleMedium}>Mi Comercio</h2>
            <button
              onClick={() => setEditando(!editando)}
              className={styles.buttonSecondary + " flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all"}
            >
              {editando ? "Cancelar" : "Editar"}
            </button>
          </div>

          {editando ? (
            <form onSubmit={handleSubmit} className="ui-form-stack">
              <div className="ui-grid-2">
                <div className="ui-field">
                  <label className="ui-label">Nombre del Comercio</label>
                  <input
                    type="text"
                    value={formData.nombre_comercio}
                    onChange={(e) => setFormData({ ...formData, nombre_comercio: e.target.value })}
                    className="ui-input"
                    required
                  />
                </div>
                <div className="ui-field">
                  <label className="ui-label">Rubro</label>
                  <select
                    value={formData.rubro}
                    onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                    className="ui-select"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {rubros.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ui-field">
                <label className="ui-label">Dirección / Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  className="ui-input"
                  placeholder="Av. América entre 6 y 7"
                  required
                />
              </div>

              <div className="ui-grid-2">
                <div className="ui-field">
                  <label className="ui-label">Zona</label>
                  <select
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    className="ui-select"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {zonas.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ui-field">
                  <label className="ui-label">Universidad Cercana</label>
                  <select
                    value={formData.universidad_cercana}
                    onChange={(e) => setFormData({ ...formData, universidad_cercana: e.target.value })}
                    className="ui-select"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {universidades.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ui-grid-3">
                <div className="ui-field">
                  <label className="ui-label">Tipo de Comercio</label>
                  <select
                    value={formData.tipo_comercio}
                    onChange={(e) => setFormData({ ...formData, tipo_comercio: e.target.value })}
                    className="ui-select"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {tiposComercio.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div className="ui-field">
                  <label className="ui-label">Hora Apertura</label>
                  <input
                    type="time"
                    value={formData.horario_apertura}
                    onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
                    className="ui-input"
                    required
                  />
                </div>
                <div className="ui-field">
                  <label className="ui-label">Hora Cierre</label>
                  <input
                    type="time"
                    value={formData.horario_cierre}
                    onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
                    className="ui-input"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={guardando} className={styles.buttonPrimary + " ui-btn-primary"}>
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          ) : (
            <ComercioDisplay comercio={comercio!} />
          )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={styles.panelCard}>
            <div className="text-center">
              <div className={styles.headerAvatar + " mx-auto mb-3"}>
                <Store className="text-white" size={32} />
              </div>
              <h3 className={styles.titleSmall}>{comercio?.nombre_comercio}</h3>
              <p className={styles.mutedText + " text-sm capitalize"}>{comercio?.rubro}</p>
            </div>
          </div>

          {comercio?.score_actual !== null && (
            <div className="panel-card">
              <h4 className={styles.titleSmall + " mb-3"}>Score</h4>
              <div className="flex items-center justify-center">
                <span className={styles.valueXL + " " + styles.accentText}>{comercio?.score_actual}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComercioForm({
  formData,
  setFormData,
  guardando,
  onSubmit,
  onEdit,
}: {
  formData: {
    nombre_comercio: string;
    rubro: string;
    ubicacion: string;
    zona: string;
    universidad_cercana: string;
    tipo_comercio: string;
    horario_apertura: string;
    horario_cierre: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onEdit?: () => void;
}) {
  return (
    <div className={styles.panelCard}>
      <div className="text-center mb-8">
        <div className={styles.headerAvatar + " mx-auto mb-4"}>
          <Store className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className={styles.titleLarge + " mb-2"}>Completa los datos de tu Comercio</h2>
        <p className={styles.mutedText}>Registra la información de tu negocio para comenzar</p>
      </div>

        <form onSubmit={onSubmit} className={styles.authForm}>
        <div className={styles.grid2}>
          <div className="ui-field">
            <label className="ui-label">Nombre del Comercio</label>
            <input
              type="text"
              value={formData.nombre_comercio}
              onChange={(e) => setFormData({ ...formData, nombre_comercio: e.target.value })}
              className="ui-input"
              placeholder="Ej: Tacos El Güero"
              required
            />
          </div>
          <div className="ui-field">
            <label className="ui-label">Rubro</label>
            <select
              value={formData.rubro}
              onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {rubros.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="ui-field">
          <label className="ui-label">Dirección / Ubicación</label>
          <div className="ui-input-wrap">
            <MapPin className="ui-icon-left" size={18} />
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className="ui-input ui-input-icon-pad"
              placeholder="Av. América entre 6 y 7"
              required
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className="ui-field">
            <label className="ui-label">Zona</label>
            <select
              value={formData.zona}
              onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {zonas.map((z) => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
          </div>
          <div className="ui-field">
            <label className="ui-label">Universidad Cercana</label>
            <select
              value={formData.universidad_cercana}
              onChange={(e) => setFormData({ ...formData, universidad_cercana: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {universidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.grid3}>
          <div className="ui-field">
            <label className="ui-label">Tipo de Comercio</label>
            <select
              value={formData.tipo_comercio}
              onChange={(e) => setFormData({ ...formData, tipo_comercio: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {tiposComercio.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="ui-field">
            <label className="ui-label">Hora Apertura</label>
            <input
              type="time"
              value={formData.horario_apertura}
              onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
              className="ui-input"
              required
            />
          </div>
          <div className="ui-field">
            <label className="ui-label">Hora Cierre</label>
            <input
              type="time"
              value={formData.horario_cierre}
              onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
              className="ui-input"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={guardando} className={styles.buttonPrimary + " ui-btn-primary"}>
          {guardando ? "Guardando..." : "Crear Comercio"}
        </button>
        </form>
    </div>
  );
}

function ComercioDisplay({ comercio }: { comercio: Comercio }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="panel-card panel-card-compact">
        <p className={styles.mutedText + " text-sm mb-1"}>Rubro</p>
        <p className="text-white font-medium capitalize">{comercio.rubro}</p>
      </div>
      <div className="panel-card panel-card-compact">
        <p className={styles.mutedText + " text-sm mb-1"}>Tipo</p>
        <p className="text-white font-medium capitalize">{comercio.tipo_comercio}</p>
      </div>
      <div className="panel-card panel-card-compact col-span-2">
        <p className={styles.mutedText + " text-sm mb-1"}>Ubicación</p>
        <p className="text-white font-medium">{comercio.ubicacion}, {comercio.zona}</p>
      </div>
      <div className="panel-card panel-card-compact">
        <p className={styles.mutedText + " text-sm mb-1"}>Universidad Cercana</p>
        <p className="text-white font-medium">{comercio.universidad_cercana}</p>
      </div>
      <div className="panel-card panel-card-compact">
        <p className={styles.mutedText + " text-sm mb-1"}>Horario</p>
        <p className="text-white font-medium flex items-center gap-2">
          <Clock size={16} />
          {comercio.horario_apertura} - {comercio.horario_cierre}
        </p>
      </div>
    </div>
  );
}