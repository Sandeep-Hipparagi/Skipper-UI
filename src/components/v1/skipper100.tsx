"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Activity,
  Calendar,
  Settings,
  Bell,
  ExternalLink,
  Bookmark,
  Layers,
  X,
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./skipper101";
import { cn } from "@/lib/utils";

export function areIntersecting(
  el1: HTMLElement,
  el2: HTMLElement,
  margin = 0
): boolean {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(
    r1.right + margin < r2.left ||
    r1.left - margin > r2.right ||
    r1.bottom + margin < r2.top ||
    r1.top - margin > r2.bottom
  );
}

const MENU_ITEMS = [
  { icon: Activity, label: "Recent Activity" },
  { icon: Calendar, label: "Calendar" },
  { icon: Settings, label: "Settings" },
  { icon: Bell, label: "Notifications" },
  { icon: ExternalLink, label: "Visit Github" },
  { icon: Bookmark, label: "Read Bookmarks" },
];

export function Skipper100() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 20, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 350, damping: 20, mass: 0.1 });

  const [isOverDropTarget, setIsOverDropTarget] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const dropAreaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropTargetIconRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      x.set(0);
      y.set(0);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [x, y]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-background text-foreground border rounded-3xl overflow-hidden p-6">
      <div className="absolute mb-[30vh] grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Try drag/drop the Button
        </span>
      </div>

      <p className="text-muted-foreground absolute bottom-4 text-xs">
        Inspired by{" "}
        <a href="https://vercel.com" target="_blank" rel="noreferrer" className="hover:text-foreground underline">
          Vercel
        </a>
      </p>

      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            ref={rootRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)", y: 20 }}
            className="fixed right-6 top-1/2 z-50 group"
          >
            <PopoverPrimitive.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverPrimitive.Trigger asChild>
                    <motion.button
                      ref={buttonRef}
                      drag
                      dragMomentum={false}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={(_e, info) => {
                        setIsDragging(false);
                        if (isOverDropTarget) {
                          setIsDismissed(true);
                          return;
                        }
                        // Snap to nearest screen edge (left vs right)
                        const snapX = info.point.x > window.innerWidth / 2 ? 0 : -window.innerWidth + 80;
                        x.set(snapX);
                        springX.set(snapX);
                        springY.set(y.get());
                      }}
                      onDrag={() => {
                        setIsPopoverOpen(false);
                        if (buttonRef.current && dropAreaRef.current) {
                          const inter = areIntersecting(buttonRef.current, dropAreaRef.current);
                          setIsOverDropTarget(inter);
                          if (inter && dropTargetIconRef.current && rootRef.current) {
                            const tRect = dropTargetIconRef.current.getBoundingClientRect();
                            const rRect = rootRef.current.getBoundingClientRect();
                            springX.set(tRect.left - rRect.left);
                            springY.set(tRect.top - rRect.top);
                          } else {
                            springX.set(x.get());
                            springY.set(y.get());
                          }
                        }
                      }}
                      style={{ x, y }}
                      className="absolute size-12 rounded-full cursor-grab active:cursor-grabbing focus-visible:outline-none z-50"
                    />
                  </PopoverPrimitive.Trigger>
                </TooltipTrigger>
                {!isDragging && (
                  <TooltipContent side="left" sideOffset={4} className="flex items-center gap-2 py-1.5 pl-3 pr-2">
                    Skipper Toolbar
                  </TooltipContent>
                )}
              </Tooltip>

              <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                  side="left"
                  sideOffset={8}
                  className="z-50 w-52 bg-popover text-popover-foreground flex flex-col gap-1 rounded-2xl border p-1 shadow-xl outline-none"
                >
                  {MENU_ITEMS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>

            {/* Visual Button Display */}
            <motion.div
              style={{ x: springX, y: springY }}
              className={cn(
                "flex size-12 items-center justify-center rounded-full bg-background/80 p-0.5 backdrop-blur-2xl shadow-xl pointer-events-none",
                isOverDropTarget ? "border-0" : "border"
              )}
            >
              <div className="flex size-full items-center justify-center rounded-full hover:bg-muted/50 transition-colors">
                <Layers className="size-5" />
                <div className="border-background absolute right-2.5 top-2.5 size-2 rounded-full border-[1.5px] bg-blue-500" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Drop Zone to close */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 20, mass: 0.2 }}
            ref={dropAreaRef}
            className="fixed bottom-6 left-1/2 flex w-80 -translate-x-1/2 flex-col items-center justify-start pointer-events-none z-40"
          >
            <div
              ref={dropTargetIconRef}
              className={cn(
                "bg-background outline-muted flex size-12 items-center justify-center rounded-full outline shadow-md transition-all",
                isOverDropTarget && "outline-blue-500 scale-110"
              )}
            >
              <X className="size-6 rotate-45 stroke-1 text-muted-foreground" />
            </div>
            <span className={cn("mt-3 text-xs transition-colors", isOverDropTarget ? "text-blue-500 font-medium" : "text-muted-foreground/60")}>
              {isOverDropTarget ? "Leave here to close" : "Drop here to close"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DemoSkipper100() {
  return <Skipper100 />;
}

export default Skipper100;
