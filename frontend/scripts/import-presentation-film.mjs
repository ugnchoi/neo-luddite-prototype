import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Use the same verified MP4 as the approved standalone introduction.
const [deliveryPath]=process.argv.slice(2);
assert(deliveryPath,'Usage: node scripts/import-presentation-film.mjs <verified-intro-delivery-directory>');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public'),deck=path.join(root,'presentation');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const delivery=JSON.parse(readFileSync(path.join(deliveryPath,'manifest.json')));
const verification=JSON.parse(readFileSync(path.join(deliveryPath,'media-verification.json')));
const intro=JSON.parse(readFileSync(path.join(root,'demo-video/intro-manifest.json')));
const video=delivery.files.find(f=>f.file.endsWith('.mp4')),published=intro.assets.find(f=>f.file.endsWith('.mp4'));
assert(video&&published);assert.equal(delivery.durationSeconds,90);assert.equal(verification.result,'PASS');
const bytes=readFileSync(path.join(deliveryPath,video.file)),sha256=hash(bytes);
assert.equal(sha256,video.sha256);assert.equal(sha256,verification.sha256);assert.equal(sha256,published.sha256);
assert.equal(hash(readFileSync(path.join(root,'demo-video',published.file))),sha256);
const file='/demo-video/'+published.file;
const bridgePath=path.join(deck,'assets/film-native.js'),scriptPath=path.join(deck,'deck.js');
writeFileSync(bridgePath,readFileSync(bridgePath,'utf8').replaceAll('5999','2699'));
writeFileSync(scriptPath,readFileSync(scriptPath,'utf8').replaceAll('3:20','1:30').replaceAll('3분 20초','1분 30초'));
const bridgeHash=hash(readFileSync(bridgePath));
const html=`<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>CrediGraph · 90초 소개</title>
<style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#171914}video{display:block;width:100%;height:100%;object-fit:contain}</style></head>
<body><video id="presentation-video" src="${file}" preload="auto" playsinline aria-label="CrediGraph 1분 30초 소개 영상"></video><script src="/presentation/assets/film-native.js?v=${bridgeHash.slice(0,12)}"></script></body></html>\n`;
writeFileSync(path.join(deck,'assets/presentation-film.html'),html);
const entry=`assets/presentation-film.html?v=${hash(html).slice(0,12)}`;
const indexPath=path.join(deck,'index.html');let index=readFileSync(indexPath,'utf8');
index=index.replace(/<iframe id="demo-frame"[^>]*>/,tag=>tag.replace(/ data-src="[^"]*"/,'').replace('id="demo-frame"',`id="demo-frame" data-src="${entry}"`));
index=index.replaceAll('3분 20초','1분 30초').replaceAll('3:20','1:30').replace('max="5999"','max="2699"').replace('발표 노트 · 200초','발표 노트 · 90초').replace('최신 영상의 상담부터 마무리까지 1분 30초를 재생합니다.','승인된 CrediGraph 90초 소개 영상을 재생합니다.').replace('F Human Imprint 00:40–04:00 · R §5','F CrediGraph 90초 소개 00:00–01:30 · R §5');
index=index.replace(/src="deck\.js(?:\?[^"]*)?"/,`src="deck.js?v=${hash(readFileSync(scriptPath)).slice(0,12)}"`);
writeFileSync(indexPath,index);
const manifestPath=path.join(deck,'manifest.json'),manifest=JSON.parse(readFileSync(manifestPath));
manifest.source_demo=video.file;manifest.source_demo_sha256=sha256;
manifest.audio=[{file,mime:'video/mp4',embedded:true,sha256}];
manifest.filmRange={startFrame:0,endFrame:2699,fps:30,durationSeconds:90};
manifest.playback={mode:'native-video',file,bytes:bytes.length,sha256,sourceIntro:video.file,sourceIntroHtmlSha256:intro.sourceHtmlSha256,entry,durationSeconds:90,derivation:'Approved 90-second introduction; identical MP4 bytes to /demo-video/intro.html'};
for(const name of ['index.html','deck.js','assets/film-native.js','assets/presentation-film.html'])manifest.files[name]=hash(readFileSync(path.join(deck,name)));
writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest.playback,null,2));
