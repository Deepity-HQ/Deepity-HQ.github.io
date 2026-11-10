import { useCallback, useEffect, useRef, useState } from "react";
import { LuPause, LuPlay, LuRotateCcw } from "react-icons/lu";
import { PCNet, makeData, type Dataset, type Point } from "../pcdemo/network.ts";

const SIZES = [2, 16, 16, 1];
const SETTLE = 15;
const BATCH = 60;
const GRID = 44;
const VIEW = 1.15; // half-width of the plane shown

const DATASETS: { id: Dataset; label: string }[] = [
  { id: "circles", label: "Circles" },
  { id: "moons", label: "Moons" },
  { id: "xor", label: "XOR" },
];

const POS = [169, 155, 255];
const NEG = [226, 228, 236];

export default function PCDemo() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const heat = useRef<HTMLCanvasElement | null>(null);
  const points = useRef<HTMLCanvasElement | null>(null);
  const net = useRef<PCNet>(new PCNet(SIZES));
  const data = useRef<Point[]>(makeData("circles"));
  const iter = useRef(0);
  const [kind, setKind] = useState<Dataset>("circles");
  const [running, setRunning] = useState(
    () => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState({ iter: 0, acc: 0.5, energy: 0, layers: [0, 0, 0] });

  const draw = useCallback(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    if (!heat.current) {
      heat.current = document.createElement("canvas");
      heat.current.width = GRID;
      heat.current.height = GRID;
    }
    const hctx = heat.current.getContext("2d");
    if (!hctx) return;
    const img = hctx.createImageData(GRID, GRID);
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const px = ((gx + 0.5) / GRID - 0.5) * 2 * VIEW;
        const py = (0.5 - (gy + 0.5) / GRID) * 2 * VIEW;
        const v = Math.max(-1, Math.min(1, net.current.output(px, py)));
        const c = v > 0 ? POS : NEG;
        const k = (gy * GRID + gx) * 4;
        img.data[k] = c[0];
        img.data[k + 1] = c[1];
        img.data[k + 2] = c[2];
        img.data[k + 3] = Math.round(v > 0 ? 26 + v * 74 : 8 + Math.abs(v) * 42);
      }
    }
    hctx.putImageData(img, 0, 0);

    const W = cv.width;
    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = "#0b0b0d";
    ctx.fillRect(0, 0, W, W);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(heat.current, 0, 0, W, W);
    if (!points.current) {
      // The dots never move, so they are drawn once and reused every frame
      const layer = document.createElement("canvas");
      layer.width = W;
      layer.height = W;
      const lctx = layer.getContext("2d");
      if (lctx) {
        for (const p of data.current) {
          const x = (p.x / (2 * VIEW) + 0.5) * W;
          const y = (0.5 - p.y / (2 * VIEW)) * W;
          lctx.beginPath();
          lctx.arc(x, y, W * 0.0105, 0, Math.PI * 2);
          lctx.fillStyle = p.label === 1 ? "#a99bff" : "#e2e4ec";
          lctx.fill();
          lctx.lineWidth = 1.5;
          lctx.strokeStyle = "#08080a";
          lctx.stroke();
        }
      }
      points.current = layer;
    }
    ctx.drawImage(points.current, 0, 0);
  }, []);

  const reset = useCallback(
    (next: Dataset) => {
      net.current = new PCNet(SIZES);
      data.current = makeData(next);
      points.current = null;
      iter.current = 0;
      setStats({ iter: 0, acc: net.current.accuracy(data.current), energy: 0, layers: [0, 0, 0] });
      draw();
    },
    [draw],
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (!running || !visible) return;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      const d = data.current;
      const batch: Point[] = [];
      const start = (iter.current * 37) % d.length;
      for (let i = 0; i < BATCH; i++) batch.push(d[(start + i * 5) % d.length]);
      net.current.train(batch, SETTLE);
      iter.current++;
      draw();
      if (now - last > 120) {
        last = now;
        setStats({
          iter: iter.current,
          acc: net.current.accuracy(d),
          energy: net.current.energy,
          layers: [...net.current.layerError],
        });
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, visible, draw]);

  const maxErr = Math.max(0.05, ...stats.layers);

  return (
    <div ref={wrap} className="mx-auto grid max-w-[1000px] items-center gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:gap-12">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0d] p-2">
        <canvas
          ref={canvas}
          width={560}
          height={560}
          className="block aspect-square h-auto w-full rounded-lg"
          role="img"
          aria-label="A small neural network learning to separate two groups of points, shown as a shaded decision map."
        />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Dataset">
          {DATASETS.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={kind === d.id}
              onClick={() => {
                setKind(d.id);
                reset(d.id);
              }}
              className={`cursor-pointer rounded-lg border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                kind === d.id
                  ? "border-transparent bg-white text-black"
                  : "border-white/15 bg-white/[0.04] text-white/75 hover:border-white/30 hover:text-white"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <dl className="m-0 mt-7 grid grid-cols-3 gap-4">
          {[
            ["Step", stats.iter.toLocaleString("en-US")],
            ["Accuracy", `${(stats.acc * 100).toFixed(0)}%`],
            ["Energy", stats.energy.toFixed(3)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="mono text-[11px] uppercase tracking-[0.1em] text-white/40">{k}</dt>
              <dd className="tabular m-0 mt-1 text-2xl font-semibold text-white">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7">
          <div className="mono text-[11px] uppercase tracking-[0.1em] text-white/40">
            Prediction error per layer
          </div>
          <div className="mt-3 space-y-2.5">
            {["Layer 1", "Layer 2", "Output"].map((name, i) => (
              <div key={name} className="flex items-center gap-3 text-sm text-white/65">
                <span className="w-16 shrink-0">{name}</span>
                <span className="h-1.5 flex-1 rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-[#a99bff]"
                    style={{ width: `${Math.min(100, (stats.layers[i] / maxErr) * 100)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-2">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            {running ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
            {running ? "Pause" : "Train"}
          </button>
          <button
            type="button"
            onClick={() => reset(kind)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/[0.08]"
          >
            <LuRotateCcw aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
