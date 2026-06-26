import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  /** Extra classes applied directly to the trigger button, e.g. for status-color pills */
  buttonClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  fullWidth = false,
  className = "",
  buttonClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.bottom + 6, left: rect.left, width: rect.width });
  };

  useEffect(() => {
    if (!open) return;
    updateCoords();

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        panelRef.current &&
        !panelRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleReposition = () => updateCoords();

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={wrapperRef} className={`relative ${fullWidth ? "w-full" : ""} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between gap-2 border rounded-lg pl-3 pr-2.5 py-2.5 text-sm bg-white outline-none transition-colors ${
          fullWidth ? "w-full" : "min-w-[150px]"
        } ${open ? "border-black" : "border-gray-200 hover:border-gray-300"} ${buttonClassName}`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
            className="bg-white border border-gray-100 rounded-xl shadow-lg z-[100] py-1.5 max-h-64 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 text-left text-sm px-3.5 py-2 transition-colors whitespace-nowrap ${
                  option.value === value
                    ? "bg-gray-50 text-black font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {option.label}
                {option.value === value && <Check size={14} />}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
};
