"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const PROJECTS = [
  { title: "Skipper OSS 001", img: "/images/oct25Coll/skipperpro/shoreel-9.png" },
  { title: "NeonSync Pro", img: "/images/oct25Coll/skipperpro/shoreel-8.png" },
  { title: "PixelForge Studio", img: "/images/oct25Coll/skipperpro/shoreel-8.png" },
  { title: "TaskFlow Sonet", img: "/images/oct25Coll/skipperpro/shoreel-4.png" },
  { title: "CloudVibe Bruh", img: "/images/oct25Coll/skipperpro/shoreel-5.png" },
];

export function Skipper80() {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex min-h-screen w-screen justify-center bg-[#f5f4f3] py-32 text-black">
      {selected === null ? (
        <>
          <motion.img
            drag
            style={{ borderRadius: "25px" }}
            layoutId="active-img"
            className="fixed left-[15%] top-[10%] aspect-video h-52 -translate-x-1/2 border border-black/10 object-cover shadow-2xl cursor-grab active:cursor-grabbing"
            src={PROJECTS[hovered].img}
            alt={PROJECTS[hovered].title}
          />

          <ul className="fixed bottom-[20%] right-[10%] flex flex-col gap-3">
            <li className="flex w-full items-center gap-3 text-sm font-semibold uppercase tracking-wider text-black/50">
              my Projects
              <span className="h-px flex-1 bg-black/20" />
            </li>
            {PROJECTS.map((item, idx) => (
              <motion.li
                key={item.title}
                layoutId={`text-header-${idx}`}
                style={{ opacity: hovered === idx ? 1 : 0.5 }}
                className="relative flex w-fit cursor-pointer items-center text-4xl font-bold tracking-tighter hover:opacity-100 transition-opacity"
                onMouseEnter={() => setHovered(idx)}
                onClick={() => setSelected(idx)}
              >
                {item.title}
                {hovered === idx && (
                  <motion.div
                    initial={{ x: 10, width: "15px", height: "0px" }}
                    animate={{ x: 10, width: "6px", height: "6px" }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-full rounded-full bg-black"
                  />
                )}
              </motion.li>
            ))}
          </ul>
        </>
      ) : (
        <div
          onClick={() => setSelected(null)}
          className="w-full cursor-pointer px-4"
        >
          <div className="mx-auto flex flex-col items-center justify-center gap-12 max-w-xl">
            <div className="w-full space-y-8">
              <div className="font-cal-sans relative h-20 text-5xl font-bold md:text-7xl">
                <motion.h1
                  className="absolute"
                  layoutId={`text-header-${selected}`}
                >
                  {PROJECTS[selected].title}
                </motion.h1>
              </div>
              <motion.img
                layoutId="active-img"
                style={{ borderRadius: "25px" }}
                src={PROJECTS[selected].img}
                alt=""
                className="h-80 w-full object-cover shadow-2xl"
              />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.25 },
                },
              }}
              className="w-full"
            >
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ type: "spring", stiffness: 50, damping: 10 }}
                className="w-full space-y-6"
              >
                <section className="w-full">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Billion Dollar SaaS
                    </h2>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="h-0.5 flex-1 origin-left rounded-full bg-black"
                    />
                  </div>
                </section>

                <div className="space-y-3 text-sm text-black/60">
                  <p>
                    Precision-engineered user interfaces designed for modern web applications.
                    Clean typography, intuitive animations, and zero-compromise performance.
                  </p>
                  <p>
                    Full source code included, built with React, Next.js, Tailwind CSS, and Framer Motion.
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 items-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white shadow hover:bg-black/80 transition-colors"
                  >
                    Live Preview <ExternalLink className="size-3.5" />
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-10 items-center gap-2 rounded-xl border border-black/15 bg-white px-4 text-sm font-medium text-black hover:bg-black/5 transition-colors"
                  >
                    See Source Code <GithubIcon className="size-3.5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Skipper80 as DemoSkipper80 };
export default Skipper80;
