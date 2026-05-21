import * as THREE from "three";
import { PLANET_TEXTURES } from "@/lib/planetTextures";
import { S, SUN_POS } from "@/lib/introCinematic";

export interface IntroPlanetConfig {
  name: string;
  texture: string;
  size: number;
  dist: number;
  ang: number;
  tilt?: number;
  rings?: boolean;
}

export const INTRO_PLANETS: IntroPlanetConfig[] = [
  { name: "Mars", texture: PLANET_TEXTURES.mars, size: 18, dist: 1250, ang: 0.6, tilt: 0.44 },
  { name: "Jupiter", texture: PLANET_TEXTURES.jupiter, size: 95, dist: 1900, ang: -0.3, tilt: 0.05 },
  { name: "Saturn", texture: PLANET_TEXTURES.saturn, size: 82, dist: 2700, ang: 0.9, tilt: 0.47, rings: true },
  { name: "Neptune", texture: PLANET_TEXTURES.neptune, size: 46, dist: 4200, ang: 0.2, tilt: 0.49 },
];

export function planetWorldPosition(cfg: IntroPlanetConfig): THREE.Vector3 {
  return new THREE.Vector3(
    SUN_POS.x + Math.cos(cfg.ang) * cfg.dist * S,
    0,
    Math.sin(cfg.ang) * cfg.dist * S,
  );
}

export const OUTER_PLANET_X = planetWorldPosition(
  INTRO_PLANETS[INTRO_PLANETS.length - 1],
).x;
