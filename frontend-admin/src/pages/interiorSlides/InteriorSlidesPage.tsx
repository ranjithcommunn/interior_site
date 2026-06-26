import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  InteriorSlide,
  createInteriorSlide,
  deleteInteriorSlide,
  fetchInteriorSlides,
  reorderInteriorSlides,
  updateInteriorSlide,
} from "../../api/interiorSlides";
import { uploadImage } from "../../api/upload";
import { Checkbox } from "../../components/Checkbox";
import { FileInput } from "../../components/FileInput";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const InteriorSlidesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["interiorSlides"],
    queryFn: fetchInteriorSlides,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<InteriorSlide | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["interiorSlides"] });

  const createMutation = useMutation({
    mutationFn: createInteriorSlide,
    onSuccess: () => {
      invalidate();
      setTitle("");
      setDescription("");
      setLink("");
    },
    onError: () => setError("Failed to save slide."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<InteriorSlide> }) =>
      updateInteriorSlide(id, input),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteInteriorSlide,
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderInteriorSlides,
    onSuccess: invalidate,
  });

  const sorted = [...slides].sort((a, b) => a.rank - b.rank);

  const handleFileSelect = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    if (!title.trim()) {
      setError("Please enter a title before uploading the image.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      createMutation.mutate({
        image: url,
        title,
        description: description || undefined,
        link: link || undefined,
      });
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
        <h2 className="font-semibold text-gray-800 mb-1">Add Slide</h2>
        <p className="text-sm text-gray-500 mb-5">
          Manages the "Interiors" carousel on the homepage.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Title (e.g. Kitchen Interior)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
            />
            <textarea
              placeholder="Description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
            />
            <input
              type="text"
              placeholder="Know More link (optional, e.g. /kitchen-interior)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
            />
          </div>
          <div>
            <FileInput onFiles={handleFileSelect} disabled={uploading} uploading={uploading} />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400">No slides yet. Add one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((slide, index) => (
            <div
              key={slide._id}
              className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4 ${
                !slide.isActive ? "opacity-50" : ""
              }`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-32 h-20 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  defaultValue={slide.title}
                  onBlur={(e) =>
                    updateMutation.mutate({ id: slide._id, input: { title: e.target.value } })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm font-medium outline-none focus:border-black transition-colors"
                />
                <textarea
                  defaultValue={slide.description}
                  rows={2}
                  onBlur={(e) =>
                    updateMutation.mutate({
                      id: slide._id,
                      input: { description: e.target.value },
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-black transition-colors"
                />
                <input
                  type="text"
                  defaultValue={slide.link || ""}
                  placeholder="Know More link (optional)"
                  onBlur={(e) =>
                    updateMutation.mutate({ id: slide._id, input: { link: e.target.value } })
                  }
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
              <div className="flex flex-col items-end gap-2 text-sm shrink-0">
                <div className="flex items-center gap-1">
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
                </div>
                <Checkbox
                  checked={slide.isActive}
                  onChange={(checked) =>
                    updateMutation.mutate({ id: slide._id, input: { isActive: checked } })
                  }
                  label="Active"
                />
                <button
                  onClick={() => setDeleteTarget(slide)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
        title="Delete this slide?"
        description="This interior design slide will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
