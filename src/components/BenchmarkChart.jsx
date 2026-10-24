import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Source logs: resources/*.txt. MNIST, same laptop CPU, seed 7.
// x = cumulative training seconds. Deepity curves are accuracy on a training
// subset (as logged); ngc-learn's is its logged training accuracy, whole percents.
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

const simple = [
  [5.8, 93.96], [54.2, 98.0], [108.0, 99.76], [162.2, 99.96], [216.2, 100.0], [269.3, 100.0], [322.7, 100.0], [377.1, 100.0], [431.8, 99.96], [486.7, 100.0], [541.1, 100.0],
];

const jpc = [
  [6.7, 86.88], [59.8, 96.44], [113.5, 97.84], [167.0, 98.12], [220.3, 98.64], [273.7, 98.8], [327.5, 98.2], [381.9, 98.36], [436.3, 98.36], [490.7, 98.6], [545.3, 98.28],
];

const ngc = [[20.4, 85], [38.9, 90], [57.6, 92], [76.1, 94], [94.7, 94], [113.2, 94], [131.8, 95], [150.7, 95], [167.4, 95], [184.0, 95], [200.4, 96], [216.4, 96], [234.0, 96], [250.4, 96], [266.3, 96], [288.4, 96], [305.0, 96], [321.6, 97], [338.2, 97], [355.4, 97], [372.1, 97], [388.7, 97], [405.5, 97], [422.0, 97], [438.7, 97], [455.4, 97], [472.1, 97], [488.4, 98], [505.0, 98], [520.9, 98], [538.2, 98], [554.6, 98], [570.6, 98], [587.1, 98], [603.2, 98], [619.7, 98], [635.8, 98], [651.8, 98], [667.9, 98], [684.0, 98], [700.2, 98], [716.5, 98], [732.7, 98], [749.0, 98], [765.5, 98], [782.1, 98], [798.3, 98], [814.8, 98], [830.9, 98], [847.6, 98], [864.2, 98], [881.7, 98], [898.4, 98], [914.8, 99], [931.3, 99], [947.2, 99], [963.1, 99], [979.1, 99], [995.3, 99], [1011.5, 99], [1027.2, 99], [1043.2, 99], [1059.2, 99], [1075.4, 99], [1091.5, 99], [1108.2, 99], [1124.8, 99], [1141.2, 99], [1157.3, 99], [1173.7, 99], [1206.9, 99], [1230.7, 99], [1247.8, 99], [1265.1, 99], [1282.0, 99], [1299.0, 99], [1315.8, 99], [1332.6, 99], [1350.1, 99], [1366.6, 99], [1382.8, 99], [1398.9, 99], [1416.1, 99], [1433.2, 99], [1449.7, 99], [1465.6, 99], [1482.2, 99], [1498.3, 100], [1515.1, 100], [1531.2, 100], [1547.9, 100], [1564.8, 100], [1582.1, 100], [1598.7, 100], [1615.9, 100], [1633.4, 100], [1650.5, 100], [1667.8, 100], [1685.6, 100], [1703.1, 100]];

const points = [
  ...dkpTime.map((t, i) => ({ t, dkp: dkpAcc[i] })),
  ...simple.map(([t, a]) => ({ t, simple: a })),
  ...jpc.map(([t, a]) => ({ t, jpc: a })),
  ...ngc.map(([t, a]) => ({ t, ngc: a })),
].sort((a, b) => a.t - b.t);

function token(name, fallback) {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

const SERIES = [
  { key: "simple", label: "Deepity", dot: "var(--accent)" },
  { key: "dkp", label: "Deepity DKP", dot: "var(--glow-cool)" },
  { key: "jpc", label: "jpc", dot: "#ffb340" },
  { key: "ngc", label: "ngc-learn", dot: "var(--fg-dim)" },
];

export default function BenchmarkChart() {
  const [off, setOff] = useState({});
  const [, setThemeTick] = useState(0);

  useEffect(() => {
    const onTheme = () => setThemeTick((t) => t + 1);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onTheme);
    const obs = new MutationObserver(() => onTheme());
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => {
      mq.removeEventListener("change", onTheme);
      obs.disconnect();
    };
  }, []);

  const toggle = (k) => setOff((o) => ({ ...o, [k]: !o[k] }));
  const accent = token("--accent", "#b229ff");
  const cool = token("--glow-cool", "#29cbfc");
  const warm = "#ffb340";
  const grid = token("--line", "rgba(255,255,255,0.09)");
  const dim = token("--fg-dim", "#9a9a9a");
  const fg = token("--fg", "#e6e6e6");
  const displayFont = token("--font-display", "sans-serif");
  const tick = { fill: dim, fontSize: 12, fontFamily: displayFont };

  return (
    <div className="w-full">
      <div className="card-dark p-4 md:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="label">Accuracy over training time</div>
          <div className="flex flex-wrap gap-2">
            {SERIES.map((x) => (
              <button
                key={x.key}
                type="button"
                aria-pressed={!off[x.key]}
                onClick={() => toggle(x.key)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1 text-sm font-[family-name:var(--font-display)] transition-colors ${
                  off[x.key]
                    ? "border-line bg-transparent text-dim"
                    : "border-transparent bg-fg text-bg"
                }`}
              >
                <span
                  className="inline-block h-1.5 w-3 rounded-[2px]"
                  style={{ background: off[x.key] ? "var(--fg-faint)" : x.dot }}
                />
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart
            data={points}
            margin={{ top: 16, right: 20, left: 4, bottom: 12 }}
          >
            <CartesianGrid stroke={grid} strokeDasharray="2 4" />

            <XAxis
              type="number"
              dataKey="t"
              scale="log"
              domain={[1, 2000]}
              ticks={[1, 10, 100, 1000]}
              allowDataOverflow
              tick={tick}
              stroke={grid}
              tickLine={{ stroke: dim }}
              tickFormatter={(v) => `${v}s`}
              label={{
                value: "Training time (log scale)",
                position: "insideBottom",
                offset: -8,
                style: { ...tick, letterSpacing: "0.05em" },
              }}
            />

            <YAxis
              domain={[80, 102]}
              ticks={[80, 85, 90, 95, 100]}
              allowDataOverflow
              tick={tick}
              stroke={grid}
              tickLine={{ stroke: dim }}
              width={44}
              tickFormatter={(v) => `${v}%`}
            />

            <Tooltip
              contentStyle={{
                background: "var(--panel)",
                border: `1px solid ${grid}`,
                borderRadius: 12,
                fontFamily: displayFont,
                fontSize: 13,
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              }}
              labelStyle={{ color: dim }}
              itemStyle={{ color: fg }}
              labelFormatter={(l) => `${l}s`}
              formatter={(v) => `${Number(v).toFixed(2)}%`}
              cursor={{ stroke: dim, strokeDasharray: "2 4" }}
            />

            <Line
              type="monotone"
              dataKey="simple"
              hide={off.simple}
              name="Deepity"
              stroke={accent}
              strokeWidth={2.5}
              dot={false}
              connectNulls
              isAnimationActive={false}
              label={(p) =>
                p.index === simpleLabelIndex ? (
                  <text
                    key="simple-label"
                    x={p.x + 10}
                    y={p.y + 4}
                    fill={accent}
                    fontSize={12}
                    fontFamily={displayFont}
                    fontWeight={600}
                    stroke="var(--panel)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    Deepity
                  </text>
                ) : null
              }
            />

            <Line
              type="monotone"
              dataKey="dkp"
              hide={off.dkp}
              name="Deepity DKP"
              stroke={cool}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive={false}
              label={(p) =>
                p.index === dkpLabelIndex ? (
                  <text
                    key="dkp-label"
                    x={p.x + 10}
                    y={p.y + 4}
                    fill={cool}
                    fontSize={12}
                    fontFamily={displayFont}
                    fontWeight={600}
                    stroke="var(--panel)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    Deepity DKP
                  </text>
                ) : null
              }
            />

            <Line
              type="monotone"
              dataKey="jpc"
              hide={off.jpc}
              name="jpc"
              stroke={warm}
              strokeWidth={2}
              dot={false}
              connectNulls
              isAnimationActive={false}
              label={(p) =>
                p.index === jpcLabelIndex ? (
                  <text
                    key="jpc-label"
                    x={p.x + 10}
                    y={p.y + 14}
                    fill={warm}
                    fontSize={12}
                    fontFamily={displayFont}
                    fontWeight={600}
                    stroke="var(--panel)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    jpc
                  </text>
                ) : null
              }
            />

            <Line
              type="monotone"
              dataKey="ngc"
              hide={off.ngc}
              name="ngc-learn"
              stroke={dim}
              strokeWidth={1.75}
              strokeDasharray="6 5"
              dot={false}
              connectNulls
              isAnimationActive={false}
              label={(p) =>
                p.index === lastNgcIndex ? (
                  <text
                    key="ngc-label"
                    x={p.x - 10}
                    y={p.y + 16}
                    textAnchor="end"
                    fill={dim}
                    fontSize={12}
                    fontFamily={displayFont}
                    fontWeight={600}
                    stroke="var(--panel)"
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    ngc-learn
                  </text>
                ) : null
              }
            />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="m-0 mt-3 text-xs text-dim">
          These curves show training accuracy as logged.
          Deepity and jpc are shown every 10 epochs, and ngc-learn reports whole
          percents. The held-out results are below.
        </p>
      </div>

    </div>
  );
}

const simpleLabelIndex = points.findIndex((p) => p.t === simple.at(-1)[0]);
const dkpLabelIndex = points.findIndex((p) => p.t === dkpTime.at(-1));
const jpcLabelIndex = points.findIndex((p) => p.t === jpc.at(-1)[0]);
const lastNgcIndex = points.findLastIndex((p) => p.ngc != null);
