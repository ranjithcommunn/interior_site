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
  title: string;
  info: string;
  image: string;
}

const ourprocess: Process[] = [
  {
    id: 1,
    title: "Step 1: Select your dream model",
    info: "Identify the style that best suits your space and personality. From modern minimalism to classic elegance, choose what resonates with you.",
    image: ourProcessImage1,
  },
  {
    id: 2,
    title: "Step 2: Customize to your requirement",
    info: "Choose from a variety of premium materials such as rich woods, luxurious fabrics, and robust metals to complement your style.",
    image: ourProcessImage2,
  },
  {
    id: 3,
    title: "Step 3: Order confirmation",
    info: "Accurate measurements ensure your furniture fits perfectly, maximizing space and functionality.",
    image: ourProcessImage3,
  },
  {
    id: 4,
    title: "Step 4: Quality check",
    info: "Enjoy seamless delivery and professional installation services with every purchase.",
    image: ourProcessImage4,
  },
  {
    id: 5,
    title: "Step 5: Order processing",
    info: "Your order is carefully reviewed and processed to ensure all details are correct before moving to production.",
    image: ourProcessImage5,
  },
  {
    id: 6,
    title: "Step 6: Delivery",
    info: "Our commitment to quality ensures your satisfaction with every piece you choose.",
    image: ourProcessImage6,
  },
];

const OurProcess: React.FC = () => {
  const processVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="flex flex-col items-center text-center px-5 md:px-20 py-10">
      <motion.h1
        className="text-3xl font-bold mb-6 font-Poppins md:text-heading1 md:leading-heading1"
        variants={processVariant}
        initial="hidden"
        animate="visible"
      >
        How we Customize
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {ourprocess.map((process) => (
          <motion.div
            className="flex items-center gap-3"
            key={process.id}
            variants={processVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.img
              src={process.image}
              alt={process.title}
              className="w-24 h-24 object-cover rounded-md"
              variants={processVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            />
            <div className="text-left">
              <motion.h3
                className="font-bold font-Poppins md:text-heading3 md:leading-heading3"
                variants={processVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {process.title}
              </motion.h3>
              <motion.p
                variants={processVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="font-Poppins md:text-text1 md:leading-text1"
              >
                {process.info}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default OurProcess;
