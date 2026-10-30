"use client";

import React, { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, ArrowUp, AudioLines } from "lucide-react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

export const TextShimmer = memo(function TextShimmer({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}) {
  const MotionComponent = motion.create(Component);
  const spreadWidth = useMemo(() => children.length * spread, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box] dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={
        {
          "--spread": `${spreadWidth}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
});

export function Skipper84() {
  const [measureRef, bounds] = useMeasure();
  const [text, setText] = useState("");
  const [generating, setGenerating] = useState(false);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden px-3 text-[#121212] [perspective:1000px]">
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#C1DAFE] via-[#96BEFF] to-[#CFB7FC] opacity-70 animate-pulse duration-1000" />

      <AnimatePresence mode="popLayout">
        {generating ? (
          <motion.div
            key="output"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute z-20 flex h-full w-full items-center justify-center text-center"
            onClick={() => setGenerating(false)}
          >
            <TextShimmer className="text-xl font-medium cursor-pointer" duration={1}>
              Generating Your $Billion Dollar saas...
            </TextShimmer>
          </motion.div>
        ) : (
          <motion.div
            key="input"
            exit={{ y: -100, opacity: 0, filter: "blur(4px)", rotateX: 25 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 0.3 }}
            layout
            className="z-20 relative w-full max-w-sm rounded-3xl bg-white text-lg shadow-xl"
          >
            <div className="flex justify-between p-2">
              <div className="flex w-full items-center gap-1">
                <button
                  type="button"
                  className="absolute bottom-2 left-2 flex size-11 items-center justify-center rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="text-muted-foreground size-5" />
                </button>
                <motion.div
                  className="w-full"
                  initial={false}
                  animate={{
                    paddingLeft: text.length > 10 ? "15px" : "38px",
                    paddingRight: text.length > 10 ? "15px" : "82px",
                    height: bounds.height || "auto",
                    marginBottom: text.length > 10 ? "40px" : "0px",
                  }}
                >
                  <textarea
                    autoFocus
                    placeholder="Ask anything..."
                    ref={measureRef}
                    rows={1}
                    className="w-full resize-none rounded-md py-2 text-base outline-none focus-visible:ring-0 field-sizing-content bg-transparent placeholder:text-gray-400"
                    value={text}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (text.trim()) {
                          setText("");
                          setGenerating(true);
                        }
                      }
                    }}
                    onChange={(e) => setText(e.target.value)}
                  />
                </motion.div>
              </div>

              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <button
                  type="button"
                  className="flex size-11 items-center justify-center rounded-full p-1 hover:bg-gray-100 transition-colors"
                >
                  <Mic className="size-5 text-gray-500" />
                </button>

                <AnimatePresence mode="wait">
                  {text ? (
                    <motion.button
                      key="arrow-up"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      onClick={() => {
                        if (text.trim()) {
                          setText("");
                          setGenerating(true);
                        }
                      }}
                      className="flex size-11 items-center justify-center rounded-full bg-[#121212] p-1 text-white hover:bg-black/80 transition-colors"
                    >
                      <ArrowUp className="size-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      key="audio-lines"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      className="flex size-11 items-center justify-center rounded-full bg-[#121212] p-1 text-white hover:bg-black/80 transition-colors"
                    >
                      <AudioLines className="size-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DemoSkipper84() {
  return <Skipper84 />;
}

export default Skipper84;
