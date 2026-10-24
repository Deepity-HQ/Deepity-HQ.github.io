import useInView from "../lib/useInView";

const runs = [
  { name: "Deepity", time: 541.1, ours: true },
  { name: "jpc", time: 545.3 },
  { name: "ngc-learn", time: 1707.7 },
  { name: "PyTorch", time: 627.8 },
];
const max = Math.max(...runs.map((r) => r.time));
const AREA = 200;

export default function ColumnBars() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className="flex h-full flex-col justify-end">
      {/* Upper area: values and bars sharing the exact same baseline */}
      <div
        className="flex items-end justify-center gap-5 px-2 pt-6 sm:gap-8 md:gap-10 border-b border-line"
        style={{ minHeight: AREA + 44 }}
      >
        {runs.map((r, i) => {
          const barHeight = (r.time / max) * AREA;
          return (
            <div key={r.name} className="flex flex-col items-center">
              <div
                className={`mb-2 font-[family-name:var(--font-display)] text-xs tabular-nums md:text-sm ${
                  r.ours ? "font-semibold text-accent-text" : "text-dim"
                }`}
              >
                {r.time.toFixed(1)}s
              </div>
              <div
                className="flex w-12 flex-col items-center md:w-14"
                style={{ height: AREA, justifyContent: "flex-end" }}
              >
                <div
                  className="w-full rounded-t-lg transition-[height,opacity] duration-[1000ms] ease-out"
                  style={{
                    height: seen ? `${barHeight}px` : `${Math.max(4, barHeight * 0.1)}px`,
                    opacity: seen ? 1 : 0.6,
                    transitionDelay: `${i * 100}ms`,
                    background: r.ours
                      ? "linear-gradient(to bottom, var(--accent), var(--glow-cool))"
                      : "var(--bar-baseline)",
                    boxShadow: r.ours
                      ? "0 0 24px rgba(178, 41, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.5)"
                      : "inset 0 1px 0 var(--line)",
                    border: r.ours
                      ? "1px solid var(--accent)"
                      : "var(--bar-border)",
                    borderBottom: "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower area: labels beneath the baseline */}
      <div className="flex justify-center gap-5 px-2 pt-3 sm:gap-8 md:gap-10 min-h-[50px]">
        {runs.map((r) => (
          <div key={r.name} className="flex w-12 flex-col items-center md:w-14">
            <span
              className={`whitespace-nowrap text-xs md:text-sm font-medium ${
                r.ours ? "text-fg" : "text-dim"
              }`}
            >
              {r.name}
            </span>
            {r.ours && (
              <span className="mt-1 rounded-md bg-accent/20 px-2 py-0.5 text-[10px] font-[family-name:var(--font-display)] text-accent-text whitespace-nowrap">
                Fastest
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
