"use client";

import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface PlanetMeshProps {
  textureUrl: string;
  radius: number;
  position: [number, number, number];
  rotationSpeed?: number;
  emissive?: string;
  emissiveIntensity?: number;
  rings?: boolean;
}

export function PlanetMesh({
  textureUrl,
  radius,
  position,
  rotationSpeed = 0.05,
  emissive,
  emissiveIntensity = 0,
  rings = false,
}: PlanetMeshProps) {
  const ref = useRef<THREE.Mesh>(null);
  const map = useTexture(textureUrl);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={map}
          roughness={0.85}
          metalness={0.05}
          emissive={emissive ? new THREE.Color(emissive) : undefined}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.1, 128]} />
          <meshBasicMaterial
            color="#c9b896"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
