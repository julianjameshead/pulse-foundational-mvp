"use client";

import { Stars, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PLANET_TEXTURES } from "@/lib/planetTextures";
import { PlanetMesh } from "./PlanetMesh";

export type IntroStage =
  | "pulse"
  | "pullback"
  | "deep"
  | "rush"
  | "arrive";

interface IntroSceneProps {
  stage: IntroStage;
  stageProgress: number;
  globalProgress: number;
}

const SCALE = 0.42;

const BODIES = {
  sun: { r: 3.2 * SCALE, pos: [0, 0, 0] as [number, number, number] },
  earth: { r: 0.55 * SCALE, pos: [14 * SCALE, 0, 0] as [number, number, number] },
  moon: { r: 0.15 * SCALE, pos: [15.2 * SCALE, 0.3, 0] as [number, number, number] },
  mars: { r: 0.32 * SCALE, pos: [22 * SCALE, 0, -1] as [number, number, number] },
  jupiter: { r: 1.8 * SCALE, pos: [38 * SCALE, 0, 0] as [number, number, number] },
  saturn: { r: 1.5 * SCALE, pos: [52 * SCALE, 0, 1] as [number, number, number] },
  uranus: { r: 0.9 * SCALE, pos: [64 * SCALE, 0, -2] as [number, number, number] },
  neptune: { r: 0.85 * SCALE, pos: [76 * SCALE, 0, 1] as [number, number, number] },
};

function cameraDistance(stage: IntroStage, t: number): number {
  const ease = (x: number) => 1 - Math.pow(1 - x, 3);
  const te = ease(Math.min(1, Math.max(0, t)));

  switch (stage) {
    case "pulse":
      return THREE.MathUtils.lerp(3.2, 3.5, Math.sin(te * Math.PI * 2) * 0.08 + te * 0.05);
    case "pullback": {
      const stops = [3.5, 8, 14, 22, 38, 55, 72, 88, 105];
      const idx = te * (stops.length - 1);
      const i = Math.floor(idx);
      const f = idx - i;
      const a = stops[i] ?? stops[0];
      const b = stops[i + 1] ?? stops[stops.length - 1];
      return THREE.MathUtils.lerp(a, b, f);
    }
    case "deep":
      return THREE.MathUtils.lerp(105, 220, te);
    case "rush":
      return THREE.MathUtils.lerp(220, 2.8, 1 - Math.pow(1 - te, 4));
    case "arrive":
      return THREE.MathUtils.lerp(2.8, 2.2, te);
    default:
      return 4;
  }
}

function cameraTarget(stage: IntroStage, t: number): THREE.Vector3 {
  const earth = new THREE.Vector3(...BODIES.earth.pos);
  if (stage === "deep") {
    return new THREE.Vector3(0, 0, 0);
  }
  if (stage === "pullback" && t > 0.55) {
    return new THREE.Vector3(40 * SCALE, 0, 0);
  }
  return earth;
}

export function IntroScene({ stage, stageProgress, globalProgress }: IntroSceneProps) {
  const { camera } = useThree();
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosRef = useRef<THREE.Mesh>(null);
  const earthMap = useTexture(PLANET_TEXTURES.earth);
  const pulseScale = useRef(1);

  const galaxySprites = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 120; i++) {
      positions.push([
        (Math.random() - 0.5) * 400,
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 400 - 80,
      ]);
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = stageProgress;
    const dist = cameraDistance(stage, t);
    const target = cameraTarget(stage, t);

    if (stage === "pulse") {
      const beat = (Math.sin(state.clock.elapsedTime * 7.2) + 1) / 2;
      pulseScale.current = 1 + beat * 0.045;
      if (earthRef.current) {
        earthRef.current.scale.setScalar(pulseScale.current);
      }
      if (atmosRef.current) {
        atmosRef.current.scale.setScalar(pulseScale.current * 1.03);
      }
    } else if (earthRef.current) {
      earthRef.current.scale.setScalar(1);
      if (atmosRef.current) atmosRef.current.scale.setScalar(1.03);
    }

    const offset =
      stage === "deep"
        ? new THREE.Vector3(0, 12 + Math.sin(globalProgress * 8) * 2, dist)
        : new THREE.Vector3(
            target.x,
            target.y + (stage === "rush" ? 4 : 1.5),
            target.z + dist,
          );

    camera.position.lerp(offset, 0.12);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={3.5} color="#fff4d6" distance={120} />
      <directionalLight position={[30, 20, 10]} intensity={0.6} color="#a8c4ff" />

      <mesh position={BODIES.sun.pos}>
        <sphereGeometry args={[BODIES.sun.r, 32, 32]} />
        <meshBasicMaterial color="#ffe8a8" />
      </mesh>
      <pointLight position={BODIES.sun.pos} intensity={2} color="#ffdcb0" distance={200} />

      <group position={BODIES.earth.pos}>
        <mesh ref={earthRef}>
          <sphereGeometry args={[BODIES.earth.r, 64, 64]} />
          <meshStandardMaterial map={earthMap} roughness={0.9} metalness={0.02} />
        </mesh>
        <mesh ref={atmosRef}>
          <sphereGeometry args={[BODIES.earth.r * 1.03, 64, 64]} />
          <meshPhongMaterial
            color="#6eb5ff"
            transparent
            opacity={0.18}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      <PlanetMesh
        textureUrl={PLANET_TEXTURES.moon}
        radius={BODIES.moon.r}
        position={BODIES.moon.pos}
        rotationSpeed={0.02}
      />
      <PlanetMesh
        textureUrl={PLANET_TEXTURES.mars}
        radius={BODIES.mars.r}
        position={BODIES.mars.pos}
        emissive="#3a1208"
        emissiveIntensity={0.08}
      />
      <PlanetMesh
        textureUrl={PLANET_TEXTURES.jupiter}
        radius={BODIES.jupiter.r}
        position={BODIES.jupiter.pos}
        rotationSpeed={0.12}
      />
      <PlanetMesh
        textureUrl={PLANET_TEXTURES.saturn}
        radius={BODIES.saturn.r}
        position={BODIES.saturn.pos}
        rings
        rotationSpeed={0.08}
      />
      <PlanetMesh
        textureUrl={PLANET_TEXTURES.uranus}
        radius={BODIES.uranus.r}
        position={BODIES.uranus.pos}
        rotationSpeed={0.06}
      />
      <PlanetMesh
        textureUrl={PLANET_TEXTURES.neptune}
        radius={BODIES.neptune.r}
        position={BODIES.neptune.pos}
        rotationSpeed={0.05}
      />

      {/* Asteroid belt hint */}
      {Array.from({ length: 80 }).map((_, i) => {
        const angle = (i / 80) * Math.PI * 2;
        const r = 30 * SCALE + (i % 7) * 0.15;
        return (
          <mesh
            key={`ast-${i}`}
            position={[Math.cos(angle) * r, (i % 3) * 0.08 - 0.1, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.03 * SCALE, 6, 6]} />
            <meshStandardMaterial color="#6a6458" roughness={1} />
          </mesh>
        );
      })}

      <Stars radius={300} depth={80} count={8000} factor={4} saturation={0} fade speed={0.3} />

      {(stage === "deep" || stage === "pullback") && (
        <group>
          <mesh position={[0, 8, -120]} rotation={[0.4, 0.2, 0.5]}>
            <planeGeometry args={[90, 12]} />
            <meshBasicMaterial color="#8ab4ff" transparent opacity={0.12} />
          </mesh>
          {galaxySprites.slice(0, stage === "deep" ? 80 : 30).map((pos, i) => (
            <mesh key={`gx-${i}`} position={pos} scale={0.6 + (i % 5) * 0.2}>
              <sphereGeometry args={[1.2 + (i % 3), 8, 8]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? "#c8d4ff" : "#f0c8ff"}
                transparent
                opacity={0.25}
              />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
}
