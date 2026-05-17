"use client";

import { Target, Plus } from "lucide-react";
import styles from "./Student.module.css";

interface MetaAhorroEmptyProps {
  onCreateClick: () => void;
}

export default function MetaAhorroEmpty({ onCreateClick }: MetaAhorroEmptyProps) {
  return (
    <div className={styles.panelCard + " text-center"}>
      <div className={styles.headerAvatar + " mx-auto mb-4"}>
        <Target className="text-[#a78bfa]" size={40} />
      </div>
      <h3 className={styles.titleMedium + " mb-2"}>Sin metas de ahorro</h3>
      <p className={styles.mutedText + " mb-6"}>Crea tu primera meta para empezar a ahorrar</p>
      <button
        onClick={onCreateClick}
        className={styles.buttonPrimary + " ui-btn-primary inline-flex items-center justify-center gap-2 max-w-xs mx-auto"}
      >
        <Plus size={18} />
        Crear Mi Primera Meta
      </button>
    </div>
  );
}