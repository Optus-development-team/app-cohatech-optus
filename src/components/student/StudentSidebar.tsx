"use client";

import Link from "next/link";
import {
  Wallet,
  Target,
  PiggyBank,
  CreditCard,
  Gift,
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
  { id: "reglasAhorro", label: "Reglas Ahorro", icon: PiggyBank },
  { id: "beneficios", label: "Canje Beneficio", icon: Gift },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function StudentSidebar({ activeTab, onTabChange, onLogout }: StudentSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
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