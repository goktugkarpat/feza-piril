/* ayna11.js — Ay Işığı Şatosu'nun ana mekaniği: ay ışığı aynaları ve canlanan şato parçaları (AYNA). Korkutucu hiçbir şey yok.
   Bulut aralığından (BOLUM.ayKaynak) tek bir gümüş-mavi huzme iner. Yol boyunca on iki büyük, süslü ayna var (altın çerçeve, iki yanda
   lila yarasa kanatları, tepede uykucu ay yüzlü madalyon, yıldız işlemeli boncuklar, altta çilek kalp taş; camında yumuşak ay yansıması).
   ayAyna     : huzme aynaya ulaşmadıysa ayna sönük, yan dönük, ay yüzü uyur. Huzme ulaşınca ayna "bekler": camında ışık lekesi nefes alır,
                kanatlarını çırpar, iki yana sallanıp "beni çevir" der (çevresinden yumuşak ışık halkası yayılır). Feza dokununca ya da
                yanından geçince TEK seferde doğru açıya döner (bir buçuk tur, arkası mor kadife; yanlış yok) → tatlı çan + pırıltı.
                Huzme aynadan seker, önce o aynanın satoParca'sına akar (parça aydınlanır, CANLANIR), oradan sıradaki aynaya akar.
                Atlanan aynalar: ileri bir aynaya dokunulursa öndekilerin hepsi istek alır; huzme zincir boyunca hızlanarak akar ve her
                aynaya varınca o ayna kendiliğinden döner (ışık zinciri şelalesi). Asla takılmaz.
                o.donmus, V11.ayna++, OLAY 'aynaDondu' {o, n, x, y}, AU.sfx('aynaDon', sıra), 'huzmeVar' (huzme yeni aynaya varınca).
   satoParca  : on iki canlanma (o.tur): kapi (kemerdeki ay taşları + iki sihirli fener), cesme (ay ışığı fıskiyesi), cali (yarasa/kalp/ay
                çalıları ışıl ışıl), pencere (şato kanadının beş yuvarlak penceresi sıra sıra yanar, içlerinde el sallayan dostlar), bayrak
                (kule flaması açılır, süs ipleri dalgalanır), kule (kule pencereleri + parlayan yıldız), fener (köprü fenerleri dalga dalga
                yanar), kristal (kristal kümeleri renk renk), avize (kristal avize döner, gökkuşağı benekleri saçar), hayalet (uyuyan
                hayalet dostlar uyanıp kıkırdar, halka olup döner), portre (aile portreleri uyanır, gülümser, göz kırpar), perde (kadife
                perdeler açılır, ay ışığı dolar, duvar şamdanlarında sihirli ay ışığı topları — alev yok).
                o.canli, OLAY 'satoCanlan' {o, n, tur, x, y}, AU.sfx('satoCanlan', sıra). Canlı parçaya dokununca kendine özgü tepki
                (AU.sfx('satoDokun', sıra)); dönmüş aynaya dokununca ayna sevinir (AU.sfx('aynaSevin')).
   Huzme, parçalar ve ön ışıltılar tek bir yardımcı nesneden (tip 'ay11Sahne', NESNELER'de son aynanın hemen ardına eklenir; ekran dışı
   kırpması yok) çizilir: uzun huzmeler uç noktaları ekran dışındayken de görünür.
   Ortak: aynaHuzmeCiz(c, x0, y0, x1, y1, t, a[, o {w}]), aynaCerceveCiz(c, x, y, s, t, o {don 0..1, parla, isik 0..1, kanat}),
   AYNA11 { liste, sira, huzme [{x0,y0,x1,y1}], hedef(), hepsi() (test: anında hepsi; B11T.bitir('aynalarHizli')), isik(x, y) 0..1 }.
   Çizimler önbellek tuvallerinden (ay11Tuval; çözünürlük bağlamın ölçeğine göre kovalanır); karede gradyan/filtre/shadowBlur yok,
   parçacıklar sabit sayılı ve analitik, ekran dışı çizilmez. Sözleşme: src/BOLUM11.md. Önek: ay11. */
'use strict';
const AYNA11 = {
  liste: null, sira: 0, huzme: [],
  hedef() { const L = ay11Liste(); for (const o of L) if (!o.donmus) return o; return null; },
  hepsi() { ay11Hepsi(); },
  isik(x, y) { return ay11IsikNokta(x, y); }
};
const AY11_YUK = 150;            // aynanın cam merkezinin zeminden yüksekliği
const AY11_OL = 1.15;            // aynanın çizim ölçeği (cam 39 × 57 birim; Feza 60)
const AY11_DON = .85, AY11_CIK = .5;   // dönüş süresi; huzmenin aynadan çıktığı an
const AY11_PI2 = Math.PI * 2;
const AY11_FLAS = Array.from({ length: 6 }, () => ({ x: 0, y: 0, t: -99, r: 1, col: '#eaf4ff' })); let ay11FlasI = 0;
function ay11Flas(x, y, r, col) { if (AY11.hizli && now - AY11.sonDon < .15) r *= .6; const F = AY11_FLAS[ay11FlasI]; ay11FlasI = (ay11FlasI + 1) % AY11_FLAS.length; F.x = x; F.y = y; F.t = now; F.r = r; F.col = col; }
const AY11 = { spr: new Map(), adimT: -1, sahne: null, kurulu: false, parcalar: null, havuz: [], segN: 0, hizli: false, sonDon: -9 };
function ay11Liste() {
  if (AYNA11.liste && AYNA11.liste.length) return AYNA11.liste;
  const L = NESNELER.filter(o => o.tip === 'ayAyna').sort((a, b) => a.sira - b.sira); if (L.length) AYNA11.liste = L;
  return L;
}
function ay11Parcalar() {
  if (AY11.parcalar && AY11.parcalar.length) return AY11.parcalar;
  const L = NESNELER.filter(o => o.tip === 'satoParca').sort((a, b) => (a.sira || 0) - (b.sira || 0)); if (L.length) AY11.parcalar = L;
  return L;
}
function ay11Parca(o) { if (o.parca === undefined) o.parca = NESNELER.find(n => n.id === o.hedefId) || null; return o.parca; }
function ay11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function ay11Gor(x0, y0, x1, y1) {   // dünya kutusu ekranda mı
  if (typeof cam === 'undefined') return true;
  const vh = VH / (cam.zoom || 1);
  return x1 > cam.x - 40 && x0 < cam.x + VW + 40 && y1 > cam.y - 40 && y0 < cam.y + vh + 40;
}
function ay11Isik(c, col, x, y, r, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ga; }
function ay11IsikE(c, col, x, y, rx, ry, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ga; }
function ay11GeriEase(u) { const d = u - 1; return 1 + 2.2 * d * d * d + 1.2 * d * d; }   // hafif taşan yumuşak varış

// ═══════════════════════════════ önbellek tuvalleri ═══════════════════════════════
// K = dünya birimi başına piksel; bağlamın o anki ölçeği × s'ye göre kovadan seçilir (iPad 2048×1536'da ≈ 2–3).
const AY11_KOVA = [1, 1.5, 2, 3, 4];
let ay11MatYok = false;
function ay11K(c, s, kmax) {
  let m = typeof S !== 'undefined' && S > 0 ? S : 2;
  if (!ay11MatYok && c && c.getTransform) { try { const t = c.getTransform(); m = Math.sqrt(t.a * t.a + t.b * t.b); } catch (e) { ay11MatYok = true; } }
  const n = m * Math.abs(s || 1) * .9, km = kmax || 4;
  for (let i = 0; i < AY11_KOVA.length; i++) if (AY11_KOVA[i] >= n) return Math.min(AY11_KOVA[i], km);
  return km;
}
function ay11Tuval(ad, K, x0, y0, w, h, fn) {
  const key = ad + '@' + K; let c = AY11.spr.get(key); if (c) return c;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; AY11.spr.set(key, c); return c;
}
// aydınlık + sönük çift: sönük = aynı çizim, üstüne gri-mor gece örtüsü (yalnız boyalı piksellere)
function ay11Cift(ad, K, x0, y0, w, h, fn, ortu, oa) {
  const a = ay11Tuval(ad, K, x0, y0, w, h, fn);
  const s = ay11Tuval(ad + '~', K, x0, y0, w, h, q => {
    q.drawImage(a, x0, y0, w, h); q.globalCompositeOperation = 'source-atop';
    q.globalAlpha = oa == null ? .58 : oa; q.fillStyle = ortu || '#2c2658'; q.fillRect(x0, y0, w, h);
    q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  });
  return { a, s };
}
function ay11Koy(c, spr, x, y) { c.drawImage(spr, x + spr.x0, y + spr.y0, spr.w, spr.h); }
function ay11KoyL(c, cift, x, y, L) {   // sönükten aydınlığa geçiş (L 0..1)
  if (L < .995) ay11Koy(c, cift.s, x, y);
  if (L > .005) { const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, L); ay11Koy(c, cift.a, x, y); c.globalAlpha = ga; }
}
// yol yardımcıları (yalnız önbellek çiziminde ve küçük canlı şekillerde)
function ay11YildizYol(q, x, y, r, ic, n, a0) {
  n = n || 5; q.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = (a0 || 0) - Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * (ic || .45) : r; i ? q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : q.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  q.closePath();
}
function ay11KalpYol(q, x, y, r) {   // (x, y) merkez, r yarı genişlik
  q.beginPath(); q.moveTo(x, y + r * .95);
  q.bezierCurveTo(x - r * 1.25, y + r * .1, x - r * .9, y - r * 1.05, x, y - r * .45);
  q.bezierCurveTo(x + r * .9, y - r * 1.05, x + r * 1.25, y + r * .1, x, y + r * .95); q.closePath();
}
function ay11Yuv(q, x, y, w, h, r) { q.beginPath(); q.moveTo(x + r, y); q.arcTo(x + w, y, x + w, y + h, r); q.arcTo(x + w, y + h, x, y + h, r); q.arcTo(x, y + h, x, y, r); q.arcTo(x, y, x + w, y, r); q.closePath(); }
function ay11Lin(q, x0, y0, x1, y1, d) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < d.length; i += 2) gr.addColorStop(d[i], d[i + 1]); return gr; }
function ay11Rad(q, x, y, r0, r1, d) { const gr = q.createRadialGradient(x, y, r0, x, y, r1); for (let i = 0; i < d.length; i += 2) gr.addColorStop(d[i], d[i + 1]); return gr; }
const AY11_ALTIN = [0, '#fff3c4', .35, '#f2c968', .7, '#d39a3e', 1, '#a8702a'];
function ay11Altin(q, x0, y0, x1, y1) { return ay11Lin(q, x0, y0, x1, y1, AY11_ALTIN); }
// dört uçlu pırıltı (hale ile) ve yumuşak nokta
function ay11Isilti() {
  return ay11Tuval('isilti', 4, -12, -12, 24, 24, q => {
    q.fillStyle = ay11Rad(q, 0, 0, 0, 12, [0, 'rgba(255,255,255,.95)', .3, 'rgba(225,238,255,.42)', 1, 'rgba(210,230,255,0)']); q.fillRect(-12, -12, 24, 24);
    q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(0, -10.5); q.quadraticCurveTo(1, -1, 10.5, 0); q.quadraticCurveTo(1, 1, 0, 10.5); q.quadraticCurveTo(-1, 1, -10.5, 0); q.quadraticCurveTo(-1, -1, 0, -10.5); q.fill();
  });
}
// ImageData ile profil tuvali (huzme, ışık konisi): fn(u, v) → [r, g, b, a 0..1]
function ay11Profil(ad, w, h, fn) {
  let c = AY11.spr.get(ad); if (c) return c;
  c = document.createElement('canvas'); c.width = w; c.height = h;
  const q = c.getContext('2d'), im = q.createImageData(w, h), d = im.data;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const r = fn((x + .5) / w, (y + .5) / h * 2 - 1), i = (y * w + x) * 4;
    d[i] = r[0]; d[i + 1] = r[1]; d[i + 2] = r[2]; d[i + 3] = Math.round(clamp(r[3], 0, 1) * 255);
  }
  q.putImageData(im, 0, 0); AY11.spr.set(ad, c); return c;
}
const AY11_RGB = [0, 0, 0, 0];
function ay11HuzmeSpr() {   // enine kesit: geniş mavi hale + gümüş orta + beyaz çekirdek (boyuna tekdüze; uzatılarak çizilir)
  // uçlarda (ayna / parça) boyuna yumuşak sönüş: huzme vurduğu çalı, kristal, pencereyi boğmaz; orada ay11Bas parıltısı kalır
  return ay11Profil('huzme', 40, 128, (u, v) => {
    const hal = Math.exp(-v * v * 3.6) * .15, mid = Math.exp(-v * v * 14) * .24, cor = Math.exp(-v * v * 140) * .5;
    const w = Math.min(1, cor * 1.3 + mid * .4), uc = smooth(Math.min(1, u / .07)) * (.35 + .65 * smooth(Math.min(1, (1 - u) / .1)));
    AY11_RGB[0] = lerp(146, 236, w); AY11_RGB[1] = lerp(182, 246, w); AY11_RGB[2] = 255; AY11_RGB[3] = (hal + mid + cor) * uc; return AY11_RGB;
  });
}
function ay11KoniSpr() {   // gökten inen ay ışığı konisi: u = 0 bulut aralığı (geniş, yumuşak) → u = 1 ayna (dar)
  return ay11Profil('koni', 48, 96, (u, v) => {
    const yar = lerp(1, .16, Math.pow(u, .8)), vv = v / yar, uc = smooth(Math.min(1, u * 3.5 + .1)) * (1 - smooth(clamp((u - .9) / .1, 0, 1)) * .6);
    const a = (Math.exp(-vv * vv * 2.4) * .2 + Math.exp(-vv * vv * 10) * .2) * uc;
    AY11_RGB[0] = 190; AY11_RGB[1] = 214; AY11_RGB[2] = 255; AY11_RGB[3] = a; return AY11_RGB;
  });
}

// ═══════════════════════════════ HUZME ═══════════════════════════════
// aynaHuzmeCiz(c, x0, y0, x1, y1, t, a, o) — (x0,y0)'dan (x1,y1)'e ay ışığı huzmesi; o.w genişlik çarpanı (varsayılan 1 ≈ 64 birimlik hale).
// Katmanlar: kesit sprite'ı (titreşimli), içinde akan üç ışık dalgası, akan ışık tozu (pırıltılar). Hepsi 'lighter'.
function aynaHuzmeCiz(c, x0, y0, x1, y1, t, a, o) {
  if (!(a > .01)) return;
  const dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy); if (!(L > 1)) return;
  const w = o && o.w > 0 ? o.w : 1, ga = c.globalAlpha;
  c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x0, y0); c.rotate(Math.atan2(dy, dx));
  const fl = .9 + .1 * Math.sin(t * 5.3 + x0 * .013) * Math.sin(t * 3.1 + y0 * .01);
  c.globalAlpha = ga * a * fl; c.drawImage(ay11HuzmeSpr(), 0, -32 * w, L, 64 * w);
  // akan ışık dalgaları (huzme boyunca kayan uzun yumuşak parıltılar)
  const gl = glow('#eaf4ff'), pl = 130;
  for (let k = 0; k < 3; k++) {
    const u = (t * 230 / L + k / 3) % 1, e = Math.sin(u * Math.PI);
    c.globalAlpha = ga * a * .24 * e; c.drawImage(gl, u * L - pl / 2, -8 * w, pl, 16 * w);
  }
  // ışık tozu: farklı hızlarda akan, hafif yalpalayan pırıltılar
  const n = Math.min(18, 3 + (L / 55 | 0)), isl = ay11Isilti();
  for (let k = 0; k < n; k++) {
    const u = (t * (60 + (k % 4) * 26) / L + k * .618034) % 1, px = u * L, py = Math.sin(t * 1.9 + k * 2.3) * w * (4 + (k % 3) * 4);
    const tw = .55 + .45 * Math.sin(t * 6.3 + k * 1.7), r = (k % 3 === 0 ? 4.6 : 2.7) * tw * Math.min(1.4, w);
    c.globalAlpha = ga * a * Math.min(1, Math.sin(u * Math.PI) * 3) * tw * .9;
    c.drawImage(isl, px - r, py - r, r * 2, r * 2);
  }
  c.restore(); c.globalAlpha = ga;
}
// gökten inen koni (yalnız ilk huzme)
function ay11KoniCiz(c, x0, y0, x1, y1, t, a) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.sqrt(dx * dx + dy * dy); if (!(L > 1) || !(a > .01)) return;
  c.save(); c.globalCompositeOperation = 'lighter'; c.translate(x0, y0); c.rotate(Math.atan2(dy, dx));
  c.globalAlpha = a * (.85 + .15 * Math.sin(t * .9)); c.drawImage(ay11KoniSpr(), 0, -150, L, 300);
  c.restore();
}
// huzmenin büyüyen ucu (kuyruklu yıldız başı) ve sekme parıltısı
function ay11Bas(c, x, y, t, a, r) {
  r = r || 1; ay11Isik(c, '#cfe6ff', x, y, 46 * r, .55 * a); ay11Isik(c, '#ffffff', x, y, 16 * r, .9 * a);
  const isl = ay11Isilti(), s = (13 + 3 * Math.sin(t * 9)) * r;
  c.save(); c.translate(x, y); c.rotate(t * 2.2); c.globalAlpha *= Math.min(1, a); c.drawImage(isl, -s, -s, s * 2, s * 2); c.rotate(.78); c.drawImage(isl, -s * .6, -s * .6, s * 1.2, s * 1.2); c.restore();
}

// ═══════════════════════════════ ZİNCİR MANTIĞI ═══════════════════════════════
// Ayna durumu o.a11: durum 0 sönük (huzme gelmedi) · 1 bekler · 2 döndü. istek: dokunuldu/sıraya alındı (huzme gelince hemen döner).
// pA: ayna → parça ilerlemesi, pB: parça → sonraki ayna (sonuncuda göğe) ilerlemesi; pT: parçaya varıştan beri geçen süre.
function ay11Kur() {
  if (AY11.kurulu) return; const L = ay11Liste(); if (!L.length) return;
  AY11.kurulu = true;
  const B = typeof BOLUM !== 'undefined' && BOLUM.ayKaynak ? BOLUM.ayKaynak : { x: L[0].x - 500, y: L[0].y - 900 };
  for (let i = 0; i < L.length; i++) {
    const m = L[i], A = m.a11, p = ay11Parca(m), H = p && AY11_P[p.tur];
    A.ax = m.x; A.ay = m.y - AY11_YUK;
    if (p) { A.px = p.x + (H ? H.hit[0] : 0); A.py = p.y + (H ? H.hit[1] : -40); } else { A.px = A.ax + 300; A.py = A.ay - 200; }
    const prv = i ? L[i - 1].a11 : null; A.gx = prv ? prv.px : B.x; A.gy = prv ? prv.py : B.y;   // huzmenin geldiği nokta
    A.lenA = Math.max(1, Math.hypot(A.px - A.ax, A.py - A.ay));
  }
  for (let i = 0; i < L.length; i++) {
    const A = L[i].a11, nx = i + 1 < L.length ? L[i + 1].a11 : null;
    A.nx = nx ? nx.ax : A.px + 380; A.ny = nx ? nx.ay : A.py - 900; A.son = !nx;
    A.lenB = Math.max(1, Math.hypot(A.nx - A.px, A.ny - A.py));
    // dönüşün son eğimi: gelen ve giden huzmenin açıortayına doğru hafif yatış
    const ix = A.gx - A.ax, iy = A.gy - A.ay, il = Math.hypot(ix, iy) || 1, ox = A.px - A.ax, oy = A.py - A.ay, ol = Math.hypot(ox, oy) || 1;
    const bx = ix / il + ox / ol, by = iy / il + oy / ol;
    A.egim = clamp(Math.atan2(bx, -by) * .3, -.24, .24);
    A.yan = ox >= 0 ? 1 : -1;
  }
}
function ay11Vardi(m) {   // huzme aynaya ulaştı: bekleme parıltısı
  const A = m.a11; A.varFx = 0;
  burst(A.ax, A.ay, 12, ['#eaf4ff', '#cfe6ff', '#a9c8ff'], 120, .9, 6);
  if (!AY11.hizli) ay11Sfx('huzmeVar', m.sira);
}
function ay11Don(o) {
  const A = o.a11; if (!A || A.durum === 2) return;
  A.durum = 2; A.donT = 0; A.istek = false; A.th0 = A.th; o.donmus = true; o.done = true;
  if (typeof V11 !== 'undefined') V11.ayna = Math.min((V11.ayna || 0) + 1, V11.aynaTop || 12);
  const n = typeof V11 !== 'undefined' ? V11.ayna : o.sira + 1;
  burst(A.ax, A.ay, 22, ['#eaf4ff', '#cfe6ff', '#ffe7a8', '#c39bff'], 180, 1.2, 8);
  if (now - AY11.sonDon > .2 || !AY11.hizli) ay11Sfx('aynaDon', o.sira);
  ay11Flas(A.ax, A.ay, 1, '#eaf4ff');
  AY11.sonDon = now;
  OLAY.emit('aynaDondu', { o, n, x: o.x, y: o.y });
  const L = ay11Liste(); AYNA11.sira = L.findIndex(a => !a.donmus); if (AYNA11.sira < 0) AYNA11.sira = L.length;
}
function ay11Canlan(p, n) {
  if (!p || p.canli) return;
  p.canli = true; p.canT = 0; p.done = true;
  const H = AY11_P[p.tur], hx = p.x + (H ? H.hit[0] : 0), hy = p.y + (H ? H.hit[1] : -40);
  burst(hx, hy, 26, ['#ffe7a8', '#cfe6ff', '#ffb3d1', '#c39bff'], 200, 1.4, 9);
  ay11Flas(hx, hy, 1.25, '#ffe7a8');
  if (typeof ripples !== 'undefined') ripples.push({ x: hx, y: hy, r: 0, life: 1.4, small: true });
  ay11Sfx('satoCanlan', p.sira);
  let c = 0; for (const q of ay11Parcalar()) if (q.canli) c++;
  OLAY.emit('satoCanlan', { o: p, n: c, tur: p.tur, x: hx, y: hy });
}
function ay11Iste(o) {   // dokunuş/geçiş: bu ayna ve öncekiler sıraya girer; huzme ulaşmışsa hemen döner
  const A = o.a11; if (!A || A.durum === 2) return false;
  for (const m of ay11Liste()) { if (m.sira > o.sira) break; if (m.a11.durum < 2) m.a11.istek = true; }
  if (A.durum === 1) ay11Don(o);
  return true;
}
function ay11Sevin(o) {   // dönmüş aynaya dokunuş: kanat çırpar, hoplar, pırıldar
  const A = o.a11; if (!A || A.durum !== 2 || A.sev > .4) return;
  A.sev = 1; burst(A.ax, A.ay - 30, 10, ['#eaf4ff', '#ffe7a8', '#ffb3d1'], 110, .8, 5); ay11Sfx('aynaSevin', o.sira);
}
function ay11Hepsi() {   // test: bütün aynalar ve parçalar anında
  ay11Kur();
  for (const m of ay11Liste()) {
    const A = m.a11; if (A.durum < 2) { A.durum = 1; ay11Don(m); A.donT = AY11_DON; }
    A.pA = 1; A.pT = 9; ay11Canlan(ay11Parca(m)); A.pB = 1;
  }
}
// ısıtma: önbellek tuvallerini ilk saniyelerde kare başına bir tane hazırla (ilk görünüşte takılma olmasın)
function ay11Isit() {
  if (AY11.isitI === undefined) {
    const k = s => ay11K(null, s, 4), k3 = () => ay11K(null, 1, 3);
    AY11.isit = [() => ay11CerceveSpr(k(AY11_OL)), () => ay11CamSpr(k(AY11_OL), true), () => ay11CamSpr(k(AY11_OL), false), () => ay11ArkaSpr(k(AY11_OL)),
      () => ay11KanatSpr(k(AY11_OL)), () => ay11AyakSpr(k(AY11_OL)), () => ay11AySpr(k(AY11_OL)), () => ay11Isilti(), () => ay11HuzmeSpr(), () => ay11KoniSpr(),
      () => AY11_P.kapi.spr(k3()), () => ay11Fener(ay11K(null, 1.25, 3)), () => AY11_P.cesme.spr(k3()), () => AY11_P.cali.spr(k3(), 0), () => AY11_P.cali.spr(k3(), 1), () => AY11_P.cali.spr(k3(), 2), () => AY11_P.cali.kanat(k3())];
    for (const [, r] of AY11_PEN) AY11.isit.push(() => { ay11PenSpr(k3(), r, r === 36); r === 36 ? ay11Vitray(k3(), r) : ay11PenIc(k3(), r); });
    AY11.isit.push(() => AY11_P.bayrak.direk(k3()), () => AY11_P.kule.spr(k3()), () => AY11_P.kule.ic(k3()), () => AY11_P.kule.yildiz(k3()), () => AY11_P.fener.direk(k3()), () => AY11_P.fener.buyuk(k3()), () => ay11Fener(k3()), () => ay11Fener(ay11K(null, 1.5, 3)));
    for (let i = 0; i < 5; i++) AY11.isit.push(() => AY11_P.kristal.spr(k3(), i));
    AY11.isit.push(() => AY11_P.avize.gov(k3()), () => AY11_P.avize.damla(k3()));
    for (let i = 0; i < 3; i++) AY11.isit.push(() => { AY11_P.portre.fon(k3(), i); AY11_P.portre.cer(k3(), i); });
    AY11.isit.push(() => AY11_P.perde.pencere(k3()), () => AY11_P.perde.ust(k3()), () => AY11_P.perde.aplik(k3()));
    AY11.isitI = 0;
  }
  if (AY11.isitI < AY11.isit.length) { try { AY11.isit[AY11.isitI](); } catch (e) {} AY11.isitI++; }
}
function ay11Adim(dt) {
  if (AY11.adimT === now) return; AY11.adimT = now;
  if (typeof S !== 'undefined' && S > 0) ay11Isit();
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, .05);
  ay11Kur(); const L = ay11Liste(); if (!L.length) return;
  let istek = false; for (const m of L) if (m.a11.istek) { istek = true; break; }
  AY11.hizli = istek;
  const hiz = istek ? 5200 : 2100, minT = istek ? .16 : .38;
  for (let i = 0; i < L.length; i++) {
    const m = L[i], A = m.a11;
    if (A.durum === 0 && (i === 0 || L[i - 1].a11.pB >= 1)) { A.durum = 1; A.varT = 0; if (i) ay11Vardi(m); }
    if (A.durum === 1) { A.varT += dt; if (A.istek && A.varT >= (i ? .1 : 0)) ay11Don(m); }
    else if (A.durum === 2) {
      A.donT += dt;
      if (A.donT >= (istek ? AY11_CIK * .7 : AY11_CIK) && A.pA < 1) { A.pA = Math.min(1, A.pA + dt / Math.max(minT, A.lenA / hiz)); if (A.pA >= 1) { A.pT = 0; ay11Canlan(ay11Parca(m)); } }
      else if (A.pA >= 1) {
        A.pT += dt;
        if (A.pT >= (istek ? .12 : .55) && A.pB < 1) A.pB = Math.min(1, A.pB + dt / Math.max(minT, A.lenB / (A.son ? 1400 : hiz)));
      }
    }
    // görsel durum
    const hedef = A.durum === 0 ? 0 : A.durum === 1 ? .55 : A.donT > .3 ? 1 : .6;
    A.lit += (hedef - A.lit) * Math.min(1, dt * 3);
    if (A.varFx >= 0) { A.varFx += dt; if (A.varFx > 1.2) A.varFx = -1; }
    A.sev = Math.max(0, A.sev - dt * .9); A.t += dt;
    A.kirpT -= dt; if (A.kirpT <= 0 && A.kirpA < 0) { A.kirpA = 0; A.kirpT = 2.4 + Math.random() * 3; }
    if (A.kirpA >= 0) { A.kirpA += dt; if (A.kirpA > .16) A.kirpA = -1; }
    // dönüş açısı (dikey eksen) ve yatış
    if (A.durum === 2) {
      const u = clamp(A.donT / AY11_DON, 0, 1), e = ay11GeriEase(u);
      A.th = lerp(A.th0, AY11_PI2 + .12 * A.yan, e) + (u >= 1 ? Math.sin(A.t * 1.1) * .05 : 0);
      A.tilt = lerp(0, A.egim, smooth(u)) + Math.sin(A.t * 9) * .05 * A.sev;
    } else if (A.durum === 1) { A.th = A.th0b + Math.sin(A.t * 2.6) * .3; A.tilt = Math.sin(A.t * 2.6 + .8) * .05; }
    else { A.th = A.th0b + Math.sin(A.t * .7) * .03; A.tilt = 0; }
  }
  // parçalar
  const Ps = ay11Parcalar();
  for (const p of Ps) {
    const H = AY11_P[p.tur]; if (!p.s11) ay11ParcaKur(p);
    p.s11.t += dt;
    const dx = P.x - p.x; p.s11.yak += ((Math.abs(dx) < 320 && DURUM === 'oyun' ? 1 : 0) - p.s11.yak) * Math.min(1, dt * 3);
    if (p.canli) {
      const c0 = p.canT; p.canT += dt;
      p.L = smooth(clamp((p.canT - .15) / .8, 0, 1));
      if (c0 < .6 && p.canT >= .6 && H && H.ilk) H.ilk(p);
    }
    if (H && H.adim) H.adim(p, dt);
  }
  ay11Kesitler();
}
// görünür huzme kesitleri (AYNA11.huzme; havuzdan, karede bellek ayırmadan)
function ay11Seg(x0, y0, x1, y1, a, tur, u) {
  let s = AY11.havuz[AY11.segN]; if (!s) { s = { x0: 0, y0: 0, x1: 0, y1: 0, a: 0, tur: 0, u: 1 }; AY11.havuz[AY11.segN] = s; }
  s.x0 = x0; s.y0 = y0; s.x1 = x1; s.y1 = y1; s.a = a; s.tur = tur; s.u = u; AYNA11.huzme[AY11.segN] = s; AY11.segN++;
}
function ay11Kesitler() {
  AY11.segN = 0; const L = ay11Liste();
  for (let i = 0; i < L.length; i++) {
    const A = L[i].a11;
    if (i === 0 && A.durum >= 0) ay11Seg(A.gx, A.gy, A.ax, A.ay, 1, 1, 1);   // gökten ilk aynaya
    if (A.durum < 2) break;
    if (A.pA > 0) { const e = A.pA; ay11Seg(A.ax, A.ay, lerp(A.ax, A.px, e), lerp(A.ay, A.py, e), 1, 0, e); }
    if (A.pB > 0) { const e = A.pB; ay11Seg(A.px, A.py, lerp(A.px, A.nx, e), lerp(A.py, A.ny, e), A.son ? .8 : 1, A.son ? 2 : 0, e); }
  }
  AYNA11.huzme.length = AY11.segN;
}
function ay11IsikNokta(x, y) {   // noktanın en yakın huzmeye uzaklığı → 0..1
  let best = 0;
  for (let i = 0; i < AY11.segN; i++) {
    const s = AYNA11.huzme[i], dx = s.x1 - s.x0, dy = s.y1 - s.y0, l2 = dx * dx + dy * dy || 1;
    const u = clamp(((x - s.x0) * dx + (y - s.y0) * dy) / l2, 0, 1), ex = s.x0 + dx * u - x, ey = s.y0 + dy * u - y;
    const v = 1 - Math.sqrt(ex * ex + ey * ey) / 140; if (v > best) best = v;
  }
  return clamp(best, 0, 1);
}
function ay11SegGor(s) {
  return ay11Gor(Math.min(s.x0, s.x1) - 40, Math.min(s.y0, s.y1) - 40, Math.max(s.x0, s.x1) + 40, Math.max(s.y0, s.y1) + 40);
}

// ═══════════════════════════════ AYNA ÇİZİMİ ═══════════════════════════════
// Yerel birimler (AY11_OL ile büyütülür): cam elipsi 34 × 50, altın halka 46 × 62, tepe madalyonu (0, −76) r 13,
// kanat kökleri (±30, −40), ayak (0, 62)'den zemine (AY11_YUK / AY11_OL).
const AY11_GX = 34, AY11_GY = 50, AY11_FX = 46, AY11_FY = 62;
function ay11CerceveSpr(K) {
  return ay11Cift('cerceve', K, -62, -96, 124, 176, q => {
    // tepe yuvası: madalyonun oturduğu kıvrımlı altın taç
    q.fillStyle = ay11Altin(q, -24, -96, 24, -56);
    q.beginPath(); q.moveTo(-26, -56); q.bezierCurveTo(-30, -74, -16, -92, 0, -92); q.bezierCurveTo(16, -92, 30, -74, 26, -56); q.closePath(); q.fill();
    q.strokeStyle = '#a8702a'; q.lineWidth = 1.2; q.stroke();
    for (const sx of [-1, 1]) {   // tacın iki yanında minik yıldızlar + kıvrımlar
      q.fillStyle = '#fff0b8'; ay11YildizYol(q, sx * 27, -72, 6, .45); q.fill(); q.strokeStyle = '#b8862e'; q.lineWidth = .8; q.stroke();
      q.strokeStyle = '#d9a54a'; q.lineWidth = 2.4; q.beginPath(); q.moveTo(sx * 18, -60); q.quadraticCurveTo(sx * 34, -58, sx * 36, -48); q.stroke();
    }
    // dış altın halka
    q.fillStyle = ay11Altin(q, -40, -62, 40, 62); q.beginPath(); q.ellipse(0, 0, AY11_FX, AY11_FY, 0, 0, AY11_PI2); q.fill();
    q.strokeStyle = '#9a6424'; q.lineWidth = 1.4; q.stroke();
    q.strokeStyle = 'rgba(255,246,206,.9)'; q.lineWidth = 1.3; q.beginPath(); q.ellipse(0, 0, AY11_FX - 2, AY11_FY - 2, 0, 0, AY11_PI2); q.stroke();
    q.strokeStyle = '#a8702a'; q.lineWidth = 2.6; q.beginPath(); q.ellipse(0, 0, AY11_GX + 1.6, AY11_GY + 1.6, 0, 0, AY11_PI2); q.stroke();
    // boncuk dizisi
    for (let k = 0; k < 24; k++) {
      const a = k / 24 * AY11_PI2, bx = Math.cos(a) * 40.6, by = Math.sin(a) * 56.6;
      q.fillStyle = '#a8702a'; q.beginPath(); q.arc(bx + .4, by + .5, 2.3, 0, AY11_PI2); q.fill();
      q.fillStyle = '#ffe9a6'; q.beginPath(); q.arc(bx, by, 2, 0, AY11_PI2); q.fill();
      q.fillStyle = '#ffffff'; q.beginPath(); q.arc(bx - .6, by - .7, .7, 0, AY11_PI2); q.fill();
    }
    // köşegenlerde yıldız işleme
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      const bx = sx * 33, by = sy * 46;
      q.fillStyle = '#fff3c4'; ay11YildizYol(q, bx, by, 5.4, .42, 5, sx * .2); q.fill(); q.strokeStyle = '#b07a2a'; q.lineWidth = .7; q.stroke();
    }
    // yanlarda lila taşlar
    for (const sx of [-1, 1]) {
      q.fillStyle = '#7d5cc8'; q.beginPath(); q.ellipse(sx * 41, 0, 5, 7.5, 0, 0, AY11_PI2); q.fill();
      q.fillStyle = ay11Rad(q, sx * 40, -2, 0, 7, [0, '#efe2ff', .45, '#c39bff', 1, '#7d5cc8']); q.beginPath(); q.ellipse(sx * 41, 0, 4, 6.3, 0, 0, AY11_PI2); q.fill();
      q.strokeStyle = '#a8702a'; q.lineWidth = 1; q.beginPath(); q.ellipse(sx * 41, 0, 5, 7.5, 0, 0, AY11_PI2); q.stroke();
    }
    // alt kıvrımlar + çilek kalp taş
    q.strokeStyle = '#d9a54a'; q.lineWidth = 3;
    for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(sx * 4, 66); q.bezierCurveTo(sx * 18, 74, sx * 30, 64, sx * 22, 57); q.bezierCurveTo(sx * 17, 53, sx * 12, 58, sx * 16, 62); q.stroke(); }
    q.fillStyle = '#c23a62'; ay11KalpYol(q, 0, 61, 8.4); q.fill();
    q.fillStyle = ay11Rad(q, -2, 58, 0, 9, [0, '#ffd0de', .4, '#ff7a9a', 1, '#d83a66']); ay11KalpYol(q, 0, 60.5, 7); q.fill();
    q.strokeStyle = '#a8702a'; q.lineWidth = 1; ay11KalpYol(q, 0, 61, 8.4); q.stroke();
    q.fillStyle = 'rgba(255,255,255,.85)'; q.beginPath(); q.ellipse(-2.6, 57.6, 1.6, 1.1, -.5, 0, AY11_PI2); q.fill();
  }, '#2a2452', .5);
}
function ay11CamSpr(K, acik) {   // cam: aydınlıkta gümüş-mavi + ay ve yıldız yansıması; sönükte sisli gri-mor
  return ay11Tuval(acik ? 'camA' : 'camS', K, -36, -52, 72, 104, q => {
    q.save(); q.beginPath(); q.ellipse(0, 0, AY11_GX, AY11_GY, 0, 0, AY11_PI2); q.clip();
    q.fillStyle = acik ? ay11Lin(q, 0, -50, 0, 50, [0, '#f6fbff', .4, '#d4e6ff', .78, '#a9c2f2', 1, '#8ea6e4'])
                       : ay11Lin(q, 0, -50, 0, 50, [0, '#6f6aa2', .5, '#56508a', 1, '#3d3870']);
    q.fillRect(-36, -52, 72, 104);
    // yansıyan uzak tepe ve şato (yumuşak, soluk)
    q.fillStyle = acik ? 'rgba(130,120,200,.28)' : 'rgba(40,34,80,.35)';
    q.beginPath(); q.moveTo(-36, 34); q.quadraticCurveTo(-12, 18, 8, 26); q.quadraticCurveTo(22, 30, 36, 22); q.lineTo(36, 52); q.lineTo(-36, 52); q.fill();
    q.fillRect(-14, 10, 7, 16); q.beginPath(); q.moveTo(-16, 10); q.quadraticCurveTo(-10.5, 0, -5, 10); q.fill();
    q.fillRect(-3, 14, 9, 12); q.beginPath(); q.moveTo(-5, 14); q.quadraticCurveTo(1.5, 5, 8, 14); q.fill();
    // ay + yıldızlar
    if (acik) {
      q.fillStyle = ay11Rad(q, 12, -22, 0, 22, [0, 'rgba(255,250,232,.9)', .4, 'rgba(234,244,255,.35)', 1, 'rgba(234,244,255,0)']); q.fillRect(-10, -44, 44, 44);
      q.fillStyle = '#fffbea'; q.beginPath(); q.arc(12, -22, 7.5, 0, AY11_PI2); q.fill();
      q.fillStyle = 'rgba(215,205,170,.5)'; q.beginPath(); q.arc(10, -24, 1.6, 0, AY11_PI2); q.arc(14.5, -19.5, 1.2, 0, AY11_PI2); q.fill();
    } else { q.fillStyle = 'rgba(200,196,235,.25)'; q.beginPath(); q.arc(12, -22, 7, 0, AY11_PI2); q.fill(); }
    q.fillStyle = acik ? '#ffffff' : 'rgba(220,215,255,.4)';
    for (const [sx, sy, r] of [[-18, -30, 1.3], [-8, -38, .9], [-22, -12, .8], [24, -4, 1], [2, -8, .7], [-4, -26, .6]]) { q.beginPath(); q.arc(sx, sy, r, 0, AY11_PI2); q.fill(); }
    // çapraz parıltı bantları
    q.rotate(-.55); q.fillStyle = acik ? 'rgba(255,255,255,.34)' : 'rgba(255,255,255,.1)'; q.fillRect(-30, -40, 9, 80); q.fillStyle = acik ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.06)'; q.fillRect(-17, -40, 4, 80);
    q.restore();
    // iç kenar gölgesi
    q.strokeStyle = acik ? 'rgba(90,110,190,.35)' : 'rgba(20,16,50,.45)'; q.lineWidth = 3; q.beginPath(); q.ellipse(0, 0, AY11_GX - 1.5, AY11_GY - 1.5, 0, 0, AY11_PI2); q.stroke();
  });
}
function ay11ArkaSpr(K) {   // aynanın arkası (dönüşün ortasında görünür): mor kadife + altın yıldız
  return ay11Tuval('arka', K, -48, -64, 96, 128, q => {
    q.fillStyle = ay11Altin(q, -40, -62, 40, 62); q.beginPath(); q.ellipse(0, 0, AY11_FX, AY11_FY, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = ay11Rad(q, -8, -14, 4, 56, [0, '#6a52b8', .6, '#4b3a8c', 1, '#2e2462']); q.beginPath(); q.ellipse(0, 0, AY11_GX + 2, AY11_GY + 2, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = '#ffd27a'; ay11YildizYol(q, 0, 0, 14, .45); q.fill();
    q.fillStyle = '#fff0b8'; for (let k = 0; k < 10; k++) { const a = k / 10 * AY11_PI2; q.beginPath(); q.arc(Math.cos(a) * 24, Math.sin(a) * 36, 1.6, 0, AY11_PI2); q.fill(); }
  });
}
function ay11KanatSpr(K) {   // sol kanat; kök (0, 0), uç (−46, −30). Sağ kanat yatay aynalanır.
  return ay11Cift('kanat', K, -52, -40, 58, 52, q => {
    q.beginPath(); q.moveTo(2, 2); q.quadraticCurveTo(-14, -30, -47, -31);
    q.quadraticCurveTo(-44, -18, -42, -9); q.quadraticCurveTo(-36, -13, -31, -6); q.quadraticCurveTo(-25, -10, -19, -1); q.quadraticCurveTo(-12, -4, -7, 5); q.quadraticCurveTo(-2, 3, 2, 2); q.closePath();
    q.fillStyle = ay11Lin(q, -40, -28, -6, 4, [0, '#d9c8ff', .5, '#a98ae8', 1, '#7a5cc4']); q.fill();
    q.strokeStyle = '#e8b85a'; q.lineWidth = 1.6; q.stroke();
    q.strokeStyle = 'rgba(255,240,200,.75)'; q.lineWidth = 1;
    for (const [ex, ey] of [[-42, -10], [-31, -7], [-19, -2]]) { q.beginPath(); q.moveTo(-4, -2); q.quadraticCurveTo((ex - 4) / 2, ey - 10, ex, ey); q.stroke(); }
    q.fillStyle = '#fff6d8'; for (const [sx, sy, r] of [[-33, -20, 1.4], [-20, -13, 1.1], [-12, -18, .9]]) { ay11YildizYol(q, sx, sy, r * 1.9, .45); q.fill(); }
  }, '#2a2452', .45);
}
function ay11AyakSpr(K) {   // kıvrımlı altın ayak (kök: cam merkezi)
  const G = AY11_YUK / AY11_OL;
  return ay11Cift('ayak', K, -36, 56, 72, G - 50, q => {
    q.fillStyle = ay11Altin(q, -6, 60, 6, G); q.strokeStyle = '#9a6424'; q.lineWidth = 1.1;
    q.beginPath(); q.moveTo(-3.5, 64); q.lineTo(3.5, 64); q.lineTo(5.5, G - 12); q.lineTo(-5.5, G - 12); q.closePath(); q.fill(); q.stroke();
    q.beginPath(); q.ellipse(0, 92, 7.5, 4.5, 0, 0, AY11_PI2); q.fill(); q.stroke();
    q.beginPath(); q.arc(0, 66, 5.6, 0, AY11_PI2); q.fill(); q.stroke();
    q.fillStyle = 'rgba(255,250,220,.8)'; q.beginPath(); q.arc(-1.8, 64.4, 1.6, 0, AY11_PI2); q.fill();
    q.fillStyle = ay11Altin(q, -26, G - 16, 26, G); q.beginPath(); q.ellipse(0, G - 9, 20, 8, 0, Math.PI, 0); q.closePath(); q.fill(); q.strokeStyle = '#9a6424'; q.stroke();
    q.beginPath(); q.ellipse(0, G - 2, 27, 3.6, 0, 0, AY11_PI2); q.fill(); q.stroke();
    q.strokeStyle = '#d9a54a'; q.lineWidth = 2.6;
    for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(sx * 14, G - 8); q.bezierCurveTo(sx * 30, G - 14, sx * 34, G - 2, sx * 27, G - 2); q.bezierCurveTo(sx * 23, G - 2, sx * 23, G - 7, sx * 27, G - 7); q.stroke(); }
    q.fillStyle = '#c39bff'; q.beginPath(); q.arc(0, G - 9, 3, 0, AY11_PI2); q.fill();
  }, '#2a2452', .5);
}
function ay11AySpr(K) {   // tepe madalyonu: ay yüzü (yüz ifadesi canlı çizilir)
  return ay11Cift('ayYuz', K, -16, -16, 32, 32, q => {
    q.fillStyle = ay11Rad(q, -4, -4, 1, 15, [0, '#fffdf2', .6, '#fff0c4', 1, '#f2d68e']); q.beginPath(); q.arc(0, 0, 13, 0, AY11_PI2); q.fill();
    q.strokeStyle = '#c8963a'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = 'rgba(226,200,140,.45)'; q.beginPath(); q.arc(6.5, -6, 2, 0, AY11_PI2); q.arc(-7.5, 5, 1.4, 0, AY11_PI2); q.arc(8, 5.5, 1.1, 0, AY11_PI2); q.fill();
  }, '#2a2452', .4);
}
// Aynanın başı (çerçeve + cam + kanatlar + ay yüzü); (x, y) cam merkezi. th: dikey eksende dönüş açısı (cos < 0 → arkası),
// tilt: düzlemde yatış, lit 0..1, kanat 0..1 (çırpma), yuz {uyku 0..1, kirp 0..1, bak -1..1, gul 0..1}
const AY11_YUZ0 = { uyku: 0, kirp: 0, bak: 0, gul: 1 };
function ay11BasCiz(c, x, y, s, th, tilt, lit, kanat, yuz, t) {
  const K = ay11K(c, s * AY11_OL, 4), sx = Math.cos(th);
  yuz = yuz || AY11_YUZ0;
  c.save(); c.translate(x, y); if (tilt) c.rotate(tilt); c.scale(s * AY11_OL * (Math.abs(sx) < .03 ? (sx < 0 ? -.03 : .03) : sx), s * AY11_OL);
  // kanatlar (çerçevenin arkasında; çırpınca yukarı kalkar)
  const kn = ay11KanatSpr(K);
  for (const sd of [-1, 1]) {
    c.save(); c.translate(sd * 30, -40); c.scale(sd < 0 ? 1 : -1, 1); c.rotate(-kanat * .42 + .06);
    ay11KoyL(c, kn, 0, 0, lit); c.restore();
  }
  if (sx >= 0) {
    ay11KoyL(c, ay11CerceveSpr(K), 0, 0, lit);
    ay11Koy(c, ay11CamSpr(K, false), 0, 0);
    if (lit > .01) { const ga = c.globalAlpha; c.globalAlpha = ga * lit; ay11Koy(c, ay11CamSpr(K, true), 0, 0); c.globalAlpha = ga; }
  } else { ay11Koy(c, ay11ArkaSpr(K), 0, 0); }
  // ay yüzü madalyonu
  ay11KoyL(c, ay11AySpr(K), 0, -76, lit);
  const ex = (yuz.bak || 0) * 1.6 * (sx >= 0 ? 1 : -1), uy = clamp(Math.max(yuz.uyku || 0, yuz.kirp || 0), 0, 1);
  c.strokeStyle = '#6a4a2a'; c.fillStyle = '#4a3328'; c.lineWidth = 1.1;
  for (const sd of [-1, 1]) {
    const gx = sd * 4.4 + ex, gy = -77.5;
    if (uy > .5) { c.beginPath(); c.arc(gx, gy - .6, 2, .25, Math.PI - .25); c.stroke(); }
    else { c.beginPath(); c.ellipse(gx, gy, 1.7, 2.1 * (1 - uy), 0, 0, AY11_PI2); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(gx - .5, gy - .8, .6, 0, AY11_PI2); c.fill(); c.fillStyle = '#4a3328'; }
  }
  c.fillStyle = 'rgba(255,140,170,.55)'; c.beginPath(); c.arc(-7.4 + ex * .5, -73.6, 1.8, 0, AY11_PI2); c.arc(7.4 + ex * .5, -73.6, 1.8, 0, AY11_PI2); c.fill();
  c.beginPath(); c.arc(ex * .6, -73.8, 2.2 + (yuz.gul || 0) * .6, .35, Math.PI - .35); c.stroke();
  c.restore();
}
// aynaCerceveCiz(c, x, y, s, t, o): ortak süslü ayna (MINI1 ayna salonu isterse). (x, y) cam merkezi.
// o = { don 0..1 (dönüş), parla (bool) | isik 0..1, kanat 0..1, egim (rad), ayak (bool: ayaklığıyla) }
function aynaCerceveCiz(c, x, y, s, t, o) {
  o = o || {}; s = s || 1;
  const lit = o.isik != null ? clamp(o.isik, 0, 1) : o.parla ? 1 : .3, th = (o.don || 0) * AY11_PI2;
  if (o.ayak) { c.save(); c.translate(x, y); c.scale(s * AY11_OL, s * AY11_OL); ay11KoyL(c, ay11AyakSpr(ay11K(c, 1, 4)), 0, 0, lit); c.restore(); }
  ay11BasCiz(c, x, y, s, th, o.egim || 0, lit, o.kanat != null ? o.kanat : .3 + .3 * Math.sin((t || 0) * 3), { uyku: lit < .35 ? 1 : 0, kirp: 0, bak: 0, gul: lit }, t || 0);
}
const AY11_YZ = { uyku: 0, kirp: 0, bak: 0, gul: 0 };
TUR.kaydet('ayAyna', {
  kur(o) {
    if (!o.a11) {
      const th = (o.sira % 2 ? -1 : 1) * .78;
      o.a11 = { durum: 0, istek: false, varT: 0, donT: 0, pA: 0, pB: 0, pT: 0, lit: 0, varFx: -1, sev: 0, t: (o.x * .013) % 7,
        kirpT: 1 + (o.sira % 4) * .7, kirpA: -1, th, th0: th, th0b: th, tilt: 0, ax: o.x, ay: o.y - AY11_YUK, px: o.x, py: o.y, gx: o.x, gy: o.y - 600,
        nx: o.x, ny: o.y, lenA: 1, lenB: 1, egim: 0, yan: 1, son: false };
    }
    o.donmus = o.a11.durum === 2; o.parca = undefined; o.r = o.r || 70;
    // yardımcı çizim nesnesi: son aynanın hemen ardına (huzmeler aynaların üstünde, aile/dekor dostların altında)
    if (!AY11.sahne) {
      let son = -1; for (let i = 0; i < NESNELER.length; i++) if (NESNELER[i].tip === 'ayAyna') son = i;
      if (NESNELER[son] === o) { AY11.sahne = { tip: 'ay11Sahne', x: o.x, y: o.y, id: 'ay11Sahne' }; NESNELER.splice(son + 1, 0, AY11.sahne); }
    }
  },
  guncelle(o, dt) { ay11Adim(dt); },
  dokun(o) { ay11Iste(o); },   // oyun.js: Feza o.r içine girince (yanından geçerken) bir kez
  ciz(o, tm) {
    const A = o.a11; if (!A || !ay11Gor(o.x - 140, o.y - 290, o.x + 140, o.y + 20)) return;
    const x = o.x, gy = o.y, cy = gy - AY11_YUK, lit = A.lit, bek = A.durum === 1;
    // gölge + yerde ay ışığı havuzu
    g.fillStyle = 'rgba(20,14,46,.32)'; g.beginPath(); g.ellipse(x, gy - 1, 42, 6, 0, 0, AY11_PI2); g.fill();
    g.globalCompositeOperation = 'lighter';
    if (lit > .05) { ay11IsikE(g, '#a9c8ff', x, gy - 2, 150, 26, lit * .32); ay11Isik(g, '#cfe6ff', x, cy, 120, lit * (bek ? .16 + .1 * Math.sin(A.t * 3) : .2)); }
    g.globalCompositeOperation = 'source-over';
    // ayak (dönmez) + baş
    const K = ay11K(g, AY11_OL, 4);
    g.save(); g.translate(x, cy); g.scale(AY11_OL, AY11_OL); ay11KoyL(g, ay11AyakSpr(K), 0, 0, Math.max(lit, .2)); g.restore();
    const kn = A.durum === 0 ? .1 + .05 * Math.sin(A.t * 1.3) : bek ? .5 + .5 * Math.sin(A.t * 5.2) : .35 + .25 * Math.sin(A.t * 2.4) + A.sev * .6 * Math.abs(Math.sin(A.t * 16));
    const Y = AY11_YZ;
    Y.uyku = A.durum === 0 ? 1 : 0; Y.kirp = A.kirpA >= 0 ? Math.sin(Math.PI * A.kirpA / .16) : 0;
    Y.bak = clamp((P.x - x) / 260, -1, 1); Y.gul = A.durum === 2 ? 1 : .5;
    const hop = A.sev > 0 ? Math.abs(Math.sin(A.sev * 9)) * 7 * A.sev : 0;
    ay11BasCiz(g, x, cy - hop, 1, A.th, A.tilt, Math.max(lit, .12), kn, Y, tm);
    // ışık: camdaki leke, "beni çevir" halkası, çevresinde dönen pırıltılar
    g.globalCompositeOperation = 'lighter';
    if (A.durum >= 1) {
      const n = .5 + .5 * Math.sin(A.t * 3.2);
      ay11Isik(g, '#eaf4ff', x, cy - hop, bek ? 34 + 8 * n : 44, bek ? .35 + .3 * n : .4 * lit);
      if (bek) {
        const u = (A.t % 1.5) / 1.5;
        g.globalAlpha = (1 - u) * .55; g.strokeStyle = '#cfe6ff'; g.lineWidth = 3.5 * (1 - u) + .8;
        g.beginPath(); g.ellipse(x, cy, (AY11_FX + 6 + u * 46) * AY11_OL, (AY11_FY + 6 + u * 52) * AY11_OL, A.tilt, 0, AY11_PI2); g.stroke(); g.globalAlpha = 1;
        const isl = ay11Isilti();
        for (let k = 0; k < 3; k++) {
          const a = A.t * 1.7 + k * 2.094, px = x + Math.cos(a) * 68, py = cy + Math.sin(a) * 86, tw = .6 + .4 * Math.sin(A.t * 7 + k * 2), r = 6 * tw;
          ay11Isik(g, '#cfe6ff', px, py, 14, .35 * tw); g.globalAlpha = .9 * tw; g.drawImage(isl, px - r, py - r, r * 2, r * 2); g.globalAlpha = 1;
        }
      }
      if (A.varFx >= 0) { const u = A.varFx / 1.2; ay11Isik(g, '#ffffff', x, cy, 70 + u * 60, (1 - u) * .5); }
    }
    // dönmüş ayna: camda ara sıra kayan parıltı
    if (A.durum === 2 && lit > .6) {
      const u = (A.t % 3.6) / .9;
      if (u < 1) {
        g.save(); g.translate(x, cy - hop); g.rotate(A.tilt); g.scale(AY11_OL * Math.cos(A.th), AY11_OL);
        g.beginPath(); g.ellipse(0, 0, AY11_GX, AY11_GY, 0, 0, AY11_PI2); g.clip();
        g.rotate(-.5); g.globalAlpha = Math.sin(u * Math.PI) * .55; g.drawImage(glow('#ffffff'), -60 + u * 120 - 9, -70, 18, 140); g.restore(); g.globalAlpha = 1;
      }
    }
    g.globalCompositeOperation = 'source-over';
  }
});
// ── yardımcı çizim nesnesi: parçalar, huzmeler, ön ışıltılar (ekran dışı kırpması kendi içinde) ──
TUR.kaydet('ay11Sahne', {
  kur(o) {},
  guncelle(o, dt) { ay11Adim(dt); if (typeof cam !== 'undefined') { o.x = cam.x + VW / 2; o.y = cam.y + 200; } },
  ciz(o, tm) { ay11SahneCiz(tm); },
  cizOn(o, tm) { ay11OnCiz(tm); }
});
function ay11SahneCiz(tm) {
  const Ps = ay11Parcalar();
  // parçalar (normal katman)
  for (const p of Ps) { const H = AY11_P[p.tur]; if (!H || !p.s11) continue; const k = H.kutu; if (H.ciz && ay11Gor(p.x + k[0], p.y + k[1], p.x + k[2], p.y + k[3])) H.ciz(p, tm, p.L || 0); }
  g.globalAlpha = 1; g.globalCompositeOperation = 'lighter';
  for (const p of Ps) {
    const H = AY11_P[p.tur]; if (!H || !p.s11) continue; const k = H.kutu;
    if (!ay11Gor(p.x + k[0] - 60, p.y + k[1] - 60, p.x + k[2] + 60, p.y + k[3] + 60)) continue;
    if (H.isik) H.isik(p, tm, p.L || 0);
    if (p.canli && p.canT < 1.8) ay11CanlanFx(p, H, tm);
  }
  // huzmeler
  for (let i = 0; i < AY11.segN; i++) {
    const s = AYNA11.huzme[i]; if (!ay11SegGor(s)) continue;
    if (s.tur === 1) ay11KoniCiz(g, s.x0, s.y0, s.x1, s.y1, tm, .9);
    if (s.tur === 2) {   // son huzme: göğe doğru incelip söner (üç parça)
      for (let k = 0; k < 3; k++) { const u0 = k / 3, u1 = (k + 1) / 3; aynaHuzmeCiz(g, lerp(s.x0, s.x1, u0), lerp(s.y0, s.y1, u0), lerp(s.x0, s.x1, u1), lerp(s.y0, s.y1, u1), tm + k * .37, s.a * (1 - k * .3), { w: 1 - k * .2 }); }
    } else aynaHuzmeCiz(g, s.x0, s.y0, s.x1, s.y1, tm, s.a, s.tur === 1 ? { w: 1.25 } : null);
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function ay11OnCiz(tm) {
  g.globalCompositeOperation = 'lighter';
  // "vay" anı: ayna dönüşünde / huzme varışında kısa ışık patlaması (yumuşak hâle + genişleyen ince halka + dört kollu parıltı)
  for (const F of AY11_FLAS) {
    const u = (now - F.t) / .75; if (u < 0 || u >= 1 || !ay11Gor(F.x - 400, F.y - 400, F.x + 400, F.y + 400)) continue;
    const e = 1 - u, r = F.r;
    ay11Isik(g, F.col, F.x, F.y, (120 + u * 260) * r, e * e * .55);
    ay11Isik(g, '#ffffff', F.x, F.y, (40 + u * 40) * r, e * e * .8);
    g.globalAlpha = e * .6; g.strokeStyle = F.col; g.lineWidth = 3 * e + 1; g.beginPath(); g.ellipse(F.x, F.y, (40 + u * 230) * r, (30 + u * 170) * r, 0, 0, AY11_PI2); g.stroke();
    const sl = (60 + 160 * Math.sin(Math.min(1, u * 2) * Math.PI / 2)) * r * e, sw = 7 * r * e;
    g.globalAlpha = e * .75; const gl = glow('#ffffff'); g.drawImage(gl, F.x - sl, F.y - sw, sl * 2, sw * 2); g.drawImage(gl, F.x - sw, F.y - sl * .8, sw * 2, sl * 1.6);
    g.globalAlpha = 1;
  }
  const L = ay11Liste();
  for (let i = 0; i < L.length; i++) {
    const A = L[i].a11; if (!A || A.durum < 1) continue;
    // sekme parıltısı (aynanın camında) ve büyüyen huzme uçları
    if (ay11Gor(A.ax - 80, A.ay - 80, A.ax + 80, A.ay + 80)) ay11Bas(g, A.ax, A.ay, tm + i, A.durum === 2 ? .75 : .5 + .2 * Math.sin(A.t * 3.2), A.durum === 2 ? 1 : .8);
    if (A.durum < 2) continue;
    if (A.pA > 0 && A.pA < 1) { const x = lerp(A.ax, A.px, A.pA), y = lerp(A.ay, A.py, A.pA); if (ay11Gor(x - 60, y - 60, x + 60, y + 60)) ay11Bas(g, x, y, tm, 1, 1.2); }
    if (A.pA >= 1 && ay11Gor(A.px - 60, A.py - 60, A.px + 60, A.py + 60)) ay11Bas(g, A.px, A.py, tm + i * .7, .55, .8);
    if (A.pB > 0 && A.pB < 1) { const x = lerp(A.px, A.nx, A.pB), y = lerp(A.py, A.ny, A.pB); if (ay11Gor(x - 60, y - 60, x + 60, y + 60)) ay11Bas(g, x, y, tm, 1, 1.2); }
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
// canlanma anı (bütün parçalar): ışık tozu vuruş noktasına dolanarak akar → parıltı + ışık halkası + pırıltı patlaması
function ay11CanlanFx(p, H, tm) {
  const x = p.x + H.hit[0], y = p.y + H.hit[1], ct = p.canT, col = H.renk || '#cfe6ff', isl = ay11Isilti();
  if (ct < .45) {
    const u = ct / .45;
    for (let k = 0; k < 8; k++) { const a = k / 8 * AY11_PI2 + ct * 5, r = (1 - u) * 90 + 6; ay11Isik(g, k % 2 ? col : '#eaf4ff', x + Math.cos(a) * r, y + Math.sin(a) * r * .8, 10, (1 - u * .4) * .6); }
  } else {
    const u = (ct - .45) / 1.35, e = 1 - Math.pow(1 - u, 2.4);
    if (u < .3) ay11Isik(g, '#ffffff', x, y, 110, (1 - u / .3) * .55);
    g.globalAlpha = (1 - u) * .7; g.strokeStyle = col; g.lineWidth = 3.5 * (1 - u) + 1;
    g.beginPath(); g.ellipse(x, y, 20 + e * 150, 16 + e * 110, 0, 0, AY11_PI2); g.stroke(); g.globalAlpha = 1;
    for (let k = 0; k < 12; k++) {
      const a = k / 12 * AY11_PI2 + .3, rr = 14 + e * (80 + (k % 3) * 26), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * .8 + u * u * 30, r = (k % 2 ? 5 : 7) * (1 - u * .5);
      ay11Isik(g, k % 3 ? col : '#ffe7a8', px, py, 12, (1 - u) * .5);
      g.globalAlpha = (1 - u) * .95; g.drawImage(isl, px - r, py - r, r * 2, r * 2); g.globalAlpha = 1;
    }
  }
}
function ay11ParcaKur(p) {
  if (p.s11) return;
  p.canli = !!p.canli; p.canT = p.canT || 0; p.L = 0;
  p.s11 = { t: (p.x * .011) % 9, yak: 0, tep: 0, tepT: 0, oz: 3 + (p.sira || 0) % 4 * .6 };
  const H = AY11_P[p.tur]; if (H && H.kur) H.kur(p);
}
TUR.kaydet('satoParca', {
  kur(o) { ay11ParcaKur(o); },
  guncelle(o, dt) { ay11Adim(dt); }
});

// ═══════════════════════════════ dokunma (aynalar, canlı parçalar) ═══════════════════════════════
// Bekleyen/sönük aynaya dokunuş bu dosyanındır (yürümeye gitmez). Dönmüş aynaya ve canlı parçalara dokunmak yalnız sevimli bir
// tepki verir, yürümeyi engellemez.
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 11 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0 || (P.kilit || 0) > .05) return;
  if (typeof V11 !== 'undefined' && V11.final) return;
  if (typeof om11MiniAktif === 'function' && om11MiniAktif()) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  let en = null, best = 1;
  for (const o of ay11Liste()) {
    if (!o.a11 || Math.abs(o.x - wx) > 220) continue;
    const d = ((wx - o.x) / 85) ** 2 + ((wy - (o.y - AY11_YUK - 10)) / 130) ** 2;
    if (d < best) { best = d; en = o; }
  }
  if (en) {
    if (en.a11.durum < 2) { e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0; ay11Iste(en); }
    else ay11Sevin(en);
    return;
  }
  for (const p of ay11Parcalar()) {
    if (!p.canli || p.canT < 1.2 || !p.s11) continue;
    const H = AY11_P[p.tur]; if (!H || !H.tik) continue;
    const k = H.kutu; if (wx < p.x + k[0] || wx > p.x + k[2] || wy < p.y + k[1] || wy > p.y + k[3]) continue;
    if (H.tik(p, wx - p.x, wy - p.y) !== false) { ay11Sfx('satoDokun', p.sira); return; }
  }
}, true);

// ═══════════════════════════════ ŞATO PARÇALARI (12 canlanma) ═══════════════════════════════
// Her tür: renk (büyü rengi), hit [dx, dy] (huzmenin vurduğu nokta), kutu [x0, y0, x1, y1] (ekran ve dokunma kutusu; o.x/o.y'ye göre),
// kur(p), adim(p, dt), ciz(p, t, L) (normal katman), isik(p, t, L) ('lighter' katmanı), ilk(p) (canlanma anı), tik(p, dx, dy).
// L 0..1: sönükten aydınlığa geçiş. p.canT: canlanmadan beri sn (sönükken 0). Gecikmeli alt parçalar ay11Gec ile.
function ay11Gec(p, d, sure) { return p.canli ? smooth(clamp((p.canT - d) / (sure || .35), 0, 1)) : 0; }
const AY11_TAS = { a: '#c9baf0', o: '#a996dc', k: '#8a76c4', ç: '#6f5ca8' };
function ay11TasBlok(q, x, y, w, h, r) {   // pastel taş blok (yumuşak köşe, üstü açık)
  ay11Yuv(q, x, y, w, h, r || 3); q.fillStyle = ay11Lin(q, x, y, x + w, y + h, [0, '#d6caf6', .5, AY11_TAS.o, 1, AY11_TAS.k]); q.fill();
  q.strokeStyle = 'rgba(90,70,150,.55)'; q.lineWidth = 1; q.stroke();
  q.fillStyle = 'rgba(255,255,255,.25)'; q.fillRect(x + 2, y + 1.5, w - 4, 2);
}
function ay11Fener(K) {   // asılı fener: kanca (0, 0), gövde y 6..36 (cam koyu; ışık topu canlı çizilir)
  return ay11Cift('fener', K, -14, -2, 28, 42, q => {
    q.strokeStyle = '#b8862e'; q.lineWidth = 1.4; q.beginPath(); q.arc(0, 2, 2.4, 0, AY11_PI2); q.stroke();
    q.fillStyle = ay11Altin(q, -10, 4, 10, 12); q.beginPath(); q.moveTo(-10, 12); q.quadraticCurveTo(-8, 4, 0, 4); q.quadraticCurveTo(8, 4, 10, 12); q.closePath(); q.fill(); q.strokeStyle = '#9a6424'; q.lineWidth = .9; q.stroke();
    ay11Yuv(q, -8, 12, 16, 18, 3); q.fillStyle = '#2c2a58'; q.fill();
    q.fillStyle = 'rgba(200,220,255,.18)'; q.fillRect(-6.5, 13.5, 4, 15);
    q.strokeStyle = '#d9a54a'; q.lineWidth = 1.5; ay11Yuv(q, -8, 12, 16, 18, 3); q.stroke(); q.beginPath(); q.moveTo(0, 12); q.lineTo(0, 30); q.stroke();
    q.fillStyle = ay11Altin(q, -10, 30, 10, 36); q.beginPath(); q.ellipse(0, 31, 10, 3.4, 0, 0, AY11_PI2); q.fill(); q.beginPath(); q.arc(0, 36, 2.4, 0, AY11_PI2); q.fill();
    q.fillStyle = '#fff0b8'; ay11YildizYol(q, 0, 8, 2.4, .45); q.fill();
  });
}
function ay11Top(c, x, y, r, a, t, k) {   // sihirli ay ışığı topu (alev değil): yumuşak hale + beyaz çekirdek + pırıltı
  if (!(a > .01)) return;
  ay11Isik(c, '#a9c8ff', x, y, r * 4.2, .32 * a); ay11Isik(c, '#eaf4ff', x, y, r * 1.6, .85 * a);
  const s = r * (1.1 + .25 * Math.sin(t * 5 + k)), isl = ay11Isilti(), ga = c.globalAlpha;
  c.globalAlpha = ga * a * .9; c.drawImage(isl, x - s, y - s, s * 2, s * 2); c.globalAlpha = ga;
}
function ay11ZCiz(c, x, y, r, a) {   // uykucu "z" (yumuşak, lila)
  if (!(a > .02)) return; c.globalAlpha = a; c.strokeStyle = '#efe6ff'; c.lineWidth = Math.max(1, r * .45);
  c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x + r, y - r); c.lineTo(x - r, y + r); c.lineTo(x + r, y + r); c.stroke(); c.globalAlpha = 1;
}

// açık bahçe kapısı kanadı (yalnız sprite içinde bir kez çizilir): içe doğru açılmış, hafif perspektifli süslü lila demir kanat —
// kemerli tepe, altın top uçlu parmaklıklar, kıvrık sarmallar, ortada çilek kalp madalyon, tepede altın hilal, altın menteşeler
function ay11KapiKanat(q, gx, sx) {
  const W = 50, X = u => gx - sx * W * u, yT = u => -138 + u * 10 - Math.sin(u * Math.PI) * 16, yB = u => -4 - u * 7;
  q.save(); q.lineCap = 'round'; q.lineJoin = 'round';
  q.beginPath(); for (let k = 0; k <= 10; k++) q.lineTo(X(k / 10), yT(k / 10)); for (let k = 10; k >= 0; k--) q.lineTo(X(k / 10), yB(k / 10)); q.closePath();
  q.fillStyle = 'rgba(120,96,190,.22)'; q.fill();
  // parmaklıklar (altın top uçlu)
  for (let k = 1; k < 5; k++) {
    const u = k / 5, x = X(u);
    q.strokeStyle = '#4e3f86'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(x, yT(u) + 2); q.lineTo(x, yB(u) - 1); q.stroke();
    q.strokeStyle = 'rgba(214,198,255,.7)'; q.lineWidth = .9; q.beginPath(); q.moveTo(x - sx * .8, yT(u) + 4); q.lineTo(x - sx * .8, yB(u) - 3); q.stroke();
    q.fillStyle = '#e8b958'; q.beginPath(); q.arc(x, yT(u) - 3, 3.2, 0, AY11_PI2); q.fill(); q.fillStyle = '#fff2c4'; q.beginPath(); q.arc(x - .9, yT(u) - 4, 1.1, 0, AY11_PI2); q.fill();
  }
  // iki yatay bant ve aralarında kıvrık sarmallar (lila)
  for (const yb of [-30, -100]) { q.strokeStyle = '#4e3f86'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(X(0), yb); q.lineTo(X(1), yb - 6); q.stroke(); }
  q.strokeStyle = '#c9b4f4'; q.lineWidth = 1.5;
  for (let k = 0; k < 5; k++) {
    const u = (k + .5) / 5, x = X(u), yy = -16 - u * 3, r = 4.2;
    q.beginPath(); q.arc(x, yy, r, Math.PI, Math.PI * 2.6); q.stroke();   // alt sıra: minik sarmallar
    if (k === 2) continue;
    const y2 = -112 - u * 4; q.beginPath(); q.arc(x - sx * 2, y2, 3.6, 0, Math.PI * 1.5, sx < 0); q.stroke();   // üst sıra: kıvrık uçlar
  }
  // ortada çilek kalp madalyon (perspektifle hafif basık) + altın halka
  const mx = X(.5), my = -66;
  q.save(); q.translate(mx, my); q.scale(.78, 1);
  q.strokeStyle = '#e8b958'; q.lineWidth = 2.4; q.beginPath(); q.arc(0, 0, 17, 0, AY11_PI2); q.stroke();
  q.strokeStyle = '#4e3f86'; q.lineWidth = 1.2; q.beginPath(); q.arc(0, 0, 19.5, 0, AY11_PI2); q.stroke();
  q.fillStyle = '#ff7a9a'; q.beginPath(); q.moveTo(0, 9); q.bezierCurveTo(-14, -1, -9, -13, 0, -6); q.bezierCurveTo(9, -13, 14, -1, 0, 9); q.fill();
  q.fillStyle = 'rgba(255,255,255,.6)'; q.beginPath(); q.ellipse(-4.5, -4.5, 2.6, 1.6, -.6, 0, AY11_PI2); q.fill();
  // madalyondan dört yöne kıvrık kollar
  q.strokeStyle = '#c9b4f4'; q.lineWidth = 1.4;
  for (const [ax, ay] of [[0, -1], [0, 1]]) { q.beginPath(); q.moveTo(0, ay * 20); q.quadraticCurveTo(10, ay * 28, 4, ay * 32); q.stroke(); q.beginPath(); q.moveTo(0, ay * 20); q.quadraticCurveTo(-10, ay * 28, -4, ay * 32); q.stroke(); }
  q.restore();
  // kemerli tepe çerçevesi + dış çerçeve (koyu lila, içte açık çizgi)
  q.beginPath(); for (let k = 0; k <= 10; k++) q.lineTo(X(k / 10), yT(k / 10)); for (let k = 10; k >= 0; k--) q.lineTo(X(k / 10), yB(k / 10)); q.closePath();
  q.strokeStyle = '#43357a'; q.lineWidth = 3.4; q.stroke(); q.strokeStyle = 'rgba(214,198,255,.55)'; q.lineWidth = 1; q.stroke();
  // tepede altın hilal + yıldızcık
  const hx = X(.5), hy = yT(.5) - 13;
  q.fillStyle = '#e8b958'; q.beginPath(); q.arc(hx, hy, 7, 0, AY11_PI2); q.fill(); q.fillStyle = 'rgba(120,96,190,1)'; q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(hx + sx * -3.6, hy - 2, 5.8, 0, AY11_PI2); q.fill(); q.globalCompositeOperation = 'source-over';
  q.strokeStyle = '#4e3f86'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(hx, yT(.5) - 1); q.lineTo(hx, hy + 6); q.stroke();
  q.fillStyle = '#fff2c4'; ay11YildizYol(q, X(.5) + sx * 12, hy - 4, 3, .45); q.fill();
  // menteşeler (sütun tarafında, altın)
  for (const yy of [-118, -24]) { q.fillStyle = '#d9a54a'; ay11Yuv(q, gx - (sx > 0 ? 8 : 0), yy - 4, 8, 8, 2); q.fill(); q.fillStyle = '#fff2c4'; q.fillRect(gx - (sx > 0 ? 6 : -2), yy - 3, 2, 2); }
  q.restore();
}

const AY11_P = {};
// ── 1. kapi: bahçe kapısı kemeri, beş ay taşı (ortada hilal kilit taşı) + iki sihirli fener ──
const AY11_KAPI_TAS = [165, 130, 90, 50, 15].map(d => { const a = d * Math.PI / 180; return [Math.cos(a) * 115, -190 - Math.sin(a) * 76]; });
const AY11_KAPI_REN = ['#c39bff', '#9ff0d0', '#eaf4ff', '#ffb3d1', '#a9c8ff'], AY11_KAPI_GEC = [.5, .25, 0, .25, .5];
AY11_P.kapi = {
  renk: '#c39bff', hit: [0, -266], kutu: [-190, -300, 190, 6],
  spr(K) {
    return ay11Cift('kapi', K, -190, -300, 380, 306, q => {
      // kemer
      q.beginPath(); q.ellipse(0, -190, 140, 96, 0, Math.PI, 0); q.ellipse(0, -190, 90, 58, 0, 0, Math.PI, true); q.closePath();
      q.fillStyle = ay11Lin(q, 0, -286, 0, -190, [0, '#d8ccf6', 1, '#a996dc']); q.fill(); q.strokeStyle = 'rgba(90,70,150,.6)'; q.lineWidth = 1.4; q.stroke();
      q.strokeStyle = 'rgba(90,70,150,.4)'; q.lineWidth = 1;
      for (let d = 12; d < 180; d += 14) { const a = d * Math.PI / 180; q.beginPath(); q.moveTo(Math.cos(a) * 90, -190 - Math.sin(a) * 58); q.lineTo(Math.cos(a) * 140, -190 - Math.sin(a) * 96); q.stroke(); }
      // sütunlar
      for (const sx of [-1, 1]) {
        const x0 = sx < 0 ? -140 : 90;
        for (let r = 0; r < 6; r++) { const y = -190 + r * 31; ay11TasBlok(q, x0 + (r % 2 ? 2 : 0), y, 48 - (r % 2 ? 4 : 0), 31, 4); }
        ay11TasBlok(q, x0 - 5, -12, 58, 12, 3); ay11TasBlok(q, x0 - 4, -198, 56, 10, 3);
        // fener kolu (sütunun dışında kıvrık demir)
        const bx = sx * 140;
        q.strokeStyle = '#4b3c7c'; q.lineWidth = 3.2; q.beginPath(); q.moveTo(bx, -150); q.lineTo(bx + sx * 22, -150); q.quadraticCurveTo(bx + sx * 30, -150, bx + sx * 30, -160); q.stroke();
        q.lineWidth = 2; q.beginPath(); q.moveTo(bx, -136); q.quadraticCurveTo(bx + sx * 14, -138, bx + sx * 18, -150); q.stroke();
        // açık bahçe kapısı kanadı (kıvrımlı lila demir)
        ay11KapiKanat(q, sx * 90, sx);
      }
      // kilit taşı ve taş yuvaları
      ay11TasBlok(q, -17, -296, 34, 30, 6);
      AY11_KAPI_TAS.forEach(([x, y], k) => {
        if (k === 2) { q.fillStyle = '#e8eefc'; q.beginPath(); q.arc(x, y + 6, 11, 0, AY11_PI2); q.fill(); q.fillStyle = '#c9baf0'; q.beginPath(); q.arc(x + 5, y + 2, 9.4, 0, AY11_PI2); q.fill(); q.strokeStyle = '#d9a54a'; q.lineWidth = 1.4; q.beginPath(); q.arc(x, y + 6, 11.5, 0, AY11_PI2); q.stroke(); return; }
        q.fillStyle = '#d9a54a'; q.beginPath(); q.arc(x, y, 9.5, 0, AY11_PI2); q.fill();
        q.fillStyle = ay11Rad(q, x - 2, y - 2, 0, 8, [0, '#ffffff', .4, AY11_KAPI_REN[k], 1, '#5a4a8c']); q.beginPath(); q.arc(x, y, 7, 0, AY11_PI2); q.fill();
      });
      // sütun başlarında oyma yıldızlar
      for (const sx of [-1, 1]) { q.fillStyle = '#efe6ff'; ay11YildizYol(q, sx * 115, -94, 7, .45); q.fill(); q.strokeStyle = 'rgba(90,70,150,.5)'; q.lineWidth = 1; q.stroke(); }
    });
  },
  kur(p) { p.s11.ch = -1; p.s11.chT = 4; p.s11.hop = [0, 0]; },
  adim(p, dt) {
    const s = p.s11; if (!p.canli) return;
    if (s.ch >= 0) { s.ch += dt; if (s.ch > 1.6) s.ch = -1; }
    s.chT -= dt; if (s.chT <= 0) { s.chT = 4.5 + Math.random() * 3; if (s.ch < 0) s.ch = 0; }
    s.hop[0] = Math.max(0, s.hop[0] - dt * 1.5); s.hop[1] = Math.max(0, s.hop[1] - dt * 1.5);
  },
  ciz(p, t, L) {
    const K = ay11K(g, 1, 3), c = this.spr(K), s = p.s11;
    ay11KoyL(g, c, p.x, p.y, L);
    for (const sx of [-1, 1]) {   // fenerler (hafif sallanır)
      const hop = s.hop[sx < 0 ? 0 : 1], a = Math.sin(s.t * 1.3 + sx) * .06 + Math.sin(s.t * 9) * .2 * hop;
      g.save(); g.translate(p.x + sx * 170, p.y - 160); g.rotate(a); g.scale(1.25, 1.25); ay11KoyL(g, ay11Fener(ay11K(g, 1.25, 3)), 0, 0, L); g.restore();
    }
  },
  isik(p, t, L) {
    const s = p.s11;
    AY11_KAPI_TAS.forEach(([x, y], k) => {
      const la = ay11Gec(p, AY11_KAPI_GEC[k] + .05); if (la <= 0) return;
      const ch = s.ch >= 0 ? Math.max(0, 1 - Math.abs(s.ch * 5 - k) * .8) : 0, n = .55 + .2 * Math.sin(s.t * 2 + k * 1.3) + ch * .6;
      const X = p.x + x, Y = p.y + y + (k === 2 ? 6 : 0);
      ay11Isik(g, AY11_KAPI_REN[k], X, Y, k === 2 ? 46 : 30, la * n * .7); ay11Isik(g, '#ffffff', X, Y, k === 2 ? 14 : 9, la * (.6 + ch * .4));
    });
    for (const sx of [-1, 1]) {
      const la = ay11Gec(p, .75, .3), hop = s.hop[sx < 0 ? 0 : 1], a = Math.sin(s.t * 1.3 + sx) * .06 + Math.sin(s.t * 9) * .2 * hop;
      const X = p.x + sx * 170 - Math.sin(a) * 26, Y = p.y - 160 + Math.cos(a) * 26 + Math.sin(s.t * 2.2 + sx) * 1.5 - hop * 6;
      ay11Top(g, X, Y, 6, la, t, sx); ay11IsikE(g, '#a9c8ff', p.x + sx * 170, p.y - 3, 90, 14, la * .3);
    }
  },
  ilk(p) { for (const sx of [-1, 1]) burst(p.x + sx * 170, p.y - 134, 10, ['#eaf4ff', '#cfe6ff', '#ffe7a8'], 90, .8, 5); p.s11.ch = 0; p.s11.hop[0] = p.s11.hop[1] = 1; },
  tik(p) { p.s11.ch = 0; p.s11.hop[0] = p.s11.hop[1] = 1; }
};
// ── 2. cesme: ay ışığı fıskiyesi ──
const AY11_CES = [[-28, -100, -64, -40, 26], [28, -100, 64, -40, 26], [-20, -104, -86, -42, 42], [20, -104, 86, -42, 42]];
AY11_P.cesme = {
  renk: '#a9c8ff', hit: [0, -150], kutu: [-120, -320, 120, 6],
  spr(K) {
    return ay11Cift('cesme', K, -110, -172, 220, 178, q => {
      ay11TasBlok(q, -80, -10, 160, 10, 4);
      q.beginPath(); q.moveTo(-94, -40); q.quadraticCurveTo(-90, -6, -60, -6); q.lineTo(60, -6); q.quadraticCurveTo(90, -6, 94, -40); q.closePath();
      q.fillStyle = ay11Lin(q, -94, -40, 94, 0, [0, '#d4c8f4', .5, AY11_TAS.o, 1, AY11_TAS.k]); q.fill(); q.strokeStyle = 'rgba(90,70,150,.6)'; q.lineWidth = 1.2; q.stroke();
      for (const sx of [-60, -30, 0, 30, 60]) { q.fillStyle = '#efe6ff'; ay11YildizYol(q, sx, -22, 4.5, .45); q.fill(); }
      q.fillStyle = '#e2d8fa'; q.beginPath(); q.ellipse(0, -40, 94, 15, 0, 0, AY11_PI2); q.fill(); q.stroke();
      q.fillStyle = '#463e7c'; q.beginPath(); q.ellipse(0, -40, 84, 10.5, 0, 0, AY11_PI2); q.fill();
      // ayak sütunu + üst çanak
      q.fillStyle = ay11Lin(q, -10, 0, 10, 0, [0, '#d6caf6', 1, AY11_TAS.k]); q.beginPath(); q.moveTo(-9, -42); q.lineTo(-6, -98); q.lineTo(6, -98); q.lineTo(9, -42); q.closePath(); q.fill(); q.stroke();
      q.beginPath(); q.ellipse(0, -70, 10, 4, 0, 0, AY11_PI2); q.fill(); q.stroke();
      q.beginPath(); q.moveTo(-36, -102); q.quadraticCurveTo(-30, -86, 0, -86); q.quadraticCurveTo(30, -86, 36, -102); q.closePath(); q.fillStyle = AY11_TAS.o; q.fill(); q.stroke();
      q.fillStyle = '#e2d8fa'; q.beginPath(); q.ellipse(0, -102, 36, 7, 0, 0, AY11_PI2); q.fill(); q.stroke();
      q.fillStyle = '#463e7c'; q.beginPath(); q.ellipse(0, -102, 30, 4.6, 0, 0, AY11_PI2); q.fill();
      q.fillStyle = ay11Altin(q, -3, -130, 3, -104); q.fillRect(-2.5, -126, 5, 24);
      // hilal tepelik
      q.fillStyle = ay11Rad(q, -4, -152, 1, 18, [0, '#fffdf2', .6, '#fff0c4', 1, '#e8c87a']); q.beginPath(); q.arc(0, -146, 16, 0, AY11_PI2); q.fill();
      q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(8, -152, 13, 0, AY11_PI2); q.fill(); q.globalCompositeOperation = 'source-over';
      q.fillStyle = '#4a3328'; q.beginPath(); q.arc(-9, -147, 1.4, 0, AY11_PI2); q.fill();
      q.strokeStyle = '#6a4a2a'; q.lineWidth = 1; q.beginPath(); q.arc(-8, -142, 2.4, .3, 1.9); q.stroke();
    });
  },
  kur(p) { p.s11.fis = 0; },
  adim(p, dt) {
    const s = p.s11; s.tep = Math.max(0, s.tep - dt * .45);
    if (p.canli && p.canT > 3) { s.oz -= dt; if (s.oz <= 0) { s.oz = 5.5 + Math.random() * 3; s.tep = Math.max(s.tep, .8); } }
  },
  ciz(p, t, L) { ay11KoyL(g, this.spr(ay11K(g, 1, 3)), p.x, p.y, L); },
  isik(p, t, L) {
    const s = p.s11, W = ay11Gec(p, .3, .9), x = p.x, y = p.y; if (W <= 0) return;
    const dot = glow('#eaf4ff'), isl = ay11Isilti();
    // havuz suyu: parıltılı yüzey + halkalar
    ay11IsikE(g, '#a9c8ff', x, y - 40, 92, 14, W * .55); ay11IsikE(g, '#a9c8ff', x, y - 102, 36, 6, W * .5);
    g.strokeStyle = '#cfe6ff'; g.lineWidth = 1.4;
    for (let k = 0; k < 2; k++) { const u = (s.t * .5 + k * .5) % 1; g.globalAlpha = W * (1 - u) * .45; g.beginPath(); g.ellipse(x + (k ? 30 : -34), y - 40, 8 + u * 36, 2 + u * 5, 0, 0, AY11_PI2); g.stroke(); }
    // kavisli su yayları
    g.lineWidth = 3;
    for (let a = 0; a < 4; a++) {
      const r = AY11_CES[a], h = r[4] * W * (1 + s.tep * .35);
      g.globalAlpha = W * .22; g.strokeStyle = '#cfe6ff'; g.beginPath(); g.moveTo(x + r[0], y + r[1]); g.quadraticCurveTo(x + (r[0] + r[2]) / 2, y + (r[1] + r[3]) / 2 - h * 2, x + r[2], y + r[3]); g.stroke();
      for (let k = 0; k < 6; k++) {
        const u = (s.t * .85 + k / 6 + a * .13) % 1, px = x + lerp(r[0], r[2], u), py = y + lerp(r[1], r[3], u) - h * 4 * u * (1 - u);
        g.globalAlpha = W * .8; g.drawImage(dot, px - 4, py - 4, 8, 8);
        if (k === 2) { g.globalAlpha = W * .7; g.drawImage(isl, px - 3, py - 3, 6, 6); }
      }
      const tw = .5 + .5 * Math.sin(s.t * 7 + a * 2); g.globalAlpha = W * tw * .8; g.drawImage(isl, x + r[2] - 5, y + r[3] - 6, 10, 10);
    }
    // ortadaki fıskiye (hilalden yükselir)
    const Hj = (34 + 8 * Math.sin(s.t * 2.3)) * W * (1 + s.tep * 1.6), top = y - 158 - Hj;
    g.globalAlpha = W * .45; g.drawImage(dot, x - 7, top, 14, Hj + 12);
    for (let k = 0; k < 8; k++) {
      const u = (s.t * .9 + k / 8) % 1, sd = k % 2 ? 1 : -1, px = x + sd * (8 + k * 2) * u, py = top + 60 * u * u - 6 * u;
      g.globalAlpha = W * (1 - u) * .9; g.drawImage(dot, px - 3.5, py - 3.5, 7, 7);
    }
    g.globalAlpha = 1;
    ay11Isik(g, '#fff4d6', x - 2, y - 146, 36, W * .5); ay11Isik(g, '#cfe6ff', x, top, 22, W * (.4 + s.tep * .4));
    ay11IsikE(g, '#a9c8ff', x, y - 2, 140, 20, W * .3);
  },
  ilk(p) { p.s11.tep = 1; burst(p.x, p.y - 200, 14, ['#eaf4ff', '#cfe6ff', '#9ff0d0'], 140, 1, 6); },
  tik(p) { p.s11.tep = 1; burst(p.x, p.y - 210, 8, ['#eaf4ff', '#cfe6ff'], 100, .8, 5); }
};
// ── 3. cali: budanmış yarasa / kalp / ay çalıları, ışık tozuyla ışıl ışıl ──
const AY11_YAP = ['#4f9a80', '#5fae90', '#3f8270', '#79c6a4', '#8fd8b6'];
function ay11YaprakDoku(q, x0, y0, w, h, tohum) {   // geçerli kırpma içinde yaprak topakları
  const R = rng(tohum); q.fillStyle = '#3f7a68'; q.fillRect(x0, y0, w, h);
  for (let i = 0; i < 90; i++) {
    const x = x0 + R() * w, y = y0 + R() * h, ust = 1 - (y - y0) / h, r = 4 + R() * 5;
    q.fillStyle = AY11_YAP[Math.min(4, (R() * 3 + ust * 2.2) | 0)]; q.beginPath(); q.arc(x, y, r, 0, AY11_PI2); q.fill();
  }
  q.fillStyle = 'rgba(200,255,230,.35)'; for (let i = 0; i < 26; i++) { q.beginPath(); q.arc(x0 + R() * w, y0 + R() * h * .6, 1.4, 0, AY11_PI2); q.fill(); }
}
function ay11Saksi(q) {   // gövde + lila saksı (kök 0, 0)
  q.fillStyle = '#6a4e3a'; q.fillRect(-3.5, -62, 7, 36);
  q.beginPath(); q.moveTo(-24, -28); q.lineTo(24, -28); q.lineTo(18, 0); q.lineTo(-18, 0); q.closePath(); q.fillStyle = ay11Lin(q, -24, 0, 24, 0, [0, '#b89ae8', 1, '#7d5cc4']); q.fill();
  q.strokeStyle = 'rgba(60,40,110,.6)'; q.lineWidth = 1; q.stroke();
  q.fillStyle = ay11Altin(q, -26, -32, 26, -24); ay11Yuv(q, -26, -32, 52, 7, 3); q.fill();
  q.fillStyle = '#ffd27a'; ay11YildizYol(q, 0, -14, 5, .45); q.fill();
}
const AY11_CALI_X = [-130, 0, 130], AY11_CALI_GEC = [.3, 0, .55];
AY11_P.cali = {
  renk: '#9ff0d0', hit: [0, -112], kutu: [-215, -175, 215, 6],
  spr(K, i) {
    if (i === 0) return ay11Cift('caliY', K, -40, -134, 80, 136, q => {   // yarasa: top gövde + kulaklar (kanatlar ayrı)
      q.save(); q.beginPath(); q.arc(0, -96, 28, 0, AY11_PI2); q.moveTo(-20, -116); q.lineTo(-24, -132); q.lineTo(-6, -120); q.moveTo(20, -116); q.lineTo(24, -132); q.lineTo(6, -120); q.clip();
      ay11YaprakDoku(q, -32, -134, 64, 68, 11); q.restore(); ay11Saksi(q);
    });
    if (i === 1) return ay11Cift('caliK', K, -54, -160, 108, 162, q => {
      q.save(); ay11KalpYol(q, 0, -108, 50); q.clip(); ay11YaprakDoku(q, -54, -160, 108, 104, 23); q.restore();
      q.strokeStyle = 'rgba(40,90,70,.5)'; q.lineWidth = 1.2; ay11KalpYol(q, 0, -108, 50); q.stroke(); ay11Saksi(q);
    });
    return ay11Cift('caliA', K, -50, -156, 100, 158, q => {
      q.save(); q.beginPath(); q.arc(0, -106, 46, 0, AY11_PI2); q.clip(); ay11YaprakDoku(q, -48, -154, 96, 96, 37); q.restore();
      q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(20, -116, 38, 0, AY11_PI2); q.fill(); q.globalCompositeOperation = 'source-over';
      ay11Saksi(q);
    });
  },
  kanat(K) {   // yaprak kanat (sol; kök 0, 0)
    return ay11Cift('caliKn', K, -66, -30, 70, 50, q => {
      q.save(); q.beginPath(); q.moveTo(2, -6); q.quadraticCurveTo(-26, -30, -62, -22); q.quadraticCurveTo(-58, -6, -54, 6); q.quadraticCurveTo(-46, 0, -40, 10);
      q.quadraticCurveTo(-31, 4, -24, 14); q.quadraticCurveTo(-14, 8, -6, 14); q.quadraticCurveTo(0, 6, 2, -6); q.closePath(); q.clip();
      ay11YaprakDoku(q, -66, -30, 70, 50, 51); q.restore();
    });
  },
  kur(p) { const s = p.s11; s.hop = [0, 0, 0]; s.isk = []; const R = rng(77); for (let b = 0; b < 3; b++) for (let k = 0; k < 9; k++) s.isk.push([AY11_CALI_X[b] + (R() - .5) * 70, -100 + (R() - .5) * 66, R() * 6, R() < .5 ? '#ffe7a8' : R() < .5 ? '#eaf4ff' : '#ffb3d1']); s.yan = [0, 0, 0]; },
  adim(p, dt) {
    const s = p.s11; for (let b = 0; b < 3; b++) { s.hop[b] = Math.max(0, s.hop[b] - dt * 1.6); if (!s.yan[b] && ay11Gec(p, AY11_CALI_GEC[b]) > .3) { s.yan[b] = 1; s.hop[b] = 1; burst(p.x + AY11_CALI_X[b], p.y - 110, 10, ['#9ff0d0', '#ffe7a8', '#eaf4ff'], 110, .9, 5); } }
    s.tep = Math.max(0, s.tep - dt);
  },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3), T = s.t;
    for (let b = 0; b < 3; b++) {
      const la = ay11Gec(p, AY11_CALI_GEC[b]), x = p.x + AY11_CALI_X[b], hp = Math.sin(s.hop[b] * Math.PI) * .12;
      g.save(); g.translate(x, p.y);
      if (b === 1) { const u = T % 1.6, beat = Math.exp(-(u - .1) * (u - .1) * 200) + .6 * Math.exp(-(u - .35) * (u - .35) * 200), sc = 1 + beat * .06 * la; g.scale(sc - hp * .5, sc + hp); }
      else if (b === 2) { g.rotate(Math.sin(T * 1.1) * .05 * la); g.scale(1 - hp * .5, 1 + hp); }
      else {
        g.scale(1 - hp * .5, 1 + hp);
        const kn = this.kanat(K), f = Math.sin(T * 3.2) * .16 * la + Math.sin(T * 14) * .25 * s.tep;
        for (const sd of [-1, 1]) { g.save(); g.translate(sd * 22, -100); g.scale(sd < 0 ? 1 : -1, 1); g.rotate(-f); ay11KoyL(g, kn, 0, 0, la); g.restore(); }
      }
      ay11KoyL(g, this.spr(K, b), 0, 0, la);
      g.restore();
    }
  },
  isik(p, t, L) {
    const s = p.s11, isl = ay11Isilti();
    for (let b = 0; b < 3; b++) { const la = ay11Gec(p, AY11_CALI_GEC[b]); if (la > 0) ay11Isik(g, '#9ff0d0', p.x + AY11_CALI_X[b], p.y - 100, 80, la * .18); }
    for (let i = 0; i < s.isk.length; i++) {
      const q = s.isk[i], la = ay11Gec(p, AY11_CALI_GEC[(i / 9) | 0] + .1); if (la <= 0) continue;
      const tw = .5 + .5 * Math.sin(s.t * (2.2 + i % 3) + q[2]) + s.tep * .5, X = p.x + q[0], Y = p.y + q[1];
      ay11Isik(g, q[3], X, Y, 9, la * tw * .7); g.globalAlpha = la * tw * .9; g.drawImage(isl, X - 3, Y - 3, 6, 6); g.globalAlpha = 1;
    }
  },
  tik(p, dx) { const s = p.s11; let b = dx < -65 ? 0 : dx > 65 ? 2 : 1; s.hop[b] = 1; s.tep = 1; }
};
// ── 4. pencere: şato kanadının beş yuvarlak penceresi ortadan dışa sıra sıra yanar; içlerinde el sallayan dostlar ──
const AY11_PEN = [[-200, 24, .62], [-100, 28, .32], [0, 36, 0], [100, 28, .32], [200, 24, .62]];   // dx, yarıçap, gecikme
function ay11PenSpr(K, r, orta) {   // taş çerçeve + pervaz (+ minik kabaklar); cam koyu
  return ay11Cift('pen' + r, K, -r - 22, -r - 14, 2 * r + 44, 2 * r + 34, q => {
    q.fillStyle = ay11Lin(q, -r, -r, r, r, [0, '#e4dbfa', .5, AY11_TAS.a, 1, AY11_TAS.k]); q.beginPath(); q.arc(0, 0, r + 9, 0, AY11_PI2); q.fill();
    q.strokeStyle = 'rgba(90,70,150,.55)'; q.lineWidth = 1.2; q.stroke();
    q.lineWidth = 1; for (let k = 0; k < 12; k++) { const a = k / 12 * AY11_PI2; q.beginPath(); q.moveTo(Math.cos(a) * r, Math.sin(a) * r); q.lineTo(Math.cos(a) * (r + 9), Math.sin(a) * (r + 9)); q.stroke(); }
    q.fillStyle = '#231d44'; q.beginPath(); q.arc(0, 0, r, 0, AY11_PI2); q.fill();
    ay11TasBlok(q, -r - 16, r + 5, 2 * r + 32, 9, 4);
    if (!orta) for (const sx of [-1, 1]) {   // pervazda minik kabaklar
      const x = sx * (r - 2); q.fillStyle = '#ffa24d'; q.beginPath(); q.ellipse(x, r + 0.5, 6.5, 5, 0, 0, AY11_PI2); q.fill();
      q.strokeStyle = '#d9772a'; q.lineWidth = .9; q.beginPath(); q.moveTo(x, r - 4); q.lineTo(x, r + 5); q.stroke();
      q.fillStyle = '#6a9a3a'; q.fillRect(x - .9, r - 7, 1.8, 3.5);
    }
  });
}
function ay11PenIc(K, r) {   // yanan pencerenin içi (sıcak altın-pembe ışık)
  return ay11Tuval('penI' + r, K, -r, -r, 2 * r, 2 * r, q => { q.fillStyle = ay11Rad(q, 0, r * .2, 0, r, [0, '#fff6d6', .55, '#ffd88a', 1, '#f2a07a']); q.beginPath(); q.arc(0, 0, r, 0, AY11_PI2); q.fill(); });
}
function ay11Vitray(K, r) {   // ortadaki gül pencere: ay ve yıldız vitrayı
  return ay11Tuval('vitray' + r, K, -r, -r, 2 * r, 2 * r, q => {
    const R = ['#ffb3d1', '#c39bff', '#9ff0d0', '#ffd27a'];
    for (let k = 0; k < 8; k++) { q.fillStyle = R[k % 4]; q.beginPath(); q.moveTo(0, 0); q.arc(0, 0, r, k / 8 * AY11_PI2, (k + 1) / 8 * AY11_PI2); q.closePath(); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,.35)'; q.beginPath(); q.arc(0, 0, r * .62, 0, AY11_PI2); q.fill();
    q.fillStyle = '#fff6da'; q.beginPath(); q.arc(0, 0, r * .4, 0, AY11_PI2); q.fill();
    q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(r * .2, -r * .12, r * .32, 0, AY11_PI2); q.fill(); q.globalCompositeOperation = 'source-over';
    q.strokeStyle = '#3b2f66'; q.lineWidth = 1.6; for (let k = 0; k < 8; k++) { const a = k / 8 * AY11_PI2; q.beginPath(); q.moveTo(Math.cos(a) * r * .62, Math.sin(a) * r * .62); q.lineTo(Math.cos(a) * r, Math.sin(a) * r); q.stroke(); }
    q.beginPath(); q.arc(0, 0, r * .62, 0, AY11_PI2); q.stroke();
  });
}
AY11_P.pencere = {
  renk: '#ffd27a', hit: [0, 5], kutu: [-250, -50, 250, 60],
  kur(p) { p.s11.yan = [0, 0, 0, 0, 0]; p.s11.el = 0; },
  adim(p, dt) {
    const s = p.s11; s.el = Math.max(0, s.el - dt * .5);
    for (let k = 0; k < 5; k++) if (!s.yan[k] && ay11Gec(p, AY11_PEN[k][2] + .05) > .2) { s.yan[k] = 1; burst(p.x + AY11_PEN[k][0], p.y + 5, 10, ['#ffe7a8', '#ffb3d1', '#eaf4ff'], 100, .8, 5); }
  },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3), T = s.t, el = s.el;
    for (let k = 0; k < 5; k++) {
      const [dx, r, d] = AY11_PEN[k], lw = ay11Gec(p, d + .05), x = p.x + dx, y = p.y + 5;
      ay11KoyL(g, ay11PenSpr(K, r, k === 2), x, y, Math.max(.15, lw));
      if (lw <= 0) continue;
      g.globalAlpha = lw; ay11Koy(g, k === 2 ? ay11Vitray(K, r) : ay11PenIc(K, r), x, y);
      // içerideki dostlar (yumuşak mor gölge siluetleri; hayalet beyaz)
      g.globalAlpha = lw * .85; g.fillStyle = '#5a3f86';
      const w = Math.sin(T * (3 + el * 6) + k) * (.5 + el * .5);
      if (k === 0) {   // baş aşağı asılı, kanat sallayan minik yarasa
        const by = y - 6 + Math.sin(T * 1.4) * 1.5;
        g.fillRect(x - .8, y - r, 1.6, r - 12);
        g.beginPath(); g.arc(x, by, 7, 0, AY11_PI2); g.fill();
        g.beginPath(); g.moveTo(x - 4, by + 5); g.lineTo(x - 6, by + 11); g.lineTo(x - 1, by + 7); g.moveTo(x + 4, by + 5); g.lineTo(x + 6, by + 11); g.lineTo(x + 1, by + 7); g.fill();
        g.save(); g.translate(x + 6, by - 1); g.rotate(-.4 + w * .6); g.beginPath(); g.ellipse(7, 0, 8, 4, 0, 0, AY11_PI2); g.fill(); g.restore();
        g.save(); g.translate(x - 6, by - 1); g.rotate(.3); g.beginPath(); g.ellipse(-7, 0, 8, 4, 0, 0, AY11_PI2); g.fill(); g.restore();
        g.fillStyle = '#ffe9a6'; g.beginPath(); g.arc(x - 2.4, by + 1, 1.2, 0, AY11_PI2); g.arc(x + 2.4, by + 1, 1.2, 0, AY11_PI2); g.fill();
      } else if (k === 1) {   // pencereden bakan hayalet dost (aşağıdan süzülür)
        const hy = y + 8 + Math.sin(T * 1.2) * 4;
        g.save(); g.beginPath(); g.arc(x, y, r - 1, 0, AY11_PI2); g.clip();
        g.fillStyle = '#fbf8ff'; g.beginPath(); g.arc(x, hy, 13, Math.PI, 0); g.lineTo(x + 13, hy + 22); g.lineTo(x - 13, hy + 22); g.fill();
        g.fillStyle = '#3a2846'; g.beginPath(); g.arc(x - 4.5, hy - 1, 1.8, 0, AY11_PI2); g.arc(x + 4.5, hy - 1, 1.8, 0, AY11_PI2); g.fill();
        g.fillStyle = 'rgba(255,128,165,.55)'; g.beginPath(); g.arc(x - 8, hy + 3, 2.2, 0, AY11_PI2); g.arc(x + 8, hy + 3, 2.2, 0, AY11_PI2); g.fill();
        g.save(); g.translate(x + 12, hy + 4); g.rotate(-.6 + w * .7); g.fillStyle = '#efe6ff'; g.beginPath(); g.ellipse(4, 0, 5, 3, 0, 0, AY11_PI2); g.fill(); g.restore();
        g.restore();
      } else if (k === 3) {   // el sallayan minik vampir (Vela'nın siluet kuzeni: örgüler + pelerin)
        g.save(); g.beginPath(); g.arc(x, y, r - 1, 0, AY11_PI2); g.clip();
        const vy = y + 4 + Math.abs(Math.sin(T * 2.2)) * -2;
        g.beginPath(); g.moveTo(x - 14, y + r); g.quadraticCurveTo(x, vy - 4, x + 14, y + r); g.fill();
        g.beginPath(); g.arc(x, vy - 6, 8.5, 0, AY11_PI2); g.fill();
        g.beginPath(); g.arc(x - 9, vy - 3, 3.4, 0, AY11_PI2); g.arc(x + 9, vy - 3, 3.4, 0, AY11_PI2); g.fill();
        g.save(); g.translate(x + 7, vy + 4); g.rotate(-1.1 + w * .6); g.fillRect(0, -2, 13, 4); g.beginPath(); g.arc(13, 0, 3, 0, AY11_PI2); g.fill(); g.restore();
        g.fillStyle = '#ffd27a'; ay11YildizYol(g, x, vy - 16, 3.5, .45); g.fill();
        g.restore();
      } else if (k === 4) {   // ayak üstünde ay ışığı küresi + çevresinde dönen minik yarasa
        g.fillRect(x - 1.5, y + 4, 3, r - 6); g.beginPath(); g.ellipse(x, y + r - 3, 7, 2.5, 0, 0, AY11_PI2); g.fill();
        const a = T * 2.4, bx = x + Math.cos(a) * 14, by = y - 4 + Math.sin(a) * 5;
        g.beginPath(); g.arc(bx, by, 3, 0, AY11_PI2); g.fill(); g.beginPath(); g.ellipse(bx - 4, by - 1, 4, 2 * (.5 + .5 * Math.sin(T * 16)), 0, 0, AY11_PI2); g.ellipse(bx + 4, by - 1, 4, 2 * (.5 + .5 * Math.sin(T * 16)), 0, 0, AY11_PI2); g.fill();
      }
      // pencere kayıtları (çapraz kemer)
      g.globalAlpha = Math.max(.5, lw); g.strokeStyle = '#3b2f66'; g.lineWidth = 2;
      if (k !== 2) { g.beginPath(); g.moveTo(x - r, y); g.lineTo(x + r, y); g.moveTo(x, y - r); g.lineTo(x, y + r); g.stroke(); }
      g.globalAlpha = 1;
    }
  },
  isik(p, t, L) {
    const s = p.s11;
    for (let k = 0; k < 5; k++) {
      const [dx, r, d] = AY11_PEN[k], lw = ay11Gec(p, d + .05); if (lw <= 0) continue;
      const x = p.x + dx, y = p.y + 5, n = .85 + .15 * Math.sin(s.t * 3.1 + k * 1.9) + s.el * .3;
      ay11Isik(g, '#ffd27a', x, y, r * 3, lw * .3 * n); ay11Isik(g, k === 2 ? '#ffb3d1' : '#fff2c8', x, y, r * 1.4, lw * .25 * n);
      if (k === 4) ay11Top(g, x, y - 6, 4, lw, t, k);
    }
  },
  ilk(p) { p.s11.el = 1; },
  tik(p) { p.s11.el = 1.6; }
};
// ── 5. bayrak: kule burcundaki direkte çilek flama açılır, süs ipleri dalgalanır ──
const AY11_FLAMA = ['#ff8fb0', '#c39bff', '#9ff0d0', '#ffd27a'];
const AY11_FLAMA_S = ['#8a5a86', '#6c5a9a', '#5a7a8a', '#8a7a6a'];
AY11_P.bayrak = {
  renk: '#ff8fb0', hit: [0, -92], kutu: [-150, -118, 160, 40],
  direk(K) {
    return ay11Cift('direk', K, -14, -112, 28, 132, q => {
      q.fillStyle = ay11Lin(q, -3, 0, 3, 0, [0, '#e6dcff', 1, '#8a76c4']); q.fillRect(-2.6, -86, 5.2, 102);
      q.fillStyle = ay11Altin(q, -8, 8, 8, 18); ay11Yuv(q, -8, 8, 16, 9, 3); q.fill();
      for (const y of [-62, -24]) { q.fillStyle = ay11Altin(q, -5, y, 5, y + 4); ay11Yuv(q, -4.5, y, 9, 4, 2); q.fill(); }
      q.fillStyle = ay11Rad(q, -2, -94, 0, 7, [0, '#fff6d6', .5, '#f2c968', 1, '#b8862e']); q.beginPath(); q.arc(0, -90, 6, 0, AY11_PI2); q.fill();
      q.fillStyle = '#ffe7a8'; ay11YildizYol(q, 0, -103, 7, .45); q.fill(); q.strokeStyle = '#b8862e'; q.lineWidth = .8; q.stroke();
    });
  },
  kur(p) { p.s11.yan = 0; },
  adim(p, dt) { const s = p.s11; s.tep = Math.max(0, s.tep - dt * .6); if (!s.yan && ay11Gec(p, .2) > .3) { s.yan = 1; burst(p.x + 50, p.y - 60, 12, ['#ff8fb0', '#ffd27a', '#eaf4ff'], 120, .9, 6); } },
  ciz(p, t, L) {
    const s = p.s11, x = p.x, y = p.y, T = s.t, K = ay11K(g, 1, 3), la = ay11Gec(p, .15, .9);
    // süs ipleri: direkten burcun iki ucuna; flamalar sırayla açılır, sallanır
    for (const sd of [-1, 1]) {
      const x1 = x + sd * 88, y1 = y + 16, cx = x + sd * 40, cy = y - 12;
      g.strokeStyle = la > .3 ? '#efe2ff' : '#7a6aa0'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y - 64); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke();
      for (let k = 0; k < 6; k++) {
        const u = .13 + k * .15, mu = 1 - u, px = mu * mu * x + 2 * mu * u * cx + u * u * x1, py = mu * mu * (y - 64) + 2 * mu * u * cy + u * u * y1;
        const lk = ay11Gec(p, .45 + k * .1, .3), sc = .55 + .45 * ay11GeriEase(lk), sw = Math.sin(T * 3 + k * 1.3 + sd) * (.12 + .2 * s.tep) * lk;
        g.save(); g.translate(px, py); g.rotate(sw); g.scale(sc, sc);
        g.fillStyle = AY11_FLAMA_S[k % 4]; g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.quadraticCurveTo(2, 9, 0, 15); g.quadraticCurveTo(-2, 9, -6, 0); g.fill();
        if (lk > 0) { g.globalAlpha = lk; g.fillStyle = AY11_FLAMA[(k + (sd > 0 ? 2 : 0)) % 4]; g.fill(); g.globalAlpha = 1; }
        g.restore();
      }
    }
    ay11KoyL(g, this.direk(K), x, y, Math.max(.2, la));
    // flama: sarılıyken direğe dolanmış; açılınca dalgalanan çatal uçlu çilek flama + altın hilal
    const U = p.canli ? clamp(ay11GeriEase(clamp((p.canT - .2) / .9, 0, 1)), 0, 1.08) : 0;
    if (U < .2) { g.globalAlpha = 1 - U / .2; g.fillStyle = '#7a4a72'; ay11Yuv(g, x + 2, y - 80, 9, 40, 4); g.fill(); g.strokeStyle = '#5a3a5a'; g.lineWidth = 1; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x + 2, y - 76 + k * 10); g.lineTo(x + 11, y - 70 + k * 10); g.stroke(); } g.globalAlpha = 1; }
    if (U > .02) {
      const Lf = 100 * U, amp = 6 + 7 * s.tep, hz = 4.2 + 3 * s.tep;
      g.beginPath();
      for (let i = 0; i <= 8; i++) { const f = i / 8, wv = Math.sin(T * hz - i * .75) * f * amp; if (i) g.lineTo(x + 3 + Lf * f, y - 80 + wv + f * 4); else g.moveTo(x + 3, y - 80); }
      const wE = Math.sin(T * hz - 6) * amp; g.lineTo(x + 3 + Lf - 16 * U, y - 59 + wE * .9);
      for (let i = 8; i >= 0; i--) { const f = i / 8, wv = Math.sin(T * hz - i * .75) * f * amp * 1.05; g.lineTo(x + 3 + Lf * f, y - 38 + wv - f * 6); }
      g.closePath(); g.fillStyle = '#ff6f93'; g.fill(); g.strokeStyle = '#ffd27a'; g.lineWidth = 1.6; g.stroke();
      g.strokeStyle = '#ffb3d1'; g.lineWidth = 7; g.beginPath();
      for (let i = 0; i <= 7; i++) { const f = i / 8, wv = Math.sin(T * hz - i * .75) * f * amp; if (i) g.lineTo(x + 3 + Lf * f, y - 59 + wv); else g.moveTo(x + 5, y - 59); }
      g.stroke();
      const w2 = Math.sin(T * hz - 1.5) * .25 * amp;
      g.fillStyle = '#ffe7a8'; g.beginPath(); g.arc(x + 3 + Lf * .22, y - 60 + w2, 8 * Math.min(1, U), 0, AY11_PI2); g.fill();
      g.fillStyle = '#ff8fab'; g.beginPath(); g.arc(x + 7 + Lf * .22, y - 63 + w2, 6.5 * Math.min(1, U), 0, AY11_PI2); g.fill();
    }
  },
  isik(p, t, L) {
    const s = p.s11, la = ay11Gec(p, .15, .9); if (la <= 0) return;
    ay11Isik(g, '#ffe7a8', p.x, p.y - 103, 40, la * (.5 + .2 * Math.sin(s.t * 3))); ay11Isik(g, '#ff8fb0', p.x + 60, p.y - 59, 90, la * .16);
    const isl = ay11Isilti();
    for (const sd of [-1, 1]) for (let k = 0; k < 5; k++) {   // ipteki minik yıldız ışıkları
      const u = .2 + k * .15, mu = 1 - u, px = mu * mu * p.x + 2 * mu * u * (p.x + sd * 40) + u * u * (p.x + sd * 88), py = mu * mu * (p.y - 64) + 2 * mu * u * (p.y - 12) + u * u * (p.y + 16);
      const tw = .5 + .5 * Math.sin(s.t * 4 + k * 1.7 + sd), lk = ay11Gec(p, .5 + k * .1, .3);
      ay11Isik(g, '#fff2c8', px, py, 8, lk * tw * .8); g.globalAlpha = lk * tw; g.drawImage(isl, px - 3, py - 3, 6, 6); g.globalAlpha = 1;
    }
  },
  tik(p) { p.s11.tep = 1; }
};
// ── 6. kule: ön kulenin üç kemerli penceresi + parlayan yıldız amblemi ──
AY11_P.kule = {
  renk: '#ffe7a8', hit: [0, 2], kutu: [-90, -370, 90, 70],
  spr(K) {
    return ay11Cift('kule', K, -86, -40, 172, 102, q => {
      q.fillStyle = ay11Lin(q, 0, -35, 0, 39, [0, '#e4dbfa', 1, AY11_TAS.o]); q.beginPath(); q.arc(0, 2, 37, 0, AY11_PI2); q.fill(); q.strokeStyle = 'rgba(90,70,150,.55)'; q.lineWidth = 1.2; q.stroke();
      q.strokeStyle = '#d9a54a'; q.lineWidth = 2; q.beginPath(); q.arc(0, 2, 31, 0, AY11_PI2); q.stroke();
      q.fillStyle = '#8a7ab8'; ay11YildizYol(q, 0, 2, 25, .46); q.fill();
      for (const [dx, top] of [[-60, -12], [60, -12]]) {
        const w = 13;
        q.fillStyle = ay11Lin(q, dx - w - 6, 0, dx + w + 6, 0, [0, '#e4dbfa', 1, AY11_TAS.k]); q.beginPath(); q.moveTo(dx - w - 6, 56); q.lineTo(dx - w - 6, top); q.arc(dx, top, w + 6, Math.PI, 0); q.lineTo(dx + w + 6, 56); q.closePath(); q.fill(); q.strokeStyle = 'rgba(90,70,150,.55)'; q.lineWidth = 1; q.stroke();
        q.fillStyle = '#231d44'; q.beginPath(); q.moveTo(dx - w, 52); q.lineTo(dx - w, top); q.arc(dx, top, w, Math.PI, 0); q.lineTo(dx + w, 52); q.closePath(); q.fill();
        ay11TasBlok(q, dx - w - 9, 52, 2 * w + 18, 7, 3);
      }
    });
  },
  ic(K) {   // kemerli pencere içi (gümüş-mavi + altın)
    return ay11Tuval('kuleIc', K, -14, -32, 28, 86, q => { q.fillStyle = ay11Lin(q, 0, -32, 0, 52, [0, '#fff6d6', .5, '#cfe6ff', 1, '#8fa8e8']); q.beginPath(); q.moveTo(-13, 52); q.lineTo(-13, -16); q.arc(0, -16, 13, Math.PI, 0); q.lineTo(13, 52); q.closePath(); q.fill(); });
  },
  yildiz(K) { return ay11Tuval('kuleY', K, -30, -30, 60, 60, q => { q.fillStyle = ay11Rad(q, -5, -6, 2, 28, [0, '#ffffff', .4, '#fff0b8', 1, '#f2c968']); ay11YildizYol(q, 0, 0, 26, .47); q.fill(); q.strokeStyle = '#d9a54a'; q.lineWidth = 1.4; q.stroke(); }); },
  kur(p) { p.s11.don = 0; p.s11.yan = 0; },
  adim(p, dt) { const s = p.s11; s.don = Math.max(0, s.don - dt); if (!s.yan && ay11Gec(p, 0) > .4) { s.yan = 1; burst(p.x, p.y - 95, 16, ['#ffe7a8', '#ffffff', '#cfe6ff'], 150, 1, 7); } },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3), x = p.x, y = p.y;
    ay11KoyL(g, this.spr(K), x, y, Math.max(.2, L));
    [[-60, -12, .35], [60, -12, .55]].forEach(([dx, top, d], k) => {
      const lw = ay11Gec(p, d); if (lw <= 0) return;
      g.save(); g.translate(x + dx, y + (top + 16)); g.globalAlpha = lw; ay11Koy(g, this.ic(K), 0, 0); g.restore();
      g.globalAlpha = lw * .9; g.fillStyle = '#ffd27a';   // pencerede sallanan yıldız süsleri
      for (let j = 0; j < 2; j++) { const sx = x + dx + (j ? 5 : -5), sy = y + top + 10 + j * 14, a = Math.sin(s.t * 1.6 + k + j) * .25; g.fillRect(sx - .4, y + top - 12, .8, sy - (y + top - 12) - 4); ay11YildizYol(g, sx + Math.sin(a) * 3, sy, 4.4, .45, 5, a); g.fill(); }
      g.globalAlpha = 1;
    });
    const ls = ay11Gec(p, 0, .5);
    const KT = typeof DEKOR11 !== 'undefined' && DEKOR11.kuleTepe;   // külahın ucunda küçük yıldız (HARITA verir)
    if (KT && ls > 0 && ay11Gor(KT.x - 30, KT.y - 30, KT.x + 30, KT.y + 30)) { g.save(); g.translate(KT.x, KT.y - 12); g.rotate(Math.sin(s.t * 1.1) * .1); g.scale(.55, .55); g.globalAlpha = ls; ay11Koy(g, this.yildiz(K), 0, 0); g.restore(); g.globalAlpha = 1; }
    if (ls > 0) { const sp = s.don > 0 ? (1 - s.don) * AY11_PI2 : 0, sc = 1 + .06 * Math.sin(s.t * 2.4); g.save(); g.translate(x, y - 95); g.rotate(sp + Math.sin(s.t * .8) * .08); g.scale(sc, sc); g.globalAlpha = ls; ay11Koy(g, this.yildiz(K), 0, 0); g.restore(); g.globalAlpha = 1; }
  },
  isik(p, t, L) {
    const s = p.s11, ls = ay11Gec(p, 0, .5), x = p.x, y = p.y - 95;
    const KT = typeof DEKOR11 !== 'undefined' && DEKOR11.kuleTepe;
    if (KT && ls > 0) { ay11Isik(g, '#ffe7a8', KT.x, KT.y - 12, 60, ls * (.35 + .12 * Math.sin(s.t * 2.7))); ay11Isik(g, '#ffffff', KT.x, KT.y - 12, 14, ls * .5); }
    if (ls > 0) {
      ay11Isik(g, '#ffe7a8', x, y, 120, ls * (.32 + .1 * Math.sin(s.t * 2.4))); ay11Isik(g, '#ffffff', x, y, 30, ls * .5);
      const gl = glow('#fff2c8');   // yavaş dönen dört ışın
      g.save(); g.translate(x, y); g.rotate(s.t * .25);
      for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 4 * (k ? 2 : 1)); g.globalAlpha = ls * (.28 + .12 * Math.sin(s.t * 3 + k)); g.drawImage(gl, -4, 2, 8, 190); }
      g.restore(); g.globalAlpha = 1;
    }
    for (const [dx, d] of [[-60, .35], [60, .55]]) { const lw = ay11Gec(p, d); if (lw > 0) ay11Isik(g, '#cfe6ff', p.x + dx, p.y + 20, 50, lw * .3); }
  },
  tik(p) { p.s11.don = 1; burst(p.x, p.y - 95, 8, ['#ffe7a8', '#ffffff'], 90, .7, 5); }
};
// ── 7. fener: köprü fenerleri; önce büyük direk, sonra köprü boyunca dalga dalga yanar ──
const AY11_FEN_SUT = [318, 301, 295, 289, 283, 277, 271];   // sağdan sola yanma sırası
AY11_P.fener = {
  renk: '#a9c8ff', hit: [0, 2], kutu: [-2240, -200, 70, 165],
  direk(K) {
    return ay11Cift('fDirek', K, -10, -124, 44, 128, q => {
      ay11TasBlok(q, -9, -8, 18, 8, 2);
      q.fillStyle = ay11Lin(q, -3, 0, 3, 0, [0, '#8a76c4', 1, '#4b3c7c']); q.fillRect(-3, -112, 6, 106);
      q.fillStyle = ay11Altin(q, -5, -60, 5, -55); q.fillRect(-4.5, -62, 9, 4); q.fillRect(-4.5, -114, 9, 4);
      q.strokeStyle = '#4b3c7c'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(0, -112); q.quadraticCurveTo(14, -120, 26, -114); q.lineTo(26, -108); q.stroke();
      q.lineWidth = 1.6; q.beginPath(); q.moveTo(0, -98); q.quadraticCurveTo(12, -100, 16, -114); q.stroke();
      q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(0, -118, 3, 0, AY11_PI2); q.fill();
    });
  },
  buyuk(K) {
    return ay11Cift('fDirekB', K, -22, 18, 44, 136, q => {
      ay11TasBlok(q, -18, 140, 36, 12, 3);
      q.fillStyle = ay11Lin(q, -5, 0, 5, 0, [0, '#9a88cc', 1, '#4b3c7c']); q.fillRect(-5, 34, 10, 108);
      for (const y of [60, 100]) { q.fillStyle = ay11Altin(q, -7, y, 7, y + 5); ay11Yuv(q, -7, y, 14, 5, 2); q.fill(); }
      q.fillStyle = ay11Altin(q, -16, 26, 16, 36); q.beginPath(); q.moveTo(-16, 28); q.lineTo(16, 28); q.lineTo(7, 38); q.lineTo(-7, 38); q.closePath(); q.fill();
    });
  },
  kur(p) {
    const s = p.s11; s.F = [];
    const yer = c => c >= 267 && c <= 302 ? (ROWS - 17) * T : yuzey(c);
    AY11_FEN_SUT.forEach((c, i) => s.F.push({ dx: nx(c) - p.x, gy: yer(c) - p.y, d: .35 + i * .14, sw: 0, yan: 0 }));
  },
  adim(p, dt) {
    const s = p.s11;
    for (const f of s.F) { f.sw = Math.max(0, f.sw - dt * .7); if (!f.yan && ay11Gec(p, f.d) > .3) { f.yan = 1; burst(p.x + f.dx + 26, p.y + f.gy - 88, 8, ['#eaf4ff', '#cfe6ff', '#ffe7a8'], 80, .7, 5); } }
    s.tep = Math.max(0, s.tep - dt * .7);
  },
  ac(p, f) { return Math.sin(p.s11.t * 1.4 + f.dx * .01) * .07 + Math.sin(p.s11.t * 6) * .35 * f.sw; },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3), fn = ay11Fener(K);
    for (const f of s.F) {
      const x = p.x + f.dx, gy = p.y + f.gy; if (!ay11Gor(x - 30, gy - 130, x + 60, gy + 5)) continue;
      const lf = ay11Gec(p, f.d);
      ay11KoyL(g, this.direk(K), x, gy, Math.max(.2, lf));
      g.save(); g.translate(x + 26, gy - 108); g.rotate(this.ac(p, f)); ay11KoyL(g, fn, 0, 0, Math.max(.2, lf)); g.restore();
    }
    if (ay11Gor(p.x - 40, p.y - 40, p.x + 40, p.y + 160)) {
      ay11KoyL(g, this.buyuk(K), p.x, p.y, Math.max(.2, L));
      g.save(); g.translate(p.x, p.y - 26 - s.tep * 5 * Math.abs(Math.sin(s.t * 10))); g.scale(1.5, 1.5); ay11KoyL(g, ay11Fener(ay11K(g, 1.5, 3)), 0, 0, Math.max(.2, L)); g.restore();
    }
  },
  isik(p, t, L) {
    const s = p.s11, dot = glow('#eaf4ff');
    for (let i = 0; i < s.F.length; i++) {
      const f = s.F[i], lf = ay11Gec(p, f.d); if (lf <= 0) continue;
      const x = p.x + f.dx, gy = p.y + f.gy; if (!ay11Gor(x - 90, gy - 160, x + 120, gy + 10)) continue;
      const a = this.ac(p, f), ox = x + 26 - Math.sin(a) * 21, oy = gy - 108 + Math.cos(a) * 21 + Math.sin(s.t * 2.2 + i) * 1.2;
      ay11Top(g, ox, oy, 4.2, lf, t, i); ay11IsikE(g, '#a9c8ff', x + 26, gy - 2, 70, 11, lf * .3);
      for (let j = 0; j < 2; j++) { const u = (s.t * .35 + j * .5 + i * .17) % 1; g.globalAlpha = lf * Math.sin(u * Math.PI) * .7; g.drawImage(dot, ox + Math.sin(u * 6 + j) * 8 - 2.5, oy - u * 60 - 2.5, 5, 5); }
      g.globalAlpha = 1;
    }
    if (p.canli) { const lb = ay11Gec(p, 0, .3); ay11Top(g, p.x, p.y + 2 - s.tep * 5 * Math.abs(Math.sin(s.t * 10)), 6.5, lb, t, 9); ay11IsikE(g, '#a9c8ff', p.x, p.y + 148, 110, 16, lb * .35); }
  },
  tik(p, dx, dy) {
    const s = p.s11; if (Math.abs(dx) < 40 && dy > -50 && dy < 60) { s.tep = 1; return true; }
    let en = null, b = 60; for (const f of s.F) { const d = Math.abs(dx - f.dx - 26); if (d < b && dy > f.gy - 150 && dy < f.gy) { b = d; en = f; } }
    if (!en) return false; en.sw = 1; return true;
  }
};
// ── 8. kristal: mağara zeminindeki beş kristal kümesi ortadan dışa renk renk yanar ──
const AY11_KR = [[-250, '#c39bff', 70, .5], [-125, '#9ff0d0', 92, .25], [0, '#a9c8ff', 124, 0], [125, '#ffb3d1', 88, .25], [250, '#ffd27a', 66, .5]];
const AY11_PRIZ = [[0, 1, 0, 1], [-15, .68, -.32, .74], [14, .6, .3, .7], [-25, .38, -.62, .55], [25, .36, .58, .5]];
AY11_P.kristal = {
  renk: '#c39bff', hit: [0, 0], kutu: [-320, -140, 320, 90],
  spr(K, k) {
    const [, col, h] = AY11_KR[k], ac = mixc(col, '#ffffff', .6), ko = mixc(col, '#3a2c74', .38);
    return ay11Cift('kr' + k, K, -60, -h - 14, 120, h + 22, q => {
      for (let i = AY11_PRIZ.length - 1; i >= 0; i--) {
        const [dx, hf, a, wf] = AY11_PRIZ[i], hh = h * hf, w = 22 * wf + 6;
        q.save(); q.translate(dx, 2); q.rotate(a);
        q.beginPath(); q.moveTo(-w / 2, 0); q.lineTo(-w / 2, -hh * .78); q.quadraticCurveTo(-w * .15, -hh * .97, 0, -hh); q.lineTo(0, 0); q.closePath(); q.fillStyle = ay11Lin(q, 0, -hh, 0, 0, [0, '#ffffff', .25, ac, 1, col]); q.fill();
        q.beginPath(); q.moveTo(w / 2, 0); q.lineTo(w / 2, -hh * .78); q.quadraticCurveTo(w * .15, -hh * .97, 0, -hh); q.lineTo(0, 0); q.closePath(); q.fillStyle = ay11Lin(q, 0, -hh, 0, 0, [0, ac, .5, col, 1, ko]); q.fill();
        q.strokeStyle = 'rgba(255,255,255,.7)'; q.lineWidth = 1; q.beginPath(); q.moveTo(0, -hh + 2); q.lineTo(0, -2); q.stroke();
        q.strokeStyle = ko; q.lineWidth = 1; q.beginPath(); q.moveTo(-w / 2, 0); q.lineTo(-w / 2, -hh * .78); q.quadraticCurveTo(-w * .15, -hh * .97, 0, -hh); q.quadraticCurveTo(w * .15, -hh * .97, w / 2, -hh * .78); q.lineTo(w / 2, 0); q.stroke();
        q.fillStyle = 'rgba(255,255,255,.55)'; q.beginPath(); q.ellipse(-w * .22, -hh * .55, w * .08, hh * .16, 0, 0, AY11_PI2); q.fill();
        q.restore();
      }
      q.fillStyle = '#5a4a8c'; for (const [rx, rr] of [[-22, 9], [-6, 7], [12, 10], [28, 7]]) { q.beginPath(); q.ellipse(rx, 4, rr, 5, 0, 0, AY11_PI2); q.fill(); }
    });
  },
  kur(p) { const s = p.s11; s.K = AY11_KR.map(([dx]) => { const c = Math.floor((p.x + dx) / T); return { gy: (typeof yuzey === 'function' ? yuzey(c) : p.y + 60) - p.y, fl: 0, r: -1 }; }); },
  adim(p, dt) {
    const s = p.s11;
    s.K.forEach((q, k) => { q.fl = Math.max(0, q.fl - dt * 1.4); if (q.r < 0 && ay11Gec(p, AY11_KR[k][3]) > .2) q.r = 0; if (q.r >= 0 && q.r < 9) q.r += dt; });
  },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3);
    for (let k = 0; k < 5; k++) { const lk = ay11Gec(p, AY11_KR[k][3]); ay11KoyL(g, this.spr(K, k), p.x + AY11_KR[k][0], p.y + s.K[k].gy, lk); }
  },
  isik(p, t, L) {
    const s = p.s11, isl = ay11Isilti();
    for (let k = 0; k < 5; k++) {
      const [dx, col, h, d] = AY11_KR[k], lk = ay11Gec(p, d); if (lk <= 0) continue;
      const q = s.K[k], x = p.x + dx, y = p.y + q.gy, dalga = .5 + .5 * Math.sin(s.t * 1.5 - k * .8), yak = clamp(1 - Math.abs(P.x - x) / 180, 0, 1);
      ay11Isik(g, col, x, y - h * .5, h * 1.25, lk * (.28 + .16 * dalga + .2 * yak + .4 * q.fl));
      ay11IsikE(g, col, x, y - 2, h * 1.2, 14, lk * .3);
      for (let j = 0; j < 2; j++) { const tw = Math.max(0, Math.sin(s.t * 2.3 + k * 1.9 + j * 2.6)), px = x + (j ? 10 : -12), py = y - h * (j ? .55 : .8), r = 5 * tw + 1; g.globalAlpha = lk * tw; g.drawImage(isl, px - r, py - r, r * 2, r * 2); }
      g.globalAlpha = 1;
      if (q.r >= 0 && q.r < 1.2) { const u = q.r / 1.2; g.globalAlpha = (1 - u) * .6 * lk; g.strokeStyle = col; g.lineWidth = 2.5 * (1 - u) + .6; g.beginPath(); g.ellipse(x, y - h * .5, 20 + u * h * 1.3, 14 + u * h * .9, 0, 0, AY11_PI2); g.stroke(); g.globalAlpha = 1; }
    }
  },
  tik(p, dx) {
    const s = p.s11; let en = -1, b = 80; AY11_KR.forEach(([kx], k) => { const d = Math.abs(dx - kx); if (d < b) { b = d; en = k; } });
    if (en < 0) return false; s.K[en].fl = 1; s.K[en].r = 0; burst(p.x + AY11_KR[en][0], p.y + s.K[en].gy - AY11_KR[en][2] * .7, 8, [AY11_KR[en][1], '#ffffff'], 100, .7, 5); return true;
  }
};
// ── 9. avize: mağara tavanından sarkan kristal avize; ışık topları yanar, döner, gökkuşağı benekleri saçar ──
const AY11_GK = ['#ffb3d1', '#ffd27a', '#9ff0d0', '#a9c8ff', '#c39bff', '#ff9fc0', '#e8ff8a', '#cfe6ff'];
AY11_P.avize = {
  renk: '#cfe6ff', hit: [0, 0], kutu: [-320, -130, 320, 230],
  gov(K) {
    return ay11Cift('avize', K, -16, -130, 32, 182, q => {
      q.strokeStyle = '#b8862e'; q.lineWidth = 1.6;
      for (let y = -126; y < -44; y += 8) { q.beginPath(); q.ellipse(0, y + 4, 2.4, 4, 0, 0, AY11_PI2); q.stroke(); }
      q.fillStyle = ay11Altin(q, -12, -46, 12, -28); q.beginPath(); q.moveTo(-12, -30); q.quadraticCurveTo(-11, -46, 0, -46); q.quadraticCurveTo(11, -46, 12, -30); q.closePath(); q.fill();
      q.fillStyle = ay11Altin(q, -5, -30, 5, 10); q.fillRect(-4, -30, 8, 38);
      q.beginPath(); q.ellipse(0, -10, 7, 4, 0, 0, AY11_PI2); q.fill(); q.beginPath(); q.ellipse(0, 10, 9, 5, 0, 0, AY11_PI2); q.fill();
      q.fillStyle = ay11Lin(q, 0, 16, 0, 48, [0, '#ffffff', .5, '#cfe6ff', 1, '#a98ae8']); q.beginPath(); q.moveTo(0, 14); q.quadraticCurveTo(10, 30, 0, 48); q.quadraticCurveTo(-10, 30, 0, 14); q.fill();
      q.strokeStyle = 'rgba(255,255,255,.8)'; q.lineWidth = 1; q.beginPath(); q.moveTo(-2, 20); q.quadraticCurveTo(-5, 30, -2, 40); q.stroke();
    });
  },
  damla(K) { return ay11Tuval('damla', K, -5, -1, 10, 16, q => { q.fillStyle = ay11Lin(q, 0, 0, 0, 14, [0, '#ffffff', .5, '#d9e8ff', 1, '#b39af0']); q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(5, 8, 0, 14); q.quadraticCurveTo(-5, 8, 0, 0); q.fill(); }); },
  kur(p) { p.s11.rot = 0; p.s11.w = 0; },
  adim(p, dt) { const s = p.s11, hedef = .5 * ay11Gec(p, .6, 1.2); s.w += (hedef - s.w) * Math.min(1, dt * 1.2); s.rot += s.w * dt; },
  kol(p, front, t, L) {   // kollar + kadehler + damlalar (front: z > 0)
    const s = p.s11, x = p.x, y = p.y, K = ay11K(g, 1, 3), dm = this.damla(K);
    for (let j = 0; j < 12; j++) {
      const a = s.rot + j * Math.PI / 6 + Math.PI / 12, z = Math.sin(a); if (front !== z > 0) continue;
      const dx = x + Math.cos(a) * 62, dy = y + z * 12 + 16 + (j % 2) * 9;
      g.strokeStyle = '#d9a54a'; g.lineWidth = .8; g.beginPath(); g.moveTo(dx, y + z * 13 + 2); g.lineTo(dx, dy); g.stroke();
      g.drawImage(dm, dx - 4, dy - 1, 8, 13);
    }
    for (let k = 0; k < 6; k++) {
      const a = s.rot + k * Math.PI / 3, z = Math.sin(a); if (front !== z > 0) continue;
      const cx = x + Math.cos(a) * 72, cy = y + z * 15 - 12;
      g.strokeStyle = z > 0 ? '#f2c968' : '#b8862e'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(x + Math.cos(a) * 8, y - 6); g.quadraticCurveTo(x + Math.cos(a) * 54, y + z * 15 + 16, cx, cy + 4); g.stroke();
      g.fillStyle = z > 0 ? '#f2c968' : '#c8963a'; g.beginPath(); g.ellipse(cx, cy + 2, 7, 3, 0, 0, AY11_PI2); g.fill();
      const lo = ay11Gec(p, .15 + k * .1, .3); if (lo < 1) { g.globalAlpha = 1 - lo; g.fillStyle = '#6a6098'; g.beginPath(); g.arc(cx, cy - 5, 5, 0, AY11_PI2); g.fill(); g.globalAlpha = 1; }
    }
  },
  ciz(p, t, L) {
    const s = p.s11, x = p.x, y = p.y; this.kol(p, false, t, L);
    g.strokeStyle = '#b8862e'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, 72, 15, 0, Math.PI, AY11_PI2); g.stroke();
    ay11KoyL(g, this.gov(ay11K(g, 1, 3)), x, y, Math.max(.25, L));
    g.strokeStyle = '#f2c968'; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, 72, 15, 0, 0, Math.PI); g.stroke();
    this.kol(p, true, t, L);
  },
  isik(p, t, L) {
    const s = p.s11, x = p.x, y = p.y, isl = ay11Isilti();
    ay11Isik(g, '#eaf4ff', x, y, 170, L * .2);
    for (let k = 0; k < 6; k++) { const a = s.rot + k * Math.PI / 3, z = Math.sin(a), lo = ay11Gec(p, .15 + k * .1, .3); ay11Top(g, x + Math.cos(a) * 72, y + z * 15 - 17, 4 + z, lo * (.75 + .25 * z), t, k); }
    for (let j = 0; j < 12; j += 2) { const a = s.rot + j * Math.PI / 6 + Math.PI / 12, z = Math.sin(a); if (z < .55) continue; const tw = (z - .55) / .45; g.globalAlpha = L * tw; g.drawImage(isl, x + Math.cos(a) * 62 - 5, y + z * 12 + 22 - 5, 10, 10); g.globalAlpha = 1; }
    const lg = ay11Gec(p, .8, 1);   // gökkuşağı benekleri (prizma)
    if (lg > 0) for (let j = 0; j < 8; j++) { const a = s.rot * 1.3 + j * Math.PI / 4; ay11IsikE(g, AY11_GK[j], x + Math.cos(a) * 280, y + 150 + Math.sin(a) * 70, 26, 18, lg * (.26 + .1 * Math.sin(s.t * 2 + j))); }
  },
  ilk(p) { p.s11.w = .4; },
  tik(p, dx, dy) { if (Math.abs(dx) > 110 || dy > 70) return false; p.s11.w += 3; burst(p.x, p.y + 20, 10, AY11_GK, 140, .9, 5); return true; }
};
// ── 10. hayalet: uyuyan üç hayalet dost uyanır, kıkırdar, el ele halka olup döner ──
const AY11_HAY_REN = ['#ffb3d1', '#9ff0d0', '#c39bff'];
const AY11_HO = { yon: 1, mutlu: 1, kik: 0, alfa: 1, ton: 0, el: 0, uyku: false, isik: 1, isikYok: true };
AY11_P.hayalet = {
  renk: '#ffb3d1', hit: [0, 0], kutu: [-140, -100, 140, 80],
  kur(p) { const s = p.s11; s.rot = 0; s.w = 0; s.kik = [0, 0, 0]; s.kT = 2; s.D = [0, 0, 0, 0, 0, 0]; },
  adim(p, dt) {
    const s = p.s11, la = ay11Gec(p, .4, .6);
    s.w += (.9 * ay11Gec(p, 1, 1) - s.w) * Math.min(1, dt * 1.5); s.rot += s.w * dt;
    for (let k = 0; k < 3; k++) s.kik[k] = Math.max(0, s.kik[k] - dt * .9);
    if (la > .5) { s.kT -= dt; if (s.kT <= 0) { s.kT = 1.8 + Math.random() * 2.5; s.kik[(Math.random() * 3) | 0] = 1; } }
  },
  poz(p, k) {   // k. hayaletin konumu ve derinliği (uykuda kucak kucağa → canlıyken halka)
    const s = p.s11, D = ay11Gec(p, .9, 1), a = s.rot + k * AY11_PI2 / 3 + .5, z = Math.sin(a);
    const bx = (k - 1) * 30, by = k === 1 ? -8 : 4;
    s.D[0] = p.x + lerp(bx, Math.cos(a) * 80, D); s.D[1] = p.y + lerp(by, z * 18 - 6, D) + Math.sin(s.t * 1.6 + k * 2) * 4 * D; s.D[2] = lerp(k === 1 ? 1 : 0, z, D);
    return s.D;
  },
  ciz(p, t, L) {
    const s = p.s11, la = ay11Gec(p, .4, .6), sira = s.D3 || (s.D3 = [0, 1, 2]), zz = s.zz || (s.zz = [0, 0, 0]);
    for (let k = 0; k < 3; k++) { zz[k] = this.poz(p, k)[2]; sira[k] = k; }
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2 - i; j++) if (zz[sira[j]] > zz[sira[j + 1]]) { const q = sira[j]; sira[j] = sira[j + 1]; sira[j + 1] = q; }   // derinliğe göre (arkadan öne)
    for (let n = 0; n < 3; n++) { const k = sira[n];
      const d = this.poz(p, k), x = d[0], y = d[1], sc = 1.22 + .12 * d[2];
      const O = AY11_HO; O.uyku = la < .5; O.kik = s.kik[k]; O.alfa = .55 + .45 * la; O.ton = k + 1; O.el = la > .5 ? Math.max(0, Math.sin(s.t * 2 + k * 2)) * .8 : 0; O.yon = Math.cos(s.rot + k * 2.1) > 0 ? -1 : 1;
      if (typeof hayalet11Ciz === 'function') { try { hayalet11Ciz(g, x, y, sc, s.t + k, O); continue; } catch (e) {} }
      g.globalAlpha = O.alfa; g.fillStyle = '#fbf8ff'; g.beginPath(); g.arc(x, y, 22 * sc, Math.PI, 0); g.lineTo(x + 22 * sc, y + 22 * sc); g.lineTo(x - 22 * sc, y + 22 * sc); g.fill();
      g.fillStyle = '#3a2846'; g.beginPath(); g.arc(x - 6, y - 3, 2, 0, AY11_PI2); g.arc(x + 6, y - 3, 2, 0, AY11_PI2); g.fill(); g.globalAlpha = 1;
    }
    if (la < .5) { const a = 1 - la * 2; for (let j = 0; j < 2; j++) { const u = (s.t * .35 + j * .5) % 1; ay11ZCiz(g, p.x + 26 + u * 16, p.y - 34 - u * 34, 3 + u * 3, Math.sin(u * Math.PI) * .8 * a); } }
  },
  isik(p, t, L) {
    const s = p.s11, la = ay11Gec(p, .4, .6); if (la <= 0) return; const isl = ay11Isilti();
    for (let k = 0; k < 3; k++) {
      const d = this.poz(p, k); ay11Isik(g, AY11_HAY_REN[k], d[0], d[1] + 4, 60, la * (.22 + .25 * s.kik[k]));
      if (s.kik[k] > .3) { const u = 1 - s.kik[k]; for (let j = 0; j < 3; j++) { const a = j * 2.1 + k, r = 4 * s.kik[k]; g.globalAlpha = s.kik[k]; g.drawImage(isl, d[0] + Math.cos(a) * (26 + u * 20) - r, d[1] - 10 + Math.sin(a) * 16 - u * 20 - r, r * 2, r * 2); } g.globalAlpha = 1; }
    }
  },
  ilk(p) { ay11Sfx('hayaletKikir'); p.s11.kik[0] = p.s11.kik[1] = p.s11.kik[2] = 1; },
  tik(p) { const s = p.s11; s.kik[0] = s.kik[1] = s.kik[2] = 1; s.w += 2.5; ay11Sfx('hayaletKikir'); }
};
// ── 11. portre: galerideki aile portreleri uyanır, gülümser, göz kırpar (Vela · Dede ile Nine · Pıtır) ──
const AY11_POR = [
  { dx: -220, dy: 10, rx: 46, ry: 60, d: .4, f: [['kiz', 0, 44, 1.05, 1, 'el']] },
  { dx: 0, dy: 0, rx: 68, ry: 84, d: 0, f: [['dede', -27, 50, .8, 1, 'dur'], ['nine', 27, 50, .84, -1, 'dur']] },
  { dx: 220, dy: 10, rx: 46, ry: 60, d: .6, f: [['bebek', 0, 40, 1.55, -1, 'alkis']] }];
const AY11_VO = { yon: 1, poz: 'dur', mutlu: 0, pelerin: 0, agiz: 0, kirp: 0 };
AY11_P.portre = {
  renk: '#ffd27a', hit: [0, 97], kutu: [-290, -120, 290, 112],
  fon(K, i) { const P0 = AY11_POR[i]; return ay11Cift('porF' + i, K, -P0.rx, -P0.ry, 2 * P0.rx, 2 * P0.ry, q => { q.fillStyle = ay11Rad(q, 0, -P0.ry * .25, 4, P0.ry, [0, '#8a78c8', .55, '#5a4a9c', 1, '#2e2660']); q.beginPath(); q.ellipse(0, 0, P0.rx, P0.ry, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = 'rgba(255,240,200,.25)'; for (let k = 0; k < 7; k++) { ay11YildizYol(q, Math.cos(k * 1.7) * P0.rx * .7, -P0.ry * .5 + Math.sin(k * 2.3) * P0.ry * .3, 2.4, .45); q.fill(); } }, '#1e1a3c', .5); },
  cer(K, i) {
    const P0 = AY11_POR[i], rx = P0.rx, ry = P0.ry;
    return ay11Cift('porC' + i, K, -rx - 20, -ry - 34, 2 * rx + 40, 2 * ry + 52, q => {
      q.beginPath(); q.ellipse(0, 0, rx + 12, ry + 12, 0, 0, AY11_PI2); q.ellipse(0, 0, rx, ry, 0, 0, AY11_PI2, true);
      q.fillStyle = ay11Altin(q, -rx, -ry, rx, ry); q.fill('evenodd'); q.strokeStyle = '#9a6424'; q.lineWidth = 1.2; q.stroke();
      for (let k = 0; k < 28; k++) { const a = k / 28 * AY11_PI2; q.fillStyle = k % 2 ? '#fff1c2' : '#c8963a'; q.beginPath(); q.arc(Math.cos(a) * (rx + 6), Math.sin(a) * (ry + 6), k % 2 ? 1.8 : 1.4, 0, AY11_PI2); q.fill(); }
      // tepede çilek fiyonk, altta minik ay
      for (const sx of [-1, 1]) { q.fillStyle = '#ff6f93'; q.beginPath(); q.moveTo(0, -ry - 14); q.quadraticCurveTo(sx * 18, -ry - 30, sx * 20, -ry - 12); q.quadraticCurveTo(sx * 14, -ry - 4, 0, -ry - 14); q.fill(); q.strokeStyle = '#c23a62'; q.lineWidth = 1; q.stroke(); }
      q.fillStyle = '#ff8fab'; q.beginPath(); q.arc(0, -ry - 14, 5, 0, AY11_PI2); q.fill();
      q.fillStyle = '#fff0c4'; q.beginPath(); q.arc(0, ry + 13, 7, 0, AY11_PI2); q.fill(); q.fillStyle = '#d9a54a'; q.beginPath(); q.arc(3, ry + 11, 6, 0, AY11_PI2); q.fill();
    });
  },
  kur(p) { const s = p.s11; s.kp = [0, 0, 0, 0]; s.kpT = [2, 3.1, 4.3, 5.2]; s.tp = [0, 0, 0]; },
  adim(p, dt) {
    const s = p.s11;
    for (let i = 0; i < 4; i++) { if (s.kp[i] > 0) s.kp[i] = Math.max(0, s.kp[i] - dt); s.kpT[i] -= dt; if (s.kpT[i] <= 0) { s.kpT[i] = 2.5 + Math.random() * 4; s.kp[i] = .22; } }
    for (let i = 0; i < 3; i++) s.tp[i] = Math.max(0, s.tp[i] - dt * .6);
  },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3); let fi = 0;
    for (let i = 0; i < 3; i++) {
      const P0 = AY11_POR[i], lp = ay11Gec(p, P0.d, .6), x = p.x + P0.dx, y = p.y + P0.dy;
      ay11KoyL(g, this.fon(K, i), x, y, lp);
      g.save(); g.beginPath(); g.ellipse(x, y, P0.rx, P0.ry, 0, 0, AY11_PI2); g.clip();
      for (const [kim, fx, fy, sc, yon, poz] of P0.f) {
        const O = AY11_VO, tp = s.tp[i];
        O.yon = yon; O.mutlu = lp; O.kirp = lp < .5 ? 1 : s.kp[fi] > 0 ? 1 : 0; O.agiz = tp > 0 ? .5 + .5 * Math.sin(s.t * 12) : 0; O.pelerin = .2;
        O.poz = tp > 0 || (lp > .5 && i === 2 && Math.sin(s.t * .9) > .6) ? poz : 'dur';
        const bob = lp > .5 ? Math.sin(s.t * 1.8 + fi) * 1.2 : 0;
        if (typeof vampirCiz === 'function') { try { vampirCiz(g, kim, x + fx, y + fy + bob, sc, s.t + fi, O); } catch (e) {} }
        fi++;
      }
      if (lp < .99) { g.globalAlpha = (1 - lp) * .55; g.fillStyle = '#2c2658'; g.fillRect(x - P0.rx, y - P0.ry, 2 * P0.rx, 2 * P0.ry); g.globalAlpha = 1; }
      g.restore();
      ay11KoyL(g, this.cer(K, i), x, y, lp);
    }
  },
  isik(p, t, L) {
    const s = p.s11, isl = ay11Isilti();
    for (let i = 0; i < 3; i++) {
      const P0 = AY11_POR[i], lp = ay11Gec(p, P0.d, .6); if (lp <= 0) continue;
      const x = p.x + P0.dx, y = p.y + P0.dy; ay11IsikE(g, '#ffe7a8', x, y, P0.rx * 1.9, P0.ry * 1.7, lp * (.16 + .1 * s.tp[i]));
      const a = s.t * .9 + i * 2, px = x + Math.cos(a) * (P0.rx + 8), py = y + Math.sin(a) * (P0.ry + 8), tw = .5 + .5 * Math.sin(s.t * 5 + i);
      g.globalAlpha = lp * tw; g.drawImage(isl, px - 5, py - 5, 10, 10); g.globalAlpha = 1;
    }
  },
  ilk(p) { p.s11.tp[0] = p.s11.tp[1] = p.s11.tp[2] = 1.4; },
  tik(p, dx) { let en = 0, b = 1e9; AY11_POR.forEach((P0, i) => { const d = Math.abs(dx - P0.dx); if (d < b) { b = d; en = i; } }); p.s11.tp[en] = 1.6; p.s11.kp[en === 2 ? 3 : en] = .3; return true; }
};
// ── 12. perde: kadife perdeler açılır, pencereden ay ışığı dolar; duvar şamdanlarında sihirli ay ışığı topları ──
const AY11_APL = [[-26, -30], [0, -44], [26, -30]];
AY11_P.perde = {
  renk: '#cfe6ff', hit: [0, -20], kutu: [-205, -175, 205, 210],
  pencere(K) {
    return ay11Cift('perdeP', K, -96, -156, 192, 286, q => {
      const yol = r => { q.beginPath(); q.moveTo(-r, 110); q.lineTo(-r, -60); q.arc(0, -60, r, Math.PI, 0); q.lineTo(r, 110); q.closePath(); };
      yol(92); q.fillStyle = ay11Lin(q, -92, 0, 92, 0, [0, '#e4dbfa', .5, AY11_TAS.a, 1, AY11_TAS.k]); q.fill(); q.strokeStyle = 'rgba(90,70,150,.55)'; q.lineWidth = 1.2; q.stroke();
      yol(80); q.fillStyle = ay11Lin(q, 0, -140, 0, 110, [0, '#1d1840', .6, '#2a2158', 1, '#3a2c74']); q.fill();
      q.save(); yol(80); q.clip();
      q.fillStyle = ay11Rad(q, 24, -50, 10, 90, [0, 'rgba(255,244,214,.55)', 1, 'rgba(255,244,214,0)']); q.fillRect(-80, -140, 160, 250);
      q.fillStyle = '#fff4d6'; q.beginPath(); q.arc(24, -50, 32, 0, AY11_PI2); q.fill();
      q.fillStyle = 'rgba(230,214,170,.5)'; q.beginPath(); q.arc(14, -58, 5, 0, AY11_PI2); q.arc(34, -40, 4, 0, AY11_PI2); q.arc(30, -62, 2.6, 0, AY11_PI2); q.fill();
      q.fillStyle = '#ffffff'; for (const [sx, sy] of [[-50, -90], [-30, -20], [-60, 30], [50, 40], [10, 70], [-20, -110], [60, -100]]) { q.beginPath(); q.arc(sx, sy, 1.4, 0, AY11_PI2); q.fill(); }
      q.fillStyle = 'rgba(80,60,150,.6)'; q.beginPath(); q.moveTo(-80, 110); q.quadraticCurveTo(-30, 60, 10, 80); q.quadraticCurveTo(50, 95, 80, 70); q.lineTo(80, 110); q.fill();
      q.restore();
      q.strokeStyle = '#d9a54a'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, -140); q.lineTo(0, 110); q.moveTo(-80, 0); q.lineTo(80, 0); q.stroke();
      ay11TasBlok(q, -100, 108, 200, 12, 4);
    });
  },
  ust(K) {
    return ay11Cift('perdeU', K, -124, -170, 248, 50, q => {
      q.fillStyle = ay11Altin(q, -120, -166, 120, -160); ay11Yuv(q, -120, -166, 240, 6, 3); q.fill();
      for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 120, -163, 6, 0, AY11_PI2); q.fill(); }
      q.beginPath(); q.moveTo(-112, -160); q.lineTo(112, -160); q.lineTo(112, -140);
      for (let k = 7; k >= 0; k--) { const x0 = -112 + k * 28; q.quadraticCurveTo(x0 + 14, -122, x0, -140); }
      q.closePath(); q.fillStyle = ay11Lin(q, 0, -160, 0, -124, [0, '#e0507e', 1, '#a83262']); q.fill();
      q.strokeStyle = '#ffd27a'; q.lineWidth = 2; q.beginPath(); for (let k = 0; k < 8; k++) { const x0 = -112 + k * 28; q.moveTo(x0, -140); q.quadraticCurveTo(x0 + 14, -122, x0 + 28, -140); } q.stroke();
      q.fillStyle = '#ffd27a'; for (let k = 0; k < 8; k++) { q.beginPath(); q.arc(-98 + k * 28, -128, 2.6, 0, AY11_PI2); q.fill(); }
    });
  },
  aplik(K) {
    return ay11Cift('aplik', K, -36, -56, 72, 92, q => {
      q.fillStyle = ay11Altin(q, -10, -20, 10, 30); q.beginPath(); q.ellipse(0, 6, 9, 22, 0, 0, AY11_PI2); q.fill(); q.strokeStyle = '#9a6424'; q.lineWidth = 1; q.stroke();
      q.fillStyle = '#c39bff'; q.beginPath(); q.arc(0, 6, 4, 0, AY11_PI2); q.fill();
      q.strokeStyle = '#e8b85a'; q.lineWidth = 3;
      for (const [cx, cy] of AY11_APL) { q.beginPath(); q.moveTo(0, 10); q.quadraticCurveTo(cx * 1.2, 16, cx, cy + 8); q.stroke(); }
      for (const [cx, cy] of AY11_APL) { q.fillStyle = ay11Altin(q, cx - 7, cy, cx + 7, cy + 8); q.beginPath(); q.moveTo(cx - 7, cy); q.lineTo(cx + 7, cy); q.lineTo(cx + 3, cy + 8); q.lineTo(cx - 3, cy + 8); q.closePath(); q.fill(); }
    });
  },
  kur(p) { p.s11.yan = 0; },
  adim(p, dt) { const s = p.s11; s.tep = Math.max(0, s.tep - dt * .5); },
  perdeCiz(p, sd, O, T, renk, a) {   // sd: −1 sol, +1 sağ; O: açıklık 0..1
    const s = p.s11, x = p.x, y = p.y, dis = sd * 106, fl = 2.5 + s.tep * 6;
    const ic = yy => { const f = yy < 40 ? lerp(46, 74, (yy + 126) / 166) : lerp(74, 58, (yy - 40) / 82); return sd * lerp(2, f, O) + Math.sin(yy * .05 + T * 1.3 + sd) * fl * (1 - O * .4); };
    g.globalAlpha = a; g.fillStyle = renk; g.beginPath(); g.moveTo(x + dis, y - 126);
    for (let yy = -126; yy <= 122; yy += 31) g.lineTo(x + ic(yy), y + yy);
    g.lineTo(x + dis, y + 122); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(110,26,70,.45)'; g.lineWidth = 3;
    for (const f of [.3, .55, .8]) { g.beginPath(); for (let yy = -126; yy <= 122; yy += 31) { const xx = x + lerp(ic(yy), dis, f); yy === -126 ? g.moveTo(xx, y + yy) : g.lineTo(xx, y + yy); } g.stroke(); }
    g.strokeStyle = 'rgba(255,150,185,.35)'; g.lineWidth = 1.6;
    for (const f of [.4, .66]) { g.beginPath(); for (let yy = -126; yy <= 122; yy += 31) { const xx = x + lerp(ic(yy), dis, f); yy === -126 ? g.moveTo(xx, y + yy) : g.lineTo(xx, y + yy); } g.stroke(); }
    g.strokeStyle = '#ffd27a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + ic(122), y + 122); g.lineTo(x + dis, y + 122); g.stroke();
    if (O > .3) {   // altın kordon + püskül
      const bx = x + lerp(ic(40), dis, .5); g.globalAlpha = a * clamp((O - .3) / .3, 0, 1);
      g.strokeStyle = '#ffd27a'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + ic(40), y + 40); g.quadraticCurveTo(bx, y + 50, x + dis, y + 38); g.stroke();
      g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(bx, y + 47, 4, 0, AY11_PI2); g.fill(); g.beginPath(); g.moveTo(bx - 4, y + 50); g.lineTo(bx + 4, y + 50); g.lineTo(bx + 5, y + 64); g.lineTo(bx - 5, y + 64); g.closePath(); g.fill();
    }
    g.globalAlpha = 1;
  },
  ciz(p, t, L) {
    const s = p.s11, K = ay11K(g, 1, 3), T = s.t, O = p.canli ? clamp(ay11GeriEase(clamp((p.canT - .1) / 1.3, 0, 1)), 0, 1.04) : 0;
    ay11KoyL(g, this.pencere(K), p.x, p.y, L);
    for (const sd of [-1, 1]) { const ap = this.aplik(K); ay11KoyL(g, ap, p.x + sd * 150, p.y - 6, L); }
    for (const sd of [-1, 1]) { this.perdeCiz(p, sd, O, T, '#5c3a6e', 1); if (L > 0) this.perdeCiz(p, sd, O, T, '#c8406f', L); }
    ay11KoyL(g, this.ust(K), p.x, p.y, L);
  },
  isik(p, t, L) {
    const s = p.s11, O = p.canli ? clamp((p.canT - .2) / 1.2, 0, 1) : 0;
    if (O > 0) {   // pencereden süzülen ay ışığı + yerde ışık havuzu
      ay11Isik(g, '#fff4d6', p.x + 24, p.y - 50, 70, O * .35);
      g.save(); g.translate(p.x + 10, p.y - 70); g.rotate(1.45); g.globalAlpha = O * .75; g.drawImage(ay11KoniSpr(), 0, -95, 270, 190); g.restore(); g.globalAlpha = 1;
      ay11IsikE(g, '#cfe6ff', p.x + 40, p.y + 198, 150, 22, O * .4);
    }
    for (const sd of [-1, 1]) AY11_APL.forEach(([cx, cy], j) => {
      const lo = ay11Gec(p, 1.1 + (sd > 0 ? 3 : 0) * .12 + j * .12, .3), hop = s.tep * Math.abs(Math.sin(s.t * 9 + j)) * 5;
      ay11Top(g, p.x + sd * 150 + cx, p.y - 6 + cy - 7 + Math.sin(s.t * 2 + j + sd) * 1.5 - hop, 5, lo, t, j + sd);
    });
  },
  ilk(p) {},
  tik(p) { p.s11.tep = 1; }
};

// ═══════════════════════════════ YOL BOYU OYUNCAKLAR (isteğe bağlı küçük sevinçler) ═══════════════════════════════
// ay11Oyun nesnesi (bolum11.js yerleştirir), o.tur: 'can' (ay çanı; dokununca sallanır, her çan başka nota), 'minder' (yarasa minderi:
// üstüne basan Feza yükseğe hoplar, tepedeki gizli yıldızı alır), 'sandik' (dokununca kapağı açılır, içinden kıkırdayan pastel hayalet
// çıkar), 'portre' (şövaledeki ay yüzlü portre dokununca döner ve üç notalık şarkı söyler), 'kristal' (dokununca renk renk ışık saçar),
// 'kapi' (minik kapının ay tokmağı: tak tak, kapı aralanır, lila yarasa el sallar). Hiçbiri zorunlu değil; her biri tekrar tekrar oynar.
// Çizimler önbellek tuvallerinde (ışık-gölge, ay ışığı kenarı, temas gölgesi pişmiş); karede yalnız drawImage + dönüşüm.
const AY11_OY = { isit: null, isitI: 0, adimT: -1, liste: null };
function ay11OyListe() { return AY11_OY.liste || (AY11_OY.liste = NESNELER.filter(o => o.tip === 'ay11Oyun')); }
function ay11OyTemas(q, w, y) {   // pişmiş temas gölgesi (AO)
  q.fillStyle = ay11Rad(q, 0, y, 0, w, [0, 'rgba(14,8,40,.5)', .6, 'rgba(14,8,40,.22)', 1, 'rgba(14,8,40,0)']);
  q.save(); q.translate(0, y); q.scale(1, .18); q.beginPath(); q.arc(0, 0, w, 0, AY11_PI2); q.fill(); q.restore();
}
function ay11OyRim(q, x0, y0, w, h) {   // pişmiş ışık: sol üstten ay ışığı, sağ altta gölge (yalnız boyalı piksellere)
  q.save(); q.globalCompositeOperation = 'source-atop';
  q.fillStyle = ay11Lin(q, x0, y0, x0 + w * .8, y0 + h, [0, 'rgba(220,236,255,.38)', .35, 'rgba(220,236,255,0)', .6, 'rgba(20,10,50,0)', 1, 'rgba(20,10,50,.38)']);
  q.fillRect(x0, y0, w, h); q.restore();
}
const AY11_OYS = {
  canDirek: K => ay11Tuval('oyCanD', K, -50, -150, 100, 160, q => {
    ay11OyTemas(q, 34, 2);
    q.fillStyle = ay11Lin(q, -5, 0, 5, 0, [0, '#8a76c4', .4, '#c9baf0', 1, '#6f5ca8']); ay11Yuv(q, -4, -128, 8, 130, 4); q.fill();
    q.fillStyle = ay11Altin(q, -14, -6, 14, 4); ay11Yuv(q, -14, -8, 28, 10, 4); q.fill();
    q.strokeStyle = ay11Altin(q, -30, -140, 30, -110); q.lineWidth = 5; q.beginPath(); q.arc(14, -128, 16, Math.PI, Math.PI * 1.9); q.stroke();   // hilal kanca
    q.fillStyle = '#ffe7a8'; ay11YildizYol(q, 0, -136, 7, 3, 5, -Math.PI / 2); q.fill();
    ay11OyRim(q, -50, -150, 100, 160);
  }),
  can: K => ay11Tuval('oyCan', K, -22, -4, 44, 46, q => {   // kök: asıldığı nokta (0, 0)
    q.strokeStyle = '#c9a65a'; q.lineWidth = 2; q.beginPath(); q.moveTo(0, 0); q.lineTo(0, 7); q.stroke();
    q.fillStyle = ay11Lin(q, -16, 0, 16, 0, [0, '#8fa6d8', .3, '#eaf4ff', .55, '#cfe0ff', 1, '#6a7cb8']);
    q.beginPath(); q.moveTo(-6, 8); q.quadraticCurveTo(-8, 10, -10, 22); q.quadraticCurveTo(-14, 32, -18, 34); q.lineTo(18, 34); q.quadraticCurveTo(14, 32, 10, 22); q.quadraticCurveTo(8, 10, 6, 8); q.closePath(); q.fill();
    q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(0, 37, 4.5, 0, AY11_PI2); q.fill();
    q.fillStyle = 'rgba(255,255,255,.7)'; q.beginPath(); q.ellipse(-6, 18, 2, 7, .15, 0, AY11_PI2); q.fill();
    q.fillStyle = '#5a4a9a'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 4, 24, 1.4, 0, AY11_PI2); q.fill(); }
    q.strokeStyle = '#5a4a9a'; q.lineWidth = 1.2; q.beginPath(); q.arc(0, 26, 3, .2, Math.PI - .2); q.stroke();
  }),
  minder: K => ay11Tuval('oyMinder', K, -90, -50, 180, 62, q => {   // kök: zemin ortası
    ay11OyTemas(q, 80, 2);
    q.fillStyle = ay11Lin(q, 0, -40, 0, 0, [0, '#d9c8ff', .5, '#a98ae8', 1, '#7458b8']);
    q.beginPath(); q.moveTo(-82, -14); q.quadraticCurveTo(-74, -42, -54, -26); q.quadraticCurveTo(-40, -44, -26, -28); q.quadraticCurveTo(0, -40, 26, -28);
    q.quadraticCurveTo(40, -44, 54, -26); q.quadraticCurveTo(74, -42, 82, -14); q.quadraticCurveTo(70, 2, 0, 0); q.quadraticCurveTo(-70, 2, -82, -14); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(255,255,255,.45)'; q.lineWidth = 2; q.beginPath(); q.moveTo(-60, -22); q.quadraticCurveTo(0, -34, 60, -22); q.stroke();
    q.fillStyle = '#fff'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 9, -18, 5, 0, AY11_PI2); q.fill(); }
    q.fillStyle = '#3a2a6a'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 9, -17, 3, 0, AY11_PI2); q.fill(); }
    q.fillStyle = '#fff'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 9 - 1, -18.5, 1.1, 0, AY11_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,128,170,.55)'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(sx * 19, -11, 4.5, 2.6, 0, 0, AY11_PI2); q.fill(); }
    q.strokeStyle = '#3a2a6a'; q.lineWidth = 1.6; q.beginPath(); q.arc(0, -12, 5, .3, Math.PI - .3); q.stroke();
    ay11OyRim(q, -90, -50, 180, 52);
  }),
  yildiz: K => ay11Tuval('oyYildiz', K, -26, -26, 52, 52, q => {
    q.fillStyle = ay11Rad(q, 0, 0, 0, 26, [0, 'rgba(255,240,190,.6)', 1, 'rgba(255,220,140,0)']); q.fillRect(-26, -26, 52, 52);
    q.fillStyle = ay11Lin(q, -14, -16, 14, 16, [0, '#fff6c8', .5, '#ffd86a', 1, '#e8a840']); ay11YildizYol(q, 0, 0, 17, 7.5, 5, -Math.PI / 2); q.fill();
    q.fillStyle = '#7a4a2a'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 4, -1, 1.6, 0, AY11_PI2); q.fill(); }
    q.strokeStyle = '#7a4a2a'; q.lineWidth = 1.3; q.beginPath(); q.arc(0, 2, 3, .3, Math.PI - .3); q.stroke();
  }),
  sandik: K => ay11Tuval('oySandik', K, -50, -52, 100, 58, q => {   // gövde; kök zemin ortası
    ay11OyTemas(q, 48, 2);
    q.fillStyle = ay11Lin(q, 0, -44, 0, 0, [0, '#b07ad0', 1, '#6a3e8a']); ay11Yuv(q, -38, -44, 76, 44, 8); q.fill();
    q.fillStyle = ay11Altin(q, -38, -44, 38, 0); for (const x of [-30, 22]) { ay11Yuv(q, x, -44, 8, 44, 3); q.fill(); }
    q.fillStyle = ay11Altin(q, -8, -30, 8, -14); ay11Yuv(q, -8, -32, 16, 16, 5); q.fill();
    q.fillStyle = '#ff7a9a'; ay11KalpYol(q, 0, -24, 4.5); q.fill();
    ay11OyRim(q, -50, -52, 100, 58);
  }),
  kapak: K => ay11Tuval('oyKapak', K, -42, -30, 84, 34, q => {   // kök: menteşe ekseni (arka alt kenar ortası)
    q.fillStyle = ay11Lin(q, 0, -26, 0, 0, [0, '#d8a8f0', 1, '#8a52aa']); q.beginPath(); q.moveTo(-40, 0); q.lineTo(-40, -10); q.quadraticCurveTo(0, -36, 40, -10); q.lineTo(40, 0); q.closePath(); q.fill();
    q.fillStyle = ay11Altin(q, -40, -26, 40, 0); for (const x of [-30, 22]) { q.fillRect(x, -18, 8, 18); }
    q.fillStyle = '#ffe7a8'; ay11YildizYol(q, 0, -12, 6, 2.6, 5, -Math.PI / 2); q.fill();
    ay11OyRim(q, -42, -30, 84, 34);
  }),
  sovale: K => ay11Tuval('oySovale', K, -60, -176, 120, 182, q => {   // şövale + oval çerçeve (cam merkez 0, -110); ön yüz
    ay11OyTemas(q, 44, 2);
    q.strokeStyle = '#7a5030'; q.lineWidth = 6; q.beginPath(); q.moveTo(-30, 0); q.lineTo(-6, -170); q.moveTo(30, 0); q.lineTo(6, -170); q.moveTo(0, 0); q.lineTo(0, -60); q.stroke();
    q.fillStyle = '#9a6a40'; q.fillRect(-34, -58, 68, 7);
    q.fillStyle = ay11Altin(q, -40, -160, 40, -60); q.beginPath(); q.ellipse(0, -110, 40, 50, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = ay11Rad(q, -6, -124, 4, 40, [0, '#4a3e8c', 1, '#241c58']); q.beginPath(); q.ellipse(0, -110, 31, 41, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = '#ffb3d1'; ay11KalpYol(q, 0, -164, 7); q.fill();
    ay11OyRim(q, -60, -176, 120, 182);
  }),
  sovArka: K => ay11Tuval('oySovA', K, -42, -162, 84, 104, q => {
    q.fillStyle = '#a07040'; q.beginPath(); q.ellipse(0, -110, 40, 50, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = '#7a5030'; q.beginPath(); q.ellipse(0, -110, 30, 40, 0, 0, AY11_PI2); q.fill();
    q.fillStyle = '#ffe7a8'; ay11YildizYol(q, 0, -110, 12, 5, 5, -Math.PI / 2); q.fill();
  }),
  ayYuz: K => ay11Tuval('oyAyYuz', K, -26, -26, 52, 52, q => {   // portredeki gülen hilal ay (ağız canlı çizilir)
    q.fillStyle = ay11Rad(q, -6, -8, 2, 26, [0, '#fff8e0', .7, '#ffe7a8', 1, '#f0c070']); q.beginPath(); q.arc(0, 0, 24, 0, AY11_PI2); q.fill();
    q.fillStyle = 'rgba(255,140,170,.5)'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(sx * 12, 5, 4.5, 2.8, 0, 0, AY11_PI2); q.fill(); }
    q.strokeStyle = '#7a4a2a'; q.lineWidth = 2.2; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 8, -4, 4, Math.PI + .3, -.3); q.stroke(); }
  }),
  kristal: K => ay11Tuval('oyKris', K, -44, -110, 88, 116, q => {
    ay11OyTemas(q, 40, 2);
    const parca = (x, h, w, a, c0, c1) => { q.save(); q.translate(x, 0); q.rotate(a); q.fillStyle = ay11Lin(q, -w, 0, w, 0, [0, c1, .45, c0, 1, c1]);
      q.beginPath(); q.moveTo(-w, 2); q.lineTo(-w, -h); q.lineTo(0, -h - w * 1.4); q.lineTo(w, -h); q.lineTo(w, 2); q.closePath(); q.fill();
      q.fillStyle = 'rgba(255,255,255,.45)'; q.beginPath(); q.moveTo(-w * .6, -4); q.lineTo(-w * .6, -h); q.lineTo(-w * .1, -h - w); q.lineTo(-w * .1, -4); q.closePath(); q.fill(); q.restore(); };
    parca(-20, 46, 10, -.35, '#ffd0e6', '#c8648e'); parca(20, 52, 11, .32, '#d8fff0', '#4aa890'); parca(0, 78, 14, 0, '#efe4ff', '#7a5ac8');
    ay11OyRim(q, -44, -110, 88, 116);
  }),
  kapi: K => ay11Tuval('oyKapi', K, -62, -168, 124, 174, q => {   // taş kemer + karanlık iç (kapı kanadı ayrı)
    ay11OyTemas(q, 58, 2);
    q.fillStyle = ay11Lin(q, -56, 0, 56, 0, [0, '#8a76c4', .3, '#c9baf0', 1, '#6f5ca8']); q.beginPath(); q.moveTo(-56, 0); q.lineTo(-56, -110); q.arc(0, -110, 56, Math.PI, 0); q.lineTo(56, 0); q.closePath(); q.fill();
    q.fillStyle = ay11Rad(q, 0, -40, 6, 90, [0, '#ffe0a0', .5, '#d89060', 1, '#3a2458']); q.beginPath(); q.moveTo(-42, 0); q.lineTo(-42, -106); q.arc(0, -106, 42, Math.PI, 0); q.lineTo(42, 0); q.closePath(); q.fill();
    ay11OyRim(q, -62, -168, 124, 174);
  }),
  kanat: K => ay11Tuval('oyKanat', K, -44, -150, 88, 152, q => {   // kapı kanadı (menteşe solda, x = -42); tokmak canlı çizilir
    q.fillStyle = ay11Lin(q, -42, 0, 42, 0, [0, '#8a4a6a', .5, '#b06a8a', 1, '#7a3e5e']); q.beginPath(); q.moveTo(-42, 0); q.lineTo(-42, -106); q.arc(0, -106, 42, Math.PI, 0); q.lineTo(42, 0); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(60,20,40,.4)'; q.lineWidth = 2; for (const x of [-21, 0, 21]) { q.beginPath(); q.moveTo(x, -2); q.lineTo(x, x === 0 ? -146 : -136); q.stroke(); }
    q.fillStyle = ay11Altin(q, -42, -80, -30, -60); for (const y of [-120, -30]) { ay11Yuv(q, -42, y, 26, 7, 3); q.fill(); }
    ay11OyRim(q, -44, -150, 88, 152);
  })
};
const AY11_OY_REN = { can: ['#eaf4ff', '#cfe6ff', '#ffe7a8'], minder: ['#d9c8ff', '#ffb3d1', '#ffffff'], sandik: ['#ffb3d1', '#ffe7a8', '#d9c8ff'],
  portre: ['#ffe7a8', '#fff4d6', '#ffb3d1'], kristal: ['#c39bff', '#9ff0d0', '#ffb3d1', '#eaf4ff'], kapi: ['#ffe7a8', '#d9c8ff'] };
function ay11OyIsit() {   // ısıtma: kare başına bir tuval
  if (!AY11_OY.isit) { const k3 = () => ay11K(null, 1, 3); AY11_OY.isit = Object.keys(AY11_OYS).map(ad => () => AY11_OYS[ad](k3())); }
  if (AY11_OY.isitI < AY11_OY.isit.length) { try { AY11_OY.isit[AY11_OY.isitI](); } catch (e) {} AY11_OY.isitI++; }
}
function ay11OyCal(o, ilk) {   // oyuncağı çalıştır (dokunuş / yanından geçme)
  const Q = o.oy; if (!Q || Q.t < .35) return;
  Q.t = 0; Q.n++; const ren = AY11_OY_REN[o.tur] || AY11_OY_REN.can;
  const hy = o.y - ({ can: 110, minder: 30, sandik: 40, portre: 110, kristal: 60, kapi: 90 }[o.tur] || 60);
  burst(o.x, hy, o.tur === 'kristal' ? 18 : 10, ren, 130, .9, 6);
  if (o.tur === 'can') { Q.sal = 1; ay11Sfx('orgNota', (o.nota || 0) % 6); }
  else if (o.tur === 'sandik') { Q.ac = 1; ay11Sfx('hayaletKikir'); ay11Sfx('satoDokun', 3); }
  else if (o.tur === 'portre') { Q.don = 0; Q.sarki = 0; ay11Sfx('aynaSevin'); }
  else if (o.tur === 'kristal') { Q.yan = 1; ay11Sfx('aynaDon', (Q.n * 3 + (o.nota || 0)) % 12); if (typeof ripples !== 'undefined') ripples.push({ x: o.x, y: hy, r: 0, life: 1.1, small: true }); }
  else if (o.tur === 'kapi') { Q.tak = 0; Q.ac = 0; ay11Sfx('satoDokun', 1); }
  else if (o.tur === 'minder') { Q.ez = 1; ay11Sfx('yarasaPir'); }
  OLAY.emit('ay11Oyun', { o, tur: o.tur, n: Q.n });
}
function ay11OyAdim(dt) {
  if (AY11_OY.adimT === now) return; AY11_OY.adimT = now; ay11OyIsit();
  if (!(dt > 0) || !Number.isFinite(dt)) return; dt = Math.min(dt, .05);
  for (const o of ay11OyListe()) {
    const Q = o.oy; if (!Q) continue; Q.t += dt; Q.zt += dt;
    Q.sal = Math.max(0, Q.sal - dt * .55); Q.yan = Math.max(0, Q.yan - dt * .7); Q.ez = Math.max(0, Q.ez - dt * 3);
    if (o.tur === 'sandik') Q.ac = Q.t < 3.2 ? Math.min(1, Q.ac + dt * 4) : Math.max(0, Q.ac - dt * 2);
    if (o.tur === 'portre' && Q.don >= 0) { Q.don += dt; const k = Math.floor((Q.don - .9) / .38); if (k >= 0 && k < 3 && k >= Q.sarki) { Q.sarki = k + 1; ay11Sfx('orgNota', [0, 2, 4][k] + (Q.n % 2)); } if (Q.don > 3.2) Q.don = -1; }
    if (o.tur === 'kapi' && Q.tak >= 0) { Q.tak += dt; if (Q.tak > .32 && Q.tak - dt <= .32) ay11Sfx('satoDokun', 1); if (Q.tak > 4.4) Q.tak = -1; }
    if (o.tur === 'minder' && typeof P !== 'undefined' && !P.ucus && DURUM === 'oyun') {
      // zıplayıp üstüne KONAN Feza (ya da üstündeyken mindere dokunulursa) yükseğe hoplar; yürüyerek geçen hoplamaz (yol kesilmez)
      const ust = P.ground && Math.abs(P.x - o.x) < 58 && Math.abs(P.y - o.y) < 8, kondu = ust && Q.havada;
      Q.havada = !P.ground;
      if ((kondu || (ust && Q.iste)) && Q.t > .25) {
        P.vy = -1290; P.ground = false; P.dj = true; P.jumpT = 0; P.bounce = true; P.coyote = 0; P.air = 0; ay11OyCal(o); Q.t = 0;
        OLAY.emit('ziplatti', o);
      }
      Q.iste = false;
      if (!Q.alindi && Math.abs(P.x - o.x) < 70 && Math.abs((P.y - 50) - (o.y - o.yH)) < 80) {
        Q.alindi = true; Q.alT = 0; burst(o.x, o.y - o.yH, 28, ['#ffe7a8', '#fff4d6', '#ffb3d1', '#eaf4ff'], 220, 1.4, 9); ay11Sfx('aynaBul'); ay11Sfx('ucusIsik', 3);
        if (typeof ripples !== 'undefined') ripples.push({ x: o.x, y: o.y - o.yH, r: 0, life: 1.4, small: false });
        OLAY.emit('ay11Yildiz', { o, x: o.x, y: o.y - o.yH });
      }
      if (Q.alindi) Q.alT += dt;
    }
  }
}
TUR.kaydet('ay11Oyun', {
  kur(o) { o.oy = o.oy || { t: 9, zt: (o.x * .01) % 6, n: 0, sal: 0, yan: 0, ac: 0, ez: 0, don: -1, sarki: 0, tak: -1, alindi: false, alT: 0 }; o.r = o.tur === 'minder' ? 0 : 46; o.ry = 40; o.yH = o.yH || 340; AY11_OY.liste = null; },
  guncelle(o, dt) { ay11OyAdim(dt); },
  dokun(o) { ay11OyCal(o, true); o.dokundu = false; o.r = 0; },   // yanından ilk geçişte bir kez kendiliğinden; sonra dokunuşla
  ciz(o, tm) {
    const Q = o.oy; if (!Q || !ay11Gor(o.x - 120, o.y - (o.tur === 'minder' ? o.yH + 60 : 220), o.x + 120, o.y + 20)) return;
    const K = ay11K(g, 1, 3), x = o.x, y = o.y, L = typeof dn11Isik === 'function' ? dn11Isik(x) : .5, t = Q.zt;
    if (o.tur === 'can') {
      ay11Koy(g, AY11_OYS.canDirek(K), x, y);
      const a = Math.sin(Q.t * 9) * .55 * Q.sal * Q.sal + Math.sin(t * 1.3) * .04;
      g.save(); g.translate(x + 14, y - 112); g.rotate(a); ay11Koy(g, AY11_OYS.can(K), 0, 0); g.restore();
      g.globalCompositeOperation = 'lighter'; ay11Isik(g, '#cfe6ff', x + 14, y - 86, 44 + Q.sal * 30, .12 + L * .12 + Q.sal * .4);
      if (Q.sal > .1) for (let k = 0; k < 3; k++) { const u = ((Q.t * .8 + k / 3) % 1), r = 5 + 4 * (1 - u); g.globalAlpha = (1 - u) * Q.sal; g.drawImage(ay11Isilti(), x + 14 + Math.sin(k * 2 + u * 6) * 24 - r, y - 100 - u * 70 - r, r * 2, r * 2); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    } else if (o.tur === 'minder') {
      const ez = Math.sin(Q.ez * Math.PI) * Q.ez;
      g.save(); g.translate(x, y); g.scale(1 + ez * .14, 1 - ez * .3); ay11Koy(g, AY11_OYS.minder(K), 0, 0); g.restore();
      // tepedeki gizli yıldız (alınınca minderin üstünde minik yıldız olarak oturur) + Pırıl'ın göstereceği kadar yumuşak bir ışık sütunu
      const sy = Q.alindi ? lerp(y - o.yH, y - 46, smooth(clamp(Q.alT / 1.2, 0, 1))) : y - o.yH + Math.sin(t * 2) * 6, sc = Q.alindi ? lerp(1.3, .6, smooth(clamp(Q.alT / 1.2, 0, 1))) : 1;
      g.globalCompositeOperation = 'lighter';
      if (!Q.alindi) { g.globalAlpha = .1 + .05 * Math.sin(t * 2); g.drawImage(glow('#ffe7a8'), x - 14, y - o.yH, 28, o.yH - 30); g.globalAlpha = 1; }
      ay11Isik(g, '#ffe7a8', x, sy, 50, .3 + .1 * Math.sin(t * 3));
      g.globalCompositeOperation = 'source-over';
      g.save(); g.translate(x, sy); g.rotate(Math.sin(t * 1.6) * .15); g.scale(sc, sc); ay11Koy(g, AY11_OYS.yildiz(K), 0, 0); g.restore();
    } else if (o.tur === 'sandik') {
      const ac = smooth(Q.ac);
      if (ac > .02) {   // içinden kıkırdayan pastel hayalet (yukarı süzülür, sallanır)
        const hy = y - 40 - ac * 70 + Math.sin(Q.t * 5) * 4;
        g.globalCompositeOperation = 'lighter'; ay11Isik(g, '#ffe7a8', x, y - 44, 60, ac * .5); g.globalCompositeOperation = 'source-over';
        if (typeof hayalet11Ciz === 'function') hayalet11Ciz(g, x, hy, .8 * ac + .2, Q.t, { yon: 1, mutlu: 1, kik: 1, alfa: ac });
        else { g.globalAlpha = ac; g.fillStyle = '#fff'; g.beginPath(); g.arc(x, hy, 20, 0, AY11_PI2); g.fill(); g.globalAlpha = 1; }
      }
      ay11Koy(g, AY11_OYS.sandik(K), x, y);
      g.save(); g.translate(x, y - 44); g.rotate(-ac * 1.15 + (ac > .9 ? Math.sin(Q.t * 12) * .04 : 0)); g.translate(0, 0); ay11Koy(g, AY11_OYS.kapak(K), 0, 0); g.restore();
      if (ac < .1 && Math.sin(t * .9) > .96) { g.save(); g.translate(x, y - 46); g.rotate(-.06); ay11Koy(g, AY11_OYS.kapak(K), 0, 0); g.restore(); }   // ara sıra kapak kıpırdar (içinde biri var!)
    } else if (o.tur === 'portre') {
      const d = Q.don >= 0 ? Q.don : 0, u = clamp(d / .9, 0, 1), th = Q.don >= 0 ? smooth(u) * AY11_PI2 : Math.sin(t * .8) * .06, cs = Math.cos(th);
      ay11Koy(g, AY11_OYS.sovale(K), x, y);
      g.save(); g.translate(x, y - 110); g.scale(Math.abs(cs) < .04 ? .04 : cs, 1); g.translate(0, 110);
      if (cs < 0) ay11Koy(g, AY11_OYS.sovArka(K), 0, y - y);
      else {
        g.fillStyle = '#2a2266'; g.beginPath(); g.ellipse(0, -110, 31, 41, 0, 0, AY11_PI2); g.fill();
        ay11Koy(g, AY11_OYS.ayYuz(K), 0, -112);
        const sarkiyor = Q.don > .9 && Q.don < 2.4, ag = sarkiyor ? .5 + .5 * Math.abs(Math.sin(Q.don * 8)) : 0;
        g.fillStyle = '#7a4a2a'; g.beginPath(); if (ag > .05) g.ellipse(0, -104, 4.5, 2 + ag * 4, 0, 0, AY11_PI2); else g.arc(0, -106, 5, .25, Math.PI - .25); ag > .05 ? g.fill() : (g.strokeStyle = '#7a4a2a', g.lineWidth = 2, g.stroke());
      }
      g.restore();
      if (Q.don > .9 && Q.don < 3) {   // uçuşan notalar
        g.fillStyle = '#ffe7a8';
        for (let k = 0; k < 3; k++) { const v = clamp((Q.don - .9 - k * .38) / 1.4, 0, 1); if (v <= 0 || v >= 1) continue; const nx = x + 30 + v * 40 + Math.sin(v * 8 + k) * 8, ny = y - 140 - v * 80;
          g.globalAlpha = 1 - v; g.beginPath(); g.ellipse(nx, ny, 5, 4, -.4, 0, AY11_PI2); g.fill(); g.fillRect(nx + 3.5, ny - 16, 2, 16); }
        g.globalAlpha = 1;
      }
    } else if (o.tur === 'kristal') {
      ay11Koy(g, AY11_OYS.kristal(K), x, y);
      g.globalCompositeOperation = 'lighter';
      const col = ['#c39bff', '#9ff0d0', '#ffb3d1'][Q.n % 3], tw = .7 + .3 * Math.sin(t * 1.4);
      ay11Isik(g, col, x, y - 50, 70 + Q.yan * 60, (.12 + L * .14) * tw + Q.yan * .55);
      if (Q.yan > .05) for (let k = 0; k < 6; k++) { const a = k * 1.047 + Q.t * .8, r = 30 + (1 - Q.yan) * 70, s = 7 * Q.yan; g.globalAlpha = Q.yan; g.drawImage(ay11Isilti(), x + Math.cos(a) * r - s, y - 54 + Math.sin(a) * r * .7 - s, s * 2, s * 2); }
      g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    } else if (o.tur === 'kapi') {
      ay11Koy(g, AY11_OYS.kapi(K), x, y);
      const tk = Q.tak, ac = tk < 0 ? 0 : smooth(clamp((tk - .7) / .5, 0, 1)) * (1 - smooth(clamp((tk - 3.6) / .6, 0, 1)));
      if (ac > .05 && typeof yarasa11Ciz === 'function') yarasa11Ciz(g, x - 6 + ac * 6, y - 70 - Math.sin(clamp(tk - .7, 0, 3) * 2) * 6, .9, Q.t, { kanat: .5 + .5 * Math.sin(Q.t * 10), yon: 1, uyku: 0, mutlu: 1 });
      g.save(); g.translate(x - 42, y); g.scale(1 - ac * .82, 1); g.translate(42, 0); ay11Koy(g, AY11_OYS.kanat(K), 0, 0);
      // ay tokmağı (vuruşta sallanır)
      const vur = tk >= 0 && tk < .7 ? Math.abs(Math.sin(tk * Math.PI / .32)) : 0;
      g.strokeStyle = '#f2c968'; g.lineWidth = 4; g.beginPath(); g.arc(14, -64 + vur * -2, 11, Math.PI * .15 - vur * .5, Math.PI * 1.85 - vur * .5); g.stroke();
      g.fillStyle = '#ffe7a8'; g.beginPath(); g.arc(14, -76, 3.5, 0, AY11_PI2); g.fill(); g.restore();
      if (L > .3 || ac > .1) { g.globalCompositeOperation = 'lighter'; ay11Isik(g, '#ffd27a', x, y - 60, 70, ac * .5 + L * .08); g.globalCompositeOperation = 'source-over'; }
    }
  }
});
// dokunuş: oyuncağın kutusuna basınca çalar (yürümeyi başlatmaz)
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 11 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0) return;
  if (typeof om11MiniAktif === 'function' && om11MiniAktif()) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  for (const o of ay11OyListe()) {
    if (Math.abs(o.x - wx) > (o.tur === 'minder' ? 95 : 80)) continue;
    const h = { minder: 60, can: 150, sandik: 80, portre: 180, kristal: 110, kapi: 160 }[o.tur] || 120;
    if (wy < o.y - h - 20 || wy > o.y + 20) continue;
    e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
    if (o.tur === 'minder') { o.oy.iste = true; if (o.oy.t > .35) { o.oy.ez = 1; ay11Sfx('yarasaPir'); o.oy.t = .2; } return; }
    ay11OyCal(o); return;
  }
}, true);
