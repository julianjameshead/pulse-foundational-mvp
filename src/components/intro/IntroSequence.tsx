"use client";

import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Great_Vibes } from "next/font/google";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePulseAudio } from "@/hooks/usePulseAudio";
import {
  getFadeOpacity,
  getIntroOverlays,
  INTRO_DURATION_MS,
  introTime,
} from "@/lib/introCinematic";
import { PLANET_TEXTURES } from "@/lib/planetTextures";
import { IntroScene } from "./IntroScene";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [progress, setProgress] = useState(0);
  const { playHeartbeat, stop } = usePulseAudio();
  const startedAudio = useRef(false);

  const elapsed = introTime(progress);
  const { pulseOpacity } = getIntroOverlays(elapsed);
  const fadeOpacity = getFadeOpacity(elapsed);
  const textBreath = 0.9 + Math.sin(elapsed * 1.2) * 0.1;

  useEffect(() => {
    Object.values(PLANET_TEXTURES).forEach((url) => useTexture.preload(url));
  }, []);

  const finish = useCallback(() => {
    stop();
    onComplete();
  }, [onComplete, stop]);

  const skip = useCallback(() => finish(), [finish]);

  useEffect(() => {
    if (!startedAudio.current) {
      startedAudio.current = true;
      playHeartbeat();
      const t = setTimeout(stop, 900);
      return () => clearTimeout(t);
    }
  }, [playHeartbeat, stop]);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / INTRO_DURATION_MS);
      setProgress(p);
      if (p >= 1) finish();
      else frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finish]);

  return (
    <div className="intro-root fixed inset-0 z-50 bg-black">
      <Canvas
        camera={{ fov: 38, near: 0.05, far: 500, position: [0, 0.3, 3.2] }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <IntroScene progress={progress} />
        </Suspense>
      </Canvas>

      {/* Opening fade — pulse.html #fade */}
      <div
        className="intro-fade pointer-events-none fixed inset-0 z-20 bg-black"
        style={{ opacity: fadeOpacity }}
      />

      {/* Vignette — pulse.html #vig */}
      <div className="intro-vig pointer-events-none fixed inset-0 z-10" />

      {/* Glowing cursive Pulse — pulse.html text reveal */}
      <div
        className="intro-pulse-text pointer-events-none fixed inset-0 z-[15] flex items-center justify-center"
        style={{
          opacity: pulseOpacity * textBreath,
        }}
      >
        <span className={greatVibes.className}>Pulse</span>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-5 top-5 z-30 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white/90"
      >
        Skip
      </button>
    </div>
  );
}
