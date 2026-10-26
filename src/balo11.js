/* balo11.js — Final: Ay Balosu (VAMPIR).
   Kule terasındaki balo salonunda Ay taşı (hilal biçimli, parıldayan taş, kaidesinde) bekler; Vela yanında el sallar. Feza ona yaklaşınca
   ya da dokununca final başlar (~35 sn; 104 BPM 3/4 vals: vuruş 0,577 sn, ölçü 1,731 sn; müzik ölçüleri 'baloFinal' anına hizalı):
     0–3     Ay taşı uyanır; taştan ve Feza'nın döndürdüğü her aynadan bir ışık topu göğe yükselir, bulutların ardındaki Ay'da toplanır
     2,5–6   bulutlar yavaşça iki yana açılıp söner, KOCAMAN Ay çıkar (4,5 sn OLAY 'baloAy', AU.sfx('ayCik')); Ay gözlerini açıp gülümser
     5–9     kubbeden salona gümüş ay ışığı sütunu iner, zeminde ışık havuzu; Dede (kucağında Pıtır) ve Nine pelerinleriyle süzülerek gelir,
             Nine'nin çilekli pastası (pasta11.js pa11PastaCiz) ışıltılı sehpasıyla süzülüp yerine konar, hayaletler ve yarasalar gelir
     9–27    VALS (OLAY 'baloVals'): Dede ile Nine (Pıtır Dede'nin kucağında) salonda dönerek dolaşır, Vela Feza'nın karşısında dans eder,
             hayalet çiftleri havada döner, yarasalar Ay'ın çevresinde sekizler çizer; her ölçüde zeminde gümüş nabız, ay tozu yağar
     27,69   DORUK (müziğin 16. ölçüsü; OLAY 'baloDoruk'): Ay'dan genişleyen gümüş ışık halkası, yıldız yağmuru, herkes zıplar, Feza da
     30,5–35 herkes Feza'nın çevresinde toplanıp birlikte poz verir (el sallar), ışık yumuşakça durulur → 35. sn OLAY 'baloTamam' (sabah)
   V11.final = true, OLAY 'baloFinal' {o, duration: 35, box}. Dışa açık: baloFinalAn() (sn), baloFinalNabiz() (0..1, vuruş anında 1),
   baloAyCiz(c, tm) (HARITA isterse gök katmanında, dünya dönüşümüyle çağırır; çağırmazsa Ay'ı balo11 kendisi çizer), BALO11.ay {x, y, r, a}.
   Kan, tabut, keskin diş, korkutma YOK. Sözleşme: src/BOLUM11.md. Önek: bl11B. Karede gradyan yok (sprite'lar önbellekte). */
'use strict';
const BALO11 = { o: null, ay: { x: 0, y: 0, r: 120, a: 0 }, ayNow: -1 };
const BL11B_SURE = 35, BL11B_DORUK = 16 * 180 / 104, BL11B_VUR = 60 / 104, BL11B_OLCU = 3 * 60 / 104;
const BL11B_AYY = 430, BL11B_AYR = 118;   // Ay: salon ortasının 430 birim üstü, yarıçap 118 (daha aşağısı uzak tepenin ardında kalır)
const BL11B_PI2 = Math.PI * 2;
function baloFinalAn() { const o = BALO11.o; return o && o.faz !== 'bekle' ? o.t : 0; }
function baloFinalNabiz() { const a = baloFinalAn(); if (!a) return 0; const u = (a % BL11B_VUR) / BL11B_VUR; return Math.pow(1 - u, 3); }
function bl11BSfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function bl11BIsik(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }
function bl11BIsikE(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
function bl11BTuval(ad, x0, y0, w, h, fn, K) { return typeof vp11Tuval === 'function' ? vp11Tuval('bl_' + ad, x0, y0, w, h, fn, K) : null; }
function bl11BKoy(c, sp, x, y, k) { if (!sp) return; k = k || 1; c.drawImage(sp, x + sp.x0 * k, y + sp.y0 * k, sp.w * k, sp.h * k); }

// ═══════════════════════════════ sprite'lar ═══════════════════════════════
function bl11BAySpr() {   // kocaman inci-sarı Ay (yüz karede): merkez (0,0), r = 100 birim (çizerken ölçeklenir)
  return bl11BTuval('ay', -104, -104, 208, 208, q => {
    q.fillStyle = vp11Rad(q, -30, -34, 8, 0, 0, 102, [0, '#fffdf4', 0.55, '#fff4d6', 0.88, '#fbe6b4', 1, '#f2d69a']); q.beginPath(); q.arc(0, 0, 100, 0, BL11B_PI2); q.fill();
    q.fillStyle = 'rgba(236,206,150,0.4)'; for (const [x, y, r] of [[-46, -30, 15], [40, -46, 10], [52, 20, 18], [-30, 50, 12], [8, -64, 7], [-66, 14, 8]]) { q.beginPath(); q.arc(x, y, r, 0, BL11B_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,0.35)'; for (const [x, y, r] of [[-48, -32, 9], [50, 18, 11]]) { q.beginPath(); q.arc(x - 3, y - 3, r, 0, BL11B_PI2); q.fill(); }
    q.fillStyle = 'rgba(255,150,170,0.35)'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(sx * 44, 18, 15, 9, 0, 0, BL11B_PI2); q.fill(); }
    q.strokeStyle = 'rgba(230,190,120,0.6)'; q.lineWidth = 2; q.beginPath(); q.arc(0, 0, 99, 0, BL11B_PI2); q.stroke();
  }, 2.6);
}
function bl11BBulutSpr(i) {   // gece moru tombul bulut; ay tarafı gümüşle aydınlanmış kenar
  return bl11BTuval('bulut' + i, -130, -60, 260, 110, q => {
    const r = rng(4400 + i * 17), L = [];
    for (let k = 0; k < 7; k++) L.push([-95 + k * 32 + (r() - 0.5) * 14, -8 - Math.sin(k / 6 * Math.PI) * 26 + (r() - 0.5) * 10, 30 + r() * 16]);
    q.fillStyle = '#3a2c74'; for (const [x, y, rr] of L) { q.beginPath(); q.arc(x, y + 6, rr, 0, BL11B_PI2); q.fill(); }
    q.beginPath(); q.roundRect ? q.roundRect(-118, 0, 236, 36, 18) : q.rect(-118, 0, 236, 36); q.fill();
    q.fillStyle = vp11Lin(q, 0, -60, 0, 40, [0, '#6a58b0', 0.5, '#4b3a8c', 1, '#3a2c74']); for (const [x, y, rr] of L) { q.beginPath(); q.arc(x, y, rr * 0.92, 0, BL11B_PI2); q.fill(); }
    q.strokeStyle = 'rgba(207,230,255,0.55)'; q.lineWidth = 3; for (const [x, y, rr] of L) { q.beginPath(); q.arc(x, y, rr * 0.9, Math.PI * 1.1, Math.PI * 1.75); q.stroke(); }
  }, 1.6);
}
function bl11BSutunSpr() {   // ay ışığı sütunu: yamuk (üst dar, alt geniş), ortası parlak, kenarları ve üstü yumuşak
  return bl11BTuval('sutun', -100, 0, 200, 400, q => {
    q.beginPath(); q.moveTo(-46, 0); q.lineTo(46, 0); q.lineTo(100, 400); q.lineTo(-100, 400); q.closePath();
    q.fillStyle = vp11Lin(q, 0, 0, 0, 400, [0, 'rgba(234,244,255,0.05)', 0.25, 'rgba(207,230,255,0.4)', 0.85, 'rgba(207,230,255,0.55)', 1, 'rgba(234,244,255,0.7)']); q.fill();
    q.globalCompositeOperation = 'destination-in';
    q.fillStyle = vp11Lin(q, -100, 0, 100, 0, [0, 'rgba(0,0,0,0)', 0.3, 'rgba(0,0,0,0.85)', 0.5, 'rgba(0,0,0,1)', 0.7, 'rgba(0,0,0,0.85)', 1, 'rgba(0,0,0,0)']); q.fillRect(-100, 0, 200, 400);
  }, 1);
}
function bl11BTasSpr() {   // Ay taşı: lila kaide üstünde inci rengi hilal taş
  return bl11BTuval('tas', -30, -86, 60, 90, q => {
    q.fillStyle = 'rgba(30,16,60,0.3)'; q.beginPath(); q.ellipse(0, 1, 26, 4, 0, 0, BL11B_PI2); q.fill();
    q.beginPath(); q.moveTo(-20, 0); q.lineTo(20, 0); q.lineTo(16, -6); q.lineTo(10, -8); q.quadraticCurveTo(7, -24, 11, -36); q.lineTo(-11, -36); q.quadraticCurveTo(-7, -24, -10, -8); q.lineTo(-16, -6); q.closePath();
    q.fillStyle = vp11Lin(q, -20, 0, 20, 0, [0, '#c8b6f2', 0.5, '#a48ce0', 1, '#7a62c0']); q.fill(); q.strokeStyle = 'rgba(42,24,72,0.55)'; q.lineWidth = 1; q.stroke();
    q.fillStyle = '#d9c8ff'; q.beginPath(); q.ellipse(0, -37, 15, 4, 0, 0, BL11B_PI2); q.fill(); q.stroke();
    q.fillStyle = '#ffd36a'; for (const x of [-6, 0, 6]) { vp11Yildiz(q, x, -20, x ? 1.8 : 2.6, 0.5); q.fill(); }
  }, 5);
}
function bl11BHilalSpr() {   // kaidenin üstündeki inci rengi hilal taş; merkez (0,0)
  return bl11BTuval('hilal', -26, -26, 52, 52, q => {
    q.translate(0, 60);
    q.beginPath(); q.arc(0, -60, 22, 0.6, BL11B_PI2 - 0.6 + 0.0001, false); q.arc(9, -64, 18, BL11B_PI2 - 0.9, 0.9, true); q.closePath();
    q.fillStyle = vp11Rad(q, -8, -66, 2, 0, -60, 24, [0, '#ffffff', 0.5, '#eaf4ff', 1, '#a9c8ff']); q.fill(); q.strokeStyle = 'rgba(120,150,220,0.7)'; q.lineWidth = 1; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.ellipse(-12, -66, 2.4, 6, 0.4, 0, BL11B_PI2); q.fill();
  }, 5);
}
function bl11BSehpaSpr() {   // pastanın gümüş tepsili ayaklı sehpası (gümüş ayak + parlak gümüş tepsi, kenarı inci boncuklu); üst yüzü (0, -46)
  return bl11BTuval('sehpa', -64, -56, 128, 60, q => {
    q.fillStyle = 'rgba(30,16,60,0.3)'; q.beginPath(); q.ellipse(0, 1, 44, 5, 0, 0, BL11B_PI2); q.fill();
    // gümüş ayak: geniş taban, ince boyun, ortada top
    q.fillStyle = vp11Lin(q, -22, 0, 22, 0, [0, '#8f97b8', 0.35, '#f4f7ff', 0.6, '#c9d0e6', 1, '#7d84a6']);
    q.beginPath(); q.moveTo(-22, 0); q.quadraticCurveTo(-20, -6, -8, -8); q.lineTo(-4, -30); q.lineTo(4, -30); q.lineTo(8, -8); q.quadraticCurveTo(20, -6, 22, 0); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(70,76,120,0.7)'; q.lineWidth = 1; q.stroke();
    q.beginPath(); q.ellipse(0, -24, 7, 5, 0, 0, BL11B_PI2); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(-6, -32); q.lineTo(6, -32); q.lineTo(14, -42); q.lineTo(-14, -42); q.closePath(); q.fill(); q.stroke();
    // gümüş tepsi: alt kenar (kalınlık) + üst yüz + parlak kenar halkası
    q.fillStyle = '#9aa2c4'; q.beginPath(); q.ellipse(0, -42, 58, 9, 0, 0, Math.PI); q.lineTo(-58, -46); q.ellipse(0, -46, 58, 9, 0, Math.PI, 0, true); q.closePath(); q.fill(); q.stroke();
    q.fillStyle = vp11Lin(q, -58, -46, 58, -46, [0, '#c3cae2', 0.3, '#ffffff', 0.55, '#dfe5f6', 1, '#aab2d2']); q.beginPath(); q.ellipse(0, -46, 58, 9, 0, 0, BL11B_PI2); q.fill();
    q.strokeStyle = 'rgba(70,76,120,0.75)'; q.lineWidth = 1.1; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.9)'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, -46, 52, 7, 0, Math.PI * 1.05, Math.PI * 1.6); q.stroke();
    q.strokeStyle = 'rgba(120,128,170,0.55)'; q.lineWidth = 0.8; q.beginPath(); q.ellipse(0, -46, 48, 6.4, 0, 0, BL11B_PI2); q.stroke();
    q.fillStyle = '#ffffff'; for (let i = 0; i < 14; i++) { const an = Math.PI * (0.04 + i / 13 * 0.92); q.beginPath(); q.arc(Math.cos(an) * 57, -42 + Math.sin(an) * 8.6, 1.5, 0, BL11B_PI2); q.fill(); }   // inci boncuklu ön kenar
    q.fillStyle = 'rgba(255,255,255,0.95)'; vp11Isilti(q, -34, -44, 5); q.fill(); vp11Isilti(q, 18, -40, 3.4); q.fill();
  }, 4);
}
const BL11B_YRENK = ['#fff4d6', '#ffb3d1', '#cfe6ff', '#ffe7a8', '#d9c8ff', '#9ff0d0'];
function bl11BYildizSpr(i) { i = i || 0; return bl11BTuval('yildiz' + i, -8, -8, 16, 16, q => { q.fillStyle = BL11B_YRENK[i]; vp11Yildiz(q, 0, 0, 6.5, 0.48); q.fill(); q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 0.8; q.stroke(); q.fillStyle = '#ffffff'; q.beginPath(); q.arc(-1, -1, 1.6, 0, BL11B_PI2); q.fill(); }, 5); }
function bl11BIsiltiSpr() { return bl11BTuval('isilti', -10, -10, 20, 20, q => { q.fillStyle = vp11Rad(q, 0, 0, 0, 0, 0, 9, [0, 'rgba(255,255,255,0.8)', 1, 'rgba(255,255,255,0)']); q.beginPath(); q.arc(0, 0, 9, 0, BL11B_PI2); q.fill(); q.fillStyle = '#ffffff'; vp11Isilti(q, 0, 0, 8.5); q.fill(); }, 4); }
function bl11BHazirla(o) {   // kareye yayarak (her karede bir parça)
  const L = [bl11BAySpr, () => bl11BBulutSpr(0), () => bl11BBulutSpr(1), () => bl11BBulutSpr(2), () => bl11BBulutSpr(3), bl11BSutunSpr, bl11BTasSpr, bl11BSehpaSpr, bl11BHilalSpr, () => { for (let i = 0; i < 6; i++) bl11BYildizSpr(i); }, bl11BIsiltiSpr,
    () => { if (typeof vp11Parcalar === 'function') { vp11Parcalar('dede'); vp11Parcalar('nine'); } }, () => { if (typeof vp11Parcalar === 'function') { vp11Parcalar('kiz'); vp11Parcalar('bebek'); } },
    () => { if (typeof hayalet11Ciz === 'function') for (let i = 0; i < 4; i++) { vp11HayaletSpr(i); if (typeof vp11HayaletKol === 'function') vp11HayaletKol(i); } }, () => { if (typeof vp11YarasaGovde === 'function') { vp11YarasaGovde(); vp11YarasaKanat(); if (typeof vp11YarasaKulak === 'function') vp11YarasaKulak(); } }];
  if (o.isP < L.length) { try { L[o.isP](); } catch (e) {} o.isP++; return false; }
  return true;
}

// ═══════════════════════════════ zaman çizelgesi yardımcıları ═══════════════════════════════
const BL11B_TMP = [0, 0];
function bl11BAyYer(o) { const A = BALO11.ay; A.x = o.x; A.y = o.y - BL11B_AYY; A.r = BL11B_AYR; return A; }
function bl11BKadraj(o) {   // yatayda geniş, dikeyde Ay'ı da alan kutu; Feza da içinde
  const asp = typeof W !== 'undefined' && typeof H !== 'undefined' && H > 0 ? W / H : 1.33;
  const gen = clamp(Math.min(asp >= 1.2 ? 390 : asp >= .95 ? 340 : 300, (typeof VW !== 'undefined' && VW > 0 ? VW / 2 - 30 : 420)), 240, 420);
  o.gen = gen; o.rK = gen / 420;
  // kadraj Feza'nın başladığı yere ortalı: sahne düzeni (çift, Feza, Vela, pasta) ona göre kurulur; dar ekranda da herkes görünür
  const cx = o.faz === 'bekle' ? o.x : clamp(o.ox, o.x - 160, o.x + 160);
  const b = o.box; b.x0 = cx - gen; b.x1 = cx + gen; b.y0 = o.y - BL11B_AYY - BL11B_AYR - 30; b.y1 = o.y + (asp >= .95 ? 40 : 20);
}
function bl11BBasla(o) {
  if (o.faz !== 'bekle') return;
  if (Math.abs(P.x - o.x) > 140 && P.ground) {   // Ay taşına uzaktan dokunduysa: ay ışığı Feza'yı parıltıyla taşın yanına taşır (herkes kadraja sığsın)
    const yn = P.x < o.x ? -1 : 1; burst(P.x, P.y - 30, 12, ['#eaf4ff', '#cfe6ff', '#ffffff'], 120, 0.9, 5);
    P.x = o.x + yn * 110; if (P.safeX !== undefined) P.safeX = P.x; burst(P.x, P.y - 30, 14, ['#eaf4ff', '#ffb3d1', '#ffffff'], 140, 1, 5);
  }
  o.faz = 'final'; o.t = 0; o.ev = {}; o.ox = P.x; o.oy = P.y; o.yon = P.x <= o.x ? 1 : -1;
  if (typeof V11 !== 'undefined' && V11) V11.final = true;
  P.kilit = Math.max(P.kilit || 0, BL11B_SURE + 1); P.vx = 0; P.buf = 0;
  if (typeof omHepsiniBirak === 'function') { try { omHepsiniBirak(); } catch (e) {} }
  lightTarget = 1;
  o.topN = clamp(typeof V11 !== 'undefined' && V11 ? (V11.ayna | 0) : 0, 4, 12);
  o.velaX0 = o.velaX; o.velaY0 = o.y;
  bl11BKadraj(o);
  P.f = bl11BVelaYer(o) >= P.x ? 1 : -1;   // Feza vals eşi Vela'ya dönük
  bl11BSfx('baloFinal');
  OLAY.emit('baloFinal', { o, duration: BL11B_SURE, box: o.box });
}
// sahne düzeni (Feza'nın başladığı yere göre; o.gen + 20 ≈ görünen yarı genişlik): pasta tarafında Vela ve pasta,
// öbür tarafta Dede-Nine vals çifti (Feza'nın üstüne binmez; dar dikey ekranda daha sıkı döner)
function bl11BSag(o) { return o.ox < o.x + 120 ? 1 : -1; }
function bl11BYari(o) { return o.gen + 20; }
function bl11BVelaYer(o) { return o.ox + bl11BSag(o) * 78; }
function bl11BPastaX(o) { return o.ox + bl11BSag(o) * Math.min(350, bl11BYari(o) - 78); }

TUR.kaydet('ayBalosu', {
  kur(o) {
    o.faz = 'bekle'; o.t = 0; o.tt = 0; o.doruk = false; o.ev = {}; o.isP = 0; o.isindi = false; o.r = o.r || 2.4 * T;
    o.box = { x0: o.x - 460, y0: o.y - 600, x1: o.x + 460, y1: o.y + 85 }; o.gen = 420; o.rK = 1; o.ox = o.x; o.oy = o.y; o.yon = 1; o.topN = 4;
    o.velaX = o.x - 120; o.velaD = 'dur'; o.velaT = 0;
    o.V = { yon: 1, poz: 'dur', mutlu: 1, faz: 0, don: 0, pelerin: null, golgeYok: false, bebek: null, alfa: 1, el: 0, uyku: false };
    o.H = { yon: 1, mutlu: 1, kik: 0, alfa: 1, ton: 0, el: 0, uyku: false, isik: 1 };
    o.Y = { kanat: undefined, yon: 1, uyku: false, goz: 1, mutlu: 1 };
    o.PO = { kapak: 0, parla: 0, alfa: 1 };
    BALO11.o = o; bl11BAyYer(o);
  },
  testBitir(o) {   // B11T.bitir('balo'): finali başlatıp sonuna sar (doruk ve tamam olayları yine yayılır)
    if (o.faz === 'bekle') { if (P.ucus) return; bl11BBasla(o); }
    if (o.faz === 'final') { o.ev.ay = o.ev.vals = true; o.t = Math.max(o.t, BL11B_DORUK - 0.05); }
  },
  dokun(o) { if (o.faz === 'bekle' && !P.ucus && DURUM === 'oyun') bl11BBasla(o); else o.dokundu = false; },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, 0.05); o.tt += dt;
    if (!o.isindi && Math.abs(P.x - o.x) < 3000) o.isindi = bl11BHazirla(o);
    if (o.faz === 'bekle') {
      // Vela Ay taşının yanında bekler; Feza yaklaşınca sevinip el sallar
      const uz = Math.abs(P.x - o.x); o.velaT += dt;
      if (uz < 520 && o.velaD === 'dur') { o.velaD = 'sevin'; o.velaT = 0; }
      if (o.velaD === 'sevin' && o.velaT > 1.2) { o.velaD = 'el'; o.velaT = 0; }
      if (DURUM === 'oyun' && !P.ucus && P.ground && Math.abs(P.x - o.x) < 2.2 * T) bl11BBasla(o);
      return;
    }
    if (o.faz !== 'final') return;
    const a0 = o.t; o.t += dt; const a = o.t, ev = o.ev;
    bl11BKadraj(o);
    if (!ev.ay && a >= 4.5) {
      ev.ay = true; bl11BSfx('ayCik'); OLAY.emit('baloAy', { o });
      const A = bl11BAyYer(o);   // Ay bulutlardan "pıt" diye çıkar: iki gümüş halka + çevresine yıldız tozu
      ripples.push({ x: A.x, y: A.y, r: A.r * 0.8, life: 1.8 }, { x: A.x, y: A.y, r: A.r * 0.5, life: 2.4 });
      burst(A.x, A.y, 30, ['#fff4d6', '#ffe7a8', '#eaf4ff', '#ffb3d1', '#ffffff'], 260, 1.8, 7);
    }
    if (a0 < 5.6 && a >= 5.6) { const A = BALO11.ay; burst(A.x, A.y - A.r * 0.1, 12, ['#ffffff', '#fff4d6', '#ffb3d1'], 120, 1.1, 5); }   // Ay gözlerini açar: tatlı parıltı
    if (a0 < 8.1 && a >= 8.1 && Number.isFinite(o.dX)) burst(o.dX, o.y - 30, 12, ['#d9c8ff', '#eaf4ff', '#ffb3d1', '#ffffff'], 130, 1, 5);   // Dede (Pıtır kucağında) iner
    if (a0 < 8.8 && a >= 8.8 && Number.isFinite(o.nX)) burst(o.nX, o.y - 30, 12, ['#ffb3d1', '#eaf4ff', '#ffe7a8', '#ffffff'], 130, 1, 5);   // Nine iner
    if (a0 < 8.2 && a >= 8.2) { const px = bl11BPastaX(o); burst(px, o.y - 70, 14, ['#ffd27a', '#ffffff', '#ffb3d1', '#eaf4ff'], 140, 1.1, 5); }   // pasta gümüş tepsiyle yerine konar
    if (!ev.vals && a >= 9) { ev.vals = true; OLAY.emit('baloVals', { o }); }
    if (a0 < 0.15 && a >= 0.15) { ripples.push({ x: o.x, y: o.y - 60, r: 0, life: 1.6 }); burst(o.x, o.y - 62, 22, ['#eaf4ff', '#cfe6ff', '#ffe7a8', '#ffb3d1', '#ffffff'], 180, 1.3, 6); }
    if (a0 < 5.6 && a >= 5.6) burst(o.x, o.y - 10, 26, ['#eaf4ff', '#cfe6ff', '#ffffff', '#d9c8ff'], 220, 1.5, 6);
    if (!ev.doruk && a >= BL11B_DORUK) {
      ev.doruk = true; o.doruk = true; lightTarget = 1; bl11BSfx('baloDoruk'); OLAY.emit('baloDoruk', { o });
      ripples.push({ x: o.x, y: o.y - 40, r: 0, life: 2.4 });
      burst(o.x, o.y - 140, 40, ['#eaf4ff', '#ffb3d1', '#ffe7a8', '#c39bff', '#9ff0d0', '#ffffff'], 260, 2, 7);
    }
    if (o.doruk && a > BL11B_DORUK + 5) o.doruk = false;
    // dorukta Feza iki vuruşta bir sevinçle zıplar
    if (a >= BL11B_DORUK && a < BL11B_DORUK + 3.6 && P.ground && !P.ucus && Math.floor(a0 / (BL11B_VUR * 2)) < Math.floor(a / (BL11B_VUR * 2))) {
      P.vy = -520; P.ground = false; burst(P.x, P.y - 4, 6, ['#eaf4ff', '#ffb3d1', '#ffffff'], 90, .7, 5);
    }
    if (a >= BL11B_SURE && !ev.tamam) { ev.tamam = true; o.faz = 'bitti'; o.done = true; OLAY.emit('baloTamam', { o }); }
  },
  ciz(o, tm) {
    if (o.x < cam.x - 1100 || o.x > cam.x + VW + 1100) return;
    const a = o.faz === 'bekle' ? 0 : o.t, nb = baloFinalNabiz();
    if (o.faz !== 'bekle' && BALO11.ayNow !== now) bl11BAyCizIc(g, tm, o, a);   // HARITA gök katmanında çizmediyse
    if (o.faz !== 'bekle') bl11BSutun(o, tm, a, nb);
    bl11BTas(o, tm, a, nb);
    if (o.faz === 'bekle') { bl11BVelaBekle(o, tm); return; }
    bl11BToplar(o, tm, a);
    bl11BPasta(o, tm, a, nb);
    bl11BHayaletler(o, tm, a, nb, false);
    bl11BAile(o, tm, a, nb);
  },
  cizOn(o, tm) {
    if (o.faz === 'bekle' || o.x < cam.x - 1100 || o.x > cam.x + VW + 1100) return;
    const a = o.t, nb = baloFinalNabiz();
    bl11BHayaletler(o, tm, a, nb, true);
    bl11BYarasalar(o, tm, a, nb);
    bl11BTozlar(o, tm, a);
    bl11BYagmur(o, tm, a);
  }
});

// ═══════════════════════════════ Ay + bulutlar ═══════════════════════════════
// HARITA gök katmanında (dünya dönüşümüyle) çağırabilir: o zaman Ay duvarların/kubbenin arkasında kalır.
function baloAyCiz(c, tm) { const o = BALO11.o; if (!o || o.faz === 'bekle') return; BALO11.ayNow = now; bl11BAyCizIc(c || g, tm, o, o.t); }
function bl11BAyCizIc(c, tm, o, a) {
  const A = bl11BAyYer(o), x = A.x, y = A.y, nb = baloFinalNabiz(), pop = a > 4.3 && a < 5.5 ? Math.sin((a - 4.3) / 1.2 * Math.PI) : 0, R = A.r * (1 + 0.07 * pop);   // çıkarken minik bir zıplama
  const cik = smooth(clamp((a - 2.6) / 2.8, 0, 1)), son = a > BL11B_SURE - 2 ? 1 - (a - BL11B_SURE + 2) * 0.1 : 1;
  A.a = 0.35 + 0.65 * cik;
  const gco = c.globalCompositeOperation;
  c.globalCompositeOperation = 'lighter';
  bl11BIsik(c, '#fff4d6', x, y, R * (2.1 + 0.6 * cik), (0.12 + 0.3 * cik + 0.05 * nb) * son);
  bl11BIsik(c, '#cfe6ff', x, y, R * 3.6, 0.12 * cik * son);
  c.globalCompositeOperation = gco;
  const sp = bl11BAySpr(); if (!sp) return;
  const k = (R / 100) * (0.92 + 0.08 * cik), ea = c.globalAlpha;
  c.globalAlpha = ea * A.a; bl11BKoy(c, sp, x, y, k);
  // tatlı yüz: önce uykulu kapalı gözler, Ay çıkınca açılıp gülümser; dorukta kocaman güler
  const M = c.getTransform(); c.translate(x, y); c.scale(k, k);
  const uyan = a > 5.6, dor = a >= BL11B_DORUK && a < BL11B_DORUK + 4;
  c.strokeStyle = '#c8955a'; c.lineWidth = 4.5; c.lineCap = 'round';
  for (const sx of [-1, 1]) {
    const gx = sx * 32, gy = -6;
    if (!uyan || dor || ((tm % 4.6) < 0.14)) { c.beginPath(); if (uyan) c.arc(gx, gy + 6, 12, Math.PI * 1.15, Math.PI * 1.85); else c.arc(gx, gy - 2, 11, 0.25, Math.PI - 0.25); c.stroke(); }
    else { c.fillStyle = '#5a4a7a'; c.beginPath(); c.ellipse(gx, gy, 8, 10, 0, 0, BL11B_PI2); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(gx - 3, gy - 4, 3.6, 0, BL11B_PI2); c.fill(); c.beginPath(); c.arc(gx + 3, gy + 3.5, 1.6, 0, BL11B_PI2); c.fill(); }
  }
  c.beginPath(); if (dor) { c.fillStyle = '#c8706a'; c.moveTo(-18, 24); c.quadraticCurveTo(0, 30, 18, 24); c.quadraticCurveTo(14, 46, 0, 46); c.quadraticCurveTo(-14, 46, -18, 24); c.fill(); }
  else { c.arc(0, 22, uyan ? 16 : 9, 0.35, Math.PI - 0.35); c.stroke(); }
  c.setTransform(M); c.globalAlpha = ea;
  // bulutlar: 2,6–6 sn arası iki yana açılıp söner
  const ac = smooth(clamp((a - 2.4) / 3.4, 0, 1));
  if (ac < 1) {
    const B = [[-1, -70, -40, 0], [1, 60, -20, 1], [-1, -40, 50, 2], [1, 50, 60, 3]];
    for (const [yn, dx, dy, i] of B) {
      const bs = bl11BBulutSpr(i); const bx = x + dx + yn * ac * 420, by = y + dy - ac * 20 + Math.sin(tm * 0.5 + i) * 4;
      c.globalAlpha = ea * (1 - ac) * 0.97; bl11BKoy(c, bs, bx, by, 1.05);
    }
    c.globalAlpha = ea;
  }
}

// ═══════════════════════════════ ay ışığı sütunu, zemin ışık havuzu, nabız ═══════════════════════════════
function bl11BSutun(o, tm, a, nb) {
  const u = smooth(clamp((a - 4.8) / 2, 0, 1)); if (u <= 0) return;
  const A = BALO11.ay, son = a > BL11B_SURE - 2.5 ? 1 - smooth((a - BL11B_SURE + 2.5) / 2.5) * 0.5 : 1, dor = a >= BL11B_DORUK && a < BL11B_DORUK + 3 ? 1 - (a - BL11B_DORUK) / 3 : 0;
  const sp = bl11BSutunSpr(), y0 = A.y + A.r * 0.4, y1 = o.y + 6, L = (y1 - y0) * u;
  g.save(); g.globalCompositeOperation = 'lighter';
  if (sp) { g.globalAlpha = (0.36 + 0.08 * nb + 0.18 * dor) * son; g.drawImage(sp, A.x - 170 * o.rK * 1.3, y0, 340 * o.rK * 1.3, L); g.globalAlpha = 0.1 * son; g.drawImage(sp, A.x - 60, y0, 120, L); g.globalAlpha = 1; }
  if (u >= 1) {
    bl11BIsikE(g, '#cfe6ff', o.x, o.y, 330 * o.rK, 42, (0.32 + 0.12 * nb + 0.18 * dor) * son);
    bl11BIsikE(g, '#eaf4ff', o.x, o.y, 160 * o.rK, 16, (0.16 + 0.1 * nb) * son);
    // her ölçünün başında zeminde genişleyen gümüş halka
    const ol = (a % BL11B_OLCU) / BL11B_OLCU;
    if (a > 9) { g.globalAlpha = (1 - ol) * 0.5 * son; g.strokeStyle = '#eaf4ff'; g.lineWidth = 2.5; g.beginPath(); g.ellipse(o.x, o.y, 60 + ol * 360 * o.rK, 8 + ol * 30, 0, 0, BL11B_PI2); g.stroke(); g.globalAlpha = 1; }
  }
  g.restore();
}
// ── Ay taşı (kaidede hilal taş): beklerken nefes alır gibi parlar; final başında ışık göğe fışkırır
function bl11BTas(o, tm, a, nb) {
  const sp = bl11BTasSpr(), hs = bl11BHilalSpr(), x = o.x, y = o.y, bek = o.faz === 'bekle';
  // final başında hilal taş göğe süzülüp Ay'a karışır, kaide ışık havuzunda söner
  const up = bek ? 0 : smooth(clamp((a - 0.2) / 2.6, 0, 1)), kA = bek ? 1 : 1 - smooth(clamp((a - 2.5) / 2, 0, 1)), A = BALO11.ay;
  const hx = lerp(x, A.x, up), hy = lerp(y - 60, A.y, up) - Math.sin(up * Math.PI) * 40, hk = 1 - up * 0.5, hA = 1 - smooth(clamp((up - 0.8) / 0.2, 0, 1));
  const yak = bek ? clamp(1 - Math.abs(P.x - x) / 700, 0, 1) : 1, n = 0.5 + 0.5 * Math.sin(tm * 2);
  g.save(); g.globalCompositeOperation = 'lighter';
  bl11BIsik(g, '#cfe6ff', hx, hy - 2, (48 + 14 * n) * hk, (bek ? 0.3 + 0.35 * yak * n : 0.7) * hA);
  if (!bek && up > 0 && up < 1) for (let j = 1; j < 7; j++) { const uu = Math.max(0, up - j * 0.04), ex = lerp(x, A.x, uu), ey = lerp(y - 60, A.y, uu) - Math.sin(uu * Math.PI) * 40; bl11BIsik(g, '#eaf4ff', ex, ey, 18 - j * 2, 0.5 * (1 - j / 7)); }
  g.restore();
  if (kA > 0.01) { const ea = g.globalAlpha; g.globalAlpha = ea * kA; bl11BKoy(g, sp, x, y, 1); g.globalAlpha = ea; }
  if (hA > 0.01 && hs) { const ea = g.globalAlpha, M = g.getTransform(); g.globalAlpha = ea * hA; g.translate(hx, hy); g.rotate(up * 0.6 + (bek ? Math.sin(tm * 1.5) * 0.05 : 0)); bl11BKoy(g, hs, 0, 0, hk); g.setTransform(M); g.globalAlpha = ea; }
  if (bek) {   // "bana dokun" ışıltısı: hilalin çevresinde dönen üç parıltı
    const is = bl11BIsiltiSpr(); if (is) for (let i = 0; i < 3; i++) { const an = tm * 1.4 + i * BL11B_PI2 / 3, r = 6 + 4 * Math.sin(tm * 3 + i); g.globalAlpha = 0.6 + 0.4 * Math.sin(tm * 2 + i); g.drawImage(is, x + Math.cos(an) * 30 - r, y - 62 + Math.sin(an) * 16 - r, r * 2, r * 2); }
    g.globalAlpha = 1;
  }
}
// ── final öncesi: Vela taşın yanında bekler
function bl11BVelaBekle(o, tm) {
  if (typeof vampirCiz !== 'function') return;
  const V = o.V; V.yon = P.x < o.velaX ? -1 : 1; V.poz = o.velaD; V.mutlu = 1; V.faz = tm; V.don = 0; V.pelerin = null; V.bebek = null; V.golgeYok = false; V.alfa = 1; V.el = 0;
  vampirCiz(g, 'kiz', o.velaX, o.y, 1, tm, V);
}
// ── göğe yükselen ışık topları: Ay taşından ve döndürülen aynaların yönünden Ay'a
function bl11BToplar(o, tm, a) {
  if (a > 4.2) return;
  const A = BALO11.ay, n = o.topN, is = bl11BIsiltiSpr();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const t0 = 0.2 + i * 0.18, u = clamp((a - t0) / 2.2, 0, 1); if (u <= 0 || u >= 1) continue;
    const e = smooth(u), sx = o.x + (i - (n - 1) / 2) * 70 * o.rK, sy = o.y - 30 - (i % 3) * 30;
    const x = lerp(sx, A.x + Math.cos(i * 2.4) * 30, e) + Math.sin(u * 7 + i) * 22 * (1 - e), y = lerp(sy, A.y + Math.sin(i * 2.4) * 20, e);
    const col = ['#cfe6ff', '#ffb3d1', '#ffe7a8', '#d9c8ff', '#9ff0d0'][i % 5];
    for (let j = 1; j < 5; j++) bl11BIsik(g, col, x + Math.sin(u * 7 + i - j * 0.2) * 6, y + j * 12, 10 - j * 2, 0.4 * (1 - j / 5));
    bl11BIsik(g, col, x, y, 22, 0.8); if (is) { g.globalAlpha = 0.95; g.drawImage(is, x - 8, y - 8, 16, 16); g.globalAlpha = 1; }
  }
  g.restore();
}
// ── Nine'nin pastası: ışıltılı sehpasıyla süzülüp gelir
function bl11BPasta(o, tm, a, nb) {
  const u = smooth(clamp((a - 6) / 2.2, 0, 1)); if (u <= 0) return;
  const px = bl11BPastaX(o), y = o.y, hy = (1 - u) * 160 + Math.sin(tm * 2) * 3 * (1 - u), sp = bl11BSehpaSpr();
  g.save(); g.globalAlpha = Math.min(1, u * 2.5);
  g.globalCompositeOperation = 'lighter'; bl11BIsikE(g, '#ffd27a', px, y - 80 - hy, 110, 90, 0.25 + 0.15 * nb); g.globalCompositeOperation = 'source-over';
  bl11BKoy(g, sp, px, y - hy, 1);
  const PO = o.PO; PO.kapak = 0; PO.parla = a > 20 ? 1 : 0.3 + 0.7 * nb; PO.alfa = u;
  if (typeof pa11PastaCiz === 'function') { try { pa11PastaCiz(g, px, y - 46 - hy, 0.42, tm, PO); } catch (e) { bl11BPastaYedek(px, y - 46 - hy); } } else bl11BPastaYedek(px, y - 46 - hy);
  g.restore();
}
function bl11BPastaYedek(x, y) {
  const K = [[34, 22, '#fff1f6'], [26, 18, '#ffd6e6'], [18, 16, '#fff1f6']]; let yy = y;
  for (const [w, h, c] of K) { g.fillStyle = c; g.beginPath(); g.roundRect ? g.roundRect(x - w, yy - h, w * 2, h, 5) : g.rect(x - w, yy - h, w * 2, h); g.fill(); g.strokeStyle = 'rgba(190,90,130,0.6)'; g.lineWidth = 1; g.stroke(); yy -= h; }
  g.fillStyle = '#ff4f7a'; g.beginPath(); g.arc(x, yy - 6, 7, 0, BL11B_PI2); g.fill();
}

// ═══════════════════════════════ aile: geliş, vals, poz ═══════════════════════════════
function bl11BAile(o, tm, a, nb) {
  if (typeof vampirCiz !== 'function') return;
  const V = o.V, dor = a >= BL11B_DORUK && a < BL11B_DORUK + 3.2, poz = smooth(clamp((a - 30.5) / 1.6, 0, 1)), vur = a / BL11B_VUR;
  const zip = (i) => dor ? Math.max(0, Math.sin(((a - BL11B_DORUK) / (BL11B_VUR * 2) + i * 0.15) * Math.PI)) * 26 : 0;
  // çiftin dolaştığı yer: pastanın öbür yanı
  const pastaSag = bl11BSag(o), hv = bl11BYari(o), yar = Math.max(30, (hv - 105) / 2), cx0 = o.ox - pastaSag * (75 + hv - 30) / 2;
  const rr0 = Math.min(46, yar - 22), cdx = Math.sin(a * 0.32) * Math.max(0, Math.min(70, yar - 26 - rr0)), ccx = cx0 + cdx;
  // Dede (kucağında Pıtır) ve Nine: 5,5–9 sn süzülerek gelir (pelerin açık), sonra vals
  const gelD = smooth(clamp((a - 5.5) / 2.6, 0, 1)), gelN = smooth(clamp((a - 6.2) / 2.6, 0, 1));
  const an = a > 9 ? (a - 9) * BL11B_PI2 / (BL11B_OLCU * 2) : 0, rr = rr0 * smooth(clamp((a - 9) / 1, 0, 1));
  const fx = o.ox, posD = fx - pastaSag * 88, posN = fx - pastaSag * Math.min(160, hv - 50);
  let dX = ccx + Math.cos(an) * rr, nX = ccx - Math.cos(an) * rr;
  dX = lerp(dX, posD, poz); nX = lerp(nX, posN, poz);
  const dz = a > 9 && poz < 1 ? Math.sin(an) * (1 - poz) : 0;   // vals derinliği: arkadaki biraz geride (yukarıda, küçük)
  const dY = o.y - (1 - gelD) * 380 - zip(0) + dz * 5, nY = o.y - (1 - gelN) * 420 - zip(1) - dz * 5;
  dX = lerp(o.x - pastaSag * (o.gen + 300), dX, gelD); nX = lerp(o.x - pastaSag * (o.gen + 360), nX, gelN); o.dX = dX; o.nX = nX;
  const dOn = Math.sin(an) > 0;   // önde olan sonra çizilir
  const cizD = () => {
    V.yon = gelD < 1 ? pastaSag : (poz > 0.5 ? (P.x < dX ? -1 : 1) : (nX < dX ? -1 : 1)); V.mutlu = 1; V.faz = a; V.don = 0; V.alfa = 1; V.golgeYok = gelD < 0.9; V.el = 0;
    V.poz = gelD < 0.95 ? 'ucus' : 'kucak'; V.pelerin = gelD < 0.95 ? 1 : (a > 9 && poz < 0.5 ? 0.3 + 0.2 * Math.abs(Math.sin(an)) : null);
    V.bebek = poz > 0.5 ? 'el' : dor ? 'alkis' : a > 9 ? (Math.floor(vur / 6) % 2 ? 'alkis' : 'dans') : 'otur';
    vampirCiz(g, 'dede', dX, dY, 1 + dz * 0.04, tm, V); V.bebek = null;
  };
  const cizN = () => {
    V.yon = gelN < 1 ? pastaSag : (poz > 0.5 ? (P.x < nX ? -1 : 1) : (dX < nX ? -1 : 1)); V.mutlu = 1; V.faz = a + 0.3; V.don = 0; V.alfa = 1; V.golgeYok = gelN < 0.9; V.bebek = null;
    V.poz = gelN < 0.95 ? 'ucus' : poz > 0.5 ? (a > 32.5 ? 'el' : 'sevin') : dor ? 'sevin' : a > 9 ? 'dans' : 'el'; V.pelerin = gelN < 0.95 ? 1 : null; V.el = 0;
    vampirCiz(g, 'nine', nX, nY, 1 - dz * 0.04, tm, V);
  };
  if (dOn) { cizN(); cizD(); } else { cizD(); cizN(); }
  // Vela: taşın yanından Feza'nın yanına koşar, Feza'yla vals eder (dört ölçüde bir fırıl döner), sonda poz
  const vx1 = bl11BVelaYer(o), git = smooth(clamp(a / 1.2, 0, 1));
  const vX = lerp(o.velaX, vx1, git) + (a > 9 && poz < 1 ? Math.sin((a - 9) * BL11B_PI2 / (BL11B_OLCU * 2)) * 10 : 0), vY = o.y - zip(2) - (a < 1.2 ? Math.sin(git * Math.PI) * 14 : 0);
  V.yon = P.x < vX ? -1 : 1; V.faz = a + 0.1; V.pelerin = null; V.golgeYok = false; V.bebek = null; V.alfa = 1; V.el = 0;
  const olc = Math.floor(a / BL11B_OLCU); V.don = a > 9 && poz < 0.5 && olc % 4 === 3 ? (a % BL11B_OLCU) / BL11B_OLCU : 0;
  V.poz = a < 1.2 ? 'sevin' : a < 9 ? (a < 4 ? 'el' : 'sasir') : poz > 0.5 ? (a > 32 ? 'el' : 'sevin') : dor ? 'sevin' : 'dans';
  if (a >= 4 && a < 9 && a > 6.8) V.poz = 'alkis';
  vampirCiz(g, 'kiz', vX, vY, 1, tm, V);
}

// ═══════════════════════════════ hayaletler (havada vals eden iki çift) ═══════════════════════════════
function bl11BHayaletler(o, tm, a, nb, on) {
  if (typeof hayalet11Ciz !== 'function') return;
  const gel = smooth(clamp((a - 6.5) / 2.5, 0, 1)); if (gel <= 0) return;
  const H = o.H, dor = a >= BL11B_DORUK && a < BL11B_DORUK + 4, poz = smooth(clamp((a - 30.5) / 1.6, 0, 1));
  for (let i = 0; i < 4; i++) {
    const cift = i >> 1, yn = i & 1 ? 1 : -1;
    const ccx = o.x + (cift ? 1 : -1) * 165 * o.rK + Math.sin(a * 0.4 + cift * 2) * 50, ccy = o.y - 225 - cift * 40 + Math.sin(a * 0.9 + cift) * 10;
    const an = a * BL11B_PI2 / (BL11B_OLCU * 2) * (dor ? 1.8 : 1) + (yn > 0 ? Math.PI : 0) + cift;
    const derin = Math.sin(an); if ((derin > 0) !== on) continue;
    let x = ccx + Math.cos(an) * 34, y = ccy + derin * 8;
    const px = o.ox + (i - 1.5) * 70, py = o.y - 150 - (i % 2) * 22;
    x = lerp(x, px, poz); y = lerp(y, py, poz);
    x = lerp(x + yn * 300, x, gel); y = lerp(y - 380, y, gel);
    H.yon = Math.cos(an) > 0 ? -yn : yn; H.kik = dor || (Math.sin(a * 1.3 + i) > 0.8) ? 1 : 0; H.el = poz > 0.5 ? 1 : 0.4 + 0.6 * nb; H.ton = i; H.isik = 1; H.alfa = 0.95 * gel; H.uyku = false; H.mutlu = 1;
    hayalet11Ciz(g, x, y, 0.8 * (1 + derin * 0.06), tm + i, H);
  }
}
// ═══════════════════════════════ yarasalar: Ay'ın çevresinde sekizler, dorukta salonda büyük halka ═══════════════════════════════
function bl11BYarasalar(o, tm, a, nb) {
  if (typeof yarasa11Ciz !== 'function') return;
  const gel = smooth(clamp((a - 7) / 2, 0, 1)); if (gel <= 0) return;
  const A = BALO11.ay, Y = o.Y, dor = a >= BL11B_DORUK && a < BL11B_DORUK + 4.5, poz = smooth(clamp((a - 30.5) / 1.6, 0, 1));
  for (let i = 0; i < 6; i++) {
    const ph = a * 0.9 + i * BL11B_PI2 / 6;
    let x = A.x + Math.sin(ph) * (A.r + 90) * o.rK * 1.2, y = A.y + 40 + Math.sin(2 * ph) * 60;
    if (dor) { const an = a * 2.2 + i * BL11B_PI2 / 6; x = lerp(x, o.x + Math.cos(an) * 260 * o.rK, 0.85); y = lerp(y, o.y - 200 + Math.sin(an) * 70, 0.85); }
    const pxp = o.ox + (i - 2.5) * 62 * o.rK, pyp = o.y - 270 - Math.abs(i - 2.5) * -14;
    x = lerp(x, pxp, poz); y = lerp(y, pyp + Math.sin(tm * 3 + i) * 5, poz);
    x = lerp(x + (i % 2 ? 1 : -1) * 520, x, gel); y = lerp(y - 300, y, gel);
    Y.yon = Math.cos(ph) >= 0 ? 1 : -1; Y.kanat = undefined; Y.uyku = false; Y.mutlu = 1;
    const gco = g.globalCompositeOperation; g.globalCompositeOperation = 'lighter'; bl11BIsik(g, '#c39bff', x, y, 26, 0.22); g.globalCompositeOperation = gco;
    yarasa11Ciz(g, x, y, 0.9, tm + i * 0.7, Y);
  }
}
// ═══════════════════════════════ ay tozu (ışık sütununda süzülen gümüş tozlar) ═══════════════════════════════
const BL11B_TOZ_N = 26;
function bl11BTozlar(o, tm, a) {
  const u = smooth(clamp((a - 5.5) / 2, 0, 1)); if (u <= 0) return;
  const is = bl11BIsiltiSpr(); if (!is) return;
  const A = BALO11.ay, h = o.y - A.y, son = a > BL11B_SURE - 2 ? 1 - (a - BL11B_SURE + 2) / 2 : 1;
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let k = 0; k < BL11B_TOZ_N; k++) {
    const v = ((tm * (0.05 + (k % 5) * 0.012) + k * 0.381) % 1), x = A.x + (((k * 0.618) % 1) - 0.5) * 300 * o.rK * (0.5 + v * 0.7) + Math.sin(tm * 0.8 + k) * 14, y = A.y + A.r * 0.5 + v * h;
    const r = 2.5 + (k % 3) * 1.6; g.globalAlpha = Math.sin(v * Math.PI) * 0.8 * u * son; g.drawImage(is, x - r, y - r, r * 2, r * 2);
  }
  g.restore();
}
// ═══════════════════════════════ doruk: Ay'dan gümüş halkalar + yıldız yağmuru ═══════════════════════════════
const BL11B_YAG_N = 36;
function bl11BYagmur(o, tm, a) {
  const u0 = a - BL11B_DORUK; if (u0 < 0 || u0 > 7) return;
  const A = BALO11.ay;
  g.save(); g.globalCompositeOperation = 'lighter';
  if (u0 < 2.6) for (let k = 0; k < 3; k++) {
    const u = clamp((u0 - k * 0.35) / 2.2, 0, 1); if (u <= 0 || u >= 1) continue; const e = 1 - Math.pow(1 - u, 2.2);
    g.globalAlpha = (1 - u) * 0.65; g.strokeStyle = ['#eaf4ff', '#ffb3d1', '#ffe7a8'][k]; g.lineWidth = 4 - k; g.beginPath(); g.arc(A.x, A.y, A.r + e * (560 + k * 90), 0, BL11B_PI2); g.stroke();
  }
  if (u0 < 0.5) bl11BIsik(g, '#ffffff', A.x, A.y, A.r * 2.6, (0.5 - u0) * 0.9);
  const vw = VW, vh = VW * H / Math.max(1, W), sn = u0 > 5.4 ? 1 - (u0 - 5.4) / 1.6 : 1;
  for (let k = 0; k < BL11B_YAG_N; k++) {
    const ys = bl11BYildizSpr(k % 6); if (!ys) break;
    const t0 = (k * 0.29) % 2.2, u = u0 - t0; if (u < 0) continue;
    const x = cam.x + ((k * 0.618 * vw) % vw) + Math.sin(u * 2 + k) * 20, y = cam.y - 20 + u * (80 + (k % 5) * 16);
    if (y > cam.y + vh + 20) continue;
    const sc = 0.9 + (k % 3) * 0.35; g.globalAlpha = sn * (0.7 + 0.3 * Math.sin(tm * 8 + k));
    const M = g.getTransform(); g.translate(x, y); g.rotate(u * (1 + (k % 3)) + k); bl11BKoy(g, ys, 0, 0, sc); g.setTransform(M);
  }
  g.restore();
}

// ═══════════════════════════════ dokunma: Ay taşına dokununca final başlar ═══════════════════════════════
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 11 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0) return;
  const o = BALO11.o; if (!o || o.faz !== 'bekle' || Math.abs(P.x - o.x) > 12 * T) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  if (((wx - o.x) / 60) ** 2 + ((wy - (o.y - 55)) / 70) ** 2 < 1) bl11BBasla(o);
});
