import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const input=process.argv[2];assert(input,'Pass the verified standalone booth HTML.');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'public/demo-video'),hash=b=>createHash('sha256').update(b).digest('hex');
const original=readFileSync(input,'utf8'),pattern=/<script>window\.__IMPRINT_ASSETS__=([\s\S]+?);<\/script>/,match=original.match(pattern);assert(match,'Embedded film asset map is required.');
const extensions={'font/woff2':'.woff2','image/png':'.png','video/mp4':'.mp4','audio/mpeg':'.mp3','text/javascript':'.js'},assets=[];
function store(bytes,mime,name){assert(extensions[mime],mime);const sha256=hash(bytes),file='assets/'+sha256.slice(0,20)+extensions[mime];assets.push({file,mime,bytes:bytes.length,sha256,source:name});return {file,bytes,url:'/demo-video/'+file};}
const files=[],urls={};for(const[name,uri]of Object.entries(JSON.parse(match[1]))){const m=uri.match(/^data:([^;]+);base64,([A-Za-z0-9+/=]+)$/);assert(m);const asset=store(Buffer.from(m[2],'base64'),m[1],name);files.push(asset);urls[name]=asset.url;}
let html=original.replace(pattern,`<script>window.__IMPRINT_ASSETS__=${JSON.stringify(urls)};</script>`),scripts=0;
html=html.replace(/<script>([\s\S]*?)<\/script>/g,(tag,js)=>{if(js.startsWith('window.__IMPRINT_ASSETS__='))return tag;scripts++;const asset=store(Buffer.from(js),'text/javascript','booth-player.js');files.push(asset);return `<script defer src="${asset.url}"></script>`;});assert.equal(scripts,1);
html=html.replace('<head>','<head><base href="/demo-video/"><meta name="robots" content="noindex, nofollow, noarchive">');assert(!/data:[^;]+;base64,/.test(html));
mkdirSync(path.join(out,'assets'),{recursive:true});for(const {file,bytes}of files){const dest=path.join(out,file);if(existsSync(dest))assert(readFileSync(dest).equals(bytes),'Existing asset differs: '+file);else writeFileSync(dest,bytes);}
// Independent entry and manifest. Never overwrite the approved full film.
writeFileSync(path.join(out,'booth.html'),html);
const manifest={source:path.basename(input),sourceSha256:hash(original),entry:'booth.html',entrySha256:hash(html),durationSeconds:40,width:1080,height:1920,qrDestination:'https://neo-luddite-prototype.vercel.app/',assets};writeFileSync(path.join(out,'booth-manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({entry:'/demo-video/booth.html',htmlBytes:Buffer.byteLength(html),sourceSha256:manifest.sourceSha256,assets:assets.length}));
