"use client";

import { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";
import {
  MetaAhorro,
  getMetasAhorro,
  createMetaAhorro,
  updateMetaAhorro,
  deleteMetaAhorro,
} from "@/services/api";
import MetaAhorroForm from "./MetaAhorroForm";
import MetaAhorroCard from "./MetaAhorroCard";
import MetaAhorroEmpty from "./MetaAhorroEmpty";

interface MetaAhorroViewProps {
  refreshTrigger?: number;
}

export default function MetaAhorroView({ refreshTrigger }: MetaAhorroViewProps) {
  const [metas, setMetas] = useState<MetaAhorro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre_meta: "",
    monto_objetivo: "",
    duracion: "",
  });

  useEffect(() => {
    cargarMetas();
  }, [refreshTrigger]);

  const cargarMetas = async () => {
    try {
      const data = await getMetasAhorro();
      setMetas(data);
    } catch (err) {
      console.error("Error cargando metas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setError("");

    try {
      if (editandoId) {
        await updateMetaAhorro(editandoId, {
          nombre_meta: formData.nombre_meta,
          monto_objetivo: Number(formData.monto_objetivo),
        });
      } else {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + parseInt(formData.duracion));
        await createMetaAhorro({
          nombre_meta: formData.nombre_meta,
          monto_objetivo: Number(formData.monto_objetivo),
          fecha_limite: fechaLimite.toISOString(),
        });
      }
      await cargarMetas();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando meta");
    } finally {
      setGuardando(false);
    }
  };

  const handlePausar = async (id: string, estadoActual: string) => {
    const nuevoEstado = estadoActual === "activa" ? "pausada" : "activa";
    try {
      await updateMetaAhorro(id, { estado_meta: nuevoEstado as "activa" | "pausada" });
      await cargarMetas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando meta");
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta meta de ahorro?")) return;
    try {
      await deleteMetaAhorro(id);
      await cargarMetas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando meta");
    }
  };

  const resetForm = () => {
    setFormData({ nombre_meta: "", monto_objetivo: "", duracion: "" });
    setShowForm(false);
    setEditandoId(null);
  };

  const startEdit = (meta: MetaAhorro) => {
    const fechaInicio = new Date(meta.fecha_inicio);
    const fechaLimite = new Date(meta.fecha_limite);
    const dias = Math.ceil((fechaLimite.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
    
    setFormData({
      nombre_meta: meta.nombre_meta,
      monto_objetivo: meta.monto_objetivo.toString(),
      duracion: dias.toString(),
    });
    setEditandoId(meta.id_meta);
    setShowForm(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Metas de Ahorro</h2>
          <p className="text-gray-400">Define y gestiona tus objetivos de ahorro</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          <Plus size={18} />
          Nueva Meta
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {showForm && (
        <MetaAhorroForm
          formData={formData}
          setFormData={setFormData}
          editandoId={editandoId}
          guardando={guardando}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      {metas.length === 0 && !showForm ? (
        <MetaAhorroEmpty onCreateClick={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metas.map((meta) => (
            <MetaAhorroCard
              key={meta.id_meta}
              meta={meta}
              onEdit={() => startEdit(meta)}
              onToggle={() => handlePausar(meta.id_meta, meta.estado_meta)}
              onDelete={() => handleEliminar(meta.id_meta)}
            />
          ))}
        </div>
      )}
    </div>
  );
}