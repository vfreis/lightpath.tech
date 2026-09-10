(() => {
  'use strict';
  const root=document.getElementById('story');if(!root)return;
  const scenes=[...document.querySelectorAll('.scene')],prev=document.getElementById('prev-scene'),next=document.getElementById('next-scene'),bar=document.getElementById('story-progress-bar'),num=document.getElementById('scene-number'),total=document.getElementById('scene-total'),dotsRoot=document.getElementById('scene-dots');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer=matchMedia('(pointer:fine)').matches;
  let current=0,transitioning=false,touchX=0,touchY=0,methodIndex=0,aiIndex=0,diagnosticKey=null;
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const language=()=>window.LightPathPresentationI18n?.lang==='en'?'en':'pt';

  /* Copy + terminology QA. These overrides deliberately shorten the deck:
     one thesis, one visual, one business reading per scene. */
  const QA={
    pt:{
      keyed:{
        'hero.badge':'DADOS · IA · AUTOMAÇÃO · CRESCIMENTO',
        'hero.copy':'Do clique ao caixa. Do dado à decisão. Da rotina ao sistema. Da IA ao produto.',
        'impact.copy':'Escolha a alavanca que mais precisa mover agora.',
        'impact.cost.sub':'menos repasses · retrabalho · operação manual',
        'diagnosis.copy':'Quatro sintomas. Um primeiro vetor de ganho.',
        'diagnosis.data.copy':'Fontes desconectadas, retrabalho e pouca confiança para decidir.',
        'diagnosis.manual.copy':'Passos repetitivos, repasses e dependência de acompanhamento humano.',
        'diagnosis.decision.copy':'A informação existe, mas chega tarde demais ao ponto de decisão.',
        'diagnosis.ai.copy':'IA sem contexto, ferramentas, salvaguardas ou uma métrica de valor.',
        'solutions.copy':'O gargalo escolhe a tecnologia — não o contrário.',
        'solution.analytics.title':'Análises & Ciência de Dados',
        'solution.analytics.stack':'KPIs · BI · previsão · segmentação · otimização',
        'architecture.copy':'Da origem ao ROI, sem caixa-preta.',
        'growth.kicker':'05 / SISTEMAS DE CRESCIMENTO',
        'growth.copy':'Do clique ao caixa: seguimos o caminho para encontrar onde o valor vaza.',
        'growth.lifecycleSub':'área de membros · CRM',
        'growth.checkout.title':'Checkout como infraestrutura de receita.',
        'method.copy':'Diagnosticar. Desenhar. Construir. Medir.',
        'proof.copy':'Números de produção traduzidos em capacidade de negócio.',
        'proof.scale.copy':'Pipelines distribuídos e tempo de execução otimizado transformam volume em capacidade previsível.',
        'ai.copy':'IA conectada ao trabalho real — não isolada em uma demonstração.',
        'ai.b':'à produção.',
        'discovery.kicker':'09 / DESCOBERTA',
        'discovery.copy':'Escolha o sintoma. Nós devolvemos o primeiro vetor.',
        'diagnostic.manual.copy':'Mapear passos, horas e repasses. Automatizar primeiro o trecho recorrente de menor risco.',
        'diagnostic.data.copy':'Criar uma camada confiável antes de multiplicar painéis ou IA.',
        'diagnostic.decision.metric':'Medir → tempo de ciclo · acurácia · perda evitada',
        'diagnostic.ai.copy':'Escolher uma tarefa real, definir uma linha de base e provar valor antes de ampliar IA.',
        'diagnostic.scale.metric':'Medir → capacidade de processamento · custo marginal · capacidade',
        'cta.copy':'Se existe um gargalo de receita, operação, dados ou decisão, vamos encontrar o caminho que transforma isso em resultado.',
        'cta.badge':'DADOS · IA · AUTOMAÇÃO · CRESCIMENTO'
      },
      static:{
        '[data-growth-step="landing"] b':'PÁGINA',
        '[data-ai-step="2"] b':'JSON estruturado',
        '[data-ai-step="3"] span':'RASTREAMENTO'
      }
    },
    en:{
      keyed:{
        'hero.copy':'From click to cash. Data to decision. Routine to system. AI to product.',
        'impact.copy':'Choose the lever that needs to move most right now.',
        'diagnosis.copy':'Four symptoms. One first vector for gain.',
        'diagnosis.data.copy':'Disconnected sources, rework and low confidence at decision time.',
        'diagnosis.manual.copy':'Repetitive steps, handoffs and dependence on human follow-up.',
        'diagnosis.decision.copy':'The information exists, but reaches the decision point too late.',
        'diagnosis.ai.copy':'AI without context, tools, guardrails or a measurable value metric.',
        'solutions.copy':'The bottleneck chooses the technology — not the other way around.',
        'architecture.copy':'From source to ROI, without a black box.',
        'growth.copy':'From click to cash: we follow the path to find where value leaks.',
        'method.copy':'Diagnose. Design. Build. Measure.',
        'proof.copy':'Production numbers translated into business capacity.',
        'ai.copy':'AI connected to real work — not isolated in a demo.',
        'discovery.copy':'Choose the symptom. We return the first vector.',
        'cta.copy':'If revenue, operations, data or decisions are stuck, let’s find the path that turns the bottleneck into an outcome.'
      },
      static:{'[data-growth-step="landing"] b':'LANDING','[data-ai-step="2"] b':'structured JSON','[data-ai-step="3"] span':'TRACKING'}
    }
  };
  const T=key=>QA[language()].keyed[key]??window.LightPathPresentationI18n?.t(key)??key;
  const applyTerminology=()=>{
    const cfg=QA[language()];
    Object.entries(cfg.keyed).forEach(([key,value])=>document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el=>el.textContent=value));
    Object.entries(cfg.static).forEach(([selector,value])=>document.querySelectorAll(selector).forEach(el=>el.textContent=value));
  };

  /* Diagnosis cards now explain the symptom instead of wasting vertical space. */
  const enrichDiagnosis=()=>{
    const keyMap={data:'diagnosis.data.copy',manual:'diagnosis.manual.copy',decision:'diagnosis.decision.copy',ai:'diagnosis.ai.copy'};
    document.querySelectorAll('[data-bottleneck]').forEach(card=>{
      let desc=card.querySelector('.bottleneck-desc');
      if(!desc){desc=document.createElement('p');desc.className='bottleneck-desc';card.appendChild(desc)}
      desc.textContent=T(keyMap[card.dataset.bottleneck]);
    });
  };

  if(total)total.textContent=String(scenes.length).padStart(2,'0');
  const syncViewport=()=>{const v=visualViewport;document.documentElement.style.setProperty('--vh',`${Math.round(v?v.height:innerHeight)}px`)};
  syncViewport();addEventListener('resize',syncViewport,{passive:true});visualViewport?.addEventListener('resize',syncViewport,{passive:true});

  const dots=scenes.map((_,i)=>{const b=document.createElement('button');b.type='button';b.addEventListener('click',()=>goTo(i));dotsRoot?.appendChild(b);return b});
  const syncA11y=()=>dots.forEach((b,i)=>b.setAttribute('aria-label',`${T('chrome.scene')} ${i+1}`));
  const chrome=()=>{if(num)num.textContent=String(current+1).padStart(2,'0');if(bar)bar.style.transform=`scaleX(${(current+1)/scenes.length})`;if(prev)prev.disabled=current===0;if(next)next.disabled=current===scenes.length-1;dots.forEach((d,i)=>d.classList.toggle('is-active',i===current));syncA11y()};

  const sceneMotion=(scene,index)=>{
    if(reduced||!window.gsap)return;
    const q=s=>[...scene.querySelectorAll(s)];
    const title=q('h1,h2'),kicker=q('.scene-kicker'),copy=q('.scene-copy>p,.scene-heading>p'),panels=q('.impact-stage,.solution-console,.growth-console,.method-app,.ai-product,.diagnostic-app,.cta-visual,.result-bar'),cards=q('.bottleneck,.impact-choice,.solution-node,.arch-node,.growth-node,.method-nav button,.proof-tile,.ai-pipeline button,.diagnostic-options button');
    gsap.killTweensOf([...title,...kicker,...copy,...panels,...cards]);
    gsap.fromTo(kicker,{opacity:0,x:-16},{opacity:1,x:0,duration:.42,ease:'power3.out'});
    gsap.fromTo(title,{opacity:0,y:22,clipPath:'inset(0 0 100% 0)'},{opacity:1,y:0,clipPath:'inset(0 0 0% 0)',duration:.62,ease:'power4.out'});
    gsap.fromTo(copy,{opacity:0,y:10},{opacity:1,y:0,duration:.42,delay:.12,ease:'power3.out'});
    gsap.fromTo(panels,{opacity:0,y:14,scale:.985},{opacity:1,y:0,scale:1,duration:.56,delay:.08,ease:'power3.out'});
    gsap.fromTo(cards,{opacity:0,y:16,rotateX:5},{opacity:1,y:0,rotateX:0,duration:.48,stagger:.035,delay:.14,ease:'power3.out'});

    if(index===2){
      const diagnosis=q('.bottleneck');
      gsap.fromTo(diagnosis,{x:18,opacity:0},{x:0,opacity:1,duration:.55,stagger:.07,delay:.12,ease:'power3.out'});
      gsap.fromTo(q('.bottleneck-result'),{scaleX:.84,opacity:0,transformOrigin:'left center'},{scaleX:1,opacity:1,duration:.62,delay:.28,ease:'power4.out'});
    }
    if(index===4){
      const nodes=q('.arch-node');
      nodes.forEach(n=>n.classList.remove('is-live'));
      nodes.forEach((n,i)=>gsap.delayedCall(.22+i*.075,()=>{if(current===index)n.classList.add('is-live')}));
    }
    if(index===5){
      const nodes=q('.growth-node');
      gsap.fromTo(nodes,{scale:.96,opacity:.35},{scale:1,opacity:1,duration:.5,stagger:.06,delay:.18,ease:'back.out(1.6)'});
    }
    if(index===7){
      scene.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count||0),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';const s={v:0};gsap.to(s,{v:target,duration:.9,ease:'power3.out',onUpdate:()=>el.textContent=`${prefix}${Math.round(s.v)}${suffix}`,onComplete:()=>el.textContent=`${prefix}${target}${suffix}`})});
    }
    const vectors=scene.querySelectorAll('.hero-vector .vector,.cta-visual .vector');
    if(vectors.length){gsap.set(vectors,{strokeDashoffset:500});gsap.to(vectors,{strokeDashoffset:0,duration:1.1,stagger:.1,ease:'power2.inOut'})}
  };

  function goTo(target){
    target=clamp(target,0,scenes.length-1);if(target===current||transitioning)return false;
    const out=scenes[current],inc=scenes[target],dir=target>current?1:-1;transitioning=true;current=target;chrome();inc.classList.add('is-active');inc.setAttribute('aria-hidden','false');
    if(reduced||!window.gsap){out.classList.remove('is-active');out.setAttribute('aria-hidden','true');transitioning=false;sceneMotion(inc,current);return true}
    gsap.killTweensOf([out,inc]);
    gsap.set(inc,{xPercent:dir*86,opacity:.18,scale:.985,filter:'blur(7px)',visibility:'visible'});gsap.set(out,{xPercent:0,opacity:1,scale:1,filter:'blur(0px)',visibility:'visible'});
    gsap.timeline({defaults:{overwrite:true},onComplete:()=>{out.classList.remove('is-active');out.setAttribute('aria-hidden','true');scenes.forEach((s,i)=>{if(i!==current)s.classList.remove('is-active')});gsap.set([out,inc],{clearProps:'transform,opacity,filter,visibility'});transitioning=false;sceneMotion(inc,current)}})
      .to(out,{xPercent:-dir*14,opacity:0,scale:.992,filter:'blur(5px)',duration:.28,ease:'power3.in'},0)
      .to(inc,{xPercent:0,opacity:1,scale:1,filter:'blur(0px)',duration:.48,ease:'power4.out'},.035);
    return true;
  }
  const goNext=()=>goTo(current+1),goPrev=()=>goTo(current-1);next?.addEventListener('click',goNext);prev?.addEventListener('click',goPrev);document.querySelectorAll('.js-next').forEach(b=>b.addEventListener('click',goNext));

  /* Reliable wheel model: a session resets after a short real pause. There is
     no long timer that can trap the next intentional gesture. */
  let wheelSum=0,wheelDir=0,wheelConsumed=false,lastWheelAt=0;
  const norm=e=>{let d=Math.abs(e.deltaY)>=Math.abs(e.deltaX)?e.deltaY:e.deltaX;if(e.deltaMode===1)d*=16;if(e.deltaMode===2)d*=Math.max(innerHeight,1);return d};
  addEventListener('wheel',e=>{
    if(e.ctrlKey)return;e.preventDefault();
    const now=performance.now(),d=norm(e);if(Math.abs(d)<.6)return;
    const gap=now-lastWheelAt;lastWheelAt=now;
    if(gap>92){wheelSum=0;wheelDir=0;wheelConsumed=false}
    if(transitioning){wheelConsumed=true;return}
    if(wheelConsumed)return;
    const dir=Math.sign(d);if(wheelDir&&dir!==wheelDir)wheelSum=0;wheelDir=dir;wheelSum+=d;
    if(Math.abs(wheelSum)<30)return;
    wheelConsumed=true;wheelSum=0;dir>0?goNext():goPrev();
  },{capture:true,passive:false});

  addEventListener('keydown',e=>{const tag=e.target?.tagName?.toLowerCase();if(['input','textarea','select'].includes(tag))return;if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();goNext()}else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();goPrev()}else if(e.key==='Home')goTo(0);else if(e.key==='End')goTo(scenes.length-1)});
  root.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchX=t.clientX;touchY=t.clientY},{passive:true});root.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});root.addEventListener('touchend',e=>{if(transitioning)return;const t=e.changedTouches[0],dx=t.clientX-touchX,dy=t.clientY-touchY;if(Math.max(Math.abs(dx),Math.abs(dy))<42)return;(Math.abs(dx)>=Math.abs(dy)?dx:dy)<0?goNext():goPrev()},{passive:true});

  const select=(selector,target)=>document.querySelectorAll(selector).forEach(x=>x.classList.toggle('is-selected',x===target));
  const microMotion=el=>{if(reduced||!window.gsap||!el)return;gsap.fromTo(el,{scale:.985},{scale:1,duration:.34,ease:'back.out(1.7)'})};
  const renderImpact=k=>{document.getElementById('impact-core-title').textContent=T(`impact.${k}.title`);document.getElementById('impact-core-sub').textContent=T(`impact.${k}.sub`)};document.querySelectorAll('[data-impact]').forEach(b=>b.addEventListener('click',()=>{select('[data-impact]',b);renderImpact(b.dataset.impact);microMotion(document.querySelector('.impact-core'))}));
  const renderBottleneck=k=>{document.getElementById('bottleneck-solution').textContent=T(`diagnosis.${k}.title`);document.getElementById('bottleneck-copy').textContent=T(`diagnosis.${k}.copy`);document.getElementById('bottleneck-metric').textContent=T(`diagnosis.${k}.metric`);enrichDiagnosis();microMotion(document.querySelector('.bottleneck-result'))};document.querySelectorAll('[data-bottleneck]').forEach(b=>b.addEventListener('click',()=>{select('[data-bottleneck]',b);renderBottleneck(b.dataset.bottleneck)}));
  const renderSolution=k=>{['code','title','copy','stack'].forEach(part=>document.getElementById(`solution-${part}`).textContent=T(`solution.${k}.${part}`));microMotion(document.querySelector('.solution-core'))};document.querySelectorAll('[data-solution]').forEach(b=>b.addEventListener('click',()=>{select('[data-solution]',b);renderSolution(b.dataset.solution)}));
  document.querySelectorAll('[data-arch]').forEach((b,i)=>b.addEventListener('click',()=>document.querySelectorAll('[data-arch]').forEach((x,j)=>x.classList.toggle('is-live',j<=i))));
  const renderGrowth=k=>{document.getElementById('growth-insight-title').textContent=T(`growth.${k}.title`);document.getElementById('growth-insight-copy').textContent=T(`growth.${k}.copy`);document.getElementById('growth-insight-kpi').textContent=T(`growth.${k}.kpi`);microMotion(document.querySelector('.growth-insight'))};document.querySelectorAll('[data-growth-step]').forEach(b=>b.addEventListener('click',()=>{select('[data-growth-step]',b);renderGrowth(b.dataset.growthStep)}));
  const renderMethod=i=>{methodIndex=i;document.getElementById('method-tag').textContent=T(`method.${i}.tag`);document.getElementById('method-title').textContent=T(`method.${i}.title`);document.getElementById('method-output').textContent=T(`method.${i}.output`);microMotion(document.querySelector('.method-content'))};document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>{select('[data-method]',b);renderMethod(Number(b.dataset.method))}));
  const renderProof=k=>{document.getElementById('proof-title').textContent=T(`proof.${k}.title`);document.getElementById('proof-copy').textContent=T(`proof.${k}.copy`);microMotion(document.querySelector('.proof-meaning'))};document.querySelectorAll('[data-proof]').forEach(b=>b.addEventListener('click',()=>{select('[data-proof]',b);renderProof(b.dataset.proof)}));
  const renderAI=i=>{aiIndex=i;document.getElementById('ai-message').textContent=T(`ai.${i}`);document.querySelectorAll('[data-ai-step]').forEach((x,j)=>x.classList.toggle('is-active',j<=i));microMotion(document.querySelector('.ai-signal'))};document.querySelectorAll('[data-ai-step]').forEach(b=>b.addEventListener('click',()=>renderAI(Number(b.dataset.aiStep))));
  const renderDiagnostic=k=>{if(!k)return;diagnosticKey=k;document.getElementById('diagnostic-result').innerHTML=`<small>${T(`diagnostic.${k}.title`)}</small><strong>${T(`diagnostic.${k}.copy`)}</strong><p>${T(`diagnostic.${k}.metric`)}</p>`;microMotion(document.getElementById('diagnostic-result'))};document.querySelectorAll('[data-diagnostic]').forEach(b=>b.addEventListener('click',()=>{select('[data-diagnostic]',b);renderDiagnostic(b.dataset.diagnostic)}));

  const refreshDynamic=()=>{applyTerminology();enrichDiagnosis();const a=document.querySelector('[data-impact].is-selected');if(a)renderImpact(a.dataset.impact);const b=document.querySelector('[data-bottleneck].is-selected');if(b)renderBottleneck(b.dataset.bottleneck);const s=document.querySelector('[data-solution].is-selected');if(s)renderSolution(s.dataset.solution);const g=document.querySelector('[data-growth-step].is-selected');if(g)renderGrowth(g.dataset.growthStep);renderMethod(methodIndex);const p=document.querySelector('[data-proof].is-selected');if(p)renderProof(p.dataset.proof);renderAI(aiIndex);if(diagnosticKey)renderDiagnostic(diagnosticKey);syncA11y()};
  addEventListener('lightpath:languagechange',()=>requestAnimationFrame(refreshDynamic));

  /* Cursor/parallax energy: tiny depth, never enough to disturb layout. */
  if(finePointer&&!reduced){addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--px',`${(e.clientX/innerWidth-.5).toFixed(3)}`);document.documentElement.style.setProperty('--py',`${(e.clientY/innerHeight-.5).toFixed(3)}`)},{passive:true})}

  const setupField=()=>{if(reduced)return;const canvas=document.getElementById('vector-field'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return;let w=0,h=0,dpr=1,last=0;const traces=[];const mobile=()=>innerWidth<760;const resize=()=>{const v=visualViewport;w=v?v.width:innerWidth;h=v?v.height:innerHeight;dpr=Math.min(mobile()?1:1.15,devicePixelRatio||1);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=`${w}px`;canvas.style.height=`${h}px`;ctx.setTransform(dpr,0,0,dpr,0,0);traces.length=0;for(let i=0;i<(mobile()?9:20);i++)traces.push({x:Math.random()*w,y:Math.random()*h,s:.3+Math.random()*.55,a:Math.random()*6})};const draw=t=>{requestAnimationFrame(draw);if(document.hidden||t-last<(mobile()?50:28))return;last=t;ctx.clearRect(0,0,w,h);const stage=current/Math.max(1,scenes.length-1);traces.forEach((p,i)=>{const ox=p.x,oy=p.y,ang=(-.98+stage*.56)+Math.sin(p.x*.006+t*.00035+p.a)*.2;p.x+=Math.cos(ang)*p.s;p.y+=Math.sin(ang)*p.s;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(p.x,p.y);ctx.strokeStyle=`rgba(${i%4===0?'183,255,55':'112,244,208'},${mobile()?.045:.08})`;ctx.lineWidth=.6;ctx.stroke();if(p.y<-40||p.x>w+50||p.x<-50||p.y>h+50){p.x=Math.random()*w;p.y=h+20}})};resize();addEventListener('resize',resize,{passive:true});visualViewport?.addEventListener('resize',resize,{passive:true});requestAnimationFrame(draw)};

  scenes.forEach((s,i)=>s.setAttribute('aria-hidden',i?'true':'false'));chrome();applyTerminology();enrichDiagnosis();renderImpact('cost');renderBottleneck('data');renderSolution('data');renderGrowth('media');renderMethod(0);renderProof('scale');renderAI(0);sceneMotion(scenes[0],0);setupField();root.focus({preventScroll:true});
})();