import { protectContext } from "../../threeSetup.ts";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Laptop from "./Laptop.tsx";

export default function LaptopScene({ progress, linkRefs }: { progress: number; linkRefs?: React.RefObject<(HTMLElement | null)[]> }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0.9, 2.2, -4.7], fov: 30 }}
      dpr={[1, 2]}
      onCreated={({ gl, invalidate }) => protectContext(gl, invalidate)}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
    >
      <Suspense fallback={null}>
        <Laptop scrollProgress={progress} linkRefs={linkRefs} />
      </Suspense>
    </Canvas>
  );
}
