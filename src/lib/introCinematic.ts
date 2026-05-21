import * as THREE from "three";

/** Scale factor: matches pulse.html coordinate feel in R3F */
export const S = 0.018;

export const EARTH_POS = new THREE.Vector3(0, 0, 0);
export const EARTH_R = 50 * S;
export const SUN_POS = new THREE.Vector3(-4800 * S, 0, 0);
export const SUN_R = 220 * S;

export const INTRO_DURATION_SEC = 14;
export const INTRO_DURATION_MS = INTRO_DURATION_SEC * 1000;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIO = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeO = (t: number) => 1 - Math.pow(1 - t, 3);

export function introTime(progress: number): number {
  return clamp(progress, 0, 1) * INTRO_DURATION_SEC;
}

export function getSysCenter(planetX: number): THREE.Vector3 {
  return new THREE.Vector3((SUN_POS.x + planetX) / 2, 0, 0);
}

/** Camera path ported from pulse.html (40s → 14s via introTime) */
export function getIntroCamera(t: number, outerPlanetX: number) {
  const SYS_C = getSysCenter(outerPlanetX);

  let position: THREE.Vector3;
  let lookAt: THREE.Vector3;
  let fov: number;

  if (t < 5) {
    const a = t * 0.12;
    position = new THREE.Vector3(
      EARTH_POS.x + Math.sin(a) * 30 * S,
      EARTH_POS.y + 18 * S,
      EARTH_POS.z + (180 + Math.cos(a) * 20) * S,
    );
    lookAt = EARTH_POS.clone();
    fov = 38;
  } else if (t < 15) {
    const p = easeIO((t - 5) / 10);
    position = new THREE.Vector3(
      lerp(EARTH_POS.x, SYS_C.x - 200 * S, p),
      lerp(18 * S, 900 * S, p),
      lerp(EARTH_POS.z + 180 * S, 3200 * S, p),
    );
    lookAt = new THREE.Vector3(
      lerp(EARTH_POS.x, SYS_C.x, p),
      0,
      lerp(EARTH_POS.z, 0, p),
    );
    fov = lerp(38, 62, p);
  } else if (t < 22) {
    const p = easeIO((t - 15) / 7);
    position = new THREE.Vector3(
      lerp(SYS_C.x - 200 * S, SYS_C.x - 400 * S, p),
      lerp(900 * S, 4800 * S, p),
      lerp(3200 * S, 400 * S, p),
    );
    lookAt = new THREE.Vector3(SYS_C.x, 0, 0);
    fov = lerp(62, 55, p);
  } else if (t < 30) {
    const d = t - 22;
    position = new THREE.Vector3(
      SYS_C.x - 400 * S + Math.sin(d * 0.12) * 200 * S,
      4800 * S + Math.sin(d * 0.08) * 150 * S,
      400 * S + Math.cos(d * 0.1) * 200 * S,
    );
    lookAt = new THREE.Vector3(
      SYS_C.x + Math.sin(t * 0.05) * 100 * S,
      0,
      Math.cos(t * 0.05) * 100 * S,
    );
    fov = 55;
  } else if (t < 34) {
    const p = easeIO((t - 30) / 4);
    position = new THREE.Vector3(
      lerp(SYS_C.x - 400 * S, SUN_POS.x + 1800 * S, p),
      lerp(4800 * S, 2600 * S, p),
      lerp(400 * S, 800 * S, p),
    );
    lookAt = new THREE.Vector3(SUN_POS.x + 1800 * S, 0, 0);
    fov = lerp(55, 48, p);
  } else {
    const p = easeIO((t - 34) / 6);
    position = new THREE.Vector3(
      lerp(SUN_POS.x + 1800 * S, EARTH_POS.x, p),
      lerp(2600 * S, 20 * S, p),
      lerp(800 * S, EARTH_POS.z + 220 * S, p),
    );
    lookAt = new THREE.Vector3(
      lerp(SUN_POS.x + 1800 * S, EARTH_POS.x, p),
      0,
      lerp(0, EARTH_POS.z, p),
    );
    fov = lerp(48, 42, p);
  }

  return { position, lookAt, fov };
}

/** Ring + text timing (pulse.html) */
export function getIntroOverlays(t: number) {
  const ringActive = t > 20 && t < 33;
  const ringFade = ringActive
    ? clamp((t - 20) / 2, 0, 1) * (t < 31 ? 1 : clamp(1 - (t - 31) / 2, 0, 1))
    : 0;

  const pulseReveal = clamp((t - 30) / 3, 0, 1);
  const pulseOpacity =
    t < 30 ? 0 : t < 33 ? easeO(pulseReveal) : clamp(1 - (t - 38) / 2, 0, 1);

  const earthPulse = t < 5 ? (Math.sin(t * 7.2) + 1) / 2 : 0;

  return { ringFade, pulseOpacity: pulseOpacity * 0.95, earthPulse, ringActive };
}

export function getFadeOpacity(t: number): number {
  if (t < 0.3) return 1;
  if (t < 2.2) return 1 - (t - 0.3) / 1.9;
  return 0;
}
