"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

function GradientBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col items-stretch -space-y-3", className)}>
      <div className="w-full flex-1 bg-[#FC2BA3] blur-xl" />
      <div className="w-full flex-1 bg-[#FC6D35] blur-xl" />
      <div className="w-full flex-1 bg-[#F9C83D] blur-xl" />
      <div className="w-full flex-1 bg-[#C2D6E1] blur-xl" />
      <div className="w-full flex-1 bg-[#144EC5] blur-xl" />
    </div>
  );
}

export function Skipper82() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [messages, setMessages] = useState<{ sentByMe: boolean; message: string }[]>([]);
  const [canSend, setCanSend] = useState(true);

  const playSound = () => {
    try {
      const audio = new Audio("/audio/send2.wav");
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {}
  };

  const handleSend = async () => {
    if (!value.trim()) return;
    playSound();
    setCanSend(false);
    setSubmitted((prev) => !prev);
    const msg = value.trim();
    setValue("");
    setMessages((prev) => [...prev, { sentByMe: true, message: msg }]);

    await new Promise((res) => setTimeout(res, 1000));
    setMessages((prev) => [...prev, { sentByMe: false, message: "Lock in vro 😵" }]);
    setCanSend(true);
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#F5F6F6] p-8 font-medium text-black">
      <div className="mt-52 w-full max-w-lg z-10">
        <div className="relative rounded-3xl bg-white p-1 shadow-[0_10px_20px_-6px_rgba(0,0,0,0.1)]">
          <div className="relative z-10 flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-1.5">
            <div className="flex flex-1 items-center gap-3 pr-3">
              <button
                type="button"
                className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-[#f5f4f3] transition-colors hover:bg-gray-200"
              >
                <Plus className="size-5 text-gray-400" />
              </button>
              <input
                type="text"
                value={value}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Send Message"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={handleSend}
              className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-[#f5f4f3] transition-colors hover:bg-gray-200"
            >
              <AnimatePresence>
                {canSend && (
                  <motion.span
                    initial={{ rotate: -90, x: "150%" }}
                    animate={{ rotate: value ? 0 : -90, x: 0 }}
                    exit={{ y: "-150%" }}
                    className="flex items-center justify-center"
                  >
                    <ArrowUp className="size-5 stroke-[2.5] text-black" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <motion.div
            layout="position"
            className="pointer-events-none absolute bottom-[70px] right-0 z-0 flex w-full flex-col items-end gap-2"
          >
            {messages.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, type: "spring", bounce: 0.4 }}
                className={cn(
                  "max-w-[260px] break-words px-[14px] py-[10px] text-sm",
                  item.sentByMe
                    ? "self-end rounded-[14px_14px_6px] bg-white text-black shadow-[0_10px_20px_-6px_rgba(0,0,0,0.1)]"
                    : "self-start rounded-[14px_14px_14px_6px] bg-sky-500 text-white shadow-[0_10px_20px_-6px_rgba(0,0,0,0.2)]"
                )}
              >
                <p className="will-change-transform">{item.message}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        key={`isSubmit-${submitted}`}
        initial={{ y: "100%", opacity: 0.2 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        animate={{ y: "30%", opacity: 0 }}
        className="pointer-events-none absolute left-1/2 flex h-screen w-full max-w-3xl -translate-x-1/2"
      >
        <GradientBar className="w-full" />
        <GradientBar className="w-full -translate-y-20" />
        <GradientBar className="w-full" />
      </motion.div>
    </div>
  );
}

export function DemoSkipper82() {
  return <Skipper82 />;
}

export default Skipper82;
