"use client";

import { calculateRefractionAngle, lerp, lerpV3 } from "@/lib/3d/utils";
import { Center, Text3D } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import {
  BreakPointHooks,
  breakpointsTailwind,
} from "@react-hooks-library/core";
import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { Beam } from "./Beam";
import { Flare } from "./Flare";
import { Prism } from "./Prism";
import { Rainbow } from "./Rainbow";
import { Bloom, EffectComposer, LUT } from "@react-three/postprocessing";
import { LUTCubeLoader } from "postprocessing";
import { Box } from "./Box";

const { useGreater, useBetween, isSmaller } =
  BreakPointHooks(breakpointsTailwind);

const Text3dYCoordinatesConfig = {
  sm: [4.5, 3.25, 2],
  md: [6, 4, 2],
} as const;

export function HeroScene() {
  const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

  const texture = useLoader(LUTCubeLoader, "/lut/F-6800-STD.cube");
  const [isPrismHit, hitPrism] = useState(false);
  const flare = useRef<any>(null);
  const ambient = useRef<any>(null);
  const spot = useRef<any>(null);
  const boxreflect = useRef<any>(null);
  const rainbow = useRef<any>(null);

  const greater = useGreater("sm");

  const rayOut = useCallback(() => hitPrism(false), []);
  const rayOver = useCallback((e: any) => {
    // Break raycast so the ray stops when it touches the prism
    e.stopPropagation();
    hitPrism(true);
    // Set the intensity really high on first contact
    rainbow.current.material.speed = 1;
    rainbow.current.material.emissiveIntensity = 20;
  }, []);

  const vec = new THREE.Vector3();
  const rayMove = useCallback(({ api, position, direction, normal }: any) => {
    if (!normal) return;
    // Extend the line to the prisms center
    vec.toArray(api.positions, api.number++ * 3);
    // Set flare
    flare.current.position.set(position.x, position.y, -0.5);
    flare.current.rotation.set(0, 0, -Math.atan2(direction.x, direction.y));
    // Calculate refraction angles
    let angleScreenCenter = Math.atan2(-position.y, -position.x);
    const normalAngle = Math.atan2(normal.y, normal.x);
    // The angle between the ray and the normal
    const incidentAngle = angleScreenCenter - normalAngle;
    // Calculate the refraction for the incident angle
    const refractionAngle = calculateRefractionAngle(incidentAngle) * 6;
    // Apply the refraction
    angleScreenCenter += refractionAngle;
    rainbow.current.rotation.z = angleScreenCenter;
    // Set spot light
    lerpV3(
      spot.current.target.position,
      [Math.cos(angleScreenCenter), Math.sin(angleScreenCenter), 0],
      0.05
    );
    spot.current.target.updateMatrixWorld();
  }, []);

  let baseAngle = useRef(0);

  useFrame((state, delta) => {
    // Increment the base angle to move along a circle over time
    baseAngle.current += delta * 0.2; // Increase by delta time for smooth animation, adjust speed here as necessary

    // Define the radius of the circle and the center point
    const radius = 2; // Adjust the radius as needed
    const centerX = 0; // Center X position of the circle, adjust as needed
    const centerY = 0; // Center Y position of the circle, adjust as needed

    // Calculate the new x and y positions based on the base angle
    const x = centerX + radius * Math.cos(baseAngle.current);
    const y = centerY + radius * Math.sin(baseAngle.current);

    const nextX = (x * state.viewport.width) / 2;
    const nextY = (y * state.viewport.height) / 2;
    // Apply these positions through the setRay function
    boxreflect.current.setRay(
      [
        nextX, // Adjust if the circle seems off-center
        nextY, // Adjust if the circle seems off-center
        0,
      ],
      [0, 0, 0]
    );

    // Continue with your existing animation code...
    lerp(
      rainbow.current.material,
      "emissiveIntensity",
      isPrismHit ? 2.5 : 0,
      0.1
    );
    lerp(ambient.current, "intensity", isPrismHit ? 1.5 : 0, 1);
  });

  const textLayout = Text3dYCoordinatesConfig[greater ? "md" : "sm"];

  return (
    <>
      {/* Lights */}
      <ambientLight ref={ambient} intensity={0} />
      <pointLight position={[5, 0, 0]} intensity={0.05} />
      <pointLight position={[0, 10, 0]} intensity={0.05} />
      <pointLight position={[-5, 0, 0]} intensity={0.05} />
      <spotLight
        ref={spot}
        intensity={0}
        distance={7}
        angle={1}
        penumbra={1}
        position={[0, 0, 1]}
      />
      {/* Caption */}
      <Center top bottom position={[0, textLayout[0], 0]}>
        <Text3D
          size={0.7}
          letterSpacing={-0.05}
          height={0.05}
          font="/fonts/Inter_Bold.json"
        >
          The Internet
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
      <Center top bottom position={[0, textLayout[1], 0]}>
        <Text3D
          size={0.7}
          letterSpacing={-0.05}
          height={0.05}
          font="/fonts/Inter_Bold.json"
        >
          Should Feel
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
      <Center top bottom position={[0, textLayout[2], 0]}>
        <Text3D
          size={0.7}
          letterSpacing={-0.05}
          height={0.05}
          font="/fonts/Inter_Bold.json"
        >
          Alive
          <meshStandardMaterial color="white" />
        </Text3D>
      </Center>
      {/* Prism + reflect beam */}
      <Beam ref={boxreflect} bounce={10} far={20}>
        <Prism
          position={[0, 0, 0]}
          onRayOver={rayOver}
          onRayOut={rayOut}
          onRayMove={rayMove}
        />
        <Box position={[3, -2, 0]} rotation={[0, 0, Math.PI / 8]} />
        <Box position={[-2.4, -1, 0]} rotation={[0, 0, Math.PI / -4]} />
        <Box position={[-3.2, 2, 0]} rotation={[0, 0, Math.PI / -4]} />
      </Beam>
      {/* Rainbow and flares */}
      <Rainbow
        ref={rainbow}
        startRadius={0}
        endRadius={1.5}
        fade={0}
        emissiveIntensity={0}
      />
      <Flare
        ref={flare}
        visible={isPrismHit}
        renderOrder={10}
        scale={1.25}
        streak={[12.5, 20, 1]}
      />
      {isIos ? null : (
        <EffectComposer disableNormalPass>
          <Bloom
            mipmapBlur
            levels={9}
            intensity={1.5}
            luminanceThreshold={1}
            luminanceSmoothing={1}
          />
          {/* @ts-expect-error */}
          <LUT lut={texture} />
        </EffectComposer>
      )}
    </>
  );
}
