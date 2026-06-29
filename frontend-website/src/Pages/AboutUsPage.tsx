import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AboutUs from "../Components/AboutUs";
import OurProcess from "../Components/OurProcess";
import StandsOut from "../Components/StandsOut";
import Seo from "../Components/Seo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="font-Poppins bg-white">
      <Seo
        title="About Us"
        description="Learn about Vibrer, a premium furniture brand from SREGA Electronics & Furniture LLP, Bengaluru. Discover our story, our process, and why customers choose us."
        keywords="about Vibrer, Vibrer furniture brand, SREGA Electronics and Furniture LLP, Bengaluru furniture company, custom furniture brand story"
        path="/about-us"
      />

      {/* Header */}
      <section className="flex items-center justify-center text-center flex-col gap-3 pt-16 pb-12 px-5 md:px-20 bg-[#FAFAFA]">
        <motion.span
          className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Who We Are
        </motion.span>
        <motion.h1
          className="font-bold text-3xl md:text-heading1 md:leading-heading1"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          About Vibrer
        </motion.h1>
        <motion.p
          className="md:w-[55%] text-gray-600 md:text-heading3 md:leading-heading3"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          Vibrer is a premium furniture brand from SREGA Electronics &amp;
          Furniture LLP, Bengaluru — built around quality craftsmanship,
          thoughtful customisation, and a seamless buying experience.
        </motion.p>
      </section>

      {/* Our Story + values (reused from the homepage section) */}
      <AboutUs />

      {/* How we customize */}
      <OurProcess />

      {/* Why Vibrer stands out */}
      <StandsOut />

      {/* CTA */}
      <section className="flex flex-col items-center text-center gap-5 px-5 md:px-20 py-16 md:py-20 bg-[#FAFAFA]">
        <h2 className="text-2xl md:text-heading1 md:leading-heading1 font-bold font-Poppins">
          Ready to furnish your space?
        </h2>
        <p className="text-gray-600 max-w-xl">
          Explore our collections or get in touch with our team to start
          customising furniture for your home or office.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
            onClick={() => navigate("/")}
          >
            Browse Collections
          </button>
          <button
            className="border border-gray-300 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            onClick={() => navigate("/contact-us")}
          >
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
