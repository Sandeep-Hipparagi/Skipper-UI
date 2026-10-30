"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Speaker {
  name: string;
  title: string;
  origin: "left" | "right";
}

const SPEAKERS: Speaker[] = [
  { name: "Alex Johnson", title: "CEO & Founder", origin: "right" },
  { name: "Sarah Chen", title: "CTO", origin: "left" },
  { name: "Marcus Rivera", title: "Lead Designer", origin: "left" },
  { name: "Emily Watson", title: "Product Manager", origin: "right" },
  { name: "David Kim", title: "Senior Developer", origin: "left" },
  { name: "Lisa Thompson", title: "Marketing Director", origin: "left" },
  { name: "James Wilson", title: "UX Researcher", origin: "right" },
  { name: "Rachel Green", title: "Data Scientist", origin: "left" },
  { name: "Michael Brown", title: "DevOps Engineer", origin: "left" },
  { name: "Anna Davis", title: "Content Strategist", origin: "left" },
  { name: "Tom Anderson", title: "Sales Manager", origin: "left" },
  { name: "Sophie Lee", title: "QA Lead", origin: "left" },
  { name: "Chris Taylor", title: "Backend Developer", origin: "right" },
  { name: "Maya Patel", title: "Frontend Developer", origin: "left" },
  { name: "Ryan O'Connor", title: "Mobile Developer", origin: "left" },
  { name: "Zoe Martinez", title: "Design Systems", origin: "right" },
  { name: "Jordan Smith", title: "Product Analyst", origin: "left" },
];

const GRID_LAYOUT: (number | null)[][] = [
  [0, null, 1, null],
  [null, 2, null, null],
  [3, null, null, 4],
  [null, 5, 6, null],
  [7, null, null, 8],
  [null, null, 9, null],
  [null, 10, null, 11],
  [12, null, 13, null],
  [null, 14, null, null],
  [15, null, null, 16],
];

function SpeakerCard({ speaker, index }: { speaker: Speaker; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.4, 0.695, 1], [-0.5, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className="relative h-full w-full"
      style={{
        transformOrigin: speaker.origin === "left" ? "bottom left" : "bottom right",
        scale,
      }}
    >
      <img
        src={`/images/oct25Coll/portraits/p_${index + 1}.png`}
        alt={speaker.name}
        className="h-full w-full object-cover filter contrast-125 grayscale transition-transform duration-300 ease-in-out hover:scale-95"
      />
      <div className="absolute -bottom-2 left-0 flex w-full translate-y-full justify-between text-center text-xs uppercase leading-tight opacity-50">
        <p className="font-semibold">{speaker.name}</p>
        <p>({speaker.title})</p>
      </div>
    </motion.div>
  );
}

export function Skipper79() {
  return (
    <div className="w-full bg-[#121212] text-white">
      <section className="relative w-full">
        <div className="absolute left-1/2 top-24 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight text-white/50 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-white/50 after:content-['']">
            scroll down to see effect
          </span>
        </div>

        <div className="pointer-events-none sticky top-1/2 z-20 -translate-y-1/2 text-center text-white mix-blend-exclusion">
          <h2 className="text-8xl font-bold tracking-tighter md:text-9xl">Speakers</h2>
          <p className="mt-2 text-sm uppercase tracking-widest text-white/50">Oct 22, 2025</p>
        </div>

        <div className="relative z-0 mb-[50vh] mt-[50vh]">
          {GRID_LAYOUT.map((row, rIdx) => (
            <div key={rIdx} className="flex w-full">
              {row.map((speakerIdx, cIdx) => (
                <div key={cIdx} className="aspect-square flex-1 p-2 md:p-4">
                  {speakerIdx !== null && (
                    <SpeakerCard speaker={SPEAKERS[speakerIdx]} index={speakerIdx} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export { Skipper79 as DemoSkipper79 };
export default Skipper79;
