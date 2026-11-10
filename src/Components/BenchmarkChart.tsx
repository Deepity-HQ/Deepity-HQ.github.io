import { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Source logs: logs/ in the Deepity repo. MNIST, seed 7. x = cumulative training
// seconds. Deepity and jpc curves are accuracy on a training subset, as logged;
// ngc-learn's is its logged training accuracy, in whole percents.
const dkpTime = [
  1.0, 2.0, 2.9, 3.9, 4.9, 5.9, 6.9, 7.9, 8.9, 9.9, 11.0, 12.0, 13.0, 14.0,
  15.1, 16.1, 17.1, 18.1, 19.1, 20.0, 21.0, 22.0, 22.9, 23.9, 24.9, 25.9, 26.9,
  27.9, 28.9, 29.9, 30.8, 31.8, 32.8, 33.7, 34.7, 35.7, 36.6, 37.6, 38.6, 39.6,
  40.6, 41.6, 42.7, 43.7, 44.7, 45.7, 46.7, 47.7, 48.6, 49.6,
];
const dkpAcc = [
  85.66, 87.57, 89.15, 89.94, 91.46, 92.11, 92.98, 92.89, 93.63, 94.0, 94.16,
  94.06, 94.63, 94.72, 95.06, 94.9, 95.36, 95.81, 95.14, 95.77, 95.36, 96.18,
  96.24, 95.75, 95.68, 95.98, 96.1, 96.26, 96.28, 96.22, 96.49, 96.33, 96.38,
  96.6, 96.49, 96.52, 96.35, 96.31, 96.38, 96.78, 96.61, 96.51, 96.73, 96.61,
  96.91, 96.77, 96.23, 96.53, 96.64, 96.8,
];

const simpleCpu: [number, number][] = [
  [5.4, 93.96], [48.8, 98.08], [96.9, 99.84], [144.6, 100.0], [192.2, 100.0], [239.0, 100.0], [296.3, 100.0], [343.5, 100.0], [390.9, 99.96], [439.3, 100.0], [487.5, 100.0],
];

const jpcCpu: [number, number][] = [
  [6.0, 86.88], [54.1, 96.44], [105.9, 97.84], [157.9, 98.12], [214.6, 98.64], [265.4, 98.8], [315.4, 98.2], [365.7, 98.36], [419.8, 98.36], [474.8, 98.6], [531.4, 98.28],
];

const ngc: [number, number][] = [[20.4, 85], [38.9, 90], [57.6, 92], [76.1, 94], [94.7, 94], [113.2, 94], [131.8, 95], [150.7, 95], [167.4, 95], [184.0, 95], [200.4, 96], [216.4, 96], [234.0, 96], [250.4, 96], [266.3, 96], [288.4, 96], [305.0, 96], [321.6, 97], [338.2, 97], [355.4, 97], [372.1, 97], [388.7, 97], [405.5, 97], [422.0, 97], [438.7, 97], [455.4, 97], [472.1, 97], [488.4, 98], [505.0, 98], [520.9, 98], [538.2, 98], [554.6, 98], [570.6, 98], [587.1, 98], [603.2, 98], [619.7, 98], [635.8, 98], [651.8, 98], [667.9, 98], [684.0, 98], [700.2, 98], [716.5, 98], [732.7, 98], [749.0, 98], [765.5, 98], [782.1, 98], [798.3, 98], [814.8, 98], [830.9, 98], [847.6, 98], [864.2, 98], [881.7, 98], [898.4, 98], [914.8, 99], [931.3, 99], [947.2, 99], [963.1, 99], [979.1, 99], [995.3, 99], [1011.5, 99], [1027.2, 99], [1043.2, 99], [1059.2, 99], [1075.4, 99], [1091.5, 99], [1108.2, 99], [1124.8, 99], [1141.2, 99], [1157.3, 99], [1173.7, 99], [1206.9, 99], [1230.7, 99], [1247.8, 99], [1265.1, 99], [1282.0, 99], [1299.0, 99], [1315.8, 99], [1332.6, 99], [1350.1, 99], [1366.6, 99], [1382.8, 99], [1398.9, 99], [1416.1, 99], [1433.2, 99], [1449.7, 99], [1465.6, 99], [1482.2, 99], [1498.3, 100], [1515.1, 100], [1531.2, 100], [1547.9, 100], [1564.8, 100], [1582.1, 100], [1598.7, 100], [1615.9, 100], [1633.4, 100], [1650.5, 100], [1667.8, 100], [1685.6, 100], [1703.1, 100]];

const simpleGpu: [number, number][] = [
  [0.8, 93.92], [6.8, 98.52], [13.5, 99.72], [20.1, 100.0], [26.8, 99.92], [33.5, 100.0], [40.1, 99.96], [46.8, 99.92], [53.5, 99.92], [60.2, 99.88], [66.8, 99.96],
];

const jpcGpu: [number, number][] = [
  [100.6, 80.52], [153.0, 93.4], [211.1, 94.2], [269.2, 95.08], [327.4, 95.16], [385.5, 95.68], [443.6, 95.2], [501.7, 95.48], [559.8, 94.72], [618.0, 95.24], [676.1, 95.28],
];

type Device = "cpu" | "gpu";

type Series = {
  key: string;
  label: string;
  color: string;
  width: number;
  dash?: string;
  points: [number, number][];
  dy?: number;
};

const CPU: Series[] = [
  { key: "simple", label: "Deepity", color: "#a99bff", width: 2.5, points: simpleCpu, dy: 4 },
  { key: "jpc", label: "jpc", color: "#ffb340", width: 2, points: jpcCpu, dy: 16 },
  { key: "dkp", label: "Deepity DKP", color: "#7dd3fc", width: 2, points: dkpTime.map((t, i) => [t, dkpAcc[i]] as [number, number]), dy: 4 },
  { key: "ngc", label: "ngc-learn", color: "#8d8d98", width: 1.75, dash: "6 5", points: ngc, dy: 18 },
];

const GPU: Series[] = [
  { key: "simple", label: "Deepity (A100)", color: "#a99bff", width: 2.5, points: simpleGpu, dy: 4 },
  { key: "jpc", label: "jpc (A100)", color: "#ffb340", width: 2, points: jpcGpu, dy: 4 },
];

const DEVICES: Record<Device, { series: Series[]; domain: [number, number]; ticks: number[]; yMin: number; note: string }> = {
  cpu: {
    series: CPU,
    domain: [1, 2000],
    ticks: [1, 10, 100, 1000],
    yMin: 80,
    note: "Laptop CPU, 12th Gen Intel Core i7-12700H. Deepity and jpc are shown every 10 epochs, and ngc-learn reports whole percents.",
  },
  gpu: {
    series: GPU,
    domain: [0.5, 1000],
    ticks: [1, 10, 100, 1000],
    yMin: 75,
    note: "One NVIDIA A100. Deepity and jpc are shown every 10 epochs. jpc spends about 95 seconds of epoch 1 compiling kernels.",
  },
};

function buildPoints(series: Series[]) {
  const rows: Record<string, number>[] = [];
  for (const s of series) for (const [t, a] of s.points) rows.push({ t, [s.key]: a });
  return rows.sort((a, b) => a.t - b.t);
}

const dim = "#9a9aa5";
const grid = "rgba(255,255,255,0.08)";
const font = "Inter Variable, sans-serif";
const tick = { fill: dim, fontSize: 11, fontFamily: font };

export default function BenchmarkChart() {
  const [device, setDevice] = useState<Device>("cpu");
  const [off, setOff] = useState<Record<string, boolean>>({});
  const cfg = DEVICES[device];
  const data = buildPoints(cfg.series);
  const toggle = (k: string) => setOff((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className="w-full rounded-xl border border-white/10 bg-[#0b0b0d] p-4 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-white">Accuracy over training time</div>
          <div role="tablist" className="flex rounded-lg border border-white/10 p-0.5">
            {(["cpu", "gpu"] as Device[]).map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={device === d}
                onClick={() => setDevice(d)}
                className={`cursor-pointer rounded-md border-0 px-3 py-1 text-xs font-medium transition-colors ${
                  device === d ? "bg-white text-black" : "bg-transparent text-white/60 hover:text-white"
                }`}
              >
                {d === "cpu" ? "CPU" : "A100"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {cfg.series.map((x) => (
            <button
              key={x.key}
              type="button"
              aria-pressed={!off[x.key]}
              onClick={() => toggle(x.key)}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition-colors ${
                off[x.key]
                  ? "border-white/10 bg-transparent text-white/40"
                  : "border-white/15 bg-white/[0.05] text-white"
              }`}
            >
              <span
                className="inline-block h-0.5 w-3 rounded-full"
                style={{ background: off[x.key] ? "rgba(255,255,255,0.25)" : x.color }}
              />
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <ComposedChart data={data} margin={{ top: 12, right: 24, left: 0, bottom: 12 }}>
          <CartesianGrid stroke={grid} vertical={false} />
          <XAxis
            type="number"
            dataKey="t"
            scale="log"
            domain={cfg.domain}
            ticks={cfg.ticks}
            allowDataOverflow
            tick={tick}
            stroke={grid}
            tickLine={false}
            tickFormatter={(v: number) => `${v}s`}
            label={{ value: "Training time, log scale", position: "insideBottom", offset: -6, style: tick }}
          />
          <YAxis
            domain={[cfg.yMin, 102]}
            ticks={cfg.yMin === 80 ? [80, 85, 90, 95, 100] : [75, 80, 85, 90, 95, 100]}
            allowDataOverflow
            tick={tick}
            stroke={grid}
            tickLine={false}
            width={44}
            tickFormatter={(v: number) => `${v}%`}
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
            labelFormatter={(l: any) => `${l}s`}
            formatter={(v: any) => `${Number(v).toFixed(2)}%`}
            cursor={{ stroke: dim, strokeDasharray: "2 4" }}
          />
          {cfg.series.map((s) => {
            const lastIdx = data.findLastIndex((p) => p[s.key] != null);
            return (
              <Line
                key={`${device}-${s.key}`}
                type="monotone"
                dataKey={s.key}
                hide={off[s.key]}
                name={s.label}
                stroke={s.color}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                dot={false}
                connectNulls
                isAnimationActive={false}
                label={(p: any) =>
                  p.index === lastIdx ? (
                    <text
                      key={`${s.key}-label`}
                      x={p.x + (s.key === "ngc" ? -10 : 8)}
                      y={p.y + (s.dy ?? 4)}
                      textAnchor={s.key === "ngc" ? "end" : "start"}
                      fill={s.color}
                      fontSize={11}
                      fontFamily={font}
                      fontWeight={600}
                      stroke="#0b0b0d"
                      strokeWidth={4}
                      strokeLinejoin="round"
                      paintOrder="stroke"
                    >
                      {s.label}
                    </text>
                  ) : null
                }
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
      <p className="m-0 mt-3 text-xs leading-relaxed text-white/45">
        Curves show training accuracy as logged. {cfg.note} The held-out results are in the table.
      </p>
    </div>
  );
}
