import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  CategoryInput,
  createCategory,
  deleteCategory,
  fetchCategories,
  reorderCategories,
  updateCategory,
} from "../../api/categories";

interface FormState {
  id: string | null;
  name: string;
  parentCategory: string;
  isActive: boolean;
}

const emptyForm: FormState = { id: null, name: "", parentCategory: "", isActive: true };

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["categories"] });

  const createMutation = useMutation({
    mutationFn: (input: CategoryInput) => createCategory(input),
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to save category. Handle may already be in use."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CategoryInput> }) =>
      updateCategory(id, input),
    onSuccess: () => {
      invalidate();
      setForm(emptyForm);
    },
    onError: () => setFormError("Failed to update category."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidate,
    onError: (err: any) => alert(err?.response?.data?.message || "Failed to delete category."),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return;

    const input: CategoryInput = {
      name: form.name,
      parentCategory: form.parentCategory || null,
      isActive: form.isActive,
    };

    if (form.id) {
      updateMutation.mutate({ id: form.id, input });
    } else {
      createMutation.mutate(input);
    }
  };

  const startEdit = (cat: Category) => {
    setForm({
      id: cat._id,
      name: cat.name,
      parentCategory: cat.parentCategory || "",
      isActive: cat.isActive,
    });
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

  const renderRow = (cat: Category, siblings: Category[], index: number, indent: boolean) => (
    <div
      key={cat._id}
      className={`flex items-center justify-between bg-white rounded-md px-3 py-2 mb-1 ${
        indent ? "ml-8" : ""
      } ${!cat.isActive ? "opacity-50" : ""}`}
    >
      <div>
        <span className="font-medium">{cat.name}</span>
        <span className="text-gray-400 text-xs ml-2">/{cat.handle}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <button onClick={() => moveRank(siblings, index, -1)} className="text-gray-500 hover:text-black">
          ↑
        </button>
        <button onClick={() => moveRank(siblings, index, 1)} className="text-gray-500 hover:text-black">
          ↓
        </button>
        <button onClick={() => startEdit(cat)} className="text-blue-600 hover:underline">
          Edit
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate(cat._id);
          }}
          className="text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            topLevel.map((cat, index) => {
              const children = childrenOf(cat._id);
              return (
                <div key={cat._id} className="mb-3">
                  {renderRow(cat, topLevel, index, false)}
                  {children.map((child, childIndex) => renderRow(child, children, childIndex, true))}
                </div>
              );
            })
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-5 h-fit">
          <h2 className="font-semibold mb-3">{form.id ? "Edit Category" : "Add Category"}</h2>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full border rounded-md p-2 mb-3"
            required
          />
          <select
            value={form.parentCategory}
            onChange={(e) => setForm((f) => ({ ...f, parentCategory: e.target.value }))}
            className="w-full border rounded-md p-2 mb-3"
          >
            <option value="">Top-level category</option>
            {topLevel
              .filter((c) => c._id !== form.id)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
            />
            Active
          </label>
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-md text-sm"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {form.id ? "Save" : "Add"}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={() => setForm(emptyForm)}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
