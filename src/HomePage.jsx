import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import CodeTabs from "./components/CodeTabs";
import SectionHead from "./components/SectionHead";
import Reveal from "./components/Reveal";
import RotatingText from "./components/RotatingText";
import Highway from "./components/Highway";
import BenchmarkSummary from "./components/BenchmarkSummary";
import { DEVELOPER_URL, DISCORD_WIDGET_ID, GITHUB_URL } from "./config";


const pythoncode = `from pydeepity import SimplePCN
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

const cppcode = `#include <deepity/networks/SimplePCNetwork.h>
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

const codeFiles = [
  { name: "train.py", language: "python", code: pythoncode },
  { name: "train.cpp", language: "cpp", code: cppcode },
];

// Edit freely: these cycle in the hero.
const useCases = [
  "High-performance computing",
  "Embedded systems",
  "Edge devices",
  "Low-power environments",
  "Continual learning",
  "Neuromorphic research",
  "Rapid experimentation",
];

const specs = [
  { value: "1.8×", caption: "Faster than ngc-learn at the same accuracy" },
  { value: "98.22%", caption: "Accuracy on MNIST, trained on a laptop" },
  { value: "CPU + GPU", caption: "From laptop CPUs to NVIDIA GPUs" },
  { value: "MIT", caption: "Free and open source" },
];

const stack = [
  { name: "OpenBLAS", href: "https://www.openmathlib.org/OpenBLAS/" },
  { name: "Intel MKL", href: "https://www.intel.com/content/www/us/en/developer/tools/oneapi/onemkl.html" },
  { name: "OpenMP", href: "https://www.openmp.org/" },
  { name: "Google Highway", href: "https://github.com/google/highway" },
  { name: "SLEEF", href: "https://sleef.org/" },
  { name: "CUDA", href: "https://developer.nvidia.com/cuda-toolkit" },
  { name: "CUTLASS", href: "https://github.com/NVIDIA/cutlass" },
  { name: "nanobind", href: "https://github.com/wjakob/nanobind" },
  { name: "Google Benchmark", href: "https://github.com/google/benchmark" },
];

const ideas = [
  {
    title: "Learns locally",
    text: "Each neuron adjusts from the errors right next to it, the way many neuroscientists think the brain works. No error signal has to travel back through the whole network.",
  },
  {
    title: "Fits small hardware",
    text: "Local learning suits edge devices, embedded systems and low-power machines, where a large GPU isn't an option.",
  },
  {
    title: "Keeps learning",
    text: "Predictive coding is a good fit for systems that keep learning after deployment, a hard problem for standard networks.",
  },
];

const reasons = [
  {
    title: "Written from scratch",
    text: "A C++ and CUDA engine for predictive coding, not a layer on top of JAX or PyTorch. Python bindings are built on nanobind, and the compiled extension is under 2MB.",
  },
  {
    title: "CPU and GPU",
    text: "Fast on the CPU with Google Highway and SLEEF SIMD kernels and OpenBLAS or Intel MKL. A CUDA backend built on cuBLAS, with optional CUTLASS kernels, runs on NVIDIA GPUs. It is in active development and has been tested on the Ohio Supercomputer Center and Vast.ai.",
  },
  {
    title: "Documented and tested",
    text: "Doxygen docs and runnable examples. GitHub Actions builds the library on Linux and Windows and type-checks the Python package on every push.",
  },
  {
    title: "Open source",
    text: "MIT licensed. Made and maintained by one developer.",
    link: { href: DEVELOPER_URL, label: "About the developer ↗" },
  },
];

const sectionClass = "relative px-5 py-24 md:px-8 md:py-32";

export default function HomePage() {
  return (
    <div className="relative">
      <Highway layout="br" />
      <section className="px-3 pb-6 pt-20 md:px-4">
        <div className="relative mx-auto flex min-h-[max(640px,min(calc(100svh-6.5rem),56rem))] max-w-[1400px] flex-col overflow-hidden rounded-[2rem] border border-line hero-glow md:rounded-[2.5rem]">
          <div className="relative flex flex-1 flex-col">
          <Highway />

          <Reveal mode="leave" className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-16 text-center md:px-10">
            <Reveal
              as="h1"
              delay={80}
              className="m-0 max-w-5xl text-balance font-[family-name:var(--font-display)] text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.03] tracking-[-0.03em]"
            >
              Today&apos;s AI learns one way. Deepity{" "}
              <span className="bg-gradient-to-r from-fg to-accent bg-clip-text text-transparent">
                learns tomorrow&apos;s.
              </span>
            </Reveal>

            <Reveal as="p" delay={160} className="mx-auto mt-8 max-w-2xl text-lg text-dim md:text-xl">
              Deepity is an open-source engine for predictive coding. Neurons
              learn from local errors, not backpropagation, as the brain is
              thought to. It runs on CPUs and NVIDIA GPUs.
            </Reveal>

            <Reveal delay={220} className="mt-8 flex flex-wrap items-baseline justify-center gap-x-4">
              <span className="label">Built for</span>
              <RotatingText
                items={useCases}
                className="font-[family-name:var(--font-display)] text-xl tracking-[-0.01em] text-accent md:text-2xl"
              />
            </Reveal>

            <Reveal delay={300} className="mt-10 flex flex-wrap justify-center gap-3">
              <Link to="/tutorial" className="btn btn--solid">
                Get started
              </Link>
              <Link to="/benchmarks" className="btn">
                See the benchmarks
              </Link>
            </Reveal>
          </Reveal>

          <button
            type="button"
            onClick={() => document.getElementById("idea")?.scrollIntoView({ behavior: "smooth" })}
            className="absolute bottom-14 left-[5.5rem] z-10 hidden cursor-pointer items-center gap-3 rounded-full border border-line bg-[#131314] py-1.5 pl-1.5 pr-4 text-sm text-dim transition-colors hover:border-accent hover:text-fg xl:flex"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </span>
            Scroll down
          </button>

          </div>

          {/* Key numbers */}
          <dl className="relative z-10 m-0 grid grid-cols-2 border-t border-line bg-black/50 lg:grid-cols-4">
            {specs.map((s, i) => (
              <Reveal
                key={s.caption}
                delay={i * 90}
                className={`px-6 py-6 text-center md:py-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                  i > 1 ? "border-t border-line lg:border-t-0" : ""
                } ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
              >
                <dd className="m-0 font-[family-name:var(--font-display)] text-4xl tracking-[-0.03em] md:text-5xl font-light">
                  {s.value}
                </dd>
                <dt className="label mt-2">{s.caption}</dt>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal className="mx-auto mt-10 flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 font-[family-name:var(--font-display)] text-lg">
          {stack.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dim no-underline transition-colors hover:text-accent"
            >
              {name}
            </a>
          ))}
        </Reveal>
      </section>
      {/* ------------------------------------------------------------ ABOUT */}
      <section id="idea" className={`${sectionClass} scroll-mt-16`}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead label="The idea" title="A different way to train neural networks">
            Most AI today is trained with backpropagation, which needs a lot of
            memory and, in practice, GPUs.
          </SectionHead>
          <div className="grid gap-4 md:grid-cols-3">
            {ideas.map((r, i) => (
              <Reveal key={r.title} delay={i * 100} className="glass p-8">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em]">
                  {r.title}
                </h3>
                <p className="mb-0 mt-3 text-lg text-dim">{r.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link to="/theory" className="btn">How it works →</Link>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- PERFORMANCE */}
      <section id="results" className={`${sectionClass} scroll-mt-16`}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead label="Results" title="Faster, at the same accuracy">
            On the standard MNIST handwriting test, Deepity matches the
            accuracy of the existing predictive coding library, ngc-learn, in
            about half the time. Everything ran on one laptop CPU.
          </SectionHead>
          <Reveal>
            <BenchmarkSummary />
            <div className="mt-8 text-center">
              <Link to="/benchmarks" className="btn">See the full benchmarks</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- WHY */}
      <section className={sectionClass}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead label="Features" title="Built to be used" />
          <div className="grid gap-4 md:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={(i % 2) * 100} className="glass p-8 md:p-10">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.01em]">
                  {r.title}
                </h3>
                <p className="mb-0 mt-4 text-lg text-dim">{r.text}</p>
                {r.link && (
                  <a
                    href={r.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link mt-5 inline-block text-lg"
                  >
                    {r.link.label}
                  </a>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CODE */}
      <section id="code" className={`${sectionClass} scroll-mt-16`}>
        <div className="mx-auto max-w-[1100px]">
          <SectionHead label="Usage" title="Code examples">
            The same network in Python and C++.
          </SectionHead>
          <Reveal>
            <CodeTabs files={codeFiles} />
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- EARLY ACCESS */}
      <section className="px-5 py-12 md:px-8">
        <Reveal className="glass mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-8 p-8 text-center md:flex-row md:p-12 md:text-left">
          <div>
            <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
              Building with predictive coding?
            </h2>
            <p className="mb-0 mt-3 text-lg text-dim">
              Request early access and tell us what you are working on.
            </p>
          </div>
          <Link to="/early-access" className="btn btn--solid shrink-0">
            Request early access
          </Link>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- CONTRIBUTE */}
      <section className="px-3 pb-12 pt-12 md:px-4">
        <Reveal className="panel-glow relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] border border-line px-6 py-16 md:rounded-[2.5rem] md:px-16 md:py-24">
          <div className="relative flex flex-col items-center">
            <div className="max-w-2xl text-center">
              <div className="label mb-4">Contribute</div>
              <h2 className="m-0 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-[-0.02em] md:text-6xl">
                Help build it
              </h2>
              <p className="mt-6 text-lg text-dim">
                Deepity is open source under the MIT license. Code, bug reports and
                docs fixes are all welcome.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn--solid">
                  View on GitHub ↗
                </a>
                <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="btn">
                  Open an issue ↗
                </a>
                <a href={`https://discord.com/widget?id=${DISCORD_WIDGET_ID}`} target="_blank" rel="noopener noreferrer" className="btn">
                  Discord ↗
                </a>
              </div>
            </div>

          </div>
        </Reveal>
      </section>

      <MainFooter />
    </div>
  );
}
