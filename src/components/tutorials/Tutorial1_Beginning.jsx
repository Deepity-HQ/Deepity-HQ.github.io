import React from "react";
import { Link } from "react-router-dom";
import MainFooter from "../MainFooter";
import Reveal from "../Reveal";
import UtilButton from "../UtilButton";
import TutorialRail from "../TutorialRail";
import CodeBlock from "../CodeBlock";
import CmdLogo from "../../assets/cmd.png";
import buildingImage from "../../assets/buildingdeepity.png";

const buildCode = `# Clone the Deepity repository
git clone https://github.com/Deepity-HQ/Deepity.git
cd Deepity

# Compile the C++ backend
python build.py`;

const configCode = `# Configure backend and hyperparameters
model.configure(
    learning_rate=0.001,
    inference_rate=0.05,
    optimizer="adam",
    regularization=1e-4
)`;

const trainCode = `# Train the network automatically
model.fit(x_train, y_train, epochs=10, batch_size=64)

# Run inference steps for local energy minimization
predictions = model.predict(x_test, settling_steps=20)`;

export default function Tutorial1_Beginning() {
  return (
    <div className="subpage-glow min-h-screen px-3 pt-20 pb-12 md:px-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-line bg-panel2/60 shadow-2xl">
        <UtilButton
          backLink="/tutorial/0-introduction"
          nextLink="/notfound"
        />
        <TutorialRail current={1} />

        <div className="px-6 py-8 md:px-12 md:py-12">
          <div className="label mb-3 text-xs text-accent-text">Tutorial 1</div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-normal tracking-[-0.03em] md:text-5xl text-fg">
            Understanding the Deepity Library
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed text-dim max-w-3xl">
            Now that you understand the theory behind Predictive Coding
            Networks, it is time to look at Deepity itself. We will cover the
            library's design, how to compile its C++ backend, and the core
            concepts required to construct a SimplePCN to classify handwritten
            digits.
          </p>
        </div>

        <div className="border-t border-line-strong my-8 mx-8" />

        <div className="px-8 md:px-12 space-y-10 ff-body text-lg text-fg">
          <Reveal as="section">
            <h2 className="text-2xl font-bold mb-4 ff-display">
              1. What Makes Deepity Special?
            </h2>
            <p className="mb-4">
              The historic bottleneck for Predictive Coding Networks (PCNs) is
              speed. Standard feedforward neural networks rely on standard
              matrix multiplications that modern GPUs compute quickly. PCNs,
              however, require iterative settling loops to simulate local energy
              minimization.
            </p>
            <p className="mb-6">
              Deepity addresses this by implementing a C++ backend with a Python
              interface. It uses fused SIMD loops on the CPU and custom CUDA
              kernels to manage memory operations efficiently. This allows the
              library's PCNs to train at speeds comparable to standard
              backpropagation models.
            </p>
            <div className="mx-auto flex w-full flex-col items-center md:max-w-[500px]">
              <img
 loading="lazy"
 decoding="async"
                src="/tutorials/nanobind.webp"
                alt="Feedforward neural networks visualized"
                className="block w-full border border-line-strong"
              />
              <p className="mt-3 text-center text-sm text-dim ff-body">
                <a
                  href="https://github.com/wjakob/nanobind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link text-accent-text"
                >
                  Fig. 1: Nanobind, Deepity's lightweight Python binding
                  dependency.
                </a>
              </p>
            </div>
          </Reveal>

          <div className="border-t border-line-strong my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-2xl font-bold mb-4 ff-display">
              2. Building, Loading, and GitHub Workflows
            </h2>
            <p className="mb-4">
              Because Deepity relies on a C++ core, the backend must be compiled
              for your specific hardware before use. The repository includes a
              build script to handle this compilation. Once built, the module
              can be imported directly into your Python environment.
            </p>
            <p className="mb-6">
              The repository also includes GitHub workflows that automate
              cross-platform building and testing upon every push to maintain
              stability across different environments.
            </p>

            <div className="mx-auto flex w-full flex-col items-center md:max-w-[1000px] mb-8">
              <img
 loading="lazy"
 decoding="async"
                src={buildingImage}
                alt="Building Deepity"
                className="block h-auto w-full border border-line-strong"
                height="717"
                width="2586"
              />
              <p className="mt-3 text-center text-sm text-dim ff-body">
                Fig. 2: Building Deepity using the provided{" "}
                <code>build.py</code> script.
              </p>
            </div>

            <div className="mx-auto w-full max-w-[800px] flex flex-col items-center">
              <CodeBlock
                title="Terminal"
                icon={CmdLogo}
                language="bash"
                code={buildCode}
              />
              <p className="mt-3 text-center text-sm text-dim ff-body">
                Fig. 3: Compiling the Deepity backend via the command line.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-line-strong my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-2xl font-bold mb-4 ff-display">
              3. Declarative Architecture
            </h2>
            <p className="mb-4">
              Networks in Deepity are initialized declaratively. You define the
              complete structure upfront by passing layer components directly
              into the network's constructor.
            </p>
            <p className="mb-6">
              For instance, a simple network is constructed by providing
              dimension mappings and activation functions at initialization. The
              library will then verify that the layer dimensions match from the
              input layer through to the output layer before proceeding.
            </p>
          </Reveal>

          <div className="border-t border-line-strong my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-2xl font-bold mb-4 ff-display">
              4. Configuring the Backend
            </h2>
            <p className="mb-4">
              After defining the architecture in Python, the network must be
              configured. This step initializes the corresponding C++ backend
              structures and allocates the necessary memory.
            </p>
            <p className="mb-6">
              During this step, you set the hyperparameters for optimization and
              inference. This includes the weight-learning rate, settling
              inference rate, regularization parameters, and the chosen
              optimizer.
            </p>

            <div className="mx-auto w-full max-w-[800px] flex flex-col items-center mt-6">
              <CodeBlock title="Python" language="python" code={configCode} />
              <p className="mt-3 text-center text-sm text-dim ff-body">
                Fig. 4: Configuring the optimization and inference parameters.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-line-strong my-8 mx-8" />

          <Reveal as="section">
            <h2 className="text-2xl font-bold mb-4 ff-display">
              5. Training and Inference
            </h2>
            <p className="mb-4">
              Once configured, the network is ready for training. Deepity
              provides built-in <code>fit</code> functions for standard
              training, or you can write manual training loops by executing
              single steps on data batches.
            </p>
            <p className="mb-6">
              Because predictive coding relies on state minimization, generating
              predictions requires running the network through iterative
              inference steps to let the local energy settle. Once settled, the
              final layer's state represents the network's output, which can
              then be evaluated against your target classes.
            </p>

            <div className="mx-auto w-full max-w-[800px] flex flex-col items-center mt-6">
              <CodeBlock title="Python" language="python" code={trainCode} />
              <p className="mt-3 text-center text-sm text-dim ff-body">
                Fig. 5: Executing training and settled inference.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-line pt-8">
            <Link
              to="/tutorial/0-introduction"
              className="btn text-sm w-full sm:w-auto"
            >
              ← Part 0: Introduction
            </Link>
            <Link
              to="/tutorial"
              className="btn btn--solid text-sm w-full sm:w-auto"
            >
              All Tutorials Overview →
            </Link>
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
