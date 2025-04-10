import React from "react";
import AboutUsImage1 from "../assets/aboutus_image01.png";
import AboutUsImage2 from "../assets/aboutus_image02.avif";
import AboutUsImage3 from "../assets/aboutus_image03.avif";
import AboutUsImage4 from "../assets/aboutus_image04.avif";
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

  const gridVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2 } },
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
    <section className="flex flex-col items-center text-center px-5 md:px-20 py-10">
      {/* Header Section */}
      <motion.h1
        className="text-3xl md:text-heading1 md:leading-heading1 font-bold mb-6 font-Poppins"
        variants={textVariant}
        initial="hidden"
        animate="visible"
      >
        About us
      </motion.h1>
      <motion.p
        className="text-gray-700 mb-8 max-w-4xl font-Poppins md:text-heading3 md:leading-heading3 "
        variants={textVariant}
        initial="hidden"
        animate="visible"
      >
        Discover the epitome of luxury living with our exclusive furniture
        collection. Each piece is meticulously crafted to bring sophistication
        and elegance to your home.
      </motion.p>

      {/* Content Grid */}
      <motion.div
        className="grid md:grid-cols-2 gap-10 w-full"
        variants={gridVariant}
        initial="hidden"
        animate="visible"
      >
        {/* Left Side: Text Content */}
        <div className="grid grid-cols-2 gap-6">
          {contentItems.map((item, index) => (
            <motion.div
              key={index}
              className="md:m-5 m-2 flex flex-col justify-center"
              variants={textVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <h2 className="text-xl md:text-3xl font-bold mb-2 text-left font-Poppins">{item.title}</h2>
              <p className="text-gray-700 text-sm text-left font-Poppins md:text-text1 md:leading-text1">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <motion.div
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={AboutUsImage1}
              alt="Modern furniture in a cozy living room"
              className="rounded-2xl shadow-md object-cover h-full w-full"
            />
          </motion.div>

          <motion.div
            className="row-span-2"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={AboutUsImage2}
              alt="Elegant interior design with a sofa"
              className="rounded-2xl shadow-md object-cover h-full w-full"
            />
          </motion.div>

          <motion.div
            className="row-span-2"
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={AboutUsImage3}
              alt="Sustainable furniture setup"
              className="rounded-2xl shadow-md object-cover h-full w-full"
            />
          </motion.div>

          <motion.div
            variants={imageVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <img
              src={AboutUsImage4}
              alt="Luxury bedroom furniture"
              className="rounded-2xl shadow-md object-cover w-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutUs;
