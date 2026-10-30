"use client";

import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import useMeasure from "react-use-measure";
import { Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SkipperNumberFlowProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  className?: string;
}

export function SkipperNumberFlow({
  value,
  prefix = "",
  suffix = "",
  format = "number",
  locale = "en-US",
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
  className = "",
}: SkipperNumberFlowProps) {
  const [ref, bounds] = useMeasure();
  const formattedChars = value
    .toLocaleString(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    })
    .split("");

  const charCounts: Record<string, number> = {};

  return (
    <LayoutGroup>
      <div className={cn("flex w-full flex-col items-center justify-center gap-2", className)}>
        <motion.div
          animate={{ width: bounds.width > 0 ? bounds.width : "auto" }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
          className="flex items-center gap-2 overflow-hidden"
        >
          <div
            ref={ref}
            className="flex items-center justify-between font-semibold tracking-tight"
          >
            {prefix && <span>{prefix}</span>}
            {formattedChars.map((char) => {
              charCounts[char] = (charCounts[char] || 0) + 1;
              const key =
                charCounts[char] > 1
                  ? `${char}-dupChar-${charCounts[char]}`
                  : `${char}`;
              return (
                <motion.span
                  key={key}
                  layoutId={key}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
            {suffix && <span className="whitespace-nowrap">{suffix}</span>}
          </div>
        </motion.div>
      </div>
    </LayoutGroup>
  );
}

const SAMPLE_NUMBERS = [
  { value: 39843, prefix: "+", suffix: "%", format: "number" },
  { value: -9843.5, prefix: "", suffix: "", format: "decimal" },
  { value: 943.14, prefix: "", suffix: "米", format: "decimal" },
  { value: 19348.43, prefix: "$", suffix: "", format: "currency" },
];

export function Skipper69() {
  const [index, setIndex] = useState(0);
  const current = SAMPLE_NUMBERS[index];

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center gap-8 bg-[#f5f4f3] p-8 text-black">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Shuffle the number
        </span>
      </div>
      <div className="flex min-h-[100px] items-center justify-center">
        <SkipperNumberFlow
          value={current.value}
          prefix={current.prefix}
          suffix={current.suffix}
          format={current.format}
          className="text-6xl font-bold tracking-tight"
        />
      </div>
      <button
        onClick={() => setIndex((prev) => (prev + 1) % SAMPLE_NUMBERS.length)}
        className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 font-medium shadow-md transition-all ease-in-out hover:shadow-lg active:scale-95"
      >
        <Shuffle className="size-4" />
        Shuffle
      </button>
    </div>
  );
}

export { Skipper69 as DemoSkipper69 };
export default Skipper69;
