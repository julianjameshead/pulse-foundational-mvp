"use client";

import { useCallback, useRef } from "react";

/** Subtle heartbeat pulse tied to the intro Earth animation */
export function usePulseAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (ctxRef.current) {
      void ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  const playHeartbeat = useCallback(() => {
    stop();
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const beat = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(52, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.12);

      filter.type = "lowpass";
      filter.frequency.value = 180;

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.4);

      // Second softer beat (lub-dub)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(38, t + 0.14);
      gain2.gain.setValueAtTime(0.0001, t + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.08, t + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(t + 0.14);
      osc2.stop(t + 0.45);
    };

    beat();
    intervalRef.current = setInterval(beat, 820);
  }, [stop]);

  return { playHeartbeat, stop };
}
