"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Play,
  X,
  LayoutGrid,
  List,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Maximize2,
  Dice5,
  ArrowRight,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import sideBySideList from "@/lib/side-by-side-data.json";
import { componentRegistry } from "@/lib/registry";
import { ThemeToggleButton1, DemoSkipper4 } from "@/components/v1/skipper4";
import { DemoSkipper25 } from "@/components/v1/skipper25";
import { DemoSkipper42 } from "@/components/v1/skipper42";

// Types
export interface ComponentRecord {
  id: string;
  number: number;
  title: string;
  collection: string;
  tier: string;
  description: string;
  localSpecUrl: string;
  localPreviewUrl: string;
  status: string;
  statusLabel: string;
  lineCount: number;
  dependencies: string[];
  springDetails: string;
  techStack: string[];
  hooks: string[];
  cleanups: number;
}

// Mouse-tracking glow card inspired by skipper90 with champagne cursor tint
function InteractiveGlowCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; opacity: number }>({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleMouseLeave = () => {
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg",
        className
      )}
    >
      {/* Radial Cursor Glow */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: coords.opacity,
          background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(242, 234, 218, 0.08), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

export default function RegistryDashboard() {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [selectedDep, setSelectedDep] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"id" | "lines">("id");
  const [viewMode, setViewMode] = useState<"cards" | "compact" | "table">("cards");
  const { isDark, toggleTheme } = useTheme();
  const [activeModalSlug, setActiveModalSlug] = useState<string | null>(null);
  const [modalViewport, setModalViewport] = useState<"full" | "desktop" | "tablet" | "mobile">("full");
  const [modalMountKey, setModalMountKey] = useState(0);
  const [featuredDemo, setFeaturedDemo] = useState<"equalizer" | "switch" | "icons">("equalizer");
  const [copyCommandLabel, setCopyCommandLabel] = useState("Copy CLI Command");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const components = sideBySideList as ComponentRecord[];

  // Global keyboard shortcuts (Cmd+K or '/' to focus search, ESC to close modal, Arrow keys to navigate modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && !activeModalSlug) {
        if (document.activeElement !== searchInputRef.current) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === "Escape" && activeModalSlug) {
        setActiveModalSlug(null);
      } else if (activeModalSlug) {
        const validComps = components.filter((c) => c.status !== "reserved");
        const idx = validComps.findIndex((c) => c.id === activeModalSlug);
        if (e.key === "ArrowLeft" && idx > 0) {
          setActiveModalSlug(validComps[idx - 1].id);
          setModalMountKey((k) => k + 1);
        } else if (e.key === "ArrowRight" && idx < validComps.length - 1) {
          setActiveModalSlug(validComps[idx + 1].id);
          setModalMountKey((k) => k + 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalSlug, components]);

  // Collections list with counts
  const collectionCounts = useMemo(() => {
    const map = new Map<string, number>();
    components.forEach((c) => {
      if (c.collection && c.collection !== "N/A") {
        map.set(c.collection, (map.get(c.collection) || 0) + 1);
      }
    });
    return map;
  }, [components]);

  const collections = useMemo(() => {
    return ["all", ...Array.from(collectionCounts.keys()).sort()];
  }, [collectionCounts]);

  // Dependencies list
  const dependencies = useMemo(() => {
    const set = new Set<string>();
    components.forEach((c) => {
      c.dependencies?.forEach((d) => set.add(d));
    });
    return ["all", ...Array.from(set).sort()];
  }, [components]);

  // Filtered & Sorted
  const filteredComponents = useMemo(() => {
    return components
      .filter((c) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.dependencies?.some((d) => d.toLowerCase().includes(q));

        const matchesCollection =
          selectedCollection === "all" || c.collection === selectedCollection;

        const matchesDep =
          selectedDep === "all" || c.dependencies?.includes(selectedDep);

        return matchesSearch && matchesCollection && matchesDep;
      })
      .sort((a, b) => {
        if (sortBy === "id") return a.number - b.number;
        if (sortBy === "lines") return b.lineCount - a.lineCount;
        return 0;
      });
  }, [components, search, selectedCollection, selectedDep, sortBy]);

  // Active modal component
  const ActiveComponent = activeModalSlug ? componentRegistry[activeModalSlug]?.component : null;
  const activeRecord = activeModalSlug ? components.find((c) => c.id === activeModalSlug) : null;
  const validComps = useMemo(() => components.filter((c) => c.status !== "reserved"), [components]);
  const activeModalIndex = activeModalSlug ? validComps.findIndex((c) => c.id === activeModalSlug) : -1;
  const prevModalComp = activeModalIndex > 0 ? validComps[activeModalIndex - 1] : null;
  const nextModalComp = activeModalIndex < validComps.length - 1 ? validComps[activeModalIndex + 1] : null;

  // Launch random component
  const handleRandomTest = () => {
    const randomComp = validComps[Math.floor(Math.random() * validComps.length)];
    if (randomComp) {
      setActiveModalSlug(randomComp.id);
      setModalMountKey((k) => k + 1);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-toolbar");
    el?.scrollIntoView({ behavior: "smooth" });
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-3">
            <img src="/dot-logo.svg" alt="SKIPPER UI FOR FREE" width="152" height="36" className="h-9 w-[152px] object-contain object-left" />
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground leading-tight">
                Skipper UI
              </h1>
              <p className="text-[11px] text-muted-foreground">
                106 Verified + 1 Original · 107 Catalog Slots
              </p>
            </div>
          </div>

          {/* Right Navigation - Pinned on top right corner */}
          <div className="flex items-center gap-2.5 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              107 Live · 106 Verified · 1 Original
            </span>

            {/* Theme Toggle from skipper4 */}
            <div className="flex items-center rounded-xl border border-border bg-card/60 p-1 shadow-2xs">
              <ThemeToggleButton1
                className="size-7"
                isDark={isDark}
                onToggle={toggleTheme}
              />
            </div>
          </div>
        </div>
      </header>

      {/* EDITORIAL HERO SECTION (Structured Asymmetric 12-Column Grid adhering strictly to SKILL.md) */}
      <section className="relative w-full max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center border-b">
        {/* Left 7 Columns: Typographic Hierarchy & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="uppercase tracking-widest text-[10px]">Production Suite by Sandeep · 106 Reconstructed + 1 Original Primitive</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.08]">
            Engineered for rapid motion & tactile UI composition.
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Explore 106 reconstructed motion primitives and one original interactive design primitive, built with React 19, Next.js 15, and Framer Motion. Every primitive is free to use.
          </p>

          {/* Structured Action CTAs (non-slop padding & hover states) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={scrollToCatalog}
              className="bg-foreground text-background text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="size-4" />
            </button>

            <button
              onClick={handleRandomTest}
              className="border border-border bg-card text-foreground text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-all flex items-center gap-2 shadow-2xs"
            >
              <Dice5 className="size-4 text-primary" />
              <span>Launch Random Test</span>
            </button>
          </div>

          {/* Architecture Badges */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-muted-foreground border-t">
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>React 19 & Next.js 15 App Router</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-sky-500" />
              <span>Tailwind CSS & Framer Motion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-purple-500" />
              <span>Full SSR & Zero Hydration Drift</span>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Interactive Dogfooding Sandbox */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border bg-card p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            {/* Header with Switcher Tabs */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Live Showcase Primitives
                </span>
              </div>

              {/* Showcase selector */}
              <div className="flex items-center rounded-lg border bg-background/60 p-0.5 text-xs">
                <button
                  onClick={() => setFeaturedDemo("equalizer")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-colors text-[11px]",
                    featuredDemo === "equalizer" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Wave
                </button>
                <button
                  onClick={() => setFeaturedDemo("switch")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-colors text-[11px]",
                    featuredDemo === "switch" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Switch
                </button>
                <button
                  onClick={() => setFeaturedDemo("icons")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-colors text-[11px]",
                    featuredDemo === "icons" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Icons
                </button>
              </div>
            </div>

            {/* Live Component Stage */}
            <div className="flex-1 flex items-center justify-center p-4 bg-dot-grid rounded-xl border border-border min-h-[220px]">
              {featuredDemo === "equalizer" && <DemoSkipper25 />}
              {featuredDemo === "switch" && <DemoSkipper4 />}
              {featuredDemo === "icons" && <DemoSkipper42 />}
            </div>

            {/* Sandbox Footer */}
            <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono text-[11px]">
                {featuredDemo === "equalizer" ? "skipper25 (Equalizer Bar)" : featuredDemo === "switch" ? "skipper4 (Physics Switch)" : "skipper42 (Vector Icons)"}
              </span>
              <Link
                href={featuredDemo === "equalizer" ? "/v1/skipper25" : featuredDemo === "switch" ? "/v1/skipper4" : "/v1/skipper42"}
                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
              >
                <span>Inspect Primitive</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN REGISTRY CATALOG */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Toolbar & Filter Center */}
        <section id="catalog-toolbar" className="mb-6 flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input with Keyboard Shortcut Indicator */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 107 catalog slots by name, ID (e.g. skipper42), description, or dependencies..."
                className="w-full h-11 pl-10 pr-14 rounded-xl border bg-background text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <kbd className="hidden sm:inline-block text-[10px] font-mono border rounded px-1.5 py-0.5 text-muted-foreground bg-muted">
                  /
                </kbd>
              </div>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 rounded-xl border bg-background px-3 py-2 text-xs text-muted-foreground shadow-2xs">
                <ArrowUpDown className="size-3.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
                >
                  <option value="id">Sort by ID (1–107)</option>
                  <option value="lines">Sort by Code Scale (LOC)</option>
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center rounded-xl border bg-background p-1 shadow-2xs">
                <button
                  onClick={() => setViewMode("cards")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    viewMode === "cards" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Rich Card View with Specs & Actions"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("compact")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    viewMode === "compact" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Compact Grid View"
                >
                  <List className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    viewMode === "table" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Engineering Specs Table"
                >
                  <TableIcon className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tag Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t text-xs">
            <span className="text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal className="size-3" /> Categories:
            </span>

            {/* Collection Filter */}
            {collections.slice(0, 6).map((col) => {
              const count = col === "all" ? components.length : collectionCounts.get(col) || 0;
              return (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 font-medium transition-colors border text-xs",
                    selectedCollection === col
                      ? "bg-foreground text-background border-foreground font-semibold"
                      : "bg-background text-muted-foreground hover:text-foreground border-border"
                  )}
                >
                  {col === "all" ? `All (${count})` : `${col} (${count})`}
                </button>
              );
            })}

            {/* Dependency Filter */}
            <span className="text-muted-foreground font-medium mx-1">·</span>
            {dependencies.slice(0, 5).map((dep) => (
              <button
                key={dep}
                onClick={() => setSelectedDep(dep)}
                className={cn(
                  "rounded-lg px-2.5 py-1 font-medium transition-colors border text-xs font-mono",
                  selectedDep === dep
                    ? "bg-sky-500 text-white border-sky-500 font-semibold"
                    : "bg-background text-muted-foreground hover:text-foreground border-border"
                )}
              >
                {dep === "all" ? "All Tech" : dep}
              </button>
            ))}

            {(search || selectedCollection !== "all" || selectedDep !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCollection("all");
                  setSelectedDep("all");
                }}
                className="text-xs text-primary hover:underline font-semibold ml-auto"
              >
                Reset filters
              </button>
            )}
          </div>
        </section>

        {/* Counter & Guidelines */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 px-1">
          <span>
            Showing <strong className="text-foreground">{filteredComponents.length}</strong> of {components.length} primitives
          </span>
          <span className="hidden sm:inline text-xs">
            Press <kbd className="font-mono text-[10px] border rounded px-1 bg-muted">/</kbd> to search · Click <span className="font-semibold text-primary">Live Test</span> to test components directly in this dashboard
          </span>
        </div>

        {/* VIEW 1: RICH CARDS (For all 107 catalog slots) */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((comp) => {
              const isReserved = comp.status === "reserved";
              return (
                <InteractiveGlowCard key={comp.id} className="flex flex-col justify-between">
                  <div>
                    {/* Top Thumbnail Frame adhering to SKILL.md strict aspect-video */}
                    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-muted/20 border border-border group/thumb">
                      <img
                        src={`/thumbnails/${comp.id}.webp`}
                        alt={comp.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = "none";
                        }}
                      />

                      {/* Clean Hover Overlay with Instant Actions */}
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                        {!isReserved && (
                          <button
                            onClick={() => {
                              setActiveModalSlug(comp.id);
                              setModalMountKey((k) => k + 1);
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-foreground text-background px-3.5 py-2 text-xs font-semibold shadow-md hover:opacity-90 transition-opacity"
                          >
                            <Play className="size-3.5 fill-current" />
                            <span>Live Test</span>
                          </button>
                        )}
                        <Link
                          href={comp.localSpecUrl}
                          className="flex items-center gap-1.5 rounded-xl bg-background border border-border px-3.5 py-2 text-xs font-semibold hover:bg-muted text-foreground transition-colors shadow-md"
                        >
                          <Code2 className="size-3.5 text-sky-500" />
                          <span>Specs</span>
                        </Link>
                      </div>
                    </div>

                    {/* Metadata Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                        {comp.id}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {comp.collection}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-base tracking-tight text-foreground line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
                      {comp.title}
                    </h3>

                    {/* Technical Description with leading-relaxed */}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {comp.description}
                    </p>

                    {/* Tech Specs Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      {comp.techStack?.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-muted/40 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!isReserved ? (
                        <button
                          onClick={() => {
                            setActiveModalSlug(comp.id);
                            setModalMountKey((k) => k + 1);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <Play className="size-3 fill-current" /> Test Inline
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-medium">Reserved Slot</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={comp.localSpecUrl}
                        className="rounded-lg border bg-background p-1.5 text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
                        title="Component Specifications"
                      >
                        <Code2 className="size-3.5 text-sky-500" />
                      </Link>

                      <Link
                        href={comp.localPreviewUrl}
                        target="_blank"
                        className="rounded-lg border bg-background p-1.5 text-muted-foreground hover:text-foreground transition-colors shadow-2xs"
                        title="Isolated Preview"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </InteractiveGlowCard>
              );
            })}
          </div>
        )}

        {/* VIEW 2: COMPACT GRID */}
        {viewMode === "compact" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {filteredComponents.map((comp) => (
              <div
                key={comp.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-2.5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div
                  onClick={() => {
                    if (comp.status !== "reserved") {
                      setActiveModalSlug(comp.id);
                      setModalMountKey((k) => k + 1);
                    }
                  }}
                  className="aspect-video w-full rounded-lg overflow-hidden bg-muted/40 mb-2 cursor-pointer relative"
                >
                  <img
                    src={`/thumbnails/${comp.id}.webp`}
                    alt={comp.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="size-4 text-white fill-current" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-[10px] font-mono text-muted-foreground mb-1">
                    <span>{comp.id}</span>
                  </div>
                  <h4 className="text-xs font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {comp.title}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t flex items-center justify-between">
                  <Link href={comp.localSpecUrl} className="text-[10px] text-primary hover:underline font-medium">
                    Inspect
                  </Link>
                  <Link href={comp.localPreviewUrl} target="_blank" className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: SPECS TABLE */}
        {viewMode === "table" && (
          <div className="overflow-x-auto rounded-2xl border bg-card shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Collection</th>
                  <th className="py-3 px-4">Dependencies</th>
                  <th className="py-3 px-4">Physics Profile</th>
                  <th className="py-3 px-4">LOC</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredComponents.map((comp) => (
                  <tr key={comp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold">{comp.id}</td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-foreground line-clamp-1">{comp.title}</div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{comp.description}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{comp.collection}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {comp.dependencies?.map((d) => (
                          <span key={d} className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">{comp.springDetails}</td>
                    <td className="py-3 px-4 font-mono text-[11px]">{comp.lineCount}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {comp.status !== "reserved" && (
                          <button
                            onClick={() => {
                              setActiveModalSlug(comp.id);
                              setModalMountKey((k) => k + 1);
                            }}
                            className="rounded-md bg-foreground text-background p-1.5 hover:opacity-90"
                            title="Test Inline"
                          >
                            <Play className="size-3 fill-current" />
                          </button>
                        )}
                        <Link
                          href={comp.localSpecUrl}
                          className="rounded-md border bg-background p-1.5 text-muted-foreground hover:text-foreground"
                          title="Component Details"
                        >
                          <Code2 className="size-3 text-sky-500" />
                        </Link>
                        <Link
                          href={comp.localPreviewUrl}
                          target="_blank"
                          className="rounded-md border bg-background p-1.5 text-muted-foreground hover:text-foreground"
                          title="Isolated Preview"
                        >
                          <ExternalLink className="size-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* DOGFOODED INLINE INTERACTIVE RUNNER MODAL (Equipped with Viewport Emulation & Stepper Controls) */}
      <AnimatePresence>
        {activeModalSlug && ActiveComponent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-col w-full max-w-5xl h-[88vh] rounded-3xl border bg-background shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex flex-wrap items-center justify-between border-b px-6 py-3.5 bg-card/70 backdrop-blur-md gap-3">
                <div className="flex items-center gap-3">
                  {/* Stepper buttons in modal */}
                  <div className="flex items-center rounded-lg border bg-background/60 p-0.5">
                    {prevModalComp ? (
                      <button
                        onClick={() => {
                          setActiveModalSlug(prevModalComp.id);
                          setModalMountKey((k) => k + 1);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title={`Previous: ${prevModalComp.id}`}
                      >
                        <ChevronLeft className="size-3.5" />
                      </button>
                    ) : (
                      <span className="p-1 text-muted-foreground/30 cursor-not-allowed">
                        <ChevronLeft className="size-3.5" />
                      </span>
                    )}
                    <span className="text-[11px] font-mono px-2 text-muted-foreground">
                      {activeRecord?.number} / 107
                    </span>
                    {nextModalComp ? (
                      <button
                        onClick={() => {
                          setActiveModalSlug(nextModalComp.id);
                          setModalMountKey((k) => k + 1);
                        }}
                        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title={`Next: ${nextModalComp.id}`}
                      >
                        <ChevronRight className="size-3.5" />
                      </button>
                    ) : (
                      <span className="p-1 text-muted-foreground/30 cursor-not-allowed">
                        <ChevronRight className="size-3.5" />
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border">
                    {activeModalSlug}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-foreground line-clamp-1">
                      {activeRecord?.title}
                    </h3>
                  </div>
                </div>

                {/* Center / Right: Viewport Sizing Controls & Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    data-testid="copy-cli-command"
                    onClick={async () => {
                      if (!activeModalSlug) return;
                      const number = activeModalSlug.replace(/^skipper/, "");
                      const command = `npx shadcn@latest add https://${window.location.host}/r/skiper${number}.json`;
                      try {
                        await navigator.clipboard.writeText(command);
                        setCopyCommandLabel("Copied!");
                        window.setTimeout(() => setCopyCommandLabel("Copy CLI Command"), 1800);
                      } catch {
                        setCopyCommandLabel("Clipboard unavailable");
                        window.setTimeout(() => setCopyCommandLabel("Copy CLI Command"), 1800);
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted"
                  >
                    <Copy className="size-3.5" />{copyCommandLabel}
                  </button>
                  {/* Viewport switchers in modal */}
                  <div className="hidden sm:flex items-center rounded-lg border bg-background/60 p-0.5">
                    <button
                      onClick={() => setModalViewport("full")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        modalViewport === "full" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Fluid Width"
                    >
                      <Maximize2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setModalViewport("desktop")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        modalViewport === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Desktop Frame (1024px)"
                    >
                      <Laptop className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setModalViewport("tablet")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        modalViewport === "tablet" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Tablet Frame (768px)"
                    >
                      <Tablet className="size-3.5" />
                    </button>
                    <button
                      onClick={() => setModalViewport("mobile")}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        modalViewport === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                      title="Mobile Frame (390px)"
                    >
                      <Smartphone className="size-3.5" />
                    </button>
                  </div>

                  {/* Re-mount button */}
                  <button
                    onClick={() => setModalMountKey((k) => k + 1)}
                    className="flex items-center gap-1 rounded-lg border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                    title="Reset & replay entrance animations"
                  >
                    <RotateCcw className="size-3" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <Link
                    href={`/v1/${activeModalSlug}`}
                    className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                  >
                    <Code2 className="size-3.5 text-sky-500" />
                    <span className="hidden sm:inline">Specs</span>
                  </Link>

                  <Link
                    href={`/v1/preview/${activeModalSlug}`}
                    target="_blank"
                    className="flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted text-foreground transition-colors"
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </Link>

                  <button
                    onClick={() => setActiveModalSlug(null)}
                    className="flex size-7 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors ml-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Modal Component Stage with Responsive Container */}
              <div className="flex-1 relative flex items-center justify-center p-6 bg-background bg-dot-grid overflow-auto">
                <div className={cn(
                  "transition-all duration-300 flex items-center justify-center",
                  modalViewport === "full" && "w-full max-w-full",
                  modalViewport === "desktop" && "w-full max-w-4xl rounded-2xl border bg-card/60 p-6 shadow-xl",
                  modalViewport === "tablet" && "w-full max-w-2xl rounded-2xl border bg-card/60 p-6 shadow-xl",
                  modalViewport === "mobile" && "w-full max-w-[390px] rounded-3xl border-2 bg-card p-4 shadow-2xl overflow-hidden min-h-[580px]"
                )}>
                  <ActiveComponent key={modalMountKey} />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="border-t px-6 py-2.5 bg-card/40 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-foreground">Interactive Live Sandbox</span>
                  <span className="text-border">·</span>
                  <span className="font-mono text-[11px]">{activeRecord?.lineCount} Lines</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">Use <kbd className="font-mono text-[10px] border rounded px-1">←</kbd> and <kbd className="font-mono text-[10px] border rounded px-1">→</kbd> to cycle components</span>
                  <span>Press <kbd className="font-mono text-[10px] border rounded px-1">ESC</kbd> to close</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
