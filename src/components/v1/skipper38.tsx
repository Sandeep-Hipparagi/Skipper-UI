"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  "Store",
  "Mac",
  "iPad",
  "iPhone",
  "Watch",
  "AirPods",
  "Vision",
  "TV & Home",
  "Entertainment",
  "Support",
];

export interface NavColumnData {
  title: string;
  items: string[];
}

export interface NavMenuData {
  firstUl: NavColumnData;
  secondUl: NavColumnData;
  thirdUl: NavColumnData;
}

export const menuCategories: Record<string, NavMenuData> = {
  Store: {
    firstUl: {
      title: "Shop",
      items: ["Shop the latest", "Mac", "iPad", "iPhone", "Watch", "AirPods", "Vision"],
    },
    secondUl: {
      title: "Quick Links",
      items: ["Find a store", "Help me choose", "Check order status", "Contact us"],
    },
    thirdUl: {
      title: "Shop Special Features",
      items: ["Refurbished", "Trade In", "Education", "Business"],
    },
  },
  Mac: {
    firstUl: {
      title: "Mac",
      items: ["Shop Mac", "MacBook Air", "MacBook Pro", "iMac", "Mac mini", "Mac Studio", "Mac Pro"],
    },
    secondUl: {
      title: "Compare Mac",
      items: ["Choose your Mac", "Mac vs PC", "Which Mac is right for you?", "Shop with a Specialist"],
    },
    thirdUl: {
      title: "More from Mac",
      items: ["Mac Support", "AppleCare+ for Mac", "macOS Sonoma", "Continuity"],
    },
  },
  iPad: {
    firstUl: {
      title: "iPad",
      items: ["Shop iPad", "iPad Pro", "iPad Air", "iPad", "iPad mini", "Apple Pencil", "Smart Keyboard"],
    },
    secondUl: {
      title: "Compare iPad",
      items: ["Choose your iPad", "iPad vs MacBook", "Which iPad is right for you?", "Shop with a Specialist"],
    },
    thirdUl: {
      title: "More from iPad",
      items: ["iPad Support", "AppleCare+ for iPad", "iPadOS 17", "Apple Pencil"],
    },
  },
  iPhone: {
    firstUl: {
      title: "iPhone",
      items: ["Shop iPhone", "iPhone 15 Pro", "iPhone 15", "iPhone 14", "iPhone SE", "Compare iPhone", "AirPods"],
    },
    secondUl: {
      title: "Switch to iPhone",
      items: ["Move to iOS", "Shop iPhone", "iPhone at Work", "Shop with a Specialist"],
    },
    thirdUl: {
      title: "More from iPhone",
      items: ["iPhone Support", "AppleCare+ for iPhone", "iOS 17", "Privacy"],
    },
  },
  Watch: {
    firstUl: {
      title: "Watch",
      items: ["Shop Apple Watch", "Apple Watch Series 9", "Apple Watch SE", "Apple Watch Ultra 2", "Compare Apple Watch", "Apple Watch Studio"],
    },
    secondUl: {
      title: "More from Watch",
      items: ["Apple Watch Support", "AppleCare+ for Apple Watch", "watchOS 10", "Apple Fitness+"],
    },
    thirdUl: {
      title: "Shop Watch Accessories",
      items: ["Apple Watch Bands", "AirPods", "Apple TV+", "Apple One"],
    },
  },
  AirPods: {
    firstUl: {
      title: "AirPods",
      items: ["Shop AirPods", "AirPods Pro", "AirPods", "AirPods Max", "AirPods (3rd generation)", "Compare AirPods"],
    },
    secondUl: {
      title: "More from AirPods",
      items: ["AirPods Support", "AppleCare+ for AirPods", "Apple Music", "Spatial Audio"],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: ["AirPods Cases", "Lightning Cables", "Wireless Charging", "Apple TV+"],
    },
  },
  Vision: {
    firstUl: {
      title: "Vision",
      items: ["Shop Apple Vision Pro", "Apple Vision Pro", "Compare Apple Vision Pro", "AppleCare+ for Vision Pro"],
    },
    secondUl: {
      title: "More from Vision",
      items: ["Vision Pro Support", "visionOS", "Apple TV+", "Apple Arcade"],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: ["Vision Pro Accessories", "Apple TV+", "Apple Music", "Apple One"],
    },
  },
  "TV & Home": {
    firstUl: {
      title: "TV & Home",
      items: ["Shop Apple TV", "Apple TV 4K", "Apple TV+", "HomePod", "HomePod mini", "Apple TV app"],
    },
    secondUl: {
      title: "More from TV & Home",
      items: ["Apple TV Support", "HomePod Support", "AppleCare+", "Apple Music"],
    },
    thirdUl: {
      title: "Shop Accessories",
      items: ["Apple TV Remote", "HomeKit", "Apple TV+", "Apple Arcade"],
    },
  },
  Entertainment: {
    firstUl: {
      title: "Entertainment",
      items: ["Apple TV+", "Apple Music", "Apple Arcade", "Apple Podcasts", "Apple Books", "App Store"],
    },
    secondUl: {
      title: "Support",
      items: ["Apple TV+ Support", "Apple Music Support", "Apple Arcade Support", "Apple Books Support"],
    },
    thirdUl: {
      title: "Account",
      items: ["Manage your Apple ID", "Apple One", "Apple Account", "Privacy"],
    },
  },
  Support: {
    firstUl: {
      title: "Support",
      items: ["Apple Support", "AppleCare+", "AppleCare Products", "Apple Support App", "Apple Support Community"],
    },
    secondUl: {
      title: "More from Support",
      items: ["Contact Apple Support", "Apple Support Phone Numbers", "Apple Support Chat", "Apple Support Email"],
    },
    thirdUl: {
      title: "Resources",
      items: ["Apple Manuals", "Apple Software Downloads", "Apple Service Programs", "Apple Legal"],
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: "-20%" },
  visible: { opacity: 1, y: 0 },
};

const listVariants = {
  visible: { transition: { staggerChildren: 0.06 } },
};

const NavColumn: React.FC<{ title: string; items: string[]; isLarge?: boolean }> = ({
  title,
  items,
  isLarge = false,
}) => (
  <motion.ul
    className="space-y-2"
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={listVariants}
  >
    <motion.li variants={itemVariants} transition={{ duration: 0.3 }} className="my-4 text-xs opacity-50">
      {title}
    </motion.li>
    {items.map((item, index) => (
      <motion.li
        key={index}
        variants={itemVariants}
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer tracking-tight transition-colors hover:text-blue-500",
          isLarge ? "group relative flex items-center text-2xl font-semibold" : "text-sm font-medium"
        )}
      >
        {item}
        {isLarge && (
          <ArrowRight className="absolute -right-8 size-5 opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
        )}
      </motion.li>
    ))}
  </motion.ul>
);

const SearchIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 17 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m16.2294 29.9556-4.1755-4.0821a6.4711 6.4711 0 1 0 -1.2839 1.2625l4.2005 4.1066a.9.9 0 1 0 1.2588-1.287zm-14.5294-8.0017a5.2455 5.2455 0 1 1 5.2455 5.2527 5.2549 5.2549 0 0 1 -5.2455-5.2527z" />
  </svg>
);

const BagIcon: React.FC = () => (
  <svg className="h-4 w-4" viewBox="0 0 17 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="m13.4575 16.9268h-1.1353a3.8394 3.8394 0 0 0 -7.6444 0h-1.1353a2.6032 2.6032 0 0 0 -2.6 2.6v8.9232a2.6032 2.6032 0 0 0 2.6 2.6h9.915a2.6032 2.6032 0 0 0 2.6-2.6v-8.9231a2.6032 2.6032 0 0 0 -2.6-2.6001zm-4.9575-2.2768a2.658 2.658 0 0 1 2.6221 2.2764h-5.2442a2.658 2.658 0 0 1 2.6221-2.2764zm6.3574 13.8a1.4014 1.4014 0 0 1 -1.4 1.4h-9.9149a1.4014 1.4014 0 0 1 -1.4-1.4v-8.9231a1.4014 1.4014 0 0 1 1.4-1.4h9.915a1.4014 1.4014 0 0 1 1.4 1.4z" />
  </svg>
);

export const AppleNavbar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeCategory = activeMenu ? menuCategories[activeMenu] : null;
  const isExpanded = !!activeMenu || isMobileOpen;

  return (
    <nav className="absolute top-0 left-0 z-50 flex w-screen flex-col items-center justify-center">
      <div className="relative z-30 flex w-full items-center justify-center bg-white/80 backdrop-blur-md border-b border-black/5">
        <ul className="flex w-full max-w-[1024px] items-center justify-between gap-5 px-6 py-3 text-xs text-neutral-800">
          <motion.li
            className="text-lg font-bold cursor-pointer"
            animate={{ opacity: isMobileOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            
          </motion.li>

          {navItems.map((item, index) => (
            <li
              key={index}
              className="hidden cursor-pointer font-medium tracking-tight hover:text-black lg:block"
              onMouseEnter={() => setActiveMenu(item)}
            >
              {item}
            </li>
          ))}

          <li className="flex items-center justify-center gap-5">
            <motion.span animate={{ opacity: isMobileOpen ? 0 : 1 }} transition={{ duration: 0.3 }}>
              <SearchIcon />
            </motion.span>
            <motion.span animate={{ opacity: isMobileOpen ? 0 : 1 }} transition={{ duration: 0.3 }}>
              <BagIcon />
            </motion.span>
            <span
              className="cursor-pointer block lg:hidden"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </span>
          </li>
        </ul>
      </div>

      {/* Mega dropdown menu */}
      <motion.div
        initial={{ height: "0px" }}
        animate={{ height: isExpanded ? "auto" : "0px" }}
        transition={{ ease: [0.645, 0.045, 0.355, 1], duration: 0.5 }}
        onMouseLeave={() => setActiveMenu(null)}
        className="relative z-30 flex w-full justify-center overflow-hidden bg-white text-black shadow-xl"
      >
        <AnimatePresence>
          {activeCategory && !isMobileOpen && (
            <motion.div
              exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
              className="flex w-full max-w-[1024px] gap-32 pb-20 pt-10 px-6"
            >
              <NavColumn
                title={activeCategory.firstUl.title}
                items={activeCategory.firstUl.items}
                isLarge
              />
              <NavColumn
                title={activeCategory.secondUl.title}
                items={activeCategory.secondUl.items}
              />
              <NavColumn
                title={activeCategory.thirdUl.title}
                items={activeCategory.thirdUl.items}
              />
            </motion.div>
          )}

          {isMobileOpen && (
            <div className="h-screen w-screen bg-white p-8">
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                className="flex flex-col gap-5 text-3xl font-semibold tracking-tight"
              >
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={{ hidden: { opacity: 0, y: "-10%" }, visible: { opacity: 1, y: 0 } }}
                    className="flex cursor-pointer items-center justify-between py-1 border-b border-black/5"
                  >
                    {item}
                    <ArrowRight className="size-5 opacity-40" />
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Backdrop blur overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: activeMenu ? 1 : 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="pointer-events-none absolute left-0 top-0 z-10 h-screen w-screen bg-black/20 backdrop-blur-xl"
      />
    </nav>
  );
};

export const Skipper38: React.FC = () => {
  return (
    <div className="relative h-full min-h-[600px] w-full bg-[#F2F2F4] text-black">
      <AppleNavbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-900 mt-20">
          MacBook Pro
        </h1>
        <p className="text-xl text-neutral-600 mt-3">
          Mind-blowing. Head-turning.
        </p>
      </div>
    </div>
  );
};

export const DemoSkipper38 = Skipper38;
export default Skipper38;
