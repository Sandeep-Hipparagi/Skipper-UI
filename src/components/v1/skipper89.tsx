"use client";

import React, { useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";

export function Skipper89() {
  const { scrollYProgress } = useScroll();
  const [progressPercent, setProgressPercent] = useState(0);

  const clampedProgress = useTransform(scrollYProgress, (v) =>
    Math.min(Math.max(v, 0), 1)
  );
  const roundedPercent = useTransform(clampedProgress, (v) => Math.round(100 * v));

  useMotionValueEvent(roundedPercent, "change", (latest) => {
    setProgressPercent(latest);
  });

  const circumference = 2 * Math.PI * 18;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground py-[50vh]">
      <motion.div
        drag
        dragMomentum={false}
        className="group fixed bottom-4 right-4 z-50 flex cursor-grab flex-col items-center justify-center active:cursor-grabbing"
      >
        <NumberFlow
          value={progressPercent}
          suffix="%"
          className="text-foreground/60 absolute top-1 flex h-8 -translate-y-full items-center justify-center px-4 text-xs font-medium tabular-nums opacity-0 transition-opacity group-hover:opacity-100"
        />

        <div className="bg-background/80 flex size-12 items-center justify-center rounded-2xl border backdrop-blur shadow-lg">
          <svg className="size-10" viewBox="0 0 48 48" role="presentation">
            <circle
              cx="24"
              cy="24"
              r={18}
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-20"
              fill="none"
            />
            <motion.circle
              cx="24"
              cy="24"
              r={18}
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              style={{
                pathLength: clampedProgress,
                rotate: -90,
                transformOrigin: "50% 50%",
              }}
            />
          </svg>
        </div>
      </motion.div>

      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          see the progress while scroll
        </span>
      </div>

      <div className="flex max-w-3xl flex-col gap-[8vh] px-6">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div
            key={idx}
            className="text-foreground/70 flex items-center justify-center text-justify text-base leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
        ))}
      </div>
    </div>
  );
}

export function DemoSkipper89() {
  return <Skipper89 />;
}

export default Skipper89;
