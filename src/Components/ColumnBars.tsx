import useInView from "./useInView.ts";

const runs = [
  { name: "Deepity", time: 487.5, ours: true },
  { name: "jpc", time: 531.4, ours: false },
  { name: "ngc-learn", time: 1707.7, ours: false },
  { name: "PyTorch", time: 627.8, ours: false },
];
const max = Math.max(...runs.map((r) => r.time));
const AREA = 200;

export default function ColumnBars() {
  const [ref, seen] = useInView();
  return (
    <div ref={ref} className="flex h-full flex-col justify-end">
      {/* Values and bars share one baseline */}
      <div
        className="flex items-end justify-center gap-5 border-b border-white/10 px-2 pt-6 sm:gap-8 md:gap-10"
        style={{ minHeight: AREA + 44 }}
      >
        {runs.map((r, i) => {
          const barHeight = (r.time / max) * AREA;
          return (
            <div key={r.name} className="flex flex-col items-center">
              <div
                className={`Michroma mb-2 text-xs tabular-nums ${
                  r.ours ? "text-[#a99bff]" : "text-white/70"
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
                      ? "linear-gradient(to bottom, #8b7cff, #7dd3fc)"
                      : "linear-gradient(to bottom, rgba(255,255,255,0.28), rgba(255,255,255,0.06))",
                    boxShadow: r.ours
                      ? "0 0 24px rgba(139, 124, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.5)"
                      : "inset 0 1px 0 rgba(255,255,255,0.1)",
                    border: r.ours ? "1px solid #8b7cff" : "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex min-h-[50px] justify-center gap-5 px-2 pt-3 sm:gap-8 md:gap-10">
        {runs.map((r) => (
          <div key={r.name} className="flex w-12 flex-col items-center md:w-14">
            <span
              className={`Jura whitespace-nowrap text-xs md:text-sm ${
                r.ours ? "text-white" : "text-white/70"
              }`}
            >
              {r.name}
            </span>
            {r.ours && (
              <span className="Michroma mt-1 whitespace-nowrap rounded-md bg-[#8b7cff]/20 px-2 py-0.5 text-[10px] text-[#a99bff]">
                Fastest
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
