"use client";

import { useState, useEffect } from "react";
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
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
          <AlertCircle size={18} />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Mi Comercio</h2>
            <button
              onClick={() => setEditando(!editando)}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/20 text-[#a78bfa] rounded-lg hover:bg-[#8B5CF6]/30 transition-all"
            >
              {editando ? "Cancelar" : "Editar"}
            </button>
          </div>

          {editando ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Nombre del Comercio</label>
                  <input
                    type="text"
                    value={formData.nombre_comercio}
                    onChange={(e) => setFormData({ ...formData, nombre_comercio: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Rubro</label>
                  <select
                    value={formData.rubro}
                    onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {rubros.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#a78bfa] mb-2">Dirección / Ubicación</label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                  placeholder="Av. América entre 6 y 7"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Zona</label>
                  <select
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {zonas.map((z) => (
                      <option key={z.value} value={z.value}>{z.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Universidad Cercana</label>
                  <select
                    value={formData.universidad_cercana}
                    onChange={(e) => setFormData({ ...formData, universidad_cercana: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {universidades.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Tipo de Comercio</label>
                  <select
                    value={formData.tipo_comercio}
                    onChange={(e) => setFormData({ ...formData, tipo_comercio: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {tiposComercio.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Hora Apertura</label>
                  <input
                    type="time"
                    value={formData.horario_apertura}
                    onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#a78bfa] mb-2">Hora Cierre</label>
                  <input
                    type="time"
                    value={formData.horario_cierre}
                    onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          ) : (
            <ComercioDisplay comercio={comercio!} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/10 rounded-2xl p-6 border border-[#8B5CF6]/30">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                <Store className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-bold text-white">{comercio?.nombre_comercio}</h3>
              <p className="text-gray-400 text-sm capitalize">{comercio?.rubro}</p>
            </div>
          </div>

          {comercio?.score_actual !== null && (
            <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/20">
              <h4 className="text-white font-bold mb-3">Score</h4>
              <div className="flex items-center justify-center">
                <span className="text-4xl font-bold text-[#a78bfa]">{comercio?.score_actual}</span>
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
}: {
  formData: typeof import("@/services/api").Comercio;
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  guardando: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#8B5CF6]/20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <Store className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Completa los datos de tu Comercio</h2>
        <p className="text-gray-400">Registra la información de tu negocio para comenzar</p>
      </div>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Nombre del Comercio</label>
            <input
              type="text"
              value={formData.nombre_comercio}
              onChange={(e) => setFormData({ ...formData, nombre_comercio: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500"
              placeholder="Ej: Tacos El Güero"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Rubro</label>
            <select
              value={formData.rubro}
              onChange={(e) => setFormData({ ...formData, rubro: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {rubros.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#a78bfa] mb-2">Dirección / Ubicación</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]" size={18} />
            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              className="w-full pl-10 px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500"
              placeholder="Av. América entre 6 y 7"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Zona</label>
            <select
              value={formData.zona}
              onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {zonas.map((z) => (
                <option key={z.value} value={z.value}>{z.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Universidad Cercana</label>
            <select
              value={formData.universidad_cercana}
              onChange={(e) => setFormData({ ...formData, universidad_cercana: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {universidades.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Tipo de Comercio</label>
            <select
              value={formData.tipo_comercio}
              onChange={(e) => setFormData({ ...formData, tipo_comercio: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            >
              <option value="">Seleccionar...</option>
              {tiposComercio.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Hora Apertura</label>
            <input
              type="time"
              value={formData.horario_apertura}
              onChange={(e) => setFormData({ ...formData, horario_apertura: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#a78bfa] mb-2">Hora Cierre</label>
            <input
              type="time"
              value={formData.horario_cierre}
              onChange={(e) => setFormData({ ...formData, horario_cierre: e.target.value })}
              className="w-full px-4 py-3 bg-[#0f0a1a] border border-[#8B5CF6]/30 rounded-xl text-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Crear Comercio"}
        </button>
      </form>
    </div>
  );
}

function ComercioDisplay({ comercio }: { comercio: Comercio }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="p-4 bg-[#0f0a1a] rounded-xl">
        <p className="text-gray-400 text-sm mb-1">Rubro</p>
        <p className="text-white font-medium capitalize">{comercio.rubro}</p>
      </div>
      <div className="p-4 bg-[#0f0a1a] rounded-xl">
        <p className="text-gray-400 text-sm mb-1">Tipo</p>
        <p className="text-white font-medium capitalize">{comercio.tipo_comercio}</p>
      </div>
      <div className="p-4 bg-[#0f0a1a] rounded-xl col-span-2">
        <p className="text-gray-400 text-sm mb-1">Ubicación</p>
        <p className="text-white font-medium">{comercio.ubicacion}, {comercio.zona}</p>
      </div>
      <div className="p-4 bg-[#0f0a1a] rounded-xl">
        <p className="text-gray-400 text-sm mb-1">Universidad Cercana</p>
        <p className="text-white font-medium">{comercio.universidad_cercana}</p>
      </div>
      <div className="p-4 bg-[#0f0a1a] rounded-xl">
        <p className="text-gray-400 text-sm mb-1">Horario</p>
        <p className="text-white font-medium flex items-center gap-2">
          <Clock size={16} />
          {comercio.horario_apertura} - {comercio.horario_cierre}
        </p>
      </div>
    </div>
  );
}