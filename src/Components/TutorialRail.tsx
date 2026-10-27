import { useEffect, useRef } from "react";
import { Link } from "react-router";

// Tutorials 2 to 5 are not written yet, so they point at the not-found page
const STEPS = [
  { n: 0, to: "/tutorial/0-introduction" },
  { n: 1, to: "/tutorial/1-beginning" },
  { n: 2, to: "/notfound" },
  { n: 3, to: "/notfound" },
  { n: 4, to: "/notfound" },
  { n: 5, to: "/notfound" },
];

function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
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
      <div
        ref={bar}
        className="h-full origin-left bg-[#8b7cff]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default function TutorialRail({ current }: { current: number }) {
  return (
    <>
      <ReadingProgress />
      <nav
        aria-label="Tutorials"
        className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-6 py-3.5 md:px-10"
      >
        <div className="Michroma flex items-center gap-2 text-xs text-white/70">
          <Link to="/tutorial" className="no-underline transition-colors hover:text-white">
            Tutorials
          </Link>
          <span className="text-white/40">/</span>
          <span className="text-[#a99bff]">Part {current}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="Michroma mr-1 hidden text-[11px] text-white/50 sm:inline">
            Parts:
          </span>
          {STEPS.map((s) => (
            <Link
              key={s.n}
              to={s.to}
              aria-current={s.n === current ? "page" : undefined}
              title={`Tutorial ${s.n}`}
              className={`Michroma flex h-7 w-7 items-center justify-center rounded-lg border text-xs no-underline transition-all ${
                s.n === current
                  ? "border-[#8b7cff] bg-[#8b7cff] text-black shadow-[0_0_12px_rgba(139,124,255,0.4)]"
                  : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
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
