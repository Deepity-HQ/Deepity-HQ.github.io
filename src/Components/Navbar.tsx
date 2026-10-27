import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

type SectionLink = {
  text: string;
  to: string;
  // Static pages outside the app (the docs) need a full page load
  external?: boolean;
};

const sections: SectionLink[] = [
  { text: "Home", to: "/" },
  { text: "About", to: "/about" },
  { text: "Tutorials", to: "/tutorial" },
  { text: "Benchmarks", to: "/benchmarks" },
  { text: "Docs", to: "/docs/index.html", external: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the menu after navigating, and on Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const renderLink = (
    { text, to, external }: SectionLink,
    className: string,
  ) =>
    external ? (
      <a key={text} className={className} href={to}>
        {text}
      </a>
    ) : (
      <Link key={text} className={className} to={to}>
        {text}
      </Link>
    );

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-20 flex h-20 items-center overflow-hidden bg-black/50 px-6 py-10 backdrop-blur-xl md:h-[120px] md:px-[100px]">
        <div className="relative h-10 w-[210.53px] shrink-0 overflow-hidden">
          <Link to="/">
            <img
              className="absolute left-[-70.18px] top-[-155.44px] h-[350.88px] w-[350.88px] max-w-none cursor-pointer"
              src="/Branding/Deepity-03.png"
              alt="Deepity"
            />
          </Link>
        </div>
        <div className="ml-auto hidden items-center gap-[64px] md:flex">
          {sections.map((link) => renderLink(link, "nav-link Michroma text-sm"))}
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="relative ml-auto h-10 w-10 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent md:hidden"
        >
          {/* Three bars stacked on one point, so the X forms from exactly the same centre */}
          <span
            className="absolute left-1/2 top-1/2 -ml-3 -mt-px block h-[2px] w-6 bg-white transition-transform duration-200"
            style={{ transform: open ? "rotate(45deg)" : "translateY(-7px)" }}
          />
          <span
            className="absolute left-1/2 top-1/2 -ml-3 -mt-px block h-[2px] w-6 bg-white transition-opacity duration-150"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="absolute left-1/2 top-1/2 -ml-3 -mt-px block h-[2px] w-6 bg-white transition-transform duration-200"
            style={{ transform: open ? "rotate(-45deg)" : "translateY(7px)" }}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-20 z-20 origin-top border-b border-white/10 bg-black/90 backdrop-blur-xl transition-[opacity,transform] duration-200 md:hidden ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col px-6 py-4">
          {sections.map((link) =>
            renderLink(link, "nav-link Michroma py-4 text-base"),
          )}
        </div>
      </div>
    </>
  );
}
