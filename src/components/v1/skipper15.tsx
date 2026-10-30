"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const PreLoader_006: React.FC = () => {
  const [percent, setPercent] = useState(0);
  const [showCard1, setShowCard1] = useState(false);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);

  useEffect(() => {
    if (percent >= 100) return;
    const intervals = [250, 250, 100, 250, 250, 100, 300, 250, 250, 500];
    const step = Math.floor(percent / 10);
    if (step < intervals.length) {
      const t = setTimeout(() => {
        setPercent((prev) => prev + 10);
      }, intervals[step]);
      return () => clearTimeout(t);
    }
  }, [percent]);

  useEffect(() => {
    if (percent >= 20) setShowCard1(true);
    if (percent >= 50) setShowCard2(true);
    if (percent >= 70) setShowCard3(true);
  }, [percent]);

  return (
    <div className="relative z-50 flex h-screen w-screen items-center justify-center bg-[#F1F1F2] p-4">
      {/* Central Loader Card */}
      <div className="w-[340px] rounded-2xl bg-white shadow-xl border border-black/5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#121212]/70">
            Loader
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="size-2.5 rounded-full bg-[#F1F1F2]" />
            <div className="size-2.5 rounded-full bg-[#F1F1F2]" />
          </div>
        </div>

        <hr className="opacity-10" />

        <div className="p-5">
          <div className="flex w-full gap-1.5 rounded-xl bg-[#F1F1F2]/60 p-2.5 justify-between">
            {[...Array(10)].map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "size-6 rounded-md transition-colors duration-300",
                  percent >= (idx + 1) * 10 ? "bg-[#121212]/80" : "bg-[#EEEEEF]"
                )}
              />
            ))}
          </div>
          <p className="mt-4 text-right font-mono font-bold tracking-tight text-sm text-[#121212]/80">
            {percent}%
          </p>
        </div>
      </div>

      {/* Floating Draggable Info Cards */}
      <AnimatePresence>
        {showCard1 && (
          <motion.div
            drag
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, bounce: 0.4, type: "spring" }}
            className="absolute bottom-[12%] right-[10%] cursor-grab overflow-hidden rounded-2xl bg-white shadow-lg active:cursor-grabbing border border-black/5 w-64 p-3 z-30"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs uppercase font-medium text-black/60">Useful info</span>
              <div className="size-2 rounded-full bg-green-500" />
            </div>
            <p className="text-xs text-neutral-600 font-sans">
              Dynamic layout engine with zero runtime CSS-in-JS overhead.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCard2 && (
          <motion.div
            drag
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, bounce: 0.4, type: "spring" }}
            className="absolute top-[15%] left-[10%] cursor-grab overflow-hidden rounded-2xl bg-white shadow-lg active:cursor-grabbing border border-black/5 w-64 p-3 z-30"
          >
            <div className="flex items-center justify-between pb-2">
              <span className="font-mono text-xs uppercase font-medium text-black/60">High Performance</span>
              <div className="size-2 rounded-full bg-blue-500" />
            </div>
            <p className="text-xs text-neutral-600 font-sans">
              All transitions running at 60-120fps with GPU layer acceleration.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Skipper15: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-white">
      <AnimatePresence mode="popLayout">
        {loading ? (
          <motion.div
            key="preloader"
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            className="h-full w-full fixed inset-0 z-50"
            transition={{ duration: 1, ease: [0.785, 0.135, 0.15, 0.86] }}
          >
            <PreLoader_006 />
          </motion.div>
        ) : (
          <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-white font-mono font-medium uppercase text-black/60 p-8">
            <p className="text-sm tracking-widest text-neutral-400">Get your</p>
            <img src="/svgs/dot-logo.svg" alt="logo" className="h-10 w-auto" />
            <p className="text-sm tracking-widest text-neutral-400">now</p>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const DemoSkipper15 = Skipper15;
export default Skipper15;
