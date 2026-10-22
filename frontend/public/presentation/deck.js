(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const $ = id => document.getElementById(id);
  let index = 0;
  const fromHash = () => { const n = Number(location.hash.replace('#slide-', '')); return Number.isInteger(n) && n >= 1 && n <= slides.length ? n - 1 : 0; };
  let animation;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = (slide, direction) => {
    animation?.revert();
    if(reduced.matches || !window.gsap) return;
    animation=gsap.context(()=>{
      gsap.fromTo(slide,{clipPath:direction<0?'inset(0 0 0 8%)':'inset(0 8% 0 0)',opacity:.65},{clipPath:'inset(0 0% 0 0%)',opacity:1,duration:.48,ease:'power3.out',clearProps:'clipPath,opacity'});
      const heading=slide.querySelector('h1,h2');
      if(heading)gsap.from(heading,{y:28,opacity:0,duration:.65,delay:.12,ease:'power3.out'});
      const groups=slide.querySelectorAll('.before-after>div,.imprint-flow>div,.technical-rows>div,.metric,.sharing>div,.strategy>*,.business>div,.team>div,.rows>div,.source-grid>div');
      gsap.from(groups,{y:22,opacity:0,duration:.65,delay:.25,stagger:.13,ease:'power3.out'});
      slide.querySelectorAll('.contour path').forEach((p,i)=>{const l=p.getTotalLength();gsap.fromTo(p,{strokeDasharray:l,strokeDashoffset:l},{strokeDashoffset:0,duration:1.7,delay:i*.016,ease:'power2.inOut'});});
      gsap.from(slide.querySelectorAll('.bars i'),{scaleX:0,transformOrigin:'left',duration:1.1,stagger:.2,delay:.5,ease:'power3.out'});
    },slide);
  };
  const frame=$('demo-frame'), film=frame.closest('.slide');
  let filmReady=false, started=false, playing=false, filmPosition=1200, pendingPlay=false;
  const command=(command,extra={})=>frame.contentWindow?.postMessage({channel:'credigraph-film',command,...extra},'*');
  const loadFilm=()=>{if(!frame.getAttribute('src'))frame.src='assets/demo-v14.html?clean=1&embed=1&frame=1200';};
  const startFilm=()=>{loadFilm();pendingPlay=true;$('film-start').textContent='시연 준비 중…';if(filmReady)playFilm();};
  const playFilm=()=>{pendingPlay=false;started=true;playing=true;film.classList.add('started');command('play');$('film-toggle').textContent='일시정지';};
  const pauseFilm=()=>{pendingPlay=false;playing=false;command('pause');$('film-toggle').textContent='재생';};
  $('film-start').onclick=startFilm;
  $('film-toggle').onclick=()=>playing?pauseFilm():playFilm();
  $('film-restart').onclick=()=>{command('seek',{frame:1200});playFilm();};
  $('film-seek').oninput=e=>command('seek',{frame:Number(e.target.value)});
  $('film-next').onclick=()=>show(slides.indexOf(film)+1);
  window.addEventListener('message',e=>{
    if(e.source!==frame.contentWindow||e.data?.channel!=='credigraph-film')return;
    if(e.data.type==='ready'){filmReady=true;$('film-toggle').disabled=false;$('film-restart').disabled=false;if(pendingPlay&&slides[index]===film)playFilm();}
    if(e.data.type==='state'){
      filmPosition=e.data.frame;playing=e.data.playing;
      const sec=Math.max(0,Math.floor((filmPosition-1200)/30));
      $('film-clock').textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')} / 3:20`;
      $('film-seek').value=filmPosition;$('film-toggle').textContent=playing?'일시정지':'재생';
    }
    if(e.data.type==='ended'&&slides[index]===film)show(index+1);
  });
  window.addEventListener('beforeprint',()=>{animation?.revert();pauseFilm();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseFilm();});
  const show = n => {
    const previous=index;
    if(slides[Math.max(0,Math.min(slides.length-1,n))]!==film)pauseFilm();
    index = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => { s.classList.toggle('active', i === index); s.setAttribute('aria-hidden', String(i !== index)); });
    $('counter').textContent = `${index + 1} / ${slides.length}`;
    $('prev').disabled = index === 0; $('next').disabled = index === slides.length - 1;
    $('notes-body').innerHTML = slides[index].querySelector('.speaker-notes').innerHTML;
    document.querySelectorAll('#outline-links a').forEach((a, i) => a.setAttribute('aria-current', String(i === index)));
    history.replaceState(null, '', `#slide-${index + 1}`);
    document.title = `CrediGraph · ${index + 1}. ${slides[index].dataset.title}`;
    window.scrollTo(0, 0);
    if(index===1||slides[index]===film)loadFilm();
    animate(slides[index],index-previous);
    if(slides[index]===film && !started){$('film-start').innerHTML='시연 시작 <span>3분 20초</span>';}

  };
  const closePanel = (id, opener, restore = true) => { $(id).hidden = true; $(opener).setAttribute('aria-expanded', 'false'); if (restore) $(opener).focus(); };
  const togglePanel = (id, opener) => {
    const willOpen = $(id).hidden;
    closePanel('outline', 'overview', false); closePanel('notes-panel', 'notes', false);
    if (willOpen) { $(id).hidden = false; $(opener).setAttribute('aria-expanded', 'true'); $(id).querySelector('button').focus(); }
    else $(opener).focus();
  };
  $('outline-links').innerHTML = slides.map((s,i) => `<a href="#slide-${i+1}">${String(i+1).padStart(2,'0')} &nbsp; ${s.dataset.title}</a>`).join('');
  $('outline-links').addEventListener('click', e => { const a=e.target.closest('a'); if(!a)return; e.preventDefault(); show(Number(a.hash.replace('#slide-',''))-1); closePanel('outline','overview'); });
  $('prev').onclick=()=>show(index-1); $('next').onclick=()=>show(index+1);
  $('overview').onclick=()=>togglePanel('outline','overview'); $('notes').onclick=()=>togglePanel('notes-panel','notes');
  $('close-notes').onclick=()=>closePanel('notes-panel','notes'); $('close-outline').onclick=()=>closePanel('outline','overview');
  const fullscreen = async () => { try { if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('message').textContent='이 브라우저에서는 전체화면을 열 수 없습니다. 브라우저의 전체화면 기능을 사용해 주세요.'; } };
  $('fullscreen').onclick=fullscreen;
  document.addEventListener('fullscreenchange',()=>{$('fullscreen').innerHTML=document.fullscreenElement?'전체화면 종료 <kbd>F</kbd>':'전체화면 <kbd>F</kbd>';});
  window.addEventListener('hashchange',()=>show(fromHash()));
  window.addEventListener('keydown', e => {
    if(e.altKey || e.ctrlKey || e.metaKey || e.target.matches('input,textarea,select,[contenteditable]')) return;
    if(e.key==='Escape'){closePanel('outline','overview',false);closePanel('notes-panel','notes',false);$('deck').focus();return;}
    if(e.key.toLowerCase()==='n'){e.preventDefault();togglePanel('notes-panel','notes');return;}
    if(e.key.toLowerCase()==='o'){e.preventDefault();togglePanel('outline','overview');return;}
    if(e.key.toLowerCase()==='f'){e.preventDefault();fullscreen();return;}
    if(!$('outline').hidden||!$('notes-panel').hidden)return;
    if(e.key===' '&&e.target.closest('button,a'))return;
    if(e.key===' '&&slides[index]===film){e.preventDefault();if(!started)startFilm();else if(playing)pauseFilm();else playFilm();return;}
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(index+1);}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(index-1);}
    if(e.key==='Home'){e.preventDefault();show(0);}
    if(e.key==='End'){e.preventDefault();show(slides.length-1);}
  });
  show(fromHash());
})();
