import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    if (document.documentElement.dataset.splash === "off") {
      onDone?.();
      return;
    }
    try {
      sessionStorage.setItem("splash-seen", "1");
    } catch {
      /* storage unavailable */
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minEnterTime = reduceMotion ? 150 : 350;
    const fillDuration = reduceMotion ? 150 : 350;
    const exitDuration = reduceMotion ? 150 : 300;

    let cancelled = false;
    const frame = requestAnimationFrame(() => setPhase("shown"));

    const pageLoad =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true }),
          );

    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    const minEnter = new Promise((resolve) =>
      setTimeout(resolve, minEnterTime),
    );

    Promise.all([pageLoad, fontsReady, minEnter]).then(() => {
      if (cancelled) return;
      setPhase("loaded");
      setTimeout(() => {
        if (cancelled) return;
        setPhase("exit");
        setTimeout(() => {
          if (!cancelled) onDone?.();
        }, exitDuration);
      }, fillDuration);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [onDone]);

  const revealed = phase !== "enter";
  const barFilled = phase === "loaded" || phase === "exit";

  return (
    <div
      className={`splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-bg transition-opacity duration-300 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={`${import.meta.env.BASE_URL}brand/logo-white.svg`}
        alt="Deepity"
        className={`logo-themed h-auto w-64 transition-opacity duration-300 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="h-px w-40 overflow-hidden bg-line">
        <div
          className={`h-full bg-gradient-to-r from-accent to-cool transition-all duration-[400ms] ease-out ${
            barFilled ? "w-full" : "w-0"
          }`}
        />
      </div>
    </div>
  );
}
