import { useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

const NODES = {
  py: { title: "Python", items: ["pydeepity", "SimplePCN", "Linear, Sigmoid"] },
  bind: { title: "nanobind", items: ["Python bindings"] },
  core: { title: "C++ core", items: ["Predictive coding networks", "Direct Kolen-Pollack"] },
  cpu: { title: "CPU", items: ["OpenMP", "Google Highway", "SLEEF", "OpenBLAS or Intel MKL"] },
  gpu: { title: "GPU", items: ["CUDA", "cuBLAS", "CUTLASS (optional)"] },
};

const CHIPS = [
  ["pydeepity", "py"],
  ["nanobind", "bind"],
  ["OpenMP", "cpu"],
  ["Highway", "cpu"],
  ["SLEEF", "cpu"],
  ["MKL / OpenBLAS", "cpu"],
  ["CUDA", "gpu"],
  ["cuBLAS", "gpu"],
  ["CUTLASS", "gpu"],
];

function Wire({ delay = 0 }) {
  return (
    <div className="relative mx-auto h-10 w-px overflow-hidden bg-[color:var(--line-strong)]" aria-hidden="true">
      <span className="wire-light absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-accent" style={{ animationDelay: `${delay}s` }} />
    </div>
  );
}

export default function ArchDiagram() {
  const [sel, setSel] = useState(null);

  const Node = ({ id, className = "" }) => {
    const n = NODES[id];
    const on = sel === id;
    return (
      <div
        className={`card-dark p-5 transition-colors duration-300 ${on ? "!border-[color:var(--accent)] bg-white/[0.05]" : ""} ${className}`}
      >
        <div className={`font-[family-name:var(--font-display)] text-xl tracking-[-0.01em] ${on || id === "core" ? "text-accent-text" : ""}`}>
          {n.title}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-dim">
          {n.items.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Reveal className="panel-flat mt-4 rounded-2xl border border-line px-4 py-10 md:px-10 md:py-14">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-5xl">
          How it fits together
        </h2>
        <p className="mb-0 mt-4 text-dim">From the Python you write down to the hardware it runs on.</p>
        <Link to="/theory" className="btn mt-6">The theory behind it</Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <Node id="py" />
        <Wire />
        <Node id="bind" />
        <Wire delay={0.6} />
        <Node id="core" />
        <div className="relative mx-auto h-10 w-2/3" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-5 w-px bg-[color:var(--line-strong)]" />
          <div className="absolute left-0 right-0 top-5 h-px bg-[color:var(--line-strong)]" />
          <div className="absolute left-0 top-5 h-5 w-px bg-[color:var(--line-strong)]" />
          <div className="absolute right-0 top-5 h-5 w-px bg-[color:var(--line-strong)]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Node id="cpu" />
          <Node id="gpu" />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CHIPS.map(([label, id]) => (
            <button
              key={label}
              type="button"
              aria-pressed={sel === id}
              onClick={() => setSel(sel === id ? null : id)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors ${
                sel === id ? "border-transparent bg-white text-black" : "border-line bg-white/[0.04] text-dim hover:text-fg"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
