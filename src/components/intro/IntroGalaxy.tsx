"use client";

import { useMemo } from "react";
import * as THREE from "three";

/** Milky Way band — visible during deep pullback */
export function IntroGalaxy({ visible }: { visible: boolean }) {
  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 2048, 0);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.2, "rgba(80,100,180,0.08)");
    g.addColorStop(0.45, "rgba(200,210,255,0.22)");
    g.addColorStop(0.55, "rgba(220,200,255,0.2)");
    g.addColorStop(0.8, "rgba(90,110,200,0.1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2048, 512);
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 2048;
      const y = 256 + (Math.random() - 0.5) * 80;
      const a = Math.random() * 0.35;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fillRect(x, y, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: visible ? 0.85 : 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <mesh position={[0, 1200, -45000]} rotation={[0.35, 0.6, 0.15]} material={material}>
      <planeGeometry args={[180000, 45000]} />
    </mesh>
  );
}
