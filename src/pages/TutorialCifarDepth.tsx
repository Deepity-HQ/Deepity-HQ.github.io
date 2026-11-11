import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import CodeBlock from "../Components/CodeBlock.tsx";
const PythonLogo = "/tutorial-assets/python.png";
const cifarRunImage = "/tutorial-assets/cifar-fullconvpcn-run.png";

const fixCode = `void FullConvPCNetwork::UpdateWeights() noexcept
{
  // preact (and the mu := phi'(preact) it feeds) is only refreshed by
  // ComputeMuOnly(), which Step() calls against LAST iteration's z,
  // before THIS iteration's UpdateState() advances z. Without this
  // refresh, the weight gradient's derivative term is one settling
  // step stale relative to the activity it multiplies against.
  for (size_t i = 0; i + 1 < layers.size(); ++i)
  {
    layers[i]->ComputeMuOnly();
    layers[i]->EnsureMuHoldsDerivative();
  }
  for (size_t i = 0; i + 1 < layers.size(); i++)
    layers[i]->UpdateWeights();
}`;

const archCode = `# Stem: 3->32, 4x4/stride 4, 32x32 -> 8x8 -- the only place resolution
# drops, since Compile() requires every MIDDLE layer to match shape
# exactly once --mu-pc turns residual connections on.
net.add_layer(3, 32, 32, 32, 4, 4, 4, 4, 0, 0, 0, ...)

# 8 residual-eligible layers, constant shape throughout (8x8 -> 8x8).
for _ in range(8):
    net.add_layer(32, 32, 8, 8, 3, 3, 1, 1, 1, 1, 0, ...)

# Readout: 32->10 via a kernel covering the whole 8x8 feature map.
net.add_layer(32, 10, 8, 8, 8, 8, 1, 1, 0, 0, 0, ...)`;

import ButtonPrimary from "../Components/ButtonPrimary.tsx";
import ButtonSecondary from "../Components/ButtonSecondary.tsx";

export default function TutorialCifarDepth() {
  return (
    <div className="subpage-glow min-h-screen px-0 pt-28 pb-12 sm:px-3 sm:pt-32 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden border-y border-white/10 sm:rounded-2xl sm:border bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/6-fullpcn" nextLink="/tutorial" />
        <TutorialRail current={7} />

        <div className="px-5 py-8 sm:px-6 md:px-12 md:py-12">
          <div className="font-display mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 7</div>
          <h1 className="font-display text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            CIFAR-10 at Depth: Two Real Bugs and a Wrong Architecture
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            Tutorial 6 explained what muPC and the rest of{" "}
            <code>FullPCLayer</code>'s toggles do. It didn't run any of
            them. This tutorial is what happened the first time someone
            tried them: a debugging session that found two bugs, ruled
            out a third possible cause, and ended up needing a different
            network.
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-5 sm:px-8 md:px-12 space-y-10 font-body text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              1. The Question
            </h2>
            <p className="mb-4">
              muPC and residual connections exist specifically for
              networks too deep for plain PC to survive — a shallow toy
              network can't show what they're for. The test: build a
              genuinely deep, 26-weight-layer dense <code>FullPCN</code>{" "}
              stack on CIFAR-10 (not MNIST again), and compare plain{" "}
              <code>FullPCLayer</code> against muPC scaling + residual
              connections, everything else held identical.
            </p>
            <p>
              Plain PC collapsed to NaN energy almost immediately — expected,
              and consistent with the muPC paper's own Figure 1, where
              standard PC sits at chance accuracy for every depth they
              tested. muPC's own run was the surprise: no NaN, but energy
              climbed steadily for 15 epochs and accuracy never moved past
              ~15%. Something was still wrong, and it wasn't the thing
              muPC's scaling is designed to fix.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              2. Bug One — The Same Stale Gradient, Three Times
            </h2>
            <p className="mb-4">
              <code>FullPCNetwork::UpdateWeights()</code> reads a layer's
              cached pre-activation (<code>preact</code>) to compute the
              weight gradient's derivative term, multiplying it against
              that layer's current belief (<code>z</code>). The problem:{" "}
              <code>preact</code> is only refreshed earlier in the same
              settling step, before that step's own belief update — so by
              the time the settling loop ends, the derivative term is one
              step stale relative to the activity it's multiplied against.
              At 26 layers, compounding across weight updates and
              training iterations, that's enough to drive a slow,
              systematic blowup.
            </p>
            <p className="mb-4">
              This bug had already been found and fixed once this
              session, in <code>DirectKPPCNetwork</code> — but{" "}
              <code>FullPCNetwork</code> re-implements its own{" "}
              <code>UpdateWeights()</code> rather than sharing that code,
              so the fix never carried over. Worse: <code>FullPCN</code>
              's Python wrapper doesn't even call{" "}
              <code>FullPCNetwork</code> — it dispatches to a templated
              sibling, <code>FullPCNetworkT&lt;float&gt;</code>, a
              near-line-for-line duplicate with the identical bug,
              independently. Confirmed by adding a debug marker to the
              first fix: it never fired, because nothing was calling that
              class.
            </p>
            <p>
              A third copy turned up in <code>FullConvPCNetwork</code>,
              the convolutional sibling this tutorial ends up using. Its
              version of the bug needed a slightly different fix — this
              class converts <code>mu</code> in place to hold the
              derivative rather than keeping a separate scratch buffer, so
              the fix is <code>ComputeMuOnly()</code> followed by an
              explicit <code>EnsureMuHoldsDerivative()</code> call, not
              just a bare refresh:
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="FullConvPCNetwork.cpp"
                language="cpp"
                code={fixCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 font-body">
                Fig. 1: The same bug, fixed independently in three sibling classes.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              3. Bug Two — A Feedback Path muPC Was Never Told About
            </h2>
            <p className="mb-4">
              Fixing the gradient didn't fix the training curve. The
              remaining culprit turned out to be structural:{" "}
              <code>FullPCLayer</code> always runs Tutorial 5's DKP
              direct-feedback mechanism, unconditionally — there's no
              toggle for it. Its feedback matrix <code>Psi</code> keeps
              its own fan-scaled random init, deliberately never touched
              by muPC's compensating scale, since DKP is Deepity's own
              addition and sits entirely outside what the muPC paper's
              math accounts for. The two mechanisms had simply never been
              tested together at extreme depth, by anyone.
            </p>
            <p>
              Setting the feedback rate to <code>0</code> confirmed it:
              with DKP's injection disabled, energy dropped smoothly and
              monotonically, epoch after epoch, for the first time in this
              entire investigation. Accuracy still topped out modestly —
              around 23-25% after 40 epochs — but the training curve
              itself was finally healthy. The remaining gap wasn't a bug
              anymore. It was the wrong architecture.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              4. The Wrong Architecture
            </h2>
            <p className="mb-4">
              No amount of tuning a dense network closes the gap to
              backprop on CIFAR-10 — that was never really in reach. Even
              the muPC paper's own 128-layer dense ResNet on CIFAR-10 tops
              out around 35-37%, by the authors' own admission "far from
              SOTA because of the fully connected architecture." Spatial
              weight sharing is what actually unlocks CIFAR-level
              accuracy, and it turned out Deepity already had the piece
              needed: <code>FullConvPCLayer</code> /{" "}
              <code>FullConvPCNetwork</code>, a convolutional sibling
              carrying the exact same muPC/residual/iPC/ePC toggles{" "}
              <code>FullPCLayer</code> has, just never wrapped in a clean
              Python class yet.
            </p>
            <p className="mb-4">
              Residual connections impose a real constraint here: every
              middle layer must match its neighbor's shape exactly, so
              there's no downsampling inside the residual stack itself.
              The fix is the same one every real deep CNN uses — an
              aggressive stem before the residual blocks start. A first
              attempt keeping full 32×32 resolution through all 10 layers
              took measured 10 seconds per batch (~130 minutes for one
              epoch). Dropping to an 8×8 stem cut that to half a second
              per batch — a 20× speedup, confirmed by direct timing before
              handing it back for a real run:
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="cifar10_fullconvpcn.py"
                icon={PythonLogo}
                language="python"
                code={archCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 font-body">
                Fig. 2: A downsampling stem keeps the residual-eligible stack cheap.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              5. The Result
            </h2>
            <p className="mb-4">
              10 weight-bearing layers, muPC scaling and residual
              connections on, DKP feedback off, 10 epochs: 28.11% test
              accuracy, and — unlike every dense run before it — energy
              decreasing smoothly every single epoch with no sign of
              plateauing. That beat the dense network's 40-epoch result
              (~24%) in a quarter of the epochs, and was still visibly
              improving when the run ended.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[700px]">
              <img
                loading="lazy"
                decoding="async"
                src={cifarRunImage}
                alt="FullConvPCNetwork training on CIFAR-10 with muPC scaling and residual connections, reaching 28.11% test accuracy over 10 epochs with smoothly decreasing energy"
                className="block h-auto w-full border border-white/20"
                height="1203"
                width="3064"
              />
              <p className="mt-3 text-center text-sm text-white/70 font-body">
                Fig. 3: A real run of examples/cifar10_fullconvpcn.py --mu-pc.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              6. What This Isn't
            </h2>
            <p className="mb-4">
              28% on CIFAR-10 is not a result to be proud of next to
              backprop, and it's worth being direct about why. Part of it
              is fundamental, not fixable by more tuning: predictive
              coding does settling-steps × layers worth of forward/backward
              work per weight update, where backprop does each layer once.
              This run's 12 settling steps across 10 layers is roughly 12×
              backprop's own per-batch cost — that ratio is the actual
              price of local learning, not an implementation gap.
            </p>
            <p>
              Part of it is genuinely open. The muPC paper's own CIFAR-10
              result isn't reached by guessing hyperparameters directly at
              full depth — it comes from tuning a small network and
              zero-shot-transferring those exact rates to the deep one,
              a procedure this investigation never actually ran. Energy
              was still falling cleanly when this run stopped at epoch 10.
              Whether more epochs, real hyperparameter transfer, or a
              wider/deeper stack closes more of the gap is a real question
              this tutorial doesn't answer — the two bugs and the
              architecture mismatch were the parts that needed fixing
              before that question could even be asked honestly.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              Where to Go From Here
            </h2>
            <p>
              This is the series' first tutorial that doesn't end with a
              clean number — the honest version of running real research
              code usually doesn't. <code>examples/cifar10_fullpcn.py</code>{" "}
              and <code>examples/cifar10_fullconvpcn.py</code> both take a{" "}
              <code>--mu-pc</code> flag for the A/B comparison this
              tutorial describes, and both are worth rerunning with more
              epochs or a proper depth-transfer sweep. The{" "}
              <Link
                to="/benchmarks"
                className="text-[#a99bff] underline underline-offset-4 decoration-[#a99bff]/40 hover:decoration-[#a99bff]"
              >
                Benchmarks page
              </Link>{" "}
              has every architecture's fully tuned numbers where they
              exist — this one doesn't have one yet.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <ButtonSecondary to="/tutorial/6-fullpcn" arrow="left" className="w-full sm:w-auto">
              Part 6: muPC, iPC, and ePC Explained
            </ButtonSecondary>
            <ButtonPrimary to="/tutorial" className="w-full sm:w-auto">
              All Tutorials Overview
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
