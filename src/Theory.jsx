import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import Reveal from "./components/Reveal";
import PCStepper from "./components/PCStepper";
import useDocumentTitle from "./lib/useDocumentTitle";

const PCNRepresentation = lazy(() => import("./components/PCNRepresentation"));

const reading = [
  {
    title: "Introduction to Predictive Coding Networks for Machine Learning (Stenlund, 2025)",
    href: "https://arxiv.org/pdf/2506.06332",
  },
  { title: "Predictive coding (Wikipedia)", href: "https://en.wikipedia.org/wiki/Predictive_coding" },
];

export default function Theory() {
  useDocumentTitle("Theory");

  return (
    <div>
      <PageHeader label="Theory" title="How predictive coding works">
        A short tour of the idea behind Deepity. The tutorials go through it
        step by step.
      </PageHeader>

      <div className="mx-auto max-w-[1000px] px-5 pb-24 md:px-8">
        <Reveal className="glass p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Local errors instead of backpropagation
          </h2>
          <p className="mt-5 text-lg text-dim">
Backpropagation sends one error signal backward through the whole
            network. Predictive coding doesn&apos;t. Each layer works from its
            own local error, in the three steps below.
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
            Why it has been slow
          </h2>
          <p className="mt-5 text-lg text-dim">
            Predicting and correcting is an iterative process. Each input needs
            many settling steps before the weights can be updated, which is why
            predictive coding has historically been much slower than
            backpropagation.
          </p>
          <p className="mb-0 mt-4 text-lg text-dim">
            Deepity speeds this up with a C++ core, a Python interface and
            SIMD loops tuned for the CPU.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="label mb-4 text-center">Further reading</div>
          <ul className="m-0 flex list-none flex-col items-center gap-3 p-0 text-lg">
            {reading.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="link">
                  {r.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
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
