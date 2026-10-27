import { useEffect, useState } from "react";
import useInView from "./useInView.ts";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CountUpProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
};

export default function CountUp({ value, decimals = 0, suffix = "", duration = 1200 }: CountUpProps) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(reduced() ? value : 0);

  useEffect(() => {
    if (!seen || reduced()) {
      if (seen) setShown(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
