import * as THREE from "three";
import { EARTH_POS } from "@/lib/introConstants";
import { INTRO_PLANETS, planetWorldPosition } from "@/lib/introPlanets";

export { EARTH_POS, EARTH_R, SUN_POS, SUN_R } from "@/lib/introConstants";

/** YouTube-style Earth → galaxy pullout, compressed to 5s (vid: OCpvAOioKto) */
export const INTRO_DURATION_SEC = 5;
export const INTRO_DURATION_MS = INTRO_DURATION_SEC * 1000;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeO = (t: number) => 1 - Math.pow(1 - t, 3);

/** Skim past a planet limb — low altitude, forward flight, not bird's-eye */
function flyby(
  center: THREE.Vector3,
  radius: number,
  from: THREE.Vector3,
  yLift = 18,
): THREE.Vector3 {
  const approach = center.clone().sub(from).normalize();
  const lateral = new THREE.Vector3(-approach.z, 0, approach.x).normalize();
  return center
    .clone()
    .add(lateral.multiplyScalar(radius * 1.15))
    .add(approach.clone().multiplyScalar(-radius * 0.55))
    .add(new THREE.Vector3(0, yLift + radius * 0.25, 0));
}

const mercury = planetWorldPosition(INTRO_PLANETS[0]);
const venus = planetWorldPosition(INTRO_PLANETS[1]);
const mars = planetWorldPosition(INTRO_PLANETS[2]);
const jupiter = planetWorldPosition(INTRO_PLANETS[3]);
const saturn = planetWorldPosition(INTRO_PLANETS[4]);
const uranus = planetWorldPosition(INTRO_PLANETS[5]);
const neptune = planetWorldPosition(INTRO_PLANETS[6]);

const p0 = new THREE.Vector3(0, 14, 198);
const p1 = new THREE.Vector3(0, 18, 52);
const p2 = new THREE.Vector3(175, 14, -4);
const p3 = flyby(mercury, 10, p2);
const p4 = flyby(venus, 22, p3);
const p5 = flyby(mars, 18, p4);
const p6 = flyby(jupiter, 95, p5, 22);
const p7 = flyby(saturn, 82, p6, 26);
const p8 = flyby(uranus, 48, p7, 30);
const p9 = flyby(neptune, 46, p8, 34);
const p10 = new THREE.Vector3(-420, 120, 1800);
const p11 = new THREE.Vector3(90, 680, 28000);
const p12 = new THREE.Vector3(320, 1100, 92000);
const p13 = new THREE.Vector3(0, 18, 222);

/** Fly-through waypoints — skim planet limbs along the ecliptic */
const flightCurve = new THREE.CatmullRomCurve3(
  [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12, p13],
  false,
  "chordal",
);

const _pos = new THREE.Vector3();
const _tangent = new THREE.Vector3();
const _look = new THREE.Vector3();
const _ahead = new THREE.Vector3();

/** Aggressive outbound, snap return */
export function mapFlightProgress(linear: number): number {
  const t = clamp(linear, 0, 1);
  if (t < 0.05) return t * 0.16;
  if (t < 0.78) {
    const u = (t - 0.05) / 0.73;
    return 0.008 + Math.pow(u, 0.34) * 0.895;
  }
  const u = (t - 0.78) / 0.22;
  return 0.903 + (1 - Math.pow(1 - u, 5)) * 0.097;
}

export function getIntroCamera(linear: number) {
  const p = mapFlightProgress(linear);
  const pt = clamp(p, 0, 1);
  flightCurve.getPointAt(pt, _pos);
  flightCurve.getTangentAt(pt, _tangent).normalize();

  // Look along velocity + slight pull toward next waypoint for "pushing through" feel
  flightCurve.getPointAt(clamp(pt + 0.035, 0, 1), _ahead);
  _look.copy(_pos).addScaledVector(_tangent, 900);
  _look.lerp(_ahead, 0.35);

  if (linear > 0.76) {
    const u = easeO((linear - 0.76) / 0.24);
    _look.lerp(EARTH_POS, u);
  }

  const burst = p > 0.03 && p < 0.92;
  const fov = burst
    ? THREE.MathUtils.lerp(42, 80, Math.sin(p * Math.PI) * 0.92 + 0.08)
    : THREE.MathUtils.lerp(80, 40, clamp((linear - 0.88) / 0.12, 0, 1));

  return { position: _pos.clone(), lookAt: _look.clone(), fov };
}

export function getWarpIntensity(linear: number): number {
  const p = mapFlightProgress(linear);
  if (p < 0.05 || p > 0.93) return 0;
  return Math.pow(Math.sin(((p - 0.05) / 0.88) * Math.PI), 1.15);
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
  const showSky = p > 0.2;
  const showDeepSpace = p > 0.45;

  return {
    pulseOpacity: pulseOpacity * 0.9,
    earthPulse,
    showSky,
    showDeepSpace,
    warp: getWarpIntensity(p),
  };
}

export function getFadeOpacity(t: number): number {
  if (t < 0.18) return 1;
  if (t < 0.75) return 1 - (t - 0.18) / 0.57;
  return 0;
}

/** Keep planets visible during fly-by; fade only once we're in deep sky */
export function getSolarSystemOpacity(linear: number): number {
  const p = mapFlightProgress(linear);
  if (p < 0.55) return 1;
  if (p < 0.78) return 1 - ((p - 0.55) / 0.23) * 0.75;
  if (p < 0.9) return 0.25;
  return clamp(0.25 + ((p - 0.9) / 0.1) * 0.75, 0, 1);
}
