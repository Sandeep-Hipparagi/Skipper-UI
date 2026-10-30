"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function useLoop(interval: number = 1000) {
  const [key, setKey] = useState(0);

  const increment = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const timer = setInterval(increment, interval);
    return () => clearInterval(timer);
  }, [interval, increment]);

  return { key };
}

const WORDS = [
  "Tik-Tik uno",
  "Tik-Tik dos",
  "Tik-Tik tres",
  "Tik-Tik cuatro",
  "Tik-Tik cinco",
  "Tik-Tik seis",
  "Tik-Tik siete",
  "Tik-Tik ocho",
  "Tik-Tik nueve",
  "Tik-Tik diez",
];

export function Skipper62() {
  const { key } = useLoop(1000);
  const currentWord = useMemo(() => WORDS[key % WORDS.length], [key]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-[#f5f4f3] p-8 text-black">
      <div className="mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          useLoop hook
        </span>
      </div>
      <AnimatePresence mode="popLayout">
        <motion.h1
          key={key}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.3 }}
          className="whitespace-nowrap text-center text-4xl font-bold tracking-tight md:text-6xl"
        >
          {currentWord}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}

export { Skipper62 as DemoSkipper62 };
export default Skipper62;
