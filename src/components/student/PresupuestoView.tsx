"use client";

import { useState } from "react";
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
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Mi Presupuesto</h2>
          <button
            onClick={() => setEditando(!editando)}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 text-[#a78bfa] rounded-lg hover:bg-[#8B5CF6]/30 transition-all"
          >
            <Edit3 size={16} />
            Editar
          </button>
        </div>

        {editando ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">Universidad</label>
                <input
                  type="text"
                  value={formData.universidad}
                  onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">Carrera</label>
                <input
                  type="text"
                  value={formData.carrera}
                  onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                  disabled
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">Presupuesto Semanal (Bs)</label>
                <input
                  type="number"
                  value={formData.presupuesto_semanal}
                  onChange={(e) => setFormData({ ...formData, presupuesto_semanal: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                  min={0}
                  max={10000}
                />
              </div>
              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">Presupuesto Mensual (Bs)</label>
                <input
                  type="number"
                  value={formData.presupuesto_mensual}
                  onChange={(e) => setFormData({ ...formData, presupuesto_mensual: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                  min={0}
                  max={50000}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50"
            >
              {guardando ? "Guardando..." : <><Save size={18} /> Guardar Cambios</>}
            </button>
          </form>
        ) : (
          <PresupuestoDisplay presupuesto={presupuesto} />
        )}
      </div>

      <div className="space-y-6">
        <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/20">
          <h3 className="text-white font-bold mb-4">Nivel Estudiantil</h3>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-3xl">
              🎓
            </div>
            <p className="text-xl font-bold text-amber-400">{presupuesto.nivel_actual}</p>
            <p className="text-gray-400 text-sm">{presupuesto.puntos_actuales} puntos</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-2xl p-6 border border-green-500/30">
          <h3 className="text-white font-bold mb-3">Ahorro Total</h3>
          <p className="text-3xl font-bold text-green-400">{presupuesto.ahorro_total} <span className="text-lg">Bs</span></p>
        </div>
      </div>
    </div>
  );
}

function PresupuestoDisplay({ presupuesto }: { presupuesto: Presupuesto }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="p-6 bg-gradient-to-br from-[#7c3aed]/20 to-[#6d28d9]/10 rounded-2xl border border-[#8B5CF6]/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#7c3aed] flex items-center justify-center">
            <Calendar className="text-white" size={20} />
          </div>
          <span className="text-gray-400">Semanal</span>
        </div>
        <p className="text-3xl font-bold text-white">{presupuesto.presupuesto_semanal} <span className="text-lg text-gray-400">Bs</span></p>
      </div>
      <div className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 rounded-2xl border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
            <DollarSign className="text-white" size={20} />
          </div>
          <span className="text-gray-400">Mensual</span>
        </div>
        <p className="text-3xl font-bold text-white">{presupuesto.presupuesto_mensual} <span className="text-lg text-gray-400">Bs</span></p>
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
  formData: { universidad: string; carrera: string; presupuesto_semanal: number; presupuesto_mensual: number };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <Wallet className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Configura tu Presupuesto</h2>
        <p className="text-gray-400">Define tu presupuesto estudiantil para comenzar a gestionar tus finanzas</p>
      </div>

      <form onSubmit={onSubmit} className="max-w-xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Universidad</label>
            <select
              value={formData.universidad}
              onChange={(e) => setFormData({ ...formData, universidad: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {universidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Carrera</label>
            <input
              type="text"
              value={formData.carrera}
              onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              placeholder="Ej: Ing. Sistemas"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Presupuesto Semanal (Bs)</label>
            <input
              type="number"
              value={formData.presupuesto_semanal}
              onChange={(e) => setFormData({ ...formData, presupuesto_semanal: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500"
              placeholder="Ej: 150"
              min={0}
              max={10000}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Presupuesto Mensual (Bs)</label>
            <input
              type="number"
              value={formData.presupuesto_mensual}
              onChange={(e) => setFormData({ ...formData, presupuesto_mensual: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500"
              placeholder="Ej: 600"
              min={0}
              max={50000}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={guardando}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50"
        >
          {guardando ? "Creando..." : <><CheckCircle size={20} /> Crear Presupuesto</>}
        </button>
      </form>
    </div>
  );
}