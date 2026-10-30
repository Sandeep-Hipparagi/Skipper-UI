"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useScroll,
  useInView,
} from "framer-motion";
import { ReactLenis } from "lenis/react";

export const stickyCardImages = [
  "/examples/photo-023.jpg",
  "/examples/photo-039.jpg",
  "/examples/photo-028.jpg",
  "/examples/photo-030.jpg",
  "/examples/photo-032.jpg",
  "/examples/photo-072.jpg",
  "/examples/photo-036.jpg",
];

export interface StickyCardProps {
  imgUrl: string;
}

export const StickyCard_003: React.FC<StickyCardProps> = ({ imgUrl }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialScrollY, setInitialScrollY] = useState(Infinity);
  const rotateVal = useMotionValue(0);
  const counterRotateVal = useTransform(rotateVal, (v) => -v);
  const { scrollY } = useScroll({ target: cardRef });
  const scale = useTransform(scrollY, [initialScrollY, initialScrollY + 10000], [1, 0]);

  const isInView = useInView(cardRef, {
    margin: "0px 0px -90% 0px",
    once: true,
  });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      let currentScale = 1;
      if (latest > initialScrollY) {
        currentScale = Math.max(0, 1 - (latest - initialScrollY) / 10000);
      }
      scale.set(currentScale);
      rotateVal.set((1 - currentScale) * 100);
    });

    return () => unsubscribe();
  }, [scrollY, initialScrollY, scale, rotateVal]);

  useEffect(() => {
    if (isInView) {
      setInitialScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={cardRef}
      className="sticky h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-neutral-200 shadow-xl"
      style={{
        scale,
        rotate: rotateVal,
        top: "10vh",
      }}
    >
      <motion.img
        src={imgUrl}
        alt="card media"
        style={{ rotate: counterRotateVal }}
        className="h-full w-full scale-125 object-cover"
      />
    </motion.div>
  );
};

export const Skipper34: React.FC = () => {
  return (
    <ReactLenis root>
      <section className="relative flex w-screen flex-col items-center gap-[10vh] px-4 pt-[50vh] pb-[50vh] bg-background text-foreground">
        <div className="absolute left-1/2 top-24 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            scroll down to see effect
          </span>
        </div>

        {stickyCardImages.map((src, index) => (
          <StickyCard_003 key={index} imgUrl={src} />
        ))}
      </section>
    </ReactLenis>
  );
};

export const DemoSkipper34 = Skipper34;
export default Skipper34;
