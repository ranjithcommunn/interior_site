import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import "react-multi-carousel/lib/styles.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider, { Settings } from "react-slick";

import "./ProductCategories.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LivingRoom from "../../assets/Living_Room.png";
import Bedroom from "../../assets/Bedroom.png";
import Dinning from "../../assets/Dining.png";
import Office from "../../assets/Office.png";
import Storage from "../../assets/Storage.png";
import StudyRoom from "../../assets/Study_Room.png";
import outdoor from '../../assets/outdoor.png'
import Matress from '../../assets/Matress.png'

interface Category {
  id: number;
  name: string;
  image_Url: string;
}

const categoriesList: Category[] = [
  { id: 1, name: "Living Room", image_Url: LivingRoom },
  { id: 2, name: "Dining", image_Url: Dinning },
  { id: 3, name: "Bedroom", image_Url: Bedroom },
  { id: 4, name: "Office", image_Url: Office },
  { id: 5, name: "Storage", image_Url: Storage },
  { id: 6, name: "Study Room", image_Url: StudyRoom },
  { id: 7, name: "Outdoor", image_Url: outdoor },
  { id: 8, name: "Matress", image_Url: Matress },
];

// Custom Left Arrow
const CustomPrevArrow: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }> = ({ onClick }) => {
  return (
    <button className="custom-arrow custom-prev-arrow" onClick={onClick}>
      <ChevronLeft />
    </button>
  );
};

// Custom Right Arrow
const CustomNextArrow: React.FC<{ onClick?: React.MouseEventHandler<HTMLButtonElement> }> = ({ onClick }) => {
  return (
    <button className="custom-arrow custom-next-arrow" onClick={onClick}>
      <ChevronRight />
    </button>
  );
};

const settings: Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
  responsive: [
    {
      breakpoint: 1024, // Tablet and smaller
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768, // Mobile landscape and smaller
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480, // Mobile portrait and smaller
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
};

const ProductCategories: React.FC = () => {
  return (
    <motion.section
      className="flex items-center flex-col px-5 md:px-20 relative my-10"
      initial={{ opacity: 0, y: 50 }} // Section starts hidden and slides up
      animate={{ opacity: 1, y: 0 }} // Fades in and slides into position
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1 className="text-xl md:text-heading1 md:leading-heading1 font-bold my-5 font-Poppins">Product Categories</h1>
      <div className="relative w-full">
        <Slider {...settings}>
          {categoriesList.map((category) => (
            <motion.div
              key={category.id}
              className="bg-[#D3D3D3] rounded-md p-6 flex items-center justify-center flex-col h-52 mx-2 gap-5"
              initial={{ opacity: 0, scale: 0.8 }} // Start smaller and invisible
              whileInView={{ opacity: 1, scale: 1 }} // Animate when in view
              viewport={{ once: true, amount: 0.5 }} // Trigger once when 50% visible
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <p className="text-lg md:text-heading3 md:leading-heading3 font-bold font-Poppins">{category.name}</p>
              <motion.img
                src={category.image_Url}
                alt={category.name}
                className="h-[103px] w-[103px]  object-contain"
                whileHover={{ scale: 1.1 }} // Slight zoom on hover
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

export default ProductCategories;
