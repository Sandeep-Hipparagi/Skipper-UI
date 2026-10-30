"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Info,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Globe,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. SideBarIcon
export const SideBarIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <div className="relative grid items-center justify-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.32698 2.63803C0 3.27976 0 4.11984 0 5.8V10.2C0 11.8802 0 12.7202 0.32698 13.362C0.614601 13.9265 1.07354 14.3854 1.63803 14.673C2.27976 15 3.11984 15 4.8 15H11.2C12.8802 15 13.7202 15 14.362 14.673C14.9265 14.3854 15.3854 13.9265 15.673 13.362C16 12.7202 16 11.8802 16 10.2V5.8C16 4.11984 16 3.27976 15.673 2.63803C15.3854 2.07354 14.9265 1.6146 14.362 1.32698C13.7202 1 12.8802 1 11.2 1H4.8C3.11984 1 2.27976 1 1.63803 1.32698C1.07354 1.6146 0.614601 2.07354 0.32698 2.63803Z"
            fill="currentColor"
          />
        </svg>
        <motion.div
          className="bg-background absolute left-[3px] h-[10px] w-[1.5px] rounded-[1px]"
          animate={{ width: open ? "4.5px" : "1.5px" }}
        />
      </div>
    </div>
  );
};

// 2. SourceButton
export const SourceButton: React.FC<{ className?: string }> = ({ className }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      onClick={() => setActive((prev) => !prev)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <motion.path
          d="m18 16 4-4-4-4"
          animate={{ x: active ? 2 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="m6 8-4 4 4 4"
          animate={{ x: active ? -2 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="m14.5 4-5 16"
          animate={{ y: active ? 22 : 0, x: active ? -5 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.path
          d="m14.5 4-5 16"
          animate={{ y: active ? 0 : -22, x: active ? 0 : 5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// 3. LockSourceButton
export const LockSourceButton: React.FC<{ className?: string }> = ({ className }) => {
  const [locked, setLocked] = useState(false);
  return (
    <div
      onClick={() => setLocked((prev) => !prev)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <button style={{ transformStyle: "preserve-3d", perspective: "500px" }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          overflow="visible"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <motion.path
            style={{ originX: 1 }}
            animate={{ rotateY: locked ? 180 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            d="M7 11V7a5 5 0 0 1 10 0v12"
          />
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
};

// 4. InfoButton
export const InfoButton: React.FC<{ className?: string }> = ({ className }) => {
  const [animating, setAnimating] = useState(false);
  const controls = useAnimation();

  const handleClick = async () => {
    if (!animating) {
      setAnimating(true);
      await controls.start({ rotateY: 360, transition: { duration: 1, ease: "easeInOut" } });
      setAnimating(false);
      controls.set({ rotateY: 0 });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "text-foreground bg-foreground/5 group flex h-[30px] w-fit cursor-pointer items-center justify-center gap-2 self-end rounded-xl px-3 text-[13px] font-medium transition-all ease-in-out hover:opacity-60",
        className
      )}
    >
      <motion.span animate={controls}>
        <Info className="size-4" />
      </motion.span>
    </button>
  );
};

// 5. LogoutIcon
export const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => {
  const controls = useAnimation();
  const handleClick = async () => {
    await controls.start({ x: [0, -3, 0], transition: { duration: 0.4, ease: "easeInOut" } });
  };

  return (
    <div
      onClick={handleClick}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <motion.g animate={controls}>
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </motion.g>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      </svg>
    </div>
  );
};

// 6. DollerIcon
export const DollerIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      onClick={() => setFlipped((prev) => !prev)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <motion.svg
        animate={{ rotateY: flipped ? 360 : 0, transition: { duration: 0.7, ease: "easeInOut" } }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </motion.svg>
    </div>
  );
};

// 7. CopyIcon
export const CopyIcon: React.FC<{ className?: string; copyText?: string }> = ({
  className,
  copyText = "copied Hello from skipper ui",
}) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <span
      onClick={handleCopy}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.svg
            key="copied"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="size-4 text-green-500"
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
            className="size-4"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </motion.svg>
        )}
      </AnimatePresence>
    </span>
  );
};

// 8. MusicIcon
export const MusicIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [playing, setPlaying] = useState(false);
  const [bars, setBars] = useState(Array(9).fill(0.1));

  useEffect(() => {
    let req: number;
    if (!playing) {
      setBars(Array(9).fill(0.1));
      return;
    }
    const tick = () => {
      setBars(Array.from({ length: 9 }, () => 0.8 * Math.random() + 0.2));
      req = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(req);
  }, [playing]);

  return (
    <span
      onClick={() => setPlaying((p) => !p)}
      className={cn("flex size-full cursor-pointer items-center justify-center gap-0.5", className)}
      role="button"
      tabIndex={0}
    >
      {bars.map((val, i) => (
        <motion.div
          key={i}
          className="bg-foreground w-[2px] rounded-full"
          animate={{ height: Math.max(3, 26 * val) }}
          transition={{ type: "spring", stiffness: 250, damping: 10 }}
        />
      ))}
    </span>
  );
};

// 9. PlusIcon
export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={cn("relative flex size-full cursor-pointer items-center justify-center", className)}
    >
      <Plus
        className={cn(
          "absolute size-5 transition-all duration-200",
          open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
      <X
        className={cn(
          "absolute size-5 transition-all duration-200",
          open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
        )}
      />
    </div>
  );
};

// 10. HamMenuIcon
export const HamMenuIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [active, setActive] = useState(false);
  return (
    <div
      onClick={() => setActive((prev) => !prev)}
      className={cn("relative flex size-full cursor-pointer items-center justify-center", className)}
    >
      <div className="flex w-4 flex-col items-end justify-end gap-1">
        <span className={cn("bg-foreground h-[1.5px] rounded-full transition-all duration-200", active ? "w-2" : "w-4")} />
        <span className={cn("bg-foreground h-[1.5px] rounded-full transition-all duration-200", active ? "w-4" : "w-2")} />
        <span className={cn("bg-foreground h-[1.5px] rounded-full transition-all duration-200", active ? "w-2" : "w-3")} />
      </div>
    </div>
  );
};

// 11. ChevIcon
export const ChevIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className={cn("relative flex size-full cursor-pointer items-center justify-center", className)}
    >
      <ChevronDown
        className={cn(
          "absolute size-5 transition-all duration-200",
          open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
        )}
      />
      <ChevronUp
        className={cn(
          "absolute size-5 transition-all duration-200",
          open ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
        )}
      />
    </div>
  );
};

// 12. MailIcon
export const MailIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [shaking, setShaking] = useState(false);
  return (
    <motion.div
      onClick={() => setShaking(true)}
      animate={shaking ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onAnimationComplete={() => setShaking(false)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <Mail className="size-4" />
    </motion.div>
  );
};

// 13. WorldIcon
export const WorldIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [paused, setPaused] = useState(true);
  return (
    <div
      onClick={() => setPaused((p) => !p)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <Globe
        className="size-4 animate-spin"
        style={paused ? { animationPlayState: "paused" } : undefined}
      />
    </div>
  );
};

// 14. FileIcon
export const FileIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [active, setActive] = useState(true);
  return (
    <div
      onClick={() => setActive((p) => !p)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="size-4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          animate={{ opacity: active ? 1 : 0, pathLength: active ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
        />
      </svg>
    </div>
  );
};

// 15. TrashIcon
export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen((p) => !p)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
      >
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <motion.g
          animate={{ rotate: open ? 180 : 0, y: open ? 2 : 0, transformOrigin: "right" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </motion.g>
      </svg>
    </div>
  );
};

// 16. SendIcon
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => {
  const controls = useAnimation();
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    if (!animating) {
      setAnimating(true);
      await controls.start({ scale: 0.8, x: 0, transition: { duration: 0.18, ease: "easeInOut" } });
      await new Promise((r) => setTimeout(r, 200));
      await controls.start({ scale: 0.8, x: 100, transition: { duration: 0.28, ease: "easeInOut" } });
      controls.set({ scale: 1, x: -100 });
      await controls.start({ scale: 1, x: 0, transition: { duration: 0.28, ease: "easeInOut" } });
      setAnimating(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn("flex size-full cursor-pointer items-center justify-center overflow-hidden", className)}
    >
      <motion.span animate={controls}>
        <Send className="size-4" />
      </motion.span>
    </div>
  );
};

// 17. SpinnerIcon
export const SpinnerIcon: React.FC<{ color?: string; size?: number; className?: string }> = ({
  color = "currentColor",
  size = 20,
  className,
}) => {
  return (
    <div className={cn("flex size-full cursor-pointer items-center justify-center", className)}>
      <div className="relative flex items-center justify-center" style={{ height: size, width: size }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              animation: "spinner-fade 1.2s linear infinite",
              animationDelay: `${-1.2 + 0.1 * i}s`,
              transform: `rotate(${30 * i}deg) translate(146%)`,
              background: color,
              height: "8%",
              width: "24%",
            }}
          />
        ))}
        <style>{`
          @keyframes spinner-fade {
            0% { opacity: 1; }
            100% { opacity: 0.15; }
          }
        `}</style>
      </div>
    </div>
  );
};

// 18. BellIcon
export const BellIcon: React.FC<{ className?: string }> = ({ className }) => {
  const [ringing, setRinging] = useState(true);
  return (
    <div
      onClick={() => setRinging((r) => !r)}
      className={cn("flex size-full cursor-pointer items-center justify-center", className)}
    >
      <motion.div
        className="relative flex size-5 items-center justify-center"
        animate={{
          rotate: ringing
            ? [0, -15, 5, -2, 0]
            : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0],
        }}
        transition={{ duration: 0.6 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.17969 13.3125H13.5625C14.2969 13.3125 14.7422 12.9375 14.7422 12.3672C14.7422 11.5859 13.9453 10.8828 13.2734 10.1875C12.7578 9.64844 12.6172 8.53906 12.5547 7.64062C12.5 4.64062 11.7031 2.57812 9.625 1.82812C9.32812 0.804688 8.52344 0 7.36719 0C6.21875 0 5.40625 0.804688 5.11719 1.82812C3.03906 2.57812 2.24219 4.64062 2.1875 7.64062C2.125 8.53906 1.98438 9.64844 1.46875 10.1875C0.789062 10.8828 0 11.5859 0 12.3672C0 12.9375 0.4375 13.3125 1.17969 13.3125ZM7.36719 16.4453C8.69531 16.4453 9.66406 15.4766 9.76562 14.3828H4.97656C5.07812 15.4766 6.04688 16.4453 7.36719 16.4453Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export const Skipper42: React.FC = () => {
  return (
    <div className="flex h-full min-h-[600px] w-full flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="grid content-start justify-items-center gap-6 text-center">
        <span className="after:from-background after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:content-['']">
          Try toggling the icons
        </span>
      </div>

      <div className="mt-20 flex w-full max-w-3xl flex-wrap items-center justify-center gap-4 px-5">
        {[
          <SideBarIcon key="1" />,
          <SourceButton key="2" />,
          <LockSourceButton key="3" />,
          <LogoutIcon key="4" />,
          <DollerIcon key="5" />,
          <CopyIcon key="6" />,
          <MusicIcon key="7" />,
          <PlusIcon key="8" />,
          <HamMenuIcon key="9" />,
          <ChevIcon key="10" />,
          <MailIcon key="11" />,
          <WorldIcon key="12" />,
          <FileIcon key="13" />,
          <TrashIcon key="14" />,
          <SendIcon key="15" />,
          <SpinnerIcon key="16" />,
          <BellIcon key="17" />,
        ].map((icon, i) => (
          <div
            key={i}
            className="size-20 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
          >
            {icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export const DemoSkipper42 = Skipper42;
export default Skipper42;
