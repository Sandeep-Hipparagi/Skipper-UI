"use client";

import React, { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldMode = "attract" | "repel";

type FieldNode = {
  id: string;
  symbol: string;
  label: string;
  note: string;
  color: string;
};

const FIELD_NODES: FieldNode[] = [
  { id: "focus", symbol: "◎", label: "Focus", note: "Bring one thought into orbit.", color: "#67e8f9" },
  { id: "flow", symbol: "↗", label: "Flow", note: "Let momentum find its own path.", color: "#a78bfa" },
  { id: "spark", symbol: "✳", label: "Spark", note: "A small signal can shift the whole field.", color: "#f9a8d4" },
  { id: "clarity", symbol: "⌁", label: "Clarity", note: "Make space around what matters.", color: "#86efac" },
  { id: "rhythm", symbol: "◌", label: "Rhythm", note: "Find a pace that feels right.", color: "#fcd34d" },
  { id: "wonder", symbol: "✦", label: "Wonder", note: "Follow the thing you did not expect.", color: "#c4b5fd" },
];

function Orbit({
  nodes,
  selectedId,
  onSelect,
  duration,
  reducedMotion,
  size,
  offsetDegrees = 0,
}: {
  nodes: FieldNode[];
  selectedId: string;
  onSelect: (node: FieldNode) => void;
  duration: number;
  reducedMotion: boolean;
  size: string;
  offsetDegrees?: number;
}) {
  const orbitTransition = {
    duration: reducedMotion ? 0 : duration,
    ease: "linear" as const,
    repeat: reducedMotion ? 0 : Infinity,
  };

  return (
    <motion.div
      aria-hidden="false"
      className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-cyan-200/10"
      style={{ width: size, height: size, x: "-50%", y: "-50%" }}
      animate={reducedMotion ? undefined : { rotate: 360 }}
      transition={orbitTransition}
    >
      {nodes.map((node, index) => {
        const angle = offsetDegrees + (360 / nodes.length) * index;
        const radians = (angle * Math.PI) / 180;
        return (
          <motion.div
            key={node.id}
            className="pointer-events-none absolute"
            style={{
              left: `${50 + Math.sin(radians) * 50}%`,
              top: `${50 - Math.cos(radians) * 50}%`,
              x: "-50%",
              y: "-50%",
            }}
            animate={reducedMotion ? undefined : { rotate: -360 }}
            transition={orbitTransition}
          >
            <motion.button
              type="button"
              aria-label={`${node.label}: ${node.note}`}
              aria-pressed={selectedId === node.id}
              onClick={() => onSelect(node)}
              whileHover={reducedMotion ? undefined : { scale: 1.1, y: -3 }}
              whileTap={reducedMotion ? undefined : { scale: 0.94 }}
              className={cn(
                "pointer-events-auto group flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-lg backdrop-blur-xl transition-colors",
                selectedId === node.id
                  ? "border-cyan-200/50 bg-cyan-200/15 text-white"
                  : "border-white/10 bg-[#111923]/85 text-white/65 hover:border-white/25 hover:text-white"
              )}
              style={{ boxShadow: selectedId === node.id ? `0 0 26px ${node.color}28` : undefined }}
            >
              <span className="text-base leading-none" style={{ color: node.color }} aria-hidden="true">
                {node.symbol}
              </span>
              <span>{node.label}</span>
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function GestureField({ className }: { className?: string }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 115, damping: 19, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 115, damping: 19, mass: 0.7 });
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<FieldMode>("attract");
  const [energy, setEnergy] = useState(56);
  const [selectedNode, setSelectedNode] = useState(FIELD_NODES[0]);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const direction = mode === "attract" ? 1 : -1;
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 34 * direction);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 34 * direction);
  };

  const reset = () => {
    setMode("attract");
    setEnergy(56);
    setSelectedNode(FIELD_NODES[0]);
    pointerX.set(0);
    pointerY.set(0);
  };

  const orbitDuration = 24 - energy * 0.2;

  return (
    <main
      className={cn(
        "relative flex min-h-[760px] w-full flex-col items-center justify-center overflow-hidden bg-[#080d13] px-5 py-12 text-white sm:px-8",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 44%, rgba(8,145,178,.14), transparent 38%), radial-gradient(ellipse at 20% 15%, rgba(124,58,237,.09), transparent 34%)",
        }}
      />

      <header className="relative z-10 mb-7 max-w-xl text-center sm:mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-100/10 bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-100/60">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Skipper 93 · Gesture Field
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Give an idea <span className="text-cyan-200/70">some space.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          A little magnetic universe for exploring motion. Choose a signal, then move through its field.
        </p>
      </header>

      <section
        aria-label="Interactive gesture field"
        onPointerMove={updatePointer}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="relative z-10 flex aspect-square w-[min(88vw,560px)] items-center justify-center rounded-full touch-pan-y"
      >
        <div className="pointer-events-none absolute inset-[9%] rounded-full border border-white/[0.035]" />
        <div className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-cyan-100/[0.08]" />
        <div className="pointer-events-none absolute inset-[28%] rounded-full border border-white/[0.05]" />

        <Orbit
          nodes={FIELD_NODES.slice(0, 3)}
          selectedId={selectedNode.id}
          onSelect={setSelectedNode}
          duration={orbitDuration}
          reducedMotion={Boolean(reducedMotion)}
          size="70%"
        />
        <Orbit
          nodes={FIELD_NODES.slice(3)}
          selectedId={selectedNode.id}
          onSelect={setSelectedNode}
          duration={orbitDuration * 1.35}
          reducedMotion={Boolean(reducedMotion)}
          size="94%"
          offsetDegrees={60}
        />

        <motion.div
          aria-live="polite"
          className="relative z-10 flex size-[42%] flex-col items-center justify-center rounded-full border border-white/10 text-center"
          style={{
            x: springX,
            y: springY,
            background: `radial-gradient(circle at 38% 28%, ${selectedNode.color}30, transparent 62%), linear-gradient(145deg, rgba(19,31,42,.96), rgba(8,13,19,.97))`,
            boxShadow: `0 0 70px ${selectedNode.color}18, inset 0 1px 0 rgba(255,255,255,.08)`,
          }}
        >
          <div className="mb-2 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.045] text-xl" style={{ color: selectedNode.color }} aria-hidden="true">
            {selectedNode.symbol}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">In focus</span>
          <span className="mt-1 text-lg font-medium tracking-tight text-white sm:text-xl">{selectedNode.label}</span>
          <span className="mt-1 max-w-[20ch] px-2 text-[11px] leading-4 text-slate-400">{selectedNode.note}</span>
        </motion.div>
      </section>

      <section aria-label="Field controls" className="relative z-10 mt-7 w-full max-w-xl rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 shadow-2xl backdrop-blur-xl sm:mt-9 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-white/80">Field polarity</p>
            <p className="mt-1 text-[11px] text-slate-500">Move your pointer across the orbit</p>
          </div>
          <div className="inline-flex rounded-xl border border-white/10 bg-black/20 p-1" role="group" aria-label="Field polarity">
            {(["attract", "repel"] as const).map((fieldMode) => (
              <button
                key={fieldMode}
                type="button"
                aria-pressed={mode === fieldMode}
                onClick={() => setMode(fieldMode)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs capitalize transition-colors",
                  mode === fieldMode ? "bg-cyan-100 text-slate-950" : "text-slate-400 hover:text-white"
                )}
              >
                {fieldMode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <label htmlFor="skipper93-energy" className="min-w-24 text-xs text-white/75">Motion energy</label>
          <input
            id="skipper93-energy"
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(event) => setEnergy(Number(event.target.value))}
            className="h-1.5 min-w-0 flex-1 cursor-pointer accent-cyan-200"
          />
          <output htmlFor="skipper93-energy" className="w-10 text-right font-mono text-xs tabular-nums text-cyan-100/70">{energy}%</output>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-white/20 hover:text-white focus-visible:outline-cyan-200"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <p className="relative z-10 mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-slate-600">
        Select an orbiting signal · adjust the field · watch it respond
      </p>
    </main>
  );
}

export function Skipper93() {
  return <GestureField />;
}

export function DemoSkipper93() {
  return <Skipper93 />;
}

export default Skipper93;
