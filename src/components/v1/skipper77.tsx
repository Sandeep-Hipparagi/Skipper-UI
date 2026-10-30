"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
  type CarouselApi,
} from "@/components/ui/carousel";

function CarouselButtons() {
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
        <ArrowLeft className="size-5 text-white" />
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
        <ArrowRight className="size-5 text-white" />
        <span className="sr-only">Next slide</span>
      </button>
    </>
  );
}

const FEATURES = [
  {
    id: 1,
    name: "colors",
    desc: "Choose from three bold finishes. iPhone 17 Pro shown in Cosmic Orange",
    desc2: "Available in Cosmic Orange, Natural Titanium, and Space Black. Each finish crafted with precision.",
    src: "/images/oct25Coll/iphone17pro/1a.jpg",
  },
  {
    id: 2,
    name: "aluminum unibody",
    desc: "Optimized for performance and battery. Aluminum alloy is remarkably light and has exceptional thermal conductivity.",
    desc2: "Precision-machined from aerospace-grade aluminum. Engineered for durability while maintaining elegant aesthetics.",
    src: "/images/oct25Coll/iphone17pro/2.jpg",
  },
  {
    id: 3,
    name: "vapor chamber",
    desc: "Deionized water sealed inside moves heat away from the A19 Pro chip, allowing for even higher sustained performance.",
    desc2: "Advanced thermal management system ensures consistent performance during intensive tasks and gaming sessions.",
    src: "/images/oct25Coll/iphone17pro/3.jpg",
  },
  {
    id: 4,
    name: "ceramic shield",
    desc: "Protects the back of iPhone 17 Pro, making it 4x more resistant to cracks. New Ceramic Shield 2 on the front has 3x better scratch resistance.",
    desc2: "Industry-leading protection technology. Ceramic Shield 2 provides superior durability against drops and scratches.",
    src: "/images/oct25Coll/iphone17pro/4.jpg",
  },
  {
    id: 5,
    name: "immersive pro display",
    desc: "Our best‑ever 6.3‑inch and 6.9‑inch Super Retina XDR displays. Brighter. Better anti‑reflection. ProMotion up to 120Hz.",
    desc2: "Stunning visual experience with True Tone technology. Dynamic Island seamlessly integrates with your content.",
    src: "/images/oct25Coll/iphone17pro/5.jpg",
  },
  {
    id: 6,
    name: "camera control",
    desc: "Instantly take a photo, record video, adjust settings, and more. So you never miss a moment.",
    desc2: "Professional-grade camera system with advanced computational photography. Capture memories in stunning detail.",
    src: "/images/oct25Coll/iphone17pro/6.jpg",
  },
  {
    id: 7,
    name: "Action button",
    desc: "A customizable fast track to your favorite feature. Long press to launch the action you want — Silent mode, Translation, Shortcuts, and more.",
    desc2: "Enhanced productivity with programmable actions. Quick access to your most-used features and shortcuts.",
    src: "/images/oct25Coll/iphone17pro/7.jpg",
  },
];

const COLORS = [
  { id: 0, color: "#fff", src: "/images/oct25Coll/iphone17pro/1a.jpg" },
  { id: 1, color: "#F77313", src: "/images/oct25Coll/iphone17pro/1c.jpg" },
  { id: 2, color: "#2B3145", src: "/images/oct25Coll/iphone17pro/1b.jpg" },
];

export function Skipper77() {
  const [active, setActive] = useState(0);
  const [activeColor, setActiveColor] = useState(1);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setActive(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (api && api.selectedScrollSnap() !== active) {
      api.scrollTo(active);
    }
  }, [api, active]);

  return (
    <LayoutGroup>
      <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-t from-black to-[#1a1a1a] p-4 text-white">
        <div className="relative flex h-[745px] w-full max-w-[90rem] flex-col justify-end overflow-hidden rounded-[2.5rem] bg-black pb-5 shadow-2xl">
          <div className="relative z-10 flex w-full">
            <Carousel className="w-full" setApi={setApi}>
              <CarouselContent className="-ml-1 flex items-end">
                {FEATURES.map((item, idx) => (
                  <CarouselItem
                    key={idx}
                    className="w-full basis-[85%] pl-2 first:ml-10 last:mr-10 md:basis-[45%] lg:basis-[35%]"
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
                      style={{ borderRadius: "25px" }}
                      className="flex h-fit w-full items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/15"
                    >
                      {active === idx ? (
                        <motion.div
                          initial={{ opacity: 0, filter: "blur(2px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          transition={{ duration: 0.5, delay: 0.25 }}
                          className="p-6 text-lg"
                        >
                          <div>
                            <b className="capitalize">{item.name}.</b>{" "}
                            <span>{item.desc}</span>{" "}
                            <span className="hidden md:inline-block opacity-70 text-sm">
                              {item.desc2}
                            </span>
                          </div>
                          {idx === 0 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                              {COLORS.map((c) => (
                                <button
                                  key={c.id}
                                  onClick={() => setActiveColor(c.id)}
                                  style={{ backgroundColor: c.color }}
                                  className="size-6 cursor-pointer rounded-full border-b border-white shadow"
                                />
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.button
                          initial={{ opacity: 0, filter: "blur(2px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(2px)" }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                          onClick={() => setActive(idx)}
                          className={cn(
                            "flex h-[56px] w-full cursor-pointer items-center gap-[14px] rounded-full",
                            idx > active ? "justify-start pl-4" : "justify-end pr-4"
                          )}
                        >
                          {idx > active ? <ArrowRight className="size-5" /> : <ArrowLeft className="size-5" />}
                        </motion.button>
                      )}
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselButtons />
            </Carousel>
          </div>

          <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: "15%", scale: 0.9 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1.2,
                  transition: { delay: 0.2, type: "spring", stiffness: 350, damping: 30 },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                exit={{ opacity: 0, x: "-15%", scale: 0.9 }}
                className="h-full w-full"
              >
                <img
                  src={
                    active === 0 && activeColor !== null
                      ? COLORS[activeColor].src
                      : FEATURES[active].src
                  }
                  alt=""
                  className="h-full w-full object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}

export { Skipper77 as DemoSkipper77 };
export default Skipper77;
