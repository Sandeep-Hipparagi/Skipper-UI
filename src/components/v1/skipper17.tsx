"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ReactLenis } from "lenis/react";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: number | string;
  image: string;
  alt?: string;
}

export interface StickyCard002Props {
  cards: CardItem[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export const defaultCards: CardItem[] = [
  { id: 1, image: "/examples/photo-023.jpg" },
  { id: 2, image: "/examples/photo-024.jpg" },
  { id: 3, image: "/examples/photo-038.jpg" },
  { id: 4, image: "/examples/photo-030.jpg" },
  { id: 5, image: "/examples/photo-036.jpg" },
];

export const StickyCard002: React.FC<StickyCard002Props> = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const cardElements = cardRefs.current;
      const count = cardElements.length;
      if (!cardElements[0]) return;

      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < count; i++) {
        if (cardElements[i]) {
          gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (count - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < count - 1; i++) {
        const current = cardElements[i];
        const next = cardElements[i + 1];
        if (current && next) {
          tl.to(current, { scale: 0.7, rotation: 5, duration: 1, ease: "none" }, i);
          tl.to(next, { y: "0%", duration: 1, ease: "none" }, i);
        }
      }

      const observer = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
        tl.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <div className={cn("relative h-full w-full", className)} ref={containerRef}>
      <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div
          className={cn(
            "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
            containerClassName
          )}
        >
          {cards.map((card, index) => (
            <img
              key={card.id}
              src={card.image}
              alt={card.alt || ""}
              className={cn("rounded-4xl absolute h-full w-full object-cover", imageClassName)}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Skipper17: React.FC = () => {
  return (
    <ReactLenis root>
      <div className="h-full w-full">
        <StickyCard002 cards={defaultCards} />
      </div>
    </ReactLenis>
  );
};

export const DemoSkipper17 = Skipper17;
export default Skipper17;
