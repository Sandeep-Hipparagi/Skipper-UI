"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AppleBorderGradientProps {
  preview?: boolean;
  className?: string;
  intensity?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export function AppleBorderGradient({
  preview = false,
  className,
  intensity = "lg",
}: AppleBorderGradientProps) {
  const intensityMap = {
    xs: "after:blur-xs",
    sm: "after:blur-sm",
    md: "after:blur-md",
    lg: "after:blur-lg",
    xl: "after:blur-xl",
    "2xl": "after:blur-2xl",
    "3xl": "after:blur-3xl",
  };

  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{
            opacity: 1,
            background: [
              "linear-gradient(0deg, rgb(59, 130, 246), rgb(168, 85, 247), rgb(239, 68, 68), rgb(249, 115, 22))",
              "linear-gradient(360deg, rgb(59, 130, 246), rgb(168, 85, 247), rgb(239, 68, 68), rgb(249, 115, 22))",
            ],
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeInOut" },
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
          className={cn(
            "after:bg-muted absolute size-full after:absolute after:inset-[2px] after:content-['']",
            className,
            intensityMap[intensity]
          )}
        />
      )}
    </AnimatePresence>
  );
}

export function Skipper86() {
  const [active, setActive] = useState(false);

  const playSweep = () => {
    try {
      const audio = new Audio("/audio/sweep1.mp3");
      audio.volume = 0.7;
      audio.play().catch(() => {});
    } catch {}
  };

  const handleToggle = () => {
    if (!active) {
      playSweep();
    }
    setActive((prev) => !prev);
  };

  return (
    <motion.div className="relative flex min-h-screen w-full items-center justify-center bg-background text-foreground">
      <AppleBorderGradient intensity="xl" preview={active} />
      <div className="absolute left-1/2 top-[30%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="text-foreground after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Click to see the border gradient
        </span>
      </div>
      <div className="z-10 relative flex size-full items-center justify-center">
        <button
          type="button"
          onClick={handleToggle}
          style={{ boxShadow: "0 0 0 1px var(--muted)" }}
          className="bg-background rounded-2xl px-5 py-2 transition-all duration-300 active:scale-[0.98] border border-border shadow-sm font-medium text-sm"
        >
          Turn {active ? "Off" : "On"} Apple Intelligence
        </button>
      </div>
    </motion.div>
  );
}

export function DemoSkipper86() {
  return <Skipper86 />;
}

export default Skipper86;
