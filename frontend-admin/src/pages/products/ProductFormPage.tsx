import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { fetchCategories } from "../../api/categories";
import {
  ProductImage,
  ProductInput,
  createProduct,
  fetchProduct,
  updateProduct,
} from "../../api/products";
import { ImageUploader } from "../../components/ImageUploader";
import { Checkbox } from "../../components/Checkbox";
import { Dropdown } from "../../components/Dropdown";

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: existingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id as string),
    enabled: isEdit,
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (existingProduct) {
      setTitle(existingProduct.title);
      setDescription(existingProduct.description);
      setCategory(
        typeof existingProduct.category === "object" ? existingProduct.category._id : existingProduct.category
      );
      setImages(existingProduct.images);
      setIsFeatured(existingProduct.isFeatured);
      setIsActive(existingProduct.isActive);
      setPrice(existingProduct.price ? String(existingProduct.price) : "");
    }
  }, [existingProduct]);

  const saveMutation = useMutation({
    mutationFn: (input: ProductInput) =>
      isEdit ? updateProduct(id as string, input) : createProduct(input),
    onSuccess: () => navigate("/products"),
    onError: () => setError("Failed to save product. Check required fields and try again."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    saveMutation.mutate({
      title,
      description,
      category,
      images,
      isFeatured,
      isActive,
      price: price ? Number(price) : undefined,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black mb-4 transition-colors shrink-0"
      >
        <ArrowLeft size={15} /> Back to Products
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 flex flex-col min-h-0"
      >
        <h2 className="font-semibold text-gray-800 mb-5 shrink-0">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Category</label>
                <Dropdown
                  fullWidth
                  value={category}
                  onChange={setCategory}
                  placeholder="Select a category"
                  options={categories.map((c) => ({
                    value: c._id,
                    label: c.parentCategory ? `↳ ${c.name}` : c.name,
                  }))}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Price (optional)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            <div className="flex gap-6">
              <Checkbox checked={isFeatured} onChange={setIsFeatured} label="Show in Trending" />
              <Checkbox checked={isActive} onChange={setIsActive} label="Active" />
            </div>
          </div>

          <div className="flex flex-col min-h-0">
            <label className="block text-xs font-medium text-gray-500 mb-1.5 shrink-0">
              Images (first image = thumbnail)
            </label>
            <div className="flex-1 overflow-y-auto">
              <ImageUploader images={images} onChange={setImages} />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4 shrink-0">{error}</p>}

        <div className="flex gap-2 pt-4 shrink-0">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-60"
          >
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-5 py-2.5 rounded-lg text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
