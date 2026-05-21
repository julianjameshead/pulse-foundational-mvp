"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getIntroCamera,
  getIntroOverlays,
  introTime,
} from "@/lib/introCinematic";
import { INTRO_PLANETS, OUTER_PLANET_X } from "@/lib/introPlanets";
import { IntroBloom } from "./IntroBloom";
import { IntroEarth } from "./IntroEarth";
import { IntroGalaxy } from "./IntroGalaxy";
import { IntroLighting } from "./IntroLighting";
import { IntroNebulas } from "./IntroNebulas";
import { IntroPlanet } from "./IntroPlanet";
import { IntroStarfield } from "./IntroStarfield";
import { IntroSun } from "./IntroSun";
import { PulseRings } from "./PulseRings";

interface IntroSceneProps {
  progress: number;
}

export function IntroScene({ progress }: IntroSceneProps) {
  const { camera } = useThree();
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

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <IntroLighting />

      <IntroStarfield />
      <IntroNebulas />
      <IntroGalaxy visible={overlays.showGalaxy} />

      <IntroSun elapsed={elapsed} />
      <IntroEarth elapsed={elapsed} earthPulse={overlays.earthPulse} />

      {INTRO_PLANETS.map((p) => (
        <IntroPlanet key={p.name} config={p} />
      ))}

      <PulseRings
        elapsed={elapsed}
        ringFade={overlays.ringFade}
        ringActive={overlays.ringActive}
      />

      <IntroBloom />
    </>
  );
}
