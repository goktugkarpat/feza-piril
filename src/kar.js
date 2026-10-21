/* kar.js — Kuzey Işıkları'nın dünya nesneleri (Bölüm 7). Korkutucu hiçbir şey yok, kaybetme yok, yazı yok.
   karFener  : buz kristali fener (yerde kristal kümesi; o.asili ile dal ucunda asılı). Feza yanından geçince ya da fenere
               dokununca içinde renkli ışık doğar: çekirdekte kıvılcım → buz çatlakları ışıkla dolar → kar tanesi-kıvılcım
               patlaması → gökyüzüne yükselen ışık (dunya7.js orada o renkte kuzey ışığı şeridi açar). o.yandi = true,
               V7.fener++, OLAY 'karFener' {o, n, x, y, renk, pan}. Renk: o.renk (sıra) → DN7_AUR (varsa) / GY_KUZEY.
   karYavru  : kar yığınında uyuyan kutup tilkisi / tavşan yavrusu (o.hayvan 'tilki'|'tavsan'). Yığından yalnız kulak ve kuyruk
               ucu görünür, yığın nefesle inip kalkar, karın içinden buhar tüter. Feza üstüne zıplayınca kardan fırlar (kar
               patlaması), Feza'yı yükseğe sıçratır (V7.yavru++, OLAY 'yavruUyandi' {o, n}, OLAY 'ziplatti' {tip, o}); silkinip
               karı üstünden atar, bir süre Feza'nın peşinden sevinçle hoplar, sonra yığınına döner. Yığın pofuduk bir zıplatma
               minderi olarak kalır (cisim 'ziplat').
   buzGol    : buzlu göl kayma bölgesi. karBuzKayma(x, y) (0..1) oyun.js'in buz fiziğine kaymayı söyler (düşük sürtünme, düşme
               yok); burada yalnız görüntü: buzda kayak izi, paten parıltıları, dönüşte savrulan buz tozu.
   kuzeyTepe : final. Feza varınca V7.final = true, OLAY 'kuzeyFinal' {o, duration: 30, box}; ~30 sn koreografi (takvim
               aşağıda): tepedeki kuzey kristali yanar, on fener renginde ışık sütunları göğe yükselir, dev kuzey ışığı perdeleri
               açılıp dalgalanır, kar taneleri renklenir, kardan adam ve yavrular dans eder, geyik (geyik.js) vuruşta hoplar,
               Feza ve Pırıl sevinir; 25. sn DORUK (OLAY 'kuzeyDoruk' {o}: tepede ışık tacı, perdeler en parlak); sonunda
               OLAY 'kuzeyTamam' (sabah). Gökyüzünün kendisi dunya7.js'indir; bu dosya sahne/ön plan katmanını çizer.
               karFinalAn() saniye, karFinalNabiz() 0..1 (0,6 sn vuruş) — başka dosyalar ritim için kullanabilir.
   Çizimler önbellek tuvallerinden (kyTuval); karede gradient/filtre üretilmez, parçacıklar sabit sayılı ve analitiktir. */
'use strict';
const KY = { spr: new Map(), tepe: null, yavruSira: 0, gorulen: false };
const KY_PI2 = Math.PI * 2;
function kyV7() { return typeof V7 !== 'undefined' ? V7 : null; }
function kyIsik(col, x, y, r, a) { if (a <= .003) return; g.globalAlpha = a; g.drawImage(glow(col), x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; }
function kyPan(x) { return clamp((x - cam.x - VW / 2) / (VW / 2), -1, 1); }
function kyRenk(i) {   // i. fenerin kuzey ışığı rengi: dunya7'nin paleti varsa onunla aynı, yoksa geyik.js GY_KUZEY
  i = ((i | 0) % 10 + 10) % 10;
  if (typeof DN7_AUR !== 'undefined' && DN7_AUR && DN7_AUR.length) { const r = DN7_AUR[i % DN7_AUR.length]; const c = typeof r === 'string' ? r : r && (r[0] || r.c || r.renk); if (typeof c === 'string' && c[0] === '#' && c.length === 7) return c; }
  return typeof GY_KUZEY !== 'undefined' ? GY_KUZEY[i] : '#7dffc4';
}
// Önbellek tuvali: yerel (x0, y0, w, h) kutusu, 3 piksel/birim
function kyTuval(ad, x0, y0, w, h, fn, K) {
  let c = KY.spr.get(ad); if (c) return c;
  K = K || 3;
  c = document.createElement('canvas'); c.width = Math.ceil(w * K); c.height = Math.ceil(h * K);
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; KY.spr.set(ad, c); return c;
}
function kyKoy(c, x, y) { g.drawImage(c, x + c.x0, y + c.y0, c.w, c.h); }
function kyKoyC(cx, c, x, y) { cx.drawImage(c, x + c.x0, y + c.y0, c.w, c.h); }
// Kar tanesi (altı kollu, beyaz) ve pırıltı: geyik.js'in ortak ışıltısı varsa onu kullan
function kyTane() {
  return kyTuval('tane', -8, -8, 16, 16, q => {
    q.strokeStyle = '#ffffff'; q.lineWidth = 1.3;
    for (let i = 0; i < 6; i++) { const a = i / 6 * KY_PI2, cx = Math.cos(a), sy = Math.sin(a); q.beginPath(); q.moveTo(0, 0); q.lineTo(cx * 7, sy * 7); q.stroke();
      q.beginPath(); q.moveTo(cx * 4, sy * 4); q.lineTo(cx * 4 + Math.cos(a + .8) * 2.4, sy * 4 + Math.sin(a + .8) * 2.4); q.moveTo(cx * 4, sy * 4); q.lineTo(cx * 4 + Math.cos(a - .8) * 2.4, sy * 4 + Math.sin(a - .8) * 2.4); q.stroke(); }
    q.fillStyle = '#ffffff'; q.beginPath(); q.arc(0, 0, 1.6, 0, KY_PI2); q.fill();
  }, 4);
}
function kyIsilti() { return typeof gyIsiltiSpr === 'function' ? gyIsiltiSpr() : glow('#ffffff'); }
function kyPuf() { return typeof gyPufSpr === 'function' ? gyPufSpr() : glow('#f4f8ff'); }

// ═══════════════════════════════ KAR FENERİ (buz kristali) ═══════════════════════════════
// Kristal prizma yolu: tabanı (0,0), -y yönünde L boyunda, w genişliğinde altıgen (sivri uçlu)
function kyPrizmaYol(q, L, w) { const h = w / 2; q.beginPath(); q.moveTo(-h * .8, 2); q.lineTo(-h, -L * .74); q.lineTo(0, -L); q.lineTo(h, -L * .74); q.lineTo(h * .8, 2); q.closePath(); }
function kyPrizma(q, x, y, a, L, w, koyu) {
  q.save(); q.translate(x, y); q.rotate(a);
  kyPrizmaYol(q, L, w); q.fillStyle = koyu ? 'rgba(120,146,184,.92)' : 'rgba(158,184,214,.9)'; q.fill();
  q.strokeStyle = '#4c6288'; q.lineWidth = 1.2; q.stroke();
  const h = w / 2;
  q.fillStyle = koyu ? 'rgba(190,210,232,.55)' : 'rgba(226,238,250,.85)'; q.beginPath(); q.moveTo(-h * .78, 1); q.lineTo(-h * .96, -L * .73); q.lineTo(0, -L * .98); q.lineTo(-h * .12, 0); q.closePath(); q.fill();
  q.fillStyle = 'rgba(80,104,150,.35)'; q.beginPath(); q.moveTo(h * .2, 0); q.lineTo(h * .1, -L * .97); q.lineTo(h * .96, -L * .73); q.lineTo(h * .78, 1); q.closePath(); q.fill();
  q.strokeStyle = 'rgba(255,255,255,.85)'; q.lineWidth = .9; q.beginPath(); q.moveTo(-h * .55, -2); q.lineTo(-h * .66, -L * .7); q.lineTo(-h * .1, -L * .92); q.stroke();
  // kırağı benekleri
  q.fillStyle = 'rgba(255,255,255,.6)'; for (let i = 0; i < 4; i++) { q.beginPath(); q.arc(((i * 37) % 7 - 3) * h * .22, -L * (.2 + i * .17), .7 + (i % 2) * .4, 0, KY_PI2); q.fill(); }
  q.restore();
}
// Fener gövdesi (sönük buz): kar tümseği + dört prizma (ortadaki büyük, içinde ışığın doğacağı oyuk). Merkez çekirdek (0, -30).
const KY_FC = -30;   // çekirdeğin yüksekliği
function kyFenerSpr() {
  return kyTuval('fener', -32, -74, 64, 82, q => {
    kyPrizma(q, -5, -5, -.16, 44, 12, true);          // arka
    kyPrizma(q, 11, -3, .46, 30, 11, true);           // sağ arka
    kyPrizma(q, 0, -3, 0, 64, 22, false);             // ana prizma (fener)
    kyPrizma(q, -13, -2, -.5, 32, 12, false);         // sol
    kyPrizma(q, 15, -1, .7, 20, 9, false);            // sağ küçük
    // ana prizmanın içindeki oyuk (ışığın yuvası)
    q.fillStyle = 'rgba(70,92,140,.35)'; q.beginPath(); q.ellipse(0, KY_FC, 5.5, 9, 0, 0, KY_PI2); q.fill();
    q.strokeStyle = 'rgba(255,255,255,.5)'; q.lineWidth = .8; q.beginPath(); q.ellipse(0, KY_FC, 5.5, 9, 0, Math.PI * .9, Math.PI * 1.6); q.stroke();
    // kar tümseği
    q.fillStyle = '#dfe9f7'; q.beginPath(); q.moveTo(-30, 3); q.quadraticCurveTo(-26, -9, -12, -7); q.quadraticCurveTo(-4, -12, 6, -8); q.quadraticCurveTo(22, -11, 30, 3); q.closePath(); q.fill();
    q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(-24, -3); q.quadraticCurveTo(-18, -9, -10, -7); q.quadraticCurveTo(-4, -10, 4, -7); q.quadraticCurveTo(-8, -4.5, -24, -3); q.fill();
    q.fillStyle = 'rgba(140,160,205,.35)'; q.beginPath(); q.ellipse(4, 2, 26, 2.6, 0, 0, KY_PI2); q.fill();
  });
}
// Buz çatlakları (çekirdekten dışa dallanır): renk başına bir kez
const KY_CATLAK = [[0, -30, -6, -42, -9, -50], [0, -30, 5, -40, 8, -52], [0, -30, -7, -24, -9, -14], [0, -30, 6, -22, 8, -10],
  [-6, -42, -2, -47, 0, -56], [5, -40, 9, -36, 10, -30], [-7, -24, -10, -30, -9, -36], [6, -22, 3, -16, 4, -8]];
function kyCatlakSpr(renk) {
  return kyTuval('catlak' + renk, -12, -60, 24, 56, q => {
    const cz = (lw, col) => { q.strokeStyle = col; q.lineWidth = lw; q.beginPath(); for (const c of KY_CATLAK) { q.moveTo(c[0], c[1]); q.lineTo(c[2], c[3]); q.lineTo(c[4], c[5]); } q.stroke(); };
    cz(2.6, mixc(renk, '#ffffff', .1, .55)); cz(1.1, mixc(renk, '#ffffff', .6));
  });
}
// Yanan fenerin renkli iç ışığı (prizmanın içini doldurur; renk başına bir kez)
function kyIcIsikSpr(renk) {
  return kyTuval('icisik' + renk, -12, -66, 24, 68, q => {
    q.save(); kyPrizmaYol(q, 64, 22); q.translate(0, -3); q.clip();
    const gr = q.createRadialGradient(0, KY_FC, 1, 0, KY_FC, 34); gr.addColorStop(0, mixc(renk, '#ffffff', .75)); gr.addColorStop(.35, mixc(renk, '#ffffff', .2, .85)); gr.addColorStop(1, mixc(renk, '#ffffff', 0, .25));
    q.fillStyle = gr; q.fillRect(-12, -66, 24, 68); q.restore();
  });
}
function kyFenerYak(o, kaynak) {
  if (o.yandi) return false;
  o.yandi = true; o.yanT = 0; o.kaynak = kaynak || 'yakin';
  const v = kyV7(); if (v) v.fener = (v.fener || 0) + 1;
  const fx = o.x, fy = o.y + (o.asili ? -o.h - KY_FC : KY_FC) * o.s;
  burst(fx, fy, 14, [o.rk, '#ffffff', '#e8f4ff'], 120, 1.1, 6);
  ripples.push({ x: fx, y: fy, r: 0, life: 1.4, small: true });
  OLAY.emit('karFener', { o, n: v ? v.fener : 1, x: fx, y: fy, renk: o.rk, pan: kyPan(fx) });
  return true;
}
TUR.kaydet('karFener', {
  kur(o) {
    o.yandi = false; o.yanT = -1; o.s = o.s || 1.22; o.h = o.h || 120; o.t = (o.x * .007) % 6;
    o.rk = kyRenk(o.renk != null ? o.renk : o.sira != null ? o.sira : Math.floor(o.x / T));
    o.r = o.r || 80; o.ry = o.ry || 30; o.tit = 0;
  },
  dokun(o) { kyFenerYak(o, 'yakin'); },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    o.t += dt; if (o.yandi) o.yanT += dt;
    o.tit = Math.max(0, o.tit - dt * 1.5);
    if (!o.yandi && Math.abs(P.x - o.x) < 70 && Math.abs(P.y - o.y) < 120 && Math.abs(P.vx) > 60) o.tit = Math.max(o.tit, .4);
  },
  ciz(o, tm) {
    // Yanma anı (o.yanT): 0-0,35 çekirdekte renkli kıvılcım doğar, kristal titrer → 0,3-1,0 buz çatlakları çekirdekten dışa
    // ışıkla dolar → 0,9 kar tanesi-kıvılcım patlaması + ışık halkası → 0,9-3,2 göğe yükselen ışık (izli). Yanan fener: içten
    // nabız atan renkli ışık, parlayan çatlaklar, çevresinde süzülen üç pırıltı, karda renkli ışık lekesi. Finalde vuruşla parlar.
    const s = o.s, yt = o.yandi ? o.yanT : -1, renk = o.rk, as = !!o.asili;
    const ay = as ? o.y - o.h : o.y;   // dayanak (yer ya da dal)
    const titre = (yt >= 0 && yt < .9 ? Math.sin(yt * 60) * .035 * (1 - yt / .9) : 0) + Math.sin(tm * 18) * .02 * o.tit;
    const nb = typeof karFinalNabiz === 'function' ? karFinalNabiz() : 0;
    if (as) {   // dal + ince buz sapı
      g.strokeStyle = '#3f3a63'; g.lineWidth = 5; g.beginPath(); g.moveTo(o.x - 46, ay - 8); g.quadraticCurveTo(o.x - 10, ay - 2, o.x + 26, ay - 10); g.stroke();
      g.strokeStyle = '#eaf2ff'; g.lineWidth = 3; g.beginPath(); g.moveTo(o.x - 40, ay - 11); g.quadraticCurveTo(o.x - 8, ay - 5, o.x + 20, ay - 13); g.stroke();
    }
    g.save(); g.translate(o.x, ay); if (as) g.scale(s, -s); else g.scale(s, s); g.rotate(titre);
    const ac = o.yandi ? smooth(clamp((yt - .05) / .5, 0, 1)) : 0, cy = KY_FC;
    // karda/dalda renkli ışık lekesi (fenerin altında)
    if (ac > 0) { g.globalCompositeOperation = 'lighter'; kyIsik(renk, 0, -4, 80, ac * (.3 + .1 * nb)); kyIsik(renk, 0, cy, 100, ac * (.22 + .14 * nb)); g.globalCompositeOperation = 'source-over'; }
    kyKoy(kyFenerSpr(), 0, 0);
    if (!o.yandi) {   // sönük çekirdekte uyuyan soluk ışık: Feza yaklaşınca nefes alır (davet)
      const yak = clamp(1 - Math.abs(P.x - o.x) / 360, 0, 1), n = .5 + .5 * Math.sin(tm * 2.1 + o.x);
      g.globalCompositeOperation = 'lighter'; kyIsik('#cfe4ff', 0, cy, 10 + yak * 9, .14 + yak * .3 * n); kyIsik(renk, 0, cy, 6 + yak * 4, yak * .25 * n); g.globalCompositeOperation = 'source-over';
      g.restore(); return;
    }
    // iç ışık + çatlaklar
    const nab = .82 + .12 * Math.sin(tm * 2.4 + o.x) + .06 * Math.sin(tm * 5.3 + o.x * 2) + .35 * nb;
    g.globalAlpha = ac * Math.min(1, .75 + .25 * nab); kyKoy(kyIcIsikSpr(renk), 0, 0); g.globalAlpha = 1;
    g.globalCompositeOperation = 'lighter';
    const cr = yt < 1 ? smooth(clamp((yt - .3) / .7, 0, 1)) * 34 : 40;   // çatlakların dolduğu yarıçap
    if (cr > 0) {
      if (cr < 40) { g.save(); g.beginPath(); g.arc(0, cy, cr, 0, KY_PI2); g.clip(); kyKoy(kyCatlakSpr(renk), 0, 0); g.restore(); }
      else { g.globalAlpha = .75 + .25 * Math.min(1, nab); kyKoy(kyCatlakSpr(renk), 0, 0); g.globalAlpha = 1; }
    }
    // çekirdek: doğarken yaylanarak büyür, sonra nabız atar
    const d = yt, buy = d < .9 ? smooth(clamp(d / .35, 0, 1)) * (1 + Math.sin(clamp(d / .9, 0, 1) * Math.PI) * .6) : 1;
    kyIsik(renk, 0, cy, 26 * buy * nab, .75); kyIsik('#ffffff', 0, cy, 9 * buy * nab, .9);
    const isl = kyIsilti(), ir = 7 * buy * (1 + .15 * Math.sin(tm * 4 + o.x));
    g.globalAlpha = .9; g.drawImage(isl, -ir, cy - ir, ir * 2, ir * 2); g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    g.restore();
    // ── dünya koordinatında efektler ──
    const fx = o.x, fy = ay + (as ? -cy : cy) * s;
    g.globalCompositeOperation = 'lighter';
    if (yt < .4) {   // doğuş: çekirdeğe akan ışık iplikleri
      const u = yt / .4;
      for (let k = 0; k < 6; k++) { const a = k / 6 * KY_PI2 + o.x, r = (1 - u) * 46; kyIsik(renk, fx + Math.cos(a) * r, fy + Math.sin(a) * r, 6, u * .7); }
    }
    if (yt > .85 && yt < 2.2) {   // kar tanesi-kıvılcım patlaması + halka
      const u = (yt - .85) / 1.35, e = 1 - Math.pow(1 - u, 2.4), tane = kyTane();
      g.globalAlpha = (1 - u) * .6; g.strokeStyle = renk; g.lineWidth = 3 * (1 - u) + 1; g.beginPath(); g.ellipse(fx, fy, 16 + e * 80, 14 + e * 64, 0, 0, KY_PI2); g.stroke(); g.globalAlpha = 1;
      if (u < .2) kyIsik('#ffffff', fx, fy, 70, (1 - u * 5) * .6);
      for (let k = 0; k < 12; k++) {
        const a = k / 12 * KY_PI2 + .3, rr = 10 + e * (58 + (k % 3) * 16), x = fx + Math.cos(a) * rr, y = fy + Math.sin(a) * rr * .8 + u * u * 30, r = (k % 2 ? 4.5 : 6.5) * (1 - u * .5);
        kyIsik(k % 3 ? renk : '#ffffff', x, y, 10, (1 - u) * .55);
        g.globalAlpha = (1 - u) * .95; g.save(); g.translate(x, y); g.rotate(u * 3 + k); g.drawImage(tane, -r, -r, r * 2, r * 2); g.restore();
      }
      g.globalAlpha = 1;
    }
    if (yt > .9 && yt < 3.4) {   // göğe yükselen ışık (izli), ekranın tepesinde açılıp söner
      const u = (yt - .9) / 2.5, top = cam.y - 30, e = 1 - Math.pow(1 - Math.min(1, u * 1.15), 2), y = lerp(fy - 20, top, e), x = fx + Math.sin(u * 7 + o.x) * 14 * (1 - u);
      const sn = u > .85 ? 1 - (u - .85) / .15 : 1;
      for (let j = 7; j >= 0; j--) { const yy = y + j * 16 * (1 - u * .4); kyIsik(renk, x - Math.sin((u - j * .02) * 7 + o.x) * 4, yy, 15 - j, sn * (j ? .4 * (1 - j / 8) : .85)); }
      kyIsik('#ffffff', x, y, 6, sn * .9);
      if (u > .78) kyIsik(renk, x, top + 10, 120 * (u - .78) / .22 + 30, (1 - u) * 2.2);
    }
    // yanan fenerin çevresinde süzülen üç pırıltı
    const bk = smooth(clamp((yt - 1.4) / 1.2, 0, 1));
    if (bk > 0) {
      const isl = kyIsilti();
      for (let k = 0; k < 3; k++) {
        const ph = tm * (.6 + k * .14) + k * 2.1 + o.x, bx = fx + Math.cos(ph) * (26 + k * 8), by = fy - 6 + Math.sin(ph * 1.3) * (20 + k * 6) - (as ? -10 : 10);
        const n = .55 + .45 * Math.sin(tm * 3.3 + k * 1.7 + o.x);
        kyIsik(renk, bx, by, 9, bk * .5 * n); g.globalAlpha = bk * .8 * n; g.drawImage(isl, bx - 3, by - 3, 6, 6); g.globalAlpha = 1;
      }
    }
    g.globalCompositeOperation = 'source-over';
  },
});

// ═══════════════════════════════ KAR YAVRULARI (tilki / tavşan) ═══════════════════════════════
// Hayvan çizici: kyHayvanCiz(c, x, y, s, t, o) — (x, y) ayak tabanı ortası, s = 1'de oturuşta ≈ 36 birim boy (sağa bakar).
// o = { hayvan 'tilki'|'tavsan', yon, zipla 0..1 (havada uzanış), sev 0..1 (mutlu gözler), uyku 0..1, kulak -1..1, silk 0..1 }
const KY_HP = {
  tilki: { g: '#fbfcff', gk: '#d5dff0', cz: '#5d6488', ic: '#e9c9dc', bu: '#3d3550', uc: '#c9b8f0', gz: '#33284a' },
  tavsan: { g: '#fff9f2', gk: '#eadccd', cz: '#7a6470', ic: '#ffc2cf', bu: '#f08aa2', uc: '#ffffff', gz: '#3a2838' },
};
function kyHParca(hv, ad) {
  const p = KY_HP[hv], k = hv + ad;
  if (ad === 'govde') return kyTuval(k, -16, -28, 30, 30, q => {
    q.fillStyle = p.g; q.strokeStyle = p.cz; q.lineWidth = 1.3;
    q.beginPath(); q.ellipse(-1, -12, 11.5, 12, 0, 0, KY_PI2); q.stroke(); q.fill();
    q.fillStyle = p.gk; q.beginPath(); q.ellipse(-4, -6, 7, 5, .3, 0, KY_PI2); q.globalAlpha = .55; q.fill(); q.globalAlpha = 1;
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(3.5, -14, 5, 7, -.2, 0, KY_PI2); q.fill();   // göğüs tüyü
    // ön patiler
    q.fillStyle = p.g; for (const x of [2, 7.5]) { q.beginPath(); q.ellipse(x, -1.6, 3.2, 2.2, 0, 0, KY_PI2); q.stroke(); q.fill(); }
    // arka bacak (oturuş): yanda yuvarlak but
    q.beginPath(); q.ellipse(-7, -4, 6.5, 4.6, -.2, 0, KY_PI2); q.stroke(); q.fill();
    q.fillStyle = 'rgba(255,255,255,.7)'; q.beginPath(); q.ellipse(-5, -18, 3.5, 2, -.4, 0, KY_PI2); q.fill();
  }, 4);
  if (ad === 'bas') return kyTuval(k, -12, -14, 30, 24, q => {
    // baş (0,0) merkezli; tilki: sivri burun + yanak tüyleri; tavşan: yuvarlak, kısa burun
    q.fillStyle = p.g; q.strokeStyle = p.cz; q.lineWidth = 1.3;
    if (hv === 'tilki') {
      q.beginPath(); q.moveTo(-9, 2); q.quadraticCurveTo(-10, -9, 0, -9.5); q.quadraticCurveTo(8, -9, 11, -2); q.quadraticCurveTo(16, 1, 14.5, 3.2); q.quadraticCurveTo(8, 6, 2, 6.5);
      q.lineTo(-2, 8.5); q.lineTo(-4, 6); q.lineTo(-8, 7); q.lineTo(-7.5, 4); q.closePath(); q.stroke(); q.fill();
      q.fillStyle = p.bu; q.beginPath(); q.ellipse(14.6, 2.2, 1.9, 1.5, 0, 0, KY_PI2); q.fill();
      q.strokeStyle = p.cz; q.lineWidth = 1; q.beginPath(); q.moveTo(9, 4.6); q.quadraticCurveTo(11, 5.8, 13.4, 4.4); q.stroke();
    } else {
      q.beginPath(); q.ellipse(1, -1, 9.5, 8.6, 0, 0, KY_PI2); q.stroke(); q.fill();
      q.beginPath(); q.ellipse(7, 2.2, 5, 4, 0, 0, KY_PI2); q.fill();
      q.fillStyle = p.bu; q.beginPath(); q.moveTo(10.6, .4); q.lineTo(12.6, .4); q.lineTo(11.6, 2); q.closePath(); q.fill();
      q.strokeStyle = p.cz; q.lineWidth = .9; q.beginPath(); q.moveTo(11.6, 2); q.lineTo(11.6, 3.4); q.moveTo(9.6, 4.4); q.quadraticCurveTo(11.6, 5.4, 13, 3.8); q.stroke();
    }
    q.fillStyle = 'rgba(255,140,170,.35)'; q.beginPath(); q.ellipse(5.5, 3.2, 3, 1.7, 0, 0, KY_PI2); q.fill();
  }, 4);
  if (ad === 'kulak') return kyTuval(k, -5, hv === 'tavsan' ? -21 : -12, 10, hv === 'tavsan' ? 23 : 14, q => {
    // kök (0,0), yukarı
    q.fillStyle = p.g; q.strokeStyle = p.cz; q.lineWidth = 1.2;
    if (hv === 'tavsan') { q.beginPath(); q.ellipse(0, -9.5, 3.4, 10, 0, 0, KY_PI2); q.stroke(); q.fill(); q.fillStyle = p.ic; q.beginPath(); q.ellipse(.2, -9, 1.7, 7.6, 0, 0, KY_PI2); q.fill(); }
    else { q.beginPath(); q.moveTo(-4, 1); q.lineTo(-.6, -10.5); q.lineTo(4, 1); q.closePath(); q.stroke(); q.fill(); q.fillStyle = p.ic; q.beginPath(); q.moveTo(-2, 0); q.lineTo(-.4, -6.5); q.lineTo(2, 0); q.closePath(); q.fill(); }
  }, 4);
  if (ad === 'kuyruk') return kyTuval(k, -26, -26, 30, 30, q => {
    // kök (0,0); tilki: büyük kabarık kıvrık kuyruk (ucu lila); tavşan: pamuk top
    q.strokeStyle = p.cz; q.lineWidth = 1.3;
    if (hv === 'tilki') {
      const yol = () => { q.beginPath(); q.moveTo(2, 2); q.bezierCurveTo(-10, 4, -24, -2, -22, -14); q.bezierCurveTo(-21, -22, -12, -24, -9, -18); q.bezierCurveTo(-14, -14, -12, -6, 2, -5); q.closePath(); };
      yol(); q.stroke(); q.fillStyle = p.g; q.fill();
      q.save(); yol(); q.clip(); q.fillStyle = p.uc; q.beginPath(); q.ellipse(-17, -19, 7, 6, .4, 0, KY_PI2); q.fill(); q.fillStyle = p.gk; q.globalAlpha = .5; q.beginPath(); q.ellipse(-8, 2, 12, 4, 0, 0, KY_PI2); q.fill(); q.restore();
    } else { q.fillStyle = p.g; q.beginPath(); q.arc(-2, -2, 5, 0, KY_PI2); q.stroke(); q.fill(); q.fillStyle = '#ffffff'; q.beginPath(); q.arc(-3, -3.4, 2.2, 0, KY_PI2); q.fill(); }
  }, 4);
  return null;
}
const KY_HV = { hayvan: 'tilki', yon: 1, zipla: 0, sev: 0, uyku: 0, kulak: 0, silk: 0 };
function kyHayvanCiz(c, x, y, s, t, o) {
  o = o || KY_HV;
  const hv = o.hayvan === 'tavsan' ? 'tavsan' : 'tilki', p = KY_HP[hv], z = clamp(+o.zipla || 0, 0, 1), sev = clamp(+o.sev || 0, 0, 1), silk = clamp(+o.silk || 0, 0, 1);
  let yon = Number.isFinite(o.yon) ? clamp(o.yon, -1, 1) : 1; if (Math.abs(yon) < .15) yon = yon < 0 ? -.15 : .15;
  const nefes = Math.sin(t * 2.4), sw = Math.sin(t * 40) * silk * .14;
  c.save(); c.translate(x, y); c.scale(s * yon, s);
  // havada: gövde uzar ve öne eğilir; yere değerken basılır (squash)
  const ux = 1 + z * .14, uy = 1 - z * .1 + nefes * .015;
  c.rotate(-z * .28 + sw);
  // kuyruk (arkada; sevinçte sallanır)
  const kSal = Math.sin(t * (sev > .3 ? 11 : 2)) * (.1 + .25 * sev) + z * .35;
  c.save(); c.translate(hv === 'tilki' ? -9 : -11, hv === 'tilki' ? -7 : -8); c.rotate(kSal); kyKoyC(c, kyHParca(hv, 'kuyruk'), 0, 0); c.restore();
  // havada arka bacaklar geriye uzanır
  if (z > .05) { c.fillStyle = p.g; c.strokeStyle = p.cz; c.lineWidth = 1.2; c.save(); c.translate(-7, -4); c.rotate(.9 * z); c.beginPath(); c.ellipse(-3, 3, 7, 3.4, 0, 0, KY_PI2); c.stroke(); c.fill(); c.restore(); }
  c.save(); c.scale(ux, uy); kyKoyC(c, kyHParca(hv, 'govde'), 0, 0); c.restore();
  // baş + kulaklar
  const bx = hv === 'tilki' ? 4 : 5, by = (hv === 'tilki' ? -27 : -26) * uy;
  c.save(); c.translate(bx, by); c.rotate(Math.sin(t * 1.3) * .05 - z * .1 + sw * 1.5);
  const kirpK = Math.pow(Math.max(0, Math.sin(t * .7 + 1)), 40), kul = clamp(+o.kulak || 0, -1, 1);
  const kul0 = hv === 'tavsan' ? -.25 - z * .5 + kul * .25 : -.15 - z * .2 + kul * .2;
  c.save(); c.translate(-4.5, -6.5); c.rotate(kul0 - .15 + Math.sin(t * 1.6) * .05 - kirpK * .3); kyKoyC(c, kyHParca(hv, 'kulak'), 0, 0); c.restore();
  kyKoyC(c, kyHParca(hv, 'bas'), 0, 0);
  c.save(); c.translate(1.5, -7.5); c.rotate(kul0 + .2 + Math.sin(t * 1.6 + .8) * .05); kyKoyC(c, kyHParca(hv, 'kulak'), 0, 0); c.restore();
  // göz
  const gx = hv === 'tilki' ? 5.5 : 4.5, gyy = -2.5, kf = t * .9 + 2.1, kirp = Math.pow(Math.max(0, Math.sin(kf)), 60), uyk = clamp(+o.uyku || 0, 0, 1);
  c.strokeStyle = p.gz; c.fillStyle = p.gz; c.lineCap = 'round';
  if (sev > .5 || kirp > .8 || uyk > .5) { c.lineWidth = 1.3; c.beginPath(); if (sev > .5 && uyk <= .5) { c.moveTo(gx - 2.4, gyy + .6); c.quadraticCurveTo(gx, gyy - 2.2, gx + 2.4, gyy + .6); } else { c.moveTo(gx - 2.4, gyy); c.quadraticCurveTo(gx, gyy + 2, gx + 2.4, gyy); } c.stroke(); }
  else { c.beginPath(); c.ellipse(gx, gyy, 2.2, 2.9, 0, 0, KY_PI2); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(gx - .7, gyy - 1.1, .9, 0, KY_PI2); c.fill(); }
  c.restore();
  c.restore();
}
// Kar yığını (yavrunun yuvası): yuvarlak pamuk tepecik, mavi gölgeli, parlak kenar. Yerel (0,0) taban ortası.
function kyYiginSpr(w, h) {
  return kyTuval('yigin' + w + 'x' + h, -w / 2 - 6, -h - 8, w + 12, h + 12, q => {
    const yol = () => { q.beginPath(); q.moveTo(-w / 2 - 4, 2); q.bezierCurveTo(-w / 2, -h * .8, -w * .25, -h - 2, -w * .05, -h); q.bezierCurveTo(w * .2, -h - 4, w / 2, -h * .7, w / 2 + 4, 2); q.closePath(); };
    yol(); q.fillStyle = '#e4ecf9'; q.fill();
    q.save(); yol(); q.clip();
    const gr = q.createLinearGradient(0, -h, 0, 2); gr.addColorStop(0, '#ffffff'); gr.addColorStop(.6, '#e6eefb'); gr.addColorStop(1, '#b9c7e6');
    q.fillStyle = gr; q.fillRect(-w / 2 - 6, -h - 8, w + 12, h + 12);
    q.fillStyle = 'rgba(160,178,220,.45)'; q.beginPath(); q.ellipse(w * .22, -h * .25, w * .3, h * .35, 0, 0, KY_PI2); q.fill();
    q.fillStyle = 'rgba(255,255,255,.9)'; q.beginPath(); q.ellipse(-w * .18, -h * .78, w * .2, h * .12, -.2, 0, KY_PI2); q.fill();
    q.restore();
    q.strokeStyle = 'rgba(120,138,190,.7)'; q.lineWidth = 1.2; yol(); q.stroke();
    q.fillStyle = 'rgba(255,255,255,.95)'; for (let i = 0; i < 6; i++) { q.beginPath(); q.arc(-w * .35 + i * w * .14, -h * (.45 + ((i * 7) % 5) * .08), .8, 0, KY_PI2); q.fill(); }
  });
}
// Yığından görünen uç: tilkide iki kulak ucu + kabarık kuyruk ucu (lila); tavşanda iki uzun kulak (yatık) + pamuk kuyruk
function kyUcCiz(o, tm, nefes) {
  const hv = o.hayvan, p = KY_HP[hv], s = o.s, x = o.x, y = o.y - o.h * s * (1 + nefes * .05), yn = o.yon || 1, kp = Math.pow(Math.max(0, Math.sin(tm * .8 + o.x)), 30);
  g.save(); g.translate(x, y); g.scale(s * yn * 1.3, s * 1.3);
  g.fillStyle = p.g; g.strokeStyle = p.cz; g.lineWidth = 1.2;
  if (hv === 'tilki') {
    for (const [ex, a] of [[3, -.2], [10, .25]]) { g.save(); g.translate(ex, 3); g.rotate(a + (ex > 5 ? kp * .4 : 0)); g.beginPath(); g.moveTo(-3.6, 2); g.lineTo(-.4, -8); g.lineTo(3.6, 2); g.closePath(); g.stroke(); g.fill(); g.fillStyle = p.ic; g.beginPath(); g.moveTo(-1.7, 1); g.lineTo(-.3, -4.5); g.lineTo(1.7, 1); g.closePath(); g.fill(); g.fillStyle = p.g; g.restore(); }
    g.save(); g.translate(-16, 8); g.rotate(-.6 + Math.sin(tm * 1.2) * .08); g.beginPath(); g.ellipse(0, -4, 5.5, 8, 0, 0, KY_PI2); g.stroke(); g.fill(); g.fillStyle = p.uc; g.beginPath(); g.ellipse(0, -8.5, 4, 3.6, 0, 0, KY_PI2); g.fill(); g.restore();
  } else {
    for (const [ex, a] of [[2, -1.25], [7, -1.05]]) { g.save(); g.translate(ex, 4); g.rotate(a + (ex > 5 ? kp * .3 : 0)); g.beginPath(); g.ellipse(0, -8, 3, 9, 0, 0, KY_PI2); g.stroke(); g.fill(); g.fillStyle = p.ic; g.beginPath(); g.ellipse(.2, -7.6, 1.5, 6.5, 0, 0, KY_PI2); g.fill(); g.fillStyle = p.g; g.restore(); }
    g.beginPath(); g.arc(-17, 8, 4.4, 0, KY_PI2); g.stroke(); g.fill();
  }
  g.restore();
}
function kyUyandir(o) {
  if (o.uyandi) return;
  const m = o.ky; o.uyandi = true; m.uyanT = 0; m.durum = 'firla';
  o.cisim.tip = 'ziplat'; o.cisim.guc = o.guc || 1150;
  const v = kyV7(); if (v) v.yavru = (v.yavru || 0) + 1;
  burst(o.x, o.y - o.h * o.s, 24, ['#ffffff', '#e4ecff', '#cfe0ff', '#fff6ff'], 170, 1.2, 7);
  ripples.push({ x: o.x, y: o.y - 16, r: 0, life: 1.6 });
  if (typeof dn7Iz === 'function') { try { dn7Iz(o.x, o.y, 'inis'); } catch (e) {} }
  OLAY.emit('yavruUyandi', { o, n: v ? v.yavru : 1 });
}
const KY_SURE_TAKIP = 9;
TUR.kaydet('karYavru', {
  kur(o) {
    o.s = o.s || 1; o.hayvan = o.hayvan === 'tavsan' ? 'tavsan' : 'tilki'; o.yon = o.yon || 1; o.uyandi = false;
    o.w = o.w || 64; o.h = o.h || 30; o.sira = KY.yavruSira++;
    o.ky = { t: (o.x * .013) % 7, durum: 'uyku', uyanT: -1, ax: o.x, ay: o.y - o.h, sic: null, z: 0, sev: 0, yon: o.yon, takipT: 0, davet: 0, gor: false, sevKa: 0, silk: 0, hopT: 0,
      opt: { hayvan: o.hayvan, yon: o.yon, zipla: 0, sev: 0, uyku: 0, kulak: 0, silk: 0 } };
    o.cisim = { w: o.w, h: o.h, tip: 'kati', aktif: true, dx: 0, dy: 0 };
  },
  ustune(o) {
    if (!o.uyandi) { kyUyandir(o); P.vy = -(o.guc || 1150); P.ground = false; P.dj = true; OLAY.emit('ziplatti', { tip: 'karYavru', o }); return; }
    const m = o.ky; m.sev = 1; burst(o.x, o.y - o.h, 10, ['#ffffff', '#e4ecff'], 100, .7, 5);
    if (m.durum === 'ev' && !m.sic) kySicra(o, o.x + (o.yon || 1) * 6, o.y - o.h, 70, .5);   // evdeyse o da sevinçle hoplar
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    const m = o.ky; m.t += dt; m.z = Math.max(0, m.z - dt * 3); m.sev = Math.max(0, m.sev - dt * .25); m.silk = Math.max(0, m.silk - dt * 1.6);
    const dx = P.x - o.x, yakin = Math.abs(dx) < 280 && Math.abs(P.y - o.y) < 220;
    if (!o.uyandi) {
      m.davet = clamp(m.davet + (yakin ? dt : -dt) * 1.5, 0, 1);
      // yumuşak mıknatıs: üstünden atlarken Feza yığına süzülür (uyandırmak kolay olsun)
      if (DURUM === 'oyun' && !P.ground && !P.ucus && P.vy > -150 && Math.abs(dx) < o.w * .5 + 14 && P.y < o.y - o.h && P.y > o.y - 200)
        P.vx = lerp(P.vx, -dx * 5, Math.min(1, dt * 12));
      return;
    }
    m.uyanT += dt;
    if (m.sic) {   // yay üstünde
      const s = m.sic; s.u += dt / s.T; const u = Math.min(1, s.u);
      m.ax = lerp(s.x0, s.x1, u); m.ay = lerp(s.y0, s.y1, u) - Math.sin(u * Math.PI) * s.h; m.z = Math.max(m.z, Math.sin(u * Math.PI));
      if (Math.abs(s.x1 - s.x0) > 3) m.yon = s.x1 > s.x0 ? 1 : -1;
      if (s.u >= 1) { m.ax = s.x1; m.ay = s.y1; m.sic = null; if (typeof dn7Iz === 'function' && m.durum !== 'firla') { try { dn7Iz(m.ax, m.ay, 'yavru'); } catch (e) {} } }
    }
    if (m.durum === 'firla') {   // kardan fırlayış: yay yukarı, yığının tepesine iner, sonra silkinir
      if (m.uyanT < dt * 1.5 && !m.sic) kySicra(o, o.x + (o.yon || 1) * 4, o.y - o.h, 95, .75);
      if (!m.sic && m.uyanT > .8) { m.durum = 'silk'; m.silk = 1; burst(m.ax, m.ay - 14, 10, ['#ffffff', '#e8f0ff'], 80, .7, 4); }
      return;
    }
    if (m.durum === 'silk') { if (m.uyanT > 1.6) { m.durum = 'takip'; m.takipT = 0; m.sev = 1; } return; }
    if (m.durum === 'takip') {
      m.takipT += dt;
      if (m.takipT > KY_SURE_TAKIP || P.ucus || (typeof V7 !== 'undefined' && V7 && V7.final)) { m.durum = 'don'; return; }
      if (m.sic) return;
      // Feza'nın arkasında (yavru sırasına göre biraz ayrık) hop hop; uzak düşerse bırakır, eve döner
      const f = P.f || 1, hx = P.x - f * (60 + (o.sira % 3) * 26), hdx = hx - m.ax;
      if (Math.abs(P.x - m.ax) > 520 || Math.abs(P.y - m.ay) > 6 * T) { m.durum = 'don'; return; }
      m.hopT -= dt;
      if (m.hopT <= 0) {
        m.hopT = .08 + Math.random() * .1;
        if (Math.abs(hdx) > 30) {
          const st = clamp(hdx, -95, 95), nx = m.ax + st, ny = typeof gyZemin === 'function' ? gyZemin(nx, m.ay) : m.ay;
          if (ny != null && Math.abs(ny - m.ay) < 3.2 * T) kySicra(o, nx, ny, 24 + Math.max(0, m.ay - ny) * .6 + Math.random() * 10, .38);
          else m.durum = 'don';
        } else if (Math.random() < .5) kySicra(o, m.ax, m.ay, 22 + Math.random() * 20, .4);   // yerinde sevinç hopu
        else if (Math.random() < .3) { m.yon = -m.yon; m.hopT = .4; }   // dönüp bakar
      }
      return;
    }
    if (m.durum === 'don') {
      if (m.sic) return;
      const ex = o.x, ey = o.y - o.h, d = ex - m.ax;
      if (Math.abs(d) < 6 && Math.abs(ey - m.ay) < 4) { m.durum = 'ev'; m.ax = ex; m.ay = ey; m.yon = o.yon; return; }
      if (Math.abs(d) > 380 || Math.abs(ey - m.ay) > 4 * T) { kySicra(o, ex, ey, 160, 1.1); return; }   // uzaksa tek uzun sıçrayış
      const st = clamp(d, -90, 90), nx = m.ax + st, son = Math.abs(d) <= 90, ny = son ? ey : (typeof gyZemin === 'function' ? gyZemin(nx, m.ay) : m.ay);
      kySicra(o, nx, ny == null ? ey : ny, 22 + (son ? Math.max(0, m.ay - ey) * .5 + 14 : 0), .38);
      return;
    }
    // evde (yığının tepesinde oturur): kulak oynatır, Feza yakındaysa ona bakar, ara sıra küçük hop
    m.yon = Math.abs(dx) > 30 ? (dx > 0 ? 1 : -1) : m.yon;
    m.hopT -= dt; if (!m.sic && m.hopT <= 0) { m.hopT = 2 + Math.random() * 3; if (yakin) kySicra(o, m.ax, m.ay, 20, .36); }
  },
  ciz(o, tm) {
    const m = o.ky, s = o.s, nefes = Math.sin(m.t * 1.3 + o.x * .01);
    // yığın: uykuda nefesle kabarır; uyanınca sevinçle titrer (üstüne basılınca basılır)
    const ny = 1 + (o.uyandi ? 0 : nefes * .05);
    g.save(); g.translate(o.x, o.y); g.scale(1, ny); kyKoy(kyYiginSpr(o.w, o.h), 0, 0); g.restore();
    if (!o.uyandi) {
      kyUcCiz(o, tm, nefes);
      // karın içinden tüten nefes buharı + ara sıra yığında parıltı
      const puf = kyPuf(), per = 3.2, u = ((m.t / per) % 1);
      if (u < .7) { const k = u / .7, r = 4 + k * 10; g.globalAlpha = Math.sin(k * Math.PI) * .45; g.drawImage(puf, o.x + (o.yon || 1) * 14 * s - r + k * 6 * (o.yon || 1), o.y - o.h * s - 6 - k * 22 - r, r * 2, r * 2); g.globalAlpha = 1; }
      if (m.davet > .02) {   // davet: yığının üstünde yavaşça inip kalkan ışık damlası (Feza yaklaşınca)
        const yy = o.y - o.h * s - 26 - Math.abs(Math.sin(tm * 2.2)) * 10;
        g.globalCompositeOperation = 'lighter'; kyIsik('#cfe4ff', o.x, yy, 18, m.davet * .45); g.globalAlpha = m.davet * .85; g.drawImage(kyIsilti(), o.x - 6, yy - 6, 12, 12); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      }
      return;
    }
    // uyanış anı: kar patlaması (yığından fırlayan kar topakları + toz halkası)
    if (m.uyanT < 1.3) kyKarPatla(o.x, o.y - o.h * s * .7, m.uyanT / 1.3, o.x);
    const op = m.opt; op.yon = m.yon; op.zipla = m.sic ? m.z : 0; op.sev = m.durum === 'takip' || m.sev > .4 ? 1 : 0; op.uyku = 0; op.kulak = m.durum === 'silk' ? .5 : 0; op.silk = m.silk;
    // gölge
    g.globalAlpha = .18; g.fillStyle = '#2a2a55'; const gyer = m.sic ? lerp(m.sic.y0, m.sic.y1, Math.min(1, m.sic.u)) : m.ay; g.beginPath(); g.ellipse(m.ax, gyer, 12 * s, 2.6 * s, 0, 0, KY_PI2); g.fill(); g.globalAlpha = 1;
    kyHayvanCiz(g, m.ax, m.ay, s * 1.18, m.t + o.sira, op);
    if (m.silk > 0) {   // silkinirken üstünden uçuşan kar tozu
      const puf = kyPuf();
      for (let k = 0; k < 6; k++) { const a = k / 6 * KY_PI2 + m.t * 3, r = (1 - m.silk) * 26 + 6; g.globalAlpha = m.silk * .5; g.drawImage(puf, m.ax + Math.cos(a) * r - 5, m.ay - 16 + Math.sin(a) * r * .6 - 5, 10, 10); }
      g.globalAlpha = 1;
    }
  },
});
function kySicra(o, x1, y1, h, T0) { const m = o.ky; m.sic = { x0: m.ax, y0: m.ay, x1, y1, u: 0, T: T0 || .4, h: h || 30 }; }
// Kar patlaması (analitik): u 0..1 — 14 topak yay çizerek düşer, toz halkası açılır, ince kar tozu bulutu söner
function kyKarPatla(x, y, u, tohum) {
  const puf = kyPuf(), e = 1 - Math.pow(1 - u, 2.2);
  g.globalAlpha = (1 - u) * .55; g.drawImage(puf, x - 20 - e * 60, y - 10 - e * 30, 40 + e * 120, 30 + e * 60);
  g.fillStyle = '#ffffff'; g.strokeStyle = 'rgba(150,170,215,.8)'; g.lineWidth = 1;
  for (let k = 0; k < 14; k++) {
    const a = -Math.PI / 2 + ((k * 7.3 + tohum) % 13 / 13 - .5) * 2.6, v = 150 + (k % 5) * 32, tt = u * 1.1;
    const px = x + Math.cos(a) * v * tt, py = y + Math.sin(a) * v * tt + 420 * tt * tt, r = (2.2 + (k % 3) * 1.4) * (1 - u * .4);
    g.globalAlpha = 1 - u * u; g.beginPath(); g.arc(px, py, r, 0, KY_PI2); g.fill(); g.stroke();
  }
  g.globalAlpha = 1;
}

// ═══════════════════════════════ BUZLU GÖL ═══════════════════════════════
// Fizik oyun.js'te (om7Buz): bu dosya yalnız kayma gücünü söyler. Kenarlarda 40 birimde yumuşak geçiş; göl üstündeki
// buz saçağı platformlarında (yüzeyden yüksekte) kayma yok.
const KY_GOLLER = [];
function karBuzKayma(x, y) {
  for (let i = 0; i < KY_GOLLER.length; i++) { const o = KY_GOLLER[i]; if (x > o.x0 && x < o.x1 && Math.abs(y - o.yuz) < 12) return clamp(Math.min(x - o.x0, o.x1 - x) / 40, 0, 1); }
  return 0;
}
// Görüntü: buzda kayak izi (sabit 64 noktalık halka), paten parıltıları, dönüş/frende savrulan buz tozu
const KY_IZ_N = 64;
TUR.kaydet('buzGol', {
  kur(o) {
    o.x0 = o.x0 != null ? o.x0 : o.x - (o.w || 800) / 2; o.x1 = o.x1 != null ? o.x1 : o.x + (o.w || 800) / 2; o.yuz = o.y; o.cx = o.x;
    o.iz = []; for (let i = 0; i < KY_IZ_N; i++) o.iz.push({ x: 0, y: 0, t: -99, f: 1 }); o.izI = 0; o.sonX = 0; o.t = 0; o.toz = [];
    for (let i = 0; i < 12; i++) o.toz.push({ x: 0, y: 0, vx: 0, vy: 0, t: 9 });
    o.tozI = 0; o.tozT = 0;
    KY_GOLLER.push(o);
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    o.t += dt;
    o.x = clamp(P.x, o.x0, o.x1);   // çizim ayıklaması kamerayla birlikte gelsin (göl kameradan geniş)
    const k = P.ground && !P.ucus ? karBuzKayma(P.x, P.y) : 0;
    if (k > .3 && Math.abs(P.vx) > 50 && Math.abs(P.x - o.sonX) > 9) {   // iz noktası
      const p = o.iz[o.izI]; p.x = P.x; p.y = o.yuz; p.t = o.t; p.f = Math.abs(P.vx) / 300; o.izI = (o.izI + 1) % KY_IZ_N; o.sonX = P.x;
    }
    // savrulma: Feza hareketin tersine dönmüşken (frende) ayağından buz tozu savrulur
    o.tozT -= dt;
    if (k > .3 && Math.abs(P.vx) > 90 && (P.vx * (P.f || 1) < 0 || Math.abs(P.vx) > 330) && o.tozT <= 0) {
      o.tozT = .05; const q = o.toz[o.tozI]; o.tozI = (o.tozI + 1) % o.toz.length;
      q.x = P.x + Math.sign(P.vx) * 8; q.y = o.yuz - 2; q.vx = P.vx * .45 + (Math.random() - .5) * 40; q.vy = -60 - Math.random() * 70; q.t = 0;
    }
    for (let i = 0; i < o.toz.length; i++) { const q = o.toz[i]; if (q.t > 1) continue; q.t += dt * 1.6; q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 260 * dt; q.vx *= 1 - dt * 2; }
  },
  ciz(o, tm) {
    const isl = kyIsilti(), now0 = o.t;
    // kayak izi: iki ince açık çizgi (sönerek kaybolur) + yer yer pırıltı
    g.save(); g.lineCap = 'round';
    for (let j = 0; j < 2; j++) {
      g.strokeStyle = j ? 'rgba(255,255,255,.55)' : 'rgba(170,215,255,.4)'; g.lineWidth = j ? 1.1 : 2.4;
      for (let i = 1; i < KY_IZ_N; i++) {
        const a = o.iz[(o.izI + i - 1) % KY_IZ_N], b = o.iz[(o.izI + i) % KY_IZ_N], yas = now0 - b.t;
        if (yas > 6 || now0 - a.t > 6 || Math.abs(a.x - b.x) > 40) continue;
        g.globalAlpha = (1 - yas / 6) * .9; g.beginPath(); g.moveTo(a.x, a.y - 1.5 - j * 2.5); g.lineTo(b.x, b.y - 1.5 - j * 2.5); g.stroke();
      }
    }
    g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < KY_IZ_N; i += 5) { const p = o.iz[i], yas = now0 - p.t; if (yas > 3) continue; const n = Math.max(0, Math.sin(tm * 6 + i)); g.globalAlpha = (1 - yas / 3) * n * .9; g.drawImage(isl, p.x - 4, p.y - 7, 8, 8); }
    // buz yüzeyinde rastgele beliren paten parıltıları (Feza yakınında)
    for (let k = 0; k < 6; k++) {
      const u = (tm * .7 + k * .37) % 1, x = clamp(P.x + ((k * 173.3) % 600) - 300 + Math.floor(tm * .7 + k * .37) * 97 % 200, o.x0 + 10, o.x1 - 10);
      g.globalAlpha = Math.sin(u * Math.PI) * .7; const r = 3 + 3 * Math.sin(u * Math.PI); g.drawImage(isl, x - r, o.yuz - 3 - r, r * 2, r * 2);
    }
    // savrulan buz tozu
    g.globalCompositeOperation = 'source-over'; g.fillStyle = '#eef6ff';
    for (let i = 0; i < o.toz.length; i++) { const q = o.toz[i]; if (q.t > 1) continue; g.globalAlpha = (1 - q.t) * .9; g.beginPath(); g.arc(q.x, q.y, 1.6 + q.t * 1.5, 0, KY_PI2); g.fill(); }
    g.restore();
  },
});

// ═══════════════════════════════ KUZEY TEPESİ (FİNAL) ═══════════════════════════════
// ~30 sn (a = o.age, vuruş 0,6 sn; ölçü 2,4 sn):
//   0-2     tepedeki kuzey kristali uyanır: renk renk ışık kristalin içinden yükselir; Feza'nın yaktığı her fener renginde
//           ışık sütunu (en çok 10) tepeden göğe fırlar
//   2-8     ışık sütunları göğün tepesinde dağılır → dev kuzey ışığı perdeleri ortadan dışa açılır ve dalgalanır
//   4-6     yavrular (3 tilki 2 tavşan) iki yandan hoplayarak gelir; kardan adam (kardanCiz varsa) sağdan kayarak gelir
//   6-24    dans: perdeler vuruşla nefes alır, kar taneleri renk renk ışır, fenerler ve geyik boynuzları ritmik parlar,
//           yavrular sırayla zıplar, kardan adam kollarını sallar
//   25      DORUK (OLAY 'kuzeyDoruk' {o}): tepede ışık tacı (dönen ışınlar), perdeler en parlak, renkli kar tanesi patlaması
//   25-30   doruk dansı → sakin parıltı → OLAY 'kuzeyTamam'
const KAR_FIN = { SURE: 30, DORUK: 25, VUR: .8 };   // VUR: müziğin 3/4 vuruşu (ölçü 2,4 sn = 3 × 0,8)
const KY_PERDE = [   // [alt renk, üst renk, taban yüksekliği (tepe zemininden), boy, faz, hız]
  ['#7dffc4', '#c39bff', 225, 250, 0, 1], ['#ff8fd0', '#9fb8ff', 275, 220, 2.1, .8], ['#6fe8ff', '#a6ffde', 185, 190, 4.2, 1.2], ['#c39bff', '#ff8fd0', 320, 200, 1.3, .9]];
function karFinalAn() { const o = KY.tepe; return o && o.basla ? o.age : 0; }
function karFinalNabiz() { const o = KY.tepe; if (!o || !o.basla) return 0; const u = (o.age % KAR_FIN.VUR) / KAR_FIN.VUR; return Math.pow(1 - u, 3); }
function kyPerdeSpr(c1, c2) {   // dikey ışın şeridi: altta parlak ince kenar, yukarı doğru öbür renge dönüp söner; yanları yumuşak
  return kyTuval('perde' + c1 + c2, 0, 0, 16, 128, q => {
    const gr = q.createLinearGradient(0, 128, 0, 0);
    gr.addColorStop(0, mixc(c1, '#ffffff', .5, 0)); gr.addColorStop(.04, mixc(c1, '#ffffff', .45, 1)); gr.addColorStop(.18, mixc(c1, c1, 0, .75));
    gr.addColorStop(.55, mixc(c1, c2, .7, .32)); gr.addColorStop(1, mixc(c2, c2, 0, 0));
    q.fillStyle = gr; q.fillRect(0, 0, 16, 128);
    q.globalCompositeOperation = 'destination-in';
    const yg = q.createLinearGradient(0, 0, 16, 0); yg.addColorStop(0, 'rgba(0,0,0,0)'); yg.addColorStop(.5, 'rgba(0,0,0,1)'); yg.addColorStop(1, 'rgba(0,0,0,0)');
    q.fillStyle = yg; q.fillRect(0, 0, 16, 128);
  }, 2);
}
function kyTepeKristal() {   // tepedeki büyük kuzey kristali (sönük buz kümesi; ışık canlı eklenir)
  return kyTuval('tepeKristal', -60, -150, 120, 160, q => {
    kyPrizma(q, -16, -8, -.22, 84, 20, true); kyPrizma(q, 20, -6, .3, 70, 18, true);
    kyPrizma(q, 0, -6, 0, 132, 34, false);
    kyPrizma(q, -30, -3, -.6, 54, 18, false); kyPrizma(q, 32, -2, .62, 46, 16, false); kyPrizma(q, 10, -4, .15, 60, 14, false);
    q.fillStyle = '#e4ecf9'; q.beginPath(); q.moveTo(-56, 6); q.quadraticCurveTo(-48, -14, -22, -10); q.quadraticCurveTo(0, -18, 24, -10); q.quadraticCurveTo(50, -14, 56, 6); q.closePath(); q.fill();
    q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(-44, -2); q.quadraticCurveTo(-30, -12, -12, -9); q.quadraticCurveTo(-28, -5, -44, -2); q.fill();
  });
}
function kyIsinSpr() {   // doruk tacının dönen ışınları (bir kez)
  return kyTuval('isin', -150, -150, 300, 300, q => {
    for (let i = 0; i < 14; i++) {
      const an = i / 14 * KY_PI2, c = GY_KUZEY[i % 10], gr = q.createLinearGradient(0, 0, Math.cos(an) * 150, Math.sin(an) * 150);
      gr.addColorStop(0, mixc(c, '#ffffff', .5, .6)); gr.addColorStop(1, mixc(c, c, 0, 0));
      q.fillStyle = gr; q.beginPath(); q.moveTo(0, 0); q.lineTo(Math.cos(an - .08) * 150, Math.sin(an - .08) * 150); q.lineTo(Math.cos(an + .08) * 150, Math.sin(an + .08) * 150); q.closePath(); q.fill();
    }
  }, 2);
}
function kyKizakVar() { return !!(TUR.al('kizakMini') && NESNELER.some(n => n.tip === 'kizakMini')); }
function kyTepeBasla(o) {
  if (o.basla) return;
  const v = kyV7(); o.basla = true; o.age = 0; o.tamam = false; o.doruk = false;
  if (v) v.final = true;
  P.kilit = Math.max(P.kilit || 0, KAR_FIN.SURE + 1); P.vx = 0; P.buf = 0;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  lightTarget = 1;
  // sütun renkleri: yakılan fenerlerin renkleri (hiç yoksa yine de üç renk)
  o.sutun = []; for (const n of NESNELER) if (n.tip === 'karFener' && n.yandi && n.rk) o.sutun.push(n.rk);
  if (o.sutun.length < 3) for (let i = o.sutun.length; i < 3; i++) o.sutun.push(GY_KUZEY[i * 3 % 10]);
  burst(o.x, o.y - 120, 30, ['#7dffc4', '#ff8fd0', '#8fd8ff', '#ffffff'], 160, 1.6, 6);
  kyKadraj(o);
  OLAY.emit('kuzeyFinal', { o, duration: KAR_FIN.SURE, box: o.box });
}
function kyKadraj(o) {   // senlik.js snKadraj gibi: yatayda geniş, dikeyde dar kutu
  const asp = typeof W !== 'undefined' && typeof H !== 'undefined' && H > 0 ? W / H : 1.33;
  const gen = clamp(Math.min(asp >= 1.2 ? 360 : asp >= .95 ? 320 : 280, (typeof VW !== 'undefined' && VW > 0 ? VW / 2 - 50 : 360)), 200, 360);
  o.gen = gen; o.rK = gen / 360;
  const b = o.box; b.x0 = Math.min(o.x - gen, P.x - 80); b.x1 = Math.max(o.x + gen, P.x + 80); b.y0 = o.y - 500; b.y1 = o.y + (asp >= .95 ? 40 : 20);
}
TUR.kaydet('kuzeyTepe', {
  kur(o) {
    o.basla = false; o.age = 0; o.r = o.r || 170; o.ry = o.ry || 30; o.doruk = false; o.t = 0;
    o.box = { x0: o.x - 360, x1: o.x + 360, y0: o.y - 500, y1: o.y + 40 }; o.gen = 360; o.rK = 1; o.sutun = [];
    o.olay = { doruk: false, yavru: false };
    // dans eden yavrular: [hayvan, yan (-1 sol / 1 sağ), uzaklık]
    o.dans = [['tilki', -1, 150], ['tavsan', -1, 230], ['tilki', 1, 170], ['tavsan', 1, 250], ['tilki', -1, 300]].map((d, i) => ({ hayvan: d[0], yan: d[1], uz: d[2], i,
      opt: { hayvan: d[0], yon: -d[1], zipla: 0, sev: 1, uyku: 0, kulak: 0, silk: 0 } }));
    o.kdOpt = { dans: 0, yon: -1, zipla: 0, el: 0, mutlu: 1 };
    KY.tepe = o;
  },
  dokun(o) {
    const v = kyV7();
    if (P.ucus || (v && !v.kizak && kyKizakVar() && !NESNELER.some(n => n.tip === 'kizakMini' && n.done))) { o.dokundu = false; return; }
    kyTepeBasla(o);
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    o.t += dt;
    if (!o.isindi && Math.abs(P.x - o.x) < 2600) {   // yaklaşırken önbellekleri kareye yayarak ısıt
      o.isP = o.isP || 0;
      if (typeof geyikIsit === 'function' && !geyikIsit()) {}
      else if (o.isP < KY_PERDE.length) { const p = KY_PERDE[o.isP++]; kyPerdeSpr(p[0], p[1]); }
      else { o.isindi = true; kyTepeKristal(); kyIsinSpr(); kyTane(); for (const d of o.dans) { kyHParca(d.hayvan, 'govde'); kyHParca(d.hayvan, 'bas'); kyHParca(d.hayvan, 'kulak'); kyHParca(d.hayvan, 'kuyruk'); } }
    }
    if (!o.basla) return;
    const a0 = o.age; o.age += dt; const a = o.age, ev = o.olay;
    kyKadraj(o);
    if (!ev.doruk && a >= KAR_FIN.DORUK) {
      ev.doruk = true; o.doruk = true; lightTarget = 1; OLAY.emit('kuzeyDoruk', { o });
      ripples.push({ x: o.x, y: o.y - 300, r: 0, life: 2.6 }); burst(o.x, o.y - 320, 40, ['#7dffc4', '#ff8fd0', '#8fd8ff', '#c39bff', '#ffffff'], 220, 2, 7);
    }
    if (o.doruk && a > KAR_FIN.DORUK + 4.5) o.doruk = false;
    // dorukta Feza vuruşta sevinçle zıplar (dans pozları feza.js fzKuzey7'de)
    if (a >= KAR_FIN.DORUK && a < KAR_FIN.DORUK + 4.5 && P.ground && !P.ucus && Math.floor(a0 / (KAR_FIN.VUR * 2)) < Math.floor(a / (KAR_FIN.VUR * 2))) {
      P.vy = -540; P.ground = false; burst(P.x, P.y - 4, 6, ['#7dffc4', '#ff8fd0', '#ffffff'], 90, .7, 5);
    }
    if (a >= KAR_FIN.SURE && !o.tamam) { o.tamam = true; o.done = true; OLAY.emit('kuzeyTamam', { o }); }
  },
  ciz(o, tm) {
    const a = o.basla ? o.age : 0, nb = karFinalNabiz();
    if (o.basla) { kyPerdeler(o, tm, a, nb); kySutunlar(o, tm, a); kyTac(o, tm, a, nb); }
    // tepedeki kuzey kristali
    const ys = o.basla ? smooth(clamp(a / 1.6, 0, 1)) : 0;
    kyKoy(kyTepeKristal(), o.x, o.y);
    g.globalCompositeOperation = 'lighter';
    if (!o.basla) {   // davet: Feza yaklaşınca kristalin içi renk renk nefes alır
      const yak = clamp(1 - Math.abs(P.x - o.x) / 700, 0, 1), c = GY_KUZEY[Math.floor(tm * .5) % 10], n = .5 + .5 * Math.sin(tm * 1.8);
      kyIsik(c, o.x, o.y - 70, 40 + yak * 30, .1 + yak * .25 * n); kyIsik('#ffffff', o.x, o.y - 70, 10 + yak * 6, .2 + yak * .4 * n);
    } else {
      for (let k = 0; k < 3; k++) { const c = GY_KUZEY[(Math.floor(tm * .8) + k * 3) % 10]; kyIsik(c, o.x + (k - 1) * 16, o.y - 50 - k * 20, 60 + nb * 20, ys * (.35 + .25 * nb)); }
      kyIsik('#ffffff', o.x, o.y - 80, 22 + nb * 10, ys * .9);
      const isl = kyIsilti(), r = 14 + nb * 6; g.globalAlpha = ys; g.drawImage(isl, o.x - r, o.y - 82 - r, r * 2, r * 2); g.globalAlpha = 1;
    }
    g.globalCompositeOperation = 'source-over';
    if (o.basla) { kyKardanCiz(o, tm, a, false); kyYavruDans(o, tm, a, false); }
  },
  cizOn(o, tm) {
    if (!o.basla) return;
    const a = o.age;
    kyKardanCiz(o, tm, a, true); kyYavruDans(o, tm, a, true); kyRenkliKar(o, tm, a);
  },
});
// ── Dev kuzey ışığı perdeleri: her perde ~40 dikey ışın şeridi; alt kenarı iki dalganın toplamı, boyu ve parlaklığı dalgalanır.
// Ortadan dışa açılır (2-8 sn), vuruşla nefes alır, dorukta en parlak; sonda yavaşça söner.
function kyPerdeler(o, tm, a, nb) {
  const ac = smooth(clamp((a - 2) / 6, 0, 1)), sn = a > KAR_FIN.SURE - 2.5 ? 1 - smooth(clamp((a - (KAR_FIN.SURE - 2.5)) / 2.5, 0, 1)) * .6 : 1;
  if (ac <= 0) return;
  const dor = a >= KAR_FIN.DORUK ? 1 - smooth(clamp((a - KAR_FIN.DORUK - 3) / 2, 0, 1)) * .6 : smooth(clamp((a - KAR_FIN.DORUK + 1.5) / 1.5, 0, 1));
  const x0 = Math.min(o.box.x0, cam.x) - 80, x1 = Math.max(o.box.x1, cam.x + VW) + 80, N = 40, dx = (x1 - x0) / N, reach = ac * (x1 - x0) * .62;
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < KY_PERDE.length; k++) {
    const P0 = KY_PERDE[k], spr = kyPerdeSpr(P0[0], P0[1]), ph = P0[4], hz = P0[5];
    if (k === 3 && a < 6) continue;
    for (let i = 0; i <= N; i++) {
      const x = x0 + i * dx, uz = Math.abs(x - o.x), ac2 = clamp((reach - uz) / 160, 0, 1); if (ac2 <= 0) continue;
      const yb = o.y - P0[2] + 42 * Math.sin(x * .0042 + tm * .45 * hz + ph) + 20 * Math.sin(x * .011 - tm * .8 * hz + ph * 2);
      const h = P0[3] * (.72 + .28 * Math.sin(x * .007 + tm * .6 * hz + ph * 1.7)) * (1 + .25 * dor);
      const al = (.075 + .065 * Math.sin(x * .023 + tm * 1.7 * hz + ph)) * ac2 * sn * (1 + .3 * nb + .7 * dor);
      g.globalAlpha = Math.min(1, al); g.drawImage(spr, x - dx * .8, yb - h, dx * 1.6, h);
    }
  }
  g.restore();
}
// ── Işık sütunları (0-4 sn): tepeden göğe fışkıran, yelpaze gibi açılan renkli ışınlar (yakılan fenerlerin renkleri)
function kySutunlar(o, tm, a) {
  if (a > 5) return;
  const n = o.sutun.length, isl = kyIsilti();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const t0 = .3 + i * .22, u = (a - t0) / 1.6; if (u <= 0 || u > 1.6) continue;
    const e = 1 - Math.pow(1 - Math.min(1, u), 2.4), an = -Math.PI / 2 + ((i + .5) / n - .5) * 1.6, L = 520 * e, sx = o.x, sy = o.y - 80;
    const ex = sx + Math.cos(an) * L, ey = sy + Math.sin(an) * L, sn = u > 1 ? 1 - (u - 1) / .6 : 1, c = o.sutun[i];
    for (let j = 0; j <= 10; j++) { const f = j / 10; kyIsik(c, lerp(sx, ex, f), lerp(sy, ey, f), 18 - f * 6, sn * .32); }
    kyIsik('#ffffff', ex, ey, 10, sn * .9); g.globalAlpha = sn; g.drawImage(isl, ex - 9, ey - 9, 18, 18); g.globalAlpha = 1;
    if (u > .95 && u < 1.4) kyIsik(c, ex, ey, 60 + (u - .95) * 200, (1.4 - u) * 1.2);   // göğün tepesinde dağılır
  }
  g.restore();
}
// ── Doruk tacı: tepenin üstünde büyüyerek beliren, dönen renkli ışınlar + parlayan kristal halkası
function kyTac(o, tm, a, nb) {
  if (a < KAR_FIN.DORUK - .2) return;
  const u = a - KAR_FIN.DORUK + .2, gir = clamp(u / 1, 0, 1), olc = gir < 1 ? smooth(gir) * (1 + Math.sin(gir * Math.PI) * .3) : 1, sn = a > KAR_FIN.SURE - 2 ? 1 - smooth(clamp((a - KAR_FIN.SURE + 2) / 2, 0, 1)) : 1;
  if (olc <= 0 || sn <= 0) return;
  const x = o.x, y = o.y - 330 + Math.sin(tm * 1.3) * 6, k = olc * (1 + nb * .06), isl = kyIsilti();
  g.save(); g.globalCompositeOperation = 'lighter';
  g.save(); g.globalAlpha = .21 * sn; g.translate(x, y); g.rotate(tm * .22); g.scale(k * 1.4, k * 1.4); g.drawImage(kyIsinSpr(), -150, -150, 300, 300); g.restore();
  kyIsik('#ffffff', x, y, 60 * k, .27 * sn); kyIsik('#7dffc4', x, y, 140 * k, .13 * sn); kyIsik('#ff8fd0', x, y, 220 * k, .07 * sn);   // yumuşak (göz almasın)
  for (let i = 0; i < 10; i++) {   // dönen kristal halkası
    const an = tm * .8 + i / 10 * KY_PI2, r = 8 * (.6 + .4 * Math.sin(tm * 4 + i)), px = x + Math.cos(an) * 90 * k, py = y + Math.sin(an) * 34 * k;
    kyIsik(GY_KUZEY[i], px, py, 18, .5 * sn); g.globalAlpha = sn; g.drawImage(isl, px - r, py - r, r * 2, r * 2); g.globalAlpha = 1;
  }
  g.restore();
}
// ── Renkli kar: kamera çerçevesine sarılan, ışıkla renklenen iri kar taneleri (analitik; final boyunca yoğunlaşır)
const KY_KAR_N = 46;
function kyRenkliKar(o, tm, a) {
  const yog = smooth(clamp((a - 3) / 4, 0, 1)) * (a > KAR_FIN.SURE - 3 ? 1 - smooth(clamp((a - KAR_FIN.SURE + 3) / 3, 0, 1)) * .6 : 1);
  if (yog <= 0) return;
  const vw = VW, vh = VW * H / Math.max(1, W), x0 = cam.x, y0 = cam.y - 30, hh = vh + 60, tane = kyTane(), dor = a >= KAR_FIN.DORUK && a < KAR_FIN.DORUK + 4;
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < KY_KAR_N; k++) {
    if (k / KY_KAR_N > yog) continue;
    const hz = 26 + (k * 13) % 30, y = y0 + ((a * hz + k * 97.3) % hh), x = x0 + (((k * .618 * vw + Math.sin(a * .7 + k) * 36 + a * 8) % vw) + vw) % vw;
    const c = GY_KUZEY[(k + Math.floor(a * .5)) % 10], r = 4 + (k % 4) * 1.6 + (dor ? 2 : 0), n = .6 + .4 * Math.sin(tm * 3 + k);
    kyIsik(c, x, y, r * 3, .45 * n); g.globalAlpha = .85 * n; g.save(); g.translate(x, y); g.rotate(a * .6 + k); g.drawImage(tane, -r, -r, r * 2, r * 2); g.restore();
  }
  g.globalAlpha = 1; g.restore();
}
// ── Yavrular: iki yandan hoplayarak gelir (4-6 sn), sonra vuruşta sırayla zıplar, ara ara döner; dorukta hep birlikte
function kyYavruDans(o, tm, a, on) {
  for (const d of o.dans) {
    const gel = smooth(clamp((a - 4 - d.i * .3) / 1.8, 0, 1)); if (gel <= 0) continue;
    const hedefX = o.x + d.yan * d.uz * o.rK, x = lerp(o.x + d.yan * (o.gen + 260), hedefX, gel), onde = d.i % 2 === 1;
    if (onde !== on) continue;
    const zy = typeof gyZeminTam === 'function' ? gyZeminTam(x, o.y) : null, y = zy != null && Math.abs(zy - o.y) < 3 * T ? zy : o.y;
    let hop, yon = -d.yan;
    if (gel < 1) hop = Math.abs(Math.sin(a * 7 + d.i)) * 18;   // gelirken seke seke
    else {
      const dor = a >= KAR_FIN.DORUK && a < KAR_FIN.DORUK + 4.5, per = KAR_FIN.VUR * 2, b = ((a - d.i * .12) % per) / per;
      hop = b < .5 ? Math.sin(b / .5 * Math.PI) * (dor ? 44 : 22 + (d.i % 2) * 8) : 0;
      if (Math.floor(a / 4.8) % 2 === 1 && Math.floor((a % 4.8) / 1.2) === d.i % 4) yon = d.yan;   // sırayla dönüp öbür yana bakar
    }
    const op = d.opt; op.yon = yon; op.zipla = clamp(hop / 20, 0, 1); op.sev = 1;
    g.globalAlpha = .18 * (1 - Math.min(.7, hop / 60)); g.fillStyle = '#2a2a55'; g.beginPath(); g.ellipse(x, y, 11, 2.4, 0, 0, KY_PI2); g.fill(); g.globalAlpha = 1;
    kyHayvanCiz(g, x, y - hop, 1.15, tm + d.i * 1.3, op);
  }
}
// ── Kardan adam (kardan.js'in çizicisi varsa): sağdan kayarak gelir, vuruşta sallanır ve kollarını açar
function kyKardanCiz(o, tm, a, on) {
  if (on || typeof kardanCiz !== 'function') return;
  if (typeof KARDAN !== 'undefined' && KARDAN && KARDAN.takipci) return;   // kardan.js'in takipçisi finalde zaten Feza'nın yanında dans ediyor (iki kardan adam olmasın)
  const v = kyV7(); if (v && v.kardan === false && typeof KARDAN !== 'undefined') return;   // kardan adam yapılmadıysa gelmez
  const gel = smooth(clamp((a - 4.5) / 2.2, 0, 1)); if (gel <= 0) return;
  const x = lerp(o.x + o.gen + 300, o.x + 95 * o.rK + 220 * o.rK, gel), b = (a % (KAR_FIN.VUR * 2)) / (KAR_FIN.VUR * 2), dor = a >= KAR_FIN.DORUK && a < KAR_FIN.DORUK + 4.5;
  const hop = gel >= 1 && b < .5 ? Math.sin(b / .5 * Math.PI) * (dor ? 24 : 10) : 0, op = o.kdOpt;
  op.dans = gel >= 1 ? 1 : 0; op.yon = -1; op.zipla = clamp(hop / 20, 0, 1); op.el = .5 + .5 * Math.sin(a * Math.PI / KAR_FIN.VUR); op.mutlu = 1;
  try { kardanCiz(g, x, o.y - hop, 1, tm, op); } catch (e) {}
}

// ═══════════════════════════════ dokunma (kar feneri) ═══════════════════════════════
// Yalnız görünen sönük fenerin üstüne gelen dokunuş bu nesnenindir; başka her dokunuş normal yürüme kontrolüne gider.
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 7 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0 || P.kilit > .05) return;
  const v = kyV7(); if (v && v.final) return;
  if (typeof KARDAN !== 'undefined' && KARDAN && KARDAN.aktif) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  let en = null, best = 1;
  for (const o of NESNELER) {
    if (o.tip !== 'karFener' || o.yandi || Math.abs(o.x - P.x) > 900) continue;
    const cy = o.asili ? o.y - o.h - KY_FC * o.s : o.y + KY_FC * o.s;
    const d = ((wx - o.x) / (44 * o.s)) ** 2 + ((wy - cy) / (52 * o.s)) ** 2;
    if (d < best) { best = d; en = o; }
  }
  if (!en) return;
  e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
  kyFenerYak(en, 'dokunus');
}, true);
