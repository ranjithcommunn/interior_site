import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import EnquireNowBtn from "@/Components/EnquireNowBtn";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import ProductCard from "@/Components/ProductCard";
import { Skeleton, ProductGridSkeleton } from "@/Components/Skeleton";

interface ProductImage {
  url: string;
  rank: number;
}

interface CategoryRef {
  id: string;
  name: string;
  handle: string | null;
}

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
  category_id: string | null;
  category: (CategoryRef & { parent: CategoryRef | null }) | null;
  images: ProductImage[];
}

const fetchProductsInfo = async (product_id: string | undefined) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const url = `${backendUrl}/store/products/${product_id}`;

  const response = await fetch(url, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch product info:", response.status);
    throw new Error("Failed to fetch product information.");
  }
  return response.json();
};

const fetchRelatedProducts = async (
  category_id: string | null | undefined
) => {
  if (!category_id) {
    return { products: [] };
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const url = `${backendUrl}/store/products?category_id=${category_id}&limit=9`;

  const response = await fetch(url, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch related products:", response.status);
    throw new Error("Failed to fetch related products.");
  }
  return response.json();
};

const ProductViewPage: React.FC = () => {
  const { product_id } = useParams<{ product_id?: string }>();
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading, error } = useQuery<{ product: Product }>(
    ["productInfo", product_id],
    () => fetchProductsInfo(product_id),
    { enabled: !!product_id }
  );

  const product = data?.product;
  const category_id = product?.category_id;

  const { data: relatedProductsData, error: relatedProductsError } = useQuery<{
    products: Product[];
  }>(
    ["relatedProducts", category_id],
    () => fetchRelatedProducts(category_id),
    { enabled: !!category_id }
  );

  const filteredData = relatedProductsData?.products?.filter(
    (each) => each.id !== product?.id
  );

  if (isLoading) {
    return (
      <main className="box-border px-5 md:px-20 py-6 font-Poppins">
        <Skeleton className="h-4 w-64 mb-6" />
        <section className="flex flex-col md:flex-row gap-8 lg:gap-12">
          <div className="w-full md:w-[45%] lg:w-[40%] shrink-0">
            <Skeleton className="w-full aspect-square rounded-2xl" />
            <div className="flex gap-3 mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-16 h-16 rounded-lg shrink-0" />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 flex-1 w-full">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-full md:w-72 mt-3" />
          </div>
        </section>
        <div className="my-12">
          <Skeleton className="h-7 w-56 mb-6" />
          <ProductGridSkeleton count={4} />
        </div>
      </main>
    );
  }

  if (error || relatedProductsError) {
    return <p>Error loading products.</p>;
  }

  const gallery =
    product?.images && product.images.length > 0
      ? [...product.images].sort((a, b) => a.rank - b.rank).map((img) => img.url)
      : product?.thumbnail
      ? [product.thumbnail]
      : [];

  const parentCategory = product?.category?.parent;
  const currentCategory = product?.category;

  return (
    <main className="box-border px-5 md:px-20 py-6 font-Poppins">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        {parentCategory && (
          <>
            <ChevronRight size={14} />
            <Link
              to={`/${parentCategory.handle}/${parentCategory.id}`}
              className="hover:text-black transition-colors"
            >
              {parentCategory.name}
            </Link>
          </>
        )}
        {currentCategory && (
          <>
            <ChevronRight size={14} />
            <Link
              to={
                parentCategory
                  ? `/${parentCategory.handle}/${currentCategory.handle}/${currentCategory.id}`
                  : `/${currentCategory.handle}/${currentCategory.id}`
              }
              className="hover:text-black transition-colors"
            >
              {currentCategory.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-black font-medium line-clamp-1">{product?.title}</span>
      </nav>

      <section className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Product Gallery */}
        <div className="w-full md:w-[45%] lg:w-[40%] shrink-0">
          <motion.div
            key={gallery[activeImage]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full aspect-square overflow-hidden flex items-center justify-center bg-[#f5f5f5] rounded-2xl"
          >
            {gallery[activeImage] ? (
              <img
                src={gallery[activeImage]}
                alt={product?.title}
                className="object-contain w-full h-full mix-blend-multiply"
              />
            ) : (
              <span className="text-gray-400 text-sm">No image available</span>
            )}
          </motion.div>

          {gallery.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {gallery.map((url, index) => (
                <button
                  key={url + index}
                  onClick={() => setActiveImage(index)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#f5f5f5] border-2 transition-colors ${
                    activeImage === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product?.title} thumbnail ${index + 1}`}
                    className="object-contain w-full h-full mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col items-start gap-4 flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {currentCategory && (
              <p className="text-sm text-gray-500 mb-1">
                {parentCategory ? `${parentCategory.name} / ` : ""}
                {currentCategory.name}
              </p>
            )}
            <h1 className="text-2xl font-bold md:text-heading1 md:leading-heading1">
              {product?.title}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-[85%] text-base text-gray-600 leading-relaxed"
          >
            {product?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-3 w-full"
          >
            <p className="text-text1 font-medium">Customisation Available</p>
            <div className="bg-black md:w-72 w-full rounded-lg py-3 px-4 text-white mt-2 hover:bg-gray-900 transition-colors">
              <EnquireNowBtn productId={product?.id} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products Section */}
      {filteredData && filteredData?.length > 0 && (
        <motion.section
          className="my-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-bold text-xl md:text-heading2 md:leading-heading2 mb-6">
            Other related products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
            {filteredData?.map((item, index) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnail={item.thumbnail}
                delay={0.05 * index}
              />
            ))}
          </div>
        </motion.section>
      )}

      {filteredData?.length === 0 && (
        <motion.section
          className="my-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-bold text-xl md:text-heading2 md:leading-heading2 mb-2">
            Other related products
          </h3>
          <p className="text-gray-500">No related products found.</p>
        </motion.section>
      )}
    </main>
  );
};

export default ProductViewPage;
