"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AccordionItem {
  id: number;
  label: string;
  year: string;
  image: string;
}

export const defaultAccordionItems: AccordionItem[] = [
  { id: 1, label: "Velvet ® Dreams Studio", year: "2024", image: "/examples/photo-073.jpg" },
  { id: 2, label: "Neon Pulse ® Agency", year: "2024", image: "/examples/photo-046.jpg" },
  { id: 3, label: "Midnight Canvas", year: "2024", image: "/examples/photo-041.jpg" },
  { id: 4, label: "Echo Digital Lab", year: "2024", image: "/examples/photo-036.jpg" },
  { id: 5, label: "Skipper Creative ® Co", year: "2023", image: "/skipperv1/common/img5.webp" },
  { id: 6, label: "Cosmic Brew Studios", year: "2023—2024", image: "/examples/photo-043.jpg" },
  { id: 7, label: "Horizon Typography", year: "2024", image: "/examples/photo-044.jpg" },
  { id: 8, label: "Waves & ® Motion", year: "2022—2024", image: "/skipperv1/common/img8.webp" },
  { id: 9, label: "Stellar Workshop", year: "2023", image: "/examples/photo-040.jpg" },
  { id: 10, label: "Prism ® Media House", year: "2023", image: "/examples/photo-026.jpg" },
  { id: 11, label: "Aurora Design Co ™", year: "2023", image: "/examples/photo-036.jpg" },
  { id: 12, label: "Flux Interactive", year: "2023", image: "/examples/photo-021.jpg" },
  { id: 13, label: "Ember Creative Lab ™", year: "2022", image: "/examples/photo-034.jpg" },
  { id: 14, label: "Zenith Brand Studio", year: "2024", image: "/examples/photo-024.jpg" },
  { id: 15, label: "Quantum Visual Arts", year: "2022—2023", image: "/examples/photo-030.jpg" },
  { id: 16, label: "Quantum Visual Arts", year: "2022—2023", image: "/examples/photo-017.jpg" },
  { id: 17, label: "Quantum Visual Arts", year: "2022—2023", image: "/examples/photo-010.jpg" },
];

export const HoverExpandGallery: React.FC<{ items?: AccordionItem[] }> = ({
  items = defaultAccordionItems,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(14);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    setIsMobile(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <section className="h-full min-h-[600px] w-full bg-[#121212] text-[#F1F1F1] py-8 overflow-x-auto">
      <div className="overflow-hidden md:h-[80vh]">
        <motion.div className="mx-auto flex w-full flex-col md:h-full md:flex-row lg:min-w-[1600px]">
          {items.map((item, index) => {
            const isSelected = activeIndex === index;

            return (
              <motion.div
                key={item.id}
                className="relative h-full w-full cursor-pointer border-0 border-white/20 md:border-r"
                onClick={isMobile ? () => setActiveIndex(index) : undefined}
                onMouseEnter={!isMobile ? () => setActiveIndex(index) : undefined}
                initial={
                  isMobile
                    ? { height: "4rem", width: "100%" }
                    : { width: "4rem", height: "100%" }
                }
                animate={
                  isMobile
                    ? { height: isSelected ? "500px" : "4rem", width: "100%" }
                    : { width: isSelected ? "28rem" : "4rem" }
                }
                transition={{ stiffness: 200, damping: 25, type: "spring" }}
              >
                <motion.div
                  className="absolute bottom-0 left-[2vw] flex w-[calc(100vh-2.6vw)] origin-[0_50%] transform justify-between pr-5 text-xl font-medium tracking-tight md:-rotate-90 md:text-[1.8vw]"
                  animate={{
                    color: isSelected ? "#F1F1F1" : "rgba(241, 241, 241, 0.3)",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="w-full border-b py-2 md:w-auto md:border-0 md:py-0 whitespace-nowrap">
                    {item.label}
                  </p>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/60 font-mono text-sm hidden md:block"
                      >
                        {item.year}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  className="h-[92%] rounded-xl object-cover pl-2 pr-[1.3vw] pt-[1.3vw] md:h-full md:pb-[1.3vw] md:pl-[4vw]"
                >
                  <motion.img
                    src={item.image}
                    alt={item.label}
                    className="h-full w-full rounded-xl object-cover"
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export const Skipper35 = HoverExpandGallery;
export const DemoSkipper35 = Skipper35;
export default Skipper35;
