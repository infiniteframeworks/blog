// Helpers that reproduce the Jekyll / Ruby Liquid behaviour the site was built
// with, so URLs, tag slugs, dates and metadata stay byte-for-byte compatible
// after the move to Eleventy. Each helper names the Jekyll code it mirrors.

import path from "node:path";

// Jekyll::Utils.slugify — modes "default" and "pretty" are the only ones used.
const SLUGIFY_DEFAULT = /[^\p{M}\p{L}\p{Nd}]+/gu;
const SLUGIFY_PRETTY = /[^\p{M}\p{L}\p{Nd}._~!$&'()+,;=@]+/gu;

export function slugify(input, { mode = "default", cased = false } = {}) {
  if (input === null || input === undefined) return input;
  const re = mode === "pretty" ? SLUGIFY_PRETTY : SLUGIFY_DEFAULT;
  let slug = String(input).replace(re, "-").replace(/^-|-$/g, "");
  return cased ? slug : slug.toLowerCase();
}

// Addressable::URI.normalize_component as used by Jekyll's URL helpers:
// percent-encode anything outside the unreserved/sub-delim set, keeping
// existing %XX escapes intact.
const URL_SAFE = /[A-Za-z0-9\-._~!$&'()*+,;=:@/]/;
export function uriEscapePath(str) {
  let out = "";
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "%" && /^[0-9A-Fa-f]{2}$/.test(s.slice(i + 1, i + 3))) {
      out += ch;
    } else if (URL_SAFE.test(ch)) {
      out += ch;
    } else {
      const cp = s.codePointAt(i);
      const char = String.fromCodePoint(cp);
      if (cp > 0xffff) i++;
      out += Array.from(new TextEncoder().encode(char), (b) => "%" + b.toString(16).toUpperCase().padStart(2, "0")).join("");
    }
  }
  return out;
}

const ABSOLUTE_URL = /^[a-z][a-z0-9+.-]*:/i;

function ensureLeadingSlash(s) {
  return !s || s.startsWith("/") ? s : "/" + s;
}

// Jekyll::Filters::URLFilters#relative_url (compute_relative_url)
export function relativeUrl(input, baseurl = "") {
  if (input === null || input === undefined) return input;
  const str = String(input);
  if (ABSOLUTE_URL.test(str)) return str;
  const base = baseurl ? String(baseurl).replace(/\/$/, "") : "";
  return normalizeUrl(ensureLeadingSlash(base) + ensureLeadingSlash(str));
}

// Escape path, query and fragment separately (Addressable::URI#normalize),
// so "/icons.svg#github" keeps its fragment.
function normalizeUrl(url) {
  const m = String(url).match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const escapeExtra = (s) => (s ? s[0] + uriEscapePath(s.slice(1)).replace(/%3F/gi, "?") : "");
  return uriEscapePath(m[1]) + escapeExtra(m[2]) + escapeExtra(m[3]);
}

// Jekyll::Filters::URLFilters#absolute_url
export function absoluteUrl(input, siteUrl, baseurl = "") {
  if (input === null || input === undefined) return input;
  const str = String(input);
  if (ABSOLUTE_URL.test(str)) return str;
  return String(siteUrl).replace(/\/+$/, "") + relativeUrl(str, baseurl);
}

function pad(n, len = 2) {
  return String(n).padStart(len, "0");
}

// Time#xmlschema in UTC, formatted the way Jekyll prints it on GitHub Pages
// ("+00:00" rather than "Z").
export function dateToXmlschema(date) {
  if (!date) return date;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}+00:00`
  );
}

// Jekyll::Filters#xml_escape
export function xmlEscape(input) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Liquid::StandardFilters#strip_html (Ruby Liquid 4)
export function stripHtml(input) {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/<script.*?<\/script>/gims, "")
    .replace(/<!--.*?-->/gms, "")
    .replace(/<style.*?<\/style>/gims, "")
    .replace(/<.*?>/gms, "");
}

// Jekyll::Filters#normalize_whitespace
export function normalizeWhitespace(input) {
  if (input === null || input === undefined) return "";
  return String(input).replace(/\s+/g, " ").trim();
}

// Liquid::StandardFilters#escape_once
const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function escapeOnce(input) {
  if (input === null || input === undefined) return "";
  return String(input).replace(/["><']|&(?!([a-zA-Z]+|(#\d+));)/g, (m) => ESCAPE_MAP[m]);
}

// Liquid::StandardFilters#escape
export function escapeHtml(input) {
  if (input === null || input === undefined) return "";
  return String(input).replace(/[&<>"']/g, (m) => ESCAPE_MAP[m]);
}

// CGI.escape (used by minima's social links)
export function cgiEscape(input) {
  if (input === null || input === undefined) return "";
  return encodeURIComponent(String(input))
    .replace(/[!'()*~]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
    .replace(/%20/g, "+");
}

// Jekyll's post filename pattern: YYYY-MM-DD-slug.ext
const POST_FILENAME = /^(\d{2,4}-\d{1,2}-\d{1,2})-(.*)(\.[^.]+)$/;

// The "slug" Jekyll derives from a post filename (case and spaces preserved),
// e.g. "2025-01-24-AI for Copy.md" -> "AI for Copy".
export function postFilenameSlug(inputPath) {
  const base = path.basename(inputPath);
  const m = base.match(POST_FILENAME);
  return m ? m[2] : base.replace(/\.[^.]+$/, "");
}

// Jekyll's Document#id for a post without categories: "/<slug>".
// jekyll-feed uses this (absolutised) as each Atom entry <id>.
export function postId(inputPath, data = {}) {
  const cats = postCategories(data);
  return "/" + [...cats, postFilenameSlug(inputPath)].join("/");
}

export function postCategories(data = {}) {
  const raw = data.categories ?? data.category ?? [];
  const list = Array.isArray(raw) ? raw : String(raw).split(/\s+/);
  return list.filter((c) => c !== null && c !== undefined && String(c) !== "").map(String);
}

// Jekyll's built-in "date" permalink style, used when a post's `permalink`
// is absent or blank: /:categories/:year/:month/:day/:title:output_ext
export function defaultPostUrl(inputPath, date, data = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const title = slugify(data.slug || postFilenameSlug(inputPath), { mode: "pretty", cased: true });
  const cats = [...new Set(postCategories(data).map((c) => c.toLowerCase()))];
  const url = [
    "",
    ...cats,
    String(d.getUTCFullYear()),
    pad(d.getUTCMonth() + 1),
    pad(d.getUTCDate()),
    `${title}.html`,
  ].join("/");
  return uriEscapePath(url.replace(/\/{2,}/g, "/"));
}

// Utils.pluralized_array_from_hash(data, "tag", "tags"): Jekyll accepts a
// list, or a whitespace-separated string, under either key.
export function postTags(data = {}) {
  for (const key of ["tags", "tag"]) {
    const value = data[key];
    if (value === null || value === undefined || value === "") continue;
    const list = Array.isArray(value) ? value : String(value).split(/\s+/);
    return list.filter((t) => t !== null && t !== undefined && String(t) !== "").map(String);
  }
  return [];
}
