"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function BreakpointIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border border-black/10 bg-black px-3.5 py-1.5 font-mono text-xs font-semibold text-white shadow-xl",
        className
      )}
    >
      <span className="block sm:hidden">xs &lt; 640px</span>
      <span className="hidden sm:block md:hidden">sm &ge; 640px</span>
      <span className="hidden md:block lg:hidden">md &ge; 768px</span>
      <span className="hidden lg:block xl:hidden">lg &ge; 1024px</span>
      <span className="hidden xl:block 2xl:hidden">xl &ge; 1280px</span>
      <span className="hidden 2xl:block">2xl &ge; 1536px</span>
    </div>
  );
}

export function Skipper65() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] p-8 text-black">
      <div className="mb-40 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          minimal Breakpoint indicator
        </span>
      </div>
      <BreakpointIndicator />
    </div>
  );
}

export { Skipper65 as DemoSkipper65 };
export default Skipper65;
