import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Lets blocks inside a stage know they are already being flown in
export const FlyContext = createContext(false);
export const useInFlyStage = () => useContext(FlyContext);

const ENTER = 0.5; // scroll units before a panel is in place
const HOLD = 0.4; // scroll units it stays readable
const EXIT = 0.5; // scroll units it takes to fly past
const UNIT_VH = 0.9; // viewport heights of scrolling per unit
const NAV = 84;
// Layout width of each section; the whole panel is then scaled up to fill the screen
const CONTENT_W = 1040;
const MAX_FIT = 1.8;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp = (v: number) => Math.min(Math.max(v, 0), 1);

function useFlyEnabled() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const q = window.matchMedia(
      "(min-width: 768px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setOn(q.matches);
    update();
    q.addEventListener("change", update);
    return () => q.removeEventListener("change", update);
  }, []);
  return on;
}

// The page holds still while each section travels toward the camera, stops
// for reading, then passes by. Scrolling drives the whole motion.
export default function FlyStage({ children }: { children: ReactNode[] }) {
  const enabled = useFlyEnabled();
  const n = children.length;
  const stageRef = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const inners = useRef<(HTMLDivElement | null)[]>([]);
  const fits = useRef<number[]>([]);
  const frame = useRef(0);

  // Total travel in scroll units: first panel flies in, last one stays in place
  const span = ENTER + (n - 1) * (HOLD + EXIT) + HOLD;

  const draw = () => {
    frame.current = 0;
    const stage = stageRef.current;
    if (!stage) return;
    const vh = window.innerHeight;
    const rect = stage.getBoundingClientRect();
    const travel = rect.height - vh;
    const p = clamp(-rect.top / Math.max(travel, 1));
    const s = p * span;
    for (let i = 0; i < n; i++) {
      const el = panels.current[i];
      if (!el) continue;
      // local time: 0 = fully in place, negative = approaching, positive = passing
      const t = s - ENTER - i * (HOLD + EXIT);
      let scale = 1;
      let opacity = 1;
      if (t < 0) {
        const k = ease(clamp(1 + t / ENTER));
        scale = 0.45 + 0.55 * k;
        opacity = clamp(k * 1.5);
      } else if (t > HOLD && i < n - 1) {
        const k = ease(clamp((t - HOLD) / EXIT));
        scale = 1 + 0.55 * k;
        opacity = clamp(1 - k * 1.25);
      }
      const fit = fits.current[i] ?? 1;
      el.style.opacity = String(opacity);
      el.style.visibility = opacity <= 0.01 ? "hidden" : "visible";
      el.style.pointerEvents = opacity > 0.85 ? "auto" : "none";
      el.style.transform = `translate3d(0,0,0) scale(${scale * fit})`;
    }
  };

  const schedule = () => {
    if (!frame.current) frame.current = requestAnimationFrame(draw);
  };

  const measure = () => {
    const vh = window.innerHeight;
    inners.current.forEach((el, i) => {
      if (!el) return;
      fits.current[i] = Math.min(
        MAX_FIT,
        (vh - NAV - 32) / Math.max(el.offsetHeight, 1),
        (window.innerWidth - 120) / CONTENT_W,
      );
    });
    schedule();
  };

  useLayoutEffect(() => {
    if (!enabled) return;
    measure();
    const ro = new ResizeObserver(measure);
    inners.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, n]);

  if (!enabled) return <>{children}</>;

  return (
    <FlyContext.Provider value={true}>
      <div
        ref={stageRef}
        style={{ height: `${(span * UNIT_VH + 1) * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {children.map((child, i) => (
            <div
              key={i}
              ref={(el) => {
                panels.current[i] = el;
              }}
              className="absolute inset-0 flex items-center justify-center px-5 pt-[60px] md:px-8"
              style={{ willChange: "transform, opacity", opacity: i === 0 ? 0 : 0 }}
            >
              <div
                ref={(el) => {
                  inners.current[i] = el;
                }}
                style={{ width: CONTENT_W }}
                className="shrink-0 [&>section]:border-0 [&>section]:py-0! [&>section]:px-0!"
              >
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FlyContext.Provider>
  );
}
