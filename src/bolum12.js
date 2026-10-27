/* bolum12.js — Annemle Sabancı'da Bir Gün (on ikinci rüya). Feza, annesi ve Pırıl kampüste sabahtan gün batımına bir gün geçirir:
   lojmanların önündeki çiçek tarhı, scooter + annenin bisikletiyle kampüs yolu, FASS çimenliğinde uçurtma, Bilgi Merkezi'nin havuzu,
   küçük bisikletle göletin yokuşu, anneyle kayık, gün batımı tepesinde piknik ve sarılma.
   AKIŞ: ışık perdesi (miniKapi) YOK, hiçbir etkinlik yolu kapatmaz; yalnız binişlerde kontrol araca geçer (Feza yine kumanda eder).
   Sözleşme: src/BOLUM12.md. Zemin düz (satır 18): kampüs resimleriyle ufuk çizgisi hizalı kalsın. */
'use strict';
const ROWS = 30, COLS = 900;
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
    {ad: 'bilgi', x0: 450 * T, x1: 560 * T}, {ad: 'yol2', x0: 560 * T, x1: 665 * T}, {ad: 'golet', x0: 665 * T, x1: 830 * T},
    {ad: 'tepe', x0: 830 * T, x1: COLS * T}],
  // Karakterler ilk sürümden büyük: yürürken ~0.98, binişlerde biraz geniş açı (yol görünsün)
  kamera: [
    {x0: 0, x1: 66 * T, zoom: .98, yOfs: -70}, {x0: 66 * T, x1: 298 * T, zoom: .9, yOfs: -80}, {x0: 298 * T, x1: 562 * T, zoom: .96, yOfs: -80},
    {x0: 562 * T, x1: 665 * T, zoom: .9, yOfs: -80}, {x0: 665 * T, x1: 830 * T, zoom: .92, yOfs: -60}, {x0: 830 * T, x1: COLS * T, zoom: .96, yOfs: -80}],
  final: {x: nx(870), y: yuzey(870)}
};
light = lightTarget = 1;   // kampüs rüyası gündüz: dünya baştan aydınlık (gün ilerleyişi dunya12.js'in dn12Gun/dn12Isik tonunda)
P.x = P.safeX = BOLUM.baslangic.x; P.y = P.safeY = BOLUM.baslangic.y; D.x = P.x - 60; D.y = P.y - 85;

// ── Etkinlikler (hiçbiri yolu kapatmaz) ──
nesne('k12Bahce', 36, yuzey(36), {x0: nx(12), x1: nx(60)});                                     // ETKINLIK: çiçek tarhı
nesne('k12Binis', 66, yuzey(66), {ad: 'yol1', arac: 'scooter', x0: nx(66), x1: nx(296)});      // YOLCULUK: scooter + annenin bisikleti
nesne('k12Ucurtma', 378, yuzey(378), {x0: nx(315), x1: nx(440)});                              // ETKINLIK: FASS çimenliğinde uçurtma
nesne('k12Bilgi', 508, yuzey(508), {x0: nx(460), x1: nx(555)});                                // ETKINLIK: Bilgi Merkezi havuzu
nesne('k12Binis', 562, yuzey(562), {ad: 'yol2', arac: 'bisiklet', x0: nx(562), x1: nx(660)});  // YOLCULUK: Feza'nın küçük bisikleti + anne
nesne('k12Golet', 748, yuzey(748), {x0: nx(665), x1: nx(830)});                                // GOLET: ördekler, nilüfer, balık, su
nesne('k12Kayik', 690, yuzey(690), {x0: nx(690), x1: nx(805)});                                // GOLET: anneyle kayık
nesne('k12Final', 870, yuzey(870), {});                                                         // FINAL: piknik + gün batımı + sarılma

const FLOWERS = [];
const TREE = null;
