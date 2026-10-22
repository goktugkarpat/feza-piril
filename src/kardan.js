/* kardan.js – Bölüm 7 (Kuzey Işıkları) mini oyun A: KARDAN ADAM YAPMA (önek kd), nesne türü 'kardanMini'.
   Feza karlı açıklığa yaklaşınca kadraj yumuşakça yerleşir (B5 Anka etkinliği gibi: P.ucus = o ile fizik devralınır, Feza'yı ve
   Pırıl'ı bu dosya çizer). Karda küçük bir kar topu belirir; Feza parmağını nereye sürüklerse sürüklesin top o yönde YUVARLANIR
   ve BÜYÜR (döner, karda iz bırakır, yerden kar yapışır). Yeterince büyüyünce parlar ve yerine kendiliğinden kayar; ikinci (orta)
   ve üçüncü (küçük) top da aynı şekilde yapılır, yığına yaklaşınca zıplayıp "tık" diye üstüne oturur. Sonra etraftan uçarak
   gelen parçalar (şapka, kömür gözler, havuç burun, kömür gülümseme, düğmeler, dal kollar, kırmızı atkı) havada süzülür; hangisine
   dokunulursa uçup yerine oturur (yanlış yer yok, sıra serbest). Son parçada kardan adam CANLANIR: gözleri parlar ve kırpar,
   kollarını kıpırdatır, üstündeki karı silkeler, küçük bir dans yapar, Feza'nın yanına hoplayıp el sallar; yola katılır.
   Kaybetme/yanlış/yazı/öğretici el yok. İpucu ışıkla: top ve sıradaki parça parlar, Pırıl yanına uçup yön gösterir.
   ~25 sn dokunulmazsa (sonrakilerde ~12 sn) Pırıl kendisi yardım eder: topu burnuyla iterek yuvarlar, parçaları taşıyıp yerleştirir;
   çocuk dokununca yardım bırakır. Asla takılmaz. Klavye yedeği: ←/→ (A/D) topu yuvarlar, Boşluk/Enter/E itip/parça yerleştirir.
   Bitince V7.kardan = true, o.done = true, OLAY 'kardanBitti'. Ara olaylar: 'kardanBasla' {o}, 'kardanTop' {o, n} (n = 1..3),
   'kardanParca' {o, ad, n}, 'kardanCanlan' {o}. Kapı (kapi.js miniKapi) o.done ile açılır.
   Ortak çizici: kardanCiz(c, x, y, s, t, o) — x,y kardan adamın tabanı (zemin), s ölçek (1 ≈ 150 birim boy), t saniye;
     o: { poz: 'dur'|'dans'|'yuru'|'kay', yon: ±1, sallan: 0..1 (el sallama), goz: 0..1 (verilmezse kendisi kırpar), mutlu (gülen
     kapalı gözler), silk: 0..1 (kar silkeleme), egil: -1..1, faz (yürüyüş/hop fazı), toplar: 1..3, parca: bit maskesi (verilmezse
     hepsi), canli (false: düz kömür gözler, kıpırtısız), alpha }. Karede gradyan/filtre yok; bütün parçalar önbellekli sprite.
   Takipçi: bitince dünya nesnesi 'kardanTakip' (KARDAN.takipci) Feza'nın arkasından hoplayarak/kayarak gelir. Dışa açık alanlar:
     KARDAN.takipci.x/y/yon/poz (okunur), .gizle = true (çizme; P.ucus başka bir nesnedeyken de kendiliğinden gizlenir, ör. kızak),
     .hedef = {x, y} (başkası bir yere çağırır; null → Feza'yı izler), .dans = true (dans eder; V7.final iken de kendiliğinden).
     KARDAN.dansEt(x, y) kısayoldur. Kızak/final kendi çizecekse .gizle = true yapıp kardanCiz'i kullanabilir.
   Yerleşim (bolum7.js): nesne('kardanMini', c, yuzey(c)) — o.x kardan adamın yapılacağı yer; o.x-430 … o.x+260 arası DÜZ zemin olmalı
     (yuvarlama alanı o.x-330 … o.x+230; Feza o.x-420 civarında yaklaşınca etkinlik başlar). Hemen ilerisine miniKapi (bagId). */
'use strict';
const KD_R = [33, 25, 18];                       // büyük, orta, küçük top yarıçapı (s = 1)
const KD_CY = (() => { const c0 = -(KD_R[0] - 3), c1 = c0 - (KD_R[0] + KD_R[1]) * 0.8, c2 = c1 - (KD_R[1] + KD_R[2]) * 0.82; return [c0, c1, c2]; })();   // yığında top merkezleri (tabana göre)
const KD_R0 = 13;                                // yeni doğan kar topu (ekranda seçilecek kadar iri)
const KD_YOL = [680, 520, 400];                  // tam boy için yuvarlanacak yol (birim; dikey sürükleme de sayılır)
const KD_SITE = 60, KD_SOL = -330, KD_SAG = 230;  // kardan adamın yeri ve yuvarlama alanı (o.x'e göre)
const KD_DOGUS = [-150, -190, -165];             // topların belirdiği yer (o.x'e göre)
const KD_AKTIF = 420;                            // Feza o.x - 420'yi geçince etkinlik başlar
const KD_GEL = 0.9, KD_TAM = 0.5, KD_ZIP = 0.62, KD_OTUR = 0.45, KD_CANLAN = 8.8, KD_DON = 0.8;
const KD_IPUCU = 3.5, KD_GOSTER = 6, KD_YARDIM = 25, KD_YARDIM2 = 12;
const KD_PS = 1.75;                              // havada bekleyen parçanın ölçeği (5 yaş: iri ve kolay seçilir; yerine uçarken 1'e küçülür)
const KD_TAKIP_S = 0.92, KD_TAKIP_ARA = 180;     // takipçinin ölçeği ve Feza'nın ne kadar arkasında durduğu
// parçalar: ad, bit, havada süzüleceği yer (yere göre), uçacağı yer (kardan adam içinde, tabana göre), renk (ışık)
const KD_PARCA = [
  { ad: 'sapka', bit: 1, fx: -14, fy: -232, tx: 0, ty: KD_CY[2] - KD_R[2] * 0.62, renk: '#ff9fb4' },
  { ad: 'gozler', bit: 2, fx: -104, fy: -186, tx: 2.5, ty: KD_CY[2] - 4, renk: '#c9d8ff' },
  { ad: 'burun', bit: 4, fx: 104, fy: -186, tx: 4.5, ty: KD_CY[2] + 1.5, renk: '#ffc27a' },
  { ad: 'agiz', bit: 8, fx: -132, fy: -116, tx: 3, ty: KD_CY[2] + 8.5, renk: '#c9d8ff' },
  { ad: 'atki', bit: 64, fx: 146, fy: -122, tx: 0, ty: KD_CY[2] + KD_R[2] * 0.86, renk: '#ff8fa3' },
  { ad: 'dugme', bit: 16, fx: -116, fy: -42, tx: 1, ty: KD_CY[1], renk: '#c9d8ff' },
  { ad: 'kollar', bit: 32, fx: 116, fy: -42, tx: 0, ty: KD_CY[1] - 5, renk: '#e8c39a' }];
const KD_TUM = 127;
const KD_BOS = {};
const KD_KAR = ['#ffffff', '#eef3ff', '#dfe8ff'];
const KD_ISIK = ['#bff4ff', '#e2ccff', '#ffd6f2', '#ffffff', '#c8ffe4'];
const KARDAN = {
  o: null, ptr: -1, px: 0, py: 0, ox: 0, oy: 0, yol: 0, pt: 0, tus: 0, takipci: null,
  get aktif() { const o = this.o; return o && o.kd && o.kd.aktif && !o.done ? o : null; },
  dansEt(x, y) { const t = this.takipci; if (!t) return false; t.hedef = x == null ? null : { x, y }; t.dans = true; return true; }
};
function kdSfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function kdCv(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function kdGlow(c, col, x, y, r, a) { if (a <= 0.003) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }

// ── önbellekli sprite'lar (ilk kullanımda bir kez üretilir) ──
const KDS = { hazir: false };
const KD_TR = 96;   // top sprite'ının referans yarıçapı (px)
function kdSprite() {
  if (KDS.hazir) return; KDS.hazir = true;
  const r = rng(7707);
  // kar topu gövdesi (sabit gölgelendirme): pamuk gibi hafif tümsekli kenar, ay ışığı (sol üst) → lila gölge (sağ alt), kuzey ışığı kenar parıltısı
  { const N = KD_TR * 2 + 24, cv = KDS.top = kdCv(N, N), q = cv.getContext('2d'); q.translate(N / 2, N / 2);
    const kenar = (k, sc) => { q.beginPath(); for (let i = 0; i <= 96; i++) { const a = i / 96 * 6.2832, rr = KD_TR * sc * (1 + 0.016 * Math.sin(a * 7 + 1) + 0.011 * Math.sin(a * 13 + 2.3) + 0.007 * Math.sin(a * 23 + k)); i ? q.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : q.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } q.closePath(); };
    const gr = q.createRadialGradient(-KD_TR * 0.34, -KD_TR * 0.4, KD_TR * 0.08, -KD_TR * 0.1, -KD_TR * 0.1, KD_TR * 1.32);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.32, '#f7f9ff'); gr.addColorStop(0.6, '#e2e8fb'); gr.addColorStop(0.82, '#c3cbee'); gr.addColorStop(1, '#a2a9dc');
    kenar(0, 1); q.fillStyle = gr; q.fill();
    q.save(); kenar(0, 1); q.clip();
    const ga = q.createRadialGradient(KD_TR * 0.15, KD_TR * 1.15, KD_TR * 0.1, KD_TR * 0.15, KD_TR * 1.15, KD_TR * 0.75);   // alttan yansıyan kar ışığı
    ga.addColorStop(0, 'rgba(236,242,255,0.55)'); ga.addColorStop(1, 'rgba(236,242,255,0)'); q.fillStyle = ga; q.fillRect(-KD_TR, 0, KD_TR * 2, KD_TR * 1.2);
    for (let i = 0; i < 70; i++) { const a = r() * 6.2832, d = Math.sqrt(r()) * KD_TR * 0.95; q.fillStyle = i % 3 ? 'rgba(150,160,215,0.10)' : 'rgba(255,255,255,0.5)'; q.beginPath(); q.arc(Math.cos(a) * d, Math.sin(a) * d, 1 + r() * 2.2, 0, 6.2832); q.fill(); }
    q.restore();
    q.lineWidth = 3; q.strokeStyle = 'rgba(96,86,170,0.32)'; kenar(0, 0.99); q.stroke();
    q.lineWidth = 5; q.strokeStyle = 'rgba(175,240,255,0.5)'; q.beginPath(); q.arc(0, 0, KD_TR - 3, -0.15, 1.25); q.stroke();      // kuzey ışığı yansıması (camgöbeği)
    q.lineWidth = 3; q.strokeStyle = 'rgba(255,196,232,0.35)'; q.beginPath(); q.arc(0, 0, KD_TR - 2.5, 1.25, 2.3); q.stroke();     // pembe
    for (let i = 0; i < 9; i++) { const a = -2.6 + r() * 1.5, d = KD_TR * (0.35 + r() * 0.45); q.fillStyle = '#ffffff'; q.globalAlpha = 0.7 + r() * 0.3; q.beginPath(); q.arc(Math.cos(a) * d, Math.sin(a) * d, 1.4 + r() * 1.6, 0, 6.2832); q.fill(); }   // ışıltılar
    q.globalAlpha = 1; }
  // dönen yüzey: tümsekler ve kar tanecikleri (top yuvarlanınca bunlar döner)
  { const N = KD_TR * 2 + 24, cv = KDS.doku = kdCv(N, N), q = cv.getContext('2d'); q.translate(N / 2, N / 2);
    q.save(); q.beginPath(); q.arc(0, 0, KD_TR * 0.94, 0, 6.2832); q.clip();
    for (let i = 0; i < 16; i++) { const a = r() * 6.2832, d = Math.sqrt(r()) * KD_TR * 0.82, x = Math.cos(a) * d, y = Math.sin(a) * d, s = 7 + r() * 11;
      q.fillStyle = 'rgba(130,140,205,0.16)'; q.beginPath(); q.ellipse(x + s * 0.25, y + s * 0.3, s, s * 0.72, a, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.62)'; q.beginPath(); q.ellipse(x - s * 0.1, y - s * 0.12, s * 0.82, s * 0.58, a, 0, 6.2832); q.fill(); }
    for (let i = 0; i < 46; i++) { const a = r() * 6.2832, d = Math.sqrt(r()) * KD_TR * 0.9; q.fillStyle = i % 2 ? 'rgba(120,130,200,0.2)' : 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(Math.cos(a) * d, Math.sin(a) * d, 0.8 + r() * 1.6, 0, 6.2832); q.fill(); }
    q.restore(); }
  // gölge
  { const cv = KDS.golge = kdCv(128, 32), q = cv.getContext('2d'); q.translate(64, 16); q.scale(1, 0.25);
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 64); gr.addColorStop(0, 'rgba(58,48,120,0.55)'); gr.addColorStop(0.6, 'rgba(58,48,120,0.22)'); gr.addColorStop(1, 'rgba(58,48,120,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 64, 0, 6.2832); q.fill(); }
  // kömür (göz, ağız, düğme): ref çap 24 px
  { const cv = KDS.komur = kdCv(32, 32), q = cv.getContext('2d'); q.translate(16, 16);
    const gr = q.createRadialGradient(-3, -4, 1, 0, 0, 12); gr.addColorStop(0, '#5c5878'); gr.addColorStop(0.45, '#2a2540'); gr.addColorStop(1, '#141022');
    q.fillStyle = gr; q.beginPath(); q.moveTo(-11, -2); q.lineTo(-6, -10); q.lineTo(4, -11); q.lineTo(11, -4); q.lineTo(10, 6); q.lineTo(3, 11); q.lineTo(-7, 10); q.lineTo(-11, 4); q.closePath(); q.fill();
    q.fillStyle = 'rgba(160,170,230,0.45)'; q.beginPath(); q.moveTo(-8, -3); q.lineTo(-4, -8); q.lineTo(2, -8); q.lineTo(-3, -4); q.closePath(); q.fill(); }
  // havuç: taban (4,16), uç (74,17); ref uzunluk 70 px
  { const cv = KDS.havuc = kdCv(80, 32), q = cv.getContext('2d');
    const gr = q.createLinearGradient(0, 4, 0, 28); gr.addColorStop(0, '#ffc066'); gr.addColorStop(0.5, '#ff9535'); gr.addColorStop(1, '#e8641f');
    q.fillStyle = gr; q.beginPath(); q.moveTo(4, 5); q.quadraticCurveTo(40, 8, 75, 16); q.quadraticCurveTo(40, 25, 4, 27); q.quadraticCurveTo(0, 16, 4, 5); q.fill();
    q.strokeStyle = '#d0561c'; q.lineWidth = 1.6; q.lineCap = 'round';
    for (const [x, h] of [[16, 8], [30, 6], [44, 4.5], [57, 3]]) { q.beginPath(); q.moveTo(x, 16 - h); q.quadraticCurveTo(x + 3, 16, x, 16 + h * 0.6); q.stroke(); }
    q.strokeStyle = 'rgba(255,230,180,0.85)'; q.lineWidth = 2; q.beginPath(); q.moveTo(8, 9); q.quadraticCurveTo(36, 10, 64, 15); q.stroke(); }
  // dal kol: kök (6,26), uç (112,12); ref uzunluk 106 px; üstünde kar
  { const cv = KDS.dal = kdCv(124, 44), q = cv.getContext('2d'); q.lineCap = 'round'; q.lineJoin = 'round';
    const dal = (w, col) => { q.strokeStyle = col; q.lineWidth = w; q.beginPath(); q.moveTo(6, 26); q.quadraticCurveTo(52, 25, 112, 12); q.stroke();
      q.lineWidth = w * 0.62; q.beginPath(); q.moveTo(70, 21); q.quadraticCurveTo(84, 10, 92, 3); q.stroke(); q.beginPath(); q.moveTo(86, 17); q.quadraticCurveTo(100, 22, 114, 28); q.stroke();
      q.lineWidth = w * 0.5; q.beginPath(); q.moveTo(40, 24); q.quadraticCurveTo(46, 14, 50, 9); q.stroke(); };
    dal(8, '#4b3330'); dal(5, '#7a5242'); q.strokeStyle = 'rgba(214,170,140,0.6)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(10, 24); q.quadraticCurveTo(52, 22, 108, 11); q.stroke();
    q.fillStyle = '#f4f7ff'; for (const [x, y, s] of [[30, 21, 4], [58, 18, 4.5], [88, 1.5, 3], [100, 13, 3.4], [47, 9, 2.6]]) { q.beginPath(); q.ellipse(x, y, s * 1.5, s * 0.8, -0.15, 0, 6.2832); q.fill(); } }
  // atkı: sarma bandı (ref genişlik 120 px, merkez 65,20) ve sarkan uç (kök 20,6; ref boy 92 px)
  const atkiCiz = (q, w, h) => { q.fillStyle = '#e8475f'; q.fill(); q.save(); q.clip();
    q.fillStyle = '#b8304b'; q.fillRect(-w, h * 0.25, w * 3, h);
    q.fillStyle = '#ffe4ea'; for (let i = -6; i < 12; i++) { const x = i * 22; q.beginPath(); q.moveTo(x, -20); q.lineTo(x + 8, -20); q.lineTo(x + 8 + 40, 140); q.lineTo(x + 40, 140); q.closePath(); q.fill(); }
    q.strokeStyle = 'rgba(120,20,50,0.18)'; q.lineWidth = 1; for (let y = 2; y < h; y += 4) { q.beginPath(); q.moveTo(-w, y); q.lineTo(w * 2, y); q.stroke(); }
    q.restore(); };
  { const cv = KDS.atki = kdCv(130, 40), q = cv.getContext('2d');
    q.beginPath(); q.moveTo(6, 10); q.quadraticCurveTo(65, 24, 124, 10); q.quadraticCurveTo(128, 22, 122, 30); q.quadraticCurveTo(65, 42, 8, 30); q.quadraticCurveTo(2, 22, 6, 10); q.closePath(); atkiCiz(q, 130, 40);
    q.fillStyle = 'rgba(255,255,255,0.35)'; q.beginPath(); q.moveTo(14, 13); q.quadraticCurveTo(65, 25, 116, 13); q.quadraticCurveTo(65, 21, 14, 13); q.fill(); }
  { const cv = KDS.atkiUc = kdCv(40, 110), q = cv.getContext('2d');
    q.beginPath(); q.moveTo(11, 4); q.lineTo(29, 4); q.quadraticCurveTo(33, 50, 29, 92); q.lineTo(10, 94); q.quadraticCurveTo(6, 50, 11, 4); q.closePath(); atkiCiz(q, 40, 110);
    q.strokeStyle = '#e8475f'; q.lineWidth = 2.4; q.lineCap = 'round'; for (let i = 0; i < 5; i++) { const x = 11.5 + i * 4.2; q.beginPath(); q.moveTo(x, 92); q.lineTo(x + (i - 2) * 0.8, 104); q.stroke(); }
    q.fillStyle = '#c23552'; q.beginPath(); q.ellipse(20, 8, 11, 6, 0, 0, 6.2832); q.fill(); }
  // bere: kırmızı-beyaz çizgili, kıvrık kenarlı, ponponlu (taban ortası 65,104; ref genişlik 118 px)
  { const cv = KDS.sapka = kdCv(130, 120), q = cv.getContext('2d');
    q.beginPath(); q.moveTo(12, 92); q.bezierCurveTo(10, 30, 120, 30, 118, 92); q.closePath();
    q.fillStyle = '#e8475f'; q.fill(); q.save(); q.clip();
    q.fillStyle = '#fff1f4'; q.fillRect(0, 50, 130, 11); q.fillRect(0, 70, 130, 9);
    q.fillStyle = 'rgba(110,20,50,0.2)'; q.beginPath(); q.ellipse(92, 70, 34, 40, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.35)'; q.beginPath(); q.ellipse(42, 54, 20, 26, -0.4, 0, 6.2832); q.fill();
    q.restore();
    q.fillStyle = '#f4eef5'; q.beginPath(); q.moveTo(6, 86); q.quadraticCurveTo(65, 76, 124, 86); q.lineTo(124, 102); q.quadraticCurveTo(65, 110, 6, 102); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(160,140,190,0.55)'; q.lineWidth = 1.4; for (let i = 0; i < 14; i++) { const x = 12 + i * 8.2; q.beginPath(); q.moveTo(x, 84 - Math.sin(i / 13 * Math.PI) * 4); q.lineTo(x, 102 + Math.sin(i / 13 * Math.PI) * 3); q.stroke(); }
    for (let i = 0; i < 9; i++) { const a = i / 9 * 6.2832; q.fillStyle = i % 2 ? '#ffffff' : '#eef0fa'; q.beginPath(); q.arc(65 + Math.cos(a) * 9, 22 + Math.sin(a) * 9, 8, 0, 6.2832); q.fill(); }
    q.fillStyle = '#ffffff'; q.beginPath(); q.arc(63, 20, 9, 0, 6.2832); q.fill(); q.fillStyle = 'rgba(170,175,220,0.5)'; q.beginPath(); q.arc(69, 27, 6, 0, 6.2832); q.fill(); }
  // iz şeridi parçası: bastırılmış kar (ref 64×16 px)
  { const cv = KDS.iz = kdCv(64, 16), q = cv.getContext('2d'); q.translate(32, 8); q.scale(1, 0.22);
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 32); gr.addColorStop(0, 'rgba(150,158,215,0.55)'); gr.addColorStop(0.7, 'rgba(150,158,215,0.32)'); gr.addColorStop(1, 'rgba(150,158,215,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 32, 0, 6.2832); q.fill(); }
}
function kdTopCiz(c, x, y, r, a) {   // tek kar topu: sabit gölgelendirme + dönen yüzey
  const h = r * (KD_TR + 12) / KD_TR;
  c.drawImage(KDS.top, x - h, y - h, 2 * h, 2 * h);
  const ca = Math.cos(a), sa = Math.sin(a), M = c.getTransform();
  c.transform(ca, sa, -sa, ca, x, y); c.drawImage(KDS.doku, -h, -h, 2 * h, 2 * h); c.setTransform(M);
}
function kdKomur(c, x, y, d) { c.drawImage(KDS.komur, x - d * 0.667, y - d * 0.667, d * 1.333, d * 1.333); }
function kdKalp(c, x, y, s, col) {
  c.fillStyle = col; c.beginPath(); c.moveTo(x, y + s * 0.9);
  c.bezierCurveTo(x - s * 1.3, y - s * 0.1, x - s * 0.6, y - s * 1.1, x, y - s * 0.35);
  c.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.3, y - s * 0.1, x, y + s * 0.9); c.fill();
}
function kdDal(c, x, y, a, sol, uz) {   // kök (x,y), açı a (0 = yatay dışa, eksi = yukarı); sol: aynalı
  const k = uz / 106, M = c.getTransform();
  c.translate(x, y); if (sol) c.scale(-1, 1); c.rotate(a); c.drawImage(KDS.dal, -6 * k, -26 * k, 124 * k, 44 * k); c.setTransform(M);
}

// ── ortak çizici ──
function kardanCiz(c, x, y, s, t, o) {
  kdSprite(); o = o || KD_BOS; t = t || 0;
  const poz = o.poz || 'dur', canli = o.canli !== false, top = o.toplar == null ? 3 : clamp(o.toplar | 0, 0, 3), m = o.parca == null ? KD_TUM : o.parca;
  const al = o.alpha == null ? 1 : clamp(o.alpha, 0, 1); if (al <= 0.01 || top <= 0) return;
  const ph = o.faz != null ? o.faz : t;
  let hop = 0, sq = 0, tilt = 0, sway = 0, kafa = 0, aR = -0.42, aL = -0.42, atk = Math.sin(t * 1.7) * 0.06, sapE = -0.12, pom = 0;
  if (canli) { aR += Math.sin(t * 1.3) * 0.05; aL += Math.sin(t * 1.3 + 1.7) * 0.05; sq = Math.sin(t * 2.1) * 0.012; }
  if (poz === 'dans') {
    const q = t * 4.6, h = Math.abs(Math.sin(q));
    hop = h * 13; sq = h < 0.22 ? (0.22 - h) * 0.4 : -h * 0.035; tilt = Math.sin(q * 0.5) * 0.14; kafa = Math.sin(q * 0.5 + 0.6) * 3;
    aR = -1.0 + Math.sin(t * 9) * 0.42; aL = -1.0 - Math.sin(t * 9) * 0.42; atk = Math.sin(q * 0.5 + 1) * 0.4; sapE = -0.12 + Math.sin(q * 0.5 + 0.3) * 0.12; pom = h;
  } else if (poz === 'yuru') {
    const q = ph * 7.2, h = Math.abs(Math.sin(q));
    hop = h * 8; sq = h < 0.2 ? (0.2 - h) * 0.35 : -h * 0.03; tilt = 0.06 + Math.sin(q) * 0.03;
    aR = -0.3 + Math.sin(q) * 0.25; aL = -0.3 - Math.sin(q) * 0.25; atk = 0.25 + Math.sin(q) * 0.15; kafa = Math.sin(q + 0.8) * 1.2; pom = h * 0.7;
  } else if (poz === 'kay') {
    tilt = -0.09 + Math.sin(t * 3.1) * 0.03; aR = 0.05 + Math.sin(t * 6.3) * 0.12; aL = 0.05 - Math.sin(t * 5.7) * 0.12;
    atk = 1.05 + Math.sin(t * 13) * 0.12; sapE = -0.22; kafa = -1;
  }
  if (o.kipir) { const w = clamp(o.kipir, 0, 1); aR = lerp(aR, -0.6 + Math.sin(t * 13) * 0.5, w); aL = lerp(aL, -0.6 + Math.sin(t * 13 + 2) * 0.5, w); }
  if (o.silk) { const w = clamp(o.silk, 0, 1); sway = Math.sin(t * 44) * 4.4 * w; tilt += Math.sin(t * 44 + 1.2) * 0.05 * w; aR += Math.sin(t * 40) * 0.5 * w; aL -= Math.sin(t * 40) * 0.5 * w; pom = Math.max(pom, w); }
  if (o.sallan) { const w = smooth(clamp(o.sallan, 0, 1)); aR = lerp(aR, -1.4 + Math.sin(t * 11) * 0.45, w); kafa += Math.sin(t * 5.5) * 1.2 * w; }
  if (o.egil) tilt += clamp(o.egil, -1, 1) * 0.17;
  if (o.sars) sq += Math.sin(t * 34) * 0.07 * clamp(o.sars, 0, 1);
  // Dönüş: o.yon bir bakış değeridir (1 sağa · 0 önden · -1 sola; ara değerler dönüşün kendisi, bkz. kdDonYw). Kardan adam aynalanmaz:
  // toplar hep aynı ışıkla çizilir, yüz (gözler, havuç, gülümseme) kürenin üstünde kayar, havuç önden bakışta kısalıp kameraya döner,
  // kollar ve eğilme yumuşakça yer değiştirir. Dönerken minik bir hoplayış (kar silkinir gibi).
  const yw = Number.isFinite(o.yon) ? clamp(o.yon, -1, 1) : 1, sg = yw < 0 ? -1 : 1, ay = Math.abs(yw);
  const dk = Math.sin(Math.min(1, (1 - ay) / 0.6) * Math.PI / 2);
  if (dk > 0.001) { hop += dk * 9; sq -= dk * 0.04; aR -= dk * 0.35; aL -= dk * 0.35; pom = Math.max(pom, dk); }
  { const am = (aR + aL) / 2, r0 = sg > 0 ? aR : aL, l0 = sg > 0 ? aL : aR; aR = lerp(am, r0, ay); aL = lerp(am, l0, ay); }   // ekranda sağ/sol kol
  const R = KD_R, CY = KD_CY;
  const M0 = c.getTransform(), a0 = c.globalAlpha;
  c.translate(x, y); c.scale(s, s); c.globalAlpha = a0 * al;
  const gs = 1 - Math.min(0.45, hop / 40), gw = (top >= 1 ? R[0] : 20) * 1.5 * gs;
  c.globalAlpha = a0 * al * 0.6 * gs; c.drawImage(KDS.golge, -gw, -5, gw * 2, 11); c.globalAlpha = a0 * al;
  c.translate(0, -hop); c.rotate(tilt * yw); c.scale(1 + sq, 1 - sq);
  if (o.isik > 0) kdGlow(c, '#bfe8ff', 0, CY[1], 150, o.isik * 0.42);
  const b1x = sway * 0.7 + kafa * 0.3 * yw, b2x = -sway * 0.55 + kafa * yw;
  kdTopCiz(c, 0, CY[0], R[0], 0.4);
  if (top >= 2) {
    if (m & 32) { kdDal(c, b1x + R[1] * 0.74, CY[1] - 5, aR, false, 36); kdDal(c, b1x - R[1] * 0.74, CY[1] - 5, aL, true, 36); }
    kdTopCiz(c, b1x, CY[1], R[1], 2.1);
    if (m & 16) for (let i = 0; i < 3; i++) kdKomur(c, b1x + yw, CY[1] - 11 + i * 10.5, 4.8);
  }
  if (top >= 3) {
    kdTopCiz(c, b2x, CY[2], R[2], 4.2);
    const fs = 2, ny = CY[2] + R[2] * 0.86, nx = (b1x + b2x) * 0.5;
    if (m & 64) {   // atkı: önce sarkan uç, sonra boyun bandı
      const M = c.getTransform(), k = 30 / 92; c.translate(nx + R[2] * 0.5 * yw, ny + 1); c.scale(sg, 1); c.rotate(atk); c.drawImage(KDS.atkiUc, -20 * k, -6 * k, 40 * k, 110 * k); c.setTransform(M);
      const w = R[2] * 2.3 / 120; c.drawImage(KDS.atki, nx - 65 * w, ny - 20 * w, 130 * w, 40 * w);
    }
    const gx = b2x + fs * yw, gy = CY[2] - 4;
    if (m & 2) {   // gözler
      const mutlu = !!o.mutlu;
      let gz = o.goz != null ? clamp(o.goz, 0, 1) : (canli ? (((t + 0.7) % 3.7) < 0.14 ? 0 : 1) : 1);
      for (const ex of [gx - 5.5 * (1 - 0.12 * ay) - 0.8 * yw, gx + 5.5 * (1 - 0.12 * ay) - 0.8 * yw]) {
        if (mutlu || gz < 0.3) { c.strokeStyle = '#221c36'; c.lineWidth = 1.9; c.lineCap = 'round'; c.beginPath(); if (mutlu) c.arc(ex, gy + 1.4, 2.6, Math.PI * 1.15, Math.PI * 1.85); else c.arc(ex, gy - 0.6, 2.6, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); }
        else { const d = 5.6, h = d * gz; c.drawImage(KDS.komur, ex - d * 0.667, gy - h * 0.667, d * 1.333, h * 1.333); if (canli) { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex - 1.1, gy - 1.2 * gz, 1.05, 0, 6.2832); c.fill(); } }
      }
    }
    if (m & 8) for (let i = 0; i < 5; i++) { const u = (i - 2) / 2; kdKomur(c, gx + yw + u * 7.5 * (1 - 0.1 * ay), CY[2] + 7.2 + (1 - u * u) * 2.8, 2.9); }   // kömür gülümseme
    if (m & 4) {   // havuç: yana bakarken uzun; önden bakışta kısalır ve ucu kameraya döner (turuncu yuvarlak taban + uç)
      const M = c.getTransform(), k = 16 / 70; c.translate(gx + 2.5 * yw, CY[2] + 1.5);
      if (ay < 0.7) { const w = 1 - ay / 0.7; c.globalAlpha = a0 * al * w; c.fillStyle = '#ff9535'; c.beginPath(); c.arc(0, 0.4, 2.9, 0, 6.2832); c.fill(); c.fillStyle = '#e8641f'; c.beginPath(); c.arc(0.3, 0.8, 1.3, 0, 6.2832); c.fill(); c.globalAlpha = a0 * al; }
      c.scale(sg * Math.max(0.16, ay), 1); c.rotate(0.1 + Math.sin(t * 2.3) * 0.03); c.drawImage(KDS.havuc, -4 * k, -16 * k, 80 * k, 32 * k); c.setTransform(M);
    }
    if (m & 1) {   // bere
      const M = c.getTransform(), w = R[2] * 2.25 / 118; c.translate(b2x + kafa * 0.2 * yw, CY[2] - R[2] * 0.6 - pom * 1.5); c.rotate(sapE * yw); c.drawImage(KDS.sapka, -65 * w, -104 * w, 130 * w, 120 * w); c.setTransform(M);
    }
  }
  c.setTransform(M0); c.globalAlpha = a0;
}
// havada süzülen/uçan parça (ikon): merkez (x,y), s ölçek
function kdParcaCiz(c, ad, x, y, s, t) {
  kdSprite();
  const M = c.getTransform(); c.translate(x, y); c.scale(s, s);
  if (ad === 'sapka') { const w = 40 / 118; c.drawImage(KDS.sapka, -65 * w, -62 * w, 130 * w, 120 * w); }
  else if (ad === 'gozler') { kdKomur(c, -6.5, 0, 6.5); kdKomur(c, 6.5, 0, 6.5); }
  else if (ad === 'burun') { const k = 22 / 70; c.rotate(-0.15); c.drawImage(KDS.havuc, -40 * k, -16 * k, 80 * k, 32 * k); }
  else if (ad === 'agiz') for (let i = 0; i < 5; i++) { const u = (i - 2) / 2; kdKomur(c, u * 10, (1 - u * u) * 4 - 2, 4); }
  else if (ad === 'dugme') for (let i = 0; i < 3; i++) kdKomur(c, 0, -11 + i * 11, 6);
  else if (ad === 'kollar') { kdDal(c, -4, 8, -0.75, true, 30); kdDal(c, 4, 8, -0.75, false, 30); }
  else if (ad === 'atki') { const k = 26 / 92; c.save(); c.translate(9, -3); c.rotate(-0.2); c.drawImage(KDS.atkiUc, -20 * k, -6 * k, 40 * k, 110 * k); c.restore(); const w = 36 / 120; c.drawImage(KDS.atki, -65 * w, -20 * w - 6, 130 * w, 40 * w); }
  c.setTransform(M);
}

// ── parçacıklar (sabit havuz) ──
const KD_TZ = []; for (let i = 0; i < 140; i++) KD_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#fff', hx: 0, hy: 0 });
function kdToz(tip, x, y, vx, vy, max, s, col) {
  for (const p of KD_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; return p; }
  return null;
}
function kdKarSac(x, y, n, hiz, yuk) { for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + Math.random() * 0.8), v = hiz * (0.4 + Math.random() * 0.8); kdToz(0, x + (Math.random() - 0.5) * 10, y, Math.cos(a) * v, Math.sin(a) * v * (yuk || 1), 0.7 + Math.random() * 0.6, 1.4 + Math.random() * 2.4); } }
function kdIsikSac(x, y, n, hiz, cols) { cols = cols || KD_ISIK; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); kdToz(1, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.8 + Math.random() * 0.7, 6 + Math.random() * 7, cols[i % cols.length]); } }
function kdTozAdim(dt) {
  for (const p of KD_TZ) {
    if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 0) { p.vy += 520 * dt; p.vx *= Math.exp(-dt * 1.5); }
    else if (p.tip === 1) { p.vx *= Math.exp(-dt * 2.4); p.vy = p.vy * Math.exp(-dt * 2.4) - 14 * dt; }
    else if (p.tip === 2) { p.vy = -38; p.vx = Math.sin(p.t * 4 + p.s) * 18; }
    else if (p.tip === 3) {   // topa yapışan kar: hedefe (topun kenarı) doğru
      const o = KARDAN.o, b = o && o.kd && o.kd.top; if (!b) { p.a = false; continue; }
      const tx = b.x + p.hx * b.r, ty = b.y + p.hy * b.r, k = 1 - Math.exp(-dt * 9);
      p.x += (tx - p.x) * k; p.y += (ty - p.y) * k - Math.sin(p.t / p.max * Math.PI) * 60 * dt; continue;
    }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
function kdTozCiz(c) {
  const a0 = c.globalAlpha;
  for (const p of KD_TZ) {
    if (!p.a) continue; const u = p.t / p.max, f = 1 - u;
    if (p.tip === 0 || p.tip === 3) { c.globalAlpha = a0 * Math.min(1, f * 1.6); c.fillStyle = '#f6f8ff'; c.beginPath(); c.arc(p.x, p.y, p.s * (p.tip === 3 ? 0.6 + f * 0.6 : 1), 0, 6.2832); c.fill(); }
    else if (p.tip === 1) { kdGlow(c, p.col, p.x, p.y, p.s * (0.6 + f * 0.6), f * 0.9); c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.2, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); kdKalp(c, p.x, p.y, 5 + u * 2, p.col); }
  }
  c.globalAlpha = a0;
}

// ── karda iz: alanı kaplayan önbellekli şerit tuvali (top yuvarlandıkça üstüne boyanır, karede tek drawImage) ──
const KD_IZ_PX = 2;   // birim başına piksel
function kdIzKur(o) {
  const k = o.kd; if (k.iz) return;
  k.izX0 = o.x + KD_SOL - 40; k.izW = KD_SAG - KD_SOL + 80;
  k.iz = kdCv(Math.ceil(k.izW * KD_IZ_PX), 24 * KD_IZ_PX); k.izQ = k.iz.getContext('2d'); k.izSon = null;
}
function kdIzBoya(o, x, r) {   // x'te r yarıçaplı topun bastırdığı kar
  const k = o.kd; if (!k.iz) kdIzKur(o);
  const q = k.izQ, px = (x - k.izX0) * KD_IZ_PX, w = r * 1.7 * KD_IZ_PX, h = (5 + r * 0.16) * KD_IZ_PX;
  q.globalAlpha = 0.7; q.drawImage(KDS.iz, px - w / 2, 7 * KD_IZ_PX - h * 0.35, w, h);
  if (Math.random() < 0.35) { q.globalAlpha = 0.9; q.fillStyle = '#f8faff'; q.beginPath(); q.ellipse(px + (Math.random() - 0.5) * w * 0.8, 6 * KD_IZ_PX, (1.2 + Math.random() * 1.6) * KD_IZ_PX, KD_IZ_PX, 0, 0, 6.2832); q.fill(); }   // kenarda minik kar topakları
  q.globalAlpha = 1;
}

// ── durum ──
function kdSite(o) { return o.x + KD_SITE; }
function kdYeniTop(o, n) {
  const k = o.kd, x = o.x + KD_DOGUS[n];
  k.top = { n, x, y: o.y - KD_R0 + 2, r: KD_R0, a: 0, yol: 0, v: 0, durum: 'dog', t: 0, sq: 0, sx: 0, sy: 0, izX: x, kar: 0, gz: 0, otoBek: 0 };
  kdKarSac(x, o.y, 8, 90, 1.2); kdIsikSac(x, o.y - 12, 5, 50);
}
function kdTopSinir(o, b) {   // yuvarlama alanı: [sol, sağ] (top yarıçapı dahil; yığın sağı tutar)
  const lo = o.x + KD_SOL + b.r, hi = b.n === 0 ? o.x + KD_SAG - b.r : kdSite(o) - KD_R[0] - b.r - 2;
  return [lo, Math.max(lo, hi)];
}
function kdTopIlerle(o, mv, ek) {   // top mv kadar yuvarlanır; ek: yalnız büyüme (dikey sürükleme, kenara itme)
  const k = o.kd, b = k.top; if (!b || (b.durum !== 'yuvarla' && b.durum !== 'git')) return 0;
  const [lo, hi] = kdTopSinir(o, b), nx = clamp(b.x + mv, lo, hi), gercek = nx - b.x;
  if (Math.abs(mv - gercek) > 0.01) { if (Math.abs(b.v) > 60) { b.sq = Math.max(b.sq, 0.6); kdKarSac(b.x + Math.sign(mv) * b.r, o.y - b.r * 0.6, 3, 70); } b.v *= -0.25; }
  b.x = nx; b.a += gercek / b.r;
  if (b.durum === 'yuvarla') {
    const once = b.yol; b.yol += Math.abs(gercek) + (ek || 0) + Math.abs(mv - gercek) * 0.8;
    const u = clamp(b.yol / KD_YOL[b.n], 0, 1);
    b.r = Math.max(b.r, lerp(KD_R0, KD_R[b.n], 1 - (1 - u) * (1 - u) * 0.35 - 0.65 * (1 - u)));
    b.kar += b.yol - once;
    if (u >= 1) { b.durum = 'tam'; b.t = 0; b.v = 0; kdIsikSac(b.x, b.y, 16, 120); kdSfx('parilti', 0.8); }
  }
  b.y = o.y - b.r + 2;
  // iz + yapışan kar + savrulan toz
  if (Math.abs(b.x - b.izX) > 3) { const n = Math.min(12, Math.ceil(Math.abs(b.x - b.izX) / 3)); for (let i = 1; i <= n; i++) kdIzBoya(o, lerp(b.izX, b.x, i / n), b.r); b.izX = b.x; }
  if (b.kar > 16) {
    b.kar = 0; const d = Math.sign(gercek) || 1;
    const p = kdToz(3, b.x + d * (b.r + 14 + Math.random() * 10), o.y - 1, 0, 0, 0.45, 1.4 + Math.random() * 1.6);
    if (p) { const a = (d > 0 ? 0.15 : Math.PI - 0.15) + (Math.random() - 0.5) * 1.2; p.hx = Math.cos(a) * 0.95; p.hy = Math.sin(a) * 0.95 - 0.2; }
    kdToz(0, b.x - d * b.r * 0.7, o.y - 2, -d * (30 + Math.random() * 50), -60 - Math.random() * 70, 0.6, 1.2 + Math.random() * 1.8);
  }
  return gercek;
}
function kdOturt(o) {   // top yığına "tık" diye oturdu
  const k = o.kd, b = k.top; k.n = b.n + 1; k.top = null; k.wob = 1; k.sevT = 1.2;
  const y = o.y + KD_CY[b.n];
  kdKarSac(kdSite(o), y + KD_R[b.n] * 0.8, 14, 130, 1.1); kdIsikSac(kdSite(o), y, 12, 110);
  // "tık" sesi muzik.js'te ('kardanTop' olayıyla)
  OLAY.emit('kardanTop', { o, n: k.n, son: k.n >= 3 });
  if (k.n < 3) { k.dogT = 0.55; } else { k.dogT = -1; kdFaz(o, 'parca'); }
}
function kdFaz(o, f) {
  const k = o.kd; k.faz = f; k.fT = 0; KARDAN.yol = 0;
  if (f === 'parca') kdParcaKur(o);
  if (f === 'canlan') { k.ct = 0; k.idle = 0; k.helpOn = false; OLAY.emit('kardanCanlan', { o }); }
}
function kdParcaKur(o) {
  const k = o.kd, sx = kdSite(o);
  if (!k.parca.length) KD_PARCA.forEach((d, i) => {
    const sol = d.fx < 0, ust = d.ad === 'sapka';
    k.parca.push({ d, i, durum: 'gel', t: -i * 0.2, x: 0, y: 0, x0: ust ? sx - 40 : sx + (sol ? -620 : 620), y0: o.y - (ust ? 560 : 260 + Math.random() * 160), x1: 0, y1: 0, s: KD_PS, rot: 0, pirilde: false });
  });
  for (const p of k.parca) { if (p.durum === 'bekle' || p.durum === 'gel') { p.durum = 'gel'; if (p.t > 0) p.t = 0; } if (k.mask & p.d.bit) p.durum = 'yerde'; }
}
function kdParcaUc(o, p, yardim) {
  const k = o.kd; if (p.durum !== 'bekle') return false;
  p.durum = 'uc'; p.t = 0; p.x1 = p.x; p.y1 = p.y; p.pirilde = !!yardim;
  kdIsikSac(p.x, p.y, 8, 70, [p.d.renk, '#ffffff']); kdSfx('cicek', 0.5);
  return true;
}
function kdSiradaki(o) { const k = o.kd; for (const p of k.parca) if (p.durum === 'bekle') return p; return null; }
function kdAktiflestir(o) {
  const k = o.kd; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x = P.x; e.y = P.y; e.safeX = P.safeX; e.safeY = P.safeY; e.f = P.f;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; KARDAN.o = o; kdGirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  k.dur = k.faz === 'bekle' ? (k.n < 3 ? 'top' : KD_PARCA.every(d => k.mask & d.bit) ? 'canlan' : 'parca') : k.faz;
  k.faz = 'gel'; k.fT = 0;
  if (k.n < 3 && !k.top) kdYeniTop(o, k.n);
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kardan', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('kardanBasla', { o }); }
  return true;
}
function kdBirak(o, tamam) {   // güvenli dönüş: giriş fotoğrafındaki konum aynen geri verilir
  const k = o.kd, e = k.entry; if (!k.aktif) return;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = tamam ? 1 : e.f;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; kdGirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kardan', 0.1, k.kameraFn, 1, 0.42);
  if (tamam && !o.done) {
    o.done = true; k.bitti = true; k.faz = 'bitti';
    if (typeof V7 !== 'undefined' && V7) V7.kardan = true;
    kdTakipKur(o);
    OLAY.emit('kardanBitti', { o });
  } else if (!tamam) { k.faz = 'bekle'; if (k.top && k.top.durum !== 'yuvarla') { k.top.durum = 'yuvarla'; } }
}
function kdGirdiBirak() { const id = KARDAN.ptr; KARDAN.ptr = -1; KARDAN.tus = 0; if (id >= 0 && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} } if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); }
function kdKullanici(o) { const k = o.kd; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }

// ── her kare ──
function kdAdim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza girişte durur
  const k = o.kd; if (!k.aktif || P.ucus !== o) return;
  P.x = k.entry.x; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function kdGuncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.kd; k.t += dt; kdTozAdim(dt);
  k.wob = Math.max(0, k.wob - dt * 2.2); k.sevT = Math.max(0, k.sevT - dt);
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - KD_AKTIF && P.x < o.x + KD_SAG + 40 && Math.abs(P.y - o.y) < 160) kdAktiflestir(o);
  if (!k.aktif) return;
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kardan', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  const yardimEsik = k.helpN > 0 ? KD_YARDIM2 : KD_YARDIM;
  if (KARDAN.ptr < 0 && !KARDAN.tus && (k.faz === 'top' || k.faz === 'parca')) { k.idle += dt; if (!k.helpOn && k.idle >= yardimEsik) { k.helpOn = true; k.helpT = 0; k.helpN++; } }
  if (k.helpOn) k.helpT += dt;
  if (k.faz === 'gel') { if (k.fT >= KD_GEL) kdFaz(o, k.dur || 'top'); }
  else if (k.faz === 'top') kdTopAdim(o, dt);
  else if (k.faz === 'parca') kdParcaAdim(o, dt);
  else if (k.faz === 'canlan') kdCanlanAdim(o, dt);
  else if (k.faz === 'don') { if (k.fT >= KD_DON) kdBirak(o, true); }
  if (k.faz === 'top' || k.faz === 'gel') { const b = k.top; if (b && b.durum === 'dog') { b.t += dt; if (b.t > 0.5) { b.durum = 'yuvarla'; b.t = 0; } } }
  kdPirilAdim(o, dt);
}
function kdTopAdim(o, dt) {
  const k = o.kd;
  if (!k.top) { if (k.dogT >= 0) { k.dogT -= dt; if (k.dogT < 0 && k.n < 3) kdYeniTop(o, k.n); } return; }
  const b = k.top; b.t += dt; b.sq = Math.max(0, b.sq - dt * 3);
  if (b.durum === 'dog') return;
  const surukle = KARDAN.ptr >= 0;
  if (b.durum === 'yuvarla' || b.durum === 'git') {
    let mv = 0;
    if (surukle) { mv = KARDAN.ox; const ek = KARDAN.oy * 0.7; KARDAN.ox = KARDAN.oy = 0; const g2 = kdTopIlerle(o, mv, ek); b.v = lerp(b.v, clamp(g2 / dt, -600, 600), 1 - Math.exp(-dt * 12)); b.otoBek = 0.5; }
    else {
      if (KARDAN.tus) b.v = lerp(b.v, KARDAN.tus * 210, 1 - Math.exp(-dt * 6));
      else if (k.helpOn && b.durum === 'yuvarla' && k.helpT > 0.9) {   // Pırıl burnuyla itiyor: alanın içinde ileri geri
        const [lo, hi] = kdTopSinir(o, b); if (!k.hDir) k.hDir = 1;
        if (b.x >= hi - 4) k.hDir = -1; else if (b.x <= lo + 4) k.hDir = 1;
        b.v = lerp(b.v, k.hDir * 165, 1 - Math.exp(-dt * 4));
      } else if (b.durum === 'git') {   // tam boy: yerine kendiliğinden kayar
        b.otoBek -= dt;
        if (b.otoBek <= 0) { const hx = b.n === 0 ? kdSite(o) : kdSite(o) - KD_R[0] - b.r - 4, d = hx - b.x; b.v = lerp(b.v, clamp(d * 3.2, -230, 230), 1 - Math.exp(-dt * 5)); if (b.n === 0 && Math.abs(d) < 2.5 && Math.abs(b.v) < 30) { b.x = hx; kdOturt(o); return; } }
      } else b.v *= Math.exp(-dt * 2.3);
      if (Math.abs(b.v) > 0.5) kdTopIlerle(o, b.v * dt, 0); else b.v = 0;
    }
    if (k.top !== b) return;
    // yığına yeterince yaklaştı: zıplayıp oturur
    if (b.durum === 'git' && b.n > 0 && b.x > kdSite(o) - KD_R[0] - b.r - 75) { b.durum = 'zip'; b.t = 0; b.sx = b.x; b.sy = b.y; kdKarSac(b.x, o.y, 8, 90); kdSfx('zipla', 0.5); }
    if (b.durum === 'git' && b.n === 0 && surukle && Math.abs(b.x - kdSite(o)) < 22) { b.x = kdSite(o); kdOturt(o); return; }
  }
  if (b.durum === 'tam') { if (b.t >= KD_TAM) { b.durum = 'git'; b.t = 0; b.otoBek = surukle ? 0.4 : 0.15; } return; }
  if (b.durum === 'zip') {
    const u = clamp(b.t / KD_ZIP, 0, 1), e = smooth(u), tx = kdSite(o), ty = o.y + KD_CY[b.n];
    b.x = lerp(b.sx, tx, e); b.y = lerp(b.sy, ty, e) - Math.sin(u * Math.PI) * (46 + b.n * 10); b.a += dt * 7;
    if (u >= 1) kdOturt(o);
  }
}
function kdParcaAdim(o, dt) {
  const k = o.kd, sx = kdSite(o);
  let hepsi = true, aktifYardim = null;
  for (const p of k.parca) {
    p.t += dt;
    const fx = sx + p.d.fx, fy = o.y + p.d.fy;
    if (p.durum === 'gel') {
      hepsi = false; if (p.t < 0) { p.x = p.x0; p.y = p.y0; continue; }
      const u = clamp(p.t / 1.15, 0, 1), e = 1 - Math.pow(1 - u, 3);
      p.x = lerp(p.x0, fx, e) + Math.sin(u * Math.PI) * (p.d.fx < 0 ? 60 : -60); p.y = lerp(p.y0, fy, e) - Math.sin(u * Math.PI) * 40; p.rot = (1 - e) * 3 * Math.sign(p.d.fx || 1);
      if (u >= 1) { p.durum = 'bekle'; p.t = 0; kdIsikSac(p.x, p.y, 5, 40, [p.d.renk, '#ffffff']); }
    } else if (p.durum === 'bekle') {
      hepsi = false; p.x = fx + Math.sin(k.t * 1.1 + p.i * 1.7) * 4; p.y = fy + Math.sin(k.t * 1.6 + p.i) * 6; p.rot = Math.sin(k.t * 1.3 + p.i * 2) * 0.12;
    } else if (p.durum === 'uc') {
      hepsi = false; aktifYardim = aktifYardim || (p.pirilde ? p : null);
      const sure = p.pirilde ? 1.1 : 0.6, u = clamp(p.t / sure, 0, 1), e = smooth(u), tx = sx + p.d.tx, ty = o.y + p.d.ty;
      p.x = lerp(p.x1, tx, e); p.y = lerp(p.y1, ty, e) - Math.sin(u * Math.PI) * 55; p.s = lerp(KD_PS, 1, e); p.rot = (1 - e) * 2.2 * (p.d.fx < 0 ? 1 : -1);
      if (u >= 1) {
        p.durum = 'yerde'; k.mask |= p.d.bit; k.wob = 0.8; k.sevT = Math.max(k.sevT, 0.9);
        kdIsikSac(tx, ty, 14, 100, [p.d.renk, '#ffffff', '#bff4ff']); if (p.d.ad === 'kollar' || p.d.ad === 'atki' || p.d.ad === 'sapka') kdKarSac(tx, ty, 6, 60);
        kdSfx('parilti', 0.7);
        OLAY.emit('kardanParca', { o, ad: p.d.ad, n: k.parca.filter(q => q.durum === 'yerde').length });
      }
    }
  }
  // Pırıl'ın yardımı: sıradaki parçaya uçar, alır, yerine taşır
  if (k.helpOn && !aktifYardim) { const p = kdSiradaki(o); if (p && k.helpT > 1.0 && Math.hypot(k.pr.x - p.x, k.pr.y - p.y) < 30) { kdParcaUc(o, p, true); k.helpT = 0.5; } }
  if (hepsi) { k.sonT = (k.sonT || 0) + dt; if (k.sonT > 0.6) { k.sonT = 0; kdFaz(o, 'canlan'); } }
}
function kdCanlanAdim(o, dt) {
  const k = o.kd, t0 = k.ct; k.ct += dt; const t = k.ct, sx = kdSite(o);
  const gec = a => t0 < a && t >= a;
  const kx = kdKardanX(o), ky = o.y;
  if (t < 1.1 && Math.random() < dt * 22) { const a = Math.random() * 6.2832; kdToz(1, kx + Math.cos(a) * 60, ky - 20 - Math.random() * 20, Math.cos(a) * -10, -80 - Math.random() * 60, 1.2, 8, KD_ISIK[(Math.random() * 5) | 0]); }
  if (gec(0.6)) { kdIsikSac(kx, ky + KD_CY[2] - 4, 10, 60, ['#ffffff', '#bff4ff']); }
  if (gec(1.15) || gec(1.6)) kdSfx('gozKirp', 0.6);
  if (gec(3.05) || gec(3.4) || gec(3.75)) { kdKarSac(kx, ky + KD_CY[2] - 22, 12, 150, 1.3); kdKarSac(kx + 40, ky + KD_CY[1] - 10, 6, 110); kdKarSac(kx - 40, ky + KD_CY[1] - 10, 6, 110); }
  if (gec(4.2)) { kdIsikSac(kx, ky - 80, 18, 140); }   // canlanma fanfarı muzik.js'te ('kardanCanlan')
  if (t > 4.2 && t < 6.3 && Math.random() < dt * 5) kdIsikSac(kx + (Math.random() - 0.5) * 90, ky - 60 - Math.random() * 80, 2, 40);
  if (t > 7.3 && Math.random() < dt * 3.2) kdToz(2, lerp(kx, P.x, 0.5) + (Math.random() - 0.5) * 40, ky - 110 - Math.random() * 20, 0, -38, 1.6, Math.random() * 6, Math.random() < 0.5 ? '#ff8fb0' : '#ffb3cf');
  if (gec(6.3) || gec(6.85)) kdKarSac(kx, ky, 6, 60);
  if (t >= KD_CANLAN) kdFaz(o, 'don');
}
function kdKardanX(o) {   // canlanmada kardan adamın tabanı: yerinden Feza'nın yanına iki hopla gelir
  const k = o.kd, sx = kdSite(o), hedef = k.entry.x + 104;
  if (k.faz !== 'canlan' && k.faz !== 'don') return k.faz === 'bitti' ? hedef : sx;
  const t = k.faz === 'don' ? KD_CANLAN : k.ct;
  return lerp(sx, hedef, smooth(clamp((t - 6.3) / 1.1, 0, 1)));
}
function kdCanlanPoz(o, t, tm) {   // canlanma anına göre kardanCiz seçenekleri
  const q = KD_CPOZ; q.poz = 'dur'; q.yon = 1; q.sallan = 0; q.goz = null; q.mutlu = false; q.silk = 0; q.egil = 0; q.kipir = 0; q.faz = null; q.isik = 0; q.canli = true; q.sars = 0;
  q.toplar = 3; q.parca = KD_TUM; q.alpha = 1;
  kdCanlanPozHam(q, t);
  const k = o.kd, d = k.dnC || (k.dnC = {}), dt = k.dnT == null ? 0 : t - k.dnT; k.dnT = t;
  if (dt < 0) { k.dnC = {}; return q; }   // yeniden başladı
  q.yon = kdDonYw(d, q.yon, dt, KD_DON_SN, 0);
  return q;
}
function kdCanlanPozHam(q, t) {
  if (t < 0.6) { q.canli = false; q.isik = smooth(t / 0.6); return q; }
  q.isik = Math.max(0, 1 - (t - 0.6) / 1.2);
  if (t < 1.9) { const u = t - 1.15, v = t - 1.6; q.goz = (u > 0 && u < 0.16) || (v > 0 && v < 0.16) ? 0 : 1; q.egil = Math.sin(clamp((t - 0.7) / 1.2, 0, 1) * Math.PI) * -0.25; return q; }
  if (t < 3.0) { q.kipir = Math.sin(clamp((t - 1.9) / 1.1, 0, 1) * Math.PI); q.yon = -1; return q; }
  if (t < 4.1) { q.silk = Math.sin(clamp((t - 3.0) / 1.1, 0, 1) * Math.PI); return q; }
  if (t < 6.3) { q.poz = 'dans'; q.mutlu = ((t - 4.1) % 1.4) < 0.7; return q; }
  if (t < 7.4) { q.poz = 'yuru'; q.yon = -1; q.faz = (t - 6.3) * 0.62; return q; }
  q.yon = -1; q.sallan = smooth(clamp((t - 7.45) / 0.3, 0, 1)); q.egil = 0.35 * Math.sin(clamp((t - 7.4) / 1.4, 0, 1) * Math.PI); q.mutlu = t > 8.1;
  return q;
}
const KD_CPOZ = {};
function kdPirilAdim(o, dt) {   // Pırıl'ın hedefi: Feza'nın yanı · ipucu (topun/parçanın yanında yön gösterir) · yardım · kutlama
  const k = o.kd, pr = k.pr, e = k.entry, b = k.top;
  let tx = e.x + 44, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  const ipucu = k.idle > KD_GOSTER || k.helpOn;
  if (k.faz === 'top' && b && b.durum !== 'dog' && b.durum !== 'zip') {
    const dir = b.n === 0 ? (b.x < kdSite(o) ? 1 : -1) : 1;
    if (k.helpOn && b.durum === 'yuvarla') { const hd = k.hDir || 1; tx = b.x - hd * (b.r + 17); ty = o.y - Math.max(16, b.r * 0.9) - 4 + Math.sin(k.t * 9) * 1.5; hiz = 6; bak = hd; if (k.helpT > 0.9 && Math.random() < dt * 8) kdToz(1, pr.x + hd * 12, pr.y, hd * 20, -10, 0.6, 5, '#e2ccff'); }
    else if (ipucu && b.durum === 'yuvarla') {   // yön gösterir: topun üstünde ileri doğru salınır, ardında ışık izi
      const u = (k.t * 0.8) % 1; tx = b.x + dir * (-20 + u * 70); ty = b.y - b.r - 42 - Math.sin(u * Math.PI) * 14; hiz = 5; bak = dir;
      if (Math.random() < dt * 14) kdToz(1, pr.x - dir * 8, pr.y + 6, -dir * 15, 6, 0.9, 5, KD_ISIK[(Math.random() * 3) | 0]);
    } else bak = Math.sign(b.x - pr.x) || 1;
  } else if (k.faz === 'parca') {
    const p = kdSiradaki(o), u = k.parca.find(q => q.durum === 'uc' && q.pirilde);
    if (u) { tx = u.x - 10; ty = u.y - 22; hiz = 9; bak = Math.sign(kdSite(o) - u.x) || 1; }
    else if (p && (ipucu || k.helpOn)) { tx = p.x + (k.helpOn && k.helpT > 0.4 ? 0 : -34); ty = p.y - (k.helpOn ? 4 : 30) + Math.sin(k.t * 3) * 4; hiz = k.helpOn ? 4.5 : 3.5; bak = Math.sign(p.x - pr.x) || 1; }
    else bak = Math.sign(kdSite(o) - pr.x) || 1;
  } else if (k.faz === 'canlan' || k.faz === 'don') {
    const t = k.ct, kx = kdKardanX(o);
    if (t > 4.1 && t < 6.6) { const a = (t - 4.1) * 2.6; tx = kx + Math.sin(a) * 85; ty = o.y - 150 + Math.sin(a * 2) * 24; hiz = 6; bak = Math.cos(a) > 0 ? 1 : -1; }
    else { tx = (kx + e.x) / 2 + 6; ty = e.y - 128 + Math.sin(k.t * 2.4) * 5; bak = Math.sign(kx - pr.x) || 1; }
  }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function kdCiz(o, tm) {
  const k = o.kd; kdSprite();
  if (k.iz) g.drawImage(k.iz, k.izX0, o.y - 7, k.izW, 24);
  if (o.done) return;   // tamamlandı: kardan adamı takipçi çizer
  const sx = kdSite(o);
  if (k.faz === 'canlan' || k.faz === 'don') { const q = kdCanlanPoz(o, k.faz === 'don' ? KD_CANLAN : k.ct, tm); kardanCiz(g, kdKardanX(o), o.y, 1, tm, q); return; }
  if (k.n > 0) {
    const q = KD_CPOZ; q.poz = 'dur'; q.yon = 1; q.sallan = 0; q.goz = null; q.mutlu = false; q.silk = 0; q.egil = 0; q.kipir = 0; q.faz = null; q.isik = 0; q.alpha = 1;
    q.canli = false; q.toplar = k.n; q.parca = k.mask; q.sars = k.wob;
    if (k.faz === 'parca' && k.idle > KD_IPUCU) kdGlow(g, '#cfe6ff', sx, o.y - 70, 110, 0.12 + 0.06 * Math.sin(tm * 2.4));
    kardanCiz(g, sx, o.y, 1, tm, q);
  } else if (k.aktif || k.top) {   // yığının yeri: karda hafif ışıklı bir halka
    g.globalAlpha = 0.35 + 0.15 * Math.sin(tm * 2); g.strokeStyle = '#dff2ff'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(sx, o.y + 1, 36, 6, 0, 0, 6.2832); g.stroke(); g.globalAlpha = 1;
  }
  const b = k.top;
  if (b) {
    let sc = 1; if (b.durum === 'dog') sc = smooth(clamp(b.t / 0.5, 0, 1)) * (1 + Math.sin(clamp(b.t / 0.5, 0, 1) * Math.PI) * 0.25);
    const r = b.r * sc;
    const parla = b.durum === 'tam' ? 1 - b.t / KD_TAM : b.durum === 'git' ? 0.35 + 0.15 * Math.sin(tm * 6) : (k.aktif && k.faz === 'top' ? clamp((k.idle - 1) / KD_IPUCU, 0, 1) * (0.28 + 0.14 * Math.sin(tm * 3)) : 0);
    if (parla > 0.01) { kdGlow(g, '#cfeaff', b.x, b.y, Math.max(r * 3.2, 62), parla * 0.85); kdGlow(g, '#ffffff', b.x, b.y, r * 1.6, parla * 0.4); }
    if (b.durum !== 'zip') { const gw = r * 1.4; g.globalAlpha = 0.55; g.drawImage(KDS.golge, b.x - gw, o.y - 4, gw * 2, 9); g.globalAlpha = 1; }
    else { const u = clamp(b.t / KD_ZIP, 0, 1), gw = r * 1.4 * (1 - 0.4 * Math.sin(u * Math.PI)); g.globalAlpha = 0.4; g.drawImage(KDS.golge, b.x - gw, o.y + KD_CY[b.n] + r * 0.9 - 4, gw * 2, 9); g.globalAlpha = 1; }
    const sq = b.sq * 0.12 * Math.sin(b.t * 30);
    if (sq) { const M = g.getTransform(); g.translate(b.x, b.y + r); g.scale(1 + sq, 1 - sq); kdTopCiz(g, 0, -r, r, b.a); g.setTransform(M); } else kdTopCiz(g, b.x, b.y + (r - b.r) * 0 + (b.r - r), r, b.a);
  }
}
function kdCizOn(o, tm) {
  const k = o.kd;
  if (k.aktif && P.ucus === o) {
    // Feza: girişte, alana dönük; sevinçte zıplar
    const ct = k.ct || 0, sevinc = k.sevT > 0 || (k.faz === 'canlan' && ct > 4.1) || k.faz === 'don';
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, P.x, P.y, 1, sevinc ? 'sevinc' : 'ayakta_yan', tm, null, KD_FZ_OPT); } catch (e) {}
    // Pırıl
    if (typeof pirilCizPoz === 'function') {
      const pr = k.pr, kirp = (k.faz === 'canlan' && ct > 4.1) || k.sevT > 0.4 || k.faz === 'don';
      try { g.save(); g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, kirp ? 'goz_kirp' : 'ucus', tm); g.restore(); } catch (e) { g.restore(); }
    }
  }
  // havadaki parçalar
  if (k.faz === 'parca' || (k.aktif && k.parca.length && k.faz !== 'canlan' && k.faz !== 'don')) {
    const sira = kdSiradaki(o), ipucu = k.idle > KD_IPUCU;
    for (const p of k.parca) {
      if (p.durum === 'yerde' || (p.durum === 'gel' && p.t < 0)) continue;
      let nf = 1;
      if (p.durum === 'bekle') {   // ışıklı bir kar baloncuğunun içinde süzülür, hafifçe "nefes alır": dokunulacak şey olduğu belli olsun
        const vurgu = p === sira && ipucu ? 0.5 + 0.25 * Math.sin(tm * 4) : 0; nf = 1 + 0.05 * Math.sin(tm * 2.2 + p.i * 1.3) + vurgu * 0.1;
        kdGlow(g, p.d.renk, p.x, p.y, (70 + vurgu * 26) * nf, 0.7 + vurgu * 0.3); kdGlow(g, '#ffffff', p.x, p.y, (38 + vurgu * 8) * nf, 0.55 + vurgu * 0.3);
        const br = 33 * nf, a0 = g.globalAlpha;
        g.globalAlpha = a0 * (0.3 + vurgu * 0.4); g.strokeStyle = '#eef8ff'; g.lineWidth = 1.6; g.beginPath(); g.arc(p.x, p.y, br, 0, 6.2832); g.stroke();
        g.globalAlpha = a0 * (0.55 + vurgu * 0.3); g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.arc(p.x, p.y, br - 5, 3.55, 4.4); g.stroke(); g.globalAlpha = a0;
      }
      else if (p.durum === 'uc') kdGlow(g, p.d.renk, p.x, p.y, 30, 0.4);
      const M = g.getTransform(); g.translate(p.x, p.y); g.rotate(p.rot); kdParcaCiz(g, p.d.ad, 0, 0, p.s * nf, tm); g.setTransform(M);
    }
  }
  kdTozCiz(g);
}
const KD_FZ_OPT = { ruzgar: 0.1 };

// Dönüş durumu (geyik.js gyDonAdim: histerezis + sabit süreli 3B dönüş); yoksa anında
function kdDonYw(d, istek, dt, sure, gec) { return typeof gyDonAdim === 'function' ? gyDonAdim(d, istek, dt, sure, gec) : (istek < 0 ? -1 : 1); }
const KD_DON_SN = 0.42;
// ── takipçi: bölüm boyunca Feza'nın arkasından gelir ──
function kdZemin(x, y) {
  if (typeof topOf !== 'function' || typeof T === 'undefined') return null;
  const c = Math.floor(x / T); if (typeof COLS !== 'undefined' && (c < 0 || c >= COLS)) return null;
  const r = topOf(c); if (typeof ROWS !== 'undefined' && r >= ROWS) return null;
  return r * T;
}
function kdTakipKur(o) {
  if (KARDAN.takipci) return KARDAN.takipci;
  const x = kdKardanX(o);
  const t = { tip: 'kardanTakip', id: 'kardanTakip', x, y: o.y, vx: 0, yon: -1, yw: -1, dn: {}, poz: 'dur', faz: 0, alpha: 1, gizle: false, hedef: null, dans: false, sallanT: 0, salBek: 3, gizli: false, ilk: 1.2, izF: 0 };
  NESNELER.push(t); KARDAN.takipci = t; return t;
}
function kdTakipAdim(t, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return; dt = Math.min(dt, 0.05);
  const gizle = t.gizle || (P.ucus && P.ucus !== KARDAN.o) || P.fade > 0.3;
  if (gizle) { t.alpha = Math.max(0, t.alpha - dt * 4); t.gizli = true; return; }
  const fx = P.rx !== undefined ? P.rx : P.x, fy = P.ry !== undefined ? P.ry : P.y;
  const final = typeof V7 !== 'undefined' && V7 && V7.final;
  let hx = fx - (P.f || 1) * KD_TAKIP_ARA; if (final) hx = fx - (P.f || 1) * 115;
  if (t.hedef && isFinite(t.hedef.x)) hx = t.hedef.x;
  if (t.gizli || Math.abs(hx - t.x) > 950 || Math.abs(fy - t.y) > 500) {   // uzakta kaldı / yeniden göründü: Feza'nın arkasında karda "puf" diye belirir
    t.gizli = false; t.x = hx; const z = kdZemin(t.x, fy); t.y = z != null && Math.abs(z - fy) < 200 ? z : fy; t.vx = 0; t.alpha = 0;
    kdKarSac(t.x, t.y, 10, 100); kdIsikSac(t.x, t.y - 60, 6, 60);
  }
  t.alpha = Math.min(1, t.alpha + dt * 2.5);
  const dx = hx - t.x, ist = Math.abs(dx) > 24 ? clamp(dx * 2.4, -340, 340) : 0, vx0 = t.vx;
  t.vx += (ist - t.vx) * (1 - Math.exp(-dt * 5)); t.x += t.vx * dt;
  // ivmeye göre eğilme: kalkışta öne atılır, dururken geriye yaylanır (ağırlık hissi)
  const ivme = (t.vx - vx0) / dt * (t.yon || 1); t.egil = (t.egil || 0) + (clamp(ivme / 900, -0.7, 0.7) - (t.egil || 0)) * (1 - Math.exp(-dt * 8));
  const z = kdZemin(t.x, t.y); if (z != null && Math.abs(z - t.y) < 160) t.y += (z - t.y) * (1 - Math.exp(-dt * 10)); else if (z == null && t.hedef && isFinite(t.hedef.y)) t.y += (t.hedef.y - t.y) * (1 - Math.exp(-dt * 6));
  if (t.hedef && isFinite(t.hedef.y) && Math.abs(dx) < 30) t.y += (t.hedef.y - t.y) * (1 - Math.exp(-dt * 6));
  const v = Math.abs(t.vx);
  t.poz = (final || t.dans) && v < 120 ? 'dans' : v > 250 ? 'kay' : v > 22 ? 'yuru' : 'dur';
  if (t.poz === 'yuru') { const once = t.faz; t.faz += dt * clamp(v / 150, 0.6, 1.6) * 0.62; if (Math.floor(once * 7.2 / Math.PI) !== Math.floor(t.faz * 7.2 / Math.PI)) { kdKarSac(t.x, t.y, 3, 40); if (typeof dn7Iz === 'function') { try { dn7Iz(t.x, t.y, 'kardan'); } catch (e) {} } } }
  else if (t.poz === 'kay') { t.izF += dt; if (t.izF > 0.06) { t.izF = 0; kdToz(0, t.x - Math.sign(t.vx) * 28, t.y - 2, -t.vx * 0.15, -40 - Math.random() * 40, 0.5, 1.5 + Math.random() * 1.5); if (typeof dn7Iz === 'function') { try { dn7Iz(t.x, t.y, 'kardanKay'); } catch (e) {} } } }
  if (v > 40) t.yon = Math.sign(t.vx); else if (v < 12 && Math.abs(fx - t.x) > 50) t.yon = Math.sign(fx - t.x) || t.yon;   // ölü bölge: kıpırdanmada dönmez
  t.yw = kdDonYw(t.dn, t.yon, dt, KD_DON_SN, v > 120 ? 0.08 : 0.2);
  // ara sıra Feza'ya el sallar
  if (t.poz === 'dur') { t.salBek -= dt; if (t.salBek <= 0 && t.sallanT <= 0) { t.sallanT = 1.6; t.salBek = 7 + Math.random() * 6; } } else t.salBek = Math.max(t.salBek, 2);
  t.sallanT = Math.max(0, t.sallanT - dt);
  kdTozAdim(KARDAN.aktif ? 0 : dt);
}
const KD_TPOZ = {};
function kdTakipCiz(t, tm) {
  if (t.alpha <= 0.01) return;
  const q = KD_TPOZ; q.poz = t.poz; q.yon = t.yw == null ? t.yon : t.yw; q.faz = t.poz === 'yuru' ? t.faz : null; q.alpha = t.alpha; q.canli = true;
  q.sallan = t.sallanT > 0 ? Math.sin(clamp(t.sallanT / 1.6, 0, 1) * Math.PI) * 1.4 : 0; q.mutlu = t.poz === 'dans' && (tm % 1.6) < 0.8; q.goz = null; q.silk = 0; q.egil = t.egil || 0; q.kipir = 0; q.isik = 0; q.sars = 0; q.toplar = 3; q.parca = KD_TUM;
  kardanCiz(g, t.x, t.y, KD_TAKIP_S, tm, q);
  if (!KARDAN.aktif) kdTozCiz(g);
}
TUR.kaydet('kardanTakip', { guncelle: kdTakipAdim, ciz: kdTakipCiz });

// ── girdi: parmak her yerde topu yuvarlar; parçaya dokununca uçar (pencere yakalama evresi: motorun yürüme parmağına gitmez) ──
function kdDunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function kdSahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function kdParcaBul(o, p) {
  const k = o.kd, rr = Math.max(52, 40 * DPR / Math.max(S, 0.001)); let en = null, ed = rr;
  for (const q of k.parca) if (q.durum === 'bekle') { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < ed) { ed = d; en = q; } }
  return en;
}
addEventListener('pointerdown', e => {
  const o = KARDAN.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === KARDAN.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  kdSahip(e); const k = o.kd; if (KARDAN.ptr >= 0) return;
  const p = kdDunya(e);
  KARDAN.ptr = e.pointerId; KARDAN.px = p.x; KARDAN.py = p.y; KARDAN.ox = KARDAN.oy = 0; KARDAN.yol = 0; KARDAN.pt = k.t;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  kdKullanici(o);
  if (k.faz === 'parca') {
    const q = kdParcaBul(o, p);
    if (q) kdParcaUc(o, q, false);
    else if (Math.abs(p.x - kdSite(o)) < 60 && p.y > o.y - 170 && p.y < o.y + 10) { const s = kdSiradaki(o); if (s) kdParcaUc(o, s, false); }   // kardan adama dokunmak da sıradakini getirir
  }
}, true);
addEventListener('pointermove', e => {
  const o = KARDAN.aktif; if (!o || e.pointerId !== KARDAN.ptr) return; kdSahip(e);
  const p = kdDunya(e), dx = p.x - KARDAN.px, dy = p.y - KARDAN.py; KARDAN.px = p.x; KARDAN.py = p.y;
  const d = Math.hypot(dx, dy); if (d > 200) return;   // sıçrama (ekran döndü vb.)
  KARDAN.yol += d; KARDAN.ox += dx; KARDAN.oy += Math.abs(dy); o.kd.idle = 0;
}, true);
function kdBirakE(e) {
  const o = KARDAN.aktif; if (!o || e.pointerId !== KARDAN.ptr) return; kdSahip(e);
  const k = o.kd, b = k.top;
  if (KARDAN.yol < 10 && k.t - KARDAN.pt < 0.45 && k.faz === 'top' && b && (b.durum === 'yuvarla' || b.durum === 'git')) {   // kısa dokunuş: top hafifçe itilir (yuvarlanıp büyür)
    const p = kdDunya(e); let d = Math.sign(b.x - p.x) || 1; const [lo, hi] = kdTopSinir(o, b); if (Math.abs(b.x - p.x) < b.r + 10) d = b.x > (lo + hi) / 2 ? -1 : 1; if (b.x >= hi - 3) d = -1; else if (b.x <= lo + 3) d = 1;
    b.v = d * 190; b.sq = 0.5;
  }
  kdGirdiBirak();
}
addEventListener('pointerup', kdBirakE, true); addEventListener('pointercancel', kdBirakE, true);
cv.addEventListener('lostpointercapture', e => { if (e.pointerId === KARDAN.ptr) kdGirdiBirak(); });
addEventListener('blur', () => { if (KARDAN.ptr >= 0 || KARDAN.tus) kdGirdiBirak(); });
addEventListener('pagehide', () => { if (KARDAN.ptr >= 0 || KARDAN.tus) kdGirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && (KARDAN.ptr >= 0 || KARDAN.tus)) kdGirdiBirak(); });
addEventListener('keydown', e => {
  const o = KARDAN.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  kdSahip(e); const k = o.kd; kdKullanici(o);
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') KARDAN.tus = -1;
  else if (e.code === 'ArrowRight' || e.code === 'KeyD') KARDAN.tus = 1;
  else if (!e.repeat && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE')) {
    if (k.faz === 'parca') { const s = kdSiradaki(o); if (s) kdParcaUc(o, s, false); }
    else if (k.faz === 'top' && k.top && (k.top.durum === 'yuvarla' || k.top.durum === 'git')) { const b = k.top, [lo, hi] = kdTopSinir(o, b); b.v = (b.x >= hi - 3 ? -1 : 1) * 200; }
  }
}, true);
addEventListener('keyup', e => {
  if (!KARDAN.aktif) return;
  if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && KARDAN.tus < 0) KARDAN.tus = 0;
  if ((e.code === 'ArrowRight' || e.code === 'KeyD') && KARDAN.tus > 0) KARDAN.tus = 0;
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = KARDAN.aktif; if (o && d !== 'mola' && d !== 'duraklat') kdBirak(o, false); kdGirdiBirak(); });

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" (Feza solda, yakın) kadrajı ezer. Kardan etkinliğinde dikkat kadrajı geçerli olsun
// (oyun.js'te Bölüm 5 volkanMini için yapılan istisnanın aynısı). CORE oyun.js'e istisna eklerse bu sarmalayıcı zararsızdır.
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.kdSarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'kardanMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.kdSarili = true;
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('kardanMini', {
  kur(o) {
    o.done = false;
    o.kd = { aktif: false, faz: 'bekle', dur: null, fT: 0, t: 0, n: 0, mask: 0, top: null, parca: [], idle: 0, helpOn: false, helpT: 0, helpN: 0, hDir: 1,
      entry: { x: o.x - KD_AKTIF, y: o.y, safeX: o.x - KD_AKTIF, safeY: o.y, f: 1 }, pr: { x: o.x - 300, y: o.y - 130, f: 1 }, sevT: 0, wob: 0, ct: 0, dogT: -1, sonT: 0,
      bitti: false, basladi: false, iz: null, kameraFn: null };
    o.kd.kameraFn = typeof omDkEkle === 'function' ? () => omDkEkle(o.x - 455, o.y - 320, o.x + KD_SAG + 20, o.y + 25) : null;
    o.adim = dt => kdAdim(o, dt);
    KARDAN.o = o; kdSprite();
  },
  guncelle: kdGuncelle, ciz: kdCiz, cizOn: kdCizOn
});
