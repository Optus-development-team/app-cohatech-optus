"use client";

import { useMemo } from "react";
import { Calendar, Clock } from "lucide-react";

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
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/30">
      <h3 className="text-xl font-bold text-white mb-4">
        {editandoId ? "Editar Meta" : "Nueva Meta de Ahorro"}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Nombre de la Meta</label>
            <select
              value={formData.nombre_meta}
              onChange={(e) => setFormData({ ...formData, nombre_meta: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {tiposMeta.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Monto Objetivo (Bs)</label>
            <input
              type="number"
              value={formData.monto_objetivo}
              onChange={(e) => setFormData({ ...formData, monto_objetivo: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500"
              placeholder="Ej: 300"
              min={10}
              max={50000}
              required
            />
          </div>
        </div>

        {!editandoId && (
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Duración de la Meta</label>
            <div className="grid grid-cols-5 gap-2">
              {duraciones.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, duracion: d.value })}
                  className={`p-3 rounded-xl border transition-all ${
                    formData.duracion === d.value
                      ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                      : "bg-[#0f0a1a] border-[#8B5CF6]/30 text-gray-400 hover:border-[#8B5CF6]/60"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Clock size={18} />
                    <span className="text-xs font-medium">{d.label}</span>
                  </div>
                </button>
              ))}
            </div>
            {fechaCalculada && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl">
                <Calendar size={18} className="text-[#a78bfa]" />
                <span className="text-sm text-gray-300">
                  Tu meta vence el: <span className="text-white font-medium">{fechaCalculada}</span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={guardando || (!editandoId && !formData.duracion)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {guardando ? "Guardando..." : editandoId ? "Actualizar" : "Crear Meta"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-[#8B5CF6]/20 text-[#a78bfa] rounded-xl hover:bg-[#8B5CF6]/30 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}