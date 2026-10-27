import { useEffect, useState } from "react";
import { headingClass } from "./ui.ts";

const steps = [
  { name: "Predict", text: "Each layer predicts the activity of the layer it connects to." },
  { name: "Compare", text: "The gap between the prediction and the actual activity is that layer's prediction error." },
  { name: "Update", text: "Neurons change to shrink their own error, and the weights follow. Each update uses only that layer and its neighbors." },
];

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function PCStepper() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(!reduced());

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setActive((a) => (a + 1) % steps.length), 3200);
    return () => clearInterval(id);
  }, [auto]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a0a0b] px-4 py-10 md:px-10 md:py-14">
      <div className="mb-10 max-w-xl">
        <h2 className={`${headingClass} text-2xl md:text-3xl`}>Predict, compare, update</h2>
        <p className="Jura mb-0 mt-4 text-white/75">
          Each layer repeats this cycle until its error stops changing.
        </p>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[260px_1fr]">
        <div className="relative flex h-[200px] w-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0e0e0f] p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="Michroma text-xs tracking-wider text-[#a99bff]">
              Step 0{active + 1} / 0{steps.length}
            </span>
            <span className="Michroma rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/70">
              Active
            </span>
          </div>

          <div>
            <div className="Michroma text-2xl tracking-[-0.02em] text-white">
              {steps[active].name}
            </div>
            <p className="Jura m-0 mt-2 line-clamp-2 text-xs text-white/70">
              {steps[active].text}
            </p>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-md bg-white/15">
            <div
              className="h-full bg-gradient-to-r from-[#8b7cff] via-[#7dd3fc] to-[#8b7cff] transition-all duration-500 ease-out"
              style={{ width: `${((active + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col">
          {steps.map((s, i) => {
            const state = i < active ? "Done" : i === active ? "Now" : "Next";
            return (
              <button
                key={s.name}
                type="button"
                aria-pressed={i === active}
                onClick={() => pick(i)}
                className="group flex cursor-pointer gap-4 border-0 bg-transparent p-0 text-left"
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1.5 h-4 w-1 rounded-sm transition-colors duration-300 ${
                      i === active
                        ? "bg-[#8b7cff] shadow-[0_0_8px_#8b7cff]"
                        : i < active
                          ? "bg-white/60"
                          : "bg-white/20"
                    }`}
                  />
                  {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-white/20" />}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className={`Michroma text-xl tracking-[-0.01em] ${
                        i === active ? "text-white" : "text-white/70"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="Michroma rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/70">
                      {state}
                    </span>
                  </div>
                  <p
                    className={`Jura m-0 mt-2 max-w-md text-base transition-colors duration-300 ${
                      i === active ? "text-white/75" : "text-white/45"
                    }`}
                  >
                    {s.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

