// Unit checks for the Jekyll-compatibility helpers.

import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { dateToXmlschema, defaultPostUrl, postId, relativeUrl, slugify } from "../lib/jekyll-compat.js";
import { isPublished, tagArchives } from "../lib/posts.js";
import postsData from "../_posts/_posts.11tydata.js";
import { markdown } from "../lib/markdown.js";

describe("Jekyll compatibility", () => {
  test("slugify matches Jekyll's default and pretty modes", () => {
    assert.equal(slugify("chatGPT"), "chatgpt");
    assert.equal(slugify("WSL"), "wsl");
    assert.equal(slugify("E-E-A-T"), "e-e-a-t");
    assert.equal(slugify("Getting Started With Jekyll on Windows (Kind Of)", { mode: "pretty", cased: true }), "Getting-Started-With-Jekyll-on-Windows-(Kind-Of)");
  });

  test("default post URLs and ids follow Jekyll", () => {
    const date = new Date("2025-05-17T00:00:00Z");
    assert.equal(defaultPostUrl("./_posts/2025-05-17-Setting Up A New GitHub.io Site.md", date), "/2025/05/17/Setting-Up-A-New-GitHub.io-Site.html");
    assert.equal(defaultPostUrl("./_posts/2025-05-17-x.md", date, { categories: ["News"] }), "/news/2025/05/17/x.html");
    assert.equal(postId("./_posts/2025-01-24-AI for Copy.md"), "/AI for Copy");
    assert.equal(dateToXmlschema(date), "2025-05-17T00:00:00+00:00");
  });

  test("relative_url keeps fragments", () => {
    assert.equal(relativeUrl("/assets/minima-social-icons.svg#github"), "/assets/minima-social-icons.svg#github");
    assert.equal(relativeUrl("feed.xml", "/blog"), "/blog/feed.xml");
  });
});

describe("publishing rules", () => {
  const permalink = postsData.eleventyComputed.permalink;
  const page = (date) => ({ inputPath: "./_posts/2025-05-17-Some Post.md", date: new Date(date) });

  test("future-dated and unpublished posts are not written", () => {
    assert.equal(isPublished({}, new Date(Date.now() + 86400000)), false);
    assert.equal(permalink({ page: page(Date.now() + 86400000), permalink: "/future/" }), false);
    assert.equal(permalink({ page: page("2025-05-17"), permalink: "/x/", published: false }), false);
  });

  test("explicit permalinks win; blank ones use the date style", () => {
    assert.equal(permalink({ page: page("2025-05-17"), permalink: "/explicit/" }), "/explicit/");
    assert.equal(permalink({ page: page("2025-05-17"), permalink: null }), "/2025/05/17/Some-Post.html");
    assert.equal(permalink({ page: page("2025-05-17"), permalink: "  " }), "/2025/05/17/Some-Post.html");
  });

  test("tags that collide on one URL are merged and reported", () => {
    const post = (title, tags, date) => ({ data: { title, tags }, date: new Date(date), inputPath: `./_posts/${date}-${title}.md` });
    const warnings = [];
    const archives = tagArchives([post("a", ["SEO"], "2025-01-01"), post("b", ["seo"], "2025-01-02")], ["seo", "old"], { warn: (w) => warnings.push(w) });
    assert.equal(archives.filter((a) => a.slug === "seo").length, 1);
    assert.deepEqual(archives.find((a) => a.slug === "seo").posts.map((p) => p.data.title), ["b", "a"]);
    assert.ok(archives.some((a) => a.slug === "old" && a.posts.length === 0));
    assert.equal(warnings.length, 1);
  });
});

describe("markdown", () => {
  test("renders kramdown-style markup", () => {
    assert.equal(markdown.render("Don't `x`"), '<p>Don’t <code class="language-plaintext highlighter-rouge">x</code></p>\n');
    assert.equal(markdown.render("## 2. Two's"), '<h2 id="2-twos">2. Two’s</h2>\n');
    assert.equal(markdown.render('<img src="/a.webp" alt="" />'), '<p><img src="/a.webp" alt="" /></p>\n');
    assert.equal(markdown.render("~~gone~~"), "<p><del>gone</del></p>\n");
    assert.match(markdown.render("```js\nconst a = 1;\n```"), /^<div class="language-js highlighter-rouge"><div class="highlight"><pre class="highlight"><code><span class="k">const<\/span>/);
  });
});
