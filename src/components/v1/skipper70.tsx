"use client";

import React, { useRef, ReactNode, Children } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  wordIndex: number;
  totalWords: number;
  highlight?: string;
  highlightTextClass?: string;
  highlightBgClass?: string;
}

function Word({
  children,
  progress,
  wordIndex,
  totalWords,
  highlight,
  highlightTextClass,
  highlightBgClass,
}: WordProps) {
  const normIndex = wordIndex / totalWords;
  const scaleFactor =
    1 / Math.min(1 + 15 / totalWords, 1 + (totalWords - 1) / totalWords + 15 / totalWords);
  const start = normIndex * scaleFactor;
  const end = (normIndex + 15 / totalWords) * scaleFactor;
  const delta = end - start;

  const containerOpacity = useTransform(progress, [start, end], [0, 1]);
  const bgOpacity = useTransform(progress, [start + 0.9 * delta, end], [1, 0]);
  const textOpacity = useTransform(progress, [start + 0.9 * delta, end], [0, 1]);

  const isHighlighted = highlight === children;

  return (
    <motion.span
      className={cn(
        "relative mx-1 inline-block text-black lg:mx-1.5 dark:text-white",
        isHighlighted && highlightTextClass
      )}
      style={{ opacity: containerOpacity }}
    >
      <motion.div
        className={cn(
          "absolute left-1/2 top-1/2 h-[80%] w-[105%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black dark:bg-white",
          isHighlighted && highlightBgClass
        )}
        style={{ opacity: bgOpacity }}
      />
      <motion.span className="relative z-10" style={{ opacity: textOpacity }}>
        {children}
      </motion.span>
    </motion.span>
  );
}

export interface TextBoxRevealProps {
  children: ReactNode;
  className?: string;
  highlight?: string;
  highlightTextClass?: string;
  highlightBgClass?: string;
}

export function TextBoxReveal({
  children,
  className,
  highlight,
  highlightTextClass,
  highlightBgClass,
}: TextBoxRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const textContent = (
    typeof children === "string"
      ? children
      : Children.toArray(children)
          .map((child) => {
            if (typeof child === "string") return child;
            if (
              typeof child === "object" &&
              child !== null &&
              "type" in child &&
              (child as { type: unknown }).type === "br"
            ) {
              return "\n";
            }
            if (typeof child === "object" && child !== null && "props" in child) {
              return (child as { props: { children?: ReactNode } }).props.children || "";
            }
            return String(child);
          })
          .join("")
  ).split(/\n+/);

  const wordEntries: { word: string; lineIndex: number; wordIndex: number }[] = [];
  textContent.forEach((line, lIdx) => {
    line
      .split(/\s+/)
      .filter((w) => w.length > 0)
      .forEach((word, wIdx) => {
        wordEntries.push({ word, lineIndex: lIdx, wordIndex: wIdx });
      });
  });

  return (
    <div ref={containerRef} className="relative z-0 h-[400vh]">
      <div className="sticky top-0 mx-auto flex h-screen max-w-4xl items-center bg-transparent px-[1rem] py-[5rem]">
        <div
          className={cn(
            "flex flex-col gap-20 p-5 text-2xl tracking-tight text-black/20 md:p-8 md:text-3xl lg:p-10 lg:text-4xl xl:text-5xl dark:text-white/20",
            className
          )}
        >
          {textContent.map((line, lIdx) => {
            const words = line.split(/\s+/).filter((w) => w.length > 0);
            return (
              <div key={lIdx} className="flex flex-wrap">
                {words.map((w, wIdx) => {
                  const globalIdx = wordEntries.findIndex(
                    (entry) => entry.lineIndex === lIdx && entry.wordIndex === wIdx
                  );
                  return (
                    <Word
                      key={`${lIdx}-${wIdx}`}
                      progress={scrollYProgress}
                      wordIndex={globalIdx}
                      totalWords={wordEntries.length}
                      highlight={highlight}
                      highlightTextClass={highlightTextClass}
                      highlightBgClass={highlightBgClass}
                    >
                      {w}
                    </Word>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Skipper70() {
  return (
    <div className="h-full w-full bg-[#f5f4f3] text-black">
      <div className="my-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Scroll to reveal text word by word
        </span>
      </div>
      <TextBoxReveal
        highlight="distributed"
        highlightTextClass="!text-orange-500"
        highlightBgClass="!bg-orange-500"
        className="font-old-school-grotesk"
      >
        Your data is taken by companies and used to train the next wave of AI models
        and build the world&apos;s top products and services. Yet it often happens
        without any earnings being distributed back to you.
        <br />
        It&apos;s time for a change. With Navigate you join a decentralized
        intelligence platform that puts the power back in your hands and rewards you
        for the data you contribute.
      </TextBoxReveal>
    </div>
  );
}

export { Skipper70 as DemoSkipper70 };
export default Skipper70;
