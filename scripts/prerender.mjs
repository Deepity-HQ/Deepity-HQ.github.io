// Runs after `vite build` and the SSR build. Renders every route to static HTML
// with its own title, description and canonical URL, so GitHub Pages serves
// each page with a 200 and crawlers see the content without running JavaScript.
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import {
  SITE_URL,
  canonicalFor,
  comingSoon,
  missing,
  routes,
} from "../src/routes.js";

const dist = resolve("dist");
const ssrDir = resolve("dist-ssr");

const template = await readFile(resolve(dist, "index.html"), "utf8");
const { render } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")));

const assets = await readdir(resolve(dist, "assets"));
const fontPreloads = ["hanken-grotesk-latin-wght-normal", "funnel-display-latin-wght-normal"]
  .map((name) => {
    const file = assets.find((f) => f.startsWith(name) && f.endsWith(".woff2"));
    if (!file) throw new Error(`font ${name} not found in dist/assets`);
    return `  <link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${file}" />\n`;
  })
  .join("");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`template is missing ${pattern}`);
  return html.replace(pattern, () => replacement);
}

const metaTag = (attr, name) =>
  new RegExp(`<meta ${attr}="${name}" content="[^"]*" />`);

function withHead(html, meta, canonical) {
  const title = esc(meta.ogTitle ?? meta.title);
  const description = esc(meta.description);
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  const tags = [
    ["name", "description", description],
    ["property", "og:url", canonical],
    ["property", "og:title", title],
    ["property", "og:description", description],
    ["property", "og:image:alt", title],
    ["name", "twitter:title", title],
    ["name", "twitter:description", description],
    ["name", "twitter:image:alt", title],
  ];
  for (const [attr, name, content] of tags) {
    html = replaceOnce(html, metaTag(attr, name), `<meta ${attr}="${name}" content="${content}" />`);
  }
  html = html.replace("</head>", `${fontPreloads}</head>`);
  if (meta.noindex) {
    html = html.replace(/ *<link rel="canonical" href="[^"]*" \/>\n/, "");
    html = html.replace("</head>", `  <meta name="robots" content="noindex" />\n</head>`);
  }
  return html;
}

const softwareSource = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Deepity",
  description: routes[0].description,
  codeRepository: "https://github.com/Deepity-HQ/Deepity",
  programmingLanguage: ["C++", "Python", "CUDA"],
  license: "https://opensource.org/licenses/MIT",
};

async function write(file, html) {
  await mkdir(resolve(file, ".."), { recursive: true });
  await writeFile(file, html);
}

async function page(meta, url, canonical) {
  const body = await render(url);
  let html = withHead(template, meta, canonical);
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
  if (url === "/") {
    html = html.replace(
      "</head>",
      `  <script type="application/ld+json">${JSON.stringify(softwareSource)}</script>\n</head>`,
    );
  }
  return html;
}

for (const route of routes) {
  const file =
    route.path === "/"
      ? resolve(dist, "index.html")
      : resolve(dist, route.path.slice(1), "index.html");
  await write(file, await page(route, route.path, canonicalFor(route.path)));
}

await write(resolve(dist, comingSoon.path.slice(1), "index.html"), await page(comingSoon, comingSoon.path, canonicalFor(comingSoon.path)));
// GitHub Pages serves 404.html, with a 404 status, for any address it has no file for.
await write(resolve(dist, "404.html"), await page(missing, "/404", `${SITE_URL}/`));

const urls = routes
  .map((r) => `  <url><loc>${canonicalFor(r.path)}</loc></url>`)
  .concat(`  <url><loc>${SITE_URL}/docs/index.html</loc></url>`)
  .join("\n");
await writeFile(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${routes.length + 2} pages`);
