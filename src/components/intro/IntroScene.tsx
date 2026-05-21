"use client";

import { Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getIntroCamera,
  getIntroOverlays,
  introTime,
  SUN_POS,
  SUN_R,
} from "@/lib/introCinematic";
import { OUTER_PLANET_X } from "@/lib/introPlanets";
import { INTRO_PLANETS, planetWorldPosition } from "@/lib/introPlanets";
import { IntroBloom } from "./IntroBloom";
import { IntroEarth } from "./IntroEarth";
import { PlanetMesh } from "./PlanetMesh";
import { PulseRings } from "./PulseRings";

interface IntroSceneProps {
  progress: number;
}

export function IntroScene({ progress }: IntroSceneProps) {
  const { camera, gl } = useThree();
  const elapsed = introTime(progress);
  const overlays = getIntroOverlays(elapsed);

  useFrame(() => {
    const { position, lookAt, fov } = getIntroCamera(elapsed, OUTER_PLANET_X);
    camera.position.copy(position);
    camera.lookAt(lookAt);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  useFrame(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.15;
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 40, 120]} />
      <ambientLight color="#1a1a2a" intensity={0.45} />

      <IntroEarth elapsed={elapsed} earthPulse={overlays.earthPulse} />

      <mesh position={SUN_POS}>
        <sphereGeometry args={[SUN_R, 48, 48]} />
        <meshBasicMaterial color="#ffe8b0" />
      </mesh>
      <mesh position={SUN_POS}>
        <sphereGeometry args={[SUN_R * 3.5, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa55"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight position={SUN_POS} intensity={4.5} color="#ffeedd" distance={80} />

      {INTRO_PLANETS.map((p) => {
        const pos = planetWorldPosition(p);
        return (
          <PlanetMesh
            key={p.name}
            textureUrl={p.texture}
            radius={p.size * 0.018}
            position={[pos.x, pos.y, pos.z]}
            rings={p.rings}
            rotationSpeed={0.003}
          />
        );
      })}

      <PulseRings
        elapsed={elapsed}
        ringFade={overlays.ringFade}
        ringActive={overlays.ringActive}
      />

      <Stars
        radius={180}
        depth={80}
        count={12000}
        factor={4}
        saturation={0.15}
        fade
        speed={0.4}
      />

      <IntroBloom />
    </>
  );
}
