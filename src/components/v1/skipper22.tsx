"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import useMeasure from "react-use-measure";
import { ArrowDown, DollarSign, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const AaveTokenSwap: React.FC = () => {
  const [ethAmount, setEthAmount] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [useMaxRef, maxBounds] = useMeasure();
  const [usdRef, usdBounds] = useMeasure();

  const usdValue = 3445.86 * ethAmount;
  const chars = (inputValue || "0").split("");
  const aaveValue = (10.87 * ethAmount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 400, damping: 35 }}>
      <div className="flex h-full min-h-[600px] w-full items-center justify-center bg-[#131313] text-white">
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Ethereum Input Card */}
          <div className="relative flex w-[300px] flex-col items-center justify-center gap-5 rounded-3xl border border-[#303030]/50 bg-[#121212] px-3 py-3 sm:w-[350px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/skipperv1/web3/eth.svg" alt="ETH" className="size-8" />
                <div>
                  <h2 className="text-base font-semibold">Ethereum</h2>
                  <p className="text-sm text-[#7b7b7b]"> 111.82 ETH</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEthAmount(111.82);
                  setInputValue("111.82");
                }}
                className="flex items-center gap-1 rounded-full bg-[#222] px-3 py-1 text-sm font-semibold transition-colors hover:bg-[#333]"
              >
                <motion.span animate={{ width: maxBounds.width > 0 ? maxBounds.width : "auto" }}>
                  <span ref={useMaxRef} className="inline-flex overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      {ethAmount > 111 ? (
                        <motion.span
                          key="using"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Using{" "}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="use"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Use{" "}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.span>
                Max
              </button>
            </div>

            <div className="w-full border-t border-[#303030]/50" />

            <div className="mb-6 flex w-full flex-col items-center justify-center gap-4">
              <div className="relative w-[300px] overflow-hidden text-center">
                <input
                  ref={inputRef}
                  type="text"
                  className={cn(
                    "inset-0 w-full cursor-pointer text-center text-[45px] font-semibold tracking-tight text-transparent caret-white outline-none",
                    inputValue === "" && "caret-transparent"
                  )}
                  placeholder="0"
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!/^[0-9]*\.?[0-9]*$/.test(val) && val !== "") return;
                    if (val === "" || val === "." || val.startsWith(".")) {
                      setEthAmount(0);
                      setInputValue(val);
                      return;
                    }
                    const num = parseFloat(val) || 0;
                    if (num > 11111) {
                      setEthAmount(11111);
                      setInputValue("11111");
                    } else {
                      setEthAmount(num);
                      setInputValue(val);
                    }
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <AnimatePresence initial={false} mode="popLayout">
                    {chars.map((char, index) => (
                      <motion.span
                        key={`${char}-${index}`}
                        className="text-[45px] font-semibold tracking-tight text-white"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex w-full items-center justify-center gap-2">
                <AnimatePresence initial={false} mode="popLayout">
                  {ethAmount > 111.82 ? (
                    <motion.p
                      key="not-enough-eth"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        x: [0, -5, 5, -3, 3, 0],
                        transition: {
                          x: { delay: 0.2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        },
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      style={{ transformOrigin: "bottom center" }}
                      className="font-lg w-max text-center font-semibold tracking-tight text-red-500"
                    >
                      Not Enough ETH
                    </motion.p>
                  ) : (
                    <motion.div
                      key="usd-value"
                      style={{ transformOrigin: "top center" }}
                      initial={{ opacity: 0, y: "100%", scale: 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <div className="rounded-full bg-[#222] p-1">
                        <DollarSign className="size-4 text-[#7b7b7b]" />
                      </div>
                      <motion.div
                        animate={{ width: usdBounds.width > 0 ? usdBounds.width : "auto" }}
                        className="flex items-center gap-2 overflow-hidden"
                      >
                        <div ref={usdRef} className="font-lg flex justify-between font-semibold tracking-tight">
                          <span>$</span>
                          {(() => {
                            const counts: Record<string, number> = {};
                            return usdValue
                              .toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                              .split("")
                              .map((c) => {
                                counts[c] = (counts[c] || 0) + 1;
                                const id = counts[c] > 1 ? `usd-${c}-dup-${counts[c]}` : `usd-${c}`;
                                return (
                                  <motion.span key={id} layoutId={id} className="inline-block">
                                    {c}
                                  </motion.span>
                                );
                              });
                          })()}
                        </div>
                      </motion.div>
                      <ChevronRight className="size-4 text-[#7b7b7b]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Down arrow divider */}
            <div className="absolute -bottom-5 rounded-full border border-[#303030]/50 bg-[#121212] p-1.5 z-10">
              <ArrowDown className="size-4 opacity-50" />
            </div>
          </div>

          {/* Aave Receive Card */}
          <div className="flex w-[300px] flex-col items-start justify-start gap-5 rounded-3xl border border-[#303030]/50 bg-[#121212] px-3 py-3 sm:w-[350px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/skipperv1/web3/aave.svg" alt="Aave" className="size-10" />
                <div>
                  <h2 className="text-base font-semibold">Aave</h2>
                  <p className="text-sm text-[#7b7b7b]"> Receive AAVE</p>
                </div>
              </div>
              <p className="rounded-full pr-2 text-lg font-semibold">{aaveValue}</p>
            </div>
          </div>

          {/* Clear Button */}
          <button
            type="button"
            onClick={() => {
              setEthAmount(0);
              setInputValue("");
            }}
            className="w-full rounded-full bg-[#222] py-2 text-white/60 transition-colors hover:bg-[#333]"
          >
            Clear
          </button>
        </div>
      </div>
    </MotionConfig>
  );
};

export const Skipper22 = AaveTokenSwap;
export const DemoSkipper22 = Skipper22;
export default Skipper22;
