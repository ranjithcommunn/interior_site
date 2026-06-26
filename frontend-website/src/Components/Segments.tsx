import React from "react";
import { motion } from "framer-motion"; 
import SegmentsIcon from "../assets/Segments.png";
import ResidentialImage from "../assets/Residential.png";
import InstitutionalImage from "../assets/Institutional.png";
import CommercialImage from "../assets/Commercial.png";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  return (
    <motion.section
      className="bg-[#FAFAFA] px-5 md:px-20 py-14 md:py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10">
        <motion.div
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
        >
          <img src={SegmentsIcon} alt="Segments Icon" className="w-5 h-5" />
        </motion.div>
        <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase">
          Where We Fit
        </span>
        <h2 className="text-2xl md:text-heading1 md:leading-heading1 font-bold font-Poppins">
          Segments
        </h2>
      </div>

      {/* Segments List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {SegmentsList.map((segment, index) => (
          <motion.div
            key={segment.id}
            className="group relative flex flex-col items-center justify-center rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden h-[368px]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: 0.1 * index,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${segment.imageUrl})` }}
            />

            {/* Gradient overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Overlay Content */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full w-full pb-8 text-center px-4">
              <h3 className="text-xl md:text-heading2 md:leading-heading2 font-bold text-white mb-4 font-Poppins">
                {segment.name}
              </h3>
              <button
                className="bg-white text-black text-sm md:text-button2 md:leading-button2 px-8 py-2.5 rounded-lg font-Poppins font-medium hover:bg-gray-100 transition-colors"
                onClick={() => {
                  navigate("/contact-us");
                }}
              >
                View More
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Segments;
