/**
 * Local planetary textures (Solar System Scope, CC BY 4.0).
 * Served from /public/textures/planets — avoids fragile remote CDN URLs.
 * @see https://www.solarsystemscope.com/textures/
 */
const base = "/textures/planets";

export const PLANET_TEXTURES = {
  earth: `${base}/earth.jpg`,
  moon: `${base}/moon.jpg`,
  mars: `${base}/mars.jpg`,
  jupiter: `${base}/jupiter.jpg`,
  saturn: `${base}/saturn.jpg`,
  uranus: `${base}/uranus.jpg`,
  neptune: `${base}/neptune.jpg`,
} as const;
