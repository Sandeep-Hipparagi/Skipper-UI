"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { exampleGalleryImages } from "@/lib/example-images";

export interface MotionGridItemProps {
  scrollYProgress: MotionValue<number>;
  imgSrc: string;
  randomValues: {
    rotateXStart: number;
    translateZStart: number;
    translateYStart: number;
    progressEnd: number;
  };
}

export const MotionGridItem: React.FC<MotionGridItemProps> = ({
  scrollYProgress,
  imgSrc,
  randomValues,
}) => {
  const rotateX = useTransform(
    scrollYProgress,
    [0, randomValues.progressEnd],
    [randomValues.rotateXStart, 0]
  );
  const translateZ = useTransform(
    scrollYProgress,
    [0, randomValues.progressEnd],
    [randomValues.translateZStart, 0]
  );
  const translateY = useTransform(
    scrollYProgress,
    [0, randomValues.progressEnd],
    [randomValues.translateYStart, 0]
  );
  const opacity = useTransform(scrollYProgress, [0, randomValues.progressEnd], [0, 1]);

  return (
    <motion.img
      style={{ rotateX, translateY, translateZ, opacity }}
      src={imgSrc}
      alt="grid tile"
      className="h-full w-full object-cover rounded-lg"
    />
  );
};

export const randomTransformValues = [
  { rotateXStart: -45, translateZStart: -450, translateYStart: 2150, progressEnd: 0.7 },
  { rotateXStart: -67, translateZStart: -720, translateYStart: 1720, progressEnd: 1 },
  { rotateXStart: -38, translateZStart: -380, translateYStart: 1380, progressEnd: 0.8 },
  { rotateXStart: -82, translateZStart: -890, translateYStart: 1890, progressEnd: 0.9 },
  { rotateXStart: -53, translateZStart: -540, translateYStart: 2540, progressEnd: 1 },
  { rotateXStart: -71, translateZStart: -760, translateYStart: 1760, progressEnd: 1 },
  { rotateXStart: -42, translateZStart: -420, translateYStart: 1420, progressEnd: 0.75 },
  { rotateXStart: -89, translateZStart: -950, translateYStart: 1950, progressEnd: 0.85 },
  { rotateXStart: -48, translateZStart: -480, translateYStart: 1480, progressEnd: 0.7 },
  { rotateXStart: -75, translateZStart: -800, translateYStart: 1800, progressEnd: 0.8 },
  { rotateXStart: -35, translateZStart: -350, translateYStart: 1350, progressEnd: 0.8 },
  { rotateXStart: -85, translateZStart: -920, translateYStart: 1920, progressEnd: 0.9 },
  { rotateXStart: -58, translateZStart: -580, translateYStart: 1580, progressEnd: 0.65 },
  { rotateXStart: -69, translateZStart: -740, translateYStart: 1740, progressEnd: 1 },
  { rotateXStart: -44, translateZStart: -440, translateYStart: 1440, progressEnd: 0.75 },
  { rotateXStart: -78, translateZStart: -830, translateYStart: 1830, progressEnd: 0.95 },
  { rotateXStart: -51, translateZStart: -510, translateYStart: 1510, progressEnd: 0.7 },
  { rotateXStart: -87, translateZStart: -940, translateYStart: 1940, progressEnd: 0.8 },
  { rotateXStart: -39, translateZStart: -390, translateYStart: 1390, progressEnd: 1 },
  { rotateXStart: -73, translateZStart: -780, translateYStart: 1780, progressEnd: 0.85 },
];

export const WithFramerMotion: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <ReactLenis root>
      <div ref={containerRef} className="relative z-0 h-[300vh] bg-background text-foreground">
        <div className="absolute left-1/2 top-20 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            Scroll effect with motion.dev
          </span>
        </div>

        <div
          className="sticky top-0 grid h-screen grid-cols-5 grid-rows-4 gap-3 p-6"
          style={{ transformStyle: "preserve-3d", perspective: "200px" }}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <MotionGridItem
              key={index}
              scrollYProgress={scrollYProgress}
              imgSrc={exampleGalleryImages[(index + 16) % exampleGalleryImages.length]}
              randomValues={randomTransformValues[index]}
            />
          ))}
        </div>
      </div>
    </ReactLenis>
  );
};

export const gsapGalleryImages = [
  "/examples/photo-032.jpg",
  "/examples/photo-033.jpg",
  "/examples/photo-034.jpg",
  "/examples/photo-035.jpg",
  "/examples/photo-036.jpg",
  "/examples/photo-037.jpg",
  "/examples/photo-038.jpg",
  "/examples/photo-039.jpg",
  "/examples/photo-040.jpg",
  "/examples/photo-041.jpg",
  "/examples/photo-042.jpg",
  "/examples/photo-043.jpg",
  "/examples/photo-044.jpg",
  "/examples/photo-045.jpg",
  "/examples/photo-046.jpg",
  "/examples/photo-047.jpg",
  "/examples/photo-048.jpg",
  "/examples/photo-034.jpg",
  "/examples/photo-035.jpg",
  "/examples/photo-036.jpg",
  "/examples/photo-021.jpg",
];

export const WithGsap: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const timer = setTimeout(() => {
      if (!gridRef.current) return;
      const items = gridRef.current.querySelectorAll<HTMLElement>(".grid-full-item");
      const centerColumn = Math.floor(3.5);
      const columns: HTMLElement[][] = Array.from({ length: 7 }, () => []);

      items.forEach((item, idx) => {
        columns[idx % 7].push(item);
      });

      columns.forEach((colItems, colIdx) => {
        const delay = 0.2 * Math.abs(colIdx - centerColumn);
        gsap
          .timeline({
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          })
          .from(colItems, {
            yPercent: 450,
            autoAlpha: 0,
            delay,
            ease: "sine",
          })
          .from(
            colItems.map((el) => el.querySelector(".grid-item-img") as HTMLElement),
            { transformOrigin: "50% 0%", ease: "sine" },
            0
          );
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className={cn("relative w-full overflow-hidden bg-background text-foreground", className)}>
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div className="absolute left-1/2 top-20 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            Scroll Effect with GSAP
          </span>
        </div>

        <section className="relative mt-40 grid w-full place-items-center">
          <div
            ref={gridRef}
            className="my-[10vh] grid aspect-[1.5] h-auto w-full grid-cols-7 grid-rows-5 gap-4 p-6"
          >
            {gsapGalleryImages.map((src, index) => (
              <figure
                key={index}
                className="grid-full-item relative z-10 overflow-hidden rounded-xl shadow-md"
                style={{ perspective: "800px", willChange: "transform" }}
              >
                <div
                  className="grid-item-img h-full w-full rounded-xl bg-cover bg-center min-h-[80px]"
                  style={{
                    backgroundImage: `url(${src})`,
                    willChange: "transform",
                  }}
                />
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const Skipper32: React.FC = () => {
  return (
    <div className="h-full w-screen">
      <WithGsap />
      <WithFramerMotion />
    </div>
  );
};

export const DemoSkipper32 = Skipper32;
export default Skipper32;
