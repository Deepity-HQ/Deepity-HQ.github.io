import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import CodeBlock from "../Components/CodeBlock.tsx";
const PythonLogo = "/tutorial-assets/python.png";
const xorRunImage = "/tutorial-assets/xor-training-run.png";

const xorCode = `import deepity as pd
import numpy as np

X = np.array([[1, 1], [1, -1], [-1, 1], [-1, -1]], dtype=np.float32)
Y = np.array([[-1], [1], [1], [-1]], dtype=np.float32)

SETTLING_STEPS = 100

pcn = pd.SimplePCN(
    pd.layer.Linear(2, 8),
    pd.layer.TanH(),
    pd.layer.Linear(8, 1),
    pd.layer.TanH(),
    batch_size=4
)

pcn.configure(
    learning_rate=0.1,
    inference_rate=0.15,
    lmbda=0.0,
    optimizer="SGD",
    seed=42
)

for epoch in range(1500):
    pcn.train_step(X, Y, SETTLING_STEPS)

preds = pcn.predict(X, SETTLING_STEPS)`;

const settleCode = `# What train_step(X, Y, steps) does internally, every call:
pcn.reset_state()       # every layer's belief z -> 0
pcn.clamp_input(X)      # input layer's z fixed to X
pcn[-1].clamp_state(Y)  # output layer's z fixed to Y

for _ in range(steps):
    pcn.calculate_state(True)  # local error at every layer
    pcn.update_state()         # hidden z nudged to reduce it

pcn.update_weights()     # W updated from the now-settled z's
pcn[-1].unclamp_state()`;

import { btnClass, btnSolidClass } from "../Components/ui.ts";
import { ArrowLeft, ArrowRight } from "../Components/ArrowIcons.tsx";

export default function TutorialTrainingXOR() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-32 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/1-beginning" nextLink="/tutorial/3-tweaked-xor" />
        <TutorialRail current={2} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="Michroma mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 2</div>
          <h1 className="Michroma text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            Training a SimplePCN on XOR
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            XOR is the smallest problem a single linear layer cannot solve,
            which makes it the standard first test for any new learning
            architecture. Here we build a tiny Deepity network that learns
            it, and look at why the settling dynamics behind it actually
            converge.
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 Jura text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              1. Why XOR Needs a Hidden Layer
            </h2>
            <p className="mb-4">
              XOR outputs true when its two inputs disagree. Plotted as
              points, the two "true" cases sit on opposite corners from the
              two "false" cases — no single straight line can separate them.
              A network with no hidden layer (just inputs wired directly to
              an output) can only draw one straight decision boundary, so it
              is structurally incapable of representing XOR, regardless of
              how it is trained.
            </p>
            <div className="my-6 overflow-x-auto">
              <table className="w-full max-w-md mx-auto border-collapse text-center Jura">
                <thead>
                  <tr className="border-b border-white/20 text-white/60 text-sm uppercase tracking-wider">
                    <th className="py-2 px-4 Michroma text-xs">A</th>
                    <th className="py-2 px-4 Michroma text-xs">B</th>
                    <th className="py-2 px-4 Michroma text-xs">A XOR B</th>
                  </tr>
                </thead>
                <tbody className="text-white/80">
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4">1</td>
                    <td className="py-2 px-4">1</td>
                    <td className="py-2 px-4">-1</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4">1</td>
                    <td className="py-2 px-4">-1</td>
                    <td className="py-2 px-4">1</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-2 px-4">-1</td>
                    <td className="py-2 px-4">1</td>
                    <td className="py-2 px-4">1</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">-1</td>
                    <td className="py-2 px-4">-1</td>
                    <td className="py-2 px-4">-1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A hidden layer fixes this by letting the network combine
              several linear boundaries into one non-linear one. Two hidden
              units, each drawing their own line, are enough in principle;
              the example below uses eight for a comfortable margin and
              faster settling.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              2. Building the Network
            </h2>
            <p className="mb-4">
              Inputs and targets are encoded as <code>+1</code>/<code>-1</code>,
              not the more common <code>0</code>/<code>1</code>. That pairs
              naturally with <code>TanH</code>: its output range is already{" "}
              <code>[-1, 1]</code> and centered on zero, so the network's
              beliefs don't need to carry an asymmetric bias toward one
              class the way a <code>[0, 1]</code>-ranged activation like
              Sigmoid would.
            </p>
            <p className="mb-6">
              The architecture itself is small on purpose: 2 inputs, one
              8-unit hidden layer, 1 output, with the whole 4-row dataset
              trained as a single batch (<code>batch_size=4</code>). There's
              nothing to shuffle or split into minibatches at this scale —
              every one of the 1500 epochs below sees all four XOR rows at
              once.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="xor.py"
                icon={PythonLogo}
                language="python"
                code={xorCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 1: The complete XOR example, from examples/xor.py.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              3. Why Settling Converges
            </h2>
            <p className="mb-4">
              <code>train_step</code> does not run a forward pass and then
              backpropagate a gradient through it. Every layer's belief{" "}
              <code>z</code> starts at zero, the input and target layers are
              clamped, and the hidden layer's belief is then nudged, one
              small step at a time, toward whatever reduces its own local
              disagreement with the layer above and below it. Only after{" "}
              <code>steps</code> rounds of that local settling does a single
              weight update happen, from wherever the beliefs landed.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center mb-6">
              <CodeBlock
                title="What train_step() actually runs"
                language="python"
                code={settleCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 2: The settling loop underneath train_step().
              </p>
            </div>
            <p>
              100 settling steps is deep for a network this small, and
              that's deliberate: unlike the MNIST tutorial, this example
              uses plain <code>train_step</code> rather than{" "}
              <code>train_step_with_projection</code>, so the hidden layer
              gets no forward-pass head start — it has to find a useful
              representation purely by settling from zero every single
              call. With only four training rows and eight hidden units,
              the extra steps cost almost nothing (the full 1500-epoch run
              finishes in well under a second) and remove a moving part
              from the explanation.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              4. Running It
            </h2>
            <p className="mb-4">
              After 1500 epochs, running the four inputs back through{" "}
              <code>predict</code> gives a settled belief for each one. The
              network was never told the XOR rule directly — only shown
              input/target pairs and left to settle its own hidden
              representation around them — so a prediction landing on the
              correct side of zero for every row is the actual success
              condition here, not an exact match to <code>+1</code>/
              <code>-1</code>.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[700px]">
              <img
                loading="lazy"
                decoding="async"
                src={xorRunImage}
                alt="Deepity training a SimplePCN on XOR, final predictions matching their targets' sign"
                className="block h-auto w-full border border-white/20"
                height="484"
                width="1143"
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 3: A real run of examples/xor.py — every prediction's
                sign matches its target, including the two disagreeing-input
                rows a linear model can't get right.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <Link
              to="/tutorial/1-beginning"
              className={`${btnClass} w-full sm:w-auto`}
            >
              <ArrowLeft />
              Part 1: Understanding Deepity
            </Link>
            <Link
              to="/tutorial/3-tweaked-xor"
              className={`${btnSolidClass} w-full sm:w-auto`}
            >
              Part 3: Adding Hyperparameters
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
