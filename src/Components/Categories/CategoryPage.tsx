import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MoonLoader from "react-spinners/MoonLoader";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import SearchSection02Image01 from "../../assets/search_section02_image01.png";
import SearchSection02Image02 from "../../assets/search_section02_image02.png";
import SearchSection02Image03 from "../../assets/Luxury_Bed_Set.png";
import "swiper/swiper-bundle.css"; // For Swiper 6 and above
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion"; // Import motion
import EnquireNowBtn from "@/Components/EnquireNowBtn";
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
  const url = `http://localhost:9000/store/products?category_id=${category_id}`;

  const response = await fetch(url, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

const fetchProducts = async () => {
  const response = await fetch(
    "http://localhost:9000/store/product-categories",
    {
      headers: {
        "x-publishable-api-key": import.meta.env.VITE_API_KEY, // ✅ Use environment variable
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch products");
  return response.json();
};

interface Category {
  id: number;
  name: string;
  handle: string;
  category_children?: Category[];
}

interface Bestseller {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string;
}
const CategoryPage = () => {
  // Hooks called unconditionally at the top
  const { category, subCategory, category_id } = useParams<{
    category: string;
    subCategory?: string;
    category_id?: string;
  }>();

  const { data, isLoading, error } = useQuery<{ products: Product[] }>(
    ["categoryProducts", category, subCategory],
    () => fetchCategoryProducts(category_id)
  );

  const { data: menudata, isLoading: menuLoading } = useQuery<{
    product_categories: Category[];
  }>(["products"], fetchProducts);

  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>(
    {}
  );
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Now perform conditional rendering after all hooks are declared
  if (isLoading && menuLoading) {
    return (
      <div className="w-screen flex justify-center items-center h-[80vh]">
        <MoonLoader />
      </div>
    );
  }
  if (error) return <p>Error loading products.</p>;

  const menuList = menudata?.product_categories.filter(
    (category) => category.category_children?.length
  );

  const toggleMenu = (index: number) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleMobileCategory = (category: string) => {
    setMobileCategory((prev) => (prev === category ? null : category));
  };

  const BestsellersList: Bestseller[] = [
    {
      id: 1,
      title: "Golden Vanity Desk",
      subtitle: "Elegant and Functional",
      price: 900,
      imageUrl: SearchSection02Image01,
    },
    {
      id: 2,
      title: "Luxury Dining Chairs",
      subtitle: "Comfortable and Stylish",
      price: 900,
      imageUrl: SearchSection02Image02,
    },
    {
      id: 3,
      title: "Luxury Bed Set",
      subtitle: "Comfortable and Stylish",
      price: 800,
      imageUrl: SearchSection02Image03,
    },
  ];

  return (
    <main className="flex-grow box-border font-Poppins">
      {/* Mobile Dropdown */}
      <div className="md:hidden w-full mt-3 block px-4">
        <div className="bg-white flex flex-col border p-3 px-4 rounded-2xl">
          <div
            className="flex items-center justify-between"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <p>Select Sub category</p>
            {openMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {openMenu && (
            <ul className="mt-3">
              {menuList?.map((item, index) => (
                <li key={index} className="mb-2">
                  <div
                    className={`flex items-center justify-between cursor-pointer ${
                      item.category_children ? "" : "hover:text-black"
                    }`}
                    onClick={() =>
                      item.category_children
                        ? toggleMobileCategory(item.name)
                        : null
                    }
                  >
                    <Link to={item.handle}>
                      <p className="text-text1 leading-text1">{item.name}</p>
                    </Link>
                    {item.category_children &&
                      (mobileCategory === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                  {item.category_children && mobileCategory === item.name && (
                    <ul className="pl-4 mt-2">
                      {item.category_children.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-1 text-sm text-gray-600 hover:text-black"
                        >
                          <a
                            href={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                          >
                            {subItem.name}
                          </a>
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
        {/* Desktop Sidebar */}
        <div className="w-2/12 p-4 bg-white flex-0 hidden md:block min-w-fit">
          <h2 className="text-xl font-bold mb-7 md:text-heading2 min-w-fit">
            Sub - Categories
          </h2>
          <ul>
            {menuList?.map((item, index) => (
              <li key={index} className="mb-4">
                <div
                  className={`flex items-center justify-between py-3 cursor-pointer ${
                    item.category_children ? "" : "hover:text-black"
                  }`}
                  onClick={() => item.category_children && toggleMenu(index)}
                >
                  <Link to={item.handle}>
                    <p className="text-text1 leading-text1">{item.name}</p>
                  </Link>

                  {item.category_children &&
                    (expandedMenus[index] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    ))}
                </div>
                {item.category_children && expandedMenus[index] && (
                  <ul className="pl-4 mt-2">
                    {item.category_children.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="py-1 text-sm text-gray-600 hover:text-black"
                      >
                        <a
                          href={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                        >
                          {subItem.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full flex flex-col">
          <h2 className="text-xl font-bold capitalize p-4 text-gray-600">
            {category} &gt; {subCategory}
          </h2>
          {(data?.products?.length ?? 0) > 0 ? (
            <div className=" bg-white p-4 grid grid-cols-2 md:grid-cols-4 gap-10 flex-1 w-full">
              {data?.products.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="flex flex-col gap-2 w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.1 + index * 0.1, // Staggered animation for each card
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="border border-solid border-black rounded-xl w-[270px] h-[190px] object-fill"
                    />
                

                  <h5 className="text-lg md:text-xl">{product.title}</h5>
                  <button className="bg-black text-white rounded-md p-2 w-fit md:text-base px-4">
                    <EnquireNowBtn />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-start w-full">
              <p className="w-full px-4">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#D3D3D3] w-full p-5 md:p-14 grid md:grid-cols-2 grid-cols-1 gap-2">
        <div className="flex flex-col items-start gap-2">
          <h2 className="md:text-[56px] md:leading-[64px] text-4xl">
            Explore our <br />
            Bestsellers
          </h2>
          <p className="text-sm md:text-heading3 md:leading-heading3">
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
            {/* Custom Navigation Buttons */}
            <button
              className={`custom-prev absolute top-1/2 -left-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full ${
                isBeginning ? "opacity-0" : ""
              }`}
              aria-label="Previous"
              disabled={isBeginning}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={`custom-next absolute top-1/2 -right-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full ${
                isEnd ? "opacity-0" : ""
              }`}
              aria-label="Next"
              disabled={isEnd}
            >
              <ChevronRight size={20} />
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={2} // Default to 2 slides
              navigation={{
                nextEl: ".custom-next", // Link to custom next button
                prevEl: ".custom-prev", // Link to custom prev button
              }}
              breakpoints={{
                // when window width is >= 320px
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                // when window width is >= 480px
                480: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
                // when window width is >= 640px
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
              {BestsellersList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 border rounded-lg bg-white shadow md:h-[342px] text-center flex flex-col items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto rounded"
                    />
                    <p className="text-lg mt-4 bg-black text-white w-fit rounded-lg px-2 p-1">
                      ${item.price}
                    </p>
                    <h3 className="text-lg text-center mt-2 md:text-heading3 md:leading-heading3">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-10">
                      {item.subtitle}
                    </p>
                  </div>
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
