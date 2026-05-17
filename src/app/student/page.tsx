"use client";

import { useState, useEffect } from "react";
import { CreditCard, Settings } from "lucide-react";
import {
  StudentLayout,
  PresupuestoView,
  MetaAhorroView
} from "@/components/student";
import {
  getAuth,
  clearAuth,
  getPresupuesto,
  createPresupuesto,
  updatePresupuesto,
  Presupuesto
} from "@/services/api";

interface User {
  id_usuario: string;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  estado: string;
}

export default function StudentPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("presupuesto");

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser(auth.user);
      cargarPresupuesto();
    }
  }, []);

  const cargarPresupuesto = async () => {
    try {
      const data = await getPresupuesto();
      setPresupuesto(data);
    } catch (error) {
      console.error("Error cargando presupuesto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  const handleSavePresupuesto = async (data: { presupuesto_semanal: number; presupuesto_mensual: number }) => {
    await updatePresupuesto(data);
    await cargarPresupuesto();
  };

  const handleCreatePresupuesto = async (data: { universidad: string; carrera: string; presupuesto_semanal: number; presupuesto_mensual: number }) => {
    await createPresupuesto(data);
    await cargarPresupuesto();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="text-[#a78bfa]">Cargando...</div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "presupuesto":
        return (
          <PresupuestoView
            presupuesto={presupuesto}
            onSave={handleSavePresupuesto}
            onCreate={handleCreatePresupuesto}
          />
        );
      case "metaAhorro":
        return <MetaAhorroView />;
      case "billetera":
        return <BilleteraView />;
      case "config":
        return <ConfigView />;
      default:
        return null;
    }
  };

  return (
    <StudentLayout
      userName={user.nombre}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </StudentLayout>
  );
}

function BilleteraView() {
  return (
    <div className="panel-card">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <CreditCard className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="panel-title text-white text-2xl mb-2">Mi Billetera</h2>
        <p className="panel-subtitle">Gestiona tus métodos de pago y tarjetas</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
      </div>
    </div>
  );
}

function ConfigView() {
  return (
    <div className="panel-card">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
          <Settings className="text-[#a78bfa]" size={40} />
        </div>
        <h2 className="panel-title text-white text-2xl mb-2">Configuración</h2>
        <p className="panel-subtitle">Administra tu cuenta y preferencias</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
      </div>
    </div>
  );
}