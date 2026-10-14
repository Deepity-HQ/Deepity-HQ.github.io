import CountUp from "./CountUp";

const results = [
  { value: 98.22, decimals: 2, label: "Deepity held-out", note: "952.6s, 100 epochs", accent: true },
  { value: 98, decimals: 0, label: "ngc-learn best dev", note: "1707.7s, same setup" },
  { value: 97.51, decimals: 2, label: "PyTorch backprop", note: "627.8s, MSE loss" },
];

/** The three matched-setup results, shared by the home page and /benchmarks. */
export default function BenchmarkSummary() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {results.map((r) => (
        <div key={r.label} className="glass p-6">
          <div
            className={`font-[family-name:var(--font-display)] font-light text-4xl tracking-[-0.03em] ${r.accent ? "text-accent" : ""}`}
          >
            <CountUp value={r.value} decimals={r.decimals} suffix="%" />
          </div>
          <div className="label mt-2">{r.label}</div>
          <div className="mt-1 text-sm text-dim">{r.note}</div>
        </div>
      ))}
    </div>
  );
}
