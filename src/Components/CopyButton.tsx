import { useEffect, useRef, useState } from "react";
import { LuCheck, LuCopy } from "react-icons/lu";

// Older browsers and non-secure origins have no navigator.clipboard
function fallbackCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  document.body.appendChild(ta);
  ta.select();
  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(ta);
  }
}

export default function CopyButton({ code, label }: { code: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopy = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        ok = true;
      } else {
        ok = fallbackCopy(code);
      }
    } catch {
      ok = fallbackCopy(code);
    }
    setState(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1800);
  };

  const text = state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy";

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label} code`}
      className={`Michroma inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] transition-colors hover:border-white/25 ${
        state === "idle" ? "text-white/70 hover:text-white" : "text-white"
      }`}
    >
      {state === "copied" ? (
        <LuCheck aria-hidden="true" className="h-3.5 w-3.5" />
      ) : (
        <LuCopy aria-hidden="true" className="h-3.5 w-3.5" />
      )}
      <span aria-live="polite">{text}</span>
    </button>
  );
}
