"use client";

import { useCallback, useEffect, useRef } from "react";

interface IntroSequenceProps {
  onComplete: () => void;
}

/**
 * Uses the author's pulse.html cinematic directly — same Earth shader, stars,
 * nebulas, bloom, and camera path. Embedded via iframe for visual parity.
 */
export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "pulse-intro-complete") finish();
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [finish]);

  return (
    <div className="intro-root fixed inset-0 z-50 bg-black">
      <iframe
        title="Pulse intro"
        src="/intro/cinematic.html"
        className="h-full w-full border-0"
        allow="autoplay"
      />

      <button
        type="button"
        onClick={finish}
        className="absolute right-5 top-5 z-30 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white/90"
      >
        Skip
      </button>
    </div>
  );
}
