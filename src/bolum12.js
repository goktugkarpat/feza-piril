/* bolum12.js — Annemle Sabancı'da Bir Gün (on ikinci rüya). Feza, annesi ve Pırıl kampüste sabahtan gün batımına bir gün geçirir:
   lojmanların önündeki çiçek tarhı, scooter + annenin bisikletiyle kampüs yolu, FASS çimenliğinde uçurtma, Bilgi Merkezi'nin havuzu,
   botanik bahçesi ve kaplumbağa göleti, küçük bisikletle göletin yokuşu, büyük gölette anneyle kayık, gün batımı tepesinde piknik ve sarılma.
   2. tur (BOLUM12.md 'Tur 2'): botanik 560–700 eklendi; eski 560–804 → +140, eski 805+ → +200 (gölet suyu 830–1005).
   AKIŞ: ışık perdesi (miniKapi) YOK, hiçbir etkinlik yolu kapatmaz; yalnız binişlerde kontrol araca geçer (Feza yine kumanda eder).
   Sözleşme: src/BOLUM12.md. Zemin düz (satır 18): kampüs resimleriyle ufuk çizgisi hizalı kalsın. */
'use strict';
const ROWS = 30, COLS = 1100;
const grid = Array.from({length: ROWS}, () => new Uint8Array(COLS));
for (let c = 0; c < COLS; c++) for (let r = 18; r < ROWS; r++) grid[r][c] = 1;
const topOf = c => { c = Math.floor(c); if (c < 0 || c >= COLS) return ROWS; for (let r = 0; r < ROWS; r++) if (grid[r][c] === 1) return r; return ROWS; };
const cell = (c, r) => c < 0 || c >= COLS ? 1 : r < 0 || r >= ROWS ? 0 : grid[r][c];
const yuzey = c => topOf(c) * T;
const nx = c => c * T + T / 2;
function nesne(tip, c, y, o = {}) { const n = Object.assign({tip, x: nx(c), y, id: tip + NESNELER.length}, o); NESNELER.push(n); return n; }

const BOLUM = {
  ad: 'Annemle Sabancı’da Bir Gün', baslangic: {x: nx(8), y: yuzey(8)}, gol: null, gollar: [],
  bolgeler: [
    {ad: 'lojman', x0: 0, x1: 70 * T}, {ad: 'yol1', x0: 70 * T, x1: 300 * T}, {ad: 'fass', x0: 300 * T, x1: 450 * T},
    {ad: 'bilgi', x0: 450 * T, x1: 560 * T}, {ad: 'botanik', x0: 560 * T, x1: 700 * T}, {ad: 'yol2', x0: 700 * T, x1: 805 * T},
    {ad: 'golet', x0: 805 * T, x1: 1030 * T}, {ad: 'tepe', x0: 1030 * T, x1: COLS * T}],
  // Karakterler ilk sürümden büyük: yürürken ~0.98, binişlerde biraz geniş açı (yol görünsün)
  kamera: [
    {x0: 0, x1: 66 * T, zoom: .98, yOfs: -70}, {x0: 66 * T, x1: 298 * T, zoom: .9, yOfs: -80}, {x0: 298 * T, x1: 560 * T, zoom: .96, yOfs: -80},
    {x0: 560 * T, x1: 700 * T, zoom: .96, yOfs: -80}, {x0: 700 * T, x1: 805 * T, zoom: .9, yOfs: -80}, {x0: 805 * T, x1: 1030 * T, zoom: .92, yOfs: -60},
    {x0: 1030 * T, x1: COLS * T, zoom: .96, yOfs: -80}],
  final: {x: nx(1070), y: yuzey(1070)}
};
light = lightTarget = 1;   // kampüs rüyası gündüz: dünya baştan aydınlık (gün ilerleyişi dunya12.js'in dn12Gun/dn12Isik tonunda)
P.x = P.safeX = BOLUM.baslangic.x; P.y = P.safeY = BOLUM.baslangic.y; D.x = P.x - 60; D.y = P.y - 85;

// ── Etkinlikler (hiçbiri yolu kapatmaz) ──
nesne('k12Bahce', 36, yuzey(36), {x0: nx(12), x1: nx(60)});                                     // ETKINLIK: çiçek tarhı
nesne('k12Binis', 66, yuzey(66), {ad: 'yol1', arac: 'scooter', x0: nx(66), x1: nx(296)});      // YOLCULUK: scooter + annenin bisikleti
nesne('k12Ucurtma', 378, yuzey(378), {x0: nx(315), x1: nx(440)});                              // ETKINLIK: FASS çimenliğinde uçurtma
nesne('k12Bilgi', 508, yuzey(508), {x0: nx(460), x1: nx(555)});                                // ETKINLIK: Bilgi Merkezi havuzu
nesne('k12Botanik', 630, yuzey(630), {x0: nx(560), x1: nx(700)});                              // BOTANIK: botanik bahçesi, sera, kaplumbağa göleti
nesne('k12Binis', 702, yuzey(702), {ad: 'yol2', arac: 'bisiklet', x0: nx(702), x1: nx(800)});  // YOLCULUK: Feza'nın küçük bisikleti + anne
nesne('k12Golet', 918, yuzey(918), {x0: nx(805), x1: nx(1030)});                                // GOLET: ördekler, nilüfer, balık, su
nesne('k12Kayik', 830, yuzey(830), {x0: nx(830), x1: nx(1005)});                                // GOLET: anneyle kayık
nesne('k12Final', 1070, yuzey(1070), {});                                                         // FINAL: piknik + gün batımı + sarılma

const FLOWERS = [];
const TREE = null;
