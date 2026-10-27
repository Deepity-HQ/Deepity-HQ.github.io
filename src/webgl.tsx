import { Component, type ReactNode } from "react";

let cached: boolean | null = null;

/** True when the browser can create a WebGL context at all */
export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    // ?nowebgl forces the fallbacks, for testing them
    if (new URLSearchParams(location.search).has("nowebgl")) return (cached = false);
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

type BoundaryProps = { fallback: ReactNode; onFallback?: () => void; children: ReactNode };

/** Shows `fallback` if a 3D scene throws while starting (e.g. context creation fails) */
export class WebGLBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFallback?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
