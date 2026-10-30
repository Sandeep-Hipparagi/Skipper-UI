"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LinkProps {
  children: ReactNode;
  href: string;
  className?: string;
  target?: string;
}

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn(
      "size-[0.55em] transition-all duration-300 motion-reduce:transition-none",
      className
    )}
    fill="none"
    viewBox="0 0 10 10"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Link000: React.FC<LinkProps> = ({ children, href, className }) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-left hover:before:scale-x-100",
        className
      )}
    >
      {children}
    </Link>
  );
};

export const Link001: React.FC<LinkProps> = ({ children, href, className, target = "_blank" }) => {
  return (
    <a
      href={href}
      target={target}
      className={cn(
        "group relative flex items-center before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-left hover:before:scale-x-100",
        className
      )}
    >
      {children}
      <ArrowIcon className="ml-[0.3em] translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" />
    </a>
  );
};

export const Link002: React.FC<LinkProps> = ({ children, href, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-right hover:before:scale-x-100",
        className
      )}
    >
      {children}
      <ArrowIcon className="ml-[0.3em] translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" />
    </a>
  );
};

export const Link003: React.FC<LinkProps> = ({ children, href, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center before:pointer-events-none before:absolute before:left-0 before:top-[1.5em] before:h-[0.05em] before:w-full before:bg-current before:content-[''] before:origin-center before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:scale-x-100",
        className
      )}
    >
      {children}
      <ArrowIcon className="ml-[0.3em] translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" />
    </a>
  );
};

export const Link004: React.FC<LinkProps> = ({ children, href, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center px-2 before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-0 before:w-full before:bg-white before:content-[''] before:origin-center before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:mix-blend-difference hover:before:h-[1.4em]",
        className
      )}
    >
      {children}
      <ArrowIcon className="ml-[0.6em] translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100" />
    </a>
  );
};

export const Link005: React.FC<LinkProps> = ({ children, href, className }) => {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex items-center px-2 before:pointer-events-none before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-white before:content-[''] before:origin-left before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:mix-blend-difference hover:before:scale-x-100",
        className
      )}
    >
      {children}
      <ArrowIcon className="ml-[0.6em] -translate-x-1 rotate-45 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
    </a>
  );
};

export const Skipper40: React.FC = () => {
  return (
    <section className="h-full min-h-[600px] w-full snap-y snap-mandatory overflow-y-scroll bg-background text-foreground flex items-center justify-center">
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 text-2xl font-bold tracking-tight">
        <Link001 href="mailto:hi@skipper-ui.com">hi@skipper-ui.com (Underline Right-Left)</Link001>
        <Link002 href="mailto:hi@skipper-ui.com">hi@skipper-ui.com (Underline Left-Right)</Link002>
        <Link003 href="mailto:hi@skipper-ui.com">hi@skipper-ui.com (Underline Center)</Link003>
        <Link004 href="mailto:hi@skipper-ui.com">hi@skipper-ui.com (Height Fill Difference)</Link004>
        <Link005 href="mailto:hi@skipper-ui.com">hi@skipper-ui.com (Width Slide Difference)</Link005>
      </div>
    </section>
  );
};

export const DemoSkipper40 = Skipper40;
export default Skipper40;
