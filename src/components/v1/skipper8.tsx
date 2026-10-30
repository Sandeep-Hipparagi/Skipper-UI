"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const defaultWords = [
  "Hello",
  "bonjour",
  "Ciao",
  "Olá",
  "やあ",
  "Hallå",
  "Guten tag",
  "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ",
];

export const WordsPreloader: React.FC<{ words?: string[]; onComplete?: () => void }> = ({
  words = defaultWords,
  onComplete,
}) => {
  const [index, setIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index < words.length - 1) {
      const delay = index === 0 ? 800 : 160;
      const t = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(t);
    } else {
      if (onComplete) {
        const endTimer = setTimeout(onComplete, 600);
        return () => clearTimeout(endTimer);
      }
    }
  }, [index, words.length, onComplete]);

  const w = dimensions.width;
  const h = dimensions.height;
  const initialCurve = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h + 300} 0 ${h} L0 0`;
  const exitCurve = `M0 0 L${w} 0 L${w} ${h} Q${w / 2} ${h} 0 ${h} L0 0`;

  return (
    <motion.div
      variants={{
        initial: { top: 0 },
        exit: {
          top: "-100vh",
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
        },
      }}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-white text-black"
    >
      {dimensions.width > 0 && (
        <>
          <motion.p
            key={index}
            variants={{
              initial: { opacity: 0 },
              enter: { opacity: 0.85, transition: { duration: 0.3 } },
            }}
            initial="initial"
            animate="enter"
            className="absolute z-10 flex items-center gap-6 text-5xl font-semibold tracking-tighter md:text-7xl"
          >
            {words[index]}
          </motion.p>
          <svg className="absolute top-0 h-[calc(100%+300px)] w-full pointer-events-none">
            <motion.path
              variants={{
                initial: { d: initialCurve, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
                exit: { d: exitCurve, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } },
              }}
              initial="initial"
              exit="exit"
              className="fill-white shadow-[0_0_10px_#fff]"
            />
          </svg>
        </>
      )}
    </motion.div>
  );
};

export const Skipper8: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-background text-foreground flex items-center justify-center">
      <AnimatePresence mode="wait">
        {loading && <WordsPreloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <section className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Typography Preloader</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          Multilingual word cycle with smooth SVG quadratic bezier curve wipe.
        </p>
      </section>
    </main>
  );
};

export const DemoSkipper8 = Skipper8;
export default Skipper8;
