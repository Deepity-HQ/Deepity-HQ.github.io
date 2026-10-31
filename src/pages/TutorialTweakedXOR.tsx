import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import CodeBlock from "../Components/CodeBlock.tsx";
const PythonLogo = "/tutorial-assets/python.png";
const tweakedRunImage = "/tutorial-assets/xor-tweaked-training-run.png";

const tweakedCode = `import deepity as pd
import numpy as np

X = np.array([[1, 1], [1, -1], [-1, 1], [-1, -1]], dtype=np.float32)
Y = np.array([[-1], [1], [1], [-1]], dtype=np.float32)

SETTLING_STEPS = 100

pcn = pd.SequentialPCN(
    pd.layer.Linear(2, 8),
    pd.layer.TanH(),
    pd.layer.Linear(8, 1),
    pd.layer.TanH(),
    batch_size=4,
)

pcn.configure(
    learning_rate=0.1,
    inference_rate=0.15,
    precision_rate=0.002,
    lmbda=1e-4,
    optimizer="SGD",
)

pcn.randomize_weights(seed=42, distribution="normal")

for epoch in range(1500):
    pcn.train_step(X, Y, SETTLING_STEPS)

preds = pcn.predict(X, SETTLING_STEPS)`;

const decayCode = `# W *= (1 - lmbda), once per epoch, inside UpdateWeights() --
# NOT scaled by epoch count, so it compounds over a full run:

(1 - 1e-3) ** 1500   # -> 0.22  (weights crushed to 22% of scale)
(1 - 1e-4) ** 1500   # -> 0.86  (a mild, still-present 14% shrink)`;

const precisionCode = `# Once per epoch, inside update_precision() (CPUBackend::
# UpdatePrecisionFromError), for every unit independently:

grad = 0.5 * (p * err**2 - 1)   # averaged over the batch
log_p -= precision_rate * grad
log_p = clamp(log_p, -5, 5)     # hard floor/ceiling
p = exp(log_p)`;

import { btnClass, btnSolidClass } from "../Components/ui.ts";
import { ArrowLeft, ArrowRight } from "../Components/ArrowIcons.tsx";

export default function TutorialTweakedXOR() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-32 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/2-xor" nextLink="/tutorial/4-cnn" />
        <TutorialRail current={3} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="Michroma mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 3</div>
          <h1 className="Michroma text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            Adding Helpful Hyperparameters
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            SimplePCN gives every unit equal say and no weight decay.
            Switching the same XOR problem over to SequentialPCN unlocks two
            more knobs — weight decay and per-unit precision weighting —
            and gives you direct control over both from configure().
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 Jura text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              1. From SimplePCN to SequentialPCN
            </h2>
            <p className="mb-4">
              The architecture declaration looks identical to Tutorial 2's —
              same <code>Linear</code>/<code>TanH</code> layers, same{" "}
              <code>batch_size=4</code>. What changes is the layer type
              underneath: <code>SequentialPCN</code> builds its network out
              of <code>DiscriminativePCLayer</code> instead of{" "}
              <code>SimplePCLayer</code>, and its <code>configure()</code>{" "}
              accepts two parameters <code>SimplePCN.configure()</code>{" "}
              doesn't have: <code>precision_rate</code> and a meaningful,
              non-zero <code>lmbda</code>.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="xor_tweaked.py"
                icon={PythonLogo}
                language="python"
                code={tweakedCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 1: The same XOR problem, trained with SequentialPCN.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              2. lmbda: Weight Decay That Compounds
            </h2>
            <p className="mb-4">
              <code>lmbda</code> applies ordinary L2 weight decay — every
              weight is scaled by <code>(1 - lmbda)</code> — but it happens
              once per epoch, not once total, so it compounds across a full
              run. On a short run that looks harmless; across 1500 epochs it
              is not.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center mb-6">
              <CodeBlock
                title="What lmbda actually does over 1500 epochs"
                language="python"
                code={decayCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 2: The library's 1e-2 default, scaled down, still
                compounds hard.
              </p>
            </div>
            <p>
              With a training set this small — four rows, full batch, no
              noise to average out — too much decay can out-compete the
              gradient signal entirely and pull the network back toward a
              symmetric, XOR-incapable solution. <code>1e-4</code> is a full
              order of magnitude below the library's own <code>1e-2</code>{" "}
              default, and still only lets weights settle to about 86% of
              their undecayed scale by the end of training: enough to act
              as real regularization, not enough to erase what the network
              is trying to learn.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              3. precision_rate: Learning Who to Trust
            </h2>
            <p className="mb-4">
              Every <code>DiscriminativePCLayer</code> carries a precision{" "}
              <code>p</code> per unit, initialized to 1, which rescales that
              unit's prediction error before it does anything else:{" "}
              <code>e_weighted = p · (z - mu)</code>. A unit whose error
              stays small and consistent earns a higher precision, so its
              error counts for more; a unit whose error stays large or
              unreliable gets down-weighted, so it stops dominating the
              feedback sent to the layer below it. <code>precision_rate</code>{" "}
              is how fast that trust estimate is allowed to move.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center mb-6">
              <CodeBlock
                title="The actual update, once per epoch"
                language="python"
                code={precisionCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 3: Precision tracks 1/error² in log-space, hard-clamped
                at both ends.
              </p>
            </div>
            <p>
              That clamp matters here: with only one output unit, its error
              can legitimately stay largeish for a while early in training —
              it hasn't learned XOR yet. Push{" "}
              <code>precision_rate</code> too high and that single unit's
              precision gets driven straight into its floor and pinned
              there, which collapses the feedback it sends to the hidden
              layer to almost nothing — starving the one signal the network
              needs to ever separate the two XOR-true cases.{" "}
              <code>0.002</code>, well under the library's{" "}
              <code>0.01</code> default, keeps that floor comfortably out of
              reach for a run this length.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              4. Running It
            </h2>
            <p className="mb-4">
              Same architecture, same inputs, same 1500-epoch budget as
              Tutorial 2 — only the layer type and these two extra knobs
              changed. The predictions below land with real margin, not
              just the correct sign, and the whole run finished in about
              half the time: <code>0.31s</code> here against Tutorial 2's{" "}
              <code>0.63s</code> on the same machine, same settling-step
              count.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[700px]">
              <img
                loading="lazy"
                decoding="async"
                src={tweakedRunImage}
                alt="SequentialPCN training on XOR with weight decay and precision weighting, confident correctly-signed predictions"
                className="block h-auto w-full border border-white/20"
                height="493"
                width="1137"
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 4: A real run of examples/xor_tweaked.py — every
                prediction within about 0.06 of its target's sign and
                magnitude.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <Link
              to="/tutorial/2-xor"
              className={`${btnClass} w-full sm:w-auto`}
            >
              <ArrowLeft />
              Part 2: Training on XOR
            </Link>
            <Link
              to="/tutorial/4-cnn"
              className={`${btnSolidClass} w-full sm:w-auto`}
            >
              Part 4: Running a Convolutional PCN
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
