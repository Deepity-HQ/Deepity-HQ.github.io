import { useState } from "react";
import { Link } from "react-router";
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

function Node({ id, selected }: { id: NodeId; selected: NodeId | null }) {
  const n = NODES[id];
  const on = selected === id;
  return (
    <div
      className={`border-l-2 py-1 pl-4 transition-colors duration-300 ${
        on ? "border-[#8b7cff]" : "border-white/20"
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
    <div className="mt-14 border-t border-white/10 pt-10">
      <div className="mb-10 max-w-xl">
        <h2 className={`${headingClass} text-2xl md:text-4xl`}>How it fits together</h2>
        <p className="Jura mb-0 mt-4 text-white/75">
          From the Python you write down to the hardware it runs on.
        </p>
        <Link to="/theory" className={`${btnClass} mt-6`}>
          The theory behind it
        </Link>
      </div>

      <div className="max-w-3xl space-y-6">
        <Node id="py" selected={sel} />
        <Node id="bind" selected={sel} />
        <Node id="core" selected={sel} />
        <div className="grid gap-6 md:grid-cols-2">
          <Node id="cpu" selected={sel} />
          <Node id="gpu" selected={sel} />
        </div>

        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
          {CHIPS.map(([label, id]) => (
            <button
              key={label}
              type="button"
              aria-pressed={sel === id}
              onClick={() => setSel(sel === id ? null : id)}
              className={`Michroma cursor-pointer border-b bg-transparent px-1 py-1 text-xs transition-colors ${
                sel === id
                  ? "border-white text-white"
                  : "border-transparent text-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
