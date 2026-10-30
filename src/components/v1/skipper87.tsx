"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function Skipper87() {
  return (
    <div className="bg-muted flex min-h-screen w-full flex-col items-center justify-center gap-10 p-4">
      <div className="-mt-10 mb-10 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          see the fade while scroll
        </span>
      </div>

      <div className="rounded-xl border bg-background/50 shadow-sm">
        <div
          className={cn(
            "w-64 h-72 rounded-xl overflow-y-auto p-2",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_85%,transparent_100%)]",
            "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-foreground/10 [&::-webkit-scrollbar-thumb]:rounded-full"
          )}
        >
          <div className="space-y-1 p-1">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className="text-foreground/50 hover:bg-foreground/10 bg-foreground/5 flex h-10 w-full items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors"
              >
                00{idx}
                <div className="bg-foreground/10 h-px flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoSkipper87() {
  return <Skipper87 />;
}

export default Skipper87;
