"use client";

import React, { useRef, useLayoutEffect, Children, isValidElement } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export function useMouse(ref?: React.RefObject<Element | null>) {
  const x = useSpring(0);
  const y = useSpring(0);
  const elementX = useSpring(0);
  const elementY = useSpring(0);
  const elementPositionX = useSpring(0);
  const elementPositionY = useSpring(0);
  const opacity = useSpring(0);
  const localRef = useRef<HTMLDivElement>(null);

  const elementLeft = useTransform(elementX, (val) => `${val}px`);
  const elementTop = useTransform(elementY, (val) => `${val}px`);

  useLayoutEffect(() => {
    const getEl = () => (ref?.current instanceof Element ? ref.current : localRef.current);

    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.pageX);
      y.set(e.pageY);
      const el = getEl();
      if (!el) {
        opacity.set(0);
        return;
      }
      const rect = el.getBoundingClientRect();
      const docX = rect.left + window.scrollX;
      const docY = rect.top + window.scrollY;
      const relX = e.pageX - docX;
      const relY = e.pageY - docY;

      elementX.set(relX);
      elementY.set(relY);
      elementPositionX.set(docX);
      elementPositionY.set(docY);
      opacity.set(1);
    };

    const handleMouseLeave = () => {
      opacity.set(0);
    };

    document.addEventListener("mousemove", handleMouseMove);
    const targetEl = getEl();
    targetEl?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      targetEl?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, elementX, elementPositionX, elementPositionY, elementY, opacity, localRef, x, y]);

  return [
    {
      x,
      y,
      elementX,
      elementY,
      elementPositionX,
      elementPositionY,
      elementLeft,
      elementTop,
      opacity,
    },
    localRef,
  ] as const;
}

export function GradientCardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base text-neutral-800 dark:text-neutral-300 font-medium", className)}>
      {children}
    </h3>
  );
}

export function GradientCardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("h-full w-full", className)}>{children}</div>;
}

export function GradientCard({
  circleSize = 400,
  className,
  children,
}: {
  circleSize?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [mouse, ref] = useMouse();
  let titleNode: React.ReactNode = null;
  let contentNode: React.ReactNode = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === GradientCardTitle) titleNode = child;
      else if (child.type === GradientCardContent) contentNode = child;
    }
  });

  return (
    <div
      className="group relative transform-gpu overflow-hidden rounded-[20px] bg-white/10 p-1 transition-transform hover:scale-[1.01] active:scale-95 border border-border/50"
      ref={ref}
    >
      <motion.div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 transform-gpu rounded-full transition-transform duration-500 group-hover:scale-[3] pointer-events-none",
          "bg-[linear-gradient(135deg,#3BC4F2,#7A69F9,#F26378,#F5833F)] dark:bg-[linear-gradient(135deg,#ffffff,#333333,#666666,#ffffff)] dark:saturate-0"
        )}
        style={{
          maskImage: `radial-gradient(${circleSize / 2}px circle at center, white, transparent)`,
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          left: mouse.elementLeft,
          top: mouse.elementTop,
          opacity: mouse.opacity,
        }}
      />
      <div className="bg-background/80 absolute inset-px rounded-[19px] -z-10" />
      {contentNode && (
        <div className={cn("relative grid place-content-center overflow-hidden rounded-[15px] bg-background", className)}>
          {contentNode}
        </div>
      )}
      {titleNode && <div className="relative px-3 py-2">{titleNode}</div>}
    </div>
  );
}

export function Skipper90() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          hover the card to see the gradient
        </span>
      </div>

      <div className="relative grid max-w-4xl grid-cols-1 gap-4 p-2 md:grid-cols-2 w-full">
        <GradientCard className="p-1 aspect-video">
          <GradientCardContent>
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
              <img
                src="/images/templates/bg1.svg"
                alt=""
                className="h-full w-full rounded-2xl object-cover dark:invert"
              />
              <img
                src="/images/templates/Aa0.svg"
                alt=""
                className="group-hover:scale-110 pointer-events-none absolute h-[55%] w-fit object-contain transition-transform duration-300 ease-out dark:invert"
              />
            </div>
          </GradientCardContent>
          <GradientCardTitle>November 005</GradientCardTitle>
        </GradientCard>

        <GradientCard className="p-1 aspect-video">
          <GradientCardContent>
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl">
              <img
                src="/images/templates/bg2.svg"
                alt=""
                className="h-full w-full rounded-2xl object-cover dark:invert"
              />
              <img
                src="/images/templates/Aa2.svg"
                alt=""
                className="group-hover:scale-110 pointer-events-none absolute h-[55%] w-fit object-contain invert transition-transform duration-300 ease-out dark:invert-0"
              />
            </div>
          </GradientCardContent>
          <GradientCardTitle>November 005</GradientCardTitle>
        </GradientCard>
      </div>
    </div>
  );
}

export function DemoSkipper90() {
  return <Skipper90 />;
}

export default Skipper90;
