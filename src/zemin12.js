/* zemin12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün): oyun düzleminin zemini, orta planı ve ön planı. Sözleşme: src/BOLUM12.md.
   Kancalar: dunya12.js dn12World'ün SONUNDA zn12World(tm), dn12Foreground'un BAŞINDA zn12On(tm) çağırır (çağırmazsa bu dosyanın
   sonundaki sarmalayıcı kendisi bağlanır; aynı karede iki kez çizilmez).
   Katmanlar (arkadan öne):
     gl12SuCiz (golet12.js: gölet suyu, sütun 686..807) → zemin bandı (DN12_UFUK = 700'den ekranın altına: uzak çimen saçağı,
     bordür, yol, yakın çimen) → yol üstü perspektif çizgileri (derz, tuğla şerit, granit plaka, bisiklet işareti) → gölet kıyıları →
     ağaç/fener gölgeleri → orta plan (ağaç, kiraz, söğüt, fener, bank, tabela, saksı, tarh, çit, bisiklet parkı) → düşen kiraz
     yaprakları ve yapraklar → [oyun nesneleri, anne, Feza] → ön plan (zn12On: ekranın en alt bandında çimen tutamı, çiçek,
     çalı kenarı, kamış, kır çiçeği; paralaks 1.15, Feza'yı kapatmaz).
   Zemin türleri: 'kaldirim' (lojman, FASS: kum rengi taş döşeme + tuğla şeritler), 'meydan' (Bilgi Merkezi: açık granit plaka),
   'cakil' (botanik bahçesi: taş bordürlü çakıl patika), 'iskele' (kaplumbağa göletinin önünde ahşap yürüyüş iskelesi 604–658),
   'bisiklet' (yol1, yol2: asfalt, beyaz kesik çizgi, bisiklet işareti), 'kosu' (büyük gölet kıyısı: kırmızı koşu yolu; su 830–1005
   GOLET'in), 'patika' (tepe: çimenli toprak patika). Bölge sınırlarında 8 sütunluk (çakıl ↔ iskele 1 sütun) yumuşak geçiş.
   Botanik orta planı: çiçek kemerleri, dev yapraklı bitkiler (deve tabanı, muz, fil kulağı), ahşap tarhlar (lavanta, süs otu,
   sukulent, yaz çiçekleri), yazısız simgeli bitki levhaları, manolya; ön planda eğrelti. Göletçik (BOTANIK) 610–654 boş.
   Ortaklar için: ZN12_BANK [{x, y: oturak üstü, w}] (CANLI: kediler), ZN12_AGAC [{x, y0, y1, r}] (CANLI: sincaplar),
   ZN12.parkHalka(c) → halkaların dünya x'leri (YOLCULUK; parklar 64, 296, 700, 800), zn12Ruzgar(x, tm) → rüzgâr gücü (~0..1.8, hep sağa eser).
   Performans: zemin türleri 1024 birimlik döşenebilir önbellek tuvallerine bir kez çizilir (boşta, karede ~3 ms bütçeyle; görünen
   tür gerekirse hemen), sprite'lar önbellekte; karede gradyan yok, nesne/dizi üretilmez, ekran dışı çizilmez.
   Gün tonu dn12Vignette'te tüm sahneye bindirilir (ARKA); burada yalnız fenerlerin akşam ışığı (dn12Gun() .8'den sonra,
   finalde K12FINAL.aksam) ve gölge yönü (DN12.gunesX). */
'use strict';
const ZN12 = { spr: new Map(), zemin: Object.create(null), kuyruk: [], sonTm: -1, sonKare: -1, sonOnKare: -1, dt: 0, ogeler: [], parklar: [],
  bisikletIsaret: [], hazir: false, say: { zemin: 0, oge: 0, on: 0, parca: 0 } };
var ZN12_BANK = [], ZN12_AGAC = [];
const ZN12_PI2 = Math.PI * 2;
const ZN12_TW = 1024;                    // zemin döşemesinin genişliği (dünya birimi; desen bu aralıkta tekrar eder)
const ZN12_TP = 8;                       // döşemenin sağ payı (dilimler hafifçe üst üste binsin, dikiş çizgisi olmasın)
const ZN12_R = 1.75;                     // zemin önbelleğinin çözünürlüğü (piksel / dünya birimi; derz/şerit çizgileri karede vektör, keskin)
const ZN12_Y0 = 676, ZN12_Y1 = 820;      // zemin döşemesinin dikey aralığı (dünya y); aşağısı düz yakın çimen rengi
const ZN12_YOL0 = 708, ZN12_YOL1 = 749;  // yol yüzeyinin uzak ve yakın kenarı (Feza'nın ayağı y=720)
const ZN12_PERS = 0.16;                  // perspektif: yakın kenarda çizgiler ekran ortasından bu oranda dışa açılır
const ZN12_TABAN = 703;                  // orta plan nesnelerinin dibi (yolun arkasındaki çimen)
const ZN12_ONP = 1.15;                   // ön plan paralaksı
const ZN12_SU0 = 830 * 40, ZN12_SU1 = 1005 * 40;   // büyük gölet: bu aralıkta zemin yok (su GOLET'in), uçlarda kıyı
const ZN12_YAKIN = '#609f3d';            // döşemenin altında kalan yakın çimen rengi
// botanik: iskelenin önünde göletçiğin kolu (BOTANIK'in suyu; BT12_ONSU varsa onu kullan). Bu aralıkta zemin yalnız kirişe kadar
const ZN12_ONSU = { x0: 616 * 40, x1: 648 * 40, y: 757.5 };
function zn12OnSu() { const B = typeof BT12_ONSU !== 'undefined' && BT12_ONSU ? BT12_ONSU : null; if (B && B.x1 > B.x0) { ZN12_ONSU.x0 = B.x0; ZN12_ONSU.x1 = B.x1; } return ZN12_ONSU; }
// bölgeler: [tür, bitiş sütunu, (sondaki geçişin yarı genişliği, sütun; yoksa 4)]. Tur 2 haritası (COLS 1100): botanik 560–700
// (çakıl patika + kaplumbağa göletinin önünde ahşap iskele 604–658), yol2 700–805, gölet 805–1030 (su 830–1005), tepe 1030+.
// Park rafları (64, 296, 700, 800) kaldırım/çakıl/asfalt üstünde kalacak şekilde sınırlar kaydırıldı.
const ZN12_BOLGE = [['kaldirim', 72], ['bisiklet', 290], ['kaldirim', 452], ['meydan', 562], ['cakil', 604, 0.15], ['iskele', 658, 0.15],
  ['cakil', 706], ['bisiklet', 808], ['kosu', 1034], ['patika', 1e9]];
function zn12Gec(i) { const b = ZN12_BOLGE[i]; return (b && b[2] ? b[2] : 4) * T; }   // i. bölgenin SONUNDAKİ geçişin yarı genişliği

// ── Yardımcılar ──
function zn12Rnd(t) {   // tohumlu rastgele (mulberry32): her açılışta aynı desen
  return function () {
    t |= 0; t = t + 0x6D2B79F5 | 0;
    let r = Math.imul(t ^ t >>> 15, 1 | t);
    r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r;
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}
function zn12Hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function zn12Pur(x, a, b) { const q = x < a ? 0 : x > b ? 1 : (x - a) / (b - a); return q * q * (3 - 2 * q); }
function zn12El(q, x, y, rx, ry, col) { q.fillStyle = col; q.beginPath(); q.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), 0, 0, ZN12_PI2); q.fill(); }
function zn12Sec(rnd, a) { return a[Math.floor(rnd() * a.length) % a.length]; }
function zn12Gun() { if (typeof dn12Gun === 'function') { try { return dn12Gun(); } catch (e) {} } return typeof cam !== 'undefined' ? clamp((cam.x + VW / 2) / (900 * T), 0, 1) : 0; }
function zn12Guc() { if (typeof dn12Isik === 'function') { try { const i = dn12Isik(); if (i && i.guc >= 0) return i.guc; } catch (e) {} } return 0; }
function zn12GunesX() { return typeof DN12 !== 'undefined' && DN12 && Number.isFinite(DN12.gunesX) ? DN12.gunesX : 0.5; }
// rüzgâr: yavaş dalga + kısa titreşim + ara sıra hafif esinti; hep sağa doğru (0 = durgun, ~1.8 = esinti)
function zn12Ruzgar(x, tm) {
  const r = Math.sin(tm * 0.23 + x * 0.0009), esinti = r > 0 ? r * r * r * r : 0;
  return 0.35 + Math.sin(tm * 0.8 + x * 0.0021) * 0.45 + Math.sin(tm * 1.9 + x * 0.0063 + 1.3) * 0.22 + esinti * 0.8;
}
// önbellek tuvali: (x0, y0, w, h) dünya birimi dikdörtgeni, K piksel/birim; fn(q) dünya biriminde çizer
function zn12Tuval(ad, K, x0, y0, w, h, fn) {
  let c = ZN12.spr.get(ad); if (c) return c;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; ZN12.spr.set(ad, c); zn12Zorla(c); return c;
}
// yeni kurulan tuvali 1 piksellik bir tuvale çizerek hemen işlet (kayıtlı çizim komutları ilk kullanımda değil şimdi çalışsın)
let zn12ZorlaC = null;
function zn12Zorla(c) {
  try { if (!zn12ZorlaC) { const k = document.createElement('canvas'); k.width = k.height = 1; zn12ZorlaC = k.getContext('2d'); } zn12ZorlaC.drawImage(c, 0, 0, 1, 1); } catch (e) {}
}
// sprite'ı dünya noktasına (x, y) koy: s ölçek, kx eğim (sprite'ın y'si başına x kayması; yukarı çizilen sprite'ta -k = tepe sağa yatar)
function zn12Koy(spr, x, y, s, kx) {
  g.setTransform(S * s, 0, kx * S * s, S * s, (x - cam.x) * S, (y - cam.y) * S);
  g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h);
}
function zn12Kare() { return typeof omLim !== 'undefined' && omLim ? omLim.kare : performance.now(); }   // çizilen kare sayacı (oyun zamanı donsa da artar)
function zn12Dunya() { g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S); }

// ── Bölge ağırlığı: x'te tür 'tur'un payı (geçişlerde 0..1) ──
function zn12Agirlik(tur, x) {
  let w = 0, x0 = -1e9;
  for (let i = 0; i < ZN12_BOLGE.length; i++) {
    const b = ZN12_BOLGE[i], x1 = b[1] * T;
    if (b[0] === tur) {
      const hl = i === 0 ? 0 : zn12Gec(i - 1), hr = zn12Gec(i);
      const sol = i === 0 ? 1 : zn12Pur(x, x0 - hl, x0 + hl);
      const sag = i === ZN12_BOLGE.length - 1 ? 1 : 1 - zn12Pur(x, x1 - hr, x1 + hr);
      w = Math.max(w, Math.min(sol, sag));
    }
    x0 = x1;
  }
  return w;
}
function zn12Suda(x) { return x > ZN12_SU0 && x < ZN12_SU1; }
function zn12Gorunur(tur, L, R) {   // tür [L, R] aralığında (geçişler dahil) var mı
  let x0 = -1e9;
  for (let i = 0; i < ZN12_BOLGE.length; i++) {
    const b = ZN12_BOLGE[i], x1 = b[1] * T;
    if (b[0] === tur && x1 + zn12Gec(i) > L && x0 - (i ? zn12Gec(i - 1) : 0) < R) return true;
    x0 = x1;
  }
  return false;
}

// ═════════════════════ ZEMİN DÖŞEMELERİ (önbellek) ═════════════════════
// sar: döşeme tekrar ettiği için kenara taşan parçayı karşı uçta da çiz
function zn12Sar(x, pay, fn) { fn(x); if (x < pay + ZN12_TP) fn(x + ZN12_TW); if (x > ZN12_TW - pay) fn(x - ZN12_TW); }
// periyodik dalga: döşeme boyunca tam k kez döner (dikişsiz)
function zn12Per(x, k, ph) { return Math.sin(x * ZN12_PI2 * k / ZN12_TW + ph); }
function zn12Benek(q, rnd, n, y0, y1, renk, r0, r1, a) {   // ince doku: küçük lekeler
  q.globalAlpha = a;
  for (let i = 0; i < n; i++) {
    const x = rnd() * ZN12_TW, y = y0 + rnd() * (y1 - y0), rr = r0 + rnd() * (r1 - r0), col = zn12Sec(rnd, renk);
    zn12Sar(x, rr, xx => zn12El(q, xx, y, rr, rr * 0.55, col));
  }
  q.globalAlpha = 1;
}
// uzak çimen saçağı: yolun arkasındaki ince çimen şeridi; üst kenarı ot uçları (ARKA'nın çim bandının üstüne biner, dikiş yok)
function zn12UzakCimen(q, rnd, alt) {
  const tepe = x => 696 + zn12Per(x, 13, 0.4) * 1.2 + zn12Per(x, 31, 1.7) * 0.9 + zn12Per(x, 57, 2.2) * 0.5;
  q.fillStyle = '#7ab949'; q.beginPath(); q.moveTo(0, alt);
  for (let x = 0; x <= ZN12_TW + ZN12_TP; x += 8) q.lineTo(x, tepe(x));
  q.lineTo(ZN12_TW + ZN12_TP, alt); q.closePath(); q.fill();
  zn12Benek(q, rnd, 140, 697, alt - 1, ['#6aaa3f', '#8cc657', '#5f9e3a'], 3, 9, 0.55);
  const ot = ['#68a83e', '#86c454', '#9bd05e', '#5c9a3a', '#a9d867'];
  for (let i = 0; i < 760; i++) {
    const x = rnd() * ZN12_TW, h = 4 + rnd() * 9, w = 1.3 + rnd() * 1.7, ey = tepe(x) + 3 + rnd() * 3, yat = (rnd() - 0.35) * 3;
    q.fillStyle = zn12Sec(rnd, ot);
    zn12Sar(x, 6, xx => { q.beginPath(); q.moveTo(xx - w, ey); q.quadraticCurveTo(xx - w * 0.2 + yat * 0.5, ey - h * 0.6, xx + yat, ey - h); q.quadraticCurveTo(xx + w * 0.4, ey - h * 0.5, xx + w, ey); q.fill(); });
  }
  // minik çiçekler (beyaz papatya, sarı düğün çiçeği, pembe yonca)
  const cic = ['#ffffff', '#fff6d8', '#ffd84a', '#f6a9c3'];
  for (let i = 0; i < 70; i++) {
    const x = rnd() * ZN12_TW, y = 694 + rnd() * 7, col = zn12Sec(rnd, cic);
    zn12Sar(x, 3, xx => { zn12El(q, xx, y, 1.6, 1.2, col); if (col === '#ffffff') zn12El(q, xx, y, 0.6, 0.5, '#f2c440'); });
  }
  // bordürün dibine düşen yumuşak gölge
  q.fillStyle = 'rgba(45,80,30,.22)'; q.fillRect(0, alt - 2.5, ZN12_TW + ZN12_TP, 2.5);
}
function zn12Bordur(q, y, ust, yuz, derz) {   // taş bordür: üst yüz + ön yüz + derzler
  q.fillStyle = ust; q.fillRect(0, y, ZN12_TW + ZN12_TP, 2.6);
  q.fillStyle = yuz; q.fillRect(0, y + 2.6, ZN12_TW + ZN12_TP, 2.2);
  q.fillStyle = 'rgba(255,255,255,.35)'; q.fillRect(0, y, ZN12_TW + ZN12_TP, 0.6);
  if (derz) { q.fillStyle = 'rgba(110,95,70,.35)'; for (let x = 0; x < ZN12_TW + ZN12_TP; x += derz) q.fillRect(x, y, 0.7, 4.8); }
}
// yakın çimen: yolun önü; ot, yonca, papatya, düğün çiçeği. ustY: başladığı yer
function zn12YakinCimen(q, rnd, ustY) {
  q.fillStyle = '#6aae44'; q.fillRect(0, ustY, ZN12_TW + ZN12_TP, ZN12_Y1 - ustY);
  zn12Benek(q, rnd, 150, ustY + 4, ZN12_Y1, ['#5c9e3b', '#79bb4c', '#4f9236'], 8, 22, 0.45);
  q.fillStyle = 'rgba(40,70,25,.28)'; q.fillRect(0, ustY, ZN12_TW + ZN12_TP, 1.6);   // bordürün gölgesi
  const ot = ['#5a9c3a', '#73b448', '#88c556', '#4e9035', '#9bd261'];
  for (let i = 0; i < 1300; i++) {
    const x = rnd() * ZN12_TW, y = ustY + 3 + rnd() * (ZN12_Y1 - ustY - 3), h = 4 + rnd() * 8 + (y - ustY) * 0.04, w = 1.2 + rnd() * 1.6, yat = (rnd() - 0.3) * 3;
    q.fillStyle = zn12Sec(rnd, ot);
    zn12Sar(x, 6, xx => { q.beginPath(); q.moveTo(xx - w, y); q.quadraticCurveTo(xx + yat * 0.4, y - h * 0.6, xx + yat, y - h); q.quadraticCurveTo(xx + w * 0.4, y - h * 0.5, xx + w, y); q.fill(); });
  }
  // yolun kenarına taşan ot uçları
  for (let i = 0; i < 160; i++) {
    const x = rnd() * ZN12_TW, h = 4 + rnd() * 5, y = ustY + 2.5;
    q.fillStyle = zn12Sec(rnd, ot);
    zn12Sar(x, 4, xx => { q.beginPath(); q.moveTo(xx - 1.4, y); q.quadraticCurveTo(xx, y - h * 0.5, xx + 0.8, y - h); q.lineTo(xx + 1.4, y); q.fill(); });
  }
  // yonca kümeleri ve çiçekler
  for (let i = 0; i < 46; i++) {
    const x = rnd() * ZN12_TW, y = ustY + 10 + rnd() * (ZN12_Y1 - ustY - 14);
    zn12Sar(x, 8, xx => { for (let k = 0; k < 3; k++) zn12El(q, xx + Math.cos(k * 2.1) * 2.4, y + Math.sin(k * 2.1) * 1.4, 2.2, 1.5, '#4f9a3a'); });
  }
  for (let i = 0; i < 150; i++) {
    const x = rnd() * ZN12_TW, y = ustY + 6 + rnd() * (ZN12_Y1 - ustY - 8), t = rnd();
    zn12Sar(x, 4, xx => {
      if (t < 0.5) { for (let k = 0; k < 5; k++) zn12El(q, xx + Math.cos(k * 1.257) * 1.6, y + Math.sin(k * 1.257) * 1.0, 1.2, 0.8, '#ffffff'); zn12El(q, xx, y, 0.9, 0.7, '#f4c430'); }
      else if (t < 0.78) zn12El(q, xx, y, 1.5, 1.2, '#ffd23c');
      else zn12El(q, xx, y, 1.6, 1.3, '#f2a0bf');
    });
  }
}
// tür başına döşeme çizimi (q: dünya biriminde, x 0..TW+TP, y Y0..Y1)
const ZN12_ZEMIN_CIZ = {
  kaldirim(q, rnd) {   // kum rengi taş döşeme (resimlerdeki yürüme yolları gibi), uzunlamasına derzler; enine derz ve tuğla şerit karede perspektifle
    zn12UzakCimen(q, rnd, 704);
    zn12Bordur(q, 703.5, '#efe7d3', '#d0c2a3', 64);
    q.fillStyle = '#e5cfa5'; q.fillRect(0, ZN12_YOL0, ZN12_TW + ZN12_TP, ZN12_YOL1 - ZN12_YOL0);
    zn12Benek(q, rnd, 260, ZN12_YOL0 + 1, ZN12_YOL1 - 1, ['#ecdab5', '#dbc293', '#f1e3c4', '#d3b98a'], 4, 16, 0.55);
    zn12Benek(q, rnd, 500, ZN12_YOL0 + 1, ZN12_YOL1 - 1, ['#c9ae80', '#f6ead0'], 0.5, 1.3, 0.6);
    q.fillStyle = 'rgba(150,118,80,.45)'; q.fillRect(0, 719, ZN12_TW + ZN12_TP, 0.9); q.fillRect(0, 732.5, ZN12_TW + ZN12_TP, 1.0);
    q.fillStyle = 'rgba(255,248,230,.5)'; q.fillRect(0, 720, ZN12_TW + ZN12_TP, 0.6); q.fillRect(0, 733.6, ZN12_TW + ZN12_TP, 0.6);
    zn12Bordur(q, ZN12_YOL1, '#efe6d2', '#cdbd9c', 72);
    zn12YakinCimen(q, rnd, ZN12_YOL1 + 5);
  },
  meydan(q, rnd) {   // Bilgi Merkezi meydanı: açık granit plakalar
    zn12UzakCimen(q, rnd, 704);
    zn12Bordur(q, 703.5, '#f1eee6', '#cfc8b8', 96);
    q.fillStyle = '#e8e2d4'; q.fillRect(0, ZN12_YOL0, ZN12_TW + ZN12_TP, ZN12_YOL1 - ZN12_YOL0);
    zn12Benek(q, rnd, 240, ZN12_YOL0 + 1, ZN12_YOL1 - 1, ['#f2eee4', '#dcd5c5', '#e1dacb'], 4, 14, 0.6);
    zn12Benek(q, rnd, 900, ZN12_YOL0 + 1, ZN12_YOL1 - 1, ['#bfb6a4', '#a9a091', '#ffffff'], 0.4, 1.1, 0.55);
    q.fillStyle = 'rgba(140,130,112,.45)'; q.fillRect(0, 726.5, ZN12_TW + ZN12_TP, 0.9);
    q.fillStyle = 'rgba(255,255,255,.55)'; q.fillRect(0, 727.4, ZN12_TW + ZN12_TP, 0.6);
    zn12Bordur(q, ZN12_YOL1, '#f1eee6', '#c9c1b0', 96);
    zn12YakinCimen(q, rnd, ZN12_YOL1 + 5);
  },
  bisiklet(q, rnd) {   // bisiklet yolu: iki yanı taş kenarlı asfalt, beyaz kenar çizgileri, kesik orta çizgi (64 birim: döşemeye tam sığar)
    zn12UzakCimen(q, rnd, 704);
    zn12Bordur(q, 703.5, '#ece6d6', '#cbbfa4', 64);
    q.fillStyle = '#dccfb2'; q.fillRect(0, ZN12_YOL0, ZN12_TW + ZN12_TP, 3);
    q.fillStyle = 'rgba(140,120,90,.4)'; for (let x = 0; x < ZN12_TW + ZN12_TP; x += 16) q.fillRect(x, ZN12_YOL0, 0.6, 3);
    q.fillStyle = '#8e959b'; q.fillRect(0, 711, ZN12_TW + ZN12_TP, 35);
    zn12Benek(q, rnd, 160, 712, 745, ['#838a90', '#979ea3', '#7d848a'], 6, 20, 0.45);
    zn12Benek(q, rnd, 1600, 711.5, 745.5, ['#a7adb2', '#737a80', '#b5babd'], 0.35, 0.9, 0.7);
    q.fillStyle = 'rgba(255,255,255,.08)'; q.fillRect(0, 711, ZN12_TW + ZN12_TP, 6);   // uzak kenarda ışık
    q.fillStyle = '#f3f2ea'; q.fillRect(0, 713, ZN12_TW + ZN12_TP, 1.2); q.fillRect(0, 743, ZN12_TW + ZN12_TP, 1.4);
    for (let x = 0; x < ZN12_TW + ZN12_TP; x += 64) q.fillRect(x + 6, 727.6, 36, 1.7);
    q.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 40; i++) { const x = rnd() * ZN12_TW; q.fillRect(x, 713, 3 + rnd() * 5, 1.2); }   // aşınmış boya
    q.fillStyle = '#dccfb2'; q.fillRect(0, 746, ZN12_TW + ZN12_TP, ZN12_YOL1 - 746 + 1);
    q.fillStyle = 'rgba(140,120,90,.4)'; for (let x = 8; x < ZN12_TW + ZN12_TP; x += 18) q.fillRect(x, 746, 0.6, 3.6);
    zn12Bordur(q, ZN12_YOL1 + 0.5, '#ece6d6', '#c9bc9e', 80);
    zn12YakinCimen(q, rnd, ZN12_YOL1 + 5.5);
  },
  kosu(q, rnd) {   // gölet kıyısı: kırmızı koşu yolu, beyaz kulvar çizgileri
    zn12UzakCimen(q, rnd, 704);
    q.fillStyle = '#e7e1d3'; q.fillRect(0, 703.5, ZN12_TW + ZN12_TP, 4); q.fillStyle = 'rgba(255,255,255,.4)'; q.fillRect(0, 703.5, ZN12_TW + ZN12_TP, 0.6);
    q.fillStyle = '#c65b40'; q.fillRect(0, 707.5, ZN12_TW + ZN12_TP, ZN12_YOL1 - 707.5);
    zn12Benek(q, rnd, 200, 708, ZN12_YOL1 - 1, ['#cf6a4d', '#b9503a', '#d77457'], 5, 18, 0.45);
    zn12Benek(q, rnd, 1500, 708, ZN12_YOL1, ['#e08468', '#a8432f', '#e9947a'], 0.35, 0.9, 0.75);
    q.fillStyle = 'rgba(255,240,225,.10)'; q.fillRect(0, 707.5, ZN12_TW + ZN12_TP, 5);
    q.fillStyle = 'rgba(250,246,238,.92)';
    q.fillRect(0, 708.6, ZN12_TW + ZN12_TP, 1.0); q.fillRect(0, 721.8, ZN12_TW + ZN12_TP, 1.15); q.fillRect(0, 735.2, ZN12_TW + ZN12_TP, 1.25); q.fillRect(0, 747.6, ZN12_TW + ZN12_TP, 1.3);
    q.fillStyle = '#e4ddcc'; q.fillRect(0, ZN12_YOL1, ZN12_TW + ZN12_TP, 3.2);
    q.fillStyle = 'rgba(120,100,80,.3)'; q.fillRect(0, ZN12_YOL1 + 3.2, ZN12_TW + ZN12_TP, 1);
    zn12YakinCimen(q, rnd, ZN12_YOL1 + 4);
  },
  cakil(q, rnd) {   // botanik bahçesi: taş bordürlü açık çakıl patika
    zn12UzakCimen(q, rnd, 704);
    const tas = (y0, y1, renk) => {   // yuvarlak kayrak taşlardan bordür
      q.fillStyle = 'rgba(80,70,55,.35)'; q.fillRect(0, y0, ZN12_TW + ZN12_TP, y1 - y0);
      for (let x = 0; x < ZN12_TW + ZN12_TP; x += 9 + rnd() * 4) {
        const w = 7 + rnd() * 4, col = zn12Sec(rnd, renk);
        q.fillStyle = col; q.beginPath(); if (q.roundRect) q.roundRect(x, y0 + 0.4, w, y1 - y0 - 0.8, 2); else q.rect(x, y0 + 0.4, w, y1 - y0 - 0.8); q.fill();
        q.fillStyle = 'rgba(255,255,255,.3)'; q.fillRect(x + 1, y0 + 0.8, w - 2, 0.8);
      }
    };
    tas(703, 709, ['#c9c2b2', '#b8b0a0', '#d6d0c2', '#aaa292']);
    q.fillStyle = '#d8cfbc'; q.fillRect(0, 709, ZN12_TW + ZN12_TP, 37);
    zn12Benek(q, rnd, 160, 710, 745, ['#e2dacb', '#cdc3ad', '#e7e0d2'], 6, 18, 0.5);
    zn12Benek(q, rnd, 2600, 709.5, 745.5, ['#f1ebde', '#b8ad97', '#a59a85', '#c9bfa9', '#fffaf0', '#9c917c'], 0.5, 1.4, 0.85);
    q.fillStyle = 'rgba(255,250,235,.12)'; q.fillRect(0, 709, ZN12_TW + ZN12_TP, 5);
    q.fillStyle = 'rgba(80,65,45,.18)'; q.fillRect(0, 742, ZN12_TW + ZN12_TP, 4);
    tas(746, 752, ['#c2bba9', '#b0a894', '#d0c9b8', '#a49c8b']);
    zn12YakinCimen(q, rnd, 752);
  },
  iskele(q, rnd) {   // kaplumbağa göletinin önünde ahşap yürüyüş iskelesi (enine tahtalar karede perspektifle)
    zn12UzakCimen(q, rnd, 705);
    q.fillStyle = '#7a5638'; q.fillRect(0, 703.5, ZN12_TW + ZN12_TP, 5); q.fillStyle = '#a77a52'; q.fillRect(0, 703.5, ZN12_TW + ZN12_TP, 1.4);   // arka kiriş
    q.fillStyle = '#bd8f60'; q.fillRect(0, ZN12_YOL0, ZN12_TW + ZN12_TP, ZN12_YOL1 - ZN12_YOL0);
    zn12Benek(q, rnd, 220, ZN12_YOL0 + 1, ZN12_YOL1 - 1, ['#c99d6d', '#b0814f', '#d2a978', '#a97a4b'], 5, 22, 0.5);
    for (let i = 0; i < 260; i++) {   // damar çizgileri (tahtalar boyunca değil enine olduğu için kısa ve dikine yakın)
      const x = rnd() * ZN12_TW, y = ZN12_YOL0 + 2 + rnd() * 37, h = 3 + rnd() * 6;
      q.strokeStyle = rnd() < 0.5 ? 'rgba(120,80,45,.35)' : 'rgba(240,205,160,.3)'; q.lineWidth = 0.5;
      zn12Sar(x, 3, xx => { q.beginPath(); q.moveTo(xx, y); q.quadraticCurveTo(xx + 0.8, y + h * 0.5, xx + 0.3, y + h); q.stroke(); });
    }
    for (let i = 0; i < 26; i++) { const x = rnd() * ZN12_TW, y = ZN12_YOL0 + 4 + rnd() * 32; zn12Sar(x, 3, xx => { zn12El(q, xx, y, 1.6, 1.1, 'rgba(100,65,35,.5)'); }); }   // budak
    q.fillStyle = 'rgba(255,235,200,.12)'; q.fillRect(0, ZN12_YOL0, ZN12_TW + ZN12_TP, 5);
    q.fillStyle = '#8a6242'; q.fillRect(0, ZN12_YOL1, ZN12_TW + ZN12_TP, 4.5); q.fillStyle = '#6b4a30'; q.fillRect(0, ZN12_YOL1 + 4.5, ZN12_TW + ZN12_TP, 3);   // ön kiriş
    q.fillStyle = '#b48558'; q.fillRect(0, ZN12_YOL1, ZN12_TW + ZN12_TP, 1);
    zn12YakinCimen(q, rnd, ZN12_YOL1 + 7.5);
    q.fillStyle = 'rgba(30,45,25,.35)'; q.fillRect(0, ZN12_YOL1 + 7.5, ZN12_TW + ZN12_TP, 4);   // iskelenin altındaki gölge
    for (let x = 30; x < ZN12_TW + ZN12_TP; x += 128) { q.fillStyle = '#5e4129'; q.fillRect(x, ZN12_YOL1 + 7, 6, 9); q.fillStyle = 'rgba(30,45,25,.3)'; q.fillRect(x - 2, ZN12_YOL1 + 15, 10, 2); }   // ayaklar
  },
  patika(q, rnd) {   // gün batımı tepesi: her yer çimen, ortada yumuşak kenarlı toprak patika, kır çiçekleri
    zn12UzakCimen(q, rnd, 712);
    zn12YakinCimen(q, rnd, 708);
    const ust = x => 712 + zn12Per(x, 7, 0.3) * 2.2 + zn12Per(x, 19, 1.1) * 1.2, alt = x => 742 + zn12Per(x, 5, 2.0) * 2.6 + zn12Per(x, 23, 0.7) * 1.3;
    q.fillStyle = '#d8bd8b'; q.beginPath(); q.moveTo(0, ust(0));
    for (let x = 0; x <= ZN12_TW + ZN12_TP; x += 6) q.lineTo(x, ust(x));
    for (let x = ZN12_TW + ZN12_TP; x >= 0; x -= 6) q.lineTo(x, alt(x));
    q.closePath(); q.fill();
    zn12Benek(q, rnd, 160, 715, 739, ['#e2cba0', '#cbab78', '#e8d4ad'], 5, 16, 0.5);
    q.strokeStyle = 'rgba(170,135,90,.35)'; q.lineWidth = 2.2;   // tekerlek/ayak izi gibi iki yumuşak iz
    q.beginPath(); for (let x = 0; x <= ZN12_TW + ZN12_TP; x += 8) { const y = 722 + zn12Per(x, 6, 1.0) * 1.2; if (x === 0) q.moveTo(x, y); else q.lineTo(x, y); } q.stroke();
    q.beginPath(); for (let x = 0; x <= ZN12_TW + ZN12_TP; x += 8) { const y = 733 + zn12Per(x, 4, 2.4) * 1.4; if (x === 0) q.moveTo(x, y); else q.lineTo(x, y); } q.stroke();
    for (let i = 0; i < 120; i++) {   // çakıl taşları
      const x = rnd() * ZN12_TW, y = 715 + rnd() * 26, r = 0.7 + rnd() * 1.6, col = zn12Sec(rnd, ['#efe2c6', '#bda27a', '#c9b69a', '#f5ecd8']);
      zn12Sar(x, r, xx => { zn12El(q, xx, y, r, r * 0.62, col); });
    }
    const ot = ['#6aac42', '#80bf50', '#5a9b3a', '#93ce5c'];
    for (let i = 0; i < 520; i++) {   // patika kenarına taşan otlar
      const x = rnd() * ZN12_TW, yukari = rnd() < 0.5, y = yukari ? ust(x) + 2 + rnd() * 2 : alt(x) + 1 + rnd() * 3, h = 3 + rnd() * 6;
      q.fillStyle = zn12Sec(rnd, ot);
      zn12Sar(x, 4, xx => { q.beginPath(); q.moveTo(xx - 1.3, y); q.quadraticCurveTo(xx, y - h * 0.5, xx + (rnd() - 0.5) * 2, y - h); q.lineTo(xx + 1.3, y); q.fill(); });
    }
    const kir = ['#e5493b', '#f6d04d', '#ffffff', '#8f7ee6', '#f39ac0'];
    for (let i = 0; i < 90; i++) {   // kır çiçekleri (uzak ve yakın çimende)
      const x = rnd() * ZN12_TW, y = rnd() < 0.4 ? 699 + rnd() * 9 : 750 + rnd() * 110, col = zn12Sec(rnd, kir), r = 1.3 + rnd() * 1.1;
      zn12Sar(x, 3, xx => { zn12El(q, xx, y, r, r * 0.8, col); zn12El(q, xx, y, r * 0.35, r * 0.3, col === '#e5493b' ? '#3a2a22' : '#f2bf3a'); });
    }
  }
};
// döşemeyi kur (ilk istekte; bütçe dolsa da görünen tür hemen kurulur)
function zn12Zemin(tur) {
  let c = ZN12.zemin[tur]; if (c) return c;
  c = document.createElement('canvas');
  c.width = (ZN12_TW + ZN12_TP) * ZN12_R; c.height = (ZN12_Y1 - ZN12_Y0) * ZN12_R;
  const q = c.getContext('2d'); q.scale(ZN12_R, ZN12_R); q.translate(0, -ZN12_Y0); q.lineCap = 'round'; q.lineJoin = 'round';
  let tohum = 7; for (let i = 0; i < tur.length; i++) tohum = tohum * 31 + tur.charCodeAt(i);
  try { ZN12_ZEMIN_CIZ[tur](q, zn12Rnd(tohum)); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('zemin12.' + tur, e); }
  ZN12.zemin[tur] = c; zn12Zorla(c); return c;
}
// döşemenin [a, b] dünya aralığını al saydamlıkla çiz (desen dünya x'ine bağlı: kamera kayınca zemin kaymaz)
function zn12Dilim(tur, a, b, al, yAlt) {   // yAlt: verilirse döşemenin yalnız bu y'ye kadarki üst kısmı
  if (!(b > a) || al <= 0.004) return;
  const c = zn12Zemin(tur), h = (yAlt || ZN12_Y1) - ZN12_Y0, sh = yAlt ? Math.min(c.height, Math.ceil(h * ZN12_R)) : c.height;
  g.globalAlpha = al;
  let x = a;
  while (x < b - 0.01) {
    const u = ((x % ZN12_TW) + ZN12_TW) % ZN12_TW, w = Math.min(b - x, ZN12_TW - u), ek = Math.min(1, ZN12_TP - 1);   // komşu dilimle 1 birim örtüşme
    g.drawImage(c, u * ZN12_R, 0, (w + ek) * ZN12_R, sh, x, ZN12_Y0, w + ek, sh / ZN12_R);
    x += w; ZN12.say.zemin++;
  }
  g.globalAlpha = 1;
}
// görünen aralıkta zemini çiz: düz bölgeler tek dilim, geçişler 8 birimlik şeritlerde yumuşak karışım, gölette boşluk
function zn12ZeminCiz(L, R, alt) {
  let x0 = -1e9;
  for (let i = 0; i < ZN12_BOLGE.length; i++) {
    const b = ZN12_BOLGE[i], x1 = Math.min(1e8, b[1] * T);
    const hl = i === 0 ? 0 : zn12Gec(i - 1), hr = zn12Gec(i);
    const s0 = i === 0 ? -1e9 : x0 + hl, s1 = i === ZN12_BOLGE.length - 1 ? 1e9 : x1 + hr;   // geçişin sağ yarısına kadar dolu
    let a = Math.max(L, i === 0 ? -1e9 : x0 - hl), e = Math.min(R, s1);
    if (a < e) {
      // geçişin sol yarısı (önceki türün üstüne yumuşak bindirme)
      const gA = a, gB = Math.min(e, s0);
      if (i > 0 && gA < gB) {
        const ad = hl < 60 ? 2 : 8;   // kısa geçişte (çakıl ↔ iskele) ince şerit
        for (let x = Math.floor(gA / ad) * ad; x < gB; x += ad) {
          const xa = Math.max(x, gA), xb = Math.min(x + ad, gB), w = zn12Pur(xa + ad / 2, x0 - hl, x0 + hl);
          zn12DilimSu(b[0], xa, xb, w);
        }
        a = Math.max(a, s0);
      }
      if (a < e) zn12DilimSu(b[0], a, e, 1);
    }
    x0 = x1;
  }
  if (alt > ZN12_Y1 - 1) {   // geniş açıda döşemenin altı (göletçik kolu hariç)
    g.fillStyle = ZN12_YAKIN; const O = ZN12_ONSU, var1 = typeof bt12OnSuCiz === 'function' && R > O.x0 && L < O.x1;
    if (!var1) g.fillRect(L, ZN12_Y1 - 1, R - L, alt - ZN12_Y1 + 3);
    else { if (L < O.x0) g.fillRect(L, ZN12_Y1 - 1, O.x0 - L, alt - ZN12_Y1 + 3); if (R > O.x1) g.fillRect(O.x1, ZN12_Y1 - 1, R - O.x1, alt - ZN12_Y1 + 3); }
  }
}
function zn12DilimSu(tur, a, b, al) {   // gölet aralığını atlayarak dilim; botanik göletçik kolunda kirişin altı boş
  const O = ZN12_ONSU;
  if (tur === 'iskele' && b > O.x0 && a < O.x1 && typeof bt12OnSuCiz === 'function') {
    if (a < O.x0) zn12Dilim(tur, a, O.x0, al);
    zn12Dilim(tur, Math.max(a, O.x0), Math.min(b, O.x1), al, O.y);
    if (b > O.x1) zn12Dilim(tur, O.x1, b, al);
    return;
  }
  if (b <= ZN12_SU0 || a >= ZN12_SU1) { zn12Dilim(tur, a, b, al); return; }
  if (a < ZN12_SU0) zn12Dilim(tur, a, ZN12_SU0, al);
  if (b > ZN12_SU1) zn12Dilim(tur, ZN12_SU1, b, al);
}

// ── Yol üstü perspektif çizgileri: enine derzler ve şeritler yakın kenarda ekran ortasından dışa açılır ──
function zn12PX(x, y, cx) { return x + (x - cx) * ZN12_PERS * (y - ZN12_YOL0) / (ZN12_YOL1 - ZN12_YOL0); }
const ZN12_KAL_SIRA = [[ZN12_YOL0, 719, 0], [719, 732.5, 23], [732.5, ZN12_YOL1, 11]];   // [üst, alt, kaydırma] — şaşırtmalı taşlar
function zn12Derzler(L, R, cx) {
  // kaldırım: 46'lık taşlar, her 6 taşta bir tuğla şerit
  if (zn12Gorunur('kaldirim', L, R)) {
    g.lineWidth = 0.9; g.strokeStyle = 'rgba(150,118,82,.42)';
    for (let r = 0; r < 3; r++) {
      const sr = ZN12_KAL_SIRA[r];
      g.beginPath(); let n = 0;
      for (let x = Math.floor((L - 60 - sr[2]) / 46) * 46 + sr[2]; x < R + 60; x += 46) {
        if (zn12Suda(x)) continue;
        const w = zn12Agirlik('kaldirim', x); if (w < 0.5) continue;
        g.moveTo(zn12PX(x, sr[0], cx), sr[0] + 0.4); g.lineTo(zn12PX(x, sr[1], cx), sr[1] - 0.4); n++;
      }
      if (n) g.stroke();
    }
    // tuğla şeritler (resimlerdeki gibi enine kırmızı tuğla bantlar)
    g.fillStyle = '#c4714f'; g.beginPath(); let n = 0;
    for (let x = Math.floor((L - 80) / 276) * 276; x < R + 80; x += 276) {
      if (zn12Agirlik('kaldirim', x) < 0.6) continue;
      g.moveTo(zn12PX(x - 5, ZN12_YOL0, cx), ZN12_YOL0); g.lineTo(zn12PX(x + 5, ZN12_YOL0, cx), ZN12_YOL0);
      g.lineTo(zn12PX(x + 5, ZN12_YOL1, cx), ZN12_YOL1); g.lineTo(zn12PX(x - 5, ZN12_YOL1, cx), ZN12_YOL1); g.closePath(); n++;
    }
    if (n) {
      g.fill(); g.strokeStyle = 'rgba(120,60,40,.45)'; g.lineWidth = 0.7; g.stroke();
      g.strokeStyle = 'rgba(240,200,170,.5)'; g.lineWidth = 0.5; g.beginPath();   // tuğlaların arası
      for (let x = Math.floor((L - 80) / 276) * 276; x < R + 80; x += 276) {
        if (zn12Agirlik('kaldirim', x) < 0.6) continue;
        for (let y = ZN12_YOL0 + 6; y < ZN12_YOL1; y += 6 + (y - ZN12_YOL0) * 0.08) { g.moveTo(zn12PX(x - 4.5, y, cx), y); g.lineTo(zn12PX(x + 4.5, y, cx), y); }
      }
      g.stroke();
    }
  }
  // meydan: 64'lük granit plakalar, satranç gibi hafif ton farkı
  if (zn12Gorunur('meydan', L, R)) {
    g.fillStyle = 'rgba(150,138,118,.13)'; g.beginPath(); let n = 0;
    for (let x = Math.floor((L - 70) / 64) * 64; x < R + 70; x += 64) {
      if (zn12Agirlik('meydan', x + 32) < 0.6) continue;
      const k = Math.round(x / 64), ya = (k & 1) ? ZN12_YOL0 : 726.5, yb = (k & 1) ? 726.5 : ZN12_YOL1;
      g.moveTo(zn12PX(x, ya, cx), ya); g.lineTo(zn12PX(x + 64, ya, cx), ya); g.lineTo(zn12PX(x + 64, yb, cx), yb); g.lineTo(zn12PX(x, yb, cx), yb); g.closePath(); n++;
    }
    if (n) g.fill();
    g.strokeStyle = 'rgba(140,130,112,.45)'; g.lineWidth = 0.8; g.beginPath(); n = 0;
    for (let x = Math.floor((L - 70) / 64) * 64; x < R + 70; x += 64) {
      if (zn12Agirlik('meydan', x) < 0.6) continue;
      g.moveTo(zn12PX(x, ZN12_YOL0, cx), ZN12_YOL0 + 0.4); g.lineTo(zn12PX(x, ZN12_YOL1, cx), ZN12_YOL1 - 0.4); n++;
    }
    if (n) g.stroke();
  }
  // botanik ahşap iskelesi: 11'lik enine tahtalar (aralarda koyu boşluk, ardından ışık alan kenar), her 8 tahtada bir çivi sırası
  if (zn12Gorunur('iskele', L, R)) {
    const yolu = (renk, gen, kay) => {
      g.strokeStyle = renk; g.lineWidth = gen; g.beginPath(); let n = 0;
      for (let x = Math.floor((L - 60) / 11) * 11; x < R + 60; x += 11) {
        if (zn12Agirlik('iskele', x) < 0.5) continue;
        g.moveTo(zn12PX(x + kay, ZN12_YOL0, cx), ZN12_YOL0 + 0.3); g.lineTo(zn12PX(x + kay, ZN12_YOL1, cx), ZN12_YOL1 - 0.3); n++;
      }
      if (n) g.stroke();
    };
    yolu('rgba(70,45,25,.6)', 1.1, 0); yolu('rgba(255,228,185,.28)', 0.6, 1.2);
    g.fillStyle = 'rgba(70,55,45,.55)'; g.beginPath(); let n = 0;
    for (let x = Math.floor((L - 60) / 88) * 88 + 5; x < R + 60; x += 88) {
      if (zn12Agirlik('iskele', x) < 0.6) continue;
      for (const y of [713, 728.5, 744]) { const px = zn12PX(x, y, cx); g.moveTo(px + 0.9, y); g.arc(px, y, 0.9, 0, ZN12_PI2); n++; }
    }
    if (n) g.fill();
    // iskelenin iki ucu: kalın uç tahtası + iki kısa direk (çakıldan tahtaya geçiş "kesik" değil, bilerek yapılmış bir başlangıç gibi okunsun)
    for (const ex of [604 * T, 658 * T]) {
      if (ex < L - 40 || ex > R + 40) continue;
      const x0 = zn12PX(ex, ZN12_YOL0, cx), x1 = zn12PX(ex, ZN12_YOL1, cx), sag = ex > 630 * T ? -1 : 1;
      g.fillStyle = '#8f6440'; g.beginPath();
      g.moveTo(x0 - 2.5, ZN12_YOL0 - 1); g.lineTo(x0 + 2.5, ZN12_YOL0 - 1); g.lineTo(x1 + 3, ZN12_YOL1 + 1); g.lineTo(x1 - 3, ZN12_YOL1 + 1); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,226,180,.45)'; g.fillRect(x0 - 2.5 + (sag > 0 ? 4 : 0), ZN12_YOL0, 1, ZN12_YOL1 - ZN12_YOL0);
      // direkler: arkada (uzak kenarda) ince, önde (yakın kenarda) kalın; tepeleri ışık alır
      for (const [px, py, w, h] of [[x0, ZN12_YOL0 + 1, 4.2, 15], [x1, ZN12_YOL1 + 2, 5.6, 12]]) {
        g.fillStyle = 'rgba(40,30,20,.25)'; g.beginPath(); g.ellipse(px + 3, py + 0.5, w * 1.1, w * 0.3, 0, 0, ZN12_PI2); g.fill();
        g.fillStyle = '#6e4a2c'; g.fillRect(px - w / 2, py - h, w, h);
        g.fillStyle = '#9a6c44'; g.fillRect(px - w / 2, py - h, w * 0.45, h);
        g.fillStyle = '#c9996a'; g.beginPath(); g.ellipse(px, py - h, w / 2, w * 0.22, 0, 0, ZN12_PI2); g.fill();
      }
    }
  }
  // bisiklet yolu: yere boyalı beyaz bisiklet işaretleri (yakın şeritte, perspektifle yatık)
  if (zn12Gorunur('bisiklet', L, R)) {
    const spr = zn12BisikletIsaret();
    for (let x = Math.floor((L - 60) / 760) * 760 + 380; x < R + 60; x += 760) {
      const w = zn12Agirlik('bisiklet', x); if (w < 0.3) continue;
      const y = 736.5, kx = (x - cx) * ZN12_PERS / (ZN12_YOL1 - ZN12_YOL0);
      g.globalAlpha = 0.85 * w;
      g.setTransform(S, 0, kx * S, S * 0.36, (zn12PX(x, y, cx) - cam.x) * S, (y - cam.y) * S);
      g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h);
      g.globalAlpha = 1; zn12Dunya();
    }
  }
}

// ═════════════════════ ORTA PLAN SPRITE'LARI ═════════════════════
// ağaç renk takımları (resimlerin bahar yeşili ve kiraz pembesi)
const ZN12_YESIL = { koyu: ['#3d7633', '#4a8738', '#3f7d3a', '#538f3c'], orta: ['#6aa441', '#78b247', '#6fae4a', '#84bc4c'],
  acik: ['#9fcd57', '#b2d863', '#a7d35e'], parlak: ['#cfe680', '#dff09a', '#c3e173'], golge: '#2c5a28' };
const ZN12_PEMBE = { koyu: ['#c46d89', '#d07c97', '#bb6683'], orta: ['#e597ae', '#eda7bb', '#e39cb3'],
  acik: ['#f6c3d1', '#f9cfdb', '#f3bccb'], parlak: ['#fff0f4', '#ffe4ec', '#ffffff'], golge: '#a65572' };
// taç: katman 0 = arka koyu kütle (kenar tırtıkları dahil), 1 = ön ışıklı kümeler + benekler. (0, 0) gövdenin taça girdiği nokta
function zn12Tac(q, rnd, rx, ry, cy, P, katman) {
  if (katman === 0) {
    for (let i = 0; i < 34; i++) {   // kenar tırtıkları: yaprak kümelerinin dış hatları
      const a = i / 34 * ZN12_PI2 + rnd() * 0.15, x = Math.cos(a) * rx * (0.86 + Math.sin(a * 3 + .6) * .09), y = cy + Math.sin(a) * ry * (0.83 + Math.cos(a * 2 - .4) * .08), r = 14 + rnd() * 12;
      zn12El(q, x, y, r, r * 0.86, zn12Sec(rnd, P.koyu));
    }
    for (let i = 0; i < 70; i++) {
      const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()), x = Math.cos(a) * r * rx * 0.85, y = cy + Math.sin(a) * r * ry * 0.82, rr = 18 + rnd() * 22;
      zn12El(q, x, y + 4, rr, rr * 0.84, zn12Sec(rnd, P.koyu));
    }
    for (let i = 0; i < 46; i++) {
      const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()), x = Math.cos(a) * r * rx * 0.8 - rx * 0.06, y = cy + Math.sin(a) * r * ry * 0.72 - ry * 0.1, rr = 14 + rnd() * 18;
      zn12El(q, x, y, rr, rr * 0.84, zn12Sec(rnd, P.orta));
    }
    q.globalAlpha = 0.35;   // tacın altında yumuşak gölge
    for (let i = 0; i < 16; i++) { const x = (rnd() * 2 - 1) * rx * 0.7, y = cy + ry * (0.45 + rnd() * 0.3), rr = 16 + rnd() * 14; zn12El(q, x, y, rr, rr * 0.6, P.golge); }
    q.globalAlpha = 1;
  } else {
    for (let i = 0; i < 44; i++) {
      const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()), x = Math.cos(a) * r * rx * 0.66 - rx * 0.12, y = cy + Math.sin(a) * r * ry * 0.6 - ry * 0.16, rr = 11 + rnd() * 15;
      zn12El(q, x, y, rr, rr * 0.82, zn12Sec(rnd, P.orta));
    }
    for (let i = 0; i < 40; i++) {   // güneşin vurduğu sol üst kümeler
      const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()), x = Math.cos(a) * r * rx * 0.5 - rx * 0.24, y = cy + Math.sin(a) * r * ry * 0.45 - ry * 0.3, rr = 7 + rnd() * 11;
      zn12El(q, x, y, rr, rr * 0.8, zn12Sec(rnd, P.acik));
    }
    const cicek = P !== ZN12_YESIL;
    for (let i = 0; i < 180; i++) {   // seçilen yapraklar ve beş taç yapraklı küçük bahar çiçekleri
      const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()), x = Math.cos(a) * r * rx * .84, y = cy + Math.sin(a) * r * ry * .78;
      const ust = y < cy && x < rx * .2, boy = 1.8 + rnd() * 1.9;
      q.fillStyle = ust ? zn12Sec(rnd, P.parlak) : zn12Sec(rnd, P.acik);
      if (cicek && i % 3 === 0) {
        q.beginPath();
        for (let k = 0; k < 5; k++) {
          const ac = k / 5 * ZN12_PI2 + a, px = x + Math.cos(ac) * boy * .6, py = y + Math.sin(ac) * boy * .6;
          q.moveTo(px + boy * .52, py); q.ellipse(px, py, boy * .52, boy * .38, ac, 0, ZN12_PI2);
        }
        q.fill(); zn12El(q, x, y, .65, .65, '#d8ac6e');
      } else {
        q.save(); q.translate(x, y); q.rotate(a * .4 - .6);
        q.beginPath(); q.moveTo(-boy * 1.5, 0); q.quadraticCurveTo(-boy * .2, -boy, boy * 1.5, 0);
        q.quadraticCurveTo(boy * .2, boy * .75, -boy * 1.5, 0); q.fill(); q.restore();
      }
    }
  }
}
// gövde: (0, 0) dip, yukarı çizilir; boy: taça giren nokta
function zn12Govde(q, rnd, boy, kalin, renk, golge, dallar) {
  q.fillStyle = renk; q.beginPath(); q.moveTo(-kalin * 1.5, 1);
  q.bezierCurveTo(-kalin, -boy * 0.3, -kalin * 0.8, -boy * 0.7, -kalin * 0.55, -boy - 6);
  q.lineTo(kalin * 0.55, -boy - 6); q.bezierCurveTo(kalin * 0.8, -boy * 0.7, kalin, -boy * 0.3, kalin * 1.6, 1); q.closePath(); q.fill();
  q.fillStyle = golge; q.beginPath(); q.moveTo(kalin * 0.2, 1);
  q.bezierCurveTo(kalin * 0.3, -boy * 0.4, kalin * 0.25, -boy * 0.7, kalin * 0.2, -boy - 6);
  q.lineTo(kalin * 0.55, -boy - 6); q.bezierCurveTo(kalin * 0.8, -boy * 0.7, kalin, -boy * 0.3, kalin * 1.6, 1); q.closePath(); q.fill();
  q.strokeStyle = 'rgba(235,215,180,.35)'; q.lineWidth = 1.2;
  q.beginPath(); q.moveTo(-kalin * 0.7, -boy * 0.15); q.quadraticCurveTo(-kalin * 0.6, -boy * 0.5, -kalin * 0.4, -boy * 0.85); q.stroke();
  q.strokeStyle = renk;
  for (let i = 0; i < dallar; i++) {   // taça giren dallar
    const y0 = -boy * (0.62 + i * 0.12), yon = i % 2 ? 1 : -1;
    q.lineWidth = kalin * (0.75 - i * 0.12);
    q.beginPath(); q.moveTo(0, y0); q.quadraticCurveTo(yon * kalin * 2.5, y0 - 18, yon * (22 + rnd() * 18), y0 - 34 - rnd() * 16); q.stroke();
  }
  for (let i = 0; i < 9; i++) {   // dipteki ot
    const x = (rnd() * 2 - 1) * kalin * 2.2, h = 4 + rnd() * 6;
    q.fillStyle = zn12Sec(rnd, ['#6aa83f', '#86c454', '#5c9a3a']);
    q.beginPath(); q.moveTo(x - 1.4, 1); q.quadraticCurveTo(x, -h * 0.5, x + (rnd() - 0.5) * 3, -h); q.lineTo(x + 1.4, 1); q.fill();
  }
}
const ZN12_AGAC_TIP = [   // [taç rx, ry, gövde boyu, kalınlık]
  [118, 96, 172, 9], [98, 116, 178, 8.5], [84, 74, 150, 7]];
function zn12AgacSpr(v, parca) {   // parca: 'g' gövde, 'a' arka taç, 'o' ön taç
  const t = ZN12_AGAC_TIP[v], ad = 'agac' + v + parca;
  if (parca === 'g') return zn12Tuval(ad, 2.0, -44, -t[2] - 60, 88, t[2] + 64, q => zn12Govde(q, zn12Rnd(11 + v), t[2], t[3], '#7a5a44', '#5d4434', 3));
  return zn12Tuval(ad, 1.6, -t[0] - 30, -t[1] * 2 - 40, t[0] * 2 + 60, t[1] * 2 + 76, q => zn12Tac(q, zn12Rnd((parca === 'a' ? 101 : 202) + v * 7), t[0], t[1], -t[1] + 6, ZN12_YESIL, parca === 'a' ? 0 : 1));
}
const ZN12_MANOLYA = { koyu: ['#d9a9b8', '#e6bccb', '#d29fb1'], orta: ['#f3dde4', '#f7e6eb', '#efd3dc'],
  acik: ['#fff6f8', '#fdf0f3', '#ffffff'], parlak: ['#ffffff', '#fffafb', '#fff0f4'], golge: '#b98597' };
function zn12KirazSpr(parca, v) {
  if (parca === 'g') return zn12Tuval('kirazg', 2.0, -50, -200, 100, 204, q => {
    const rnd = zn12Rnd(77);
    zn12Govde(q, rnd, 132, 7, '#5e4639', '#46342b', 4);
    q.strokeStyle = '#5e4639'; q.lineWidth = 2.4;   // tacın içinden görünen ince dallar
    for (let i = 0; i < 6; i++) { const yon = i % 2 ? 1 : -1; q.beginPath(); q.moveTo(0, -120 - i * 6); q.quadraticCurveTo(yon * 20, -150 - i * 4, yon * (40 + i * 8), -168 + i * 3); q.stroke(); }
  });
  return zn12Tuval((v ? 'manolya' : 'kiraz') + parca, 1.6, -130, -190, 260, 210, q => {
    const rnd = zn12Rnd((parca === 'a' ? 303 : 404) + (v ? 50 : 0));
    zn12Tac(q, rnd, 104, 74, -64, v ? ZN12_MANOLYA : ZN12_PEMBE, parca === 'a' ? 0 : 1);
  });
}
// söğüt (gölet kıyısı): kalın kısa gövde + kubbe + sarkan dallar. Sarkan katmanlar tepeden aşağı çizilir (0, 0) = tacın tepesi
function zn12SogutSpr(parca) {
  if (parca === 'g') return zn12Tuval('sogutg', 2.0, -60, -250, 120, 254, q => {
    const rnd = zn12Rnd(55);
    zn12Govde(q, rnd, 205, 12, '#6b5241', '#4f3c30', 4);
  });
  return zn12Tuval('sogut' + parca, 1.6, -175, -30, 350, 300, q => {
    const rnd = zn12Rnd(parca === 'a' ? 515 : 616), arka = parca === 'a';
    // sarkan dal: ince sap + boyunca küçülen uzun yapraklar (boncuk perdesi gibi düz şerit olmasın diye boy, aralık, kavis hep farklı)
    const dal = (x0, y0, boy, kav, renk, kal) => {
      const x1 = x0 + kav, y1 = y0 + boy;
      q.strokeStyle = renk[0]; q.lineWidth = kal * 0.35; q.globalAlpha = 0.8;
      q.beginPath(); q.moveTo(x0, y0); q.quadraticCurveTo(x0 + kav * 0.2, y0 + boy * 0.55, x1, y1); q.stroke(); q.globalAlpha = 1;
      const n = Math.floor(boy / 7);
      for (let k = 0; k < n; k++) {
        const u = (k + rnd() * 0.5) / n, x = x0 + kav * u * u, y = y0 + boy * u, w = kal * (1 - u * 0.55);
        zn12El(q, x + (k % 2 ? 1.6 : -1.6) * w * 0.5, y, w * 0.55, w * 1.5, renk[k % renk.length]);
      }
    };
    if (arka) {
      for (let i = 0; i < 46; i++) { const a = Math.PI + rnd() * Math.PI, r = Math.sqrt(rnd()); zn12El(q, Math.cos(a) * r * 128, 64 + Math.sin(a) * r * 62, 18 + rnd() * 16, 14 + rnd() * 10, zn12Sec(rnd, ['#55893a', '#649a40', '#4a7f35'])); }
      for (let i = 0; i < 40; i++) {
        const x0 = (rnd() * 2 - 1) * 140, y0 = 40 + Math.abs(x0) * 0.25 + rnd() * 25, boy = 90 + rnd() * 140 - Math.abs(x0) * 0.3;
        dal(x0, y0, boy, x0 * 0.12 + (rnd() - 0.5) * 14, ['#5b8f3a', '#4f8536', '#669d42'], 4.5 + rnd() * 2);
      }
    } else {
      for (let i = 0; i < 52; i++) {
        const x0 = (rnd() * 2 - 1) * 125, y0 = 34 + Math.abs(x0) * 0.22 + rnd() * 30, boy = 60 + rnd() * 150 - Math.abs(x0) * 0.25;
        dal(x0, y0, boy, x0 * 0.1 + (rnd() - 0.5) * 16, rnd() < 0.5 ? ['#8dbd4e', '#a2cb59', '#7fb247'] : ['#b4d867', '#9fca58', '#c6e27a'], 3.2 + rnd() * 1.8);
      }
      for (let i = 0; i < 34; i++) { const a = Math.PI + rnd() * Math.PI, r = Math.sqrt(rnd()); zn12El(q, Math.cos(a) * r * 112 - 14, 50 + Math.sin(a) * r * 46, 11 + rnd() * 12, 8 + rnd() * 7, zn12Sec(rnd, ['#a7cf5c', '#bfe06d', '#93c552', '#86bb4c'])); }
      for (let i = 0; i < 60; i++) { const a = Math.PI + rnd() * Math.PI, r = Math.sqrt(rnd()); zn12El(q, Math.cos(a) * r * 100 - 24, 40 + Math.sin(a) * r * 38, 1.8 + rnd() * 2, 1.2 + rnd(), '#d9ee93'); }
    }
  });
}
// kampüs fener direği (resimlerdeki gibi koyu direk, beyaz küre)
function zn12FenerSpr() {
  return zn12Tuval('fener', 2.6, -18, -266, 36, 270, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 12, 2.4, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#2f3538'; q.beginPath(); q.moveTo(-7.5, 0); q.lineTo(-6, -17); q.lineTo(6, -17); q.lineTo(7.5, 0); q.closePath(); q.fill();
    q.fillStyle = '#3b4246'; q.fillRect(-4.2, -22, 8.4, 6);
    q.fillStyle = '#353b3f'; q.beginPath(); q.moveTo(-2.6, -22); q.lineTo(-2, -238); q.lineTo(2, -238); q.lineTo(2.6, -22); q.closePath(); q.fill();
    q.fillStyle = 'rgba(150,165,170,.55)'; q.fillRect(-1.6, -230, 0.9, 205);
    q.fillStyle = '#2b3033'; q.fillRect(-4, -244, 8, 7); q.fillRect(-5, -240, 10, 2);
    zn12El(q, 0, -254, 11.5, 11.5, '#f6f3ea');
    q.fillStyle = 'rgba(190,186,176,.6)'; q.beginPath(); q.arc(0, -254, 11.5, -1.2, 1.9); q.arc(-3, -254, 10, 1.9, -1.2, true); q.fill();
    zn12El(q, -4, -258, 3.2, 2.6, '#ffffff');
    q.fillStyle = '#2b3033'; q.fillRect(-2.5, -266.5, 5, 2.4);
  });
}
function zn12FenerIsik() {
  return zn12Tuval('fenerIsik', 1, -80, -80, 160, 160, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 80);
    gr.addColorStop(0, 'rgba(255,236,180,.9)'); gr.addColorStop(0.18, 'rgba(255,214,140,.45)'); gr.addColorStop(0.5, 'rgba(255,190,110,.14)'); gr.addColorStop(1, 'rgba(255,180,100,0)');
    q.fillStyle = gr; q.fillRect(-80, -80, 160, 160);
  });
}
// ahşap bank (cepheden): oturak üstü y = -31
function zn12BankSpr() {
  return zn12Tuval('bank', 2.2, -66, -66, 132, 70, q => {
    const rnd = zn12Rnd(91);
    q.fillStyle = 'rgba(40,60,30,.28)'; q.beginPath(); q.ellipse(0, 0.5, 58, 3.4, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#373c3f';
    for (const sx of [-44, 44]) {   // döküm ayaklar
      q.beginPath(); q.moveTo(sx - 4, 0); q.quadraticCurveTo(sx - 3, -16, sx - 2, -30); q.lineTo(sx + 2, -30); q.quadraticCurveTo(sx + 3, -16, sx + 4, 0); q.closePath(); q.fill();
      q.fillRect(sx - 1.8, -62, 3.6, 32);
      q.beginPath(); q.moveTo(sx - 6, -42); q.quadraticCurveTo(sx, -46, sx + 6, -42); q.lineTo(sx + 6, -39); q.lineTo(sx - 6, -39); q.closePath(); q.fill();   // kolçak
    }
    const tahta = (y, h, a, b) => { q.fillStyle = a; q.fillRect(-56, y, 112, h); q.fillStyle = b; q.fillRect(-56, y, 112, 0.9); q.fillStyle = 'rgba(90,55,30,.3)'; for (let x = -50; x < 56; x += 14 + rnd() * 10) q.fillRect(x, y + 1, 4 + rnd() * 6, 0.5); };
    tahta(-61, 5, '#a87548', '#d4a271'); tahta(-53, 5, '#a87548', '#d4a271'); tahta(-45, 5, '#a87548', '#d4a271');
    tahta(-34, 4, '#c08a58', '#e0b384'); q.fillStyle = '#8a5f3c'; q.fillRect(-56, -30, 112, 3);
    q.fillStyle = 'rgba(60,40,25,.25)'; q.fillRect(-54, -27, 108, 2);
    for (let i = 0; i < 10; i++) { const x = (rnd() * 2 - 1) * 54, h = 4 + rnd() * 5; q.fillStyle = zn12Sec(rnd, ['#6aa83f', '#86c454']); q.beginPath(); q.moveTo(x - 1.3, 1); q.lineTo(x + (rnd() - 0.5) * 2, -h); q.lineTo(x + 1.3, 1); q.fill(); }
  });
}
// yön tabelası simgeleri (beyaz, yazısız); (0, 0) simgenin ortası, ~16 birimlik kutu
function zn12Simge(q, ad) {
  q.fillStyle = '#ffffff'; q.strokeStyle = '#ffffff'; q.lineWidth = 1.6;
  if (ad === 'kitap') { q.beginPath(); q.moveTo(0, -4); q.quadraticCurveTo(-4, -7, -8, -5); q.lineTo(-8, 5); q.quadraticCurveTo(-4, 3, 0, 6); q.quadraticCurveTo(4, 3, 8, 5); q.lineTo(8, -5); q.quadraticCurveTo(4, -7, 0, -4); q.fill(); q.strokeStyle = '#1f4278'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(0, -3.5); q.lineTo(0, 5.4); q.stroke(); }
  else if (ad === 'bisiklet') { q.beginPath(); q.arc(-5, 3, 3.8, 0, ZN12_PI2); q.stroke(); q.beginPath(); q.arc(5.5, 3, 3.8, 0, ZN12_PI2); q.stroke(); q.beginPath(); q.moveTo(-5, 3); q.lineTo(-1.5, -3); q.lineTo(4, -3); q.lineTo(5.5, 3); q.moveTo(-1.5, -3); q.lineTo(0.5, 3); q.lineTo(4, -3); q.moveTo(-3, -5); q.lineTo(0, -5); q.moveTo(4, -3); q.lineTo(3.4, -6); q.lineTo(5.6, -6); q.stroke(); }
  else if (ad === 'ordek') { zn12El(q, -1, 2, 7, 4.2, '#ffffff'); zn12El(q, 4.5, -3.5, 3.2, 3.2, '#ffffff'); q.beginPath(); q.moveTo(7, -3.8); q.lineTo(10, -3); q.lineTo(7, -2.2); q.fill(); q.beginPath(); q.moveTo(-8, 1); q.lineTo(-10, -2); q.lineTo(-6, -1); q.fill(); q.lineWidth = 1; q.beginPath(); q.moveTo(-9, 7.5); q.quadraticCurveTo(-5, 6, -1, 7.5); q.quadraticCurveTo(3, 9, 7, 7.5); q.stroke(); }
  else if (ad === 'agac') { zn12El(q, 0, -2.5, 6.5, 5.5, '#ffffff'); q.fillRect(-1.1, 2, 2.2, 6); }
  else if (ad === 'gunes') { zn12El(q, 0, 0, 3.6, 3.6, '#ffffff'); q.lineWidth = 1.3; for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; q.beginPath(); q.moveTo(Math.cos(a) * 5.4, Math.sin(a) * 5.4); q.lineTo(Math.cos(a) * 7.6, Math.sin(a) * 7.6); q.stroke(); } }
  else if (ad === 'ev') { q.beginPath(); q.moveTo(-7, 0); q.lineTo(0, -6.5); q.lineTo(7, 0); q.lineTo(5, 0); q.lineTo(5, 6.5); q.lineTo(-5, 6.5); q.lineTo(-5, 0); q.closePath(); q.fill(); q.fillStyle = '#1f4278'; q.fillRect(-1.6, 2, 3.2, 4.5); }
  else if (ad === 'ucurtma') { q.beginPath(); q.moveTo(0, -7); q.lineTo(5, -1); q.lineTo(0, 4); q.lineTo(-5, -1); q.closePath(); q.fill(); q.lineWidth = 1; q.beginPath(); q.moveTo(0, 4); q.quadraticCurveTo(3, 6, 0, 8); q.stroke(); }
}
// yön tabelası: direk + ok biçimli lacivert levhalar (her levhada bir simge); yon: +1 sağa, -1 sola
function zn12TabelaSpr(ikonlar, yon) {
  const ad = 'tabela:' + ikonlar.join(',') + ':' + yon;
  return zn12Tuval(ad, 2.2, -42, -172, 84, 176, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 9, 2, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#3b4249'; q.fillRect(-2.4, -164, 4.8, 165); q.fillStyle = 'rgba(160,170,178,.5)'; q.fillRect(-1.6, -160, 0.9, 158);
    q.fillStyle = '#2d3338'; q.fillRect(-3.2, -168, 6.4, 5);
    for (let i = 0; i < ikonlar.length; i++) {
      const y = -158 + i * 26, d = (i % 2 ? -yon : yon) * (ikonlar[i] === 'ev' ? -1 : 1);   // eve dönüş oku geriyi gösterir
      q.save(); q.translate(0, y + 11); q.scale(d, 1);
      q.fillStyle = 'rgba(0,0,0,.18)'; q.beginPath(); q.moveTo(-31, -10); q.lineTo(26, -10); q.lineTo(37, 1); q.lineTo(26, 12); q.lineTo(-31, 12); q.closePath(); q.fill();
      q.fillStyle = '#1f4278'; q.beginPath(); q.moveTo(-32, -11); q.lineTo(25, -11); q.lineTo(36, 0); q.lineTo(25, 11); q.lineTo(-32, 11); q.closePath(); q.fill();
      q.strokeStyle = 'rgba(235,241,248,.85)'; q.lineWidth = 1; q.beginPath(); q.moveTo(-29.5, -8.5); q.lineTo(24, -8.5); q.lineTo(32.5, 0); q.lineTo(24, 8.5); q.lineTo(-29.5, 8.5); q.closePath(); q.stroke();
      q.restore();
      q.save(); q.translate(-3 * d, y + 11); zn12Simge(q, ikonlar[i]); q.restore();
      q.fillStyle = '#e9edf2'; q.fillRect(-1.2, y + 1, 2.4, 2); q.fillRect(-1.2, y + 19, 2.4, 2);   // kelepçeler
    }
  });
}
const ZN12_CICEK_TAKIM = [['#e8574f', '#f6c445', '#ffffff'], ['#9a6fd1', '#f29bb5', '#ffffff'], ['#f6a23c', '#e8574f', '#fff1a8'], ['#f29bb5', '#ffffff', '#c86fc4']];
// beton saksı (gövde) + çiçek tacı (ayrı, rüzgârla eğilir; (0, 0) saksının ağzı)
function zn12SaksiSpr() {
  return zn12Tuval('saksi', 2.6, -40, -34, 80, 36, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 36, 3, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#d3cdc1'; q.beginPath(); q.moveTo(-31, -27); q.lineTo(31, -27); q.lineTo(27, 0); q.lineTo(-27, 0); q.closePath(); q.fill();
    q.fillStyle = '#bab3a5'; q.beginPath(); q.moveTo(12, -27); q.lineTo(31, -27); q.lineTo(27, 0); q.lineTo(10, 0); q.closePath(); q.fill();
    q.fillStyle = '#e8e3d8'; q.fillRect(-34, -31, 68, 5); q.fillStyle = '#c9c2b4'; q.fillRect(-34, -26.5, 68, 1.2);
    q.fillStyle = 'rgba(255,255,255,.4)'; q.fillRect(-34, -31, 68, 0.8);
  });
}
function zn12SaksiCicekSpr(v) {
  return zn12Tuval('saksiC' + v, 2.6, -42, -50, 84, 54, q => {
    const rnd = zn12Rnd(140 + v * 13), P = ZN12_CICEK_TAKIM[v % ZN12_CICEK_TAKIM.length];
    for (let i = 0; i < 26; i++) { const x = (rnd() * 2 - 1) * 30, y = -4 - rnd() * 22 + Math.abs(x) * 0.3, r = 6 + rnd() * 7; zn12El(q, x, y, r, r * 0.8, zn12Sec(rnd, ['#4f8f3a', '#5f9f42', '#3f7d33', '#6fae4a'])); }
    for (let i = 0; i < 6; i++) { const x = (rnd() * 2 - 1) * 34; q.strokeStyle = '#4f8f3a'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(x * 0.6, -6); q.quadraticCurveTo(x * 1.1, -10, x * 1.2, 2); q.stroke(); }   // sarkan sarmaşık
    for (let i = 0; i < 20; i++) {
      const x = (rnd() * 2 - 1) * 27, y = -10 - rnd() * 26 + Math.abs(x) * 0.35, col = zn12Sec(rnd, P), r = 2.4 + rnd() * 1.6;
      for (let k = 0; k < 5; k++) zn12El(q, x + Math.cos(k * 1.257) * r * 0.8, y + Math.sin(k * 1.257) * r * 0.7, r * 0.62, r * 0.5, col);
      zn12El(q, x, y, r * 0.35, r * 0.32, col === '#ffffff' ? '#f4c430' : '#fff3c4');
    }
  });
}
// çiçek tarhı: tuğla kenarlı uzun yatak + laleler, hercai menekşeler (çiçekler ayrı sprite: rüzgârla eğilir)
function zn12TarhSpr() {
  return zn12Tuval('tarh', 2.4, -96, -16, 192, 18, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 92, 3, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#6b4a35'; q.fillRect(-88, -13, 176, 4);
    q.fillStyle = '#b9654a'; q.beginPath(); if (q.roundRect) q.roundRect(-91, -10, 182, 10, 3); else q.rect(-91, -10, 182, 10); q.fill();
    q.fillStyle = '#d98a6c'; q.fillRect(-90, -10, 180, 1.6);
    q.fillStyle = 'rgba(110,50,35,.45)'; for (let x = -84; x < 90; x += 14) q.fillRect(x, -8, 0.7, 7); q.fillRect(-90, -5, 180, 0.6);
  });
}
function zn12TarhCicekSpr(v) {
  return zn12Tuval('tarhC' + v, 2.4, -94, -62, 188, 66, q => {
    const rnd = zn12Rnd(170 + v * 17), P = ZN12_CICEK_TAKIM[(v + 1) % ZN12_CICEK_TAKIM.length];
    for (let i = 0; i < 40; i++) { const x = (rnd() * 2 - 1) * 84, r = 6 + rnd() * 6; zn12El(q, x, -6 - rnd() * 8, r, r * 0.7, zn12Sec(rnd, ['#4f8f3a', '#5f9f42', '#6fae4a'])); }
    for (let i = 0; i < 26; i++) {   // laleler
      const x = -82 + i * 6.4 + (rnd() - 0.5) * 3, h = 26 + rnd() * 22, col = zn12Sec(rnd, P);
      q.strokeStyle = '#4c8a37'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(x, -8); q.quadraticCurveTo(x + (rnd() - 0.5) * 4, -h * 0.5, x, -h); q.stroke();
      zn12El(q, x + 2, -h * 0.45, 1.6, 5, '#5d9c40');
      q.fillStyle = col; q.beginPath(); q.moveTo(x - 3.4, -h); q.quadraticCurveTo(x - 3.8, -h - 6, x - 2, -h - 8); q.lineTo(x, -h - 5); q.lineTo(x + 2, -h - 8); q.quadraticCurveTo(x + 3.8, -h - 6, x + 3.4, -h); q.quadraticCurveTo(x, -h + 2.4, x - 3.4, -h); q.fill();
      q.fillStyle = 'rgba(255,255,255,.35)'; q.fillRect(x - 2.4, -h - 5, 1, 4);
    }
    for (let i = 0; i < 22; i++) {   // önde alçak hercai menekşeler
      const x = (rnd() * 2 - 1) * 84, y = -8 - rnd() * 6, col = zn12Sec(rnd, ['#8a62c9', '#f6c445', '#ffffff', '#e06a8e']);
      for (let k = 0; k < 4; k++) zn12El(q, x + Math.cos(k * 1.57 + 0.6) * 2, y + Math.sin(k * 1.57 + 0.6) * 1.6, 2, 1.6, col);
      zn12El(q, x, y, 0.8, 0.7, '#3b2a50');
    }
  });
}
// budanmış çit: yuvarlak köşeli yeşil kütle, üstü kabarık, minik beyaz çiçekler
function zn12CitSpr() {
  return zn12Tuval('cit', 2.4, -76, -52, 152, 56, q => {
    const rnd = zn12Rnd(250);
    q.fillStyle = 'rgba(40,60,30,.3)'; q.beginPath(); q.ellipse(0, 0.5, 72, 3.4, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#4b8838'; q.beginPath(); if (q.roundRect) q.roundRect(-68, -36, 136, 37, 14); else q.rect(-68, -36, 136, 37); q.fill();
    for (let i = 0; i < 46; i++) { const x = (rnd() * 2 - 1) * 64, y = -34 + rnd() * 10, r = 7 + rnd() * 7; zn12El(q, x, y, r, r * 0.8, zn12Sec(rnd, ['#5f9f42', '#6fae4a', '#79b84e'])); }
    for (let i = 0; i < 24; i++) { const x = (rnd() * 2 - 1) * 56 - 6, y = -38 + rnd() * 6, r = 4 + rnd() * 5; zn12El(q, x, y, r, r * 0.7, zn12Sec(rnd, ['#93c95a', '#a7d35e'])); }
    q.fillStyle = 'rgba(30,60,25,.3)'; q.fillRect(-66, -10, 132, 10);
    for (let i = 0; i < 26; i++) zn12El(q, (rnd() * 2 - 1) * 62, -30 + rnd() * 22, 1.3, 1.1, rnd() < 0.7 ? '#ffffff' : '#ffe48a');
  });
}
// bisiklet parkı: beton altlık, 5 paslanmaz halka, bisiklet simgeli tabela; cati: kampüs bisiklet durağının saçağı
function zn12ParkSpr(cati) {
  return zn12Tuval(cati ? 'parkC' : 'park', 2.0, -146, cati ? -150 : -128, 292, cati ? 154 : 132, q => {
    q.fillStyle = 'rgba(40,60,30,.22)'; q.beginPath(); q.ellipse(0, 1, 138, 3.6, 0, 0, ZN12_PI2); q.fill();
    if (cati) {   // saçak direkleri + ince eğik çatı
      q.fillStyle = '#5d666c'; q.fillRect(-124, -132, 4, 132); q.fillRect(120, -138, 4, 138);
      q.fillStyle = '#9aa3a8'; q.beginPath(); q.moveTo(-142, -128); q.lineTo(142, -138); q.lineTo(142, -132); q.lineTo(-142, -122); q.closePath(); q.fill();
      q.fillStyle = '#e9edef'; q.beginPath(); q.moveTo(-142, -134); q.lineTo(142, -144); q.lineTo(142, -138); q.lineTo(-142, -128); q.closePath(); q.fill();
      q.fillStyle = '#1f4278'; q.fillRect(-142, -128, 284, 3);
    }
    q.fillStyle = '#d7d2c6'; q.fillRect(-134, -5, 268, 5.5); q.fillStyle = '#efebe2'; q.fillRect(-134, -5, 268, 1.2);
    q.fillStyle = 'rgba(120,110,95,.35)'; for (let x = -134; x < 134; x += 44) q.fillRect(x, -5, 0.7, 5.5);
    for (const hx of [-100, -50, 0, 50, 100]) {
      q.strokeStyle = '#8f989e'; q.lineWidth = 3.8; q.beginPath(); q.moveTo(hx - 13, -4); q.lineTo(hx - 13, -42); q.arc(hx, -42, 13, Math.PI, 0); q.lineTo(hx + 13, -4); q.stroke();
      q.strokeStyle = '#eef3f5'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(hx - 13.8, -6); q.lineTo(hx - 13.8, -42); q.arc(hx, -42, 13.8, Math.PI, -Math.PI * 0.35); q.stroke();
    }
    q.fillStyle = '#3b4249'; q.fillRect(126, -100, 4, 100);
    q.fillStyle = '#1f4278'; q.beginPath(); if (q.roundRect) q.roundRect(114, -124, 28, 28, 4); else q.rect(114, -124, 28, 28); q.fill();
    q.strokeStyle = 'rgba(235,241,248,.85)'; q.lineWidth = 1; q.strokeRect(116.5, -121.5, 23, 23);
    q.save(); q.translate(128, -110); zn12Simge(q, 'bisiklet'); q.restore();
  });
}
// yere boyalı bisiklet işareti (yukarıdan görünüş; çizerken dikeyde basılır)
function zn12BisikletIsaret() {
  return zn12Tuval('bisIsaret', 3, -26, -18, 52, 36, q => {
    q.strokeStyle = 'rgba(246,246,240,.92)'; q.fillStyle = 'rgba(246,246,240,.92)'; q.lineWidth = 2.6;
    q.beginPath(); q.arc(-12, 5, 9, 0, ZN12_PI2); q.stroke(); q.beginPath(); q.arc(13, 5, 9, 0, ZN12_PI2); q.stroke();
    q.beginPath(); q.moveTo(-12, 5); q.lineTo(-4, -8); q.lineTo(9, -8); q.lineTo(13, 5); q.moveTo(-4, -8); q.lineTo(1, 5); q.lineTo(9, -8); q.moveTo(-7, -12); q.lineTo(0, -12); q.moveTo(9, -8); q.lineTo(8, -14); q.lineTo(13, -14); q.stroke();
    zn12El(q, 1, 5, 2.4, 2.4, 'rgba(246,246,240,.92)');
  });
}
// ağaç gölgesi: yolun üstüne düşen benekli yumuşak leke
function zn12GolgeSpr() {
  return zn12Tuval('golge', 1, -130, -24, 260, 48, q => {
    const rnd = zn12Rnd(9);
    q.fillStyle = 'rgba(52,70,60,.05)';
    for (let i = 0; i < 70; i++) { const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()); q.beginPath(); q.ellipse(Math.cos(a) * r * 100, Math.sin(a) * r * 13, 12 + rnd() * 16, 3 + rnd() * 4, 0, 0, ZN12_PI2); q.fill(); }
    q.globalCompositeOperation = 'destination-out'; q.fillStyle = 'rgba(0,0,0,.55)';   // yaprak aralarından sızan güneş benekleri
    for (let i = 0; i < 40; i++) { const a = rnd() * ZN12_PI2, r = Math.sqrt(rnd()); q.beginPath(); q.ellipse(Math.cos(a) * r * 96, Math.sin(a) * r * 12, 2 + rnd() * 4, 0.8 + rnd() * 1.2, 0, 0, ZN12_PI2); q.fill(); }
    q.globalCompositeOperation = 'source-over';
  });
}
// gölet kıyısı: yolun ucunu taş/çimen kenarla bitirir (yon +1: kara solda, su sağda; -1 tersi)
function zn12KiyiSpr(yon) {
  return zn12Tuval('kiyi' + yon, 1.6, -40, -14, 80, 186, q => {
    const rnd = zn12Rnd(yon > 0 ? 31 : 37);
    q.scale(yon, 1);
    // kıyı çizgisi (zeminin kesildiği x = 0) boyunca taş set: uzakta küçük, yakında büyük taşlar; yolun ucu taşlara dayanır
    const kx = y => (y - 2) * 0.05;
    q.fillStyle = 'rgba(40,60,50,.25)'; q.beginPath(); q.moveTo(-4, -2); q.lineTo(kx(172) + 16, 172); q.lineTo(kx(172) + 26, 172); q.lineTo(10, -2); q.closePath(); q.fill();   // suya düşen gölge
    for (let i = 0; i < 58; i++) {
      const y = -6 + i * 3.1 + rnd() * 2.5, r = 3.5 + (y + 10) * 0.055 + rnd() * 3.5, x = kx(y) + (rnd() - 0.45) * 7;
      zn12El(q, x, y, r * 1.3, r * 0.8, zn12Sec(rnd, ['#b9b3a3', '#a39d8e', '#cfc9b8', '#968f80', '#c2b9a5']));
      zn12El(q, x - r * 0.35, y - r * 0.3, r * 0.65, r * 0.32, 'rgba(255,255,255,.35)');
    }
    const ot = ['#5a9c3a', '#73b448', '#88c556'];
    for (let i = 0; i < 46; i++) {   // taşların arasında ot (kara tarafında)
      const y = -6 + rnd() * 176, x = kx(y) - 3 - rnd() * 9, h = 5 + rnd() * 9;
      if (y > 706 - 700 && y < 750 - 700) continue;   // yolun hizasında ot yok
      q.fillStyle = zn12Sec(rnd, ot); q.beginPath(); q.moveTo(x - 1.5, y); q.quadraticCurveTo(x + 1, y - h * 0.5, x + 2 + rnd() * 2, y - h); q.lineTo(x + 1.5, y); q.fill();
    }
  });
}
// ═════════════════════ BOTANİK BAHÇESİ SPRITE'LARI ═════════════════════
// çiçek kemeri: beyaz metal kemer, üstü sarmaşık gül (Feza önünden geçer; kemer yolun arka kenarında)
function zn12KemerSpr() {
  return zn12Tuval('kemer', 2.0, -72, -222, 144, 226, q => {
    const rnd = zn12Rnd(707);
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 66, 3, 0, 0, ZN12_PI2); q.fill();
    q.strokeStyle = '#e9ece6'; q.lineWidth = 4;
    q.beginPath(); q.moveTo(-54, 0); q.lineTo(-54, -150); q.arc(0, -150, 54, Math.PI, 0); q.lineTo(54, 0); q.stroke();
    q.strokeStyle = '#d2d6ce'; q.lineWidth = 1.6;
    q.beginPath(); q.moveTo(-46, 0); q.lineTo(-46, -150); q.arc(0, -150, 46, Math.PI, 0); q.lineTo(46, 0); q.stroke();
    for (let y = -20; y > -150; y -= 22) { q.beginPath(); q.moveTo(-54, y); q.lineTo(-46, y - 11); q.moveTo(54, y); q.lineTo(46, y - 11); q.stroke(); }   // kafes
    const yer = u => {   // kemer boyunca nokta (u 0..1: sol dip → tepe → sağ dip)
      if (u < 0.3) return [-50, -u / 0.3 * 150];
      if (u > 0.7) return [50, -(1 - u) / 0.3 * 150];
      const a = Math.PI + (u - 0.3) / 0.4 * Math.PI; return [Math.cos(a) * 50, -150 + Math.sin(a) * 50];
    };
    for (let i = 0; i < 150; i++) {   // sarmaşık yaprakları: tepede yoğun
      const u = rnd(), p = yer(u), yog = u > 0.25 && u < 0.75 ? 1 : 0.6, r = (5 + rnd() * 7) * yog;
      zn12El(q, p[0] + (rnd() - 0.5) * 16, p[1] + (rnd() - 0.5) * 14, r, r * 0.8, zn12Sec(rnd, ['#3f7d33', '#4f9139', '#5f9f42', '#6fae4a']));
    }
    const gul = ['#e8577a', '#f48aa4', '#ffffff', '#d83c5e', '#f9b8c8'];
    for (let i = 0; i < 46; i++) {   // güller
      const u = rnd(), p = yer(u), x = p[0] + (rnd() - 0.5) * 14, y = p[1] + (rnd() - 0.5) * 12, r = 2.8 + rnd() * 2.2, col = zn12Sec(rnd, gul);
      zn12El(q, x, y, r, r * 0.9, col);
      q.strokeStyle = 'rgba(120,30,50,.35)'; q.lineWidth = 0.6; q.beginPath(); q.arc(x, y, r * 0.5, 0.3, 4.5); q.stroke();
      zn12El(q, x - r * 0.3, y - r * 0.35, r * 0.35, r * 0.25, 'rgba(255,255,255,.5)');
    }
  });
}
// dev yapraklı bitkiler: v0 deve tabanı (monstera), v1 muz, v2 fil kulağı
function zn12DevSpr(v) {
  const kut = [[-72, -132, 144, 136], [-86, -206, 172, 210], [-74, -124, 148, 128]][v];
  return zn12Tuval('dev' + v, 2.0, kut[0], kut[1], kut[2], kut[3], q => {
    const rnd = zn12Rnd(900 + v * 7);
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, kut[2] * 0.4, 3, 0, 0, ZN12_PI2); q.fill();
    if (v === 0) {
      const yap = [[-40, -70, -0.7, 34], [38, -78, 0.6, 36], [-10, -104, -0.1, 34], [-58, -40, -1.1, 28], [56, -44, 1.0, 28], [14, -54, 0.3, 30], [-26, -60, -0.4, 26]];
      for (const [x, y, a, r] of yap) {
        q.strokeStyle = '#4f7f35'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(x * 0.3, y * 0.6, x, y + r * 0.6); q.stroke();
        q.save(); q.translate(x, y); q.rotate(a);
        q.fillStyle = zn12Sec(rnd, ['#2f7a3a', '#357f3f', '#2a6f35']);
        q.beginPath(); q.moveTo(0, r * 0.7); q.bezierCurveTo(-r * 1.1, r * 0.4, -r * 1.0, -r * 0.9, 0, -r * 0.75); q.bezierCurveTo(r * 1.0, -r * 0.9, r * 1.1, r * 0.4, 0, r * 0.7); q.fill();
        q.strokeStyle = '#8cc46a'; q.lineWidth = 1.1; q.beginPath(); q.moveTo(0, r * 0.65); q.lineTo(0, -r * 0.7); q.stroke();
        q.strokeStyle = '#1d4a25'; q.lineWidth = 1.5;   // deve tabanının yarıkları
        for (let k = -2; k <= 2; k++) { if (!k) continue; const yy = k * r * 0.22, sx = k < 0 ? -1 : 1; for (const sy of [-1, 1]) { q.beginPath(); q.moveTo(sx * r * 0.3 * sy, yy); q.lineTo(sx * r * 0.85 * sy, yy - r * 0.12); q.stroke(); } }
        zn12El(q, -r * 0.35, -r * 0.35, r * 0.25, r * 0.15, 'rgba(255,255,255,.12)');
        q.restore();
      }
    } else if (v === 1) {
      q.fillStyle = '#7f8f4a'; q.beginPath(); q.moveTo(-9, 0); q.quadraticCurveTo(-7, -60, -5, -112); q.lineTo(5, -112); q.quadraticCurveTo(7, -60, 9, 0); q.closePath(); q.fill();
      q.fillStyle = 'rgba(80,60,35,.35)'; for (let y = -10; y > -110; y -= 14) q.fillRect(-8, y, 16, 2);
      const yap = [[-1, -0.9], [1, -0.75], [-1, -0.35], [1, -0.2], [-1, 0.15], [1, 0.35], [0, -1.4]];
      for (const [yon, a] of yap) {
        const L = 78 + rnd() * 20, ang = (yon === 0 ? -Math.PI / 2 : (yon > 0 ? -0.35 : -Math.PI + 0.35) + a * 0.35 * yon);
        q.save(); q.translate(0, -110); q.rotate(ang);
        q.fillStyle = zn12Sec(rnd, ['#5aa043', '#6db34b', '#4f9a3e']);
        q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(L * 0.5, -16, L, 6); q.quadraticCurveTo(L * 0.55, 14, 0, 2); q.fill();
        q.strokeStyle = '#b9d88a'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(0, 1); q.quadraticCurveTo(L * 0.5, -3, L, 6); q.stroke();
        q.strokeStyle = 'rgba(40,80,30,.45)'; q.lineWidth = 0.8;   // yırtık damarlar
        for (let k = 0.2; k < 0.95; k += 0.12) { const x = L * k; q.beginPath(); q.moveTo(x, -1 - 6 * (1 - Math.abs(k - 0.5))); q.lineTo(x + 5, -9 * (1 - Math.abs(k - 0.5)) - 3); q.stroke(); }
        q.restore();
      }
    } else {
      const yap = [[-44, -64, -0.5, 30], [40, -70, 0.45, 32], [-4, -92, 0, 30], [-62, -30, -0.9, 22], [60, -32, 0.9, 22]];
      for (const [x, y, a, r] of yap) {
        q.strokeStyle = '#6b9a4a'; q.lineWidth = 2; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(x * 0.4, y * 0.7, x, y - r * 0.4); q.stroke();
        q.save(); q.translate(x, y); q.rotate(a);
        q.fillStyle = zn12Sec(rnd, ['#3f8a3e', '#4a9644', '#367d37']);
        q.beginPath(); q.moveTo(0, -r * 0.55); q.bezierCurveTo(-r * 1.1, -r * 0.9, -r * 0.9, r * 0.6, 0, r * 0.95); q.bezierCurveTo(r * 0.9, r * 0.6, r * 1.1, -r * 0.9, 0, -r * 0.55); q.fill();
        q.strokeStyle = 'rgba(200,230,170,.75)'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(0, -r * 0.5); q.lineTo(0, r * 0.9);
        for (let k = 0; k < 4; k++) { const yy = -r * 0.3 + k * r * 0.3; q.moveTo(0, yy); q.lineTo(-r * 0.6, yy - r * 0.2); q.moveTo(0, yy); q.lineTo(r * 0.6, yy - r * 0.2); }
        q.stroke(); q.restore();
      }
    }
    for (let i = 0; i < 10; i++) { const x = (rnd() * 2 - 1) * 30, h = 4 + rnd() * 6; q.fillStyle = zn12Sec(rnd, ['#6aa83f', '#86c454']); q.beginPath(); q.moveTo(x - 1.3, 1); q.lineTo(x + (rnd() - 0.5) * 2, -h); q.lineTo(x + 1.3, 1); q.fill(); }
  });
}
// yükseltilmiş ahşap tarh (gövde) + bitkiler (ayrı, rüzgârla eğilir; (0, 0) toprak hizası = tarhın üstü)
function zn12BTarhSpr() {
  return zn12Tuval('btarh', 2.2, -62, -20, 124, 22, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 60, 3, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#5c4130'; q.fillRect(-56, -17, 112, 3);
    q.fillStyle = '#8b6440'; q.fillRect(-58, -15, 116, 15);
    q.fillStyle = '#a57a50'; q.fillRect(-58, -15, 116, 1.4); q.fillRect(-58, -8, 116, 0.8);
    q.fillStyle = 'rgba(60,40,25,.45)'; q.fillRect(-58, -8.6, 116, 0.6); q.fillRect(-21, -15, 0.7, 15); q.fillRect(24, -15, 0.7, 15);
    q.fillStyle = '#6e4d32'; q.fillRect(-60, -16, 5, 16); q.fillRect(55, -16, 5, 16);
  });
}
function zn12BTarhBitkiSpr(v) {
  return zn12Tuval('btarhB' + v, 2.2, -60, -72, 120, 75, q => {
    const rnd = zn12Rnd(950 + v * 11);
    if (v === 0) {   // lavanta: gümüşi yeşil yumaklar, mor başaklar
      for (let i = 0; i < 9; i++) { const x = -48 + i * 12; zn12El(q, x, -6, 10, 7, zn12Sec(rnd, ['#8ea883', '#9db58f', '#7f9a75'])); }
      for (let i = 0; i < 46; i++) {
        const x = (rnd() * 2 - 1) * 52, h = 24 + rnd() * 22, yat = (rnd() - 0.5) * 6;
        q.strokeStyle = '#7f9a6c'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(x, -6); q.quadraticCurveTo(x + yat * 0.3, -h * 0.5, x + yat, -h); q.stroke();
        for (let k = 0; k < 5; k++) zn12El(q, x + yat * (1 - k * 0.06), -h + k * 2.4, 1.6 - k * 0.1, 1.5, zn12Sec(rnd, ['#8d6fc9', '#a487db', '#7a5cb8']));
      }
    } else if (v === 1) {   // süs otları: kavisli yapraklar + bej püsküller
      for (let i = 0; i < 70; i++) {
        const x = (rnd() * 2 - 1) * 50, h = 20 + rnd() * 30, yat = (rnd() - 0.5) * 26;
        q.strokeStyle = zn12Sec(rnd, ['#8fa95e', '#a7b96f', '#c2c98a', '#7c9a52']); q.lineWidth = 1.1;
        q.beginPath(); q.moveTo(x * 0.5, -2); q.quadraticCurveTo(x * 0.6, -h * 0.7, x * 0.6 + yat, -h); q.stroke();
      }
      for (let i = 0; i < 11; i++) {
        const x = (rnd() * 2 - 1) * 40, h = 44 + rnd() * 22, yat = (rnd() - 0.3) * 10;
        q.strokeStyle = '#b6a679'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(x * 0.5, -2); q.quadraticCurveTo(x * 0.55, -h * 0.6, x * 0.55 + yat, -h); q.stroke();
        q.save(); q.translate(x * 0.55 + yat, -h + 5); q.rotate(yat * 0.03); zn12El(q, 0, 0, 2.6, 8, 'rgba(240,226,190,.95)'); zn12El(q, -0.8, -2, 1.2, 5, 'rgba(255,250,235,.8)'); q.restore();
      }
    } else if (v === 2) {   // sukulent ve kaktüs: rozetler, top kaktüs, minik çiçek
      const rozet = (x, y, r, a, b) => { for (let k = 0; k < 3; k++) for (let i = 0; i < 8; i++) { const an = i / 8 * ZN12_PI2 + k * 0.4, rr = r * (1 - k * 0.3); q.save(); q.translate(x, y); q.rotate(an); zn12El(q, rr * 0.55, 0, rr * 0.5, rr * 0.22, k === 2 ? b : a); q.restore(); } zn12El(q, x, y, r * 0.18, r * 0.18, b); };
      rozet(-34, -6, 12, '#8fb7a0', '#c5dfcf'); rozet(30, -5, 10, '#9fb98a', '#d9e8c4'); rozet(-6, -4, 8, '#a8c4b0', '#f0c8d0');
      q.fillStyle = '#4e8a4a'; q.beginPath(); q.ellipse(10, -16, 11, 14, 0, 0, ZN12_PI2); q.fill();   // top kaktüs
      q.strokeStyle = 'rgba(200,235,190,.7)'; q.lineWidth = 0.8; for (let k = -2; k <= 2; k++) { q.beginPath(); q.ellipse(10, -16, Math.abs(k) * 4 + 0.1, 14, 0, -Math.PI / 2, Math.PI / 2, k < 0); q.stroke(); }
      zn12El(q, 10, -31, 3.4, 2.4, '#f08aa8'); zn12El(q, 10, -31, 1.3, 1, '#ffe28a');
      q.fillStyle = '#5f9a55'; q.beginPath(); if (q.roundRect) q.roundRect(-52, -40, 9, 38, 4.5); else q.rect(-52, -40, 9, 38); q.fill();   // dik kaktüs + kolu
      q.beginPath(); if (q.roundRect) q.roundRect(-58, -30, 8, 14, 4); else q.rect(-58, -30, 8, 14); q.fill(); q.fillRect(-52, -20, 2, 4);
      for (let i = 0; i < 14; i++) zn12El(q, (rnd() * 2 - 1) * 50, -2 - rnd() * 3, 2.4, 1.4, zn12Sec(rnd, ['#c9b99a', '#e0d4bc', '#b2a283']));   // çakıl
    } else {   // karışık yaz çiçekleri: kozmos, zinya
      for (let i = 0; i < 18; i++) { const x = (rnd() * 2 - 1) * 50; zn12El(q, x, -5 - rnd() * 6, 7 + rnd() * 4, 5, zn12Sec(rnd, ['#4f8f3a', '#5f9f42', '#6fae4a'])); }
      for (let i = 0; i < 22; i++) {
        const x = (rnd() * 2 - 1) * 50, h = 18 + rnd() * 30, col = zn12Sec(rnd, ['#f06a8f', '#ffffff', '#f5a623', '#c86fc4', '#ff7a59', '#ffd23c']);
        q.strokeStyle = '#4c8a37'; q.lineWidth = 1; q.beginPath(); q.moveTo(x * 0.7, -4); q.quadraticCurveTo(x * 0.8, -h * 0.5, x, -h); q.stroke();
        for (let k = 0; k < 8; k++) zn12El(q, x + Math.cos(k * 0.785) * 3.2, -h + Math.sin(k * 0.785) * 2.2, 2.2, 1.3, col);
        zn12El(q, x, -h, 1.5, 1.3, '#f2c94c');
      }
    }
  });
}
// bitki levhası: tahta kazık + yeşil yuvarlak levha, beyaz simge (yazısız)
function zn12LevhaSpr(ikon) {
  return zn12Tuval('levha:' + ikon, 2.6, -18, -50, 36, 53, q => {
    q.fillStyle = 'rgba(40,60,30,.25)'; q.beginPath(); q.ellipse(0, 0.5, 6, 1.5, 0, 0, ZN12_PI2); q.fill();
    q.fillStyle = '#7a5638'; q.fillRect(-1.6, -30, 3.2, 31); q.fillStyle = 'rgba(255,230,190,.35)'; q.fillRect(-1.2, -29, 0.8, 28);
    q.fillStyle = '#2f5f33'; q.beginPath(); if (q.roundRect) q.roundRect(-14, -48, 28, 19, 5); else q.rect(-14, -48, 28, 19); q.fill();
    q.fillStyle = '#3f7a42'; q.beginPath(); if (q.roundRect) q.roundRect(-13, -47, 26, 17, 4.5); else q.rect(-13, -47, 26, 17); q.fill();
    q.save(); q.translate(0, -38.5); q.fillStyle = '#ffffff'; q.strokeStyle = '#ffffff'; q.lineWidth = 1;
    if (ikon === 'yaprak') { q.beginPath(); q.moveTo(-6, 4); q.quadraticCurveTo(-6, -6, 6, -5); q.quadraticCurveTo(5, 5, -6, 4); q.fill(); q.strokeStyle = '#3f7a42'; q.beginPath(); q.moveTo(-5, 3.5); q.lineTo(4, -3.5); q.stroke(); }
    else if (ikon === 'cicek') { for (let k = 0; k < 5; k++) zn12El(q, Math.cos(k * 1.257 - 1.57) * 3.4, Math.sin(k * 1.257 - 1.57) * 3.4, 2.4, 2.4, '#ffffff'); zn12El(q, 0, 0, 1.8, 1.8, '#f4c430'); }
    else if (ikon === 'kaktus') { q.beginPath(); if (q.roundRect) q.roundRect(-2, -6, 4, 12, 2); else q.rect(-2, -6, 4, 12); q.fill(); q.beginPath(); q.moveTo(-2, 1); q.lineTo(-5, 1); q.lineTo(-5, -3); q.moveTo(2, -1); q.lineTo(5, -1); q.lineTo(5, -5); q.lineWidth = 2; q.stroke(); }
    else if (ikon === 'kaplumbaga') { q.beginPath(); q.ellipse(-0.5, 0.5, 6, 4.4, 0, Math.PI, 0); q.closePath(); q.fill(); zn12El(q, 7, -0.8, 2.2, 1.8, '#ffffff'); q.fillRect(-5, 0.5, 2, 3); q.fillRect(2, 0.5, 2, 3); q.fillStyle = '#3f7a42'; q.fillRect(-4, -1.6, 7, 0.7); }
    q.restore();
  });
}

// ═════════════════════ ÖN PLAN SPRITE'LARI ═════════════════════
// (0, 0) dip; ekranın en altına oturur. Yükseklik ≤ 40 birim: Feza'nın ayağına (ekranın ~%13 yukarısı) hiç ulaşmaz
function zn12OnSpr(tur, v) {
  const ad = 'on_' + tur + v;
  return zn12Tuval(ad, 2.0, -56, -46, 112, 50, q => {
    const rnd = zn12Rnd(600 + v * 31 + tur.length * 7);
    const ot = ['#3c7c31', '#4c8e38', '#5c9f40', '#6fb048', '#467f35'];
    const tutam = (n, gen, boy) => {
      for (let i = 0; i < n; i++) {
        const x = (rnd() * 2 - 1) * gen, h = boy * (0.55 + rnd() * 0.45) * (1 - Math.abs(x) / gen * 0.35), w = 1.6 + rnd() * 1.8, yat = (rnd() - 0.4) * h * 0.35;
        q.fillStyle = zn12Sec(rnd, ot);
        q.beginPath(); q.moveTo(x - w, 4); q.quadraticCurveTo(x - w * 0.3 + yat * 0.4, -h * 0.55, x + yat, -h); q.quadraticCurveTo(x + w * 0.5 + yat * 0.3, -h * 0.5, x + w, 4); q.fill();
      }
    };
    if (tur === 'tutam') { tutam(26, 30, 30); for (let i = 0; i < 6; i++) { const x = (rnd() * 2 - 1) * 22; q.fillStyle = 'rgba(200,235,140,.6)'; q.fillRect(x, -10 - rnd() * 12, 0.9, 6); } }
    else if (tur === 'cicek') {
      tutam(18, 28, 24);
      const renk = [['#ffffff', '#f4c430'], ['#ffd23c', '#e8a020'], ['#f6a9c3', '#fff1c0']][v % 3];
      for (let i = 0; i < 6; i++) {
        const x = (rnd() * 2 - 1) * 22, h = 18 + rnd() * 14;
        q.strokeStyle = '#4c8e38'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(x, 4); q.quadraticCurveTo(x + 2, -h * 0.5, x + 1, -h); q.stroke();
        for (let k = 0; k < 7; k++) zn12El(q, x + 1 + Math.cos(k * 0.9) * 3.4, -h + Math.sin(k * 0.9) * 2.2, 2.2, 1.3, renk[0]);
        zn12El(q, x + 1, -h, 1.6, 1.4, renk[1]);
      }
    } else if (tur === 'cali') {
      for (let i = 0; i < 30; i++) { const a = Math.PI + rnd() * Math.PI, r = Math.sqrt(rnd()); zn12El(q, Math.cos(a) * r * 44, 4 + Math.sin(a) * r * 30, 9 + rnd() * 9, 7 + rnd() * 6, zn12Sec(rnd, ['#2f6a2c', '#3c7a33', '#4a8a39'])); }
      for (let i = 0; i < 22; i++) { const a = Math.PI + rnd() * Math.PI, r = 0.5 + rnd() * 0.5; zn12El(q, Math.cos(a) * r * 40 - 6, Math.sin(a) * r * 28, 4 + rnd() * 5, 3 + rnd() * 3, zn12Sec(rnd, ['#5e9e43', '#6fae4a', '#82bd52'])); }
      if (v === 1) for (let i = 0; i < 10; i++) zn12El(q, (rnd() * 2 - 1) * 34, -6 - rnd() * 20, 1.8, 1.5, '#f7f2ff');
    } else if (tur === 'saz') {   // kamış: ince uzun yapraklar + kahverengi püsküller
      for (let i = 0; i < 16; i++) {
        const x = (rnd() * 2 - 1) * 26, h = 26 + rnd() * 14, yat = (rnd() - 0.3) * 8;
        q.strokeStyle = zn12Sec(rnd, ['#5f8f3a', '#7aa648', '#4d7d33']); q.lineWidth = 1.6 + rnd() * 1.2;
        q.beginPath(); q.moveTo(x, 4); q.quadraticCurveTo(x + yat * 0.3, -h * 0.5, x + yat, -h); q.stroke();
        if (i % 4 === 0) { zn12El(q, x + yat * 0.9, -h + 4, 1.9, 5, '#7b5236'); }
      }
    } else if (tur === 'egrelti') {   // botanik: kavisli eğrelti yaprakları (yaprakçıklar uca doğru küçülür)
      const renk = ['#2f6e2e', '#3f8236', '#4f9640', '#5aa346'];
      for (let i = 0; i < 7 + v; i++) {
        const yon = i % 2 ? 1 : -1, boy = 26 + rnd() * 14, aci = (0.25 + rnd() * 0.7) * yon, col = zn12Sec(rnd, renk);
        const ux = Math.sin(aci) * boy * 1.1, uy = -Math.cos(aci) * boy + boy * 0.25, kx = ux * 0.3, ky = -Math.cos(aci) * boy * 0.9;
        q.strokeStyle = col; q.lineWidth = 1.1; q.beginPath(); q.moveTo(0, 4); q.quadraticCurveTo(kx, ky, ux, uy); q.stroke();
        q.fillStyle = col;
        for (let k = 1; k < 11; k++) {
          const u = k / 11, bx = 2 * (1 - u) * u * kx + u * u * ux, by = (1 - u) * (1 - u) * 4 + 2 * (1 - u) * u * ky + u * u * uy, w = 5.5 * (1 - u * 0.75);
          q.beginPath(); q.ellipse(bx - w * 0.5, by - 0.5, w * 0.55, 1.3, -0.5 * yon, 0, ZN12_PI2); q.fill();
          q.beginPath(); q.ellipse(bx + w * 0.5, by - 0.5, w * 0.55, 1.3, 0.5 * yon, 0, ZN12_PI2); q.fill();
        }
      }
    } else if (tur === 'kir') {   // tepe: gelincik, peygamber çiçeği, papatya
      tutam(16, 30, 26);
      const renk = ['#e5493b', '#5a7fe0', '#ffffff', '#e5493b', '#f6d04d'];
      for (let i = 0; i < 7; i++) {
        const x = (rnd() * 2 - 1) * 26, h = 22 + rnd() * 16, col = renk[(i + v) % renk.length];
        q.strokeStyle = '#4c8e38'; q.lineWidth = 1.1; q.beginPath(); q.moveTo(x, 4); q.quadraticCurveTo(x - 2, -h * 0.5, x, -h); q.stroke();
        for (let k = 0; k < 5; k++) zn12El(q, x + Math.cos(k * 1.257) * 2.6, -h + Math.sin(k * 1.257) * 1.8, 2.4, 1.7, col);
        zn12El(q, x, -h, 1.1, 1, col === '#e5493b' ? '#2e2420' : '#f2bf3a');
      }
    }
  });
}

// ═════════════════════ YERLEŞİM ═════════════════════
// [tip, sütun, ek]; tipler: agac (v 0 geniş, 1 uzun, 2 genç), kiraz, sogut, fener, bank, tabela (ikon listesi), saksi, tarh, cit, park
const ZN12_YERLESIM = [
  // lojman (sabah): lojman binası ~c30 görünsün diye ortası seyrek
  ['agac', 2, { v: 0, s: 1.05 }], ['fener', 7], ['saksi', 11, { v: 0 }], ['kiraz', 17, { s: 0.92 }], ['fener', 24],
  ['saksi', 36, { v: 1 }], ['fener', 40], ['kiraz', 43, { s: 0.8 }], ['bank', 47], ['fener', 53], ['agac', 57, { v: 2, s: 0.85 }],
  ['tabela', 60, { ikon: ['bisiklet', 'kitap'] }], ['park', 64],
  // yol1: ağaçlı uzun yol; FENS (~c125) ve Üniversite Merkezi (~c225) önünde yalnız alçak çit/tarh + fener
  ['fener', 70], ['agac', 76, { v: 0 }], ['fener', 83], ['agac', 90, { v: 1, s: 0.92 }], ['fener', 97], ['agac', 104, { v: 2, s: 0.85 }],
  ['tabela', 110, { ikon: ['kitap', 'ordek'] }], ['fener', 116], ['cit', 122], ['tarh', 130, { v: 0 }], ['fener', 137], ['agac', 145, { v: 0, s: 0.8 }],
  ['fener', 152], ['agac', 160, { v: 1, s: 0.8 }], ['fener', 167], ['tarh', 176, { v: 2 }], ['kiraz', 186, { s: 0.8 }], ['fener', 194],   // FENS + Üniversite Merkezi görünsün (BINA isteği)
  ['agac', 205, { v: 2, s: 0.85 }], ['fener', 211], ['cit', 219], ['tarh', 228, { v: 1 }], ['fener', 235], ['bank', 241], ['agac', 248, { v: 0 }],
  ['fener', 255], ['kiraz', 262], ['fener', 269], ['agac', 276, { v: 1, s: 0.95 }], ['bank', 283], ['fener', 288], ['park', 296],
  // FASS çimenliği (~c375; uçurtma 315–440: yalnız alçak şeyler + fener)
  ['tabela', 302, { ikon: ['ucurtma', 'kitap'] }], ['kiraz', 309], ['fener', 317], ['saksi', 325, { v: 2 }], ['cit', 335], ['bank', 352],
  ['fener', 360], ['tarh', 372, { v: 2 }], ['saksi', 386, { v: 3 }], ['fener', 394], ['agac', 405, { v: 2, s: 0.82 }], ['cit', 416],
  ['kiraz', 418, { s: 0.7 }], ['fener', 428], ['saksi', 446, { v: 0 }],   // SUNUM (BINA, c441) önü açık
  // Bilgi Merkezi: ETKINLIK'in havuzu oyun düzleminde 468–548 (y 656–716) → bu aralıkta orta plan yok
  ['tabela', 454, { ikon: ['kitap', 'ordek'] }], ['bank', 460], ['fener', 465], ['fener', 550], ['bank', 553.4],
  // botanik bahçesi (560–700): giriş kemeri, levhalar, tarhlar, dev yapraklı bitkiler; kaplumbağa göleti (BOTANIK) 610–654 boş,
  // arkadaki sera (BINA, c645) görünsün diye 600–690 alçak bitkilerle seyrek
  ['kemer', 563], ['levha', 567, { ikon: 'yaprak' }], ['fener', 571], ['btarh', 576, { v: 0 }], ['bank', 582], ['dev', 588, { v: 1 }],
  ['kiraz', 593, { v: 1, s: 0.75 }], ['btarh', 598, { v: 1 }], ['levha', 602, { ikon: 'kaplumbaga' }], ['dev', 606, { v: 0 }],
  ['dev', 659, { v: 2 }], ['levha', 662, { ikon: 'cicek' }], ['kemer', 668], ['btarh', 672, { v: 2 }], ['bank', 675], ['fener', 680],
  ['agac', 685, { v: 1, s: 0.9 }], ['btarh', 691, { v: 3 }], ['levha', 695, { ikon: 'kaktus' }], ['park', 700, { cati: true }],
  // yol2: göletin yokuşu (kule-çevre önü seyrek)
  ['tabela', 707, { ikon: ['ordek', 'gunes'] }], ['fener', 712], ['agac', 719, { v: 0 }], ['agac', 728, { v: 1, s: 0.9 }], ['fener', 736],
  ['tarh', 747, { v: 3 }], ['fener', 756], ['kiraz', 764], ['kiraz', 772, { s: 0.85 }], ['fener', 780], ['agac', 787, { v: 2, s: 0.85 }],
  ['tabela', 793, { ikon: ['ordek'] }], ['park', 800],
  // büyük gölet kıyısı (830–1005 su: boş)
  ['fener', 807], ['sogut', 817], ['bank', 824], ['sogut', 1012], ['fener', 1019], ['bank', 1025],
  // gün batımı tepesi (piknik 1060–1084 boş)
  ['agac', 1040, { v: 0, s: 1.15 }], ['cit', 1049, { dogal: true }], ['agac', 1093, { v: 1, s: 1.12 }]
];
// derinlik: önce ağaçlar, sonra direkler, en önde alçak şeyler
const ZN12_Z = { agac: 0, kiraz: 0, sogut: 0, kemer: 1, dev: 1, fener: 1, tabela: 1, park: 2, bank: 2, cit: 3, saksi: 3, tarh: 3, btarh: 3, levha: 4 };
const ZN12_GEN = { agac: 150, kiraz: 140, sogut: 175, fener: 30, tabela: 50, park: 150, bank: 70, cit: 80, saksi: 45, tarh: 100, kemer: 75, dev: 85, btarh: 70, levha: 20 };
function zn12Kur() {
  const L = ZN12.ogeler; L.length = 0; ZN12_BANK.length = 0; ZN12_AGAC.length = 0; ZN12.parklar.length = 0;
  for (let i = 0; i < ZN12_YERLESIM.length; i++) {
    const r = ZN12_YERLESIM[i], ek = r[2] || {}, x = r[1] * T + T / 2;
    const o = { tip: r[0], x, y: ZN12_TABAN, s: ek.s || 1, v: ek.v || 0, ph: zn12Hash(i * 3.7) * ZN12_PI2, ikon: ek.ikon || null, cati: !!ek.cati,
      yon: 1, z: ZN12_Z[r[0]] || 0, gen: (ZN12_GEN[r[0]] || 80) * (ek.s || 1), dusT: zn12Hash(i * 5.3) * 2, egik: 0, egikH: 0 };
    if (o.tip === 'agac' || o.tip === 'kiraz' || o.tip === 'sogut') o.y = ZN12_TABAN - 2;   // ağaçlar bir tık geride
    if (o.tip === 'bank') ZN12_BANK.push({ x, y: ZN12_TABAN - 31, w: 112 });
    if (o.tip === 'agac') { const t = ZN12_AGAC_TIP[o.v]; ZN12_AGAC.push({ x, y0: o.y, y1: o.y - t[2] * o.s, r: t[3] * 0.8 * o.s }); }
    if (o.tip === 'park') ZN12.parklar.push(r[1]);
    L.push(o);
  }
  L.sort((a, b) => a.z - b.z || a.x - b.x);
  ZN12.hazir = true;
}
ZN12.parkHalka = c => { const x = c * T + T / 2; return [x - 100, x - 50, x, x + 50, x + 100]; };

// önbellekleri boşta kur: karede ~3 ms (görünen tür/sprite gerekirse çizim anında zaten kurulur)
function zn12KuyrukDoldur() {
  const K = ZN12.kuyruk;
  // Botanik patikası ve ahşap iskele de giriş perdesinde hazırlanır; ilk karşılaşmada büyük tuval çizilmez.
  for (const t of ['kaldirim', 'bisiklet', 'meydan', 'cakil', 'iskele', 'kosu', 'patika']) K.push(() => zn12Zemin(t));
  for (let v = 0; v < 3; v++) for (const p of ['g', 'a', 'o']) K.push(() => zn12AgacSpr(v, p));
  for (const p of ['g', 'a', 'o']) { K.push(() => zn12KirazSpr(p, 0)); K.push(() => zn12SogutSpr(p)); }
  for (const p of ['a', 'o']) K.push(() => zn12KirazSpr(p, 1));
  K.push(zn12KemerSpr, zn12BTarhSpr); for (let v = 0; v < 3; v++) K.push(() => zn12DevSpr(v)); for (let v = 0; v < 4; v++) K.push(() => zn12BTarhBitkiSpr(v));
  K.push(zn12FenerSpr, zn12FenerIsik, zn12BankSpr, zn12SaksiSpr, zn12TarhSpr, zn12CitSpr, () => zn12ParkSpr(false), () => zn12ParkSpr(true),
    zn12BisikletIsaret, zn12GolgeSpr, zn12MalcSpr, () => zn12KiyiSpr(1), () => zn12KiyiSpr(-1), zn12YaprakSpr);
  for (let v = 0; v < 4; v++) { K.push(() => zn12SaksiCicekSpr(v)); K.push(() => zn12TarhCicekSpr(v)); }
  for (const t of ['tutam', 'cicek', 'cali', 'saz', 'kir', 'egrelti']) for (let v = 0; v < 3; v++) K.push(() => zn12OnSpr(t, v));
  for (const o of ZN12.ogeler) { if (o.tip === 'tabela') K.push(() => zn12TabelaSpr(o.ikon, o.yon)); if (o.tip === 'levha') K.push(() => zn12LevhaSpr(o.ikon)); }
}
function zn12Isit(butceMs) {
  const K = ZN12.kuyruk; if (!K.length) return true;
  const t0 = performance.now();
  while (K.length && performance.now() - t0 < (butceMs || 3)) { const f = K.shift(); try { f(); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('zemin12.isit', e); } }
  return !K.length;
}

// ═════════════════════ DÜŞEN KİRAZ YAPRAKLARI / YAPRAKLAR (sabit havuz) ═════════════════════
const ZN12_PN = 64;
const ZN12_P = { x: new Float32Array(ZN12_PN), y: new Float32Array(ZN12_PN), vy: new Float32Array(ZN12_PN), yer: new Float32Array(ZN12_PN),
  a: new Float32Array(ZN12_PN), va: new Float32Array(ZN12_PN), ph: new Float32Array(ZN12_PN), omur: new Float32Array(ZN12_PN),
  tur: new Uint8Array(ZN12_PN), canli: new Uint8Array(ZN12_PN), sira: 0 };
function zn12YaprakSpr() {
  zn12Tuval('yaprak0', 4, -4, -3, 8, 6, q => { zn12El(q, 0, 0, 3.4, 2.1, '#f7c4d2'); zn12El(q, -0.8, -0.4, 1.8, 1, '#fde6ee'); });
  zn12Tuval('yaprak1', 4, -4, -3, 8, 6, q => { zn12El(q, 0, 0, 3.6, 1.9, '#a9cf55'); q.strokeStyle = '#7fae3f'; q.lineWidth = 0.4; q.beginPath(); q.moveTo(-3, 0); q.lineTo(3, 0); q.stroke(); });
  return zn12Tuval('yaprak2', 4, -4, -3, 8, 6, q => { zn12El(q, 0, 0, 3.6, 1.9, '#e2c250'); });
}
function zn12ParcaAt(x, y, tur) {
  const P = ZN12_P, i = P.sira; P.sira = (P.sira + 1) % ZN12_PN;
  P.x[i] = x; P.y[i] = y; P.vy[i] = 16 + Math.random() * 12; P.yer[i] = ZN12_YOL0 + 2 + Math.random() * (ZN12_YOL1 - ZN12_YOL0 + 30);
  P.a[i] = Math.random() * ZN12_PI2; P.va[i] = (Math.random() - 0.5) * 5; P.ph[i] = Math.random() * ZN12_PI2; P.omur[i] = 2.6;
  P.tur[i] = tur; P.canli[i] = 1;
}
function zn12Parcalar(dt, tm, L, R) {
  const P = ZN12_P;
  const s0 = ZN12.spr.get('yaprak0'), s1 = ZN12.spr.get('yaprak1'), s2 = ZN12.spr.get('yaprak2'); if (!s0 || !s1 || !s2) return;
  let n = 0;
  for (let i = 0; i < ZN12_PN; i++) {
    if (!P.canli[i]) continue;
    const r = zn12Ruzgar(P.x[i], tm);
    if (P.y[i] < P.yer[i]) {   // süzülüyor: rüzgârla sağa, salınarak
      P.x[i] += (r * 22 + Math.sin(tm * 2.2 + P.ph[i]) * 14) * dt; P.y[i] += P.vy[i] * dt; P.a[i] += P.va[i] * dt;
      if (P.y[i] >= P.yer[i]) P.y[i] = P.yer[i];
    } else { P.omur[i] -= dt; if (P.omur[i] <= 0) { P.canli[i] = 0; continue; } }   // yere kondu: biraz durur, solar
    if (P.x[i] < L - 40 || P.x[i] > R + 300) { P.canli[i] = 0; continue; }
    const spr = P.tur[i] === 0 ? s0 : P.tur[i] === 1 ? s1 : s2, yerde = P.y[i] >= P.yer[i];
    const ca = Math.cos(P.a[i]), sa = Math.sin(P.a[i]), cev = yerde ? 1 : Math.cos(tm * 3.1 + P.ph[i]) * 0.8 + 0.2;   // dönerken incelip kalınlaşır
    g.globalAlpha = yerde ? Math.min(1, P.omur[i] / 1.2) : 1;
    g.setTransform(ca * S, sa * S * cev, -sa * S, ca * S * cev, (P.x[i] - cam.x) * S, (P.y[i] - cam.y) * S);
    g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h); n++;
  }
  g.globalAlpha = 1; ZN12.say.parca = n;
}

// ═════════════════════ ÇİZİM ═════════════════════
function zn12OgeCiz(o, tm, gunes, aksamIsik) {
  const r = zn12Ruzgar(o.x, tm), rGec = zn12Ruzgar(o.x - 60, tm - 0.35);
  const s = o.s;
  if (o.tip === 'agac' || o.tip === 'kiraz') {
    const t = o.tip === 'agac' ? ZN12_AGAC_TIP[o.v] : null, boy = (t ? t[2] : 132) * s;
    const gv = o.tip === 'agac' ? zn12AgacSpr(o.v, 'g') : zn12KirazSpr('g', 0);
    const ta = o.tip === 'agac' ? zn12AgacSpr(o.v, 'a') : zn12KirazSpr('a', o.v);
    const to = o.tip === 'agac' ? zn12AgacSpr(o.v, 'o') : zn12KirazSpr('o', o.v);
    const e1 = (0.012 + 0.02 * rGec) * (o.tip === 'kiraz' ? 1.2 : 1) + Math.sin(tm * 1.3 + o.ph) * 0.006;   // arka kütle: geç, yavaş
    const e2 = (0.016 + 0.026 * r) * (o.tip === 'kiraz' ? 1.2 : 1) + Math.sin(tm * 2.1 + o.ph * 1.7) * 0.009;   // ön kümeler: çabuk
    o.egik = e2;
    zn12Koy(gv, o.x, o.y, s, -e1 * 0.15);
    const ux = o.x + e1 * 0.15 * boy, uy = o.y - boy;
    zn12Koy(ta, ux, uy, s, -e1);
    zn12Koy(to, ux, uy, s, -e2);
    return;
  }
  if (o.tip === 'sogut') {
    const gv = zn12SogutSpr('g'), ta = zn12SogutSpr('a'), to = zn12SogutSpr('o'), boy = 205 * s;
    const e1 = 0.02 + 0.04 * rGec + Math.sin(tm * 1.1 + o.ph) * 0.01, e2 = 0.03 + 0.06 * r + Math.sin(tm * 1.7 + o.ph) * 0.015;
    zn12Koy(gv, o.x, o.y, s, -0.002);
    const ty = o.y - boy - 60 * s;   // tacın tepesi
    zn12Koy(ta, o.x, ty, s, e1);     // sarkan dallar: dipleri rüzgârla sağa savrulur
    zn12Koy(to, o.x, ty, s, e2);
    return;
  }
  if (o.tip === 'fener') {
    const spr = zn12FenerSpr(); zn12Koy(spr, o.x, o.y, s, 0);
    // dokunulan fener (gündüz de) bir an tatlı tatlı yanar: önce parlayıp büyür, sonra yavaşça söner
    if (o.yan > 0) o.yan = Math.max(0, o.yan - ZN12.dt / 2.4);
    const yan = o.yan > 0 ? Math.min(1, o.yan * 1.6) : 0, pop = o.yan > 0.85 ? 1 + (o.yan - 0.85) * 2.2 : 1;
    const guc = Math.max(aksamIsik * 0.9, yan);
    if (guc > 0.01) {
      const isik = zn12FenerIsik(), tit = 1 + Math.sin(tm * 3 + o.ph) * 0.03;
      g.globalAlpha = guc; zn12Koy(isik, o.x, o.y - 254 * s, s * 0.7 * tit * pop, 0); g.globalAlpha = 1;
    }
    return;
  }
  if (o.tip === 'bank') { zn12Koy(zn12BankSpr(), o.x, o.y, s, 0); return; }
  if (o.tip === 'tabela') { zn12Koy(zn12TabelaSpr(o.ikon, o.yon), o.x, o.y, s, 0); return; }
  if (o.tip === 'park') { zn12Koy(zn12ParkSpr(o.cati), o.x, o.y, s, 0); return; }
  if (o.tip === 'cit') { zn12Koy(zn12CitSpr(), o.x, o.y, s, -(0.006 + 0.01 * r)); return; }
  if (o.tip === 'saksi') {
    zn12Koy(zn12SaksiSpr(), o.x, o.y, s, 0);
    zn12Koy(zn12SaksiCicekSpr(o.v), o.x, o.y - 30 * s, s, -(0.03 + 0.05 * r + Math.sin(tm * 2.6 + o.ph) * 0.02));
    return;
  }
  if (o.tip === 'kemer') { zn12Koy(zn12KemerSpr(), o.x, o.y, s, -(0.004 + 0.008 * r)); return; }
  if (o.tip === 'dev') { zn12Koy(zn12DevSpr(o.v), o.x, o.y, s, -(0.025 + 0.045 * r + Math.sin(tm * 1.9 + o.ph) * 0.02) * (o.v === 1 ? 0.7 : 1)); return; }
  if (o.tip === 'levha') { zn12Koy(zn12LevhaSpr(o.ikon), o.x, o.y + 2, s, 0); return; }
  if (o.tip === 'btarh') {
    zn12Koy(zn12BTarhSpr(), o.x, o.y, s, 0);
    zn12Koy(zn12BTarhBitkiSpr(o.v), o.x, o.y - 15 * s, s, o.v === 2 ? -0.004 : -(0.04 + 0.07 * r + Math.sin(tm * 2.0 + o.ph) * 0.03) * (o.v === 1 ? 1.5 : 1));
    return;
  }
  if (o.tip === 'tarh') {
    zn12Koy(zn12TarhSpr(), o.x, o.y, s, 0);
    zn12Koy(zn12TarhCicekSpr(o.v), o.x, o.y - 9 * s, s, -(0.04 + 0.07 * r + Math.sin(tm * 2.3 + o.ph) * 0.025));
  }
}
function zn12Golgeler(L, R, tm, gunes) {
  const spr = zn12GolgeSpr(), kay = (0.5 - gunes) * 70;   // güneş solda → gölge sağa
  for (let i = 0; i < ZN12.ogeler.length; i++) {
    const o = ZN12.ogeler[i];
    if (o.x < L - 260 || o.x > R + 260) continue;
    if (o.tip === 'agac' || o.tip === 'kiraz' || o.tip === 'sogut') {
      const w = (o.tip === 'agac' ? ZN12_AGAC_TIP[o.v][0] / 118 : o.tip === 'kiraz' ? 0.85 : 1.1) * o.s, sal = (o.egik || 0) * 600;
      g.globalAlpha = 0.8;
      g.setTransform(S * w, 0, 0, S * 0.9, (o.x + kay + sal - cam.x) * S, (728 - cam.y) * S);
      g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h);
    } else if (o.tip === 'fener' || o.tip === 'tabela') {
      g.globalAlpha = 0.5;
      g.setTransform(S * 0.09, 0, 0, S * 0.45, (o.x + kay * 0.6 - cam.x) * S, (716 - cam.y) * S);
      g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h);
    }
  }
  g.globalAlpha = 1;
}
// gölet kıyıları: zemin bandının iki ucunu taş/çimen kıyıyla bitirir (GOLET'in iskeleleri bunların üstünde)
// göletçik kolunun üstünde iskelenin suya inen kazıkları (suyun ÜSTÜNDE; su BOTANIK'in)
function zn12IskeleAyak(L, R, alt) {
  const O = ZN12_ONSU; if (typeof bt12OnSuCiz !== 'function' || !(R > O.x0 && L < O.x1)) return;
  zn12Dunya();
  for (let x = Math.ceil(O.x0 / 128) * 128 + 30; x < O.x1 - 8; x += 128) {
    if (x < L - 10 || x > R + 10) continue;
    g.fillStyle = '#5e4129'; g.fillRect(x, O.y - 1, 6, alt - O.y + 2);
    g.fillStyle = 'rgba(255,225,180,.25)'; g.fillRect(x + 0.8, O.y, 1.2, alt - O.y);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x - 2, 772, 10, 1.2);   // su çizgisi
  }
  g.fillStyle = 'rgba(30,45,40,.28)'; g.fillRect(Math.max(L, O.x0), O.y, Math.min(R, O.x1) - Math.max(L, O.x0), 4);   // iskelenin suya düşen gölgesi
}
// lojman çiçek tarhının (ETKINLIK k12Bahce, x 500..2420) toprağı: yolun arkasında ince malç şeridi, uçları yumuşak
const ZN12_MALC = { x0: 500, x1: 2420 };
function zn12MalcSpr() {
  return zn12Tuval('malc', 2.4, 0, 694, 256 + ZN12_TP, 14, q => {
    const rnd = zn12Rnd(808), ust = x => 698.5 + Math.sin(x * ZN12_PI2 * 5 / 256) * 0.8 + Math.sin(x * ZN12_PI2 * 13 / 256 + 1) * 0.5;
    q.fillStyle = '#6e4c36'; q.beginPath(); q.moveTo(0, 705);
    for (let x = 0; x <= 256 + ZN12_TP; x += 4) q.lineTo(x, ust(x));
    q.lineTo(256 + ZN12_TP, 705); q.closePath(); q.fill();
    for (let i = 0; i < 160; i++) { const x = rnd() * 256, y = 699 + rnd() * 5.5; for (const xx of [x, x + 256]) zn12El(q, xx, y, 0.8 + rnd() * 1.6, 0.5 + rnd() * 0.6, zn12Sec(rnd, ['#8a6247', '#5a3d2b', '#9b7356', '#4e3424'])); }
    q.fillStyle = 'rgba(255,230,200,.15)'; q.fillRect(0, 698, 256 + ZN12_TP, 1);
  });
}
function zn12Malc(L, R) {
  const a = Math.max(L, ZN12_MALC.x0), b = Math.min(R, ZN12_MALC.x1); if (!(a < b)) return;
  const spr = zn12MalcSpr(); zn12Dunya();
  for (let x = Math.floor(a / 256) * 256; x < b; x += 256) {
    const ux = x + 128, al = zn12Pur(ux, ZN12_MALC.x0, ZN12_MALC.x0 + 200) * (1 - zn12Pur(ux, ZN12_MALC.x1 - 200, ZN12_MALC.x1));
    if (al <= 0.01) continue;
    g.globalAlpha = al; g.drawImage(spr, x, 694, 256 + 1, 14);
  }
  g.globalAlpha = 1;
}
function zn12Kiyilar(L, R) {
  if (ZN12_SU0 > L - 50 && ZN12_SU0 < R + 50) zn12Koy(zn12KiyiSpr(1), ZN12_SU0, 700, 1, 0);
  if (ZN12_SU1 > L - 50 && ZN12_SU1 < R + 50) zn12Koy(zn12KiyiSpr(-1), ZN12_SU1, 700, 1, 0);
}

// ana kanca: gölet suyu → zemin → derzler → kıyılar → gölgeler → orta plan → düşen yapraklar
function zn12World(tm) {
  if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 12) return;
  const kare = zn12Kare(); if (kare === ZN12.sonKare) return;   // sarmalayıcı + ARKA'nın çağrısı aynı karede çakışırsa bir kez
  ZN12.sonKare = kare;
  ZN12.dt = ZN12.sonTm < 0 ? 0.016 : clamp(tm - ZN12.sonTm, 0, 0.05); ZN12.sonTm = tm;
  if (!ZN12.hazir) zn12Kur();
  if (!ZN12.kuyrukDolu) { ZN12.kuyrukDolu = true; zn12KuyrukDoldur(); }
  zn12Isit(3);
  ZN12.say.zemin = 0; ZN12.say.oge = 0;
  const VHg = VH / cam.zoom, L = cam.x - 10, R = cam.x + VW + 10, alt = cam.y + VHg + 4, cx = cam.x + VW / 2;
  zn12Dunya(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  if (typeof gl12SuCiz === 'function' && R > ZN12_SU0 - 200 && L < ZN12_SU1 + 200) {
    try { gl12SuCiz(tm); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('gl12SuCiz', e); }
    zn12Dunya(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  zn12OnSu();
  if (typeof bt12OnSuCiz === 'function' && R > ZN12_ONSU.x0 - 100 && L < ZN12_ONSU.x1 + 100) {
    try { bt12OnSuCiz(tm); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('bt12OnSuCiz', e); }
    zn12Dunya(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  zn12ZeminCiz(L, R, alt);
  zn12IskeleAyak(L, R, alt);
  zn12Derzler(L, R, cx);
  zn12Kiyilar(L, R);
  zn12Malc(L, R);
  // fenerler gün batımına doğru yanar (gölet sonu ~gün .85'ten), finalde akşam inince tam
  const gunes = zn12GunesX(), F = typeof K12FINAL !== 'undefined' && K12FINAL ? K12FINAL : null;
  const aksam = Math.max(zn12Pur(zn12Gun(), 0.8, 0.95) * 0.85, zn12Pur(zn12Guc(), 0.55, 0.85), F && F.aktif ? clamp(F.aksam || 0, 0, 1) : 0);
  zn12Golgeler(L, R, tm, gunes);
  // orta plan
  const dt = ZN12.dt;
  for (let i = 0; i < ZN12.ogeler.length; i++) {
    const o = ZN12.ogeler[i];
    if (o.x < L - o.gen || o.x > R + o.gen) continue;
    zn12OgeCiz(o, tm, gunes, aksam); ZN12.say.oge++;
    // kiraz ağaçlarından pembe yapraklar, yeşil ağaçlardan ara sıra yaprak (esintide daha çok)
    if ((o.tip === 'kiraz' || o.tip === 'agac' || o.tip === 'sogut') && dt > 0) {
      o.dusT -= dt * (0.6 + zn12Ruzgar(o.x, tm) * 0.8);
      if (o.dusT <= 0) {
        const kiraz = o.tip === 'kiraz', rx = (kiraz ? 95 : o.tip === 'sogut' ? 120 : ZN12_AGAC_TIP[o.v][0]) * o.s;
        const ty = o.tip === 'sogut' ? o.y - 120 * o.s : o.y - ((kiraz ? 132 : ZN12_AGAC_TIP[o.v][2]) + 40) * o.s;
        zn12ParcaAt(o.x + (Math.random() * 2 - 1) * rx * 0.8, ty - Math.random() * 60 * o.s, kiraz ? 0 : Math.random() < 0.7 ? 1 : 2);
        o.dusT = kiraz ? 0.35 + Math.random() * 0.9 : 2.5 + Math.random() * 5;
      }
    }
  }
  zn12Dunya();
  zn12Parcalar(dt, tm, L, R);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}

// ön plan: ekranın en alt bandında, kameradan biraz hızlı kayan (1.15) çimen tutamları, çiçekler, çalı kenarları
const ZN12_ON_ARA = 58;
function zn12OnTur(i, ev) {   // i. öğenin türü/varyantı (yerine göre); -1 = boş
  const h = zn12Hash(i * 1.931 + 7.7);
  if (ev > ZN12_SU0 && ev < ZN12_SU1) {   // gölet: yalnız iki uçta kamış, ortası boş (kayık ve nilüferler görünsün)
    if (ev < 838 * T || ev > 997 * T) return h < 0.7 ? 30 + (i % 2) : -1;
    return -1;
  }
  if (h < (ev > 12 * T && ev < 60 * T ? 0.5 : 0.18)) return -1;   // lojman tarhında ön sıra çiçekleri ETKINLIK'in: seyrek
  const v = Math.floor(zn12Hash(i * 3.3) * 3);
  if (ev > 1032 * T) return h < 0.55 ? 40 + v : 0 + v;   // tepe: kır çiçekleri
  if (ev > ZN12_ONSU.x0 && ev < ZN12_ONSU.x1 && typeof bt12OnSuCiz === 'function') return h < 0.4 ? 30 + (i % 2) : -1;   // göletçik kolu: seyrek kamış
  if (ev > 560 * T && ev < 704 * T) return h < 0.6 ? 50 + v : h < 0.8 ? 10 + v : 0 + v;   // botanik: eğrelti, çiçek
  if (h < 0.48) return 0 + v;        // tutam
  if (h < 0.74) return 10 + v;       // çiçekli tutam
  return 20 + (v % 2);               // çalı kenarı
}
const ZN12_ON_AD = ['tutam', 'cicek', 'cali', 'saz', 'kir', 'egrelti'];
function zn12On(tm) {
  if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 12) return;
  const kare = zn12Kare(); if (kare === ZN12.sonOnKare) return; ZN12.sonOnKare = kare;
  if (!ZN12.hazir) return;
  const VHg = VH / cam.zoom, yb = cam.y + VHg + 5, kx0 = cam.x * ZN12_ONP;
  let n = 0;
  const i0 = Math.floor((kx0 - 80) / ZN12_ON_ARA), i1 = Math.ceil((kx0 + VW + 80) / ZN12_ON_ARA);
  for (let i = i0; i <= i1; i++) {
    const X = i * ZN12_ON_ARA + (zn12Hash(i * 0.77) - 0.5) * 34;
    const ev = (X + VW * 0.075) / ZN12_ONP;   // ekranın ortasından geçtiği dünya x'i (tür buna göre; kayarken değişmez)
    const t = zn12OnTur(i, ev); if (t < 0) continue;
    const spr = zn12OnSpr(ZN12_ON_AD[Math.floor(t / 10)], t % 10);
    const sx = X - kx0, s = 1.0 + zn12Hash(i * 2.1) * 0.18;
    const r = zn12Ruzgar(sx + cam.x, tm), bukul = t >= 20 && t < 30 ? 0.35 : 1;
    const e = -(0.05 + 0.08 * r + Math.sin(tm * 2.4 + i * 1.3) * 0.04) * bukul;
    g.setTransform(S * s, 0, e * S * s, S * s, sx * S, (yb - cam.y) * S);
    g.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h); n++;
  }
  ZN12.say.on = n;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
}

// yerleşim yükleme anında (CANLI ZN12_BANK / ZN12_AGAC'ı hemen okuyabilsin)
if (typeof BOLUM_NO === 'undefined' || BOLUM_NO === 12) { try { zn12Kur(); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('zemin12.kur', e); } }

// ── Bağlantı: ARKA kendi kancalarından çağırır; çağırmazsa (ya da dunya12.js yüklenemezse) burada sarmalanır ──
(function zn12Bagla() {
  if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 12) return;
  const eW = typeof dn12World === 'function' ? dn12World : null, eF = typeof dn12Foreground === 'function' ? dn12Foreground : null;
  globalThis.dn12World = function (tm) { if (eW) { try { eW(tm); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('dn12World', e); } } zn12World(tm); };
  globalThis.dn12Foreground = function (tm) { zn12On(tm); if (eF) eF(tm); };
  // oyun.js uyku girişinde/perde arkasında dn12Isit'i true dönene dek her kare çağırır: önbellekleri orada (karede 6 ms) kur
  const eI = typeof dn12Isit === 'function' ? dn12Isit : null;
  globalThis.dn12Isit = function () {
    let a = true; if (eI) { try { a = !!eI(); } catch (e) { a = true; } }
    if (!ZN12.kuyrukDolu) { ZN12.kuyrukDolu = true; zn12KuyrukDoldur(); }
    return zn12Isit(6) && a;
  };
})();

// ── Dokununca sevindiren küçük sürpriz: fener direğinin küresine (ya da direğine) dokununca fener bir an yanar, ışık zerreleri saçılır.
//    Yolu kapatmaz; yalnız fenere isabet ederse dokunuşu yutar (Feza o dokunuşla yürümez). Binişte dokunuş araca da gider.
function zn12Dokun(e) {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12 || typeof DURUM === 'undefined' || DURUM !== 'oyun') return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  if (!Number.isFinite(wx) || !Number.isFinite(wy)) return;
  for (let i = 0; i < ZN12.ogeler.length; i++) {
    const o = ZN12.ogeler[i];
    if (o.tip !== 'fener' || Math.abs(wx - o.x) > 40) continue;
    const ky = o.y - 254 * o.s, kure = Math.hypot(wx - o.x, wy - ky) < 30, direk = Math.abs(wx - o.x) < 14 && wy > ky && wy < o.y - 40;
    if (!kure && !direk) continue;
    if (!(o.yan > 0.6)) {
      o.yan = 1;
      if (typeof burst === 'function') burst(o.x, ky, 12, ['#fff6c8', '#ffd98a', '#ffffff', '#ffc4dc'], 90, 0.9, 3);
      if (typeof OLAY !== 'undefined') OLAY.emit('k12FenerDokun', { o, x: o.x, y: ky });
    }
    if (!P.ucus) { e.preventDefault(); e.stopPropagation(); }
    return;
  }
}
if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 12 && typeof cv !== 'undefined' && cv) cv.addEventListener('pointerdown', zn12Dokun, true);
