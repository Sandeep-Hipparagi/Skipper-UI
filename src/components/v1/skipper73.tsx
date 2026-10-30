"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { cn } from "@/lib/utils";
import { exampleGalleryImages } from "@/lib/example-images";

export interface InfiniteCanvasProps {
  imageClassName?: string;
  numberOfImages?: number;
  imageRootPath?: string;
  imageSources?: string[];
  gap?: string;
  className?: string;
}

export function InfiniteCanvas({
  imageClassName = "w-[25vw] lg:w-[15vw]",
  numberOfImages = 15,
  imageRootPath = "/images/lummi",
  imageSources,
  gap = "10vw",
  className,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    gsap.registerPlugin(Observer);

    const el = containerRef.current;
    const halfWidth = el.clientWidth / 2;
    const wrapX = gsap.utils.wrap(-halfWidth, 0);
    const quickX = gsap.quickTo(el, "x", {
      duration: 1.5,
      ease: "power4",
      modifiers: { x: gsap.utils.unitize(wrapX) },
    });

    const halfHeight = el.clientHeight / 2;
    const wrapY = gsap.utils.wrap(-halfHeight, 0);
    const quickY = gsap.quickTo(el, "y", {
      duration: 1.5,
      ease: "power4",
      modifiers: { y: gsap.utils.unitize(wrapY) },
    });

    let currentX = 0;
    let currentY = 0;

    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onChangeX: (self) => {
        if (self.event.type === "wheel") {
          currentX -= self.deltaX;
        } else {
          currentX += 2 * self.deltaX;
        }
        quickX(currentX);
      },
      onChangeY: (self) => {
        if (self.event.type === "wheel") {
          currentY -= self.deltaY;
        } else {
          currentY += 2 * self.deltaY;
        }
        quickY(currentY);
      },
    });

    return () => {
      obs.kill();
    };
  }, []);

  const imageFiles = Array.from({ length: numberOfImages }, (_, i) => imageSources?.[i] ?? `${imageRootPath}/img${i + 1}.png`);

  const renderGridBlock = (isAriaHidden = false) => (
    <div
      className={cn("pointer-events-none grid w-max grid-cols-5 p-[5vw]")}
      style={{ gap }}
      aria-hidden={isAriaHidden}
    >
      {imageFiles.map((file, idx) => (
        <div
          key={`${isAriaHidden ? "dup" : "orig"}-${idx}`}
          className={cn("aspect-square select-none", imageClassName)}
        >
          <img
            src={file}
            alt=""
            className="block h-full w-full object-contain"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className={cn("pointer-events-none h-screen w-full overflow-hidden", className)}>
      <div
        ref={containerRef}
        className="grid w-max grid-cols-2 will-change-transform"
      >
        {renderGridBlock(false)}
        {renderGridBlock(true)}
        {renderGridBlock(true)}
        {renderGridBlock(true)}
      </div>
    </section>
  );
}

export function Skipper73() {
  return (
    <div className="h-full min-h-screen w-full bg-[#f5f4f3]">
      <InfiniteCanvas
        imageClassName="w-[45vw] lg:w-[15vw]"
        numberOfImages={15}
        imageSources={exampleGalleryImages.slice(0, 15)}
        gap="5vw"
      />
    </div>
  );
}

export { Skipper73 as DemoSkipper73 };
export default Skipper73;
