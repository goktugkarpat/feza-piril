/* dunya12.js — Bölüm 12 "Annemle Sabancı'da Bir Gün": gök ve kampüs arka planı.
   Derinlik sırası (arkadan öne, hepsi dn12Background'da, paralaksla):
     gök (sabah → gün batımı) · güneş · bulutlar · uzak Tuzla/Orhanlı tepeleri · Marmara denizi parıltısı ·
     ormanlı orta tepeler · kampüs binaları katmanı (fotoğraftan stilize resimler + bina12.js çizimleri, ağaç kümeleri, gözlem kulesi, büyük gölet) ·
     yakın çalı sırası (gölette su)
   Zemin, yol ve orta plan (fener, bank, ağaç) ile en ön çimenler ONPLAN'ın zemin12.js'idir: dn12World → zn12World, dn12Foreground → zn12On.
   Başkalarına açık: dn12Gun() 0 sabah … 1 gün batımı, dn12Isik() → {ton, guc}, dn12GunesXY() → {x, y} (ekran pikseli),
   dn12GolRenk() → {ust, alt} (gölet suyunun dünya y≈700'deki rengi), DN12_UFUK, DN12.gunesX.
   Performans: bütün gradyanlar ve şekiller önbellek tuvallerine bir kez çizilir (dn12Isit kareye yayar); karede yalnız drawImage,
   birkaç fillRect ve kısa yollar. Resimler yüklenince decode() + createImageBitmap ile önceden çözülür. */
'use strict';

// ── Ortak sabitler ──
const DN12_UFUK = 700;         // dünya y: bunun altını ONPLAN örter (benim katmanlarım ekranın dibine kadar iner, dikiş yok)
const DN12_CY = 255;           // kameranın düz zemindeki olağan y'si: paralaks katmanları bu kamerada tasarlandı
const DN12_K = 0.46;           // kampüs resimlerinin ölçeği (dünya birimi / resim pikseli)
const DN12_TABAN = 668;        // bina katmanının yer çizgisi (resimlerdeki binaların tabanı buraya oturur)
const DN12_F = { uzak: 0.07, deniz: 0.1, orta: 0.16, bina: 0.36, yakin: 0.62 };   // paralaks çarpanları
// Gölet (sütun): uzak göl suyu c0'dan haritanın sonuna (tepeden de göl görünür); yakın katmandaki su y0–y1 (oyun düzlemindeki su 830–1005)
const DN12_GOL = { c0: 805, c1: 1300, y0: 812, y1: 1022 };
let DN12_AKSAM = true;         // FINAL için: true = akşam kararmasını (K12FINAL.aksam) gök ben çiziyorum

const DN12 = {
  gun: 0, gunHedef: 0, sonT: -1, zorla: null,   // zorla: 0..1 verilirse gün oraya yumuşakça gider (FINAL vb.)
  gunesX: 0.25, gunesY: 0.2, aksam: 0,
  cx: 0, camY: 0,                                // o karenin kamera merkezi (dünya) ve y'si
  isik: { ton: '#ffffff', guc: 0 }, gunesXY: { x: 0, y: 0 }, golRenk: { ust: '#5aa6dd', alt: '#4a92cf' },
  onb: Object.create(null), isitAdim: 0, hazir: false
};

// ── Küçük yardımcılar ──
function dn12Kanvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function dn12Yumusak(a, b, x) { const q = Math.max(0, Math.min(1, (x - a) / (b - a))); return q * q * (3 - 2 * q); }
function dn12Hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function dn12Hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
function dn12HexYaz(r, g, b) { const t = v => ('0' + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2); return '#' + t(r) + t(g) + t(b); }
function dn12Karistir(a, b, u) { const A = dn12Hex(a), B = dn12Hex(b); return dn12HexYaz(A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u, A[2] + (B[2] - A[2]) * u); }
// Anahtar karelerden (gün 0..1) 0..100 arası hazır renk tablosu: karede yeni metin üretilmez
function dn12Tablo(anahtar, renkler) {
  const out = new Array(101);
  for (let i = 0; i <= 100; i++) {
    const u = i / 100; let k = 0;
    while (k < anahtar.length - 2 && u > anahtar[k + 1]) k++;
    const v = Math.max(0, Math.min(1, (u - anahtar[k]) / (anahtar[k + 1] - anahtar[k])));
    out[i] = dn12Karistir(renkler[k], renkler[k + 1], v * v * (3 - 2 * v));
  }
  return out;
}
function dn12Daire(c, x, y, r, renk) { c.fillStyle = renk; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
function dn12Elips(c, x, y, rx, ry, renk) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }

// ── Gün ilerleyişi: Feza'nın sütununa göre (sabah lojmanda, altın saat gölette, gün batımı tepede) ──
const DN12_GUN_SUTUN = [0, 8, 70, 300, 450, 560, 700, 805, 920, 1030, 1066, 1100];
const DN12_GUN_DEGER = [0, 0, 0.08, 0.3, 0.45, 0.52, 0.6, 0.66, 0.78, 0.9, 1, 1];
function dn12GunHedefi(col) {
  const A = DN12_GUN_SUTUN, B = DN12_GUN_DEGER;
  if (!(col > A[0])) return B[0];
  for (let i = 1; i < A.length; i++) if (col <= A[i]) { const u = (col - A[i - 1]) / (A[i] - A[i - 1]); return B[i - 1] + (B[i] - B[i - 1]) * u; }
  return B[B.length - 1];
}
function dn12Gun() { return DN12.gun; }

// Işık tonu (diğer ajanlar okur; tüm sahneye dn12Vignette'te yumuşak ton olarak biner)
const DN12_ISIK_ANAHTAR = [0, 0.3, 0.56, 0.8, 1];
const DN12_ISIK_TON = dn12Tablo(DN12_ISIK_ANAHTAR, ['#ffe7c4', '#fff8ea', '#ffe6b8', '#ffbb78', '#ff9370']);
const DN12_ISIK_GUC = [0.1, 0.03, 0.1, 0.24, 0.34];
// Çarpma tonu: beyaza yakın (gündüz neredeyse etkisiz), gün batımında sıcak turuncu-pembe
const DN12_TON_CARP = dn12Tablo(DN12_ISIK_ANAHTAR, ['#fff6ea', '#ffffff', '#fff5e4', '#ffe6c8', '#ffdcc6']);
function dn12Isik() { return DN12.isik; }
function dn12GunesXY() { return DN12.gunesXY; }
function dn12GolRenk() { return DN12.golRenk; }

// ── Gök renkleri: beş anahtar an (sabah, öğle, ikindi, altın saat, gün batımı), her biri 5 duraklı dikey gradyan ──
const DN12_GOK = [
  { u: 0,    s: ['#79b8e8', '#a6d4f0', '#d6eaf0', '#f5e7d0', '#f9e2c6'] },
  { u: 0.3,  s: ['#4c9ae2', '#77bbec', '#b0daf1', '#e0eff2', '#edf3ec'] },
  { u: 0.56, s: ['#5799de', '#84bde8', '#bedbe9', '#f2e5cc', '#f7dfbe'] },
  { u: 0.8,  s: ['#5b8dd3', '#9dbbe0', '#f1d0a8', '#ffcd8a', '#ffd8a0'] },
  { u: 1,    s: ['#5662ad', '#b08bc2', '#f4a3a0', '#ffb877', '#ffd08c'] }
];
const DN12_GOK_AKSAM = ['#1d2352', '#3a3770', '#7a5a8c', '#d58a7c', '#f0a978'];   // FINAL'in akşamı: lacivert-mor
// Güneş rengi ve ışıklı sis
const DN12_GUNES_RENK = dn12Tablo([0, 0.4, 0.75, 1], ['#fff3cf', '#fff8de', '#ffdc96', '#ffad62']);
// Gölet suyunun dünya y≈700'deki rengi (GOLET ajanının su şeridi bununla birleşir)
const DN12_SU_UST = dn12Tablo([0, 0.5, 0.8, 1], ['#62acdf', '#56a6de', '#6ea4cf', '#8c9bc4']);
const DN12_SU_ALT = dn12Tablo([0, 0.5, 0.8, 1], ['#4f97d2', '#4892d2', '#5a8dc0', '#6f7fb0']);

// ── Kampüs resimleri (assets/kampus/*-katman.png: göğü saydam, ön çimi kırpılmış, kenarları yumuşak) ──
// taban: resimde binaların zemine oturduğu satır (px). k: ölçek (yoksa DN12_K). ayna: yatay çevrilmiş (uzak ikinci kanat).
const DN12_RESIM = Object.create(null);
function dn12Resim(ad) {
  if (DN12_RESIM[ad]) return DN12_RESIM[ad];
  const r = { img: null, bmp: null, hazir: false, hata: false };
  DN12_RESIM[ad] = r;
  if (typeof Image !== 'function') { r.hata = true; return r; }
  const im = new Image(); im.decoding = 'async';
  im.onload = () => {
    const bitti = () => { r.img = im; r.hazir = true; };
    // createImageBitmap: çözülmüş, ekran kartına hazır resim (bölgeye girişte takılma olmasın); yoksa decode()
    if (typeof createImageBitmap === 'function') createImageBitmap(im).then(b => { r.bmp = b; bitti(); }, bitti);
    else if (im.decode) im.decode().then(bitti, bitti); else bitti();
  };
  im.onerror = () => { r.hata = true; };
  im.src = 'assets/kampus/' + ad + '-katman.png';
  return r;
}
const DN12_BINALAR = [
  { ad: 'lojman',             c: 30,  taban: 430 },
  { ad: 'orta-cim-v2',        c: 79,  taban: 362, k: 0.42 },
  { ad: 'fens',               c: 125, taban: 472 },
  { ad: 'universite-merkezi', c: 222, taban: 505 },
  { ad: 'fens',               c: 293, taban: 472, k: 0.38, ayna: true, bina: 'sbs' },   // BINA'nın SBS'i gelince o çizilir
  { ad: 'fass-cim-v1',        c: 372, taban: 446 },
  { ad: 'orta-cim-v2',        c: 441, taban: 362, k: 0.4, ayna: true, bina: 'sunum', acik: 270 },  // BINA'nın SUNUM'u; önünde ağaç yok (altın kafes görünsün)
  { ad: 'bilgi-merkezi',      c: 505, taban: 412 },
  { ad: null,                 c: 640, bina: 'sera',  w: 380, h: 140 },                      // botanik bahçesinin büyük serası
  { ad: 'kule-cevre',         c: 738, taban: 276 },
  { ad: null,                 c: 790, bina: 'yurt',  w: 340, h: 190, olcek: 0.9 },          // gölete inen yokuşta yurt
  // gölün karşı kıyısı (soldan sağa): yamaçta yurtlar, kıyıda Gösteri Merkezi ve Spor Merkezi (gerçekte yan yana, göle bakar),
  // sonra yine yurt; golet resmi (c1035) bunlarla aynı anda ekrana girmesin diye aralarında ≥60 sütun boşluk var
  { ad: null,                 c: 850, bina: 'yurt',  w: 350, h: 195, olcek: 0.34, kiyi: true },
  { ad: null,                 c: 862, bina: 'yurt2', w: 310, h: 182, olcek: 0.3, kiyi: true },
  { ad: null,                 c: 895, bina: 'pac',   w: 440, h: 130, olcek: 0.4, kiyi: true },   // Sabancı Gösteri Merkezi (koyu dalga çatı)
  { ad: null,                 c: 922, bina: 'spor',  w: 420, h: 125, olcek: 0.38, kiyi: true },   // Spor Merkezi (beyaz martı kanadı çatı)
  { ad: null,                 c: 950, bina: 'yurt',  w: 350, h: 195, olcek: 0.3, kiyi: true },
  { ad: 'golet',              c: 1035, taban: 293, alt: 700 },                               // Gösteri Merkezi + Spor Merkezi (tepeden de görünür)
  { ad: null,                 c: 1088, bina: 'yurt', w: 350, h: 195, olcek: 0.34, kiyi: true },
  { ad: null,                 c: 1100, bina: 'yurt2', w: 310, h: 180, olcek: 0.3, kiyi: true }
];
// Resim boyutları (yüklenmeden önce yerleşim ve ağaç boşlukları hesaplanabilsin diye)
const DN12_BOYUT = {
  'lojman': [1480, 514], 'orta-cim-v2': [648, 375], 'fens': [1620, 492], 'universite-merkezi': [1760, 560],
  'fass-cim-v1': [1820, 478], 'bilgi-merkezi': [1390, 456], 'kule-cevre': [1520, 302], 'golet': [1612, 293]
};
const DN12_KULE_C = 547;   // gözlem kulesi (Bilgi Merkezi'nin yanında, merkez çimenlikte)
for (const b of DN12_BINALAR) {
  b.L = b.c * T * DN12_F.bina;
  if (!b.ad) { b.w = b.w * (b.olcek || 1); b.h = b.h * (b.olcek || 1); b.r = null; continue; }   // yalnız BINA çizimi (yer ayrılır)
  const k = b.k || DN12_K, bo = DN12_BOYUT[b.ad];
  b.w = bo[0] * k; b.h = bo[1] * k;
  b.y0 = (b.alt || (DN12_TABAN + (bo[1] - b.taban) * k)) - b.h;   // üst kenar (katman birimi)
  b.r = dn12Resim(b.ad);
}

// ── Önbellek tuvalleri ──
// Ağaç türleri: yuvarlak (açık yeşil), sari (sarımsı yeşil), selvi (koyu, ince), cam (çam), kiraz (pembe)
const DN12_AGAC_TUR = ['yuvarlak', 'sari', 'selvi', 'cam', 'kiraz'];
const DN12_AGAC_OLCU = { yuvarlak: [150, 190], sari: [140, 170], selvi: [56, 190], cam: [90, 200], kiraz: [150, 165] };
const DN12_R = 1.5;   // önbellek çözünürlüğü (piksel / katman birimi)

function dn12AgacSprite(tur) {
  const ad = 'agac_' + tur; if (DN12.onb[ad]) return DN12.onb[ad];
  const [w, h] = DN12_AGAC_OLCU[tur], R = DN12_R, cv = dn12Kanvas(w * R, h * R), c = cv.getContext('2d');
  c.scale(R, R);
  const cx = w / 2, tohum = tur.length * 13.7;
  // yaprak paleti: koyu (gölge, sağ alt) → açık (güneşli, sol üst)
  const PAL = {
    yuvarlak: ['#3f7a45', '#4f8f4c', '#67a656', '#86bd5f', '#a9d26b', '#d4ea86'],
    sari:     ['#56853f', '#6c9c44', '#86b24c', '#a3c856', '#c4de66', '#e8f08e'],
    kiraz:    ['#b8697f', '#cf8398', '#e3a0b2', '#efbcc8', '#f8d6dc', '#fff0ef'],
    selvi:    ['#24502f', '#2f6238', '#3c7442', '#4c874c', '#62995a', '#7fb168'],
    cam:      ['#24492f', '#2e5b37', '#3a6c40', '#4a7f4a', '#5c9154', '#79a865']
  }[tur];
  if (tur === 'selvi' || tur === 'cam') {
    // gövde
    c.fillStyle = '#5b4636'; c.fillRect(cx - 3, h - 26, 6, 26);
    for (let i = 0; i < 160; i++) {
      const v = i / 160, yy = h - 18 - v * (h - 22);
      const genis = tur === 'selvi' ? (w * 0.46) * Math.sin(Math.min(1, (1 - v) * 1.15) * Math.PI * 0.62 + 0.25) * (0.35 + 0.65 * (1 - v))
                                    : (w * 0.5) * (1 - v) * (0.72 + 0.28 * Math.abs(Math.sin(v * 15)));
      const a = dn12Hash(tohum + i * 3.1) * 2 - 1, xx = cx + a * genis * 0.8;
      const isik = Math.max(0, Math.min(5, Math.round(2.6 - a * 1.6 + (1 - v) * -0.4 + v * 1.4 + dn12Hash(i * 7.7) * 1.2)));
      dn12Elips(c, xx, yy, 4 + dn12Hash(i * 1.9) * 6, 3 + dn12Hash(i * 2.3) * 4, PAL[isik]);
    }
  } else {
    // gövde ve dallar
    c.strokeStyle = '#6a5040'; c.lineCap = 'round';
    c.lineWidth = 8; c.beginPath(); c.moveTo(cx, h); c.quadraticCurveTo(cx - 3, h * 0.72, cx + 2, h * 0.5); c.stroke();
    c.lineWidth = 4;
    for (const [dx, dy] of [[-0.3, 0.3], [0.28, 0.33], [-0.12, 0.2], [0.1, 0.18]]) { c.beginPath(); c.moveTo(cx, h * 0.62); c.quadraticCurveTo(cx + dx * w * 0.4, h * 0.45, cx + dx * w, h * dy + 10); c.stroke(); }
    const ry = h * 0.36, rx = w * 0.47, oy = h * 0.4;
    // önce koyu iç kütle, sonra güneşli yaprak kümeleri
    dn12Elips(c, cx, oy + 6, rx * 0.86, ry * 0.8, PAL[0]);
    for (let i = 0; i < 230; i++) {
      const a = i * 2.39996 + tohum, rr = Math.sqrt(dn12Hash(tohum + i * 4.7)) * 0.98;
      const x = cx + Math.cos(a) * rr * rx, y = oy + Math.sin(a) * rr * ry * (Math.sin(a) > 0 ? 0.9 : 1.05);
      const isik = Math.max(0, Math.min(5, Math.round(2.4 - Math.cos(a) * rr * 1.5 - Math.sin(a) * rr * 1.7 + dn12Hash(i * 9.1) * 1.3)));
      const s = 5 + dn12Hash(i * 3.3) * 8;
      dn12Elips(c, x, y, s, s * 0.78, PAL[isik]);
    }
    // birkaç parlak benek (fotoğraf resimlerindeki gibi güneşli yaprak uçları)
    for (let i = 0; i < 40; i++) {
      const a = Math.PI * (1.05 + dn12Hash(i * 5.1) * 0.9), rr = 0.55 + dn12Hash(i * 2.7) * 0.4;
      dn12Elips(c, cx + Math.cos(a) * rr * rx, oy + Math.sin(a) * rr * ry, 2.5 + dn12Hash(i) * 3, 2, PAL[5]);
    }
  }
  DN12.onb[ad] = cv; return cv;
}

// Gözlem kulesi (~33 m, Bilgi Merkezi'nin yanında): sekizgen gövde, açık taş köşe payandaları arasında koyu cam şeritler,
// tabanda renkli sırlı tuğla deseni, tepede taşkın beyaz seyir balkonu, camlı fener ve basık kubbe (saat yok)
const DN12_KULE_W = 84, DN12_KULE_H = 330;
function dn12KuleSprite() {
  if (DN12.onb.kule) return DN12.onb.kule;
  const w = DN12_KULE_W, h = DN12_KULE_H, R = 2, cv = dn12Kanvas(w * R, h * R), c = cv.getContext('2d'); c.scale(R, R);
  const cx = w / 2;
  // kaide: açık taş, renkli sırlı tuğla kuşağı, koyu giriş
  c.fillStyle = '#e9dfcc'; c.fillRect(cx - 27, h - 34, 54, 34);
  c.fillStyle = '#d3c6ae'; c.fillRect(cx + 6, h - 34, 21, 34);
  const SIR = ['#b8543f', '#3f6f9a', '#d9a63e', '#4f8a6a'];
  for (let k = 0; k < 13; k++) for (let r = 0; r < 2; r++) { c.fillStyle = SIR[(k + r * 2) % 4]; c.fillRect(cx - 26 + k * 4, h - 30 + r * 4, 3.4, 3.4); }
  c.fillStyle = '#34484f'; c.fillRect(cx - 6, h - 20, 12, 20);
  c.fillStyle = '#efe7d6'; c.fillRect(cx - 30, h - 36, 60, 3);
  // sekizgen gövde: sol yüz güneşli, ön yüz, sağ yüz gölgede; her yüzde koyu cam şerit, köşelerde taş payanda
  const ust = 74, alt = h - 36;
  const yuz = [[cx - 18, 9, '#e6ddca', '#4d6670'], [cx - 9, 18, '#ddd3be', '#38525c'], [cx + 9, 9, '#c4b8a2', '#2c414a']];
  for (const [x, gen, tas, cam] of yuz) {
    c.fillStyle = tas; c.fillRect(x, ust, gen, alt - ust);
    c.fillStyle = cam; c.fillRect(x + 2.2, ust + 6, gen - 4.4, alt - ust - 14);
    c.fillStyle = 'rgba(210,232,238,.28)'; c.fillRect(x + 2.6, ust + 6, Math.max(1, (gen - 5) * 0.3), alt - ust - 14);
    c.fillStyle = 'rgba(235,230,215,.55)';
    for (let y = ust + 16; y < alt - 10; y += 12) c.fillRect(x + 2.2, y, gen - 4.4, 1);
  }
  // gövdenin üst bileziği
  c.fillStyle = '#f1eadb'; c.fillRect(cx - 20, ust - 8, 40, 8);
  c.fillStyle = '#cfc3ab'; c.fillRect(cx + 8, ust - 8, 12, 8);
  // seyir balkonu: geniş beyaz taşkın döşeme, altında gölge, ince korkuluk
  c.fillStyle = 'rgba(80,70,60,.25)'; c.fillRect(cx - 26, ust - 7, 52, 3);
  c.fillStyle = '#fbf8ef'; c.fillRect(cx - 32, ust - 14, 64, 7);
  c.fillStyle = '#d9d2c2'; c.fillRect(cx + 10, ust - 14, 22, 7);
  c.strokeStyle = '#c9c2b2'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(cx - 31, ust - 22); c.lineTo(cx + 31, ust - 22);
  for (let x = cx - 30; x <= cx + 30; x += 5) { c.moveTo(x, ust - 22); c.lineTo(x, ust - 14); }
  c.stroke();
  // camlı fener katı
  c.fillStyle = '#2f4650'; c.fillRect(cx - 15, ust - 40, 30, 26);
  c.fillStyle = 'rgba(200,230,240,.35)'; c.fillRect(cx - 14, ust - 39, 8, 24);
  c.fillStyle = '#eee8da'; for (let x = cx - 15; x <= cx + 13; x += 7) c.fillRect(x, ust - 40, 2, 26);
  // çatı plakası ve basık koyu kubbe, tepe ucu
  c.fillStyle = '#f7f3ea'; c.fillRect(cx - 19, ust - 45, 38, 5);
  c.fillStyle = '#5c6b72'; c.beginPath(); c.ellipse(cx, ust - 45, 13, 9, 0, Math.PI, 0); c.fill();
  c.fillStyle = '#7d8c93'; c.beginPath(); c.ellipse(cx - 4, ust - 47, 5, 4, 0, Math.PI, 0); c.fill();
  c.fillStyle = '#d8d2c4'; c.fillRect(cx - 0.8, ust - 60, 1.6, 7);
  DN12.onb.kule = cv; return cv;
}

// Bulut: yumuşak kenarlı çok sayıda küçük kümeden boyalı pamuk bulut; üstü güneşli, altı düz ve mavimsi gölgeli.
// ak=true: gün batımı (pembe-turuncu) kopyası
function dn12BulutSprite(i, ak) {
  const ad = 'bulut' + i + (ak ? 'a' : ''); if (DN12.onb[ad]) return DN12.onb[ad];
  const w = 340, h = 130, cv = dn12Kanvas(w, h), c = cv.getContext('2d');
  const tohum = i * 31.7, n = 26 + (i % 3) * 6, taban = h - 26;
  const ic = ak ? '255,240,228' : '255,255,255', kenar = ak ? '250,206,192' : '238,244,251';
  for (let k = 0; k < n; k++) {
    const u = dn12Hash(tohum + k * 1.13), x = 34 + u * (w - 68);
    const tepe = Math.sin(u * Math.PI) * (0.6 + 0.4 * dn12Hash(tohum + k * 2.9));   // ortası kabarık
    const r = 12 + tepe * 30 * (0.7 + dn12Hash(tohum + k * 3.7) * 0.5);
    const y = taban - r * 0.55 - tepe * 26 * dn12Hash(tohum + k * 4.1);
    const gr = c.createRadialGradient(x - r * 0.25, y - r * 0.3, 0, x, y, r);
    gr.addColorStop(0, 'rgba(' + ic + ',1)'); gr.addColorStop(0.62, 'rgba(' + kenar + ',.92)'); gr.addColorStop(1, 'rgba(' + kenar + ',0)');
    c.fillStyle = gr; c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // alt gölge ve sıcak üst ışık
  c.globalCompositeOperation = 'source-atop';
  const alt = c.createLinearGradient(0, h * 0.35, 0, taban + 6);
  alt.addColorStop(0, ak ? 'rgba(255,200,150,.25)' : 'rgba(255,250,235,.18)');
  alt.addColorStop(0.55, 'rgba(170,185,215,0)');
  alt.addColorStop(1, ak ? 'rgba(180,120,160,.5)' : 'rgba(146,168,204,.42)');
  c.fillStyle = alt; c.fillRect(0, 0, w, h);
  // düz alt kenar: yumuşak silme
  c.globalCompositeOperation = 'destination-out';
  const sil = c.createLinearGradient(0, taban - 8, 0, taban + 6);
  sil.addColorStop(0, 'rgba(0,0,0,0)'); sil.addColorStop(1, 'rgba(0,0,0,1)');
  c.fillStyle = sil; c.fillRect(0, taban - 8, w, h - taban + 8);
  c.globalCompositeOperation = 'source-over';
  DN12.onb[ad] = cv; return cv;
}

// Güneş ışıltısı (radyal gradyan bir kez)
function dn12IsiltiSprite(ad, ic, orta, dis) {
  if (DN12.onb[ad]) return DN12.onb[ad];
  const n = 256, cv = dn12Kanvas(n, n), c = cv.getContext('2d');
  const gr = c.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
  gr.addColorStop(0, ic); gr.addColorStop(0.25, orta); gr.addColorStop(1, dis);
  c.fillStyle = gr; c.fillRect(0, 0, n, n);
  DN12.onb[ad] = cv; return cv;
}

// Gök gradyanı (1 px genişlik, ekrana gerilir)
function dn12GokSprite(i) {
  const ad = 'gok' + i; if (DN12.onb[ad]) return DN12.onb[ad];
  const s = i === 'aksam' ? DN12_GOK_AKSAM : DN12_GOK[i].s;
  const cv = dn12Kanvas(1, 256), c = cv.getContext('2d'), gr = c.createLinearGradient(0, 0, 0, 256);
  const dur = [0, 0.38, 0.62, 0.8, 1];
  for (let k = 0; k < 5; k++) gr.addColorStop(dur[k], s[k]);
  c.fillStyle = gr; c.fillRect(0, 0, 1, 256);
  DN12.onb[ad] = cv; return cv;
}
// Dikey gradyan şeritleri (deniz, su, çim pusu): 1 px genişlik
function dn12Serit1(ad, duraklar) {
  if (DN12.onb[ad]) return DN12.onb[ad];
  const cv = dn12Kanvas(1, 128), c = cv.getContext('2d'), gr = c.createLinearGradient(0, 0, 0, 128);
  for (const [u, r] of duraklar) gr.addColorStop(u, r);
  c.fillStyle = gr; c.fillRect(0, 0, 1, 128);
  DN12.onb[ad] = cv; return cv;
}

// ── Uzun şerit önbellekleri (tepeler): katman biriminde, 2048 px'lik parçalar halinde ──
function dn12SeritYap(ad, f, Y0, Y1, R, ciz) {
  const L0 = -900, L1 = COLS * T * f + 900, pw = 2048, adim = pw / R;
  const s = { ad, f, Y0, Y1, R, L0, L1, adim, parca: [], ciz, n: Math.ceil((L1 - L0) / adim) };
  DN12.onb[ad] = s; return s;
}
function dn12SeritParca(s, i) {
  if (s.parca[i]) return s.parca[i];
  const cv = dn12Kanvas(s.adim * s.R, (s.Y1 - s.Y0) * s.R), c = cv.getContext('2d');
  const xa = s.L0 + i * s.adim;
  c.setTransform(s.R, 0, 0, s.R, -xa * s.R, -s.Y0 * s.R);
  s.ciz(c, xa - 40, xa + s.adim + 40);
  s.parca[i] = cv; return cv;
}

// Uzak tepeler (Tuzla / Orhanlı): üç sıra yumuşak, puslu sırt (en arkadaki en açık)
function dn12UzakSirt(L, kat) {
  const y0 = 512 + 16 * dn12Yumusak(1900, 2300, L) + kat * 24 - 40 * Math.sin(L * 0.0019 + 1.3 + kat * 1.7) - 24 * Math.sin(L * 0.0051 + 0.9 * kat) - 9 * Math.sin(L * 0.016 + kat * 2)
    - 14 * dn12Yumusak(1950, 2450, L) * (0.5 + 0.5 * Math.sin(L * 0.0013 + kat));   // gölet tarafında Aydos sırtları
  // gün batımı tepesi: ufuk açılır, uzakta yalnız alçak adalar (güneş denize batar)
  const ac = dn12Yumusak(2650, 2900, L);
  if (ac <= 0) return y0;
  let ada = 0;
  for (const [m, w, h] of [[2980, 70, 22], [3080, 45, 14], [3200, 90, 26]]) { const q = 1 - ((L - m) / w) * ((L - m) / w); if (q > 0) ada = Math.max(ada, h * Math.sqrt(q)); }
  return y0 + (612 - kat * 3 - ada * (kat === 2 ? 1 : 0.6) - y0) * ac;
}
function dn12UzakCiz(c, xa, xb) {
  const kat = [[0, '#c0c6e3', '#d6d9ee'], [1, '#9db0d6', '#b8c6e6'], [2, '#7d9fc0', '#9dbbd6']];
  for (const [k, renk, ust] of kat) {
    const gr = c.createLinearGradient(0, 470 + k * 24, 0, 600 + k * 20);
    gr.addColorStop(0, ust); gr.addColorStop(1, renk);
    c.fillStyle = gr; c.beginPath(); c.moveTo(xa, 660);
    for (let x = xa; x <= xb; x += 6) c.lineTo(x, dn12UzakSirt(x, k));
    c.lineTo(xb, 660); c.closePath(); c.fill();
    // sırtın eteğinde sis: her sıra öndekinden ayrılsın (puslu derinlik)
    const sis = c.createLinearGradient(0, 560 + k * 12, 0, 640);
    sis.addColorStop(0, 'rgba(226,232,244,0)'); sis.addColorStop(1, 'rgba(226,232,244,.55)');
    c.fillStyle = sis; c.beginPath(); c.moveTo(xa, 660);
    for (let x = xa; x <= xb; x += 6) c.lineTo(x, Math.max(dn12UzakSirt(x, k), 560 + k * 12));
    c.lineTo(xb, 660); c.closePath(); c.fill();
    // sırtın güneşli kenarı: ince açık çizgi
    c.strokeStyle = 'rgba(240,242,250,.35)'; c.lineWidth = 1.2; c.beginPath();
    for (let x = xa; x <= xb; x += 6) { const y = dn12UzakSirt(x, k); if (x === xa) c.moveTo(x, y + 1); else c.lineTo(x, y + 1); }
    c.stroke();
  }
  // kıyıda uzak kasaba: küçük beyaz evler (Tuzla)
  for (let x = Math.floor(xa / 23) * 23; x < xb; x += 23) {
    const h = dn12Hash(x * 0.37); if (h < 0.42) continue;
    const y = 622 - dn12Hash(x * 0.11) * 14;
    c.fillStyle = h > 0.8 ? '#e9e2da' : '#d9dde2'; c.fillRect(x, y, 7 + h * 6, 5 + h * 4);
    c.fillStyle = '#c4a69a'; c.fillRect(x, y - 1.5, 7 + h * 6, 1.5);
  }
}
// Orta tepeler: ormanlı sırt; denizin göründüğü çukurlar (lojman sabahı, gölet, gün batımı tepesi)
const DN12_CUKUR = [[22, 22, 0.6], [1068, 80, 1]];   // [sütun, genişlik (sütun), derinlik]
function dn12OrtaSirt(L) {
  let y = 576 - 22 * Math.sin(L * 0.0042 + 0.7) - 14 * Math.sin(L * 0.011 + 2.1) - 6 * Math.sin(L * 0.031);
  const col = L / (T * DN12_F.orta);
  for (const [c0, gen, d] of DN12_CUKUR) { const u = 1 - Math.min(1, Math.abs(col - c0) / gen); if (u > 0) y += (712 - y) * d * u * u * (3 - 2 * u); }
  return y;
}
function dn12OrtaCiz(c, xa, xb) {
  const gr = c.createLinearGradient(0, 560, 0, 720);
  gr.addColorStop(0, '#6f9a74'); gr.addColorStop(1, '#5b875f');
  c.fillStyle = gr; c.beginPath(); c.moveTo(xa, 730);
  for (let x = xa; x <= xb; x += 5) c.lineTo(x, dn12OrtaSirt(x));
  c.lineTo(xb, 730); c.closePath(); c.fill();
  // sırt boyunca ağaç tepeleri (orman dokusu): güneşli üst, gölgeli alt
  const PAL = ['#557f5b', '#62906a', '#71a074', '#86b07f', '#9cc08a'];
  for (let x = Math.floor(xa / 7) * 7; x < xb; x += 7) {
    const y = dn12OrtaSirt(x), h = dn12Hash(x * 0.13);
    for (let k = 0; k < 3; k++) {
      const yy = y + 4 + k * 9 + h * 4, r = 5 + dn12Hash(x * 0.7 + k) * 4;
      if (yy > 724) break;
      dn12Elips(c, x + (dn12Hash(x + k) - 0.5) * 5, yy, r, r * 0.8, PAL[Math.min(4, Math.max(0, 3 - k + Math.round(h * 1.5 - 0.6)))]);
    }
  }
  // yamaçlarda birkaç köy evi (Orhanlı)
  for (let x = Math.floor(xa / 61) * 61; x < xb; x += 61) {
    const h = dn12Hash(x * 0.21); if (h < 0.72) continue;
    const y = dn12OrtaSirt(x) + 14 + h * 10; if (y > 700) continue;
    c.fillStyle = '#eee7dc'; c.fillRect(x, y, 9, 6); c.fillStyle = '#c07a62'; c.beginPath(); c.moveTo(x - 1, y); c.lineTo(x + 4.5, y - 4); c.lineTo(x + 10, y); c.fill();
  }
}

// Yakın çalı sırası parçası (1200 birim, üç çeşit): fotoğraf resimlerindeki çiçekli çalılar
const DN12_CALI_W = 1200, DN12_CALI_Y0 = 610, DN12_CALI_Y1 = 704;
function dn12CaliSprite(v) {
  const ad = 'cali' + v; if (DN12.onb[ad]) return DN12.onb[ad];
  const R = DN12_R, w = DN12_CALI_W, h = DN12_CALI_Y1 - DN12_CALI_Y0, cv = dn12Kanvas(w * R, h * R), c = cv.getContext('2d');
  c.scale(R, R);
  const taban = h - 14, tohum = v * 101.3;
  const PAL = ['#3f7840', '#4d8a45', '#5f9c4b', '#77b052', '#95c55e', '#bcdc76'];
  // çim zemini (alt)
  const gr = c.createLinearGradient(0, taban - 10, 0, h);
  gr.addColorStop(0, '#8fbd55'); gr.addColorStop(1, '#7eb04c');
  c.fillStyle = gr; c.fillRect(0, taban - 8, w, h - taban + 8);
  // çalı kümeleri: kenarlarda dikiş olmasın diye x sarmalı (0 ve w aynı)
  for (let i = 0; i < 70; i++) {
    const x = (i + dn12Hash(tohum + i) * 0.8) / 70 * w, buyuk = 14 + dn12Hash(tohum + i * 2.7) * 26;
    for (let k = 0; k < 16; k++) {
      const a = Math.PI * (1 + dn12Hash(tohum + i * 13 + k) * 1), rr = dn12Hash(tohum + i * 7 + k * 3) * buyuk;
      const xx = x + Math.cos(a) * rr * 1.2, yy = taban + Math.sin(a) * rr * 0.9;
      const isik = Math.max(0, Math.min(5, Math.round(2.2 - Math.cos(a) * 1.2 - Math.sin(a) * 1.6 + dn12Hash(i * 3 + k) * 1.2)));
      for (const ox of [0, w, -w]) dn12Elips(c, xx + ox, yy, 5 + dn12Hash(k + i) * 6, 4 + dn12Hash(k * 2 + i) * 4, PAL[isik]);
    }
    // çiçekler (pembe, beyaz, sarı)
    if (dn12Hash(tohum + i * 5.5) > 0.45) {
      const renk = ['#f3a7bf', '#fff3f0', '#f7d36b', '#e98fb0'][Math.floor(dn12Hash(tohum + i * 6.1) * 4)];
      for (let k = 0; k < 9; k++) {
        const xx = x + (dn12Hash(i * 8 + k) - 0.5) * buyuk * 1.8, yy = taban - dn12Hash(i * 9 + k) * buyuk * 0.8 - 2;
        for (const ox of [0, w, -w]) dn12Daire(c, xx + ox, yy, 1.8 + dn12Hash(k * 4 + i) * 1.4, renk);
      }
    }
  }
  // seyrek küçük selvi/çalı fidanları
  for (let i = 0; i < 5; i++) {
    const x = dn12Hash(tohum + i * 17) * w, hh = 40 + dn12Hash(tohum + i * 19) * 30;
    for (let k = 0; k < 30; k++) {
      const v2 = k / 30, xx = x + (dn12Hash(i * 31 + k) - 0.5) * 16 * (1 - v2), yy = taban - v2 * hh;
      dn12Elips(c, xx, yy, 5 * (1 - v2 * 0.6), 4, PAL[Math.min(5, 1 + Math.round(v2 * 2 + dn12Hash(k + i) * 1.5))]);
    }
  }
  DN12.onb[ad] = cv; return cv;
}

// ── Ağaç yerleşimi (bina katmanı): binaların arasında kümeler, kenarlarda dikişi örten ağaçlar; göl kıyısı ve tepe seyrek ──
const DN12_AGACLAR = [];       // { L, y, tur, s, ayna, arka }
const DN12_YAKIN_AGAC = [];    // yakın katman (paralaks .62)
(function dn12Yerlestir() {
  const f = DN12_F.bina, golA = DN12_GOL.c0 * T * f, golB = DN12_GOL.c1 * T * f;
  const icinde = L => { for (const b of DN12_BINALAR) if (L > b.L - b.w / 2 + 70 && L < b.L + b.w / 2 - 70) return true; return false; };
  let L = -800, i = 0;
  while (L < COLS * T * f + 800) {
    const h = dn12Hash(i * 3.7 + 1);
    L += 48 + h * 70; i++;
    if (L > golA - 120 && L < golB + 60) continue;             // gölde ağaç yok (kıyı ağaçları aşağıda)
    const arka = icinde(L);
    if (arka && dn12Hash(i * 2.1) > 0.22) continue;              // bina önünde değil, yalnız ara sıra arkasında
    const t = dn12Hash(i * 1.3);
    let tur = t < 0.34 ? 'yuvarlak' : t < 0.55 ? 'sari' : t < 0.72 ? 'selvi' : t < 0.84 ? 'cam' : 'kiraz';
    const col = L / (T * f);
    if (col > 560 && col < 700) tur = t < 0.3 ? 'cam' : t < 0.5 ? 'selvi' : t < 0.72 ? 'kiraz' : t < 0.86 ? 'yuvarlak' : 'sari';   // botanik: çam, selvi, kiraz
    const s = (arka ? 0.85 : 0.6) + dn12Hash(i * 4.1) * 0.45;
    DN12_AGACLAR.push({ L, y: DN12_TABAN + 4 + dn12Hash(i * 6.6) * 6, tur, s, ayna: dn12Hash(i * 7.7) > 0.5, arka });
  }
  // bina kenarlarına birer ağaç (resimlerin yumuşak yan kenarını örter)
  for (const b of DN12_BINALAR) {
    if (b.ad === 'golet' || b.kiyi) continue;
    if (b.acik) {   // önü açık bina: kenar ağaçları biraz dışarıda
      for (const yon of [-1, 1]) DN12_AGACLAR.push({ L: b.L + yon * (b.acik + 30), y: DN12_TABAN + 6, tur: yon > 0 ? 'selvi' : 'yuvarlak', s: 0.8, ayna: yon > 0, arka: false });
      continue;
    }
    for (const yon of [-1, 1]) {
      const n = DN12_AGACLAR.length;
      DN12_AGACLAR.push({ L: b.L + yon * (b.w / 2 - 18), y: DN12_TABAN + 6, tur: n % 3 ? 'yuvarlak' : 'selvi', s: 0.8 + dn12Hash(n) * 0.25, ayna: yon > 0, arka: false });
    }
  }
  // gölün karşı kıyısı: alçak ağaç ve çalılar (resmin iki yanında)
  const golet = DN12_BINALAR.find(b => b.ad === 'golet');
  const kiyiY = golet.alt - (293 - 134) * DN12_K;
  for (let x = golA - 60, k = 0; x < golB + 120; x += 150 + dn12Hash(k * 3.3) * 260, k++) {
    if (x > golet.L - golet.w / 2 + 40 && x < golet.L + golet.w / 2 - 40) continue;
    if (x > COLS * T * f + 600) break;
    const n = 1 + Math.floor(dn12Hash(k * 5.1) * 3);   // 1-3 ağaçlık küme
    for (let j = 0; j < n; j++) {
      const xx = x + j * (16 + dn12Hash(k + j) * 14), t = dn12Hash(k * 7 + j);
      DN12_AGACLAR.push({ L: xx, y: dn12GolUst(xx) - 1, tur: t > 0.75 ? 'selvi' : t > 0.4 ? 'yuvarlak' : 'sari', s: 0.26 + dn12Hash(k * 9 + j) * 0.2, ayna: t > 0.5, arka: false, kiyi: true });
    }
  }
  DN12.kiyiY = kiyiY;
  // önü açık kalacak binalar (SUNUM) ve kıyı binaları: önlerindeki (arka olmayan) ağaçları kaldır
  for (let i = DN12_AGACLAR.length - 1; i >= 0; i--) {
    const A = DN12_AGACLAR[i]; if (A.arka) continue;
    for (const b of DN12_BINALAR) {
      const yari = b.acik || (b.kiyi && A.kiyi ? b.w / 2 + 6 : 0);
      if (yari && Math.abs(A.L - b.L) < yari) { DN12_AGACLAR.splice(i, 1); break; }
    }
  }
  DN12_AGACLAR.sort((a, b) => (a.arka === b.arka ? a.y - b.y : a.arka ? -1 : 1));
  // yakın katman ağaçları: seyrek, büyük; gölde yok
  const fy = DN12_F.yakin, yA = DN12_GOL.y0 * T * fy, yB = DN12_GOL.y1 * T * fy;
  for (let x = 300, k = 0; x < COLS * T * fy + 600; x += 1300 + dn12Hash(k * 2.9) * 1200, k++) {
    if (x > yA - 140 && x < yB + 140) continue;
    if (x > 1030 * T * fy - 100) break;   // tepede yakın ağaç yok (göl manzarası açık)
    const t = dn12Hash(k * 1.7);
    DN12_YAKIN_AGAC.push({ L: x, tur: t < 0.4 ? 'yuvarlak' : t < 0.65 ? 'sari' : t < 0.8 ? 'kiraz' : 'selvi', s: 0.62 + dn12Hash(k * 3.3) * 0.22, ayna: t > 0.5 });
  }
})();
// Gölün karşı kıyı çizgisi (bina katmanı, katman birimi): uçlarda çimin hizasından resmin kıyısına yumuşak yükselir
function dn12GolUst(L) {
  const f = DN12_F.bina, a = DN12_GOL.c0 * T * f, ust = 700 - (293 - 134) * DN12_K;
  const u = dn12Yumusak(a - 200, a + 260, L);
  return 664 + (ust - 664) * u + 3 * Math.sin(L * 0.02);
}

// ── Isıtma: önbellekleri kareye yayarak kur (oyun.js dn12Isit'i her karede çağırır; true = bitti) ──
const DN12_ISIT = [];
function dn12IsitListesi() {
  if (DN12_ISIT.length) return;
  for (let i = 0; i < DN12_GOK.length; i++) DN12_ISIT.push(() => dn12GokSprite(i));
  DN12_ISIT.push(() => dn12GokSprite('aksam'));
  DN12_ISIT.push(() => dn12IsiltiSprite('isiltiGun', 'rgba(255,253,240,1)', 'rgba(255,244,205,.45)', 'rgba(255,240,200,0)'));
  DN12_ISIT.push(() => dn12IsiltiSprite('isiltiAk', 'rgba(255,236,190,1)', 'rgba(255,170,110,.42)', 'rgba(255,140,110,0)'));
  DN12_ISIT.push(() => dn12IsiltiSprite('vinyet', 'rgba(60,40,70,0)', 'rgba(60,40,70,0)', 'rgba(60,40,70,.5)'));
  DN12_ISIT.push(() => dn12IsiltiSprite('zerre', 'rgba(255,255,240,1)', 'rgba(255,250,220,.5)', 'rgba(255,250,220,0)'));
  for (let i = 0; i < 5; i++) { DN12_ISIT.push(() => dn12BulutSprite(i, false)); DN12_ISIT.push(() => dn12BulutSprite(i, true)); }
  DN12_ISIT.push(() => dn12Serit1('deniz', [[0, '#c8dcea'], [0.12, '#9ec6e0'], [0.5, '#79acd4'], [1, '#6496c6']]));
  DN12_ISIT.push(() => dn12Serit1('gol', [[0, '#b4cfd0'], [0.16, '#8cbdd9'], [0.55, '#64acdf'], [1, '#5aa6dd']]));
  DN12_ISIT.push(() => dn12Serit1('yakinSu', [[0, 'rgba(110,176,224,.9)'], [1, 'rgba(110,176,224,0)']]));
  DN12_ISIT.push(() => dn12Serit1('uzakSicak', [[0, 'rgba(255,190,165,0)'], [0.55, 'rgba(250,176,150,.32)'], [1, 'rgba(246,168,140,.42)']]));
  DN12_ISIT.push(() => dn12Serit1('cimPus', [[0, '#a7c77c'], [0.5, '#93bb5f'], [1, '#86b053']]));
  DN12_ISIT.push(() => dn12KuleSprite());
  for (const t of DN12_AGAC_TUR) DN12_ISIT.push(() => dn12AgacSprite(t));
  for (let v = 0; v < 3; v++) DN12_ISIT.push(() => dn12CaliSprite(v));
  const uz = dn12SeritYap('uzak', DN12_F.uzak, 396, 660, 1, dn12UzakCiz);
  for (let i = 0; i < uz.n; i++) DN12_ISIT.push(() => dn12SeritParca(uz, i));
  const or = dn12SeritYap('orta', DN12_F.orta, 540, 730, 1, dn12OrtaCiz);
  for (let i = 0; i < or.n; i++) DN12_ISIT.push(() => dn12SeritParca(or, i));
}
function dn12Isit() {
  dn12IsitListesi();
  // kareye bir (en çok iki hafif) iş
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0;
  while (DN12.isitAdim < DN12_ISIT.length) {
    DN12_ISIT[DN12.isitAdim++]();
    if (typeof performance === 'undefined' || performance.now() - t0 > 6) break;
  }
  if (DN12.isitAdim < DN12_ISIT.length) return false;
  // BINA'nın bina tuvalleri: kareye bir bina (bitene kadar)
  if (!DN12.binaHazir && typeof bn12Isit === 'function') { try { DN12.binaHazir = !!bn12Isit(); } catch (e) { DN12.binaHazir = true; } if (!DN12.binaHazir) return false; }
  // resimler hazırsa ana tuvale görünmez küçük bir kopyasını çiz: ekran kartına yüklensin (ilk görünüşte takılma olmasın)
  let hepsi = true;
  for (const ad in DN12_RESIM) { const r = DN12_RESIM[ad]; if (!r.hazir && !r.hata) hepsi = false; else if (r.hazir && !r.isindi && typeof g !== 'undefined') { try { g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 0.004; g.drawImage(r.bmp || r.img, 0, 0, 2, 2); g.globalAlpha = 1; } catch (e) {} r.isindi = true; } }
  DN12.hazir = true;
  return hepsi;
}

// ── Kare başı durum: gün, güneş, ışık ──
function dn12Durum(tm) {
  const dt = DN12.sonT < 0 || !(tm > DN12.sonT) ? 0 : Math.min(0.1, tm - DN12.sonT);
  DN12.sonT = tm;
  const px = typeof P !== 'undefined' && Number.isFinite(P.x) ? P.x : 0;
  let hedef = dn12GunHedefi(px / T);
  const F = typeof K12FINAL !== 'undefined' && K12FINAL ? K12FINAL : null;
  if (F && F.aktif) hedef = 1;
  if (DN12.zorla !== null && Number.isFinite(DN12.zorla)) hedef = DN12.zorla;
  DN12.gunHedef = hedef;
  // yumuşak ilerleyiş; büyük sıçramada (ışınlama/test) bir anda
  if (dt === 0 || Math.abs(hedef - DN12.gun) > 0.12) DN12.gun = hedef;
  else DN12.gun += (hedef - DN12.gun) * (1 - Math.exp(-dt * 1.2));
  const u = DN12.gun;
  // FINAL: altın saat güneşi ufka indirir, akşam göğü lacivert-mora çeker
  const altin = F && F.aktif && Number.isFinite(F.altin) ? Math.max(0, Math.min(1, F.altin)) : 0;
  DN12.aksam = DN12_AKSAM && F && F.aktif && Number.isFinite(F.aksam) ? Math.max(0, Math.min(1, F.aksam)) : 0;
  // güneş: sabah solda alçak, öğle tepede, gün batımında sağda ufka yakın
  DN12.gunesX = 0.2 + 0.52 * u;
  // akşamüstü güneş ekrandaki gerçek ufka (gölün karşı kıyısı) iner: kamera/zoom ne olursa olsun suya batar
  let ufuk = 0.66;
  if (typeof cam !== 'undefined' && Number.isFinite(cam.y) && S > 0 && H > 0 && DN12.kiyiY) {
    const f = DN12_F.bina; ufuk = Math.max(0.3, Math.min(0.9, (DN12.kiyiY - 4 - dn12KatmanY(f)) * S / H));
  }
  let gy = u < 0.32 ? 0.22 - 0.11 * (u / 0.32) : 0.11 + (ufuk - 0.07 - 0.11) * dn12Yumusak(0.32, 1, u);
  gy += altin * 0.055 + DN12.aksam * 0.06;
  DN12.gunesY = gy;
  if (typeof W === 'number') { DN12.gunesXY.x = DN12.gunesX * W; DN12.gunesXY.y = DN12.gunesY * H; }
  const i = Math.round(u * 100);
  DN12.isik.ton = DN12_ISIK_TON[i];
  let k = 0; while (k < DN12_ISIK_ANAHTAR.length - 2 && u > DN12_ISIK_ANAHTAR[k + 1]) k++;
  const v = (u - DN12_ISIK_ANAHTAR[k]) / (DN12_ISIK_ANAHTAR[k + 1] - DN12_ISIK_ANAHTAR[k]);
  DN12.isik.guc = DN12_ISIK_GUC[k] + (DN12_ISIK_GUC[k + 1] - DN12_ISIK_GUC[k]) * Math.max(0, Math.min(1, v)) + DN12.aksam * 0.2;
  DN12.golRenk.ust = DN12_SU_UST[i]; DN12.golRenk.alt = DN12_SU_ALT[i];
}

function dn12Hazir() { return typeof g !== 'undefined' && typeof W === 'number' && typeof H === 'number' && S > 0 && typeof cam !== 'undefined' && Number.isFinite(cam.x) && Number.isFinite(cam.y); }
// Katman dönüşümü: f paralaksında katman birimleri → ekran pikseli
// Dikey paralaks yatayınkinden çok daha az: kamera aşağı/yukarı kayınca (final kadrajı gibi) ufuk çizgisi zeminle birlikte kalsın
function dn12KatmanY(f) { return cam.y - (cam.y - DN12_CY) * (1 - f) * 0.3; }
function dn12Katman(f) {
  g.setTransform(S, 0, 0, S, W / 2 - DN12.cx * f * S, -dn12KatmanY(f) * S);
}
// Görünen katman aralığı (f'de)
function dn12Sol(f) { return DN12.cx * f - W / 2 / S; }
function dn12Sag(f) { return DN12.cx * f + W / 2 / S; }

function dn12SeritCiz(s) {
  if (!s) return;
  const a = dn12Sol(s.f), b = dn12Sag(s.f);
  const i0 = Math.max(0, Math.floor((a - s.L0) / s.adim)), i1 = Math.min(s.n - 1, Math.floor((b - s.L0) / s.adim));
  for (let i = i0; i <= i1; i++) {
    const p = s.parca[i]; if (!p) continue;   // ısıtma bitmediyse o parça atlanır (gök görünür; bir sonraki karede gelir)
    g.drawImage(p, s.L0 + i * s.adim, s.Y0, s.adim + 0.5 / S, s.Y1 - s.Y0);
  }
}

// ── 1) GÖK, GÜNEŞ, BULUTLAR, TEPELER, DENİZ, BİNALAR, YAKIN ÇALI SIRASI ──
function dn12Background(tm) {
  if (!dn12Hazir()) return;
  if (!DN12_ISIT.length) dn12IsitListesi();
  if (!DN12.hazir) { // ısıtma hiç çalışmadıysa (ör. oyun.js ısıtmayı atladı) burada bitir
    while (DN12.isitAdim < DN12_ISIT.length) DN12_ISIT[DN12.isitAdim++]();
    DN12.hazir = true;
  }
  const t = Number.isFinite(tm) ? tm : 0;
  dn12Durum(t);
  DN12.cx = cam.x + VW / 2; DN12.camY = cam.y;
  const u = DN12.gun, O = DN12.onb;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';

  // Gök: iki anahtar anın gradyanı üst üste
  let k = 0; while (k < DN12_GOK.length - 2 && u > DN12_GOK[k + 1].u) k++;
  const v = dn12Yumusak(DN12_GOK[k].u, DN12_GOK[k + 1].u, u);
  const gokA = O['gok' + k], gokB = O['gok' + (k + 1)];
  if (gokA) { g.drawImage(gokA, 0, 0, 1, 256, 0, 0, W, H); if (v > 0.003 && gokB) { g.globalAlpha = v; g.drawImage(gokB, 0, 0, 1, 256, 0, 0, W, H); } }
  else { g.fillStyle = '#9fd0ef'; g.fillRect(0, 0, W, H); }
  if (DN12.aksam > 0.003 && O.gokaksam) { g.globalAlpha = DN12.aksam; g.drawImage(O.gokaksam, 0, 0, 1, 256, 0, 0, W, H); }
  g.globalAlpha = 1;
  // akşam: ilk yıldızlar
  if (DN12.aksam > 0.25) {
    g.fillStyle = '#fff8e8';
    for (let i = 0; i < 26; i++) {
      const sx = dn12Hash(i * 3.1) * W, sy = dn12Hash(i * 5.7) * H * 0.42;
      g.globalAlpha = (DN12.aksam - 0.25) * 1.3 * (0.55 + 0.45 * Math.sin(t * 1.7 + i));
      const r = (1 + dn12Hash(i) * 1.4) * S * 0.8; g.fillRect(sx - r / 2, sy - r / 2, r, r);
    }
    g.globalAlpha = 1;
  }

  // Güneş: büyük yumuşak ışıltı + disk (gün batımına doğru turuncu ve büyük)
  const gx = DN12.gunesXY.x, gy = DN12.gunesXY.y, gR = (26 + 10 * dn12Yumusak(0.6, 1, u)) * S;
  const isGun = O.isiltiGun, isAk = O.isiltiAk, ak = dn12Yumusak(0.55, 0.95, u);
  if (isGun) {
    const r1 = gR * 9;
    if (ak < 0.99) { g.globalAlpha = 0.75 * (1 - ak); g.drawImage(isGun, gx - r1, gy - r1, r1 * 2, r1 * 2); }
    if (ak > 0.01 && isAk) { const r2 = gR * 13; g.globalAlpha = 0.85 * ak * (1 - DN12.aksam * 0.6); g.drawImage(isAk, gx - r2, gy - r2, r2 * 2, r2 * 2); }
    g.globalAlpha = 1;
  }
  g.fillStyle = DN12_GUNES_RENK[Math.round(u * 100)];
  g.globalAlpha = 1 - DN12.aksam * 0.8;
  g.beginPath(); g.arc(gx, gy, gR, 0, Math.PI * 2); g.fill();
  // parlak çekirdek (gündüz bembeyaz, gün batımında sıcak sarı)
  g.fillStyle = ak > 0.5 ? '#fff0c4' : '#fffffb'; g.globalAlpha = (0.85 - 0.35 * ak) * (1 - DN12.aksam);
  g.beginPath(); g.arc(gx, gy, gR * 0.72, 0, Math.PI * 2); g.fill();
  g.globalAlpha = 1;

  // Bulutlar: yavaş rüzgârla kayar, çok az paralaks; gün batımında pembe-turuncu kopyaya geçer
  dn12Bulutlar(t, ak);

  // Uzak tepeler ve deniz (gök rengi biraz arkadan sızsın: puslu uzaklık)
  dn12Katman(DN12_F.uzak); g.globalAlpha = 0.94 - 0.14 * ak; dn12SeritCiz(O.uzak); g.globalAlpha = 1;
  // gün batımında uzak tepeler ve ufuk sıcak pembe-turuncu ışık alır
  if (ak > 0.01 && O.uzakSicak) { g.globalAlpha = ak; g.drawImage(O.uzakSicak, 0, 0, 1, 128, dn12Sol(DN12_F.uzak) - 10, 420, dn12Sag(DN12_F.uzak) - dn12Sol(DN12_F.uzak) + 20, 240); g.globalAlpha = 1; }
  dn12Deniz(t);
  dn12Katman(DN12_F.orta); dn12SeritCiz(O.orta);

  // Kampüs binaları katmanı
  dn12Katman(DN12_F.bina);
  dn12BinaKatmani(t);

  // Yakın çalı sırası (gölette su)
  dn12Katman(DN12_F.yakin);
  dn12YakinKatman(t);

  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
}

// Bulutlar: 9 bulut, her biri kendi hızıyla; ekran biriminde sarmal
const DN12_BULUT = [];
for (let i = 0; i < 9; i++) DN12_BULUT.push({ x: dn12Hash(i * 9.1) * 2400, y: 0.04 + dn12Hash(i * 4.3) * 0.26, s: 0.45 + dn12Hash(i * 2.2) * 0.6, v: 3 + dn12Hash(i * 6.1) * 5, tur: i % 5, p: 0.02 + (i % 3) * 0.01 });
function dn12Bulutlar(t, ak) {
  const O = DN12.onb, aralik = 2400;
  for (const b of DN12_BULUT) {
    const sp = O['bulut' + b.tur]; if (!sp) continue;
    const w = 340 * b.s * S, h = 130 * b.s * S;
    // dünya biriminde konum → ekran
    let x = (b.x + t * b.v - DN12.cx * b.p) % aralik; if (x < 0) x += aralik;
    const sx = (x - 500) * S * 0.75, sy = b.y * H * (1 - 0.15 * b.s);
    if (sx > W + 20 || sx + w < -20) continue;
    if (ak < 0.99) { g.globalAlpha = 0.92 * (1 - DN12.aksam * 0.5); g.drawImage(sp, sx, sy, w, h); }
    if (ak > 0.01) { const sa = O['bulut' + b.tur + 'a']; if (sa) { g.globalAlpha = ak * (1 - DN12.aksam * 0.5); g.drawImage(sa, sx, sy, w, h); } }
  }
  g.globalAlpha = 1;
}

// Marmara denizi: ufukta ince parlak şerit; dalga pırıltıları, güneş alçalınca altın ışık yolu
function dn12Deniz(t) {
  const f = DN12_F.deniz, O = DN12.onb;
  dn12Katman(f);
  const a = dn12Sol(f) - 10, b = dn12Sag(f) + 10, y0 = 616, y1 = 712;
  if (O.deniz) { g.globalAlpha = 0.9; g.drawImage(O.deniz, 0, 0, 1, 128, a, y0, b - a, y1 - y0); g.globalAlpha = 1; }
  // gün batımında deniz göğün sıcak rengini yansıtır
  const sicak = dn12Yumusak(0.6, 1, DN12.gun);
  if (sicak > 0.01) { g.globalAlpha = 0.4 * sicak; g.fillStyle = '#f7b48c'; g.fillRect(a, y0, b - a, y1 - y0); g.globalAlpha = 1; }
  // pırıltılar: sabit noktalar, yavaş yanıp söner (karede yeni nesne yok)
  g.fillStyle = '#ffffff';
  for (let x = Math.floor(a / 37) * 37; x < b; x += 37) {
    const h = dn12Hash(x * 0.17), yy = y0 + 6 + h * 70;
    const al = 0.5 + 0.5 * Math.sin(t * (0.9 + h) + x);
    if (al < 0.55) continue;
    g.globalAlpha = (al - 0.55) * 1.4; g.fillRect(x + h * 20, yy, 5 + h * 7, 0.9);
  }
  // güneşin altın yolu (gün batımı)
  const ak = dn12Yumusak(0.6, 0.95, DN12.gun);
  if (ak > 0.01) {
    const gxL = (DN12.gunesXY.x - W / 2) / S + DN12.cx * f;   // güneşin bu katmandaki x'i
    g.fillStyle = '#ffd58a';
    for (let i = 0; i < 16; i++) {
      const yy = y0 + 3 + i * 5, gen = 10 + i * 3.2, dx = Math.sin(t * 1.3 + i * 1.7) * 6;
      g.globalAlpha = ak * (0.65 - i * 0.03) * (0.6 + 0.4 * Math.sin(t * 2.1 + i));
      g.fillRect(gxL - gen / 2 + dx, yy, gen, 1.4);
    }
  }
  g.globalAlpha = 1;
}

// Bina katmanı: uzak çim, büyük gölün suyu, arka ağaçlar, binalar (resimler + BINA'nın stilize çizimleri), gözlem kulesi, ön ağaçlar
function dn12BinaKatmani(t) {
  const f = DN12_F.bina, O = DN12.onb, a = dn12Sol(f) - 20, b = dn12Sag(f) + 20;
  const golA = DN12_GOL.c0 * T * f, golB = DN12_GOL.c1 * T * f;
  // uzak çimen: binaların tabanından aşağı (gölün başladığı yere kadar; sonrası su)
  if (a < golA + 300) {
    const sag = Math.min(b, golA + 300);
    g.fillStyle = '#9cc067'; g.fillRect(a, 664, sag - a, 80);
    if (O.cimPus) g.drawImage(O.cimPus, 0, 0, 1, 128, a, 676, sag - a, 64);
    // binalar arası yürüyüş yolu: ince açık taş şerit
    const yolSag = Math.min(sag, golA - 150);
    if (yolSag > a) { g.fillStyle = 'rgba(240,226,200,.85)'; g.fillRect(a, 678, yolSag - a, 3.5); }
  }
  // büyük gölet: karşı kıyı çizgisi başta çimen hizasından yükselir, haritanın sonuna kadar sürer (tepeden de görünür)
  if (b > golA - 260) {
    const xa = Math.max(a, golA - 220), xb = Math.min(b, golB);
    g.save();
    g.beginPath(); g.moveTo(xa, 744);
    for (let x = xa; x <= xb; x += 16) g.lineTo(x, dn12GolUst(x));
    g.lineTo(xb, dn12GolUst(xb)); g.lineTo(xb, 744); g.closePath(); g.clip();
    if (O.gol) g.drawImage(O.gol, 0, 0, 1, 128, xa, DN12.kiyiY - 6, xb - xa, 744 - DN12.kiyiY + 6);
    // yansıma pırıltıları
    g.fillStyle = 'rgba(240,252,255,.7)';
    for (let x = Math.floor(xa / 41) * 41; x < xb; x += 41) {
      const h = dn12Hash(x * 0.31), yy = DN12.kiyiY + 10 + h * 80, o = Math.sin(t * 0.8 + x * 0.05) * 4;
      g.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.1 + h * 9)); g.fillRect(x + o, yy, 12 + h * 16, 1.2);
    }
    // gün batımında güneşin göldeki altın yolu
    const ak = dn12Yumusak(0.62, 0.95, DN12.gun);
    if (ak > 0.01) {
      const gxL = (DN12.gunesXY.x - W / 2) / S + DN12.cx * f;
      g.fillStyle = '#ffd88c';
      for (let i = 0; i < 18; i++) {
        const yy = DN12.kiyiY + 4 + i * 4.6, gen = 14 + i * 5, dx = Math.sin(t * 1.2 + i * 1.9) * 7;
        g.globalAlpha = ak * (0.7 - i * 0.03) * (0.6 + 0.4 * Math.sin(t * 2 + i));
        g.fillRect(gxL - gen / 2 + dx, yy, gen, 1.6);
      }
    }
    g.globalAlpha = 1;
    g.restore();
    dn12KiyiSeridi(a, b);   // karşı kıyı: alçak, kesintisiz çalılık şeridi
    dn12GolHayati(t, xa, xb);   // uzak gölde yavaş süzülen küçük yelkenliler ve karşı kıyıdaki iskeleler
  }
  // arka ağaçlar (binaların arkasında, çatıların üstünden görünür)
  for (const A of DN12_AGACLAR) if (A.arka) dn12AgacCizKatman(A, a, b);
  // binalar: BINA'nın çizimi varsa o, yoksa resim
  const bnVar = typeof bn12Var === 'function' && typeof bn12Ciz === 'function';
  for (const B of DN12_BINALAR) {
    if (B.L + B.w / 2 < a || B.L - B.w / 2 > b) continue;
    if (B.bina && bnVar) {
      let var_ = false; try { var_ = bn12Var(B.bina); } catch (e) {}
      if (var_) {
        const y = B.kiyi ? dn12GolUst(B.L) - 1 : DN12_TABAN;
        try { bn12Ciz(B.bina, g, B.L, y, B.olcek || 1, t); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('bn12Ciz', e); }
        dn12Katman(f); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        continue;
      }
    }
    const r = B.r; if (!r) continue;
    const im = r.bmp || r.img;
    if (!r.hazir || !im) continue;   // yüklenmediyse ağaçlar ve tepeler yine güzel bir kampüs gösterir
    if (B.ayna) { g.save(); g.translate(B.L, 0); g.scale(-1, 1); g.drawImage(im, -B.w / 2, B.y0, B.w, B.h); g.restore(); }
    else g.drawImage(im, B.L - B.w / 2, B.y0, B.w, B.h);
  }
  // gözlem kulesi
  const kL = DN12_KULE_C * T * f, kw = DN12_KULE_W * 0.86, kh = DN12_KULE_H * 0.86;
  if (O.kule && kL > a - 60 && kL < b + 60) g.drawImage(O.kule, kL - kw / 2, DN12_TABAN + 4 - kh, kw, kh);
  // ön ağaçlar (aralarda kümeler)
  for (const A of DN12_AGACLAR) if (!A.arka) dn12AgacCizKatman(A, a, b);
}
const DN12_YELKEN = [{ c: 860, v: 2.2, y: 16, s: 1 }, { c: 945, v: -1.6, y: 34, s: 0.8 }, { c: 1050, v: 1.2, y: 10, s: 0.9 }];
const DN12_ISKELE = [880, 1010];
function dn12GolHayati(t, xa, xb) {
  const f = DN12_F.bina, ky = DN12.kiyiY;
  // iskeleler: karşı kıyıdan suya uzanan ince ahşap döşeme + direkler
  for (const c of DN12_ISKELE) {
    const x = c * T * f; if (x < xa - 60 || x > xb + 60) continue;
    g.fillStyle = '#a07a5a'; g.fillRect(x - 3, ky - 1, 6, 16);
    g.fillStyle = '#c69b72'; g.fillRect(x - 5, ky + 13, 34, 3);
    g.fillStyle = '#7d5d45'; for (let k = 0; k < 4; k++) g.fillRect(x - 4 + k * 10, ky + 16, 1.6, 5);
    g.fillStyle = 'rgba(120,90,70,.25)'; g.fillRect(x - 5, ky + 21, 34, 2);
  }
  // yelkenliler: gövde + iki üçgen yelken, suda kısa yansıma; çok yavaş ileri geri
  for (const Y of DN12_YELKEN) {
    const x0 = Y.c * T * f, x = x0 + Math.sin(t * 0.03 * Math.abs(Y.v) + Y.c) * 160 * Math.sign(Y.v);
    if (x < xa - 40 || x > xb + 40) continue;
    const y = ky + Y.y + Math.sin(t * 1.1 + Y.c) * 0.6, s = Y.s;
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x - 9 * s, y + 2, 18 * s, 1.2);
    g.fillStyle = '#f4f1ea'; g.beginPath(); g.moveTo(x - 8 * s, y - 2 * s); g.lineTo(x + 8 * s, y - 2 * s); g.lineTo(x + 6 * s, y + 1); g.lineTo(x - 6 * s, y + 1); g.closePath(); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x, y - 3 * s); g.lineTo(x, y - 20 * s); g.lineTo(x + 8 * s, y - 3 * s); g.closePath(); g.fill();
    g.fillStyle = '#e9eef2'; g.beginPath(); g.moveTo(x - 1, y - 3 * s); g.lineTo(x - 1, y - 15 * s); g.lineTo(x - 6 * s, y - 3 * s); g.closePath(); g.fill();
  }
}
function dn12KiyiSeridi(a, b) {
  const O = DN12.onb, f = DN12_F.bina, golA = DN12_GOL.c0 * T * f, golB = DN12_GOL.c1 * T * f;
  const sk = 0.34, cw = DN12_CALI_W * sk, ch = (DN12_CALI_Y1 - DN12_CALI_Y0) * sk;
  const xa = Math.max(a, golA - 120), xb = Math.min(b, golB);
  for (let i = Math.floor(xa / cw); i * cw < xb; i++) {
    const sp = O['cali' + ((i + 1) % 3)]; if (!sp) continue;
    const x = i * cw, y = dn12GolUst(x + cw / 2);
    g.drawImage(sp, x, y - ch + 5 * sk + 3, cw + 0.6 / S, ch);
  }
}
function dn12AgacCizKatman(A, a, b) {
  const sp = DN12.onb['agac_' + A.tur]; if (!sp) return;
  const [w, h] = DN12_AGAC_OLCU[A.tur], ww = w * A.s, hh = h * A.s;
  if (A.L + ww / 2 < a || A.L - ww / 2 > b) return;
  if (A.ayna) { g.save(); g.translate(A.L, 0); g.scale(-1, 1); g.drawImage(sp, -ww / 2, A.y - hh, ww, hh); g.restore(); }
  else g.drawImage(sp, A.L - ww / 2, A.y - hh, ww, hh);
}

// Yakın katman: çiçekli çalı sırası + seyrek büyük ağaçlar; gölet bölgesinde su (GOLET'in su şeridine renkle bağlanır)
function dn12YakinKatman(t) {
  const f = DN12_F.yakin, O = DN12.onb, a = dn12Sol(f) - 20, b = dn12Sag(f) + 20;
  const suA = DN12_GOL.y0 * T * f, suB = DN12_GOL.y1 * T * f;
  const alt = (H / S) + DN12_CY + 200;   // ekranın dibinin güvenle altı (katman birimi)
  // su: üstte açık, y≈700'den aşağısı tam olarak dn12GolRenk().ust
  if (b > suA && a < suB) {
    const xa = Math.max(a, suA), xb = Math.min(b, suB);
    g.fillStyle = DN12.golRenk.ust; g.fillRect(xa, 672, xb - xa, alt - 672);
    if (O.yakinSu) g.drawImage(O.yakinSu, 0, 0, 1, 128, xa, 672, xb - xa, 30);
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let x = Math.floor(xa / 53) * 53; x < xb; x += 53) {
      const h = dn12Hash(x * 0.23), yy = 676 + h * 22, o = Math.sin(t * 0.9 + x * 0.04) * 6;
      g.globalAlpha = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.4 + h * 7)); g.fillRect(x + o, yy, 16 + h * 20, 1.4);
    }
    g.globalAlpha = 1;
  }
  // çim (çalı sırasının altı) — su bölgesi hariç
  g.fillStyle = '#82b24e';
  if (a < suA) g.fillRect(a, 698, Math.min(b, suA) - a, alt - 698);
  if (b > suB) g.fillRect(Math.max(a, suB), 698, b - Math.max(a, suB), alt - 698);
  // büyük ağaçlar (çalıların arkasında)
  for (const A of DN12_YAKIN_AGAC) {
    const sp = O['agac_' + A.tur]; if (!sp) continue;
    const [w, h] = DN12_AGAC_OLCU[A.tur], ww = w * A.s, hh = h * A.s;
    if (A.L + ww / 2 < a || A.L - ww / 2 > b) continue;
    if (A.ayna) { g.save(); g.translate(A.L, 0); g.scale(-1, 1); g.drawImage(sp, -ww / 2, 694 - hh, ww, hh); g.restore(); }
    else g.drawImage(sp, A.L - ww / 2, 694 - hh, ww, hh);
  }
  // çalı sırası parçaları (suyun olduğu yerde kesilir, kıyıda yuvarlak uç); tepede yok: büyük gölet görünsün
  const cw = DN12_CALI_W, ch = DN12_CALI_Y1 - DN12_CALI_Y0, R = DN12_R, tepeL = 1030 * T * f;
  for (let i = Math.floor(a / cw); i * cw < Math.min(b, tepeL); i++) {
    const sp = O['cali' + Math.floor(dn12Hash(i * 1.37 + 5) * 3)]; if (!sp) continue;
    let x0 = i * cw, x1 = x0 + cw;
    // su aralığını çıkar
    if (x1 > suA && x0 < suB) {
      if (x0 < suA) dn12CaliParca(sp, x0, suA, i * cw);
      if (x1 > suB) dn12CaliParca(sp, suB, Math.min(x1, tepeL), i * cw);
      continue;
    }
    if (x1 > tepeL) { dn12CaliParca(sp, x0, tepeL, i * cw); continue; }
    g.drawImage(sp, x0, DN12_CALI_Y0, cw + 0.6 / S, ch);
  }
  // kıyı uçları: suyun iki yanında birer çalı kümesi (düz kesik görünmesin)
  for (const x of [suA, suB, tepeL]) if (x > a - 80 && x < b + 80) {
    const sp = O.agac_yuvarlak; if (sp) g.drawImage(sp, x - 60, 694 - 95, 120, 110);
  }
  void R;
}
function dn12CaliParca(sp, x0, x1, ofs) {
  const R = DN12_R, sx = (x0 - ofs) * R, sw = (x1 - x0) * R;
  if (sw <= 0) return;
  g.drawImage(sp, sx, 0, sw, sp.height, x0, DN12_CALI_Y0, x1 - x0, DN12_CALI_Y1 - DN12_CALI_Y0);
}

// ── 2) DÜNYA: zemin ve orta plan ONPLAN'ın (zemin12.js) ──
function dn12World(tm) {
  if (!dn12Hazir()) return;
  if (typeof zn12World === 'function') {
    try { zn12World(tm); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('zn12World', e); dn12YedekZemin(); }
  } else dn12YedekZemin();
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
// zemin12.js yoksa / hata verirse: düz çim + açık taş yol (oyun yine yürünür ve güzel görünür)
function dn12YedekZemin() {
  g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
  const x0 = cam.x - 40, w = VW + 80, y = DN12_UFUK;
  g.fillStyle = '#86b450'; g.fillRect(x0, y, w, 400);
  g.fillStyle = '#e8d9bd'; g.fillRect(x0, 716, w, 26);
  g.fillStyle = '#f6ead2'; g.fillRect(x0, 716, w, 4);
  g.fillStyle = '#c9b796'; g.fillRect(x0, 740, w, 3);
}

// ── 3) Zerreler: güneş ışığında uçuşan polen / ışık tozu (z<.75 karakterlerin arkası, z≥.75 önü) ──
const DN12_ZERRE = [];
for (let i = 0; i < 36; i++) DN12_ZERRE.push({ x: dn12Hash(i * 7.3) * 2000, y: dn12Hash(i * 11.9) * 700, z: i % 4 === 0 ? 0.9 + dn12Hash(i) * 0.3 : 0.3 + dn12Hash(i * 2) * 0.4, p: dn12Hash(i * 13.1) * 6.28, r: 1.2 + dn12Hash(i * 5.3) * 1.8 });
function dn12Motes(tm, z0, z1) {
  if (!dn12Hazir()) return;
  const sp = DN12.onb.zerre; if (!sp) return;
  const t = Number.isFinite(tm) ? tm : 0, w = W / S, h = H / S, u = DN12.gun;
  const altin = 0.55 + 0.6 * dn12Yumusak(0.6, 1, u);   // altın saatte daha çok ve daha parlak
  g.setTransform(S, 0, 0, S, 0, 0);
  for (const p of DN12_ZERRE) {
    if (p.z < z0 || p.z >= z1) continue;
    const x = ((p.x - DN12.cx * p.z + Math.sin(t * 0.4 + p.p) * 30) % (w + 100) + (w + 100)) % (w + 100) - 50;
    const y = ((p.y + Math.sin(t * 0.3 + p.p * 2) * 24 - t * 4) % (h + 60) + (h + 60)) % (h + 60) - 30;
    const a = (0.25 + 0.2 * Math.sin(t * 1.3 + p.p)) * altin;
    if (a <= 0.02) continue;
    const r = p.r * (p.z > 0.75 ? 2.6 : 1.8) * 2;
    g.globalAlpha = Math.min(1, a); g.drawImage(sp, x - r, y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1; g.setTransform(1, 0, 0, 1, 0, 0);
}

// ── 4) Kiraz yaprakları: lojman sabahı ve FASS çimenliğinde seyrek, rüzgârda süzülür (karakterlerin önünde, küçük) ──
const DN12_YAPRAK = [];
for (let i = 0; i < 16; i++) DN12_YAPRAK.push({ x: dn12Hash(i * 3.9) * 1600, y: dn12Hash(i * 8.3) * 700, p: dn12Hash(i * 2.7) * 6.28, v: 18 + dn12Hash(i * 5.1) * 16, r: 2.6 + dn12Hash(i * 7.9) * 1.8 });
function dn12Petals(tm) {
  if (!dn12Hazir()) return;
  const col = DN12.cx / T;
  const yog = Math.max(dn12Yumusak(0, 8, col) * (1 - dn12Yumusak(60, 75, col)) * 0.6, dn12Yumusak(300, 320, col) * (1 - dn12Yumusak(440, 460, col)));
  if (yog <= 0.01) return;
  const t = Number.isFinite(tm) ? tm : 0, w = W / S, h = H / S;
  g.setTransform(S, 0, 0, S, 0, 0);
  for (let i = 0; i < DN12_YAPRAK.length; i++) {
    const p = DN12_YAPRAK[i];
    if (i / DN12_YAPRAK.length > yog) break;
    const x = ((p.x - DN12.cx * 1.1 - t * p.v + Math.sin(t * 0.8 + p.p) * 26) % (w + 80) + (w + 80)) % (w + 80) - 40;
    const y = ((p.y + t * p.v * 0.7) % (h + 40) + (h + 40)) % (h + 40) - 20;
    const don = Math.sin(t * 2.2 + p.p);
    g.globalAlpha = 0.85;
    g.fillStyle = i % 3 ? '#f6c3cf' : '#fbe3e6';
    g.beginPath(); g.ellipse(x, y, p.r, p.r * (0.35 + 0.35 * Math.abs(don)), t * 0.9 + p.p, 0, Math.PI * 2); g.fill();
  }
  g.globalAlpha = 1; g.setTransform(1, 0, 0, 1, 0, 0);
}

// ── 5) Ön plan: ONPLAN'ın en ön çimenleri ──
function dn12Foreground(tm) {
  if (!dn12Hazir()) return;
  if (typeof zn12On === 'function') { try { zn12On(tm); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('zn12On', e); } }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}

// ── 6) Gün tonu + gün batımı ışıltısı + hafif vinyet (bütün sahneye) ──
function dn12Vignette() {
  if (!dn12Hazir()) return;
  const O = DN12.onb, u = DN12.gun;
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  // sıcak çarpma tonu (gündüz beyaza yakın: neredeyse etkisiz)
  const ton = DN12_TON_CARP[Math.round(u * 100)];
  if (ton !== '#ffffff') { g.globalCompositeOperation = 'multiply'; g.fillStyle = ton; g.fillRect(0, 0, W, H); }
  // akşam (FINAL): mor-lacivert kararma
  if (DN12.aksam > 0.003) { g.globalCompositeOperation = 'multiply'; g.globalAlpha = DN12.aksam * 0.55; g.fillStyle = '#5d5a9a'; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  g.globalCompositeOperation = 'source-over';
  // altın saat: güneş tarafından sahneye yayılan sıcak ışık
  const ak = dn12Yumusak(0.55, 1, u) * (1 - DN12.aksam * 0.7);
  if (ak > 0.01 && O.isiltiAk) {
    const r = Math.max(W, H) * 0.9;
    g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.16 * ak;
    g.drawImage(O.isiltiAk, DN12.gunesXY.x - r, DN12.gunesXY.y - r, r * 2, r * 2);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  if (O.vinyet) { g.globalAlpha = 0.16 + 0.1 * u; g.drawImage(O.vinyet, -W * 0.25, -H * 0.3, W * 1.5, H * 1.6); g.globalAlpha = 1; }
}
