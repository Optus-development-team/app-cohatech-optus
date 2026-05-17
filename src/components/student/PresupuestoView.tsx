"use client";

import { useState } from "react";
import styles from "./Student.module.css";
import { 
  Calendar, 
  DollarSign, 
  Edit3, 
  Save, 
  CheckCircle, 
  Wallet 
} from "lucide-react";
import { Presupuesto } from "@/services/api";

interface PresupuestoViewProps {
  presupuesto: Presupuesto | null;
  onSave: (data: { presupuesto_semanal: number; presupuesto_mensual: number }) => Promise<void>;
  onCreate: (data: { universidad: string; carrera: string; presupuesto_semanal: number; presupuesto_mensual: number }) => Promise<void>;
}

const universidades = ["UMSS", "UPSA", "Unicen", "UAB", "UCB", "UAGRM", "EMI"];

export default function PresupuestoView({ presupuesto, onSave, onCreate }: PresupuestoViewProps) {
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({
    universidad: presupuesto?.universidad || "",
    carrera: presupuesto?.carrera || "",
    presupuesto_semanal: presupuesto?.presupuesto_semanal || "",
    presupuesto_mensual: presupuesto?.presupuesto_mensual || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    const semanal = formData.presupuesto_semanal === "" ? 0 : Number(formData.presupuesto_semanal);
    const mensual = formData.presupuesto_mensual === "" ? 0 : Number(formData.presupuesto_mensual);

    try {
      if (presupuesto) {
        await onSave({
          presupuesto_semanal: semanal,
          presupuesto_mensual: mensual,
        });
      } else {
        await onCreate({
          ...formData,
          presupuesto_semanal: semanal,
          presupuesto_mensual: mensual,
        });
      }
      setEditando(false);
    } catch (error) {
      console.error("Error guardando:", error);
    } finally {
      setGuardando(false);
    }
  };

  if (!presupuesto) {
    return <PresupuestoForm formData={formData} setFormData={setFormData} guardando={guardando} onSubmit={handleSubmit} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className={styles.panelCard}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={styles.titleMedium}>Mi Presupuesto</h2>
          <button
            onClick={() => setEditando(!editando)}
            className={styles.buttonSecondary + " flex items-center gap-2 px-4 py-2 rounded-lg transition-all"}
          >
            <Edit3 size={16} />
            Editar
          </button>
        </div>

        {editando ? (
          <form onSubmit={handleSubmit} className="ui-form-stack">
            <div className="ui-grid-2">
              <div className="ui-field">
                <label className="ui-label">Universidad</label>
                <input
                  type="text"
                  value={formData.universidad}
                  onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
                  className="ui-input"
                  disabled
                />
              </div>
              <div className="ui-field">
                <label className="ui-label">Carrera</label>
                <input
                  type="text"
                  value={formData.carrera}
                  onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  className="ui-input"
                  disabled
                />
              </div>
            </div>
            <div className="ui-grid-2">
              <div className="ui-field">
                <label className="ui-label">Presupuesto Semanal (Bs)</label>
                <input
                  type="number"
                  value={formData.presupuesto_semanal}
                  onChange={(e) => setFormData({ ...formData, presupuesto_semanal: e.target.value })}
                  className="ui-input"
                  min={0}
                  max={10000}
                />
              </div>
              <div className="ui-field">
                <label className="ui-label">Presupuesto Mensual (Bs)</label>
                <input
                  type="number"
                  value={formData.presupuesto_mensual}
                  onChange={(e) => setFormData({ ...formData, presupuesto_mensual: e.target.value })}
                  className="ui-input"
                  min={0}
                  max={50000}
                />
              </div>
            </div>
            <button type="submit" disabled={guardando} className={styles.buttonPrimary + " ui-btn-primary flex items-center justify-center gap-2"}>
              {guardando ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
            </button>
          </form>
        ) : (
          <PresupuestoDisplay presupuesto={presupuesto} />
        )}
        </div>
      </div>

      <div className="space-y-6">
        <div className={styles.panelCard}>
          <h3 className={styles.titleSmall + " mb-4"}>Nivel Estudiantil</h3>
          <div className="text-center">
            <div className={styles.iconCircleLarge + " " + styles.iconCirclePrimary}>
              🎓
            </div>
            <p className={styles.valueLarge + " text-amber-400"}>{presupuesto.nivel_actual}</p>
            <p className={styles.mutedText + " text-sm"}>{presupuesto.puntos_actuales} puntos</p>
          </div>
        </div>
        <div className={styles.panelCard}>
          <h3 className={styles.titleSmall + " mb-3"}>Ahorro Total</h3>
          <p className={styles.valueXL + " text-green-400"}>{presupuesto.ahorro_total} <span className="text-lg">Bs</span></p>
        </div>
      </div>
    </div>
  );
}

function PresupuestoDisplay({ presupuesto }: { presupuesto: Presupuesto }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className={styles.budgetCardPrimary}>
        <div className={styles.metricRow}>
          <div className={styles.metricIconPrimary}>
            <Calendar className="text-white" size={20} />
          </div>
          <span className={styles.metricLabel}>Semanal</span>
        </div>
        <p className={styles.metricValue}>
          {presupuesto.presupuesto_semanal} <span className="text-lg text-gray-400">Bs</span>
        </p>
      </div>
      <div className={styles.budgetCardCyan}>
        <div className={styles.metricRow}>
          <div className={styles.metricIconCyan}>
            <DollarSign className="text-white" size={20} />
          </div>
          <span className={styles.metricLabel}>Mensual</span>
        </div>
        <p className={styles.metricValue}>
          {presupuesto.presupuesto_mensual} <span className="text-lg text-gray-400">Bs</span>
        </p>
      </div>
    </div>
  );
}

function PresupuestoForm({ 
  formData, 
  setFormData, 
  guardando, 
  onSubmit 
}: { 
  formData: { universidad: string; carrera: string; presupuesto_semanal: number | string; presupuesto_mensual: number | string };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className={styles.panelCard}>
      <div className={styles.authSection}>
        <div className={styles.authHeader}>
          <div className={styles.iconCircleLarge + " " + styles.iconCirclePrimary}>
            <Wallet className="text-[#a78bfa]" size={40} />
          </div>
          <h2 className={styles.panelTitle}>Configura tu Presupuesto</h2>
          <p className={styles.panelSubtitle}>Define tu presupuesto estudiantil para comenzar a gestionar tus finanzas</p>
        </div>

        <form onSubmit={onSubmit} className={`${styles.authForm} max-w-xl mx-auto`}>
        <div className="ui-grid-2">
          <div className="ui-field">
            <label className="ui-label">Universidad</label>
            <select
              value={formData.universidad}
              onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
              className="ui-select"
              required
            >
              <option value="">Seleccionar...</option>
              {universidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="ui-field">
            <label className="ui-label">Carrera</label>
            <input
              type="text"
              value={formData.carrera}
              onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
              className="ui-input"
              placeholder="Ej: Ing. Sistemas"
              required
            />
          </div>
        </div>
        <div className="ui-grid-2">
          <div className="ui-field">
            <label className="ui-label">Presupuesto Semanal (Bs)</label>
            <input
              type="number"
              value={formData.presupuesto_semanal}
              onChange={(e) => setFormData({ ...formData, presupuesto_semanal: e.target.value })}
              className="ui-input"
              placeholder="Ej: 150"
              min={0}
              max={10000}
              required
            />
          </div>
          <div className="ui-field">
            <label className="ui-label">Presupuesto Mensual (Bs)</label>
            <input
              type="number"
              value={formData.presupuesto_mensual}
              onChange={(e) => setFormData({ ...formData, presupuesto_mensual: e.target.value })}
              className="ui-input"
              placeholder="Ej: 600"
              min={0}
              max={50000}
              required
            />
          </div>
        </div>
        <button type="submit" disabled={guardando} className={styles.buttonPrimary + " ui-btn-primary flex items-center justify-center gap-2"}>
          {guardando ? "Creando..." : <><CheckCircle size={20} /> Crear Presupuesto</>}
        </button>
      </form>
      </div>
    </div>
  );
}