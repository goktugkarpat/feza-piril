/* buyukanne.js — Bölüm 9 (Pırıl'ın Ejderha Vadisi): Büyükanne Ejderha (önek bn9). Sahibi: BUYUKANNE. Sözleşme: src/BOLUM9.md.
   1) Ortak çizici buyukanneCiz(c, x, y, s, t, o): Pırıl'ın ailesinden kocaman ama yumuşacık, gözlüklü, örgü atkılı, gülümseyen Büyükanne.
      (x, y) = taban ortası (zemin; 'ucus'ta karnın altı). s = 1 → otururken ≈ 240 birim boy (Feza ≈ 80). BN9_S = önerilen oyun ölçeği.
      o: { yon ±1, poz: 'otur'|'ayakta'|'ucus'|'kucak'|'dans', kanat 0..1 (önden: açıklık · uçuşta: çırpma evresi, o.kanatF verilirse o),
           gulumse 0..1, kolye 0..5 (takılı pul sayısı; o.kolyeMaske bit maskesi verilirse o), isik 0..1, icCek 0..1, konus 0..1 (ağız),
           bakX/bakY −1..1, kolyeGizle (kolye.js kendi kolyesini çizer), sar 0..1 ('kucak': 0 kollar açık "gel!", 1 sımsıkı sarılmış),
           katman: 'arka' | 'on' (kucakta sarılan karakter arada çizilsin diye: 'arka' kollar hariç her şey, 'on' yalnız kollar ve kanat uçları),
           dans 0..1, faz (dans vuruş evresi, sn), aci (uçuşta gövde eğimi, radyan) }
      Dönüş (çağıranın koordinatında): { boynX, boynY, gogusX, gogusY, gen } (KOLYE: zincir ve göğüs noktası, göğüs genişliği).
      buyukanneSirt(i, s, aci, yon, out): uçuş pozunda oturma yerleri (i 0 = Feza, 1..6 yavrular) ve atkı tutunma noktası (out.ex, out.ey).
   2) 'buyukanneBinis' yolculuğu (aşağıda). Karede gradyan/filtre yok: bütün dolgu gradyanları önbellek tuvallerinde. */
'use strict';
const BN9_K = 4;          // yerel çizim birimi → dünya birimi (s = 1)
const BN9_S = 1;          // oyunda (kolye terası, kalkış kayalığı, yuva) önerilen ölçek; uçuşta BN9_SU
const BN9_SU = 0.92;
const BN9_C = { pur: '#c2a6ee', purL: '#e2d2fb', purD: '#9a7dd2', line: '#56398c', kar: '#d8ee8e', karL: '#eef8c0', karD: '#a9cc58',
  ibik: '#4c9a48', ibikL: '#7fc46c', ibikD: '#2c6a2a', kulak: '#c6e25c', kulakL: '#e2f29a', kulakD: '#93b832',
  kanat: '#efc9f2', kanatL: '#fbe6fb', kanatD: '#c99be0', atki: '#ff9fc0', atkiL: '#ffd0e0', atkiD: '#e0709a', atkiS: '#fff1d6', atkiS2: '#ffc29a',
  gozluk: '#d9a640', gozlukL: '#ffe7a0', kas: '#fbf8ff', yanak: 'rgba(255,128,180,0.5)', agiz: '#4a1d4a', dil: '#ff8fb8',
  ad: 'b', gozlukVar: true, atkiVar: true, kolyeVar: true, topuz: true, kirpik: false, ek: null };
let bn9PC = BN9_C;   // etkin palet (aileCiz geçici olarak değiştirir: Pırıl'ın annesi / babası)
const BN9_BICIM = ['yuvarlak', 'yildiz', 'kalp', 'damla', 'ay'];
const BN9_PUL = ['#b89cff', '#6fd8a8', '#ff9fc0', '#7fe0f0', '#ffd27a'];   // kolye.js KOLYE_RENK ile aynı (lila, nane, gül, gök, altın)
function bn9Bicimler() { return typeof KOLYE_BICIM !== 'undefined' && KOLYE_BICIM && KOLYE_BICIM.length === 5 ? KOLYE_BICIM : BN9_BICIM; }
function bn9Renkler() { return typeof KOLYE_RENK !== 'undefined' && KOLYE_RENK && KOLYE_RENK.length === 5 ? KOLYE_RENK : BN9_PUL; }

// ── önbellek tuvalleri: yerel birimde çizilir (BN9_PX piksel / yerel birim), karede yalnız drawImage ──
const BN9_PX = 11;
const bn9Spr = {};
function bn9Tuval(ad, x0, y0, w, h, fn, px) {
  let s = bn9Spr[ad]; if (s) return s;
  const k = px || BN9_PX, c = document.createElement('canvas');
  c.width = Math.max(2, Math.ceil(w * k)); c.height = Math.max(2, Math.ceil(h * k));
  const q = c.getContext('2d'); q.scale(k, k); q.translate(-x0, -y0); q.lineJoin = 'round'; q.lineCap = 'round';
  try { fn(q); } catch (e) { /* yarım kalan çizim yine kullanılır */ }
  return bn9Spr[ad] = { c, x0, y0, w, h };
}
function bn9Koy(c, sp) { c.drawImage(sp.c, sp.x0, sp.y0, sp.w, sp.h); }
function bn9GR(q, x0, y0, r0, x1, y1, r1, ...d) { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); for (let i = 0; i < d.length; i += 2) gr.addColorStop(d[i], d[i + 1]); return gr; }
function bn9GL(q, x0, y0, x1, y1, ...d) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < d.length; i += 2) gr.addColorStop(d[i], d[i + 1]); return gr; }
function bn9Blob(q, arr, fill, line, lw) {   // birleşik yuvarlak dilimler (Pırıl'ın drBlobs'u gibi): önce kalın çizgi, sonra dolgu
  q.strokeStyle = line; q.lineWidth = lw; q.beginPath(); for (let i = 0; i < arr.length; i += 3) { q.moveTo(arr[i] + arr[i + 2], arr[i + 1]); q.arc(arr[i], arr[i + 1], arr[i + 2], 0, 6.2832); } q.stroke();
  q.fillStyle = fill; q.beginPath(); for (let i = 0; i < arr.length; i += 3) { q.moveTo(arr[i] + arr[i + 2], arr[i + 1]); q.arc(arr[i], arr[i + 1], arr[i + 2], 0, 6.2832); } q.fill();
}
function bn9Seritler(q, x0, x1, y0, y1, adim, renk, lw, kav) {   // karın çizgileri (yatay, hafif kavisli)
  q.strokeStyle = renk; q.lineWidth = lw; q.beginPath();
  for (let y = y0; y < y1; y += adim) { q.moveTo(x0, y); q.quadraticCurveTo((x0 + x1) / 2, y + kav, x1, y); } q.stroke();
}
// ── pul biçimleri (kolye) — kolye.js kolyePulCiz varsa o ──
function bn9BicimYol(c, b, r) {
  c.beginPath();
  if (b === 'yildiz') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.5 : r * 1.12; if (i) c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else c.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } c.closePath(); }
  else if (b === 'kalp') { c.moveTo(0, r * 0.95); c.bezierCurveTo(-r * 1.5, -r * 0.1, -r * 0.7, -r * 1.25, 0, -r * 0.45); c.bezierCurveTo(r * 0.7, -r * 1.25, r * 1.5, -r * 0.1, 0, r * 0.95); c.closePath(); }
  else if (b === 'damla') { c.moveTo(0, -r * 1.2); c.bezierCurveTo(r * 0.5, -r * 0.5, r * 0.95, 0, r * 0.95, r * 0.3); c.arc(0, r * 0.3, r * 0.95, 0, Math.PI); c.bezierCurveTo(-r * 0.95, 0, -r * 0.5, -r * 0.5, 0, -r * 1.2); c.closePath(); }
  else if (b === 'ay') { c.arc(0, 0, r, Math.PI * 0.32, Math.PI * 1.68, false); c.bezierCurveTo(-r * 0.05, -r * 0.65, -r * 0.05, r * 0.65, Math.cos(Math.PI * 0.32) * r, Math.sin(Math.PI * 0.32) * r); c.closePath(); }
  else c.arc(0, 0, r, 0, 6.2832);
}
function bn9PulSpr(i) {   // pul: dolgu biçim + parlak kenar + beyaz parıltı (yerel 6×6, merkez 0,0, r = 2)
  const b = bn9Bicimler()[i], col = bn9Renkler()[i];
  return bn9Tuval('pul' + i + b, -3.4, -3.4, 6.8, 6.8, q => {
    q.fillStyle = mixc(col, '#3b2a6e', 0.35); q.save(); q.translate(0.12, 0.2); bn9BicimYol(q, b, 2.25); q.fill(); q.restore();
    q.fillStyle = bn9GR(q, -0.6, -0.8, 0.1, 0, 0, 2.6, 0, mixc(col, '#ffffff', 0.7), 0.55, col, 1, mixc(col, '#5a3d8e', 0.2));
    bn9BicimYol(q, b, 2); q.fill(); q.strokeStyle = mixc(col, '#ffffff', 0.55); q.lineWidth = 0.28; q.stroke();
    q.fillStyle = 'rgba(255,255,255,.9)'; q.beginPath(); q.ellipse(-0.6, -0.75, 0.55, 0.32, -0.6, 0, 6.2832); q.fill();
  }, 24);
}
function bn9YuvaSpr(i) {   // boş kolye yuvası: soluk altın çerçeveli biçim (çocuk hangi pulun geleceğini görsün)
  const b = bn9Bicimler()[i];
  return bn9Tuval('yuva' + i + b, -3.4, -3.4, 6.8, 6.8, q => {
    q.fillStyle = 'rgba(90,61,142,.35)'; bn9BicimYol(q, b, 2.1); q.fill();
    q.strokeStyle = '#e8c070'; q.lineWidth = 0.5; q.stroke(); q.strokeStyle = 'rgba(255,240,200,.6)'; q.lineWidth = 0.2; q.stroke();
  }, 24);
}
function bn9PulCiz(c, x, y, r, i, t, parla) {   // yerel birimde (r ≈ 2) bir pul
  if (typeof kolyePulCiz === 'function') { try { kolyePulCiz(c, x, y, r, bn9Bicimler()[i], t, parla); return; } catch (e) { /* yedek */ } }
  const k = r / 2; c.drawImage(bn9PulSpr(i).c, x - 3.4 * k, y - 3.4 * k, 6.8 * k, 6.8 * k);
}

// ══════════ ÖNDEN GÖRÜNÜŞ (otur, ayakta, kucak, dans) — yerel birim: taban ortası (0,0), yukarı −; s=1 → ×4 dünya ══════════
function bn9GovdeYol(q, ay) {   // armut gövde: aşağısı tombul (ay: ayakta → biraz uzun)
  const u = ay ? -3.5 : 0;
  q.beginPath(); q.moveTo(0, -31 + u);
  q.bezierCurveTo(8, -31 + u, 11.5, -26 + u, 13.8, -19 + u * 0.6); q.bezierCurveTo(17.6, -9, 16.8, -0.8, 0, -0.8);
  q.bezierCurveTo(-16.8, -0.8, -17.6, -9, -13.8, -19 + u * 0.6); q.bezierCurveTo(-11.5, -26 + u, -8, -31 + u, 0, -31 + u); q.closePath();
}
function bn9GovdeOnSpr(ay) {
  return bn9Tuval('govdeOn' + (ay ? 'A' : '') + bn9PC.ad, -19, -37, 38, 38, q => {
    const C = bn9PC;
    q.fillStyle = bn9GR(q, -5, -22, 1, 0, -12, 22, 0, C.purL, 0.55, C.pur, 1, C.purD); bn9GovdeYol(q, ay); q.fill();
    q.save(); bn9GovdeYol(q, ay); q.clip();
    // çizgili karın (Pırıl'ınki gibi; biraz daha krem, yumuşak)
    const ky = ay ? -15.5 : -14;
    q.beginPath(); q.ellipse(0, ky, 10, ay ? 14 : 12.6, 0, 0, 6.2832);
    q.fillStyle = bn9GL(q, -10, 0, 10, 0, 0, C.karD, 0.45, C.kar, 1, C.karL); q.fill();
    q.save(); q.beginPath(); q.ellipse(0, ky, 10, ay ? 14 : 12.6, 0, 0, 6.2832); q.clip();
    bn9Seritler(q, -11, 11, ky - 14, ky + 14, 2.1, 'rgba(120,150,40,.42)', 0.42, 0.9);
    q.restore();
    q.strokeStyle = 'rgba(110,140,40,.7)'; q.lineWidth = 0.55; q.beginPath(); q.ellipse(0, ky, 10, ay ? 14 : 12.6, 0, 0, 6.2832); q.stroke();
    // yumuşak alt gölge ve sol üst parlama (peluş gibi)
    q.fillStyle = 'rgba(90,60,150,.16)'; q.beginPath(); q.ellipse(0, 0.5, 18, 5, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(255,248,255,.45)'; q.lineWidth = 1.3; q.beginPath(); q.ellipse(-1, -16, 13, 13, 0, -2.7, -1.75); q.stroke();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.9; bn9GovdeYol(q, ay); q.stroke();
  });
}
function bn9KanatOnSpr() {   // önden görünen katlı/açık kanat (sağ kanat; kök (0,0), uç sağ-yukarı)
  return bn9Tuval('kanatOn' + bn9PC.ad, -2, -24, 30, 28, q => {
    const C = bn9PC;
    const yol = () => { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(3, -10, 12, -19, 25, -21); q.quadraticCurveTo(24, -14, 21.5, -11.5);
      q.quadraticCurveTo(19.5, -7, 15.5, -6.6); q.quadraticCurveTo(13, -2.4, 8.6, -2.8); q.quadraticCurveTo(5, 1, 0, 0); q.closePath(); };
    q.fillStyle = bn9GL(q, 0, 0, 22, -18, 0, C.kanatD, 0.5, C.kanat, 1, C.kanatL); yol(); q.fill();
    q.save(); yol(); q.clip();
    q.strokeStyle = 'rgba(160,110,200,.45)'; q.lineWidth = 0.5; q.beginPath();
    q.moveTo(1, -1); q.quadraticCurveTo(10, -9, 21.5, -11.5); q.moveTo(1, -1); q.quadraticCurveTo(8, -5, 15.5, -6.6); q.moveTo(1, -0.5); q.quadraticCurveTo(5, -2, 8.6, -2.8); q.stroke();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.8; yol(); q.stroke();
    q.strokeStyle = C.purD; q.lineWidth = 1.6; q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(3, -10, 12, -19, 25, -21); q.stroke();   // kanat kemiği (kalın, yumuşak)
    q.strokeStyle = C.line; q.lineWidth = 0.5; q.stroke();
    q.fillStyle = C.purL; q.beginPath(); q.arc(25, -21, 1.1, 0, 6.2832); q.fill();
  });
}
function bn9KuyrukOnSpr() {   // önden: sağ yandan kıvrılarak çıkan kuyruk (kök (8,-4)), yassı kürek uç, sırt dikenleri
  return bn9Tuval('kuyrukOn' + bn9PC.ad, 4, -24, 30, 26, q => {
    const C = bn9PC;
    q.strokeStyle = C.line; q.lineWidth = 7.4; q.beginPath(); q.moveTo(8, -4); q.bezierCurveTo(18, -1, 27, -4, 26, -12); q.stroke();
    q.strokeStyle = C.pur; q.lineWidth = 6; q.stroke();
    q.strokeStyle = C.purL; q.lineWidth = 1.6; q.beginPath(); q.moveTo(10, -5.2); q.bezierCurveTo(18, -3, 24.5, -5, 24.4, -11); q.stroke();
    bn9Blob(q, [14, -5.6, 1.4, 19, -6.2, 1.5, 23.2, -8.6, 1.4], C.ibik, C.ibikD, 1);
    q.save(); q.translate(26, -13); q.rotate(-0.25);   // kürek uç (kalp gibi yumuşak)
    q.fillStyle = C.ibik; q.strokeStyle = C.ibikD; q.lineWidth = 0.8;
    q.beginPath(); q.moveTo(0, 2); q.bezierCurveTo(-5, -1, -3.6, -7, 0, -5); q.bezierCurveTo(3.6, -7, 5, -1, 0, 2); q.fill(); q.stroke();
    q.strokeStyle = 'rgba(170,230,140,.55)'; q.lineWidth = 0.5; q.beginPath(); q.moveTo(-1.6, -3.8); q.quadraticCurveTo(-2.2, -2, -0.8, -0.5); q.stroke();
    q.restore();
  });
}
function bn9BasOnSpr() {   // önden kafa (göz, gözlük, ağız, yanak hariç): yuvarlak kafa, ibik, beyaz topuz, kulaklar, burun, limon çene
  return bn9Tuval('basOn' + bn9PC.ad, -23, -24, 46, 30, q => {
    const C = bn9PC;
    // kulaklar (yüzgeç, arkası taraklı) — başın arkasında iki yana
    for (const sd of [-1, 1]) {
      q.save(); q.scale(sd, 1); q.translate(12.4, -3.5); q.rotate(0.9);
      q.beginPath(); q.moveTo(-1.6, 1.6); q.quadraticCurveTo(-2.4, -6, -0.8, -12.6); q.quadraticCurveTo(1.8, -11.2, 3.6, -8.8); q.quadraticCurveTo(5.8, -7.8, 6.2, -5); q.quadraticCurveTo(7.8, -3.6, 7.6, -0.8); q.quadraticCurveTo(3.6, 0.8, -1.6, 1.6); q.closePath();
      q.fillStyle = bn9GL(q, 0, 0, 3, -10, 0, C.kulakD, 0.55, C.kulak, 1, C.kulakL); q.fill();
      q.strokeStyle = 'rgba(80,110,20,.85)'; q.lineWidth = 0.65; q.stroke();
      q.strokeStyle = 'rgba(240,255,200,.5)'; q.lineWidth = 0.4; q.beginPath(); q.moveTo(-0.7, 0.2); q.quadraticCurveTo(-1, -5.5, -0.3, -11.4); q.moveTo(-0.2, 0.4); q.quadraticCurveTo(1.8, -4.5, 3.1, -8); q.moveTo(0.4, 0.6); q.quadraticCurveTo(3.2, -2.6, 5.4, -4.4); q.stroke();
      q.restore();
    }
    // ibik: önden üç dilimli yeşil dalga (başın tepesinde, arkada)
    bn9Blob(q, [0, -19.8, 4.4, -4.8, -17.6, 3.6, 4.8, -17.6, 3.6, -8.4, -14, 2.8, 8.4, -14, 2.8], C.ibik, C.ibikD, 1.1);
    q.fillStyle = 'rgba(160,225,130,.55)'; q.beginPath(); q.ellipse(-1.2, -22, 2, 1, -0.3, 0, 6.2832); q.ellipse(-5.4, -19.6, 1.3, 0.8, -0.5, 0, 6.2832); q.ellipse(4.2, -19.8, 1.3, 0.8, 0.3, 0, 6.2832); q.fill();
    // kafa
    const kafa = () => { q.beginPath(); q.ellipse(0, -4, 15, 12.8, 0, 0, 6.2832); };
    q.fillStyle = bn9GR(q, -4, -10, 1, 0, -4, 17, 0, C.purL, 0.6, C.pur, 1, C.purD); kafa(); q.fill();
    q.save(); kafa(); q.clip();
    // limon çene (karına bağlanır)
    q.fillStyle = C.kar; q.beginPath(); q.moveTo(-6.4, 3.2); q.quadraticCurveTo(0, 5.4, 6.4, 3.2); q.quadraticCurveTo(9, 6, 8, 10); q.lineTo(-8, 10); q.quadraticCurveTo(-9, 6, -6.4, 3.2); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(120,150,40,.4)'; q.lineWidth = 0.4; q.beginPath(); q.moveTo(-5.4, 6.4); q.lineTo(5.4, 6.4); q.moveTo(-6.4, 8); q.lineTo(6.4, 8); q.stroke();
    q.strokeStyle = 'rgba(255,248,255,.42)'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, -4, 13.4, 11.2, 0, -2.55, -0.75); q.stroke();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.9; kafa(); q.stroke();
    // tombul burun (açık lila), iki burun deliği
    q.fillStyle = bn9GR(q, 0, 1, 0.5, 0, 1.6, 7, 0, 'rgba(240,226,255,.95)', 0.7, 'rgba(222,200,250,.7)', 1, 'rgba(222,200,250,0)');
    q.beginPath(); q.ellipse(0, 1.8, 7.2, 4.6, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(86,57,140,.3)'; q.lineWidth = 0.5; q.beginPath(); q.moveTo(-5.4, -0.6); q.quadraticCurveTo(-6.8, 1.8, -5.6, 3.8); q.moveTo(5.4, -0.6); q.quadraticCurveTo(6.8, 1.8, 5.6, 3.8); q.stroke();
    q.fillStyle = C.line; q.beginPath(); q.ellipse(-2, 0.8, 0.6, 0.45, 0.3, 0, 6.2832); q.ellipse(2, 0.8, 0.6, 0.45, -0.3, 0, 6.2832); q.fill();
    // beyaz kıvırcık topuz (büyükanne saçı): ibiğin önünde, başın tepesinde
    if (C.topuz) { bn9Blob(q, [0, -15.6, 2.2, -2.1, -14.9, 1.7, 2.1, -14.9, 1.7, -1.1, -17.2, 1.5, 1.2, -17.3, 1.5], '#fbf7ff', '#b9a6dc', 0.7);
    q.strokeStyle = 'rgba(185,166,220,.8)'; q.lineWidth = 0.35; q.beginPath(); q.arc(-0.4, -15.8, 0.9, 0.4, 3.6); q.arc(1.4, -17, 0.6, 2.6, 5.8); q.stroke(); }
  });
}
function bn9AtkiSpr() {   // örgü atkı: boyunda bant (ilmekli, çizgili) + düğüm; yerel: bant ortası (0,0)
  return bn9Tuval('atki', -13, -5, 26, 10, q => {
    const C = bn9PC;
    const bant = () => { q.beginPath(); q.moveTo(-11.6, -2.6); q.quadraticCurveTo(0, -0.6, 11.6, -2.6); q.quadraticCurveTo(12.6, 0.2, 11.2, 2.6); q.quadraticCurveTo(0, 5.2, -11.2, 2.6); q.quadraticCurveTo(-12.6, 0.2, -11.6, -2.6); q.closePath(); };
    q.fillStyle = C.atki; bant(); q.fill();
    q.save(); bant(); q.clip();
    for (let i = -6; i <= 6; i++) { const x = i * 2; q.fillStyle = i % 3 === 0 ? C.atkiS : i % 3 === 1 || i % 3 === -2 ? C.atki : C.atkiS2; q.fillRect(x - 1, -6, 2, 12); }
    q.strokeStyle = 'rgba(180,70,110,.35)'; q.lineWidth = 0.32;   // örgü ilmekleri (küçük v'ler)
    q.beginPath(); for (let x = -12; x <= 12; x += 1) for (let y = -3; y <= 4; y += 1.5) { q.moveTo(x - 0.45, y - 0.4 + x * x * 0.006); q.lineTo(x, y + 0.2 + x * x * 0.006); q.lineTo(x + 0.45, y - 0.4 + x * x * 0.006); } q.stroke();
    q.fillStyle = 'rgba(120,40,80,.18)'; q.fillRect(-13, 1.6, 26, 4);
    q.restore();
    q.strokeStyle = C.atkiD; q.lineWidth = 0.6; bant(); q.stroke();
  });
}
function bn9AtkiUcSpr() {   // atkının sarkan ucu: çizgili, ilmekli, saçaklı (kök (0,0), aşağı iner)
  return bn9Tuval('atkiUc', -4.4, -1, 8.8, 17, q => {
    const C = bn9PC;
    const yol = () => { q.beginPath(); q.moveTo(-2.6, 0); q.quadraticCurveTo(-3.4, 6, -2.8, 12.4); q.lineTo(2.8, 12.6); q.quadraticCurveTo(3.4, 6, 2.6, 0); q.closePath(); };
    q.fillStyle = C.atki; yol(); q.fill();
    q.save(); yol(); q.clip();
    for (let i = 0; i < 7; i++) { q.fillStyle = i % 3 === 0 ? C.atkiS : i % 3 === 1 ? C.atki : C.atkiS2; q.fillRect(-4, i * 1.9, 8, 1.9); }
    q.strokeStyle = 'rgba(180,70,110,.35)'; q.lineWidth = 0.3; q.beginPath();
    for (let y = 0.5; y < 13; y += 1.3) for (let x = -2.5; x <= 2.5; x += 1.2) { q.moveTo(x - 0.4, y - 0.35); q.lineTo(x, y + 0.2); q.lineTo(x + 0.4, y - 0.35); } q.stroke();
    q.restore();
    q.strokeStyle = C.atkiD; q.lineWidth = 0.55; yol(); q.stroke();
    q.strokeStyle = C.atkiD; q.lineWidth = 0.7;   // saçaklar
    for (let x = -2.4; x <= 2.5; x += 0.8) { q.beginPath(); q.moveTo(x, 12.4); q.lineTo(x + 0.15, 15); q.stroke(); }
    q.strokeStyle = C.atkiL; q.lineWidth = 0.35; for (let x = -2.4; x <= 2.5; x += 0.8) { q.beginPath(); q.moveTo(x, 12.6); q.lineTo(x + 0.15, 14.6); q.stroke(); }
  });
}
// canlı (ucuz, tek renk) yüz parçaları
function bn9Goz(c, x, y, rx, ry, bakX, bakY, kirp, mutlu, yari) {
  const C = bn9PC;
  if (mutlu > 0.55 || kirp < 0.18) {   // mutlu kapalı göz (^ ^) / kırpma
    c.strokeStyle = '#1c1228'; c.lineWidth = 0.95; c.beginPath();
    if (mutlu > 0.55) { c.moveTo(x - rx * 0.9, y + 0.8); c.quadraticCurveTo(x, y - ry * 0.8, x + rx * 0.9, y + 0.8); }
    else { c.moveTo(x - rx, y); c.quadraticCurveTo(x, y + ry * 0.45, x + rx, y); }
    c.stroke(); return;
  }
  const sy = Math.min(1, kirp) * (1 - 0.38 * yari);
  c.save(); c.translate(x, y); c.scale(1, sy);
  c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, 6.2832); c.fill();
  const ox = bakX * rx * 0.22, oy = bakY * ry * 0.16 + ry * 0.08;
  c.save(); c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, 6.2832); c.clip();
  c.fillStyle = '#3f9a32'; c.beginPath(); c.ellipse(ox, oy, rx * 0.78, ry * 0.82, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#8fd860'; c.beginPath(); c.ellipse(ox, oy + ry * 0.35, rx * 0.6, ry * 0.42, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#0d0a12'; c.beginPath(); c.ellipse(ox, oy + ry * 0.04, rx * 0.4, ry * 0.48, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(ox - rx * 0.24, oy - ry * 0.3, rx * 0.27, ry * 0.23, 0, 0, 6.2832); c.fill();
  c.beginPath(); c.arc(ox + rx * 0.3, oy + ry * 0.36, rx * 0.11, 0, 6.2832); c.fill();
  if (yari > 0.02) { c.fillStyle = C.pur; c.fillRect(-rx - 1, -ry - 1, rx * 2 + 2, ry * (0.2 + 0.55 * yari) + 1); }   // dalgın göz kapağı
  c.restore();
  c.strokeStyle = '#1c1228'; c.lineWidth = 0.9; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, Math.PI * 1.06, Math.PI * 1.96); c.stroke();
  c.restore();
}
function bn9Agiz(c, x, y, w, gul, konus, t) {
  const C = bn9PC; c.lineCap = 'round'; c.lineJoin = 'round';
  const ac = Math.max(konus > 0.02 ? konus * (0.45 + 0.55 * Math.abs(Math.sin(t * 13))) : 0, gul > 0.7 ? (gul - 0.7) / 0.3 * 0.75 : 0);
  if (ac > 0.06) {
    const d = 0.8 + ac * 3.6;
    c.fillStyle = C.agiz; c.beginPath(); c.moveTo(x + w, y - 0.4); c.quadraticCurveTo(x, y + d * 1.25, x - w, y - 0.4); c.quadraticCurveTo(x, y + 0.6, x + w, y - 0.4); c.fill();
    if (d > 1.8) { c.save(); c.beginPath(); c.moveTo(x + w, y - 0.4); c.quadraticCurveTo(x, y + d * 1.25, x - w, y - 0.4); c.closePath(); c.clip(); c.fillStyle = C.dil; c.beginPath(); c.ellipse(x, y + d * 0.85, w * 0.55, d * 0.35, 0, 0, 6.2832); c.fill(); c.restore(); }
  } else {
    c.strokeStyle = '#1c1228'; c.lineWidth = 0.85; c.beginPath(); c.moveTo(x - w, y - 0.6 - gul * 0.4); c.quadraticCurveTo(x, y + 0.6 + gul * 1.2, x + w, y - 0.6 - gul * 0.4); c.stroke();
  }
  // iki minik yumuşak diş (aile çizgisi)
  c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(70,50,90,.55)'; c.lineWidth = 0.3;
  for (const sx of [-0.5, 0.5]) { const fx = x + sx * w, fy = y - 0.2 + 0.2; c.beginPath(); c.moveTo(fx - 0.55, fy); c.lineTo(fx + 0.55, fy); c.lineTo(fx, fy + 1.3); c.closePath(); c.fill(); c.stroke(); }
}
function bn9Gozluk(c, cx, cy, r, ara, isik) {   // yuvarlak altın gözlük: iki çerçeve, köprü, camda parıltı
  const C = bn9PC;
  c.fillStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.arc(cx - ara, cy, r, 0, 6.2832); c.arc(cx + ara, cy, r, 0, 6.2832); c.fill();
  c.strokeStyle = C.gozluk; c.lineWidth = 0.95; c.beginPath(); c.arc(cx - ara, cy, r, 0, 6.2832); c.moveTo(cx + ara + r, cy); c.arc(cx + ara, cy, r, 0, 6.2832); c.stroke();
  c.beginPath(); c.moveTo(cx - ara + r * 0.82, cy - r * 0.3); c.quadraticCurveTo(cx, cy - r * 0.85, cx + ara - r * 0.82, cy - r * 0.3); c.stroke();
  c.strokeStyle = 'rgba(255,240,190,.85)'; c.lineWidth = 0.5;
  c.beginPath(); c.arc(cx - ara, cy, r * 0.72, -2.6, -1.9); c.moveTo(cx + ara + Math.cos(-2.6) * r * 0.72, cy + Math.sin(-2.6) * r * 0.72); c.arc(cx + ara, cy, r * 0.72, -2.6, -1.9); c.stroke();
  if (isik > 0.05) { c.strokeStyle = 'rgba(255,255,255,' + (0.6 * isik).toFixed(3) + ')'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(cx - ara - r * 0.3, cy + r * 0.3); c.lineTo(cx - ara + r * 0.2, cy - r * 0.2); c.stroke(); }
}
function bn9Kol(c, sx, sy, ex, ey, bx, by) {   // tombul kol: kalın çizgi + dolgu, açık lila pati
  const C = bn9PC;
  c.lineCap = 'round'; c.strokeStyle = C.line; c.lineWidth = 6.8; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(bx, by, ex, ey); c.stroke();
  c.strokeStyle = C.pur; c.lineWidth = 5.4; c.stroke();
  c.strokeStyle = 'rgba(255,248,255,.35)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(sx, sy - 1.4); c.quadraticCurveTo(bx, by - 1.6, ex, ey - 1.4); c.stroke();
  c.fillStyle = C.purL; c.beginPath(); c.arc(ex, ey, 2.1, 0, 6.2832); c.fill();
  c.strokeStyle = 'rgba(86,57,140,.5)'; c.lineWidth = 0.35; c.beginPath(); c.moveTo(ex - 0.8, ey + 0.9); c.lineTo(ex - 0.5, ey + 2); c.moveTo(ex + 0.5, ey + 1); c.lineTo(ex + 0.8, ey + 2); c.stroke();
}
function bn9Ayak(c, x, y, sd, ay) {   // iri yuvarlak ayak, pembe minik patiler
  const C = bn9PC;
  if (ay) { c.fillStyle = C.pur; c.strokeStyle = C.line; c.lineWidth = 0.8; c.beginPath(); c.ellipse(x, y - 4, 5.4, 4.8, 0, 0, 6.2832); c.fill(); c.stroke(); }
  c.fillStyle = C.purL; c.strokeStyle = C.line; c.lineWidth = 0.8; c.beginPath(); c.ellipse(x + sd * 1.2, y - 1.6, 6.8, 3.4, 0, 0, 6.2832); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,160,200,.75)'; c.beginPath(); for (const k of [-1, 0, 1]) { c.moveTo(x + sd * 1.2 + k * 2.6 + 0.9, y - 2.6); c.arc(x + sd * 1.2 + k * 2.6, y - 2.6, 0.9, 0, 6.2832); } c.fill();
}
// kolye (önden): atkının altında göğse sarkan altın zincir + 5 pul ya da boş yuva
const BN9_KY = { ax: -9.4, ay: -28.4, cx: 0, cy: -11.4, bx: 9.4, by: -28.4 };
function bn9KolyeNokta(i, out) { const u = 0.12 + i * 0.19, it = 1 - u, K = BN9_KY; out.x = it * it * K.ax + 2 * it * u * K.cx + u * u * K.bx; out.y = it * it * K.ay + 2 * it * u * K.cy + u * u * K.by; return out; }
const BN9_T = { x: 0, y: 0 };
function bn9KolyeOn(c, o, t, dy) {
  const K = BN9_KY, n = o.kolye != null ? clamp(+o.kolye || 0, 0, 5) : 5, mask = o.kolyeMaske != null ? +o.kolyeMaske : (1 << Math.round(n)) - 1, isk = clamp(+o.isik || 0, 0, 1);
  c.save(); c.translate(0, dy);
  c.strokeStyle = '#c8902e'; c.lineWidth = 0.75; c.beginPath(); c.moveTo(K.ax, K.ay); c.quadraticCurveTo(K.cx, K.cy, K.bx, K.by); c.stroke();
  c.strokeStyle = '#ffe08a'; c.lineWidth = 0.35; c.stroke();
  for (let i = 0; i < 5; i++) {
    bn9KolyeNokta(i, BN9_T); const x = BN9_T.x, y = BN9_T.y + 1.4;
    if (mask & (1 << i)) {
      if (isk > 0.02) { c.globalCompositeOperation = 'lighter'; const ga = c.globalAlpha; c.globalAlpha = ga * isk * (0.55 + 0.25 * Math.sin(t * 3 + i)); c.drawImage(glow(bn9Renkler()[i]), x - 5.5, y - 5.5, 11, 11); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over'; }
      bn9PulCiz(c, x, y, 1.85, i, t, isk);
    } else c.drawImage(bn9YuvaSpr(i).c, x - 3.4 * 0.9, y - 3.4 * 0.9, 6.8 * 0.9, 6.8 * 0.9);
  }
  c.restore();
}
const BN9_DON = { boynX: 0, boynY: 0, gogusX: 0, gogusY: 0, gen: 0 };
function bn9Donus(c, lx, ly, gx, gy, gen) {   // yerel noktaları çağıranın koordinatına çevir (geçerli dönüşüm üzerinden)
  const M = c.getTransform(), B = BN9_D0;
  const inv = B.a * B.d - B.b * B.c || 1;
  const px = (X, Y) => { const ax = M.a * X + M.c * Y + M.e, ay = M.b * X + M.d * Y + M.f, dx = ax - B.e, dy = ay - B.f; return [(B.d * dx - B.c * dy) / inv, (-B.b * dx + B.a * dy) / inv]; };
  let p = px(lx, ly); BN9_DON.boynX = p[0]; BN9_DON.boynY = p[1];
  p = px(gx, gy); BN9_DON.gogusX = p[0]; BN9_DON.gogusY = p[1];
  BN9_DON.gen = gen; return BN9_DON;
}
let BN9_D0 = null, bn9KS = BN9_K;   // bn9KS: geçerli çizimin yerel → dünya ölçeği (kolyeTamCiz için)
const BN9_BOS = {};
function bn9OnCiz(c, t, o, ol) {
  const C = bn9PC, poz = o.poz || 'otur', ay = poz !== 'otur', kat = o.katman || '', yon = o.yon === -1 ? -1 : 1;
  const gul = o.gulumse != null ? clamp(+o.gulumse, 0, 1) : 0.6, ic = clamp(+o.icCek || 0, 0, 1), kon = clamp(+o.konus || 0, 0, 1);
  const kan = clamp(o.kanat != null ? +o.kanat : poz === 'kucak' ? 1 : 0, 0, 1), sar = clamp(+o.sar || 0, 0, 1), dn = poz === 'dans' ? (o.dans != null ? clamp(+o.dans, 0, 1) : 1) : 0;
  const fz = o.faz != null ? +o.faz : t, nf = (fz % 1 + 1) % 1, vur = Math.pow(1 - nf, 3) * dn;   // dans: 1 sn'lik vuruş (60 BPM yarım ölçü)
  const nefes = Math.sin(t * 1.7) * 0.012 + ic * 0.03 * Math.max(0, Math.sin(t * 1.1)), hop = dn * Math.abs(Math.sin(fz * Math.PI)) * 2.2;
  const sal = dn * Math.sin(fz * Math.PI) * 0.07 + Math.sin(t * 0.8) * 0.012;
  const govUst = ay ? -34.5 : -31;
  c.save();
  c.translate(0, -hop); c.rotate(sal); c.scale(1 + vur * 0.03 - nefes * 0.5, 1 - vur * 0.04 + nefes);
  // ── arka katman ──
  if (kat !== 'on') {
    // kanatlar (omuz arkası): kapalı → küçük ve katlı; açık → iki yana kocaman
    for (const sd of [-1, 1]) {
      c.save(); c.scale(sd, 1); c.translate(7.5, govUst + 5);
      const a = lerp(-0.25, 0.25, kan) + (dn ? Math.sin(fz * Math.PI * 2 + (sd > 0 ? 0 : 1)) * 0.18 * dn : 0) + Math.sin(t * 1.3 + sd) * 0.02, k = lerp(0.62, 1.15, kan);
      c.rotate(a - 0.15); c.scale(k, k); bn9Koy(c, bn9KanatOnSpr()); c.restore();
    }
    // kuyruk (yon'un tersinden kıvrılır)
    c.save(); c.scale(-yon, 1); c.translate(8, -4); c.rotate(Math.sin(t * 1.2) * 0.06 + dn * Math.sin(fz * Math.PI) * 0.12); c.translate(-8, 4); bn9Koy(c, bn9KuyrukOnSpr()); c.restore();
    // ayaklar (otururken öne uzanır)
    for (const sd of [-1, 1]) bn9Ayak(c, sd * 8.6, 0.2 - (dn && (sd > 0) === (Math.sin(fz * Math.PI * 2) > 0) ? hop * 0.6 : 0), sd, ay);
    bn9Koy(c, bn9GovdeOnSpr(ay));
    // boyun: çene ile atkı arasını gövde rengiyle doldur (arkadaki gök/dağ görünmesin); üstü kafanın, altı atkının altında kalır
    c.fillStyle = C.pur; c.strokeStyle = C.line; c.lineWidth = 1; c.beginPath(); c.ellipse(0, govUst - 4.5, 9.6, 7.5, 0, 0, 6.2832); c.fill(); c.stroke();
    c.fillStyle = C.pur; c.beginPath(); c.ellipse(0, govUst - 2, 9.1, 5.5, 0, 0, 6.2832); c.fill();
    // kollar: otururken karnında kavuşmuş; ayakta yanda; dans: havada sallanır; kucak (arka katmanda yok, 'on'da)
    if (poz !== 'kucak') {
      for (const sd of [-1, 1]) {
        const sx = sd * 9.8, sy = govUst + 7.5; let ex, ey, bx, by;
        if (dn > 0) { const w = Math.sin(fz * Math.PI * 2 + (sd > 0 ? 0 : Math.PI)); ex = sd * (17 + 2 * w); ey = govUst - 4 - 3 * w; bx = sd * 15; by = govUst + 4; }
        else if (poz === 'ayakta') { ex = sd * 15.2; ey = govUst + 19; bx = sd * 14.6; by = govUst + 11; }
        else { ex = sd * 3.4; ey = -11.5 - ic * 1.2; bx = sd * 12.5; by = -15; }
        bn9Kol(c, sx, sy, ex, ey, bx, by);
      }
    }
    // atkı ve kolye
    const ad = ic * 0.6 * Math.max(0, Math.sin(t * 1.1));
    const tamK = !o.kolyeGizle && C.kolyeVar && typeof kolyeTamCiz === 'function';   // kolye.js'in tam kolyesi (mini oyundakinin aynısı)
    if (!o.kolyeGizle && C.kolyeVar && !tamK) bn9KolyeOn(c, o, t, ad + (ay ? -3.5 : 0));
    if (C.atkiVar) { c.save(); c.translate(0, govUst + 1.2 - ad); bn9Koy(c, bn9AtkiSpr());
    c.save(); c.translate(yon * 10.6, 1.6); c.rotate(-yon * 0.16 + Math.sin(t * 1.6) * 0.05 + sal * 0.6); bn9Koy(c, bn9AtkiUcSpr()); c.restore();
    c.save(); c.translate(yon * 8.4, 2); c.rotate(-yon * 0.02 + Math.sin(t * 1.6 + 0.8) * 0.05); c.scale(0.9, 0.78); bn9Koy(c, bn9AtkiUcSpr()); c.restore();
    c.fillStyle = C.atkiD; c.beginPath(); c.ellipse(yon * 9.6, 1.4, 2.3, 1.9, 0, 0, 6.2832); c.fill(); c.fillStyle = C.atki; c.beginPath(); c.ellipse(yon * 9.5, 1.2, 1.9, 1.5, 0, 0, 6.2832); c.fill();
    c.restore(); }
    if (C.ek) C.ek(c, t, 'gogus', govUst, yon);
    if (tamK) {   // dünya ölçeğinde, aynalanmadan (biçimlerin sırası mini oyundakiyle aynı kalsın)
      const n = o.kolye != null ? clamp(+o.kolye || 0, 0, 5) : 5, mask = o.kolyeMaske != null ? +o.kolyeMaske : null;
      c.save(); c.translate(0, -21 + ad + (ay ? -3.5 : 0)); c.scale(yon / bn9KS, 1 / bn9KS);
      try { kolyeTamCiz(c, 0, 0, 24 * bn9KS, t, clamp(+o.isik || 0, 0, 1), Math.round(n), mask); } catch (e) { /* yedek yok: bir karelik */ }
      c.restore();
    }
    // kafa (yon'a doğru hafif eğik; iç çekerken biraz önde)
    c.save(); c.translate(0, govUst - 9 - ad); c.rotate(yon * 0.06 + sal * 0.6 + (o.basEgim || 0)); c.translate(0, 9);
    c.translate(0, -12); bn9Koy(c, bn9BasOnSpr());
    const bX = o.bakX != null ? clamp(+o.bakX, -1, 1) : yon * 0.45, bY = o.bakY != null ? clamp(+o.bakY, -1, 1) : 0.15;
    const kirp = ((t + 0.7) % 4.3) < 0.13 ? 0.05 : 1, mutlu = gul > 0.88 || o.gozKapa ? 1 : 0;
    for (const sd of [-1, 1]) bn9Goz(c, sd * 5.6 + bX * 0.5, -6.2, 3.7, 4.3, bX, bY, kirp, mutlu, ic * 0.9);
    if (C.gozlukVar) bn9Gozluk(c, bX * 0.5, -6.2, 5.1, 5.6, 0.6 + 0.4 * (+o.isik || 0));
    else if (C.kirpik) { c.strokeStyle = '#1c1228'; c.lineWidth = 0.7; c.beginPath(); for (const sd of [-1, 1]) { const ex = sd * 5.6 + bX * 0.5 + sd * 3.4; c.moveTo(ex, -8.2); c.lineTo(ex + sd * 1.4, -9.6); c.moveTo(ex - sd * 0.6, -9.4); c.lineTo(ex + sd * 0.4, -10.9); } c.stroke(); }
    // beyaz yumuşak kaşlar (iç çekerken iç uçlar hafif kalkar — üzgün değil, dalgın)
    c.strokeStyle = C.kas; c.lineWidth = 1.5; c.beginPath();
    for (const sd of [-1, 1]) { const ix = sd * 2.8 + bX * 0.5, dx = sd * 8.6 + bX * 0.5, ust = -12.8 - gul * 0.5; c.moveTo(ix, ust + 0.5 - ic * 0.9); c.quadraticCurveTo(sd * 5.6 + bX * 0.5, ust - 1.4, dx, ust + 0.9); } c.stroke();
    c.fillStyle = C.yanak; c.beginPath(); c.ellipse(-10.2, -0.4, 2.7, 1.5, 0, 0, 6.2832); c.ellipse(10.2, -0.4, 2.7, 1.5, 0, 0, 6.2832); c.fill();
    bn9Agiz(c, bX * 0.4, 4.6, 3.6, gul, kon, t);
    if (C.ek) C.ek(c, t, 'bas', 0, yon);
    c.restore();
    // ışık (kolye/kalp ışığında): yumuşak sıcak hâle
    const isk = +o.isik || 0;
    if (isk > 0.02) { c.globalCompositeOperation = 'lighter'; const ga = c.globalAlpha; c.globalAlpha = ga * isk * 0.35; c.drawImage(glow('#ffe6a8'), -40, -70, 80, 80); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over'; }
  }
  // ── ön katman: kucak kolları (açık "gel!" → sımsıkı sarılmış) ──
  if (poz === 'kucak' && kat !== 'arka') {
    for (const sd of [-1, 1]) {
      const sx = sd * 9.8, sy = govUst + 7.5, w = Math.sin(t * 2.2 + sd) * (1 - sar) * 1.2;
      const ex = sd * lerp(22, 4.2, smooth(sar)), ey = lerp(govUst - 6 + w, -15, smooth(sar)), bx = sd * lerp(19, 17, sar), by = lerp(govUst + 1, -22, sar);
      bn9Kol(c, sx, sy, ex, ey, bx, by);
    }
  }
  const D0 = kat === 'on' ? null : bn9Donus(c, 0, govUst + 1.5, 0, -21 + (ay ? -3.5 : 0), 24);
  c.restore();
  return D0;
}

// ══════════ YANDAN UÇUŞ GÖRÜNÜŞÜ — yerel: karnın altı ortası (0,0), sağa bakar ══════════
function bn9GovdeYanYol(q) {
  q.beginPath(); q.moveTo(-30, -12);
  q.bezierCurveTo(-30, -21, -18, -26, 0, -26); q.bezierCurveTo(12, -26, 20, -24.4, 24.8, -22.6);   // sırt
  q.bezierCurveTo(28, -27, 32.6, -33.4, 38.4, -36.8);                                              // boyun üstü
  q.lineTo(44.2, -29.4); q.bezierCurveTo(39, -25.6, 35.4, -20, 33.2, -13.6);                       // boyun önü
  q.bezierCurveTo(31.6, -5, 24, 0, 4, 0); q.bezierCurveTo(-16, 0, -30, -3.6, -30, -12); q.closePath();
}
function bn9GovdeYanSpr() {
  return bn9Tuval('govdeYan' + bn9PC.ad, -33, -42, 82, 46, q => {
    const C = bn9PC;
    // sırt dikenleri (boyundan kuyruğa yeşil yumuşak dilimler)
    const dk = []; for (let i = 0; i < 9; i++) { const x = 30 - i * 6.4, y = i === 0 ? -31 : i === 1 ? -26.4 : -25.2 - Math.sin(i * 0.36) * 0.8 + (i > 6 ? (i - 6) * 1.6 : 0); dk.push(x, y, i < 2 ? 1.8 : 2.2 - i * 0.08); }
    bn9Blob(q, dk, C.ibik, C.ibikD, 1);
    q.fillStyle = bn9GR(q, 2, -20, 2, 4, -12, 34, 0, C.purL, 0.55, C.pur, 1, C.purD); bn9GovdeYanYol(q); q.fill();
    q.save(); bn9GovdeYanYol(q); q.clip();
    // altta çizgili karın bandı (boyun önünden kuyruğa)
    q.beginPath(); q.moveTo(42, -31); q.bezierCurveTo(36, -26, 33, -18, 30.6, -8.6); q.bezierCurveTo(26, -1, 12, 1.5, -6, 1.2); q.bezierCurveTo(-20, 0.8, -28, -2, -30, -5);
    q.lineTo(-30, 6); q.lineTo(46, 6); q.closePath();
    q.fillStyle = bn9GL(q, 0, -10, 0, 2, 0, C.karL, 0.5, C.kar, 1, C.karD); q.fill();
    q.strokeStyle = 'rgba(120,150,40,.45)'; q.lineWidth = 0.42; q.beginPath();
    for (let i = 0; i < 16; i++) { const u = i / 15, x = lerp(37.5, -26, u), y0 = lerp(-26, -3.6, Math.pow(u, 0.6)) + (u > 0.25 ? 0 : 0); q.moveTo(x, y0); q.lineTo(x - 1.6, 4); } q.stroke();
    q.strokeStyle = 'rgba(255,248,255,.42)'; q.lineWidth = 1.5; q.beginPath(); q.moveTo(-24, -18.5); q.bezierCurveTo(-16, -23.6, 6, -24.4, 20, -22); q.stroke();
    q.fillStyle = 'rgba(90,60,150,.14)'; q.beginPath(); q.ellipse(0, 1, 30, 5.5, 0, 0, 6.2832); q.fill();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.95; bn9GovdeYanYol(q); q.stroke();
  });
}
function bn9BasYanYol(q) {   // yandan kafa (Pırıl'ın kafa çizgisi, 1.3 kat; boyun eklemi (−6.5, −14.3) çevresinde)
  q.beginPath(); q.moveTo(-6.5, -14.3);
  q.bezierCurveTo(-6.8, -24.4, 0, -30.4, 8.6, -30.4); q.bezierCurveTo(16.6, -30.4, 21.3, -25, 21.6, -19.2);
  q.bezierCurveTo(24.6, -18.7, 26.5, -15.3, 25.9, -11.7); q.bezierCurveTo(25.4, -8.3, 22.4, -7.3, 19.5, -7.4);
  q.bezierCurveTo(17.7, -3.4, 12.5, -0.8, 7, -1); q.bezierCurveTo(0, -1.6, -6.2, -6.5, -6.5, -14.3); q.closePath();
}
function bn9BasYanSpr() {
  return bn9Tuval('basYan' + bn9PC.ad, -20, -40, 48, 42, q => {
    const C = bn9PC;
    // kulak (arkada, yüzgeç)
    q.save(); q.translate(-3, -16); q.rotate(-1.15);
    q.beginPath(); q.moveTo(1.6, 1.8); q.quadraticCurveTo(2.4, -6.5, 0.8, -13.8); q.quadraticCurveTo(-2, -12.2, -3.9, -9.6); q.quadraticCurveTo(-6.2, -8.6, -6.8, -5.4); q.quadraticCurveTo(-8.6, -3.9, -8.3, -0.8); q.quadraticCurveTo(-3.9, 0.8, 1.6, 1.8); q.closePath();
    q.fillStyle = bn9GL(q, 0, 0, -3, -12, 0, C.kulakD, 0.55, C.kulak, 1, C.kulakL); q.fill(); q.strokeStyle = 'rgba(80,110,20,.85)'; q.lineWidth = 0.65; q.stroke();
    q.strokeStyle = 'rgba(240,255,200,.5)'; q.lineWidth = 0.4; q.beginPath(); q.moveTo(0.8, 0.3); q.quadraticCurveTo(1.3, -6.2, 0.5, -12.7); q.moveTo(0.1, 0.5); q.quadraticCurveTo(-2.1, -4.9, -3.5, -8.8); q.moveTo(-0.5, 0.8); q.quadraticCurveTo(-3.6, -3.1, -6, -4.9); q.stroke();
    q.restore();
    // ibik (yandan yelpaze: üç taraklı dilim, başın tepesinden arkaya)
    q.save(); q.scale(1.18, 1.18); q.translate(0.5, 4);
    q.beginPath(); q.moveTo(10.2, -21); q.quadraticCurveTo(12.4, -27.8, 8, -30.2); q.quadraticCurveTo(5, -31.4, 2.6, -29.4); q.quadraticCurveTo(0.2, -32.4, -4.6, -31);
    q.quadraticCurveTo(-8.2, -29.8, -9.2, -26.8); q.quadraticCurveTo(-13.6, -26, -14.2, -21.6); q.quadraticCurveTo(-14.4, -18.4, -11.2, -17); q.quadraticCurveTo(-13.4, -13, -10.8, -10.2); q.quadraticCurveTo(-8.6, -7.6, -4.6, -7.4); q.lineTo(-1, -13); q.lineTo(6, -19.5); q.closePath();
    q.fillStyle = bn9GL(q, -4, -34, 2, -16, 0, C.ibikL, 0.42, C.ibik, 1, C.ibikD); q.fill(); q.strokeStyle = C.ibikD; q.lineWidth = 0.8; q.stroke();
    q.strokeStyle = 'rgba(16,60,16,.5)'; q.lineWidth = 0.6; q.beginPath(); q.moveTo(2.6, -29.4); q.quadraticCurveTo(3, -26.4, 3.6, -23.6); q.moveTo(-9.2, -26.8); q.quadraticCurveTo(-7, -23.6, -5.2, -21); q.stroke();
    q.restore();
    q.fillStyle = bn9GR(q, 7, -22, 1, 6, -14, 20, 0, C.purL, 0.6, C.pur, 1, C.purD); bn9BasYanYol(q); q.fill();
    q.save(); bn9BasYanYol(q); q.clip();
    q.fillStyle = C.kar; q.beginPath(); q.moveTo(26.5, -8.6); q.quadraticCurveTo(16.2, -7, 6, -3.4); q.lineTo(4, 5); q.lineTo(28, 5); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(120,150,40,.45)'; q.lineWidth = 0.42; q.beginPath(); q.moveTo(11.7, -3.4); q.lineTo(16.9, -5); q.moveTo(9.1, -1.6); q.lineTo(15.6, -2.9); q.stroke();
    q.fillStyle = bn9GR(q, 22.9, -13, 0.6, 22.9, -13, 7, 0, 'rgba(240,226,255,.85)', 1, 'rgba(240,226,255,0)'); q.fillRect(14, -21, 15, 15);
    q.strokeStyle = 'rgba(255,248,255,.42)'; q.lineWidth = 1.4; q.save(); q.beginPath(); q.rect(-10, -40, 40, 15); q.clip(); q.translate(0.8, 1.8); bn9BasYanYol(q); q.stroke(); q.restore();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.95; bn9BasYanYol(q); q.stroke();
    q.fillStyle = C.line; q.beginPath(); q.ellipse(24.2, -14.3, 0.7, 0.55, -0.3, 0, 6.2832); q.fill();
    // beyaz topuz (başın tepesinde, ibiğin önünde)
    if (C.topuz) bn9Blob(q, [9.5, -30.2, 2.3, 7.4, -29.4, 1.8, 11.6, -29.4, 1.8, 9.4, -32.2, 1.5], '#fbf7ff', '#b9a6dc', 0.7);
    q.fillStyle = 'rgba(255,128,180,.5)'; q.beginPath(); q.ellipse(15.2, -9.4, 2.6, 1.5, -0.1, 0, 6.2832); q.fill();   // yanak
  });
}
function bn9KanatYanSpr(uzak) {   // yandan büyük yumuşak kanat (kök (0,0), yukarı-geri açılır); uzak kanat koyu
  return bn9Tuval((uzak ? 'kanatYanU' : 'kanatYan') + bn9PC.ad, -40, -52, 50, 56, q => {
    const C = bn9PC, a = uzak ? 0.3 : 0;
    const yol = () => { q.beginPath(); q.moveTo(4, 1); q.bezierCurveTo(6, -18, -4, -40, -12, -50); q.quadraticCurveTo(-18, -44, -22, -40);
      q.quadraticCurveTo(-24, -32, -30, -30); q.quadraticCurveTo(-30, -22, -36, -18); q.quadraticCurveTo(-30, -8, -22, -6); q.quadraticCurveTo(-14, 0, -6, -1.4); q.quadraticCurveTo(-1, 2, 4, 1); q.closePath(); };
    q.fillStyle = bn9GL(q, 0, 0, -20, -40, 0, mixc(C.kanatD, '#6a4aa0', a), 0.5, mixc(C.kanat, '#8a6ac0', a), 1, mixc(C.kanatL, '#a88ad8', a)); yol(); q.fill();
    q.save(); yol(); q.clip();
    q.strokeStyle = uzak ? 'rgba(90,60,150,.4)' : 'rgba(160,110,200,.5)'; q.lineWidth = 0.6; q.beginPath();
    q.moveTo(2, -2); q.quadraticCurveTo(-8, -22, -22, -40); q.moveTo(2, -2); q.quadraticCurveTo(-14, -18, -30, -30); q.moveTo(2, -1); q.quadraticCurveTo(-16, -9, -36, -18); q.moveTo(1, 0); q.quadraticCurveTo(-10, -3, -22, -6); q.stroke();
    q.fillStyle = 'rgba(255,255,255,.12)'; q.beginPath(); q.ellipse(-10, -24, 8, 16, -0.6, 0, 6.2832); q.fill();
    q.restore();
    q.strokeStyle = C.line; q.lineWidth = 0.9; yol(); q.stroke();
    q.strokeStyle = uzak ? mixc(C.purD, '#4a3080', 0.4) : C.purD; q.lineWidth = 2.6; q.beginPath(); q.moveTo(4, 1); q.bezierCurveTo(6, -18, -4, -40, -12, -50); q.stroke();
    q.strokeStyle = C.line; q.lineWidth = 0.6; q.stroke();
    q.fillStyle = uzak ? C.purD : C.purL; q.beginPath(); q.arc(-12, -50, 1.5, 0, 6.2832); q.fill();
  });
}
// kuyruk (yandan, canlı: incelen dalgalı şerit, kürek uç) — karede gradyan yok, tek renk + çizgi
const BN9_KQ = new Float32Array(16);
function bn9KuyrukYan(c, t, dalga) {
  const C = bn9PC, n = 8;
  for (let i = 0; i < n; i++) { const u = i / (n - 1); BN9_KQ[i * 2] = -27 - u * 44; BN9_KQ[i * 2 + 1] = -12.5 - u * 3 + Math.sin(t * 2.2 - u * 3.2) * (1 + u * 5) * dalga; }
  c.beginPath();
  for (let i = 0; i < n; i++) { const w = lerp(6.2, 1.2, i / (n - 1)); const x = BN9_KQ[i * 2], y = BN9_KQ[i * 2 + 1] - w; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
  for (let i = n - 1; i >= 0; i--) { const w = lerp(6.2, 1.2, i / (n - 1)) * 0.85; c.lineTo(BN9_KQ[i * 2], BN9_KQ[i * 2 + 1] + w); }
  c.closePath(); c.fillStyle = C.pur; c.fill(); c.strokeStyle = C.line; c.lineWidth = 0.9; c.stroke();
  c.strokeStyle = 'rgba(214,236,150,.9)'; c.lineWidth = 1.6; c.beginPath();   // alt yüzde karın çizgisi devam eder
  for (let i = 0; i < n - 2; i++) { const w = lerp(6.2, 1.2, i / (n - 1)) * 0.55; const x = BN9_KQ[i * 2], y = BN9_KQ[i * 2 + 1] + w; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
  c.fillStyle = C.ibik; c.strokeStyle = C.ibikD; c.lineWidth = 0.7; c.beginPath();
  for (let i = 1; i < n - 1; i++) { const w = lerp(6.2, 1.2, i / (n - 1)), x = BN9_KQ[i * 2], y = BN9_KQ[i * 2 + 1] - w, r = lerp(2, 0.9, i / (n - 1)); c.moveTo(x + r, y); c.arc(x, y, r, 0, 6.2832); }
  c.fill(); c.stroke();
  const ex = BN9_KQ[(n - 1) * 2], ey = BN9_KQ[(n - 1) * 2 + 1], ax = BN9_KQ[(n - 2) * 2], ay = BN9_KQ[(n - 2) * 2 + 1];
  c.save(); c.translate(ex, ey); c.rotate(Math.atan2(ey - ay, ex - ax) + Math.PI / 2);
  c.fillStyle = C.ibik; c.beginPath(); c.moveTo(0, -1.5); c.bezierCurveTo(-5, 1, -3.6, 7.2, 0, 5.2); c.bezierCurveTo(3.6, 7.2, 5, 1, 0, -1.5); c.fill(); c.stroke();
  c.restore();
}
function bn9SirtY(x) { return x > 24 ? -26 + (x - 24) * 0.4 : -13 - 13 * Math.sqrt(Math.max(0, 1 - Math.pow((x - 0) / 30.5, 2))); }   // sırt üst çizgisi (yerel)
// Oturma yerleri (yerel): 0 = Feza (boynun dibinde), 1..6 = yavrular (sırt boyunca, kuyruk köküne doğru)
const BN9_YER = [19.5, 9.5, 2.5, -4.5, -11.5, -18.5, -24.5];
function buyukanneSirt(i, s, aci, yon, out) {
  out = out || {}; const K = BN9_K * (s || 1), yn = yon === -1 ? -1 : 1, lx = BN9_YER[clamp(i | 0, 0, 6)], ly = bn9SirtY(lx) + (i === 0 ? 0.6 : 0.4);
  const ca = Math.cos(aci || 0), sa = Math.sin(aci || 0);
  out.x = (lx * ca - ly * sa) * K * yn; out.y = (lx * sa + ly * ca) * K;
  const hx = 26.4, hy = -27.8;   // atkı tutunma noktası (boyun dibinde, atkının üstü)
  out.ex = (hx * ca - hy * sa) * K * yn; out.ey = (hx * sa + hy * ca) * K;
  return out;
}
function bn9YanCiz(c, t, o) {
  const C = bn9PC, kf = o.kanatF != null ? +o.kanatF : t * 1.15 * 6.2832, kac = o.kanat != null ? clamp(+o.kanat, 0, 1) : 1;   // kanat evresi
  const sin = Math.sin(kf), kn = lerp(0.35, 1, kac);   // kanat dikey ölçeği: 1 yukarı … −0.55 aşağı
  const fy = lerp(0.8, sin >= 0 ? sin : sin * 0.6, kn), gul = o.gulumse != null ? clamp(+o.gulumse, 0, 1) : 0.8, kon = clamp(+o.konus || 0, 0, 1);
  const bas = Math.sin(t * 1.15 * 6.2832 - 1.2) * 0.6 * kac;
  // uzak kanat (gövdenin arkasında, biraz önde ve yukarıda)
  c.save(); c.translate(9, -24.5); c.scale(0.86, fy * 0.95); c.rotate(-0.08); bn9Koy(c, bn9KanatYanSpr(true)); c.restore();
  bn9KuyrukYan(c, t, 0.7 + 0.3 * kac);
  // bacaklar (karnın altına toplanmış)
  c.fillStyle = C.purD; c.strokeStyle = C.line; c.lineWidth = 0.8;
  c.beginPath(); c.ellipse(-15, -1.4, 5.2, 3.8, 0.3, 0, 6.2832); c.fill(); c.stroke(); c.beginPath(); c.ellipse(15, -0.8, 4.6, 3.4, 0.4, 0, 6.2832); c.fill(); c.stroke();
  c.fillStyle = C.purL; c.beginPath(); c.ellipse(-19.5, 0.6, 4.2, 2.3, 0.2, 0, 6.2832); c.fill(); c.stroke(); c.beginPath(); c.ellipse(19.6, 1.4, 3.8, 2.1, 0.5, 0, 6.2832); c.fill(); c.stroke();
  bn9Koy(c, bn9GovdeYanSpr());
  // kafa (boyun ucunda; kanat vuruşuyla hafif iner-kalkar)
  c.save(); c.translate(41.4, -33.2 + bas * 0.5); c.rotate(-0.06 + bas * 0.015 + (o.basEgim || 0)); c.translate(6.5, 14.3);
  bn9Koy(c, bn9BasYanSpr());
  const kirp = ((t + 0.7) % 4.3) < 0.13 ? 0.05 : 1, mutlu = gul > 0.88 || o.gozKapa ? 1 : 0, bX = o.bakX != null ? clamp(+o.bakX, -1, 1) : 0.8, bY = o.bakY != null ? clamp(+o.bakY, -1, 1) : 0;
  bn9Goz(c, 13, -19.4, 3.5, 4.4, bX, bY, kirp, mutlu, 0);
  c.strokeStyle = C.kas; c.lineWidth = 1.4; c.beginPath(); c.moveTo(9.6, -25.4); c.quadraticCurveTo(13.2, -27.4, 16.8, -25); c.stroke();
  if (C.gozlukVar) {
  c.fillStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.arc(13.3, -19.2, 5, 0, 6.2832); c.fill();   // gözlük (yakın cam + sap)
  c.strokeStyle = C.gozluk; c.lineWidth = 0.95; c.beginPath(); c.arc(13.3, -19.2, 5, 0, 6.2832); c.stroke();
  c.beginPath(); c.moveTo(8.3, -19.6); c.quadraticCurveTo(2, -19.8, -2.5, -17.4); c.moveTo(18.2, -20.4); c.quadraticCurveTo(19.8, -21, 21.2, -20.2); c.stroke();
  c.strokeStyle = 'rgba(255,240,190,.85)'; c.lineWidth = 0.5; c.beginPath(); c.arc(13.3, -19.2, 3.6, -2.6, -1.9); c.stroke(); }
  if (C.ek) C.ek(c, t, 'yanBas', 0, 1);
  // ağız (yandan): gülümseme çizgisi; konuşurken açılır
  const ac = kon > 0.02 ? kon * (0.45 + 0.55 * Math.abs(Math.sin(t * 13))) : gul > 0.75 ? (gul - 0.75) * 2.4 : 0;
  if (ac > 0.08) { c.fillStyle = C.agiz; c.beginPath(); c.moveTo(22, -8.6); c.quadraticCurveTo(17, -6 + ac * 3, 12.2, -6.2); c.quadraticCurveTo(17, -7.4, 22, -8.6); c.fill(); }
  c.strokeStyle = '#1c1228'; c.lineWidth = 0.85; c.beginPath(); c.moveTo(22.4, -8.8); c.quadraticCurveTo(17.4, -6.4, 12.2, -6.4); c.quadraticCurveTo(11.4, -6.8, 11.2, -7.8); c.stroke();
  c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(70,50,90,.55)'; c.lineWidth = 0.3; for (const fx of [19.6, 16]) { c.beginPath(); c.moveTo(fx - 0.6, -7.6); c.lineTo(fx + 0.6, -7.8); c.lineTo(fx + 0.1, -6.3); c.closePath(); c.fill(); c.stroke(); }
  c.restore();
  // atkı: boyun dibinde bant + rüzgârda arkaya uçuşan iki uç (Feza'nın arkasında kalır)
  if (C.atkiVar) { c.save(); c.translate(27.6, -27); c.rotate(-0.95); c.scale(0.5, 0.95); bn9Koy(c, bn9AtkiSpr()); c.restore(); }
  // kolye (boyun önünde, atkının altında)
  if (!o.kolyeGizle && C.kolyeVar) {
    const n = o.kolye != null ? clamp(+o.kolye || 0, 0, 5) : 5, mask = o.kolyeMaske != null ? +o.kolyeMaske : (1 << Math.round(n)) - 1, isk = clamp(+o.isik || 0, 0, 1);
    c.strokeStyle = '#c8902e'; c.lineWidth = 0.65; c.beginPath(); c.moveTo(29.4, -26); c.quadraticCurveTo(33.8, -19.5, 38.6, -24.4); c.stroke();
    for (let i = 0; i < 5; i++) { const u = 0.1 + i * 0.2, it = 1 - u, x = it * it * 29.4 + 2 * it * u * 33.8 + u * u * 38.6, y = it * it * -26 + 2 * it * u * -19.5 + u * u * -24.4 + 1;
      if (mask & (1 << i)) { if (isk > 0.02) { c.globalCompositeOperation = 'lighter'; const ga = c.globalAlpha; c.globalAlpha = ga * isk * 0.6; c.drawImage(glow(bn9Renkler()[i]), x - 4.5, y - 4.5, 9, 9); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over'; } bn9PulCiz(c, x, y, 1.35, i, t, isk); } }
  }
  // yakın kanat (riders bu kanadın önünde çizilir)
  c.save(); c.translate(3, -23.5); c.scale(1, fy); bn9Koy(c, bn9KanatYanSpr(false)); c.restore();
  const isk = +o.isik || 0;
  if (isk > 0.02) { c.globalCompositeOperation = 'lighter'; const ga = c.globalAlpha; c.globalAlpha = ga * isk * 0.3; c.drawImage(glow('#ffe6a8'), -50, -60, 120, 80); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over'; }
  return bn9Donus(c, 27.6, -27, 34, -20, 10);
}
// atkı uçları (uçuşta rüzgârda dalgalanır): çağıran binicilerin ARKASINDA çizer (bn9Binis bunu kullanır)
function bn9AtkiUclar(c, t, hiz) {
  const C = bn9PC;
  for (let k = 0; k < 2; k++) {
    c.save(); c.translate(26.6 - k * 1.2, -29 + k * 1.2);
    const n = 7; c.beginPath();
    for (let i = 0; i <= n; i++) { const u = i / n, x = -u * (16 + k * 3) * (0.6 + 0.4 * hiz), y = -u * 2.4 + Math.sin(t * 9 + k * 1.4 - u * 4) * u * 2.2 * (0.4 + hiz * 0.6); if (i) c.lineTo(x, y - 1.6); else c.moveTo(x, y - 1.6); }
    for (let i = n; i >= 0; i--) { const u = i / n, x = -u * (16 + k * 3) * (0.6 + 0.4 * hiz), y = -u * 2.4 + Math.sin(t * 9 + k * 1.4 - u * 4) * u * 2.2 * (0.4 + hiz * 0.6); c.lineTo(x, y + 1.6); }
    c.closePath(); c.fillStyle = k ? C.atkiS2 : C.atki; c.fill(); c.strokeStyle = C.atkiD; c.lineWidth = 0.5; c.stroke();
    c.strokeStyle = C.atkiS; c.lineWidth = 0.9; c.beginPath(); for (let i = 1; i < n; i += 2) { const u = i / n, x = -u * (16 + k * 3) * (0.6 + 0.4 * hiz), y = -u * 2.4 + Math.sin(t * 9 + k * 1.4 - u * 4) * u * 2.2 * (0.4 + hiz * 0.6); c.moveTo(x, y - 1.4); c.lineTo(x, y + 1.4); } c.stroke();
    c.restore();
  }
}

// ══════════ ORTAK ÇİZİCİ ══════════
function buyukanneCiz(c, x, y, s, t, o) {
  o = o || BN9_BOS; s = Number.isFinite(s) && s > 0 ? s : 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  const yon = o.yon === -1 ? -1 : 1, K = BN9_K * s;
  BN9_D0 = c.getTransform(); bn9KS = K;
  c.save(); c.translate(x, y);
  if (o.aci) c.rotate(+o.aci || 0);
  c.scale(K * yon, K); c.lineJoin = 'round'; c.lineCap = 'round';
  let d = null;
  try { d = o.poz === 'ucus' ? bn9YanCiz(c, t, o) : bn9OnCiz(c, t, o); }
  catch (e) { /* yarım çizim: oyun sürsün */ }
  c.restore();
  if (d) d.gen *= K;
  return d;
}
function bn9Isit(adim) {   // önbellekleri karelere yay: her çağrıda bir tane; hepsi hazırsa true
  const L = [() => bn9GovdeOnSpr(false), () => bn9GovdeOnSpr(true), bn9KanatOnSpr, bn9KuyrukOnSpr, bn9BasOnSpr, bn9AtkiSpr, bn9AtkiUcSpr,
    bn9GovdeYanSpr, bn9BasYanSpr, () => bn9KanatYanSpr(false), () => bn9KanatYanSpr(true), () => bn9PulSpr(0), () => bn9PulSpr(1), () => bn9PulSpr(2), () => bn9PulSpr(3), () => bn9PulSpr(4),
    () => bn9YuvaSpr(0), () => bn9YuvaSpr(1), () => bn9YuvaSpr(2), () => bn9YuvaSpr(3), () => bn9YuvaSpr(4)];
  const n0 = Object.keys(bn9Spr).length;
  for (const f of L) { f(); if (!adim && Object.keys(bn9Spr).length > n0) return false; }
  return true;
}

// ══════════════════════════════ BÜYÜKANNE'NİN SIRTINDA YOLCULUK ('buyukanneBinis') ══════════════════════════════
// Kolye bitince Büyükanne kalkış kayalığında (602) kollarını açıp "gel!" der; Feza yanına gelince sırtına atlar (OLAY 'binisBasla'),
// yavrular sırayla arkasına hoplar, Pırıl yanında, Fıstık arkada uçar. Yolculuk (~65 sn): KALKIŞ → ŞELALELER (altımızdan akan su
// perdeleri, su tozu) → UÇAN ADACIKLAR (sarkan kökler, minik şelaleler) → GÜN BATIMI ve BULUT DENİZİ (ağır çekim: kocaman güneşin
// önünde siluet anı) → UZAK EJDERHALAR SELAM VERİR → yuvanın girişine yumuşak İNİŞ (OLAY 'binisBitti', V9.binis = true).
// Kontrol: ekrana basılı tutunca Büyükanne kanat çırpıp yükselir, bırakınca süzülerek alçalır (koridorda sınırlı; düşme/kaybetme yok).
// Havada ışık baloncukları ve çiçek tozları; yakından geçince Büyükanne'ye doğru kayar (mıknatıs), toplanır (OLAY 'binisIsik').
// ~10 sn dokunulmazsa sıradaki baloncuk parlar, Pırıl çevresinde döner; ~16 sn'de Pırıl ışıktan kurdeleyle Büyükanne'yi çeker.
// Sanal yol (supurge.js gibi): yakın katman (şelaleler, adacıklar, bulut denizi, baloncuklar) sanal yolda (v) durur, dünyaya o.dx kaymasıyla
// çizilir. Büyükanne'nin dünya x'i başta ve sonda sanalla birebir, ortada yavaş (uzak dünya dunya9 yavaş, yakın katman hızlı akar).
const BN9_LV = 14000;
const BN9_BINIS = 2.6, BN9_INIS = 3.4;
const BN9_V0 = 262, BN9_VG = 118, BN9_VS = 150;            // hız: genel, gün batımında en yavaş, iniş sonu
const BN9_UST = 170, BN9_ALT = -110;                        // şeride göre yükseklik payı (yukarı +)
const BN9_IPUCU = 10, BN9_YARDIM = 16;
const BN9_SEL = [700, 3900], BN9_ADA = [3500, 7000], BN9_GUN = 8300, BN9_GUNW = 1500, BN9_SELAM = [10000, 11900], BN9_INISV = BN9_LV - 1700;
const BN9_TOZ = ['#fff4c8', '#ffd27a', '#ff9fc0', '#6fd8a8', '#b89cff', '#7fe0f0'];
const BN9_YAVRU_RENK = { nane: '#8fe8c0', seftali: '#ffc29a', gok: '#7fe0f0', limon: '#f2ec7a', gul: '#ff9fc0', lila: '#c9b0ff', fistik: '#c8f08a' };
// ışık dizileri: [biçim, sanal konum, tür ('b' baloncuk | 'p' çiçek tozu), taban yükseklik (şeride göre, yukarı +), ...]
const BN9_DIZI = [
  ['cizgi', 1100, 'b', 30, 3, 130], ['yay', 1900, 'p', 40, 5, 110, 100], ['dalga', 2800, 'b', 20, 4, 150, 60], ['halka', 3600, 'b', 70, 64],
  ['merdiven', 4300, 'b', -30, 4, 130, 50], ['yay', 5200, 'p', 10, 6, 115, 120], ['cizgi', 6100, 'b', 120, 3, 120], ['dalga', 6700, 'b', 40, 4, 150, 55],
  ['yay', 7700, 'p', 30, 9, 120, 70],                                    // gün batımı: güneşin önünde çiçek tozu yayı
  ['halka', 9300, 'b', 40, 64], ['merdiven', 10100, 'b', 80, 3, 130, -40], ['dalga', 10900, 'p', 20, 5, 140, 50], ['yay', 11700, 'b', 30, 5, 120, 90]];
const BINIS9 = {
  o: null,
  aktif() { return !!this.o && P.ucus === this.o; },
  faz() { return this.o ? this.o.faz : null; },
  bitti() { return !!this.o && !!this.o.done; },
  ilerleme() { const o = this.o; return o ? (o.done ? 1 : clamp(o.v / BN9_LV, 0, 1)) : 0; },
  gunbatimi() { const o = this.o; return o && P.ucus === o ? bn9GunW(o.v) : 0; },
  gunes() { const o = this.o; return o && P.ucus === o && o.gun.a > 0.001 ? o.gun : null; },
  yavrularBende() { const o = this.o; return !!o && (o.faz === 'binis' || o.faz === 'ucus' || (o.faz === 'inis' && !o.yavruIndi)); },
  inisYer() { const o = this.o; return o && o.K ? { x: o.K.inisX, y: o.K.gy } : null; },
  buyukanne() { return BN9_BA; },
  siluetAni() { const o = this.o; return o && P.ucus === o ? clamp(o.silA / 0.72, 0, 1) : 0; },   // dunya9: uzak katmanlar biraz alçalır
  baslat(o) { o = o || this.o; if (o) { o.hazir = true; bn9Basla(o); } return o; }   // test / yedek
};
const BUYUKANNE9 = BINIS9;   // dunya9 (HARITA) bu adla okur: gunes(), siluetAni()
// Büyükanne'nin oyundaki yeri (kayalık → yolculuk → iniş → yuva). yuva.js 'yuvada' olunca oradan çizer.
const BN9_BA = { x: 0, y: 0, yon: -1, poz: 'ayakta', s: 1, vis: false, yer: 'kayalik', yuvada: false };
function bn9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function bn9Soyle(k) { if (typeof SES !== 'undefined' && SES && typeof SES.soyle === 'function') { try { SES.soyle(k); } catch (e) {} } }
function bn9V9() { return typeof V9 !== 'undefined' && V9 ? V9 : null; }
function bn9Tablo(A, v) { if (v <= 0) return A[0]; const f = v / 10, i = f | 0; if (i >= A.length - 1) return A[A.length - 1]; const u = f - i; return A[i] + (A[i + 1] - A[i]) * u; }
function bn9GunW(v) { const a = (v - BN9_GUN) / BN9_GUNW; return Math.abs(a) < 1 ? Math.pow(Math.cos(a * Math.PI / 2), 2) : 0; }   // gün batımı ağırlığı
function bn9SelW(v) { return smooth(clamp((v - BN9_SEL[0]) / 500, 0, 1)) * (1 - smooth(clamp((v - BN9_SEL[1]) / 500, 0, 1))); }
function bn9BulutW(v) { return smooth(clamp((v - 6200) / 1200, 0, 1)) * (1 - smooth(clamp((v - (BN9_LV - 2600)) / 1200, 0, 1))); }
function bn9SelamW(v) { return smooth(clamp((v - BN9_SELAM[0]) / 500, 0, 1)) * (1 - smooth(clamp((v - BN9_SELAM[1]) / 500, 0, 1))); }
function bn9HizH(v) {
  let s = BN9_V0; const a = (v - BN9_GUN) / (BN9_GUNW * 0.95); if (Math.abs(a) < 1) s = lerp(s, BN9_VG, Math.pow(Math.cos(a * Math.PI / 2), 2));
  s = lerp(s, 205, bn9SelamW(v));
  return lerp(lerp(150, s, smooth(clamp(v / 600, 0, 1))), BN9_VS, smooth(clamp((v - BN9_INISV) / 1400, 0, 1)));
}
// ── önbellekli yakın katman çizimleri (dünya biriminde; çözünürlük px/birim) ──
function bn9SelaleSpr(k) {   // yosunlu kaya sütunu ve önünden dökülen su perdesi (köken (0,0) = sütunun tepesi; aşağı 900 iner)
  return bn9Tuval('selale' + k, -170, -60, 340, 960, q => {
    const r = rng(900 + k * 77), w = k ? 130 : 150;
    const govde = () => { q.beginPath(); q.moveTo(-w, 900); q.lineTo(-w + 6, 40); q.bezierCurveTo(-w + 10, -6, -w * 0.4, -24, 0, -22); q.bezierCurveTo(w * 0.45, -24, w - 8, -8, w - 4, 36); q.lineTo(w, 900); q.closePath(); };
    q.fillStyle = bn9GL(q, -w, 0, w, 600, 0, '#4a9a78', 0.5, '#3a7f68', 1, '#3a5f62'); govde(); q.fill();
    q.save(); govde(); q.clip();
    // gün batımı ışığı: sol kenarda ılık şeftali kenar ışığı, sağda yumuşak mor gölge şeridi
    q.fillStyle = bn9GL(q, -w, 0, -w + 56, 0, 0, 'rgba(255,196,150,.6)', 1, 'rgba(255,196,150,0)'); q.fillRect(-w, -40, 60, 950);
    q.fillStyle = bn9GL(q, w - 60, 0, w, 0, 0, 'rgba(90,60,140,0)', 1, 'rgba(90,60,140,.4)'); q.fillRect(w - 62, -40, 64, 950);
    // yosunlu taş yumruları (üstü ışıklı) ve yosun lekeleri
    for (let i = 0; i < 5; i++) {
      const x = -w * 0.62 + r() * w * 1.24, y = 70 + i * 120 + r() * 50, rx = 20 + r() * 16, ry = 13 + r() * 7;
      q.fillStyle = 'rgba(30,70,60,.35)'; q.beginPath(); q.ellipse(x + 2, y + 4, rx, ry, 0, 0, 6.2832); q.fill();
      q.fillStyle = '#5aa585'; q.beginPath(); q.ellipse(x, y, rx, ry, 0, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,226,190,.35)'; q.beginPath(); q.ellipse(x - rx * 0.25, y - ry * 0.45, rx * 0.55, ry * 0.32, -0.15, 0, 6.2832); q.fill();
      q.fillStyle = '#7fcf9c'; q.beginPath(); q.ellipse(x - rx * 0.1, y - ry * 0.8, rx * 0.7, 4.5, 0, 0, 6.2832); q.fill();
    }
    q.fillStyle = 'rgba(255,255,255,.07)'; for (let i = 0; i < 9; i++) { q.beginPath(); q.ellipse(-w * 0.5 + r() * w, 60 + i * 90 + r() * 40, 16 + r() * 22, 10 + r() * 12, 0, 0, 6.2832); q.fill(); }
    // aşağıya doğru bulut rengine (lila-şeftali) solar
    q.fillStyle = bn9GL(q, 0, 330, 0, 820, 0, 'rgba(236,200,230,0)', 0.6, 'rgba(236,200,230,.55)', 1, 'rgba(246,214,226,.92)'); q.fillRect(-w - 4, 320, w * 2 + 8, 600);
    q.restore();
    q.fillStyle = '#6fd8a8'; q.beginPath(); q.moveTo(-w - 4, 34); q.bezierCurveTo(-w + 4, -14, -w * 0.4, -30, 0, -28); q.bezierCurveTo(w * 0.45, -30, w, -12, w + 4, 30);
    for (let x = w; x > -w; x -= 18) q.quadraticCurveTo(x - 9, 46 + r() * 16, x - 18, 30 + r() * 8); q.closePath(); q.fill();
    q.fillStyle = '#c8f08a'; q.beginPath(); q.ellipse(-w * 0.3, -20, w * 0.45, 8, -0.05, 0, 6.2832); q.fill();
    for (let i = 0; i < 14; i++) { const x = -w + 14 + r() * (w * 2 - 28), y = -18 + Math.abs(x) / w * 26 + r() * 6; q.fillStyle = ['#ff9fc0', '#b89cff', '#fff4c8', '#ffd27a'][i % 4]; q.beginPath(); q.arc(x, y, 3 + r() * 2.5, 0, 6.2832); q.fill(); q.fillStyle = '#fff8e0'; q.beginPath(); q.arc(x, y, 1.2, 0, 6.2832); q.fill(); }
    const sx = k ? -18 : 14, sw = k ? 56 : 70;   // su perdesi: turkuaz → beyaz köpük
    q.fillStyle = bn9GL(q, 0, 10, 0, 900, 0, 'rgba(220,255,250,.95)', 0.12, 'rgba(160,236,240,.8)', 0.6, 'rgba(120,214,230,.55)', 1, 'rgba(120,214,230,.1)');
    q.beginPath(); q.moveTo(sx - sw / 2, 8); q.quadraticCurveTo(sx - sw / 2 - 6, 300, sx - sw / 2 - 16, 900); q.lineTo(sx + sw / 2 + 16, 900); q.quadraticCurveTo(sx + sw / 2 + 6, 300, sx + sw / 2, 8); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(255,255,255,.55)'; q.lineWidth = 3; q.beginPath(); for (let i = 0; i < 6; i++) { const x = sx - sw / 2 + 6 + i * (sw - 12) / 5; q.moveTo(x, 14); q.quadraticCurveTo(x - 3, 300, x - 8 + i * 3, 900); } q.stroke();
    q.fillStyle = 'rgba(255,255,255,.9)'; for (let i = 0; i < 9; i++) { q.beginPath(); q.arc(sx - sw / 2 + i * sw / 8, 10 + r() * 4, 6 + r() * 4, 0, 6.2832); q.fill(); }
  }, 1.3);
}
function bn9SuCizgiSpr() {   // akan su çizgileri (dikey döşenir): 80×200
  return bn9Tuval('suCizgi', 0, 0, 80, 200, q => {
    const r = rng(4242); q.strokeStyle = 'rgba(255,255,255,.7)'; q.lineCap = 'round';
    for (let i = 0; i < 14; i++) { const x = 4 + r() * 72, y = r() * 200, L = 20 + r() * 40; q.lineWidth = 1.5 + r() * 2.5; q.beginPath(); q.moveTo(x, y); q.lineTo(x - 1, y + L); q.stroke(); q.beginPath(); q.moveTo(x, y - 200); q.lineTo(x - 1, y - 200 + L); q.stroke(); }
  }, 1.3);
}
function bn9AdaSpr(k) {   // uçan adacık: çimenli kubbe üst, sarkan kökler, kayalık alt, minik şelale, (bazen) çiçekli ağaççık. Köken: üst yüzeyin ortası
  return bn9Tuval('ada' + k, -150, -150, 300, 330, q => {
    const r = rng(510 + k * 13), w = [120, 96, 136][k], d = [150, 120, 165][k];
    q.strokeStyle = '#6a4a3a'; q.lineWidth = 3;
    for (let i = 0; i < 7; i++) { const x = -w * 0.7 + r() * w * 1.4; q.beginPath(); q.moveTo(x, 10); q.bezierCurveTo(x + 6, 50, x - 8, d * 0.7, x + (r() - 0.5) * 20, d * (0.8 + r() * 0.35)); q.stroke(); }
    q.fillStyle = bn9GL(q, -w, 0, w * 0.6, d, 0, '#9a7ab8', 0.5, '#6f5a96', 1, '#4a3e70');
    q.beginPath(); q.moveTo(-w, 4); q.bezierCurveTo(-w * 0.9, d * 0.5, -w * 0.3, d, 0, d); q.bezierCurveTo(w * 0.3, d, w * 0.9, d * 0.5, w, 4); q.closePath(); q.fill();
    q.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 5; i++) { q.beginPath(); q.ellipse(-w * 0.5 + r() * w, 30 + r() * d * 0.6, 14 + r() * 10, 7, 0, 0, 6.2832); q.fill(); }
    q.fillStyle = '#3fbf8a'; q.beginPath(); q.ellipse(0, 6, w + 4, 14, 0, 0, 6.2832); q.fill();
    q.fillStyle = bn9GL(q, 0, -30, 0, 12, 0, '#c8f08a', 0.5, '#6fd8a8', 1, '#3fbf8a');
    q.beginPath(); q.moveTo(-w - 6, 8); q.bezierCurveTo(-w, -22, -w * 0.4, -34, 0, -34); q.bezierCurveTo(w * 0.4, -34, w, -22, w + 6, 8); q.quadraticCurveTo(0, 22, -w - 6, 8); q.closePath(); q.fill();
    for (let i = 0; i < 10; i++) { const x = -w + 12 + r() * (w * 2 - 24), y = -26 + Math.pow(Math.abs(x) / w, 2) * 26 + r() * 6; q.fillStyle = ['#ff9fc0', '#b89cff', '#fff4c8', '#ffd27a', '#7fe0f0'][i % 5]; q.beginPath(); q.arc(x, y, 3 + r() * 2, 0, 6.2832); q.fill(); }
    if (k !== 1) {
      const tx = k ? -w * 0.35 : w * 0.3;
      q.strokeStyle = '#7a5a48'; q.lineWidth = 7; q.beginPath(); q.moveTo(tx, -26); q.quadraticCurveTo(tx + 6, -60, tx - 2, -90); q.stroke();
      for (const [ox, oy, rr, cc] of [[0, -100, 30, '#ffb8d0'], [-24, -88, 22, '#ff9fc0'], [24, -86, 22, '#ffc8dc'], [-8, -122, 20, '#ffd0e0'], [14, -114, 18, '#ff9fc0']]) { q.fillStyle = cc; q.beginPath(); q.arc(tx + ox, oy, rr, 0, 6.2832); q.fill(); }
      q.fillStyle = 'rgba(255,255,255,.5)'; q.beginPath(); q.arc(tx - 8, -112, 8, 0, 6.2832); q.fill();
    }
    const sx = k === 1 ? w * 0.6 : -w * 0.75;
    q.fillStyle = bn9GL(q, 0, 0, 0, d + 40, 0, 'rgba(230,255,252,.95)', 1, 'rgba(140,224,236,0)');
    q.beginPath(); q.moveTo(sx - 7, 4); q.quadraticCurveTo(sx - 9, 80, sx - 14, d + 40); q.lineTo(sx + 14, d + 40); q.quadraticCurveTo(sx + 9, 80, sx + 7, 4); q.closePath(); q.fill();
  }, 1.5);
}
function bn9BulutSpr(k) {   // bulut denizi şeridi (döşenebilir 1600×300): üstte gün batımıyla yanan kabarık tepeler
  return bn9Tuval('bulut' + k, 0, 0, 1600, 300, q => {
    const r = rng(77 + k * 9), ust = k ? 70 : 40;
    const c1 = k ? '#f2c4d8' : '#e4b8e8', c2 = k ? '#ffe2c8' : '#ffd6c0';
    q.fillStyle = bn9GL(q, 0, ust, 0, 300, 0, c2, 0.25, c1, 1, k ? '#c8a0d8' : '#a88ac8');
    const tepe = [];
    for (let x = -60; x < 1660; x += 70 + r() * 60) tepe.push([x, ust + r() * 40, 50 + r() * 50]);
    q.beginPath(); for (const [x, y, rr] of tepe) for (const ox of [0, 1600, -1600]) { q.moveTo(x + ox + rr, y + rr * 0.6); q.arc(x + ox, y + rr * 0.6, rr, 0, 6.2832); }
    q.rect(-10, ust + 50, 1620, 260); q.fill();
    q.fillStyle = 'rgba(255,246,220,.55)';
    q.beginPath(); for (const [x, y, rr] of tepe) for (const ox of [0, 1600, -1600]) { q.moveTo(x + ox + rr * 0.6, y + rr * 0.3); q.ellipse(x + ox - rr * 0.1, y + rr * 0.3, rr * 0.7, rr * 0.36, 0, Math.PI, 0); } q.fill();
  }, 0.8);
}
function bn9GunesSpr() {   // kocaman yumuşak gün batımı güneşi + hâle: 512 px, yarıçap 150 piksel
  if (bn9Spr.gunes) return bn9Spr.gunes;
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N; const q = c.getContext('2d'), m = N / 2, R = 150;
  let gr = q.createRadialGradient(m, m, R * 0.8, m, m, m); gr.addColorStop(0, 'rgba(255,214,150,.5)'); gr.addColorStop(0.45, 'rgba(255,170,150,.16)'); gr.addColorStop(1, 'rgba(255,160,170,0)');
  q.fillStyle = gr; q.fillRect(0, 0, N, N);
  gr = q.createRadialGradient(m - R * 0.25, m - R * 0.3, R * 0.1, m, m, R); gr.addColorStop(0, '#fffbe8'); gr.addColorStop(0.55, '#ffe6a8'); gr.addColorStop(1, '#ffc27a');
  q.fillStyle = gr; q.beginPath(); q.arc(m, m, R, 0, 6.2832); q.fill();
  return bn9Spr.gunes = { c, r: R, n: N };
}
function bn9BalonSpr(k) {   // ışık baloncuğu (k 0) / çiçek tozu (k 1): 40×40, merkez
  return bn9Tuval('balon' + k, -20, -20, 40, 40, q => {
    if (k === 0) {
      // daha davetkâr baloncuk: ılık hâle, yanardöner kalın kenar (lila → nane → altın), içinde parlayan minik altın yıldız
      q.fillStyle = bn9GR(q, 0, 0, 0, 0, 0, 20, 0, 'rgba(255,236,200,.35)', 0.55, 'rgba(230,200,255,.3)', 1, 'rgba(200,190,255,0)'); q.fillRect(-20, -20, 40, 40);
      q.fillStyle = bn9GR(q, -3, -4, 1, 0, 0, 12, 0, 'rgba(255,255,255,.45)', 0.6, 'rgba(200,245,230,.35)', 0.84, 'rgba(255,214,150,.7)', 1, 'rgba(176,140,255,.95)');
      q.beginPath(); q.arc(0, 0, 12, 0, 6.2832); q.fill();
      q.strokeStyle = 'rgba(255,255,255,.9)'; q.lineWidth = 1.3; q.beginPath(); q.arc(0, 0, 11.4, 0, 6.2832); q.stroke();
      q.strokeStyle = 'rgba(111,216,168,.8)'; q.lineWidth = 1; q.beginPath(); q.arc(0, 0, 10.2, 0.5, 2.4); q.stroke();
      q.strokeStyle = 'rgba(255,159,192,.8)'; q.beginPath(); q.arc(0, 0, 10.2, 3.3, 4.6); q.stroke();
      q.fillStyle = 'rgba(255,230,150,.55)'; q.beginPath(); q.arc(0, 1, 6.5, 0, 6.2832); q.fill();
      q.fillStyle = '#ffe08a'; q.strokeStyle = 'rgba(214,150,60,.8)'; q.lineWidth = 0.6; q.beginPath();
      for (let i = 0; i < 10; i++) { const a = -1.5708 + i * 0.6283, rr = i % 2 ? 2.1 : 4.6; q.lineTo(Math.cos(a) * rr, 1 + Math.sin(a) * rr); }
      q.closePath(); q.fill(); q.stroke();
      q.fillStyle = 'rgba(255,255,255,.95)'; q.beginPath(); q.ellipse(-4.6, -5.4, 3.6, 2, -0.6, 0, 6.2832); q.fill(); q.beginPath(); q.arc(5.4, 5.2, 1.3, 0, 6.2832); q.fill();
    } else {
      q.fillStyle = bn9GR(q, 0, 0, 0, 0, 0, 18, 0, 'rgba(255,236,170,.75)', 0.4, 'rgba(255,190,200,.25)', 1, 'rgba(255,180,200,0)'); q.fillRect(-20, -20, 40, 40);
      q.fillStyle = '#fff6d0'; for (let i = 0; i < 5; i++) { const a = i * 1.2566 - 1.5708; q.beginPath(); q.ellipse(Math.cos(a) * 4.4, Math.sin(a) * 4.4, 3.6, 2.2, a, 0, 6.2832); q.fill(); }
      q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(0, 0, 2.6, 0, 6.2832); q.fill();
    }
  }, 3);
}
function bn9TozSpr(ci) {   // parıltı (24×24)
  return bn9Tuval('toz' + ci, -12, -12, 24, 24, q => {
    const col = BN9_TOZ[ci % BN9_TOZ.length];
    q.globalAlpha = 0.5; q.fillStyle = bn9GR(q, 0, 0, 0, 0, 0, 12, 0, col, 1, mixc(col, col, 0, 0)); q.beginPath(); q.arc(0, 0, 12, 0, 6.2832); q.fill(); q.globalAlpha = 1;
    const yz = (r, f) => { q.fillStyle = f; q.beginPath(); q.moveTo(0, -r); q.quadraticCurveTo(r * 0.14, -r * 0.14, r, 0); q.quadraticCurveTo(r * 0.14, r * 0.14, 0, r); q.quadraticCurveTo(-r * 0.14, r * 0.14, -r, 0); q.quadraticCurveTo(-r * 0.14, -r * 0.14, 0, -r); q.fill(); };
    yz(8, col); yz(4, '#fffdf6');
  }, 2);
}
const BN9_EJ_RENK = ['#8a6cc0', '#b878b0', '#6f8cc4'];
function bn9EjderSpr(ci, fr) {   // uzak yetişkin ejderha: Büyükanne'nin uçuş çizimi, gün batımı rengine boyanmış yumuşak siluet (6 kanat karesi)
  const ad = 'ej' + ci + '_' + fr; if (bn9Spr[ad]) return bn9Spr[ad];
  const s = 0.5, W = 170, Hh = 120, k = 1.6, c = document.createElement('canvas'); c.width = Math.ceil(W * k); c.height = Math.ceil(Hh * k);
  const q = c.getContext('2d'); q.scale(k, k); q.translate(96, 88);
  try { buyukanneCiz(q, 0, 0, s, 0.3, { poz: 'ucus', yon: 1, kanatF: fr / 6 * 6.2832, kolye: 0, gulumse: 1 }); } catch (e) {}
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-atop'; q.globalAlpha = 0.78; q.fillStyle = BN9_EJ_RENK[ci % 3]; q.fillRect(0, 0, c.width, c.height);
  q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  return bn9Spr[ad] = { c, x0: -96, y0: -88, w: W, h: Hh };
}

// ── parçacıklar (sanal konumda; havuz) ──
const BN9_TOZN = 220, bn9Toz = []; for (let i = 0; i < BN9_TOZN; i++) bn9Toz.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, c: 0, s: 1, g: 20 });
let bn9TozI = 0;
function bn9DX() { return BINIS9.o ? BINIS9.o.dx || 0 : 0; }
function bn9TozAt(wx, wy, vx, vy, life, ci, s, gr) { const p = bn9Toz[bn9TozI]; bn9TozI = (bn9TozI + 1) % BN9_TOZN; p.x = wx - bn9DX(); p.y = wy; p.vx = vx; p.vy = vy; p.l = p.m = life; p.c = ci; p.s = s; p.g = gr === undefined ? 20 : gr; }
function bn9TozPatla(x, y, n, hiz, ci0) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.35 + Math.random() * 0.75); bn9TozAt(x, y, Math.cos(a) * v, Math.sin(a) * v * 0.85 - 20, 0.7 + Math.random() * 0.8, ci0 === undefined ? i % BN9_TOZ.length : ci0, 2.2 + Math.random() * 3); } }
function bn9ParcaAdim(dt) { const k = Math.exp(-dt * 1.6); for (const p of bn9Toz) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= k; p.vy = p.vy * k + p.g * dt; } }

// ── kurulum ──
function bn9Kur(o) {
  const B = (typeof BOLUM !== 'undefined' && (BOLUM.binis || BOLUM.ucus)) || {};
  const al = k => Number.isFinite(B[k]) ? B[k] : null;
  const inisX = al('inisX') !== null ? al('inisX') : o.x + 164 * T;
  const gy = al('inisY') !== null ? al('inisY') : o.y;
  o.ky = o.y; o.kx = o.x + 10;
  const xs = o.kx, xEnd = Math.max(xs + 1800, inisX + 150);
  // sanal → dünya: dw/dv = 1 − (1 − r)·m(v); m başta ve sonda 0 (birebir: kayalık ve yuva yakın katmanla aynı hızda), ortada 1
  const n = Math.ceil((BN9_LV + 2000) / 10) + 2, X = new Float32Array(n), m = v => smooth(clamp((v - 250) / 1100, 0, 1)) * (1 - smooth(clamp((v - (BN9_LV - 1700)) / 1300, 0, 1)));
  let M = 0; for (let i = 0; i < BN9_LV / 10; i++) M += m(i * 10 + 5) * 10;
  const r = clamp(1 - (BN9_LV - (xEnd - xs)) / Math.max(1, M), 0.05, 1);
  let acc = 0; for (let i = 0; i < n; i++) { X[i] = acc; acc += (1 - (1 - r) * m(i * 10 + 5)) * 10; }
  o.K = { xs, xEnd, inisX, gy, r, X, yUst: al('yUst') !== null ? al('yUst') : o.y - 640, yAlt: al('yAlt') !== null ? al('yAlt') : o.y };
  bn9SeritKur(o); bn9KatmanKur(o); bn9DiziKur(o);
  o.faz = 'bekle'; o.hazir = false; o.done = false; o.t = 0; o.total = 0; o.ft = 0; o.v = 0; o.vOn = 0; o.dx = xs; o.dxOn = xs; o.ddx = xs; o.spd = 0; o.off = 0; o.uV = 0;
  o.bas = false; o.idle = 0; o.yardimA = 0; o.ipucu = 0; o.vinT = 0; o.selT = 0; o.n = 0; o.sevT = 0; o.salla = 0; o.parla = 0; o.tk = 0; o.bt = 0;
  o.bx = o.kx; o.by = o.ky; o.byOn = o.ky; o.rot = 0; o.bob = 0; o.dbx = o.bx; o.dby = o.by; o.pX = P.x; o.pXOn = P.x; o.pY = P.y; o.pYOn = P.y;
  o.kf = 0; o.kfH = 1.1; o.kanatG = 1; o.yan = 0; o.yon = -1; o.prX = o.kx - 100; o.prY = o.ky - 300; o.prW = 0; o.fsX = o.kx - 260; o.fsY = o.ky - 260;
  o.kamY = o.ky - 160; o.kor = null; o.korEski = null; o.olay = {}; o.yavru = []; o.yavruIndi = false; o.indi = false;
  o.gun = { x: 0, y: 0, r: 0, a: 0 }; o.silA = 0; o.ej = []; for (let i = 0; i < 3; i++) o.ej.push({ x: 0, y: 0, a: 0, s: 0.42 + i * 0.1, f: i * 2.1, sel: 0 });
  o.fzOpt = { el: { x: 0, y: 0 }, vy: 0, aci: 0, ruzgar: 0.8, sevinc: 0, salla: 0 };
  o.bOpt = { poz: 'kucak', yon: -1, kanat: 0.6, kanatF: 0, gulumse: 0.8, kolye: 5, isik: 0.45, sar: 0, aci: 0, bakX: -0.6, bakY: 0.15 };
  o.yOpt = { renk: 'nane', yon: 1, mutlu: 1, kanat: 0, ucus: 0, otur: 1, kabuk: 1, ziplama: 0, agiz: 0 };
  o.fsOpt = { renk: 'fistik', yon: 1, mutlu: 1, kanat: 0, ucus: 1, kanatAc: 1, kabuk: 0 };
  o.sirt = {}; o.sirt2 = {}; o.adim = (dt, input) => bn9Adim(o, dt, input);
  o.yuvaX = typeof BOLUM !== 'undefined' && BOLUM.yuva && Number.isFinite(BOLUM.yuva.x) ? BOLUM.yuva.x + 190 : inisX + 1500;
  o.yuvaY = typeof BOLUM !== 'undefined' && BOLUM.yuva && Number.isFinite(BOLUM.yuva.y) ? BOLUM.yuva.y : gy;
  if (typeof yuzey === 'function') { try { const v = yuzey(Math.floor(o.yuvaX / T)); if (Number.isFinite(v) && v < ROWS * T) o.yuvaY = v; } catch (e) {} }
  BINIS9.o = o;
  BN9_BA.x = o.kx; BN9_BA.y = o.ky; BN9_BA.yon = -1; BN9_BA.poz = 'kucak'; BN9_BA.s = BN9_S; BN9_BA.vis = false; BN9_BA.yer = 'kayalik'; BN9_BA.yuvada = false;
}
function bn9Esle(o, v) { return bn9Tablo(o.K.X, v); }
function bn9SeritKur(o) {   // Büyükanne'nin (karnının altı) şerit yüksekliği, dünya y
  const n = Math.ceil((BN9_LV + 2000) / 10) + 2, A = new Float32Array(n), y0 = o.ky, yI = o.K.gy;
  for (let i = 0; i < n; i++) {
    const v = i * 10; let y = y0;
    y += (430 - y0) * smooth(clamp(v / 1200, 0, 1));                                   // kalkış: kayalıktan yükseliş
    y += 26 * Math.sin((v - 1200) / 700) * smooth(clamp((v - 1200) / 600, 0, 1)) * (1 - smooth(clamp((v - 3600) / 500, 0, 1)));
    y += -40 * smooth(clamp((v - 3700) / 900, 0, 1)) + 44 * Math.sin((v - 3900) / 520) * smooth(clamp((v - 3900) / 500, 0, 1)) * (1 - smooth(clamp((v - 6600) / 500, 0, 1)));
    y += -30 * smooth(clamp((v - 6900) / 1000, 0, 1));                                 // bulut denizinin üstüne
    y += 30 * smooth(clamp((v - 9600) / 800, 0, 1));
    y += (yI - 430) * smooth(clamp((v - (BN9_LV - 1900)) / 1900, 0, 1));               // iniş
    A[i] = y;
  }
  o.LN = A;
}
function bn9Serit(o, v) { return bn9Tablo(o.LN, v); }
function bn9KatmanKur(o) {   // yakın katman: şelale sütunları ve uçan adacıklar (sanal konumlarda)
  const r = rng(9191), S = [], A = [];
  for (let v = BN9_SEL[0] + 250; v < BN9_SEL[1] + 300; v += 380 + r() * 220) S.push({ v, k: (r() * 2) | 0, y: bn9Serit(o, v) + 150 + r() * 70, sc: 0.9 + r() * 0.3, f: r() * 6 });
  let ust = false;
  for (let v = BN9_ADA[0] + 350; v < BN9_ADA[1]; v += 340 + r() * 180) { const ln = bn9Serit(o, v); A.push({ v, k: (r() * 3) | 0, y: ust ? ln - 380 - r() * 50 : ln + 110 + r() * 70, sc: ust ? 0.7 + r() * 0.15 : 0.9 + r() * 0.3, f: r() * 6, flip: r() < 0.5 }); ust = !ust && r() < 0.6; }
  o.selaleler = S; o.adalar = A;
}
function bn9DiziKur(o) {
  const L = [];
  const ekle = (v, lift, tip) => L.push({ v, lift, tip, d: 'bekle', t: 0, ek: 0, faz: L.length * 1.37, yD: 0, rx: 0, ry: 0, yardim: false });
  for (const D0 of BN9_DIZI) {
    const [b, v, tip, h] = D0;
    if (b === 'cizgi') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h, tip);
    else if (b === 'yay') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * Math.sin(Math.PI * i / (D0[4] - 1)), tip);
    else if (b === 'dalga') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * (i % 2 ? 1 : -1), tip);
    else if (b === 'merdiven') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * i, tip);
    else if (b === 'halka') { ekle(v, h, 'b'); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832 + 0.52; ekle(v + Math.cos(a) * D0[4], h + Math.sin(a) * D0[4], 'p'); } }
  }
  L.sort((a, b) => a.v - b.v);
  o.dizi = L; o.top = L.length;
}
const BN9_ISIT = [];
function bn9IsitHepsi() {   // önbellekleri karelere yay (her çağrıda bir parça); hepsi hazırsa true
  if (!BN9_ISIT.length) {
    BN9_ISIT.push(() => bn9Isit(true), () => bn9SelaleSpr(0), () => bn9SelaleSpr(1), bn9SuCizgiSpr, () => bn9AdaSpr(0), () => bn9AdaSpr(1), () => bn9AdaSpr(2),
      () => bn9BulutSpr(0), () => bn9BulutSpr(1), bn9GunesSpr, () => bn9BalonSpr(0), () => bn9BalonSpr(1));
    for (let i = 0; i < BN9_TOZ.length; i++) BN9_ISIT.push(() => bn9TozSpr(i));
    for (let c = 0; c < 3; c++) for (let f = 0; f < 6; f++) BN9_ISIT.push(() => bn9EjderSpr(c, f));
    BN9_ISIT.i = 0;
  }
  if (BN9_ISIT.i >= BN9_ISIT.length) return true;
  BN9_ISIT[BN9_ISIT.i++](); return BN9_ISIT.i >= BN9_ISIT.length;
}
// ── yavrular: hangi renkler çıktı ──
function bn9YavruListe(o) {
  const L = o.yavru; L.length = 0;
  let src = null;
  if (typeof yavruListesi === 'function') { try { src = yavruListesi(); } catch (e) { src = null; } }
  else if (typeof YAVRU9 !== 'undefined' && YAVRU9 && typeof YAVRU9.takipciler === 'function') { try { src = YAVRU9.takipciler(); } catch (e) { src = null; } }
  if (src && src.length) { for (let i = 0; i < Math.min(6, src.length); i++) { const y = src[i] || {}; L.push({ renk: y.renk || 'nane', x0: Number.isFinite(y.x) ? y.x : P.x - 40 - i * 30, y0: Number.isFinite(y.y) ? y.y : P.y, u: 0, gec: 0.32 + i * 0.07 }); } }
  else {
    const V = bn9V9(), n = V ? clamp(V.yavru | 0, 0, 6) : 0, R = ['nane', 'seftali', 'gok', 'limon', 'gul', 'lila'];
    const Y = NESNELER.filter(q => q.tip === 'ejderYumurta').sort((a, b) => (a.sira || 0) - (b.sira || 0));
    for (let i = 0; i < n; i++) L.push({ renk: (Y[i] && Y[i].renk) || R[i], x0: P.x - 40 - i * 30, y0: P.y, u: 0, gec: 0.32 + i * 0.07 });
  }
}
function bn9Basla(o) {
  if (!o || o.done || o.faz !== 'bekle' || !o.hazir || P.ucus || DURUM !== 'oyun' || P.fade > 0) return;
  if (typeof D !== 'undefined' && D.mode === 'tasi') return;
  while (!bn9IsitHepsi());
  o.faz = 'binis'; o.t = 0; o.total = 0; o.px0 = P.x; o.py0 = P.y; o.idle = 0; o.bas = false; o.oturdu = false;
  o.v = 0; o.vOn = 0; o.dx = o.K.xs; o.dxOn = o.dx; o.ddx = o.dx; o.spd = 0; o.off = 0; o.uV = 0; o.bx = o.kx; o.by = o.ky; o.yan = 0; o.yon = 1;
  P.ucus = o; P.vx = P.vy = 0; P.kilit = 0; P.fade = 0; P.buf = 0; BINIS9.o = o;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  bn9YavruListe(o);
  o.prX = typeof D !== 'undefined' && Number.isFinite(D.x) ? D.x : P.x - 70; o.prY = typeof D !== 'undefined' && Number.isFinite(D.y) ? D.y : P.y - 90;
  o.fsX = o.prX - 80; o.fsY = o.prY - 40;
  if (typeof BOLUM !== 'undefined' && (BOLUM.binis || BOLUM.ucus)) { o.kor = BOLUM.binis || BOLUM.ucus; o.korEski = { yUst: o.kor.yUst, yAlt: o.kor.yAlt }; }
  o.kamY = o.ky - 60; bn9Koridor(o);
  BN9_BA.yer = 'ucus'; BN9_BA.vis = true;
  OLAY.emit('binisBasla', { o, top: o.top });
  bn9Soyle('p_e_binis_giris');
}
function bn9Koridor(o) { if (o.kor) { o.kor.yUst = o.kamY - 330; o.kor.yAlt = o.kamY + 190; } }
function bn9Olay(o, ad, veri) { if (o.olay[ad]) return; o.olay[ad] = true; OLAY.emit(ad, veri || { o }); }
function bn9Koltuk(o, i, out) { return buyukanneSirt(i, BN9_SU, o.rot, 1, out); }
function bn9Oturt(o) { const S = o.sirt; bn9Koltuk(o, 0, S); P.x = o.bx + S.x; P.y = o.by + o.bob + S.y; }
// ── her fizik adımı (P.ucus === o iken motor çağırır) ──
function bn9Adim(o, dt, input) {
  if (!(dt > 0) || !Number.isFinite(dt) || DURUM !== 'oyun' || P.ucus !== o) return;
  dt = Math.min(dt, 0.05);
  const K = o.K, basili = !!(input && (input.basili || input.eksenY < 0)), S = o.sirt;
  o.t += dt; o.total += dt; o.ft += dt;
  o.sevT = Math.max(0, o.sevT - dt); o.parla = Math.max(0, o.parla - dt * 0.8); o.vinT = Math.max(0, o.vinT - dt); o.selT = Math.max(0, o.selT - dt);
  if (o.tk > 0) { o.tk += dt / 0.9; if (o.tk >= 1) o.tk = 0; }
  P.vx = P.vy = 0; P.ground = false; P.f = 1;
  if (o.faz === 'binis') {
    const u = clamp(o.t / BN9_BINIS, 0, 1);
    o.yan = smooth(clamp((u - 0.1) / 0.14, 0, 1));                    // önden → yandan dönüş (parıltıyla)
    if (u > 0.1 && !o.olay.dondu) { o.olay.dondu = true; bn9TozPatla(o.bx + 30, o.by - 140, 26, 170); bn9Sfx('buyukanneGul', 0); }
    o.bob = Math.sin(clamp((u - 0.2) / 0.6, 0, 1) * Math.PI) * 8;      // binerken hafif çömelir
    o.kf += dt * 2.2; o.kanatG = 0.3;
    bn9Koltuk(o, 0, S);
    const atla = smooth(clamp((u - 0.2) / 0.36, 0, 1));
    if (atla >= 1 && !o.oturdu) { o.oturdu = true; o.sevT = 1.2; bn9TozPatla(o.bx + S.x, o.by + S.y - 20, 18, 140); bn9Sfx('binisKalk', 0); }
    P.x = lerp(o.px0, o.bx + S.x, atla); P.y = lerp(o.py0, o.by + o.bob + S.y, atla) - Math.sin(atla * Math.PI) * 80;
    for (let i = 0; i < o.yavru.length; i++) { const Y = o.yavru[i]; Y.u = smooth(clamp((u - Y.gec) / 0.3, 0, 1)); }
    if (u >= 1) { o.faz = 'ucus'; o.t = 0; o.idle = 0; o.spd = 0; o.uV = 90; o.off = 0; o.byOn = o.by; bn9Sfx('buyukanneKanat', 0); bn9Soyle('bn_binis'); }
    o.kamY = lerp(o.kamY, o.ky - 60, 1 - Math.exp(-dt * 2));
  } else if (o.faz === 'ucus') {
    o.spd = lerp(o.spd, bn9HizH(o.v), 1 - Math.exp(-dt * (o.v < 500 ? 1.1 : 1.6)));
    o.vOn = o.v; o.v += o.spd * dt;
    o.dxOn = o.dx; o.bx = K.xs + bn9Esle(o, o.v); o.dx = o.bx - o.v;
    const lane = bn9Serit(o, o.v), gw = bn9GunW(o.v), son = smooth(clamp((o.v - (BN9_LV - 1600)) / 1300, 0, 1)), bas0 = smooth(clamp(o.v / 800, 0, 1));
    const ust = BN9_UST * (1 - 0.75 * gw) * (1 - son) * lerp(0.4, 1, bas0), alt = BN9_ALT * (1 - 0.6 * gw) * (1 - son) * smooth(clamp((o.v - 900) / 700, 0, 1));
    const yardim = o.idle >= BN9_YARDIM;
    if (basili && !o.bas) { o.idle = 0; if (o.vinT <= 0) { bn9Sfx('binisVin', 1); o.vinT = 1.2; } }
    if (basili) { o.idle = 0; o.uV = Math.min(o.uV + 720 * dt, 210); }
    else {
      o.idle += dt;
      if (yardim) { const r = bn9Sonraki(o); let h = 0; if (r && r.v - o.v < 1000) h = r.lift + (lane - bn9Serit(o, r.v)); o.uV = lerp(o.uV, clamp((h - o.off) * 2.4, -120, 160), 1 - Math.exp(-dt * 4)); }
      else o.uV = Math.max(o.uV - 340 * dt, -60);
    }
    if (yardim && !o.olay.binisYardim) bn9Olay(o, 'binisYardim');
    if (!yardim && o.olay.binisYardim && o.idle < 1) o.olay.binisYardim = false;
    o.yardimA = lerp(o.yardimA, yardim ? 1 : 0, 1 - Math.exp(-dt * 3));
    o.bas = basili;
    if (gw > 0.02) o.off = lerp(o.off, 20, 1 - Math.exp(-dt * 1.6 * gw));   // gün batımında güneşin ortasına süzülür
    o.off += o.uV * dt;
    if (o.off > ust) { o.off = lerp(o.off, ust, 1 - Math.exp(-dt * 7)); if (o.uV > 0) o.uV *= Math.exp(-dt * 6); }
    if (o.off < alt) { o.off = lerp(o.off, alt, 1 - Math.exp(-dt * 7)); if (o.uV < 0) o.uV *= Math.exp(-dt * 6); }
    o.byOn = o.by; o.by = clamp(lane - o.off, K.yUst + 260, K.yAlt + 40);
    const vy = (o.by - o.byOn) / dt;
    o.rot = lerp(o.rot, clamp(Math.atan2(vy, Math.max(o.spd, 90)) * 0.55, -0.22, 0.2), 1 - Math.exp(-dt * 4));
    // kanat: yükselirken hızlı ve güçlü çırpar, süzülürken yavaş ve geniş (gün batımında ağır, görkemli)
    o.kfH = lerp(o.kfH, basili ? 1.7 : vy > 40 ? 0.55 : lerp(1.05, 0.6, gw), 1 - Math.exp(-dt * 3));
    const kf0 = o.kf; o.kf += dt * o.kfH * 6.2832; o.kanatG = lerp(o.kanatG, basili ? 1 : lerp(0.75, 0.55, gw), 1 - Math.exp(-dt * 3));
    if (basili && Math.floor(kf0 / 6.2832) !== Math.floor(o.kf / 6.2832)) bn9Sfx('buyukanneKanat', 1);
    o.bob = Math.sin(o.kf - 1.2) * 5 * o.kanatG * (1 - son * 0.6);
    o.fzOpt.vy = vy * 0.35;
    o.salla = lerp(o.salla, bn9SelamW(o.v) > 0.5 || gw > 0.75 ? 1 : 0, 1 - Math.exp(-dt * 3));
    bn9GunAdim(o); bn9EjderAdim(o, dt);
    bn9Toplar(o, dt, yardim);
    bn9IzAt(o, dt);
    if (o.v > 250) bn9Olay(o, 'binisKalk');
    if (o.v > BN9_SEL[0] + 300) bn9Olay(o, 'binisSelale');
    const sw = bn9SelW(o.v); if (sw > 0.3 && o.selT <= 0) { bn9Sfx('selaleSu', sw); o.selT = 1.1; }
    if (o.v > BN9_ADA[0] + 400) bn9Olay(o, 'binisAdalar');
    if (o.v > BN9_GUN - 900 && !o.olay.binisGunbatimi) { bn9Olay(o, 'binisGunbatimi'); bn9Soyle('p_e_binis'); bn9Sfx('ruzgar9', 0); }
    if (o.v > BN9_SELAM[0] + 300 && !o.olay.binisSelam) { bn9Olay(o, 'binisSelam'); bn9Sfx('ejderSelam', 0); bn9Soyle('bn_selam'); }
    bn9Oturt(o);
    const kOfs = -20 * gw + 30 * smooth(clamp((o.v - (BN9_LV - 1400)) / 1400, 0, 1));
    o.kamY = lerp(o.kamY, lerp(lane, o.by, 0.6) - 40 + kOfs, 1 - Math.exp(-dt * 2.2));
    if (o.v >= BN9_LV) bn9InisBasla(o);
  } else if (o.faz === 'inis') {
    const u = clamp(o.t / BN9_INIS, 0, 1);
    o.spd = lerp(o.spd, 0, 1 - Math.exp(-dt * 2.4));
    o.vOn = o.v; o.v += o.spd * dt; o.dxOn = o.dx;
    o.bx = lerp(o.bx, K.xEnd, 1 - Math.exp(-dt * 3)); o.dx = o.bx - o.v;
    o.byOn = o.by; o.by = lerp(o.by, K.gy, 1 - Math.exp(-dt * (u > 0.3 ? 6 : 2.5)));
    o.rot = lerp(o.rot, 0, 1 - Math.exp(-dt * 4));
    o.kfH = lerp(o.kfH, u < 0.45 ? 1.3 : 0.2, 1 - Math.exp(-dt * 3)); o.kf += dt * o.kfH * 6.2832; o.kanatG = lerp(o.kanatG, u < 0.45 ? 1 : 0.2, 1 - Math.exp(-dt * 3));
    o.bob = Math.sin(o.kf - 1.2) * 4 * (1 - u);
    if (u > 0.42 && !o.olay.kondu) { o.olay.kondu = true; bn9Sfx('binisInis', 0); bn9TozPatla(o.bx, K.gy - 10, 26, 170); ripples.push({ x: o.bx, y: K.gy - 30, r: 0, life: 1.4 }); }
    o.yan = 1 - smooth(clamp((u - 0.5) / 0.14, 0, 1));
    if (u > 0.5 && !o.olay.dondu2) { o.olay.dondu2 = true; bn9TozPatla(o.bx, o.by - 140, 22, 150); bn9Sfx('buyukanneGul', 1); }
    o.yon = u > 0.5 ? -1 : 1;
    bn9Koltuk(o, 0, S);
    const atla = smooth(clamp((u - 0.46) / 0.3, 0, 1));
    P.x = lerp(o.bx + S.x, K.inisX, atla); P.y = lerp(o.by + o.bob + S.y, K.gy, atla) - Math.sin(atla * Math.PI) * 70;
    if (atla >= 1 && !o.indi) { o.indi = true; o.sevT = 1.2; bn9TozPatla(K.inisX, K.gy - 8, 16, 120); }
    for (let i = 0; i < o.yavru.length; i++) { const Y = o.yavru[i]; Y.u = 1 - smooth(clamp((u - 0.4 - i * 0.015) / 0.24, 0, 1)); }
    if (u > 0.94) o.yavruIndi = true;
    bn9GunAdim(o); bn9EjderAdim(o, dt); bn9Toplar(o, dt, false); bn9IzAt(o, dt);
    o.kamY = lerp(o.kamY, K.gy - 90, 1 - Math.exp(-dt * 2.4));
    bn9Koridor(o); bn9PirilAdim(o, dt);
    o.pXOn = o.pX; o.pX = P.x; o.pYOn = o.pY; o.pY = P.y; o.x = P.x;
    if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
    if (u >= 1) bn9Bitir(o);
    return;
  }
  bn9Koridor(o); bn9PirilAdim(o, dt);
  o.pXOn = o.pX; o.pX = P.x; o.pYOn = o.pY; o.pY = P.y; o.x = P.x;
  if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
}
function bn9InisBasla(o) { o.faz = 'inis'; o.t = 0; o.indi = false; bn9Olay(o, 'binisInisBasla'); }
function bn9Bitir(o) {
  const K = o.K;
  P.x = K.inisX; P.y = K.gy; P.vx = P.vy = 0; P.ground = true; P.safeX = P.x; P.safeY = P.y; P.ucus = null; P.dj = true; P.buf = 0; P.fade = 0; P.f = 1;
  if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; D.vx = D.vy = 0; }
  o.done = true; o.faz = 'bitti'; o.t = 0; o.bt = 0; o.spd = 0; o.x = o.bx; o.gun.a = 0; o.yavruIndi = true; o.yan = 0; o.yon = -1; o.silA = 0;
  if (o.kor && o.korEski) { o.kor.yUst = o.korEski.yUst; o.kor.yAlt = o.korEski.yAlt; }
  const V = bn9V9(); if (V) V.binis = true;
  BN9_BA.x = o.bx; BN9_BA.y = K.gy; BN9_BA.yon = -1; BN9_BA.poz = 'ayakta'; BN9_BA.yer = 'inis'; BN9_BA.vis = true;
  OLAY.emit('binisBitti', { o, n: o.n, top: o.top, x: K.inisX, y: K.gy });
  bn9Soyle('p_e_binis_bitti');
}
// ── ışıklar: konum, mıknatıs, toplama ──
function bn9ItemY(o, r) { return bn9Serit(o, r.v) - 150 - r.lift; }
function bn9Sonraki(o) { const L = o.dizi; for (let i = 0; i < L.length; i++) { const r = L[i]; if (r.d === 'bekle' && r.v > o.v + 10) return r; } return null; }
function bn9Toplar(o, dt, yardim) {
  const fx = o.v + 40, fy = o.by + o.bob - 150, L = o.dizi;
  for (let i = 0; i < L.length; i++) {
    const r = L[i];
    if (r.d === 'bitti') continue;
    r.t += dt;
    if (r.d === 'alindi') { if (r.t > 0.6) r.d = 'bitti'; continue; }
    if (r.d === 'kacti') { if (r.t > 2.2) r.d = 'bitti'; continue; }
    const dv = r.v - fx; if (dv > 900) break;
    const y0 = bn9ItemY(o, r), dy = fy - y0;
    let w = 0; if (dv > -60 && dv < 220 && Math.abs(dy) < 150) w = smooth(1 - clamp(dv, 0, 220) / 220) * 0.7;
    r.ek = lerp(r.ek, w, 1 - Math.exp(-dt * 6)); r.yD = y0 + dy * r.ek;
    if (yardim && dv > 0 && dv < 700) r.yardim = true;
    if (dv < 60 && dv > -90) {
      const d = Math.abs(fy - r.yD);
      if (d < 110) bn9Topla(o, r, 'feza');
      else if (r.yardim && d < 200) bn9Topla(o, r, 'piril');
    } else if (dv <= -90) { r.d = 'kacti'; r.t = 0; }
  }
  o.ipucu = lerp(o.ipucu, o.idle >= BN9_IPUCU && o.idle < BN9_YARDIM ? 1 : 0, 1 - Math.exp(-dt * 2));
}
function bn9Topla(o, r, kim) {
  r.d = 'alindi'; r.t = 0; o.sevT = 0.9; o.n++; o.parla = Math.min(1.4, o.parla + 0.45);
  const x = r.v + o.dx, y = r.yD; r.rx = x - o.bx; r.ry = y - o.by;
  if (!(o.tk > 0) && (kim === 'piril' || o.n % 5 === 0)) o.tk = 0.001;
  bn9TozPatla(x, y, 14, 150, r.tip === 'b' ? 4 : 1); bn9TozPatla(x, y, 6, 60, 0);
  bn9Sfx('binisIsik', o.n);
  OLAY.emit('binisIsik', { n: o.n, top: o.top, x, y, kim, o });
}
function bn9IzAt(o, dt) {   // kanat uçlarından dökülen ışık tozu
  const K = BN9_K * BN9_SU; let k = dt * (14 + o.parla * 30);
  while (k > 0) { if (k >= 1 || Math.random() < k) bn9TozAt(o.bx - 20 * K + (Math.random() - 0.5) * 60, o.by - 24 * K - 40 * Math.max(0, Math.sin(o.kf)) + (Math.random() - 0.5) * 30, -40 - Math.random() * 40, 10 + Math.random() * 20, 0.9 + Math.random() * 0.8, (Math.random() * BN9_TOZ.length) | 0, 1.8 + Math.random() * 2, 14); k -= 1; }
}
function bn9GunAdim(o) {   // gün batımı güneşi: yolculuğun ortasında kocaman olur, Büyükanne'nin arkasından geçer
  const v = o.v, G = o.gun, VHg = VH / cam.zoom, gw = bn9GunW(v);
  const a = smooth(clamp((v - 5400) / 1600, 0, 1)) * (1 - smooth(clamp((v - 10800) / 2200, 0, 1)));
  const fx = v < BN9_GUN ? lerp(0.85, 0.5, smooth(clamp((v - 5400) / (BN9_GUN - 5400), 0, 1))) : lerp(0.5, 0.12, smooth(clamp((v - BN9_GUN) / 3000, 0, 1)));
  G.r = VHg * lerp(0.2, 0.34, gw);
  G.x = lerp(cam.x + VW * fx, o.bx + 60, gw * 0.8); G.y = lerp(cam.y + VHg * 0.6, o.by - 150, gw * 0.8); G.a = a;
}
function bn9EjderAdim(o, dt) {   // uzak ejderhalar: gün batımından sonra yanımıza süzülür, kanat sallayıp "uuu" der, sonra göğe ayrılır
  const v = o.v, gir = smooth(clamp((v - (BN9_SELAM[0] - 700)) / 900, 0, 1)), cik = smooth(clamp((v - BN9_SELAM[1]) / 900, 0, 1)), VHg = VH / cam.zoom;
  const OF = [[0.22, 0.16], [0.52, 0.09], [0.8, 0.2]];
  for (let i = 0; i < 3; i++) {
    const E = o.ej[i], gi = smooth(clamp(gir * 1.3 - i * 0.12, 0, 1)), ci = smooth(clamp(cik * 1.3 - (2 - i) * 0.1, 0, 1));
    const tx = cam.x + VW * OF[i][0] + Math.sin(o.total * 0.4 + i * 2) * 30, ty = cam.y + VHg * OF[i][1] + Math.sin(o.total * 0.7 + i * 1.3) * 14;
    E.x = lerp(cam.x + VW + 300 + i * 120, tx, gi) - ci * (500 + i * 100); E.y = lerp(ty + 60, ty, gi) - ci * (220 + i * 60);
    E.a = gi * (1 - ci); E.f += dt * (0.8 + i * 0.1); E.sel = bn9SelamW(v);
  }
}
function bn9PirilAdim(o, dt) {   // Pırıl yanında uçar; ipucunda baloncuğun çevresinde döner; yardımda kurdeleyle çeker. Fıstık arkada uçar
  const K = BN9_K * BN9_SU, bx = o.bx, by = o.by + o.bob;
  let evX = bx + 38 * K + Math.sin(o.total * 1.1) * 14, evY = by - 74 * K + Math.sin(o.total * 2.0) * 8;   // başının üstünde-önünde yol gösterir (ağzının önüne düşmez)
  if (o.faz === 'binis') { evX = bx + 26 * K; evY = by - 62 * K; }
  if (o.faz === 'inis') { const u = clamp(o.t / BN9_INIS, 0, 1); evX = lerp(evX, o.K.inisX - 80, smooth(u)); evY = lerp(evY, o.K.gy - 110, smooth(u)); }
  if (o.tk > 0) evY -= Math.sin(o.tk * Math.PI) * 26;
  let w = 0, hx = evX, hy = evY;
  if (o.faz === 'ucus') {
    if (o.yardimA > 0.05) { w = o.yardimA; hx = bx + 96 * K + Math.sin(o.total * 1.6) * 8; hy = by - 20 * K + Math.sin(o.total * 2.6) * 7; }
    else if (o.ipucu > 0.05) { const r = bn9Sonraki(o); if (r) { const uz = r.v - o.v; if (uz < 900) { const a = o.total * 2.6; w = o.ipucu * 0.85 * smooth(clamp((900 - uz) / 400, 0, 1)); hx = r.v + o.dx + Math.cos(a) * 44; hy = bn9ItemY(o, r) + Math.sin(a) * 36; } } }
  }
  o.prW = lerp(o.prW, w, 1 - Math.exp(-dt * 3));
  const tx = lerp(evX, hx, o.prW), ty = lerp(evY, hy, o.prW), k = 1 - Math.exp(-dt * (o.faz === 'binis' ? 3 : 4.5));
  o.prX = lerp(o.prX, tx, k); o.prY = lerp(o.prY, ty, k);
  if (o.prW > 0.3 && Math.random() < dt * 14) bn9TozAt(o.prX - 14, o.prY + 6, -40, 10, 0.6, 4, 1.8);
  const fx = bx - 46 * K + Math.sin(o.total * 0.9) * 20, fy = by - 50 * K + Math.sin(o.total * 1.7 + 1) * 12, kf = 1 - Math.exp(-dt * 2.6);
  o.fsX = lerp(o.fsX, o.faz === 'inis' ? o.K.inisX - 160 : fx, kf); o.fsY = lerp(o.fsY, o.faz === 'inis' ? o.K.gy - 60 : fy, kf);
}

// ── çizim: güneş, uzak ejderhalar, bulut denizi, şelaleler, adacıklar (yakın katman; sanal konum + ddx) ──
function bn9GunesCiz(o) {   // dunya9 kendi güneşini BUYUKANNE9.gunes()'e kaydırıyorsa (dn9Gunes var) yalnız hâle; yoksa güneş burada
  const G = o.gun; if (!(G.a > 0.01)) return;
  if (typeof dn9Gunes !== 'function') { const sp = bn9GunesSpr(), s = sp.n * G.r / sp.r; g.globalAlpha = G.a; g.drawImage(sp.c, G.x - s / 2, G.y - s / 2, s, s); g.globalAlpha = 1; }
  const gw = bn9GunW(o.v);
  if (gw > 0.02) { g.globalCompositeOperation = 'lighter'; dglow('#ffb08a', G.x, G.y, G.r * 3.2, 0.22 * gw * G.a); g.globalCompositeOperation = 'source-over'; }
}
function bn9EjderCiz(o, tm) {
  for (let i = 0; i < 3; i++) {
    const E = o.ej[i]; if (E.a < 0.02) continue;
    const fr = ((E.f * 6) | 0) % 6, sp = bn9EjderSpr(i, fr), s = E.s * (1 + 0.08 * E.sel * Math.sin(tm * 3 + i));
    g.save(); g.translate(E.x, E.y); g.rotate(-0.05 + Math.sin(tm * 0.8 + i) * 0.05 - 0.12 * E.sel * Math.max(0, Math.sin(tm * 2.4 + i * 1.4)));   // selam: kanat sallayıp hafif yatar
    g.scale(-s, s); g.globalAlpha = E.a * 0.85; g.drawImage(sp.c, sp.x0, sp.y0, sp.w, sp.h); g.globalAlpha = 1; g.restore();
    if (E.sel > 0.05) { g.globalCompositeOperation = 'lighter'; dglow('#fff0d0', E.x - 60 * s, E.y - 40 * s, 40, 0.25 * E.sel * E.a * (0.5 + 0.5 * Math.sin(tm * 3 + i))); g.globalCompositeOperation = 'source-over'; }
  }
}
function bn9BulutCiz(o, kat) {   // bulut denizi şeridi (kat 0 uzak, 1 yakın): ekran altına döşenir, sanal yolla kayar
  const w = bn9BulutW(o.v); if (w < 0.02) return;
  const sp = bn9BulutSpr(kat), VHg = VH / cam.zoom, hiz = kat ? 0.85 : 0.45, y = cam.y + VHg - (kat ? 210 : 280) * w + (1 - w) * 160;
  let sx = -((o.v * hiz) % sp.w); if (sx > 0) sx -= sp.w;
  g.globalAlpha = Math.min(1, w * 1.2) * (kat ? 1 : 0.9);
  for (let x = sx; x < VW + 2; x += sp.w) g.drawImage(sp.c, cam.x + x - 1, y, sp.w + 2, sp.h * (kat ? 1 : 0.9));
  g.globalAlpha = 1;
}
function bn9KatmanCiz(o, tm, ddx) {
  const xa = cam.x - 400 - ddx, xb = cam.x + VW + 400 - ddx;
  const S = o.selaleler, sc = bn9SuCizgiSpr();
  for (let i = 0; i < S.length; i++) {
    const e = S[i]; if (e.v < xa || e.v > xb) continue;
    const sp = bn9SelaleSpr(e.k), x = e.v + ddx;
    g.save(); g.translate(x, e.y); g.scale(e.sc, e.sc); bn9Koy(g, sp);
    // akan su çizgileri (perdenin üstünde kayar) ve dipte su tozu
    const sx = e.k ? -18 : 14, ofs = (tm * 260 + e.f * 100) % 200;
    g.globalAlpha = 0.55; for (let y = -200 + ofs; y < 900; y += 200) g.drawImage(sc.c, sx - 34, y, 68, 200); g.globalAlpha = 1;
    g.restore();
    g.globalCompositeOperation = 'lighter'; dglow('#d8fff8', x + sx * e.sc, e.y + 8, 70 * e.sc, 0.28 + 0.08 * Math.sin(tm * 3 + e.f)); g.globalCompositeOperation = 'source-over';
  }
  const A = o.adalar;
  for (let i = 0; i < A.length; i++) {
    const e = A[i]; if (e.v < xa || e.v > xb) continue;
    const sp = bn9AdaSpr(e.k), x = e.v + ddx, y = e.y + Math.sin(tm * 0.7 + e.f) * 10;
    g.save(); g.translate(x, y); g.scale(e.flip ? -e.sc : e.sc, e.sc); bn9Koy(g, sp); g.restore();
  }
}
function bn9DiziCiz(o, tm, ddx) {   // ışık baloncukları ve çiçek tozları
  const sira = o.ipucu > 0.05 ? bn9Sonraki(o) : null, xa = cam.x - 80 - ddx, xb = cam.x + VW + 80 - ddx, L = o.dizi;
  for (let i = 0; i < L.length; i++) {
    const r = L[i]; if (r.v < xa) continue; if (r.v > xb) break;
    if (r.d === 'bitti' || r.d === 'alindi') continue;
    let x = r.v + ddx, y = (r.d === 'bekle' && r.v > o.v + 900 ? bn9ItemY(o, r) : r.yD) + Math.sin(tm * 2 + r.faz) * 5, a = 1, sc = 1;
    if (r.d === 'kacti') { const u = clamp(r.t / 2.2, 0, 1); y -= smooth(u) * 200; x += u * 30; a = (1 - u) * 0.75; sc = 1 - u * 0.4; }
    const nab = r === sira ? o.ipucu * (0.5 + 0.5 * Math.sin(tm * 5)) : 0, k = r.tip === 'b' ? 0 : 1;
    g.globalCompositeOperation = 'lighter'; dglow(k ? '#ffe0a0' : '#ffd8b0', x, y, 40 * sc + nab * 36, (0.38 + nab * 0.45) * a); g.globalCompositeOperation = 'source-over';
    const s = (k ? 1.2 : 1.55) * sc * (1 + 0.06 * Math.sin(tm * 4 + r.faz)), sp = bn9BalonSpr(k);
    g.globalAlpha = a; g.save(); g.translate(x, y); g.rotate(k ? tm * 0.8 + r.faz : Math.sin(tm * 1.3 + r.faz) * 0.15); g.drawImage(sp.c, -20 * s, -20 * s, 40 * s, 40 * s); g.restore(); g.globalAlpha = 1;
  }
}
function bn9IzCiz(ddx) {
  const xa = cam.x - 40 - ddx, xb = cam.x + VW + 40 - ddx;
  for (const p of bn9Toz) {
    if (p.l <= 0 || p.x < xa || p.x > xb) continue;
    const u = p.l / p.m, r = p.s * (1.4 + 1.3 * u) * (0.85 + 0.15 * Math.sin(p.l * 17 + p.c));
    g.globalAlpha = Math.min(1, u * 1.5); g.drawImage(bn9TozSpr(p.c).c, p.x + ddx - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}
// ── binicilerin çizimi: Fıstık (arkada), Büyükanne, atkı uçları, yavrular, Feza, Pırıl ──
function bn9YavruCiz(c, x, y, s, t, o) {
  if (typeof yavruCiz === 'function') { try { yavruCiz(c, x, y, s, t, o); return; } catch (e) { /* yedek */ } }
  const col = BN9_YAVRU_RENK[o.renk] || '#c9b0ff', z = Math.abs(Math.sin(t * 3)) * (o.ziplama || 0);
  c.save(); c.translate(x, y - z * 6); c.scale(s * (o.yon === -1 ? -1 : 1), s);
  c.fillStyle = col; c.strokeStyle = '#56398c'; c.lineWidth = 1.6;
  c.beginPath(); c.ellipse(0, -11, 11, 11, 0, 0, 6.2832); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(4, -27, 10, 9, 0, 0, 6.2832); c.fill(); c.stroke();
  c.fillStyle = '#d8ee8e'; c.beginPath(); c.ellipse(3, -9, 6, 7, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#1c1228'; c.beginPath(); c.arc(8, -28, 1.8, 0, 6.2832); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(7.4, -28.8, 0.7, 0, 6.2832); c.fill();
  c.fillStyle = 'rgba(255,128,180,.55)'; c.beginPath(); c.ellipse(11, -24, 2.2, 1.3, 0, 0, 6.2832); c.fill();
  if (o.kabuk) { c.fillStyle = '#fff8ec'; c.strokeStyle = '#d8c8a8'; c.lineWidth = 1; c.beginPath(); c.moveTo(-4, -33); c.lineTo(-2, -38); c.lineTo(1, -34); c.lineTo(4, -39); c.lineTo(7, -34); c.lineTo(10, -38); c.lineTo(12, -33); c.quadraticCurveTo(4, -30, -4, -33); c.fill(); c.stroke(); }
  c.restore();
}
function bn9FezaPoz() { return (typeof fezaPozVar === 'function' && fezaPozVar('binis9')) ? 'binis9' : 'binis'; }
function bn9BuyukanneCiz(c, o, tm, x, y) {   // önden ↔ yandan geçiş (kısa çapraz soluşma; geçişi parıltı örter)
  const B = o.bOpt, yan = o.yan;
  B.kolye = 5; B.isik = 0.35 + 0.35 * Math.min(1, o.parla) + (o.sevT > 0 ? 0.15 : 0); B.gulumse = o.sevT > 0.2 ? 1 : 0.8; B.aci = 0;
  if (yan < 0.999) {
    B.poz = 'ayakta'; B.yon = o.faz === 'bekle' || o.faz === 'bitti' || o.faz === 'inis' ? -1 : 1; B.kanat = o.faz === 'bekle' ? 0.3 + 0.2 * smooth(clamp(o.t / 2, 0, 1)) * (0.6 + 0.4 * Math.sin(tm * 1.4)) : 0.25; B.sar = 0;
    B.bakX = B.yon * 0.5; B.bakY = 0.2; B.kanatF = 0;
    const ga = c.globalAlpha; c.globalAlpha = ga * (1 - yan); buyukanneCiz(c, x, y, BN9_S, tm, B); c.globalAlpha = ga;
  }
  if (yan > 0.001) {
    B.poz = 'ucus'; B.yon = 1; B.kanatF = o.kf; B.kanat = o.kanatG; B.aci = o.rot; B.bakX = 0.8; B.bakY = o.salla > 0.5 ? -0.4 : 0.1;
    B.gulumse = o.sevT > 0.2 || o.salla > 0.5 ? 1 : 0.85;
    const ga = c.globalAlpha; c.globalAlpha = ga * yan; buyukanneCiz(c, x, y, BN9_SU, tm, B); c.globalAlpha = ga;
  }
  if (yan > 0.01 && yan < 0.99) {   // dönüş anı: iki poz üst üste hayalet gibi görünmesin, yumuşak bir ışık pufu örter
    const a = Math.sin(yan * Math.PI), ga = c.globalAlpha, gc = c.globalCompositeOperation;
    c.globalCompositeOperation = 'lighter';
    c.globalAlpha = ga * a * 0.7; c.drawImage(glow('#f4e6ff'), x - 200, y - 300, 560, 320);   // gövde + (yandan görünüşte öndeki) kafa
    c.globalAlpha = ga * a * 0.55; c.drawImage(glow('#fff4d8'), x - 120, y - 240, 360, 200);
    c.globalAlpha = ga; c.globalCompositeOperation = gc;
  }
}
function bn9BinicilerCiz(c, o, tm) {
  const bx = o.dbx, by = o.dby, K = BN9_K * BN9_SU, S2 = o.sirt2, yanda = o.yan > 0.5;
  // Fıstık: Büyükanne'nin arkasında (uzakta) uçar
  if (o.faz !== 'bekle') { const F = o.fsOpt; F.kanat = 0.5 + 0.5 * Math.sin(tm * 9); F.yon = o.faz === 'bitti' ? -1 : 1; F.mutlu = 1; bn9YavruCiz(c, o.fsX + (o.dbx - o.bx), o.fsY + (o.dby - o.by - o.bob), 0.7, tm, F); }
  bn9BuyukanneCiz(c, o, tm, bx, by);
  // atkı uçları (binicilerin arkasında, rüzgârda)
  if (yanda) { c.save(); c.translate(bx, by); c.rotate(o.rot); c.scale(K, K); bn9AtkiUclar(c, tm, clamp(o.spd / 260, 0.3, 1)); c.restore(); }
  // yavrular (kuyruğa yakın olandan başa doğru)
  for (let i = o.yavru.length - 1; i >= 0; i--) {
    const Y = o.yavru[i]; buyukanneSirt(i + 1, BN9_SU, o.rot, 1, S2);
    const sx = bx + S2.x, sy = by + S2.y;
    let x = sx, y = sy;
    if (Y.u < 1) {   // biniş / iniş sıçrayışı
      const gx = o.faz === 'inis' ? o.K.inisX - 60 - i * 34 : Y.x0, gyy = o.faz === 'inis' ? o.K.gy : Y.y0, e = smooth(Y.u);
      x = lerp(gx, sx, e); y = lerp(gyy, sy, e) - Math.sin(e * Math.PI) * 60;
      if (Y.u <= 0.001 && o.faz === 'binis') continue;
    } else if (!yanda) continue;
    const yo = o.yOpt; yo.renk = Y.renk; yo.yon = 1; yo.otur = Y.u > 0.98 ? 1 : 0; yo.ucus = Y.u > 0.02 && Y.u < 0.98 ? 1 : 0;
    yo.mutlu = 1; yo.kanat = o.salla > 0.5 ? 0.5 + 0.5 * Math.sin(tm * 10 + i) : (o.sevT > 0.3 ? 0.5 + 0.5 * Math.sin(tm * 12 + i) : 0); yo.ziplama = o.sevT > 0.3 ? 1 : 0;
    yo.agiz = o.sevT > 0.3 || o.salla > 0.6 ? 0.6 : 0; yo.kabuk = 1;
    c.save(); c.translate(x, y); c.rotate(o.rot * 0.7); bn9YavruCiz(c, 0, 0, 0.72, tm + i * 0.7, yo); c.restore();
  }
  // Feza (atkıya tutunmuş)
  const binde = o.faz === 'ucus' || (o.faz === 'binis' && o.oturdu) || (o.faz === 'inis' && !(o.t / BN9_INIS > 0.47));
  if (binde && yanda && typeof fezaCizPoz === 'function') {
    const S = o.sirt, f = o.fzOpt; buyukanneSirt(0, BN9_SU, o.rot, 1, S);
    f.el.x = S.ex - S.x; f.el.y = S.ey - S.y; f.aci = o.rot; f.ruzgar = clamp(0.45 + o.spd / 420, 0.45, 1); f.salla = o.salla;
    f.sevinc = Math.max(o.salla * 0.3, smooth(clamp(o.sevT / 0.4, 0, 1)) * 0.9);
    try { fezaCizPoz(c, bx + S.x, by + S.y, 1, bn9FezaPoz(), o.ft, null, f); } catch (e) {}
  }
}
function bn9PirilCiz(c, o, tm) {
  if (typeof pirilCizPoz !== 'function') return;
  const px = o.prX + (o.dbx - o.bx), py = o.prY + (o.dby - o.by - o.bob), tk = o.tk > 0 ? smooth(o.tk) : 0;
  try { c.save(); c.translate(px, py); c.rotate(tk * 6.2832); pirilCizPoz(c, 0, 0, 0.95, 'ucus', tm, { salla: o.salla, sevinc: o.sevT > 0.3 ? 1 : 0, bakX: 1, bakY: 0 }); c.restore(); }
  catch (e) { c.restore(); }
}
let bn9SilC = null, bn9SilQ = null;
function bn9SiluetCiz(o, tm, k) {   // gün batımında: biniciler ara tuvale çizilir, mor alacakaranlık rengine boyanır (güneşin önünde siluet)
  const M = g.getTransform(), x0w = o.dbx - 330, x1w = o.dbx + 300, y0w = o.dby - 360, y1w = o.dby + 60;
  const dx0 = Math.max(0, Math.floor(M.a * x0w + M.e)), dy0 = Math.max(0, Math.floor(M.d * y0w + M.f));
  const dx1 = Math.min(cv.width, Math.ceil(M.a * x1w + M.e)), dy1 = Math.min(cv.height, Math.ceil(M.d * y1w + M.f)), w = dx1 - dx0, h = dy1 - dy0;
  if (w < 8 || h < 8) return false;
  if (!bn9SilC) { bn9SilC = document.createElement('canvas'); bn9SilQ = bn9SilC.getContext('2d'); }
  if (bn9SilC.width < w || bn9SilC.height < h) { bn9SilC.width = Math.max(bn9SilC.width, w); bn9SilC.height = Math.max(bn9SilC.height, h); }
  const q = bn9SilQ;
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, w, h);
  q.setTransform(M.a, M.b, M.c, M.d, M.e - dx0, M.f - dy0);
  bn9BinicilerCiz(q, o, tm); bn9PirilCiz(q, o, tm);
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-atop'; q.globalAlpha = k * .62; q.fillStyle = '#5a3a86'; q.fillRect(0, 0, w, h);   // yumuşak siluet: yüzler, gülümseme ve yavruların renkleri seçilsin (karanlık değil)
  q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(bn9SilC, 0, 0, w, h, dx0, dy0, w, h); g.restore();
  return true;
}
function bn9KurdeleCiz(o, tm) {   // yardım: Pırıl'ın patisinden Büyükanne'nin atkısına ışıktan kurdele
  const a = o.yardimA * (o.faz === 'ucus' ? 1 : 0); if (a < 0.03) return;
  const S = o.sirt; buyukanneSirt(0, BN9_SU, o.rot, 1, S);
  const tx = o.dbx + S.ex + 20, ty = o.dby + S.ey, px = o.prX + (o.dbx - o.bx) - 10, py = o.prY + (o.dby - o.by - o.bob) + 10;
  const mx = (tx + px) / 2, my = Math.max(ty, py) + 20 + Math.sin(tm * 3) * 5;
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  g.strokeStyle = 'rgba(255,190,240,' + (0.35 * a).toFixed(3) + ')'; g.lineWidth = 8; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(mx, my, tx, ty); g.stroke();
  g.strokeStyle = 'rgba(255,250,235,' + (0.8 * a).toFixed(3) + ')'; g.lineWidth = 2.2; g.stroke();
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 4; i++) { const t = ((tm * 0.6 + i / 4) % 1), it = 1 - t, x = it * it * px + 2 * it * t * mx + t * t * tx, y = it * it * py + 2 * it * t * my + t * t * ty; g.globalAlpha = a * Math.sin(t * Math.PI); g.drawImage(bn9TozSpr(2 + i % 3).c, x - 6, y - 6, 12, 12); }
  g.globalAlpha = 1;
}
function bn9DavetCiz(o, tm) {   // kayalıkta: Büyükanne'nin önünde parlayan "bin" ışığı (zemine iniş noktası)
  const x = o.kx - 70, y = o.ky - 6, n = 0.5 + 0.5 * Math.sin(tm * 2.4);
  g.globalCompositeOperation = 'lighter'; dglow('#ffe6a8', x, y - 10, 70, 0.18 + 0.12 * n); g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 4; i++) { const u = (tm * 0.45 + i / 4) % 1, pa = Math.sin(u * Math.PI) * 0.9, r = 5; g.globalAlpha = pa; g.drawImage(bn9TozSpr(1 + i).c, x + Math.sin(i * 2.1 + tm) * 26 - r, y - 10 - u * 90 - r, r * 2, r * 2); }
  g.globalAlpha = 1;
}
// ── yolculuktan sonra: Büyükanne inişte biraz bekler, sonra kısa bir süzülüşle yuvadaki yerine (Kalp'in yanına) uçar ──
function bn9SonraAdim(o, dt) {
  o.bt += dt; const B = BN9_BA;
  if (B.yuvada) return;
  const T0 = 2.6, T1 = 2.6;
  if (o.bt < T0) { B.x = o.K.xEnd; B.y = o.K.gy; B.poz = 'ayakta'; B.yon = -1; B.yer = 'inis'; return; }
  const u = clamp((o.bt - T0) / T1, 0, 1), e = smooth(u);
  B.yer = 'ucuyor'; B.poz = 'ucus'; B.yon = o.yuvaX >= o.K.xEnd ? 1 : -1;
  B.x = lerp(o.K.xEnd, o.yuvaX, e); B.y = lerp(o.K.gy, o.yuvaY, e) - Math.sin(e * Math.PI) * 160;
  if (u >= 1) { B.x = o.yuvaX; B.y = o.yuvaY; B.poz = 'otur'; B.yon = -1; B.yer = 'yuva'; B.yuvada = !!TUR.al('ejderYuva'); bn9TozPatla(B.x, B.y - 40, 16, 120); bn9Sfx('buyukanneKanat', 2); }
}
function bn9SonraCiz(o, tm) {
  const B = BN9_BA; if (B.yuvada) return;
  const op = o.bOpt; op.isik = 0.45; op.gulumse = 0.85; op.kolye = 5; op.sar = 0; op.aci = 0; op.bakX = B.yon * 0.4; op.bakY = 0.15;
  if (B.poz === 'ucus') { op.poz = 'ucus'; op.yon = B.yon; op.kanatF = o.bt * 1.4 * 6.2832; op.kanat = 0.9; buyukanneCiz(g, B.x, B.y, BN9_SU, tm, op); }
  else { op.poz = B.poz; op.yon = B.yon; op.kanat = 0.2; op.kanatF = 0; buyukanneCiz(g, B.x, B.y, BN9_S, tm, op); }
}
function bn9HazirMi(o) {
  const V = bn9V9();
  if (V && V.kolye) return true;
  if (!TUR.al('kolyeMini') || !NESNELER.some(n => n.tip === 'kolyeMini')) return true;   // kolye yüklenemediyse baştan hazır
  return false;
}
TUR.kaydet('buyukanneBinis', {
  kur: bn9Kur,
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    bn9ParcaAdim(dt);
    if (o.faz === 'bekle') {
      o.t += dt; o.ft += dt;
      if (Math.abs(P.x - o.kx) < 3200) bn9IsitHepsi();
      if (!o.hazir && bn9HazirMi(o)) {
        o.hazir = true; o.t = 0;
        const KD = typeof KOLYE !== 'undefined' && KOLYE ? KOLYE.devir : null;
        if (KD && Number.isFinite(KD.x) && Number.isFinite(KD.y) && Math.abs(KD.x - o.kx) < 400) { o.kx = KD.x; o.ky = KD.y; }
        BN9_BA.x = o.kx; BN9_BA.y = o.ky; BN9_BA.vis = true; BN9_BA.yer = 'kayalik';
        OLAY.emit('binisHazir', { o });
      }
      o.dbx = o.bx = o.kx; o.dby = o.by = o.ky;
      if (o.hazir && DURUM === 'oyun' && !P.ucus && !o.done && P.fade <= 0) {
        const dx = P.x - o.kx;
        if ((Math.abs(dx) < 150 && Math.abs(P.y - o.ky) < 160) || (dx > -40 && dx < 600 && P.y > o.ky - 200 && P.y < o.ky + 100)) bn9Basla(o);
      }
      return;
    }
    if (o.faz === 'bitti') { bn9SonraAdim(o, dt); return; }
    // çizim konumu: iki fizik adımı arasındaki yumuşatma (oyun.js P.x'i ara konuma koyar; aynı oranla Büyükanne ve yakın katman)
    if (o.faz === 'ucus') {
      const d = o.pX - o.pXOn, al = Math.abs(d) > 1e-4 ? clamp((P.x - o.pXOn) / d, 0, 1.25) : 1;
      o.ddx = lerp(o.dxOn, o.dx, al); o.dbx = o.bx + (P.x - o.pX); o.dby = o.by + o.bob + (P.y - o.pY);
    } else { o.ddx = o.dx; o.dbx = o.bx; o.dby = o.by + o.bob; }
    BN9_BA.x = o.dbx; BN9_BA.y = o.dby;
    const gw = o.faz === 'ucus' ? bn9GunW(o.v) : 0;
    o.silA = lerp(o.silA, smooth(clamp(gw * 1.6 - 0.3, 0, 1)) * 0.72, 1 - Math.exp(-dt * 3));
  },
  ciz(o, tm) {
    if (P.ucus === o) {
      bn9GunesCiz(o); bn9EjderCiz(o, tm); bn9BulutCiz(o, 0);
      bn9KatmanCiz(o, tm, o.ddx);
      bn9BulutCiz(o, 1);
      bn9DiziCiz(o, tm, o.ddx);
      return;
    }
    if (o.faz === 'bekle') { if (o.hazir) { bn9DavetCiz(o, tm); bn9BuyukanneCiz(g, o, tm, o.kx, o.ky); if (typeof KOLYE !== 'undefined' && KOLYE) KOLYE.devirAlindi = true; } return; }
    if (o.faz === 'bitti') bn9SonraCiz(o, tm);
  },
  cizOn(o, tm) {
    if (P.ucus !== o) { if (o.faz === 'bitti') bn9IzCiz(o.dx); else if (o.faz === 'bekle') bn9IzCiz(o.K.xs - 0); return; }
    bn9IzCiz(o.ddx);
    bn9KurdeleCiz(o, tm);   // yardım kurdelesi Büyükanne'nin ARKASINDA: yüzünün/gözlüğünün üstünden geçmez, boynun ardından atkıya bağlanır
    let sil = false;
    if (o.silA > 0.02) {
      g.globalCompositeOperation = 'lighter'; dglow('#ffd8a0', o.dbx + 20, o.dby - 120, 300, 0.25 * o.silA); g.globalCompositeOperation = 'source-over';
      try { sil = bn9SiluetCiz(o, tm, o.silA); } catch (e) { sil = false; }
    }
    if (!sil) { bn9BinicilerCiz(g, o, tm); bn9PirilCiz(g, o, tm); }
    // biniş / iniş: Büyükanne'nin dışındaki Feza (atlarken)
    const disarda = (o.faz === 'binis' && !o.oturdu) || (o.faz === 'inis' && o.t / BN9_INIS > 0.47);
    if (disarda && typeof fezaCizPoz === 'function') { try { fezaCizPoz(g, P.x, P.y, 1, 'sevinc', o.ft); } catch (e) {} }
  }
});
