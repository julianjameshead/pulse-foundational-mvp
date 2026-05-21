"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EARTH_POS, EARTH_R, SUN_POS, SUN_R } from "@/lib/introCinematic";
import { INTRO_PLANETS, planetWorldPosition } from "@/lib/introPlanets";

const RING_LIFE = 9;
const POOL_PER = 5;

interface RingSlot {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  ei: number;
  active: boolean;
  spawn: number;
}

const EMITTERS = [
  { pos: SUN_POS.clone(), baseR: SUN_R, maxR: 3600, interval: 1.8, speed: 1, hue: 0.08 },
  { pos: EARTH_POS.clone(), baseR: EARTH_R, maxR: 2400, interval: 2.1, speed: 0.9, hue: 0.075 },
  { pos: planetWorldPosition(INTRO_PLANETS[3]), baseR: 95, maxR: 2800, interval: 2.4, speed: 0.95, hue: 0.07 },
  { pos: planetWorldPosition(INTRO_PLANETS[4]), baseR: 82, maxR: 2600, interval: 2.6, speed: 0.9, hue: 0.065 },
  { pos: planetWorldPosition(INTRO_PLANETS[6]), baseR: 46, maxR: 2200, interval: 2.3, speed: 1, hue: 0.06 },
];

interface PulseRingsProps {
  elapsed: number;
  ringFade: number;
  ringActive: boolean;
}

export function PulseRings({ elapsed, ringFade, ringActive }: PulseRingsProps) {
  const pool = useRef<RingSlot[]>([]);
  const lastEmit = useRef<number[]>(new Array(EMITTERS.length).fill(-99));
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(0.985, 1.015, 128, 1);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;

    if (pool.current.length === 0) {
      EMITTERS.forEach((_, ei) => {
        for (let i = 0; i < POOL_PER; i++) {
          const mat = new THREE.MeshBasicMaterial({
            color: 0xffaa55,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(geometry, mat);
          mesh.visible = false;
          groupRef.current!.add(mesh);
          pool.current.push({ mesh, mat, ei, active: false, spawn: 0 });
        }
      });
    }

    const t = elapsed;
    const easeO = (x: number) => 1 - Math.pow(1 - x, 3);

    if (ringActive && ringFade > 0) {
      EMITTERS.forEach((em, ei) => {
        if (t - lastEmit.current[ei] > em.interval) {
          const slot = pool.current.find((r) => r.ei === ei && !r.active);
          if (slot) {
            slot.active = true;
            slot.spawn = t;
            slot.mesh.visible = true;
            slot.mesh.position.copy(em.pos);
            lastEmit.current[ei] = t;
          }
        }
      });
    }

    pool.current.forEach((r) => {
      if (!r.active) return;
      const em = EMITTERS[r.ei];
      const age = t - r.spawn;
      const life = age / RING_LIFE;
      if (life > 1) {
        r.active = false;
        r.mesh.visible = false;
        return;
      }
      const exp = easeO(life);
      const radius = em.baseR + exp * (em.maxR - em.baseR) * em.speed;
      r.mesh.scale.set(radius, 1, radius);
      const fadeIn = Math.min(1, life * 6);
      const fadeOut = Math.pow(1 - life, 1.4);
      r.mat.opacity = fadeIn * fadeOut * 0.55 * ringFade;
      const h = em.hue + Math.sin(t * 0.5 + r.ei) * 0.01;
      r.mat.color.setHSL(
        Math.max(0.01, Math.min(0.12, h - life * 0.04)),
        0.95,
        0.6 - life * 0.3,
      );
    });
  });

  return <group ref={groupRef} />;
}
