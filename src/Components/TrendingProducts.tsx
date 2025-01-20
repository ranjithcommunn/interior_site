import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import TrendingProductsIcon from "../assets/TrendingProducts.png";
import LuxuryBedSet from "../assets/Luxury_Bed_Set.png";
import LuxurySofaSet from "../assets/Luxury_Sofa_Set.png";
import LuxuryDiningTable from "../assets/Luxury_Dining_Table.png";
import Elegantcandleset from "../assets/Elegant_candle_set.png";
import Elegantsofaset from "../assets/Elegant_sofa_set.png";
import Fruitplatter from "../assets/Fruit_platter.png";
import EnquireNowBtn from "./EnquireNowBtn";

// Define the type for the product items
interface Product {
  id: number;
  name: string;
  imageUrl: string;
}

const TrendingProducts: React.FC = () => {
  const TrendingProductsList: Product[] = [
    { id: 1, name: "Luxury Bed Set", imageUrl: LuxuryBedSet },
    { id: 2, name: "Luxury Sofa Set", imageUrl: LuxurySofaSet },
    { id: 3, name: "Luxury Dining Table", imageUrl: LuxuryDiningTable },
    { id: 4, name: "Luxury Bed Set", imageUrl: LuxuryBedSet },
    { id: 5, name: "Elegant Candle Set", imageUrl: Elegantcandleset },
    { id: 6, name: "Elegant Sofa Set", imageUrl: Elegantsofaset },
    { id: 7, name: "Fruit Platter", imageUrl: Fruitplatter },
    { id: 8, name: "Elegant Candle Set", imageUrl: Elegantcandleset },
  ];

  return (
    <motion.section
      className="md:px-20 px-5 mb-10"
      initial={{ opacity: 0, y: 50 }} // Initial state
      animate={{ opacity: 1, y: 0 }} // Final state
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
          className="w-6 h-6"
        />
        <h2 className="text-lg md:text-xl font-bold font-Poppins">Trending Products</h2>
      </motion.div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8">
        {TrendingProductsList.map((product, index) => (
          <motion.div
            key={product.id}
            className="relative bg-[#D3D3D3] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1 + index * 0.1, // Staggered animation
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }} // Enlarge on hover
          >
            {/* Product Image */}
            <motion.img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-70"
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.3 }}
            />

            {/* View More Button */}
            <button
              className="absolute font-Poppins top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] md:text-base px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-100"
            >
              <EnquireNowBtn />
            </button>
            

            {/* Product Name */}
            <div className="p-4">
              <h3 className="text-sm md:text-base text-gray-800 font-Poppins">
                {product.name}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default TrendingProducts;
