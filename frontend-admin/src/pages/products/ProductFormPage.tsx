import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../../api/categories";
import {
  ProductImage,
  ProductInput,
  createProduct,
  fetchProduct,
  updateProduct,
} from "../../api/products";
import { ImageUploader } from "../../components/ImageUploader";

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.parentCategory ? `↳ ${c.name}` : c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images (first image = thumbnail)</label>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price (optional, not shown on site yet)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Show in Trending
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="bg-black text-white px-5 py-2 rounded-md text-sm"
          >
            {saveMutation.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-5 py-2 rounded-md text-sm border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
