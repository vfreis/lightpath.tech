(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse=matchMedia('(pointer:coarse)').matches;
  const memory=navigator.deviceMemory||8, cores=navigator.hardwareConcurrency||8;
  const width=innerWidth;
  const tier=reduced?'lite':(coarse||width<760||memory<=4||cores<=4?'lite':(width<1280||memory<=8||cores<=8?'medium':'high'));
  document.documentElement.dataset.motion=tier;
  const cfg={lite:{fps:24,dpr:1,particles:3},medium:{fps:36,dpr:1.25,particles:5},high:{fps:60,dpr:1.5,particles:7}}[tier];
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  class MotionDirector{
    constructor(){
      this.canvas=$('#lp-path-canvas'); this.ctx=this.canvas?.getContext('2d',{alpha:true});
      this.N=64; this.current='chaos'; this.target='chaos'; this.mix=1; this.last=0; this.visible=!document.hidden;
      this.w=1;this.h=1;this.dpr=1;this.points=[];this.targetPoints=[];this.particles=[];
      this.states=['chaos','paths','system','revenue','measure','growth','flow','decision','final'];
      this.onResize=this.resize.bind(this); this.draw=this.draw.bind(this);
      this.init();
    }
    init(){
      this.resize(); this.bindScrollMeter(); this.bindPathStates(); this.bindHero(); this.bindGrowth(); this.bindCases(); this.bindReveals(); this.bindMetrics(); this.bindMethod(); this.bindLenis();
      document.addEventListener('visibilitychange',()=>{this.visible=!document.hidden});
      addEventListener('resize',this.onResize,{passive:true});
      if(this.ctx&&!reduced) requestAnimationFrame(this.draw);
    }
    bindLenis(){
      if(reduced||tier==='lite'||!window.Lenis||!matchMedia('(pointer:fine)').matches)return;
      this.lenis=new Lenis({duration:tier==='high'?1.02:.9,smoothWheel:true,touchMultiplier:1});
      if(window.gsap){gsap.ticker.add(t=>this.lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)}
      else{const raf=t=>{this.lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
    }
    bindScrollMeter(){
      const bar=$('.scroll-meter span'); if(!bar)return;
      const update=()=>{const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);bar.style.transform=`scaleX(${clamp(scrollY/total)})`};
      addEventListener('scroll',update,{passive:true});update();
    }
    bindPathStates(){
      const nodes=$$('[data-path-state]');
      if(window.gsap&&window.ScrollTrigger){
        gsap.registerPlugin(ScrollTrigger);
        nodes.forEach(el=>ScrollTrigger.create({trigger:el,start:'top 52%',end:'bottom 48%',onEnter:()=>this.setState(el.dataset.pathState),onEnterBack:()=>this.setState(el.dataset.pathState)}));
      }else{
        const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)this.setState(e.target.dataset.pathState)}),{rootMargin:'-42% 0px -42% 0px'});nodes.forEach(n=>io.observe(n));
      }
    }
    setState(state){if(!this.states.includes(state)||state===this.target)return;this.current=this.target;this.target=state;this.mix=0;this.targetPoints=this.makeShape(state)}
    bindHero(){
      if(!window.gsap||!window.ScrollTrigger||reduced)return;
      const lines=$$('.hero-line');
      const tl=gsap.timeline({scrollTrigger:{trigger:'.hero-story',start:'top top',end:'bottom bottom',scrub:tier==='lite'?.35:.8}});
      tl.fromTo(lines[0],{opacity:1,scale:1},{opacity:.28,scale:.965,duration:1},0)
        .fromTo(lines[1],{opacity:.7,scale:.96},{opacity:1,scale:1.035,duration:1},.18)
        .to(lines[1],{opacity:.42,scale:1,duration:.7},1.05)
        .fromTo(lines[2],{opacity:.48,scale:.95},{opacity:1,scale:1.045,duration:1},1.05)
        .to('.hero-orbit',{rotate:18,scale:1.06,duration:2,ease:'none'},0);
    }
    bindGrowth(){
      const line=$('.revenue-line>span'), token=$('.revenue-token'), nodes=$$('.revenue-node'), q=$('#revenue-question');
      if(!line||!token)return;
      const render=p=>{
        line.style.transform=`scaleX(${p})`;token.style.left=`${5+90*p}%`;
        const idx=Math.min(nodes.length-1,Math.floor(p*nodes.length));nodes.forEach((n,i)=>n.classList.toggle('is-live',i<=idx));
        if(q){const lang=window.LightPathI18n?.lang||'pt';const messages=lang==='en'?['R$1 invested → traffic signal','R$1 invested → page intent','R$1 invested → checkout intent','R$1 invested → real sale','R$1 invested → revenue + retention']:['R$1 investido → sinal de tráfego','R$1 investido → intenção na página','R$1 investido → intenção de compra','R$1 investido → venda real','R$1 investido → receita + retenção'];q.textContent=messages[idx]||messages[0]}
      };
      if(window.gsap&&window.ScrollTrigger&&!reduced)ScrollTrigger.create({trigger:'.growth-story',start:'top top',end:'bottom bottom',scrub:true,onUpdate:s=>render(s.progress)});else render(1);
      addEventListener('lightpath:languagechange',()=>{if(window.ScrollTrigger){const st=ScrollTrigger.getAll().find(s=>s.trigger?.classList?.contains('growth-story'));render(st?.progress||0)}},{passive:true});
    }
    bindCases(){
      const panels=$$('.case-panel'), progress=$('.case-progress>span'); if(!panels.length)return;
      const render=p=>{const idx=Math.min(panels.length-1,Math.floor(p*panels.length));panels.forEach((el,i)=>el.classList.toggle('is-active',i===idx));if(progress)progress.style.transform=`scaleX(${(idx+1)/panels.length})`};
      if(window.gsap&&window.ScrollTrigger&&!reduced)ScrollTrigger.create({trigger:'.impact-story',start:'top top',end:'bottom bottom',scrub:true,onUpdate:s=>render(s.progress)});else render(0);
    }
    bindReveals(){
      if(!window.gsap||!window.ScrollTrigger||reduced)return;
      $$('.section').forEach(section=>{
        const items=$$('.section-kicker,.split-heading>*',section);if(items.length)gsap.from(items,{opacity:0,y:tier==='lite'?18:30,duration:tier==='lite'?.55:.8,stagger:.06,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 82%',once:true}})
      });
      $$('.pathway').forEach((el,i)=>gsap.from(el,{opacity:0,y:22,duration:.62,delay:i*.03,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
      $$('.cap-item').forEach((el,i)=>gsap.from(el,{opacity:0,x:tier==='lite'?0:(i%2?18:-18),y:tier==='lite'?14:0,duration:.58,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
      gsap.from('.system-diagram',{opacity:0,scale:.97,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.system-story',start:'top 70%',once:true}});
    }
    bindMetrics(){
      const counters=$$('.counter');
      const run=el=>{if(el.dataset.done)return;el.dataset.done='1';const target=Number(el.dataset.count||0),pre=el.dataset.prefix||'',suf=el.dataset.suffix||'';if(reduced||!window.gsap){el.textContent=`${pre}${target}${suf}`;return}const s={v:0};gsap.to(s,{v:target,duration:1.4,ease:'power3.out',onUpdate:()=>el.textContent=`${pre}${Math.round(s.v)}${suf}`})};
      counters.forEach(el=>{if(window.ScrollTrigger&&!reduced)ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:()=>run(el)});else run(el)});
      $$('.metric-line b').forEach(el=>{if(window.gsap&&window.ScrollTrigger&&!reduced)gsap.to(el,{scaleX:parseFloat(el.style.getPropertyValue('--p'))||1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});else el.style.transform=`scaleX(${parseFloat(el.style.getPropertyValue('--p'))||1})`});
    }
    bindMethod(){
      if(!window.gsap||!window.ScrollTrigger||reduced)return;
      $$('.method-list article').forEach((el,i)=>gsap.from(el,{opacity:.28,x:tier==='lite'?0:(i%2?20:-20),duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 82%',end:'top 52%',scrub:tier==='lite'?false:.35}}));
    }
    resize(){
      if(!this.canvas||!this.ctx)return;this.w=innerWidth;this.h=innerHeight;this.dpr=Math.min(cfg.dpr,devicePixelRatio||1);this.canvas.width=Math.max(1,Math.round(this.w*this.dpr));this.canvas.height=Math.max(1,Math.round(this.h*this.dpr));this.canvas.style.width=`${this.w}px`;this.canvas.style.height=`${this.h}px`;this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.points=this.makeShape(this.target);this.targetPoints=this.makeShape(this.target);this.particles=Array.from({length:cfg.particles},(_,i)=>({t:i/cfg.particles,speed:.0015+Math.random()*.0012}))
    }
    makeShape(state){
      const pts=[];const N=this.N;
      for(let i=0;i<N;i++){
        const t=i/(N-1);let x=.06+t*.88,y=.82-t*.62;
        if(state==='chaos'){x=.05+t*.9+.025*Math.sin(t*18);y=.78-t*.52+.10*Math.sin(t*12+1.2)+.045*Math.sin(t*29)}
        else if(state==='paths'){x=.05+t*.9;y=.82-t*.66+.035*Math.sin(t*8)}
        else if(state==='system'){const step=Math.floor(t*5);const local=(t*5)%1;x=.06+(step+local)*.176;y=.68-(step%2)*.18}
        else if(state==='revenue'){x=.05+t*.9;y=.52+.035*Math.sin(t*Math.PI*10)-.08*t}
        else if(state==='measure'){x=.05+t*.9;y=.78-.1*Math.sin(t*8)-.5*t*t}
        else if(state==='growth'){x=.05+t*.9;y=.84-.72*Math.pow(t,.82)+.028*Math.sin(t*12)}
        else if(state==='flow'){const step=Math.floor(t*4);x=.07+t*.86;y=.78-step*.16}
        else if(state==='decision'){const a=(1-t)*Math.PI*2.2;x=.62+(1-t)*.36*Math.cos(a);y=.48+(1-t)*.32*Math.sin(a)}
        else if(state==='final'){
          const peaks=[[.08,.78],[.28,.53],[.39,.64],[.57,.34],[.82,.78]];const seg=Math.min(peaks.length-2,Math.floor(t*(peaks.length-1)));const lt=t*(peaks.length-1)-seg;x=peaks[seg][0]+(peaks[seg+1][0]-peaks[seg][0])*lt;y=peaks[seg][1]+(peaks[seg+1][1]-peaks[seg][1])*lt
        }
        pts.push({x:x*this.w,y:y*this.h})
      }return pts
    }
    pointAt(t){const f=clamp(t)*(this.points.length-1),i=Math.floor(f),j=Math.min(this.points.length-1,i+1),m=f-i,a=this.points[i],b=this.points[j];return{x:a.x+(b.x-a.x)*m,y:a.y+(b.y-a.y)*m}}
    draw(now){requestAnimationFrame(this.draw);if(!this.visible||now-this.last<1000/cfg.fps)return;this.last=now;if(this.mix<1){this.mix=Math.min(1,this.mix+.045);const next=this.makeShape(this.target);for(let i=0;i<this.N;i++){this.points[i].x+=(next[i].x-this.points[i].x)*.085;this.points[i].y+=(next[i].y-this.points[i].y)*.085}}
      const c=this.ctx;c.clearRect(0,0,this.w,this.h);c.save();c.globalCompositeOperation='lighter';
      c.beginPath();this.points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));const g=c.createLinearGradient(0,this.h,this.w,0);g.addColorStop(0,'rgba(112,244,208,.07)');g.addColorStop(.55,'rgba(183,255,55,.32)');g.addColorStop(1,'rgba(183,255,55,.08)');c.strokeStyle=g;c.lineWidth=tier==='high'?1.15:.8;c.stroke();
      this.particles.forEach((p,idx)=>{p.t=(p.t+p.speed)%1;const a=this.pointAt(p.t),b=this.pointAt(Math.max(0,p.t-.025));c.beginPath();c.moveTo(b.x,b.y);c.lineTo(a.x,a.y);c.strokeStyle=idx%2?'rgba(183,255,55,.62)':'rgba(112,244,208,.55)';c.lineWidth=idx%3===0?1.5:1;c.stroke();c.beginPath();c.arc(a.x,a.y,idx%3===0?2.2:1.4,0,Math.PI*2);c.fillStyle=idx%2?'rgba(183,255,55,.8)':'rgba(112,244,208,.72)';c.fill()});c.restore()
    }
  }
  window.LightPathMotion=new MotionDirector();
})();
