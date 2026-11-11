import { Dims } from "../Components/ArrowIcons.tsx";
import { lazy, Suspense, type ReactNode } from "react";
import PageHeader from "../Components/PageHeader.tsx";
import ButtonPrimary from "../Components/ButtonPrimary.tsx";
import ButtonSecondary from "../Components/ButtonSecondary.tsx";
import CopyButton from "../Components/CopyButton.tsx";

const BenchmarkChart = lazy(() => import("../Components/BenchmarkChart.tsx"));
const DepthChart = lazy(() => import("../Components/DepthChart.tsx"));

type Run = {
  name: string;
  note: string;
  cpuAcc: string;
  cpuTime: string;
  gpuAcc?: string;
  gpuTime?: string;
  change?: string;
  ours?: boolean;
};

const runs: Run[] = [
  { name: "Deepity SimplePCN", note: "Predictive coding", cpuAcc: "98.21%", cpuTime: "487.5s", gpuAcc: "98.08%", gpuTime: "66.8s", change: "7.3× faster", ours: true },
  { name: "jpc", note: "Predictive coding, JAX", cpuAcc: "97.55%", cpuTime: "531.4s", gpuAcc: "94.76%", gpuTime: "676.1s", change: "1.3× slower" },
  { name: "ngc-learn", note: "Predictive coding, JAX", cpuAcc: "98%", cpuTime: "1707.7s" },
  { name: "PyTorch backprop", note: "Reference, MSE loss", cpuAcc: "97.51%", cpuTime: "627.8s", gpuAcc: "97.70%", gpuTime: "61.9s", change: "10.1× faster" },
];

const LOGS = "https://github.com/Deepity-HQ/Deepity/blob/main/logs";
const CLONE = "git clone https://github.com/Deepity-HQ/Deepity && cd Deepity";

const repro = [
  { name: "Deepity, CPU", cmd: "python examples/mnist.py 7 100 20", log: "mnist_simd_fusion_confirm.txt" },
  { name: "Deepity, GPU", cmd: "python examples/mnist_cuda.py 7 100 20", log: "mnist_cuda_run.txt" },
  { name: "PyTorch backprop", cmd: "python examples/test_ffnn_deep.py 7 100", log: "bp_control_mnist.txt" },
  { name: "jpc", cmd: "python experiments/benchmark_jpc_mnist.py 7 100", log: "jpc_mnist_run.txt" },
];

const kernels = [
  { name: "Tanh", range: "1.36× to 11.66×" },
  { name: "Sigmoid", range: "2.49× to 4.13×" },
  { name: "GELU", range: "2.33× to 2.75×" },
  { name: "ReLU", range: "0.88× to 1.00×" },
];

const setup: [string, ReactNode][] = [
  ["Task", "MNIST, 50,000 training images and 10,000 held-out"],
  ["Network", <><Dims sizes={[784, 512, 512, 10]} /> with sigmoid activations</>],
  ["Training", "20 settling steps, batch size 250, 100 epochs, seed 7"],
  ["Optimizer", "AdamW, learning rate 0.00373, decaying by 0.94 each epoch"],
  ["CPU", "12th Gen Intel Core i7-12700H laptop, 20 logical threads, native build with Intel MKL"],
  ["GPU", "One NVIDIA A100 (40 GB) on the Ohio Supercomputer Center"],
  ["jpc", "The jpc library on JAX, with the same network, settling steps, batch size, epochs and schedule as Deepity. Accuracy is a feedforward readout"],
  ["ngc-learn", "The pc_discrim example from ngc-museum, run unmodified (ngclearn 3.2.3, JAX on CPU)"],
  ["PyTorch", "Backpropagation with the same network and schedule, using mean squared error against one-hot targets"],
];

const notes = [
  "The curves in the chart are accuracy on a training subset, as logged. The table shows held-out accuracy.",
  "ngc-learn only logs whole-percent accuracy, so its curve is stepped and 98% is a rounded best result.",
  "jpc spends about 95 seconds of its first GPU epoch compiling kernels, and this network at batch size 250 is small for an A100, so launch overhead dominates.",
  "Deepity's average energy rises late in training on both CPU and GPU, while accuracy stays at 99.8% to 100%. The batches have become perfectly separable by then.",
];

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <p className="mono m-0 mb-4 text-xs uppercase tracking-[0.12em] text-[#a99bff]">{eyebrow}</p>
      <h2 className="m-0 max-w-2xl text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Benchmarks() {
  return (
    <div>
      <PageHeader
        eyebrow="Benchmarks"
        title="Deepity against jpc, ngc-learn and PyTorch."
        width={1200}
      >
        On MNIST, Deepity reaches 98.21% accuracy in 487.5 seconds on a laptop
        CPU, 3.50× faster than ngc-learn on the same network. On one A100 the
        same run takes 66.8 seconds.
      </PageHeader>

      <div className="mx-auto max-w-[1200px] px-5 pb-8 md:px-8">
        <section className="py-16 md:py-20">
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-[0.08em] text-white/40">
                  <th className="px-5 py-3.5 font-medium" rowSpan={2}>Run</th>
                  <th className="border-l border-white/10 px-5 py-2.5 font-medium" colSpan={2}>Laptop CPU</th>
                  <th className="border-l border-white/10 px-5 py-2.5 font-medium" colSpan={3}>NVIDIA A100</th>
                </tr>
                <tr className="border-b border-white/10 text-xs text-white/35">
                  <th className="border-l border-white/10 px-5 py-2 font-normal">Test accuracy</th>
                  <th className="px-5 py-2 font-normal">100 epochs</th>
                  <th className="border-l border-white/10 px-5 py-2 font-normal">Test accuracy</th>
                  <th className="px-5 py-2 font-normal">100 epochs</th>
                  <th className="px-5 py-2 font-normal">Versus CPU</th>
                </tr>
              </thead>
              <tbody className="tabular">
                {runs.map((r) => (
                  <tr key={r.name} className="border-b border-white/10 last:border-0">
                    <td className="px-5 py-4">
                      <div className={r.ours ? "font-medium text-white" : "text-white/85"}>{r.name}</div>
                      <div className="text-xs text-white/40">{r.note}</div>
                    </td>
                    <td className={`border-l border-white/10 px-5 py-4 ${r.ours ? "text-[#a99bff]" : "text-white/80"}`}>{r.cpuAcc}</td>
                    <td className="px-5 py-4 text-white/60">{r.cpuTime}</td>
                    <td className={`border-l border-white/10 px-5 py-4 ${r.ours ? "text-[#a99bff]" : "text-white/80"}`}>{r.gpuAcc ?? "n/a"}</td>
                    <td className="px-5 py-4 text-white/60">{r.gpuTime ?? "n/a"}</td>
                    <td className="px-5 py-4 text-white/60">{r.change ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-0 mt-4 max-w-3xl text-sm leading-relaxed text-white/45">
            Every row uses the same network, settling steps, batch size, epochs and
            optimizer schedule. The PyTorch row is a reference, not a predictive
            coding run: it does one backward pass per batch where predictive coding
            does 20 settling steps.
          </p>

          <div className="mt-10">
            <Suspense fallback={<div className="h-[500px] rounded-xl border border-white/10 bg-[#0b0b0d]" />}>
              <BenchmarkChart />
            </Suspense>
          </div>
        </section>

        <Section eyebrow="Depth" title="DKP-PC against backpropagation as networks get deeper.">
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
            <div className="text-base leading-relaxed text-white/60">
              <p className="mt-0">
                Backpropagation is a strict chain: layer L needs its gradient before
                layer L-1 can start. DKP-PC layers update from local signals, so a
                batched GPU path can process every layer together.
              </p>
              <p>
                On an A100 with width 128 and batch 128, the two take the same time
                at 32 layers. At 2048 layers a DKP-PC step takes 11.85 ms against
                59.10 ms for backpropagation, which is 5× faster.
              </p>
              <p className="mb-0 text-sm text-white/45">
                This times matched network shapes on random data, so it is not an
                accuracy comparison. The 32-layer crossover depends on width and
                batch size: narrower networks need more layers, wider ones fewer.
              </p>
            </div>
            <Suspense fallback={<div className="h-[420px] rounded-xl border border-white/10 bg-[#0b0b0d]" />}>
              <DepthChart />
            </Suspense>
          </div>
        </Section>

        <Section eyebrow="Fast option" title="DKPPCN trades some accuracy for much less compute.">
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ["95.97%", "MNIST test accuracy"],
              ["49.6s", "on the same laptop CPU, 50 epochs"],
              ["2 steps", "of inference per batch, against 20 for SimplePCN"],
            ].map(([v, l]) => (
              <div key={v} className="bg-[#08080a] p-7">
                <div className="text-4xl font-medium tracking-[-0.04em] text-white">{v}</div>
                <p className="mb-0 mt-2 text-sm text-white/50">{l}</p>
              </div>
            ))}
          </div>
          <p className="mb-0 mt-5 max-w-2xl text-sm leading-relaxed text-white/45">
            DKPPCN uses a <Dims sizes={[784, 512, 10]} /> network with batch size 1000, so it is a different
            network and training method from the rows above.
          </p>
        </Section>

        <Section eyebrow="Kernels" title="Hand-written SIMD kernels on the CPU.">
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <div className="bg-[#08080a] p-6">
                  <div className="tabular text-3xl font-medium tracking-[-0.04em] text-white">675</div>
                  <p className="mb-0 mt-2 text-sm text-white/50">GFLOPS sustained across the full MNIST run</p>
                </div>
                <div className="bg-[#08080a] p-6">
                  <div className="tabular text-3xl font-medium tracking-[-0.04em] text-white">690</div>
                  <p className="mb-0 mt-2 text-sm text-white/50">GFLOPS on a 784-512-256-64-10 train step, batch 256</p>
                </div>
              </div>
              <p className="mb-0 mt-4 text-sm leading-relaxed text-white/45">
                FLOPs are counted from the architecture as two GEMMs per settling step and
                one weight-gradient GEMM per train step.
              </p>
            </div>
            <div>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <div className="border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.08em] text-white/40">
                  Activation speedup over a naive loop
                </div>
                {kernels.map((k) => (
                  <div key={k.name} className="tabular flex justify-between border-b border-white/10 px-5 py-3.5 text-sm last:border-0">
                    <span className="text-white/85">{k.name}</span>
                    <span className="text-white/60">{k.range}</span>
                  </div>
                ))}
              </div>
              <p className="mb-0 mt-4 text-sm leading-relaxed text-white/45">
                ReLU is limited by memory bandwidth, so it ties with a plain loop.
                Ranges cover tensors from 256 to 131,072 elements.
              </p>
            </div>
          </div>
        </Section>

        <Section eyebrow="Setup" title="How the runs were made.">
          <dl className="m-0 mt-10 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10">
            {setup.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 md:grid-cols-[180px_1fr] md:gap-6">
                <dt className="text-sm font-medium text-white/85">{k}</dt>
                <dd className="m-0 text-sm leading-relaxed text-white/55">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 id="reproduce" className="m-0 mt-16 text-xl font-semibold text-white md:text-2xl">
            Run it yourself
          </h3>
          <p className="mb-0 mt-3 max-w-2xl text-base leading-relaxed text-white/55">
            The MNIST results above come from these commands, run from the
            repository root.
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
              <div className="mono text-xs text-white/70">
                <span className="text-[#a99bff]">$ </span>
                {CLONE}
              </div>
              <CopyButton code={CLONE} label="clone command" />
            </div>
            {repro.map((r) => (
              <div
                key={r.name}
                className="grid items-center gap-x-6 gap-y-2 border-b border-white/10 px-5 py-4 last:border-0 md:grid-cols-[170px_1fr_auto]"
              >
                <div className="text-sm font-medium text-white/85">{r.name}</div>
                <div className="mono flex min-w-0 items-center gap-3 text-xs text-white/70">
                  <span className="min-w-0 truncate">
                    <span className="text-[#a99bff]">$ </span>
                    {r.cmd}
                  </span>
                  <CopyButton code={r.cmd} label={`${r.name} command`} />
                </div>
                <ButtonSecondary href={`${LOGS}/${r.log}`}>
                  Raw log
                </ButtonSecondary>
              </div>
            ))}
          </div>
          <p className="mb-0 mt-4 max-w-3xl text-sm leading-relaxed text-white/45">
            Each run uses seed 7 and 100 epochs. The raw output of every run is
            committed under{" "}
            <a
              className="text-white/75 underline underline-offset-4 decoration-white/30 hover:decoration-white"
              href={LOGS}
            >
              logs/
            </a>{" "}
            in the repository. The ngc-learn number comes from the unmodified
            pc_discrim example in ngc-museum, listed in{" "}
            <a
              className="text-white/75 underline underline-offset-4 decoration-white/30 hover:decoration-white"
              href={`${LOGS}/ngclearn_pc_discrim_mnist.txt`}
            >
              its own log
            </a>
            . Timings depend on your hardware, so expect different numbers on a
            different machine.
          </p>
        </Section>

        <Section eyebrow="Notes" title="Reading the results.">
          <ul className="mb-0 mt-8 max-w-3xl list-disc space-y-3 pl-5 text-base leading-relaxed text-white/60">
            {notes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonPrimary to="/tutorial">
              Get started
            </ButtonPrimary>
            <ButtonSecondary to="/theory">
              How it works
            </ButtonSecondary>
          </div>
        </Section>
      </div>
    </div>
  );
}
