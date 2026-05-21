"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 14000;

function starColor(t: number): [number, number, number] {
  if (t < 0.12) return [1, 0.55, 0.3];
  if (t < 0.3) return [1, 0.75, 0.5];
  if (t < 0.5) return [1, 0.95, 0.85];
  if (t < 0.65) return [1, 1, 0.95];
  if (t < 0.8) return [0.85, 0.92, 1];
  if (t < 0.93) return [0.65, 0.78, 1];
  return [0.5, 0.6, 1];
}

export function IntroStarfield() {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, colors, sizes, twinkle } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);
    const twinkle = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 80000 + Math.random() * 120000;
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i * 3 + 2] = r * Math.cos(ph);
      const [cr, cg, cb] = starColor(Math.random());
      const br = 0.3 + Math.random() * 0.7;
      colors[i * 3] = cr * br;
      colors[i * 3 + 1] = cg * br;
      colors[i * 3 + 2] = cb * br;
      sizes[i] =
        Math.random() < 0.03
          ? 3 + Math.random() * 3
          : Math.random() < 0.15
            ? 1.4 + Math.random()
            : 0.7 + Math.random() * 0.5;
      twinkle[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, sizes, twinkle };
  }, []);

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinkle" args={[twinkle, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          attribute float aSize;
          attribute float aTwinkle;
          varying vec3 vC;
          varying float vB;
          uniform float uTime;
          void main() {
            vC = color;
            float tw = sin(uTime * 1.8 + aTwinkle) * 0.5 + 0.5;
            vB = 0.55 + tw * 0.75;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (1.0 + tw * 0.4);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vC;
          varying float vB;
          void main() {
            vec2 p = gl_PointCoord - vec2(0.5);
            float d = length(p);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vC * vB, a * vB);
          }
        `}
      />
    </points>
  );
}
