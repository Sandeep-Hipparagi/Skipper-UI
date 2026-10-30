"use client";

import React, { useRef, useState, useEffect, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TermSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface TermItemProps {
  term: TermSection;
  index: number;
  children: ReactNode;
  setActiveTerm: (index: number) => void;
}

function TermItem({ term, index, children, setActiveTerm }: TermItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    margin: "-100px 0px -50% 0px",
  });

  useEffect(() => {
    if (isInView) {
      setActiveTerm(index);
    }
  }, [isInView, index, setActiveTerm]);

  return (
    <div ref={ref} id={term.id} className="space-y-4 md:space-y-6">
      {children}
    </div>
  );
}

const DEFAULT_TERMS: TermSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <>
        <p className="lg:text-lg">
          By accessing and using our website, you agree to be bound by these
          terms and conditions. If you do not agree with these terms, please do
          not use our website.
        </p>
        <p className="lg:text-lg">
          These terms constitute a binding agreement between you and Skipper UI.
          Your continued use of our services indicates your acceptance of any
          updates or modifications to these terms.
        </p>
      </>
    ),
  },
  {
    id: "license-agreement",
    title: "License Agreement",
    content: (
      <>
        <p className="lg:text-lg">
          Skipper UI is licensed, not sold. Upon purchase, you are granted a
          non-exclusive, non-transferable, and revocable license to use the
          Skipper UI components for personal or professional projects.
        </p>
        <ul className="list-disc space-y-2 pl-4 lg:text-lg">
          <li>You may not share, resell, rent, or sublicense the components.</li>
          <li>
            Reverse engineering, decompiling, disassembling, or attempting to
            discover the source code of Skipper UI is strictly prohibited.
          </li>
          <li>
            You may not modify the components or use them to create competing UI
            libraries.
          </li>
          <li>
            Skipper UI must not be used for any illegal, defamatory, or
            unauthorized purposes.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ownership",
    title: "Ownership",
    content: (
      <>
        <p className="lg:text-lg">
          Skipper UI retains all rights, title, and interest in and to the Skipper
          UI components, including all intellectual property rights. This
          license does not grant you any ownership rights.
        </p>
        <p className="lg:text-lg">
          All trademarks, service marks, and trade names used in connection with
          the product are the property of Skipper UI or their respective owners.
        </p>
      </>
    ),
  },
  {
    id: "updates-and-support",
    title: "Updates and Support",
    content: (
      <>
        <p className="lg:text-lg">
          We may provide updates, bug fixes, and new features for Skipper UI at our
          discretion. These updates may be provided automatically or require
          manual installation.
        </p>
        <p className="lg:text-lg">
          Technical support is provided on a best-effort basis through our
          official support channels.
        </p>
      </>
    ),
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    content: (
      <>
        <p className="lg:text-lg">
          All sales are final. We do not offer refunds for digital products
          unless required by applicable law. If you experience technical
          issues, please contact our support team.
        </p>
      </>
    ),
  },
  {
    id: "system-requirements",
    title: "System Requirements",
    content: (
      <>
        <p className="lg:text-lg">
          Skipper UI requires a compatible modern browser and Next.js / React
          environment.
        </p>
        <ul className="list-disc space-y-2 pl-4 lg:text-lg">
          <li>React 18 or React 19</li>
          <li>Next.js 14 or Next.js 15</li>
          <li>Tailwind CSS v3 or v4</li>
          <li>Framer Motion 11+</li>
        </ul>
      </>
    ),
  },
  {
    id: "disclaimer-of-warranties",
    title: "Disclaimer of Warranties",
    content: (
      <>
        <p className="lg:text-lg">
          Skipper UI is provided &quot;as is&quot; without any warranties, express or
          implied. We do not warrant that the components will be error-free or
          meet your specific requirements.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p className="lg:text-lg">
          In no event shall Skipper UI be liable for any indirect, incidental,
          special, consequential, or punitive damages.
        </p>
      </>
    ),
  },
  {
    id: "contact-information",
    title: "Contact Information",
    content: (
      <>
        <p className="lg:text-lg">
          If you have any questions about these terms and conditions, please
          contact us at:
        </p>
        <div className="space-y-2 lg:text-lg">
          <p>Email: support@example.com</p>
          <p>Website: www.skipperui.com</p>
          <p>Address: 123 Music Lane, Audio City, AC 12345</p>
        </div>
      </>
    ),
  },
];

export interface SideScrollNavigationProps {
  title?: string;
  terms?: TermSection[];
  className?: string;
}

export function SideScrollNavigation({
  title = "Terms & Conditions",
  terms = DEFAULT_TERMS,
  className,
}: SideScrollNavigationProps) {
  const [activeTerm, setActiveTerm] = useState(0);

  return (
    <div className={cn("min-h-screen p-4 lg:p-12", className)}>
      <h1 className="font-cal-sans pt-[40px] text-3xl font-bold tracking-tight md:text-5xl lg:pt-0">
        {title}
      </h1>
      <div className="relative mb-[50vh] flex gap-12 py-[40px] md:py-[80px]">
        <ul className="sticky top-24 hidden h-fit w-full max-w-[300px] space-y-4 border-l border-black/10 md:block">
          {terms.map((item, idx) => (
            <li key={item.id} className="relative cursor-pointer pl-3">
              <a href={`#${item.id}`}>
                {activeTerm === idx && (
                  <motion.span
                    layoutId="active-term"
                    className="absolute -left-[1.5px] top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 rounded-2xl bg-black"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <p
                  className={cn(
                    "text-sm font-medium opacity-50 transition-opacity duration-200",
                    activeTerm === idx && "opacity-100 font-semibold"
                  )}
                >
                  {item.title}
                </p>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-1 flex-col gap-[40px] md:gap-[60px]">
          {terms.map((item, idx) => (
            <TermItem
              key={item.id}
              term={item}
              index={idx}
              setActiveTerm={setActiveTerm}
            >
              <h3 className="font-cal-sans text-xl font-bold tracking-tight lg:text-3xl">
                {item.title}
              </h3>
              <div className="space-y-4 opacity-75">{item.content}</div>
            </TermItem>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Skipper60() {
  return (
    <div className="w-full bg-[#f5f4f3] text-black">
      <SideScrollNavigation />
    </div>
  );
}

export { Skipper60 as DemoSkipper60 };
export default Skipper60;
