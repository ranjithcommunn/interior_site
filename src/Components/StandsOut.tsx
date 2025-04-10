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
    info: "Our journey begins with a comprehensive understanding of your unique style and space requirements.",
    image: StandOurImage1,
  },
  {
    id: 2,
    title: "300 + Fabrics",
    info: "Our journey begins with a comprehensive understanding of your unique style and space requirements.",
    image: StandOurImage2,
  },
  {
    id: 3,
    title: "Top-notch Quality",
    info: "Our journey begins with a comprehensive understanding of your unique style and space requirements.",
    image: StandOurImage3,
  },
  {
    id: 4,
    title: "Colour and Length customization",
    info: "Our journey begins with a comprehensive understanding of your unique style and space requirements.",
    image: StandOurImage4,
  },
];

const StandsOut: React.FC = () => {
  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="flex flex-col items-center text-center px-5 md:px-20 py-10">
      <motion.h1
        className="text-3xl font-bold mb-6 font-Poppins md:text-heading1 md:leading-heading1"
        variants={itemVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        Why Vibrer Stands Out?
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {standOutList.map((item) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center p-5 py-10 justify-between max-w-96 h-72 rounded-md bg-[#D3D3D3]"
            variants={itemVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 object-cover rounded-md"
              variants={itemVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
            />
            <div className="text-left">
              <motion.h3
                className="font-bold font-Poppins md:text-heading3 md:leading-heading3"
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
              >
                {item.title}
              </motion.h3>
              <motion.p
                variants={itemVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="font-Roboto"
              >
                {item.info}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StandsOut;
