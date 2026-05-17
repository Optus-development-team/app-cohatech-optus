"use client";

import Link from "next/link";
import {
  Store,
  Settings,
  LogOut
} from "lucide-react";
import styles from "./Merchant.module.css";

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
    <aside className={styles.sidebar}>
      

      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ""}`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

    </aside>
  );
}