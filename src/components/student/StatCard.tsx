import { LucideIcon } from "lucide-react";
import styles from "./Student.module.css";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
}

export default function StatCard({ label, value, icon: Icon, gradient }: StatCardProps) {
  const badgeClass =
    gradient.includes("amber") || gradient.includes("orange")
      ? styles.gradientBadgeAmber
      : gradient.includes("cyan") || gradient.includes("blue")
        ? styles.gradientBadgeCyan
        : gradient.includes("green")
          ? styles.gradientBadgeGreen
          : styles.gradientBadgePrimary;

  return (
    <div className={styles.panelCard + " relative transition-all"}>
      <div className={`${badgeClass} mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className={styles.valueLarge + " mb-1"}>{value}</div>
      <div className={styles.mutedText + " text-sm"}>{label}</div>
    </div>
  );
}