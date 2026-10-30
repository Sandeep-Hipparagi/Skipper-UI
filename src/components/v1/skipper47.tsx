"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface Carousel_001Props {
  images: CarouselImage[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}

export const Carousel_001: React.FC<Carousel_001Props> = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("w-3xl relative", className)}
    >
      <style>{`
  .Carousal_001 {
    padding-bottom: 50px !important;
  }
  `}</style>
      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={2.43}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={showPagination ? { clickable: true } : false}
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_001"
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx} className="!h-[320px] w-full border">
            <img
              className="h-full w-full object-cover"
              src={img.src}
              alt={img.alt || ""}
            />
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div>
            <div className="swiper-button-next after:hidden">
              <ArrowRight className="h-6 w-6 text-white" />
            </div>
            <div className="swiper-button-prev after:hidden">
              <ArrowLeft className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export function Skipper47() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <Carousel_001
        images={[
          {
            src: "/examples/photo-071.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-073.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-092.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-080.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-081.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-079.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
        ]}
        showPagination={true}
        loop={true}
      />
    </div>
  );
}

export { Skipper47 as DemoSkipper47 };
export default Skipper47;
