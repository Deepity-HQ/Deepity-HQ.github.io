import { useState } from "react";
import MainFooter from "./components/MainFooter";
import PageHeader from "./components/PageHeader";
import TutorialCard from "./components/TutorialCard";
import Reveal from "./components/Reveal";

const tutorialsData = [
  {
    title: "0. Intro to Predictive Coding",
    subtitle: "Beginner",
    description:
      "For people with little to no knowledge of predictive coding and Deepity.",
    img: "/tutorials/doorway.webp",
    link: "0-introduction",
  },
  {
    title: "1. Understanding the Deepity Library",
    subtitle: "Beginner",
    description:
      "Explanation of what makes Deepity special and how to load/use it.",
    img: "/tutorials/laptop.webp",
    link: "/tutorial/1-beginning",
  },
  {
    title: "2. Training a SimplePCN on XOR",
    subtitle: "Intermediate",
    description:
      "Get your first experience training the canonical PCN on a simple function.",
    img: "/tutorials/ripple.webp",
    link: "/notfound",
  },
  {
    title: "3. Adding Helpful Hyperparameters",
    subtitle: "Intermediate",
    description:
      "Now that you know how to use a SimplePCN, try converting to a SequentialPCN and tweaking parameters like precision and lambda.",
    img: "/tutorials/dartboard.webp",
    link: "/notfound",
  },
  {
    title: "4. Running a Convolutional PCN",
    subtitle: "Hard",
    description:
      "Attempt to convolve the output over an image in 2D, capturing higher accuracy.",
    img: "/tutorials/dimension.webp",
    link: "/notfound",
  },
  {
    title: "5. Direct Kolen-Pollack Networks on MNIST",
    subtitle: "Hard",
    description:
      "Research how propagating feedback can make convergence hyperfast.",
    img: "/tutorials/wired.webp",
    link: "/notfound",
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Hard"];

export default function TutorialLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [level, setLevel] = useState("All");

  const filteredTutorials = tutorialsData
    .filter((tutorial) => level === "All" || tutorial.subtitle === level)
    .filter(
      (tutorial) =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutorial.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Learn Deepity"
        eyebrow="Interactive Guides"
        width={1280}
      >
        From first principles to practical networks: step-by-step guides for
        training predictive coding models in C++ and Python.
      </PageHeader>

      <div className="mx-auto max-w-[1280px] px-5 pb-16 md:px-8">
        <div className="mx-auto max-w-xl pb-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4.5">
              <svg
                className="h-4 w-4 text-dim"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search guides, concepts, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line-strong bg-panel/90 py-3.5 pl-11 pr-5 font-[inherit] text-sm text-fg placeholder:text-faint focus:border-accent focus:shadow-[0_0_24px_rgba(178,41,255,0.18)] focus:outline-none transition-all"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={`cursor-pointer rounded-lg border px-4 py-1.5 text-xs font-[family-name:var(--font-display)] uppercase tracking-wider transition-colors ${
                  level === l
                    ? "border-transparent bg-fg text-bg font-semibold"
                    : "border-line bg-fg/[0.04] text-dim hover:text-fg hover:border-line-strong"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial, index) => (
              <Reveal
                key={tutorial.title}
                delay={(index % 3) * 90}
                className="h-full"
              >
                <TutorialCard
                  title={tutorial.title}
                  subtitle={tutorial.subtitle}
                  description={tutorial.description}
                  img={tutorial.img}
                  link={tutorial.link}
                />
              </Reveal>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-dim">
              <p className="text-lg">No tutorials found matching "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setLevel("All");
                }}
                className="btn mt-4 text-sm"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
      <MainFooter />
    </div>
  );
}
