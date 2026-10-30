"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripHorizontal, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Icons Helper ---
export const IslandIcons = {
  phone: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.41 11.41 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.41 11.41 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z" />
    </svg>
  ),
  airDrop: ({ className }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m16.24 7.76-1.88 1.88a3 3 0 0 0-4.24 0L8.24 7.76" />
      <path d="m19.07 4.93-1.41 1.41a6 6 0 0 0-8.48 0L7.76 4.93" />
      <path d="m21.9 2.1-1.41 1.41a9 9 0 0 0-12.73 0L6.34 2.1" />
      <circle cx="12" cy="18" r="3" />
    </svg>
  ),
};

// --- Subcomponent: Phone ---
export const IslandPhone: React.FC = () => {
  const [seconds, setSeconds] = useState(1);
  const genBars = () => Array.from({ length: 18 }, () => 0.8 * Math.random() + 0.2);
  const [bars, setBars] = useState<number[]>(genBars());

  useEffect(() => {
    const barInterval = setInterval(() => setBars(genBars()), 100);
    const timerInterval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(barInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins.toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      className="relative flex h-7 w-[220px] items-center justify-between rounded-full px-2.5 shadow-sm"
    >
      <div className="flex items-center gap-1 font-medium">
        <motion.div
          animate={{
            rotate: [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <IslandIcons.phone className="size-4 text-[#2FD057]" />
        </motion.div>
        <span className="text-xs font-semibold tabular-nums text-[#2FD057]">
          {formatTime(seconds)}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="absolute right-4 z-20 flex h-[18px] w-full items-center justify-end gap-0.5 rounded-full"
      >
        {bars.map((bar, idx) => (
          <motion.div
            key={idx}
            className="w-[1px] rounded-full bg-[#2FD057]"
            initial={{ height: 0 }}
            animate={{ height: Math.max(0, 14 * bar) }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// --- Subcomponent: Timer ---
export const IslandTimer: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [, setResetKey] = useState(0);

  return (
    <div className="flex w-[284px] items-center gap-2 py-3 pl-3.5 pr-5">
      <motion.button
        aria-label="Pause timer"
        onClick={() => setIsPaused((p) => !p)}
        whileTap={{ scale: 0.9 }}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5A3C07] transition-colors hover:bg-[#694608]"
      >
        <AnimatePresence initial={false} mode="wait">
          {isPaused ? (
            <motion.svg
              key="play"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.1 }}
              viewBox="0 0 12 14"
              fill="none"
              className="h-4 w-4 fill-current text-[#FDB000]"
            >
              <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="pause"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
              transition={{ duration: 0.1 }}
              viewBox="0 0 10 13"
              fill="none"
              className="h-4 w-4 fill-current text-[#FDB000]"
            >
              <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      <button
        aria-label="Reset timer"
        onClick={() => setResetKey((k) => k + 1)}
        className="bg-white/15 hover:bg-white/20 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="ml-auto flex items-baseline gap-1.5 pr-0.5 text-[#FDB000]">
        <span className="text-2xl font-bold tracking-tight">04:59</span>
      </div>
    </div>
  );
};

// --- Subcomponent: Music ---
export const IslandMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSec, setCurrentSec] = useState(34);
  const [isFlipped, setIsFlipped] = useState(false);
  const totalSec = 120;
  const genBars = () => Array.from({ length: 6 }, () => 0.8 * Math.random() + 0.2);
  const [bars, setBars] = useState<number[]>(genBars());

  useEffect(() => {
    if (isPlaying) {
      const bInt = setInterval(() => setBars(genBars()), 100);
      const tInt = setInterval(() => setCurrentSec((s) => (s < totalSec ? s + 1 : s)), 1000);
      return () => {
        clearInterval(bInt);
        clearInterval(tInt);
      };
    }
  }, [isPlaying]);

  const fmt = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins.toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-fit w-[284px] p-5">
      <div>
        <div className="flex items-center gap-3">
          <div className="perspective-1000 relative size-14">
            <motion.div
              initial={{ rotateY: 0, rotate: 30, scale: 0.5 }}
              onClick={() => setIsFlipped((f) => !f)}
              animate={{ rotateY: isFlipped ? 180 : 0, rotate: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 2 }}
              whileTap={{ scale: 0.8 }}
              className="relative size-14 cursor-pointer rounded-2xl"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="backface-hidden absolute size-full rounded-2xl bg-gradient-to-b from-indigo-400 to-cyan-400 shadow-md" />
              <div
                className="backface-hidden absolute size-full rounded-2xl bg-gradient-to-b from-orange-600 via-pink-300 to-blue-300 shadow-md"
                style={{ transform: "rotateY(180deg)" }}
              />
            </motion.div>
          </div>

          <div className="h-full text-base font-semibold text-white">
            <h1 className="leading-5">Glow</h1>
            <p className="leading-5 text-neutral-400 font-normal text-xs">Echo</p>
          </div>

          <div className="absolute right-7">
            <motion.div className="flex h-[18px] w-full items-center gap-0.5 rounded-full">
              {bars.map((bar, i) => (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-blue-400"
                  initial={{ height: 4 }}
                  animate={{ height: !isPlaying ? 4 : Math.max(4, 14 * bar) }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scrubber progress */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <p className="tabular-nums">{fmt(currentSec)}</p>
          <div className="relative flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full"
              style={{ width: `${(currentSec / totalSec) * 100}%` }}
            />
          </div>
          <p className="tabular-nums">-{fmt(totalSec - currentSec)}</p>
        </div>

        {/* Controls */}
        <div className="mt-4 flex justify-center items-center gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="size-6 text-neutral-300"
            onClick={() => setCurrentSec((s) => Math.max(0, s - 10))}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" style={{ transform: "scaleX(-1)" }}>
              <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z" />
              <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z" />
            </svg>
          </motion.button>

          <motion.button
            aria-label="Toggle play/pause"
            onClick={() => setIsPlaying((p) => !p)}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center"
          >
            <AnimatePresence initial={false} mode="wait">
              {!isPlaying ? (
                <motion.svg
                  key="play"
                  viewBox="0 0 12 14"
                  fill="none"
                  className="size-5 fill-current text-neutral-300"
                >
                  <path d="M0.9375 13.2422C1.25 13.2422 1.51562 13.1172 1.82812 12.9375L10.9375 7.67188C11.5859 7.28906 11.8125 7.03906 11.8125 6.625C11.8125 6.21094 11.5859 5.96094 10.9375 5.58594L1.82812 0.3125C1.51562 0.132812 1.25 0.015625 0.9375 0.015625C0.359375 0.015625 0 0.453125 0 1.13281V12.1172C0 12.7969 0.359375 13.2422 0.9375 13.2422Z" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="pause"
                  viewBox="0 0 10 13"
                  fill="none"
                  className="size-5 fill-current text-neutral-300"
                >
                  <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="size-6 text-neutral-300"
            onClick={() => setCurrentSec((s) => Math.min(totalSec, s + 10))}
          >
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C.713 12.69 0 12.345 0 11.692V4.308c0-.653.713-.998 1.233-.696z" />
              <path d="M15.596 7.304a.802.802 0 0 1 0 1.392l-6.363 3.692C8.713 12.69 8 12.345 8 11.692V4.308c0-.653.713-.998 1.233-.696z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponent: Airdrop ---
export const IslandAirdrop: React.FC<{ setView?: (v: string) => void }> = ({ setView }) => {
  return (
    <div className="flex w-[284px] items-center gap-2 p-4">
      <div className="flex flex-col w-full gap-4">
        <div className="flex w-full justify-between items-center">
          <div className="w-2/3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <IslandIcons.airDrop className="size-8 text-[#159BF4]" />
              <img
                src="/mac/user.png"
                className="absolute -right-1 bottom-0 size-5 rounded-full"
                alt="user"
              />
            </div>
            <div className="text-white mt-2">
              <h1 className="text-sm font-semibold">AirDrop</h1>
              <p className="mr-4 text-xs leading-4 text-neutral-400">
                Sandeep would like to share 23 photos
              </p>
            </div>
          </div>
          <div className="h-20 w-20 overflow-hidden rounded-2xl shadow-inner">
            <img src="/mac/japan.webp" className="size-full object-cover" alt="japan" />
          </div>
        </div>

        <div className="flex w-full gap-2 font-medium text-xs">
          <motion.button
            onClick={() => setView && setView("idle")}
            whileTap={{ scale: 0.9 }}
            className="w-1/2 rounded-full bg-neutral-700 py-2 text-white"
          >
            Decline
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (setView) {
                setView("idle");
                setTimeout(() => setView("airdropMini"), 500);
              }
            }}
            className="w-1/2 rounded-full bg-[#012B59] py-2 text-[#159BF4]"
          >
            Accept
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export const IslandAirdropMini: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(25), 600);
    const t2 = setTimeout(() => setProgress(50), 1700);
    const t3 = setTimeout(() => setProgress(75), 2100);
    const t4 = setTimeout(() => setProgress(100), 2400);
    const t5 = setTimeout(() => setProgress(105), 2700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <motion.div
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex w-[284px] items-center gap-2 p-4"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <IslandIcons.airDrop className="size-8 text-[#159BF4]" />
          <img
            src="/mac/user.png"
            className="absolute -right-1 bottom-0 size-5 rounded-full"
            alt="user"
          />
        </div>
        <div className="flex flex-col font-medium text-white">
          <h1 className="text-sm font-semibold">AirDrop</h1>
          <p className="text-xs text-neutral-400">1 photo</p>
        </div>

        {/* Progress Circle */}
        <div className="relative flex items-center justify-center">
          {progress > 100 ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex size-8 items-center justify-center rounded-full bg-neutral-700 text-white"
            >
              ✓
            </motion.div>
          ) : (
            <svg className="size-9 text-[#159BF4]" viewBox="0 0 50 50">
              <circle
                className="opacity-20"
                strokeWidth={5}
                stroke="currentColor"
                fill="transparent"
                r={20}
                cx={25}
                cy={25}
              />
              <motion.circle
                strokeLinecap="round"
                animate={{ pathLength: progress / 100 }}
                transition={{ type: "spring", duration: 0.5 }}
                strokeWidth={5}
                stroke="currentColor"
                fill="transparent"
                r={20}
                cx={25}
                cy={25}
                transform="rotate(-90 25 25)"
              />
            </svg>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Subcomponent: Ring ---
export const IslandRing: React.FC = () => {
  const [isSilent, setIsSilent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsSilent((s) => !s), 2000);
    return () => clearTimeout(t);
  }, [isSilent]);

  return (
    <motion.div
      initial={false}
      className="relative flex h-7 items-center justify-between px-2.5"
      animate={{ width: isSilent ? 148 : 128 }}
      transition={{ type: "spring", bounce: 0.5 }}
    >
      <div className="relative flex items-center gap-2">
        <svg
          className="size-4"
          viewBox="0 0 15 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125ZM7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="ml-auto flex items-center">
        <span
          className={cn(
            "text-xs font-semibold",
            isSilent ? "text-[#FD4F30]" : "text-white"
          )}
        >
          {isSilent ? "Silent" : "Ring"}
        </span>
      </div>
    </motion.div>
  );
};

// --- Subcomponent: Record ---
export const IslandRecord: React.FC = () => {
  const [seconds, setSeconds] = useState(1);
  const genBars = () => Array.from({ length: 16 }, () => 0.8 * Math.random() + 0.2);
  const [bars, setBars] = useState<number[]>(genBars());

  useEffect(() => {
    const bInt = setInterval(() => setBars(genBars()), 100);
    const tInt = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      clearInterval(bInt);
      clearInterval(tInt);
    };
  }, []);

  const fmt = (sec: number) => {
    const mins = Math.floor(sec / 60);
    return `${mins.toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;
  };

  return (
    <motion.div className="relative flex h-7 w-[200px] items-center justify-between rounded-full px-2.5 shadow-sm">
      <motion.div className="flex h-[18px] w-full items-center gap-0.5 rounded-full">
        {bars.map((b, i) => (
          <motion.div
            key={i}
            className="w-[3px] rounded-full bg-[#FD4F30]"
            initial={{ height: 4 }}
            animate={{ height: Math.max(4, 14 * b) }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}
      </motion.div>
      <div className="ml-auto flex items-center">
        <span className="text-xs font-medium tabular-nums text-[#FD4F30]">{fmt(seconds)}</span>
      </div>
    </motion.div>
  );
};

// --- Subcomponent: LowBattery ---
export const IslandLowBattery: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(4px)" }}
      transition={{ type: "spring", bounce: 0.35 }}
      className="relative flex h-7 w-[220px] items-center justify-between rounded-full px-2.5 shadow-sm"
    >
      <div className="flex items-center gap-1 font-medium">
        <p className="text-xs font-semibold tabular-nums text-white">Low Battery</p>
      </div>
      <div className="flex h-[18px] items-center justify-end gap-1 rounded-full">
        <p className="text-xs font-semibold tabular-nums text-[#E65B4F]">20%</p>
        <div className="relative h-[10px] w-[20px] overflow-hidden rounded-[3px] border border-[#e2857c]/50 p-0.5">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "20%" }}
            transition={{ delay: 0.5, bounce: 0.5 }}
            className="h-full bg-[#E65B4F] rounded-xs"
          />
        </div>
      </div>
    </motion.div>
  );
};

// --- Subcomponent: FindMy ---
export const IslandFindMy: React.FC = () => {
  return (
    <div className="flex w-[284px] items-center gap-2 py-3 pl-3.5 pr-5">
      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#1A5B3D]">
        <motion.div
          animate={{ scale: 1.3 }}
          transition={{
            scale: { repeat: Infinity, repeatType: "loop", type: "spring", stiffness: 333, damping: 20 },
          }}
          className="absolute size-3 rounded-full bg-[#87fcdc] shadow-[0px_0px_25px_5px_rgba(148,255,222,1)]"
        />
        <motion.div
          className="absolute size-3.5 rounded-full border border-[#87fcdc]"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3.1, opacity: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 1.5,
            ease: "easeOut",
          }}
        />
      </div>
      <p className="ml-2 font-medium text-xs text-white">Find My iPhone Sandeep</p>
    </div>
  );
};

// --- Subcomponent: ScreenRecord ---
export const IslandScreenRecord: React.FC = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const fmt = (s: number) => {
    const mins = Math.floor(s / 60);
    const sec = s % 60;
    return `${mins}:${sec < 10 ? "0" + sec : sec}`;
  };

  return (
    <motion.div
      transition={{ type: "spring", bounce: 0.5 }}
      className="flex w-72 items-center justify-between gap-2 p-4"
    >
      <div className="space-y-1 text-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-1.5"
        >
          <div className="size-2.5 rounded-full bg-red-500" />
          <p className="text-xs font-semibold text-red-500 tabular-nums">{fmt(seconds)}</p>
        </motion.div>
        <h1 className="text-xs font-medium text-neutral-300">Screen Recording</h1>
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-red-500/20 text-red-500">
        <div className="size-3 rounded-full bg-red-500" />
      </div>
    </motion.div>
  );
};

// --- Spring Bounce Configuration ---
export const islandBounceMap: Record<string, number> = {
  idle: 0.5,
  "ring-idle": 0.5,
  "timer-ring": 0.35,
  "ring-timer": 0.35,
  "timer-idle": 0.3,
  "idle-timer": 0.3,
  "idle-ring": 0.5,
  "music-timer": 0.2,
  "music-ring": 0.2,
  "airdrop-ring": 0.2,
  "airdrop-timer": 0.2,
  "airdrop-record": 0.2,
  "music-record": 0.2,
  "music-airdrop": 0.2,
  "airdrop-airdropMini": 0.2,
  "airdropMini-airdrop": 0.2,
};

export interface DynamicIslandProps {
  view: string;
  variantKey: string;
}

export const DynamicIsland: React.FC<DynamicIslandProps> = ({ view, variantKey }) => {
  const content = useMemo(() => {
    switch (view) {
      case "ring":
        return <IslandRing />;
      case "record":
        return <IslandRecord />;
      case "timer":
        return <IslandTimer />;
      case "music":
        return <IslandMusic />;
      case "airdrop":
        return <IslandAirdrop setView={undefined} />;
      case "airdropMini":
        return <IslandAirdropMini />;
      case "lowBattery":
        return <IslandLowBattery />;
      case "phone":
        return <IslandPhone />;
      case "findmy":
        return <IslandFindMy />;
      case "screenRecord":
        return <IslandScreenRecord />;
      case "idle":
      default:
        return <div className="h-7 w-20" />;
    }
  }, [view]);

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: islandBounceMap[variantKey] || 0.2 }}
      style={{ borderRadius: 32 }}
      className="mx-auto w-fit min-w-[100px] overflow-hidden rounded-full bg-black shadow-2xl border border-white/10"
    >
      <motion.div
        key={view}
        transition={{ type: "spring", bounce: islandBounceMap[variantKey] || 0.2 }}
        initial={{ scale: 0.9, opacity: 0, filter: "blur(5px)", originX: 0.5, originY: 0.5 }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)", originX: 0.5, originY: 0.5, transition: { delay: 0.05 } }}
      >
        {content}
      </motion.div>
    </motion.div>
  );
};

export interface OptionsProps {
  view: string;
  setView: (v: string) => void;
  setVariantKey: (vk: string) => void;
}

export const Options: React.FC<OptionsProps> = ({ view, setView, setVariantKey }) => {
  const viewsList = [
    "idle",
    "ring",
    "timer",
    "record",
    "music",
    "airdrop",
    "airdropMini",
    "lowBattery",
    "phone",
    "findmy",
    "screenRecord",
  ];

  return (
    <motion.div
      drag
      className="top-24 border-foreground/10 bg-muted2/90 absolute right-1/2 flex w-[260px] translate-x-1/2 flex-col gap-3 rounded-3xl border p-3 backdrop-blur-md shadow-xl lg:right-6 lg:translate-x-0 z-50"
    >
      <div className="flex items-center justify-between">
        <span className="size-4 cursor-grab active:cursor-grabbing">
          <GripHorizontal className="size-4 opacity-50 text-foreground" />
        </span>
        <button
          onClick={() => {
            setView("idle");
            setVariantKey("idle");
          }}
          className="hover:bg-muted3 group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm text-foreground/70"
        >
          <span>Options</span>
          <RefreshCcw className="size-3.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
        {viewsList.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(
              "rounded-xl px-2.5 py-1.5 text-xs transition-colors",
              view === item
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted3 text-foreground hover:bg-muted"
            )}
            onClick={() => {
              if (item === "idle") {
                setView("idle");
                setVariantKey("idle");
                return;
              }
              setView("idle");
              setTimeout(() => setView(item), 400);
              setVariantKey(`${view}-${item}`);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export const Skipper2: React.FC = () => {
  const [view, setView] = useState("idle");
  const [variantKey, setVariantKey] = useState("idle");

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-black/95 p-4">
      <div className="pt-10">
        <DynamicIsland view={view} variantKey={variantKey} />
      </div>
      <Options view={view} setView={setView} setVariantKey={setVariantKey} />
    </div>
  );
};

export const DemoSkipper2 = Skipper2;
export default Skipper2;
