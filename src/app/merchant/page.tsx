"use client";

import { useState, useEffect } from "react";
import {
  MerchantLayout,
  MerchantStatsView,
  MerchantProfileView
} from "@/components/merchant";
import {
  getAuth,
  clearAuth,
} from "@/services/api";

interface User {
  id_usuario: string;
  nombre: string;
  correo: string;
  tipo_usuario: string;
  estado: string;
}

export default function MerchantPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("estadisticas");

  useEffect(() => {
    const auth = getAuth();
    if (auth) {
      setUser(auth.user);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0a1a]">
        <div className="w-8 h-8 border-4 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "estadisticas":
        return <MerchantStatsView />;
      case "perfil":
        return <MerchantProfileView />;
      case "config":
        return <ConfigView />;
      default:
        return null;
    }
  };

  return (
    <MerchantLayout
      userName={user.nombre}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderContent()}
    </MerchantLayout>
  );
}

function ConfigView() {
  return (
    <div className="panel-card">
      <div className="text-center mb-8">
        <h2 className="panel-title text-white text-2xl mb-2">Configuración</h2>
        <p className="panel-subtitle">Administra tu cuenta y preferencias</p>
      </div>
      <div className="text-center text-gray-500 py-8">
        Próximamente...
      </div>
    </div>
  );
}