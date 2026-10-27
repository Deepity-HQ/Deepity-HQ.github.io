import { lazy, Suspense } from "react";
import { Link } from "react-router";
import PageHeader from "../Components/PageHeader.tsx";
import Reveal from "../Components/Reveal.tsx";
import PCStepper from "../Components/PCStepper.tsx";
import {
  bodyClass,
  btnClass,
  btnSolidClass,
  glassClass,
  labelClass,
} from "../Components/ui.ts";

const PCNRepresentation = lazy(() => import("../Components/PCNRepresentation.tsx"));

const reading = [
  {
    title: "Introduction to Predictive Coding Networks for Machine Learning (Stenlund, 2025)",
    href: "https://arxiv.org/pdf/2506.06332",
  },
  {
    title: "Accelerated Predictive Coding Networks via Direct Kolen–Pollack Feedback Alignment",
    href: "https://arxiv.org/html/2602.15571v2",
  },
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
      <PageHeader
        title="How predictive coding works"
        eyebrow="Core Concepts & Math"
      >
        The idea behind Deepity and the equations it implements. The tutorials
        cover the same ground in more detail.
      </PageHeader>

      <div className="mx-auto max-w-[1000px] px-5 pb-16 md:px-8">
        <Reveal className={`${glassClass} p-8 md:p-12`}>
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#8b7cff] to-[#7dd3fc]" />
          <div className={`${labelClass} mb-3 !text-[#a99bff]`}>Architecture</div>
          <h2 className="Michroma m-0 text-2xl tracking-[-0.02em] md:text-3xl font-normal text-white">
            Learning from local errors
          </h2>
          <p className={`${bodyClass} mt-5 text-lg`}>
            Backpropagation sends one error signal backward through the whole
            network. In predictive coding, each layer works from its own local
            error, in the three steps below.
          </p>
          <p className={`${bodyClass} mb-0 mt-4 text-lg`}>
            The approach is inspired by the brain&apos;s predictive coding
            theory: the brain keeps generating predictions about incoming
            signals and corrects its internal model from the errors.
          </p>
        </Reveal>

        <Reveal className="mt-6">
          <PCStepper />
        </Reveal>

        <Reveal className="mt-6">
          <Suspense fallback={<div className="h-48 rounded-2xl border border-white/10 bg-[#0c0c0d]" />}>
            <PCNRepresentation />
          </Suspense>
        </Reveal>

        <Reveal className={`${glassClass} mt-6 p-8 md:p-12`}>
          <div className={`${labelClass} mb-3`}>Complexity Analysis</div>
          <h2 className="Michroma m-0 text-2xl tracking-[-0.02em] md:text-3xl font-normal text-white">
            Where the cost comes from
          </h2>
          <p className={`${bodyClass} mt-5 text-lg`}>
            Backpropagation sends the error back through the network in one
            sweep, so it takes a number of steps proportional to the depth L.
            Predictive coding has no sweep. Each layer only sees its
            neighbors, so the error moves one layer per settling step, and
            every input needs M of those steps over all L layers before the
            weights can be updated.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-[#141415]/40">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm md:text-base">
              <thead>
                <tr className={`${labelClass} border-b border-white/10 bg-white/[0.02]`}>
                  <th className="px-5 py-3.5 text-xs font-normal">Method</th>
                  <th className="px-5 py-3.5 text-xs font-normal">Hops for the error to reach a layer</th>
                  <th className="px-5 py-3.5 text-xs font-normal">Layer updates per example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {costs.map((c) => {
                  const isDkp = c.method.includes("Kolen");
                  return (
                    <tr
                      key={c.method}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="Jura px-5 py-3.5 font-medium text-white">
                        {c.method}
                      </td>
                      <td
                        className={`Michroma px-5 py-3.5 text-xs ${
                          isDkp ? "text-[#a99bff]" : "text-white/70"
                        }`}
                      >
                        {c.hops}
                      </td>
                      <td
                        className={`Michroma px-5 py-3.5 text-xs ${
                          isDkp ? "text-[#a99bff]" : "text-white/70"
                        }`}
                      >
                        {c.work}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className={`${bodyClass} mb-0 mt-6 text-base`}>
            Direct Kolen-Pollack feedback sends the output error straight to
            every layer through learned feedback weights, so it arrives in one
            hop and M can drop to 1 or 2. That is the main reason it trains
            faster, and it costs some accuracy: on our MNIST runs it reached
            95.97% against 98.22% for standard settling.
          </p>
          <p className={`${bodyClass} mb-0 mt-4 text-base`}>
            These are operation counts, not wall-clock time. Deepity works on
            the constant factors with a C++ core, SIMD kernels on the CPU and a
            CUDA backend for NVIDIA GPUs.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className={`${labelClass} mb-3`}>Key Advantages</div>
          <h2 className="Michroma m-0 text-2xl tracking-[-0.02em] md:text-3xl font-normal text-white">
            What it offers
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {offers.map((o, i) => (
              <div
                key={o.title}
                className={`${glassClass} card-interactive group flex flex-col justify-between p-6 md:p-8`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="Michroma text-xs text-[#a99bff]">
                      0{i + 1}
                    </span>
                    {i === 0 && (
                      <svg className="h-4 w-4 text-white/70 transition-colors group-hover:text-[#a99bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <path d="M10 6.5h4a2 2 0 0 1 2 2v5.5" />
                      </svg>
                    )}
                    {i === 1 && (
                      <svg className="h-4 w-4 text-white/70 transition-colors group-hover:text-[#a99bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="4" y1="6" x2="20" y2="6" />
                        <line x1="4" y1="12" x2="20" y2="12" />
                        <line x1="4" y1="18" x2="20" y2="18" />
                      </svg>
                    )}
                    {i === 2 && (
                      <svg className="h-4 w-4 text-white/70 transition-colors group-hover:text-[#a99bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                    )}
                    {i === 3 && (
                      <svg className="h-4 w-4 text-white/70 transition-colors group-hover:text-[#a99bff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    )}
                  </div>
                  <h3 className="Michroma m-0 text-lg md:text-xl font-normal text-white">
                    {o.title}
                  </h3>
                  <p className={`${bodyClass} mb-0 mt-3 text-sm md:text-base`}>
                    {o.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="Jura mb-0 mt-4 text-sm text-white/50">
            These are arguments for the approach. Deepity&apos;s own results so
            far cover training speed and MNIST accuracy.
          </p>
        </Reveal>

        <Reveal className={`${glassClass} card-interactive mt-12 p-8 md:p-10`}>
          <div className={`${labelClass} mb-3`}>Literature & Resources</div>
          <h3 className="Michroma m-0 text-xl md:text-2xl font-normal text-white">
            Further reading
          </h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {reading.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group card-interactive flex items-center justify-between rounded-xl border border-white/10 bg-[#0e0e0f] p-4 no-underline"
              >
                <span className="Jura text-sm font-medium text-white group-hover:text-[#a99bff] transition-colors">
                  {r.title}
                </span>
                <span className="text-white/70 group-hover:text-[#a99bff] transition-colors text-base ml-2">
                  ↗
                </span>
              </a>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tutorial/0-introduction" className={btnSolidClass}>
              Start the tutorials
            </Link>
            <Link to="/about" className={btnClass}>
              About Deepity →
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
