(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const useSmoothScroll = !isMobile && finePointer;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  const loader = $('.loader');
  const loaderLine = $('.loader-line span');
  const loaderCount = $('.loader-count');
  let loadValue = 0;
  let loaderDone = false;

  const finishLoader = () => {
    if (!loader || loaderDone) return;
    loaderDone = true;
    if (window.gsap && !prefersReduced) {
      gsap.to(loaderLine, { width: '100%', duration: isMobile ? .14 : .2, ease: 'power2.out' });
      gsap.to(loaderCount, { innerText: 100, snap: { innerText: 1 }, duration: isMobile ? .14 : .2 });
      gsap.to(loader, { yPercent: -100, duration: isMobile ? .58 : .82, delay: isMobile ? .12 : .22, ease: 'power4.inOut', onComplete: () => loader.remove() });
    } else {
      loader.remove();
    }
  };

  if (!prefersReduced && loader) {
    const timer = setInterval(() => {
      loadValue = Math.min(93, loadValue + Math.ceil(Math.random() * 10));
      if (loaderLine) loaderLine.style.width = `${loadValue}%`;
      if (loaderCount) loaderCount.textContent = String(loadValue).padStart(2, '0');
    }, isMobile ? 55 : 70);
    window.addEventListener('load', () => { clearInterval(timer); finishLoader(); }, { once: true });
    setTimeout(() => { clearInterval(timer); finishLoader(); }, isMobile ? 1100 : 1800);
  } else if (loader) {
    loader.remove();
  }

  const header = $('.site-header');
  const progress = $('.scroll-progress span');
  let lastScrollY = window.scrollY || 0;
  let scrollVelocity = 0;

  const updateScrollUI = () => {
    const y = window.scrollY || 0;
    const delta = y - lastScrollY;
    scrollVelocity = scrollVelocity * .76 + delta * .24;
    lastScrollY = y;
    if (header) header.classList.toggle('scrolled', y > 20);
    if (progress) {
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      progress.style.width = `${Math.min(100, y / total * 100)}%`;
    }
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  const menuToggle = $('.menu-toggle');
  const nav = $('.nav');
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  }

  let lenis = null;
  if (!prefersReduced && window.Lenis && useSmoothScroll) {
    lenis = new Lenis({ duration: 1.02, smoothWheel: true, touchMultiplier: 1.05 });
    lenis.on('scroll', event => {
      if (Number.isFinite(event.velocity)) scrollVelocity = event.velocity * 18;
      if (window.ScrollTrigger) ScrollTrigger.update();
    });

    if (window.gsap) {
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  if (!prefersReduced && finePointer) {
    const dot = $('.cursor-dot');
    const ring = $('.cursor-ring');
    let tx = 0, ty = 0, rx = 0, ry = 0;
    if (dot && ring) {
      window.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
        dot.style.opacity = '1'; ring.style.opacity = '1';
        dot.style.transform = `translate3d(${tx}px,${ty}px,0)`;
      }, { passive: true });
      const cursorLoop = () => {
        rx += (tx - rx) * .17; ry += (ty - ry) * .17;
        ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
        requestAnimationFrame(cursorLoop);
      };
      cursorLoop();
      $$('a,button,input,textarea,select,.tilt-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('is-hovering'));
      });
    }

    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .13;
        const y = (e.clientY - r.top - r.height / 2) * .13;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    $$('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mouse-x', `${px * 100}%`);
        card.style.setProperty('--mouse-y', `${py * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 3}deg) rotateY(${(px - 0.5) * 3}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  const animateCounter = counter => {
    if (!counter || counter.dataset.animated === 'true') return;
    counter.dataset.animated = 'true';
    const target = Number(counter.dataset.count || 0);
    const prefix = counter.dataset.prefix || '';
    const suffix = counter.dataset.suffix || '';
    const parent = counter.closest('.metric,.proof-card');
    if (prefersReduced || !window.gsap) {
      counter.textContent = `${prefix}${target}${suffix}`;
      return;
    }
    const state = { value: 0 };
    if (parent) parent.classList.add('is-counting');
    gsap.to(state, {
      value: target,
      duration: isMobile ? 1.15 : 1.65,
      ease: 'power3.out',
      onUpdate: () => { counter.textContent = `${prefix}${Math.round(state.value)}${suffix}`; },
      onComplete: () => {
        counter.textContent = `${prefix}${target}${suffix}`;
        if (parent) setTimeout(() => parent.classList.remove('is-counting'), 450);
      }
    });
  };

  const setupNavState = () => {
    const links = $$('.nav a[href^="#"]:not(.nav-cta)');
    const map = new Map(links.map(link => [link.getAttribute('href').slice(1), link]));
    const sections = [...map.keys()].map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle('is-active', link === map.get(visible.target.id)));
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, .15, .3, .6] });
    sections.forEach(section => observer.observe(section));
  };
  setupNavState();

  if (window.gsap && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.title-line > span', { y: 0, duration: isMobile ? .82 : 1.18, stagger: .085, ease: 'power4.out', delay: isMobile ? .28 : .62 });
    gsap.fromTo('.hero-reveal', { opacity: 0, y: isMobile ? 15 : 24 }, { opacity: 1, y: 0, duration: isMobile ? .62 : .86, stagger: .11, ease: 'power3.out', delay: isMobile ? .42 : .82 });

    if (!isMobile) {
      gsap.to('.hero-glow-a', { xPercent: -20, yPercent: 16, scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero-system', { y: 72, rotateZ: 1.15, scale: .985, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    }

    $$('.section').forEach(section => {
      const intro = [
        $('.section-kicker', section),
        $('h2', section),
        $('.problem-sticky p,.build-heading p,.method-intro p,.proof-heading p,.contact-copy p', section)
      ].filter(Boolean);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: isMobile ? 'top 88%' : 'top 80%',
          once: true,
          onEnter: () => section.classList.add('is-flow-active')
        }
      });
      if (intro[0]) tl.fromTo(intro[0], { opacity: 0, x: isMobile ? -10 : -22 }, { opacity: 1, x: 0, duration: isMobile ? .42 : .58, ease: 'power3.out' }, 0);
      if (intro[1]) tl.fromTo(intro[1], { opacity: 0, y: isMobile ? 28 : 54 }, { opacity: 1, y: 0, duration: isMobile ? .62 : .92, ease: 'power4.out' }, .08);
      if (intro[2]) tl.fromTo(intro[2], { opacity: 0, y: isMobile ? 14 : 24 }, { opacity: 1, y: 0, duration: isMobile ? .5 : .72, ease: 'power3.out' }, .22);
    });

    $$('.diagnostic-card').forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: isMobile ? 28 : 62, x: isMobile ? 0 : (index % 2 ? 18 : -18), scale: isMobile ? .992 : .975 },
        { opacity: 1, y: 0, x: 0, scale: 1, duration: isMobile ? .58 : .92, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%', once: true } }
      );
    });

    const commandCenter = $('.command-center');
    if (commandCenter) {
      gsap.fromTo(commandCenter, { opacity: 0, y: isMobile ? 30 : 60, scale: isMobile ? .992 : .972 }, { opacity: 1, y: 0, scale: 1, duration: isMobile ? .68 : 1.05, ease: 'power3.out', scrollTrigger: { trigger: commandCenter, start: 'top 86%', once: true } });
    }

    gsap.to('.method-rail span', { height: '100%', ease: 'none', scrollTrigger: { trigger: '.method-stage', start: 'top 72%', end: 'bottom 58%', scrub: true } });
    $$('.method-step').forEach((step, index) => {
      if (!isMobile) {
        gsap.fromTo(step, { opacity: .22, x: index % 2 ? 30 : -18 }, {
          opacity: 1, x: 0, duration: .72, ease: 'power2.out',
          scrollTrigger: { trigger: step, start: 'top 76%', end: 'top 46%', scrub: .5 }
        });
      }
      ScrollTrigger.create({ trigger: step, start: 'top 68%', end: 'bottom 35%', toggleClass: { targets: step, className: 'is-active' } });
    });

    $$('.proof-card').forEach((card, index) => {
      gsap.fromTo(card,
        { opacity: 0, y: isMobile ? 24 : 46 + (index % 2) * 18, scale: isMobile ? .994 : .982 },
        { opacity: 1, y: 0, scale: 1, duration: isMobile ? .56 : .88, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 89%', once: true } }
      );
    });

    $$('.fit-item').forEach((item, index) => {
      gsap.fromTo(item, { opacity: 0, x: isMobile ? 14 : 36 }, { opacity: 1, x: 0, duration: isMobile ? .42 : .62, delay: index * .025, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 91%', once: true } });
    });

    const contactForm = $('.contact-form');
    if (contactForm) gsap.fromTo(contactForm, { opacity: 0, y: isMobile ? 24 : 46, rotateX: isMobile ? 0 : 3 }, { opacity: 1, y: 0, rotateX: 0, duration: isMobile ? .62 : 1, ease: 'power3.out', scrollTrigger: { trigger: contactForm, start: 'top 88%', once: true } });

    $$('.chart-visual span').forEach((bar, i) => {
      gsap.from(bar, { scaleY: 0, duration: isMobile ? .45 : .62, delay: i * .035, ease: 'power2.out', scrollTrigger: { trigger: '.chart-visual', start: 'top 92%', once: true } });
    });

    $$('.counter').forEach(counter => {
      ScrollTrigger.create({ trigger: counter, start: 'top 90%', once: true, onEnter: () => animateCounter(counter) });
    });

    if (!isMobile) {
      gsap.to('.node-a', { x: -22, y: 14, duration: 4.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.node-b', { x: 18, y: -18, duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.node-c', { x: -14, y: -22, duration: 3.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
  } else {
    $$('.title-line > span').forEach(el => { el.style.transform = 'none'; });
    $$('.counter').forEach(animateCounter);
  }

  const panelButtons = $$('.cc-nav button');
  const panels = $$('.cc-panel');
  panelButtons.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.panel;
      panelButtons.forEach(b => b.classList.toggle('active', b === button));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panelContent === key));
      if (isMobile) button.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
      const active = panels.find(p => p.dataset.panelContent === key);
      if (active && window.gsap && !prefersReduced) {
        gsap.fromTo(active.children, { opacity: 0, y: isMobile ? 9 : 15 }, { opacity: 1, y: 0, stagger: .06, duration: isMobile ? .34 : .48, ease: 'power2.out' });
      }
    });
  });

  const setupFlowCanvas = () => {
    if (prefersReduced) return;
    const canvas = document.createElement('canvas');
    canvas.className = 'flow-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = .72;
    let pointerY = .35;
    let lastFrame = 0;
    let time = 0;
    let active = !document.hidden;
    const targetFps = isMobile ? 24 : 60;
    const minFrame = 1000 / targetFps;
    const tracerCount = isMobile ? 12 : Math.min(46, Math.max(28, Math.round(window.innerWidth / 36)));
    const tracers = [];

    const resetTracer = (tracer, fresh = false) => {
      tracer.x = Math.random() * width;
      tracer.y = fresh ? Math.random() * height : height + Math.random() * height * .18;
      tracer.px = tracer.x;
      tracer.py = tracer.y;
      tracer.life = 90 + Math.random() * 170;
      tracer.maxLife = tracer.life;
      tracer.speed = .42 + Math.random() * .7;
      tracer.seed = Math.random() * Math.PI * 2;
      tracer.width = .35 + Math.random() * .75;
    };

    const resize = () => {
      dpr = Math.min(isMobile ? 1 : 1.35, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tracers.length = 0;
      for (let i = 0; i < tracerCount; i += 1) {
        const tracer = {};
        resetTracer(tracer, true);
        tracers.push(tracer);
      }
    };

    const vectorAt = (x, y, seed) => {
      const nx = x / Math.max(width, 1);
      const ny = y / Math.max(height, 1);
      const base = -1.12;
      const wave = Math.sin(nx * 5.8 + time * .00042 + seed) * (isMobile ? .17 : .24);
      const cross = Math.cos(ny * 4.2 - time * .00028 + seed * .6) * (isMobile ? .08 : .12);
      const pointerPull = finePointer ? (pointerX - nx) * .12 : 0;
      const scrollLean = Math.max(-.12, Math.min(.18, scrollVelocity * .0018));
      return base + wave + cross + pointerPull + scrollLean;
    };

    const drawArrow = (x, y, angle, alpha, size) => {
      const back = angle + Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(back + .48) * size, y + Math.sin(back + .48) * size);
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(back - .48) * size, y + Math.sin(back - .48) * size);
      ctx.strokeStyle = `rgba(183,255,55,${alpha})`;
      ctx.lineWidth = .7;
      ctx.stroke();
    };

    const render = now => {
      requestAnimationFrame(render);
      if (!active || now - lastFrame < minFrame) return;
      lastFrame = now;
      time = now;
      scrollVelocity *= .94;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < tracers.length; i += 1) {
        const tracer = tracers[i];
        tracer.px = tracer.x;
        tracer.py = tracer.y;
        const angle = vectorAt(tracer.x, tracer.y, tracer.seed);
        const velocityBoost = 1 + Math.min(isMobile ? .55 : 1.3, Math.abs(scrollVelocity) * .012);
        const step = tracer.speed * velocityBoost * (isMobile ? 1.08 : 1.55);
        tracer.x += Math.cos(angle) * step;
        tracer.y += Math.sin(angle) * step;
        tracer.life -= 1;

        const progress = Math.max(0, tracer.life / tracer.maxLife);
        const edgeFade = Math.min(1, tracer.y / 90, (height - tracer.y) / 90, tracer.x / 90, (width - tracer.x) / 90);
        const alphaCap = isMobile ? .12 : .23;
        const alpha = Math.max(0, Math.min(alphaCap, progress * (isMobile ? .09 : .16) * Math.max(.15, edgeFade)));

        const gradient = ctx.createLinearGradient(tracer.px, tracer.py, tracer.x, tracer.y);
        gradient.addColorStop(0, `rgba(112,244,208,${alpha * .22})`);
        gradient.addColorStop(1, `rgba(183,255,55,${alpha})`);
        ctx.beginPath();
        ctx.moveTo(tracer.px, tracer.py);
        ctx.lineTo(tracer.x, tracer.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = tracer.width;
        ctx.stroke();

        const arrowModulo = isMobile ? 9 : 7;
        if (i % arrowModulo === 0 && Math.floor(tracer.life) % 42 === 0 && alpha > .025) {
          drawArrow(tracer.x, tracer.y, angle, alpha * 1.35, isMobile ? 3.5 : 4.5);
        }

        if (tracer.life <= 0 || tracer.y < -30 || tracer.x < -60 || tracer.x > width + 60) resetTracer(tracer, false);
      }
      ctx.globalCompositeOperation = 'source-over';
    };

    if (finePointer) {
      window.addEventListener('mousemove', event => {
        pointerX = event.clientX / Math.max(window.innerWidth, 1);
        pointerY = event.clientY / Math.max(window.innerHeight, 1);
      }, { passive: true });
    }
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', () => { active = !document.hidden; });
    resize();
    requestAnimationFrame(render);
  };
  setupFlowCanvas();

  const heroCanvas = $('#hero-canvas');
  if (heroCanvas) heroCanvas.style.opacity = prefersReduced ? '0' : (isMobile ? '.06' : '.16');

  const form = $('#lead-form');
  const status = $('#form-status');
  const showStatus = (text, type) => {
    if (!status) return;
    status.textContent = text;
    status.className = `form-status show ${type}`;
  };
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const required = ['name', 'company', 'email', 'challenge', 'objective'];
      const missing = required.some(key => !String(data.get(key) || '').trim());
      const email = String(data.get('email') || '').trim();
      if (missing) return showStatus('Preencha os campos principais para preparar o contato.', 'error');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStatus('Digite um e-mail válido.', 'error');
      const subject = encodeURIComponent(`LightPath — oportunidade em ${data.get('company')}`);
      const body = encodeURIComponent(`Nome: ${data.get('name')}\nEmpresa: ${data.get('company')}\nE-mail: ${email}\nObjetivo: ${data.get('objective')}\n\nGargalo / oportunidade:\n${data.get('challenge')}`);
      showStatus('Tudo certo. Abrindo seu cliente de e-mail com o diagnóstico preenchido.', 'success');
      window.location.href = `mailto:vifalqueiro@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
