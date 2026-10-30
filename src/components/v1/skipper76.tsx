"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  type CarouselApi,
} from "@/components/ui/carousel";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = () => {
      const m = window.matchMedia("(max-width: 768px)");
      const ua = navigator.userAgent.toLowerCase();
      const isMobileUA = [
        "android",
        "webos",
        "iphone",
        "ipad",
        "ipod",
        "blackberry",
        "windows phone",
        "mobile",
      ].some((term) => ua.includes(term));
      setIsMobile(m.matches || (isMobileUA && window.innerWidth <= 768));
      setIsLoading(false);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return { isMobile, isLoading };
}

function CarouselButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      <button
        className={cn(
          "absolute left-0 top-1/2 flex size-10 -translate-x-full -translate-y-1/2 cursor-pointer items-center justify-end active:scale-95 transition-opacity",
          !canScrollPrev && "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeft className="size-5 text-white" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        className={cn(
          "absolute -right-0 top-1/2 flex size-10 -translate-y-1/2 translate-x-full cursor-pointer items-center justify-start active:scale-95 transition-opacity",
          !canScrollNext && "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ArrowRight className="size-5 text-white" />
        <span className="sr-only">Next slide</span>
      </button>
    </>
  );
}

const PLUS_CIRCLE_SVG = (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11.3" fill="none" stroke="currentColor" />
    <g transform="translate(7 7)" fill="currentColor" stroke="none">
      <path d="m9 4h-3v-3c0-0.553-0.447-1-1-1s-1 0.447-1 1v3h-3c-0.553 0-1 0.447-1 1s0.447 1 1 1h3v3c0 0.553 0.447 1 1 1s1-0.447 1-1v-3h3c0.553 0 1-0.447 1-1s-0.447-1-1-1" />
    </g>
  </svg>
);

const FEATURES = [
  {
    id: 1,
    name: "colors",
    desc: "Choose from three bold finishes. iPhone 17 Pro shown in Cosmic Orange",
    src: "/images/oct25Coll/iphone17pro/1a.jpg",
  },
  {
    id: 2,
    name: "aluminum unibody",
    desc: "Optimized for performance and battery. Aluminum alloy is remarkably light and has exceptional thermal conductivity.",
    src: "/images/oct25Coll/iphone17pro/2.jpg",
  },
  {
    id: 3,
    name: "vapor chamber",
    desc: "Deionized water sealed inside moves heat away from the A19 Pro chip, allowing for even higher sustained performance.",
    src: "/images/oct25Coll/iphone17pro/3.jpg",
  },
  {
    id: 4,
    name: "ceramic shield",
    desc: "Protects the back of iPhone 17 Pro, making it 4x more resistant to cracks. New Ceramic Shield 2 on the front has 3x better scratch resistance.",
    src: "/images/oct25Coll/iphone17pro/4.jpg",
  },
  {
    id: 5,
    name: "immersive pro display",
    desc: "Our best‑ever 6.3‑inch and 6.9‑inch Super Retina XDR displays. Brighter. Better anti‑reflection. ProMotion up to 120Hz.",
    src: "/images/oct25Coll/iphone17pro/5.jpg",
  },
  {
    id: 6,
    name: "camera control",
    desc: "Instantly take a photo, record video, adjust settings, and more. So you never miss a moment.",
    src: "/images/oct25Coll/iphone17pro/6.jpg",
  },
  {
    id: 7,
    name: "Action button",
    desc: "A customizable fast track to your favorite feature. Long press to launch the action you want — Silent mode, Translation, Shortcuts, and more.",
    src: "/images/oct25Coll/iphone17pro/7.jpg",
  },
];

const COLORS = [
  { id: 0, color: "#fff", src: "/images/oct25Coll/iphone17pro/1a.jpg" },
  { id: 1, color: "#F77313", src: "/images/oct25Coll/iphone17pro/1c.jpg" },
  { id: 2, color: "#2B3145", src: "/images/oct25Coll/iphone17pro/1b.jpg" },
];

export function Skipper76() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const { isMobile } = useIsMobile();

  return (
    <LayoutGroup>
      <div className="flex h-full min-h-screen w-screen items-center justify-center bg-[#121212] p-4 text-white">
        <div className="relative flex h-[745px] w-full max-w-[90rem] flex-col justify-end overflow-hidden rounded-[2.5rem] bg-black pb-5 shadow-2xl md:justify-center">
          <div className="relative flex items-center md:px-10 lg:px-24">
            <AnimatePresence>
              {activeFeature !== null && (
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                  className="absolute left-8 hidden flex-col gap-2 lg:flex z-20"
                >
                  <button
                    onClick={() => {
                      if (activeFeature > 0) setActiveFeature(activeFeature - 1);
                    }}
                    disabled={activeFeature === 0}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full bg-white/10 active:scale-95 transition-all",
                      activeFeature === 0 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-white/20"
                    )}
                  >
                    <ChevronUp className="size-6 stroke-[3]" />
                  </button>
                  <button
                    onClick={() => {
                      if (activeFeature < FEATURES.length - 1)
                        setActiveFeature(activeFeature + 1);
                    }}
                    disabled={activeFeature === FEATURES.length - 1}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full bg-white/10 active:scale-95 transition-all",
                      activeFeature === FEATURES.length - 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-white/20"
                    )}
                  >
                    <ChevronDown className="size-6 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="relative z-10 hidden flex-col justify-center gap-3 md:flex">
              {FEATURES.map((item, idx) => (
                <motion.li
                  key={idx}
                  layout
                  transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
                  style={{ borderRadius: "25px" }}
                  className="flex h-fit w-fit items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/15"
                >
                  {activeFeature === idx ? (
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(2px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.5, delay: 0.25 }}
                      className="max-w-[26.5rem] p-6 text-lg"
                    >
                      <div>
                        <b className="capitalize">{item.name}.</b> {item.desc}
                      </div>
                      {idx === 0 && (
                        <div className="mt-4 flex items-center justify-center gap-2">
                          {COLORS.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setActiveColor(c.id)}
                              style={{ backgroundColor: c.color }}
                              className="size-6 cursor-pointer rounded-full border-b border-white shadow"
                            />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0, filter: "blur(2px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(2px)" }}
                      transition={{ duration: 0.3, delay: 0.25 }}
                      onClick={() => setActiveFeature(idx)}
                      className="flex h-[56px] cursor-pointer items-center justify-center gap-[14px] rounded-full pl-[14px] pr-8"
                    >
                      {idx === 0 ? (
                        <div
                          style={{
                            backgroundColor:
                              activeColor !== null ? COLORS[activeColor].color : "white",
                          }}
                          className="size-6 rounded-full border-b border-white"
                        />
                      ) : (
                        PLUS_CIRCLE_SVG
                      )}
                      <span className="whitespace-nowrap text-lg font-semibold capitalize">
                        {item.name}
                      </span>
                    </motion.button>
                  )}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence mode="popLayout">
              {activeFeature === null ? (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{
                    opacity: 1,
                    scale: 1.2,
                    transition: { delay: 0.25, duration: 0.3, type: "spring", stiffness: 300, damping: 30 },
                  }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="h-full w-full"
                >
                  <img
                    src="/images/oct25Coll/iphone17pro/1.jpg"
                    alt="iPhone 17 Pro"
                    className="h-full w-full object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={activeFeature}
                  initial={{ opacity: 0, x: "15%", scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    scale: 1.2,
                    transition: { delay: 0.2, type: "spring", stiffness: 350, damping: 30 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  exit={{ opacity: 0, x: "-15%", scale: 0.9 }}
                  className="h-full w-full"
                >
                  <img
                    src={
                      activeFeature === 0 && activeColor !== null
                        ? COLORS[activeColor].src
                        : FEATURES[activeFeature].src
                    }
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {activeFeature !== null && (
              <motion.button
                initial={{ y: "100%", opacity: 0, scale: 0 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0 }}
                onClick={() => setActiveFeature(null)}
                className="absolute right-5 top-5 z-30 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 active:scale-95 hover:bg-white/20 transition-all"
              >
                <Plus className="size-6 rotate-45 stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LayoutGroup>
  );
}

export { Skipper76 as DemoSkipper76 };
export default Skipper76;
