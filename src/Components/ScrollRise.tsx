import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useInFlyStage } from "./FlyStage.tsx";

type Props = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  // Extra scroll distance (in viewport heights) before the block is fully in place
  distance?: number;
};

type Item = { el: HTMLElement; distance: number; done: boolean };

const items = new Set<Item>();
let frame = 0;
let listening = false;

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// Block position is tied to scroll: it starts below, tilted and slightly small,
// and settles into place as it travels up the screen.
function apply(item: Item, vh: number) {
  const rect = item.el.getBoundingClientRect();
  const start = vh;
  const end = vh * (1 - item.distance);
  const raw = (start - rect.top) / (start - end);
  const p = Math.min(Math.max(raw, 0), 1);
  const e = ease(p);
  if (p >= 1) {
    item.el.style.transform = "none";
    item.el.style.opacity = "1";
    item.done = true;
    return;
  }
  item.done = false;
  item.el.style.opacity = String(Math.min(1, e * 1.6));
  item.el.style.transform = `perspective(1100px) translate3d(0, ${(1 - e) * 90}px, ${(1 - e) * -120}px) rotateX(${(1 - e) * 9}deg) scale(${0.95 + 0.05 * e})`;
}

function update() {
  frame = 0;
  const vh = window.innerHeight;
  items.forEach((item) => apply(item, vh));
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function register(item: Item) {
  items.add(item);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
}

function unregister(item: Item) {
  items.delete(item);
  if (items.size === 0 && listening) {
    listening = false;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  }
}

export default function ScrollRise({
  children,
  className = "",
  style,
  distance = 0.35,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inFly = useInFlyStage();

  useEffect(() => {
    const el = ref.current;
    if (!el || inFly) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const item: Item = { el, distance, done: false };
    register(item);
    return () => {
      unregister(item);
      el.style.transform = "";
      el.style.opacity = "";
    };
  }, [distance, inFly]);

  return (
    <div
      ref={ref}
      className={className}
      style={inFly ? style : { ...style, transformOrigin: "50% 100%", willChange: "transform, opacity" }}
    >
      {children}
    </div>
  );
}
