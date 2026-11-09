// Syntax highlighting for fenced code blocks that name a language.
//
// Jekyll used Rouge, whose output uses Pygments' short class names
// (.k, .s, .c, ...) styled by minima's _syntax-highlighting.scss. Prism does
// the tokenising here and each Prism token type is mapped to the Pygments
// class Rouge would have emitted, so minima's existing styles still apply.
// Fences without a language (all posts at the time of migration) are left
// as plain escaped text, exactly as Rouge's plaintext lexer did.

import Prism from "prismjs";
import loadLanguages from "prismjs/components/index.js";

loadLanguages.silent = true;
loadLanguages(["bash", "powershell", "json", "yaml", "ruby", "liquid", "markdown", "python", "typescript", "scss", "sql", "diff"]);

const ALIASES = { sh: "bash", shell: "bash", zsh: "bash", console: "bash", ps1: "powershell", yml: "yaml", js: "javascript", ts: "typescript", html: "markup", xml: "markup", svg: "markup", md: "markdown", py: "python", rb: "ruby" };

const PYGMENTS_CLASS = {
  comment: "c", prolog: "cp", doctype: "cp", cdata: "cp",
  punctuation: "p", operator: "o",
  keyword: "k", important: "k", atrule: "k", rule: "k",
  boolean: "kc", constant: "no", builtin: "nb",
  function: "nf", "class-name": "nc", namespace: "nn",
  tag: "nt", selector: "nt", property: "py",
  "attr-name": "na", "attr-value": "s", variable: "nv", parameter: "nv",
  number: "m", string: "s", "template-string": "s", char: "sc", regex: "sr", url: "s", symbol: "ss",
  entity: "ni", inserted: "gi", deleted: "gd", bold: "gs", italic: "ge",
};

function escape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function render(tokens) {
  return tokens
    .map((token) => {
      if (typeof token === "string") return escape(token);
      const inner = Array.isArray(token.content) ? render(token.content) : render([token.content]);
      const cls = PYGMENTS_CLASS[token.type];
      return cls ? `<span class="${cls}">${inner}</span>` : inner;
    })
    .join("");
}

// Returns highlighted HTML, or null when the language is unknown/plain text.
export function highlight(code, lang) {
  const name = ALIASES[lang?.toLowerCase()] ?? lang?.toLowerCase();
  if (!name || name === "plaintext" || name === "text" || !Prism.languages[name]) return null;
  return render(Prism.tokenize(code, Prism.languages[name]));
}
