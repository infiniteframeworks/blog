// End-to-end checks against a full production build. Run with `npm test`.

import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import { ROOT, build, cleanup, read } from "./helpers/build.js";
import { findBrokenInternalLinks, listFiles } from "./helpers/links.js";

let site;
before(() => {
  site = build("production").dir;
});
after(cleanup);

const routes = () =>
  fs
    .readFileSync(path.join(ROOT, "tests/fixtures/jekyll-routes.txt"), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"));

describe("URLs", () => {
  test("every file the Jekyll site published still exists", () => {
    const missing = routes().filter((r) => !fs.existsSync(path.join(site, r)));
    assert.deepEqual(missing, []);
  });

  test("posts with a blank permalink keep Jekyll's date-based URL", () => {
    for (const route of [
      "/2025/05/17/Getting-Started-With-Jekyll-on-Windows-(Kind-Of).html",
      "/2025/05/17/Setting-Up-A-New-GitHub.io-Site.html",
    ]) {
      assert.match(read(site, route), /<link rel="canonical" href="https:\/\/blog\.infiniteframeworks\.com\/2025\/05\/17\//);
    }
  });

  test("non-public source files are not published", () => {
    const published = listFiles(site).map((f) => "/" + path.relative(site, f));
    const leaked = published.filter((f) =>
      /^\/(README\.md|package(-lock)?\.json|eleventy\.config\.js|scripts\/|lib\/|tests\/|_drafts\/|_templates\/|_posts\/|_sass\/|_data\/|_layouts\/|_includes\/|node_modules\/|\.claude\/|\.obsidian\/|\.github\/)/.test(f),
    );
    assert.deepEqual(leaked, []);
  });

  test("GitHub Pages files are present", () => {
    assert.equal(fs.readFileSync(path.join(site, "CNAME"), "utf8").trim(), "blog.infiniteframeworks.com");
    assert.ok(fs.existsSync(path.join(site, ".nojekyll")));
  });

  test("internal links and assets resolve (except known pre-existing broken links)", () => {
    // Links that were already broken on the Jekyll site: posts linking to
    // unpublished drafts, a typo, and an image that only exists as .webp.
    const known = new Set([
      "/frontmatter/",
      "/technical-debt/",
      "/techincal-debt/",
      "/kingdom-building/",
      "/vision/",
      "/assets/images/posts/architecture-drift.jpg",
    ]);
    const broken = findBrokenInternalLinks(site).filter((b) => !known.has(b.ref));
    assert.deepEqual(broken, []);
  });
});

describe("metadata", () => {
  test("post head matches jekyll-seo-tag output", () => {
    const html = read(site, "/useful-meta-tags-and-head-elements/");
    for (const line of [
      "<title>Useful Meta Tags and Head Elements | And Beyond</title>",
      '<link rel="canonical" href="https://blog.infiniteframeworks.com/useful-meta-tags-and-head-elements/" />',
      '<meta property="og:type" content="article" />',
      '<meta property="article:published_time" content="2025-05-17T00:00:00+00:00" />',
      '<meta name="ai-generated" content="partially">',
      '<link type="application/atom+xml" rel="alternate" href="https://blog.infiniteframeworks.com/feed.xml" title="And Beyond" />',
    ]) {
      assert.ok(html.includes(line), `missing: ${line}`);
    }
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">\n(.*?)<\/script>/)[1]);
    assert.equal(ld["@type"], "BlogPosting");
    assert.equal(ld.datePublished, "2025-05-17T00:00:00+00:00");
  });

  test("home page uses the WebSite schema with social links", () => {
    const html = read(site, "/");
    assert.ok(html.includes("<title>And Beyond | “and beyond is the Infinite Frameworks blog"));
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">\n(.*?)<\/script>/)[1]);
    assert.equal(ld["@type"], "WebSite");
    assert.deepEqual(ld.sameAs, ["https://infiniteframeworks.com", "https://github.com/infiniteframeworks"]);
  });

  test("a blank description falls back to the post excerpt", () => {
    const html = read(site, "/ill-be-your-mirror/");
    assert.ok(html.includes('<meta name="description" content="https://www.youtube.com/watch?v=KGZWb1SIiR4" />'));
    assert.ok(html.includes('<meta property="og:title" content="I’ll Be Your Mirror" />'));
  });

  test("dates render in UTC without shifting a day", () => {
    const html = read(site, "/launching-if/");
    assert.ok(html.includes('datetime="2025-05-07T00:00:00+00:00"'));
    assert.match(html, />\s*May 7, 2025\s*<\/time>/);
  });

  test("AI disclaimer text and link are rendered on posts", () => {
    const html = read(site, "/escaping-liquid-syntax/");
    assert.ok(html.includes('<p>Not Created By AI. For more information, please refer to <a href="/ai-disclaimer.html">AI Disclaimer</a>.</p>'));
  });

  test("Google Analytics only appears in production builds", () => {
    const tag = 'googletagmanager.com/gtag/js?id=G-7PX55JSLCB"';
    assert.ok(read(site, "/").includes(tag));
    const dev = build("development").dir;
    assert.ok(!read(dev, "/").includes(tag));
    assert.ok(!read(dev, "/about/").includes(tag));
  });
});

describe("feed", () => {
  test("Atom feed keeps jekyll-feed entry ids and ordering", () => {
    const xml = read(site, "/feed.xml");
    const entries = xml.split("<entry>").slice(1);
    assert.equal(entries.length, 10);
    assert.match(xml, /<link href="https:\/\/blog\.infiniteframeworks\.com\/feed\.xml" rel="self" type="application\/atom\+xml" \/>/);
    const byLink = Object.fromEntries(entries.map((e) => [e.match(/<link href="([^"]+)"/)[1], e]));
    const ai = byLink["https://blog.infiniteframeworks.com/ai-for-copy/"];
    assert.ok(ai.includes("<id>https://blog.infiniteframeworks.com/AI%20for%20Copy</id>"));
    assert.ok(ai.includes("<published>2026-01-24T00:00:00+00:00</published>"));
    const mirror = byLink["https://blog.infiniteframeworks.com/ill-be-your-mirror/"];
    assert.ok(mirror.includes("<id>https://blog.infiniteframeworks.com/I&apos;ll-Be-Your-Mirror</id>"));
    const published = entries.map((e) => e.match(/<published>([^<]+)/)[1]);
    assert.deepEqual(published, [...published].sort().reverse());
  });
});

describe("tags", () => {
  const cloud = () => [...read(site, "/tags.html").matchAll(/href="\/tags\/([^/]+)\/"[^>]*style="--size: ([\d.]+)rem;"[^>]*>\s*(.+?) \((\d+)\)/g)];

  test("tag cloud counts and sizes", () => {
    const tags = cloud();
    const max = Math.max(...tags.map((t) => Number(t[4])));
    for (const [, slug, size, name, count] of tags) {
      assert.ok(Math.abs(Number(size) - ((Number(count) / max) * 1.5 + 0.85)) < 1e-9, `${name} size`);
      const archive = read(site, `/tags/${slug}/`);
      assert.equal((archive.match(/<li><a href=/g) || []).length >= Number(count), true, `${slug} archive lists ${count}`);
    }
    assert.ok(tags.some((t) => t[3] === "WSL" && t[1] === "wsl"));
    assert.ok(tags.some((t) => t[3] === "chatGPT" && t[1] === "chatgpt"));
  });

  test("graph JSON matches the published posts and links to real pages", () => {
    const graph = JSON.parse(read(site, "/assets/data/tags-graph.json"));
    const ids = new Set(graph.nodes.map((n) => n.id));
    assert.equal(ids.size, graph.nodes.length, "node ids are unique");
    for (const l of graph.links) assert.ok(ids.has(l.source) && ids.has(l.target), JSON.stringify(l));
    for (const n of graph.nodes) {
      assert.ok(["post", "tag"].includes(n.type));
      assert.ok(typeof n.label === "string" && n.label);
      assert.ok(fs.existsSync(path.join(site, decodeURI(n.url.endsWith("/") ? n.url + "index.html" : n.url))), n.url);
    }
    const homePosts = (read(site, "/").match(/class="post-link"/g) || []).length;
    assert.equal(graph.nodes.filter((n) => n.type === "post").length, homePosts);
  });
});

describe("content rendering", () => {
  test("Liquid examples in posts stay literal; live Liquid still renders", () => {
    const html = read(site, "/escaping-liquid-syntax/");
    assert.ok(html.includes("{% raw %}\n//Code with {{ Liquid }} syntax here."));
    assert.ok(html.includes("{{ site.title }}"));
    assert.ok(html.includes('actually renders as <code class="language-plaintext highlighter-rouge">And Beyond</code>'));
    const tagsPost = read(site, "/enabling-tags-in-jekyll-on-github-pages/");
    assert.ok(tagsPost.includes("{% for tag in page.tags %}"));
    assert.ok(tagsPost.includes("{{ tag[0] | slugify }}"));
  });

  test("code blocks, headings and footnotes use kramdown/Rouge markup", () => {
    const html = read(site, "/creating-a-favicon/");
    assert.ok(html.includes('<sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote" rel="footnote">1</a></sup>'));
    assert.ok(html.includes('<li id="fn:1" role="doc-endnote">'));
    const tagsPost = read(site, "/enabling-tags-in-jekyll-on-github-pages/");
    assert.ok(tagsPost.includes('<h1 id="1-tag-your-posts">1. Tag Your Posts</h1>'));
    assert.ok(tagsPost.includes('<div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight"><code>'));
  });

  test("minima stylesheet and social icons are built locally", () => {
    const css = read(site, "/assets/main.css");
    assert.ok(css.includes(".site-header") && css.includes(".highlight .k"));
    assert.ok(read(site, "/assets/minima-social-icons.svg").includes('id="github"'));
  });
});
