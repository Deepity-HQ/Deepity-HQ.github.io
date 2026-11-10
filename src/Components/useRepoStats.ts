import { useEffect, useState } from "react";

export type RepoStats = { version: string; stars: number | null };

// Shown until the live values arrive, and kept if the requests fail
const FALLBACK: RepoStats = { version: "0.1.0a7", stars: null };
const KEY = "deepity-repo-stats";
const MAX_AGE = 60 * 60 * 1000;

function readCache(): RepoStats | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const { at, stats } = JSON.parse(raw);
    return Date.now() - at < MAX_AGE ? stats : null;
  } catch {
    return null;
  }
}

let inflight: Promise<PromiseSettledResult<any>[]> | null = null;

async function getJson(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

// Latest release from PyPI and star count from GitHub, fetched by the visitor's browser
export default function useRepoStats(): RepoStats {
  const [stats, setStats] = useState<RepoStats>(() => readCache() ?? FALLBACK);

  useEffect(() => {
    if (readCache()) return;
    let live = true;
    // The nav and the hero both ask; share one request
    inflight ??= Promise.allSettled([
      getJson("https://pypi.org/pypi/pydeepity/json"),
      getJson("https://api.github.com/repos/Deepity-HQ/Deepity"),
    ]);
    inflight.then(([pypi, gh]) => {
      if (!live) return;
      const next: RepoStats = {
        version:
          pypi.status === "fulfilled" && typeof pypi.value?.info?.version === "string"
            ? pypi.value.info.version
            : FALLBACK.version,
        stars:
          gh.status === "fulfilled" && typeof gh.value?.stargazers_count === "number"
            ? gh.value.stargazers_count
            : null,
      };
      setStats(next);
      if (pypi.status === "fulfilled" || gh.status === "fulfilled") {
        try {
          sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), stats: next }));
        } catch {
          // storage unavailable: skip caching
        }
      }
    });
    return () => {
      live = false;
    };
  }, []);

  return stats;
}
