import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface FileInputProps {
  /** Called once with every selected file (works for both single and multiple mode) */
  onFiles: (files: FileList) => void;
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  uploading?: boolean;
}

export const FileInput: React.FC<FileInputProps> = ({
  onFiles,
  disabled,
  multiple,
  label = "Click to upload, or drag an image here",
  uploading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFiles(files);
  };

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (!disabled) handleFiles(e.dataTransfer.files);
      }}
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 px-4 text-center transition-colors ${
        disabled
          ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50"
          : isDragging
          ? "border-black bg-gray-50 cursor-pointer"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 cursor-pointer"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
        className="hidden"
      />
      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
        <UploadCloud size={17} />
      </div>
      <p className="text-sm text-gray-500">
        {uploading ? "Uploading..." : label}
      </p>
    </div>
  );
};
