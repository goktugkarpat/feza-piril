/* pelerin11.js — Bölüm 11 pelerin seçimi (KARAKTER). Sözleşme: src/BOLUM11.md. Önek: pl11.
   Nesne 'pelerinSec' (bolum11.js, sütun 14): ilk ekranda havada, hafif bir yay üstünde dört sihirli baloncuk süzülür; her birinin içinde
   arkadan görülen, kanat gibi yavaşça açılıp kapanan minik bir pelerin (feza.js fezaPelerinIkon): MOR (altın yıldız işlemeli), GECE
   MAVİSİ (gümüş ay işlemeli), ÇİLEK KIRMIZISI (pembe astarlı, kalp tokalı), PEMBE-LİLA (gümüş yıldız tozlu). Baloncuklar Feza'nın başının
   biraz üstünde: zıplayınca içine girilir (yürürken başı değerse de olur); ekranda baloncuğa (cömert alan) dokununca baloncuk Feza'ya
   süzülür. Baloncuk Feza'ya varınca parıltılı "puf" (AU.sfx 'pelerinPuf'), V11.pelerin = ad, OLAY 'pelerinSec' {ad, o}; feza.js pelerini
   geri esneyerek büyütüp giydirir, Feza kollarını açıp bir tur döner (pelerin kanat gibi açılıp kapanır, AU.sfx 'pelerinAc') ve önden
   "ta-da" yapar. Öteki baloncuklar yukarı süzülüp birer birer yumuşakça patlar. Hiç seçilmezse (Feza ~30. sütunu geçerse ya da Pırıl'ın
   "Birine dokun!" sözünden ~15 sn sonra; söz yoksa baloncuklar belirdikten 24 sn sonra) Feza'ya en yakın baloncuk süzülüp giydirir.
   Baloncuklar belirince OLAY 'pelerinGoster' {o} (piril.js ışıltıyla gösterir). Dışa açık: PELERIN11 = { o, aktif, ad }.
   Performans: baloncuk kabuğu ölçeğe göre bir kez çizilir; içindeki pelerin 8 kanat karesi olarak önbelleğe alınır (ölçek değişince
   kareye bir tane yeniden çizilir). Karede: 4 kabuk + 4 pelerin drawImage + birkaç minik parıltı yolu. */
'use strict';
const PL11_ADLAR = ['mor', 'lacivert', 'kirmizi', 'pembe'];
const PL11_RENK = { mor: ['#b58cf0', '#ffd76a'], lacivert: ['#8fa8ff', '#e4eeff'], kirmizi: ['#ff86a6', '#ffd0e2'], pembe: ['#e2c2ff', '#ffffff'] };
const PL11_DX = [-168, -56, 56, 168], PL11_DY = [-118, -150, -150, -118], PL11_R = 32, PL11_KARE = 8;
const PELERIN11 = { o: null, aktif: false, ad: null };
const pl11Kabuk = {};   // ad → { c, s }
const pl11Ikon = {};    // ad → { s, k: [tuval × PL11_KARE], hazir: [bool] }
let pl11SozBitT = -1;   // Pırıl'ın "Birine dokun!" sözünün bittiği an (now)

function pl11V() { return typeof V11 !== 'undefined' && V11 ? V11 : null; }
function pl11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function pl11Kabugu(ad, s) {   // baloncuk kabuğu (ölçekli önbellek): içi hafif renkli, yanardöner kenar, parlak yay, minik parlak nokta
  const st = Math.max(0.5, Math.round(s * 8) / 8);
  let k = pl11Kabuk[ad];
  if (k && k.s === st) return k;
  if (!k) k = pl11Kabuk[ad] = { c: document.createElement('canvas'), s: 0 };
  const R = PL11_R, p = Math.ceil((R + 6) * 2 * st), c = k.c; c.width = c.height = p; k.s = st;
  const x = c.getContext('2d'), m = p / 2, col = PL11_RENK[ad];
  x.setTransform(st, 0, 0, st, m, m);
  const ig = x.createRadialGradient(-R * 0.25, -R * 0.3, R * 0.1, 0, 0, R);
  ig.addColorStop(0, 'rgba(255,255,255,0.10)'); ig.addColorStop(0.62, 'rgba(255,255,255,0.05)'); ig.addColorStop(0.9, col[0] + '55'); ig.addColorStop(1, col[0] + 'aa');
  x.fillStyle = ig; x.beginPath(); x.arc(0, 0, R, 0, 6.2832); x.fill();
  const rg = x.createLinearGradient(-R, -R, R, R);
  rg.addColorStop(0, 'rgba(255,170,220,0.95)'); rg.addColorStop(0.35, 'rgba(207,230,255,0.9)'); rg.addColorStop(0.7, 'rgba(200,180,255,0.95)'); rg.addColorStop(1, 'rgba(255,230,170,0.9)');
  x.strokeStyle = rg; x.lineWidth = 2.2; x.beginPath(); x.arc(0, 0, R - 1.1, 0, 6.2832); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 2.6; x.lineCap = 'round'; x.beginPath(); x.arc(0, 0, R - 5.5, 3.55, 4.45); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 1.4; x.beginPath(); x.arc(0, 0, R - 4.5, 0.45, 1.05); x.stroke();
  x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.arc(-R * 0.34, -R * 0.56, 2.1, 0, 6.2832); x.fill();
  return k;
}
// içindeki pelerin: PL11_KARE kanat karesi (açık ↔ yarı açık); ölçek değişince en çok bir kare / çağrı yeniden çizilir (ısıtma kareye yayılır)
function pl11IkonKare(ad, s, i) {
  const st = Math.max(0.5, Math.round(s * 8) / 8);
  let q = pl11Ikon[ad];
  if (!q) { q = pl11Ikon[ad] = { s: 0, k: [], hazir: [] }; for (let j = 0; j < PL11_KARE; j++) { q.k.push(document.createElement('canvas')); q.hazir.push(false); } }
  if (q.s !== st) { q.s = st; for (let j = 0; j < PL11_KARE; j++) q.hazir[j] = false; }
  if (!q.hazir[i]) {
    if (typeof fezaPelerinIkon !== 'function') return null;
    const c = q.k[i], p = Math.ceil((PL11_R + 2) * 2 * st); c.width = c.height = p;
    const x = c.getContext('2d'); x.setTransform(st, 0, 0, st, p / 2, p / 2);
    // kare i: kanat açıklığı yumuşak bir dalga (fezaPelerinIkon'un tm'si: sin(tm·2,6) → i'ye göre)
    const tm = (i / PL11_KARE) * 6.2832 / 2.6;
    try { fezaPelerinIkon(x, ad, 0, 1, PL11_R * 0.84, tm); } catch (e) {}
    q.hazir[i] = true;
  }
  return q.k[i];
}
function pl11Seyrek(x, px, py, s, a) {   // dört köşeli minik parıltı
  if (a <= 0.02) return;
  x.globalAlpha = a; x.beginPath(); x.moveTo(px, py - s); x.quadraticCurveTo(px, py, px + s, py); x.quadraticCurveTo(px, py, px, py + s);
  x.quadraticCurveTo(px, py, px - s, py); x.quadraticCurveTo(px, py, px, py - s); x.fill(); x.globalAlpha = 1;
}

TUR.kaydet('pelerinSec', {
  kur(o) {
    o.done = false;
    o.pl = { t: 0, goster: false, gosterT: -1, sec: -1, puf: null, bitti: false, yakin: 0, acT: -1, bal: [] };
    for (let i = 0; i < 4; i++) o.pl.bal.push({ ad: PL11_ADLAR[i], bx: o.x + PL11_DX[i], by: o.y + PL11_DY[i], x: o.x + PL11_DX[i], y: o.y + PL11_DY[i], ph: i * 1.7 + 0.4, durum: 'bekle', t: 0, dur: 0.5, x0: 0, y0: 0, a: 0, s: 0, parla: 0, pop: 0 });
    PELERIN11.o = o;
    const v = pl11V(); if (v && v.pelerin) { o.pl.bitti = true; o.done = true; for (const b of o.pl.bal) b.durum = 'yok'; }   // (yeniden yüklenmede zaten giyili)
  },
  guncelle(o, dt) {
    const k = o.pl; if (!k || !(dt > 0)) return;
    k.t += dt;
    const v = pl11V(), oyun = typeof DURUM !== 'undefined' && DURUM === 'oyun';
    if (v && v.pelerin && !k.bitti && k.sec < 0) {   // başka yoldan giyildi (test kancası vb.): baloncuklar uçup gitsin
      k.bitti = true; o.done = true; PELERIN11.ad = v.pelerin;
      for (const b of k.bal) if (b.durum === 'yuzer' || b.durum === 'bekle') { b.durum = 'git'; b.t = 0; b.x0 = b.x; b.y0 = b.y; b.pop = 0.5 + 0.2 * k.bal.indexOf(b); }
    }
    // belirme: oyun başlayınca (Feza yakınsa) baloncuklar sırayla büyüyerek belirir
    if (!k.goster && oyun && !k.bitti && Math.abs(P.x - o.x) < 640) {
      k.goster = true; k.gosterT = k.t; PELERIN11.aktif = true;
      for (let i = 0; i < 4; i++) { const b = k.bal[i]; b.durum = 'yuzer'; b.t = -0.12 * i; }
      try { OLAY.emit('pelerinGoster', { o }); } catch (e) {}
    }
    k.yakin += ((Math.abs(P.x - o.x) < 260 ? 1 : 0) - k.yakin) * (1 - Math.exp(-dt * 3));
    // dar ekran (iPad dikey): yay sıkışır ve görünen alanın ortasına kayar, dört baloncuk da ekranda kalsın
    if (typeof VW !== 'undefined' && VW > 0 && typeof cam !== 'undefined') {
      let sp = 1, cx = o.x; const w = 1 - Math.exp(-dt * 2.5), sag = cam.x + VW - 40;
      if (o.x + PL11_DX[3] > sag) { cx = clamp(cam.x + VW * 0.58, o.x - 220, o.x); sp = clamp((sag - cx) / PL11_DX[3], 0.6, 1); }
      for (let i = 0; i < 4; i++) { const b = k.bal[i]; if (b.durum === 'yuzer' || b.durum === 'bekle') { b.bx += (cx + PL11_DX[i] * sp - b.bx) * w; b.by += (o.y + PL11_DY[i] - b.by) * w; } }
    }
    // kendiliğinden giydirme: Feza epey ileri gittiyse ya da uzun süre seçmediyse en yakın baloncuk süzülüp gelir (asla takılmaz)
    if (k.goster && !k.bitti && k.sec < 0 && oyun) {
      const sim = typeof now !== 'undefined' ? now : 0, bekle = pl11SozBitT > 0 ? sim - pl11SozBitT > 15 : k.t - k.gosterT > 24;
      if (P.x > nx(30) || bekle) pl11Sec(o, pl11EnYakin(o), 'kendi');
    }
    // baloncuğa değme (zıplayınca içine girme; uçuş/kurtarılma sırasında değil)
    if (k.goster && !k.bitti && k.sec < 0 && oyun && !(P.fade > 0) && !P.ucus) {
      for (let i = 0; i < 4; i++) {
        const b = k.bal[i]; if (b.durum !== 'yuzer' || b.a < 0.6) continue;
        const r = PL11_R * b.s, d1 = Math.hypot(b.x - P.x, b.y - (P.y - 34)), d2 = Math.hypot(b.x - P.x, b.y - (P.y - 66));
        if (d1 < r + 13 || d2 < r + 9) { pl11Sec(o, i, 'deg'); break; }
      }
    }
    for (let i = 0; i < 4; i++) {
      const b = k.bal[i]; b.t += dt;
      if (b.durum === 'bekle' || b.durum === 'yok') continue;
      if (b.durum === 'yuzer') {   // yay üstünde hafifçe süzülür; Feza yakınsa ona doğru biraz eğilir, parlar
        const u = clamp(b.t / 0.5, 0, 1);
        b.a = clamp(b.t / 0.45, 0, 1); b.s = b.t < 0 ? 0 : 1 + 0.18 * Math.sin(u * Math.PI) * (1 - u);
        const lean = clamp((P.x - b.bx) / 300, -1, 1) * 10 * k.yakin;
        b.x = b.bx + Math.sin(k.t * 0.9 + b.ph) * 6 + lean; b.y = b.by + Math.sin(k.t * 1.3 + b.ph * 1.3) * 7 - 4 * k.yakin;
        b.parla += ((k.yakin > 0.5 ? 1 : 0.35) - b.parla) * (1 - Math.exp(-dt * 3));
      } else if (b.durum === 'gel') {   // seçilen baloncuk Feza'nın başına süzülür (kendiliğinden gelirken yavaş, salınarak)
        const u = clamp(b.t / b.dur, 0, 1), e = u * u * (3 - 2 * u), tx = P.x, ty = P.y - 52;
        b.x = lerp(b.x0, tx, e) + Math.sin(u * Math.PI) * Math.sin(k.t * 3 + b.ph) * 10 * (b.dur > 0.8 ? 1 : 0.3);
        b.y = lerp(b.y0, ty, e) - Math.sin(u * Math.PI) * (b.dur > 0.8 ? 26 : 12);
        b.a = 1; b.s = 1 - 0.25 * e; b.parla = 1;
        if (u >= 1) pl11Puf(o, i);
      } else if (b.durum === 'git') {   // öteki baloncuklar yukarı süzülüp birer birer yumuşakça patlar
        b.y -= (38 + i * 7) * dt; b.x += Math.sin(k.t * 2 + b.ph) * 14 * dt;
        b.a = clamp(1 - (b.t - b.pop) / 0.3, 0, 1);
        if (b.t >= b.pop) {
          b.durum = 'yok';
          if (typeof burst === 'function') burst(b.x, b.y, 9, ['#ffffff', PL11_RENK[b.ad][0], '#e8f4ff', PL11_RENK[b.ad][1]], 70, 0.6, 5);
          if (typeof ripples !== 'undefined') ripples.push({ x: b.x, y: b.y, r: PL11_R * 0.6, life: 0.4, small: true });
        }
      }
    }
    if (k.puf) { k.puf.t += dt; if (k.puf.t > 0.8) k.puf = null; }
    if (k.acT >= 0) { k.acT += dt; if (k.acT > 0.22) { k.acT = -1; pl11Sfx('pelerinAc'); } }   // Feza dönerken pelerin "fıp" diye açılır
    if (k.bitti && !k.puf && k.bal.every(b => b.durum === 'yok')) PELERIN11.aktif = false;
  },
  testBitir(o) { const k = o.pl; if (k && !k.bitti && k.sec < 0) { pl11Sec(o, 0, 'deg'); const b = k.bal[0]; b.t = b.dur; pl11Puf(o, 0); } },
  cizOn(o, tm) {
    const k = o.pl; if (!k || !k.goster) return;
    if (Math.abs(o.x - P.x) > 1800 && !k.puf) return;   // ekrandan çok uzak
    const x = g, sc = typeof S !== 'undefined' ? S : 1;
    for (let i = 0; i < 4; i++) {
      const b = k.bal[i]; if (b.durum === 'yok' || b.durum === 'bekle' || b.a <= 0.01 || b.s <= 0.01) continue;
      const col = PL11_RENK[b.ad], r = PL11_R * b.s, wob = Math.sin(k.t * 2.3 + b.ph) * 0.035;
      x.globalCompositeOperation = 'lighter';
      dglow(col[0], b.x, b.y, r * 1.9, (0.16 + 0.14 * b.parla) * b.a);
      x.globalCompositeOperation = 'source-over';
      x.save(); x.translate(b.x, b.y); x.scale(b.s * (1 + wob), b.s * (1 - wob));
      // içi hafif koyu gece moru: arkadaki şato silüetinde pelerin net seçilsin
      x.globalAlpha = b.a * 0.5; x.fillStyle = '#1d1840'; x.beginPath(); x.arc(0, 0, PL11_R - 1.5, 0, 6.2832); x.fill(); x.globalAlpha = b.a;
      const fi = ((((k.t * 0.55 + b.ph * 0.37) % 1) + 1) % 1) * PL11_KARE, ik = pl11IkonKare(b.ad, sc * b.s, Math.floor(fi) % PL11_KARE);
      if (ik) x.drawImage(ik, -(PL11_R + 2), -(PL11_R + 2), (PL11_R + 2) * 2, (PL11_R + 2) * 2);
      const kb = pl11Kabugu(b.ad, sc * b.s); x.drawImage(kb.c, -(PL11_R + 6), -(PL11_R + 6), (PL11_R + 6) * 2, (PL11_R + 6) * 2);
      x.restore();
      x.fillStyle = '#fffbe8';   // çevresinde iki minik parıltı
      for (let j = 0; j < 2; j++) {
        const a = k.t * (0.9 + 0.3 * j) + b.ph * 2 + j * 3.1, tw = Math.sin(k.t * 4.1 + j * 2 + b.ph);
        pl11Seyrek(x, b.x + Math.cos(a) * (r + 7), b.y + Math.sin(a) * (r + 5), 2.4 + 1.6 * tw, (0.35 + 0.5 * Math.max(0, tw)) * b.a * (0.6 + 0.4 * b.parla));
      }
    }
    x.globalAlpha = 1;
    if (k.puf) {   // "puf": parlak bir halka ve yıldızlar
      const u = k.puf.t / 0.8, a = 1 - u, col = PL11_RENK[k.puf.ad];
      x.globalCompositeOperation = 'lighter'; dglow(col[0], k.puf.x, k.puf.y, 70 + 50 * u, 0.5 * a); dglow('#ffffff', k.puf.x, k.puf.y, 26 + 20 * u, 0.6 * a); x.globalCompositeOperation = 'source-over';
      x.strokeStyle = `rgba(234,244,255,${(0.8 * a).toFixed(3)})`; x.lineWidth = 3 * a + 0.5; x.beginPath(); x.arc(k.puf.x, k.puf.y, 18 + 60 * Math.sqrt(u), 0, 6.2832); x.stroke();
      x.fillStyle = col[1];
      for (let j = 0; j < 8; j++) { const an = j * 0.785 + 0.3, rr = 20 + 52 * Math.sqrt(u); pl11Seyrek(x, k.puf.x + Math.cos(an) * rr, k.puf.y + Math.sin(an) * rr * 0.85, 5 * a + 1, a); }
    }
  }
});
function pl11EnYakin(o) { let bi = 0, bd = 1e9; for (let i = 0; i < 4; i++) { const b = o.pl.bal[i]; if (b.durum !== 'yuzer') continue; const d = Math.abs(b.x - P.x) + Math.abs(b.y - P.y) * 0.3; if (d < bd) { bd = d; bi = i; } } return bi; }
function pl11Sec(o, i, nasil) {   // i. baloncuk seçildi: Feza'ya süzülür (değdiyse hemen), ötekiler uçup gider
  const k = o.pl; if (!k || k.sec >= 0 || k.bitti) return;
  k.sec = i;
  for (let j = 0; j < 4; j++) {
    const b = k.bal[j]; b.x0 = b.x; b.y0 = b.y; b.t = 0;
    if (j === i) { b.durum = 'gel'; b.dur = nasil === 'deg' ? 0.14 : nasil === 'kendi' ? 1.4 : 0.5; }
    else if (b.durum === 'yuzer') { b.durum = 'git'; b.pop = 0.7 + 0.25 * ((j - i + 4) % 4); }
  }
}
function pl11Puf(o, i) {   // pelerin Feza'nın omzunda: parıltılı puf, V11.pelerin, olay
  const k = o.pl, b = k.bal[i]; if (k.bitti) return;
  b.durum = 'yok'; k.bitti = true; o.done = true;
  k.puf = { x: P.x, y: P.y - 46, t: 0, ad: b.ad }; k.acT = 0;
  const v = pl11V(); if (v && !v.pelerin) v.pelerin = b.ad;
  PELERIN11.ad = b.ad;
  pl11Sfx('pelerinPuf');
  if (typeof burst === 'function') { const c = PL11_RENK[b.ad]; burst(P.x, P.y - 44, 26, ['#ffffff', '#eaf4ff', c[0], c[1], '#ffd6f2'], 170, 1.0, 8); }
  if (P.ground && !(P.kilit > 1.1)) P.kilit = 1.1;   // kısa an: Feza döne döne sevinsin (feza.js)
  try { OLAY.emit('pelerinSec', { ad: b.ad, o }); } catch (e) {}
}
// Pırıl'ın "Birine dokun!" sözü bitince 15 sn say (söz yoksa baloncuklar belirdikten 24 sn sonra)
OLAY.on('konusma', v => { if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 11 && v && v.anahtar === 'p_s_pelerin') pl11SozBitT = (typeof now !== 'undefined' ? now : 0) + (+v.sure || 3); });
// ekranda baloncuğa dokunma: yalnız görünen bir baloncuğun yakınına gelen dokunuş bu nesnenindir (cömert alan); öteki dokunuşlar yürümeye gider
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 11 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0) return;
  const o = PELERIN11.o; if (!o || !o.pl || !o.pl.goster || o.pl.bitti || o.pl.sec >= 0) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  let en = -1, best = 1;
  for (let i = 0; i < 4; i++) {
    const b = o.pl.bal[i]; if (b.durum !== 'yuzer' || b.a < 0.3) continue;
    const d = ((wx - b.x) / (PL11_R * 1.75)) ** 2 + ((wy - b.y) / (PL11_R * 1.75)) ** 2;
    if (d < best) { best = d; en = i; }
  }
  if (en < 0) return;
  e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
  pl11Sec(o, en, 'dokun');
}, true);
