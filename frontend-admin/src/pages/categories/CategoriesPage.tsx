import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus, CornerDownRight } from "lucide-react";
import {
  Category,
  CategoryInput,
  createCategory,
  deleteCategory,
  fetchCategories,
  reorderCategories,
  updateCategory,
} from "../../api/categories";
import { uploadImage } from "../../api/upload";
import { Checkbox } from "../../components/Checkbox";
import { FileInput } from "../../components/FileInput";
import { Dropdown } from "../../components/Dropdown";
import { Dialog } from "../../components/Dialog";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const PAGE_SIZE = 10;

interface FormState {
  id: string | null;
  name: string;
  parentCategory: string;
  isActive: boolean;
  image: string;
}

const emptyForm: FormState = {
  id: null,
  name: "",
  parentCategory: "",
  isActive: true,
  image: "",
};

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createMutation = useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
      setDialogOpen(false);
    },
    onError: () => setFormError("Failed to save category. Handle may already be in use."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CategoryInput> }) =>
      updateCategory(id, input),
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
      setDialogOpen(false);
    },
    onError: () => setFormError("Failed to update category."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      invalidate();
      setDeleteTarget(null);
    },
    onError: (err: any) => {
      setDeleteTarget(null);
      setDeleteError(err?.response?.data?.message || "Failed to delete category.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderCategories,
    onSuccess: invalidate,
  });

  const topLevel = categories
    .filter((c) => !c.parentCategory)
    .sort((a, b) => a.rank - b.rank);
  const childrenOf = (parentId: string) =>
    categories.filter((c) => c.parentCategory === parentId).sort((a, b) => a.rank - b.rank);

  const openAddDialog = () => {
    setForm(emptyForm);
    setFormError("");
    setDialogOpen(true);
  };

  const openEditDialog = (cat: Category) => {
    setForm({
      id: cat._id,
      name: cat.name,
      parentCategory: cat.parentCategory || "",
      isActive: cat.isActive,
      image: cat.image || "",
    });
    setFormError("");
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return;

    const input: CategoryInput = {
      name: form.name,
      parentCategory: form.parentCategory || null,
      isActive: form.isActive,
      image: form.image || undefined,
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, input });
    } else {
      createMutation.mutate(input);
    }
  };

  const handleImageSelect = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploading(true);
    setFormError("");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch {
      setFormError("Image upload failed. Check Cloudinary configuration.");
    } finally {
      setUploading(false);
    }
  };

  const moveRank = (siblings: Category[], index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;
    const a = siblings[index];
    const b = siblings[targetIndex];
    reorderMutation.mutate([
      { id: a._id, rank: b.rank },
      { id: b._id, rank: a.rank },
    ]);
  };

  // Paginate by top-level category so a parent and its children never split across pages
  const totalPages = Math.max(1, Math.ceil(topLevel.length / PAGE_SIZE));
  const pageTopLevel = topLevel.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Build a flat row list (parent followed by its children) for the table
  const rows: { cat: Category; siblings: Category[]; index: number; indent: boolean }[] = [];
  pageTopLevel.forEach((cat) => {
    const topIndex = topLevel.indexOf(cat);
    rows.push({ cat, siblings: topLevel, index: topIndex, indent: false });
    const children = childrenOf(cat._id);
    children.forEach((child, childIndex) => {
      rows.push({ cat: child, siblings: children, index: childIndex, indent: true });
    });
  });

  return (
    <div>
      {deleteError && (
        <div className="mb-4 flex items-center justify-between gap-3 bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError("")} className="text-red-400 hover:text-red-600">
            ×
          </button>
        </div>
      )}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {isLoading ? "Loading..." : `${categories.length} categor${categories.length === 1 ? "y" : "ies"}`}
        </p>
        <button
          onClick={openAddDialog}
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-gray-900 transition-colors"
        >
          <Plus size={15} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 text-left text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Handle</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-gray-400" colSpan={5}>
                  No categories yet.
                </td>
              </tr>
            ) : (
              rows.map(({ cat, siblings, index, indent }) => (
                <tr key={cat._id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3">
                    <div className={`flex items-center gap-3 ${indent ? "pl-7" : ""}`}>
                      {indent && <CornerDownRight size={14} className="text-gray-300 shrink-0" />}
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                      )}
                      <span className="font-medium text-gray-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">/{cat.handle}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveRank(siblings, index, -1)}
                        className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveRank(siblings, index, 1)}
                        className="p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditDialog(cat)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={form.id ? "Edit Category" : "Add Category"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Name</label>
            <input
              type="text"
              placeholder="e.g. Living Room"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Parent</label>
            <Dropdown
              fullWidth
              value={form.parentCategory}
              onChange={(value) => setForm((f) => ({ ...f, parentCategory: value }))}
              placeholder="Top-level category"
              options={topLevel
                .filter((c) => c._id !== form.id)
                .map((c) => ({ value: c._id, label: c.name }))}
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Image (optional)</label>
            {form.image && (
              <img src={form.image} alt="" className="w-20 h-20 rounded-lg object-cover mb-2" />
            )}
            <FileInput
              onFiles={handleImageSelect}
              disabled={uploading}
              uploading={uploading}
              label={form.image ? "Click to replace image" : "Click to upload, or drag an image here"}
            />
          </div>

          <div className="mb-5">
            <Checkbox
              checked={form.isActive}
              onChange={(checked) => setForm((f) => ({ ...f, isActive: checked }))}
              label="Active"
            />
          </div>

          {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {form.id ? "Save Changes" : "Add Category"}
            </button>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This category will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
