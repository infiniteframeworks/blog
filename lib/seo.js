// Replacement for the jekyll-seo-tag plugin ({% seo %}). Ports the logic of
// jekyll-seo-tag 2.8.0 (lib/jekyll-seo-tag/drop.rb, json_ld_drop.rb,
// author_drop.rb, template.html) so titles, descriptions, canonical URLs,
// Open Graph / Twitter tags and JSON-LD match what the Jekyll site emitted.

import {
  absoluteUrl,
  dateToXmlschema,
  escapeOnce,
  normalizeWhitespace,
  stripHtml,
  uriEscapePath,
} from "./jekyll-compat.js";

const TITLE_SEPARATOR = " | ";
const HOMEPAGE_OR_ABOUT = /^\/(about\/)?(index.html?)?$/;

const isHash = (v) => v !== null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date);
const blank = (v) => v === null || v === undefined || String(v) === "";

export function createSeo({ md, generator }) {
  // markdownify | strip_html | normalize_whitespace | escape_once
  const formatString = (value) => {
    if (blank(value)) return null;
    const out = escapeOnce(normalizeWhitespace(stripHtml(md.render(String(value)))));
    return out === "" ? null : out;
  };

  return function seoTags({ data, page, site, isPost, titleTag = true, generator: generatorOverride }) {
    const generatorName = generatorOverride ?? generator;
    const url = page.url;
    const pageSeo = isHash(data.seo) ? data.seo : {};
    const siteSocial = isHash(site.social) ? site.social : {};
    const homepageOrAbout = HOMEPAGE_OR_ABOUT.test(url);
    const abs = (u) => absoluteUrl(u, site.url, site.baseurl);

    const siteTitle = formatString(site.title ?? site.name);
    const siteDescription = formatString(site.description);
    const siteTagline = formatString(site.tagline);
    const pageTitle = formatString(data.title) ?? siteTitle;

    let title;
    if (siteTitle && pageTitle !== siteTitle) title = pageTitle + TITLE_SEPARATOR + siteTitle;
    else if (siteDescription && siteTitle) title = siteTitle + TITLE_SEPARATOR + (siteTagline ?? siteDescription);
    else title = pageTitle ?? siteTitle;

    const description = formatString(blank(data.description) ? (isPost ? data.excerpt : null) : data.description) ?? siteDescription;

    // AuthorDrop
    const authorSource = [data.author, Array.isArray(data.authors) ? data.authors[0] : undefined, site.author].find((s) => !blank(s));
    let author = {};
    if (isHash(authorSource)) author = authorSource;
    else if (typeof authorSource === "string") {
      const fromData = isHash(site.data?.authors?.[authorSource]) ? site.data.authors[authorSource] : {};
      author = { name: authorSource, ...fromData };
    }

    const canonical = blank(data.canonical_url) ? abs(url).replace(/\/index\.html$/, "/") : data.canonical_url;
    const pageLang = data.lang ?? site.lang ?? "en_US";
    const locale = String(data.locale ?? site.locale ?? pageLang).replace(/-/g, "_");

    // ImageDrop
    let image = null;
    const rawImage = data.image;
    if (!blank(rawImage)) {
      image = isHash(rawImage) ? { ...rawImage } : { path: rawImage };
      if (blank(image.path)) image = null;
      else if (!/^[a-z][a-z0-9+.-]*:/i.test(image.path)) image.path = uriEscapePath(abs(image.path));
    }

    const date = isPost ? page.date : null;
    const datePublished = date ? dateToXmlschema(date) : null;
    const dateModified = pageSeo.date_modified ?? data.last_modified_at ?? date;

    const type = pageSeo.type ?? (homepageOrAbout ? "WebSite" : date ? "BlogPosting" : "WebPage");
    const name = pageSeo.name ? formatString(pageSeo.name) : !homepageOrAbout ? null : siteSocial.name ? formatString(siteSocial.name) : siteTitle;
    const links = pageSeo.links ?? (homepageOrAbout && siteSocial.links ? siteSocial.links : null);
    const logo = site.logo ? uriEscapePath(abs(site.logo)) : null;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": type,
      author: author.name
        ? { "@type": author.type ?? "Person", name: author.name, ...(author.url ? { url: author.url } : {}) }
        : undefined,
      dateModified: dateModified ? dateToXmlschema(dateModified) : undefined,
      datePublished: datePublished ?? undefined,
      description: description ?? undefined,
      headline: pageTitle ?? undefined,
      image: image ? (Object.keys(image).length === 1 ? image.path : { ...image, url: image.path, path: undefined, "@type": "imageObject" }) : undefined,
      mainEntityOfPage: ["BlogPosting", "CreativeWork"].includes(type) ? { "@type": "WebPage", "@id": canonical } : undefined,
      name: name ?? undefined,
      publisher: logo
        ? { "@type": "Organization", logo: { "@type": "ImageObject", url: logo }, ...(author.name ? { name: author.name } : {}) }
        : undefined,
      sameAs: links ?? undefined,
      url: canonical,
    };
    const sortedLd = Object.fromEntries(Object.keys(jsonLd).sort().filter((k) => jsonLd[k] !== undefined).map((k) => [k, jsonLd[k]]));
    if (isHash(sortedLd.image)) delete sortedLd.image.path;

    const lines = ["<!-- Begin SEO tags -->"];
    if (title && titleTag) lines.push(`<title>${title}</title>`);
    lines.push(`<meta name="generator" content="${generatorName}" />`);
    if (pageTitle) lines.push(`<meta property="og:title" content="${pageTitle}" />`);
    if (author.name) lines.push(`<meta name="author" content="${author.name}" />`);
    lines.push(`<meta property="og:locale" content="${locale}" />`);
    if (description) {
      lines.push(`<meta name="description" content="${description}" />`);
      lines.push(`<meta property="og:description" content="${description}" />`);
    }
    if (site.url) {
      lines.push(`<link rel="canonical" href="${canonical}" />`);
      lines.push(`<meta property="og:url" content="${canonical}" />`);
    }
    if (siteTitle) lines.push(`<meta property="og:site_name" content="${siteTitle}" />`);
    if (image) {
      lines.push(`<meta property="og:image" content="${image.path}" />`);
      if (image.height) lines.push(`<meta property="og:image:height" content="${image.height}" />`);
      if (image.width) lines.push(`<meta property="og:image:width" content="${image.width}" />`);
      if (image.alt) lines.push(`<meta property="og:image:alt" content="${image.alt}" />`);
    }
    if (datePublished) {
      lines.push(`<meta property="og:type" content="article" />`);
      lines.push(`<meta property="article:published_time" content="${datePublished}" />`);
    } else {
      lines.push(`<meta property="og:type" content="website" />`);
    }
    if (image) {
      lines.push(`<meta name="twitter:card" content="${data.twitter?.card ?? site.twitter?.card ?? "summary_large_image"}" />`);
      lines.push(`<meta property="twitter:image" content="${image.path}" />`);
    } else {
      lines.push(`<meta name="twitter:card" content="summary" />`);
    }
    if (image?.alt) lines.push(`<meta name="twitter:image:alt" content="${image.alt}" />`);
    if (pageTitle) lines.push(`<meta property="twitter:title" content="${pageTitle}" />`);
    if (site.twitter) {
      lines.push(`<meta name="twitter:site" content="@${String(site.twitter.username ?? "").replace(/@/g, "")}" />`);
      const creator = author.twitter ?? author.name;
      if (typeof creator === "string") lines.push(`<meta name="twitter:creator" content="@${creator.replace(/^@/, "")}" />`);
    }
    const wv = site.webmaster_verifications;
    if (isHash(wv)) {
      const map = { google: "google-site-verification", bing: "msvalidate.01", alexa: "alexaVerifyID", yandex: "yandex-verification", baidu: "baidu-site-verification", facebook: "facebook-domain-verification" };
      for (const [key, metaName] of Object.entries(map)) if (wv[key]) lines.push(`<meta name="${metaName}" content="${wv[key]}" />`);
    } else if (site.google_site_verification) {
      lines.push(`<meta name="google-site-verification" content="${site.google_site_verification}" />`);
    }
    lines.push(`<script type="application/ld+json">\n${JSON.stringify(sortedLd)}</script>`);
    lines.push("<!-- End SEO tags -->");
    return lines.join("\n");
  };
}
