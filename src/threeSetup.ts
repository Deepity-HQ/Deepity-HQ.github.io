import type { WebGLRenderer } from "three";

// @react-three/fiber still creates a THREE.Clock internally, which newer three
// versions warn about on every canvas. Drop only that message until fiber moves
// to THREE.Timer.
const warn = console.warn;
console.warn = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
  warn.apply(console, args);
};

// Lets the browser hand the GPU context back after it drops one (tab switch,
// memory pressure) instead of leaving the canvas dead.
export function protectContext(gl: WebGLRenderer, redraw: () => void) {
  const canvas = gl.domElement;
  canvas.addEventListener("webglcontextlost", (e) => e.preventDefault());
  canvas.addEventListener("webglcontextrestored", redraw);
}
