import {
  startTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./../index.css";
import { GITHUB_URL } from "../config";

const DeepityLogo = `${import.meta.env.BASE_URL}brand/logo-white.svg`;

const base =
  "rounded-full px-4 py-2 text-[15px] font-[family-name:var(--font-display)] no-underline transition-colors";
const idle = "text-dim hover:bg-white/10 hover:text-fg";
const idleDesktop = "text-dim hover:bg-white/[0.04] hover:text-fg"; // hover only fades a faint background; the sliding highlight marks the selection
const active = "text-accent-text";
const activeBg = "bg-white/10 text-accent-text"; // mobile menu: no sliding highlight there

function GitHubMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);
  const { pathname } = useLocation();

  const links = [
    { label: "Docs", href: "/docs/index.html", external: true },
    {
      label: "Tutorials",
      to: "/tutorial",
      on: pathname.startsWith("/tutorial"),
    },
    { label: "Benchmarks", to: "/benchmarks", on: pathname === "/benchmarks" },
    { label: "Theory", to: "/theory", on: pathname === "/theory" },
    { label: "About", to: "/about", on: pathname === "/about" },
  ];

  // The highlight slides to the selected page. On click it moves first, and the
  // route change runs as a low-priority transition so mounting the next page
  // does not stall the slide.
  const navigate = useNavigate();
  const linkRefs = useRef({});
  const [pending, setPending] = useState(null);
  useEffect(() => {
    setPending(null);
  }, [pathname]);
  const [slide, setSlide] = useState({ x: 0, w: 0, show: false, ready: false });
  const activeLabel = links.find((l) => l.on)?.label;
  const target = pending ?? activeLabel;
  useLayoutEffect(() => {
    const measure = () => {
      const el = target ? linkRefs.current[target] : null;
      setSlide((s) =>
        el
          ? { x: el.offsetLeft, w: el.offsetWidth, show: true, ready: s.ready }
          : { ...s, show: false },
      );
    };
    measure();
    const raf = requestAnimationFrame(() =>
      setSlide((s) => ({ ...s, ready: true })),
    );
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [target]);

  const renderLink = (l, extra = "", desktop = false) => {
    const cls = `${base} ${l.on ? (desktop ? active : activeBg) : desktop ? idleDesktop : idle} ${desktop ? "relative" : ""} ${extra}`;
    const props = {
      className: cls,
      onClick: closeMenu,
      ...(desktop && {
        ref: (el) => {
          linkRefs.current[l.label] = el;
        },
        ...(l.to && {
          onClick: (e) => {
            if (
              e.defaultPrevented ||
              e.button !== 0 ||
              e.metaKey ||
              e.ctrlKey ||
              e.shiftKey ||
              e.altKey
            )
              return;
            e.preventDefault();
            setPending(l.label);
            startTransition(() => navigate(l.to));
          },
        }),
      }),
    };
    return l.href ? (
      <a key={l.label} href={l.href} {...props}>
        {l.label}
      </a>
    ) : (
      <Link key={l.label} to={l.to} {...props}>
        {l.label}
      </Link>
    );
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-3 py-3 md:px-4 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          onClick={closeMenu}
          aria-label="Deepity home"
          className="glass-pill pointer-events-auto flex h-11 items-center justify-self-start px-5 no-underline lg:!border-transparent lg:!bg-transparent lg:pl-3"
        >
          <img src={DeepityLogo} width="150" height="28" alt="" className="h-7 w-auto" />
        </Link>

        <nav
          aria-label="Main"
          className="glass-pill pointer-events-auto relative hidden items-center gap-1 p-1.5 lg:flex"
        >
          <span
            aria-hidden="true"
            className={`absolute bottom-1.5 left-0 top-1.5 rounded-full bg-white/10 ${
              slide.ready
                ? "transition-[transform,width,opacity] duration-[250ms] ease-out"
                : ""
            }`}
            style={{
              transform: `translateX(${slide.x}px)`,
              width: slide.w,
              opacity: slide.show ? 1 : 0,
            }}
          />
          {links.map((l) => renderLink(l, "", true))}
        </nav>

        <div className="pointer-events-auto hidden items-center gap-2 justify-self-end lg:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deepity on GitHub"
            className="glass-pill flex h-11 w-11 items-center justify-center text-fg transition-colors hover:border-accent hover:text-accent-text"
          >
            <GitHubMark />
          </a>
          <Link to="/early-access" className="btn btn--solid !py-2.5">
            Request early access
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="glass-pill pointer-events-auto flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`block h-px w-5 bg-fg transition-transform ${isOpen ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-fg transition-opacity ${isOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-px w-5 bg-fg transition-transform ${isOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <>
          {/* Dims the page behind the menu; tapping it closes the menu. */}
          <div
            aria-hidden="true"
            onClick={closeMenu}
            className="pointer-events-auto fixed inset-0 -z-10 bg-black/70 lg:hidden"
          />
          <div className="pointer-events-auto mx-3 mt-1 flex flex-col gap-1 rounded-[var(--radius)] border border-line-strong bg-[#0c0c0d] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.6)] lg:hidden">
            {links.map((l) => renderLink(l))}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className={`${base} ${idle}`}
            >
              GitHub ↗
            </a>
            <Link
              to="/early-access"
              onClick={closeMenu}
              className="btn btn--solid mt-2"
            >
              Request early access
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
