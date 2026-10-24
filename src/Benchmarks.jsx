import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import Reveal from "./components/Reveal";
import ColumnBars from "./components/ColumnBars";
import CountUp from "./components/CountUp";

const BenchmarkChart = lazy(() => import("./components/BenchmarkChart"));

const chips = ["784→512→512→10", "20 settling steps", "batch 250", "100 epochs", "seed 7"];

const others = [
  { name: "ngc-learn", acc: "98%", note: "1707.7s, best dev result" },
  { name: "PyTorch backprop", acc: "97.51%", note: "627.8s, MSE loss" },
  { name: "jpc", acc: "97.55%", note: "545.3s, same network" },
  { name: "Deepity DKP", acc: "95.97%", note: "49.6s, different network" },
];

const setup = [
  ["Task", "MNIST, 50,000 training images and 10,000 held-out"],
  ["Hardware", "One laptop CPU for the comparison runs. The GPU run used an NVIDIA A100"],
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

const hardware = [
  { name: "CPU", time: "146.3s", acc: "97.04%" },
  { name: "GPU (A100)", time: "12.4s", acc: "97.02%" },
];

function Card({ title, text, eyebrow, children, className = "" }) {
  return (
    <div className={`card-dark card-interactive flex flex-col p-6 md:p-8 ${className}`}>
      <div className="mb-6">
        {eyebrow && <div className="label mb-2 text-xs text-dim">{eyebrow}</div>}
        <h3 className="m-0 font-[family-name:var(--font-display)] text-xl tracking-[-0.01em] md:text-2xl">{title}</h3>
        {text && <p className="mb-0 mt-2 text-sm leading-relaxed text-dim">{text}</p>}
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
        eyebrow="Benchmarks & Results"
        width={1200}
      >
        On MNIST, Deepity reaches 98.22% accuracy, 3.16× faster than ngc-learn
        with the same network. The comparison ran on one laptop CPU.
      </PageHeader>

      <div className="mx-auto max-w-[1200px] px-3 pb-16 md:px-6">
        <Reveal className="panel-flat rounded-2xl border border-line p-3 md:p-8">
          <div className="grid gap-3 md:gap-4 lg:grid-cols-5">
            <Card
              className="lg:col-span-3"
              eyebrow="Accuracy Metric"
              title="Accuracy on MNIST"
              text="Held-out test images. Deepity matches ngc-learn and beats the PyTorch baseline."
            >
              <div className="text-center py-4">
                <div className="font-[family-name:var(--font-display)] font-light text-7xl tracking-[-0.04em] text-accent-text md:text-8xl drop-shadow-[0_0_24px_rgba(203,123,255,0.25)]">
                  <CountUp value={98.22} decimals={2} suffix="%" />
                </div>
                <div className="label mt-3 text-xs tracking-widest text-dim">
                  Deepity, held-out
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-lg border border-line bg-fg/[0.04] px-3 py-1 font-[family-name:var(--font-display)] text-xs text-dim hover:border-line-strong transition-colors"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Card>

            <Card
              className="lg:col-span-2"
              eyebrow="Speed Comparison"
              title="Training time"
              text="100 epochs on the same laptop CPU. Deepity is 3.16× faster than ngc-learn."
            >
              <ColumnBars />
            </Card>
          </div>

          <div className="mt-3 grid gap-3 md:mt-4 md:gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Suspense fallback={<div className="card-dark h-[440px]" />}>
                <BenchmarkChart />
              </Suspense>
            </div>

            <Card
              className="lg:col-span-2"
              eyebrow="Comparison Data"
              title="The other runs"
              text="Held-out accuracy and total training time."
            >
              <div className="flex flex-col gap-2.5">
                {others.map((o) => (
                  <div
                    key={o.name}
                    className="flex items-center justify-between rounded-xl border border-line bg-fg/[0.03] px-4 py-3 transition-colors hover:border-line-strong hover:bg-fg/[0.05]"
                  >
                    <div>
                      <div className="text-fg font-medium text-sm">{o.name}</div>
                      <div className="text-xs font-[family-name:var(--font-display)] text-dim">{o.note}</div>
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-xl font-light tabular-nums text-fg">
                      {o.acc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>

        <Reveal className="glass mt-6 p-8 md:p-12 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="label">Hardware Scaling</div>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1 font-[family-name:var(--font-display)] text-xs text-accent-text">
              11.8× faster on GPU
            </span>
          </div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            CPU and GPU
          </h2>
          <p className="mb-0 mt-3 max-w-2xl text-base leading-relaxed text-dim">
            The same Deepity model trained on a CPU and on an A100. The GPU finished 11.8× faster
            with the same accuracy, within 0.02 points.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {hardware.map((h) => (
              <div
                key={h.name}
                className="card-dark card-interactive flex items-center justify-between rounded-2xl border border-line p-5"
              >
                <div>
                  <div className="text-fg font-medium">{h.name}</div>
                  <div className="mt-1 font-[family-name:var(--font-display)] text-xs text-dim">
                    Train time: <span className="text-fg">{h.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-[family-name:var(--font-display)] text-2xl font-light text-accent-text tabular-nums">
                    {h.acc}
                  </div>
                  <div className="text-[11px] font-[family-name:var(--font-display)] uppercase text-dim">Accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="glass mt-6 p-8 md:p-12">
          <div className="label mb-3">Methodology</div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Setup
          </h2>
          <dl className="m-0 mt-6 divide-y divide-line rounded-xl border border-line bg-panel2/40 overflow-hidden">
            {setup.map(([k, v]) => (
              <div
                key={k}
                className="grid gap-1 px-5 py-3.5 md:grid-cols-[200px_1fr] md:gap-6 hover:bg-fg/[0.02] transition-colors"
              >
                <dt className="label text-xs self-center">{k}</dt>
                <dd className="m-0 text-sm leading-relaxed text-dim">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal className="glass mt-6 p-8 md:p-12">
          <div className="label mb-3">Additional Details</div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Notes
          </h2>
          <ul className="mt-6 list-disc space-y-3 pl-5 text-base leading-relaxed text-dim">
            {notes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tutorial" className="btn btn--solid">
              Get started
            </Link>
            <Link to="/theory" className="btn">
              How it works →
            </Link>
          </div>
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
