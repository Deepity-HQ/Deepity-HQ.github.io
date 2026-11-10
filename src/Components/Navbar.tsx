import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { GITHUB_URL } from "../config.ts";
import { LuStar } from "react-icons/lu";
import useRepoStats from "./useRepoStats.ts";
import { GitHubMark } from "./icons.tsx";
import ButtonPrimary from "./ButtonPrimary.tsx";

type SectionLink = {
  text: string;
  to: string;
  // Static pages outside the app (the docs) need a full page load
  external?: boolean;
};

const sections: SectionLink[] = [
  { text: "Tutorials", to: "/tutorial" },
  { text: "Benchmarks", to: "/benchmarks" },
  { text: "Theory", to: "/theory" },
  { text: "Docs", to: "/docs/index.html", external: true },
  { text: "About", to: "/about" },
];

export default function Navbar() {
  const { stars } = useRepoStats();
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  // The menu is open for one page only, so navigating closes it
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) =>
    setOpenOn((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));

  // Close the menu on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderLink = ({ text, to, external }: SectionLink, className: string) =>
    external ? (
      <a key={text} className={className} href={to}>
        {text}
      </a>
    ) : (
      <NavLink key={text} className={className} to={to}>
        {text}
      </NavLink>
    );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 border-b transition-colors duration-200 ${
        scrolled || open
          ? "border-white/10 bg-[#08080a]/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-8 px-5 md:px-8">
        <Link to="/" aria-label="Deepity home" className="flex shrink-0 items-center">
          <img src="/logo.svg" alt="Deepity" className="h-[22px] w-auto" />
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-7 md:flex">
          {sections.map((link) => renderLink(link, "nav-link"))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={stars ? `Deepity on GitHub, ${stars} stars` : "Deepity on GitHub"}
            className="flex h-9 items-center justify-center gap-2 rounded-lg px-2.5 text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <GitHubMark size={18} />
            {stars !== null && stars > 0 && (
              <span className="tabular flex items-center gap-1 text-sm font-medium">
                <LuStar aria-hidden="true" className="h-3.5 w-3.5 text-[#a99bff]" />
                {stars.toLocaleString("en-US")}
              </span>
            )}
          </a>
          <ButtonPrimary to="/early-access" size="sm">
            Early access
          </ButtonPrimary>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="relative ml-auto h-10 w-10 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent md:hidden"
        >
          <span
            className="absolute left-1/2 top-1/2 -ml-3 -mt-px block h-[1.5px] w-6 bg-white transition-transform duration-200"
            style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
          />
          <span
            className="absolute left-1/2 top-1/2 -ml-3 -mt-px block h-[1.5px] w-6 bg-white transition-transform duration-200"
            style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
          />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`border-t border-white/10 bg-[#08080a] md:hidden ${open ? "block" : "hidden"}`}
        aria-hidden={!open}
      >
        <div className="flex flex-col px-5 py-3">
          {sections.map((link) =>
            renderLink(link, "nav-link !py-3 !text-base"),
          )}
          <ButtonPrimary to="/early-access" className="mt-3">
            Early access
          </ButtonPrimary>
        </div>
      </div>
    </header>
  );
}
