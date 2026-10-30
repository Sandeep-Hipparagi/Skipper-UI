"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MenuItem {
  name: string;
  value: number;
  date: string;
}

export const defaultMenuItems: MenuItem[] = [
  { name: "Sydney", value: 21.1, date: "2025-01-01" },
  { name: "Melbourne", value: 15.2, date: "2025-01-02" },
  { name: "Brisbane", value: 10.3, date: "2025-01-03" },
  { name: "Mumbai", value: 8.4, date: "2025-01-04" },
  { name: "Los Angeles", value: 6.5, date: "2025-01-05" },
  { name: "Mexico City", value: 4.6, date: "2025-01-06" },
  { name: "London", value: 2.7, date: "2025-01-07" },
];

export const NikeSwoosh: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={cn("h-6 w-auto inline-block", className)}
  >
    <path d="M21.707 5.293a1 1 0 0 0-1.414 0L9 16.586l-3.293-3.293a1 1 0 0 0-1.414 1.414l4 4a1 1 0 0 0 1.414 0l12-12a1 1 0 0 0 0-1.414z" />
  </svg>
);

export const Navbar_001: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ height: "79px" }}
      animate={{ height: isOpen ? "100vh" : "79px" }}
      transition={{ duration: 0.3 }}
      className="z-50 md:w-[480px] absolute left-1/2 flex w-full -translate-x-1/2 justify-center overflow-hidden"
    >
      <motion.div
        ref={menuRef}
        animate={{ gap: isOpen ? "8px" : "1px" }}
        className="md:w-[480px] absolute flex h-screen w-screen flex-col p-4"
      >
        <nav className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 px-7 py-5 text-white backdrop-blur-md border border-white/10 shadow-lg">
          <span className="font-black text-xl tracking-tighter text-[#F11313]">NIKE</span>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xs font-bold uppercase tracking-wider text-white hover:text-[#F11313] transition-colors"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </nav>

        <ul className="flex w-full flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-[#121212]/80 px-7 py-5 text-[#F11313] backdrop-blur-md border border-white/10">
          {defaultMenuItems.map((item, idx) => (
            <li
              key={idx}
              className="relative flex cursor-pointer flex-col items-center overflow-hidden hover:opacity-80 transition-opacity"
            >
              <div className="flex items-start gap-2">
                <span className="text-3xl sm:text-4xl font-black uppercase leading-[0.85] tracking-[-0.03em]">
                  {item.name}
                </span>
                <span className="text-xs font-bold leading-none tracking-tighter text-white/50">
                  {item.value}k
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 p-4 text-xs tracking-tight text-white/60 backdrop-blur-md border border-white/10">
          <p className="cursor-pointer hover:text-white">Privacy Policy</p>
          <p className="cursor-pointer hover:text-white">Terms of Service</p>
        </div>

        <div className="flex w-full items-center justify-between rounded-2xl bg-[#121212]/80 px-7 py-4 text-xs font-medium tracking-tight text-white/60 backdrop-blur-md border border-white/10">
          <button className="text-[#F11313] font-bold">PB</button>
          <button className="hover:text-white">EN</button>
          <button className="hover:text-white">ES</button>
          <button className="hover:text-white">FR</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const NikeHeroSection: React.FC = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-black pt-52 pb-20 font-sans text-[#F11313] px-4 text-center">
    <div className="relative z-10 flex flex-col items-center justify-center text-4xl font-black uppercase leading-[0.85] tracking-tighter md:text-7xl lg:text-9xl select-none">
      <div className="flex items-center gap-3">
        <span>AFTER DARK TOUR</span>
      </div>
      <div className="flex items-start gap-2 mt-2">
        <span>SEOUL</span>
        <span className="text-xs md:text-sm font-mono text-white/50 tracking-widest self-start mt-2">
          2025
        </span>
      </div>
    </div>
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-screen pointer-events-none"
      style={{ backgroundImage: `url('/skipperv1/skipper7/bg.png')` }}
    />
  </div>
);

export const Skipper13: React.FC = () => {
  return (
    <section className="relative min-h-screen bg-black">
      <Navbar_001 />
      <NikeHeroSection />
    </section>
  );
};

export const DemoSkipper13 = Skipper13;
export default Skipper13;
