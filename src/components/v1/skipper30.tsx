"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Lenis from "lenis";

export interface ColumnProps {
  images: string[];
  y: MotionValue<number>;
}

export const Column: React.FC<ColumnProps> = ({ images, y }) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[250px] flex-col gap-[2vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-75%]"
      style={{ y }}
    >
      {images.map((src, index) => (
        <div key={index} className="relative h-full w-full overflow-hidden rounded-2xl">
          <img
            src={src}
            alt="Gallery item"
            className="pointer-events-none h-full w-full object-cover"
          />
        </div>
      ))}
    </motion.div>
  );
};

export const OliverParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const { height } = dimensions;
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 2 * height]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 3.3 * height]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 1.25 * height]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 3 * height]);

  useEffect(() => {
    const lenis = new Lenis();
    let reqId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      reqId = requestAnimationFrame(raf);
    };

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    reqId = requestAnimationFrame(raf);
    handleResize();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full bg-[#eee] text-black">
      {/* Top scroll cue */}
      <div className="flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            scroll down to see
          </span>
        </div>
      </div>

      {/* 4-column parallax canvas */}
      <div
        ref={containerRef}
        className="relative box-border flex h-[175vh] gap-[2vw] overflow-hidden bg-white p-[2vw]"
      >
        <Column
          images={[
            "/examples/photo-024.jpg",
            "/examples/photo-030.jpg",
            "/examples/photo-012.jpg",
          ]}
          y={y1}
        />
        <Column
          images={[
            "/examples/photo-013.jpg",
            "/examples/photo-014.jpg",
            "/examples/photo-015.jpg",
          ]}
          y={y2}
        />
        <Column
          images={[
            "/examples/photo-016.jpg",
            "/examples/photo-017.jpg",
            "/examples/photo-033.jpg",
          ]}
          y={y3}
        />
        <Column
          images={[
            "/examples/photo-016.jpg",
            "/examples/photo-017.jpg",
            "/examples/photo-033.jpg",
          ]}
          y={y4}
        />
      </div>

      {/* Bottom scroll cue */}
      <div className="relative flex h-screen items-center justify-center gap-2">
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            scroll Up to see
          </span>
        </div>
      </div>
    </main>
  );
};

export const Skipper30 = OliverParallax;
export const DemoSkipper30 = Skipper30;
export default Skipper30;
