import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import ButtonPrimary from "../Components/ButtonPrimary.tsx";
import ButtonSecondary from "../Components/ButtonSecondary.tsx";

export default function TutorialFullPCN() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-32 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/5-dkppcn" nextLink="/tutorial/7-cifar-depth" />
        <TutorialRail current={6} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="font-display mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 6</div>
          <h1 className="font-display text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            muPC, iPC, and ePC Explained
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            Every network in this series so far has been one fixed recipe.
            <code>FullPCLayer</code> and <code>FullPCNetwork</code> are
            different: they're Deepity's "toggle everything" class, a
            single layer that starts out mathematically identical to
            Tutorial 5's <code>DirectKPPCLayer</code> and can independently
            switch on half a dozen separate research results on top of it.
            This tutorial has no training run or screenshot — it's a tour
            of what each toggle actually does and why you'd reach for it.
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 font-body text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              1. One Layer, Every Extra Off by Default
            </h2>
            <p className="mb-4">
              Deepity's codebase keeps every PC variant you've already
              met — <code>SimplePCN</code>, <code>SequentialPCN</code>,
              <code>ConvolutionalPCN</code>, <code>DKPPCN</code> — as its
              own small, focused class, deliberately not sharing one bloated
              hierarchy. <code>FullPCLayer</code> is the one deliberate
              exception: instead of writing a new class every time a new
              piece of PC research looks worth having, new mechanisms get
              bolted on as a toggle here. Every toggle defaults to off, and
              with all of them off, <code>FullPCLayer</code> is bit-identical
              to <code>DirectKPPCLayer</code> — same DFA phase, same
              settling, same weight update. Turning a toggle on doesn't
              replace that baseline, it adds one specific, well-cited
              change on top of it.
            </p>
            <p>
              That matters for how to read the rest of this page: these
              aren't six competing ways to do predictive coding. They're
              six independent dials on the same network, each one answering
              a different specific problem — depth, update timing, settling
              cost, loss shape — that plain PC runs into somewhere.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              2. muPC — Making Depth Survivable
            </h2>
            <p className="mb-4">
              Every network you've trained in this series has been a
              handful of layers deep. Push plain PC to real depth — a
              hundred layers or more — and it falls apart: the fan-scaled
              weight init and unscaled forward pass that work fine at 2-3
              layers compound into instability the deeper the stack gets.
              muPC (Innocenti et al., "muPC: Scaling Predictive Coding to
              100+ Layer Networks") adapts an idea from backprop's
              maximal-update parametrization to fix this for PC
              specifically.
            </p>
            <p className="mb-4">
              Concretely, it's two changes, both off by default: every
              layer's forward prediction gets an extra width/depth-dependent
              scaling factor <code>a</code> (so <code>mu = a * (W @
              phi(z)) + b</code> instead of plain <code>mu = W @ phi(z) +
              b</code>), and weight init switches from the usual
              fan-in/fan-out-scaled variance to plain unit variance,
              letting <code>a</code> alone carry the scaling instead of
              baking it into the init. Both only make sense together, which
              is why <code>SetUseMuPCScaling()</code> turns on both at
              once rather than offering them separately.
            </p>
            <p>
              Worth knowing: the muPC paper also proposes scaling the
              learning rate itself by depth, the same way its weight
              initialization is scaled. Deepity's implementation
              deliberately leaves that part out — the authors themselves
              found it made training less stable, not more, and tunes the
              weight and settling learning rates as ordinary independent
              hyperparameters instead.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              3. Residual Connections — muPC's Other Half
            </h2>
            <p className="mb-4">
              The same muPC paper's deepest networks don't just rescale
              every layer, they skip some of them: a residual/skip
              connection on the middle hidden layers, the same shape
              ResNets use in ordinary deep learning. In a PC network this
              means a layer's prediction becomes <code>mu = a * (W @
              phi(z)) + b + z</code> — its own incoming belief added back
              in alongside the usual forward prediction — which gives
              error a shorter path to travel through a very deep stack.
            </p>
            <p>
              This is its own toggle, <code>SetUseResidualConnections()</code>,
              separate from <code>SetUseMuPCScaling()</code> even though
              the paper presents them together, since Deepity's rule is one
              well-defined mechanism per switch. It does come with a real
              constraint: a residual connection only makes sense between
              two layers of the same width, so turning it on with
              mismatched hidden-layer sizes raises an error at{" "}
              <code>Compile()</code> rather than silently skipping the
              connection and leaving you wondering why depth isn't
              helping.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              4. iPC — Stop Waiting for Settling to Finish
            </h2>
            <p className="mb-4">
              Every network so far has followed the same two-phase shape:
              let <code>z</code> settle for some number of steps, then
              update the weights once, using wherever settling ended up.
              Incremental Predictive Coding (Salvatori et al.,
              "Incremental Predictive Coding") asks a simple question:
              why wait? <code>SetUseIPC()</code> moves{" "}
              <code>UpdateWeights()</code> inside the settling loop itself,
              so weights get a real update after every single settling
              step instead of one update after all of them.
            </p>
            <p>
              The effect is that learning and inference stop being two
              separate phases and start happening together — weights begin
              adapting to an early, rough settling estimate rather than
              only ever seeing the fully-relaxed final one. In practice
              this tends to mean useful learning happens with fewer total
              settling steps, since each one is doing double duty: moving{" "}
              <code>z</code> closer to equilibrium, and giving the weights
              one more real update along the way.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              5. ePC — Settle the Error, Not the Belief
            </h2>
            <p className="mb-4">
              Tutorial 5 covered one way to avoid plain PC's
              layer-by-layer settling cost: DKP learns a separate feedback
              matrix once, so error reaches every layer in one hop instead
              of relaying through the stack. ePC (Goemaere et al., "ePC:
              Fast and Deep Predictive Coding in Digital Simulation")
              solves the same underlying problem a completely different
              way — not by learning a shortcut, but by doing a real, exact
              sweep every single settling step.
            </p>
            <p className="mb-4">
              With <code>SetUseEPC()</code> on, a settling step stops being
              each layer locally nudging its own <code>z</code> toward
              equilibrium. It becomes two full network-wide passes instead:
              a forward sweep that reconstructs every hidden layer's belief
              straight from the layer below's fresh prediction plus its own
              local error (<code>z := mu_below + e</code>, no local
              integration at all), then a backward sweep that chains a
              backprop-shaped sensitivity term all the way from the
              terminal layer down through every hidden layer in one pass.
              The thing actually being relaxed toward equilibrium each step
              isn't the belief <code>z</code> anymore, it's the error{" "}
              <code>e</code> itself.
            </p>
            <p>
              Each ePC step costs more than an ordinary local settling
              step, since it touches the whole network instead of one
              layer's own neighborhood. What it buys back is exactly what
              DKP buys back by a different route: information that would
              otherwise need one settling step per layer to propagate now
              arrives in a single sweep, so far fewer total steps are
              needed for a deep network to actually settle.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              6. The Smaller Toggles
            </h2>
            <p className="mb-4">
              Two more switches round out <code>FullPCLayer</code>, each
              addressing something narrower than a whole settling
              algorithm. <code>SetUseMomentum()</code> EMA-smooths the
              settling update itself, the same inertial trick SGD-with-
              momentum uses for weight updates, applied here to{" "}
              <code>z</code>'s own trajectory instead — it damps
              oscillation in settling the same way momentum damps it in
              ordinary gradient descent, at the cost of one extra buffer
              per layer.
            </p>
            <p>
              <code>SetUseCrossEntropy()</code> is narrower still: it only
              ever applies to the terminal layer, swapping its plain
              Gaussian energy (<code>||z - mu||^2</code>, what every
              network in this series has used by default) for softmax
              cross-entropy against a one-hot target. Every hidden layer
              keeps comparing beliefs the Gaussian way regardless — only
              the final classification loss changes shape, which is the
              only place cross-entropy ever made sense to begin with.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 font-display">
              Where to Go From Here
            </h2>
            <p>
              None of these toggles are mutually exclusive — a single{" "}
              <code>FullPCNetwork</code> can run muPC's scaling, residual
              connections, iPC's interleaved weight updates, and momentum
              settling all at once, each one addressing a different part
              of why plain PC struggles at real depth and real settling
              budgets. ePC is the one exception worth flagging: it replaces
              the settling loop's local structure outright, so it's the
              one toggle most worth testing in isolation before stacking
              anything else on top of it. As with every tutorial in this
              series, the actual numbers for any specific combination are
              worth checking against the{" "}
              <Link
                to="/benchmarks"
                className="text-[#a99bff] underline underline-offset-4 decoration-[#a99bff]/40 hover:decoration-[#a99bff]"
              >
                Benchmarks page
              </Link>{" "}
              rather than assumed from the mechanism alone.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <ButtonSecondary to="/tutorial/5-dkppcn" arrow="left" className="w-full sm:w-auto">
              Part 5: Direct Kolen-Pollack Networks
            </ButtonSecondary>
            <ButtonPrimary to="/tutorial/7-cifar-depth" className="w-full sm:w-auto">
              Part 7: CIFAR-10 at Depth
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}
