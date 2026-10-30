"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  Plus,
  Image as ImageIcon,
  FileText,
  LayoutGrid,
  Globe,
  ArrowUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const BTN_STYLE =
  "bg-muted/50 hover:bg-muted border border-muted cursor-pointer rounded-xl h-10 px-4 flex items-center gap-2 text-sm focus-visible:outline-[1px] -outline-offset-1 outline-sky-500 transition-colors";
const ACTIVE_BTN_STYLE =
  "bg-sky-500/15 hover:bg-sky-500/20 border-sky-500/10 text-sky-500";
const SPRING_TRANSITION = { type: "spring", stiffness: 300, damping: 30 } as const;

function BrainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M4.222 21.995v-3.55c0-1.271-.333-1.932-.987-3.037A8.888 8.888 0 0 1 10.889 2a8.89 8.89 0 0 1 8.889 8.887c0 .58 0 .87.024 1.032c.058.388.24.722.417 1.068L22 16.441l-1.4.7c-.405.202-.608.303-.749.49s-.181.399-.26.82l-.008.042c-.183.968-.384 2.036-.95 2.71c-.2.237-.448.43-.727.567c-.461.225-1.028.225-2.162.225c-.525 0-1.051.012-1.576 0c-1.243-.031-2.168-1.077-2.168-2.29" />
        <path d="M14.388 10.532c-.426 0-.815-.162-1.11-.427m1.11.426c0 1.146-.664 2.235-1.942 2.235S10.504 13.854 10.504 15m3.884-4.469c2.15 0 2.15-3.35 0-3.35q-.294.001-.557.095c.105-2.498-3.496-3.176-4.312-.836m.985 1.857c0-.774-.39-1.456-.985-1.857m0 0c-1.852-1.25-4.32.993-3.146 2.993c-1.97.295-1.76 3.333.247 3.333a1.66 1.66 0 0 0 1.362-.712" />
      </g>
    </svg>
  );
}

function GptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          strokeLinecap="round"
          d="M5.143 14A7.8 7.8 0 0 1 4 9.919C4 5.545 7.582 2 12 2s8 3.545 8 7.919A7.8 7.8 0 0 1 18.857 14"
        />
        <path
          strokeLinecap="round"
          d="M14 10c-.613.643-1.289 1-2 1s-1.387-.357-2-1"
        />
        <path d="M7.383 17.098c-.092-.276-.138-.415-.133-.527a.6.6 0 0 1 .382-.53c.104-.041.25-.041.54-.041h7.656c.291 0 .436 0 .54.04a.6.6 0 0 1 .382.531c.005.112-.041.25-.133.527c-.17.511-.255.767-.386.974a2 2 0 0 1-1.2.869c-.238.059-.506.059-1.043.059h-3.976c-.537 0-.806 0-1.043-.06a2 2 0 0 1-1.2-.868c-.131-.207-.216-.463-.386-.974ZM15 19l-.13.647c-.14.707-.211 1.06-.37 1.34a2 2 0 0 1-1.113.912C13.082 22 12.72 22 12 22s-1.082 0-1.387-.1a2 2 0 0 1-1.113-.913c-.159-.28-.23-.633-.37-1.34L9 19" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5V11" />
      </g>
    </svg>
  );
}

const MODELS = [
  { id: "gpt-4o", name: "GPT-4o", icon: GptIcon },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", icon: GptIcon },
  { id: "gemini-pro", name: "Gemini Pro", icon: GptIcon },
  { id: "llama-3-1", name: "Llama 3.1", icon: GptIcon },
];

function ShinyText({
  children,
  className,
  duration = 2,
  spread = 2,
}: {
  children: string;
  className?: string;
  duration?: number;
  spread?: number;
}) {
  const spreadWidth = useMemo(() => children.length * spread, [children, spread]);

  return (
    <motion.p
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box] dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        className
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={
        {
          "--spread": `${spreadWidth}px`,
          backgroundImage:
            "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
        } as React.CSSProperties
      }
    >
      {children}
    </motion.p>
  );
}

function DropdownPicker({
  trigger,
  items,
  side = "bottom",
  align = "start",
  sideOffset = 14,
}: {
  trigger: React.ReactNode;
  items: { label: string; icon?: React.ComponentType<{ className?: string }>; onClick?: () => void }[];
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-muted !outline-foreground/5 rounded-xl border-none p-1 !outline-[1px]"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={idx}
              onClick={item.onClick}
              className="focus:bg-foreground/5 focus:text-foreground text-foreground/50 flex h-10 cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm"
            >
              {Icon && <Icon className="size-4" />}
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Skipper81() {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [deepMindMode, setDeepMindMode] = useState(false);
  const [model, setModel] = useState("GPT-4o");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<
    { id: number; message: string; isFromUser: boolean }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<HTMLDivElement[]>([]);
  const [turn, setTurn] = useState(0);
  const springY = useSpring(0);
  const footerRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (type: string) => {
    if (type === "Images") {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    return () => {
      if (previewImg) URL.revokeObjectURL(previewImg);
    };
  }, [previewImg]);

  const handleSubmit = () => {
    if (input.trim() === "") return;
    setSubmitted(true);
    setPreviewImg(null);
    const text = input;
    setInput("");
    setTurn((t) => (t === 0 ? t + 1 : t + 2));
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, message: text, isFromUser: true },
      { id: prev.length + 2, message: "I dunnoo 😭", isFromUser: false },
    ]);
  };

  useLayoutEffect(() => {
    const len = messages.length;
    const offset =
      len > 1
        ? window.innerHeight -
          (msgRefs.current[len - 2]?.clientHeight || 0) -
          (footerRef.current?.clientHeight || 0)
        : 0;
    springY.set(offset);
    // FIX: Clean up requestAnimationFrame handle to avoid scroll trigger after unmount
    const rafId = requestAnimationFrame(() => {
      scrollRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(rafId);
  }, [messages, turn, springY]);

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center rounded-3xl border py-4">
      {!submitted && (
        <ShinyText
          spread={22}
          className="absolute bottom-20 select-none text-center text-[14vw] font-semibold !leading-[11vw] tracking-tighter opacity-[0.025] dark:opacity-[0.025]"
        >
          Skipper llm 0.3
        </ShinyText>
      )}

      {submitted && (
        <motion.div className="no-scroll flex h-screen max-w-3xl flex-1 flex-col overflow-scroll scroll-smooth px-3 py-6 pb-40">
          {messages.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 2) * 0.1 }}
              ref={(el) => {
                if (el) msgRefs.current[idx] = el;
              }}
              className={cn(
                "bg-muted my-2 w-fit max-w-xs break-words rounded-2xl px-4 py-2 text-sm",
                item.isFromUser ? "self-end" : "self-start"
              )}
            >
              {item.message}
            </motion.div>
          ))}
          <motion.div ref={scrollRef} style={{ marginTop: springY }} />
        </motion.div>
      )}

      <motion.div
        ref={footerRef}
        initial={false}
        animate={{ y: submitted ? "0%" : "50%", bottom: submitted ? "0%" : "50%" }}
        transition={SPRING_TRANSITION}
        className="rounded-t-4xl fixed w-full max-w-3xl gap-1 px-3 pb-3"
      >
        <div className="bg-muted/60 border-foreground/5 rounded-2xl border p-1 shadow-lg">
          <div className="relative">
            <textarea
              value={input}
              autoFocus
              placeholder=""
              rows={1}
              className="border-input placeholder:text-muted-foreground max-h-52 w-full resize-none rounded-none border-none !bg-transparent p-4 !text-base leading-[1.2] shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 md:text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => setInput(e.target.value)}
            />
            {!input && (
              <div className="pointer-events-none absolute left-4 top-3.5">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={searchMode ? "search" : "ask"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.1 }}
                    className="text-foreground/30 absolute w-[150px] text-sm"
                  >
                    {searchMode ? "Search the web" : "Ask Anything"}
                  </motion.p>
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="bg-background border-muted flex justify-between rounded-2xl border p-1">
            <div className="flex items-center gap-1">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreviewImg(URL.createObjectURL(file));
                  }}
                  className="hidden"
                />
                <DropdownPicker
                  trigger={
                    <button
                      className={cn(
                        BTN_STYLE,
                        "group flex w-10 items-center justify-center px-0",
                        previewImg ? ACTIVE_BTN_STYLE : "text-foreground hover:bg-muted/70"
                      )}
                    >
                      <Plus className="size-5 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                    </button>
                  }
                  items={[
                    { label: "Images", icon: ImageIcon, onClick: () => handleMenuClick("Images") },
                    { label: "Documents", icon: FileText, onClick: () => handleMenuClick("Documents") },
                    { label: "Connect Apps", icon: LayoutGrid, onClick: () => handleMenuClick("Connect Apps") },
                  ]}
                />

                {previewImg && (
                  <div
                    className={cn(
                      "bg-muted/50 absolute h-24 w-32 rounded-2xl p-1",
                      submitted
                        ? "-bottom-2 -left-3 -translate-x-full"
                        : "-left-2 top-14"
                    )}
                  >
                    <img
                      className="size-full rounded-xl object-cover"
                      src={previewImg}
                      alt="Uploaded preview"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        setPreviewImg(null);
                      }}
                      className="bg-muted shadow-3xl absolute -left-1 -top-1 flex size-5 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-sky-100 hover:text-sky-500 active:scale-95"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                )}
              </div>

              <motion.button
                initial={false}
                animate={{ width: searchMode ? "95px" : "40px" }}
                type="button"
                onClick={() => setSearchMode(!searchMode)}
                className={cn(BTN_STYLE, "relative overflow-hidden px-0", searchMode ? ACTIVE_BTN_STYLE : "bg-muted/50")}
              >
                <div className="flex size-10 flex-shrink-0 items-center justify-center">
                  <motion.div animate={{ rotate: searchMode ? 180 : 0 }}>
                    <Globe className="size-4" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {searchMode && (
                    <motion.span
                      initial={{ x: -14, opacity: 0 }}
                      animate={{ x: -12, opacity: 1 }}
                      exit={{ x: -14, opacity: 0 }}
                      className="flex-shrink-0 overflow-hidden whitespace-nowrap text-sm"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                initial={false}
                animate={{ width: deepMindMode ? "116px" : "40px" }}
                type="button"
                onClick={() => setDeepMindMode(!deepMindMode)}
                className={cn(BTN_STYLE, "relative overflow-hidden px-0", deepMindMode ? ACTIVE_BTN_STYLE : "bg-muted/50")}
              >
                <div className="flex size-10 flex-shrink-0 items-center justify-center">
                  <BrainIcon className="size-4" />
                </div>
                <AnimatePresence mode="popLayout">
                  {deepMindMode && (
                    <motion.span
                      initial={{ x: -14, opacity: 0 }}
                      animate={{ x: -12, opacity: 1 }}
                      exit={{ x: -14, opacity: 0 }}
                      className="flex-shrink-0 overflow-hidden whitespace-nowrap text-sm"
                    >
                      DeepMind
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <DropdownPicker
                trigger={
                  <button className={cn(BTN_STYLE, "flex items-center gap-2")}>
                    {(() => {
                      const m = MODELS.find((x) => x.name === model);
                      const Icon = m?.icon;
                      return Icon ? <Icon className="size-4" /> : null;
                    })()}
                    {model}
                  </button>
                }
                items={MODELS.map((item) => ({
                  label: item.name,
                  icon: item.icon,
                  onClick: () => setModel(item.name),
                }))}
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSubmit}
                className={cn(
                  BTN_STYLE,
                  "flex w-10 items-center justify-center p-0 transition-all ease-in-out active:scale-95",
                  input ? ACTIVE_BTN_STYLE : "cursor-not-allowed opacity-50"
                )}
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function DemoSkipper81() {
  return <Skipper81 />;
}

export default Skipper81;
