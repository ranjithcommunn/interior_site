import React from "react";
import HeroSection from "../Components/HeroSection";
import ProductCategories from "../Components/ProductCategories/ProductCategories";
import Segments from "../Components/Segments";
import TrendingProducts from "../Components/TrendingProducts";
import InteriorDesigning from "../Components/InteriorDesigning";
import AboutUs from "../Components/AboutUs";
import OurProcess from "../Components/OurProcess";
import StandsOut from "../Components/StandsOut";

const Home: React.FC = () => {

 
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProductCategories />
      <Segments />
      <TrendingProducts />
      <InteriorDesigning />
      <AboutUs />
      <OurProcess />
      <StandsOut />
    </main>
  );
};

export default Home;
