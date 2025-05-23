import React from "react";
import { motion } from "framer-motion";
import EnquireNowBtn from "@/Components/EnquireNowBtn";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import MoonLoader from "react-spinners/MoonLoader";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
  collection_id: string | null;
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
  collection_id: string | null | undefined
) => {
  if (!collection_id) {
    return { products: [] };
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const url = `${backendUrl}/store/products?collection_id=${collection_id}&limit=9`;

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
  const navigate = useNavigate();
  const { product_id, category, subCategory } = useParams<{
    product_id?: string;
    category: string;
    subCategory: string;
  }>();

  const { data, isLoading, error } = useQuery<{ product: Product }>(
    ["productInfo", product_id],
    () => fetchProductsInfo(product_id),
    { enabled: !!product_id }
  );

  // console.log(data);

  const collection_id = data?.product?.collection_id;

  const { data: relatedProductsData, error: relatedProductsError } = useQuery<{
    products: Product[];
  }>(
    ["relatedProducts", collection_id],
    () => fetchRelatedProducts(collection_id),
    { enabled: !!collection_id }
  );

  const filteredData = relatedProductsData?.products?.filter(
    (each) => each.id !== data?.product?.id
  );

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[80vh]">
        <MoonLoader />
      </div>
    );
  }

  if (error || relatedProductsError) {
    return <p>Error loading products.</p>;
  }

  return (
    <main className="box-border px-5 md:px-20 font-Poppins">
      <section className="flex flex-col md:flex-row my-8 gap-6">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full min-w-0 md:min-w-[300px] max-w-fit px-4 h-[300px] overflow-hidden flex items-center justify-center bg-[#f5f5f5] rounded-[12px]"
        >
          <img
            src={data?.product?.thumbnail}
            alt={data?.product?.title}
            className="object-contain w-full h-full mix-blend-multiply"
          />
        </motion.div>

        {/* Product Details */}
        <div className="flex flex-col items-start gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold md:text-heading1 md:leading-heading1">
              {data?.product?.title}
            </h3>
            <div className="flex items-center gap-3 mt-4">
              {/* <div className="rounded-full">
                <img src={designerProfile01} alt="profile" />
              </div> */}
              <div>
                <p className="text-xs">{subCategory}</p>
                <p className="text-base capitalize">{category}</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full md:w-[65%] text-base"
          >
            {data?.product?.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-3 w-full"
          >
            <p className="text-text1">Customisation Available</p>
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
      {filteredData && filteredData?.length > 0 && (
        <motion.section
          className="my-6 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="font-bold text-xl md:text-heading1 md:leading-heading1">
            Other related products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-14">
            {filteredData?.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                className="bg-[#D3D3D3] flex flex-col items-center min-w-full max-w-fit box-border rounded-xl cursor-pointer mt-3 overflow-hidden"
                onClick={() => {
                  navigate(`/product/${item.id}`);
                }}
              >
                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-[300px] flex items-center justify-center bg-[#f5f5f5] rounded-t-xl overflow-hidden"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="object-contain w-full h-full mix-blend-multiply"
                  />
                </motion.div>

                {/* Title & Button */}
                <div className="w-full text-center px-4 py-6 flex flex-col items-center justify-center">
                  <h4 className="font-bold text-md md:text-xl mb-3">
                    {item.title}
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white rounded-md w-full p-2 md:text-button2 md:leading-button2"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent parent click navigation
                      navigate(`/product/${item.id}`);
                    }}
                  >
                    View Details
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Render "No related products" message if filteredData is empty */}
      {filteredData?.length === 0 && (
        <motion.section
          className="my-6 hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="font-bold text-xl md:text-heading1 md:leading-heading1">
            Other related products
          </h3>
          <p className="text-gray-600">No related products found.</p>
        </motion.section>
      )}
    </main>
  );
};

export default ProductViewPage;
