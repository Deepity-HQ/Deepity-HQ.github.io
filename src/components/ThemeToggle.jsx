import { useEffect, useState } from "react";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "system";
    return localStorage.getItem("deepity-theme") || "system";
  });

  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setSystemIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const effectiveTheme =
    theme === "system" ? (systemIsDark ? "dark" : "light") : theme;
  const isDark = effectiveTheme === "dark";

  const cycleTheme = () => {
    let next;
    if (theme === "system") {
      next = systemIsDark ? "light" : "dark";
    } else if (theme === "light") {
      next = "dark";
    } else {
      next = "system";
    }

    setTheme(next);
    if (next === "system") {
      localStorage.removeItem("deepity-theme");
      document.documentElement.removeAttribute("data-theme");
    } else {
      localStorage.setItem("deepity-theme", next);
      document.documentElement.setAttribute("data-theme", next);
    }
  };

  const titleText =
    theme === "system"
      ? `Theme: System (${effectiveTheme}) · Click to toggle`
      : `Theme: ${effectiveTheme === "dark" ? "Dark" : "Light"} · Click to toggle`;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={titleText}
      aria-label={titleText}
      className={`glass-pill relative flex h-11 w-11 cursor-pointer items-center justify-center !rounded-full transition-all duration-300 hover:border-accent ${
        isDark
          ? "hover:shadow-[0_0_16px_rgba(137,131,247,0.35)]"
          : "hover:shadow-[0_0_16px_rgba(255,140,0,0.35)]"
      } ${className}`}
    >
      {/* Sun/Moon switcher icon inspired by codepen.io/demilad/pen/bZRjpb */}
      <div
        className="relative h-5 w-5 rounded-full transition-all duration-500 ease-out"
        style={{
          background: isDark
            ? "linear-gradient(40deg, #8983F7, #A3DAFB 70%)"
            : "linear-gradient(40deg, #FF0080, #FF8C00 70%)",
          boxShadow: isDark
            ? "0 0 10px rgba(137, 131, 247, 0.4)"
            : "0 0 10px rgba(255, 140, 0, 0.4)",
        }}
      >
        {/* Crescent cutout mask */}
        <div
          className="absolute right-0 top-0 h-[75%] w-[75%] rounded-full transition-transform duration-[600ms]"
          style={{
            background: "var(--btn-bg)",
            transformOrigin: "top right",
            transform: isDark ? "scale(1)" : "scale(0)",
            transitionTimingFunction: "cubic-bezier(0.645, 0.045, 0.355, 1)",
          }}
        />
      </div>

      {theme === "system" && (
        <span
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 rounded-full bg-accent opacity-80"
          title="Following system theme"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
