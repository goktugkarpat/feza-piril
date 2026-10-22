/* meyve.js — Bölüm 9 (Pırıl'ın Ejderha Vadisi) mini oyun 1: YAVRULARA MEYVE (önek my9), nesne türü 'meyveMini'. Sahibi: MEYVE.
   Çiçekli açıklıkta, yosunlu yumuşak yaprak bir yuvada üç aç ejderha yavrusu (gök, fıstık, gül) ağızlarını açıp "cik cik" eder.
   Yanlarındaki tombul meyve ağacında beş parlak meyve sallanır: çilek (gül), yaban mersini (mavi), armut (sarı), üzüm (yeşil),
   şeftali (turuncu). Feza yaklaşınca kadraj yumuşakça yerleşir (Bölüm 8 kabakyuz.js / kazan.js gibi: P.ucus = o ile fizik devralınır,
   Feza'yı ve Pırıl'ı bu dosya çizer) ve OLAY 'meyveBasla' (Pırıl'ın giriş sözü CORE'da). Her yavrunun başında, istediği meyvenin
   RESMİ olan bir düşünce baloncuğu belirir (yazı yok). Feza bir meyveye dokunur → meyve daldan kopup Feza'nın eline süzülür, Feza
   onu yavrulara doğru savurur ('meyveUzat' pozu), meyve ışıltılı bir yay çizip o meyveyi isteyen yavruya uçar:
     doğru → yavru ağzıyla kapar, "ham ham" çiğner (meyve renginde minik kırıntılar), kıpır kıpır dans eder, karnı ılık ışıkla parlar;
     baloncuktaki resim kalplerle söner. İsteyen yoksa meyve en yakın aç yavruya gider → yavru sevimli bir "ıh-ıh" ile başını çevirir,
     baloncuğu kıpırdayıp istediğini gösterir, meyve yavaşça ağaçtaki yerine süzülür (ceza yok). Yenen meyvenin yerinde yenisi açar.
   3 tur × 3 yavru; son turda ortadaki yavru iki meyve ister (baloncukta iki resim). Her turun sonunda üçü birlikte sevinir. Bitince
   üçü birlikte kanat çırpıp havalanır, yuvanın üstünde süzülüp ışık tozu saçar (ağaç ve yuva ışıldar), sonra yuvaya konar.
   Kaybetme/süre/yazı/öğretici el yok. İpucu ışıkla: ~9 sn dokunulmazsa istenen meyveler parıldar, Pırıl baloncukla meyve arasında
   süzülür ('meyveIpucu'); ~25 sn dokunulmazsa (Pırıl bir kez yardım ettiyse ~6 sn) Pırıl doğru meyveye uçar, "işte bu!" der gibi
   gösterir ve burnuyla dürter → meyve yavruya uçar ('meyveYardim'). Çocuk hâlâ dokunmuyorsa Pırıl art arda verir (dokunmadan
   bütün oyun ≈ 75 sn). Çocuk dokununca yardım bırakır. Asla takılmaz.
   Baloncuğa dokunmak: baloncuk kıpırdar, yavru cikler, istenen meyve parıldar. Yavruya dokunmak: kıkırdar, zıplar.
   Klavye yedeği: ←/→ meyve seçer, Boşluk/Enter/E verir.
   Olaylar: 'meyveBasla' {o} · 'meyveTur' {o, n (1..3)} · 'meyveVer' {o, n (doğru verilen toplam, 1..10), dogru, yavru (0..2), meyve
     ('cilek'|'mersin'|'armut'|'uzum'|'seftali'), yardim} (meyve yavruya varınca) · 'meyveIpucu' {o, n} · 'meyveYardim' {o, n} ·
     'meyveKalk' {o} (yavrular havalanıyor) · 'meyveBitti' {o} (Feza serbest, kapı açılır). Bitince V9.meyve = true, o.done = true
     (o.tk.bitti = true: kapi.js'in eski denetimiyle de açılır).
   Sesler (MUZIK, typeof korumalı): AU.sfx('meyveUc', n) meyve fırlar · 'meyveHam' yavru yer · 'meyveIh' istemedi ·
     ayrıca varsa 'yavruCik2' (cik cik), 'kanatCirp' (havalanış), 'parilti'.
   Ortak çizici: YAVRU'nun yavruCiz(c, x, y, s, t, o) (typeof kontrolü; yoksa bu dosyanın sade yedeği my9YavruYedek).
   Dışa açık: MEYVE.o, MEYVE.aktif (oyun sürerken nesne).
   Yerleşim (bolum9.js): nesne('meyveMini', 220, yuzey(220), {x0, x1}); o.x-340 … o.x+360 DÜZ zemin; Feza o.x-280'i geçince başlar (o.x-212'de durur).
   Hemen ilerisinde miniKapi (bagId) — kapı o.done / V9.meyve ile açılır. Sözleşme: src/BOLUM9.md. */
'use strict';
const MY9_GIR = -212;              // Feza'nın oyun boyunca durduğu yer (o.x'e göre): ağacın altında
const MY9_AKTIF = -280;            // Feza o.x - 280'i geçince etkinlik başlar
const MY9_AX = -40;                // meyve ağacının gövde tabanı (o.x'e göre)
const MY9_MS = 0.92;               // meyve ölçeği (ağaçta)
const MY9_SAP = 21;                // meyvenin sap ucundan gövde ortasına uzaklık (s = 1)
// meyvelerin asılı olduğu yerler (ağaç tabanına göre): yay gibi dizili, aralar ≥ 105 birim (kocaman dokunma hedefleri)
const MY9_SPOT = [[-200, -192], [-150, -298], [-52, -346], [46, -298], [76, -200]];
const MY9_TUR = ['cilek', 'mersin', 'armut', 'uzum', 'seftali'];
const MY9_TON = ['#ff7fa8', '#8fa0ff', '#ffe27a', '#b8f08a', '#ffb07a'];      // meyvelerin ışık rengi
const MY9_KIR = [['#ff5f8a', '#ffd0dc', '#7fd070'], ['#5f74e8', '#b8c4ff', '#3a4cb8'], ['#ffd84a', '#fff2a8', '#e8b030'],
  ['#8fd860', '#d8ffb0', '#5aa83a'], ['#ff9a5c', '#ffd8b0', '#ff7f8f']];   // kırıntı renkleri
const MY9_YX = 176, MY9_YD = 66, MY9_YY = -32;   // yuvanın ortası, yavru aralığı, yavruların oturduğu yer (zemine göre)
const MY9_YRENK = ['gok', 'fistik', 'gul'];
const MY9_YS = 1.35;               // yavru ölçeği (yavruCiz s = 1 ≈ 36 birim boy → ≈ 49)
const MY9_YBOY = 36;               // yavrunun boyu (s = 1, birim): baloncuk yeri buna göre
const MY9_AGX = 13.2, MY9_AGY = -20.6, MY9_KRX = 3.4, MY9_KRY = -10;   // ağız ve karın (yavruCiz yerel, s = 1)
const MY9_BAL = [[-6, -122], [0, -160], [6, -122]];   // baloncuk merkezi (yavru tabanına göre): ortadaki yüksekte (iki meyve sığsın)
const MY9_BR = 36;                 // baloncuk yarıçapı
const MY9_GEL = 1.3, MY9_TURSON = 1.7, MY9_KALK = 6.4, MY9_DON = 0.5;
const MY9_EL = 1.2;                // 'meyveUzat' pozunun süresi (sn): .3'te meyve elde, .42'de bırakır
const MY9_UC = 0.82, MY9_UC_P = 1.0, MY9_YE = 0.95, MY9_DANS = 1.35, MY9_RED = 1.0, MY9_GERI = 1.05, MY9_BUY = 0.95;
const MY9_IPUCU = 4, MY9_GOSTER = 9, MY9_YARDIM = 20, MY9_YARDIM2 = 6, MY9_YARDIM3 = 1.1;   // P9C: ilk yardım 25 → 20 sn, art arda yardım arası 1.6 → 1.1 sn (dokunmadan oyun uzamasın)
const MY9_ISIK = ['#ffd27a', '#fff2c0', '#b89cff', '#6fd8a8', '#ff9fc0', '#7fe0f0', '#ffffff'];
const MY9_ALTIN = ['#ffd27a', '#ffe9a8', '#ffffff', '#c8f08a'];
const MY9_BOS = {};
const MEYVE = {
  o: null, klavye: false,
  get aktif() { const o = this.o; return o && o.my && o.my.aktif && !o.done ? o : null; }
};
function my9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function my9Cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function my9Glow(c, col, x, y, rx, ry, a) { if (a <= 0.003) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
const my9Yay = u => u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.exp(-6 * u) * Math.cos(u * 9);   // yaylı (biraz taşıp oturan) geçiş
const my9Zarf = (t, a, b) => t <= a || t >= b ? 0 : Math.sin((t - a) / (b - a) * Math.PI);
// sekiz yöne kaydırılmış koyu siluet: önbellek sprite'larına Pırıl çizgisindeki kalın, yumuşak kontur
function my9Kontur(hedef, kaynak, renk, d) {
  const w = kaynak.width, h = kaynak.height, t = my9Cv(w, h), q = t.getContext('2d');
  q.drawImage(kaynak, 0, 0); q.globalCompositeOperation = 'source-in'; q.fillStyle = renk; q.fillRect(0, 0, w, h);
  const z = hedef.getContext('2d'); z.save(); z.setTransform(1, 0, 0, 1, 0, 0);
  for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832; z.drawImage(t, Math.cos(a) * d, Math.sin(a) * d); }
  z.drawImage(kaynak, 0, 0); z.restore();
}

// ── önbellekli sprite'lar (ilk kullanımda bir kez) ──
const MY9S = { hazir: false };
const MY9_PX = 3;   // birim başına piksel (iPad'de S ≈ 2,3)
function my9Sprite() {
  if (MY9S.hazir) return; MY9S.hazir = true;
  const r = rng(9220);
  MY9S.meyve = MY9_TUR.map(ad => my9MeyveCiz(ad));
  MY9S.agac = my9AgacCiz(r);
  MY9S.yuvaArka = my9YuvaArkaCiz(r); MY9S.yuvaOn = my9YuvaOnCiz(r);
  MY9S.balon = my9BalonCiz(1); MY9S.balon2 = my9BalonCiz(1.42); MY9S.nokta = my9NoktaCiz();
  { const cv = MY9S.golge = my9Cv(128, 32), q = cv.getContext('2d'); q.translate(64, 16); q.scale(1, 0.25);
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 64); gr.addColorStop(0, 'rgba(30,60,50,0.5)'); gr.addColorStop(0.6, 'rgba(30,60,50,0.2)'); gr.addColorStop(1, 'rgba(30,60,50,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 64, 0, 6.2832); q.fill(); }
  { const cv = MY9S.pirilti = my9Cv(48, 48), q = cv.getContext('2d'); q.translate(24, 24);   // dört köşeli parıltı yıldızı
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 22); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    q.fillStyle = gr; q.fillRect(-24, -24, 48, 48);
    q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, d = i % 2 ? 3.2 : 20; i ? q.lineTo(Math.cos(a) * d, Math.sin(a) * d) : q.moveTo(Math.cos(a) * d, Math.sin(a) * d); } q.closePath(); q.fill(); }
  { const cv0 = my9Cv(30 * MY9_PX, 30 * MY9_PX), q = cv0.getContext('2d'); q.setTransform(MY9_PX, 0, 0, MY9_PX, 15 * MY9_PX, 15 * MY9_PX);   // açan çiçek (yeni meyvenin tomurcuğu)
    for (let i = 0; i < 5; i++) { const a = i * 1.2566 - Math.PI / 2; q.fillStyle = i % 2 ? '#ffb3cf' : '#ff9fc0'; q.beginPath(); q.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 5.4, 4.2, a, 0, 6.2832); q.fill(); }
    q.fillStyle = '#ffe27a'; q.beginPath(); q.arc(0, 0, 3.4, 0, 6.2832); q.fill(); q.fillStyle = '#fff6d0'; q.beginPath(); q.arc(-1, -1, 1.2, 0, 6.2832); q.fill();
    MY9S.cicek = my9Cv(30 * MY9_PX, 30 * MY9_PX); my9Kontur(MY9S.cicek, cv0, '#b0507a', 1.2 * MY9_PX); }
  MY9S.cimAgac = my9CimCiz(r, 330, 48); MY9S.cimYuva = my9CimCiz(r, 400, 40);
  { const cv = MY9S.yaprak = my9Cv(36, 20), q = cv.getContext('2d'); q.translate(18, 10);   // süzülen taç yaprağı (pembe)
    q.fillStyle = '#ffb3cf'; q.beginPath(); q.moveTo(-15, 0); q.quadraticCurveTo(-4, -9, 15, 0); q.quadraticCurveTo(-4, 9, -15, 0); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.ellipse(-3, -2, 7, 2.2, -0.1, 0, 6.2832); q.fill(); }
}
// ── meyveler: gövde ortası (0, 0), sap ucu (0, -MY9_SAP); kutu 64×70 birim, merkez (32, 40) ──
function my9MeyveCiz(ad) {
  const PX = MY9_PX, W = 64, H = 70, OX = 32, OY = 40, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, OX * PX, OY * PX); q.lineCap = 'round'; q.lineJoin = 'round';
  const rad = (x0, y0, r0, x1, y1, r1, a, b, c) => { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); gr.addColorStop(0, a); gr.addColorStop(0.55, b); gr.addColorStop(1, c); return gr; };
  const yaprak = (x, y, a, L, w, c1, c2) => { q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = c1; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(L * 0.5, -w, L, 0); q.quadraticCurveTo(L * 0.5, w, 0, 0); q.fill();
    q.strokeStyle = c2; q.lineWidth = 1.1; q.beginPath(); q.moveTo(1.5, 0); q.lineTo(L * 0.82, 0); q.stroke(); q.restore(); };
  const sap = (x1, y1) => { q.strokeStyle = '#6a4a2e'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, -MY9_SAP); q.quadraticCurveTo(x1 * 0.3 + 1.5, (y1 - MY9_SAP) * 0.5 - 2, x1, y1); q.stroke(); };
  const parla = (x, y, rx, ry, a) => { q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(x, y, rx, ry, a, 0, 6.2832); q.fill(); q.fillStyle = 'rgba(255,255,255,0.95)'; q.beginPath(); q.arc(x + rx * 0.9, y + ry * 1.6, Math.min(rx, ry) * 0.45, 0, 6.2832); q.fill(); };
  if (ad === 'cilek') {
    const yol = () => { q.beginPath(); q.moveTo(0, 21); q.bezierCurveTo(-11, 17, -21, 6, -20, -6); q.bezierCurveTo(-19, -14, -10, -16, 0, -14); q.bezierCurveTo(10, -16, 19, -14, 20, -6); q.bezierCurveTo(21, 6, 11, 17, 0, 21); q.closePath(); };
    yol(); q.fillStyle = rad(-7, -6, 2, 0, 0, 24, '#ff9fbc', '#ff4f7e', '#d32e5c'); q.fill();
    q.save(); yol(); q.clip(); q.fillStyle = 'rgba(150,20,60,0.25)'; q.beginPath(); q.ellipse(6, 12, 16, 10, 0, 0, 6.2832); q.fill(); q.restore();
    for (const [x, y] of [[-11, -6], [-3, -8], [6, -7], [13, -4], [-14, 2], [-6, 0], [3, 0], [11, 3], [-9, 8], [-1, 7], [7, 9], [-3, 14], [3, 15]]) {
      q.fillStyle = '#ffe9a0'; q.beginPath(); q.ellipse(x, y, 1.2, 1.9, 0.2, 0, 6.2832); q.fill(); q.fillStyle = 'rgba(170,30,70,0.4)'; q.beginPath(); q.arc(x + 0.6, y + 1.5, 0.9, 0, 6.2832); q.fill(); }
    for (let i = 0; i < 6; i++) yaprak(0, -14, -Math.PI / 2 + (i - 2.5) * 0.52, 12, 4.2, i % 2 ? '#4fbf5a' : '#62d06a', '#2f8a3e');
    sap(0, -14); parla(-10, -6, 3.4, 5, 0.5);
  } else if (ad === 'mersin') {
    q.strokeStyle = '#6a4a2e'; q.lineWidth = 2.4; q.beginPath(); q.moveTo(0, -MY9_SAP); q.quadraticCurveTo(0, -16, -6, -9); q.moveTo(0, -18); q.quadraticCurveTo(3, -13, 8, -8); q.stroke();
    yaprak(0, -19, -0.5, 14, 4.6, '#5fc86a', '#2f8a3e');
    for (const [x, y, rr] of [[-9, 2, 10.5], [10, 1, 10.5], [0, 12, 11], [0, -6, 9.5]]) {
      q.fillStyle = rad(x - rr * 0.35, y - rr * 0.4, 1, x, y, rr * 1.1, '#aab8ff', '#5f74e8', '#3a4cb8'); q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill();
      q.strokeStyle = 'rgba(40,40,120,0.35)'; q.lineWidth = 1; q.stroke();
      q.fillStyle = 'rgba(210,220,255,0.35)'; q.beginPath(); q.arc(x - rr * 0.1, y - rr * 0.1, rr * 0.8, 0, 6.2832); q.fill();   // buğulu yüzey
      q.save(); q.translate(x + rr * 0.15, y - rr * 0.5); q.fillStyle = '#2c2f86'; q.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5, d = i % 2 ? 1.2 : 3.1; i ? q.lineTo(Math.cos(a) * d, Math.sin(a) * d * 0.6) : q.moveTo(Math.cos(a) * d, Math.sin(a) * d * 0.6); } q.closePath(); q.fill(); q.restore();   // minik taç
      q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.ellipse(x - rr * 0.42, y - rr * 0.1, rr * 0.2, rr * 0.32, 0.4, 0, 6.2832); q.fill();
    }
  } else if (ad === 'armut') {
    const yol = () => { q.beginPath(); q.moveTo(0, -15); q.bezierCurveTo(6, -15, 8, -7, 11, -1); q.bezierCurveTo(21, 7, 18, 23, 0, 23); q.bezierCurveTo(-18, 23, -21, 7, -11, -1); q.bezierCurveTo(-8, -7, -6, -15, 0, -15); q.closePath(); };
    yol(); q.fillStyle = rad(-6, 2, 2, 0, 6, 25, '#fff6b0', '#ffd84a', '#e0a92a'); q.fill();
    q.save(); yol(); q.clip(); q.fillStyle = 'rgba(255,130,140,0.32)'; q.beginPath(); q.ellipse(9, 12, 9, 7, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(190,120,20,0.18)'; q.beginPath(); q.ellipse(4, 20, 16, 6, 0, 0, 6.2832); q.fill(); q.restore();
    for (const [x, y] of [[-8, 6], [5, 2], [-3, 15], [9, 16], [-11, 13]]) { q.fillStyle = 'rgba(160,110,30,0.35)'; q.beginPath(); q.arc(x, y, 0.8, 0, 6.2832); q.fill(); }
    sap(2, -15); yaprak(1.5, -17, -0.35, 15, 5, '#5fc86a', '#2f8a3e'); parla(-7, 4, 3, 5.5, 0.35);
  } else if (ad === 'uzum') {
    q.strokeStyle = '#6a4a2e'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(0, -MY9_SAP); q.lineTo(0, -12); q.stroke();
    q.strokeStyle = '#7fbf4a'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(0, -16); q.bezierCurveTo(-6, -20, -13, -16, -11, -11); q.bezierCurveTo(-9, -7, -5, -10, -7, -12); q.stroke();   // kıvrık filiz
    yaprak(0.5, -17, -0.25, 16, 6, '#62d06a', '#2f8a3e');
    for (const [x, y] of [[-12, -7], [0, -8], [12, -7], [-6, 3], [6, 3], [-12, 4], [12, 4], [0, 13], [-6, 13], [6, 13], [0, 22]]) {
      if ((x === -12 || x === 12) && y === 4) continue;
      q.fillStyle = rad(x - 2.4, y - 2.6, 0.6, x, y, 7.6, '#e2ffc0', '#8fd860', '#5aa83a'); q.beginPath(); q.arc(x, y, 6.8, 0, 6.2832); q.fill();
      q.strokeStyle = 'rgba(40,100,30,0.35)'; q.lineWidth = 0.9; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.85)'; q.beginPath(); q.ellipse(x - 2.4, y - 2.6, 1.4, 2.2, 0.5, 0, 6.2832); q.fill();
    }
  } else {   // şeftali
    const yol = () => { q.beginPath(); q.moveTo(0, -13); q.bezierCurveTo(9, -19, 21, -10, 20, 3); q.bezierCurveTo(19, 16, 9, 22, 0, 22); q.bezierCurveTo(-9, 22, -19, 16, -20, 3); q.bezierCurveTo(-21, -10, -9, -19, 0, -13); q.closePath(); };
    yol(); q.fillStyle = rad(-7, -4, 2, 0, 3, 25, '#ffe2b8', '#ffa266', '#f0784a'); q.fill();
    q.save(); yol(); q.clip(); q.fillStyle = 'rgba(255,90,120,0.35)'; q.beginPath(); q.ellipse(9, 6, 11, 13, 0, 0, 6.2832); q.fill(); q.restore();
    q.strokeStyle = 'rgba(200,80,60,0.45)'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(0, -12); q.bezierCurveTo(-5, -2, -5, 10, 0, 20); q.stroke();   // çizgi (çukurluk)
    sap(0, -13); yaprak(0.5, -15, -0.15, 17, 6, '#5fc86a', '#2f8a3e'); yaprak(-0.5, -15, Math.PI + 0.55, 10, 3.6, '#4fb85a', '#2f8a3e'); parla(-9, -3, 3.4, 5, 0.45);
  }
  const cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, '#4a2c4e', 2.2 * PX);
  cv.ox = OX; cv.oy = OY; cv.bw = W; cv.bh = H;
  return cv;
}
// ── meyve ağacı: tombul yeşim taç (yuvarlak öbekler), pembe çiçekler, kıvrık gövde, yosunlu kökler; taban ortası (0, 0) ──
const MY9_TAC = [[-150, -250, 66], [-58, -298, 82], [40, -258, 66], [-200, -206, 48], [92, -206, 48], [-112, -350, 58], [8, -350, 56], [-46, -222, 68], [-112, -192, 46], [24, -190, 44]];
function my9AgacCiz(r) {
  const PX = 2, X0 = 270, Y0 = 430, W = 440, H = 446, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, X0 * PX, Y0 * PX); q.lineCap = 'round'; q.lineJoin = 'round';
  // kökler ve gövde (kıvrık, tombul)
  const gov = q.createLinearGradient(-30, 0, 30, 0); gov.addColorStop(0, '#9a6a4a'); gov.addColorStop(0.5, '#b8845a'); gov.addColorStop(1, '#7a5038');
  q.fillStyle = gov;
  q.beginPath(); q.moveTo(-52, 2); q.quadraticCurveTo(-26, -6, -20, -40); q.bezierCurveTo(-16, -90, -34, -140, -20, -200); q.lineTo(14, -196);
  q.bezierCurveTo(4, -140, 22, -90, 20, -40); q.quadraticCurveTo(26, -6, 50, 2); q.closePath(); q.fill();
  // dallar
  q.strokeStyle = '#a0704c'; q.lineWidth = 14; q.beginPath(); q.moveTo(-14, -150); q.quadraticCurveTo(-60, -180, -120, -212); q.stroke();
  q.lineWidth = 12; q.beginPath(); q.moveTo(8, -165); q.quadraticCurveTo(40, -190, 70, -214); q.stroke();
  q.lineWidth = 10; q.beginPath(); q.moveTo(-6, -190); q.quadraticCurveTo(-20, -250, -60, -290); q.stroke();
  // gövde dokusu ve parlama
  q.strokeStyle = 'rgba(90,55,35,0.45)'; q.lineWidth = 1.6;
  for (const [x0, y0, x1, y1] of [[-8, -20, -12, -80], [6, -30, 4, -110], [-14, -100, -18, -170], [10, -120, 2, -185]]) { q.beginPath(); q.moveTo(x0, y0); q.quadraticCurveTo((x0 + x1) / 2 + 4, (y0 + y1) / 2, x1, y1); q.stroke(); }
  q.strokeStyle = 'rgba(255,220,180,0.35)'; q.lineWidth = 3; q.beginPath(); q.moveTo(-14, -30); q.bezierCurveTo(-12, -80, -26, -130, -14, -190); q.stroke();
  // yosun (kök diplerinde)
  for (let i = 0; i < 9; i++) { const x = -50 + i * 12 + (r() - 0.5) * 6; q.fillStyle = i % 2 ? '#5fc88a' : '#7fdc9a'; q.beginPath(); q.ellipse(x, -2, 9 + r() * 5, 5 + r() * 3, 0, Math.PI, 0); q.fill(); }
  // taç: önce koyu alt katman, sonra öbekler
  const ob = MY9_TAC;
  for (const [x, y, rr] of ob) { q.fillStyle = '#2a7a5e'; q.beginPath(); q.arc(x + 4, y + 8, rr, 0, 6.2832); q.fill(); }
  for (const [x, y, rr] of ob) {
    const gr = q.createRadialGradient(x - rr * 0.35, y - rr * 0.45, rr * 0.1, x, y, rr * 1.05);
    gr.addColorStop(0, '#9aeac0'); gr.addColorStop(0.45, '#4fc890'); gr.addColorStop(1, '#2e8f6f');
    q.fillStyle = gr; q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill();
  }
  // yaprak dokusu: minik yapraklar (açık/koyu), öbeklerin içinde
  q.save(); q.beginPath(); for (const [x, y, rr] of ob) { q.moveTo(x + rr, y); q.arc(x, y, rr, 0, 6.2832); } q.clip();
  for (let i = 0; i < 260; i++) {
    const o = ob[(r() * ob.length) | 0], a = r() * 6.2832, d = Math.sqrt(r()) * o[2], x = o[0] + Math.cos(a) * d, y = o[1] + Math.sin(a) * d, ust = y < o[1];
    q.fillStyle = ust ? (i % 3 ? 'rgba(200,255,220,0.35)' : 'rgba(200,240,138,0.45)') : 'rgba(30,100,75,0.35)';
    q.save(); q.translate(x, y); q.rotate(r() * 6.28); q.beginPath(); q.ellipse(0, 0, 5 + r() * 3, 2.4 + r(), 0, 0, 6.2832); q.fill(); q.restore();
  }
  // öbeklerin üst kenarında yumuşak ışık hilali
  q.strokeStyle = 'rgba(230,255,200,0.55)'; q.lineWidth = 4;
  for (const [x, y, rr] of ob) { q.beginPath(); q.arc(x, y, rr - 5, Math.PI * 1.1, Math.PI * 1.55); q.stroke(); }
  q.restore();
  // pembe ve altın minik çiçekler
  for (let i = 0; i < 46; i++) {
    const o = ob[(r() * ob.length) | 0], a = r() * 6.2832, d = (0.3 + 0.65 * r()) * o[2], x = o[0] + Math.cos(a) * d, y = o[1] + Math.sin(a) * d * 0.9;
    const col = i % 4 === 0 ? '#ffd27a' : i % 4 === 1 ? '#ffffff' : '#ff9fc0', rr = 2.6 + r() * 1.8;
    q.fillStyle = col; for (let k = 0; k < 5; k++) { const b = k * 1.2566 + i; q.beginPath(); q.arc(x + Math.cos(b) * rr, y + Math.sin(b) * rr, rr * 0.75, 0, 6.2832); q.fill(); }
    q.fillStyle = i % 4 === 0 ? '#ff9a5c' : '#ffe27a'; q.beginPath(); q.arc(x, y, rr * 0.55, 0, 6.2832); q.fill();
  }
  const cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, '#1f5a48', 2.4 * PX);
  cv.x0 = X0; cv.y0 = Y0; cv.bw = W; cv.bh = H;
  return cv;
}
// ── yaprak yuva: arka (iç oyuk + arka kenar) ve ön (önde örülü kenar, yapraklar, çiçekler); köken: yuva ortası x, zemin y ──
// ölçü: dış elips en 290, kenar üstü y ≈ -54; iç oyuk merkezi y -44, rx 118, ry 15
function my9YuvaArkaCiz(r) {
  const PX = 2, X0 = 160, Y0 = 80, W = 320, H = 96, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, X0 * PX, Y0 * PX); q.lineCap = 'round';
  // arka kenar (örgü)
  q.fillStyle = '#8a6a40'; q.beginPath(); q.ellipse(0, -42, 142, 22, 0, Math.PI, 0); q.lineTo(142, -40); q.ellipse(0, -40, 120, 12, 0, 0, Math.PI, true); q.closePath(); q.fill();
  for (let i = 0; i < 70; i++) { const a = Math.PI + r() * Math.PI, rx = 122 + r() * 18, ry = 12 + r() * 9; const x = Math.cos(a) * rx, y = -42 + Math.sin(a) * ry, L = 10 + r() * 14;
    q.strokeStyle = i % 3 ? 'rgba(200,160,100,0.75)' : 'rgba(110,80,45,0.7)'; q.lineWidth = 1.6 + r(); q.beginPath(); q.moveTo(x, y); q.lineTo(x + L * (r() - 0.5) * 1.6, y + (r() - 0.5) * 4); q.stroke(); }
  // iç oyuk: yumuşak yaprak döşek
  const gr = q.createRadialGradient(0, -46, 10, 0, -44, 120); gr.addColorStop(0, '#6fae5e'); gr.addColorStop(0.7, '#4c8a4a'); gr.addColorStop(1, '#3a6a3e');
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, -42, 120, 15, 0, 0, 6.2832); q.fill();
  for (let i = 0; i < 26; i++) { const x = (r() - 0.5) * 200, y = -44 + (r() - 0.5) * 12; q.fillStyle = i % 2 ? 'rgba(160,230,140,0.55)' : 'rgba(255,200,220,0.5)'; q.save(); q.translate(x, y); q.rotate(r() * 6.28); q.beginPath(); q.ellipse(0, 0, 7, 2.6, 0, 0, 6.2832); q.fill(); q.restore(); }
  const cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, '#4a3424', 1.8 * PX);
  cv.x0 = X0; cv.y0 = Y0; cv.bw = W; cv.bh = H;
  return cv;
}
function my9YuvaOnCiz(r) {
  const PX = 2, X0 = 175, Y0 = 70, W = 350, H = 96, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, X0 * PX, Y0 * PX); q.lineCap = 'round'; q.lineJoin = 'round';
  // ön kenar: oyuğun ön kıyısından dış alt kıyıya kalın örgü bant
  const yol = () => { q.beginPath(); q.ellipse(0, -42, 120, 15, 0, Math.PI, 0, true); q.lineTo(146, -36); q.bezierCurveTo(150, -10, 110, 2, 0, 2); q.bezierCurveTo(-110, 2, -150, -10, -146, -36); q.closePath(); };
  const gr = q.createLinearGradient(0, -50, 0, 2); gr.addColorStop(0, '#c89a5e'); gr.addColorStop(0.5, '#a87a48'); gr.addColorStop(1, '#7a5634');
  yol(); q.fillStyle = gr; q.fill();
  q.save(); yol(); q.clip();
  for (let i = 0; i < 150; i++) {   // örgü dalları: yatay yaylar
    const y = -46 + r() * 46, x = (r() - 0.5) * 300, L = 14 + r() * 26, b = (r() - 0.5) * 5;
    q.strokeStyle = i % 3 === 0 ? 'rgba(110,76,42,0.75)' : i % 3 === 1 ? 'rgba(235,200,140,0.7)' : 'rgba(180,140,90,0.8)'; q.lineWidth = 1.5 + r() * 1.4;
    q.beginPath(); q.moveTo(x - L / 2, y); q.quadraticCurveTo(x, y + b - 2.5, x + L / 2, y + b); q.stroke();
  }
  q.fillStyle = 'rgba(60,40,20,0.22)'; q.fillRect(-160, -12, 320, 16);
  q.fillStyle = 'rgba(255,240,200,0.18)'; q.beginPath(); q.ellipse(0, -40, 122, 8, 0, 0, Math.PI); q.fill();
  q.restore();
  // yuvanın kenarına sıkıştırılmış kocaman yumuşak yapraklar ve eğrelti
  const yap = (x, y, a, L, w, c) => { q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = c; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(L * 0.45, -w, L, 0); q.quadraticCurveTo(L * 0.45, w, 0, 0); q.fill();
    q.strokeStyle = 'rgba(30,90,60,0.6)'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(2, 0); q.lineTo(L * 0.85, 0); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.22)'; q.beginPath(); q.ellipse(L * 0.4, -w * 0.3, L * 0.25, w * 0.2, 0, 0, 6.2832); q.fill(); q.restore(); };
  yap(-138, -30, Math.PI + 0.35, 36, 12, '#4fc890'); yap(-128, -10, Math.PI - 0.2, 30, 10, '#6fd8a8'); yap(138, -30, -0.35, 36, 12, '#4fc890'); yap(130, -10, 0.2, 30, 10, '#6fd8a8');
  yap(-70, -2, Math.PI * 0.62, 22, 8, '#3fbf8a'); yap(66, -2, Math.PI * 0.38, 22, 8, '#3fbf8a'); yap(-10, 0, Math.PI * 0.52, 18, 7, '#6fd8a8');
  // çiçekler (pul çiçeği tonlarında)
  for (const [x, y, c] of [[-112, -40, '#ff9fc0'], [-40, -16, '#d9c8ff'], [24, -26, '#ffd27a'], [96, -38, '#ff9fc0'], [118, -16, '#d9c8ff'], [-86, -8, '#ffd27a']]) {
    for (let k = 0; k < 5; k++) { const b = k * 1.2566 + x; q.fillStyle = c; q.beginPath(); q.ellipse(x + Math.cos(b) * 4.2, y + Math.sin(b) * 4.2, 3.6, 3, b, 0, 6.2832); q.fill(); }
    q.fillStyle = '#fff6c0'; q.beginPath(); q.arc(x, y, 2.2, 0, 6.2832); q.fill();
  }
  const cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, '#4a3424', 2 * PX);
  cv.x0 = X0; cv.y0 = Y0; cv.bw = W; cv.bh = H;
  return cv;
}
// ── zemin süsü: yumuşak çimen tutamları, yonca, minik çiçekler (ağacın ve yuvanın dibini zemine bağlar); taban ortası (W/2, 30) ──
function my9CimCiz(r, W, n) {
  const PX = 2, H = 36, cv = my9Cv(W * PX, H * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, W / 2 * PX, 30 * PX); q.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const u = (i + r() * 0.8) / n, x = (u - 0.5) * W * 0.96, kenar = 1 - Math.pow(Math.abs(u - 0.5) * 2, 3), h = (7 + r() * 13) * (0.45 + 0.55 * kenar);
    for (let k = 0; k < 4; k++) { const a = (k - 1.5) * 0.32 + (r() - 0.5) * 0.3, L = h * (0.7 + r() * 0.4);
      q.strokeStyle = k % 2 ? '#3fbf8a' : (r() < 0.5 ? '#6fd8a8' : '#2e8f6f'); q.lineWidth = 2.2;
      q.beginPath(); q.moveTo(x, 2); q.quadraticCurveTo(x + Math.sin(a) * L * 0.4, 2 - L * 0.6, x + Math.sin(a) * L, 2 - Math.cos(a) * L); q.stroke(); }
    if (r() < 0.22) { const cx = x + (r() - 0.5) * 6, cy = -h * 0.6, col = ['#ff9fc0', '#d9c8ff', '#ffd27a', '#ffffff'][(r() * 4) | 0];
      for (let k = 0; k < 5; k++) { const b = k * 1.2566; q.fillStyle = col; q.beginPath(); q.arc(cx + Math.cos(b) * 2.6, cy + Math.sin(b) * 2.6, 2, 0, 6.2832); q.fill(); }
      q.fillStyle = '#ffe27a'; q.beginPath(); q.arc(cx, cy, 1.4, 0, 6.2832); q.fill(); }
    else if (r() < 0.15) { for (let k = 0; k < 3; k++) { const b = k * 2.094 - 1.57; q.fillStyle = '#5fc88a'; q.beginPath(); q.arc(x + Math.cos(b) * 2.6, -2 + Math.sin(b) * 2.6, 2.6, 0, 6.2832); q.fill(); } }   // yonca
  }
  cv.bw = W; cv.bh = H; cv.oy = 30; return cv;
}
// ── düşünce baloncuğu: tombul bulut, beyazımsı, lila kontur; merkez (0, 0), yarıçap MY9_BR (gx: yatay genişleme) ──
function my9BalonCiz(gx) {
  const PX = MY9_PX, R = MY9_BR, W = (R * gx + 14) * 2, H = (R + 14) * 2, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, W / 2 * PX, H / 2 * PX);
  const sekil = () => { q.beginPath(); q.ellipse(0, 0, R * gx * 0.86, R * 0.82, 0, 0, 6.2832);
    const n = gx > 1.2 ? 11 : 8;
    for (let i = 0; i < n; i++) { const a = i / n * 6.2832 + 0.2, x = Math.cos(a) * R * gx * 0.78, y = Math.sin(a) * R * 0.74, rr = R * (0.34 + 0.06 * Math.sin(i * 2.7)); q.moveTo(x + rr, y); q.arc(x, y, rr, 0, 6.2832); } };
  const gr = q.createRadialGradient(-R * 0.3, -R * 0.35, 2, 0, 0, R * gx * 1.1); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.7, '#fbf7ff'); gr.addColorStop(1, '#eee4ff');
  sekil(); q.fillStyle = gr; q.fill('nonzero');
  q.fillStyle = 'rgba(200,180,255,0.25)'; q.beginPath(); q.ellipse(R * 0.1, R * 0.55, R * gx * 0.75, R * 0.28, 0, 0, 6.2832); q.fill();
  q.strokeStyle = 'rgba(255,255,255,0.95)'; q.lineWidth = 3.4; q.lineCap = 'round'; q.beginPath(); q.arc(-R * 0.3 * gx, -R * 0.42, R * 0.32, Math.PI * 1.05, Math.PI * 1.55); q.stroke();
  const cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, '#a58ee8', 1.7 * PX);
  cv.bw = W; cv.bh = H;
  return cv;
}
function my9NoktaCiz() {   // baloncuğun yavruya inen minik yuvarlakları: ref yarıçap 8
  const PX = MY9_PX, cv0 = my9Cv(20 * PX, 20 * PX), q = cv0.getContext('2d'); q.setTransform(PX, 0, 0, PX, 10 * PX, 10 * PX);
  const gr = q.createRadialGradient(-2, -2, 1, 0, 0, 8); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#efe6ff');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 8, 0, 6.2832); q.fill();
  const cv = my9Cv(20 * PX, 20 * PX); my9Kontur(cv, cv0, '#a58ee8', 1.5 * PX); return cv;
}

// ── sade yedek yavru (YAVRU'nun yavruCiz'i yoksa): Pırıl çizgisinde tombul minik ejderha; taban ortası (x, y), sağa bakar ──
const MY9_YRK = {   // [gövde, koyu (ibik/kontur tonu), açık (burun), karın]
  nane: ['#7fe0b0', '#3fa880', '#c8f5de', '#eaffc8'], seftali: ['#ffc29a', '#e0885a', '#ffe2cc', '#fff0c8'], gok: ['#7fe0f0', '#3fa8c8', '#c8f5fa', '#f0ffd0'],
  limon: ['#ffe680', '#d8b440', '#fff4c0', '#fffbe0'], gul: ['#ff9fc0', '#d8648a', '#ffd0e0', '#fff0d8'], lila: ['#b89cff', '#7f62d0', '#ddd0ff', '#d8f5a0'],
  fistik: ['#c8f08a', '#86b84a', '#e8fac8', '#fff6c0']
};
const MY9_YVS = {};
function my9YvSprite(renk) {
  let cv = MY9_YVS[renk]; if (cv) return cv;
  const K = MY9_YRK[renk] || MY9_YRK.lila, PX = MY9_PX, W = 84, H = 74, OX = 44, OY = 70, kay = my9Cv(W * PX, H * PX), q = kay.getContext('2d');
  q.setTransform(PX, 0, 0, PX, OX * PX, OY * PX); q.lineCap = 'round'; q.lineJoin = 'round';
  // kuyruk (arkada, yukarı kıvrık, ucu yaprak gibi)
  q.strokeStyle = K[0]; q.lineWidth = 8; q.beginPath(); q.moveTo(-12, -9); q.bezierCurveTo(-24, -6, -32, -14, -30, -24); q.stroke();
  q.fillStyle = K[1]; q.beginPath(); q.moveTo(-30, -24); q.quadraticCurveTo(-38, -30, -31, -36); q.quadraticCurveTo(-24, -31, -30, -24); q.fill();
  // ayaklar
  q.fillStyle = K[0]; q.beginPath(); q.ellipse(-8, -3, 6.5, 4.2, 0, 0, 6.2832); q.fill(); q.beginPath(); q.ellipse(8, -3, 6.5, 4.2, 0, 0, 6.2832); q.fill();
  // ibik (başın üstünde üç yumuşak dilim) ve yüzgeç kulak
  q.fillStyle = K[1]; for (const [x, y, rr] of [[-7, -52, 5], [0, -56, 5.6], [8, -55, 4.6]]) { q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill(); }
  q.fillStyle = K[2]; q.beginPath(); q.moveTo(-6, -44); q.quadraticCurveTo(-20, -52, -19, -38); q.quadraticCurveTo(-12, -38, -6, -40); q.fill();
  // gövde, karın (çizgili)
  const gr = q.createRadialGradient(-6, -24, 2, -1, -17, 19); gr.addColorStop(0, K[2]); gr.addColorStop(0.5, K[0]); gr.addColorStop(1, K[1]);
  q.fillStyle = gr; q.beginPath(); q.ellipse(-1, -17, 17, 15.5, 0, 0, 6.2832); q.fill();
  q.fillStyle = K[3]; q.beginPath(); q.ellipse(4, -15, 10.5, 11, 0, 0, 6.2832); q.fill();
  q.strokeStyle = 'rgba(120,150,60,0.45)'; q.lineWidth = 1.4; for (const y of [-20, -15, -10]) { q.beginPath(); q.moveTo(-3, y); q.quadraticCurveTo(4, y + 2, 11, y); q.stroke(); }
  // baş ve burun
  const gb = q.createRadialGradient(-1, -44, 2, 4, -38, 19); gb.addColorStop(0, K[2]); gb.addColorStop(0.55, K[0]); gb.addColorStop(1, K[1]);
  q.fillStyle = gb; q.beginPath(); q.arc(4, -38, 16.5, 0, 6.2832); q.fill();
  q.fillStyle = K[2]; q.beginPath(); q.ellipse(15, -32, 8.5, 7, 0, 0, 6.2832); q.fill();
  q.fillStyle = 'rgba(60,40,70,0.5)'; q.beginPath(); q.arc(20, -35, 1, 0, 6.2832); q.fill();
  cv = my9Cv(W * PX, H * PX); my9Kontur(cv, kay, mixc(K[1], '#241838', 0.55), 2.1 * PX);
  cv.ox = OX; cv.oy = OY; cv.bw = W; cv.bh = H; MY9_YVS[renk] = cv; return cv;
}
function my9YavruYedek(c, x, y, s, t, o) {
  const K = MY9_YRK[o.renk] || MY9_YRK.lila, sp = my9YvSprite(o.renk), yon = o.yon < 0 ? -1 : 1, M = c.getTransform();
  c.translate(x, y); c.scale(s * yon * 0.66, s * 0.66);   // yedek çizim ≈ 55 birim; yavruCiz boyuna (36) indir
  const kn = clamp(o.kanat || 0, 0, 1), fl = kn > 0.01 ? Math.sin(t * 22) : 0;
  // kanat (arkada): minik yaprak biçimli, çırptıkça açılır
  c.save(); c.translate(-9, -26); c.rotate(-0.5 - kn * (0.5 + 0.55 * fl)); c.fillStyle = K[1]; c.globalAlpha *= 0.95;
  c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-8, -16, -20, -14); c.quadraticCurveTo(-16, -8, -18, -3); c.quadraticCurveTo(-10, -2, 0, 0); c.fill(); c.restore();
  c.drawImage(sp, -sp.ox, -sp.oy, sp.bw, sp.bh);
  // gözler: iri, parlak; mutluyken ^ ^, istemezken > <
  const kirp = ((t * 0.9 + (o.faz || 0)) % 3.3) < 0.12, mut = (o.mutlu || 0) > 0.5, ih = (o.ih || 0) > 0.3;
  c.strokeStyle = '#24304a'; c.fillStyle = '#24304a'; c.lineWidth = 2; c.lineCap = 'round';
  for (const [ex, ey] of [[2, -40], [12.5, -39.5]]) {
    if (ih) { c.beginPath(); c.moveTo(ex - 3, ey - 3); c.lineTo(ex + 1.5, ey); c.lineTo(ex - 3, ey + 2.5); c.stroke(); }
    else if (mut || kirp || o.uyku) { c.beginPath(); c.arc(ex, ey + (mut ? 1.5 : 0), 3.4, mut ? Math.PI * 1.1 : Math.PI * 0.1, mut ? Math.PI * 1.9 : Math.PI * 0.9); c.stroke(); }
    else { c.beginPath(); c.ellipse(ex + (o.bakX || 0) * 0.8, ey, 3.7, 4.6, 0, 0, 6.2832); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex - 1 + (o.bakX || 0) * 0.8, ey - 1.8, 1.5, 0, 6.2832); c.fill(); c.beginPath(); c.arc(ex + 1.4, ey + 1.6, 0.7, 0, 6.2832); c.fill(); c.fillStyle = '#24304a'; }
  }
  c.fillStyle = 'rgba(255,120,160,0.45)'; c.beginPath(); c.ellipse(9, -31.5, 3.8, 2.4, 0, 0, 6.2832); c.fill();
  // ağız: açıkken "o" + minik iki diş + pembe dil
  const ag = clamp(o.agiz || 0, 0, 1);
  if (ag > 0.08) {
    c.fillStyle = '#7a2c4a'; c.beginPath(); c.ellipse(17, -28.5, 2.8 + 1.6 * ag, 1.2 + 4.2 * ag, 0, 0, 6.2832); c.fill();
    c.fillStyle = '#ff8fb0'; c.beginPath(); c.ellipse(17, -27 + 2 * ag, 2 + ag, 1 + 1.2 * ag, 0, 0, 6.2832); c.fill();
    c.fillStyle = '#ffffff'; c.fillRect(15, -29.5 - 3.6 * ag, 1.6, 1.8); c.fillRect(17.6, -29.5 - 3.6 * ag, 1.6, 1.8);
  } else { c.strokeStyle = '#7a2c4a'; c.lineWidth = 1.4; c.beginPath(); c.arc(16.5, -31, 3, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); }
  c.setTransform(M);
}
// yavruCiz seçenekleri (tek nesne, her çizimde yeniden yazılır)
const MY9_YO = { renk: 'gok', yon: -1, mutlu: 0, kanat: 0, kanatAc: 0.6, ucus: 0, ziplama: 0, kabuk: 0, agiz: 0, dans: 0, uyku: 0, bak: 0, bakX: 0, bakY: 0, sq: 0, ih: 0, hapsir: 0, bas: 0, faz: 0, isik: 0 };
function my9YavruCiz(c, x, y, s, t, b) {
  const q = MY9_YO; q.renk = b.renk; q.yon = b.yon; q.mutlu = b.mutlu; q.kanat = b.kanat; q.kanatAc = 0.5 + 0.5 * Math.min(1, b.kanat * 1.4); q.ucus = b.ucus > 3 ? 1 : 0;
  q.ziplama = 0; q.agiz = b.agiz; q.dans = b.dans; q.uyku = 0; q.bak = q.bakX = b.bakX; q.bakY = b.bakY; q.sq = 0; q.ih = b.ih; q.hapsir = b.ih * 0.72; q.bas = b.bas; q.faz = b.i * 1.3; q.isik = b.karin;
  if (typeof yavruCiz === 'function') { try { yavruCiz(c, x, y, s, t, q); return; } catch (e) { if (!my9YavruCiz.hata) { my9YavruCiz.hata = true; console.warn('[meyve] yavruCiz', e); } } }
  my9YavruYedek(c, x, y, s, t, q);
}

// ── parçacıklar (sabit havuz) ──
const MY9_TZ = []; for (let i = 0; i < 260; i++) MY9_TZ.push({ a: false, tip: 0, x: 0, y: 0, x0: 0, y0: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#fff', r: 0 });
function my9Toz(tip, x, y, vx, vy, max, s, col) {
  for (let i = 0; i < MY9_TZ.length; i++) { const p = MY9_TZ[i]; if (!p.a) { p.a = true; p.tip = tip; p.x = p.x0 = x; p.y = p.y0 = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.r = Math.random() * 6.28; return p; } }
  return null;
}
function my9IsikSac(x, y, n, hiz, cols) { cols = cols || MY9_ISIK; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); my9Toz(i % 4 === 0 ? 2 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.7 + Math.random() * 0.7, i % 4 === 0 ? 7 + Math.random() * 5 : 6 + Math.random() * 7, cols[i % cols.length]); } }
function my9Halka(x, y, r, col) { my9Toz(3, x, y, 0, 0, 0.5, r, col); }
function my9Kalp(x, y, n) { for (let i = 0; i < n; i++) my9Toz(4, x + (Math.random() - 0.5) * 26, y - Math.random() * 10, (Math.random() - 0.5) * 30, -40, 1.1 + Math.random() * 0.5, Math.random() * 6, Math.random() < 0.5 ? '#ff8fb0' : '#ffb3cf'); }
function my9Kirinti(x, y, ti, n) { const K = MY9_KIR[ti]; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.6, v = 50 + Math.random() * 90; my9Toz(5, x, y, Math.cos(a) * v, Math.sin(a) * v, 0.55 + Math.random() * 0.35, 1.6 + Math.random() * 1.8, K[i % 3]); } }
function my9TozAdim(dt) {
  for (let i = 0; i < MY9_TZ.length; i++) {
    const p = MY9_TZ[i]; if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 0 || p.tip === 2) { p.vx *= Math.exp(-dt * 2.4); p.vy = p.vy * Math.exp(-dt * 2.4) - 16 * dt; p.r += dt * 2; }
    else if (p.tip === 1) { p.vy = Math.min(90, p.vy + 60 * dt); p.vx = p.vx * Math.exp(-dt * 1.2) + Math.sin(p.t * 3 + p.r) * 10 * dt; p.r += dt * 3; }   // süzülerek inen ışık tozu
    else if (p.tip === 4) { p.vy = -40; p.vx = Math.sin(p.t * 4 + p.r) * 18; }
    else if (p.tip === 5) { p.vy += 420 * dt; p.vx *= Math.exp(-dt * 1.5); }   // kırıntı
    else if (p.tip === 6) { p.vy = 26 + Math.sin(p.t * 2 + p.r) * 8; p.vx = -14 + Math.sin(p.t * 1.6 + p.r * 2) * 22; p.r += dt * 1.8; }   // taç yaprağı
    else if (p.tip === 7) { const u = p.t / p.max, e = smooth(u); p.x = lerp(p.x0, p.vx, e) + Math.sin(p.t * 7 + p.r) * 3; p.y = lerp(p.y0, p.vy, e) - Math.sin(u * Math.PI) * 46; continue; }   // ipucu izi: meyveden baloncuğa
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
function my9TozCiz(c) {
  const a0 = c.globalAlpha, op0 = c.globalCompositeOperation;
  for (let i = 0; i < MY9_TZ.length; i++) {
    const p = MY9_TZ[i]; if (!p.a) continue; const u = p.t / p.max, f = 1 - u; c.globalAlpha = a0;
    if (p.tip === 7) { const w = Math.sin(u * Math.PI); c.globalCompositeOperation = 'lighter'; my9Glow(c, p.col, p.x, p.y, p.s * 1.6, p.s * 1.6, 0.8 * w); my9Glow(c, '#ffffff', p.x, p.y, p.s * 0.6, p.s * 0.6, 0.7 * w); c.globalCompositeOperation = op0;
      c.globalAlpha = 0.9 * w; const r = p.s * 0.55; c.drawImage(MY9S.pirilti, p.x - r, p.y - r, r * 2, r * 2); c.globalAlpha = 1; continue; }   // P9C: açık gökte de seçilsin diye beyaz yıldızcık
    if (p.tip === 0 || p.tip === 1) { const tw = p.tip === 1 ? 0.7 + 0.3 * Math.sin(p.r * 4) : 1, gs = p.s * (0.6 + f * 0.6); c.globalCompositeOperation = 'lighter'; my9Glow(c, p.col, p.x, p.y, gs, gs, f * 0.9 * tw * Math.min(1, u * 8)); c.globalCompositeOperation = op0; c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.3, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { const sc = p.s * (0.5 + 0.5 * Math.sin(Math.min(1, u * 1.6) * Math.PI)); c.globalCompositeOperation = 'lighter'; my9Glow(c, p.col, p.x, p.y, sc * 1.2, sc * 1.2, f * 0.6); c.globalCompositeOperation = op0; const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(p.r * 0.5); c.globalAlpha = a0 * Math.min(1, f * 1.5); c.drawImage(MY9S.pirilti, -sc, -sc, sc * 2, sc * 2); c.setTransform(M); }
    else if (p.tip === 3) { c.globalAlpha = a0 * f * 0.85; c.strokeStyle = p.col; c.lineWidth = 3 * f + 0.5; c.beginPath(); c.arc(p.x, p.y, p.s * (1 + u * 0.6), 0, 6.2832); c.stroke(); }
    else if (p.tip === 4) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); c.fillStyle = p.col; my9KalpYol(c, p.x, p.y, 5 + u * 2); c.fill(); }
    else if (p.tip === 5) { c.globalAlpha = a0 * Math.min(1, f * 2.5); c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.2832); c.fill(); }
    else if (p.tip === 6) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 5) * 0.9; const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(Math.sin(p.r) * 0.9); c.scale(1, 0.55 + 0.45 * Math.cos(p.r * 1.3)); c.drawImage(MY9S.yaprak, -p.s, -p.s * 0.55, p.s * 2, p.s * 1.1); c.setTransform(M); }
  }
  c.globalAlpha = a0; c.globalCompositeOperation = op0;
}
function my9KalpYol(q, x, y, s) { q.beginPath(); q.moveTo(x, y + s * 0.82); q.bezierCurveTo(x - s * 1.3, y - s * 0.05, x - s * 0.72, y - s * 1.12, x, y - s * 0.45); q.bezierCurveTo(x + s * 0.72, y - s * 1.12, x + s * 1.3, y - s * 0.05, x, y + s * 0.82); q.closePath(); }

// ── yerleşim yardımcıları ──
function my9AgacX(o) { return o.x + MY9_AX; }
function my9YvX(o, i) { return o.x + MY9_YX + (i - 1) * MY9_YD; }
function my9YvY(o) { return o.y + MY9_YY; }
function my9Pivot(o, i, t) { const s = MY9_SPOT[i]; return [my9AgacX(o) + s[0] + Math.sin(t * 0.7 + i * 1.7) * 1.4, o.y + s[1] + Math.sin(t * 0.9 + i) * 1.2]; }
function my9Agiz(o, b) {   // yavrunun ağzı (dünya): meyvenin uçtuğu nokta
  const s = MY9_YS, x = my9YvX(o, b.i) + b.ox, y = my9YvY(o) - b.ucus - b.hop;
  return [x + b.yon * MY9_AGX * s, y + MY9_AGY * s];
}
function my9BalonYer(o, i) { const b = o.my.yv[i], bb = MY9_BAL[i]; return [my9YvX(o, i) + bb[0] + b.ox * 0.5, my9YvY(o) + bb[1] - b.ucus * 0.6 + Math.sin(o.my.t * 1.4 + i * 1.9) * 2.5]; }
function my9Faz(o, f) { const k = o.my; k.faz = f; k.fT = 0; }

// istekler: 3 tur; her turda üç yavru başka meyve ister (kimse art arda aynısını istemez); son turda ortadaki iki meyve ister
function my9IstekKur(k) {
  const tur = [];
  for (let n = 0; n < 3; n++) {
    let p;
    for (let deneme = 0; deneme < 40; deneme++) {
      p = [0, 1, 2, 3, 4]; for (let i = 4; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0, x = p[i]; p[i] = p[j]; p[j] = x; }
      if (!n || (p[0] !== tur[n - 1][0][0] && p[1] !== tur[n - 1][1][0] && p[2] !== tur[n - 1][2][0])) break;
    }
    tur.push(n < 2 ? [[p[0]], [p[1]], [p[2]]] : [[p[0]], [p[1], p[3]], [p[2]]]);
  }
  k.istekler = tur;
}
function my9TurBasla(o) {
  const k = o.my, ist = k.istekler[k.tur];
  for (let i = 0; i < 3; i++) {
    const b = k.yv[i]; b.istek = ist[i].slice(); b.yenen = b.istek.map(() => false); b.ayr = b.istek.map(() => false); b.ik = b.istek.map(() => 1); b.ikT = b.istek.map(() => -1); b.rez = 0; b.gelen = 0; b.tok = false;
    b.balS = 0; b.balT = -0.28 * i - 0.15; b.balPat = -1; b.genis = b.istek.length > 1 ? 1 : 0;
    b.durum = 'bekle'; b.dT = 0; b.ih = 0;
  }
  k.idle = 0; k.helpOn = false; k.helpT = 0; k.ipucuOldu = false;
  my9Faz(o, 'oyna');
  OLAY.emit('meyveTur', { o, n: k.tur + 1 });
}

// ── etkinlik: başla / bırak ──
function my9Aktiflestir(o) {
  const k = o.my; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi') || P.y < o.y - 240) return false;
  const e = k.entry; e.x = o.x + MY9_GIR; e.y = o.y; e.safeX = e.x; e.safeY = o.y;
  k.gx0 = P.x; k.gy0 = P.y; k.gT = Math.hypot(P.x - e.x, P.y - e.y) < 3 ? 1 : 0;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; MEYVE.o = o; my9GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; k.pr.f = D.face || 1; }
  if (!k.istekler) my9IstekKur(k);
  my9Faz(o, 'gel');
  for (const b of k.yv) { b.sq -= 0.12; }
  my9IsikSac(my9YvX(o, 1), my9YvY(o) - 40, 10, 70, MY9_ISIK);
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('meyve', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('meyveBasla', { o }); }
  return true;
}
function my9Birak(o, tamam) {   // güvenli dönüş: Feza giriş yerinde, sağa dönük bırakılır
  const k = o.my, e = k.entry; if (!k.aktif) return;
  if (!tamam && (k.faz === 'kalk' || k.faz === 'don')) tamam = true;   // havalanmaya başladıysa bitmiş say
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; my9GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('meyve', 0.1, k.kameraFn, 1, 0.42);
  if (tamam && !o.done) {
    o.done = true; k.faz = 'bitti'; o.tk.bitti = true;
    for (const b of k.yv) { b.durum = 'tok'; b.tok = true; b.ucus = 0; b.karin = Math.max(b.karin, 1); }
    for (const m of k.meyve) { if (m.durum !== 'agac') { m.durum = 'agac'; m.s = 1; } }
    if (typeof V9 !== 'undefined' && V9) V9.meyve = true;
    OLAY.emit('meyveBitti', { o });
  } else if (!tamam) {   // yarıda kaldı (durum değişti): meyveler ağaca, tur yerinde kalır; dönünce kaldığı yerden sürer
    for (const m of k.meyve) { m.durum = 'agac'; m.s = 1; m.hedef = -1; }
    for (const b of k.yv) {
      b.rez = 0; for (let j = 0; j < b.yenen.length; j++) if (b.yenen[j]) b.rez++;
      b.gelen = 0; b.durum = b.tok ? 'tok' : 'bekle'; b.dT = 0; b.ih = 0;
    }
    k.faz = 'bekle'; k.kuyruk = -1;
  }
}
function my9GirdiBirak() { MEYVE.parmak.clear(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); }
MEYVE.parmak = new Set();
function my9Kullanici(o) { const k = o.my; k.idle = 0; k.helpArd = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }

// ── meyve verme ──
function my9Hedef(o, ti) {   // ti türündeki meyveyi isteyen (henüz ayrılmamış isteği olan) aç yavru; yoksa -1
  const k = o.my; let en = -1, ed = 1e9;
  for (let i = 0; i < 3; i++) {
    const b = k.yv[i]; if (b.tok || b.balS < 0.5) continue;
    let ister = false; for (let j = 0; j < b.istek.length; j++) if (!b.yenen[j] && b.istek[j] === ti && !b.ayr[j]) ister = true;
    if (!ister) continue;
    const d = b.gelen * 10 + i * 0.1; if (d < ed) { ed = d; en = i; }
  }
  return en;
}
function my9YanlisHedef(o, ti) {   // istemeyen ama aç ve boşta bir yavru (meyvenin ağaçtaki yerine en yakın)
  const k = o.my, mx = my9AgacX(o) + MY9_SPOT[ti][0]; let en = -1, ed = 1e9;
  for (let i = 0; i < 3; i++) { const b = k.yv[i]; if (b.tok || b.gelen > 0 || b.durum !== 'bekle' || b.balS < 0.5) continue; const d = Math.abs(my9YvX(o, i) - mx); if (d < ed) { ed = d; en = i; } }
  return en;
}
function my9ElMesgul(o) { const k = o.my; for (const m of k.meyve) if (m.durum === 'kop' || m.durum === 'el') return true; return false; }
function my9Ver(o, ti, yardim) {   // ti numaralı daldaki meyve verildi (Feza dokundu ya da Pırıl dürttü)
  const k = o.my, m = k.meyve[ti]; if (!k.aktif || k.faz !== 'oyna' || !m || m.durum !== 'agac' || my9ElMesgul(o)) return false;
  let j = my9Hedef(o, ti), dogru = j >= 0;
  if (!dogru) j = my9YanlisHedef(o, ti);
  if (j < 0) { m.jig = 1; my9IsikSac(m.x, m.y, 6, 50, [MY9_TON[ti], '#ffffff']); my9Sfx('parilti', 0.3); return false; }   // şimdi kimse boşta değil: meyve kıpırdar
  const b = k.yv[j];
  if (dogru) { for (let q = 0; q < b.istek.length; q++) if (!b.yenen[q] && !b.ayr[q] && b.istek[q] === ti) { b.ayr[q] = true; m.ist = q; break; } }
  b.gelen++;
  m.durum = 'kop'; m.t = 0; m.hedef = j; m.dogru = dogru; m.yardim = !!yardim; m.x0 = m.x; m.y0 = m.y; m.izT = 0;
  k.fz.uzT = 0; k.fz.uzOn = true; k.fz.hedefY = -0.2;
  my9IsikSac(m.x, m.y, 8, 70, [MY9_TON[ti], '#ffffff', '#fff2c0']); my9Halka(m.x, m.y, 26, '#ffffff');
  k.helpOn = false; k.helpT = 0; k.idle = 0; if (yardim) { k.helpN++; k.helpArd++; } else k.helpArd = 0;
  my9Sfx('meyveUc', ti);
  return true;
}
function my9MeyveAdim(o, dt) {
  const k = o.my, t = k.t;
  for (let i = 0; i < 5; i++) {
    const m = k.meyve[i]; m.t += dt; m.jig = Math.max(0, m.jig - dt * 1.8); m.isaret = Math.max(0, m.isaret - dt);
    const [px, py] = my9Pivot(o, i, t), L = MY9_SAP * MY9_MS;
    if (m.durum === 'agac' || m.durum === 'buy') {
      const a = Math.sin(t * 1.3 + i * 2.1) * 0.07 + m.jig * Math.sin(m.t * 26) * 0.25;
      m.rot = a; m.x = px - Math.sin(a) * L; m.y = py + Math.cos(a) * L;
      if (m.durum === 'buy') { const u = clamp(m.t / MY9_BUY, 0, 1); m.s = u < 0.36 ? 0 : my9Yay((u - 0.36) / 0.64); if (u >= 1) { m.durum = 'agac'; m.s = 1; }   // önce çiçek açar, sonra meyve büyür
        if (m.t - dt < MY9_BUY * 0.4 && m.t >= MY9_BUY * 0.4) { my9IsikSac(m.x, m.y, 7, 55, [MY9_TON[i], '#ffffff']); for (let q = 0; q < 2; q++) my9Toz(6, m.x + (q - 0.5) * 10, m.y, 0, 20, 2.6, 3.5, '#fff'); } }
      else m.s = 1;
      continue;
    }
    if (m.durum === 'kop') {   // daldan kopar: hafif gerilip "pıt"
      const u = clamp(m.t / 0.12, 0, 1); m.s = 1 + Math.sin(u * Math.PI) * 0.15; m.rot = Math.sin(m.t * 40) * 0.12;
      if (u >= 1) { m.durum = 'el'; m.t = 0; m.x0 = m.x; m.y0 = m.y; }
    } else if (m.durum === 'el') {   // Feza'nın eline süzülür, savrulunca bırakır
      const el = k.el, u = clamp(m.t / 0.3, 0, 1), e = smooth(u);
      m.x = lerp(m.x0, el.x, e); m.y = lerp(m.y0, el.y, e) - Math.sin(u * Math.PI) * 26; m.s = lerp(1, 0.82, e); m.rot = lerp(m.rot, 0, e);
      if (k.fz.uzT >= MY9_EL * 0.42 || !k.fz.uzOn) { m.durum = 'uc'; m.t = 0; m.x0 = m.x; m.y0 = m.y; m.sure = m.yardim ? MY9_UC_P : MY9_UC; }
    } else if (m.durum === 'uc') {   // ışıltılı yay: yavrunun ağzına
      const b = k.yv[m.hedef], [ax, ay] = my9Agiz(o, b), tx = m.dogru ? ax : my9YvX(o, b.i) - 46, ty = m.dogru ? ay : my9YvY(o) - b.ucus - 36;
      const u = clamp(m.t / m.sure, 0, 1), d = Math.hypot(tx - m.x0, ty - m.y0), h = 70 + d * 0.28;
      m.x = lerp(m.x0, tx, u); m.y = lerp(m.y0, ty, u) - Math.sin(u * Math.PI) * h; m.s = lerp(0.82, m.dogru ? 0.62 : 0.8, u) * (1 + Math.sin(u * Math.PI) * 0.15); m.rot += dt * 7 * (1 - u);
      m.izT += dt; while (m.izT > 0.028) { m.izT -= 0.028; my9Toz(Math.random() < 0.3 ? 2 : 0, m.x + (Math.random() - 0.5) * 14, m.y + (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 30, 10 + Math.random() * 20, 0.6 + Math.random() * 0.4, 5 + Math.random() * 4, Math.random() < 0.6 ? MY9_TON[i] : MY9_ALTIN[(Math.random() * 4) | 0]); }
      if (u >= 1) { if (m.dogru) { m.durum = 'sira'; m.t = 0; } else my9Reddet(o, m, b); }
    } else if (m.durum === 'sira') {   // yavru hâlâ çiğniyorsa ağzının önünde bekler
      const b = k.yv[m.hedef], [ax, ay] = my9Agiz(o, b);
      m.x = ax + b.yon * 18 + Math.sin(m.t * 5) * 2; m.y = ay - 8 + Math.sin(m.t * 3.4) * 3; m.rot = Math.sin(m.t * 2.6) * 0.15;
      if (b.durum === 'bekle') my9Ye(o, m, b);
    } else if (m.durum === 'ye') {   // ağızda: üç ısırık, kırıntılar
      const b = k.yv[m.hedef], [ax, ay] = my9Agiz(o, b), n0 = Math.floor((m.t - dt) / 0.27), n1 = Math.floor(m.t / 0.27);
      m.x = ax + b.yon * 4; m.y = ay + 3; m.rot = 0;
      if (n1 > n0 && n1 >= 1 && n1 <= 3) { m.s = 0.62 * (1 - n1 / 3.2); my9Kirinti(ax + b.yon * 4, ay + 2, i, 7); b.sq += 0.1; }
      if (m.t >= MY9_YE * 0.92) { m.durum = 'bos'; m.t = 0; m.s = 0; }
    } else if (m.durum === 'red') {   // istemedi: yavrunun önünde bir an bekler (minik kıpırtı)
      const b = k.yv[m.hedef], bx = my9YvX(o, b.i) - 46, by = my9YvY(o) - b.ucus - 36;   // yavrunun önünde (başını çevirse de yerinde)
      m.x = bx + Math.sin(m.t * 6) * 3; m.y = by + Math.sin(m.t * 4) * 3; m.rot = Math.sin(m.t * 9) * 0.2;
      if (m.t >= MY9_RED) { m.durum = 'geri'; m.t = 0; m.x0 = m.x; m.y0 = m.y; b.gelen = Math.max(0, b.gelen - 1); }
    } else if (m.durum === 'geri') {   // ağaçtaki yerine yavaşça süzülür
      const u = clamp(m.t / MY9_GERI, 0, 1), e = smooth(u), tx = px, ty = py + L;
      m.x = lerp(m.x0, tx, e) + Math.sin(u * Math.PI) * 30; m.y = lerp(m.y0, ty, e) - Math.sin(u * Math.PI) * 60; m.s = lerp(0.8, 1, e); m.rot = Math.sin(u * Math.PI * 2) * 0.3;
      if (Math.random() < dt * 14) my9Toz(0, m.x, m.y + 8, 0, 14, 0.7, 5, MY9_TON[i]);
      if (u >= 1) { m.durum = 'agac'; m.t = 0; my9IsikSac(m.x, m.y, 5, 40, [MY9_TON[i], '#ffffff']); }
    } else if (m.durum === 'bos') {   // yerinde yenisi açar
      m.s = 0; if (m.t > 0.45) { m.durum = 'buy'; m.t = 0; my9IsikSac(px, py + L, 9, 60, [MY9_TON[i], '#ffffff', '#c8f08a']); my9Halka(px, py + L, 22, MY9_TON[i]); my9Sfx('parilti', 0.25); }
    }
  }
}
function my9Ye(o, m, b) {
  const k = o.my; m.durum = 'ye'; m.t = 0; m.s = 0.62;
  b.durum = 'ye'; b.dT = 0; b.gelen = Math.max(0, b.gelen - 1);
  if (m.ist >= 0 && m.ist < b.yenen.length) { b.yenen[m.ist] = true; b.ikT[m.ist] = 0; }
  b.rez++; if (b.rez >= b.istek.length) b.tok = true;
  k.dogruSay++; k.fz.sevT = 1.1;
  const [ax, ay] = my9Agiz(o, b); my9Kirinti(ax, ay, m.i, 8); my9Halka(ax, ay, 20, '#ffffff');
  my9Sfx('meyveHam', b.i);
  OLAY.emit('meyveVer', { o, n: k.dogruSay, dogru: true, yavru: b.i, meyve: MY9_TUR[m.i], yardim: m.yardim });
}
function my9Reddet(o, m, b) {
  const k = o.my; m.durum = 'red'; m.t = 0;
  b.durum = 'ih'; b.dT = 0; b.wig = 1;
  for (let q = 0; q < b.istek.length; q++) if (!b.yenen[q]) k.meyve[b.istek[q]].isaret = 2.2;   // istediği meyve parıldar
  my9Sfx('meyveIh', b.i);
  OLAY.emit('meyveVer', { o, n: k.dogruSay, dogru: false, yavru: b.i, meyve: MY9_TUR[m.i], yardim: m.yardim });
}

// ── yavrular ──
function my9YavruAdim(o, b, dt) {
  const k = o.my, t = k.t; b.dT += dt; b.wig = Math.max(0, b.wig - dt * 1.6); b.tik = Math.max(0, b.tik - dt * 1.5);
  b.sqv += (-240 * b.sq - 10 * b.sqv) * dt; b.sq = clamp(b.sq + b.sqv * dt, -0.25, 0.25);
  // baloncuk
  if (k.aktif && (k.faz === 'oyna' || k.faz === 'turSon') && !(b.tok && b.balPat >= 0 && b.balPat > 0.4)) {
    b.balT += dt; b.balS = b.balT <= 0 ? 0 : my9Yay(clamp(b.balT / 0.55, 0, 1));
    if (b.balT > 0 && b.balT - dt <= 0) { const [x, y] = my9BalonYer(o, b.i); my9IsikSac(x, y, 7, 50, ['#ffffff', '#d9c8ff', '#fff2c0']); if (b.i === 1) my9Sfx('yavruCik2', 0.35); }
  }
  for (let j = 0; j < b.ikT.length; j++) if (b.ikT[j] >= 0) {
    const t0 = b.ikT[j]; b.ikT[j] += dt; b.ik[j] = Math.max(0, 1 - b.ikT[j] / 0.3) * (1 + Math.sin(Math.min(1, b.ikT[j] / 0.3) * Math.PI) * 0.4);
    if (t0 < 0.25 && b.ikT[j] >= 0.25) { const [x, y] = my9BalonYer(o, b.i); my9Kalp(x, y - 6, 3); my9IsikSac(x, y, 8, 70, [MY9_TON[b.istek[j]], '#ffffff']); }
  }
  if (b.tok && b.balPat < 0 && b.durum !== 'ye') b.balPat = 0;
  if (b.balPat >= 0) {   // bütün istekleri yendi: baloncuk kalplerle söner
    const p0 = b.balPat; b.balPat += dt;
    if (p0 < 0.3 && b.balPat >= 0.3) { const [x, y] = my9BalonYer(o, b.i); my9Halka(x, y, MY9_BR, '#ffffff'); my9IsikSac(x, y, 12, 110, ['#ffffff', '#ff9fc0', '#fff2c0', '#d9c8ff']); my9Kalp(x, y, 4); }
    b.balS = b.balPat < 0.3 ? 1 + b.balPat * 0.5 : 0;
  }
  b.genisS += ((b.genis && b.ik.length > 1 && b.ik[0] > 0.05 && b.ik[1] > 0.05 ? 1 : 0) - b.genisS) * Math.min(1, dt * 7);
  // duruş
  let agiz = 0, hop = 0, kanat = 0, mutlu = 0, dans = 0, yon = -1, ih = 0, ox = 0, ucus = 0, bakX = 0, bakY = 0, bas = 0;
  if (b.durum === 'bekle') {   // aç: ağzı yarı açık, ara sıra "cik cik" (ağız iki kez kocaman açılır, minik iki hop)
    b.cikT -= dt;
    if (b.cikT <= 0) { b.cikT = 2.4 + Math.random() * 2.2; b.cik = 0;
      if (k.aktif && k.faz === 'oyna' && t - k.sonCik > 1.4 && k.idle > 1.5) { k.sonCik = t; my9Sfx('yavruCik2', 0.28); } }
    if (b.cik >= 0) { b.cik += dt; const c = b.cik; if (c > 0.6) b.cik = -1; else { agiz = Math.max(agiz, Math.abs(Math.sin(c / 0.6 * Math.PI * 2))); hop = Math.abs(Math.sin(c / 0.6 * Math.PI * 2)) * 4; kanat = 0.5; } }
    agiz = Math.max(agiz, 0.3 + 0.12 * Math.sin(t * 3 + b.i)); bakY = -0.4; bakX = -0.6;
    if (b.tik > 0) { mutlu = 1; hop += Math.abs(Math.sin(b.tik * 12)) * 7 * b.tik; agiz = 0.7; }
  } else if (b.durum === 'ye') {   // ham ham: çiğner
    const c = b.dT; agiz = Math.abs(Math.sin(c * Math.PI * 3.4)) * 0.85; mutlu = 0.7; hop = Math.abs(Math.sin(c * Math.PI * 3.4)) * 2;
    if (c >= MY9_YE) { b.durum = 'dans'; b.dT = 0; b.karinH = Math.min(1, b.karinH + (b.istek.length > 1 ? 0.5 : 1)); my9Kalp(my9YvX(o, b.i), my9YvY(o) - 54, 3); }
  } else if (b.durum === 'dans') {   // kıpır kıpır dans: iki yana sekme, kanatlar pır pır, karnı parlar
    const c = b.dT, w = Math.min(1, c * 5) * Math.min(1, (MY9_DANS - c) * 5);
    hop = Math.abs(Math.sin(c * 9.5)) * 8 * w; ox = Math.sin(c * 4.75) * 4 * w; kanat = w; mutlu = 1; dans = w; agiz = 0.25 * w;
    if (Math.random() < dt * 8) my9Toz(2, my9YvX(o, b.i) + (Math.random() - 0.5) * 40, my9YvY(o) - 20 - Math.random() * 40, 0, -30, 0.8, 6, MY9_ALTIN[(Math.random() * 4) | 0]);
    if (c >= MY9_DANS) { b.durum = b.tok ? 'tok' : 'bekle'; b.dT = 0; b.cikT = 1 + Math.random(); }
  } else if (b.durum === 'ih') {   // "ıh-ıh": başını çevirir, minik iki sallanış; baloncuğu istediğini gösterir
    const c = b.dT; ih = my9Zarf(c, 0, 0.95); yon = c > 0.12 && c < 0.85 ? 1 : -1; ox = Math.sin(c * 22) * 2.2 * ih; bas = Math.sin(c * 17) * 0.14 * ih; agiz = 0; hop = Math.abs(Math.sin(c * 7)) * 2 * ih;
    if (c >= 0.95) { b.durum = 'bekle'; b.dT = 0; }
  } else if (b.durum === 'tok') {   // tok ve mutlu: hafif sallanır, ara sıra kanat pırpır
    mutlu = 1; agiz = 0; bakX = -0.3; kanat = ((t + b.i * 1.3) % 3.2) < 0.4 ? 0.6 : 0; hop = ((t + b.i * 1.3) % 3.2) < 0.4 ? Math.abs(Math.sin(((t + b.i * 1.3) % 3.2) * 16)) * 3 : 0;
    if (b.tik > 0) { hop += Math.abs(Math.sin(b.tik * 12)) * 7 * b.tik; kanat = Math.max(kanat, b.tik); }
  } else if (b.durum === 'uyur') {   // etkinlik başlamadan: aç ama sabırlı; arada bir başını kaldırıp cikler (ses yok)
    b.cikT -= dt; if (b.cikT <= 0) { b.cikT = 2 + Math.random() * 3; b.cik = 0; }
    if (b.cik >= 0) { b.cik += dt; if (b.cik > 0.6) b.cik = -1; else { agiz = Math.abs(Math.sin(b.cik / 0.6 * Math.PI * 2)); hop = agiz * 3; } }
    bakX = -0.8; bakY = -0.2;
  }
  // tur sonu ve havalanış (bütün yavrular)
  if (k.aktif && k.faz === 'turSon') { const c = k.fT, w = my9Zarf(c, 0.05, MY9_TURSON - 0.1); hop = Math.max(hop, Math.abs(Math.sin(c * 8 + b.i * 0.9)) * 10 * w); kanat = Math.max(kanat, w); mutlu = 1; dans = Math.max(dans, w); agiz = Math.max(agiz, 0.3 * w); }
  if (k.aktif && (k.faz === 'kalk' || k.faz === 'don')) {
    const c = k.faz === 'don' ? MY9_KALK : k.fT, ph = c * 1.7 + b.i * 2.094;
    const yuk = c < 0.6 ? 0 : c < 1.9 ? smooth((c - 0.6) / 1.3) : c < 4.9 ? 1 : c < 6.0 ? 1 - smooth((c - 4.9) / 1.1) : 0;
    ucus = yuk * (118 + (b.i === 1 ? 26 : 0) + Math.sin(ph) * 10); ox = yuk * Math.sin(ph * 0.8) * 26;
    kanat = c < 0.6 ? 0.2 : c < 6.0 ? 1 : 0.3; mutlu = 1; dans = 0.4 * yuk; agiz = c > 2 && c < 4.6 ? 0.35 + 0.25 * Math.sin(c * 5 + b.i) : 0;
    if (c < 0.6) { b.sq = Math.max(b.sq, 0.12 * Math.sin(c / 0.6 * Math.PI)); }   // kalkmadan önce çömelir
    if (c > 6.0) hop = Math.abs(Math.sin((c - 6.0) * 9)) * 4 * Math.max(0, 1 - (c - 6.0) / 0.4);
  }
  if (o.done) {   // bitti: tok, mutlu; Feza yakındaysa ona bakar, geçip giderken kanat sallar
    const fx = P.rx !== undefined ? P.rx : P.x, dx = fx - my9YvX(o, b.i);
    yon = dx > 0 ? 1 : -1; mutlu = 1; agiz = 0;
    const yakin = Math.abs(dx) < 260; kanat = yakin && ((t * 0.8 + b.i * 0.7) % 2.4) < 0.5 ? 0.8 : 0; hop = kanat ? Math.abs(Math.sin(t * 14)) * 3 : 0;
    if (b.tik > 0) { hop += Math.abs(Math.sin(b.tik * 12)) * 7 * b.tik; kanat = Math.max(kanat, b.tik); }
  }
  b.karin += (b.karinH - b.karin) * Math.min(1, dt * 2.5);
  const yk = 1 - Math.exp(-dt * 14);
  b.agiz += (agiz - b.agiz) * yk; b.hop += (hop - b.hop) * yk; b.kanat += (kanat - b.kanat) * yk; b.mutlu += (mutlu - b.mutlu) * yk; b.dans += (dans - b.dans) * yk;
  b.ih += (ih - b.ih) * yk; b.ox += (ox - b.ox) * yk; b.ucus += (ucus - b.ucus) * Math.min(1, dt * 20); b.bakX += (bakX - b.bakX) * yk; b.bakY += (bakY - b.bakY) * yk; b.bas = bas;
  b.yon = yon;
}

// ── her kare ──
function my9Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza ağacın altında durur
  const k = o.my; if (!k.aktif || P.ucus !== o) return;
  const e = k.entry;
  if (k.gT < 1 && dt > 0) {   // girişe süzülme (≈0,4 sn, minik hop)
    k.gT = Math.min(1, k.gT + dt / 0.42); const u = k.gT, h = Math.abs(k.gx0 - e.x) > 16 ? 26 : 0;
    P.x = lerp(k.gx0, e.x, smooth(u)); P.y = lerp(k.gy0, e.y, u * u) - Math.sin(u * Math.PI) * h;
    if (!Number.isFinite(P.x) || !Number.isFinite(P.y)) { P.x = e.x; P.y = e.y; k.gT = 1; }
  } else { P.x = e.x; P.y = e.y; }
  P.vx = P.vy = P.buf = 0; P.ground = true; P.f = 1;
}
function my9Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.my, fx = P.rx !== undefined ? P.rx : P.x, yakin = Math.abs(fx - o.x) < 1700;
  if (!yakin && !k.aktif) return;   // uzaktayken hiçbir şey yapmaz
  k.t += dt; my9TozAdim(dt);
  for (const b of k.yv) my9YavruAdim(o, b, dt);
  my9MeyveAdim(o, dt);
  k.fz.sevT = Math.max(0, k.fz.sevT - dt); if (k.fz.uzOn) { k.fz.uzT += dt; if (k.fz.uzT >= MY9_EL) k.fz.uzOn = false; }
  // ağaçtan süzülen taç yaprakları
  if (Math.random() < dt * 0.9) { const ob = MY9_TAC[(Math.random() * MY9_TAC.length) | 0]; my9Toz(6, my9AgacX(o) + ob[0] + (Math.random() - 0.5) * ob[2], o.y + ob[1] + ob[2] * 0.6, 0, 20, 5 + Math.random() * 2, 4 + Math.random() * 2.5, '#fff'); }
  if (o.done) { if (Math.random() < dt * 1.2) my9Toz(0, my9YvX(o, 1) + (Math.random() - 0.5) * 200, my9YvY(o) - 20 - Math.random() * 60, 0, -16, 1.6, 6, MY9_ALTIN[(Math.random() * 4) | 0]); return; }
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !P.ucus && P.x > o.x + MY9_AKTIF && P.x < o.x + 420 && P.y > o.y - 240 && P.y < o.y + 60) my9Aktiflestir(o);
  if (!k.aktif) {   // bekliyor: ağacın çevresinde davetkâr ışık zerreleri; meyveler parlar
    if (Math.random() < dt * 1.8) { const s = MY9_SPOT[(Math.random() * 5) | 0]; my9Toz(0, my9AgacX(o) + s[0] + (Math.random() - 0.5) * 50, o.y + s[1] + (Math.random() - 0.5) * 40, 0, -14, 1.8, 6, MY9_ISIK[(Math.random() * 6) | 0]); }
    return;
  }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('meyve', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  if (k.faz === 'gel') {
    if (k.fT >= 0.45 && k.fT - dt < 0.45) my9Sfx('yavruCik2', 0.4);
    if (k.fT >= MY9_GEL) my9TurBasla(o);
  } else if (k.faz === 'oyna') {
    let hareket = false; for (const m of k.meyve) if (m.durum !== 'agac' && m.durum !== 'buy' && m.durum !== 'bos') hareket = true;
    let hepsi = true; for (const b of k.yv) if (!b.tok || b.durum === 'ye' || b.durum === 'dans') hepsi = false;
    if (hepsi && !hareket) { my9Faz(o, 'turSon'); my9Sfx('parilti', 0.6); my9IsikSac(my9YvX(o, 1), my9YvY(o) - 50, 18, 140, MY9_ISIK); my9Halka(my9YvX(o, 1), my9YvY(o) - 40, 90, '#fff2c0'); }
    else {
      // Pırıl bir kez yardım ettiyse ve çocuk hâlâ dokunmuyorsa yardım sürer (meyveler uçarken de sayılır): dokunmadan bütün oyun ≈ 75 sn
      const surekli = k.helpArd >= 1, hazir = surekli ? !my9ElMesgul(o) : !hareket && k.yv.every(b => b.tok || b.balS > 0.9);
      if (hazir && MEYVE.parmak.size === 0) {
        k.idle += dt; const esik = surekli ? MY9_YARDIM3 : k.helpN > 0 ? MY9_YARDIM2 : MY9_YARDIM;
        if (!k.ipucuOldu && k.idle >= MY9_GOSTER) { k.ipucuOldu = true; OLAY.emit('meyveIpucu', { o, n: k.tur + 1 }); }
        if (!k.helpOn && k.idle >= esik) { const hi = my9YardimSec(o); if (hi >= 0) { k.helpOn = true; k.helpT = 0; k.helpI = hi; OLAY.emit('meyveYardim', { o, n: k.tur + 1 }); } }
      }
      if (k.helpOn) { k.helpT += dt; if (k.meyve[k.helpI].durum !== 'agac' || k.helpT > 6) { k.helpOn = false; k.helpT = 0; } }
      if (k.kuyruk >= 0 && !my9ElMesgul(o)) { const q = k.kuyruk; k.kuyruk = -1; my9Ver(o, q, false); }   // el doluyken dokunulan meyve sırada beklerdi
      my9IzAdim(o, dt);
    }
  } else if (k.faz === 'turSon') {
    if (k.fT >= MY9_TURSON) { k.tur++; if (k.tur < 3) my9TurBasla(o); else { my9Faz(o, 'kalk'); OLAY.emit('meyveKalk', { o }); } }
  } else if (k.faz === 'kalk') my9KalkAdim(o, dt);
  else if (k.faz === 'don') { if (k.fT >= MY9_DON) my9Birak(o, true); }
  my9PirilAdim(o, dt);
}
function my9IzAdim(o, dt) {   // ipucu: istenen meyveden yavrunun baloncuğuna akan ışık tozu (dokunulmayınca ya da "ıh-ıh"tan sonra)
  const k = o.my;
  for (let i = 0; i < 3; i++) {
    const b = k.yv[i]; if (b.tok || b.balS < 0.9) continue;
    for (let j = 0; j < b.istek.length; j++) {
      const ti = b.istek[j], m = k.meyve[ti]; if (b.yenen[j] || b.ayr[j] || m.durum !== 'agac' || !(k.idle > MY9_GOSTER || m.isaret > 0)) continue;
      if (Math.random() < dt * 12) { const [bx, by] = my9BalonYer(o, i), p = my9Toz(7, m.x, m.y, bx, by, 1.25, 10 + Math.random() * 4, Math.random() < 0.6 ? MY9_TON[ti] : '#fff2c0'); if (p) p.r = Math.random() * 6.28; }   // P9C: iz daha sık ve iri (görünür olsun)
    }
  }
}
function my9YardimSec(o) {   // Pırıl'ın vereceği meyve: aç bir yavrunun istediği, ağaçta duran
  const k = o.my;
  for (let n = 0; n < 3; n++) { const i = (k.tur + n) % 3, b = k.yv[i]; if (b.tok || b.durum === 'ih' || b.balS < 0.9) continue;
    for (let j = 0; j < b.istek.length; j++) if (!b.yenen[j] && !b.ayr[j] && k.meyve[b.istek[j]].durum === 'agac') return b.istek[j]; }
  return -1;
}
function my9KalkAdim(o, dt) {   // üç yavru birlikte havalanır, yuvanın üstünde süzülüp ışık saçar, sonra yuvaya konar
  const k = o.my, t0 = k.fT - dt, t = k.fT, gec = a => t0 < a && t >= a, yx = my9YvX(o, 1), yy = my9YvY(o);
  if (gec(0.05)) for (const b of k.yv) b.sqv -= 1.2;
  if (gec(0.6)) { my9Sfx('kanatCirp', 0.7); for (const b of k.yv) { b.sqv += 2; my9IsikSac(my9YvX(o, b.i), yy, 8, 90, ['#ffffff', '#c8f08a', '#fff2c0']); } }
  if (gec(1.25)) my9Sfx('yavruCik2', 0.5);
  if (gec(2.0)) { my9Sfx('parilti', 1); for (const b of k.yv) { const x = my9YvX(o, b.i) + b.ox, y = yy - b.ucus - 24; my9Halka(x, y, 44, MY9_ISIK[b.i + 2]); my9IsikSac(x, y, 14, 140, MY9_ISIK); } }
  if (gec(3.3)) { my9Halka(yx, yy - 150, 120, '#fff2c0'); my9Halka(yx, yy - 150, 70, '#ffffff'); my9IsikSac(yx, yy - 150, 26, 200, MY9_ISIK); my9Sfx('parilti', 0.8); }
  if (gec(3.6)) my9Sfx('yavruCik2', 0.45);
  if (t > 1.9 && t < 4.9) {   // ışık tozu yağmuru: yuvanın, ağacın ve Feza'nın üstüne süzülür
    for (const b of k.yv) if (Math.random() < dt * 16) { const x = my9YvX(o, b.i) + b.ox, y = yy - b.ucus - 14; my9Toz(1, x + (Math.random() - 0.5) * 20, y, (Math.random() - 0.5) * 60 - 30, 20 + Math.random() * 30, 2.2 + Math.random() * 0.8, 6 + Math.random() * 5, MY9_ISIK[(Math.random() * MY9_ISIK.length) | 0]); }
    if (Math.random() < dt * 10) { const s = MY9_SPOT[(Math.random() * 5) | 0]; my9Toz(2, my9AgacX(o) + s[0] + (Math.random() - 0.5) * 70, o.y + s[1] + (Math.random() - 0.5) * 60, 0, -10, 0.9, 7, MY9_ALTIN[(Math.random() * 4) | 0]); }
  }
  if (gec(6.0)) for (const b of k.yv) { b.sqv += 2.4; my9IsikSac(my9YvX(o, b.i), yy, 6, 60, ['#ffffff', '#fff2c0']); }
  if (t >= MY9_KALK) my9Faz(o, 'don');
}
function my9PirilAdim(o, dt) {   // Pırıl: Feza'nın yanı · ipucu (baloncuk ↔ meyve) · yardım (gösterir, dürter) · kutlama
  const k = o.my, pr = k.pr, e = k.entry, yx = my9YvX(o, 1), yy = my9YvY(o);
  let tx = e.x + 52, ty = e.y - 120 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  pr.poz = 'ucus'; pr.sev = 0;
  const ipucu = k.idle > MY9_GOSTER || k.helpOn;
  if (k.faz === 'oyna') {
    if (k.helpOn && k.meyve[k.helpI].durum === 'agac') {   // yardım: meyvenin yanına uçar, gösterir, burnuyla dürter
      const m = k.meyve[k.helpI], d = m.x >= pr.x ? 1 : -1, hz = k.helpArd >= 1 ? 0.5 : 1, yak = k.helpT > 1.2 * hz;   // art arda yardımda daha çevik
      tx = m.x - d * (yak ? 26 : 56); ty = m.y + (yak ? 2 : -10) + Math.sin(k.t * 3) * 3; hiz = yak ? 8 : 5.5 / hz; bak = d;
      if (k.helpT > 0.6 * hz && k.helpT < 1.5 * hz) { pr.poz = 'goster9'; }
      if (yak && k.helpT > 1.8 * hz && Math.hypot(pr.x - tx, pr.y - ty) < 30) my9Ver(o, k.helpI, true);
    } else if (ipucu) {   // ipucu: aç yavrunun baloncuğundan istediği meyveye süzülür
      const hi = my9YardimSec(o);
      if (hi >= 0) {
        let j = 0; for (let i = 0; i < 3; i++) if (!k.yv[i].tok && k.yv[i].istek.indexOf(hi) >= 0) j = i;
        const faz = (k.t / 2.4) % 2 < 1, [bx, by] = my9BalonYer(o, j), m = k.meyve[hi];
        tx = faz ? bx - 50 : m.x - 40; ty = faz ? by + 6 : m.y + 8; hiz = 2.6; bak = faz ? 1 : 1;
        if (!faz && Math.hypot(pr.x - tx, pr.y - ty) < 40) { pr.poz = 'goster9'; m.isaret = Math.max(m.isaret, 0.4); }
        if (Math.random() < dt * 8) my9Toz(0, pr.x - 8, pr.y + 6, -12, 6, 0.9, 5, MY9_TON[hi]);
      }
    } else bak = 1;
    if (k.fz.sevT > 0.4) pr.sev = 1;
  } else if (k.faz === 'turSon') {   // küçük bir sevinç turu
    const c = k.fT, a = c * 3.2; tx = lerp(e.x + 52, yx - 90, my9Zarf(c, 0, MY9_TURSON)) + Math.sin(a) * 30; ty = yy - 150 + Math.cos(a) * 18; hiz = 5; pr.sev = 1;
    if (c > 0.3 && c < 1.3) pr.poz = 'sevinc9';
  } else if (k.faz === 'kalk' || k.faz === 'don') {   // yavrularla birlikte yuvanın üstünde döner
    const c = k.fT;
    if (k.faz === 'kalk' && c > 0.9 && c < 5.2) { const a = (c - 0.9) * 1.9; tx = yx + Math.sin(a) * 175; ty = yy - 238 + Math.cos(a * 2) * 22; hiz = 5; bak = Math.cos(a) > 0 ? 1 : -1; pr.sev = 1; }
    else { tx = e.x + 60; ty = e.y - 130; pr.sev = 1; }
  }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (!Number.isFinite(pr.x) || !Number.isFinite(pr.y)) { pr.x = tx; pr.y = ty; }
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function my9Gorunur(o) { return !(o.x + MY9_YX + 380 < cam.x || o.x + MY9_GIR - 300 > cam.x + VW); }
function my9Ciz(o, tm) {   // Feza'nın arkası: ağaç, yuva, yavrular
  if (!my9Gorunur(o)) return;
  my9Sprite();
  const k = o.my, ax = my9AgacX(o), y0 = o.y, op0 = g.globalCompositeOperation;
  const kutla = o.done ? 1 : k.aktif && k.faz === 'kalk' ? my9Zarf(k.fT, 1.6, 5.6) : 0;
  // gölgeler
  g.globalAlpha = 0.55; g.drawImage(MY9S.golge, ax - 150, y0 - 10, 300, 22); g.drawImage(MY9S.golge, o.x + MY9_YX - 170, y0 - 9, 340, 20); g.globalAlpha = 1;
  // ağaç (rüzgârda çok hafif salınır)
  const sp = MY9S.agac, M = g.getTransform();
  g.translate(ax, y0); g.transform(1, 0, Math.sin(tm * 0.6) * 0.012, 1, 0, 0); g.drawImage(sp, -sp.x0, -sp.y0, sp.bw, sp.bh); g.setTransform(M);
  if (kutla > 0.01 || k.aktif) {   // tacın içinden sıcak ışık (oyunda hafif, havalanışta parlak)
    g.globalCompositeOperation = 'lighter';
    my9Glow(g, '#fff2c0', ax - 50, y0 - 270, 210, 150, 0.1 + 0.22 * kutla);
    g.globalCompositeOperation = op0;
  }
  { const cm = MY9S.cimAgac; g.drawImage(cm, ax - cm.bw / 2, y0 - cm.oy, cm.bw, cm.bh); }
  // yuva (arka), yavrular, yuva (ön)
  const yx = o.x + MY9_YX, ya = MY9S.yuvaArka, yo = MY9S.yuvaOn;
  g.drawImage(ya, yx - ya.x0, y0 - ya.y0, ya.bw, ya.bh);
  if (kutla > 0.01 || o.done) { g.globalCompositeOperation = 'lighter'; my9Glow(g, '#ffd27a', yx, y0 - 46, 160, 40, 0.25 + 0.25 * kutla); g.globalCompositeOperation = op0; }
  for (let i = 0; i < 3; i++) {
    const b = k.yv[i], x = my9YvX(o, i) + b.ox, y = my9YvY(o) - b.ucus - b.hop;
    if (b.karin > 0.02) { g.globalCompositeOperation = 'lighter'; my9Glow(g, '#ffd27a', x + b.yon * MY9_KRX * MY9_YS, y + MY9_KRY * MY9_YS, 34 + 8 * b.dans, 30 + 8 * b.dans, (0.7 + 0.3 * b.dans) * b.karin * (0.85 + 0.15 * Math.sin(tm * 3 + i))); g.globalCompositeOperation = op0; }
    if (b.ucus > 4) { g.globalAlpha = Math.max(0, 0.5 - b.ucus / 300); g.drawImage(MY9S.golge, x - 30, my9YvY(o) - 6, 60, 12); g.globalAlpha = 1; }
    const sx = 1 + b.sq, sy = 1 - b.sq, M2 = g.getTransform();
    g.translate(x, y); g.scale(sx, sy);
    try { my9YavruCiz(g, 0, 0, MY9_YS, tm + i * 0.37, b); } catch (e) {}
    g.setTransform(M2);
    if (b.karin > 0.02) { g.globalCompositeOperation = 'lighter'; my9Glow(g, '#fff2c0', x + b.yon * MY9_KRX * MY9_YS, y + MY9_KRY * MY9_YS, 13, 13, 0.4 * b.karin); g.globalCompositeOperation = op0; }
  }
  g.drawImage(yo, yx - yo.x0, y0 - yo.y0, yo.bw, yo.bh);
  { const cm = MY9S.cimYuva; g.drawImage(cm, yx - cm.bw / 2, y0 - cm.oy + 3, cm.bw, cm.bh); }
}
function my9MeyveCizKare(o, m, tm, vurgu) {
  if (m.durum === 'buy') {   // yeni meyve: önce minik pembe çiçek açar
    const u = clamp(m.t / MY9_BUY, 0, 1), fs = Math.sin(clamp(u / 0.55, 0, 1) * Math.PI) * (u < 0.27 ? my9Yay(u / 0.27) : 1);
    if (fs > 0.02) { const sp = MY9S.cicek, r = 13 * fs, M = g.getTransform(); g.translate(m.x, m.y - 4); g.rotate(tm * 0.8 + m.i); g.drawImage(sp, -r, -r, r * 2, r * 2); g.setTransform(M); }
  }
  if (m.s <= 0.01) return;
  const sp = MY9S.meyve[m.i], s = MY9_MS * m.s, op0 = g.globalCompositeOperation;
  g.globalCompositeOperation = 'lighter';
  my9Glow(g, MY9_TON[m.i], m.x, m.y, (34 + vurgu * 22) * s, (34 + vurgu * 22) * s, 0.42 + 0.12 * Math.sin(tm * 2.2 + m.i * 1.3) + vurgu * 0.45);
  g.globalCompositeOperation = op0;
  if (vurgu > 0.05) { g.globalAlpha = Math.min(1, vurgu) * 0.55; g.strokeStyle = '#ffffff'; g.lineWidth = 3; g.beginPath(); g.arc(m.x, m.y, 31 * s * (1 + 0.1 * Math.sin(tm * 6)), 0, 6.2832); g.stroke(); g.globalAlpha = 1; }
  const M = g.getTransform(); g.translate(m.x, m.y); g.rotate(m.rot); const sv = s * (1 + vurgu * (0.1 + 0.06 * Math.sin(tm * 7))); g.scale(sv, sv);
  g.drawImage(sp, -sp.ox, -sp.oy, sp.bw, sp.bh); g.setTransform(M);
  if (vurgu > 0.05) { const a = tm * 2.4 + m.i; for (let j = 0; j < 3; j++) { const b = a + j * 2.094, x = m.x + Math.cos(b) * 30 * s, y = m.y + Math.sin(b) * 30 * s, sc = 5 + 2 * Math.sin(tm * 6 + j); g.globalAlpha = Math.min(1, vurgu); g.drawImage(MY9S.pirilti, x - sc, y - sc, sc * 2, sc * 2); } g.globalAlpha = 1; }
}
function my9BalonCizKare(o, b, tm, vurgu) {
  const s0 = b.balS; if (s0 <= 0.01) return;
  const [x, y] = my9BalonYer(o, b.i), gx = lerp(1, 1.42, b.genisS), op0 = g.globalCompositeOperation;
  const wig = b.wig > 0 ? Math.sin(b.wig * 20) * 0.08 * b.wig : 0, s = s0 * (1 + vurgu * 0.06);
  // yavruya inen iki minik yuvarlak
  const bx = my9YvX(o, b.i) + b.ox + b.yon * 6, by = my9YvY(o) - b.ucus - b.hop - MY9_YBOY * MY9_YS - 4;
  for (let j = 0; j < 2; j++) { const u = 0.35 + j * 0.3, nx = lerp(bx, x, 1 - u), ny = lerp(by, y + MY9_BR * 0.8, 1 - u), r = (4 + j * 2.5) * s0; g.drawImage(MY9S.nokta, nx - r * 1.25, ny - r * 1.25, r * 2.5, r * 2.5); }
  if (vurgu > 0.02) { g.globalCompositeOperation = 'lighter'; my9Glow(g, '#fff2c0', x, y, 70 * gx, 60, 0.35 * vurgu); g.globalCompositeOperation = op0; }
  const M = g.getTransform(); g.translate(x, y); g.rotate(wig + Math.sin(tm * 1.1 + b.i) * 0.03); g.scale(s, s);
  const sp = b.genisS > 0.5 ? MY9S.balon2 : MY9S.balon, sxx = b.genisS > 0.5 ? gx / 1.42 : gx;
  g.save(); g.scale(sxx, 1); g.drawImage(sp, -sp.bw / 2, -sp.bh / 2, sp.bw, sp.bh); g.restore();
  // içindeki meyve resim(ler)i
  let n = 0; for (let j = 0; j < b.istek.length; j++) if (b.ik[j] > 0.01) n++;
  let sira = 0;
  for (let j = 0; j < b.istek.length; j++) {
    if (b.ik[j] <= 0.01) continue;
    const ms = MY9S.meyve[b.istek[j]], ic = 0.78 * b.ik[j], ixh = b.istek.length > 1 ? (j === 0 ? -1 : 1) * 22 * b.genisS : 0; sira++;
    const bob = Math.sin(tm * 2.3 + j * 1.7 + b.i) * 1.5;
    g.save(); g.translate(ixh, 2 + bob); g.rotate(Math.sin(tm * 1.4 + j + b.i) * 0.08); g.scale(ic, ic); g.drawImage(ms, -ms.ox, -ms.oy + 4, ms.bw, ms.bh); g.restore();
  }
  if (!n && b.yenen.length && b.yenen.every(Boolean)) {   // doydu: boş baloncuk kalmasın; içinde atan pembe bir kalp belirir (baloncuk sönene kadar)
    let tk = 9; for (let j = 0; j < b.ikT.length; j++) if (b.ikT[j] >= 0) tk = Math.min(tk, b.ikT[j]);
    const u = clamp((tk - 0.2) / 0.35, 0, 1), hs = my9Yay(u) * (1 + 0.08 * Math.sin(tm * 7 + b.i));
    if (hs > 0.01) {
      g.save(); g.translate(0, 1); g.scale(hs, hs);
      const gr = g.createRadialGradient(-5, -6, 1, 0, 0, 20); gr.addColorStop(0, '#ffd6e4'); gr.addColorStop(0.55, '#ff8fb4'); gr.addColorStop(1, '#f0628e');
      my9KalpYol(g, 0, 0, 15); g.fillStyle = gr; g.fill(); g.lineWidth = 2; g.strokeStyle = '#d84a7a'; g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(-7, -5, 3.2, 2.2, -0.5, 0, 6.2832); g.fill();
      g.restore();
    }
  }
  g.setTransform(M);
}
function my9CizOn(o, tm) {
  if (!my9Gorunur(o)) return;
  my9Sprite();
  const k = o.my;
  if (k.aktif && P.ucus === o) {   // Feza: ağacın altında, yavrulara dönük; meyveyi savurur, yavru yiyince sevinir
    const f = k.fz;
    try {
      if (typeof fezaCizPoz === 'function') {
        let poz = 'ayakta_yan', op = MY9_FZ_OPT; op.u = undefined; op.hedefY = undefined;
        if (f.uzOn) { poz = 'meyveUzat'; op.u = clamp(f.uzT / MY9_EL, 0, 1); op.hedefY = f.hedefY; }
        else if (f.sevT > 0.15 || k.faz === 'turSon' || k.faz === 'kalk' && k.fT > 1.5 || k.faz === 'don') poz = 'sevinc';
        const el = fezaCizPoz(g, P.x, P.y, 1, poz, tm, null, op);
        if (el && Number.isFinite(el.x) && Number.isFinite(el.y) && poz === 'meyveUzat') { k.el.x = el.x; k.el.y = el.y; }
        else if (poz !== 'meyveUzat' || !el) { k.el.x = P.x + 16; k.el.y = P.y - 52; }
      }
    } catch (e) {}
  }
  // meyveler (ağaçta, elde, uçarken)
  const ipucu = k.aktif && k.faz === 'oyna' && k.idle > MY9_IPUCU;
  for (let i = 0; i < 5; i++) {
    const m = k.meyve[i];
    let vurgu = m.isaret > 0 ? Math.min(1, m.isaret) * (0.6 + 0.4 * Math.sin(tm * 8)) : 0;
    if (ipucu && m.durum === 'agac' && my9Isteniyor(o, i)) vurgu = Math.max(vurgu, Math.max(0, Math.sin(tm * 3 - i * 1.3)) * 0.7);
    if (MEYVE.klavye && k.aktif && k.secK === i && m.durum === 'agac') vurgu = Math.max(vurgu, 0.7 + 0.2 * Math.sin(tm * 5));
    if (k.helpOn && k.helpI === i) vurgu = Math.max(vurgu, 0.5 + 0.3 * Math.sin(tm * 6));
    if (!k.aktif && !o.done) vurgu = Math.max(vurgu, 0.15 + 0.15 * Math.sin(tm * 2 + i));
    my9MeyveCizKare(o, m, tm, vurgu);
  }
  // düşünce baloncukları
  if (k.aktif) for (let n = 0; n < 3; n++) { const i = n === 2 ? 1 : n === 1 ? 2 : 0, b = k.yv[i];   // ortadaki (iki meyveli) en üstte
    if (b.balS > 0.01) my9BalonCizKare(o, b, tm, b.wig > 0 ? b.wig : ipucu && !b.tok ? 0.3 + 0.3 * Math.sin(tm * 3 + i) : 0); }
  // Pırıl
  if (k.aktif && P.ucus === o && typeof pirilCizPoz === 'function') {
    const pr = k.pr, u = MY9_PR_OPT; u.yon = 1; u.bakX = 0.6; u.bakY = 0.1; u.sevinc = pr.sev; u.salla = 0;
    g.save(); try { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, pr.poz || 'ucus', tm, u); } catch (e) {} finally { g.restore(); }
  }
  my9TozCiz(g);
}
const MY9_FZ_OPT = { u: undefined, hedefY: undefined };
const MY9_PR_OPT = { yon: 1, bakX: 1, bakY: 0, sevinc: 0, salla: 0 };
function my9Isteniyor(o, ti) { const k = o.my; for (const b of k.yv) { if (b.tok) continue; for (let j = 0; j < b.istek.length; j++) if (!b.yenen[j] && !b.ayr[j] && b.istek[j] === ti) return true; } return false; }

// ── girdi: dokunuş meyveyi verir (cömert hedef); baloncuğa / yavruya dokunmak da bir şey yapar (pencere yakalama evresi: yürüme parmağına gitmez) ──
function my9Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function my9Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function my9MeyveBul(o, p) {   // dokunulan yere en yakın ağaçtaki meyve (≥ 40 CSS px pay; meyveler arası boşlukta en yakını)
  const k = o.my, pay = Math.max(60, 40 * DPR / Math.max(S, 0.001)); let en = -1, ed = 1e9;
  for (let i = 0; i < 5; i++) { const m = k.meyve[i]; if (m.durum !== 'agac' && !(m.durum === 'buy' && m.s > 0.6)) continue; const d = Math.hypot(m.x - p.x, m.y - p.y); if (d < ed) { ed = d; en = i; } }
  return ed < pay ? en : -1;
}
function my9Dokun(o, p) {
  const k = o.my;
  if (k.faz === 'oyna') { const i = my9MeyveBul(o, p); if (i >= 0) { const m = k.meyve[i];
    if (m.durum === 'buy') { m.durum = 'agac'; m.s = 1; }
    if (my9ElMesgul(o)) { k.kuyruk = i; m.jig = 0.6; my9IsikSac(m.x, m.y, 4, 40, [MY9_TON[i], '#ffffff']); return; }   // el dolu: az sonra o da uçar
    if (my9Ver(o, i, false)) return; } }
  for (let i = 0; i < 3; i++) {   // baloncuk: kıpırdar, yavru cikler, istenen meyve parıldar
    const b = k.yv[i]; if (b.balS < 0.5 || b.tok) continue; const [x, y] = my9BalonYer(o, i);
    if (Math.hypot(p.x - x, p.y - y) < MY9_BR * 1.4) { b.wig = 1; if (b.durum === 'bekle') b.cik = 0; my9Sfx('yavruCik2', 0.3);
      for (let j = 0; j < b.istek.length; j++) if (!b.yenen[j]) k.meyve[b.istek[j]].isaret = 1.8; return; }
  }
  for (let i = 0; i < 3; i++) {   // yavru: kıkırdar, zıplar
    const b = k.yv[i], x = my9YvX(o, i), y = my9YvY(o) - b.ucus - 20 * MY9_YS;
    if (Math.hypot(p.x - x, p.y - y) < 40) { if (b.tik < 0.4) { b.tik = 1; b.sqv += 1.4; my9Kalp(x, y - 30, 2); my9Sfx('yavruCik2', 0.3); } return; }
  }
  my9IsikSac(p.x, p.y, 5, 50, ['#ffffff', '#fff2c0', '#b89cff']);   // boşluğa dokunuş: minik parıltı
}
addEventListener('pointerdown', e => {
  const o = MEYVE.aktif; if (!o || DURUM !== 'oyun' || e.target !== cv || e.pointerType === 'mouse' && e.button !== 0) return;
  my9Sahip(e); MEYVE.parmak.add(e.pointerId); MEYVE.klavye = false;
  my9Kullanici(o); my9Dokun(o, my9Dunya(e));
}, true);
addEventListener('pointermove', e => { if (MEYVE.parmak.has(e.pointerId)) my9Sahip(e); }, true);
function my9BirakE(e) { if (!MEYVE.parmak.has(e.pointerId)) return; my9Sahip(e); MEYVE.parmak.delete(e.pointerId); }
addEventListener('pointerup', my9BirakE, true); addEventListener('pointercancel', my9BirakE, true);
addEventListener('blur', () => { if (MEYVE.parmak.size) my9GirdiBirak(); });
addEventListener('pagehide', () => { if (MEYVE.parmak.size) my9GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && MEYVE.parmak.size) my9GirdiBirak(); });
addEventListener('keydown', e => {
  const o = MEYVE.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  my9Sahip(e); const k = o.my; my9Kullanici(o);
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { if (MEYVE.klavye) k.secK = (k.secK + 4) % 5; MEYVE.klavye = true; }
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') { if (MEYVE.klavye) k.secK = (k.secK + 1) % 5; MEYVE.klavye = true; }
  else if (!e.repeat && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) { if (!MEYVE.klavye) { MEYVE.klavye = true; return; } if (k.faz === 'oyna') my9Ver(o, k.secK, false); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = MEYVE.aktif; if (o && d !== 'mola' && d !== 'duraklat') my9Birak(o, false); my9GirdiBirak(); });

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" (Feza solda, yakın) kadrajı ezer. Meyve etkinliğinde dikkat kadrajı geçerli olsun
// (Bölüm 8 kabakyuz.js / kazan.js'teki sarmalayıcının aynısı). CORE oyun.js'e istisna eklerse bu sarmalayıcı zararsızdır.
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.my9Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'meyveMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.my9Sarili = true; for (const ad in f) if (/Sarili$/.test(ad)) s[ad] = f[ad];
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('meyveMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js: o.tk.bitti ile de açılır (CORE meyveMini'yi eklemeden önce de çalışsın)
    o.my = { aktif: false, faz: 'bekle', fT: 0, t: 0, tur: 0, istekler: null, dogruSay: 0, idle: 0, helpOn: false, helpT: 0, helpN: 0, helpArd: 0, helpI: 0, ipucuOldu: false, sonCik: -9, secK: 2, kuyruk: -1,
      entry: { x: o.x + MY9_GIR, y: o.y, safeX: o.x + MY9_GIR, safeY: o.y }, gx0: 0, gy0: 0, gT: 1, pr: { x: o.x - 400, y: o.y - 140, f: 1, poz: 'ucus', sev: 0 },
      fz: { uzT: 0, uzOn: false, sevT: 0, hedefY: 0 }, el: { x: o.x + MY9_GIR + 16, y: o.y - 52 }, basladi: false, kameraFn: null,
      meyve: [0, 1, 2, 3, 4].map(i => ({ i, durum: 'agac', t: 0, x: 0, y: 0, x0: 0, y0: 0, s: 1, rot: 0, hedef: -1, dogru: false, yardim: false, ist: -1, sure: MY9_UC, izT: 0, jig: 0, isaret: 0 })),
      yv: [0, 1, 2].map(i => ({ i, renk: MY9_YRENK[i], durum: 'uyur', dT: 0, istek: [], yenen: [], ayr: [false, false], ik: [], ikT: [-1, -1], rez: 0, gelen: 0, tok: false,
        balS: 0, balT: 0, balPat: -1, genis: 0, genisS: 0, wig: 0, tik: 0, cik: -1, cikT: 0.8 + i * 1.1, agiz: 0, hop: 0, kanat: 0, mutlu: 0, dans: 0, ih: 0, ox: 0, ucus: 0,
        bakX: 0, bakY: 0, bas: 0, yon: -1, sq: 0, sqv: 0, karin: 0, karinH: 0 })) };
    o.my.kameraFn = typeof omDkEkle === 'function' ? () => { const e = o.my.entry; omDkEkle(Math.min(o.x + MY9_GIR - 55, e.x - 55), o.y - 425, o.x + MY9_YX + MY9_YD + 80, o.y + 22); } : null;
    o.adim = dt => my9Adim(o, dt);
    for (let i = 0; i < 5; i++) { const m = o.my.meyve[i], [px, py] = my9Pivot(o, i, 0); m.x = px; m.y = py + MY9_SAP * MY9_MS; }
    MEYVE.o = o; my9Sprite();
  },
  guncelle: my9Guncelle, ciz: my9Ciz, cizOn: my9CizOn
});
