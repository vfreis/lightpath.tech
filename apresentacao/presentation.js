(() => {
  'use strict';

  const root = document.getElementById('story');
  const scenes = [...document.querySelectorAll('.scene')];
  const prevButton = document.getElementById('prev-scene');
  const nextButton = document.getElementById('next-scene');
  const progressBar = document.getElementById('story-progress-bar');
  const sceneNumber = document.getElementById('scene-number');
  const dotsRoot = document.getElementById('scene-dots');
  const wipe = document.querySelector('.scene-wipe span');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileQuery = window.matchMedia('(max-width: 759px)');
  const isMobile = () => mobileQuery.matches;
  let current = 0;
  let transitioning = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let wheelAccumulator = 0;
  let wheelResetTimer = null;
  let viewportFitTimer = null;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  /* ------------------------------------------------------------------
     REAL VIEWPORT + ADAPTIVE FIT
     Every scene must visually fit inside the user's actual viewport.
     visualViewport matters on iOS/Safari because browser chrome changes
     the usable height while the page is open.
  ------------------------------------------------------------------ */
  const syncViewport = () => {
    const viewport = window.visualViewport;
    const height = viewport ? viewport.height : window.innerHeight;
    const width = viewport ? viewport.width : window.innerWidth;
    document.documentElement.style.setProperty('--presentation-vh', `${Math.round(height)}px`);
    document.documentElement.style.setProperty('--presentation-vw', `${Math.round(width)}px`);
  };

  const fitScene = scene => {
    if (!scene) return;
    const inner = scene.querySelector('.scene-inner');
    if (!inner) return;

    inner.style.setProperty('--scene-fit', '1');
    inner.classList.remove('is-fit-tight', 'is-fit-ultra');

    const styles = getComputedStyle(scene);
    const padX = parseFloat(styles.paddingLeft || 0) + parseFloat(styles.paddingRight || 0);
    const padY = parseFloat(styles.paddingTop || 0) + parseFloat(styles.paddingBottom || 0);
    const availableW = Math.max(1, scene.clientWidth - padX - 4);
    const availableH = Math.max(1, scene.clientHeight - padY - 4);

    /* scrollHeight/scrollWidth represent the natural, unscaled content. */
    const naturalW = Math.max(inner.scrollWidth, inner.offsetWidth, 1);
    const naturalH = Math.max(inner.scrollHeight, inner.offsetHeight, 1);
    const scale = clamp(Math.min(1, availableW / naturalW, availableH / naturalH), .58, 1);

    inner.style.setProperty('--scene-fit', scale.toFixed(4));
    if (scale < .88) inner.classList.add('is-fit-tight');
    if (scale < .73) inner.classList.add('is-fit-ultra');
    scene.dataset.fitScale = scale.toFixed(3);
  };

  const fitAllScenes = () => {
    syncViewport();
    scenes.forEach(fitScene);
  };

  const scheduleFit = () => {
    clearTimeout(viewportFitTimer);
    viewportFitTimer = setTimeout(() => requestAnimationFrame(fitAllScenes), 50);
  };

  syncViewport();
  window.addEventListener('resize', scheduleFit, { passive: true });
  window.addEventListener('orientationchange', scheduleFit, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', scheduleFit, { passive: true });
    window.visualViewport.addEventListener('scroll', scheduleFit, { passive: true });
  }
  window.addEventListener('lightpath:languagechange', scheduleFit);
  if (document.fonts?.ready) document.fonts.ready.then(fitAllScenes).catch(() => {});

  const dots = scenes.map((_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Ir para cena ${index + 1}`);
    button.addEventListener('click', () => goTo(index));
    dotsRoot.appendChild(button);
    return button;
  });

  const updateChrome = () => {
    if (sceneNumber) sceneNumber.textContent = String(current + 1).padStart(2, '0');
    if (progressBar) progressBar.style.transform = `scaleX(${(current + 1) / scenes.length})`;
    if (prevButton) prevButton.disabled = current === 0;
    if (nextButton) {
      nextButton.disabled = current === scenes.length - 1;
      nextButton.setAttribute('aria-label', current === scenes.length - 1 ? 'Fim da apresentação' : 'Próxima cena');
    }
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === current));
  };

  const animateScene = scene => {
    const items = [...scene.querySelectorAll('[data-reveal]')];
    if (!items.length || reduced || !window.gsap) return;
    gsap.killTweensOf(items);
    gsap.fromTo(items,
      { opacity: 0, y: isMobile() ? 12 : 22, scale: .994 },
      { opacity: 1, y: 0, scale: 1, duration: isMobile() ? .46 : .64, stagger: isMobile() ? .045 : .06, ease: 'power3.out', clearProps: 'transform' }
    );
  };

  const animateHeroVectors = scene => {
    if (!scene.matches('[data-scene="0"]') || reduced || !window.gsap) return;
    const vectors = scene.querySelectorAll('.hero-vector .vector');
    gsap.set(vectors, { strokeDashoffset: 500 });
    gsap.to(vectors, { strokeDashoffset: 0, duration: 1.35, stagger: .14, delay: .16, ease: 'power2.inOut' });
    const pulse = scene.querySelector('.pulse');
    if (pulse) gsap.fromTo(pulse, { scale: .55, opacity: .2, transformOrigin: 'center' }, { scale: 1.25, opacity: 1, duration: .9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  };

  const animateProofCounters = scene => {
    if (!scene.matches('[data-scene="6"]')) return;
    scene.querySelectorAll('[data-count]').forEach(el => {
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (reduced || !window.gsap) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: isMobile() ? .85 : 1.25,
        ease: 'power3.out',
        onUpdate: () => { el.textContent = `${prefix}${Math.round(state.value)}${suffix}`; },
        onComplete: () => { el.textContent = `${prefix}${target}${suffix}`; }
      });
    });
  };

  const runSceneEntry = scene => {
    fitScene(scene);
    animateScene(scene);
    animateHeroVectors(scene);
    animateProofCounters(scene);
    requestAnimationFrame(() => fitScene(scene));
  };

  const swapScene = target => {
    scenes.forEach((scene, index) => {
      scene.classList.toggle('is-active', index === target);
      scene.style.removeProperty('transform');
      scene.style.removeProperty('opacity');
      scene.style.removeProperty('visibility');
      scene.setAttribute('aria-hidden', index === target ? 'false' : 'true');
    });
    current = target;
    updateChrome();
    runSceneEntry(scenes[current]);
  };

  function goTo(target) {
    target = clamp(target, 0, scenes.length - 1);
    if (target === current || transitioning) return;
    transitioning = true;

    const fromIndex = current;
    const outgoing = scenes[fromIndex];
    const incoming = scenes[target];
    const direction = target > fromIndex ? 1 : -1;

    if (reduced || !window.gsap) {
      swapScene(target);
      transitioning = false;
      return;
    }

    /* Keep both scenes visible during the horizontal hand-off. */
    incoming.classList.add('is-active');
    incoming.setAttribute('aria-hidden', 'false');
    fitScene(incoming);
    current = target;
    updateChrome();
    runSceneEntry(incoming);

    gsap.killTweensOf([outgoing, incoming, wipe].filter(Boolean));
    gsap.set(incoming, { xPercent: direction * 104, opacity: .35, visibility: 'visible' });
    gsap.set(outgoing, { xPercent: 0, opacity: 1, visibility: 'visible' });
    if (wipe) gsap.set(wipe, { xPercent: direction > 0 ? -135 : 135, opacity: 0 });

    const tl = gsap.timeline({
      defaults: { overwrite: true },
      onComplete: () => {
        outgoing.classList.remove('is-active');
        outgoing.setAttribute('aria-hidden', 'true');
        incoming.classList.add('is-active');
        scenes.forEach((scene, index) => {
          if (index !== current) scene.classList.remove('is-active');
        });
        gsap.set([outgoing, incoming], { clearProps: 'transform,opacity,visibility' });
        if (wipe) gsap.set(wipe, { clearProps: 'transform,opacity' });
        fitScene(incoming);
        transitioning = false;
      }
    });

    tl.to(outgoing, { xPercent: -direction * 34, opacity: 0, duration: .48, ease: 'power3.inOut' }, 0)
      .to(incoming, { xPercent: 0, opacity: 1, duration: .62, ease: 'power4.out' }, .04);

    /* A thin luminous sweep reinforces the direction without hiding content. */
    if (wipe) {
      tl.to(wipe, { xPercent: 0, opacity: .34, duration: .24, ease: 'power2.in' }, .02)
        .to(wipe, { xPercent: direction > 0 ? 135 : -135, opacity: 0, duration: .36, ease: 'power2.out' }, .24);
    }
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);
  if (nextButton) nextButton.addEventListener('click', next);
  if (prevButton) prevButton.addEventListener('click', prev);
  document.querySelectorAll('.js-next').forEach(button => button.addEventListener('click', next));

  /* Vertical mouse-wheel / trackpad input advances the horizontal story. */
  root.addEventListener('wheel', event => {
    if (event.ctrlKey) return; // preserve browser zoom gestures
    event.preventDefault();
    if (transitioning) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (Math.abs(delta) < 1) return;
    wheelAccumulator += delta;
    clearTimeout(wheelResetTimer);
    wheelResetTimer = setTimeout(() => { wheelAccumulator = 0; }, 150);
    const threshold = event.deltaMode === 1 ? 3 : 44;
    if (Math.abs(wheelAccumulator) >= threshold) {
      const direction = wheelAccumulator > 0 ? 1 : -1;
      wheelAccumulator = 0;
      if (direction > 0) next(); else prev();
    }
  }, { passive: false });

  window.addEventListener('keydown', event => {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
    if (['input','textarea','select'].includes(tag)) return;
    if (['ArrowRight','ArrowDown','PageDown',' '].includes(event.key)) { event.preventDefault(); next(); }
    if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) { event.preventDefault(); prev(); }
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(scenes.length - 1);
  });

  root.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  root.addEventListener('touchend', event => {
    if (transitioning) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (Math.max(ax, ay) < 44) return;

    /* Horizontal swipe and vertical 'scroll' gesture both move horizontally. */
    if (ax >= ay) {
      if (dx < 0) next(); else prev();
    } else {
      if (dy < 0) next(); else prev();
    }
  }, { passive: true });

  const impactData = {
    custo: ['MENOS CUSTO','menos handoffs · retrabalho · operação manual'],
    decisao: ['MAIS VELOCIDADE','dado confiável no momento da decisão'],
    escala: ['MAIS ESCALA','crescimento sem multiplicar esforço humano']
  };
  document.querySelectorAll('.impact-choice').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.impact-choice').forEach(b => b.classList.toggle('is-selected', b === button));
      const [title, sub] = impactData[button.dataset.impact];
      const titleEl = document.getElementById('impact-core-title');
      const subEl = document.getElementById('impact-core-sub');
      if (titleEl) titleEl.textContent = title;
      if (subEl) subEl.textContent = sub;
      if (window.gsap && !reduced) gsap.fromTo('.impact-core', { scale: .9 }, { scale: 1, duration: .42, ease: 'back.out(1.8)' });
      scheduleFit();
    });
  });

  const bottleneckData = {
    dados: ['DATA FOUNDATION','Integrar fontes, criar contratos e tornar o dado confiável antes de acelerar analytics ou IA.','Métrica → latência + qualidade'],
    processo: ['AUTOMATION LAYER','Remover passos repetitivos, criar eventos, integrações, retries e observabilidade operacional.','Métrica → horas + retrabalho'],
    decisao: ['DECISION LAYER','Levar indicador, alerta ou modelo até o ponto exato em que a decisão acontece.','Métrica → tempo de decisão + acurácia'],
    ia: ['AI OPERATIONS','Conectar modelo a contexto, ferramentas, guardrails e uma métrica de valor real.','Métrica → tarefa resolvida + qualidade']
  };
  document.querySelectorAll('.bottleneck').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.bottleneck').forEach(b => b.classList.toggle('is-selected', b === button));
      const [solution, copy, metric] = bottleneckData[button.dataset.bottleneck];
      document.getElementById('bottleneck-solution').textContent = solution;
      document.getElementById('bottleneck-copy').textContent = copy;
      document.getElementById('bottleneck-metric').textContent = metric;
      if (window.gsap && !reduced) gsap.fromTo('.bottleneck-result', { x: -10, opacity: .6 }, { x: 0, opacity: 1, duration: .38, ease: 'power2.out' });
      scheduleFit();
    });
  });

  const solutionData = {
    data: ['DATA / 01','Data Platform','Base confiável para decidir, automatizar e escalar.','Pipelines · lakehouse · qualidade · observabilidade'],
    ai: ['AI / 02','AI Operations','IA conectada ao contexto e ao trabalho real da empresa.','RAG · agentes · copilots · avaliação'],
    automation: ['AUTO / 03','Automation','Processos que deixam de depender de memória e acompanhamento.','APIs · webhooks · eventos · filas · alertas'],
    analytics: ['DECISION / 04','Analytics & DS','Dados que apontam o próximo movimento da operação.','KPIs · BI · forecast · segmentação · otimização']
  };
  document.querySelectorAll('.solution-node').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.solution-node').forEach(b => b.classList.toggle('is-selected', b === button));
      const [code, title, copy, stack] = solutionData[button.dataset.solution];
      document.getElementById('solution-code').textContent = code;
      document.getElementById('solution-title').textContent = title;
      document.getElementById('solution-copy').textContent = copy;
      document.getElementById('solution-stack').textContent = stack;
      if (window.gsap && !reduced) gsap.fromTo('.solution-core', { scale: .93, rotate: -1 }, { scale: 1, rotate: 0, duration: .45, ease: 'back.out(1.6)' });
      scheduleFit();
    });
  });

  let flowTimer = null;
  const activateFlow = () => {
    const nodes = [...document.querySelectorAll('.arch-node')];
    const links = [...document.querySelectorAll('.arch-link span')];
    if (flowTimer) clearTimeout(flowTimer);
    nodes.forEach(node => node.classList.remove('is-live'));
    if (window.gsap) links.forEach(link => gsap.set(link, isMobile() ? { yPercent: -100 } : { xPercent: -100 }));

    let step = 0;
    const run = () => {
      nodes.forEach((node, index) => node.classList.toggle('is-live', index === step));
      if (step > 0 && links[step - 1] && window.gsap && !reduced) {
        gsap.to(links[step - 1], isMobile() ? { yPercent: 0, duration: .32 } : { xPercent: 0, duration: .32, ease: 'power2.out' });
      }
      step += 1;
      if (step < nodes.length) flowTimer = setTimeout(run, 360);
      else flowTimer = setTimeout(() => nodes.forEach(node => node.classList.remove('is-live')), 800);
    };
    run();
  };
  const flowButton = document.getElementById('activate-flow');
  if (flowButton) flowButton.addEventListener('click', activateFlow);
  document.querySelectorAll('.arch-node').forEach((node, index) => node.addEventListener('click', () => {
    document.querySelectorAll('.arch-node').forEach((n, i) => n.classList.toggle('is-live', i <= index));
  }));

  const methodData = [
    ['DIAGNÓSTICO','Mapeamos onde o valor está travado.','Mapa de oportunidades priorizado'],
    ['DESENHO','Escolhemos a menor arquitetura que resolve.','Arquitetura + plano de execução'],
    ['IMPLEMENTAÇÃO','Construímos para uso real, não para demo.','Solução em produção'],
    ['OTIMIZAÇÃO','Medimos o que mudou e ampliamos o ganho.','ROI operacional + próximos ganhos']
  ];
  document.querySelectorAll('[data-method]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-method]').forEach(b => b.classList.toggle('is-selected', b === button));
      const data = methodData[Number(button.dataset.method)];
      document.getElementById('method-tag').textContent = data[0];
      document.getElementById('method-title').textContent = data[1];
      document.getElementById('method-output').textContent = data[2];
      if (window.gsap && !reduced) gsap.fromTo('.method-content', { opacity: .65, y: 8 }, { opacity: 1, y: 0, duration: .34 });
      scheduleFit();
    });
  });

  const proofData = {
    scale: ['Capacidade para crescer sem linearizar infraestrutura.','Pipelines distribuídos e runtime otimizado transformam volume em capacidade operacional previsível.'],
    auto: ['Rotina deixa de consumir atenção humana.','Orquestração recorrente reduz intervenção, dependência de memória e risco de execução.'],
    manual: ['Software absorve trabalho antes feito por pessoas.','Serviços de ingestão substituem coleta e movimentação manual, liberando horas para trabalho de maior valor.'],
    ops: ['Informação chega mais perto da decisão.','SQL, BI e automação reduzem latência operacional e aumentam previsibilidade de gestão.']
  };
  document.querySelectorAll('.proof-tile').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.proof-tile').forEach(b => b.classList.toggle('is-selected', b === button));
      const [title, copy] = proofData[button.dataset.proof];
      document.getElementById('proof-title').textContent = title;
      document.getElementById('proof-copy').textContent = copy;
      if (window.gsap && !reduced) gsap.fromTo('.proof-meaning', { opacity: .5, x: -8 }, { opacity: 1, x: 0, duration: .35 });
      scheduleFit();
    });
  });

  const aiMessages = [
    'Contexto entra. A análise começa com dados estruturados.',
    'O modelo executa dentro de um fluxo controlado — não isolado.',
    'A saída vira contrato estruturado para software e operação.',
    'Eventos e outcomes fecham o loop para medir qualidade e valor.'
  ];
  document.querySelectorAll('[data-ai-step]').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.aiStep);
      document.querySelectorAll('[data-ai-step]').forEach((b, i) => b.classList.toggle('is-active', i <= index));
      document.getElementById('ai-message').textContent = aiMessages[index];
      if (window.gsap && !reduced) gsap.fromTo('.ai-signal span', { scale: .4 }, { scale: 1, duration: .5, ease: 'back.out(2)' });
      scheduleFit();
    });
  });

  const diagnosticData = {
    manual: ['AUTOMATION FIRST','Mapear passos, horas e handoffs. Depois automatizar o trecho com maior recorrência e menor risco.','Medir → horas recuperadas · retrabalho · SLA'],
    data: ['DATA FOUNDATION FIRST','Identificar fontes críticas e criar uma camada confiável antes de multiplicar dashboards ou IA.','Medir → latência · qualidade · disponibilidade'],
    decision: ['DECISION LAYER FIRST','Levar informação, alerta ou modelo até a decisão que hoje acontece tarde demais.','Medir → lead time · acurácia · perda evitada'],
    ai: ['USE CASE FIRST','Escolher uma tarefa real, definir baseline e provar valor antes de ampliar modelo, agente ou arquitetura.','Medir → tarefa resolvida · qualidade · custo por execução'],
    scale: ['ARCHITECTURE FIRST','Encontrar o componente que cresce linearmente com pessoas, volume ou custo e redesenhar esse gargalo.','Medir → throughput · custo marginal · capacidade']
  };
  document.querySelectorAll('[data-diagnostic]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-diagnostic]').forEach(b => b.classList.toggle('is-selected', b === button));
      const [label, title, metric] = diagnosticData[button.dataset.diagnostic];
      const result = document.getElementById('diagnostic-result');
      result.innerHTML = `<span>${label}</span><strong>${title}</strong><p>${metric}</p>`;
      if (window.gsap && !reduced) gsap.fromTo(result, { scale: .985, opacity: .65 }, { scale: 1, opacity: 1, duration: .42, ease: 'power2.out' });
      scheduleFit();
    });
  });

  const setupVectorField = () => {
    if (reduced) return;
    const canvas = document.getElementById('vector-field');
    const ctx = canvas && canvas.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    let width = 0, height = 0, dpr = 1, last = 0, time = 0;
    let pointerX = .75;
    const count = isMobile() ? 12 : 30;
    const fps = isMobile() ? 22 : 50;
    const minFrame = 1000 / fps;
    const traces = [];

    const reset = (t, fresh = false) => {
      t.x = Math.random() * width;
      t.y = fresh ? Math.random() * height : height + Math.random() * 80;
      t.px = t.x; t.py = t.y;
      t.life = 100 + Math.random() * 150;
      t.max = t.life;
      t.speed = .45 + Math.random() * .72;
      t.seed = Math.random() * Math.PI * 2;
    };
    const resize = () => {
      const viewport = window.visualViewport;
      width = viewport ? viewport.width : window.innerWidth;
      height = viewport ? viewport.height : window.innerHeight;
      dpr = Math.min(isMobile() ? 1 : 1.25, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      traces.length = 0;
      for (let i=0;i<count;i+=1) { const t={}; reset(t,true); traces.push(t); }
    };
    const render = now => {
      requestAnimationFrame(render);
      if (document.hidden || now - last < minFrame) return;
      last = now; time = now;
      ctx.clearRect(0,0,width,height);
      ctx.globalCompositeOperation = 'lighter';
      traces.forEach((t,index) => {
        t.px=t.x; t.py=t.y;
        const nx=t.x/Math.max(width,1), ny=t.y/Math.max(height,1);
        const pointer = isMobile() ? 0 : (pointerX-nx)*.1;
        const angle=-1.12 + Math.sin(nx*5.7+time*.00045+t.seed)*.2 + Math.cos(ny*4-time*.0003+t.seed)*.09 + pointer;
        const step=t.speed*(isMobile()?.98:1.4);
        t.x+=Math.cos(angle)*step; t.y+=Math.sin(angle)*step; t.life-=1;
        const fade=Math.max(0,t.life/t.max);
        const alpha=Math.min(isMobile()?.075:.13,fade*(isMobile()?.07:.115));
        const grad=ctx.createLinearGradient(t.px,t.py,t.x,t.y);
        grad.addColorStop(0,`rgba(112,244,208,${alpha*.25})`); grad.addColorStop(1,`rgba(183,255,55,${alpha})`);
        ctx.beginPath(); ctx.moveTo(t.px,t.py); ctx.lineTo(t.x,t.y); ctx.strokeStyle=grad; ctx.lineWidth=index%5===0?1:.6; ctx.stroke();
        if(t.life<=0||t.y<-30||t.x<-50||t.x>width+50) reset(t,false);
      });
      ctx.globalCompositeOperation='source-over';
    };
    window.addEventListener('resize',resize,{passive:true});
    window.visualViewport?.addEventListener('resize',resize,{passive:true});
    if(!isMobile()) window.addEventListener('pointermove',e=>{pointerX=e.clientX/Math.max(width,1);},{passive:true});
    resize(); requestAnimationFrame(render);
  };

  scenes.forEach((scene, index) => scene.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'));
  setupVectorField();
  updateChrome();
  fitAllScenes();
  runSceneEntry(scenes[0]);
  root.focus({ preventScroll: true });
})();
