import { Link } from "react-router";
import PageHeader from "../Components/PageHeader.tsx";
import ArchDiagram from "../Components/ArchDiagram.tsx";
import { DEVELOPER_URL, GITHUB_URL } from "../config.ts";
import {
  bodyClass,
  btnClass,
  btnSolidClass,
  headingClass,
  linkClass,
} from "../Components/ui.ts";
import { ArrowRight, ArrowUpRight } from "../Components/ArrowIcons.tsx";

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
  { label: "Source code", href: GITHUB_URL, internal: false },
  { label: "Releases and changelog", href: `${GITHUB_URL}/releases`, internal: false },
  { label: "Issues", href: `${GITHUB_URL}/issues`, internal: false },
  { label: "Documentation", href: "/docs/index.html", internal: true },
];

export default function About() {
  return (
    <div>
      <PageHeader
        title="About Deepity"
      >
        Deepity is an open-source library for training Predictive Coding
        Networks from C++ and Python. It is built and maintained by one
        developer.
      </PageHeader>
      <div className="mx-auto max-w-[1000px] px-5 pb-16 md:px-8">
        <div className={`pt-2`}>
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#8b7cff] to-[#7dd3fc]" />
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>What it is</h2>
          <p className={`${bodyClass} mt-5 text-lg`}>
            Predictive coding is a way of training neural networks that is
            inspired by how the brain learns. It has been slow to run, so few
            people use it. Deepity makes it fast, starting on ordinary CPUs.
          </p>
          <div className="mt-6">
            <Link to="/theory" className={btnClass}>
              Read the theory
              <ArrowRight />
            </Link>
          </div>
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10`}>
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>
            Why I&apos;m building it
          </h2>
          <p className={`${bodyClass} mt-5 text-lg`}>
            Building intelligence isn&apos;t a pipe dream. We know it&apos;s
            possible because we are the proof. People learn from far fewer
            examples than any neural network, on roughly the power of a dim
            light bulb. Even animals with tiny brains, like flies, learn things
            a data center full of GPUs still struggles with.
          </p>
          <p className={`${bodyClass} mb-0 mt-4 text-lg`}>
            I wanted to know what the brain does differently. Getting close
            takes changes to both the algorithm and the hardware: predictive
            coding for the algorithm, and an engine built for it from scratch
            for the hardware.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {facts.map((f) => (
            <div
              key={f.title}
              className={`border-t border-white/15 pt-5`}
            >
              <h3 className={`${headingClass} text-xl`}>{f.title}</h3>
              <p className={`${bodyClass} mb-0 mt-3 text-base`}>{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <ArchDiagram />
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10`}>
          <h2 className={`${headingClass} text-2xl md:text-3xl`}>Who builds it</h2>
          <p className={`${bodyClass} mt-5 text-lg`}>
            Deepity is made and maintained by{" "}
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} font-medium`}
            >
              Ra4ster
            </a>
            , a single developer. It is moving from a personal project toward a
            company. If you want to use it in a product or a research project,{" "}
            <Link to="/early-access" className={`${linkClass} font-medium`}>
              request early access
            </Link>{" "}
            and tell us what you are building.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/early-access" className={btnSolidClass}>
              Request early access
            </Link>
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={btnClass}
            >
              Developer Profile
              <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className={`mt-14 border-t border-white/10 pt-10 text-center`}>
          <h3 className={`${headingClass} text-xl md:text-2xl`}>Follow the project</h3>
          <p className="Jura mx-auto mt-3 max-w-lg text-base text-white/75">
            Track releases, view source code, report issues, and read the
            reference documentation.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.internal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="Jura inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 no-underline transition-colors hover:border-[#8b7cff] hover:bg-white/[0.08] hover:text-white"
              >
                <span>{l.label}</span>
                {l.internal ? (
                  <ArrowRight className="text-white/50" />
                ) : (
                  <ArrowUpRight className="text-white/50" />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
