"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ExternalLink, 
  Monitor, 
  Code2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  AlertTriangle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Smartphone,
  Tablet,
  Laptop,
  Maximize2,
  Grid
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { componentRegistry } from "@/lib/registry";
import { ThemeToggleButton1 } from "@/components/v1/skipper4";
import sideBySideList from "@/lib/side-by-side-data.json";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ComponentDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { isDark, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<"stage" | "specs" | "code">("stage");
  const [viewportSize, setViewportSize] = useState<"full" | "desktop" | "tablet" | "mobile">("full");
  const [mountKey, setMountKey] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [copied, setCopied] = useState(false);

  const record = sideBySideList.find((r) => r.id === slug);
  const Component = componentRegistry[slug]?.component;

  // Component Stepper Navigation (1 to 107)
  const validComponents = sideBySideList.filter((r) => r.status !== "reserved");
  const currentIndex = validComponents.findIndex((r) => r.id === slug);
  const prevComponent = currentIndex > 0 ? validComponents[currentIndex - 1] : null;
  const nextComponent = currentIndex < validComponents.length - 1 ? validComponents[currentIndex + 1] : null;

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (record?.status === "reserved") {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground mb-4">
            <AlertTriangle className="size-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Reserved Slot: {slug}</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Component <code className="text-foreground font-mono font-semibold">{slug}</code> is an architectural sequence slot reserved for a future interactive primitive.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="size-4" /> Return to Catalog
            </Link>
            {nextComponent && (
              <Link
                href={`/v1/${nextComponent.id}`}
                className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2 text-sm font-medium hover:bg-muted text-foreground transition-colors"
              >
                <span>Next: {nextComponent.id}</span>
                <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!Component || !record) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-destructive font-semibold text-lg">Component not found</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          No component registered for &quot;{slug}&quot;.
        </p>
        <Link href="/" className="mt-4 text-sm text-primary underline">
          Back to Registry
        </Link>
      </div>
    );
  }

  const importStatement = `import { Skipper${record.number}, DemoSkipper${record.number} } from "@/components/v1/${slug}";

export default function Showcase() {
  return (
    <div className="w-full flex items-center justify-center">
      <DemoSkipper${record.number} />
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      {/* Top Header & Breadcrumb Bar */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Return + Stepper + Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all shadow-2xs"
              title="Return to Catalog"
            >
              <ArrowLeft className="size-4" />
            </Link>

            {/* Stepper Buttons (Prev / Next Component) */}
            <div className="hidden sm:flex items-center rounded-lg border border-border bg-background/60 p-0.5 shadow-2xs">
              {prevComponent ? (
                <Link
                  href={`/v1/${prevComponent.id}`}
                  className="flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={`Previous: ${prevComponent.id} (${prevComponent.title})`}
                >
                  <ChevronLeft className="size-3.5" />
                </Link>
              ) : (
                <span className="flex size-7 items-center justify-center text-muted-foreground/30 cursor-not-allowed">
                  <ChevronLeft className="size-3.5" />
                </span>
              )}
              <span className="text-[11px] font-mono font-medium px-2 text-muted-foreground">
                {record.number} / 107
              </span>
              {nextComponent ? (
                <Link
                  href={`/v1/${nextComponent.id}`}
                  className="flex size-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={`Next: ${nextComponent.id} (${nextComponent.title})`}
                >
                  <ChevronRight className="size-3.5" />
                </Link>
              ) : (
                <span className="flex size-7 items-center justify-center text-muted-foreground/30 cursor-not-allowed">
                  <ChevronRight className="size-3.5" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border">
                {record.id}
              </span>
              <h1 className="font-bold text-base sm:text-lg tracking-tight line-clamp-1">
                {record.title}
              </h1>
            </div>
          </div>

          {/* Center: View Mode Tabs */}
          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 shadow-2xs text-xs">
            <button
              onClick={() => setViewMode("stage")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all",
                viewMode === "stage" 
                  ? "bg-background text-foreground shadow-2xs border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="size-3.5" />
              <span>Interactive Stage</span>
            </button>

            <button
              onClick={() => setViewMode("specs")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all",
                viewMode === "specs" 
                  ? "bg-background text-foreground shadow-2xs border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck className="size-3.5" />
              <span>Specifications</span>
            </button>

            <button
              onClick={() => setViewMode("code")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all",
                viewMode === "code" 
                  ? "bg-background text-foreground shadow-2xs border border-border" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="size-3.5" />
              <span>Integration</span>
            </button>
          </div>

          {/* Right Navigation: Pinned on top right corner */}
          <div className="flex items-center gap-2 ml-auto">
            <Link
              href={`/v1/preview/${slug}`}
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-muted text-foreground transition-all shadow-2xs"
              title="Open standalone preview in new window"
            >
              <ExternalLink className="size-3.5" />
              <span className="hidden sm:inline">Isolated View</span>
            </Link>

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

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col">
        {/* VIEW 1: INTERACTIVE STAGE */}
        {viewMode === "stage" && (
          <div className="flex-1 flex flex-col">
            {/* Stage Toolbar */}
            <div className="bg-card/40 px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
              {/* Left: Status & Specs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Interactive Runtime</span>
                </div>
                <span className="text-border">|</span>
                <span className="font-mono text-[11px]">{record.lineCount} Lines</span>
                <span className="text-border">|</span>
                <span className="text-[11px] text-muted-foreground">{record.springDetails}</span>
              </div>

              {/* Right: Viewport Sizing Controls & Re-mount */}
              <div className="flex items-center gap-2">
                {/* Viewport switchers */}
                <div className="flex items-center rounded-lg border bg-background/60 p-0.5">
                  <button
                    onClick={() => setViewportSize("full")}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      viewportSize === "full" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Fluid Full Width"
                  >
                    <Maximize2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportSize("desktop")}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      viewportSize === "desktop" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Desktop Preview (1024px)"
                  >
                    <Laptop className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportSize("tablet")}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      viewportSize === "tablet" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Tablet Preview (768px)"
                  >
                    <Tablet className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportSize("mobile")}
                    className={cn(
                      "p-1.5 rounded transition-colors",
                      viewportSize === "mobile" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                    title="Mobile Viewport (390px)"
                  >
                    <Smartphone className="size-3.5" />
                  </button>
                </div>

                {/* Dot grid toggle */}
                <button
                  onClick={() => setShowGrid((g) => !g)}
                  className={cn(
                    "p-1.5 rounded-lg border bg-background/60 transition-colors",
                    showGrid ? "text-primary border-primary/30" : "text-muted-foreground"
                  )}
                  title="Toggle Canvas Grid Pattern"
                >
                  <Grid className="size-3.5" />
                </button>

                {/* Re-mount / Reset Animation */}
                <button
                  onClick={() => setMountKey((k) => k + 1)}
                  className="flex items-center gap-1.5 rounded-lg border bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  title="Re-mount component and reset entrance animation"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Stage Canvas */}
            <div className={cn(
              "flex-1 relative flex items-center justify-center p-6 bg-background min-h-[calc(100vh-125px)] overflow-auto transition-all",
              showGrid && "bg-dot-grid"
            )}>
              <div className={cn(
                "transition-all duration-300 flex items-center justify-center",
                viewportSize === "full" && "w-full max-w-full",
                viewportSize === "desktop" && "w-full max-w-5xl rounded-2xl border bg-card/60 p-6 shadow-xl",
                viewportSize === "tablet" && "w-full max-w-3xl rounded-2xl border bg-card/60 p-6 shadow-xl",
                viewportSize === "mobile" && "w-full max-w-[390px] rounded-3xl border-2 bg-card p-4 shadow-2xl overflow-hidden min-h-[640px]"
              )}>
                <Component key={mountKey} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: DETAILED SPECS */}
        {viewMode === "specs" && (
          <div className="max-w-5xl mx-auto w-full px-6 py-10">
            {/* Architectural Overview Card */}
            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xs mb-8">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold block mb-2">
                Architecture & Specifications
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                {record.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                {record.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Collection</span>
                  <span className="font-semibold text-foreground">{record.collection}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Tier</span>
                  <span className="font-semibold text-foreground capitalize">{record.tier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Dependencies</span>
                  <span className="font-semibold text-foreground font-mono">
                    {record.dependencies?.join(", ") || "None"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Source Scale</span>
                  <span className="font-semibold text-foreground font-mono">{record.lineCount} Lines</span>
                </div>
              </div>
            </div>

            {/* Three Breakdown Columns adhering strictly to SKILL.md */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature Capabilities */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                    <CheckCircle2 className="size-4" />
                    <span>Visual & Interaction Specs</span>
                  </div>
                  <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    {record.identical?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span><strong className="text-foreground">{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Adaptations */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 mb-4">
                    <Layers className="size-4" />
                    <span>Framework Modernization</span>
                  </div>
                  <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    {record.similarity?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                        <span><strong className="text-foreground">{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Robustness Enhancements */}
              <div className="rounded-2xl border bg-card p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">
                    <Sparkles className="size-4" />
                    <span>Engineering Hardening</span>
                  </div>
                  <ul className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                    {record.uniqueness?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span><strong className="text-foreground">{item.split(':')[0]}:</strong> {item.split(':').slice(1).join(':')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: INTEGRATION CODE */}
        {viewMode === "code" && (
          <div className="max-w-4xl mx-auto w-full px-6 py-10 space-y-6">
            {/* Step 1: Dependencies */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold block mb-2">
                Step 1: Installation
              </span>
              <p className="text-xs text-muted-foreground mb-3">
                Ensure required animation libraries and icon dependencies are present in your project:
              </p>
              <div className="flex items-center justify-between rounded-xl bg-background border px-4 py-2.5 font-mono text-xs text-foreground">
                <code>npm install framer-motion lucide-react</code>
                <button
                  onClick={() => handleCopyCode("npm install framer-motion lucide-react")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-3"
                  title="Copy command"
                >
                  <Copy className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Step 2: Component Import */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-6 py-3 border-b bg-muted/40">
                <span className="text-xs font-mono font-medium text-foreground">
                  src/components/v1/{slug}.tsx
                </span>
                <button
                  onClick={() => handleCopyCode(importStatement)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Copied snippet" : "Copy snippet"}</span>
                </button>
              </div>
              <pre className="p-6 text-xs font-mono text-foreground leading-relaxed overflow-x-auto bg-background/50">
                <code>{importStatement}</code>
              </pre>
            </div>

            {/* Step 3: Usage Guidelines */}
            <div className="rounded-2xl border bg-muted/20 p-6 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground mb-1.5">Architecture Guidelines</h4>
              <p className="leading-relaxed">
                Exported primitives (<code className="font-mono text-foreground">Skipper{record.number}</code>) offer unstyled, headless flex/grid control, while default showcase wrappers (<code className="font-mono text-foreground">DemoSkipper{record.number}</code>) provide pre-composed viewport layouts with sample states.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
