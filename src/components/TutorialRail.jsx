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
      <nav aria-label="Tutorials" className="flex flex-wrap items-center gap-2 px-8 pt-2">
        <span className="label mr-2">Tutorial</span>
        {STEPS.map((s) => (
          <Link
            key={s.n}
            to={s.to}
            aria-current={s.n === current ? "page" : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm no-underline transition-colors ${
              s.n === current
                ? "border-transparent bg-white text-black"
                : "border-line bg-white/[0.04] text-dim hover:text-fg"
            }`}
          >
            {s.n}
          </Link>
        ))}
      </nav>
    </>
  );
}
