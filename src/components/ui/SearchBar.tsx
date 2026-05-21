"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Glass } from "./Glass";
import { SEARCH_INDEX } from "@/lib/mockData";
import type { SearchResult } from "@/types/pulse";

interface SearchBarProps {
  onSelect?: (result: SearchResult) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.category.includes(q) ||
        r.meta?.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <Glass variant="bubble" className="relative flex items-center gap-3 px-4 py-3">
        <svg
          className="shrink-0 text-white/45"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3-3" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          placeholder="Cities, events, groups, friends…"
          className="w-full bg-transparent text-sm text-white/90 placeholder:text-white/35 outline-none"
        />
      </Glass>

      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50"
          >
            <Glass variant="panel" className="relative overflow-hidden p-2">
              <ul className="divide-y divide-white/5">
                {results.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left transition hover:bg-white/5"
                      onMouseDown={() => {
                        onSelect?.(r);
                        setQuery(r.label);
                      }}
                    >
                      <span className="text-sm text-white/90">{r.label}</span>
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        {r.meta ?? r.category}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
