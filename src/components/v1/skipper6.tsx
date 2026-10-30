"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TeamMember {
  name: string;
  image: string;
}

export const defaultTeamMembers: TeamMember[] = [
  { name: "faffa", image: "/examples/photo-043.jpg" },
  { name: "kaint", image: "/examples/photo-044.jpg" },
  { name: "Att", image: "/examples/photo-045.jpg" },
  { name: "Bamb", image: "/examples/photo-046.jpg" },
  { name: "Sira", image: "/examples/photo-047.jpg" },
  { name: "Koka", image: "/examples/photo-048.jpg" },
  { name: "Pappi", image: "/examples/photo-049.jpg" },
  { name: "Sawad", image: "/examples/photo-050.jpg" },
  { name: "Khatam", image: "/examples/photo-048.jpg" },
];

export interface ProfileCardProps {
  member: TeamMember;
  index: number;
  onHover: (idx: number | null) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ member, index, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="profile-img relative cursor-pointer p-[2.5px] md:p-[5px]"
      style={{ width: isHovered ? 120 : 60, height: isHovered ? 120 : 60 }}
      animate={{ width: isHovered ? 120 : 60, height: isHovered ? 120 : 60 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onHoverStart={() => {
        setIsHovered(true);
        onHover(index);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        onHover(null);
      }}
    >
      <img
        src={member.image}
        alt={member.name}
        className="h-full w-full rounded-lg object-cover shadow-md"
      />
    </motion.div>
  );
};

export interface HoverMemberProps {
  teamMembers?: TeamMember[];
  defaultName?: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  cursorColor?: string;
}

export const HoverMember: React.FC<HoverMemberProps> = ({
  teamMembers = defaultTeamMembers,
  defaultName = "SKIPPER-UI",
  className,
  backgroundColor = "#121212",
  textColor = "text-white",
  hoverTextColor = "text-red-500",
  cursorColor = "bg-red-500",
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const springConfig = { mass: 0.1, damping: 16, stiffness: 71 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const cursorScale = useSpring(0, { mass: 0.1, damping: 10, stiffness: 150 });

  const getDelay = (idx: number, total: number) =>
    0.055 * Math.abs(idx - Math.floor(total / 2));

  const textVariants = {
    hidden: { y: "100%" },
    visible: { y: "0%" },
    exit: { y: "-100%" },
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      className={cn(
        "relative flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center gap-10 overflow-hidden text-white",
        className
      )}
      style={{ backgroundColor }}
    >
      {/* Top Thumbnails Row */}
      <div
        ref={containerRef}
        className="z-40 absolute top-[10%] flex h-[120px] w-max max-w-[90%] flex-wrap items-center justify-center md:max-w-none"
        onPointerMove={(e) => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            cursorX.set(e.clientX - rect.left);
            cursorY.set(e.clientY - rect.top);
          }
        }}
        onPointerEnter={() => cursorScale.set(1)}
        onPointerLeave={() => cursorScale.set(0)}
      >
        {teamMembers.map((member, idx) => (
          <ProfileCard
            key={member.name}
            member={member}
            index={idx}
            onHover={setHoveredIdx}
          />
        ))}

        <motion.div
          style={{ x: cursorX, y: cursorY, scale: cursorScale, transformOrigin: "left top" }}
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-10 flex size-24 items-center justify-center rounded-full opacity-80 backdrop-blur-xs",
            cursorColor
          )}
        />
      </div>

      {/* Massive Center Reveal Text */}
      <div className="relative h-[22vw] w-full overflow-hidden flex items-center justify-center">
        <AnimatePresence>
          {hoveredIdx === null && (
            <motion.div
              key="default"
              className="absolute w-full text-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              <h1
                className={cn(
                  "font-bold select-none whitespace-nowrap text-[22vw] uppercase leading-none tracking-tighter opacity-20",
                  textColor
                )}
              >
                {Array.from(defaultName).map((char, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-block"
                    variants={textVariants}
                    transition={{
                      duration: 0.8,
                      ease: [0.19, 1, 0.22, 1],
                      delay: getDelay(idx, defaultName.length),
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {teamMembers.map((member, idx) => (
          <AnimatePresence key={member.name}>
            {hoveredIdx === idx && (
              <motion.div
                key={member.name}
                className="absolute w-full text-center"
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              >
                <h1
                  className={cn(
                    "font-bold select-none whitespace-nowrap text-[22vw] uppercase leading-none tracking-tighter",
                    hoverTextColor
                  )}
                >
                  {Array.from(member.name).map((char, cIdx) => (
                    <motion.span
                      key={cIdx}
                      className="inline-block"
                      variants={textVariants}
                      transition={{
                        duration: 0.8,
                        ease: [0.19, 1, 0.22, 1],
                        delay: getDelay(cIdx, member.name.length),
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </section>
  );
};

export const Skipper6: React.FC = () => {
  return <HoverMember />;
};

export const DemoSkipper6 = Skipper6;
export default Skipper6;
