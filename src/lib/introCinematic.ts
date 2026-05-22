import * as THREE from "three";
import { INTRO_PLANETS, planetWorldPosition } from "@/lib/introPlanets";

export const EARTH_POS = new THREE.Vector3(0, 0, 0);
export const EARTH_R = 50;
export const SUN_POS = new THREE.Vector3(-4800, 0, 0);
export const SUN_R = 220;

/** YouTube-style Earth → galaxy pullout, compressed to 5s (vid: OCpvAOioKto) */
export const INTRO_DURATION_SEC = 5;
export const INTRO_DURATION_MS = INTRO_DURATION_SEC * 1000;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeO = (t: number) => 1 - Math.pow(1 - t, 3);

const mars = planetWorldPosition(INTRO_PLANETS[2]);
const jupiter = planetWorldPosition(INTRO_PLANETS[3]);
const saturn = planetWorldPosition(INTRO_PLANETS[4]);
const neptune = planetWorldPosition(INTRO_PLANETS[6]);

/** Fly-through waypoints — pass near planet limbs, not bird's-eye above */
const flightCurve = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 14, 198),
    new THREE.Vector3(0, 22, 72),
    new THREE.Vector3(210, 18, 28),
    mars.clone().add(new THREE.Vector3(40, mars.y + 55, 95)),
    jupiter.clone().add(new THREE.Vector3(70, 140, -160)),
    saturn.clone().add(new THREE.Vector3(-90, 110, 200)),
    neptune.clone().add(new THREE.Vector3(120, 320, 480)),
    new THREE.Vector3(-900, 1400, 4200),
    new THREE.Vector3(180, 4200, 48000),
    new THREE.Vector3(600, 7200, 118000),
    new THREE.Vector3(0, 18, 222),
  ],
  false,
  "chordal",
);

const _pos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _look = new THREE.Vector3();

/** Aggressive outbound, snap return */
export function mapFlightProgress(linear: number): number {
  const t = clamp(linear, 0, 1);
  if (t < 0.06) return t * 0.18;
  if (t < 0.8) {
    const u = (t - 0.06) / 0.74;
    return 0.011 + Math.pow(u, 0.36) * 0.9;
  }
  const u = (t - 0.8) / 0.2;
  return 0.911 + (1 - Math.pow(1 - u, 5)) * 0.089;
}

export function getIntroCamera(linear: number) {
  const p = mapFlightProgress(linear);
  flightCurve.getPointAt(clamp(p, 0, 1), _pos);
  flightCurve.getTangentAt(clamp(p, 0, 1), _tangent).normalize();

  _look.copy(_pos).addScaledVector(_tangent, 1400);
  if (linear > 0.78) {
    const u = easeO((linear - 0.78) / 0.22);
    _look.lerp(EARTH_POS, u);
  }

  const burst = p > 0.04 && p < 0.9;
  const fov = burst
    ? THREE.MathUtils.lerp(40, 78, Math.sin(p * Math.PI) * 0.9 + 0.1)
    : THREE.MathUtils.lerp(78, 40, clamp((linear - 0.9) / 0.1, 0, 1));

  return { position: _pos.clone(), lookAt: _look.clone(), fov };
}

export function getWarpIntensity(linear: number): number {
  const p = mapFlightProgress(linear);
  if (p < 0.06 || p > 0.92) return 0;
  return Math.pow(Math.sin(((p - 0.06) / 0.86) * Math.PI), 1.2);
}

export function introTime(progress: number): number {
  return clamp(progress, 0, 1) * INTRO_DURATION_SEC;
}

export function getIntroOverlays(t: number) {
  const p = t / INTRO_DURATION_SEC;
  const pulseReveal = clamp((p - 0.86) / 0.06, 0, 1);
  const pulseOpacity =
    p < 0.86 ? 0 : p < 0.96 ? easeO(pulseReveal) : clamp(1 - (p - 0.96) / 0.04, 0, 1);

  const earthPulse = p < 0.14 ? (Math.sin(t * 10) + 1) / 2 : 0;
  const showSky = p > 0.22;
  const showDeepSpace = p > 0.48;

  return {
    pulseOpacity: pulseOpacity * 0.9,
    earthPulse,
    showSky,
    showDeepSpace,
    warp: getWarpIntensity(p),
  };
}

export function getFadeOpacity(t: number): number {
  if (t < 0.2) return 1;
  if (t < 0.85) return 1 - (t - 0.2) / 0.65;
  return 0;
}

export function getSolarSystemOpacity(linear: number): number {
  const p = mapFlightProgress(linear);
  if (p < 0.12) return 1;
  if (p < 0.5) return 1 - ((p - 0.12) / 0.38) * 0.35;
  if (p < 0.82) return 0.65;
  return clamp(0.65 + ((p - 0.82) / 0.18) * 0.35, 0, 1);
}
