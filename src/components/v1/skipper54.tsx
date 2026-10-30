"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface ClipPathCarouselImage {
  src: string;
  alt?: string;
  title?: string;
}

export interface ClipPathCarouselProps {
  images: ClipPathCarouselImage[];
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  showNavigation?: boolean;
  showPagination?: boolean;
}

export function ClipPathCarousel({
  images,
  className,
  autoplay = false,
  loop = true,
  showNavigation = true,
  showPagination = true,
}: ClipPathCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      className={cn("w-full", className)}
      opts={{ loop, slidesToScroll: 1 }}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: 2000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
            ]
          : []
      }
    >
      <CarouselContent className="flex h-[500px] w-full">
        {images.map((item, idx) => (
          <CarouselItem
            key={idx}
            className="relative flex h-[81.5%] w-full basis-[73%] items-center justify-center sm:basis-[50%] md:basis-[30%] lg:basis-[25%] xl:basis-[21%]"
          >
            <motion.div
              initial={false}
              animate={{
                clipPath:
                  selectedIndex !== idx
                    ? "inset(15% 0 15% 0 round 2rem)"
                    : "inset(0 0 0 0 round 2rem)",
              }}
              className="h-full w-full overflow-hidden rounded-3xl"
            >
              <div className="relative h-full w-full border">
                <img
                  src={item.src}
                  alt={item.alt || ""}
                  className="h-full w-full scale-105 object-cover"
                />
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {selectedIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-0 left-2 flex h-[14%] w-full translate-y-full items-center justify-center p-2 text-center font-medium tracking-tight text-black/20"
                >
                  {item.title}
                </motion.div>
              )}
            </AnimatePresence>
          </CarouselItem>
        ))}
      </CarouselContent>

      {showNavigation && (
        <div className="absolute -bottom-4 right-0 flex w-full items-center justify-between gap-2 px-4">
          <button
            aria-label="Previous slide"
            onClick={() => api?.scrollPrev()}
            className="rounded-full bg-black/10 p-2 hover:bg-black/20 transition-colors"
          >
            <ArrowLeft className="text-white" />
          </button>
          <button
            aria-label="Next slide"
            onClick={() => api?.scrollNext()}
            className="rounded-full bg-black/10 p-2 hover:bg-black/20 transition-colors"
          >
            <ArrowRight className="text-white" />
          </button>
        </div>
      )}

      {showPagination && (
        <div className="flex w-full items-center justify-center">
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: images.length }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => api?.scrollTo(idx)}
                className={cn(
                  "h-2 w-2 cursor-pointer rounded-full transition-all",
                  selectedIndex === idx ? "bg-black" : "bg-[#D9D9D9]"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </Carousel>
  );
}

export function Skipper54() {
  return (
    <div className="flex h-full w-screen items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <ClipPathCarousel
        images={[
          {
            src: "/examples/photo-073.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Block Reader",
          },
          {
            src: "/examples/photo-069.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Forest Fungi",
          },
          {
            src: "/examples/photo-080.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Golden Dusk",
          },
          {
            src: "/examples/photo-081.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Silent Peaks",
          },
          {
            src: "/examples/photo-085.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Emerald Woods",
          },
          {
            src: "/examples/photo-092.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Falling Mist",
          },
          {
            src: "/examples/photo-079.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Midnight Veil",
          },
          {
            src: "/examples/photo-063.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Azure Ridge",
          },
          {
            src: "/examples/photo-062.jpg",
            alt: "Illustrations by ©AarzooAly",
            title: "Cloud Summit",
          },
        ]}
        className=""
        loop={true}
        showNavigation={true}
        showPagination={true}
      />
    </div>
  );
}

export { Skipper54 as DemoSkipper54 };
export default Skipper54;
