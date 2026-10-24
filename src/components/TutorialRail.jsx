import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

// Tutorials 2 to 5 are not written yet, so they point at the under-construction page.
const STEPS = [
  { n: 0, to: "/tutorial/0-introduction" },
  { n: 1, to: "/tutorial/1-beginning" },
  { n: 2, to: "/notfound" },
  { n: 3, to: "/notfound" },
  { n: 4, to: "/notfound" },
  { n: 5, to: "/notfound" },
];

function ReadingProgress() {
  const bar = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]">
      <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

export default function TutorialRail({ current }) {
  return (
    <>
      <ReadingProgress />
      <nav
        aria-label="Tutorials"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel2/30 px-6 py-3.5 md:px-10"
      >
        <div className="flex items-center gap-2 text-xs font-[family-name:var(--font-display)] text-dim">
          <Link
            to="/tutorial"
            className="hover:text-fg transition-colors no-underline"
          >
            Tutorials
          </Link>
          <span className="text-faint">/</span>
          <span className="text-accent-text font-medium">Part {current}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="label mr-1 text-[11px] text-faint hidden sm:inline">Parts:</span>
          {STEPS.map((s) => (
            <Link
              key={s.n}
              to={s.to}
              aria-current={s.n === current ? "page" : undefined}
              title={`Tutorial ${s.n}`}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-[family-name:var(--font-display)] no-underline transition-all ${
                s.n === current
                  ? "border-accent bg-accent text-accent-ink font-semibold shadow-[0_0_12px_rgba(178,41,255,0.4)]"
                  : "border-line bg-fg/[0.04] text-dim hover:border-line-strong hover:text-fg hover:bg-fg/[0.08]"
              }`}
            >
              {s.n}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
