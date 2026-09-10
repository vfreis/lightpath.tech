(() => {
  'use strict';
  const root=document.getElementById('story'); if(!root)return;

  /* Final conversion scene: created before the scene registry so it behaves
     exactly like every other slide for wheel, swipe, dots, keyboard and arrows. */
  const ensureCtaScene=()=>{
    if(root.querySelector('[data-scene="cta"]'))return;
    const scene=document.createElement('section');
    scene.className='scene scene--cta';
    scene.dataset.scene='cta';
    scene.setAttribute('aria-labelledby','scene-cta-title');
    scene.innerHTML=`
      <div class="scene-inner cta-final-layout">
        <div class="cta-final-copy">
          <span class="scene-kicker" data-i18n="cta.kicker">10 / PRÓXIMO PASSO</span>
          <h2 id="scene-cta-title"><span data-i18n="cta.a">Vamos encontrar</span> <em data-i18n="cta.b">seu próximo ganho?</em></h2>
          <p data-i18n="cta.copy">Se existe um gargalo de receita, operação, dados ou decisão, nós podemos mapear o caminho e transformar em sistema.</p>
          <div class="cta-final-actions">
            <a href="../#contato" class="primary-action"><span data-i18n="cta.primary">Entre em contato</span> <b>↗</b></a>
            <a href="https://br.linkedin.com/in/vfalqueiroreis" target="_blank" rel="noopener noreferrer" class="cta-final-secondary"><span data-i18n="cta.secondary">Falar pelo LinkedIn</span> <b>↗</b></a>
          </div>
          <small class="cta-final-note" data-i18n="cta.note">LightPath Tecnologia · Dados · IA · Automação · Growth Systems</small>
        </div>
        <div class="cta-final-visual" aria-hidden="true">
          <svg viewBox="0 0 560 520" fill="none">
            <defs><linearGradient id="ctaGrad" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#70f4d0"/><stop offset="1" stop-color="#b7ff37"/></linearGradient></defs>
            <circle class="cta-ring cta-ring-a" cx="298" cy="254" r="176"/>
            <circle class="cta-ring cta-ring-b" cx="298" cy="254" r="116"/>
            <path class="cta-mountain" d="M72 396 183 249l69 79 94-159 122 227"/>
            <path class="cta-vector cta-vector-a" d="M104 377 C177 331 202 282 246 221"/>
            <path class="cta-vector cta-vector-b" d="M206 360 C283 307 325 250 363 183"/>
            <path class="cta-vector cta-vector-c" d="M309 337 C369 289 411 232 447 170"/>
            <circle class="cta-pulse" cx="447" cy="170" r="7"/>
          </svg>
          <div class="cta-final-signal"><span>DATA</span><span>AI</span><span>AUTOMATION</span><span>GROWTH</span></div>
        </div>
      </div>`;
    root.appendChild(scene);

    if(!document.getElementById('lp-presentation-cta-style')){
      const style=document.createElement('style');
      style.id='lp-presentation-cta-style';
      style.textContent=`
        .scene--cta{background:radial-gradient(circle at 77% 42%,rgba(183,255,55,.075),transparent 30%),linear-gradient(135deg,rgba(112,244,208,.018),transparent 45%)}
        .cta-final-layout{display:grid;grid-template-columns:minmax(0,.92fr) minmax(320px,1.08fr);align-items:center;gap:clamp(32px,6vw,90px);max-width:1220px}
        .cta-final-copy{display:flex;flex-direction:column;align-items:flex-start;gap:clamp(12px,2.2vh,22px);min-width:0}
        .cta-final-copy h2{margin:0;font-size:clamp(44px,5.25vw,78px);line-height:.91;letter-spacing:-.062em;max-width:760px}
        .cta-final-copy h2 em{font-style:normal;color:var(--accent,#b7ff37)}
        .cta-final-copy>p{margin:0;max-width:610px;color:var(--muted,#9ba3a6);font-size:clamp(13px,1.05vw,17px);line-height:1.62}
        .cta-final-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px}
        .cta-final-secondary{min-height:48px;padding:0 18px;border:1px solid rgba(255,255,255,.13);border-radius:999px;color:#fff;display:inline-flex;align-items:center;gap:18px;font:700 10px/1 Manrope,sans-serif;letter-spacing:.02em;transition:.25s ease}
        .cta-final-secondary:hover{border-color:rgba(183,255,55,.5);background:rgba(183,255,55,.055);transform:translateY(-2px)}
        .cta-final-secondary b{color:#b7ff37;font-size:14px}
        .cta-final-note{color:rgba(255,255,255,.35);font:700 7px/1.3 Manrope,sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-top:4px}
        .cta-final-visual{position:relative;display:grid;place-items:center;min-height:0;height:min(54vh,480px)}
        .cta-final-visual svg{width:min(100%,520px);height:100%;overflow:visible;filter:drop-shadow(0 0 30px rgba(183,255,55,.055))}
        .cta-ring{stroke:rgba(183,255,55,.1);stroke-width:1;stroke-dasharray:4 12}.cta-ring-b{stroke:rgba(112,244,208,.12)}
        .cta-mountain,.cta-vector{stroke:url(#ctaGrad);stroke-linecap:round;stroke-linejoin:round}.cta-mountain{stroke-width:2.4;opacity:.72}.cta-vector{stroke-width:2.1;filter:drop-shadow(0 0 7px rgba(183,255,55,.38))}.cta-pulse{fill:#b7ff37;filter:drop-shadow(0 0 10px rgba(183,255,55,.85))}
        .cta-final-signal{position:absolute;left:50%;bottom:5%;transform:translateX(-50%);display:flex;gap:6px;flex-wrap:wrap;justify-content:center;width:100%}.cta-final-signal span{padding:6px 8px;border:1px solid rgba(255,255,255,.08);border-radius:999px;color:rgba(255,255,255,.48);font:700 6px/1 Manrope,sans-serif;letter-spacing:.1em}
        .scene--cta.is-active .cta-ring-a{animation:ctaSpin 24s linear infinite}.scene--cta.is-active .cta-ring-b{animation:ctaSpinReverse 19s linear infinite}.scene--cta.is-active .cta-pulse{animation:ctaPulse 1.55s ease-in-out infinite alternate}
        @keyframes ctaSpin{to{transform:rotate(360deg);transform-origin:298px 254px}}@keyframes ctaSpinReverse{to{transform:rotate(-360deg);transform-origin:298px 254px}}@keyframes ctaPulse{to{r:10;opacity:.55}}
        @media(max-width:759px){.cta-final-layout{grid-template-columns:1fr;grid-template-rows:auto minmax(150px,1fr);gap:8px;text-align:left;align-content:center}.cta-final-copy{gap:10px}.cta-final-copy h2{font-size:clamp(32px,10.2vw,46px);max-width:94%}.cta-final-copy>p{font-size:10px;line-height:1.45;max-width:95%}.cta-final-actions{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:7px}.cta-final-actions .primary-action,.cta-final-secondary{width:100%;min-height:42px;height:42px;padding:0 12px;justify-content:space-between;font-size:8px}.cta-final-note{font-size:5.5px}.cta-final-visual{height:min(31vh,260px)}.cta-final-visual svg{width:min(78vw,310px)}.cta-final-signal{bottom:0}.cta-final-signal span{font-size:5px;padding:5px 6px}}
        @media(max-width:430px){.cta-final-actions{grid-template-columns:1fr}.cta-final-visual{height:min(27vh,220px)}}
        @media(max-height:690px) and (min-width:760px){.cta-final-copy h2{font-size:clamp(40px,4.7vw,62px)}.cta-final-copy>p{font-size:12px}.cta-final-visual{height:min(48vh,360px)}}
        @media(prefers-reduced-motion:reduce){.scene--cta.is-active .cta-ring-a,.scene--cta.is-active .cta-ring-b,.scene--cta.is-active .cta-pulse{animation:none}}
      `;
      document.head.appendChild(style);
    }
  };
  ensureCtaScene();

  const scenes=[...document.querySelectorAll('.scene')],prev=document.getElementById('prev-scene'),next=document.getElementById('next-scene'),bar=document.getElementById('story-progress-bar'),num=document.getElementById('scene-number'),dotsRoot=document.getElementById('scene-dots');
  const total=document.querySelector('.app-status span:last-child'); if(total)total.textContent=String(scenes.length).padStart(2,'0');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current=0,transitioning=false,touchX=0,touchY=0;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const lang=()=>window.LIGHTPATH_LANGUAGE||(localStorage.getItem('lightpath-language')==='en'?'en':'pt');
  const L=(pt,en)=>lang()==='en'?en:pt;

  const syncViewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--vh',`${Math.round(v?v.height:innerHeight)}px`)};
  syncViewport(); addEventListener('resize',syncViewport,{passive:true}); visualViewport?.addEventListener('resize',syncViewport,{passive:true});

  const dots=scenes.map((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Cena ${i+1}`);b.addEventListener('click',()=>goTo(i));dotsRoot?.appendChild(b);return b});
  const chrome=()=>{if(num)num.textContent=String(current+1).padStart(2,'0');if(bar)bar.style.transform=`scaleX(${(current+1)/scenes.length})`;if(prev)prev.disabled=current===0;if(next)next.disabled=current===scenes.length-1;dots.forEach((d,i)=>d.classList.toggle('is-active',i===current))};

  const animateEntry=scene=>{if(reduced||!window.gsap)return;const items=[...scene.querySelector('.scene-inner')?.children||[]];gsap.killTweensOf(items);gsap.fromTo(items,{opacity:0,y:14},{opacity:1,y:0,duration:.48,stagger:.055,ease:'power3.out',clearProps:'transform'});const vectors=scene.querySelectorAll('.hero-vector .vector,.cta-final-visual .cta-vector');if(vectors.length){gsap.set(vectors,{strokeDasharray:500,strokeDashoffset:500});gsap.to(vectors,{strokeDashoffset:0,duration:1.1,stagger:.12,ease:'power2.inOut'})}scene.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';const s={v:0};gsap.to(s,{v:target,duration:.9,ease:'power3.out',onUpdate:()=>el.textContent=`${prefix}${Math.round(s.v)}${suffix}`,onComplete:()=>el.textContent=`${prefix}${target}${suffix}`})})};

  function goTo(target){target=clamp(target,0,scenes.length-1);if(target===current||transitioning)return false;const from=current,out=scenes[from],inc=scenes[target],dir=target>from?1:-1;transitioning=true;current=target;chrome();inc.classList.add('is-active');inc.setAttribute('aria-hidden','false');
    if(reduced||!window.gsap){out.classList.remove('is-active');out.setAttribute('aria-hidden','true');animateEntry(inc);transitioning=false;return true}
    gsap.killTweensOf([out,inc]);gsap.set(inc,{xPercent:dir*100,opacity:.3,visibility:'visible'});gsap.set(out,{xPercent:0,opacity:1,visibility:'visible'});gsap.timeline({onComplete:()=>{out.classList.remove('is-active');out.setAttribute('aria-hidden','true');scenes.forEach((s,i)=>{if(i!==current)s.classList.remove('is-active')});gsap.set([out,inc],{clearProps:'transform,opacity,visibility'});animateEntry(inc);transitioning=false}}).to(out,{xPercent:-dir*22,opacity:0,duration:.38,ease:'power3.inOut'},0).to(inc,{xPercent:0,opacity:1,duration:.48,ease:'power4.out'},.02);return true}
  const goNext=()=>goTo(current+1),goPrev=()=>goTo(current-1);next?.addEventListener('click',goNext);prev?.addEventListener('click',goPrev);document.querySelectorAll('.js-next').forEach(b=>b.addEventListener('click',goNext));

  /* One physical wheel/trackpad gesture = one scene. No second wheel controller. */
  let wheelLocked=false,wheelSum=0,wheelDir=0,wheelIdle=null;
  const resetWheel=()=>{wheelLocked=false;wheelSum=0;wheelDir=0};
  const norm=e=>{let d=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(e.deltaMode===1)d*=16;if(e.deltaMode===2)d*=Math.max(innerHeight,1);return d};
  addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();const d=norm(e);if(Math.abs(d)<.55)return;clearTimeout(wheelIdle);wheelIdle=setTimeout(resetWheel,125);if(transitioning){wheelLocked=true;return}if(wheelLocked)return;const dir=Math.sign(d);if(wheelDir&&dir!==wheelDir)wheelSum=0;wheelDir=dir;wheelSum+=d;if(Math.abs(wheelSum)<32)return;wheelLocked=true;wheelSum=0;dir>0?goNext():goPrev()},{capture:true,passive:false});

  addEventListener('keydown',e=>{const t=e.target?.tagName?.toLowerCase();if(['input','textarea','select'].includes(t))return;if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();goNext()}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goPrev()}else if(e.key==='Home')goTo(0);else if(e.key==='End')goTo(scenes.length-1)});
  root.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchX=t.clientX;touchY=t.clientY},{passive:true});root.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});root.addEventListener('touchend',e=>{if(transitioning)return;const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.max(Math.abs(dx),Math.abs(dy))<42)return;(Math.abs(dx)>=Math.abs(dy)?dx:dy)<0?goNext():goPrev()},{passive:true});

  const impact={custo:{pt:['MENOS CUSTO','menos handoffs · retrabalho · operação manual'],en:['LOWER COST','fewer handoffs · rework · manual work']},decisao:{pt:['MAIS VELOCIDADE','dado confiável no momento da decisão'],en:['MORE SPEED','trusted data at the moment of decision']},escala:{pt:['MAIS ESCALA','crescimento sem multiplicar esforço humano'],en:['MORE SCALE','growth without multiplying human effort']}};
  const renderImpact=key=>{const d=impact[key][lang()];document.getElementById('impact-core-title').textContent=d[0];document.getElementById('impact-core-sub').textContent=d[1]};document.querySelectorAll('[data-impact]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-impact]').forEach(x=>x.classList.toggle('is-selected',x===b));renderImpact(b.dataset.impact)}));

  const bottleneck={dados:{pt:['DATA FOUNDATION','Integrar fontes, criar contratos e tornar o dado confiável antes de acelerar analytics ou IA.','Métrica → latência + qualidade'],en:['DATA FOUNDATION','Integrate sources, create contracts and make data reliable before accelerating analytics or AI.','Metric → latency + quality']},processo:{pt:['AUTOMATION LAYER','Remover passos repetitivos e conectar eventos, integrações e observabilidade.','Métrica → horas + retrabalho'],en:['AUTOMATION LAYER','Remove repetitive steps and connect events, integrations and observability.','Metric → hours + rework']},decisao:{pt:['DECISION LAYER','Levar indicador, alerta ou modelo até o ponto em que a decisão acontece.','Métrica → tempo de decisão + acurácia'],en:['DECISION LAYER','Bring an indicator, alert or model to the exact point where the decision happens.','Metric → decision time + accuracy']},ia:{pt:['AI OPERATIONS','Conectar modelo a contexto, ferramentas, guardrails e uma métrica de valor.','Métrica → tarefa resolvida + qualidade'],en:['AI OPERATIONS','Connect the model to context, tools, guardrails and a value metric.','Metric → task solved + quality']}};
  const renderBottleneck=key=>{const d=bottleneck[key][lang()];document.getElementById('bottleneck-solution').textContent=d[0];document.getElementById('bottleneck-copy').textContent=d[1];document.getElementById('bottleneck-metric').textContent=d[2]};document.querySelectorAll('[data-bottleneck]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-bottleneck]').forEach(x=>x.classList.toggle('is-selected',x===b));renderBottleneck(b.dataset.bottleneck)}));

  const solution={data:{pt:['DATA / 01','Data Platform','Base confiável para decidir, automatizar e escalar.','Pipelines · lakehouse · qualidade · observabilidade'],en:['DATA / 01','Data Platform','A reliable foundation to decide, automate and scale.','Pipelines · lakehouse · quality · observability']},ai:{pt:['AI / 02','AI Operations','IA conectada ao contexto e ao trabalho real da empresa.','RAG · agentes · copilots · avaliação'],en:['AI / 02','AI Operations','AI connected to the company context and real work.','RAG · agents · copilots · evaluation']},automation:{pt:['AUTO / 03','Automation','Processos que deixam de depender de memória e acompanhamento.','APIs · webhooks · eventos · filas · alertas'],en:['AUTO / 03','Automation','Processes that stop depending on memory and follow-up.','APIs · webhooks · events · queues · alerts']},analytics:{pt:['DECISION / 04','Analytics & DS','Dados que apontam o próximo movimento da operação.','KPIs · BI · forecast · segmentação · otimização'],en:['DECISION / 04','Analytics & DS','Data that points to the next operational move.','KPIs · BI · forecast · segmentation · optimization']}};
  const renderSolution=key=>{const d=solution[key][lang()];['solution-code','solution-title','solution-copy','solution-stack'].forEach((id,i)=>document.getElementById(id).textContent=d[i])};document.querySelectorAll('[data-solution]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-solution]').forEach(x=>x.classList.toggle('is-selected',x===b));renderSolution(b.dataset.solution)}));

  document.querySelectorAll('[data-arch]').forEach((b,i)=>b.addEventListener('click',()=>document.querySelectorAll('[data-arch]').forEach((x,j)=>x.classList.toggle('is-live',j<=i))));

  const growth={media:{pt:['Aquisição com feedback de negócio.','Criativo e mídia precisam ser avaliados até o pedido real — não só pelo clique.','Decisão → CAC · receita · qualidade do tráfego'],en:['Acquisition with business feedback.','Creative and media should be evaluated through the real order — not only the click.','Decision → CAC · revenue · traffic quality']},landing:{pt:['Conversão tratada como sistema.','Mensagem, UX, quiz e roteamento são medidos por avanço real no funil.','Decisão → visita · intenção · abandono'],en:['Conversion treated as a system.','Message, UX, quiz and routing are measured by real funnel progression.','Decision → visit · intent · abandonment']},checkout:{pt:['Checkout como infraestrutura de receita.','Oferta, pagamento e recovery precisam funcionar juntos e continuar rastreáveis.','Decisão → checkout · aprovação · perda'],en:['Checkout as revenue infrastructure.','Offer, payment and recovery must work together and remain traceable.','Decision → checkout · approval · loss']},order:{pt:['Uma verdade comercial confiável.','Pedido e pagamento são reconciliados com sessão, campanha e eventos.','Decisão → compra real · deduplicação · atribuição'],en:['A reliable commercial truth.','Order and payment are reconciled with session, campaign and events.','Decision → real purchase · deduplication · attribution']},lifecycle:{pt:['Receita continua depois da compra.','Entrega, CRM e lifecycle fecham o loop entre aquisição, experiência e retenção.','Decisão → ativação · retenção · LTV'],en:['Revenue continues after purchase.','Delivery, CRM and lifecycle close the loop between acquisition, experience and retention.','Decision → activation · retention · LTV']}};
  const renderGrowth=key=>{const d=growth[key][lang()];document.getElementById('growth-insight-title').textContent=d[0];document.getElementById('growth-insight-copy').textContent=d[1];document.getElementById('growth-insight-kpi').textContent=d[2]};document.querySelectorAll('[data-growth-step]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-growth-step]').forEach(x=>x.classList.toggle('is-selected',x===b));renderGrowth(b.dataset.growthStep)}));

  const method=[{pt:['DIAGNÓSTICO','Mapeamos onde o valor está travado.','Mapa de oportunidades priorizado'],en:['DIAGNOSIS','We map where value is stuck.','Prioritized opportunity map']},{pt:['DESENHO','Escolhemos a menor arquitetura que resolve.','Arquitetura + plano de execução'],en:['DESIGN','We choose the smallest architecture that solves it.','Architecture + execution plan']},{pt:['IMPLEMENTAÇÃO','Construímos para uso real, não para demo.','Solução em produção'],en:['IMPLEMENTATION','We build for real use, not for a demo.','Solution in production']},{pt:['OTIMIZAÇÃO','Medimos o que mudou e ampliamos o ganho.','ROI operacional + próximos ganhos'],en:['OPTIMIZATION','We measure what changed and expand the gain.','Operational ROI + next gains']}];
  const renderMethod=i=>{const d=method[i][lang()];document.getElementById('method-tag').textContent=d[0];document.getElementById('method-title').textContent=d[1];document.getElementById('method-output').textContent=d[2]};document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-method]').forEach(x=>x.classList.toggle('is-selected',x===b));renderMethod(Number(b.dataset.method))}));

  const proof={scale:{pt:['Capacidade para crescer sem linearizar infraestrutura.','Pipelines distribuídos e runtime otimizado transformam volume em capacidade previsível.'],en:['Capacity to grow without linear infrastructure growth.','Distributed pipelines and optimized runtime turn volume into predictable capacity.']},auto:{pt:['Rotina deixa de consumir atenção humana.','Orquestração recorrente reduz intervenção, dependência de memória e risco.'],en:['Routine stops consuming human attention.','Recurring orchestration reduces intervention, memory dependency and risk.']},manual:{pt:['Software absorve trabalho antes feito por pessoas.','Serviços de ingestão substituem coleta e movimentação manual.'],en:['Software absorbs work previously done by people.','Ingestion services replace manual collection and movement.']},ops:{pt:['Informação chega mais perto da decisão.','SQL, BI e automação reduzem latência operacional e aumentam previsibilidade.'],en:['Information gets closer to the decision.','SQL, BI and automation reduce operational latency and increase predictability.']}};
  const renderProof=key=>{const d=proof[key][lang()];document.getElementById('proof-title').textContent=d[0];document.getElementById('proof-copy').textContent=d[1]};document.querySelectorAll('[data-proof]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-proof]').forEach(x=>x.classList.toggle('is-selected',x===b));renderProof(b.dataset.proof)}));

  const ai={pt:['Contexto entra. A análise começa com dados estruturados.','O modelo executa dentro de um fluxo controlado — não isolado.','A saída vira contrato estruturado para software e operação.','Eventos e outcomes fecham o loop para medir qualidade e valor.'],en:['Context enters. Analysis starts with structured data.','The model runs inside a controlled flow — not in isolation.','The output becomes a structured contract for software and operations.','Events and outcomes close the loop to measure quality and value.']};
  let aiIndex=0;const renderAI=i=>{aiIndex=i;document.getElementById('ai-message').textContent=ai[lang()][i];document.querySelectorAll('[data-ai-step]').forEach((x,j)=>x.classList.toggle('is-active',j<=i))};document.querySelectorAll('[data-ai-step]').forEach(b=>b.addEventListener('click',()=>renderAI(Number(b.dataset.aiStep))));

  const diagnostic={manual:{pt:['AUTOMATION FIRST','Mapear passos, horas e handoffs. Automatizar o trecho recorrente com menor risco.','Medir → horas recuperadas · retrabalho · SLA'],en:['AUTOMATION FIRST','Map steps, hours and handoffs. Automate the recurring, lower-risk segment first.','Measure → recovered hours · rework · SLA']},data:{pt:['DATA FOUNDATION FIRST','Criar uma camada confiável antes de multiplicar dashboards ou IA.','Medir → latência · qualidade · disponibilidade'],en:['DATA FOUNDATION FIRST','Create a reliable layer before multiplying dashboards or AI.','Measure → latency · quality · availability']},decision:{pt:['DECISION LAYER FIRST','Levar informação, alerta ou modelo até a decisão que hoje acontece tarde.','Medir → lead time · acurácia · perda evitada'],en:['DECISION LAYER FIRST','Bring information, alerts or models to the decision that happens too late today.','Measure → lead time · accuracy · avoided loss']},ai:{pt:['USE CASE FIRST','Escolher uma tarefa real, definir baseline e provar valor antes de ampliar IA.','Medir → tarefa resolvida · qualidade · custo'],en:['USE CASE FIRST','Choose a real task, define a baseline and prove value before expanding AI.','Measure → task solved · quality · cost']},scale:{pt:['ARCHITECTURE FIRST','Encontrar o componente que cresce linearmente com pessoas, volume ou custo.','Medir → throughput · custo marginal · capacidade'],en:['ARCHITECTURE FIRST','Find the component that grows linearly with people, volume or cost.','Measure → throughput · marginal cost · capacity']}};
  let diagnosticKey=null;const renderDiagnostic=key=>{if(!key)return;diagnosticKey=key;const d=diagnostic[key][lang()],r=document.getElementById('diagnostic-result');r.innerHTML=`<small>${d[0]}</small><strong>${d[1]}</strong><p>${d[2]}</p>`};document.querySelectorAll('[data-diagnostic]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-diagnostic]').forEach(x=>x.classList.toggle('is-selected',x===b));renderDiagnostic(b.dataset.diagnostic)}));

  addEventListener('lightpath:languagechange',()=>{const a=document.querySelector('[data-impact].is-selected');if(a)renderImpact(a.dataset.impact);const b=document.querySelector('[data-bottleneck].is-selected');if(b)renderBottleneck(b.dataset.bottleneck);const s=document.querySelector('[data-solution].is-selected');if(s)renderSolution(s.dataset.solution);const g=document.querySelector('[data-growth-step].is-selected');if(g)renderGrowth(g.dataset.growthStep);const m=document.querySelector('[data-method].is-selected');if(m)renderMethod(Number(m.dataset.method));const p=document.querySelector('[data-proof].is-selected');if(p)renderProof(p.dataset.proof);renderAI(aiIndex);if(diagnosticKey)renderDiagnostic(diagnosticKey)});

  const setupField=()=>{if(reduced)return;const canvas=document.getElementById('vector-field'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return;let w=0,h=0,dpr=1,last=0;const traces=[];const mobile=()=>innerWidth<760;const resize=()=>{const v=visualViewport;w=v?v.width:innerWidth;h=v?v.height:innerHeight;dpr=Math.min(mobile()?1:1.2,devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);traces.length=0;for(let i=0;i<(mobile()?10:24);i++)traces.push({x:Math.random()*w,y:Math.random()*h,s:.35+Math.random()*.6,a:Math.random()*6})};const draw=t=>{requestAnimationFrame(draw);if(document.hidden||t-last<(mobile()?48:24))return;last=t;ctx.clearRect(0,0,w,h);traces.forEach((p,i)=>{const ox=p.x,oy=p.y,ang=-.92+Math.sin(p.x*.006+t*.00035+p.a)*.22;p.x+=Math.cos(ang)*p.s;p.y+=Math.sin(ang)*p.s;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(p.x,p.y);ctx.strokeStyle=`rgba(${i%4===0?'183,255,55':'112,244,208'},${mobile()?.05:.085})`;ctx.lineWidth=.65;ctx.stroke();if(p.y<-30||p.x>w+40||p.x<-40){p.x=Math.random()*w;p.y=h+30}})};resize();addEventListener('resize',resize,{passive:true});visualViewport?.addEventListener('resize',resize,{passive:true});requestAnimationFrame(draw)};

  scenes.forEach((s,i)=>s.setAttribute('aria-hidden',i?'true':'false'));chrome();animateEntry(scenes[0]);setupField();root.focus({preventScroll:true});
})();