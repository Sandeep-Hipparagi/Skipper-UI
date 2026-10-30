"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Subtitles,
  PictureInPicture2,
  Maximize,
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const sec = Math.floor(seconds);
  const min = Math.floor(sec / 60);
  return `${min.toString().padStart(2, "0")}:${(sec % 60).toString().padStart(2, "0")}`;
}

export function Skipper97() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  const currentTime = useMotionValue(0);
  const duration = useMotionValue(0);
  const volume = useMotionValue(1);
  const hoverX = useMotionValue(0);
  const hoverTime = useMotionValue(0);
  const hoverOpacity = useMotionValue(0);
  const progressPercent = useMotionValue(0);
  const bufferPercent = useMotionValue(0);

  const isScrubbingRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const prevVolumeRef = useRef(1);

  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsActive, setCaptionsActive] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);

  const [currTimeStr, setCurrTimeStr] = useState("00:00");
  const [durTimeStr, setDurTimeStr] = useState("00:00");
  const [remTimeStr, setRemTimeStr] = useState("00:00");
  const [hoverTimeStr, setHoverTimeStr] = useState("00:00");

  useMotionValueEvent(currentTime, "change", (v) => {
    setCurrTimeStr(formatTime(Number(v)));
    const dur = duration.get();
    setRemTimeStr(formatTime(Math.max(0, dur - Number(v))));
  });

  useMotionValueEvent(duration, "change", (v) => {
    setDurTimeStr(formatTime(Number(v)));
    const cur = currentTime.get();
    setRemTimeStr(formatTime(Math.max(0, Number(v) - cur)));
  });

  useMotionValueEvent(hoverTime, "change", (v) => {
    setHoverTimeStr(formatTime(Number(v)));
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateBuffer = () => {
      const b = video.buffered;
      const d = video.duration;
      if (b.length > 0 && d > 0 && Number.isFinite(d)) {
        let max = 0;
        for (let i = 0; i < b.length; i++) {
          if (b.end(i) > max) max = b.end(i);
        }
        bufferPercent.set(Math.min(Math.max((max / d) * 100, 0), 100));
      } else {
        bufferPercent.set(0);
      }
    };

    const onLoadedMetadata = () => {
      duration.set(video.duration || 0);
      currentTime.set(video.currentTime || 0);
      volume.set(video.volume);
      updateBuffer();
    };

    const onTimeUpdate = () => {
      if (!isScrubbingRef.current) currentTime.set(video.currentTime);
      updateBuffer();
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      currentTime.set(video.duration || 0);
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);
    video.addEventListener("progress", updateBuffer);
    video.addEventListener("loadeddata", updateBuffer);

    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("progress", updateBuffer);
      video.removeEventListener("loadeddata", updateBuffer);
    };
  }, [currentTime, duration, volume, bufferPercent]);

  useMotionValueEvent(currentTime, "change", (v) => {
    const dur = duration.get();
    progressPercent.set(dur ? Math.min(Math.max((Number(v) / dur) * 100, 0), 100) : 0);
  });

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

  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      if (video.paused) handlePlay();
      else handlePause();
    }
  }, [handlePause, handlePlay]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      hoverX.set(x);
      if (scrubberRef.current) {
        const { width } = scrubberRef.current.getBoundingClientRect();
        const dur = duration.get();
        if (dur) {
          hoverTime.set((Math.min(Math.max(x / width, 0), 1)) * dur);
        }
      }
    },
    [hoverX, duration, hoverTime]
  );

  const handleScrubStart = useCallback(
    (e: React.PointerEvent) => {
      const video = videoRef.current;
      if (!video || !scrubberRef.current) return;
      isScrubbingRef.current = true;
      wasPlayingRef.current = !video.paused;
      video.pause();

      const { left, width } = scrubberRef.current.getBoundingClientRect();
      const dur = duration.get();
      if (dur) {
        const pos = (Math.min(Math.max(e.clientX, left), left + width) - left) / width;
        video.currentTime = pos * dur;
        currentTime.set(pos * dur);
      }
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [duration, currentTime]
  );

  const handleScrubMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isScrubbingRef.current || !scrubberRef.current) return;
      const { left, width } = scrubberRef.current.getBoundingClientRect();
      const dur = duration.get();
      if (dur) {
        const pos = (Math.min(Math.max(e.clientX, left), left + width) - left) / width;
        const video = videoRef.current;
        if (video) {
          video.currentTime = pos * dur;
          currentTime.set(pos * dur);
        }
      }
    },
    [duration, currentTime]
  );

  const handleScrubEnd = useCallback(() => {
    isScrubbingRef.current = false;
    if (wasPlayingRef.current) handlePlay();
  }, [handlePlay]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      const v = prevVolumeRef.current;
      volume.set(v);
      video.volume = v;
      video.muted = false;
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume.get();
      volume.set(0);
      video.volume = 0;
      video.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const togglePip = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipActive(false);
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
        setPipActive(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = videoRef.current?.parentElement;
    if (!container) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setFullscreenActive(false);
      } else {
        container.requestFullscreen();
        setFullscreenActive(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          handleTogglePlay();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleTogglePlay]);

  const bufferWidth = useTransform(bufferPercent, (v) => `${v}%`);
  const progressWidth = useTransform(progressPercent, (v) => `${v}%`);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background text-foreground p-10">
      <div
        onMouseEnter={() => setIsControlsVisible(true)}
        onMouseLeave={() => setIsControlsVisible(false)}
        className="relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
      >
        <video
          ref={videoRef}
          src="/showreel/skipper-ui-showreel.mp4"
          onClick={handleTogglePlay}
          loop
          className="h-full w-full cursor-pointer object-cover"
          playsInline
          preload="metadata"
        />

        <AnimatePresence>
          {(!isPlaying || isControlsVisible) && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute bottom-0 left-0 flex h-16 w-full items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 md:px-8 text-white z-20"
            >
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleTogglePlay}
                  className="flex size-8 items-center justify-center rounded-md hover:bg-white/10"
                >
                  {isPlaying ? (
                    <Pause className="size-4 fill-white stroke-none" />
                  ) : (
                    <Play className="size-4 fill-white stroke-none ml-0.5" />
                  )}
                </motion.button>

                <div
                  className="relative"
                  onMouseEnter={() => setIsVolumeHovered(true)}
                  onMouseLeave={() => setIsVolumeHovered(false)}
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMute}
                    className="flex size-8 items-center justify-center rounded-md hover:bg-white/10"
                  >
                    {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar & Timestamps */}
              <div className="flex flex-1 items-center gap-3 text-xs font-mono tabular-nums">
                <span>{currTimeStr}</span>
                <div
                  ref={scrubberRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => hoverOpacity.set(1)}
                  onMouseLeave={() => hoverOpacity.set(0)}
                  onPointerDown={handleScrubStart}
                  onPointerMove={handleScrubMove}
                  onPointerUp={handleScrubEnd}
                  className="relative flex h-8 flex-1 cursor-crosshair touch-none select-none items-center"
                >
                  <div className="relative h-1 w-full rounded-full bg-white/20 overflow-hidden">
                    <motion.div style={{ width: bufferWidth }} className="absolute left-0 h-full bg-white/40" />
                    <motion.div style={{ width: progressWidth }} className="absolute left-0 h-full bg-white" />
                  </div>

                  <motion.div
                    style={{ x: hoverX, opacity: hoverOpacity }}
                    className="pointer-events-none absolute left-0 flex h-6 w-px items-center justify-center bg-white"
                  >
                    <span className="absolute -top-6 rounded bg-black/80 px-1 py-0.5 text-[10px] text-white">
                      {hoverTimeStr}
                    </span>
                  </motion.div>
                </div>
                <span>−{remTimeStr}</span>
              </div>

              <div className="flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCaptionsActive(!captionsActive)}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md hover:bg-white/10",
                    captionsActive && "bg-white/20"
                  )}
                >
                  <Subtitles className="size-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePip}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md hover:bg-white/10",
                    pipActive && "bg-white/20"
                  )}
                >
                  <PictureInPicture2 className="size-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFullscreen}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md hover:bg-white/10",
                    fullscreenActive && "bg-white/20"
                  )}
                >
                  <Maximize className="size-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function DemoSkipper97() {
  return <Skipper97 />;
}

export default Skipper97;
