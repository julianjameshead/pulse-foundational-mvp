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
  rings?: boolean;
}

export function PlanetMesh({
  textureUrl,
  radius,
  position,
  rotationSpeed = 0.003,
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
        <meshPhongMaterial
          map={map}
          shininess={8}
          specular={0x333333}
          color={0xffffff}
        />
      </mesh>
      {rings && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.4, 128]} />
          <meshBasicMaterial
            color="#e8dcc0"
            transparent
            opacity={0.82}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
