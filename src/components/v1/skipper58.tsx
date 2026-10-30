"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextRollProps {
  children: string;
  className?: string;
  center?: boolean;
}

export function TextRoll({ children, className, center = false }: TextRollProps) {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((char, idx) => {
          const delay = center
            ? 0.035 * Math.abs(idx - (children.length - 1) / 2)
            : 0.035 * idx;
          return (
            <motion.span
              key={idx}
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((char, idx) => {
          const delay = center
            ? 0.035 * Math.abs(idx - (children.length - 1) / 2)
            : 0.035 * idx;
          return (
            <motion.span
              key={idx}
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{ ease: "easeInOut", delay }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
}

const NAV_LINKS = [
  { name: "Home", href: "/", description: "[0]" },
  { name: "Components", href: "/components", description: "[1]" },
  { name: "Pricing", href: "/pricing", description: "[2]" },
  { name: "How to use", href: "/docs/quick-start", description: "[3]" },
  { name: "Account", href: "/user", description: "[4]" },
  { name: "Login", href: "/login", description: "[7]" },
];

export function Skipper58() {
  return (
    <div className="flex h-full min-h-screen w-full items-center justify-center bg-[#f5f4f3] p-8">
      <ul className="flex min-h-full w-full flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-7 py-3 backdrop-blur-sm">
        {NAV_LINKS.map((item, idx) => (
          <li
            key={idx}
            className="relative flex cursor-pointer flex-col items-center overflow-visible py-2"
          >
            <div className="relative flex items-start">
              <TextRoll
                center={true}
                className="text-4xl font-extrabold uppercase leading-[0.8] tracking-[-0.03em] transition-colors lg:text-5xl hover:text-black/70"
              >
                {item.name}
              </TextRoll>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export { Skipper58 as DemoSkipper58 };
export default Skipper58;
