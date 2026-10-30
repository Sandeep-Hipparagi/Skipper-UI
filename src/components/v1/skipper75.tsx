"use client";

import React, { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

interface CarouselNavProps {}

function CarouselNavButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      <button
        className={cn(
          "absolute left-0 top-1/2 flex size-10 -translate-x-full -translate-y-1/2 cursor-pointer items-center justify-end active:scale-95 transition-opacity",
          !canScrollPrev && "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeft className="size-5 text-black" />
        <span className="sr-only">Previous slide</span>
      </button>
      <button
        className={cn(
          "absolute -right-0 top-1/2 flex size-10 -translate-y-1/2 translate-x-full cursor-pointer items-center justify-start active:scale-95 transition-opacity",
          !canScrollNext && "opacity-0 pointer-events-none"
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ArrowRight className="size-5 text-black" />
        <span className="sr-only">Next slide</span>
      </button>
    </>
  );
}

const IPHONE_MODELS = [
  { src: "/images/oct25Coll/iphone17/1.png", label: "iPhone 17 Pro", current: true },
  { src: "/images/oct25Coll/iphone17/2.png", label: "iPhone 17", new: true },
  { src: "/images/oct25Coll/iphone17/3.png", label: "iPhone 17 Air", new: true },
  { src: "/images/oct25Coll/iphone17/4.png", label: "iPhone 16 Pro" },
  { src: "/images/oct25Coll/iphone17/5.png", label: "iPhone 16" },
  { src: "/images/oct25Coll/iphone17/6.png", label: "iPhone 16 E" },
  { src: "/images/oct25Coll/iphone17/7.png", label: "Compare" },
  { src: "/images/oct25Coll/iphone17/8.png", label: "Accessories" },
  { src: "/images/oct25Coll/iphone17/9.png", label: "iOS" },
];

export function Skipper75Carousel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <LayoutGroup>
      <motion.div
        transition={{
          type: "spring",
          stiffness: isOpen ? 200 : 350,
          damping: isOpen ? 30 : 40,
        }}
        className="font-sf-pro-display flex h-full w-full justify-center bg-[#f5f4f3] text-black"
      >
        <motion.nav
          initial={false}
          animate={{ borderRadius: isOpen ? "28px" : "18px" }}
          layout
          style={{
            paddingBlock: "12px",
            height: isOpen ? "fit-content" : "55px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.08)",
          }}
          className="m-2 w-full max-w-[1024px] overflow-hidden bg-white/90 shadow-xl"
        >
          <div className="flex w-full items-center justify-between px-4">
            <div>
              {!isOpen && (
                <motion.h2
                  layout
                  layoutId="title-header"
                  className="flex text-xl font-medium leading-[1.2] tracking-[0.012em]"
                >
                  iPhone 17 Pro
                </motion.h2>
              )}
            </div>
            <div className="flex h-8 items-center gap-2">
              <motion.div layout className="flex gap-2">
                <motion.button
                  initial={false}
                  animate={{
                    width: isOpen ? "42px" : "72px",
                    height: isOpen ? "42px" : "28px",
                    borderRadius: isOpen ? "38px" : "28px",
                    backgroundColor: isOpen ? "#000" : "transparent",
                  }}
                  transition={{ width: { duration: 0.2 } }}
                  className={cn(
                    "flex cursor-pointer items-center justify-center border text-xs font-medium transition-colors",
                    isOpen
                      ? "border-black text-white"
                      : "border-black/20 text-black hover:border-black"
                  )}
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {isOpen ? (
                    <motion.span
                      initial={{ opacity: 0, filter: "blur(4px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.3 }}
                      className="flex rotate-45 items-center justify-center text-white"
                    >
                      <Plus className="size-5 stroke-[2.5]" />
                    </motion.span>
                  ) : (
                    <motion.span
                      initial={false}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.2 }}
                    >
                      Explore
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
              {!isOpen && (
                <motion.button
                  layoutId="pre-Order"
                  className="relative inline-flex h-7 cursor-pointer items-center rounded-full bg-[#0071e3] px-3 font-medium tracking-[0.035em] text-white hover:bg-[#0077ed]"
                >
                  <motion.span layoutId="buyText" className="text-xs">
                    Buy
                  </motion.span>
                </motion.button>
              )}
            </div>
          </div>

          {isOpen && (
            <motion.div layout className="h-full px-8 pt-5 lg:px-14">
              <motion.div
                initial={{ opacity: 0, y: "-150%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-150%" }}
                className="mb-10 h-40 border-b border-black/10"
              >
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {IPHONE_MODELS.map((item, idx) => (
                      <CarouselItem
                        key={idx}
                        className="basis-1/4 pl-2 md:basis-1/6 md:pl-4"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: "-150%" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            bounce: 0,
                            type: "spring",
                            delay: 0.03 * idx,
                          }}
                          className="flex flex-col items-center"
                        >
                          <img
                            src={item.src}
                            className="h-16 object-contain"
                            alt={item.label}
                          />
                          <p className="pt-2 text-xs font-medium text-black">
                            {item.label}
                          </p>
                          {item.new && (
                            <p className="text-[10px] font-semibold text-orange-500">
                              New
                            </p>
                          )}
                          {item.current && (
                            <p className="text-[10px] text-black/40">
                              Currently Viewing
                            </p>
                          )}
                        </motion.div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselNavButtons />
                </Carousel>
              </motion.div>

              <div className="flex w-full flex-col justify-between gap-3 lg:flex-row">
                <motion.h2
                  layoutId="title-header"
                  className="text-3xl font-semibold leading-[1.2] lg:text-[40px]"
                >
                  iPhone 17 Pro
                </motion.h2>
                <motion.div className="flex w-full items-center justify-between gap-6 lg:w-fit">
                  <motion.div
                    initial={{ opacity: 0, y: "-250%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "-150%" }}
                    className="text-sm lg:text-right"
                  >
                    <b> From ₹82,900.00*</b>
                    <p className="text-black/60">
                      or ₹12,983.00/mo. for 6 mo.‡
                    </p>
                  </motion.div>
                  <motion.button
                    layoutId="pre-Order"
                    className="relative inline-flex h-11 cursor-pointer items-center rounded-full bg-[#0071e3] px-5 font-medium tracking-[0.035em] text-white hover:bg-[#0077ed]"
                  >
                    <motion.span layoutId="buyText" className="text-base font-semibold">
                      Buy
                    </motion.span>
                  </motion.button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: "-150%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-150%" }}
                className="mt-6 p-2 lg:p-5"
              >
                <div className="flex items-center gap-2 text-black/40 font-medium lg:text-xl">
                  Overview <ChevronDown className="size-4" />
                </div>
                <div className="mt-5 flex max-w-xl flex-wrap gap-2 lg:mt-6">
                  {[
                    "highlights",
                    "performance",
                    "design",
                    "shared features",
                    "cameras",
                    "accessories",
                  ].map((label, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "mr-2 cursor-pointer rounded-full px-4 py-1.5 text-center text-sm font-medium capitalize transition-colors",
                        idx === 0
                          ? "bg-black text-white"
                          : "bg-black/5 text-black hover:bg-black hover:text-white"
                      )}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: "-150%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "-150%" }}
                className="mt-2 space-y-4 p-2 lg:p-5"
              >
                <div className="flex cursor-pointer items-center gap-2 font-medium text-[#0071e3] hover:underline lg:text-[19px]">
                  Tech specs <ChevronRight className="size-4" />
                </div>
                <div className="flex cursor-pointer items-center gap-2 font-medium text-[#0071e3] hover:underline lg:text-[19px]">
                  Switch from Android <ChevronRight className="size-4" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.nav>
      </motion.div>
    </LayoutGroup>
  );
}

export function Skipper75() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-[#f5f4f3] pt-6">
      <Skipper75Carousel />
    </div>
  );
}

export { Skipper75 as DemoSkipper75 };
export default Skipper75;
