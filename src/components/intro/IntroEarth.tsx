"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { EARTH_POS, EARTH_R } from "@/lib/introCinematic";
import { PLANET_TEXTURES } from "@/lib/planetTextures";

const MOON_R = EARTH_R * 0.27;
const MOON_ORBIT = EARTH_R * 4.5;

interface IntroEarthProps {
  elapsed: number;
  earthPulse: number;
}

export function IntroEarth({ elapsed, earthPulse }: IntroEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);
  const moonPivot = useRef<THREE.Group>(null);
  const earthMap = useTexture(PLANET_TEXTURES.earth);
  const moonMap = useTexture(PLANET_TEXTURES.moon);

  useFrame(() => {
    const spin = elapsed * 0.08;
    const beat = 1 + earthPulse * 0.04;
    if (earthRef.current) {
      earthRef.current.rotation.y = spin;
      earthRef.current.scale.setScalar(beat);
    }
    if (atmoRef.current) {
      atmoRef.current.rotation.y = spin * 0.3;
      atmoRef.current.scale.setScalar(beat * 1.12);
    }
    if (moonPivot.current) moonPivot.current.rotation.y = elapsed * 0.15;
  });

  return (
    <group position={EARTH_POS}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[EARTH_R, 64, 64]} />
        <meshStandardMaterial
          map={earthMap}
          roughness={0.92}
          metalness={0.02}
          emissive="#112233"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh ref={atmoRef}>
        <sphereGeometry args={[EARTH_R * 1.12, 48, 48]} />
        <meshPhongMaterial
          color="#5aa8ff"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <group ref={moonPivot} rotation={[0, 0, 0.09]}>
        <mesh position={[MOON_ORBIT, 0, 0]}>
          <sphereGeometry args={[MOON_R, 32, 32]} />
          <meshStandardMaterial map={moonMap} roughness={1} metalness={0} />
        </mesh>
      </group>

    </group>
  );
}
