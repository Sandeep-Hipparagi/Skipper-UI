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

export interface Carousel_003Props {
  images: CarouselImage[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}

export const Carousel_003: React.FC<Carousel_003Props> = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("relative w-full max-w-4xl px-5", className)}
    >
      <style>{`
  .Carousal_003 {
    width: 100%;
    height: 350px;
    padding-bottom: 50px !important;
  }
  
  .Carousal_003 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
  }

  .swiper-pagination-bullet {
    background-color: #000 !important;
  }
`}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 1500,
                  disableOnInteraction: true,
                }
              : false
          }
          effect="coverflow"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          coverflowEffect={{
            rotate: 40,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
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
          className="Carousal_003"
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} className="overflow-hidden rounded-xl">
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
    </motion.div>
  );
};

export function Skipper49() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <Carousel_003
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
        showPagination={true}
        loop={true}
      />
    </div>
  );
}

export { Skipper49 as DemoSkipper49 };
export default Skipper49;
