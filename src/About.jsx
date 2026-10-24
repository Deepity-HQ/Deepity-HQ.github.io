import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import ArchDiagram from "./components/ArchDiagram";
import Reveal from "./components/Reveal";
import { DEVELOPER_URL, GITHUB_URL } from "./config";

const facts = [
  {
    title: "No framework underneath",
    text: "Deepity is written in C++ and CUDA and depends on no deep learning framework. Python access goes through nanobind.",
  },
  {
    title: "CPU and GPU",
    text: "The CUDA backend is built on cuBLAS, with optional CUTLASS kernels, and is in active development. It has been tested on the Ohio Supercomputer Center and Vast.ai.",
  },
  {
    title: "Documented and tested",
    text: "Reference docs are generated with Doxygen, and a Google Benchmark suite covers performance.",
  },
  {
    title: "MIT licensed",
    text: "Free to use, modify and ship. The source is on GitHub.",
  },
];

const links = [
  { label: "Source code", href: GITHUB_URL },
  { label: "Releases and changelog", href: `${GITHUB_URL}/releases` },
  { label: "Issues", href: `${GITHUB_URL}/issues` },
  { label: "Documentation", href: "/docs/index.html", internal: true },
];

export default function About() {

  return (
    <div>
      <PageHeader
        title="About Deepity"
        eyebrow="Overview"
        icon="/brand/mark-color.svg"
      >
        Deepity is an open-source library for training Predictive Coding
        Networks from C++ and Python. It is built and maintained by one
        developer.
      </PageHeader>
      <div className="mx-auto max-w-[1000px] px-5 pb-16 md:px-8">
        <Reveal className="glass relative overflow-hidden p-8 md:p-12">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent to-cool" />
          <div className="label mb-3 text-accent-text">Core Concept</div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            What it is
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-dim">
            Predictive coding is a way of training neural networks that is
            inspired by how the brain learns. It has been slow to run, so few
            people use it. Deepity makes it fast, starting on ordinary CPUs.
          </p>
          <div className="mt-6">
            <Link to="/theory" className="btn text-sm">
              Read the theory →
            </Link>
          </div>
        </Reveal>

        <Reveal className="glass mt-6 relative overflow-hidden p-8 md:p-12">
          <div className="label mb-3">Motivation</div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Why I&apos;m building it
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-dim">
            Building intelligence isn&apos;t a pipe dream. We know it&apos;s
            possible because we are the proof. People learn from far fewer
            examples than any neural network, on roughly the power of a dim
            light bulb. Even animals with tiny brains, like flies, learn things
            a data center full of GPUs still struggles with.
          </p>
          <p className="mb-0 mt-4 text-lg leading-relaxed text-dim">
            I wanted to know what the brain does differently. Getting close
            takes changes to both the algorithm and the hardware: predictive
            coding for the algorithm, and an engine built for it from scratch
            for the hardware.
          </p>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {facts.map((f, i) => (
            <Reveal
              key={f.title}
              delay={(i % 2) * 100}
              className="glass card-interactive relative overflow-hidden p-8 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-[family-name:var(--font-display)] text-xs font-semibold text-accent-text tracking-wider">
                  0{i + 1}
                </span>
                {i === 0 && (
                  <svg className="h-4 w-4 text-dim transition-colors group-hover:text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                )}
                {i === 1 && (
                  <svg className="h-4 w-4 text-dim transition-colors group-hover:text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                  </svg>
                )}
                {i === 2 && (
                  <svg className="h-4 w-4 text-dim transition-colors group-hover:text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                )}
                {i === 3 && (
                  <svg className="h-4 w-4 text-dim transition-colors group-hover:text-accent-text" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                )}
              </div>
              <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em]">
                {f.title}
              </h3>
              <p className="mb-0 mt-3 text-base leading-relaxed text-dim">{f.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-6">
          <ArchDiagram />
        </div>

        <Reveal className="glass mt-6 p-8 md:p-12">
          <div className="label mb-3">The Project</div>
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Who builds it
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-dim">
            Deepity is made and maintained by{" "}
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link font-medium text-fg"
            >
              Ra4ster
            </a>
            , a single developer. It is moving from a personal project toward a
            company. If you want to use it in a product or a research project,{" "}
            <Link to="/early-access" className="link font-medium text-fg">
              request early access
            </Link>{" "}
            and tell us what you are building.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/early-access" className="btn btn--solid">
              Request early access
            </Link>
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Developer Profile ↗
            </a>
          </div>
        </Reveal>

        <Reveal className="glass card-interactive mt-6 p-8 md:p-10 text-center">
          <div className="label mb-3">Connect & Contribute</div>
          <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl md:text-3xl">
            Follow the project
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-base text-dim">
            Track releases, view source code, report issues, and read the reference documentation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.internal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-fg/[0.04] px-4 py-2 text-sm text-dim transition-colors hover:border-accent hover:text-fg hover:bg-fg/[0.08]"
              >
                <span>{l.label}</span>
                <span className="text-xs text-faint">{l.internal ? "→" : "↗"}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
