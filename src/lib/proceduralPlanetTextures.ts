import * as THREE from "three";

function noise(x: number, y: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x: number, y: number, oct = 5) {
  let v = 0;
  let a = 0.5;
  let f = 1;
  for (let i = 0; i < oct; i++) {
    v += a * noise(x * f, y * f);
    f *= 2;
    a *= 0.5;
  }
  return v;
}

function makeTex(w: number, h: number, fn: (u: number, v: number) => [number, number, number]) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = fn(x / w, y / h);
      const i = (y * w + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const cache = new Map<string, THREE.CanvasTexture>();

/** High-res procedural surfaces from pulse.html */
export function makeProceduralPlanetTexture(name: string): THREE.CanvasTexture {
  const hit = cache.get(name);
  if (hit) return hit;

  const TW = 1024;
  const TH = 512;
  let tex: THREE.CanvasTexture;

  switch (name) {
    case "Mercury":
      tex = makeTex(TW, TH, (u, v) => {
        const n = fbm(u * TW * 0.008, v * TH * 0.008, 6);
        const craters = Math.max(0, 1 - fbm(u * TW * 0.02 + 50, v * TH * 0.02 + 30, 3) * 3.2);
        const val = (n * 0.55 + craters * 0.35) * 130 + 70;
        return [val, val - 6, val - 12];
      });
      break;
    case "Venus":
      tex = makeTex(TW, TH, (u, v) => {
        const n = fbm(u * TW * 0.004, v * TH * 0.007, 6);
        const sw = fbm(u * TW * 0.008 + n * 15, v * TH * 0.005, 4);
        return [210 + sw * 35 + n * 18, 180 + sw * 28 + n * 14, 130 + sw * 14 + n * 8];
      });
      break;
    default:
      tex = makeTex(TW, TH, () => [140, 140, 140]);
  }

  cache.set(name, tex);
  return tex;
}
