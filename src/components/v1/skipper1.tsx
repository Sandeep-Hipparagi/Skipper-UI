"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useDragControls,
} from "framer-motion";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

export interface SectionItem {
  title: string;
  code: string;
  showCard: boolean;
}

export const sections: SectionItem[] = [
  { title: "Who we are", code: 'const home = "Welcome";', showCard: false },
  { title: "What we do", code: 'const about = "Our Story";', showCard: true },
  { title: "How we do it", code: 'const services = ["Web", "Mobile"];', showCard: true },
  { title: "Our projects", code: "const portfolio = projects.map();", showCard: true },
  { title: "Our team", code: "const team = members.join();", showCard: true },
  { title: "Pricing", code: "const pricing = plans.reduce();", showCard: true },
  { title: "FAQ", code: "const faq = questions.find();", showCard: true },
  { title: "Support", code: 'const support = "24/7 Help";', showCard: true },
  { title: "Downloads", code: "const downloads = files.sort();", showCard: true },
  { title: "No card for this section", code: "const gallery = images.slice();", showCard: false },
  { title: "No card for this section too", code: "const gallery = images.slice();", showCard: false },
  { title: "Gallery", code: "const gallery = images.slice();", showCard: true },
  { title: "Events", code: "const events = calendar.filter();", showCard: true },
  { title: "News", code: "const news = articles.reverse();", showCard: true },
  { title: "Partners", code: "const partners = companies.map();", showCard: true },
  { title: "Careers", code: "const careers = jobs.available();", showCard: true },
  { title: "Resources", code: "const resources = docs.search();", showCard: true },
  { title: "Reviews", code: "const reviews = feedback.all();", showCard: true },
  { title: "Legal", code: "const legal = terms.privacy();", showCard: true },
  { title: "Footer", code: 'const footer = "Thank you";', showCard: true },
];

export interface ScrollBarCardProps {
  section: SectionItem;
}

export const ScrollBarCard: React.FC<ScrollBarCardProps> = ({ section }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(section.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="bg-background mb-2 flex w-full rounded-xl p-4 shadow-sm border border-border">
      <div className="flex-1">
        <div className="mb-2 text-xs text-[#585858] opacity-60">
          // {section.title}
        </div>
        <pre className="text-sm font-mono">
          <code className="text-sm">
            <span className="text-[#FF4B4B]">{section.code.split("=")[0]}</span>
            {section.code.includes("=") && `=${section.code.split("=")[1]}`}
          </code>
        </pre>
      </div>
      <span onClick={handleCopy} className="absolute right-4 top-4 cursor-pointer">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.svg
              key="copied"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="size-3 text-[#FF4B4B]"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: 1, pathOffset: 0 }}
                d="M20 6 9 17l-5-5"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="copy"
              exit={{ scale: 0 }}
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ duration: 0.1, ease: "easeInOut" }}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3 opacity-50 transition group-hover:opacity-100"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
};

export interface ScrollBarProps {
  activeSection: number;
  showScrollCard: boolean;
}

export const ScrollBar: React.FC<ScrollBarProps> = ({
  activeSection,
  showScrollCard,
}) => {
  const { scrollYProgress } = useScroll();
  const [measureRef, bounds] = useMeasure();
  const progressTransform = useTransform(scrollYProgress, [0, 1], [0, bounds.width - 1.5]);
  const [isDragging, setIsDragging] = useState(false);
  // FIX: Use useMotionValue for hoverX to eliminate component re-renders during high-frequency mousemove
  const hoverX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const dragX = useMotionValue(0);

  useEffect(() => {
    if (!isDragging) {
      const unsubscribe = progressTransform.on("change", (latest) => dragX.set(latest));
      return () => unsubscribe();
    }
  }, [isDragging, progressTransform, dragX]);

  const tickMarks = useMemo(
    () =>
      [...Array(40)].map((_, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0.2, filter: "blur(1px)" }}
          animate={{
            opacity: idx % 5 === 0 ? 1 : 0.2,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 0.2,
            delay: idx % 5 === 0 ? (idx / 5) * 0.05 : 0,
            ease: "easeOut",
          }}
          className={cn("bg-foreground w-[1px]", "h-[15px]")}
        />
      )),
    []
  );

  return (
    <div className="fixed bottom-5 right-1/2 translate-x-1/2 flex-col overflow-hidden rounded-2xl sm:right-5 sm:translate-x-0 z-50">
      <AnimatePresence mode="popLayout">
        {showScrollCard && (
          <motion.div
            key={activeSection}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.5, bounce: 0, type: "spring" }}
          >
            <ScrollBarCard section={sections[activeSection]} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="bg-background border border-border cursor-grab rounded-xl px-5 will-change-transform shadow-lg">
        <div ref={measureRef}>
          <div
            className="relative flex h-[40px] items-center justify-center gap-1.5 overflow-hidden rounded-xl"
            ref={containerRef}
            onClick={(e) => {
              if (!containerRef.current || isDragging) return;
              const ratio = Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width));
              const scrollableDist = document.documentElement.scrollHeight - window.innerHeight;
              window.scrollTo({ top: scrollableDist * ratio, behavior: "instant" });
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={(e) => {
              if (isDragging) return hoverX.set(-20);
              if (containerRef.current) {
                hoverX.set(Math.max(0, Math.min(e.clientX - bounds.left, bounds.width - 6)));
              }
            }}
          >
            {tickMarks}

            <AnimatePresence mode="popLayout">
              {isHovered && !isDragging && (
                <motion.div
                  className="absolute h-[24px] w-1.5 cursor-grab rounded-full bg-[#FF4B4B] opacity-30 pointer-events-none"
                  style={{ x: hoverX, willChange: "transform" }}
                  transition={{ type: "tween", duration: 0 }}
                />
              )}
            </AnimatePresence>

            <motion.div
              layout
              drag="x"
              dragControls={dragControls}
              dragConstraints={containerRef}
              dragElastic={0}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDrag={(e, info) => {
                e.preventDefault();
                if (!containerRef.current) return;
                const totalWidth = bounds.width;
                const currentX = Math.max(0, Math.min(info.point.x - bounds.left, totalWidth));
                const ratio = currentX / totalWidth;
                dragX.set(currentX);
                const scrollableDist = document.documentElement.scrollHeight - window.innerHeight;
                window.scrollTo({ top: scrollableDist * ratio, behavior: "instant" });
              }}
              onDragEnd={() => setIsDragging(false)}
              className="absolute left-0 h-[24px] w-1.5 cursor-grab rounded-full bg-[#FF4B4B] active:cursor-grabbing"
              style={{ x: dragX }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export interface ContentProps {
  setActiveSection: (idx: number) => void;
  setShowScrollCard: (show: boolean) => void;
}

export const Content: React.FC<ContentProps> = ({
  setActiveSection,
  setShowScrollCard,
}) => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) {
              setActiveSection(idx);
              const section = sections[idx];
              setShowScrollCard(section?.showCard || false);
            }
          }
        });
      },
      {
        threshold: window.innerWidth < 768 ? 0.1 : 0.2,
        rootMargin: window.innerWidth < 768 ? "-10% 0px -10% 0px" : "-20% 0px -20% 0px",
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      // FIX: Explicitly disconnect IntersectionObserver to ensure complete resource cleanup
      observer.disconnect();
      sectionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [setActiveSection, setShowScrollCard]);

  return (
    <div className="lg:py-12">
      {sections.map((section, idx) => (
        <div
          key={idx}
          ref={(el) => {
            sectionRefs.current[idx] = el;
          }}
          className="text-foreground flex h-full w-full items-center justify-center px-5 sm:px-10"
        >
          <div className="max-w-xl py-12 text-justify lg:py-20">
            <h2 className="text-foreground/40 mb-2 text-2xl font-bold tracking-tight">
              #{idx + 1} {section.title || `Section ${idx + 1}`}
            </h2>
            <p className="opacity-60 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Totam, quos! Fugiat
              earum maiores nostrum dolores ipsum maxime aut vitae atque tempora non rem
              eveniet, tempore sed obcaecati iure minima rerum consequuntur officiis dolorum
              corporis. Reiciendis nesciunt dolor neque quibusdam. Rem, voluptatum quam
              necessitatibus molestias vel qui quidem nihil, atque ad, magni voluptate.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Skipper1: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollCard, setShowScrollCard] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Content
        setActiveSection={setActiveSection}
        setShowScrollCard={setShowScrollCard}
      />
      <ScrollBar
        activeSection={activeSection}
        showScrollCard={showScrollCard}
      />
    </div>
  );
};

export const DemoSkipper1 = Skipper1;
export default Skipper1;
