import React, { useState } from "react";
import { uploadImage } from "../api/upload";
import { ProductImage } from "../api/products";
import { FileInput } from "./FileInput";

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ images, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: ProductImage[] = [];
      let nextRank = images.length;
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        uploaded.push({ url, rank: nextRank++ });
      }
      onChange([...images, ...uploaded]);
    } catch {
      setError("Image upload failed. Check Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, rank: i }));
    onChange(next);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((img, i) => ({ ...img, rank: i })));
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2.5 mb-3">
          {images
            .slice()
            .sort((a, b) => a.rank - b.rank)
            .map((img, index) => (
              <div
                key={img.url + index}
                className="relative rounded-lg overflow-hidden border border-gray-200 group"
              >
                <img src={img.url} alt="" className="w-full h-20 object-cover" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-black text-white text-[10px] px-1.5 py-0.5 rounded-md">
                    Thumbnail
                  </span>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    className="w-6 h-6 rounded-full bg-white/90 text-xs flex items-center justify-center"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    className="w-6 h-6 rounded-full bg-white/90 text-xs flex items-center justify-center"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="w-6 h-6 rounded-full bg-white/90 text-red-600 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      <FileInput
        onFiles={handleFiles}
        disabled={uploading}
        uploading={uploading}
        multiple
        label="Click to upload, or drag images here"
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
