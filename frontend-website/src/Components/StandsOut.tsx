import React from "react";
import StandOurImage1 from "../assets/standout_image01.png";
import StandOurImage2 from "../assets/standout_image02.png";
import StandOurImage3 from "../assets/standout_image03.png";
import StandOurImage4 from "../assets/standout_image04.png";
import { motion } from "framer-motion";

interface StandOutItem {
  id: number;
  title: string;
  info: string;
  image: string;
}

const standOutList: StandOutItem[] = [
  {
    id: 1,
    title: "500 + Collections",
    info: "Discover an extensive range of thoughtfully curated furniture collections designed to match diverse styles and preferences.",
    image: StandOurImage1,
  },
  {
    id: 2,
    title: "300 + Fabrics",
    info: "Choose from a wide array of premium fabrics that combine aesthetics with durability for a look and feel that's just right.",
    image: StandOurImage2,
  },
  {
    id: 3,
    title: "Top-notch Quality",
    info: "We prioritize craftsmanship and quality materials to deliver products that stand the test of time, crafted with precision.",
    image: StandOurImage3,
  },
  {
    id: 4,
    title: "Colour & Length Customization",
    info: "Personalize your furniture to perfectly suit your space with flexible options in color and dimensions.",
    image: StandOurImage4,
  },
];

const StandsOut: React.FC = () => {
  const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-black flex flex-col items-center text-center px-5 md:px-20 py-16 md:py-20">
      <motion.span
        className="text-xs md:text-sm font-semibold tracking-widest text-gray-500 uppercase mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        Why Choose Us
      </motion.span>
      <motion.h1
        className="text-3xl font-bold mb-12 font-Poppins text-white md:text-heading1 md:leading-heading1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        Why Vibrer Stands Out?
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {standOutList.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white hover:-translate-y-1 transition-transform shadow-sm hover:shadow-xl"
            variants={itemVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08 }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <h3 className="font-bold font-Poppins text-base md:text-heading3 md:leading-heading3">
              {item.title}
            </h3>
            <p className="font-Poppins text-sm text-gray-600 leading-relaxed">
              {item.info}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StandsOut;
