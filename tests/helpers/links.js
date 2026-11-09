// Finds internal (site-relative) href/src/xlink:href/srcset references in the
// built HTML and reports those that don't resolve to a file in the output.

import fs from "node:fs";
import path from "node:path";

export function listFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

export function resolveUrl(siteDir, url) {
  let p = decodeURI(url.split("#")[0].split("?")[0]);
  if (p === "") return true; // same-page anchor
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(siteDir, p);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return true;
  // GitHub Pages also serves /foo as /foo.html and /foo/ for /foo
  return fs.existsSync(file + ".html") || fs.existsSync(path.join(file, "index.html"));
}

export function findBrokenInternalLinks(siteDir) {
  const broken = [];
  for (const file of listFiles(siteDir).filter((f) => f.endsWith(".html"))) {
    const html = fs.readFileSync(file, "utf8")
      // ignore code samples and raw <pre> blocks, which contain example markup
      .replace(/<pre[\s\S]*?<\/pre>/g, "")
      .replace(/<code[\s\S]*?<\/code>/g, "");
    const refs = [...html.matchAll(/\s(?:href|src|xlink:href)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (!ref.startsWith("/") || ref.startsWith("//")) continue;
      if (!resolveUrl(siteDir, ref)) broken.push({ page: "/" + path.relative(siteDir, file), ref });
    }
  }
  return broken;
}
