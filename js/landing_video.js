(() => {
  const checkoutModal = document.querySelector('#checkout-modal');
  const checkoutHost = document.querySelector('#whop-checkout');
  const status = document.querySelector('#checkout-status');
  let sdkPromise;
  let selectedPlan = 'plan_Q03X3kJHIRgEt';
  let mountedPlan;
  let generation = 0;
  const loadSdk = () => sdkPromise ||= new Promise((resolve, reject) => {
    if (window.WhopElements) return resolve();
    const script = document.createElement('script');
    script.src = 'https://cdn.whop.com/elements/amber/elements.js';
    script.setAttribute('data-whop-elements', '');
    script.onload = resolve;
    script.onerror = () => { sdkPromise = null; script.remove(); reject(new Error('SDK unavailable')); };
    document.head.append(script);
  });
  const mountCheckout = async () => {
    const current = ++generation;
    document.querySelector('#checkout-fallback').href = `https://whop.com/checkout/${selectedPlan}`;
    if (mountedPlan === selectedPlan) return;
    status.hidden = false;
    status.textContent = 'Cargando checkout seguro…';
    try {
      await loadSdk();
      if (current !== generation) return;
      checkoutHost.replaceChildren();
      const checkout = window.WhopElements().checkout.create({plan:selectedPlan, returnUrl: `${location.origin}/api/auth/login`});
      checkout.create('checkout').mount('#whop-checkout');
      mountedPlan = selectedPlan;
      status.hidden = true;
    } catch { status.textContent = 'No se pudo cargar el checkout. Puedes abrirlo con el enlace de abajo.'; }
  };
  let lastFocused = null;
  const closeCheckout = () => { if (!checkoutModal) return; checkoutModal.hidden = true; document.body.style.overflow = ''; lastFocused?.focus?.(); };
  const openCheckout = (event) => {
    event.preventDefault();
    if (!checkoutModal || !checkoutHost) return;
    lastFocused = event.currentTarget;
    document.body.style.overflow = 'hidden';
    mountCheckout();
    checkoutModal.hidden = false;
    checkoutModal.querySelector('.checkout-modal__close')?.focus();
  };
  document.querySelectorAll('a[href="/api/checkout"], a[href="/api/checkout?embedded=1"]').forEach(link => link.addEventListener('click', openCheckout));
  checkoutModal?.querySelectorAll('[data-checkout-close]').forEach(button => button.addEventListener('click', closeCheckout));
  document.querySelectorAll('[data-checkout-plan]').forEach(button => button.addEventListener('click', () => {
    selectedPlan = button.dataset.checkoutPlan;
    document.querySelectorAll('[data-checkout-plan]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    mountCheckout();
  }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && checkoutModal && !checkoutModal.hidden) closeCheckout(); });

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
    if (className === 'cortex-hero-video') {
      Object.assign(video.style, {position:'absolute', inset:'0', width:'100%', height:'100%', objectFit:'cover', zIndex:'-2', pointerEvents:'none'});
    }
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
