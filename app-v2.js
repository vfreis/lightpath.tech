(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const header=$('.header'), menu=$('.menu-toggle'), nav=$('.nav');

  /* Final linguistic QA for static UI labels and terminology that deliberately
     sits outside the semantic dictionary markup. Product/technology names and
     acronyms (API, RAG, GA4, CAPI, CRM, SQL, AWS, FastAPI, BI, ROI) stay intact. */
  const TERM={
    pt:{
      keyed:{
        'nav.capabilities':'Capacidades',
        'hero.eyebrow':'DADOS · IA · AUTOMAÇÃO · SISTEMAS DE CRESCIMENTO',
        'hero.orbitKicker':'LIGHTPATH / MOTOR DE VALOR',
        'pathways.p1.copy':'Mídia, landing page, checkout, rastreamento, CRM e retenção conectados.',
        'pathways.p4.copy':'Agentes, RAG, copilotos e aplicações de IA conectadas ao trabalho real.',
        'cap.kicker':'CAPACIDADES',
        'cap.ai.copy':'Agentes, RAG, copilotos, classificação, extração e produtos multimodais.',
        'cap.growth.copy':'Mídia, CRO, landing page, checkout, rastreamento, atribuição, CRM e ciclo de relacionamento.',
        'cap.analytics.copy':'BI, Ciência de Dados, previsão, segmentação e otimização operacional.',
        'system.kicker':'CAMADA DE CONTROLE',
        'system.copy':'Fontes, dados, automação, IA e decisão funcionando como uma cadeia mensurável — com segurança, governança e observabilidade.',
        'growth.kicker':'SISTEMAS DE CRESCIMENTO',
        'growth.label':'LIGHTPATH / CAMINHO DA RECEITA',
        'growth.insightTitle':'Mídia + produto + rastreamento + verdade comercial.',
        'growth.insightCopy':'UTM, event_id, CAPI, GA4, checkout, pedido, CRM e ciclo de relacionamento voltam a contar a mesma história.',
        'impact.kicker':'IMPACTO NO NEGÓCIO',
        'impact.note':'Transparência: os casos representam experiência técnica real em sistemas e produtos de produção e não implicam que todos tenham sido contratados originalmente sob a marca LightPath Tecnologia.',
        'case1.after':'processados por mês, com tempo de execução até 20% menor.',
        'case2.system':'Orquestração, agendamento, novas tentativas automáticas, alertas e observabilidade.',
        'proof.projectCopy':'Curadoria de dados, APIs, saídas estruturadas, autenticação, rastreamento e operação de uma aplicação multilíngue assistida por IA.',
        'scan.custo.title':'Dados + automação orientados à margem',
        'scan.custo.copy':'Identificamos onde pessoas, computação ou retrabalho crescem mais rápido que o resultado e desenhamos a menor arquitetura que quebra essa relação.',
        'scan.custo.kpis':'custo / transação|retrabalho|tempo de execução',
        'scan.receita.title':'Sistema de crescimento / funil comercial',
        'scan.risco.title':'Observabilidade + salvaguardas',
        'scan.decisao.title':'Analytics + IA aplicada',
        'scan.decisao.kpis':'latência decisória|qualidade|previsão',
        'footer.copy':'Dados, IA, automação e sistemas de crescimento para transformar atrito em alavancagem.'
      },
      static:{
        '.brand small':'tecnologia',
        '.cap-item:nth-child(1) small':'DADOS',
        '.cap-item:nth-child(2) small':'IA',
        '.cap-item:nth-child(3) small':'AUTOMAÇÃO',
        '.cap-item:nth-child(4) small':'CRESCIMENTO',
        '.cap-item:nth-child(5) small':'ANÁLISE',
        '.selected-project > span':'PROJETO EM DESTAQUE / DERMALY AI',
        '.diagnostic-copy .section-kicker b':'SCANNER DE OPORTUNIDADES',
        '.scanner-head > span':'LIGHTPATH / SCAN DE VALOR',
        '.scanner-head > b':'PRONTO',
        '.final-kicker':'LIGHTPATH / PRÓXIMO VETOR',
        '.footer-meta > span:nth-child(3)':'Brasil · Construindo sistemas que criam alavancagem.'
      },
      system:[['FONTES','APIs · BD · arquivos'],['DADOS','qualidade · lakehouse'],['AUTOMAÇÃO','eventos · APIs'],['IA','RAG · agentes'],['DECISÃO','BI · alertas · APIs']],
      rail:['CONTROLE','segurança','observabilidade','governança','supervisão humana'],
      cases:['ESCALA DE DADOS','AUTOMAÇÃO','INGESTÃO VIA API','OPERAÇÕES']
    },
    en:{
      keyed:{},
      static:{
        '.brand small':'technology',
        '.cap-item:nth-child(1) small':'DATA',
        '.cap-item:nth-child(2) small':'AI',
        '.cap-item:nth-child(3) small':'AUTOMATION',
        '.cap-item:nth-child(4) small':'GROWTH',
        '.cap-item:nth-child(5) small':'ANALYTICS',
        '.selected-project > span':'SELECTED PROJECT / DERMALY AI',
        '.diagnostic-copy .section-kicker b':'OPPORTUNITY SCANNER',
        '.scanner-head > span':'LIGHTPATH / VALUE SCAN',
        '.scanner-head > b':'READY',
        '.final-kicker':'LIGHTPATH / NEXT VECTOR',
        '.footer-meta > span:nth-child(3)':'Brazil · Building systems that create leverage.'
      },
      system:[['SOURCES','APIs · DB · files'],['DATA','quality · lakehouse'],['AUTOMATION','events · APIs'],['AI','RAG · agents'],['DECISION','BI · alerts · APIs']],
      rail:['CONTROL','security','observability','governance','human oversight'],
      cases:['DATA SCALE','AUTOMATION','API INGESTION','OPERATIONS']
    }
  };

  const applyLanguageQA=()=>{
    const lang=window.LightPathI18n?.lang==='en'?'en':'pt',cfg=TERM[lang];
    Object.entries(cfg.keyed).forEach(([key,value])=>{
      $$(`[data-i18n="${key}"]`).forEach(el=>el.textContent=value);
      $$(`[data-i18n-html="${key}"]`).forEach(el=>el.innerHTML=value);
    });
    Object.entries(cfg.static).forEach(([selector,value])=>{$$(selector).forEach(el=>el.textContent=value)});
    $$('.system-node').forEach((node,i)=>{const data=cfg.system[i];if(!data)return;const b=$('b',node),span=$('span',node);if(b)b.textContent=data[0];if(span)span.textContent=data[1]});
    const rail=$('.system-rail');if(rail){const label=$('span',rail),items=$$('b',rail);if(label)label.textContent=cfg.rail[0];items.forEach((el,i)=>{if(cfg.rail[i+1])el.textContent=cfg.rail[i+1]})}
    $$('.case-panel .case-copy > small').forEach((el,i)=>{if(cfg.cases[i])el.textContent=cfg.cases[i]});
    if(lang==='pt'){
      const meta=$('meta[name="description"]');if(meta)meta.content='LightPath Tecnologia conecta dados, software, IA, automação e sistemas de crescimento para transformar gargalos em receita, eficiência e escala.';
    }
  };

  const setMenu=open=>{
    if(!menu||!nav)return;
    menu.setAttribute('aria-expanded',String(open)); nav.classList.toggle('is-open',open); document.body.classList.toggle('menu-open',open);
    const i18n=window.LightPathI18n; menu.setAttribute('aria-label',i18n?.t(open?'nav.close':'nav.open')||(open?'Fechar menu':'Abrir menu'));
  };
  menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  $$('#nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('resize',()=>{if(innerWidth>=760)setMenu(false)},{passive:true});
  addEventListener('scroll',()=>header?.classList.toggle('is-scrolled',scrollY>18),{passive:true});
  header?.classList.toggle('is-scrolled',scrollY>18);
  const year=$('#year'); if(year)year.textContent=new Date().getFullYear();

  const resolveLegacyHash=()=>{
    if(location.hash!=='#contato')return;
    const target=$('#diagnostic');
    if(target){requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));history.replaceState(null,'','#diagnostic');}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',resolveLegacyHash,{once:true});else resolveLegacyHash();

  const scanData={tempo:'scan.tempo',custo:'scan.custo',receita:'scan.receita',risco:'scan.risco',decisao:'scan.decisao'};
  const polished=(key,value)=>{
    const lang=window.LightPathI18n?.lang==='en'?'en':'pt';
    return TERM[lang].keyed[key]??value;
  };
  const renderScan=key=>{
    const prefix=scanData[key]||scanData.tempo, i18n=window.LightPathI18n;
    $$('.scanner-options button').forEach(b=>b.classList.toggle('is-active',b.dataset.scan===key));
    const title=$('#scan-title'), copy=$('#scan-copy'), kpis=$('#scan-kpis');
    if(title) title.textContent=polished(`${prefix}.title`,i18n?.t(`${prefix}.title`)||'');
    if(copy) copy.textContent=polished(`${prefix}.copy`,i18n?.t(`${prefix}.copy`)||'');
    if(kpis){kpis.innerHTML='';polished(`${prefix}.kpis`,i18n?.t(`${prefix}.kpis`)||'').split('|').filter(Boolean).forEach(v=>{const s=document.createElement('span');s.textContent=v;kpis.appendChild(s);});}
  };
  $$('.scanner-options button').forEach(b=>b.addEventListener('click',()=>renderScan(b.dataset.scan)));
  addEventListener('lightpath:languagechange',()=>{
    /* i18n-v2 dispatches after its DOM pass; schedule one frame later so the
       QA terminology is always the last deterministic writer. */
    requestAnimationFrame(()=>{
      applyLanguageQA();
      const active=$('.scanner-options button.is-active'); renderScan(active?.dataset.scan||'tempo');
      if(menu) menu.setAttribute('aria-label',window.LightPathI18n?.t(menu.getAttribute('aria-expanded')==='true'?'nav.close':'nav.open')||'');
    });
  });
  const boot=()=>{applyLanguageQA();renderScan('tempo')};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();