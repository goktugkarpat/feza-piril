/* geyik.js — Kuzey Işıkları'nın yavru ren geyiği (Bölüm 7).
   1) Ortak çizici: geyikCiz(c, x, y, s, t, o) — iri sıcak gözlü, kadife kahve-krem tüylü, sırtı beyaz benekli, kısa beyaz
      kuyruklu, hafif pembe yumuşak burunlu yavru ren geyiği. Boynuzları buz kristali dallardır: sönükken soluk mavi-gri,
      yandıkça her kristal kendi kuzey ışığı rengiyle içten parlar. Bütün parçalar bir kez önbellek tuvallerine çizilir;
      her karede yalnız drawImage, göz ve birkaç kısa yol (gradient/filtre/gölge üretilmez).
      (x, y) toynak tabanının ortası; s = 1'de sırt ≈ 44 birim, başın tepesi ≈ 80, boynuz uçları ≈ 108 (Feza 60).
      o = { yon 1|-1 (ara değer: dönüş), kos 0..1 (koşu; adım fazı t'den), zipla 0..1 (havada toplanma), kristal 0..1
            (10 kristalin yanan oranı; kesirli kısım sıradakini yavaşça yakar), renkler [renk..] (i. kristalin rengi; yoksa
            GY_KUZEY), bak -1..1 (+ baş aşağı / koklama, - yukarı bakış), cek 0..1 (kızak çekme: öne eğilir, koşum takılır),
            ek: alpha, parla 0..1 (kristallere ek nabız, finalde ritim), kulak -1..1 (+ dik), utanc 0..1 (başını eğip
            gözünü kaçırır), sevinc 0..1 (mutlu kapalı gözler + allık), uyku 0..1, buhar 0..1 (nefes buharı, varsayılan 1),
            faz (adım fazı başlangıcı; aynı t ile çizilen birden çok geyik ayrışsın) }
      Çizimden sonra GEYIK.kosum {x, y}: koşum halkasının (göğüs) tuval koordinatı (cek > 0 iken KIZAK ip bağlamak için).
   2) Dünya nesnesi tip:'geyik' — ilk karşılaşmada utangaç (Feza yaklaşınca başını eğip kulaklarını indirir, gözünü kaçırır,
      bir iki adım geri çekilir); Feza yanına gelince sevinçle zıplar (OLAY 'geyikTanis' {o}) ve ona eşlik etmeye başlar:
      Feza'nın arkasında yerde koşar, basamak ve boşlukları yumuşak bir zıplayışla geçer; çok geride kalırsa ışık izli
      uzun bir sıçrayışla yetişir (ışınlanma yok). OLAY 'karFener' {renk} geldikçe boynuzundaki bir kristal o renkle yanar.
      P.ucus sırasında (kızak yolculuğu) dünyadaki geyik görünmez (KIZAK kendisi çizer), bitince sıçrayarak geri gelir.
      Finalde (V7.final) KAR.final saatine göre dans eder. */
'use strict';

// Kuzey ışığı renkleri: kar.js fenerleri de bu sırayla yanar (i. fener ↔ i. kristal)
const GY_KUZEY = ['#7dffc4', '#ff8fd0', '#8fd8ff', '#c39bff', '#a6ffde', '#ffa6c9', '#6fe8ff', '#e0a8ff', '#b8ff9e', '#9fb8ff'];
const GY_RES = 5;             // önbellek tuvali: dünya birimi başına piksel
const GY_PI2 = Math.PI * 2;
// renkler: tüy, gölge, krem, kontur, benek, burun, toynak, kulak içi
const GY_P = { g: '#b07c58', gk: '#8c5d42', kr: '#f6e3c8', cz: '#5a3829', bn: '#fff6e8', bu: '#ee9fae', tk: '#5b4040', ki: '#f3c6bb' };
const GY = { spr: null, kris: new Map(), puf: null, isilti: null, sira: 0 };
// İskelet (sağa bakış, yer y = 0)
const GY_BX = -1, GY_BY = -38, GY_RX = 20.5, GY_RY = 13.5;   // gövde elipsi
const GY_KY = -31, GY_UST = 15, GY_ALT = 16;               // kalça yüksekliği, üst/alt bacak boyu
const GY_KALCA = [[-14, 0], [10, 0], [-11, 1], [13, 1]];   // [x, yakın mı]: uzak arka, uzak ön, yakın arka, yakın ön
const GY_NP = { x: 11, y: -45 };                           // baş + boyun dönme noktası
const GY_BK = 1.13, GY_BKX = 17, GY_BKY = -54;             // yavru: iri baş (baş katmanı bu noktadan büyütülür)
// boynuz kökleri (baş koordinatı) ve kristaller (boynuz koordinatı): [x, y, açı, boy]
const GY_BKOK = [[17.5, -78], [23, -79.5]];                 // uzak, yakın
const GY_KRIS = [[-5.2, -27.5, -.12, 1], [5.8, -18.6, .75, .9], [-13.6, -22.6, -1.05, .85], [4.8, -7.4, 1.25, .7], [-3.9, -15.2, -.45, .62]];
// kristal sırası (yanma): yakın boynuzun büyük ucu önce; yakın-uzak dönüşümlü
const GY_SIRA = [[1, 0], [0, 0], [1, 1], [0, 1], [1, 2], [0, 2], [1, 3], [0, 3], [1, 4], [0, 4]];

function gyTuval(x0, y0, w, h) {   // yerel koordinatlı önbellek tuvali: (x0, y0) sol üst köşe
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * GY_RES); c.height = Math.ceil(h * GY_RES);
  const q = c.getContext('2d'); q.scale(GY_RES, GY_RES); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  c.x0 = x0; c.y0 = y0; c.w = w; c.h = h;
  return { c, q };
}
function gyKoy(c, spr) { c.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h); }

// Gövde: yumuşak fıçı, kadife ışık, krem karın, sırtta beyaz benekler (yavru işareti), boyun ek yeri çizgisiz
function gyGovde(p) {
  const t = gyTuval(GY_BX - GY_RX - 3, GY_BY - GY_RY - 3, GY_RX * 2 + 6, GY_RY * 2 + 6), q = t.q;
  q.fillStyle = p.g; q.beginPath(); q.ellipse(GY_BX, GY_BY, GY_RX, GY_RY, 0, 0, GY_PI2); q.fill();
  q.save(); q.clip();
  const gr = q.createLinearGradient(0, GY_BY - GY_RY, 0, GY_BY + GY_RY); gr.addColorStop(0, 'rgba(255,236,214,.34)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(GY_BX - GY_RX, GY_BY - GY_RY, GY_RX * 2, GY_RY * 2);
  // krem karın
  q.fillStyle = p.kr; q.beginPath(); q.ellipse(GY_BX + 2, GY_BY + 10.5, 16, 5.5, 0, 0, GY_PI2); q.fill();
  // kadife parıltısı
  q.fillStyle = 'rgba(255,240,220,.22)'; q.beginPath(); q.ellipse(GY_BX - 3, GY_BY - 7.5, 13, 3.6, -.06, 0, GY_PI2); q.fill();
  // benekler: sırt boyunca iki sıra, arkaya doğru küçülür
  q.fillStyle = p.bn;
  for (const [x, y, r] of [[-14, -44.5, 1.5], [-8.5, -46.5, 1.8], [-2.5, -47.4, 1.9], [3.5, -46.8, 1.7], [9, -45, 1.4],
    [-16.5, -39.5, 1.2], [-11, -41.6, 1.5], [-5.5, -42.8, 1.6], [.5, -43, 1.5], [6, -42, 1.3], [-8, -37.2, 1.1], [-2, -38, 1.1]]) {
    q.globalAlpha = .9; q.beginPath(); q.ellipse(x, y, r * 1.15, r * .9, -.1, 0, GY_PI2); q.fill();
  }
  q.globalAlpha = 1;
  // ince tüy çizgileri
  q.strokeStyle = 'rgba(90,56,41,.16)'; q.lineWidth = .7;
  for (let i = 0; i < 7; i++) { const x = -15 + i * 4.6; q.beginPath(); q.moveTo(x, -33 + (i % 2)); q.quadraticCurveTo(x - 1, -30, x - 2.2, -28.5); q.stroke(); }
  q.restore();
  q.strokeStyle = p.cz; q.lineWidth = 1.5; q.beginPath(); q.ellipse(GY_BX, GY_BY, GY_RX, GY_RY, 0, -0.55, -1.32 + GY_PI2); q.stroke();
  return t.c;
}
// Baş + boyun (sağa bakar): yuvarlak kafa, krem ağız-burun, hafif pembe yumuşak burun, boyunda krem kabarık yaka, allık
function gyBas(p) {
  const t = gyTuval(-2, -86, 50, 52), q = t.q;
  const boyun = () => { q.beginPath(); q.moveTo(2, -36); q.bezierCurveTo(4, -48, 9, -58, 15, -66); q.lineTo(29, -60); q.bezierCurveTo(26, -52, 22, -44, 20, -36); q.closePath(); };
  const kafa = () => { q.beginPath(); q.arc(23, -68.5, 11.8, 0, GY_PI2); };
  const agiz = () => { q.beginPath(); q.ellipse(33.5, -63, 9, 6.8, .22, 0, GY_PI2); };
  q.strokeStyle = p.cz; q.lineWidth = 1.5; boyun(); q.stroke(); kafa(); q.stroke(); agiz(); q.stroke();
  q.fillStyle = p.g; boyun(); q.fill(); kafa(); q.fill(); agiz(); q.fill();
  q.save(); q.globalCompositeOperation = 'source-atop';
  const gr = q.createLinearGradient(12, -80, 20, -36); gr.addColorStop(0, 'rgba(255,236,214,.32)'); gr.addColorStop(.55, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(-2, -86, 50, 52);
  // krem ağız-burun ve alnın ortasında açık leke
  q.fillStyle = p.kr; q.beginPath(); q.ellipse(35, -61.6, 7.4, 5.4, .22, 0, GY_PI2); q.fill();
  q.fillStyle = mixc(p.g, p.kr, .45); q.beginPath(); q.ellipse(27.5, -75.5, 3.2, 2.2, .5, 0, GY_PI2); q.fill();
  q.fillStyle = 'rgba(255,240,220,.3)'; q.beginPath(); q.ellipse(19, -75, 6, 3.2, -.5, 0, GY_PI2); q.fill();
  // boyun önünde krem kabarık yaka (ren geyiği yelesi)
  q.fillStyle = p.kr;
  q.beginPath(); q.moveTo(26, -58); q.quadraticCurveTo(30, -54, 26.5, -51); q.quadraticCurveTo(30, -47, 25, -44); q.quadraticCurveTo(28, -40, 22, -37);
  q.lineTo(16, -40); q.quadraticCurveTo(19, -50, 22, -60); q.closePath(); q.fill();
  q.restore();
  q.strokeStyle = 'rgba(90,56,41,.35)'; q.lineWidth = .9;
  q.beginPath(); q.moveTo(26.5, -51); q.quadraticCurveTo(25, -50, 24, -49.5); q.moveTo(25, -44); q.quadraticCurveTo(23.5, -43.2, 22.5, -43); q.stroke();
  // burun: yumuşak pembe, parlak benekli
  q.fillStyle = p.bu; q.strokeStyle = mixc(p.bu, p.cz, .55); q.lineWidth = 1;
  q.beginPath(); q.ellipse(40.6, -65.2, 3.6, 2.9, .25, 0, GY_PI2); q.fill(); q.stroke();
  q.fillStyle = 'rgba(255,255,255,.65)'; q.beginPath(); q.ellipse(39.6, -66.4, 1.2, .8, .3, 0, GY_PI2); q.fill();
  // gülümseme
  q.strokeStyle = p.cz; q.lineWidth = 1.2; q.beginPath(); q.moveTo(34.5, -58.6); q.quadraticCurveTo(37.2, -56.4, 40, -58.8); q.stroke();
  // allık
  q.fillStyle = 'rgba(255,135,150,.38)'; q.beginPath(); q.ellipse(28.5, -62, 3.8, 2.3, -.1, 0, GY_PI2); q.fill();
  return t.c;
}
// Kulak: kökü (0,0), yaprak biçimli, geriye-yukarı uzanır. uzak: gölgeli
function gyKulak(p, uzak) {
  const t = gyTuval(-17, -9, 20, 14), q = t.q;
  q.beginPath(); q.moveTo(1.5, -2.6); q.quadraticCurveTo(-7, -7.6, -14.5, -3.6); q.quadraticCurveTo(-7.5, 3.2, 1.5, 2.4); q.closePath();
  q.strokeStyle = p.cz; q.lineWidth = 1.4; q.stroke(); q.fillStyle = uzak ? p.gk : p.g; q.fill();
  if (!uzak) {
    q.fillStyle = p.ki; q.beginPath(); q.moveTo(-.5, -1.2); q.quadraticCurveTo(-6.5, -4.8, -11.5, -3); q.quadraticCurveTo(-6.5, 1.2, -.5, 1); q.closePath(); q.fill();
    q.fillStyle = 'rgba(255,255,255,.3)'; q.beginPath(); q.ellipse(-7, -4.6, 3.2, .8, .2, 0, GY_PI2); q.fill();
  }
  return t.c;
}
// Üst bacak: kalça (0,0) → diz (0, GY_UST); tepesi gövdenin altında kalır
function gyUstBacak(p, uzak) {
  const t = gyTuval(-7, -9, 14, 28), q = t.q;
  const yol = () => { q.beginPath(); q.moveTo(-5.6, -8); q.bezierCurveTo(-6.4, 3, -3.6, 9, -2.5, 15.5); q.arc(0, 15.5, 2.5, Math.PI, 0, true); q.bezierCurveTo(3.6, 9, 6.4, 3, 5.6, -8); q.closePath(); };
  yol(); q.strokeStyle = p.cz; q.lineWidth = 1.4; q.stroke(); q.fillStyle = uzak ? p.gk : p.g; q.fill();
  q.fillStyle = uzak ? 'rgba(60,30,20,.12)' : 'rgba(255,236,214,.22)'; q.beginPath(); q.ellipse(-2.6, 2, 1.3, 9, .05, 0, GY_PI2); q.fill();
  return t.c;
}
// Alt bacak: diz (0,0) → toynak tabanı (0, GY_ALT); açık krem çorap + küçük çatal toynak
function gyAltBacak(p, uzak) {
  const t = gyTuval(-5, -3, 10, 21), q = t.q, gv = uzak ? p.gk : p.g, kr = uzak ? mixc(p.kr, '#8a6a64', .3) : p.kr, tk = uzak ? mixc(p.tk, '#2a1c28', .25) : p.tk;
  const bac = () => { q.beginPath(); q.moveTo(-2.4, -1); q.quadraticCurveTo(-1.6, 6, -2.1, 13); q.lineTo(2.1, 13); q.quadraticCurveTo(1.6, 6, 2.4, -1); q.closePath(); };
  const toy = () => { q.beginPath(); q.moveTo(-2.9, 12.4); q.quadraticCurveTo(-3.4, 16, 0, 16); q.quadraticCurveTo(3.6, 16, 3.1, 12.4); q.quadraticCurveTo(0, 11, -2.9, 12.4); q.closePath(); };
  q.strokeStyle = p.cz; q.lineWidth = 1.3; bac(); q.stroke(); toy(); q.stroke();
  q.fillStyle = gv; bac(); q.fill();
  q.fillStyle = kr; q.beginPath(); q.moveTo(-2.3, 8); q.lineTo(-2.1, 13); q.lineTo(2.1, 13); q.lineTo(2.3, 8); q.quadraticCurveTo(0, 6.8, -2.3, 8); q.fill();
  q.fillStyle = tk; toy(); q.fill();
  q.strokeStyle = 'rgba(0,0,0,.25)'; q.lineWidth = .6; q.beginPath(); q.moveTo(.4, 13); q.lineTo(.4, 15.6); q.stroke();
  return t.c;
}
// Kısa kabarık kuyruk: kökü (0,0), yukarı-geriye; üstü kahve, altı beyaz pamuk
function gyKuyruk(p) {
  const t = gyTuval(-9, -10, 13, 14), q = t.q;
  q.fillStyle = p.bn; q.strokeStyle = p.cz; q.lineWidth = 1.2;
  q.beginPath(); q.moveTo(1.5, 1.5); q.quadraticCurveTo(-3, 2.5, -6.8, -2); q.quadraticCurveTo(-8.4, -7, -4, -8.2); q.quadraticCurveTo(0, -6, 2, -1.5); q.closePath(); q.stroke(); q.fill();
  q.fillStyle = p.g; q.beginPath(); q.moveTo(2, -1.5); q.quadraticCurveTo(0, -6, -4, -8.2); q.quadraticCurveTo(-2.4, -4.6, .5, -1); q.closePath(); q.fill();
  q.fillStyle = 'rgba(255,255,255,.6)'; q.beginPath(); q.ellipse(-5, -3, 1.2, 2, .4, 0, GY_PI2); q.fill();
  return t.c;
}
// Buz kristali boynuz: kökü (0,0). Saydam buz dallar (soluk mavi-gri), içinde ince parlak çizgi. Kristaller canlı çizilir.
function gyBoynuz(uzak) {
  const t = gyTuval(-17, -32, 26, 35), q = t.q;
  const dal = () => {
    q.beginPath();
    q.moveTo(0, 1); q.quadraticCurveTo(-1, -6, -2, -10); q.quadraticCurveTo(-4.5, -15, -5.6, -18.5); q.quadraticCurveTo(-5.8, -22, -5.2, -25.5);   // ana dal
    q.moveTo(-2, -10); q.quadraticCurveTo(1.5, -12.5, 5, -17);      // ön dal
    q.moveTo(-5.6, -18.5); q.quadraticCurveTo(-9, -19.5, -12.4, -22); // arka dal
    q.moveTo(-.6, -4.5); q.quadraticCurveTo(2, -5.5, 3.8, -7);       // kaş dalı
    q.moveTo(-3, -13); q.lineTo(-3.4, -14.6);                         // orta düğüm
  };
  q.strokeStyle = uzak ? '#5f7896' : '#6d88a8'; q.lineWidth = 4.2; dal(); q.stroke();
  q.strokeStyle = uzak ? '#a9bdd2' : '#cfdfee'; q.lineWidth = 2.6; dal(); q.stroke();
  q.strokeStyle = 'rgba(255,255,255,' + (uzak ? .35 : .7) + ')'; q.lineWidth = .8;
  q.beginPath(); q.moveTo(-.6, -1); q.quadraticCurveTo(-1.4, -6, -2.4, -9.6); q.quadraticCurveTo(-4.4, -14.4, -5.2, -18); q.stroke();
  // kökte yumuşak tüy topuzu (boynuz kafaya otursun)
  q.fillStyle = GY_P.gk; q.beginPath(); q.ellipse(0, 1.2, 3, 1.8, 0, 0, GY_PI2); q.fill();
  return t.c;
}
// Kristal: (0,0) dibi, -y yönünde uzanan altıgen prizma. renk null: sönük buz. Bir kez (renk başına) önbelleğe.
function gyKristalSpr(renk) {
  const k = renk || '-';
  let c = GY.kris.get(k); if (c) return c;
  if (GY.kris.size > 40) GY.kris.clear();
  const t = gyTuval(-4.5, -11.5, 9, 13), q = t.q;
  const dis = () => { q.beginPath(); q.moveTo(0, .6); q.lineTo(-2.8, -1.8); q.lineTo(-3.1, -6.8); q.lineTo(0, -10.6); q.lineTo(3.1, -6.8); q.lineTo(2.8, -1.8); q.closePath(); };
  const govde = renk ? mixc(renk, '#ffffff', .35) : '#b8c7d8', kenar = renk ? mixc(renk, '#2a2050', .35) : '#6a809c', yuz = renk ? mixc(renk, '#ffffff', .72) : '#e4edf6';
  q.lineWidth = 1; q.strokeStyle = kenar; dis(); q.stroke(); q.fillStyle = govde; dis(); q.fill();
  // yüzeyler: sol açık, sağ koyu, ortada parlak sırt
  q.fillStyle = yuz; q.beginPath(); q.moveTo(0, .2); q.lineTo(-2.5, -2); q.lineTo(-2.7, -6.6); q.lineTo(0, -10); q.closePath(); q.fill();
  q.fillStyle = renk ? mixc(renk, '#4a3a8a', .2) : 'rgba(110,130,160,.55)'; q.beginPath(); q.moveTo(.3, 0); q.lineTo(2.5, -2); q.lineTo(2.7, -6.6); q.lineTo(.3, -9.6); q.closePath(); q.fill();
  q.strokeStyle = 'rgba(255,255,255,.85)'; q.lineWidth = .6; q.beginPath(); q.moveTo(-1.6, -2.4); q.lineTo(-1.8, -6.4); q.lineTo(-.2, -8.6); q.stroke();
  if (renk) { q.fillStyle = 'rgba(255,255,255,.9)'; q.beginPath(); q.ellipse(-.4, -5.4, .9, 2.2, 0, 0, GY_PI2); q.fill(); }
  GY.kris.set(k, t.c); return t.c;
}
function gyPufSpr() {   // nefes buharı: yumuşak beyaz bulutçuk (bir kez)
  if (GY.puf) return GY.puf;
  const c = document.createElement('canvas'); c.width = c.height = 48; const q = c.getContext('2d');
  const gr = q.createRadialGradient(24, 24, 0, 24, 24, 24); gr.addColorStop(0, 'rgba(250,252,255,.9)'); gr.addColorStop(.45, 'rgba(240,246,255,.45)'); gr.addColorStop(1, 'rgba(235,242,255,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 48, 48); GY.puf = c; return c;
}
function gyIsiltiSpr() {   // dört uçlu parıltı + hale (kristal çekirdeği, ışık izleri) — bir kez
  if (GY.isilti) return GY.isilti;
  const c = document.createElement('canvas'); c.width = c.height = 48; const q = c.getContext('2d');
  const gr = q.createRadialGradient(24, 24, 0, 24, 24, 24); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.25, 'rgba(230,248,255,.45)'); gr.addColorStop(1, 'rgba(220,240,255,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 48, 48);
  q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(24, 5); q.quadraticCurveTo(26, 22, 43, 24); q.quadraticCurveTo(26, 26, 24, 43); q.quadraticCurveTo(22, 26, 5, 24); q.quadraticCurveTo(22, 22, 24, 5); q.fill();
  GY.isilti = c; return c;
}
function gySprite() {
  if (GY.spr) return GY.spr;
  const p = GY_P;
  GY.spr = { govde: gyGovde(p), bas: gyBas(p), kulak: gyKulak(p, false), kulakU: gyKulak(p, true), ust: gyUstBacak(p, false), ustU: gyUstBacak(p, true),
    alt: gyAltBacak(p, false), altU: gyAltBacak(p, true), kuyruk: gyKuyruk(p), boy: gyBoynuz(false), boyU: gyBoynuz(true) };
  return GY.spr;
}
// Önbellekleri kareye yayarak ısıt (her çağrıda bir parça); hepsi hazırsa true
function geyikIsit() {
  if (!GY.spr) { gySprite(); return false; }
  if (!GY.kris.has('-')) { gyKristalSpr(null); gyPufSpr(); gyIsiltiSpr(); return false; }
  for (let i = 0; i < GY_KUZEY.length; i++) if (!GY.kris.has(GY_KUZEY[i])) { gyKristalSpr(GY_KUZEY[i]); return false; }
  return true;
}

// Bacak açıları: her çağrıda aynı 4 nesne. a üst bacak açısı, b diz bükümü (alt bacak = a + b).
// Koşu: sıçrayışlı dörtnala (arka çift → ön çift); diz salınım evresinde bükülür. Zıplama: ön bacaklar toplanır, arkalar uzar.
const GY_BAC = [{ a: 0, b: 0 }, { a: 0, b: 0 }, { a: 0, b: 0 }, { a: 0, b: 0 }];
const GY_FAZ = [0, 2.75, .45, 3.25];
function gyBacakHesap(ph, adim, z, cek, uyku) {
  for (let i = 0; i < 4; i++) {
    const on = i === 1 || i === 3, f = ph + GY_FAZ[i], sw = Math.sin(f), kalk = Math.max(0, Math.cos(f));
    let a = sw * .72 * adim, b = kalk * adim * (on ? 1.1 : -.7);
    if (cek) { a += on ? -.35 * cek : .45 * cek; b += on ? .15 * cek : -.25 * cek; }    // çekme: önler ileri uzanır, arkalar iter
    if (z) { a = lerp(a, on ? -.95 : .75, z); b = lerp(b, on ? 1.9 : -.35, z); }       // zıplama: önler katlanır, arkalar geriye uzanır
    if (uyku) { a = lerp(a, on ? -1.35 : 1.2, uyku); b = lerp(b, on ? 2.5 : -2.4, uyku); }   // yatarken bacaklar altına katlanır
    GY_BAC[i].a = a; GY_BAC[i].b = b;
  }
  return GY_BAC;
}
function gyBacakCiz(c, ust, alt, kx, ky, bc) {
  c.save(); c.translate(kx, ky); c.rotate(bc.a);
  c.save(); c.translate(0, GY_UST); c.rotate(bc.b); c.drawImage(alt, -5, -3, 10, 21); c.restore();
  c.drawImage(ust, -7, -9, 14, 28); c.restore();
}
function gyKulakCiz(c, spr, px, py, a) { c.save(); c.translate(px, py); c.rotate(a); c.drawImage(spr, -17, -9, 20, 14); c.restore(); }
// Bacağın toynak ucu (yerel): yer değmesi ve kar tozu için
function gyToynak(i, bc, yat, bob, out) {
  const kx = GY_KALCA[i][0], ky = GY_KY + yat + bob;
  const dx1 = -Math.sin(bc.a) * GY_UST, dy1 = Math.cos(bc.a) * GY_UST, a2 = bc.a + bc.b;
  out.x = kx + dx1 - Math.sin(a2) * GY_ALT; out.y = ky + dy1 + Math.cos(a2) * GY_ALT; return out;
}
const GY_TY = { x: 0, y: 0 };
const GY_VARS = { yon: 1, kos: 0, zipla: 0, kristal: 0 };
const GEYIK = { ciz: null, kosum: { x: 0, y: 0 }, renkler: GY_KUZEY, isit: geyikIsit, o: null };

function geyikCiz(c, x, y, s, t, o) {
  if (!c || !Number.isFinite(x) || !Number.isFinite(y) || !(s > 0) || !Number.isFinite(t)) return;
  o = o || GY_VARS;
  const kos = clamp(+o.kos || 0, 0, 1), z = clamp(+o.zipla || 0, 0, 1), cek = clamp(+o.cek || 0, 0, 1), alpha = o.alpha == null ? 1 : clamp(+o.alpha || 0, 0, 1);
  if (alpha < .003) return;
  const kris = clamp(+o.kristal || 0, 0, 1), parla = clamp(+o.parla || 0, 0, 1), utanc = clamp(+o.utanc || 0, 0, 1), sev = clamp(+o.sevinc || 0, 0, 1),
    uyku = clamp(+o.uyku || 0, 0, 1), kulakO = clamp(+o.kulak || 0, -1, 1), bak = Number.isFinite(o.bak) ? clamp(o.bak, -1, 1.2) : 0,
    buhar = o.buhar == null ? 1 : clamp(+o.buhar || 0, 0, 1), renk = o.renkler && o.renkler.length ? o.renkler : GY_KUZEY;
  let yon = Number.isFinite(o.yon) ? clamp(o.yon, -1, 1) : 1; if (Math.abs(yon) < .12) yon = yon < 0 ? -.12 : .12;
  const sp = gySprite(), yk = smooth(uyku);
  // adım fazı: koşarken hızlanır; sıçrayışlı dörtnala gövdeyi yaylandırır
  const ph = t * (8 + kos * 5) + (+o.faz || 0), adim = Math.max(kos, cek * .85) * (1 - z) * (1 - yk), nefes = Math.sin(t * (uyku > .5 ? 1.3 : 2.3));
  const bob = -Math.max(0, Math.sin(ph + .5)) * 6.5 * adim + nefes * .45 * (1 - yk) + cek * 3;
  const yat = yk * 17;
  const govRot = -z * .2 + Math.sin(ph + 2.0) * .085 * adim + cek * .1 + utanc * .04;
  const basRot = yk * .35 - z * .14 + bak * .3 + Math.sin(t * 1.25) * .035 * (1 - yk) - adim * .05 + Math.sin(ph + 1) * .06 * adim + cek * .22 + utanc * .3 - sev * .08;
  const ga = c.globalAlpha;
  c.save(); c.translate(x, y); c.scale(s * yon, s); if (alpha < 1) c.globalAlpha = ga * alpha;
  if (utanc > .002) c.translate(-utanc * 3, 0);

  const bac = gyBacakHesap(ph, adim, z, cek, yk);
  // bütün bacaklar gövdeden önce (tepeleri gövdenin altında kalır; uzaklar gölgeli)
  for (let i = 0; i < 4; i++) gyBacakCiz(c, i < 2 ? sp.ustU : sp.ust, i < 2 ? sp.altU : sp.alt, GY_KALCA[i][0], GY_KY + yat + bob, bac[i]);
  c.save(); c.translate(0, yat + bob); c.translate(GY_BX, -38); c.rotate(govRot); c.translate(-GY_BX, 38);
  // kuyruk: sevinçle sallanır, koşarken dik
  const kSal = Math.sin(t * (sev > .3 ? 13 : 2.2)) * (.12 + .3 * sev) + kos * -.25 - z * .2;
  c.save(); c.translate(-20.5, -45); c.rotate(kSal); c.drawImage(sp.kuyruk, -9, -10, 13, 14); c.restore();
  // baş + boyun (arkadan başlar; ek yeri gövdeyle örtülür). Uzak kulak ve uzak boynuz başın arkasında.
  c.save(); c.translate(GY_NP.x, GY_NP.y); c.rotate(basRot); c.translate(-GY_NP.x, -GY_NP.y);
  c.translate(GY_BKX, GY_BKY); c.scale(GY_BK, GY_BK); c.translate(-GY_BKX, -GY_BKY);
  const kirpK = Math.pow(Math.max(0, Math.sin(t * .61 + 1.7)), 40), dinle = Math.sin(t * 1.5) * .07 * (1 - yk);
  const kul = -yk * .5 + kulakO * .35 - utanc * .45 + sev * .25 + dinle - adim * .2;
  gyKulakCiz(c, sp.kulakU, 16, -72.5, -.25 - kul + Math.sin(t * 1.5 + .9) * .05);
  c.save(); c.translate(GY_BKOK[0][0], GY_BKOK[0][1]); c.rotate(-.3); c.scale(.82, .82); gyKoy(c, sp.boyU); gyKristaller(c, 1, t, kris, renk, parla, ga * alpha); c.restore();
  gyKoy(c, sp.bas);
  c.restore();
  // gövde (nefesle hafifçe kabarır)
  c.save(); c.translate(0, GY_BY + GY_RY); c.scale(1 - nefes * .008, 1 + nefes * (uyku > .5 ? .03 : .012)); c.translate(0, -(GY_BY + GY_RY)); gyKoy(c, sp.govde); c.restore();
  // kızak koşumu: göğüste yumuşak krem kayış + altın çıngırak
  if (cek > .02) gyKosum(c, cek, t, kos);
  c.restore();
  // baş katmanı (yeniden: gövdenin önünde kalan yakın kulak, yakın boynuz, göz, buhar)
  c.save(); c.translate(0, yat + bob); c.translate(GY_BX, -38); c.rotate(govRot); c.translate(-GY_BX, 38);
  c.translate(GY_NP.x, GY_NP.y); c.rotate(basRot); c.translate(-GY_NP.x, -GY_NP.y);
  c.translate(GY_BKX, GY_BKY); c.scale(GY_BK, GY_BK); c.translate(-GY_BKX, -GY_BKY);
  gyKulakCiz(c, sp.kulak, 17.5, -73.5, -.1 - kul - kirpK * .45);
  c.save(); c.translate(GY_BKOK[1][0], GY_BKOK[1][1]); c.rotate(.1); c.scale(.88, .88); gyKoy(c, sp.boy); gyKristaller(c, 0, t, kris, renk, parla, ga * alpha); c.restore();
  gyGoz(c, t, yk, z, sev, utanc);
  // nefes buharı: burundan öne-yukarı yükselip açılan küçük bulutçuklar (soğuk gece)
  if (buhar > .02) {
    const per = kos > .3 || cek > .3 ? 1.1 : 2.8, puf = gyPufSpr();
    for (let k = 0; k < 3; k++) {
      const u = ((t / per) + k / 3) % 1, al = u < .12 ? u / .12 : 1 - (u - .12) / .88;
      if (u > .62 && k > 0) continue;
      const px = 43 + u * (14 + 10 * kos), py = -64 - u * 9 + Math.sin(u * 6 + k) * 1.5, r = 2.5 + u * 8;
      c.globalAlpha = ga * alpha * buhar * al * .5; c.drawImage(puf, px - r, py - r, r * 2, r * 2);
    }
    c.globalAlpha = ga * alpha;
  }
  c.restore();
  // toynak kar tozu: koşarken yere vuran yakın toynaklardan küçük beyaz bulutçuk
  if (adim > .2) {
    const puf = gyPufSpr();
    for (let i = 0; i < 4; i++) {
      const b = bac[i]; if (Math.cos(ph + GY_FAZ[i]) > -.6) continue;
      gyToynak(i, b, yat, bob, GY_TY); if (GY_TY.y < -2) continue;
      const u = clamp((-Math.cos(ph + GY_FAZ[i]) - .6) / .4, 0, 1), r = 3 + u * 5;
      c.globalAlpha = ga * alpha * .35 * adim * (1 - u * .5); c.drawImage(puf, GY_TY.x - r - u * 6, -r * .8, r * 2, r * 1.4);
    }
    c.globalAlpha = ga * alpha;
  }
  c.globalAlpha = ga;
  c.restore();
  if (cek > .02) {   // koşum halkasının tuval konumu (KIZAK ip bağlar): yaklaşık göğüs
    const kx = 12, ky = -34 + yat + bob;
    GEYIK.kosum.x = x + kx * s * yon; GEYIK.kosum.y = y + ky * s;
  }
}
// Kristaller: boynuz koordinatında (dönüşüm kurulu). taraf 0 yakın, 1 uzak. Yanan kristal kendi rengiyle içten parlar.
function gyKristaller(c, taraf, t, kris, renk, parla, ga) {
  const n = kris * 10, isl = gyIsiltiSpr();
  for (let j = 0; j < 5; j++) {
    const m = GY_KRIS[j], sira = j * 2 + taraf, yan = clamp(n - sira, 0, 1), col = renk[sira % renk.length] || GY_KUZEY[sira % 10];
    c.save(); c.translate(m[0], m[1]); c.rotate(m[2]); const k = m[3] * (taraf ? .92 : 1); c.scale(k, k);
    if (yan < 1) { c.globalAlpha = ga * (taraf ? .85 : 1); c.drawImage(gyKristalSpr(null), -4.5, -11.5, 9, 13); }
    if (yan > 0) {
      const nb = .78 + .22 * Math.sin(t * (1.6 + j * .23) + sira * 1.7) + parla * .5 * (.5 + .5 * Math.sin(t * 6.3 + sira));
      c.globalAlpha = ga * yan; c.drawImage(gyKristalSpr(col), -4.5, -11.5, 9, 13);
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = ga * yan * .55 * nb * (taraf ? .75 : 1); c.drawImage(glow(col), -13, -18, 26, 26);
      c.globalAlpha = ga * yan * .3 * nb; c.drawImage(glow(col), -22, -27, 44, 44);
      const cr = 2.6 + 1.2 * Math.sin(t * 3.1 + sira * 2.3);   // içteki beyaz çekirdek pırıltısı
      c.globalAlpha = ga * yan * (.55 + .45 * nb); c.drawImage(isl, -cr, -5.4 - cr, cr * 2, cr * 2);
      if (yan < 1) { c.globalAlpha = ga * Math.sin(yan * Math.PI) * .9; c.drawImage(isl, -8, -13.5, 16, 16); }   // yanış anı parlaması
      c.globalCompositeOperation = 'source-over';
    }
    c.restore();
  }
  c.globalAlpha = ga;
}
// Koşum: göğüs önünde krem yumuşak kayış ve küçük altın çıngırak (kızak çekerken)
function gyKosum(c, cek, t, kos) {
  c.globalAlpha *= clamp(cek * 2, 0, 1);
  c.strokeStyle = '#8a4a5a'; c.lineWidth = 3.6; c.beginPath(); c.moveTo(4, -48); c.quadraticCurveTo(15, -42, 15.5, -30); c.stroke();
  c.strokeStyle = '#e0607a'; c.lineWidth = 2.4; c.stroke();
  c.strokeStyle = '#ffd3dc'; c.lineWidth = .7; c.stroke();
  const sl = Math.sin(t * (8 + kos * 6)) * .5, bx = 15 + sl, by = -33;
  c.fillStyle = '#f2c55c'; c.strokeStyle = '#a5762a'; c.lineWidth = .9; c.beginPath(); c.arc(bx, by, 2.6, 0, GY_PI2); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(bx - .8, by - .9, .8, 0, GY_PI2); c.fill();
}
// İri sıcak göz: koyu kahve, altta bal rengi parıltı, iki beyaz benek, kirpik. Kırpar; sevinçte mutlu kavis; utançta aşağı bakar.
function gyGoz(c, t, uyku, z, sev, utanc) {
  const gx = 26, gy = -70;
  const kf = t * .85 + .6, kirp = Math.max(Math.pow(Math.max(0, Math.sin(kf)), 60), Math.sin(kf * .29) > .6 ? Math.pow(Math.max(0, Math.sin(kf - .3)), 60) : 0);
  const kapak = Math.max(kirp, smooth(clamp((uyku - .25) / .45, 0, 1)));
  c.lineCap = 'round';
  if (sev > .55 || kapak > .82) {
    c.strokeStyle = '#3a2420'; c.lineWidth = 1.6; c.beginPath();
    if (sev > .55 && kapak <= .82) { c.moveTo(gx - 4.2, gy + 1.2); c.quadraticCurveTo(gx, gy - 3.6, gx + 4.2, gy + 1.2); }   // mutlu ^
    else { c.moveTo(gx - 4.2, gy + .5); c.quadraticCurveTo(gx, gy + 4, gx + 4.2, gy + .5); }
    c.stroke();
    c.lineWidth = 1; c.beginPath(); c.moveTo(gx - 3.4, gy - .4); c.lineTo(gx - 5.2, gy - 2); c.stroke();
    if (sev > .3) { c.fillStyle = 'rgba(255,130,150,' + (.3 + .25 * sev) + ')'; c.beginPath(); c.ellipse(gx + 2.5, gy + 7, 3.4, 1.8, 0, 0, GY_PI2); c.fill(); }
    return;
  }
  const ry = 5.6 * (1 - kapak), rx = 4.4, bk = utanc * 1.6;   // utançta göz bebeği aşağı-geriye kaçar
  c.fillStyle = '#3a2420'; c.beginPath(); c.ellipse(gx, gy, rx, ry, 0, 0, GY_PI2); c.fill();
  if (ry > 1.8) {
    c.fillStyle = '#9a5a32'; c.beginPath(); c.ellipse(gx + .3 - bk * .4, gy + ry * .4 + bk * .3, rx * .66, ry * .42, 0, 0, GY_PI2); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(gx - 1.3 - bk * .5, gy - ry * .42 + bk * .6, 1.6, 0, GY_PI2); c.fill();
    c.beginPath(); c.arc(gx + 1.6, gy + ry * .32, .75, 0, GY_PI2); c.fill();
  }
  c.strokeStyle = '#3a2420'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(gx - 3.2, gy - ry * .78); c.lineTo(gx - 5.4, gy - ry * .78 - 2); c.moveTo(gx - 1.2, gy - ry * .97); c.lineTo(gx - 2.2, gy - ry - 2.4); c.stroke();
  if (z > .3 || utanc > .3) { c.fillStyle = 'rgba(255,130,150,' + (.3 + .3 * utanc) + ')'; c.beginPath(); c.ellipse(gx + 2.5, gy + 7.4, 3.4, 1.8, 0, 0, GY_PI2); c.fill(); }
}
GEYIK.ciz = geyikCiz;

// ════════════════════ dünya nesnesi: yavru ren geyiği (eşlik eden dost) ════════════════════
// Durumlar: 'bekle' (utangaç; Feza yaklaşınca başını eğer, gözünü kaçırır, bir adım geri çekilir) → 'tanis' (sevinçle üç kez
// zıplar, kalpler) → 'eslik' (Feza'nın arkasında yerde koşar) · 'gizli' (P.ucus: kızak yolculuğu, KIZAK kendisi çizer) ·
// 'dans' (final). Yerde yürürken o.y zemin yüzeyidir; basamak, boşluk ve platformlara her zaman parametrik yumuşak bir yay
// (sıçrayış) ile geçer: çarpışma çözümü yok, takılma yok. Çok uzakta kalırsa ışık izli uzun sıçrayışla Feza'nın arkasına iner.
const GY_G = { KOS: 330, IVME: 1000, ARKA: 108, UZAK: 620 };
function gyZemin(x, yRef, ust) {   // x sütununda yRef'e yakın yüzey (ust: yukarıda en çok bu kadar arar). Yoksa null.
  if (typeof cell !== 'function' || typeof ROWS === 'undefined') return null;
  const tx = Math.floor(x / T), r0 = Math.max(0, Math.floor((yRef - (ust == null ? 2.4 * T : ust)) / T)), r1 = Math.min(ROWS - 1, Math.floor((yRef + 7 * T) / T));
  for (let r = r0; r <= r1; r++) {
    const c = cell(tx, r);
    if (c === 1 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;
    if (c === 2 && r * T >= yRef - 4 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;   // tek yönlü platform: yalnız ayak hizası ve altı
  }
  return null;
}
function gyZeminTam(x, y) {   // hedef noktadaki yüzey (platformlar dahil; y'nin hemen altı)
  if (typeof cell !== 'function' || typeof ROWS === 'undefined') return null;
  const tx = Math.floor(x / T);
  for (let r = Math.max(0, Math.floor((y - 6) / T)); r < ROWS && r * T < y + 7 * T; r++) { const c = cell(tx, r); if ((c === 1 || c === 2) && (r === 0 || cell(tx, r - 1) !== 1)) return r * T; }
  return null;
}
function gySicra(o, x1, y1, uzun) {   // parametrik yay: (o.x, o.y) → (x1, y1)
  const m = o.gy, d = Math.abs(x1 - o.x), dy = y1 - o.y;
  m.sic = { x0: o.x, y0: o.y, x1, y1, u: 0, T: uzun ? clamp(.75 + d / 900, .9, 1.5) : clamp(.38 + d / 520 + Math.max(0, -dy) / 500, .42, .85),
    h: uzun ? 150 + Math.max(0, -dy) * .5 : 26 + Math.max(0, -dy) * .55 + d * .06, uzun: !!uzun };
  if (Math.abs(x1 - o.x) > 4) m.yonH = x1 > o.x ? 1 : -1;
  if (uzun) burst(o.x, o.y - 40, 10, ['#bff4ff', '#ffffff', '#d9c8ff'], 90, .9, 5);
}
function gyKristalYak(o, renk) { const m = o.gy; m.renkler.push(renk || GY_KUZEY[m.renkler.length % 10]); m.parla = 1; }
function gyFenerSay() { return typeof V7 !== 'undefined' && V7 ? (V7.fener | 0) : 0; }
TUR.kaydet('geyik', {
  kur(o) {
    o.s = o.s || 1.1; o.yon = o.yon || -1; GEYIK.o = o;
    o.gy = { durum: 'bekle', t: (o.x * .011) % 5, yon: o.yon, yonH: o.yon, vx: 0, kos: 0, sic: null, zip: 0, utanc: 0, sev: 0, kulak: 0, bak: 0,
      tanT: 0, geriT: 0, geri: false, seviyeT: 0, uzakT: 0, kris: 0, renkler: [], ucan: [], parla: 0, alpha: 1, izX: o.x, hop: 0, hopV: 0, hopT: 2,
      opt: { yon: o.yon, kos: 0, zipla: 0, kristal: 0, renkler: null, bak: 0, cek: 0, parla: 0, kulak: 0, utanc: 0, sevinc: 0, alpha: 1, faz: 0 } };
    o.gy.opt.renkler = o.gy.renkler;
    // Fener yanınca: geyik yakındaysa fenerden boynuza ışık süzülür, varınca kristal yanar; uzaktaysa doğrudan yanar
    OLAY.on('karFener', e => {
      const m = o.gy, renk = e && e.renk || GY_KUZEY[m.renkler.length % 10];
      if (e && Number.isFinite(e.x) && Number.isFinite(e.y) && m.durum !== 'gizli' && Math.abs(e.x - o.x) < 900 && m.ucan.length < 6) m.ucan.push({ x0: e.x, y0: e.y, u: 0, renk });
      else gyKristalYak(o, renk);
    });
  },
  dokun(o) { gyTanis(o); },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    const m = o.gy; m.t += dt; m.zip = Math.max(0, m.zip - dt * 2.4); m.parla = Math.max(0, m.parla - dt * .8);
    // kristaller: yanan sayısına yumuşakça yetiş (kesirli kısım sıradaki kristali yavaşça yakar)
    while (m.renkler.length < Math.min(10, gyFenerSay() - m.ucan.length)) gyKristalYak(o, null);   // olay kaçtıysa (yeniden yükleme) yedek
    m.kris = Math.min(m.kris + dt * 1.6, m.renkler.length / 10);
    for (let i = m.ucan.length - 1; i >= 0; i--) { const u = m.ucan[i]; u.u += dt / 1.1; if (u.u >= 1) { gyKristalYak(o, u.renk); m.ucan.splice(i, 1); burst(o.x + m.yon * 22 * o.s, o.y - 100 * o.s, 8, [u.renk, '#ffffff'], 70, .7, 4); } }
    const fin = typeof V7 !== 'undefined' && V7 && V7.final;
    if (P.ucus && m.durum !== 'gizli' && m.durum !== 'bekle') { m.durum = 'gizli'; m.sic = null; }
    if (m.durum === 'gizli') { m.alpha = Math.max(0, m.alpha - dt * 3); if (!P.ucus && P.ground && DURUM === 'oyun') { m.durum = 'eslik'; gyGeriGel(o); } }
    else m.alpha = Math.min(1, m.alpha + dt * 3);
    if (fin && m.durum !== 'dans' && m.durum !== 'gizli') { if (m.durum === 'bekle') gyTanis(o); m.durum = 'dans'; m.yonH = 1; }
    // sıçrayış yayı (bütün durumlarda)
    if (m.sic) {
      const s = m.sic; s.u += dt / s.T; const u = Math.min(1, s.u), e = u;
      o.x = lerp(s.x0, s.x1, e); o.y = lerp(s.y0, s.y1, e) - Math.sin(u * Math.PI) * s.h;
      m.kos = lerp(m.kos, .5, Math.min(1, dt * 6));
      if (s.u >= 1) { o.x = s.x1; o.y = s.y1; m.sic = null; m.zip = .6; if (typeof dn7Iz === 'function') { try { dn7Iz(o.x, o.y, 'inis'); } catch (er) {} }
        burst(o.x, o.y - 2, s.uzun ? 12 : 5, ['#ffffff', '#e4ecff'], s.uzun ? 90 : 50, .6, 4); }
    }
    const dx = P.x - o.x;
    if (m.durum === 'bekle') {
      // utangaç: Feza yaklaşınca başını eğer, gözünü kaçırır; çok yaklaşınca bir adım geri çekilir; yanına gelince tanışır
      const d = Math.abs(dx), yak = d < 520 && Math.abs(P.y - o.y) < 260;
      m.utanc = clamp(m.utanc + (yak ? dt * 1.4 : -dt), 0, 1);
      m.yon += ((dx > 0 ? 1 : -1) - m.yon) * Math.min(1, dt * 4);
      if (!m.geri && d < 330 && !m.sic) { m.geri = true; const gx = o.x - Math.sign(dx) * 38, gyy = gyZemin(gx, o.y); if (gyy != null && Math.abs(gyy - o.y) < T * 1.5) gySicra(o, gx, gyy); }
      m.kulak = -m.utanc * .4 + Math.pow(Math.max(0, Math.sin(m.t * 1.7)), 24) * .8;   // kulağı ara sıra merakla oynar
      m.bak = m.utanc * .35 + Math.max(0, Math.sin(m.t * .9)) * .25 * m.utanc;
      if (d < 150 && Math.abs(P.y - o.y) < 120) gyTanis(o);
      return;
    }
    if (m.durum === 'tanis') {
      m.tanT += dt; m.utanc = Math.max(0, m.utanc - dt * 3); m.sev = 1; m.kulak = .8; m.bak = 0;
      m.yon += ((dx > 0 ? 1 : -1) - m.yon) * Math.min(1, dt * 6);
      // üç sevinç zıplaması (yerinde, yaylı)
      const k = Math.floor(m.tanT / .55); if (k < 3 && m.tanT - k * .55 < dt && !m.sic) { m.hopV = 330 - k * 40; if (typeof drFx === 'function') { try { drFx(o.x + m.yon * 20, o.y - 90, 'heart'); } catch (er) {} } }
      gyHop(m, dt);
      if (m.tanT > 1.9) { m.durum = 'eslik'; m.sev = .6; }
      return;
    }
    if (m.durum === 'dans') { gyDans(o, dt); return; }
    if (m.durum !== 'eslik') return;
    gyHop(m, dt);
    m.sev = Math.max(0, m.sev - dt * .3); m.utanc = 0; m.kulak = lerp(m.kulak, .2, dt * 2);
    if (m.sic || DURUM !== 'oyun' || P.fade > 0) return;
    // Feza'nın arkasındaki hedef
    const f = P.f || 1, hx = P.x - f * GY_G.ARKA, hdx = hx - o.x, uzak = Math.abs(dx) > GY_G.UZAK || Math.abs(P.y - o.y) > 7 * T;
    m.uzakT = uzak && P.ground ? m.uzakT + dt : 0;
    if (m.uzakT > .6) { m.uzakT = 0; gyGeriGel(o); return; }
    // seviye farkı: Feza yerde ve yakın ama başka yükseklikte (platform / basamak) → ona doğru sıçra
    const sev = P.ground && Math.abs(P.y - o.y) > T * .6 && Math.abs(dx) < 3.2 * T;
    m.seviyeT = sev ? m.seviyeT + dt : 0;
    if (m.seviyeT > .45) {
      m.seviyeT = 0;
      const tx = P.x - f * 44, ty = gyZeminTam(tx, P.y), ok = ty != null && Math.abs(ty - P.y) < 6;
      gySicra(o, ok ? tx : P.x, ok ? ty : P.y); return;
    }
    // yürüyüş / koşu: hedefe yaklaş (ölü bölge), Feza hızlıysa yetişmek için koşar
    const ister = Math.abs(hdx) < 22 ? 0 : clamp(hdx * 3.2, -GY_G.KOS, GY_G.KOS);
    m.vx = ister > m.vx ? Math.min(ister, m.vx + GY_G.IVME * dt) : Math.max(ister, m.vx - GY_G.IVME * dt);
    if (Math.abs(m.vx) > 8) {
      const yn = m.vx > 0 ? 1 : -1, nx = o.x + m.vx * dt, ileri = gyZemin(nx + yn * 14, o.y);
      if (ileri != null && Math.abs(ileri - o.y) <= 4) { o.x = nx; o.y = ileri; }
      else if (ileri != null && ileri < o.y && o.y - ileri <= 3.5 * T) {   // basamak yukarı: yumuşak zıplayış
        const kx = (Math.floor((nx + yn * 14) / T) + (yn > 0 ? 0 : 1)) * T + yn * 16, ky = gyZemin(kx, ileri + 2, 8);
        gySicra(o, kx, ky != null ? ky : ileri);
      } else if (ileri != null && ileri > o.y && ileri - o.y <= 3.5 * T) {   // basamak aşağı: minik hop
        const kx = o.x + yn * 34, ky = gyZemin(kx, ileri + 2, 8); gySicra(o, kx, ky != null ? ky : ileri);
      } else {   // boşluk ya da yüksek duvar: ileride inilecek yer ara
        let bul = false;
        for (let k = 1; k <= 7 && !bul; k++) {
          const kx = o.x + yn * (k * T + 18), ky = gyZemin(kx, o.y, 3.4 * T);
          if (ky != null && ky >= o.y - 3.4 * T && ky <= o.y + 6 * T && (yn > 0 ? kx <= Math.max(hx, P.x) + 60 : kx >= Math.min(hx, P.x) - 60)) { gySicra(o, kx, ky); bul = true; }
        }
        if (!bul) m.vx = 0;
      }
    }
    m.kos = lerp(m.kos, clamp(Math.abs(m.vx) / 300, 0, 1), Math.min(1, dt * 6));
    const hedefYon = Math.abs(m.vx) > 20 ? Math.sign(m.vx) : Math.abs(dx) > 30 ? Math.sign(dx) : m.yonH;
    m.yonH = hedefYon; m.yon += (m.yonH - m.yon) * Math.min(1, dt * 7);
    // karda toynak izi
    if (Math.abs(o.x - m.izX) > 26) { m.izX = o.x; if (typeof dn7Iz === 'function') { try { dn7Iz(o.x, o.y, 'geyik'); } catch (er) {} } }
    // dururken ara sıra yere eğilip karı koklar, kulak oynatır
    m.bak = Math.abs(m.vx) < 10 ? Math.max(0, Math.sin(m.t * .5)) ** 6 * .9 : 0;
  },
  ciz(o, tm) {
    const m = o.gy, s = o.s, hop = m.hop || 0, havada = m.sic ? Math.sin(Math.min(1, m.sic.u) * Math.PI) * m.sic.h : 0;
    if (m.alpha <= .01) { gyUcanCiz(o, tm); return; }
    const isl = gyIsiltiSpr();
    // uzun sıçrayışın ışık izi (geçmiş konumlar analitik)
    if (m.sic && m.sic.uzun) {
      const sc = m.sic; g.save(); g.globalCompositeOperation = 'lighter';
      for (let j = 1; j <= 8; j++) { const u = sc.u - j * .035; if (u <= 0) break; const x = lerp(sc.x0, sc.x1, u), y = lerp(sc.y0, sc.y1, u) - Math.sin(u * Math.PI) * sc.h - 50 * s;
        g.globalAlpha = (1 - j / 9) * .5; g.drawImage(glow(GY_KUZEY[j % 10]), x - 16, y - 16, 32, 32); g.globalAlpha = (1 - j / 9) * .8; g.drawImage(isl, x - 5, y - 5, 10, 10); }
      g.restore();
    }
    // yer gölgesi (havadayken küçülür)
    const gyer = m.sic ? lerp(m.sic.y0, m.sic.y1, Math.min(1, m.sic.u)) : o.y;
    g.save(); g.globalAlpha = .2 * m.alpha * (1 - Math.min(.7, (havada + hop) / 120)); g.fillStyle = '#2a2a55'; g.beginPath(); g.ellipse(o.x, gyer - 1, 24 * s, 4 * s, 0, 0, GY_PI2); g.fill(); g.restore();
    const op = m.opt, z = Math.max(m.zip, m.sic ? clamp(Math.sin(Math.min(1, m.sic.u) * Math.PI) * 1.3, 0, 1) : 0, clamp(hop / 14, 0, 1));
    op.yon = m.yon; op.kos = m.sic ? 0 : m.kos; op.zipla = z; op.kristal = m.kris; op.bak = m.bak; op.kulak = m.kulak; op.utanc = m.utanc; op.sevinc = m.sev;
    op.parla = Math.max(m.parla, m.dansParla || 0); op.alpha = m.alpha; op.faz = o.x * .001;
    geyikCiz(g, o.x, o.y - hop, s, m.t, op);
    gyUcanCiz(o, tm);
  },
});
function gyTanis(o) {
  const m = o.gy; if (m.durum !== 'bekle') return;
  m.durum = 'tanis'; m.tanT = 0; m.sev = 1;
  burst(o.x, o.y - 50, 18, ['#bff4ff', '#ffffff', '#ffc4ec', '#d9c8ff'], 120, 1.1, 6);
  if (typeof ripples !== 'undefined') ripples.push({ x: o.x, y: o.y - 30, r: 0, life: 1.4, small: true });
  OLAY.emit('geyikTanis', { o });
}
function gyHop(m, dt) { if (m.hopV || m.hop > 0) { m.hop += m.hopV * dt; m.hopV -= 1500 * dt; if (m.hop <= 0) { m.hop = 0; m.hopV = 0; } } }
// Çok geride kaldı / kızaktan döndü: Feza'nın arkasına ışık izli uzun sıçrayış (görünmüyorsa ekran dışından gelir)
function gyGeriGel(o) {
  const m = o.gy, f = P.f || 1, tx = P.x - f * GY_G.ARKA;
  let ty = gyZeminTam(tx, P.y), x1 = tx; if (ty == null || Math.abs(ty - P.y) > T * 1.5) { x1 = P.x; ty = P.y; }
  if (m.alpha < .5 || Math.abs(o.x - P.x) > 1400) { o.x = P.x - f * 520; o.y = ty - 220; m.alpha = 0; }   // ekran dışından süzülerek gelir
  m.vx = 0; gySicra(o, x1, ty, true);
}
// Fenerden boynuza süzülen ışık (yay + iz); varınca kristal yanar
function gyUcanCiz(o, tm) {
  const m = o.gy; if (!m.ucan.length) return;
  const isl = gyIsiltiSpr(), bx = o.x + m.yon * 22 * o.s, by = o.y - (m.hop || 0) - 98 * o.s;
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < m.ucan.length; i++) {
    const u = m.ucan[i];
    for (let j = 0; j < 6; j++) {
      const k = clamp(u.u - j * .04, 0, 1), e = smooth(k), x = lerp(u.x0, bx, e), y = lerp(u.y0, by, e) - Math.sin(k * Math.PI) * 120;
      g.globalAlpha = (1 - j / 6) * (j ? .45 : .8); g.drawImage(glow(u.renk), x - (16 - j * 2), y - (16 - j * 2), 32 - j * 4, 32 - j * 4);
      if (!j) { g.globalAlpha = .95; g.drawImage(isl, x - 7, y - 7, 14, 14); }
    }
  }
  g.restore();
}
// Final dansı: KAR.final saatine (karFinalAn / karFinalNabiz, kar.js) bağlı. Feza'nın yanında vuruşta hoplar, ara ara yerinde
// döner; dorukta büyük sevinç sıçrayışları. Boynuz kristallerinin hepsi yanar, vuruşla nabız atar.
function gyDans(o, dt) {
  const m = o.gy, a = typeof karFinalAn === 'function' ? karFinalAn() : 0, nb = typeof karFinalNabiz === 'function' ? karFinalNabiz() : 0;
  m.sev = Math.min(1, m.sev + dt); m.utanc = 0; m.kulak = .6;
  while (m.renkler.length < 10) m.renkler.push(GY_KUZEY[m.renkler.length % 10]);
  m.kris = Math.min(1, m.kris + dt * .5); m.dansParla = .35 + .65 * nb;
  if (!m.sic) {
    const tp = typeof KY !== 'undefined' && KY.tepe ? KY.tepe.x : P.x - 1, hx = P.x + (P.x < tp ? -96 : 96), ty = gyZeminTam(hx, P.y);
    if (Math.abs(o.x - hx) > 6 && ty != null && Math.abs(ty - P.y) < 50) {
      if (Math.abs(o.x - hx) > 60) gySicra(o, hx, ty);
      else { o.x += clamp(hx - o.x, -150 * dt, 150 * dt); o.y = ty; m.kos = .3; }
    } else m.kos = lerp(m.kos, 0, dt * 4);
    // vuruşta hop (0,6 sn); dorukta (karFinalDoruk) daha yüksek
    const vur = .6, k0 = Math.floor((a - dt) / vur), k1 = Math.floor(a / vur), dor = typeof KAR_FIN !== 'undefined' && a >= KAR_FIN.DORUK && a < KAR_FIN.DORUK + 5;
    if (a > 3 && k1 > k0 && m.hop <= 0 && (dor || k1 % 2 === 0)) m.hopV = dor ? 420 : 260;
    // ara ara yerinde dönüş (yön değiştirir)
    if (a > 3 && k1 > k0 && k1 % 8 === 4) m.yonH = -m.yonH;
    if (a > 3 && k1 > k0 && k1 % 8 === 0) m.yonH = P.x > o.x ? 1 : -1;
  }
  m.yon += (m.yonH - m.yon) * Math.min(1, dt * 6);
  gyHop(m, dt);
}
