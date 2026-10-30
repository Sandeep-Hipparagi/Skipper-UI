"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, X } from "lucide-react";

const springButton = {
  type: "spring" as const,
  stiffness: 350,
  damping: 35,
};

const springCard = {
  type: "spring" as const,
  stiffness: 550,
  damping: 45,
  mass: 0.7,
};

export function FamilyReceiveButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={() => setIsOpen((prev) => !prev)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/10 backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        style={{ transformOrigin: "50% 50% 0px", borderRadius: "30px" }}
        className="font-open-runde relative z-20 w-full max-w-[430px] overflow-hidden"
      >
        <motion.div
          style={{ pointerEvents: isOpen ? "none" : "all" }}
          className="relative z-10 flex w-full items-center justify-center"
        >
          <motion.button
            onClick={() => setIsOpen((prev) => !prev)}
            whileTap={{ scale: 0.9 }}
            transition={springButton}
            layoutId="receive"
            className="h-10 w-full max-w-[300px] transform-none rounded-full bg-sky-500 text-white font-medium"
          >
            <motion.span>Receive</motion.span>
          </motion.button>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {isOpen && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={springCard}
              style={{ transformOrigin: "50% 50% 0px" }}
              className="relative flex flex-col justify-end rounded-3xl bg-background p-4 shadow-xl border border-black/5 dark:border-white/10"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center gap-2 text-xl font-medium">
                  <div className="flex size-10 items-center justify-center rounded-full bg-sky-500/10">
                    <ArrowDownLeft className="size-6 text-sky-500" />
                  </div>
                  Confirm
                </div>
                <span
                  className="cursor-pointer p-1"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <X className="size-6 text-sky-500" />
                </span>
              </div>
              <p className="my-5 w-64 text-foreground/50 text-sm">
                Are you sure you want to receive hell load of money?
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="h-10 w-full rounded-full bg-muted font-medium text-sm hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={() => setIsOpen((prev) => !prev)}
                  whileTap={{ scale: 0.9 }}
                  transition={springButton}
                  layoutId="receive"
                  className="h-10 w-full max-w-[300px] transform-none rounded-full bg-sky-500 text-white font-medium"
                >
                  <motion.span>Receive</motion.span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export function Skipper45() {
  return (
    <div className="flex h-full w-screen items-end justify-center p-5 pb-[30vh]">
      <div className="absolute left-1/2 top-12 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-background after:to-foreground after:content-['']">
          Toggle layout with animation
        </span>
      </div>
      <FamilyReceiveButton />
    </div>
  );
}

export { Skipper45 as DemoSkipper45 };
export default Skipper45;
