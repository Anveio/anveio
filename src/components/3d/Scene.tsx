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
      // @ts-expect-error
      orthographic
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        ...style,
      }}
      camera={{ position: [0, 0, 100], zoom: 50 }}
      gl={{ antialias: false }}
      eventSource={document.body}
      eventPrefix="client"
      {...props}
    >
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
