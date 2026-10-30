"use client";

import React, { useRef, ReactNode } from "react";
import { motion, useSpring, useMotionTemplate } from "framer-motion";
import {
  MessageSquare,
  Inbox,
  Flag,
  CircleDashed,
  Share2,
  Menu,
  Command,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TooltipItem {
  icon: ReactNode;
  label: string;
  labelHasKeyword?: (string | ReactNode)[] | false;
  hasBadge?: boolean;
}

const springConfig = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export interface VercelIconsMenuWithTooltipProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: TooltipItem[];
}

export function VercelIconsMenuWithTooltip({
  items,
  className,
  ...props
}: VercelIconsMenuWithTooltipProps) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = useSpring(0, { stiffness: 350, damping: 30 });
  const clipLeft = useSpring(0, springConfig);
  const clipRight = useSpring(79, springConfig);
  const opacity = useSpring(0, springConfig);

  const handleMouseLeave = () => {
    opacity.set(0);
  };

  const handleMouseEnter = (index: number) => {
    const btnRect = buttonRefs.current[index]?.getBoundingClientRect();
    const textRect = textRefs.current[index]?.getBoundingClientRect();
    const contRect = containerRef.current?.getBoundingClientRect();

    let accumulatedWidth = 0;
    for (let i = 0; i < index; i++) {
      accumulatedWidth += textRefs.current[i]?.getBoundingClientRect().width || 0;
    }

    if (btnRect && contRect && textRect) {
      const btnCenter = btnRect.left + btnRect.width / 2;
      const textWidth = textRect.width;
      const textCenter = (contRect?.left || 0) + accumulatedWidth + textWidth / 2;
      x.set(btnCenter - textCenter);
    }

    let leftW = 0;
    for (let i = 0; i < index; i++) {
      leftW += textRefs.current[i]?.getBoundingClientRect().width || 0;
    }
    let rightW = 0;
    for (let i = index + 1; i < items.length; i++) {
      rightW += textRefs.current[i]?.getBoundingClientRect().width || 0;
    }
    const totalW = textRefs.current.reduce(
      (sum, el) => sum + (el?.getBoundingClientRect().width || 0),
      0
    );

    const leftPercent = totalW > 0 ? (leftW / totalW) * 100 : 20;
    const rightPercent = totalW > 0 ? (rightW / totalW) * 100 : 20;

    clipLeft.set(leftPercent);
    clipRight.set(rightPercent);
    opacity.set(1);
  };

  const clipPathTemplate = useMotionTemplate`inset(0 ${clipRight}% 0 ${clipLeft}% round 10px)`;

  return (
    <div className={cn("relative text-white", className)} {...props}>
      <div ref={containerRef} className="absolute bottom-14 left-0">
        <motion.div
          className="flex bg-black"
          style={{
            opacity,
            x,
            clipPath: clipPathTemplate,
          }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              ref={(el) => {
                if (el) textRefs.current[idx] = el;
              }}
              className="z-1 inline-flex h-8 items-center justify-center"
            >
              <div className="flex items-center justify-center gap-2 whitespace-nowrap px-2 text-sm font-medium leading-tight tracking-tight">
                {item.label}
                {item.labelHasKeyword && (
                  <span className="flex items-center justify-center gap-1">
                    {item.labelHasKeyword.map((key, kIdx) => (
                      <span
                        key={kIdx}
                        className="inline-flex size-5 items-center justify-center rounded-sm border border-white/30 p-0.5 text-xs text-white"
                      >
                        {key}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className={cn(
          "z-10 inline-flex items-center justify-center overflow-hidden p-2",
          "rounded-full bg-black/95 backdrop-blur"
        )}
      >
        {items.map((item, idx) => (
          <button
            key={idx}
            ref={(el) => {
              if (el) buttonRefs.current[idx] = el;
            }}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            className="flex items-center justify-center transition-colors hover:bg-[#121212]"
          >
            <div className="group relative flex size-8 items-center justify-center rounded-full p-1.5 hover:bg-white/15">
              {item.icon}
              {item.hasBadge && (
                <div className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full border-[1.7px] border-black bg-sky-500 text-xs text-white group-hover:border-[#363636]">
                  <span className="sr-only">{item.label}</span>
                </div>
              )}
            </div>
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Skipper43() {
  const items: TooltipItem[] = [
    {
      icon: <MessageSquare className="h-full w-full" />,
      label: "Comment ",
      labelHasKeyword: ["C"],
      hasBadge: false,
    },
    {
      icon: <Inbox className="h-full w-full" />,
      label: "Inbox ",
      labelHasKeyword: false,
      hasBadge: true,
    },
    {
      icon: <Flag className="h-full w-full" />,
      label: "Feature Flags",
      labelHasKeyword: false,
      hasBadge: false,
    },
    {
      icon: <CircleDashed className="h-full w-full" strokeDasharray="3.5" />,
      label: "Draft Mode",
      hasBadge: false,
      labelHasKeyword: false,
    },
    {
      icon: <Share2 className="h-full w-full -rotate-90" />,
      label: "Share ",
      hasBadge: false,
      labelHasKeyword: false,
    },
    {
      icon: <Menu className="h-full w-full" />,
      label: "Menu",
      hasBadge: true,
      labelHasKeyword: [<Command key="cmd" className="size-2.5" />, "K"],
    },
  ];

  return (
    <div className="flex h-full w-screen items-center justify-center bg-[#f5f4f3]">
      <VercelIconsMenuWithTooltip items={items} />
    </div>
  );
}

export { Skipper43 as DemoSkipper43 };
export default Skipper43;
