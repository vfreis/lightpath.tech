(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 759px)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  document.body.classList.add('story-engine-enabled');

  const retireLegacyField = () => {
    const legacy = $('.flow-canvas');
    if (!legacy) return;
    legacy.style.display = 'none';
    legacy.width = 1;
    legacy.height = 1;
  };
  retireLegacyField();
  window.addEventListener('resize', () => setTimeout(retireLegacyField, 0), { passive: true });

  /* Commercial positioning: Growth Systems / Revenue Architecture. */
  const heroDemo = $('.hero .text-link');
  if (heroDemo) {
    heroDemo.href = 'apresentacao/';
    heroDemo.innerHTML = 'Abrir apresentação interativa <span>↗</span>';
  }

  const nav = $('.nav');
  if (nav && !nav.querySelector('a[href="#growth"]')) {
    const growthLink = document.createElement('a');
    growthLink.href = '#growth';
    growthLink.textContent = 'Growth';
    const impactLink = nav.querySelector('a[href="#impacto"]');
    nav.insertBefore(growthLink, impactLink || nav.firstChild);
  }

  const methodSection = $('.method');
  if (methodSection && !$('#growth')) {
    const growth = document.createElement('section');
    growth.className = 'section growth-systems';
    growth.id = 'growth';
    growth.innerHTML = `
      <div class="shell growth-shell">
        <div class="section-kicker reveal"><span>GROWTH</span> Revenue architecture</div>
        <div class="growth-heading reveal">
          <div>
            <span class="growth-overline">AQUISIÇÃO → CONVERSÃO → DADOS → RETENÇÃO</span>
            <h2>Da mídia ao caixa.<br><em>Um sistema de receita.</em></h2>
          </div>
          <p>Não tratamos tráfego, site, checkout, tracking e operação como peças isoladas. Projetamos o <strong>sistema comercial completo</strong> para que cada investimento gere sinal, cada sinal gere decisão e cada venda volte como aprendizado para o funil.</p>
        </div>

        <div class="growth-console reveal">
          <div class="growth-console-head"><span>LIGHTPATH / REVENUE SYSTEM</span><span class="growth-live"><i></i> SIGNAL LIVE</span></div>
          <div class="growth-machine" aria-label="Arquitetura comercial integrada">
            <button class="growth-node is-active" type="button" data-growth="acquisition"><small>01</small><b>PAID MEDIA</b><span>Meta · Google · creative</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="conversion"><small>02</small><b>LANDING / QUIZ</b><span>message · UX · routing</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="checkout"><small>03</small><b>CHECKOUT</b><span>offer · payment · recovery</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="truth"><small>04</small><b>ORDER TRUTH</b><span>commerce · payment · CRM</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="retention"><small>05</small><b>DELIVERY</b><span>members · lifecycle · support</span></button>
          </div>
          <div class="growth-data-rail"><span>DATA & ATTRIBUTION LAYER</span><b>UTM</b><b>event_id</b><b>Meta / CAPI</b><b>GA4</b><b>webhooks</b><b>reconciliation</b></div>
          <div class="growth-insight" id="growth-insight">
            <div><small>LENTE ATIVA</small><strong id="growth-insight-title">Aquisição com feedback de negócio.</strong></div>
            <p id="growth-insight-copy">Criativo e mídia são avaliados até o pedido real — não apenas por clique, LPV ou evento incompleto.</p>
            <span id="growth-insight-kpi">Decisão → CAC · receita · qualidade do tráfego</span>
          </div>
        </div>

        <div class="growth-case reveal">
          <div class="growth-case-copy">
            <span class="growth-case-label">BUSINESS CASE · DIGITAL COMMERCE / HEALTH</span>
            <h3>Quando o funil inteiro vira um produto de engenharia.</h3>
            <p>Ecossistema real combinando mídia paga, landing/quiz, checkout externo, verdade comercial, acesso ao produto, tracking e analytics. O desafio deixa de ser “rodar anúncios” e passa a ser <strong>saber exatamente onde o valor entra, onde vaza e qual mudança merece o próximo real investido.</strong></p>
          </div>
          <div class="growth-case-grid">
            <article><span>ANTES</span><b>Sinais desconectados</b><p>Plataformas divergentes, eventos incompletos e pouca confiança para diagnosticar mídia, landing ou checkout.</p></article>
            <article><span>SISTEMA</span><b>Reconciliação ponta a ponta</b><p>Pedido, sessão, UTM, event_id, checkout, webhooks e destinos analíticos conectados numa arquitetura observável.</p></article>
            <article><span>VALOR</span><b>Growth com engenharia</b><p>Gates de decisão por criativo, landing, checkout e oferta; mídia passa a aprender com resultado comercial real.</p></article>
          </div>
        </div>

        <div class="growth-capabilities reveal">
          <span>Estratégia de mídia</span><span>Arquitetura de funil</span><span>Tracking & CAPI</span><span>Attribution</span><span>CRO</span><span>CRM & lifecycle</span><span>Checkout systems</span><span>Growth analytics</span>
        </div>
      </div>`;
    methodSection.parentNode.insertBefore(growth, methodSection);
  }

  const growthData = {
    acquisition: ['Aquisição com feedback de negócio.', 'Criativo e mídia são avaliados até o pedido real — não apenas por clique, LPV ou evento incompleto.', 'Decisão → CAC · receita · qualidade do tráfego'],
    conversion: ['Conversão tratada como sistema.', 'Mensagem, UX, quiz, segmentação e roteamento são medidos por avanço real no funil e não por opinião estética.', 'Decisão → LPV→checkout · intenção · abandono'],
    checkout: ['Checkout como infraestrutura de receita.', 'Oferta, pagamento, recovery e eventos de fundo de funil precisam funcionar juntos e continuar rastreáveis.', 'Decisão → checkout→payment · aprovação · perda'],
    truth: ['Uma verdade comercial confiável.', 'Pedido e pagamento são reconciliados com sessão, campanha e eventos para impedir que telemetria incompleta governe a mídia.', 'Decisão → purchase real · deduplicação · atribuição'],
    retention: ['Receita continua depois da compra.', 'Entitlement, members, lifecycle e suporte fecham o loop entre aquisição, entrega e retenção.', 'Decisão → ativação · retenção · LTV']
  };
  $$('.growth-node').forEach(button => button.addEventListener('click', () => {
    $$('.growth-node').forEach(node => node.classList.toggle('is-active', node === button));
    const data = growthData[button.dataset.growth] || growthData.acquisition;
    $('#growth-insight-title')?.replaceChildren(document.createTextNode(data[0]));
    $('#growth-insight-copy')?.replaceChildren(document.createTextNode(data[1]));
    $('#growth-insight-kpi')?.replaceChildren(document.createTextNode(data[2]));
    if (!reduced && window.gsap) gsap.fromTo('#growth-insight', { opacity: .55, y: 8 }, { opacity: 1, y: 0, duration: .38, ease: 'power2.out' });
  }));

  const commandCenterForDemo = $('.command-center');
  if (commandCenterForDemo && !$('.presentation-demo-card')) {
    const demo = document.createElement('a');
    demo.className = 'presentation-demo-card reveal';
    demo.href = 'apresentacao/';
    demo.innerHTML = '<span><small>INTERACTIVE SALES APP</small><strong>Veja a LightPath funcionando como uma experiência.</strong><p>Abra a apresentação interativa — arquitetura, impacto, growth e diagnóstico em uma narrativa clicável.</p></span><i>ABRIR DEMO ↗</i>';
    commandCenterForDemo.insertAdjacentElement('afterend', demo);
  }

  const stageMap = [
    { selector: '.hero', key: 'chaos', label: 'POTENCIAL' },
    { selector: '.problem', key: 'signal', label: 'GARGALO' },
    { selector: '.build-section', key: 'structure', label: 'SISTEMA' },
    { selector: '.business-cases', key: 'measure', label: 'IMPACTO' },
    { selector: '.growth-systems', key: 'revenue', label: 'RECEITA' },
    { selector: '.method', key: 'flow', label: 'EXECUÇÃO' },
    { selector: '.proof-section', key: 'growth', label: 'RESULTADO' },
    { selector: '.fit-section', key: 'decision', label: 'ESCOLHA' },
    { selector: '.scanner-section', key: 'decision', label: 'DIAGNÓSTICO' },
    { selector: '.contact-section', key: 'final', label: 'LIGHTPATH' }
  ].map(item => ({ ...item, el: $(item.selector) })).filter(item => item.el);

  let activeStage = stageMap[0] || null;
  const pickActiveStage = () => {
    const targetY = innerHeight * .46;
    let best = activeStage;
    let bestDistance = Infinity;
    stageMap.forEach(stage => {
      const rect = stage.el.getBoundingClientRect();
      const center = rect.top + Math.min(rect.height, innerHeight) * .44;
      const distance = Math.abs(center - targetY);
      if (rect.bottom > 0 && rect.top < innerHeight && distance < bestDistance) {
        best = stage;
        bestDistance = distance;
      }
    });
    activeStage = best || activeStage;
    document.documentElement.dataset.storyStage = activeStage?.key || 'chaos';
  };

  const wash = document.createElement('div');
  wash.className = 'story-wash';
  wash.setAttribute('aria-hidden', 'true');
  document.body.prepend(wash);

  if (!reduced) {
    const canvas = document.createElement('canvas');
    canvas.className = 'story-field';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 1, height = 1, dpr = 1, time = 0, lastFrame = 0;
    let pointerX = .72, pointerY = .3;
    const targetFps = mobile ? 22 : 45;
    const minFrame = 1000 / targetFps;
    const particles = [];
    const particleCount = mobile ? 13 : Math.min(38, Math.max(24, Math.round(innerWidth / 44)));

    const resize = () => {
      width = innerWidth; height = innerHeight;
      dpr = Math.min(mobile ? 1 : 1.25, devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(width * dpr)); canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) particles.push({ x: Math.random() * width, y: Math.random() * height, px: 0, py: 0, seed: Math.random() * 20, speed: .35 + Math.random() * .65, age: Math.random() * 220 });
    };

    const reset = p => {
      const key = activeStage?.key || 'chaos';
      if (key === 'final' || key === 'growth') { p.x = Math.random() * width * .75; p.y = height + Math.random() * 80; }
      else if (key === 'structure' || key === 'flow' || key === 'revenue') { p.x = -30 - Math.random() * 100; p.y = Math.random() * height; }
      else { p.x = Math.random() * width; p.y = Math.random() * height; }
      p.px = p.x; p.py = p.y; p.age = 0; p.seed = Math.random() * 20;
    };

    const vector = p => {
      const key = activeStage?.key || 'chaos';
      const nx = p.x / Math.max(width, 1), ny = p.y / Math.max(height, 1);
      let angle = -1.1, boost = 1;
      if (key === 'chaos') { angle = -1.05 + Math.sin(nx * 8 + time * .00045 + p.seed) * .52 + Math.cos(ny * 5 - time * .00025) * .22; boost = .75; }
      else if (key === 'signal') { const lane = Math.round(nx * 4) / 4; angle = -1.16 + (lane - nx) * .88 + Math.sin(time * .0004 + p.seed) * .12; }
      else if (key === 'structure') { angle = -.18 + Math.sin(ny * 6 + p.seed) * .07; boost = 1.08; }
      else if (key === 'measure') { angle = -.7 + Math.sin(nx * 5 + p.seed) * .12; boost = 1.16; }
      else if (key === 'revenue') { const laneY = height * (.2 + Math.round(ny * 4) * .16); angle = Math.atan2(laneY - p.y, width + 60 - p.x) - .06 + Math.sin(p.seed + time * .00035) * .04; boost = 1.25; }
      else if (key === 'flow') { const targetY = height * (.25 + (Math.round(ny * 3) / 3) * .62); angle = Math.atan2(targetY - p.y, width + 40 - p.x) + Math.sin(time * .00035 + p.seed) * .05; boost = 1.12; }
      else if (key === 'growth') { angle = Math.atan2(-height * .15 - p.y, width * .86 - p.x) + Math.sin(p.seed + time * .0003) * .08; boost = 1.2; }
      else if (key === 'decision') { const cx = width * .58, cy = height * .44; angle = Math.atan2(cy - p.y, cx - p.x) + .34 * Math.sin(p.seed + time * .00035); boost = .9; }
      else if (key === 'final') { angle = Math.atan2(height * .26 - p.y, width * (mobile ? .72 : .83) - p.x); boost = 1.22; }
      if (finePointer && !mobile) angle += (pointerX - nx) * .035 + (pointerY - ny) * .018;
      return { angle, boost };
    };

    const drawArrow = (x, y, angle, alpha) => {
      const size = mobile ? 3 : 4.5;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle + Math.PI - .48) * size, y + Math.sin(angle + Math.PI - .48) * size); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(angle + Math.PI + .48) * size, y + Math.sin(angle + Math.PI + .48) * size); ctx.strokeStyle = `rgba(183,255,55,${alpha})`; ctx.lineWidth = .7; ctx.stroke();
    };

    const render = now => {
      requestAnimationFrame(render);
      if (document.hidden || now - lastFrame < minFrame) return;
      lastFrame = now; time = now; pickActiveStage();
      ctx.clearRect(0, 0, width, height); ctx.globalCompositeOperation = 'lighter';
      const key = activeStage?.key || 'chaos'; const baseAlpha = mobile ? .095 : .15;
      particles.forEach((p, index) => {
        p.px = p.x; p.py = p.y; const v = vector(p); const step = p.speed * v.boost * (mobile ? 1.25 : 1.65); p.x += Math.cos(v.angle) * step; p.y += Math.sin(v.angle) * step; p.age += 1;
        const gradient = ctx.createLinearGradient(p.px, p.py, p.x, p.y); gradient.addColorStop(0, `rgba(112,244,208,${baseAlpha * .22})`); gradient.addColorStop(1, `rgba(183,255,55,${baseAlpha})`);
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.strokeStyle = gradient; ctx.lineWidth = index % 5 === 0 ? .95 : .55; ctx.stroke();
        if (index % (mobile ? 10 : 7) === 0 && p.age % 48 < 1) drawArrow(p.x, p.y, v.angle, baseAlpha * 1.55);
        const escaped = p.x < -160 || p.x > width + 160 || p.y < -160 || p.y > height + 160 || p.age > 380;
        if (escaped || (key === 'final' && Math.hypot(p.x - width * .83, p.y - height * .26) < 24)) reset(p);
      });
      ctx.globalCompositeOperation = 'source-over';
    };
    if (finePointer) window.addEventListener('pointermove', e => { pointerX = e.clientX / Math.max(innerWidth, 1); pointerY = e.clientY / Math.max(innerHeight, 1); }, { passive: true });
    window.addEventListener('resize', resize, { passive: true }); resize(); requestAnimationFrame(render);
  }

  const spine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  spine.setAttribute('class', 'energy-spine'); spine.setAttribute('viewBox', '0 0 100 100'); spine.setAttribute('preserveAspectRatio', 'none'); spine.setAttribute('aria-hidden', 'true');
  spine.innerHTML = '<defs><linearGradient id="energyGradient" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#70f4d0" stop-opacity=".18"/><stop offset=".55" stop-color="#b7ff37" stop-opacity=".72"/><stop offset="1" stop-color="#b7ff37" stop-opacity=".22"/></linearGradient></defs><path d="M8 100 C4 83 18 76 13 62 C9 49 28 44 22 31 C18 20 45 21 52 13 C63 1 75 12 92 0"/><circle class="energy-node" cx="92" cy="0" r=".65"/>';
  document.body.appendChild(spine);
  const spinePath = $('path', spine); const spineLength = spinePath?.getTotalLength?.() || 160;
  if (spinePath) { spinePath.style.strokeDasharray = `${spineLength}`; spinePath.style.strokeDashoffset = `${spineLength}`; }

  const kineticLabels = new Map([
    ['problem', 'GARGALO'], ['build-section', 'SISTEMA'], ['business-cases', 'IMPACTO'], ['growth-systems', 'RECEITA'], ['method', 'FLUXO'], ['proof-section', 'RESULTADO'], ['fit-section', 'DECISÃO'], ['scanner-section', 'DIAGNÓSTICO'], ['contact-section', 'ESCALA']
  ]);
  $$('.section').forEach(section => {
    const classKey = [...kineticLabels.keys()].find(key => section.classList.contains(key));
    if (classKey) { const label = document.createElement('span'); label.className = 'story-kinetic'; label.textContent = kineticLabels.get(classKey); section.prepend(label); }
  });

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (!entry.isIntersecting) return; const section = entry.target; section.classList.add('story-section-active', 'story-section-enter'); setTimeout(() => section.classList.remove('story-section-enter'), 950); });
  }, { threshold: mobile ? .08 : .16, rootMargin: '0px 0px -8% 0px' });
  $$('.section').forEach(section => sectionObserver.observe(section));

  const hero = $('.hero');
  if (hero) { const depth = document.createElement('div'); depth.className = 'hero-depth'; depth.setAttribute('aria-hidden', 'true'); depth.innerHTML = '<span class="plane-a"></span><span class="plane-b"></span><span class="plane-c"></span>'; hero.prepend(depth); hero.classList.add('story-depth-active'); }

  const commandCenter = $('.command-center');
  if (commandCenter) {
    commandCenter.classList.add('story-powered');
    $$('.pipe-node,.pipe-line', commandCenter).forEach((el, index) => { el.style.transitionDelay = `${index * 110}ms`; });
    const systemObserver = new IntersectionObserver(entries => { entries.forEach(entry => { if (!entry.isIntersecting) return; setTimeout(() => commandCenter.classList.add('system-built'), mobile ? 120 : 260); systemObserver.disconnect(); }); }, { threshold: .24 });
    systemObserver.observe(commandCenter);
  }

  $$('.business-case').forEach(card => {
    const switcher = document.createElement('div'); switcher.className = 'case-mode-switch'; switcher.setAttribute('role', 'group'); switcher.setAttribute('aria-label', 'Etapa do business case');
    ['Antes', 'Sistema', 'Depois'].forEach((label, index) => { const button = document.createElement('button'); button.type = 'button'; button.textContent = label; button.dataset.mode = ['before', 'system', 'after'][index]; if (index === 2) button.classList.add('is-active'); switcher.appendChild(button); });
    const lead = $('.business-case-lead', card); (lead || $('h3', card))?.insertAdjacentElement('afterend', switcher); card.classList.add('case-after');
    $$('button', switcher).forEach(button => button.addEventListener('click', () => { $$('button', switcher).forEach(btn => btn.classList.toggle('is-active', btn === button)); card.classList.remove('case-before', 'case-system', 'case-after'); card.classList.add(`case-${button.dataset.mode}`); }));
  });

  const addMetricViz = (container, value, kind = 'ring') => {
    if (!container || $('.metric-viz', container)) return;
    const viz = document.createElement('span'); viz.className = 'metric-viz'; viz.dataset.kind = kind; viz.style.setProperty('--p', '0'); container.appendChild(viz);
    const p = clamp(Math.abs(value), 8, 100); const io = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { requestAnimationFrame(() => viz.style.setProperty('--p', String(p))); io.disconnect(); } }, { threshold: .4 }); io.observe(container);
  };
  $$('.metric').forEach((el, index) => addMetricViz(el, Number($('.counter', el)?.dataset.count || 50), index % 2 ? 'bar' : 'ring'));
  $$('.business-case-impact').forEach(el => addMetricViz(el, Number($('.counter', el)?.dataset.count || 78), 'ring'));
  $$('.proof-card').forEach((el, index) => addMetricViz(el, Number($('.counter', el)?.dataset.count || 72), index % 2 ? 'bar' : 'ring'));

  const scannerData = {
    tempo: { title: 'Automação de processo', copy: 'Mapeamos esperas, handoffs e tarefas repetitivas. O primeiro alvo é reduzir lead time sem criar uma nova camada de operação.', kpis: ['lead time', 'horas recuperadas', 'SLA'], objective: 'Automatizar processos' },
    custo: { title: 'Data + automação orientados a margem', copy: 'Identificamos onde pessoas, compute ou retrabalho estão crescendo mais rápido que o resultado e desenhamos a menor arquitetura que quebra essa relação.', kpis: ['custo / transação', 'retrabalho', 'runtime'], objective: 'Estruturar dados / Data Platform' },
    risco: { title: 'Observabilidade + guardrails', copy: 'Transformamos dependência de memória, erro manual e baixa rastreabilidade em controles, logs, validações e supervisão onde realmente importa.', kpis: ['erro', 'incidentes', 'rastreabilidade'], objective: 'Desenvolver uma solução sob medida' },
    capacidade: { title: 'Arquitetura para escala', copy: 'Quando o volume cresce mais rápido que a operação, conectamos dados, software e automação para absorver crescimento sem linearizar esforço humano.', kpis: ['volume', 'throughput', 'custo marginal'], objective: 'Estruturar dados / Data Platform' },
    decisao: { title: 'Analytics + IA aplicada', copy: 'Reduzimos a distância entre o evento e a decisão com dados confiáveis, alertas, modelos e interfaces orientadas ao próximo movimento.', kpis: ['latência decisória', 'qualidade', 'forecast'], objective: 'Analytics / Data Science' }
  };
  const scanner = $('.scanner-section');
  if (scanner) {
    const options = $$('.scanner-option', scanner), title = $('#scanner-result-title'), copy = $('#scanner-result-copy'), kpis = $('#scanner-result-kpis'); let selected = 'tempo';
    const renderScanner = key => { selected = scannerData[key] ? key : 'tempo'; const data = scannerData[selected]; options.forEach(option => option.classList.toggle('is-selected', option.dataset.signal === selected)); if (title) title.textContent = data.title; if (copy) copy.textContent = data.copy; if (kpis) kpis.innerHTML = data.kpis.map(kpi => `<span>${kpi}</span>`).join(''); };
    options.forEach(option => option.addEventListener('click', () => renderScanner(option.dataset.signal)));
    $('#scanner-to-contact')?.addEventListener('click', () => { const data = scannerData[selected]; const objective = $('#lead-form select[name="objective"]'); if (objective) { const match = [...objective.options].find(option => option.textContent.trim() === data.objective); if (match) objective.value = match.value || match.textContent; } const challenge = $('#lead-form textarea[name="challenge"]'); if (challenge && !challenge.value.trim()) challenge.value = `Quero avaliar um gargalo principalmente relacionado a ${selected}. Precisamos medir ${data.kpis.join(', ')} e entender o potencial de ${data.title.toLowerCase()}.`; $('#contato')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); });
    renderScanner('tempo');
  }

  const contact = $('.contact-section');
  if (contact) { const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'convergence-mark'); svg.setAttribute('viewBox', '0 0 700 700'); svg.setAttribute('aria-hidden', 'true'); svg.innerHTML = '<path d="M20 650 C160 560 180 470 310 390"/><path d="M95 670 C230 570 265 440 380 325"/><path d="M185 690 C320 570 390 400 470 245"/><path class="mountain-final" d="M165 560 284 398l72 84 103-174 128 252"/><path class="mountain-final" d="M185 560h386"/>'; contact.prepend(svg); }

  const kineticBridge = $('.kinetic-bridge');
  const updateScrollStory = () => {
    const total = Math.max(1, document.documentElement.scrollHeight - innerHeight), progress = clamp(scrollY / total, 0, 1);
    if (spinePath) spinePath.style.strokeDashoffset = `${spineLength * (1 - progress)}`;
    if (kineticBridge) { const rect = kineticBridge.getBoundingClientRect(); const local = clamp((innerHeight - rect.top) / (innerHeight + rect.height), 0, 1); kineticBridge.style.setProperty('--kinetic-shift', `${(local - .5) * (mobile ? 34 : 90)}px`); }
    if (hero && !reduced) { const heroRect = hero.getBoundingClientRect(); const p = clamp(-heroRect.top / Math.max(heroRect.height, 1), 0, 1); $$('.hero-depth span').forEach((plane, index) => { plane.style.translate = `${(index - 1) * p * 10}px ${p * (14 + index * 8)}px`; }); }
    pickActiveStage(); const stageIndex = Math.max(0, stageMap.indexOf(activeStage)); const x = 18 + (stageIndex / Math.max(1, stageMap.length - 1)) * 66; const y = 68 - (stageIndex / Math.max(1, stageMap.length - 1)) * 45; document.documentElement.style.setProperty('--story-x', `${x}%`); document.documentElement.style.setProperty('--story-y', `${y}%`);
  };
  window.addEventListener('scroll', updateScrollStory, { passive: true }); updateScrollStory();
})();
