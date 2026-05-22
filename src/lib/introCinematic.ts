import * as THREE from "three";

export const EARTH_POS = new THREE.Vector3(0, 0, 0);
export const EARTH_R = 50;
export const SUN_POS = new THREE.Vector3(-4800, 0, 0);
export const SUN_R = 220;

/** Fast zoom: Earth → solar system → Milky Way → galaxies → snap home (~10s) */
export const INTRO_DURATION_SEC = 10;
export const INTRO_DURATION_MS = INTRO_DURATION_SEC * 1000;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeO = (t: number) => 1 - Math.pow(1 - t, 3);

/** Maps linear progress → flight curve parameter (fast outbound, quick return) */
export function mapFlightProgress(p: number): number {
  const t = clamp(p, 0, 1);
  if (t < 0.1) return t * 0.35;
  if (t < 0.78) {
    const u = (t - 0.1) / 0.68;
    return 0.035 + Math.pow(u, 0.52) * 0.82;
  }
  if (t < 0.88) return 0.855 + ((t - 0.78) / 0.1) * 0.1;
  const u = (t - 0.88) / 0.12;
  return 0.955 + (1 - Math.pow(1 - u, 4)) * 0.045;
}

const flightCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 14, 195),
    new THREE.Vector3(8, 18, 120),
    new THREE.Vector3(14, 22, 55),
    new THREE.Vector3(-1200, 80, 420),
    new THREE.Vector3(-2800, 220, 1100),
    new THREE.Vector3(-5200, 520, 2400),
    new THREE.Vector3(-7200, 1200, 5200),
    new THREE.Vector3(-2400, 2800, 22000),
    new THREE.Vector3(400, 4200, 52000),
    new THREE.Vector3(1200, 6500, 108000),
    new THREE.Vector3(0, 16, 215),
  ],
  false,
  "chordal",
);

const lookCurve = new THREE.CatmullRomCurve3(
  [
    EARTH_POS.clone(),
    EARTH_POS.clone(),
    new THREE.Vector3(-400, 0, 80),
    new THREE.Vector3(-2000, 0, 200),
    new THREE.Vector3(-4200, 0, 0),
    new THREE.Vector3(-6000, 0, -800),
    new THREE.Vector3(-3500, 0, -4000),
    new THREE.Vector3(-800, 0, -18000),
    new THREE.Vector3(0, 0, -45000),
    new THREE.Vector3(0, 0, -75000),
    EARTH_POS.clone(),
  ],
  false,
  "chordal",
);

export function getIntroCamera(_t: number, _outerPlanetX: number) {
  const p = mapFlightProgress(_t / INTRO_DURATION_SEC);
  const position = flightCurve.getPointAt(clamp(p, 0, 1));
  const lookAt = lookCurve.getPointAt(clamp(p, 0, 1));

  const outbound = p > 0.05 && p < 0.9;
  const fov = outbound
    ? THREE.MathUtils.lerp(42, 72, Math.sin(p * Math.PI) * 0.85 + 0.15)
    : THREE.MathUtils.lerp(72, 40, (p - 0.9) / 0.1);

  return { position, lookAt, fov };
}

export function introTime(progress: number): number {
  return clamp(progress, 0, 1) * INTRO_DURATION_SEC;
}

export function getIntroOverlays(t: number) {
  const p = t / INTRO_DURATION_SEC;
  const pulseReveal = clamp((p - 0.72) / 0.08, 0, 1);
  const pulseOpacity =
    p < 0.72 ? 0 : p < 0.88 ? easeO(pulseReveal) : clamp(1 - (p - 0.88) / 0.08, 0, 1);

  const earthPulse = p < 0.12 ? (Math.sin(t * 8) + 1) / 2 : 0;
  const showSky = p > 0.25;
  const showDeepSpace = p > 0.55;

  return {
    pulseOpacity: pulseOpacity * 0.95,
    earthPulse,
    showSky,
    showDeepSpace,
  };
}

export function getFadeOpacity(t: number): number {
  if (t < 0.25) return 1;
  if (t < 1.2) return 1 - (t - 0.25) / 0.95;
  return 0;
}

/** Solar system fades as we leave; sky dome takes over */
export function getSolarSystemOpacity(p: number): number {
  const t = mapFlightProgress(p);
  if (t < 0.2) return 1;
  if (t < 0.55) return 1 - (t - 0.2) / 0.35;
  if (t < 0.88) return 0.08;
  return clamp((t - 0.88) / 0.08, 0, 1);
}
