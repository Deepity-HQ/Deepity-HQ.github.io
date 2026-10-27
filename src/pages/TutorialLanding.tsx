import { useState } from "react";
import PageHeader from "../Components/PageHeader.tsx";
import TutorialCard from "../Components/TutorialCard.tsx";
import Reveal from "../Components/Reveal.tsx";
import { btnClass } from "../Components/ui.ts";

const tutorialsData = [
  {
    title: "0. Intro to Predictive Coding",
    subtitle: "Beginner",
    description:
      "For people with little to no knowledge of predictive coding and Deepity.",
    img: "/tutorials/doorway.webp",
    link: "/tutorial/0-introduction",
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

  const q = searchQuery.toLowerCase();
  const filteredTutorials = tutorialsData
    .filter((t) => level === "All" || t.subtitle === level)
    .filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q),
    );

  return (
    <div className="min-h-screen">
      <PageHeader title="Learn Deepity" eyebrow="Interactive Guides" width={1280}>
        From first principles to practical networks: step-by-step guides for
        training predictive coding models in C++ and Python.
      </PageHeader>

      <div className="mx-auto max-w-[1280px] px-5 pb-16 md:px-8">
        <div className="mx-auto max-w-xl pb-10">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg
                className="h-4 w-4 text-white/60"
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
              aria-label="Search tutorials"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="Jura w-full rounded-xl border border-white/15 bg-[#0c0c0d]/90 py-3.5 pl-11 pr-5 text-sm text-white transition-all placeholder:text-white/40 focus:border-[#8b7cff] focus:shadow-[0_0_24px_rgba(139,124,255,0.2)] focus:outline-none"
            />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={level === l}
                onClick={() => setLevel(l)}
                className={`Michroma cursor-pointer rounded-lg border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  level === l
                    ? "border-transparent bg-white text-black"
                    : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((t, index) => (
              <Reveal key={t.title} delay={(index % 3) * 90} className="h-full">
                <TutorialCard {...t} />
              </Reveal>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-white/70">
              <p className="Jura text-lg">
                No tutorials found matching "{searchQuery}"
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setLevel("All");
                }}
                className={`${btnClass} mt-4 cursor-pointer`}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
