(() => {
 if (!new URLSearchParams(location.search).has('embed')) return;
 let ready=false, playing=false, removeEnded=()=>{};
 const send=()=>{const p=window.__consultationReview;if(!p)return;parent.postMessage({channel:'credigraph-film',type:'state',frame:p.frame(),playing},'*');};
 window.addEventListener('message',e=>{
  if(e.source!==parent||e.data?.channel!=='credigraph-film')return;
  const p=window.__consultationReview;if(!p)return;
  if(e.data.command==='play'){p.play();playing=true;}
  if(e.data.command==='pause'){p.pause();playing=false;}
  if(e.data.command==='seek')p.seek(Math.max(0,Math.min(7199,Number(e.data.frame)||0)));
  send();
 });
 const timer=setInterval(()=>{
  const p=window.__consultationReview;if(!p)return;
  if(!ready){
   ready=true;p.pause();p.seek(0);
   // Let the original film finish before advancing the presentation.
   removeEnded=p.onEnded(()=>{playing=false;send();parent.postMessage({channel:'credigraph-film',type:'ended'},'*');});
   parent.postMessage({channel:'credigraph-film',type:'ready'},'*');
  }
  send();
 },200);
 window.addEventListener('pagehide',e=>{if(!e.persisted){clearInterval(timer);removeEnded();}});
})();
