import { useEffect, useState, useRef, Suspense, lazy, type MouseEvent } from "react";
import AnimatedWaveBackground from "./Components/UI_Fun/AnimatedWaveBackground.tsx";
import { Link } from "react-router";
import CodeTabs, { type CodeFile } from "./Components/CodeTabs.tsx";
import { WebGLBoundary, hasWebGL } from "./webgl.tsx";
import { laptopSections, openSourceText } from "./laptopSections.ts";

type Benefit = {
  number: string;
  title: string;
  description: string;
};

// The 3D laptop (and its 540 KB model) is only fetched when its section is near
const LaptopScene = lazy(() => import("./Components/UI_Fun/LaptopScene.tsx"));

function BenefitCard({ number, title, description }: Benefit) {
  const cardRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl bg-white/[0.04] p-7 backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(250px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.05), transparent 80%)`,
        }}
      />
      <div className="relative z-10">
        <p className="Jura text-sm tracking-widest text-cyan-200/70">
          {number}
        </p>
        <h3 className="Michroma mt-5 text-lg text-white">{title}</h3>
        <p className="Jura mt-4 text-lg leading-relaxed text-white/75">
          {description}
        </p>
      </div>
    </article>
  );
}

function Hero() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const updateScrollProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setScrollProgress(Math.min(window.scrollY / window.innerHeight, 1));
      });
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-start pt-[25vh]"
      style={{
        opacity: 1 - scrollProgress,
        filter: `blur(${scrollProgress * 8}px)`,
        transform: `translate3d(0, ${scrollProgress * -140}px, 0)`,
      }}
    >
      {/* Soft dark pool behind the text so bright wave crests never wash it out */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-[25vh] h-[60vh] w-[min(1100px,120vw)] -translate-x-1/2 -translate-y-[8vh]"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 50% 42%, rgba(2,2,5,0.78) 0%, rgba(2,2,5,0.5) 45%, rgba(2,2,5,0) 100%)",
        }}
      />
      <h1 className="Michroma relative text-center text-5xl text-white [text-shadow:0_2px_24px_rgba(2,2,5,0.9),0_0_6px_rgba(2,2,5,0.7)] md:text-[5.5rem] md:leading-[1.05]">
        Learn
        <br />
        Differently
      </h1>
      <h3 className="Jura relative mt-6 text-center text-lg text-white/90 [text-shadow:0_2px_18px_rgba(2,2,5,0.95),0_0_5px_rgba(2,2,5,0.7)] md:text-3xl">
        Train Neural Networks
        <br />
        Without Backpropagation
      </h3>
    </div>
  );
}

function PredictiveSection() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [exitProgress, setExitProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const stage = stageRef.current;
        if (!stage) return;

        // On phones the section scrolls normally (no pin, no exit animation),
        // so every card can be reached
        if (!window.matchMedia("(min-width: 768px)").matches) {
          setExitProgress(0);
          return;
        }

        const rect = stage.getBoundingClientRect();
        const totalDistance = rect.height - window.innerHeight;
        if (totalDistance <= 0) return;

        const rawProgress = Math.min(Math.max(-rect.top / totalDistance, 0), 1);
        const holdThreshold = 0.5;
        const exit =
          rawProgress <= holdThreshold
            ? 0
            : (rawProgress - holdThreshold) / (1 - holdThreshold);

        setExitProgress(Math.min(Math.max(exit, 0), 1));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const opacity = Math.max(0, 1 - exitProgress * 1.05);
  const blurPx = exitProgress * 10;

  const headlineScale = 1 + exitProgress * 0.36;
  const headlineTranslateY = exitProgress * -65;

  const kickerScale = 1 + exitProgress * 0.22;
  const kickerTranslateY = exitProgress * -80;

  const descScale = 1 + exitProgress * 0.18;
  const descTranslateY = exitProgress * -50;

  const cardsOpacity = Math.max(0, 1 - exitProgress * 1.25);
  const cardsBlur = exitProgress * 8;
  const cardsTranslateY = exitProgress * -25;
  const cardsScale = 1 + exitProgress * 0.04;

  return (
    <div ref={stageRef} className="relative z-0 w-full md:h-[300vh]">
      <section
        className="flex items-center px-6 py-16 md:sticky md:top-0 md:min-h-screen md:px-16"
        style={{
          pointerEvents: exitProgress > 0.85 ? "none" : "auto",
        }}
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            className="Jura mb-3 text-sm uppercase tracking-[0.35em] text-cyan-200/80 md:mb-5 predictive-exit-text"
            style={{
              opacity,
              filter: `blur(${blurPx * 0.75}px)`,
              transform: `translate3d(0, ${kickerTranslateY}px, 0) scale(${kickerScale})`,
              transformOrigin: "left center",
            }}
          >
            Predictive coding
          </p>
          <h2
            className="Michroma max-w-4xl text-2xl leading-relaxed text-white md:text-5xl predictive-exit-text"
            style={{
              opacity,
              filter: `blur(${blurPx}px)`,
              transform: `translate3d(0, ${headlineTranslateY}px, 0) scale(${headlineScale})`,
              transformOrigin: "left center",
            }}
          >
            A <span className="fancy">different</span> way to train neural
            networks
          </h2>
          <p
            className="Jura mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:mt-8 md:text-2xl predictive-exit-text"
            style={{
              opacity,
              filter: `blur(${blurPx * 0.75}px)`,
              transform: `translate3d(0, ${descTranslateY}px, 0) scale(${descScale})`,
              transformOrigin: "left center",
            }}
          >
            Most AI today is trained with backpropagation, which needs a lot of
            memory and, in practice, GPUs.
          </p>

          <div
            className="mt-8 grid gap-5 md:mt-14 md:grid-cols-3 predictive-exit-text"
            style={{
              opacity: cardsOpacity,
              filter: `blur(${cardsBlur}px)`,
              transform: `translate3d(0, ${cardsTranslateY}px, 0) scale(${cardsScale})`,
              transformOrigin: "center center",
            }}
          >
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.number} {...benefit} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const benefits: Benefit[] = [
  {
    number: "01",
    title: "Learns locally",
    description:
      "Each neuron adjusts from the errors right next to it, the way many neuroscientists think the brain works. No error signal has to travel back through the whole network.",
  },
  {
    number: "02",
    title: "Runs beyond GPUs",
    description:
      "Local learning suits edge devices, embedded systems and low-power machines, where a large GPU isn't an option.",
  },
  {
    number: "03",
    title: "Keeps learning",
    description:
      "Predictive coding is a good fit for systems that keep learning after deployment, a hard problem for standard networks.",
  },
];

const technologies = [
  "OpenBLAS",
  "Intel MKL",
  "Intel libsxmm",
  "Halide",
  "OpenMP",
  "Google Highway",
  "Google Benchmark",
  "SLEEF",
  "CUDA",
  "CUTLASS",
  "cuDNN",
  "nanobind",
];

// Shown in place of the 3D laptop when WebGL is unavailable
function LaptopFallback() {
  return (
    <div className="mx-auto grid w-full max-w-[1000px] gap-4 px-6 md:grid-cols-2">
      {laptopSections.map((section, i) => (
        <article
          key={section.title}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
        >
          <span className="Michroma text-xs text-[#a99bff]">0{i + 1}</span>
          <h3 className="Michroma m-0 mt-3 text-lg text-white">{section.title}</h3>
          <p className="Jura mb-0 mt-3 text-base leading-relaxed text-white/75">
            {section.body || (
              <>
                {openSourceText.before}
                <span className="underline underline-offset-4">{openSourceText.link}</span>
                {openSourceText.after}
              </>
            )}
          </p>
        </article>
      ))}
    </div>
  );
}

// Small supporting numbers under the headline cards (see the Benchmarks page)
const stats = [
  { value: "66.8s", label: "To train MNIST to 98.08% on one NVIDIA A100, 7.3× faster than the CPU run" },
  { value: "49.6s", label: "To train Direct Kolen-Pollack to 95.97% on MNIST" },
  { value: "<2MB", label: "Compiled extension, with no deep learning framework underneath" },
  { value: "MIT", label: "Licensed. Free to use, modify and ship" },
];

function BurningMeteor() {
  return (
    <svg
      viewBox="0 0 512 512"
      className="meteor-art"
      aria-hidden="true"
      overflow="visible"
    >
      <defs>
        {/* Flames run from a transparent violet tail to a white-hot core at the rock */}
        <linearGradient id="meteor-flame-outer" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="340" y2="340">
          <stop offset="0" stopColor="#6d5cff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#8b7cff" stopOpacity="0.7" />
          <stop offset="0.8" stopColor="#cfc8ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="meteor-flame-inner" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="340" y2="340">
          <stop offset="0" stopColor="#a99bff" stopOpacity="0" />
          <stop offset="0.4" stopColor="#d9d3ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        {/* Anodized graphite: a lit upper-left face fading to dark */}
        <linearGradient id="meteor-rock" x1="0.15" y1="0.1" x2="0.9" y2="0.95">
          <stop offset="0" stopColor="#7a7a90" />
          <stop offset="0.5" stopColor="#3e3e52" />
          <stop offset="1" stopColor="#1c1c28" />
        </linearGradient>
      </defs>
      <path className="meteor-flame meteor-flame-outer" fill="url(#meteor-flame-outer)" d="M144.345,349.7l67.39,20.636L64.631,196.91l96.855,26.033L0,0l222.943,161.485l-26.034-96.853 l173.427,147.103l-20.635-67.39c0,0,263.14,180.817,119.3,324.657C325.163,612.84,144.345,349.7,144.345,349.7z" />
      <path className="meteor-flame meteor-flame-inner" fill="url(#meteor-flame-inner)" d="M222.943,161.485l-26.034-96.853l173.427,147.103l-20.635-67.39c0,0,263.14,180.817,119.3,324.657 L0,0L222.943,161.485z" />
      <g className="meteor-rock">
      <path fill="url(#meteor-rock)" stroke="#b9aeff" strokeOpacity="0.55" strokeWidth="5" strokeLinejoin="round" d="M437.25,277.514c17.677,17.677,38.154,36.034,38.154,71.362s-3.587,55.773-7.519,74.44 c-10.69,50.759-86.677,46.491-107.649,42.847c-20.187-3.508-49.105-8.125-67.122-26.142c-18.017-18.017-45.925-44.513-45.925-64.296 c0-19.783,0-50.872,0-68.536s17.664-45.219,50.165-53.698C329.855,245.013,392.385,232.648,437.25,277.514z"/>
<g>
<path fill="#2a2a38" d="M268.463,268.464c7.676-6.531,17.341-11.96,28.891-14.973 c32.501-8.479,95.031-20.843,139.896,24.023c17.677,17.677,38.154,36.034,38.154,71.362s-3.587,55.773-7.519,74.44 c-2.534,12.033-8.741,20.969-17.011,27.558L268.463,268.464z"/>
<circle fill="#2a2a38" cx="327.235" cy="402.777" r="16.41"/>
<path fill="#2a2a38" d="M284.576,321.588c-15.864-15.864-18.794-39.761-8.796-58.597c6.232-4.059,13.438-7.377,21.574-9.5 c13.096-3.416,31.069-7.461,50.797-8.141c2.429,1.682,4.747,3.591,6.91,5.753c19.464,19.464,19.464,51.021,0,70.485 C335.597,341.052,304.04,341.052,284.576,321.588z"/>
</g>
<g>
<path fill="#16161f" d="M470.581,409.549c-19.241,12.041-44.908,9.708-61.643-7.027c-19.464-19.464-19.464-51.021,0-70.485 c17.192-17.192,43.815-19.188,63.21-6.007c2.059,6.78,3.256,14.316,3.256,22.845C475.404,375.82,473.316,394.104,470.581,409.549z" />
<path fill="#16161f" d="M272.065,272.065c0.928-3.113,2.166-6.155,3.715-9.074c6.232-4.058,13.438-7.377,21.574-9.5 c13.096-3.417,31.069-7.462,50.797-8.141c2.429,1.682,4.747,3.591,6.91,5.753c19.464,19.464,19.464,51.021,0,70.485 c-6.057,6.057-13.288,10.228-20.959,12.515L272.065,272.065z"/>
</g> 
      </g>
    </svg>
  );
}

const pythonCode = `from pydeepity import SimplePCN
from pydeepity.layer import Linear, Sigmoid

# The network from the benchmark: 784 -> 512 -> 512 -> 10
net = SimplePCN(
    Linear(784, 512),
    Linear(512, 512), Sigmoid(),
    Linear(512, 10), Sigmoid(),
    batch_size=250,
)
net.configure(learning_rate=0.00373, inference_rate=0.091, lmbda=0.0, optimizer="ADAMW")

# X_train: (N, 784) float32 in [0, 1]. Y_train: (N, 10) one-hot.
# examples/mnist.py loads MNIST and has the full script.
for epoch in range(100):
    for b in range(len(X_train) // 250):
        X = X_train[b * 250:(b + 1) * 250]
        Y = Y_train[b * 250:(b + 1) * 250]
        energy = net.train_step_with_projection(X, Y, 20)  # 20 settling steps
`;

const cppCode = `#include <deepity/networks/SimplePCNetwork.h>
#include <random>

// The network from the benchmark: 784 -> 512 -> 512 -> 10
Deep::SimplePCNetwork net(250);  // batch size
net.AddLayer(784, 512, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::LINEAR, Deep::ActivationType::dLINEAR);
net.AddLayer(512, 512, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::SIGMOID, Deep::ActivationType::dSIGMOID);
net.AddLayer(512, 10, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::SIGMOID, Deep::ActivationType::dSIGMOID);
net.AddLayer(10, 0, 0.00373f, 0.091f, 0.0f, Deep::ActivationType::LINEAR, Deep::ActivationType::dLINEAR);

net.SetOptimizer(Deep::OptimizerType::ADAMW);
net.Compile();

std::mt19937 rng(7);
net.RandomizeWeights(rng);

// X: one batch, 250 * 784 floats. Y: 250 * 10 one-hot floats.
float energy = net.TrainStepWithProjection(X, Y, 20);  // 20 settling steps`;

const codeFiles: CodeFile[] = [
  { name: "train.py", language: "python", code: pythonCode },
  { name: "train.cpp", language: "cpp", code: cppCode },
];

export default function App() {
  const webgl = hasWebGL();
  const [nearLaptop, setNearLaptop] = useState(false);
  const laptopStageRef = useRef<HTMLDivElement>(null);
  const [laptopProgress, setLaptopProgress] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("progress");
      if (p !== null) return parseFloat(p);
    }
    return 0;
  });

  // Start loading the laptop about a screen before it comes into view
  useEffect(() => {
    const stage = laptopStageRef.current;
    if (!stage || !webgl) return;
    if (typeof IntersectionObserver === "undefined") {
      setNearLaptop(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearLaptop(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [webgl]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("progress") !== null) {
      return;
    }

    let frame = 0;
    const updateLaptopProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const stage = laptopStageRef.current;
        if (!stage) return;

        const rect = stage.getBoundingClientRect();
        const totalDistance = rect.height - window.innerHeight;
        if (totalDistance <= 0) return;

        const progress = Math.min(Math.max(-rect.top / totalDistance, 0), 1);
        setLaptopProgress(progress);
      });
    };

    updateLaptopProgress();
    window.addEventListener("scroll", updateLaptopProgress, { passive: true });
    window.addEventListener("resize", updateLaptopProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateLaptopProgress);
      window.removeEventListener("resize", updateLaptopProgress);
    };
  }, []);

  return (
    <div className="scrollbar-thin text-white">
      <Hero />
      <main>
        <div className="h-svh" aria-hidden="true" />
        <PredictiveSection />
        <div className="relative w-full md:h-[180vh]">
          <section className="w-full md:sticky md:top-0 md:min-h-screen flex flex-col justify-center items-center px-6 py-8 md:py-10">
            <div className="flex justify-center items-center">
              <h2 className="Michroma max-w-4xl text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white text-center leading-tight md:leading-normal">
                Learn Faster
              </h2>
            </div>
            <div className="flex flex-col justify-center items-center w-full">
              <hr className="h-1 my-4 md:my-5 w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:grid-rows-[170px_170px_120px] max-w-[1500px] w-full">
                <article className="relative h-full w-full overflow-hidden border-t border-white/15 pt-5 md:col-span-2 md:row-span-2">
                                    <div className="relative z-10 flex h-full flex-col justify-center">
                    <h3 className="Michroma mt-2 md:mt-4 text-5xl md:text-7xl text-white">
                      3.50×
                    </h3>
                    <p className="Jura mt-3 md:mt-4 text-base md:text-2xl leading-relaxed text-white/75">
                      Faster than ngc-learn (the leading neuromorphic library) at
                      the same accuracy.
                    </p>
                  </div>
                </article>
                <article className="relative h-full w-full overflow-hidden border-t border-white/15 pt-5 md:col-span-1 md:row-span-2">
                                    <div className="relative z-10 flex h-full flex-col justify-center">
                    <h3 className="Michroma mt-2 md:mt-4 text-3xl md:text-5xl text-white">
                      98.22<small className="text-lg">%</small>
                    </h3>
                    <p className="Jura mt-3 md:mt-4 text-base md:text-lg leading-relaxed text-white/75">
                      Accuracy on MNIST, trained on a consumer laptop
                    </p>
                  </div>
                </article>
                <article
                  aria-hidden="true"
                  className="meteor-card relative flex h-48 md:h-full w-full items-center justify-center overflow-hidden md:col-span-1 md:row-span-2"
                >
                  <BurningMeteor />
                </article>
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="relative flex flex-col justify-center border-t border-white/15 pt-4 md:col-span-1"
                  >
                    <h3 className="Michroma m-0 text-2xl md:text-3xl text-white">
                      {stat.value}
                    </h3>
                    <p className="Jura mb-0 mt-2 text-sm md:text-base leading-snug text-white/75">
                      {stat.label}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
          <div className="slider">
            <div className="slide-track">
              {[...technologies, ...technologies].map((tech, index) => (
                <div key={index} className="slide">
                  <span className="Michroma text-lg tracking-wider text-white/70 whitespace-nowrap">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div ref={laptopStageRef} className={`relative w-full ${webgl ? "h-[220vh]" : "py-16"}`}>
            <div
              {...(webgl && {
                role: "img",
                "aria-label":
                  "A 3D laptop opens to show Deepity: its own C++ and CUDA engine, CPU and GPU support, documentation and tests, and open source.",
              })}
              className={
                webgl
                  ? "sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden mb-10"
                  : "w-full"
              }
            >
              <WebGLBoundary fallback={<LaptopFallback />}>
                {webgl ? (
                <Suspense fallback={null}>
                  {nearLaptop && <LaptopScene progress={laptopProgress} />}
                </Suspense>
                ) : (
                  <LaptopFallback />
                )}
              </WebGLBoundary>
            </div>
          </div>
          <section className="w-full flex flex-col items-center px-6 mt-10 pt-10 pb-8 md:px-16">
            <h2 className="Michroma max-w-4xl text-4xl sm:text-6xl md:text-7xl text-white text-center leading-tight">
              Code Examples
            </h2>
            <hr className="h-1 my-5 w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent border-0" />
            <p className="Jura mb-8 text-center text-base md:text-lg text-white/75">
              The <span className="fancy">same network</span> in Python and C++.
            </p>
            <div className="w-full max-w-[1100px]">
              <CodeTabs files={codeFiles} />
            </div>
          </section>
          <section className="w-full px-6 pb-24 pt-0 md:px-16">
            <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 border-t border-white/15 pt-10 md:flex-row md:items-center">
              <div>
                <h2 className="Michroma m-0 text-2xl md:text-4xl text-white">
                  Building with predictive coding?
                </h2>
                <p className="Jura mb-0 mt-3 text-base md:text-xl text-white/75">
                  Request early access and tell us what you are working on.
                </p>
              </div>
              <Link
                to="/early-access"
                className="Michroma shrink-0 rounded-lg bg-white px-6 py-5 text-sm text-black no-underline transition-colors hover:bg-fuchsia-400"
              >
                Request early access
              </Link>
            </div>
          </section>
      </main>
      <AnimatedWaveBackground />
    </div>
  );
}
