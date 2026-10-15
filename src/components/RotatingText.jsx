import { useEffect, useState } from "react";

export default function RotatingText({ items, interval = 2600, className = "" }) {
  const [{ cur, prev }, setState] = useState({ cur: 0, prev: null });
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setState((s) => ({ cur: (s.cur + 1) % items.length, prev: s.cur })),
      interval,
    );
    return () => clearInterval(id);
  }, [items.length, interval, reduce]);

  if (reduce) return <span className={className}>{items.join(" · ")}</span>;

  const longest = items.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={`relative inline-block overflow-hidden whitespace-nowrap align-bottom leading-[1.3] ${className}`}
    >
      <span aria-hidden="true" className="invisible block select-none">
        {longest}
      </span>
      {prev !== null && (
        <span key={`out-${prev}-${cur}`} aria-hidden="true" className="rot-out absolute left-0 top-0 select-none">
          {items[prev]}
        </span>
      )}
      <span key={`in-${cur}`} aria-hidden="true" className="rot-in absolute left-0 top-0">
        {items[cur]}
      </span>
      <span className="sr-only">{items.join(", ")}</span>
    </span>
  );
}
