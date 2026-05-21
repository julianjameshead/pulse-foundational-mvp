"use client";

import { motion } from "framer-motion";
import { Glass } from "./Glass";

interface LocationPromptProps {
  onAllow: () => void;
  onSkip: () => void;
  error?: string | null;
}

export function LocationPrompt({ onAllow, onSkip, error }: LocationPromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
    >
      <Glass variant="panel" className="relative max-w-sm p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400/15 ring-1 ring-cyan-400/30">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="1.5">
            <circle cx="12" cy="11" r="3" />
            <path d="M12 3v2M12 19v2M3 11h2M19 11h2" strokeLinecap="round" />
            <path d="M12 14v7" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-white/95">
          Find your city
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/50">
          Pulse lands on your streets — your events, your world. We need your
          location to drop you into the right city.
        </p>
        {error && (
          <p className="mt-3 text-xs text-amber-300/80">{error}</p>
        )}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onAllow}
            className="rounded-2xl bg-gradient-to-r from-cyan-500/90 to-violet-500/90 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-95"
          >
            Enable location
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="py-2 text-xs text-white/40 transition hover:text-white/60"
          >
            Continue with default city
          </button>
        </div>
      </Glass>
    </motion.div>
  );
}
