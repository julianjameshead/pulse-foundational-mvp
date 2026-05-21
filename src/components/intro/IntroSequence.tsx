"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePulseAudio } from "@/hooks/usePulseAudio";
import { IntroScene, type IntroStage } from "./IntroScene";

const STAGES: { id: IntroStage; duration: number; label: string }[] = [
  { id: "pulse", duration: 5200, label: "Sensing pulse" },
  { id: "pullback", duration: 15000, label: "Expanding outward" },
  { id: "deep", duration: 6000, label: "Deep space" },
  { id: "rush", duration: 3200, label: "Returning" },
  { id: "arrive", duration: 1800, label: "Arriving" },
];

interface IntroSequenceProps {
  onComplete: () => void;
}

export function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const { playHeartbeat, stop } = usePulseAudio();

  const stage = STAGES[stageIndex];
  const globalProgress =
    (stageIndex + stageProgress) / STAGES.length;

  const advance = useCallback(() => {
    if (stageIndex >= STAGES.length - 1) {
      stop();
      onComplete();
      return;
    }
    setStageIndex((i) => i + 1);
    setStageProgress(0);
  }, [stageIndex, onComplete, stop]);

  const skip = useCallback(() => {
    stop();
    onComplete();
  }, [onComplete, stop]);

  useEffect(() => {
    if (stageIndex === 0 && stageProgress < 0.05) {
      playHeartbeat();
    }
    if (stageIndex > 0) stop();
  }, [stageIndex, stageProgress, playHeartbeat, stop]);

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / stage.duration);
      setStageProgress(p);
      if (p >= 1) advance();
      else frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stageIndex, stage.duration, advance]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 2000, position: [0, 0, 4] }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#020208"]} />
        <fog attach="fog" args={["#020208", 80, 450]} />
        <Suspense fallback={null}>
          <IntroScene
            stage={stage.id}
            stageProgress={stageProgress}
            globalProgress={globalProgress}
          />
        </Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]" />

      <AnimatePresence>
        {stage.id === "pulse" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 0.82, repeat: Infinity }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(120,180,255,0.2),transparent_55%)]"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 px-6">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/50">
          {stage.label}
        </p>
        <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400/80 to-violet-400/80"
            style={{ width: `${globalProgress * 100}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute right-5 top-5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white/90"
      >
        Skip
      </button>
    </div>
  );
}
