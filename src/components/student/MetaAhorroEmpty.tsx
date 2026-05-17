"use client";

import { Target, Plus } from "lucide-react";

interface MetaAhorroEmptyProps {
  onCreateClick: () => void;
}

export default function MetaAhorroEmpty({ onCreateClick }: MetaAhorroEmptyProps) {
  return (
    <div className="bg-[#1a1625]/80 backdrop-blur-xl rounded-2xl p-12 border border-[#8B5CF6]/20 text-center">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
        <Target className="text-[#a78bfa]" size={40} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Sin metas de ahorro</h3>
      <p className="text-gray-400 mb-6">Crea tu primera meta para empezar a ahorrar</p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
      >
        <Plus size={18} />
        Crear Mi Primera Meta
      </button>
    </div>
  );
}