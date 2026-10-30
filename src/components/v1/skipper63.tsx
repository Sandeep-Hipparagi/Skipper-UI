"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { GripVertical, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SquiCircleFilterProps {
  blurValue?: number;
  colorMatrixValue?: number;
  alphaValue?: number;
}

export function SquiCircleFilterStatic() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 pointer-events-none"
      version="1.1"
    >
      <defs>
        <filter id="SkipperSquiCircleFilterLayout">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

function DynamicSquiCircleFilter({
  blurValue = 10,
  colorMatrixValue = 20,
  alphaValue = -7,
}: SquiCircleFilterProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-0 left-0 pointer-events-none"
      version="1.1"
    >
      <defs>
        <filter id="SquiCircleFilter">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurValue} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${colorMatrixValue} ${alphaValue}`}
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

interface ControlsProps {
  toggle: boolean;
  setToggle: (v: boolean) => void;
  height: number;
  setHeight: (v: number) => void;
  width: number;
  setWidth: (v: number) => void;
  blurValue: number;
  setBlurValue: (v: number) => void;
  colorMatrixValue: number;
  setColorMatrixValue: (v: number) => void;
  alphaValue: number;
  setAlphaValue: (v: number) => void;
}

function Controls({
  toggle,
  setToggle,
  height,
  setHeight,
  width,
  setWidth,
  blurValue,
  setBlurValue,
  colorMatrixValue,
  setColorMatrixValue,
  alphaValue,
  setAlphaValue,
}: ControlsProps) {
  const [canDrag, setCanDrag] = useState(false);

  return (
    <motion.div
      className="absolute top-24 right-1/2 z-20 flex w-[300px] translate-x-1/2 flex-col gap-3 rounded-3xl border border-black/10 bg-white/90 p-4 shadow-xl backdrop-blur-md lg:right-4 lg:translate-x-0"
      drag={canDrag}
      dragMomentum={false}
    >
      <div className="flex items-center justify-between border-b border-black/5 pb-2">
        <span
          onPointerDown={() => setCanDrag(true)}
          onPointerUp={() => setCanDrag(false)}
          className="size-4 cursor-grab active:cursor-grabbing text-black/50"
        >
          <GripVertical className="size-4 opacity-50" />
        </span>
        <button
          onClick={() => {
            setToggle(true);
            setHeight(200);
            setWidth(300);
            setBlurValue(10);
            setColorMatrixValue(20);
            setAlphaValue(-7);
          }}
          className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-2 py-1 text-sm text-black/50 hover:bg-black/5 hover:text-black"
        >
          Reset
          <RotateCcw className="size-3.5 transition-transform duration-300 group-hover:rotate-180" />
        </button>
      </div>

      <div className="flex w-full flex-col gap-3 text-xs">
        <div className="grid grid-cols-3 items-center gap-2 py-1">
          <p className="text-black/60 font-medium">Filter :</p>
          <button
            onClick={() => setToggle(true)}
            className={cn(
              "flex items-center justify-center rounded-lg py-1 font-semibold transition-colors",
              toggle ? "bg-black text-white" : "bg-black/5 text-black/40"
            )}
          >
            ON
          </button>
          <button
            onClick={() => setToggle(false)}
            className={cn(
              "flex items-center justify-center rounded-lg py-1 font-semibold transition-colors",
              !toggle ? "bg-black text-white" : "bg-black/5 text-black/40"
            )}
          >
            OFF
          </button>
        </div>

        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-black/60 font-medium">Height :</p>
          <div className="flex w-full items-center justify-between gap-2 col-span-2">
            <input
              type="range"
              min={50}
              max={500}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="h-1.5 w-[140px] cursor-pointer appearance-none rounded-lg bg-black/10"
            />
            <span className="w-10 text-right text-black/50">{height}px</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-black/60 font-medium">Width :</p>
          <div className="flex w-full items-center justify-between gap-2 col-span-2">
            <input
              type="range"
              min={100}
              max={600}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="h-1.5 w-[140px] cursor-pointer appearance-none rounded-lg bg-black/10"
            />
            <span className="w-10 text-right text-black/50">{width}px</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-black/60 font-medium">Blur :</p>
          <div className="flex w-full items-center justify-between gap-2 col-span-2">
            <input
              type="range"
              min={0}
              max={50}
              value={blurValue}
              onChange={(e) => setBlurValue(Number(e.target.value))}
              className="h-1.5 w-[140px] cursor-pointer appearance-none rounded-lg bg-black/10"
            />
            <span className="w-10 text-right text-black/50">{blurValue}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-black/60 font-medium">Matrix :</p>
          <div className="flex w-full items-center justify-between gap-2 col-span-2">
            <input
              type="range"
              min={1}
              max={50}
              value={colorMatrixValue}
              onChange={(e) => setColorMatrixValue(Number(e.target.value))}
              className="h-1.5 w-[140px] cursor-pointer appearance-none rounded-lg bg-black/10"
            />
            <span className="w-10 text-right text-black/50">{colorMatrixValue}</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 items-center py-1">
          <p className="text-black/60 font-medium">Alpha :</p>
          <div className="flex w-full items-center justify-between gap-2 col-span-2">
            <input
              type="range"
              min={-20}
              max={0}
              value={alphaValue}
              onChange={(e) => setAlphaValue(Number(e.target.value))}
              className="h-1.5 w-[140px] cursor-pointer appearance-none rounded-lg bg-black/10"
            />
            <span className="w-10 text-right text-black/50">{alphaValue}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Skipper63() {
  const [toggle, setToggle] = useState(true);
  const [height, setHeight] = useState(200);
  const [width, setWidth] = useState(300);
  const [blurValue, setBlurValue] = useState(10);
  const [colorMatrixValue, setColorMatrixValue] = useState(20);
  const [alphaValue, setAlphaValue] = useState(-7);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col items-center justify-center bg-[#f5f4f3] p-8 text-black">
      <div className="mb-20 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          squicircle with svg filter
        </span>
      </div>

      <DynamicSquiCircleFilter
        blurValue={blurValue}
        colorMatrixValue={colorMatrixValue}
        alphaValue={alphaValue}
      />

      <Controls
        toggle={toggle}
        setToggle={setToggle}
        height={height}
        setHeight={setHeight}
        width={width}
        setWidth={setWidth}
        blurValue={blurValue}
        setBlurValue={setBlurValue}
        colorMatrixValue={colorMatrixValue}
        setColorMatrixValue={setColorMatrixValue}
        alphaValue={alphaValue}
        setAlphaValue={setAlphaValue}
      />

      <div
        className="rounded-2xl bg-black transition-all"
        style={{
          height: `${height}px`,
          width: `${width}px`,
          filter: toggle ? "url(#SquiCircleFilter)" : "none",
        }}
      />
    </div>
  );
}

export { Skipper63 as DemoSkipper63 };
export default Skipper63;
