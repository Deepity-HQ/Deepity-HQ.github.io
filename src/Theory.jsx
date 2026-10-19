import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import Reveal from "./components/Reveal";
import PCStepper from "./components/PCStepper";

const PCNRepresentation = lazy(() => import("./components/PCNRepresentation"));

const reading = [
  {
    title: "Introduction to Predictive Coding Networks for Machine Learning (Stenlund, 2025)",
    href: "https://arxiv.org/pdf/2506.06332",
  },
  { title: "Predictive coding (Wikipedia)", href: "https://en.wikipedia.org/wiki/Predictive_coding" },
];

// L = layers, M = inference (settling) steps per training example.
const costs = [
  { method: "Backpropagation", hops: "O(L)", work: "O(L)" },
  { method: "Predictive coding", hops: "O(L)", work: "O(L·M)" },
  { method: "Direct Kolen-Pollack PC", hops: "O(1)", work: "O(L·M), with M of 1 or 2" },
];

const offers = [
  {
    title: "One principle for inference and learning",
    text: "Prediction error drives both. Neurons settle to reduce it, and weights change to reduce it. Backpropagation needs a separate forward pass and gradient computation.",
  },
  {
    title: "A model that predicts",
    text: "Each layer predicts the activity it connects to, so prediction error measures how surprising an input is. Run in the other direction, the same machinery gives a generative model. Deepity's current networks are discriminative.",
  },
  {
    title: "Plausible in the brain",
    text: "Local updates need no weight transport and no global backward pass, which are hard to square with real neurons. Predictive coding comes out of neuroscience, though how closely the brain follows it is still debated.",
  },
  {
    title: "No separate training phase",
    text: "Updates are local and continuous, so online and continual learning come more naturally. Locality also lets layers update in parallel, which suits edge and neuromorphic hardware. Deepity has not been benchmarked on either yet.",
  },
];

export default function Theory() {

  return (
    <div>
      <PageHeader title="How predictive coding works">
        The idea behind Deepity and the equations it implements. The tutorials
        cover the same ground in more detail.
      </PageHeader>

      <div className="mx-auto max-w-[1000px] px-5 pb-16 md:px-8">
        <Reveal className="glass p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Learning from local errors
          </h2>
          <p className="mt-5 text-lg text-dim">
Backpropagation sends one error signal backward through the whole
            network. In predictive coding, each layer works from its own local
            error, in the three steps below.
          </p>
          <p className="mb-0 mt-4 text-lg text-dim">
            The approach is inspired by the brain&apos;s predictive coding
            theory: the brain keeps generating predictions about incoming
            signals and corrects its internal model from the errors.
          </p>
        </Reveal>

        <Reveal className="mt-4">
          <PCStepper />
        </Reveal>

        <Reveal className="mt-4">
          <Suspense fallback={<div className="h-48" />}>
            <PCNRepresentation />
          </Suspense>
        </Reveal>

        <Reveal className="glass mt-4 p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Where the cost comes from
          </h2>
          <p className="mt-5 text-lg text-dim">
            Backpropagation sends the error back through the network in one
            sweep, so it takes a number of steps proportional to the depth L.
            Predictive coding has no sweep. Each layer only sees its
            neighbors, so the error moves one layer per settling step, and
            every input needs M of those steps over all L layers before the
            weights can be updated.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-base">
              <thead>
                <tr className="label border-b border-line-strong">
                  <th className="py-3 pr-4 font-normal">Method</th>
                  <th className="py-3 pr-4 font-normal">Hops for the error to reach a layer</th>
                  <th className="py-3 font-normal">Layer updates per example</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((c) => (
                  <tr key={c.method} className="border-b border-line">
                    <td className="py-3 pr-4 text-fg">{c.method}</td>
                    <td className="py-3 pr-4 font-mono text-dim">{c.hops}</td>
                    <td className="py-3 font-mono text-dim">{c.work}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mb-0 mt-6 text-lg text-dim">
            Direct Kolen-Pollack feedback sends the output error straight to
            every layer through learned feedback weights, so it arrives in one
            hop and M can drop to 1 or 2. That is the main reason it trains
            faster, and it costs some accuracy: on our MNIST runs it reached
            95.97% against 98.22% for standard settling.
          </p>
          <p className="mb-0 mt-4 text-lg text-dim">
            These are operation counts, not wall-clock time. Deepity works on
            the constant factors with a C++ core, SIMD kernels on the CPU and a
            CUDA backend for NVIDIA GPUs.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            What it offers
          </h2>
          <div className="mt-8 border-b border-line-strong">
            {offers.map((o) => (
              <div
                key={o.title}
                className="grid gap-3 border-t border-line-strong py-7 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em]">
                  {o.title}
                </h3>
                <p className="m-0 text-lg text-dim">{o.text}</p>
              </div>
            ))}
          </div>
          <p className="mb-0 mt-6 text-dim">
            These are arguments for the approach. Deepity&apos;s own results so
            far cover training speed and MNIST accuracy.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <div className="label mb-4">Further reading</div>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-lg">
            {reading.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="link">
                  {r.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/tutorial/0-introduction" className="btn btn--solid">
              Start the tutorials
            </Link>
            <Link to="/about" className="btn">
              About Deepity
            </Link>
          </div>
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
