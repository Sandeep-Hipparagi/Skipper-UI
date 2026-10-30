"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ReactLenis } from "lenis/react";

const DownArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="100%" className={className}>
    <path
      fill="currentColor"
      d="M69.022 85.363c16.693-13.32 20.658-33.261 20.16-43.736H77.95c0 17.454-11.106 29.106-20.543 35.517-4.676 3.177-10.818 2.998-15.414-.293-17.124-12.264-19.958-27.753-18.988-35.224H10.305c0 20.438 9.697 34.444 20.244 43.16 11.033 9.118 27.285 9.503 38.473.576Z"
    />
    <path fill="currentColor" fillRule="evenodd" d="M56.016 5v79.243H43.56V5h12.455Z" clipRule="evenodd" />
  </svg>
);

const VideoClipPath: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1836 1053" width="0" height="0" className="absolute">
    <clipPath id="video" clipPathUnits="objectBoundingBox">
      <path
        fill="currentColor"
        d="M457.525 1.148c-20.789-3.198-193.979 1.16-283.854 2.496 11.104-.178 1.297-2.868-81.146-2.496-103.5.468-86 102.499-86 109.999s-7 524.5-6.5 547.5 10 59 6.5 99c-2.8 32-1.167 234.667 0 332.003.5 75 62.5 66.5 67 68.5s38.5 0 81.5 0 436 6 526 10.5 438.995-.5 505.495 0 330.01-12.5 417.51-12.5 230.99 2 270.99 0 40.5-16 51-31.5 12.5-61 12.5-105.5c0-44.503 7.01-274.504 7.01-348.004s-3.51-159.998-7.01-230.998 0-256.002 0-318.002 7.01-92.998-22.5-110.999c-18.79-11.471-81.99-9.999-133.49-9.999H853.525c-29 0-370 4-396 0Z"
        transform="scale(0.0005139987561, 0.0008543065594)"
      />
    </clipPath>
  </svg>
);

const ActionTrailerBadge: React.FC = () => (
  <div className="absolute z-20 flex scale-50 flex-col items-center justify-center gap-3 text-center text-red-500 lg:scale-100">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="100%" className="size-24">
      <path
        fill="currentColor"
        d="M80.593 43.765c4.543 3.072 4.543 9.762 0 12.834L28.219 92.021c-5.145 3.48-12.087-.206-12.087-6.417V14.76c0-6.21 6.942-9.897 12.087-6.417l52.374 35.422Z"
      />
    </svg>
    <p className="text-xs uppercase tracking-widest font-mono">ACTION</p>
    <h1 className="text-3xl uppercase leading-[0.9] font-bold">
      watch <br /> trailer
    </h1>
  </div>
);

export const SienaParallax: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: videoScroll } = useScroll({
    target: videoRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(heroScroll, [0.6, 1], ["0%", "30%"]);
  const containerScale = useTransform(videoScroll, [0, 1], [1, 0.7]);
  const imageScale = useTransform(videoScroll, [0, 1], [1, 1.3]);

  return (
    <ReactLenis root>
      <div className="flex w-screen flex-col items-center overflow-hidden bg-[#F9F7EF] text-black">
        <VideoClipPath />

        {/* Hero Section */}
        <div ref={heroRef} className="relative flex h-[70vh] w-screen items-end overflow-hidden">
          <div className="absolute left-10 top-10 z-30 flex items-center justify-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#F9F7EF] p-2 text-black">
              <DownArrowIcon className="rotate-90 size-4" />
            </div>
            <p className="text-xs uppercase tracking-widest text-[#F9F7EF] font-mono">
              All work
            </p>
          </div>
          <div className="absolute left-0 top-0 z-10 h-1/2 w-full bg-gradient-to-t from-transparent to-black/90" />
          <motion.img
            src="/skipperv1/common/img_p11.png"
            alt="Hero image"
            className="h-screen w-full object-cover"
            style={{ y: heroY }}
          />
        </div>

        {/* Title Section */}
        <div className="flex w-full flex-col items-center justify-center">
          <p className="my-10 text-sm tracking-widest uppercase font-mono">DOCUMENTARY</p>
          <h1 className="w-full border-b border-t text-center text-5xl font-black uppercase leading-tight lg:text-8xl py-4">
            MY PROJECT X
          </h1>
          <div className="my-4 flex size-8 items-center justify-center rounded-full bg-black p-2 text-[#F9F7EF]">
            <DownArrowIcon className="size-4" />
          </div>
        </div>

        {/* Clipped Mask Video Showcase */}
        <motion.div
          ref={videoRef}
          style={{ scale: containerScale, clipPath: "url(#video)" }}
          className="relative mt-20 flex aspect-video w-full items-center justify-center overflow-hidden lg:w-[80%]"
        >
          <div className="absolute z-20 size-full bg-black/15" />
          <ActionTrailerBadge />
          <motion.img
            src="/skipperv1/common/img_p11.png"
            alt="Project media"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: imageScale }}
          />
        </motion.div>

        {/* Production categories */}
        <div className="mt-32 flex w-full flex-col items-center justify-center uppercase font-bold text-5xl lg:text-8xl">
          <h1 className="w-full border-t text-center py-4">Production</h1>
          <h1 className="w-full border-t text-center py-4">Documentary</h1>
          <h1 className="w-full border-b border-t text-center py-4">Film TV</h1>
        </div>

        {/* Sitemap footer */}
        <div className="my-32 flex flex-col items-center justify-center uppercase">
          <p className="my-6 text-sm tracking-widest font-mono">SITEMAP</p>
          {["Work", "About", "Contact", "Privacy"].map((item) => (
            <h1
              key={item}
              className="w-full cursor-pointer text-center text-4xl leading-tight opacity-30 transition-opacity hover:opacity-100 py-1"
            >
              {item}
            </h1>
          ))}
        </div>
      </div>
    </ReactLenis>
  );
};

export const Skipper29 = SienaParallax;
export const DemoSkipper29 = Skipper29;
export default Skipper29;
