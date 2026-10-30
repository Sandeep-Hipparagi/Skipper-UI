"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const WORDS = [
  "We are",
  "the simplest.",
  "No complexity.",
  "No confusion.",
  "Just pure",
  "simplicity.",
  "Powerful AI",
  "that anyone",
  "can use.",
  "That's how",
  "we change",
  "the world.",
];

export function Skipper88() {
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [-73, 242]);

  return (
    <div className="grid h-[300vh] w-full bg-background text-foreground">
      <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          scroll down to see
        </span>
      </div>

      <div className="relative w-full">
        <div
          className="sticky top-1/2 -translate-y-1/2"
          style={{ perspective: "500px" }}
        >
          <motion.ul
            className="relative w-full"
            style={{ transformStyle: "preserve-3d", rotateX }}
          >
            {WORDS.map((word, idx) => {
              const deg = (-180 / WORDS.length) * idx;
              return (
                <li
                  key={idx}
                  className="backface-hidden absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center text-4xl font-semibold tracking-tighter md:text-5xl whitespace-nowrap"
                  style={{
                    transform: `rotateX(${deg}deg) translateZ(150px)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {word}
                </li>
              );
            })}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}

export function DemoSkipper88() {
  return <Skipper88 />;
}

export default Skipper88;
