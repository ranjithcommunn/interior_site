import React from "react";
import AboutUsImage1 from "../assets/aboutus_image01.png";
import AboutUsImage2 from "../assets/aboutus_image02.avif";
import AboutUsImage3 from "../assets/aboutus_image03.png";
import AboutUsImage4 from "../assets/aboutus_image04.png";
import { motion } from "framer-motion";

interface ContentItem {
  title: string;
  description: string;
}

const AboutUs: React.FC = () => {
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  };

  const contentItems: ContentItem[] = [
    {
      title: "Inspired Living",
      description:
        "Discover furniture that combines modern elegance with everyday comfort, crafted to make your home a reflection of your unique style.",
    },
    {
      title: "Exceptional Savings",
      description:
        "By bridging the gap between you and trusted furniture makers, we bring you stunning pieces at prices that fit your budget.",
    },
    {
      title: "Easy Shopping",
      description:
        "From quick browsing to fast delivery and easy assembly, we simplify every step of finding and enjoying your perfect furniture.",
    },
    {
      title: "Sustainable Options",
      description:
        "Choose from sustainable furniture options crafted with the planet in mind—because style should never come at the cost of the environment.",
    },
  ];

  return (
    <section className="bg-white px-5 md:px-20 py-16 md:py-20">
      <div className="flex flex-col items-center text-center mb-12">
        <motion.span
          className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3"
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          Our Story
        </motion.span>
        <motion.h1
          className="text-3xl md:text-heading1 md:leading-heading1 font-bold mb-4 font-Poppins"
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          About us
        </motion.h1>
        <motion.p
          className="text-gray-600 max-w-2xl font-Poppins md:text-heading3 md:leading-heading3"
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          Discover the epitome of luxury living with our exclusive furniture
          collection. Each piece is meticulously crafted to bring sophistication
          and elegance to your home.
        </motion.p>
      </div>

      {/* Content Grid */}
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 w-full items-center">
        {/* Left Side: Text Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col gap-2 p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white"
              variants={textVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08 }}
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold mb-1">
                {index + 1}
              </span>
              <h2 className="text-lg md:text-xl font-bold text-left font-Poppins">
                {item.title}
              </h2>
              <p className="text-gray-600 text-sm text-left font-Poppins leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Side: Image Collage */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <motion.div
            className="rounded-2xl overflow-hidden shadow-md group"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={AboutUsImage1}
              alt="Modern furniture in a cozy living room"
              className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="row-span-2 rounded-2xl overflow-hidden shadow-md group"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1 }}
          >
            <img
              src={AboutUsImage2}
              alt="Elegant interior design with a sofa"
              className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="row-span-2 rounded-2xl overflow-hidden shadow-md group"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15 }}
          >
            <img
              src={AboutUsImage3}
              alt="Sustainable furniture setup"
              className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>

          <motion.div
            className="rounded-2xl overflow-hidden shadow-md group"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src={AboutUsImage4}
              alt="Luxury bedroom furniture"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
