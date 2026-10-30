"use client";

import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { exampleGalleryImages } from "@/lib/example-images";

export const commonImages = exampleGalleryImages.slice(0, 20);

export interface PerspectiveCardProps {
  img: string;
  isLeft: boolean;
}

export const PerspectiveCard: React.FC<PerspectiveCardProps> = ({ img, isLeft }) => {
  const cardRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [70, 0, -50]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.5, 1], isLeft ? [5, 0, -1] : [-5, 0, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 0.7, 1],
    isLeft ? ["-40%", "0%", "0%", "-10%"] : ["40%", "0%", "0%", "10%"]
  );
  const skewX = useTransform(scrollYProgress, [0, 0.5, 1], isLeft ? [-5, 0, 5] : [5, 0, -5]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], ["40%", "0%", "-10%"]);
  const blurVal = useTransform(scrollYProgress, [0, 0.5, 1], [7, 0, 4]);
  const brightnessVal = useTransform(scrollYProgress, [0, 0.5, 1], [0, 100, 0]);
  const contrastVal = useTransform(scrollYProgress, [0, 0.5, 1], [180, 110, 180]);
  const scaleY = useTransform(scrollYProgress, [0, 0.5, 1], [1.8, 1, 1.1]);

  const filter = useTransform(
    [blurVal, brightnessVal, contrastVal],
    ([b, br, c]) => `blur(${b}px) brightness(${br}%) contrast(${c}%)`
  );

  return (
    <motion.figure
      ref={cardRef}
      className="relative z-10 m-0"
      style={{ perspective: "800px", willChange: "transform" }}
    >
      <motion.div
        className="relative aspect-[1/1.2] w-full overflow-hidden rounded-xl shadow-lg"
        style={{
          y,
          x,
          rotateX,
          rotateZ,
          skewX,
          filter,
          scaleY,
        }}
      >
        <div
          className="absolute inset-0 h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />
      </motion.div>
    </motion.figure>
  );
};

export const WithFramerMotion: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const imagesToRender = [...commonImages, ...commonImages.slice(0, 4)];

  return (
    <ReactLenis root>
      <div className={cn("relative w-full overflow-hidden bg-background text-foreground", className)}>
        <div ref={containerRef} className="relative w-full overflow-hidden">
          <div className="absolute left-1/2 top-20 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
            <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
              Framer motion Perspective scroll effect
            </span>
          </div>

          <section className="relative grid w-full place-items-center">
            <div
              ref={gridRef}
              className="relative mb-[10vh] mt-[20vh] grid w-full max-w-sm grid-cols-2 gap-8 py-[20vh]"
            >
              {imagesToRender.map((src, index) => (
                <PerspectiveCard key={index} img={src} isLeft={index % 2 === 0} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </ReactLenis>
  );
};

export const WithGsap: React.FC<{ className?: string }> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const timer = setTimeout(() => {
      if (!gridRef.current) return;
      const wrapElements = gridRef.current.querySelectorAll<HTMLElement>(".grid-item-imgwrap");

      wrapElements.forEach((el) => {
        const img = el.querySelector<HTMLElement>(".grid-item-img");
        const rect = el.getBoundingClientRect();
        const isLeft = rect.left + rect.width / 2 < window.innerWidth / 2;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top bottom+=10%",
              end: "bottom top-=25%",
              scrub: true,
            },
          })
          .from(el, {
            startAt: { filter: "blur(0px) brightness(100%) contrast(100%)" },
            z: 300,
            rotateX: 70,
            rotateZ: isLeft ? 5 : -5,
            xPercent: isLeft ? -40 : 40,
            skewX: isLeft ? -20 : 20,
            yPercent: 100,
            filter: "blur(7px) brightness(0%) contrast(400%)",
            ease: "sine",
          })
          .to(el, {
            z: 300,
            rotateX: -50,
            rotateZ: isLeft ? -1 : 1,
            xPercent: isLeft ? -20 : 20,
            skewX: isLeft ? 10 : -10,
            filter: "blur(4px) brightness(0%) contrast(500%)",
            ease: "sine.in",
          })
          .from(img, { scaleY: 1.8, ease: "sine" }, 0)
          .to(img, { scaleY: 1.8, ease: "sine.in" }, ">");
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const imagesToRender = [...commonImages, ...commonImages.slice(0, 4)];

  return (
    <div className={cn("relative w-full overflow-hidden bg-background text-foreground", className)}>
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div className="absolute left-1/2 top-20 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
            GSAP Perspective scroll effect
          </span>
        </div>

        <section className="relative grid w-full place-items-center">
          <div
            ref={gridRef}
            className="relative mb-[10vh] mt-[20vh] grid w-full max-w-sm grid-cols-2 gap-8 py-[20vh]"
          >
            {imagesToRender.map((src, index) => (
              <figure
                key={index}
                className="relative z-10 m-0"
                style={{ perspective: "800px", willChange: "transform" }}
              >
                <div className="grid-item-imgwrap relative aspect-[1/1.2] w-full overflow-hidden rounded-xl shadow-lg will-change-[filter]">
                  <div
                    className="grid-item-img backface-hidden absolute inset-0 h-full w-full bg-cover bg-center will-change-transform"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </div>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export const Skipper33: React.FC = () => {
  return (
    <div className="w-screen">
      <WithGsap />
      <WithFramerMotion />
    </div>
  );
};

export const DemoSkipper33 = Skipper33;
export default Skipper33;
