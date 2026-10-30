"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Stroke: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    width="128"
    height="21"
    viewBox="0 0 128 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g clipPath="url(#clip0_3_592)">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        d="M2.12988 2.1001L58.1362 2.1001L127.805 8.4001L31.6326 10.5001L90.1184 18.9001L65.0899 18.9001"
        stroke="#FFAD42"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_3_592">
        <rect width="128" height="21" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const PixelPreloader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const shuffleArray = (arr: number[]) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  return (
    <motion.div className="fixed inset-0 z-50 bg-white">
      <motion.div
        className="fixed left-1/2 z-40 flex min-h-screen w-screen -translate-x-1/2 flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <div className="fixed z-0 size-[400px] rounded-full bg-neutral-100 blur-3xl pointer-events-none" />
        <div className="relative z-10 font-sans text-3xl md:text-5xl tracking-tight text-black/80 font-bold space-y-1">
          <h1>AI that Converts</h1>
          <div className="relative inline-block">
            <h1>LinkedIn to Professional</h1>
            <Stroke className="absolute right-0 -bottom-3 stroke-[#FFAD42]/80 w-full" />
          </div>
          <h1 className="pt-2">Website in minutes</h1>
        </div>
      </motion.div>

      {/* Granular 20-column Pixel Grid */}
      <div className="pointer-events-none fixed inset-0 z-[2] flex">
        {[...Array(20)].map((_, colIdx) => (
          <div key={colIdx} className="flex w-[5vw] flex-col">
            {mounted &&
              (() => {
                const { width, height } = dimensions;
                const rowsCount = Math.ceil(height / (0.05 * width));
                const order = shuffleArray([...Array(rowsCount)].map((_, i) => i));

                return order.map((randomDelayIdx, rowIdx) => (
                  <motion.div
                    key={rowIdx}
                    className="h-[5vw] w-full border-[0.2px] border-white bg-[#f5f5f5]"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0, delay: 0.03 * randomDelayIdx }}
                  />
                ));
              })()}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export const Skipper11: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-white text-black">
      <AnimatePresence>
        {loading && <PixelPreloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <section className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-orange-500">Pixel Preloader</h1>
        <p className="mt-2 text-neutral-600 max-w-md">
          Retro granular pixel dissolve grid with randomized unmount delays.
        </p>
      </section>
    </main>
  );
};

export const DemoSkipper11 = Skipper11;
export default Skipper11;
