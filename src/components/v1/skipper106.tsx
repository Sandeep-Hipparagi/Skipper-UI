"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const WRAPPER_CLS =
  "bg-muted/50 has-[:focus-visible]:outline-ring relative w-full max-w-[420px] rounded-2xl p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 border shadow-sm";
const INPUT_CLS = "w-full bg-transparent outline-none placeholder:text-foreground/40";

export function Input({
  className,
  wrapperClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { wrapperClassName?: string }) {
  return (
    <div className={cn(WRAPPER_CLS, wrapperClassName)}>
      <input className={cn(INPUT_CLS, className)} {...props} />
    </div>
  );
}

export function SmoothInput({
  className,
  wrapperClassName,
  value: controlledValue,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  placeholder = "smooth input",
  style,
  fontSize = 24,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  wrapperClassName?: string;
  fontSize?: number;
}) {
  const isControlled = controlledValue !== undefined;
  const [localVal, setLocalVal] = useState(defaultValue ?? "");
  const val = isControlled ? String(controlledValue ?? "") : String(localVal);

  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const springX = useSpring(caretX, { stiffness: 500, damping: 30, mass: 0.5 });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureSpanRef = useRef<HTMLSpanElement>(null);

  const updateCaret = useCallback(
    (input: HTMLInputElement) => {
      const span = measureSpanRef.current;
      if (!span) return;

      const selStart = input.selectionStart ?? 0;
      const selEnd = input.selectionEnd ?? 0;
      const caretIdx =
        selStart === selEnd || input.selectionDirection === "backward"
          ? selStart
          : selEnd;

      const style = window.getComputedStyle(input);
      span.style.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      span.style.letterSpacing = style.letterSpacing;
      span.style.fontFeatureSettings = style.fontFeatureSettings;
      span.style.fontVariationSettings = style.fontVariationSettings;

      const textBefore =
        input.type === "password"
          ? "•".repeat(caretIdx)
          : input.value.slice(0, caretIdx);

      span.textContent = textBefore;
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const measuredOffset =
        textBefore.length > 0 ? span.offsetWidth + paddingLeft : paddingLeft;

      const paddingRight = parseFloat(style.paddingRight) || 0;
      const visibleLeft = input.scrollLeft + paddingLeft;
      const visibleRight = input.scrollLeft + input.clientWidth - paddingRight;

      if (measuredOffset > visibleRight) {
        input.scrollLeft = Math.min(
          measuredOffset - input.clientWidth + paddingRight,
          Math.max(0, input.scrollWidth - input.clientWidth)
        );
      } else if (measuredOffset < visibleLeft) {
        input.scrollLeft = Math.max(0, measuredOffset - paddingLeft);
      }

      const relX = measuredOffset - input.scrollLeft;
      const maxX = input.clientWidth - paddingRight;
      caretX.set(Math.min(relX, maxX));

      if (relX >= paddingLeft - 2 && relX <= maxX + 2 && selStart === selEnd) {
        caretOpacity.set(1);
      } else {
        caretOpacity.set(0);
      }
    },
    [caretX, caretOpacity]
  );

  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement === input) {
      updateCaret(input);
    }
  }, [val, fontSize, updateCaret]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    let rafId: number | null = null;
    const onSelection = () => {
      if (document.activeElement === input) {
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => updateCaret(input));
      }
    };

    document.addEventListener("selectionchange", onSelection);
    input.addEventListener("scroll", onSelection);

    return () => {
      // FIX: Clean up scheduled requestAnimationFrame handle and event listeners on unmount
      if (rafId !== null) cancelAnimationFrame(rafId);
      document.removeEventListener("selectionchange", onSelection);
      input.removeEventListener("scroll", onSelection);
    };
  }, [updateCaret]);

  return (
    <div className={cn(WRAPPER_CLS, wrapperClassName)}>
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 p-0"
        style={{ caretColor: "transparent", fontSize }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={val}
          onChange={(e) => {
            if (!isControlled) setLocalVal(e.target.value);
            onChange?.(e);
            requestAnimationFrame(() => updateCaret(e.target));
          }}
          onFocus={(e) => updateCaret(e.target)}
          onBlur={(e) => {
            caretOpacity.set(0);
            onBlur?.(e);
          }}
          className={cn(INPUT_CLS, "col-start-1 col-end-2 row-start-1 row-end-2 text-inherit font-medium", className)}
          style={style}
        />
        <span
          ref={measureSpanRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre"
        />
        <motion.div
          className="bg-primary pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-[0.9em] w-0.5 self-center rounded-full"
          style={{ x: springX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
}

export function Skipper106() {
  return (
    <div className="bg-muted text-foreground flex min-h-screen w-full flex-col items-center justify-center p-6">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:bg-linear-to-b after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:from-transparent after:content-['']">
          Try typing below
        </span>
      </div>

      <div className="flex w-full flex-col items-center space-y-4">
        <SmoothInput aria-label="Smooth caret input" placeholder="Smooth Caret..." />
        <Input
          placeholder="Normal input..."
          className="caret-primary text-xl"
          wrapperClassName="max-w-[420px] p-4"
          aria-label="Normal input"
        />
      </div>
    </div>
  );
}

export function DemoSkipper106() {
  return <Skipper106 />;
}

export default Skipper106;
