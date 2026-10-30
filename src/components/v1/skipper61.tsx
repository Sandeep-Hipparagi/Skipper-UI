"use client";

import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const springConfig = {
  mass: 0.1,
  damping: 10,
  stiffness: 131,
};

export function SimpleMouseFollow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
      className="mt-20 size-[500px] cursor-none overflow-hidden rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/10"
    >
      <motion.div
        style={{ x, y, opacity }}
        className="size-5 rounded-full bg-[#ccc]"
      />
    </div>
  );
}

export function SpringMouseFollow() {
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const opacity = useSpring(0, springConfig);
  const scale = useSpring(0, springConfig);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        opacity.set(1);
        scale.set(1);
      }}
      onPointerLeave={() => {
        opacity.set(0);
        scale.set(0);
      }}
      className="mt-20 size-[500px] overflow-hidden rounded-[2.5rem] bg-black/5 dark:bg-white/5 border border-black/10"
    >
      <motion.div
        style={{ x, y, opacity, scale }}
        className="size-10 rounded-full bg-orange-500"
      />
    </div>
  );
}

export function Skipper61() {
  return (
    <section className="h-screen w-full snap-y snap-mandatory overflow-y-scroll bg-[#f5f4f3] text-black">
      <div className="flex h-screen w-full snap-start flex-col items-center justify-center px-5">
        <div className="grid content-start justify-items-center gap-6 text-center">
          <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
            Mouse follow simple
          </span>
        </div>
        <SimpleMouseFollow />
      </div>
      <div className="flex h-screen w-full snap-start flex-col items-center justify-center px-5">
        <div className="grid content-start justify-items-center gap-6 text-center">
          <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
            Mouse follow with Spring
          </span>
        </div>
        <SpringMouseFollow />
      </div>
    </section>
  );
}

export { Skipper61 as DemoSkipper61 };
export default Skipper61;
