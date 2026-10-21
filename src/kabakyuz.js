/* kabakyuz.js — Bölüm 8 (Balkabağı Gecesi) mini oyun 1: KABAĞA YÜZ YAPMAK (önek ky8), nesne türü 'kabakYuzMini'. Sahibi: KABAKYUZ.
   Açıklıkta, minik fenerli bir saman balyası sahnesinin üstünde dev, sönük bir balkabağı durur. Feza yaklaşınca kadraj yumuşakça
   yerleşir (Bölüm 7 kardan.js gibi: P.ucus = o ile fizik devralınır, Feza'yı ve Pırıl'ı bu dosya çizer) ve OLAY 'kabakYuzBasla'
   (Pırıl'ın giriş sözü CORE'da). Üç tur: GÖZ, BURUN, AĞIZ. Her turda kabağın tepesinden üç sihirli baloncuk yükselir, içlerinde
   oyulmuş, hafifçe parlayan bir parça (gözler: yuvarlak parıltılı · mutlu hilal · yıldız; burun: üçgen · düğme · kalp; ağız: kocaman
   gülüş · tek tatlı dişli sırıtış · dil çıkaran). Feza birine dokunur → baloncuk "pıt" diye patlar, parça parıltılı bir yayla uçup
   kabağın üstüne oturur ve yaylanır; öbür baloncuklar yumuşakça ışık zerrelerine dağılır. Kabak her parçada tepki verir (gözlerini
   kırpıp Feza'ya bakar, burnunu oynatır, gülümser); sahnedeki minik fenerler sırayla yanar. Ağızdan sonra kabak CANLANIR: içinde ışık
   doğar, oyukları altın gibi parlar, kahkaha atar, iki kez hoplar, sapındaki kıvrık filiz kıvrılır, ağzından bir ışık tozu fıskiyesi
   püskürtür, yaprağıyla el sallar. Sonra yerinde ışıl ışıl ve mutlu kalır: gözleriyle Feza'yı izler, yakındayken ara sıra hoplar,
   Feza giderken sahnenin kenarına doğru biraz peşinden hoplayıp yaprağıyla el sallar.
   Kaybetme/yanlış/süre/yazı/öğretici el yok; her seçenek doğru. İpucu ışıkla: baloncuklar sırayla nabız gibi parlar, Pırıl aralarında
   süzülür. ~25 sn dokunulmazsa (Pırıl bir kez yardım ettiyse ~14 sn) Pırıl bir baloncuğa uçar, burnuyla "pıt" diye patlatır ve
   parçayı kabağa taşır; çocuk dokununca yardım bırakır. Asla takılmaz. Klavye yedeği: ←/→ baloncuk seçer, Boşluk/Enter/E alır.
   Olaylar: 'kabakYuzBasla' {o} · 'kabakYuzTur' {o, n (1..3), tur} (baloncuklar yükselir) · 'kabakYuzIpucu' {o, n} (turda ~9 sn
     dokunulmadı, bir kez) · 'kabakYuzYardim' {o, n} (Pırıl kendisi seçiyor) · 'kabakYuzParca' {o, n (1..3), tur ('goz'|'burun'|'agiz'),
     ad, i (0..2), yardim} · 'kabakYuzCanlan' {o, secim} (canlanma başı) · 'kabakYuzBitti' {o, secim} (gösteri bitti, Feza serbest,
     kapı açılır). Bitince V8.kabakYuz = true, o.done = true. Seçim: V8.kabakYuzSecim = { goz, burun, agiz } (parça adları; her
     parçada güncellenir). Pırıl'ın sözleri CORE'da (ses.js) bu olaylardan.
   Sesler (MUZIK): AU.sfx('kabakYuzParca', n) parça oturunca · AU.sfx('kabakYuzCanlan') canlanma başında; ayrıca varsa
     'kabakYuzBaloncuk' (baloncuklar yükselir), 'kabakYuzKikir' (kabak kıkırdar), genel 'parilti', 'gozKirp', 'boing', 'puf'.
   Ortak çizici: kabakYuzCiz(c, x, y, s, t, o) — yüzü yapılmış dev kabak. x,y kabağın TABANI (orta), s ölçek (1 ≈ 190 birim en,
     175 birim boy, sap dahil), t saniye. o: { secim ({goz, burun, agiz}; verilmezse V8.kabakYuzSecim), parca (bit: 1 göz, 2 burun,
     4 ağız; verilmezse 7), yanik 0..1 (gövde ışığı; verilmezse 1), isik 0..1 (oyuk ışığı; verilmezse yanik), canli (false: kırpmaz,
     nefes almaz), dans 0..1 + faz (dans: hop, eğilme, kahkaha; faz verilmezse t), nabiz 0..1 (vuruşta yaylanır), hop (birim), sq
     (ezilme), egil (rad), kirp 0..1 (verilmezse kendisi kırpar), bakX/bakY -1..1, mutlu 0..1, gul 0..1 (kahkaha), gulumse 0..1,
     burun 0..1 (burun oynatma), kivrim 0..1 (filiz kıvrılır), yaprak 0..1 (yaprakla el sallama), yanak 0..1, parla 0..1 (içten
     ışık patlaması), isin 0..1 (oyuklardan ışık huzmeleri), zemin (false: yer ışığı/gölge yok), alpha }.
     Karede gradyan/filtre yok; bütün parçalar önbellekli sprite. Finalde (cadiMeydan) KABAK, sabahta SAHNE kullanabilir.
   Dışa açık: KABAKYUZ.o, KABAKYUZ.aktif (oyun sürerken nesne), KABAKYUZ.secim, KABAKYUZ.kabakYer() (dünyadaki kabağın tabanı).
   Yerleşim (bolum8.js): nesne('kabakYuzMini', 224, yuzey(224), {...}); o.x-250 … o.x+340 DÜZ zemin; Feza o.x-205'i geçince başlar
     (havadaysa ya da zıplayıp kabağın önüne düştüyse sahnenin dışına, yere küçük bir hopla süzülür).
   Hemen ilerisinde miniKapi (bagId) — kapı o.done / V8.kabakYuz ile açılır (eski kapi.js için o.tk.bitti de doğrulanır). */
'use strict';
const KY8_KX = 60;                 // dev kabağın (ve sahnenin) merkezi: o.x'e göre
const KY8_SAHNE = 36;              // saman balyası sahnenin yüksekliği: kabak bunun üstünde oturur
const KY8_AKTIF = -205;            // Feza o.x - 205'i geçince etkinlik başlar (Feza orada durup kabağa bakar)
const KY8_W = 212, KY8_H = 134;    // kabak gövdesi (s = 1): tombul, basık
const KY8_YS = 1.25;               // yüz parçalarının kabak üstündeki ölçeği (sprite boyuna göre): gözler
const KY8_YSP = [1.25, 1.15, 1.15]; // göz, burun, ağız (yüz dikeyde sıkışmasın)
const KY8_PX = 3;                  // önbellek sprite çözünürlüğü (birim başına piksel; iPad'de S ≈ 2,3)
const KY8_GEL = 1.1, KY8_UC = 0.8, KY8_UC_P = 1.3, KY8_TEPKI = [1.9, 1.7, 1.05], KY8_CANLAN = 8.3, KY8_DON = 0.6;
const KY8_IPUCU = 4, KY8_GOSTER = 9, KY8_YARDIM = 25, KY8_YARDIM2 = 14;
const KY8_BR = 50;                 // baloncuk yarıçapı (dünya birimi): 5 yaş için kocaman dokunma hedefi (iPad'de ≈ 115 pt çap)
const KY8_BYER = [[-150, -300], [0, -350], [150, -300]];   // baloncukların yeri (kabak merkezi x'ine ve zemine göre)
const KY8_TURLAR = ['goz', 'burun', 'agiz'];
const KY8_SECENEK = { goz: ['yuvarlak', 'hilal', 'yildiz'], burun: ['ucgen', 'dugme', 'kalp'], agiz: ['gulus', 'disli', 'dil'] };
const KY8_YUVA = [[0, -80], [0, -57], [0, -33]];          // göz, burun, ağız yuvası (kabak tabanına göre, s = 1)
const KY8_IKON = [0.68, 1.5, 0.74];                         // baloncuk içindeki parça ölçeği
const KY8_BTON = ['#ff8fc8', '#7dffc4', '#c39bff'];         // baloncuk renkleri: şeker pembesi, nane, lila
const KY8_ISIK = ['#ffd27a', '#ffe7a8', '#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffffff'];
const KY8_ALTIN = ['#ffd27a', '#ffe7a8', '#ffffff', '#ffb347'];
// sahnenin minik fenerleri: [x (kabak merkezine göre), direk boyu, renk]; ilk iki göz turunda, son ikisi burun turunda yanar
const KY8_FENER = [[-174, 40, '#e8ff8a'], [-150, 58, '#ff8fc8'], [150, 58, '#7dffc4'], [174, 40, '#c39bff']];
const KY8_AMPUL_N = 9;             // balyaların önündeki ampul dizisi (canlanınca dalga gibi yanar)
const KY8_BOS = {};
const KABAKYUZ = {
  o: null, ptr: -1, tus: 0,
  get aktif() { const o = this.o; return o && o.ky && o.ky.aktif && !o.done ? o : null; },
  get secim() { return typeof V8 !== 'undefined' && V8 && V8.kabakYuzSecim || null; },
  kabakYer() { const o = this.o; return o ? { x: ky8KX(o), y: ky8TabanY(o) } : null; }
};
function ky8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function ky8Cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function ky8Glow(c, col, x, y, rx, ry, a) { if (a <= 0.003) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
function ky8Kutu(q, x, y, w, h, r) { q.beginPath(); q.moveTo(x + r, y); q.arcTo(x + w, y, x + w, y + h, r); q.arcTo(x + w, y + h, x, y + h, r); q.arcTo(x, y + h, x, y, r); q.arcTo(x, y, x + w, y, r); q.closePath(); }   // yuvarlak köşeli kutu (eski Safari'de roundRect yok)
function ky8KX(o) { return o.x + KY8_KX; }
function ky8TabanY(o) { return o.y - KY8_SAHNE + 3; }
const ky8Yay = u => u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.exp(-6 * u) * Math.cos(u * 9);   // yaylı (biraz taşıp oturan) geçiş

// ── oyulmuş yüz parçaları: şekil (dolgu rengiyle), oyulmamış ayrıntı (göz parıltısı, diş, dil), parlak çekirdekler ──
function ky8Yildiz(q, x, y, R, r) { q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; i ? q.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d) : q.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } q.closePath(); }
function ky8Kalp(q, x, y, s) { q.beginPath(); q.moveTo(x, y + s * 0.82); q.bezierCurveTo(x - s * 1.3, y - s * 0.05, x - s * 0.72, y - s * 1.12, x, y - s * 0.45); q.bezierCurveTo(x + s * 0.72, y - s * 1.12, x + s * 1.3, y - s * 0.05, x, y + s * 0.82); q.closePath(); }
const KY8_PAR = {
  // GÖZLER (çift, ±40)
  yuvarlak: { w: 124, h: 46, parla: [[-40, 2, 15], [40, 2, 15]],
    sekil(q) { for (const ex of [-40, 40]) { q.beginPath(); q.ellipse(ex, 0, 15.5, 17.5, 0, 0, 6.2832); q.fill(); } },
    ust(q, yan) { q.fillStyle = yan ? '#ffffff' : '#d9c6c4'; q.strokeStyle = yan ? 'rgba(190,90,30,0.55)' : 'rgba(60,40,70,0.4)'; q.lineWidth = 0.9;
      for (const ex of [-40, 40]) { q.beginPath(); q.arc(ex - 5.2, -6.2, 4.8, 0, 6.2832); q.fill(); q.stroke(); q.beginPath(); q.arc(ex + 5.6, 6, 2.3, 0, 6.2832); q.fill(); q.stroke(); } } },
  hilal: { w: 124, h: 40, parla: [[-40, -1, 13], [40, -1, 13]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 9.5; q.lineCap = 'round'; for (const ex of [-40, 40]) { q.beginPath(); q.arc(ex, 7, 12.5, Math.PI * 1.06, Math.PI * 1.94); q.stroke(); } } },
  yildiz: { w: 128, h: 46, parla: [[-40, 1, 13], [40, 1, 13]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 4.5; q.lineJoin = 'round'; for (const ex of [-40, 40]) { ky8Yildiz(q, ex, 1.5, 17, 8.4); q.fill(); q.stroke(); } },
    ust(q, yan) { q.fillStyle = yan ? '#ffffff' : '#d9c6c4'; for (const ex of [-40, 40]) { q.beginPath(); q.arc(ex - 3.5, -2.5, 2.6, 0, 6.2832); q.fill(); } } },
  // BURUNLAR
  ucgen: { w: 36, h: 34, parla: [[0, 3, 11]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 5.5; q.lineJoin = 'round'; q.beginPath(); q.moveTo(0, -9.5); q.lineTo(11, 8.5); q.lineTo(-11, 8.5); q.closePath(); q.fill(); q.stroke(); } },
  dugme: { w: 34, h: 32, parla: [[0, 1, 10]],
    sekil(q) { q.beginPath(); q.ellipse(0, 0, 11.5, 10, 0, 0, 6.2832); q.fill(); },
    ust(q, yan) { q.fillStyle = yan ? '#ffffff' : '#d9c6c4'; q.beginPath(); q.arc(-4, -3.4, 2.6, 0, 6.2832); q.fill(); } },
  kalp: { w: 38, h: 34, parla: [[0, -1, 11]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 3; q.lineJoin = 'round'; ky8Kalp(q, 0, 1, 13.5); q.fill(); q.stroke(); } },
  // AĞIZLAR
  gulus: { w: 104, h: 44, parla: [[-21, 4, 16], [21, 4, 16], [0, 7, 17]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 6; q.lineJoin = 'round'; q.beginPath(); q.moveTo(-44, -9); q.quadraticCurveTo(0, 1, 44, -9); q.bezierCurveTo(38, 25, -38, 25, -44, -9); q.closePath(); q.fill(); q.stroke(); } },
  disli: { w: 104, h: 50, parla: [[-22, 6, 16], [22, 6, 16], [6, 10, 16]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 6; q.lineJoin = 'round'; q.beginPath(); q.moveTo(-42, -10); q.quadraticCurveTo(0, -4, 42, -10); q.bezierCurveTo(37, 31, -37, 31, -42, -10); q.closePath(); q.fill(); q.stroke(); },
    ust(q, yan) {   // tek tatlı süt dişi (yuvarlak köşeli, sivri değil), biraz yanda: sevimli bir boşluklu sırıtış
      const x0 = -13, x1 = -1, y0 = -9, y1 = 4.5, r = 4.2;
      q.beginPath(); q.moveTo(x0, y0); q.lineTo(x1, y0); q.lineTo(x1, y1 - r); q.quadraticCurveTo(x1, y1, x1 - r, y1); q.lineTo(x0 + r, y1); q.quadraticCurveTo(x0, y1, x0, y1 - r); q.closePath();
      q.fillStyle = yan ? '#fff6e2' : '#d6cac6'; q.fill(); q.lineWidth = 1.6; q.strokeStyle = yan ? '#b8662a' : '#6a5062'; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(x0 + 3.6, y0 + 4.5, 1.6, 3, 0, 0, 6.2832); q.fill(); } },
  dil: { w: 104, h: 58, parla: [[-18, 3, 15], [14, 4, 15]],
    sekil(q) { q.strokeStyle = q.fillStyle; q.lineWidth = 6; q.lineJoin = 'round'; q.beginPath(); q.moveTo(-40, -8); q.quadraticCurveTo(0, 0, 40, -8); q.bezierCurveTo(34, 22, -34, 22, -40, -8); q.closePath(); q.fill(); q.stroke(); },
    ust(q, yan) {   // pembe dil: alt dudaktan dışarı sarkar
      q.beginPath(); q.moveTo(-3, 6); q.lineTo(-3, 14); q.quadraticCurveTo(-3, 25, 8, 25); q.quadraticCurveTo(19, 25, 19, 14); q.lineTo(19, 6); q.closePath();
      q.fillStyle = yan ? '#ff8fb0' : '#b88698'; q.fill(); q.lineWidth = 1.6; q.strokeStyle = yan ? '#c8506e' : '#6e4a62'; q.stroke();
      q.strokeStyle = yan ? '#e2607f' : '#8e6278'; q.lineWidth = 1.5; q.lineCap = 'round'; q.beginPath(); q.moveTo(8, 11); q.lineTo(8, 19); q.stroke();
      q.fillStyle = 'rgba(255,214,226,0.8)'; q.beginPath(); q.ellipse(2.2, 16, 2, 3.2, -0.2, 0, 6.2832); q.fill(); } }
};

// ── önbellekli sprite'lar (ilk kullanımda bir kez üretilir) ──
const KY8S = { hazir: false };
function ky8Sprite() {
  if (KY8S.hazir) return; KY8S.hazir = true;
  const PX = KY8_PX, r = rng(8224);
  KY8S.govde = [ky8GovdeCiz(false, r), ky8GovdeCiz(true, r)];
  KY8S.sap = [ky8SapCiz(false), ky8SapCiz(true)];
  KY8S.yaprak = [ky8YaprakCiz(false), ky8YaprakCiz(true)];
  KY8S.par = {}; for (const ad in KY8_PAR) KY8S.par[ad] = [ky8Oyma(KY8_PAR[ad], false), ky8Oyma(KY8_PAR[ad], true)];
  KY8S.balon = KY8_BTON.map(t => ky8BalonCiz(t));
  // gölge
  { const cv = KY8S.golge = ky8Cv(128, 32), q = cv.getContext('2d'); q.translate(64, 16); q.scale(1, 0.25);
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 64); gr.addColorStop(0, 'rgba(30,16,52,0.6)'); gr.addColorStop(0.6, 'rgba(30,16,52,0.25)'); gr.addColorStop(1, 'rgba(30,16,52,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 64, 0, 6.2832); q.fill(); }
  // ışık huzmesi (kökten uca söner): 128×24 px
  { const cv = KY8S.isin = ky8Cv(128, 24), q = cv.getContext('2d');
    const gr = q.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, 'rgba(255,236,170,0.9)'); gr.addColorStop(0.45, 'rgba(255,214,120,0.35)'); gr.addColorStop(1, 'rgba(255,200,110,0)');
    q.fillStyle = gr; q.beginPath(); q.moveTo(0, 12); q.lineTo(128, 0); q.lineTo(128, 24); q.closePath(); q.fill(); }
  // dört köşeli parıltı yıldızı (beyaz)
  { const cv = KY8S.pirilti = ky8Cv(48, 48), q = cv.getContext('2d'); q.translate(24, 24);
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 22); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    q.fillStyle = gr; q.fillRect(-24, -24, 48, 48);
    q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, d = i % 2 ? 3.2 : 20; i ? q.lineTo(Math.cos(a) * d, Math.sin(a) * d) : q.moveTo(Math.cos(a) * d, Math.sin(a) * d); } q.closePath(); q.fill(); }
  // minik kağıt fenerler (sönük + dört renk yanık): ref 18×22 birim
  KY8S.fener = [ky8FenerCiz(null)]; for (const f of KY8_FENER) KY8S.fener.push(ky8FenerCiz(f[2]));
  KY8S.sahne = ky8SahneCiz(r);
}
function ky8GovdeCiz(yan, r) {   // dev kabak gövdesi: yedi tombul dilim, kalın yumuşak kontur; sönük (gri-mor) ya da içten yanık (turuncu)
  const PX = KY8_PX, M = 8, cv = ky8Cv((KY8_W + 2 * M) * PX, (KY8_H + 2 * M) * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, (KY8_W / 2 + M) * PX, (KY8_H + M) * PX);
  const lob = []; for (const a of [3, 2, 1, 0]) for (const sg of a ? [-1, 1] : [1]) { const ry = [64, 65.5, 58, 49][a]; lob.push({ a, cx: sg * a * 25, rx: [38, 36, 33, 29][a], ry, cy: -ry - a * 2 }); }
  const K = yan ? { kon: '#a3441a', ac: '#ffc76e', ana: '#ff9a3c', koyu: '#d4621e', dis: ['#f08a34', '#c9561a'], rib: '#b4501c', par: '#ffe0a0' }
                : { kon: '#3b2a4e', ac: '#c4a098', ana: '#977488', koyu: '#5e4568', dis: ['#8a6a80', '#55405e'], rib: '#4c3558', par: '#e2d0ee' };
  // kontur: bütün dilimler biraz büyük, koyu
  q.fillStyle = K.kon; for (const l of lob) { q.beginPath(); q.ellipse(l.cx, l.cy, l.rx + 3.4, l.ry + 3.4, 0, 0, 6.2832); q.fill(); }
  for (const l of lob) {
    const dis = l.a >= 2, gr = q.createRadialGradient(l.cx - l.rx * 0.28, l.cy - l.ry * 0.38, 2, l.cx, l.cy, Math.max(l.rx, l.ry) * 1.2);
    gr.addColorStop(0, K.ac); gr.addColorStop(0.5, dis ? K.dis[0] : K.ana); gr.addColorStop(1, dis ? K.dis[1] : K.koyu);
    q.fillStyle = gr; q.beginPath(); q.ellipse(l.cx, l.cy, l.rx, l.ry, 0, 0, 6.2832); q.fill();
    q.strokeStyle = K.rib; q.globalAlpha = 0.5; q.lineWidth = 2.2; q.stroke(); q.globalAlpha = 1;
    // dilimin yuvarlaklığı: sol üstte yumuşak parlama şeridi
    q.strokeStyle = K.par; q.globalAlpha = yan ? 0.4 : 0.28; q.lineWidth = 3.2; q.lineCap = 'round';
    q.beginPath(); q.ellipse(l.cx - l.rx * 0.18, l.cy - l.ry * 0.05, l.rx * 0.62, l.ry * 0.78, 0, Math.PI * 1.08, Math.PI * 1.42); q.stroke(); q.globalAlpha = 1;
  }
  q.globalCompositeOperation = 'source-atop';
  if (yan) {   // içten gelen sıcak ışık (oyukların çevresi kabuktan parlar)
    const gi = q.createRadialGradient(0, -54, 4, 0, -58, 98); gi.addColorStop(0, 'rgba(255,236,160,0.55)'); gi.addColorStop(0.55, 'rgba(255,200,110,0.22)'); gi.addColorStop(1, 'rgba(255,190,100,0)');
    q.fillStyle = gi; q.fillRect(-120, -150, 240, 160);
  }
  { const ga = q.createLinearGradient(0, -40, 0, 2); ga.addColorStop(0, 'rgba(0,0,0,0)'); ga.addColorStop(1, yan ? 'rgba(150,50,30,0.28)' : 'rgba(30,16,50,0.35)'); q.fillStyle = ga; q.fillRect(-120, -40, 240, 44); }
  { const gs = q.createRadialGradient(0, -127, 2, 0, -127, 30); gs.addColorStop(0, yan ? 'rgba(130,50,20,0.45)' : 'rgba(30,18,46,0.45)'); gs.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = gs; q.fillRect(-32, -157, 64, 60); }   // sapın dibindeki çukur
  for (let i = 0; i < 46; i++) { const x = (r() - 0.5) * 190, y = -8 - r() * 115; q.fillStyle = i % 3 ? (yan ? 'rgba(150,60,20,0.08)' : 'rgba(40,20,60,0.08)') : 'rgba(255,240,220,0.12)'; q.beginPath(); q.arc(x, y, 0.8 + r() * 1.6, 0, 6.2832); q.fill(); }
  // ay ışığı kenar parıltısı (sol üst, lila) ve alttan pembe sis yansıması
  q.lineCap = 'round';
  q.strokeStyle = yan ? 'rgba(255,236,200,0.5)' : 'rgba(214,196,255,0.5)'; q.lineWidth = 3;
  for (const l of lob) if (l.cx <= 0 && l.a >= 1) { q.beginPath(); q.ellipse(l.cx, l.cy, l.rx - 2.2, l.ry - 2.2, 0, Math.PI * 1.02, Math.PI * 1.36); q.stroke(); }
  q.strokeStyle = yan ? 'rgba(255,150,190,0.3)' : 'rgba(255,150,210,0.22)'; q.lineWidth = 2.6;
  for (const l of lob) if (l.a >= 1) { q.beginPath(); q.ellipse(l.cx, l.cy, l.rx - 2, l.ry - 2, 0, Math.PI * 0.3, Math.PI * 0.62); q.stroke(); }
  q.globalCompositeOperation = 'source-over';
  return cv;
}
function ky8SapCiz(yan) {   // tombul, hafif kıvrık sap: taban ortası (16, 40) px/PX; ref 32×42 birim
  const PX = KY8_PX, cv = ky8Cv(32 * PX, 42 * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 16 * PX, 38 * PX);
  const K = yan ? ['#4e6a24', '#7fa03e', '#3a5018', '#c4d488'] : ['#41483e', '#6a7266', '#323830', '#9ea596'];
  q.fillStyle = K[0]; q.beginPath(); q.moveTo(-12, 2); q.bezierCurveTo(-12, -14, -8, -26, -2, -32); q.quadraticCurveTo(4, -36, 9, -31); q.bezierCurveTo(6, -22, 8, -10, 12, 2); q.quadraticCurveTo(0, 6, -12, 2); q.fill();
  q.fillStyle = K[1]; q.beginPath(); q.moveTo(-8.5, 1); q.bezierCurveTo(-8.5, -13, -5, -24, -0.5, -29.5); q.quadraticCurveTo(3, -32, 5.5, -29); q.bezierCurveTo(3, -20, 4, -10, 6.5, 2); q.quadraticCurveTo(-1, 4, -8.5, 1); q.fill();
  q.strokeStyle = K[2]; q.lineWidth = 1.4; q.lineCap = 'round'; for (const [x0, x1] of [[-5, 0.5], [1, 3.5], [7, 5.5]]) { q.beginPath(); q.moveTo(x0, 0); q.quadraticCurveTo(x0 + 0.5, -14, x1, -26); q.stroke(); }
  q.fillStyle = K[3]; q.beginPath(); q.ellipse(3, -31.5, 5, 2.6, -0.4, 0, 6.2832); q.fill();
  q.fillStyle = 'rgba(255,255,255,0.22)'; q.beginPath(); q.ellipse(-5, -12, 1.6, 7, 0.15, 0, 6.2832); q.fill();
  return cv;
}
function ky8YaprakCiz(yan) {   // üç dilimli tombul kabak yaprağı; sap ucu (38, 14) birim, yaprak sola uzanır; ref 42×30 birim
  const PX = KY8_PX, cv = ky8Cv(42 * PX, 30 * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 0, 0);
  const K = yan ? ['#2f6a34', '#5fb556', '#8fd46e', '#2c5a2c'] : ['#2c3c34', '#56705e', '#7a907e', '#2c3a32'];
  q.strokeStyle = K[0]; q.lineWidth = 2.4; q.lineCap = 'round'; q.beginPath(); q.moveTo(39, 15); q.quadraticCurveTo(33, 13, 28, 14); q.stroke();
  const yol = () => { q.beginPath(); q.moveTo(28, 14); q.bezierCurveTo(26, 3, 14, -1, 9, 5); q.bezierCurveTo(1, 4, -1, 13, 4, 16); q.bezierCurveTo(-1, 22, 6, 29, 13, 24); q.bezierCurveTo(19, 30, 29, 25, 28, 14); q.closePath(); };
  yol(); q.fillStyle = K[0]; q.lineWidth = 3; q.lineJoin = 'round'; q.strokeStyle = K[0]; q.stroke(); q.fillStyle = K[1]; q.fill();
  q.save(); yol(); q.clip(); q.fillStyle = K[2]; q.globalAlpha = 0.55; q.beginPath(); q.ellipse(15, 9, 9, 5, -0.3, 0, 6.2832); q.fill(); q.restore();
  q.strokeStyle = K[3]; q.lineWidth = 1.2; for (const [x, y] of [[8, 6], [4, 15], [12, 23]]) { q.beginPath(); q.moveTo(27, 14); q.quadraticCurveTo((27 + x) / 2, (14 + y) / 2 - 1, x + 2, y); q.stroke(); }
  return cv;
}
function ky8Oyma(d, yan) {   // oyulmuş parça: koyu kontur → kesik kabuk duvarı (sol üstte görünür) → iç (sönükken koyu, yanıkken altın) → ayrıntı
  const PX = KY8_PX, M = 5, W = (d.w + 2 * M) * PX, H = (d.h + 2 * M) * PX, cv = ky8Cv(W, H), q = cv.getContext('2d');
  const orta = x => x.setTransform(PX, 0, 0, PX, (d.w / 2 + M) * PX, (d.h / 2 + M) * PX);
  // kontur: şekil sekiz yöne kaydırılarak
  orta(q); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.2832; q.save(); q.translate(Math.cos(a) * 1.8, Math.sin(a) * 1.8); q.fillStyle = yan ? '#8e3412' : '#2e1c3a'; d.sekil(q); q.restore(); }
  // duvar + iç ayrı tuvalde (iç, konturun üstüne taşmasın)
  const ic = ky8Cv(W, H), z = ic.getContext('2d'); orta(z);
  z.fillStyle = yan ? '#ffe2ae' : '#9c7a78'; d.sekil(z);
  z.globalCompositeOperation = 'source-atop';
  z.save(); z.translate(1.4, 2); z.fillStyle = yan ? '#ffa82a' : '#4a2236'; d.sekil(z); z.restore();
  if (yan) for (const [x, y, rr] of d.parla) { const gr = z.createRadialGradient(x, y + 1, 0, x, y + 1, rr); gr.addColorStop(0, 'rgba(255,246,200,0.95)'); gr.addColorStop(0.45, 'rgba(255,218,110,0.6)'); gr.addColorStop(1, 'rgba(255,196,80,0)'); z.fillStyle = gr; z.fillRect(x - rr, y - rr, rr * 2, rr * 2); }
  else for (const [x, y, rr] of d.parla) { const gr = z.createRadialGradient(x, y + rr * 0.3, 0, x, y + rr * 0.3, rr); gr.addColorStop(0, 'rgba(150,80,70,0.55)'); gr.addColorStop(1, 'rgba(150,80,70,0)'); z.fillStyle = gr; z.fillRect(x - rr, y - rr, rr * 2, rr * 2.6); }   // içerde uyuyan sıcaklık
  q.setTransform(1, 0, 0, 1, 0, 0); q.drawImage(ic, 0, 0);
  if (d.ust) { orta(q); d.ust(q, yan); }
  cv.ox = (d.w / 2 + M); cv.oy = (d.h / 2 + M); cv.bw = d.w + 2 * M; cv.bh = d.h + 2 * M;   // birim cinsinden merkez ve boy
  return cv;
}
function ky8BalonCiz(ton) {   // sihirli baloncuk: şeffaf orta, renkli yanardöner kenar, beyaz parlama hilali; ref yarıçap 50 birim
  const PX = KY8_PX, R = KY8_BR, N = (R + 4) * 2 * PX, cv = ky8Cv(N, N), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, N / 2, N / 2);
  const [cr, cg, cb] = hex(ton);
  const gr = q.createRadialGradient(-R * 0.15, -R * 0.2, R * 0.2, 0, 0, R);
  gr.addColorStop(0, 'rgba(255,255,255,0.03)'); gr.addColorStop(0.62, `rgba(${cr},${cg},${cb},0.07)`); gr.addColorStop(0.86, `rgba(${cr},${cg},${cb},0.28)`); gr.addColorStop(1, `rgba(${cr},${cg},${cb},0.62)`);
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, R, 0, 6.2832); q.fill();
  q.lineCap = 'round';
  q.lineWidth = 1.6; q.strokeStyle = 'rgba(255,255,255,0.65)'; q.beginPath(); q.arc(0, 0, R - 0.8, 0, 6.2832); q.stroke();
  for (const [a0, a1, col, w] of [[-0.6, 0.5, 'rgba(255,170,220,0.55)', 3], [0.7, 1.7, 'rgba(150,255,215,0.5)', 3], [1.9, 2.7, 'rgba(255,240,150,0.45)', 2.6], [4.9, 5.5, 'rgba(195,155,255,0.5)', 2.6]]) {
    q.strokeStyle = col; q.lineWidth = w; q.beginPath(); q.arc(0, 0, R - 3.2, a0, a1); q.stroke(); }
  q.strokeStyle = 'rgba(255,255,255,0.85)'; q.lineWidth = 5.5; q.beginPath(); q.arc(0, 0, R * 0.74, Math.PI * 1.08, Math.PI * 1.42); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.9)'; q.beginPath(); q.arc(Math.cos(Math.PI * 1.55) * R * 0.74, Math.sin(Math.PI * 1.55) * R * 0.74, 2.8, 0, 6.2832); q.fill();
  q.strokeStyle = 'rgba(255,255,255,0.35)'; q.lineWidth = 3; q.beginPath(); q.arc(0, 0, R * 0.8, Math.PI * 0.18, Math.PI * 0.4); q.stroke();
  return cv;
}
function ky8FenerCiz(ton) {   // minik yuvarlak kağıt fener (dilimli, kapaklı); ton null → sönük; taban ortası (9, 22) birim
  const PX = KY8_PX, cv = ky8Cv(18 * PX, 24 * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 9 * PX, 12 * PX);
  const yan = !!ton, [cr, cg, cb] = hex(ton || '#8a7aa0');
  const gr = q.createRadialGradient(-2, -2, 1, 0, 0, 9);
  if (yan) { gr.addColorStop(0, '#fffbe8'); gr.addColorStop(0.45, ton); gr.addColorStop(1, `rgb(${cr * 0.72 | 0},${cg * 0.72 | 0},${cb * 0.72 | 0})`); }
  else { gr.addColorStop(0, '#9a8cae'); gr.addColorStop(1, '#4e4266'); }
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, 0, 8, 7.5, 0, 0, 6.2832); q.fill();
  q.strokeStyle = yan ? 'rgba(120,60,40,0.35)' : 'rgba(40,30,60,0.45)'; q.lineWidth = 0.8; for (const k of [-0.55, 0, 0.55]) { q.beginPath(); q.ellipse(0, 0, 8 * Math.abs(k) + 0.3, 7.5, 0, -Math.PI / 2, Math.PI / 2, k < 0); q.stroke(); }
  q.fillStyle = yan ? '#7a4a3a' : '#3a2e4a'; q.fillRect(-3.5, -9.5, 7, 2.6); q.fillRect(-3, 7, 6, 2.4);
  if (yan) { q.fillStyle = 'rgba(255,255,255,0.6)'; q.beginPath(); q.ellipse(-3, -3, 1.6, 2.6, -0.4, 0, 6.2832); q.fill(); }
  return cv;
}
function ky8SahneCiz(r) {   // saman balyası sahne + fener direkleri + ampul teli + iki minik kabak; köken: kabak merkezi x, zemin y; ref 440×84 birim
  const PX = KY8_PX, X0 = 220, Y0 = 76, cv = ky8Cv(440 * PX, 84 * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, X0 * PX, Y0 * PX);
  cv.x0 = X0; cv.y0 = Y0; cv.bw = 440; cv.bh = 84;
  // yer gölgesi
  { const gr = q.createRadialGradient(0, 0, 4, 0, 0, 150); gr.addColorStop(0, 'rgba(26,14,46,0.55)'); gr.addColorStop(1, 'rgba(26,14,46,0)'); q.save(); q.scale(1, 0.1); q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 150, 0, 6.2832); q.fill(); q.restore(); }
  // fener direkleri (eğri büğrü ince dallar)
  q.lineCap = 'round';
  for (const [x, h] of KY8_FENER) { q.strokeStyle = '#3a2a30'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(x, 2); q.quadraticCurveTo(x + (x < 0 ? -2 : 2), -h * 0.5, x, -h + 8); q.stroke(); q.strokeStyle = 'rgba(160,120,110,0.5)'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(x - 0.6, 0); q.quadraticCurveTo(x - 0.6 + (x < 0 ? -2 : 2), -h * 0.5, x - 0.6, -h + 9); q.stroke(); }
  // iki minik kabak (oyulmamış)
  const mini = (x, s, a) => { q.save(); q.translate(x, 1); q.scale(s, s); q.rotate(a);
    for (const [cx, rx, ry, col] of [[-7, 7.5, 9, '#7d5e78'], [7, 7.5, 9, '#7d5e78'], [0, 8.5, 10.5, '#97738a']]) { q.fillStyle = '#3b2a4e'; q.beginPath(); q.ellipse(cx, -10, rx + 1.6, ry + 1.6, 0, 0, 6.2832); q.fill(); }
    for (const [cx, rx, ry, col] of [[-7, 7.5, 9, '#7d5e78'], [7, 7.5, 9, '#7d5e78'], [0, 8.5, 10.5, '#97738a']]) { q.fillStyle = col; q.beginPath(); q.ellipse(cx, -10, rx, ry, 0, 0, 6.2832); q.fill(); }
    q.fillStyle = 'rgba(220,200,240,0.4)'; q.beginPath(); q.ellipse(-3, -15, 2.5, 4, -0.3, 0, 6.2832); q.fill();
    q.strokeStyle = '#4a5240'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, -20); q.quadraticCurveTo(1, -25, 4, -26); q.stroke(); q.restore(); };
  mini(-198, 1.1, -0.06); mini(200, 0.85, 0.08);
  // saman balyaları: iki balya yan yana, üst yüzü açık, ön yüzü saman çizgili, iki ip bağı
  for (const [x0, x1] of [[-126, -2], [2, 126]]) {
    const w = x1 - x0, top = -KY8_SAHNE;
    q.fillStyle = '#5a3c2a'; ky8Kutu(q, x0 - 1.6, top - 1.6, w + 3.2, KY8_SAHNE + 3.2, 7); q.fill();
    const gr = q.createLinearGradient(0, top, 0, 2); gr.addColorStop(0, '#d2a86e'); gr.addColorStop(0.25, '#bd9058'); gr.addColorStop(1, '#8a6440');
    q.fillStyle = gr; ky8Kutu(q, x0, top, w, KY8_SAHNE, 6); q.fill();
    q.fillStyle = '#e0bc80'; ky8Kutu(q, x0 + 1.5, top + 0.8, w - 3, 8, 4); q.fill();
    q.save(); ky8Kutu(q, x0, top, w, KY8_SAHNE, 6); q.clip();
    for (let i = 0; i < 170; i++) { const x = x0 + r() * w, y = top + 6 + r() * (KY8_SAHNE - 6), l = 4 + r() * 9, a = (r() - 0.5) * 0.5;
      q.strokeStyle = i % 2 ? 'rgba(240,210,150,0.5)' : 'rgba(110,74,44,0.35)'; q.lineWidth = 0.7 + r() * 0.6; q.beginPath(); q.moveTo(x, y); q.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); q.stroke(); }
    for (let i = 0; i < 40; i++) { const x = x0 + r() * w, y = top + 1 + r() * 7, l = 3 + r() * 5; q.strokeStyle = 'rgba(250,226,170,0.6)'; q.lineWidth = 0.7; q.beginPath(); q.moveTo(x, y); q.lineTo(x + l, y + (r() - 0.5) * 2); q.stroke(); }
    q.fillStyle = 'rgba(40,20,60,0.25)'; q.fillRect(x0, -6, w, 8);
    q.restore();
    for (const u of [0.27, 0.73]) { const x = x0 + w * u; q.strokeStyle = '#6a4630'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(x - 1, top + 0.5); q.quadraticCurveTo(x + 1.5, top + KY8_SAHNE * 0.5, x, -0.5); q.stroke(); q.strokeStyle = 'rgba(200,160,110,0.45)'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(x - 1.6, top + 1); q.quadraticCurveTo(x + 0.8, top + KY8_SAHNE * 0.5, x - 0.6, -1); q.stroke(); }
    for (let i = 0; i < 16; i++) { const sol = i % 2 === 0, x = sol ? x0 + 1 : x1 - 1, y = top + 3 + r() * (KY8_SAHNE - 6), a = (sol ? Math.PI : 0) + (r() - 0.5) * 0.9, l = 2.5 + r() * 4;   // kenarlardan taşan saman çöpleri
      q.strokeStyle = i % 3 ? '#d8b072' : '#a07a48'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(x, y); q.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); q.stroke(); }
  }
  // ampul teli: balyaların önünde fistonlu
  q.strokeStyle = '#3a2c3a'; q.lineWidth = 1; q.beginPath();
  for (let i = 0; i <= 80; i++) { const p = ky8AmpulTel(i / 80); i ? q.lineTo(p[0], p[1]) : q.moveTo(p[0], p[1]); } q.stroke();
  // yere dökülmüş saman çöpleri
  for (let i = 0; i < 26; i++) { const x = (r() - 0.5) * 300, l = 3 + r() * 6, a = (r() - 0.5) * 0.7; q.strokeStyle = i % 2 ? 'rgba(214,176,114,0.8)' : 'rgba(160,122,74,0.8)'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(x, 1.5); q.lineTo(x + Math.cos(a) * l, 1.5 + Math.sin(a) * l * 0.3); q.stroke(); }
  return cv;
}
const KY8_AMP = []; for (let i = 0; i < KY8_AMPUL_N; i++) KY8_AMP.push(null);
function ky8AmpulTel(u) {   // u 0..1 → [x, y] (kabak merkezine ve zemine göre): dört fistonlu tel
  const x = -118 + u * 236, f = (u * 4) % 1;
  return [x, -27 + Math.sin(f * Math.PI) * 7];
}
for (let i = 0; i < KY8_AMPUL_N; i++) { const u = (i + 0.5) / KY8_AMPUL_N, p = ky8AmpulTel(u); KY8_AMP[i] = [p[0], p[1] + 2.4]; }

// ── ortak çizici: yüzü yapılmış dev kabak ──
function ky8VarsayilanSecim() { const s = typeof V8 !== 'undefined' && V8 && V8.kabakYuzSecim; return s || KY8_VARS; }
const KY8_VARS = { goz: 'yuvarlak', burun: 'ucgen', agiz: 'gulus' };
function ky8ParCiz(c, ad, x, y, sx, sy, rot, isik, a0, ay) {   // tek parça (sönük + yanık sprite karışımı), merkez (x, y); ay: ölçeklemenin dayanak noktası (parçanın yerel y'si)
  const sp = KY8S.par[ad]; if (!sp) return;
  const d0 = sp[0], w = d0.bw, h = d0.bh, M = c.getTransform();
  c.translate(x, y); if (rot) c.rotate(rot); c.scale(sx, sy); if (ay) c.translate(0, -ay);
  if (isik < 0.995) { c.globalAlpha = a0; c.drawImage(d0, -d0.ox, -d0.oy, w, h); }
  if (isik > 0.005) { c.globalAlpha = a0 * isik; c.drawImage(sp[1], -d0.ox, -d0.oy, w, h); }
  c.setTransform(M); c.globalAlpha = a0;
}
function ky8Zip(z) { if (z == null || !(z >= 0) || z >= 0.55) return 0; const u = z / 0.55; return Math.pow(1 - u, 1.5) * Math.cos(u * Math.PI * 2.5); }   // parça oturunca ezilip yaylanır
function kabakYuzCiz(c, x, y, s, t, o) {
  ky8Sprite(); o = o || KY8_BOS; t = t || 0; s = s || 1;
  const al = o.alpha == null ? 1 : clamp(o.alpha, 0, 1); if (al <= 0.01 || !Number.isFinite(x) || !Number.isFinite(y)) return;
  const sec = o.secim || ky8VarsayilanSecim(), mask = o.parca == null ? 7 : o.parca, canli = o.canli !== false;
  const yan = o.yanik == null ? 1 : clamp(o.yanik, 0, 1), isik = o.isik == null ? yan : clamp(o.isik, 0, 1);
  let hop = o.hop || 0, sq = o.sq || 0, egil = o.egil || 0, gul = o.gul || 0, mutlu = o.mutlu || 0, kirp = o.kirp, yap = o.yaprak || 0, kiv = o.kivrim || 0;
  if (o.dans) {   // dans: tombul hoplayış, iki yana eğilme, kahkaha
    const w = clamp(o.dans, 0, 1), ph = (o.faz != null ? o.faz : t) * 4.4, h = Math.abs(Math.sin(ph));
    hop += h * 16 * w; sq += (h < 0.25 ? (0.25 - h) * 0.5 : -h * 0.05) * w; egil += Math.sin(ph * 0.5) * 0.13 * w;
    gul = Math.max(gul, 0.55 * w); mutlu = Math.max(mutlu, (Math.sin(ph * 0.5 + 0.8) > 0.2 ? 1 : 0.2) * w); yap = Math.max(yap, 0.6 * w); kiv = Math.max(kiv, 0.5 * w);
  }
  if (o.nabiz) sq += clamp(o.nabiz, 0, 1) * 0.07;
  if (canli) sq += Math.sin(t * 2.2) * 0.012;
  if (kirp == null) kirp = canli && (mask & 1) ? (((t + 0.37) % 3.7) < 0.13 ? 1 : 0) : 0;
  const M0 = c.getTransform(), ga0 = c.globalAlpha, a0 = ga0 * al, op0 = c.globalCompositeOperation;
  c.translate(x, y); c.scale(s, s);
  if (o.zemin !== false) {   // gölge ve yerdeki sıcak ışık havuzu
    const gs = 1 - Math.min(0.5, hop / 70);
    c.globalAlpha = a0 * 0.55 * gs; c.drawImage(KY8S.golge, -114 * gs, -8, 228 * gs, 16); c.globalAlpha = a0;
    if (yan > 0.02) { c.globalCompositeOperation = 'lighter'; ky8Glow(c, '#ffb347', 0, -2, 185, 34, 0.42 * yan); c.globalCompositeOperation = op0; }
  }
  c.translate(0, -hop); c.rotate(egil); c.scale(1 + sq, 1 - sq);
  const parla = clamp(o.parla || 0, 0, 1);
  c.globalAlpha = a0;
  if (yan > 0.02 || parla > 0) { c.globalCompositeOperation = 'lighter'; ky8Glow(c, '#ffc860', 0, -66, 175, 140, 0.22 * yan + 0.55 * parla); c.globalCompositeOperation = op0; }
  // gövde: sönük + yanık karışımı
  const gW = KY8_W + 16, gH = KY8_H + 16;
  c.globalAlpha = a0; if (yan < 0.995) c.drawImage(KY8S.govde[0], -gW / 2, -gH + 8, gW, gH);
  if (yan > 0.005) { c.globalAlpha = a0 * yan; c.drawImage(KY8S.govde[1], -gW / 2, -gH + 8, gW, gH); }
  // pembe yanaklar
  const yanak = o.yanak != null ? clamp(o.yanak, 0, 1) : (mask & 1 ? Math.max(mutlu, yan * 0.6) : 0);
  if (yanak > 0.01) { c.globalAlpha = a0; ky8Glow(c, '#ff7fb8', -76, -50, 22, 13, 0.62 * yanak); ky8Glow(c, '#ff7fb8', 76, -50, 22, 13, 0.62 * yanak); }
  // kıvrık filiz (sapın dibinden sağa, kıvrıldıkça sarmal sıklaşır)
  { const cx = 25 + Math.sin(t * 1.7) * 1.2 + kiv * 3, cy = -143 - kiv * 3, tur = 1.15 + kiv * 1.25, R0 = 12.5 - kiv * 1.5;
    c.globalAlpha = a0; c.strokeStyle = yan > 0.5 ? '#7cae46' : '#6a7a66'; c.lineWidth = 2.6; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(6, -127);
    for (let i = 0; i <= 22; i++) { const u = i / 22, a = Math.PI * 0.92 + u * tur * 6.2832, rr = R0 * (1 - u * 0.82); c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    c.stroke(); }
  // sap
  { const M = c.getTransform(); c.translate(0, -124); c.rotate(Math.sin(t * 1.3) * 0.02 + kiv * 0.08 * Math.sin(t * 8)); c.globalAlpha = a0;
    if (yan < 0.995) c.drawImage(KY8S.sap[0], -16, -38, 32, 42);
    if (yan > 0.005) { c.globalAlpha = a0 * yan; c.drawImage(KY8S.sap[1], -16, -38, 32, 42); }
    c.setTransform(M); }
  // yaprak: sapın solunda kabağın üstüne yaslanır; el sallarken kalkıp sallanır
  { const M = c.getTransform(), w = smooth(clamp(yap, 0, 1)); c.translate(-7, -126); c.rotate(-0.42 + Math.sin(t * 1.1) * 0.04 + w * (0.55 + Math.sin(t * 10) * 0.42)); c.globalAlpha = a0;
    if (yan < 0.995) c.drawImage(KY8S.yaprak[0], -39, -15, 42, 30);
    if (yan > 0.005) { c.globalAlpha = a0 * yan; c.drawImage(KY8S.yaprak[1], -39, -15, 42, 30); }
    c.setTransform(M); }
  // oyulmuş yüz
  const bx = clamp(o.bakX || 0, -1, 1) * 4.5, by = clamp(o.bakY || 0, -1, 1) * 3.5, zp = o.zip;
  if (mask & 1) {   // gözler: kırpma (dikey ezilme), mutluyken kısılma, bakış
    const ad = KY8S.par[sec.goz] ? sec.goz : 'yuvarlak', z = ky8Zip(zp && zp[0]), ks = lerp(1, 0.12, clamp(kirp, 0, 1)) * (1 - 0.42 * clamp(mutlu, 0, 1));
    ky8ParCiz(c, ad, KY8_YUVA[0][0] + bx, KY8_YUVA[0][1] + by - 2 * mutlu, KY8_YS * (1 + 0.3 * z), KY8_YS * ks * (1 - 0.3 * z), 0, isik, a0);
  }
  if (mask & 2) {   // burun: oynatınca kıpır kıpır
    const ad = KY8S.par[sec.burun] ? sec.burun : 'ucgen', z = ky8Zip(zp && zp[1]), b = clamp(o.burun || 0, 0, 1);
    ky8ParCiz(c, ad, KY8_YUVA[1][0] + bx * 0.5, KY8_YUVA[1][1] + by * 0.4, KY8_YSP[1] * (1 + 0.3 * z) * (1 + Math.sin(t * 31) * 0.13 * b), KY8_YSP[1] * (1 - 0.3 * z) * (1 - Math.sin(t * 31) * 0.1 * b), Math.sin(t * 26) * 0.22 * b, isik, a0);
  }
  if (mask & 4) {   // ağız: gülümseme gerilir, kahkahada açılıp kapanır
    const ad = KY8S.par[sec.agiz] ? sec.agiz : 'gulus', z = ky8Zip(zp && zp[2]), gm = clamp(o.gulumse || 0, 0, 1), gl = clamp(gul, 0, 1);
    const ac = gl * (0.45 + 0.55 * Math.abs(Math.sin(t * 15)));
    ky8ParCiz(c, ad, KY8_YUVA[2][0] + bx * 0.3, KY8_YUVA[2][1] + by * 0.25 - 9 * KY8_YSP[2], KY8_YSP[2] * (1 + 0.3 * z) * (1 + 0.16 * gm + 0.07 * gl), KY8_YSP[2] * (1 - 0.3 * z) * (1 + 0.06 * gm + 0.22 * ac), 0, isik, a0, -9);
  }
  // oyuklardan taşan ışık (ekleyerek)
  if (isik > 0.02 && mask) {
    c.globalCompositeOperation = 'lighter'; c.globalAlpha = a0;
    const gy = KY8_YUVA[0][1] + by, ex = 40 * KY8_YS;
    if (mask & 1) { ky8Glow(c, '#ffc860', -ex + bx, gy, 38, 38, 0.3 * isik); ky8Glow(c, '#ffc860', ex + bx, gy, 38, 38, 0.3 * isik); }
    if (mask & 2) ky8Glow(c, '#ffc860', 0, KY8_YUVA[1][1], 26, 26, 0.26 * isik);
    if (mask & 4) ky8Glow(c, '#ffc860', 0, KY8_YUVA[2][1] + 3, 80, 38, 0.3 * isik);
    const isin = clamp(o.isin || 0, 0, 1);
    if (isin > 0.01) {   // ışık huzmeleri: yüzün ortasından yelpaze gibi, yavaşça döner
      const M = c.getTransform(); c.translate(0, -62);
      for (let i = 0; i < 10; i++) { const a = i / 10 * 6.2832 + t * 0.35, L = 150 + 50 * Math.sin(i * 2.3 + t * 2); c.rotate(i ? 6.2832 / 10 : a); c.globalAlpha = a0 * isin * (0.45 + 0.25 * Math.sin(i * 1.7 + t * 3)); c.drawImage(KY8S.isin, 18, -11, L, 22); }
      c.setTransform(M);
    }
    c.globalCompositeOperation = op0;
  }
  c.setTransform(M0); c.globalAlpha = ga0; c.globalCompositeOperation = op0;
}

// ── parçacıklar (sabit havuz) ──
const KY8_TZ = []; for (let i = 0; i < 230; i++) KY8_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#fff', r: 0 });
function ky8Toz(tip, x, y, vx, vy, max, s, col) {
  for (const p of KY8_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.r = Math.random() * 6.28; return p; }
  return null;
}
function ky8IsikSac(x, y, n, hiz, cols) { cols = cols || KY8_ISIK; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); ky8Toz(i % 4 === 0 ? 2 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.7 + Math.random() * 0.7, i % 4 === 0 ? 7 + Math.random() * 5 : 6 + Math.random() * 7, cols[i % cols.length]); } }
function ky8Halka(x, y, r, col) { ky8Toz(3, x, y, 0, 0, 0.45, r, col); }
function ky8TozAdim(dt) {
  for (const p of KY8_TZ) {
    if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 0 || p.tip === 2) { p.vx *= Math.exp(-dt * 2.4); p.vy = p.vy * Math.exp(-dt * 2.4) - 16 * dt; p.r += dt * 2; }
    else if (p.tip === 1) { p.vy += 330 * dt; p.vx *= Math.exp(-dt * 0.8); p.r += dt * 3; }   // ışık tozu fıskiyesi
    else if (p.tip === 4) { p.vy = -40; p.vx = Math.sin(p.t * 4 + p.r) * 18; }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
function ky8TozCiz(c) {
  const a0 = c.globalAlpha;
  for (const p of KY8_TZ) {
    if (!p.a) continue; const u = p.t / p.max, f = 1 - u; c.globalAlpha = a0;
    if (p.tip === 0 || p.tip === 1) { const tw = p.tip === 1 ? 0.7 + 0.3 * Math.sin(p.r * 4) : 1; ky8Glow(c, p.col, p.x, p.y, p.s * (0.6 + f * 0.6), p.s * (0.6 + f * 0.6), f * 0.9 * tw); c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.3, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { const sc = p.s * (0.5 + 0.5 * Math.sin(Math.min(1, u * 1.6) * Math.PI)); ky8Glow(c, p.col, p.x, p.y, sc * 1.2, sc * 1.2, f * 0.6); const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(p.r * 0.5); c.globalAlpha = a0 * Math.min(1, f * 1.5); c.drawImage(KY8S.pirilti, -sc, -sc, sc * 2, sc * 2); c.setTransform(M); }
    else if (p.tip === 3) { c.globalAlpha = a0 * f * 0.85; c.strokeStyle = p.col; c.lineWidth = 3 * f + 0.5; c.beginPath(); c.arc(p.x, p.y, p.s * (1 + u * 0.6), 0, 6.2832); c.stroke(); }
    else if (p.tip === 4) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); c.fillStyle = p.col; ky8Kalp(c, p.x, p.y, 5 + u * 2); c.fill(); }
  }
  c.globalAlpha = a0;
}

// ── durum ──
function ky8Bal(o, i) {   // i. baloncuğun dinlenme yeri (süzülme dahil)
  const k = o.ky, kx = ky8KX(o), b = KY8_BYER[i];
  return [kx + b[0] + Math.sin(k.t * 1.1 + i * 2.1) * 5, o.y + b[1] + Math.sin(k.t * 1.55 + i * 1.3) * 7];
}
function ky8Yuva(o, tur) { return [ky8KX(o) + KY8_YUVA[tur][0], ky8TabanY(o) + KY8_YUVA[tur][1]]; }
function ky8Faz(o, f) { const k = o.ky; k.faz = f; k.fT = 0; if (f === 'canlan') { k.ct = 0; k.idle = 0; k.helpOn = false; } }
function ky8TurBasla(o) {
  const k = o.ky, tur = KY8_TURLAR[k.tur], kx = ky8KX(o);
  ky8Faz(o, 'sec'); k.idle = 0; k.helpOn = false; k.helpT = 0;
  for (let i = 0; i < 3; i++) { const b = k.bal[i]; b.durum = 'gel'; b.t = -i * 0.17; b.ad = KY8_SECENEK[tur][i]; b.s = 0; b.x = kx; b.y = ky8TabanY(o) - 170; b.al = 1; }
  ky8IsikSac(kx, ky8TabanY(o) - 178, 12, 90, ['#ffffff', ...KY8_BTON]);
  ky8Sfx('kabakYuzBaloncuk', k.tur); k.ipucuOldu = false;
  OLAY.emit('kabakYuzTur', { o, n: k.tur + 1, tur });
}
function ky8Secilir(b) { return b.durum === 'bekle' || b.durum === 'gel' && b.t > 0.25; }   // yükselmekte olan baloncuk da seçilebilir
function ky8Sec(o, i, yardim) {   // bir baloncuk seçildi: patlar, parça kabağa uçar; öbürleri yumuşakça dağılır
  const k = o.ky, b = k.bal[i]; if (!k.aktif || k.faz !== 'sec' || !b || !ky8Secilir(b)) return false;
  b.durum = 'pat'; b.t = 0;
  ky8Halka(b.x, b.y, KY8_BR * 0.9, '#ffffff'); ky8IsikSac(b.x, b.y, 14, 140, [KY8_BTON[i], '#ffffff', '#ffe7a8']);
  let n = 0; for (let j = 0; j < 3; j++) { const q = k.bal[j]; if (j !== i && q.durum !== 'yok') { q.durum = 'sil'; q.t = -(0.16 + 0.14 * n++); } }
  const [tx] = ky8Yuva(o, k.tur);
  k.ucan = { i, ad: b.ad, x: b.x, y: b.y, x0: b.x, y0: b.y, t: 0, sure: yardim ? KY8_UC_P : KY8_UC, s: KY8_IKON[k.tur], s0: KY8_IKON[k.tur], rot: 0, yon: Math.sign(tx - b.x) || 1, pirilde: !!yardim, izT: 0 };
  ky8Faz(o, 'uc'); k.helpOn = false; k.helpT = 0; k.idle = 0; if (yardim) k.helpN++;
  ky8Sfx('parilti', 0.8);
  return true;
}
function ky8Oturt(o) {   // uçan parça yuvasına oturdu
  const k = o.ky, u = k.ucan; if (!u) return;
  const tur = k.tur, ad = KY8_TURLAR[tur], [tx, ty] = ky8Yuva(o, tur);
  k.secim[ad] = u.ad; k.mask |= 1 << tur; k.zip[tur] = 0; k.ucan = null;
  if (typeof V8 !== 'undefined' && V8) V8.kabakYuzSecim = { goz: k.secim.goz, burun: k.secim.burun, agiz: k.secim.agiz };
  k.sqv += 2.4; k.sevT = 1.3;
  ky8IsikSac(tx, ty, 18, 130, KY8_ALTIN); ky8Halka(tx, ty, tur === 2 ? 44 : 30, '#ffe7a8');
  if (tur < 2) for (const f of tur === 0 ? [0, 1] : [2, 3]) k.fenerH[f] = 1;   // sahnenin minik fenerleri yanar
  ky8Sfx('kabakYuzParca', tur + 1);
  OLAY.emit('kabakYuzParca', { o, n: tur + 1, tur: ad, ad: u.ad, i: u.i, yardim: u.pirilde });
  ky8Faz(o, 'tepki');
}
function ky8Aktiflestir(o) {
  const k = o.ky; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi') || P.y < o.y - 230) return false;
  // Feza kabağa dönük, sahnenin dışında yerde durur; havadaysa ya da (zıplayıp) kabağın önüne düştüyse oraya küçük bir hopla süzülür
  const kx = ky8KX(o), sag = P.x > kx + 20, e = k.entry;
  e.x = sag ? Math.max(P.x, kx + 238) : Math.min(P.x, o.x - 190); e.y = o.y; e.safeX = e.x; e.safeY = o.y; e.f = P.f;
  k.yon = sag ? -1 : 1; k.gx0 = P.x; k.gy0 = P.y; k.gT = Math.hypot(P.x - e.x, P.y - e.y) < 3 ? 1 : 0;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; KABAKYUZ.o = o; ky8GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; k.pr.f = D.face || 1; }
  ky8Faz(o, 'gel'); if (k.tur === 0) { k.sqv += 1.4; ky8IsikSac(ky8KX(o), ky8TabanY(o) - 150, 10, 70, KY8_ISIK); }   // kabak kıpırdar: "biri mi geldi?"
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kabakYuz', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('kabakYuzBasla', { o }); }
  return true;
}
function ky8Birak(o, tamam) {   // güvenli dönüş: giriş fotoğrafındaki konum aynen geri verilir
  const k = o.ky, e = k.entry; if (!k.aktif) return;
  if (!tamam && (k.faz === 'canlan' || k.faz === 'don')) tamam = true;   // canlanmaya başlamışsa bitmiş say
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = tamam ? 1 : e.f;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; ky8GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kabakYuz', 0.1, k.kameraFn, 1, 0.42);
  if (tamam && !o.done) {
    o.done = true; k.bitti = true; k.faz = 'bitti'; k.mask = 7; o.tk.bitti = true;
    if (typeof V8 !== 'undefined' && V8) { V8.kabakYuz = true; V8.kabakYuzSecim = { goz: k.secim.goz, burun: k.secim.burun, agiz: k.secim.agiz }; }
    k.son.bek = 2.5;
    OLAY.emit('kabakYuzBitti', { o, secim: KABAKYUZ.secim });
  } else if (!tamam) {   // yarıda kaldı (durum değişti): uçan parça yerine konur, baloncuklar söner; dönünce kaldığı turdan sürer
    if (k.ucan) { const n0 = k.tur; ky8Oturt(o); k.tur = n0 + 1; }
    else if (k.faz === 'tepki') k.tur++;
    for (const b of k.bal) b.durum = 'yok';
    k.faz = 'bekle';
  }
}
function ky8GirdiBirak() { const id = KABAKYUZ.ptr; KABAKYUZ.ptr = -1; KABAKYUZ.tus = 0; if (id >= 0 && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} } if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); }
function ky8Kullanici(o) { const k = o.ky; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
function ky8Gidikla(o, x, y) {   // kabağa dokunmak: kıkırdar, kıpırdar (yüzü varsa gözlerini kısar)
  const k = o.ky; if (k.tik > 0.35) return;
  k.tik = 1; k.sqv += 1.6; ky8IsikSac(x, y, 8, 80, KY8_ALTIN); ky8Sfx('kabakYuzKikir', 0.5);
}

// ── her kare ──
function ky8Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza girişte durur
  const k = o.ky; if (!k.aktif || P.ucus !== o) return;
  const e = k.entry;
  if (k.gT < 1 && dt > 0) {   // girişe süzülme (≈0,4 sn, minik hop)
    k.gT = Math.min(1, k.gT + dt / 0.42); const u = k.gT, h = Math.abs(k.gx0 - e.x) > 16 ? 26 : 0;
    P.x = lerp(k.gx0, e.x, smooth(u)); P.y = lerp(k.gy0, e.y, u * u) - Math.sin(u * Math.PI) * h;
    if (!Number.isFinite(P.x) || !Number.isFinite(P.y)) { P.x = e.x; P.y = e.y; k.gT = 1; }
  } else { P.x = e.x; P.y = e.y; }
  P.vx = P.vy = P.buf = 0; P.ground = true;
}
function ky8Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.ky; k.t += dt; ky8TozAdim(dt);
  // kabağın yaylı ezilmesi (parça oturunca, hoplayınca)
  k.sqv += (-260 * k.sq - 11 * k.sqv) * dt; k.sq = clamp(k.sq + k.sqv * dt, -0.3, 0.3);
  for (let i = 0; i < 3; i++) if (k.zip[i] != null && k.zip[i] < 5) k.zip[i] += dt;
  k.sevT = Math.max(0, k.sevT - dt); k.tik = Math.max(0, k.tik - dt * 1.6); k.konus = Math.max(0, k.konus - dt);
  for (let i = 0; i < 4; i++) { const h = k.fenerH[i], v = k.fener[i]; if (v !== h) { k.fener[i] = v < h ? Math.min(h, v + dt * 2.2) : Math.max(h, v - dt); if (v < 0.5 && k.fener[i] >= 0.5) { const f = KY8_FENER[i]; ky8IsikSac(ky8KX(o) + f[0], o.y - f[1] - 2, 8, 70, [f[2], '#ffffff']); ky8Sfx('parilti', 0.35); } } }
  if (o.done) { ky8SonAdim(o, dt); return; }
  if (DURUM !== 'oyun') return;
  const kx = ky8KX(o);
  if (!k.aktif && !P.ucus && P.x > o.x + KY8_AKTIF && P.x < kx + 260 && P.y > o.y - 230 && P.y < o.y + 60) ky8Aktiflestir(o);
  if (!k.aktif) {   // bekliyor: kabağın çevresinde yavaş, davetkâr ışık zerreleri
    if (Math.abs(P.x - kx) < 1400 && Math.random() < dt * 1.6) { const a = Math.random() * 6.2832; ky8Toz(0, kx + Math.cos(a) * 95, ky8TabanY(o) - 80 + Math.sin(a) * 60, 0, -14, 1.8, 6, KY8_ISIK[(Math.random() * 6) | 0]); }
    return;
  }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kabakYuz', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  const hazir = k.faz === 'sec' && k.bal[0].durum === 'bekle' && k.bal[1].durum === 'bekle' && k.bal[2].durum === 'bekle';
  if (hazir && KABAKYUZ.ptr < 0) {
    k.idle += dt; const esik = k.helpN > 0 ? KY8_YARDIM2 : KY8_YARDIM;
    if (!k.ipucuOldu && k.idle >= KY8_GOSTER) { k.ipucuOldu = true; OLAY.emit('kabakYuzIpucu', { o, n: k.tur + 1 }); }
    if (!k.helpOn && k.idle >= esik) { k.helpOn = true; k.helpT = 0; k.helpI = ky8YardimSec(o); OLAY.emit('kabakYuzYardim', { o, n: k.tur + 1 }); }
  }
  if (k.helpOn) k.helpT += dt;
  if (k.faz === 'gel') { if (k.fT >= KY8_GEL) { if (k.tur < 3) ky8TurBasla(o); else { ky8Faz(o, 'canlan'); OLAY.emit('kabakYuzCanlan', { o, secim: KABAKYUZ.secim }); ky8Sfx('kabakYuzCanlan'); } } }
  else if (k.faz === 'sec') ky8BalonAdim(o, dt);
  else if (k.faz === 'uc') { ky8BalonAdim(o, dt); ky8UcanAdim(o, dt); }
  else if (k.faz === 'tepki') { ky8BalonAdim(o, dt); ky8TepkiAdim(o, dt); }
  else if (k.faz === 'canlan') ky8CanlanAdim(o, dt);
  else if (k.faz === 'don') { if (k.fT >= KY8_DON) ky8Birak(o, true); }
  ky8PirilAdim(o, dt);
}
function ky8YardimSec(o) {   // Pırıl'ın patlatacağı baloncuk: çoğunlukla ortadaki, bazen yandakiler (her tur aynı olmasın)
  const k = o.ky; return k.tur === 1 ? 2 : k.tur === 2 ? 0 : 1;
}
function ky8BalonAdim(o, dt) {
  const k = o.ky, kx = ky8KX(o), y0 = ky8TabanY(o) - 170;
  for (let i = 0; i < 3; i++) {
    const b = k.bal[i]; if (b.durum === 'yok') continue; b.t += dt;
    const [rx, ry] = ky8Bal(o, i);
    if (b.durum === 'gel') {
      if (b.t < 0) { b.s = 0; b.x = kx; b.y = y0; continue; }
      const u = clamp(b.t / 0.95, 0, 1), e = 1 - Math.pow(1 - u, 3);
      b.x = lerp(kx, rx, e) + Math.sin(u * Math.PI) * (i - 1) * 30; b.y = lerp(y0, ry, e) - Math.sin(u * Math.PI) * 26; b.s = ky8Yay(u);
      if (u >= 1) { b.durum = 'bekle'; b.t = 0; ky8IsikSac(b.x, b.y, 5, 40, [KY8_BTON[i], '#ffffff']); }
    } else if (b.durum === 'bekle') { b.x = rx; b.y = ry; b.s = 1; }
    else if (b.durum === 'pat') { const u = clamp(b.t / 0.16, 0, 1); b.s = 1 + 0.22 * u; b.al = 1 - u; if (u >= 1) b.durum = 'yok'; }
    else if (b.durum === 'sil') {   // seçilmeyen baloncuk: kısa titreşip ışık zerrelerine dağılır
      if (b.t < 0) continue;
      const u = clamp(b.t / 0.26, 0, 1); b.s = 1 + Math.sin(u * Math.PI * 3) * 0.06 * (1 - u) - u * 0.15; b.al = 1;
      if (u >= 1) { b.durum = 'yok'; ky8Halka(b.x, b.y, KY8_BR * 0.8, KY8_BTON[i]); ky8IsikSac(b.x, b.y, 9, 90, [KY8_BTON[i], '#ffffff']); }
    }
  }
}
function ky8UcanAdim(o, dt) {   // parça parıltılı bir yayla kabağa uçar (Pırıl yardım ettiyse onu taşır)
  const k = o.ky, u0 = k.ucan; if (!u0) return;
  u0.t += dt; const [tx, ty] = ky8Yuva(o, k.tur), u = clamp(u0.t / u0.sure, 0, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  u0.x = lerp(u0.x0, tx, e) + Math.sin(u * Math.PI) * u0.yon * -26; u0.y = lerp(u0.y0, ty, e) - Math.sin(u * Math.PI) * 70;
  u0.s = lerp(u0.s0, KY8_YSP[k.tur], smooth(u)) * (1 + Math.sin(u * Math.PI) * 0.18); u0.rot = Math.sin(u * Math.PI * 2) * 0.35 * u0.yon;
  u0.izT += dt; while (u0.izT > 0.03) { u0.izT -= 0.03; ky8Toz(Math.random() < 0.3 ? 2 : 0, u0.x + (Math.random() - 0.5) * 16, u0.y + (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 30, 10 + Math.random() * 20, 0.6 + Math.random() * 0.4, 5 + Math.random() * 4, KY8_ALTIN[(Math.random() * 4) | 0]); }
  if (u >= 1) ky8Oturt(o);
}
function ky8TepkiAdim(o, dt) {   // kabağın tepkisi (çizimi ky8Poz zamana göre kurar): ara sesler + parıltılar
  const k = o.ky, t0 = k.fT - dt, t = k.fT, gec = a => t0 < a && t >= a, kx = ky8KX(o), yb = ky8TabanY(o);
  if (k.tur === 0) { if (gec(0.4) || gec(0.8)) ky8Sfx('gozKirp', 0.5); if (gec(1.1)) ky8IsikSac(kx + 50 * -k.yon, yb - 84, 5, 40, KY8_ALTIN); }
  if (k.tur === 1) { if (gec(0.3) || gec(0.75)) { k.sqv += 0.9; ky8Sfx('kabakYuzKikir', 0.35); } if (gec(0.5)) ky8IsikSac(kx, yb - 56, 6, 50, ['#ffffff', '#ffe7a8']); }
  if (k.tur === 2) { if (gec(0.35)) ky8IsikSac(kx, yb - 31, 8, 60, KY8_ALTIN); }
  if (t >= KY8_TEPKI[k.tur]) { k.tur++; if (k.tur < 3) ky8TurBasla(o); else { ky8Faz(o, 'canlan'); OLAY.emit('kabakYuzCanlan', { o, secim: KABAKYUZ.secim }); ky8Sfx('kabakYuzCanlan'); } }
}
function ky8CanlanAdim(o, dt) {   // canlanma: ışık doğar → göz kırpar, Feza'ya bakar → kahkaha → iki hop (filiz kıvrılır) → ışık tozu püskürtür → el sallar
  const k = o.ky, t0 = k.ct; k.ct += dt; const t = k.ct, gec = a => t0 < a && t >= a, kx = ky8KX(o), yb = ky8TabanY(o);
  if (t < 1.3 && Math.random() < dt * 30) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, v = 60 + Math.random() * 90; ky8Toz(0, kx + (Math.random() - 0.5) * 90, yb - 40 - Math.random() * 80, Math.cos(a) * v * 0.4, Math.sin(a) * v, 1.3, 6 + Math.random() * 5, KY8_ALTIN[(Math.random() * 4) | 0]); }
  if (gec(0.9)) { ky8Halka(kx, yb - 66, 76, '#ffe7a8'); ky8Halka(kx, yb - 66, 44, '#ffffff'); ky8IsikSac(kx, yb - 66, 20, 170, KY8_ALTIN); }
  k.ampul = clamp((t - 0.3) / 1.1, 0, 1);
  if (gec(0.4)) for (let i = 0; i < 4; i++) k.fenerH[i] = 1;
  if (gec(1.45) || gec(1.8)) ky8Sfx('gozKirp', 0.6);
  if (gec(2.15)) ky8Sfx('kabakYuzKikir', 1);
  if (t > 2.15 && t < 3.4 && Math.random() < dt * 9) ky8Toz(Math.random() < 0.4 ? 4 : 2, kx + (Math.random() - 0.5) * 120, yb - 120 - Math.random() * 40, 0, -40, 1.2, 6 + Math.random() * 3, Math.random() < 0.5 ? '#ff8fc8' : '#ffd27a');
  for (const h of KY8_HOP) if (gec(h[0] + h[1])) { k.sqv += 3.2; ky8Sfx('boing', 0.5); ky8IsikSac(kx, yb + 2, 8, 90, ['#ffe7a8', '#ffffff']); ky8Halka(kx, ky8TabanY(o) - 2, 60, '#ffd27a'); }
  for (const h of KY8_HOP) if (gec(h[0])) k.sqv -= 1.6;   // kalkışta gerilir
  if (gec(4.95)) k.sqv -= 2.2;   // nefes alır (uzar)
  if (gec(5.25)) {   // ışık tozu fıskiyesi: ağızdan göğe ve Feza'ya doğru
    k.sqv += 3; ky8Sfx('puf', 0.6); ky8Sfx('parilti', 1); ky8Halka(kx, yb - 31, 34, '#ffffff');
    for (let i = 0; i < 64; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2 - k.yon * 0.2, v = 230 + Math.random() * 260; ky8Toz(i % 4 === 0 ? 2 : 1, kx + (Math.random() - 0.5) * 30, yb - 30, Math.cos(a) * v, Math.sin(a) * v, 1.9 + Math.random() * 1.0, 7 + Math.random() * 7, KY8_ISIK[i % KY8_ISIK.length]); }
  }
  if (t > 5.8 && t < 7.8 && Math.random() < dt * 3.4) ky8Toz(4, lerp(kx, k.entry.x, 0.5) + (Math.random() - 0.5) * 60, yb - 160 - Math.random() * 30, 0, -40, 1.6, Math.random() * 6, Math.random() < 0.5 ? '#ff8fb0' : '#ffb3cf');
  if (t >= KY8_CANLAN) ky8Faz(o, 'don');
}
const KY8_HOP = [[3.45, 0.56, 30], [4.15, 0.6, 36]];   // canlanma hopları: [başlangıç sn, süre, yükseklik]
function ky8SonAdim(o, dt) {   // bitti: yerinde mutlu; yakında ara sıra hoplar, Feza giderken biraz peşinden hoplayıp el sallar
  const k = o.ky, s = k.son, kx = ky8KX(o), fx = P.rx !== undefined ? P.rx : P.x, dx = fx - kx;
  if (Math.abs(dx) > 1500) return;
  s.t += dt; s.bek -= dt; s.yap = Math.max(0, s.yap - dt * 0.6);
  const hedefOfs = dx > 170 && dx < 900 ? 24 : dx < -170 && dx > -900 ? -20 : 0;
  if (s.hop <= 0 && Math.abs(hedefOfs - s.ofs) > 4 && s.bek <= 0) { s.hop = 0.001; s.hx0 = s.ofs; s.hx1 = s.ofs + clamp(hedefOfs - s.ofs, -18, 18); s.bek = 0.25; }
  if (dx > 150 && !s.selam) { s.selam = true; s.yap = 2.2; ky8IsikSac(kx - 30, ky8TabanY(o) - 135, 6, 50, ['#9fe28a', '#ffffff']); }   // Feza geçip gidiyor: yaprakla el sallar
  if (dx < 60) s.selam = false;
  if (s.hop <= 0 && s.bek <= 0 && Math.abs(dx) < 320 && P.ground) { s.hop = 0.001; s.hx0 = s.hx1 = s.ofs; s.bek = 3.5 + Math.random() * 3; ky8Sfx('kabakYuzKikir', 0.3); }
  if (s.hop > 0) {
    s.hop += dt; const u = s.hop / 0.5;
    if (u >= 1) { s.hop = 0; s.ofs = s.hx1; k.sqv += 2.2; ky8IsikSac(kx + s.ofs, ky8TabanY(o), 4, 50, ['#ffe7a8', '#ffffff']); }
    else s.ofs = lerp(s.hx0, s.hx1, smooth(u));
  }
  if (Math.random() < dt * 0.9) ky8Toz(0, kx + s.ofs + (Math.random() - 0.5) * 80, ky8TabanY(o) - 60 - Math.random() * 60, 0, -18, 1.6, 6, KY8_ALTIN[(Math.random() * 4) | 0]);
}
function ky8PirilAdim(o, dt) {   // Pırıl'ın hedefi: Feza'nın yanı · ipucu (baloncukların arasında süzülür) · yardım (patlatır, taşır) · kutlama
  const k = o.ky, pr = k.pr, e = k.entry, kx = ky8KX(o);
  let tx = e.x + 46 * k.yon, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = k.yon;
  const ipucu = k.idle > KY8_GOSTER || k.helpOn;
  if (k.faz === 'sec') {
    const hb = k.helpOn ? k.bal[k.helpI] : null;
    if (hb && hb.durum === 'bekle') {   // yardım: baloncuğun yanına uçar, bir an bakar, burnuyla "pıt"
      const d = hb.x >= pr.x ? 1 : -1, yak = k.helpT > 1.0;
      tx = hb.x - d * (yak ? KY8_BR * 0.55 : KY8_BR + 26); ty = hb.y + (yak ? 4 : 10) + Math.sin(k.t * 3) * 3; hiz = yak ? 7 : 4.5; bak = d;
      if (yak && k.helpT > 1.5 && Math.hypot(pr.x - tx, pr.y - ty) < 22) ky8Sec(o, k.helpI, true);
    } else if (ipucu && (k.bal[0].durum === 'bekle' || k.bal[1].durum === 'bekle' || k.bal[2].durum === 'bekle')) {   // ipucu: baloncuktan baloncuğa süzülür, Feza'ya döner bakar
      const j = Math.floor(k.t / 2.2) % 3, b = k.bal[j];
      if (b.durum === 'bekle') { tx = b.x + Math.sin(k.t * 1.8) * 22; ty = b.y + KY8_BR + 22 + Math.sin(k.t * 3.1) * 5; hiz = 3; bak = Math.sin(k.t * 0.9) > 0 ? Math.sign(e.x - pr.x) || 1 : Math.sign(b.x - pr.x) || 1;
        if (Math.random() < dt * 8) ky8Toz(0, pr.x - bak * 8, pr.y + 6, -bak * 14, 6, 0.9, 5, KY8_BTON[j]); }
    } else bak = Math.sign(kx - pr.x) || 1;
  } else if (k.faz === 'uc' && k.ucan && k.ucan.pirilde) { const u = k.ucan; tx = u.x - 16 * u.yon; ty = u.y - 30; hiz = 11; bak = u.yon; }
  else if (k.faz === 'canlan' || k.faz === 'don') {
    const t = k.ct;
    if (t > 2.1 && t < 5.0) { const a = (t - 2.1) * 2.6; tx = kx + Math.sin(a) * 125; ty = ky8TabanY(o) - 200 + Math.sin(a * 2) * 26; hiz = 6; bak = Math.cos(a) > 0 ? 1 : -1; }
    else { tx = (kx + e.x) / 2; ty = e.y - 150 + Math.sin(k.t * 2.4) * 5; bak = Math.sign(kx - pr.x) || 1; }
  } else if (k.faz === 'tepki') bak = Math.sign(kx - pr.x) || 1;
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
const KY8_POZ = { secim: null, parca: 0, yanik: 0, isik: 0, canli: true, hop: 0, sq: 0, egil: 0, kirp: null, bakX: 0, bakY: 0, mutlu: 0, gul: 0, gulumse: 0, burun: 0, kivrim: 0, yaprak: 0, yanak: null, parla: 0, isin: 0, zip: null, zemin: true, alpha: 1, dans: 0 };
function ky8Poz(o, tm) {   // o anki duruma göre kabakYuzCiz seçenekleri (zamanın saf işlevi; kare başına nesne üretmez)
  const k = o.ky, q = KY8_POZ, n = (k.mask & 1) + (k.mask >> 1 & 1) + (k.mask >> 2 & 1), kx = ky8KX(o);
  q.secim = k.secim; q.parca = k.mask; q.zip = k.zip; q.canli = n > 0 || k.aktif; q.hop = 0; q.sq = k.sq; q.egil = 0; q.kirp = null; q.bakX = 0; q.bakY = 0;
  q.mutlu = 0; q.gul = 0; q.gulumse = 0; q.burun = 0; q.kivrim = 0; q.yaprak = 0; q.yanak = null; q.parla = 0; q.isin = 0; q.dans = 0;
  q.yanik = 0.12 * n; q.isik = n ? 0.42 + 0.12 * n : 0.3;   // her parçada kabak biraz daha uyanır: oyuklarda sıcak ışık
  if (!(k.mask & 1)) q.canli = false;
  if (k.tik > 0) { q.egil = Math.sin(tm * 30) * 0.06 * k.tik; q.mutlu = Math.max(q.mutlu, k.mask & 1 ? k.tik : 0); }
  const kon = k.konus > 0 && (k.mask & 4) ? Math.min(1, k.konus * 4) : 0;   // kabak konuşuyor (kb_ sesi): ağzı açılıp kapanır
  const fx = P.rx !== undefined ? P.rx : P.x, bakF = clamp((fx - kx) / 220, -1, 1);
  if (o.done) {   // bitti: ışıl ışıl; Feza'yı izler, yakında ara sıra hoplar, giderken yaprakla el sallar
    const s = k.son; q.yanik = 1; q.isik = 1; q.canli = true; q.bakX = bakF; q.bakY = 0.15;
    q.yaprak = clamp(s.yap, 0, 1); q.kivrim = 0.25 + 0.15 * Math.sin(tm * 0.7);
    if (s.hop > 0) { const u = clamp(s.hop / 0.5, 0, 1); q.hop = Math.sin(u * Math.PI) * (s.hx0 === s.hx1 ? 14 : 18); q.mutlu = 1; q.gul = 0.5; }
    q.gulumse = 0.3 + 0.2 * Math.sin(tm * 0.8); q.egil = Math.sin(tm * 1.4) * 0.03;
    if (kon) q.gul = Math.max(q.gul, 0.75 * kon);
    return q;
  }
  if (k.faz === 'sec') { const b = k.bal[(Math.floor(tm / 1.8) % 3)]; if (k.mask & 1) { q.bakY = -0.9; q.bakX = b && b.durum !== 'yok' ? clamp((b.x - kx) / 160, -1, 1) : 0; } }
  else if (k.faz === 'uc' && k.ucan) { const u = k.ucan, [ex, ey] = ky8Yuva(o, 0); q.bakX = clamp((u.x - ex) / 140, -1, 1); q.bakY = clamp((u.y - ey) / 140, -1, 1); }
  else if (k.faz === 'tepki') {
    const t = k.fT;
    if (k.tur === 0) {   // gözler: iki kez kırpar, sonra Feza'ya bakar
      q.kirp = (t > 0.4 && t < 0.55) || (t > 0.8 && t < 0.95) ? 1 : 0;
      if (t > 1.0) { const w = smooth(clamp((t - 1.0) / 0.25, 0, 1)); q.bakX = -k.yon * 0.9 * w; q.bakY = 0.25 * w; q.mutlu = t > 1.35 && t < 1.8 ? 1 : 0; }
      q.yanak = Math.min(1, t * 1.2) * 0.8;
    } else if (k.tur === 1) {   // burun: kıpır kıpır oynar, minik hıçkırık gibi hoplayışlar
      q.burun = Math.sin(clamp(t / 1.4, 0, 1) * Math.PI); q.mutlu = t > 0.9 ? 1 : 0; q.bakX = -k.yon * 0.4;
    } else {   // ağız: gülümseme kocaman gerilir
      q.gulumse = Math.sin(clamp(t / 1.0, 0, 1) * Math.PI * 0.5); q.mutlu = t > 0.45 ? 1 : 0; q.bakX = -k.yon * 0.6;
    }
  } else if (k.faz === 'canlan' || k.faz === 'don') {
    const t = k.faz === 'don' ? KY8_CANLAN : k.ct;
    const isi = smooth(clamp(t / 1.3, 0, 1)); q.yanik = lerp(0.3, 1, isi); q.isik = lerp(0.52, 1, isi);
    q.parla = t < 2.6 ? Math.sin(clamp(t / 2.6, 0, 1) * Math.PI) * (t < 1.3 ? 1 : 0.9) : 0; q.isin = t > 0.5 && t < 2.8 ? Math.sin(clamp((t - 0.5) / 2.3, 0, 1) * Math.PI) : 0;
    q.yanak = isi;
    if (t > 1.3 && t < 2.1) { q.kirp = (t > 1.45 && t < 1.6) || (t > 1.8 && t < 1.95) ? 1 : 0; q.bakX = -k.yon * smooth(clamp((t - 1.35) / 0.3, 0, 1)) * 0.9; }
    else if (t >= 2.1 && t < 3.4) { const u = t - 2.1; q.gul = 1; q.mutlu = 1; q.sq += Math.sin(u * 22) * 0.035; q.hop = Math.abs(Math.sin(u * 11)) * 5; q.egil = Math.sin(u * 5) * 0.05; }
    else if (t >= 3.4 && t < 4.9) { for (const h of KY8_HOP) { const u = (t - h[0]) / h[1]; if (u > 0 && u < 1) q.hop = Math.sin(u * Math.PI) * h[2]; } q.kivrim = smooth(clamp((t - 3.4) / 1.0, 0, 1)); q.yaprak = 0.35; q.mutlu = q.hop > 6 ? 1 : 0; q.gulumse = 0.8; }
    else if (t >= 4.9 && t < 5.8) { q.kivrim = 1; q.gul = t > 5.2 ? Math.max(0, 1 - (t - 5.25) / 0.5) : 0; q.gulumse = t < 5.2 ? 0 : 1; q.bakY = -0.6; }
    else if (t >= 5.8) { q.kivrim = lerp(1, 0.3, clamp((t - 5.8) / 2, 0, 1)); q.mutlu = ((t - 5.8) % 1.6) < 1.0 ? 1 : 0; q.yaprak = smooth(clamp((t - 5.9) / 0.4, 0, 1)) * (t < 7.7 ? 1 : 0.4); q.bakX = -k.yon * 0.8; q.egil = Math.sin((t - 5.8) * 3.2) * 0.06; q.gulumse = 1; }
  }
  if (kon) q.gul = Math.max(q.gul, 0.75 * kon);
  return q;
}
function ky8Ciz(o, tm) {   // Feza'nın arkası: sahne, fenerler, kabak
  const k = o.ky; ky8Sprite();
  const kx = ky8KX(o), yz = o.y, sp = KY8S.sahne, isi = o.done ? 1 : k.faz === 'canlan' || k.faz === 'don' ? smooth(clamp((k.faz === 'don' ? 9 : k.ct) / 1.3, 0, 1)) : 0;
  const sx = o.done ? k.son.ofs : 0;
  g.drawImage(sp, kx - sp.x0, yz - sp.y0, sp.bw, sp.bh);
  // sahneye düşen sıcak ışık
  if (isi > 0.01) { g.globalCompositeOperation = 'lighter'; ky8Glow(g, '#ffb347', kx + sx, yz - 30, 170, 46, 0.32 * isi); g.globalCompositeOperation = 'source-over'; }
  // minik fenerler
  for (let i = 0; i < 4; i++) {
    const f = KY8_FENER[i], v = k.fener[i], x = kx + f[0] + Math.sin(tm * 1.3 + i) * 0.8, y = yz - f[1] - 4 + Math.sin(tm * 1.7 + i * 2) * 0.6;
    if (v > 0.02) { g.globalCompositeOperation = 'lighter'; ky8Glow(g, f[2], x, y, 30, 30, 0.6 * v * (0.85 + 0.15 * Math.sin(tm * 3 + i))); g.globalCompositeOperation = 'source-over'; }
    if (v < 0.99) g.drawImage(KY8S.fener[0], x - 9, y - 12, 18, 24);
    if (v > 0.01) { g.globalAlpha = v; g.drawImage(KY8S.fener[i + 1], x - 9, y - 12, 18, 24); g.globalAlpha = 1; }
  }
  // ampul dizisi: canlanınca soldan sağa dalga gibi yanar, sonra tatlı tatlı göz kırpar
  const am = o.done ? 1 : k.ampul;
  for (let i = 0; i < KY8_AMPUL_N; i++) {
    const p = KY8_AMP[i], x = kx + p[0], y = yz + p[1], v = clamp(am * (KY8_AMPUL_N + 2) - i, 0, 1) * (0.75 + 0.25 * Math.sin(tm * 2.6 + i * 1.9)), col = KY8_ISIK[i % 6];
    if (v > 0.02) { g.globalCompositeOperation = 'lighter'; ky8Glow(g, col, x, y, 11, 11, 0.8 * v); g.globalCompositeOperation = 'source-over'; }
    g.fillStyle = '#4a3c5a'; g.beginPath(); g.arc(x, y, 2.6, 0, 6.2832); g.fill();
    if (v > 0.02) { g.globalAlpha = v; g.fillStyle = col; g.beginPath(); g.arc(x, y, 2.6, 0, 6.2832); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x - 0.7, y - 0.8, 0.9, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  }
  // dev kabak
  const q = ky8Poz(o, tm);
  if (k.aktif && k.faz === 'sec' && k.idle > KY8_IPUCU) ky8Glow(g, '#ffd27a', kx, ky8TabanY(o) - 66, 140, 115, 0.07 + 0.04 * Math.sin(tm * 2.4));
  kabakYuzCiz(g, kx + sx, ky8TabanY(o), 1, tm, q);
}
function ky8BalonCizKare(o, b, i, tm, vurgu) {   // baloncuk: arka ışık + içindeki parça + şeffaf baloncuk
  if (b.s <= 0.01 || b.al <= 0.01) return;
  const r = KY8_BR * b.s, a0 = b.al, ton = KY8_BTON[i];
  g.globalAlpha = a0; g.globalCompositeOperation = 'lighter';
  ky8Glow(g, ton, b.x, b.y, r * 1.45 + vurgu * 26, r * 1.45 + vurgu * 26, 0.5 + vurgu * 0.45);
  ky8Glow(g, '#ffe7a8', b.x, b.y, r * 0.8, r * 0.8, 0.35);
  g.globalCompositeOperation = 'source-over';
  const turI = KY8_TURLAR.indexOf(KY8_TUR_AD[b.ad] || 'goz'), sc = KY8_IKON[turI < 0 ? 0 : turI] * b.s * (1 + vurgu * 0.08);
  ky8ParCiz(g, b.ad, b.x, b.y + Math.sin(tm * 1.9 + i) * 1.5, sc, sc, Math.sin(tm * 1.3 + i * 2) * 0.1, 1, a0);
  const sp = KY8S.balon[i], N = (KY8_BR + 4) * 2 * b.s * (1 + vurgu * 0.05), M = g.getTransform();
  g.translate(b.x, b.y); g.rotate(Math.sin(tm * 0.6 + i) * 0.25); g.globalAlpha = a0; g.drawImage(sp, -N / 2, -N / 2, N, N); g.setTransform(M); g.globalAlpha = 1;
}
const KY8_TUR_AD = {}; for (const tur of KY8_TURLAR) for (const ad of KY8_SECENEK[tur]) KY8_TUR_AD[ad] = tur;
function ky8CizOn(o, tm) {
  const k = o.ky;
  if (k.aktif && P.ucus === o) {
    // Feza: girişte, kabağa dönük; parça oturunca ve canlanmada sevinir
    const sevinc = k.sevT > 0.2 || (k.faz === 'canlan' && k.ct > 2.1) || k.faz === 'don';
    if (typeof fezaCizPoz === 'function') { g.save(); try { if (k.yon < 0) { g.translate(P.x, 0); g.scale(-1, 1); g.translate(-P.x, 0); } fezaCizPoz(g, P.x, P.y, 1, sevinc ? 'sevinc' : 'ayakta_yan', tm, null, KY8_FZ_OPT); } catch (e) {} finally { g.restore(); } }
  }
  // baloncuklar ve uçan parça
  if (k.aktif) {
    const ipucu = k.faz === 'sec' && k.idle > KY8_IPUCU;
    for (let i = 0; i < 3; i++) {
      const b = k.bal[i]; if (b.durum === 'yok') continue;
      let vurgu = ipucu && b.durum === 'bekle' ? Math.max(0, Math.sin(tm * 3 - i * 1.4)) * 0.8 : 0;
      if (KABAKYUZ.klavye && b.durum === 'bekle' && k.secK === i) vurgu = Math.max(vurgu, 0.7 + 0.2 * Math.sin(tm * 5));
      if (k.helpOn && k.helpI === i && b.durum === 'bekle') vurgu = Math.max(vurgu, 0.5 + 0.3 * Math.sin(tm * 6));
      ky8BalonCizKare(o, b, i, tm, vurgu);
    }
    const u = k.ucan;
    if (u) { g.globalCompositeOperation = 'lighter'; ky8Glow(g, '#ffd27a', u.x, u.y, 46 * u.s, 46 * u.s, 0.6); g.globalCompositeOperation = 'source-over'; ky8ParCiz(g, u.ad, u.x, u.y, u.s, u.s, u.rot, 1, 1); }
  }
  // Pırıl (baloncukların önünde: yardımda burnuyla dokunur)
  if (k.aktif && P.ucus === o && typeof pirilCizPoz === 'function') {
    const pr = k.pr, kirp = (k.faz === 'canlan' && k.ct > 2.1) || k.sevT > 0.5 || k.faz === 'don';
    g.save(); try { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, kirp ? 'goz_kirp' : 'ucus', tm); } catch (e) {} finally { g.restore(); }
  }
  ky8TozCiz(g);
}
const KY8_FZ_OPT = { ruzgar: 0.1 };

// ── girdi: dokunuş baloncuğu seçer (cömert hedef); kabağa dokunmak kıkırdatır (pencere yakalama evresi: motorun yürüme parmağına gitmez) ──
function ky8Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function ky8Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function ky8BalonBul(o, p) {   // dokunulan yere en yakın bekleyen baloncuk: içine ya da yakınına (≥ 44 CSS px pay)
  const k = o.ky, pay = Math.max(KY8_BR * 1.45, 44 * DPR / Math.max(S, 0.001)); let en = -1, ed = 1e9;
  for (let i = 0; i < 3; i++) { const b = k.bal[i]; if (!ky8Secilir(b)) continue; const d = Math.hypot(b.x - p.x, b.y - p.y); if (d < ed) { ed = d; en = i; } }
  if (en < 0) return -1;
  if (ed < pay) return en;
  const kx = ky8KX(o), ust = p.y < ky8TabanY(o) - 190 && Math.abs(p.x - kx) < 330;   // kabağın üstündeki geniş bölge: en yakın baloncuk
  return ust || ed < KY8_BR * 2.6 ? en : -1;
}
function ky8KabakUstunde(o, p) { const kx = ky8KX(o), yb = ky8TabanY(o); return Math.abs(p.x - kx) < KY8_W * 0.55 && p.y > yb - 168 && p.y < yb + 10; }
addEventListener('pointerdown', e => {
  const o = KABAKYUZ.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === KABAKYUZ.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  ky8Sahip(e); const k = o.ky; if (KABAKYUZ.ptr >= 0) return;
  const p = ky8Dunya(e);
  KABAKYUZ.ptr = e.pointerId; KABAKYUZ.klavye = false;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  ky8Kullanici(o);
  if (k.faz === 'sec') { const i = ky8BalonBul(o, p); if (i >= 0) { ky8Sec(o, i, false); return; } }
  if (ky8KabakUstunde(o, p)) ky8Gidikla(o, p.x, p.y);
  else { ky8IsikSac(p.x, p.y, 5, 50, ['#ffffff', '#ffe7a8', '#c39bff']); }   // boşluğa dokunuş: minik parıltı (her dokunuş bir şey yapsın)
}, true);
addEventListener('pointermove', e => { if (KABAKYUZ.aktif && e.pointerId === KABAKYUZ.ptr) ky8Sahip(e); }, true);
function ky8BirakE(e) { if (!KABAKYUZ.aktif || e.pointerId !== KABAKYUZ.ptr) return; ky8Sahip(e); ky8GirdiBirak(); }
addEventListener('pointerup', ky8BirakE, true); addEventListener('pointercancel', ky8BirakE, true);
cv.addEventListener('lostpointercapture', e => { if (e.pointerId === KABAKYUZ.ptr) ky8GirdiBirak(); });
addEventListener('blur', () => { if (KABAKYUZ.ptr >= 0 || KABAKYUZ.tus) ky8GirdiBirak(); });
addEventListener('pagehide', () => { if (KABAKYUZ.ptr >= 0 || KABAKYUZ.tus) ky8GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && (KABAKYUZ.ptr >= 0 || KABAKYUZ.tus)) ky8GirdiBirak(); });
addEventListener('keydown', e => {
  const o = KABAKYUZ.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  ky8Sahip(e); const k = o.ky; ky8Kullanici(o);
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') { if (KABAKYUZ.klavye) k.secK = (k.secK + 2) % 3; KABAKYUZ.klavye = true; }
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') { if (KABAKYUZ.klavye) k.secK = (k.secK + 1) % 3; KABAKYUZ.klavye = true; }
  else if (!e.repeat && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) { if (k.faz === 'sec' && !ky8Sec(o, k.secK, false)) { KABAKYUZ.klavye = true; } else if (k.faz !== 'sec') ky8Gidikla(o, ky8KX(o), ky8TabanY(o) - 80); }
}, true);
OLAY.on('konusma', e => { const o = KABAKYUZ.o; if (o && o.ky && e && typeof e.anahtar === 'string' && /^kb_/.test(e.anahtar)) o.ky.konus = clamp(+e.sure || 2, 0.5, 6); });   // kabağın kendi sesi (CORE): ağız oynar
OLAY.on('durum', d => { if (d === 'oyun') return; const o = KABAKYUZ.aktif; if (o && d !== 'mola' && d !== 'duraklat') ky8Birak(o, false); ky8GirdiBirak(); });

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" (Feza solda, yakın) kadrajı ezer. Kabak etkinliğinde dikkat kadrajı geçerli olsun
// (oyun.js'te Bölüm 5 volkanMini / Bölüm 7 kardanMini için yapılan istisnanın aynısı). CORE oyun.js'e istisna eklerse bu sarmalayıcı zararsızdır.
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.ky8Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'kabakYuzMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.ky8Sarili = true; if (f.kdSarili) s.kdSarili = true;
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('kabakYuzMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js: o.tk.bitti ile de açılır (CORE kabakYuzMini'yi eklemeden önce de çalışsın)
    o.ky = { aktif: false, faz: 'bekle', fT: 0, t: 0, tur: 0, mask: 0, secim: { goz: null, burun: null, agiz: null }, zip: [null, null, null],
      bal: [0, 1, 2].map(i => ({ i, durum: 'yok', t: 0, x: 0, y: 0, s: 0, al: 1, ad: 'yuvarlak' })), ucan: null, idle: 0, helpOn: false, helpT: 0, helpN: 0, helpI: 1,
      entry: { x: o.x + KY8_AKTIF, y: o.y, safeX: o.x + KY8_AKTIF, safeY: o.y, f: 1 }, gx0: 0, gy0: 0, gT: 1, pr: { x: o.x - 300, y: o.y - 130, f: 1 }, yon: 1, secK: 1,
      sevT: 0, tik: 0, konus: 0, sq: 0, sqv: 0, ct: 0, ampul: 0, fener: [0, 0, 0, 0], fenerH: [0, 0, 0, 0], bitti: false, basladi: false, kameraFn: null,
      son: { t: 0, bek: 0, hop: 0, hx0: 0, hx1: 0, ofs: 0, yap: 0, selam: false } };
    o.ky.kameraFn = typeof omDkEkle === 'function' ? () => { const e = o.ky.entry; omDkEkle(Math.min(o.x - 250, e.x - 55), o.y - 410, Math.max(ky8KX(o) + 215, e.x + 55), o.y + 22); } : null;
    o.adim = dt => ky8Adim(o, dt);
    KABAKYUZ.o = o; ky8Sprite();
  },
  guncelle: ky8Guncelle, ciz: ky8Ciz, cizOn: ky8CizOn
});
