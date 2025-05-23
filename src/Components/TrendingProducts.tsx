import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TrendingProductsIcon from "../assets/TrendingProducts.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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

const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(
          `${backendUrl}/store/products?limit=12`,
          {
            headers: {
              "x-publishable-api-key": import.meta.env.VITE_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <motion.section
      className="md:px-20 px-5 mb-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="bg-[#D3D3D3] p-3 rounded-md flex gap-3 items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <img
          src={TrendingProductsIcon}
          alt="Trending Products Icon"
          className="w-5 h-5 ml-5"
        />
        <h2 className="text-lg md:text-heading2 md:leading-heading2 font-bold font-Poppins">
          Trending Products
        </h2>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8 w-full">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative bg-[#D3D3D3] cursor-pointer rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/product/${product.id}`)}
          >
            {/* Product Image */}
            <motion.div
              className="w-full aspect-[4/3] overflow-hidden bg-white"
              
              transition={{ duration: 0.3 }}
            >
              <img
                src={product.thumbnail || "https://via.placeholder.com/150"}
                alt={product.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </motion.div>



            {/* View More Button */}
            <div className="hidden md:flex absolute cursor-pointer md:text-button2 md:leading-button2 font-Poppins top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] md:text-base px-3 md:px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100 min-w-fit">
               <p className="min-w-fit text-[9px] md:text-[12px]">View Details</p>
            </div>

            {/* Product Name */}
            <div className="p-4">
              <h3 className="text-sm md:text-text1 md:leading-text1 text-gray-800 font-Poppins">
                {product.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-4">
        <button
          className="bg-black text-white rounded-md w-fit p-2 md:text-button2 md:leading-button2 px-4 "
          onClick={() => {
            navigate(`/living/sofas/pcat_01JMM5XCCR5XDCDQ6Z0M1A9M0W`);
          }}
        >
          View More
        </button>
      </div>
    </motion.section>
  );
};

export default TrendingProducts;