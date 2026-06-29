import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
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
  const swiperRef = useRef<SwiperType | null>(null);

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
          <div className="rounded-xl overflow-hidden">
            <BannerSlide banner={slides[0]} />
          </div>
        ) : (
          <div className="relative group rounded-xl overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={800}
              autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              pagination={{ clickable: true }}
              loop
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              className="rounded-xl overflow-hidden"
            >
              {slides.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <BannerSlide banner={banner} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute z-10 left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute z-10 right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
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
