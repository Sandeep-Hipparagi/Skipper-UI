"use client";

import React from "react";
import { motion } from "framer-motion";

export function SkipperGooeyFilterProvider() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 pointer-events-none"
      version="1.1"
    >
      <defs>
        <filter id="SkipperGooeyFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="SkipperGooeyFilter"
          />
          <feBlend in="SourceGraphic" in2="SkipperGooeyFilter" />
        </filter>
      </defs>
    </svg>
  );
}

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const initialShape = {
  y: 0,
  width: 50,
  height: 50,
  borderRadius: 40,
};

const animateShape = {
  y: -60,
  width: 200,
  height: 100,
  borderRadius: 10,
  transition: {
    ...springConfig,
    delay: 0.15,
    y: { ...springConfig, delay: 0 },
  },
};

export function Skipper64() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] text-black">
      <SkipperGooeyFilterProvider />
      <div className="absolute top-[20%] grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Drag the elements to see the effect
        </span>
      </div>
      <ul
        className="relative flex flex-col justify-end rounded-2xl p-8"
        style={{ filter: "url(#SkipperGooeyFilter)" }}
      >
        <motion.li
          drag
          dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
          initial={initialShape}
          animate={animateShape}
          className="absolute bg-black shadow-lg cursor-grab active:cursor-grabbing"
        />
        <motion.li
          drag
          dragConstraints={{ left: -150, right: 150, top: -150, bottom: 150 }}
          className="size-12 rounded-full bg-black shadow-lg cursor-grab active:cursor-grabbing"
        />
      </ul>
    </div>
  );
}

export { Skipper64 as DemoSkipper64 };
export default Skipper64;
