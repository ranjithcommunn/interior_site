import React, { useState } from "react";
import InteriorDesigningImage from "../assets/InteriorDesigning.png";
import InteriorDesigningImage2 from "../assets/InteriorDesigning2.png";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { motion } from "framer-motion";
import Slider, { Settings } from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CustomArrowProps {
  onClick?: () => void;
}

const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute z-10 top-1/2 md:left-3 left-2 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <ChevronLeft size={18} />
  </button>
);

const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute z-10 top-1/2 right-2 md:right-3 -translate-y-1/2 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <ChevronRight size={18} />
  </button>
);

interface InteriorDesigningItem {
  id: string;
  imageurl: string;
  title: string;
  description: string;
  link: string | null;
}

// Fallback content shown until slides are configured in the admin panel
const defaultSlides: InteriorDesigningItem[] = [
  {
    id: "default-1",
    imageurl: InteriorDesigningImage,
    title: "Interiors",
    description:
      "Kitchen Interior - Let us help you design your kitchen. Leave the worry of mixing and matching furniture behind. Set up your space confidently by purchasing the complete look for a seamless experience.",
    link: null,
  },
  {
    id: "default-2",
    imageurl: InteriorDesigningImage2,
    title: "Living Room Interior",
    description:
      "Living Room Interior – Create a space you'll love to live in. Forget the hassle of mixing and matching furniture. Choose from our curated complete looks and set up your living room with confidence and style—for a truly seamless experience.",
    link: null,
  },
];

const fetchInteriorSlides = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/interior-slides`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch interior slides");
  return response.json();
};

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
  const navigate = useNavigate();

  const { data } = useQuery<{
    slides: { id: string; image: string; title: string; description: string; link: string | null }[];
  }>(["interiorSlides"], fetchInteriorSlides);

  const remoteSlides = data?.slides;
  const slides: InteriorDesigningItem[] =
    remoteSlides && remoteSlides.length > 0
      ? remoteSlides.map((s) => ({
          id: s.id,
          imageurl: s.image,
          title: s.title,
          description: s.description,
          link: s.link,
        }))
      : defaultSlides;

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  const activeSlide = slides[Math.min(currentSlide, slides.length - 1)];

  return (
    <motion.section
      className="bg-[#FAFAFA] flex flex-col items-center text-center px-5 md:px-20 py-14 md:py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-3">
        <motion.div
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          <Palette size={20} />
        </motion.div>
        <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase">
          Curated Spaces
        </span>
      </div>

      <motion.h1
        key={`title-${activeSlide.id}`}
        className="text-2xl md:text-heading1 md:leading-heading1 font-bold mb-4 font-Poppins"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {activeSlide.title}
      </motion.h1>
      <motion.p
        key={`desc-${activeSlide.id}`}
        className="text-gray-600 mb-5 font-Poppins text-base max-w-2xl md:text-text1 md:leading-text1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {activeSlide.description}
      </motion.p>
      {activeSlide.link && (
        <motion.button
          className="bg-black text-white text-sm md:text-button3 md:leading-button3 px-6 py-2.5 rounded-lg mb-8 hover:bg-gray-900 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(activeSlide.link!)}
        >
          Know More
        </motion.button>
      )}

      {/* Slider */}
      <div className="relative w-full max-w-4xl">
        <Slider {...settings} beforeChange={(_, next) => handleSlideChange(next)}>
          {slides.map((design) => (
            <motion.div key={design.id} className="px-1" transition={{ duration: 0.3 }}>
              <motion.img
                src={design.imageurl}
                alt={design.title}
                className="rounded-2xl shadow-md w-full aspect-video object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

export default InteriorDesigning;
