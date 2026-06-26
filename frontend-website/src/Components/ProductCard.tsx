import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  thumbnail: string;
  badge?: string;
  delay?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, thumbnail, badge, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="group flex flex-col cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square bg-[#f5f5f5] rounded-2xl overflow-hidden border border-gray-100 group-hover:border-gray-200 group-hover:shadow-lg transition-all duration-300">
        {badge && (
          <span className="absolute top-3 left-3 z-10 bg-black text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">
            {badge}
          </span>
        )}

        <img
          src={thumbnail || "https://via.placeholder.com/400"}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply p-5 transition-transform duration-500 ease-out group-hover:scale-110"
        />

        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center opacity-100 md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight size={16} />
        </div>
      </div>

      <h3 className="text-sm md:text-base font-medium text-gray-800 mt-3 line-clamp-1 group-hover:text-black">
        {title}
      </h3>
    </motion.div>
  );
};

export default ProductCard;
