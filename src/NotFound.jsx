import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";

function NotFound({ variant = "missing" }) {
  const construction = variant === "construction";

  return (
    <div className="subpage-glow min-h-screen flex flex-col justify-between">
      <div className="flex flex-1 items-center justify-center px-5 py-24 pt-36">
        <div className="glass card-interactive relative mx-auto max-w-lg overflow-hidden rounded-2xl border border-line p-8 sm:p-12 text-center shadow-2xl">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="label mb-4 inline-flex items-center gap-2 rounded-lg border border-line bg-fg/[0.04] px-4 py-1.5 text-xs">
            <span className="font-[family-name:var(--font-display)] font-semibold text-accent-text">
              {construction ? "WIP" : "404"}
            </span>
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <span className="text-dim">
              {construction ? "Work in Progress" : "Page Not Found"}
            </span>
          </div>

          <h1 className="m-0 font-[family-name:var(--font-display)] text-4xl font-normal tracking-[-0.03em] md:text-5xl text-fg">
            {construction ? "Under construction" : "Page not found"}
          </h1>

          <p className="mx-auto mb-8 mt-4 max-w-sm text-base leading-relaxed text-dim">
            {construction
              ? "This tutorial is currently being written and tested. Check back soon for the complete walkthrough."
              : "That address doesn't exist, or the page has moved to another location."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn btn--solid">
              ← Back to home
            </Link>
            <Link to="/tutorial" className="btn">
              Browse tutorials
            </Link>
          </div>
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

export default NotFound;
