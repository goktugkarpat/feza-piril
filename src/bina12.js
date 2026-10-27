/* bina12.js — Bölüm 12 "Annemle Sabancı'da Bir Gün": gerçek kampüs binalarının stilize çizimleri (BINA ajanı, 2. tur).
   Sabancı Üniversitesi Tuzla kampüsü fotoğraflarından (b12/arastirma) sadeleştirildi; ARKA'nın boyalı resimleriyle aynı sahnede
   uyumlu dursun diye: ışık soldan-üstten (sol yüzler aydınlık, sağ yüzler ve saçak altları gölgede), sıcak gün ışığı, yumuşak
   gölge, pencerelerde gök yansıması, tabanda çalı saçağı. Akşam pencereler yanar (ikinci, "gece" tuvali yumuşakça biner).
   Binalar:
     sbs   — Sabancı İşletme Okulu: kırmızı tuğla + beyaz yatay bantlı kanatlar, beyaz taş kule, yüksek cam atrium.
     sunum — SUNUM (nanoteknoloji merkezi): basık oval gövde, altın baklava kafes cephe, içte kırmızı silindir, taşan disk çatı.
     sera  — botanik bahçesi serası: beyaz ince çerçeveli cam, ortada kubbeli köşk, iki yanda kavisli kanatlar, içi palmiye ve eğrelti.
     yurt  — öğrenci yurdu: beyaz cephe, ince kırmızı tuğla kuşaklar, turuncu kiremit kırma çatı, kırmızı bacalar, ortada merdiven kulesi.
     yurt2 — öğrenci yurdu (ikinci çeşit): terracotta oluklu kaplama, beyaz bantlar, beyaz üst kat, kiremit çatıda güneş panelleri.
     spor  — Spor Merkezi: beyaz martı kanadı çatı, cam üst pencere şeridi, sütunlu revak, köşelerde piramit fenerler (gölet kıyısı).
     fakulte — FENS/FASS tipi fakülte: kırmızı tuğla + beyaz yatay çizgili cephe, bant pencereler, beyaz revak, yarım silindir cam kule.
     pac   — Sabancı Gösteri Merkezi: antrasit dalga çatı, yüksek cam fuaye, çizgili krem cephe, revak (gölet kıyısı).
   Arayüz (ARKA'nın dunya12.js'i çağırır):
     bn12Var(ad) → true/false        bn12Olcu(ad) → {w, h} (olcek 1, katman birimi; tuval kurulmadan da döner)
     bn12Ciz(ad, ctx, x, y, olcek, tm, pus?) → (x, y) = binanın TABAN ORTASI, o anki dönüşümde. Karede yalnız drawImage.
       Gün ilerledikçe sıcak (turuncu) siluet, pus > 0 ise soluk-mavi uzaklık siluet, akşam yanan pencereler biner.
     bn12Isit() → kareye bir tuval kurar; hepsi bitince true (dn12Isit listesine "bitene kadar" adımı olarak girer).
   Performans: her bina bir kez gündüz + bir kez gece tuvaline çizilir (2 px / birim); gradyanlar yalnız kurulumda. */
'use strict';

const BN12_R = 2;                  // önbellek çözünürlüğü (piksel / katman birimi)
const BN12_PAD = 26;               // tuvalin yan ve üst payı (ağaç dalı, gece ışıltısı taşabilsin)
const BN12_ALT = 16;               // taban çizgisinin altındaki pay (çalı saçağı)
const BN12_OLCU = {
  sbs:   { w: 500, h: 200 },
  sunum: { w: 440, h: 160 },
  sera:  { w: 390, h: 168 },
  yurt:  { w: 350, h: 195 },
  yurt2: { w: 310, h: 182 },
  spor:  { w: 420, h: 125 },
  pac:   { w: 440, h: 130 },
  fakulte: { w: 470, h: 176 }
};
const BN12 = { onb: Object.create(null), isit: [], isitAdim: 0, G: false, tohum: 0, tohum2: 0 };

// ── Küçük yardımcılar ──
function bn12Hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function bn12Yum(a, b, x) { const q = Math.max(0, Math.min(1, (x - a) / (b - a))); return q * q * (3 - 2 * q); }
function bn12Kanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
// Sıradaki "rastgele" sayı (aynı bina her kuruluşta aynı çıksın diye tohumlu)
function bn12Sira() { BN12.tohum += 1; return bn12Hash(BN12.tohum * 1.731 + 0.37); }
// İkinci akış (doku, çalı, ağaç): gündüz ve gece kuruluşunda aynı sırayla çağrılır, böylece ağaçlar iki tuvalde aynı yerde kalır
function bn12Sira2() { BN12.tohum2 += 1; return bn12Hash(BN12.tohum2 * 2.417 + 0.91); }

function bn12Var(ad) { return !!BN12_OLCU[ad]; }
function bn12Olcu(ad) { return BN12_OLCU[ad] || null; }

// ── Çizim parçaları (katman biriminde; (0,0) taban ortası, yukarı y eksi) ──
function bnDik(c, x, y, w, h, renk) { c.fillStyle = renk; c.fillRect(x, y, w, h); }
// Duvar: üstü biraz açık, altı biraz koyu dikey geçiş + çok hafif taş dokusu
function bnDuvar(c, x, y, w, h, acik, koyu, doku) {
  const gr = c.createLinearGradient(0, y, 0, y + h);
  gr.addColorStop(0, acik); gr.addColorStop(1, koyu);
  c.fillStyle = gr; c.fillRect(x, y, w, h);
  if (doku === false) return;
  const n = Math.min(900, Math.floor(w * h / 70));
  for (let i = 0; i < n; i++) {
    const px = x + bn12Sira2() * w, py = y + bn12Sira2() * h, k = bn12Sira2();
    c.fillStyle = k > 0.5 ? 'rgba(255,255,255,.10)' : 'rgba(90,60,40,.06)';
    c.fillRect(px, py, 1.2 + k * 2.2, 0.7);
  }
}
// Tuğla: sıcak kırmızı zemin, ince derz çizgileri (uzaktan doku gibi görünür)
function bnTugla(c, x, y, w, h, renk, koyu) {
  bnDuvar(c, x, y, w, h, renk, koyu || renk, false);
  c.fillStyle = 'rgba(70,30,20,.16)';
  for (let yy = y + 2.2; yy < y + h; yy += 2.6) c.fillRect(x, yy, w, 0.45);
  c.fillStyle = 'rgba(255,220,200,.08)';
  for (let yy = y + 1; yy < y + h; yy += 5.2) c.fillRect(x, yy, w, 0.5);
  // rastgele açık/koyu tuğlalar
  const n = Math.floor(w * h / 40);
  for (let i = 0; i < n; i++) {
    const px = x + bn12Sira2() * w, py = y + Math.floor(bn12Sira2() * h / 2.6) * 2.6, k = bn12Sira2();
    c.fillStyle = k > 0.5 ? 'rgba(255,190,160,.12)' : 'rgba(80,30,20,.12)';
    c.fillRect(px, py, 3.2, 2.1);
  }
}
// Cam: gündüz gök yansıması (üstü açık mavi-beyaz, altı derin mavi, çapraz parıltı); gece sıcak sarı ışık (bazısı sönük)
function bnCam(c, x, y, w, h, o) {
  o = o || {};
  if (BN12.G) {
    const yanik = o.yanik !== undefined ? o.yanik : bn12Sira() > 0.28;
    if (yanik) {
      const gr = c.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, '#ffe7a6'); gr.addColorStop(1, '#ffbf62');
      c.save(); c.shadowColor = 'rgba(255,200,110,.9)'; c.shadowBlur = 7 * BN12_R;
      c.fillStyle = gr; c.fillRect(x, y, w, h); c.restore();
      c.fillStyle = 'rgba(255,250,225,.55)'; c.fillRect(x + w * 0.1, y + h * 0.08, w * 0.8, h * 0.14);
    } else {
      bnDik(c, x, y, w, h, '#4d5f7f');
      c.fillStyle = 'rgba(150,175,215,.35)'; c.fillRect(x, y, w, h * 0.3);
    }
    return;
  }
  const gr = c.createLinearGradient(x, y, x + w * 0.3, y + h);
  gr.addColorStop(0, o.ust || '#cde6f4'); gr.addColorStop(0.45, o.orta || '#6f9fc6'); gr.addColorStop(1, o.alt || '#365f86');
  c.fillStyle = gr; c.fillRect(x, y, w, h);
  // çapraz parıltı (gök yansıması)
  if (o.parilti !== false && w > 3 && h > 3) {
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    c.fillStyle = 'rgba(255,255,255,.32)';
    const p = bn12Sira() * 0.5;
    c.beginPath(); c.moveTo(x + w * (0.1 + p), y); c.lineTo(x + w * (0.35 + p), y); c.lineTo(x + w * (0.05 + p), y + h); c.lineTo(x - w * (0.2 - p), y + h); c.closePath(); c.fill();
    c.restore();
  }
}
// Pencere: beyaz çerçeve + cam + (isteğe bağlı) dikey bölmeler + denizlik gölgesi
function bnPencere(c, x, y, w, h, o) {
  o = o || {};
  const cer = o.cerceve || '#f8f5ee', k = o.kalin || 1.3;
  // derinlik: üst ve sol iç kenarda gölge
  bnDik(c, x - k, y - k, w + k * 2, h + k * 2, cer);
  bnCam(c, x, y, w, h, o);
  c.fillStyle = 'rgba(40,50,70,.28)'; c.fillRect(x, y, w, 1.1); c.fillRect(x, y, 0.9, h);
  const bol = o.bolme || 0;
  c.fillStyle = cer;
  for (let i = 1; i <= bol; i++) c.fillRect(x + (w * i) / (bol + 1) - 0.5, y, 1, h);
  if (o.yatay) c.fillRect(x, y + h * o.yatay - 0.5, w, 1);
  if (o.denizlik !== false) { bnDik(c, x - k - 0.6, y + h + k - 0.2, w + k * 2 + 1.2, 1.4, '#ffffff'); c.fillStyle = 'rgba(60,40,30,.22)'; c.fillRect(x - k, y + h + k + 1.2, w + k * 2, 1.2); }
}
// Saçak / bant gölgesi: bandın hemen altına yumuşak koyu şerit
function bnGolgeAlt(c, x, y, w, boy, guc) {
  const gr = c.createLinearGradient(0, y, 0, y + boy);
  gr.addColorStop(0, 'rgba(50,35,40,' + (guc || 0.28) + ')'); gr.addColorStop(1, 'rgba(50,35,40,0)');
  c.fillStyle = gr; c.fillRect(x, y, w, boy);
}
// Bütün binaya: soldan sağa hafif ışık düşüşü + tabanda yumuşak gölge (yalnız zaten boyanmış piksellere: source-atop)
function bnIsikGolge(c, w, h) {
  c.save(); c.globalCompositeOperation = 'source-atop';
  // sol üstten sıcak güneş → sağ altta serin gölge (çapraz, boyalı resimlerdeki gibi)
  const gr = c.createLinearGradient(-w / 2, -h, w / 2, 0);
  gr.addColorStop(0, 'rgba(255,234,190,.24)'); gr.addColorStop(0.45, 'rgba(255,234,190,0)'); gr.addColorStop(0.7, 'rgba(70,60,110,0)'); gr.addColorStop(1, 'rgba(70,60,110,.16)');
  c.fillStyle = gr; c.fillRect(-w / 2 - BN12_PAD, -h - BN12_PAD, w + BN12_PAD * 2, h + BN12_PAD);
  // öndeki ağaçların cepheye düşen benekli yumuşak gölgeleri (alt üçte birde)
  for (let i = 0; i < Math.floor(w / 9); i++) {
    const x = -w / 2 + bn12Sira2() * w, y = -h * (0.08 + bn12Sira2() * 0.3), r = 5 + bn12Sira2() * 11;
    c.fillStyle = 'rgba(60,70,60,' + (0.022 + bn12Sira2() * 0.03).toFixed(3) + ')';
    c.beginPath(); c.ellipse(x, y, r * 1.3, r * 0.8, 0, 0, Math.PI * 2); c.fill();
  }
  const ao = c.createLinearGradient(0, -26, 0, 0);
  ao.addColorStop(0, 'rgba(50,40,40,0)'); ao.addColorStop(1, 'rgba(50,40,40,.22)');
  c.fillStyle = ao; c.fillRect(-w / 2 - BN12_PAD, -26, w + BN12_PAD * 2, 26);
  if (BN12.G) { c.fillStyle = 'rgba(40,40,80,.10)'; c.fillRect(-w / 2 - BN12_PAD, -h - BN12_PAD, w + BN12_PAD * 2, h + BN12_PAD); }
  c.restore();
}
// Yaprak paleti (ARKA'nın ağaçlarıyla aynı aile): koyu gölge → güneşli açık
const BN12_YAPRAK = ['#3f7840', '#4d8a45', '#5f9c4b', '#77b052', '#95c55e', '#bcdc76'];
// Çalı saçağı: tabanda yuvarlak kümeler, soldan-üstten aydınlık; ara sıra çiçek
function bnCali(c, x0, x1, y, boy, cicekler) {
  for (let x = x0; x < x1; x += 7 + bn12Sira2() * 6) {
    const r = boy * (0.55 + bn12Sira2() * 0.6);
    for (let k = 0; k < 11; k++) {
      const a = Math.PI * (1 + bn12Sira2()), rr = bn12Sira2() * r;
      const xx = x + Math.cos(a) * rr * 1.3, yy = y + Math.sin(a) * rr * 0.9 + 2;
      const isik = Math.max(0, Math.min(5, Math.round(2.3 - Math.cos(a) * 1.3 - Math.sin(a) * 1.5 + bn12Sira2() * 1.2)));
      c.fillStyle = BN12_YAPRAK[isik];
      c.beginPath(); c.ellipse(xx, yy, 3 + bn12Sira2() * 3.5, 2.5 + bn12Sira2() * 2.5, 0, 0, Math.PI * 2); c.fill();
    }
    if (cicekler && bn12Sira2() > 0.55) {
      c.fillStyle = cicekler[Math.floor(bn12Sira2() * cicekler.length)];
      for (let k = 0; k < 5; k++) { c.beginPath(); c.arc(x + (bn12Sira2() - 0.5) * r * 1.8, y - bn12Sira2() * r * 0.8, 1 + bn12Sira2() * 0.9, 0, Math.PI * 2); c.fill(); }
    }
  }
}
// Ağaç paletleri (ARKA'nın boyalı resimlerindeki gibi: güneşli sarımsı uçlar, pembe sakura)
const BN12_PAL = {
  yesil: ['#3f7a45', '#4f8f4c', '#67a656', '#86bd5f', '#a9d26b', '#d4ea86'],
  sari:  ['#56853f', '#6c9c44', '#86b24c', '#a3c856', '#c4de66', '#e8f08e'],
  kiraz: ['#b8697f', '#cf8398', '#e3a0b2', '#efbcc8', '#f8d6dc', '#fff0ef'],
  cam:   ['#24492f', '#2e5b37', '#3a6c40', '#4a7f4a', '#5c9154', '#79a865']
};
// Yuvarlak taçlı ağaç (ön bahçe): gövde + dallar, koyu iç kütle, güneşli yaprak kümeleri
function bnAgac(c, x, y, s, pal) {
  pal = typeof pal === 'string' ? BN12_PAL[pal] : (pal || BN12_PAL.yesil);
  c.strokeStyle = '#6a5040'; c.lineCap = 'round'; c.lineWidth = 2.6 * s;
  c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 1.5 * s, y - 18 * s, x + 1 * s, y - 30 * s); c.stroke();
  c.lineWidth = 1.3 * s;
  for (const [dx, dy] of [[-9, -40], [8, -42], [-3, -48]]) { c.beginPath(); c.moveTo(x, y - 24 * s); c.quadraticCurveTo(x + dx * 0.4 * s, y - 34 * s, x + dx * s, y + dy * s); c.stroke(); }
  const cx = x, cy = y - 40 * s, rx = 19 * s, ry = 16 * s;
  c.fillStyle = pal[0]; c.beginPath(); c.ellipse(cx + 1.5 * s, cy + 2 * s, rx * 0.88, ry * 0.82, 0, 0, Math.PI * 2); c.fill();
  for (let i = 0; i < 110; i++) {
    const a = i * 2.39996, rr = Math.sqrt(bn12Sira2()) * 0.98;
    const xx = cx + Math.cos(a) * rr * rx, yy = cy + Math.sin(a) * rr * ry * (Math.sin(a) > 0 ? 0.9 : 1.05);
    const isik = Math.max(0, Math.min(5, Math.round(2.4 - Math.cos(a) * rr * 1.5 - Math.sin(a) * rr * 1.7 + bn12Sira2() * 1.3)));
    const r = (2.2 + bn12Sira2() * 2.8) * s;
    c.fillStyle = pal[isik]; c.beginPath(); c.ellipse(xx, yy, r, r * 0.78, 0, 0, Math.PI * 2); c.fill();
  }
  c.fillStyle = pal[5];
  for (let i = 0; i < 14; i++) { const a = Math.PI * (1.05 + bn12Sira2() * 0.9), rr = 0.55 + bn12Sira2() * 0.4; c.beginPath(); c.ellipse(cx + Math.cos(a) * rr * rx, cy + Math.sin(a) * rr * ry, 1.4 * s, 1 * s, 0, 0, Math.PI * 2); c.fill(); }
}
// Palmiye (kampüste Washingtonia ve Trachycarpus var): ince gövde, yelpaze yapraklar
function bnPalmiye(c, x, y, s) {
  // gövde: hafif kavisli, halka halka
  c.strokeStyle = '#8a6d52'; c.lineWidth = 3.4 * s; c.lineCap = 'round';
  c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 5 * s, y - 30 * s, x + 2 * s, y - 58 * s); c.stroke();
  c.strokeStyle = 'rgba(70,50,35,.35)'; c.lineWidth = 0.8 * s;
  for (let k = 6; k < 56; k += 3.5) { const ox = Math.sin(k / 58 * Math.PI) * 3 * s; c.beginPath(); c.moveTo(x - 1.5 * s + ox, y - k * s); c.lineTo(x + 1.7 * s + ox, y - (k + 1.2) * s); c.stroke(); }
  const tx = x + 2 * s, ty = y - 58 * s;
  // yapraklar: sivri uçlu, sarkan, dolgulu dilimler (arkadakiler koyu, öndekiler açık)
  const yap = (a, L, renk) => {
    const ex = tx + Math.cos(a) * L, ey = ty + Math.sin(a) * L * 0.55 + Math.abs(Math.cos(a)) * L * 0.42;
    const mx = tx + Math.cos(a) * L * 0.55, my = ty + Math.sin(a) * L * 0.55 - 4 * s;
    const nx = -Math.sin(a), ny = Math.cos(a), gen = 3.6 * s;
    c.fillStyle = renk; c.beginPath(); c.moveTo(tx, ty);
    c.quadraticCurveTo(mx + nx * gen, my + ny * gen, ex, ey);
    c.quadraticCurveTo(mx - nx * gen, my - ny * gen, tx, ty); c.fill();
    c.strokeStyle = 'rgba(40,70,40,.35)'; c.lineWidth = 0.5 * s; c.beginPath(); c.moveTo(tx, ty); c.quadraticCurveTo(mx, my, ex, ey); c.stroke();
  };
  for (let i = 0; i < 9; i++) yap(-Math.PI + (i / 8) * Math.PI + (bn12Sira2() - 0.5) * 0.2, (20 + bn12Sira2() * 6) * s, BN12_YAPRAK[1 + (i % 2)]);
  for (let i = 0; i < 7; i++) yap(-Math.PI * 0.92 + (i / 6) * Math.PI * 0.84 + (bn12Sira2() - 0.5) * 0.2, (16 + bn12Sira2() * 6) * s, BN12_YAPRAK[3 + (i % 3)]);
  c.fillStyle = '#7a5e44'; c.beginPath(); c.arc(tx, ty, 2.2 * s, 0, Math.PI * 2); c.fill();
}

// ══════════════ SBS — Sabancı İşletme Okulu ══════════════
// Kırmızı tuğla kanat (beyaz kat bantları, beyaz pencere alınlıkları), beyaz taş merdiven kulesi (köşeleri cam yarıklı),
// gök yansıtan yüksek cam atrium (koyu kayıtlar), sağda gölgede kalan ikinci tuğla kanat; önde beyaz korkuluk, sarmaşık, fidanlar.
function bn12CizSbs(c) {
  const TUG = '#c9683f', TUGK = '#b2563a', KREM = '#f1ebdf', KREMK = '#ddd4c4';
  // Arka çatı (alçak gri metal kırma çatı, parapetin arkasından görünür)
  c.fillStyle = '#9aa3a9'; c.beginPath(); c.moveTo(-246, -148); c.lineTo(-234, -159); c.lineTo(-72, -159); c.lineTo(-62, -148); c.closePath(); c.fill();
  c.fillStyle = '#b4bcc1'; c.fillRect(-234, -159, 162, 1.6);
  // Sol tuğla kanat
  bnTugla(c, -248, -148, 190, 148, TUG, TUGK);
  // kat bantları ve parapet
  for (const yb of [-48, -96]) { bnDuvar(c, -248, yb - 3, 190, 7, KREM, KREMK, false); bnGolgeAlt(c, -248, yb + 4, 190, 3, 0.22); }
  bnDuvar(c, -250, -150, 194, 9, '#f7f2e8', KREMK, false); bnGolgeAlt(c, -248, -141, 190, 4, 0.3);
  // zemin kat: geniş pencereler (4 bölmeli), tuğla payandalar arasında
  for (let x = -242; x < -70; x += 34) bnPencere(c, x, -40, 26, 30, { bolme: 2, yatay: 0.3, denizlik: false });
  // 1. kat: bant pencereler + üstte beyaz pano
  for (let x = -242; x < -70; x += 34) { bnDik(c, x - 1.3, -91, 28.6, 7, KREM); bnPencere(c, x, -82, 26, 22, { bolme: 2 }); }
  // 2. kat: ikişer dik pencere, üstlerinde beyaz kare alınlık
  for (let x = -242; x < -70; x += 34) for (const dx of [2, 15]) { bnDik(c, x + dx - 1.3, -139, 11.6, 8, KREM); bnPencere(c, x + dx, -130, 9, 24, { yatay: 0.35 }); }
  // Beyaz taş kule (köşe cam yarıklı)
  const KX0 = -60, KX1 = -8, KY = -198;
  bnDuvar(c, KX0, KY, KX1 - KX0, -KY, '#f4f0e8', '#e2dccf');
  bnCam(c, KX0, KY + 14, 9, -KY - 30, { ust: '#d6ecf8', orta: '#6f9cc4', alt: '#3e6a92' });
  bnCam(c, KX1 - 8, KY + 14, 8, -KY - 30, { ust: '#c4dcec', orta: '#5e88ad', alt: '#36597b' });
  c.fillStyle = '#5b6770'; for (let y = KY + 26; y < -18; y += 14) { c.fillRect(KX0, y, 9, 0.9); c.fillRect(KX1 - 8, y, 8, 0.9); }
  // kule tepesi: ince saçak + gölgesi; ortada yumuşak ışık lekeleri (fotoğraftaki yuvarlak yansımalar)
  bnDik(c, KX0 - 2, KY - 3, KX1 - KX0 + 4, 5, '#fbf8f2'); bnGolgeAlt(c, KX0, KY + 2, KX1 - KX0, 4, 0.25);
  if (!BN12.G) { c.fillStyle = 'rgba(255,255,255,.35)'; for (const yy of [-150, -118]) { c.beginPath(); c.ellipse(-30, yy, 4, 9, 0, 0, Math.PI * 2); c.fill(); c.beginPath(); c.ellipse(-20, yy + 2, 3.5, 8, 0, 0, Math.PI * 2); c.fill(); } }
  // Cam atrium: tek büyük gök yansıması + bulut yansımaları, üstüne koyu kayıt ızgarası
  const AX0 = -8, AX1 = 152, AY = -180;
  if (BN12.G) {
    bnDik(c, AX0, AY, AX1 - AX0, -AY, '#55607e');
    // katlar: yanan odalar
    for (let y = AY + 6; y < -10; y += 34) for (let x = AX0 + 2; x < AX1 - 4; x += 32) bnCam(c, x, y, 30, 26);
  } else {
    const gr = c.createLinearGradient(AX0, AY, AX0 + 60, 0);
    gr.addColorStop(0, '#eaf5fb'); gr.addColorStop(0.35, '#a9d0ea'); gr.addColorStop(0.75, '#6e9dc6'); gr.addColorStop(1, '#4b7aa3');
    c.fillStyle = gr; c.fillRect(AX0, AY, AX1 - AX0, -AY);
    // bulut yansımaları
    c.fillStyle = 'rgba(255,255,255,.42)';
    for (const [bx, by, br] of [[30, -150, 16], [48, -146, 12], [16, -144, 10], [110, -118, 14], [126, -114, 10], [96, -112, 9]]) { c.beginPath(); c.ellipse(bx, by, br * 1.4, br * 0.6, 0, 0, Math.PI * 2); c.fill(); }
    // birkaç pano daha koyu / daha açık (cam düzensizliği)
    for (let y = AY; y < -14; y += 15) for (let x = AX0; x < AX1; x += 16) { const k = bn12Sira(); if (k > 0.82) { c.fillStyle = 'rgba(30,60,100,.16)'; c.fillRect(x, y, 16, 15); } else if (k < 0.1) { c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x, y, 16, 15); } }
  }
  c.fillStyle = '#3e4a55';
  for (let x = AX0; x <= AX1; x += 16) c.fillRect(x - 0.7, AY, 1.4, -AY);
  for (let y = AY; y < 0; y += 15) c.fillRect(AX0, y - 0.6, AX1 - AX0, 1.2);
  // kat döşemeleri (biraz kalın)
  for (let y = AY + 45; y < 0; y += 45) c.fillRect(AX0, y - 1.2, AX1 - AX0, 2.4);
  bnDik(c, AX0 - 2, AY - 4, AX1 - AX0 + 4, 5, '#f4f0e8'); bnGolgeAlt(c, AX0, AY + 1, AX1 - AX0, 4, 0.3);
  // giriş kapısı ve küçük saçak
  bnDik(c, 58, -30, 30, 30, '#f4f0e8');
  bnCam(c, 61, -27, 11, 27, { ust: '#9fc0d8', orta: '#56799a', alt: '#33506c', yanik: true });
  bnCam(c, 74, -27, 11, 27, { ust: '#9fc0d8', orta: '#56799a', alt: '#33506c', yanik: true });
  bnDik(c, 54, -34, 38, 3.5, '#fbf8f2'); bnGolgeAlt(c, 56, -30.5, 34, 3, 0.25);
  // Sağ tuğla kanat (gölgede, biraz geride)
  bnTugla(c, 152, -142, 98, 142, '#b75c3b', '#a14d34');
  for (const yb of [-46, -92]) { bnDuvar(c, 152, yb - 3, 98, 7, KREMK, '#cfc5b3', false); bnGolgeAlt(c, 152, yb + 4, 98, 3, 0.22); }
  bnDuvar(c, 152, -144, 100, 8, '#ebe4d6', '#d3cab9', false); bnGolgeAlt(c, 152, -136, 98, 4, 0.3);
  for (let x = 158; x < 244; x += 30) { bnPencere(c, x, -38, 22, 28, { bolme: 1, cerceve: '#ece6da', denizlik: false }); bnDik(c, x - 1.3, -88, 24.6, 6, KREMK); bnPencere(c, x, -80, 22, 22, { bolme: 1, cerceve: '#ece6da' }); bnPencere(c, x + 5, -128, 12, 24, { cerceve: '#ece6da', yatay: 0.35 }); }
  // kanatlar arası gölge (atriumun sağ kenarı kanadın önünde)
  bnGolgeAlt(c, 152, -142, 6, 142, 0); c.fillStyle = 'rgba(40,30,40,.18)'; c.fillRect(152, -142, 4, 142);
  bnIsikGolge(c, 500, 200);
  // Önde: sarmaşık / çalılar, genç ağaçlar, beyaz korkuluk
  bnAgac(c, -232, 3, 1.9, 'sari'); bnAgac(c, -150, 3, 1.5, 'kiraz'); bnAgac(c, 26, 3, 1.35, 'yesil'); bnAgac(c, 196, 3, 1.7, 'kiraz'); bnAgac(c, 246, 3, 1.5, 'yesil');
  bnCali(c, -252, 252, -2, 11, ['#f6b7c8', '#ffffff', '#f7d36b']);
  c.fillStyle = '#fbfaf6';
  c.fillRect(-250, -14, 500, 1.4); c.fillRect(-250, -7, 500, 0.9);
  for (let x = -250; x <= 250; x += 5) c.fillRect(x - 0.4, -14, 0.8, 13);
}

// ══════════════ SUNUM — Nanoteknoloji Araştırma ve Uygulama Merkezi ══════════════
// Basık oval gövde; dört bir yanı altın renkli baklava (elmas) kafes, arkasında cam ve içte kırmızı silindir çekirdek;
// gövdeden geniş taşan ince elips disk çatı; çatının arkasından küçük testere dişli tepe ışığı görünür.
function bn12CizSunum(c) {
  const RX = 184, UST = -98, ALT = 0, EGRI = 7;   // gövde yarıçapı, üst/alt, alt kenarın öne doğru kavisi
  const xU = u => RX * Math.sin(u * Math.PI / 2);                    // u -1..1 → ekran x (silindir izdüşümü)
  const yAlt = u => ALT + EGRI * Math.cos(u * Math.PI / 2) - EGRI;    // alt kenar kavisi
  const yUst = u => UST + EGRI * 0.6 * Math.cos(u * Math.PI / 2);
  // Tepe ışığı (çatının üstünde, arkada)
  c.fillStyle = BN12.G ? '#ffd88a' : '#c9d6df';
  c.beginPath(); c.moveTo(30, -112);
  for (let i = 0; i <= 12; i++) { const x = 30 + i * 6.5; c.lineTo(x, i % 2 ? -128 : -116); }
  c.lineTo(108, -112); c.closePath(); c.fill();
  c.strokeStyle = '#eef1f2'; c.lineWidth = 1; c.stroke();
  // Gövde silüeti (kırpma yolu)
  const govde = new Path2D();
  govde.moveTo(xU(-1), yUst(-1));
  for (let i = -20; i <= 20; i++) { const u = i / 20; govde.lineTo(xU(u), yUst(u)); }
  for (let i = 20; i >= -20; i--) { const u = i / 20; govde.lineTo(xU(u), yAlt(u)); }
  govde.closePath();
  c.save(); c.clip(govde);
  // Cam arka plan: gündüz turkuaz-mavi gök yansıması, gece sıcak iç ışık
  if (BN12.G) {
    const gr = c.createLinearGradient(0, UST, 0, ALT);
    gr.addColorStop(0, '#ffe2a0'); gr.addColorStop(1, '#ffb866');
    c.fillStyle = gr; c.fillRect(-RX, UST - 10, RX * 2, -UST + 20);
  } else {
    const gr = c.createLinearGradient(-RX, UST, RX * 0.4, ALT);
    gr.addColorStop(0, '#e6f4f8'); gr.addColorStop(0.4, '#a3d0e4'); gr.addColorStop(1, '#5f93b8');
    c.fillStyle = gr; c.fillRect(-RX, UST - 10, RX * 2, -UST + 20);
  }
  // içte kırmızı silindir çekirdek (cam arkasından)
  const kg = c.createLinearGradient(-34, 0, 34, 0);
  kg.addColorStop(0, '#e2685a'); kg.addColorStop(0.45, '#cf4a3f'); kg.addColorStop(1, '#9e3330');
  c.globalAlpha = BN12.G ? 0.95 : 0.78; c.fillStyle = kg; c.fillRect(-34, UST, 68, -UST); c.globalAlpha = 1;
  c.fillStyle = 'rgba(255,255,255,.25)'; for (let x = -30; x < 34; x += 6) c.fillRect(x, UST, 1, -UST);
  // ara kat döşemesi ve tavan ışıkları
  c.fillStyle = BN12.G ? '#c98d55' : '#e9eef0'; c.fillRect(-RX, -50, RX * 2, 3.2);
  c.fillStyle = BN12.G ? '#fff6dc' : 'rgba(255,255,255,.8)';
  for (let x = -RX + 8; x < RX; x += 14) { c.fillRect(x, -94, 4, 1.4); c.fillRect(x + 6, -46, 4, 1.4); }
  // içeride birkaç saksı bitkisi (fotoğraftaki gibi)
  for (const x of [-120, -86, 70, 104, 140]) { c.fillStyle = '#c98a5a'; c.fillRect(x - 4, -10, 8, 8); bnAgac(c, x, -10, 0.42, 'yesil'); }
  // gündüz gök yansıması: yumuşak bulut ve çapraz parıltı
  if (!BN12.G) {
    c.fillStyle = 'rgba(255,255,255,.35)';
    for (const [bx, by, br] of [[-120, -80, 18], [-96, -76, 12], [40, -70, 16], [62, -66, 10]]) { c.beginPath(); c.ellipse(bx, by, br * 1.5, br * 0.55, 0, 0, Math.PI * 2); c.fill(); }
  }
  // Baklava kafes: iki çapraz çizgi ailesi, silindir izdüşümüyle kenarlara doğru sıklaşır
  const N = 30, D = 2 / N, SAT = 2, HY = (ALT - UST) / SAT;   // iki sıra baklava
  for (const yon of [1, -1]) {
    for (let k = -N - 2; k <= N + 2; k++) {
      const u0 = k * D;
      for (let s = 0; s < 14; s++) {
        const v0 = s / 14, v1 = (s + 1) / 14;                    // 0 alt → 1 üst
        const ua = u0 + yon * v0 * SAT * D / 2 * 2, ub = u0 + yon * v1 * SAT * D / 2 * 2;
        if (Math.abs(ua) > 1.02 && Math.abs(ub) > 1.02) continue;
        const ca = Math.max(-1, Math.min(1, ua)), cb = Math.max(-1, Math.min(1, ub));
        const xa = xU(ca), xb = xU(cb);
        const ya = yAlt(ca) + (yUst(ca) - yAlt(ca)) * v0, yb = yAlt(cb) + (yUst(cb) - yAlt(cb)) * v1;
        const m = (ca + cb) / 2, on = Math.cos(m * Math.PI / 2);   // kenarlarda ince
        const isik = BN12.G ? 0 : 0.5 - m * 0.5;                 // sol aydınlık
        c.strokeStyle = BN12.G ? '#6f5435' : (isik > 0.55 ? '#e6c78d' : isik > 0.35 ? '#d2ae72' : '#b48f59');
        c.lineWidth = 1.2 + 3 * on;
        c.beginPath(); c.moveTo(xa, ya); c.lineTo(xb, yb); c.stroke();
      }
      void HY;
    }
  }
  // kafesin alt ve üst çember kirişleri
  c.restore();
  c.lineCap = 'round';
  c.strokeStyle = BN12.G ? '#6f5435' : '#c9a56b'; c.lineWidth = 3;
  c.beginPath(); for (let i = -20; i <= 20; i++) { const u = i / 20; if (i === -20) c.moveTo(xU(u), yUst(u)); else c.lineTo(xU(u), yUst(u)); } c.stroke();
  c.strokeStyle = BN12.G ? '#5b4630' : '#a9875a'; c.lineWidth = 2.4;
  c.beginPath(); for (let i = -20; i <= 20; i++) { const u = i / 20; if (i === -20) c.moveTo(xU(u), yAlt(u) - 1); else c.lineTo(xU(u), yAlt(u) - 1); } c.stroke();
  // Disk çatı: alttan görülen elips (gölgeli alt yüz) + beyaz kenar
  const CX = 18, CY = -106, CRX = 222, CRY = 10;
  const sg = c.createLinearGradient(0, CY - CRY, 0, CY + CRY);
  sg.addColorStop(0, BN12.G ? '#8e8d9a' : '#e4e8ea'); sg.addColorStop(1, BN12.G ? '#a59584' : '#c2c9cf');
  c.fillStyle = sg; c.beginPath(); c.ellipse(CX, CY, CRX, CRY, 0, 0, Math.PI * 2); c.fill();
  // gece: çatı altına vuran sıcak ışık
  if (BN12.G) { c.fillStyle = 'rgba(255,200,120,.35)'; c.beginPath(); c.ellipse(CX - 10, CY + 6, CRX * 0.8, CRY * 0.5, 0, 0, Math.PI * 2); c.fill(); }
  c.strokeStyle = '#f6f7f5'; c.lineWidth = 3.4; c.beginPath(); c.ellipse(CX, CY, CRX, CRY, 0, 0, Math.PI * 2); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(CX, CY - 1.6, CRX - 1, CRY - 0.6, 0, Math.PI * 1.05, Math.PI * 1.75); c.stroke();
  // çatının gövdeye düşen gölgesi
  c.save(); c.clip(govde); bnGolgeAlt(c, -RX, UST, RX * 2, 12, 0.32); c.restore();
  bnIsikGolge(c, 440, 160);
  // Tabanda: taş kaide, çalılar, iki yanda ağaçlar
  bnDik(c, -RX - 6, -3, RX * 2 + 12, 4, '#e7e1d4');
  bnAgac(c, -210, 3, 1.8, 'sari'); bnAgac(c, -176, 3, 1.3, 'kiraz'); bnAgac(c, 206, 3, 1.6, 'yesil'); bnAgac(c, 236, 3, 1.25, 'kiraz');
  bnCali(c, -226, 228, -1, 10, ['#ffffff', '#f7d36b', '#f3a7bf']);
}

// ══════════════ SERA — botanik bahçesi serası ══════════════
// Ortada kubbeli köşk (fenerli), iki yanda yukarı kavisli cam kanatlar; ince beyaz çelik kayıtlar, taş + tuğla şeritli kaide;
// camın arkasında palmiye, muz yaprağı, eğrelti, kırmızı-pembe çiçekler; dışarıda iki palmiye ve çiçekli çalılar.
function bn12CizSera(c) {
  const KAIDE = -14, KANAT_UC = -48, KANAT_IC = -88, KOSK_X = 62, KOSK_UST = -96, KUBBE_RX = 56, KUBBE_RY = 46;
  const kanatY = ax => { const u = (ax - KOSK_X) / (190 - KOSK_X); return KANAT_IC + (KANAT_UC - KANAT_IC) * (u * u * 0.35 + u * 0.65); };   // ax = |x|
  // Seranın cam silüeti
  const cam = new Path2D();
  cam.moveTo(-190, KAIDE); cam.lineTo(-190, KANAT_UC);
  for (let x = -190; x <= -KOSK_X; x += 4) cam.lineTo(x, kanatY(-x));
  cam.lineTo(-KOSK_X, KOSK_UST);
  for (let i = 0; i <= 24; i++) { const a = Math.PI + (i / 24) * Math.PI; cam.lineTo(Math.cos(a) * KUBBE_RX, KOSK_UST + Math.sin(a) * KUBBE_RY); }
  cam.lineTo(KOSK_X, KOSK_UST);
  for (let x = KOSK_X; x <= 190; x += 4) cam.lineTo(x, kanatY(x));
  cam.lineTo(190, KAIDE); cam.closePath();
  c.save(); c.clip(cam);
  // iç: yeşilimsi sıcak hava (gündüz) / altın ışık (gece)
  const ig = c.createLinearGradient(0, -150, 0, 0);
  if (BN12.G) { ig.addColorStop(0, '#ffe7b0'); ig.addColorStop(1, '#f6c47a'); } else { ig.addColorStop(0, '#cdebe0'); ig.addColorStop(0.6, '#9fd0b4'); ig.addColorStop(1, '#79b48f'); }
  c.fillStyle = ig; c.fillRect(-195, -150, 390, 150);
  // iç bitkiler: arkada koyu, önde açık
  const PALI = BN12.G ? ['#4d6a3e', '#5d7d45', '#6f9050', '#85a35a', '#9fb767', '#b9cc7a'] : BN12_YAPRAK;
  c.globalAlpha = 0.95;
  bnPalmiye(c, -10, -10, 1.75); bnPalmiye(c, 28, -10, 1.35); bnPalmiye(c, -44, -10, 1.15);
  bnPalmiye(c, -128, -10, 0.85); bnPalmiye(c, 132, -10, 0.8);
  // muz / dev yapraklar
  for (const [x, s, yon] of [[-150, 1, 1], [-112, 0.85, -1], [104, 0.95, 1], [150, 1.1, -1], [-70, 0.8, 1], [70, 0.9, -1]]) {
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + yon * (0.25 + i * 0.28), L = (26 + i * 3) * s;
      c.fillStyle = PALI[1 + (i % 4)];
      c.beginPath(); c.ellipse(x + Math.cos(a) * L * 0.5, -12 + Math.sin(a) * L * 0.5, L * 0.5, 4.5 * s, a, 0, Math.PI * 2); c.fill();
    }
  }
  // eğrelti ve çiçekler (alt sıra)
  bnCali(c, -186, 186, -14, 9, BN12.G ? ['#ffd2a0', '#ff9f80'] : ['#e8556a', '#f49ac0', '#ffffff', '#f7c548']);
  c.globalAlpha = 1;
  // cam katmanı: gök yansıması (gündüz) — yarı saydam
  if (!BN12.G) {
    const yg = c.createLinearGradient(-190, -150, 60, 0);
    yg.addColorStop(0, 'rgba(236,248,255,.55)'); yg.addColorStop(0.5, 'rgba(190,222,242,.22)'); yg.addColorStop(1, 'rgba(150,195,225,.12)');
    c.fillStyle = yg; c.fillRect(-195, -150, 390, 150);
    c.fillStyle = 'rgba(255,255,255,.32)';
    for (const x0 of [-170, -120, -30, 90, 150]) { c.beginPath(); c.moveTo(x0, -150); c.lineTo(x0 + 16, -150); c.lineTo(x0 - 24, 0); c.lineTo(x0 - 40, 0); c.closePath(); c.fill(); }
  } else {
    c.fillStyle = 'rgba(255,240,200,.18)'; c.fillRect(-195, -150, 390, 150);
  }
  c.restore();
  // Kayıtlar (ince beyaz çelik)
  const BEYAZ = BN12.G ? '#e9dcc4' : '#fbfbf7';
  c.strokeStyle = BEYAZ; c.lineCap = 'round';
  c.lineWidth = 1.35;
  // kanat dikmeleri ve yatay kuşak
  for (let x = -184; x <= 184; x += 10.5) {
    const ax = Math.abs(x); if (ax < KOSK_X + 2) continue;
    c.beginPath(); c.moveTo(x, KAIDE); c.lineTo(x, kanatY(ax)); c.stroke();
  }
  for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(s * 190, -34); c.lineTo(s * KOSK_X, -34); c.stroke();
    // kavisli çatı kenarı (kalın)
    c.lineWidth = 2.6; c.beginPath(); c.moveTo(s * 190, KANAT_UC);
    for (let x = 190; x >= KOSK_X; x -= 4) c.lineTo(s * x, kanatY(x));
    c.stroke(); c.lineWidth = 1.1;
    // kanat çatısındaki yatay çizgiler (çatının cam kuşakları)
    for (const k of [0.33, 0.66]) { c.beginPath(); for (let x = 190; x >= KOSK_X; x -= 6) { const y = kanatY(x) + (KANAT_UC - kanatY(x)) * 0 + 6 * k; if (x === 190) c.moveTo(s * x, y + 4); else c.lineTo(s * x, y + 4 + k * 2); } c.stroke(); }
  }
  // köşk: dikmeler, kuşaklar, saçak
  for (let x = -KOSK_X; x <= KOSK_X; x += 10.3) { c.beginPath(); c.moveTo(x, KAIDE); c.lineTo(x, KOSK_UST); c.stroke(); }
  for (const y of [-40, -68]) { c.beginPath(); c.moveTo(-KOSK_X, y); c.lineTo(KOSK_X, y); c.stroke(); }
  c.lineWidth = 2.4; c.strokeRect(-KOSK_X, KOSK_UST, KOSK_X * 2, -KOSK_UST + KAIDE);
  bnDik(c, -KOSK_X - 4, KOSK_UST - 3, KOSK_X * 2 + 8, 4, BEYAZ);
  // kubbe: meridyenler ve paraleller
  c.lineWidth = 1.1;
  for (let k = -4; k <= 4; k++) {
    const s = k / 5; c.beginPath();
    for (let i = 0; i <= 16; i++) { const f = (i / 16) * Math.PI / 2; const x = KUBBE_RX * s * Math.cos(f), y = KOSK_UST - 3 - KUBBE_RY * Math.sin(f); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
    c.stroke();
  }
  for (const f of [0.35, 0.7, 1.05]) { const r = KUBBE_RX * Math.cos(f), y = KOSK_UST - 3 - KUBBE_RY * Math.sin(f); c.beginPath(); c.ellipse(0, y, r, 2.4, 0, 0, Math.PI); c.stroke(); }
  c.lineWidth = 2.4; c.beginPath(); c.ellipse(0, KOSK_UST - 3, KUBBE_RX, KUBBE_RY, 0, Math.PI, Math.PI * 2); c.stroke();
  // fener ve tepe topuzu
  const FY = KOSK_UST - 3 - KUBBE_RY;
  bnDik(c, -9, FY - 10, 18, 10, BEYAZ);
  bnCam(c, -6.5, FY - 8, 5.5, 7, { parilti: false, yanik: true }); bnCam(c, 1, FY - 8, 5.5, 7, { parilti: false, yanik: true });
  c.fillStyle = BEYAZ; c.beginPath(); c.ellipse(0, FY - 10, 11, 6, 0, Math.PI, Math.PI * 2); c.fill();
  c.fillRect(-0.8, FY - 22, 1.6, 7); c.beginPath(); c.arc(0, FY - 23, 2.2, 0, Math.PI * 2); c.fill();
  // köşelerde küçük topuzlu süs dikmeleri
  for (const x of [-190, -KOSK_X, KOSK_X, 190]) { const y = Math.abs(x) === 190 ? KANAT_UC : KOSK_UST - 3; c.fillRect(x - 0.7, y - 7, 1.4, 7); c.beginPath(); c.arc(x, y - 8, 1.8, 0, Math.PI * 2); c.fill(); }
  // kapı: kemerli, iki kanat
  c.fillStyle = BEYAZ; c.beginPath(); c.moveTo(-13, KAIDE); c.lineTo(-13, -38); c.arc(0, -38, 13, Math.PI, 0); c.lineTo(13, KAIDE); c.closePath(); c.fill();
  c.save(); c.beginPath(); c.moveTo(-10.5, KAIDE); c.lineTo(-10.5, -38); c.arc(0, -38, 10.5, Math.PI, 0); c.lineTo(10.5, KAIDE); c.closePath(); c.clip();
  bnCam(c, -11, -50, 22, 50, { ust: '#cfe6dc', orta: '#7fae98', alt: '#4f7f6a', yanik: true });
  c.fillStyle = BEYAZ; c.fillRect(-0.6, -50, 1.2, 50); c.restore();
  // Kaide: krem taş + kampüsün kırmızı tuğla şeridi
  bnDuvar(c, -194, KAIDE, 388, -KAIDE, '#efe7d6', '#d9cdb7');
  bnTugla(c, -194, KAIDE, 388, 3.2, '#b95b3f', '#a24f37');
  bnGolgeAlt(c, -194, KAIDE + 3.2, 388, 3, 0.22);
  // kapı önü basamak
  bnDik(c, -17, -3, 34, 3, '#e4dccb');
  bnIsikGolge(c, 390, 168);
  // Dışarıda: iki palmiye, çiçekli çalılar
  bnPalmiye(c, -214, 2, 1.45); bnPalmiye(c, 216, 2, 1.25);
  bnCali(c, -228, 230, -1, 8, ['#e8556a', '#f49ac0', '#ffffff', '#f7c548']);
}

// ══════════════ YURT — öğrenci yurdu (beyaz + kırmızı kuşak, kiremit çatı) ══════════════
function bn12CizYurt(c) {
  const W2 = 170, KAT = 34, UST = -140;
  // kırma çatı (turuncu kiremit)
  const cg = c.createLinearGradient(-W2, -180, W2, -140);
  cg.addColorStop(0, '#e07d4c'); cg.addColorStop(1, '#bf5a35');
  c.fillStyle = cg; c.beginPath(); c.moveTo(-W2 - 9, UST - 2); c.lineTo(-W2 + 34, -177); c.lineTo(W2 - 34, -177); c.lineTo(W2 + 9, UST - 2); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(120,40,20,.28)'; c.lineWidth = 0.7;
  for (let y = -174; y < UST - 2; y += 3.4) { const u = (y + 177) / (UST - 2 + 177); const x0 = -W2 + 34 - u * 43, x1 = W2 - 34 + u * 43; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke(); }
  // sol kırma yüzü güneşte, sağ kırma yüzü gölgede
  c.fillStyle = 'rgba(255,220,180,.22)'; c.beginPath(); c.moveTo(-W2 - 9, UST - 2); c.lineTo(-W2 + 34, -177); c.lineTo(-W2 + 40, UST - 2); c.closePath(); c.fill();
  c.fillStyle = 'rgba(90,30,30,.22)'; c.beginPath(); c.moveTo(W2 + 9, UST - 2); c.lineTo(W2 - 34, -177); c.lineTo(W2 - 40, UST - 2); c.closePath(); c.fill();
  c.fillStyle = '#f0a070'; c.fillRect(-W2 + 34, -177.5, (W2 - 34) * 2, 1.6);
  // bacalar (kırmızı tuğla, beyaz başlık)
  for (const x of [-118, -58, 58, 118]) { bnTugla(c, x - 4, -190, 8, 22, '#b5513a', '#9c4330'); bnDik(c, x - 5.5, -192, 11, 3, '#f6f2ea'); }
  // ortadaki merdiven kulesinin çatısı (biraz yüksek)
  c.fillStyle = '#d46a3e'; c.beginPath(); c.moveTo(-30, -150); c.lineTo(-10, -186); c.lineTo(10, -186); c.lineTo(30, -150); c.closePath(); c.fill();
  c.fillStyle = 'rgba(90,30,30,.2)'; c.beginPath(); c.moveTo(30, -150); c.lineTo(10, -186); c.lineTo(12, -150); c.closePath(); c.fill();
  // saçak altı
  bnDik(c, -W2 - 6, UST - 3, W2 * 2 + 12, 3.5, '#f7f3ea');
  // duvar
  bnDuvar(c, -W2, UST, W2 * 2, -UST, '#f7f4ec', '#e9e3d6');
  bnGolgeAlt(c, -W2, UST, W2 * 2, 6, 0.32);
  // zemin kaidesi (tuğla)
  bnTugla(c, -W2, -9, W2 * 2, 9, '#b95b3f', '#a24f37');
  // kat kuşakları (ince kırmızı tuğla)
  for (let k = 1; k <= 4; k++) { const y = -KAT * k - 2; bnTugla(c, -W2, y, W2 * 2, 3.2, '#cf6a40', '#b95a38'); }
  // pencereler: her katta simetrik çiftler; uçlarda balkonlar
  for (let k = 0; k < 4; k++) {
    const y0 = -KAT * (k + 1) + 9;
    for (let x = -W2 + 10; x < W2 - 16; x += 26) {
      if (Math.abs(x + 7) < 32) continue;   // ortadaki merdiven kulesi
      bnPencere(c, x, y0, 14, 19, { bolme: 1, kalin: 1.2 });
      if (k > 0 && (x < -W2 + 40 || x > W2 - 46)) {   // balkon: beyaz döşeme + korkuluk
        bnDik(c, x - 4, y0 + 19, 22, 2.4, '#fbf9f4'); bnGolgeAlt(c, x - 4, y0 + 21.4, 22, 3, 0.25);
        c.fillStyle = '#e8e3d8'; for (let bx = x - 4; bx <= x + 18; bx += 2.4) c.fillRect(bx, y0 + 12, 0.7, 7); c.fillRect(x - 4, y0 + 11.4, 22, 1.2);
      }
    }
  }
  // merdiven kulesi (öne çıkık: sağ kenarında gölge), dikey cam şerit, giriş saçağı
  bnDuvar(c, -28, -150, 56, 150, '#fbf8f1', '#ece6d8');
  c.fillStyle = 'rgba(60,50,70,.14)'; c.fillRect(24, -150, 4, 150);
  for (let k = 1; k <= 4; k++) bnTugla(c, -28, -KAT * k - 2, 56, 3.2, '#cf6a40', '#b95a38');
  for (let k = 0; k < 4; k++) bnPencere(c, -6, -KAT * (k + 1) + 7, 12, 22, { yatay: 0.5, kalin: 1.2 });
  bnDik(c, -18, -30, 36, 3, '#fbf8f2'); bnGolgeAlt(c, -16, -27, 32, 3, 0.3);
  bnCam(c, -10, -26, 20, 26, { ust: '#a9c6dc', orta: '#5e819f', alt: '#3a5670', yanik: true });
  c.fillStyle = '#f2eee6'; c.fillRect(-0.6, -26, 1.2, 26);
  bnIsikGolge(c, 350, 195);
  // önde: çiçekli (mor-pembe) yamaç çalıları, iki çam
  bnAgac(c, -186, 3, 1.6, 'cam'); bnAgac(c, -140, 3, 1.15, 'kiraz'); bnAgac(c, 150, 3, 1.25, 'sari'); bnAgac(c, 190, 3, 1.55, 'yesil');
  bnCali(c, -184, 186, -1, 11, ['#d94fa3', '#e978c0', '#ffffff']);
}

// ══════════════ YURT2 — öğrenci yurdu (terracotta oluklu kaplama, beyaz bantlar, beyaz üst kat, güneş panelleri) ══════════════
function bn12CizYurt2(c) {
  const W2 = 150, KAT = 36, UST = -136;
  // çatı: geniş saçaklı turuncu kiremit kırma çatı + güneş panelleri
  const cg = c.createLinearGradient(-W2, -176, W2, -136);
  cg.addColorStop(0, '#e4844f'); cg.addColorStop(1, '#c4613a');
  c.fillStyle = cg; c.beginPath(); c.moveTo(-W2 - 14, UST - 1); c.lineTo(-W2 + 40, -174); c.lineTo(W2 - 40, -174); c.lineTo(W2 + 14, UST - 1); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(120,40,20,.26)'; c.lineWidth = 0.7;
  for (let y = -171; y < UST - 1; y += 3.4) { const u = (y + 174) / (UST - 1 + 174); c.beginPath(); c.moveTo(-W2 + 40 - u * 54, y); c.lineTo(W2 - 40 + u * 54, y); c.stroke(); }
  c.fillStyle = 'rgba(90,30,30,.22)'; c.beginPath(); c.moveTo(W2 + 14, UST - 1); c.lineTo(W2 - 40, -174); c.lineTo(W2 - 46, UST - 1); c.closePath(); c.fill();
  // güneş panelleri (mavi, ince beyaz çerçeve)
  for (let i = 0; i < 4; i++) {
    const x = -60 + i * 26;
    c.fillStyle = '#f4f4f2'; c.beginPath(); c.moveTo(x - 1, -146); c.lineTo(x + 3, -167); c.lineTo(x + 24, -167); c.lineTo(x + 21, -146); c.closePath(); c.fill();
    const pg = c.createLinearGradient(0, -166, 0, -147); pg.addColorStop(0, BN12.G ? '#3b4870' : '#7fa7d6'); pg.addColorStop(1, BN12.G ? '#2a3555' : '#3d64a3');
    c.fillStyle = pg; c.beginPath(); c.moveTo(x + 0.6, -147); c.lineTo(x + 4, -166); c.lineTo(x + 23, -166); c.lineTo(x + 19.6, -147); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 0.5; c.beginPath(); c.moveTo(x + 2.3, -156.5); c.lineTo(x + 21.3, -156.5); c.stroke();
  }
  // baca
  bnTugla(c, 92, -184, 8, 20, '#b5513a', '#9c4330'); bnDik(c, 90.5, -186, 11, 3, '#f6f2ea');
  bnDik(c, -W2 - 10, UST - 2, W2 * 2 + 20, 3, '#f7f3ea');
  // üst kat beyaz
  bnDuvar(c, -W2, UST, W2 * 2, KAT, '#f8f5ee', '#ece6da');
  bnGolgeAlt(c, -W2, UST, W2 * 2, 7, 0.34);
  // alt katlar: terracotta yatay oluklu kaplama
  const ALTY = UST + KAT;
  bnDuvar(c, -W2, ALTY, W2 * 2, -ALTY, '#d47445', '#bd6139', false);
  c.fillStyle = 'rgba(255,210,180,.22)'; for (let y = ALTY + 1; y < 0; y += 2.2) c.fillRect(-W2, y, W2 * 2, 0.6);
  c.fillStyle = 'rgba(90,35,20,.22)'; for (let y = ALTY + 2; y < 0; y += 2.2) c.fillRect(-W2, y, W2 * 2, 0.5);
  // beyaz kat bantları
  const AK = -ALTY / 3;   // alt üç katın yüksekliği
  for (let k = 0; k < 3; k++) { const y = ALTY + k * AK; bnDuvar(c, -W2, y - 2.5, W2 * 2, 5.5, '#fbf8f1', '#e7e0d2', false); bnGolgeAlt(c, -W2, y + 3, W2 * 2, 2.5, 0.2); }
  // pencereler: üst katta beyaz duvarda, alt katlarda terracottada beyaz çerçeveli
  for (let k = 0; k < 4; k++) {
    const y0 = k === 0 ? UST + 9 : ALTY + (k - 1) * AK + 8;
    for (let x = -W2 + 12; x < W2 - 18; x += 30) { if (k === 3 && Math.abs(x + 8) < 20) continue; bnPencere(c, x, y0, 16, 19, { bolme: 1, kalin: 1.4 }); }
  }
  // köşede beyaz dikey yan şerit (fotoğraftaki gibi)
  bnDik(c, -W2, ALTY, 4, -ALTY, '#f4efe5'); bnDik(c, W2 - 4, ALTY, 4, -ALTY, '#e6dfd1');
  // giriş: beyaz çerçeveli cam kapı, küçük saçak
  bnDik(c, -14, -32, 28, 32, '#f6f2ea');
  bnCam(c, -10, -28, 20, 28, { ust: '#a9c6dc', orta: '#5e819f', alt: '#3a5670', yanik: true });
  bnDik(c, -18, -35, 36, 3, '#fbf8f2'); bnGolgeAlt(c, -16, -32, 32, 3, 0.3);
  bnIsikGolge(c, 310, 182);
  bnAgac(c, -166, 3, 1.5, 'yesil'); bnAgac(c, -128, 3, 1.1, 'kiraz'); bnAgac(c, 168, 3, 1.5, 'cam');
  bnCali(c, -164, 166, -1, 10, ['#ffffff', '#f3a7bf', '#f7d36b']);
}

// Küçük piramit camlı fener (Spor Merkezi ve Gösteri Merkezi köşelerinde)
function bnPiramitFener(c, x, y, s) {
  bnDuvar(c, x - 7 * s, y - 14 * s, 14 * s, 14 * s, '#f6f2ea', '#e3dccd', false);
  c.fillStyle = '#f9f8f4'; c.beginPath(); c.moveTo(x - 8.5 * s, y - 14 * s); c.lineTo(x, y - 34 * s); c.lineTo(x + 8.5 * s, y - 14 * s); c.closePath(); c.fill();
  const g = c.createLinearGradient(x - 6 * s, y - 30 * s, x + 6 * s, y - 15 * s);
  g.addColorStop(0, BN12.G ? '#ffe3a0' : '#cfe6f4'); g.addColorStop(1, BN12.G ? '#ffb85c' : '#4f7ea8');
  c.fillStyle = g; c.beginPath(); c.moveTo(x - 6 * s, y - 15.5 * s); c.lineTo(x, y - 30 * s); c.lineTo(x + 6 * s, y - 15.5 * s); c.closePath(); c.fill();
  c.strokeStyle = '#f9f8f4'; c.lineWidth = 0.8 * s; c.beginPath(); c.moveTo(x, y - 30 * s); c.lineTo(x, y - 15.5 * s); c.moveTo(x - 3 * s, y - 22.5 * s); c.lineTo(x + 3 * s, y - 22.5 * s); c.stroke();
}
// Revak: krem taş sütunlar, aralarında koyu cam kapılar ve tuğla kırmızısı panolar
function bnRevak(c, x0, x1, y0, adim) {
  for (let x = x0; x < x1 - 1; x += adim) {
    bnTugla(c, x + 3, y0 + 2, adim - 6, -y0 - 2, '#c9683f', '#b2563a');
    bnCam(c, x + 7, y0 + 9, adim - 14, -y0 - 9, { ust: '#a8c4d8', orta: '#5b7c9a', alt: '#33506a' });
    c.fillStyle = 'rgba(245,240,230,.8)'; c.fillRect(x + adim / 2 - 0.5, y0 + 6, 1, -y0 - 6);
  }
  for (let x = x0; x <= x1 + 0.5; x += adim) { bnDuvar(c, x - 3, y0, 6, -y0, '#f7f2e8', '#ded5c4', false); c.fillStyle = 'rgba(70,50,40,.16)'; c.fillRect(x + 1.8, y0, 1.2, -y0); }
  bnDuvar(c, x0 - 4, y0 - 6, x1 - x0 + 8, 7, '#f6f1e6', '#e0d7c6', false); bnGolgeAlt(c, x0 - 3, y0 + 1, x1 - x0 + 6, 4, 0.3);
}

// ══════════════ SPOR — Spor Merkezi (göletin kıyısında) ══════════════
// Beyaz "martı kanadı" kavisli çatı (uçları aşağı kıvrık, duvarlardan taşar), altında cam üst pencere şeridi,
// altta krem sütunlu revak + kırmızı tuğla panolar; köşelerde iki küçük piramit camlı fener.
function bn12CizSpor(c) {
  const RU = 192;
  const ust = x => { const u = Math.min(1, Math.abs(x) / RU); return -108 + 34 * Math.pow(u, 2.4); };
  const kalin = x => 9 + 5 * Math.min(1, Math.abs(x) / RU);
  // salon gövdesi ve cam üst pencere şeridi (camın üstü çatının altına kadar)
  bnDuvar(c, -156, -64, 312, 22, '#f1ece2', '#ddd4c4');
  const camS = new Path2D(); camS.moveTo(-150, -50);
  for (let x = -150; x <= 150; x += 5) camS.lineTo(x, ust(x) + kalin(x) - 1);
  camS.lineTo(150, -50); camS.closePath();
  c.save(); c.clip(camS); bnCam(c, -152, -112, 304, 64, { ust: '#dcedf7', orta: '#82abcc', alt: '#4b739a' });
  c.fillStyle = BN12.G ? '#7a6a58' : '#eef0ef'; for (let x = -150; x <= 150; x += 13) c.fillRect(x - 0.6, -112, 1.2, 64);
  c.fillRect(-150, -66, 300, 1.2); c.restore();
  bnDik(c, -152, -50, 304, 4, '#f4efe5');
  // revak (alt kat)
  bnRevak(c, -200, 200, -40, 25);
  // kanat çatı: üst yüz beyaz, alt yüz (saçak altı) gölgeli
  const cati = new Path2D();
  cati.moveTo(-RU - 4, ust(RU) + 4);
  for (let x = -RU; x <= RU; x += 4) cati.lineTo(x, ust(x));
  cati.lineTo(RU + 4, ust(RU) + 4);
  for (let x = RU; x >= -RU; x -= 4) cati.lineTo(x, ust(x) + kalin(x));
  cati.closePath();
  const cg = c.createLinearGradient(0, -110, 0, -70);
  cg.addColorStop(0, BN12.G ? '#d9d2cc' : '#ffffff'); cg.addColorStop(1, BN12.G ? '#aaa39e' : '#d6dadd');
  c.fillStyle = cg; c.fill(cati);
  c.fillStyle = 'rgba(70,80,100,.18)';
  c.beginPath(); for (let x = -RU; x <= RU; x += 4) { const y = ust(x) + kalin(x) * 0.62; if (x === -RU) c.moveTo(x, y); else c.lineTo(x, y); }
  for (let x = RU; x >= -RU; x -= 4) c.lineTo(x, ust(x) + kalin(x)); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.2; c.beginPath();
  for (let x = -RU + 6; x <= RU - 6; x += 4) { const y = ust(x) + 1; if (x === -RU + 6) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
  // saçağın cama düşen gölgesi
  c.save(); c.clip(camS); c.fillStyle = 'rgba(40,50,70,.22)'; c.fillRect(-150, -112, 300, 18); c.restore();
  // köşe fenerleri
  bnPiramitFener(c, -192, -46, 1); bnPiramitFener(c, 192, -46, 1);
  bnIsikGolge(c, 420, 125);
  bnAgac(c, -214, 3, 1.3, 'yesil'); bnAgac(c, 216, 3, 1.15, 'sari');
  bnCali(c, -222, 224, -1, 7, ['#ffffff', '#f3a7bf']);
}

// ══════════════ PAC — Sabancı Gösteri Merkezi (Performans Sanatları Merkezi, göletin kıyısında) ══════════════
// Uzun kutu kütle; solda öne doğru kalkan antrasit dalga çatı (ince, taşkın saçak), altında yüksek cam fuaye;
// krem taş + ince kahve yatay çizgili cephe, altta sütunlu revak; iki küçük piramit camlı fener.
function bn12CizPac(c) {
  // sahne kulesi (arkada, düz kütle)
  bnDuvar(c, 40, -104, 150, 64, '#ebe5da', '#d8cfbf');
  for (let y = -98; y < -42; y += 7) { c.fillStyle = 'rgba(150,105,80,.35)'; c.fillRect(40, y, 150, 1.4); }
  bnDik(c, 38, -106, 154, 4, '#f6f2ea');
  // yüksek cam fuaye (solda): cam dalga çatının altına kadar yükselir
  const ust = x => { const u = Math.max(0, Math.min(1, (x + 214) / 238)); return -98 - 26 * Math.pow(Math.sin(u * Math.PI), 0.75) - 6 * (1 - u); };
  const fuaye = new Path2D(); fuaye.moveTo(-196, -40);
  for (let x = -196; x <= -4; x += 4) fuaye.lineTo(x, ust(x) + 5);
  fuaye.lineTo(-4, -40); fuaye.closePath();
  c.save(); c.clip(fuaye);
  bnCam(c, -198, -130, 196, 92, { ust: '#e3f1f8', orta: '#8fb8d6', alt: '#4f789e' });
  c.fillStyle = BN12.G ? '#7a6a58' : '#3f4b55';
  for (let x = -196; x <= -4; x += 19) c.fillRect(x - 0.7, -130, 1.4, 92);
  c.fillRect(-196, -70, 192, 1.2); c.fillRect(-196, -100, 192, 1.2);
  c.fillStyle = 'rgba(30,40,60,.25)'; c.fillRect(-198, -130, 196, 30);
  c.restore();
  // fuaye ile sahne kulesi arası çizgili cephe
  bnDuvar(c, -6, -86, 46, 46, '#efe9de', '#dcd3c3');
  for (let y = -80; y < -42; y += 7) { c.fillStyle = 'rgba(150,105,80,.35)'; c.fillRect(-6, y, 46, 1.4); }
  bnDuvar(c, 190, -70, 22, 30, '#e7e0d3', '#d4cab9');
  // revak (alt kat)
  bnRevak(c, -206, 212, -40, 26);
  // dalga çatı: fuayenin üstünde kavislenen ince, taşkın antrasit saçak
  const cati = new Path2D();
  cati.moveTo(-214, ust(-214));
  for (let x = -214; x <= 24; x += 4) cati.lineTo(x, ust(x));
  for (let x = 24; x >= -214; x -= 4) cati.lineTo(x, ust(x) + 6);
  cati.closePath();
  c.fillStyle = BN12.G ? '#3f434c' : '#525a66'; c.fill(cati);
  c.strokeStyle = BN12.G ? '#8a8790' : '#aeb5bf'; c.lineWidth = 1.4;
  c.beginPath(); for (let x = -214; x <= 24; x += 4) { const y = ust(x) + 6; if (x === -214) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 0.8;
  c.beginPath(); for (let x = -214; x <= 24; x += 4) { const y = ust(x) + 0.6; if (x === -214) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
  bnPiramitFener(c, -206, -46, 1); bnPiramitFener(c, 30, -86, 0.9);
  bnIsikGolge(c, 440, 130);
  bnAgac(c, 228, 3, 1.35, 'yesil');
  bnCali(c, -224, 236, -1, 7, ['#ffffff', '#f7d36b']);
}


// ══════════════ FAKÜLTE — FENS / FASS tipi fakülte binası ══════════════
// Kampüsün en tanınır cephesi: kırmızı tuğla duvarda ince beyaz yatay çizgiler (her iki-üç tuğla sırasında bir), uzun bant pencereler,
// derin gölge bırakan ince beyaz saçaklı düz çatı, yarım silindir cam merdiven kulesi (beyaz şapkalı), zemin katta beyaz sütunlu revak.
function bnCizgiliTugla(c, x, y, w, h, renk, koyu) {
  bnTugla(c, x, y, w, h, renk, koyu);
  // beyaz yatay çizgiler: fotoğraflardaki "kırmızı-beyaz çizgili" görüntü
  for (let yy = y + 3; yy < y + h - 1; yy += 5.2) { c.fillStyle = 'rgba(250,244,232,.85)'; c.fillRect(x, yy, w, 1.25); c.fillStyle = 'rgba(80,30,20,.18)'; c.fillRect(x, yy + 1.25, w, 0.5); }
}
function bn12CizFakulte(c) {
  const TUG = '#c4623e', TUGK = '#a9513a', KREM = '#f6f1e6';
  // arka kütle: geride, biraz soluk ikinci blok (derinlik)
  bnCizgiliTugla(c, -150, -168, 210, 60, '#c98a72', '#b97a64');
  c.fillStyle = 'rgba(190,210,230,.28)'; c.fillRect(-150, -168, 210, 60);
  bnDik(c, -154, -172, 218, 5, '#efeae0');
  // ana gövde: üç katlı, uzun
  const X0 = -232, X1 = 150, UST = -128;
  bnCizgiliTugla(c, X0, UST, X1 - X0, -UST, TUG, TUGK);
  // kat bant pencereleri (koyu kayıtlı, gök yansımalı)
  for (let k = 0; k < 2; k++) {
    const y = UST + 18 + k * 40;
    bnDik(c, X0 + 8, y - 3, X1 - X0 - 16, 2.4, KREM);   // pencere üstü beyaz lento
    for (let x = X0 + 10; x < X1 - 22; x += 30) bnPencere(c, x, y, 24, 18, { bolme: 2, kalin: 1.1, cerceve: '#f3eee4' });
    bnGolgeAlt(c, X0 + 8, y - 0.6, X1 - X0 - 16, 3, 0.2);
  }
  // zemin kat: geri çekilmiş cam + beyaz sütunlu revak (derin gölge)
  bnDik(c, X0, -36, X1 - X0, 36, '#5d4a48');
  for (let x = X0 + 6; x < X1 - 10; x += 22) bnCam(c, x, -32, 18, 30, { ust: '#b7d4e6', orta: '#5f88aa', alt: '#3a5a78' });
  bnGolgeAlt(c, X0, -36, X1 - X0, 10, 0.45);
  for (let x = X0 + 2; x <= X1 - 2; x += 22) { bnDuvar(c, x - 2.2, -36, 4.4, 36, '#fbf8f1', '#e3dccd', false); c.fillStyle = 'rgba(60,40,40,.18)'; c.fillRect(x + 1.4, -36, 0.8, 36); }
  // düz çatı: ince beyaz saçak, altında koyu gölge
  bnDik(c, X0 - 6, UST - 6, X1 - X0 + 12, 6, '#fbf8f2');
  c.fillStyle = 'rgba(60,40,40,.12)'; c.fillRect(X0 - 6, UST - 1.5, X1 - X0 + 12, 1.5);
  bnGolgeAlt(c, X0, UST, X1 - X0, 7, 0.38);
  // yarım silindir cam merdiven kulesi (sağda, ana gövdeden yüksek)
  const KX = 186, KR = 34, KUST = -170;
  if (BN12.G) {
    bnDik(c, KX - KR, KUST, KR * 2, -KUST, '#56617f');
    for (let y = KUST + 10; y < -8; y += 22) bnCam(c, KX - KR + 4, y, KR * 2 - 8, 16);
  } else {
    const gr = c.createLinearGradient(KX - KR, 0, KX + KR, 0);
    gr.addColorStop(0, '#e9f5fb'); gr.addColorStop(0.3, '#a8d0ea'); gr.addColorStop(0.7, '#5d8cb5'); gr.addColorStop(1, '#3a5f86');
    c.fillStyle = gr; c.fillRect(KX - KR, KUST, KR * 2, -KUST);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(KX - KR * 0.55, KUST, 6, -KUST);
  }
  c.fillStyle = '#4a5560';   // silindir kayıtları: kenarlara doğru sıklaşan dikmeler
  for (let i = -6; i <= 6; i++) { const x = KX + KR * Math.sin(i / 6 * Math.PI / 2); c.fillRect(x - 0.6, KUST, 1.2, -KUST); }
  for (let y = KUST + 22; y < 0; y += 22) c.fillRect(KX - KR, y - 0.8, KR * 2, 1.6);
  // beyaz şapka (eliptik disk) + gölgesi
  c.fillStyle = '#fbf8f2'; c.beginPath(); c.ellipse(KX, KUST, KR + 6, 6, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = 'rgba(60,50,60,.25)'; c.beginPath(); c.ellipse(KX, KUST + 5, KR, 3, 0, 0, Math.PI); c.fill();
  // kulenin ana gövdeye birleştiği yerde gölge
  c.fillStyle = 'rgba(40,30,40,.2)'; c.fillRect(X1, UST, 4, -UST);
  // sol uç: beyaz taş köşe kulesi (ince, yüksek)
  bnDuvar(c, X0 - 26, -150, 30, 150, '#f6f2ea', '#e2dbcd');
  bnCam(c, X0 - 18, -138, 14, 110, { ust: '#d6ecf8', orta: '#6f9cc4', alt: '#3e6a92' });
  c.fillStyle = '#5b6770'; for (let y = -124; y < -28; y += 14) c.fillRect(X0 - 18, y, 14, 0.9);
  bnDik(c, X0 - 29, -154, 36, 5, '#fbf8f2'); bnGolgeAlt(c, X0 - 26, -149, 30, 4, 0.28);
  // çatı: güneş panelleri (eğik koyu mavi, ince açık çizgili) ve ince paslanmaz korkuluk
  for (let x = X0 + 18; x < X1 - 40; x += 30) {
    c.fillStyle = BN12.G ? '#2c3550' : '#2f4f7a';
    c.beginPath(); c.moveTo(x, UST - 6); c.lineTo(x + 24, UST - 6); c.lineTo(x + 20, UST - 15); c.lineTo(x + 4, UST - 15); c.closePath(); c.fill();
    c.fillStyle = BN12.G ? 'rgba(150,160,200,.2)' : 'rgba(200,225,250,.45)';
    c.fillRect(x + 4, UST - 14.5, 16, 1); c.fillRect(x + 3, UST - 11, 19, 0.6);
    c.fillStyle = '#8a929a'; c.fillRect(x + 11.4, UST - 15, 0.6, 9);
  }
  c.fillStyle = '#d9dde0';
  c.fillRect(X0 - 4, UST - 13, X1 - X0 + 8, 0.9);
  for (let x = X0 - 4; x <= X1 + 4; x += 9) c.fillRect(x - 0.35, UST - 13, 0.7, 7);
  bnIsikGolge(c, 470, 176);
  // önde: genç ağaçlar ve çiçekli çalı saçağı (cepheyi örtmeyecek kadar küçük)
  bnAgac(c, -246, 3, 1.25, 'yesil'); bnAgac(c, 96, 3, 1.05, 'kiraz'); bnAgac(c, 232, 3, 1.3, 'sari');
  bnCali(c, -240, 236, -1, 9, ['#f6b7c8', '#ffffff', '#f7d36b']);
}

const BN12_CIZIM = { fakulte: bn12CizFakulte, sbs: bn12CizSbs, sunum: bn12CizSunum, sera: bn12CizSera, yurt: bn12CizYurt, yurt2: bn12CizYurt2, spor: bn12CizSpor, pac: bn12CizPac };

// ── Önbellek: bir binanın gündüz ya da gece tuvali ──
function bn12Tuval(ad, gece) {
  const anahtar = ad + (gece ? '_gece' : '_gun');
  if (BN12.onb[anahtar]) return BN12.onb[anahtar];
  const o = BN12_OLCU[ad], ciz = BN12_CIZIM[ad];
  if (!o || !ciz || typeof document === 'undefined') return null;
  const R = BN12_R, cw = o.w + BN12_PAD * 2, ch = o.h + BN12_PAD + BN12_ALT;
  const cv = bn12Kanvas(cw * R, ch * R), c = cv.getContext('2d');
  c.setTransform(R, 0, 0, R, (BN12_PAD + o.w / 2) * R, (BN12_PAD + o.h) * R);
  BN12.G = !!gece;
  BN12.tohum = ad.length * 101 + ad.charCodeAt(0) * 7; BN12.tohum2 = BN12.tohum * 3 + 5;   // gündüz ve gece aynı tohum: ağaçlar, çalılar aynı yerde
  try { ciz(c); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('bn12 ' + ad, e); }
  BN12.G = false;
  BN12.onb[anahtar] = cv;
  return cv;
}

// ── Siluet tuvalleri (yarım çözünürlük): binanın tek renkli kopyası ──
// 'sicak': gün batımının turuncu ışığı (gün ilerledikçe binanın üstüne yarı saydam biner)
// 'pus'  : hava perspektifi; uzak (gölün karşı kıyısı) binalar soluk-mavi görünsün
const BN12_SILUET_RENK = { sicak: '#ffa868', pus: '#cfe1f1' };
function bn12Siluet(ad, tur) {
  const anahtar = ad + '_' + tur;
  if (BN12.onb[anahtar]) return BN12.onb[anahtar];
  const gun = BN12.onb[ad + '_gun'] || bn12Tuval(ad, false);
  if (!gun) return null;
  const cv = bn12Kanvas(gun.width / 2, gun.height / 2), c = cv.getContext('2d');
  c.drawImage(gun, 0, 0, cv.width, cv.height);
  c.globalCompositeOperation = 'source-in';
  c.fillStyle = BN12_SILUET_RENK[tur]; c.fillRect(0, 0, cv.width, cv.height);
  BN12.onb[anahtar] = cv;
  return cv;
}
// Gün ilerleyişine göre sıcak ışık: sabah çok hafif, öğlen yok, gün batımında belirgin (dunya12'nin ışık gücünden)
function bn12SicakGuc() {
  const isik = typeof dn12Isik === 'function' ? dn12Isik() : null;
  const guc = isik && Number.isFinite(isik.guc) ? isik.guc : 0;
  return Math.max(0, Math.min(0.32, (guc - 0.08) * 0.9));
}

// ── Isıtma: kareye bir tuval ──
function bn12Isit() {
  if (!BN12.isit.length) {
    // yalnız ARKA'nın sahneye koyduğu binalar (DN12_BINALAR[].bina); liste yoksa hepsi
    let kullan = null;
    if (typeof DN12_BINALAR !== 'undefined' && Array.isArray(DN12_BINALAR)) { kullan = Object.create(null); for (const B of DN12_BINALAR) if (B && B.bina) kullan[B.bina] = true; }
    for (const ad in BN12_OLCU) if (!kullan || kullan[ad]) { BN12.isit.push([ad, false]); BN12.isit.push([ad, true]); BN12.isit.push([ad, 'sicak']); BN12.isit.push([ad, 'pus']); }
    if (!BN12.isit.length) BN12.isit.push(['sbs', false]);
  }
  if (BN12.isitAdim < BN12.isit.length) {
    const [ad, tur] = BN12.isit[BN12.isitAdim++];
    if (typeof tur === 'string') bn12Siluet(ad, tur); else bn12Tuval(ad, tur);
  }
  return BN12.isitAdim >= BN12.isit.length;
}

// Akşam pencere ışığı gücü: gün batımına doğru yumuşakça yanar; FINAL'in akşamında tam
function bn12GeceGuc() {
  const gun = typeof dn12Gun === 'function' ? dn12Gun() : 0;
  let a = bn12Yum(0.68, 1, gun) * 0.78;   // gölete inerken (altın saat) pencereler yavaşça altın yanar
  const F = typeof K12FINAL !== 'undefined' && K12FINAL ? K12FINAL : null;
  if (F && F.aktif && Number.isFinite(F.aksam)) a = Math.max(a, 0.7 + 0.3 * Math.max(0, Math.min(1, F.aksam)));
  return a;
}

// ── Çizim: (x, y) taban ortası; olcek 1 = BN12_OLCU; pus 0..1 = uzaklık sisi (gölün karşı kıyısı için) ──
// Sıra: gündüz tuvali → sıcak gün ışığı → pus → akşam pencereleri (yanan pencereler pusun içinde de parlasın)
function bn12Ciz(ad, ctx, x, y, olcek, tm, pus) {
  const o = BN12_OLCU[ad]; if (!o || !ctx) return;
  const s = Number.isFinite(olcek) && olcek > 0 ? olcek : 1;
  const gun = BN12.onb[ad + '_gun'] || bn12Tuval(ad, false);
  if (!gun) return;
  const dx = x - (BN12_PAD + o.w / 2) * s, dy = y - (BN12_PAD + o.h) * s;
  const dw = (o.w + BN12_PAD * 2) * s, dh = (o.h + BN12_PAD + BN12_ALT) * s;
  const eski = ctx.globalAlpha;
  ctx.drawImage(gun, dx, dy, dw, dh);
  const sicak = bn12SicakGuc();
  if (sicak > 0.01) { const sc = BN12.onb[ad + '_sicak']; if (sc) { ctx.globalAlpha = eski * sicak; ctx.drawImage(sc, dx, dy, dw, dh); } }
  if (pus > 0.01) { const pc = BN12.onb[ad + '_pus']; if (pc) { ctx.globalAlpha = eski * Math.min(0.6, pus); ctx.drawImage(pc, dx, dy, dw, dh); } }
  const a = bn12GeceGuc();
  if (a > 0.01) {
    const gece = BN12.onb[ad + '_gece'] || bn12Tuval(ad, true);
    if (gece) { ctx.globalAlpha = eski * a; ctx.drawImage(gece, dx, dy, dw, dh); }
  }
  ctx.globalAlpha = eski;
  void tm;
}
