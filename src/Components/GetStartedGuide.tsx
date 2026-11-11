import CopyButton from "./CopyButton.tsx";
import { openDocsChooser } from "../docsChooser.ts";
import ButtonPrimary from "./ButtonPrimary.tsx";
import ButtonSecondary from "./ButtonSecondary.tsx";
import { ArrowRight } from "./ArrowIcons.tsx";
import Reveal from "./Reveal.tsx";
import { Link } from "react-router";
import { GITHUB_URL } from "../config.ts";
import { tutorialsData } from "../tutorialsData.ts";

const INSTALL = "pip install pydeepity";

const linkClass =
  "text-white underline underline-offset-4 decoration-white/30 hover:decoration-white";

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="relative grid gap-4 border-t border-white/10 py-10 md:grid-cols-[88px_1fr] md:gap-8 md:py-12">
      <div className="mono text-sm tracking-[0.1em] text-[#a99bff]">
        {String(n).padStart(2, "0")}
      </div>
      <div className="min-w-0">
        <h3 className="m-0 text-xl font-semibold tracking-[-0.02em] text-white md:text-2xl">
          {title}
        </h3>
        <div className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
          {children}
        </div>
      </div>
    </Reveal>
  );
}

function Row({ to, title, text }: { to: string; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="card-interactive group flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 no-underline"
    >
      <span className="min-w-0">
        <span className="block text-base font-medium text-white">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-white/50">{text}</span>
      </span>
      <ArrowRight className="mt-1 shrink-0 text-[#a99bff] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

export default function GetStartedGuide() {
  const [intro, library, xor, ...more] = tutorialsData;

  return (
    <section id="get-started" className="scroll-mt-24">
      <h2 className="font-display m-0 text-2xl font-normal tracking-[-0.02em] text-white md:text-3xl">
        Get started
      </h2>
      <p className="mb-0 mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
        Install the package, then work through the tutorials in order.
      </p>
      <div className="mt-8">
        <Step n={1} title="Install the package">
          <p className="m-0">
            Prebuilt wheels are available for Linux and Windows on Python 3.11
            to 3.13, including CUDA wheels for NVIDIA GPUs.
          </p>
          <div className="mono mt-5 flex w-fit max-w-full items-center justify-between gap-4 rounded-lg border border-white/15 bg-black/70 py-1.5 pl-4 pr-1.5 text-sm text-white">
            <span className="select-all">
              <span className="text-[#a99bff]">$ </span>
              {INSTALL}
            </span>
            <CopyButton code={INSTALL} label="install command" />
          </div>
          <p className="mb-0 mt-4 text-sm text-white/45">
            To build from source, follow the instructions in the{" "}
            <a className={linkClass} href={GITHUB_URL}>
              repository
            </a>
            .
          </p>
        </Step>

        <Step n={2} title="Learn the idea">
          <p className="m-0">
            Start with the introduction if predictive coding is new to you. The
            theory page covers the equations.
          </p>
          <div className="mt-6 grid gap-3">
            <Row to={intro.link} title={intro.title} text={intro.description} />
            <Row
              to="/theory"
              title="How predictive coding works"
              text="Local errors, the three steps each layer repeats, and how the cost compares with backpropagation."
            />
          </div>
        </Step>

        <Step n={3} title="Train your first network">
          <p className="m-0">
            Load the library, then train a small network on XOR.
          </p>
          <div className="mt-6 grid gap-3">
            <Row to={library.link} title={library.title} text={library.description} />
            <Row to={xor.link} title={xor.title} text={xor.description} />
          </div>
        </Step>

        <Step n={4} title="Continue with the other tutorials">
          <p className="m-0">
            These cover hyperparameters, convolutional networks, Direct
            Kolen-Pollack networks, and deeper models.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {more.map((t) => (
              <Row key={t.link} to={t.link} title={t.title} text={t.description} />
            ))}
          </div>
        </Step>

        <Step n={5} title="Reference">
          <p className="m-0">
            API documentation, benchmarks, and the issue tracker.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonPrimary onClick={openDocsChooser}>API documentation</ButtonPrimary>
            <ButtonSecondary to="/benchmarks">Benchmarks</ButtonSecondary>
            <ButtonSecondary href={`${GITHUB_URL}/issues`}>Report an issue</ButtonSecondary>
          </div>
        </Step>
      </div>
    </section>
  );
}
