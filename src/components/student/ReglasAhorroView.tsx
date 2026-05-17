"use client";

import { useState, useEffect } from "react";
import { Plus, AlertCircle, Trash2, Edit2, Power, PowerOff } from "lucide-react";
import styles from "./Student.module.css";
import {
  ReglaAhorro,
  getReglasAhorro,
  createReglaAhorro,
  updateReglaAhorro,
  deleteReglaAhorro,
} from "@/services/api";

export default function ReglasAhorroView() {
  const [reglas, setReglas] = useState<ReglaAhorro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    tipo_regla: "redondeo" as "redondeo" | "porcentaje" | "fijo",
    valor_regla: "",
    redondeo_a: "",
  });

  useEffect(() => {
    cargarReglas();
  }, []);

  const cargarReglas = async () => {
    try {
      const data = await getReglasAhorro();
      setReglas(data);
    } catch (err) {
      console.error("Error cargando reglas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      const data = {
        tipo_regla: formData.tipo_regla,
        valor_regla: Number(formData.valor_regla),
        ...(formData.tipo_regla === "redondeo" && formData.redondeo_a
          ? { redondeo_a: Number(formData.redondeo_a) }
          : {}),
      };

      if (editandoId) {
        await updateReglaAhorro(editandoId, data);
      } else {
        await createReglaAhorro(data);
      }
      await cargarReglas();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando regla");
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleActiva = async (id: string, activa: boolean) => {
    try {
      await updateReglaAhorro(id, { activa: !activa });
      await cargarReglas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando regla");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta regla de ahorro?")) return;
    try {
      await deleteReglaAhorro(id);
      await cargarReglas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando regla");
    }
  };

  const resetForm = () => {
    setFormData({ tipo_regla: "redondeo", valor_regla: "", redondeo_a: "" });
    setShowForm(false);
    setEditandoId(null);
  };

  const startEdit = (regla: ReglaAhorro) => {
    setFormData({
      tipo_regla: regla.tipo_regla,
      valor_regla: regla.valor_regla.toString(),
      redondeo_a: regla.redondeo_a?.toString() || "",
    });
    setEditandoId(regla.id_regla);
    setShowForm(true);
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "redondeo":
        return "Redondeo";
      case "porcentaje":
        return "Porcentaje";
      case "fijo":
        return "Monto Fijo";
      default:
        return tipo;
    }
  };

  const getTipoDescription = (regla: ReglaAhorro) => {
    switch (regla.tipo_regla) {
      case "redondeo":
        return `Redondea a múltiplos de ${regla.redondeo_a}`;
      case "porcentaje":
        return `Ahorra ${regla.valor_regla}% de cada gasto`;
      case "fijo":
        return `Ahorra S/ ${regla.valor_regla} por transacción`;
      default:
        return "";
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
          <h2 className={styles.panelTitle}>Reglas de Ahorro</h2>
          <p className={styles.panelSubtitle}>
            Automatiza tu ahorro con reglas personalizadas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className={styles.buttonPrimary + " ui-btn-primary inline-flex items-center justify-center gap-2 px-5 w-auto"}
        >
          <Plus size={18} />
          Nueva Regla
        </button>
      </div>

      {error && (
        <div className={styles.statusAlert + " " + styles.statusError}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {showForm && (
        <div className={styles.panelCard + " max-w-md mx-auto"}>
          <h3 className="text-lg font-semibold text-white mb-4">
            {editandoId ? "Editar Regla" : "Nueva Regla de Ahorro"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#a78bfa] mb-2">Tipo de Regla</label>
              <select
                value={formData.tipo_regla}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo_regla: e.target.value as "redondeo" | "porcentaje" | "fijo",
                  })
                }
                className="w-full bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] focus:outline-none"
              >
                <option value="redondeo">Redondeo</option>
                <option value="porcentaje">Porcentaje</option>
                <option value="fijo">Monto Fijo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-[#a78bfa] mb-2">
                {formData.tipo_regla === "redondeo"
                  ? "Monto mínimo (S/)"
                  : formData.tipo_regla === "porcentaje"
                  ? "Porcentaje (%)"
                  : "Monto fijo (S/)"}
              </label>
              <input
                type="number"
                value={formData.valor_regla}
                onChange={(e) => setFormData({ ...formData, valor_regla: e.target.value })}
                className="w-full bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] focus:outline-none"
                required
                min="0"
                max={formData.tipo_regla === "porcentaje" ? "100" : undefined}
              />
            </div>

            {formData.tipo_regla === "redondeo" && (
              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">
                  Redondear a (múltiplos de)
                </label>
                <input
                  type="number"
                  value={formData.redondeo_a}
                  onChange={(e) => setFormData({ ...formData, redondeo_a: e.target.value })}
                  className="w-full bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-lg px-4 py-3 text-white focus:border-[#8B5CF6] focus:outline-none"
                  required
                  min="1"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={guardando}
                className="flex-1 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white py-3 px-6 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50"
              >
                {guardando ? "Guardando..." : editandoId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-[#8B5CF6]/30 text-[#a78bfa] rounded-lg font-medium hover:bg-[#8B5CF6]/10 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {reglas.length === 0 && !showForm ? (
        <div className={styles.panelCard + " text-center py-12"}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
            <Plus className="text-[#a78bfa]" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Sin reglas de ahorro
          </h3>
          <p className="text-gray-400 mb-6">
            Crea reglas para automatizar tu ahorro
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white px-6 py-3 rounded-lg font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
          >
            <Plus size={18} />
            Crear primera regla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reglas.map((regla) => (
            <div
              key={regla.id_regla}
              className={
                styles.panelCard +
                " hover:border-[#8B5CF6]/40 transition-all flex flex-col"
              }
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={
                    styles.metricIconPrimary +
                    " w-10 h-10 rounded-lg flex items-center justify-center"
                  }
                >
                  <span className="text-white font-bold">
                    {regla.tipo_regla === "redondeo"
                      ? "R"
                      : regla.tipo_regla === "porcentaje"
                      ? "%"
                      : "S/"}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    regla.activa
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}
                >
                  {regla.activa ? "Activa" : "Inactiva"}
                </span>
              </div>

              <h4 className="text-white font-semibold mb-1">
                {getTipoLabel(regla.tipo_regla)}
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                {getTipoDescription(regla)}
              </p>

              <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => handleToggleActiva(regla.id_regla, regla.activa)}
                    className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                      regla.activa
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    }`}
                  >
                    {regla.activa ? "Desactivar" : "Activar"}
                  </button>

                  <button
                    onClick={() => startEdit(regla)}
                    className="p-2 text-[#a78bfa] hover:bg-[#8B5CF6]/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>

                  <button
                    onClick={() => handleEliminar(regla.id_regla)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}