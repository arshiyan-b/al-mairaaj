import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { defaultCountries, parseCountry, FlagImage } from "react-international-phone";
import "react-international-phone/style.css";

export default function CountrySelect({
  name,
  value,
  onChange,
  required = false,
  placeholder = "Select country",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const countries = useMemo(() => defaultCountries.map(parseCountry), []);

  // Try to resolve the currently stored value (a country name string) to its iso2 code
  const selectedCountry = useMemo(() => {
    if (!value) return null;
    return (
      countries.find(
        (c) => c.name.toLowerCase() === String(value).toLowerCase()
      ) || null
    );
  }, [value, countries]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return countries;
    const q = search.trim().toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso2.toLowerCase().includes(q)
    );
  }, [search, countries]);

  const handleSelect = (country) => {
    onChange(country.name);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all bg-gray-50/50 dark:bg-gray-800/50 dark:border-gray-700 dark:text-white text-left"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedCountry ? (
            <>
              <FlagImage iso2={selectedCountry.iso2} style={{ width: "20px", height: "14px" }} />
              <span className="truncate">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-gray-400">{value || placeholder}</span>
          )}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="flex-shrink-0 ml-2"
        >
          <path d="M2 4l4 4 4-4" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      {/* Hidden input to keep name/required semantics for native form validation if needed */}
      <input type="hidden" name={name} value={value || ""} required={required} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="w-full px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {filteredCountries.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-400 text-center">
                  No countries found
                </div>
              )}
              {filteredCountries.map((c) => (
                <button
                  key={c.iso2}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedCountry?.iso2 === c.iso2 ? "bg-teal-50 dark:bg-gray-700" : ""
                  }`}
                >
                  <FlagImage iso2={c.iso2} style={{ width: "18px", height: "13px" }} />
                  <span className="flex-1 text-gray-700 dark:text-gray-200 truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}