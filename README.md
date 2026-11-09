# and beyond

Welcome to the official blog of [Infinite Frameworks](https://infiniteframeworks.com)—a space for sharing ideas, insights, and experiments in web development, design, and digital strategy.

This blog is built with [Eleventy](https://www.11ty.dev/) and hosted on [GitHub Pages](https://pages.github.com) at [**blog.infiniteframeworks.com**](https://blog.infiniteframeworks.com).

---

## 🚀 Features

- Custom domain: `blog.infiniteframeworks.com`
- Built with Eleventy + Markdown + Liquid
- Clean, fast, and static
- HTTPS enforced
- Posts written in a conversational and practical tone

---

## 📚 Blog Topics

Expect posts about:
- Web development and frameworks
- Jekyll tips and setup guides
- Digital strategy for small businesses
- Code experiments and how-tos

---

## 🛠️ Local development

Requirements: [Node.js](https://nodejs.org/) 22 or newer (the version in `.nvmrc`, currently 26 LTS, is what CI uses).

```sh
nvm use          # optional: switch to the Node version in .nvmrc
npm ci           # install exact dependency versions from package-lock.json
npm run dev      # build and serve at http://localhost:8080 with live reload
```

| Command | What it does |
| --- | --- |
| `npm run dev` (or `npm start`) | Development server with live reload. Google Analytics and Disqus are off. |
| `npm run build` | Production build into `_site/` (analytics on). This is what gets deployed. |
| `npm run build:dev` | One-off development build into `_site/`. |
| `npm test` | Builds the site into temporary folders and checks URLs, feed, metadata, tags and rendering. |
| `npm run check` | Clean production build followed by the tests. |

## ✍️ Writing posts

Posts live in `_posts/` and are named `YYYY-MM-DD-Title.md`. Front matter follows `_templates/Frontmatter.md`:

```yaml
---
title: My Post
date: 2026-01-24
layout: post
author: Jim Smits
permalink: /my-post/
description: One sentence used for the meta description and feed summary.
tags:
  - how-to
ai-disclaimer: Written by Me
ai-generated: none
---
```

- **URLs.** A post is published at its `permalink`. If `permalink` is left blank, it gets the old Jekyll date-style URL, e.g. `/2025/05/17/My-Post-Title.html`. Changing a permalink changes the public URL, so don't edit permalinks on published posts.
- **Dates.** The front matter `date` wins over the filename date, and dates are treated as UTC (as they were on GitHub Pages). Posts dated in the future are not built until a build runs after that date. `published: false` also hides a post.
- **Drafts.** Work in progress goes in `_drafts/`, which is never built or published.
- **Tags.** Tag archive pages (`/tags/<slug>/`), the tag cloud on `/tags.html` and the graph data (`/assets/data/tags-graph.json`) are generated during the build from published posts. There is nothing to regenerate by hand. Tags are slugified the way Jekyll did it (`chatGPT` → `/tags/chatgpt/`). If two different tags would share one URL, the build prints a warning and merges them on one archive page.
- **Liquid.** Posts are run through Liquid before Markdown, just like Jekyll, so `{{ site.title }}` works in a post. To show Liquid code literally, wrap it in `{% raw %}…{% endraw %}`.
- **Images** go in `assets/images/posts/` (see `scripts/convert-images-to-webp.sh`).

Other pages (`about.markdown`, `ai-disclaimer.html`, `tags.html`, `404.html`) need an explicit `permalink` in their front matter. Pages with a `title` appear in the header navigation in file-name order, unless `header_pages` is set in `_data/site.js`.

## 🗂️ How the project is organised

| Path | Purpose |
| --- | --- |
| `eleventy.config.js` | Eleventy configuration: template engines, filters, collections, Sass, passthrough files. |
| `_data/site.js` | Site settings (title, URL, author, social links, Google Analytics ID, optional Disqus). Formerly `_config.yml`. |
| `_data/env.js` | Build environment (`production` when `ELEVENTY_ENV=production`). |
| `_layouts/`, `_includes/` | Liquid templates, ported from Jekyll's minima theme and this site's overrides. |
| `_posts/` | Blog posts. `_posts/_posts.11tydata.js` applies Jekyll's URL and publishing rules. |
| `lib/` | Helpers that reproduce Jekyll behaviour: slugify, URLs, dates, kramdown-style Markdown, SEO tags (replaces `jekyll-seo-tag`) and post/tag collections. |
| `feed.liquid` | Atom feed at `/feed.xml` (replaces `jekyll-feed`). |
| `tag-archives.html` | Generates one `/tags/<slug>/` page per tag. |
| `assets/data/tags-graph.11ty.js` | Generates the graph view's JSON. |
| `assets/main.scss`, `_sass/` | minima's stylesheet (vendored, MIT licensed), compiled to `/assets/main.css`. Site styles live in `assets/custom.css`. |
| `tests/` | Automated checks (`npm test`). |

## 🚢 Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs dependencies with `npm ci`, runs the production build and tests, and deploys `_site/` to GitHub Pages. Pull requests are built and tested but not deployed. The workflow can also be run manually from the **Actions** tab.

One-time GitHub setup: in the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. The custom domain comes from the `CNAME` file, which is copied into the build, and a `.nojekyll` file is added so GitHub Pages serves the output without running Jekyll.

## 📄 License

Content is licensed under [CC BY 4.0](LICENSE). The minima theme styles in `_sass/` are MIT licensed (see `_sass/minima/LICENSE.txt`).
