(() => {
 if (!new URLSearchParams(location.search).has('embed')) return;
 let ready=false, playing=false;
 const send=()=>{const p=window.__consultationReview;if(!p)return;parent.postMessage({channel:'credigraph-film',type:'state',frame:p.frame(),playing},'*');};
 window.addEventListener('message',e=>{
  if(e.source!==parent||e.data?.channel!=='credigraph-film')return;
  const p=window.__consultationReview;if(!p)return;
  if(e.data.command==='play'){p.play();playing=true;}
  if(e.data.command==='pause'){p.pause();playing=false;}
  if(e.data.command==='seek')p.seek(Math.max(1200,Math.min(7199,Number(e.data.frame)||1200)));
  send();
 });
 setInterval(()=>{
  const p=window.__consultationReview;if(!p)return;
  if(!ready){ready=true;p.pause();p.seek(1200);parent.postMessage({channel:'credigraph-film',type:'ready'},'*');}
  if(playing&&p.frame()>=7190){p.pause();playing=false;parent.postMessage({channel:'credigraph-film',type:'ended'},'*');}
  send();
 },200);
})();
