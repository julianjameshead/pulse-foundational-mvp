"use client";

import { EARTH_POS, SUN_POS } from "@/lib/introCinematic";

/** Scene lighting matched to pulse.html — sun-driven, cinematic fill */
export function IntroLighting() {
  return (
    <>
      <ambientLight color="#2a2848" intensity={0.55} />
      <hemisphereLight
        args={["#6a8fc9", "#18141c", 0.85]}
        position={[0, 1, 0]}
      />
      <directionalLight
        position={[SUN_POS.x, SUN_POS.y + 200, SUN_POS.z]}
        intensity={3.2}
        color="#fff8ee"
      />
      <pointLight
        position={SUN_POS}
        intensity={6}
        color="#ffeedd"
        distance={0}
        decay={0}
      />
      <pointLight
        position={[EARTH_POS.x + 120, EARTH_POS.y + 80, EARTH_POS.z + 200]}
        intensity={0.35}
        color="#8eb8ff"
        distance={800}
        decay={2}
      />
    </>
  );
}
