import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const input=process.argv[2];assert(input,'Pass the verified intro delivery directory.');
const source=path.resolve(input),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'public/demo-video');
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(readFileSync(path.join(source,'manifest.json')));
assert.equal(manifest.durationSeconds,90);assert.equal(manifest.width,1920);assert.equal(manifest.height,1080);
const verification=JSON.parse(readFileSync(path.join(source,'media-verification.json')));assert.equal(verification.result,'PASS');
const original=readFileSync(path.join(source,manifest.entry),'utf8');let html=original;
const assets=[];mkdirSync(path.join(out,'assets'),{recursive:true});
for(const ext of ['.mp4','.jpg']){
 const record=manifest.files.find(f=>f.file.endsWith(ext));assert(record);
 const bytes=readFileSync(path.join(source,record.file));assert.equal(sha(bytes),record.sha256);
 const file='assets/'+record.sha256.slice(0,20)+ext,destination=path.join(out,file);
 if(existsSync(destination))assert(readFileSync(destination).equals(bytes));else writeFileSync(destination,bytes);
 html=html.replaceAll(record.file,'/demo-video/'+file);assets.push({...record,file,source:record.file});
}
writeFileSync(path.join(out,'intro.html'),html);
writeFileSync(path.join(out,'intro-manifest.json'),JSON.stringify({revision:manifest.revision,entry:'intro.html',entrySha256:sha(html),sourceHtmlSha256:sha(original),durationSeconds:90,width:1920,height:1080,fps:30,serviceUrl:manifest.serviceUrl,assets},null,2)+'\n');
console.log(JSON.stringify({entry:'/demo-video/intro.html',durationSeconds:90,entrySha256:sha(html),assets:assets.length}));
