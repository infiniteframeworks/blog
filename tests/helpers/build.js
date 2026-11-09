// Builds the site into a temporary directory with a given environment, once
// per environment per test run.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const builds = new Map();

export function build(environment = "production") {
  if (builds.has(environment)) return builds.get(environment);
  const out = fs.mkdtempSync(path.join(os.tmpdir(), `and-beyond-${environment}-`));
  const bin = path.join(ROOT, "node_modules", "@11ty", "eleventy", "cmd.cjs");
  const log = execFileSync(process.execPath, [bin, `--output=${out}`], {
    cwd: ROOT,
    env: { ...process.env, ELEVENTY_ENV: environment, JEKYLL_ENV: "" },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const result = { dir: out, log };
  builds.set(environment, result);
  return result;
}

export function read(dir, route) {
  let file = route.endsWith("/") ? route + "index.html" : route;
  return fs.readFileSync(path.join(dir, decodeURI(file)), "utf8");
}

export function cleanup() {
  for (const { dir } of builds.values()) fs.rmSync(dir, { recursive: true, force: true });
  builds.clear();
}
