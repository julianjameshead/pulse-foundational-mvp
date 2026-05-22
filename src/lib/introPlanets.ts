import * as THREE from "three";
import { PLANET_TEXTURES } from "@/lib/planetTextures";
import { SUN_POS } from "@/lib/introCinematic";

export interface IntroPlanetConfig {
  name: string;
  texture?: string;
  procedural?: boolean;
  size: number;
  dist: number;
  ang: number;
  tilt?: number;
  color?: string;
}

export const INTRO_PLANETS: IntroPlanetConfig[] = [
  { name: "Mercury", procedural: true, size: 10, dist: 380, ang: 2.4, tilt: 0.01 },
  { name: "Venus", procedural: true, size: 22, dist: 720, ang: 1.8, tilt: 3.1 },
  { name: "Mars", texture: PLANET_TEXTURES.mars, size: 18, dist: 1250, ang: 0.6, tilt: 0.44 },
  { name: "Jupiter", texture: PLANET_TEXTURES.jupiter, size: 95, dist: 1900, ang: -0.3, tilt: 0.05 },
  { name: "Saturn", texture: PLANET_TEXTURES.saturn, size: 82, dist: 2700, ang: 0.9, tilt: 0.47 },
  { name: "Uranus", texture: PLANET_TEXTURES.uranus, size: 48, dist: 3500, ang: -1.2, tilt: 1.7 },
  { name: "Neptune", texture: PLANET_TEXTURES.neptune, size: 46, dist: 4200, ang: 0.2, tilt: 0.49 },
];

export function planetWorldPosition(cfg: IntroPlanetConfig): THREE.Vector3 {
  return new THREE.Vector3(
    SUN_POS.x + Math.cos(cfg.ang) * cfg.dist,
    0,
    Math.sin(cfg.ang) * cfg.dist,
  );
}

export const OUTER_PLANET_X = planetWorldPosition(
  INTRO_PLANETS[INTRO_PLANETS.length - 1],
).x;
