// Per-page metadata. The app uses it to keep the tab title and social tags in
// step with navigation, and the build (scripts/prerenderMeta.ts) uses it to
// write a static HTML file per route so link previews work without JavaScript.
export const SITE_URL = "https://deepity.dev";

export type RouteMeta = {
  path: string;
  title: string;
  ogTitle?: string;
  description: string;
  noindex?: boolean;
};

export const routes: RouteMeta[] = [
  {
    path: "/",
    title: "Deepity: open-source predictive coding engine",
    ogTitle: "Deepity: train neural networks without backpropagation",
    description:
      "Deepity is an open-source predictive coding engine for C++ and Python. Each neuron learns from its own local error, and training runs on CPUs and NVIDIA GPUs.",
  },
  {
    path: "/about",
    title: "About · Deepity",
    description:
      "About Deepity, an open-source library for training predictive coding networks from C++ and Python, built and maintained by one developer.",
  },
  {
    path: "/benchmarks",
    title: "Benchmarks · Deepity",
    description:
      "Deepity reaches 98.22% on MNIST, 3.50× faster than ngc-learn on one laptop CPU. Setup and results.",
  },
  {
    path: "/theory",
    title: "How predictive coding works · Deepity",
    description:
      "How predictive coding works: local prediction errors, the equations Deepity implements, and how its cost compares with backpropagation.",
  },
  {
    path: "/tutorial",
    title: "Tutorials · Deepity",
    description:
      "Tutorials for Deepity, from an introduction to predictive coding to a first look at how Deepity networks are built.",
  },
  {
    path: "/tutorial/0-introduction",
    title: "Tutorial 0: Introduction to predictive coding · Deepity",
    description:
      "An introduction to predictive coding networks for readers with little or no background in predictive coding or Deepity.",
  },
  {
    path: "/tutorial/1-beginning",
    title: "Tutorial 1: Understanding the Deepity library · Deepity",
    description: "What makes Deepity different, and how to load and use the library.",
  },
  {
    path: "/early-access",
    title: "Request early access · Deepity",
    description:
      "Request early access to Deepity and tell us what you are building with predictive coding.",
  },
  {
    path: "/privacy",
    title: "Privacy · Deepity",
    description:
      "What the Deepity website collects when you visit it or request early access.",
  },
];

export const comingSoon: RouteMeta = {
  path: "/notfound",
  title: "Coming soon · Deepity",
  description: "This page is still being built.",
  noindex: true,
};

export const missing: RouteMeta = {
  path: "/404",
  title: "Page not found · Deepity",
  description: "That address doesn't exist, or the page has moved.",
  noindex: true,
};

export const normalizePath = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

export function metaFor(pathname: string): RouteMeta {
  const path = normalizePath(pathname);
  if (path === comingSoon.path) return comingSoon;
  return routes.find((r) => r.path === path) ?? missing;
}

export const canonicalFor = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** The <title> plus all description / canonical / Open Graph / Twitter tags for a page */
export function headTags(meta: RouteMeta): string {
  const url = canonicalFor(meta.path);
  const ogTitle = esc(meta.ogTitle ?? meta.title);
  const desc = esc(meta.description);
  const image = `${SITE_URL}/og.png`;
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<link rel="canonical" href="${url}" />`,
    meta.noindex ? `<meta name="robots" content="noindex" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Deepity" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${ogTitle}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${ogTitle}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}
