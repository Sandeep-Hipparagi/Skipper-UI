"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as SliderPrimitive from "@radix-ui/react-slider";
import {
  LayoutDashboard,
  Bell,
  Settings,
  BookOpen,
  Shield,
  User,
  Zap,
  FolderGit2,
  FileText,
  LogOut,
  ChevronRight,
  Volume2,
} from "lucide-react";
import { cn } from "@/lib/utils";

function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked?: boolean;
  onCheckedChange?: (c: boolean) => void;
  className?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

function Slider({
  value,
  onValueChange,
  max = 100,
  className,
}: {
  value: number[];
  onValueChange: (v: number[]) => void;
  max?: number;
  className?: string;
}) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      max={max}
      step={1}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
    >
      <SliderPrimitive.Track className="bg-secondary relative h-1.5 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="bg-primary absolute h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="border-primary bg-background block h-4 w-4 rounded-full border shadow transition-colors focus-visible:outline-none" />
    </SliderPrimitive.Root>
  );
}

const TAB_TRANSITION = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 } as const;

export function Skipper96() {
  const [direction, setDirection] = useState(1);
  const [contentRef, bounds] = useMeasure();
  const [selected, setSelected] = useState<number | null>(null);
  const [volume, setVolume] = useState([50]);
  const [switches, setSwitches] = useState({
    darkMode: false,
    notifications: true,
    autoSave: true,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    };
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, []);

  const TABS = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Notifications", icon: Bell },
    { title: "Settings", icon: Settings },
    { title: "Changelog", icon: BookOpen },
    { title: "Security", icon: Shield },
  ];

  const content = useMemo(() => {
    switch (selected) {
      case 0: {
        const items = [
          { icon: User, title: "Profile" },
          { icon: Zap, title: "Upgrade" },
          { icon: FolderGit2, title: "Projects" },
          { icon: FileText, title: "Documentation" },
          { icon: LogOut, title: "Logout" },
        ];
        return (
          <div className="mb-2 flex flex-col gap-0.5">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="hover:bg-muted flex h-10 cursor-pointer items-center justify-between gap-2 rounded-xl px-2 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <it.icon className="size-4 text-muted-foreground" />
                  {it.title}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        );
      }
      case 1:
        return (
          <div className="mb-2 max-h-72 space-y-1 overflow-y-auto p-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="hover:bg-muted flex h-10 w-full items-center justify-between rounded-xl px-2 text-sm transition-colors"
              >
                <span>Notification {idx + 1}</span>
                <span className="text-muted-foreground flex items-center gap-2 text-xs">
                  {idx * 4 + 2} sec ago
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-sky-500" />
                  </span>
                </span>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="mb-2 flex flex-col gap-3 pt-3">
            <div className="flex items-center justify-between px-2">
              <span className="flex items-center gap-2 text-sm">
                <Volume2 className="size-4" /> Volume
              </span>
              <span className="text-muted-foreground text-xs">{volume[0]}%</span>
            </div>
            <Slider value={volume} onValueChange={setVolume} max={100} className="w-full px-2" />
            <div className="flex flex-col gap-0.5">
              {[
                { key: "darkMode" as const, label: "Dark Mode" },
                { key: "notifications" as const, label: "Notifications" },
                { key: "autoSave" as const, label: "Auto Save" },
              ].map((sw) => (
                <div
                  key={sw.key}
                  className="hover:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-lg p-2 text-sm transition-colors"
                >
                  <span>{sw.label}</span>
                  <Switch
                    checked={switches[sw.key]}
                    onCheckedChange={(val) => setSwitches((prev) => ({ ...prev, [sw.key]: val }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mb-2 max-h-52 space-y-1 overflow-y-auto p-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex h-10 w-full items-center justify-between rounded-xl px-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-orange-500" />
                  <span>Ticket 00{idx + 1}</span>
                </div>
                <span className="text-muted-foreground text-xs">{idx * 4 + 2} sec ago</span>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 p-2">
            {[25, 15].map((val) => (
              <div key={val} className="space-y-2">
                <div className="text-muted-foreground flex w-full justify-between text-xs">
                  <span>{val > 20 ? "API" : "Build and Deploy"}</span>
                  <span className={val > 20 ? "text-sky-500" : "text-red-500"}>
                    {val > 20 ? "operational" : "system failure"}
                  </span>
                </div>
                <div className="flex h-8 w-full justify-between gap-1">
                  {Array.from({ length: 25 }).map((_, bIdx) => (
                    <div
                      key={bIdx}
                      className={cn(
                        "flex h-8 w-1 items-center justify-center rounded-full",
                        bIdx < val ? (val < 20 ? "bg-red-500" : "bg-sky-500") : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div />;
    }
  }, [selected, volume, switches]);

  const slideVariants = {
    initial: (dir: number) => ({ x: `${110 * dir}%`, opacity: 0 }),
    active: { x: "0%", opacity: 1 },
    exit: (dir: number) => ({ x: `${-110 * dir}%`, opacity: 0 }),
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="-mt-36 mb-10 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Click to see the items
        </span>
      </div>

      <div ref={containerRef} className="flex h-96 items-end justify-center">
        <motion.div
          initial={false}
          animate={{
            height: selected === null ? 52 : bounds.height || "auto",
            width: selected === null ? 220 : 320,
          }}
          transition={{ duration: 0.5, type: "spring", bounce: 0 }}
          className="bg-card text-card-foreground relative mx-auto overflow-hidden rounded-3xl border shadow-xl"
        >
          <div ref={contentRef}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {selected !== null && (
                <motion.div
                  key={selected}
                  custom={direction}
                  variants={slideVariants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  className="p-3 pb-12"
                >
                  {content}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-card absolute bottom-0 w-full p-2 border-t">
              <div className="flex h-9 w-full items-center justify-center gap-1">
                {TABS.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isSelected = selected === idx;
                  return (
                    <motion.button
                      key={tab.title}
                      initial={false}
                      animate={{
                        gap: isSelected ? "0.5rem" : 0,
                        paddingLeft: isSelected ? "0.75rem" : "0.5rem",
                        paddingRight: isSelected ? "0.75rem" : "0.5rem",
                      }}
                      onClick={() => {
                        if (selected === null) setSelected(idx);
                        else if (selected === idx) setSelected(null);
                        else {
                          setDirection(idx > selected ? 1 : -1);
                          setSelected(idx);
                        }
                      }}
                      className={cn(
                        "relative flex h-full items-center justify-center rounded-2xl text-sm font-medium transition-colors",
                        isSelected
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      <AnimatePresence initial={false}>
                        {isSelected && (
                          <motion.span
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={TAB_TRANSITION}
                            className="overflow-hidden whitespace-nowrap text-xs font-medium tracking-tight"
                          >
                            {tab.title}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function DemoSkipper96() {
  return <Skipper96 />;
}

export default Skipper96;
