"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ItemData {
  bgSrc: string;
  title: string;
  desc: string;
}

const ITEMS: ItemData[] = [
  {
    bgSrc: "/images/templates/bg0.svg",
    title: "First ever to do that",
    desc: "We are the first one ever to do this shit bla bla bla trust in us we got some decent funding tooo bla bla",
  },
  {
    bgSrc: "/images/templates/bg1.svg",
    title: "Revolutionary approach",
    desc: "Our innovative solution transforms the way you think about design and development, bringing cutting-edge technology to your fingertips.",
  },
  {
    bgSrc: "/images/templates/bg2.svg",
    title: "Next level experience",
    desc: "Experience the future of user interfaces with our advanced features and seamless integration capabilities that elevate your projects.",
  },
];

function GridCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: ItemData;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const yImage = useTransform(scrollYProgress, [start, end], [-50, 0]);
  const yText = useTransform(scrollYProgress, [start, end], [50, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0, 1]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);

  return (
    <div className="z-10 relative flex flex-col gap-10">
      <motion.div
        style={{ y: yImage, opacity }}
        className="relative flex h-60 w-full items-center justify-center rounded-2xl overflow-hidden shadow-lg border"
      >
        <img src={item.bgSrc} alt="" className="h-full w-full rounded-xl object-cover dark:invert" />
        <img
          src="/images/templates/Aa0.svg"
          alt=""
          className="pointer-events-none absolute h-[55%] w-fit object-cover transition-all duration-300 ease-out group-hover:scale-110 dark:invert"
        />
      </motion.div>

      <motion.div
        style={{ scale }}
        className="flex size-8 items-center justify-center bg-orange-500 text-white font-mono font-bold text-sm rounded-sm"
      >
        {index + 1}
      </motion.div>

      <motion.div style={{ y: yText, opacity }} className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tighter">{item.title}</h2>
        <p className="opacity-65 text-sm leading-relaxed">{item.desc}</p>
      </motion.div>
    </div>
  );
}

export function Skipper104() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  return (
    <div className="w-full bg-background text-foreground">
      <div className="-mb-36 mt-36 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll below to see effect
        </span>
      </div>

      {/* Desktop Sticky Scroll Section */}
      <div className="hidden lg:flex items-center justify-center">
        <div ref={targetRef} className="h-[500vh] w-full">
          <div className="sticky top-1/2 grid w-full max-w-7xl -translate-y-1/2 gap-20 px-8 mx-auto grid-cols-3">
            {ITEMS.map((item, idx) => (
              <GridCard
                key={idx}
                item={item}
                index={idx}
                total={ITEMS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}

            <motion.div
              style={{
                scaleX: scrollYProgress,
                scaleY: useTransform(scrollYProgress, [0, 1 / ITEMS.length], [0, 1]),
              }}
              className="absolute left-8 top-[320px] h-1 w-[calc(100%-64px)] origin-left bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile Fallback List */}
      <div className="relative my-32 flex w-full flex-col gap-24 pl-14 pr-6 lg:hidden">
        {ITEMS.map((item, idx) => (
          <div key={idx} className="relative z-10 flex flex-col gap-4">
            <div className="absolute -left-12 flex size-8 items-center justify-center bg-orange-500 text-white font-mono text-xs">
              {idx + 1}
            </div>
            <div className="bg-background relative flex h-60 w-full items-center justify-center rounded-xl border overflow-hidden">
              <img src={item.bgSrc} alt="" className="h-full w-full rounded-xl object-cover dark:invert" />
              <img
                src="/images/templates/Aa0.svg"
                alt=""
                className="pointer-events-none absolute h-[55%] w-fit object-cover dark:invert"
              />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tighter">{item.title}</h2>
              <p className="opacity-65 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
        <div className="absolute left-6 top-2 h-[99%] w-1 origin-left bg-orange-500" />
      </div>
    </div>
  );
}

export function DemoSkipper104() {
  return <Skipper104 />;
}

export default Skipper104;
