"use client";

import { useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import styles from "./Student.module.css";

interface MetaAhorroFormProps {
  formData: {
    nombre_meta: string;
    monto_objetivo: string;
    duracion: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    nombre_meta: string;
    monto_objetivo: string;
    duracion: string;
  }>>;
  editandoId: string | null;
  guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const tiposMeta = [
  "Pasajes",
  "Comida",
  "Emergency",
  "Fotocopias",
  "Libros",
  "Salida",
  "Otro",
];

const duraciones = [
  { value: "7", label: "1 Semana", dias: 7 },
  { value: "14", label: "2 Semanas", dias: 14 },
  { value: "30", label: "1 Mes", dias: 30 },
  { value: "60", label: "2 Meses", dias: 60 },
  { value: "90", label: "3 Meses", dias: 90 },
];

export default function MetaAhorroForm({
  formData,
  setFormData,
  editandoId,
  guardando,
  onSubmit,
  onCancel,
}: MetaAhorroFormProps) {
  const fechaCalculada = useMemo(() => {
    if (!formData.duracion) return "";
    const dias = parseInt(formData.duracion);
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toLocaleDateString("es-BO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [formData.duracion]);

  return (
    <div className={styles.panelCard}>
      <h3 className={styles.titleMedium + " mb-4"}>
        {editandoId ? "Editar Meta" : "Nueva Meta de Ahorro"}
      </h3>
      <form onSubmit={onSubmit} className={styles.authForm}>
        <div className={styles.grid2}>
          <div className="ui-field">
            <label className="ui-label">Nombre de la Meta</label>
            <select
              value={formData.nombre_meta}
              onChange={(e) => setFormData({ ...formData, nombre_meta: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {tiposMeta.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="ui-field">
            <label className="ui-label">Monto Objetivo (Bs)</label>
            <input
              type="number"
              value={formData.monto_objetivo}
              onChange={(e) => setFormData({ ...formData, monto_objetivo: e.target.value })}
              className="ui-input"
              placeholder="Ej: 300"
              min={10}
              max={50000}
              required
            />
          </div>
        </div>

        {!editandoId && (
          <div>
            <label className="ui-label mb-2 block">Duración de la Meta</label>
            <div className={styles.durationGrid}>
              {duraciones.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, duracion: d.value })}
                  className={`${styles.durationOption} ${formData.duracion === d.value ? styles.durationOptionActive : styles.durationOptionInactive}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={18} />
                    <span className="text-xs font-medium">{d.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {fechaCalculada && (
              <div className={styles.durationInfo}>
                <Calendar size={18} className="text-[#a78bfa]" />
                <span className="text-sm text-gray-300">
                  Tu meta vence el: <span className="text-white font-medium">{fechaCalculada}</span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={guardando || (!editandoId && !formData.duracion)}
            className={styles.buttonPrimary + " ui-btn-primary flex items-center justify-center gap-2"}
          >
            {guardando ? "Guardando..." : editandoId ? "Actualizar" : "Crear Meta"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={styles.buttonSecondary + " ui-btn-primary"}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}