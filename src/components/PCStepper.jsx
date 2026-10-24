import { useEffect, useState } from "react";

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
        <div className="card-dark relative flex h-[200px] w-full flex-col justify-between rounded-2xl border border-line p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="label text-xs tracking-wider text-accent-text">
              Step 0{active + 1} / 0{steps.length}
            </span>
            <span className="rounded-md border border-line bg-fg/[0.04] px-2 py-0.5 text-[11px] font-[family-name:var(--font-display)] text-dim">
              Active
            </span>
          </div>

          <div>
            <div className="font-[family-name:var(--font-display)] text-3xl tracking-[-0.02em] text-fg">
              {steps[active].name}
            </div>
            <p className="m-0 mt-2 text-xs text-dim line-clamp-2">
              {steps[active].text}
            </p>
          </div>

          <div>
            <div className="h-1.5 w-full overflow-hidden rounded-md bg-[color:var(--line-strong)]">
              <div
                className="h-full bg-gradient-to-r from-accent via-cool to-accent transition-all duration-500 ease-out"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
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
                        ? "bg-accent shadow-[0_0_8px_var(--accent)]"
                        : i < active
                          ? "bg-fg/60"
                          : "bg-line-strong"
                    }`}
                  />
                  {i < steps.length - 1 && (
                    <span className="my-1 w-px flex-1 bg-[color:var(--line-strong)]" />
                  )}
                </div>
                <div className="pb-8">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-[family-name:var(--font-display)] text-2xl tracking-[-0.01em] ${
                        i === active ? "text-fg" : "text-dim"
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="rounded-md border border-line bg-fg/[0.04] px-2 py-0.5 text-xs text-dim">
                      {state}
                    </span>
                  </div>
                  <p
                    className={`m-0 mt-2 max-w-md text-base transition-colors duration-300 ${
                      i === active ? "text-dim" : "text-faint"
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
