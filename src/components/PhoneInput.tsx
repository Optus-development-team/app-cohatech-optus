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
    <div className="ui-field">
      <label className="ui-label">
        Teléfono (opcional)
      </label>
      <div className="ui-input-wrap">
        <Phone className="ui-icon-left" size={18} />
        <input
          type="tel"
          value={value}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className="ui-input ui-input-icon-pad"
          placeholder="69999999"
        />
      </div>
    </div>
  );
}