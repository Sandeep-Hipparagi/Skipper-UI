"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function AnimatedArrow({ className }: { className?: string }) {
  return (
    <div className={cn("group flex size-full cursor-pointer items-center justify-center", className)}>
      <div className="relative grid cursor-pointer items-center justify-center">
        <ChevronRight className="size-5 transition-all duration-500 ease-out group-hover:translate-x-0.5" />
        <div className="absolute right-[9px] h-[2px] w-3 origin-right scale-x-0 rounded-[1px] bg-current transition-all duration-300 ease-out group-hover:right-[7px] group-hover:scale-x-100" />
      </div>
    </div>
  );
}

function AnimatedHamburger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={cn("group flex size-full cursor-pointer items-center justify-center", className)}
    >
      <div className="relative grid size-4 cursor-pointer items-center justify-center">
        <motion.div
          animate={{ y: open ? 0 : -5, rotate: open ? 45 : 0 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        />
        <motion.div
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: 0.1 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        />
        <motion.div
          animate={{ y: open ? 0 : 5, rotate: open ? -45 : 0 }}
          className="absolute h-0.5 w-full rounded-full bg-current"
        />
      </div>
    </div>
  );
}

function AnimatedVolume({ className }: { className?: string }) {
  const [muted, setMuted] = useState(false);

  return (
    <div
      onClick={() => setMuted((prev) => !prev)}
      className={cn("group flex size-full cursor-pointer items-center justify-center", className)}
    >
      <motion.div
        initial={false}
        className="relative flex size-5 items-center justify-center"
        animate={{ rotate: muted ? [0, -15, 5, -2, 0] : 0 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-full">
          <path
            fill="currentColor"
            stroke="none"
            d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
          />
          <g>
            <path
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              d="M16 9a5 5 0 0 1 0 6"
            />
            <path
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="currentColor"
              d="M19.364 18.364a9 9 0 0 0 0-12.728"
            />
          </g>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rotate-[-40deg] overflow-hidden">
            <motion.div
              animate={{ scaleY: muted ? 1 : 0 }}
              transition={{ ease: "easeInOut", duration: muted ? 0.125 : 0.05, delay: muted ? 0.15 : 0 }}
              style={{ transformOrigin: "top" }}
              className="h-[18px] w-fit rounded-full"
            >
              <div className="bg-background flex h-full w-[3.5px] items-center justify-center rounded-full">
                <div className="bg-foreground h-full w-[1.5px] rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function Skipper99() {
  return (
    <div className="bg-muted flex min-h-screen w-full flex-col items-center justify-center p-6 text-foreground">
      <div className="grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Try Hover/Click the icons
        </span>
      </div>

      <div className="mt-20 flex w-full max-w-3xl flex-wrap items-center justify-center gap-4 px-5">
        <div className="size-20 bg-background rounded-3xl shadow-sm border flex items-center justify-center">
          <AnimatedArrow />
        </div>
        <div className="size-20 bg-background rounded-3xl shadow-sm border flex items-center justify-center">
          <AnimatedHamburger />
        </div>
        <div className="size-20 bg-background rounded-3xl shadow-sm border flex items-center justify-center">
          <AnimatedVolume />
        </div>
      </div>
    </div>
  );
}

export function DemoSkipper99() {
  return <Skipper99 />;
}

export default Skipper99;
