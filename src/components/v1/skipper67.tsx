"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Play, X } from "lucide-react";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
} from "media-chrome/react";
import { cn } from "@/lib/utils";

export interface VideoPlayerProps
  extends React.ComponentPropsWithoutRef<typeof MediaController> {}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ style, ...props }) => (
  <MediaController style={{ ...style }} {...props} />
);

export const VideoPlayerControlBar = MediaControlBar;

export const VideoPlayerTimeRange: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaTimeRange>
> = ({ className, ...props }) => (
  <MediaTimeRange
    className={cn(
      "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
      className
    )}
    {...props}
  />
);

export const VideoPlayerTimeDisplay: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaTimeDisplay>
> = ({ className, ...props }) => (
  <MediaTimeDisplay className={cn("p-2.5", className)} {...props} />
);

export const VideoPlayerVolumeRange: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaVolumeRange>
> = ({ className, ...props }) => (
  <MediaVolumeRange className={cn("p-2.5", className)} {...props} />
);

export const VideoPlayerPlayButton: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaPlayButton>
> = ({ className, ...props }) => (
  <MediaPlayButton className={cn("", className)} {...props} />
);

export const VideoPlayerSeekBackwardButton: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaSeekBackwardButton>
> = ({ className, ...props }) => (
  <MediaSeekBackwardButton className={cn("p-2.5", className)} {...props} />
);

export const VideoPlayerSeekForwardButton: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaSeekForwardButton>
> = ({ className, ...props }) => (
  <MediaSeekForwardButton className={cn("p-2.5", className)} {...props} />
);

export const VideoPlayerMuteButton: React.FC<
  React.ComponentPropsWithoutRef<typeof MediaMuteButton>
> = ({ className, ...props }) => (
  <MediaMuteButton className={cn("", className)} {...props} />
);

export const VideoPlayerContent: React.FC<
  React.VideoHTMLAttributes<HTMLVideoElement>
> = ({ className, ...props }) => (
  <video className={cn("mb-0 mt-0", className)} {...props} />
);

interface VideoModalProps {
  setShowVideoPopOver: (v: boolean) => void;
}

function VideoModal({ setShowVideoPopOver }: VideoModalProps) {
  return (
    <div className="fixed left-0 top-0 z-[101] flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 top-0 h-full w-full bg-black/80 backdrop-blur-lg"
        onClick={() => setShowVideoPopOver(false)}
      />
      <motion.div
        initial={{ clipPath: "inset(43.5% 43.5% 33.5% 43.5%)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0 0 0)", opacity: 1 }}
        exit={{
          clipPath: "inset(43.5% 43.5% 33.5% 43.5%)",
          opacity: 0,
          transition: {
            duration: 1,
            type: "spring",
            stiffness: 100,
            damping: 20,
            opacity: { duration: 0.2, delay: 0.8 },
          },
        }}
        transition={{ duration: 1, type: "spring", stiffness: 100, damping: 20 }}
        className="relative aspect-video w-[90vw] max-w-7xl overflow-hidden rounded-2xl shadow-2xl"
      >
        <VideoPlayer style={{ width: "100%", height: "100%" }}>
          <VideoPlayerContent
            src="/showreel/skipper-ui-showreel.mp4"
            autoPlay
            slot="media"
            className="w-full object-cover"
            style={{ width: "100%", height: "100%" }}
          />
          <button
            onClick={() => setShowVideoPopOver(false)}
            className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors"
          >
            <X className="size-5" />
          </button>
          <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full max-w-7xl -translate-x-1/2 items-center justify-between px-5 py-3 mix-blend-exclusion md:px-10 md:py-5">
            <VideoPlayerPlayButton className="h-5 bg-transparent text-white" />
            <VideoPlayerTimeRange className="bg-transparent flex-1 mx-4" />
            <VideoPlayerMuteButton className="size-5 bg-transparent text-white" />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </motion.div>
    </div>
  );
}

export function Skipper67() {
  const [showVideo, setShowVideo] = useState(false);
  const spring = { mass: 0.1 };
  const cursorX = useSpring(0, spring);
  const cursorY = useSpring(0, spring);
  const cursorOpacity = useSpring(0, spring);

  return (
    <section className="relative flex h-full min-h-screen w-full items-center justify-center bg-[#f5f4f3] p-8 text-black">
      <div className="absolute top-1/4 grid content-start justify-items-center gap-6 text-center">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Click the video to play
        </span>
      </div>

      <AnimatePresence>
        {showVideo && <VideoModal setShowVideoPopOver={setShowVideo} />}
      </AnimatePresence>

      <div
        onMouseMove={(e) => {
          cursorOpacity.set(1);
          const rect = e.currentTarget.getBoundingClientRect();
          cursorX.set(e.clientX - rect.left);
          cursorY.set(e.clientY - rect.top);
        }}
        onMouseLeave={() => cursorOpacity.set(0)}
        onClick={() => setShowVideo(true)}
        className="relative size-48 cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-transform hover:scale-105"
      >
        <motion.div
          style={{ x: cursorX, y: cursorY, opacity: cursorOpacity }}
          className="pointer-events-none absolute z-20 flex w-fit select-none items-center justify-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold text-white mix-blend-exclusion backdrop-blur"
        >
          <Play className="size-3.5 fill-white" /> Play
        </motion.div>
        <video
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full object-cover"
        >
          <source src="/showreel/skipper-ui-showreel.mp4" />
        </video>
      </div>
    </section>
  );
}

export { Skipper67 as DemoSkipper67 };
export default Skipper67;
