"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ReactLenis } from "lenis/react";

export interface CardItem {
  title: string;
  src: string;
}

export interface StickyCardProps {
  i: number;
  title: string;
  src: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const defaultCards: CardItem[] = [
  { title: "Project 1", src: "/examples/photo-017.jpg" },
  { title: "Project 2", src: "/examples/photo-023.jpg" },
  { title: "Project 3", src: "/examples/photo-019.jpg" },
  { title: "Project 4", src: "/examples/photo-024.jpg" },
  { title: "Project 5", src: "/examples/photo-021.jpg" },
];

export const StickyCard_001: React.FC<StickyCardProps> = ({
  i,
  title,
  src,
  progress,
  range,
  targetScale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={containerRef} className="sticky top-0 flex items-center justify-center">
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${20 * i + 250}px)`,
        }}
        className="rounded-4xl relative -top-1/4 flex h-[300px] w-[500px] origin-top flex-col overflow-hidden"
      >
        <img src={src} alt={title} className="h-full w-full object-cover" />
      </motion.div>
    </div>
  );
};

export const Skipper16: React.FC<{ cards?: CardItem[] }> = ({ cards = defaultCards }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main
        ref={containerRef}
        className="relative flex w-full flex-col items-center justify-center pb-[100vh] pt-[50vh]"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down to see card stack
          </span>
        </div>
        {cards.map((card, index) => {
          const targetScale = Math.max(0.5, 1 - (cards.length - index - 1) * 0.1);
          return (
            <StickyCard_001
              key={`p_${index}`}
              i={index}
              {...card}
              progress={scrollYProgress}
              range={[0.25 * index, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export const DemoSkipper16 = Skipper16;
export default Skipper16;
