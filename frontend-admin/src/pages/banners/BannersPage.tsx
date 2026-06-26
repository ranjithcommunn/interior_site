import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  Banner,
  createBanner,
  deleteBanner,
  fetchBanners,
  reorderBanners,
  updateBanner,
} from "../../api/banners";
import { uploadImage } from "../../api/upload";
import { Checkbox } from "../../components/Checkbox";
import { FileInput } from "../../components/FileInput";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const BannersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

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
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderBanners,
    onSuccess: invalidate,
  });

  const sorted = [...banners].sort((a, b) => a.rank - b.rank);

  const handleFileSelect = async (files: FileList) => {
    const file = files[0];
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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-800 mb-1">Add Banner</h2>
        <p className="text-sm text-gray-500 mb-4">
          Recommended: wide landscape image (e.g. 1920x800). It will appear in the homepage hero
          carousel.
        </p>
        <input
          type="text"
          placeholder="Link when clicked (optional, e.g. /living/123abc)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full max-w-md border border-gray-200 rounded-lg p-2.5 text-sm mb-3 outline-none focus:border-black transition-colors"
        />
        <FileInput onFiles={handleFileSelect} disabled={uploading} uploading={uploading} />
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400">No banners yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((banner, index) => (
            <div
              key={banner._id}
              className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 ${
                !banner.isActive ? "opacity-50" : ""
              }`}
            >
              <img
                src={banner.image}
                alt=""
                className="w-32 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  defaultValue={banner.link || ""}
                  placeholder="Link (optional)"
                  onBlur={(e) =>
                    updateMutation.mutate({ id: banner._id, input: { link: e.target.value } })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="flex items-center gap-1 text-sm shrink-0">
                <button
                  onClick={() => moveRank(index, -1)}
                  className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                >
                  <ChevronUp size={15} />
                </button>
                <button
                  onClick={() => moveRank(index, 1)}
                  className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                >
                  <ChevronDown size={15} />
                </button>
                <div className="ml-2">
                  <Checkbox
                    checked={banner.isActive}
                    onChange={(checked) =>
                      updateMutation.mutate({ id: banner._id, input: { isActive: checked } })
                    }
                    label="Active"
                  />
                </div>
                <button
                  onClick={() => setDeleteTarget(banner)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors ml-1"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this banner?"
        description="This banner will be permanently removed from the homepage."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
