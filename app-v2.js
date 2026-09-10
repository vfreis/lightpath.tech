(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s); const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const header=$('.header'), menu=$('.menu-toggle'), nav=$('.nav');
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

  const scanData={tempo:'scan.tempo',custo:'scan.custo',receita:'scan.receita',risco:'scan.risco',decisao:'scan.decisao'};
  const renderScan=key=>{
    const prefix=scanData[key]||scanData.tempo, i18n=window.LightPathI18n;
    $$('.scanner-options button').forEach(b=>b.classList.toggle('is-active',b.dataset.scan===key));
    const title=$('#scan-title'), copy=$('#scan-copy'), kpis=$('#scan-kpis');
    if(title) title.textContent=i18n?.t(`${prefix}.title`)||'';
    if(copy) copy.textContent=i18n?.t(`${prefix}.copy`)||'';
    if(kpis){kpis.innerHTML='';(i18n?.t(`${prefix}.kpis`)||'').split('|').filter(Boolean).forEach(v=>{const s=document.createElement('span');s.textContent=v;kpis.appendChild(s);});}
  };
  $$('.scanner-options button').forEach(b=>b.addEventListener('click',()=>renderScan(b.dataset.scan)));
  addEventListener('lightpath:languagechange',()=>{
    const active=$('.scanner-options button.is-active'); renderScan(active?.dataset.scan||'tempo');
    if(menu) menu.setAttribute('aria-label',window.LightPathI18n?.t(menu.getAttribute('aria-expanded')==='true'?'nav.close':'nav.open')||'');
  });
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>renderScan('tempo'));else renderScan('tempo');
})();
