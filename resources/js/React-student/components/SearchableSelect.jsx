import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * Generic searchable dropdown.
 * options: [{ value: string, label: string }]
 */
export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)) || null,
    [options, value]
  );

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

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, options]);

  const handleSelect = (option) => {
    onChange(option ? String(option.value) : "");
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative w-full ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between pl-3 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none transition bg-white text-left"
      >
        <span className={`truncate ${selected ? "text-gray-700" : "text-gray-400"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-2"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {/* Clear / "All" option */}
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-teal-50 transition-colors ${
                  !value ? "bg-teal-50 font-medium" : ""
                }`}
              >
                {placeholder}
              </button>

              {filteredOptions.length === 0 && (
                <div className="px-3 py-4 text-sm text-gray-400 text-center">
                  No results found
                </div>
              )}

              {filteredOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => handleSelect(o)}
                  className={`w-full flex items-center px-3 py-2 text-sm text-left hover:bg-teal-50 transition-colors truncate ${
                    String(value) === String(o.value) ? "bg-teal-50 font-medium" : ""
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}