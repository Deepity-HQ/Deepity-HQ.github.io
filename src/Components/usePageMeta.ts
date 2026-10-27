import { useEffect } from "react";
import { useLocation } from "react-router";
import { canonicalFor, metaFor } from "../routes.ts";

const setTag = (selector: string, attr: string, value: string, create: () => HTMLElement) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const meta = (key: "name" | "property", name: string) => () => {
  const el = document.createElement("meta");
  el.setAttribute(key, name);
  return el;
};

/** Keeps the tab title and social tags in step with client-side navigation */
export default function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const m = metaFor(pathname);
    const ogTitle = m.ogTitle ?? m.title;
    document.title = m.title;
    setTag('meta[name="description"]', "content", m.description, meta("name", "description"));
    setTag('meta[property="og:title"]', "content", ogTitle, meta("property", "og:title"));
    setTag('meta[property="og:description"]', "content", m.description, meta("property", "og:description"));
    setTag('meta[property="og:url"]', "content", canonicalFor(m.path), meta("property", "og:url"));
    setTag('meta[name="twitter:title"]', "content", ogTitle, meta("name", "twitter:title"));
    setTag('meta[name="twitter:description"]', "content", m.description, meta("name", "twitter:description"));
    setTag("link[rel=canonical]", "href", canonicalFor(m.path), () => {
      const el = document.createElement("link");
      el.rel = "canonical";
      return el;
    });
    document.head.querySelector('meta[name="robots"]')?.remove();
    if (m.noindex) {
      const el = document.createElement("meta");
      el.name = "robots";
      el.content = "noindex";
      document.head.appendChild(el);
    }
  }, [pathname]);
}
