"use client";

import { useTexture } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const SKY_RADIUS = 280000;

interface IntroSkyboxProps {
  opacity: number;
  deep: boolean;
}

/** Equirectangular Milky Way + stars (SSS / NASA-grade sky imagery) */
export function IntroSkybox({ opacity, deep }: IntroSkyboxProps) {
  const [milkyMap, starsMap] = useTexture([
    "/intro/stars_milky_way_2k.jpg",
    "/intro/stars_2k.jpg",
  ]);

  useEffect(() => {
    milkyMap.colorSpace = THREE.SRGBColorSpace;
    milkyMap.mapping = THREE.EquirectangularReflectionMapping;
    starsMap.colorSpace = THREE.SRGBColorSpace;
    starsMap.mapping = THREE.EquirectangularReflectionMapping;
  }, [milkyMap, starsMap]);

  if (opacity <= 0.01) return null;

  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[SKY_RADIUS, 72, 48]} />
        <meshBasicMaterial
          map={milkyMap}
          side={THREE.BackSide}
          transparent
          opacity={opacity * (deep ? 1 : 0.85)}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[SKY_RADIUS * 0.998, 72, 48]} />
        <meshBasicMaterial
          map={starsMap}
          side={THREE.BackSide}
          transparent
          opacity={opacity * (deep ? 0.45 : 0.2)}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
