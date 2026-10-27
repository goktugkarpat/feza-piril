/* golet12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün): kampüs göleti ve anneyle kayık gezisi. Sözleşme: src/BOLUM12.md.
   k12Golet (sütun 665–830): göletin canlıları ve oyun düzlemindeki su.
     · Su şeridi (686–807): ışıltılı yüzey, yumuşak dalgacıklar, gökyüzü/gün batımı yansıması (dn12Isik), iskele ve kayık
       yansımaları, kayığın ardında iz, kürek halkaları. gl12SuCiz(tm) zemin katmanında çizilir (zemin12.js çağırır; çağırmazsa
       k12Golet.ciz kendisi çizer).
     · Ördek ailesi: anne ördek + 5 yavru kıyıda dolaşır; Feza yaklaşınca sırayla peşine takılır (OLAY 'k12OrdekKatildi'),
       kayıkta kayığın ardından yüzerek dizilir, karşı kıyıda yine Feza'nın peşinden gelir. Dokununca vaklar; sudaysa dalıp çıkar.
     · Nilüferler (kayık yanından geçince ya da dokununca açılır), zıplayan balıklar, selam veren kuğu, taşta güneşlenen kaplumbağa.
   k12Kayik (iskele 690 → karşı iskele 805): ahşap kayık. Feza iskelenin ucuna yürüyünce kayığa adımını atar (P.ucus = kayık),
     anne arkasından gelip oturur ve kürek çeker (ANNE12.devral + anne12Ciz 'kayik_kurek'), Pırıl yanlarında uçar. Ekrana basılı
     tutunca kürekler hızlanır, bırakınca kayık yavaşça süzülür (hiç durmaz). Karşı iskelede Feza ayağa kalkıp iskeleye çıkar
     (P.x sıçramaz), anne de arkasından iner (ANNE12.birak). Kayık sonra yavaşça döner ve o iskelede bekler; Feza geri gelirse
     aynı yolu ters yöne de götürür. Feza kayık olmadan suya yürüyemez (iskelenin ucu doğrudan kayığa açılır).
   Olaylar: k12KayikBasla/Bitti {o, yon}, k12Kurek {kim, guc}, k12OrdekKatildi {n}, k12OrdekVak {x, yavru}, k12OrdekDal {x},
     k12BalikZipla {x}, k12Sicrama {x, guc}, k12Nilufer {x}, k12Kugu {x}, k12SuDokun {x}. Durum: V12.kayik, V12.ordek, V12.kayikHiz.
   Performans: kayık gövdesi, iskeleler, nilüfer yaprağı ve su rengi önbellek tuvallerinde (bir kez çizilir); karede gradyan yok,
   parçacık/halka/iz havuzları sabit boyutlu, karede yeni dizi/nesne üretilmez. Yalnız BOLUM_NO === 12 iken çalışır. */
'use strict';

// ════════════════════════ Yerleşim (dünya birimi; T = 40) ════════════════════════
const GL12_SU = { x0: 686 * T, x1: 807 * T, ust: 702 };                                  // oyun düzlemindeki su şeridi
const GL12_ISK = { L0: 689 * T, L1: 700 * T, R0: 793 * T, R1: 806 * T, y: 720, suY: 734 };  // iskele tahtaları (üstü y = 720)
const GL12_KIYI = { L: 690 * T, R: 805 * T, sinirL: 665 * T, sinirR: 830 * T };            // kıyı çizgisi ve gölet bölgesi
const GL12_K = {
  suY: 742,                                   // kayığın su çizgisi
  // Bekleyen kayık iskelenin ucuna yanaşık durur (oturağı iskele ucunun önünde: Feza yürüyünce doğrudan biner).
  // Varışta ise burnu iskeleye değer (gövde iskelenin önünü kapatmaz); anne kayığın içinde öne yürüyüp iskeleye çıkar.
  merkezL: 700 * T - 56, merkezR: 793 * T + 56,   // iki iskelede bekleyen kayığın merkezi
  varisL: 700 * T + 107, varisR: 793 * T - 107,   // varışta kayığın merkezi (sola / sağa giderken)
  fezaX: 44, fezaY: 1,                        // Feza'nın altındaki kayık tabanı (oturak 13 birim yukarıda: FEZA12_ARAC.kayik)
  anneX: -30, anneY: 6,                       // annenin ayak tabanı (kayığın tabanı)
  kicAdim: -82,                               // binerken annenin kayığa adım attığı yer (kıça yakın)
  fezaBin: -66,                               // Feza kayığın bu hizasına gelince zıplayıp oturağına konar
  iskarmozX: -31, iskarmozY: -21,             // kürek pivotu (küpeşte üstünde)
  kurekBoy: 60,                               // pivottan pala ucuna
  hizSuz: 105, hizBas: 290,                   // bırakınca süzülme / basılı tutunca hız (birim/sn)
  binisSure: 0.85, inisSure: 0.8
};
// Nilüferler: [sütun, şerit (0 arka, 1 ön)]
const GL12_NILUFER = [[704, 0], [711, 1], [719, 0], [727, 1], [736, 0], [744, 1], [754, 0], [762, 1], [771, 0], [779, 1], [788, 0]];
const GL12_BALIK = [716, 733, 750, 767, 784];      // balıkların zıpladığı sütunlar
const GL12_ARKA_Y = 718, GL12_ON_Y = 768;          // arka / ön nilüfer şeridi (su yüzeyindeki derinlik)
const GL12_ORDEK_SU = 739;                         // ördeklerin yüzdüğü şerit
const GL12_KUGU_S = 1.3;                           // kuğunun boyu

// ════════════════════════ Modül durumu ════════════════════════
const GL = {
  golet: null, kayik: null,
  kareT: -1, suKare: -1, t: 0,
  K: 0, spr: null,                                // önbellek tuvalleri (K: dünya birimi başına piksel)
  halka: [], iz: [],                              // su halkaları ve kayık izi havuzları
  ordek: [], nilufer: [], balik: [], kugu: null, kap: null,
  izX: new Float32Array(400), izS: new Float64Array(400), izN: 0, izI: 0, izSon: 0, izTop: 0,   // ördeklerin izlediği yol
  fopt: { u: 0, arac: 'kayik', kurek: undefined, aci: 0, salla: 0 },                          // fezaPoz12 seçenekleri (tek nesne)
  aopt: { poz: 'dur', yon: 1, hiz: 0, kurek: 0, bak: 0 },                                       // anne12Ciz seçenekleri (tek nesne)
  nokta: { x: 0, y: 0 },
  katilan: 0
};
for (let i = 0; i < 40; i++) GL.halka.push({ on: false, x: 0, y: 0, r: 0, t: 0, sure: 1, guc: 1 });
for (let i = 0; i < 56; i++) GL.iz.push({ on: false, x: 0, y: 0, t: 0, yon: 1, guc: 1 });

function gl12Aktif() { return typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 12; }
function gl12Hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function gl12Olay(ad, v) { if (typeof OLAY !== 'undefined' && OLAY && OLAY.emit) OLAY.emit(ad, v); }
function gl12V() { return typeof V12 !== 'undefined' && V12 ? V12 : null; }
function gl12Ekranda(x, pay) { return x > cam.x - pay && x < cam.x + VW + pay; }
function gl12Alt() { return cam.y + H / S + 6; }   // ekranın altındaki dünya y'si

// Su halkası (kürek, damla, ördek, dokunuş). Havuz doluysa en eskisinin yerine yazılır.
function gl12Halka(x, y, r, sure, guc) {
  let h = null, en = null;
  for (const q of GL.halka) { if (!q.on) { h = q; break; } if (!en || q.t / q.sure > en.t / en.sure) en = q; }
  h = h || en;
  h.on = true; h.x = x; h.y = y; h.r = r; h.t = 0; h.sure = sure; h.guc = guc;
}
function gl12Sicrat(x, y, n, guc) {   // su damlacıkları (ortak parçacık sistemi; oyun.js drawFx çizer)
  if (typeof burst === 'function') burst(x, y, n, ['#ffffff', '#dff4ff', '#bfe6f7'], 70 + 60 * guc, 0.55, 4);
}

// ════════════════════════ Önbellek tuvalleri ════════════════════════
function gl12Tuval(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }

// Kayık gövdesinin dış yüzü (yan görünüş, sağa bakar): küpeşte çizgisi kıçtan pruvaya, omurga pruvadan kıça.
function gl12GovdeYol(c) {
  c.beginPath();
  c.moveTo(-101, -30);
  c.quadraticCurveTo(-40, -18, 20, -21);
  c.quadraticCurveTo(72, -23, 104, -37);
  c.quadraticCurveTo(97, -6, 66, 9);
  c.quadraticCurveTo(10, 19, -60, 14);
  c.quadraticCurveTo(-93, 10, -99, -4);
  c.closePath();
}
// Küpeşte çizgisini dy kadar aşağı kaydırarak izler (tahta şeritleri, boya bandı)
function gl12Seritt(c, dy) {
  c.beginPath();
  c.moveTo(-101, -30 + dy);
  c.quadraticCurveTo(-40, -18 + dy, 20, -21 + dy);
  c.quadraticCurveTo(72, -23 + dy, 106, -37 + dy * 1.1);
}

function gl12KayikDis(K) {   // dış gövde: ahşap, tahta şeritleri, deniz mavisi + krem boya bandı, pruvada kalp
  const c = gl12Tuval(224 * K, 72 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(112, 44);
  x.lineJoin = 'round'; x.lineCap = 'round';
  gl12GovdeYol(x);
  x.fillStyle = dn12Renk(x, -40, 18, '#d6955a', '#a8683a');
  x.fill();
  x.save();
  gl12GovdeYol(x); x.clip();
  for (let k = 1; k <= 4; k++) {                       // tahta şeritleri (bindirme kaplama)
    gl12Seritt(x, 8 * k + 3); x.strokeStyle = 'rgba(110,62,32,.55)'; x.lineWidth = 1.1; x.stroke();
    gl12Seritt(x, 8 * k + 4.3); x.strokeStyle = 'rgba(255,220,170,.28)'; x.lineWidth = 0.8; x.stroke();
  }
  gl12Seritt(x, 5.2); x.strokeStyle = '#2f9fa3'; x.lineWidth = 4.2; x.stroke();     // boya bandı
  gl12Seritt(x, 8.6); x.strokeStyle = '#fff2dc'; x.lineWidth = 1.5; x.stroke();
  gl12Seritt(x, 4.0); x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; x.stroke();
  x.fillStyle = 'rgba(60,32,18,.22)'; x.fillRect(-110, 0, 220, 30);                  // su altındaki ıslak kısım
  x.fillStyle = 'rgba(255,236,200,.16)'; x.beginPath(); x.ellipse(10, -8, 70, 6, -0.02, 0, Math.PI * 2); x.fill();   // gövdede yumuşak parlaklık
  x.restore();
  // pruvada minik kalp
  x.save(); x.translate(80, -16); x.scale(0.9, 0.9);
  x.fillStyle = '#ff8aa6'; x.beginPath(); x.moveTo(0, 3.6); x.bezierCurveTo(-6, -1, -3, -6.2, 0, -2.6); x.bezierCurveTo(3, -6.2, 6, -1, 0, 3.6); x.fill();
  x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(-1.8, -2.6, 1.1, 0.7, -0.5, 0, Math.PI * 2); x.fill();
  x.restore();
  // küpeşte (kalın, koyu ahşap; üstünde ince ışık)
  gl12Seritt(x, 0); x.strokeStyle = '#7a4727'; x.lineWidth = 3.6; x.stroke();
  gl12Seritt(x, -0.9); x.strokeStyle = '#eab57c'; x.lineWidth = 1.1; x.stroke();
  gl12GovdeYol(x); x.strokeStyle = 'rgba(90,50,26,.8)'; x.lineWidth = 1.1; x.stroke();
  return c;
}
function gl12KayikIc(K) {   // iç yüz: karşı küpeşte ile yakın küpeşte arasında görünen iç tahtalar, kaburgalar, oturaklar
  const c = gl12Tuval(224 * K, 72 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(112, 44);
  x.lineJoin = 'round'; x.lineCap = 'round';
  x.beginPath();
  x.moveTo(-100, -34); x.quadraticCurveTo(-40, -27, 20, -28); x.quadraticCurveTo(72, -30, 103, -39);
  x.lineTo(104, -36); x.quadraticCurveTo(72, -22, 20, -20); x.quadraticCurveTo(-40, -17, -101, -29);
  x.closePath();
  x.fillStyle = '#8c5634'; x.fill();
  x.save(); x.clip();
  x.strokeStyle = 'rgba(80,44,24,.7)'; x.lineWidth = 1.6;
  for (let i = -80; i <= 90; i += 24) { x.beginPath(); x.moveTo(i, -40); x.lineTo(i + 1, -16); x.stroke(); }   // kaburgalar
  x.fillStyle = '#c99260';                              // oturak tahtaları (iki ucu görünür)
  x.fillRect(GL12_K.fezaX - 12, -26, 24, 4); x.fillRect(GL12_K.anneX - 14, -25, 28, 4);
  x.restore();
  x.beginPath(); x.moveTo(-100, -34); x.quadraticCurveTo(-40, -27, 20, -28); x.quadraticCurveTo(72, -30, 103, -39);
  x.strokeStyle = '#b07a48'; x.lineWidth = 2.4; x.stroke();
  return c;
}
// Önbellek tuvallerinde (yalnız bir kez) kullanılan dikey renk geçişi
function dn12Renk(x, y0, y1, a, b) { const gr = x.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; }

function gl12Iskele(K, w, sag) {   // iskele: tahta güverte, ön yüz, direkler, uçta fener direği ve halat babası
  const c = gl12Tuval((w + 40) * K, 90 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(20, 14);           // yerel: x 0..w, y 0 = dünya 706
  x.lineJoin = 'round'; x.lineCap = 'round';
  const ust = 4, on = 18, alt = 26;              // güverte üstü 710, ön kenar 724, ön yüz altı 732
  for (let px = 18; px < w - 6; px += 62) {      // direkler (suya iner)
    x.fillStyle = '#6f4a2e'; x.fillRect(px - 4, alt - 2, 8, 46);
    x.fillStyle = 'rgba(255,220,170,.25)'; x.fillRect(px - 3, alt, 2, 40);
    x.fillStyle = 'rgba(40,90,110,.45)'; x.fillRect(px - 4, alt + 6, 8, 38);   // su altındaki kısmı serin tonda
  }
  x.fillStyle = '#d9b17e'; x.fillRect(0, ust, w, on - ust);              // güverte üstü
  x.strokeStyle = 'rgba(140,96,56,.55)'; x.lineWidth = 0.9;
  for (let px = 22; px < w; px += 22) { x.beginPath(); x.moveTo(px, ust + 0.5); x.lineTo(px - 3, on); x.stroke(); }   // tahta araları
  x.fillStyle = 'rgba(255,240,210,.55)'; x.fillRect(0, ust, w, 1.6);
  x.fillStyle = '#a16e43'; x.fillRect(0, on, w, alt - on);              // ön yüz (kiriş)
  x.fillStyle = 'rgba(70,40,20,.35)'; x.fillRect(0, alt - 2, w, 2);
  x.fillStyle = 'rgba(255,225,180,.35)'; x.fillRect(0, on, w, 1.2);
  const uc = sag ? 8 : w - 8;                                            // suya bakan uç
  x.fillStyle = '#7d522f'; x.fillRect(uc - 3.5, -34, 7, on + 34);         // fener direği
  x.fillStyle = '#f3e6c8'; x.beginPath(); x.ellipse(uc, -38, 6.5, 7.5, 0, 0, Math.PI * 2); x.fill();
  x.strokeStyle = '#7d522f'; x.lineWidth = 1.6; x.stroke();
  x.fillStyle = '#7d522f'; x.fillRect(uc - 7, -46, 14, 3);
  const bab = sag ? 30 : w - 30;                                         // halat babası ve kangal
  x.fillStyle = '#5c3d26'; x.fillRect(bab - 3, ust - 6, 6, 8);
  x.strokeStyle = '#e8d3a8'; x.lineWidth = 1.8;
  x.beginPath(); x.ellipse(bab + (sag ? 14 : -14), ust + 3, 7, 2.6, 0, 0, Math.PI * 2); x.stroke();
  return c;
}
function gl12YaprakTuval(K) {   // nilüfer yaprağı (yandan bakınca basık elips, çentikli, damarlı)
  const c = gl12Tuval(52 * K, 18 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(26, 9);
  x.beginPath(); x.moveTo(0, 0); x.ellipse(0, 0, 23, 7, 0, 0.32, Math.PI * 2 - 0.05); x.closePath();
  x.fillStyle = '#5fae5c'; x.fill();
  x.strokeStyle = '#3f8a45'; x.lineWidth = 1.2; x.stroke();
  x.strokeStyle = 'rgba(200,240,170,.55)'; x.lineWidth = 0.7;
  for (let a = 0.6; a < 6.1; a += 0.62) { x.beginPath(); x.moveTo(0, 0); x.lineTo(Math.cos(a) * 19, Math.sin(a) * 5.6); x.stroke(); }
  x.fillStyle = 'rgba(255,255,230,.25)'; x.beginPath(); x.ellipse(-6, -2.5, 10, 2.2, 0, 0, Math.PI * 2); x.fill();
  return c;
}
function gl12SuTuval() {   // su rengi (dünya y 702 → 802); karede gerilerek çizilir
  const c = gl12Tuval(2, 100), x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 0, 100);
  gr.addColorStop(0, '#7cb3dc'); gr.addColorStop(0.1, '#74b1d8'); gr.addColorStop(0.4, '#5ca8cc'); gr.addColorStop(1, '#3a8fb2');
  x.fillStyle = gr; x.fillRect(0, 0, 2, 100);
  return c;
}
function gl12Sprite() {
  const ist = clamp(Math.ceil((typeof S === 'number' && S > 0 ? S : 2) * 1.15), 2, 5);
  if (GL.spr && GL.K >= ist) return GL.spr;
  GL.K = ist;
  GL.spr = {
    dis: gl12KayikDis(ist), ic: gl12KayikIc(ist),
    iskL: gl12Iskele(ist, GL12_ISK.L1 - GL12_ISK.L0, false), iskR: gl12Iskele(ist, GL12_ISK.R1 - GL12_ISK.R0, true),
    yaprak: gl12YaprakTuval(ist), su: (GL.spr && GL.spr.su) || gl12SuTuval()
  };
  return GL.spr;
}

// ════════════════════════ Kayık: konum, dönüşüm ════════════════════════
function gl12KayikYeni(o) {
  return {
    x: GL12_K.merkezL, yon: 1, yonG: 1, yer: 'L', faz: 'bekle', t: 0, v: 0,
    kf: 0.7, kfOnce: 0.7, dip: 0, dipV: 0, egim: 0, bob: 0, izMesafe: 0,
    an: { var: false, faz: '', t: 0, x: 0, y: 0, x0: 0, y0: 0, hiz: 150 },
    f0x: 0, f0y: 0, fx1: 0, fy1: 0, oturdu: false,
    px: 0, py: 0, pyon: 1,                       // Pırıl
    elT: 0, bakT: 3, sevT: 0, bakH: 0
  };
}
function gl12Y(K) { return GL12_K.suY + K.bob + K.dip; }
// Kayığa göre yerel noktayı (sağa bakışta) dünyaya çevirir (GL.nokta'ya yazar)
function gl12Nokta(K, lx, ly) {
  const a = K.egim, c = Math.cos(a), s = Math.sin(a), xx = lx * K.yonG;
  GL.nokta.x = K.x + c * xx - s * ly;
  GL.nokta.y = gl12Y(K) + s * xx + c * ly;
  return GL.nokta;
}
function gl12Dalga(K, dt) {   // su üstünde salınma + biniş/iniş ve kürek darbesindeki yaylanma
  K.bob = Math.sin(GL.t * 1.7) * 1.1 + Math.sin(GL.t * 0.63) * 0.6;
  K.dipV += (-K.dip * 55 - K.dipV * 6.5) * dt;
  K.dip += K.dipV * dt;
  const hedefEgim = Math.sin(GL.t * 1.25) * 0.011 - K.dip * 0.004 * K.yon;
  K.egim += (hedefEgim - K.egim) * (1 - Math.exp(-dt * 4));
}

// ════════════════════════ Kayık: biniş, sürüş, iniş ════════════════════════
function gl12AnneVar() { return typeof ANNE12 !== 'undefined' && ANNE12 && typeof ANNE12.devral === 'function'; }

function gl12Basla(o, aninda) {
  const K = o.k;
  if (P.ucus || K.faz !== 'bekle') return;
  P.ucus = o; P.vx = 0; P.vy = 0;
  K.faz = 'binis'; K.t = 0; K.v = 0; K.oturdu = false;
  K.f0x = P.x; K.f0y = P.y;
  K.px = Number.isFinite(D.x) ? D.x : P.x - 40; K.py = Number.isFinite(D.y) ? D.y : P.y - 100;
  const A = K.an;
  A.var = false;
  if (gl12AnneVar()) {
    let ok = true;
    try { ok = ANNE12.devral(o) !== false; } catch (e) { ok = false; }
    if (ok && Number.isFinite(ANNE12.x) && Number.isFinite(ANNE12.y)) {
      A.var = true; A.x = ANNE12.x; A.y = ANNE12.y; A.t = 0; A.faz = 'yuru';
      const hedef = K.x + K.yon * GL12_K.kicAdim;   // kayığın kıçı (anne buradan biner)
      A.hiz = Math.max(140, Math.abs(hedef - A.x) / 0.9);
    }
  }
  if (aninda) {   // suyun ortasına gelinmişse (ışınlanma / test): kayık hemen altında, herkes oturmuş
    K.t = GL12_K.binisSure; K.oturdu = true; K.faz = 'yol';
    if (A.var) { A.faz = 'otur'; }
  }
  gl12Olay('k12KayikBasla', { o, yon: K.yon });
}

function gl12Bitir(o) {   // Feza iskelede ayakta: kontrol ona döner (P.x olduğu yerde kalır)
  const K = o.k;
  if (P.ucus === o) P.ucus = null;
  P.ground = true; P.vx = 0; P.vy = 0; P.y = GL12_ISK.y; P.f = K.yon;
  P.safeX = P.x; P.safeY = P.y;
  if (typeof fezaPoz12 === 'function') { try { fezaPoz12(null); } catch (e) {} }
  if (Number.isFinite(K.px) && Number.isFinite(K.py)) { D.x = K.px; D.y = K.py; }
  K.faz = 'cik';
  const V = gl12V(); if (V) { V.kayik = true; V.kayikHiz = 0; }
  gl12Olay('k12KayikBitti', { o, yon: K.yon });
}

function gl12AnneAdim(K, dt) {   // anne binişte iskelede yürür ve kayığa oturur; inişte iskeleye çıkar
  const A = K.an, O = GL.aopt;
  if (!A.var) return;
  const s = gl12Nokta(K, GL12_K.anneX, GL12_K.anneY), sx = s.x, sy = s.y;
  O.yon = K.yon; O.kurek = K.kf; O.bak = 0;
  if (K.faz === 'binis') {
    // anne iskelede kayığın kıçına kadar yürür, içine adım atar, içinde oturağına yürüyüp oturur
    const kic = gl12Nokta(K, GL12_K.kicAdim, GL12_K.anneY), kx = kic.x, ky = kic.y;
    if (A.faz === 'yuru') {
      const d = kx - A.x, ad = Math.abs(d), adim = Math.min(ad, A.hiz * dt);
      A.x += Math.sign(d) * adim; A.y = GL12_ISK.y;
      O.poz = 'yuru'; O.hiz = dt > 0 ? adim / dt : 0; O.yon = d > 0.5 ? 1 : d < -0.5 ? -1 : K.yon;
      if (ad - adim < 0.5) { A.faz = 'in'; A.t = 0; A.x0 = A.x; A.y0 = A.y; }
    } else if (A.faz === 'in') {
      A.t += dt;
      const u = Math.min(1, A.t / 0.42), e = smooth(u);
      A.x = lerp(A.x0, kx, e); A.y = lerp(A.y0, ky, e) - 7 * Math.sin(Math.PI * u);
      O.poz = 'yuru'; O.hiz = 50;
      if (u >= 1) { A.faz = 'iceride'; A.lx = GL12_K.kicAdim; K.dipV += 22; gl12Halka(kx, GL12_K.suY + 2, 16, 1.3, 0.6); }
    } else if (A.faz === 'iceride') {
      const adim = Math.min(GL12_K.anneX - A.lx, 120 * dt);
      A.lx += adim;
      const h = gl12Nokta(K, A.lx, GL12_K.anneY);
      A.x = h.x; A.y = h.y; O.poz = 'yuru'; O.hiz = dt > 0 ? adim / dt : 0;
      if (GL12_K.anneX - A.lx < 0.5) { A.faz = 'oturuyor'; A.t = 0; }
    } else if (A.faz === 'oturuyor') {   // oturağa çöker (anne12 pozları 0.3 sn karışır)
      A.t += dt; A.x = sx; A.y = sy; O.poz = 'kayik_kurek'; O.hiz = 0;
      if (A.t > 0.3) { A.faz = 'otur'; K.dipV += 12; }
    } else { A.x = sx; A.y = sy; O.poz = 'kayik_kurek'; O.hiz = 0; }
  } else if (K.faz === 'yol') {
    A.faz = 'otur'; A.x = sx; A.y = sy; O.poz = 'kayik_kurek'; O.hiz = 0; O.bak = K.bakH * 0.6;
  } else if (K.faz === 'inis' || K.faz === 'cik') {
    // varış: anne ayağa kalkar, kayığın içinde burna doğru yürür, iskeleye adım atar
    const kenar = K.yon > 0 ? GL12_ISK.R0 : GL12_ISK.L1;
    if (A.faz === 'otur') {
      A.x = sx; A.y = sy; O.poz = 'kayik_kurek'; A.lx = GL12_K.anneX;
      if (K.t > 0.15) { A.faz = 'kalk'; A.t = 0; }
    } else if (A.faz === 'kalk') {
      A.t += dt; A.x = sx; A.y = sy; O.poz = 'dur'; O.hiz = 0;
      if (A.t > 0.35) A.faz = 'iceride';
    } else if (A.faz === 'iceride') {
      const adim = Math.min(78 - A.lx, 125 * dt);
      A.lx += adim;
      const h = gl12Nokta(K, A.lx, GL12_K.anneY);
      A.x = h.x; A.y = h.y; O.poz = 'yuru'; O.hiz = dt > 0 ? adim / dt : 0;
      if (A.lx >= 77.5) { A.faz = 'cik'; A.t = 0; A.x0 = A.x; A.y0 = A.y; }
    } else if (A.faz === 'cik') {
      A.t += dt;
      const u = Math.min(1, A.t / 0.5), e = smooth(u);
      A.x = lerp(A.x0, kenar + K.yon * 4, e); A.y = lerp(A.y0, GL12_ISK.y, e) - 10 * Math.sin(Math.PI * u);
      O.poz = 'yuru'; O.hiz = dt > 0 ? 60 : 0;
      if (u >= 1) { A.faz = 'ayakta'; A.y = GL12_ISK.y; O.poz = 'dur'; O.hiz = 0; K.dipV -= 16; }
    }
  }
  if (typeof ANNE12 !== 'undefined' && ANNE12) { ANNE12.x = A.x; ANNE12.y = A.y; }
}
function gl12AnneBirak(o) {
  const A = o.k.an;
  if (!A.var) return;
  A.var = false;
  if (typeof ANNE12 !== 'undefined' && ANNE12) {
    ANNE12.x = A.x; ANNE12.y = GL12_ISK.y;
    if (typeof ANNE12.birak === 'function') { try { ANNE12.birak(o); } catch (e) {} }
  }
}

function gl12Fezapoz(poz) {
  if (typeof fezaPoz12 !== 'function') return;
  try { fezaPoz12(poz, GL.fopt); } catch (e) {}
}

// Kayığın her karedeki ilerleyişi. U: uçuş girdisi (Feza kayıktayken), değilse null.
function gl12KayikIlerle(o, dt, U) {
  const K = o.k, F = GL.fopt;
  K.t += dt;
  gl12Dalga(K, dt);
  const hedefX = K.yon > 0 ? GL12_K.varisR : GL12_K.varisL;
  let basili = false;
  if (U) basili = !!U.basili || U.eksenX * K.yon > 0.2;

  if (K.faz === 'binis') {
    const u = Math.min(1, K.t / GL12_K.binisSure), e = smooth(u);
    const s = gl12Nokta(K, GL12_K.fezaX, GL12_K.fezaY);
    P.x = lerp(K.f0x, s.x, e); P.y = lerp(K.f0y, s.y, e) - 28 * Math.sin(Math.PI * u);   // neşeli bir zıplayışla oturağına
    P.f = K.yon; P.vx = 0; P.vy = 0; P.ground = true;
    F.u = e; F.arac = 'kayik'; F.kurek = undefined; F.aci = K.egim * K.yon;
    if (u >= 1 && !K.oturdu) { K.oturdu = true; K.dipV += 34; gl12Halka(s.x, GL12_K.suY + 3, 22, 1.5, 0.9); gl12Sicrat(s.x, GL12_K.suY, 6, 0.4); gl12Olay('k12Sicrama', { x: s.x, guc: 0.4 }); }
    // anneyi beklerken el sallar ("gel anne!")
    const bekle = K.oturdu && K.an.var && K.an.faz !== 'otur' && K.t > 0.85;
    F.salla += ((bekle ? 1 : 0) - F.salla) * (1 - Math.exp(-dt * 6));
    gl12Fezapoz(u >= 1 || !gl12BinisPozu() ? 'kayik' : 'binis_in');
    gl12AnneAdim(K, dt);
    if (K.oturdu && (!K.an.var || K.an.faz === 'otur')) { K.faz = 'yol'; K.t = 0; }
  } else if (K.faz === 'yol') {
    const hedefV = basili ? GL12_K.hizBas : GL12_K.hizSuz;
    K.v += (hedefV - K.v) * (1 - Math.exp(-dt * (basili ? 1.5 : 0.45)));
    const d = Math.abs(hedefX - K.x);
    K.v = Math.min(K.v, 12 + Math.sqrt(2 * 120 * d));     // karşı iskeleye yumuşak yanaşma
    const adim = Math.min(d, K.v * dt);
    K.x += adim * K.yon;
    // kürek: hız arttıkça çekişler sıklaşır; iskeleye yaklaşınca anne kürekleri yavaşça kaldırır
    const yakin = clamp((d - 30) / 260, 0, 1);
    K.kfOnce = K.kf;
    K.kf += dt * (0.36 + 0.78 * clamp((K.v - 60) / 230, 0, 1)) * (0.25 + 0.75 * yakin);
    if (Math.floor(K.kf) !== Math.floor(K.kfOnce)) gl12KurekSuya(K);
    if (K.kf > 1000) K.kf -= 1000;
    // iz: her 15 birimde kıçtan bir dalga çizgisi
    K.izMesafe += adim;
    if (K.izMesafe > 15) { K.izMesafe = 0; gl12IzEkle(K); }
    const s = gl12Nokta(K, GL12_K.fezaX, GL12_K.fezaY);
    P.x = s.x; P.y = s.y; P.f = K.yon; P.vx = K.v * K.yon; P.vy = 0; P.ground = true;
    gl12FezaYolda(K, dt, basili);
    gl12Fezapoz('kayik');
    gl12AnneAdim(K, dt);
    const V = gl12V(); if (V) V.kayikHiz = clamp(K.v / GL12_K.hizBas, 0, 1);
    if (d < 1) { K.x = hedefX; K.v = 0; K.faz = 'inis'; K.t = 0; K.yer = K.yon > 0 ? 'R' : 'L'; K.fx1 = P.x; K.fy1 = P.y; if (V) V.kayikHiz = 0; }
  } else if (K.faz === 'inis') {
    // Feza oturaktan kalkıp kayığın burnundan iskeleye adım atar (gövdenin önünde değil, iskelenin üstünde durur)
    const u = Math.min(1, K.t / GL12_K.inisSure), e = smooth(u);
    const hx = (K.yon > 0 ? GL12_ISK.R0 : GL12_ISK.L1) + K.yon * 30;
    P.x = lerp(K.fx1, hx, e); P.y = lerp(K.fy1, GL12_ISK.y, e) - 22 * Math.sin(Math.PI * u);
    P.f = K.yon; P.vx = 0; P.vy = 0;
    F.u = 1 - e; F.arac = 'kayik'; F.kurek = undefined; F.salla = 0;
    gl12Fezapoz(gl12BinisPozu() || u > 0.35 ? 'binis_in' : 'kayik');
    gl12AnneAdim(K, dt);
    if (u > 0.5 && K.dipV > -10 && !K.kalkti) { K.kalkti = true; K.dipV -= 22; }
    if (u >= 1) { K.kalkti = false; gl12Bitir(o); }
  } else if (K.faz === 'cik') {   // Feza indi; anne de iniyor
    gl12AnneAdim(K, dt);
    if (!K.an.var || K.an.faz === 'ayakta') { gl12AnneBirak(o); K.faz = 'don'; K.t = 0; }
    if (K.t > 4) { gl12AnneBirak(o); K.faz = 'don'; K.t = 0; }   // sigorta
  } else if (K.faz === 'don') {
    // Kayık öbür yöne döner: ekrandan çıkınca sessizce; Feza iskelede kayığa doğru gelirse gözünün önünde yavaşça
    const iskX0 = K.yer === 'L' ? GL12_ISK.L0 : GL12_ISK.R0, iskX1 = K.yer === 'L' ? GL12_ISK.L1 : GL12_ISK.R1;
    const yakinda = P.x > iskX0 - 40 && P.x < iskX1 + 40 && Math.abs(P.x - K.x) < 300;
    // dönerken iskelenin ucuna (bekleme yerine) geri süzülür
    const varis = K.yer === 'L' ? GL12_K.varisL : GL12_K.varisR, bekleX = K.yer === 'L' ? GL12_K.merkezL : GL12_K.merkezR;
    if (!K.donuyor && !gl12Ekranda(K.x, 140)) K.t = 99;
    else if (!K.donuyor && yakinda) { K.donuyor = true; K.t = 0; }
    if (K.donuyor || K.t >= 99) {
      const u = Math.min(1, K.donuyor ? K.t / 1.5 : 1);
      let c = Math.cos(Math.PI * smooth(u));
      if (Math.abs(c) < 0.16) c = c < 0 ? -0.16 : 0.16;   // tam yandan incecik görünmesin
      K.yonG = K.yon * c;
      K.x = lerp(varis, bekleX, smooth(u));
      if (K.donuyor && u > 0.2 && u < 0.8) K.dip += Math.sin(Math.PI * (u - 0.2) / 0.6) * 0.04;
      if (u >= 1) { K.yon = -K.yon; K.yonG = K.yon; K.faz = 'bekle'; K.t = 0; K.donuyor = false; }
    }
  } else {   // bekle: iskeleye yanaşmış, hafifçe salınır
    K.yonG = K.yon;
  }
  // Pırıl (Feza kayıktayken onu biz çizeriz): kayığın üstünde, yanlarında süzülür
  if (P.ucus === o) gl12PirilAdim(K, dt);
}

function gl12KurekSuya(K) {   // palalar suya girdi: halka, damlacık, ses olayı
  const guc = clamp(K.v / GL12_K.hizBas, 0.2, 1);
  const p = gl12PalaUcu(K, 1);
  gl12Halka(p.x, GL12_K.suY + 2, 10, 1.2, 0.8);
  gl12Halka(p.x - K.yon * 6, GL12_K.suY + 4, 6, 0.9, 0.5);
  gl12Sicrat(p.x, GL12_K.suY, 3 + Math.round(guc * 3), guc);
  gl12Olay('k12Kurek', { kim: 'anne', guc });
}
// Pala ucunun dünya konumu (yakın: 1, uzak: 0). El konumu ANNE12_ELLER'den, yoksa kendi hesabımız.
const GL12_PALA = { x: 0, y: 0, hx: 0, hy: 0, ox: 0, oy: 0 };
function gl12PalaUcu(K, yakin) {
  const o = gl12Nokta(K, GL12_K.iskarmozX, GL12_K.iskarmozY - (yakin ? 0 : 3));
  const ox = o.x, oy = o.y;
  let hx, hy;
  const E = typeof ANNE12_ELLER !== 'undefined' && ANNE12_ELLER && K.an.var && K.an.faz === 'otur' ? ANNE12_ELLER : null;
  if (E && Number.isFinite(E.onX) && Number.isFinite(E.onY)) { hx = yakin ? E.onX : E.arkaX; hy = yakin ? E.onY : E.arkaY; }
  if (!Number.isFinite(hx) || !Number.isFinite(hy)) {
    const f = K.kf - Math.floor(K.kf), cek = f < 0.55;
    const ileri = cek ? smooth(f / 0.55) : 1 - smooth((f - 0.55) / 0.45);
    const lx = GL12_K.anneX + 12 + 24 * ileri, ly = GL12_K.anneY - (cek ? 64 : 56) - 2 * Math.sin(Math.PI * ileri);
    const h = gl12Nokta(K, lx, ly); hx = h.x; hy = h.y;
  }
  let dx = ox - hx, dy = oy - hy;
  const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
  GL12_PALA.hx = hx; GL12_PALA.hy = hy; GL12_PALA.ox = ox; GL12_PALA.oy = oy;
  GL12_PALA.x = ox + dx * GL12_K.kurekBoy; GL12_PALA.y = oy + dy * GL12_K.kurekBoy;
  return GL12_PALA;
}

function gl12IzEkle(K) {
  let h = null, en = null;
  for (const q of GL.iz) { if (!q.on) { h = q; break; } if (!en || q.t > en.t) en = q; }
  h = h || en;
  const s = gl12Nokta(K, -96, 0);
  h.on = true; h.x = s.x; h.y = GL12_K.suY + 1; h.t = 0; h.yon = K.yon; h.guc = clamp(K.v / GL12_K.hizBas, 0.25, 1);
}

function gl12FezaYolda(K, dt, basili) {   // Feza kayıkta: basılı tutunca küreğe yardım eder, kuğuya el sallar
  const F = GL.fopt;
  F.kurek = basili ? K.kf - Math.floor(K.kf) : undefined;   // bırakınca elleri dizinde, etrafa bakar
  F.aci = K.egim * K.yon;
  K.elT = Math.max(0, K.elT - dt); K.sevT = Math.max(0, K.sevT - dt);
  const salla = K.elT > 0 || K.sevT > 0.2 ? 1 : 0;
  F.salla += (salla - F.salla) * (1 - Math.exp(-dt * 6));
  K.bakT -= dt;
  if (K.bakT < 0) K.bakT = GL.katilan > 0 ? 5 + gl12Hash(GL.t) * 4 : 99;
  const geri = GL.katilan > 0 && K.bakT < 1.3 ? -1 : 0;
  K.bakH += (geri - K.bakH) * (1 - Math.exp(-dt * 5));   // anne arada ördeklere dönüp bakar
}
// fezapoz12.js 'binis_in' pozunu kayık için de destekliyor mu (FEZA12_ARAC.kayik.binisIn)
function gl12BinisPozu() { return typeof FEZA12_ARAC !== 'undefined' && FEZA12_ARAC && FEZA12_ARAC.kayik && !!FEZA12_ARAC.kayik.binisIn; }

function gl12PirilAdim(K, dt) {
  let tx = K.x + K.yon * (-14 + 52 * Math.sin(GL.t * 0.42)), ty = GL12_K.suY - 158 + 12 * Math.sin(GL.t * 1.05);
  for (const b of GL.balik) if (b.u >= 0 && b.u < 1 && Math.abs(b.x - K.x) < 360) { tx = b.x - b.yon * 40; ty = GL12_K.suY - 120; break; }   // zıplayan balığa bakmaya gider
  if (K.faz === 'binis' || K.faz === 'inis') { tx = P.x + K.yon * 30; ty = P.y - 130; }
  const k = 1 - Math.exp(-dt * 2.2);
  const vx = (tx - K.px) * k;
  K.px += vx; K.py += (ty - K.py) * k;
  if (Math.abs(vx) > 0.15) K.pyon = vx > 0 ? 1 : -1;
}

// ════════════════════════ Ördek ailesi ════════════════════════
function gl12OrdekKur() {
  GL.ordek.length = 0;
  for (let i = 0; i < 6; i++) {
    const anne = i === 5;
    GL.ordek.push({
      i, anne, ev: (anne ? 679 : 673 + i * 1.6) * T + gl12Hash(i * 3.1) * 20,
      x: 0, y: GL12_ISK.y, vx: 0, yon: i % 2 ? 1 : -1, mod: 'kara', katildi: false,
      gec: 0, gy0: 0, gy1: 0, adimF: gl12Hash(i) * 3, gagaT: gl12Hash(i * 7) * 3, gaga: 0,
      vakT: 0, dalT: 0, kanat: 0, gezX: 0, gezT: gl12Hash(i * 5) * 3
    });
    GL.ordek[i].x = GL.ordek[i].ev;
  }
}
function gl12IzIt(x) {   // lider (Feza ya da kayığın kıçı) yolunu kaydet
  if (GL.izN > 0 && Math.abs(x - GL.izSon) < 2) return;
  const d = GL.izN > 0 ? Math.abs(x - GL.izSon) : 0;
  GL.izTop += d; GL.izSon = x;
  GL.izI = (GL.izI + 1) % GL.izX.length;
  GL.izX[GL.izI] = x; GL.izS[GL.izI] = GL.izTop;
  if (GL.izN < GL.izX.length) GL.izN++;
}
function gl12IzOku(geri) {   // yol üzerinde 'geri' birim gerideki nokta
  if (GL.izN === 0) return P.x;
  const hedef = GL.izTop - geri, n = GL.izX.length;
  let k = GL.izI;
  for (let j = 0; j < GL.izN - 1; j++) {
    const p = (k - 1 + n) % n;
    if (GL.izS[p] <= hedef) {
      const s0 = GL.izS[p], s1 = GL.izS[k], u = s1 > s0 ? (hedef - s0) / (s1 - s0) : 0;
      return lerp(GL.izX[p], GL.izX[k], clamp(u, 0, 1));
    }
    k = p;
  }
  // yol kısa (Feza yeni geldi / ışınlandı): en eski noktadan geriye doğru uzat, ördekler üst üste binmesin
  const yon = Math.sign(GL.izX[GL.izI] - GL.izX[k]) || P.f || 1;
  return GL.izX[k] - yon * Math.max(0, GL.izS[k] - hedef);
}
function gl12OrdekAdim(dt) {
  const Kk = GL.kayik && GL.kayik.k, binisli = Kk && P.ucus === GL.kayik && (Kk.faz === 'yol' || Kk.oturdu);
  const lider = binisli ? Kk.x - Kk.yon * 102 : P.x;
  const bolgede = P.x > GL12_KIYI.sinirL - 200 && P.x < GL12_KIYI.sinirR + 200;
  if (bolgede) gl12IzIt(lider);
  const V = gl12V();
  for (const d of GL.ordek) {
    d.vakT = Math.max(0, d.vakT - dt);
    if (d.dalT > 0) { d.dalT = Math.max(0, d.dalT - dt); if (d.dalT < 0.45 && !d.cikti) { d.cikti = true; gl12Halka(d.x, d.y + 1, 9, 1, 0.8); gl12Olay('k12OrdekDal', { x: d.x }); } }
    // katılma: Feza yakına gelince sırayla
    if (!d.katildi && bolgede && Math.abs(P.x - d.x) < 230 + d.i * 12) {
      d.katildi = true; d.vakT = 0.6;
      if (!d.anne) {
        GL.katilan++;
        if (V) V.ordek = GL.katilan;
        gl12Olay('k12OrdekKatildi', { n: GL.katilan });
      }
      gl12Olay('k12OrdekVak', { x: d.x, yavru: !d.anne });
    }
    let tx;
    if (d.katildi && bolgede) tx = gl12IzOku((binisli ? 26 : 40) + d.i * 25 + (d.anne ? 14 : 0));
    else {   // evinin çevresinde gezinir
      d.gezT -= dt;
      if (d.gezT < 0) { d.gezT = 2 + gl12Hash(GL.t + d.i) * 3; d.gezX = (gl12Hash(GL.t * 1.3 + d.i * 9) - 0.5) * 90; }
      tx = (d.katildi ? clamp(d.x, GL12_KIYI.sinirL, GL12_KIYI.sinirR) : d.ev) + d.gezX;
    }
    tx = clamp(tx, GL12_KIYI.sinirL + 20, GL12_KIYI.sinirR - 20);
    // yer: kayık yolculuğunda ya da iki iskelenin arasında su; değilse kara (kıyı ve iskele tahtası)
    // ördekler iskeleye çıkmaz: kıyıdan suya atlar, iskelenin yanında yüzer (kayığın içinde oturuyormuş gibi görünmesinler)
    const kiyiL = GL12_ISK.L0 + 30, kiyiR = GL12_ISK.R1 - 30;
    const suda = binisli || (d.x > kiyiL && d.x < kiyiR);
    if (!suda && d.mod === 'su') {
      d.mod = 'kara'; d.gec = 0.001; d.gy0 = d.y; d.gy1 = GL12_ISK.y; d.kanat = 1;
    } else if (suda && d.mod === 'kara') {
      d.mod = 'su'; d.gec = 0.001; d.gy0 = d.y; d.gy1 = GL12_ORDEK_SU + (d.i % 2) * 3;
    }
    const vmax = d.mod === 'su' ? 340 : Math.abs(tx - d.x) > 140 ? 240 : 140;
    const hedefV = clamp((tx - d.x) * 3.0, -vmax, vmax);
    d.vx += (hedefV - d.vx) * (1 - Math.exp(-dt * 7));
    if (d.gec > 0) {   // zıplayarak suya/karaya geçiş
      d.gec += dt / 0.45;
      const u = Math.min(1, d.gec);
      d.y = lerp(d.gy0, d.gy1, u) - 14 * Math.sin(Math.PI * u);
      if (u >= 1) {
        d.gec = 0; d.y = d.gy1;
        if (d.mod === 'su') { gl12Halka(d.x, d.y + 1, 11, 1.2, 0.9); gl12Sicrat(d.x, d.y, 4, 0.3); gl12Olay('k12Sicrama', { x: d.x, guc: 0.2 }); }
      }
    } else d.y = d.mod === 'su' ? GL12_ORDEK_SU + (d.i % 2) * 3 : GL12_ISK.y;
    d.x += d.vx * dt;
    if (Math.abs(d.vx) > 10) d.yon = d.vx > 0 ? 1 : -1;
    else if (d.katildi && Math.abs(P.x - d.x) > 20) d.yon = P.x > d.x ? 1 : -1;
    d.adimF += Math.abs(d.vx) * dt * (d.anne ? 0.055 : 0.085);
    d.kanat = Math.max(0, d.kanat - dt * 1.6);
    if (d.vakT > 0) d.kanat = Math.max(d.kanat, d.vakT / 0.6);
    // gagalama (dururken)
    d.gagaT -= dt;
    if (d.gagaT < 0) d.gagaT = 1.6 + gl12Hash(GL.t * 2 + d.i) * 2.5;
    d.gaga = Math.abs(d.vx) < 25 && d.mod === 'kara' && d.gagaT < 0.35 ? Math.sin(d.gagaT / 0.35 * Math.PI) : 0;
    if (d.mod === 'su' && Math.abs(d.vx) > 60 && gl12Hash(GL.t * 9 + d.i) < dt * 3) gl12Halka(d.x - d.yon * 6, d.y + 1, 5, 0.8, 0.4);
  }
}
function gl12OrdekDokun(d) {
  d.vakT = 0.6;
  gl12Olay('k12OrdekVak', { x: d.x, yavru: !d.anne });
  if (d.mod === 'su' && d.gec === 0 && d.dalT <= 0) { d.dalT = 1.25; d.cikti = false; gl12Halka(d.x, d.y + 1, 8, 1, 0.7); gl12Olay('k12OrdekDal', { x: d.x }); }
  if (typeof burst === 'function') burst(d.x, d.y - 18, 5, ['#fff3a0', '#ffd0e0', '#ffffff'], 60, 0.7, 5);
}

// Ördek çizimi. (x, y): karada ayak tabanı, suda su çizgisi. Anne ördek kremsi beyaz, yavrular sarı pofuduk.
function gl12OrdekCiz(c, d, tm) {
  const s = d.anne ? 1.55 : 1, su = d.mod === 'su' && d.gec === 0;
  const atla = d.gec > 0 ? Math.sin(Math.PI * Math.min(1, d.gec)) : 0;
  const hop = d.vakT > 0 && !su ? Math.sin(d.vakT / 0.6 * Math.PI) * 6 : 0;
  let dal = 0;
  if (d.dalT > 0) { const q = 1 - d.dalT / 1.25; dal = q < 0.35 ? q / 0.35 : q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3; }
  if (dal > 0.97) return;
  const sal = su ? Math.sin(tm * 2.1 + d.i) * 0.05 : Math.sin(d.adimF * Math.PI * 2) * 0.13 * clamp(Math.abs(d.vx) / 60, 0, 1);
  const col = d.anne
    ? { g: '#fbf5e6', k: '#e8decb', o: '#c9b89a', b: '#fffdf6' }
    : { g: '#ffd84f', k: '#f5c235', o: '#d99a22', b: '#ffe772' };
  c.save();
  c.translate(d.x, d.y - hop - (su ? Math.sin(tm * 2.3 + d.i * 1.7) * 0.8 : 0));
  if (su) { c.beginPath(); c.rect(-30 * s, -60 * s, 60 * s, 60 * s + 0.6); c.clip(); }
  c.scale(d.yon * s, s);
  c.rotate(sal + dal * 1.35);
  if (su) c.translate(0, 4 + dal * 12);
  c.lineWidth = 0.9; c.lineJoin = 'round'; c.lineCap = 'round';
  // ayaklar (karada)
  if (!su) {
    const a = Math.sin(d.adimF * Math.PI * 2) * clamp(Math.abs(d.vx) / 50, 0, 1);
    c.fillStyle = '#ff9a3c';
    c.beginPath(); c.ellipse(-2.5 + a * 2.5, -Math.max(0, a) * 2, 3, 1.3, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(3 - a * 2.5, -Math.max(0, -a) * 2, 3, 1.3, 0, 0, Math.PI * 2); c.fill();
  }
  // kuyruk tüyü
  c.fillStyle = col.k;
  c.beginPath(); c.moveTo(-7, -9); c.quadraticCurveTo(-13, -13, -11.5, -16); c.quadraticCurveTo(-8, -13, -5, -12); c.closePath(); c.fill();
  // gövde
  c.fillStyle = col.g; c.strokeStyle = col.o;
  c.beginPath(); c.ellipse(0, -8, 9.5, 7.2, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = col.b; c.beginPath(); c.ellipse(1.5, -11, 6, 2.6, -0.1, 0, Math.PI * 2); c.fill();
  // kanat (vaklarken çırpar)
  c.save(); c.translate(-1.5, -9); c.rotate(-0.25 - d.kanat * (0.6 + 0.4 * Math.sin(tm * 30)));
  c.fillStyle = col.k; c.beginPath(); c.ellipse(-2, 0, 5.4, 3.4, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = col.o; c.lineWidth = 0.6; c.stroke();
  c.restore();
  // baş (gagalarken öne eğilir)
  const bx = 6 + d.gaga * 3, by = -17 + d.gaga * 7 + (d.anne ? -2 : 0);
  if (d.anne) { c.strokeStyle = col.g; c.lineWidth = 5; c.beginPath(); c.moveTo(4, -12); c.quadraticCurveTo(6, -15, bx, by); c.stroke(); c.lineWidth = 0.9; }
  c.fillStyle = col.b; c.strokeStyle = col.o;
  c.beginPath(); c.arc(bx, by, 5.4, 0, Math.PI * 2); c.fill(); c.stroke();
  if (!d.anne) {   // tepe tüyü
    c.strokeStyle = col.k; c.lineWidth = 1;
    c.beginPath(); c.moveTo(bx - 1, by - 5); c.quadraticCurveTo(bx - 2.5, by - 8, bx - 0.5, by - 8.5); c.stroke();
  }
  // gaga (vaklarken açılır)
  const ac = d.vakT > 0 ? Math.abs(Math.sin(d.vakT * 18)) * 1.4 : 0;
  c.fillStyle = '#ff9838';
  c.beginPath(); c.ellipse(bx + 5.6, by + 0.6 - ac * 0.5, 3.4, 1.5, -0.08, 0, Math.PI * 2); c.fill();
  if (ac > 0.1) { c.fillStyle = '#f07c22'; c.beginPath(); c.ellipse(bx + 5, by + 1.6 + ac * 0.5, 3, 1.2, 0.1, 0, Math.PI * 2); c.fill(); }
  // göz + yanak
  const kirp = ((tm + d.i * 0.9) % 3.6) < 0.12;
  c.fillStyle = '#3a2a20';
  if (kirp) c.fillRect(bx + 1, by - 1.4, 2.6, 0.7);
  else { c.beginPath(); c.arc(bx + 2.2, by - 1.2, 1.25, 0, Math.PI * 2); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(bx + 2.6, by - 1.7, 0.45, 0, Math.PI * 2); c.fill(); }
  c.fillStyle = 'rgba(255,130,140,.4)'; c.beginPath(); c.arc(bx + 1.2, by + 2, 1.5, 0, Math.PI * 2); c.fill();
  c.restore();
  if (su && dal < 0.9) {   // su çizgisinde ince halka
    c.strokeStyle = 'rgba(235,250,255,.7)'; c.lineWidth = 0.9;
    c.beginPath(); c.ellipse(d.x, d.y + 0.5, 10 * s, 1.8 * s, 0, 0, Math.PI * 2); c.stroke();
  }
}

// ════════════════════════ Nilüfer, balık, kuğu, kaplumbağa ════════════════════════
function gl12CanliKur() {
  GL.nilufer.length = 0;
  const renk = [['#ffc2d6', '#ff86ac'], ['#fff1f6', '#ffb2cb'], ['#ffd7c2', '#ff9f88'], ['#f4dcff', '#c99cf0']];
  for (let i = 0; i < GL12_NILUFER.length; i++) {
    const n = GL12_NILUFER[i], on = n[1] === 1;
    GL.nilufer.push({
      x: n[0] * T + (gl12Hash(i * 2.7) - 0.5) * 30, y: (on ? GL12_ON_Y : GL12_ARKA_Y) + gl12Hash(i * 4.1) * 6, on,
      s: on ? 1.05 + gl12Hash(i) * 0.2 : 0.72 + gl12Hash(i) * 0.15, acik: 0, acT: -1, renk: renk[i % renk.length],
      yap: [[-16 + gl12Hash(i * 3) * 6, 1, 0.9], [14 + gl12Hash(i * 5) * 8, 2, 0.75], [-2, -1, 1.05]], dokT: 0
    });
  }
  GL.balik.length = 0;
  for (let i = 0; i < GL12_BALIK.length; i++) GL.balik.push({ x0: GL12_BALIK[i] * T, x: 0, y: 0, u: -1, yon: 1, sure: 0.95, gecti: false, renk: i % 2 });
  GL.kugu = { ev: 754 * T, x: 754 * T, y: 772,   // ön şeritte (kayığın önünde, görünsün)
    yon: -1, selam: 0, selamT: 0, gecti: false, kalp: 0 };
  GL.kap = { x: 785 * T, y: 776,   // ön şeritte, taşının üstünde
    bas: 1, sakla: 0, bakT: 0 };
}
function gl12NiluferAc(n) {
  if (n.acT >= 0) return;
  n.acT = 0;
  gl12Halka(n.x, n.y + 1, 14, 1.4, 0.6);
  if (typeof burst === 'function') burst(n.x, n.y - 10 * n.s, 8, [n.renk[0], '#fff6b0', '#ffffff'], 70, 0.9, 6);
  gl12Olay('k12Nilufer', { x: n.x });
}
function gl12BalikZipla(b, yon) {
  if (b.u >= 0) return;
  b.u = 0; b.yon = yon; b.x = b.x0; b.y = GL12_ON_Y - 10;
  b.sure = 0.85 + gl12Hash(GL.t) * 0.25;
  gl12Halka(b.x, b.y, 10, 1.1, 0.9); gl12Sicrat(b.x, b.y, 5, 0.6);
  gl12Olay('k12BalikZipla', { x: b.x });
  const K = GL.kayik && GL.kayik.k;
  if (K && P.ucus === GL.kayik) K.sevT = 1.2;
}
function gl12CanliAdim(dt) {
  const K = GL.kayik && GL.kayik.k, binisli = K && P.ucus === GL.kayik && K.faz === 'yol';
  const fx = P.x;
  // nilüfer: kayıktaki Feza yanından geçince ya da dokununca açılır
  for (const n of GL.nilufer) {
    if (n.acT < 0 && binisli && Math.abs(fx - n.x) < 110) gl12NiluferAc(n);
    if (n.acT >= 0) { n.acT += dt; n.acik = smooth(Math.min(1, n.acT / 1.1)); }
    n.dokT = Math.max(0, n.dokT - dt);
  }
  // balık: kayığın önünde zıplar; arada kendiliğinden de
  for (const b of GL.balik) {
    if (b.u >= 0) {
      b.u += dt / b.sure;
      const u = b.u;
      b.x = b.x0 + b.yon * 74 * u; b.y = GL12_ON_Y - 10 - 62 * 4 * u * (1 - u);
      if (u >= 1) { b.u = -1; gl12Halka(b.x, GL12_ON_Y - 10, 12, 1.3, 1); gl12Sicrat(b.x, GL12_ON_Y - 10, 7, 0.8); gl12Olay('k12Sicrama', { x: b.x, guc: 0.6 }); b.x0 = clamp(b.x0 + (gl12Hash(b.x) - 0.5) * 80, GL12_SU.x0 + 200, GL12_SU.x1 - 200); }
      continue;
    }
    if (binisli) {
      const ileri = (b.x0 - K.x) * K.yon;
      if (!b.gecti && ileri > 120 && ileri < 200 + K.v * 0.9) {   // Feza'nın önüne düşsün (hızlıyken daha erken)
        b.gecti = true; gl12BalikZipla(b, -K.yon); }
      if (ileri < -200) b.gecti = false;
    }
  }
  if (gl12Hash(GL.t * 3.7) < dt / 7 && gl12Ekranda(GL12_SU.x0 + 400, 2000)) {   // ~7 sn'de bir kendiliğinden
    const b = GL.balik[Math.floor(gl12Hash(GL.t) * GL.balik.length)];
    if (b && b.u < 0 && gl12Ekranda(b.x0, -80)) gl12BalikZipla(b, gl12Hash(GL.t * 5) < 0.5 ? 1 : -1);
  }
  // kuğu: yavaşça süzülür; kayık yaklaşınca dönüp boynunu eğerek selam verir
  const k = GL.kugu;
  if (k) {
    const hedef = k.ev + Math.sin(GL.t * 0.11) * 230;
    const vx = (hedef - k.x) * 0.6;
    k.x += vx * dt;
    if (k.selam <= 0 && Math.abs(vx) > 2) k.yon = vx > 0 ? 1 : -1;
    if (binisli && !k.gecti && Math.abs(fx - k.x) < 230) { k.gecti = true; gl12KuguSelam(k); }
    if (!binisli) k.gecti = false;
    if (k.selam > 0) { k.selam -= dt; if (K && binisli) k.yon = K.x > k.x ? 1 : -1; }
    k.kalp = Math.max(0, k.kalp - dt);
  }
  // kaplumbağa: taşında güneşlenir; kayık geçerken başını kaldırıp bakar
  const q = GL.kap;
  if (q) {
    q.sakla = Math.max(0, q.sakla - dt);
    const hedefBas = q.sakla > 0.6 ? 0 : (binisli && Math.abs(fx - q.x) < 260 ? 1.25 : 1);
    q.bas += (hedefBas - q.bas) * (1 - Math.exp(-dt * 5));
  }
}
function gl12KuguSelam(k) {
  k.selam = 1.8; k.kalp = 1.2;
  gl12Olay('k12Kugu', { x: k.x });
  if (typeof burst === 'function') burst(k.x + k.yon * 24, k.y - 60, 5, ['#ffb6cc', '#ffffff', '#ffe3ef'], 50, 1, 6);
  const K = GL.kayik && GL.kayik.k;
  if (K && P.ucus === GL.kayik) K.elT = 1.8;
}

function gl12NiluferCiz(c, n, tm) {
  const sp = GL.spr, sal = Math.sin(tm * 1.3 + n.x * 0.01) * 0.6;
  c.save(); c.translate(n.x, n.y + sal);
  for (const y of n.yap) {
    const w = 52 * n.s * y[2], h = 18 * n.s * y[2];
    c.drawImage(sp.yaprak, y[0] * n.s - w / 2, y[1] * n.s - h / 2, w, h);
  }
  // çiçek: kapalıyken pembe tomurcuk, açılınca iki sıra taç yaprak
  const a = n.acik, s = n.s * (0.75 + 0.35 * a), dok = n.dokT > 0 ? Math.sin(n.dokT / 0.5 * Math.PI) * 0.15 : 0;
  c.translate(2 * n.s, -1.5 * n.s); c.scale(s * (1 + dok), s * (1 - dok * 0.5));
  if (a < 0.02) {
    c.fillStyle = n.renk[1];
    c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-5, -5, 0, -12); c.quadraticCurveTo(5, -5, 0, 0); c.fill();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-1.2, -6, 1, 3, 0, 0, Math.PI * 2); c.fill();
  } else {
    for (let sira = 0; sira < 2; sira++) {
      const n2 = sira ? 5 : 6, yay = (sira ? 1.0 : 1.35) * a, boy = sira ? 9 : 11;
      c.fillStyle = sira ? n.renk[0] : n.renk[1];
      for (let i = 0; i < n2; i++) {
        const t = n2 === 1 ? 0 : i / (n2 - 1) - 0.5, ang = -Math.PI / 2 + t * 2 * yay;
        c.save(); c.rotate(ang + Math.PI / 2); c.scale(1, 0.85);
        c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-3.6, -boy * 0.55, 0, -boy); c.quadraticCurveTo(3.6, -boy * 0.55, 0, 0); c.fill();
        c.restore();
      }
    }
    c.fillStyle = '#ffd65a'; c.beginPath(); c.ellipse(0, -2.5, 3 * a, 1.8 * a, 0, 0, Math.PI * 2); c.fill();
    if (a > 0.6) { const pr = 0.5 + 0.5 * Math.sin(tm * 3 + n.x); c.globalAlpha = 0.35 * pr * a; c.drawImage(glow('#fff2b0'), -14, -16, 28, 28); c.globalAlpha = 1; }
  }
  c.restore();
}
function gl12BalikCiz(c, b) {
  if (b.u < 0) return;
  const u = b.u, egim = Math.atan2(-62 * 4 * (1 - 2 * u) / b.sure, b.yon * 74 / b.sure);
  c.save(); c.translate(b.x, b.y); c.rotate(egim); c.scale(1, b.yon);
  c.fillStyle = b.renk ? '#ffa24a' : '#ff7f5c';
  c.beginPath(); c.moveTo(-11, 0); c.lineTo(-17, -5.5); c.lineTo(-16, 0); c.lineTo(-17, 5.5); c.closePath(); c.fill();   // kuyruk
  c.beginPath(); c.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fff6ea'; c.beginPath(); c.ellipse(2, 1.6, 6, 2.2, 0.1, 0, Math.PI * 2); c.fill();
  c.fillStyle = b.renk ? '#ff8a2a' : '#f25d3a'; c.beginPath(); c.moveTo(-3, -4.5); c.quadraticCurveTo(1, -9, 5, -4.4); c.closePath(); c.fill();
  c.fillStyle = '#2d2a33'; c.beginPath(); c.arc(7.5, -1.2, 1.1, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#fff'; c.beginPath(); c.arc(7.9, -1.6, 0.4, 0, Math.PI * 2); c.fill();
  c.restore();
}
function gl12KuguCiz(c, k, tm) {
  const eg = k.selam > 0 ? Math.sin(clamp(1 - k.selam / 1.8, 0, 1) * Math.PI) : 0;   // boyun eğme 0..1..0
  c.save(); c.translate(k.x, k.y + Math.sin(tm * 1.6) * 0.8);
  c.beginPath(); c.rect(-60, -80, 120, 80.5); c.clip();
  c.scale(k.yon * GL12_KUGU_S, GL12_KUGU_S);
  c.lineJoin = 'round'; c.lineCap = 'round';
  // gövde ve kanat
  c.fillStyle = '#ffffff'; c.strokeStyle = '#d3dbe6'; c.lineWidth = 1;
  c.beginPath(); c.moveTo(-28, -14); c.quadraticCurveTo(-30, -24, -20, -20); c.quadraticCurveTo(0, -24, 18, -14);
  c.quadraticCurveTo(26, -6, 18, 2); c.lineTo(-22, 2); c.quadraticCurveTo(-30, -4, -28, -14); c.fill(); c.stroke();
  c.fillStyle = '#f1f4f9';
  c.beginPath(); c.moveTo(-18, -12); c.quadraticCurveTo(-6, -26 - eg * 8, 10, -16); c.quadraticCurveTo(0, -8, -18, -12); c.fill();
  // boyun (S kıvrımı) ve baş; selamda öne eğilir
  const hx = 21 + eg * 12, hy = -46 + eg * 22;
  c.strokeStyle = '#ffffff'; c.lineWidth = 6.5;
  c.beginPath(); c.moveTo(13, -14); c.bezierCurveTo(26, -22, 10 + eg * 10, -36 + eg * 10, hx, hy); c.stroke();
  c.strokeStyle = '#d3dbe6'; c.lineWidth = 0.8;
  c.beginPath(); c.moveTo(16.5, -15); c.bezierCurveTo(29.5, -23, 13.5 + eg * 10, -36 + eg * 10, hx + 3, hy + 1); c.stroke();
  c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(hx + 1, hy, 5.5, 4.4, 0.2 + eg * 0.5, 0, Math.PI * 2); c.fill();
  c.save(); c.translate(hx + 1, hy); c.rotate(0.25 + eg * 0.6);
  c.fillStyle = '#ff8c3a'; c.beginPath(); c.moveTo(3, -2); c.lineTo(11, 0.5); c.lineTo(3, 2.4); c.closePath(); c.fill();
  c.fillStyle = '#3b3440'; c.beginPath(); c.ellipse(3, 0, 1.5, 2.2, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#2b2530'; c.beginPath(); c.arc(0.6, -1.4, 1, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(255,150,170,.45)'; c.beginPath(); c.arc(-0.5, 1.4, 1.5, 0, Math.PI * 2); c.fill();
  c.restore();
  c.restore();
  c.strokeStyle = 'rgba(235,250,255,.6)'; c.lineWidth = 1;
  c.beginPath(); c.ellipse(k.x, k.y + 0.5, 26 * GL12_KUGU_S, 2.6 * GL12_KUGU_S, 0, 0, Math.PI * 2); c.stroke();
  if (k.kalp > 0) {   // selamda küçük kalp yükselir
    const u = 1 - k.kalp / 1.2, x = k.x + k.yon * 30, y = k.y - 68 - u * 26;
    c.globalAlpha = Math.min(1, k.kalp * 2) * 0.9;
    c.fillStyle = '#ff8fb0'; c.beginPath(); c.moveTo(x, y + 3.5); c.bezierCurveTo(x - 6, y - 1, x - 3, y - 6, x, y - 2.5); c.bezierCurveTo(x + 3, y - 6, x + 6, y - 1, x, y + 3.5); c.fill();
    c.globalAlpha = 1;
  }
}
function gl12KapCiz(c, q, tm) {
  c.save(); c.translate(q.x, q.y); c.scale(1.45, 1.45);
  c.fillStyle = '#8f9b97'; c.beginPath(); c.ellipse(0, 2, 26, 9, 0, Math.PI, 0); c.fill();          // taş (su üstündeki kısmı)
  c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-6, -3, 12, 3, -0.1, 0, Math.PI * 2); c.fill();
  const sal = q.sakla > 0 ? Math.sin(q.sakla * 26) * 1.2 : 0;
  c.translate(sal, -6);
  const b = q.bas;
  c.fillStyle = '#9bd08a'; c.strokeStyle = '#5e9a55'; c.lineWidth = 0.9;
  if (b > 0.05) {   // baş ve ayaklar
    c.beginPath(); c.ellipse(-8, -1, 3, 2, 0, 0, Math.PI * 2); c.ellipse(9, -1, 3, 2, 0, 0, Math.PI * 2); c.fill();
    const hx = 12 + 6 * b, hy = -5 - 3 * Math.max(0, b - 1) * 8 + Math.sin(tm * 1.2) * 0.4;
    c.beginPath(); c.ellipse(hx, hy, 4.4 * Math.min(1, b), 3.6 * Math.min(1, b), 0, 0, Math.PI * 2); c.fill(); c.stroke();
    if (b > 0.5) {
      c.fillStyle = '#2d2a28'; c.beginPath(); c.arc(hx + 1.6, hy - 1, 0.9, 0, Math.PI * 2); c.fill();
      c.strokeStyle = '#4f7f48'; c.lineWidth = 0.7; c.beginPath(); c.arc(hx + 1.5, hy + 1, 1.6, 0.3, 1.6); c.stroke();
    }
  }
  c.fillStyle = '#6aa86a'; c.strokeStyle = '#4d8550'; c.lineWidth = 1;
  c.beginPath(); c.ellipse(0, -3, 13, 8.5, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(200,235,170,.7)'; c.lineWidth = 0.8;
  c.beginPath(); c.moveTo(-6, -3); c.lineTo(-3, -9); c.lineTo(3, -9); c.lineTo(6, -3); c.moveTo(-3, -9); c.lineTo(-7, -7); c.moveTo(3, -9); c.lineTo(7, -7); c.stroke();
  c.restore();
}

// ════════════════════════ Su (zemin katmanı) ════════════════════════
function gl12SuCiz(tm) {
  if (!gl12Aktif() || typeof cam === 'undefined' || !GL.golet) return;
  const xa = Math.max(GL12_SU.x0, cam.x - 20), xb = Math.min(GL12_SU.x1, cam.x + VW + 20);
  if (xa >= xb) return;
  GL.suKare = now;
  const sp = gl12Sprite(), c = g, ust = GL12_SU.ust, alt = gl12Alt(), t = GL.t;
  c.save();
  c.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  c.beginPath(); c.rect(xa, ust - 2, xb - xa, alt - ust + 4); c.clip();
  // temel renk (önbellekli geçiş) ve derin kısım
  c.globalAlpha = 0.5; c.drawImage(sp.su, 0, 0, 2, 4, xa, ust, xb - xa, 4);   // üst kenar yumuşak: uzak göle karışır
  c.globalAlpha = 1; c.drawImage(sp.su, 0, 4, 2, 96, xa, ust + 4, xb - xa, 96);
  if (alt > ust + 100) { c.fillStyle = '#3a8fb2'; c.fillRect(xa, ust + 99, xb - xa, alt - ust - 98); }
  // gün batımı yansıması: altın saatte suyun üstüne sıcak ton ve güneşten bir ışık yolu
  const I = typeof dn12Isik === 'function' ? dn12Isik() : null, guc = I && Number.isFinite(I.guc) ? I.guc : 0;
  if (guc > 0.03 && I.ton) {
    c.globalAlpha = 0.16 * guc; c.fillStyle = I.ton; c.fillRect(xa, ust, xb - xa, 40);
    const gx = cam.x + VW * (typeof DN12 !== 'undefined' && DN12 && Number.isFinite(DN12.gunesX) ? DN12.gunesX : 0.7);
    for (let i = 0; i < 12; i++) {
      const y = ust + 4 + i * 6.5, w = (46 - i * 2.2) * (0.7 + 0.3 * Math.sin(t * 2.1 + i * 1.7));
      c.globalAlpha = guc * (0.45 - i * 0.03);
      c.fillRect(gx - w / 2 + Math.sin(t * 1.3 + i * 2.3) * 5, y, w, 1.6);
    }
    c.globalAlpha = 1;
  }
  // üst kenar: uzak su ile birleşen ince ışık çizgisi
  c.fillStyle = 'rgba(255,255,255,.09)'; c.fillRect(xa, ust + 4, xb - xa, 1.2);
  gl12YansimaCiz(c, tm);
  // yumuşak dalgacık çizgileri
  c.lineWidth = 1; c.lineCap = 'round';
  for (let j = 0; j < 4; j++) {
    const y0 = ust + 12 + j * 17, gen = 1.2 + j * 0.5;
    c.strokeStyle = j % 2 ? 'rgba(255,255,255,.13)' : 'rgba(30,96,128,.12)';
    c.beginPath();
    for (let x = Math.floor(xa / 28) * 28; x <= xb + 28; x += 28) {
      const y = y0 + Math.sin(x * 0.021 + t * (0.9 + j * 0.2) + j) * gen;
      if (x === Math.floor(xa / 28) * 28) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.stroke();
  }
  // pırıltılar: yüzeyde kayan, yanıp sönen kısa ışık çizgileri
  c.fillStyle = '#ffffff';
  for (let i = Math.floor(xa / 46); i <= Math.ceil(xb / 46); i++) {
    for (let j = 0; j < 2; j++) {
      const h = gl12Hash(i * 3.1 + j * 17.3), y = ust + 5 + gl12Hash(i * 7.7 + j) * Math.min(90, alt - ust - 6);
      const a = 0.1 + 0.42 * Math.max(0, Math.sin(t * (0.9 + h) + h * 40));
      if (a < 0.12) continue;
      const w = (5 + gl12Hash(i * 1.3 + j * 5) * 18) * (0.6 + (y - ust) / 120);
      c.globalAlpha = a;
      c.fillRect(i * 46 + h * 46 + Math.sin(t * 0.5 + h * 9) * 6 - w / 2, y, w, 1.3);
    }
  }
  c.globalAlpha = 1;
  // kayık izi ve su halkaları (yüzeyde)
  c.strokeStyle = '#effaff'; c.lineWidth = 1.1;
  for (const q of GL.iz) {
    if (!q.on || !gl12Ekranda(q.x, 60)) continue;
    const u = q.t / 2.6, a = (1 - u) * 0.5 * q.guc, yay = 3 + q.t * 9;
    c.globalAlpha = a;
    c.beginPath();
    c.moveTo(q.x - q.yon * (2 + q.t * 4), q.y - yay * 0.35); c.lineTo(q.x - q.yon * (14 + q.t * 10), q.y - yay * 0.42);
    c.moveTo(q.x - q.yon * (2 + q.t * 4), q.y + yay * 0.5); c.lineTo(q.x - q.yon * (14 + q.t * 10), q.y + yay * 0.62);
    c.stroke();
  }
  for (const h of GL.halka) {
    if (!h.on || !gl12Ekranda(h.x, 80)) continue;
    const u = h.t / h.sure, r = h.r * (0.4 + 1.6 * u);
    c.globalAlpha = Math.pow(1 - u, 1.4) * 0.75 * h.guc;
    c.beginPath(); c.ellipse(h.x, h.y, r, r * 0.26, 0, 0, Math.PI * 2); c.stroke();
    if (u < 0.5) { c.beginPath(); c.ellipse(h.x, h.y, r * 0.55, r * 0.14, 0, 0, Math.PI * 2); c.stroke(); }
  }
  c.globalAlpha = 1;
  c.restore();
}
// Yansımalar: iskeleler, kayık (gövde şeritler hâlinde dalgalı), kuğu, ördekler; karakterler için yumuşak renk lekesi
function gl12YansimaCiz(c, tm) {
  const sp = GL.spr, t = GL.t, K = GL.kayik && GL.kayik.k;
  c.globalAlpha = 0.22;
  for (let s = 0; s < 2; s++) {
    const x0 = s ? GL12_ISK.R0 : GL12_ISK.L0, w = (s ? GL12_ISK.R1 - GL12_ISK.R0 : GL12_ISK.L1 - GL12_ISK.L0), img = s ? sp.iskR : sp.iskL;
    if (!gl12Ekranda(x0 + w / 2, w)) continue;
    c.save(); c.translate(x0 - 20, GL12_ISK.suY * 2 - 706 + 14); c.scale(1, -0.8);
    c.drawImage(img, 0, -14 - 72, w + 40, 90);
    c.restore();
  }
  if (K && gl12Ekranda(K.x, 200)) {
    const y0 = GL12_K.suY + K.bob + K.dip, img = sp.dis, kk = GL.K;
    c.globalAlpha = 0.3;
    for (let j = 0; j < 6; j++) {   // gövdenin su üstündeki kısmı (yerel y -40..0) aşağı ters yansır, şerit şerit dalgalanır
      const ly = -40 + j * 7, sx = Math.sin(t * 2.2 + j * 1.3) * 1.8;
      c.save();
      c.translate(K.x + sx, y0); c.scale(K.yonG, -0.78);
      c.drawImage(img, 0, (44 + ly) * kk, img.width, 7 * kk, -112, ly, 224, 7.4);
      c.restore();
    }
    if (K.an.var || P.ucus === GL.kayik) {   // anne ve Feza: yumuşak sıcak lekeler
      c.globalAlpha = 0.16;
      const a = gl12Nokta(K, GL12_K.anneX, 0);
      c.drawImage(glow('#fff1de'), a.x - 18, y0 + 18, 36, 26);
      const f = gl12Nokta(K, GL12_K.fezaX, 0);
      c.drawImage(glow('#ffe3ec'), f.x - 14, y0 + 14, 28, 20);
    }
  }
  const k = GL.kugu;
  if (k && gl12Ekranda(k.x, 80)) { c.globalAlpha = 0.28; c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(k.x, k.y + 7, 28, 5, 0, 0, Math.PI * 2); c.fill(); }
  c.fillStyle = '#ffe680';
  for (const d of GL.ordek) {
    if (d.mod !== 'su' || d.gec > 0 || !gl12Ekranda(d.x, 40)) continue;
    c.globalAlpha = 0.22; c.fillStyle = d.anne ? '#fffaf0' : '#ffe27a';
    c.beginPath(); c.ellipse(d.x, d.y + 4, d.anne ? 13 : 8, d.anne ? 3.2 : 2.2, 0, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}

// ════════════════════════ Kayık çizimi ════════════════════════
function gl12KurekCiz(c, K, yakin) {
  const p = gl12PalaUcu(K, yakin);
  const dx = p.x - p.ox, dy = p.y - p.oy, L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L;
  const sx = p.hx - ux * 6, sy = p.hy - uy * 6;                 // sap ucu (elin biraz gerisi)
  const pb = GL12_K.kurekBoy - 20, bx = p.ox + ux * pb, by = p.oy + uy * pb;   // pala başlangıcı
  const ciz = () => {
    c.strokeStyle = yakin ? '#8a6238' : '#7a5530'; c.lineWidth = 3.4;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(p.x, p.y); c.stroke();
    c.strokeStyle = yakin ? '#e2bd8a' : '#c9a273'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(p.x, p.y); c.stroke();
    c.fillStyle = yakin ? '#ecc994' : '#cfa877'; c.strokeStyle = '#8a6238'; c.lineWidth = 1;
    c.beginPath(); c.ellipse((bx + p.x) / 2, (by + p.y) / 2, 11, 3.6, Math.atan2(uy, ux), 0, Math.PI * 2); c.fill(); c.stroke();
  };
  c.lineCap = 'round';
  const su = GL12_K.suY + K.bob * 0.3;
  c.save(); c.beginPath(); c.rect(K.x - 300, su - 300, 600, 300); c.clip(); ciz(); c.restore();        // su üstü
  c.save(); c.beginPath(); c.rect(K.x - 300, su, 600, 200); c.clip(); c.globalAlpha = 0.38; ciz(); c.restore();   // su altı (soluk)
  if (yakin) { c.fillStyle = '#5c3a22'; c.beginPath(); c.arc(p.ox, p.oy, 2, 0, Math.PI * 2); c.fill(); }   // ıskarmoz
}
function gl12BayrakCiz(c, K, tm) {
  const tep = gl12Nokta(K, 97, -66), tx = tep.x, ty = tep.y;
  const dib = gl12Nokta(K, 96, -34), bx = dib.x, by = dib.y;
  c.strokeStyle = '#efdcb8'; c.lineWidth = 1.7; c.lineCap = 'round';
  c.beginPath(); c.moveTo(bx, by); c.lineTo(tx, ty); c.stroke();
  const ruz = 0.35 + 0.65 * clamp(K.v / GL12_K.hizBas, 0, 1), d = K.yonG >= 0 ? -1 : 1;
  const dal = Math.sin(tm * (4 + ruz * 5)) * (3 - ruz), uz = 18 + ruz * 4;
  c.fillStyle = '#ff6f8a';
  c.beginPath(); c.moveTo(tx, ty + 1);
  c.quadraticCurveTo(tx + d * uz * 0.5, ty + 2 + dal, tx + d * uz, ty + 5 + dal * 0.6);
  c.quadraticCurveTo(tx + d * uz * 0.5, ty + 8 - dal * 0.4, tx, ty + 10); c.closePath(); c.fill();
  c.fillStyle = '#fff7d8'; c.beginPath(); c.arc(tx + d * 6, ty + 5.4 + dal * 0.3, 1.6, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#ffd86a'; c.beginPath(); c.arc(tx, ty - 1.5, 2, 0, Math.PI * 2); c.fill();
}
function gl12GovdeCiz(c, K, img) {   // gövde tuvalini kayığın dönüşümüyle çiz
  c.save();
  c.translate(K.x, gl12Y(K)); c.rotate(K.egim); c.scale(K.yonG, 1);
  c.drawImage(img, -112, -44, 224, 72);
  c.restore();
}

// ════════════════════════ Dokunma ════════════════════════
function gl12Dokun(wx, wy) {
  let vurdu = false;
  for (const d of GL.ordek) {
    const s = d.anne ? 1.55 : 1;
    if (Math.abs(wx - d.x) < 18 * s && wy > d.y - 26 * s && wy < d.y + 8) { gl12OrdekDokun(d); vurdu = true; break; }
  }
  if (!vurdu) for (const n of GL.nilufer) {
    if (Math.abs(wx - n.x) < 30 * n.s && Math.abs(wy - (n.y - 4)) < 18) { gl12NiluferAc(n); n.dokT = 0.5; vurdu = true; break; }
  }
  const k = GL.kugu;
  if (!vurdu && k && Math.abs(wx - k.x) < 44 && wy > k.y - 72 && wy < k.y + 8) { gl12KuguSelam(k); vurdu = true; }
  const q = GL.kap;
  if (!vurdu && q && Math.abs(wx - q.x) < 38 && wy > q.y - 36 && wy < q.y + 10) { q.sakla = 1.6; vurdu = true; if (typeof burst === 'function') burst(q.x, q.y - 14, 4, ['#c8f0b0', '#ffffff'], 40, 0.7, 5); }
  if (!vurdu && wx > GL12_SU.x0 && wx < GL12_SU.x1 && wy > GL12_SU.ust + 4) {   // suya dokunuş: halka (+ arada balık)
    const ny = Math.max(wy, GL12_SU.ust + 8);
    gl12Halka(wx, ny, 14, 1.4, 0.9); gl12Halka(wx, ny, 7, 1, 0.6);
    gl12Olay('k12SuDokun', { x: wx });
    for (const b of GL.balik) if (b.u < 0 && Math.abs(b.x0 - wx) < 260) { b.x0 = clamp(wx, GL12_SU.x0 + 120, GL12_SU.x1 - 120); gl12BalikZipla(b, gl12Hash(wx) < 0.5 ? 1 : -1); break; }
    return false;   // su dokunuşu Feza'nın yürümesini engellemez
  }
  return vurdu;
}
if (typeof cv !== 'undefined' && cv && cv.addEventListener) {
  cv.addEventListener('pointerdown', e => {
    if (!gl12Aktif() || typeof DURUM === 'undefined' || DURUM !== 'oyun' || !GL.golet || typeof cam === 'undefined') return;
    if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
    const r = cv.getBoundingClientRect();
    const wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
    if (wx < GL12_KIYI.sinirL - 200 || wx > GL12_KIYI.sinirR + 200) return;
    let vurdu = false;
    try { vurdu = gl12Dokun(wx, wy); } catch (err) { vurdu = false; }
    if (vurdu && !P.ucus) { e.preventDefault(); e.stopImmediatePropagation(); }   // yalnız kendi canlımıza isabet edince (kayıkta hiç)
  });
}

// ════════════════════════ Ortak kare adımı (iki tür de çağırır; karede bir kez) ════════════════════════
function gl12Kare(dt) {
  if (GL.kareT === now) return;
  GL.kareT = now;
  GL.t += dt;
  for (const h of GL.halka) if (h.on) { h.t += dt; if (h.t >= h.sure) h.on = false; }
  for (const q of GL.iz) if (q.on) { q.t += dt; if (q.t >= 2.6) q.on = false; }
  if (GL.ordek.length) gl12OrdekAdim(dt);
  if (GL.nilufer.length) gl12CanliAdim(dt);
}

// ════════════════════════ Türler ════════════════════════
TUR.kaydet('k12Golet', {
  kur(o) {
    GL.golet = o;
    o.x0 = o.x0 || GL12_KIYI.sinirL; o.x1 = o.x1 || GL12_KIYI.sinirR;
    gl12OrdekKur(); gl12CanliKur();
  },
  guncelle(o, dt) {
    if (!gl12Aktif()) return;
    // çizim ayıklaması o.x'e bakar: gölet bölgesindeyken nesne hep kameranın ortasında dursun
    if (typeof cam !== 'undefined') o.x = clamp(cam.x + VW / 2, o.x0, o.x1);
    gl12Kare(dt);
  },
  ciz(o, tm) {
    if (!gl12Aktif()) return;
    gl12Sprite();
    if (GL.suKare !== now) gl12SuCiz(tm);   // zemin12.js çağırmadıysa suyu burada çiz
    const c = g;
    for (const n of GL.nilufer) if (!n.on && gl12Ekranda(n.x, 60)) gl12NiluferCiz(c, n, tm);
    const sp = GL.spr;   // iskeleler (ördekler iskelenin üstünde/önünde yürüsün diye onlardan önce)
    if (gl12Ekranda((GL12_ISK.L0 + GL12_ISK.L1) / 2, 400)) c.drawImage(sp.iskL, GL12_ISK.L0 - 20, 692, GL12_ISK.L1 - GL12_ISK.L0 + 40, 90);
    if (gl12Ekranda((GL12_ISK.R0 + GL12_ISK.R1) / 2, 400)) c.drawImage(sp.iskR, GL12_ISK.R0 - 20, 692, GL12_ISK.R1 - GL12_ISK.R0 + 40, 90);
    gl12FenerIsik(c, tm);
    for (const d of GL.ordek) if (gl12Ekranda(d.x, 40)) gl12OrdekCiz(c, d, tm);
  },
  cizOn(o, tm) {
    if (!gl12Aktif() || GL.kayik) return;   // kayık varsa ön katmanı o çizer (kayığın önünde kalsın)
    gl12OnKatman(g, tm);
  }
});
function gl12FenerIsik(c, tm) {   // gün batımında iskele fenerleri yanar
  const I = typeof dn12Isik === 'function' ? dn12Isik() : null, guc = I && Number.isFinite(I.guc) ? I.guc : 0;
  if (guc < 0.45) return;
  const a = clamp((guc - 0.45) / 0.3, 0, 1) * (0.85 + 0.15 * Math.sin(tm * 3));
  const xl = GL12_ISK.L1 - 8, xr = GL12_ISK.R0 + 8, y = 692 + 14 - 38;
  for (const x of [xl, xr]) {
    if (!gl12Ekranda(x, 60)) continue;
    c.globalAlpha = a; c.drawImage(glow('#ffd88a'), x - 28, y - 28, 56, 56);
    c.globalAlpha = a * 0.9; c.fillStyle = '#fff3c4'; c.beginPath(); c.arc(x, y, 3.6, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
function gl12OnKatman(c, tm) {   // ön şerit: nilüferler ve zıplayan balıklar (kayığın önünde)
  for (const n of GL.nilufer) if (n.on && gl12Ekranda(n.x, 60)) gl12NiluferCiz(c, n, tm);
  if (GL.kap && gl12Ekranda(GL.kap.x, 60)) gl12KapCiz(c, GL.kap, tm);
  if (GL.kugu && gl12Ekranda(GL.kugu.x, 90)) gl12KuguCiz(c, GL.kugu, tm);
  for (const b of GL.balik) if (b.u >= 0 && gl12Ekranda(b.x, 60)) gl12BalikCiz(c, b);
}

TUR.kaydet('k12Kayik', {
  kur(o) {
    GL.kayik = o;
    o.k = gl12KayikYeni(o);
    o.adim = (dt, U) => {   // P.ucus = o iken oyun.js her adımda çağırır
      if (!gl12Aktif()) { P.ucus = null; return; }
      gl12Kare(dt);
      gl12KayikIlerle(o, dt, U || null);
    };
  },
  guncelle(o, dt) {
    if (!gl12Aktif()) return;
    gl12Kare(dt);
    const K = o.k;
    o.x = K.x;
    if (P.ucus === o) return;            // Feza kayıkta: adim() ilerletir
    gl12KayikIlerle(o, dt, null);
    if (P.ucus || typeof DURUM === 'undefined' || DURUM !== 'oyun' || P.fade > 0) return;
    const L1 = GL12_ISK.L1, R0 = GL12_ISK.R0;
    // Feza'nın tarafında kayık yoksa (ışınlanma), kayık görünmeden o iskeleye gelir
    if (K.faz === 'bekle') {
      const taraf = P.x < (L1 + R0) / 2 ? 'L' : 'R';
      if (taraf !== K.yer && !gl12Ekranda(K.x, 300)) {
        K.yer = taraf; K.yon = taraf === 'L' ? 1 : -1; K.yonG = K.yon; K.x = taraf === 'L' ? GL12_K.merkezL : GL12_K.merkezR;
      }
    }
    // iskelenin ucu kayığa açılır: Feza oturağın hizasına gelince biner
    if (K.faz === 'bekle') {
      const binX = K.x + K.yon * GL12_K.fezaBin;   // kayığın kıçına yetişince zıplayıp biner
      if (K.yer === 'L' && P.x >= binX && P.x < L1 + 60) { gl12Basla(o, false); return; }
      if (K.yer === 'R' && P.x <= binX && P.x > R0 - 60) { gl12Basla(o, false); return; }
    }
    // suya yürünmez: iskele ucunda durur; suyun ortasındaysa (ışınlanma) kayık hemen altına gelir
    if (P.x > L1 + 60 && P.x < R0 - 60) {
      if (K.faz === 'bekle' || K.faz === 'don') {
        K.faz = 'bekle'; K.donuyor = false; K.yon = P.f < 0 ? -1 : 1; K.yonG = K.yon; K.yer = K.yon > 0 ? 'L' : 'R';
        K.x = clamp(P.x - K.yon * GL12_K.fezaX, GL12_K.varisL, GL12_K.varisR);
        if (gl12AnneVar() && typeof ANNE12 !== 'undefined') { ANNE12.x = K.x - K.yon * 30; ANNE12.y = GL12_ISK.y; }
        gl12Basla(o, true);
      }
      return;
    }
    if (P.x > L1 - 4 && P.x <= L1 + 60) { P.x = L1 - 4; if (P.vx > 0) P.vx = 0; }
    if (P.x < R0 + 4 && P.x >= R0 - 60) { P.x = R0 + 4; if (P.vx < 0) P.vx = 0; }
  },
  ciz(o, tm) {
    if (!gl12Aktif()) return;
    const K = o.k, sp = gl12Sprite(), c = g;
    if (!gl12Ekranda(K.x, 260)) return;
    const binisli = P.ucus === o;
    if (K.an.var && K.an.faz === 'otur') gl12KurekCiz(c, K, 0);        // uzak kürek
    gl12GovdeCiz(c, K, sp.ic);
    if (K.an.var && typeof anne12Ciz === 'function') {
      try { anne12Ciz(c, K.an.x, K.an.y, 1, tm, GL.aopt); } catch (e) {}
    }
    // Feza'yı drawFeza çizer (fezapoz12.js). O yoksa geçici yedek çizim:
    if (binisli && typeof fezaPoz12 !== 'function' && typeof fezaCizPoz === 'function') {
      try { fezaCizPoz(c, P.x, P.y, 1, 'binis', tm); } catch (e) {}
      c.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
    }
  },
  cizOn(o, tm) {
    if (!gl12Aktif()) return;
    const K = o.k, sp = gl12Sprite(), c = g;
    if (gl12Ekranda(K.x, 260)) {
      gl12GovdeCiz(c, K, sp.dis);
      if (K.an.var && K.an.faz === 'otur') gl12KurekCiz(c, K, 1);      // yakın kürek (gövdenin önünde)
      else gl12KurekDinlen(c, K);
      gl12BayrakCiz(c, K, tm);
    }
    if (P.ucus === o && typeof pirilCizPoz === 'function' && Number.isFinite(K.px)) {   // Pırıl yanlarında uçar
      c.save(); c.translate(K.px, K.py); if (K.pyon < 0) c.scale(-1, 1);
      try { pirilCizPoz(c, 0, 0, 1, 'ucus', tm); } catch (e) {}
      c.restore();
      c.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
    }
    gl12OnKatman(c, tm);
  }
});
function gl12KurekDinlen(c, K) {   // kayık beklerken kürekler küpeştede yatar
  const a = gl12Nokta(K, -70, -24), ax = a.x, ay = a.y, b = gl12Nokta(K, 30, -27);
  c.strokeStyle = '#8a6238'; c.lineWidth = 3.2; c.lineCap = 'round';
  c.beginPath(); c.moveTo(ax, ay); c.lineTo(b.x, b.y); c.stroke();
  c.strokeStyle = '#e2bd8a'; c.lineWidth = 1.8;
  c.beginPath(); c.moveTo(ax, ay); c.lineTo(b.x, b.y); c.stroke();
  const p = gl12Nokta(K, -78, -23);
  c.fillStyle = '#ecc994'; c.strokeStyle = '#8a6238'; c.lineWidth = 1;
  c.beginPath(); c.ellipse(p.x, p.y, 11, 3.4, K.egim, 0, Math.PI * 2); c.fill(); c.stroke();
}

// Test kancası (konsoldan): GL12T.durum() → kayığın ve ördeklerin özeti
const GL12T = {
  durum() {
    const K = GL.kayik && GL.kayik.k;
    return K ? { faz: K.faz, x: Math.round(K.x), v: Math.round(K.v), yon: K.yon, yer: K.yer, anne: K.an.var ? K.an.faz : '-', ordek: GL.katilan,
      acik: GL.nilufer.filter(n => n.acT >= 0).length } : null;
  }
};
