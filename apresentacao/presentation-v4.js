(() => {
  'use strict';
  const root=document.getElementById('story');if(!root)return;
  const scenes=[...document.querySelectorAll('.scene')],prev=document.getElementById('prev-scene'),next=document.getElementById('next-scene'),bar=document.getElementById('story-progress-bar'),num=document.getElementById('scene-number'),total=document.getElementById('scene-total'),dotsRoot=document.getElementById('scene-dots');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current=0,transitioning=false,touchX=0,touchY=0,methodIndex=0,aiIndex=0,diagnosticKey=null;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const language=()=>window.LightPathPresentationI18n?.lang==='en'?'en':'pt';

  /* Linguistic QA: these are natural-language terms, not product names or
     technical acronyms. Keep API/RAG/GA4/CAPI/CRM/SQL/AWS/BI/ROI unchanged. */
  const QA={
    pt:{
      keyed:{
        'hero.badge':'DADOS · IA · AUTOMAÇÃO · CRESCIMENTO',
        'impact.cost.sub':'menos repasses · retrabalho · operação manual',
        'diagnosis.data.copy':'Integrar fontes, criar contratos e tornar o dado confiável antes de acelerar análises ou IA.',
        'diagnosis.ai.copy':'Conectar o modelo a contexto, ferramentas, salvaguardas e uma métrica de valor.',
        'solution.analytics.title':'Análises & Ciência de Dados',
        'solution.analytics.stack':'KPIs · BI · previsão · segmentação · otimização',
        'growth.kicker':'05 / SISTEMAS DE CRESCIMENTO',
        'growth.lifecycleSub':'área de membros · CRM',
        'growth.checkout.title':'Checkout como infraestrutura de receita.',
        'proof.scale.copy':'Pipelines distribuídos e tempo de execução otimizado transformam volume em capacidade previsível.',
        'ai.b':'à produção.',
        'discovery.kicker':'09 / DESCOBERTA',
        'diagnostic.manual.copy':'Mapear passos, horas e repasses. Automatizar primeiro o trecho recorrente de menor risco.',
        'diagnostic.data.copy':'Criar uma camada confiável antes de multiplicar painéis ou IA.',
        'diagnostic.decision.metric':'Medir → tempo de ciclo · acurácia · perda evitada',
        'diagnostic.ai.copy':'Escolher uma tarefa real, definir uma linha de base e provar valor antes de ampliar IA.',
        'diagnostic.scale.metric':'Medir → capacidade de processamento · custo marginal · capacidade',
        'cta.badge':'DADOS · IA · AUTOMAÇÃO · CRESCIMENTO'
      },
      static:{
        '[data-growth-step="landing"] b':'PÁGINA',
        '[data-ai-step="2"] b':'JSON estruturado',
        '[data-ai-step="3"] span':'RASTREAMENTO'
      }
    },
    en:{keyed:{},static:{'[data-growth-step="landing"] b':'LANDING','[data-ai-step="2"] b':'structured JSON','[data-ai-step="3"] span':'TRACKING'}}
  };
  const T=key=>QA[language()].keyed[key]??window.LightPathPresentationI18n?.t(key)??key;
  const applyTerminology=()=>{
    const cfg=QA[language()];
    Object.entries(cfg.keyed).forEach(([key,value])=>document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>el.textContent=value));
    Object.entries(cfg.static).forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>el.textContent=value));
  };

  if(total)total.textContent=String(scenes.length).padStart(2,'0');
  const syncViewport=()=>{const v=visualViewport;document.documentElement.style.setProperty('--vh',`${Math.round(v?v.height:innerHeight)}px`)};
  syncViewport();addEventListener('resize',syncViewport,{passive:true});visualViewport?.addEventListener('resize',syncViewport,{passive:true});

  const dots=scenes.map((_,i)=>{const b=document.createElement('button');b.type='button';b.addEventListener('click',()=>goTo(i));dotsRoot?.appendChild(b);return b});
  const syncA11y=()=>dots.forEach((b,i)=>b.setAttribute('aria-label',`${T('chrome.scene')} ${i+1}`));
  const chrome=()=>{if(num)num.textContent=String(current+1).padStart(2,'0');if(bar)bar.style.transform=`scaleX(${(current+1)/scenes.length})`;if(prev)prev.disabled=current===0;if(next)next.disabled=current===scenes.length-1;dots.forEach((d,i)=>d.classList.toggle('is-active',i===current));syncA11y()};

  const animateEntry=scene=>{if(reduced||!window.gsap)return;const items=[...scene.querySelector('.scene-inner')?.children||[]];gsap.killTweensOf(items);gsap.fromTo(items,{opacity:0,y:10},{opacity:1,y:0,duration:.4,stagger:.045,ease:'power3.out',clearProps:'transform'});const vectors=scene.querySelectorAll('.hero-vector .vector,.cta-visual .vector');if(vectors.length){gsap.set(vectors,{strokeDashoffset:500});gsap.to(vectors,{strokeDashoffset:0,duration:1,stagger:.1,ease:'power2.inOut'})}scene.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';const s={v:0};gsap.to(s,{v:target,duration:.8,ease:'power3.out',onUpdate:()=>el.textContent=`${prefix}${Math.round(s.v)}${suffix}`,onComplete:()=>el.textContent=`${prefix}${target}${suffix}`})})};

  function goTo(target){target=clamp(target,0,scenes.length-1);if(target===current||transitioning)return false;const out=scenes[current],inc=scenes[target],dir=target>current?1:-1;transitioning=true;current=target;chrome();inc.classList.add('is-active');inc.setAttribute('aria-hidden','false');if(reduced||!window.gsap){out.classList.remove('is-active');out.setAttribute('aria-hidden','true');animateEntry(inc);transitioning=false;return true}gsap.killTweensOf([out,inc]);gsap.set(inc,{xPercent:dir*100,opacity:.35,visibility:'visible'});gsap.set(out,{xPercent:0,opacity:1,visibility:'visible'});gsap.timeline({onComplete:()=>{out.classList.remove('is-active');out.setAttribute('aria-hidden','true');scenes.forEach((s,i)=>{if(i!==current)s.classList.remove('is-active')});gsap.set([out,inc],{clearProps:'transform,opacity,visibility'});animateEntry(inc);transitioning=false}}).to(out,{xPercent:-dir*20,opacity:0,duration:.32,ease:'power3.inOut'},0).to(inc,{xPercent:0,opacity:1,duration:.42,ease:'power4.out'},.01);return true}
  const goNext=()=>goTo(current+1),goPrev=()=>goTo(current-1);next?.addEventListener('click',goNext);prev?.addEventListener('click',goPrev);document.querySelectorAll('.js-next').forEach(b=>b.addEventListener('click',goNext));

  /* One physical wheel/trackpad gesture = one scene. The lock survives the
     transition and releases only after the inertial tail becomes idle. */
  let wheelLocked=false,wheelSum=0,wheelDir=0,wheelIdle=null;const resetWheel=()=>{if(transitioning){wheelIdle=setTimeout(resetWheel,70);return}wheelLocked=false;wheelSum=0;wheelDir=0};const norm=e=>{let d=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(e.deltaMode===1)d*=16;if(e.deltaMode===2)d*=Math.max(innerHeight,1);return d};addEventListener('wheel',e=>{if(e.ctrlKey)return;e.preventDefault();const d=norm(e);if(Math.abs(d)<.7)return;clearTimeout(wheelIdle);wheelIdle=setTimeout(resetWheel,160);if(transitioning){wheelLocked=true;return}if(wheelLocked)return;const dir=Math.sign(d);if(wheelDir&&dir!==wheelDir)wheelSum=0;wheelDir=dir;wheelSum+=d;if(Math.abs(wheelSum)<36)return;wheelLocked=true;wheelSum=0;dir>0?goNext():goPrev()},{capture:true,passive:false});
  addEventListener('keydown',e=>{const tag=e.target?.tagName?.toLowerCase();if(['input','textarea','select'].includes(tag))return;if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();goNext()}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goPrev()}else if(e.key==='Home')goTo(0);else if(e.key==='End')goTo(scenes.length-1)});
  root.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchX=t.clientX;touchY=t.clientY},{passive:true});root.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});root.addEventListener('touchend',e=>{if(transitioning)return;const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.max(Math.abs(dx),Math.abs(dy))<42)return;(Math.abs(dx)>=Math.abs(dy)?dx:dy)<0?goNext():goPrev()},{passive:true});

  const select=(selector,target)=>document.querySelectorAll(selector).forEach(x=>x.classList.toggle('is-selected',x===target));
  const renderImpact=k=>{document.getElementById('impact-core-title').textContent=T(`impact.${k}.title`);document.getElementById('impact-core-sub').textContent=T(`impact.${k}.sub`)};document.querySelectorAll('[data-impact]').forEach(b=>b.addEventListener('click',()=>{select('[data-impact]',b);renderImpact(b.dataset.impact)}));
  const renderBottleneck=k=>{document.getElementById('bottleneck-solution').textContent=T(`diagnosis.${k}.title`);document.getElementById('bottleneck-copy').textContent=T(`diagnosis.${k}.copy`);document.getElementById('bottleneck-metric').textContent=T(`diagnosis.${k}.metric`)};document.querySelectorAll('[data-bottleneck]').forEach(b=>b.addEventListener('click',()=>{select('[data-bottleneck]',b);renderBottleneck(b.dataset.bottleneck)}));
  const renderSolution=k=>{['code','title','copy','stack'].forEach(part=>document.getElementById(`solution-${part}`).textContent=T(`solution.${k}.${part}`))};document.querySelectorAll('[data-solution]').forEach(b=>b.addEventListener('click',()=>{select('[data-solution]',b);renderSolution(b.dataset.solution)}));
  document.querySelectorAll('[data-arch]').forEach((b,i)=>b.addEventListener('click',()=>document.querySelectorAll('[data-arch]').forEach((x,j)=>x.classList.toggle('is-live',j<=i))));
  const renderGrowth=k=>{document.getElementById('growth-insight-title').textContent=T(`growth.${k}.title`);document.getElementById('growth-insight-copy').textContent=T(`growth.${k}.copy`);document.getElementById('growth-insight-kpi').textContent=T(`growth.${k}.kpi`)};document.querySelectorAll('[data-growth-step]').forEach(b=>b.addEventListener('click',()=>{select('[data-growth-step]',b);renderGrowth(b.dataset.growthStep)}));
  const renderMethod=i=>{methodIndex=i;document.getElementById('method-tag').textContent=T(`method.${i}.tag`);document.getElementById('method-title').textContent=T(`method.${i}.title`);document.getElementById('method-output').textContent=T(`method.${i}.output`)};document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{select('[data-method]',b);renderMethod(Number(b.dataset.method))}));
  const renderProof=k=>{document.getElementById('proof-title').textContent=T(`proof.${k}.title`);document.getElementById('proof-copy').textContent=T(`proof.${k}.copy`)};document.querySelectorAll('[data-proof]').forEach(b=>b.addEventListener('click',()=>{select('[data-proof]',b);renderProof(b.dataset.proof)}));
  const renderAI=i=>{aiIndex=i;document.getElementById('ai-message').textContent=T(`ai.${i}`);document.querySelectorAll('[data-ai-step]').forEach((x,j)=>x.classList.toggle('is-active',j<=i))};document.querySelectorAll('[data-ai-step]').forEach(b=>b.addEventListener('click',()=>renderAI(Number(b.dataset.aiStep))));
  const renderDiagnostic=k=>{if(!k)return;diagnosticKey=k;document.getElementById('diagnostic-result').innerHTML=`<small>${T(`diagnostic.${k}.title`)}</small><strong>${T(`diagnostic.${k}.copy`)}</strong><p>${T(`diagnostic.${k}.metric`)}</p>`};document.querySelectorAll('[data-diagnostic]').forEach(b=>b.addEventListener('click',()=>{select('[data-diagnostic]',b);renderDiagnostic(b.dataset.diagnostic)}));

  const refreshDynamic=()=>{applyTerminology();const a=document.querySelector('[data-impact].is-selected');if(a)renderImpact(a.dataset.impact);const b=document.querySelector('[data-bottleneck].is-selected');if(b)renderBottleneck(b.dataset.bottleneck);const s=document.querySelector('[data-solution].is-selected');if(s)renderSolution(s.dataset.solution);const g=document.querySelector('[data-growth-step].is-selected');if(g)renderGrowth(g.dataset.growthStep);renderMethod(methodIndex);const p=document.querySelector('[data-proof].is-selected');if(p)renderProof(p.dataset.proof);renderAI(aiIndex);if(diagnosticKey)renderDiagnostic(diagnosticKey);syncA11y()};
  addEventListener('lightpath:languagechange',()=>requestAnimationFrame(refreshDynamic));

  const setupField=()=>{if(reduced)return;const canvas=document.getElementById('vector-field'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return;let w=0,h=0,dpr=1,last=0;const traces=[];const mobile=()=>innerWidth<760;const resize=()=>{const v=visualViewport;w=v?v.width:innerWidth;h=v?v.height:innerHeight;dpr=Math.min(mobile()?1:1.15,devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);traces.length=0;for(let i=0;i<(mobile()?9:20);i++)traces.push({x:Math.random()*w,y:Math.random()*h,s:.3+Math.random()*.55,a:Math.random()*6})};const draw=t=>{requestAnimationFrame(draw);if(document.hidden||t-last<(mobile()?50:28))return;last=t;ctx.clearRect(0,0,w,h);traces.forEach((p,i)=>{const ox=p.x,oy=p.y,ang=-.92+Math.sin(p.x*.006+t*.00035+p.a)*.22;p.x+=Math.cos(ang)*p.s;p.y+=Math.sin(ang)*p.s;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(p.x,p.y);ctx.strokeStyle=`rgba(${i%4===0?'183,255,55':'112,244,208'},${mobile()?.045:.075})`;ctx.lineWidth=.6;ctx.stroke();if(p.y<-30||p.x>w+40||p.x<-40){p.x=Math.random()*w;p.y=h+30}})};resize();addEventListener('resize',resize,{passive:true});visualViewport?.addEventListener('resize',resize,{passive:true});requestAnimationFrame(draw)};

  scenes.forEach((s,i)=>s.setAttribute('aria-hidden',i?'true':'false'));chrome();applyTerminology();renderImpact('cost');renderBottleneck('data');renderSolution('data');renderGrowth('media');renderMethod(0);renderProof('scale');renderAI(0);animateEntry(scenes[0]);setupField();root.focus({preventScroll:true});
})();