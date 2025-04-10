import React from "react";
import { motion } from "framer-motion"; 
import SegmentsIcon from "../assets/Segments.png";
import ResidentialImage from "../assets/Residential.png";
import InstitutionalImage from "../assets/Institutional.png";
import CommercialImage from "../assets/Commercial.png";

interface Segment {
  id: number;
  name: string;
  imageUrl: string;
}

const Segments: React.FC = () => {

  const SegmentsList: Segment[] = [
    { id: 1, name: "Residential", imageUrl: ResidentialImage },
    { id: 2, name: "Institutional", imageUrl: InstitutionalImage },
    { id: 3, name: "Commercial", imageUrl: CommercialImage },
  ];

  return (
    <motion.section
      className="px-5 md:px-20 my-10"
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, ease: "easeOut" }} 
    >
      {/* Header */}
      <motion.div
        className="bg-[#D3D3D3] p-3 rounded-md flex gap-3 items-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <img src={SegmentsIcon} alt="Segments Icon" className="w-5   h-5   ml-5" />
        <h2 className="text-lg md:text-heading2 md:leading-heading2 font-bold font-Poppins">Segments</h2>
      </motion.div>

      {/* Segments List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {SegmentsList.map((segment, index) => (
          <motion.div
            key={segment.id}
            className="relative flex flex-col items-center justify-center rounded-xl shadow-md overflow-hidden h-[368px]"
            initial={{ opacity: 0, scale: 0.9 }} // Start small and invisible
            animate={{ opacity: 1, scale: 1 }} // Animate to full size and visible
            transition={{
              delay: 0.3 + index * 0.2, // Staggered animation for each card
              duration: 0.5,
              ease: "easeOut",
            }}
            whileHover={{ scale: 1.05 }} // Slightly enlarge on hover
          >
            {/* Background Image */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${segment.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.5,
              }}
              whileHover={{ opacity: 0.7 }} // Increase visibility on hover
              transition={{ duration: 0.3 }}
            ></motion.div>

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col justify-between h-full py-10 text-center px-4">
              <h3 className="text-xl md:text-heading2 md:leading-heading2 font-bold text-black mb-4 font-Poppins">
                {segment.name}
              </h3>
              <motion.button
                className="bg-[#1B1B1B] text-white text-sm md:text-button1 md:leading-button1 px-14 py-2 rounded-lg font-Poppins"
                whileHover={{ scale: 1.1, backgroundColor: "#333333" }} // Enlarge and darken on hover
                whileTap={{ scale: 0.95 }} // Slight shrink on click
                transition={{ duration: 0.2 }}
              >
                View More
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Segments;
