"use client";

import * as THREE from "three";
import React, { forwardRef, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { lerpC } from "@/lib/3d/utils"; // Assuming lerpC is correctly typed in its definition

const w = 1;
const h = 1;
const r = 0.1;
const depth = 1;
const s = new THREE.Shape();
s.moveTo(-w / 2, -h / 2 + r);
s.lineTo(-w / 2, h / 2 - r);
s.absarc(-w / 2 + r, h / 2 - r, r, 1 * Math.PI, 0.5 * Math.PI, true);
s.lineTo(w / 2 - r, h / 2);
s.absarc(w / 2 - r, h / 2 - r, r, 0.5 * Math.PI, 0 * Math.PI, true);
s.lineTo(w / 2, -h / 2 + r);
s.absarc(w / 2 - r, -h / 2 + r, r, 2 * Math.PI, 1.5 * Math.PI, true);
s.lineTo(-w / 2 + r, -h / 2);
s.absarc(-w / 2 + r, -h / 2 + r, r, 1.5 * Math.PI, 1 * Math.PI, true);

const boxGeometry = new THREE.BoxGeometry();
const roundedBoxGeometry = new THREE.ExtrudeGeometry(s, {
  depth: 1,
  bevelEnabled: false,
});
roundedBoxGeometry.translate(0, 0, -depth / 2);
roundedBoxGeometry.computeVertexNormals();

export const Box = forwardRef<THREE.Group, any>((props, ref) => {
  const [hovered, hover] = useState(false);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (inner.current?.material instanceof THREE.MeshStandardMaterial) {
      const emissiveColor = hovered
        ? new THREE.Color("white")
        : new THREE.Color("#454545");
      lerpC(inner.current.material.emissive, emissiveColor, 0.1);
    }
  });

  return (
    <group scale={0.5} ref={ref} {...props}>
      <mesh
        visible={false}
        // @ts-expect-error
        onRayOver={() => hover(true)}
        onRayOut={() => hover(false)}
        geometry={boxGeometry}
      />
      <mesh ref={inner} geometry={roundedBoxGeometry}>
        <meshStandardMaterial
          color="#333"
          toneMapped={false}
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  );
});
