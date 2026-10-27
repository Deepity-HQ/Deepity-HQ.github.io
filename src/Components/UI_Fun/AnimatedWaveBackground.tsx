import { useRef, useMemo, useLayoutEffect, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
} from "@react-three/postprocessing";

// Dotted lines run away from the viewer (along z): many tightly spaced dots per
// line, with visible gaps between neighboring lines (along x).
const gridX = 120;
const gridZ = 200;
const sepX = 0.4;
const sepZ = 0.135;

// The camera is fitted to this half-width, not the full grid width. The grid is
// wider than that at the front but its far corners and sides can be seen ending.
const fitHalfWidth = 15;
// The camera looks only slightly downward, so the wave sits in the lower half
// of the screen with black space above it.
const cameraPitch = THREE.MathUtils.degToRad(6);

const createDotTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create the dot texture.");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.45)");
  gradient.addColorStop(0.2, "rgba(200, 200, 200, 0.3)");
  gradient.addColorStop(0.6, "rgba(160, 160, 160, 0.1)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

// Bright core fading to a long, soft falloff: used for the halo on the brightest dots
const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create the glow texture.");
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.12, "rgba(235, 238, 255, 0.7)");
  gradient.addColorStop(0.35, "rgba(170, 160, 255, 0.22)");
  gradient.addColorStop(0.7, "rgba(120, 100, 255, 0.05)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
};

const fitWaveCamera = (
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  width: number,
  height: number,
) => {
  const halfWidth = fitHalfWidth;
  const halfDepth = (gridZ / 2) * sepZ;
  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);

  const widthDistance = halfWidth / (Math.tan(halfFov) * (width / height));
  const distance = halfDepth + widthDistance * 0.45;

  const cameraY = 5;
  camera.position.set(0, cameraY, distance);
  camera.lookAt(0, cameraY - (distance + 1) * Math.tan(cameraPitch), -1);
  camera.updateProjectionMatrix();

  if (scene.fog instanceof THREE.Fog) {
    scene.fog.near = distance * 0.55;
    scene.fog.far = distance + halfDepth;
  }
};

const WaveCamera = () => {
  const { camera, scene, size } = useThree();

  useLayoutEffect(() => {
    if (!(camera instanceof THREE.PerspectiveCamera) || size.height === 0)
      return;
    fitWaveCamera(camera, scene, size.width, size.height);
  }, [camera, scene, size.height, size.width]);

  return null;
};

// Wave crests rolling toward the camera: nearer ones are taller on screen,
// the main one is brightest, farther ones fade out.
const crests = [
  { z: 8, height: 1.1, glow: 0.55, width: 1.4, phase: 0.3 },
  { z: 1, height: 1.6, glow: 1.0, width: 1.3, phase: 0 },
  { z: -6, height: 1.0, glow: 0.5, width: 1.6, phase: 1.2 },
  { z: -12, height: 0.8, glow: 0.3, width: 1.8, phase: 2.1 },
];

const smooth = (edge0: number, edge1: number, v: number) => {
  const t = Math.min(Math.max((v - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
};

const halfGridWidth = (gridX / 2) * sepX;
const halfGridDepth = (gridZ / 2) * sepZ;

import { markWaveReady } from "../../waveReady.ts";
import { WebGLBoundary, hasWebGL } from "../../webgl.tsx";

const CREST_STRIDE = 7;
const TERRAIN_STRIDE = 5;

const DottedWave = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const glowRef = useRef<THREE.Points>(null);
  const glowMaterialRef = useRef<THREE.PointsMaterial>(null);
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const colorHelper = useMemo(() => new THREE.Color(), []);
  const flightDirection = useMemo(() => new THREE.Vector3(), []);
  const cameraForward = useMemo(() => new THREE.Vector3(), []);
  const scrollProgress = useRef(0);
  const animatedProgress = useRef(0);
  const frameTick = useRef(0);
  const framesRendered = useRef(0);
  const announcedReady = useRef(false);

  const {
    positions,
    basePositions,
    colors,
    glowColors,
    haloIndex,
    standouts,
    lineCrests,
    lineTerrain,
    zTerrainDynamic,
    zStatic,
    edgeX,
    edgeZ,
  } = useMemo(() => {
    const numParticles = gridX * gridZ;
    const pos = new Float32Array(numParticles * 3);
    const col = new Float32Array(numParticles * 3);
    const glowCol = new Float32Array(numParticles * 3);
    const standoutFlags = new Float32Array(numParticles);

    let i = 0;
    for (let ix = 0; ix < gridX; ix++) {
      for (let iz = 0; iz < gridZ; iz++) {
        pos[i * 3] = (ix - gridX / 2) * sepX;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (iz - gridZ / 2) * sepZ;

        standoutFlags[i] =
          Math.random() > 0.993 ? Math.random() * Math.PI * 2 : -1;
        i++;
      }
    }

    // Only a sparse subset of dots gets a halo sprite; large sprites are costly
    const halo: number[] = [];
    for (let ix = 0; ix < gridX; ix += 2) {
      for (let iz = 0; iz < gridZ; iz += 3) halo.push(ix * gridZ + iz);
    }

    // Terms that never change are computed once, not per dot per frame
    const zStaticValues = new Float32Array(gridZ * 4); // sin/cos(z*0.2), sin/cos(z*0.41)
    const edgeZValues = new Float32Array(gridZ);
    for (let iz = 0; iz < gridZ; iz++) {
      const z = (iz - gridZ / 2) * sepZ;
      zStaticValues[iz * 4] = Math.sin(z * 0.2);
      zStaticValues[iz * 4 + 1] = Math.cos(z * 0.2);
      zStaticValues[iz * 4 + 2] = Math.sin(z * 0.41);
      zStaticValues[iz * 4 + 3] = Math.cos(z * 0.41);
      edgeZValues[iz] = 1 - smooth(halfGridDepth - 6, halfGridDepth, z);
    }
    const edgeXValues = new Float32Array(gridX);
    for (let ix = 0; ix < gridX; ix++) {
      const x = (ix - gridX / 2) * sepX;
      edgeXValues[ix] = 1 - smooth(halfGridWidth - 6, halfGridWidth, Math.abs(x));
    }

    return {
      positions: pos,
      basePositions: new Float32Array(pos),
      colors: col,
      glowColors: glowCol,
      haloIndex: new Uint32Array(halo),
      standouts: standoutFlags,
      lineCrests: new Float32Array(gridX * crests.length * CREST_STRIDE),
      lineTerrain: new Float32Array(gridX * TERRAIN_STRIDE),
      zTerrainDynamic: new Float32Array(gridZ * 2),
      zStatic: zStaticValues,
      edgeX: edgeXValues,
      edgeZ: edgeZValues,
    };
  }, []);

  useEffect(() => {
    const updateScrollProgress = () => {
      scrollProgress.current = THREE.MathUtils.clamp(
        window.scrollY / window.innerHeight,
        0,
        1,
      );
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const points = pointsRef.current;
    const glowPoints = glowRef.current;
    if (!points || !glowPoints) return;

    // Tell the splash screen once the first frames (shader compiles, post-
    // processing warm-up) are behind us and the animation is running smoothly
    framesRendered.current++;
    if (
      !announcedReady.current &&
      framesRendered.current >= 12 &&
      delta < 0.04
    ) {
      announcedReady.current = true;
      markWaveReady();
    }

    animatedProgress.current = THREE.MathUtils.damp(
      animatedProgress.current,
      scrollProgress.current,
      4,
      delta,
    );
    const dispersion = animatedProgress.current;
    const gone = dispersion >= 0.99;
    const opacity = gone ? 0 : 1 - dispersion;
    if (materialRef.current) materialRef.current.opacity = opacity;
    if (glowMaterialRef.current) glowMaterialRef.current.opacity = opacity;
    points.visible = !gone;
    glowPoints.visible = !gone;
    if (gone) return;

    // The wave moves slowly, so updating every other frame is not noticeable
    frameTick.current++;
    if (frameTick.current % 2 === 1 && dispersion < 0.002) return;

    camera.getWorldDirection(cameraForward);
    const time = clock.getElapsedTime() * 0.3;
    const posArray = points.geometry.attributes.position.array;
    const colArray = points.geometry.attributes.color.array;
    const glowArray = glowPoints.geometry.attributes.color.array;

    // Everything that depends only on a line's x position, once per line
    for (let ix = 0; ix < gridX; ix++) {
      const x = basePositions[ix * gridZ * 3];
      for (let k = 0; k < crests.length; k++) {
        const c = crests[k];
        const o = (ix * crests.length + k) * CREST_STRIDE;
        const width =
          c.width * (0.75 + 0.55 * (0.5 + 0.5 * Math.sin(x * 0.21 + c.phase * 2 + time * 0.3)));
        const heightVar = Math.max(
          0.15,
          0.6 +
            0.45 * Math.sin(x * 0.17 + c.phase + time * 0.4) +
            0.35 * Math.sin(x * 0.43 - c.phase * 1.7 + time * 0.25),
        );
        const envelope =
          (0.5 + 0.5 * Math.sin(x * 0.14 + time * 0.45 + c.phase)) *
          (0.5 + 0.5 * Math.sin(x * 0.31 - time * 0.3 + c.phase * 2));
        // Frequencies are deliberately unrelated so nothing lines up or repeats
        lineCrests[o] =
          c.z +
          2.0 * Math.sin(x * (0.18 - k * 0.02) + time * (0.7 - k * 0.1) + c.phase) +
          0.9 * Math.sin(x * 0.45 - time * 1.1 + c.phase * 1.3) +
          0.5 * Math.sin(x * 0.97 + time * 0.8 - c.phase * 2.1);
        lineCrests[o + 1] = 1 / (2 * width * width);
        lineCrests[o + 2] = c.height * heightVar;
        lineCrests[o + 3] = 0.05 + 0.4 * envelope;
        lineCrests[o + 4] =
          2.2 + 1.6 * (0.5 + 0.5 * Math.sin(x * 0.09 + c.phase * 3 - time * 0.2));
        lineCrests[o + 5] =
          -time * 5 * (k % 2 ? -1 : 1) +
          x * 0.35 +
          1.5 * Math.sin(x * 0.5 + c.phase);
        lineCrests[o + 6] = c.glow * (0.55 + 0.6 * heightVar);
      }
      const t = ix * TERRAIN_STRIDE;
      const angleA = x * 0.1 + time * 0.4;
      const angleC = x * 0.53 + time * 0.7;
      lineTerrain[t] = 0.55 * Math.sin(x * 0.22 + time * 0.6);
      lineTerrain[t + 1] = Math.sin(angleA);
      lineTerrain[t + 2] = Math.cos(angleA);
      lineTerrain[t + 3] = Math.sin(angleC);
      lineTerrain[t + 4] = Math.cos(angleC);
    }
    // ...and what depends only on depth, once per row
    for (let iz = 0; iz < gridZ; iz++) {
      const z = (iz - gridZ / 2) * sepZ;
      zTerrainDynamic[iz * 2] = Math.cos(z * 0.35 - time * 0.5);
      zTerrainDynamic[iz * 2 + 1] = Math.sin(z * 0.23 - time * 0.3);
    }

    let i = 0;
    for (let ix = 0; ix < gridX; ix++) {
      const x = basePositions[i * 3];
      const t = ix * TERRAIN_STRIDE;
      const terrainA = lineTerrain[t];
      const sinA = lineTerrain[t + 1];
      const cosA = lineTerrain[t + 2];
      const sinC = lineTerrain[t + 3];
      const cosC = lineTerrain[t + 4];
      const edgeLine = edgeX[ix];

      for (let iz = 0; iz < gridZ; iz++) {
        const z = basePositions[i * 3 + 2];

        let height = 0;
        let ripples = 0;
        let glow = 0;
        for (let k = 0; k < crests.length; k++) {
          const o = (ix * crests.length + k) * CREST_STRIDE;
          const d = z - lineCrests[o];
          const falloff = d * d * lineCrests[o + 1];
          // Beyond ~4 widths a crest contributes nothing, skip its math
          if (falloff > 8) continue;
          const r = Math.exp(-falloff);
          height += lineCrests[o + 2] * r;
          ripples +=
            Math.sin(z * lineCrests[o + 4] + lineCrests[o + 5]) * r * lineCrests[o + 3];
          glow += lineCrests[o + 6] * r;
        }

        // Large rolling terrain under all the crests
        const terrain =
          terrainA * zTerrainDynamic[iz * 2] +
          0.3 * (sinA * zStatic[iz * 4 + 1] - cosA * zStatic[iz * 4]) +
          0.25 *
            (sinC * zStatic[iz * 4 + 3] + cosC * zStatic[iz * 4 + 2]) *
            zTerrainDynamic[iz * 2 + 1];

        const y = height * 1.4 + ripples + terrain * 0.4 - 0.3;

        // The field visibly ends: dots dissolve toward its sides and near edge
        const edgeFade = edgeLine * edgeZ[iz];

        if (dispersion > 0.002) {
          const distanceFromCenter = Math.hypot(x, y + 1, z) || 1;
          const flightDistance = dispersion * (18 + ((i * 37) % 13));
          flightDirection.set(
            x / distanceFromCenter,
            (y + 1) / distanceFromCenter,
            z / distanceFromCenter,
          );
          const towardScene = flightDirection.dot(cameraForward);
          if (towardScene < 0.25) {
            flightDirection.addScaledVector(cameraForward, 0.25 - towardScene);
          }
          posArray[i * 3] = x + flightDirection.x * flightDistance;
          posArray[i * 3 + 1] = y + flightDirection.y * flightDistance;
          posArray[i * 3 + 2] = z + flightDirection.z * flightDistance;
        } else {
          posArray[i * 3] = x;
          posArray[i * 3 + 1] = y;
          posArray[i * 3 + 2] = z;
        }

        const isHaloDot = (ix & 1) === 0 && iz % 3 === 0;

        if (standouts[i] !== -1) {
          // Bluish-purple glowing squares
          const twinkle = (Math.sin(time * 5 + standouts[i]) + 1) / 2;
          colArray[i * 3] = (0.7 + twinkle * 2.0) * edgeFade; // R
          colArray[i * 3 + 1] = (0.5 + twinkle * 1.5) * edgeFade; // G
          colArray[i * 3 + 2] = (2.5 + twinkle * 5.0) * edgeFade; // B
          if (isHaloDot) {
            const flare = (0.25 + twinkle * 0.6) * edgeFade;
            glowArray[i * 3] = 0.55 * flare;
            glowArray[i * 3 + 1] = 0.6 * flare;
            glowArray[i * 3 + 2] = 1.0 * flare;
          }
        } else {
          // Brightness follows distance from the crest, not raw height
          const intensity = Math.min(1, glow);

          // Tight curve for the white-hot crest, wide one for the violet aura
          const sharpGlow = intensity * intensity * intensity;
          const wideAura = intensity * Math.sqrt(intensity);

          colorHelper.setRGB(
            0.12 + sharpGlow * 2.2 + wideAura * 0.8,
            0.08 + sharpGlow * 2.2 + wideAura * 0.15,
            0.22 + sharpGlow * 2.4 + wideAura * 1.5,
          );

          colArray[i * 3] = colorHelper.r * edgeFade;
          colArray[i * 3 + 1] = colorHelper.g * edgeFade;
          colArray[i * 3 + 2] = colorHelper.b * edgeFade;

          // Only the brightest dots get a halo, so the crest peaks really shine
          if (isHaloDot) {
            const over = Math.max(0, intensity - 0.45) / 0.55;
            const flare = over * over * 1.5 * edgeFade;
            glowArray[i * 3] = 0.8 * flare;
            glowArray[i * 3 + 1] = 0.82 * flare;
            glowArray[i * 3 + 2] = 1.0 * flare;
          }
        }

        i++;
      }
    }

    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
    glowPoints.geometry.attributes.position.needsUpdate = true;
    glowPoints.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={materialRef}
          size={0.045}
          vertexColors={true}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>
      <points ref={glowRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[glowColors, 3]} />
          <bufferAttribute attach="index" args={[haloIndex, 1]} />
        </bufferGeometry>
        <pointsMaterial
          ref={glowMaterialRef}
          map={glowTexture}
          size={0.7}
          vertexColors={true}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation={true}
        />
      </points>
    </>
  );
};

type DustProps = {
  count: number;
  size: number;
  brightness: number;
  opacity: number;
};

const DustParticles = ({ count, size, brightness, opacity }: DustProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const initialized = useRef(false);
  const dotTexture = useMemo(() => createDotTexture(), []);
  const spawnPoint = useMemo(() => new THREE.Vector3(), []);
  const spawnDirection = useMemo(() => new THREE.Vector3(), []);
  const flightDirection = useMemo(() => new THREE.Vector3(), []);
  const cameraForward = useMemo(() => new THREE.Vector3(), []);
  const scrollProgress = useRef(0);
  const animatedProgress = useRef(0);

  // Each speck gets its own slow drift and twinkle, so nothing moves in unison
  const { positions, home, colors, drift } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const homePos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    // per particle: amplitude, speed, phase, twinkle speed, tint
    const motion = new Float32Array(count * 5);
    for (let i = 0; i < count; i++) {
      motion[i * 5] = 0.15 + Math.random() * 0.5;
      motion[i * 5 + 1] = 0.05 + Math.random() * 0.12;
      motion[i * 5 + 2] = Math.random() * Math.PI * 2;
      motion[i * 5 + 3] = 0.2 + Math.random() * 0.5;
      motion[i * 5 + 4] = Math.random();
    }
    return { positions: pos, home: homePos, colors: col, drift: motion };
  }, [count]);

  useEffect(() => {
    const update = () => {
      scrollProgress.current = THREE.MathUtils.clamp(
        window.scrollY / window.innerHeight,
        0,
        1,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useFrame(({ clock, camera }, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    if (!initialized.current) {
      camera.updateMatrixWorld();
      for (let i = 0; i < count; i++) {
        spawnPoint
          .set(Math.random() * 1.8 - 0.9, Math.random() * 1.8 - 0.9, 0.5)
          .unproject(camera);
        spawnDirection.copy(spawnPoint).sub(camera.position).normalize();
        const distance = 6 + Math.random() * 20;
        home[i * 3] = camera.position.x + spawnDirection.x * distance;
        home[i * 3 + 1] = camera.position.y + spawnDirection.y * distance;
        home[i * 3 + 2] = camera.position.z + spawnDirection.z * distance;
      }
      initialized.current = true;
    }

    camera.getWorldDirection(cameraForward);
    animatedProgress.current = THREE.MathUtils.damp(
      animatedProgress.current,
      scrollProgress.current,
      4,
      delta,
    );
    const dispersion = animatedProgress.current;
    if (materialRef.current) {
      materialRef.current.opacity =
        dispersion >= 0.99 ? 0 : opacity * (1 - dispersion);
    }

    const t = clock.getElapsedTime();
    const posArray = points.geometry.attributes.position.array;
    const colArray = points.geometry.attributes.color.array;

    for (let i = 0; i < count; i++) {
      const amp = drift[i * 5];
      const speed = drift[i * 5 + 1];
      const phase = drift[i * 5 + 2];
      const twinkleSpeed = drift[i * 5 + 3];
      const tint = drift[i * 5 + 4];

      const hx = home[i * 3];
      const hy = home[i * 3 + 1];
      const hz = home[i * 3 + 2];

      // Fly outward on scroll, the same way the wave dots do
      const len = Math.hypot(hx, hy + 1, hz) || 1;
      flightDirection.set(hx / len, (hy + 1) / len, hz / len);
      const toward = flightDirection.dot(cameraForward);
      if (toward < 0.25) {
        flightDirection.addScaledVector(cameraForward, 0.25 - toward);
      }
      const fly = dispersion * (14 + ((i * 7) % 9));

      posArray[i * 3] =
        hx + Math.sin(t * speed + phase) * amp + flightDirection.x * fly;
      posArray[i * 3 + 1] =
        hy + Math.sin(t * speed * 0.8 + phase * 1.7) * amp * 0.7 + flightDirection.y * fly;
      posArray[i * 3 + 2] =
        hz + Math.cos(t * speed * 0.6 + phase * 0.5) * amp + flightDirection.z * fly;

      // Slow, partial twinkle with a faint cool or warm tint
      const twinkle = 0.55 + 0.45 * Math.sin(t * twinkleSpeed + phase * 3);
      const level = brightness * twinkle;
      colArray[i * 3] = level * (0.9 + tint * 0.15);
      colArray[i * 3 + 1] = level * 0.95;
      colArray[i * 3 + 2] = level * (1.1 - tint * 0.15);
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        map={dotTexture}
        size={size}
        vertexColors={true}
        transparent={true}
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        fog={false}
      />
    </points>
  );
};

export default function AnimatedWaveBackground() {
  // Once the hero has scrolled away the wave is invisible, so stop rendering it
  const [active, setActive] = useState(true);
  const webgl = hasWebGL();

  useEffect(() => {
    const check = () => setActive(window.scrollY < window.innerHeight * 1.15);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#020205",
        zIndex: -1,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 85% 70% at 50% 62%, transparent 45%, rgba(2,2,5,0.9) 100%), linear-gradient(to bottom, #020205 0%, rgba(2,2,5,0) 28%)",
        }}
      />
      <WebGLBoundary fallback={<StaticWave />} onFallback={markWaveReady}>
      {webgl ? (
      <Canvas
        camera={{ position: [0, 2.5, 30], fov: 55 }}
        dpr={[1, 1.5]}
        style={{ visibility: active ? "visible" : "hidden" }}
        frameloop={active ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#020205", 5, 35]} />
        <WaveCamera />
        <DottedWave />
        {/* Fine specks plus a few larger soft bokeh dots, sparse, so the sky stays mostly dark */}
        <DustParticles count={34} size={0.16} brightness={0.5} opacity={0.6} />
        <DustParticles count={7} size={0.6} brightness={0.3} opacity={0.3} />
        <EffectComposer multisampling={0}>
          <DepthOfField
            focusDistance={0.08}
            focalLength={0.1}
            bokehScale={2}
            height={480}
          />
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.3}
            intensity={8.0}
          />
        </EffectComposer>
      </Canvas>
      ) : (
        <StaticWave />
      )}
      </WebGLBoundary>
    </div>
  );
}

/** Still, dotted stand-in for the wave when WebGL is unavailable */
function StaticWave() {
  useEffect(() => markWaveReady(), []);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "radial-gradient(circle, rgba(169,155,255,0.55) 1px, transparent 1.6px), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(139,124,255,0.22), transparent 70%)",
        backgroundSize: "18px 14px, 100% 100%",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 30%, #000 85%), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
        maskImage:
          "linear-gradient(to bottom, transparent 30%, #000 85%), linear-gradient(to right, transparent, #000 15%, #000 85%, transparent)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    />
  );
}
