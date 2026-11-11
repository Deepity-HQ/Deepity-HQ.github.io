import { useEffect, useRef } from "react";
import { closeDocsChooser, useDocsChooserOpen } from "../docsChooser.ts";
import { ArrowRight } from "./ArrowIcons.tsx";

const options = [
  { label: "C++", href: "/docs/index.html" },
  { label: "Python", href: "/docs/python/index.html" },
];

export default function DocsChooser() {
  const open = useDocsChooserOpen();
  const first = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDocsChooser();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080a]/80 px-5"
      onMouseDown={(e) => e.target === e.currentTarget && closeDocsChooser()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-chooser-title"
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0e0e10] p-8 shadow-2xl"
      >
        <h2 id="docs-chooser-title" className="m-0 text-2xl font-semibold tracking-[-0.025em] text-white">
          Choose your language
        </h2>
        <p className="mb-0 mt-3 text-base leading-relaxed text-white/60">
          The API documentation is available for C++ and for Python.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          {options.map((o, i) => (
            <a
              key={o.label}
              ref={i === 0 ? first : undefined}
              href={o.href}
              className="group flex items-center justify-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.05] px-4 py-3 text-base font-semibold text-white no-underline transition-colors hover:border-white/35 hover:bg-white/[0.09] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a99bff]"
            >
              {o.label}
              <ArrowRight className="text-[#a99bff]" />
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={closeDocsChooser}
          className="mt-5 w-full cursor-pointer border-0 bg-transparent p-0 text-sm text-white/50 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
