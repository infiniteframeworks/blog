// markdown-it configured to reproduce the HTML that Jekyll's kramdown (GFM
// parser) + Rouge produced, so existing posts render and style the same:
//   - smart quotes / typographic dashes (kramdown smart_quotes)
//   - GFM-style heading ids
//   - Rouge's code markup: div.language-*.highlighter-rouge > div.highlight > pre.highlight > code
//   - kramdown footnote markup and #fn:/#fnref: anchors (as GitHub Pages' kramdown 2.4 emitted)
//   - kramdown's treatment of span-level HTML (e.g. a lone <img>) as paragraph content

import MarkdownIt from "markdown-it";
import markdownItFootnote from "markdown-it-footnote";
import { highlight } from "./highlight.js";

// Block-level elements kramdown treats as HTML blocks. A line that starts with
// any other tag (img, a, span, em, ...) is paragraph content, as in kramdown.
const BLOCK_TAGS = new Set(
  (
    "address article aside blockquote body center dd details dialog dir div dl dt fieldset figcaption figure " +
    "footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe legend li link main " +
    "map math menu meta nav noframes noscript object ol optgroup option p param pre script section " +
    "style summary table tbody td textarea tfoot th thead title tr ul video audio canvas svg"
  ).split(" "),
);

function escapeCode(str) {
  // Rouge's HTML formatter escapes only &, < and >.
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// kramdown-parser-gfm's generate_gfm_header_id
function gfmHeaderId(text, counters) {
  let id = text.toLowerCase().replace(/[^\p{L}\p{M}\p{Nd}\p{Pc}\- \t]/gu, "").replace(/[ \t]/g, "-");
  const seen = counters.get(id);
  counters.set(id, seen === undefined ? 0 : seen + 1);
  if (seen !== undefined) id = `${id}-${seen + 1}`;
  return id;
}

function inlineText(token) {
  return (token.children || [])
    .map((t) => {
      if (t.type === "text" || t.type === "code_inline") return t.content;
      if (t.type === "image") return inlineText(t);
      return "";
    })
    .join("");
}

export function createMarkdown() {
  const md = new MarkdownIt({ html: true, xhtmlOut: true, linkify: false, typographer: true });

  // Typographic replacements limited to what kramdown does (--, ---, ...).
  md.core.ruler.at("replacements", function kramdownTypography(state) {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== "inline") continue;
      let inAutolink = false;
      for (const t of blockToken.children) {
        if (t.type === "link_open" && t.markup === "autolink") inAutolink = true;
        if (t.type === "link_close" && t.markup === "autolink") inAutolink = false;
        if (t.type !== "text" || inAutolink) continue;
        t.content = t.content
          .replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—")
          .replace(/(^|[^-])--(?=[^-]|$)/gm, "$1–")
          .replace(/\.\.\./g, "…");
      }
    }
  });

  // kramdown only treats block-level elements as HTML blocks.
  const htmlBlock = md.block.ruler.__rules__.find((r) => r.name === "html_block").fn;
  md.block.ruler.at(
    "html_block",
    function kramdownHtmlBlock(state, startLine, endLine, silent) {
      const pos = state.bMarks[startLine] + state.tShift[startLine];
      const line = state.src.slice(pos, state.eMarks[startLine]);
      const m = line.match(/^<\/?([A-Za-z][A-Za-z0-9-]*)(?=[\s/>]|$)/);
      if (m && !BLOCK_TAGS.has(m[1].toLowerCase())) return false;
      return htmlBlock(state, startLine, endLine, silent);
    },
    { alt: ["paragraph", "reference", "blockquote"] },
  );

  // GFM-style ids on headings.
  md.core.ruler.push("kramdown_header_ids", (state) => {
    const counters = new Map();
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== "heading_open" || tokens[i].attrGet("id")) continue;
      tokens[i].attrSet("id", gfmHeaderId(inlineText(tokens[i + 1]), counters));
    }
  });

  // GFM strikethrough: kramdown emits <del>.
  md.renderer.rules.s_open = () => "<del>";
  md.renderer.rules.s_close = () => "</del>";

  md.renderer.rules.code_inline = (tokens, idx) =>
    `<code class="language-plaintext highlighter-rouge">${escapeCode(tokens[idx].content)}</code>`;

  const renderFence = (content, info) => {
    const lang = (info || "").trim().split(/\s+/)[0] || "plaintext";
    const body = highlight(content, lang) ?? escapeCode(content);
    return (
      `<div class="language-${md.utils.escapeHtml(lang)} highlighter-rouge">` +
      `<div class="highlight"><pre class="highlight"><code>${body}</code></pre></div></div>\n`
    );
  };
  md.renderer.rules.fence = (tokens, idx) => renderFence(tokens[idx].content, tokens[idx].info);
  md.renderer.rules.code_block = (tokens, idx) => renderFence(tokens[idx].content, "");

  // Footnotes, rendered with kramdown's markup and anchor names.
  md.use(markdownItFootnote);
  const label = (tokens, idx) => {
    const meta = tokens[idx].meta;
    return meta.label ?? String(meta.id + 1);
  };
  md.renderer.rules.footnote_ref = (tokens, idx, options, env) => {
    const { id, subId } = tokens[idx].meta;
    const name = env.footnotes.list[id].label ?? String(id + 1);
    const refId = subId > 0 ? `fnref:${name}:${subId}` : `fnref:${name}`;
    return `<sup id="${refId}" role="doc-noteref"><a href="#fn:${name}" class="footnote" rel="footnote">${id + 1}</a></sup>`;
  };
  md.renderer.rules.footnote_block_open = () => '<div class="footnotes" role="doc-endnotes">\n  <ol>\n';
  md.renderer.rules.footnote_block_close = () => "  </ol>\n</div>\n";
  md.renderer.rules.footnote_open = (tokens, idx) => `    <li id="fn:${label(tokens, idx)}" role="doc-endnote">\n`;
  md.renderer.rules.footnote_close = () => "    </li>\n";
  md.renderer.rules.footnote_anchor = (tokens, idx) => {
    const name = label(tokens, idx);
    const { subId } = tokens[idx].meta;
    const target = subId > 0 ? `fnref:${name}:${subId}` : `fnref:${name}`;
    const link = `<a href="#${target}" class="reversefootnote" role="doc-backlink">&#8617;</a>`;
    // Inside the footnote's last paragraph, or (like kramdown) in a paragraph
    // of its own when the footnote ends with a list or other block.
    return tokens[idx + 1]?.type === "paragraph_close" ? ` ${link}` : `<p>${link}</p>\n`;
  };

  return md;
}

// Shared instance used for page rendering, excerpts and SEO/feed text.
export const markdown = createMarkdown();
