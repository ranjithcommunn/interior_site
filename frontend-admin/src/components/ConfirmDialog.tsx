import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${
            danger ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
          }`}
        >
          <AlertTriangle size={20} />
        </div>
        <h2 className="font-semibold text-gray-800 mb-1.5">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-5">{description}</p>}
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors ${
              danger ? "bg-red-500 hover:bg-red-600" : "bg-black hover:bg-gray-900"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
