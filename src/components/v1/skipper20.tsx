"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, Check, ChevronDown } from "lucide-react";

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface UniSwapCountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (country: Country) => void;
  selectedCountry: Country | null;
}

const COUNTRIES_URL = "/data/countries.json";

export const UniSwapCountryDialog: React.FC<UniSwapCountryDialogProps> = ({
  isOpen,
  onClose,
  onSelectCountry,
  selectedCountry,
}) => {
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const autoDetectRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetch(COUNTRIES_URL)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load local country data");
        return response.json() as Promise<Country[]>;
      })
      .then((data) => {
        if (active) setCountries(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!autoDetectRef.current && countries.length > 0) {
      const detectCode = (() => {
        try {
          const lang =
            navigator.language ||
            (navigator.languages && navigator.languages[0]) ||
            "en-US";
          const part = lang.split("-")[1] || lang.split("_")[1];
          return part ? part.toUpperCase() : null;
        } catch {
          return null;
        }
      })();

      if (detectCode) {
        const found = countries.find((c) => c.code === detectCode);
        if (found) onSelectCountry(found);
      }
      autoDetectRef.current = true;
    }
  }, [countries, onSelectCountry]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const lower = search.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower)
    );
  }, [countries, search]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-full max-h-[700px] w-[450px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-[#303030] bg-[#131313] p-0 text-white shadow-2xl outline-none">
          <div className="p-5 pb-0">
            <Dialog.Title className="text-base font-medium tracking-tight">
              Select your region
            </Dialog.Title>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-[#3A3A3A] bg-[#1F1F1F] px-3 py-2">
              <Search className="size-5 stroke-[1.5] text-[#737373]" />
              <input
                type="text"
                placeholder="Search by country or region"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm tracking-tight outline-none placeholder:text-[#737373]"
              />
            </div>
          </div>

          <div className="h-full overflow-y-auto pt-3">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-[#737373]">Loading countries...</div>
              </div>
            ) : loadError ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-red-400">
                  Unable to load the local country list.
                </div>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-sm text-[#737373]">
                  {search ? "No countries found" : "No countries available"}
                </div>
              </div>
            ) : (
              <ul className="w-full">
                {filteredCountries.map((country, index) => (
                  <li
                    key={`${country.code}-${index}`}
                    className="relative flex h-[56px] cursor-pointer items-center gap-3 px-5 transition-colors duration-150 hover:bg-[#252525]"
                    onClick={() => {
                      onSelectCountry(country);
                      onClose();
                    }}
                  >
                    <div className="flex size-8 items-center justify-center overflow-hidden rounded-full text-xl leading-none" aria-label={`${country.name} flag`}>
                      {country.flag}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium tracking-tight">{country.name}</p>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="absolute right-5 size-5 text-[#C2F84F]" />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const Skipper20: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);

  return (
      <div className="flex h-full min-h-[600px] w-screen items-center justify-center bg-[#131313] text-white">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-center gap-2 rounded-full bg-[#2F2F2F] px-4 py-2 text-sm transition-colors duration-200 hover:bg-[#3A3A3A]"
        >
          {country ? (
            <div className="flex size-6 items-center justify-center overflow-hidden rounded-full text-lg leading-none" aria-label={`${country.name} flag`}>
              {country.flag}
            </div>
          ) : (
            <div className="flex size-6 items-center justify-center overflow-hidden rounded-full text-lg leading-none" aria-label="United States flag">
              🇺🇸
            </div>
          )}
          <span>{country ? country.name : "United States"}</span>
          <ChevronDown className="size-4 text-[#737373]" />
        </button>

        <UniSwapCountryDialog
          isOpen={open}
          onClose={() => setOpen(false)}
          onSelectCountry={(c) => setCountry(c)}
          selectedCountry={country}
        />
      </div>
  );
};

export const DemoSkipper20 = Skipper20;
export default Skipper20;
