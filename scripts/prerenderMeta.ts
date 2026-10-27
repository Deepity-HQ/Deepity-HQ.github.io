import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { SITE_URL, comingSoon, headTags, missing, routes, type RouteMeta } from "../src/routes.ts";

const START = "<!--meta-->";
const END = "<!--/meta-->";

/**
 * After the build, writes one copy of index.html per route with that page's
 * title and social tags filled in (so link previews work without running
 * JavaScript), plus 404.html, sitemap.xml and robots.txt additions.
 */
export default function prerenderMeta(): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-meta",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = readFileSync(resolve(outDir, "index.html"), "utf8");
      const a = template.indexOf(START);
      const b = template.indexOf(END);
      if (a < 0 || b < 0) throw new Error("index.html is missing the <!--meta--> markers");

      const render = (meta: RouteMeta) =>
        template.slice(0, a + START.length) + "\n    " + headTags(meta) + "\n    " + template.slice(b);

      const write = (file: string, meta: RouteMeta) => {
        const full = resolve(outDir, file);
        mkdirSync(resolve(full, ".."), { recursive: true });
        writeFileSync(full, render(meta));
      };

      for (const r of routes) write(r.path === "/" ? "index.html" : `${r.path.slice(1)}/index.html`, r);
      write(`${comingSoon.path.slice(1)}/index.html`, comingSoon);
      write("404.html", missing);

      const urls = routes
        .map((r) => `  <url><loc>${SITE_URL}${r.path === "/" ? "/" : `${r.path}/`}</loc></url>`)
        .join("\n");
      writeFileSync(
        resolve(outDir, "sitemap.xml"),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  };
}
