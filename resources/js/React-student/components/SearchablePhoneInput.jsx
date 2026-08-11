import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePhoneInput,
  defaultCountries,
  parseCountry,
  FlagImage,
} from "react-international-phone";
import "react-international-phone/style.css";

export default function SearchablePhoneInput({
  name,
  value,
  onChange,
  defaultCountry = "pk",
  required = false,
  placeholder = "Phone number",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const {
    inputValue,
    country,
    setCountry,
    handlePhoneValueChange,
    inputRef,
  } = usePhoneInput({
    defaultCountry,
    value,
    countries: defaultCountries,
    onChange: (data) => {
      onChange(data.phone);
    },
  });

  // Close dropdown on outside click
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

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredCountries = useMemo(() => {
    const parsed = defaultCountries.map(parseCountry);
    if (!search.trim()) return parsed;
    const q = search.trim().toLowerCase();
    return parsed.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.iso2.toLowerCase().includes(q)
    );
  }, [search]);

  const handleSelect = (iso2) => {
    setCountry(iso2, { focusOnInput: true });
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="flex w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
        {/* Country selector button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 transition-colors"
        >
          <FlagImage iso2={country.iso2} style={{ width: "20px", height: "14px" }} />
          <span className="text-sm text-gray-700">+{country.dialCode}</span>
          <motion.svg
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path d="M2 4l4 4 4-4" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>

        {/* Phone number input */}
        <input
          ref={inputRef}
          name={name}
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          required={required}
          placeholder={placeholder}
          className="flex-1 min-w-0 px-3 py-2 outline-none text-sm h-[42px]"
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            {/* Search box */}
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country or code..."
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* Country list */}
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
                  onClick={() => handleSelect(c.iso2)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-indigo-50 transition-colors ${
                    c.iso2 === country.iso2 ? "bg-indigo-50" : ""
                  }`}
                >
                  <FlagImage iso2={c.iso2} style={{ width: "18px", height: "13px" }} />
                  <span className="flex-1 text-gray-700 truncate">{c.name}</span>
                  <span className="text-gray-400">+{c.dialCode}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}