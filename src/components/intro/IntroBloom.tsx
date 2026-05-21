"use client";

import { Bloom, EffectComposer } from "@react-three/postprocessing";

/** Matches pulse.html UnrealBloomPass settings */
export function IntroBloom() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.78}
        luminanceSmoothing={0.55}
        mipmapBlur
      />
    </EffectComposer>
  );
}
