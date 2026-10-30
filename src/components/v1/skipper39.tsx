"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
}

interface Peep {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  drawArgs: (HTMLImageElement | number)[];
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export const CrowdCanvas: React.FC<CrowdCanvasProps> = ({
  src = "/images/peeps/all-peeps.png",
  rows = 15,
  cols = 7,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    // FIX: Strongly type helper functions with generic <T> to eliminate any[]
    const randomIndex = <T,>(arr: T[]) => Math.floor(randomRange(0, arr.length));
    const removeRandom = <T,>(arr: T[]): T => arr.splice(randomIndex(arr), 1)[0];

    const createPeep = (options: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image: options.image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (c: CanvasRenderingContext2D) => {
          c.save();
          c.translate(peep.x, peep.y);
          c.scale(peep.scaleX, 1);
          c.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          );
          c.restore();
        },
      };
      peep.setRect(options.rect);
      return peep;
    };

    const img = document.createElement("img");
    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const activePeeps: Peep[] = [];

    const walkFactory = (peep: Peep, props: { startX: number; startY: number; endX: number }) => {
      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(peep, { duration: 10, x: props.endX, ease: "none" }, 0);
      tl.to(peep, { duration: 0.25, repeat: 40, yoyo: true, y: props.startY - 10 }, 0);
      return tl;
    };

    const spawnPeep = () => {
      const peep = removeRandom(availablePeeps);
      const isRightToLeft = Math.random() > 0.5;
      const heightOffset = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + heightOffset;
      let startX: number;
      let endX: number;

      if (isRightToLeft) {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      } else {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      const walkTl = walkFactory(peep, { startX, startY, endX });
      walkTl.eventCallback("onComplete", () => {
        const idx = activePeeps.indexOf(peep);
        if (idx !== -1) activePeeps.splice(idx, 1);
        availablePeeps.push(peep);
        spawnPeep();
      });

      peep.walk = walkTl;
      activePeeps.push(peep);
      activePeeps.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      activePeeps.forEach((p) => p.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      activePeeps.forEach((p) => p.walk?.kill());
      activePeeps.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      while (availablePeeps.length) {
        const spawned = spawnPeep();
        spawned.walk?.progress(Math.random());
      }
    };

    img.onload = () => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const total = rows * cols;
      const cellW = naturalWidth / rows;
      const cellH = naturalHeight / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [(i % rows) * cellW, Math.floor(i / rows) * cellH, cellW, cellH],
          })
        );
      }
      resize();
      gsap.ticker.add(render);
    };

    img.src = src;

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(render);
      activePeeps.forEach((p) => p.walk?.kill());
    };
  }, [src, rows, cols]);

  return <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" />;
};

export const Skipper39: React.FC = () => {
  return (
    <div className="relative h-full min-h-[600px] w-full bg-white text-black overflow-hidden">
      <div className="absolute top-20 left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
          Crowd Canvas
        </span>
      </div>
      <div className="absolute bottom-0 h-full w-screen">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
      </div>
    </div>
  );
};

export const DemoSkipper39 = Skipper39;
export default Skipper39;
