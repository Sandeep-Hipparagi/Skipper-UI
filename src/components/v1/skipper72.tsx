"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordProps {
  word: string;
  index: number;
  totalWords: number;
  scrollProgress: MotionValue<number>;
}

function Word({ word, index, totalWords, scrollProgress }: WordProps) {
  const start = 0.015 * index;
  const end = start + 0.3;
  const maxRange = (totalWords - 1) * 0.015 + 0.3;

  const clampedProgress = useTransform(scrollProgress, [0, maxRange, 1], [0, maxRange, 1]);
  const x = useTransform(clampedProgress, [start, end], [1200, 0]);
  const opacity = useTransform(clampedProgress, [start, end], [0, 1]);

  return (
    <motion.span
      className="mr-2 inline-block"
      style={{ x, opacity }}
    >
      {word}
    </motion.span>
  );
}

export interface HorizontalTextRevealProps {
  children: string;
  className?: string;
}

export function HorizontalTextReveal({ children, className }: HorizontalTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const words = children.split(" ");

  return (
    <div ref={containerRef} className="h-[500vh] w-full overflow-x-clip">
      <div className="sticky top-0 flex h-screen items-center px-6">
        <p
          className={cn(
            "w-[80%] text-[3.9vw] font-medium leading-[0.9] tracking-[-0.03em] md:w-[60%]",
            className
          )}
        >
          {words.map((word, idx) => (
            <Word
              key={idx}
              word={word}
              index={idx}
              totalWords={words.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </div>
  );
}

export function Skipper72() {
  return (
    <section className="font-geist min-h-screen bg-[#121212] text-[22px] font-medium leading-[1.3] text-white">
      <HorizontalTextReveal>
        Here our journey begins. From (2020 → 2024) we built something incredible. Starting with late-night coding sessions and ending with AI that actually understands you. Pretty cool right?
      </HorizontalTextReveal>
    </section>
  );
}

export { Skipper72 as DemoSkipper72 };
export default Skipper72;
