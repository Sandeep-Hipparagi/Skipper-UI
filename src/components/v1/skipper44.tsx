"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const DESIGNERS = [
  "Sandeep",
  "Not Sandeep ",
  "Jane Smith",
  "Emily Chen",
  "Carlos Ramirez",
  "Ava Patel",
  "Liam O'Brien",
  "Sophia Müller",
  "Noah Kim",
  "Mia Rossi",
  "Lucas Silva",
  "Olivia Dubois",
  "Ethan Zhang",
  "Chloe Ivanova",
  "Mateo Garcia",
  "Isabella Rossi",
  "William Lee",
  "Zara Ahmed",
  "Benjamin Cohen",
  "Hana Suzuki",
];

export function Skipper44() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const headerScale = useTransform(scrollYProgress, [0.2, 1], [1, 0.5]);
  const blurVal = useTransform(scrollYProgress, [0.2, 0.8], [0, 20]);
  const cardScale = useTransform(scrollYProgress, [0, 0.3], [0.98, 1]);

  const blurTemplate = useMotionTemplate`blur(${blurVal}px)`;

  return (
    <div className="font-geist flex w-screen flex-col items-center overflow-x-clip bg-[#f5f4f3] pt-[50vh] text-black">
      <motion.div
        style={{ scale: headerScale }}
        className="sticky top-[10%] flex gap-2 pb-10 text-2xl font-bold tracking-tighter md:text-5xl"
      >
        <div className="sticky top-[50%] h-fit">
          <h1>We Design</h1>
          <div className="absolute left-full top-0 z-10 h-[40vh] w-screen -translate-y-full bg-[#f5f4f3]/90" />
          <div className="absolute bottom-0 left-full z-10 h-[44vh] w-screen translate-y-full bg-[#f5f4f3]/90" />
        </div>
        <div className="h-fit space-y-2">
          <h2>the Skipper platform</h2>
          <h2>Skipper Design System</h2>
          <h2>the Skipper library </h2>
          <h2>the Skipper brand</h2>
          <h2>Skipper Conf</h2>
          <h2>the Skipper platform</h2>
          <h2>Skipper Ship</h2>
        </div>
        <motion.div
          style={{ backdropFilter: blurTemplate }}
          className="absolute inset-0 bg-white/10"
        />
      </motion.div>

      <motion.div
        ref={containerRef}
        style={{ scale: cardScale }}
        className="rounded-4xl z-20 mt-[20vh] flex w-full flex-col items-center space-y-20 bg-[#121212] py-[20vh] font-medium tracking-tight text-white"
      >
        <div className="grid w-full max-w-sm grid-cols-2 gap-5">
          <p className="text-right opacity-30">Brand Design</p>
          <ul>
            {DESIGNERS.slice(0, 5).map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div className="grid w-full max-w-sm grid-cols-2 gap-5">
          <p className="text-right opacity-30">Design Engineers</p>
          <ul>
            {DESIGNERS.map((name, idx) => (
              <li key={idx}>{name}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export { Skipper44 as DemoSkipper44 };
export default Skipper44;
