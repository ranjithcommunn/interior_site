import React from "react";
import { motion } from "framer-motion";
import ProductImage01 from "../assets/product_view_image01.png";
import ProductImage02 from "../assets/product_view_image02.png";
import ProductImage03 from "../assets/product_view_image03.png";
import ProductImage04 from "../assets/product_view_image04.png";
import ProductImage05 from "../assets/product_view_image05.png";
import designerProfile01 from "../assets/designer_Profile01.png";
import EnquireNowBtn from "@/Components/EnquireNowBtn";

// Define the type for related product data
interface RelatedProduct {
  id: number;
  name: string;
  imageUrl: string;
}

const relatedProductsData: RelatedProduct[] = [
  {
    id: 1,
    name: "Velvet Armchair",
    imageUrl: ProductImage02,
  },
  {
    id: 2,
    name: "Marble Coffee Table",
    imageUrl: ProductImage03,
  },
  {
    id: 3,
    name: "Designer Leather Sofa",
    imageUrl: ProductImage04,
  },
  {
    id: 4,
    name: "Wooden Dining Table Set",
    imageUrl: ProductImage05,
  },
];

const ProductViewPage: React.FC = () => {
  return (
    <main className="box-border px-5 md:px-20">
      <section className="flex flex-col md:flex-row my-8 gap-6">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={ProductImage01} alt="Product" />
        </motion.div>

        {/* Product Details */}
        <div className="flex flex-col items-start gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold">Bedroom</h3>
            <div className="flex items-center gap-3 mt-4">
              <div className="rounded-full">
                <img src={designerProfile01} alt="profile" />
              </div>
              <div>
                <p className="text-xs">Designer</p>
                <p className="text-base">LuxuryLiving123</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-[65%]"
          >
            Discover the epitome of luxury living with our exquisite furniture
            collection. Embrace the elegance and sophistication in every piece.
            Bring home the luxury you deserve today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-3 w-full"
          >
            <p className="text-sm">Customisation Available</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black md:w-72 w-full rounded-lg p-2 text-white text-sm mt-1"
            >
              <EnquireNowBtn />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Related Products Section */}
      <motion.section
        className="my-6 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="font-bold text-xl">Other related products</h3>
        <div className="grid md:grid-cols-4 mt-4">
          {relatedProductsData.map((item, index) => (
            <motion.div
              key={item.id} // Use item.id as the key
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
              className="bg-[#D3D3D3] flex flex-col items-center box-border w-fit rounded-lg"
            >
              <img src={item.imageUrl} alt="product image" />
              <div className="w-full text-center px-4 py-6 flex flex-col items-center">
                <h4 className="font-bold text-md mb-3">{item.name}</h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white rounded-md w-full p-2"
                >
                  View Details
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </main>
  );
};

export default ProductViewPage;
