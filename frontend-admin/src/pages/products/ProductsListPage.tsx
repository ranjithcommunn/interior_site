import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProducts } from "../../api/products";
import { fetchCategories } from "../../api/categories";

export const ProductsListPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const { data, isLoading } = useQuery({
    queryKey: ["products", { search, category, page, limit }],
    queryFn: () => fetchProducts({ search: search || undefined, category: category || undefined, page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/products/new" className="bg-black text-white px-4 py-2 rounded-md text-sm">
          + Add Product
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border rounded-md p-2 text-sm flex-1 max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="border rounded-md p-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Active</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-3" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : (
              data?.products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    {p.thumbnail && <img src={p.thumbnail} alt="" className="w-12 h-12 object-cover rounded" />}
                  </td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{typeof p.category === "object" ? p.category.name : ""}</td>
                  <td className="p-3">{p.isFeatured ? "Yes" : "-"}</td>
                  <td className="p-3">{p.isActive ? "Yes" : "No"}</td>
                  <td className="p-3 text-right">
                    <Link to={`/products/${p._id}/edit`} className="text-blue-600 hover:underline mr-3">
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"?`)) deleteMutation.mutate(p._id);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-md ${p === page ? "bg-black text-white" : "bg-white"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
