import * as THREE from "three";

/** Shared intro scene coordinates — keep in a leaf module to avoid import cycles */
export const EARTH_POS = new THREE.Vector3(0, 0, 0);
export const EARTH_R = 50;
export const SUN_POS = new THREE.Vector3(-4800, 0, 0);
export const SUN_R = 220;
