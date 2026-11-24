#!/usr/bin/env node
// Saves the content stored in Supabase to lib/data/cms-snapshot.json.
// The public site falls back to this snapshot when the CMS cannot be reached,
// so a paused/unreachable project never replaces the real portfolio with the
// bundled demo catalog. Re-run this after editing content in /admin.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");
const outputPath = path.join(root, "lib/data/cms-snapshot.json");
const CONTENT_KEY = "site-v1";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseEnv(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*[:=]\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

const fileEnv = parseEnv(await readFile(envPath, "utf8").catch(() => ""));
const env = { ...fileEnv, ...process.env };
const url = env.SUPABASE_URL?.trim();
const key = (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || "").trim();

if (!url || !key) {
  fail("SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY harus tersedia di .env.local atau environment.");
}

const endpoint = `${url.replace(/\/$/, "")}/rest/v1/websensial_content?content_key=eq.${CONTENT_KEY}&select=content`;

let response;
try {
  response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(20_000),
  });
} catch (error) {
  fail(`Tidak dapat menghubungi Supabase: ${error instanceof Error ? error.message : String(error)}`);
}

if (!response.ok) {
  fail(`Supabase menjawab HTTP ${response.status}. Pastikan project aktif dan kuncinya benar.`);
}

const rows = await response.json();
const content = Array.isArray(rows) ? rows[0]?.content : null;

if (!content || typeof content !== "object" || !Array.isArray(content.portfolio) || !Array.isArray(content.products)) {
  fail("Konten tersimpan tidak ditemukan atau tidak valid; snapshot tidak ditulis.");
}

await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");

const count = (value) => (Array.isArray(value) ? value.length : 0);
console.log(
  `Snapshot CMS disimpan ke lib/data/cms-snapshot.json — ${count(content.portfolio)} portofolio, `
    + `${count(content.products)} template, ${count(content.articles)} artikel, ${count(content.services)} layanan.`,
);
