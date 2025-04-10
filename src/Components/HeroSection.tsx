import React from "react";
import { motion } from "framer-motion";
import HeroBanner from "../assets/hero_section_banner.png";

const HeroSection: React.FC = () => {
  return (
    <motion.main
      className="flex justify-center px-5 mt-10"
      initial={{ opacity: 0, y: 50 }}  
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, ease: "easeOut" }} 
    >
      <motion.img
        src={HeroBanner}
        alt="Hero Banner" 
        className="max-w-full md:w-screen md:px-14"
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }} 
      />
    </motion.main>
  );
};

export default HeroSection;
