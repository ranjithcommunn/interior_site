import React from "react";
import { Check } from "lucide-react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <label
      className={`inline-flex items-center gap-2 text-sm text-gray-600 select-none ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <span className="relative inline-flex shrink-0">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="appearance-none w-[18px] h-[18px] rounded-md border-2 border-gray-300 checked:border-black checked:bg-black transition-colors cursor-pointer disabled:cursor-not-allowed"
        />
        {checked && (
          <Check
            size={13}
            strokeWidth={3}
            className="absolute inset-0 m-auto text-white pointer-events-none"
          />
        )}
      </span>
      {label}
    </label>
  );
};
