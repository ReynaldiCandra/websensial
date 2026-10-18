/**
 * Downloads the Plus Jakarta Sans variable woff2 subsets so the build never
 * needs to reach fonts.googleapis.com (next/font/local instead).
 * Re-run only to refresh the vendored font files: node scripts/fetch-fonts.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";

const API =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const CSS = await (await fetch(API, { headers: { "User-Agent": UA } })).text();

const blockRe = /\/\* ([\w-]+) \*\/[\s\S]*?font-style: (\w+);[\s\S]*?src: url\((https:\/\/[^)]+\.woff2)\)/g;
const wanted = new Set(["latin", "latin-ext"]);
const targets = [];

for (const match of CSS.matchAll(blockRe)) {
  const [, subset, style, url] = match;
  if (!wanted.has(subset)) continue;
  targets.push({ subset, style, url });
}

if (targets.length !== 4) {
  throw new Error(`Expected 4 latin blocks, found ${targets.length}`);
}

await mkdir("app/fonts", { recursive: true });
for (const { subset, style, url } of targets) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download failed: ${response.status} for ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 20000) throw new Error(`Suspiciously small font file (${buffer.length} bytes) for ${url}`);
  const name = `plus-jakarta-sans-${style === "italic" ? "italic" : "normal"}-${subset}.woff2`;
  await writeFile(`app/fonts/${name}`, buffer);
  console.log(`saved ${name} (${buffer.length} bytes)`);
}
