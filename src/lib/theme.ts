"use client";

import { useState, useEffect, useCallback } from "react";

const THEME_STORAGE_KEY = "skipper_theme";

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) {
        const darkVal = saved === "dark";
        setIsDark(darkVal);
        document.documentElement.classList.toggle("dark", darkVal);
      } else {
        // Default to dark theme for Skipper UI
        setIsDark(true);
        document.documentElement.classList.add("dark");
      }
    } catch {
      document.documentElement.classList.add("dark");
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const darkVal = e.newValue === "dark";
        setIsDark(darkVal);
        document.documentElement.classList.toggle("dark", darkVal);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
      } catch {}
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  }, []);

  return { isDark, toggleTheme, mounted };
}
