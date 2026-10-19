import { useEffect, useState } from "react";

const steps = [
  { name: "Predict", text: "Each layer predicts the activity of the layer it connects to." },
  { name: "Compare", text: "The gap between the prediction and the actual activity is that layer's prediction error." },
  { name: "Update", text: "Neurons change to shrink their own error, and the weights follow. Each update uses only that layer and its neighbors." },
];

const R = 90;
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

  const pick = (i) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="panel-flat rounded-2xl border border-line px-4 py-10 md:px-10 md:py-14">
      <div className="mb-10 max-w-xl">
        <h2 className="m-0 font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] md:text-4xl">
          Predict, compare, update
        </h2>
        <p className="mb-0 mt-4 text-dim">Each layer repeats this cycle until its error stops changing.</p>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[260px_1fr]">
        <div className="relative mx-auto h-[220px] w-[220px]">
          <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#b229ff" />
                <stop offset="1" stopColor="#29cbfc" />
              </linearGradient>
            </defs>
            <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <circle
              key={`${active}-${auto}`}
              className={auto ? "ring-progress" : ""}
              cx="110"
              cy="110"
              r={R}
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="565.5"
              strokeDashoffset={auto ? undefined : 0}
            />
          </svg>
          <div className="absolute inset-[26px] flex flex-col items-center justify-center rounded-full border border-line bg-black text-center">
            <div className="label">Step {String(active + 1).padStart(2, "0")}</div>
            <div className="mt-1 font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em]">{steps[active].name}</div>
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
                    className={`mt-1 h-3 w-3 rounded-full border transition-colors duration-300 ${
                      i === active ? "border-accent bg-accent" : i < active ? "border-white/60 bg-white/60" : "border-line-strong bg-transparent"
                    }`}
                  />
                  {i < steps.length - 1 && <span className="my-1 w-px flex-1 bg-[color:var(--line-strong)]" />}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3">
                    <span className={`font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em] ${i === active ? "text-fg" : "text-dim"}`}>
                      {s.name}
                    </span>
                    <span className="rounded-md border border-line bg-white/[0.04] px-2 py-0.5 text-xs text-dim">{state}</span>
                  </div>
                  <p className={`m-0 mt-2 max-w-md text-base transition-colors duration-300 ${i === active ? "text-dim" : "text-faint"}`}>
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
