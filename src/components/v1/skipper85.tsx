"use client";

import React, { useState, useRef, useLayoutEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const TextShimmer = memo(function TextShimmer({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}) {
  const MotionComponent = motion.create(Component);
  const spreadWidth = useMemo(() => children.length * spread, [children, spread]);

  return (
    <MotionComponent
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
    </MotionComponent>
  );
});

export function Skipper85() {
  const [input, setInput] = useState("");
  const footerRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<
    { id: number; message: string; isFromUser: boolean }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const msgRefs = useRef<HTMLDivElement[]>([]);
  const [pendingAnswer, setPendingAnswer] = useState(false);
  const [turn, setTurn] = useState(0);
  const springY = useSpring(0);
  const [deepThinking, setDeepThinking] = useState(false);

  const handleSubmit = async () => {
    if (isThinking) {
      setIsThinking(false);
      return;
    }
    if (input.trim() === "") return;

    setIsThinking(true);
    const text = input;
    setInput("");
    setTurn((t) => (t === 0 ? t + 1 : t + 2));

    const userMsg = { id: messages.length + 1, message: text, isFromUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setPendingAnswer(true);

    await new Promise((res) => setTimeout(res, 1500));
    const aiMsg = { id: messages.length + 2, message: "I dunnoo 😭", isFromUser: false };
    setMessages((prev) => [...prev, aiMsg]);
    setPendingAnswer(false);
    setIsThinking(false);
  };

  useLayoutEffect(() => {
    const len = messages.length;
    const offset =
      len > 0
        ? window.innerHeight -
          (msgRefs.current[len - 1]?.clientHeight || 0) -
          (footerRef.current?.clientHeight || 0) -
          20
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
      <div className="no-scroll flex h-screen max-w-3xl flex-1 flex-col overflow-scroll scroll-smooth px-3 py-6 pb-40">
        {messages.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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

        {pendingAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-muted/50 my-2 w-fit max-w-xs self-start rounded-2xl px-4 py-2"
          >
            <TextShimmer className="text-sm font-medium">Thinking...</TextShimmer>
          </motion.div>
        )}

        <motion.div ref={scrollRef} style={{ marginTop: springY }} />
      </div>

      <div ref={footerRef} className="rounded-t-4xl fixed bottom-2 w-full max-w-3xl gap-1 px-3 pb-3">
        <div className="bg-muted rounded-2xl border dark:!border-[#181818] shadow-lg">
          <div className="bg-background outline-border relative rounded-2xl outline dark:!outline-[#181818]">
            <div className="relative">
              <textarea
                value={input}
                autoFocus
                placeholder=""
                rows={1}
                className="field-sizing-content pr-14 max-h-52 w-full resize-none rounded-none border-none !bg-transparent p-4 !text-base leading-[1.2] shadow-none outline-none focus-visible:outline-none focus-visible:ring-0 md:text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => setInput(e.target.value)}
              />
              {!input && (
                <div className="pointer-events-none absolute left-0 top-0 h-full w-full p-4">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={deepThinking ? "search" : "ask"}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.1 }}
                      className="text-foreground/30 pointer-events-none absolute text-sm"
                    >
                      {deepThinking ? "Type Shit.." : "Ask anything..."}
                    </motion.p>
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="hover:bg-muted hover:border-border absolute right-2 top-2 flex size-10 items-center justify-center rounded-xl border border-transparent p-2 transition-colors"
            >
              {isThinking ? (
                <div className="size-3.5 rounded-[4px] bg-current" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </button>
          </div>

          <div className="flex h-10 items-center justify-between px-2">
            <button
              type="button"
              onClick={() => setDeepThinking(!deepThinking)}
              className={cn(
                "text-muted-foreground hover:bg-background/50 hover:text-foreground flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-100 active:scale-95",
                deepThinking && "text-foreground"
              )}
            >
              <Sparkles className="size-4" />
              {deepThinking ? (
                <TextShimmer className="text-xs font-medium">Deep Thinking Now</TextShimmer>
              ) : (
                <span className="text-xs font-medium">Try Deep Thinking</span>
              )}
            </button>

            <p className="text-muted-foreground/50 pr-2 text-xs">AGI is here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DemoSkipper85() {
  return <Skipper85 />;
}

export default Skipper85;
