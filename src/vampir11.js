/* vampir11.js — Ay Işığı Şatosu'nun sevimli vampir ailesi ve gece dostları (VAMPIR).
   Ortak çiziciler (başkaları typeof kontrolüyle çağırır):
     vampirCiz(c, kim, x, y, s, t, o)  kim: 'kiz' (Vela) | 'dede' | 'nine' | 'bebek' (Pıtır); taban ortası (x, y), s = ölçek (1 ≈ Feza boyu:
       Vela ≈ 62 birim, Dede ≈ 86, Nine ≈ 80, Pıtır ≈ 38).
       o: { yon: ±1, poz: 'dur'|'el'|'alkis'|'dans'|'otur'|'ucus'|'kikir'|'sasir'|'org'|'karistir'|'sevin'|'kucak',
            mutlu 0..1, pelerin 0..1 (açıklık; verilmezse poza göre), agiz 0..1 (konuşma; verilmezse OLAY 'konusma' vk_/vd_/vn_/vb_ ile
            kendiliğinden oynar), kirp (1 = gözler kapalı; kirpTek: 1 ile yalnız öndeki göz kırpar), faz (dans saati sn; 104 BPM 3/4 vals), gorunmez 0..1 (ayna şakası),
            tac 0..1 (Vela görünmezken tacı + kurdelesi havada süzülsün), uyku (gözler kapalı, derin nefes), onluk (Nine'nin önlüğü;
            'karistir' pozunda kendiliğinden; Nine 'karistir'de kucağında pembe krema kâsesi + çırpma teli), don 0..1 (vals dönüşü:
            yatay dönüş), bakX/bakY −1..1 (bakış), alfa 0..1, otur (herhangi pozda oturarak; (x, y) = oturak yüzü, bacaklar sarkar, ayaklar
            sallanır), el 0..1 (herhangi pozda ön elle el sallama), bebek: poz (yalnız 'kucak': Pıtır kucakta, ör. 'alkis'|'el'|'dans'|'otur'),
            figur 'gobek'|'papyon'|'pelerin'|'zipla'|'takla'|'egil'|'vals' + fu 0..1 (org figürleri; gövdenin dış hareketini çağıran verir),
            golgeYok }
       Yarı saydamken (alfa/gorunmez) karakter ara tuvalde tek parça çizilir (parçalar üst üste "röntgen" gibi görünmez).
     hayalet11Ciz(c, x, y, s, t, o)    gövde ortası (x, y); o: { yon, mutlu, kik 0..1, alfa, ton 0..3 (beyaz/pembe/nane/lila), el 0..1, uyku, isik 0..1 }
     yarasa11Ciz(c, x, y, s, t, o)     gövde ortası; o: { kanat (verilmezse kendiliğinden çırpar; sayı = 0..1 kanat konumu), yon, uyku (baş aşağı
                                        asılı, kanatlar sarılı), goz 0..1 (uykudayken gözünü açma), mutlu }
   Nesne türleri: vampirDurak {kim: 'kiz'|'bebek', an: 'karsila'|'besik'} (karşılama; takip etmez), hayaletDekor, yarasaDekor {uyku}.
   OLAY 'vampirDurak' {o, kim, an: 'selam'|'veda'|'uyandi'} (ses kancası, MUZIK).
   KORKUTUCU YOK: tombul, pembe yanaklı, iri parlak (kırmızı olmayan) gözler, İKİ MİNİK YUVARLAK UÇLU diş; kan/tabut yok.
   Performans: bütün parçalar ilk kullanımda bir kez önbellek tuvaline çizilir (gradyanlar yalnız orada); karede yalnız drawImage +
   küçük göz/ağız yolları. Sözleşme: src/BOLUM11.md. Önek: vp11. */
'use strict';
const VP11_PI2 = Math.PI * 2;
const VP11_BAR = 3 * 60 / 104;   // vals ölçüsü (sn): 3/4, 104 BPM
const VP11_BOS = {};
const VP11_KONTUR = 'rgba(42,24,72,0.55)';
function vp11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function vp11Isik(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }

// ═══════════════════════════════ önbellek tuvalleri ═══════════════════════════════
const VP11_SPR = new Map();
function vp11Tuval(ad, x0, y0, w, h, fn, K) {
  let c = VP11_SPR.get(ad); if (c) return c;
  K = K || 6;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; VP11_SPR.set(ad, c); return c;
}
function vp11Koy(c, sp, x, y) { c.drawImage(sp, x + sp.x0, y + sp.y0, sp.w, sp.h); }
function vp11Lin(q, x0, y0, x1, y1, st) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function vp11Rad(q, x0, y0, r0, x1, y1, r1, st) { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function vp11Yildiz(q, x, y, r, ic, rot) {
  q.beginPath();
  for (let i = 0; i < 10; i++) { const a = (rot || 0) - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * (ic || 0.46) : r; i ? q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : q.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  q.closePath();
}
function vp11Isilti(q, x, y, r) {
  q.beginPath(); q.moveTo(x, y - r); q.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y); q.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  q.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y); q.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r); q.closePath();
}
function vp11Fiyonk(q, x, y, r, renk, koyu) {   // minik kurdele fiyonk
  q.fillStyle = renk; q.strokeStyle = koyu; q.lineWidth = Math.max(0.5, r * 0.18);
  for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(x, y); q.quadraticCurveTo(x + sx * r * 1.1, y - r * 0.95, x + sx * r * 1.15, y + r * 0.05); q.quadraticCurveTo(x + sx * r * 0.9, y + r * 0.75, x, y); q.closePath(); q.fill(); q.stroke(); }
  q.beginPath(); q.moveTo(x - r * 0.15, y + r * 0.2); q.lineTo(x - r * 0.45, y + r * 1.05); q.moveTo(x + r * 0.15, y + r * 0.2); q.lineTo(x + r * 0.5, y + r * 1.0); q.stroke();
  q.beginPath(); q.arc(x, y, r * 0.32, 0, VP11_PI2); q.fill(); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.6)'; q.beginPath(); q.arc(x - r * 0.62, y - r * 0.35, r * 0.17, 0, VP11_PI2); q.fill();
}
function vp11Golge() {
  return vp11Tuval('golge', -40, -10, 80, 20, q => { q.scale(1, 0.25); q.fillStyle = vp11Rad(q, 0, 0, 0, 0, 0, 38, [0, 'rgba(30,16,60,0.45)', 0.6, 'rgba(30,16,60,0.2)', 1, 'rgba(30,16,60,0)']); q.beginPath(); q.arc(0, 0, 38, 0, VP11_PI2); q.fill(); }, 2);
}

// ═══════════════════════════════ ortak parçalar: kol, el, pelerin, yaka ═══════════════════════════════
function vp11KolSpr(ad, uz, gen, c1, c2, mans) {   // kabarık kol parçası (0,0) → (0,uz); mans: manşet rengi
  return vp11Tuval(ad, -gen - 2, -gen - 2, gen * 2 + 4, uz + gen + 6, q => {
    q.beginPath(); q.moveTo(-gen, 0); q.quadraticCurveTo(-gen - 0.8, uz * 0.6, -gen * 0.75, uz); q.quadraticCurveTo(0, uz + gen * 0.5, gen * 0.75, uz); q.quadraticCurveTo(gen + 0.8, uz * 0.6, gen, 0); q.quadraticCurveTo(0, -gen * 1.1, -gen, 0); q.closePath();
    q.fillStyle = vp11Lin(q, -gen, 0, gen, 0, [0, c1, 1, c2]); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.9; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.22)'; q.beginPath(); q.ellipse(-gen * 0.35, uz * 0.35, gen * 0.28, uz * 0.3, 0.05, 0, VP11_PI2); q.fill();
    if (mans) { q.fillStyle = mans; q.beginPath(); q.ellipse(0, uz - 0.2, gen * 0.85, gen * 0.42, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(80,50,130,0.45)'; q.lineWidth = 0.6; q.stroke(); }
  });
}
function vp11ElSpr(ad, r, ten, golge) {   // tombul el (yumru başparmaklı)
  return vp11Tuval(ad, -r - 2, -r - 2, 2 * r + 4, 2 * r + 4, q => {
    q.fillStyle = vp11Rad(q, -r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1, [0, '#fff4ec', 0.45, ten, 1, golge]);
    q.beginPath(); q.arc(0, 0, r, 0, VP11_PI2); q.fill(); q.beginPath(); q.arc(-r * 0.72, -r * 0.42, r * 0.42, 0, VP11_PI2); q.fill();
    q.strokeStyle = 'rgba(180,110,90,0.55)'; q.lineWidth = 0.7; q.beginPath(); q.arc(0, 0, r, -2.2, 3.6); q.stroke(); q.beginPath(); q.arc(-r * 0.72, -r * 0.42, r * 0.42, 2.0, 5.3); q.stroke();
  }, 8);
}
// Yarım pelerin (sol yarı): omuz pivotu (0,0), aşağı L, dışa W. Dışı gece moru, içi (astar) çilek kırmızısı; alt kenar yarasa kanadı
// gibi yuvarlak dilimli (sivri değil). Açılınca (döndürülünce) kanat gibi görünür; önden bakınca astar görünür.
function vp11PelerinSpr(ad, L, W, dis, disA, ast, astA, yildiz, dison) {
  return vp11Tuval(ad + (dison ? '_d' : ''), -W - 3, -3, W + 6, L + 6, q => {
    const yol = (k, dx) => {
      q.beginPath(); q.moveTo(0 + dx, 0);
      q.quadraticCurveTo(-W * 0.45 * k + dx, L * 0.06, -W * 0.72 * k + dx, L * 0.4);
      q.quadraticCurveTo(-W * 0.92 * k + dx, L * 0.7, -W * k + dx, L * 0.9 * (0.96 + 0.04 * k));
      const n = 3, y0 = L * 0.9 * (0.96 + 0.04 * k), y1 = L * k + L * (1 - k) * 0.93;
      for (let i = 0; i < n; i++) {   // yuvarlak dilimler (dıştan içe)
        const xa = -W * k * (1 - i / n) + dx, xb = -W * k * (1 - (i + 1) / n) + dx, ya = lerp(y0, y1, i / n), yb = lerp(y0, y1, (i + 1) / n);
        q.quadraticCurveTo((xa + xb) / 2, Math.max(ya, yb) + L * 0.07, xb, yb - L * 0.025);
      }
      q.lineTo(dx + 0, L * 0.05); q.closePath();
    };
    yol(1, 0); q.fillStyle = vp11Lin(q, -W, 0, 0, 0, [0, disA, 1, dis]); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.9; q.stroke();
    if (dison) {   // kapalıyken görünen dış yüz: gece moru kumaş, yumuşak kıvrımlar, altın ışıltılar, alt kenarda ince astar şeridi
      q.save(); yol(1, 0); q.clip();
      q.strokeStyle = ast; q.lineWidth = 1.6; q.beginPath(); yol(1, 0); q.stroke();
      q.fillStyle = vp11Lin(q, -W, 0, 0, 0, [0, disA, 0.6, dis, 1, dis]); yol(0.94, 0.2); q.fill();
      q.strokeStyle = 'rgba(20,10,50,0.35)'; q.lineWidth = 0.8; for (const u of [0.35, 0.68]) { q.beginPath(); q.moveTo(-W * u * 0.4, L * 0.1); q.quadraticCurveTo(-W * u * 0.85, L * 0.55, -W * u * 0.9, L * 0.92); q.stroke(); }
      q.fillStyle = 'rgba(200,180,255,0.22)'; q.beginPath(); q.ellipse(-W * 0.55, L * 0.4, W * 0.1, L * 0.25, 0.2, 0, VP11_PI2); q.fill();
      if (yildiz) { q.fillStyle = 'rgba(255,224,138,0.85)'; const r = rng(ad.length * 31 + 7); for (let i = 0; i < 5; i++) { vp11Isilti(q, -W * (0.2 + r() * 0.65), L * (0.15 + r() * 0.7), 0.8 + r() * 0.6); q.fill(); } }
      q.restore(); return;
    }
    // astar (içte; dış kenarda ince mor şerit kalır)
    q.save(); yol(1, 0); q.clip();
    yol(0.86, -0.4); q.fillStyle = vp11Lin(q, -W, 0, 0, L, [0, astA, 0.55, ast, 1, ast]); q.fill();
    q.strokeStyle = 'rgba(190,40,90,0.35)'; q.lineWidth = 0.8;   // kıvrım çizgileri
    for (const u of [0.35, 0.65]) { q.beginPath(); q.moveTo(-W * u * 0.4, L * 0.12); q.quadraticCurveTo(-W * u * 0.85, L * 0.55, -W * u * 0.86, L * 0.9); q.stroke(); }
    q.fillStyle = 'rgba(255,255,255,0.22)'; q.beginPath(); q.ellipse(-W * 0.32, L * 0.35, W * 0.12, L * 0.22, 0.25, 0, VP11_PI2); q.fill();
    q.restore();
    if (yildiz) { q.fillStyle = '#ffe08a'; const r = rng(ad.length * 97 + 11); for (let i = 0; i < 3; i++) { const u = 0.3 + i * 0.25; vp11Isilti(q, -W * (0.9 + 0.05 * r()) * (0.4 + 0.6 * u) * 0.98, L * u * 0.95, 0.9 + r() * 0.6); q.fill(); } }
  });
}
function vp11YakaSpr(ad, gen, boy, dis, ast) {   // dik, yuvarlak dilimli pelerin yakası (başın arkasında); boyun (0,0)
  return vp11Tuval(ad, -gen - 3, -boy - 3, gen * 2 + 6, boy + 6, q => {
    for (const sx of [-1, 1]) {
      const yol = k => { q.beginPath(); q.moveTo(sx * gen * 0.12, 1); q.quadraticCurveTo(sx * gen * 0.5 * k, -boy * 0.2, sx * gen * 0.82 * k, -boy * 0.82 * k);
        q.quadraticCurveTo(sx * gen * 1.02 * k, -boy * 1.02 * k, sx * gen * 0.86 * k, -boy * 0.62 * k); q.quadraticCurveTo(sx * gen * 1.0 * k, -boy * 0.3, sx * gen * 0.7, 1); q.closePath(); };
      yol(1); q.fillStyle = dis; q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.8; q.stroke();
      yol(0.8); q.fillStyle = ast; q.fill();
      q.fillStyle = 'rgba(255,255,255,0.25)'; q.beginPath(); q.ellipse(sx * gen * 0.55, -boy * 0.5, gen * 0.08, boy * 0.2, sx * 0.4, 0, VP11_PI2); q.fill();
    }
  });
}

// ═══════════════════════════════ VELA (vampir kız) ═══════════════════════════════
function vp11KizGovde() {   // taban (0,0): pembe pabuçlar, lila tayt, yıldızlı mor elbise, pembe kuşak + fiyonk, beyaz yaka
  return vp11Tuval('k_govde', -17, -33, 34, 36, q => {
    for (const sx of [-1, 1]) {
      q.fillStyle = '#d6c4fb'; q.beginPath(); q.roundRect ? q.roundRect(sx * 4 - 2.1, -13, 4.2, 11, 2) : q.rect(sx * 4 - 2.1, -13, 4.2, 11); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.7; q.stroke();
      q.fillStyle = '#ff5f86'; q.beginPath(); q.ellipse(sx * 4.6, -2.2, 4.3, 2.5, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(150,30,70,0.6)'; q.lineWidth = 0.7; q.stroke();
      q.strokeStyle = '#c93a64'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(sx * 4.6 - 2.4, -4); q.quadraticCurveTo(sx * 4.6, -3, sx * 4.6 + 2.4, -4); q.stroke();
      q.fillStyle = 'rgba(255,220,230,0.8)'; q.beginPath(); q.ellipse(sx * 4.6 - 1.4, -3.1, 1.6, 0.6, -0.1, 0, VP11_PI2); q.fill();
    }
    const yol = () => { q.beginPath(); q.moveTo(-5.5, -30); q.quadraticCurveTo(-9, -29, -9.5, -23); q.bezierCurveTo(-10, -18, -13, -15, -13.8, -10.5);
      for (let i = 0; i < 4; i++) { const xa = -13.8 + i * 6.9, xb = xa + 6.9; q.quadraticCurveTo((xa + xb) / 2, -6.2, xb, -10.5); }
      q.bezierCurveTo(13, -15, 10, -18, 9.5, -23); q.quadraticCurveTo(9, -29, 5.5, -30); q.quadraticCurveTo(0, -31.5, -5.5, -30); q.closePath(); };
    yol(); q.fillStyle = vp11Lin(q, -13, 0, 13, 0, [0, '#a98cee', 0.5, '#8262d6', 1, '#5c3daa']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = vp11Rad(q, -5, -22, 1, -5, -22, 16, [0, 'rgba(230,214,255,0.45)', 1, 'rgba(230,214,255,0)']); q.fillRect(-17, -33, 34, 30);
    const r = rng(1107); for (let i = 0; i < 11; i++) { q.fillStyle = 'rgba(255,233,168,' + (0.5 + r() * 0.4).toFixed(2) + ')'; vp11Isilti(q, -12 + r() * 24, -27 + r() * 15, 0.8 + r() * 0.7); q.fill(); }
    q.strokeStyle = '#e2d4ff'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-14, -12.4); for (let i = 0; i < 4; i++) { const xa = -13.8 + i * 6.9, xb = xa + 6.9; q.quadraticCurveTo((xa + xb) / 2, -8.4, xb, -12.4); } q.stroke();
    q.fillStyle = '#ff8fb5'; q.fillRect(-17, -22.4, 34, 2.8); q.fillStyle = 'rgba(255,255,255,0.35)'; q.fillRect(-17, -22.4, 34, 0.8);
    q.restore(); yol(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 1; q.stroke();
    vp11Fiyonk(q, 3.2, -21, 2.6, '#ff5f86', 'rgba(150,30,70,0.6)');
    for (const sx of [-1, 1]) { q.fillStyle = '#fff7fb'; q.beginPath(); q.ellipse(sx * 2.8, -29.4, 3.4, 2, sx * 0.25, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(150,120,190,0.6)'; q.lineWidth = 0.6; q.stroke(); }
    q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(0, -28.3, 1, 0, VP11_PI2); q.fill();
  });
}
function vp11KizBas() {   // baş (merkez 0,0): geriye taranmış koyu mor saç, ortada kıvrık perçem + pembe kurdele, sivri değil yuvarlak kulaklar
  return vp11Tuval('k_bas', -20, -20, 40, 38, q => {
    q.fillStyle = '#3b2d7c'; q.beginPath(); q.arc(0, -1.5, 15.8, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(30,16,70,0.6)'; q.lineWidth = 1; q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = '#ffd9cb'; q.beginPath(); q.ellipse(sx * 14.6, 1.5, 2.6, 3.8, sx * 0.45, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.7; q.stroke();
      q.fillStyle = 'rgba(240,150,150,0.5)'; q.beginPath(); q.ellipse(sx * 14.6, 1.7, 1.2, 2.2, sx * 0.45, 0, VP11_PI2); q.fill(); }
    const yuz = () => { q.beginPath(); q.moveTo(0, -13); q.bezierCurveTo(10, -13, 14.6, -6, 14.6, 1.5); q.bezierCurveTo(14.6, 10, 8.5, 14.2, 0, 14.2); q.bezierCurveTo(-8.5, 14.2, -14.6, 10, -14.6, 1.5); q.bezierCurveTo(-14.6, -6, -10, -13, 0, -13); q.closePath(); };
    yuz(); q.fillStyle = vp11Rad(q, -4, -4, 1, -1, 1, 18, [0, '#fff1ea', 0.55, '#ffdccd', 1, '#f2b6a4']); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.9; q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,118,150,0.5)'; q.beginPath(); q.ellipse(sx * 9.4 + 0.6, 5.6, 3.6, 2.4, 0, 0, VP11_PI2); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.arc(sx * 9.4 - 0.6, 4.7, 0.7, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#f2a08e'; q.beginPath(); q.ellipse(1, 3, 1.3, 1, 0, 0, VP11_PI2); q.fill();
    // saç: geriye taranmış, ortada yuvarlak "sivri saç" kıvrımı
    const sac = () => { q.beginPath(); q.moveTo(-15.4, 2.5); q.quadraticCurveTo(-17, -14, -4, -16.6); q.quadraticCurveTo(0, -17.4, 4, -16.6); q.quadraticCurveTo(17, -14, 15.4, 2.5);
      q.quadraticCurveTo(13.5, -5.5, 7.5, -8.4); q.quadraticCurveTo(3.2, -9.6, 1, -6.6); q.quadraticCurveTo(0, -5.6, -1, -6.6); q.quadraticCurveTo(-3.2, -9.6, -7.5, -8.4); q.quadraticCurveTo(-13.5, -5.5, -15.4, 2.5); q.closePath(); };
    sac(); q.fillStyle = vp11Lin(q, 0, -17, 0, 2, [0, '#5a49ae', 0.5, '#3f3088', 1, '#2e2266']); q.fill(); q.strokeStyle = 'rgba(30,16,70,0.6)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(150,130,230,0.55)'; q.lineWidth = 0.8;
    for (const sx of [-1, 1]) for (const k of [0, 1]) { q.beginPath(); q.moveTo(sx * (3 + k * 4), -9 - k * 0.5); q.quadraticCurveTo(sx * (6 + k * 5), -14.5 + k, sx * (2 + k * 3), -16.2 + k * 0.4); q.stroke(); }
    q.fillStyle = 'rgba(200,190,255,0.35)'; q.beginPath(); q.ellipse(-5, -13.5, 4.6, 1.4, -0.25, 0, VP11_PI2); q.fill();
    // kıvrık perçem
    q.strokeStyle = '#3f3088'; q.lineWidth = 2; q.beginPath(); q.moveTo(0, -7.4); q.bezierCurveTo(4.4, -9, 5.6, -4.4, 2.6, -3.6); q.bezierCurveTo(0.9, -3.3, 0.8, -5.4, 2.3, -5.6); q.stroke();
    q.strokeStyle = 'rgba(160,140,240,0.6)'; q.lineWidth = 0.6; q.beginPath(); q.moveTo(0.8, -7.6); q.bezierCurveTo(4, -8.6, 4.8, -5.4, 3.2, -4.6); q.stroke();
    vp11Fiyonk(q, -6.6, -11.4, 2.7, '#ff7a9a', 'rgba(150,30,70,0.6)');
  }, 7);
}
function vp11KizOrgu() {   // örgü (kök 0,0 → aşağı), ucunda çilek kırmızısı kurdele
  return vp11Tuval('k_orgu', -5, -2, 10, 20, q => {
    for (let i = 0; i < 3; i++) { const y = 2 + i * 3.6, r = 2.6 - i * 0.25; q.fillStyle = i % 2 ? '#3a2c7c' : '#4a3a98'; q.beginPath(); q.ellipse(0, y, r, 2.4, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(30,16,70,0.55)'; q.lineWidth = 0.6; q.stroke();
      q.strokeStyle = 'rgba(160,140,240,0.5)'; q.beginPath(); q.moveTo(-r * 0.6, y - 0.6); q.quadraticCurveTo(0, y + 0.8, r * 0.6, y - 0.6); q.stroke(); }
    q.fillStyle = '#3f3088'; q.beginPath(); q.moveTo(-1.2, 13); q.quadraticCurveTo(-2, 16, -0.4, 17); q.quadraticCurveTo(0.6, 16, 1.6, 17); q.quadraticCurveTo(2, 15, 1.2, 13); q.closePath(); q.fill();
    vp11Fiyonk(q, 0, 12.4, 2.3, '#ff4f7a', 'rgba(150,30,70,0.6)');
  }, 7);
}
function vp11KizTac() {   // yıldızlı minik taç; taban ortası (0,0)
  return vp11Tuval('k_tac', -9, -9, 18, 11, q => {
    q.strokeStyle = '#c98a22'; q.lineWidth = 0.6;
    q.fillStyle = '#ffd36a'; q.beginPath(); q.moveTo(-7, 0.6); q.quadraticCurveTo(0, -1.8, 7, 0.6); q.lineTo(6.6, 1.6); q.quadraticCurveTo(0, -0.6, -6.6, 1.6); q.closePath(); q.fill(); q.stroke();
    for (const [x, y, r] of [[-4.6, -2.2, 2.1], [4.6, -2.2, 2.1], [0, -4.4, 3.2]]) { q.fillStyle = '#ffd36a'; vp11Yildiz(q, x, y, r, 0.5); q.fill(); q.stroke(); q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(x - r * 0.25, y - r * 0.2, r * 0.22, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#ff7a9a'; q.beginPath(); q.arc(0, -0.3, 0.9, 0, VP11_PI2); q.fill();
  }, 9);
}

// ═══════════════════════════════ VAMPİR DEDE ═══════════════════════════════
function vp11DedeGovde() {   // taban (0,0): tombul göbek, eflatun yelek (altın düğmeler, köstek), beyaz gömlek, çilek papyon
  return vp11Tuval('d_govde', -25, -52, 50, 55, q => {
    for (const sx of [-1, 1]) {
      q.fillStyle = '#2d2662'; q.beginPath(); q.roundRect ? q.roundRect(sx * 7 - 3.6, -14, 7.2, 12, 2.5) : q.rect(sx * 7 - 3.6, -14, 7.2, 12); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.8; q.stroke();
      q.fillStyle = '#2a2040'; q.beginPath(); q.ellipse(sx * 7.6, -2.6, 6, 3, 0, 0, VP11_PI2); q.fill(); q.stroke();
      q.fillStyle = 'rgba(190,170,240,0.6)'; q.beginPath(); q.ellipse(sx * 7.6 - 2, -4, 2.4, 0.8, -0.1, 0, VP11_PI2); q.fill();
    }
    // ceket (göbeği saran)
    const ceket = () => { q.beginPath(); q.moveTo(-9, -48); q.quadraticCurveTo(-19, -46, -20.5, -34); q.bezierCurveTo(-22.5, -22, -20, -12, -12, -9.5); q.quadraticCurveTo(0, -7, 12, -9.5); q.bezierCurveTo(20, -12, 22.5, -22, 20.5, -34); q.quadraticCurveTo(19, -46, 9, -48); q.quadraticCurveTo(0, -50, -9, -48); q.closePath(); };
    ceket(); q.fillStyle = vp11Lin(q, -21, 0, 21, 0, [0, '#544896', 0.45, '#3a2f7a', 1, '#251d55']); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 1; q.stroke();
    // yelek (göbek)
    const yelek = () => { q.beginPath(); q.moveTo(-6.5, -44); q.quadraticCurveTo(-15, -36, -15, -25); q.quadraticCurveTo(-14.5, -13, -6, -10.5); q.quadraticCurveTo(0, -9, 6, -10.5); q.quadraticCurveTo(14.5, -13, 15, -25); q.quadraticCurveTo(15, -36, 6.5, -44); q.lineTo(0, -35); q.closePath(); };
    yelek(); q.fillStyle = vp11Rad(q, -4, -30, 1, 0, -26, 18, [0, '#b06cc8', 0.5, '#8c4aa8', 1, '#673485']); q.fill(); q.strokeStyle = 'rgba(60,20,70,0.55)'; q.lineWidth = 0.8; q.stroke();
    q.save(); yelek(); q.clip(); q.strokeStyle = 'rgba(255,200,240,0.18)'; q.lineWidth = 0.7; for (let x = -16; x < 16; x += 2.4) { q.beginPath(); q.moveTo(x, -46); q.lineTo(x + 1, -8); q.stroke(); } q.restore();
    // gömlek V'si + papyon
    q.fillStyle = '#fbf6ff'; q.beginPath(); q.moveTo(-6.5, -44.2); q.lineTo(6.5, -44.2); q.lineTo(0, -35.4); q.closePath(); q.fill(); q.strokeStyle = 'rgba(150,130,190,0.6)'; q.lineWidth = 0.6; q.stroke();
    // altın düğmeler + köstek
    for (const y of [-31, -24.5, -18]) { q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(0, y, 1.3, 0, VP11_PI2); q.fill(); q.strokeStyle = '#b97f22'; q.lineWidth = 0.5; q.stroke(); q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(-0.4, y - 0.4, 0.4, 0, VP11_PI2); q.fill(); }
    q.strokeStyle = '#ffd36a'; q.lineWidth = 0.7; q.beginPath(); q.moveTo(0.8, -24.5); q.quadraticCurveTo(5, -19.5, 10, -23.5); q.stroke();
    q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(10.6, -23, 1.6, 0, VP11_PI2); q.fill(); q.strokeStyle = '#b97f22'; q.lineWidth = 0.5; q.stroke();
    // göbek parıltısı
    q.fillStyle = 'rgba(255,230,255,0.25)'; q.beginPath(); q.ellipse(-6, -29, 4, 6, 0.25, 0, VP11_PI2); q.fill();
    // ceket yakaları
    for (const sx of [-1, 1]) { q.fillStyle = '#2b2266'; q.beginPath(); q.moveTo(sx * 6.5, -44.5); q.quadraticCurveTo(sx * 11, -42, sx * 12.5, -35); q.quadraticCurveTo(sx * 10, -37, sx * 7.4, -38); q.closePath(); q.fill(); q.strokeStyle = 'rgba(160,140,230,0.4)'; q.lineWidth = 0.6; q.stroke(); }
  });
}
function vp11Papyon() {   // çilek kırmızısı puantiyeli papyon; merkez (0,0) (Dede'nin boynunda −43; org figüründe fırıl fırıl döner)
  return vp11Tuval('d_papyon', -8, -5, 16, 10, q => {
    for (const sx of [-1, 1]) { q.fillStyle = '#ff4f7a'; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(sx * 4, -4.2, sx * 6.4, -2.6); q.quadraticCurveTo(sx * 7, 0.2, sx * 6.2, 2.6); q.quadraticCurveTo(sx * 4, 3.8, 0, 0); q.closePath(); q.fill(); q.strokeStyle = 'rgba(150,20,60,0.65)'; q.lineWidth = 0.6; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.85)'; for (const [dx, dy] of [[3, -1.6], [5, 1], [4.6, -2.4]]) { q.beginPath(); q.arc(sx * dx, dy, 0.55, 0, VP11_PI2); q.fill(); } }
    q.fillStyle = '#ff6e92'; q.beginPath(); q.ellipse(0, 0, 1.7, 2, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(150,20,60,0.65)'; q.stroke();
  }, 8);
}
function vp11KaseSpr() {   // Nine'nin pembe krema kâsesi (lila seramik); taban ortası (0,0)
  return vp11Tuval('n_kase', -10, -12, 20, 13, q => {
    q.fillStyle = '#ffd6e6'; for (const [x, y, r] of [[-4, -7, 3.4], [0, -8.6, 3.8], [4, -7, 3.4], [1, -10.4, 2]]) { q.beginPath(); q.arc(x, y, r, 0, VP11_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(-1, -9.6, 1.3, 0, VP11_PI2); q.fill();
    q.fillStyle = '#ff4f7a'; q.beginPath(); q.arc(2.4, -11.2, 1.3, 0, VP11_PI2); q.fill();
    q.beginPath(); q.moveTo(-9, -6); q.lineTo(9, -6); q.quadraticCurveTo(8.4, 0, 0, 0.4); q.quadraticCurveTo(-8.4, 0, -9, -6); q.closePath();
    q.fillStyle = vp11Lin(q, -9, 0, 9, 0, [0, '#d9c8ff', 1, '#9c84e4']); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.7; q.stroke();
    q.fillStyle = '#c39bff'; q.beginPath(); q.ellipse(0, -6, 9, 1.4, 0, 0, VP11_PI2); q.fill(); q.stroke();
    q.fillStyle = '#ffffff'; for (const x of [-5, 0, 5]) { q.beginPath(); q.moveTo(x, -2); q.bezierCurveTo(x - 1.4, -3.2, x - 1, -4.4, x, -3.6); q.bezierCurveTo(x + 1, -4.4, x + 1.4, -3.2, x, -2); q.fill(); }
  }, 8);
}
function vp11DedeBas() {   // baş (merkez 0,0): gümüş geriye taranmış saç, gür gümüş favoriler, gür kaşlar, düğme burun
  return vp11Tuval('d_bas', -22, -21, 44, 40, q => {
    q.fillStyle = '#c3c9e0'; q.beginPath(); q.arc(0, -1, 16.8, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(90,90,140,0.55)'; q.lineWidth = 1; q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = '#ffd6c6'; q.beginPath(); q.ellipse(sx * 16.6, 1.5, 2.8, 4.2, sx * 0.5, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.7; q.stroke(); }
    const yuz = () => { q.beginPath(); q.moveTo(0, -14); q.bezierCurveTo(11, -14, 16, -7, 16, 1.5); q.bezierCurveTo(16, 11, 9.5, 15.5, 0, 15.5); q.bezierCurveTo(-9.5, 15.5, -16, 11, -16, 1.5); q.bezierCurveTo(-16, -7, -11, -14, 0, -14); q.closePath(); };
    yuz(); q.fillStyle = vp11Rad(q, -4, -4, 1, -1, 1, 20, [0, '#ffefe6', 0.55, '#ffd8c8', 1, '#efb09c']); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(220,150,130,0.45)'; q.lineWidth = 0.8; q.beginPath(); q.ellipse(0, 12.6, 5.5, 1.8, 0, 0.25, Math.PI - 0.25); q.stroke();   // tombul çene
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,118,150,0.5)'; q.beginPath(); q.ellipse(sx * 10.4 + 0.6, 6, 4, 2.7, 0, 0, VP11_PI2); q.fill(); q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(sx * 10.4 - 0.8, 5, 0.75, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#f29c86'; q.beginPath(); q.arc(1.2, 3.6, 2.6, 0, VP11_PI2); q.fill(); q.fillStyle = 'rgba(255,240,230,0.7)'; q.beginPath(); q.arc(0.4, 2.8, 0.9, 0, VP11_PI2); q.fill();
    // favoriler (gür, yuvarlak)
    for (const sx of [-1, 1]) { const L = [[sx * 14.8, -3.5, 3], [sx * 15.4, 1, 3.2], [sx * 14.6, 5.6, 3], [sx * 13, 9.2, 2.5]];
      q.strokeStyle = 'rgba(90,90,140,0.5)'; q.lineWidth = 0.9; for (const [x, y, r] of L) { q.beginPath(); q.arc(x, y, r, 0, VP11_PI2); q.stroke(); }
      for (const [x, y, r] of L) { q.fillStyle = '#d4d9ec'; q.beginPath(); q.arc(x, y, r, 0, VP11_PI2); q.fill(); }
      for (const [x, y, r] of L) { q.fillStyle = '#f4f6ff'; q.beginPath(); q.arc(x - r * 0.15, y - r * 0.2, r * 0.7, 0, VP11_PI2); q.fill(); } }
    // geriye taranmış saç: şakaklarda açık, ortada yuvarlak sivri saç
    const sac = () => { q.beginPath(); q.moveTo(-15.5, -2); q.quadraticCurveTo(-16.5, -15, -4, -17.6); q.quadraticCurveTo(0, -18.4, 4, -17.6); q.quadraticCurveTo(16.5, -15, 15.5, -2);
      q.quadraticCurveTo(13.5, -10, 8.5, -11.8); q.quadraticCurveTo(3.5, -12.6, 1.2, -8); q.quadraticCurveTo(0, -6.4, -1.2, -8); q.quadraticCurveTo(-3.5, -12.6, -8.5, -11.8); q.quadraticCurveTo(-13.5, -10, -15.5, -2); q.closePath(); };
    sac(); q.fillStyle = vp11Lin(q, 0, -18, 0, -4, [0, '#f6f7ff', 1, '#bfc5de']); q.fill(); q.strokeStyle = 'rgba(90,90,140,0.55)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(140,140,190,0.5)'; q.lineWidth = 0.7;
    for (const sx of [-1, 1]) for (const k of [0, 1, 2]) { q.beginPath(); q.moveTo(sx * (2.5 + k * 3.6), -9.5 - k * 0.6); q.quadraticCurveTo(sx * (6 + k * 4), -15.6 + k, sx * (2 + k * 3), -17.6 + k * 0.6); q.stroke(); }
    // gür kaşlar
    q.strokeStyle = '#e6e9f6'; q.lineWidth = 2.2; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 6.4 + 1, -2.6, 4.4, Math.PI * 1.2, Math.PI * 1.8); q.stroke(); }
    q.strokeStyle = 'rgba(120,120,170,0.5)'; q.lineWidth = 0.5; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 6.4 + 1, -2.6, 5.4, Math.PI * 1.22, Math.PI * 1.78); q.stroke(); }
  }, 7);
}
function vp11DedeGozluk() {   // yuvarlak altın gözlük (gözlerin üstüne)
  return vp11Tuval('d_gozluk', -19, -8, 38, 13, q => {
    for (const sx of [-1, 1]) { const x = sx * 6.4 + 1;
      q.fillStyle = 'rgba(220,235,255,0.14)'; q.beginPath(); q.arc(x, 0.4, 5.2, 0, VP11_PI2); q.fill();
      q.strokeStyle = '#d6a038'; q.lineWidth = 1.1; q.stroke();
      q.strokeStyle = 'rgba(255,255,255,0.7)'; q.lineWidth = 0.8; q.beginPath(); q.arc(x, 0.4, 3.8, Math.PI * 1.08, Math.PI * 1.42); q.stroke(); }
    q.strokeStyle = '#d6a038'; q.lineWidth = 1; q.beginPath(); q.moveTo(-0.4, -0.6); q.quadraticCurveTo(1, -2.2, 2.4, -0.6); q.stroke();
    q.lineWidth = 0.9; q.beginPath(); q.moveTo(-10.6, -0.2); q.lineTo(-15.6, -1.4); q.moveTo(12.6, -0.2); q.lineTo(16.6, -1.4); q.stroke();
  }, 8);
}

// ═══════════════════════════════ VAMPİR NİNE ═══════════════════════════════
function vp11NineGovde() {   // taban (0,0): uzun lila elbise, dantel yaka, inci kolye
  return vp11Tuval('n_govde', -24, -47, 48, 50, q => {
    for (const sx of [-1, 1]) { q.fillStyle = '#4a3a7a'; q.beginPath(); q.ellipse(sx * 7, -2.2, 5.4, 2.8, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.7; q.stroke();
      q.fillStyle = 'rgba(200,180,250,0.6)'; q.beginPath(); q.ellipse(sx * 7 - 1.6, -3.4, 2.2, 0.7, -0.1, 0, VP11_PI2); q.fill(); }
    const yol = () => { q.beginPath(); q.moveTo(-6, -44); q.quadraticCurveTo(-12.5, -43, -13.5, -36); q.bezierCurveTo(-14.5, -26, -19, -14, -19.5, -5.2);
      for (let i = 0; i < 6; i++) { const xa = -19.5 + i * 6.5, xb = xa + 6.5; q.quadraticCurveTo((xa + xb) / 2, -1.2, xb, -5.2); }
      q.bezierCurveTo(19, -14, 14.5, -26, 13.5, -36); q.quadraticCurveTo(12.5, -43, 6, -44); q.quadraticCurveTo(0, -45.5, -6, -44); q.closePath(); };
    yol(); q.fillStyle = vp11Lin(q, -19, 0, 19, 0, [0, '#9c86e4', 0.45, '#7560c8', 1, '#4f3c9c']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = vp11Rad(q, -6, -30, 1, -6, -30, 22, [0, 'rgba(230,220,255,0.4)', 1, 'rgba(230,220,255,0)']); q.fillRect(-24, -47, 48, 50);
    const r = rng(2209); for (let i = 0; i < 14; i++) { q.fillStyle = 'rgba(255,200,225,' + (0.35 + r() * 0.3).toFixed(2) + ')'; q.beginPath(); q.arc(-16 + r() * 32, -38 + r() * 32, 0.7 + r() * 0.6, 0, VP11_PI2); q.fill(); }
    q.strokeStyle = '#d9ccff'; q.lineWidth = 1.8; q.beginPath(); q.moveTo(-20, -7.4); for (let i = 0; i < 6; i++) { const xa = -19.5 + i * 6.5, xb = xa + 6.5; q.quadraticCurveTo((xa + xb) / 2, -3.4, xb, -7.4); } q.stroke();
    q.fillStyle = '#ffb3d1'; q.fillRect(-24, -31.5, 48, 2.6); q.fillStyle = 'rgba(255,255,255,0.35)'; q.fillRect(-24, -31.5, 48, 0.7);
    q.restore(); yol(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 1; q.stroke();
    // dantel yaka
    q.fillStyle = '#fff8fd'; for (let i = 0; i < 7; i++) { const u = i / 6, x = lerp(-7.5, 7.5, u), y = -42.6 + Math.sin(u * Math.PI) * 2.6; q.beginPath(); q.arc(x, y, 1.9, 0, VP11_PI2); q.fill(); }
    q.strokeStyle = 'rgba(160,130,200,0.5)'; q.lineWidth = 0.4; for (let i = 0; i < 7; i++) { const u = i / 6, x = lerp(-7.5, 7.5, u), y = -42.6 + Math.sin(u * Math.PI) * 2.6; q.beginPath(); q.arc(x, y, 1.9, 0.2, Math.PI - 0.2); q.stroke(); }
    // inci kolye
    for (let i = 0; i < 11; i++) { const u = i / 10, x = lerp(-8, 8, u), y = -40.6 + Math.sin(u * Math.PI) * 5;
      q.fillStyle = '#fbf8ff'; q.beginPath(); q.arc(x, y, 1.05, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(150,130,190,0.6)'; q.lineWidth = 0.35; q.stroke();
      q.fillStyle = 'rgba(255,220,240,0.9)'; q.beginPath(); q.arc(x - 0.35, y - 0.35, 0.35, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#ff7a9a'; q.beginPath(); q.moveTo(0, -33); q.bezierCurveTo(-2.2, -34.4, -1.8, -36.6, 0, -35.6); q.bezierCurveTo(1.8, -36.6, 2.2, -34.4, 0, -33); q.fill();   // kalp kolye ucu
  });
}
function vp11NineOnluk() {   // mutfak önlüğü: krem, pembe fırfırlı, cebinde çilek
  return vp11Tuval('n_onluk', -14, -33, 28, 30, q => {
    const on = () => { q.beginPath(); q.moveTo(-10.5, -30); q.lineTo(10.5, -30); q.quadraticCurveTo(13, -18, 12, -7); q.quadraticCurveTo(0, -3.5, -12, -7); q.quadraticCurveTo(-13, -18, -10.5, -30); q.closePath(); };
    on(); q.fillStyle = vp11Lin(q, 0, -30, 0, -5, [0, '#fff8f2', 1, '#f6e2d6']); q.fill(); q.strokeStyle = 'rgba(176,130,120,0.7)'; q.lineWidth = 0.8; q.stroke();
    q.fillStyle = '#ffc2d8'; for (let i = 0; i < 8; i++) { const u = i / 7, x = lerp(-11.5, 11.5, u), y = -6.8 + Math.sin(u * Math.PI) * 3.2; q.beginPath(); q.arc(x, y, 1.9, 0, VP11_PI2); q.fill(); }
    q.strokeStyle = 'rgba(200,120,150,0.6)'; q.lineWidth = 0.6; q.setLineDash([1, 1]); q.beginPath(); q.roundRect ? q.roundRect(-5, -21, 10, 8, 2) : q.rect(-5, -21, 10, 8); q.stroke(); q.setLineDash([]);
    q.fillStyle = '#ff4f7a'; q.beginPath(); q.moveTo(0, -12.8); q.quadraticCurveTo(-3, -16, -2.4, -18); q.quadraticCurveTo(0, -19, 2.4, -18); q.quadraticCurveTo(3, -16, 0, -12.8); q.fill();
    q.fillStyle = '#7ccf6a'; q.beginPath(); q.ellipse(0, -18.6, 2, 0.8, 0, 0, VP11_PI2); q.fill();
    q.fillStyle = '#ffe9a8'; for (const [x, y] of [[-1, -16.4], [1, -15.6], [0, -14.4]]) { q.beginPath(); q.arc(x, y, 0.3, 0, VP11_PI2); q.fill(); }
  });
}
function vp11NineBas() {   // baş (merkez 0,0): gümüş-lila topuz + pembe kurdele, dalgalı geriye taranmış saç, inci küpeler
  return vp11Tuval('n_bas', -21, -30, 42, 48, q => {
    q.fillStyle = '#d9d1ef'; q.beginPath(); q.arc(0, -1.5, 16, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(110,96,160,0.55)'; q.lineWidth = 1; q.stroke();
    // topuz
    q.fillStyle = vp11Rad(q, -2, -21, 1, 0, -19, 8, [0, '#fbf8ff', 0.6, '#e2dbf4', 1, '#c4b8e4']); q.beginPath(); q.arc(0, -19, 7.4, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(110,96,160,0.55)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(150,130,200,0.6)'; q.lineWidth = 0.7; q.beginPath(); q.arc(0, -19, 4.6, 0.3, 4.6); q.stroke(); q.beginPath(); q.arc(0.5, -19.4, 2.2, 2, 6.6); q.stroke();
    vp11Fiyonk(q, 6.2, -14.8, 3, '#ff7a9a', 'rgba(150,30,70,0.6)');
    for (const sx of [-1, 1]) { q.fillStyle = '#ffd8cb'; q.beginPath(); q.ellipse(sx * 15.6, 1.5, 2.6, 3.8, sx * 0.45, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.7; q.stroke();
      q.fillStyle = '#fbf8ff'; q.beginPath(); q.arc(sx * 16, 6.2, 1.4, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(150,130,190,0.6)'; q.lineWidth = 0.4; q.stroke(); }
    const yuz = () => { q.beginPath(); q.moveTo(0, -13.2); q.bezierCurveTo(10.5, -13.2, 15.2, -6.5, 15.2, 1.5); q.bezierCurveTo(15.2, 10.5, 9, 14.8, 0, 14.8); q.bezierCurveTo(-9, 14.8, -15.2, 10.5, -15.2, 1.5); q.bezierCurveTo(-15.2, -6.5, -10.5, -13.2, 0, -13.2); q.closePath(); };
    yuz(); q.fillStyle = vp11Rad(q, -4, -4, 1, -1, 1, 19, [0, '#fff1ea', 0.55, '#ffdacb', 1, '#f0b3a0']); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.9; q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,118,150,0.5)'; q.beginPath(); q.ellipse(sx * 9.8 + 0.6, 6, 3.8, 2.6, 0, 0, VP11_PI2); q.fill(); q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(sx * 9.8 - 0.7, 5, 0.7, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#f2a08e'; q.beginPath(); q.ellipse(1, 3.2, 1.6, 1.3, 0, 0, VP11_PI2); q.fill();
    const sac = () => { q.beginPath(); q.moveTo(-15.4, 1); q.quadraticCurveTo(-17, -14.5, -4, -17); q.quadraticCurveTo(0, -17.8, 4, -17); q.quadraticCurveTo(17, -14.5, 15.4, 1);
      q.quadraticCurveTo(14.6, -4, 12, -6); q.quadraticCurveTo(10.5, -9.5, 7, -9.2); q.quadraticCurveTo(3.4, -10.4, 1.1, -7.2); q.quadraticCurveTo(0, -6, -1.1, -7.2); q.quadraticCurveTo(-3.4, -10.4, -7, -9.2); q.quadraticCurveTo(-10.5, -9.5, -12, -6); q.quadraticCurveTo(-14.6, -4, -15.4, 1); q.closePath(); };
    sac(); q.fillStyle = vp11Lin(q, 0, -18, 0, 0, [0, '#fbf9ff', 1, '#cfc5ea']); q.fill(); q.strokeStyle = 'rgba(110,96,160,0.55)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(160,140,210,0.55)'; q.lineWidth = 0.7;
    for (const sx of [-1, 1]) for (const k of [0, 1, 2]) { q.beginPath(); q.moveTo(sx * (2.5 + k * 3.8), -9.4 - k * 0.3); q.quadraticCurveTo(sx * (6.5 + k * 4), -14 + k, sx * (2 + k * 3.2), -16.8 + k * 0.6); q.stroke(); }
    q.strokeStyle = '#b9aedb'; q.lineWidth = 1.1; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 6 + 1, -3, 3.6, Math.PI * 1.22, Math.PI * 1.78); q.stroke(); }
  }, 7);
}

// ═══════════════════════════════ PITIR (bebek) ═══════════════════════════════
function vp11BebekGovde() {   // taban (0,0): lila tulum, göbekte altın hilal, pembe tabanlı minik ayaklar
  return vp11Tuval('b_govde', -13, -19, 26, 21, q => {
    const yol = () => { q.beginPath(); q.moveTo(-4.5, -16.5); q.quadraticCurveTo(-10.5, -14, -10.5, -7.5); q.quadraticCurveTo(-10.5, -1.5, -4, -1); q.quadraticCurveTo(0, -0.4, 4, -1); q.quadraticCurveTo(10.5, -1.5, 10.5, -7.5); q.quadraticCurveTo(10.5, -14, 4.5, -16.5); q.quadraticCurveTo(0, -17.6, -4.5, -16.5); q.closePath(); };
    yol(); q.fillStyle = vp11Rad(q, -3, -11, 1, 0, -8, 12, [0, '#e2d4ff', 0.5, '#b89cf0', 1, '#8a6ad0']); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.8; q.stroke();
    q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(0.6, -8.6, 3, 0, VP11_PI2); q.fill(); q.fillStyle = '#b89cf0'; q.beginPath(); q.arc(1.9, -9.4, 2.6, 0, VP11_PI2); q.fill();   // hilal
    q.fillStyle = '#fff3c4'; vp11Isilti(q, 3.6, -6, 0.9); q.fill();
    for (const sx of [-1, 1]) { q.fillStyle = '#d4c2ff'; q.beginPath(); q.ellipse(sx * 5.2, -1.6, 3.7, 2.4, 0, 0, VP11_PI2); q.fill(); q.strokeStyle = VP11_KONTUR; q.lineWidth = 0.6; q.stroke();
      q.fillStyle = '#ffb3d1'; q.beginPath(); q.ellipse(sx * 5.2, -0.9, 2.2, 1, 0, 0, VP11_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(-5, -11, 2, 3, 0.3, 0, VP11_PI2); q.fill();
  });
}
function vp11BebekBas() {   // iri yuvarlak baş (merkez 0,0): tepede tek koyu kıvrım, minik yuvarlak kulaklar
  return vp11Tuval('b_bas', -15, -16, 30, 30, q => {
    for (const sx of [-1, 1]) { q.fillStyle = '#ffdccf'; q.beginPath(); q.ellipse(sx * 11.2, 0.8, 2.1, 3, sx * 0.45, 0, VP11_PI2); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.5)'; q.lineWidth = 0.6; q.stroke(); }
    q.beginPath(); q.arc(0, 0, 11.5, 0, VP11_PI2); q.fillStyle = vp11Rad(q, -3, -3, 1, -1, 0, 13, [0, '#fff3ee', 0.55, '#ffe0d4', 1, '#f4bcab']); q.fill(); q.strokeStyle = 'rgba(190,120,100,0.55)'; q.lineWidth = 0.8; q.stroke();
    q.fillStyle = '#3f3088'; q.beginPath(); q.moveTo(-9.6, -6); q.quadraticCurveTo(-6, -12.4, 0, -11.6); q.quadraticCurveTo(6, -12.4, 9.6, -6); q.quadraticCurveTo(5, -9.4, 0.8, -7.4); q.quadraticCurveTo(0, -7, -0.8, -7.4); q.quadraticCurveTo(-5, -9.4, -9.6, -6); q.closePath(); q.fill();
    q.strokeStyle = '#3f3088'; q.lineWidth = 1.7; q.beginPath(); q.moveTo(0, -11); q.bezierCurveTo(1.5, -15.6, 5.6, -14, 4, -11.6); q.bezierCurveTo(3.2, -10.6, 1.8, -11.6, 2.8, -12.6); q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,118,150,0.55)'; q.beginPath(); q.ellipse(sx * 7.4 + 0.5, 4.2, 3, 2.1, 0, 0, VP11_PI2); q.fill(); q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.arc(sx * 7.4 - 0.6, 3.5, 0.6, 0, VP11_PI2); q.fill(); }
    q.fillStyle = '#f2a08e'; q.beginPath(); q.ellipse(0.8, 2.6, 1.1, 0.85, 0, 0, VP11_PI2); q.fill();
  }, 8);
}

// ═══════════════════════════════ karakter tanımları ═══════════════════════════════
// hy: baş merkezi (gövde çerçevesi), om: omuz (x,y), L1/L2 kol parçaları, el yarıçapı, pv: pelerin pivotu, pL/pW pelerin boyu/eni,
// gz: göz (x, y, rx, ry), ag: ağız (x, y, w), bel: gövdenin döndüğü bel yüksekliği, bacak: oturunca saklanan bacak boyu
const VP11_C = {
  kiz: { hy: -43, om: [7, -27.5], L1: 7.2, L2: 6.8, er: 2.7, pv: [5.5, -29], pL: 27, pW: 12, yk: [13, 13], gz: [5.9, -1.4, 3.2, 4.1], ag: [0.8, 8.6, 3.6], bel: -18, bacak: 10, kirpik: true,
    kol: ['k_kol', '#b597f2', '#7f5dd0', '#fff7fb'], ten: ['#ffdccd', '#f0b2a0'], pel: ['#3a2c74', '#5a48a8', '#ff4f7a', '#ff8aa8'] },
  dede: { hy: -64, om: [13, -45], L1: 11.5, L2: 11, er: 4.2, pv: [10.5, -47], pL: 45, pW: 20, yk: [21, 19], gz: [6.4, 0.4, 2.7, 3.5], ag: [1, 9.4, 4.2], bel: -26, bacak: 12,
    kol: ['d_kol', '#4d4290', '#2a2160', '#fbf6ff'], ten: ['#ffd8c8', '#eeae9a'], pel: ['#2a2158', '#43378a', '#ff4f7a', '#ff7a9a'] },
  nine: { hy: -60, om: [11, -41.5], L1: 10.5, L2: 10, er: 3.8, pv: [9, -43], pL: 31, pW: 15, yk: [17, 15], gz: [6, -1.6, 2.9, 3.7], ag: [0.9, 8.6, 3.8], bel: -24, bacak: 6, kirpik: true,
    kol: ['n_kol', '#9c86e4', '#5e4aa8', '#fff8fd'], ten: ['#ffdacb', '#efb09c'], pel: ['#3a2c74', '#54449c', '#ffb3d1', '#ffd0e2'] },
  bebek: { hy: -25, om: [6.6, -14.5], L1: 4.8, L2: 4.4, er: 2.3, pv: [5, -16], pL: 15, pW: 8, yk: [8.5, 7.5], gz: [4.6, 0.6, 2.8, 3.6], ag: [0.6, 6.4, 2.6], bel: -8, bacak: 3,
    kol: ['b_kol', '#cdb8fa', '#9a7ce0', null], ten: ['#ffe0d4', '#f2b8a6'], pel: ['#4b3a8c', '#6a58b8', '#ff7a9a', '#ffb3d1'] }
};
function vp11Parcalar(kim) {   // bir karakterin bütün sprite'ları (ilk kullanımda bir kez)
  const C = VP11_C[kim]; if (C.P) return C.P;
  const P = {};
  P.govde = kim === 'kiz' ? vp11KizGovde() : kim === 'dede' ? vp11DedeGovde() : kim === 'nine' ? vp11NineGovde() : vp11BebekGovde();
  P.bas = kim === 'kiz' ? vp11KizBas() : kim === 'dede' ? vp11DedeBas() : kim === 'nine' ? vp11NineBas() : vp11BebekBas();
  const k = C.kol;
  P.ust = vp11KolSpr(k[0] + 'u', C.L1, kim === 'dede' ? 4.4 : kim === 'nine' ? 3.9 : kim === 'kiz' ? 3 : 2.4, k[1], k[2], null);
  P.on = vp11KolSpr(k[0] + 'o', C.L2, kim === 'dede' ? 3.7 : kim === 'nine' ? 3.2 : kim === 'kiz' ? 2.5 : 2.1, k[1], k[2], k[3]);
  P.el = vp11ElSpr(kim + '_el', C.er, C.ten[0], C.ten[1]);
  const pc = C.pel; P.pel = vp11PelerinSpr(kim + '_pel', C.pL, C.pW, pc[0], pc[1], pc[2], pc[3], kim !== 'bebek'); P.pelD = vp11PelerinSpr(kim + '_pel', C.pL, C.pW, pc[0], pc[1], pc[2], pc[3], kim !== 'bebek', true);
  P.yaka = vp11YakaSpr(kim + '_yaka', C.yk[0], C.yk[1], pc[0], pc[2]);
  if (kim === 'kiz') { P.orgu = vp11KizOrgu(); P.tac = vp11KizTac(); }
  if (kim === 'dede') { P.gozluk = vp11DedeGozluk(); P.papyon = vp11Papyon(); }
  if (kim === 'nine') { P.onluk = vp11NineOnluk(); P.kase = vp11KaseSpr(); }
  C.P = P; return P;
}
function vp11Hazirla() { for (const k in VP11_C) vp11Parcalar(k); vp11Golge(); }

// ═══════════════════════════════ yüz: göz + ağız (karede, küçük yollar) ═══════════════════════════════
// md: 0 açık · 1 mutlu kavis (^ ^) · 2 kırpma/uyku çizgisi · 3 şaşkın (iri)
function vp11Goz(c, x, y, rx, ry, md, bx, by, kirpik, sx) {
  if (md === 1) { c.strokeStyle = '#3a2846'; c.lineWidth = Math.max(0.8, rx * 0.42); c.beginPath(); c.arc(x, y + ry * 0.45, rx * 1.05, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); return; }
  if (md === 2) { c.strokeStyle = '#3a2846'; c.lineWidth = Math.max(0.7, rx * 0.36); c.beginPath(); c.arc(x, y - ry * 0.1, rx * 1.0, Math.PI * 0.15, Math.PI * 0.85); c.stroke();
    if (kirpik) { c.beginPath(); c.moveTo(x + sx * rx * 0.95, y + ry * 0.25); c.lineTo(x + sx * rx * 1.4, y + ry * 0.05); c.stroke(); } return; }
  const k = md === 3 ? 1.18 : 1, RX = rx * k, RY = ry * k;
  c.fillStyle = '#2b2048'; c.beginPath(); c.ellipse(x + bx, y + by, RX, RY, 0, 0, VP11_PI2); c.fill();
  c.fillStyle = 'rgba(120,96,210,0.75)'; c.beginPath(); c.ellipse(x + bx + RX * 0.08, y + by + RY * 0.42, RX * 0.62, RY * 0.36, 0, 0, VP11_PI2); c.fill();   // menekşe yansıma
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x + bx - RX * 0.3, y + by - RY * 0.36, RX * 0.42, 0, VP11_PI2); c.fill();
  c.beginPath(); c.arc(x + bx + RX * 0.38, y + by + RY * 0.3, RX * 0.18, 0, VP11_PI2); c.fill();
  if (kirpik) { c.strokeStyle = '#2b2048'; c.lineWidth = Math.max(0.6, rx * 0.26); c.beginPath(); c.moveTo(x + sx * RX * 0.8, y - RY * 0.55); c.lineTo(x + sx * RX * 1.35, y - RY * 0.85); c.moveTo(x + sx * RX * 0.95, y - RY * 0.2); c.lineTo(x + sx * RX * 1.5, y - RY * 0.35); c.stroke(); }
}
// gülümseme + İKİ MİNİK YUVARLAK UÇLU diş (sivri değil); acik 0..1, uyku: minik "o"
function vp11Agiz(c, x, y, w, acik, dis, uyku) {
  if (uyku) { c.fillStyle = '#9a4a5e'; c.beginPath(); c.ellipse(x, y + w * 0.2, w * 0.28, w * 0.22, 0, 0, VP11_PI2); c.fill(); return; }
  const dr = w * 0.26;
  if (acik < 0.12) {
    c.strokeStyle = '#8a3a4a'; c.lineWidth = Math.max(0.7, w * 0.3); c.beginPath(); c.moveTo(x - w, y - 0.4); c.quadraticCurveTo(x, y + w * 0.8, x + w, y - 0.4); c.stroke();
    if (dis) {   // dudak çizgisinin hemen altında iki minik yuvarlak diş
      c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(150,90,110,0.6)'; c.lineWidth = Math.max(0.3, w * 0.07);
      for (const sx of [-1, 1]) { const u = 0.5 + sx * 0.24, px = x - w + 2 * w * u, py = (y - 0.4) * (1 - u) * (1 - u) + 2 * (1 - u) * u * (y + w * 0.8) + u * u * (y - 0.4);
        c.beginPath(); c.moveTo(px - dr, py); c.lineTo(px - dr, py + dr * 0.5); c.arc(px, py + dr * 0.5, dr, Math.PI, 0, true); c.lineTo(px + dr, py); c.closePath(); c.fill(); c.stroke(); }
    }
    return;
  }
  const d = w * (0.5 + 0.7 * acik);
  c.fillStyle = '#7a2c44'; c.beginPath(); c.moveTo(x - w, y - 0.6); c.quadraticCurveTo(x, y + 0.6, x + w, y - 0.6); c.quadraticCurveTo(x + w * 0.62, y + d, x, y + d); c.quadraticCurveTo(x - w * 0.62, y + d, x - w, y - 0.6); c.closePath(); c.fill();
  c.save(); c.clip(); c.fillStyle = '#ff8aa0'; c.beginPath(); c.ellipse(x, y + d, w * 0.58, d * 0.5, 0, 0, VP11_PI2); c.fill(); c.restore();
  c.strokeStyle = '#6a2238'; c.lineWidth = Math.max(0.5, w * 0.16); c.beginPath(); c.moveTo(x - w, y - 0.6); c.quadraticCurveTo(x, y + 0.6, x + w, y - 0.6); c.quadraticCurveTo(x + w * 0.62, y + d, x, y + d); c.quadraticCurveTo(x - w * 0.62, y + d, x - w, y - 0.6); c.stroke();
  if (dis) { c.fillStyle = '#ffffff'; for (const sx of [-1, 1]) { const px = x + sx * w * 0.45, py = y - 0.1 + Math.abs(sx * 0.45) * 0.2; c.beginPath(); c.moveTo(px - dr, py - 0.2); c.lineTo(px - dr, py + dr * 0.4); c.arc(px, py + dr * 0.4, dr, Math.PI, 0, true); c.lineTo(px + dr, py - 0.2); c.closePath(); c.fill(); } }
}

// ═══════════════════════════════ konuşma (OLAY 'konusma' → ağız kendiliğinden oynar) ═══════════════════════════════
const VP11_KON = { kiz: 0, dede: 0, nine: 0, bebek: 0 };   // konuşmanın bittiği an (now)
const VP11_ONEK = { vk_: 'kiz', vd_: 'dede', vn_: 'nine', vb_: 'bebek' };
OLAY.on('konusma', e => { if (!e || typeof e.anahtar !== 'string') return; const k = VP11_ONEK[e.anahtar.slice(0, 3)]; if (k) VP11_KON[k] = now + (isFinite(e.sure) ? e.sure : 2); });
function vp11KonusAgiz(kim, t) { return now < VP11_KON[kim] ? 0.35 + 0.35 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 5.3)) : 0; }

// ═══════════════════════════════ vampirCiz ═══════════════════════════════
const VP11_IKO = { ex: 0, ey: 0, hx: 0, hy: 0 };
function vp11IK(sx, sy, hx, hy, L1, L2, out) {   // iki parçalı kol: dirsek aşağıda/dışta kalan çözüm
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy);
  if (d < 1e-4) { dx = 0; dy = 1; d = 1e-4; }
  const dd = clamp(d, Math.abs(L1 - L2) + 0.3, L1 + L2 - 0.02), th = Math.atan2(dy, dx);
  const a = Math.acos(clamp((L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd), -1, 1));
  const e1x = sx + Math.cos(th + a) * L1, e1y = sy + Math.sin(th + a) * L1, e2x = sx + Math.cos(th - a) * L1, e2y = sy + Math.sin(th - a) * L1;
  if (e1y >= e2y) { out.ex = e1x; out.ey = e1y; } else { out.ex = e2x; out.ey = e2y; }
  out.hx = sx + Math.cos(th) * dd; out.hy = sy + Math.sin(th) * dd; return out;
}
function vp11Parca(c, sp, x0, y0, x1, y1) { const M = c.getTransform(); c.translate(x0, y0); c.rotate(Math.atan2(-(x1 - x0), y1 - y0)); vp11Koy(c, sp, 0, 0); c.setTransform(M); }
function vp11Kol(c, P, C, sx, sy, hx, hy) { vp11IK(sx, sy, hx, hy, C.L1, C.L2, VP11_IKO); const ex = VP11_IKO.ex, ey = VP11_IKO.ey, wx = VP11_IKO.hx, wy = VP11_IKO.hy; vp11Parca(c, P.ust, sx, sy, ex, ey); vp11Parca(c, P.on, ex, ey, wx, wy); VP11_IKO.hx = wx; VP11_IKO.hy = wy; }
const VP11_KUCAK = { yon: 1, poz: 'otur', otur: true, mutlu: 1, faz: 0, golgeYok: true, uyku: false };
const VP11_EL = [0, 0, 0, 0];   // ön el (x,y), arka el (x,y) — son çizilen karakterin gövde çerçevesinde (kucak vb. için)
const VP11_DIS = { onX: 0, onY: 0, arX: 0, arY: 0, basX: 0, basY: 0 };   // son çizimin dünya koordinatları: eller, baş (balo/kucak için)

// Yarı saydam çizim (ayna şakası, uzaklaşırken sönme): parçalar üst üste binip "röntgen" gibi görünmesin diye karakter önce ara tuvale
// tam opak çizilir, sonra tek parça olarak saydam konur (tek bir paylaşılan tuval; yalnız büyür).
let VP11_ARA = null;
function vp11Saydam(c, kim, x, y, s, t, o, al) {
  const M = c.getTransform(), sc = Math.hypot(M.a, M.b) * s, BX = 82, BY = 124, BW = 164, BH = 146;
  const cw = Math.ceil(BW * sc), ch = Math.ceil(BH * sc); if (!(cw > 0 && ch > 0) || cw * ch > 3e6) return false;
  if (!VP11_ARA) VP11_ARA = document.createElement('canvas');
  if (VP11_ARA.width < cw || VP11_ARA.height < ch) { VP11_ARA.width = Math.max(VP11_ARA.width, cw); VP11_ARA.height = Math.max(VP11_ARA.height, ch); VP11_ARA.q = null; }
  const q = VP11_ARA.q || (VP11_ARA.q = VP11_ARA.getContext('2d'));
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, cw + 2, ch + 2);
  q.setTransform(sc, 0, 0, sc, BX * sc, BY * sc);
  const a1 = o.alfa, g1 = o.gorunmez, t1 = o.tac; o.alfa = 1; o.gorunmez = 0; o.tac = 0; o.icCiz = true;
  try { vampirCiz(q, kim, 0, 0, 1, t, o); } finally { o.alfa = a1; o.gorunmez = g1; o.tac = t1; o.icCiz = false; }
  const a0 = c.globalAlpha; c.globalAlpha = a0 * al; c.drawImage(VP11_ARA, 0, 0, cw, ch, x - BX * s, y - BY * s, BW * s, BH * s); c.globalAlpha = a0;
  if (kim === 'kiz' && t1 > 0.01) { o.alfa = 0; const tg = o.gorunmez; o.gorunmez = 1; try { vampirCiz(c, kim, x, y, s, t, o); } finally { o.alfa = a1; o.gorunmez = tg; } }
  return true;
}
function vampirCiz(c, kim, x, y, s, t, o) {
  o = o || VP11_BOS; t = t || 0; s = s || 1;
  if (!(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(s))) return;
  if (!VP11_C[kim]) kim = 'kiz';
  const C = VP11_C[kim], P = vp11Parcalar(kim);
  const al = (o.alfa == null ? 1 : clamp(o.alfa, 0, 1)) * (1 - clamp(+o.gorunmez || 0, 0, 1));
  const tacA = kim === 'kiz' ? clamp(+o.tac || 0, 0, 1) : 0;
  if (al <= 0.01 && tacA <= 0.01) return;
  if (al > 0.01 && al < 0.985 && !o.icCiz && vp11Saydam(c, kim, x, y, s, t, o, al)) return;
  const yon = o.yon < 0 ? -1 : 1, poz = o.poz || 'dur', mut = o.mutlu == null ? 1 : clamp(o.mutlu, 0, 1);
  const fz = Number.isFinite(o.faz) ? o.faz : t, uyku = !!o.uyku;
  const L = C.L1 + C.L2, OX = C.om[0], OY = C.om[1];
  // ── poz → gövde hareketi + el hedefleri (gövde çerçevesi, +x baktığı yön)
  let hop = 0, sw = 0, sq = Math.sin(t * (uyku ? 1.2 : 2.3)) * (uyku ? 0.025 : 0.014), basE = Math.sin(t * 1.3) * 0.03, egil = 0, pel = 0.06, orguA = Math.sin(t * 2.1) * 0.08;
  let fx = OX + L * 0.3, fy = OY + L * 0.92, bx = -OX - L * 0.3, by = OY + L * 0.92, gozMd = 0, acik = 0, elOnde = false, otur = poz === 'otur' || !!o.otur, papA = 0;
  fx += Math.sin(t * 2.3) * 0.4; bx -= Math.sin(t * 2.3 + 1) * 0.4;
  if (poz === 'el') {
    const w = Math.sin(t * 9); fx = OX + L * 0.55 + w * L * 0.18; fy = OY - L * 0.8 + Math.abs(w) * L * 0.06; basE += 0.06; pel = 0.18; acik = 0.25 * mut;
  } else if (poz === 'alkis' || poz === 'sevin') {
    const k = Math.abs(Math.sin(t * 10.5));
    if (poz === 'alkis') { fx = OX * 0.2 + k * L * 0.32; fy = OY + L * 0.3; bx = -OX * 0.2 - k * L * 0.32; by = OY + L * 0.3; hop = Math.abs(Math.sin(t * 5.25)) * L * 0.12; }
    else { const h = Math.abs(Math.sin(t * 6.6)); hop = h * L * 0.55; sq += (h < 0.25 ? (0.25 - h) * 0.25 : -h * 0.03); fx = OX + L * 0.5; fy = OY - L * 0.85 + Math.sin(t * 6.6) * 1.2; bx = -OX - L * 0.5; by = OY - L * 0.85 + Math.sin(t * 6.6 + 1) * 1.2; pel = 0.45 + 0.25 * h; orguA += Math.cos(t * 6.6) * 0.5; }
    acik = 0.75; gozMd = poz === 'sevin' || k > 0.6 ? 1 : 0;
  } else if (poz === 'dans' || poz === 'vals') {
    const b = fz / VP11_BAR, ph = b * VP11_PI2, vur = (fz * 104 / 60) % 3, fr = vur % 1;
    sw = Math.sin(ph) * 0.11; basE += Math.sin(ph + 0.6) * 0.1;
    hop = vur < 1 ? 0 : Math.sin(fr * Math.PI) * L * 0.18; sq += vur < 1 ? Math.sin(fr * Math.PI) * 0.05 : 0;
    fx = OX + L * 0.82; fy = OY - L * 0.2 + Math.sin(ph) * L * 0.12; bx = -OX - L * 0.45; by = OY - L * 0.62 - Math.sin(ph) * L * 0.1;
    pel = 0.3 + 0.2 * Math.abs(Math.sin(ph)); orguA += Math.sin(ph + 1) * 0.5; acik = 0.55; gozMd = Math.sin(ph * 0.5) > 0.6 ? 1 : 0;
  } else if (poz === 'kikir') {
    const sh = Math.sin(t * 22) * 0.6; hop = Math.abs(Math.sin(t * 11)) * L * 0.06; sw = Math.sin(t * 11) * 0.03; basE += 0.08 + sh * 0.02;
    fx = OX * 0.15 + 0.4; fy = C.hy + C.ag[1] - 0.2 + sh * 0.5; bx = -OX * 0.5; by = OY + L * 0.55; gozMd = 1; acik = 0.4; elOnde = true;
  } else if (poz === 'sasir') {
    fx = OX * 0.55 + C.gz[0] * 0.95; fy = C.hy + C.gz[1] + C.gz[3] * 1.6; bx = -OX * 0.55 - C.gz[0] * 0.95; by = fy; gozMd = 3; acik = 0.6; elOnde = true; basE -= 0.05; hop = L * 0.05;
  } else if (poz === 'ucus') {
    egil = 0.42; pel = 1; fx = OX + L * 0.95; fy = OY - L * 0.15 + Math.sin(t * 4) * 1.5; bx = -OX - L * 0.95; by = OY - L * 0.1 + Math.sin(t * 4 + 1) * 1.5;
    orguA = -0.9 + Math.sin(t * 6) * 0.15; acik = 0.6; basE -= 0.25;
  } else if (poz === 'org') {
    const k1 = Math.abs(Math.sin(t * 7.3)), k2 = Math.abs(Math.sin(t * 6.1 + 1.3)); fx = OX + L * 0.75; fy = OY + L * 0.35 - k1 * L * 0.2; bx = -OX + L * 0.55; by = OY + L * 0.4 - k2 * L * 0.2;
    basE += Math.sin(t * 3.4) * 0.08; sw = Math.sin(t * 1.7) * 0.04; acik = 0.35;
  } else if (poz === 'karistir') {
    const ph = t * 3.2; fx = OX + L * 0.62 + Math.cos(ph) * L * 0.2; fy = OY + L * 0.62 + Math.sin(ph) * L * 0.07; bx = -OX * 0.2 + L * 0.3; by = OY + L * 0.7; sw = Math.sin(ph) * 0.02; egil = 0.05; acik = 0.2;
    if (kim === 'nine') { bx = -OX * 0.2 - 8; by = OY + L * 0.82 - 4; fx = 3 + Math.cos(ph) * 3.4; fy = OY + L * 0.82 - 17 + Math.sin(ph) * 1.4; }
  } else if (poz === 'kucak') {
    if (o.bebek) { fx = OX + 4; fy = OY + 17; bx = OX * 0.35; by = OY + 9; } else { fx = OX * 0.4 + L * 0.35; fy = OY + L * 0.72; bx = -OX * 0.2 + L * 0.2; by = OY + L * 0.55; }
    acik = 0.4; basE += 0.1;
  }
  // org figürleri (MINI2): gövdenin dış hareketini çağıran verir; burada yalnız iç hareket (kollar, yüz, papyon, göbek)
  const fig = o.figur, fu = clamp(+o.fu || 0, 0, 1);
  if (fig) {
    if (fig === 'gobek') { sw = Math.sin(fu * Math.PI * 6) * 0.09; sq += Math.abs(Math.sin(fu * Math.PI * 6)) * 0.03; fx = OX + 3; fy = C.bel + 4; bx = -OX - 3; by = C.bel + 4; acik = 0.9; gozMd = 1; }
    else if (fig === 'papyon') { papA = fu * VP11_PI2 * 2; gozMd = 3; acik = 0.6; fx = OX + L * 0.3; fy = OY + L * 0.5; bx = -OX - L * 0.4; by = OY + L * 0.6; }
    else if (fig === 'pelerin') { pel = 1; fx = OX + L * 0.95; fy = OY - L * 0.25; bx = -OX - L * 0.95; by = OY - L * 0.25; acik = 0.8; gozMd = fu > 0.3 && fu < 0.8 ? 1 : 0; }
    else if (fig === 'zipla') { fx = OX + L * 0.45; fy = OY - L * 0.9; bx = -OX - L * 0.45; by = OY - L * 0.9; acik = 0.9; gozMd = 1; pel = 0.5; }
    else if (fig === 'takla') { fx = OX * 0.3; fy = OY + L * 0.35; bx = -OX * 0.3; by = OY + L * 0.4; gozMd = 1; acik = 0.5; }
    else if (fig === 'egil') { egil = Math.sin(fu * Math.PI) * 0.35; fx = OX * 0.2; fy = OY + L * 0.35; bx = -OX - L * 0.9; by = OY + L * 0.15; acik = 0.4; gozMd = 1; }
    else if (fig === 'vals') { const ph = fu * VP11_PI2; fx = OX + L * 0.82; fy = OY - L * 0.2 + Math.sin(ph) * L * 0.12; bx = -OX - L * 0.45; by = OY - L * 0.62; pel = 0.35; acik = 0.6; }
  }
  if (o.el > 0) { const w = smooth(clamp(o.el, 0, 1)), ws = Math.sin(t * 9); fx = lerp(fx, OX + L * 0.55 + ws * L * 0.18, w); fy = lerp(fy, OY - L * 0.8, w); }
  if (o.pelerin != null) pel = clamp(o.pelerin, 0, 1);
  if (mut < 0.3) { acik *= 0.4; if (gozMd === 1) gozMd = 0; }
  const ka = o.agiz != null ? clamp(o.agiz, 0, 1) : vp11KonusAgiz(kim, t);
  if (ka > 0.02) acik = Math.max(acik * 0.4, ka);
  const kirp = o.kirp ? 1 : ((t * 0.97 + kim.length * 0.7) % 3.9) < 0.12 ? 1 : 0;
  let gozTek = -1;   // kirpTek: yalnız öndeki göz kırpar (göz kırpma şakası); öbür göz açık kalır
  if (uyku) { gozMd = 2; acik = 0; }
  else if (o.kirp && o.kirpTek) { gozTek = gozMd === 1 || gozMd === 2 ? 0 : gozMd; gozMd = 2; acik = Math.max(acik, 0.35); }
  else if (kirp && gozMd !== 1) gozMd = 2;
  const bakx = clamp(+o.bakX || 0, -1, 1) * C.gz[2] * 0.35 + C.gz[2] * 0.15, baky = clamp(+o.bakY || 0, -1, 1) * C.gz[3] * 0.25;
  const don = Number.isFinite(o.don) ? Math.cos(o.don * VP11_PI2) : 1, sxDon = Math.sign(don || 1) * (0.42 + 0.58 * Math.abs(don));   // dönüşte çizgi gibi incelmez: en dar yerde yön değiştirip açılır
  const otY = otur ? C.bacak : 0;   // oturunca (x, y) oturak yüzü (kalça)
  // ── çizim
  const M0 = c.getTransform(), a0 = c.globalAlpha;
  c.translate(x, y); c.scale(s * yon * sxDon, s);
  if (al > 0.01) {
    c.globalAlpha = a0 * al;
    if (!o.golgeYok) { const gs = 1 - Math.min(0.45, hop / (L * 2.5)), sp = vp11Golge(), gw = (kim === 'dede' ? 50 : kim === 'nine' ? 44 : kim === 'bebek' ? 24 : 30) * gs; c.globalAlpha = a0 * al * 0.75 * gs; c.drawImage(sp, -gw / 2, -gw * 0.125, gw, gw * 0.25); c.globalAlpha = a0 * al; }
    c.translate(0, otY - hop); c.translate(0, C.bel); c.rotate(sw + egil); c.scale(1 + sq, 1 - sq); c.translate(0, -C.bel);
    // pelerin yarıları (arkada): kapalıyken hafif dalgalanır, açılınca kanat gibi
    const dA = 1 - smooth(clamp((pel - 0.1) / 0.45, 0, 1)), pa = 0.1 + pel * 1.15 + Math.sin(t * 3 + kim.length) * 0.045 * (1 + pel), pax = 1 + pel * 0.35;
    for (const sd of [-1, 1]) { const M = c.getTransform(); c.translate(sd * C.pv[0], C.pv[1]); c.scale(sd < 0 ? 1 : -1, 1); c.rotate(pa + (sd > 0 ? 0.03 : 0)); c.scale(pax, 1); vp11Koy(c, P.pel, 0, 0); if (dA > 0.01) { c.globalAlpha = a0 * al * dA; vp11Koy(c, P.pelD, 0, 0); c.globalAlpha = a0 * al; } c.setTransform(M); }
    // arka kol
    vp11Kol(c, P, C, -OX, OY, bx, by); const bwx = VP11_IKO.hx, bwy = VP11_IKO.hy;
    // gövde (oturunca bacaklar gizlenir, dizler öne çıkar)
    if (otur) {
      c.save(); c.beginPath(); c.rect(-40, -200, 80, 200 - C.bacak); c.clip(); vp11Koy(c, P.govde, 0, 0); c.restore();
      const bc = kim === 'kiz' ? '#d6c4fb' : kim === 'dede' ? '#2d2662' : kim === 'nine' ? '#6e58c0' : '#c8b2f6', ac = kim === 'kiz' ? '#ff5f86' : kim === 'bebek' ? '#d4c2ff' : '#2a2040';
      const bu = C.bacak * 0.9, bw = C.L1 * (kim === 'dede' ? 0.34 : 0.3);
      for (const sd of [-1, 1]) {   // diz önde, baldır aşağı sarkar ve ayak sallanır
        const kx = sd * C.om[0] * 0.5 + 0.8, ky = -C.bacak + bw * 0.4, an = Math.sin(t * 3.1 + sd * 1.3) * 0.28;
        c.save(); c.translate(kx, ky); c.rotate(an); c.fillStyle = bc; c.beginPath(); c.roundRect ? c.roundRect(-bw, 0, bw * 2, bu, bw) : c.rect(-bw, 0, bw * 2, bu); c.fill(); c.strokeStyle = VP11_KONTUR; c.lineWidth = 0.6; c.stroke();
        c.fillStyle = ac; c.beginPath(); c.ellipse(0.6, bu, bw * 1.3, bw * 0.85, 0, 0, VP11_PI2); c.fill(); c.stroke(); c.restore();
        c.fillStyle = bc; c.beginPath(); c.ellipse(kx, ky, bw * 1.25, bw * 1.05, 0, 0, VP11_PI2); c.fill(); c.strokeStyle = VP11_KONTUR; c.lineWidth = 0.6; c.stroke();
      }
    } else vp11Koy(c, P.govde, 0, 0);
    if (kim === 'dede') { if (papA) { const M = c.getTransform(); c.translate(0, -43); c.rotate(papA); vp11Koy(c, P.papyon, 0, 0); c.setTransform(M); } else vp11Koy(c, P.papyon, 0, -43); }
    if (kim === 'nine' && (o.onluk || poz === 'karistir')) vp11Koy(c, P.onluk, 0, 0);
    // yaka (başın arkası), örgüler
    vp11Koy(c, P.yaka, 0, C.om[1] - 0.5);
    // ön kol (eller başın önündeyse sonra)
    vp11Kol(c, P, C, OX, OY, fx, fy); const fwx = VP11_IKO.hx, fwy = VP11_IKO.hy;
    if (poz === 'kucak' && o.bebek && kim !== 'bebek') {   // kucaktaki Pıtır (ön kolun üstünde oturur; eller onu tutar)
      const KB = VP11_KUCAK; KB.poz = o.bebek; KB.faz = fz + 0.4; KB.mutlu = 1; KB.uyku = false;
      vampirCiz(c, 'bebek', OX + 5, OY + 15, 0.85, t + 0.5, KB);
    }
    if (!elOnde) { vp11Koy(c, P.el, bwx, bwy + C.er * 0.4); vp11Koy(c, P.el, fwx, fwy + C.er * 0.4); }
    if (poz === 'karistir' && kim === 'nine') {   // krema kâsesi (arka elde) + çırpma teli (ön el kâsede döner)
      const kx = 2, ky = OY + L * 0.82 + 6, M = c.getTransform(); c.translate(kx, ky); c.scale(1.45, 1.45); vp11Koy(c, P.kase, 0, 0); c.setTransform(M);
      const tx = fwx + (kx - fwx) * 0.35, ty = ky - 12;   // çırpma teli: elden kâsenin kremasına
      c.strokeStyle = '#b8a07a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(fwx, fwy); c.lineTo(lerp(fwx, tx, 0.5), lerp(fwy, ty, 0.5)); c.stroke();
      c.strokeStyle = '#dfe4f4'; c.lineWidth = 0.6; for (const k of [-1, 0, 1]) { c.beginPath(); c.ellipse(tx + k * 0.6, ty + 1, 1.6 + Math.abs(k) * 0.6, 4, 0.2, 0, VP11_PI2); c.stroke(); }
      vp11Koy(c, P.el, bwx, bwy + C.er * 0.4); vp11Koy(c, P.el, fwx, fwy + C.er * 0.4);
    } else if (poz === 'karistir') {   // tahta kaşık
      c.strokeStyle = '#c98a4a'; c.lineWidth = C.er * 0.55; c.beginPath(); c.moveTo(fwx - 1, fwy - C.er * 1.2); c.lineTo(fwx + 2, fwy + C.er * 3.2); c.stroke();
      c.fillStyle = '#d99a58'; c.beginPath(); c.ellipse(fwx + 2.4, fwy + C.er * 3.6, C.er * 0.55, C.er * 0.8, -0.15, 0, VP11_PI2); c.fill();
    }
    // baş
    const M1 = c.getTransform(); c.translate(0, C.hy); c.rotate(basE);
    if (kim === 'kiz') for (const sd of [-1, 1]) { const M = c.getTransform(); c.translate(sd * 13.2, 1.5); c.rotate(-sd * 0.12 + orguA * (sd > 0 ? 1 : 0.8) * (poz === 'ucus' ? -sd : 1)); vp11Koy(c, P.orgu, 0, 0); c.setTransform(M); }
    vp11Koy(c, P.bas, 0, 0);
    const G = C.gz;
    for (const sd of [-1, 1]) vp11Goz(c, sd * G[0] + 0.8, G[1], G[2], G[3], gozTek >= 0 && sd < 0 ? gozTek : gozMd, bakx, baky, C.kirpik, sd);
    if (kim === 'dede') vp11Koy(c, P.gozluk, 0, 0);
    vp11Agiz(c, C.ag[0], C.ag[1], C.ag[2], acik * (0.4 + 0.6 * mut), kim !== 'bebek' || acik > 0.3, uyku);
    if (kim === 'kiz' && tacA <= 0.01) { const M = c.getTransform(); c.translate(0.5, -15.2); c.rotate(-0.05 + Math.sin(t * 1.7) * 0.03); vp11Koy(c, P.tac, 0, 0); c.setTransform(M); }
    c.setTransform(M1);
    if (elOnde) { vp11Koy(c, P.el, bwx, bwy); vp11Koy(c, P.el, fwx, fwy); }
    // dışarıya: ellerin ve başın dünya koordinatları
    { const M = c.getTransform(); VP11_DIS.onX = M.a * fwx + M.c * fwy + M.e; VP11_DIS.onY = M.b * fwx + M.d * fwy + M.f; VP11_DIS.arX = M.a * bwx + M.c * bwy + M.e; VP11_DIS.arY = M.b * bwx + M.d * bwy + M.f;
      VP11_DIS.basX = M.c * C.hy + M.e; VP11_DIS.basY = M.d * C.hy + M.f; }
  }
  if (tacA > 0.01) {   // görünmez Vela'nın havada süzülen tacı ve perçem kurdelesi
    c.setTransform(M0); c.translate(x, y); c.scale(s * yon, s);
    c.globalAlpha = a0 * tacA; const yy = C.hy - 15.2 + Math.sin(t * 2.2) * 1.2;
    const gco = c.globalCompositeOperation; c.globalCompositeOperation = 'lighter'; vp11Isik(c, '#ffe7a8', 0.5, yy - 3, 9, 0.35); c.globalCompositeOperation = gco;
    const M = c.getTransform(); c.translate(0.5, yy); c.rotate(Math.sin(t * 1.7) * 0.08); vp11Koy(c, P.tac, 0, 0); c.setTransform(M);
  }
  c.setTransform(M0); c.globalAlpha = a0;
}

vampirCiz.figur = true;   // org figürleri desteklenir (MINI2)
// ═══════════════════════════════ hayalet (pamuk beyazı, pastel, kıkırdayan) ═══════════════════════════════
const VP11_HTON = [['#ffffff', '#efe6ff', '#cdbcf2'], ['#fff6fa', '#ffe0ee', '#f2b6d0'], ['#f6fffb', '#dcf8ec', '#a6e2c8'], ['#fbf8ff', '#e8dcff', '#c4acf4']];
function vp11HayaletSpr(i) {   // gövde: yuvarlak baş, dalgalı alt kenar; merkez (0,0) ≈ yüz; r = 24 birim
  const T0 = VP11_HTON[i] || VP11_HTON[0];
  return vp11Tuval('hay' + i, -28, -28, 56, 58, q => {
    const yol = () => { q.beginPath(); q.moveTo(-21, 2); q.bezierCurveTo(-22, -16, -12, -25, 0, -25); q.bezierCurveTo(12, -25, 22, -16, 21, 2); q.bezierCurveTo(21, 12, 23, 18, 24, 22);
      const n = 4; for (let k = 0; k < n; k++) { const xa = 24 - k * 12, xb = xa - 12; q.quadraticCurveTo((xa + xb) / 2 + 1, k % 2 ? 22 : 30, xb, 22 + (k === n - 1 ? 0 : 0)); }
      q.bezierCurveTo(-23, 18, -21, 12, -21, 2); q.closePath(); };
    yol(); q.fillStyle = vp11Lin(q, 0, -25, 0, 28, [0, T0[0], 0.55, T0[1], 1, T0[2]]); q.fill();
    q.strokeStyle = 'rgba(150,120,210,0.45)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(-9, -15, 5, 3, -0.5, 0, VP11_PI2); q.fill();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,128,165,0.45)'; q.beginPath(); q.ellipse(sx * 11, 3.5, 4, 2.6, 0, 0, VP11_PI2); q.fill(); }
  }, 5);
}
const VP11_HB = { yon: 1, mutlu: 1, kik: 0, alfa: 1, ton: 0, el: 0 };
function hayalet11Ciz(c, x, y, s, t, o) {
  o = o || VP11_HB; s = s || 1; t = t || 0; if (!(Number.isFinite(x) && Number.isFinite(y))) return;
  const a = (o.alfa == null ? 0.95 : clamp(o.alfa, 0, 1)); if (a <= 0.01) return;
  const kik = clamp(+o.kik || 0, 0, 1), yon = o.yon < 0 ? -1 : 1, isik = o.isik == null ? 1 : clamp(o.isik, 0, 1), uyku = !!o.uyku;
  const sp = vp11HayaletSpr((o.ton | 0) % 4);
  const yy = y + Math.sin(t * 1.6 + x * 0.013) * 5 * s, sal = Math.sin(t * 1.1 + x * 0.01) * 0.06 + Math.sin(t * 26) * 0.03 * kik;
  const M0 = c.getTransform(), a0 = c.globalAlpha;
  if (!o.isikYok) { const gco = c.globalCompositeOperation; if (gco === 'source-over') { c.globalCompositeOperation = 'lighter'; vp11Isik(c, '#e6d8ff', x, yy, 52 * s, a * (0.12 + 0.28 * isik)); c.globalCompositeOperation = gco; } }
  c.globalAlpha = a0 * a; c.translate(x, yy); c.scale(s * yon, s); c.rotate(sal);
  const sq = Math.sin(t * 2.4 + x) * 0.03 + Math.abs(Math.sin(t * 13)) * 0.05 * kik; c.scale(1 - sq, 1 + sq);
  vp11Koy(c, sp, 0, 0);
  // minik kollar (sallanır)
  const el = clamp(+o.el || 0, 0, 1), tn = VP11_HTON[(o.ton | 0) % 4];
  c.fillStyle = tn[1]; c.strokeStyle = 'rgba(150,120,210,0.45)'; c.lineWidth = 1;
  for (const sd of [-1, 1]) { const w = sd > 0 ? el : 0, an = sd * (0.5 + Math.sin(t * 3 + sd) * 0.15) - sd * w * (1.4 + Math.sin(t * 10) * 0.35) - (kik > 0.3 && sd < 0 ? 0 : 0);
    c.save(); c.translate(sd * 19, 4); c.rotate(an); c.beginPath(); c.ellipse(sd * 4, 0, 5.5, 3.6, 0, 0, VP11_PI2); c.fill(); c.stroke(); c.restore(); }
  // yüz
  const mutluG = kik > 0.4 || uyku;
  if (mutluG) { c.strokeStyle = '#3a2846'; c.lineWidth = 1.5; for (const sd of [-1, 1]) { c.beginPath(); if (uyku) c.arc(sd * 6.5 + 1, -5, 3.2, 0.2, Math.PI - 0.2); else c.arc(sd * 6.5 + 1, -3.5, 3.4, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); } }
  else for (const sd of [-1, 1]) vp11Goz(c, sd * 6.5 + 1, -5, 3.3, 4.3, ((t * 0.9 + x * 0.003) % 4.3) < 0.12 ? 2 : 0, 0.6, 0, false, sd);
  if (uyku) { c.fillStyle = '#b07090'; c.beginPath(); c.ellipse(1, 4.5, 1.6, 1.2, 0, 0, VP11_PI2); c.fill(); }
  else if (kik > 0.3) { c.fillStyle = '#7a2c44'; c.beginPath(); c.moveTo(-3, 2.5); c.quadraticCurveTo(1, 3.6, 5, 2.5); c.quadraticCurveTo(4, 8.5, 1, 8.5); c.quadraticCurveTo(-2, 8.5, -3, 2.5); c.fill(); c.fillStyle = '#ff8aa0'; c.beginPath(); c.ellipse(1, 7.2, 2.2, 1.2, 0, 0, VP11_PI2); c.fill(); }
  else { c.strokeStyle = '#7a3a50'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-3, 3); c.quadraticCurveTo(-1, 5.6, 1, 3.6); c.quadraticCurveTo(3, 5.6, 5, 3); c.stroke(); }
  c.setTransform(M0); c.globalAlpha = a0;
}

// ═══════════════════════════════ yarasa (lila top gövde, iri gözlü, gülen) ═══════════════════════════════
function vp11YarasaGovde() {   // merkez (0,0), r ≈ 13: top gövde, yuvarlak kulaklar, açık karın, minik ayaklar
  return vp11Tuval('yar_g', -17, -22, 34, 40, q => {
    for (const sx of [-1, 1]) { q.fillStyle = '#a985f0'; q.beginPath(); q.moveTo(sx * 4, -10); q.quadraticCurveTo(sx * 7, -21, sx * 11.5, -17.5); q.quadraticCurveTo(sx * 13, -12, sx * 10, -6); q.closePath(); q.fill(); q.strokeStyle = 'rgba(70,40,130,0.55)'; q.lineWidth = 0.9; q.stroke();
      q.fillStyle = '#ffc2dc'; q.beginPath(); q.moveTo(sx * 6, -10); q.quadraticCurveTo(sx * 8, -17, sx * 10.5, -15.5); q.quadraticCurveTo(sx * 11, -12, sx * 9.4, -8.5); q.closePath(); q.fill(); }
    q.beginPath(); q.arc(0, 0, 13, 0, VP11_PI2); q.fillStyle = vp11Rad(q, -4, -5, 1, 0, 0, 14, [0, '#e2d0ff', 0.5, '#b894f6', 1, '#8a62d8']); q.fill(); q.strokeStyle = 'rgba(70,40,130,0.55)'; q.lineWidth = 1; q.stroke();
    q.fillStyle = 'rgba(245,232,255,0.8)'; q.beginPath(); q.ellipse(0, 6.5, 7, 5, 0, 0, VP11_PI2); q.fill();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,128,170,0.5)'; q.beginPath(); q.ellipse(sx * 7.4, 2.4, 2.6, 1.7, 0, 0, VP11_PI2); q.fill(); }
    for (const sx of [-1, 1]) { q.fillStyle = '#8a62d8'; q.beginPath(); q.ellipse(sx * 3.4, 13.2, 2, 1.6, 0, 0, VP11_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,0.6)'; q.beginPath(); q.ellipse(-5, -7, 3, 1.8, -0.5, 0, VP11_PI2); q.fill();
  }, 6);
}
function vp11YarasaKanat() {   // sol kanat: pivot (0,0) gövde yanı, dışa −x; yuvarlak dilimli (sivri değil)
  return vp11Tuval('yar_k', -30, -14, 32, 26, q => {
    const yol = () => { q.beginPath(); q.moveTo(0, -3); q.quadraticCurveTo(-12, -13, -27, -9); q.quadraticCurveTo(-29, -2, -26, 4);
      q.quadraticCurveTo(-23, 9, -18, 4.5); q.quadraticCurveTo(-14, 10, -9, 5); q.quadraticCurveTo(-5, 9.5, 0, 5); q.closePath(); };
    yol(); q.fillStyle = vp11Lin(q, -27, 0, 0, 0, [0, '#c7a6ff', 1, '#9a74e8']); q.fill(); q.strokeStyle = 'rgba(70,40,130,0.55)'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(100,60,170,0.45)'; q.lineWidth = 0.8; for (const [ex, ey] of [[-18, 3.6], [-9, 4.2]]) { q.beginPath(); q.moveTo(-3, -4); q.quadraticCurveTo(ex * 0.6, -8, ex, ey); q.stroke(); }
    q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(-14, -6, 6, 1.6, 0.15, 0, VP11_PI2); q.fill();
  }, 6);
}
const VP11_YB = {};
function yarasa11Ciz(c, x, y, s, t, o) {
  o = o || VP11_YB; s = s || 1; t = t || 0; if (!(Number.isFinite(x) && Number.isFinite(y))) return;
  const uyku = !!o.uyku, goz = uyku ? clamp(+o.goz || 0, 0, 1) : 1, yon = o.yon < 0 ? -1 : 1, mut = o.mutlu == null ? 1 : clamp(o.mutlu, 0, 1);
  const G = vp11YarasaGovde(), K = vp11YarasaKanat();
  const M0 = c.getTransform();
  c.translate(x, y); c.scale(s * yon, s);
  if (uyku) {   // baş aşağı asılı: ayaklar tavanda, kanatlar gövdeye sarılı, hafifçe sallanır
    c.rotate(Math.PI + Math.sin(t * 1.3 + x) * 0.08);
    for (const sd of [-1, 1]) { const M = c.getTransform(); c.translate(sd * 9, 1); c.scale(sd < 0 ? 1 : -1, 1); c.rotate(-1.25 + goz * Math.sin(t * 5) * 0.12); c.scale(0.55, 0.9); vp11Koy(c, K, 0, 0); c.setTransform(M); }
    vp11Koy(c, G, 0, 0);
    c.strokeStyle = 'rgba(70,40,130,0.7)'; c.lineWidth = 1; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 3.4, 14); c.lineTo(sd * 3.4, 17.5); c.stroke(); }
  } else {
    let k;
    if (Number.isFinite(o.kanat) && Math.abs(o.kanat) <= 1) k = o.kanat * 2 - 1; else k = Math.sin((Number.isFinite(o.kanat) ? o.kanat : t * 11 + x * 0.02));
    const bob = -k * 2;
    c.translate(0, bob);
    for (const sd of [-1, 1]) { const M = c.getTransform(); c.translate(sd * 10, -1); c.scale(sd < 0 ? 1 : -1, 1); c.rotate(-k * 0.55); c.scale(1, 0.75 + 0.35 * Math.abs(k)); vp11Koy(c, K, 0, 0); c.setTransform(M); }
    vp11Koy(c, G, 0, 0);
  }
  // yüz (baş aşağıyken de kendi çerçevesinde doğru durur)
  if (goz > 0.5) { for (const sd of [-1, 1]) vp11Goz(c, sd * 4.6 + 0.5, -2, 2.7, 3.5, ((t + x * 0.01) % 3.7) < 0.12 ? 2 : 0, 0.4, 0, false, sd); }
  else { c.strokeStyle = '#3a2846'; c.lineWidth = 1.1; for (const sd of [-1, 1]) { c.beginPath(); c.arc(sd * 4.6 + 0.5, -2.4, 2.4, 0.25, Math.PI - 0.25); c.stroke(); } }
  c.strokeStyle = '#6a2a4a'; c.lineWidth = 1.1; c.beginPath();
  if (mut > 0.5 && goz > 0.5) { c.moveTo(-2.4, 3.4); c.quadraticCurveTo(0.5, 6.8, 3.4, 3.4); } else { c.moveTo(-1.4, 4); c.quadraticCurveTo(0.5, 5.4, 2.4, 4); }
  c.stroke();
  c.setTransform(M0);
}

// ═══════════════════════════════ nesneler ═══════════════════════════════
function vp11Pan(x) { return clamp((x - cam.x - VW / 2) / Math.max(1, VW / 2), -0.7, 0.7); }
function vp11Ekranda(x, pay) { return !(x < cam.x - pay || x > cam.x + VW + pay); }
function vp11HuzmeYakin(x, y, r) {   // ay ışığı huzmesi bu noktanın yakınından geçiyor mu (AYNA11.huzme)
  if (typeof AYNA11 === 'undefined' || !AYNA11 || !AYNA11.huzme) return false;
  const H = AYNA11.huzme;
  for (let i = 0; i < H.length; i++) { const h = H[i]; if (!h) continue; const dx = h.x1 - h.x0, dy = h.y1 - h.y0, L2 = dx * dx + dy * dy || 1, u = clamp(((x - h.x0) * dx + (y - h.y0) * dy) / L2, 0, 1), px = h.x0 + dx * u - x, py = h.y0 + dy * u - y; if (px * px + py * py < r * r) return true; }
  return false;
}
// ── vampirDurak: Vela bahçe kapısında karşılar (sevinir, el sallar, kıkırdar; Feza geçince "şatoda görüşürüz" deyip pelerinini açıp
//    şatoya doğru süzülür), Pıtır galeride hilal beşiğinde (uyur; Feza gelince uyanır, alkışlar, el sallar)
const VP11_DO = { yon: 1, poz: 'dur', mutlu: 1, pelerin: null, faz: 0, uyku: false, bakX: 0, bakY: 0 };
TUR.kaydet('vampirDurak', {
  kur(o) { o.t = 0; o.d = 'bekle'; o.dt = 0; o.yon = -1; o.ux = 0; o.uy = 0; o.ua = 1; o.gitti = false; o.uyu = o.kim === 'bebek'; o.sallan = 0; o.tep = ''; o.tepT = 0; o.tepN = 0; o.kirpT = 2.5; },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return; dt = Math.min(dt, 0.05); o.t += dt; o.dt += dt;
    const dx = P.x - o.x, uz = Math.abs(dx), oyun = DURUM === 'oyun';
    if ((o.isP | 0) < 4 && uz < 3200) {   // yaklaşırken önbellekleri kareye yayarak ısıt (ilk görünüşte takılma olmasın)
      o.isP = (o.isP | 0) + 1; if (o.isP === 1) vp11Parcalar(o.kim); else if (o.isP === 2) { vp11Golge(); if (o.kim === 'bebek') vp11BesikSpr(); }
      else if (o.isP === 3) { vp11YarasaGovde(); vp11YarasaKanat(); } else for (let i = 0; i < 4; i++) vp11HayaletSpr(i);
    }
    // tepkiler (çeşitlilik): Feza yakında zıplarsa o da sevinçle zıplar; dokununca sırayla fırıl döner / göz kırpar / zıplar
    if (o.tepT > 0) { o.tepT -= dt; if (o.tepT <= 0) o.tep = ''; }
    if ((!o.tep || o.tep === 'kirp') && oyun && !o.uyu && !o.gitti && uz < 280 && !P.ground && P.vy < -150 && o.d !== 'uc' && o.d !== 'veda') vp11DurakTepki(o, 'zipla');
    if (o.kim === 'kiz' && (o.d === 'el' || o.d === 'kikir') && !o.tep) { o.kirpT -= dt; if (o.kirpT <= 0) { o.kirpT = 4 + (o.t * 7.3 % 3); vp11DurakTepki(o, 'kirp'); } }   // ara sıra tek göz kırpar
    if (o.kim === 'bebek') {
      if (o.uyu && oyun && uz < 420) { o.uyu = false; o.d = 'uyan'; o.dt = 0; OLAY.emit('vampirDurak', { o, kim: o.kim, an: 'uyandi' }); vp11Sfx('hayaletKikir'); }
      if (!o.uyu) { if (o.d === 'uyan' && o.dt > 1.4) { o.d = 'alkis'; o.dt = 0; } else if (o.d === 'alkis' && uz > 260 && o.dt > 2) { o.d = 'el'; o.dt = 0; } else if (o.d === 'el' && uz < 200) { o.d = 'alkis'; o.dt = 0; } }
      o.yon = dx < 0 ? -1 : 1; return;
    }
    if (o.gitti) return;
    if (o.d === 'bekle') { o.yon = uz < 700 ? (dx < 0 ? -1 : 1) : (Math.sin(o.t * 0.5) > 0 ? 1 : -1); if (oyun && uz < 330) { o.d = 'selam'; o.dt = 0; vp11Sfx('pelerinAc'); OLAY.emit('vampirDurak', { o, kim: o.kim, an: 'selam' }); } }
    else if (o.d === 'selam') { o.yon = dx < 0 ? -1 : 1; if (o.dt > 1.3) { o.d = 'el'; o.dt = 0; } }
    else if (o.d === 'el') { o.yon = dx < 0 ? -1 : 1; if (o.dt > 3.2) { o.d = 'kikir'; o.dt = 0; } if (dx > 240 && o.dt > 1) { o.d = 'veda'; o.dt = 0; OLAY.emit('vampirDurak', { o, kim: o.kim, an: 'veda' }); } }
    else if (o.d === 'kikir') { o.yon = dx < 0 ? -1 : 1; if (o.dt > 1.8) { o.d = 'el'; o.dt = 0.6; } if (dx > 240) { o.d = 'veda'; o.dt = 0; OLAY.emit('vampirDurak', { o, kim: o.kim, an: 'veda' }); } }
    else if (o.d === 'veda') { o.yon = 1; if (o.dt > 1.6) { o.d = 'uc'; o.dt = 0; vp11Sfx('pelerinAc'); } }
    else if (o.d === 'uc') {   // pelerinini açıp şatoya doğru süzülür (yay çizerek yükselir, uzakta küçülüp söner)
      const u = o.dt / 3.2; o.ux = (u * u * 0.6 + u * 0.4) * 900; o.uy = -Math.sin(Math.min(1, u) * Math.PI * 0.5) * 380 - u * 60; o.ua = 1 - smooth(clamp((u - 0.55) / 0.45, 0, 1));
      if (u >= 1) o.gitti = true;
    }
  },
  ciz(o, tm) {
    if (!vp11Ekranda(o.x + (o.ux || 0), 300)) return;
    const V = VP11_DO; V.yon = o.yon; V.mutlu = 1; V.pelerin = null; V.faz = tm; V.uyku = false; V.bakX = 0; V.bakY = 0; V.alfa = 1; V.golgeYok = false;
    if (o.kim === 'bebek') { vp11Besik(o, tm); return; }
    if (o.gitti) return;
    const d = o.d; let x = o.x, y = o.y;
    V.poz = d === 'selam' ? 'sevin' : d === 'el' || d === 'veda' ? 'el' : d === 'kikir' ? 'kikir' : d === 'uc' ? 'ucus' : 'dur';
    if (d === 'bekle') { V.bakX = Math.sin(tm * 0.6) * 0.8; if (Math.sin(tm * 0.9) > 0.85) V.poz = 'kikir'; }
    V.kirp = 0; V.kirpTek = 0; V.don = 0;
    if (o.tep && d !== 'uc') {   // tepki animasyonu
      const u = 1 - o.tepT / VP11_TEPS[o.tep];
      if (o.tep === 'zipla') { y -= Math.sin(clamp(u, 0, 1) * Math.PI) * 22; V.poz = 'sevin'; }
      else if (o.tep === 'don') { V.don = smooth(clamp(u * 1.25, 0, 1)); V.poz = 'dans'; V.pelerin = 0.8; y -= Math.sin(clamp(u, 0, 1) * Math.PI) * 8; }
      else if (o.tep === 'kirp') { V.kirp = u > 0.15 && u < 0.75 ? 1 : 0; V.kirpTek = 1; V.poz = 'kikir'; }
    }
    if (d === 'uc') { x += o.ux; y += o.uy; V.alfa = o.ua; V.golgeYok = true; V.yon = 1;
      g.globalCompositeOperation = 'lighter'; for (let j = 1; j < 6; j++) vp11Isik(g, '#cfe6ff', x - j * 16, y - 26 + j * 6, 12 - j, 0.35 * o.ua * (1 - j / 6)); g.globalCompositeOperation = 'source-over'; }
    vampirCiz(g, 'kiz', x, y, 1, tm, V);
    V.alfa = 1; V.golgeYok = false;
  }
});
const VP11_TEPS = { zipla: 0.7, don: 1.1, kirp: 0.9 }, VP11_TEPL = ['don', 'kirp', 'zipla'];
function vp11DurakTepki(o, tep) {
  o.tep = tep; o.tepT = VP11_TEPS[tep];
  if (tep === 'don') vp11Sfx('pelerinAc'); else if (tep !== 'kirp') vp11Sfx('yarasaPir');
  if (typeof burst === 'function' && tep !== 'kirp') burst(o.x, o.y - (o.kim === 'bebek' ? 50 : 40), 8, ['#ffb3d1', '#eaf4ff', '#ffe7a8', '#ffffff'], 90, 0.8, 4);
}
// dokununca: Vela fırıl döner / göz kırpar / zıplar (sırayla); Pıtır beşiğinde zıplayıp alkışlar
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 11 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  for (let i = 0; i < NESNELER.length; i++) {
    const o = NESNELER[i]; if (o.tip !== 'vampirDurak' || o.gitti || o.uyu || o.d === 'uc' || o.d === 'veda' || o.tepT > 0.2) continue;
    const bb = o.kim === 'bebek' ? 1.35 : 1;
    if (Math.abs(wx - o.x) < 40 * bb && wy > o.y - 80 * bb && wy < o.y + 10) {
      if (o.kim === 'bebek') { vp11DurakTepki(o, 'zipla'); o.d = 'alkis'; o.dt = 0; vp11Sfx('hayaletKikir'); }
      else { vp11DurakTepki(o, VP11_TEPL[o.tepN++ % 3]); if (o.d === 'bekle') { o.d = 'selam'; o.dt = 0; } }
      OLAY.emit('vampirDurak', { o, kim: o.kim, an: 'dokun' });
      return;
    }
  }
});
// Pıtır'ın hilal beşiği: krem-altın hilal, pembe battaniye, tepesinde dönen minik yarasa-yıldız dönencesi; hafifçe sallanır
function vp11BesikSpr() {
  return vp11Tuval('besik', -40, -46, 80, 50, q => {
    q.fillStyle = 'rgba(30,16,60,0.25)'; q.beginPath(); q.ellipse(0, 1, 32, 3.5, 0, 0, VP11_PI2); q.fill();
    // hilal (sol uç yukarı kıvrık)
    q.beginPath(); q.moveTo(-34, -42); q.bezierCurveTo(-44, -14, -24, 2, 4, 0); q.bezierCurveTo(24, -1, 36, -10, 37, -22); q.bezierCurveTo(26, -12, 10, -8, -6, -10); q.bezierCurveTo(-22, -12, -32, -24, -34, -42); q.closePath();
    q.fillStyle = vp11Lin(q, 0, -42, 0, 2, [0, '#fff6d8', 0.5, '#ffe6a0', 1, '#f2c66a']); q.fill(); q.strokeStyle = 'rgba(170,120,40,0.7)'; q.lineWidth = 1.1; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.ellipse(-26, -22, 2.4, 9, 0.5, 0, VP11_PI2); q.fill();
    q.fillStyle = '#ffd36a'; for (const [x, y, r] of [[-12, -5, 1.6], [6, -3.4, 1.9], [22, -7, 1.5]]) { vp11Yildiz(q, x, y, r, 0.5); q.fill(); }
    // battaniye (çilek pembesi, kalp desenli)
    q.beginPath(); q.moveTo(-26, -12); q.quadraticCurveTo(-4, -19, 30, -14); q.quadraticCurveTo(28, -9, 20, -8.4); q.quadraticCurveTo(0, -7, -16, -9); q.quadraticCurveTo(-24, -10, -26, -12); q.closePath();
    q.fillStyle = vp11Lin(q, 0, -19, 0, -7, [0, '#ffc6dc', 1, '#ff93b6']); q.fill(); q.strokeStyle = 'rgba(190,60,110,0.6)'; q.lineWidth = 0.8; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.75)'; for (const x of [-14, -2, 10, 22]) { q.beginPath(); q.moveTo(x, -11); q.bezierCurveTo(x - 1.6, -12.2, x - 1.2, -13.6, x, -12.8); q.bezierCurveTo(x + 1.2, -13.6, x + 1.6, -12.2, x, -11); q.fill(); }
  }, 5);
}
const VP11_BO = { yon: 1, poz: 'otur', mutlu: 1, faz: 0, uyku: false, golgeYok: true };
function vp11Besik(o, tm) {
  const ru = Math.sin(tm * 1.3) * 0.05, aw = !o.uyu, M0 = g.getTransform();
  g.translate(o.x, o.y); g.scale(1.35, 1.35); const x = 0, y = 0;
  // dönence (tepede asılı minik yarasa ve yıldızlar)
  const mx = x + 4, my = y - 96;
  g.strokeStyle = 'rgba(220,200,255,0.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(mx, my - 40); g.lineTo(mx, my); g.stroke();
  for (let i = 0; i < 3; i++) { const an = tm * 0.6 + i * VP11_PI2 / 3, px = mx + Math.cos(an) * 22, py = my + 8 + Math.sin(an) * 4;
    g.strokeStyle = 'rgba(220,200,255,0.5)'; g.beginPath(); g.moveTo(mx, my); g.lineTo(px, py - 8); g.stroke();
    if (i === 0) yarasa11Ciz(g, px, py, 0.45, tm, VP11_YB); else { g.fillStyle = i === 1 ? '#ffd36a' : '#ffb3d1'; g.beginPath(); g.arc(px, py - 2, 3.2, 0, VP11_PI2); g.fill(); } }
  const M = g.getTransform(); g.translate(x, y); g.rotate(ru);
  const B = vp11BesikSpr(), V = VP11_BO;
  // Pıtır battaniyenin içinde oturur (uyurken başı yana yatık)
  V.yon = aw ? o.yon : 1; V.uyku = !aw; V.faz = tm; V.alfa = 1;
  V.poz = !aw ? 'otur' : o.d === 'alkis' ? 'alkis' : o.d === 'el' ? 'el' : o.d === 'uyan' ? 'sasir' : 'otur';
  const by = -9 - (o.tep === 'zipla' ? Math.sin(clamp(1 - o.tepT / VP11_TEPS.zipla, 0, 1) * Math.PI) * 9 : 0);   // dokununca/Feza zıplayınca beşikte hoplar
  if (o.tep === 'zipla') V.poz = 'alkis';
  vampirCiz(g, 'bebek', 2, by, 1, tm, V);
  vp11Koy(g, B, 0, 0);
  g.setTransform(M);
  if (!aw) {   // uyku kabarcıkları (yumuşak "z" yerine minik ışık baloncukları)
    for (let i = 0; i < 3; i++) { const u = (tm * 0.35 + i / 3) % 1; g.globalAlpha = Math.sin(u * Math.PI) * 0.7; g.strokeStyle = '#e6dcff'; g.lineWidth = 1; g.beginPath(); g.arc(x + 10 + u * 18, y - 38 - u * 34, 1.5 + u * 3, 0, VP11_PI2); g.stroke(); }
    g.globalAlpha = 1;
  }
  g.setTransform(M0);
}
// ── hayaletDekor: kristal mağarada kıkırdayan pastel hayaletler. Mağara sönükken soluk ve uykulu; 'hayalet' parçası canlanınca
//    (OLAY 'satoCanlan' tur 'hayalet') ışıklanır. Feza yaklaşınca kıkırdayıp el sallar, ara sıra takla atar. Takip etmez.
let vp11HayaletUyan = false;
OLAY.on('satoCanlan', e => { if (e && e.tur === 'hayalet') vp11HayaletUyan = true; });
const VP11_HO = { yon: 1, mutlu: 1, kik: 0, alfa: 1, ton: 0, el: 0, uyku: false, isik: 1 };
TUR.kaydet('hayaletDekor', {
  kur(o) { o.t = 0; o.kik = 0; o.el = 0; o.uy = 0; o.ton = (Math.abs(Math.round(o.x / 40)) * 7) % 4; o.kikT = 0; o.takla = -1; },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return; dt = Math.min(dt, 0.05); o.t += dt;
    const uyan = vp11HayaletUyan || (typeof V11 !== 'undefined' && V11 && V11.ayna >= 10) || (typeof V11 !== 'undefined' && V11 && V11.final);
    o.uy = clamp(o.uy + (uyan ? dt * 0.8 : -dt * 0.3), 0, 1);
    const uz = Math.abs(P.x - o.x), yak = uz < 300 && DURUM === 'oyun';
    o.el = clamp(o.el + (yak && o.uy > 0.3 ? dt * 3 : -dt * 2), 0, 1);
    o.kikT -= dt; if (yak && o.kikT <= 0 && o.uy > 0.3) { o.kikT = 3 + (o.x % 3); o.kik = 1; vp11Sfx('hayaletKikir', { pan: vp11Pan(o.x) }); if (o.takla < 0 && Math.random() < 0.5) o.takla = 0; }
    o.kik = Math.max(0, o.kik - dt * 0.6);
    if (o.takla >= 0) { o.takla += dt / 1.1; if (o.takla >= 1) o.takla = -1; }
  },
  ciz(o, tm) {
    if (!vp11Ekranda(o.x, 200)) return;
    const H = VP11_HO, u = o.uy; H.yon = P.x < o.x ? -1 : 1; H.kik = o.kik; H.el = o.el; H.ton = o.ton; H.uyku = u < 0.35; H.isik = u; H.alfa = 0.55 + 0.43 * u;
    if (o.takla >= 0) { const e = smooth(o.takla), M = g.getTransform(); g.translate(o.x, o.y - Math.sin(e * Math.PI) * 30); g.rotate(e * VP11_PI2 * H.yon); hayalet11Ciz(g, 0, 0, 1, tm, H); g.setTransform(M); }
    else hayalet11Ciz(g, o.x, o.y, 1, tm, H);
  }
});
// ── yarasaDekor: lila yarasalar. uyku: tavanda baş aşağı uyuklar; huzme yakından geçince ya da Feza altından geçince gözünü açıp
//    gülümser (hâlâ asılı, kanat kıpırdatır). Uyumayanlar yumuşak sekizler çizerek uçuşur.
const VP11_YO = { kanat: undefined, yon: 1, uyku: false, goz: 0, mutlu: 1 };
TUR.kaydet('yarasaDekor', {
  kur(o) { o.t = 0; o.goz = 0; o.chk = Math.random(); },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return; dt = Math.min(dt, 0.05); o.t += dt;
    if (!o.uyku) return;
    o.chk -= dt; if (o.chk <= 0) { o.chk = 0.4; o.huz = vp11HuzmeYakin(o.x, o.y, 260); }
    const ac = o.huz || (Math.abs(P.x - o.x) < 160 && DURUM === 'oyun');
    if (ac && o.goz < 0.05 && !o.pirT) { o.pirT = 1; vp11Sfx('yarasaPir', { pan: vp11Pan(o.x) }); } if (!ac && o.goz <= 0) o.pirT = 0;
    o.goz = clamp(o.goz + (ac ? dt * 2.5 : -dt * 0.6), 0, 1);
  },
  ciz(o, tm) {
    if (!vp11Ekranda(o.x, 200)) return;
    const Y = VP11_YO; Y.uyku = !!o.uyku; Y.goz = o.goz; Y.mutlu = 1;
    if (o.uyku) { Y.kanat = undefined; Y.yon = 1; yarasa11Ciz(g, o.x, o.y, 1, tm, Y); return; }
    const ph = tm * 0.7 + o.x * 0.01, x = o.x + Math.sin(ph) * 40, y = o.y + Math.sin(ph * 2) * 14;
    Y.yon = Math.cos(ph) >= 0 ? 1 : -1; Y.kanat = undefined;
    g.globalCompositeOperation = 'lighter'; vp11Isik(g, '#c39bff', x, y, 26, 0.18); g.globalCompositeOperation = 'source-over';
    yarasa11Ciz(g, x, y, 1, tm, Y);
  }
});
