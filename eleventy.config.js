// Eleventy configuration for "And Beyond" (blog.infiniteframeworks.com).
//
// The site was migrated from Jekyll (minima theme, jekyll-seo-tag,
// jekyll-feed). The source layout deliberately keeps Jekyll's conventions
// (_posts, _layouts, _includes, Liquid templates) and lib/ provides the
// Jekyll-compatible behaviour Eleventy doesn't have built in. See README.md.

import path from "node:path";
import { writeFile } from "node:fs/promises";
import * as sass from "sass";

import {
  absoluteUrl,
  cgiEscape,
  dateToXmlschema,
  escapeHtml,
  normalizeWhitespace,
  relativeUrl,
  slugify,
  uriEscapePath,
  xmlEscape,
} from "./lib/jekyll-compat.js";
import { markdown } from "./lib/markdown.js";
import { createSeo } from "./lib/seo.js";
import { isPostInput, navPages, postsAscending, tagArchives, tagIndex } from "./lib/posts.js";
import site from "./_data/site.js";

export const config = {
  dir: {
    input: ".",
    includes: "_includes",
    layouts: "_layouts",
    data: "_data",
    output: "_site",
  },
  // Like Jekyll: Liquid runs before Markdown, and .html files are Liquid.
  markdownTemplateEngine: "liquid",
  htmlTemplateEngine: "liquid",
  templateFormats: ["md", "markdown", "html", "liquid", "11ty.js", "scss"],
};

export default function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Source files that are not part of the public site.
  for (const ignore of [
    "README.md",
    "_drafts/**",
    "_templates/**",
    "_sass/**",
    "scripts/**",
    "tests/**",
    "lib/**",
    ".obsidian/**",
    ".claude/**",
    ".github/**",
    "vendor/**",
  ]) {
    eleventyConfig.ignores.add(ignore);
  }

  // Static files copied as-is.
  eleventyConfig.addPassthroughCopy({
    "assets/images": "assets/images",
    "assets/custom.css": "assets/custom.css",
    "assets/minima-social-icons.svg": "assets/minima-social-icons.svg",
    "favicon.ico": "favicon.ico",
    CNAME: "CNAME",
    LICENSE: "LICENSE",
  });

  // GitHub Pages must serve the built output as-is, never run Jekyll on it.
  eleventyConfig.on("eleventy.after", async ({ directories }) => {
    await writeFile(path.join(directories.output, ".nojekyll"), "");
  });

  // ---------------------------------------------------------------------------
  // Templates: Liquid with Jekyll-style includes, Markdown via kramdown-compatible markdown-it.
  eleventyConfig.addExtension("markdown", { key: "md" }); // about.markdown, index.markdown
  eleventyConfig.setLibrary("md", markdown);
  eleventyConfig.setLiquidOptions({
    dynamicPartials: false, // {% include head.html %} without quotes, as in Jekyll
    jekyllInclude: true, // {% include file.html param=value %} -> {{ include.param }}
    strictFilters: true, // fail the build on an unported Jekyll filter
    timezoneOffset: 0, // render dates in UTC, as GitHub Pages' Jekyll did
  });

  // minima's Sass (vendored in _sass/minima, MIT) compiled to /assets/main.css.
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    useLayouts: false,
    compile(inputContent, inputPath) {
      if (path.basename(inputPath).startsWith("_")) return;
      const result = sass.compileString(inputContent, {
        loadPaths: ["_sass"],
        style: "compressed",
        quietDeps: true, // minima 2.5 predates Dart Sass's module system
        silenceDeprecations: ["import"],
      });
      this.addDependencies(inputPath, result.loadedUrls);
      return () => result.css;
    },
  });

  // ---------------------------------------------------------------------------
  // Jekyll / Ruby Liquid filters used by the templates.
  eleventyConfig.addFilter("slugify", (input, mode) => slugify(input, { mode: mode ?? "default" }));
  eleventyConfig.addFilter("relative_url", (input) => relativeUrl(input, site.baseurl));
  eleventyConfig.addFilter("absolute_url", (input) => absoluteUrl(input, site.url, site.baseurl));
  eleventyConfig.addFilter("date_to_xmlschema", dateToXmlschema);
  eleventyConfig.addFilter("xml_escape", xmlEscape);
  eleventyConfig.addFilter("normalize_whitespace", normalizeWhitespace);
  eleventyConfig.addFilter("cgi_escape", cgiEscape);
  eleventyConfig.addFilter("escape", escapeHtml); // Ruby's &quot;/&#39; entities, not LiquidJS's &#34;
  eleventyConfig.addFilter("uri_escape", uriEscapePath);
  eleventyConfig.addFilter("jsonify", (input) => JSON.stringify(input ?? null));
  eleventyConfig.addFilter("markdownify", (input) => markdown.render(String(input ?? "")));
  eleventyConfig.addFilter("smartify", (input) => markdown.renderInline(String(input ?? "")));

  // ---------------------------------------------------------------------------
  // Replacements for the jekyll-seo-tag and jekyll-feed head tags.
  const seoTags = createSeo({ md: markdown, generator: null });
  eleventyConfig.addShortcode("seo", function (arg) {
    const data = this.ctx?.environments ?? this.ctx ?? {};
    return seoTags({
      data,
      page: this.page,
      site: data.site ?? site,
      isPost: isPostInput(this.page.inputPath),
      titleTag: arg !== "title=false",
      generator: data.eleventy?.generator,
    });
  });
  eleventyConfig.addShortcode("feed_meta", function () {
    const href = absoluteUrl("/feed.xml", site.url, site.baseurl);
    return `<link type="application/atom+xml" rel="alternate" href="${xmlEscape(href)}" title="${xmlEscape(site.title)}" />`;
  });

  // ---------------------------------------------------------------------------
  // Collections (Jekyll's site.posts, site.tags, header pages, tag archives).
  eleventyConfig.addCollection("posts", (api) => postsAscending(api).reverse());
  eleventyConfig.addCollection("tagCloud", (api) => [...tagIndex(postsAscending(api)).entries()]);
  eleventyConfig.addCollection("tagArchives", (api) => tagArchives(postsAscending(api), site.retained_tags));
  eleventyConfig.addCollection("navPages", (api) => navPages(api, site.header_pages));

  eleventyConfig.setServerOptions({ watch: ["_site/assets/**/*.css"] });
  eleventyConfig.addWatchTarget("./_sass/");
  eleventyConfig.addWatchTarget("./lib/");
}
