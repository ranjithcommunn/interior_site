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
import outdoor from "../../assets/outdoor.png";
import Matress from "../../assets/Matress.png";

interface Category {
  id: number;
  name: string;
  image_Url: string;
  link?: string;
}

const categoriesList: Category[] = [
  {
    id: 1,
    name: "Living Room",
    image_Url: LivingRoom,
    link: "living/sofas/pcat_01JMM5XCCR5XDCDQ6Z0M1A9M0W",
  },
  {
    id: 2,
    name: "Dining",
    image_Url: Dinning,
    link: "dining/dining-tables/pcat_01JMM66282W3RPPT01T5HJWN0R",
  },
  {
    id: 3,
    name: "Bedroom",
    image_Url: Bedroom,
    link: "bedroom/bed-cots/pcat_01JMM67JHZETTZ0MDFK6SP42TX",
  },
  {
    id: 4,
    name: "Office",
    image_Url: Office,
    link: "office/cabin-tables/pcat_01JMM6DFCN5YGNVH42CT6SX1JD",
  },
  {
    id: 5,
    name: "Storage",
    image_Url: Storage,
    link: "storage/tv-units/pcat_01JMM6396WQCJRFG2514VJBNER",
  },
  {
    id: 6,
    name: "Study Room",
    image_Url: StudyRoom,
    link: "study/study-tables/pcat_01JMM6B5BNPGHPV1XQW4VMJK34",
  },
  {
    id: 7,
    name: "Outdoor",
    image_Url: outdoor,
    link: "outdoor/outdoor-dining/pcat_01JMM6FPNFQYRC5V1RCYTE9D7K",
  },
  {
    id: 8,
    name: "Matress",
    image_Url: Matress,
    link: "matress/king-size/pcat_01JMM69E88X4A2BTEDJNEQ9WME",
  },
];

const CustomPrevArrow: React.FC<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick }) => {
  return (
    <button className="custom-arrow custom-prev-arrow" onClick={onClick}>
      <ChevronLeft />
    </button>
  );
};

// Custom Right Arrow
const CustomNextArrow: React.FC<{
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ onClick }) => {
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
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1 className="text-xl md:text-3xl font-bold my-5 font-Poppins">
        Product Categories
      </h1>
      <div className="relative w-full">
        <Slider {...settings}>
          {categoriesList.map((category) => (
            <motion.a
              key={category.id}
              href={category.link}
              className="relative rounded-md p-4 md:p-6 mx-2 h-48 md:h-52 overflow-hidden flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              {/* Background Image */}
              <motion.div
                className="absolute inset-0 bg-center bg-cover"
                style={{
                  backgroundImage: `url(${category.image_Url})`,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Overlay for readability (optional) */}
              <div className="absolute inset-0 bg-white/20" />

              {/* Text on top */}
              <div className="relative z-10 text-black text-center">
                <p className="text-base md:text-heading3 md:leading-heading3 font-bold font-Poppins">
                  {category.name}
                </p>
              </div>
            </motion.a>
          ))}
        </Slider>
      </div>
    </motion.section>
  );
};

export default ProductCategories;
