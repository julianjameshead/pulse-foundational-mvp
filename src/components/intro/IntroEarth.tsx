"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EARTH_POS, EARTH_R, SUN_POS } from "@/lib/introCinematic";
import {
  atmoFragmentShader,
  atmoVertexShader,
  earthFragmentShader,
  earthVertexShader,
} from "@/lib/introEarthShader";
import { PLANET_TEXTURES } from "@/lib/planetTextures";

const MOON_R = EARTH_R * 0.27;
const MOON_ORBIT = EARTH_R * 4.5;
const _sunDir = new THREE.Vector3();
const _quat = new THREE.Quaternion();

interface IntroEarthProps {
  elapsed: number;
  earthPulse: number;
}

export function IntroEarth({ elapsed, earthPulse }: IntroEarthProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmoRef = useRef<THREE.Mesh>(null);
  const moonPivot = useRef<THREE.Group>(null);

  const [dayMap, nightMap, cloudMap, specMap, moonMap] = useTexture([
    PLANET_TEXTURES.earth,
    PLANET_TEXTURES.earthNight,
    PLANET_TEXTURES.earthClouds,
    PLANET_TEXTURES.earthSpecular,
    PLANET_TEXTURES.moon,
  ]);

  useEffect(() => {
    cloudMap.wrapS = THREE.RepeatWrapping;
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    specMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;
  }, [cloudMap, dayMap, nightMap, specMap]);

  const earthMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: dayMap },
        nightMap: { value: nightMap },
        cloudMap: { value: cloudMap },
        specMap: { value: specMap },
        sunDir: { value: new THREE.Vector3(1, 0, 0) },
        uTime: { value: 0 },
        atmColor: { value: new THREE.Color(0x5aa8ff) },
      },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    });
  }, [dayMap, nightMap, cloudMap, specMap]);

  const atmoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          c: { value: 0.9 },
          p: { value: 3.5 },
          glowColor: { value: new THREE.Color(0x5aa8ff) },
        },
        vertexShader: atmoVertexShader,
        fragmentShader: atmoFragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useFrame(() => {
    const spin = elapsed * 0.08;
    const beat = 1 + earthPulse * 0.04;
    if (earthRef.current) {
      earthRef.current.rotation.y = spin;
      earthRef.current.scale.setScalar(beat);

      _sunDir.copy(SUN_POS).sub(EARTH_POS).normalize();
      earthRef.current.getWorldQuaternion(_quat);
      _quat.invert();
      _sunDir.applyQuaternion(_quat);
      earthMat.uniforms.sunDir.value.copy(_sunDir);
      earthMat.uniforms.uTime.value = elapsed;
    }
    if (atmoRef.current) {
      atmoRef.current.rotation.y = spin * 0.3;
      atmoRef.current.scale.setScalar(beat * 1.12);
    }
    if (moonPivot.current) moonPivot.current.rotation.y = elapsed * 0.15;
  });

  return (
    <group position={EARTH_POS}>
      <mesh ref={earthRef} material={earthMat}>
        <sphereGeometry args={[EARTH_R, 96, 96]} />
      </mesh>
      <mesh ref={atmoRef} material={atmoMat}>
        <sphereGeometry args={[EARTH_R * 1.12, 64, 64]} />
      </mesh>
      <group ref={moonPivot} rotation={[0, 0, 0.09]}>
        <mesh position={[MOON_ORBIT, 0, 0]}>
          <sphereGeometry args={[MOON_R, 48, 48]} />
          <meshPhongMaterial
            map={moonMap}
            shininess={4}
            specular={0x222222}
            color={0xffffff}
          />
        </mesh>
      </group>
    </group>
  );
}
