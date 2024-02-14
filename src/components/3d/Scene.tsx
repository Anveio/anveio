"use client";

import { Preload, View } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React from "react";

export default function Scene({
  style,
  ...props
}: Omit<React.ComponentProps<typeof Canvas>, "children"> & {
  children?: never[];
}) {
  return (
    <Canvas
      orthographic
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100dvw",
        height: "100dvh",
        ...style,
      }}
      camera={{ position: [0, 0, 100], zoom: 50 }}
      gl={{ antialias: false }}
      {...props}
    >
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
