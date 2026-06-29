import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton, ProductGridSkeleton } from "../Skeleton";
import Seo from "../Seo";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  PackageSearch,
} from "lucide-react";

import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useState } from "react";
import ProductCard from "../ProductCard";

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
      <main className="flex-grow box-border font-Poppins">
        <section className="flex items-start gap-8 py-8 w-full px-5 md:px-8">
          <div className="w-64 shrink-0 hidden md:block space-y-3">
            <Skeleton className="h-5 w-24 mb-4" />
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
          <div className="w-full flex flex-col min-w-0">
            <Skeleton className="h-4 w-32 mb-5" />
            <ProductGridSkeleton count={8} />
          </div>
        </section>
      </main>
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
    categoryProductsData?.products[2],
  ].filter(Boolean);

  const pageTitle = subCategory
    ? `${formatProductName(subCategory)} | ${formatProductName(category || "")}`
    : formatProductName(category || "");

  return (
    <main className="flex-grow box-border font-Poppins">
      <Seo
        title={pageTitle}
        description={`Shop premium ${pageTitle.toLowerCase()} furniture at Vibrer. Customisable designs, quality materials, and a seamless buying experience.`}
        keywords={`${pageTitle}, ${pageTitle} furniture, buy ${pageTitle} online, Vibrer ${pageTitle}`}
        path={`/${category}${subCategory ? `/${subCategory}` : ""}/${category_id}`}
      />
      {/* Mobile Dropdown for Categories */}
      <div className="md:hidden w-full mt-4 block px-4">
        <div className="bg-white flex flex-col border border-gray-200 p-4 rounded-2xl shadow-sm">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpenMenu(!openMenu)}
            aria-expanded={openMenu}
            aria-controls="mobile-category-menu"
          >
            <p className="text-sm font-semibold">Browse Categories</p>
            {openMenu ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>

          {openMenu && (
            <ul className="mt-3 divide-y divide-gray-100" id="mobile-category-menu">
              {menuList?.map((item) => (
                <li key={item.id} className="py-1">
                  <div
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => {
                      if (item.category_children?.length) {
                        toggleMobileCategory(item.name);
                      } else {
                        navigate(`/${item.handle}/${item.id}`);
                        setOpenMenu(false);
                      }
                    }}
                    aria-expanded={mobileCategory === item.name}
                    aria-controls={`mobile-subcategory-list-${item.id}`}
                  >
                    <Link
                      to={`/${item.handle}/${item.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(false);
                      }}
                      className="text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    {item.category_children?.length > 0 &&
                      (mobileCategory === item.name ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      ))}
                  </div>
                  {item.category_children?.length > 0 && mobileCategory === item.name && (
                    <ul
                      className="pl-3 ml-1 mb-2 border-l border-gray-200 space-y-1"
                      id={`mobile-subcategory-list-${item.id}`}
                    >
                      {item.category_children.map((subItem) => (
                        <li
                          key={subItem.id}
                          className="py-1.5 px-2 text-sm text-gray-600 hover:text-black rounded-md hover:bg-gray-50"
                          onClick={() => {
                            navigate(
                              `/${item.handle}/${subItem.handle}/${subItem.id}`
                            );
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
      <section className="flex items-start gap-8 py-8 w-full px-5 md:px-8">
        {/* Desktop Sidebar for Categories */}
        <div className="w-64 shrink-0 hidden md:block">
          <h2 className="text-lg font-bold mb-5">Categories</h2>
          <ul aria-label="Desktop Categories" className="space-y-1">
            {menuList?.map((item, index) => {
              const isActiveParent = String(item.id) === category_id;
              return (
                <li key={item.id}>
                  <div
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                      isActiveParent ? "bg-black text-white" : "hover:bg-gray-100"
                    }`}
                    onClick={() =>
                      item.category_children?.length
                        ? toggleMenu(index)
                        : navigate(`/${item.handle}/${item.id}`)
                    }
                    aria-expanded={!!expandedMenus[index]}
                    aria-controls={`desktop-subcategory-list-${item.id}`}
                  >
                    <Link
                      to={`/${item.handle}/${item.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    {item.category_children?.length > 0 &&
                      (expandedMenus[index] ? (
                        <ChevronUp size={15} />
                      ) : (
                        <ChevronDown size={15} />
                      ))}
                  </div>
                  {item.category_children?.length > 0 && expandedMenus[index] && (
                    <ul
                      className="mt-1 ml-3 pl-3 border-l border-gray-200 space-y-1"
                      id={`desktop-subcategory-list-${item.id}`}
                    >
                      {item.category_children.map((subItem) => {
                        const isActiveChild = String(subItem.id) === category_id;
                        return (
                          <li key={subItem.id}>
                            <Link
                              to={`/${item.handle}/${subItem.handle}/${subItem.id}`}
                              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                isActiveChild
                                  ? "bg-gray-900 text-white font-medium"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="w-full flex flex-col min-w-0">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
            <span className="capitalize">{category}</span>
            {subCategory && (
              <>
                <ChevronRight size={14} />
                <span className="text-black font-medium capitalize">
                  {formatProductName(subCategory)}
                </span>
              </>
            )}
          </nav>

          {categoryProductsData &&
          categoryProductsData?.products?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-7 w-full">
              {categoryProductsData?.products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  thumbnail={product.thumbnail}
                  delay={0.05 * index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <PackageSearch size={26} className="text-gray-400" />
              </div>
              <p className="font-semibold text-gray-800 mb-1">No products yet</p>
              <p className="text-sm text-gray-500 max-w-xs">
                We're still adding products to this category. Check back soon
                or browse another category from the sidebar.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="bg-[#FAFAFA] w-full px-5 md:px-14 py-14 md:py-16">
        <div className="flex flex-col items-start gap-3 mb-10 max-w-2xl">
          <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase">
            Handpicked For You
          </span>
          <h2 className="text-3xl md:text-heading1 md:leading-heading1 font-bold">
            Explore our Bestsellers
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            Discover the epitome of luxury living with our exclusive furniture
            collection, meticulously crafted to bring sophistication and
            elegance to your home.
          </p>
        </div>

        <div className="relative w-full">
          {/* Custom Navigation Buttons for Bestsellers */}
          <button
            className={`custom-prev absolute top-1/2 -left-3 md:-left-5 z-10 transform -translate-y-1/2 bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition-colors focus:outline-none ${
              isBeginning ? "opacity-0 cursor-default" : ""
            }`}
            aria-label="Previous Bestseller"
            disabled={isBeginning}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className={`custom-next absolute top-1/2 -right-3 md:-right-5 z-10 transform -translate-y-1/2 bg-white text-black p-2.5 rounded-full shadow-md hover:bg-gray-50 transition-colors focus:outline-none ${
              isEnd ? "opacity-0 cursor-default" : ""
            }`}
            aria-label="Next Bestseller"
            disabled={isEnd}
          >
            <ChevronRight size={18} />
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
                slidesPerView: 1.3,
                spaceBetween: 16,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
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
                {item && (
                  <ProductCard id={item.id} title={item.title} thumbnail={item.thumbnail} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
