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
const GL12_SU = { x0: 826 * T, x1: 1007 * T, ust: 702 };                                  // oyun düzlemindeki su şeridi
const GL12_ISK = { L0: 829 * T, L1: 840 * T, R0: 993 * T, R1: 1006 * T, y: 720, suY: 734 };  // iskele tahtaları (üstü y = 720)
const GL12_KIYI = { L: 830 * T, R: 1005 * T, sinirL: 805 * T, sinirR: 1030 * T };            // kıyı çizgisi ve gölet bölgesi
const GL12_K = {
  suY: 742,                                   // kayığın su çizgisi
  // Bekleyen kayık iskelenin ucuna yanaşık durur (oturağı iskele ucunun önünde: Feza yürüyünce doğrudan biner).
  // Varışta ise burnu iskeleye değer (gövde iskelenin önünü kapatmaz); anne kayığın içinde öne yürüyüp iskeleye çıkar.
  merkezL: 840 * T - 56, merkezR: 993 * T + 56,   // iki iskelede bekleyen kayığın merkezi
  varisL: 840 * T + 107, varisR: 993 * T - 107,   // varışta kayığın merkezi (sola / sağa giderken)
  fezaX: 44, fezaY: 1,                        // Feza'nın altındaki kayık tabanı (oturak 13 birim yukarıda: FEZA12_ARAC.kayik)
  anneX: -30, anneY: 6,                       // annenin ayak tabanı (kayığın tabanı)
  kicAdim: -82,                               // binerken annenin kayığa adım attığı yer (kıça yakın)
  fezaBin: -66,                               // Feza kayığın bu hizasına gelince zıplayıp oturağına konar
  iskarmozX: -31, iskarmozY: -21,             // kürek pivotu (küpeşte üstünde)
  kurekBoy: 60,                               // pivottan pala ucuna
  hizSuz: 120, hizBas: 320,                   // bırakınca süzülme / basılı tutunca hız (birim/sn)
  binisSure: 0.85, inisSure: 0.8
};
// Nilüferler: [sütun, şerit (0 arka, 1 ön)]
const GL12_NILUFER = [[846, 0], [852, 1], [862, 0], [872, 1], [884, 0], [896, 1], [900, 0],
  [903.5, 1], [905, 1], [906.6, 1],                 // ön nilüfer adacığı (birkaç çiçek bir arada)
  [925, 1], [938, 0], [940.5, 0], [943, 0],         // arka nilüfer adacığı
  [952, 1], [958, 0], [975, 1], [982, 0]];
const GL12_BALIK = [866, 890, 935, 975, 988];      // tek tek zıplayan balıkların sütunları (sürü: GL12_SURU)
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
  fopt: { u: 0, arac: 'kayik', kurek: undefined, aci: 0, salla: 0, bak: 0, sevinc: 0 },                          // fezaPoz12 seçenekleri (tek nesne)
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
// Küçük ördek ve nilüferler, ekranda en az 48 piksel çaplı dokunma alanına sahip.
function gl12DokunYari(r) { return Math.max(r, Math.min(64, 24 * DPR / S)); }
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
  const c = gl12Tuval(2, 100);
  gl12SuBoya(c, '#7cb3dc', '#3a8fb2');
  return c;
}
// Su rengini arka plandaki göle (dunya12.js dn12GolRenk) uydurur: üstte onun rengi, aşağı indikçe derin ton.
// Renk gün boyu yavaşça değiştiği için tuval en çok 0.4 sn'de bir yeniden boyanır (karede gradyan yok).
// Güneşin sudaki ışık sütunu (bir kez çizilir): ortası parlak, kenarlara ve aşağıya doğru sönen sıcak beyaz
let GL12_SUTUN = null;
function gl12GunesSutun() {
  if (GL12_SUTUN) return GL12_SUTUN;
  const c = gl12Tuval(64, 128), x = c.getContext('2d');
  const yat = x.createLinearGradient(0, 0, 64, 0);
  yat.addColorStop(0, 'rgba(255,236,190,0)'); yat.addColorStop(0.5, 'rgba(255,246,222,0.9)'); yat.addColorStop(1, 'rgba(255,236,190,0)');
  x.fillStyle = yat; x.fillRect(0, 0, 64, 128);
  // aşağı indikçe söner: üstü (uzak su) parlak, alt yakın su soluk
  x.globalCompositeOperation = 'destination-in';
  const dik = x.createLinearGradient(0, 0, 0, 128);
  dik.addColorStop(0, 'rgba(0,0,0,1)'); dik.addColorStop(0.35, 'rgba(0,0,0,0.55)'); dik.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = dik; x.fillRect(0, 0, 64, 128);
  GL12_SUTUN = c;
  return c;
}
function gl12SuBoya(c, ust, alt) {
  const x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 100);
  gr.addColorStop(0, ust); gr.addColorStop(0.25, ust); gr.addColorStop(1, alt);
  x.clearRect(0, 0, 2, 100); x.fillStyle = gr; x.fillRect(0, 0, 2, 100);
  GL.suUst = ust; GL.suAlt = alt;
}
function gl12SuRenk(sp) {
  const R = typeof dn12GolRenk === 'function' ? dn12GolRenk() : null;
  if (!R || typeof R.ust !== 'string' || typeof R.alt !== 'string') return;
  if ((R.ust !== GL.suUst || R.alt !== GL.suAlt) && !(now - (GL.suRenkT || -9) < 0.4)) { GL.suRenkT = now; gl12SuBoya(sp.su, R.ust, R.alt); }
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
  O.yon = K.yon; O.kurek = K.kf; O.bak = 1; O.otur = undefined; K.anneSalla = false;
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
    A.faz = 'otur'; A.x = sx; A.y = sy; O.hiz = 0;
    K.anneSalla = K.elT > 0.25;                       // kuğuya Feza'yla birlikte el sallar (uzak eli kürekte)
    O.poz = K.anneSalla ? 'el_salla' : 'kayik_kurek'; O.otur = K.anneSalla ? 'kayik' : undefined;
    O.bak = GLB.ucan.on || K.anneSalla ? -1 : 1;      // çoğunlukla Feza'ya gülümser; kuğuya/gökteki kazlara bakar
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
  const E = typeof ANNE12_ELLER !== 'undefined' && ANNE12_ELLER && K.an.var && K.an.faz === 'otur' && !(yakin && K.anneSalla) ? ANNE12_ELLER : null;
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
  F.salla += ((K.elT > 0 ? 1 : 0) - F.salla) * (1 - Math.exp(-dt * 6));          // kuğuya el sallar
  F.sevinc = K.sevT > 0 ? Math.min(1, K.sevT / 0.4) : 0;                         // balık/köprü: kollar sevinçle kalkar
  K.bakT -= dt;
  if (K.bakT < 0) K.bakT = GL.katilan > 0 ? 5 + gl12Hash(GL.t) * 4 : 99;
  const geri = GL.katilan > 0 && K.bakT < 1.3 ? -1 : 0;
  K.bakH += (geri - K.bakH) * (1 - Math.exp(-dt * 5));
  F.bak = K.bakH;                                          // arada dönüp peşindeki ördeklere bakar
}
// fezapoz12.js 'binis_in' pozunu kayık için de destekliyor mu (FEZA12_ARAC.kayik.binisIn)
function gl12BinisPozu() { return typeof FEZA12_ARAC !== 'undefined' && FEZA12_ARAC && FEZA12_ARAC.kayik && !!FEZA12_ARAC.kayik.binisIn; }

function gl12PirilAdim(K, dt) {
  let tx = K.x + K.yon * (-14 + 52 * Math.sin(GL.t * 0.42)), ty = GL12_K.suY - 158 + 12 * Math.sin(GL.t * 1.05);
  for (const b of GL.balik) if (b.u >= 0 && b.u < 1 && Math.abs(b.x - K.x) < 360) { tx = b.x - b.yon * 40; ty = GL12_K.suY - 120; break; }   // zıplayan balığa bakmaya gider
  if (Math.abs(K.x - GL12_KOPRU.x) < GL12_KOPRU.yari + 280) ty = GL12_KOPRU.ust - 64;   // köprünün üstünden uçar
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
      i, anne, ev: (anne ? 819 : 813 + i * 1.6) * T + gl12Hash(i * 3.1) * 20,
      x: 0, y: GL12_ISK.y, vx: 0, yon: i % 2 ? 1 : -1, mod: 'kara', katildi: false,
      gec: 0, gy0: 0, gy1: 0, adimF: gl12Hash(i) * 3, gagaT: gl12Hash(i * 7) * 3, gaga: 0,
      vakT: 0, cevapT: -1, dalT: 0, kanat: 0, gezX: 0, gezT: gl12Hash(i * 5) * 3
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
    if (d.cevapT >= 0) {
      d.cevapT -= dt;
      if (d.cevapT < 0) {
        d.vakT = .6;
        if (gl12Ekranda(d.x, 40)) gl12Olay('k12OrdekVak', { x: d.x, yavru: !d.anne });
      }
    }
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
  d.vakT = 0.6; d.cevapT = -1;
  const K = GL.kayik && GL.kayik.k;
  if (K && P.ucus === GL.kayik && K.faz === 'yol') {
    // Feza ördeği seçince annesiyle birlikte selamlar; kayık süzülmeye devam eder.
    K.elT = Math.max(K.elT, 1.4); K.bakT = .9;
  }
  gl12Olay('k12OrdekVak', { x: d.x, yavru: !d.anne });
  if (d.mod === 'su' && d.gec === 0 && d.dalT <= 0) { d.dalT = 1.25; d.cikti = false; gl12Halka(d.x, d.y + 1, 8, 1, 0.7); gl12Olay('k12OrdekDal', { x: d.x }); }
  // Anneye dokununca yavruları sırayla selam verir; yavruya anne karşılık verir.
  // Yalnız kanat ve küçük hop: takip yolu, suya giriş ve kayık hızı değişmez.
  for (const q of GL.ordek) {
    if (q !== d && Math.abs(q.x - d.x) < 360 && (d.anne || q.anne))
      q.cevapT = .58 + (d.anne ? q.i * .58 : 0);   // vak sesi alt aralığı 0.5 sn
  }
  if (typeof burst === 'function') burst(d.x, d.y - 18, 5, ['#fff3a0', '#ffd0e0', '#ffffff'], 60, 0.7, 5);
}

// Ördek çizimi. (x, y): karada ayak tabanı, suda su çizgisi. Anne ördek kremsi beyaz, yavrular sarı pofuduk.
const GL12_ORDEK_RENK = {
  anne: { g: '#fbf5e6', k: '#e8decb', o: '#c9b89a', b: '#fffdf6' },
  yavru: { g: '#ffd84f', k: '#f5c235', o: '#d99a22', b: '#ffe772' }
};
function gl12OrdekCiz(c, d, tm) {
  const s = d.anne ? 1.55 : 1, su = d.mod === 'su' && d.gec === 0;
  const atla = d.gec > 0 ? Math.sin(Math.PI * Math.min(1, d.gec)) : 0;
  const hop = d.vakT > 0 && !su ? Math.sin(d.vakT / 0.6 * Math.PI) * 6 : 0;
  let dal = 0;
  if (d.dalT > 0) { const q = 1 - d.dalT / 1.25; dal = q < 0.35 ? q / 0.35 : q < 0.7 ? 1 : 1 - (q - 0.7) / 0.3; }
  if (dal > 0.97) return;
  const sal = su ? Math.sin(tm * 2.1 + d.i) * 0.05 : Math.sin(d.adimF * Math.PI * 2) * 0.13 * clamp(Math.abs(d.vx) / 60, 0, 1);
  const col = d.anne ? GL12_ORDEK_RENK.anne : GL12_ORDEK_RENK.yavru;
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
  GL.kugu = { ev: 932 * T, x: 932 * T, y: 772,   // ön şeritte (kayığın önünde, görünsün)
    yon: -1, selam: 0, selamT: 0, gecti: false, kalp: 0 };
  GL.kap = { x: 978 * T, y: 776,   // ön şeritte, taşının üstünde
    bas: 1, sakla: 0, bakT: 0 };
  gl12BuyukKur();
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
  gl12BuyukAdim(dt, binisli, K);
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

// ════════════════════════ Büyük gölet (tur 2): ada, fıskiye, kuğu yavruları, kazlar, su kaplumbağaları, balık sürüsü,
// balıkçıl, uçan kaz sürüsü, köprü. Hepsi kayık yolculuğunu durdurmadan çevresinde olur; dokununca da tepki verir. ════════════════
const GL12_ADA = { x: 916 * T, y: 716 };                 // söğütlü küçük ada (arka şerit)
const GL12_FISKIYE = { x: 926 * T, y: 724 };             // adanın önünde, suyun içinden fışkırır
// Kayığın altından geçtiği taş kemer köprü: yarım elips açıklık (genişlik 300, sudan tepeye 170), 22 birimlik kemer halkası,
// iki yanda suya inen ayaklar, üstte düz tahta döşeme + korkuluk. Ön yüz kayığın ARKASINDA; yalnız iki dış ayak önde çizilir.
const GL12_KOPRU = { x: 962 * T, yari: 216, ust: 536, su: 742, acik: 150, tepe: 170, halka: 22, ayak: 44 };
const GL12_SURU = 947;                                   // balık sürüsünün sütunu
const GL12_KAZ_UCUS = 950;                               // kayık buraya gelince gökte kaz sürüsü geçer
const GLB = {
  kazlar: [], kaplumbagalar: [], suru: [], yavruKugu: [],
  balikcil: null, fiskiye: { guc: 0, dans: 0, gecti: false, dokT: 0 },
  ucan: { on: false, x: 0, y: 0, t: 0, gecti: false },
  kopruGecti: false, kopruT: 0, sogut: []
};
function gl12BuyukKur() {
  GLB.kazlar.length = 0;
  for (let i = 0; i < 2; i++) GLB.kazlar.push({ ev: 878 * T + i * 46, x: 878 * T + i * 46, y: 726 - i * 3, yon: i ? -1 : 1, otT: 0, gecti: false, cirp: 0 });
  GLB.kaplumbagalar.length = 0;
  const kp = [[898, 1], [912, 0], [969, 0]];
  for (let i = 0; i < kp.length; i++) {
    GLB.kaplumbagalar.push({ ev: kp[i][0] * T, x: kp[i][0] * T, on: kp[i][1] === 1, y: kp[i][1] ? 760 : 724, yon: i % 2 ? -1 : 1,
      faz: 'yuz', t: gl12Hash(i * 3) * 3, gor: 1, bak: 0, gecti: false });
  }
  GLB.suru.length = 0;
  for (let i = 0; i < 5; i++) GLB.suru.push({ x0: GL12_SURU * T + i * 34, x: 0, y: 0, u: -1, bekle: -1, yon: -1, sure: 0.8 + i * 0.04, renk: i % 3 });
  GLB.yavruKugu.length = 0;
  for (let i = 0; i < 3; i++) GLB.yavruKugu.push({ x: GL12_KOPRU.x, y: 774, yon: -1, sira: i });
  GLB.balikcil = { x: 987 * T, y: 722, gerin: 0, gecti: false, avT: 6, av: 0, bas: 0 };
  gl12T3Kur();
  GLB.sogut.length = 0;
  for (let i = 0; i < 26; i++) GLB.sogut.push({ x: -116 + i * 7.6 + gl12Hash(i * 5) * 5, y: -170 + Math.abs(i - 12.5) * 2.6 + gl12Hash(i) * 8, boy: 78 + gl12Hash(i * 9) * 46 - Math.abs(i - 12.5) * 1.6, ph: gl12Hash(i * 2) * 6 });
}

function gl12BuyukAdim(dt, binisli, K) {
  const fx = P.x, t = GL.t;
  gl12T3Adim(dt, binisli, K);
  // kuğu yavruları: annelerinin ardından dizilir
  const k = GL.kugu;
  if (k) for (const y of GLB.yavruKugu) {
    const hx = k.x - k.yon * (38 + y.sira * 22) * GL12_KUGU_S, hy = 774 + Math.sin(t * 2 + y.sira) * 0.8;
    const vx = (hx - y.x) * 2.4;
    y.x += vx * dt; y.y = hy;
    if (Math.abs(vx) > 3) y.yon = vx > 0 ? 1 : -1;
  }
  // kazlar: kayık yaklaşınca boyunlarını uzatıp ötüşür, kanat çırpar
  for (const z of GLB.kazlar) {
    const hedef = z.ev + Math.sin(t * 0.17 + z.ev) * 60;
    const vx = (hedef - z.x) * 0.5; z.x += vx * dt;
    if (z.otT <= 0 && Math.abs(vx) > 2) z.yon = vx > 0 ? 1 : -1;
    z.otT = Math.max(0, z.otT - dt); z.cirp = Math.max(0, z.cirp - dt);
    if (binisli && !z.gecti && Math.abs(fx - z.x) < 260) { z.gecti = true; gl12KazOt(z); }
    if (!binisli) z.gecti = false;
  }
  // su kaplumbağaları: yüzer, kafasını çıkarıp Feza'ya bakar, dalar, başka yerde çıkar
  for (const q of GLB.kaplumbagalar) {
    q.t += dt;
    if (q.faz === 'yuz') {
      q.x += q.yon * 12 * dt;
      if (Math.abs(q.x - q.ev) > 90) q.yon = q.x > q.ev ? -1 : 1;
      q.bak += ((Math.abs(fx - q.x) < 260 ? 1 : 0) - q.bak) * (1 - Math.exp(-dt * 3));
      if (binisli && !q.gecti && Math.abs(fx - q.x) < 200) { q.gecti = true; q.t = 0; gl12Olay('k12KaplumbagaKafa', { x: q.x, golet: true }); }
      if (!binisli) q.gecti = false;
      if (q.t > 9 + gl12Hash(q.ev) * 5 && Math.abs(fx - q.x) > 300) gl12KapDal(q);
    } else if (q.faz === 'dal') {
      q.gor = Math.max(0, 1 - q.t / 0.6);
      if (q.t > 0.6) { q.faz = 'gizli'; q.t = 0; }
    } else if (q.faz === 'gizli') {
      if (q.t > 2.2) { q.faz = 'cik'; q.t = 0; q.x = q.ev + (gl12Hash(t + q.ev) - 0.5) * 140; gl12Halka(q.x, q.y + 1, 10, 1.1, 0.7); }
    } else if (q.faz === 'cik') {
      q.gor = Math.min(1, q.t / 0.5);
      if (q.t > 0.5) { q.faz = 'yuz'; q.t = 0; }
    }
  }
  // balık sürüsü: kayık yaklaşınca beşi art arda zıplar (yay çizerek)
  let suruBasla = false;
  if (binisli) { const ileri = (GL12_SURU * T + 60 - K.x) * K.yon; if (ileri > 140 && ileri < 220 + K.v * 0.9 && !GLB.suruGecti) { GLB.suruGecti = true; suruBasla = true; } if (ileri < -300) GLB.suruGecti = false; }
  for (let i = 0; i < GLB.suru.length; i++) {
    const b = GLB.suru[i];
    if (suruBasla && b.u < 0 && b.bekle < 0) { b.bekle = i * 0.16; b.yon = -(K ? K.yon : 1); }
    if (b.bekle >= 0) { b.bekle -= dt; if (b.bekle < 0) { b.u = 0; b.bekle = -1; gl12Halka(b.x0, GL12_ON_Y - 8, 9, 1, 0.8); gl12Olay('k12BalikZipla', { x: b.x0, suru: true }); if (i === 2 && K) K.sevT = 1.6; } }
    if (b.u >= 0) {
      b.u += dt / b.sure;
      const u = Math.min(1, b.u);
      b.x = b.x0 + b.yon * 64 * u; b.y = GL12_ON_Y - 8 - (48 + i * 6) * 4 * u * (1 - u);
      if (b.u >= 1) { b.u = -1; gl12Halka(b.x, GL12_ON_Y - 8, 10, 1.2, 0.9); gl12Sicrat(b.x, GL12_ON_Y - 8, 4, 0.5); }
    }
  }
  // fıskiye: hep fışkırır; kayık yaklaşınca dans eder (yükselip alçalır), dokununca coşar
  const f = GLB.fiskiye;
  const yakin = binisli && Math.abs(fx - GL12_FISKIYE.x) < 420;
  f.dans += ((yakin ? 1 : 0) - f.dans) * (1 - Math.exp(-dt * 1.5));
  f.dokT = Math.max(0, f.dokT - dt);
  if (yakin && !f.gecti) { f.gecti = true; gl12Olay('k12GolFiskiye', { x: GL12_FISKIYE.x }); }
  if (!binisli) f.gecti = false;
  if (gl12Ekranda(GL12_FISKIYE.x, 200) && gl12Hash(t * 7.3) < dt * 4) gl12Halka(GL12_FISKIYE.x + (gl12Hash(t) - 0.5) * 40, GL12_FISKIYE.y + 1, 8, 1, 0.5);
  // balıkçıl: kıyıdaki sığlıkta tek ayak üstünde; kayık gelince boynunu uzatıp kanatlarını açar; arada balık avlar
  const h = GLB.balikcil;
  if (h) {
    h.gerin = Math.max(0, h.gerin - dt); h.av = Math.max(0, h.av - dt);
    if (binisli && !h.gecti && Math.abs(fx - h.x) < 300) { h.gecti = true; h.gerin = 1.8; gl12Olay('k12Balikcil', { x: h.x }); }
    if (!binisli) h.gecti = false;
    h.avT -= dt;
    if (h.avT < 0) { h.avT = 7 + gl12Hash(t) * 5; if (h.gerin <= 0) { h.av = 0.9; } }
    if (h.av > 0.3 && h.av - dt <= 0.45) { gl12Halka(h.x + 34, h.y + 2, 8, 1, 0.8); gl12Sicrat(h.x + 34, h.y, 3, 0.3); }
  }
  // gökte kaz sürüsü (V düzeni): kayık göletin ortasını geçince bir kez
  const u = GLB.ucan;
  if (binisli && !u.gecti && (fx - GL12_KAZ_UCUS * T) * K.yon > 0) {
    u.gecti = true; u.on = true; u.t = 0; u.x = cam.x + (K.yon > 0 ? VW + 120 : -120); u.y = cam.y + 150; u.yon = -K.yon;
    gl12Olay('k12KazUcus', { x: u.x });
  }
  if (!binisli && u.on === false) u.gecti = false;
  if (u.on) { u.t += dt; u.x += u.yon * 150 * dt; u.y -= 6 * dt; if (u.t > 9) u.on = false; }
  // köprü: altından geçerken bir kez olay (yankılı "ooo" için) + Feza sevinir
  if (binisli) {
    const d = Math.abs(fx - GL12_KOPRU.x);
    if (d < 60 && !GLB.kopruGecti) { GLB.kopruGecti = true; gl12Olay('k12Kopru', { x: GL12_KOPRU.x }); if (K) K.sevT = 1.4; }
    if (d > GL12_KOPRU.yari + 200) GLB.kopruGecti = false;
  }
}
function gl12KazOt(z) {
  z.otT = 1.4; z.cirp = 1;
  gl12Olay('k12Kaz', { x: z.x });
  if (typeof burst === 'function') burst(z.x + z.yon * 20, z.y - 44, 3, ['#ffffff', '#fff3c4'], 40, 0.7, 4);
}
function gl12KapDal(q) {
  if (q.faz !== 'yuz') return;
  q.faz = 'dal'; q.t = 0;
  gl12Halka(q.x, q.y + 1, 12, 1.2, 0.8);
  gl12Olay('k12KaplumbagaDal', { x: q.x });
  if (typeof burst === 'function') burst(q.x, q.y - 4, 4, ['#e8fbff', '#ffffff'], 30, 0.8, 4);   // kabarcıklar
}

// ── Önbellek: söğütlü ada ve köprü ──
function gl12AdaTuval(K) {
  const c = gl12Tuval(440 * K, 250 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(220, 236);           // yerel (0,0) = adanın su çizgisindeki orta noktası
  x.lineJoin = 'round'; x.lineCap = 'round';
  // kıyı taşları
  for (let i = 0; i < 9; i++) { const px = -180 + i * 44 + gl12Hash(i) * 12; x.fillStyle = i % 2 ? '#a9b0a8' : '#c3c8bd'; x.beginPath(); x.ellipse(px, -3, 16 + gl12Hash(i * 3) * 10, 7, 0, Math.PI, 0); x.fill(); }
  // çimenli tümsek
  x.fillStyle = '#5f9d55';
  x.beginPath(); x.moveTo(-196, -2); x.bezierCurveTo(-150, -40, -60, -52, 10, -50); x.bezierCurveTo(90, -48, 170, -34, 196, -2); x.closePath(); x.fill();
  x.fillStyle = '#7bbb68';
  x.beginPath(); x.moveTo(-180, -10); x.bezierCurveTo(-140, -42, -60, -50, 10, -48); x.bezierCurveTo(80, -46, 150, -34, 176, -12); x.bezierCurveTo(90, -26, -60, -30, -180, -10); x.fill();
  for (let i = 0; i < 26; i++) {   // minik çiçekler
    const px = -160 + gl12Hash(i * 7) * 320, py = -14 - gl12Hash(i * 11) * 26;
    x.fillStyle = ['#fff6f0', '#ffd1e0', '#ffe27a', '#d9c8ff'][i % 4]; x.beginPath(); x.arc(px, py, 1.8, 0, Math.PI * 2); x.fill();
  }
  // bank ve fener
  x.fillStyle = '#9a6a42'; x.fillRect(70, -62, 40, 4); x.fillRect(72, -74, 36, 3); x.fillRect(74, -58, 3, 12); x.fillRect(103, -58, 3, 12);
  x.fillStyle = '#3e4a52'; x.fillRect(132, -104, 3, 62); x.fillStyle = '#fff4d0'; x.beginPath(); x.arc(133.5, -108, 5, 0, Math.PI * 2); x.fill();
  // söğüt: gövde ve dalların taç kısmı (sarkan dallar karede sallanır)
  x.strokeStyle = '#7b5a3e'; x.lineWidth = 9;
  x.beginPath(); x.moveTo(-34, -44); x.quadraticCurveTo(-40, -100, -26, -150); x.stroke();
  x.lineWidth = 4; x.beginPath(); x.moveTo(-32, -120); x.quadraticCurveTo(-70, -150, -96, -150); x.moveTo(-30, -130); x.quadraticCurveTo(10, -160, 50, -150); x.stroke();
  const yesil = ['#6fae5c', '#86c16a', '#9bcf76', '#5c9c50'];
  for (let i = 0; i < 70; i++) {
    const a = i * 2.399, r = Math.sqrt(gl12Hash(i * 3.3)) * 1, px = -26 + Math.cos(a) * 92 * r, py = -160 + Math.sin(a) * 34 * r;
    x.fillStyle = yesil[i % 4]; x.beginPath(); x.ellipse(px, py, 14, 9, 0, 0, Math.PI * 2); x.fill();
  }
  return c;
}
function gl12KopruTuval(K) {
  const B = GL12_KOPRU, W = B.yari, ust = B.ust, su = B.su, a = B.acik, h = B.tepe, d = B.halka;
  const c = gl12Tuval((W * 2 + 20) * K, 300 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(W + 10, -500);   // yerel = dünya y (500..800); x 0 = köprünün ortası
  x.lineJoin = 'round'; x.lineCap = 'round';
  const acikYol = () => {   // açıklık: su çizgisine kadar yarım elips, altında dik (suyun içine)
    x.moveTo(-a, 800); x.lineTo(-a, su); x.ellipse(0, su, a, h, 0, Math.PI, 0); x.lineTo(a, 800); x.closePath();
  };
  // gövde (kemer üstü dolgu + ayaklar), açıklık oyulmuş: arkadan gölet ve tepe görünür
  x.save();
  x.beginPath(); x.rect(-W, ust + 14, W * 2, 800 - ust); acikYol(); x.clip('evenodd');
  x.fillStyle = '#e6dccb'; x.fillRect(-W, ust + 14, W * 2, 800 - ust);
  x.strokeStyle = 'rgba(150,128,104,.45)'; x.lineWidth = 1;
  for (let yy = ust + 30, k = 0; yy < 800; yy += 15, k++) {   // taş sıraları
    x.beginPath(); x.moveTo(-W, yy); x.lineTo(W, yy); x.stroke();
    for (let xx = -W + (k % 2) * 13; xx < W; xx += 26) { x.beginPath(); x.moveTo(xx, yy - 15); x.lineTo(xx, yy); x.stroke(); }
  }
  x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(-W, ust + 14, W * 2, 2.5);
  x.fillStyle = 'rgba(50,100,120,.4)'; x.fillRect(-W, su + 2, W * 2, 60);   // suyun içindeki kısım serin tonda
  x.restore();
  // kemer halkası: taş kemer taşları (voussoir), ortada kilit taşı
  const n = 17;
  for (let i = 0; i < n; i++) {
    const t0 = Math.PI + Math.PI * i / n, t1 = Math.PI + Math.PI * (i + 1) / n;
    x.beginPath();
    x.ellipse(0, su, a, h, 0, t0, t1);
    x.ellipse(0, su, a + d, h + d, 0, t1, t0, true);
    x.closePath();
    x.fillStyle = i === (n >> 1) ? '#f3ead8' : i % 2 ? '#d9ccb3' : '#e1d5bd'; x.fill();
    x.strokeStyle = 'rgba(130,108,84,.7)'; x.lineWidth = 1; x.stroke();
  }
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1.2;
  x.beginPath(); x.ellipse(0, su, a + d - 1, h + d - 1, 0, Math.PI * 1.06, Math.PI * 1.94); x.stroke();
  x.strokeStyle = 'rgba(90,70,50,.25)'; x.lineWidth = 3;          // açıklığın içinde ince gölge
  x.beginPath(); x.ellipse(0, su, a - 1.5, h - 1.5, 0, Math.PI, 0); x.stroke();
  // tahta döşeme ve korkuluk
  x.fillStyle = '#b07a4a'; x.fillRect(-W - 6, ust, W * 2 + 12, 14);
  x.fillStyle = '#d29a62'; x.fillRect(-W - 6, ust, W * 2 + 12, 3);
  x.fillStyle = 'rgba(70,40,20,.3)'; x.fillRect(-W - 6, ust + 12, W * 2 + 12, 2);
  x.fillStyle = '#f6efe3';
  for (let xx = -W; xx <= W; xx += 24) x.fillRect(xx - 1.5, ust - 22, 3, 22);
  x.fillRect(-W - 4, ust - 26, W * 2 + 8, 5);
  x.fillRect(-W - 4, ust - 12, W * 2 + 8, 2.5);
  for (let xx = -W + 48; xx < W - 30; xx += 76) {   // korkulukta saksı çiçekleri
    x.fillStyle = '#c96f4f'; x.fillRect(xx - 9, ust - 34, 18, 8);
    for (let j = 0; j < 5; j++) { x.fillStyle = ['#ff8fb0', '#ffd25a', '#ffffff', '#c9a0ff', '#ff9a7a'][(j + (xx | 0)) % 5]; x.beginPath(); x.arc(xx - 7 + j * 3.5, ust - 37 - (j % 2) * 2, 2.6, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#5f9d55'; x.fillRect(xx - 8, ust - 35, 16, 1.5);
  }
  for (const s of [-1, 1]) {   // iki uçta fener direği
    x.fillStyle = '#4a5560'; x.fillRect(s * (W - 6) - 2, ust - 62, 4, 40);
    x.fillStyle = '#fff2c8'; x.beginPath(); x.ellipse(s * (W - 6), ust - 67, 6, 7.5, 0, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#4a5560'; x.lineWidth = 1.4; x.stroke();
  }
  return c;
}

// ── Çizim ──
function gl12AdaCiz(c, tm) {   // arka şerit: ada (önbellek) + sallanan söğüt dalları + fıskiye
  const sp = GL.spr;
  if (!sp.ada) sp.ada = gl12AdaTuval(GL.K);
  const ax = GL12_ADA.x, ay = GL12_ADA.y;
  if (gl12Ekranda(ax, 260)) {
    c.drawImage(sp.ada, ax - 220, ay - 236, 440, 250);
    c.lineCap = 'round';
    for (const d of GLB.sogut) {   // sarkan söğüt dalları rüzgârla salınır
      const sal = Math.sin(tm * 1.1 + d.ph) * 4;
      c.strokeStyle = d.ph > 3 ? 'rgba(110,170,90,.85)' : 'rgba(140,196,104,.85)'; c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(ax + d.x, ay + d.y); c.quadraticCurveTo(ax + d.x + sal * 0.5, ay + d.y + d.boy * 0.5, ax + d.x + sal, ay + d.y + d.boy); c.stroke();
      c.fillStyle = '#9ccf78';
      c.beginPath(); c.ellipse(ax + d.x + sal, ay + d.y + d.boy, 2.6, 4, 0, 0, Math.PI * 2); c.fill();
    }
  }
  gl12FiskiyeCiz(c, tm);
}
function gl12FiskiyeCiz(c, tm) {
  const f = GLB.fiskiye, x0 = GL12_FISKIYE.x, y0 = GL12_FISKIYE.y;
  if (!gl12Ekranda(x0, 200)) return;
  const dans = f.dans, cos = f.dokT > 0 ? Math.sin(f.dokT / 1.2 * Math.PI) : 0;
  const H = 62 + 14 * Math.sin(tm * 1.4) + dans * (34 + 22 * Math.sin(tm * 2.6)) + cos * 50;
  c.lineCap = 'round';
  c.globalAlpha = 0.25; c.drawImage(glow('#ffffff'), x0 - 40, y0 - 20, 80, 30);   // dipte köpük
  // yan kavisler (dansta sırayla yükselir)
  for (let i = 0; i < 6; i++) {
    const s = i < 3 ? -1 : 1, k = (i % 3) + 1, h = (22 + k * 9) * (0.8 + 0.3 * Math.sin(tm * 2 + i + dans * 3)) * (1 + dans * 0.4 + cos * 0.6);
    c.globalAlpha = 0.5; c.strokeStyle = '#eaf9ff'; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(x0 + s * 3, y0 - 2); c.quadraticCurveTo(x0 + s * k * 12, y0 - h * 1.6, x0 + s * k * 22, y0 - 1); c.stroke();
  }
  // orta sütun ve tepede taç
  c.globalAlpha = 0.75; c.strokeStyle = '#f4fcff'; c.lineWidth = 4;
  c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.sin(tm * 3) * 0.8, y0 - H); c.stroke();
  c.globalAlpha = 0.45; c.lineWidth = 1.4; c.strokeStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    const a = (i / 7 - 0.5) * 2.2, dx = Math.sin(a) * 24;
    c.beginPath(); c.moveTo(x0, y0 - H); c.quadraticCurveTo(x0 + dx * 0.8, y0 - H - 10 * Math.cos(a), x0 + dx * 1.6, y0 - H * 0.45); c.stroke();
  }
  c.globalAlpha = 0.5; c.drawImage(glow('#ffffff'), x0 - 14, y0 - H - 14, 28, 28);
  // pırıl pırıl damlalar (analitik, parçacık üretmeden)
  c.fillStyle = '#ffffff';
  for (let i = 0; i < 10; i++) {
    const p = (tm * 0.9 + i / 10) % 1, a = (gl12Hash(i * 4.4) - 0.5) * 2;
    c.globalAlpha = 0.7 * (1 - p);
    c.beginPath(); c.arc(x0 + a * 30 * p, y0 - H * (1 - p * p) - 4, 1.4, 0, Math.PI * 2); c.fill();
  }
  c.globalAlpha = 1;
}
function gl12KazCiz(c, z, tm) {
  const ot = z.otT > 0 ? Math.sin(Math.min(1, (1.4 - z.otT) / 0.4) * Math.PI * 0.5) : 0, cirp = z.cirp;
  c.save(); c.translate(z.x, z.y + Math.sin(tm * 1.7 + z.ev) * 0.7);
  c.beginPath(); c.rect(-50, -90, 100, 90.5); c.clip();
  c.scale(z.yon * 1.15, 1.15);
  c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#8a6b52';
  c.beginPath(); c.ellipse(0, -9, 20, 9, -0.05, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d9cbb3'; c.beginPath(); c.ellipse(9, -6, 9, 5, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(-17, -8, 4, 3, 0, 0, Math.PI * 2); c.fill();
  c.save(); c.translate(-3, -12); c.rotate(-0.15 - cirp * (0.5 + 0.5 * Math.sin(tm * 26)));
  c.fillStyle = '#6e533f'; c.beginPath(); c.ellipse(-4, 0, 13, 5, 0, 0, Math.PI * 2); c.fill(); c.restore();
  const hx = 18 + ot * 2, hy = -34 - ot * 10;
  c.strokeStyle = '#2b2622'; c.lineWidth = 4.4;
  c.beginPath(); c.moveTo(13, -12); c.quadraticCurveTo(19, -22, hx, hy); c.stroke();
  c.fillStyle = '#2b2622'; c.beginPath(); c.ellipse(hx + 1, hy, 4.6, 3.6, 0.2, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(hx, hy + 1.6, 2.6, 1.6, 0.4, 0, Math.PI * 2); c.fill();   // beyaz yanak bandı
  const ac = z.otT > 0 ? Math.abs(Math.sin(z.otT * 16)) * 1.4 : 0;
  c.fillStyle = '#3a3330'; c.beginPath(); c.moveTo(hx + 4, hy - 1.4 - ac * 0.4); c.lineTo(hx + 10, hy - 0.2); c.lineTo(hx + 4, hy + 1 + ac); c.closePath(); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(hx + 1.6, hy - 1.4, 0.7, 0, Math.PI * 2); c.fill();
  c.restore();
  c.strokeStyle = 'rgba(235,250,255,.55)'; c.lineWidth = 1;
  c.beginPath(); c.ellipse(z.x, z.y + 0.5, 22, 2.4, 0, 0, Math.PI * 2); c.stroke();
}
function gl12SuKapCiz(c, q, tm) {   // suda yüzen kaplumbağa: kabuğun tepesi ve başı su üstünde
  if (q.faz === 'gizli') return;
  const g0 = q.gor, s = q.on ? 1.25 : 0.95;
  c.save(); c.translate(q.x, q.y + (1 - g0) * 10);
  c.beginPath(); c.rect(-40, -40, 80, 40 - (1 - g0) * 10 + 0.5); c.clip();
  c.scale(q.yon * s, s);
  const kur = Math.sin(tm * 4 + q.ev) * 1.5;
  c.fillStyle = '#8cc77a'; c.beginPath(); c.ellipse(-10 + kur, 1, 4, 2, 0.4, 0, Math.PI * 2); c.ellipse(9 - kur, 1, 4, 2, -0.4, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#5e9a5a'; c.strokeStyle = '#3f7a45'; c.lineWidth = 1;
  c.beginPath(); c.ellipse(0, 2, 13, 7, 0, Math.PI, 0); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = 'rgba(200,235,170,.6)'; c.lineWidth = 0.8;
  c.beginPath(); c.moveTo(-6, 1); c.lineTo(-3, -4); c.lineTo(3, -4); c.lineTo(6, 1); c.stroke();
  const by = -1 - q.bak * 5, bx = 15 + q.bak * 1;   // baş: bakarken sudan yukarı uzanır
  c.strokeStyle = '#8cc77a'; c.lineWidth = 4; c.beginPath(); c.moveTo(10, 1); c.quadraticCurveTo(13, -1, bx, by); c.stroke();
  c.fillStyle = '#9bd08a'; c.beginPath(); c.ellipse(bx + 1, by, 4.2, 3.4, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#2d2a28'; c.beginPath(); c.arc(bx + 2.4, by - 1, 0.9, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(bx + 2.7, by - 1.3, 0.35, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#4f7f48'; c.lineWidth = 0.7; c.beginPath(); c.arc(bx + 2, by + 0.8, 1.6, 0.3, 1.7); c.stroke();
  c.restore();
  if (g0 > 0.3) { c.strokeStyle = 'rgba(235,250,255,.55)'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(q.x, q.y + 1, 15 * s, 2 * s, 0, 0, Math.PI * 2); c.stroke(); }
}
function gl12YavruKuguCiz(c, y, tm) {
  c.save(); c.translate(y.x, y.y + Math.sin(tm * 2.4 + y.sira) * 0.6);
  c.beginPath(); c.rect(-20, -30, 40, 30.5); c.clip();
  c.scale(y.yon, 1);
  c.fillStyle = '#cfcbc6'; c.strokeStyle = '#aaa59f'; c.lineWidth = 0.8;
  c.beginPath(); c.ellipse(0, -3, 9, 6, 0, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#e2dfda'; c.beginPath(); c.ellipse(-2, -6, 4, 2, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#d6d2cd'; c.beginPath(); c.arc(7, -11, 4, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#4a4440'; c.beginPath(); c.moveTo(10.5, -11.6); c.lineTo(14.5, -10.6); c.lineTo(10.5, -9.6); c.closePath(); c.fill();
  c.fillStyle = '#2a2523'; c.beginPath(); c.arc(8.4, -12, 0.85, 0, Math.PI * 2); c.fill();
  c.restore();
}
function gl12BalikcilCiz(c, h, tm) {   // gri balıkçıl: uzun bacaklar suda, S boyun, sarı hançer gaga
  if (!gl12Ekranda(h.x, 100)) return;
  const ger = h.gerin > 0 ? Math.sin(Math.min(1, (1.8 - h.gerin) / 0.5) * Math.PI * 0.5) * Math.min(1, h.gerin / 0.4) : 0;
  const av = h.av > 0 ? Math.sin((1 - h.av / 0.9) * Math.PI) : 0;
  c.save(); c.translate(h.x, h.y); c.scale(-1.2, 1.2);   // karşıya (gölün ortasına) bakar
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#8f8a7c'; c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(-2, -30); c.lineTo(-3, 0); c.moveTo(3, -30); c.lineTo(5, -14); c.lineTo(1, -10); c.stroke();   // biri katlı
  // kanatlar (gerinirken açılır)
  if (ger > 0.05) {
    c.fillStyle = '#9fa7ae';
    c.beginPath(); c.moveTo(-4, -40); c.quadraticCurveTo(-34, -60 - ger * 10, -40, -36); c.quadraticCurveTo(-20, -38, -4, -34); c.fill();
    c.fillStyle = '#5c646c'; c.beginPath(); c.moveTo(-34, -48 - ger * 6); c.lineTo(-42, -36); c.lineTo(-30, -38); c.fill();
  }
  c.fillStyle = '#b7bec4'; c.strokeStyle = '#8a939b'; c.lineWidth = 0.8;
  c.beginPath(); c.ellipse(0, -38, 13, 8, -0.35, 0, Math.PI * 2); c.fill(); c.stroke();
  c.fillStyle = '#7e868e'; c.beginPath(); c.ellipse(-4, -39, 9, 5, -0.35, 0, Math.PI * 2); c.fill();
  // boyun ve baş (avlanırken suya uzanır)
  const hx = 12 + ger * 2 + av * 18, hy = -66 - ger * 10 + av * 56;
  c.strokeStyle = '#e8ecef'; c.lineWidth = 4.6;
  c.beginPath(); c.moveTo(9, -42); c.bezierCurveTo(4 + av * 8, -50 + av * 10, 16 + av * 10, -56 + av * 30, hx, hy); c.stroke();
  c.fillStyle = '#eef1f3'; c.beginPath(); c.ellipse(hx, hy, 4.4, 3.6, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#2f3438'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(hx - 1, hy - 2.4); c.lineTo(hx - 9, hy - 4 - ger * 3); c.stroke();   // tepe tüyü
  c.fillStyle = '#f2c94c'; c.beginPath(); c.moveTo(hx + 3, hy - 1.4); c.lineTo(hx + 15, hy + 0.6 + av * 3); c.lineTo(hx + 3, hy + 1.6); c.closePath(); c.fill();
  c.fillStyle = '#2a2a2a'; c.beginPath(); c.arc(hx + 1, hy - 0.8, 0.9, 0, Math.PI * 2); c.fill();
  if (av > 0.6) { c.fillStyle = '#ffb25a'; c.beginPath(); c.ellipse(hx + 14, hy + 2, 3.4, 1.4, 0.3, 0, Math.PI * 2); c.fill(); }   // minik balık
  c.restore();
  c.strokeStyle = 'rgba(235,250,255,.5)'; c.lineWidth = 0.8;
  c.beginPath(); c.ellipse(h.x + 1, h.y + 0.5, 8, 1.4, 0, 0, Math.PI * 2); c.stroke();
}
function gl12UcanKazCiz(c, tm) {
  const u = GLB.ucan;
  if (!u.on) return;
  c.strokeStyle = '#4b4a52'; c.lineWidth = 1.8; c.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const sira = Math.ceil(i / 2), yan = i === 0 ? 0 : (i % 2 ? -1 : 1);
    const x = u.x - u.yon * sira * 30, y = u.y + yan * sira * 16, k = Math.sin(tm * 7 + i * 0.8) * 5;
    c.fillStyle = '#5a5560';
    c.beginPath(); c.ellipse(x, y, 6, 2.2, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.moveTo(x - 9, y - k); c.quadraticCurveTo(x - 4, y - 2 - k * 0.6, x, y); c.quadraticCurveTo(x + 4, y - 2 - k * 0.6, x + 9, y - k); c.stroke();
    c.beginPath(); c.moveTo(x + u.yon * 6, y); c.lineTo(x + u.yon * 11, y - 1.5); c.stroke();   // boyun
  }
}
function gl12KopruCiz(c, tm, on) {   // on: false → tüm köprü (kayığın arkası); true → yalnız iki dış ayak (kayığın önü)
  const B = GL12_KOPRU, kx = B.x, W = B.yari, sp = GL.spr;
  if (!gl12Ekranda(kx, W + 40)) return;
  if (!sp.kopru) sp.kopru = gl12KopruTuval(GL.K);
  const img = sp.kopru, k = img.width / (W * 2 + 20);
  if (!on) {
    c.drawImage(img, kx - W - 10, 500, W * 2 + 20, 300);
    const I = typeof dn12Isik === 'function' ? dn12Isik() : null, guc = I && Number.isFinite(I.guc) ? I.guc : 0;
    if (guc > 0.45) {   // gün batımında köprü fenerleri yanar
      c.globalAlpha = clamp((guc - 0.45) / 0.3, 0, 1) * 0.85;
      for (const s of [-1, 1]) c.drawImage(glow('#ffd88a'), kx + s * (W - 6) - 22, B.ust - 89, 44, 44);
      c.globalAlpha = 1;
    }
    return;
  }
  // dış ayaklar (kemer halkasının dışı; döşemeden suya) kayık oradan geçerken onu örter
  const ayakX = B.acik + B.halka;
  for (const s of [-1, 1]) {
    const x0 = s < 0 ? -W - 10 : ayakX, w = W + 10 - ayakX;
    c.drawImage(img, (x0 + W + 10) * k, (B.ust - 30 - 500) * k, w * k, (800 - B.ust + 30) * k, kx + x0, B.ust - 30, w, 800 - B.ust + 30);
  }
  c.strokeStyle = 'rgba(235,250,255,.6)'; c.lineWidth = 1;   // ayakların dibinde dalgacık
  for (const s of [-1, 1]) { const w = 26 + Math.sin(tm * 2 + s) * 2; c.beginPath(); c.ellipse(kx + s * (ayakX + 22), 780, w, 3, 0, 0, Math.PI * 2); c.stroke(); }
}

// arka şerit (kayığın arkası): ada, fıskiye, kazlar, uzak kaplumbağalar, balıkçıl
function gl12BuyukArka(c, tm) {
  gl12AdaCiz(c, tm);
  for (const z of GLB.kazlar) if (gl12Ekranda(z.x, 60)) gl12KazCiz(c, z, tm);
  for (const q of GLB.kaplumbagalar) if (!q.on && gl12Ekranda(q.x, 50)) gl12SuKapCiz(c, q, tm);
  if (GLB.balikcil) gl12BalikcilCiz(c, GLB.balikcil, tm);
  gl12KopruCiz(c, tm, false);
  gl12SuruCiz(c, tm, false);
  gl12KiyiOrdekCiz(c, tm);
}
// ön şerit (kayığın önü): kuğu yavruları, yakın kaplumbağalar, balık sürüsü, köprü, gökte kazlar
function gl12BuyukOn(c, tm) {
  for (const y of GLB.yavruKugu) if (gl12Ekranda(y.x, 40)) gl12YavruKuguCiz(c, y, tm);
  for (const q of GLB.kaplumbagalar) if (q.on && gl12Ekranda(q.x, 50)) gl12SuKapCiz(c, q, tm);
  for (const b of GLB.suru) if (b.u >= 0 && gl12Ekranda(b.x, 60)) gl12BalikCiz(c, b);
  gl12SuruCiz(c, tm, true);
  gl12KopruCiz(c, tm, true);
  gl12UcanKazCiz(c, tm);
}
function gl12BuyukYansima(c) {
  const sp = GL.spr;
  if (sp.ada && gl12Ekranda(GL12_ADA.x, 260)) {   // adanın ve söğüdün yansıması (basık, soluk)
    c.globalAlpha = 0.2;
    c.save(); c.translate(GL12_ADA.x, GL12_ADA.y + 2); c.scale(1, -0.32); c.drawImage(sp.ada, -220, -236, 440, 250); c.restore();
  }
  if (sp.kopru && gl12Ekranda(GL12_KOPRU.x, GL12_KOPRU.yari + 40)) {   // kemerin suda yansıması (açıklıkla birlikte bir halka gibi)
    const B = GL12_KOPRU;
    c.globalAlpha = 0.22;
    c.save(); c.translate(B.x, B.su + 1); c.scale(1, -0.62); c.drawImage(sp.kopru, -B.yari - 10, 500 - B.su, B.yari * 2 + 20, 300); c.restore();
  }
  c.globalAlpha = 1;
}
function gl12BuyukDokun(wx, wy) {
  if (gl12T3Dokun(wx, wy)) return true;
  for (const z of GLB.kazlar) if (Math.abs(wx - z.x) < 34 && wy > z.y - 50 && wy < z.y + 8) { gl12KazOt(z); return true; }
  for (const q of GLB.kaplumbagalar) if (q.faz === 'yuz' && Math.abs(wx - q.x) < 28 && Math.abs(wy - (q.y - 4)) < 18) { gl12KapDal(q); return true; }
  const h = GLB.balikcil;
  if (h && Math.abs(wx - h.x) < 34 && wy > h.y - 90 && wy < h.y + 6) { h.gerin = 1.8; gl12Olay('k12Balikcil', { x: h.x }); return true; }
  const f = GLB.fiskiye;
  if (Math.abs(wx - GL12_FISKIYE.x) < 40 && wy > GL12_FISKIYE.y - 120 && wy < GL12_FISKIYE.y + 10) {
    f.dokT = 1.2; gl12Olay('k12GolFiskiye', { x: GL12_FISKIYE.x, dokun: true });
    if (typeof burst === 'function') burst(GL12_FISKIYE.x, GL12_FISKIYE.y - 80, 10, ['#ffffff', '#dff4ff', '#fff6c8'], 90, 0.9, 5);
    return true;
  }
  for (const y of GLB.yavruKugu) if (Math.abs(wx - y.x) < 16 && wy > y.y - 20 && wy < y.y + 6) { if (GL.kugu) gl12KuguSelam(GL.kugu); return true; }
  return false;
}

// ════════════════════════ Tur 3: büyük sazanlar ve ördek sürüleri ════════════════════════
// Sazanlar suyun hemen altında süzülür (su katmanında, yarı saydam; derinleştikçe soluklaşır). Kayık yaklaşınca bir kısmı
// yanına toplanıp ağzını yüzeye çıkarır ("öp öp", halka), bir kısmı kayığa eşlik eder; dokununca kuyruk çırpıp kaçar, sonra döner.
// Ördek sürüleri (yeşilbaş erkek, kahverengi dişi, yavru): gölette 4 grup + kıyıda yürüyenler. Yüzerken kuyruk sallar, dalar,
// kanat çırpar; kayık yaklaşınca dağılır, sonra bir süre peşine takılır. Çizimler önbellek tuvallerinden (karede yol/gradyan yok).
const GL12_SAZAN = [   // [sütun, şerit y, boy ölçeği, renk]
  [846, 756, 1.0, 0], [858, 772, 1.15, 2], [874, 730, 0.85, 1], [892, 764, 1.1, 0], [910, 748, 0.9, 2],
  [928, 776, 1.2, 1], [944, 758, 1.0, 0], [966, 770, 0.95, 2], [984, 752, 1.05, 1]];
const GL12_SAZAN_RENK = [
  { g: '#f4a640', k: '#d27a22', b: '#ffe3a8', y: '#ef8c2e' },   // altın-turuncu
  { g: '#b98348', k: '#8a5a2c', b: '#e8c99a', y: '#a8713a' },   // bronz
  { g: '#f8f0e6', k: '#d9c9b6', b: '#ffffff', y: '#f2e4d4', l: '#ff7a3a' }];   // beyaz-turuncu benekli koi
const GL12_SURU_GRUP = [   // ördek sürüleri: [sütun, şerit y, erkek, dişi, yavru]
  [864, 726, 2, 2, 3], [903, 756, 2, 3, 0], [952, 728, 3, 2, 2], [981, 760, 1, 2, 3]];
const GL12_KIYI_ORDEK = [[809, 1, 1], [822, 0, 1], [1010, 1, 1], [1018, 0, 0], [1024, 1, 0]];   // [sütun, erkek?, yön]
const GLT3 = { sazan: [], gruplar: [], kiyi: [], spr: null, sprK: 0, opT: 0 };
const GL12_SURU_S = 1.2;   // sürü ördeklerinin boyu

function gl12T3Kur() {
  GLT3.sazan.length = 0;
  for (let i = 0; i < GL12_SAZAN.length; i++) {
    const s = GL12_SAZAN[i];
    GLT3.sazan.push({ i, ev: s[0] * T, x: s[0] * T, y: s[1], y0: s[1], s: s[2], renk: s[3], yon: i % 2 ? -1 : 1, vx: 0,
      z: 0.6, kuyruk: gl12Hash(i) * 6, op: 0, opT: 0, kacT: 0, esT: 0, hedefX: s[0] * T, gezT: gl12Hash(i * 3) * 4, es: i % 3 === 0 });
  }
  GLT3.gruplar.length = 0;
  for (let gi = 0; gi < GL12_SURU_GRUP.length; gi++) {
    const G = GL12_SURU_GRUP[gi], uyeler = [];
    const turler = [];
    for (let k = 0; k < G[2]; k++) turler.push('erkek');
    for (let k = 0; k < G[3]; k++) turler.push('disi');
    for (let k = 0; k < G[4]; k++) turler.push('yavru');
    for (let k = 0; k < turler.length; k++) {
      const h = gl12Hash(gi * 17 + k * 3.3);
      uyeler.push({ tur: turler[k], dx: (k - turler.length / 2) * 26 + (h - 0.5) * 12, dy: (gl12Hash(k * 7 + gi) - 0.5) * 10,
        x: G[0] * T + (k - turler.length / 2) * 26, y: G[1], yon: h < 0.5 ? -1 : 1, vx: 0, ph: h * 6,
        dal: 0, dalT: 2 + h * 8, cirp: 0, sal: 0 });
    }
    GLT3.gruplar.push({ ev: G[0] * T, x: G[0] * T, y: G[1], on: G[1] > 742, faz: 'gez', t: 0, takipT: 0, gecti: false, uyeler });
  }
  GLT3.kiyi.length = 0;
  for (let i = 0; i < GL12_KIYI_ORDEK.length; i++) {
    const q = GL12_KIYI_ORDEK[i];
    GLT3.kiyi.push({ tur: q[1] ? 'erkek' : 'disi', ev: q[0] * T, x: q[0] * T, y: GL12_ISK.y, yon: q[2] ? 1 : -1, vx: 0, adimF: 0, gezT: gl12Hash(i * 9) * 3, gezX: 0, gaga: 0, gagaT: 1 + i, vakT: 0 });
  }
}

// ── önbellek: sazan gövdeleri (kuyruksuz, sağa bakar) ve ördek pozları ──
function gl12T3Sprite() {
  const K = GL.K || 3;
  if (GLT3.spr && GLT3.sprK === K) return GLT3.spr;
  GLT3.sprK = K;
  const sp = { sazan: [], ordek: {} };
  for (let r = 0; r < GL12_SAZAN_RENK.length; r++) sp.sazan.push(gl12SazanTuval(K, GL12_SAZAN_RENK[r]));
  for (const tur of ['erkek', 'disi', 'yavru']) {
    sp.ordek[tur + 'Su'] = gl12SuruOrdekTuval(K, tur, 'su');
    sp.ordek[tur + 'Dal'] = gl12SuruOrdekTuval(K, tur, 'dal');
    sp.ordek[tur + 'Kara'] = gl12SuruOrdekTuval(K, tur, 'kara');
  }
  GLT3.spr = sp;
  return sp;
}
function gl12SazanTuval(K, R) {   // 100 birim boyunda, sevimli iri sazan (yan görünüş); yerel (0,0) gövde ortası
  const c = gl12Tuval(110 * K, 50 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(58, 25);
  x.lineJoin = 'round';
  // sırt ve karın yüzgeçleri
  x.fillStyle = R.k;
  x.beginPath(); x.moveTo(-22, -12); x.quadraticCurveTo(-4, -26, 18, -13); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-10, 12); x.quadraticCurveTo(-4, 20, 4, 12); x.closePath(); x.fill();
  // gövde
  x.fillStyle = R.g;
  x.beginPath(); x.moveTo(44, 0);
  x.bezierCurveTo(40, -14, 18, -17, -6, -15); x.bezierCurveTo(-28, -13, -42, -7, -48, 0);
  x.bezierCurveTo(-42, 7, -28, 12, -6, 14); x.bezierCurveTo(18, 16, 40, 13, 44, 0); x.fill();
  x.fillStyle = R.b; x.globalAlpha = 0.8;
  x.beginPath(); x.ellipse(6, 7, 30, 5.5, 0.02, 0, Math.PI * 2); x.fill(); x.globalAlpha = 1;
  if (R.l) {   // koi benekleri
    x.fillStyle = R.l;
    x.beginPath(); x.ellipse(14, -7, 11, 6, 0.2, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(-16, -6, 9, 5.5, -0.1, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(34, -4, 5, 4, 0, 0, Math.PI * 2); x.fill();
  }
  // pullar (ince yaylar)
  x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = 0.8;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) { x.beginPath(); x.arc(-26 + i * 9, -6 + j * 7, 3.6, -1.2, 1.2); x.stroke(); }
  // göğüs yüzgeci, göz, bıyıklar, ağız
  x.fillStyle = R.y; x.beginPath(); x.ellipse(22, 7, 7, 3, 0.6, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#2e2622'; x.beginPath(); x.arc(32, -4, 2.6, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#ffffff'; x.beginPath(); x.arc(33, -5, 0.9, 0, Math.PI * 2); x.fill();
  x.strokeStyle = R.k; x.lineWidth = 1.1; x.lineCap = 'round';
  x.beginPath(); x.moveTo(42, 2); x.quadraticCurveTo(46, 6, 44, 10); x.stroke();
  x.fillStyle = 'rgba(255,150,140,.45)'; x.beginPath(); x.arc(30, 3, 2.6, 0, Math.PI * 2); x.fill();   // yanak
  return c;
}
function gl12SuruOrdekCizim(x, tur) {   // ördeğin gövdesi (sağa bakar), (0,0) su çizgisi / ayak hizası
  const er = tur === 'erkek', yv = tur === 'yavru', s = yv ? 0.62 : 1;
  x.save(); x.scale(s, s);
  x.lineJoin = 'round'; x.lineCap = 'round';
  const govde = er ? '#cfc9bf' : yv ? '#c9a45c' : '#a9825c', koyu = er ? '#9d978e' : yv ? '#9a7a3e' : '#7d5c3e';
  x.fillStyle = er ? '#2a2a2e' : koyu;   // kuyruk
  x.beginPath(); x.moveTo(-15, -8); x.quadraticCurveTo(-23, -12, -21, -16); x.quadraticCurveTo(-15, -13, -10, -12); x.closePath(); x.fill();
  if (er) { x.strokeStyle = '#2a2a2e'; x.lineWidth = 1.2; x.beginPath(); x.arc(-15, -15, 2, 0, Math.PI * 1.5); x.stroke(); }   // kıvrık tüy
  x.fillStyle = govde; x.beginPath(); x.ellipse(0, -8, 16, 8, -0.04, 0, Math.PI * 2); x.fill();
  if (er) { x.fillStyle = '#8b5536'; x.beginPath(); x.ellipse(10, -8, 7, 7, 0, 0, Math.PI * 2); x.fill(); }   // kestane göğüs
  if (!er) {   // benekler
    x.fillStyle = koyu;
    for (let i = 0; i < 7; i++) { x.beginPath(); x.ellipse(-10 + i * 3.4, -9 + (i % 2) * 3, 1.4, 0.9, 0.5, 0, Math.PI * 2); x.fill(); }
  }
  x.fillStyle = koyu; x.beginPath(); x.ellipse(-3, -10, 9, 4.2, -0.15, 0, Math.PI * 2); x.fill();   // kanat
  x.fillStyle = '#3f6fc7'; x.fillRect(-7, -10, 6, 2);                                               // mavi kanat aynası
  // boyun ve baş
  const bas = er ? '#2f7f56' : yv ? '#d8b56a' : '#b48a62';
  x.fillStyle = bas; x.beginPath(); x.ellipse(13, -17, 5, 7, 0.2, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.arc(15, -22, 5.2, 0, Math.PI * 2); x.fill();
  if (er) { x.fillStyle = 'rgba(120,220,170,.45)'; x.beginPath(); x.arc(14, -24, 2.6, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#ffffff'; x.lineWidth = 1.4; x.beginPath(); x.arc(13, -14, 4.6, 0.3, 2.6); x.stroke(); }   // beyaz boyun halkası
  if (!er && !yv) { x.strokeStyle = '#6e4e34'; x.lineWidth = 0.9; x.beginPath(); x.moveTo(12, -23); x.lineTo(20, -22); x.stroke(); }   // göz çizgisi
  x.fillStyle = er ? '#f2cf4a' : '#e08a3a'; x.beginPath(); x.ellipse(21.5, -21, 4, 1.7, 0.05, 0, Math.PI * 2); x.fill();   // gaga
  x.fillStyle = '#2a201c'; x.beginPath(); x.arc(17, -23, 1.2, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#ffffff'; x.beginPath(); x.arc(17.4, -23.5, 0.45, 0, Math.PI * 2); x.fill();
  x.restore();
}
function gl12SuruOrdekTuval(K, tur, hal) {   // hal: 'su' (su üstü kısmı), 'dal' (baş aşağı, kuyruk havada), 'kara' (tam gövde)
  const c = gl12Tuval(56 * K, 40 * K), x = c.getContext('2d');
  x.scale(K, K); x.translate(26, 34);
  if (hal !== 'kara') { x.beginPath(); x.rect(-30, -40, 60, 40.5); x.clip(); }
  if (hal === 'dal') { x.translate(0, 6); x.rotate(1.25); x.translate(0, 4); }
  else if (hal === 'su') x.translate(0, 4);
  gl12SuruOrdekCizim(x, tur);
  return c;
}

// ── davranış ──
function gl12T3Adim(dt, binisli, K) {
  const t = GL.t, kx = binisli ? K.x + K.yon * GL12_K.fezaX : P.x;
  // Sazanlar: evinin çevresinde süzülür; kayık (ya da iskele ucundaki Feza) yakındaysa yanına gelir, öp öp yapar
  const fezaSuda = binisli || (P.x > GL12_SU.x0 - 40 && P.x < GL12_SU.x1 + 40 && Math.abs(P.y - GL12_ISK.y) < 4);
  for (const s of GLT3.sazan) {
    const uzak = !gl12Ekranda(s.x, 700) && !(binisli && Math.abs(s.x - kx) < 900);
    if (uzak) continue;   // görünmeyeni güncelleme
    s.kacT = Math.max(0, s.kacT - dt); s.opT = Math.max(0, s.opT - dt);
    const yakin = fezaSuda && Math.abs(s.x - kx) < (s.es ? 700 : 380) && s.kacT <= 0;
    let hx, hy, hz, vmax;
    if (yakin) {   // Feza'nın yanına toplanır (kayığın önünde, her biri biraz başka yerde)
      hx = kx + (s.i % 2 ? 1 : -1) * (46 + (s.i % 4) * 44) + (binisli ? K.yon * K.v * 0.25 : 0);
      hx = clamp(hx, GL12_SU.x0 + 60, GL12_SU.x1 - 60);
      hy = 772 + (s.i % 3) * 6; hz = 0.12; vmax = binisli ? 330 : 90;   // kayığın önünde (gövdenin altında kalmasın)
    } else {
      s.gezT -= dt;
      if (s.gezT < 0) { s.gezT = 3 + gl12Hash(t + s.i) * 4; s.hedefX = s.ev + (gl12Hash(t * 1.7 + s.i * 5) - 0.5) * 360; }
      hx = s.hedefX; hy = s.y0; hz = 0.55 + 0.25 * Math.sin(t * 0.3 + s.i); vmax = 38;
    }
    if (s.kacT > 0) { hx = s.x + s.yon * 200; vmax = 160; hz = 0.75; }
    const hedefV = clamp((hx - s.x) * 0.9, -vmax, vmax);
    s.vx += (hedefV - s.vx) * (1 - Math.exp(-dt * (s.kacT > 0 ? 6 : 1.6)));
    s.x += s.vx * dt; s.y += (hy - s.y) * (1 - Math.exp(-dt * 0.8)); s.z += (hz - s.z) * (1 - Math.exp(-dt * 1.2));
    if (Math.abs(s.vx) > 6 && s.kacT <= 0) s.yon = s.vx > 0 ? 1 : -1;
    s.kuyruk += dt * (2.2 + Math.abs(s.vx) * 0.04 + (s.kacT > 0 ? 10 : 0));
    // öp öp: yüzeye yakın ve Feza'nın yanındaysa ağzını açıp kapatır, halka bırakır
    if (yakin && s.z < 0.22 && Math.abs(s.x - kx) < 170 && s.opT <= 0 && gl12Hash(t * 3 + s.i) < dt * 1.4) {
      s.opT = 1.2;
      const mx = s.x + s.yon * 44 * s.s;
      gl12Halka(mx, s.y, 7, 1, 0.8);
      if (now - GLT3.opT > 0.5) { GLT3.opT = now; gl12Olay('k12SazanOp', { x: mx }); }
    }
    // sırt yüzgeci yüzeyi çizer: arada küçük halka
    if (s.z < 0.3 && Math.abs(s.vx) > 20 && gl12Hash(t * 5 + s.i * 2) < dt * 2) gl12Halka(s.x - s.yon * 6, s.y, 5, 0.8, 0.4);
  }
  // Ördek sürüleri
  for (const G of GLT3.gruplar) {
    const gor = gl12Ekranda(G.x, 600) || (binisli && Math.abs(G.x - kx) < 900);
    if (!gor) continue;
    G.t += dt;
    const ileri = binisli ? (G.x - kx) * K.yon : 9999;
    if (G.faz === 'gez') {
      G.x += ((G.ev + Math.sin(t * 0.13 + G.ev) * 120) - G.x) * (1 - Math.exp(-dt * 0.4));
      if (binisli && !G.gecti && ileri < 260 && ileri > -40) { G.faz = 'dagil'; G.t = 0; G.gecti = true; gl12Olay('k12OrdekSuru', { x: G.x, faz: 'dagil' }); }
    } else if (G.faz === 'dagil') {
      if (G.t > 1.6 && binisli && ileri < -60) { G.faz = 'takip'; G.t = 0; gl12Olay('k12OrdekSuru', { x: G.x, faz: 'takip' }); }
      if (G.t > 5) { G.faz = 'gez'; G.t = 0; }
    } else if (G.faz === 'takip') {   // kayığın ardından bir süre gelir, sonra evine döner
      if (binisli) G.x += ((K.x - K.yon * (180 + G.ev % 60)) - G.x) * (1 - Math.exp(-dt * 0.9));
      if (G.t > 11 || !binisli) { G.faz = 'gez'; G.t = 0; }
    }
    if (!binisli) G.gecti = false;
    for (let k = 0; k < G.uyeler.length; k++) {
      const u = G.uyeler[k];
      let hx = G.x + u.dx, hy = G.y + u.dy;
      if (G.faz === 'dagil') {   // kayıktan kaçar: yanlara açılır, kanat çırpar
        const kac = Math.sign(u.x - kx) || (k % 2 ? 1 : -1);
        hx = u.x + kac * 160; hy = G.y + u.dy * 2.2;
        if (G.t < 0.05) { u.cirp = 0.9 + gl12Hash(k) * 0.4; if (k % 3 === 0) gl12Olay('k12OrdekVak', { x: u.x, yavru: u.tur === 'yavru' }); }
      }
      const vmax = G.faz === 'takip' ? 340 : G.faz === 'dagil' ? 190 : 30;
      const hedefV = clamp((hx - u.x) * 1.6, -vmax, vmax);
      u.vx += (hedefV - u.vx) * (1 - Math.exp(-dt * 3));
      u.x += u.vx * dt; u.y += (hy - u.y) * (1 - Math.exp(-dt * 1.2));
      if (Math.abs(u.vx) > 8) u.yon = u.vx > 0 ? 1 : -1;
      u.cirp = Math.max(0, u.cirp - dt);
      u.sal = Math.max(0, u.sal - dt);
      u.dal = Math.max(0, u.dal - dt);
      u.dalT -= dt;
      if (u.dalT < 0 && G.faz === 'gez') {   // arada dalar ya da kuyruk sallar / kanat çırpar
        const r = gl12Hash(t * 1.9 + k + G.ev);
        if (r < 0.45) { u.dal = 1.4; gl12Halka(u.x, u.y + 1, 7, 0.9, 0.5); }
        else if (r < 0.8) u.sal = 0.6; else u.cirp = 0.8;
        u.dalT = 3 + gl12Hash(t + k * 3) * 7;
      }
      if (u.dal > 1.3 && u.dal - dt <= 1.3) gl12Olay('k12OrdekDal', { x: u.x });
    }
  }
  // Kıyıda yürüyen ördekler
  for (const d of GLT3.kiyi) {
    if (!gl12Ekranda(d.x, 300)) continue;
    d.gezT -= dt; d.vakT = Math.max(0, d.vakT - dt);
    if (d.gezT < 0) { d.gezT = 2 + gl12Hash(t + d.ev) * 3; d.gezX = (gl12Hash(t * 2.3 + d.ev) - 0.5) * 140; }
    let hx = d.ev + d.gezX;
    if (Math.abs(P.x - d.x) < 70 && !P.ucus) hx = d.x + Math.sign(d.x - P.x || 1) * 60;   // Feza gelince kenara çekilir
    const hedefV = clamp((hx - d.x) * 1.8, -110, 110);
    d.vx += (hedefV - d.vx) * (1 - Math.exp(-dt * 5));
    d.x += d.vx * dt;
    if (Math.abs(d.vx) > 8) d.yon = d.vx > 0 ? 1 : -1;
    d.adimF += Math.abs(d.vx) * dt * 0.07;
    d.gagaT -= dt;
    if (d.gagaT < 0) d.gagaT = 1.8 + gl12Hash(t + d.ev * 0.1) * 2.5;
    d.gaga = Math.abs(d.vx) < 15 && d.gagaT < 0.35 ? Math.sin(d.gagaT / 0.35 * Math.PI) : 0;
  }
}

// ── çizim ──
function gl12SazanCiz(c, tm) {   // su katmanında (kayığın ve her şeyin altında), yarı saydam
  const sp = gl12T3Sprite();
  for (const s of GLT3.sazan) {
    const L = 100 * s.s;
    if (!gl12Ekranda(s.x, L)) continue;
    const a = 0.64 - s.z * 0.42;   // suyun altında: yüzeye yaklaştıkça belirginleşir
    const kuy = Math.sin(s.kuyruk) * 0.35, sal = Math.sin(s.kuyruk * 0.5) * 0.04;
    const op = s.opT > 0 ? Math.sin((1.2 - s.opT) / 1.2 * Math.PI) : 0;
    c.save();
    c.translate(s.x, s.y); c.scale(s.yon * s.s, s.s * (0.92 + 0.08 * (1 - s.z)));
    c.rotate(sal - op * 0.22);
    c.globalAlpha = a;
    const R = GL12_SAZAN_RENK[s.renk];
    c.fillStyle = R.k;   // kuyruk (karede salınır)
    c.save(); c.translate(-44, 0); c.rotate(kuy);
    c.beginPath(); c.moveTo(2, 0); c.quadraticCurveTo(-10, -16, -22, -15); c.quadraticCurveTo(-14, 0, -22, 15); c.quadraticCurveTo(-10, 16, 2, 0); c.fill();
    c.restore();
    c.drawImage(sp.sazan[s.renk], -58, -25, 110, 50);
    if (op > 0.05) {   // ağız açılıp kapanır (öp öp)
      const ac = Math.abs(Math.sin(op * Math.PI * 3)) * 2.6;
      c.fillStyle = '#7a3b2e'; c.beginPath(); c.ellipse(45, 1, 1.6, 0.6 + ac, 0, 0, Math.PI * 2); c.fill();
    }
    c.restore();
    if (s.z < 0.3) {   // sırt yüzgeci yüzeye değiyor: ince ışık çizgisi
      c.globalAlpha = (0.3 - s.z) * 2; c.strokeStyle = '#effaff'; c.lineWidth = 1;
      c.beginPath(); c.moveTo(s.x - 16 * s.s, s.y - 13 * s.s); c.quadraticCurveTo(s.x, s.y - 18 * s.s, s.x + 14 * s.s, s.y - 12 * s.s); c.stroke();
    }
  }
  c.globalAlpha = 1;
}
function gl12SuruUyeCiz(c, u, tm, sp) {
  const tur = u.tur;
  let img = sp.ordek[tur + 'Su'];
  if (u.dal > 0.25 && u.dal < 1.2) img = sp.ordek[tur + 'Dal'];
  const bob = Math.sin(tm * 2.2 + u.ph) * 0.8;
  c.save();
  c.translate(u.x, u.y + bob);
  if (u.sal > 0) c.rotate(Math.sin(u.sal * 30) * 0.06);   // kuyruk sallama
  c.scale(u.yon * GL12_SURU_S, GL12_SURU_S);
  if (u.cirp > 0) {   // kanat çırpma: suyun üstünde dikleşir, iki kanat
    c.translate(0, -3);
    const k = Math.sin(tm * 28 + u.ph) * 0.9;
    c.fillStyle = tur === 'erkek' ? '#9d978e' : '#7d5c3e';
    for (const s of [-1, 1]) { c.save(); c.translate(-2, -12); c.rotate(-1.2 + s * 0.3 + k * 0.5); c.beginPath(); c.ellipse(0, -7, 4, 9, 0, 0, Math.PI * 2); c.fill(); c.restore(); }
  }
  c.drawImage(img, -26, -34, 56, 40);
  c.restore();
  if (u.dal < 0.3 || u.dal > 1.2) { c.strokeStyle = 'rgba(235,250,255,.55)'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(u.x, u.y + 1.2, tur === 'yavru' ? 7 : 13, 1.6, 0, 0, Math.PI * 2); c.stroke(); }
}
function gl12SuruCiz(c, tm, on) {
  const sp = gl12T3Sprite();
  for (const G of GLT3.gruplar) {
    if (G.on !== on) continue;
    for (const u of G.uyeler) if (gl12Ekranda(u.x, 40)) gl12SuruUyeCiz(c, u, tm, sp);
  }
}
function gl12KiyiOrdekCiz(c, tm) {
  const sp = gl12T3Sprite();
  for (const d of GLT3.kiyi) {
    if (!gl12Ekranda(d.x, 40)) continue;
    const a = Math.sin(d.adimF * Math.PI * 2) * clamp(Math.abs(d.vx) / 40, 0, 1);
    c.save(); c.translate(d.x, d.y - (d.vakT > 0 ? Math.sin(d.vakT / 0.6 * Math.PI) * 5 : 0)); c.scale(d.yon * GL12_SURU_S, GL12_SURU_S);
    c.fillStyle = '#ff9a3c';   // ayaklar
    c.beginPath(); c.ellipse(-3 + a * 3, -Math.max(0, a) * 2, 3.4, 1.4, 0, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(4 - a * 3, -Math.max(0, -a) * 2, 3.4, 1.4, 0, 0, Math.PI * 2); c.fill();
    c.rotate(a * 0.1 + d.gaga * 0.35);
    c.drawImage(sp.ordek[d.tur + 'Kara'], -26, -38, 56, 40);
    c.restore();
  }
}
function gl12T3Dokun(wx, wy) {
  for (const d of GLT3.kiyi) if (Math.abs(wx - d.x) < 22 && wy > d.y - 34 && wy < d.y + 6) { d.vakT = 0.6; gl12Olay('k12OrdekVak', { x: d.x, yavru: false }); return true; }
  for (const G of GLT3.gruplar) for (const u of G.uyeler) {
    if (Math.abs(wx - u.x) < 18 && wy > u.y - 28 && wy < u.y + 6) {
      if (gl12Hash(now + u.ph) < 0.5) { u.dal = 1.4; gl12Halka(u.x, u.y + 1, 8, 1, 0.6); gl12Olay('k12OrdekDal', { x: u.x }); }
      else { u.cirp = 1; gl12Olay('k12OrdekVak', { x: u.x, yavru: u.tur === 'yavru' }); }
      return true;
    }
  }
  for (const s of GLT3.sazan) {
    if (Math.abs(wx - s.x) < 50 * s.s && Math.abs(wy - s.y) < 18 * s.s) {
      s.kacT = 1.1; s.yon = -s.yon; s.z = 0.2;   // kuyruk çırpıp döner, biraz sonra yine gelir
      gl12Halka(s.x, s.y, 14, 1.2, 0.9); gl12Sicrat(s.x - s.yon * 40 * s.s, s.y, 5, 0.6);
      gl12Olay('k12SazanDokun', { x: s.x });
      return true;
    }
  }
  return false;
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
  gl12SuRenk(sp);
  c.globalAlpha = 0.5; c.drawImage(sp.su, 0, 0, 2, 4, xa, ust, xb - xa, 4);   // üst kenar yumuşak: uzak göle karışır
  c.globalAlpha = 1; c.drawImage(sp.su, 0, 4, 2, 96, xa, ust + 4, xb - xa, 96);
  if (alt > ust + 100) { c.fillStyle = GL.suAlt || '#3a8fb2'; c.fillRect(xa, ust + 99, xb - xa, alt - ust - 98); }
  // gün batımı yansıması: altın saatte suyun üstüne sıcak ton ve güneşten bir ışık yolu
  const I = typeof dn12Isik === 'function' ? dn12Isik() : null, guc = I && Number.isFinite(I.guc) ? I.guc : 0;
  // güneşin suya düşen ışık sütunu: gündüz soluk beyaz, altın saatte sıcak ve parlak (önbellekli sütun + kayan ışık çizgileri)
  const gx = cam.x + VW * (typeof DN12 !== 'undefined' && DN12 && Number.isFinite(DN12.gunesX) ? DN12.gunesX : 0.7);
  if (gx > xa - 90 && gx < xb + 90) {
    const sut = gl12GunesSutun(), sg = 0.32 + 0.6 * guc, sw = 80 + 70 * guc;
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = sg * (0.85 + 0.15 * Math.sin(t * 1.7));
    c.drawImage(sut, gx - sw / 2, ust - 2, sw, Math.min(104, alt - ust + 2));
    c.globalCompositeOperation = 'source-over';
  }
  if (guc > 0.03 && I.ton) {
    c.globalAlpha = 0.16 * guc; c.fillStyle = I.ton; c.fillRect(xa, ust, xb - xa, 40);
    for (let i = 0; i < 12; i++) {
      const y = ust + 4 + i * 6.5, w = (46 - i * 2.2) * (0.7 + 0.3 * Math.sin(t * 2.1 + i * 1.7));
      c.globalAlpha = guc * (0.45 - i * 0.03);
      c.fillRect(gx - w / 2 + Math.sin(t * 1.3 + i * 2.3) * 5, y, w, 1.6);
    }
  }
  // sütunun içinde yanıp sönen parlak altın pırıltılar (güneşin suda kırılan ışığı)
  c.fillStyle = guc > 0.3 ? '#fff0c4' : '#ffffff';
  for (let i = 0; i < 14; i++) {
    const h = gl12Hash(i * 5.3 + 2), y = ust + 6 + h * 84, yay = 18 + (y - ust) * 0.55;
    const a = Math.max(0, Math.sin(t * (1.6 + h * 1.8) + i * 2.1));
    if (a < 0.35) continue;
    c.globalAlpha = (a - 0.35) * (0.5 + 0.7 * guc);
    const w = 3 + 9 * a * (0.5 + (y - ust) / 100);
    c.fillRect(gx + (gl12Hash(i * 9.1) - 0.5) * 2 * yay + Math.sin(t * 0.8 + i) * 4 - w / 2, y, w, 1.4);
  }
  c.globalAlpha = 1;
  // üst kenar: uzak su ile birleşen ince ışık çizgisi
  c.fillStyle = 'rgba(255,255,255,.09)'; c.fillRect(xa, ust + 4, xb - xa, 1.2);
  gl12YansimaCiz(c, tm);
  gl12SazanCiz(c, tm);
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
  gl12BuyukYansima(c);
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
  let secilen = null, enD = 1;
  for (const d of GL.ordek) {
    const s = d.anne ? 1.55 : 1;
    const dx = (wx - d.x) / gl12DokunYari(20 * s), dy = (wy - (d.y - 12 * s)) / gl12DokunYari(18 * s);
    const mesafe = dx * dx + dy * dy;
    if (mesafe < enD) { enD = mesafe; secilen = d; }
  }
  if (secilen) { gl12OrdekDokun(secilen); vurdu = true; }
  if (!vurdu) for (const n of GL.nilufer) {
    if (Math.abs(wx - n.x) < 30 * n.s && Math.abs(wy - (n.y - 4)) < gl12DokunYari(18)) { gl12NiluferAc(n); n.dokT = 0.5; vurdu = true; break; }
  }
  const k = GL.kugu;
  if (!vurdu && k && Math.abs(wx - k.x) < 44 && wy > k.y - 72 && wy < k.y + 8) { gl12KuguSelam(k); vurdu = true; }
  const q = GL.kap;
  if (!vurdu && q && Math.abs(wx - q.x) < 38 && wy > q.y - 36 && wy < q.y + 10) { q.sakla = 1.6; vurdu = true; if (typeof burst === 'function') burst(q.x, q.y - 14, 4, ['#c8f0b0', '#ffffff'], 40, 0.7, 5); }
  if (!vurdu) vurdu = gl12BuyukDokun(wx, wy);
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
    if (e.pointerType === 'mouse' && e.button !== 0) return;
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
    gl12BuyukArka(c, tm);
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
  gl12BuyukOn(c, tm);
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
    gl12OnKatman(c, tm);
    if (P.ucus === o && typeof pirilCizPoz === 'function' && Number.isFinite(K.px)) {   // Pırıl yanlarında uçar (köprünün de önünde)
      c.save(); c.translate(K.px, K.py); if (K.pyon < 0) c.scale(-1, 1);
      try { pirilCizPoz(c, 0, 0, 1, 'ucus', tm); } catch (e) {}
      c.restore();
      c.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
    }
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
  dokunXY: gl12Dokun,
  get ordekler() { return GL.ordek; },
  durum() {
    const K = GL.kayik && GL.kayik.k;
    return K ? { faz: K.faz, x: Math.round(K.x), v: Math.round(K.v), yon: K.yon, yer: K.yer, anne: K.an.var ? K.an.faz : '-', ordek: GL.katilan,
      acik: GL.nilufer.filter(n => n.acT >= 0).length } : null;
  }
};
