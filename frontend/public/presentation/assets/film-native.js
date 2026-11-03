(() => {
  const video = document.getElementById('presentation-video');
  const embedded = window.parent !== window;
  const targetOrigin = location.protocol === 'file:' ? '*' : location.origin;
  const send = (type, extra = {}) => {
    if (embedded) parent.postMessage({ channel: 'credigraph-film', type, ...extra }, targetOrigin);
  };
  const state = () => send('state', {
    frame: Math.min(5999, Math.round(video.currentTime * 30)),
    playing: !video.paused && !video.ended,
  });
  let ready = false;
  const loaded = () => {
    if (ready || video.readyState < 2) return;
    ready = true;
    send('ready');
    state();
  };
  const failed = () => send('error', { message: '영상을 재생하지 못했습니다. 시연 시작을 다시 눌러주세요.' });
  window.addEventListener('message', async event => {
    const trustedOrigin = location.protocol === 'file:' ? event.origin === 'null' : event.origin === location.origin;
    if (event.source !== parent || !trustedOrigin || event.data?.channel !== 'credigraph-film') return;
    if (event.data.command === 'play') {
      try { await video.play(); } catch { failed(); }
    }
    if (event.data.command === 'pause') video.pause();
    if (event.data.command === 'seek') {
      video.currentTime = Math.max(0, Math.min(5999, Number(event.data.frame) || 0)) / 30;
    }
    state();
  });
  video.addEventListener('loadeddata', loaded);
  video.addEventListener('canplay', loaded);
  for (const event of ['timeupdate', 'play', 'pause', 'seeked']) video.addEventListener(event, state);
  video.addEventListener('ended', () => { state(); send('ended'); });
  video.addEventListener('error', failed);
  window.addEventListener('pagehide', () => video.pause());
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  if (!embedded) video.controls = true;
  loaded();
})();
