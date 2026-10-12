import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Import an approved standalone review without rebuilding or changing its film.
const [filmPath, guidePath] = process.argv.slice(2);
if (!filmPath || !guidePath) {
  console.error("Usage: npm run demo-video:import -- <film.html> <Design-Bridge.html>");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/demo-video");
const base = "/demo-video/";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const original = readFileSync(filmPath, "utf8");
const originalGuide = readFileSync(guidePath, "utf8");
const injection = /<script>window\.__IMPRINT_ASSETS__=([\s\S]+?);<\/script>/;
const match = original.match(injection);
assert(match, "Expected the approved Imprint standalone asset map");
const embedded = JSON.parse(match[1]);
assert(Object.keys(embedded).length > 0, "The film must contain its media");
const mimeExtensions = {
  "font/woff2": ".woff2",
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "audio/wav": ".wav",
  "video/webm": ".webm",
  "text/javascript": ".js",
};
const assets = new Map();

function storeAsset(bytes, mime, logicalName) {
  const extension = mimeExtensions[mime];
  assert(extension, `Unsupported asset type: ${mime}`);
  const sha256 = digest(bytes);
  const file = `assets/${sha256.slice(0, 20)}${extension}`;
  const existing = assets.get(file);
  if (existing) {
    assert.equal(existing.sha256, sha256, "Asset filename collision");
    existing.sources.push(logicalName);
  } else {
    assets.set(file, { file, mime, bytes: bytes.length, sha256, sources: [logicalName], content: bytes });
  }
  return base + file;
}

function decodeAsset(uri, name) {
  const parsed = uri.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);
  assert(parsed, `Expected an embedded asset: ${name}`);
  return storeAsset(Buffer.from(parsed[2], "base64"), parsed[1], name);
}

const urls = Object.fromEntries(Object.entries(embedded).map(([name, uri]) => [name, decodeAsset(uri, name)]));
let html = original.replace(injection, `<script>window.__IMPRINT_ASSETS__=${JSON.stringify(urls)};</script>`);
let playerScripts = 0;
html = html.replace(/<script>([\s\S]*?)<\/script>/g, (tag, script) => {
  if (script.startsWith("window.__IMPRINT_ASSETS__=")) return tag;
  playerScripts++;
  const src = storeAsset(Buffer.from(script), "text/javascript", "approved-player.js");
  return `<script defer src="${src}"></script>`;
});
assert.equal(playerScripts, 1, "Expected exactly one approved player bundle");

let guideNumber = 0;
let guide = originalGuide.replace(/data:([^;"'\s]+);base64,([A-Za-z0-9+/=]+)/g, (uri) => decodeAsset(uri, `design-guide-${++guideNumber}`));
guide = guide.replaceAll(`href="${path.basename(filmPath)}`, 'href="/demo-video');
const hostingMeta = `<base href="${base}"><meta name="robots" content="noindex, nofollow, noarchive">`;
html = html.replace("<head>", `<head>${hostingMeta}`);
guide = guide.replace("<head>", `<head>${hostingMeta}`);
assert(html.includes(hostingMeta) && guide.includes(hostingMeta), "Both documents need hosting metadata");
assert(!/data:[^;]+;base64,/.test(html + guide), "No embedded binary payloads should remain");

// Validate everything before writing. Existing hashed assets are retained for
// already-open viewers when a later revision is imported.
mkdirSync(path.join(output, "assets"), { recursive: true });
for (const asset of assets.values()) writeFileSync(path.join(output, asset.file), asset.content);
writeFileSync(path.join(output, "index.html"), html);
writeFileSync(path.join(output, "Design-Bridge.html"), guide);
const manifest = {
  source: path.basename(filmPath),
  sourceSha256: digest(original),
  guideSourceSha256: digest(originalGuide),
  documents: [
    { file: "index.html", bytes: Buffer.byteLength(html), sha256: digest(html) },
    { file: "Design-Bridge.html", bytes: Buffer.byteLength(guide), sha256: digest(guide) },
  ],
  assets: [...assets.values()].map(({ file, mime, bytes, sha256, sources }) => ({ file, mime, bytes, sha256, sources })),
};
writeFileSync(path.join(output, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ output, htmlBytes: Buffer.byteLength(html), assetFiles: assets.size, assetBytes: [...assets.values()].reduce((n, a) => n + a.bytes, 0), sourceSha256: manifest.sourceSha256 }, null, 2));
