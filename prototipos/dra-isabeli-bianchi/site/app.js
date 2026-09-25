(()=>{"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const screens=new Map($$("[data-screen]").map(el=>[el.dataset.screen,el]));
const header=$("#siteHeader"), toast=$("#toast"), processing=$("#processing");
let current="landing", playTimer=null, playing=false;

function showToast(msg){toast.textContent=msg;toast.classList.add("on");clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove("on"),1800)}
function go(name){if(!screens.has(name))return;current=name;screens.forEach((el,key)=>el.classList.toggle("active",key===name));header.style.display=name==="landing"?"":"none";document.querySelector(".site-footer").style.display=name==="landing"?"":"none";if(name==="landing")header.classList.remove("stuck");window.scrollTo({top:0,behavior:"auto"});requestAnimationFrame(updateScroll);if(name==="members")openPanel("home")}
$$("[data-go]").forEach(btn=>btn.addEventListener("click",()=>go(btn.dataset.go)));

requestAnimationFrame(()=>document.body.classList.add("ready"));
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
if(!reduced){
 const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add("visible")}),{threshold:.12,rootMargin:"0px 0px -4% 0px"});
 $$(".motion").forEach(el=>io.observe(el));
}else $$(".motion").forEach(el=>el.classList.add("visible"));

function updateScroll(){
 if(current!=="landing")return;
 const max=document.documentElement.scrollHeight-innerHeight;
 document.documentElement.style.setProperty("--progress",max>0?Math.min(1,scrollY/max):0);
 header.classList.toggle("stuck",scrollY>76);
 const steps=$$(".journey-step");
 steps.forEach((step,i)=>{const r=step.getBoundingClientRect();if(r.top<innerHeight*.63&&r.bottom>innerHeight*.25){steps.forEach(x=>x.classList.remove("active"));step.classList.add("active")}});
}
addEventListener("scroll",updateScroll,{passive:true}); updateScroll();

const anatomy={
 frontal:["01 / FRONTAL","Estrutura antes de escolha.","O ponto de partida é compreender relações anatômicas, movimento e objetivo de avaliação. A experiência final pode transformar cada região em uma camada visual de revisão."],
 glabela:["02 / GLABELAR","Movimento muda contexto.","Uma região não existe isoladamente. A leitura educacional deve conectar função, dinâmica e intenção antes de apresentar qualquer decisão técnica."],
 periocular:["03 / PERIOCULAR","Detalhe exige critério.","A proximidade entre estruturas reforça por que avaliação e segurança precisam aparecer junto da técnica, e não como um capítulo separado."],
 inferior:["04 / TERÇO INFERIOR","Planejamento é relação.","O estudo ganha consistência quando diferentes regiões são entendidas dentro do equilíbrio da face e do objetivo de avaliação."]
};
function setAnatomy(key){
 const c=anatomy[key]; if(!c)return;
 $("#anatomyContent").innerHTML="<small>"+c[0]+"</small><h3>"+c[1]+"</h3><p>"+c[2]+"</p>";
 $$("[data-anatomy]").forEach(b=>b.classList.toggle("active",b.dataset.anatomy===key));
}
$$("[data-anatomy]").forEach(b=>{b.addEventListener("click",()=>setAnatomy(b.dataset.anatomy));b.addEventListener("mouseenter",()=>{if(!reduced)setAnatomy(b.dataset.anatomy)})});

$$(".payment").forEach(btn=>btn.addEventListener("click",()=>{
 $$(".payment").forEach(b=>b.classList.toggle("active",b===btn));
 const box=$("#paymentDemo");
 if(btn.dataset.payment==="pix"){
   box.innerHTML='<div class="fake-card" style="aspect-ratio:auto;min-height:175px;text-align:center"><img src="assets/isabeli-simbolo-ib-conceito-v1.png" alt=""><small>PIX DEMONSTRATIVO</small><b>QR visual não gerado</b><footer><span>Nenhuma chave Pix</span><span>R$ 0,00</span></footer></div><p>Não existe QR Code, chave ou transação real.</p>';
 }else{
   box.innerHTML='<div class="fake-card"><img src="assets/isabeli-simbolo-ib-conceito-v1.png" alt=""><small>CARTÃO DEMONSTRATIVO</small><b>•••• •••• •••• 4242</b><footer><span>MARINA DEMO</span><span>12/30</span></footer></div><p>Nenhum número real de cartão é coletado.</p>';
 }
}));

$("#simulatePurchase").addEventListener("click",()=>{
 processing.classList.add("on");processing.setAttribute("aria-hidden","false");
 setTimeout(()=>{processing.classList.remove("on");processing.setAttribute("aria-hidden","true");go("success")},1150);
});

function openPanel(name){
 $$("[data-member-panel]").forEach(p=>p.classList.toggle("active",p.dataset.memberPanel===name));
 $$(".member-tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===name));
}
$$(".member-tab").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.panel)));

const modules=[
 ["M01","Fundamentos e visão geral","4 aulas demonstrativas"],
 ["M02","Anatomia facial aplicada","5 aulas demonstrativas"],
 ["M03","Avaliação e planejamento","4 aulas demonstrativas"],
 ["M04","Diluição e pontos de aplicação","6 aulas demonstrativas"],
 ["M05","Segurança e intercorrências","4 aulas demonstrativas"]
];
const trail=$("#trailList");
modules.forEach((m,i)=>{
 const card=document.createElement("article");
 card.innerHTML="<span>"+m[0]+"</span><div><b>"+m[1]+"</b><p>"+m[2]+" · estrutura sujeita à validação</p></div><button type='button'>"+(i===2?"Continuar":"Visualizar")+"</button>";
 card.querySelector("button").addEventListener("click",()=>i===2?go("lesson"):showToast("Ação demonstrativa — nenhum progresso foi salvo."));
 trail.appendChild(card);
});

$("#playDemo").addEventListener("click",e=>{
 playing=!playing;e.currentTarget.textContent=playing?"Ⅱ":"▶";clearInterval(playTimer);
 if(playing){
   let width=parseFloat($("#playerProgress").style.width)||58;
   playTimer=setInterval(()=>{width+=.45;if(width>=96){width=58;playing=false;clearInterval(playTimer);e.currentTarget.textContent="▶";showToast("Fim da simulação do player.")}$("#playerProgress").style.width=width+"%"},230);
 }
});

go("landing");
})();