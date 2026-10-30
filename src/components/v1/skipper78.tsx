"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  { src: "/images/oct25Coll/skipperpro/shoreel-1.png", label: "Share meeting takeaways in a fraction of the time" },
  { src: "/images/oct25Coll/skipperpro/shoreel-9.png", label: "Share meeting takeaways in a fraction of the time" },
  { src: "/images/oct25Coll/skipperpro/shoreel-8.png", label: "Share meeting takeaways in a fraction of the time" },
  { src: "/images/oct25Coll/skipperpro/shoreel-5.png", label: "Share meeting takeaways in a fraction of the time" },
  { src: "/images/oct25Coll/skipperpro/shoreel-6.png", label: "Share meeting takeaways in a fraction of the time" },
];

const slideVariants = {
  initial: () => ({ opacity: 0, filter: "blur(4px)" }),
  active: {
    x: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: 0.3, duration: 0.3, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    x: `${-30 * direction}%`,
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: "easeOut" as const },
  }),
};

export function Skipper78() {
  const [current, setCurrent] = useState(0);
  const progress = useMotionValue(100);
  const [direction, setDirection] = useState(1);

  const clipPathTemplate = useMotionTemplate`inset(0 ${progress}% 0 0 round 10px)`;

  useEffect(() => {
    const timer = setInterval(() => {
      const val = progress.get();
      if (val > 0) {
        progress.set(val - 1);
      } else {
        clearInterval(timer);
        progress.set(100);
        if (current < SLIDES.length - 1) {
          setCurrent((prev) => prev + 1);
          setDirection(1);
        } else {
          setCurrent(0);
        }
      }
    }, 50);

    return () => clearInterval(timer);
  }, [progress, current]);

  return (
    <div className="font-satoshi relative flex h-full min-h-screen w-screen flex-col items-center justify-center gap-12 overflow-hidden bg-[#f5f4f3] p-8 text-black">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tighter">UI for future</h1>
        <p className="mt-4 text-2xl text-black/50">Collection of unusual UI components</p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={() => {
            progress.set(100);
            setCurrent((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
            setDirection(-1);
          }}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/10 text-black/50 hover:bg-black/20 active:scale-95 transition-all"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center justify-center gap-1.5">
          {SLIDES.map((_, idx) => (
            <motion.button
              key={idx}
              initial={false}
              onClick={() => {
                progress.set(100);
                setCurrent(idx);
                setDirection(idx > current ? 1 : -1);
              }}
              animate={{ width: idx === current ? "32px" : "8px" }}
              className="relative flex h-2 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-black/15"
            >
              {current === idx && (
                <motion.div
                  style={{ clipPath: clipPathTemplate }}
                  className="absolute left-0 top-0 h-full w-full origin-left rounded-full bg-black"
                />
              )}
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => {
            progress.set(100);
            setCurrent((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
            setDirection(1);
          }}
          className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-black/10 text-black/50 hover:bg-black/20 active:scale-95 transition-all"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={current}
          variants={slideVariants}
          initial="initial"
          animate="active"
          exit="exit"
          custom={direction}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
          className="flex w-full max-w-3xl flex-col items-center justify-center"
        >
          <p className="mb-6 text-2xl font-medium text-black/50">Available with shadcn CLI 3.0</p>
          <div className="h-[550px] w-full overflow-hidden rounded-[2.5rem] bg-black/5 p-1 shadow-2xl border border-black/10">
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={SLIDES[current].src}
              alt={SLIDES[current].label}
              className="h-full w-full rounded-[2.2rem] object-cover"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { Skipper78 as DemoSkipper78 };
export default Skipper78;
