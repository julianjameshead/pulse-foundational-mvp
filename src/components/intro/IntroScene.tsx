"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getIntroCamera,
  getIntroOverlays,
  getSolarSystemOpacity,
  introTime,
} from "@/lib/introCinematic";
import { INTRO_PLANETS } from "@/lib/introPlanets";
import { IntroBloom } from "./IntroBloom";
import { IntroEarth } from "./IntroEarth";
import { IntroLighting } from "./IntroLighting";
import { IntroPlanet } from "./IntroPlanet";
import { IntroSkybox } from "./IntroSkybox";
import { IntroStarfield } from "./IntroStarfield";
import { IntroSun } from "./IntroSun";
import { IntroWarp } from "./IntroWarp";

interface IntroSceneProps {
  progress: number;
}

export function IntroScene({ progress }: IntroSceneProps) {
  const { camera } = useThree();
  const elapsed = introTime(progress);
  const overlays = getIntroOverlays(elapsed);
  const sysOpacity = getSolarSystemOpacity(progress);

  useFrame(() => {
    const { position, lookAt, fov } = getIntroCamera(progress);
    camera.position.copy(position);
    camera.lookAt(lookAt);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  const skyOpacity = overlays.showSky
    ? overlays.showDeepSpace
      ? 1
      : 0.55 + progress * 0.25
    : 0;

  return (
    <>
      <color attach="background" args={["#000005"]} />
      <IntroLighting />

      <IntroStarfield />
      <IntroSkybox opacity={skyOpacity} deep={overlays.showDeepSpace} />

      <group visible={sysOpacity > 0.02}>
        <IntroSun elapsed={elapsed} />
        <IntroEarth elapsed={elapsed} earthPulse={overlays.earthPulse} />
        {INTRO_PLANETS.map((p) => (
          <IntroPlanet key={p.name} config={p} />
        ))}
      </group>

      <IntroWarp intensity={overlays.warp} />
      <IntroBloom />
    </>
  );
}
