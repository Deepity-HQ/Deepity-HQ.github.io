import { lazy, Suspense, type ReactNode } from "react";
import { Link } from "react-router";
import PageHeader from "../Components/PageHeader.tsx";
import ColumnBars from "../Components/ColumnBars.tsx";
import CountUp from "../Components/CountUp.tsx";
import {
  bodyClass,
  btnClass,
  btnSolidClass,
  headingClass,
  labelClass,
} from "../Components/ui.ts";
import { ArrowRight } from "../Components/ArrowIcons.tsx";

const BenchmarkChart = lazy(() => import("../Components/BenchmarkChart.tsx"));

const chips = ["784→512→512→10", "20 settling steps", "batch 250", "100 epochs", "seed 7"];

const others = [
  { name: "ngc-learn", acc: "98%", note: "1707.7s, best dev result" },
  { name: "PyTorch backprop", acc: "97.51%", note: "627.8s, MSE loss" },
  { name: "jpc", acc: "97.55%", note: "531.4s, same network" },
  { name: "Deepity DKP", acc: "95.97%", note: "49.6s, different network" },
];

const setup = [
  ["Task", "MNIST, 50,000 training images and 10,000 held-out"],
  ["Hardware", "One laptop CPU (12th Gen Intel Core i7-12700H) for the CPU runs. The GPU runs used a single NVIDIA A100 (40 GB) on the Ohio Supercomputer Center"],
  ["Network", "784→512→512→10 with sigmoid activations"],
  ["Training", "20 settling steps, batch size 250, 100 epochs, seed 7"],
  ["Deepity", "Learning rate 0.00373, decaying by 0.94 each epoch, AdamW optimizer"],
  ["jpc", "The jpc library (JAX), run with the same network, 20 settling steps, batch size, epochs and learning-rate schedule as Deepity. Accuracy is a feedforward readout"],
  ["ngc-learn", "The pc_discrim example from ngc-museum, run unmodified (ngclearn 3.2.3, JAX on CPU)"],
  ["PyTorch", "Standard backpropagation with the same network and schedule. It uses mean squared error against one-hot targets to match the PCN objective"],
  ["Deepity DKP", "A different network and training method (784→512→10, 2 inference steps, batch size 1000, 50 epochs). It reached 95.97% in 49.6s"],
];

const notes = [
  "The Deepity curve is accuracy on a training subset, shown every 10 epochs. The cards show held-out accuracy.",
  "ngc-learn only logs whole-percent accuracy, so its line is stepped and its 98% is a rounded best result.",
];

// Same network and schedule on one laptop CPU and on one A100
const hardware = [
  { name: "Deepity", cpu: "487.5s", gpu: "66.8s", cpuAcc: "98.21%", gpuAcc: "98.08%", speed: "7.3× faster", good: true },
  { name: "PyTorch backprop", cpu: "627.8s", gpu: "61.9s", cpuAcc: "97.51%", gpuAcc: "97.70%", speed: "10.1× faster", good: true },
  { name: "jpc", cpu: "531.4s", gpu: "676.1s", cpuAcc: "97.55%", gpuAcc: "94.76%", speed: "1.3× slower", good: false },
];

const darkCard = "rounded-2xl border border-white/10 bg-[#0e0e0f]";

function Card({
  title,
  text,
  children,
  className = "",
}: {
  title: string;
  text?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${darkCard} flex flex-col p-6 md:p-8 ${className}`}>
      <div className="mb-6">
                <h3 className={`${headingClass} text-lg md:text-xl`}>{title}</h3>
        {text && <p className="Jura mb-0 mt-2 text-sm leading-relaxed text-white/70">{text}</p>}
      </div>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
    </div>
  );
}

export default function Benchmarks() {
  return (
    <div>
      <PageHeader
        title="Deepity vs ngc-learn and PyTorch"
        width={1200}
      >
        On MNIST, Deepity reaches 98.22% accuracy, 3.50× faster than ngc-learn
        with the same network. The comparison ran on one laptop CPU.
      </PageHeader>

      <div className="mx-auto max-w-[1200px] px-3 pb-16 md:px-6">
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0b] p-3 md:p-8">
          <div className="grid gap-3 md:gap-4 lg:grid-cols-5">
            <Card
              className="lg:col-span-3"
              title="Accuracy on MNIST"
              text="Held-out test images. Deepity matches ngc-learn and beats the PyTorch baseline."
            >
              <div className="py-4 text-center">
                <div className="Michroma text-6xl font-light tracking-[-0.04em] text-[#a99bff] drop-shadow-[0_0_24px_rgba(139,124,255,0.3)] md:text-7xl">
                  <CountUp value={98.22} decimals={2} suffix="%" />
                </div>
                <div className={`${labelClass} mt-3 tracking-widest`}>Deepity, held-out</div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="Michroma rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70 transition-colors hover:border-white/25"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Card>

            <Card
              className="lg:col-span-2"
              title="Training time"
              text="100 epochs on the same laptop CPU. Deepity is 3.50× faster than ngc-learn."
            >
              <ColumnBars />
            </Card>
          </div>

          <div className="mt-3 grid gap-3 md:mt-4 md:gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Suspense fallback={<div className={`${darkCard} h-[440px]`} />}>
                <BenchmarkChart />
              </Suspense>
            </div>

            <Card
              className="lg:col-span-2"
              title="The other runs"
              text="Held-out accuracy and total training time."
            >
              <div className="flex flex-col gap-2.5">
                {others.map((o) => (
                  <div
                    key={o.name}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
                  >
                    <div>
                      <div className="Jura text-sm font-medium text-white">{o.name}</div>
                      <div className="Jura text-xs text-white/60">{o.note}</div>
                    </div>
                    <div className="Michroma text-base font-light tabular-nums text-white">
                      {o.acc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10`}>
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>CPU and GPU</h2>
          <p className={`${bodyClass} mb-0 mt-3 max-w-2xl text-base`}>
            The same network and schedule, trained on a laptop CPU and on a single A100. Deepity
            trains 7.3× faster on the GPU in 66.8s, within 0.13 points of its CPU accuracy. It lands
            within 5 seconds of PyTorch backprop on the same card, and jpc gets slower.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {hardware.map((h) => (
              <div key={h.name} className="flex flex-col border-t border-white/15 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="Jura font-medium text-white">{h.name}</div>
                  <span
                    className={`Michroma text-[10px] ${
                      h.good ? "text-[#a99bff]" : "text-white/50"
                    }`}
                  >
                    {h.speed}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["CPU", h.cpu, h.cpuAcc],
                    ["GPU (A100)", h.gpu, h.gpuAcc],
                  ].map(([k, t, a]) => (
                    <div key={k}>
                      <div className="Michroma text-[10px] uppercase text-white/60">{k}</div>
                      <div className="Michroma mt-1 text-xl font-light tabular-nums text-[#a99bff]">{t}</div>
                      <div className="Jura text-xs text-white/60">{a} accuracy</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="Jura mb-0 mt-4 max-w-3xl text-xs leading-relaxed text-white/50">
            jpc spends about 95 seconds of its first epoch compiling kernels for the GPU, and a
            small network at batch size 250 doesn't keep an A100 busy, so launch overhead dominates.
          </p>
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10`}>
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>Setup</h2>
          <dl className="m-0 mt-6 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-[#141415]/40">
            {setup.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 px-5 py-3.5 transition-colors hover:bg-white/[0.02] md:grid-cols-[200px_1fr] md:gap-6"
              >
                <dt className={`${labelClass} self-center`}>{k}</dt>
                <dd className="Jura m-0 text-sm leading-relaxed text-white/70">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10`}>
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>Notes</h2>
          <ul className="Jura mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-white/70">
            {notes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tutorial" className={btnSolidClass}>
              Get started
            </Link>
            <Link to="/theory" className={btnClass}>
              How it works
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
