"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Navigation, Autoplay } from "swiper/modules";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface Carousel_002Props {
  images: CarouselImage[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}

export const Carousel_002: React.FC<Carousel_002Props> = ({
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
      className={cn("relative w-full max-w-3xl", className)}
    >
      <style>{`
  .Carousal_002 {
    padding-bottom: 50px !important;
  }
  `}</style>
      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 1000,
                disableOnInteraction: false,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={showPagination ? { clickable: true } : false}
        navigation={
          showNavigation
            ? {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }
            : false
        }
        className="Carousal_002 h-[380px] w-[260px]"
        modules={[EffectCards, Pagination, Navigation, Autoplay]}
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx} className="rounded-3xl overflow-hidden">
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

export function Skipper48() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <Carousel_002
        images={[
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
          {
            src: "/examples/photo-061.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-062.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-063.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-064.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-065.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
          {
            src: "/examples/photo-066.jpg",
            alt: "Illustrations by my fav AarzooAly",
          },
        ]}
        loop={true}
      />
    </div>
  );
}

export { Skipper48 as DemoSkipper48 };
export default Skipper48;
