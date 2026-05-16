"use client";

import { Phone } from "lucide-react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  const handlePhoneChange = (num: string) => {
    const cleanNum = num.replace(/\D/g, "");
    onChange(cleanNum);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#a78bfa] mb-2">
        Teléfono (opcional)
      </label>
      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B5CF6]" size={18} />
        <input
          type="tel"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="w-full py-3 pl-10 pr-4 bg-[#0f0a1a]/80 border border-[#8B5CF6]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition-all"
          placeholder="69999999"
        />
      </div>
    </div>
  );
}