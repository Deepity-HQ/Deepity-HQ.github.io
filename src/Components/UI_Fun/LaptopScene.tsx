import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import Laptop from "./Laptop.tsx";

export default function LaptopScene({ progress }: { progress: number }) {
  return (
    <Canvas
      shadows
      camera={{ position: [0.9, 2.2, -4.7], fov: 30 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.15,
      }}
    >
      <Suspense fallback={null}>
        <Laptop scrollProgress={progress} />
      </Suspense>
    </Canvas>
  );
}
