"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BookOpen,
  Star,
  Calendar,
  ShoppingBag,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ACCORDION_ITEMS = [
  {
    icon: <BookOpen className="size-4 text-emerald-500" />,
    title: "Type Shit",
    description: "Fast, accurate typing with real-time validation and helpful hints.",
  },
  {
    icon: <Star className="size-4 text-amber-500" />,
    title: "Star Great",
    description: "Mark favorites and rate items with smooth micro-interactions.",
  },
  {
    icon: <Calendar className="size-4 text-sky-500" />,
    title: "Schedule",
    description: "Plan tasks with timelines, reminders, and conflict detection.",
  },
  {
    icon: <ShoppingBag className="size-4 text-indigo-500" />,
    title: "Buy Stuff",
    description: "Streamlined checkout with secure payments and transparent pricing.",
  },
  {
    icon: <AlertTriangle className="size-4 text-orange-500" />,
    title: "Triangle Warning",
    description: "Surface critical alerts with accessible, non-intrusive messaging.",
  },
  {
    icon: <CreditCard className="size-4 text-pink-500" />,
    title: "Account bal",
    description: "Track balances, recent activity, and spending insights at a glance.",
  },
];

export function Skipper103() {
  const [active, setActive] = useState<number | null>(2);

  return (
    <div
      onClick={() => setActive(null)}
      className="flex min-h-screen w-full select-none flex-col items-center justify-center bg-muted/30 p-6 text-foreground"
    >
      <div className="-mt-36 mb-24 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Click on Items to expand & collapse
        </span>
      </div>

      <ul className="w-[320px] shadow-sm">
        {ACCORDION_ITEMS.map((item, idx) => {
          const isSelected = active === idx;
          const isNextToSelected = active !== null && idx === active + 1;
          const isPrevToSelected = active !== null && idx === active - 1;

          const topRadius = idx === 0 || isSelected || isNextToSelected ? "20px" : "0px";
          const bottomRadius =
            idx === ACCORDION_ITEMS.length - 1 || isSelected || isPrevToSelected
              ? "20px"
              : "0px";

          return (
            <motion.li
              key={idx}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActive(isSelected ? null : idx);
              }}
              animate={{
                marginBlock: isSelected ? "10px" : "0px",
                height: isSelected ? "96px" : "48px",
                borderTopLeftRadius: topRadius,
                borderTopRightRadius: topRadius,
                borderBottomLeftRadius: bottomRadius,
                borderBottomRightRadius: bottomRadius,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card hover:bg-card/80 border relative cursor-pointer overflow-hidden px-2 shadow-xs transition-colors"
            >
              <div className="flex h-fit items-center gap-2 pl-3 pt-3">
                <div className="p-1 rounded-md bg-muted/60">{item.icon}</div>
                <span className="text-sm font-medium tracking-tight opacity-80">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "absolute right-4 size-4 text-muted-foreground transition-transform duration-200",
                    isSelected && "rotate-180"
                  )}
                />
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.p
                    initial={{ opacity: 0, filter: "blur(2px)" }}
                    animate={{ opacity: 0.8, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(2px)" }}
                    className="px-3 py-2 text-xs text-muted-foreground leading-relaxed"
                  >
                    {item.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>

      <p className="text-muted-foreground absolute bottom-4 text-xs">
        Inspired by{" "}
        <a href="https://x.com/dev_ya" target="_blank" rel="noreferrer" className="hover:text-foreground underline">
          Yanis
        </a>{" "}
        Icons from{" "}
        <a href="https://nucleoapp.com/svg-glass-icons" target="_blank" rel="noreferrer" className="hover:text-foreground underline">
          Nucleo Icons
        </a>
      </p>
    </div>
  );
}

export function DemoSkipper103() {
  return <Skipper103 />;
}

export default Skipper103;
