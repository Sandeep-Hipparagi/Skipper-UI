"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const DualStairsPreloader: React.FC<{ phrase?: string }> = ({
  phrase = "The first-ever AGI. Period.",
}) => {
  const words = phrase.split(" ");

  return (
    <motion.div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute z-10 flex h-full w-full items-center justify-center text-center text-white px-4">
        <motion.h1
          className="text-3xl font-semibold tracking-tighter md:text-5xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.5 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          {words.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.15 * idx }}
              className="mr-2.5 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      {/* Top half 10 columns retracting upwards */}
      <div className="pointer-events-none fixed left-0 top-0 z-[2] flex h-[50vh] w-full">
        {[...Array(10)].map((_, idx) => (
          <motion.div
            key={`top-${idx}`}
            initial={{ height: "100%" }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + 0.05 * idx,
              ease: [0.455, 0.03, 0.515, 0.955],
            }}
            className="h-full w-[10vw] bg-black origin-top"
          />
        ))}
      </div>

      {/* Bottom half 10 columns retracting downwards */}
      <div className="pointer-events-none fixed bottom-0 left-0 z-[2] flex h-[50vh] w-full items-end">
        {[...Array(10)].map((_, idx) => (
          <motion.div
            key={`bot-${idx}`}
            initial={{ height: "100%" }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.4 + 0.05 * idx,
              ease: [0.455, 0.03, 0.515, 0.955],
            }}
            className="h-full w-[10vw] bg-black origin-bottom"
          />
        ))}
      </div>
    </motion.div>
  );
};

export const Skipper10: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-white text-black flex items-center justify-center">
      <AnimatePresence mode="wait">
        {loading && <DualStairsPreloader />}
      </AnimatePresence>

      <section className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Dual-Split Stairs Preloader</h1>
        <p className="mt-2 text-neutral-600 max-w-md">
          Synchronized dual-axis 20-column curtain split revealing the page.
        </p>
      </section>
    </main>
  );
};

export const DemoSkipper10 = Skipper10;
export default Skipper10;
