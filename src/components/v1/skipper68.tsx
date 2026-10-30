"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedNumberInputProps {
  inputValue: string;
  setInputValue: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function AnimatedNumberInput({
  inputValue,
  setInputValue,
  placeholder = "000",
  className,
}: AnimatedNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const chars = (inputValue || "").split("");

  return (
    <div className={cn("relative overflow-hidden text-center", className)}>
      <input
        ref={inputRef}
        type="text"
        className="inset-0 w-full cursor-pointer text-center text-[45px] font-semibold tracking-tight text-transparent caret-black outline-none selection:bg-transparent"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {inputValue === "" && (
          <span className="text-[45px] font-semibold tracking-tight opacity-20">
            {placeholder}
          </span>
        )}
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((char, idx) => (
            <motion.span
              key={`${char}-${idx}`}
              className="text-[45px] font-semibold tracking-tight text-black"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Skipper68() {
  const [value, setValue] = useState("");

  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] p-8 text-black">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Try Entering a number
        </span>
      </div>
      <AnimatedNumberInput
        inputValue={value}
        placeholder="000"
        setInputValue={setValue}
        className="text-center"
      />
    </div>
  );
}

export { Skipper68 as DemoSkipper68 };
export default Skipper68;
