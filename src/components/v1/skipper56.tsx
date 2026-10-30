"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PixelParticle {
  x: number;
  y: number;
  r: number;
  color: string;
}

export interface VanishFormProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function VanishForm({
  placeholder = "user@example.com",
  onChange,
  onSubmit,
}: VanishFormProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<PixelParticle[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // FIX: Track requestAnimationFrame handle to prevent memory leaks on unmount
  const rafRef = useRef<number | null>(null);
  const [value, setValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);

    const computedStyle = getComputedStyle(inputRef.current);
    const fontSize = parseFloat(computedStyle.getPropertyValue("font-size"));
    ctx.font = `${2 * fontSize}px ${computedStyle.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.letterSpacing = "-0.05em";

    const metrics = ctx.measureText("A");
    const baseline = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    ctx.fillText(value, 0, baseline + 10);

    const imgData = ctx.getImageData(0, 0, 800, 800).data;
    const pixels: { x: number; y: number; color: number[] }[] = [];

    for (let y = 0; y < 800; y++) {
      const rowOffset = y * 4 * 800;
      for (let x = 0; x < 800; x++) {
        const offset = rowOffset + 4 * x;
        if (
          imgData[offset] !== 0 &&
          imgData[offset + 1] !== 0 &&
          imgData[offset + 2] !== 0
        ) {
          pixels.push({
            x,
            y,
            color: [
              imgData[offset],
              imgData[offset + 1],
              imgData[offset + 2],
              imgData[offset + 3],
            ],
          });
        }
      }
    }

    particlesRef.current = pixels.map((p) => ({
      x: p.x,
      y: p.y,
      r: 1,
      color: `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.color[3]})`,
    }));
  }, [value]);

  useEffect(() => {
    draw();
  }, [value, draw]);

  // FIX: Cancel any pending requestAnimationFrame upon unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const vanish = () => {
    setAnimating(true);
    draw();
    if (!inputRef.current || !inputRef.current.value) return;

    const maxX = particlesRef.current.reduce(
      (max, p) => (p.x > max ? p.x : max),
      0
    );

    const animateWave = (startX: number = 0) => {
      rafRef.current = requestAnimationFrame(() => {
        const remaining: PixelParticle[] = [];
        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          if (p.x < startX) {
            remaining.push(p);
          } else {
            if (p.r <= 0) {
              p.r = 0;
              continue;
            }
            p.x += Math.random() > 0.5 ? 1 : -1;
            p.y += Math.random() > 0.5 ? 1 : -1;
            p.r -= 0.05 * Math.random();
            remaining.push(p);
          }
        }

        particlesRef.current = remaining;
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          ctx.clearRect(startX, 0, 800, 800);
          particlesRef.current.forEach((p) => {
            if (p.x > startX) {
              ctx.beginPath();
              ctx.rect(p.x, p.y, p.r, p.r);
              ctx.fillStyle = p.color;
              ctx.strokeStyle = p.color;
              ctx.stroke();
            }
          });
        }

        if (particlesRef.current.length > 0) {
          animateWave(startX - 8);
        } else {
          setValue("");
          setAnimating(false);
        }
      });
    };

    animateWave(maxX);
  };

  return (
    <form
      className="relative mx-auto w-full text-4xl tracking-[-0.05em] text-black lg:!text-6xl"
      onSubmit={(e) => {
        e.preventDefault();
        vanish();
        onSubmit?.(e);
      }}
    >
      <canvas
        className={cn(
          "pointer-events-none absolute top-[10%] origin-top-left scale-50 transform pr-20 text-base invert filter lg:top-[12%]",
          animating ? "opacity-100" : "opacity-0"
        )}
        ref={canvasRef}
      />
      <label className="flex items-center pr-2">
        <input
          onChange={(e) => {
            if (!animating) {
              setValue(e.target.value);
              onChange?.(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !animating) {
              vanish();
            }
          }}
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          className={cn(
            "relative z-50 h-full w-full border-none bg-transparent pr-4 text-black focus:outline-none focus:ring-0",
            animating && "text-transparent dark:text-transparent"
          )}
        />
        <button
          type="submit"
          className="rounded-6 flex h-full cursor-pointer items-center justify-center whitespace-nowrap pr-4"
        >
          {value ? (
            <p className="pt-2 text-base tracking-tight opacity-50">
              [&nbsp;enter ↵&nbsp;]
            </p>
          ) : (
            "→"
          )}
        </button>
      </label>
    </form>
  );
}

export function Skipper56() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 bg-[#f5f4f3]">
      <div className="flex h-14 w-full items-center justify-end lg:h-22">
        <div className="ml-10 h-full w-full border-b border-black/10 lg:w-[50vw]">
          <VanishForm
            placeholder="user@example.com"
            onChange={() => {}}
            onSubmit={(e) => {
              e.preventDefault();
              console.log("submitted");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export { Skipper56 as DemoSkipper56 };
export default Skipper56;
