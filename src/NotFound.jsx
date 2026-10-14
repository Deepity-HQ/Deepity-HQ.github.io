import { Link } from "react-router-dom";
import MainFooter from "./components/MainFooter";
import useDocumentTitle from "./lib/useDocumentTitle";

/**
 * "construction": a page that is planned but not built yet (linked from the
 * unfinished tutorials). "missing": an address that does not exist.
 */
function NotFound({ variant = "missing" }) {
  const construction = variant === "construction";
  useDocumentTitle(construction ? "Coming soon" : "Page not found");

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 pt-14 text-center">
        <span className="label">{construction ? "Coming soon" : "404"}</span>

        <h1 className="m-0 font-[family-name:var(--font-display)] text-5xl tracking-[-0.02em] md:text-7xl">
          {construction ? "Under construction" : "Page not found"}
        </h1>

        <p className="mb-8 max-w-md text-dim">
          {construction
            ? "This page is still being built."
            : "That address doesn't exist, or the page has moved."}
        </p>

        <Link to="/" className="btn">
          ← Back to home
        </Link>
      </div>
      <MainFooter />
    </div>
  );
}

export default NotFound;
