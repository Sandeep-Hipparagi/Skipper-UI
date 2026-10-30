"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function Skipper95() {
  const { scrollYProgress } = useScroll();
  const clipBottom = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clipPath = useTransform(clipBottom, (v) => `inset(0 0 ${v}% 0)`);
  const percent = useTransform(scrollYProgress, [0, 1], [1, 100]);
  const displayPercent = useTransform(percent, (v) => Math.round(v));
  const pointerY = useTransform(scrollYProgress, [0, 1], [0, 190]);

  return (
    <div className="relative flex min-h-screen w-full bg-background text-foreground">
      <div className="z-10 fixed left-10 top-1/2 flex h-48 w-4 -translate-y-1/2 flex-col items-center justify-center">
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 5px)",
              opacity: 0.15,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              clipPath,
              backgroundImage:
                "repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 5px)",
            }}
          />
        </div>

        <motion.div
          style={{ y: pointerY }}
          className="bg-foreground text-foreground absolute left-0 top-0 flex h-px w-8 items-center justify-center text-sm font-medium tracking-tight"
        >
          <motion.span className="absolute -right-1 translate-x-full tabular-nums font-mono text-xs">
            {displayPercent}
          </motion.span>
        </motion.div>
      </div>

      <article className="mx-auto max-w-xl space-y-[10vh] py-[50vh] px-6">
        <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center pointer-events-none">
          <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
            Scroll down to see the effect
          </span>
        </div>

        {Array.from({ length: 12 }).map((_, idx) => (
          <div key={idx} className="text-justify text-foreground/80 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi alias similique eveniet corrupti cupiditate, saepe magni, distinctio at dolor dignissimos consequatur rerum quasi expedita soluta amet, fugiat quaerat commodi accusamus enim necessitatibus facere cumque dolores quisquam? Vero harum repellendus labore.
          </div>
        ))}
      </article>
    </div>
  );
}

export function DemoSkipper95() {
  return <Skipper95 />;
}

export default Skipper95;
