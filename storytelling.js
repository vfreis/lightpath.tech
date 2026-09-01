(() => {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 759px)').matches;
  const finePointer = window.matchMedia('(pointer:fine)').matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  document.body.classList.add('story-engine-enabled');

  /* Copy clarity layer — explain the business before the stack. */
  document.title = 'LightPath Tecnologia — Dados, IA, Automação e Growth Systems';
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.content = 'Construímos e conectamos dados, sistemas, IA e funis comerciais para reduzir trabalho manual, melhorar conversão e criar operações que crescem com controle.';
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.content = 'Do clique ao caixa, do dado à decisão, da rotina ao sistema e da IA ao produto. Tecnologia aplicada ao gargalo que move resultado.';

  const clarityStyles = document.createElement('style');
  clarityStyles.textContent = `
    .clarity-paths{position:relative;padding:72px 0 82px;overflow:hidden;background:linear-gradient(180deg,rgba(5,7,11,.94),rgba(8,12,16,.82));border-bottom:1px solid rgba(255,255,255,.07)}
    .clarity-paths:before{content:"";position:absolute;inset:-30% -20%;background:radial-gradient(circle at 72% 35%,rgba(183,255,55,.07),transparent 29%),radial-gradient(circle at 15% 75%,rgba(112,244,208,.045),transparent 28%);pointer-events:none}
    .clarity-intro{position:relative;z-index:2;display:grid;gap:14px;margin-bottom:26px}.clarity-intro small{font:700 9px/1 "Manrope",sans-serif;letter-spacing:.16em;color:#70f4d0;text-transform:uppercase}.clarity-intro h2{margin:0;font:600 clamp(36px,10vw,60px)/.93 "Space Grotesk",sans-serif;letter-spacing:-.055em;max-width:950px}.clarity-intro h2 em{font-style:normal;color:#b7ff37}.clarity-intro p{margin:0;max-width:650px;color:#98a4af;font-size:13px;line-height:1.65}
    .clarity-grid{position:relative;z-index:2;display:grid;gap:8px}.clarity-card{position:relative;min-height:128px;padding:18px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:linear-gradient(145deg,rgba(16,22,30,.84),rgba(8,12,17,.9));overflow:hidden;transition:border-color .28s ease,transform .28s ease,background .28s ease}.clarity-card:after{content:"↗";position:absolute;right:16px;top:15px;color:#b7ff37;font-size:14px}.clarity-card small{display:block;color:#70f4d0;font:700 7px/1 "Manrope",sans-serif;letter-spacing:.13em;margin-bottom:13px}.clarity-card strong{display:block;font:600 25px/.94 "Space Grotesk",sans-serif;letter-spacing:-.045em;text-transform:uppercase;max-width:86%}.clarity-card p{margin:11px 0 0;color:#84909c;font-size:10px;line-height:1.5;max-width:90%}.clarity-card:hover{border-color:rgba(183,255,55,.28);background:linear-gradient(145deg,rgba(183,255,55,.065),rgba(8,12,17,.92));transform:translateY(-3px)}
    .diagnostic-card-growth{border-color:rgba(183,255,55,.15)!important}.diagnostic-card-growth .card-symbol{color:#b7ff37}.diagnostic-card-growth:after{content:"REVENUE";position:absolute;right:22px;bottom:62px;color:transparent;-webkit-text-stroke:1px rgba(183,255,55,.08);font:700 48px/.8 "Space Grotesk",sans-serif;letter-spacing:-.07em;pointer-events:none}
    @media(min-width:760px){.clarity-paths{padding:105px 0}.clarity-intro{grid-template-columns:1fr .72fr;align-items:end;margin-bottom:36px}.clarity-intro p{justify-self:end;font-size:14px}.clarity-grid{grid-template-columns:repeat(4,1fr);gap:10px}.clarity-card{min-height:230px;padding:23px}.clarity-card strong{font-size:clamp(25px,2.2vw,36px)}.clarity-card p{margin-top:18px;font-size:11px}.clarity-card:nth-child(2),.clarity-card:nth-child(4){transform:translateY(24px)}.clarity-card:nth-child(2):hover,.clarity-card:nth-child(4):hover{transform:translateY(20px)}}
    @media(max-width:759px){.clarity-paths{padding:64px 0 72px}.clarity-grid{grid-template-columns:1fr 1fr}.clarity-card{min-height:160px;padding:15px}.clarity-card strong{font-size:22px}.clarity-card p{font-size:9px}.diagnostic-card-growth:after{font-size:38px;right:14px}}
    @media(max-width:390px){.clarity-grid{grid-template-columns:1fr}.clarity-card{min-height:132px}}
  `;
  document.head.appendChild(clarityStyles);

  const eyebrow = $('.hero .eyebrow');
  if (eyebrow) eyebrow.innerHTML = '<span class="eyebrow-dot"></span> Dados · IA · Automação · Growth Systems';
  const heroParagraph = $('.hero-bottom p');
  if (heroParagraph) heroParagraph.innerHTML = 'Conectamos <strong>dados, sistemas, IA e funis comerciais</strong> para reduzir trabalho manual, melhorar conversão e criar operações que crescem com controle.';
  const heroPrimary = $('.hero .button-primary span');
  if (heroPrimary) heroPrimary.textContent = 'Encontrar oportunidade de ganho';
  const navCtaText = $('.nav-cta');
  if (navCtaText) navCtaText.innerHTML = 'Encontrar oportunidade <span>↗</span>';

  const signalStrip = $('.signal-strip');
  if (signalStrip && !$('.clarity-paths')) {
    const clarity = document.createElement('section');
    clarity.className = 'clarity-paths section';
    clarity.setAttribute('aria-labelledby', 'clarity-title');
    clarity.innerHTML = `
      <div class="shell">
        <div class="clarity-intro">
          <div><small>Onde a LightPath entra?</small><h2 id="clarity-title">Do gargalo ao <em>resultado.</em></h2></div>
          <p>Construímos e conectamos os sistemas que movem uma empresa — da aquisição à operação, do dado à decisão.</p>
        </div>
        <div class="clarity-grid">
          <a class="clarity-card" href="#growth"><small>RECEITA</small><strong>Do clique<br>ao caixa.</strong><p>Mídia, landing, checkout, tracking, CRM e retenção trabalhando juntos.</p></a>
          <a class="clarity-card" href="#solucoes"><small>DECISÃO</small><strong>Do dado<br>à decisão.</strong><p>Integração, pipelines, BI e analytics para enxergar e agir mais rápido.</p></a>
          <a class="clarity-card" href="#solucoes"><small>OPERAÇÃO</small><strong>Da rotina<br>ao sistema.</strong><p>Automação, APIs, integrações e software para tirar trabalho manual do caminho.</p></a>
          <a class="clarity-card" href="#solucoes"><small>INOVAÇÃO</small><strong>Da IA<br>ao produto.</strong><p>Agentes, RAG, copilots e aplicações de IA conectadas ao trabalho real.</p></a>
        </div>
      </div>`;
    signalStrip.insertAdjacentElement('afterend', clarity);
  }

  const problemTitle = $('.problem-sticky h2');
  if (problemTitle) problemTitle.innerHTML = 'O problema raramente é falta de tecnologia. É <em>valor travado entre as peças.</em>';
  const problemCopy = $('.problem-sticky p');
  if (problemCopy) problemCopy.textContent = 'Uma campanha sem tracking, um processo manual, dados espalhados ou IA sem contexto têm algo em comum: dinheiro, tempo e velocidade ficam pelo caminho.';

  const problemCards = $('.problem-cards');
  if (problemCards && !$('.diagnostic-card-growth')) {
    const decisionCard = [...problemCards.querySelectorAll('.diagnostic-card')].find(card => card.textContent.includes('Dados só valem'));
    if (decisionCard) {
      const index = $('.card-index', decisionCard);
      if (index) index.textContent = '05 / DECISÃO';
    }
    const growthCard = document.createElement('article');
    growthCard.className = 'diagnostic-card diagnostic-card-growth reveal tilt-card';
    growthCard.innerHTML = '<span class="card-index">04 / GROWTH</span><div class="card-symbol">↗</div><h3>Se você não sabe onde o funil vaza, otimiza no escuro.</h3><p>Conectamos aquisição, experiência, checkout e dados para descobrir o que realmente aumenta receita.</p><ul><li>Tráfego pago e estratégia de aquisição</li><li>Landing, quiz, oferta e checkout</li><li>Tracking, CRO, CRM e analytics</li></ul><div class="card-footer"><span>Growth Systems</span><i>↗</i></div>';
    problemCards.insertBefore(growthCard, decisionCard || null);
  }

  const buildTitle = $('.build-heading h2');
  if (buildTitle) buildTitle.innerHTML = 'Do gargalo ao <em>sistema que trabalha.</em>';
  const buildCopy = $('.build-heading p');
  if (buildCopy) buildCopy.textContent = 'Podemos melhorar uma peça — tracking, checkout, automação, dados — ou conectar a cadeia inteira. Desenhamos, construímos, integramos e medimos no fluxo real da empresa.';

  const contactTitle = $('.contact-copy h2');
  if (contactTitle) contactTitle.innerHTML = 'Onde sua empresa perde <em>tempo, conversão ou margem?</em>';
  const contactCopy = $('.contact-copy>p');
  if (contactCopy) contactCopy.textContent = 'Mostre onde dói. Nós ajudamos a descobrir onde está o maior ganho antes de propor tecnologia.';
  const submitText = $('.submit-button span');
  if (submitText) submitText.textContent = 'Mapear meu gargalo';

  const objectiveSelect = $('#lead-form select[name="objective"]');
  if (objectiveSelect && ![...objectiveSelect.options].some(option => option.textContent.includes('funil'))) {
    const option = document.createElement('option');
    option.textContent = 'Otimizar funil / Growth System';
    option.value = 'Otimizar funil / Growth System';
    const last = objectiveSelect.lastElementChild;
    objectiveSelect.insertBefore(option, last || null);
  }

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
    heroDemo.innerHTML = 'Ver a LightPath em 2 minutos <span>↗</span>';
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
        <div class="section-kicker reveal"><span>GROWTH</span> Engenharia de crescimento</div>
        <div class="growth-heading reveal">
          <div>
            <span class="growth-overline">ANÚNCIO → LANDING → CHECKOUT → PAGAMENTO → RETENÇÃO</span>
            <h2>Do clique ao caixa.<br><em>Onde o valor vaza?</em></h2>
          </div>
          <p>Você investe para trazer uma pessoa. Entre o anúncio e o dinheiro no caixa, muita coisa pode quebrar. <strong>Nós conectamos e medimos o caminho inteiro</strong> para descobrir o que otimizar primeiro.</p>
        </div>

        <div class="growth-console reveal">
          <div class="growth-console-head"><span>LIGHTPATH / REVENUE SYSTEM</span><span class="growth-live"><i></i> CAMINHO ATIVO</span></div>
          <div class="growth-machine" aria-label="Arquitetura comercial integrada">
            <button class="growth-node is-active" type="button" data-growth="acquisition"><small>01</small><b>MÍDIA</b><span>Meta · Google · criativos</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="conversion"><small>02</small><b>LANDING / QUIZ</b><span>mensagem · UX · segmentação</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="checkout"><small>03</small><b>CHECKOUT</b><span>oferta · pagamento · recovery</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="truth"><small>04</small><b>PEDIDO</b><span>venda real · pagamento · CRM</span></button>
            <i class="growth-link"><span></span></i>
            <button class="growth-node" type="button" data-growth="retention"><small>05</small><b>RETENÇÃO</b><span>members · CRM · lifecycle</span></button>
          </div>
          <div class="growth-data-rail"><span>RASTREAMENTO — O QUE LIGA A ORIGEM AO RESULTADO</span><b>UTM</b><b>event_id</b><b>Meta / CAPI</b><b>GA4</b><b>webhooks</b><b>reconciliação</b></div>
          <div class="growth-insight" id="growth-insight">
            <div><small>O QUE PERGUNTAMOS</small><strong id="growth-insight-title">O anúncio trouxe comprador — ou só clique?</strong></div>
            <p id="growth-insight-copy">Seguimos o caminho até o pedido real para separar tráfego barato de aquisição que gera receita.</p>
            <span id="growth-insight-kpi">Medimos → CAC · receita · qualidade do tráfego</span>
          </div>
        </div>

        <div class="growth-case reveal">
          <div class="growth-case-copy">
            <span class="growth-case-label">BUSINESS CASE · DIGITAL COMMERCE</span>
            <h3>Quando o funil deixa de ser um conjunto de ferramentas e vira um sistema.</h3>
            <p>Mídia, landing/quiz, checkout, pagamento, acesso ao produto e analytics conectados. Assim fica possível enxergar <strong>onde a receita entra, onde ela vaza e qual mudança merece o próximo investimento.</strong></p>
          </div>
          <div class="growth-case-grid">
            <article><span>ANTES</span><b>Cada ferramenta conta uma história.</b><p>Métricas divergentes e pouca confiança para saber se o problema está no anúncio, página, checkout ou oferta.</p></article>
            <article><span>SISTEMA</span><b>Um caminho rastreável.</b><p>Sessão, campanha, checkout, pedido e eventos conectados para reconstruir a jornada comercial de ponta a ponta.</p></article>
            <article><span>VALOR</span><b>O próximo teste deixa de ser chute.</b><p>Decisões de mídia, criativo, landing, checkout e oferta passam a usar resultado comercial real.</p></article>
          </div>
        </div>

        <div class="growth-capabilities reveal">
          <span>Tráfego pago</span><span>Criativos & testes</span><span>Landing & quiz</span><span>Checkout & oferta</span><span>Tracking & CAPI</span><span>CRO</span><span>CRM & lifecycle</span><span>Growth analytics</span>
        </div>
      </div>`;
    methodSection.parentNode.insertBefore(growth, methodSection);
  }

  const growthData = {
    acquisition: ['O anúncio trouxe comprador — ou só clique?', 'Seguimos o caminho até o pedido real para separar tráfego barato de aquisição que gera receita.', 'Medimos → CAC · receita · qualidade do tráfego'],
    conversion: ['A pessoa chegou. Por que não avançou?', 'Mensagem, UX, quiz e segmentação são avaliados pelo avanço real no funil — não por preferência estética.', 'Medimos → visita→checkout · intenção · abandono'],
    checkout: ['Ela quis comprar. Onde a venda morreu?', 'Oferta, pagamento, recuperação e tracking precisam funcionar como uma única etapa comercial.', 'Medimos → checkout→pagamento · aprovação · perda'],
    truth: ['Qual venda aconteceu de verdade?', 'Reconciliamos pedido e pagamento com sessão e campanha para não deixar evento incompleto governar a mídia.', 'Medimos → compra real · deduplicação · atribuição'],
    retention: ['A receita não termina na compra.', 'Acesso, members, CRM, lifecycle e suporte fecham o loop entre aquisição, entrega e retenção.', 'Medimos → ativação · retenção · LTV']
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
    demo.innerHTML = '<span><small>APRESENTAÇÃO INTERATIVA</small><strong>Veja como pensamos um gargalo até virar resultado.</strong><p>Uma experiência clicável de impacto, arquitetura, growth e diagnóstico — sem deck de 40 slides.</p></span><i>ABRIR ↗</i>';
    commandCenterForDemo.insertAdjacentElement('afterend', demo);
  }

  const scannerOptionsHost = $('.scanner-options');
  if (scannerOptionsHost && !scannerOptionsHost.querySelector('[data-signal="receita"]')) {
    const revenueOption = document.createElement('button');
    revenueOption.className = 'scanner-option';
    revenueOption.type = 'button';
    revenueOption.dataset.signal = 'receita';
    revenueOption.innerHTML = '<small>06</small><strong>Receita / conversão</strong>';
    scannerOptionsHost.appendChild(revenueOption);
  }

  const stageMap = [
    { selector: '.hero', key: 'chaos', label: 'POTENCIAL' },
    { selector: '.clarity-paths', key: 'paths', label: 'CAMINHOS' },
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
      else if (key === 'structure' || key === 'flow' || key === 'revenue' || key === 'paths') { p.x = -30 - Math.random() * 100; p.y = Math.random() * height; }
      else { p.x = Math.random() * width; p.y = Math.random() * height; }
      p.px = p.x; p.py = p.y; p.age = 0; p.seed = Math.random() * 20;
    };

    const vector = p => {
      const key = activeStage?.key || 'chaos';
      const nx = p.x / Math.max(width, 1), ny = p.y / Math.max(height, 1);
      let angle = -1.1, boost = 1;
      if (key === 'chaos') { angle = -1.05 + Math.sin(nx * 8 + time * .00045 + p.seed) * .52 + Math.cos(ny * 5 - time * .00025) * .22; boost = .75; }
      else if (key === 'paths') { angle = -.48 + Math.sin(p.seed + time * .00025) * .1; boost = .96; }
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
    ['clarity-paths', 'CAMINHOS'], ['problem', 'GARGALO'], ['build-section', 'SISTEMA'], ['business-cases', 'IMPACTO'], ['growth-systems', 'RECEITA'], ['method', 'FLUXO'], ['proof-section', 'RESULTADO'], ['fit-section', 'DECISÃO'], ['scanner-section', 'DIAGNÓSTICO'], ['contact-section', 'ESCALA']
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
    decisao: { title: 'Analytics + IA aplicada', copy: 'Reduzimos a distância entre o evento e a decisão com dados confiáveis, alertas, modelos e interfaces orientadas ao próximo movimento.', kpis: ['latência decisória', 'qualidade', 'forecast'], objective: 'Analytics / Data Science' },
    receita: { title: 'Growth System / funil comercial', copy: 'Seguimos a jornada do anúncio ao pagamento para descobrir onde conversão e receita estão vazando — e qual teste deve vir primeiro.', kpis: ['CAC', 'conversão', 'receita por visita'], objective: 'Otimizar funil / Growth System' }
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
