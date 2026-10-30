"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Copy, Sparkles, PiggyBank, Coins, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WalletCardItem {
  name: string;
  amount: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const defaultWalletCards: WalletCardItem[] = [
  { name: "Sandeep", amount: "1.03 ETH", bgColor: "bg-purple-500", icon: Sparkles },
  { name: "Savings", amount: "25.08 ETH", bgColor: "bg-neutral-900", icon: PiggyBank },
  { name: "Staked", amount: "0.04 ETH", bgColor: "bg-cyan-500", icon: Coins },
  { name: "Spending", amount: "0 ETH", bgColor: "bg-blue-500", icon: CreditCard },
];

export const MinimalCardExpand: React.FC<{ cards?: WalletCardItem[] }> = ({
  cards = defaultWalletCards,
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const getSecondaryCards = () =>
    selected === null ? cards.slice(2, 4) : cards.filter((_, idx) => idx !== selected);

  const renderCard = (card: WalletCardItem, index: number, isSecondary = false) => {
    const isSelected = selected === index;
    const isShrunk = selected !== null && getSecondaryCards().length === 3;
    const Icon = card.icon;

    return (
      <motion.div
        key={index}
        layoutId={`card-${index}`}
        onClick={() => setSelected(isSelected ? null : index)}
        className={cn(
          "relative flex cursor-pointer flex-col items-start justify-between overflow-hidden p-3 text-white transition-shadow duration-200",
          isSelected
            ? "h-[180px] w-full"
            : isShrunk && isSecondary
            ? "h-[100px] w-[100px] sm:w-[120px]"
            : "h-[125px] w-[140px] sm:w-[160px]",
          card.bgColor
        )}
        style={{
          transformOrigin: "50% 50% 0px",
          borderRadius: "24px",
        }}
      >
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center justify-center">
            <motion.div layoutId={`icon-${index}`}>
              <Icon
                className={cn(
                  "fill-white",
                  isSelected
                    ? "h-12 w-12"
                    : isShrunk && isSecondary
                    ? "h-6 w-6"
                    : "h-8 w-8"
                )}
              />
            </motion.div>
          </div>

          {!isSelected && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(2px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(2px)" }}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 p-0.5 transition-colors duration-150 ease-out hover:bg-white/30"
            >
              <Plus className="size-4" />
            </motion.div>
          )}

          <AnimatePresence>
            {isSelected && (
              <motion.div
                layoutId="copy-address"
                className="absolute right-4 top-4 flex items-center justify-center gap-3 font-semibold tracking-tight"
              >
                <p className="text-sm">Copy Address</p>
                <div className="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors duration-150 ease-out hover:bg-white/30">
                  <Copy className="size-3" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isSelected && (
              <motion.div
                layoutId="customize"
                className="absolute bottom-4 right-4 flex items-center justify-center gap-3 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-tight"
              >
                Customize
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-start justify-center">
          <motion.span
            layoutId={`title-${index}`}
            className={cn(
              "select-none font-semibold text-white",
              isSelected ? "text-xl" : isShrunk && isSecondary ? "text-sm" : "text-base"
            )}
          >
            {card.name}
          </motion.span>
          <motion.span
            layoutId={`desc-${index}`}
            className={cn(
              "select-none font-semibold text-white/50",
              isSelected ? "text-lg" : isShrunk && isSecondary ? "text-xs" : "text-sm"
            )}
          >
            {card.amount}
          </motion.span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col items-center justify-center gap-4 p-4">
      <div ref={containerRef} className="flex h-[300px] w-full max-w-[360px] flex-col justify-end gap-4">
        {/* Top row / Expanded card */}
        <div className="flex gap-4">
          {(selected === null ? cards.slice(0, 2) : cards.filter((_, idx) => idx === selected)).map(
            (card, index) => renderCard(card, selected !== null ? selected : index, false)
          )}
        </div>

        {/* Bottom row / Shrunk remaining cards */}
        <div className="flex gap-4">
          {getSecondaryCards().map((card, r) => {
            const index =
              selected !== null
                ? cards.findIndex((_, idx) => idx !== selected && cards[idx] === card)
                : r + 2;
            return renderCard(card, index, true);
          })}
        </div>
      </div>
    </div>
  );
};

export const Skipper23 = MinimalCardExpand;
export const DemoSkipper23 = Skipper23;
export default Skipper23;
