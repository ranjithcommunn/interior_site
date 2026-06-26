import React from "react";
import ourProcessImage1 from "../assets/ourprocess_image01.png";
import ourProcessImage2 from "../assets/ourprocess_image02.png";
import ourProcessImage3 from "../assets/ourprocess_image03.png";
import ourProcessImage4 from "../assets/ourprocess_image04.png";
import ourProcessImage5 from "../assets/ourprocess_image05.png";
import ourProcessImage6 from "../assets/ourprocess_image06.png";
import { motion } from "framer-motion";

interface Process {
  id: number;
  step: number;
  title: string;
  info: string;
  image: string;
}

const ourprocess: Process[] = [
  {
    id: 1,
    step: 1,
    title: "Select your dream model",
    info: "Identify the style that best suits your space and personality. From modern minimalism to classic elegance, choose what resonates with you.",
    image: ourProcessImage1,
  },
  {
    id: 2,
    step: 2,
    title: "Customize to your requirement",
    info: "Choose from a variety of premium materials such as rich woods, luxurious fabrics, and robust metals to complement your style.",
    image: ourProcessImage2,
  },
  {
    id: 3,
    step: 3,
    title: "Order confirmation",
    info: "Accurate measurements ensure your furniture fits perfectly, maximizing space and functionality.",
    image: ourProcessImage3,
  },
  {
    id: 4,
    step: 4,
    title: "Quality check",
    info: "Enjoy seamless delivery and professional installation services with every purchase.",
    image: ourProcessImage4,
  },
  {
    id: 5,
    step: 5,
    title: "Order processing",
    info: "Your order is carefully reviewed and processed to ensure all details are correct before moving to production.",
    image: ourProcessImage5,
  },
  {
    id: 6,
    step: 6,
    title: "Delivery",
    info: "Our commitment to quality ensures your satisfaction with every piece you choose.",
    image: ourProcessImage6,
  },
];

const OurProcess: React.FC = () => {
  const cardVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-[#FAFAFA] flex flex-col items-center text-center px-5 md:px-20 py-16 md:py-20">
      <motion.span
        className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        Our Process
      </motion.span>
      <motion.h1
        className="text-3xl font-bold mb-12 font-Poppins md:text-heading1 md:leading-heading1"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        How we Customize
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {ourprocess.map((process, index) => (
          <motion.div
            className="relative flex flex-col items-center text-center gap-3 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6 pt-10"
            key={process.id}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: (index % 3) * 0.1 }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black text-white text-sm font-bold shadow-md">
              {process.step}
            </span>
            <img
              src={process.image}
              alt={process.title}
              className="w-20 h-20 object-cover rounded-xl"
            />
            <h3 className="font-bold font-Poppins text-base md:text-heading3 md:leading-heading3">
              {process.title}
            </h3>
            <p className="font-Poppins text-sm text-gray-600 leading-relaxed">
              {process.info}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurProcess;
