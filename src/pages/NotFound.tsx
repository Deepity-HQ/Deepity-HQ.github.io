import { Link } from "react-router";
import { ArrowLeft } from "../Components/ArrowIcons.tsx";

// Shown for any address that has no page yet
export default function NotFound() {
  return (
    <div className="subpage-glow flex min-h-[70vh] items-center justify-center px-5 pb-16 pt-40">
      <div className="relative max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm sm:p-12">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#8b7cff] to-transparent" />
        <h1 className="Michroma m-0 text-3xl font-normal text-white md:text-4xl">
          Page not found
        </h1>
        <p className="Jura mb-8 mt-4 text-base text-white/75">
          That address doesn&apos;t exist yet, or the page has moved.
        </p>
        <Link
          to="/"
          className="Michroma inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm text-black no-underline transition-colors hover:bg-fuchsia-400"
        >
          <ArrowLeft />
          Back to home
        </Link>
      </div>
    </div>
  );
}
