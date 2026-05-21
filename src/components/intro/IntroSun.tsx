"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { SUN_POS, SUN_R } from "@/lib/introCinematic";

function sunSurfaceTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(512, 256, 0, 512, 256, 512);
  g.addColorStop(0, "#fffef5");
  g.addColorStop(0.35, "#ffe08a");
  g.addColorStop(0.65, "#ffaa44");
  g.addColorStop(1, "#ff7722");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 2 + Math.random() * 7;
    const alpha = Math.random() * 0.18;
    ctx.fillStyle =
      Math.random() > 0.5
        ? `rgba(255,255,220,${alpha})`
        : `rgba(200,80,20,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function coronaTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,245,200,1)");
  g.addColorStop(0.12, "rgba(255,200,100,0.65)");
  g.addColorStop(0.35, "rgba(255,140,50,0.25)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function IntroSun({ elapsed }: { elapsed: number }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const sunTex = useMemo(() => sunSurfaceTexture(), []);
  const coronaTex = useMemo(() => coronaTexture(), []);

  const coronas = useMemo(
    () =>
      [0, 1, 2, 3].map((i) => ({
        phase: i * 1.1,
        baseSz: SUN_R * (3 + i * 2.5),
        baseOp: 0.62 - i * 0.08,
      })),
    [],
  );

  useFrame(() => {
    if (sunRef.current) sunRef.current.rotation.y = elapsed * 0.02;
  });

  return (
    <group position={SUN_POS}>
      <mesh ref={sunRef}>
        <sphereGeometry args={[SUN_R, 64, 64]} />
        <meshBasicMaterial map={sunTex} toneMapped={false} />
      </mesh>
      {coronas.map((c, i) => {
        const breath = 1 + Math.sin(elapsed * 0.5 + c.phase) * 0.1;
        const op =
          c.baseOp * (0.9 + Math.sin(elapsed * 0.7 + c.phase * 1.3) * 0.12);
        return (
          <sprite key={i} scale={[c.baseSz * breath, c.baseSz * breath, 1]}>
            <spriteMaterial
              map={coronaTex}
              color={0xffd089}
              transparent
              opacity={op}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}
