import { useEffect, useRef, useState } from "react";

export default function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(() => {
    if (typeof window === "undefined") return true;
    return Boolean(
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    );
  });

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, threshold]);

  return [ref, seen];
}
