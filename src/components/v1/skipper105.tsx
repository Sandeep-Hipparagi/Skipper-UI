"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

export type NumberFormatType = "us" | "eu" | "space" | "ch" | "in" | "none" | "string";

const FORMAT_OPTIONS = [
  { value: "us", label: "1,234,567.89 (US)" },
  { value: "eu", label: "1.234.567,89 (EU)" },
  { value: "space", label: "1 234 567,89 (SPACE)" },
  { value: "ch", label: "1'234'567.89 (CH)" },
  { value: "in", label: "12,34,567.89 (IN)" },
  { value: "none", label: "1234567.89 (NONE)" },
  { value: "string", label: "Any text (STRING)" },
];

const getDecimalSeparator = (format: NumberFormatType) =>
  format === "eu" || format === "space" ? "," : ".";

const formatNumber = (parts: { int: string; frac: string }, format: NumberFormatType) => {
  const { int, frac } = parts;
  if (format === "string") return int;
  if (!int && !frac) return "";
  const sep = getDecimalSeparator(format);

  let formattedInt = "0";
  if (int) {
    switch (format) {
      case "in": {
        if (int.length <= 3) formattedInt = int;
        else {
          const arr: string[] = [];
          let rem = int;
          arr.unshift(rem.slice(-3));
          rem = rem.slice(0, -3);
          while (rem.length > 0) {
            const take = rem.length >= 2 ? 2 : rem.length;
            arr.unshift(rem.slice(-take));
            rem = rem.slice(0, -take);
          }
          formattedInt = arr.join(",");
        }
        break;
      }
      case "us":
        formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        break;
      case "eu":
        formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        break;
      case "space":
        formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        break;
      case "ch":
        formattedInt = int.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
        break;
      default:
        formattedInt = int;
    }
  }

  return frac ? `${formattedInt}${sep}${frac}` : formattedInt;
};

const parseAndFormat = (inputVal: string, format: NumberFormatType) => {
  if (format === "string") return inputVal;
  const sep = getDecimalSeparator(format);
  let cleaned = inputVal;
  switch (format) {
    case "us":
    case "in":
      cleaned = cleaned.replace(/,/g, "");
      break;
    case "eu":
      cleaned = cleaned.replace(/\./g, "");
      break;
    case "space":
      cleaned = cleaned.replace(/ /g, "");
      break;
    case "ch":
      cleaned = cleaned.replace(/'/g, "");
      break;
  }

  const lastSep = cleaned.lastIndexOf(sep);
  let parts: { int: string; frac: string };
  if (lastSep === -1) {
    parts = { int: cleaned.replace(/\D/g, ""), frac: "" };
  } else {
    parts = {
      int: cleaned.slice(0, lastSep).replace(/\D/g, ""),
      frac: cleaned.slice(lastSep + 1).replace(/\D/g, ""),
    };
  }

  const trailingSep = inputVal.endsWith(sep) && !parts.frac;
  if (!parts.int && !parts.frac) return "";
  let res = formatNumber(parts, format);
  if (trailingSep) res += sep;
  return res;
};

function useAutoscale({
  minSize = 18,
  maxSize = 100,
  emptyMeasureFallback = "",
  prefixRef,
  suffixRef,
  inputRef,
  watch = [],
}: {
  minSize?: number;
  maxSize?: number;
  emptyMeasureFallback?: string;
  prefixRef?: React.RefObject<HTMLElement | null>;
  suffixRef?: React.RefObject<HTMLElement | null>;
  inputRef?: React.Ref<HTMLInputElement>;
  // FIX: Type watch dependencies array as unknown[] to avoid any[]
  watch?: unknown[];
}) {
  const localRef = useRef<HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = useState<number | null>(null);

  const setRef = useCallback(
    (el: HTMLInputElement | null) => {
      localRef.current = el;
      if (typeof inputRef === "function") inputRef(el);
      else if (inputRef && "current" in inputRef) {
        // FIX: Cast ref to React.MutableRefObject rather than any
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    },
    [inputRef]
  );

  const recalculate = useCallback(() => {
    const el = localRef.current;
    if (!el || !el.parentElement) return;

    const prefixEl = prefixRef?.current;
    const suffixEl = suffixRef?.current;
    const availableWidth = el.parentElement.offsetWidth;

    el.style.whiteSpace = "nowrap";
    el.style.display = "inline-block";
    const originalVal = el.value;
    el.value = originalVal || emptyMeasureFallback || "\u00A0";

    const setSize = (sz: number) => {
      const px = `${sz}px`;
      el.style.fontSize = px;
      if (prefixEl) prefixEl.style.fontSize = px;
      if (suffixEl) suffixEl.style.fontSize = px;
    };

    const getMeasuredWidth = () => {
      const pW = prefixEl?.offsetWidth ?? 0;
      const sW = suffixEl?.offsetWidth ?? 0;
      return pW + el.scrollWidth + sW;
    };

    let low = minSize;
    let high = maxSize;

    while (high - low > 0.5) {
      const mid = (low + high) / 2;
      setSize(mid);
      if (getMeasuredWidth() > availableWidth) high = mid;
      else low = mid;
    }

    const finalSize = Math.floor(low);
    setSize(finalSize);
    setFontSize(finalSize);
    el.value = originalVal;
  }, [minSize, maxSize, emptyMeasureFallback, prefixRef, suffixRef]);

  useEffect(() => {
    const el = localRef.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    recalculate();
    const ro = new ResizeObserver(recalculate);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [recalculate]);

  useEffect(() => {
    recalculate();
  }, [recalculate, ...watch]);

  return { ref: setRef, fontSize };
}

export interface AutoscaleInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  numberFormat?: NumberFormatType;
  prefix?: string;
  suffix?: string;
  minSize?: number;
  maxSize?: number;
  wrapperClassName?: string;
  containerClassName?: string;
}

export const AutoscaleInput = forwardRef<HTMLInputElement, AutoscaleInputProps>(
  (
    {
      numberFormat = "us",
      prefix = "$",
      suffix = "",
      minSize = 18,
      maxSize = 100,
      wrapperClassName,
      containerClassName,
      className,
      style,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder,
      inputMode,
      autoComplete = "off",
      "aria-label": ariaLabel = "Value",
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [localValue, setLocalValue] = useState(() =>
      controlledValue !== undefined
        ? String(controlledValue)
        : defaultValue !== undefined
        ? parseAndFormat(String(defaultValue), numberFormat)
        : ""
    );

    const val = isControlled ? String(controlledValue ?? "") : localValue;
    const prefixRef = useRef<HTMLSpanElement>(null);
    const suffixRef = useRef<HTMLSpanElement>(null);

    const effectivePlaceholder = placeholder || "0.00";

    const { ref: setInputRef, fontSize } = useAutoscale({
      minSize,
      maxSize,
      emptyMeasureFallback: effectivePlaceholder,
      prefixRef,
      suffixRef,
      inputRef: ref,
      watch: [val, effectivePlaceholder, minSize, maxSize, prefix, suffix],
    });

    const fontStyle = fontSize ? { fontSize: `${fontSize}px` } : undefined;
    const isEmpty = !val;

    return (
      <div
        className={cn("mx-auto w-full max-w-md px-6", containerClassName)}
      >
        <div
          className={cn(
            "text-foreground relative flex w-full items-center justify-center overflow-hidden text-center font-semibold tracking-tighter",
            wrapperClassName
          )}
        >
          {prefix && (
            <span
              ref={prefixRef}
              className={cn("text-foreground shrink-0 transition-opacity", isEmpty && "text-foreground/20")}
              style={fontStyle}
            >
              {prefix}
            </span>
          )}
          <input
            {...props}
            ref={setInputRef}
            type="text"
            inputMode={inputMode ?? (numberFormat === "string" ? "text" : "decimal")}
            autoComplete={autoComplete}
            value={val}
            placeholder={effectivePlaceholder}
            onChange={(e) => {
              const formatted = parseAndFormat(e.target.value, numberFormat);
              if (!isControlled) setLocalValue(formatted);
              onChange?.({
                ...e,
                target: { ...e.target, value: formatted },
                currentTarget: { ...e.currentTarget, value: formatted },
              });
            }}
            aria-label={ariaLabel}
            className={cn(
              "field-sizing-content min-w-0 cursor-text border-0 bg-transparent p-0 text-center text-inherit outline-none",
              "caret-foreground placeholder:text-foreground/20",
              "shadow-none ring-0 focus:shadow-none focus:ring-0 focus-visible:outline-none",
              className
            )}
            style={{ ...fontStyle, ...style }}
          />
          {suffix && (
            <span
              ref={suffixRef}
              className={cn("text-foreground shrink-0 transition-opacity", isEmpty && "text-foreground/20")}
              style={fontStyle}
            >
              {suffix}
            </span>
          )}
        </div>
      </div>
    );
  }
);
AutoscaleInput.displayName = "AutoscaleInput";

export function Skipper105() {
  return (
    <div className="bg-muted text-foreground flex min-h-screen w-full flex-col items-center justify-center p-6">
      <div className="-mt-10 mb-20 grid content-start justify-items-center gap-6 text-center pointer-events-none">
        <span className="after:bg-linear-to-b after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:from-transparent after:content-['']">
          Try Entering a number
        </span>
      </div>

      <div className="w-full">
        <AutoscaleInput prefix="$" defaultValue="12500.50" />
      </div>
    </div>
  );
}

export function DemoSkipper105() {
  return <Skipper105 />;
}

export default Skipper105;
