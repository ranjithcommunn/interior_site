import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MoonLoader from "react-spinners/MoonLoader";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  thumbnail: string;
}

const fetchCategoryProducts = async (category_id: string | undefined) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const url = `${backendUrl}/store/products?category_id=${category_id}`;

  const response = await fetch(url, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch category products:", response.status);
    throw new Error("Failed to fetch products for this category.");
  }
  return response.json();
};

const fetchProductCategories = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/product-categories`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch product categories:", response.status);
    throw new Error("Failed to fetch product categories.");
  }
  return response.json();
};

interface Category {
  id: number;
  name: string;
  handle: string | null;
  parent_category_id: string | null;
  category_children: Category[];
}

const CategoryPage = () => {
  const { category, subCategory, category_id } = useParams<{
    category: string;
    subCategory?: string;
    category_id?: string;
  }>();

  const {
    data: categoryProductsData,
    isLoading: categoryProductsLoading,
    error: categoryProductsError,
  } = useQuery<{ products: Product[] }>(
    ["categoryProducts", category_id],
    () => fetchCategoryProducts(category_id),
    { enabled: !!category_id }
  );

  const {
    data: menuData,
    isLoading: menuLoading,
    error: menuError,
  } = useQuery<{ product_categories: Category[] }>(
    ["productCategories"],
    fetchProductCategories
  );

  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(
    {}
  );
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const navigate = useNavigate();

  if (categoryProductsLoading || menuLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[80vh]">
        <MoonLoader />
      </div>
    );
  }

  if (categoryProductsError) {
    return <p>Error loading products for this category.</p>;
  }

  if (menuError) {
    return <p>Error loading category menu.</p>;
  }

  const menuList = menuData?.product_categories.filter(
    (cat) =>
      cat.category_children?.length > 0 || cat.parent_category_id === null
  );

  const toggleMenu = (index: number) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMobileCategory = (catName: string) => {
    setMobileCategory((prev) => (prev === catName ? null : catName));
  };

  function formatProductName(productName: string): string {
    return productName.replace(/-/g, " ");
  }

  const BestsellersProducts = [
    categoryProductsData?.products[0],
    categoryProductsData?.products[1],
    categoryProductsData?.products[2]
  ]



  return (
    <main className="flex-grow box-border font-Poppins">
      {/* Mobile Dropdown for Sub-categories */}
      <div className="md:hidden w-full mt-3 block px-4">
        <div className="bg-white flex flex-col border p-3 px-4 rounded-2xl">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
            aria-expanded={openMenu}
            aria-controls="mobile-category-menu"
          >
            <p className="text-text1 leading-text1">Select Sub category</p>
            {openMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openMenu && (
            <ul className="mt-3" id="mobile-category-menu">
              {menuList?.map((item) => (
                <li key={item.id} className="mb-2">
                  <div
                    className={`flex items-center justify-between cursor-pointer ${
                      item.category_children ? "" : "hover:text-black"
                    }`}
                    onClick={() => {
                      if (item.category_children) {
                        toggleMobileCategory(item.name);
                      } else {
                        navigate(`/${item.handle}`);
                        setOpenMenu(false);
                      }
                    }}
                    aria-expanded={mobileCategory === item.name}
                    aria-controls={`mobile-subcategory-list-${item.id}`}
                  >
                    <Link to={``}>
                      <p className="text-text1 leading-text1">{item.name}</p>
                    </Link>
                    {item.category_children.length > 0 &&
                      (mobileCategory === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                  {item.category_children && mobileCategory === item.name && (
                    <ul
                      className="pl-4 mt-2"
                      id={`mobile-subcategory-list-${item.id}`}
                    >
                      {item.category_children.map((subItem) => (
                       <li
                       key={subItem.id}
                       className="py-1 text-sm text-gray-600 hover:text-black"
                       onClick={() => {
                         navigate(`/${item.handle}/${subItem.handle}/${subItem.id}`);
                         setOpenMenu(false); 
                       }}
                     >
                       {subItem.name}
                     </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <section className="flex items-start justify-between py-5 w-full md:px-8">
        {/* Desktop Sidebar for Sub-categories */}
        <div className="w-2/12 p-4 bg-white flex-0 hidden md:block min-w-fit">
          <h2 className="text-xl font-bold mb-7 md:text-heading2 min-w-fit">
            Sub - Categories
          </h2>
          <ul aria-label="Desktop Subcategories">
            {menuList?.map((item, index) => (
              <li key={item.id} className="mb-4">
                <div
                  className={`flex items-center justify-between py-3 cursor-pointer ${
                    item.category_children ? "" : "hover:text-black"
                  }`}
                  onClick={() =>
                    item.category_children
                      ? toggleMenu(index)
                      : navigate(`/${item.handle}`)
                  }
                  aria-expanded={!!expandedMenus[index]}
                  aria-controls={`desktop-subcategory-list-${item.id}`}
                >
                  <Link
                    to={
                      item.category_children?.length > 0
                        ? `/${item.handle}/${item.category_children[0].handle}/${item.category_children[0].id}`
                        : `/${item.handle}/${item.id}`
                    }
                  >
                    <p className="text-text1 leading-text1">{item.name}</p>
                  </Link>
                  {item.category_children.length > 0 &&
                    (expandedMenus[index] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
                {item.category_children && expandedMenus[index] && (
                  <ul
                    className="pl-4 mt-2"
                    id={`desktop-subcategory-list-${item.id}`}
                  >
                    {item.category_children.map((subItem) => (
                      <li
                        key={subItem.id}
                        className="py-1 text-sm text-gray-600 hover:text-black"
                      >
                        <Link
                          to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        {/* Main Content Area */}
        <div className="w-full flex flex-col">
          <h2 className="text-xl font-bold capitalize p-4 text-gray-600">
            {category} &gt; {subCategory ? formatProductName(subCategory) : ""}
          </h2>

          {categoryProductsData &&
          categoryProductsData?.products?.length > 0 ? (
            <div className=" bg-white p-4 grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full">
              {categoryProductsData?.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex flex-col gap-2 w-full cursor-pointer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.1 + index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  onClick={() =>
                    navigate(
                      `/product/${subCategory}/${category}/${product.id}`
                    )
                  }
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="border border-solid border-black rounded-xl w-[270px] h-[190px] object-fill"
                  />
                  <h5 className="text-lg md:text-xl">{product.title}</h5>
                  {/* <button className="bg-black text-white rounded-md p-2 w-fit md:text-base px-4">
                    <EnquireNowBtn />
                  </button> */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-black text-white rounded-md w-fit p-2 md:text-button2 md:leading-button2 px-4"
                    onClick={() => {
                      navigate(`/product/${subCategory}/${category}/${product.id}`);
                    }}
                  >
                    View Details
                  </motion.button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-start w-full p-4">
              <p className="text-gray-600">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="bg-[#D3D3D3] w-full p-5 md:p-14 grid md:grid-cols-2 grid-cols-1 gap-2">
        <div className="flex flex-col items-start gap-2">
          <h2 className="md:text-[56px] md:leading-[64px] text-4xl">
            Explore our <br />
            Bestsellers
          </h2>
          <p className="text-sm md:text-heading3 md:leading-heading3 text-gray-700">
            Discover the epitome of luxury living with our exclusive furniture
            collection. Each piece is meticulously crafted to bring
            sophistication and elegance to your home. Our furniture is designed
            with premium materials and exquisite details, ensuring a luxurious
            experience for every room. Elevate your living space with Affordable
            Luxury for Every Home.
          </p>
        </div>
        <div className="md:mx-7 w-full">
          <div className="relative w-full p-5">
            {/* Custom Navigation Buttons for Bestsellers */}
            <button
              className={`custom-prev absolute top-1/2 -left-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full focus:outline-none ${
                isBeginning ? "opacity-0 cursor-default" : ""
              }`}
              aria-label="Previous Bestseller"
              disabled={isBeginning}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`custom-next absolute top-1/2 -right-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full focus:outline-none ${
                isEnd ? "opacity-0 cursor-default" : ""
              }`}
              aria-label="Next Bestseller"
              disabled={isEnd}
            >
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={2}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onInit={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
            >
              {BestsellersProducts.map((item) => (
                <SwiperSlide key={item?.id}>
                  <a href={`/product/${subCategory}/${category}/${item?.id}`} className="p-4 border rounded-lg bg-white shadow md:min-h-[341px] text-center !flex flex-col justify-center items-center">
                    <img
                      src={item?.thumbnail}
                      alt={item?.title}
                      className="w-full h-auto rounded object-cover"
                    />
                    {/* <p className="text-lg mt-4 bg-black text-white w-fit rounded-lg px-2 py-1">
                      ${item.price}
                    </p> */}
                    <h3 className="text-lg text-center  md:text-heading3 md:leading-heading3">
                      {item?.title}
                    </h3>
                    {/* <p className="text-sm text-gray-600 mb-4">
                      {item.}
                    </p> */}
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
