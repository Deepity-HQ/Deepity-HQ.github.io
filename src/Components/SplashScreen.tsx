import { useEffect, useState } from "react";

type SplashScreenProps = {
  onDone?: () => void;
};

type Phase = "enter" | "shown" | "loaded" | "exit";

import { waveReady } from "../waveReady.ts";

// If the wave never reports in (no WebGL, say), do not hold the page forever
const WAVE_TIMEOUT = 8000;

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<Phase>("enter");

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

    const pageLoad: Promise<unknown> =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise((resolve) =>
            window.addEventListener("load", resolve, { once: true }),
          );

    const fontsReady: Promise<unknown> =
      document.fonts?.ready ?? Promise.resolve();

    const minEnter = new Promise((resolve) =>
      setTimeout(resolve, minEnterTime),
    );

    const waveLoaded = Promise.race([
      waveReady,
      new Promise((resolve) => setTimeout(resolve, WAVE_TIMEOUT)),
    ]);

    Promise.all([pageLoad, fontsReady, minEnter, waveLoaded]).then(() => {
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
      className={`splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-[#020205] transition-opacity duration-300 ${
        phase === "exit" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* The logo artwork has padding around it, so crop to the wordmark */}
      <div
        className={`relative h-[48.6px] w-64 overflow-hidden transition-opacity duration-300 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src={`${import.meta.env.BASE_URL}Branding/Deepity-03.png`}
          alt="Deepity"
          className="absolute left-[-85.3px] top-[-189px] h-[426.7px] w-[426.7px] max-w-none"
        />
      </div>

      <div className="h-px w-40 overflow-hidden bg-white/15">
        <div
          className={`h-full bg-gradient-to-r from-[#a99bff] to-[#7dd3fc] transition-all duration-[400ms] ease-out ${
            barFilled ? "w-full" : "w-0"
          }`}
        />
      </div>
    </div>
  );
}
