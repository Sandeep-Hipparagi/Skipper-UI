"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export interface CharacterProps {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
}

export const CharacterV1: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const i = index - centerIndex;
  const x = useTransform(scrollYProgress, [0, 0.5], [50 * i, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [50 * i, 0]);

  return (
    <motion.span
      className={cn("inline-block text-orange-500", char === " " && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  );
};

export const CharacterV2: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const i = index - centerIndex;
  const x = useTransform(scrollYProgress, [0, 0.5], [50 * i, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [50 * Math.abs(i), 0]);

  return (
    <motion.img
      src={char}
      alt="tech stack"
      className={cn("inline-block size-14 object-contain", char === " " && "w-4")}
      style={{ x, scale, y, transformOrigin: "center" }}
    />
  );
};

export const CharacterV3: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const i = index - centerIndex;
  const x = useTransform(scrollYProgress, [0, 0.5], [90 * i, 0]);
  const rotate = useTransform(scrollYProgress, [0, 0.5], [50 * i, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [-20 * Math.abs(i), 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  return (
    <motion.img
      src={char}
      alt="tech stack"
      className={cn("inline-block size-14 object-contain", char === " " && "w-4")}
      style={{ x, rotate, y, scale, transformOrigin: "center" }}
    />
  );
};

const CurlyBracket: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 27 78" className={className}>
    <path
      fill="#000"
      d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
    />
  </svg>
);

export const defaultTechIcons = [
  "/mac/Discord.png",
  "/mac/figma.png",
  "/mac/Framer.png",
  "/mac/Github.png",
  "/mac/Monog.png",
  "/mac/notion.png",
  "/mac/Pieces.png",
  "/mac/Postman.png",
  "/mac/vsCode.png",
];

export const Skipper31: React.FC = () => {
  const target1Ref = useRef<HTMLDivElement>(null);
  const target2Ref = useRef<HTMLDivElement>(null);
  const target3Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress: scroll1 } = useScroll({ target: target1Ref });
  const { scrollYProgress: scroll2 } = useScroll({ target: target2Ref });
  const { scrollYProgress: scroll3 } = useScroll({ target: target3Ref });

  const textChars = "see more from Sandeep".split("");
  const textCenter = Math.floor(textChars.length / 2);
  const iconCenter = Math.floor(defaultTechIcons.length / 2);

  return (
    <ReactLenis root>
      <main className="w-full bg-white text-black">
        <div className="absolute left-1/2 top-10 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-[#f5f4f3] after:to-black after:content-['']">
            Scroll to see more
          </span>
        </div>

        {/* Section 1: Character text animation */}
        <div
          ref={target1Ref}
          className="relative box-border flex h-[210vh] items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <div
            className="w-full max-w-4xl text-center text-6xl font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {textChars.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={textCenter}
                scrollYProgress={scroll1}
              />
            ))}
          </div>
        </div>

        {/* Section 2: V2 Icon convergence */}
        <div
          ref={target2Ref}
          className="relative -mt-[100vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <CurlyBracket className="h-12 text-black" />
            <span>integrate with your fav tech stack</span>
            <CurlyBracket className="h-12 scale-x-[-1] text-black" />
          </p>
          <div className="flex w-full max-w-4xl items-center justify-center gap-2 text-center text-6xl font-bold uppercase tracking-tighter text-black">
            {defaultTechIcons.map((src, index) => (
              <CharacterV2
                key={index}
                char={src}
                index={index}
                centerIndex={iconCenter}
                scrollYProgress={scroll2}
              />
            ))}
          </div>
        </div>

        {/* Section 3: V3 Rotated curved convergence */}
        <div
          ref={target3Ref}
          className="relative -mt-[95vh] box-border flex h-[210vh] flex-col items-center justify-center gap-[2vw] overflow-hidden bg-[#f5f4f3] p-[2vw]"
        >
          <p className="flex items-center justify-center gap-3 text-2xl font-medium tracking-tight text-black">
            <CurlyBracket className="h-12 text-black" />
            <span>integrate with your fav tech stack</span>
            <CurlyBracket className="h-12 scale-x-[-1] text-black" />
          </p>
          <div
            className="flex w-full max-w-4xl items-center justify-center gap-2 text-center text-6xl font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {defaultTechIcons.map((src, index) => (
              <CharacterV3
                key={index}
                char={src}
                index={index}
                centerIndex={iconCenter}
                scrollYProgress={scroll3}
              />
            ))}
          </div>
        </div>
      </main>
    </ReactLenis>
  );
};

export const DemoSkipper31 = Skipper31;
export default Skipper31;
