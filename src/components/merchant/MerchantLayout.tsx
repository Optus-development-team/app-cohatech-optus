"use client";

import MerchantSidebar from "./MerchantSidebar";

interface MerchantLayoutProps {
  userName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function MerchantLayout({ userName, activeTab, onTabChange, onLogout, children }: MerchantLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0f0a1a]">
      <MerchantSidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onLogout={onLogout}
      />
      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Hola, {userName}</h1>
          <p className="text-gray-400">Bienvenido al panel de comerciante</p>
        </div>
        {children}
      </div>
    </div>
  );
}