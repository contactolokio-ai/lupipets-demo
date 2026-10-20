(() => {
const C = window.CONFIG, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const wa = m => `https://wa.me/${C.WHATSAPP_NUMBER}?text=${encodeURIComponent(m)}`;
const fmt = p => "$" + p.toLocaleString("es-CL");
const BRANDS = ["Belcando","Leonardo","Hill's","hey!","Poema","Pet Family","Bravery","Churu"];
let LIM=8, D, st = {pet:"", cat:"", q:"", of:false}, cart = JSON.parse(localStorage.getItem("lp_cart")||"[]");
["#waTop","#waBottom","#waFab","#waStore","#fWa","#waEmpty"].forEach(s=>$(s).href=wa(C.WHATSAPP_MSG));
$("#mapsTop").href=$("#mapsLink").href=C.MAPS_URL; $("#addr").textContent=$("#fAddr").textContent=C.ADDRESS;
$("#fMail").href="mailto:"+C.EMAIL; $("#fMail").textContent=C.EMAIL; $("#fIg").href=C.INSTAGRAM_URL;
$("#mq").innerHTML = [...BRANDS,...BRANDS,...BRANDS].map(b=>`<span>${b}</span><svg class="ic"><use href="#i-paw"/></svg>`).join("");
$("#brands").innerHTML = BRANDS.map(b=>`<button class="br" data-q="${b}"><span>${b}</span><small>${b}</small></button>`).join("");
// carrusel
let si=0; const sl=$("#slides"), go=i=>{si=(i+3)%3; sl.style.transform=`translateX(-${si*100}%)`; $$("#dots button").forEach((d,k)=>d.classList.toggle("on",k===si));};
$$("#dots button").forEach((d,k)=>d.onclick=()=>{go(k);clearInterval(t)}); let t=setInterval(()=>go(si+1),5000);
const card = p => `<article class="card"><div class="pi" data-open="${p.id}"><img src="${p.img}" alt="${p.nombre}" loading="lazy">${p.badge?`<span class="badge ${p.antes?'off':''}">${p.badge}</span>`:''}</div>
<div class="pb"><small class="brand">${p.marca}</small><h3 data-open="${p.id}">${p.nombre}</h3><p>${p.tam} · ${p.desc}</p>
<div class="pr"><b>${fmt(p.precio)}</b>${p.antes?`<s>${fmt(p.antes)}</s>`:''}</div>
<button class="add" data-add="${p.id}">Agregar <span><svg class="ic"><use href="#i-plus"/></svg></span></button></div></article>`;
function render(){ if(arguments[0]!=="keep") void 0;
  const q=st.q.toLowerCase().normalize("NFD").replace(/\p{M}/gu,"");
  const L=D.productos.filter(p=>(!st.pet||p.mascota===st.pet)&&(!st.cat||p.cat===st.cat)&&(!st.of||p.antes)&&(!q||(p.nombre+" "+p.marca+" "+p.desc).toLowerCase().normalize("NFD").replace(/\p{M}/gu,"").includes(q)));
  $("#grid").innerHTML=L.slice(0,LIM).map(card).join(""); $("#moreWrap").hidden=L.length<=LIM; $("#empty").hidden=!!L.length;
  $("#chips").innerHTML=[{id:"",nombre:"Todo"},...D.categorias].map(c=>`<button data-ch="${c.id}" class="${c.id===st.cat?'on':''}">${c.nombre}</button>`).join("");
  $$("#pets button").forEach(b=>b.classList.toggle("on",b.dataset.p===st.pet));
  $("#ttl").textContent = st.q?`Resultados para “${st.q}”`: st.of?"Ofertas": [st.cat&&D.categorias.find(c=>c.id===st.cat).nombre, st.pet&&(st.pet==="perro"?"para perros":"para gatos")].filter(Boolean).join(" ")||"Todos los productos";
}
const goShop=()=>document.getElementById("tienda").scrollIntoView({behavior:"smooth"});
document.addEventListener("click",e=>{
  const el=e.target.closest("[data-pet],[data-cat],[data-ofertas],[data-q]");
  if(el && !el.closest("#pets")){ st={pet:el.dataset.pet||"",cat:el.dataset.cat||"",q:el.dataset.q||"",of:el.hasAttribute("data-ofertas")}; $("#q").value=st.q; render(); goShop(); }
  const p=e.target.closest("[data-p]"); if(p){st.pet=p.dataset.p; render();}
  const ch=e.target.closest("[data-ch]"); if(ch){st.cat=ch.dataset.ch; st.of=false; render();}
  const a=e.target.closest("[data-add]"); if(a){const it=cart.find(i=>i.id===a.dataset.add); it?it.q++:cart.push({id:a.dataset.add,q:1}); save(); const T=$("#toast"); T.classList.add("on"); setTimeout(()=>T.classList.remove("on"),1400);}
  const q=e.target.closest("[data-qd]"); if(q){const it=cart[+q.dataset.i]; it.q+=+q.dataset.qd; if(it.q<1)cart.splice(+q.dataset.i,1); save();}
  const sc=e.target.closest("[data-sc]"); if(sc){const r=$("#rail"); r.scrollBy({left:+sc.dataset.sc*r.clientWidth*.8,behavior:"smooth"});}
});
$("#more").onclick=()=>{LIM=99;render();};
$("#searchForm").onsubmit=e=>{e.preventDefault(); goShop();};
$("#q").oninput=e=>{st={pet:"",cat:"",of:false,q:e.target.value.trim()}; render();};
const P=id=>D.productos.find(p=>p.id===id);
function save(){localStorage.setItem("lp_cart",JSON.stringify(cart)); cartUI();}
function cartUI(){
  const n=cart.reduce((a,i)=>a+i.q,0), tot=cart.reduce((a,i)=>a+i.q*P(i.id).precio,0);
  ["#cnt","#cnt2"].forEach(s=>{$(s).hidden=!n;$(s).textContent=n;});
  $("#items").innerHTML=cart.map((i,x)=>{const p=P(i.id);return `<li><img src="${p.img}" alt=""><span><b>${p.nombre}</b><small>${p.tam} · ${fmt(p.precio)}</small></span><span class="qty"><button data-qd="-1" data-i="${x}">−</button><b>${i.q}</b><button data-qd="1" data-i="${x}">+</button></span></li>`}).join("")||`<li class="none">Tu carrito está vacío</li>`;
  $("#total").textContent=fmt(tot);
  $("#sendCart").href=wa("Hola Lupipets, quiero hacer este pedido:\n"+cart.map(i=>{const p=P(i.id);return `• ${i.q} x ${p.nombre} (${p.tam}) – ${fmt(p.precio*i.q)}`}).join("\n")+`\nTotal referencial: ${fmt(tot)}\n¿Me confirman stock y si retiro en tienda o despacho?`);
  $("#sendCart").classList.toggle("dis",!n);
}
["#cartBtn","#cartBtn2"].forEach(s=>$(s).onclick=()=>$("#sheet").hidden=false);
$("#close").onclick=()=>$("#sheet").hidden=true; $("#sheet").onclick=e=>{if(e.target.id==="sheet")$("#sheet").hidden=true};
$("#clear").onclick=()=>{cart=[];save();};
const IC=n=>`<svg class="ic" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const CATN=c=>D.categorias.find(x=>x.id===c).nombre;
let dq=1;
function openDetail(id){const p=P(id); dq=1;
 $("#detBody").innerHTML=`<div class="dimg"><img src="${p.img}" alt="${p.nombre}">${p.badge?`<span class="badge ${p.antes?'off':''}">${p.badge}</span>`:''}</div>
 <div class="dinfo"><small class="brand">${p.marca}</small><h3>${p.nombre}</h3>
 <div class="tags"><span>${IC(p.mascota==="perro"?"dog":"cat")}${p.mascota==="perro"?"Perro":"Gato"}</span><span>${CATN(p.cat)}</span><span>${p.tam}</span></div>
 <div class="pr"><b>${fmt(p.precio)}</b>${p.antes?`<s>${fmt(p.antes)}</s>`:''}</div>
 <p class="ddesc">${p.descripcion}</p>
 <div class="drow"><span class="qty big"><button data-dq="-1" aria-label="Menos">−</button><b id="dqv">1</b><button data-dq="1" aria-label="Más">+</button></span>
 <button class="cta" id="dAdd">${IC("plus")} Agregar al carrito</button></div>
 <a class="cta wa full" id="dWa" target="_blank" rel="noopener"><svg class="ic wa-g"><use href="#i-wa"/></svg> Pedir por WhatsApp</a></div>`;
 const upd=()=>{$("#dqv").textContent=dq; $("#dWa").href=wa(`Hola Lupipets, quiero pedir: ${dq} x ${p.nombre} (${p.tam}) – ${fmt(p.precio*dq)}. ¿Tienen stock?`);}; upd();
 $("#detBody").onclick=e=>{const b=e.target.closest("[data-dq]"); if(b){dq=Math.max(1,dq+ +b.dataset.dq);upd();}
  if(e.target.closest("#dAdd")){const it=cart.find(i=>i.id===id); it?it.q+=dq:cart.push({id,q:dq}); save(); closeM(); const T=$("#toast"); T.classList.add("on"); setTimeout(()=>T.classList.remove("on"),1400);}};
 $("#detail").hidden=false; document.body.classList.add("lock");}
const closeM=()=>{$$(".modal").forEach(m=>m.hidden=true); document.body.classList.remove("lock");};
document.addEventListener("click",e=>{const o=e.target.closest("[data-open]"); if(o){e.stopPropagation(); openDetail(o.dataset.open);} if(e.target.closest("[data-close]")||e.target.classList.contains("modal")) closeM();},true);
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeM(); $("#sheet").hidden=true;}});
function promo(){ if(!C.PROMO_DELAY_MS||sessionStorage.getItem("lp_promo"))return;
 setTimeout(()=>{ if(!$$(".modal").every(m=>m.hidden))return; sessionStorage.setItem("lp_promo","1");
  $("#promoList").innerHTML=["p1","p3","p2"].map(P).map(p=>`<button class="pitem" data-open="${p.id}"><img src="${p.img}" alt=""><span><small>${p.marca}</small><b>${p.nombre}</b><em>${fmt(p.precio)}${p.antes?` <s>${fmt(p.antes)}</s>`:''}</em></span></button>`).join("");
  $("#promoWa").href=wa("Hola Lupipets, vi la promo de alimento para perros. ¿Qué opciones tienen?");
  $("#promo").hidden=false; document.body.classList.add("lock");},C.PROMO_DELAY_MS);}
$("#promoGo").onclick=()=>{closeM(); st={pet:"perro",cat:"alimento",q:"",of:false}; $("#q").value=""; render(); goShop();};
fetch("data/products.json").then(r=>r.json()).then(d=>{D=d; $("#rail").innerHTML=d.productos.filter(p=>p.badge).map(card).join(""); render(); cartUI(); promo();});
})();
