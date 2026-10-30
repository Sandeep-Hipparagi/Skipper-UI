"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface RollingTextProps {
  text?: string;
  speed?: number;
  className?: string;
  duration?: number;
}

export const RollingText: React.FC<RollingTextProps> = ({
  text = "ROLLING",
  speed = 0.1,
  className = "text-5xl sm:text-7xl lg:text-8xl font-bold",
  duration = 4,
}) => {
  const centerIndex = Math.floor(text.length / 2);

  return (
    <motion.div className={cn("flex select-none", className)}>
      {text.split("").map((char, index) => {
        const distanceFromCenter = Math.abs(index - centerIndex);
        const repeatCount = Math.floor(duration / (0.2 + 0.15 * distanceFromCenter));

        return (
          <div
            key={index}
            className="relative inline-block overflow-hidden"
            style={{ height: "1em" }}
          >
            <motion.h1
              className="flex flex-col"
              whileInView={{ y: `-${1.2 * repeatCount}em` }}
              transition={{
                duration,
                ease: [0.15, 1, 0.1, 1],
                delay: distanceFromCenter * speed,
              }}
            >
              {Array(repeatCount + 2)
                .fill(null)
                .map((_, i) => (
                  <span
                    key={i}
                    className="flex shrink-0 items-center justify-center"
                    style={{ height: "1.2em" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
            </motion.h1>
          </div>
        );
      })}
    </motion.div>
  );
};

export const Skipper27: React.FC = () => {
  return (
    <section className="h-full min-h-screen snap-y snap-mandatory overflow-y-scroll bg-background text-foreground">
      <div className="absolute left-1/2 top-[10%] z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
        <span className="after:from-foreground after:to-background relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          scroll down to see
        </span>
      </div>

      <div className="flex h-screen w-full snap-start flex-col items-center justify-center">
        <RollingText text="CRAZY" speed={0.05} duration={4} />
        <RollingText text="COMPONENTS" speed={0.05} duration={4} />
      </div>

      <div className="flex h-screen w-full snap-start flex-col items-center justify-center">
        <RollingText text="FOR" speed={0.05} duration={4} />
        <RollingText text="YOUR" speed={0.05} duration={4} />
        <RollingText text="NEXTJS" speed={0.05} duration={4} />
        <RollingText text="PROJECT" speed={0.05} duration={4} />
      </div>

      <div className="flex h-screen w-full snap-start flex-col items-center justify-center">
        <RollingText text="SKIPPER UI PRO" speed={0.05} duration={4} />
      </div>
    </section>
  );
};

export const DemoSkipper27 = Skipper27;
export default Skipper27;
