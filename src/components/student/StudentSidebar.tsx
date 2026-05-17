"use client";

import Link from "next/link";
import {
  Wallet,
  Target,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "presupuesto", label: "Presupuesto", icon: Wallet },
  { id: "metaAhorro", label: "Meta Ahorro", icon: Target },
  { id: "billetera", label: "Billetera", icon: CreditCard },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function StudentSidebar({ activeTab, onTabChange, onLogout }: StudentSidebarProps) {
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