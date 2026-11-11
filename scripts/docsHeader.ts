import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import type { Plugin } from "vite";

const MARK = "<!--deepity-home-link-->";

// Runs on every generated docs page, so regenerating the docs never removes it.
const snippet = `${MARK}
<style>
#titlearea{position:relative}
#deepity-home{position:absolute;top:50%;right:16px;transform:translateY(-50%);display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border:1px solid rgba(255,255,255,.18);border-radius:10px;background:rgba(255,255,255,.04);color:rgba(255,255,255,.85)!important;font:500 13px/1 Inter,ui-sans-serif,system-ui,sans-serif;text-decoration:none!important;transition:border-color .15s,background .15s,color .15s}
#deepity-home:hover{border-color:rgba(255,255,255,.35);background:rgba(255,255,255,.09);color:#fff!important}
#deepity-home svg{width:14px;height:14px;color:#a99bff}
@media (max-width:560px){#deepity-home span{display:none}#deepity-home{padding:8px}}
</style>
<script>
(function () {
  var bar = document.getElementById("titlearea");
  if (!bar || document.getElementById("deepity-home")) return;
  var a = document.createElement("a");
  a.id = "deepity-home";
  a.href = "/";
  a.setAttribute("aria-label", "Back to deepity.dev");
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg><span>deepity.dev</span>';
  bar.appendChild(a);
  var logo = document.getElementById("projectlogo");
  if (logo && !logo.querySelector("a")) {
    var img = logo.firstElementChild;
    if (img) { var l = document.createElement("a"); l.href = "/"; logo.replaceChild(l, img); l.appendChild(img); }
  }
})();
</script>`;

const inject = (html: string) =>
  html.includes(MARK) || !html.includes("</body>") ? html : html.replace("</body>", `${snippet}\n</body>`);

function* htmlFiles(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith(".html")) yield path;
  }
}

/** Adds a link back to the main site to every documentation page. */
export default function docsHeader(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "docs-home-link",
    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? "").split("?")[0]);
        if (!url.startsWith("/docs/")) return next();
        const rel = url.endsWith("/") ? `${url}index.html` : url;
        const path = resolve(root, "public", "." + rel);
        if (!path.endsWith(".html") || !path.startsWith(resolve(root, "public") + sep) || !existsSync(path)) return next();
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(inject(readFileSync(path, "utf8")));
      });
    },
    closeBundle() {
      const docs = join(outDir, "docs");
      if (!existsSync(docs)) return;
      for (const file of htmlFiles(docs)) writeFileSync(file, inject(readFileSync(file, "utf8")));
    },
  };
}
