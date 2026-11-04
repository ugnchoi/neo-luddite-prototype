// Verify the current presentation cut, its controls, and continuous decoded playback.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const origin=process.argv[2]||'http://127.0.0.1:3052',out=process.argv[3],full=process.argv.includes('--full'),stress=process.argv.includes('--stress');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const current=await fetch(origin+'/demo-video/manifest.json').then(r=>r.json());
 const manifest=await fetch(origin+'/presentation/manifest.json').then(r=>r.json());
 assert.equal(manifest.playback.sourceDemoSha256,current.sourceSha256,'Reimport the approved presentation export after updating the main film');
 assert.equal(manifest.playback.sourceAudioSha256,current.assets.find(a=>a.mime==='audio/mpeg').sha256,'Presentation must use the current narration/music mix');
 const b=await chromium.launch({executablePath:'/home/ugnchoi/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',args:['--no-sandbox'],ignoreDefaultArgs:['--disable-dev-shm-usage']});
 const errors=[],result={origin,full,stress,checkedAt:new Date().toISOString()};
 try{
  const p=await b.newPage({viewport:{width:1440,height:1000}});p.on('pageerror',e=>errors.push(e.message));
  if(stress){const cdp=await p.context().newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:80,downloadThroughput:1024*1024,uploadThroughput:1024*1024});}
  await p.goto(origin+'/presentation',{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>{location.hash=document.querySelector('.film').id;});
  await p.waitForFunction(()=>!document.querySelector('#film-toggle').disabled);
  const film=p.frames().find(f=>f.url().includes('/assets/presentation-film.html'));assert(film,'Deck must load the approved rendered cut');
  const state=()=>film.evaluate(()=>{const v=document.querySelector('video');return{time:v.currentTime,duration:v.duration,paused:v.paused,muted:v.muted,volume:v.volume,src:v.currentSrc,seeking:v.seeking};});
  const initial=await state();assert.equal(initial.time,0);assert.equal(initial.duration,200);assert.equal(await p.locator('#film-clock').innerText(),'0:00 / 3:20');
  await p.locator('#film-start').click();await film.waitForFunction(()=>document.querySelector('video').currentTime>.7);let s=await state();assert(!s.paused&&!s.muted&&s.volume>0&&s.time<5);
  await p.locator('#film-toggle').click();await p.waitForTimeout(200);const held=(await state()).time;await p.waitForTimeout(350);assert.equal((await state()).time,held);
  const seek=async seconds=>{await p.locator('#film-seek').fill(String(seconds*30));await p.locator('#film-seek').dispatchEvent('input');await film.waitForFunction(s=>{const v=document.querySelector('video');return !v.seeking&&Math.abs(v.currentTime-s)<.04;},seconds);};
  await seek(57);await p.locator('#film-toggle').click();await film.waitForFunction(()=>document.querySelector('video').currentTime>57.5);
  await p.locator('#film-restart').click();await film.waitForFunction(()=>{const v=document.querySelector('video');return !v.seeking&&v.currentTime<2;});
  await p.locator('#film-next').click();await film.waitForFunction(()=>document.querySelector('video').paused);assert(await p.locator('.film + .slide').evaluate(el=>el.classList.contains('active')));
  await p.locator('#fullscreen').click();assert(await p.evaluate(()=>!!document.fullscreenElement));await p.evaluate(()=>document.exitFullscreen());
  await p.locator('#prev').click();await seek(full?0:196);
  await film.evaluate(()=>{const v=document.querySelector('video');window.__qa={decoded:[],events:[],started:performance.now(),ended:false};for(const type of ['loadstart','emptied','waiting','stalled','seeking'])v.addEventListener(type,()=>window.__qa.events.push({type,time:v.currentTime,wall:performance.now()}));v.addEventListener('ended',()=>{window.__qa.ended=true;window.__qa.elapsed=performance.now()-window.__qa.started;window.__qa.quality=v.getVideoPlaybackQuality?.();});const next=(_,m)=>{window.__qa.decoded.push({time:m.mediaTime,wall:performance.now()});if(!v.ended)v.requestVideoFrameCallback(next);};v.requestVideoFrameCallback(next);});
  await p.locator('#film-toggle').click();if(full)console.log('Continuous 3:20 playback started'+(stress?' with 4x CPU throttling and 8 Mbps network':''));
  await p.waitForFunction(()=>document.querySelector('.film + .slide').classList.contains('active'),undefined,{timeout:full?240000:15000});
  const playback=await film.evaluate(()=>window.__qa);assert(playback.ended,'Advance only after native video ended');assert((await state()).paused);
  assert(playback.elapsed>=(full?199000:3900));
  const backwards=playback.decoded.slice(1).filter((v,i)=>v.time<playback.decoded[i].time-.01);assert.deepEqual(backwards,[],'Decoded footage must never travel backwards');
  assert.deepEqual(playback.events.filter(e=>e.type==='emptied'||e.type==='loadstart'),[],'The media source must not reload during playback');
  if(full){assert(playback.decoded.length>5500,'Missing presented frames');const gaps=playback.decoded.slice(1).map((v,i)=>v.wall-playback.decoded[i].wall);result.maxPresentedGapMs=Math.max(...gaps);assert(result.maxPresentedGapMs<700,'Visible playback stall');}
  await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);
  const media=await fetch(initial.src).then(async r=>{assert.equal(r.status,200);return Buffer.from(await r.arrayBuffer());});assert.equal(sha(media),manifest.playback.sha256,'Hosted video bytes must match the approved cut');
  const range=await fetch(initial.src,{headers:{Range:'bytes=0-127'}});assert.equal(range.status,206,'Progressive video seeking needs byte ranges');
  Object.assign(result,{result:'PASS',durationSeconds:initial.duration,sourceSha256:manifest.playback.sha256,controls:{play:true,pause:true,seek:true,restart:true,pauseAfterExit:true,fullscreen:true,advanceOnNativeEnd:true},playedMs:playback.elapsed,presentedFrames:playback.decoded.length,backwards:backwards.length,events:playback.events,quality:playback.quality,mobileOverflow:false,errors});
  if(out)fs.writeFileSync(path.resolve(out),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
