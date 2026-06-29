import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, PackageSearch } from "lucide-react";
import ProductCard from "../Components/ProductCard";
import { ProductGridSkeleton } from "../Components/Skeleton";
import Pagination from "../Components/Pagination";
import Seo from "../Components/Seo";

interface Product {
  id: string;
  title: string;
  thumbnail: string;
}

interface Category {
  id: string;
  name: string;
  handle: string | null;
  parent_category_id: string | null;
  category_children: Category[];
}

const LIMIT = 12;

const sortOptions = [
  { value: "", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

const fetchCategories = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/product-categories`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

const fetchProducts = async (params: {
  category_id?: string;
  search?: string;
  sort?: string;
  page: number;
  limit: number;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const query = new URLSearchParams();
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  query.set("page", String(params.page));
  query.set("limit", String(params.limit));

  const response = await fetch(`${backendUrl}/store/products?${query.toString()}`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

const Shop: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const { data: categoryData } = useQuery<{ product_categories: Category[] }>(
    ["productCategories"],
    fetchCategories
  );

  const topLevelCategories = categoryData?.product_categories ?? [];
  const subCategoriesOfSelected =
    topLevelCategories.find((c) => c.id === category)?.category_children ?? [];

  const effectiveCategoryId = subCategory || category;

  const { data, isLoading } = useQuery<{ products: Product[]; total: number }>(
    ["shopProducts", { effectiveCategoryId, search, sort, page }],
    () =>
      fetchProducts({
        category_id: effectiveCategoryId || undefined,
        search: search || undefined,
        sort: sort || undefined,
        page,
        limit: LIMIT,
      }),
    { keepPreviousData: true }
  );

  const products = data?.products ?? [];
  const totalPages = data ? Math.max(1, Math.ceil(data.total / LIMIT)) : 1;

  return (
    <main className="font-Poppins bg-white">
      <Seo
        title="Shop All Products"
        description="Browse Vibrer's full catalogue of premium, customisable furniture. Filter by category and sort to find exactly what you're looking for."
        keywords="shop furniture online, Vibrer all products, furniture catalogue, buy furniture online India"
        path="/shop"
      />

      {/* Header */}
      <section className="flex items-center justify-center text-center flex-col gap-3 pt-16 pb-10 px-5 md:px-20 bg-[#FAFAFA]">
        <motion.span
          className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Full Catalogue
        </motion.span>
        <motion.h1
          className="font-bold text-3xl md:text-heading1 md:leading-heading1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Shop All Products
        </motion.h1>
        <motion.p
          className="md:w-[55%] text-gray-600 md:text-heading3 md:leading-heading3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Browse our complete furniture collection and filter by category to
          find the perfect piece for your space.
        </motion.p>
      </section>

      {/* Filters */}
      <section className="px-5 md:px-20 pt-10">
        <div className="flex flex-wrap justify-center items-center gap-3 max-w-4xl mx-auto">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm w-full outline-none focus:border-black transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
                setPage(1);
              }}
              className="appearance-none border border-gray-200 rounded-lg pl-3.5 pr-9 py-2.5 text-sm outline-none focus:border-black transition-colors bg-white min-w-[160px]"
            >
              <option value="">All Categories</option>
              {topLevelCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {subCategoriesOfSelected.length > 0 && (
            <div className="relative">
              <select
                value={subCategory}
                onChange={(e) => {
                  setSubCategory(e.target.value);
                  setPage(1);
                }}
                className="appearance-none border border-gray-200 rounded-lg pl-3.5 pr-9 py-2.5 text-sm outline-none focus:border-black transition-colors bg-white min-w-[160px]"
              >
                <option value="">All Sub Categories</option>
                {subCategoriesOfSelected.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="appearance-none border border-gray-200 rounded-lg pl-3.5 pr-9 py-2.5 text-sm outline-none focus:border-black transition-colors bg-white min-w-[170px]"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {!isLoading && (
          <p className="text-sm text-gray-500 mt-4">
            {`${data?.total ?? 0} product${data?.total === 1 ? "" : "s"} found`}
          </p>
        )}
      </section>

      {/* Grid */}
      <section className="px-5 md:px-20 py-8 pb-16">
        {isLoading ? (
          <ProductGridSkeleton count={LIMIT} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 w-full">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                thumbnail={product.thumbnail}
                delay={0.04 * index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageSearch size={26} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">No products found</p>
            <p className="text-sm text-gray-500 max-w-xs">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </main>
  );
};

export default Shop;
