import { useEffect, useRef } from "react";
import { Link } from "react-router";

const STEPS = [
  { n: 0, to: "/tutorial/0-introduction", written: true },
  { n: 1, to: "/tutorial/1-beginning", written: true },
  { n: 2, to: "/tutorial/2-xor", written: true },
  { n: 3, to: "/tutorial/3-tweaked-xor", written: true },
  { n: 4, to: "/tutorial/4-cnn", written: true },
  { n: 5, to: "/tutorial/5-dkppcn", written: true },
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

export default function TutorialRail({ current: current_ }: { current: number }) {
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
          <span className="text-[#a99bff]">Part {current_}</span>
        </div>

        <div className="flex items-center">
          <span className="Michroma mr-3 hidden text-[11px] uppercase tracking-wider text-white/40 sm:inline">
            Part
          </span>
          {STEPS.map((s) => {
            const current = s.n === current_;
            return (
              <Link
                key={s.n}
                to={s.to}
                aria-current={current ? "page" : undefined}
                title={s.written ? `Tutorial ${s.n}` : `Tutorial ${s.n} (coming soon)`}
                className={`Michroma relative px-2.5 py-1.5 text-xs no-underline transition-colors ${
                  current
                    ? "text-white"
                    : s.written
                      ? "text-white/55 hover:text-white"
                      : "text-white/25 hover:text-white/60"
                }`}
              >
                {s.n}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2.5 -bottom-[15px] h-[2px] transition-colors ${
                    current ? "bg-[#a99bff]" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
