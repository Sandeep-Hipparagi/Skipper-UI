"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

export function Tooltip({
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

export function TooltipTrigger({
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipArrowSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="10"
      viewBox="0 0 20 10"
      fill="none"
      className="ml-[1px] mt-[-1px]"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.3356 7.39793L15.1924 3.02682C15.9269 2.36577 16.8801 2 17.8683 2H20V0H0V2H1.4651C2.4532 2 3.4064 2.36577 4.1409 3.02682L8.9977 7.39793C9.378 7.7402 9.9553 7.74021 10.3356 7.39793Z"
        fill="currentColor"
        className="text-background"
      />
      <path
        d="M9.6667 6.65461L14.5235 2.28352C15.4416 1.45721 16.6331 1 17.8683 1H20V2H17.8683C16.8801 2 15.9269 2.36577 15.1924 3.02682L10.3356 7.39793C9.9553 7.74021 9.378 7.7402 8.9977 7.39793L4.1409 3.02682C3.4064 2.36577 2.4532 2 1.4651 2H0V1H1.4651C2.7002 1 3.8917 1.45722 4.8099 2.28352L9.6667 6.65461Z"
        fill="currentColor"
        className="text-border"
      />
    </svg>
  );
}

export function TooltipContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "animate-in bg-background text-foreground outline-border fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 group z-50 w-fit text-balance rounded-md px-3 py-1.5 text-xs outline-1 border shadow-md",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          <span>
            <TooltipArrowSvg />
          </span>
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export function Skipper101() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground p-6">
      <div className="-mt-36 mb-36 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:to-foreground relative max-w-[14ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
          Hover to see border arrow tooltip
        </span>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="rounded-lg border bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted transition-colors">
            Hover Me
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Custom Radix Tooltip with Arrow</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export function DemoSkipper101() {
  return <Skipper101 />;
}

export default Skipper101;
