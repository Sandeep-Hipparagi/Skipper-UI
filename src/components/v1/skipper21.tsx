"use client";

import React, { useState, useRef, useMemo, ReactNode } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import useMeasure from "react-use-measure";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Key,
  ArrowRight,
  ChevronLeft,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Metamask SVG ---
export const MetamaskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="34.14" height="32" viewBox="0 0 256 240" {...props}>
    <path fill="#E17726" d="M250.066 0L140.219 81.279l20.427-47.9z" />
    <path
      fill="#E27625"
      d="m6.191.096l89.181 33.289l19.396 48.528zM205.86 172.858l48.551.924l-16.968 57.642l-59.243-16.311zm-155.721 0l27.557 42.255l-59.143 16.312l-16.865-57.643z"
    />
    <path
      fill="#E27625"
      d="m112.131 69.552l1.984 64.083l-59.371-2.701l16.888-25.478l.214-.245zm31.123-.715l40.9 36.376l.212.244l16.888 25.478l-59.358 2.7zM79.435 173.044l32.418 25.259l-37.658 18.181zm97.136-.004l5.131 43.445l-37.553-18.184z"
    />
    <path
      fill="#D5BFB2"
      d="m144.978 195.922l38.107 18.452l-35.447 16.846l.368-11.134zm-33.967.008l-2.909 23.974l.239 11.303l-35.53-16.833z"
    />
    <path fill="#233447" d="m100.007 141.999l9.958 20.928l-33.903-9.932zm55.985.002l24.058 10.994l-34.014 9.929z" />
    <path
      fill="#CC6228"
      d="m82.026 172.83l-5.48 45.04l-29.373-44.055zm91.95.001l34.854.984l-29.483 44.057zm28.136-44.444l-25.365 25.851l-19.557-8.937l-9.363 19.684l-6.138-33.849zm-148.237 0l60.435 2.749l-6.139 33.849l-9.365-19.681l-19.453 8.935z"
    />
    <path
      fill="#F5841F"
      d="m180.392 103.99l55.913 16.279l18.165 55.986h-47.924l-33.02.416l24.014-46.808zm-104.784 0l-17.151 25.873l24.017 46.808l-33.005-.416H1.631l18.063-55.985zm87.776-70.878l-15.639 42.239l-3.319 57.06l-1.27 17.885l-.101 45.688h-30.111l-.098-45.602l-1.274-17.986l-3.32-57.045l-15.637-42.239z"
    />
  </svg>
);

// --- Coinbase SVG ---
export const CoinbaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" {...props}>
    <circle cx="10" cy="10" r="10" fill="#0852FF" />
    <rect rx="27%" width="20" height="20" fill="#0852FF" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.0001 17C13.8661 17 17.0001 13.866 17.0001 10C17.0001 6.13401 13.8661 3 10.0001 3C6.13413 3 3.00012 6.13401 3.00012 10C3.00012 13.866 6.13413 17 10.0001 17ZM8.25012 7.71429C7.95427 7.71429 7.71441 7.95414 7.71441 8.25V11.75C7.71441 12.0459 7.95427 12.2857 8.25012 12.2857H11.7501C12.046 12.2857 12.2858 12.0459 12.2858 11.75V8.25C12.2858 7.95414 12.046 7.71429 11.7501 7.71429H8.25012Z"
      fill="white"
    />
  </svg>
);

// --- Phantom SVG ---
export const PhantomIcon: React.FC = () => (
  <div className="flex size-6 items-center justify-center rounded-full bg-[#AB9EF2]">
    <svg xmlns="http://www.w3.org/2000/svg" width="593" height="493" viewBox="0 0 593 493" fill="none" className="size-4">
      <path
        d="M70.0546 493C145.604 493 202.38 427.297 236.263 375.378C232.142 386.865 229.852 398.351 229.852 409.378C229.852 439.703 247.252 461.297 281.592 461.297C328.753 461.297 379.119 419.946 405.218 375.378C403.386 381.811 402.471 387.784 402.471 393.297C402.471 414.432 414.375 427.757 438.643 427.757C515.108 427.757 592.03 292.216 592.03 173.676C592.03 81.3243 545.327 0 428.112 0C222.069 0 0 251.784 0 414.432C0 478.297 34.3405 493 70.0546 493ZM357.141 163.568C357.141 140.595 369.962 124.514 388.734 124.514C407.049 124.514 419.87 140.595 419.87 163.568C419.87 186.541 407.049 203.081 388.734 203.081C369.962 203.081 357.141 186.541 357.141 163.568ZM455.126 163.568C455.126 140.595 467.947 124.514 486.719 124.514C505.034 124.514 517.855 140.595 517.855 163.568C517.855 186.541 505.034 203.081 486.719 203.081C467.947 203.081 455.126 186.541 455.126 163.568Z"
        fill="#FFFDF8"
      />
    </svg>
  </div>
);

// --- Trust Wallet SVG ---
export const TrustWalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" {...props}>
    <g fill="none">
      <path fill="#0500FF" d="M3.9 5.6L12 3v18c-5.786-2.4-8.1-7-8.1-9.6z" />
      <path fill="url(#tokenBrandedTrust0)" d="M20.1 5.6L12 3v18c5.786-2.4 8.1-7 8.1-9.6z" />
      <defs>
        <linearGradient id="tokenBrandedTrust0" x1="17.948" x2="11.967" y1="1.74" y2="20.797" gradientUnits="userSpaceOnUse">
          <stop offset=".02" stopColor="#00F" />
          <stop offset=".08" stopColor="#0094FF" />
          <stop offset=".16" stopColor="#48FF91" />
          <stop offset=".42" stopColor="#0094FF" />
          <stop offset=".68" stopColor="#0038FF" />
          <stop offset=".9" stopColor="#0500FF" />
        </linearGradient>
      </defs>
    </g>
  </svg>
);

// --- MovingBorder & Button primitives ---
// FIX: Strongly type MovingBorderProps to eliminate any index signature
export interface MovingBorderProps extends React.SVGProps<SVGSVGElement> {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}

export const MovingBorder: React.FC<MovingBorderProps> = ({
  children,
  duration = 3000,
  rx,
  ry,
  ...otherProps
}) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMs = length / duration;
      progress.set((time * pxPerMs) % length);
    }
  });

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x);
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        {...otherProps}
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};

// FIX: Strongly type ButtonProps with React.ElementType and ButtonHTMLAttributes
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export function Button({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <Component
      className={cn("relative overflow-hidden bg-transparent p-[1px] text-xl", containerClassName)}
      style={{ borderRadius }}
      {...otherProps}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </MovingBorder>
      </div>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center border border-slate-800 bg-slate-900/[0.8] text-sm text-white antialiased backdrop-blur-xl",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </Component>
  );
}

// --- Views for Skipper21 ---
type ViewType = "signin" | "email-otp" | "phone-otp" | "passkey" | "wallet";

interface ViewProps {
  setView: (view: ViewType) => void;
}

const loginMethods = ["Email", "Phone", "Passkey"];

function SignInView({ setView }: ViewProps) {
  const [val, setVal] = useState("");
  const [method, setMethod] = useState("Email");

  const getMethodConfig = (m: string) => {
    switch (m) {
      case "Email":
        return { type: "email", placeholder: "user@example.com", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" };
      case "Phone":
        return { type: "tel", placeholder: "+1 (555) 123-4567", pattern: "^[+]?[0-9\\s\\-\\(\\)]{10,}$" };
      case "Passkey":
        return { type: "text", placeholder: "Login with passkey", pattern: "^[a-zA-Z0-9]{6,}$" };
      default:
        return { type: "email", placeholder: "email@example.com", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" };
    }
  };

  const handleContinue = () => {
    if (method === "Passkey") return setView("passkey");
    const config = getMethodConfig(method);
    const reg = new RegExp(config.pattern);
    if (!val.trim()) return alert("Please enter a value");
    if (!reg.test(val)) return alert(`Please enter a valid ${method.toLowerCase()}`);
    if (method === "Email") setView("email-otp");
    else if (method === "Phone") setView("phone-otp");
  };

  const isValid = () => {
    if (method === "Passkey") return true;
    const config = getMethodConfig(method);
    return val.trim().length > 0 && new RegExp(config.pattern).test(val);
  };

  const config = getMethodConfig(method);

  return (
    <div>
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="flex items-center justify-between px-6 py-6 text-center text-xl font-semibold tracking-tight sm:font-medium">
          <span className="select-none">Sign In</span>
        </h2>
      </div>
      <div className="flex flex-col gap-4 pt-2">
        <div className="flex flex-col gap-2 px-6">
          <div className="bg-muted2 flex h-12 w-full items-center rounded-2xl px-1">
            <div className="relative mx-auto flex w-full items-center">
              <ul className="mx-auto flex w-full flex-row justify-center gap-2">
                {loginMethods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-label={`Select ${item}`}
                    className={cn(
                      "relative flex h-10 w-full cursor-pointer items-center justify-center px-3 py-1.5 text-center text-base font-semibold transition-colors duration-200 ease-out sm:font-medium",
                      method === item ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setMethod(item)}
                  >
                    {method === item && (
                      <motion.div
                        layoutId="selected-method"
                        className="bg-foreground/5 absolute inset-0 rounded-xl"
                      />
                    )}
                    <span className="relative select-none text-inherit">{item}</span>
                  </button>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-muted2 flex h-12 w-full items-center justify-start gap-3 overflow-hidden rounded-2xl pl-4 pr-1 text-base">
            <div className="flex w-full items-center justify-start">
              {method === "Passkey" ? (
                <div className="flex items-center gap-3">
                  <Key className="text-muted-foreground h-6 w-6" />
                  <span className="w-full text-base font-medium tracking-tight opacity-50">
                    {config.placeholder}
                  </span>
                </div>
              ) : (
                <input
                  placeholder={config.placeholder}
                  autoFocus
                  className="w-full bg-transparent text-base font-medium outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  type={config.type}
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                />
              )}
            </div>
            <button
              aria-label="Continue"
              type="submit"
              className={cn(
                "group flex h-10 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ease-out",
                isValid()
                  ? "cursor-pointer bg-[#4EAFFF] text-white hover:bg-[#4EAFFF]/90 active:scale-95"
                  : "bg-muted3 text-muted-foreground cursor-not-allowed"
              )}
              onClick={handleContinue}
              disabled={!isValid()}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="relative">
            <div className="absolute inset-0 flex h-10 items-center">
              <span className="w-full rounded-full border-t opacity-20" />
            </div>
            <div className="relative flex h-10 justify-center text-xs uppercase">
              <span className="bg-muted text-muted-foreground flex items-center justify-center px-2 font-medium">
                Or
              </span>
            </div>
          </div>
          <button
            onClick={() => setView("wallet")}
            className="flex h-12 w-full cursor-pointer select-none items-center justify-center gap-2 rounded-full bg-[#4EAFFF] text-base font-semibold text-white transition-all duration-200 ease-out hover:bg-[#4EAFFF]/80 focus:scale-95 active:scale-95 sm:font-medium"
          >
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}

function EmailOtpView({ setView }: ViewProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-semibold tracking-tight sm:font-medium">
        <button
          onClick={() => setView("signin")}
          className="bg-muted4 text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75"
        >
          <ChevronLeft className="opacity-45" />
        </button>
        <h2 className="select-none">Confirm Email</h2>
        <span className="size-8 opacity-0" />
      </div>
      <div className="space-y-6 px-6 text-center">
        <div>
          <p className="text-muted-foreground">Enter the verification code sent to</p>
          <h1 className="font-medium tracking-tight">yo@guri.in</h1>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-email-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = [...digits];
                  next[idx] = val;
                  setDigits(next);
                  if (val && idx < 5) {
                    const nextEl = document.getElementById(`otp-email-${idx + 1}`);
                    nextEl?.focus();
                  }
                }}
                className="bg-muted4 h-11 w-full rounded-xl text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-foreground/20"
              />
            ))}
          </div>
          <button
            onClick={() => setView("signin")}
            className="mb-6 w-full rounded-full bg-green-500 py-3 font-semibold text-white transition-colors"
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
}

function PhoneOtpView({ setView }: ViewProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-semibold tracking-tight sm:font-medium">
        <button
          onClick={() => setView("signin")}
          className="bg-muted4 text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75"
        >
          <ChevronLeft className="opacity-45" />
        </button>
        <h2 className="select-none">Confirm Phone</h2>
        <span className="size-8 opacity-0" />
      </div>
      <div className="space-y-6 px-6 text-center">
        <div>
          <p className="text-muted-foreground">Enter the verification code sent to</p>
          <h1 className="font-medium tracking-tight">+1 (555) 123-4567</h1>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-phone-${idx}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const val = e.target.value;
                  const next = [...digits];
                  next[idx] = val;
                  setDigits(next);
                  if (val && idx < 5) {
                    const nextEl = document.getElementById(`otp-phone-${idx + 1}`);
                    nextEl?.focus();
                  }
                }}
                className="bg-muted4 h-11 w-full rounded-xl text-center text-lg font-semibold outline-none focus:ring-2 focus:ring-foreground/20"
              />
            ))}
          </div>
          <button
            onClick={() => setView("signin")}
            className="mb-6 w-full rounded-full bg-green-500 py-3 font-semibold text-white transition-colors"
          >
            Verify Code
          </button>
        </div>
      </div>
    </div>
  );
}

function PasskeyView({ setView }: ViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-semibold tracking-tight sm:font-medium">
        <button
          onClick={() => setView("signin")}
          className="bg-muted4 text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75"
        >
          <ChevronLeft className="opacity-45" />
        </button>
        <h2 className="select-none">Passkey</h2>
        <span className="size-8 opacity-0" />
      </div>
      <div className="flex flex-col items-center justify-center space-y-6 px-6 text-center">
        <Button
          duration={1500}
          borderRadius="30px"
          containerClassName="p-[6px]"
          className="bg-muted2 border-muted4 flex size-20 items-center justify-center !rounded-[24px]"
        >
          <Key className="size-8 opacity-45" />
        </Button>
        <div>
          <h1 className="text-xl font-medium tracking-tight">Waiting for passkey</h1>
          <p className="text-muted-foreground mt-1 max-w-xs text-sm">
            Please follow prompts to verify your passkey.
          </p>
        </div>
        <button
          onClick={() => setView("signin")}
          className="mb-6 w-full rounded-full bg-[#4EAFFF] py-3 font-semibold text-white transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function WalletView({ setView }: ViewProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 px-6 py-6 text-center text-xl font-semibold tracking-tight sm:font-medium">
        <button
          onClick={() => setView("signin")}
          className="bg-muted4 text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75"
        >
          <ChevronLeft className="opacity-45" />
        </button>
        <h2 className="select-none">Connect Wallet</h2>
        <span className="size-8 opacity-0" />
      </div>
      <div className="space-y-2 px-6 pb-6 text-center">
        <div
          onClick={() => setView("signin")}
          className="bg-muted2 hover:bg-muted4 flex h-15 cursor-pointer items-center justify-between rounded-2xl px-4 transition-colors"
        >
          <h1 className="text-lg font-medium tracking-tight">Metamask</h1>
          <MetamaskIcon className="size-6" />
        </div>
        <div
          onClick={() => setView("signin")}
          className="bg-muted2 hover:bg-muted4 flex h-15 cursor-pointer items-center justify-between rounded-2xl px-4 transition-colors"
        >
          <h1 className="text-lg font-medium tracking-tight">Coinbase</h1>
          <CoinbaseIcon className="size-6" />
        </div>
        <div
          onClick={() => setView("signin")}
          className="bg-muted2 hover:bg-muted4 flex h-15 cursor-pointer items-center justify-between rounded-2xl px-4 transition-colors"
        >
          <h1 className="text-lg font-medium tracking-tight">Phantom</h1>
          <PhantomIcon />
        </div>
        <div
          onClick={() => setView("signin")}
          className="bg-muted2 hover:bg-muted4 flex h-15 cursor-pointer items-center justify-between rounded-2xl px-4 transition-colors"
        >
          <h1 className="text-lg font-medium tracking-tight">Trust Wallet</h1>
          <TrustWalletIcon className="size-6" />
        </div>
      </div>
    </div>
  );
}

export const Skipper21: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<ViewType>("signin");
  const [measureRef, bounds] = useMeasure();

  const currentView = useMemo(() => {
    switch (view) {
      case "signin":
        return <SignInView setView={setView} />;
      case "email-otp":
        return <EmailOtpView setView={setView} />;
      case "phone-otp":
        return <PhoneOtpView setView={setView} />;
      case "passkey":
        return <PasskeyView setView={setView} />;
      case "wallet":
        return <WalletView setView={setView} />;
    }
  }, [view]);

  return (
    <div className="h-full w-full">
      <div className="bg-muted flex h-full min-h-[600px] w-full flex-col items-center justify-center">
        <div className="mb-40 grid content-start justify-items-center gap-6 text-center">
          <span className="after:to-foreground relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:content-['']">
            Click to open sign in
          </span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-muted4 rounded-full px-6 py-2.5 font-medium transition-transform active:scale-95"
        >
          Sign In
        </button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <Dialog.Content className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-[361px] overflow-hidden rounded-[36px] bg-[#1a1a1a] text-white shadow-2xl outline-none md:w-full">
            <Dialog.Title className="hidden">Sign In Dialog</Dialog.Title>
            <motion.div
              animate={{
                height: bounds.height > 0 ? bounds.height : "auto",
                transition: { duration: 0.27, ease: [0.25, 1, 0.5, 1] },
              }}
            >
              <Dialog.Close asChild>
                <button
                  className="bg-muted4 text-foreground absolute right-6 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-transform focus:scale-95 active:scale-75"
                >
                  <Plus className="rotate-45 opacity-45" />
                </button>
              </Dialog.Close>

              <div ref={measureRef} className="bg-muted">
                <AnimatePresence initial={false} mode="popLayout" custom={view}>
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.27, ease: [0.26, 0.08, 0.25, 1] }}
                  >
                    {currentView}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export const DemoSkipper21 = Skipper21;
export default Skipper21;
