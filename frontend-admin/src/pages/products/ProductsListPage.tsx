import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Star } from "lucide-react";
import { deleteProduct, fetchProducts } from "../../api/products";
import { fetchCategories } from "../../api/categories";
import { Dropdown } from "../../components/Dropdown";
import { Pagination } from "../../components/Pagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export const ProductsListPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });

  const topLevelCategories = categories.filter((c) => !c.parentCategory);
  const subCategoriesOfSelected = category
    ? categories.filter((c) => c.parentCategory === category)
    : categories.filter((c) => c.parentCategory);

  const effectiveCategory = subCategory || category;

  const { data, isLoading } = useQuery({
    queryKey: ["products", { effectiveCategory, search, page, limit }],
    queryFn: () =>
      fetchProducts({ search: search || undefined, category: effectiveCategory || undefined, page, limit }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteTarget(null);
    },
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {isLoading ? "Loading..." : `${data?.total ?? 0} product${data?.total === 1 ? "" : "s"}`}
        </p>
        <Link
          to="/products/new"
          className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-gray-900 transition-colors"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border border-gray-200 rounded-lg p-2.5 pl-9 text-sm w-full bg-white outline-none focus:border-black transition-colors"
          />
        </div>
        <Dropdown
          value={category}
          onChange={(value) => {
            setCategory(value);
            setSubCategory("");
            setPage(1);
          }}
          placeholder="All categories"
          options={[
            { value: "", label: "All categories" },
            ...topLevelCategories.map((c) => ({ value: c._id, label: c.name })),
          ]}
        />
        <Dropdown
          value={subCategory}
          onChange={(value) => {
            setSubCategory(value);
            setPage(1);
          }}
          placeholder="All sub categories"
          options={[
            { value: "", label: "All sub categories" },
            ...subCategoriesOfSelected.map((c) => ({ value: c._id, label: c.name })),
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 text-left text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Sub Category</th>
              <th className="p-4">Featured</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan={6}>
                  Loading...
                </td>
              </tr>
            ) : data?.products.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-gray-400" colSpan={6}>
                  No products found.
                </td>
              </tr>
            ) : (
              data?.products.map((p) => {
                const cat = typeof p.category === "object" ? p.category : null;
                const parent =
                  cat?.parentCategory && typeof cat.parentCategory === "object" ? cat.parentCategory : null;
                const topLevelName = parent ? parent.name : cat?.name ?? "";
                const subName = parent ? cat?.name : null;
                return (
                <tr key={p._id} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {p.thumbnail ? (
                        <img src={p.thumbnail} alt="" className="w-11 h-11 object-cover rounded-lg" />
                      ) : (
                        <div className="w-11 h-11 rounded-lg bg-gray-100" />
                      )}
                      <span className="font-medium text-gray-800">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{topLevelName}</td>
                  <td className="p-4 text-gray-500">{subName ?? "—"}</td>
                  <td className="p-4">
                    {p.isFeatured && (
                      <Star size={15} className="text-amber-500 fill-amber-500" />
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        p.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/products/${p._id}/edit`}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget({ id: p._id, title: p.title })}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmDialog
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        description="This product will be permanently removed."
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
