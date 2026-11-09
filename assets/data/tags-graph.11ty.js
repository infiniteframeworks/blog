// Generates /assets/data/tags-graph.json (the data behind the Graph View on
// /tags.html) from the same published-post collection the rest of the site
// uses. Replaces the manual scripts/generate-tag-graph.sh.

import { tagGraph } from "../../lib/posts.js";

export const data = {
  permalink: "/assets/data/tags-graph.json",
  eleventyExcludeFromCollections: true,
};

export function render({ collections, site }) {
  const ascending = [...collections.posts].reverse();
  return JSON.stringify(tagGraph(ascending, site.baseurl), null, 2) + "\n";
}
