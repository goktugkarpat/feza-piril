/* sahne12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün): seçim rafındaki rüya kavanozu, uyku girişinin fonu ve sabah hatırası.
   Her bölümde yüklenir (seçim ekranı hep Bölüm 1'dir). sahne.js şunları çağırır:
     sh12Fon(c, w, h)                       durağan kavanoz resmi (w×h; kare kavanoz ya da tam ekran uyku girişi). Önbelleğe çizilir.
     sh12Canli(ox, oy, w, h, tm, a, hov)    kavanozun canlı katmanı (global g, ekran pikseli; çağıran daireyle keser)
     sh12Ikon(c, r)                         kavanoz etiketindeki minik simge ((0,0) ortada, r yarıçap)
     sh12Sabah(tm, a)                       sabah penceresinden görünen kampüs (oda birimi)
     sh12Hediye(tm, a, uyan)                komodinde rüyadan kalan küçük uçurtma ve ördek yavrusu oyuncağı (oda birimi)
   Resim: gün batımında gölet; karşı kıyıda Üniversite Merkezi'nin yuvarlak gövdesi ve basık kubbesi (fotoğraflardan stilize),
   yakın tepede piknik örtüsünde arkadan görünen anne ile Feza, gökte uçurtma. Canlıda: güneş nefes alır, suda ışıltı yolu,
   ördek ailesi süzülür, uçurtma salınır, kiraz yaprakları uçuşur, iki kuş geçer. Karede degrade yok (hepsi durağan katmanda). */
'use strict';

// ── yerleşim: kare kavanoz ve geniş ekran için aynı sahne, ölçüler kısa kenara (s) göre ──
const SH12_YER = new Map();
function sh12Yer(w, h) {
  const k = Math.round(w) + 'x' + Math.round(h);
  let O = SH12_YER.get(k);
  if (O) return O;
  const s = Math.min(w, h), kare = w / h < 1.3;
  // kare kavanozda her şey daha iri ve ortaya toplu (cam kenarları ve boyun resmin kenarlarını örter)
  const uf = h * (kare ? 0.5 : 0.52);
  O = {
    s, kare,
    ufuk: uf,                                                             // karşı kıyı (gölün uzak kenarı)
    kiyi: h * (kare ? 0.7 : 0.74),                                        // yakın kıyı (tepenin göle değdiği yer)
    gunes: { x: w * (kare ? 0.72 : 0.68), y: uf - s * (kare ? 0.06 : 0.05), r: s * (kare ? 0.1 : 0.085) },
    merkez: { x: w * (kare ? 0.36 : 0.38), y: uf + s * 0.004, k: s * (kare ? 0.00145 : 0.00105) },   // Üniversite Merkezi: taban ortası, ölçek
    ortu: { x: w * (kare ? 0.55 : 0.58), y: h * (kare ? 0.83 : 0.875), k: s * (kare ? 0.0016 : 0.00115) },   // piknik örtüsü, oturan anne-Feza
    ucurtma: { x: w * (kare ? 0.78 : 0.76), y: h * (kare ? 0.24 : 0.2) },
    kiraz: kare ? [[w * 0.06, h * 0.99, 0.85]] : [[w * 0.07, h * 0.99, 1.05], [w * 0.95, h * 1.0, 0.9]]
  };
  if (SH12_YER.size > 16) SH12_YER.clear();
  SH12_YER.set(k, O);
  return O;
}

// Yuvarlak, yumuşak bulut: kabarık üst, düz alt; batan güneşin pembe ışığı alt kenarda
function sh12Bulut(x, cx, cy, R, renk, isik) {
  x.fillStyle = renk;
  x.beginPath();
  x.arc(cx - R * 0.9, cy, R * 0.55, Math.PI * 0.5, Math.PI * 1.5);
  x.arc(cx - R * 0.35, cy - R * 0.35, R * 0.62, Math.PI, Math.PI * 1.9);
  x.arc(cx + R * 0.35, cy - R * 0.25, R * 0.55, Math.PI * 1.15, Math.PI * 2);
  x.arc(cx + R * 0.95, cy, R * 0.48, Math.PI * 1.5, Math.PI * 0.5);
  x.closePath(); x.fill();
  x.fillStyle = isik; x.beginPath(); x.ellipse(cx + R * 0.1, cy - R * 0.02, R * 1.1, R * 0.12, 0, 0, Math.PI * 2); x.fill();
}

// Üniversite Merkezi (fotoğraftan stilize): krem yuvarlak gövde, tuğla kırmızısı dikey ayaklar, kolonlu giriş,
// gri basık kubbe (dilimli), iki yanda alçak kanat binaları, önde göle inen geniş merdiven. (cx, by) taban ortası, k ölçek.
// gun: 1 gün batımı (güneşli yan şeftali, gölgeli yan lila), 0 sabah.
function sh12Merkez(x, cx, by, k, gun) {
  const krem = gun ? '#f6dcc4' : '#f1e8da', kremG = gun ? '#d9bcc0' : '#d8d0c6', tugla = gun ? '#c97a6a' : '#c27c6a';
  const cam = gun ? '#ffd9a0' : '#a9cfe0', camK = gun ? '#b98aa0' : '#7fa6bb', kubbe = gun ? '#a99aa8' : '#9ea7ae', kubbeI = gun ? '#e8c4b0' : '#cfd6da';
  x.save(); x.lineJoin = 'round';
  // kanatlar (arkada, alçak): pencere sıraları ve kırmızı ayaklar
  for (const sd of [-1, 1]) {
    const x0 = sd < 0 ? cx - 330 * k : cx + 92 * k, x1 = sd < 0 ? cx - 92 * k : cx + 250 * k, hh = (sd < 0 ? 74 : 64) * k;
    x.fillStyle = sd < 0 ? krem : kremG; x.fillRect(x0, by - hh, x1 - x0, hh);
    x.fillStyle = tugla; x.fillRect(x0, by - hh, x1 - x0, 6 * k);
    for (let r = 0; r < 2; r++) for (let px = x0 + 8 * k; px < x1 - 14 * k; px += 22 * k) {
      x.fillStyle = (px * 7 + r * 3) % 5 < 1.2 ? cam : camK; x.fillRect(px, by - hh + (14 + r * 26) * k, 13 * k, 14 * k);
    }
    x.fillStyle = tugla; for (let px = x0; px <= x1; px += 66 * k) x.fillRect(px - 2.5 * k, by - hh, 5 * k, hh);
  }
  // yuvarlak gövde: aydınlık sol yarı, gölgeli sağ yarı (silindir hissi)
  const gw = 104 * k, gh = 120 * k;
  x.fillStyle = krem; x.fillRect(cx - gw, by - gh, gw * 2, gh);
  x.fillStyle = gun ? 'rgba(150,110,160,0.28)' : 'rgba(120,120,140,0.18)'; x.fillRect(cx + gw * 0.25, by - gh, gw * 0.75, gh);
  // pencere kuşağı (üst) ve kolonlu giriş (alt)
  x.fillStyle = camK; x.fillRect(cx - gw, by - gh + 26 * k, gw * 2, 26 * k);
  for (let i = -4; i <= 4; i++) { x.fillStyle = Math.abs(i) < 2 ? cam : camK; x.fillRect(cx + i * 22 * k - 8 * k, by - gh + 28 * k, 16 * k, 22 * k); }
  x.fillStyle = gun ? '#7a5d76' : '#6a7480'; x.fillRect(cx - gw * 0.8, by - 44 * k, gw * 1.6, 44 * k);
  x.fillStyle = gun ? '#ffe6c6' : '#f8f4ec'; for (let i = -5; i <= 5; i++) x.fillRect(cx + i * 15 * k - 3 * k, by - 44 * k, 6 * k, 44 * k);
  x.fillStyle = cam; x.fillRect(cx - 20 * k, by - 34 * k, 40 * k, 34 * k);   // cam giriş
  x.fillStyle = tugla; for (const px of [-gw, -gw * 0.52, gw * 0.52, gw]) x.fillRect(cx + px - 4 * k, by - gh, 8 * k, gh - 44 * k);
  // saçak
  x.fillStyle = gun ? '#fff0de' : '#fbf8f2'; x.fillRect(cx - gw - 7 * k, by - gh - 7 * k, (gw + 7 * k) * 2, 9 * k);
  // basık kubbe: dilimli, güneş tarafı aydınlık
  x.fillStyle = kubbe; x.beginPath(); x.moveTo(cx - gw - 4 * k, by - gh - 7 * k); x.quadraticCurveTo(cx, by - gh - 92 * k, cx + gw + 4 * k, by - gh - 7 * k); x.closePath(); x.fill();
  x.fillStyle = kubbeI; x.beginPath(); x.moveTo(cx + gw + 4 * k, by - gh - 7 * k); x.quadraticCurveTo(cx + gw * 0.6, by - gh - 60 * k, cx + 4 * k, by - gh - 50 * k); x.lineTo(cx + 12 * k, by - gh - 7 * k); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(80,70,90,0.35)'; x.lineWidth = 1.4 * k;
  for (let i = -3; i <= 3; i++) { x.beginPath(); x.moveTo(cx + i * 30 * k, by - gh - 7 * k); x.quadraticCurveTo(cx + i * 18 * k, by - gh - 40 * k, cx, by - gh - 50 * k); x.stroke(); }
  x.fillStyle = gun ? '#fff0de' : '#f4f1ea'; x.beginPath(); x.ellipse(cx, by - gh - 50 * k, 10 * k, 4 * k, 0, 0, Math.PI * 2); x.fill();
  // önde göle inen geniş merdiven (açık taş, ince basamak çizgileri)
  x.fillStyle = gun ? '#f2d6c4' : '#e8e2d8'; x.beginPath(); x.moveTo(cx - 30 * k, by); x.lineTo(cx + 30 * k, by); x.lineTo(cx + 46 * k, by + 16 * k); x.lineTo(cx - 46 * k, by + 16 * k); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(120,90,100,0.3)'; x.lineWidth = k;
  for (let i = 1; i < 5; i++) { const yy = by + i * 3.2 * k, ww = 30 * k + i * 3.2 * k; x.beginPath(); x.moveTo(cx - ww, yy); x.lineTo(cx + ww, yy); x.stroke(); }
  x.restore();
}

// Ağaç kümesi (yuvarlak taçlar), gün batımında üst kenarı şeftali ışık alır
function sh12Agac(x, px, py, r, koyu, acik) {
  x.fillStyle = koyu;
  x.beginPath(); x.arc(px - r * 0.55, py - r * 0.6, r * 0.65, 0, Math.PI * 2); x.arc(px + r * 0.5, py - r * 0.7, r * 0.7, 0, Math.PI * 2); x.arc(px, py - r * 1.05, r * 0.75, 0, Math.PI * 2); x.fill();
  x.fillRect(px - r * 0.08, py - r * 0.5, r * 0.16, r * 0.5);
  x.fillStyle = acik; x.beginPath(); x.arc(px + r * 0.2, py - r * 1.3, r * 0.4, 0, Math.PI * 2); x.arc(px + r * 0.75, py - r * 0.95, r * 0.3, 0, Math.PI * 2); x.fill();
}

// Karşı kıyının ağaç kuşağı: yan yana yumuşak taçlar, üst kenarları gün batımının şeftali ışığını alır
function sh12AgacKusak(x, w, ufuk, s) {
  const r = rng(1211), n = Math.ceil(w / (s * 0.035));
  x.fillStyle = '#86a08a';
  x.beginPath(); for (let i = 0; i <= n; i++) { const px = i / n * w, rr = s * (0.022 + r() * 0.018); x.moveTo(px + rr, ufuk); x.arc(px, ufuk - rr * 0.35, rr, 0, Math.PI * 2); } x.fill();
  x.fillStyle = 'rgba(255,206,170,0.45)';
  const q = rng(1211);
  x.beginPath(); for (let i = 0; i <= n; i++) { const px = i / n * w, rr = s * (0.022 + q() * 0.018); x.moveTo(px + rr * 0.6, ufuk - rr * 0.8); x.arc(px + rr * 0.2, ufuk - rr * 0.8, rr * 0.4, 0, Math.PI * 2); } x.fill();
}

// Kiraz ağacı (ön plan): kıvrık gövde, pembe çiçek kümeleri
function sh12Kiraz(x, px, py, s, yon) {
  x.strokeStyle = '#6e4f52'; x.lineCap = 'round';
  x.lineWidth = 20 * s; x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px - yon * 18 * s, py - 160 * s, px + yon * 14 * s, py - 290 * s); x.stroke();
  x.lineWidth = 8 * s; x.beginPath(); x.moveTo(px - yon * 6 * s, py - 190 * s); x.quadraticCurveTo(px + yon * 50 * s, py - 245 * s, px + yon * 80 * s, py - 290 * s);
  x.moveTo(px - yon * 4 * s, py - 200 * s); x.lineTo(px - yon * 46 * s, py - 262 * s); x.stroke();
  for (const [dx, dy, r] of [[-70, -282, 50], [-36, -330, 62], [12, -336, 68], [66, -318, 58], [98, -280, 46], [0, -270, 64]]) {
    x.fillStyle = (dx & 1) ? '#ec9fb6' : '#f5bccb'; x.beginPath(); x.arc(px + yon * dx * s, py + dy * s, r * s, 0, Math.PI * 2); x.fill();
    x.fillStyle = 'rgba(255,236,228,0.45)'; x.beginPath(); x.arc(px + yon * (dx - 10) * s, py + (dy - 14) * s, r * 0.45 * s, 0, Math.PI * 2); x.fill();
  }
}

// Piknik örtüsünde arkadan görünen anne ile Feza (güneşe bakıyorlar); annenin kolu Feza'nın omzunda. (cx, cy) örtü ortası.
function sh12AnneFeza(x, cx, cy, k) {
  x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
  // örtü: pembe-krem kareli, perspektifli
  const R = 120 * k;
  x.fillStyle = 'rgba(80,50,70,0.25)'; x.beginPath(); x.ellipse(cx, cy + 14 * k, R * 1.05, 10 * k, 0, 0, Math.PI * 2); x.fill();
  x.save(); x.beginPath(); x.moveTo(cx - R * 0.86, cy - 16 * k); x.lineTo(cx + R * 0.86, cy - 16 * k); x.lineTo(cx + R, cy + 14 * k); x.lineTo(cx - R, cy + 14 * k); x.closePath();
  x.fillStyle = '#fff1e4'; x.fill(); x.clip();
  x.fillStyle = 'rgba(238,132,160,0.45)';
  for (let i = 0; i < 6; i += 2) x.fillRect(cx - R, cy - 16 * k + i * 5 * k, R * 2, 5 * k);
  for (let i = -6; i < 6; i += 2) {   // dikey şeritler arkaya doğru daralır
    const a = cx + i * R / 6, b = cx + (i + 1) * R / 6;
    x.beginPath(); x.moveTo(cx + (a - cx) * 0.86, cy - 16 * k); x.lineTo(cx + (b - cx) * 0.86, cy - 16 * k); x.lineTo(b, cy + 14 * k); x.lineTo(a, cy + 14 * k); x.closePath(); x.fill();
  }
  x.restore();
  // sepet (sağda)
  x.fillStyle = '#b97f48'; x.beginPath(); x.moveTo(cx + 62 * k, cy - 22 * k); x.lineTo(cx + 96 * k, cy - 22 * k); x.lineTo(cx + 92 * k, cy - 2 * k); x.lineTo(cx + 66 * k, cy - 2 * k); x.closePath(); x.fill();
  x.strokeStyle = '#8a5a30'; x.lineWidth = 3 * k; x.beginPath(); x.arc(cx + 79 * k, cy - 22 * k, 13 * k, Math.PI, 0); x.stroke();
  x.fillStyle = '#e65a66'; x.beginPath(); x.arc(cx + 72 * k, cy - 24 * k, 5 * k, 0, Math.PI * 2); x.fill();
  // anne (solda, oturur): koyu saç alçak topuz, krem bluz; sağ kolu Feza'nın omzunda
  const ax = cx - 28 * k, ay = cy - 6 * k;
  x.fillStyle = '#f6eee3'; x.beginPath(); x.moveTo(ax - 24 * k, ay); x.quadraticCurveTo(ax - 28 * k, ay - 52 * k, ax, ay - 60 * k); x.quadraticCurveTo(ax + 28 * k, ay - 52 * k, ax + 24 * k, ay); x.closePath(); x.fill();
  x.fillStyle = 'rgba(170,120,150,0.3)'; x.beginPath(); x.moveTo(ax + 6 * k, ay); x.quadraticCurveTo(ax + 22 * k, ay - 40 * k, ax + 8 * k, ay - 58 * k); x.quadraticCurveTo(ax + 28 * k, ay - 50 * k, ax + 24 * k, ay); x.closePath(); x.fill();
  x.fillStyle = '#4b403a'; x.beginPath(); x.arc(ax, ay - 74 * k, 16 * k, 0, Math.PI * 2); x.fill();          // baş (arkadan: saç)
  x.beginPath(); x.ellipse(ax - 2 * k, ay - 56 * k, 8 * k, 7 * k, 0, 0, Math.PI * 2); x.fill();              // topuz
  x.fillStyle = 'rgba(255,190,150,0.55)'; x.beginPath(); x.arc(ax + 9 * k, ay - 80 * k, 6 * k, 0, Math.PI * 2); x.fill();   // saçta gün ışığı
  x.strokeStyle = '#f6eee3'; x.lineWidth = 9 * k; x.beginPath(); x.moveTo(ax + 16 * k, ay - 46 * k); x.quadraticCurveTo(ax + 38 * k, ay - 56 * k, ax + 54 * k, ay - 44 * k); x.stroke();   // omza sarılan kol
  // Feza (sağda, küçük): kahve saç, pembe tişört
  const fx = cx + 30 * k, fy = cy - 4 * k;
  x.fillStyle = '#f2a7c3'; x.beginPath(); x.moveTo(fx - 15 * k, fy); x.quadraticCurveTo(fx - 18 * k, fy - 32 * k, fx, fy - 38 * k); x.quadraticCurveTo(fx + 18 * k, fy - 32 * k, fx + 15 * k, fy); x.closePath(); x.fill();
  x.fillStyle = '#7a4a34'; x.beginPath(); x.arc(fx, fy - 50 * k, 13 * k, 0, Math.PI * 2); x.fill();
  x.beginPath(); x.ellipse(fx, fy - 40 * k, 13.5 * k, 5 * k, 0, 0, Math.PI * 2); x.fill();
  x.fillStyle = 'rgba(255,200,150,0.6)'; x.beginPath(); x.arc(fx + 7 * k, fy - 55 * k, 4.5 * k, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#f6eee3'; x.beginPath(); x.arc(ax + 54 * k, ay - 44 * k, 5 * k, 0, Math.PI * 2); x.fill();   // annenin eli
  // uçurtma ipi: Feza'nın elinden göğe (uçurtmanın kendisi canlı katmanda)
  x.restore();
}

function sh12Fon(c, w, h) {
  if (!(w > 0 && h > 0)) return;
  const O = sh12Yer(w, h), s = O.s, G = O.gunes, M = O.merkez;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  // gök: tepede yumuşak lila-mavi, ortada pembe, ufukta altın
  let gr = c.createLinearGradient(0, 0, 0, O.ufuk);
  gr.addColorStop(0, '#7f97da'); gr.addColorStop(0.38, '#c49ed8'); gr.addColorStop(0.68, '#f6a9a8'); gr.addColorStop(0.9, '#ffd29a'); gr.addColorStop(1, '#ffe6b0');
  c.fillStyle = gr; c.fillRect(0, 0, w, O.ufuk + 2);
  // güneşin geniş sıcak hâlesi ve diski
  gr = c.createRadialGradient(G.x, G.y, G.r * 0.5, G.x, G.y, s * 0.6);
  gr.addColorStop(0, 'rgba(255,236,170,0.75)'); gr.addColorStop(0.3, 'rgba(255,200,140,0.32)'); gr.addColorStop(1, 'rgba(255,190,150,0)');
  c.fillStyle = gr; c.fillRect(0, 0, w, O.ufuk + 2);
  gr = c.createRadialGradient(G.x - G.r * 0.2, G.y - G.r * 0.25, G.r * 0.1, G.x, G.y, G.r);
  gr.addColorStop(0, '#fffbe6'); gr.addColorStop(0.7, '#ffe39a'); gr.addColorStop(1, '#ffc977');
  c.fillStyle = gr; c.beginPath(); c.arc(G.x, G.y, G.r, 0, Math.PI * 2); c.fill();
  // bulutlar: alt kenarları güneşin pembe-altın ışığını alır
  sh12Bulut(c, w * 0.2, h * 0.17, s * 0.075, 'rgba(255,226,236,0.85)', 'rgba(255,190,170,0.55)');
  sh12Bulut(c, w * 0.52, h * 0.1, s * 0.055, 'rgba(250,222,240,0.75)', 'rgba(255,196,180,0.5)');
  sh12Bulut(c, G.x + s * 0.06, G.y - s * 0.16, s * 0.06, 'rgba(255,214,200,0.8)', 'rgba(255,224,160,0.6)');
  if (!O.kare) sh12Bulut(c, w * 0.9, h * 0.14, s * 0.06, 'rgba(250,222,240,0.75)', 'rgba(255,196,180,0.5)');
  // uzak tepeler (lavanta) ve güneşin önünden geçen ince tepe çizgisi
  c.fillStyle = '#b79cc6'; c.beginPath(); c.moveTo(0, O.ufuk);
  for (let i = 0; i <= 24; i++) { const px = i / 24 * w; c.lineTo(px, O.ufuk - s * (0.045 + 0.025 * Math.sin(px / s * 5.1 + 0.7) + 0.012 * Math.sin(px / s * 13))); }
  c.lineTo(w, O.ufuk); c.closePath(); c.fill();
  c.fillStyle = '#a088b6'; c.beginPath(); c.moveTo(0, O.ufuk);
  for (let i = 0; i <= 24; i++) { const px = i / 24 * w; c.lineTo(px, O.ufuk - s * (0.018 + 0.012 * Math.sin(px / s * 7.3 + 2))); }
  c.lineTo(w, O.ufuk); c.closePath(); c.fill();
  // karşı kıyı: ağaç kümeleri ve Üniversite Merkezi
  sh12AgacKusak(c, w, O.ufuk, s);
  sh12Merkez(c, M.x, M.y, M.k, 1);
  for (const [dx, r] of [[-0.25, 0.034], [0.235, 0.03]]) sh12Agac(c, M.x + dx * s * (O.kare ? 1.3 : 1), O.ufuk + s * 0.01, s * r, '#6f8f78', 'rgba(255,206,160,0.55)');
  // gölet: ufukta altın, yakında lila-mavi; karşı kıyının ters yansıması
  gr = c.createLinearGradient(0, O.ufuk, 0, O.kiyi);
  gr.addColorStop(0, '#ffd8a8'); gr.addColorStop(0.35, '#e8b4c0'); gr.addColorStop(1, '#8c9fd0');
  c.fillStyle = gr; c.fillRect(0, O.ufuk, w, O.kiyi - O.ufuk + s * 0.05);
  c.save(); c.beginPath(); c.rect(0, O.ufuk + s * 0.016, w, O.kiyi - O.ufuk); c.clip();
  c.globalAlpha = 0.22; c.translate(0, O.ufuk * 2 + s * 0.03); c.scale(1, -1);
  sh12Merkez(c, M.x, M.y, M.k, 1);
  c.restore();
  // yansımayı bölen ince su çizgileri
  c.fillStyle = 'rgba(255,236,220,0.35)';
  { const r = rng(1213); for (let i = 0; i < 14; i++) { const yy = O.ufuk + s * 0.02 + r() * (O.kiyi - O.ufuk - s * 0.03); c.fillRect(r() * w, yy, s * (0.04 + r() * 0.08), Math.max(1, s * 0.0025)); } }
  // güneşin suya düşen ışık yolu (durağan kısım; ışıltılar canlıda)
  c.fillStyle = 'rgba(255,240,200,0.7)';
  for (let i = 0; i < 9; i++) {
    const yy = O.ufuk + s * (0.02 + i * 0.022), ww = s * (0.05 - i * 0.003) * (i % 2 ? 0.7 : 1);
    c.beginPath(); c.ellipse(G.x + Math.sin(i * 2.3) * s * 0.008, yy, ww, s * 0.0035, 0, 0, Math.PI * 2); c.fill();
  }
  c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(0, O.ufuk, w, Math.max(1, s * 0.003));
  // yakın tepe: yeşil, tepesi gün batımının ışığını alır
  const tepe = px => O.kiyi - s * 0.02 * Math.sin(px / w * Math.PI) - s * 0.012 * Math.sin(px / s * 6 + 1);
  gr = c.createLinearGradient(0, O.kiyi - s * 0.03, 0, h);
  gr.addColorStop(0, '#94c084'); gr.addColorStop(0.35, '#73a773'); gr.addColorStop(1, '#447e5e');
  c.fillStyle = gr; c.beginPath(); c.moveTo(0, h);
  for (let i = 0; i <= 30; i++) { const px = i / 30 * w; c.lineTo(px, tepe(px)); }
  c.lineTo(w, h); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,214,160,0.7)'; c.lineWidth = Math.max(1, s * 0.005); c.beginPath();
  for (let i = 0; i <= 30; i++) { const px = i / 30 * w; if (i) c.lineTo(px, tepe(px) + 1); else c.moveTo(px, tepe(px) + 1); } c.stroke();
  // çimende minik çiçekler
  {
    const r = rng(1212), CR = ['#ffd6e4', '#fff3b8', '#ffffff', '#e8c8ff'];
    for (let i = 0; i < Math.ceil(w / s * 26); i++) {
      const px = r() * w, py = O.kiyi + s * 0.03 + r() * (h - O.kiyi), rr = s * (0.004 + r() * 0.004);
      c.fillStyle = CR[i % 4]; c.beginPath(); c.arc(px, py, rr, 0, Math.PI * 2); c.fill();
    }
  }
  // piknik örtüsünde anne ile Feza (arkadan, güneşe bakıyorlar)
  sh12AnneFeza(c, O.ortu.x, O.ortu.y, O.ortu.k * (O.kare ? 1 : 1.05));
  // ön planda kiraz ağaçları
  for (const [px, py, sc] of O.kiraz) sh12Kiraz(c, px, py, s * 0.001 * sc, px < w / 2 ? 1 : -1);
  c.restore();
}

// ── canlı katman: güneş nefesi, ışıltı yolu, ördek ailesi, uçurtma, kuşlar, kiraz yaprakları (karede degrade yok) ──
function sh12Ordek(cx, cy, r, yon, a, yavru) {   // yandan süzülen ördek (anne sarımsı-kahve, yavrular sarı)
  g.save(); g.translate(cx, cy); g.scale(yon, 1); g.globalAlpha = a;
  g.fillStyle = 'rgba(255,255,255,0.4)'; g.beginPath(); g.ellipse(-r * 0.3, r * 0.42, r * 1.4, r * 0.14, 0, 0, Math.PI * 2); g.fill();   // su izi
  g.fillStyle = yavru ? '#ffd84a' : '#c99a6a';
  g.beginPath(); g.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2); g.fill();                                   // gövde
  g.beginPath(); g.moveTo(-r * 0.9, -r * 0.1); g.lineTo(-r * 1.3, -r * 0.45); g.lineTo(-r * 0.75, -r * 0.35); g.fill();   // kuyruk
  g.fillStyle = yavru ? '#ffe27a' : '#3f8a6a'; g.beginPath(); g.arc(r * 0.7, -r * 0.6, r * 0.42, 0, Math.PI * 2); g.fill();   // baş
  g.fillStyle = '#ff9a3c'; g.beginPath(); g.moveTo(r * 1.05, -r * 0.62); g.lineTo(r * 1.4, -r * 0.5); g.lineTo(r * 1.05, -r * 0.42); g.fill();   // gaga
  g.fillStyle = '#2a1f2e'; g.beginPath(); g.arc(r * 0.82, -r * 0.7, r * 0.08, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.ellipse(-r * 0.1, -r * 0.15, r * 0.45, r * 0.18, -0.2, 0, Math.PI * 2); g.fill();   // kanat parlaması
  g.restore();
}
function sh12Ucurtma(x, y, r, sal, a, ipX, ipY) {   // eşkenar dörtgen uçurtma, ip ve kuyruk kurdeleleri
  g.save(); g.globalAlpha = a;
  if (ipX !== undefined) {
    g.strokeStyle = 'rgba(255,250,240,0.7)'; g.lineWidth = Math.max(0.6, r * 0.05);
    g.beginPath(); g.moveTo(x, y + r * 0.9); g.quadraticCurveTo((x + ipX) / 2 + r * 1.5, (y + ipY) / 2 + r, ipX, ipY); g.stroke();
  }
  g.translate(x, y); g.rotate(sal * 0.25);
  // kuyruk
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = Math.max(0.6, r * 0.05); g.beginPath(); g.moveTo(0, r);
  for (let i = 1; i <= 5; i++) g.lineTo(Math.sin(sal * 2 + i * 1.1) * r * 0.35, r + i * r * 0.42);
  g.stroke();
  const KR = ['#ffd36b', '#8fd6f0', '#c7a6ff', '#ff9fc4'];
  for (let i = 1; i <= 4; i++) { g.fillStyle = KR[i - 1]; g.beginPath(); g.ellipse(Math.sin(sal * 2 + i * 1.1) * r * 0.35, r + i * r * 0.42, r * 0.17, r * 0.08, 0.5, 0, Math.PI * 2); g.fill(); }
  // gövde: dört renkli dilim
  const P4 = [[0, -r], [r * 0.7, 0], [0, r], [-r * 0.7, 0]], RN = ['#ff8fab', '#ffd36b', '#8fd6f0', '#c7a6ff'];
  for (let i = 0; i < 4; i++) { g.fillStyle = RN[i]; g.beginPath(); g.moveTo(0, 0); g.lineTo(P4[i][0], P4[i][1]); g.lineTo(P4[(i + 1) % 4][0], P4[(i + 1) % 4][1]); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = Math.max(0.6, r * 0.06);
  g.beginPath(); g.moveTo(0, -r); g.lineTo(0, r); g.moveTo(-r * 0.7, 0); g.lineTo(r * 0.7, 0); g.stroke();
  g.restore();
}
function sh12Canli(ox, oy, w, h, tm, a, hov) {
  if (!(a > 0.01) || !(w > 0 && h > 0)) return;
  hov = hov || 0;
  const O = sh12Yer(w, h), s = O.s, G = O.gunes, hz = 1 + 0.35 * hov, t = tm * hz;
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  // 1) güneş nefes alır; suya düşen ışık yolu ışıldar
  g.globalCompositeOperation = 'lighter';
  dglow('#ffe2a0', ox + G.x, oy + G.y, G.r * (3.2 + 0.25 * Math.sin(tm * 0.8)), a * 0.32);
  dglow('#fff6d8', ox + G.x, oy + G.y, G.r * 1.3, a * 0.35);
  for (let i = 0; i < 8; i++) {
    const tw = Math.pow(Math.max(0, Math.sin(t * (1.6 + i * 0.23) + i * 1.9)), 3), yy = O.ufuk + s * (0.025 + i * 0.024), xx = G.x + Math.sin(t * 0.7 + i * 2.1) * s * 0.03;
    if (yy > O.kiyi) break;
    dglow('#fff4cc', ox + xx, oy + yy, s * 0.022 * (0.5 + tw), a * tw * 0.75);
  }
  g.globalCompositeOperation = 'source-over';
  // 2) ördek ailesi: anne önde, üç yavru arkasında, göletin üstünde yavaşça süzülür
  {
    const u = (tm * 0.018 * hz) % 1, yon = 1, x0 = -0.1 * w + u * 1.2 * w, yy = oy + O.ufuk + (O.kiyi - O.ufuk) * 0.62, r = s * 0.016;
    const al = a * Math.min(1, Math.sin(u * Math.PI) * 3);
    for (let i = 3; i >= 1; i--) sh12Ordek(ox + x0 - i * r * 2.6, yy + Math.sin(t * 2 + i) * r * 0.12, r * 0.6, yon, al, true);
    sh12Ordek(ox + x0, yy + Math.sin(t * 1.6) * r * 0.1, r, yon, al, false);
  }
  // 3) uçurtma salınır; ipi Feza'nın eline iner
  {
    const U = O.ucurtma, sal = Math.sin(t * 1.3) + 0.4 * Math.sin(t * 2.9);
    sh12Ucurtma(ox + U.x + Math.sin(t * 0.6) * s * 0.02, oy + U.y + Math.sin(t * 0.9) * s * 0.015, s * 0.045, sal, a,
      ox + O.ortu.x + 34 * O.ortu.k, oy + O.ortu.y - 50 * O.ortu.k);
  }
  // 4) iki kuş uzaktan geçer (yumuşak V)
  g.strokeStyle = 'rgba(110,80,120,0.7)'; g.lineWidth = Math.max(0.8, s * 0.004);
  for (let i = 0; i < 2; i++) {
    const v = (tm * (0.03 + i * 0.008) * hz + i * 0.45) % 1, px = ox + w * (1.1 - v * 1.25), py = oy + h * (0.25 + i * 0.07) + Math.sin(v * 8 + i) * s * 0.012, kn = Math.sin(tm * 7 + i * 2) * s * 0.008, bw = s * (0.016 - i * 0.004);
    g.globalAlpha = a * Math.sin(v * Math.PI);
    g.beginPath(); g.moveTo(px - bw, py - kn); g.quadraticCurveTo(px - bw * 0.4, py - bw * 0.3, px, py); g.quadraticCurveTo(px + bw * 0.4, py - bw * 0.3, px + bw, py - kn); g.stroke();
  }
  g.globalAlpha = 1;
  // 5) kiraz yaprakları uçuşur
  g.fillStyle = '#fff0f4';
  for (let i = 0; i < 7; i++) {
    const q = (t * 0.06 + i * 0.17) % 1, px = ox + w * ((0.05 + i * 0.14 + q * 0.18) % 1), py = oy + h * (0.35 + q * 0.6);
    g.globalAlpha = a * 0.85 * Math.sin(q * Math.PI);
    g.save(); g.translate(px, py); g.rotate(t * 0.9 + i); g.beginPath(); g.ellipse(0, 0, s * 0.007, s * 0.012, 0, 0, Math.PI * 2); g.fill(); g.restore();
  }
  g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}

// ── etiket simgesi: batan güneşin önünde Üniversite Merkezi'nin kubbesi ve suda yansıma ──
function sh12Ikon(c, r) {
  if (!(r > 0)) return;
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#ffc97a'; c.beginPath(); c.arc(r * 0.42, -r * 0.18, r * 0.42, 0, Math.PI * 2); c.fill();        // güneş
  c.fillStyle = '#ffe9b0'; c.beginPath(); c.arc(r * 0.36, -r * 0.26, r * 0.26, 0, Math.PI * 2); c.fill();
  // gövde + kubbe
  c.fillStyle = '#f6dcc4'; c.fillRect(-r * 0.62, -r * 0.2, r * 0.92, r * 0.5);
  c.fillStyle = '#c97a6a'; for (const px of [-0.62, -0.36, 0.04, 0.3]) c.fillRect((px - 0.035) * r, -r * 0.2, r * 0.07, r * 0.5);
  c.fillStyle = '#7a5d76'; c.fillRect(-r * 0.44, r * 0.1, r * 0.56, r * 0.2);
  c.fillStyle = '#fff0de'; c.fillRect(-r * 0.68, -r * 0.27, r * 1.04, r * 0.09);
  c.fillStyle = '#a99aa8'; c.beginPath(); c.moveTo(-r * 0.68, -r * 0.27); c.quadraticCurveTo(-r * 0.16, -r * 0.92, r * 0.36, -r * 0.27); c.closePath(); c.fill();
  c.fillStyle = '#e8c4b0'; c.beginPath(); c.moveTo(r * 0.36, -r * 0.27); c.quadraticCurveTo(r * 0.1, -r * 0.62, -r * 0.14, -r * 0.6); c.lineTo(-r * 0.1, -r * 0.27); c.closePath(); c.fill();
  // su ve yansıma çizgileri
  c.fillStyle = '#8fb0dc'; c.beginPath(); c.ellipse(0, r * 0.52, r * 0.88, r * 0.2, 0, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#fff1c8'; c.lineWidth = r * 0.07;
  c.beginPath(); c.moveTo(r * 0.24, r * 0.46); c.lineTo(r * 0.6, r * 0.46); c.moveTo(r * 0.3, r * 0.58); c.lineTo(r * 0.52, r * 0.58); c.stroke();
  c.strokeStyle = 'rgba(246,220,196,0.8)'; c.beginPath(); c.moveTo(-r * 0.56, r * 0.48); c.lineTo(-r * 0.1, r * 0.48); c.stroke();
  // minik kalp (anneyle bir gün)
  c.fillStyle = '#ff8fb0'; const hx = -r * 0.66, hy = -r * 0.62, hs = r * 0.16;
  c.beginPath(); c.moveTo(hx, hy + hs * 0.9); c.bezierCurveTo(hx - hs * 1.2, hy + hs * 0.05, hx - hs * 0.85, hy - hs * 0.85, hx, hy - hs * 0.3); c.bezierCurveTo(hx + hs * 0.85, hy - hs * 0.85, hx + hs * 1.2, hy + hs * 0.05, hx, hy + hs * 0.9); c.fill();
  c.restore();
}

// ── sabah penceresi: lojmanın penceresinden sabah kampüsü — yeşil tepede kubbeli Üniversite Merkezi, göletin parıltısı,
//    gökte rüyadaki uçurtmaya benzeyen bir uçurtma, iki kuş. Oda birimi (pencere x 14..40, y 12..50). ──
let sh12SabahGr = null;
function sh12Sabah(tm, a) {
  if (!(a > 0.01)) return;
  g.save(); shOdaT(); shPencereYol(g, 0); g.clip(); g.globalAlpha = a;
  if (!sh12SabahGr) {   // oda birimi: dönüşümden bağımsız, bir kez
    sh12SabahGr = g.createLinearGradient(0, SH_PEN.ust, 0, 48);
    sh12SabahGr.addColorStop(0, '#9fd2f0'); sh12SabahGr.addColorStop(0.55, '#d8ecf2'); sh12SabahGr.addColorStop(0.85, '#ffe6d2'); sh12SabahGr.addColorStop(1, '#fff0d8');
  }
  g.fillStyle = sh12SabahGr; g.fillRect(SH_PEN.x0 - 1, SH_PEN.ust - 1, SH_PEN.x1 - SH_PEN.x0 + 2, 52 - SH_PEN.ust);
  // sabah güneşi (sağ üstte, yumuşak hâle) ve pamuk bulutlar
  g.fillStyle = 'rgba(255,246,210,0.5)'; g.beginPath(); g.arc(35, 19, 4.2, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff6d2'; g.beginPath(); g.arc(35, 19, 2.6, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.85)';
  for (const [cx, cy, rr] of [[18.5, 23, 1.7], [20.4, 22.4, 2.1], [22.4, 23.1, 1.5], [28.5, 17.5, 1.3], [30.1, 17, 1.6], [31.6, 17.6, 1.2]]) { g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.fill(); }
  // uzak mavi tepeler
  g.fillStyle = '#b8cfe0'; g.beginPath(); g.moveTo(13, 50); g.lineTo(13, 38.4); g.quadraticCurveTo(20, 35.6, 27, 37.4); g.quadraticCurveTo(34, 35.2, 42, 37.8); g.lineTo(42, 50); g.fill();
  // yeşil kampüs tepesi, ağaçlar ve Üniversite Merkezi (minik)
  g.fillStyle = '#a8d4a0'; g.beginPath(); g.moveTo(13, 50); g.lineTo(13, 41.2); g.quadraticCurveTo(24, 38.6, 32, 40.2); g.quadraticCurveTo(37, 41, 42, 40.4); g.lineTo(42, 50); g.fill();
  for (const [px, py, r] of [[16.5, 41.3, 1.5], [18.4, 41, 1.2], [33.5, 40.4, 1.4], [36.2, 40.6, 1.6], [38.6, 40.4, 1.2]]) {
    g.fillStyle = '#7fb47e'; g.beginPath(); g.arc(px, py - r, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.3)'; g.beginPath(); g.arc(px - r * 0.3, py - r * 1.4, r * 0.45, 0, Math.PI * 2); g.fill();
  }
  sh12Merkez(g, 26, 40.2, 0.022, 0);
  // gölet parıltısı ve yakın çayır
  g.fillStyle = '#9fd0e6'; g.beginPath(); g.ellipse(27, 43.6, 13.5, 1.5, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.8)';
  for (let i = 0; i < 4; i++) { const tw = 0.5 + 0.5 * Math.sin(tm * 2 + i * 1.7); g.globalAlpha = a * tw; g.fillRect(20 + i * 4.3, 43.4, 1.4, 0.25); }
  g.globalAlpha = a;
  g.fillStyle = '#b7dcae'; g.beginPath(); g.moveTo(13, 50); g.lineTo(13, 45.4); g.quadraticCurveTo(22, 44.2, 30, 45.2); g.quadraticCurveTo(36, 45.9, 42, 45); g.lineTo(42, 50); g.fill();
  g.fillStyle = '#f5bccb'; for (const [px, py] of [[15.5, 46.2], [16.4, 45.7], [39.4, 45.8], [38.3, 46.3]]) { g.beginPath(); g.arc(px, py, 0.9, 0, Math.PI * 2); g.fill(); }
  // gökte salınan uçurtma (rüyadaki gibi) ve iki kuş
  {
    const sal = Math.sin(tm * 1.2) + 0.3 * Math.sin(tm * 2.7), ux = 21.5 + Math.sin(tm * 0.5) * 0.8, uy = 28 + Math.sin(tm * 0.8) * 0.6;
    g.save(); g.translate(ux, uy); g.rotate(sal * 0.2);
    g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 0.12; g.beginPath(); g.moveTo(0, 1.6);
    for (let i = 1; i <= 4; i++) g.lineTo(Math.sin(sal * 2 + i) * 0.5, 1.6 + i * 0.8); g.stroke();
    const P4 = [[0, -1.6], [1.15, 0], [0, 1.6], [-1.15, 0]], RN = ['#ff8fab', '#ffd36b', '#8fd6f0', '#c7a6ff'];
    for (let i = 0; i < 4; i++) { g.fillStyle = RN[i]; g.beginPath(); g.moveTo(0, 0); g.lineTo(P4[i][0], P4[i][1]); g.lineTo(P4[(i + 1) % 4][0], P4[(i + 1) % 4][1]); g.closePath(); g.fill(); }
    for (let i = 1; i <= 3; i++) { g.fillStyle = RN[i]; g.beginPath(); g.ellipse(Math.sin(sal * 2 + i) * 0.5, 1.6 + i * 0.8, 0.32, 0.15, 0.5, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }
  g.strokeStyle = 'rgba(90,100,130,0.7)'; g.lineWidth = 0.14;
  for (let i = 0; i < 2; i++) {
    const u = (tm * 0.035 + i * 0.5) % 1, bx = 41 - u * 28, by = 26 + i * 2 + Math.sin(u * 7 + i) * 0.8, kn = Math.sin(tm * 8 + i * 2) * 0.35;
    g.globalAlpha = a * Math.sin(u * Math.PI);
    g.beginPath(); g.moveTo(bx - 0.7, by - kn); g.quadraticCurveTo(bx - 0.3, by - 0.25, bx, by); g.quadraticCurveTo(bx + 0.3, by - 0.25, bx + 0.7, by - kn); g.stroke();
  }
  g.globalAlpha = a; g.restore();
  // pencere kayıtları göğün önünde kalsın
  g.save(); shOdaT(); g.globalAlpha = a; g.fillStyle = SH_SABAH.frame; const cxw = (SH_PEN.x0 + SH_PEN.x1) / 2;
  g.fillRect(cxw - 0.6, SH_PEN.ust, 1.2, SH_PEN.alt - SH_PEN.ust); g.fillRect(SH_PEN.x0, 31, SH_PEN.x1 - SH_PEN.x0, 1.2);
  g.restore(); g.globalAlpha = 1;
}

// ── komodinde rüyadan kalan hatıra: lambaya yaslanmış küçük renkli uçurtma (kuyruğu komodinden sarkar) ve yanında
//    sarı bir ördek yavrusu oyuncağı (ara sıra göz kırpar, kafasını sallar). Dar ekranda yatağın üstündeki rafta. Oda birimi. ──
function sh12Hediye(tm, a, uyan) {
  if (!(a > 0.01)) return;
  const kom = -(W / 2 + (sh.oxp || 0)) / sh.k0 < -57.5, k = sh.k0 * sh.zoom;
  const ux = kom ? -55.3 : -40.4, uy = kom ? SH_KOMODIN.ust - 0.05 : 38, ox = kom ? -62.3 : -28.8, oy = kom ? SH_KOMODIN.ust - 0.05 : 38, u = kom ? 1.25 : 1.05;
  const ii = uyan > 0 && uyan < 1 ? Math.sin(uyan * Math.PI) : 0;
  // rüyanın ışığı: sıcak gün batımı altını
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  dglow('#ffd29a', shEkranX(ux), shEkranY(uy - u * 3), k * u * (3.4 + 1.4 * ii), a * (0.24 + 0.05 * Math.sin(tm * 1.4) + 0.3 * ii));
  dglow('#ffe9a0', shEkranX(ox), shEkranY(oy - u * 1.2), k * u * 1.8, a * (0.16 + 0.2 * ii));
  g.globalCompositeOperation = 'source-over';
  g.save(); shOdaT(); g.globalAlpha = a; g.lineJoin = 'round'; g.lineCap = 'round';
  // uçurtma: lambaya yaslı, hafif eğik; dört renkli dilim, beyaz çıtalar; kurdeleli kuyruğu komodinin kenarından sarkar
  g.save(); g.translate(ux, uy); g.scale(u, u);
  const sal = Math.sin(tm * 1.1) * 0.08;
  g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 0.1; g.beginPath(); g.moveTo(0.3, -0.4);
  for (let i = 1; i <= 4; i++) g.lineTo(0.3 + i * 0.55, -0.2 + i * 0.5 + Math.sin(tm * 1.6 + i) * 0.08);
  g.stroke();
  const KR = ['#ffd36b', '#8fd6f0', '#c7a6ff', '#ff9fc4'];
  for (let i = 1; i <= 4; i++) { g.fillStyle = KR[i - 1]; g.beginPath(); g.ellipse(0.3 + i * 0.55, -0.2 + i * 0.5 + Math.sin(tm * 1.6 + i) * 0.08, 0.26, 0.12, 0.6, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(90,60,60,0.22)'; g.beginPath(); g.ellipse(-0.3, 0.05, 1.5, 0.2, 0, 0, Math.PI * 2); g.fill();
  g.rotate(-0.32 + sal);
  const D4 = [[0, -4.2], [1.7, -2.1], [0, 0], [-1.7, -2.1]], RN = ['#ff8fab', '#ffd36b', '#8fd6f0', '#c7a6ff'];
  g.fillStyle = 'rgba(120,70,90,0.5)'; g.beginPath(); g.moveTo(0, -4.4); g.lineTo(1.9, -2.1); g.lineTo(0, 0.2); g.lineTo(-1.9, -2.1); g.closePath(); g.fill();
  for (let i = 0; i < 4; i++) { g.fillStyle = RN[i]; g.beginPath(); g.moveTo(0, -2.1); g.lineTo(D4[i][0], D4[i][1]); g.lineTo(D4[(i + 1) % 4][0], D4[(i + 1) % 4][1]); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 0.12; g.beginPath(); g.moveTo(0, -4.2); g.lineTo(0, 0); g.moveTo(-1.7, -2.1); g.lineTo(1.7, -2.1); g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-0.6, -2.9, 0.35, 0.18, -0.6, 0, Math.PI * 2); g.fill();
  // yüzüne çizilmiş minik gülücük (rüyadaki uçurtma)
  g.strokeStyle = 'rgba(120,60,80,0.8)'; g.lineWidth = 0.09; g.beginPath(); g.arc(0.55, -1.5, 0.3, 0.3, Math.PI - 0.3); g.stroke();
  g.fillStyle = 'rgba(120,60,80,0.8)'; g.beginPath(); g.arc(0.35, -1.9, 0.07, 0, Math.PI * 2); g.arc(0.8, -1.95, 0.07, 0, Math.PI * 2); g.fill();
  g.restore();
  // ördek yavrusu oyuncağı: tombul sarı, turuncu gaga, parlak gözler; ara sıra göz kırpar ve kafasını yana eğer
  g.save(); g.translate(ox, oy); g.scale(u * 1.1, u * 1.1);
  const gc = (tm / 4.1) % 1, goz = gc > 0.93 ? 0 : 1, egik = Math.sin(tm * 0.9) * 0.08 + (gc > 0.5 && gc < 0.62 ? Math.sin((gc - 0.5) / 0.12 * Math.PI) * 0.18 : 0);
  g.fillStyle = 'rgba(110,80,40,0.25)'; g.beginPath(); g.ellipse(0, 0.05, 1.3, 0.2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#f2b92a'; g.beginPath(); g.ellipse(0, -0.65, 1.2, 0.72, 0, 0, Math.PI * 2); g.fill();          // gövde (gölge)
  g.fillStyle = '#ffd84a'; g.beginPath(); g.ellipse(-0.05, -0.72, 1.12, 0.64, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-1.0, -0.8); g.lineTo(-1.45, -1.25); g.lineTo(-0.85, -1.05); g.fill();                  // kuyruk
  g.fillStyle = '#ffe58a'; g.beginPath(); g.ellipse(-0.2, -0.8, 0.5, 0.25, -0.2, 0, Math.PI * 2); g.fill();      // kanat
  g.save(); g.translate(0.55, -1.35); g.rotate(egik);
  g.fillStyle = '#ffd84a'; g.beginPath(); g.arc(0, -0.25, 0.62, 0, Math.PI * 2); g.fill();                       // baş
  g.fillStyle = '#ffe9a0'; g.beginPath(); g.arc(-0.15, -0.5, 0.25, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ff9a3c'; g.beginPath(); g.moveTo(0.48, -0.3); g.quadraticCurveTo(1.05, -0.28, 0.95, -0.08); g.quadraticCurveTo(0.7, 0.0, 0.45, -0.1); g.closePath(); g.fill();   // gaga
  if (goz) { g.fillStyle = '#2a1f2e'; g.beginPath(); g.arc(0.22, -0.38, 0.1, 0, Math.PI * 2); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(0.25, -0.42, 0.035, 0, Math.PI * 2); g.fill(); }
  else { g.strokeStyle = '#2a1f2e'; g.lineWidth = 0.07; g.beginPath(); g.moveTo(0.12, -0.38); g.quadraticCurveTo(0.22, -0.45, 0.32, -0.38); g.stroke(); }
  g.fillStyle = 'rgba(255,140,150,0.5)'; g.beginPath(); g.ellipse(0.12, -0.12, 0.14, 0.08, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#ffd84a'; g.beginPath(); g.moveTo(-0.05, -0.85); g.quadraticCurveTo(0.0, -1.15, 0.2, -1.05); g.quadraticCurveTo(0.05, -0.95, 0.1, -0.85); g.fill();   // tepe tüyü
  g.restore();
  g.restore();
  g.restore(); g.globalAlpha = 1;
  // rüya tozu ışıltıları
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i++) {
    const tw = Math.pow(Math.max(0, Math.sin(tm * 1.3 + i * 1.7)), 2), an = i * 1.9 + tm * 0.2, bx = i < 3 ? ux : ox, by = i < 3 ? uy - u * 2.4 : oy - u * 1.2;
    shParilti(shEkranX(bx + Math.cos(an) * u * 1.8), shEkranY(by + Math.sin(an) * u * 1.2), k * (0.9 + 0.6 * ii) * tw, a * tw * 0.9);
  }
  g.globalCompositeOperation = 'source-over';
}

if (typeof SH_KUR !== 'undefined') SH_KUR.kampus = () => {
  const A = { c: null, W, H, adim: [() => { A.c = shTuval(); sh12Fon(A.c.getContext('2d'), W, H); }] };
  return A;
};
