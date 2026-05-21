"use client";

import { useMemo } from "react";
import * as THREE from "three";

const NEBULAS: {
  col: number;
  op: number;
  sz: number;
  pos: [number, number, number];
}[] = [
  { col: 0x3355cc, op: 0.2, sz: 120000, pos: [-70000, -20000, -100000] },
  { col: 0x7733aa, op: 0.17, sz: 100000, pos: [80000, 15000, -70000] },
  { col: 0xcc7733, op: 0.14, sz: 90000, pos: [-50000, 25000, 80000] },
  { col: 0x2266dd, op: 0.16, sz: 110000, pos: [100000, -10000, 50000] },
  { col: 0xaa4499, op: 0.13, sz: 80000, pos: [30000, -30000, -120000] },
];

function makeSpriteTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,0.8)");
  g.addColorStop(0.4, "rgba(255,255,255,0.15)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function IntroNebulas() {
  const map = useMemo(() => makeSpriteTexture(), []);

  return (
    <group>
      {NEBULAS.map((n, i) => (
        <sprite key={i} position={n.pos} scale={[n.sz, n.sz, 1]}>
          <spriteMaterial
            map={map}
            color={n.col}
            transparent
            opacity={n.op}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  );
}
