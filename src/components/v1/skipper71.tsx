"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";

const IMAGES = [
  { title: "Digital Architecture", image: "/examples/photo-080.jpg" },
  { title: "Horizon Beyond", image: "/examples/photo-081.jpg" },
  { title: "Sound Wave Circuit", image: "/examples/photo-091.jpg" },
  { title: "Light Writer", image: "/examples/photo-073.jpg" },
  { title: "Star Explorer", image: "/examples/photo-017.jpg" },
];

export function ImageRevealShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rawProgress, setRawProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressTransform = useTransform(scrollYProgress, [0, 1], [0, 5]);

  useEffect(() => {
    return progressTransform.on("change", (v) => {
      const idx = Math.floor(v);
      if (idx !== activeIndex && idx < IMAGES.length) {
        setActiveIndex(idx);
      }
      setRawProgress(v);
    });
  }, [progressTransform, activeIndex]);

  const fraction = rawProgress - Math.floor(rawProgress);

  return (
    <ReactLenis root>
      <div ref={containerRef} className="h-[1000vh] w-full">
        <section className="sticky top-0 h-screen w-full bg-[#121212] overflow-hidden">
          <div className="absolute right-4 top-1/2 h-32 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-[rgb(40,40,40)] lg:right-12">
            <motion.div
              className="absolute left-0 top-0 z-10 w-full bg-white"
              style={{
                height:
                  Math.floor(rawProgress) < 5
                    ? `${100 * fraction}%`
                    : "100%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {IMAGES.map((item, idx) => {
            const scale =
              idx === activeIndex
                ? 1 - 0.25 * fraction
                : idx < activeIndex
                ? 0.75
                : 1.25;

            let animStyle: React.CSSProperties = {
              opacity: 0,
              clipPath:
                "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
              filter: "brightness(3) contrast(2.5)",
            };

            if (idx === activeIndex) {
              const t = Math.min(2 * fraction, 1);
              animStyle = {
                opacity: 1,
                clipPath: `polygon(0% ${100 - 100 * t}%, 100% ${
                  100 - 100 * t
                }%, 100% 100%, 0% 100%)`,
                filter: `brightness(${1 + (1 - t) * 2}) contrast(${
                  1 + (1 - t) * 1.5
                })`,
              };
            } else if (idx < activeIndex) {
              animStyle = {
                opacity: fraction > 0.5 ? 0 : 1,
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                filter: "brightness(1) contrast(1)",
              };
            }

            return (
              <motion.div
                key={idx}
                className="absolute left-1/2 top-1/2 h-[70%] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl"
                style={{
                  scale,
                  ...animStyle,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            );
          })}
        </section>
      </div>
    </ReactLenis>
  );
}

export function Skipper71() {
  return (
    <div className="h-full w-full bg-[#121212] text-white">
      <div className="my-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll down to reveal the images
        </span>
      </div>
      <ImageRevealShowcase />
    </div>
  );
}

export { Skipper71 as DemoSkipper71 };
export default Skipper71;
