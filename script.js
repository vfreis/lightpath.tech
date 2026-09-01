(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  const loader = $('.loader');
  const loaderLine = $('.loader-line span');
  const loaderCount = $('.loader-count');
  let loadValue = 0;
  const finishLoader = () => {
    if (!loader) return;
    if (window.gsap && !prefersReduced) {
      gsap.to(loaderLine, { width: '100%', duration: .22, ease: 'power2.out' });
      gsap.to(loaderCount, { innerText: 100, snap: { innerText: 1 }, duration: .22 });
      gsap.to(loader, { yPercent: -100, duration: .78, delay: .25, ease: 'power4.inOut', onComplete: () => loader.remove() });
    } else {
      loader.remove();
    }
  };

  if (!prefersReduced && loader) {
    const timer = setInterval(() => {
      loadValue = Math.min(92, loadValue + Math.ceil(Math.random() * 11));
      if (loaderLine) loaderLine.style.width = `${loadValue}%`;
      if (loaderCount) loaderCount.textContent = String(loadValue).padStart(2, '0');
    }, 70);
    window.addEventListener('load', () => { clearInterval(timer); finishLoader(); }, { once: true });
    setTimeout(() => { clearInterval(timer); finishLoader(); }, 1800);
  } else if (loader) {
    loader.remove();
  }

  const header = $('.site-header');
  const progress = $('.scroll-progress span');
  const updateScrollUI = () => {
    const y = window.scrollY || 0;
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

  if (!prefersReduced && window.Lenis) {
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.1 });
    const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  if (!prefersReduced && matchMedia('(pointer:fine)').matches) {
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

  if (window.gsap && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.title-line > span', { y: 0, duration: 1.15, stagger: .09, ease: 'power4.out', delay: .65 });
    gsap.fromTo('.hero-reveal', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .8, stagger: .12, ease: 'power3.out', delay: .85 });

    $$('.reveal').forEach(el => {
      if (el.classList.contains('hero-reveal')) return;
      gsap.fromTo(el, { opacity: 0, y: 42 }, {
        opacity: 1, y: 0, duration: .95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });

    gsap.to('.hero-glow-a', { xPercent: -18, yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero-system', { y: 70, rotateZ: 1.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.method-rail span', { height: '100%', ease: 'none', scrollTrigger: { trigger: '.method-stage', start: 'top 65%', end: 'bottom 55%', scrub: true } });

    $$('.method-step').forEach(step => {
      ScrollTrigger.create({ trigger: step, start: 'top 65%', end: 'bottom 35%', toggleClass: { targets: step, className: 'is-active' } });
    });

    $$('.chart-visual span').forEach((bar, i) => {
      gsap.from(bar, { scaleY: 0, duration: .6, delay: i * .04, ease: 'power2.out', scrollTrigger: { trigger: '.chart-visual', start: 'top 90%', once: true } });
    });
  } else {
    $$('.title-line > span').forEach(el => el.style.transform = 'none');
  }

  const panelButtons = $$('.cc-nav button');
  const panels = $$('.cc-panel');
  panelButtons.forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.panel;
      panelButtons.forEach(b => b.classList.toggle('active', b === button));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panelContent === key));
    });
  });

  const canvas = $('#hero-canvas');
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, particles = [], mouseX = .72, mouseY = .42;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(75, Math.max(32, Math.floor(w / 20)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.3 + .2,
        vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .12, a: Math.random() * .5 + .15
      }));
    };
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      for (const p of particles) {
        p.x += p.vx + (mouseX - .5) * .012; p.y += p.vy + (mouseY - .5) * .012;
        if (p.x < -5) p.x = w + 5; if (p.x > w + 5) p.x = -5;
        if (p.y < -5) p.y = h + 5; if (p.y > h + 5) p.y = -5;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = `rgba(183,255,55,${p.a})`; ctx.fill();
      }
      for (let i=0;i<particles.length;i++) for (let j=i+1;j<particles.length;j++) {
        const a=particles[i], b=particles[j], dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
        if (dist < 95) { ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(112,244,208,${(1-dist/95)*.055})`;ctx.stroke(); }
      }
      requestAnimationFrame(draw);
    };
    window.addEventListener('mousemove', e => { mouseX = e.clientX / innerWidth; mouseY = e.clientY / innerHeight; }, { passive:true });
    window.addEventListener('resize', resize); resize(); draw();
  }

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
      const required = ['name','company','email','challenge','objective'];
      const missing = required.some(k => !String(data.get(k) || '').trim());
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
