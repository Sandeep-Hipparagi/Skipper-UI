"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export function DebugPanel({
  className,
  ...props
}: {
  className?: string;
  // FIX: Replace any with unknown index signature
  [key: string]: unknown;
}) {
  return (
    <div className={cn("z-50 font-mono text-sm text-red-500 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-red-500/20 backdrop-blur shadow-sm", className)}>
      {"{"}
      {Object.entries(props).map(([key, val]) => (
        <div key={key} className="ml-4">
          {key}:{" "}
          {val && typeof val === "object" && "get" in val ? (
            <motion.span>{val as unknown as string | number}</motion.span>
          ) : typeof val === "boolean" ? (
            val ? "true" : "false"
          ) : (
            String(val)
          )}
          ;
        </div>
      ))}
      {"}"}
    </div>
  );
}

export function Skipper102() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [count, setCount] = useState(0);
  const [keyPressed, setKeyPressed] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => setKeyPressed(e.key);
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      onClick={() => setCount((c) => c + 1)}
      className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground p-6 cursor-pointer select-none"
    >
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Debug Panel
        </span>
      </div>

      <DebugPanel
        className="max-w-md w-full"
        count={count}
        mouseX={mouseX}
        mouseY={mouseY}
        keyPressed={keyPressed || "none"}
      />
    </div>
  );
}

export function DemoSkipper102() {
  return <Skipper102 />;
}

export default Skipper102;
