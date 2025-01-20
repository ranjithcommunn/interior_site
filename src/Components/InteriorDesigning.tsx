import React, { useState } from "react";
import InteriorDesigningImage from "../assets/InteriorDesigning.png";
import InteriorDesigningImage2 from "../assets/InteriorDesigning2.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Slider, { Settings } from "react-slick";

// Type for Custom Arrow Props
interface CustomArrowProps {
  onClick?: () => void;
}

// Custom Left Arrow
const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute top-1/2 md:left-[-55px] left-[-30px] transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-400 transition"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <ChevronLeft size={20} />
  </button>
);

// Custom Right Arrow
const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-[-20px] md:right-[-45px] transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-400 transition"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <ChevronRight size={20} />
  </button>
);

// Type for Interior Designing Item
interface InteriorDesigningItem {
  id: number;
  imageurl: string;
  title: string;
  description: string;
}

// List of Interior Designing Items
const InteriorDesigningList: InteriorDesigningItem[] = [
  {
    id: 1,
    imageurl: InteriorDesigningImage,
    title: "Interior Designing",
    description:
      "Kitchen Interior - Let us help you design your kitchen. Leave the worry of mixing and matching furniture behind. Set up your space confidently by purchasing the complete look for a seamless experience.",
  },
  {
    id: 2,
    imageurl: InteriorDesigningImage2,
    title: "Living Room Interior",
    description:
      "Kitchen Interior - Let us help you design your kitchen. Leave the worry of mixing and matching furniture behind. Set up your space confidently by purchasing the complete look for a seamless experience.",
  },
];

// Slider Settings
const settings: Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
};

const InteriorDesigning: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="bg-[#D3D3D3] flex flex-col items-center text-center px-5 md:px-40 lg:px-40 py-10">
      {/* Header */}
      <motion.h1
        className="text-2xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {InteriorDesigningList[currentSlide].title}
      </motion.h1>
      <motion.p
        className="text-gray-700 mb-5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {InteriorDesigningList[currentSlide].description}
      </motion.p>
      <motion.button
        className="bg-[#1B1B1B] text-white text-sm md:text-base px-6 py-2 rounded-lg my-5"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Know More
      </motion.button>

      {/* Slider */}
      <div className="relative w-full">
        <Slider
          {...settings}
          beforeChange={(_, next) => handleSlideChange(next)}
        >
          {InteriorDesigningList.map((design) => (
            <motion.div
              key={design.id}
              className="p-2"
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={design.imageurl}
                alt={`Interior Design ${design.id}`}
                className="rounded-md shadow-md w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default InteriorDesigning;
