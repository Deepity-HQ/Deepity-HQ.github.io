import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

// tests/tDirectKPPCNetworkDepthScalingVsBP.cpp on one A100, width 128, batch 128.
// Milliseconds per training step.
const data = [
  { depth: 32, dkp: 0.97, bp: 0.99 },
  { depth: 128, dkp: 1.27, bp: 3.71 },
  { depth: 2048, dkp: 11.85, bp: 59.1 },
];

const dim = "#9a9aa5";
const grid = "rgba(255,255,255,0.08)";
const font = "Inter Variable, sans-serif";
const tick = { fill: dim, fontSize: 11, fontFamily: font };

const label = (color: string, dy: number, position: "top" | "bottom") => ({
  position,
  fill: color,
  fontSize: 11,
  fontFamily: font,
  fontWeight: 600,
  offset: dy,
  formatter: (v: unknown) => `${Number(v).toFixed(2)} ms`,
});

export default function DepthChart() {
  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm font-medium text-white">Time per training step against depth</div>
        <div className="flex gap-4 text-xs text-white/70">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[#a99bff]" />
            DKP-PC, batched CUDA
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[#ff9d6b]" />
            Backpropagation
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 28, right: 40, left: 0, bottom: 28 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis
            dataKey="depth"
            type="number"
            scale="log"
            domain={[20, 3000]}
            ticks={[32, 128, 2048]}
            allowDataOverflow
            tick={tick}
            stroke={grid}
            tickLine={false}
            label={{ value: "Network depth, layers, log scale", position: "insideBottom", offset: -6, style: tick }}
          />
          <YAxis
            scale="log"
            domain={[0.5, 100]}
            ticks={[1, 10, 100]}
            allowDataOverflow
            tick={tick}
            stroke={grid}
            tickLine={false}
            width={52}
            tickFormatter={(v: number) => `${v} ms`}
          />
          <Tooltip
            contentStyle={{
              background: "#0e0e10",
              border: `1px solid ${grid}`,
              borderRadius: 10,
              fontFamily: font,
              fontSize: 12,
            }}
            labelStyle={{ color: dim }}
            itemStyle={{ color: "#e6e6e6" }}
            labelFormatter={(l: any) => `${l} layers`}
            formatter={(v: any) => `${Number(v).toFixed(2)} ms`}
            cursor={{ stroke: dim, strokeDasharray: "2 4" }}
          />
          <Line type="monotone" dataKey="bp" name="Backpropagation" stroke="#ff9d6b" strokeWidth={2.5} dot={{ r: 4, fill: "#ff9d6b", strokeWidth: 0 }} isAnimationActive={false}>
            <LabelList dataKey="bp" {...label("#ff9d6b", 10, "top")} />
          </Line>
          <Line type="monotone" dataKey="dkp" name="DKP-PC" stroke="#a99bff" strokeWidth={2.5} dot={{ r: 4, fill: "#a99bff", strokeWidth: 0 }} isAnimationActive={false}>
            <LabelList dataKey="dkp" {...label("#a99bff", 10, "bottom")} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
