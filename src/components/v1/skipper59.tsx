"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface LineSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  timestamp: number;
  opacity: number;
}

export interface DrawingCursorProps {
  children?: ReactNode;
  strokeColor?: string;
  strokeWidth?: number;
  type?: "drawAlways" | "drawOnHold";
  followEffect?: boolean;
  customCursor?: boolean;
  className?: string;
}

export function DrawingCursor({
  children,
  strokeColor = "#000000",
  strokeWidth = 1,
  type = "drawAlways",
  followEffect = false,
  customCursor = false,
  className,
}: DrawingCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useState<LineSegment[]>([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useTransform(mouseX, (v) => v - 8);
  const cursorY = useTransform(mouseY, (v) => v - 8);

  const lastPos = useRef<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  });

  const isTouchDevice = useCallback(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }, []);

  const drawLines = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    lines.forEach((line) => {
      ctx.globalAlpha = line.opacity ?? 1;
      ctx.beginPath();
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }, [lines, strokeColor, strokeWidth]);

  const updateSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  useEffect(() => {
    if (!followEffect) {
      drawLines();
      return;
    }

    const animateFade = () => {
      const now = Date.now();
      setLines((prev) =>
        prev
          .map((line) => ({
            ...line,
            opacity: Math.max(0, 1 - (now - line.timestamp) / 500),
          }))
          .filter((line) => line.opacity > 0)
      );
      drawLines();
      animFrameRef.current = requestAnimationFrame(animateFade);
    };

    animFrameRef.current = requestAnimationFrame(animateFade);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [followEffect, drawLines]);

  useEffect(() => {
    if (!followEffect) drawLines();
  }, [lines, followEffect, drawLines]);

  const addLine = useCallback(
    (x1: number, y1: number, x2: number, y2: number) => {
      const newLine: LineSegment = {
        id: `line-${Date.now()}-${Math.random()}`,
        x1,
        y1,
        x2,
        y2,
        timestamp: Date.now(),
        opacity: 1,
      };
      setLines((prev) => [...prev, newLine]);
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouseX.set(currentX);
      mouseY.set(currentY);

      if (
        !(type === "drawAlways" || (type === "drawOnHold" && isMouseDown)) ||
        lastPos.current.x === null ||
        lastPos.current.y === null
      ) {
        lastPos.current = { x: currentX, y: currentY };
        return;
      }

      const prevX = lastPos.current.x;
      const prevY = lastPos.current.y;
      const dx = currentX - prevX;
      const dy = currentY - prevY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const step = Math.max(0.3 * strokeWidth, 2);

      if (dist >= 1) {
        if (dist > step) {
          const steps = Math.ceil(dist / step);
          const stepX = dx / steps;
          const stepY = dy / steps;
          let startX = prevX;
          let startY = prevY;

          for (let i = 1; i <= steps; i++) {
            const nextX = prevX + i * stepX;
            const nextY = prevY + i * stepY;
            addLine(startX, startY, nextX, nextY);
            startX = nextX;
            startY = nextY;
          }
        } else {
          addLine(prevX, prevY, currentX, currentY);
        }
        lastPos.current = { x: currentX, y: currentY };
      }
    },
    [type, isMouseDown, strokeWidth, addLine, mouseX, mouseY]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (type === "drawOnHold" && e.button === 0) {
        setIsMouseDown(true);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          lastPos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          };
        }
        e.preventDefault();
      }
    },
    [type]
  );

  const handleMouseUp = useCallback(() => {
    if (type === "drawOnHold") setIsMouseDown(false);
  }, [type]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        lastPos.current = { x, y };
        mouseX.set(x);
        mouseY.set(y);
      }
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    lastPos.current = { x: null, y: null };
    if (type === "drawOnHold") setIsMouseDown(false);
    setLines([]);
  }, [type]);

  if (isTouchDevice()) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-stretch justify-between p-8">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <motion.div
        ref={containerRef}
        className="relative h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10" />
        {customCursor && (
          <motion.div
            className="pointer-events-none absolute z-30"
            style={{ x: cursorX, y: cursorY }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isMouseDown ? 1.2 : 1,
              backgroundColor: isMouseDown ? strokeColor : "transparent",
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div
              className="h-4 w-4 rounded-full border-2 border-current"
              style={{
                borderColor: strokeColor,
                backgroundColor: isMouseDown ? strokeColor : "transparent",
              }}
            />
          </motion.div>
        )}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-stretch justify-between p-8">
        {children}
      </div>
    </div>
  );
}

export function Skipper59() {
  return (
    <div className="relative h-full min-h-screen w-full bg-[#FC0F49]">
      <div className="absolute left-1/2 top-[40%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-white">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-white after:content-['']">
          Move the cursor to see the effect
        </span>
      </div>
      <DrawingCursor
        type="drawAlways"
        strokeColor="#fff"
        strokeWidth={2}
        followEffect={true}
        className="h-full min-h-screen w-full"
      />
    </div>
  );
}

export { Skipper59 as DemoSkipper59 };
export default Skipper59;
