import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Banner,
  createBanner,
  deleteBanner,
  fetchBanners,
  reorderBanners,
  updateBanner,
} from "../../api/banners";
import { uploadImage } from "../../api/upload";

export const BannersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["banners"] });

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      invalidate();
      setLink("");
    },
    onError: () => setError("Failed to save banner."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<Banner> }) => updateBanner(id, input),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: invalidate,
  });

  const reorderMutation = useMutation({
    mutationFn: reorderBanners,
    onSuccess: invalidate,
  });

  const sorted = [...banners].sort((a, b) => a.rank - b.rank);

  const handleFileSelect = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      createMutation.mutate({ image: url, link: link || undefined });
    } catch {
      setError("Image upload failed. Check Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  };

  const moveRank = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const a = sorted[index];
    const b = sorted[target];
    reorderMutation.mutate([
      { id: a._id, rank: b.rank },
      { id: b._id, rank: a.rank },
    ]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Home Page Banners</h1>

      <div className="bg-white rounded-lg p-5 mb-6">
        <h2 className="font-semibold mb-3">Add Banner</h2>
        <p className="text-sm text-gray-500 mb-3">
          Recommended: wide landscape image (e.g. 1920x800). It will appear in the homepage hero
          carousel.
        </p>
        <input
          type="text"
          placeholder="Link when clicked (optional, e.g. /living/123abc)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full max-w-md border rounded-md p-2 mb-3"
        />
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : sorted.length === 0 ? (
        <p className="text-gray-500">No banners yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((banner, index) => (
            <div
              key={banner._id}
              className={`bg-white rounded-lg p-4 flex items-center gap-4 ${
                !banner.isActive ? "opacity-50" : ""
              }`}
            >
              <img
                src={banner.image}
                alt=""
                className="w-32 h-16 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  defaultValue={banner.link || ""}
                  placeholder="Link (optional)"
                  onBlur={(e) =>
                    updateMutation.mutate({ id: banner._id, input: { link: e.target.value } })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2 text-sm shrink-0">
                <button onClick={() => moveRank(index, -1)} className="text-gray-500 hover:text-black">
                  ↑
                </button>
                <button onClick={() => moveRank(index, 1)} className="text-gray-500 hover:text-black">
                  ↓
                </button>
                <label className="flex items-center gap-1.5 ml-2">
                  <input
                    type="checkbox"
                    checked={banner.isActive}
                    onChange={(e) =>
                      updateMutation.mutate({ id: banner._id, input: { isActive: e.target.checked } })
                    }
                  />
                  Active
                </label>
                <button
                  onClick={() => {
                    if (confirm("Delete this banner?")) deleteMutation.mutate(banner._id);
                  }}
                  className="text-red-600 hover:underline ml-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
