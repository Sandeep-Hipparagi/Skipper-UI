"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimationVariant = "circle" | "circle-blur" | "rectangle" | "gif";
export type AnimationStart =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center"
  | "bottom-up"
  | "top-down"
  | "left-right"
  | "right-left"
  | "center";

export interface CreateAnimationResult {
  name: string;
  css: string;
}

const getClipPositions = (start: AnimationStart) => {
  switch (start) {
    case "bottom-up":
    default:
      return {
        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-down":
      return {
        from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "left-right":
      return {
        from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "right-left":
      return {
        from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-left":
      return {
        from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "top-right":
      return {
        from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "bottom-left":
      return {
        from: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
    case "bottom-right":
      return {
        from: "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)",
        to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      };
  }
};

export function createAnimation(
  variant: AnimationVariant = "rectangle",
  start: AnimationStart = "bottom-up",
  blur = false,
  gifUrl?: string
): CreateAnimationResult {
  const name = `${variant}-${start}${blur ? "-blur" : ""}`;

  if (variant === "rectangle") {
    const clip = getClipPositions(start);
    return {
      name,
      css: `
        ::view-transition-group(root) {
          animation-duration: 0.7s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        ::view-transition-new(root) {
          animation-name: reveal-light-${start}${blur ? "-blur" : ""};
          ${blur ? "filter: blur(2px);" : ""}
        }
        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: none;
          z-index: -1;
        }
        .dark::view-transition-new(root) {
          animation-name: reveal-dark-${start}${blur ? "-blur" : ""};
          ${blur ? "filter: blur(2px);" : ""}
        }
        @keyframes reveal-dark-${start}${blur ? "-blur" : ""} {
          from {
            clip-path: ${clip.from};
            ${blur ? "filter: blur(8px);" : ""}
          }
          ${blur ? "50% { filter: blur(4px); }" : ""}
          to {
            clip-path: ${clip.to};
            ${blur ? "filter: blur(0px);" : ""}
          }
        }
        @keyframes reveal-light-${start}${blur ? "-blur" : ""} {
          from {
            clip-path: ${clip.from};
            ${blur ? "filter: blur(8px);" : ""}
          }
          ${blur ? "50% { filter: blur(4px); }" : ""}
          to {
            clip-path: ${clip.to};
            ${blur ? "filter: blur(0px);" : ""}
          }
        }
      `,
    };
  }

  if (variant === "circle" || variant === "circle-blur") {
    return {
      name,
      css: `
        ::view-transition-group(root) {
          animation-duration: 0.7s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        ::view-transition-new(root) {
          animation-name: reveal-light${blur ? "-blur" : ""};
          ${blur ? "filter: blur(2px);" : ""}
        }
        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: none;
          z-index: -1;
        }
        .dark::view-transition-new(root) {
          animation-name: reveal-dark${blur ? "-blur" : ""};
          ${blur ? "filter: blur(2px);" : ""}
        }
        @keyframes reveal-dark${blur ? "-blur" : ""} {
          from {
            clip-path: circle(0% at 50% 50%);
            ${blur ? "filter: blur(8px);" : ""}
          }
          ${blur ? "50% { filter: blur(4px); }" : ""}
          to {
            clip-path: circle(100.0% at 50% 50%);
            ${blur ? "filter: blur(0px);" : ""}
          }
        }
        @keyframes reveal-light${blur ? "-blur" : ""} {
          from {
            clip-path: circle(0% at 50% 50%);
            ${blur ? "filter: blur(8px);" : ""}
          }
          ${blur ? "50% { filter: blur(4px); }" : ""}
          to {
            clip-path: circle(100.0% at 50% 50%);
            ${blur ? "filter: blur(0px);" : ""}
          }
        }
      `,
    };
  }

  return {
    name,
    css: `
      ::view-transition-group(root) {
        animation-timing-function: cubic-bezier(0.7, 0, 0.84, 0);
      }
      ::view-transition-new(root) {
        mask: url('${gifUrl || ""}') center / 0 no-repeat;
        animation: scale 3s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 3s;
      }
      @keyframes scale {
        0% { mask-size: 0; }
        10% { mask-size: 50vmax; }
        90% { mask-size: 50vmax; }
        100% { mask-size: 100vmax; }
      }
    `,
  };
}

export function useThemeToggle({
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}: {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const injectStyles = useCallback((css: string) => {
    const styleId = "theme-transition-styles";
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const anim = createAnimation(variant, start, blur, gifUrl);
    injectStyles(anim.css);

    const updateDOM = () => {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // FIX: Strongly type Document with startViewTransition to eliminate any cast
    type DocumentWithViewTransition = Document & {
      startViewTransition?: (updateCallback: () => void | Promise<void>) => unknown;
    };
    const docWithVT = document as DocumentWithViewTransition;

    if (!docWithVT.startViewTransition) {
      updateDOM();
      return;
    }
    docWithVT.startViewTransition(updateDOM);
  }, [isDark, variant, start, blur, gifUrl, injectStyles]);

  return { isDark, setIsDark, toggleTheme };
}

export interface ThemeToggleButtonProps {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  className = "",
  variant = "circle",
  start = "center",
  blur = false,
  gifUrl = "",
}) => {
  const { isDark, toggleTheme } = useThemeToggle({ variant, start, blur, gifUrl });

  return (
    <button
      type="button"
      className={cn(
        "size-10 cursor-pointer rounded-full bg-black p-0 transition-all duration-300 active:scale-95",
        className
      )}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <motion.g
          animate={{ rotate: isDark ? -180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
        >
          <path d="M120 67.5C149.25 67.5 172.5 90.75 172.5 120C172.5 149.25 149.25 172.5 120 172.5" fill="white" />
          <path d="M120 67.5C90.75 67.5 67.5 90.75 67.5 120C67.5 149.25 90.75 172.5 120 172.5" fill="black" />
        </motion.g>
        <motion.path
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ ease: "easeInOut", duration: 0.5 }}
          d="M120 3.75C55.5 3.75 3.75 55.5 3.75 120C3.75 184.5 55.5 236.25 120 236.25C184.5 236.25 236.25 184.5 236.25 120C236.25 55.5 184.5 3.75 120 3.75ZM120 214.5V172.5C90.75 172.5 67.5 149.25 67.5 120C67.5 90.75 90.75 67.5 120 67.5V25.5C172.5 25.5 214.5 67.5 214.5 120C214.5 172.5 172.5 214.5 120 214.5Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export const Skipper26: React.FC = () => {
  const [variant, setVariant] = useState<AnimationVariant>("rectangle");
  const [start, setStart] = useState<AnimationStart>("bottom-up");
  const [blur, setBlur] = useState<boolean>(false);
  const [gifUrl, setGifUrl] = useState<string>(
    "/examples/motion-001.gif"
  );

  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center p-6 text-foreground bg-background">
      <div className="mx-auto max-w-lg space-y-5 text-center">
        <h2 className="mt-12 text-4xl font-medium tracking-tight">
          07.09.2025 <br />
          Skipper UI theme toggle
        </h2>
        <p className="opacity-70">
          Clean view-transition theme switching with smooth clip-path and mask-image effects.
        </p>
      </div>

      <div className="py-12 text-center">
        <span className="text-xs uppercase tracking-wider opacity-40">
          Click below to toggle theme
        </span>
      </div>

      <ThemeToggleButton
        variant={variant}
        start={start}
        blur={blur}
        gifUrl={gifUrl}
      />

      {/* Control panel */}
      <motion.div
        drag
        className="fixed bottom-6 right-6 z-50 flex w-[260px] flex-col gap-3 rounded-3xl border border-neutral-700/50 bg-neutral-900/80 p-4 text-xs text-white backdrop-blur-md shadow-2xl cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center justify-between">
          <GripVertical className="size-4 opacity-50" />
          <p className="font-semibold opacity-70">Options</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="opacity-60">Variant:</span>
            <div className="flex gap-1">
              {(["circle", "rectangle", "gif"] as AnimationVariant[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVariant(v)}
                  className={cn(
                    "rounded px-2 py-0.5 capitalize transition-colors",
                    variant === v ? "bg-white text-black font-semibold" : "bg-neutral-800 text-white/70"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="opacity-60">Start:</span>
            <div className="flex gap-1 flex-wrap justify-end">
              {(["bottom-up", "top-down", "center"] as AnimationStart[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStart(s)}
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] capitalize transition-colors",
                    start === s ? "bg-white text-black font-semibold" : "bg-neutral-800 text-white/70"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="opacity-60">Blur:</span>
            <button
              type="button"
              onClick={() => setBlur(!blur)}
              className={cn(
                "rounded px-2 py-0.5 transition-colors",
                blur ? "bg-green-500 text-white font-semibold" : "bg-neutral-800 text-white/70"
              )}
            >
              {blur ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const DemoSkipper26 = Skipper26;
export default Skipper26;
