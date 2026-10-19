export const SITE_URL = "https://deepity.dev";

export const routes = [
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
      "Deepity reaches 98.22% on MNIST, 1.8× faster than ngc-learn on one laptop CPU. Setup, results and caveats.",
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
    description:
      "What makes Deepity different, and how to load and use the library.",
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

export const comingSoon = {
  path: "/notfound",
  title: "Coming soon · Deepity",
  description: "This page is still being built.",
  noindex: true,
};

export const missing = {
  title: "Page not found · Deepity",
  description: "That address doesn't exist, or the page has moved.",
  noindex: true,
};

export function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export function metaFor(pathname) {
  const path = normalizePath(pathname);
  if (path === comingSoon.path) return comingSoon;
  return routes.find((r) => r.path === path) ?? missing;
}

export function canonicalFor(path) {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}/`;
}
