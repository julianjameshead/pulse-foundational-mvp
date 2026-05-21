/**
 * Local planetary textures for the intro cinematic.
 * @see https://www.solarsystemscope.com/textures/
 */
const base = "/textures/planets";

export const PLANET_TEXTURES = {
  earth: `${base}/earth.jpg`,
  earthNight: `${base}/earth_night.jpg`,
  earthClouds: `${base}/earth_clouds.png`,
  earthSpecular: `${base}/earth_specular.jpg`,
  moon: `${base}/moon.jpg`,
  mars: `${base}/mars.jpg`,
  jupiter: `${base}/jupiter.jpg`,
  saturn: `${base}/saturn.jpg`,
  uranus: `${base}/uranus.jpg`,
  neptune: `${base}/neptune.jpg`,
} as const;
