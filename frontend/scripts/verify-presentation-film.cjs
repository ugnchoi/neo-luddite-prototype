// Catches a deck that plays an obsolete film/audio export after /demo-video changes.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const origin=process.argv[2]||'http://127.0.0.1:3052';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const manifest=await fetch(origin+'/demo-video/manifest.json').then(r=>r.json());
 const mix=manifest.assets.filter(a=>a.mime==='audio/mpeg');assert.equal(mix.length,1);
 const b=await chromium.launch({executablePath:'/home/ugnchoi/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',args:['--no-sandbox'],ignoreDefaultArgs:['--disable-dev-shm-usage']});
 try{
 const p=await b.newPage({viewport:{width:1440,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin+'/presentation#slide-3',{waitUntil:'domcontentloaded'});await p.locator('#film-start').click();
 await p.waitForFunction(()=>document.querySelector('.film.started'));
 const f=await p.locator('#demo-frame').contentFrame().locator('#root').elementHandle().then(e=>e.ownerFrame());
 await f.waitForFunction(()=>window.__consultationReview);
 const audioSrc=await f.evaluate(()=>[...document.querySelectorAll('audio')].find(a=>a.currentSrc)?.currentSrc);
 assert(audioSrc,'The presentation must load the film audio');
 const bytes=await fetch(audioSrc).then(r=>r.arrayBuffer());
 assert.equal(sha(Buffer.from(bytes)),mix[0].sha256,'The deck must play the exact current full-film audio');
 await f.waitForFunction(()=>[...document.querySelectorAll('audio')].some(a=>!a.paused&&!a.muted&&a.readyState>=2),undefined,{timeout:45000});
 const first=await f.evaluate(()=>window.__consultationReview.frame());await f.waitForFunction(first=>window.__consultationReview.frame()>first+30,first,{timeout:15000});
 await p.locator('#film-toggle').click();await p.waitForTimeout(300);assert(await f.evaluate(()=>[...document.querySelectorAll('audio,video')].every(a=>a.paused)));
 await p.locator('#film-seek').fill('4740');await p.locator('#film-seek').dispatchEvent('input');await f.waitForFunction(()=>window.__consultationReview.frame()===4740);
 await p.locator('#film-toggle').click();await p.waitForTimeout(800);assert(await f.evaluate(()=>window.__consultationReview.frame()>4740));
 await p.locator('#film-restart').click();await f.waitForFunction(()=>window.__consultationReview.frame()>=1200&&window.__consultationReview.frame()<1300);
 await p.locator('#film-next').click();await p.waitForTimeout(300);assert(await f.evaluate(()=>[...document.querySelectorAll('audio,video')].every(a=>a.paused)));assert(await p.locator('#slide-4').evaluate(el=>el.classList.contains('active')));
 await p.locator('#fullscreen').click();assert(await p.evaluate(()=>Boolean(document.fullscreenElement)));await p.evaluate(()=>document.exitFullscreen());
 await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
 const result={result:'PASS',checkedAt:new Date().toISOString(),origin,source:manifest.source,sourceSha256:manifest.sourceSha256,audioSha256:mix[0].sha256,iframeUrl:f.url(),slides:await p.locator('.slide').count(),controls:{play:true,pause:true,seek:true,restart:true,pauseAfterExit:true,fullscreen:true},mobileOverflow:false,errors};
 if(process.argv[3])fs.writeFileSync(path.resolve(process.argv[3]),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
