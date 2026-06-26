import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import HeroBanner from "../assets/hero_section_banner.png";

interface Banner {
  id: string;
  image: string;
  link: string | null;
}

const fetchBanners = async () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(`${backendUrl}/store/banners`, {
    headers: {
      "x-publishable-api-key": import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch banners");
  }
  return response.json();
};

const HeroSection: React.FC = () => {
  const { data } = useQuery<{ banners: Banner[] }>(["banners"], fetchBanners);

  const banners = data?.banners ?? [];

  // Fall back to the static default banner until banners are configured in the admin panel
  const slides: Banner[] =
    banners.length > 0 ? banners : [{ id: "default", image: HeroBanner, link: null }];

  return (
    <motion.main
      className="flex justify-center px-5 mt-10"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="w-full md:px-14"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        {slides.length === 1 ? (
          <BannerSlide banner={slides[0]} />
        ) : (
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="rounded-xl overflow-hidden"
          >
            {slides.map((banner) => (
              <SwiperSlide key={banner.id}>
                <BannerSlide banner={banner} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </motion.div>
    </motion.main>
  );
};

const BannerSlide: React.FC<{ banner: Banner }> = ({ banner }) => {
  const image = (
    <img src={banner.image} alt="Hero Banner" className="w-full max-w-full" />
  );

  return banner.link ? <a href={banner.link}>{image}</a> : image;
};

export default HeroSection;
