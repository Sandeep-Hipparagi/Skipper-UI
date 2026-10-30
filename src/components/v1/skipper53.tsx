"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ExpandItem {
  src: string;
  alt?: string;
  code?: string;
}

export interface HoverExpand_002Props {
  images: ExpandItem[];
  className?: string;
}

export const HoverExpand_002: React.FC<HoverExpand_002Props> = ({
  images,
  className,
}) => {
  const [active, setActive] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className={cn("relative w-full max-w-6xl px-5", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="flex w-full flex-col items-center justify-center gap-1">
          {images.map((item, idx) => (
            <motion.div
              key={idx}
              className="group relative cursor-pointer overflow-hidden rounded-3xl"
              initial={{ height: "2.5rem", width: "24rem" }}
              animate={{
                height: active === idx ? "24rem" : "2.5rem",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActive(idx)}
              onHoverStart={() => setActive(idx)}
            >
              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/50 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute flex h-full w-full flex-col items-end justify-end px-4 pb-5"
                  >
                    <p className="text-left text-xs text-white/50">
                      {item.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <img
                src={item.src}
                className="size-full object-cover"
                alt={item.alt || ""}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export function Skipper53() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-[#f5f4f3]">
      <HoverExpand_002
        images={[
          {
            src: "/examples/photo-073.jpg",
            alt: "Illustrations by my fav AarzooAly",
            code: "# 23",
          },
          {
            src: "/examples/photo-069.jpg",
            alt: "Illustrations by ©AarzooAly",
            code: "# 23",
          },
          {
            src: "/examples/photo-080.jpg",
            alt: "Illustrations by ©AarzooAly",
            code: "# 23",
          },
          {
            src: "/examples/photo-081.jpg",
            alt: "Illustrations by ©AarzooAly",
            code: "# 23",
          },
          {
            src: "/examples/photo-085.jpg",
            alt: "Illustrations by ©AarzooAly",
            code: "# 23",
          },
          {
            src: "/examples/photo-092.jpg",
            alt: "Illustrations by ©AarzooAly",
            code: "# 23",
          },
        ]}
      />
    </div>
  );
}

export { Skipper53 as DemoSkipper53 };
export default Skipper53;
