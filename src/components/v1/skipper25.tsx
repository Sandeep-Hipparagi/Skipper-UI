"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const MusicToggleButton: React.FC = () => {
  const getRandomBars = () => Array.from({ length: 5 }, () => 0.8 * Math.random() + 0.2);
  const [bars, setBars] = useState<number[]>(getRandomBars());
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/audio/audio.m4a");
    audio.loop = true;
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBars(getRandomBars());
      }, 100);
      return () => clearInterval(interval);
    }
    setBars(new Array(5).fill(0.1));
  }, [isPlaying]);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <motion.div
      key="audio"
      onClick={togglePlayback}
      initial={{ padding: "14px 14px" }}
      whileHover={{ padding: "18px 22px" }}
      whileTap={{ padding: "18px 22px" }}
      transition={{ duration: 1, bounce: 0.6, type: "spring" }}
      className="bg-neutral-900 border border-neutral-800 cursor-pointer rounded-full p-2 shadow-lg"
    >
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(4px)" }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="flex h-[18px] w-full items-center gap-1 rounded-full"
      >
        {bars.map((bar, index) => (
          <motion.div
            key={index}
            className="bg-white w-[1px] rounded-full"
            initial={{ height: 1 }}
            animate={{ height: Math.max(4, 14 * bar) }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export const Skipper25: React.FC = () => {
  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center bg-black">
      <div className="absolute top-[20%] grid content-start justify-items-center gap-6 py-20 text-center text-white">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Click to play the music
        </span>
      </div>
      <MusicToggleButton />
    </div>
  );
};

export const DemoSkipper25 = Skipper25;
export default Skipper25;
