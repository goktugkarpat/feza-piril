/* kostum.js — Bölüm 8 kostüm seçimi (cadı, balkabağı, iskelet, yarasa). Sahibi: KARAKTER. Sözleşme: src/BOLUM8.md.
   Nesne 'kostumSec' (bolum8.js, sütun 14): ilk ekranda havada, hafif bir yay üstünde dört sihirli baloncuk süzülür; her birinin
   içinde kostümün minik bir resmi (feza.js fezaKostumIkon: şapka+asa, sapı yapraklı kabak, gülen kafatası+kemikler, kanatlar+kulaklar).
   Baloncuklar Feza'nın başının biraz üstünde: yürürken değmez, zıplayınca içine girilir; ekranda baloncuğa (cömert alan) dokununca
   baloncuk Feza'ya süzülür. Baloncuk Feza'ya varınca parıltılı "puf" (AU.sfx 'kostumPuf'), V8.kostum = ad, OLAY 'kostumSec' {ad, o}
   (feza.js kostümü büyüterek giydirir ve Feza bir tur döner; ses.js Pırıl'ın cümlesini söyler); öteki baloncuklar yukarı süzülüp
   birer birer yumuşakça patlar. Hiç seçilmezse (Feza ~30. sütunu geçerse ya da Pırıl'ın "Birine dokun!" sözünden ~15 sn sonra)
   Feza'ya en yakın baloncuk kendiliğinden süzülüp giydirir: asla takılmaz.
   Baloncuklar belirince OLAY 'kostumGoster' {o} (piril.js ışıltıyla gösterir). Dışa açık: KOSTUM8 = { o, aktif, ad }.
   Performans: baloncuk kabuğu (yanardöner kenar, parlaklık) ölçeğe göre önbelleğe bir kez çizilir; kare başına 4 drawImage + minik simge. */
'use strict';
const KS8_ADLAR = ['cadi', 'kabak', 'iskelet', 'yarasa'];
const KS8_RENK = { cadi: ['#b58cf0', '#ffe7a8'], kabak: ['#ffb347', '#a8f0a0'], iskelet: ['#bcd4ff', '#ffffff'], yarasa: ['#d4b9f8', '#ff9fcd'] };
const KS8_DX = [-168, -56, 56, 168], KS8_DY = [-122, -152, -152, -122], KS8_R = 31;   // yay: kenardakiler biraz alçak (zıplayınca kolay)
const KOSTUM8 = { o: null, aktif: false, ad: null };
const ks8Kabuk = {};   // ad → { c, s }
let ks8SozBitT = -1;   // Pırıl'ın "Birine dokun!" sözünün bittiği an (now)

function ks8V8() { return typeof V8 !== 'undefined' && V8 ? V8 : null; }
function ks8Kabugu(ad, s) {   // baloncuk kabuğu (ölçekli önbellek): içi hafif renkli, yanardöner kenar, parlak yay, minik parlak nokta
  const st = Math.max(0.5, Math.round(s * 8) / 8);
  let k = ks8Kabuk[ad];
  if (k && k.s === st) return k;
  if (!k) k = ks8Kabuk[ad] = { c: document.createElement('canvas'), s: 0 };
  const R = KS8_R, p = Math.ceil((R + 6) * 2 * st), c = k.c; c.width = c.height = p; k.s = st;
  const x = c.getContext('2d'), m = p / 2, col = KS8_RENK[ad];
  x.setTransform(st, 0, 0, st, m, m);
  const ig = x.createRadialGradient(-R * 0.25, -R * 0.3, R * 0.1, 0, 0, R);
  ig.addColorStop(0, 'rgba(255,255,255,0.10)'); ig.addColorStop(0.62, 'rgba(255,255,255,0.05)'); ig.addColorStop(0.9, col[0] + '55'); ig.addColorStop(1, col[0] + 'aa');
  x.fillStyle = ig; x.beginPath(); x.arc(0, 0, R, 0, 6.2832); x.fill();
  const rg = x.createLinearGradient(-R, -R, R, R);
  rg.addColorStop(0, 'rgba(255,170,220,0.95)'); rg.addColorStop(0.35, 'rgba(190,255,230,0.9)'); rg.addColorStop(0.7, 'rgba(200,180,255,0.95)'); rg.addColorStop(1, 'rgba(255,230,170,0.9)');
  x.strokeStyle = rg; x.lineWidth = 2.2; x.beginPath(); x.arc(0, 0, R - 1.1, 0, 6.2832); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 2.6; x.lineCap = 'round'; x.beginPath(); x.arc(0, 0, R - 5.5, 3.55, 4.45); x.stroke();
  x.strokeStyle = 'rgba(255,255,255,0.35)'; x.lineWidth = 1.4; x.beginPath(); x.arc(0, 0, R - 4.5, 0.45, 1.05); x.stroke();
  x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.arc(-R * 0.34, -R * 0.56, 2.1, 0, 6.2832); x.fill();
  return k;
}
function ks8Seyrek(x, px, py, s, a) {   // dört köşeli minik parıltı
  if (a <= 0.02) return;
  x.globalAlpha = a; x.beginPath(); x.moveTo(px, py - s); x.quadraticCurveTo(px, py, px + s, py); x.quadraticCurveTo(px, py, px, py + s);
  x.quadraticCurveTo(px, py, px - s, py); x.quadraticCurveTo(px, py, px, py - s); x.fill(); x.globalAlpha = 1;
}
function ks8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }

TUR.kaydet('kostumSec', {
  kur(o) {
    o.ks = { t: 0, goster: false, gosterT: -1, sec: -1, puf: null, bitti: false, yakin: 0, bal: [] };
    for (let i = 0; i < 4; i++) o.ks.bal.push({ ad: KS8_ADLAR[i], bx: o.x + KS8_DX[i], by: o.y + KS8_DY[i], x: o.x + KS8_DX[i], y: o.y + KS8_DY[i], ph: i * 1.7 + 0.4, durum: 'bekle', t: 0, dur: 0.5, x0: 0, y0: 0, a: 0, s: 0, vx: 0, vy: 0, parla: 0, pop: 0 });
    KOSTUM8.o = o;
    const v = ks8V8(); if (v && v.kostum) { o.ks.bitti = true; o.done = true; for (const b of o.ks.bal) b.durum = 'yok'; }   // (yeniden yüklenmede zaten giyili)
  },
  guncelle(o, dt) {
    const k = o.ks; if (!k || !(dt > 0)) return;
    k.t += dt;
    const v = ks8V8(), oyun = typeof DURUM !== 'undefined' && DURUM === 'oyun';
    if (v && v.kostum && !k.bitti && k.sec < 0) {   // başka yoldan giyildi: baloncuklar uçup gitsin
      k.bitti = true; o.done = true; for (const b of k.bal) if (b.durum === 'yuzer' || b.durum === 'bekle') { b.durum = 'git'; b.t = 0; b.x0 = b.x; b.y0 = b.y; }
    }
    // belirme: oyun başlayınca (Feza yakınsa) baloncuklar sırayla büyüyerek belirir
    if (!k.goster && oyun && !k.bitti && Math.abs(P.x - o.x) < 640) {
      k.goster = true; k.gosterT = k.t; KOSTUM8.aktif = true;
      for (let i = 0; i < 4; i++) { const b = k.bal[i]; b.durum = 'yuzer'; b.t = -0.12 * i; }
      try { OLAY.emit('kostumGoster', { o }); } catch (e) {}
    }
    k.yakin += ((Math.abs(P.x - o.x) < 260 ? 1 : 0) - k.yakin) * (1 - Math.exp(-dt * 3));
    // kendiliğinden giydirme: Feza epey ileri gittiyse ya da uzun süre seçmediyse en yakın baloncuk süzülüp gelir
    if (k.goster && !k.bitti && k.sec < 0 && oyun) {
      const bekle = ks8SozBitT > 0 ? (typeof now !== 'undefined' ? now : 0) - ks8SozBitT > 15 : k.t - k.gosterT > 26;
      if (P.x > nx(30) || bekle) ks8Sec(o, ks8EnYakin(o), 'kendi');
    }
    // baloncuğa değme (zıplayınca içine girme)
    if (k.goster && !k.bitti && k.sec < 0 && oyun && P.fade <= 0 && !P.ucus) {
      for (let i = 0; i < 4; i++) {
        const b = k.bal[i]; if (b.durum !== 'yuzer' || b.a < 0.6) continue;
        const r = KS8_R * b.s, d1 = Math.hypot(b.x - P.x, b.y - (P.y - 34)), d2 = Math.hypot(b.x - P.x, b.y - (P.y - 66));
        if (d1 < r + 13 || d2 < r + 9) { ks8Sec(o, i, 'deg'); break; }
      }
    }
    for (let i = 0; i < 4; i++) {
      const b = k.bal[i]; b.t += dt;
      if (b.durum === 'bekle' || b.durum === 'yok') continue;
      if (b.durum === 'yuzer') {   // yay üstünde hafifçe süzülür; Feza yakınsa ona doğru biraz eğilir, parlar
        b.a = clamp(b.t / 0.45, 0, 1); b.s = b.t < 0 ? 0 : 1 + 0.18 * Math.sin(clamp(b.t / 0.5, 0, 1) * Math.PI) * (1 - clamp(b.t / 0.5, 0, 1));
        const lean = clamp((P.x - b.bx) / 300, -1, 1) * 10 * k.yakin;
        b.x = b.bx + Math.sin(k.t * 0.9 + b.ph) * 6 + lean; b.y = b.by + Math.sin(k.t * 1.3 + b.ph * 1.3) * 7 - 4 * k.yakin;
        b.parla += ((k.yakin > 0.5 ? 1 : 0.35) - b.parla) * (1 - Math.exp(-dt * 3));
      } else if (b.durum === 'gel') {   // seçilen baloncuk Feza'nın başına süzülür (kendiliğinden gelirken yavaş, salınarak)
        const u = clamp(b.t / b.dur, 0, 1), e = u * u * (3 - 2 * u), tx = P.x, ty = P.y - 52;
        b.x = lerp(b.x0, tx, e) + Math.sin(u * Math.PI) * Math.sin(k.t * 3 + b.ph) * 10 * (b.dur > 0.8 ? 1 : 0.3);
        b.y = lerp(b.y0, ty, e) - Math.sin(u * Math.PI) * (b.dur > 0.8 ? 26 : 12);
        b.a = 1; b.s = 1 - 0.25 * e; b.parla = 1;
        if (u >= 1) ks8Puf(o, i);
      } else if (b.durum === 'git') {   // öteki baloncuklar yukarı süzülüp birer birer yumuşakça patlar
        b.y -= (38 + i * 7) * dt; b.x += Math.sin(k.t * 2 + b.ph) * 14 * dt;
        b.a = clamp(1 - (b.t - b.pop) / 0.3, 0, 1);
        if (b.t >= b.pop && b.durum === 'git') {
          b.durum = 'yok';
          if (typeof burst === 'function') burst(b.x, b.y, 9, ['#ffffff', KS8_RENK[b.ad][0], '#e8f4ff', KS8_RENK[b.ad][1]], 70, 0.6, 5);
          if (typeof ripples !== 'undefined') ripples.push({ x: b.x, y: b.y, r: KS8_R * 0.6, life: 0.4, small: true });
        }
      }
    }
    if (k.puf) { k.puf.t += dt; if (k.puf.t > 0.8) k.puf = null; }
    if (k.bitti && !k.puf && k.bal.every(b => b.durum === 'yok')) KOSTUM8.aktif = false;
  },
  cizOn(o, tm) {
    const k = o.ks; if (!k || !k.goster) return;
    const x = g, sc = typeof S !== 'undefined' ? S : 1;
    if (Math.abs(o.x - P.x) > 1800 && !k.puf) return;   // ekrandan çok uzak
    for (let i = 0; i < 4; i++) {
      const b = k.bal[i]; if (b.durum === 'yok' || b.durum === 'bekle' || b.a <= 0.01 || b.s <= 0.01) continue;
      const col = KS8_RENK[b.ad], r = KS8_R * b.s, wob = Math.sin(k.t * 2.3 + b.ph) * 0.035;
      x.globalCompositeOperation = 'lighter';
      dglow(col[0], b.x, b.y, r * 1.9, (0.16 + 0.14 * b.parla) * b.a);
      x.globalCompositeOperation = 'source-over';
      // içindeki kostüm simgesi (canlı: şapkanın ucu, kafatası, kulaklar sallanır)
      x.save(); x.globalAlpha = b.a; x.translate(b.x, b.y); x.scale(b.s * (1 + wob), b.s * (1 - wob));
      if (typeof fezaKostumIkon === 'function') { try { fezaKostumIkon(x, b.ad, 0, 0.5, KS8_R * 0.86, tm + b.ph); } catch (e) {} }
      const kb = ks8Kabugu(b.ad, sc * b.s); x.drawImage(kb.c, -(KS8_R + 6), -(KS8_R + 6), (KS8_R + 6) * 2, (KS8_R + 6) * 2);
      x.restore();
      // çevresinde iki minik parıltı
      x.fillStyle = '#fffbe8';
      for (let j = 0; j < 2; j++) {
        const a = k.t * (0.9 + 0.3 * j) + b.ph * 2 + j * 3.1, tw = Math.sin(k.t * 4.1 + j * 2 + b.ph);
        ks8Seyrek(x, b.x + Math.cos(a) * (r + 7), b.y + Math.sin(a) * (r + 5), 2.4 + 1.6 * tw, (0.35 + 0.5 * Math.max(0, tw)) * b.a * (0.6 + 0.4 * b.parla));
      }
    }
    if (k.puf) {   // "puf": parlak bir halka ve yıldızlar
      const u = k.puf.t / 0.8, a = 1 - u, col = KS8_RENK[k.puf.ad];
      x.globalCompositeOperation = 'lighter'; dglow(col[1], k.puf.x, k.puf.y, 70 + 50 * u, 0.5 * a); dglow('#ffffff', k.puf.x, k.puf.y, 26 + 20 * u, 0.6 * a); x.globalCompositeOperation = 'source-over';
      x.strokeStyle = `rgba(255,248,225,${(0.8 * a).toFixed(3)})`; x.lineWidth = 3 * a + 0.5; x.beginPath(); x.arc(k.puf.x, k.puf.y, 18 + 60 * Math.sqrt(u), 0, 6.2832); x.stroke();
      x.fillStyle = col[1];
      for (let j = 0; j < 8; j++) { const an = j * 0.785 + 0.3, rr = 20 + 52 * Math.sqrt(u); ks8Seyrek(x, k.puf.x + Math.cos(an) * rr, k.puf.y + Math.sin(an) * rr * 0.85, 5 * a + 1, a); }
    }
  }
});
function ks8EnYakin(o) { let bi = 0, bd = 1e9; for (let i = 0; i < 4; i++) { const b = o.ks.bal[i]; if (b.durum !== 'yuzer') continue; const d = Math.abs(b.x - P.x) + Math.abs(b.y - P.y) * 0.3; if (d < bd) { bd = d; bi = i; } } return bi; }
function ks8Sec(o, i, nasil) {   // i. baloncuk seçildi: Feza'ya süzülür (değdiyse hemen), ötekiler uçup gider
  const k = o.ks; if (!k || k.sec >= 0 || k.bitti) return;
  k.sec = i;
  for (let j = 0; j < 4; j++) {
    const b = k.bal[j]; b.x0 = b.x; b.y0 = b.y; b.t = 0;
    if (j === i) { b.durum = 'gel'; b.dur = nasil === 'deg' ? 0.14 : nasil === 'kendi' ? 1.4 : 0.5; }
    else if (b.durum === 'yuzer') { b.durum = 'git'; b.pop = 0.7 + 0.25 * ((j - i + 4) % 4); }
  }
}
function ks8Puf(o, i) {   // kostüm Feza'nın üstünde: parıltılı puf, V8.kostum, olay
  const k = o.ks, b = k.bal[i]; b.durum = 'yok'; k.bitti = true; o.done = true;
  k.puf = { x: P.x, y: P.y - 46, t: 0, ad: b.ad };
  const v = ks8V8(); if (v && !v.kostum) v.kostum = b.ad;
  KOSTUM8.ad = b.ad;
  ks8Sfx('kostumPuf');
  if (typeof burst === 'function') { const c = KS8_RENK[b.ad]; burst(P.x, P.y - 44, 26, ['#ffffff', '#fff2b0', c[0], c[1], '#ffd6f2'], 170, 1.0, 8); }
  if (P.ground && !(P.kilit > 1.1)) P.kilit = 1.1;   // kısa an: Feza döne döne sevinsin (feza.js)
  try { OLAY.emit('kostumSec', { ad: b.ad, o }); } catch (e) {}
}
// Pırıl'ın "Birine dokun!" sözü bitince 15 sn say (söz yoksa baloncuklar belirdikten 26 sn sonra)
OLAY.on('konusma', v => { if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 8 && v && v.anahtar === 'p_c_kostum') ks8SozBitT = (typeof now !== 'undefined' ? now : 0) + (+v.sure || 3); });
// ekranda baloncuğa dokunma: yalnız görünen bir baloncuğun yakınına gelen dokunuş bu nesnenindir (cömert alan); öteki dokunuşlar yürümeye gider
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 8 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0) return;
  const o = KOSTUM8.o; if (!o || !o.ks || !o.ks.goster || o.ks.bitti || o.ks.sec >= 0) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  let en = -1, best = 1;
  for (let i = 0; i < 4; i++) {
    const b = o.ks.bal[i]; if (b.durum !== 'yuzer' || b.a < 0.3) continue;
    const d = ((wx - b.x) / (KS8_R * 1.75)) ** 2 + ((wy - b.y) / (KS8_R * 1.75)) ** 2;
    if (d < best) { best = d; en = i; }
  }
  if (en < 0) return;
  e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
  ks8Sec(o, en, 'dokun');
}, true);
