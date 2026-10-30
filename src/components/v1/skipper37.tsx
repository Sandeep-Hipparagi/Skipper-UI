"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, animate, useInView } from "framer-motion";
import { Plus } from "lucide-react";

export const CountdownTimer: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setSeconds((prev) => (prev === 0 ? 60 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    setSeconds(60);
  }, [resetCount]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] text-black">
      <div className="absolute top-20 left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
          Countdown with Number Flow
        </span>
      </div>

      <div className="text-[20vw] font-bold tracking-tight">
        0:{seconds < 10 ? `0${seconds}` : seconds}
      </div>

      <div className="flex w-fit items-center gap-3">
        <motion.button
          aria-label="Pause timer"
          onClick={() => setIsPaused((prev) => !prev)}
          whileTap={{ scale: 0.9 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff3828] text-white transition-colors"
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
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current"
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
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 fill-current"
              >
                <path d="M1.03906 12.7266H2.82031C3.5 12.7266 3.85938 12.3672 3.85938 11.6797V1.03906C3.85938 0.328125 3.5 0 2.82031 0H1.03906C0.359375 0 0 0.359375 0 1.03906V11.6797C0 12.3672 0.359375 12.7266 1.03906 12.7266ZM6.71875 12.7266H8.49219C9.17969 12.7266 9.53125 12.3672 9.53125 11.6797V1.03906C9.53125 0.328125 9.17969 0 8.49219 0H6.71875C6.03125 0 5.67188 0.359375 5.67188 1.03906V11.6797C5.67188 12.3672 6.03125 12.7266 6.71875 12.7266Z" />
              </motion.svg>
            )}
          </AnimatePresence>
        </motion.button>
        <button
          aria-label="Reset timer"
          onClick={() => setResetCount((c) => c + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 text-[#ff3828] shadow-md transition-colors hover:bg-white"
        >
          <Plus className="size-5 rotate-45" />
        </button>
      </div>
    </div>
  );
};

export const AnimatedNumber_002: React.FC = () => {
  const [displayNum, setDisplayNum] = useState(0);
  const springVal = useSpring(0, { bounce: 0, duration: 1000 });

  useEffect(() => {
    return springVal.on("change", (latest) => {
      setDisplayNum(Math.round(latest));
    });
  }, [springVal]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] text-black">
      <div className="absolute top-20 left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
          Spring number in view
        </span>
      </div>
      <motion.div
        onViewportEnter={() => springVal.set(500)}
        onViewportLeave={() => springVal.set(0)}
        className="text-[20vw] font-bold tracking-tight"
      >
        {displayNum}
      </motion.div>
    </div>
  );
};

export const AnimatedNumber_003: React.FC = () => {
  const [currentVal, setCurrentVal] = useState(1000000);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasTriggered = useRef(false);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] text-black">
      <div className="absolute top-20 left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
          Rapid random ticker in view
        </span>
      </div>
      <div className="text-[15vw] font-bold tracking-tight">
        <motion.div
          onViewportEnter={() => {
            if (hasTriggered.current || isAnimating) return;
            setIsAnimating(true);
            hasTriggered.current = true;
            let step = 0;
            const timer = setInterval(() => {
              step++;
              if (step <= 12) {
                const base = 1000000 + 83333.33 * step;
                setCurrentVal(Math.floor(base + Math.random() * (2200000 - base)));
              } else {
                setCurrentVal(2146000);
                setIsAnimating(false);
                clearInterval(timer);
              }
            }, 80);
          }}
          onViewportLeave={() => {
            setCurrentVal(1000000);
            hasTriggered.current = false;
            setIsAnimating(false);
          }}
        >
          ${new Intl.NumberFormat("en-US").format(currentVal)}
        </motion.div>
      </div>
    </div>
  );
};

export const AnimatedNumber_004: React.FC = () => {
  const [value, setValue] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false });

  useEffect(() => {
    if (isInView) {
      const controls = animate(3, 100, {
        duration: 1,
        ease: "easeInOut",
        onUpdate: (latest) => setValue(Math.round(latest)),
      });
      return () => controls.stop();
    } else {
      setValue(3);
    }
  }, [isInView]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] text-black">
      <div className="absolute top-20 left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
          From X to Y value in view
        </span>
      </div>
      <div ref={containerRef} className="text-[18vw] font-bold tracking-tight">
        ${value}K USD
      </div>
    </div>
  );
};

export const Skipper37: React.FC = () => {
  return (
    <section className="relative h-[calc(100vh-1rem)] w-full snap-y snap-mandatory overflow-y-scroll bg-[#f5f4f3]">
      <div className="snap-start">
        <CountdownTimer />
      </div>
      <div className="snap-start">
        <AnimatedNumber_002 />
      </div>
      <div className="snap-start">
        <AnimatedNumber_003 />
      </div>
      <div className="snap-start">
        <AnimatedNumber_004 />
      </div>
    </section>
  );
};

export const DemoSkipper37 = Skipper37;
export default Skipper37;
