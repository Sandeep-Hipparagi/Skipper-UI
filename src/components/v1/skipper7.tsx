"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CityStat {
  name: string;
  value: number;
  date: string;
}

export const defaultCities: CityStat[] = [
  { name: "Sydney", value: 21.1, date: "2025-01-01" },
  { name: "Melbourne", value: 15.2, date: "2025-01-02" },
  { name: "Brisbane", value: 10.3, date: "2025-01-03" },
  { name: "Mumbai", value: 8.4, date: "2025-01-04" },
  { name: "Los Angeles", value: 6.5, date: "2025-01-05" },
  { name: "Mexico City", value: 4.6, date: "2025-01-06" },
  { name: "London", value: 2.7, date: "2025-01-07" },
];

export const NikePreloader: React.FC = () => {
  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <video
          src="/skipperv1/skipper7/nike.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="size-full object-cover opacity-80"
        />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50"
          style={{ backgroundImage: `url('/skipperv1/skipper7/bg.png')` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-white"
      >
        <span className="text-xs uppercase tracking-widest text-neutral-400">Loading</span>
        <h1 className="text-4xl font-black uppercase tracking-tighter sm:text-6xl text-[#F11313]">
          NIKE
        </h1>
      </motion.div>
    </div>
  );
};

export const NikeCityShowcase: React.FC<{ cities?: CityStat[] }> = ({
  cities = defaultCities,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black font-sans text-[#F11313] py-20 px-4">
      <motion.ul
        layout
        className="z-10 flex w-full flex-col items-center justify-center gap-1"
      >
        {cities.map((city, idx) => (
          <motion.li
            key={city.name}
            initial={{ y: 350, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              height: hoveredIdx === idx ? 120 : 80,
            }}
            transition={{
              duration: 0.7,
              ease: [0.215, 0.61, 0.355, 1],
              delay: 0.035 * idx + 0.3,
              height: { duration: 0.15, ease: "easeOut" },
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="relative my-2 flex w-fit cursor-pointer flex-col items-center lg:px-20"
          >
            <div className="relative flex items-start gap-5">
              <span className="text-[7vw] font-extrabold uppercase leading-[0.8] tracking-[-0.03em] select-none hover:opacity-80 transition-opacity">
                {city.name}
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-neutral-400 mt-1">
                {city.value}%
              </span>
            </div>

            {hoveredIdx === idx && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-mono text-neutral-400 mt-2"
              >
                Date recorded: {city.date}
              </motion.div>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};

export const Skipper7: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-full w-screen min-h-screen bg-black">
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1, ease: [0.785, 0.135, 0.15, 0.86] }}
          >
            <NikePreloader />
          </motion.div>
        ) : (
          <motion.div key="main" className="size-full">
            <NikeCityShowcase />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export const DemoSkipper7 = Skipper7;
export default Skipper7;
