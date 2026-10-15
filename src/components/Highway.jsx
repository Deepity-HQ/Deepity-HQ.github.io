import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

const EXTEND = 140;
const JOG = 60;
const CORNER = 36;
const SEGMENTS = 14;

function buildRoads(w, h, layout = "hero") {
  if (layout !== "hero") return buildCornerRoads(w, h, layout);
  const a = Math.max(24, w * 0.035);
  const b = a + JOG;
  const x1 = w * 0.16;
  const step = 22;
  const E = EXTEND;
  return [
    { tone: "accent", pts: [[a, -E], [a, h * 0.2], [b, h * 0.2 + JOG], [b, h * 0.62], [a, h * 0.62 + JOG], [a, h + E]] },
    { tone: "white", pts: [[w - a, h + E], [w - a, h * 0.8], [w - b, h * 0.8 - JOG], [w - b, h * 0.38], [w - a, h * 0.38 - JOG], [w - a, -E]] },
    { tone: "accent", pts: [[-E, 34], [x1, 34], [x1 + step, 12], [w - x1 - step, 12], [w - x1, 34], [w + E, 34]] },
    { tone: "white", pts: [[w + E, h - 32], [w - x1, h - 32], [w - x1 - step, h - 10], [x1 + step, h - 10], [x1, h - 32], [-E, h - 32]] },
  ];
}

function buildCornerRoads(w, h, layout) {
  const E = EXTEND;
  const j = Math.min(JOG, w * 0.25);
  const j2 = Math.min(j, w * 0.15);
  const roads = [
    { tone: "accent", pts: [[-E, h * 0.62], [w * 0.45, h * 0.62], [w * 0.45 + j, h * 0.62 - j], [w * 0.45 + j, -E]] },
    { tone: "white", pts: [[w * 0.18, -E], [w * 0.18, h * 0.3], [w * 0.18 - j2, h * 0.3 + j2], [-E, h * 0.3 + j2]] },
  ];
  if (layout === "br") {
    return roads.map((r) => ({ ...r, pts: r.pts.map(([x, y]) => [w - x, h - y]) }));
  }
  return roads;
}

function buildNodes(w, h) {
  const a = Math.max(24, w * 0.035);
  const b = a + JOG;
  return [
    { label: "Python examples", short: "Python", hash: "code", x: a, y: h * 0.14, dir: "right" },
    { label: "C++ API docs", short: "C++", href: "/docs/index.html", x: b, y: h * 0.42, dir: "right" },
    { label: "CPU benchmarks", short: "CPU", hash: "results", x: w - b, y: h * 0.58, dir: "left" },
    { label: "GPU and CUDA", short: "CUDA", to: "/about", x: w - a, y: h * 0.86, dir: "left" },
  ];
}

function HighwayNode({ n, w }) {
  const side = n.dir === "right" ? { left: n.x - 15 } : { right: w - n.x - 15 };
  const cls =
    "highway-node group pointer-events-auto absolute flex items-center rounded-full border border-transparent no-underline transition-colors duration-300 hover:border-line-strong hover:bg-[#131314] focus-visible:border-line-strong focus-visible:bg-[#131314] " +
    (n.dir === "right" ? "flex-row" : "flex-row-reverse");
  const body = (
    <>
      <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
        <span className="node-ring absolute h-2 w-2 rounded-full border border-white/50" />
        <span className="h-2 w-2 rounded-full bg-white transition-all duration-300 group-hover:h-2.5 group-hover:w-2.5 group-hover:bg-accent group-focus-visible:h-2.5 group-focus-visible:w-2.5 group-focus-visible:bg-accent" />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[13px] text-fg opacity-0 transition-all duration-300 group-hover:max-w-[10rem] group-hover:px-3 group-hover:opacity-100 group-focus-visible:max-w-[10rem] group-focus-visible:px-3 group-focus-visible:opacity-100">
        {n.label} {n.hash || n.to ? "→" : "↗"}
      </span>
    </>
  );
  const style = { top: n.y - 15, ...side };
  if (n.to) {
    return (
      <Link to={n.to} className={cls} style={style} aria-label={n.label}>
        {body}
      </Link>
    );
  }
  if (n.hash) {
    return (
      <a
        href={`/#${n.hash}`}
        className={cls}
        style={style}
        aria-label={n.label}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(n.hash)?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {body}
      </a>
    );
  }
  return (
    <a href={n.href} className={cls} style={style} aria-label={n.label}>
      {body}
    </a>
  );
}

function roundedPath(pts, k) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(x - px, y - py);
    const l2 = Math.hypot(nx - x, ny - y);
    const kk = Math.min(k, l1 / 2, l2 / 2);
    const sx = x - ((x - px) / l1) * kk;
    const sy = y - ((y - py) / l1) * kk;
    const ex = x + ((nx - x) / l2) * kk;
    const ey = y + ((ny - y) / l2) * kk;
    d += ` L${sx.toFixed(1)},${sy.toFixed(1)} Q${x.toFixed(1)},${y.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0].toFixed(1)},${last[1].toFixed(1)}`;
}

const SPEED = 200;
const EDGE_FADE = 90;

const CARS = [0, 1, 2, 3].flatMap((road) =>
  [0, 1].map((n) => ({
    road,
    len: 56 + ((road * 7 + n * 13) % 26),
    phase: (road * 0.13 + n * 0.5) % 1,
  })),
);

const BOX = {
  hero: "absolute inset-0",
  br: "absolute bottom-0 right-0 h-[640px] w-[max(0px,calc(50vw-700px))]",
};

export default function Highway({ layout = "hero" }) {
  const boxRef = useRef(null);
  const animsRef = useRef([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let timer = 0;
    const measure = () => setSize({ w: box.clientWidth, h: box.clientHeight });
    measure();
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    });
    ro.observe(box);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  const roads = useMemo(
    () =>
      size.w && size.h && (layout === "hero" || size.w >= 140)
        ? buildRoads(size.w, size.h, layout)
        : [],
    [size.w, size.h, layout],
  );
  const paths = useMemo(() => roads.map((r) => roundedPath(r.pts, CORNER)), [roads]);

  useEffect(() => {
    const box = boxRef.current;
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];
    if (!box || !roads.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pathEls = box.querySelectorAll("path[data-road]");
    const segs = box.querySelectorAll("[data-seg]");
    if (pathEls.length !== roads.length) return;

    const profiles = Array.from(pathEls).map((path) => {
      const total = path.getTotalLength();
      const n = Math.min(420, Math.max(120, Math.round(total / 6)));
      const pts = [];
      for (let i = 0; i <= n; i++) {
        const p = path.getPointAtLength((i / n) * total);
        pts.push([p.x, p.y]);
      }
      const ang = pts.map((_, i) => {
        const a = pts[Math.min(i + 1, n)];
        const b = pts[Math.max(i - 1, 0)];
        return Math.atan2(a[1] - b[1], a[0] - b[0]);
      });
      return { n, pts, ang, step: total / n, dur: total / SPEED };
    });

    segs.forEach((el) => {
      const car = CARS[Number(el.dataset.car)];
      const j = Number(el.dataset.seg);
      const { n, pts, ang, step, dur } = profiles[car.road];
      const count = Math.min(SEGMENTS, Math.max(5, Math.round(car.len / step)));
      if (j >= count) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      const ramp = Math.min(4, Math.floor(count / 3)) + 1;
      const ends = Math.min(1, (j + 1) / ramp, (count - j) / ramp);
      const head = j;
      const width = step;

      const raw = pts.map((_, i) => {
        const hi = Math.max(i - head, 0);
        const ti = Math.max(i - head - 1, 0);
        return hi === ti
          ? ang[hi]
          : Math.atan2(pts[hi][1] - pts[ti][1], pts[hi][0] - pts[ti][0]);
      });
      for (let i = 1; i < raw.length; i++) {
        while (raw[i] - raw[i - 1] > Math.PI) raw[i] -= 2 * Math.PI;
        while (raw[i] - raw[i - 1] < -Math.PI) raw[i] += 2 * Math.PI;
      }

      const frames = pts.map((_, i) => {
        const k = Math.max(i - head, 0);
        const [x, y] = pts[k];
        const s = k * step;
        const edge = Math.min(1, Math.max(0, (s - EXTEND) / EDGE_FADE), Math.max(0, (n * step - s - EXTEND) / EDGE_FADE));
        return {
          opacity: ends * edge,
          offset: i / n,
          transform: `translate(${(x - width).toFixed(1)}px, ${(y - 0.75).toFixed(1)}px) rotate(${raw[i].toFixed(4)}rad)`,
        };
      });

      el.style.width = `${width + 1}px`;
      animsRef.current.push(
        el.animate(frames, {
          duration: dur * 1000,
          delay: -car.phase * dur * 1000,
          iterations: Infinity,
          easing: "linear",
          fill: "both",
        }),
      );
      el.style.visibility = "visible";
    });

    return () => {
      animsRef.current.forEach((a) => a.cancel());
      animsRef.current = [];
    };
  }, [roads]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    io.observe(box);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    animsRef.current.forEach((a) => (paused ? a.pause() : a.play()));
  }, [paused]);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={`pointer-events-none hidden overflow-hidden lg:block ${BOX[layout]}`}
    >
      {roads.length > 0 && (
        <svg className="absolute inset-0 h-full w-full" width={size.w} height={size.h}>
          {paths.map((d, i) => (
            <path
              key={i}
              data-road={i}
              d={d}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.75"
            />
          ))}
        </svg>
      )}
      {layout === "hero" && roads.length > 0 && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden xl:block">
          {buildNodes(size.w, size.h).map((n) => (
            <HighwayNode key={n.short} n={n} w={size.w} />
          ))}
        </div>
      )}
      {roads.length > 0 &&
        CARS.flatMap((c, ci) =>
          c.road >= roads.length ? [] : Array.from({ length: SEGMENTS }, (_, j) => (
            <span
              key={`${ci}-${j}`}
              data-car={ci}
              data-seg={j}
              className={`highway__car ${roads[c.road].tone === "accent" ? "highway__car--fwd" : "highway__car--back"}`}
            />
          )),
        )}
    </div>
  );
}
