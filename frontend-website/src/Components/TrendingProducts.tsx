import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TrendingProductsIcon from "../assets/TrendingProducts.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";


export interface ProductOptionValue {
  id: string;
  value: string;

  option_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  option?: ProductOption;
}

export interface ProductOption {
  id: string;
  title: string;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  values?: ProductOptionValue[];
}

export interface ProductImage {
  id: string;
  url: string;
  rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  variant_rank: number;
  product_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  options: ProductOptionValue[];
}

export interface Product {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  handle: string;
  is_giftcard: boolean;
  discountable: boolean;
  thumbnail: string;
  collection_id: string | null;
  type_id: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  created_at: string;
  updated_at: string;
  options: ProductOption[];
  images: ProductImage[];
  variants: ProductVariant[];
}

interface RemoteCategory {
  id: string;
  name: string;
  handle: string | null;
  parent_category_id: string | null;
}

const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMoreLink, setViewMoreLink] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const headers = {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/store/products?featured=true&limit=12`,
          { headers }
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchViewMoreLink = async () => {
      try {
        const response = await axios.get(`${backendUrl}/store/product-categories`, {
          headers,
        });
        const categories: RemoteCategory[] = response.data.product_categories || [];
        const topLevel = categories.filter((c) => c.parent_category_id === null);
        const livingRoom = topLevel.find((c) => c.handle === "living");
        const target = livingRoom || topLevel[0];
        if (target) {
          setViewMoreLink(`/${target.handle}/${target.id}`);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchViewMoreLink();
  }, []);

  return (
    <motion.section
      className="md:px-20 px-5 py-14 md:py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <motion.div
          className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          <img
            src={TrendingProductsIcon}
            alt="Trending Products Icon"
            className="w-5 h-5"
          />
        </motion.div>
        <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase">
          Top Picks
        </span>
        <h2 className="text-2xl md:text-heading1 md:leading-heading1 font-bold font-Poppins">
          Trending Products
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-7 w-full">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            thumbnail={product.thumbnail}
            badge="Trending"
            delay={0.04 * index}
          />
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-10">
        <button
          className="bg-black text-white rounded-lg px-8 py-3 text-sm md:text-button2 md:leading-button2 hover:bg-gray-900 transition-colors"
          onClick={() => {
            navigate(viewMoreLink);
          }}
        >
          View More
        </button>
      </div>
    </motion.section>
  );
};

export default TrendingProducts;