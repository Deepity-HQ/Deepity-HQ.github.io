import { useLayoutEffect, useRef } from "react";

/**
 * Scroll-linked reveal. Instead of firing once, each element's opacity and
 * offset are a function of where it sits in the viewport, smoothed toward
 * that target every frame so motion trails the scroll and reverses when you
 * scroll back up.
 *
 *   mode="enter" (default): rises/fades in as it enters from the bottom.
 *   mode="leave":           drifts slower than the page and fades out as it
 *                           scrolls off the top (used for the hero).
 *   delay (ms):             offsets the start point, so siblings stagger.
 */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const ease = (v) => 1 - Math.pow(1 - v, 3);
const SMOOTHING = 0.12;

const items = new Set();
let raf = 0;
let listening = false;

function apply(it, p) {
  const { el } = it;
  // Fully revealed: drop the inline styles so the element no longer needs
  // its own compositor layer (matters for tall tutorial sections).
  if (p >= 0.999) {
    el.style.opacity = "";
    el.style.transform = "";
    return;
  }
  const e = ease(p);
  el.style.opacity = it.mode === "leave" ? String(0.05 + 0.95 * e) : String(e);
  const y = it.mode === "leave" ? (1 - e) * 90 : (1 - e) * 44;
  el.style.transform = y < 0.05 ? "none" : `translate3d(0, ${y.toFixed(2)}px, 0)`;
}

function tick() {
  raf = 0;
  const vh = window.innerHeight;
  let moving = false;

  // Read every position first, then write: interleaving reads with style
  // writes would force a layout reflow per element per frame.
  const tops = [];
  for (const it of items) tops.push(it.el.getBoundingClientRect().top);

  let i = 0;
  for (const it of items) {
    const top = tops[i++];
    let target;
    if (it.mode === "leave") {
      target = 1 - clamp01(-top / (vh * 0.75));
    } else {
      const start = vh * 0.98 - it.delay * 0.4;
      target = clamp01((start - top) / (vh * 0.34));
    }

    const diff = target - it.cur;
    if (Math.abs(diff) < 0.002) {
      it.cur = target;
    } else {
      it.cur += diff * SMOOTHING;
      moving = true;
    }
    if (it.cur !== it.last) {
      apply(it, it.cur);
      it.last = it.cur;
    }
  }

  if (moving) raf = requestAnimationFrame(tick);
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function register(it) {
  items.add(it);
  if (!listening) {
    listening = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
}

function unregister(it) {
  items.delete(it);
  if (items.size === 0 && listening) {
    listening = false;
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

export default function Reveal({
  as: Tag = "div",
  mode = "enter",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  // Layout effect so the hidden start state is applied before first paint.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Animating a block taller than the screen means re-rasterizing a huge
    // layer every frame; just show it.
    if (el.offsetHeight > window.innerHeight * 1.2) return;

    const it = { el, mode, delay, cur: mode === "leave" ? 1 : 0, last: null };
    if (mode === "enter") apply(it, 0);
    register(it);
    return () => {
      unregister(it);
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [mode, delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
