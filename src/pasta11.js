/* pasta11.js — Bölüm 11 (Ay Işığı Şatosu) mini oyun 3: VAMPİR NİNE'NİN ÇİLEKLİ PASTASI (önek pa11), nesne türü 'pastaMini'. Sahibi: MINI3.
   Şato mutfağında dantel örtülü yuvarlak bir masa; masada altın altlığın üstünde KOCAMAN, ÜÇ KATLI, sade pembe kremalı çilekli pasta
   (kenarlarından krema damlıyor). Masanın sağında Vampir Nine (önlüklü, `vampirCiz`), onun yanında MAMA SANDALYESİNDE bebek Pıtır.
   Feza yaklaşınca kadraj yumuşakça yerleşir (kazan.js gibi: P.ucus = o ile fizik devralınır, Feza'yı ve Pırıl'ı bu dosya çizer).
   Nine el sallar, krema kâsesinden altı IŞIK BALONCUĞU yükselir ve pastanın üstünde yay çizerek süzülür: şeker incisi, çilek, krema
   kalbi, yıldız şeker, ay bisküvi, lila yarasa kurabiyesi. Feza birini parmağıyla pastaya SÜRÜKLER — ya da dokunur, süs kendisi uçar ve
   pastadaki EN GÜZEL YERİNE oturur (her süsün yeri belli; yanlış yok). Pastaya yaklaşan süsü pasta kendisi yakalar; uzağa bırakılan
   yerine süzülür. Pastaya, masaya ya da Nine'ye dokunmak da sıradakini getirir. Klavye yedeği: Boşluk/Enter/E/→.
   Her süs bir avuç süse dönüşüp sırayla "pıt pıt" yerine oturur (13 inci dizisi, 7 çilek, 5 krema kalbi, 6 yıldız şeker, 3 ay bisküvi,
   2 yarasa kurabiyesi); pasta jöle gibi yaylanır, parlar, şeker serpintisi saçılır; Nine alkışlar, Pıtır alkışlar, Feza sevinir.
   Bir katın iki süsü de konunca o kat ışıl ışıl parlar (pastaKat). Altısı bitince ay ışığından KOCAMAN bir çilek (minik ay bayraklı,
   gülen yüzlü) baloncukla iner; Feza onu en üste koyar. Son: pasta ışıl ışıl (ışık huzmeleri + yıldız tozu), Nine dans eder, Pıtır'ın
   tepsisine minik bir çilek zıplar; pasta sihirle hafifçe kalkıp gümüş TEPSİYE oturur, üstüne kurdeleli cam FANUS iner (balo için hazır).
   Kaybetme/yazı/öğretici el yok; ipucu ışıkla (sıradaki süs parlar, pastaya doğru ışık tozu akar, Pırıl yol gösterir).
   ~25 sn dokunulmazsa (sonrakilerde ~12 sn, kocaman çilekte ~10 sn) Pırıl sıradaki süsü kendisi taşır; çocuk dokununca bırakır.
   Vampirler KAN içmez: kırmızı çilek şerbeti ve çilekli pasta sever. Korkutucu hiçbir şey yok.
   Durum: fanus inip Nine alkışlayınca Feza bırakılır; aynı anda o.done, o.tk.bitti, V11.pasta = true ve OLAY 'pastaBitti'.
   Olaylar: 'pastaBasla' {o} · 'pastaSus' {o, n (1..7), ad, kat} · 'pastaKat' {o, kat (1..3)} · 'pastaBuyukCilek' {o} · 'pastaYardim' {o}
     · 'pastaKapak' {o} · 'pastaBitti' {o}. Ses efektleri (muzik.js): pastaSus (v = n), pastaParla (v = kat; 4 = final), parilti, pastaKapak.
   Ortak çizici: pa11PastaCiz(c, x, y, s, t, o) — süslenmiş (bitmiş) pasta; (x, y) altlığın tabanı, s ölçek (1 ≈ 210 birim geniş, bayrak dahil
     ≈ 235 birim yüksek), o: { kapak 0..1 (cam fanus), tepsi 0..1, parla 0..1, alfa } (balo11.js finalde gösterebilir).
   Test: TUR.al('pastaMini').testBitir(o) (B11T.bitir('pasta')). Yerleşim (bolum11.js): nesne('pastaMini', 572, yuzey(572), {x0, x1});
   o.x-420 … o.x+360 DÜZ zemin (mutfak). Sözleşme: src/BOLUM11.md. Karede gradyan/filtre/shadowBlur yok (bütün parçalar önbellekli sprite). */
'use strict';
const PA11_MASA = -58;                   // masa yüzeyi (zemine göre); pasta altlığının tabanı burada
const PA11_NS = 1.55, PA11_KOL = -73;
let PA11_NX = 184;                       // Vampir Nine (o.x'e göre); ölçeği PA11_NS; sola, pastaya bakar
let PA11_MX = 300;     // mama sandalyesi (o.x'e göre) ve Pıtır'ın oturduğu yer (zemine göre)
let PA11_AKTIF = 360;                    // Feza o.x - 360'ı geçince etkinlik başlar
let PA11_GIR0 = -372, PA11_GIR1 = -300; // Feza'nın oyun boyunca durduğu yerin sınırları (o.x'e göre)
const PA11_GEL = 1.3, PA11_CIK = 1.15, PA11_IPUCU = 4, PA11_GOSTER = 9, PA11_YARDIM = 25, PA11_YARDIM2 = 12, PA11_YARDIMB = 10;
const PA11_BS = 1.22;                    // havada bekleyen süs baloncuğunun ölçeği (5 yaş parmağı için iri)
const PA11_KAT = [                       // pasta katları (altlık tabanına göre): alt y, üst y, yarı genişlik, elips yarı yüksekliği
  { y0: -16, y1: -72, w: 84, ry: 12 },
  { y0: -72, y1: -120, w: 62, ry: 9 },
  { y0: -120, y1: -160, w: 42, ry: 6.5 }];
// süsler: ad, kat, havada süzüleceği yer (o.x, o.y'ye göre; pastanın üstünde yay), ışık rengi, pastadaki hedef yüksekliği (ay)
const PA11_SUS = [
  { ad: 'sekerInci', kat: 0, fx: -262, fy: -196, renk: '#ffd6ea', ay: -8 },
  { ad: 'cilek', kat: 0, fx: -236, fy: -302, renk: '#ff6f8f', ay: -78 },
  { ad: 'kremaKalp', kat: 1, fx: -148, fy: -374, renk: '#ff9ac0', ay: -96 },
  { ad: 'yildizSeker', kat: 1, fx: -14, fy: -400, renk: '#ffe27a', ay: -126 },
  { ad: 'ayBiskuvi', kat: 2, fx: 122, fy: -374, renk: '#ffd27a', ay: -140 },
  { ad: 'yarasaKurabiye', kat: 2, fx: 230, fy: -302, renk: '#c39bff', ay: -172 },
  { ad: 'buyukCilek', kat: 3, fx: -40, fy: -360, renk: '#ff7a9a', ay: -182 }];
const PA11_BOS = {};
const PASTA11 = {
  o: null, ptr: -1, px: 0, py: 0, yol: 0, tut: null, tutUzak: 0, hx: 0, hy: 0,
  get aktif() { const o = this.o; return o && o.pa && o.pa.aktif && !o.done ? o : null; }
};
// Cila: dikey ekranda (dar) sahne sıkışır — Feza masaya, Nine ve mama sandalyesi pastaya yaklaşır, süsler daha dar bir yayda süzülür;
// böylece kadraj daralır, karakterler büyür. PA11_L: 0 yatay … 1 dikey (ekran dönerse yumuşakça geçer).
let PA11_L = -1, PA11_FXK = 1, PA11_FYK = 1, PA11_FS = 1;   // FS: Feza ve Pırıl'ın çizim ölçeği (dikeyde biraz iri)
function pa11Duzen(dt) {
  const asp = W / Math.max(H, 1), hd = clamp((1.2 - asp) / 0.5, 0, 1);
  if (PA11_L < 0 || !(dt > 0)) PA11_L = hd; else { PA11_L += (hd - PA11_L) * Math.min(1, dt * 3); if (Math.abs(PA11_L - hd) < 0.002) PA11_L = hd; }
  const L = PA11_L;
  PA11_NX = lerp(184, 134, L); PA11_MX = lerp(300, 194, L); PA11_GIR0 = lerp(-372, -182, L); PA11_GIR1 = lerp(-300, -166, L);
  PA11_AKTIF = lerp(360, 190, L); PA11_FXK = lerp(1, 0.62, L); PA11_FYK = lerp(1, 1.3, L); PA11_FS = lerp(1, 1.26, L);
}
function pa11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function pa11Isik(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }
function pa11IsikE(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }

// ═══════════════════════════════ önbellek tuvalleri ═══════════════════════════════
// Yerel (x0, y0, w, h) kutusu, K piksel/birim; ilk kullanımda bir kez çizilir.
const PA11_SPR = new Map();
function pa11Tuval(ad, x0, y0, w, h, fn, K) {
  let c = PA11_SPR.get(ad); if (c) return c;
  K = K || 4;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; PA11_SPR.set(ad, c); return c;
}
function pa11Koy(c, sp, x, y) { c.drawImage(sp, x + sp.x0, y + sp.y0, sp.w, sp.h); }
function pa11KoyS(c, sp, x, y, k) { c.drawImage(sp, x + sp.x0 * k, y + sp.y0 * k, sp.w * k, sp.h * k); }
function pa11Lin(q, x0, y0, x1, y1, st) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function pa11Rad(q, x0, y0, r0, x1, y1, r1, st) { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function pa11Hex(a, b, t) {   // iki #rrggbb arası → #rrggbb (yalnız önbellek tuvali üretirken)
  const A = hex(a), B = hex(b), h2 = v => { const s = Math.round(clamp(v, 0, 255)).toString(16); return s.length < 2 ? '0' + s : s; };
  return '#' + h2(lerp(A[0], B[0], t)) + h2(lerp(A[1], B[1], t)) + h2(lerp(A[2], B[2], t));
}
function pa11Isilti(q, x, y, r) {   // dört köşeli ışıltı yolu
  q.beginPath(); q.moveTo(x, y - r); q.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y); q.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  q.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y); q.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r); q.closePath();
}
function pa11YildizTombul(q, x, y, r, ic, rot) {   // köşeleri yuvarlak tombul yıldız yolu
  q.beginPath(); rot = rot || 0;
  for (let i = 0; i < 5; i++) {
    const a = rot - Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5, a2 = a + 2 * Math.PI / 5;
    const ox = x + Math.cos(a) * r, oy = y + Math.sin(a) * r, ix = x + Math.cos(b) * r * ic, iy = y + Math.sin(b) * r * ic;
    if (!i) q.moveTo(x + Math.cos(a - 0.13) * r * 0.93, y + Math.sin(a - 0.13) * r * 0.93);
    q.quadraticCurveTo(ox, oy, x + Math.cos(a + 0.13) * r * 0.93, y + Math.sin(a + 0.13) * r * 0.93);
    q.quadraticCurveTo(ix, iy, x + Math.cos(a2 - 0.13) * r * 0.93, y + Math.sin(a2 - 0.13) * r * 0.93);
  }
  q.closePath();
}
function pa11KalpYol(q, x, y, s) {
  q.beginPath(); q.moveTo(x, y + s * 0.95); q.bezierCurveTo(x - s * 1.35, y - s * 0.1, x - s * 0.6, y - s * 1.15, x, y - s * 0.35);
  q.bezierCurveTo(x + s * 0.6, y - s * 1.15, x + s * 1.35, y - s * 0.1, x, y + s * 0.95); q.closePath();
}

// ═══════════════════════════════ süs çizicileri (sprite içinde) ═══════════════════════════════
const PA11_TOH = [[-0.5, -0.5], [0, -0.6], [0.5, -0.5], [-0.66, -0.06], [-0.22, -0.18], [0.24, -0.16], [0.66, -0.04], [-0.42, 0.34], [0.04, 0.3], [0.44, 0.36], [-0.16, 0.7], [0.2, 0.72]];
function pa11CilekCiz(q, x, y, r, yuz) {   // çilek: gövde ortası (x, y), ucu aşağıda, yaprakları üstte
  const yol = () => { q.beginPath(); q.moveTo(x, y + 1.15 * r); q.bezierCurveTo(x - 1.08 * r, y + 0.62 * r, x - 1.22 * r, y - 0.7 * r, x - 0.52 * r, y - 0.95 * r);
    q.quadraticCurveTo(x, y - 1.12 * r, x + 0.52 * r, y - 0.95 * r); q.bezierCurveTo(x + 1.22 * r, y - 0.7 * r, x + 1.08 * r, y + 0.62 * r, x, y + 1.15 * r); q.closePath(); };
  yol(); q.fillStyle = pa11Rad(q, x - 0.38 * r, y - 0.42 * r, 0.1 * r, x, y, 1.35 * r, [0, '#ffa0b8', 0.42, '#ff4f7a', 1, '#d0265a']); q.fill();
  q.strokeStyle = 'rgba(150,20,60,0.55)'; q.lineWidth = Math.max(0.5, r * 0.08); q.stroke();
  for (const [sx, sy] of PA11_TOH) { const px = x + sx * r, py = y + sy * r;
    q.fillStyle = 'rgba(160,20,60,0.35)'; q.beginPath(); q.ellipse(px + r * 0.02, py + r * 0.04, r * 0.08, r * 0.12, sx * 0.4, 0, 6.2832); q.fill();
    q.fillStyle = '#fff0b0'; q.beginPath(); q.ellipse(px, py, r * 0.065, r * 0.1, sx * 0.4, 0, 6.2832); q.fill(); }
  q.fillStyle = 'rgba(255,255,255,0.6)'; q.beginPath(); q.ellipse(x - 0.45 * r, y - 0.3 * r, 0.15 * r, 0.32 * r, 0.45, 0, 6.2832); q.fill();
  if (yuz) {   // gülen yüz: mutlu kapalı gözler, pembe yanaklar, minik gülümseme
    q.strokeStyle = '#5a1430'; q.lineWidth = r * 0.09;
    for (const sx of [-1, 1]) { q.beginPath(); q.arc(x + sx * 0.34 * r, y - 0.02 * r, 0.14 * r, Math.PI * 1.1, Math.PI * 1.9); q.stroke(); }
    q.fillStyle = 'rgba(255,190,210,0.75)'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(x + sx * 0.56 * r, y + 0.2 * r, 0.14 * r, 0.09 * r, 0, 0, 6.2832); q.fill(); }
    q.fillStyle = '#7a1a3c'; q.beginPath(); q.moveTo(x - 0.17 * r, y + 0.2 * r); q.quadraticCurveTo(x, y + 0.48 * r, x + 0.17 * r, y + 0.2 * r); q.quadraticCurveTo(x, y + 0.28 * r, x - 0.17 * r, y + 0.2 * r); q.fill();
  }
  // yeşil çanak yaprakları + sap
  for (let i = 0; i < 5; i++) {
    const a = Math.PI / 2 + (i - 2) * 0.6, cx = x + Math.cos(a) * 0.36 * r, cy = y - 0.95 * r + Math.sin(a) * 0.22 * r;
    q.fillStyle = i % 2 ? '#4cc46a' : '#5fd47c'; q.beginPath(); q.ellipse(cx, cy, 0.4 * r, 0.15 * r, a, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(30,110,60,0.6)'; q.lineWidth = Math.max(0.4, r * 0.05); q.stroke();
  }
  q.strokeStyle = '#3c9a52'; q.lineWidth = r * 0.14; q.beginPath(); q.moveTo(x, y - 1.0 * r); q.quadraticCurveTo(x + 0.04 * r, y - 1.32 * r, x + 0.2 * r, y - 1.42 * r); q.stroke();
}
function pa11Krema(q, x, y, r) {   // krema gülü (taban ortası x, y)
  const st = [0, '#ffffff', 0.6, '#fff1f6', 1, '#f8cfe0'];
  q.fillStyle = pa11Rad(q, x - r * 0.3, y - r * 0.7, r * 0.1, x, y - r * 0.3, r * 1.2, st);
  q.beginPath(); q.ellipse(x, y - r * 0.28, r, r * 0.42, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(220,140,175,0.55)'; q.lineWidth = Math.max(0.5, r * 0.08); q.stroke();
  q.beginPath(); q.ellipse(x, y - r * 0.62, r * 0.68, r * 0.36, 0, 0, 6.2832); q.fill(); q.stroke();
  q.strokeStyle = 'rgba(230,160,190,0.6)'; q.lineWidth = Math.max(0.4, r * 0.06); q.beginPath(); q.arc(x, y - r * 0.5, r * 0.5, 0.2, 2.6); q.stroke();
}
function pa11KremaOn(q, x, y, r) {   // krema gülünün ön dudağı (çileğin ucunu örter)
  q.fillStyle = pa11Rad(q, x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r * 1.1, [0, '#ffffff', 0.7, '#fff0f6', 1, '#f6cadc']);
  q.beginPath(); q.ellipse(x, y - r * 0.2, r * 0.95, r * 0.34, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(220,140,175,0.5)'; q.lineWidth = Math.max(0.5, r * 0.07); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.ellipse(x - r * 0.35, y - r * 0.3, r * 0.25, r * 0.09, 0, 0, 6.2832); q.fill();
}
function pa11InciCiz(q, x, y, r, pembe) {
  q.fillStyle = pa11Rad(q, x - r * 0.35, y - r * 0.4, r * 0.08, x, y, r * 1.05, pembe ? [0, '#ffffff', 0.4, '#ffe2ee', 1, '#f7a8c8'] : [0, '#ffffff', 0.45, '#fbf2ff', 1, '#d8c4ec']);
  q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); q.strokeStyle = pembe ? 'rgba(200,100,150,0.45)' : 'rgba(150,120,190,0.45)'; q.lineWidth = Math.max(0.3, r * 0.1); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.95)'; q.beginPath(); q.arc(x - r * 0.35, y - r * 0.38, r * 0.25, 0, 6.2832); q.fill();
}
function pa11KalpCiz(q, x, y, s) {   // krema kalbi
  pa11KalpYol(q, x, y, s); q.fillStyle = pa11Rad(q, x - s * 0.4, y - s * 0.45, s * 0.1, x, y, s * 1.3, [0, '#ffc2d4', 0.4, '#ff5c86', 1, '#cf2a5e']); q.fill();
  q.strokeStyle = '#fff6fa'; q.lineWidth = s * 0.2; q.stroke();
  q.strokeStyle = 'rgba(200,60,120,0.45)'; q.lineWidth = s * 0.07; pa11KalpYol(q, x, y, s * 1.12); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(x - s * 0.42, y - s * 0.38, s * 0.2, s * 0.12, -0.6, 0, 6.2832); q.fill();
}
const PA11_YRENK = [['#fff6c4', '#ffd34a', '#d8901a'], ['#e0fff2', '#6fe0b4', '#2a9e74'], ['#ffe6f2', '#ff8fc0', '#d0508a']];
function pa11YildizCiz(q, x, y, r, i) {   // yıldız şeker
  const R = PA11_YRENK[i % 3];
  pa11YildizTombul(q, x, y, r, 0.52); q.fillStyle = pa11Rad(q, x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r * 1.1, [0, R[0], 0.55, R[1], 1, pa11Hex(R[1], R[2], 0.5)]); q.fill();
  q.strokeStyle = R[2]; q.lineWidth = Math.max(0.5, r * 0.1); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.85)'; q.beginPath(); q.ellipse(x - r * 0.28, y - r * 0.3, r * 0.2, r * 0.12, -0.6, 0, 6.2832); q.fill();
  q.beginPath(); q.arc(x + r * 0.3, y + r * 0.18, r * 0.07, 0, 6.2832); q.fill();
}
function pa11AyCiz(q, x, y, r) {   // ay bisküvi: kenarı beyaz şekerli, uykucu gülen yüzlü hilal kurabiye
  q.save();
  q.fillStyle = pa11Rad(q, x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r * 1.1, [0, '#ffeec0', 0.55, '#f6c46c', 1, '#d8913c']);
  q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill();
  q.strokeStyle = '#fffaf2'; q.lineWidth = r * 0.16; q.beginPath(); q.arc(x, y, r * 0.88, 0, 6.2832); q.stroke();
  q.fillStyle = 'rgba(190,110,40,0.45)'; for (const [dx, dy] of [[-0.45, 0.1], [-0.2, 0.5], [-0.55, -0.35], [0.05, 0.72]]) { q.beginPath(); q.arc(x + dx * r, y + dy * r, r * 0.06, 0, 6.2832); q.fill(); }
  q.globalCompositeOperation = 'destination-out'; q.beginPath(); q.arc(x + r * 0.46, y - r * 0.3, r * 0.78, 0, 6.2832); q.fill();
  q.globalCompositeOperation = 'source-over';
  q.strokeStyle = 'rgba(160,90,30,0.6)'; q.lineWidth = r * 0.07; q.beginPath(); q.arc(x, y, r, 0.35, 5.55); q.stroke();
  q.strokeStyle = '#6a3a1a'; q.lineWidth = r * 0.09; q.beginPath(); q.arc(x - r * 0.52, y + r * 0.02, r * 0.14, 0.15 * Math.PI, 0.85 * Math.PI); q.stroke();
  q.beginPath(); q.arc(x - r * 0.3, y + r * 0.38, r * 0.12, 0.1 * Math.PI, 0.9 * Math.PI); q.stroke();
  q.fillStyle = 'rgba(255,140,170,0.6)'; q.beginPath(); q.ellipse(x - r * 0.68, y + r * 0.3, r * 0.12, r * 0.08, 0.4, 0, 6.2832); q.fill();
  q.fillStyle = '#ff8fc0'; q.beginPath(); q.arc(x - r * 0.1, y + r * 0.72, r * 0.07, 0, 6.2832); q.fill(); q.fillStyle = '#9ff0d0'; q.beginPath(); q.arc(x - r * 0.72, y - r * 0.3, r * 0.07, 0, 6.2832); q.fill();
  q.restore();
}
function pa11YarasaCiz(q, x, y, r) {   // lila yarasa kurabiyesi: gövde ortası (x, y), r gövde yarıçapı
  for (const sx of [-1, 1]) {   // kanatlar (dalgalı alt kenar)
    q.beginPath(); q.moveTo(x + sx * r * 0.55, y - r * 0.45); q.quadraticCurveTo(x + sx * r * 1.6, y - r * 1.35, x + sx * r * 2.05, y - r * 0.55);
    q.quadraticCurveTo(x + sx * r * 1.85, y + r * 0.05, x + sx * r * 1.55, y - r * 0.05); q.quadraticCurveTo(x + sx * r * 1.35, y + r * 0.45, x + sx * r * 1.05, y + r * 0.22);
    q.quadraticCurveTo(x + sx * r * 0.85, y + r * 0.55, x + sx * r * 0.5, y + r * 0.35); q.closePath();
    q.fillStyle = pa11Lin(q, x, y - r, x + sx * r * 2, y, [0, '#b896f4', 1, '#8c68d8']); q.fill(); q.strokeStyle = '#6a48b8'; q.lineWidth = r * 0.09; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = r * 0.07; q.beginPath(); q.moveTo(x + sx * r * 0.75, y - r * 0.55); q.quadraticCurveTo(x + sx * r * 1.5, y - r * 1.05, x + sx * r * 1.85, y - r * 0.55); q.stroke();
  }
  for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(x + sx * r * 0.2, y - r * 0.85); q.quadraticCurveTo(x + sx * r * 0.55, y - r * 1.5, x + sx * r * 0.72, y - r * 0.7); q.closePath(); q.fillStyle = '#a682ea'; q.fill(); q.strokeStyle = '#6a48b8'; q.lineWidth = r * 0.08; q.stroke(); }
  q.fillStyle = pa11Rad(q, x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r * 1.1, [0, '#ecdcff', 0.5, '#c39bff', 1, '#9a76e6']); q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill();
  q.strokeStyle = '#6a48b8'; q.lineWidth = r * 0.09; q.stroke();
  q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = r * 0.07; q.setLineDash([r * 0.14, r * 0.16]); q.beginPath(); q.arc(x, y, r * 0.84, 0, 6.2832); q.stroke(); q.setLineDash([]);
  for (const sx of [-1, 1]) {   // iri parlak gözler (koyu bebek, beyaz parıltı)
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(x + sx * r * 0.36, y - r * 0.1, r * 0.27, r * 0.31, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#2b2240'; q.beginPath(); q.ellipse(x + sx * r * 0.33, y - r * 0.05, r * 0.17, r * 0.21, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#ffffff'; q.beginPath(); q.arc(x + sx * r * 0.33 - r * 0.07, y - r * 0.13, r * 0.07, 0, 6.2832); q.fill();
  }
  q.fillStyle = 'rgba(255,130,170,0.6)'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(x + sx * r * 0.62, y + r * 0.3, r * 0.14, r * 0.09, 0, 0, 6.2832); q.fill(); }
  q.strokeStyle = '#5a2a5a'; q.lineWidth = r * 0.09; q.beginPath(); q.arc(x, y + r * 0.22, r * 0.2, 0.2 * Math.PI, 0.8 * Math.PI); q.stroke();
}
function pa11BayrakCiz(q) {   // minik ay bayrağı: çubuk tabanı (0, 0)
  q.strokeStyle = '#c99a4a'; q.lineWidth = 2; q.beginPath(); q.moveTo(0, 0); q.lineTo(0, -38); q.stroke();
  q.strokeStyle = '#fff0c0'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(-0.5, -2); q.lineTo(-0.5, -36); q.stroke();
  q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(0, -39.5, 2.2, 0, 6.2832); q.fill(); q.strokeStyle = '#b97f22'; q.lineWidth = 0.6; q.stroke();
  q.beginPath(); q.moveTo(1, -37); q.quadraticCurveTo(13, -36, 25, -31); q.quadraticCurveTo(13, -27.5, 1, -24); q.closePath();
  q.fillStyle = pa11Lin(q, 0, -37, 25, -30, [0, '#5a46a8', 1, '#7d64d0']); q.fill(); q.strokeStyle = '#3a2c74'; q.lineWidth = 0.8; q.stroke();
  q.strokeStyle = '#ffb3d1'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(1.5, -35.5); q.quadraticCurveTo(13, -34.5, 22.5, -30.8); q.stroke();
  q.fillStyle = '#ffe7a8'; q.beginPath(); q.arc(9.5, -30.6, 4, 0, 6.2832); q.fill();
  q.fillStyle = '#6450b8'; q.beginPath(); q.arc(11.3, -31.8, 3.4, 0, 6.2832); q.fill();
  q.fillStyle = '#fff4d6'; pa11Isilti(q, 17.5, -30.5, 1.8); q.fill();
}

// ═══════════════════════════════ sprite'lar ═══════════════════════════════
function pa11SusSpr(ad, i) {   // pastadaki tek parça (taban ya da orta (0, 0))
  switch (ad) {
    case 'inci': return pa11Tuval('d_inci', -6, -6, 12, 12, q => pa11InciCiz(q, 0, 0, 4.4, false), 6);
    case 'inciP': return pa11Tuval('d_inciP', -6, -6, 12, 12, q => pa11InciCiz(q, 0, 0, 4.4, true), 6);
    case 'cilek': return pa11Tuval('d_cilek', -12, -24, 24, 28, q => { pa11Krema(q, 0, -1, 7.5); pa11CilekCiz(q, 0, -12.5, 7.2, false); pa11KremaOn(q, 0, -1.5, 7); }, 5);
    case 'kalp': return pa11Tuval('d_kalp', -12, -12, 24, 24, q => pa11KalpCiz(q, 0, 0, 8.4), 5);
    case 'yildiz': return pa11Tuval('d_yildiz' + i, -10, -18, 20, 20, q => { q.fillStyle = 'rgba(200,90,130,0.25)'; q.beginPath(); q.ellipse(0, -0.5, 6, 1.6, 0, 0, 6.2832); q.fill(); pa11YildizCiz(q, 0, -8, 7.6, i); }, 5);
    case 'ay': return pa11Tuval('d_ay', -12, -12, 24, 24, q => pa11AyCiz(q, 0, 0, 9.5), 5);
    case 'yarasa': return pa11Tuval('d_yarasa', -20, -28, 40, 31, q => { pa11Krema(q, 0, -0.5, 6); pa11YarasaCiz(q, 0, -13, 8.6); }, 5);
    case 'buyuk': return pa11Tuval('d_buyuk', -27, -52, 54, 56, q => { pa11Krema(q, 0, -2, 14); pa11CilekCiz(q, 0, -26, 17, true); pa11KremaOn(q, 0, -2.5, 13); }, 5);
    case 'bayrak': return pa11Tuval('d_bayrak', -4, -44, 31, 46, pa11BayrakCiz, 5);
  }
  return null;
}
function pa11IkonSpr(ad) {   // havada süzülen baloncuğun içindeki iri süs (orta (0, 0))
  return pa11Tuval('i_' + ad, -30, -30, 60, 60, q => {
    if (ad === 'sekerInci') { q.strokeStyle = 'rgba(255,255,255,0.7)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(-22, 8); q.quadraticCurveTo(0, 22, 22, 8); q.stroke();
      for (const [x, y, r, p] of [[-17, 9, 5, 1], [-6, 14, 5.4, 0], [6, 14, 5.4, 1], [17, 9, 5, 0], [-8, -4, 9.5, 0], [9, -2, 8.5, 1], [0, -15, 7.5, 1]]) pa11InciCiz(q, x, y, r, !!p); }
    else if (ad === 'cilek') { pa11CilekCiz(q, 0, 2, 17, false); }
    else if (ad === 'kremaKalp') { pa11KalpCiz(q, 0, 2, 18); }
    else if (ad === 'yildizSeker') { pa11YildizCiz(q, -9, 8, 10, 1); pa11YildizCiz(q, 11, 9, 9, 2); pa11YildizCiz(q, 1, -7, 15, 0); }
    else if (ad === 'ayBiskuvi') { pa11AyCiz(q, 0, 0, 21); }
    else if (ad === 'yarasaKurabiye') { pa11YarasaCiz(q, 0, 4, 12.5); }
    else if (ad === 'buyukCilek') { pa11CilekCiz(q, -2, 6, 18, true); q.save(); q.translate(6, -6); q.rotate(0.18); q.scale(0.62, 0.62); pa11BayrakCiz(q); q.restore(); }
  }, 4);
}
function pa11Balon() {   // yanardöner ışık baloncuğu (r = 32)
  return pa11Tuval('balon', -36, -36, 72, 72, q => {
    q.fillStyle = pa11Rad(q, -8, -10, 2, 0, 0, 32, [0, 'rgba(255,255,255,0.08)', 0.72, 'rgba(255,240,250,0.05)', 0.92, 'rgba(255,220,240,0.24)', 1, 'rgba(255,255,255,0)']);
    q.beginPath(); q.arc(0, 0, 32, 0, 6.2832); q.fill();
    q.lineWidth = 2.2; q.strokeStyle = pa11Lin(q, -32, -32, 32, 32, [0, 'rgba(255,190,220,0.9)', 0.35, 'rgba(255,240,180,0.85)', 0.65, 'rgba(180,240,220,0.85)', 1, 'rgba(190,170,255,0.9)']);
    q.beginPath(); q.arc(0, 0, 31, 0, 6.2832); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.85)'; q.lineWidth = 3; q.beginPath(); q.arc(0, 0, 25, Math.PI * 1.08, Math.PI * 1.45); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.9)'; q.beginPath(); q.arc(-15, -18, 2.6, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(255,255,255,0.4)'; q.lineWidth = 1.6; q.beginPath(); q.arc(0, 0, 26, 0.15 * Math.PI, 0.4 * Math.PI); q.stroke();
  }, 4);
}
const PA11_KATRENK = [['#e7779e', '#ffa9c6', '#ffd4e3'], ['#ec83a8', '#ffb4ce', '#ffdbe8'], ['#f090b2', '#ffbfd5', '#ffe3ee']];
function pa11KatCiz(q, i) {   // tek pasta katı (sade pembe krema, tepeden damlayan krema sosu)
  const K = PA11_KAT[i], R = PA11_KATRENK[i], w = K.w, y0 = K.y0, y1 = K.y1, ry = K.ry;
  const yol = () => { q.beginPath(); q.moveTo(-w, y1); q.lineTo(-w, y0); q.ellipse(0, y0, w, ry, 0, Math.PI, 0, true); q.lineTo(w, y1); q.ellipse(0, y1, w, ry, 0, 0, Math.PI, true); q.closePath(); };
  yol(); q.fillStyle = pa11Lin(q, -w, 0, w, 0, [0, R[0], 0.2, R[1], 0.4, R[2], 0.62, R[1], 0.88, pa11Hex(R[1], R[0], 0.6), 1, R[0]]); q.fill();
  q.save(); yol(); q.clip();
  q.strokeStyle = 'rgba(255,255,255,0.2)'; q.lineWidth = 1.6;   // kremanın yumuşak spatula izleri
  for (let k = 1; k < 4; k++) { const yy = lerp(y1, y0, k / 4) + 2; q.beginPath(); q.ellipse(0, yy, w * 0.99, ry, 0, Math.PI * 0.12, Math.PI * 0.88); q.stroke(); }
  q.fillStyle = 'rgba(180,60,110,0.16)'; q.beginPath(); q.ellipse(0, y0 + ry * 0.2, w + 4, ry + 3, 0, 0, 6.2832); q.fill();   // tabanda yumuşak gölge
  q.restore();
  yol(); q.strokeStyle = 'rgba(170,60,110,0.5)'; q.lineWidth = 1.4; q.stroke();
  // üst yüzey: açık pembe sos
  q.fillStyle = pa11Rad(q, -w * 0.3, y1 - ry * 0.3, 2, 0, y1, w, [0, '#fffafc', 0.6, '#fff0f6', 1, '#ffdcea']); q.beginPath(); q.ellipse(0, y1, w, ry, 0, 0, 6.2832); q.fill();
  // ön kenardan damlayan krema
  const r = rng(1107 + i * 31), dr = [], g = 6.5 / w;
  for (let a = 0.22; a < Math.PI - 0.15; a += 13 / w + r() * 7 / w) dr.push({ a: a + (r() - 0.5) * 4 / w, L: 3 + r() * (i === 2 ? 7 : 11), g: g * (0.8 + r() * 0.5) });
  const L = a => { let v = 3.2; for (const d of dr) { const u = (a - d.a) / d.g; v += d.L * Math.exp(-u * u); } return v; };
  q.beginPath();
  for (let k = 0; k <= 80; k++) { const a = Math.PI * k / 80, x = w * Math.cos(a), yb = y1 + ry * Math.sin(a) + L(a) * Math.min(1, Math.sin(a) * 3); k ? q.lineTo(x, yb) : q.moveTo(x, yb); }
  q.ellipse(0, y1, w, ry, 0, Math.PI, 0, true); q.closePath();
  q.fillStyle = pa11Lin(q, 0, y1, 0, y1 + ry + 14, [0, '#fff8fb', 1, '#ffe4ef']); q.fill();
  q.strokeStyle = 'rgba(220,120,160,0.45)'; q.lineWidth = 1; q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.85)';
  for (const d of dr) { const x = w * Math.cos(d.a), yb = y1 + ry * Math.sin(d.a) + L(d.a) - 2.6; if (d.L > 5) { q.beginPath(); q.ellipse(x - 0.6, yb, 0.9, 1.4, 0, 0, 6.2832); q.fill(); } }
  q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = 1.5; q.beginPath(); q.ellipse(0, y1, w * 0.92, ry * 0.8, 0, Math.PI * 1.1, Math.PI * 1.45); q.stroke();
}
function pa11PastaSpr() {   // altın altlık + dantel + üç kat sade pasta; taban (0, 0)
  return pa11Tuval('pasta', -114, -172, 228, 182, q => {
    // ayak + sap
    q.fillStyle = '#c99040'; q.beginPath(); q.ellipse(0, -2, 30, 6, 0, 0, 6.2832); q.fill();
    q.fillStyle = pa11Lin(q, -28, 0, 28, 0, [0, '#e0a850', 0.45, '#ffe6a6', 1, '#d39a44']); q.beginPath(); q.ellipse(0, -4, 28, 5, 0, 0, 6.2832); q.fill();
    q.fillStyle = pa11Lin(q, -8, 0, 8, 0, [0, '#d9a24a', 0.45, '#ffeab0', 1, '#c98e3e']); q.beginPath(); q.roundRect ? q.roundRect(-8, -14, 16, 11, 3) : q.rect(-8, -14, 16, 11); q.fill();
    // tabak (kenar + üst yüzey + boncuklu kenar)
    q.fillStyle = '#c38a3a'; q.beginPath(); q.ellipse(0, -11, 105, 15.5, 0, 0, 6.2832); q.fill();
    q.fillStyle = pa11Lin(q, -104, 0, 104, 0, [0, '#e2ad58', 0.35, '#ffe9b4', 0.6, '#ffd884', 1, '#d39a44']); q.beginPath(); q.ellipse(0, -16, 104, 15.5, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(150,100,30,0.5)'; q.lineWidth = 1; q.stroke();
    q.fillStyle = '#fff2c8'; for (let k = 0; k < 26; k++) { const a = Math.PI * (k + 0.5) / 26; q.beginPath(); q.arc(Math.cos(a) * 104.5, -13 + Math.sin(a) * 15.8, 1.5, 0, 6.2832); q.fill(); }
    // dantel kâğıt
    q.fillStyle = '#ffffff'; for (let k = 0; k < 44; k++) { const a = k / 44 * 6.2832; q.beginPath(); q.arc(Math.cos(a) * 95, -16 + Math.sin(a) * 14, 4.2, 0, 6.2832); q.fill(); }
    q.beginPath(); q.ellipse(0, -16, 95, 14, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,170,205,0.55)'; for (let k = 0; k < 30; k++) { const a = k / 30 * 6.2832; q.beginPath(); q.arc(Math.cos(a) * 90, -16 + Math.sin(a) * 13.2, 1.3, 0, 6.2832); q.fill(); }
    for (let i = 0; i < 3; i++) {
      if (i) { const A = PA11_KAT[i - 1], B = PA11_KAT[i]; q.fillStyle = 'rgba(200,90,130,0.25)'; q.beginPath(); q.ellipse(0, A.y1 + 1, B.w + 5, B.ry + 2.5, 0, 0, 6.2832); q.fill(); }
      pa11KatCiz(q, i);
    }
  }, 4);
}
function pa11MasaSpr() {   // dantel örtülü yuvarlak mutfak masası; zemin ortası (0, 0), üst yüzey PA11_MASA
  return pa11Tuval('masa', -154, -82, 308, 88, q => {
    const Y = PA11_MASA;
    for (const sx of [-1, 1]) {   // arka ayaklar
      q.fillStyle = '#7f68b8'; q.beginPath(); q.roundRect ? q.roundRect(sx * 64 - 3.5, Y + 10, 7, -Y - 10, 3) : q.rect(sx * 64 - 3.5, Y + 10, 7, -Y - 10); q.fill(); }
    for (const sx of [-1, 1]) {   // ön ayaklar (kıvrık) + yuvarlak ayakçık
      q.beginPath(); q.moveTo(sx * 92, Y + 14); q.bezierCurveTo(sx * 104, Y + 30, sx * 90, -16, sx * 100, -4); q.lineTo(sx * 108, -4); q.bezierCurveTo(sx * 100, -18, sx * 116, Y + 32, sx * 104, Y + 14); q.closePath();
      q.fillStyle = pa11Lin(q, sx * 92, 0, sx * 110, 0, [0, '#c3aaf2', 1, '#9278d0']); q.fill(); q.strokeStyle = 'rgba(70,50,130,0.55)'; q.lineWidth = 1.2; q.stroke();
      q.fillStyle = '#ffd36a'; q.beginPath(); q.ellipse(sx * 104, -3, 6.5, 3.4, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(150,100,30,0.55)'; q.lineWidth = 0.9; q.stroke(); }
    // örtünün eteği: pembe, beyaz puanlı, dantel kenarlı
    const etek = () => { q.beginPath(); q.moveTo(-138, Y); q.lineTo(-141, Y + 30); q.ellipse(0, Y + 30, 141, 16, 0, Math.PI, 0, true); q.lineTo(138, Y); q.ellipse(0, Y, 138, 17, 0, 0, Math.PI, false); q.closePath(); };
    etek(); q.fillStyle = pa11Lin(q, -140, 0, 140, 0, [0, '#e6a8cc', 0.3, '#f8cfe4', 0.55, '#ffdcec', 0.8, '#f4c4dc', 1, '#dc9cc2']); q.fill();
    q.save(); etek(); q.clip();
    q.fillStyle = 'rgba(255,255,255,0.75)'; for (let row = 0; row < 4; row++) for (let k = -9; k <= 9; k++) { const x = k * 15 + (row % 2) * 7.5, y = Y + 9 + row * 10 + Math.cos(x / 141 * 1.57) * 12; q.beginPath(); q.arc(x, y, 1.7, 0, 6.2832); q.fill(); }
    q.strokeStyle = 'rgba(190,90,140,0.18)'; q.lineWidth = 5; for (const x of [-110, -64, -20, 26, 70, 114]) { q.beginPath(); q.moveTo(x, Y + 6); q.quadraticCurveTo(x + 4, Y + 30, x - 2, Y + 52); q.stroke(); }
    q.restore();
    etek(); q.strokeStyle = 'rgba(160,80,130,0.5)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = '#fffafc'; q.strokeStyle = 'rgba(200,140,175,0.6)'; q.lineWidth = 0.8;   // dantel fistolar
    for (let k = 0; k <= 26; k++) { const a = Math.PI * k / 26, x = Math.cos(a) * 141, y = Y + 30 + Math.sin(a) * 16; q.beginPath(); q.arc(x, y + 2.5, 5.6, 0, Math.PI); q.fill(); q.stroke(); }
    q.fillStyle = 'rgba(230,150,190,0.7)'; for (let k = 0; k <= 26; k++) { const a = Math.PI * (k + 0.5) / 26, x = Math.cos(a) * 141, y = Y + 30 + Math.sin(a) * 16; q.beginPath(); q.arc(x, y + 3, 1.1, 0, 6.2832); q.fill(); }
    // masa üstü (örtü)
    q.fillStyle = pa11Rad(q, -30, Y - 6, 4, 0, Y, 140, [0, '#fff4fa', 0.7, '#ffe2ef', 1, '#f6cde2']); q.beginPath(); q.ellipse(0, Y, 138, 17, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(200,120,160,0.5)'; q.lineWidth = 1; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 1.2; q.setLineDash([2, 2.5]); q.beginPath(); q.ellipse(0, Y, 124, 13.5, 0, 0, 6.2832); q.stroke(); q.setLineDash([]);
  }, 3);
}
function pa11TepsiSpr() {   // gümüş tepsi (iki kulplu); orta (0, 0)
  return pa11Tuval('tepsi', -148, -16, 296, 30, q => {
    for (const sx of [-1, 1]) { q.strokeStyle = '#9aa6c4'; q.lineWidth = 4.5; q.beginPath(); q.ellipse(sx * 128, -1, 13, 7, 0, sx > 0 ? -1.4 : Math.PI - 1.7, sx > 0 ? 1.7 : Math.PI + 1.4); q.stroke();
      q.strokeStyle = '#eef2ff'; q.lineWidth = 1.6; q.stroke(); }
    q.fillStyle = '#8c98b8'; q.beginPath(); q.ellipse(0, 2.5, 126, 15, 0, 0, 6.2832); q.fill();
    q.fillStyle = pa11Lin(q, -126, 0, 126, 0, [0, '#c6cfe6', 0.3, '#f6f8ff', 0.55, '#dfe5f6', 0.8, '#ffffff', 1, '#b4bed8']); q.beginPath(); q.ellipse(0, -1, 125, 14, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(90,100,140,0.5)'; q.lineWidth = 1; q.stroke();
    q.strokeStyle = 'rgba(160,170,200,0.7)'; q.lineWidth = 1; q.beginPath(); q.ellipse(0, -1, 112, 11.5, 0, 0, 6.2832); q.stroke();
    q.fillStyle = '#ffffff'; for (let k = 0; k < 24; k++) { const a = Math.PI * (k + 0.5) / 24; q.beginPath(); q.arc(Math.cos(a) * 125, 0.5 + Math.sin(a) * 14.5, 1.1, 0, 6.2832); q.fill(); }
  }, 3);
}
function pa11FanusSpr() {   // cam fanus (kurdeleli gümüş topuz); taban ortası (0, 0)
  return pa11Tuval('fanus', -128, -292, 256, 304, q => {
    const yol = () => { q.beginPath(); q.moveTo(-116, 0); q.bezierCurveTo(-120, -150, -86, -262, 0, -264); q.bezierCurveTo(86, -262, 120, -150, 116, 0); q.closePath(); };
    yol(); q.fillStyle = pa11Lin(q, -116, 0, 116, 0, [0, 'rgba(200,225,255,0.22)', 0.3, 'rgba(230,242,255,0.06)', 0.7, 'rgba(230,242,255,0.05)', 1, 'rgba(200,225,255,0.2)']); q.fill();
    q.strokeStyle = 'rgba(235,245,255,0.6)'; q.lineWidth = 2.2; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = 6; q.beginPath(); q.moveTo(-92, -40); q.bezierCurveTo(-98, -130, -76, -205, -30, -236); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.4)'; q.lineWidth = 3; q.beginPath(); q.moveTo(-78, -60); q.bezierCurveTo(-82, -120, -70, -170, -46, -200); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.45)'; q.lineWidth = 3.5; q.beginPath(); q.moveTo(96, -70); q.bezierCurveTo(100, -120, 88, -170, 66, -205); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.8)'; pa11Isilti(q, -56, -214, 7); q.fill(); pa11Isilti(q, 70, -96, 4.5); q.fill();
    // gümüş kenar
    q.strokeStyle = '#a8b4d0'; q.lineWidth = 6; q.beginPath(); q.ellipse(0, 0, 117, 9, 0, 0, Math.PI); q.stroke();
    q.strokeStyle = '#f4f7ff'; q.lineWidth = 2; q.beginPath(); q.ellipse(0, -1.5, 117, 9, 0, 0.1, Math.PI - 0.1); q.stroke();
    // topuz + pembe kurdele fiyonk
    q.fillStyle = pa11Rad(q, -3, -275, 1, 0, -270, 11, [0, '#ffffff', 0.5, '#dfe6f6', 1, '#98a4c4']); q.beginPath(); q.arc(0, -272, 9.5, 0, 6.2832); q.fill();
    q.fillStyle = '#c4cde4'; q.beginPath(); q.ellipse(0, -263.5, 12, 3.6, 0, 0, 6.2832); q.fill();
    for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(0, -262); q.quadraticCurveTo(sx * 18, -280, sx * 22, -262); q.quadraticCurveTo(sx * 17, -252, 0, -262); q.closePath();
      q.fillStyle = sx < 0 ? '#ff8fb6' : '#ff7aa6'; q.fill(); q.strokeStyle = '#d4507e'; q.lineWidth = 1; q.stroke();
      q.beginPath(); q.moveTo(sx * 2, -261); q.quadraticCurveTo(sx * 8, -248, sx * 12, -238); q.lineTo(sx * 16, -242); q.quadraticCurveTo(sx * 9, -252, sx * 4, -261); q.closePath(); q.fill(); q.stroke(); }
    q.fillStyle = '#ffb3d1'; q.beginPath(); q.arc(0, -262, 3.6, 0, 6.2832); q.fill();
  }, 2.5);
}
function pa11IsinSpr() {   // yumuşak ışık huzmeleri (döner); orta (0, 0)
  return pa11Tuval('isin', -260, -260, 520, 520, q => {
    q.fillStyle = pa11Rad(q, 0, 0, 0, 0, 0, 258, [0, 'rgba(255,240,210,0.75)', 0.35, 'rgba(255,214,232,0.35)', 1, 'rgba(255,214,232,0)']);
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832, d = 0.09 + (i % 2) * 0.05; q.beginPath(); q.moveTo(0, 0); q.arc(0, 0, 258, a - d, a + d); q.closePath(); q.fill(); }
  }, 1);
}
function pa11MamaSpr() {   // mama sandalyesi (arka parça: ayaklar, oturak, arkalık); zemin ortası (0, 0); Pıtır sola bakar
  return pa11Tuval('mama', -36, -132, 72, 136, q => {
    const ayak = (x0, y0, x1, y1, ic) => { q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 6.4; q.beginPath(); q.moveTo(x0, y0); q.lineTo(x1, y1); q.stroke();
      q.strokeStyle = ic ? '#a68ce0' : '#c8b2f4'; q.lineWidth = 4.6; q.stroke(); };
    ayak(-7, -64, -17, -1, true); ayak(9, -64, 19, -1, true);
    q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 4.6; q.beginPath(); q.moveTo(-22, -24); q.lineTo(22, -24); q.stroke(); q.strokeStyle = '#d8c6ff'; q.lineWidth = 3; q.stroke();   // ayak dayama
    ayak(-14, -64, -27, -1, false); ayak(14, -64, 27, -1, false);
    for (const x of [-27, -17, 19, 27]) { q.fillStyle = '#ffd36a'; q.beginPath(); q.ellipse(x, -1, 3.6, 1.8, 0, 0, 6.2832); q.fill(); }
    // arkalık (sağda): yuvarlak tepeli, ay oymalı
    q.beginPath(); q.moveTo(12, -66); q.lineTo(12, -116); q.quadraticCurveTo(12, -128, 20, -128); q.quadraticCurveTo(28, -128, 28, -116); q.lineTo(28, -66); q.closePath();
    q.fillStyle = pa11Lin(q, 12, 0, 28, 0, [0, '#c8b2f4', 1, '#9a80d8']); q.fill(); q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 1.3; q.stroke();
    q.fillStyle = '#ffe7a8'; q.beginPath(); q.arc(20, -112, 5, 0, 6.2832); q.fill(); q.fillStyle = '#b39ae8'; q.beginPath(); q.arc(22.5, -114, 4.3, 0, 6.2832); q.fill();
    q.fillStyle = '#ff9ac0'; pa11KalpYol(q, 20, -92, 3.6); q.fill();
    // oturak + pembe minder
    q.fillStyle = '#b49ae8'; q.beginPath(); q.roundRect ? q.roundRect(-22, -70, 48, 8, 3) : q.rect(-22, -70, 48, 8); q.fill(); q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = pa11Lin(q, 0, -78, 0, -68, [0, '#ffd0e2', 1, '#ff9cc0']); q.beginPath(); q.ellipse(3, -71, 21, 5, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(200,80,130,0.5)'; q.lineWidth = 1; q.stroke();
  }, 4);
}
function pa11MamaOnSpr() {   // mama sandalyesinin önü: kolluk + tepsi (Pıtır'ın önünde, solda)
  return pa11Tuval('mamaOn', -48, -100, 80, 22, q => {
    q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 4.6; q.beginPath(); q.moveTo(24, -86); q.lineTo(-20, -86); q.stroke(); q.strokeStyle = '#c8b2f4'; q.lineWidth = 3; q.stroke();
    q.fillStyle = '#a68ce0'; q.beginPath(); q.roundRect ? q.roundRect(-44, -89, 30, 6.5, 3) : q.rect(-44, -89, 30, 6.5); q.fill(); q.strokeStyle = 'rgba(70,50,130,0.6)'; q.lineWidth = 1.1; q.stroke();
    q.fillStyle = '#fff3e6'; q.beginPath(); q.ellipse(-29, -89.5, 14.5, 2.6, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(200,150,170,0.6)'; q.lineWidth = 0.8; q.stroke();
  }, 4);
}
function pa11IsiltiSpr() { return pa11Tuval('isilti', -10, -10, 20, 20, q => { q.fillStyle = pa11Rad(q, 0, 0, 0, 0, 0, 9, [0, 'rgba(255,255,255,0.8)', 1, 'rgba(255,255,255,0)']); q.beginPath(); q.arc(0, 0, 9, 0, 6.2832); q.fill(); q.fillStyle = '#ffffff'; pa11Isilti(q, 0, 0, 8.5); q.fill(); }, 4); }
function pa11KalpPSpr() { return pa11Tuval('kalpP', -9, -9, 18, 18, q => { pa11KalpYol(q, 0, 0, 6.5); q.fillStyle = '#ff8fb8'; q.fill(); q.strokeStyle = '#e0508a'; q.lineWidth = 1; q.stroke(); q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(-2.6, -2.6, 1.3, 0, 6.2832); q.fill(); }, 4); }
const PA11_SERP = ['#ff8fc0', '#ffe27a', '#9ff0d0', '#c39bff', '#ffffff', '#ff6f8f'];
function pa11SerpSpr(i) { return pa11Tuval('serp' + i, -4, -2, 8, 4, q => { q.fillStyle = PA11_SERP[i]; q.beginPath(); q.roundRect ? q.roundRect(-3.4, -1.3, 6.8, 2.6, 1.3) : q.rect(-3.4, -1.3, 6.8, 2.6); q.fill(); q.fillStyle = 'rgba(255,255,255,0.6)'; q.fillRect(-2.4, -1, 3, 0.7); }, 6); }

// ═══════════════════════════════ pastadaki süs parçalarının yerleri ═══════════════════════════════
// Altlık tabanına göre (x, y), yatay basıklık sx (silindirin yanında perspektif), dönüş r, sprite. Çizim sırası arkadan öne (PA11_CIZ).
const PA11_PAR = {};
(function pa11ParcaKur() {
  const [A, B, C] = PA11_KAT, L = [];
  const inci = []; for (let i = 0; i < 13; i++) { const a = Math.PI * (12 - i + 0.5) / 13; inci.push({ x: Math.cos(a) * (A.w + 1.5), y: A.y0 + Math.sin(a) * (A.ry + 0.6) - 2.6, sx: 1, r: 0, sp: i % 2 ? 'inciP' : 'inci' }); }
  const cilek = []; for (let i = 0; i < 7; i++) { const a = Math.PI * (0.94 - 0.88 * i / 6); cilek.push({ x: Math.cos(a) * 74, y: A.y1 + Math.sin(a) * 10.5 + 1, sx: 1, r: Math.cos(a) * -0.18, sp: 'cilek' }); }
  const kalp = []; for (let i = 0; i < 5; i++) { const a = Math.PI * (0.82 - 0.64 * i / 4); kalp.push({ x: Math.cos(a) * (B.w + 0.5), y: (B.y0 + B.y1) / 2 + Math.sin(a) * B.ry * 0.7 - 3, sx: Math.sqrt(Math.sin(a)), r: 0, sp: 'kalp' }); }
  const yildiz = []; for (let i = 0; i < 6; i++) { const a = Math.PI * (0.92 - 0.84 * i / 5); yildiz.push({ x: Math.cos(a) * 52.5, y: B.y1 + Math.sin(a) * 7.6 + 1, sx: 1, r: (i % 2 ? 0.25 : -0.2), sp: 'yildiz', i }); }
  const ay = []; for (let i = 0; i < 3; i++) { const a = Math.PI * (0.76 - 0.26 * i); ay.push({ x: Math.cos(a) * (C.w + 0.5), y: (C.y0 + C.y1) / 2 + Math.sin(a) * C.ry + 1, sx: Math.sqrt(Math.sin(a)), r: -0.25, sp: 'ay' }); }
  const yarasa = [{ x: -25, y: C.y1 + 3, sx: 1, r: -0.16, sp: 'yarasa' }, { x: 25, y: C.y1 + 3, sx: -1, r: 0.16, sp: 'yarasa' }];
  const buyuk = [{ x: 0, y: C.y1 + 4.5, sx: 1, r: 0, sp: 'buyuk' }];
  PA11_PAR.sekerInci = inci; PA11_PAR.cilek = cilek; PA11_PAR.kremaKalp = kalp; PA11_PAR.yildizSeker = yildiz;
  PA11_PAR.ayBiskuvi = ay; PA11_PAR.yarasaKurabiye = yarasa; PA11_PAR.buyukCilek = buyuk;
})();
const PA11_CIZ = [5, 6, 4, 3, 2, 1, 0];   // arkadan öne: yarasa kurabiyeleri, kocaman çilek, ay bisküviler, yıldızlar, kalpler, çilekler, inciler
const PA11_ARA = [0.045, 0.075, 0.09, 0.07, 0.12, 0.15, 0];   // parçaların "pıt pıt" yerleşme aralığı (sn)
function pa11ParcaSpr(p) { return p.sp === 'yildiz' ? pa11SusSpr('yildiz', p.i) : pa11SusSpr(p.sp); }
function pa11ParcaKoy(c, p, x, y, k) {   // k: büyüme (0..~1.3)
  if (!(k > 0.01)) return;
  const sp = pa11ParcaSpr(p), M = c.getTransform();
  c.translate(x + p.x, y + p.y); if (p.r) c.rotate(p.r); c.scale(p.sx * k, k); pa11Koy(c, sp, 0, 0); c.setTransform(M);
}
function pa11Pop(u) { if (u <= 0) return 0; if (u >= 1) return 1; return (1 - Math.pow(1 - u, 3)) * (1 + 0.35 * Math.sin(u * Math.PI)); }
function pa11BayrakKoy(c, x, y, k, aci) {   // bayrak kocaman çileğin tepesine saplı
  if (!(k > 0.01)) return;
  const M = c.getTransform(); c.translate(x + 5, y + PA11_KAT[2].y1 - 37); c.rotate(0.14 + aci); c.scale(k, k); pa11Koy(c, pa11SusSpr('bayrak'), 0, 0); c.setTransform(M);
}
function pa11PastaTamSpr() {   // süslenmiş bitmiş pasta (balo ve oyun sonu için tek sprite)
  return pa11Tuval('pastaTam', -114, -246, 228, 256, q => {
    pa11Koy(q, pa11PastaSpr(), 0, 0);
    for (const gi of PA11_CIZ) { const ad = PA11_SUS[gi].ad; for (const p of PA11_PAR[ad]) pa11ParcaKoy(q, p, 0, 0, 1); if (ad === 'buyukCilek') pa11BayrakKoy(q, 0, 0, 1, 0); }
  }, 4);
}
// Ortak çizici: bitmiş pasta (balo11.js vb.). (x, y) altlığın tabanı; s ölçek; o: { kapak, tepsi, parla, alfa }
function pa11PastaCiz(c, x, y, s, t, o) {
  o = o || PA11_BOS; s = s || 1; t = t || 0;
  if (!(Number.isFinite(x) && Number.isFinite(y))) return;
  const al = o.alfa == null ? 1 : clamp(o.alfa, 0, 1); if (al <= 0.01) return;
  const M = c.getTransform(), ea = c.globalAlpha; c.globalAlpha = ea * al;
  c.translate(x, y); c.scale(s, s);
  const par = o.parla == null ? 0.6 : clamp(o.parla, 0, 1);
  pa11Isik(c, '#ffd6e8', 0, -110, 170, 0.3 + 0.25 * par);
  const tep = o.tepsi == null ? 0 : clamp(o.tepsi, 0, 1);
  if (tep > 0.01) { c.globalAlpha = ea * al * tep; pa11Koy(c, pa11TepsiSpr(), 0, 0); c.globalAlpha = ea * al; }
  pa11Koy(c, pa11PastaTamSpr(), 0, -4 * tep);
  if (par > 0.02) for (let i = 0; i < 6; i++) { const u = (t * 0.6 + i / 6) % 1, a = Math.sin(u * Math.PI);
    const px = Math.sin(i * 2.4 + 1.1) * 70 * (1 - i / 9), py = -30 - i * 28 - 6; c.globalAlpha = ea * al * a * par; pa11Koy(c, pa11IsiltiSpr(), px, py); }
  c.globalAlpha = ea * al;
  const kap = o.kapak == null ? 0 : clamp(o.kapak, 0, 1);
  if (kap > 0.01) { c.globalAlpha = ea * al * kap; pa11Koy(c, pa11FanusSpr(), 0, -4 * tep); }
  c.globalAlpha = ea; c.setTransform(M);
}
function pa11Hazirla() {   // bütün sprite'lar kurulumda bir kez (oyun sırasında takılma olmasın)
  pa11PastaSpr(); pa11MasaSpr(); pa11TepsiSpr(); pa11FanusSpr(); pa11IsinSpr(); pa11MamaSpr(); pa11MamaOnSpr(); pa11Balon(); pa11IsiltiSpr(); pa11KalpPSpr();
  for (let i = 0; i < PA11_SERP.length; i++) pa11SerpSpr(i);
  for (const d of PA11_SUS) pa11IkonSpr(d.ad);
  for (const ad of ['inci', 'inciP', 'cilek', 'kalp', 'ay', 'yarasa', 'buyuk', 'bayrak']) pa11SusSpr(ad);
  for (let i = 0; i < 3; i++) pa11SusSpr('yildiz', i);
  pa11PastaTamSpr();
}

// ═══════════════════════════════ parçacıklar (sabit havuz) ═══════════════════════════════
// tip 1 ışık tozu · 2 kalp · 3 ışıltı · 4 şeker serpintisi (düşer, masada söner)
const PA11_TZ = []; for (let i = 0; i < 160; i++) PA11_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#ffffff', ph: 0, rot: 0, vr: 0, zy: 0, ci: 0 });
function pa11Toz(tip, x, y, vx, vy, max, s, col) {
  for (let i = 0; i < PA11_TZ.length; i++) { const p = PA11_TZ[i]; if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.ph = Math.random() * 6.2832; p.rot = Math.random() * 6.2832; p.vr = (Math.random() - 0.5) * 10; p.zy = 1e9; p.ci = (Math.random() * PA11_SERP.length) | 0; return p; } }
  return null;
}
const PA11_PARLA = ['#ffd27a', '#ff9fd3', '#c39bff', '#ffe7a8', '#9ff0d0'];
function pa11IsikSac(x, y, n, hiz, cols) { cols = cols || PA11_PARLA; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); pa11Toz(i % 3 ? 1 : 3, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.8 + Math.random() * 0.7, i % 3 ? 5 + Math.random() * 6 : 6 + Math.random() * 4, cols[i % cols.length]); } }
function pa11Serp(x, y, n, zy) { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 120 + Math.random() * 170; const p = pa11Toz(4, x, y, Math.cos(a) * v, Math.sin(a) * v, 1.6 + Math.random() * 0.6, 1, '#ffffff'); if (p) p.zy = zy; } }
function pa11EfektAdim(dt) {
  for (const p of PA11_TZ) if (p.a) {
    p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 4) {
      if (p.y < p.zy) { p.vy += 620 * dt; p.vx *= Math.exp(-dt * 1.2); p.rot += p.vr * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.y >= p.zy) { p.y = p.zy; p.vx = p.vy = 0; p.t = Math.max(p.t, p.max - 0.45); } }
    } else {
      p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) - (p.tip === 2 ? 26 : 10) * dt; p.x += p.vx * dt + (p.tip === 2 ? Math.sin(p.t * 4 + p.ph) * 12 * dt : 0); p.y += p.vy * dt;
    }
  }
}
function pa11TozCiz(c) {
  const IS = pa11IsiltiSpr(), KP = pa11KalpPSpr();
  for (const p of PA11_TZ) if (p.a) {
    const v = p.t / p.max, a = Math.min(1, v * 6) * (1 - v);
    if (p.tip === 1) { pa11Isik(c, p.col, p.x, p.y, p.s * 2.2, a * 0.8); c.globalAlpha = a; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, p.s * 0.28, 0, 6.2832); c.fill(); c.globalAlpha = 1; }
    else if (p.tip === 2) { c.globalAlpha = a; const k = p.s * (0.8 + 0.2 * Math.sin(p.t * 8)); c.drawImage(KP, p.x - 9 * k, p.y - 9 * k, 18 * k, 18 * k); c.globalAlpha = 1; }
    else if (p.tip === 3) { const k = p.s / 10 * (0.7 + 0.3 * Math.sin(p.t * 12 + p.ph)); pa11Isik(c, p.col, p.x, p.y, p.s * 2, a * 0.5); c.globalAlpha = a; c.drawImage(IS, p.x - 10 * k, p.y - 10 * k, 20 * k, 20 * k); c.globalAlpha = 1; }
    else if (p.tip === 4) { const sp = pa11SerpSpr(p.ci), M = c.getTransform(); c.globalAlpha = Math.min(1, (p.max - p.t) / 0.45); c.translate(p.x, p.y); c.rotate(p.rot); pa11Koy(c, sp, 0, 0); c.setTransform(M); c.globalAlpha = 1; }
  }
}

// ═══════════════════════════════ oyun akışı ═══════════════════════════════
// faz: 'bekle' → (Feza yaklaşır) 'gel' (Nine el sallar) → 'oyun' (altı süs + kocaman çilek) → 'son' (ışıl ışıl, tepsi, fanus) → 'bitti'
const PA11_S = { isin: 0.35, cilek: 1.0, kalk: 2.7, kalkSon: 3.25, otur: 3.6, fanus0: 3.9, fanus1: 4.9, bitir: 5.8 };   // son zaman çizelgesi (sn)
function pa11Taban(o) { const k = o.pa; return [o.x, o.y + PA11_MASA - k.tepsi * 4 - k.kalkY]; }   // pasta altlığının tabanı (dünya)
const PA11_P2 = [0, 0];
function pa11Hedef(o, m) { const k = o.pa; PA11_P2[0] = o.x; PA11_P2[1] = o.y + PA11_MASA - k.tepsi * 4 - k.kalkY + m.d.ay; return PA11_P2; }
function pa11Kase(o) { return [o.x + PA11_NX - 34, o.y - 86]; }   // Nine'nin krema kâsesi (baloncuklar buradan yükselir)
function pa11Siradaki(o) { const k = o.pa; for (const m of k.sus) if (m.durum === 'bekle' || m.durum === 'geri') return m; for (const m of k.sus) if (m.durum === 'cik') return m; return null; }
function pa11Kullanici(o) { const k = o.pa; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
function pa11PastaUstunde(o, x, y, pay) { const [bx, by] = pa11Taban(o); return x > bx - 112 - pay && x < bx + 112 + pay && y > by - 205 - pay && y < by + 6 + pay * 0.4; }
function pa11OyunBasla(o) {   // Nine kâseyi kaldırır, altı ışık baloncuğu kâseden yükselip pastanın üstünde yay çizer
  const k = o.pa, [kx, ky] = pa11Kase(o); k.faz = 'oyun'; k.fT = 0; k.idle = 0;
  k.sus.forEach((m, i) => { if (i < 6 && m.durum === 'gizli') { m.durum = 'cik'; m.t = -0.1 - (5 - i) * 0.24; m.s = 0.3; m.x = m.x0 = kx; m.y = m.y0 = ky; } });
  k.nine.sevT = 0.8; pa11IsikSac(kx, ky - 8, 14, 110); pa11Sfx('parilti', 0.8);
}
function pa11BuyukCik(o) {   // altı süs bitti: ay ışığından kocaman çilek iner
  const k = o.pa, m = k.sus[6]; if (m.durum !== 'gizli') return;
  m.durum = 'cik'; m.t = 0; m.s = 0.3; m.x = m.x0 = o.x + m.d.fx * PA11_FXK + 40; m.y = m.y0 = o.y - 660;
  k.nine.sevT = 1.2; k.idle = 0; pa11Sfx('parilti', 0.8); OLAY.emit('pastaBuyukCilek', { o });
}
function pa11SusUc(o, m, kaynak) {   // süs pastaya uçar (dokunuş, bırakma, yakalama, Pırıl)
  if (!m || m.durum === 'uc' || m.durum === 'bitti' || m.durum === 'gizli') return false;
  if (m.durum === 'cik' && m.t < 0.2) return false;
  const h = pa11Hedef(o, m), d = Math.hypot(h[0] - m.x, h[1] - m.y);
  if (PASTA11.tut === m) PASTA11.tut = null;
  m.durum = 'uc'; m.t = 0; m.x1 = m.x; m.y1 = m.y; m.s1 = m.s;
  m.sure = kaynak === 'yakala' ? 0.34 : kaynak === 'piril' ? 0.45 : clamp(d / 520, 0.45, 0.9); m.yay = kaynak === 'yakala' ? 10 : kaynak === 'piril' ? 16 : Math.min(90, d * 0.25);
  pa11IsikSac(m.x, m.y, 9, 80, [m.d.renk, '#ffffff', '#ffe7a8']); pa11Sfx('parilti', 0.45);   // baloncuk "pıt" diye açılır
  o.pa.nine.bakT = 1.2;
  return true;
}
function pa11Yerles(o, m) {   // süs pastaya oturdu: bir avuç parça sırayla "pıt pıt" yerleşir, pasta yaylanır, serpinti, herkes sevinir
  const k = o.pa, d = m.d, G = k.grup[m.i]; k.n++; const n = k.n;
  G.on = true; G.t = 0; G.n = 0;
  const [bx, by] = pa11Taban(o), hy = by + d.ay;
  k.wob = 1; k.flas = 1; k.parla = Math.min(1, k.parla + 0.13);
  pa11IsikSac(bx, hy, 14, 130, [d.renk, '#ffffff', '#ffe7a8']);
  pa11Serp(bx + (Math.random() - 0.5) * 40, hy - 12, 12, o.y + PA11_MASA);
  for (let i = 0; i < 3; i++) pa11Toz(2, bx + (i - 1) * 34, hy - 34 - i * 8, 0, -30, 2 + i * 0.3, 1, '#ff8fb8');
  const N = k.nine; N.alkT = 1.2; N.bakT = 1.2; k.bebek.alkT = 1.1; k.fzSev = 1.4; k.pr.kirp = 1.0;
  pa11Sfx('pastaSus', n);
  OLAY.emit('pastaSus', { o, n, ad: d.ad, kat: d.kat + 1 });
  if (d.kat < 3) { k.katN[d.kat]++; if (k.katN[d.kat] === 2) k.katBek[d.kat] = 0.55; }
  if (n === 6) k.buyukBek = 1.1;
  if (d.ad === 'buyukCilek') { k.faz = 'son'; k.sT = 0; k.helpOn = false; k.tasinan = null; pa11GirdiBirak(); }
}
function pa11KatParla(o, i) {   // bir katın iki süsü de kondu: kat ışıl ışıl parlar, Nine sevinçle şaşırır, Pıtır alkışlar
  const k = o.pa, K = PA11_KAT[i], [bx, by] = pa11Taban(o), cy = by + (K.y0 + K.y1) / 2;
  k.katParla[i] = 1; k.nine.sasT = 1.3; k.bebek.alkT = 1.8; k.wob = Math.max(k.wob, 0.6);
  for (let j = 0; j < 12; j++) { const a = j / 12 * 6.2832; pa11Toz(3, bx + Math.cos(a) * (K.w + 12), cy + Math.sin(a) * (K.ry + 20), Math.cos(a) * 40, Math.sin(a) * 20 - 30, 0.9, 7, PA11_PARLA[j % 5]); }
  pa11Sfx('pastaParla', i + 1); OLAY.emit('pastaKat', { o, kat: i + 1 });
}
function pa11SusAdim(o, dt) {
  const k = o.pa; let yakin = 0;
  for (const m of k.sus) {
    const fx = o.x + m.d.fx * PA11_FXK, fy = o.y + m.d.fy * PA11_FYK, bs = m.bs;
    m.sal = Math.max(0, m.sal - dt * 1.6);
    if (m.durum === 'cik') {
      m.t += dt; if (m.t < 0) { m.x = m.x0; m.y = m.y0; continue; }
      const buyuk = m.i === 6, sure = buyuk ? 1.7 : PA11_CIK, u = clamp(m.t / sure, 0, 1), e = 1 - Math.pow(1 - u, 3), yan = buyuk ? 0 : (fx < m.x0 ? -30 : 30);
      m.x = lerp(m.x0, fx, e) + Math.sin(u * Math.PI) * yan; m.y = lerp(m.y0, fy, e) - (buyuk ? 0 : Math.sin(u * Math.PI) * 60);
      m.s = 0.3 + (bs - 0.3) * smooth(Math.min(1, u * 1.5)); m.rot = (1 - e) * (buyuk ? 0.6 : 2.4) * (yan < 0 ? -1 : 1);
      if (buyuk && Math.random() < dt * 30) pa11Toz(Math.random() < 0.4 ? 3 : 1, m.x + (Math.random() - 0.5) * 50, m.y - 10 + (Math.random() - 0.5) * 40, 0, -16, 1, 6, Math.random() < 0.5 ? '#cfe6ff' : '#ffe7a8');   // ay ışığı izi
      if (u >= 1) { m.durum = 'bekle'; m.t = 0; pa11IsikSac(m.x, m.y, buyuk ? 12 : 5, 50, [m.d.renk, '#ffffff', '#cfe6ff']); }
    } else if (m.durum === 'bekle') {
      m.t += dt; const tt = k.t, w = Math.sin(m.sal * 9) * m.sal;
      m.x = fx + Math.sin(tt * 1.1 + m.i * 1.7) * 5 + w * 6; m.y = fy + Math.sin(tt * 1.5 + m.i) * 7 - m.sal * 6;
      m.s += (bs * (1 + m.sal * 0.12) - m.s) * (1 - Math.exp(-dt * 6)); m.rot = Math.sin(tt * 1.2 + m.i * 2) * 0.12 + w * 0.2;
    } else if (m.durum === 'tut') {
      const kk = 1 - Math.exp(-dt * 20), ox = m.x; m.x += (PASTA11.hx - m.x) * kk; m.y += (PASTA11.hy - m.y) * kk;
      m.s += (bs * 1.1 - m.s) * (1 - Math.exp(-dt * 10)); m.rot += (clamp((m.x - ox) / Math.max(dt, 1e-3) * 0.0012, -0.5, 0.5) - m.rot) * (1 - Math.exp(-dt * 8));
      const h = pa11Hedef(o, m), dd = Math.hypot(h[0] - m.x, h[1] - m.y); yakin = Math.max(yakin, 1 - clamp((dd - 90) / 260, 0, 1));
      if (Math.abs(m.x - ox) > 0.4 && Math.random() < dt * 24) pa11Toz(Math.random() < 0.3 ? 3 : 1, m.x + (Math.random() - 0.5) * 30, m.y + (Math.random() - 0.5) * 30, 0, 10, 0.7, 5 + Math.random() * 3, m.d.renk);   // sürüklerken ışık izi
      if (pa11PastaUstunde(o, m.x, m.y, 8)) pa11SusUc(o, m, 'yakala');
    } else if (m.durum === 'geri') {
      m.t += dt; const u = clamp(m.t / 0.7, 0, 1), e = smooth(u);
      m.x = lerp(m.x1, fx, e); m.y = lerp(m.y1, fy, e) - Math.sin(u * Math.PI) * 14; m.s += (bs - m.s) * (1 - Math.exp(-dt * 6)); m.rot *= Math.exp(-dt * 5);
      if (u >= 1) { m.durum = 'bekle'; m.t = 0; }
    } else if (m.durum === 'pir') {
      const pr = k.pr; m.x = pr.x + pr.f * 3; m.y = pr.y + 32; m.s += (0.85 - m.s) * (1 - Math.exp(-dt * 6)); m.rot = Math.sin(k.t * 5) * 0.15;
    } else if (m.durum === 'uc') {
      m.t += dt; const u = clamp(m.t / m.sure, 0, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, h = pa11Hedef(o, m);
      m.x = lerp(m.x1, h[0], e); m.y = lerp(m.y1, h[1], e) - Math.sin(u * Math.PI) * m.yay; m.rot += dt * 6 * (1 - u); m.s = lerp(m.s1, 0.55, e);
      if (u >= 1) { m.durum = 'bitti'; pa11Yerles(o, m); }
    }
  }
  k.yakin += (yakin - k.yakin) * (1 - Math.exp(-dt * 6));
}
function pa11GrupAdim(o, dt) {   // yerine oturan süslerin parçaları sırayla belirir (her birinde minik ışıltı)
  const k = o.pa; let bx = 0, by = 0, hz = false;
  for (let gi = 0; gi < 7; gi++) {
    const G = k.grup[gi]; if (!G.on) continue; G.t += dt;
    const L = PA11_PAR[PA11_SUS[gi].ad], ara = PA11_ARA[gi];
    while (G.n < L.length && G.t >= G.n * ara) {
      if (!hz) { const tb = pa11Taban(o); bx = tb[0]; by = tb[1]; hz = true; }
      const p = L[G.n]; G.n++;
      pa11Toz(3, bx + p.x, by + p.y - 6, (Math.random() - 0.5) * 30, -30, 0.55, 5 + Math.random() * 3, PA11_SUS[gi].renk);
      if (G.n % 3 === 1) pa11Toz(1, bx + p.x, by + p.y - 4, 0, -24, 0.8, 6, '#ffffff');
    }
  }
}
function pa11OyunAdim(o, dt) {
  const k = o.pa; let bekleyen = false, hareket = false, yalnizBuyuk = true;
  for (const m of k.sus) { if (m.durum === 'bekle' || m.durum === 'geri') { bekleyen = true; if (m.i !== 6) yalnizBuyuk = false; } else if (m.durum === 'uc' || m.durum === 'pir' || m.durum === 'tut' || m.durum === 'cik') hareket = true; }
  const esik = bekleyen && yalnizBuyuk ? PA11_YARDIMB : k.helpN > 0 ? PA11_YARDIM2 : PA11_YARDIM;
  if (PASTA11.ptr < 0 && bekleyen && !hareket) { k.idle += dt; if (!k.helpOn && k.idle >= esik) { k.helpOn = true; k.helpT = 0; k.helpN++; OLAY.emit('pastaYardim', { o }); } }
  if (k.helpOn) k.helpT += dt;
  for (let i = 0; i < 3; i++) if (k.katBek[i] > 0) { k.katBek[i] -= dt; if (k.katBek[i] <= 0) { k.katBek[i] = -1; pa11KatParla(o, i); } }
  if (k.buyukBek > 0) { k.buyukBek -= dt; if (k.buyukBek <= 0) { k.buyukBek = -1; pa11BuyukCik(o); } }
}
function pa11SonAdim(o, dt) {   // kocaman çilek kondu: ışıl ışıl → Pıtır'a minik çilek → sihirle tepsiye → cam fanus → bitti
  const k = o.pa, t0 = k.sT; k.sT += dt; const t = k.sT, [bx, by] = pa11Taban(o), gec = a => t0 < a && t >= a;
  for (let i = 0; i < 3; i++) if (k.katBek[i] > 0) { k.katBek[i] = -1; pa11KatParla(o, i); }
  k.bayrak = clamp((t - 0.12) / 0.4, 0, 1);
  if (gec(0.12)) pa11IsikSac(bx + 5, by - 215, 8, 70, ['#ffe7a8', '#c39bff', '#ffffff']);
  if (gec(PA11_S.isin)) {
    k.isinH = 1; k.nine.dansT = 2.3; k.bebek.alkT = 2.6; k.fzSev = 2.6; k.parla = 1;
    pa11Sfx('pastaParla', 4); pa11IsikSac(bx, by - 120, 22, 180); pa11Serp(bx, by - 205, 22, o.y + PA11_MASA);
    for (let i = 0; i < 5; i++) pa11Toz(2, bx + (i - 2) * 42, by - 150 - (i % 2) * 22, 0, -40, 2.4, 1.15, '#ff8fb8');
  }
  if (t > PA11_S.isin && t < PA11_S.kalk && Math.random() < dt * 16) pa11Toz(3, bx + (Math.random() - 0.5) * 190, by - 20 - Math.random() * 200, 0, -16, 0.9, 6 + Math.random() * 4, PA11_PARLA[(Math.random() * 5) | 0]);
  if (gec(PA11_S.cilek)) { k.bebek.cilT = 0; pa11Sfx('parilti', 0.5); }
  if (gec(PA11_S.kalk)) { k.nine.elT = 1.4; pa11Sfx('parilti', 0.7); }
  if (t >= PA11_S.kalk) {   // sihirli kalkış: pasta 22 birim yükselir, altına gümüş tepsi gelir, yumuşakça oturur
    const u1 = clamp((t - PA11_S.kalk) / (PA11_S.kalkSon - PA11_S.kalk), 0, 1), u2 = clamp((t - PA11_S.kalkSon) / (PA11_S.otur - PA11_S.kalkSon), 0, 1);
    k.kalkY = 22 * smooth(u1) * (1 - smooth(u2)); k.tepsi = smooth(clamp((t - PA11_S.kalk - 0.15) / 0.45, 0, 1));
    if (t < PA11_S.otur && Math.random() < dt * 40) { const a = Math.random() * 6.2832; pa11Toz(1, bx + Math.cos(a) * 112, by + 4 + Math.sin(a) * 12, -Math.cos(a) * 20, -40, 0.8, 6, Math.random() < 0.5 ? '#cfe6ff' : '#eaf4ff'); }
  }
  if (gec(PA11_S.otur)) k.wob = Math.max(k.wob, 0.5);
  if (t >= PA11_S.fanus0) k.fanus = clamp((t - PA11_S.fanus0) / (PA11_S.fanus1 - PA11_S.fanus0), 0, 1);
  if (gec(PA11_S.fanus1)) {
    k.nine.alkT = 1.4; k.bebek.alkT = 1.4; k.fzSev = 1.4; k.pr.kirp = 1;
    pa11Sfx('pastaKapak', 1); OLAY.emit('pastaKapak', { o });
    for (let j = 0; j < 16; j++) { const a = j / 16 * 6.2832; pa11Toz(3, bx + Math.cos(a) * 122, by + Math.sin(a) * 10, Math.cos(a) * 50, -20, 0.9, 7, j % 2 ? '#cfe6ff' : '#ffe7a8'); }
  }
  if (t >= PA11_S.bitir) pa11Bitir(o);
}
function pa11NineAdim(o, dt) {
  const N = o.pa.nine, B = o.pa.bebek;
  N.elT = Math.max(0, N.elT - dt); N.alkT = Math.max(0, N.alkT - dt); N.sasT = Math.max(0, N.sasT - dt); N.dansT = Math.max(0, N.dansT - dt);
  N.konT = Math.max(0, N.konT - dt); N.bakT = Math.max(0, N.bakT - dt); N.sevT = Math.max(0, N.sevT - dt); N.faz += dt;
  const h = N.alkT > 0 || N.sasT > 0 || N.dansT > 0 || N.sevT > 0 ? 1 : 0.6; N.mutlu += (h - N.mutlu) * (1 - Math.exp(-dt * 4));
  B.alkT = Math.max(0, B.alkT - dt); if (B.cilT >= 0 && B.cilT < 9) B.cilT += dt;
  if (o.done && N.elT <= 0 && Math.abs(P.x - (o.x + PA11_NX)) < 260 && ((o.pa.t % 6) < dt)) N.elT = 1.6;   // bittikten sonra Feza yakındaysa ara sıra el sallar
}
function pa11PirilAdim(o, dt) {   // Pırıl: Feza'nın yanı · ipucu (süsün yanından pastaya süzülür) · yardım (taşır) · son: pastanın çevresinde tur
  const k = o.pa, pr = k.pr, e = k.entry, [bx, by] = pa11Taban(o), mx = bx, my = by - 110;
  pr.kirp = Math.max(0, pr.kirp - dt);
  let tx = e.x + 46, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'oyun') {
    const sira = pa11Siradaki(o), ta = k.tasinan, ipucu = k.idle > PA11_GOSTER || k.helpOn;
    if (ta && ta.durum === 'pir') {   // süsü pastanın üstüne taşıyor
      tx = bx - 30; ty = by - 300 + Math.sin(k.t * 4) * 3; hiz = 3; bak = Math.sign(bx - pr.x) || 1;
      if (Math.hypot(tx - pr.x, ty - pr.y) < 18) { pa11SusUc(o, ta, 'piril'); k.tasinan = null; k.helpT = -1.2; pr.kirp = 0.5; }
    } else if (k.tasinan && k.tasinan.durum !== 'pir') k.tasinan = null;
    else if (k.helpOn && sira && sira.durum === 'bekle' && k.helpT > 0.8) {   // sıradakini almaya gider
      tx = sira.x - 2; ty = sira.y - 32; hiz = 3.2; bak = Math.sign(sira.x - pr.x) || 1;
      if (Math.hypot(tx - pr.x, ty - pr.y) < 18) { sira.durum = 'pir'; k.tasinan = sira; pa11Sfx('parilti', 0.5); pa11IsikSac(sira.x, sira.y, 6, 50, [sira.d.renk, '#ffffff']); }
    } else if (ipucu && sira && sira.durum === 'bekle') {   // yol gösterir: süsün yanından pastaya doğru kısa süzülüş, ardında ışık izi
      const u = (k.t * 0.5) % 1, s = smooth(Math.min(1, u * 1.4)), ax = sira.x - 36, ay = sira.y - 20;
      tx = lerp(ax, lerp(ax, mx, 0.35), s); ty = lerp(ay, lerp(ay, my - 60, 0.35), s) - Math.sin(Math.min(1, u * 1.4) * Math.PI) * 18; hiz = 5; bak = Math.sign(mx - sira.x) || 1;
      if (Math.random() < dt * 12) pa11Toz(1, pr.x - bak * 8, pr.y + 6, -bak * 14, 6, 0.9, 5, PA11_PARLA[(Math.random() * 5) | 0]);
    } else bak = Math.sign(mx - pr.x) || 1;
  } else if (k.faz === 'son') {
    const t = k.sT;
    if (t > PA11_S.isin && t < PA11_S.kalk) { const a = (t - PA11_S.isin) * 2.7 - 1.2; tx = bx + Math.cos(a) * 150; ty = by - 140 + Math.sin(a) * 50; hiz = 5; bak = Math.sin(a) > 0 ? -1 : 1; }
    else { tx = e.x + 50; ty = e.y - 122 + Math.sin(k.t * 2.4) * 5; hiz = 4; bak = 1; }
  }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}
function pa11Aktiflestir(o) {
  const k = o.pa; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x = clamp(P.x, o.x + PA11_GIR0, o.x + PA11_GIR1); e.y = o.y; e.safeX = e.x; e.safeY = o.y; e.f = 1;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; PASTA11.o = o; pa11GirdiBirak();
  P.ucus = o; P.x = e.x; P.y = e.y; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  if (k.faz === 'bekle') { k.faz = 'gel'; k.fT = 0; k.nine.elT = 2.0; }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('pasta', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('pastaBasla', { o }); }
  return true;
}
function pa11Birak(o, tamam) {   // Feza'yı bırak (girişteki yerinde, yerde)
  const k = o.pa, e = k.entry;
  if (k.aktif) {
    if (P.ucus === o) {
      P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = 1;
      P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
      if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
    }
    k.aktif = false; k.helpOn = false; pa11GirdiBirak();
    if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('pasta', 0.1, k.kameraFn, 1, 0.42);
  }
  if (tamam && !o.done) { o.done = true; o.tk.bitti = true; k.bitti = true; if (typeof V11 !== 'undefined' && V11) V11.pasta = true; }
}
function pa11Bitir(o) {
  if (o.done) return;
  const k = o.pa; k.faz = 'bitti'; k.isinH = 0.3; k.fanus = 1; k.tepsi = 1; k.kalkY = 0; k.bayrak = 1;
  pa11Birak(o, true);
  OLAY.emit('pastaBitti', { o });
}
function pa11Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza girişte durur
  const k = o.pa; if (!k.aktif || P.ucus !== o) return;
  const e = k.entry; e.x = e.safeX = clamp(e.x, o.x + PA11_GIR0, o.x + PA11_GIR1);   // ekran dönerse Feza yeni düzendeki yerine kayar
  P.x = e.x; P.y = e.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function pa11Kamera(o) { const L = PA11_L < 0 ? 0 : PA11_L; omDkEkle(o.x + lerp(-400, -208, L), o.y + lerp(-440, -560, L), o.x + lerp(345, 230, L), o.y + 25); }
function pa11Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.pa;
  pa11Duzen(dt);
  if (DURUM !== 'oyun' && k.aktif) return;
  const gorunur = typeof cam !== 'undefined' && o.x > cam.x - 800 && o.x < cam.x + VW + 800;
  if (!gorunur && !k.aktif) return;   // uzakta: hiçbir iş yok
  k.t += dt;
  pa11EfektAdim(dt); pa11NineAdim(o, dt); pa11GrupAdim(o, dt);
  k.wob = Math.max(0, k.wob - dt * 1.4); k.flas = Math.max(0, k.flas - dt * 2);
  for (let i = 0; i < 3; i++) k.katParla[i] = Math.max(0, k.katParla[i] - dt * 0.7);
  k.isin += (k.isinH - k.isin) * (1 - Math.exp(-dt * 2)); k.isinA += dt * 0.22;
  k.fzSev = Math.max(0, k.fzSev - dt);
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - PA11_AKTIF && P.x < o.x + 260 && Math.abs(P.y - o.y) < 160) pa11Aktiflestir(o);
  if (!k.aktif) return;
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('pasta', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  if (k.faz === 'gel') { if (k.fT >= PA11_GEL) pa11OyunBasla(o); }
  else if (k.faz === 'oyun') pa11OyunAdim(o, dt);
  else if (k.faz === 'son') pa11SonAdim(o, dt);
  if (!k.aktif) return;   // son adımda bitti
  pa11SusAdim(o, dt);
  pa11PirilAdim(o, dt);
}

// ═══════════════════════════════ çizim ═══════════════════════════════
const PA11_NO = {}, PA11_BO = {}, PA11_FZ_OPT = {};   // vampirCiz / fezaCizPoz seçenekleri (karede yeniden kullanılır)
function pa11Ciz(o, tm) {   // Feza'nın arkası: mutfak ışığı, huzmeler, masa, tepsi, pasta + süsler, Vampir Nine, mama sandalyesinde Pıtır
  if (typeof cam === 'undefined' || o.x < cam.x - 700 || o.x > cam.x + VW + 700) return;
  const k = o.pa, X = o.x, Y = o.y, [bx, by] = pa11Taban(o), nab = 0.85 + 0.15 * Math.sin(tm * 1.7);
  // sıcak mutfak ışığı (pasta süslendikçe pembeleşir, parlar)
  pa11IsikE(g, '#ffd27a', X + 40, Y - 160, 400, 270, 0.2 + 0.1 * k.parla);
  pa11Isik(g, '#ffb3d1', bx, by - 105, 235, (0.16 + 0.26 * k.parla) * nab + k.flas * 0.18);
  pa11IsikE(g, '#ffd27a', X + 40, Y - 2, 260, 30, 0.32);
  if (k.isin > 0.01) { const M = g.getTransform(); g.translate(bx, by - 112); g.rotate(k.isinA); g.globalAlpha = k.isin * 0.5 * nab; pa11KoyS(g, pa11IsinSpr(), 0, 0, 0.9); g.setTransform(M); g.globalAlpha = 1; }
  pa11Koy(g, pa11MasaSpr(), X, Y);
  if (k.tepsi > 0.01) { const M = g.getTransform(); g.translate(X, Y + PA11_MASA); g.globalAlpha = Math.min(1, k.tepsi * 1.6); pa11KoyS(g, pa11TepsiSpr(), 0, 0, lerp(0.8, 1, k.tepsi)); g.setTransform(M); g.globalAlpha = 1; }
  // pasta (süs konunca jöle gibi yaylanır)
  const M = g.getTransform(), w = k.wob, sq = Math.sin(k.t * 19) * 0.035 * w;
  if (w > 0.001) { g.translate(bx, by); g.scale(1 + sq, 1 - sq); g.translate(-bx, -by); }
  if (k.kalkY > 0.5) pa11IsikE(g, '#cfe6ff', bx, by + 4, 130, 18, 0.5 * Math.min(1, k.kalkY / 10));
  if (o.done) pa11Koy(g, pa11PastaTamSpr(), bx, by);
  else {
    pa11Koy(g, pa11PastaSpr(), bx, by);
    for (const gi of PA11_CIZ) {
      const G = k.grup[gi]; if (!G.on) continue;
      const L = PA11_PAR[PA11_SUS[gi].ad], ara = PA11_ARA[gi];
      for (let j = 0; j < L.length; j++) pa11ParcaKoy(g, L[j], bx, by, pa11Pop((G.t - j * ara) / 0.3));
      if (gi === 6) pa11BayrakKoy(g, bx, by, pa11Pop(k.bayrak), Math.sin(tm * 3) * 0.05);
    }
  }
  for (let i = 0; i < 3; i++) if (k.katParla[i] > 0.01) { const K = PA11_KAT[i], a = k.katParla[i]; pa11IsikE(g, '#fff0f6', bx, by + (K.y0 + K.y1) / 2, K.w * 1.7, (K.y0 - K.y1) * 1.4, a * 0.85); pa11IsikE(g, '#ffd27a', bx, by + K.y1, K.w * 1.3, 26, a * 0.5); }
  if (k.flas > 0.01) pa11Isik(g, '#ffffff', bx, by - 95, 140, k.flas * 0.3);
  if (k.yakin > 0.02) pa11Isik(g, '#fff3c4', bx, by - 100, 160, k.yakin * 0.45 * (0.85 + 0.15 * Math.sin(tm * 8)));
  g.setTransform(M);
  // Vampir Nine (önlüklü; pastaya bakar)
  const N = k.nine, NO = PA11_NO;
  NO.yon = -1; NO.onluk = 1; NO.mutlu = N.mutlu; NO.pelerin = 0; NO.faz = N.faz;
  NO.poz = N.dansT > 0 ? 'dans' : N.alkT > 0 ? 'alkis' : N.sasT > 0 ? 'sasir' : N.elT > 0 ? 'el' : k.aktif && (k.faz === 'oyun' || k.faz === 'gel') ? 'karistir' : 'dur';
  NO.agiz = N.konT > 0 ? 0.35 + 0.4 * Math.abs(Math.sin(k.t * 13)) : 0; NO.kirp = ((k.t + 0.7) % 3.7) < 0.13 ? 1 : 0;
  if (typeof vampirCiz === 'function') { try { vampirCiz(g, 'nine', X + PA11_NX, Y, PA11_NS, tm, NO); } catch (e) {} }
  // mama sandalyesinde Pıtır + tepsisindeki minik çilek
  pa11Koy(g, pa11MamaSpr(), X + PA11_MX, Y);
  const B = k.bebek, BO = PA11_BO;
  BO.yon = -1; BO.poz = B.alkT > 0 ? 'alkis' : 'otur'; BO.mutlu = B.alkT > 0 || B.cilT >= 0.7 ? 1 : 0.75; BO.faz = k.t; BO.kirp = ((k.t + 2.1) % 4.3) < 0.13 ? 1 : 0;
  if (typeof vampirCiz === 'function') { try { vampirCiz(g, 'bebek', X + PA11_MX + 3, Y + PA11_KOL, 1.1, tm, BO); } catch (e) {} }
  pa11Koy(g, pa11MamaOnSpr(), X + PA11_MX, Y);
  if (B.cilT >= 0) {
    const u = clamp(B.cilT / 0.7, 0, 1), e = smooth(u), sx = bx + 92, sy = by - 14, ex = X + PA11_MX - 29, ey = Y - 91;
    pa11KoyS(g, pa11SusSpr('cilek'), lerp(sx, ex, e), lerp(sy, ey, e) - Math.sin(u * Math.PI) * 70, 0.9 + 0.1 * Math.sin(u * Math.PI));
  }
}
function pa11CizOn(o, tm) {   // Feza'nın önü: cam fanus, Feza, Pırıl, havadaki süsler, parçacıklar
  if (typeof cam === 'undefined' || o.x < cam.x - 700 || o.x > cam.x + VW + 700) return;
  const k = o.pa, [bx, by] = pa11Taban(o);
  if (k.fanus > 0.01) {
    const u = k.fanus, e = 1 - Math.pow(1 - u, 3);
    g.globalAlpha = Math.min(1, u * 2.5); pa11Koy(g, pa11FanusSpr(), bx, by - 170 * (1 - e)); g.globalAlpha = 1;
    if (o.done) for (let i = 0; i < 3; i++) { const v = (tm * 0.35 + i / 3) % 1, a = Math.sin(v * Math.PI); g.globalAlpha = a * 0.9; pa11KoyS(g, pa11IsiltiSpr(), bx + [-80, 62, -20][i], by + [-150, -110, -236][i], 0.5 + 0.3 * a); }
    g.globalAlpha = 1;
  }
  if (k.aktif && P.ucus === o) {
    const sev = k.fzSev > 0 || (k.faz === 'gel' && k.fT > 0.3 && k.fT < 0.9);
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, P.x, P.y, PA11_FS, sev ? 'sevinc' : 'ayakta_yan', tm, null, PA11_FZ_OPT); } catch (e) {}
    g.globalAlpha = 1;
    if (typeof pirilCizPoz === 'function') { const pr = k.pr; try { g.save(); g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, PA11_FS, pr.kirp > 0 ? 'goz_kirp' : 'ucus', tm); g.restore(); } catch (e) { g.restore(); } }
  }
  if (k.aktif || k.faz === 'oyun') pa11SusCiz(o, tm);
  pa11TozCiz(g);
}
function pa11SusCiz(o, tm) {   // havadaki süsler (ışık baloncuklarının içinde)
  const k = o.pa, sira = pa11Siradaki(o), ipucu = k.faz === 'oyun' && (k.idle > PA11_IPUCU || k.helpOn) && !k.tasinan, BA = pa11Balon();
  if (ipucu && sira && sira.durum === 'bekle') {   // pastaya doğru akan ışık tozu
    const h = pa11Hedef(o, sira), hx = h[0], hy = h[1], cxp = (sira.x + hx) / 2, cyp = Math.min(sira.y, hy) - 70;
    for (let i = 0; i < 8; i++) { const v = (i / 8 + tm * 0.4) % 1, q = 1 - v, x = q * q * sira.x + 2 * q * v * cxp + v * v * hx, y = q * q * sira.y + 2 * q * v * cyp + v * v * hy;
      pa11Isik(g, sira.d.renk, x, y, 14, 0.5 * Math.sin(v * Math.PI)); g.globalAlpha = 0.8 * Math.sin(v * Math.PI); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 1.6, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  }
  for (const m of k.sus) {
    if (m.durum === 'gizli' || m.durum === 'bitti' || (m.durum === 'cik' && m.t < 0)) continue;
    const vurgu = m === sira && ipucu ? 0.5 + 0.3 * Math.sin(tm * 4) : 0, tut = m.durum === 'tut', balon = m.durum !== 'uc', buyuk = m.i === 6;
    pa11Isik(g, m.d.renk, m.x, m.y, (56 + vurgu * 30 + (buyuk ? 14 : 0)) * m.s, 0.6 + vurgu * 0.4 + (tut ? 0.25 : 0));
    pa11Isik(g, '#ffffff', m.x, m.y, 26 * m.s, 0.35);
    const M = g.getTransform(); g.translate(m.x, m.y); g.rotate(m.rot); pa11KoyS(g, pa11IkonSpr(m.d.ad), 0, 0, m.s * 0.95); g.setTransform(M);
    if (balon) { const r = 33 * m.s * (1 + Math.sin(tm * 2.3 + m.i) * 0.03 + vurgu * 0.06); g.globalAlpha = 0.95; g.drawImage(BA, m.x - r * 1.125, m.y - r * 1.125, r * 2.25, r * 2.25); g.globalAlpha = 1; }
  }
}

// ═══════════════════════════════ girdi ═══════════════════════════════
// Parmak/fare süsü tutup sürükler; kısa dokunuş uçurur; pastaya / masaya / Nine'ye dokunmak sıradakini getirir (pencere yakalama evresi:
// motorun yürüme parmağına gitmez). İkinci parmak etkin parmağı değiştirmez.
function pa11Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function pa11Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function pa11SusBul(o, x, y) {
  const k = o.pa, rr = Math.max(62, 46 * DPR / Math.max(S, 0.001)); let en = null, ed = Infinity;
  for (const m of k.sus) { if (!(m.durum === 'bekle' || m.durum === 'geri' || (m.durum === 'cik' && m.t > 0.25))) continue; const d = Math.hypot(m.x - x, m.y - y); if (d < rr * Math.max(0.7, m.s) && d < ed) { ed = d; en = m; } }
  return en;
}
function pa11Tut(o, m, p) { m.durum = 'tut'; m.t = 0; m.hx = m.x - p.x; m.hy = m.y - p.y; PASTA11.tut = m; PASTA11.hx = m.x; PASTA11.hy = m.y; const h = pa11Hedef(o, m); PASTA11.tutUzak = Math.hypot(h[0] - m.x, h[1] - m.y); pa11Sfx('parilti', 0.3); }
function pa11GirdiBirak() {
  const id = PASTA11.ptr; PASTA11.ptr = -1;
  const m = PASTA11.tut; if (m && m.durum === 'tut') { m.durum = 'geri'; m.t = 0; m.x1 = m.x; m.y1 = m.y; } PASTA11.tut = null;
  if (id >= 0 && typeof cv !== 'undefined' && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} }
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
}
addEventListener('pointerdown', e => {
  const o = PASTA11.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === PASTA11.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  pa11Sahip(e); if (PASTA11.ptr >= 0) return;
  const k = o.pa, p = pa11Dunya(e);
  PASTA11.ptr = e.pointerId; PASTA11.px = p.x; PASTA11.py = p.y; PASTA11.yol = 0; PASTA11.tut = null;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  pa11Kullanici(o);
  if (k.faz !== 'oyun') return;
  const m = pa11SusBul(o, p.x, p.y);
  if (m) { pa11Tut(o, m, p); return; }
  const [bx, by] = pa11Taban(o);
  if (Math.abs(p.x - bx) < 145 && p.y > by - 215 && p.y < o.y + 12) { const s = pa11Siradaki(o); if (s) pa11SusUc(o, s, 'dokun'); k.wob = Math.max(k.wob, 0.4); return; }   // pastaya / masaya dokunuş
  if (Math.abs(p.x - (o.x + PA11_NX)) < 60 && p.y > o.y - 150 && p.y < o.y + 10) { k.nine.elT = 1.8; k.nine.sevT = 0.7; const s = pa11Siradaki(o); if (s) pa11SusUc(o, s, 'dokun'); return; }
  if (Math.abs(p.x - (o.x + PA11_MX)) < 50 && p.y > o.y - 140 && p.y < o.y + 10) { k.bebek.alkT = 1.2; pa11Toz(2, o.x + PA11_MX, o.y - 120, 0, -30, 1.6, 1, '#ff8fb8'); pa11IsikSac(o.x + PA11_MX, o.y - 110, 5, 50, ['#ffb3d1', '#ffe7a8', '#ffffff']); pa11Sfx('parilti', 0.35); return; }   // Pıtır'a dokunuş: alkışlar
  let en = null, ed = 240; for (const q of k.sus) if (q.durum === 'bekle') { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < ed) { ed = d; en = q; } }
  if (en && ed < 150 * Math.max(1, 0.6 * DPR / Math.max(S, 0.001))) { en.sal = 1; pa11SusUc(o, en, 'dokun'); return; }   // baloncuğun yanına (ıska) dokunuş: o süs yine pastaya uçar
  if (en) en.sal = 1;   // daha uzak boşluk: en yakın süs "buradayım" diye hoplar
}, true);
addEventListener('pointermove', e => {
  const o = PASTA11.aktif; if (!o || e.pointerId !== PASTA11.ptr) return; pa11Sahip(e);
  const p = pa11Dunya(e), dx = p.x - PASTA11.px, dy = p.y - PASTA11.py; PASTA11.px = p.x; PASTA11.py = p.y;
  const d = Math.hypot(dx, dy); if (d > 300) return;   // sıçrama (ekran döndü vb.)
  PASTA11.yol += d; o.pa.idle = 0;
  const m = PASTA11.tut;
  if (m && m.durum === 'tut') { PASTA11.hx = p.x + m.hx * 0.6; PASTA11.hy = p.y + m.hy * 0.6; }
  else if (!m && o.pa.faz === 'oyun') { const q = pa11SusBul(o, p.x, p.y); if (q) pa11Tut(o, q, p); }   // parmak bir süsün üstünden geçerse onu da tutar
}, true);
function pa11BirakE(e) {
  const o = PASTA11.aktif; if (!o || e.pointerId !== PASTA11.ptr) return; pa11Sahip(e);
  const m = PASTA11.tut;
  if (m && m.durum === 'tut') {
    const q = pa11Dunya(e), sonlu = Number.isFinite(q.x) && Number.isFinite(q.y);
    const x = sonlu ? q.x + m.hx * 0.6 : PASTA11.hx, y = sonlu ? q.y + m.hy * 0.6 : PASTA11.hy;
    if (sonlu) PASTA11.yol += Math.hypot(q.x - PASTA11.px, q.y - PASTA11.py);
    const h = pa11Hedef(o, m), d = Math.hypot(h[0] - x, h[1] - y), kisa = PASTA11.yol < 18;   // kıpırdamadan basılı tutup bırakmak da dokunuş sayılır
    if (kisa || pa11PastaUstunde(o, x, y, 90) || d < PASTA11.tutUzak * 0.7) pa11SusUc(o, m, kisa ? 'dokun' : 'birak');
  }
  pa11GirdiBirak();
}
addEventListener('pointerup', pa11BirakE, true);
addEventListener('pointercancel', e => { if (e.pointerId !== PASTA11.ptr) return; pa11Sahip(e); pa11GirdiBirak(); }, true);
if (typeof cv !== 'undefined') cv.addEventListener('lostpointercapture', e => { if (e.pointerId === PASTA11.ptr) pa11GirdiBirak(); });
addEventListener('blur', () => { if (PASTA11.ptr >= 0) pa11GirdiBirak(); });
addEventListener('pagehide', () => { if (PASTA11.ptr >= 0) pa11GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && PASTA11.ptr >= 0) pa11GirdiBirak(); });
addEventListener('keydown', e => {
  const o = PASTA11.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  pa11Sahip(e); pa11Kullanici(o);
  if (!e.repeat && o.pa.faz === 'oyun' && /^(Space|Enter|KeyE|ArrowRight|ArrowUp|KeyW|KeyD)$/.test(e.code)) { const s = pa11Siradaki(o); if (s) pa11SusUc(o, s, 'tus'); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = PASTA11.aktif; if (o && d !== 'mola' && d !== 'duraklat') pa11Birak(o, false); pa11GirdiBirak(); });
OLAY.on('konusma', e => {   // Nine konuşurken ağzı oynar; Pıtır'ın sesinde alkışlar
  const o = PASTA11.o; if (!o || !o.pa || !e) return; const a = e.anahtar || '';
  if (/^vn_/.test(a) || e.kim === 'nine') o.pa.nine.konT = Math.max(o.pa.nine.konT, +e.sure || 2);
  else if (/^vb_/.test(a)) o.pa.bebek.alkT = Math.max(o.pa.bebek.alkT, 1.2);
});

TUR.kaydet('pastaMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js bitiş bayrağını okur → miniKapi açılır
    o.pa = { aktif: false, faz: 'bekle', fT: 0, t: 0, n: 0, sT: 0,
      sus: PA11_SUS.map((d, i) => ({ d, i, durum: 'gizli', t: 0, x: o.x, y: o.y - 100, x0: o.x, y0: o.y - 100, x1: 0, y1: 0, s: 0.3, s1: 1, bs: i === 6 ? PA11_BS * 1.25 : PA11_BS, rot: 0, sure: 0.7, yay: 0, hx: 0, hy: 0, sal: 0 })),
      grup: PA11_SUS.map(() => ({ on: false, t: 0, n: 0 })), katN: [0, 0, 0], katBek: [-1, -1, -1], katParla: [0, 0, 0], buyukBek: -1,
      idle: 0, helpOn: false, helpT: 0, helpN: 0, tasinan: null, wob: 0, flas: 0, yakin: 0, parla: 0, isin: 0, isinH: 0, isinA: 0,
      kalkY: 0, tepsi: 0, fanus: 0, bayrak: 0, fzSev: 0,
      entry: { x: o.x - PA11_AKTIF, y: o.y, safeX: o.x - PA11_AKTIF, safeY: o.y, f: 1 }, pr: { x: o.x - 300, y: o.y - 130, f: 1, kirp: 0 },
      nine: { elT: 0, alkT: 0, sasT: 0, dansT: 0, konT: 0, bakT: 0, sevT: 0, mutlu: 0.6, faz: 0 }, bebek: { alkT: 0, cilT: -1 },
      basladi: false, bitti: false, kameraFn: null };
    o.pa.kameraFn = typeof omDkEkle === 'function' ? () => pa11Kamera(o) : null;
    o.adim = dt => pa11Adim(o, dt);
    PASTA11.o = o;
    try { pa11Hazirla(); } catch (e) {}
  },
  guncelle: pa11Guncelle, ciz: pa11Ciz, cizOn: pa11CizOn,
  testBitir(o) {
    const k = o.pa; if (!k || o.done) return;
    if (!k.basladi) { k.basladi = true; OLAY.emit('pastaBasla', { o }); }
    for (const m of k.sus) m.durum = 'bitti';
    for (const G of k.grup) { G.on = true; G.t = 99; G.n = 99; }
    k.n = 7; k.katN = [2, 2, 2]; k.parla = 1; k.bebek.cilT = 9;
    pa11Bitir(o);
  }
});
