import { Link } from "react-router";
import Reveal from "../Components/Reveal.tsx";
import UtilButton from "../Components/UtilButton.tsx";
import TutorialRail from "../Components/TutorialRail.tsx";
import CodeBlock from "../Components/CodeBlock.tsx";
const PythonLogo = "/tutorial-assets/python.png";
const cnnRunImage = "/tutorial-assets/cnn-training-run.png";

const cnnCode = `from deepity import ConvolutionalPCN
from deepity.layer import Convolution, ReLU

BATCH_SIZE = 250

net = ConvolutionalPCN(
    Convolution(16, 4, 4, stride_h=2, stride_w=2, pad_h=1, pad_w=1),
    ReLU(),
    Convolution(32, 4, 4, stride_h=2, stride_w=2, pad_h=1, pad_w=1),
    ReLU(),
    Convolution(128, 7, 7, stride_h=1, stride_w=1, pad_h=0, pad_w=0),
    ReLU(),
    Convolution(10, 1, 1, stride_h=1, stride_w=1, pad_h=0, pad_w=0),
    # The terminal marker -- see Section 2.
    Convolution(0, 1, 1, stride_h=1, stride_w=1, pad_h=0, pad_w=0),
    input_shape=(1, 28, 28),
    batch_size=BATCH_SIZE,
)
net.configure(
    learning_rate=0.005,
    inference_rate=0.1,
    precision_rate=0.0,
    lmbda=1e-4,
)
net.randomize_weights(seed=7)`;

const trainLoopCode = `for epoch in range(epochs):
    for X_batch, Y_batch in batches:
        net.train_step_with_projection(X_batch, Y_batch, steps)
        # Unlike SequentialPCN.train_step(), this does NOT happen
        # automatically -- call it yourself, every batch, if you set
        # precision_rate > 0.
        net.update_precision()`;

import { btnClass, btnSolidClass } from "../Components/ui.ts";
import { ArrowLeft, ArrowRight } from "../Components/ArrowIcons.tsx";

export default function TutorialCNN() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-32 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#141415]/60 shadow-2xl">
        <UtilButton backLink="/tutorial/3-tweaked-xor" nextLink="/tutorial/5-dkppcn" />
        <TutorialRail current={4} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="Michroma mb-3 text-xs uppercase tracking-[0.06em] text-[#a99bff]">Tutorial 4</div>
          <h1 className="Michroma text-2xl font-normal tracking-[-0.03em] md:text-4xl text-white">
            Running a Convolutional PCN
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-white/70 max-w-3xl">
            Every network so far has treated its input as a flat vector of
            independent features. Images aren't that — a digit shifted two
            pixels to the left is still the same digit. ConvolutionalPCN
            exploits that: the same small set of weights slides across the
            whole image instead of every pixel getting its own.
          </p>
        </div>

        <div className="border-t border-white/20 my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 Jura text-lg text-white">
          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              1. Why Convolution for Images
            </h2>
            <p className="mb-4">
              A dense layer like the ones in Tutorials 2 and 3 gives every
              input position its own independent weight — pixel (0,0) and
              pixel (14,14) are learned completely separately, even though
              the same stroke or edge can appear at either location. A
              convolutional layer instead learns one small kernel (here,
              4x4 and 7x7 patches) and slides it across every position in
              the image, so a pattern learned in one corner is immediately
              recognized everywhere else too.
            </p>
            <p>
              This is implemented with the same settling-and-local-error
              machinery as every other network in this series —{" "}
              <code>ConvolutionalPCN</code> wraps <code>ConvPCLayer</code>,
              which carries the same precision weighting as{" "}
              <code>DiscriminativePCLayer</code> from Tutorial 3, just
              routed through <code>Im2Col</code>/<code>Col2Im</code> instead
              of a plain matrix multiply.
            </p>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              2. Building the Network
            </h2>
            <p className="mb-4">
              Each <code>Convolution(out_channels, kernel_h, kernel_w, ...)</code>{" "}
              halves the spatial size twice (stride 2) before a 7x7 kernel
              collapses what's left to a single point per channel, and a
              final 1x1 convolution turns that into 10 class scores. One
              real gotcha: unlike <code>SimplePCN</code>/
              <code>SequentialPCN</code>, which append their own output
              layer automatically, <code>ConvolutionalPCN</code> requires
              you to end the architecture with an explicit{" "}
              <code>Convolution(0, ...)</code> — <code>out_channels=0</code>{" "}
              is the terminal marker it looks for; leave it out and the
              network has no layer to actually hold predictions in.
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center">
              <CodeBlock
                title="mnist_convpcn.py"
                icon={PythonLogo}
                language="python"
                code={cnnCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 1: A 4-layer conv network, from examples/mnist_convpcn.py.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              3. Two Carried-Over Lessons
            </h2>
            <p className="mb-4">
              <code>lmbda=1e-4</code> is the same value Tutorial 3 used for
              XOR, but it matters even more here: weight decay applies once
              per <i>batch</i>, not once per epoch, and 60,000 images at
              batch size 250 means ~240 decay applications per epoch
              instead of XOR's one per epoch. The library's own{" "}
              <code>1e-2</code> default, tried first, crushed weights to
              under 1% of scale within two epochs and trained at chance
              level the whole time.
            </p>
            <p className="mb-4">
              <code>precision_rate=0.0</code> is deliberate too: this
              network is deep enough, and MNIST noisy enough, that getting
              precision weighting right needs more care than this tutorial
              covers — it's left off, which simply makes every unit's error
              count equally, same as Tutorial 2's <code>SimplePCN</code>.
              Turning it on is still one call away:
            </p>
            <div className="mx-auto w-full max-w-[700px] flex flex-col items-center mb-6">
              <CodeBlock
                title="If you turn precision_rate back on"
                language="python"
                code={trainLoopCode}
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 2: update_precision() isn't automatic here, unlike
                SequentialPCN.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              4. Running It
            </h2>
            <p className="mb-4">
              Three epochs over full MNIST, no GPU: accuracy climbs
              32.52% → 51.92% → 58.52%, landing at 60.34% on the held-out
              test set — well past the 10% chance line, and still visibly
              climbing when training stops. This isn't a tuned result the
              way the dense network in the Benchmarks page is; it's a
              working starting point. More epochs, not more hyperparameter
              changes, is the natural next step from here.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[700px]">
              <img
                loading="lazy"
                decoding="async"
                src={cnnRunImage}
                alt="ConvolutionalPCN training on MNIST, accuracy climbing from 32.52% to 60.34% over 3 epochs"
                className="block h-auto w-full border border-white/20"
                height="997"
                width="1378"
              />
              <p className="mt-3 text-center text-sm text-white/70 Jura">
                Fig. 3: A real run of examples/mnist_convpcn.py.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-white/20 my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-xl md:text-2xl mb-4 Michroma">
              5. Why Bother, Then?
            </h2>
            <p className="mb-4">
              Fair question — this run is both slower and less accurate
              than the dense network from the tutorials before it, and on
              MNIST specifically that's not an illusion. Each settling step
              here has to update every spatial position in every feature
              map, not just a compact belief vector: layer 0 alone holds
              16 × 14×14 = 3,136 values per image, against roughly 1,000
              total hidden + output units in the dense network. More state
              to settle, every one of the 25 steps, is the direct cause of
              the slower wall-clock time — nothing about the underlying
              convolution kernels themselves is unoptimized; they already
              try a fused path before falling back to the plain Im2Col +
              matrix-multiply route, same as the dense layers do.
            </p>
            <p className="mb-4">
              The accuracy gap is less fundamental. This is a 3-epoch,
              untuned run with precision weighting off and plain SGD — the
              same state the dense network was in with Tutorial 1's quick
              demo config, which also only reached the high 50s% before the
              full, properly tuned 100-epoch recipe got it to 98%. Nothing
              here suggests convolution has a lower ceiling on MNIST, only
              that this example hasn't been pushed anywhere near it.
            </p>
            <p>
              So why use it at all, rather than just tuning the dense
              network harder? Because a dense layer gives every input pixel
              its own independent weight to every hidden unit — on a
              224×224 image that's hundreds of thousands of input
              dimensions times however wide the hidden layer is, which
              stops being practical fast. A convolutional layer's weight
              count depends on kernel size and channel count, not image
              size, and the same learned kernel recognizes a pattern
              wherever it appears in the frame. On an image as small and
              centered as MNIST's 28×28 digits, that advantage barely
              matters, which is exactly why the dense network wins here.
              It starts to matter once the images — and what's being
              looked for in them — get larger and less conveniently
              centered than a single handwritten digit.
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pb-12 pt-8 md:pb-14">
            <Link
              to="/tutorial/3-tweaked-xor"
              className={`${btnClass} w-full sm:w-auto`}
            >
              <ArrowLeft />
              Part 3: Adding Hyperparameters
            </Link>
            <Link
              to="/tutorial/5-dkppcn"
              className={`${btnSolidClass} w-full sm:w-auto`}
            >
              Part 5: Direct Kolen-Pollack Networks
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
