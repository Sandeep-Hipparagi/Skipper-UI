"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Overview" },
  { label: "Deployments" },
  { label: "Analytics" },
  { label: "Speed Insights" },
  { label: "Logs" },
  { label: "Observability" },
  { label: "Firewall" },
  { label: "Storage" },
  { label: "Flags" },
  { label: "Settings" },
];

export function Skipper57() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const navX = useTransform(scrollY, [0, 50], [0, 42]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.8]);
  const logoY = useTransform(scrollY, [0, 50], [0, -10]);

  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  return (
    <div ref={containerRef} className="font-geist relative w-full min-h-screen bg-[#f5f4f3] text-black">
      <div className="sticky top-[23px] z-10">
        <motion.svg
          style={{ scale: logoScale, y: logoY }}
          className="absolute left-4 z-10 size-5 lg:left-6"
          aria-label="Vercel Logo"
          viewBox="0 0 75 65"
          fill="currentColor"
          height="22"
        >
          <path d="M37.59.25l36.95 64H.64l36.95-64z" />
        </motion.svg>
      </div>

      <header className="flex gap-4 border-b border-black/5 bg-white/80 px-6 pb-2 pl-16 text-sm backdrop-blur">
        <ol className="flex items-center gap-4 pt-4">
          <li aria-hidden="true" className="text-lg opacity-35">
            /
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex size-5 items-center justify-center overflow-hidden rounded-full bg-black/10">
              <span className="text-xs font-bold">S</span>
            </span>
            <p className="font-medium">Sandeep&apos;s projects</p>
            <p className="rounded-full bg-black/5 px-2 py-px text-[11px] font-medium text-black/60">
              Hobby
            </p>
            <button className="cursor-pointer -space-y-1 rounded-md px-1 py-1 text-[#919191] hover:bg-black/5">
              <ChevronUp className="stroke-[3] block size-3" />
              <ChevronDown className="stroke-[3] block size-3" />
            </button>
          </li>
          <li aria-hidden="true" className="hidden text-lg opacity-35 lg:block">
            /
          </li>
          <li className="hidden items-center gap-2 lg:flex">
            <span className="inline-flex size-5 items-center justify-center rounded-full bg-sky-500 text-white text-[10px] font-bold">
              S
            </span>
            <p className="font-medium">skipper-ui-demo</p>
            <button className="cursor-pointer -space-y-1 rounded-md px-1 py-1 text-[#919191] hover:bg-black/5">
              <ChevronUp className="stroke-[3] block size-3" />
              <ChevronDown className="stroke-[3] block size-3" />
            </button>
          </li>
        </ol>
      </header>

      <nav className="sticky top-0 z-10 flex border-b border-black/10 bg-white/80 text-sm backdrop-blur">
        <motion.div
          style={{ x: navX }}
          onMouseLeave={() => setHoveredTab(null)}
          className="scrollbar-hide relative flex gap-2 overflow-y-visible overflow-x-scroll whitespace-nowrap px-6 py-1 text-sm"
        >
          {NAV_ITEMS.map((item, idx) => (
            <a
              key={idx}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(idx);
              }}
              onMouseEnter={() => setHoveredTab(idx)}
              className={cn(
                "relative flex items-center justify-center px-3 py-2 font-medium transition-colors",
                activeTab !== idx ? "opacity-60 hover:opacity-100" : "opacity-100"
              )}
            >
              {item.label}
              {activeTab === idx && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 h-[2px] w-full rounded-3xl bg-black"
                />
              )}
              {hoveredTab === idx && (
                <motion.div
                  style={{ borderRadius: "10px" }}
                  layoutId="hoverBg"
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/5"
                />
              )}
            </a>
          ))}
        </motion.div>
      </nav>

      <main className="mx-auto my-12 max-w-7xl px-5">
        <div className="grid w-full gap-4 lg:grid-cols-3">
          <div className="h-64 flex flex-col justify-end rounded-2xl border border-black/10 bg-white p-4 lg:col-span-3 shadow-sm">
            <div className="h-10 w-full rounded-b-xl border-y border-black/5" />
            <div className="h-10 w-full" />
          </div>
          <div className="h-48 flex flex-col justify-end rounded-2xl border border-black/10 bg-white p-4 shadow-sm" />
          <div className="h-48 flex flex-col justify-end rounded-2xl border border-black/10 bg-white p-4 shadow-sm" />
          <div className="h-48 flex flex-col justify-end rounded-2xl border border-black/10 bg-white p-4 shadow-sm" />
          <div className="h-64 flex flex-col justify-end rounded-2xl border border-black/10 bg-white p-4 lg:col-span-3 shadow-sm">
            <div className="h-full w-full rounded-xl border border-dashed border-black/15 bg-black/[0.02]" />
          </div>
        </div>
      </main>
    </div>
  );
}

export { Skipper57 as DemoSkipper57 };
export default Skipper57;
