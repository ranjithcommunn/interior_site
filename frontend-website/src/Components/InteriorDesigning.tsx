import React, { useState } from "react";
import InteriorDesigningImage from "../assets/InteriorDesigning.png";
import InteriorDesigningImage2 from "../assets/InteriorDesigning2.png";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Slider, { Settings } from "react-slick";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CustomArrowProps {
  onClick?: () => void;
}

const CustomPrevArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute top-1/2 md:left-[-55px] left-[-30px] transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-400 transition"
    onClick={onClick}
    aria-label="Previous Slide"
  >
    <ChevronLeft size={20} />
  </button>
);

const CustomNextArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <button
    className="absolute top-1/2 right-[-20px] md:right-[-45px] transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-400 transition"
    onClick={onClick}
    aria-label="Next Slide"
  >
    <ChevronRight size={20} />
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
    <section className="bg-[#D3D3D3] flex flex-col items-center text-center px-5 md:px-40 lg:px-40 py-10">
      {/* Header */}
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
        className="text-gray-700 mb-5 font-Poppins text-base md:px-24 md:text-text1 md:leading-text1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {activeSlide.description}
      </motion.p>
      {activeSlide.link && (
        <motion.button
          className="bg-[#1B1B1B] text-white text-sm md:text-button3 md:leading-button3 px-6 py-2 rounded-lg my-5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(activeSlide.link!)}
        >
          Know More
        </motion.button>
      )}

      {/* Slider */}
      <div className="relative w-full">
        <Slider {...settings} beforeChange={(_, next) => handleSlideChange(next)}>
          {slides.map((design) => (
            <motion.div key={design.id} className="p-2" transition={{ duration: 0.3 }}>
              <motion.img
                src={design.imageurl}
                alt={design.title}
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
