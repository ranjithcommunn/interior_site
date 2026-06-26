import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  InteriorSlide,
  createInteriorSlide,
  deleteInteriorSlide,
  fetchInteriorSlides,
  reorderInteriorSlides,
  updateInteriorSlide,
} from "../../api/interiorSlides";
import { uploadImage } from "../../api/upload";

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
    onSuccess: invalidate,
  });

  const reorderMutation = useMutation({
    mutationFn: reorderInteriorSlides,
    onSuccess: invalidate,
  });

  const sorted = [...slides].sort((a, b) => a.rank - b.rank);

  const handleFileSelect = async (file: File | null) => {
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Interior Design Slides</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manages the "Interiors" carousel on the homepage (title, description, image, and an
        optional "Know More" link).
      </p>

      <div className="bg-white rounded-lg p-5 mb-6 max-w-xl">
        <h2 className="font-semibold mb-3">Add Slide</h2>
        <input
          type="text"
          placeholder="Title (e.g. Kitchen Interior)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />
        <textarea
          placeholder="Description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
        />
        <input
          type="text"
          placeholder="Know More link (optional, e.g. /kitchen-interior)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border rounded-md p-2 mb-3"
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
        <p className="text-gray-500">No slides yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((slide, index) => (
            <div
              key={slide._id}
              className={`bg-white rounded-lg p-4 flex items-start gap-4 ${
                !slide.isActive ? "opacity-50" : ""
              }`}
            >
              <img
                src={slide.image}
                alt=""
                className="w-32 h-20 object-cover rounded-md shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-2">
                <input
                  type="text"
                  defaultValue={slide.title}
                  onBlur={(e) =>
                    updateMutation.mutate({ id: slide._id, input: { title: e.target.value } })
                  }
                  className="w-full border rounded-md p-2 text-sm font-medium"
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
                  className="w-full border rounded-md p-2 text-sm"
                />
                <input
                  type="text"
                  defaultValue={slide.link || ""}
                  placeholder="Know More link (optional)"
                  onBlur={(e) =>
                    updateMutation.mutate({ id: slide._id, input: { link: e.target.value } })
                  }
                  className="w-full border rounded-md p-2 text-sm"
                />
              </div>
              <div className="flex flex-col items-end gap-2 text-sm shrink-0">
                <div className="flex items-center gap-2">
                  <button onClick={() => moveRank(index, -1)} className="text-gray-500 hover:text-black">
                    ↑
                  </button>
                  <button onClick={() => moveRank(index, 1)} className="text-gray-500 hover:text-black">
                    ↓
                  </button>
                </div>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={slide.isActive}
                    onChange={(e) =>
                      updateMutation.mutate({ id: slide._id, input: { isActive: e.target.checked } })
                    }
                  />
                  Active
                </label>
                <button
                  onClick={() => {
                    if (confirm("Delete this slide?")) deleteMutation.mutate(slide._id);
                  }}
                  className="text-red-600 hover:underline"
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
