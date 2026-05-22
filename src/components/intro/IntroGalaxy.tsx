"use client";

import { useMemo } from "react";
import * as THREE from "three";

function makeGalaxyTexture(bright: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 2048, 0);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.15, `rgba(70,90,160,${bright ? 0.14 : 0.08})`);
  g.addColorStop(0.42, `rgba(200,215,255,${bright ? 0.38 : 0.22})`);
  g.addColorStop(0.55, `rgba(230,210,255,${bright ? 0.35 : 0.2})`);
  g.addColorStop(0.78, `rgba(80,100,190,${bright ? 0.12 : 0.08})`);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 2048, 512);
  const count = bright ? 12000 : 8000;
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 2048;
    const y = 256 + (Math.random() - 0.5) * (bright ? 120 : 80);
    const a = Math.random() * (bright ? 0.5 : 0.35);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(x, y, bright ? 2 : 1, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface IntroGalaxyProps {
  visible: boolean;
  deep: boolean;
}

/** Milky Way band + distant galaxies when pulled outside the galaxy */
export function IntroGalaxy({ visible, deep }: IntroGalaxyProps) {
  const bandMat = useMemo(() => {
    const tex = makeGalaxyTexture(deep);
    return new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: visible ? (deep ? 1 : 0.75) : 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, [visible, deep]);

  const distantGalaxies = useMemo(() => {
    if (!deep) return [];
    return Array.from({ length: 18 }, (_, i) => ({
      pos: [
        (i % 6) * 28000 - 70000,
        (i % 4) * 8000 - 12000,
        -140000 - (i % 5) * 15000,
      ] as [number, number, number],
      scale: 8000 + (i % 4) * 4000,
      color: i % 2 === 0 ? 0xb8c8ff : 0xf0c8ff,
    }));
  }, [deep]);

  if (!visible) return null;

  return (
    <group>
      <mesh
        position={[0, 800, -48000]}
        rotation={[0.38, 0.55, 0.12]}
        material={bandMat}
      >
        <planeGeometry args={[200000, 52000]} />
      </mesh>

      {distantGalaxies.map((g, i) => (
        <mesh key={i} position={g.pos} scale={[g.scale, g.scale * 0.35, 1]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={g.color}
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
