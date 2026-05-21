"use client";

import type { ReactNode } from "react";
import { Glass } from "./Glass";

function IconButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center text-white/80 transition hover:text-white"
    >
      {children}
    </button>
  );
}

export function TopActions() {
  return (
    <div className="flex items-center gap-2">
      <Glass variant="chip" className="relative px-1">
        <IconButton label="Filter events">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
          </svg>
        </IconButton>
      </Glass>
      <Glass variant="chip" className="relative px-1">
        <IconButton label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="6" width="16" height="1.8" rx="0.9" />
            <rect x="4" y="11" width="16" height="1.8" rx="0.9" />
            <rect x="4" y="16" width="16" height="1.8" rx="0.9" />
          </svg>
        </IconButton>
      </Glass>
    </div>
  );
}
