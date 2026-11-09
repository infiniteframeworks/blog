// Post collections and tag data, reproducing Jekyll's site.posts / site.tags.
// Everything that lists posts (home page, tag archives, tag cloud, graph JSON,
// feed) is built from the same `posts` collection defined here.

import path from "node:path";
import { postTags, relativeUrl, slugify } from "./jekyll-compat.js";

export const POSTS_GLOB = "./_posts/**/*.{md,markdown,html}";

// Jekyll excludes posts dated in the future (relative to build time) unless
// --future is passed, and any post with `published: false`.
export const BUILD_TIME = new Date();

export function isPublished(data, date) {
  if (data?.published === false) return false;
  return !(date instanceof Date) || date.getTime() <= BUILD_TIME.getTime();
}

export function isPostInput(inputPath) {
  return /^(\.\/)?_posts\//.test(inputPath);
}

// Jekyll's Document#<=>: by date, then by path.
function compareAscending(a, b) {
  const byDate = a.date - b.date;
  if (byDate !== 0) return byDate;
  return a.inputPath < b.inputPath ? -1 : a.inputPath > b.inputPath ? 1 : 0;
}

// Published posts, oldest first (Jekyll's internal site.posts.docs order).
export function postsAscending(collectionApi) {
  return collectionApi
    .getFilteredByGlob(POSTS_GLOB)
    .filter((item) => isPublished(item.data, item.date))
    .sort(compareAscending);
}

// Jekyll's site.tags: { tag => [posts newest first] }, keyed by the exact tag
// string, in order of first use across posts oldest-first.
export function tagIndex(ascendingPosts) {
  const index = new Map();
  for (const post of ascendingPosts) {
    for (const tag of postTags(post.data)) {
      if (!index.has(tag)) index.set(tag, []);
      const list = index.get(tag);
      if (!list.includes(post)) list.push(post);
    }
  }
  for (const list of index.values()) list.reverse();
  return index;
}

// One archive per /tags/<slug>/ URL. Distinct tags that slugify to the same
// URL (e.g. "SEO" and "seo") share one archive; that is reported so it can be
// fixed in front matter rather than one silently overwriting the other.
export function tagArchives(ascendingPosts, retainedTags = [], { warn = console.warn } = {}) {
  const bySlug = new Map();
  for (const [name, posts] of tagIndex(ascendingPosts)) {
    const slug = slugify(name);
    if (!slug) {
      warn(`[tags] Tag "${name}" produces an empty slug and has no archive page.`);
      continue;
    }
    if (!bySlug.has(slug)) bySlug.set(slug, { slug, tag: name, names: [], posts: [] });
    const archive = bySlug.get(slug);
    archive.names.push(name);
    for (const post of posts) if (!archive.posts.includes(post)) archive.posts.push(post);
  }
  for (const archive of bySlug.values()) {
    if (archive.names.length > 1) {
      warn(`[tags] Tags ${archive.names.map((n) => `"${n}"`).join(", ")} share the URL /tags/${archive.slug}/; their posts are combined on one archive page.`);
      archive.posts.sort((a, b) => compareAscending(b, a));
    }
  }
  for (const name of retainedTags) {
    const slug = slugify(name);
    if (slug && !bySlug.has(slug)) bySlug.set(slug, { slug, tag: name, names: [name], posts: [] });
  }
  return [...bySlug.values()];
}

// Data for /assets/data/tags-graph.json, in the schema tags.html expects:
// { nodes: [{ id, label, type: "post"|"tag", url }], links: [{ source, target }] }
export function tagGraph(ascendingPosts, baseurl = "") {
  const nodes = [];
  const links = [];
  const ids = new Set();
  const uniqueId = (base) => {
    let id = base;
    for (let n = 2; ids.has(id); n++) id = `${base}-${n}`;
    ids.add(id);
    return id;
  };

  const postIds = new Map();
  for (const post of ascendingPosts) {
    const title = String(post.data.title ?? "");
    const id = uniqueId(`post-${title.replace(/ /g, "-")}`);
    postIds.set(post, id);
    nodes.push({ id, label: title, type: "post", url: relativeUrl(post.url, baseurl) });
  }

  for (const [name, posts] of tagIndex(ascendingPosts)) {
    const slug = slugify(name);
    const id = uniqueId(`tag-${name.replace(/ /g, "-")}`);
    nodes.push({ id, label: name, type: "tag", url: relativeUrl(`/tags/${slug}/`, baseurl) });
    for (const post of [...posts].reverse()) links.push({ source: id, target: postIds.get(post) });
  }

  return { nodes, links };
}

// Pages shown in the header navigation. Mirrors minima's header.html:
// site.header_pages (a list of input paths) if set, otherwise every page
// (not post) that has a title, in path order.
export function navPages(collectionApi, headerPages) {
  const pages = collectionApi
    .getAll()
    .filter((item) => !isPostInput(item.inputPath) && item.url && item.data.title && !item.data.pagination);
  const rel = (item) => path.posix.normalize(item.inputPath.replace(/^\.\//, ""));
  if (Array.isArray(headerPages) && headerPages.length) {
    return headerPages.map((p) => pages.find((item) => rel(item) === path.posix.normalize(p))).filter(Boolean);
  }
  return pages.sort((a, b) => (rel(a) < rel(b) ? -1 : rel(a) > rel(b) ? 1 : 0));
}
