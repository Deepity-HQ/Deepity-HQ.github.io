import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { hasWebGL, WebGLBoundary } from "./webgl.tsx";
import CodeTabs, { type CodeFile } from "./Components/CodeTabs.tsx";
import CopyButton from "./Components/CopyButton.tsx";
import FlyStage from "./Components/FlyStage.tsx";
import useRepoStats from "./Components/useRepoStats.ts";
import PCDemo from "./Components/PCDemo.tsx";
import ScrollRise from "./Components/ScrollRise.tsx";
import CountUp from "./Components/CountUp.tsx";
import { ArrowRight, Dims } from "./Components/ArrowIcons.tsx";
import ButtonPrimary from "./Components/ButtonPrimary.tsx";
import ButtonSecondary from "./Components/ButtonSecondary.tsx";

// The 3D wave (and three.js) loads in its own chunk, after the page text is up
const AnimatedWaveBackground = lazy(
  () => import("./Components/UI_Fun/AnimatedWaveBackground.tsx"),
);

const INSTALL = "pip install pydeepity";

function Hero() {
  const stats = useRepoStats();
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-x-clip px-5 pb-44 pt-24 md:px-8 md:pb-52">
      <div className="relative isolate mx-auto flex max-w-[1200px] flex-col items-center text-center">
        {/* Keeps bright wave crests from washing out the text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-[8%] -bottom-6 -top-10 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 52% 55% at 50% 52%, rgba(8,8,10,0.88) 0%, rgba(8,8,10,0.7) 45%, rgba(8,8,10,0) 100%)",
          }}
        />
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          <ButtonSecondary href="https://pypi.org/project/pydeepity/">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a99bff]" />
            {stats.version} · CUDA wheels on PyPI
          </ButtonSecondary>
        </div>

        <h1 className="m-0 max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl md:text-7xl">
          Train neural networks without backpropagation.
        </h1>
        <p className="mb-0 mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/60 md:text-lg">
          Deepity is an open-source predictive coding engine for Python and C++.
          Each layer learns from its own local error. It runs on CPUs and NVIDIA
          GPUs.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-stretch sm:justify-center">
          <div className="mono flex min-h-[38px] items-center justify-between gap-4 rounded-lg border border-white/15 bg-black/70 pl-4 pr-1.5 text-sm text-white">
            <span className="select-all">
              <span className="text-[#a99bff]">$ </span>
              {INSTALL}
            </span>
            <CopyButton code={INSTALL} label="install command" />
          </div>
          <ButtonPrimary to="/tutorial">
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </ButtonPrimary>
        </div>
        <p className="mb-0 mt-5 text-sm text-white/80">
          MIT licensed. Prebuilt wheels for Linux and Windows, Python 3.11 to
          3.13.
        </p>
      </div>

    </section>
  );
}

const results = [
  { name: "Deepity", time: 487.5, acc: "98.21%", ours: true },
  { name: "jpc (JAX)", time: 531.4, acc: "97.55%" },
  { name: "PyTorch backprop", time: 627.8, acc: "97.51%" },
  { name: "ngc-learn", time: 1707.7, acc: "98%" },
];
const maxTime = Math.max(...results.map((r) => r.time));

const stats = [
  {
    node: <CountUp value={3.5} decimals={2} suffix="×" />,
    label: "faster than ngc-learn on the same network and settings",
  },
  {
    node: <CountUp value={98.21} decimals={2} suffix="%" />,
    label: "MNIST test accuracy on a laptop CPU, in 487.5 seconds",
  },
  {
    node: <CountUp value={66.8} decimals={1} suffix="s" />,
    label:
      "to train the same network on one NVIDIA A100, 7.3× faster than the CPU",
  },
  {
    node: <CountUp value={5} decimals={0} suffix="×" />,
    label: "faster than backpropagation at 2048 layers on a GPU, with DKP-PC",
  },
];

function Results() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          <ScrollRise>
            <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
              Benchmarks
            </p>
            <h2 className="m-0 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-5xl">
              Faster than the other predictive coding libraries.
            </h2>
            <p className="mb-0 mt-6 max-w-md text-base leading-relaxed text-white/60">
              The same <Dims sizes={[784, 512, 512, 10]} /> network, 20 settling steps, batch size 250
              and 100 epochs, on one laptop CPU. A PyTorch backprop run is there
              for reference.
            </p>
            <ButtonSecondary to="/benchmarks" className="mt-8">
              Read the full benchmarks
            </ButtonSecondary>
          </ScrollRise>

          <ScrollRise>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div className="mono mb-6 flex justify-between text-[11px] uppercase tracking-[0.08em] text-white/40">
                <span>Training time, 100 epochs</span>
                <span>Test accuracy</span>
              </div>
              <div className="flex flex-col gap-6">
                {results.map((r) => (
                  <div key={r.name}>
                    <div className="mb-2 flex items-baseline justify-between text-sm">
                      <span
                        className={
                          r.ours ? "font-medium text-white" : "text-white/70"
                        }
                      >
                        {r.name}
                      </span>
                      <span className="tabular mono text-white/60">
                        <span className="mr-4 text-white/40">
                          {r.time.toFixed(1)}s
                        </span>
                        <span className={r.ours ? "text-[#a99bff]" : ""}>
                          {r.acc}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.06]">
                      <div
                        className={`h-full rounded-full ${r.ours ? "bg-[#a99bff]" : "bg-white/30"}`}
                        style={{ width: `${(r.time / maxTime) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollRise>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#08080a] p-6 md:p-7">
              <div className="tabular text-4xl font-medium tracking-[-0.04em] text-white md:text-5xl">
                {s.node}
              </div>
              <p className="mb-0 mt-3 text-sm leading-relaxed text-white/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Predict.",
    body: "Every layer holds a guess about what it is seeing, and predicts what the layer next to it should see.",
  },
  {
    title: "Compare.",
    body: "Where a prediction and a guess disagree, the gap is a prediction error. It lives in that layer and nowhere else.",
  },
  {
    title: "Settle.",
    body: "With the input and the answer clamped, each layer nudges its guess to shrink the errors around it. Repeat for T steps.",
  },
  {
    title: "Update.",
    body: "Each layer changes its weights using only its own error. No gradient travels backward through the network.",
  },
];

function HowItWorks() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollRise className="max-w-2xl">
          <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
            How it works
          </p>
          <h2 className="m-0 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-5xl">
            Each layer learns from its own error.
          </h2>
        </ScrollRise>

        <div className="mt-10 border-t border-white/10">
          {steps.map((s, i) => (
            <ScrollRise
              key={s.title}
              className="grid gap-4 border-b border-white/10 py-8 md:grid-cols-[120px_1fr_1.3fr] md:items-baseline md:gap-8 md:py-6"
            >
              <span className="mono text-sm text-white/35">
                0{i + 1} <span className="text-white/20">/ 04</span>
              </span>
              <h3 className="m-0 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
                {s.title}
              </h3>
              <p className="m-0 max-w-lg text-base leading-relaxed text-white/55">
                {s.body}
              </p>
            </ScrollRise>
          ))}
        </div>

        <ButtonSecondary to="/theory" className="mt-10">
          The theory and equations
        </ButtonSecondary>
      </div>
    </section>
  );
}

const reasons = [
  {
    title: "No backward graph",
    body: "Backpropagation keeps the whole forward pass in memory until the backward pass runs. Each Deepity layer updates from a local error, so there is no stored graph.",
  },
  {
    title: "No weight transport",
    body: "Backprop sends error through the exact transpose of the forward weights. Local updates do not need that, and DKP learns the feedback pathway instead.",
  },
  {
    title: "Scales with depth on GPUs",
    body: "Backprop is a strict chain from the last layer to the first. Predictive coding layers can update together. At 2048 layers on an A100, a DKP-PC step takes 11.85 ms against 59.10 ms for backprop.",
  },
];

function Why() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollRise className="max-w-2xl">
          <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
            Why predictive coding
          </p>
          <h2 className="m-0 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-5xl">
            A different cost profile.
          </h2>
        </ScrollRise>
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">
          {reasons.map((r) => (
            <ScrollRise
              key={r.title}
              className="bg-[#08080a] p-7 md:p-8"
            >
              <h3 className="m-0 text-lg font-semibold tracking-[-0.02em] text-white">
                {r.title}
              </h3>
              <p className="mb-0 mt-3 text-[15px] leading-relaxed text-white/55">
                {r.body}
              </p>
            </ScrollRise>
          ))}
        </div>
      </div>
    </section>
  );
}

const pythonCode = `from pydeepity import SimplePCN
from pydeepity.layer import Linear, Sigmoid

# The network from the benchmark: 784 -> 512 -> 512 -> 10
net = SimplePCN(
    Linear(784, 512),
    Linear(512, 512), Sigmoid(),
    Linear(512, 10), Sigmoid(),
    batch_size=250,
)
net.configure(learning_rate=0.00373, inference_rate=0.091, lmbda=0.0, optimizer="ADAMW")

# X_train: (N, 784) float32 in [0, 1]. Y_train: (N, 10) one-hot.
# examples/mnist.py loads MNIST and has the full script.
for epoch in range(100):
    for b in range(len(X_train) // 250):
        X = X_train[b * 250:(b + 1) * 250]
        Y = Y_train[b * 250:(b + 1) * 250]
        energy = net.train_step_with_projection(X, Y, 20)  # 20 settling steps
`;

const cppCode = `#include <deepity/networks/SimplePCNetwork.h>
#include <random>

// The network from the benchmark: 784 -> 512 -> 512 -> 10
Deep::SimplePCNetwork net(250);  // batch size
net.AddLayer(784, 512, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::LINEAR, Deep::ActivationType::dLINEAR);
net.AddLayer(512, 512, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::SIGMOID, Deep::ActivationType::dSIGMOID);
net.AddLayer(512, 10, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::SIGMOID, Deep::ActivationType::dSIGMOID);
net.AddLayer(10, 0, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::LINEAR, Deep::ActivationType::dLINEAR);

net.SetOptimizer(Deep::OptimizerType::ADAMW);
net.Compile();

std::mt19937 rng(7);
net.RandomizeWeights(rng);

// X: one batch, 250 * 784 floats. Y: 250 * 10 one-hot floats.
float energy = net.TrainStepWithProjection(X, Y, 20);  // 20 settling steps`;

const codeFiles: CodeFile[] = [
  { name: "train.py", language: "python", code: pythonCode },
  { name: "train.cpp", language: "cpp", code: cppCode },
];

function Code() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <ScrollRise>
          <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
            Interface
          </p>
          <h2 className="m-0 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-5xl">
            The same network in Python and C++.
          </h2>
          <p className="mb-0 mt-6 max-w-md text-base leading-relaxed text-white/60">
            The Python package is a thin layer over the C++ core, with no deep
            learning framework underneath. These snippets build the network from
            the benchmark.
          </p>
          <ButtonSecondary to="/tutorial" className="mt-8">
            Work through the tutorials
          </ButtonSecondary>
        </ScrollRise>
        <ScrollRise className="min-w-0">
          <CodeTabs files={codeFiles} />
        </ScrollRise>
      </div>
    </section>
  );
}

const technologies = [
  "OpenMP",
  "Intel MKL",
  "OpenBLAS",
  "Google Highway",
  "SLEEF",
  "CUDA",
  "cuBLAS",
  "CUTLASS",
  "nanobind",
  "Google Benchmark",
];

function Demo() {
  return (
    <section className="border-t border-white/10 px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1000px]">
        <ScrollRise className="max-w-2xl">
          <p className="mono m-0 mb-5 text-xs uppercase tracking-[0.12em] text-[#a99bff]">
            Try it
          </p>
          <h2 className="m-0 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-white md:text-5xl">
            Watch a predictive coding network learn.
          </h2>
          <p className="mb-0 mt-6 text-base leading-relaxed text-white/60">
            This 2-16-16-1 network trains in your browser. Each step, every
            layer predicts the one above it, the neurons settle to reduce their
            own prediction errors, and each weight changes using only the errors
            next to it.
          </p>
        </ScrollRise>
        <ScrollRise className="mt-12">
          <PCDemo />
        </ScrollRise>
      </div>
    </section>
  );
}

function Stack() {
  const row = [...technologies, ...technologies];
  return (
    <section className="border-t border-white/10 py-14">
      <p className="mono m-0 mb-8 text-center text-xs uppercase tracking-[0.12em] text-white/35">
        Built on
      </p>
      <div className="marquee-mask">
        <div className="marquee" aria-hidden="false">
          {row.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="mx-8 whitespace-nowrap text-lg font-medium tracking-[-0.02em] text-white/45"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingText() {
  return (
    <section className="border-t border-white/10 px-5 py-28 md:px-8 md:py-36">
      <ScrollRise className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="m-0 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-white md:text-6xl">
          Train your first network in a few minutes.
        </h2>
        <p className="mb-0 mt-6 max-w-lg text-base leading-relaxed text-white/55">
          Install the package, then follow the tutorials from XOR to a
          convolutional network.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonPrimary to="/tutorial">
            Get started
            <ArrowRight className="h-3.5 w-3.5" />
          </ButtonPrimary>
          <ButtonSecondary to="/early-access">
            Request early access
          </ButtonSecondary>
        </div>
      </ScrollRise>
    </section>
  );
}

const LaptopScene = lazy(() => import("./Components/UI_Fun/LaptopScene.tsx"));

function LaptopStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [progress, setProgress] = useState(0);
  const linkRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(stage);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        if (total <= 0) return;
        setProgress(Math.min(Math.max(-rect.top / total, 0), 1));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={stageRef} className="relative h-[220vh] w-full border-t border-white/10">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <WebGLBoundary fallback={null}>
            <Suspense fallback={null}>{near && <LaptopScene progress={progress} linkRefs={linkRefs} />}</Suspense>
          </WebGLBoundary>
        </div>
        {[
          ["/tutorial", "Get started"],
          ["/early-access", "Request early access"],
        ].map(([to, label], i) => (
          <Link
            key={to}
            to={to}
            aria-label={label}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 hidden cursor-pointer rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}

function Closing() {
  return hasWebGL() ? <LaptopStage /> : <ClosingText />;
}

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <AnimatedWaveBackground />
      </Suspense>
      <Hero />
      <FlyStage>
        {[<Results key="r" />, <HowItWorks key="h" />, <Why key="w" />, <Code key="c" />]}
      </FlyStage>
      <Demo />
      <Stack />
      <Closing />
    </>
  );
}
