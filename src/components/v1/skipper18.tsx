"use client";

import React, { useRef, createRef, ReactNode, TouchEvent, MouseEvent } from "react";
import { cn } from "@/lib/utils";

export interface ImageCursorTrailProps {
  items: string[];
  children?: ReactNode;
  className?: string;
  maxNumberOfImages?: number;
  imgClass?: string;
  distance?: number;
  fadeAnimation?: boolean;
}

export const defaultTrailItems = [
  "/skipperv1/skipper18/mouse1.svg",
  "/skipperv1/skipper18/mouse2.svg",
  "/skipperv1/skipper18/mouse3.svg",
  "/skipperv1/skipper18/mouse4.svg",
  "/skipperv1/skipper18/mouse5.svg",
  "/skipperv1/skipper18/mouse6.svg",
  "/skipperv1/skipper18/mouse7.svg",
  "/skipperv1/skipper18/mouse8.svg",
  "/skipperv1/skipper18/mouse9.svg",
  "/skipperv1/skipper18/mouse10.svg",
  "/skipperv1/skipper18/mouse11.svg",
  "/skipperv1/skipper18/mouse12.svg",
];

export function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageCursorTrailProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<React.RefObject<HTMLImageElement | null>[]>(
    items.map(() => createRef<HTMLImageElement | null>())
  );
  const zIndexRef = useRef(1);
  const countRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const handlePointer = (clientX: number, clientY: number) => {
    if (
      Math.hypot(clientX - lastPosRef.current.x, clientY - lastPosRef.current.y) >
      window.innerWidth / distance
    ) {
      const activeIdx = countRef.current % imageRefs.current.length;
      const inactiveIdx =
        (countRef.current - maxNumberOfImages + imageRefs.current.length) %
        imageRefs.current.length;

      const activeEl = imageRefs.current[activeIdx]?.current;
      const inactiveEl = imageRefs.current[inactiveIdx]?.current;

      if (activeEl && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        activeEl.style.left = `${offsetX}px`;
        activeEl.style.top = `${offsetY}px`;

        if (zIndexRef.current > 40) {
          zIndexRef.current = 1;
        }
        activeEl.style.zIndex = String(zIndexRef.current);
        zIndexRef.current++;

        activeEl.dataset.status = "active";

        if (fadeAnimation) {
          setTimeout(() => {
            activeEl.dataset.status = "inactive";
          }, 1500);
        }

        lastPosRef.current = { x: clientX, y: clientY };
      }

      if (inactiveEl) {
        inactiveEl.dataset.status = "inactive";
      }

      countRef.current++;
    }
  };

  return (
    <section
      onMouseMove={(e: MouseEvent<HTMLElement>) => handlePointer(e.clientX, e.clientY)}
      onTouchMove={(e: TouchEvent<HTMLElement>) => {
        if (e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onMouseLeave={() => {
        imageRefs.current.forEach((ref) => {
          if (ref.current) ref.current.dataset.status = "inactive";
        });
      }}
      ref={containerRef}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg",
        className
      )}
    >
      {items.map((src, index) => (
        <img
          key={index}
          ref={imageRefs.current[index]}
          data-index={index}
          data-status="inactive"
          src={src}
          alt={`image-${index}`}
          className={cn(
            "pointer-events-none absolute -translate-x-[50%] -translate-y-[50%] scale-0 rounded-3xl object-cover opacity-0 transition-transform duration-300 data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass
          )}
        />
      ))}
      {children}
    </section>
  );
}

export const Skipper18: React.FC = () => {
  return (
    <section className="relative mx-auto flex h-full w-full items-center justify-center bg-white">
      <p className="absolute top-4 z-50 text-xs text-black/40">
        Inspired from the best{" "}
        <a
          href="https://www.befreaky.co/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-black"
        >
          BeFreaky
        </a>{" "}
        by David Denni. Go check them out.
      </p>
      <div className="absolute top-[10%] grid content-start justify-items-center gap-6 py-20 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
          Move your mouse to see the trail
        </span>
      </div>
      <ImageCursorTrail
        items={defaultTrailItems}
        maxNumberOfImages={5}
        distance={15}
        imgClass="w-50"
        className="h-full w-full"
      />
    </section>
  );
};

export const DemoSkipper18 = Skipper18;
export default Skipper18;
