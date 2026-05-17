"use client";

import Link from "next/link";
import {
  Wallet,
  Target,
  CreditCard,
  Settings,
  LogOut
} from "lucide-react";
import styles from "./Student.module.css";

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
    <aside className={styles.sidebar}>
      

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`${styles.navItem} ${
              activeTab === item.id
                ? styles.navItemActive
                : ""
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4">
        <button
          onClick={onLogout}
          className={styles.logoutBtn + " w-full flex items-center gap-3 transition-all"}
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}