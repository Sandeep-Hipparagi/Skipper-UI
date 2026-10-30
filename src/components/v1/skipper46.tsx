"use client";

import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

export function NextMark() {
  const id = useId();
  const clipId = `${id}-clip`;
  const paint0Id = `${id}-paint0-linear`;
  const paint1Id = `${id}-paint1-linear`;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ translate: "-0.5px" }}
    >
      <g clipPath={`url(#${clipId})`}>
        <path
          d="M17.2571 18.5026L4.75568 2.39941H2.40027V13.5947H4.2846V4.79242L15.7779 19.642C16.2965 19.2949 16.7906 18.914 17.2571 18.5026Z"
          fill={`url(#${paint0Id})`}
        />
        <rect
          x="11.8892"
          y="2.39941"
          width="1.86667"
          height="11.2"
          fill={`url(#${paint1Id})`}
        />
      </g>
      <defs>
        <linearGradient
          id={paint0Id}
          x1="10.9558"
          y1="12.1216"
          x2="16.478"
          y2="18.9661"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.604072" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={paint1Id}
          x1="12.8225"
          y1="2.39941"
          x2="12.7912"
          y2="10.6244"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function GooeyFilter() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 pointer-events-none"
      version="1.1"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4.4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

export function Skipper46() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative h-full w-full border bg-white text-white">
      <GooeyFilter />
      <motion.div
        style={{ filter: "url(#goo)" }}
        className="absolute bottom-[40%] left-1/2 -translate-x-1/2"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 0, width: 40, height: 40, borderRadius: 20 }}
              animate={{
                y: -50,
                width: 200,
                height: "auto",
                borderRadius: 10,
                transition: {
                  ...springConfig,
                  delay: 0.15,
                  y: { ...springConfig, delay: 0 },
                },
              }}
              exit={{
                y: 0,
                width: 40,
                height: 40,
                borderRadius: 20,
                transition: {
                  ...springConfig,
                  y: { ...springConfig, delay: 0.15 },
                },
              }}
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              className="absolute bottom-0 overflow-hidden rounded-full bg-black"
            >
              <motion.div
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                className="grid w-[200px] space-y-3 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-geist-mono text-sm tracking-tighter opacity-50">
                    Next.js
                  </span>
                  <span className="font-geist-mono text-right text-sm tracking-tighter opacity-50">
                    v13.4.8
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-geist text-sm font-semibold">Errors</span>
                  <div className="relative flex items-center justify-center">
                    <span className="font-geist text-right text-sm font-semibold text-red-500">
                      3
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-geist text-sm font-semibold">Route</span>
                  <span className="font-geist text-right text-sm font-semibold opacity-45">
                    Static
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className={cn(
            "flex size-10 cursor-pointer items-center justify-center rounded-full bg-black",
            "relative after:absolute after:bottom-0 after:h-[150%] after:w-full after:rounded-b-full after:p-5 after:content-['']"
          )}
        >
          <NextMark />
        </div>
      </motion.div>
    </div>
  );
}

export { Skipper46 as DemoSkipper46 };
export default Skipper46;
