"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useReducer,
  useEffect,
  Children,
  isValidElement,
} from "react";
import { motion, useSpring, useTransform, type MotionValue, type Transition } from "framer-motion";
import { MessageSquare, Share2, Menu, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface VtooltipContextType {
  IconRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  ToolTipRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
  ToolTipParentRef: React.RefObject<HTMLDivElement | null>;
  // FIX: Strongly type motion values in context type
  tooltipPosition: MotionValue<number>;
  clipPathTop: MotionValue<number>;
  clipPathBottom: MotionValue<number>;
  opacity: MotionValue<number>;
  calculateClipPath: (index: number | null) => void;
  onMouseEnterOnIcon: (e: React.MouseEvent, index: number) => void;
  onMouseLeave: () => void;
  setIconRef: (index: number, el: HTMLButtonElement | null) => void;
  setTooltipRef: (index: number, el: HTMLDivElement | null) => void;
  registerContent: (index: number, content: React.ReactNode) => void;
  side: "left" | "right" | "top" | "bottom";
  itemsCountRef: React.MutableRefObject<number>;
}

const VtooltipContext = createContext<VtooltipContextType | null>(null);

function useVtooltip() {
  const ctx = useContext(VtooltipContext);
  if (!ctx) throw new Error("Vtooltip components must be used within VtooltipRoot");
  return ctx;
}

export function VtooltipRoot({
  springConfig = { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  children,
  className,
  side = "right",
}: {
  // FIX: Strongly type springConfig with Transition
  springConfig?: Transition;
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
}) {
  const IconRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ToolTipRef = useRef<(HTMLDivElement | null)[]>([]);
  const ToolTipParentRef = useRef<HTMLDivElement>(null);
  const itemsCountRef = useRef(0);
  const contentMapRef = useRef(new Map<number, React.ReactNode>());
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const tooltipPosition = useSpring(0, { stiffness: 350, damping: 30 });
  const clipPathTop = useSpring(0, springConfig);
  const clipPathBottom = useSpring(79, springConfig);
  const opacity = useSpring(0, { stiffness: 300, damping: 30, mass: 0.8 });

  const calculateClipPath = useCallback(
    (index: number | null) => {
      if (index === null) {
        clipPathTop.set(0);
        clipPathBottom.set(0);
        opacity.set(0);
        return;
      }
      if (side === "left" || side === "right") {
        let beforeHeight = 0;
        for (let i = 0; i < index; i++) {
          beforeHeight += ToolTipRef.current[i]?.getBoundingClientRect().height || 0;
        }
        let afterHeight = 0;
        for (let i = index + 1; i < itemsCountRef.current; i++) {
          afterHeight += ToolTipRef.current[i]?.getBoundingClientRect().height || 0;
        }
        const totalHeight = ToolTipRef.current.reduce(
          (acc, el) => acc + (el?.getBoundingClientRect().height || 0),
          0
        );
        const topPct = totalHeight > 0 ? (beforeHeight / totalHeight) * 100 : 20;
        const btmPct = totalHeight > 0 ? (afterHeight / totalHeight) * 100 : 20;
        clipPathTop.set(topPct);
        clipPathBottom.set(btmPct);
      }
      opacity.set(1);
    },
    [clipPathTop, clipPathBottom, opacity, side]
  );

  const setIconRef = useCallback((index: number, el: HTMLButtonElement | null) => {
    if (el) IconRefs.current[index] = el;
  }, []);

  const setTooltipRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) ToolTipRef.current[index] = el;
  }, []);

  const registerContent = useCallback((index: number, content: React.ReactNode) => {
    if (contentMapRef.current.get(index) !== content) {
      contentMapRef.current.set(index, content);
      itemsCountRef.current = contentMapRef.current.size;
      forceUpdate();
    }
  }, []);

  const handleMouseEnterOnIcon = useCallback(
    (_e: React.MouseEvent, index: number) => {
      const iconRect = IconRefs.current[index]?.getBoundingClientRect();
      const tooltipRect = ToolTipRef.current[index]?.getBoundingClientRect();
      const parentRect = ToolTipParentRef.current?.getBoundingClientRect();

      if (iconRect && parentRect && tooltipRect) {
        let offsetBefore = 0;
        for (let i = 0; i < index; i++) {
          offsetBefore += ToolTipRef.current[i]?.getBoundingClientRect().height || 0;
        }
        const iconCenter = iconRect.top + iconRect.height / 2;
        const targetCenter = parentRect.top + offsetBefore + tooltipRect.height / 2;
        tooltipPosition.set(iconCenter - targetCenter);
      }
      calculateClipPath(index);
    },
    [calculateClipPath, tooltipPosition]
  );

  const handleMouseLeave = useCallback(() => {
    opacity.set(0);
  }, [opacity]);

  const sortedContents = Array.from(contentMapRef.current.entries()).sort(
    ([a], [b]) => a - b
  );

  const clipPathString = useTransform(
    [clipPathTop, clipPathBottom],
    ([top, btm]) => `inset(${top}% 0 ${btm}% 0 round 10px)`
  );

  return (
    <VtooltipContext.Provider
      value={{
        IconRefs,
        ToolTipRef,
        ToolTipParentRef,
        tooltipPosition,
        clipPathTop,
        clipPathBottom,
        opacity,
        calculateClipPath,
        onMouseEnterOnIcon: handleMouseEnterOnIcon,
        onMouseLeave: handleMouseLeave,
        setIconRef,
        setTooltipRef,
        registerContent,
        side,
        itemsCountRef,
      }}
    >
      <div className="relative text-white">
        <div
          ref={ToolTipParentRef}
          className={cn(
            "pointer-events-none absolute z-20",
            side === "right" && "left-14 top-0",
            side === "left" && "right-14 top-0"
          )}
        >
          <motion.div
            className={cn("flex flex-col bg-black rounded-xl shadow-xl", className)}
            style={{
              opacity,
              y: tooltipPosition,
              clipPath: clipPathString,
            }}
          >
            {sortedContents.map(([idx, contentNode]) => (
              <div
                key={idx}
                ref={(el) => setTooltipRef(idx, el)}
                className="inline-flex h-8 items-center justify-center"
              >
                {contentNode}
              </div>
            ))}
          </motion.div>
        </div>
        {children}
      </div>
    </VtooltipContext.Provider>
  );
}

export function VtooltipTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function VtooltipContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function VtooltipItem({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  const { registerContent, onMouseEnterOnIcon, onMouseLeave, setIconRef } = useVtooltip();
  const prevContentRef = useRef<React.ReactNode>(null);

  useEffect(() => {
    const array = Children.toArray(children);
    let foundContent: React.ReactNode = null;
    Children.forEach(array, (child) => {
      // FIX: Use typed element inspection to avoid any casts
      if (isValidElement<{ children?: React.ReactNode }>(child) && child.type === VtooltipContent) {
        foundContent = child.props.children;
      }
    });
    if (foundContent && prevContentRef.current !== foundContent) {
      prevContentRef.current = foundContent;
      registerContent(index, foundContent);
    }
  }, [children, index, registerContent]);

  return (
    <div className={className}>
      {Children.map(children, (child) => {
        // FIX: Strongly type child element props
        if (isValidElement<{ children?: React.ReactNode }>(child) && child.type === VtooltipTrigger) {
          return (
            <button
              ref={(el) => setIconRef(index, el)}
              onMouseEnter={(e) => onMouseEnterOnIcon(e, index)}
              onMouseLeave={onMouseLeave}
              className="flex items-center justify-center transition-colors hover:bg-white/10 rounded-full"
            >
              {child.props.children}
            </button>
          );
        }
        return null;
      })}
    </div>
  );
}

export function Skipper98() {
  const items = [
    {
      icon: <MessageSquare className="size-5" />,
      label: "Comment",
      labelHasKeyword: ["C"],
      hasBadge: false,
    },
    {
      icon: <Share2 className="size-5" />,
      label: "Share",
      hasBadge: false,
      labelHasKeyword: false,
    },
    {
      icon: <Menu className="size-5" />,
      label: "Menu",
      hasBadge: true,
      labelHasKeyword: [<Command key="cmd" className="size-2.5" />, "K"],
    },
  ];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f4f3] p-10">
      <VtooltipRoot
        side="left"
        springConfig={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
      >
        <div className="z-10 inline-flex flex-col items-center justify-center gap-2 overflow-hidden rounded-full bg-black p-2 shadow-2xl backdrop-blur">
          {items.map((item, idx) => (
            <VtooltipItem key={idx} index={idx}>
              <VtooltipTrigger>
                <div className="group relative flex size-10 items-center justify-center rounded-full p-2 hover:bg-white/15">
                  {item.icon}
                  {item.hasBadge && (
                    <div className="absolute right-2 top-2 flex size-2 items-center justify-center rounded-full border border-black bg-sky-500" />
                  )}
                </div>
              </VtooltipTrigger>
              <VtooltipContent>
                <div className="flex items-center justify-center gap-2 whitespace-nowrap px-3 text-sm font-medium leading-tight text-white">
                  {item.label}
                  {Array.isArray(item.labelHasKeyword) && (
                    <span className="flex items-center gap-1">
                      {item.labelHasKeyword.map((key, kIdx) => (
                        <span
                          key={kIdx}
                          className="inline-flex size-5 items-center justify-center rounded border border-white/30 text-[10px] text-white"
                        >
                          {key}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </VtooltipContent>
            </VtooltipItem>
          ))}
        </div>
      </VtooltipRoot>
    </div>
  );
}

export function DemoSkipper98() {
  return <Skipper98 />;
}

export default Skipper98;
