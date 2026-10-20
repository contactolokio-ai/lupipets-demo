(() => {
const C = window.CONFIG, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const wa = m => `https://wa.me/${C.WHATSAPP_NUMBER}?text=${encodeURIComponent(m)}`;
const fmt = p => "$" + p.toLocaleString("es-CL");
const BRANDS = ["Belcando","Leonardo","Hill's","hey!","Poema","Pet Family","Bravery","Churu"];
let LIM=8, D, st = {pet:"", cat:"", q:"", of:false}, cart = JSON.parse(localStorage.getItem("lp_cart")||"[]");
["#waTop","#waBottom","#waFab","#waStore","#fWa","#waEmpty"].forEach(s=>$(s).href=wa(C.WHATSAPP_MSG));
$("#mapsTop").href=$("#mapsLink").href=C.MAPS_URL; $("#addr").textContent=$("#fAddr").textContent=C.ADDRESS;
$("#fMail").href="mailto:"+C.EMAIL; $("#fMail").textContent=C.EMAIL; $("#fIg").href=C.INSTAGRAM_URL;
$("#mq").innerHTML = [...BRANDS,...BRANDS,...BRANDS].map(b=>`<span>${b}</span><i>🐾</i>`).join("");
$("#brands").innerHTML = BRANDS.map(b=>`<button class="br" data-q="${b}"><span>${b}</span><small>${b}</small></button>`).join("");
// carrusel
let si=0; const sl=$("#slides"), go=i=>{si=(i+3)%3; sl.style.transform=`translateX(-${si*100}%)`; $$("#dots button").forEach((d,k)=>d.classList.toggle("on",k===si));};
$$("#dots button").forEach((d,k)=>d.onclick=()=>{go(k);clearInterval(t)}); let t=setInterval(()=>go(si+1),5000);
const card = p => `<article class="card"><div class="pi"><img src="${p.img}" alt="${p.nombre}" loading="lazy">${p.badge?`<span class="badge ${p.antes?'off':''}">${p.badge}</span>`:''}</div>
<div class="pb"><small class="brand">${p.marca}</small><h3>${p.nombre}</h3><p>${p.tam} · ${p.desc}</p>
<div class="pr"><b>${fmt(p.precio)}</b>${p.antes?`<s>${fmt(p.antes)}</s>`:''}</div>
<button class="add" data-add="${p.id}">Agregar <span>+</span></button></div></article>`;
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
  $("#items").innerHTML=cart.map((i,x)=>{const p=P(i.id);return `<li><img src="${p.img}" alt=""><span><b>${p.nombre}</b><small>${p.tam} · ${fmt(p.precio)}</small></span><span class="qty"><button data-qd="-1" data-i="${x}">−</button><b>${i.q}</b><button data-qd="1" data-i="${x}">+</button></span></li>`}).join("")||`<li class="none">Tu carrito está vacío 🐾</li>`;
  $("#total").textContent=fmt(tot);
  $("#sendCart").href=wa("Hola Lupipets 🐾 quiero hacer este pedido:\n"+cart.map(i=>{const p=P(i.id);return `• ${i.q} x ${p.nombre} (${p.tam}) – ${fmt(p.precio*i.q)}`}).join("\n")+`\nTotal referencial: ${fmt(tot)}\n¿Me confirman stock y si retiro en tienda o despacho?`);
  $("#sendCart").classList.toggle("dis",!n);
}
["#cartBtn","#cartBtn2"].forEach(s=>$(s).onclick=()=>$("#sheet").hidden=false);
$("#close").onclick=()=>$("#sheet").hidden=true; $("#sheet").onclick=e=>{if(e.target.id==="sheet")$("#sheet").hidden=true};
$("#clear").onclick=()=>{cart=[];save();};
fetch("data/products.json").then(r=>r.json()).then(d=>{D=d; $("#rail").innerHTML=d.productos.filter(p=>p.badge).map(card).join(""); render(); cartUI();});
})();
