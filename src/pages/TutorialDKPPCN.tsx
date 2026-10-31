import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import CodeBlock from "../Components/CodeBlock.tsx";
const PythonLogo = "/tutorial-assets/python.png";
const dkpRunImage = "/tutorial-assets/dkppcn-training-run.png";

const dkpCode = `from deepity import DKPPCN
from deepity.layer import Linear, Sigmoid

net = DKPPCN(
    Linear(784, 512),
    Linear(512, 10),
    Sigmoid(),
    batch_size=1000,
)
net.configure(
    learning_rate=0.00373,
    inference_rate=0.15,
    feedback_rate=1e-3,
    lmbda=1e-4,
    optimizer="ADAMW",
    psi_optimizer="ADAMW",
)

INFERENCE_STEPS = 2   # SimplePCN needed 20-30 for the same dataset

for step in range(total_steps):
    # Warmup+cosine for the forward LR, a gentle per-batch decay
    # for the feedback rate -- see Section 3.
    net.set_learning_rate(lr_schedule(step))
    net.set_feedback_rate(fl_schedule(step))
    energy = net.train_step(X_batch, Y_batch, INFERENCE_STEPS)`;

import { btnClass, btnSolidClass } from "../Components/ui.ts";
import { ArrowLeft } from "../Components/ArrowIcons.tsx";

export default function TutorialDKPPCN() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-32 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/4-cnn" nextLink="/tutorial" />
        <TutorialRail current={5} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="Michroma mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 5</div>
          <h1 className="Michroma text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            Direct Kolen-Pollack Networks on MNIST
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            Every network so far has settled by relaying local errors
            layer by layer — the input layer only learns what the output
            layer "thinks" after that signal has propagated through every
            layer in between, one settling step at a time. DKPPCN gives
            every hidden layer a direct, independently learned feedback
            path to the terminal error instead, which changes how many
            settling steps actually matter.
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 Jura text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              1. Why Settling Usually Takes So Many Steps
            </h2>
            <p className="mb-4">
              In every network from Tutorials 2 through 4, a hidden layer
              only learns about the output's error indirectly — the error
              has to relay backward one layer at a time, each settling step
              carrying it one hop further. That's why Tutorial 2's XOR
              network needed 100 settling steps and the MNIST networks
              needed 20-30: with that many layers and that little direct
              signal per step, the information just takes a while to
              arrive.
            </p>
            <p>
              Direct Kolen-Pollack feedback alignment (DKP) changes the
              topology, not the local-learning principle. Alongside the
              ordinary forward weights <code>W</code>, every layer gets its
              own independently learned feedback matrix{" "}
              <code>Psi</code>, wired straight to the terminal layer's
              error — no relay through the layers in between required. A
              hidden layer finds out how it's doing in one hop, not several.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              2. Two Learning Rates, Two Optimizers
            </h2>
            <p className="mb-4">
              <code>W</code> and <code>Psi</code> are both learned, but
              independently — <code>Psi</code> isn't derived from{" "}
              <code>W</code> the way backprop's exact weight transport
              would require, it has its own learning rate (
              <code>feedback_rate</code>) and its own optimizer (
              <code>psi_optimizer</code>), set separately from the forward
              weights' <code>learning_rate</code>/<code>optimizer</code>.
              That's also why <code>DKPPCN</code>'s own docstring calls out
              that <code>inference_steps=1</code> is a reasonable default —
              direct feedback already did most of the work before the
              settling loop even starts.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="mnist_dkppcn.py"
                icon={PythonLogo}
                language="python"
                code={dkpCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 1: The same 784-512-10 MNIST network as earlier
                tutorials, settled in 2 steps instead of 20-30.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              3. A Schedule Borrowed From the Paper
            </h2>
            <p className="mb-4">
              <code>W</code> and <code>Psi</code> aren't just different
              matrices, they settle on different timescales too. The DKP-PC
              paper (Casnici, Lefebvre, Dauwels &amp; Frenkel, "Accelerated
              Predictive Coding Networks via Direct Kolen-Pollack Feedback
              Alignment", arXiv:2602.15571) schedules them separately: the
              forward learning rate gets a short linear warmup into a
              cosine anneal, while the feedback rate gets a much gentler
              exponential decay — applied every <i>batch</i>, not every
              epoch. A flat per-epoch decay applied to both rates, as a
              first pass of this example did, is a meaningfully different
              shape.
            </p>
            <p>
              Adopting the paper's schedule <i>shape</i> here — not its
              literal numbers, which are for a smaller two-hidden-layer
              network at a different batch size — moved this network from
              84.54% to 92.59% test accuracy, at the same 2 settling steps
              per batch. The schedule mattered as much as the architecture
              itself.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              4. Running It
            </h2>
            <p className="mb-4">
              50 epochs, 2 settling steps per batch, full MNIST, no GPU:
              93.20% training-batch accuracy by the last epoch, 92.59% on
              the held-out test set, in 36.3 seconds total. That's below
              the fully tuned dense network's 98.08% from the Benchmarks
              page, but reached with an order of magnitude fewer settling
              steps per batch and roughly half the wall-clock time — the
              tradeoff direct feedback actually buys you.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[700px]">
              <img
                loading="lazy"
                decoding="async"
                src={dkpRunImage}
                alt="DKPPCN training on MNIST, reaching 92.59% test accuracy in 36.3 seconds with only 2 settling steps per batch"
                className="block h-auto w-full border border-white/20"
                height="2560"
                width="4096"
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 2: A real run of examples/mnist_dkppcn.py.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              Where to Go From Here
            </h2>
            <p>
              That's every tutorial in this series: local settling instead
              of global backpropagation (Tutorial 0), the library itself
              (Tutorial 1), a network small enough to reason about by hand
              (Tutorial 2), the knobs that make it tunable (Tutorial 3),
              trading dense layers for spatial weight sharing (Tutorial 4),
              and now trading layer-by-layer settling for direct feedback.
              Each one changes a different part of the same underlying
              rule — minimize local error, settle, update — and the{" "}
              <Link
                to="/benchmarks"
                className="text-[#a99bff] underline underline-offset-4 decoration-[#a99bff]/40 hover:decoration-[#a99bff]"
              >
                Benchmarks page
              </Link>{" "}
              has the fully tuned numbers each of these architectures can
              actually reach.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <Link
              to="/tutorial/4-cnn"
              className={`${btnClass} w-full sm:w-auto`}
            >
              <ArrowLeft />
              Part 4: Running a Convolutional PCN
            </Link>
            <Link
              to="/tutorial"
              className={`${btnSolidClass} w-full sm:w-auto`}
            >
              All Tutorials Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
