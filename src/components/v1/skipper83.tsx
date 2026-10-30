"use client";

import React, { useState, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 180" preserveAspectRatio="xMidYMid" {...props}>
      <path
        d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"
        fill="red"
      />
      <path fill="#FFF" d="m102.421 128.06 66.328-38.418-66.328-38.418z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 262" preserveAspectRatio="xMidYMid" {...props}>
      <path
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
        fill="#4285F4"
      />
      <path
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
        fill="#34A853"
      />
      <path
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
        fill="#FBBC05"
      />
      <path
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
        fill="#EB4335"
      />
    </svg>
  );
}

function NotionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 268" preserveAspectRatio="xMidYMid" {...props}>
      <path
        fill="#FFF"
        d="M16.092 11.538 164.09.608c18.179-1.56 22.85-.508 34.28 7.801l47.243 33.282C253.406 47.414 256 48.975 256 55.207v182.527c0 11.439-4.155 18.205-18.696 19.24L65.44 267.378c-10.913.517-16.11-1.043-21.825-8.327L8.826 213.814C2.586 205.487 0 199.254 0 191.97V29.726c0-9.352 4.155-17.153 16.092-18.188Z"
      />
      <path d="M164.09.608 16.092 11.538C4.155 12.573 0 20.374 0 29.726v162.245c0 7.284 2.585 13.516 8.826 21.843l34.789 45.237c5.715 7.284 10.912 8.844 21.825 8.327l171.864-10.404c14.532-1.035 18.696-7.801 18.696-19.24V55.207c0-5.911-2.336-7.614-9.21-12.66l-1.185-.856L198.37 8.409C186.94.1 182.27-.952 164.09.608ZM69.327 52.22c-14.033.945-17.216 1.159-25.186-5.323L23.876 30.778c-2.06-2.086-1.026-4.69 4.163-5.207l142.274-10.395c11.947-1.043 18.17 3.12 22.842 6.758l24.401 17.68c1.043.525 3.638 3.637.517 3.637L71.146 52.095l-1.819.125Zm-16.36 183.954V81.222c0-6.767 2.077-9.887 8.3-10.413L230.02 60.93c5.724-.517 8.31 3.12 8.31 9.879v153.917c0 6.767-1.044 12.49-10.387 13.008l-161.487 9.361c-9.343.517-13.489-2.594-13.489-10.921ZM212.377 89.53c1.034 4.681 0 9.362-4.681 9.897l-7.783 1.542v114.404c-6.758 3.637-12.981 5.715-18.18 5.715-8.308 0-10.386-2.604-16.609-10.396l-50.898-80.079v77.476l16.1 3.646s0 9.362-12.989 9.362l-35.814 2.077c-1.043-2.086 0-7.284 3.63-8.318l9.351-2.595V109.823l-12.98-1.052c-1.044-4.68 1.55-11.439 8.826-11.965l38.426-2.585 52.958 81.113v-71.76l-13.498-1.552c-1.043-5.733 3.111-9.896 8.3-10.404l35.84-2.087Z" />
    </svg>
  );
}

function GradientBar({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col items-stretch -space-y-3", className)}>
      <div className="w-full flex-1 bg-[#FC2BA3] blur-xl" />
      <div className="w-full flex-1 bg-[#FC6D35] blur-xl" />
      <div className="w-full flex-1 bg-[#F9C83D] blur-xl" />
      <div className="w-full flex-1 bg-[#C2D6E1] blur-xl" />
    </div>
  );
}

interface MessageItem {
  sentByMe: boolean;
  message: string;
  type: "text" | "mention";
  mentionData?: {
    mention: string;
    title: string;
    icon: string;
  };
}

export function Skipper83() {
  const [value, setValue] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [chatList, setChatList] = useState<MessageItem[]>([]);
  const [submitCount, setSubmitCount] = useState(0);

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatList]);

  const playSound = () => {
    try {
      const audio = new Audio("/audio/send2.wav");
      audio.volume = 0.2;
      audio.play().catch(() => {});
    } catch {}
  };

  const handleSend = async () => {
    setSubmitCount((c) => c + 1);
    if (!value.trim()) return;
    playSound();
    if (mentions.length > 0) setSubmitCount((c) => c + 1);

    const newItems: MessageItem[] = [];
    newItems.push({
      sentByMe: true,
      message: value.trim(),
      type: "text",
    });

    Array.from(value.matchAll(/@(notion|yt|google)/g), (m) => m[1]).forEach((m) => {
      newItems.push({
        sentByMe: true,
        message: `@${m}`,
        type: "mention",
        mentionData: {
          mention: m,
          title: m === "yt" ? "Youtube Analyzer" : m === "google" ? "Google Search" : m === "notion" ? "Notion" : "",
          icon: m,
        },
      });
    });

    setChatList((prev) => [...prev, ...newItems]);
    setValue("");
    setMentions([]);
  };

  return (
    <div className="bg-background flex min-h-screen w-screen items-center justify-center rounded-3xl border py-8">
      <div className="relative flex h-[500px] w-full max-w-lg flex-col overflow-hidden">
        <div className="no-scroll flex flex-1 flex-col gap-4 overflow-scroll py-14">
          <div className="h-30 from-background z-20 absolute w-full -translate-y-14 bg-gradient-to-b to-transparent pointer-events-none" />
          {chatList.map((item, idx) => {
            if (item.type === "text") {
              return (
                <motion.div
                  key={idx}
                  layoutId={item.sentByMe ? `text-${idx}` : `system-${idx}`}
                  className={cn(
                    "bg-muted !border-foreground/15 w-fit max-w-[260px] break-words rounded-[12px_12px_6px] border-[0.5px] p-2 text-xl",
                    item.sentByMe ? "self-end" : "self-start"
                  )}
                >
                  {item.message}
                </motion.div>
              );
            }
            return (
              <motion.div
                key={idx}
                layoutId={`m-${idx}`}
                className={cn(
                  "backdrop-blur-xs !border-foreground/10 bg-foreground/10 text-foreground flex w-fit items-center justify-center gap-2 rounded-lg border-[0.5px] p-1 pr-3 text-lg",
                  item.sentByMe ? "self-end" : "self-start"
                )}
              >
                <div className="bg-muted border-foreground/10 rounded-lg border-[0.5px] p-2">
                  {item.mentionData?.icon === "yt" ? (
                    <YoutubeIcon className="h-7 w-6" />
                  ) : item.mentionData?.icon === "google" ? (
                    <GoogleIcon className="h-7 w-6" />
                  ) : item.mentionData?.icon === "notion" ? (
                    <NotionIcon className="h-7 w-6" />
                  ) : null}
                </div>
                {item.mentionData?.title}
              </motion.div>
            );
          })}
          <div ref={scrollRef} className="mt-52" />
        </div>

        <motion.div
          initial={false}
          animate={{
            height: mentions.length > 0 ? "125px" : "62px",
            borderRadius: mentions.length > 0 ? "20px" : "29px",
          }}
          className="bg-muted border-foreground/10 absolute bottom-0 flex w-full flex-col justify-between overflow-hidden rounded-3xl border-[0.5px] p-2"
        >
          <motion.div layout className="flex items-center justify-between text-2xl">
            <motion.div
              layoutId={`text-${submitCount}`}
              layout="position"
              className="absolute z-[-1] px-3"
            >
              {value}
            </motion.div>
            <input
              autoFocus
              type="text"
              placeholder="Type @google, @yt, @notion..."
              value={value}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onChange={(e) => {
                const text = e.target.value;
                setMentions(Array.from(text.matchAll(/@(notion|yt|google)/g), (m) => m[1]));
                setValue(text);
              }}
              className="h-10 w-full border-none bg-transparent px-4 text-base outline-none"
            />
          </motion.div>

          <motion.button
            onClick={handleSend}
            initial={false}
            animate={{
              width: mentions.length > 0 ? "35px" : "45px",
              height: mentions.length > 0 ? "35px" : "45px",
            }}
            className="bg-background/75 border-foreground/10 absolute bottom-2 right-2 flex items-center justify-center rounded-full border-[0.5px]"
          >
            <ArrowUp className="size-5" />
          </motion.button>

          {mentions.length > 0 && (
            <div className="relative ml-2 flex h-14 flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {mentions.map((m, idx) => (
                  <motion.div key={`${submitCount}-${idx}`} layoutId={`m-${submitCount + idx + 1}`}>
                    <motion.div
                      initial={{ rotate: "0deg", scale: 0.7 }}
                      animate={{ rotate: idx % 2 === 0 ? "3deg" : "-6deg", scale: 1 }}
                      exit={{ rotate: "0deg", scale: 0.7, opacity: 0 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="backdrop-blur-xs !border-foreground/10 text-foreground/70 bg-foreground/10 absolute left-0 top-0 flex w-fit items-center justify-center gap-2 rounded-lg border-[0.5px] p-1 pr-3 text-sm"
                    >
                      <div className="bg-muted border-foreground/20 rounded-lg border-[0.5px] p-1.5">
                        {m === "yt" ? (
                          <YoutubeIcon className="h-5 w-5" />
                        ) : m === "google" ? (
                          <GoogleIcon className="h-5 w-5" />
                        ) : m === "notion" ? (
                          <NotionIcon className="h-5 w-5" />
                        ) : null}
                      </div>
                      {m === "yt" ? "Youtube Analyzer" : m === "google" ? "Google Search" : m === "notion" ? "Notion" : ""}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <motion.div
            key={`isSubmit-${submitCount}`}
            initial={{ y: "250%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            animate={{ y: "-200%", opacity: 0.2 }}
            className="pointer-events-none absolute left-[-10%] top-0 flex h-10 w-[120%]"
          >
            <GradientBar className="w-full" />
            <GradientBar className="w-full -translate-y-2" />
            <GradientBar className="w-full" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export function DemoSkipper83() {
  return <Skipper83 />;
}

export default Skipper83;
