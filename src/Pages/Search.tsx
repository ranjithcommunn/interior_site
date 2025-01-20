import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import SearchImage01 from "../assets/search_image01.png";
import SearchImage02 from '../assets/search_Image02.png';
import SearchImage03 from '../assets/search_Image03.png';
import SearchImage04 from '../assets/search_Image04.png';
import SearchImage05 from '../assets/search_Image05.png';
import SearchImage06 from '../assets/search_Image06.png';
import SearchImage07 from '../assets/search_Image07.png';
import SearchImage08 from '../assets/search_Image08.png';
import SearchImage09 from '../assets/search_Image09.png';

import SearchSection02Image01 from "../assets/search_section02_image01.png";
import SearchSection02Image02 from "../assets/search_section02_image02.png";
import SearchSection02Image03 from "../assets/Luxury_Bed_Set.png";
import "swiper/swiper-bundle.css"; // For Swiper 6 and above
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion"; // Import motion
import EnquireNowBtn from "@/Components/EnquireNowBtn";

interface SearchData {
  id: number;
  title: string;
  imageUrl: string;
}

interface MenuSubItem {
  name: string;
  link: string;
}

interface MenuItem {
  name: string;
  link: string;
  menuSubList: MenuSubItem[];
}

interface Bestseller {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  imageUrl: string;
}

const searchdata: SearchData[] = [
  {
    id: 1,
    title: "Golden Sofa Set",
    imageUrl: SearchImage01,
  },
  {
    id: 2,
    title: "Swing bed",
    imageUrl: SearchImage02,
  },
  {
    id: 3,
    title: "Dining table",
    imageUrl: SearchImage03,
  },
  {
    id: 4,
    title: "Designer Cabinet",
    imageUrl: SearchImage04,
  },
  {
    id: 5,
    title: "Modern Chair",
    imageUrl: SearchImage05,
  },
  {
    id: 6,
    title: "Elegant Dining",
    imageUrl: SearchImage06,
  },
  {
    id: 7,
    title: "Luxury Bedside",
    imageUrl: SearchImage07,
  },
  {
    id: 8,
    title: "Chair",
    imageUrl: SearchImage08,
  },
  {
    id: 9,
    title: "Chic Sideboard",
    imageUrl: SearchImage09,
  },
];

const menuList: MenuItem[] = [
  {
    name: "Living",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Storage",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Dining",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Bedroom",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Matress",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Study",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Office",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  {
    name: "Outdoor",
    link: "/",
    menuSubList: [
      { name: "TV Units", link: "/" },
      { name: "Box Shelves", link: "/" },
      { name: "Shoe Rack", link: "/" },
      { name: "Dressing Table", link: "/" },
      { name: "Wardrobes", link: "/" },
    ],
  },
  // Add other menu items here...
];

const Search: React.FC = () => {
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({});
  const [mobileCategory, setMobileCategory] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

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
    <main className="flex-grow box-border">
      {/* Mobile Dropdown */}
      <div className="md:hidden w-full mt-3 block px-4">
        <div className="bg-white flex flex-col border p-3 px-4 rounded-2xl">
          <div
            className="flex items-center justify-between"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <p>Select Sub category</p>
            {openMenu ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>

          {openMenu && (
            <ul className="mt-3">
              {menuList.map((item, index) => (
                <li key={index} className="mb-2">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleMobileCategory(item.name)}
                  >
                    <p>{item.name}</p>
                    {mobileCategory === item.name ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </div>
                  {mobileCategory === item.name && (
                    <ul className="pl-4 mt-2">
                      {item.menuSubList.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-1 text-sm text-gray-600 hover:text-black"
                        >
                          <a href={subItem.link}>{subItem.name}</a>
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
        <div className="w-2/12 p-4 bg-white flex-0 hidden md:block">
          <h2 className="text-xl font-bold mb-7">Sub - Categories</h2>
          <ul>
            {menuList.map((item, index) => (
              <li key={index} className="mb-4">
                <div
                  className="flex items-center justify-between py-3 cursor-pointer"
                  onClick={() => toggleMenu(index)}
                >
                  <p>{item.name}</p>
                  {expandedMenus[index] ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </div>
                {expandedMenus[index] && (
                  <ul className="pl-4 mt-2">
                    {item.menuSubList.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="py-1 text-sm text-gray-600 hover:text-black"
                      >
                        <a href={subItem.link}>{subItem.name}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-3/4 bg-white p-4 grid grid-cols-2 md:grid-cols-4 gap-10 flex-1">
          {searchdata.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex flex-col gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 + index * 0.1, // Staggered animation for each card
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <img src={item.imageUrl} alt={item.title} />
              <h5 className="text-lg">{item.title}</h5>
              <button className="bg-black text-white rounded-md p-2 w-fit">
                <EnquireNowBtn/>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#D3D3D3] w-full p-14 grid md:grid-cols-2 grid-cols-1 gap-2">
        <div className="flex flex-col items-start gap-2">
          <h2 className="md:text-5xl text-4xl">
            Explore our <br />
            Bestsellers
          </h2>
          <p className="text-sm md:text-base">
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
              className="custom-prev absolute top-1/2 -left-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="custom-next absolute top-1/2 -right-6 z-10 transform -translate-y-1/2 text-black p-2 rounded-full"
              aria-label="Next"
            >
              <ChevronRight size={20} /> {/* Right Arrow */}
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
            >
              {BestsellersList.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 border rounded-lg bg-white shadow h-80">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-auto rounded"
                    />
                    <h3 className="text-lg font-bold mt-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                    <p className="text-lg font-bold mt-1">${item.price}</p>
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

export default Search;