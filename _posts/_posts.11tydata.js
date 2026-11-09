// Data applied to every post in _posts/, reproducing Jekyll's post handling.

import { defaultPostUrl, postId } from "../lib/jekyll-compat.js";
import { markdown } from "../lib/markdown.js";
import { isPublished } from "../lib/posts.js";

const blank = (v) => v === null || v === undefined || String(v).trim() === "";

export default {
  eleventyComputed: {
    // Explicit permalinks are used verbatim. Absent/blank permalinks get
    // Jekyll's default "date" style: /:categories/:year/:month/:day/:title.html
    // Future-dated and `published: false` posts are not written, as in Jekyll.
    permalink: (data) => {
      if (!isPublished(data, data.page.date)) return false;
      if (data.permalink === false) return false;
      if (!blank(data.permalink)) return data.permalink;
      return defaultPostUrl(data.page.inputPath, data.page.date, data);
    },

    // Jekyll's post.excerpt: the rendered first block (up to the first blank
    // line). Used as the SEO/feed description when `description` is blank.
    excerpt: (data) => {
      if (!blank(data.excerpt)) return data.excerpt;
      const raw = String(data.page.rawInput ?? "");
      const head = raw.split("\n\n")[0];
      return markdown.render(head);
    },

    // Jekyll's post.id ("/<filename slug>"), used for Atom entry ids so feed
    // readers don't see existing posts as new.
    jekyll_id: (data) => postId(data.page.inputPath, data),
  },
};
