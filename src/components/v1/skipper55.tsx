"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export interface ParallaxImageProps {
  src: string;
  className?: string;
  containerClassName?: string;
  speed?: number;
}

export function ParallaxImage({
  src,
  className,
  containerClassName,
  speed = 30,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0.2, 1], ["0%", `${speed}%`]);

  return (
    <div
      ref={containerRef}
      className={cn("relative flex w-full items-end overflow-hidden", containerClassName)}
      style={{ height: "70vh" }}
    >
      <motion.img
        src={src}
        alt=""
        className={cn("h-screen w-full object-cover", className)}
        style={{ y }}
      />
    </div>
  );
}

export function Skipper55() {
  return (
    <ReactLenis root>
      <div className="flex h-[200vh] w-full items-center justify-center">
        <div className="text-foreground absolute left-1/2 top-12 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down to see parallax effect
          </span>
        </div>
        <ParallaxImage
          src="/examples/photo-080.jpg"
          containerClassName="w-full max-w-3xl"
          className="w-full"
          speed={40}
        />
      </div>
    </ReactLenis>
  );
}

export { Skipper55 as DemoSkipper55 };
export default Skipper55;
