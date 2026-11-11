const demoProducts = [
 {section:"Produk UMKM",name:"Dapur Ummi",type:"Kue dan makanan ringan",location:"Meureubo",owner:"Ummi",featured:true,availability:"Tersedia",stock:"25 kemasan",description:"Aneka kue rumahan dibuat berdasarkan pesanan.",photo:"",admin:"6281234567890",facilitator:"6281234567891",coordinates:"4.1430,96.1280"},
 {section:"Produk UMKM",name:"Rumah Jahit Bersama",type:"Daster dan busana",location:"Peunaga",owner:"Kelompok Rumah Jahit",featured:true,availability:"Tersedia",stock:"12 pcs",description:"Produk jahitan kelompok usaha masyarakat.",photo:"",admin:"6281234567890",facilitator:"",coordinates:"4.1500,96.1300"},
 {section:"Produk Jasa",name:"Bengkel AC Sejuk",type:"Jasa servis AC",location:"Meureubo",owner:"Rahmat",availability:"Tersedia",stock:"Berdasarkan antrean",description:"Melayani perawatan dan perbaikan AC.",photo:"",admin:"",facilitator:"6281234567891",coordinates:"4.1450,96.1250"},
 {section:"Hasil Tani & Budidaya",name:"Kelompok Lele Limbek",type:"Ikan lele hasil budidaya",location:"Krueng 7",owner:"Kelompok Budidaya",availability:"Tidak Tersedia",stock:"0 kg",description:"Informasi panen akan diperbarui secara berkala.",photo:"",admin:"6281234567890",facilitator:"6281234567891",coordinates:"4.1600,96.1400"},
 {section:"Hasil Tani & Budidaya",name:"Kebun Sayur Sejahtera",type:"Sayuran segar",location:"Peunaga Cut Ujong",owner:"Kelompok Tani",availability:"Tersedia",stock:"30 ikat",description:"",photo:"",admin:"6281234567890",facilitator:"",coordinates:"4.1550,96.1320"}
];
const sectionMap={
 "produk umkm":"umkm",
 "produk jasa":"jasa",
 "jasa & layanan":"jasa",
 "fashion & kerajinan":"fashion",
 "peternakan / perikanan / pertanian":"tani",
 "hasil tani & budidaya":"tani",
 "bumg":"bumg",
 "usaha bumg":"bumg",
 "dll":"lainnya",
 "produk lainnya":"lainnya"
};
const sectionLabels={umkm:"Produk UMKM",jasa:"Jasa & Layanan",fashion:"Fashion & Kerajinan",tani:"Hasil Tani & Budidaya",bumg:"Usaha BUMG",lainnya:"Binaan Lainnya"};
const sectionKeys=Object.keys(sectionLabels);
let products=[...demoProducts], activeProduct=null;
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function normalize(v){return String(v??"").trim()}
function escapeHtml(v){return normalize(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function icon(name){return `<i data-lucide="${name}"></i>`}
function refreshIcons(){if(window.lucide)lucide.createIcons()}
function sectionKey(p){
 let s=normalize(p.section), low=s.toLowerCase();
 if(sectionMap[low])return sectionMap[low];
 if(low.includes("jasa"))return"jasa";
 if(low.includes("fashion")||low.includes("kerajinan"))return"fashion";
 if(low.includes("tani")||low.includes("budidaya")||low.includes("peternakan")||low.includes("perikanan")||low.includes("pertanian"))return"tani";
 if(low.includes("bumg"))return"bumg";
 if(low==="dll"||low.includes("lainnya"))return"lainnya";
 return"umkm";
}
function sectionLabel(p){return sectionLabels[sectionKey(p)]||"Produk Lokal";}
function isYes(v){return ["yes","ya","true","1"].includes(normalize(v).toLowerCase())}
function productCard(p){
 const unavailable=/tidak tersedia|habis|kosong/i.test(p.availability);
 const hasContact=normalize(p.admin)||normalize(p.facilitator);
 const image=p.photo?`<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=&quot;product-placeholder photo-error&quot; title=&quot;Periksa izin akses file foto di Google Drive&quot;>${icon("image-off")}<small>Foto belum dapat diakses</small></div>'">`:`<div class="product-placeholder photo-error">${icon("image-off")}<small>Foto belum diisi pada sheet</small></div>`;
 return `<article class="product-card"><div class="product-image">${image}<span class="product-category">${escapeHtml(sectionLabel(p))}</span></div><div class="product-content"><div class="product-type">${escapeHtml(p.type)}</div><h3>${escapeHtml(p.name)}</h3><div class="product-meta">
 <div class="meta-row">${icon("map-pin")}<span>${escapeHtml(p.location||"Lokasi belum dicantumkan")}</span></div>
 <div class="meta-row">${icon("user-round")}<span>${escapeHtml(p.owner||"Pemilik usaha")}</span></div>
 <div class="meta-row">${icon("circle-check")}<span class="availability ${unavailable?"no":"yes"}">${escapeHtml(p.availability||"Informasi belum tersedia")}</span></div>
 <div class="meta-row">${icon("package")}<span class="stock-line">Stok: ${escapeHtml(p.stock||"Belum diinformasikan")}</span></div>
 </div>${normalize(p.description)?`<div class="description">${escapeHtml(p.description)}</div>`:""}
 <div class="card-actions"><button class="order-btn" ${(!hasContact||unavailable)?"disabled":""} data-order="${products.indexOf(p)}">${icon("message-circle")} Pesan Sekarang</button>${normalize(p.coordinates)?`<button class="map-btn" title="Lihat lokasi usaha" data-map="${escapeHtml(p.coordinates)}">${icon("map-pinned")}</button>`:""}</div></div></article>`;
}
function emptyState(){return `<div class="empty-state">${icon("package-open")}<b>Belum ada produk yang ditampilkan</b><span>Produk akan muncul di sini setelah tersedia pada katalog.</span></div>`}
function renderGrid(key,query=""){
 let arr=key==="home"?products.filter(p=>p.featured===true):products.filter(p=>sectionKey(p)===key);
 if(query){let q=query.toLowerCase();arr=arr.filter(p=>[p.name,p.type,p.location,p.owner].join(" ").toLowerCase().includes(q))}
 const target=key==="home"?"#homeProducts":`#grid-${key}`;
 $(target).innerHTML=arr.length?arr.map(productCard).join(""):emptyState();
 if(key!=="home"){$(`#result-${key}`).textContent=`${arr.length} ${sectionLabels[key].toLowerCase()}`;}
 refreshIcons();
}
function renderAll(){
 renderGrid("home");sectionKeys.forEach(k=>renderGrid(k,$(`#search-${k}`)?.value||""));
 sectionKeys.forEach(k=>{const el=$(`#count-${k}`);if(el)el.textContent=products.filter(p=>sectionKey(p)===k).length;});
}
function showPage(key){
 $$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${key}`));
 $$(".nav-link").forEach(a=>a.classList.toggle("active",a.dataset.page===key));
 $("#crumb").textContent=key==="home"?"Home":(sectionLabels[key]||"Home");
 $("#sidebar").classList.remove("open");window.scrollTo({top:0,behavior:"smooth"});
}
function waUrl(number,p){
 let msg=`Hai Kak/bg, saya tertarik dengan produk ${p.type||"ini"} dari ${p.name||"usaha ini"} yang saya lihat di Katalog Produk UMKM Binaan Mifa.\n\nApakah produknya masih tersedia? Saya ingin mendapatkan informasi lebih lanjut mengenai produk dan pemesanannya.\n\nTerima kasih, Kak. 😊`;
 let n=normalize(number).replace(/\D/g,"");if(n.startsWith("0"))n="62"+n.slice(1);if(n.startsWith("8"))n="62"+n;
 return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`;
}
function openContact(index){
 const p=products[index];if(!p)return;activeProduct=p;
 $("#modalProduct").textContent=`${p.type} dari ${p.name}`;
 let options="";
 if(normalize(p.admin))options+=`<a class="contact-option admin" target="_blank" rel="noopener" href="${waUrl(p.admin,p)}">${icon("message-circle")} Hubungi Admin</a>`;
 if(normalize(p.facilitator))options+=`<a class="contact-option" target="_blank" rel="noopener" href="${waUrl(p.facilitator,p)}">${icon("user-round")} Hubungi Fasilitator</a>`;
 $("#contactOptions").innerHTML=options;
 $("#contactModal").classList.add("show");$("#contactModal").setAttribute("aria-hidden","false");refreshIcons();
}
function closeContact(){$("#contactModal").classList.remove("show");$("#contactModal").setAttribute("aria-hidden","true")}
function normalizeApiRow(r){
 const rawStatus=normalize(r.availability||r["Ketersediaan"]||r["Status"]);
 const availability=/available|tersedia|ready/i.test(rawStatus)?"Tersedia":/unavailable|tidak tersedia|habis|kosong/i.test(rawStatus)?"Tidak Tersedia":rawStatus;
 return {
  section:r.section||r.category||r["Tampil Web"],
  name:r.name||r.business_name||r["Nama Usaha"],
  type:r.type||r.product_type||r["Jenis Produk"],
  location:r.location||r["Lokasi Usaha"]||r["Gampong"]||r.gampong,
  owner:r.owner||r["Pemilik Usaha"]||r["Nama Pemilik"],
  availability:availability,
  stock:r.stock||r["Stok"],
  description:r.description||r["Keterangan"],
  photo:r.photo||r.image||r["Foto URL"]||r["Foto Produk"]||r["Foto"],
  admin:r.admin||r["Kontak Admin 1"]||r["Admin"]||r["Kontak"],
  facilitator:r.facilitator||r["Kontak Fasilitator"]||r["Fasilitator"],
  coordinates:r.coordinates||r["Koordinat"]||r["Lokasi"],
  featured:isYes(r.featured??r["Produk Pilihan"])
 };
}
async function loadData(){
 const url=window.MIFA_CONFIG?.API_URL;
 if(!url){renderAll();return}
 try{
  const res=await fetch(url);if(!res.ok)throw new Error("API tidak merespons");
  const data=await res.json();const rows=Array.isArray(data)?data:(data.data||data.rows||[]);
  const mapped=rows
   .filter(r=>isYes(r["Show on Web"]??r.show_on_web??r.showOnWeb))
   .map(normalizeApiRow)
   .filter(p=>p.name);
  if(mapped.length)products=mapped;renderAll();
 }catch(e){console.warn(e);renderAll();toast("Data contoh ditampilkan. Periksa koneksi API katalog.");}
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2600)}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-page]");if(nav){e.preventDefault();showPage(nav.dataset.page)}
 const go=e.target.closest("[data-go]");if(go)showPage(go.dataset.go);
 const order=e.target.closest("[data-order]");if(order)openContact(Number(order.dataset.order));
 const map=e.target.closest("[data-map]");if(map){let v=map.dataset.map;let url=/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(v)?`https://www.google.com/maps?q=${encodeURIComponent(v)}`:v.startsWith("http")?v:`https://www.google.com/maps?q=${encodeURIComponent(v)}`;window.open(url,"_blank","noopener")}
});
sectionKeys.forEach(k=>$(`#search-${k}`).addEventListener("input",e=>renderGrid(k,e.target.value)));
$("#menuToggle").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#modalClose").addEventListener("click",closeContact);
$("#contactModal").addEventListener("click",e=>{if(e.target.id==="contactModal")closeContact()});
loadData();refreshIcons();
