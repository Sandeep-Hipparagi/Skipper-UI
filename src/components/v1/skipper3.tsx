"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ApplePlayButtonProps {
  expanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export const ApplePlayButton: React.FC<ApplePlayButtonProps> = ({
  expanded: controlledExpanded,
  onToggle,
  className,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const toggle = () => {
    if (onToggle) onToggle();
    else setInternalExpanded((v) => !v);
  };

  return (
    <motion.div layout className={cn("relative flex items-center justify-center", className)}>
      <motion.div
        className="h-15 relative flex items-center justify-between overflow-hidden rounded-full shadow-lg border border-border/10 backdrop-blur-md"
        style={{ borderRadius: 9999, width: 60 }}
        initial={{ scale: 0, y: "100%" }}
        transition={{ type: "spring", bounce: 0.16 }}
        animate={{ scale: 1, y: 0, width: isExpanded ? 330 : 60 }}
      >
        <div className="bg-foreground/20 flex h-full w-[260px] items-center justify-center gap-2 rounded-full">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center justify-center gap-2"
              >
                <span className="bg-foreground/20 h-[10px] w-[60px] rounded-full" />
                <span className="bg-foreground/20 size-[10px] rounded-full" />
                <span className="bg-foreground/20 size-[10px] rounded-full" />
                <span className="bg-foreground/20 size-[10px] rounded-full" />
                <span className="bg-foreground/20 size-[10px] rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <div className="bg-foreground/20 flex h-full w-[60px] items-center justify-center gap-2 rounded-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                className="flex items-center justify-center gap-2"
              >
                <motion.svg
                  initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
                  transition={{ delay: 0.25 }}
                  viewBox="-1 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-foreground/80 h-5 w-5 fill-current"
                >
                  <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
                </motion.svg>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export const Skipper3: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <ApplePlayButton expanded={expanded} onToggle={() => setExpanded((v) => !v)} />

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="bg-foreground/10 hover:bg-foreground/20 border border-border/20 absolute bottom-20 my-10 rounded-full px-7 py-2 text-sm font-medium transition active:scale-95 shadow-sm"
      >
        {expanded ? "Collapse" : "Toggle"}
      </button>
    </div>
  );
};

export const DemoSkipper3 = Skipper3;
export default Skipper3;
