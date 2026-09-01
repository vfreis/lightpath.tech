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
  const mobile = window.matchMedia('(max-width: 759px)').matches;
  let current = 0;
  let transitioning = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

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
    if (progressBar) progressBar.style.width = `${((current + 1) / scenes.length) * 100}%`;
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
      { opacity: 0, y: mobile ? 18 : 28, scale: .992 },
      { opacity: 1, y: 0, scale: 1, duration: mobile ? .52 : .72, stagger: mobile ? .055 : .075, ease: 'power3.out', clearProps: 'transform' }
    );
  };

  const animateHeroVectors = scene => {
    if (!scene.matches('[data-scene="0"]') || reduced || !window.gsap) return;
    const vectors = scene.querySelectorAll('.hero-vector .vector');
    gsap.set(vectors, { strokeDashoffset: 500 });
    gsap.to(vectors, { strokeDashoffset: 0, duration: 1.45, stagger: .16, delay: .25, ease: 'power2.inOut' });
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
      gsap.killTweensOf(state);
      gsap.to(state, {
        value: target,
        duration: mobile ? 1 : 1.45,
        ease: 'power3.out',
        onUpdate: () => { el.textContent = `${prefix}${Math.round(state.value)}${suffix}`; },
        onComplete: () => { el.textContent = `${prefix}${target}${suffix}`; }
      });
    });
  };

  const runSceneEntry = scene => {
    scene.scrollTop = 0;
    animateScene(scene);
    animateHeroVectors(scene);
    animateProofCounters(scene);
  };

  const swapScene = target => {
    scenes.forEach((scene, index) => scene.classList.toggle('is-active', index === target));
    current = target;
    updateChrome();
    runSceneEntry(scenes[current]);
  };

  function goTo(target) {
    target = clamp(target, 0, scenes.length - 1);
    if (target === current || transitioning) return;
    transitioning = true;

    if (reduced || !window.gsap || !wipe) {
      swapScene(target);
      transitioning = false;
      return;
    }

    const direction = target > current ? 1 : -1;
    gsap.killTweensOf(wipe);
    gsap.set(wipe, { xPercent: direction > 0 ? -130 : 130, opacity: 0 });
    const tl = gsap.timeline({ onComplete: () => { transitioning = false; } });
    tl.to(wipe, { xPercent: direction > 0 ? 0 : 0, opacity: .95, duration: .32, ease: 'power3.in' })
      .add(() => swapScene(target))
      .to(wipe, { xPercent: direction > 0 ? 130 : -130, opacity: 0, duration: .48, ease: 'power3.out' });
  }

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);
  if (nextButton) nextButton.addEventListener('click', next);
  if (prevButton) prevButton.addEventListener('click', prev);
  document.querySelectorAll('.js-next').forEach(button => button.addEventListener('click', next));

  window.addEventListener('keydown', event => {
    const tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
    if (['input','textarea','select','button'].includes(tag)) return;
    if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); next(); }
    if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); prev(); }
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(scenes.length - 1);
  });

  root.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  root.addEventListener('touchend', event => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next(); else prev();
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
    });
  });

  let flowTimer = null;
  const activateFlow = () => {
    const nodes = [...document.querySelectorAll('.arch-node')];
    const links = [...document.querySelectorAll('.arch-link span')];
    if (flowTimer) clearTimeout(flowTimer);
    nodes.forEach(node => node.classList.remove('is-live'));
    if (window.gsap) links.forEach(link => gsap.set(link, mobile ? { yPercent: -100 } : { xPercent: -100 }));

    let step = 0;
    const run = () => {
      nodes.forEach((node, index) => node.classList.toggle('is-live', index === step));
      if (step > 0 && links[step - 1] && window.gsap && !reduced) {
        gsap.to(links[step - 1], mobile ? { yPercent: 0, duration: .32 } : { xPercent: 0, duration: .32, ease: 'power2.out' });
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
    });
  });

  const setupVectorField = () => {
    if (reduced) return;
    const canvas = document.getElementById('vector-field');
    const ctx = canvas && canvas.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;
    let width = 0, height = 0, dpr = 1, last = 0, time = 0;
    let pointerX = .75, pointerY = .25;
    const count = mobile ? 14 : 32;
    const fps = mobile ? 24 : 60;
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
      width = window.innerWidth; height = window.innerHeight;
      dpr = Math.min(mobile ? 1 : 1.35, window.devicePixelRatio || 1);
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
        const pointer = mobile ? 0 : (pointerX-nx)*.12;
        const angle=-1.12 + Math.sin(nx*5.7+time*.00045+t.seed)*.2 + Math.cos(ny*4-time*.0003+t.seed)*.09 + pointer;
        const step=t.speed*(mobile?1.05:1.5);
        t.x+=Math.cos(angle)*step; t.y+=Math.sin(angle)*step; t.life-=1;
        const fade=Math.max(0,t.life/t.max);
        const alpha=Math.min(mobile?.09:.15,fade*(mobile?.08:.13));
        const grad=ctx.createLinearGradient(t.px,t.py,t.x,t.y);
        grad.addColorStop(0,`rgba(112,244,208,${alpha*.25})`); grad.addColorStop(1,`rgba(183,255,55,${alpha})`);
        ctx.beginPath(); ctx.moveTo(t.px,t.py); ctx.lineTo(t.x,t.y); ctx.strokeStyle=grad; ctx.lineWidth=index%5===0?1:.6; ctx.stroke();
        if(t.life<=0||t.y<-30||t.x<-50||t.x>width+50) reset(t,false);
      });
      ctx.globalCompositeOperation='source-over';
    };
    window.addEventListener('resize',resize,{passive:true});
    if(!mobile) window.addEventListener('pointermove',e=>{pointerX=e.clientX/Math.max(width,1);pointerY=e.clientY/Math.max(height,1);},{passive:true});
    resize(); requestAnimationFrame(render);
  };

  setupVectorField();
  updateChrome();
  runSceneEntry(scenes[0]);
  root.focus({ preventScroll: true });
})();
