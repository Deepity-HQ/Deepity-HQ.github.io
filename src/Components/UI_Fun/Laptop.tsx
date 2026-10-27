import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { laptopSections, openSourceText } from "../../laptopSections.ts";

type LaptopProps = {
  scrollProgress: number;
};

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

const UI_FONT =
  '-apple-system, "SF Pro Text", "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, sans-serif';

function fillRound(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: string | CanvasGradient,
) {
  drawRoundRect(ctx, x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

// Near-black desktop with a faint violet glow rising from the bottom edge
function drawWallpaper(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "#020205";
  ctx.fillRect(0, 0, W, H);

  const haze = ctx.createRadialGradient(W * 0.5, H * 1.0, 0, W * 0.5, H * 1.0, W * 0.65);
  haze.addColorStop(0, "rgba(120, 100, 255, 0.28)");
  haze.addColorStop(0.5, "rgba(70, 50, 160, 0.1)");
  haze.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, W, H);
}

function renderLearnLeanerScreen(canvas: HTMLCanvasElement) {
  const W = 1536;
  const H = 1024;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);
  drawRoundRect(ctx, 0, 0, W, H, 54);
  ctx.clip();

  drawWallpaper(ctx, W, H);

  // Browser window
  const wx = 64;
  const wy = 48;
  const ww = W - 128;
  const wh = 928;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.55)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 18;
  fillRound(ctx, wx, wy, ww, wh, 22, "#07070e");
  ctx.restore();

  ctx.save();
  drawRoundRect(ctx, wx, wy, ww, wh, 22);
  ctx.clip();

  // Window chrome: one quiet bar with muted controls and a centered address pill
  ctx.fillStyle = "rgba(14, 14, 24, 0.96)";
  ctx.fillRect(wx, wy, ww, 126);
  [0, 1, 2].forEach((i) => {
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.arc(wx + 38 + i * 30, wy + 41, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  const pillW = 620;
  const pillX = wx + (ww - pillW) / 2;
  fillRound(ctx, pillX, wy + 20, pillW, 44, 22, "rgba(255,255,255,0.06)");
  drawRoundRect(ctx, pillX, wy + 20, pillW, 44, 22);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `400 22px ${UI_FONT}`;
  ctx.fillText("learnleaner.dev", pillX + pillW / 2, wy + 43);
  ctx.textAlign = "left";

  // Tab row: a single active tab with a violet underline
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = `500 21px ${UI_FONT}`;
  ctx.fillText("Learn Leaner", wx + 40, wy + 97);
  fillRound(ctx, wx + 40, wy + 117, 150, 3, 1.5, "#8b7cff");
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(wx, wy + 125, ww, 1);

  // Page background
  const py = wy + 127;
  const pageGlow = ctx.createRadialGradient(W / 2, py, 0, W / 2, py, 700);
  pageGlow.addColorStop(0, "#14102e");
  pageGlow.addColorStop(1, "#07070e");
  ctx.fillStyle = pageGlow;
  ctx.fillRect(wx, py, ww, wh);

  const px = wx + 64;
  const pw = ww - 128;
  ctx.textBaseline = "alphabetic";

  // Eyebrow + heading
  ctx.fillStyle = "#a99bff";
  ctx.font = `600 20px ${UI_FONT}`;
  ctx.fillText("UNDER THE HOOD", px, py + 62);
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 60px ${UI_FONT}`;
  ctx.fillText("Learn Leaner", px, py + 130);


  const gap = 24;
  const cw = (pw - gap) / 2;
  const ch = 284;
  const top = py + 176;

  laptopSections.forEach((sec, i) => {
    const cx = px + (i % 2) * (cw + gap);
    const cy = top + Math.floor(i / 2) * (ch + gap);
    fillRound(ctx, cx, cy, cw, ch, 20, "rgba(255,255,255,0.035)");
    drawRoundRect(ctx, cx, cy, cw, ch, 20);
    const border = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
    border.addColorStop(0, "rgba(160, 145, 255, 0.35)");
    border.addColorStop(0.5, "rgba(255,255,255,0.08)");
    border.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // accent marker
    const accent = ctx.createLinearGradient(0, cy + 36, 0, cy + 74);
    accent.addColorStop(0, "#b9aeff");
    accent.addColorStop(1, "#6d5cff");
    fillRound(ctx, cx + 32, cy + 36, 6, 38, 3, accent);

    ctx.fillStyle = "#ffffff";
    ctx.font = `650 36px ${UI_FONT}`;
    ctx.fillText(sec.title, cx + 56, cy + 68);

    ctx.fillStyle = "rgba(255,255,255,0.64)";
    ctx.font = `400 28px ${UI_FONT}`;
    if (sec.body) {
      wrapText(ctx, sec.body, cx + 32, cy + 134, cw - 104, 41);
    } else {
      // Word-wrap mixed plain/link text so the link never runs past the card
      const words: { text: string; link: boolean }[] = [];
      openSourceText.before.split(" ").forEach((w) => {
        if (w) words.push({ text: w, link: false });
      });
      openSourceText.link.split(" ").forEach((w) => {
        words.push({ text: w, link: true });
      });
      words.push({ text: openSourceText.after, link: false });

      const maxW = cw - 104;
      const spaceW = ctx.measureText(" ").width;
      let x = cx + 32;
      let y = cy + 134;
      words.forEach((word, wi) => {
        const w = ctx.measureText(word.text).width;
        const attach = word.text === openSourceText.after;
        const lead = attach || x === cx + 32 ? 0 : spaceW;
        if (!attach && x + lead + w > cx + 32 + maxW) {
          x = cx + 32;
          y += 41;
        } else {
          x += lead;
        }
        ctx.fillStyle = word.link ? "#b9aeff" : "rgba(255,255,255,0.64)";
        ctx.fillText(word.text, x, y);
        if (word.link) {
          // underline spans the gap to the next word when it is also a link
          const next = words[wi + 1];
          const extend = next?.link && x + w + spaceW + ctx.measureText(next.text).width <= cx + 32 + maxW ? spaceW : 0;
          ctx.fillRect(x, y + 5, w + extend, 2);
        }
        x += w;
      });
    }
  });

  ctx.restore();

  // Window hairline border
  drawRoundRect(ctx, wx, wy, ww, wh, 22);
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Soft glass reflection across the display
  const glare = ctx.createLinearGradient(0, 0, W, H);
  glare.addColorStop(0, "rgba(255,255,255,0.07)");
  glare.addColorStop(0.35, "rgba(255,255,255,0)");
  ctx.fillStyle = glare;
  ctx.fillRect(0, 0, W, H);
}

// A dark studio with a few bright panels. The panels are what the aluminum
// reflects, so they create the soft gradients and crisp highlight streaks
// that make metal look like metal.
function createStudioEnvironment(gl: THREE.WebGLRenderer): THREE.Texture {
  const room = new THREE.Scene();

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(32, 18, 32),
    new THREE.MeshBasicMaterial({ color: "#040408", side: THREE.BackSide }),
  );
  shell.position.y = 6;
  room.add(shell);

  const panel = (
    w: number,
    h: number,
    position: [number, number, number],
    intensity: number,
    color: string,
  ) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color).multiplyScalar(intensity),
        side: THREE.DoubleSide,
      }),
    );
    mesh.position.set(...position);
    mesh.lookAt(0, 1, 0);
    room.add(mesh);
  };

  panel(9, 6, [-5, 9, 5], 5, "#ffffff"); // big softbox, upper front left
  panel(14, 1.4, [0, 10.5, -3], 4, "#ffffff"); // long overhead strip
  panel(2, 9, [9, 4, -6], 7, "#b9aeff"); // violet strip, back right
  panel(2, 9, [-9, 4, -6], 4, "#dbe6ff"); // cool strip, back left
  panel(12, 3, [0, 2, 10], 0.7, "#ffffff"); // dim front fill

  const pmrem = new THREE.PMREMGenerator(gl);
  const texture = pmrem.fromScene(room, 0.02).texture;
  pmrem.dispose();
  return texture;
}

// The page's camera uses a 30deg lens (a product-shot telephoto) instead of 45deg,
// so the camera sits further back to keep the same framing with less distortion.
const LENS_DISTANCE = 1.55;

// On narrow (phone) screens the camera sits back far enough that the whole
// laptop fits across the width (about 1 fits it, a little under crops the sides slightly; lower = closer and crops the
// sides).
const NARROW_SCREEN_ZOOM = 0.95;

// World units the camera aims above the laptop on desktop, which lowers it on screen
const DESKTOP_DROP = 0.15;

// Anisotropic filtering keeps the keyboard and lid detail crisp at grazing angles
function sharpenTextures(material: THREE.Material, anisotropy: number) {
  const mat = material as THREE.MeshStandardMaterial;
  [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap].forEach((t) => {
    if (t) {
      t.anisotropy = anisotropy;
      t.needsUpdate = true;
    }
  });
}

export default function Laptop({ scrollProgress }: LaptopProps) {
  const { scene: loadedScene } = useLoader(GLTFLoader, "/props/laptop.glb");
  const { size, gl } = useThree();

  const maxAniso = gl.capabilities.getMaxAnisotropy();
  const logoSource = useLoader(THREE.TextureLoader, "/Branding/Deepity-08.png");

  const envTexture = useMemo(() => createStudioEnvironment(gl), [gl]);

  // Screen canvas texture displaying "Learn Leaner"
  const screenCanvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    renderLearnLeanerScreen(canvas);
    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAniso;
    texture.needsUpdate = true;

    if (document.fonts) {
      document.fonts.ready.then(() => {
        renderLearnLeanerScreen(canvas);
        texture.needsUpdate = true;
      });
    }

    return texture;
  }, [maxAniso]);

  useEffect(() => {
    return () => {
      envTexture.dispose();
      screenCanvasTexture.dispose();
    };
  }, [envTexture, screenCanvasTexture]);

  // The logo PNG is black on transparent; keep only its shape (white + alpha) so
  // the chrome material below decides how it looks
  const logoTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(logoSource.image as CanvasImageSource, 0, 0, 1024, 1024);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 1024);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAniso;
    return texture;
  }, [logoSource, maxAniso]);

  const model = useMemo(() => {
    const cloned = loadedScene.clone(true);
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          child.material = child.material.clone();

          if (child.name.includes("Frame")) {
            child.material = child.material.clone();
            child.material.metalness = 0.7;
            child.material.roughness = 0.42;
            child.material.envMap = envTexture;
            child.material.envMapIntensity = 0.8;
            sharpenTextures(child.material, maxAniso);
          } else if (child.name.includes("Screen")) {
            const geom = child.geometry.clone();
            const indexAttr = geom.getIndex();

            if (indexAttr) {
              const indices = indexAttr.array;
              const normalAttr = geom.getAttribute("normal");
              const normals = normalAttr.array;

              const backIndices: number[] = [];
              const frontIndices: number[] = [];

              for (let i = 0; i < indices.length; i += 3) {
                const i0 = indices[i];
                const i1 = indices[i + 1];
                const i2 = indices[i + 2];
                const nz0 = normals[i0 * 3 + 2];
                const nz1 = normals[i1 * 3 + 2];
                const nz2 = normals[i2 * 3 + 2];
                const avgNz = (nz0 + nz1 + nz2) / 3;

                if (avgNz < -0.3) {
                  frontIndices.push(i0, i1, i2);
                } else {
                  backIndices.push(i0, i1, i2);
                }
              }

              const newIndices = new Uint32Array([
                ...backIndices,
                ...frontIndices,
              ]);
              geom.setIndex(new THREE.BufferAttribute(newIndices, 1));
              geom.clearGroups();
              geom.addGroup(0, backIndices.length, 0); // Material 0: Lid back (aluminum)
              geom.addGroup(backIndices.length, frontIndices.length, 1); // Material 1: Screen front (midnight blue)
              child.geometry = geom;
            }

            // Material 0: Back of lid & bezel - matching anodized aluminum body
            const lidBackMat = child.material.clone();
            lidBackMat.metalness = 0.7;
            lidBackMat.roughness = 0.42;
            lidBackMat.envMap = envTexture;
            lidBackMat.envMapIntensity = 0.8;
            sharpenTextures(lidBackMat, maxAniso);

            // Material 1: Front screen display - deep dark midnight blue base
            const screenFrontMat = child.material.clone();
            screenFrontMat.metalness = 0.12;
            screenFrontMat.roughness = 0.2;
            screenFrontMat.envMap = null;
            screenFrontMat.envMapIntensity = 0.0;
            screenFrontMat.color = new THREE.Color("#04081c");
            screenFrontMat.emissive = new THREE.Color("#060e2e");
            screenFrontMat.emissiveIntensity = 0.12;

            child.material = [lidBackMat, screenFrontMat];
          }
        }
      }
    });

    // Attach high-res display plane to Screen node
    const screenNode = cloned.getObjectByName("Screen");
    if (screenNode) {
      const displayPlaneGeo = new THREE.PlaneGeometry(0.302, 0.200);
      const displayPlaneMat = new THREE.MeshBasicMaterial({
        map: screenCanvasTexture,
        toneMapped: false,
        transparent: true,
      });
      const displayMesh = new THREE.Mesh(displayPlaneGeo, displayPlaneMat);
      displayMesh.name = "ScreenDisplayContent";
      displayMesh.position.set(0, 0.0986, 0.0035);
      displayMesh.rotation.set(0, Math.PI, 0);

      screenNode.add(displayMesh);

      // Polished chrome emblem on the outside of the lid. The lid's back face
      // sits at the +z end of the screen mesh (the glass faces -z).
      const logoMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(0.14, 0.14),
        new THREE.MeshStandardMaterial({
          map: logoTexture,
          color: "#e4e6ee",
          metalness: 1,
          roughness: 0.14,
          envMap: envTexture,
          envMapIntensity: 1.4,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -2,
          polygonOffsetUnits: -2,
        }),
      );
      logoMesh.name = "LidLogo";
      logoMesh.position.set(0, 0.0986, 0.0072);
      screenNode.add(logoMesh);
    }

    return cloned;
  }, [loadedScene, envTexture, screenCanvasTexture, logoTexture, maxAniso]);

  // Mirrored, unlit copy of the laptop that shows through the glossy floor
  const reflection = useMemo(() => {
    const mirrored = model.clone(true);
    mirrored.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = false;
      child.receiveShadow = false;
      if (child.name === "ScreenDisplayContent") return;
      if (child.name.includes("Frame")) {
        const original = child.material as THREE.MeshStandardMaterial;
        child.material = new THREE.MeshBasicMaterial({
          map: original.map,
          color: "#8d8d98",
        });
      } else if (child.name.includes("Screen")) {
        child.material = [
          new THREE.MeshBasicMaterial({ color: "#7d7d88" }),
          new THREE.MeshBasicMaterial({ color: "#0a0a14" }),
        ];
      }
    });
    return mirrored;
  }, [model]);
  const reflectionLid = useMemo(
    () => reflection.getObjectByName("Screen") ?? null,
    [reflection],
  );

  // Floor fades to nothing at its edges so it never shows as a visible slab
  const floorAlpha = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0, "rgb(215,215,215)");
      g.addColorStop(0.5, "rgb(190,190,190)");
      g.addColorStop(1, "rgb(0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 256, 256);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const lid = useMemo(() => model.getObjectByName("Screen") ?? null, [model]);
  const lidBaseRotation = useMemo(
    () => lid?.quaternion.clone() ?? new THREE.Quaternion(),
    [lid],
  );
  const hingeAxis = useMemo(() => new THREE.Vector3(1, 0, 0), []);
  const hingeRotation = useMemo(() => new THREE.Quaternion(), []);
  const target = useMemo(() => new THREE.Vector3(0, 0.1, 0), []);
  const screenLightRef = useRef<THREE.SpotLight>(null);
  const screenLightTarget = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.set(0, 0.05, 0.25);
    return t;
  }, []);

  const targetProgress = useRef(scrollProgress);
  const animatedProgress = useRef(0);
  const isFirstRender = useRef(true);

  useEffect(() => {
    targetProgress.current = scrollProgress;
    if (isFirstRender.current) {
      animatedProgress.current = scrollProgress;
      isFirstRender.current = false;
    }
  }, [scrollProgress]);

  useFrame(({ camera }, delta) => {
    animatedProgress.current = THREE.MathUtils.damp(
      animatedProgress.current,
      targetProgress.current,
      6,
      delta,
    );

    const t = animatedProgress.current;

    const aspect = size.width / Math.max(size.height, 1);
    const responsiveFactor =
      aspect < 1.1 ? (1.1 / Math.max(aspect, 0.45)) * NARROW_SCREEN_ZOOM : 1.0;

    // Camera arc: brief ease at the start so the closed laptop is clearly seen, then orbits to front
    const camT = THREE.MathUtils.smoothstep(t, 0.05, 1);
    const angle = THREE.MathUtils.lerp(Math.PI * 0.94, 0, camT);
    const baseRadius = THREE.MathUtils.lerp(4.8, 3.65, camT);
    const radius = baseRadius * responsiveFactor * LENS_DISTANCE;

    const camX = Math.sin(angle) * radius;
    const camZ = Math.cos(angle) * radius;
    const camY =
      (THREE.MathUtils.lerp(2.2, 1.40, camT) + Math.sin(Math.PI * camT) * 0.4) *
      responsiveFactor *
      LENS_DISTANCE;

    camera.position.set(camX, camY, camZ);

    // Laptop lid stays completely closed first (t <= 0.28), then opens smoothly
    const openT = THREE.MathUtils.smoothstep(t, 0.28, 0.88);
    const lidAngle = THREE.MathUtils.lerp(
      -Math.PI / 2,
      THREE.MathUtils.degToRad(14),
      openT,
    );

    if (lid) {
      hingeRotation.setFromAxisAngle(hingeAxis, lidAngle);
      lid.quaternion.copy(lidBaseRotation).multiply(hingeRotation);
      reflectionLid?.quaternion.copy(lid.quaternion);
    }

    if (screenLightRef.current) {
      screenLightRef.current.intensity = openT * 3.8;
      screenLightRef.current.position.set(0, 0.35 + openT * 0.85, -0.65);
    }

    const targetY = THREE.MathUtils.lerp(0.1, 0.95, openT);
    const targetZ = THREE.MathUtils.lerp(0, -0.22, openT);
    // Aiming the camera slightly higher moves the laptop down in the frame (desktop only)
    const desktopDrop = aspect >= 1.1 ? DESKTOP_DROP : 0;
    target.set(0, targetY + desktopDrop, targetZ);
    camera.lookAt(target);
  });

  return (
    <>
      <directionalLight
        castShadow
        position={[4, 7, 5]}
        intensity={1.7}
        color="#fff4e8"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-3.5}
        shadow-camera-right={3.5}
        shadow-camera-top={3.5}
        shadow-camera-bottom={-3.5}
        shadow-radius={6}
        shadow-bias={-0.0002}
      />
      <directionalLight
        position={[-5, 4.5, -5]}
        intensity={1.1}
        color="#cfe3ff"
      />
      <directionalLight
        position={[5, 3.5, -4]}
        intensity={1.5}
        color="#a99bff"
      />
      <directionalLight position={[0, 6, 2]} intensity={0.12} color="#f5f9ff" />
      <primitive object={screenLightTarget} />
      <spotLight
        ref={screenLightRef}
        target={screenLightTarget}
        position={[0, 1.2, -0.65]}
        color="#b9aeff"
        angle={Math.PI / 2.8}
        penumbra={0.85}
        distance={4.2}
        intensity={0}
      />

      <primitive object={model} scale={0.12} />

      <group scale={[1, -1, 1]}>
        <primitive object={reflection} scale={0.12} />
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial
          color="#000000"
          alphaMap={floorAlpha}
          transparent
          depthWrite={false}
        />
      </mesh>

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={0.45} />
      </mesh>
    </>
  );
}

useLoader.preload(GLTFLoader, "/props/laptop.glb");
