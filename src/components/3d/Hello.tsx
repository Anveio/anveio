"use client";

import * as THREE from "three";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { PrimitiveProps, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useAnimations,
  useCursor,
  OrthographicCamera,
} from "@react-three/drei";

const normalMaterial = new THREE.MeshNormalMaterial();

function Model(props: Omit<PrimitiveProps, "scene">) {
  const { scene } = useGLTF("/3d/hello-text.glb");
  return <primitive object={scene} {...props} />;
}

function Fragments(props: Omit<PrimitiveProps, "scene">) {
  const { visible, ...rest } = props;
  const group = useRef();
  const { scene, animations, materials } = useGLTF("/3d/hello-fragments.glb");
  const { actions } = useAnimations(animations, group);
  // Exchange inner material
  useMemo(
    () =>
      scene.traverse((o) => {
        const oCoerced = o as unknown as any;

        return (
          o.type === "Mesh" &&
          oCoerced.material === materials.inner &&
          (oCoerced.material = normalMaterial)
        );
      }),
    []
  );
  // Play actions
  useEffect(() => {
    if (visible)
      Object.keys(actions).forEach((key) => {
        const action = actions[key];

        if (action) {
          action.repetitions = 0;
          action.clampWhenFinished = true;
          action.play();
        }
      });
  }, [visible]);
  return <primitive ref={group} object={scene} {...rest} />;
}

export default function Scene() {
  const vec = new THREE.Vector3();
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  useFrame((state) => {
    state.camera.position.lerp(
      vec.set(clicked ? -10 : 0, clicked ? 10 : 0, 20),
      0.1
    );
    state.camera.lookAt(0, 0, 0);
  });
  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={300} />
      <Fragments visible={clicked} />
      {!clicked && (
        <Model
          onClick={() => (setClicked(true), setHovered(false))}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      )}
    </>
  );
}

useGLTF.preload("/3d/hello-text.glb");
useGLTF.preload("/3d/hello-fragments.glb");
