"use client";

import Link from "next/link";
import {
  Store,
  Settings,
  LogOut
} from "lucide-react";

interface MerchantSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "perfil", label: "Mi Comercio", icon: Store },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function MerchantSidebar({ activeTab, onTabChange, onLogout }: MerchantSidebarProps) {
  return (
    <aside className="w-64 bg-[#1a1625]/95 backdrop-blur-xl border-r border-[#8B5CF6]/20 fixed h-full">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#a78bfa] to-[#7c3aed] bg-clip-text text-transparent">
          Cohatech
        </Link>
      </div>

      <nav className="px-4 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
              activeTab === item.id
                ? "bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                : "text-gray-400 hover:bg-[#8B5CF6]/10 hover:text-[#a78bfa]"
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}