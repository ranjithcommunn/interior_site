import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@medusajs/medusa";
import TrendingProductsIcon from "../assets/TrendingProducts.png";
import EnquireNowBtn from "./EnquireNowBtn";
import axios from "axios";
import { BackendURL } from "@/config/config";

const TrendingProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BackendURL}/store/products`, {
          headers: {
            "x-publishable-api-key": 'pk_21d2425416a482a0021c5e16f30a21cad28f320cfb33ae3f5e004820b6926751',
          },
        });
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative bg-[#D3D3D3] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Product Image */}
            <motion.img
              src={product.thumbnail || "https://via.placeholder.com/150"}
              alt={product.title}
              className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-70"
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            />

            {/* View More Button */}
            <div className="absolute md:text-button2 md:leading-button2 font-Poppins top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] md:text-base px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100">
              <EnquireNowBtn />
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
    </motion.section>
  );
};

export default TrendingProducts;