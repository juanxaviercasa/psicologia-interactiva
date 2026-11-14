(() => {
  const root = 'js/visuals/';
  const pricing = document.querySelector('#oferta .text-center');
  if (pricing) {
    pricing.id = 'planes';
    document.querySelectorAll('a[href="#oferta"]').forEach(link => { link.href = '#planes'; });
    if (location.hash === '#planes') requestAnimationFrame(() => pricing.scrollIntoView({block:'start', behavior:'instant'}));
  }
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [];
  const add = (container, name, poster, className, image) => {
    const video = document.createElement('video');
    video.className = className;
    video.poster = root + poster;
    video.dataset.source = root + name;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('aria-hidden', 'true');
    video.addEventListener('error', () => { video.style.display = 'none'; if (image) image.hidden = false; });
    if (image) { image.src = video.poster; image.insertAdjacentElement('afterend', video); video.addEventListener('playing', () => { image.hidden = true; }); }
    else container.prepend(video);
    videos.push(video);
  };
  add(document.querySelector('main > section'), 'cortex-hero.mp4', 'cortex-hero-conversation-v2.png', 'cortex-hero-video');
  const scenes = [['cortex-self-awareness.mp4','cortex-self-awareness-v2.png'], ['cortex-communication.mp4','cortex-communication-v2.png'], ['cortex-connection.mp4','cortex-connection-v2.png']];
  document.querySelectorAll('.desire-photo').forEach((image, i) => { if (scenes[i]) add(image.parentElement, ...scenes[i], 'desire-photo cortex-scene-video', image); });
  const offer = document.querySelector('#oferta > div');
  if (offer) {
    const figure = document.createElement('figure');
    figure.className = 'cortex-offer-film';
    const image = document.createElement('img');
    image.alt = 'Livres, auriculares y tarjetas para leer, escuchar y practicar en Cortex';
    image.loading = 'lazy';
    figure.append(image);
    offer.prepend(figure);
    add(figure, 'cortex-offer.mp4', 'cortex-offer-study-v2.png', 'cortex-offer-video', image);
  }
  const pause = document.createElement('button');
  pause.type = 'button';
  pause.className = 'cortex-motion-toggle';
  pause.textContent = 'Pausar animaciones';
  document.body.append(pause);
  let stopped = preference.matches;
  const observer = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
    target.dataset.visible = String(isIntersecting);
    update(target);
  }), {threshold: .15});
  function update(video) {
    if (stopped || document.hidden || video.dataset.visible !== 'true') { video.pause(); return; }
    if (!video.src) video.src = video.dataset.source;
    video.play().catch(() => {});
  }
  function refresh() { videos.forEach(update); pause.textContent = stopped ? 'Activar animaciones' : 'Pausar animaciones'; pause.setAttribute('aria-pressed', String(stopped)); }
  pause.addEventListener('click', () => { stopped = !stopped; refresh(); });
  preference.addEventListener('change', () => { stopped = preference.matches; refresh(); });
  document.addEventListener('visibilitychange', refresh);
  videos.forEach(video => observer.observe(video));
  refresh();
})();
