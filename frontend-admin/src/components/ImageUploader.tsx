import React, { useState } from "react";
import { uploadImage } from "../api/upload";
import { ProductImage } from "../api/products";

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
      <div className="grid grid-cols-4 gap-2 mb-3">
        {images
          .slice()
          .sort((a, b) => a.rank - b.rank)
          .map((img, index) => (
            <div key={img.url + index} className="relative border rounded-md overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-20 object-cover" />
              {index === 0 && (
                <span className="absolute top-0 left-0 bg-black text-white text-[10px] px-1">
                  Thumbnail
                </span>
              )}
              <div className="absolute bottom-0 right-0 flex bg-white/80 text-xs">
                <button type="button" onClick={() => moveImage(index, -1)} className="px-1">
                  ↑
                </button>
                <button type="button" onClick={() => moveImage(index, 1)} className="px-1">
                  ↓
                </button>
                <button type="button" onClick={() => removeImage(index)} className="px-1 text-red-600">
                  ✕
                </button>
              </div>
            </div>
          ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
