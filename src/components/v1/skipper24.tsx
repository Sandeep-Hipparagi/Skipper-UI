"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  badge: string;
  bgColor: string;
  image: string;
}

export interface TikTikColorListProps {
  projects: ProjectItem[];
  className?: string;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  enableSound?: boolean;
  infiniteScroll?: boolean;
  scrollThreshold?: number;
}

export const defaultProjects: ProjectItem[] = [
  {
    id: 0,
    name: "Aarzoo",
    description: "A collection of timeless design elements that bridge the past and present",
    badge: "Print Design",
    bgColor: "#ff0000",
    image: "/examples/photo-080.jpg",
  },
  {
    id: 1,
    name: "Lost Horizons",
    description: "Exploring the boundaries of conceptual art and digital expression",
    badge: "Concept Art",
    bgColor: "#fff",
    image: "/examples/photo-081.jpg",
  },
  {
    id: 2,
    name: "Eternal Echoes",
    description: "Typography that speaks volumes through minimalist elegance",
    badge: "Typography",
    bgColor: "#8b5cf6",
    image: "/examples/photo-063.jpg",
  },
  {
    id: 3,
    name: "Abstract Dimensions",
    description: "Pushing the limits of experimental media and digital art",
    badge: "Experimental Media",
    bgColor: "#E5389B",
    image: "/examples/photo-064.jpg",
  },
  {
    id: 4,
    name: "Silent Stories",
    description: "Capturing moments that tell stories without words",
    badge: "Photography",
    bgColor: "#06b6d4",
    image: "/examples/photo-065.jpg",
  },
  {
    id: 5,
    name: "Fading Memories",
    description: "Editorial design that preserves the essence of fleeting moments",
    badge: "Editorial Design",
    bgColor: "#10b981",
    image: "/examples/photo-066.jpg",
  },
  {
    id: 6,
    name: "Weekend",
    description: "Sound design that creates immersive auditory experiences",
    badge: "Sound Design",
    bgColor: "#ADCABA",
    image: "/examples/photo-079.jpg",
  },
  {
    id: 7,
    name: "Shattered Glass",
    description: "Art installations that challenge perception and reality",
    badge: "Art Installations",
    bgColor: "#fff",
    image: "/examples/photo-088.jpg",
  },
  {
    id: 8,
    name: "Timeless Essence",
    description: "Brand strategy that creates lasting impressions",
    badge: "Brand Strategy",
    bgColor: "#F02D05",
    image: "/examples/photo-069.jpg",
  },
  {
    id: 9,
    name: "Parallel Worlds",
    description: "UX/UI design that transports users to new digital realms",
    badge: "UX/UI Design",
    bgColor: "#8b5cf6",
    image: "/examples/photo-070.jpg",
  },
  {
    id: 10,
    name: "Invisible Threads",
    description: "Fashion styling that weaves stories through fabric and form",
    badge: "Fashion Styling",
    bgColor: "#fff",
    image: "/examples/photo-071.jpg",
  },
  {
    id: 11,
    name: "Beyond the Surface",
    description: "Augmented reality experiences that transcend physical boundaries",
    badge: "Augmented Reality",
    bgColor: "#14b8a6",
    image: "/examples/photo-072.jpg",
  },
];

export const TikTikColorList: React.FC<TikTikColorListProps> = ({
  projects,
  className = "",
  showPreview = true,
  previewSize = "lg",
  enableSound = true,
  infiniteScroll = true,
  scrollThreshold = 1000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fullIndex, setFullIndex] = useState(0);
  const [items, setItems] = useState<ProjectItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isFetchingRef = useRef(false);
  // FIX: Track pending scroll timeout to prevent state updates after unmount
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audio/effects/tick.wav");
    audioRef.current.volume = 0.5;
  }, []);

  const playTick = useCallback(() => {
    if (enableSound && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [enableSound]);

  useEffect(() => {
    if (!infiniteScroll) {
      setItems(projects);
      return;
    }
    const initialList: ProjectItem[] = [];
    for (let r = 0; r < 10; r++) {
      projects.forEach((item, i) => {
        initialList.push({ ...item, id: r * projects.length + i });
      });
    }
    setItems(initialList);
  }, [projects, infiniteScroll]);

  const handleScroll = useCallback(() => {
    if (!infiniteScroll || isFetchingRef.current) return;
    const scrollY = window.scrollY;
    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - scrollThreshold) {
      isFetchingRef.current = true;
      if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
      fetchTimerRef.current = setTimeout(() => {
        setItems((prev) => {
          const currentLen = prev.length;
          const additional: ProjectItem[] = [];
          for (let r = 0; r < 5; r++) {
            projects.forEach((item, a) => {
              additional.push({ ...item, id: (currentLen / projects.length + r) * projects.length + a });
            });
          }
          return [...prev, ...additional];
        });
        isFetchingRef.current = false;
      }, 500);
    }
  }, [projects, infiniteScroll, scrollThreshold]);

  useEffect(() => {
    if (infiniteScroll) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        // FIX: Clean up scroll listener and any pending timer to avoid memory leaks
        window.removeEventListener("scroll", handleScroll);
        if (fetchTimerRef.current) clearTimeout(fetchTimerRef.current);
      };
    }
  }, [handleScroll, infiniteScroll]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    itemRefs.current = itemRefs.current.slice(0, items.length);

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        end: "top 65%",
        markers: false,
        onEnter: () => {
          playTick();
          setActiveIndex(index % projects.length);
          setFullIndex(index);
        },
        onEnterBack: () => {
          playTick();
          setActiveIndex(index % projects.length);
          setFullIndex(index);
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [items, projects.length, playTick]);

  const activeProject = projects[activeIndex];

  const getPreviewSize = () => {
    switch (previewSize) {
      case "sm":
        return "h-[200px] w-[200px]";
      case "md":
        return "h-[300px] w-[300px]";
      default:
        return "h-[400px] w-[400px]";
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("archive w-screen", className)}
      style={{
        backgroundColor: activeProject?.bgColor || "#ffffff",
        minHeight: "100vh",
      }}
      animate={{ backgroundColor: activeProject?.bgColor || "#ffffff" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="relative">
        {showPreview && (
          <div className="fixed bottom-10 right-10 z-50 hidden md:block">
            <motion.div
              drag
              className={cn("overflow-hidden rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing", getPreviewSize())}
            >
              <img
                src={activeProject?.image}
                alt={activeProject?.name}
                className="pointer-events-none h-full w-full object-cover"
              />
            </motion.div>
          </div>
        )}

        <div className="flex flex-col gap-6 whitespace-nowrap py-20">
          {items.map((item, index) => {
            const isActive = index === fullIndex;
            return (
              <div
                key={`${item.id}-${index}`}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="project-item z-5 w-full py-2 transition-opacity duration-300 hover:opacity-100"
                style={{ opacity: isActive ? 1 : 0.2 }}
              >
                <div className="mx-auto w-full">
                  <div className="flex w-full cursor-pointer items-center justify-between gap-6 px-10 text-black lg:justify-start">
                    <h1 className="text-4xl font-bold tracking-tight md:text-7xl">
                      {item.name}
                    </h1>
                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                      {item.badge}
                    </span>
                    <p className="hidden text-sm md:block">[01 sep]</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export const Skipper24: React.FC = () => {
  return <TikTikColorList projects={defaultProjects} />;
};

export const DemoSkipper24 = Skipper24;
export default Skipper24;
