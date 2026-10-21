import useInView from "../lib/useInView";

const runs = [
  { name: "Deepity", time: 644.1, ours: true },
  { name: "ngc-learn", time: 1707.7 },
  { name: "PyTorch", time: 627.8 },
];
const max = Math.max(...runs.map((r) => r.time));
const AREA = 200;

export default function ColumnBars() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className="flex h-full flex-col">
      <div className="flex flex-1 items-end justify-center gap-6 px-4 pt-6 md:gap-10" style={{ minHeight: AREA + 56 }}>
        {runs.map((r, i) => (
          <div key={r.name} className="flex flex-col items-center">
            <div className="mb-2 text-sm tabular-nums text-dim">{r.time.toFixed(1)}s</div>
            <div className="flex w-12 flex-col items-center md:w-14" style={{ height: AREA, justifyContent: "flex-end" }}>
              <div
                className="w-full rounded-t-lg transition-[height] duration-[1200ms] ease-out"
                style={{
                  height: seen ? `${(r.time / max) * AREA}px` : "0px",
                  transitionDelay: `${i * 120}ms`,
                  background: r.ours
                    ? "linear-gradient(to bottom, var(--accent), var(--glow-cool))"
                    : "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.04))",
                }}
              />
            </div>
            <div className={`mt-3 text-sm ${r.ours ? "text-fg" : "text-dim"}`}>{r.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
