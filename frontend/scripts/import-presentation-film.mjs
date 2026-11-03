import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Accept the verified 00:40–04:00 stream-copy cut of the approved full export.
const [cutPath, fullPath] = process.argv.slice(2);
assert(cutPath && fullPath, 'Usage: node scripts/import-presentation-film.mjs <verified-3m20-cut.mp4> <approved-full.mp4>');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const deck = path.join(root, 'presentation');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const bytes = readFileSync(cutPath), sha256 = hash(bytes);
const file = `assets/${sha256.slice(0, 20)}.mp4`;
writeFileSync(path.join(root, 'demo-video', file), bytes);
const bridgeHash = hash(readFileSync(path.join(deck, 'assets/film-native.js')));
const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>CrediGraph · 3분 20초 시연</title>
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#171914}video{display:block;width:100%;height:100%;object-fit:contain}</style></head>
<body><video id="presentation-video" src="/demo-video/${file}" preload="auto" playsinline aria-label="CrediGraph 상담부터 공동 모델까지, 3분 20초 시연"></video><script src="/presentation/assets/film-native.js?v=${bridgeHash.slice(0, 12)}"></script></body></html>\n`;
writeFileSync(path.join(deck, 'assets/presentation-film.html'), html);
const indexPath = path.join(deck, 'index.html');
let index = readFileSync(indexPath, 'utf8');
const entry = `assets/presentation-film.html?v=${hash(html).slice(0, 12)}`;
index = index.replace(/<iframe id="demo-frame"[^>]*>/, tag => tag.replace(/ data-src="[^"]*"/, '').replace('id="demo-frame"', `id="demo-frame" data-src="${entry}"`));
index = index.replace(/src="deck\.js(?:\?[^"]*)?"/, `src="deck.js?v=${hash(readFileSync(path.join(deck, 'deck.js'))).slice(0, 12)}"`);
writeFileSync(indexPath, index);
const full = JSON.parse(readFileSync(path.join(root, 'demo-video/manifest.json'), 'utf8'));
const manifestPath = path.join(deck, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.filmRange = { startFrame: 1200, endFrame: 7199, fps: 30, durationSeconds: 200 };
manifest.playback = {
  mode: 'native-video', file: `/demo-video/${file}`, bytes: bytes.length, sha256,
  sourceFull: path.basename(fullPath), sourceFullSha256: hash(readFileSync(fullPath)),
  sourceDemoSha256: full.sourceSha256,
  sourceAudioSha256: full.assets.find(a => a.mime === 'audio/mpeg').sha256,
  entry, durationSeconds: 200, derivation: 'Lossless stream copy of the approved full film, seconds 40 through 240',
};
for (const name of ['index.html', 'deck.js', 'assets/film-native.js', 'assets/presentation-film.html']) {
  manifest.files[name] = hash(readFileSync(path.join(deck, name)));
}
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest.playback, null, 2));
