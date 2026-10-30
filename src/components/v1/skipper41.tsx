"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressiveBlurProps {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
}

export const ProgressiveBlur: React.FC<ProgressiveBlurProps> = ({
  className = "",
  backgroundColor = "#f5f4f3",
  position = "top",
  height = "150px",
  blurAmount = "4px",
}) => {
  const isTop = position === "top";

  return (
    <div
      className={cn("pointer-events-none absolute left-0 w-full select-none z-20", className)}
      style={{
        [isTop ? "top" : "bottom"]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        WebkitMaskImage: isTop
          ? `linear-gradient(to bottom, ${backgroundColor} 50%, transparent)`
          : `linear-gradient(to top, ${backgroundColor} 50%, transparent)`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    />
  );
};

export const Skipper41: React.FC = () => {
  return (
    <div className="relative flex h-full min-h-[600px] w-full flex-col items-center justify-center bg-[#f5f4f3] text-black/60">
      <ProgressiveBlur position="top" backgroundColor="#f5f4f3" />
      <ProgressiveBlur position="bottom" backgroundColor="#f5f4f3" />

      <div className="flex h-[calc(100vh-1rem)] w-full flex-col items-center overflow-y-scroll py-20 px-6">
        <div className="mt-20 grid content-start justify-items-center gap-6 text-center text-black">
          <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
            Scroll down to see the effect
          </span>
        </div>

        <div className="mt-24 w-full max-w-lg space-y-16 text-justify text-sm leading-relaxed">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, reiciendis eum
              vitae nostrum, temporibus repudiandae voluptatibus, natus iure ipsa velit odit quibusdam
              illum. Quaerat cumque laudantium libero reprehenderit perferendis quo nulla voluptate?
              Repellat tenetur labore exercitationem dicta libero voluptate suscipit, iusto ea
              assumenda. Ipsa enim, quidem atque modi error eaque, debitis perferendis, hic iste
              libero dignissimos ea! Quod inventore beatae aspernatur nulla rem perferendis aperiam at
              debitis delectus odit quia animi ex mollitia vero molestias itaque deleniti.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DemoSkipper41 = Skipper41;
export default Skipper41;
