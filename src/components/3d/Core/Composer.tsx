"use client";
import { useLoader } from "@react-three/fiber";
import { LUTCubeLoader } from "postprocessing";
import { Bloom, EffectComposer, LUT } from "@react-three/postprocessing";
import { Texture } from "three";

export const Composer = () => {
  return (
    <EffectComposer disableNormalPass>
      <Bloom
        mipmapBlur
        levels={9}
        intensity={1.5}
        luminanceThreshold={1}
        luminanceSmoothing={1}
      />
    </EffectComposer>
  );
};
