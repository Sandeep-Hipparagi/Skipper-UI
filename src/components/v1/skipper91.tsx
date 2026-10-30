"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from "framer-motion";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const sec = Math.floor(seconds);
  const min = Math.floor(sec / 60);
  return `${min.toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;
}

export function Skipper91() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTime = useMotionValue(0);
  const duration = useMotionValue(0);
  const hoverOpacity = useMotionValue(0);
  const wasPlayingRef = useRef(false);
  const isScrubbingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      duration.set(video.duration || 0);
      currentTime.set(video.currentTime || 0);
    };

    const onEnded = () => {
      currentTime.set(video.duration || 0);
    };

    let rafId: number | null = null;
    const loop = () => {
      if (!isScrubbingRef.current && !video.paused) {
        currentTime.set(video.currentTime);
      }
      rafId = requestAnimationFrame(loop);
    };

    const onPlay = () => {
      if (rafId === null) rafId = requestAnimationFrame(loop);
    };

    const onPause = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (!isScrubbingRef.current) currentTime.set(video.currentTime);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("ended", onEnded);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    if (video.readyState >= 1) onLoadedMetadata();
    if (!video.paused) rafId = requestAnimationFrame(loop);

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [currentTime, duration]);

  const handlePlay = useCallback(async () => {
    const video = videoRef.current;
    if (video) {
      if (video.currentTime >= video.duration) video.currentTime = 0;
      try {
        await video.play();
      } catch (err) {
        console.error("Failed to play video", err);
      }
    }
  }, []);

  const handlePause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const handleToggle = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) handlePlay();
      else handlePause();
    }
  }, [handlePause, handlePlay]);

  const overlayOpacity = useTransform(hoverOpacity, [0, 1], [0, 1]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="bg-background py-10 flex w-full max-w-3xl flex-col items-center justify-center gap-10 rounded-[50px] border shadow-2xl relative">
        <motion.div
          onMouseEnter={() => hoverOpacity.set(1)}
          onMouseLeave={() => hoverOpacity.set(0)}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="aspect-[1180/2556] rounded-4xl relative z-20 max-h-[500px] origin-top overflow-hidden shadow-xl"
        >
          <video
            ref={videoRef}
            autoPlay
            className="h-full w-full object-cover"
            src="/videos/random/iphone.mp4"
            playsInline
            preload="metadata"
            muted
          />

          <PlayOverlay opacity={overlayOpacity} onToggle={handleToggle} videoRef={videoRef} />
        </motion.div>

        <div className="flex w-full max-w-md flex-col gap-3 px-6">
          <Scrubber
            currentTime={currentTime}
            duration={duration}
            onScrubStart={() => {
              const video = videoRef.current;
              if (video) {
                isScrubbingRef.current = true;
                wasPlayingRef.current = !video.paused;
                video.pause();
              }
            }}
            onChange={(val) => {
              const video = videoRef.current;
              if (!video) return;
              const clamped = Math.min(Math.max(val, 0), duration.get() || 0);
              video.currentTime = clamped;
              currentTime.set(clamped);
            }}
            onScrubEnd={() => {
              isScrubbingRef.current = false;
              if (wasPlayingRef.current) handlePlay();
            }}
          />
        </div>

        <p className="text-muted-foreground absolute top-5 text-xs">
          Inspired by{" "}
          <a
            href="https://www.spottedinprod.com/blog/any-distance-goes-open-source"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground underline"
          >
            Spotted in Prod
          </a>
        </p>
      </div>
    </div>
  );
}

function PlayOverlay({
  opacity,
  onToggle,
  videoRef,
}: {
  // FIX: Strongly type opacity as MotionValue<number> | number
  opacity: MotionValue<number> | number;
  onToggle: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => setIsPlaying(!video.paused);
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    update();
    return () => {
      video.removeEventListener("play", update);
      video.removeEventListener("pause", update);
    };
  }, [videoRef]);

  return (
    <motion.button
      type="button"
      style={{ opacity }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      onClick={onToggle}
      className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30"
    >
      <div className="relative flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
        <motion.span
          animate={{ scale: isPlaying ? 1 : 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
          className="absolute flex size-full items-center justify-center"
        >
          <Pause className="size-6 fill-white stroke-0 text-white" />
        </motion.span>
        <motion.span
          animate={{ scale: !isPlaying ? 1 : 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
          className="absolute flex size-full items-center justify-center"
        >
          <Play className="size-6 fill-white stroke-0 text-white ml-0.5" />
        </motion.span>
      </div>
    </motion.button>
  );
}

function Scrubber({
  currentTime,
  duration,
  onChange,
  onScrubStart,
  onScrubEnd,
}: {
  // FIX: Strongly type currentTime and duration as MotionValue<number>
  currentTime: MotionValue<number>;
  duration: MotionValue<number>;
  onChange: (val: number) => void;
  onScrubStart: () => void;
  onScrubEnd: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [currFormatted, setCurrFormatted] = useState("0:00");
  const [durFormatted, setDurFormatted] = useState("0:00");
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverTime = useMotionValue(0);

  useMotionValueEvent(currentTime, "change", (v) => setCurrFormatted(formatTime(Number(v))));
  useMotionValueEvent(duration, "change", (v) => setDurFormatted(formatTime(Number(v))));

  const direction = useMotionValue(0);
  const clientX = useMotionValue(0);
  const indicatorX = useMotionValue(0);
  const stretchAmount = useMotionValue(0);
  const scale = useMotionValue(0.8);
  const indicatorOpacity = useMotionValue(0);

  useMotionValueEvent(clientX, "change", (cx) => {
    if (!trackRef.current) return;
    const { left, right } = trackRef.current.getBoundingClientRect();
    let d = 0;
    let dist = 0;
    if (cx < left) {
      direction.set(-1);
      d = -1;
      dist = left - cx;
    } else if (cx > right) {
      direction.set(1);
      d = 1;
      dist = cx - right;
    } else {
      direction.set(0);
      d = 0;
      dist = 0;
    }
    const sigmoid = 2 * (1 / (1 + Math.exp(-dist / 50)) - 0.5) * 50;
    stretchAmount.jump(sigmoid);
  });

  const progressPercent = useMotionValue(0);
  useMotionValueEvent(currentTime, "change", (v) => {
    const dur = duration.get();
    progressPercent.set(dur ? Math.min(Math.max((Number(v) / dur) * 100, 0), 100) : 0);
  });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      clientX.set(e.clientX);
      const dir = direction.get();
      const x = dir > 0 ? rect.width + stretchAmount.get() : dir < 0 ? -stretchAmount.get() : e.clientX - rect.left;
      indicatorX.set(x);

      if (trackRef.current) {
        const { width } = trackRef.current.getBoundingClientRect();
        const dur = duration.get();
        if (dur) {
          const pct = Math.min(Math.max((x / width) * 100, 0), 100);
          hoverTime.set((pct / 100) * dur);
        }
      }

      if (e.buttons > 0 && trackRef.current) {
        const { left, width } = trackRef.current.getBoundingClientRect();
        const dur = duration.get();
        if (dur) {
          const clampedX = Math.min(Math.max(e.clientX, left), left + width);
          onChange(((clampedX - left) / width) * dur);
        }
      }
    },
    [indicatorX, clientX, duration, hoverTime, onChange, stretchAmount, direction]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      onScrubStart();
      handlePointerMove(e);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [handlePointerMove, onScrubStart]
  );

  const handlePointerUp = useCallback(() => {
    animate(stretchAmount, 0, { type: "spring", bounce: 0.5 });
    onScrubEnd();
    direction.set(0);
  }, [onScrubEnd, stretchAmount, direction]);

  const [hoverLabel, setHoverLabel] = useState("00:00");
  useMotionValueEvent(hoverTime, "change", (v) => setHoverLabel(formatTime(Number(v))));

  return (
    <div className="w-full">
      <div className="relative flex h-10 items-center justify-center">
        <motion.div
          onPointerMove={handlePointerMove}
          onPointerLeave={() => {
            animate(stretchAmount, 0, { type: "spring", bounce: 0.5 });
            direction.set(0);
          }}
          onHoverStart={() => {
            setIsHovered(true);
            animate(scale, 1);
            animate(indicatorOpacity, 1);
          }}
          onHoverEnd={() => {
            setIsHovered(false);
            animate(scale, 0.8);
            animate(indicatorOpacity, 0);
          }}
          style={{ scale }}
          className="relative flex h-20 w-full cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing"
        >
          <div
            ref={trackRef}
            className="absolute flex w-full flex-1 select-none items-center py-4"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <motion.div
              style={{
                scaleX: useTransform(stretchAmount, (amount) => {
                  if (!trackRef.current) return 1;
                  const { width } = trackRef.current.getBoundingClientRect();
                  return 1 + amount / width;
                }),
                scaleY: useTransform(stretchAmount, [0, 50], [1, 0.8]),
                transformOrigin: useTransform(direction, (d) => (d < 0 ? "right" : d > 0 ? "left" : "center")),
                height: useTransform(scale, [0.8, 1], [6, 28]),
              }}
              className="flex grow"
            >
              <div className="bg-muted relative h-full grow overflow-hidden rounded-lg">
                <motion.div
                  style={{
                    clipPath: useTransform(progressPercent, (pct) => `inset(0 ${100 - pct}% 0 0)`),
                  }}
                  className="bg-foreground/80 absolute h-full w-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: indicatorOpacity, x: indicatorX }}
          className="pointer-events-none absolute left-0 flex h-10 w-px items-center justify-center border-r border-orange-500"
        >
          <span className="bg-background absolute top-0 -translate-y-full rounded px-1 py-0.5 text-[10px] leading-none text-orange-500 font-mono shadow-sm">
            {hoverLabel}
          </span>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: isHovered ? 10 : -27 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="pointer-events-none flex items-center justify-between text-xs text-muted-foreground px-1"
      >
        <span>{currFormatted}</span>
        <span>{durFormatted}</span>
      </motion.div>
    </div>
  );
}

export function DemoSkipper91() {
  return <Skipper91 />;
}

export default Skipper91;
