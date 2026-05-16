import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  gradient: string;
}

export default function StatCard({ label, value, icon: Icon, gradient }: StatCardProps) {
  return (
    <div className="relative bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="text-white" size={24} />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}