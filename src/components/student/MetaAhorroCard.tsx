"use client";

import { Target, Pencil, Trash2, Pause, Play, Calendar } from "lucide-react";
import { MetaAhorro } from "@/services/api";

interface MetaAhorroCardProps {
  meta: MetaAhorro;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export default function MetaAhorroCard({ meta, onEdit, onToggle, onDelete }: MetaAhorroCardProps) {
  const isActiva = meta.estado_meta === "activa";

  return (
    <div className={`bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border ${
      isActiva ? "border-[#8B5CF6]/30" : "border-gray-600/30"
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isActiva ? "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9]" : "bg-gray-600"
        }`}>
          <Target className="text-white" size={24} />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          isActiva
            ? "bg-green-500/20 text-green-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}>
          {meta.estado_meta === "activa" ? "Activa" : meta.estado_meta === "pausada" ? "Pausada" : "Completada"}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{meta.nombre_meta}</h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progreso</span>
          <span className="text-[#a78bfa] font-medium">{meta.porcentaje_avance.toFixed(1)}%</span>
        </div>
        <div className="w-full h-2 bg-[#0f0a1a] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(meta.porcentaje_avance, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{meta.monto_actual} Bs</span>
          <span className="text-white font-medium">{meta.monto_objetivo} Bs</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <Calendar size={14} />
        <span>Fecha límite: {new Date(meta.fecha_limite).toLocaleDateString("es-BO")}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onToggle}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
            isActiva
              ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
              : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          }`}
        >
          {isActiva ? <Pause size={16} /> : <Play size={16} />}
          {isActiva ? "Pausar" : "Activar"}
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center p-2 bg-[#8B5CF6]/20 text-[#a78bfa] rounded-lg hover:bg-[#8B5CF6]/30 transition-all"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}