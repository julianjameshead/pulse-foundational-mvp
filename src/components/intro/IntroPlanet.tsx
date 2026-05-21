"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { IntroPlanetConfig } from "@/lib/introPlanets";
import { planetWorldPosition } from "@/lib/introPlanets";
import { PlanetMesh } from "./PlanetMesh";
import { makeProceduralPlanetTexture } from "@/lib/proceduralPlanetTextures";

interface IntroPlanetProps {
  config: IntroPlanetConfig;
}

export function IntroPlanet({ config }: IntroPlanetProps) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = planetWorldPosition(config);

  const procTex = useMemo(
    () => (config.procedural ? makeProceduralPlanetTexture(config.name) : null),
    [config.name, config.procedural],
  );

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.003;
  });

  if (config.texture) {
    return (
      <PlanetMesh
        textureUrl={config.texture}
        radius={config.size}
        position={[pos.x, pos.y, pos.z]}
        rings={config.rings}
      />
    );
  }

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <mesh ref={ref} rotation={[config.tilt ?? 0, 0, 0]}>
        <sphereGeometry args={[config.size, 64, 64]} />
        <meshPhongMaterial
          map={procTex}
          shininess={6}
          specular={0x222222}
          color={config.color ?? "#ffffff"}
        />
      </mesh>
    </group>
  );
}
