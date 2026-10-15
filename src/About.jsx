import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import ArchDiagram from "./components/ArchDiagram";
import Reveal from "./components/Reveal";
import useDocumentTitle from "./lib/useDocumentTitle";
import { DEVELOPER_URL, GITHUB_URL } from "./config";

const facts = [
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
    text: "Doxygen reference docs and a Google Benchmark suite. GitHub Actions builds the library on Linux and Windows and type-checks the Python package on every push.",
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
  useDocumentTitle("About");

  return (
    <div>
      <PageHeader label="About" title="About Deepity" icon="/brand/mark-color.svg">
        Deepity is an open-source library for training Predictive Coding
        Networks from C++ and Python. It is built and maintained by one
        developer.
      </PageHeader>
      <div className="mx-auto max-w-[1000px] px-5 pb-16 md:px-8">
        <Reveal className="glass p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            What it is
          </h2>
          <p className="mt-5 text-lg text-dim">
            Predictive coding is a way of training neural networks that is
            inspired by how the brain learns. It has been slow to run, so few
            people use it. Deepity makes it fast, starting on ordinary CPUs.
          </p>
          <Link to="/theory" className="link mt-2 inline-block text-lg">
            Read the theory
          </Link>
        </Reveal>

        <Reveal className="glass mt-4 p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Why I&apos;m building it
          </h2>
          <p className="mt-5 text-lg text-dim">
            Building intelligence isn&apos;t a pipe dream. We know it&apos;s
            possible because we are the proof. People learn from far fewer
            examples than any neural network, on roughly the power of a dim
            light bulb. Even animals with tiny brains, like flies, learn things
            a data center full of GPUs still struggles with.
          </p>
          <p className="mb-0 mt-4 text-lg text-dim">
            I wanted to know what the brain does differently. Getting close
            takes changes to both the algorithm and the hardware: predictive
            coding for the algorithm, and an engine built for it from scratch
            for the hardware.
          </p>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {facts.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 100} className="glass p-8">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em]">
                {f.title}
              </h3>
              <p className="mb-0 mt-3 text-lg text-dim">{f.text}</p>
            </Reveal>
          ))}
        </div>

        <ArchDiagram />

        <Reveal className="glass mt-4 p-8 md:p-12">
          <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
            Who builds it
          </h2>
          <p className="mt-5 text-lg text-dim">
            Deepity is made and maintained by{" "}
            <a
              href={DEVELOPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Ra4ster
            </a>
            , a single developer. It is moving from a personal project toward a
            company. If you want to use it in a product or a research project,{" "}
            <Link to="/early-access" className="link">
              request early access
            </Link>{" "}
            and tell us what you are building.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <div className="label mb-4 text-center">Follow the project</div>
          <ul className="m-0 flex list-none flex-wrap justify-center gap-x-8 gap-y-3 p-0 text-lg">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.internal
                    ? {}
                    : { target: "_blank", rel: "noopener noreferrer" })}
                  className="link"
                >
                  {l.label}
                  {l.internal ? "" : " ↗"}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <MainFooter />
    </div>
  );
}
