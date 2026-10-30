"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { componentRegistry } from "@/lib/registry";

interface PreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = use(params);
  const Component = componentRegistry[slug]?.component;

  if (!Component) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-destructive font-semibold text-lg">Component not found</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          No component registered for &quot;{slug}&quot;.
        </p>
        <Link href="/" className="mt-4 text-sm text-primary underline">
          Return to Registry
        </Link>
      </div>
    );
  }

  return (
    <div
      id="preview"
      className={cn("relative flex min-h-[100dvh] w-full items-center justify-center bg-background text-foreground overflow-auto p-4")}
    >
      <Link
        href={`/v1/${slug}`}
        className="fixed top-4 left-4 z-50 flex items-center gap-1.5 rounded-xl border bg-background/80 backdrop-blur-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all shadow-md opacity-60 hover:opacity-100"
      >
        <ArrowLeft className="size-3.5" />
        <span>Exit Fullscreen</span>
      </Link>

      <div className="w-full flex items-center justify-center">
        <Component />
      </div>
    </div>
  );
}
