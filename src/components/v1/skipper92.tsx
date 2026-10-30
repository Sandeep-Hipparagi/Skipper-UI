"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
  Settings,
  HelpCircle,
  FileText,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

// FIX: Strongly type CommandItem and CommandGroup interfaces to eliminate any cast
interface CommandItem {
  label: string;
  shortcut?: string;
}

interface CommandGroup {
  heading: string;
  icon: React.ComponentType<{ className?: string }>;
  items: CommandItem[];
}

const COMMAND_GROUPS: CommandGroup[] = [
  {
    heading: "Suggestions",
    icon: Lightbulb,
    items: [
      { label: "Calendar" },
      { label: "Search Emoji" },
      { label: "Calculator" },
      { label: "Documents" },
      { label: "Images" },
      { label: "Music" },
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    items: [
      { label: "Profile", shortcut: "⌘P" },
      { label: "Billing", shortcut: "⌘B" },
      { label: "Settings", shortcut: "⌘S" },
      { label: "Notifications", shortcut: "⌘N" },
      { label: "Messages", shortcut: "⌘M" },
      { label: "Security", shortcut: "⌘T" },
    ],
  },
  {
    heading: "Help",
    icon: HelpCircle,
    items: [{ label: "FAQ" }, { label: "Contact Support" }],
  },
  {
    heading: "Docs",
    icon: FileText,
    items: [{ label: "Documentation" }, { label: "Tutorials" }],
  },
];

export function Skipper92() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable);

      if ((e.key === "f" || e.key === "F") && !open && !isInput) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
        setSearch("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Press F or click in input
        </span>
      </div>

      <div className="relative z-50">
        <motion.button
          layoutId="wrapper"
          onClick={() => setOpen((prev) => !prev)}
          className="group relative flex h-9 w-[220px] items-center rounded-lg border bg-background px-2 shadow-sm transition-colors hover:border-foreground/20"
        >
          <div className="flex flex-1 items-center gap-2">
            <motion.span layoutId="icon" className="flex items-center justify-center text-muted-foreground">
              <Search className="size-4 opacity-50" />
            </motion.span>
            <motion.span
              layoutId="center"
              className="flex-1 text-left text-sm text-muted-foreground"
            >
              Find...
            </motion.span>
            <motion.span
              layoutId="wordwrapper"
              transition={{ duration: 0.1 }}
              className="flex items-center justify-center"
            >
              <kbd className="flex h-5 w-5 items-center justify-center rounded border bg-muted text-[10px] font-mono text-muted-foreground">
                F
              </kbd>
            </motion.span>
          </div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              layoutId="wrapper"
              className="absolute -left-20 -top-4 z-50 flex w-[420px] flex-col rounded-xl"
            >
              <CommandPrimitive
                value={search}
                onValueChange={setSearch}
                className="bg-popover text-popover-foreground relative flex w-full flex-col overflow-hidden rounded-xl border shadow-2xl"
              >
                <div className="flex items-center border-b px-3">
                  <motion.span layoutId="icon" className="mr-2 text-muted-foreground">
                    <Search className="size-4" />
                  </motion.span>
                  <motion.span layoutId="center" className="flex-1">
                    <CommandPrimitive.Input
                      autoFocus
                      placeholder="Find..."
                      className="placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </motion.span>
                  <motion.span layoutId="wordwrapper">
                    <kbd
                      onClick={() => setOpen(false)}
                      className="flex cursor-pointer items-center justify-center rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono tracking-tight text-muted-foreground"
                    >
                      Esc
                    </kbd>
                  </motion.span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-h-[300px] overflow-y-auto p-1"
                >
                  <CommandPrimitive.List>
                    <CommandPrimitive.Empty className="py-6 text-center text-sm text-muted-foreground">
                      No results found.
                    </CommandPrimitive.Empty>

                    {COMMAND_GROUPS.map((group, gIdx) => (
                      <React.Fragment key={gIdx}>
                        {gIdx > 0 && <CommandPrimitive.Separator className="bg-border -mx-1 my-1 h-px" />}
                        <CommandPrimitive.Group
                          heading={group.heading}
                          className="text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
                        >
                          {group.items.map((item, iIdx) => {
                            const Icon = group.icon;
                            return (
                              <CommandPrimitive.Item
                                key={iIdx}
                                className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none"
                              >
                                <Icon className="size-4 text-muted-foreground" />
                                <span>{item.label}</span>
                                {item.shortcut && (
                                  <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                                    {item.shortcut}
                                  </span>
                                )}
                              </CommandPrimitive.Item>
                            );
                          })}
                        </CommandPrimitive.Group>
                      </React.Fragment>
                    ))}
                  </CommandPrimitive.List>
                </motion.div>
              </CommandPrimitive>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function DemoSkipper92() {
  return <Skipper92 />;
}

export default Skipper92;
