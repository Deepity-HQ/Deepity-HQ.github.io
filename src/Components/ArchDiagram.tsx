import { useState } from "react";
import { Link } from "react-router";
import Reveal from "./Reveal.tsx";
import { btnClass, headingClass } from "./ui.ts";

type NodeId = "py" | "bind" | "core" | "cpu" | "gpu";

const NODES: Record<NodeId, { title: string; items: string[] }> = {
  py: { title: "Python", items: ["pydeepity", "SimplePCN", "Linear, Sigmoid"] },
  bind: { title: "nanobind", items: ["Python bindings"] },
  core: { title: "C++ core", items: ["Predictive coding networks", "Direct Kolen-Pollack"] },
  cpu: { title: "CPU", items: ["OpenMP", "Google Highway", "SLEEF", "OpenBLAS or Intel MKL"] },
  gpu: { title: "GPU", items: ["CUDA", "cuBLAS", "CUTLASS (optional)"] },
};

const CHIPS: [string, NodeId][] = [
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

function Wire({ delay = 0 }: { delay?: number }) {
  return (
    <div className="relative mx-auto h-10 w-px overflow-hidden bg-white/20" aria-hidden="true">
      <span
        className="wire-light absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-[#a99bff]"
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

function Node({ id, selected }: { id: NodeId; selected: NodeId | null }) {
  const n = NODES[id];
  const on = selected === id;
  return (
    <div
      className={`rounded-2xl border bg-white/[0.04] p-5 transition-colors duration-300 ${
        on ? "border-[#8b7cff] bg-[#8b7cff]/10" : "border-white/10"
      }`}
    >
      <div
        className={`Michroma text-lg tracking-[-0.01em] ${
          on || id === "core" ? "text-[#a99bff]" : "text-white"
        }`}
      >
        {n.title}
      </div>
      <div className="Jura mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/70">
        {n.items.map((i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
}

export default function ArchDiagram() {
  const [sel, setSel] = useState<NodeId | null>(null);

  return (
    <Reveal className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 backdrop-blur-sm md:px-10 md:py-14">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className={`${headingClass} text-2xl md:text-4xl`}>How it fits together</h2>
        <p className="Jura mb-0 mt-4 text-white/75">
          From the Python you write down to the hardware it runs on.
        </p>
        <Link to="/theory" className={`${btnClass} mt-6`}>
          The theory behind it
        </Link>
      </div>

      <div className="mx-auto max-w-3xl">
        <Node id="py" selected={sel} />
        <Wire />
        <Node id="bind" selected={sel} />
        <Wire delay={0.6} />
        <Node id="core" selected={sel} />
        <div className="relative mx-auto h-10 w-2/3" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-5 w-px bg-white/20" />
          <div className="absolute left-0 right-0 top-5 h-px bg-white/20" />
          <div className="absolute left-0 top-5 h-5 w-px bg-white/20" />
          <div className="absolute right-0 top-5 h-5 w-px bg-white/20" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Node id="cpu" selected={sel} />
          <Node id="gpu" selected={sel} />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {CHIPS.map(([label, id]) => (
            <button
              key={label}
              type="button"
              aria-pressed={sel === id}
              onClick={() => setSel(sel === id ? null : id)}
              className={`Michroma cursor-pointer rounded-lg border px-4 py-1.5 text-xs transition-colors ${
                sel === id
                  ? "border-transparent bg-white text-black"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:text-white"
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
