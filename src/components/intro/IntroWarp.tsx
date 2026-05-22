"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COUNT = 2400;

interface IntroWarpProps {
  intensity: number;
}

/** Radial streak particles — speed lines during the burst */
export function IntroWarp({ intensity }: IntroWarpProps) {
  const ref = useRef<THREE.Points>(null);
  const { camera } = useThree();

  const geom = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const lengths = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 220;
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i * 3 + 2] = -80 - Math.random() * 420;
      lengths[i] = 0.4 + Math.random() * 1.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aLen", new THREE.BufferAttribute(lengths, 1));
    return g;
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uOpacity: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          attribute float aLen;
          uniform float uTime;
          varying float vFade;
          void main() {
            vec3 p = position;
            p.z += uTime * 1800.0 * aLen;
            p.z = mod(p.z + 500.0, 500.0) - 500.0;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vFade = smoothstep(-500.0, -40.0, p.z);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (2.0 + aLen * 3.5) * (280.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          varying float vFade;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = 1.0 - smoothstep(0.0, 0.5, d);
            vec3 col = mix(vec3(0.55, 0.75, 1.0), vec3(1.0, 0.92, 0.75), core);
            gl_FragColor = vec4(col, core * vFade * uOpacity);
          }
        `,
      }),
    [],
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.copy(camera.position);
    ref.current.quaternion.copy(camera.quaternion);
    mat.uniforms.uOpacity.value = intensity * 0.85;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    ref.current.visible = intensity > 0.08;
  });

  if (intensity <= 0.08) return null;

  return <points ref={ref} geometry={geom} material={mat} frustumCulled={false} />;
}
