/* yavru.js — Bölüm 9 (Pırıl'ın Ejderha Vadisi): pul çiçekleri, üşümüş ejderha yumurtaları → yavru çıkışı ve bölüm boyu takip,
   dekor dostlar; ortak çiziciler. Korkutucu hiçbir şey yok, kaybetme yok, yazı yok, böcek yok. Sözleşme: src/BOLUM9.md.
   pulCicek    : kapalı, solgun, uykulu tomurcuk (10). Feza yanından geçince ya da tomurcuğa dokununca açılır: içinden ejderha pulu
                 gibi yanardöner (lila-nane-altın) taç yapraklar çıkar, ışık halkası, çimenlerde renk dalgası (dibinde minik çiçekler
                 açar), ışık tozları yükselir. Her biri başka: renk geçişi (o.pal), yaprak sayısı/biçimi ve açılış (o.acilis: dönerek,
                 zıplayarak, hapşırarak, patlayarak, esneyerek...). o.acik = o.done = true, V9.pul++, OLAY 'pulCicek' {o, n, x, y},
                 AU.sfx('pulAcil', n).
   ejderYumurta: yaprak yuvada üşüyüp titreyen soluk benekli yumurta (6). Feza yanına gelince durur ve yumurtaya SARILIR (~2,5 sn;
                 P.poz = 'sarilYumurta', feza.js pozu varsa o çizer), Pırıl ılık ışık üfler (OLAY 'yumurtaSaril'), yumurta ısınıp
                 renklenir, sallanır, çatlar → yavru çıkar (o.renk: nane, şeftali, gök, limon, gül, lila), başında yumurta kabuğu şapka,
                 esner, hapşırır (parıltı), Feza'ya sarılır; sonra bölüm boyunca çıkış sırasıyla Feza'nın peşinden zıplayarak ve kısa
                 uçuşlarla gelir (geride kalınca ışıltılı uçuşla yetişir). Büyükanne yolculuğunda (binisBasla..binisBitti) çizilmez
                 (buyukanne.js sırtta çizer: yavruListesi()); inişte sırttan atlayıp yeniden görünür; finalde ('ejderFinal')
                 ejderFinalNabiz() vuruşunda dans eder (çıkmamış yumurtaların yavruları da finalde uçarak gelir; sayılmaz).
                 o.cikti = o.done = true, V9.yavru++, OLAY 'yavruCikti' {o, n, renk}.
   ejderDost   : dekor (o.tur 'yosun' | 'kus'; sayılmaz). Yosun tavşancığı: yaprak kulaklı yeşil pofuduk top, kayasının yanında
                 oturur, Feza yaklaşınca kulaklarını dikip hoplar, birkaç adım peşinden gelir, geri döner. Pofuduk kuşçuk: taşın
                 üstünde tüneyen yuvarlak pastel kuş; Feza geçince havalanıp çevresinde bir tur süzülür, yerine konar.
   Ortak çiziciler (imzalar her birinin başında): yavruCiz, yumurtaCiz, pulCicekCiz (c, x, y, s, t, o); yardımcı yavruListesi().
   Çizimler önbellek tuvallerinden (yv9Tuval; çözünürlük bağlamın ölçeğine göre kovalanır, sahne/yolculuk büyük çizse de keskin);
   karede gradient/filtre üretilmez, parçacıklar sabit sayılı ve analitiktir, ekran dışında çizim yapılmaz. */
'use strict';
const YV9 = { spr: new Map(), pulSira: 0, yumSira: 0, takipN: 0, yavrular: [], binis: false, binisBitti: false, final: null, finalT: 0, dostlar: [], pulN: 0, yavruN: 0 };
const YV9_PI2 = Math.PI * 2;
function yv9V() { return typeof V9 !== 'undefined' && V9 ? V9 : null; }
function yv9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function yv9Ekranda(x, pay) { return typeof cam === 'undefined' || (x > cam.x - pay && x < cam.x + VW + pay); }
function yv9Isik(c, col, x, y, r, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ga; }
function yv9IsikE(c, col, x, y, rx, ry, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ga; }

// ── Önbellek tuvalleri. K = dünya birimi başına piksel; bağlamın o anki ölçeği × s'ye göre kovadan seçilir ──
const YV9_KOVA = [2, 3, 4, 6, 8, 12, 16];
let yv9MatrisYok = false;
function yv9K(c, s) {
  let m = typeof S !== 'undefined' && S > 0 ? S : 2.5;
  if (!yv9MatrisYok && c && c.getTransform) { try { const t = c.getTransform(); m = Math.sqrt(t.a * t.a + t.b * t.b); } catch (e) { yv9MatrisYok = true; } }
  const n = m * Math.abs(s || 1);
  for (let i = 0; i < YV9_KOVA.length; i++) if (YV9_KOVA[i] >= n * .8) return YV9_KOVA[i];
  return 16;
}
function yv9Tuval(ad, K, x0, y0, w, h, fn) {
  const key = ad + '@' + K; let c = YV9.spr.get(key); if (c) return c;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; YV9.spr.set(key, c); return c;
}
function yv9Koy(c, spr, x, y) { c.drawImage(spr, x + spr.x0, y + spr.y0, spr.w, spr.h); }
function yv9GL(q, x0, y0, x1, y1, a, b, cc) { const gr = q.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(cc ? .5 : 1, b); if (cc) gr.addColorStop(1, cc); return gr; }
// dört uçlu pırıltı + hale; yumuşak puf; kalp
function yv9Isilti() {
  return yv9Tuval('isilti', 4, -12, -12, 24, 24, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 12); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.3, 'rgba(255,248,226,.42)'); gr.addColorStop(1, 'rgba(255,240,215,0)');
    q.fillStyle = gr; q.fillRect(-12, -12, 24, 24);
    q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(0, -10.5); q.quadraticCurveTo(1, -1, 10.5, 0); q.quadraticCurveTo(1, 1, 0, 10.5); q.quadraticCurveTo(-1, 1, -10.5, 0); q.quadraticCurveTo(-1, -1, 0, -10.5); q.fill();
  });
}
function yv9Puf() {
  return yv9Tuval('puf', 2, -16, -16, 32, 32, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 16); gr.addColorStop(0, 'rgba(255,252,246,.9)'); gr.addColorStop(.45, 'rgba(255,246,236,.45)'); gr.addColorStop(1, 'rgba(255,240,230,0)');
    q.fillStyle = gr; q.fillRect(-16, -16, 32, 32);
  });
}
function yv9KalpYol(q, x, y, r) {
  q.beginPath(); q.moveTo(x, y + r * .95);
  q.bezierCurveTo(x - r * 1.35, y + r * .05, x - r * .95, y - r * 1.1, x, y - r * .42);
  q.bezierCurveTo(x + r * .95, y - r * 1.1, x + r * 1.35, y + r * .05, x, y + r * .95); q.closePath();
}
function yv9KalpSpr(renk) {
  return yv9Tuval('kalp' + renk, 4, -8, -8, 16, 16, q => {
    yv9KalpYol(q, 0, 0, 6); q.fillStyle = renk; q.fill(); q.strokeStyle = 'rgba(190,60,120,.55)'; q.lineWidth = .9; q.stroke();
    q.fillStyle = 'rgba(255,255,255,.75)'; q.beginPath(); q.ellipse(-2.6, -2.4, 1.6, 1, -.6, 0, YV9_PI2); q.fill();
  });
}
// birleşik yuvarlak dilimler (piril.js drBlobs gibi): önce kalın çizgi, sonra dolgu → yalnız dış kenar kalır
function yv9Blob(q, arr, fill, line, lw) {
  q.strokeStyle = line; q.lineWidth = lw;
  q.beginPath(); for (let i = 0; i < arr.length; i += 3) { q.moveTo(arr[i] + arr[i + 2], arr[i + 1]); q.arc(arr[i], arr[i + 1], arr[i + 2], 0, YV9_PI2); } q.stroke();
  q.fillStyle = fill;
  q.beginPath(); for (let i = 0; i < arr.length; i += 3) { q.moveTo(arr[i] + arr[i + 2], arr[i + 1]); q.arc(arr[i], arr[i + 1], arr[i + 2], 0, YV9_PI2); } q.fill();
}
// Zemin (kabak.js kb8Zemin ile aynı mantık): x sütununda yRef'in biraz üstünden aşağı ilk basılabilir yüzey
function yv9Zemin(x, yRef, ust) {
  if (typeof cell !== 'function' || typeof ROWS === 'undefined') return null;
  const tx = Math.floor(x / T), r0 = Math.max(0, Math.floor((yRef - (ust == null ? 2.4 * T : ust)) / T)), r1 = Math.min(ROWS - 1, Math.floor((yRef + 7 * T) / T));
  for (let r = r0; r <= r1; r++) {
    const k = cell(tx, r);
    if (k === 1 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;
    if (k === 2 && r * T >= yRef - 4 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;
  }
  return null;
}

// ═══════════════════════════════ YAVRU EJDERHA ÇİZİCİ ═══════════════════════════════
// yavruCiz(c, x, y, s, t, o) — (x, y) iki ayağın arasındaki taban ortası; s = 1'de ≈ 36 birim boy (kabuk şapkayla ≈ 44), 30 en.
// o = { renk 'nane'|'seftali'|'gok'|'limon'|'gul'|'lila'|'fistik', yon -1..1 (+ sağa bakar; ara değerler dönüş ezilmesi),
//       mutlu 0..1 (gülümseme, yanak; > .72 gözler ^^), kanat 0..1 (kanat çırpma gücü), ucus 0|1 (havada: ayaklar sarkar, gövde öne
//       eğilir, kanatlar hızlı), ziplama -1..1 (+ havada uzama, − yere basma ezilmesi), kabuk 0..1 (yumurta kabuğu şapka; ara değer
//       saydamlık), agiz 0..1 (ağız açıklığı: cik cik / esneme), dans 0..1 (iki yana sallanma, kollar havada), uyku 0..1 (gözler
//       kapalı), kirp 0..1 (verilmezse kendisi kırpar), saril 0..1 (kollar öne uzanır: sarılma), hapsir 0..1 (gözler sıkılı, burun
//       kırışır, baş geri), bak -1..1 / bakY -1..1 (göz bebekleri), egim (rad, taban çevresinde), bas (rad, başın eğilmesi),
//       kabukEgim (rad), alfa 0..1, isik 0..1 (karnında ılık ışık),
//       kanatAc 0..1 (kanat açıklığı; 0 sırtta katlı, verilmezse .6), utangac 0..1 (baş eğik, gözler yana-aşağı, pati ağzın önünde, kızarır),
//       sasir 0..1 (iri göz, "o" ağız), bakX (= bak), kuyruk -1..1 (kuyruğa ek açı), sq -1..1 (+ ezik, − uzun; ziplama'nın tersi),
//       otur 0..1 (oturuş: ayaklar öne uzanır; taban = oturma noktası) }
// Pırıl'ın ailesinden: tombul, kocaman parlak gözlü, pembe yanaklı, kalın yumuşak konturlu; yumuşak ibik, yüzgeç kulak, çizgili
// karın, minik iki diş. Sağa bakan yerel uzayda çizilir; yon < 0 aynalanır.
const YV9_RENK = {
  nane:    { g: '#8ee3bf', ac: '#cbf8e4', k: '#5ec29d', cz: '#2f7a64', kr: '#fff2b3', krk: '#dcc06a', ib: '#b99cff', ibk: '#7f62d6', zr: '#e2fcf1', yum: '#dff7ec', ben: '#6fd8a8' },
  seftali: { g: '#ffbf95', ac: '#ffe1cb', k: '#f0976a', cz: '#a4553a', kr: '#fff3cf', krk: '#e8c584', ib: '#ff8fb3', ibk: '#d6618c', zr: '#fff0e2', yum: '#ffeedd', ben: '#ffa77a' },
  gok:     { g: '#90d7f4', ac: '#cff0fd', k: '#5fb1dc', cz: '#2f6c99', kr: '#fff4c9', krk: '#e3c880', ib: '#ffd36e', ibk: '#d29e34', zr: '#e6f8ff', yum: '#e2f5fd', ben: '#7fc8f0' },
  limon:   { g: '#fbe27e', ac: '#fff4c0', k: '#e6bf4a', cz: '#94731a', kr: '#fffbe3', krk: '#e6d596', ib: '#7fdca6', ibk: '#45a874', zr: '#fffbe2', yum: '#fff8d6', ben: '#f2cf55' },
  gul:     { g: '#ffabc8', ac: '#ffd8e7', k: '#ee80a7', cz: '#a4426a', kr: '#fff1dc', krk: '#ecc79e', ib: '#b99cff', ibk: '#7f62d6', zr: '#ffecf3', yum: '#ffe9f1', ben: '#ff8fb6' },
  lila:    { g: '#c3a7ff', ac: '#e4d7ff', k: '#9a7ae6', cz: '#57399c', kr: '#d9f27e', krk: '#a3c63a', ib: '#3fbf8a', ibk: '#2a8a63', zr: '#f0e9ff', yum: '#eee6ff', ben: '#b89cff' },
  fistik:  { g: '#c8ef8c', ac: '#e8fbc6', k: '#9ccf5a', cz: '#4c7c22', kr: '#fff6c6', krk: '#e2cf86', ib: '#ffb48a', ibk: '#de8656', zr: '#f3ffe2', yum: '#f0fde0', ben: '#a8de6a' },
};
const YV9_RENKLER = ['nane', 'seftali', 'gok', 'limon', 'gul', 'lila'];
const YV9_YANAK = '#ff96bd';
function yv9Renk(r) { return YV9_RENK[r] || YV9_RENK.nane; }
const YV9_LW = 1.75;   // kalın yumuşak kontur
// gövde (arka sırt pulları + yuvarlak gövde + çizgili karın + parlama)
function yv9GovdeSpr(ad, R, K) {
  return yv9Tuval('yvG' + ad, K, -15, -25, 31, 26, q => {
    yv9Blob(q, [-10.2, -15.6, 2.4, -11.6, -9.6, 2], R.ib, R.cz, YV9_LW * 1.9);
    q.beginPath(); q.ellipse(0, -11.5, 11.3, 11, 0, 0, YV9_PI2);
    q.fillStyle = yv9GL(q, 7, -21, -7, 0, R.ac, R.g, R.k); q.fill();
    q.strokeStyle = R.cz; q.lineWidth = YV9_LW; q.stroke();
    q.save(); q.translate(3.4, -10.2); q.rotate(-.12);
    q.beginPath(); q.ellipse(0, 0, 6.9, 8.3, 0, 0, YV9_PI2); q.fillStyle = yv9GL(q, -6, 0, 6, 0, R.krk, R.kr); q.fill();
    q.save(); q.clip(); q.strokeStyle = R.krk; q.globalAlpha = .7; q.lineWidth = .55; q.beginPath();
    for (let yy = -6.4; yy < 8; yy += 2.15) { q.moveTo(-7, yy); q.quadraticCurveTo(0, yy + 1, 7, yy); } q.stroke(); q.restore();
    q.strokeStyle = R.krk; q.lineWidth = .8; q.beginPath(); q.ellipse(0, 0, 6.9, 8.3, 0, 0, YV9_PI2); q.stroke();
    q.restore();
    q.fillStyle = 'rgba(255,255,255,.42)'; q.beginPath(); q.ellipse(-3.2, -18.6, 3.4, 1.5, -.35, 0, YV9_PI2); q.fill();
  });
}
// baş (ibik, yüzgeç kulak, yuvarlak kafa + burun, yanaklar, burun delikleri, parlama) — gözler ve ağız karede
function yv9BasSpr(ad, R, K) {
  return yv9Tuval('yvB' + ad, K, -19, -47, 40, 33, q => {
    // yüzgeç kulak (arkada, yukarı-geri)
    q.save(); q.translate(-7.4, -31.5); q.rotate(-.55);
    q.beginPath(); q.moveTo(1.6, 2); q.quadraticCurveTo(2.2, -5, .6, -11); q.quadraticCurveTo(-1.8, -9.8, -3.2, -7.6);
    q.quadraticCurveTo(-5.2, -6.8, -5.6, -4.2); q.quadraticCurveTo(-7, -3, -6.6, -.4); q.quadraticCurveTo(-3, 1.2, 1.6, 2); q.closePath();
    q.fillStyle = yv9GL(q, 0, 0, -3, -10, R.ibk, R.ib); q.fill(); q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .85; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,.45)'; q.lineWidth = .45; q.beginPath(); q.moveTo(.6, .2); q.quadraticCurveTo(1, -5, .3, -9.6);
    q.moveTo(0, .4); q.quadraticCurveTo(-1.6, -3.8, -2.8, -6.6); q.moveTo(-.6, .6); q.quadraticCurveTo(-2.8, -2.4, -4.8, -3.6); q.stroke();
    q.restore();
    // yumuşak ibik (üç yuvarlak tarak + minik ön tarak)
    yv9Blob(q, [4.4, -39.6, 2.5, -.4, -40.4, 3.5, -5.6, -38.6, 3.2, -9.6, -35, 2.7], R.ib, R.cz, YV9_LW * 1.9);
    q.fillStyle = 'rgba(255,255,255,.4)'; q.beginPath(); q.ellipse(-1.2, -42, 1.4, .8, -.3, 0, YV9_PI2); q.ellipse(-6.4, -40.2, 1.2, .7, -.5, 0, YV9_PI2); q.fill();
    // kafa + burun (birleşik)
    q.strokeStyle = R.cz; q.lineWidth = YV9_LW * 2; q.beginPath(); q.ellipse(3, -27.5, 13.4, 12, 0, 0, YV9_PI2); q.moveTo(18.4, -23.6); q.ellipse(12.4, -23.6, 6.2, 5.1, -.1, 0, YV9_PI2); q.stroke();
    q.fillStyle = yv9GL(q, 8, -40, -4, -16, R.ac, R.g, R.k);
    q.beginPath(); q.ellipse(3, -27.5, 13.4, 12, 0, 0, YV9_PI2); q.moveTo(18.4, -23.6); q.ellipse(12.4, -23.6, 6.2, 5.1, -.1, 0, YV9_PI2); q.fill();
    // burun açığı, delikler
    q.fillStyle = R.ac; q.globalAlpha = .75; q.beginPath(); q.ellipse(13, -23.2, 4.6, 3.6, -.1, 0, YV9_PI2); q.fill(); q.globalAlpha = 1;
    q.fillStyle = R.cz; q.beginPath(); q.ellipse(16.1, -25.4, .62, .5, 0, 0, YV9_PI2); q.ellipse(13.3, -26, .55, .45, 0, 0, YV9_PI2); q.fill();
    // yanaklar
    q.fillStyle = YV9_YANAK; q.globalAlpha = .62; q.beginPath(); q.ellipse(10.6, -20.8, 2.9, 1.7, -.1, 0, YV9_PI2); q.fill();
    q.globalAlpha = .45; q.beginPath(); q.ellipse(-4.6, -22, 2.2, 1.4, 0, 0, YV9_PI2); q.fill(); q.globalAlpha = 1;
    // parlama
    q.fillStyle = 'rgba(255,255,255,.5)'; q.beginPath(); q.ellipse(-2.2, -35.2, 4.2, 1.8, -.3, 0, YV9_PI2); q.fill();
    q.fillStyle = 'rgba(255,255,255,.35)'; q.beginPath(); q.ellipse(14.8, -27.4, 1.6, .8, -.2, 0, YV9_PI2); q.fill();
  });
}
// kocaman parlak göz: ince beyaz kenar, koyu renkli iris (altta ibik renginde ışıma), siyah bebek, iki parıltı
function yv9GozSpr(ad, R, K) {
  return yv9Tuval('yvZ' + ad, K, -5, -6, 10, 12, q => {
    const rx = 3.9, ry = 4.8;
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(0, 0, rx, ry, 0, 0, YV9_PI2); q.fill();
    q.save(); q.beginPath(); q.ellipse(0, 0, rx, ry, 0, 0, YV9_PI2); q.clip();
    q.beginPath(); q.ellipse(.35, .35, rx * .86, ry * .88, 0, 0, YV9_PI2); q.fillStyle = yv9GL(q, 0, -ry, 0, ry, '#1d1230', '#2d2048', mixc(R.ibk, '#2a1d44', .25)); q.fill();
    q.fillStyle = '#0c0814'; q.beginPath(); q.ellipse(.55, .5, rx * .45, ry * .5, 0, 0, YV9_PI2); q.fill();
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(-1, -1.55, 1.25, 1.45, -.2, 0, YV9_PI2); q.fill();
    q.beginPath(); q.arc(1.55, 2.05, .62, 0, YV9_PI2); q.fill();
    q.globalAlpha = .55; q.beginPath(); q.arc(-1.7, 1.3, .38, 0, YV9_PI2); q.fill(); q.globalAlpha = 1;
    q.restore();
    q.strokeStyle = '#21162f'; q.lineWidth = .95; q.beginPath(); q.ellipse(0, 0, rx, ry, 0, Math.PI * 1.08, Math.PI * 1.94); q.stroke();
    q.lineWidth = .7; q.beginPath(); q.moveTo(rx * .86, -ry * .38); q.quadraticCurveTo(rx * 1.18, -ry * .52, rx * 1.26, -ry * .78); q.stroke();
  });
}
// kanat (kök (0, 0); yukarı-geri açılan yuvarlak, üç kıvrımlı yumuşak zar); uzak kanat gölgeli
function yv9KanatSpr(ad, R, K, uzak) {
  return yv9Tuval('yvK' + ad + (uzak ? 'u' : 'y'), K, -14, -18, 18, 21, q => {
    q.beginPath(); q.moveTo(1.2, .8); q.quadraticCurveTo(1.6, -8, -1.4, -14.4); q.quadraticCurveTo(-6.4, -14.8, -9.6, -10.6);
    q.quadraticCurveTo(-11.2, -8.4, -10, -6.6); q.quadraticCurveTo(-11.4, -4, -8.6, -2.6); q.quadraticCurveTo(-8.8, .2, -5.6, .6); q.quadraticCurveTo(-2.4, 2, 1.2, .8); q.closePath();
    q.fillStyle = uzak ? mixc(R.zr, R.k, .45) : yv9GL(q, 0, -14, -8, 0, '#ffffff', R.zr, R.ac); q.fill();
    q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .9; q.stroke();
    q.strokeStyle = uzak ? R.k : R.g; q.lineWidth = 1.5; q.beginPath(); q.moveTo(.4, -.2); q.quadraticCurveTo(.6, -8, -1.4, -13.6); q.stroke();
    q.strokeStyle = uzak ? mixc(R.k, R.cz, .3) : R.k; q.globalAlpha = .55; q.lineWidth = .6; q.beginPath();
    q.moveTo(-.6, -12.6); q.quadraticCurveTo(-5, -9.6, -9.4, -7); q.moveTo(-.2, -8); q.quadraticCurveTo(-4.4, -5, -8, -3); q.stroke(); q.globalAlpha = 1;
  });
}
// kuyruk (kök (0, 0); geriye uzanıp yukarı kıvrılan, incelen, ucunda ibik renginde kürek)
function yv9KuyrukSpr(ad, R, K) {
  return yv9Tuval('yvQ' + ad, K, -24, -18, 28, 23, q => {
    const N = 22, arr = [];
    for (let i = 0; i <= N; i++) { const u = i / N, x = -u * 15 - u * u * 2.5, y = -u * u * 9 + Math.sin(u * Math.PI) * 1.6, r = 4.3 - u * 2.6; arr.push(x, y, r); }
    // kürek uç
    q.save(); q.translate(-17.6, -10.2); q.rotate(-.9);
    q.beginPath(); q.moveTo(0, 2); q.quadraticCurveTo(-4.8, -.6, -2.6, -5.4); q.quadraticCurveTo(0, -3.8, 0, -7.2); q.quadraticCurveTo(0, -3.8, 2.6, -5.4); q.quadraticCurveTo(4.8, -.6, 0, 2); q.closePath();
    q.fillStyle = R.ib; q.fill(); q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .9; q.stroke();
    q.fillStyle = 'rgba(255,255,255,.4)'; q.beginPath(); q.ellipse(-1.4, -3.4, 1, .6, -.6, 0, YV9_PI2); q.fill();
    q.restore();
    yv9Blob(q, arr, R.g, R.cz, YV9_LW * 1.9);
    q.fillStyle = R.ac; q.globalAlpha = .5; q.beginPath(); for (let i = 2; i < N - 3; i += 2) { const x = arr[i * 3], y = arr[i * 3 + 1] - arr[i * 3 + 2] * .45; q.moveTo(x + 1.2, y); q.arc(x, y, Math.max(.4, arr[i * 3 + 2] * .32), 0, YV9_PI2); } q.fill(); q.globalAlpha = 1;
    // sırttaki minik pullar
    q.fillStyle = R.ib; q.strokeStyle = R.cz; q.lineWidth = .7;
    for (const u of [.35, .62]) { const x = -u * 15 - u * u * 2.5, y = -u * u * 9 + Math.sin(u * Math.PI) * 1.6 - (4.2 - u * 2.5) + .3; q.beginPath(); q.arc(x, y, 1.3, Math.PI, 0); q.closePath(); q.fill(); q.stroke(); }
  });
}
// yumurta kabuğu şapka (kökü kırık kenarın ortası; üst yarım kabuk, zikzak kenar)
function yv9KabukSpr(ad, R, K) {
  return yv9Tuval('yvS' + ad, K, -15, -36, 30, 24, q => {
    q.save(); q.beginPath(); yv9ZigYol(q, -17, 3, 14); q.lineTo(16, -40); q.lineTo(-16, -40); q.closePath(); q.clip();
    yv9YumurtaDolgu(q, R, 1); q.restore();
    q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .9;
    q.beginPath(); yv9YumurtaYol(q); q.save(); q.beginPath(); yv9ZigYol(q, -17, 3, 14); q.lineTo(16, -40); q.lineTo(-16, -40); q.closePath(); q.clip();
    q.beginPath(); yv9YumurtaYol(q); q.stroke(); q.restore();
    q.beginPath(); yv9ZigYol(q, -17, 3, 14); q.stroke();
  });
}
const YV9_VO = { renk: 'nane', yon: 1, mutlu: 0, kanat: 0, ucus: 0, ziplama: 0, kabuk: 0, agiz: 0, dans: 0, uyku: 0, kirp: null, saril: 0, hapsir: 0, bak: 0, bakY: 0, egim: 0, bas: 0, kabukEgim: 0, alfa: 1, isik: 0,
  kanatAc: .6, utangac: 0, sasir: 0, bakX: 0, kuyruk: 0, sq: 0, otur: 0 };
function yv9Op(o, k) { const v = o ? o[k] : undefined; return v == null || v !== v ? YV9_VO[k] : v; }
function yavruCiz(c, x, y, s, t, o) {
  if (!c || !(s > 0) || !Number.isFinite(x) || !Number.isFinite(y)) return;
  t = Number.isFinite(t) ? t : 0;
  const ad = o && YV9_RENK[o.renk] ? o.renk : 'nane', R = YV9_RENK[ad], K = yv9K(c, s);
  const yon = yv9Op(o, 'yon'), mutlu = clamp(yv9Op(o, 'mutlu'), 0, 1), kanat = clamp(yv9Op(o, 'kanat'), 0, 1), ucus = yv9Op(o, 'ucus') ? 1 : 0;
  const zip = clamp(yv9Op(o, 'ziplama') - yv9Op(o, 'sq'), -1, 1), kabuk = clamp(yv9Op(o, 'kabuk'), 0, 1), agiz = clamp(yv9Op(o, 'agiz'), 0, 1), dans = clamp(yv9Op(o, 'dans'), 0, 1);
  const uyku = clamp(yv9Op(o, 'uyku'), 0, 1), saril = clamp(yv9Op(o, 'saril'), 0, 1), hap = clamp(yv9Op(o, 'hapsir'), 0, 1), alfa = clamp(yv9Op(o, 'alfa'), 0, 1);
  if (alfa <= .01) return;
  const utan = clamp(yv9Op(o, 'utangac'), 0, 1), sas = clamp(yv9Op(o, 'sasir'), 0, 1), kac = clamp(yv9Op(o, 'kanatAc'), 0, 1);
  const ga = c.globalAlpha; if (alfa < 1) c.globalAlpha = ga * alfa;
  // kırpma: verilmezse kendisi (yaklaşık 3,4 sn'de bir, kısa)
  let kirp = o && o.kirp != null ? clamp(o.kirp, 0, 1) : 0;
  if (!(o && o.kirp != null)) { const u = (t * .29 + (x * .0007)) % 1; if (u > .955) kirp = Math.sin((u - .955) / .045 * Math.PI); }
  const ys = yon < 0 ? -1 : 1, ya = Math.abs(yon), xsq = .62 + .38 * clamp(ya * 1.4, 0, 1);
  const sx = (1 - zip * .1 + Math.max(0, -zip) * .12) * xsq, sy = 1 + zip * .12 - Math.max(0, -zip) * .1;
  const dansA = dans * Math.sin(t * 6.3) * .16, egim = yv9Op(o, 'egim') + dansA + (ucus ? .12 : 0);
  c.save(); c.translate(x, y); if (egim) c.rotate(egim); c.scale(s * ys * sx, s * sy);
  // kanat fazı: çırpma gücüne ve uçuşa göre
  const kf = Math.sin(t * (ucus ? 17 : 11)) * (ucus ? 1 : kanat), kAc = -.15 - kanat * .25 - (ucus ? .2 : 0) + kf * (.55 * Math.max(kanat, ucus * .8)) + (1 - kac) * .5 * (1 - Math.max(kanat, ucus));
  const kS = lerp(.5, 1.14, Math.max(kac, kanat * .9, ucus * .9)), kSu = kS * .9;
  // uzak kanat, kuyruk
  c.save(); c.translate(-4.6, -16.6); c.rotate(kAc - .95); c.scale(kSu, kSu); yv9Koy(c, yv9KanatSpr(ad, R, K, true), 0, 0); c.restore();
  const kq = Math.sin(t * (2.6 + mutlu * 3.4 + dans * 3)) * (.1 + mutlu * .12 + dans * .1) * (1 - utan * .6) + (ucus ? .32 : 0) + clamp(yv9Op(o, 'kuyruk'), -1, 1) * .5;
  c.save(); c.translate(-8.4, -6.6); c.rotate(kq); yv9Koy(c, yv9KuyrukSpr(ad, R, K), 0, 0); c.restore();
  // uzak ayak + uzak kol
  const ot = clamp(yv9Op(o, 'otur'), 0, 1), ay = ucus ? 2.4 : 0, ayA = ucus ? .35 : -.45 * ot;
  c.lineWidth = YV9_LW; c.strokeStyle = R.cz;
  c.fillStyle = R.k; c.beginPath(); c.ellipse(lerp(-4.2, 3, ot), -2.9 + ay - ot * .6, 3.9, 3.3, -ayA, 0, YV9_PI2); c.fill(); c.stroke();
  const kolF = lerp(lerp(lerp(.5 + Math.sin(t * 2) * .08 + kanat * .35, 2.45, utan), 1.5, saril), 2.55 + Math.sin(t * 12.6 + 1) * .45, dans * (1 - saril));
  yv9Kol(c, -6.4, -14.2, kolF - .15, R.k, R.cz, 6);
  // gövde
  yv9Koy(c, yv9GovdeSpr(ad, R, K), 0, 0);
  // karında ılık ışık
  const isik = clamp(yv9Op(o, 'isik'), 0, 1);
  if (isik > .02) { c.globalCompositeOperation = 'lighter'; yv9IsikE(c, '#ffe9a8', 3.4, -10, 9, 10, isik * .55); c.globalCompositeOperation = 'source-over'; }
  // yakın ayak
  const nfx = lerp(4.8, 10.6, ot), nfy = -3 + ay * 1.2 - ot * .4;
  c.fillStyle = R.g; c.beginPath(); c.ellipse(nfx, nfy, 4.4, 3.5, -ayA * 1.3, 0, YV9_PI2); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(nfx - 1.2, nfy - 1.6, 2, 1, -.2, 0, YV9_PI2); c.fill();
  // yakın kanat (gövdenin üstünde, omzun arkasından)
  c.save(); c.translate(-6.6, -15.4); c.rotate(kAc - .62); c.scale(kS, kS); yv9Koy(c, yv9KanatSpr(ad, R, K, false), 0, 0); c.restore();
  // baş (boyun ekleminde eğilir; hapşırıkta geri, dansta sallanır)
  const bas = yv9Op(o, 'bas') + utan * .16 - sas * .06 - hap * .22 + dans * Math.sin(t * 6.3 + 1.2) * .12 + (ucus ? -.08 : 0);
  c.save(); c.translate(2, -19); c.rotate(bas); c.translate(-2, 19);
  yv9Koy(c, yv9BasSpr(ad, R, K), 0, 0);
  yv9Yuz(c, R, ad, K, t, mutlu * (1 - sas), kirp * (1 - sas), uyku, hap, Math.max(agiz, sas * .55), lerp(yv9Op(o, 'bak') || yv9Op(o, 'bakX'), -.8, utan) * ys, lerp(yv9Op(o, 'bakY'), .7, utan), 1 + sas * .16, utan);
  if (kabuk > .01) {
    const ke = yv9Op(o, 'kabukEgim');
    c.save(); if (kabuk < 1) c.globalAlpha *= kabuk; c.translate(1.6, -37.6); c.rotate(-.28 + ke); c.scale(.64, .64); c.translate(0, 17); yv9Koy(c, yv9KabukSpr(ad, R, K), 0, 0); c.restore();
  }
  c.restore();
  // yakın kol (en önde)
  yv9Kol(c, 7.2, -14.4, kolF, R.g, R.cz, 6.6);
  c.restore();
  if (alfa < 1) c.globalAlpha = ga;
}
// tombul kısa kol: kök (x, y), aci (0 = aşağı, π/2 = öne yatay, π = yukarı), uzunluk L
function yv9Kol(c, x, y, aci, renk, cz, L) {
  const x1 = x + Math.sin(aci) * L, y1 = y + Math.cos(aci) * L;
  c.lineCap = 'round'; c.strokeStyle = cz; c.lineWidth = 5.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x1, y1); c.stroke();
  c.strokeStyle = renk; c.lineWidth = 3.9; c.stroke();
}
// yüz: gözler (açık / ^^ / uyku / hapşırık sıkışı), ağız (gülümseme / açık / esneme), mutlulukta yanak
function yv9Yuz(c, R, ad, K, t, mutlu, kirp, uyku, hap, agiz, bak, bakY, gb, utan) {
  const happy = mutlu > .72 && agiz < .6, kapali = uyku > .5, lid = Math.max(kirp, uyku > .5 ? 1 : 0);
  const gz = yv9GozSpr(ad, R, K), bx = clamp(bak, -1, 1) * .7, by = clamp(bakY, -1, 1) * .5;
  for (let i = 0; i < 2; i++) {
    const ex = i ? -.6 : 8.4, ey = i ? -28.6 : -28.2, ws = i ? .84 : 1, hs = i ? .94 : 1;
    if (hap > .3) {   // hapşırık: sıkıca kapalı > <
      c.strokeStyle = '#21162f'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(ex - 2.6 * ws, ey - 1.8); c.lineTo(ex + 1.6 * ws, ey); c.lineTo(ex - 2.6 * ws, ey + 1.8); c.stroke();
    } else if (happy) {
      c.strokeStyle = '#21162f'; c.lineWidth = 1.25; c.beginPath(); c.moveTo(ex - 3.2 * ws, ey + 1.2); c.quadraticCurveTo(ex, ey - 3.6, ex + 3.2 * ws, ey + 1.2); c.stroke();
    } else if (kapali || lid > .6) {
      c.strokeStyle = '#21162f'; c.lineWidth = 1.05; c.beginPath(); c.moveTo(ex - 3.3 * ws, ey); c.quadraticCurveTo(ex, ey + 2.6, ex + 3.3 * ws, ey); c.stroke();
      if (!i && kapali) { c.lineWidth = .7; c.beginPath(); c.moveTo(ex + 3.1, ey + .2); c.lineTo(ex + 4.3, ey + 1.1); c.stroke(); }
    } else {
      const sy = 1 - lid * .9;
      c.save(); c.translate(ex + bx * ws, ey + by); c.scale(ws * gb, hs * sy * gb); yv9Koy(c, gz, 0, 0); c.restore();
    }
  }
  // mutlulukta yanaklar daha pembe
  const yk = Math.max(mutlu, utan * 1.6);
  if (yk > .05) { const yka = Math.min(.55, .3 * yk); c.fillStyle = YV9_YANAK; c.globalAlpha *= yka; c.beginPath(); c.ellipse(10.6, -20.8, 3.3, 2, -.1, 0, YV9_PI2); c.ellipse(-4.6, -22, 2.5, 1.6, 0, 0, YV9_PI2); c.fill(); c.globalAlpha /= yka; }
  // ağız (burnun altında)
  const mx = 13.2, my = -20.6;
  c.strokeStyle = '#21162f'; c.lineWidth = .85;
  if (agiz > .08 || hap > .5) {
    const a = Math.max(agiz, hap > .5 ? .35 : 0), rx = 1.7 + a * 1.2, ry = .6 + a * 2.9;
    c.fillStyle = '#5a2350'; c.beginPath(); c.ellipse(mx - .4, my + ry * .8, rx, ry, 0, 0, YV9_PI2); c.fill();
    if (ry > 1.4) { c.fillStyle = '#ff8fb8'; c.beginPath(); c.ellipse(mx - .4, my + ry * 1.25, rx * .62, ry * .38, 0, 0, YV9_PI2); c.fill(); }
    c.lineWidth = .6; c.beginPath(); c.ellipse(mx - .4, my + ry * .8, rx + .2, ry + .2, 0, 0, YV9_PI2); c.stroke();
    if (a < .75) yv9Dis(c, mx - 1.5, my + .1, mx + .7, my + .15);
  } else {
    const d = .9 + mutlu * 1.6;
    c.beginPath(); c.moveTo(mx - 3.4, my - .5); c.quadraticCurveTo(mx - .6, my + d, mx + 2, my - .7); c.stroke();
    if (mutlu > .4) { c.fillStyle = '#5a2350'; c.beginPath(); c.moveTo(mx - 3.1, my - .3); c.quadraticCurveTo(mx - .6, my + d, mx + 1.8, my - .5); c.quadraticCurveTo(mx - .6, my + .5, mx - 3.1, my - .3); c.fill(); c.stroke(); }
    yv9Dis(c, mx - 2, my - .15 + mutlu * .1, mx + .6, my - .3);
  }
}
function yv9Dis(c, ax, ay, bx, by) {   // üst dudaktan aşağı bakan iki minik yuvarlak beyaz diş
  c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(60,40,80,.55)'; c.lineWidth = .3;
  for (let i = 0; i < 2; i++) { const fx = i ? bx : ax, fy = i ? by : ay; c.beginPath(); c.moveTo(fx - .55, fy); c.lineTo(fx + .55, fy); c.quadraticCurveTo(fx + .2, fy + 1.3, fx, fy + 1.35); c.quadraticCurveTo(fx - .2, fy + 1.3, fx - .55, fy); c.fill(); c.stroke(); }
}

// ═══════════════════════════════ YUMURTA ÇİZİCİ ═══════════════════════════════
// yumurtaCiz(c, x, y, s, t, o) — (x, y) yumurtanın alt ortası; s = 1'de 34 birim boy, 26 en.
// o = { renk (yavruCiz ile aynı adlar), sicak 0..1 (0 soluk grimsi üşümüş → 1 renkli, benekli, ılık parıltılı), titre 0..1 (titreme),
//       catlak 0..1 (ortadan yanlara ilerleyen zikzak çatlak; içinden ılık ışık sızar), alt 0|1 (yalnız kırık alt kabuk: yavru çıktıktan
//       sonra yuvada kalan yarım kabuk), salla -1..1 (yana sallanma, taban çevresinde), alfa }
function yv9YumurtaYol(q) {
  q.moveTo(0, -34); q.bezierCurveTo(8.4, -34, 13.2, -22.5, 13.2, -13.4); q.bezierCurveTo(13.2, -4.6, 7.6, 0, 0, 0);
  q.bezierCurveTo(-7.6, 0, -13.2, -4.6, -13.2, -13.4); q.bezierCurveTo(-13.2, -22.5, -8.4, -34, 0, -34); q.closePath();
}
function yv9ZigYol(q, y0, amp, w) {   // soldan sağa zikzak (kırık kabuk kenarı)
  const n = 7; q.moveTo(-w - 2, y0 + amp * .3);
  for (let i = 0; i <= n; i++) { const x = -w + (2 * w) * i / n; q.lineTo(x, y0 + (i % 2 ? -amp : amp) * (i === 0 || i === n ? .3 : 1)); }
  q.lineTo(w + 2, y0 + amp * .3);
}
const YV9_BENEK = [[-5.5, -25, 2.6, 2], [4.5, -28.5, 1.8, 1.5], [7.6, -18, 2.8, 2.2], [-8.2, -14.6, 2.2, 1.9], [1, -20.5, 1.6, 1.3], [-2.6, -8, 2.4, 1.8], [6.4, -7.4, 1.6, 1.3], [-6.5, -31, 1.2, 1]];
function yv9YumurtaDolgu(q, R, sicak) {   // sicak: 0 soğuk / 1 ılık (tuval başına bir)
  q.beginPath(); yv9YumurtaYol(q);
  q.fillStyle = sicak ? yv9GL(q, 8, -32, -8, -2, '#ffffff', R.yum, mixc(R.yum, R.k, .32)) : yv9GL(q, 8, -32, -8, -2, '#eeecf1', '#c9c5d0', '#aaa5b6'); q.fill();
  q.save(); q.beginPath(); yv9YumurtaYol(q); q.clip();
  for (let i = 0; i < YV9_BENEK.length; i++) { const b = YV9_BENEK[i]; q.fillStyle = sicak ? (i % 3 === 1 ? R.ib : R.ben) : (i % 3 === 1 ? '#b9b4c3' : '#b1acbb'); q.globalAlpha = sicak ? .85 : .7; q.beginPath(); q.ellipse(b[0], b[1], b[2], b[3], i * .7, 0, YV9_PI2); q.fill(); }
  q.globalAlpha = 1;
  // alt gölge ve yan parlama
  q.fillStyle = sicak ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.4)'; q.beginPath(); q.ellipse(-5.6, -24, 2.8, 6.4, .35, 0, YV9_PI2); q.fill();
  q.fillStyle = sicak ? mixc(R.k, R.cz, .2, .18) : 'rgba(80,70,100,.14)'; q.beginPath(); q.ellipse(3, 1, 13, 7, 0, 0, YV9_PI2); q.fill();
  q.restore();
}
function yv9YumurtaSpr(ad, R, K, sicak) {
  return yv9Tuval('yvE' + ad + (sicak ? 's' : 'u'), K, -15, -36, 30, 38, q => {
    yv9YumurtaDolgu(q, R, sicak);
    q.beginPath(); yv9YumurtaYol(q); q.strokeStyle = sicak ? R.cz : '#7d778a'; q.lineWidth = YV9_LW * .9; q.stroke();
  });
}
function yv9AltKabukSpr(ad, R, K) {
  return yv9Tuval('yvA' + ad, K, -15, -22, 30, 24, q => {
    q.save(); q.beginPath(); yv9ZigYol(q, -17, 3, 14); q.lineTo(16, 4); q.lineTo(-16, 4); q.closePath(); q.clip();
    yv9YumurtaDolgu(q, R, 1);
    q.beginPath(); yv9YumurtaYol(q); q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .9; q.stroke(); q.restore();
    // iç yüz (kabuğun içi açık krem) ve kırık kenar
    q.save(); q.beginPath(); yv9YumurtaYol(q); q.clip();
    q.fillStyle = '#fff8ea'; q.beginPath(); q.ellipse(0, -16.4, 12.2, 3.2, 0, 0, YV9_PI2); q.fill(); q.restore();
    q.strokeStyle = R.cz; q.lineWidth = YV9_LW * .8; q.beginPath(); yv9ZigYol(q, -17, 3, 12.6); q.stroke();
  });
}
const YV9_CATLAK = [[0, -17, 2.6, -20.4, 4.6, -16.2, 7.2, -19.6, 9.6, -15.8, 12.4, -18.2], [0, -17, -2.4, -13.8, -4.8, -18, -7.4, -14.4, -10, -18.4, -12.6, -15.6]];
const YV9_YO = {};
function yumurtaCiz(c, x, y, s, t, o) {
  if (!c || !(s > 0) || !Number.isFinite(x) || !Number.isFinite(y)) return;
  o = o || YV9_YO; t = Number.isFinite(t) ? t : 0;
  const ad = YV9_RENK[o.renk] ? o.renk : 'nane', R = YV9_RENK[ad], K = yv9K(c, s);
  const sicak = clamp(o.sicak || 0, 0, 1), titre = clamp(o.titre || 0, 0, 1), catlak = clamp(o.catlak || 0, 0, 1), alfa = o.alfa == null ? 1 : clamp(o.alfa, 0, 1);
  if (alfa <= .01) return;
  const ga = c.globalAlpha; if (alfa < 1) c.globalAlpha = ga * alfa;
  const don = Math.sin(t * 38) * .035 * titre + Math.sin(t * 23 + 1) * .02 * titre + (o.salla || 0) * .26;
  c.save(); c.translate(x + Math.sin(t * 47) * .7 * titre, y); if (don) c.rotate(don); c.scale(s, s);
  if (o.alt) { yv9Koy(c, yv9AltKabukSpr(ad, R, K), 0, 0); c.restore(); if (alfa < 1) c.globalAlpha = ga; return; }
  if (sicak < .99) yv9Koy(c, yv9YumurtaSpr(ad, R, K, false), 0, 0);
  if (sicak > .01) { const a0 = c.globalAlpha; c.globalAlpha = a0 * smooth(sicak); yv9Koy(c, yv9YumurtaSpr(ad, R, K, true), 0, 0); c.globalAlpha = a0; }
  if (sicak > .05) {   // ılık parıltı (içten)
    c.globalCompositeOperation = 'lighter'; yv9IsikE(c, '#ffd9a0', 0, -15, 13, 16, sicak * (.22 + .08 * Math.sin(t * 3.4))); c.globalCompositeOperation = 'source-over';
  }
  if (catlak > .01) {   // çatlak: ortadan iki yana ilerler; içinden altın ışık sızar
    c.strokeStyle = R.cz; c.lineWidth = 1.05;
    for (let p = 0; p < 2; p++) {
      const L = YV9_CATLAK[p], n = L.length / 2 - 1, u = catlak * n;
      c.beginPath(); c.moveTo(L[0], L[1]);
      for (let i = 1; i <= n; i++) { const f = clamp(u - (i - 1), 0, 1); if (f <= 0) break; c.lineTo(lerp(L[i * 2 - 2], L[i * 2], f), lerp(L[i * 2 - 1], L[i * 2 + 1], f)); }
      c.stroke();
    }
    c.globalCompositeOperation = 'lighter'; c.strokeStyle = 'rgba(255,226,150,.85)'; c.lineWidth = .7;
    for (let p = 0; p < 2; p++) {
      const L = YV9_CATLAK[p], n = L.length / 2 - 1, u = catlak * n;
      c.beginPath(); c.moveTo(L[0], L[1] + .3);
      for (let i = 1; i <= n; i++) { const f = clamp(u - (i - 1), 0, 1); if (f <= 0) break; c.lineTo(lerp(L[i * 2 - 2], L[i * 2], f), lerp(L[i * 2 - 1], L[i * 2 + 1], f) + .3); }
      c.stroke();
    }
    yv9IsikE(c, '#ffe2a0', 0, -17, 16 * catlak + 4, 6 + 4 * catlak, catlak * .5);
    c.globalCompositeOperation = 'source-over';
  }
  c.restore();
  if (alfa < 1) c.globalAlpha = ga;
}

// ═══════════════════════════════ YAPRAK YUVA ═══════════════════════════════
// yumuşak, yaprak döşeli küçük yuva (dev kuş yuvası gibi): arka yarısı yumurtanın arkasında, ön kenarı (örgü + yapraklar + minik çiçek) önünde
function yv9YuvaArkaSpr(K) {
  return yv9Tuval('yuvaA', K, -34, -20, 68, 24, q => {
    q.beginPath(); q.ellipse(0, -7, 30, 9, 0, 0, YV9_PI2); q.fillStyle = yv9GL(q, 0, -16, 0, 2, '#7a5a3a', '#5a4030'); q.fill();
    q.strokeStyle = 'rgba(60,40,24,.55)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = '#4a3426'; q.beginPath(); q.ellipse(0, -6, 24, 5.6, 0, 0, YV9_PI2); q.fill();
    // içi yumuşak yosun-yaprak döşek
    q.fillStyle = '#6fbf7a'; q.beginPath(); q.ellipse(0, -5.4, 21, 4.4, 0, 0, YV9_PI2); q.fill();
    q.fillStyle = '#9ad98a'; for (let i = 0; i < 7; i++) { q.beginPath(); q.ellipse(-16 + i * 5.4, -6.4 + (i % 2) * 1.2, 3.4, 1.6, (i % 3 - 1) * .5, 0, YV9_PI2); q.fill(); }
  });
}
function yv9YaprakYol(q, x, y, L, w, a) { q.save(); q.translate(x, y); q.rotate(a); q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(L * .5, -w, L, 0); q.quadraticCurveTo(L * .5, w, 0, 0); q.closePath(); q.restore(); }
function yv9YuvaOnSpr(K) {
  return yv9Tuval('yuvaO', K, -38, -16, 76, 22, q => {
    // örgülü dal kenarı
    q.beginPath(); q.moveTo(-30, -7); q.quadraticCurveTo(0, 4, 30, -7); q.quadraticCurveTo(32, 1, 22, 4.4); q.quadraticCurveTo(0, 8, -22, 4.4); q.quadraticCurveTo(-32, 1, -30, -7); q.closePath();
    q.fillStyle = yv9GL(q, 0, -8, 0, 6, '#b88a5a', '#8a6038'); q.fill(); q.strokeStyle = '#5e3f22'; q.lineWidth = 1.3; q.stroke();
    q.save(); q.clip(); q.strokeStyle = 'rgba(255,230,190,.45)'; q.lineWidth = .8; q.beginPath();
    for (let i = -6; i <= 6; i++) { const x = i * 5; q.moveTo(x - 4, -6 + Math.abs(i) * .3); q.quadraticCurveTo(x + 1, 0, x + 5, 5); } q.stroke();
    q.strokeStyle = 'rgba(70,45,20,.4)'; q.beginPath(); for (let i = -6; i <= 6; i++) { const x = i * 5 + 2.5; q.moveTo(x + 4, -5); q.quadraticCurveTo(x - 1, 0, x - 4, 5); } q.stroke(); q.restore();
    // yapraklar ve minik çiçekler
    const Y = [[-30, -4, 14, 5, -2.6, '#5fbf7a'], [-26, 2, 12, 4.4, -3.4, '#3fa06a'], [29, -4, 14, 5, -.5, '#5fbf7a'], [25, 2.5, 12, 4.4, .2, '#3fa06a'], [-8, 4, 10, 3.6, 2.6, '#6fd8a8'], [9, 4.5, 10, 3.6, .5, '#4fb57f']];
    for (const [x, y, L, w, a, col] of Y) { yv9YaprakYol(q, x, y, L, w, a); q.fillStyle = col; q.fill(); q.strokeStyle = '#2e7a52'; q.lineWidth = .8; q.stroke(); }
    for (const [x, y, col] of [[-17, 1.5, '#ff9fc0'], [18, 1, '#ffd27a'], [2, 5.6, '#d9c8ff']]) {
      q.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * YV9_PI2; q.beginPath(); q.arc(x + Math.cos(a) * 1.7, y + Math.sin(a) * 1.7, 1.45, 0, YV9_PI2); q.fill(); }
      q.fillStyle = '#fff6c8'; q.beginPath(); q.arc(x, y, 1.1, 0, YV9_PI2); q.fill();
    }
  });
}

// ═══════════════════════════════ EJDERHA YUMURTASI → YAVRU ═══════════════════════════════
// Durumlar (o.yv.durum): 'usu' (titrer; Feza yakınken ılık ışık damlası davet eder) → 'isit' (Feza sarılır ~2,5 sn, Pırıl üfler; yumurta
// ısınıp renklenir, sallanır, çatlar) → 'cik' (kabuk şapka uçar, yavru çıkar: göz açar, etrafa bakar, esner, hapşırır, sevinir) →
// 'sevin' (Feza'ya hop hop gidip sarılır) → 'takip' (çıkış sırasıyla peşinden; zıplayarak ya da kısa uçuşlarla) ⇄ 'sirt' (Büyükanne
// yolculuğu: çizilmez) → 'dans' (final). Yavru yuvasından uzaklaştığı için kendi konumunu taşıyan vekil nesne ('ejderYavruCiz') çizer.
const YV9_ES = 1.32;          // yumurta çizim büyüklüğü (≈ 45 birim boy)
const YV9_YS = 1.3;           // yavrunun oyundaki çizim büyüklüğü (≈ 47 birim; Feza çizimde ≈ 80)
const YV9_NS = 1.3;           // yuva çizim büyüklüğü
const YV9_IS = { SARIL: 2.5, ISIN0: .45, ISIN1: 2.2, SALLA: 2.3, CATLA0: 2.55, CATLA1: 3.35, POP: 3.5 };
const YV9_CK = { SAPKA: .55, GOZ: 1.05, ESNE0: 1.45, ESNE1: 2.25, HAP0: 2.4, HAP: 2.68, SEVIN: 3.2, IN: 3.55 };
function yv9Final() { const v = yv9V(); return !!(v && v.final) || !!YV9.final; }
function yv9Sirtta() {   // Büyükanne yolculuğu sürüyor mu (yavrular sırtta; buyukanne.js çizer)
  if (typeof BINIS9 !== 'undefined' && BINIS9 && typeof BINIS9.yavrularBende === 'function') { try { return !!BINIS9.yavrularBende(); } catch (e) {} }
  if (YV9.binis && !YV9.binisBitti) return true;
  const u = typeof P !== 'undefined' && P.ucus; return !!(u && typeof u.tip === 'string' && /buyukanne|binis/i.test(u.tip));
}
function yavruListesi() {
  const a = YV9.liste || (YV9.liste = []); a.length = 0;
  for (const o of YV9.yavrular) { const m = o.yv; if (m.k >= 0 && !m.gec) a.push({ renk: o.renk, k: m.k, x: m.x, y: m.y }); }
  a.sort((p, q) => p.k - q.k); return a;
}
const YAVRU9 = { takipciler: () => yavruListesi(), sirtta: () => yv9Sirtta() };   // buyukanne.js: çıkış sırasıyla [{x, y, renk, k}]
function yv9Fx(m, tip, x, y, sure, x1, y1) {   // nesne başına 5 yuvalı küçük efekt (kalp, pırıltı)
  let f = m.fx[0]; for (const q of m.fx) { if (q.t < 0) { f = q; break; } if (q.t > f.t) f = q; }
  f.t = 0; f.tip = tip; f.x = x; f.y = y; f.max = sure || 1.6; f.x1 = x1 == null ? x : x1; f.y1 = y1 == null ? y : y1; f.r = Math.random();
}
function yv9FxCiz(m) {
  for (const f of m.fx) {
    if (f.t < 0) continue;
    const u = f.t / f.max, a = u < .15 ? u / .15 : u > .7 ? (1 - u) / .3 : 1;
    if (f.tip === 'kalp') { const x = f.x + Math.sin(f.t * 3 + f.r * 6) * 7, y = f.y - f.t * 24, r = 4.5 + u * 3; g.globalAlpha = a; g.drawImage(yv9KalpSpr('#ff8fc8'), x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; }
    else if (f.tip === 'isilti') { const r = 4 + Math.sin(u * Math.PI) * 6; g.globalCompositeOperation = 'lighter'; g.save(); g.translate(f.x, f.y); g.rotate(u * 2); g.globalAlpha = Math.sin(u * Math.PI); g.drawImage(yv9Isilti(), -r, -r, r * 2, r * 2); g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
  }
}
function yv9Sicra(m, x1, y1, h, T0) { const s = m.sic || (m.sic = { x0: 0, y0: 0, x1: 0, y1: 0, u: 0, T: 0, h: 0, uzun: false, aktif: false }); s.x0 = m.x; s.y0 = m.y; s.x1 = x1; s.y1 = y1; s.u = 0; s.T = T0 || .4; s.h = h || 20; s.uzun = false; s.aktif = true; m.ucus = false; return s; }
function yv9IsitBasla(o) {
  const m = o.yv; if (m.durum !== 'usu' || yv9Final()) return false;
  m.durum = 'isit'; m.u = 0; m.ufleT = -1; m.pirilVer = false;
  const r = 13.2 * YV9_ES, h = 34 * YV9_ES;
  YV9.isitO = o;
  OLAY.emit('yumurtaIsit', { o, x: o.x, y: o.y, sure: YV9_IS.SARIL, r, h });
  if (typeof fezaPoz9 !== 'function') { P.kilit = Math.max(P.kilit || 0, YV9_IS.SARIL); P.vx = 0; if (Math.abs(o.x - P.x) > 4) P.f = o.x > P.x ? 1 : -1; }   // yedek: Feza durup yumurtaya döner
  m.pirilVar = typeof PIRIL9 !== 'undefined' && !!PIRIL9;
  return true;
}
function yv9Pop(o) {   // yumurta açıldı: yavru çıkar (sayılır)
  const m = o.yv, v = yv9V(); o.cikti = true; o.done = true;
  if (v) v.yavru = (v.yavru || 0) + 1;
  const n = v ? v.yavru : ++YV9.yavruN; m.n = n; if (m.k < 0) m.k = YV9.takipN++;
  m.durum = 'cik'; m.u = 0; m.x = o.x; m.y = o.y - 6 * YV9_NS; m.yon = P.x >= o.x ? 1 : -1; m.yonS = m.yon;
  const cy = o.y - 26, R = yv9Renk(o.renk);
  burst(o.x, cy, 22, [R.g, R.ib, '#ffffff', '#ffe2a0'], 160, 1.2, 6);
  ripples.push({ x: o.x, y: cy, r: 0, life: 1.4, small: true });
  if (typeof dn9Iz === 'function') { try { dn9Iz(o.x, o.y, 'yavru'); } catch (e) {} }
  yv9Sfx('yavruCik', n);
  OLAY.emit('yavruCikti', { o, n, renk: o.renk, x: o.x, y: cy });
  yv9Vekil(o);
}
function yv9Vekil(o) { const m = o.yv; if (!m.vek && typeof NESNELER !== 'undefined') { m.vek = { tip: 'ejderYavruCiz', id: 'ejderYavruCiz' + o.sira, ana: o, x: m.x, y: m.y }; NESNELER.push(m.vek); } }
TUR.kaydet('ejderYumurta', {
  kur(o) {
    o.sira = YV9.yumSira++; if (!YV9_RENK[o.renk]) o.renk = YV9_RENKLER[o.sira % 6];
    o.cikti = false; o.r = 0;   // motorun dokunma yarıçapı yok: sarılma yerde, yakında ve serbestken başlar (guncelle)
    o.yv = { t: (o.x * .013) % 7, durum: 'usu', u: 0, sicak: 0, titre: 0, titT: .5 + o.sira * .37, davet: 0, catlak: 0, salla: 0, yakinOnce: false, ufleT: -1,
      x: o.x, y: o.y - 6, vx: 0, vy: 0, k: -1, n: 0, yon: 1, yonS: 1, sic: null, ucus: false, uzakT: 0, hopT: 0, mut: 0, kanat: 0, saril: 0, sarT: 0, hap: 0, agiz: 0, kirp: 0, bak: 0,
      sapka: 0, sapkaU: -1, sapkaHop: 0, yetis: false, gec: false, vek: null, kol: 0, dans: 0, dansX: 0, dansY: 0, izT: 0, izI: 0, pirilVar: false, pirilVer: false, cheerT: 0, cikT: 0,
      zip: 0, havaT: 0, sevT: 0, tapT: 0, kanatT: 0, bakT: 0, oyunT: 3 + o.sira, gelT: 0, dansGel: 0, dansFaz: 0,
      iz: [0, 1, 2, 3, 4, 5, 6, 7].map(() => ({ x: 0, y: 0, t: -9 })), fx: [0, 1, 2, 3, 4].map(() => ({ t: -1, tip: '', x: 0, y: 0, x1: 0, y1: 0, max: 1, r: 0 })),
      opt: { renk: o.renk, yon: 1, mutlu: 0, kanat: 0, ucus: 0, ziplama: 0, kabuk: 0, agiz: 0, dans: 0, uyku: 0, kirp: 0, saril: 0, hapsir: 0, bak: 0, bakY: 0, egim: 0, bas: 0, kabukEgim: 0, alfa: 1, isik: 0, kanatAc: .6 },
      eopt: { renk: o.renk, sicak: 0, titre: 0, catlak: 0, alt: 0, salla: 0, alfa: 1 } };
    YV9.yavrular.push(o);
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.yv; m.t += dt;
    for (const f of m.fx) if (f.t >= 0) { f.t += dt; if (f.t > f.max) f.t = -1; }
    yv9SapkaGuncelle(m, dt);
    if (m.durum === 'usu') yv9Usu(o, m, dt);
    else if (m.durum === 'isit') yv9Isit(o, m, dt);
    else if (m.durum === 'cik') yv9Cik(o, m, dt);
    else yv9Takip(o, m, dt);
    if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) { m.x = P.x - 60; m.y = P.y; m.vx = m.vy = 0; if (m.sic) m.sic.aktif = false; }
  },
  ciz(o, tm) {
    if (!yv9Ekranda(o.x, 140)) return;
    const m = o.yv, K = yv9K(g, 1);
    // yuvanın altında yumuşak gölge + ısınınca ılık ışık lekesi
    g.fillStyle = 'rgba(30,50,30,.22)'; g.beginPath(); g.ellipse(o.x, o.y + 1, 34 * YV9_NS, 5 * YV9_NS, 0, 0, YV9_PI2); g.fill();
    const sic = m.durum === 'usu' ? 0 : m.durum === 'isit' ? m.sicak : 1;
    if (sic > .02 || m.davet > .02) { g.globalCompositeOperation = 'lighter'; yv9IsikE(g, '#ffcf8a', o.x, o.y - 6, 84, 22, sic * .35 + m.davet * .12); g.globalCompositeOperation = 'source-over'; }
    g.save(); g.translate(o.x, o.y); g.scale(YV9_NS, YV9_NS); yv9Koy(g, yv9YuvaArkaSpr(yv9K(g, 1)), 0, 0); g.restore();
    const e = m.eopt, ey = o.y - 5 * YV9_NS;
    if (!o.cikti) {
      e.sicak = sic; e.titre = m.titre; e.catlak = m.catlak; e.salla = m.salla; e.alt = 0;
      yumurtaCiz(g, o.x, ey, YV9_ES, m.t, e);
    } else if (!m.gec) {
      e.alt = 1; e.salla = 0; e.titre = 0;
      if (m.durum === 'cik') yv9YavruCiz(o, tm);   // çıkarken kabuğun içinde
      yumurtaCiz(g, o.x, ey, YV9_ES, m.t, e);
      if (m.durum === 'cik' && m.sapkaU >= 0 && m.sapkaU < 1) yv9SapkaUcan(o, m);
    }
    g.save(); g.translate(o.x, o.y); g.scale(YV9_NS, YV9_NS); yv9Koy(g, yv9YuvaOnSpr(yv9K(g, 1)), 0, 0); g.restore();
    // davet: ılık ışık damlası yavaşça iner-kalkar (Feza yakınken)
    if (m.durum === 'usu' && m.davet > .02) {
      const yy = o.y - 76 - Math.abs(Math.sin(tm * 2.2)) * 10; g.globalCompositeOperation = 'lighter';
      yv9Isik(g, '#ffd9a0', o.x, yy, 20, m.davet * .5); g.globalCompositeOperation = 'source-over';
      g.globalAlpha = m.davet * .9; g.drawImage(yv9KalpSpr('#ffb3cf'), o.x - 6, yy - 6, 12, 12); g.globalAlpha = 1;
    }
    if (m.durum === 'isit') yv9NefesCiz(o, m, tm);
    if (m.durum === 'isit' || (m.durum === 'cik' && m.u < .9)) yv9CatlakIsik(o, m);
    if (m.durum === 'isit' || m.durum === 'cik') yv9FxCiz(m);
  },
});
function yv9Usu(o, m, dt) {
  const dx = P.x - o.x, uz = Math.abs(dx), oyun = DURUM === 'oyun' && !P.ucus && !(P.fade > 0);
  if (yv9Final()) { yv9FinaleKat(o); return; }
  // üşüyüp titreme: birkaç saniyede bir kısa titreme nöbeti
  m.titT -= dt; if (m.titT <= 0) { m.titT = 1.8 + Math.random() * 1.6; m.titre = 1; }
  m.titre = Math.max(0, m.titre - dt * 1.25);
  m.davet = clamp(m.davet + (uz < 340 && oyun ? dt : -dt) * 1.3, 0, 1);
  m.salla = lerp(m.salla, uz < 260 && oyun ? clamp(dx / 260, -1, 1) * .12 : 0, Math.min(1, dt * 3));   // Feza'ya doğru hafifçe eğilir ("sarıl bana")
  if (uz < 340 && oyun && !m.yakinOnce) { m.yakinOnce = true; OLAY.emit('yumurtaYakin', { o, ilk: !YV9.yakinOnce }); YV9.yakinOnce = true; }
  if (oyun && P.ground && uz < 52 && Math.abs(P.y - o.y) < 50 && !(P.kilit > .05) && !(typeof om9MiniAktif === 'function' && om9MiniAktif())) yv9IsitBasla(o);
}
function yv9Isit(o, m, dt) {
  m.u += dt; const u = m.u, I = YV9_IS, u0 = u - dt;
  m.titre = Math.max(0, m.titre - dt * 3); m.davet = Math.max(0, m.davet - dt * 2);
  if (m.pirilVer && m.ufleT < 0) m.ufleT = Math.min(u, 1.6);
  // Pırıl (piril.js) ışığı yumurtaya değdirince ('pirilUfle9' ver ≈ 1,25 sn) ısınır; Pırıl kancası yoksa kendi zamanlamamla
  const i0 = m.pirilVar ? (m.ufleT >= 0 ? m.ufleT : u > 1.5 ? 1.25 : 9) : I.ISIN0, i1 = m.pirilVar ? 2.45 : I.ISIN1;
  m.sicak = Math.max(m.sicak, smooth(clamp((u - i0) / Math.max(.4, i1 - i0), 0, 1)));
  if (u0 < .5 && u >= .5) yv9Sfx('yumurtaIsit', o.sira);
  if (u0 < .7 && u >= .7) yv9Fx(m, 'kalp', o.x - 14, o.y - 46, 1.7);
  if (u0 < 1.5 && u >= 1.5) yv9Fx(m, 'kalp', o.x + 12, o.y - 50, 1.8);
  // sallanma: önce hafif, çatlarken daha çok (kıpır kıpır)
  const sa = smooth(clamp((u - I.SALLA) / .5, 0, 1)) * (1 - smooth(clamp((u - I.POP + .15) / .15, 0, 1)));
  m.salla = Math.sin(u * 15) * .5 * sa + Math.sin(u * 7) * .25 * sa;
  m.catlak = smooth(clamp((u - I.CATLA0) / (I.CATLA1 - I.CATLA0), 0, 1));
  if (u0 < I.CATLA0 && u >= I.CATLA0) { yv9Sfx('yumurtaCatla', 0); yv9Fx(m, 'isilti', o.x + 4, o.y - 26, .8); }
  if (u0 < I.CATLA0 + .5 && u >= I.CATLA0 + .5) { yv9Sfx('yumurtaCatla', 1); yv9Fx(m, 'isilti', o.x - 8, o.y - 22, .8); }
  if (u >= I.POP) yv9Pop(o);
}
// Pırıl'ın ılık ışık nefesi (piril.js PIRIL9 yoksa yedek akış; her durumda yumurtanın çevresinde dönen ılık halka)
function yv9NefesCiz(o, m, tm) {
  const u = m.u, a = smooth(clamp((u - .35) / .3, 0, 1)) * (1 - smooth(clamp((u - 2.2) / .4, 0, 1)));
  if (a <= .01) return;
  const ex = o.x, ey = o.y - 28, isl = yv9Isilti();
  g.globalCompositeOperation = 'lighter';
  if (!m.pirilVar) {
    const sx = typeof D !== 'undefined' && Number.isFinite(D.x) ? D.x + (D.f || 1) * 14 : ex - 60, sy = typeof D !== 'undefined' && Number.isFinite(D.y) ? D.y - 4 : ey - 60;
    for (let k = 0; k < 9; k++) {
      const v = (tm * .9 + k / 9) % 1, e = smooth(v), px = lerp(sx, ex, e) + Math.sin(v * 9 + k) * 6, py = lerp(sy, ey, e) - Math.sin(e * Math.PI) * 18;
      yv9Isik(g, k % 2 ? '#ffc8dc' : '#ffe2a0', px, py, 9, a * .55 * Math.sin(v * Math.PI));
      g.globalAlpha = a * .9 * Math.sin(v * Math.PI); g.drawImage(isl, px - 3, py - 3, 6, 6); g.globalAlpha = 1;
    }
  }
  for (let k = 0; k < 6; k++) { const an = k / 6 * YV9_PI2 + tm * 2.4, r = 26 + Math.sin(tm * 3 + k) * 3; yv9Isik(g, k % 2 ? '#ffd9a0' : '#ffb8d4', ex + Math.cos(an) * r, ey + Math.sin(an) * r * .75, 8, a * .5); }
  yv9IsikE(g, '#ffe4b0', ex, ey, 34, 30, a * m.sicak * .3);
  g.globalCompositeOperation = 'source-over';
}
function yv9CatlakIsik(o, m) {   // çatlarken ve açılırken içten taşan altın ışık
  const c = m.durum === 'isit' ? m.catlak : 1 - m.u / .9;
  if (c <= .01) return;
  g.globalCompositeOperation = 'lighter';
  yv9Isik(g, '#ffe2a0', o.x, o.y - 30, 34 + c * 22, c * .45);
  if (m.durum === 'cik') { const u = m.u / .9, ib = yv9Renk(o.renk).ib; for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .45, r = 18 + u * 50; yv9IsikE(g, k % 2 ? '#fff2c8' : ib, o.x + Math.cos(a) * r, o.y - 26 + Math.sin(a) * r, 10, 10, (1 - u) * .55); } }
  g.globalCompositeOperation = 'source-over';
}
function yv9SapkaUcan(o, m) {   // üst kabuk yukarı uçup dönerek yavrunun başına konar
  const u = m.sapkaU, e = smooth(u), R = yv9Renk(o.renk), K = yv9K(g, YV9_ES);
  const hx = m.x + m.yon * 1.6 * YV9_YS, hy = m.y - 37.6 * YV9_YS, x0 = o.x, y0 = o.y - 5 * YV9_NS - 17 * YV9_ES;
  const x = lerp(x0, hx, e), y = lerp(y0, hy, e) - Math.sin(u * Math.PI) * 46, sc = lerp(YV9_ES, .64 * YV9_YS, e), rot = u * YV9_PI2 + lerp(0, -.28 * m.yon, e);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.translate(0, 17); yv9Koy(g, yv9KabukSpr(o.renk, R, K), 0, 0); g.restore();
}
function yv9Cik(o, m, dt) {
  m.u += dt; const u = m.u, u0 = u - dt, C = YV9_CK, dx = P.x - m.x;
  const cik = smooth(clamp(u / .45, 0, 1));   // kabuğun içinden yükselir (taban yuvanın içinde)
  m.y = o.y - 9 * YV9_NS + (1 - cik) * 16; m.x = o.x; m.zip = u < .45 ? .5 * Math.sin(u / .45 * Math.PI) : 0;
  m.sapkaU = u < C.SAPKA ? u / C.SAPKA : 1; m.sapka = u >= C.SAPKA ? 1 : 0;
  if (u0 < C.SAPKA && u >= C.SAPKA) { m.sapkaHop = .01; burst(m.x, m.y - 42, 6, ['#ffffff', '#ffe2a0'], 60, .6, 4); }
  m.kirp = u < C.GOZ ? 1 : u < C.GOZ + .25 ? 1 - smooth((u - C.GOZ) / .25) : 0;   // yeni doğmuş: gözler kapalı, sonra açılır
  m.bak = u >= C.GOZ && u < C.ESNE0 ? Math.sin((u - C.GOZ) * 7) * .9 : 0;          // etrafa bakınır
  const es = u >= C.ESNE0 && u < C.ESNE1 ? Math.sin((u - C.ESNE0) / (C.ESNE1 - C.ESNE0) * Math.PI) : 0;   // esneme (kanatlar gerinir)
  m.agiz = es; m.kanat = es * .5; m.kol = es;
  if (es > .5) m.kirp = Math.max(m.kirp, (es - .5) * 2);
  m.hap = u >= C.HAP0 && u < C.HAP ? (u - C.HAP0) / (C.HAP - C.HAP0) * .3 : u >= C.HAP && u < C.HAP + .35 ? 1 : 0;   // "ha... hapşu!"
  if (u0 < C.HAP && u >= C.HAP) {
    yv9Sfx('yavruHapsir', o.sira);
    const nx = m.x + m.yon * 17 * YV9_YS, ny = m.y - 24 * YV9_YS;
    burst(nx, ny, 12, ['#ffffff', '#fff2a8', yv9Renk(o.renk).ib, '#ffd6f2'], 130, .9, 5);
    yv9Fx(m, 'isilti', nx + m.yon * 8, ny - 4, .9); m.sapkaHop = .01;
  }
  m.mut = u >= C.SEVIN ? Math.min(1, m.mut + dt * 4) : u >= C.GOZ + .3 && u < C.ESNE0 ? .5 : 0;
  if (Math.abs(dx) > 8 && u > C.GOZ) { m.yon = dx > 0 ? 1 : -1; m.yonS = m.yon; }
  if (u0 < C.SEVIN && u >= C.SEVIN) { yv9Sfx('yavruCik2', o.sira); m.agiz = .8; m.zip = .4; }
  if (u >= C.SEVIN) m.agiz = Math.max(m.agiz, .45 + .45 * Math.sin((u - C.SEVIN) * 20));
  if (u >= C.IN) {   // yuvadan atlayıp Feza'ya koşar
    m.durum = 'sevin'; m.u = 0; m.y = o.y - 6; m.agiz = 0;
    const yn = m.x < P.x ? 1 : -1, tx = P.x - yn * 26, ty = yv9Zemin(tx, P.y);
    if (ty != null && Math.abs(tx - m.x) < 300 && Math.abs(ty - m.y) < 3 * T) yv9Sicra(m, tx, ty, 34 + Math.abs(tx - m.x) * .12, .45 + Math.abs(tx - m.x) / 900);
    else { const zx = m.x + m.yon * 34, zy = yv9Zemin(zx, o.y); yv9Sicra(m, zx, zy == null ? o.y : zy, 30, .45); }
  }
}
function yv9SapkaGuncelle(m, dt) { if (m.sapkaHop > 0) { m.sapkaHop += dt / .45; if (m.sapkaHop >= 1) m.sapkaHop = 0; } }

// ── Takip: zıplayarak (yerde yay çizen hoplar) ya da kısa uçuşlarla (boşluk, yüksek basamak, Feza havadayken); geride kalınca
//    ekran dışından ışıltılı uçuşla yetişir. Sıra: çıkış sırası (m.k). Mini oyunlarda biraz daha geride bekleyip sevinçle izler.
const YV9_ARA = 34, YV9_ILK = 48;
function yv9SicraAdim(o, m, dt) {
  const s = m.sic; if (!s || !s.aktif) return false;
  s.u += dt / s.T; const u = Math.min(1, s.u);
  m.x = lerp(s.x0, s.x1, u); m.y = lerp(s.y0, s.y1, u) - Math.sin(u * Math.PI) * s.h;
  m.zip = u < .55 ? .55 : .15;
  if (Math.abs(s.x1 - s.x0) > 3) m.yon = s.x1 > s.x0 ? 1 : -1;
  if (s.h > 44) m.kanat = Math.max(m.kanat, .9);
  if (s.u >= 1) {
    s.aktif = false; m.x = s.x1; m.y = s.y1; m.zip = -Math.min(.75, .25 + s.h / 90);
    if (s.uzun) burst(m.x, m.y - 6, 8, ['#ffffff', yv9Renk(o.renk).g, '#ffe2a0'], 70, .6, 4);
    if (typeof dn9Iz === 'function' && s.h > 20) { try { dn9Iz(m.x, m.y, 'yavru'); } catch (e) {} }
  }
  return true;
}
function yv9Kalk(m, vy) { m.ucus = true; if (m.sic) m.sic.aktif = false; m.vx = 0; m.vy = vy == null ? -160 : vy; }
function yv9GeriGel(o, m) {   // çok geride / yolculuktan sonra: ekran dışından ışıltılı uçuşla gelir
  const f = P.f || 1, vw = typeof VW !== 'undefined' ? VW : 1000;
  if (Math.abs(m.x - P.x) > vw * .6 || Math.abs(m.y - P.y) > 9 * T) { m.x = P.x - f * (vw * .55 + 70 + m.k * 40); m.y = P.y - 150 - m.k * 14; }
  yv9Kalk(m, 0); m.vx = f * 380; m.yetis = true;
}
function yv9Oyun() { return DURUM === 'oyun' && !(P.fade > 0); }
function yv9Mini() { return (typeof om9MiniAktif === 'function' && !!om9MiniAktif()) || !!(P.ucus && !yv9Sirtta()); }
function yv9Takip(o, m, dt) {
  m.zip *= Math.max(0, 1 - dt * 7); m.kanat = Math.max(0, m.kanat - dt * 1.6); m.agiz = Math.max(0, m.agiz - dt * 1.5);
  m.cheerT = Math.max(0, m.cheerT - dt); m.tapT = Math.max(0, m.tapT - dt); m.saril = Math.max(0, m.saril - (m.sarT > 0 ? 0 : dt * 3));
  if (m.izT > 0) m.izT -= dt;
  if (m.durum === 'dans') { yv9Dans(o, m, dt); return; }
  if (yv9Final()) { yv9DansaBasla(o, m); return; }
  if (yv9Sirtta()) { if (m.durum !== 'sirt') { m.durum = 'sirt'; m.ucus = false; if (m.sic) m.sic.aktif = false; } m.x = P.x; m.y = P.y; return; }
  if (m.durum === 'sirt') {   // iniş: Büyükanne'nin sırtından sırayla atlayıp yere iner
    m.durum = 'in'; m.gelT = .25 + m.k * .18; const f = P.f || 1;
    let ix = P.x, iy = P.y; if (typeof BINIS9 !== 'undefined' && BINIS9 && typeof BINIS9.inisYer === 'function') { try { const q = BINIS9.inisYer(); if (q && Number.isFinite(q.x) && Number.isFinite(q.y) && Math.abs(q.x - P.x) < 600) { ix = q.x; iy = q.y; } } catch (e) {} }
    m.x = ix - f * (18 + m.k * 20); m.y = iy - 58 - (m.k % 2) * 6; m.yon = f; return;
  }
  if (m.durum === 'in') {
    m.gelT -= dt; if (m.gelT > 0) return;
    const f = P.f || 1, tx = P.x - f * (YV9_ILK + m.k * YV9_ARA), ty = yv9Zemin(tx, P.y);
    yv9Sicra(m, tx, ty == null ? P.y : ty, 60 + m.k * 6, .7).uzun = true; m.kanat = 1; m.durum = 'takip'; return;
  }
  if (yv9SicraAdim(o, m, dt)) { yv9Duygu(o, m, dt); return; }
  const oyun = yv9Oyun();
  // ── sevin: yuvadan Feza'ya geldi → sarılır (kalpler), sonra sıraya geçer ──
  if (m.durum === 'sevin') {
    m.u += dt; const d = Math.abs(P.x - m.x);
    if (m.sarT <= 0 && d < 60 && Math.abs(P.y - m.y) < 40 && m.u < 2.6) { m.sarT = 1.15; m.yon = P.x > m.x ? 1 : -1; yv9Fx(m, 'kalp', m.x + m.yon * 8, m.y - 46, 1.6); yv9Fx(m, 'kalp', m.x + m.yon * 18, m.y - 52, 1.9); }
    if (m.sarT > 0) { m.sarT -= dt; m.saril = Math.min(1, m.saril + dt * 5); m.mut = 1; if (m.sarT <= 0) { m.durum = 'takip'; m.hopT = .2; } return; }
    if (m.u > 2.6 || d > 200) { m.durum = 'takip'; }
    else if (d >= 60) { const yn = P.x > m.x ? 1 : -1, tx = P.x - yn * 26, ty = yv9Zemin(tx, P.y); if (ty != null && Math.abs(ty - m.y) < 2.6 * T) { yv9Sicra(m, tx, ty, 22 + d * .1, .3 + d / 900); return; } m.durum = 'takip'; }
    return;
  }
  const f = P.f || 1, mini = yv9Mini(), vw = typeof VW !== 'undefined' ? VW : 1000;
  const geri = YV9_ILK + m.k * YV9_ARA + (mini ? 80 : 0), hx = P.x - f * geri;
  const zg = yv9Zemin(hx, P.y - 6), yerde = P.ground || YV9.havaT < .3;
  const dP = Math.hypot(P.x - m.x, P.y - m.y);
  if (oyun && (dP > vw * .85 || Math.abs(P.y - m.y) > 9 * T)) { m.uzakT += dt; if (m.uzakT > .35 + m.k * .1) { m.uzakT = 0; yv9GeriGel(o, m); } } else m.uzakT = 0;
  const yuksek = zg == null || Math.abs(zg - P.y) > 2.5 * T, havada = !yerde && P.y < m.y - 80;
  if (oyun && !m.ucus && !(m.sic && m.sic.aktif) && Math.abs(hx - m.x) > 380) { yv9Kalk(m, -220); m.yetis = true; }   // geride kaldı: ışıltılı uçuşla yetişir
  if (m.ucus) {   // kısa uçuş: yaya benzer yumuşak süzülüş, hızlı kanat
    const ty = !yuksek && yerde ? zg - 26 : P.y - 52 - (m.k % 2) * 14, tx = yuksek || !yerde ? P.x - f * (30 + m.k * 26) : hx;
    const om = m.yetis ? 5.2 : 4.6 - Math.min(m.k, 5) * .22, vmax = m.yetis ? 1150 : 640;
    const ax = om * om * (tx - m.x) - 2 * .92 * om * m.vx, ay = om * om * (ty - m.y) - 2 * .92 * om * m.vy;
    m.vx += ax * dt; m.vy += ay * dt; const sp = Math.hypot(m.vx, m.vy); if (sp > vmax) { m.vx *= vmax / sp; m.vy *= vmax / sp; }
    m.x += m.vx * dt; m.y += m.vy * dt; if (Math.abs(m.vx) > 30) m.yon = m.vx > 0 ? 1 : -1;
    if (m.yetis && Math.hypot(tx - m.x, ty - m.y) < 120) m.yetis = false;
    if ((m.yetis || sp > 380) && m.izT <= 0) { m.izT = .045; const p = m.iz[m.izI]; p.x = m.x; p.y = m.y - 20; p.t = m.t; m.izI = (m.izI + 1) % m.iz.length; }
    if (!yuksek && yerde && Math.abs(tx - m.x) < 70 && Math.abs(ty - m.y) < 60) yv9Sicra(m, tx, zg, 10, .28);   // yumuşak iniş
    yv9Duygu(o, m, dt); return;
  }
  if (oyun && (havada || yuksek) && Math.abs(P.x - m.x) < vw * .7) { yv9Kalk(m); yv9Duygu(o, m, dt); return; }
  m.hopT -= dt;
  if (m.hopT > 0) { yv9Duygu(o, m, dt); return; }
  const hdx = hx - m.x, ad = Math.abs(hdx);
  if (ad > 24) {   // hedefe hop: uzaksa iri ve sık adımlar
    m.hopT = ad > 140 ? .02 + Math.random() * .04 : .07 + Math.random() * .1;
    const st = clamp(hdx, -125, 125), nx = m.x + st, ny = yv9Zemin(nx, m.y);
    if (ny != null && Math.abs(ny - m.y) < 2.6 * T) { yv9Sicra(m, nx, ny, 16 + Math.abs(st) * .12 + Math.max(0, m.y - ny) * .6 + Math.random() * 6, .26 + Math.abs(st) / 620); yv9Duygu(o, m, dt); return; }
    yv9Kalk(m); yv9Duygu(o, m, dt); return;   // boşluk ya da yüksek basamak: kısa uçuş
  }
  // vardı: Feza'ya döner; ara sıra yerinde sevinç hopu, kanat çırpma, etrafa bakınma, "cik"
  m.hopT = .7 + Math.random() * 1.3;
  if (Math.abs(P.x - m.x) > 16) m.yon = P.x > m.x ? 1 : -1;
  const r = Math.random();
  if (m.cheerT > 0 || r < .32) yv9Sicra(m, m.x, m.y, 14 + Math.random() * 16 + (m.cheerT > 0 ? 16 : 0), .36);
  else if (r < .5) m.kanat = 1;
  else if (r < .62) { m.bak = m.yon * -.9; m.bakT = .8; }
  else if (r < .7) m.agiz = .7;
  yv9Duygu(o, m, dt);
}
function yv9Duygu(o, m, dt) {   // yön dönüşü, mutluluk, bakış (her durumda)
  m.yonS += clamp(m.yon - m.yonS, -dt * 7, dt * 7);
  const mH = m.cheerT > 0 || m.ucus || m.saril > .2 || m.tapT > 0 || (m.sic && m.sic.aktif && m.sic.h > 26) ? 1 : .35 + .25 * Math.sin(m.t * .7 + o.sira);
  m.mut += (mH - m.mut) * Math.min(1, dt * 4);
  if (m.bakT > 0) m.bakT -= dt; else m.bak += (clamp((P.x - m.x) / 160, -1, 1) * m.yon - m.bak) * Math.min(1, dt * 4);
}
// ── Final: çıkmış yavrular yuvanın iki yanına uçar, ejderFinalNabiz() vuruşunda sekip kanat çırparak dans eder; doruğun ardından
//    havada küçük bir ışık çemberi çizer. Çıkmamış yumurtaların yavruları da (sayılmaz) ekran dışından uçarak gelir.
function yv9FinalAn() { if (typeof ejderFinalAn === 'function') { try { const a = ejderFinalAn(); if (Number.isFinite(a)) return a; } catch (e) {} } return YV9.finalT; }
function yv9FinalNabiz() {
  if (typeof ejderFinalNabiz === 'function') { try { const n = ejderFinalNabiz(); if (Number.isFinite(n)) return clamp(n, 0, 1); } catch (e) {} }
  const u = (YV9.finalT % .5) / .5; return Math.pow(1 - u, 3);
}
const YV9_DY = [0, 0];
function yv9DansYer(o, m, out) {
  const fo = YV9.final && YV9.final.o, n = YV9.yavrular.length;
  if (typeof ejderFinalYavruYer === 'function') { try { const q = YV9.dyO || (YV9.dyO = { x: 0, y: 0 }); q.x = NaN; q.y = NaN; const r = ejderFinalYavruYer(m.dk, q) || q; if (Number.isFinite(r.x) && Number.isFinite(r.y)) { out[0] = r.x; out[1] = r.y; return out; } } catch (e) {} }
  if (typeof yu9YavruDansYer === 'function') { try { yu9YavruDansYer(m.dk, n, out); if (Number.isFinite(out[0]) && Number.isFinite(out[1])) return out; } catch (e) {} }
  const cx = fo && Number.isFinite(fo.x) ? fo.x : P.x, cy = fo && Number.isFinite(fo.y) ? fo.y : P.y, yan = m.dk % 2 ? 1 : -1, i = m.dk >> 1;
  out[0] = cx + yan * (92 + i * 50); const zy = yv9Zemin(out[0], cy - 20); out[1] = zy == null ? cy : zy; return out;
}
function yv9DansaBasla(o, m) {
  if (m.durum === 'dans') return;
  const vw = typeof VW !== 'undefined' ? VW : 1000, mx = typeof cam !== 'undefined' ? cam.x : P.x;
  if (m.k < 0) { m.k = YV9.takipN++; m.gec = true; }
  m.dk = YV9.dansN = (YV9.dansN || 0) + 1; m.dk--;
  if (m.gec || m.durum === 'sirt' || m.durum === 'in' || Math.abs(m.x - P.x) > vw) { m.x = (m.dk % 2 ? mx + vw + 60 : mx - 60) + (m.dk >> 1) * (m.dk % 2 ? 40 : -40); m.y = P.y - 220 - m.dk * 12; }
  m.durum = 'dans'; m.dansGel = 0; m.ucus = true; m.vx = 0; m.vy = 0; if (m.sic) m.sic.aktif = false; m.nbOnce = 0; m.dansFaz = 0; m.sapka = 1;
  if (!m.vek) yv9Vekil(o);
}
function yv9FinaleKat(o) {   // final başladı ama yumurta hiç ısıtılmadı: yavrusu yine de gelip dansa katılır (sayılmaz)
  const m = o.yv; if (m.durum === 'dans') return;
  o.cikti = true; m.gec = true; yv9DansaBasla(o, m);
}
function yv9Dans(o, m, dt) {
  const a = yv9FinalAn(), nb = yv9FinalNabiz();
  yv9DansYer(o, m, YV9_DY); const sx = YV9_DY[0], sy = YV9_DY[1];
  const dor = a >= 28 && a < 31.5, cember = a >= 29 && a < 31.2;
  if (m.ucus || cember) {   // dans yerine uçuş (ya da doruk çemberi)
    let tx = sx, ty = sy - 30;
    if (cember) { const u = (a - 29) / 2.2, an = -Math.PI / 2 + u * YV9_PI2 * (m.dk % 2 ? 1 : -1); tx = sx + Math.cos(an) * 34; ty = sy - 96 - m.dk * 6 + Math.sin(an) * 34; m.ucus = true; }
    const om = cember ? 7 : 4.2, ax = om * om * (tx - m.x) - 2 * .9 * om * m.vx, ay = om * om * (ty - m.y) - 2 * .9 * om * m.vy;
    m.vx += ax * dt; m.vy += ay * dt; const sp = Math.hypot(m.vx, m.vy); if (sp > 900) { m.vx *= 900 / sp; m.vy *= 900 / sp; }
    m.x += m.vx * dt; m.y += m.vy * dt; if (Math.abs(m.vx) > 30) m.yon = m.vx > 0 ? 1 : -1;
    if (m.izT <= 0 && (sp > 300 || cember)) { m.izT = .04; const p = m.iz[m.izI]; p.x = m.x; p.y = m.y - 20; p.t = m.t; m.izI = (m.izI + 1) % m.iz.length; }
    if (!cember && Math.abs(tx - m.x) < 26 && Math.abs(ty - m.y) < 26) yv9Sicra(m, sx, sy, 10, .3);
    if (!cember && a >= 31.2 && m.ucus && Math.abs(tx - m.x) < 120) yv9Sicra(m, sx, sy, 18, .45);
    m.dans = .5; m.mut = 1; m.kanat = 1; m.yonS += clamp(m.yon - m.yonS, -dt * 7, dt * 7); m.nbOnce = nb; return;
  }
  if (yv9SicraAdim(o, m, dt)) { m.dans = Math.max(m.dans, .6); m.mut = 1; m.nbOnce = nb; m.yonS += clamp(m.yon - m.yonS, -dt * 7, dt * 7); return; }
  m.x = sx; m.y = sy; m.zip *= Math.max(0, 1 - dt * 7);
  // vuruş: sevinç sekmesi; dört vuruşta bir öbür yana döner; doruğa yakın daha yüksek
  if (nb > .8 && m.nbOnce <= .8) {
    m.dansFaz++; const yuk = dor ? 40 : 16 + (m.dk % 3) * 5;
    yv9Sicra(m, sx, sy, yuk, .34); m.kanat = 1; m.agiz = .7;
    if (m.dansFaz % 4 === 0) m.yon = -m.yon; else { const fo = YV9.final && YV9.final.o; if (fo && m.dansFaz % 4 === 1) m.yon = fo.x > m.x ? 1 : -1; }
  }
  m.nbOnce = nb; m.dans = 1; m.mut = 1; m.kanat = Math.max(m.kanat, nb * .8); m.agiz = Math.max(0, m.agiz - dt * 2);
  m.yonS += clamp(m.yon - m.yonS, -dt * 7, dt * 7);
}
// ── Yavrunun çizimi (vekil nesneden; çıkarken yumurtanın kendisinden) ──
function yv9YavruCiz(o, tm) {
  const m = o.yv, s = YV9_YS, op = m.opt;
  // ışıltı izi (yetişirken / hızlı uçuşta / doruk çemberinde)
  let izVar = false; for (const p of m.iz) if (m.t - p.t < .5 && m.t >= p.t) { izVar = true; break; }
  if (izVar) {
    const isl = yv9Isilti(), R = yv9Renk(o.renk); g.globalCompositeOperation = 'lighter';
    for (const p of m.iz) { const yas = m.t - p.t; if (yas > .5 || yas < 0) continue; const a = 1 - yas / .5, r = 3 + a * 4; yv9Isik(g, (Math.floor(p.t * 20) % 2) ? R.g : '#ffe2a0', p.x, p.y, 12 * a + 4, a * .45); g.globalAlpha = a * .9; g.drawImage(isl, p.x - r, p.y - r, r * 2, r * 2); g.globalAlpha = 1; }
    g.globalCompositeOperation = 'source-over';
  }
  // gölge (havadayken küçülür)
  if (m.durum !== 'cik') {
    const zy = m.sic && m.sic.aktif ? lerp(m.sic.y0, m.sic.y1, Math.min(1, m.sic.u)) : m.ucus ? yv9Zemin(m.x, m.y - 4) : m.y;
    if (zy != null && zy >= m.y - 2) { const hv = clamp((zy - m.y) / 120, 0, .8); g.globalAlpha = .2 * (1 - hv); g.fillStyle = '#1f3a2a'; g.beginPath(); g.ellipse(m.x, zy, 13 * s * (1 - hv * .5), 2.8 * s, 0, 0, YV9_PI2); g.fill(); g.globalAlpha = 1; }
  }
  const sp = m.sapkaHop > 0 ? Math.sin(m.sapkaHop * Math.PI) : 0;
  op.yon = m.yonS; op.mutlu = m.mut; op.kanat = Math.max(m.kanat, m.ucus ? 1 : 0); op.ucus = m.ucus ? 1 : 0; op.ziplama = clamp(m.zip, -1, 1);
  op.kabuk = m.sapka; op.kabukEgim = sp * -.5 * Math.sign(m.yon || 1); op.agiz = m.agiz; op.dans = m.dans; op.kirp = m.durum === 'cik' ? m.kirp : null;
  op.saril = m.saril; op.hapsir = m.hap; op.bak = m.bak; op.bakY = m.ucus ? .2 : 0; op.kanatAc = m.durum === 'cik' ? .3 + m.kol * .7 : .6;
  op.egim = m.ucus ? clamp(m.vx / 1600, -.25, .25) * (m.yon || 1) * 0 + clamp(m.vy / 2400, -.12, .12) : 0;
  op.isik = m.durum === 'dans' ? .4 + .6 * yv9FinalNabiz() : 0;
  if (m.durum === 'dans') m.dans *= .985;
  const yy = m.y - sp * 0;
  yavruCiz(g, m.x, yy, s, m.t + o.sira * 1.7, op);
  if (m.durum !== 'cik') yv9FxCiz(m);
}
TUR.kaydet('ejderYavruCiz', {
  guncelle(v) { const m = v.ana.yv; v.x = m.x; v.y = m.y; },
  ciz(v, tm) {
    const o = v.ana, m = o.yv; if (m.durum === 'cik' || m.durum === 'sirt' || (m.durum === 'in' && m.gelT > 0)) return;
    if (typeof cam !== 'undefined' && (m.x < cam.x - 160 || m.x > cam.x + VW + 160)) return;
    yv9YavruCiz(o, tm);
  },
});

// ── Olaylar ──
OLAY.on('binisBasla', () => { YV9.binis = true; YV9.binisBitti = false; });
OLAY.on('binisBitti', () => { YV9.binisBitti = true; YV9.binis = false; });
OLAY.on('ejderFinal', e => { if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 9) return; YV9.final = { o: e && e.o ? e.o : null, box: e && e.box }; YV9.finalT = 0; });
OLAY.on('pirilUfle9', e => { const o = e && e.o; if (o && o.yv && e.asama === 'ver') o.yv.pirilVer = true; });
for (const ad of ['meyveVer', 'kanatCicek', 'kolyePul', 'meyveBitti', 'kanatBitti', 'kolyeBitti', 'pulCicek', 'yavruCikti']) {
  OLAY.on(ad, e => {   // yavrular sevinir (yanlış meyvede sevinmezler)
    if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 9) return;
    if (ad === 'meyveVer' && e && e.dogru === false) return;
    const yeni = ad === 'yavruCikti' && e ? e.o : null;
    for (const o of YV9.yavrular) { const m = o.yv; if (o === yeni || (m.durum !== 'takip')) continue; m.cheerT = Math.max(m.cheerT, ad.endsWith('Bitti') ? 2.4 : 1.1); m.hopT = Math.min(m.hopT, .05 + m.k * .06); }
  });
}
// Feza'nın havada kalma süresi (kısa zıplamalarda yavrular uçmaya kalkmasın) ve final saati (yuva.js ejderFinalAn yoksa)
TUR.kaydet('yv9Saat', {
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    YV9.havaT = P.ground ? 0 : (YV9.havaT || 0) + dt;
    if (YV9.final) YV9.finalT += Math.min(dt, .05);
  },
});
if (typeof NESNELER !== 'undefined' && typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 9) NESNELER.push({ tip: 'yv9Saat', x: -1e6, y: 0, id: 'yv9Saat' });
YV9.havaT = 0;

// ═══════════════════════════════ PUL ÇİÇEĞİ ÇİZİCİ ═══════════════════════════════
// pulCicekCiz(c, x, y, s, t, o) — (x, y) sapın dibi (zemin); s = 1'de sap ≈ 34 birim, açık çiçek ≈ 46 çap (taç ortası y − 34·s).
// o = { pal 0..9 (renk geçişi: 0 lila→nane, 1 nane→altın, 2 altın→gül, 3 gül→lila, 4 gök→lila, 5 lila→altın, 6 nane→gök,
//       7 şeftali→gül, 8 fıstık→nane, 9 gök→altın), acik 0..1 (0 kapalı solgun tomurcuk → 1 tam açık), n yaprak sayısı (5..9),
//       sekil 'pul'|'yildiz'|'kalp' (yaprak biçimi), ic 0..1 (iç sıra yapraklar; 'cift' çiçekler), don (rad, yaprak halkasının dönüşü),
//       boy (sap uzama çarpanı, vars. 1), egim (rad, sapın salınımı), olc (taç ölçeği, vars. 1), yuz 0|1 (ortada minik yüz),
//       uyku 0..1 (tomurcuğun uykulu yüzü; vars. 1 − acik), mutlu 0..1, bak -1..1, parilti 0..1 (yanardöner pırıltı, vars. 1), alfa }
// Yapraklar ejderha pulu gibi: yuvarlak, ucu hafif sivri, ortasında ince sırt, kenarı ışıklı; iki renk sıralı tuval arasında
// karede çapraz geçiş = yanardöner parıltı. Kapalıyken soluk lila-gri, uykulu.
const YV9_PAL = [
  ['#b89cff', '#d9c8ff', '#7fe8c0'], ['#6fd8a8', '#c8f08a', '#ffd27a'], ['#ffd27a', '#ffc29a', '#ff9fc0'], ['#ff9fc0', '#e8b0ff', '#b89cff'],
  ['#7fe0f0', '#b8d0ff', '#c9a8ff'], ['#c9a8ff', '#ffd6e8', '#ffd27a'], ['#8fe8c0', '#a8f0e8', '#7fd0f8'], ['#ffc29a', '#ffb0b8', '#ff8fc0'],
  ['#c8f08a', '#9ae8b0', '#6fd8c8'], ['#9fe0ff', '#e0f0d0', '#ffd27a']];
const YV9_SOLGUN = ['#a9a2b8', '#c4bfcc', '#b5b9b0'];
function yv9YaprakPulYol(q, sekil, L, W) {   // kök (0, 0), uç (0, −L)
  q.beginPath();
  if (sekil === 'yildiz') { q.moveTo(0, 0); q.bezierCurveTo(W * .95, -L * .3, W * .5, -L * .7, 0, -L * 1.1); q.bezierCurveTo(-W * .5, -L * .7, -W * .95, -L * .3, 0, 0); }
  else if (sekil === 'kalp') { q.moveTo(0, 0); q.bezierCurveTo(W * .9, -L * .25, W * .95, -L * 1.05, W * .02, -L * .82); q.lineTo(-W * .02, -L * .82); q.bezierCurveTo(-W * .95, -L * 1.05, -W * .9, -L * .25, 0, 0); }
  else { q.moveTo(0, 0); q.bezierCurveTo(W * .82, -L * .16, W * .78, -L * .78, 0, -L); q.bezierCurveTo(-W * .78, -L * .78, -W * .82, -L * .16, 0, 0); }
  q.closePath();
}
function yv9YaprakSpr(pal, sekil, ters, K) {   // pal: −1 solgun; ters: renk sırası ters (yanardöner ikinci tuval)
  return yv9Tuval('pY' + pal + sekil + (ters ? 't' : ''), K, -9, -19, 18, 20, q => {
    const L = 17, W = 12, P = pal < 0 ? YV9_SOLGUN : YV9_PAL[pal], c0 = ters ? P[2] : P[0], c2 = ters ? P[0] : P[2];
    yv9YaprakPulYol(q, sekil, L, W); q.fillStyle = yv9GL(q, 0, 0, 0, -L, c0, P[1], c2); q.fill();
    q.save(); q.clip();
    q.fillStyle = pal < 0 ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.4)'; q.beginPath(); q.ellipse(-W * .2, -L * .62, W * .18, L * .26, -.2, 0, YV9_PI2); q.fill();
    q.strokeStyle = pal < 0 ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.7)'; q.lineWidth = 1.1; yv9YaprakPulYol(q, sekil, L * .97, W * .9); q.stroke();
    q.restore();
    q.strokeStyle = pal < 0 ? 'rgba(120,110,140,.6)' : 'rgba(255,255,255,.55)'; q.lineWidth = .6; q.beginPath(); q.moveTo(0, -1.5); q.quadraticCurveTo(.6, -L * .5, 0, -L * .86); q.stroke();
    yv9YaprakPulYol(q, sekil, L, W); q.strokeStyle = pal < 0 ? '#7c7590' : mixc(P[0], '#3a2a6a', .55); q.lineWidth = 1.05; q.stroke();
  });
}
function yv9CicekYaprakSpr(solgun, K) {   // sap dibindeki iki geniş yaprak
  return yv9Tuval('pL' + (solgun ? 's' : ''), K, -20, -14, 40, 16, q => {
    const a = solgun ? '#8f9a86' : '#3fbf8a', b = solgun ? '#b2b9a8' : '#8fe0a8', k = solgun ? '#606a5c' : '#2e8f6f';
    for (const sd of [-1, 1]) {
      q.save(); q.scale(sd, 1); yv9YaprakYol(q, 0, -1, 18, 6, -.38); q.fillStyle = yv9GL(q, 0, 0, 16, -6, a, b); q.fill(); q.strokeStyle = k; q.lineWidth = 1; q.stroke();
      q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = .6; q.beginPath(); q.moveTo(2, -1.6); q.quadraticCurveTo(9, -5, 15, -6.6); q.stroke(); q.restore();
    }
  });
}
function yv9OrtaSpr(pal, K) {   // çiçeğin altın ortası (toz noktacıkları)
  return yv9Tuval('pO' + pal, K, -7, -7, 14, 14, q => {
    const P = pal < 0 ? YV9_SOLGUN : YV9_PAL[pal];
    q.beginPath(); q.arc(0, 0, 5.6, 0, YV9_PI2); q.fillStyle = pal < 0 ? yv9GL(q, 0, -5, 0, 5, '#d8d2c6', '#aaa398') : yv9GL(q, 0, -5, 0, 5, '#fff6c8', '#ffd27a', '#f0a850'); q.fill();
    q.strokeStyle = pal < 0 ? '#8a8478' : '#c98a3a'; q.lineWidth = .9; q.stroke();
    q.fillStyle = pal < 0 ? 'rgba(255,255,255,.3)' : P[0]; for (let k = 0; k < 7; k++) { const a = k / 7 * YV9_PI2 + .3; q.beginPath(); q.arc(Math.cos(a) * 3.7, Math.sin(a) * 3.7, .75, 0, YV9_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,.6)'; q.beginPath(); q.ellipse(-1.6, -2.2, 1.6, .9, -.4, 0, YV9_PI2); q.fill();
  });
}
function yv9MiniCicekSpr(pal, K) {   // renk dalgasından sonra dipte açan minik çiçek
  return yv9Tuval('pM' + pal, K, -5, -5, 10, 10, q => {
    const P = YV9_PAL[pal];
    for (let k = 0; k < 5; k++) { const a = k / 5 * YV9_PI2 - Math.PI / 2; q.fillStyle = k % 2 ? P[0] : P[2]; q.beginPath(); q.ellipse(Math.cos(a) * 2.2, Math.sin(a) * 2.2, 2, 1.5, a, 0, YV9_PI2); q.fill(); }
    q.fillStyle = '#fff2b0'; q.beginPath(); q.arc(0, 0, 1.3, 0, YV9_PI2); q.fill();
  });
}
const YV9_PO = {};
function pulCicekCiz(c, x, y, s, t, o) {
  if (!c || !(s > 0) || !Number.isFinite(x) || !Number.isFinite(y)) return;
  o = o || YV9_PO; t = Number.isFinite(t) ? t : 0;
  const pal = Number.isFinite(o.pal) ? ((o.pal | 0) % 10 + 10) % 10 : 0, acik = clamp(o.acik || 0, 0, 1), n = clamp((o.n | 0) || 6, 4, 10), sekil = o.sekil || 'pul';
  const alfa = o.alfa == null ? 1 : clamp(o.alfa, 0, 1); if (alfa <= .01) return;
  const K = yv9K(c, s), boy = o.boy == null ? 1 : o.boy, egim = o.egim || 0, olc = o.olc == null ? 1 : o.olc, par = o.parilti == null ? 1 : o.parilti;
  const uyku = o.uyku == null ? 1 - acik : clamp(o.uyku, 0, 1), ea = smooth(acik);
  const ga = c.globalAlpha; if (alfa < 1) c.globalAlpha = ga * alfa;
  c.save(); c.translate(x, y); c.scale(s, s);
  // dip yaprakları (solgun → yeşil)
  if (ea < .99) yv9Koy(c, yv9CicekYaprakSpr(true, K), 0, 0);
  if (ea > .01) { const a0 = c.globalAlpha; c.globalAlpha = a0 * ea; yv9Koy(c, yv9CicekYaprakSpr(false, K), 0, 0); c.globalAlpha = a0; }
  // sap (kıvrık; uç salınır)
  const H = 34 * boy, hx = Math.sin(egim) * H, hy = -Math.cos(egim) * H;
  c.lineCap = 'round'; c.strokeStyle = ea > .5 ? '#2e7a5a' : '#5e6658'; c.lineWidth = 4.4; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(hx * .2 + 3, hy * .55, hx, hy); c.stroke();
  c.strokeStyle = ea > .5 ? '#5fc48a' : '#8f9886'; c.lineWidth = 2.6; c.stroke();
  // taç
  c.translate(hx, hy); c.rotate(egim * .6); c.scale(olc, olc);
  const isik = ea * (o.isik == null ? 1 : o.isik);
  if (isik > .02) { c.globalCompositeOperation = 'lighter'; yv9Isik(c, YV9_PAL[pal][1], 0, 0, 40, isik * (.3 + .08 * Math.sin(t * 2.4))); yv9Isik(c, '#fff2c8', 0, 0, 16, isik * .35); c.globalCompositeOperation = 'source-over'; }
  const don = o.don || 0, ic = clamp(o.ic || 0, 0, 1);
  yv9TacHalka(c, K, pal, sekil, n, ea, don, t, par, 1, 0);
  if (ic > .01) yv9TacHalka(c, K, pal, sekil, n, smooth(ic) * ea, -don * .6 + Math.PI / n, t + 1.3, par, .62, 1);
  // orta (kapalıyken tomurcuğun içinde görünmez)
  if (ea > .25) { const oa = smooth(clamp((ea - .25) / .5, 0, 1)), sc = .4 + .6 * oa; c.save(); c.globalAlpha *= oa; c.scale(sc, sc); yv9Koy(c, yv9OrtaSpr(pal, K), 0, 0); c.restore(); }
  // minik yüz: tomurcukta uykulu (kapalı gözler), açıkken mutlu
  if (o.yuz !== 0) {
    if (uyku > .3 && ea < .5) {   // tomurcuğun önünde uykulu yüz
      const fy = -6 + ea * 4; c.strokeStyle = '#5c5070'; c.lineWidth = .8;
      c.beginPath(); c.moveTo(-3.4, fy); c.quadraticCurveTo(-2.2, fy + 1.3, -1, fy); c.moveTo(1, fy); c.quadraticCurveTo(2.2, fy + 1.3, 3.4, fy); c.stroke();
      c.fillStyle = 'rgba(255,170,200,.5)'; c.beginPath(); c.ellipse(-3.8, fy + 2.2, 1.3, .7, 0, 0, YV9_PI2); c.ellipse(3.8, fy + 2.2, 1.3, .7, 0, 0, YV9_PI2); c.fill();
    } else if (ea > .55) {
      const fa = smooth(clamp((ea - .55) / .45, 0, 1)), mu = o.mutlu == null ? 1 : o.mutlu, bx = clamp(o.bak || 0, -1, 1) * .9;
      c.globalAlpha *= fa; c.strokeStyle = '#7a4a1a'; c.lineWidth = .7;
      if (mu > .5) { c.beginPath(); c.moveTo(-3 + bx, -.6); c.quadraticCurveTo(-2 + bx, -2.2, -1 + bx, -.6); c.moveTo(1 + bx, -.6); c.quadraticCurveTo(2 + bx, -2.2, 3 + bx, -.6); c.stroke(); }
      else { c.fillStyle = '#4a2a10'; c.beginPath(); c.ellipse(-2 + bx, -1.2, .7, .9, 0, 0, YV9_PI2); c.ellipse(2 + bx, -1.2, .7, .9, 0, 0, YV9_PI2); c.fill(); }
      c.beginPath(); c.moveTo(-1.4 + bx, 1.1); c.quadraticCurveTo(bx, 2.4, 1.4 + bx, 1.1); c.stroke();
      c.fillStyle = 'rgba(255,140,170,.55)'; c.beginPath(); c.ellipse(-3.6 + bx, 1, 1.1, .6, 0, 0, YV9_PI2); c.ellipse(3.6 + bx, 1, 1.1, .6, 0, 0, YV9_PI2); c.fill();
      c.globalAlpha /= fa;
    }
  }
  c.restore();
  if (alfa < 1) c.globalAlpha = ga;
}
// yaprak halkası: kapalıyken yapraklar yukarı toplanmış küçük tomurcuk (solgun), açılırken halkaya dağılır ve renklenir
function yv9TacHalka(c, K, pal, sekil, n, ea, don, t, par, olc, ici) {
  const sA = yv9YaprakSpr(pal, sekil, false, K), sB = yv9YaprakSpr(pal, sekil, true, K), sS = ea < .99 ? yv9YaprakSpr(-1, 'pul', false, K) : null;
  // arkadaki yapraklar önce (yukarı bakanlar arkada)
  for (let p = 0; p < 2; p++) for (let i = 0; i < n; i++) {
    const kapA = -Math.PI / 2 + (i - (n - 1) / 2) * (.42 / Math.max(1, (n - 1) / 2)) * .9, acA = -Math.PI / 2 + i / n * YV9_PI2 + don;
    const a = lerp(kapA, acA, ea), arka = Math.sin(a) < -.15 ? 0 : 1; if (arka !== p) continue;
    const L = lerp(.74, 1, ea) * olc * (1 + .04 * Math.sin(t * 2.1 + i * 1.7) * ea), cx = Math.cos(a) * lerp(1.5, 3.2, ea), cy = Math.sin(a) * lerp(1.5, 3.2, ea) + (1 - ea) * 2;
    c.save(); c.translate(cx, cy); c.rotate(a + Math.PI / 2); c.scale(lerp(.7, 1, ea) * L, L);
    if (sS && ea < .99) { const a0 = c.globalAlpha; c.globalAlpha = a0 * (1 - ea); yv9Koy(c, sS, 0, 0); c.globalAlpha = a0; }
    if (ea > .01) {
      const a0 = c.globalAlpha, sh = .5 + .5 * Math.sin(t * 1.6 + i * 1.1 + ici * 2);
      c.globalAlpha = a0 * ea; yv9Koy(c, sA, 0, 0);
      if (par > .01) { c.globalAlpha = a0 * ea * sh * par * .85; yv9Koy(c, sB, 0, 0); }
      c.globalAlpha = a0;
    }
    c.restore();
  }
}

// ═══════════════════════════════ PUL ÇİÇEĞİ NESNESİ ═══════════════════════════════
// Açılış (o.u, sn): önce açılış biçimine göre küçük bir hazırlık (zıplama, şişip hapşırma, sap uzaması...), sonra yapraklar halkaya
// dağılıp renklenir; açılma anında ışık halkası + pırıltı patlaması, çimenlerde iki yana yayılan renk dalgası (geçtiği yerde
// minik çiçekler açar), ışık tozları yükselir. Sonra: hafifçe nefes alır, Feza'ya bakar, ara sıra pırıldar; dokununca kıkırdayıp sallanır.
const YV9_ACILIS = ['don', 'zipla', 'hapsir', 'pat', 'yavas', 'salla', 'cift', 'esne', 'yildiz', 'kalp'];
const YV9_AC = { don: [.15, 1.2], zipla: [.5, 1.1], hapsir: [.55, .8], pat: [.12, .55], yavas: [.3, 2.1], salla: [.15, 1.4], cift: [.15, 1.6], esne: [.55, 1.2], yildiz: [.15, 1.0], kalp: [.15, 1.2] };
const YV9_MC = [-118, -96, -74, -55, -36, 34, 52, 72, 93, 116];   // minik çiçeklerin yerleri (dibine göre)
function yv9PulAc(o, kaynak) {
  if (o.acik) return false;
  o.acik = true; o.done = true; o.u = 0; o.kaynak = kaynak || 'yakin';
  const v = yv9V(); if (v) v.pul = (v.pul || 0) + 1;
  const n = v ? v.pul : ++YV9.pulN; o.n = n;
  OLAY.emit('pulCicek', { o, n, x: o.x, y: o.y - 34 });
  yv9Sfx('pulAcil', n);
  return true;
}
TUR.kaydet('pulCicek', {
  kur(o) {
    const i = o.sira != null ? o.sira | 0 : YV9.pulSira; YV9.pulSira++;
    o.i = i; o.acik = false; o.u = -1; o.r = o.r || 80; o.ry = o.ry || 30; o.s = o.s || 1.9;
    o.pal = o.pal != null ? o.pal : (i * 3) % 10; o.acilis = YV9_AC[o.acilis] ? o.acilis : YV9_ACILIS[i % 10];
    o.sekil = o.acilis === 'yildiz' ? 'yildiz' : o.acilis === 'kalp' ? 'kalp' : 'pul';
    o.nY = o.acilis === 'yildiz' ? 5 : o.acilis === 'kalp' ? 6 : o.acilis === 'cift' ? 7 : 6 + (i % 3);
    o.pc = { t: (o.x * .011) % 7, davet: 0, tit: 0, sal: 0, salV: 0, kik: 0, bak: 0, toz: 0, opt: { pal: o.pal, acik: 0, n: o.nY, sekil: o.sekil, ic: 0, don: 0, boy: 1, egim: 0, olc: 1, yuz: 1, uyku: 1, mutlu: 1, bak: 0, parilti: 1, isik: 1, alfa: 1 } };
  },
  dokun(o) { if (!P.ucus) yv9PulAc(o, 'yakin'); else o.dokundu = false; },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.pc; m.t += dt; m.kik = Math.max(0, m.kik - dt * 1.2);
    const dx = P.x - o.x, uz = Math.abs(dx);
    // yay gibi salınım (dokununca / açılırken)
    m.salV += (-60 * m.sal - 5 * m.salV) * dt; m.sal += m.salV * dt;
    if (!o.acik) { m.davet = clamp(m.davet + (uz < 380 && DURUM === 'oyun' ? dt : -dt) * 1.2, 0, 1); if (uz < 90 && Math.abs(P.vx) > 60) m.tit = Math.max(m.tit, .5); m.tit = Math.max(0, m.tit - dt * 1.4); return; }
    o.u += dt;
    m.bak += (clamp(dx / 260, -1, 1) - m.bak) * Math.min(1, dt * 3);
  },
  ciz(o, tm) {
    if (!yv9Ekranda(o.x, 180)) return;
    const m = o.pc, op = m.opt, s = o.s, x = o.x, y = o.y, u = o.acik ? o.u : -1, A = YV9_AC[o.acilis], h0 = A[0], h1 = A[1];
    const P0 = YV9_PAL[o.pal];
    // açıklık ve açılış biçimi
    let ac = u < 0 ? 0 : clamp((u - h0) / h1, 0, 1), boy = 1, olc = 1, don = 0, egim = Math.sin(m.t * 1.3 + o.x) * .04 + m.sal, hop = 0, ic = 0;
    if (u < 0) { egim += Math.sin(tm * 17) * .05 * m.tit; olc = 1 + Math.sin(m.t * 1.6) * .03; }   // uykulu nefes
    else switch (o.acilis) {
      case 'don': don = (1 - smooth(ac)) * -YV9_PI2; break;
      case 'zipla': hop = u < h0 ? Math.sin(u / h0 * Math.PI) * 26 : 0; break;
      case 'hapsir': olc = u < h0 ? 1 + smooth(u / h0) * .28 : 1 + .28 * (1 - smooth(clamp((u - h0) / .25, 0, 1))); egim += u < h0 ? -smooth(u / h0) * .2 : 0; break;
      case 'pat': olc = ac < 1 ? lerp(.7, 1.25, smooth(ac)) : 1 + .25 * Math.exp(-(u - h0 - h1) * 6) * Math.cos((u - h0 - h1) * 18); break;
      case 'salla': egim += Math.sin(u * 9) * .22 * Math.max(0, 1 - u / 2.2); break;
      case 'cift': ic = clamp((u - h0 - h1 * .55) / (h1 * .6), 0, 1); ac = clamp((u - h0) / (h1 * .6), 0, 1); break;
      case 'esne': boy = 1 + .35 * Math.sin(clamp(u / (h0 + h1 * .6), 0, 1) * Math.PI); break;
      case 'yavas': don = (1 - smooth(ac)) * .6; break;
      case 'kalp': don = Math.PI / 6 * (1 - smooth(ac)); break;
      default: don = (1 - smooth(ac)) * YV9_PI2 * .5;
    }
    if (o.acilis === 'cift' && u >= 0) ic = Math.max(ic, 0); else if (u >= 0 && o.acilis !== 'cift') ic = 0;
    if (u > 0 && ac >= 1) { olc *= 1 + Math.sin(m.t * 1.9) * .03; don += Math.sin(m.t * .5 + o.i) * .08; }
    if (m.kik > 0) egim += Math.sin(m.kik * 26) * .12 * m.kik;
    const ea = smooth(ac), H = 34 * boy * s, cx = x + Math.sin(egim) * H, cy = y - hop - Math.cos(egim) * H;
    // yerde renk lekesi ve renk dalgası (iki yana yayılır; geçtiği yerde minik çiçekler açar)
    const pk = u >= 0 ? u - h0 - h1 * .4 : -1;
    if (ea > .02) { g.globalCompositeOperation = 'lighter'; yv9IsikE(g, P0[1], x, y - 2, 70 * s, 14 * s, ea * (.26 + .06 * Math.sin(tm * 2 + o.i))); g.globalCompositeOperation = 'source-over'; }
    if (pk > 0) {
      const K = yv9K(g, s);
      for (let k = 0; k < YV9_MC.length; k++) {
        const dxk = YV9_MC[k] * s, gel = clamp((pk - Math.abs(dxk) / 260) / .35, 0, 1); if (gel <= 0) continue;
        const mx = x + dxk, zy = yv9Zemin(mx, y - 10); if (zy == null || Math.abs(zy - y) > 2 * T) continue;
        const e = gel < 1 ? Math.sin(gel * Math.PI * .5) * (1 + .3 * Math.sin(gel * Math.PI)) : 1, sc = (k % 3 ? 1.5 : 1.9) * e * s, mp = (o.pal + k) % 10;
        g.strokeStyle = '#3f9a64'; g.lineWidth = .9 * s; g.beginPath(); g.moveTo(mx, zy); g.lineTo(mx, zy - 5 * sc); g.stroke();
        const sp = yv9MiniCicekSpr(mp, K); g.save(); g.translate(mx, zy - 5 * sc); g.scale(sc, sc); g.rotate(Math.sin(tm * 1.4 + k) * .2); yv9Koy(g, sp, 0, 0); g.restore();
      }
      if (pk < 1.6) {   // dalga cephesi: zeminde iki yana kayan ışık
        const e = pk / 1.6, r = e * 300 * s, a = (1 - e);
        g.globalCompositeOperation = 'lighter';
        for (const sd of [-1, 1]) { const zx = x + sd * r, zy = yv9Zemin(zx, y - 10); if (zy == null) continue; yv9IsikE(g, P0[sd > 0 ? 2 : 0], zx, zy - 3, 40 * s, 10 * s, a * .7); yv9IsikE(g, '#fff2c8', zx, zy - 2, 16 * s, 5 * s, a * .5); }
        g.globalAlpha = a * .5; g.strokeStyle = P0[1]; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y - 2, r, 6 + e * 10, 0, 0, YV9_PI2); g.stroke(); g.globalAlpha = 1;
        g.globalCompositeOperation = 'source-over';
      }
    }
    // gölge
    g.fillStyle = 'rgba(25,50,35,.2)'; g.beginPath(); g.ellipse(x, y, 16 * s * (1 - clamp(hop / 60, 0, .5)), 3 * s, 0, 0, YV9_PI2); g.fill();
    op.acik = ac; op.ic = o.acilis === 'cift' ? ic : 0; op.n = o.nY; op.don = don; op.boy = boy; op.egim = egim; op.olc = olc; op.uyku = o.acik ? 1 - ea : 1;
    op.mutlu = m.kik > 0 || (u > 0 && u < h0 + h1 + 1.2) ? 1 : (Math.sin(m.t * .37 + o.i) > .6 ? 0 : 1); op.bak = m.bak;
    pulCicekCiz(g, x, y - hop, s, m.t, op);
    // davet: uyuyan tomurcuğun içinde ılık ışık nefes alır
    if (!o.acik) {
      if (m.davet > .02) { const nn = .5 + .5 * Math.sin(tm * 2.3 + o.x); g.globalCompositeOperation = 'lighter'; yv9Isik(g, P0[1], cx, cy - 3 * s, 22 * s, m.davet * (.18 + .24 * nn)); yv9Isik(g, '#fff2c8', cx, cy - 4 * s, 8 * s, m.davet * .3 * nn); g.globalCompositeOperation = 'source-over'; }
      return;
    }
    const isl = yv9Isilti();
    g.globalCompositeOperation = 'lighter';
    // açılma anı: ışık halkası + pırıltı patlaması
    const ua = u - h0 - h1 * .5;
    if (ua >= 0 && ua < 1.3) {
      const e = 1 - Math.pow(1 - ua / 1.3, 2.4), a = 1 - ua / 1.3;
      g.globalAlpha = a * .75; g.strokeStyle = P0[2]; g.lineWidth = 3 * a + 1; g.beginPath(); g.arc(cx, cy, 14 + e * 70 * s, 0, YV9_PI2); g.stroke();
      g.strokeStyle = P0[0]; g.lineWidth = 1.6; g.beginPath(); g.arc(cx, cy, 8 + e * 46 * s, 0, YV9_PI2); g.stroke(); g.globalAlpha = 1;
      if (ua < .3) yv9Isik(g, '#fff6d8', cx, cy, 70 * s, (1 - ua / .3) * .55);
      for (let k = 0; k < 10; k++) { const an = k / 10 * YV9_PI2 + o.i, rr = 8 + e * (40 + (k % 3) * 14) * s, px = cx + Math.cos(an) * rr, py = cy + Math.sin(an) * rr + e * e * 14, r = (k % 2 ? 4 : 6) * (1 - e * .5); yv9Isik(g, P0[k % 3], px, py, 10, a * .5); g.globalAlpha = a * .95; g.drawImage(isl, px - r, py - r, r * 2, r * 2); g.globalAlpha = 1; }
    }
    // hapşıran çiçek: tozlu "hapşu" bulutu; kalp çiçek: süzülen kalpler
    if (o.acilis === 'hapsir' && u >= h0 && u < h0 + 1.4) { const v = (u - h0) / 1.4; for (let k = 0; k < 9; k++) { const an = -Math.PI / 2 + (k - 4) * .32, r = 10 + v * (50 + k % 3 * 12) * s; yv9Isik(g, k % 2 ? '#fff2a8' : P0[k % 3], cx + Math.cos(an) * r, cy + Math.sin(an) * r * .8 - v * 10, 9 + v * 6, (1 - v) * .55); } }
    g.globalCompositeOperation = 'source-over';
    if (o.acilis === 'kalp' && u > h0 + h1 * .6 && u < h0 + h1 + 2.4) { const v0 = u - h0 - h1 * .6; for (let k = 0; k < 3; k++) { const v = (v0 - k * .45) / 1.6; if (v <= 0 || v >= 1) continue; const px = cx + Math.sin(v * 6 + k * 2) * 10 + (k - 1) * 14, py = cy - 10 - v * 46, r = 4.5 + v * 2; g.globalAlpha = Math.sin(v * Math.PI); g.drawImage(yv9KalpSpr('#ff8fc8'), px - r, py - r, r * 2, r * 2); } g.globalAlpha = 1; }
    // yükselen ışık tozları (açılınca bir bölük, sonra sürekli üç tane)
    g.globalCompositeOperation = 'lighter';
    const yk = ea > .3 ? 1 : 0;
    if (yk && yv9Ekranda(x, 100)) {
      const nT = u < 3.5 ? 9 : 3;
      for (let k = 0; k < nT; k++) {
        const per = 2.6 + (k % 3) * .5, v = ((tm + k * .37 + o.i * .21) % per) / per, px = cx + Math.sin(v * 5 + k * 1.9) * (10 + k % 4 * 6) * s + (k - nT / 2) * 3, py = cy - v * 90 * s, a = Math.sin(v * Math.PI) * (u < 3.5 ? 1 : .6);
        yv9Isik(g, P0[k % 3], px, py, 8, a * .45); g.globalAlpha = a * .85; g.drawImage(isl, px - 2.6, py - 2.6, 5.2, 5.2); g.globalAlpha = 1;
      }
    }
    g.globalCompositeOperation = 'source-over';
  },
});

// ═══════════════════════════════ DEKOR DOSTLAR ═══════════════════════════════
// yosun tavşancığı: yaprak kulaklı, yosun yeşili pofuduk top (≈ 26 birim). Taşının yanında oturur, burnu kıpırdar, kulağını oynatır;
// Feza yaklaşınca kulaklarını dikip hoplar, birkaç adım peşinden gelir, sonra taşına döner. Dokununca sevinç hopu + kalp.
// pofuduk kuşçuk: yuvarlak pastel kuş (≈ 20 birim), yosunlu taşın üstünde tüner, başını yana eğer, gagasını açıp "cik"ler;
// Feza geçince havalanıp başının üstünde bir tur süzülür ve yerine konar. Dokununca da uçar.
const YV9_YOS = { g: '#7fcf7a', ac: '#bdeea0', k: '#4fa060', cz: '#2f6a3c', kr: '#e8f8c8', kul: '#5fbf7a', kulA: '#a8e89a', burun: '#ff9fbf' };
const YV9_KUS = [{ g: '#ffc29a', ac: '#ffe2cc', k: '#ef9a6a', cz: '#9a5534', kr: '#fff4e2', tepe: '#ff9fc0' }, { g: '#9fdcf8', ac: '#d6f2ff', k: '#6fb8e0', cz: '#336f99', kr: '#fffbe8', tepe: '#ffd27a' }, { g: '#d9c8ff', ac: '#f0e9ff', k: '#a98fea', cz: '#5a3d9e', kr: '#fffbea', tepe: '#7fe0b0' }];
function yv9TasSpr(K, w) {   // yosunlu yuvarlak taş (taban ortası (0, 0))
  return yv9Tuval('tas' + w, K, -w - 3, -w * .9 - 3, w * 2 + 6, w * .9 + 5, q => {
    q.beginPath(); q.ellipse(0, -w * .38, w, w * .44, 0, Math.PI, 0); q.lineTo(w, 0); q.lineTo(-w, 0); q.closePath();
    q.fillStyle = yv9GL(q, 0, -w * .8, 0, 0, '#b8b4c8', '#8f8aa4', '#757090'); q.fill(); q.strokeStyle = '#5a5470'; q.lineWidth = 1.2; q.stroke();
    q.save(); q.clip(); q.fillStyle = '#6fbf6a'; q.beginPath(); q.ellipse(-w * .1, -w * .8, w * .9, w * .3, -.1, 0, YV9_PI2); q.fill();
    q.fillStyle = '#9ad98a'; for (let i = 0; i < 6; i++) { q.beginPath(); q.arc(-w * .7 + i * w * .28, -w * .62 + (i % 2) * 2, 2.4, 0, YV9_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,.25)'; q.beginPath(); q.ellipse(w * .35, -w * .4, w * .2, w * .08, -.3, 0, YV9_PI2); q.fill(); q.restore();
    for (const [x, col] of [[-w * .55, '#ffd27a'], [w * .2, '#ff9fc0']]) { q.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k / 5 * YV9_PI2; q.beginPath(); q.arc(x + Math.cos(a) * 1.5, -w * .78 + Math.sin(a) * 1.5, 1.3, 0, YV9_PI2); q.fill(); } q.fillStyle = '#fff6c8'; q.beginPath(); q.arc(x, -w * .78, 1, 0, YV9_PI2); q.fill(); }
  });
}
function yv9YosunGovdeSpr(K) {   // taban ortası (0, 0); r ≈ 11 pofuduk top + kuyruk ponponu
  return yv9Tuval('yosG', K, -15, -24, 30, 25, q => {
    const C = YV9_YOS;
    q.fillStyle = C.ac; q.strokeStyle = C.cz; q.lineWidth = 1.3; q.beginPath(); q.arc(-11, -6, 3.6, 0, YV9_PI2); q.fill(); q.stroke();
    const arr = []; for (let i = 0; i < 14; i++) { const a = i / 14 * YV9_PI2; arr.push(Math.cos(a) * 10, -10.5 + Math.sin(a) * 9.6, 2.6); }
    arr.push(0, -10.5, 9.6); yv9Blob(q, arr, C.g, C.cz, 2.6);
    q.fillStyle = C.kr; q.beginPath(); q.ellipse(2.4, -8, 5.6, 5.4, 0, 0, YV9_PI2); q.fill();
    q.fillStyle = 'rgba(255,255,255,.35)'; q.beginPath(); q.ellipse(-3, -16.4, 3.6, 1.6, -.3, 0, YV9_PI2); q.fill();
    q.fillStyle = C.k; q.beginPath(); q.ellipse(-4, -.8, 3.4, 1.8, 0, 0, YV9_PI2); q.ellipse(5, -.8, 3.4, 1.8, 0, 0, YV9_PI2); q.fill();
    // başta minik çiçek
    q.fillStyle = '#ffd6ee'; for (let k = 0; k < 5; k++) { const a = k / 5 * YV9_PI2; q.beginPath(); q.arc(4 + Math.cos(a) * 1.7, -19.6 + Math.sin(a) * 1.7, 1.5, 0, YV9_PI2); q.fill(); }
    q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(4, -19.6, 1.1, 0, YV9_PI2); q.fill();
  });
}
function yv9YosunKulakSpr(K) {   // kök (0, 0), yukarı uzanan yaprak kulak
  return yv9Tuval('yosK', K, -5, -17, 10, 18, q => {
    const C = YV9_YOS; yv9YaprakYol(q, 0, 0, 15.5, 4.4, -Math.PI / 2); q.fillStyle = yv9GL(q, 0, 0, 0, -15, C.kul, C.kulA); q.fill(); q.strokeStyle = C.cz; q.lineWidth = 1; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,.5)'; q.lineWidth = .6; q.beginPath(); q.moveTo(0, -1); q.lineTo(0, -12.5); q.stroke();
  });
}
function yv9YosunCiz(c, x, y, s, t, o) {   // o: { yon, mutlu, kulak 0..1 (dik), zip, kirp, burun }
  const K = yv9K(c, s), yon = o.yon < 0 ? -1 : 1, z = clamp(o.zip || 0, -1, 1), kl = clamp(o.kulak || 0, 0, 1);
  c.save(); c.translate(x, y); c.scale(s * yon * (1 - z * .08), s * (1 + z * .1));
  for (const sd of [-1, 1]) {   // kulaklar (arka biraz geride)
    const a = sd * lerp(.75, .22, kl) - .15 + Math.sin(t * 2.3 + sd) * .06 + (o.kulakOyna || 0) * Math.sin(t * 18) * .2 * (sd > 0 ? 1 : 0);
    c.save(); c.translate(sd * 4 + 1, -18.5); c.rotate(a); if (sd < 0) c.globalAlpha *= .92; yv9Koy(c, yv9YosunKulakSpr(K), 0, 0); c.restore();
  }
  yv9Koy(c, yv9YosunGovdeSpr(K), 0, 0);
  const mu = clamp(o.mutlu || 0, 0, 1), kp = o.kirp || 0, gz = yv9GozSpr('nane', YV9_RENK.nane, K);
  for (let i = 0; i < 2; i++) {
    const ex = i ? -1.6 : 5.4, ey = -12.6;
    if (mu > .7 || kp > .6) { c.strokeStyle = '#21162f'; c.lineWidth = 1; c.beginPath(); c.moveTo(ex - 2.2, ey + .8); c.quadraticCurveTo(ex, ey - (mu > .7 ? 2.4 : -1.6), ex + 2.2, ey + .8); c.stroke(); }
    else { c.save(); c.translate(ex, ey); c.scale(.62, .62); yv9Koy(c, gz, 0, 0); c.restore(); }
  }
  const bz = Math.sin(t * (o.burun ? 22 : 3)) * .4;
  c.fillStyle = YV9_YOS.burun; c.beginPath(); c.ellipse(8.4, -9.4 + bz * .3, 1.4, 1, 0, 0, YV9_PI2); c.fill();
  c.strokeStyle = '#21162f'; c.lineWidth = .7; c.beginPath(); c.moveTo(6.2, -7.6); c.quadraticCurveTo(7.4, -6.4 - mu, 8.8, -7.6); c.stroke();
  c.fillStyle = YV9_YANAK; c.globalAlpha *= .5; c.beginPath(); c.ellipse(8.4, -7.6, 1.8, 1, 0, 0, YV9_PI2); c.ellipse(-4.4, -8.6, 1.6, .9, 0, 0, YV9_PI2); c.fill();
  c.restore();
}
function yv9KusGovdeSpr(i, K) {   // gövde merkezi (0, 0); r ≈ 8,5 yuvarlak kuş (kanatsız, kuyruk + tepe tüyü dahil)
  return yv9Tuval('kusG' + i, K, -15, -16, 28, 26, q => {
    const C = YV9_KUS[i];
    q.fillStyle = C.k; q.strokeStyle = C.cz; q.lineWidth = 1.1;
    for (const a of [-.25, .15]) { q.save(); q.translate(-7, 1); q.rotate(Math.PI + a); yv9YaprakYol(q, 0, 0, 8, 2.4, 0); q.fill(); q.stroke(); q.restore(); }
    q.fillStyle = C.tepe; for (const a of [-1.9, -1.5, -1.15]) { q.save(); q.translate(1, -7.6); q.rotate(a); yv9YaprakYol(q, 0, 0, 6, 1.8, 0); q.fill(); q.stroke(); q.restore(); }
    q.beginPath(); q.arc(0, 0, 8.6, 0, YV9_PI2); q.fillStyle = yv9GL(q, 3, -8, -4, 7, C.ac, C.g, C.k); q.fill(); q.strokeStyle = C.cz; q.lineWidth = 1.4; q.stroke();
    q.fillStyle = C.kr; q.beginPath(); q.ellipse(2.4, 3, 5, 4.6, -.2, 0, YV9_PI2); q.fill();
    q.fillStyle = 'rgba(255,255,255,.4)'; q.beginPath(); q.ellipse(-2.4, -5.6, 3, 1.3, -.4, 0, YV9_PI2); q.fill();
  });
}
function yv9KanatcikSpr(i, K) { return yv9Tuval('kusK' + i, K, -2, -6, 12, 8, q => { const C = YV9_KUS[i]; yv9YaprakYol(q, 0, -1, 9.5, 3.4, .25); q.fillStyle = C.k; q.fill(); q.strokeStyle = C.cz; q.lineWidth = 1; q.stroke(); }); }
function yv9KusCiz(c, x, y, s, t, o) {   // (x, y) ayakların altı; o: { renk 0..2, yon, ucus, kanat (faz hızı), agiz 0..1, egim, mutlu, kirp }
  const K = yv9K(c, s), i = (o.renk | 0) % 3, C = YV9_KUS[i], yon = o.yon < 0 ? -1 : 1, uc = !!o.ucus;
  c.save(); c.translate(x, y); c.scale(s * yon, s); c.translate(0, -11); if (o.egim) c.rotate(o.egim);
  if (!uc) { c.strokeStyle = '#e08a4a'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(-2, 7.5); c.lineTo(-2.4, 11); c.moveTo(2, 7.5); c.lineTo(2.2, 11); c.stroke(); }
  const kf = uc ? Math.sin(t * 26) : Math.sin(t * 3) * .08;
  c.save(); c.translate(-2, -1); c.rotate(-.5 - kf * .9); c.globalAlpha *= .85; yv9Koy(c, yv9KanatcikSpr(i, K), 0, 0); c.restore();
  yv9Koy(c, yv9KusGovdeSpr(i, K), 0, 0);
  c.save(); c.translate(-3, 0); c.rotate(.3 + (uc ? -kf * 1.1 - .4 : kf)); c.scale(1, 1); yv9Koy(c, yv9KanatcikSpr(i, K), 0, 0); c.restore();
  // gaga (yuvarlak uçlu, turuncu) + göz + yanak
  const ag = clamp(o.agiz || 0, 0, 1);
  c.fillStyle = '#ffb060'; c.strokeStyle = '#b8642a'; c.lineWidth = .8;
  c.beginPath(); c.moveTo(7.6, -1.6 - ag * .6); c.quadraticCurveTo(11.8, -1 - ag * .8, 8, .2 - ag * .2); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(7.6, .4 + ag * .4); c.quadraticCurveTo(10.6, 1 + ag * 1.4, 7.8, 1.8 + ag * 1.2); c.closePath(); c.fill(); c.stroke();
  if ((o.mutlu || 0) > .7 || (o.kirp || 0) > .6) { c.strokeStyle = '#21162f'; c.lineWidth = .9; c.beginPath(); c.moveTo(2.2, -2.6); c.quadraticCurveTo(4, -4.6, 5.8, -2.6); c.stroke(); }
  else { c.save(); c.translate(4, -3); c.scale(.5, .5); yv9Koy(c, yv9GozSpr('gok', YV9_RENK.gok, K), 0, 0); c.restore(); }
  c.fillStyle = YV9_YANAK; c.globalAlpha *= .55; c.beginPath(); c.ellipse(5.4, 1.4, 1.6, .9, 0, 0, YV9_PI2); c.fill();
  c.restore();
}
TUR.kaydet('ejderDost', {
  kur(o) {
    o.tur = o.tur === 'kus' ? 'kus' : 'yosun'; o.r = 0; o.s = o.s || (o.tur === 'kus' ? 1.4 : 1.4);
    const i = YV9.dostlar.length; YV9.dostlar.push(o);
    o.ds = { t: (o.x * .019) % 9, i, ev: o.x + (o.tur === 'kus' ? 0 : 34), x: o.x + (o.tur === 'kus' ? 0 : 34), y: o.y, yon: i % 2 ? -1 : 1, zip: 0, hop: 0, hopV: 0, mut: 0, kulak: 0, kirpT: 1 + i * .7, kirp: 0,
      durum: 'otur', u: 0, sogu: 0, agiz: 0, cikT: 2 + i, uc: { x0: 0, y0: 0, a: 0 }, burun: 0, fx: [0, 1, 2].map(() => ({ t: -1, tip: '', x: 0, y: 0, x1: 0, y1: 0, max: 1, r: 0 })),
      opt: { yon: 1, mutlu: 0, kulak: 0, zip: 0, kirp: 0, burun: 0, kulakOyna: 0, renk: i % 3, ucus: 0, agiz: 0, egim: 0 } };
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.ds; m.t += dt; m.sogu = Math.max(0, m.sogu - dt); m.mut = Math.max(0, m.mut - dt * .4); m.sev = Math.max(0, (m.sev || 0) - dt);
    for (const f of m.fx) if (f.t >= 0) { f.t += dt; if (f.t > f.max) f.t = -1; }
    m.kirpT -= dt; if (m.kirpT <= 0) { m.kirpT = 2.4 + Math.random() * 3; m.kirp = .17; } m.kirp = Math.max(0, m.kirp - dt);
    if (m.hop > 0 || m.hopV > 0) { m.hopV -= 1500 * dt; m.hop += m.hopV * dt; if (m.hop <= 0) { m.hop = 0; m.hopV = 0; m.zip = -.5; } }
    m.zip *= Math.max(0, 1 - dt * 7);
    const dx = P.x - m.x, uz = Math.abs(dx), yak = uz < 230 && Math.abs(P.y - o.y) < 160 && DURUM === 'oyun' && !P.ucus;
    if (o.tur === 'yosun') {
      m.kulak += ((yak ? 1 : 0) - m.kulak) * Math.min(1, dt * 4); m.burun = yak ? 1 : 0;
      if (yak) { m.mut = Math.max(m.mut, .6); if (Math.abs(dx) > 10) m.yon = dx > 0 ? 1 : -1; }
      // Feza'nın peşinden birkaç hop (evinden en çok 150), uzaklaşınca evine hop hop döner
      let hx = m.ev; if (yak && uz > 60) hx = clamp(P.x - Math.sign(dx) * 50, m.ev - 150, m.ev + 150);
      if (m.hop <= 0 && Math.abs(hx - m.x) > 8) { m.hopV = 260; m.hop = .01; m.vx = clamp(hx - m.x, -60, 60) / .35; m.yon = hx > m.x ? 1 : -1; }
      if (m.hop > 0) m.x += (m.vx || 0) * dt;
      if (yak && m.hop <= 0 && Math.random() < dt * .8) { m.hopV = 200; m.hop = .01; m.vx = 0; }
      const zy = yv9Zemin(m.x, o.y - 10); if (zy != null && Math.abs(zy - o.y) < 2 * T) m.y = zy;
    } else {
      if (m.durum === 'otur') {
        m.cikT -= dt; if (m.cikT <= 0) { m.cikT = 2 + Math.random() * 3; m.agiz = 1; }
        if (Math.abs(dx) > 10 && yak) m.yon = dx > 0 ? 1 : -1;
        if (uz < 150 && yak && m.sogu <= 0) yv9KusUc(o, m);
      } else {   // tur: Feza'nın başının üstünde bir çember, sonra taşına konar
        m.u += dt / 3; const u = Math.min(1, m.u), cx = lerp(m.uc.x0, P.x, smooth(Math.min(1, u * 3))), cy = Math.min(P.y, o.y) - 110;
        const a = m.uc.a + u * YV9_PI2 * m.yonT, b = smooth(clamp(u / .2, 0, 1)) * (1 - smooth(clamp((u - .8) / .2, 0, 1)));
        const nx = lerp(o.x, cx + Math.cos(a) * 70, b), ny = lerp(o.y - yv9KusTasH(o), cy + Math.sin(a) * 28, b);
        if (dt > 0) { const vx = (nx - m.x) / dt; if (Math.abs(vx) > 20) m.yon = vx > 0 ? 1 : -1; }
        m.x = nx; m.y = ny; m.mut = 1;
        if (m.u >= 1) { m.durum = 'otur'; m.x = o.x; m.y = o.y - yv9KusTasH(o); m.sogu = 6; }
      }
      if (m.durum === 'otur') { m.x = o.x; m.y = o.y - yv9KusTasH(o); }
      m.agiz = Math.max(0, m.agiz - dt * 4);
    }
  },
  ciz(o, tm) {
    const m = o.ds, s = o.s; if (!yv9Ekranda(m.x, 200)) return;
    const K = yv9K(g, 1), op = m.opt;
    if (o.tur === 'yosun') {
      yv9Koy(g, yv9TasSpr(K, 28), o.x - 8, o.y + 1);
      const hv = clamp(m.hop / 50, 0, .6); g.fillStyle = 'rgba(25,50,35,.22)'; g.beginPath(); g.ellipse(m.x, m.y, 12 * s * (1 - hv * .4), 2.6 * s, 0, 0, YV9_PI2); g.fill();
      op.yon = m.yon; op.mutlu = m.mut > .5 && (m.hop > 0 || m.sev > 0) ? 1 : m.mut * .6; op.kulak = m.kulak; op.zip = m.hop > 0 ? clamp(m.hopV / 600, -.3, .4) : m.zip; op.kirp = m.kirp > 0 ? 1 : 0; op.burun = m.burun; op.kulakOyna = m.sev > 0 ? 1 : 0;
      yv9YosunCiz(g, m.x, m.y - m.hop, s, m.t, op);
    } else {
      yv9Koy(g, yv9TasSpr(K, 19), o.x, o.y + 1);
      op.yon = m.yon; op.ucus = m.durum === 'tur' ? 1 : 0; op.agiz = m.agiz; op.mutlu = m.durum === 'tur' ? 1 : m.mut; op.kirp = m.kirp > 0 ? 1 : 0;
      op.egim = m.durum === 'tur' ? 0 : Math.sin(m.t * 1.7 + m.i) * .12 + (m.agiz > .2 ? -.1 : 0);
      yv9KusCiz(g, m.x, m.y + (m.durum === 'tur' ? Math.sin(m.t * 9) * 2 : 0), s, m.t, op);
    }
    yv9FxCiz(m);
  },
});
function yv9KusTasH(o) { return 16; }
function yv9KusUc(o, m) { m.durum = 'tur'; m.u = 0; m.uc.x0 = o.x; m.uc.a = Math.atan2(-1, 0) + Math.PI; m.yonT = P.x > o.x ? 1 : -1; m.agiz = 1; }
function yv9DostSev(o) {
  const m = o.ds;
  if (o.tur === 'kus') { if (m.durum === 'otur') yv9KusUc(o, m); return; }
  if (m.hop <= 0) { m.hopV = 330; m.hop = .01; m.vx = 0; } m.mut = 1; m.sev = 1.2; yv9Fx(m, 'kalp', m.x + m.yon * 6, m.y - 30, 1.6);
}
// Dekor dostlar haritada yoksa (bolum9.js koymadıysa) sözleşmedeki boş yerlere birkaç tane koy
(function yv9DostYerlestir() {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 9 || typeof NESNELER === 'undefined' || typeof nesne !== 'function' || typeof yuzey !== 'function') return;
  if (NESNELER.some(n => n.tip === 'ejderDost')) return;
  for (const [c, tur] of [[100, 'yosun'], [135, 'kus'], [196, 'yosun'], [318, 'yosun'], [372, 'kus'], [432, 'kus'], [545, 'yosun'], [828, 'yosun']]) nesne('ejderDost', c, yuzey(c), { tur });
})();

// ═══════════════════════════════ dokunma (tomurcuk, yumurta, yavru, dostlar) ═══════════════════════════════
// Kapalı tomurcuğa dokunmak onu açar; üşümüş yumurtaya (Feza yakınken) dokunmak sarılmayı başlatır: bu dokunuşlar yürüme kontrolüne
// gitmez. Yavruya ya da dostlara dokunmak yalnız sevimli bir tepki verir, yürümeyi engellemez.
function yv9DokunBul(wx, wy) {
  let en = null, best = 1, tur = '';
  for (const o of NESNELER) {
    if (o.tip === 'pulCicek') {
      if (Math.abs(o.x - P.x) > 900) continue;
      const cy = o.y - 34 * o.s, d = ((wx - o.x) / (30 * o.s)) ** 2 + ((wy - cy) / (36 * o.s)) ** 2;
      if (d < best) { best = d; en = o; tur = 'pul'; }
    } else if (o.tip === 'ejderYumurta' && o.yv) {
      const m = o.yv;
      if (m.durum === 'usu') { const d = ((wx - o.x) / 38) ** 2 + ((wy - (o.y - 28)) / 40) ** 2; if (d < best) { best = d; en = o; tur = 'yum'; } }
      else if (m.durum === 'takip' || m.durum === 'sevin') { const d = ((wx - m.x) / 30) ** 2 + ((wy - (m.y - 24)) / 32) ** 2; if (d < best) { best = d; en = o; tur = 'yavru'; } }
    } else if (o.tip === 'ejderDost' && o.ds) {
      const m = o.ds, d = ((wx - m.x) / 26) ** 2 + ((wy - (m.y - (o.tur === 'kus' ? 12 : 12))) / 24) ** 2;
      if (d < best) { best = d; en = o; tur = 'dost'; }
    }
  }
  return en ? { o: en, tur } : null;
}
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 9 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0 || P.kilit > .05) return;
  if (yv9Final() || (typeof om9MiniAktif === 'function' && om9MiniAktif())) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  const b = yv9DokunBul(wx, wy); if (!b) return;
  const o = b.o;
  if (b.tur === 'pul' && o.acik) { o.pc.kik = 1; o.pc.salV += (Math.random() < .5 ? -1 : 1) * 6; burst(o.x, o.y - 34 * o.s, 8, YV9_PAL[o.pal], 90, .7, 5); return; }   // açık çiçek: kıkırdayıp sallanır
  if (b.tur === 'yavru') { const m = o.yv; if (m.tapT <= 0) { m.tapT = 1.2; m.cheerT = 1.2; m.hopT = 0; m.agiz = .9; yv9Fx(m, 'kalp', m.x, m.y - 46, 1.6); yv9Sfx('yavruCik2', o.sira); } return; }
  if (b.tur === 'dost') { yv9DostSev(o); return; }
  if (b.tur === 'yum' && (Math.abs(o.x - P.x) > 200 || !P.ground)) return;   // uzaktaki yumurta: yürüme kontrolü (Feza oraya yürür)
  e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
  if (b.tur === 'pul') yv9PulAc(o, 'dokunus'); else yv9IsitBasla(o);
}, true);
