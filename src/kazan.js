/* kazan.js – Bölüm 8 (Balkabağı Gecesi) mini oyun 3: CADI NİNE'NİN KAZANI (önek kz8), nesne türü 'kazanMini'. Sahibi: KAZAN.
   Bahçede küçük taşların üstünde kocaman, yuvarlak, fokurdayan bir kazan; altında ateş YOK, yumuşak SİHİRLİ IŞIK (parlayan ışık
   taşları, tehlikesiz). Yanında küçük tahta tabureye çıkmış Cadı Nine (tombul, pembe yanaklı, yuvarlak gözlüklü, NORMAL tenli, mor
   yıldızlı eğri uçlu şapka, turuncu örgü şal, şalda minik kara kedi broşu) koca tahta kepçesiyle karıştırır, mırıldanır.
   Feza yaklaşınca kadraj yumuşakça yerleşir (kardan.js gibi: P.ucus = o ile fizik devralınır, Feza'yı ve Pırıl'ı bu dosya çizer).
   Nine el sallar, kepçeyle kazana vurur; kazandan dört IŞIK BALONCUĞU yükselir: yıldız, şeker, minik kabak, ay çiçeği. Feza her birini
   parmağıyla (fareyle de) kazana SÜRÜKLER — ya da dokunur, malzeme kendiliğinden uçar. Kazana yaklaşan malzemeyi kazan kendisi yakalar;
   uzağa bırakılan yerine süzülür (yanlış yok). Kazana ya da Nine'ye dokunmak da sıradakini getirir. Klavye yedeği: Boşluk/Enter/E/→.
   Her malzemede: şıp! sıçrama, iksirin rengi değişir (altın → pembe → nane → lila), köpürür, gökkuşağı baloncukları ve tatlı kokulu
   ışık bulutu yükselir; Nine alkışlar, sevinir, koklar. Dördüncüde büyük, yumuşak bir PUF: gökkuşağı girdabı yükselir ve iksirden
   SÜPÜRGE canlanır (kalkar, sevinçle döner, çalısını sallar, Feza'nın önüne süzülüp sokulur), sonra sütun 646'daki kalkış yerine
   süzülür. Kaybetme/yazı/öğretici el yok; ipucu ışıkla (sıradaki malzeme parlar, kazana doğru ışık tozu akar, Pırıl yanına uçar).
   ~25 sn dokunulmazsa (sonrakilerde ~12 sn) Pırıl sıradaki malzemeyi kendisi taşıyıp kazana bırakır; çocuk dokununca bırakır.
   Durum: süpürge kalkış yerine varınca (kadraj uçuş boyunca sahnede ve 646'yı da içine alır) Feza bırakılır; aynı anda o.done,
   V8.kazan = true (kapı açılır), V8.supurgeHazir = true ve OLAY 'kazanBitti'.
   Olaylar: 'kazanBasla' {o} · 'kazanMalzeme' {o, n, ad} (n = 1..4) · 'kazanPuf' {o} · 'kazanBitti' {o, supurge: {x, y, aci, s}}
     (süpürge kalkış yerine varınca). Ses efektleri (muzik.js): kazanFokur, kazanMalzeme (v = n), kazanPuf, supurgeCanlan, parilti.
   Kapı: miniKapi (643) o.done / o.tk.bitti ile açılır (kapi.js 'takim' bayrağını okur; CORE ayrıca kazanMini'yi tanıyabilir).
   Süpürge devri (supurge.js): KAZAN.supurge = {x, y, aci, s, yon, kipir, isik, gorunur, hazir}; kazan.js süpürgeyi kalkış yerinde
     salınırken çizmeyi V8.supurgeAldi = true olana kadar sürdürür (supurge.js kendi çizdiği karede bunu ayarlar). KAZAN.elSalla().
   Ortak çiziciler (karede gradyan/filtre yok, bütün parçalar önbellekli sprite):
   cadiCiz(c, x, y, s, t, o) — (x, y) ayak tabanı (zemin), s ölçek, t sn. tip 'nine' s = 1 ≈ 176 birim boy (şapka ucu dahil; Feza ≈ 80),
     tip 'kiz' s = 1 ≈ 88 birim (şapkası dahil; Feza ≈ 84). o: { tip: 'nine'|'kiz', yon: ±1 (1 sağa bakar), karistir 0..1
     (kepçeyle karıştırma; kepceUcX/kepceUcY verilirse kepçenin ucu o noktada (çağıranın koordinatı), kepceBatik: ucu iksirin içinde),
     sevinc 0..1 (hoplar, gözler mutlulukla kapanır, ağız açık), el 0..1 (el sallar), alkis 0..1, dans 0..1 (faz: dans saati, sn;
     saniyede iki vuruş), mirildan 0..1 (kapalı "mmm" ağız), konus 0..1 (konuşur), bakX/bakY −1..1 (bakış), egil (öne eğilme, radyan),
     alfa; yalnız 'kiz': sasir 0..1 (gözler iri, kaşlar havada, "o" ağız, eller yanakta), asa 0..1 (ucu yıldızlı asayı kaldırıp sallar;
     asaVar: indirilmiş asayı elde tutar) }. Dönüş: kepçe çizgisi { kepce, ax, ay (sap ucu), bx, by (kepçe ucu) } (çağıranın koordinatında; kazanın önünü çizen
     kepçenin iksire giren parçasını yeniden çizebilsin diye).
   kazanSupurgeCiz(c, x, y, s, t, o) — süpürge (bkz. b8/istek/KAZAN_SUPURGE.md). (x, y) oturma yeri, o: { aci, yon, kipir, isik, alfa }.
   Yerleşim (bolum8.js): nesne('kazanMini', 626, yuzey(626), {x0, x1}); o.x-480 … o.x+170 DÜZ zemin; Feza o.x-400'ü geçince başlar. */
'use strict';
const KZ8_KX = -20;                      // kazanın ortası (o.x'e göre)
const KZ8_NX = 92;                       // Cadı Nine'nin taburesi (o.x'e göre); Nine sola, kazana bakar
const KZ8_TAB = 30;                      // tabure boyu
const KZ8_AGIZ = -62;                    // kazan ağzının ortası (zemine göre)
const KZ8_IKS = -60;                     // iksir yüzeyi
const KZ8_IRX = 46, KZ8_IRY = 8.8;       // iksir yüzeyinin yarı eksenleri
const KZ8_AKTIF = 400;                   // Feza o.x - 400'ü geçince etkinlik başlar
const KZ8_GIR0 = -470, KZ8_GIR1 = -300;  // Feza'nın oyun boyunca durduğu yerin sınırları (o.x'e göre)
const KZ8_GEL = 1.1, KZ8_CIK = 1.15, KZ8_IPUCU = 3.5, KZ8_GOSTER = 9, KZ8_YARDIM = 25, KZ8_YARDIM2 = 12;
const KZ8_BS = 1.24;                     // havada bekleyen malzeme baloncuğunun ölçeği (5 yaş parmağı için iri, Kabak Yüzü baloncuklarına yakın)
const KZ8_YAKALA = 78, KZ8_BIRAK = 165;  // sürüklenen malzemeyi kazan bu uzaklıkta kendisi yakalar · bırakınca kazana gider
const KZ8_SUP_YER = { x: 25860, y: 676 };   // süpürgenin bekleyeceği yer (sütun 646; kur'da yeniden hesaplanır)
// iksir renkleri: başta uykulu mor-mavi → altın → pembe → nane → lila → (puf sonrası) gökkuşağı
const KZ8_RENK = ['#9a88f0', '#ffd25a', '#ff8fc8', '#7dffc4', '#c39bff', '#ffbfe6'];
const KZ8_GOK = ['#ff8fa3', '#ffb347', '#ffe27a', '#7dffc4', '#7fc8ff', '#c39bff'];   // gökkuşağı
// malzemeler: ad, havada süzüleceği yer (o.x, o.y'ye göre; yay biraz sola/aşağı: 4:3 iPad'de sağ üstteki ayın üstüne binmesin), ışık rengi
const KZ8_MALZ = [
  { ad: 'yildiz', fx: -318, fy: -190, renk: '#ffe27a' },
  { ad: 'seker', fx: -232, fy: -262, renk: '#ff9fd3' },
  { ad: 'kabak', fx: -136, fy: -290, renk: '#ffb35c' },
  { ad: 'ayCicegi', fx: -44, fy: -248, renk: '#d9c8ff' }];
const KZ8_BOS = {};
const KAZAN = {
  o: null, ptr: -1, px: 0, py: 0, pt: 0, yol: 0, tut: null, tutUzak: 0,
  supurge: { x: 0, y: 0, aci: 0, s: 1, yon: 1, kipir: 0, isik: 0, alfa: 0, gorunur: false, hazir: false },
  get aktif() { const o = this.o; return o && o.kz && o.kz.aktif && !o.done ? o : null; },
  elSalla() { const o = this.o; if (o && o.kz) o.kz.nine.elT = 2.2; }
};
function kz8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function kz8Isik(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }
function kz8IsikE(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }

// ═══════════════════════════════ önbellek tuvalleri ═══════════════════════════════
// Yerel (x0, y0, w, h) kutusu, K piksel/birim; ilk kullanımda bir kez çizilir.
const KZ8_SPR = new Map();
function kz8Tuval(ad, x0, y0, w, h, fn, K) {
  let c = KZ8_SPR.get(ad); if (c) return c;
  K = K || 4;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; KZ8_SPR.set(ad, c); return c;
}
function kz8Koy(c, sp, x, y) { c.drawImage(sp, x + sp.x0, y + sp.y0, sp.w, sp.h); }
function kz8KoyS(c, sp, x, y, k) { c.drawImage(sp, x + sp.x0 * k, y + sp.y0 * k, sp.w * k, sp.h * k); }
function kz8Yildiz(q, x, y, r, ic, rot) {   // beş köşeli yıldız yolu
  q.beginPath();
  for (let i = 0; i < 10; i++) { const a = (rot || 0) - Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * (ic || 0.46) : r; i ? q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr) : q.moveTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  q.closePath();
}
function kz8YildizTombul(q, x, y, r, ic) {   // köşeleri yuvarlak tombul yıldız
  q.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5, a2 = a + 2 * Math.PI / 5;
    const ox = x + Math.cos(a) * r, oy = y + Math.sin(a) * r, ix = x + Math.cos(b) * r * ic, iy = y + Math.sin(b) * r * ic;
    if (!i) q.moveTo(x + Math.cos(a - 0.12) * r * 0.94, y + Math.sin(a - 0.12) * r * 0.94);
    q.quadraticCurveTo(ox, oy, x + Math.cos(a + 0.12) * r * 0.94, y + Math.sin(a + 0.12) * r * 0.94);
    q.quadraticCurveTo(ix, iy, x + Math.cos(a2 - 0.12) * r * 0.94, y + Math.sin(a2 - 0.12) * r * 0.94);
  }
  q.closePath();
}
function kz8Isilti(q, x, y, r) {   // dört köşeli ışıltı
  q.beginPath(); q.moveTo(x, y - r); q.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y); q.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  q.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y); q.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r); q.closePath();
}
function kz8Lin(q, x0, y0, x1, y1, stops) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < stops.length; i += 2) gr.addColorStop(stops[i], stops[i + 1]); return gr; }
function kz8Rad(q, x0, y0, r0, x1, y1, r1, stops) { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); for (let i = 0; i < stops.length; i += 2) gr.addColorStop(stops[i], stops[i + 1]); return gr; }
function kz8Hex(a, b, t) {   // iki #rrggbb arası → #rrggbb (yalnız önbellek tuvali üretirken)
  const A = hex(a), B = hex(b), h2 = v => { const s = Math.round(clamp(v, 0, 255)).toString(16); return s.length < 2 ? '0' + s : s; };
  return '#' + h2(lerp(A[0], B[0], t)) + h2(lerp(A[1], B[1], t)) + h2(lerp(A[2], B[2], t));
}
function kz8Golge() {
  return kz8Tuval('golge', -64, -16, 128, 32, q => { q.scale(1, 0.25); q.fillStyle = kz8Rad(q, 0, 0, 0, 0, 0, 62, [0, 'rgba(34,18,64,0.5)', 0.6, 'rgba(34,18,64,0.22)', 1, 'rgba(34,18,64,0)']); q.beginPath(); q.arc(0, 0, 62, 0, 6.2832); q.fill(); }, 2);
}

// ═══════════════════════════════ CADI NİNE (parçalar) ═══════════════════════════════
const KZ8_KONTUR = 'rgba(42,24,72,0.55)';
function kz8NineGovde() {   // elbise (önlüklü), ayakkabı uçları; taban (0,0)
  return kz8Tuval('n_govde', -48, -82, 96, 88, q => {
    // ayakkabılar (eteğin altından görünür)
    for (const sx of [-14, 14]) {
      q.fillStyle = '#4e3150'; q.beginPath(); q.ellipse(sx, -2.2, 10.5, 5.6, 0, 0, 6.2832); q.fill();
      q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.4; q.stroke();
      q.fillStyle = 'rgba(200,160,210,0.55)'; q.beginPath(); q.ellipse(sx - 2.5, -4.6, 4.5, 1.6, -0.15, 0, 6.2832); q.fill();
    }
    const yol = () => {
      q.beginPath(); q.moveTo(-17, -73); q.quadraticCurveTo(-30, -71, -32, -53); q.bezierCurveTo(-34, -37, -46, -23, -42.5, -6);
      for (let i = 0; i < 7; i++) { const xa = -42.5 + i * 12.14, xb = xa + 12.14; q.quadraticCurveTo((xa + xb) / 2, 1.8, xb, -5.6); }
      q.bezierCurveTo(46, -23, 34, -37, 32, -53); q.quadraticCurveTo(30, -71, 17, -73); q.quadraticCurveTo(0, -77, -17, -73); q.closePath();
    };
    yol(); q.fillStyle = kz8Lin(q, -46, 0, 46, 0, [0, '#8467cc', 0.42, '#5f4399', 1, '#3f2873']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = kz8Rad(q, -16, -52, 2, -16, -52, 40, [0, 'rgba(196,168,255,0.42)', 1, 'rgba(196,168,255,0)']); q.fillRect(-48, -82, 96, 88);
    q.fillStyle = kz8Rad(q, 18, -10, 2, 18, -10, 40, [0, 'rgba(20,8,48,0.35)', 1, 'rgba(20,8,48,0)']); q.fillRect(-48, -82, 96, 88);
    const r = rng(8801);
    for (let i = 0; i < 16; i++) { const x = -40 + r() * 80, y = -66 + r() * 56; q.fillStyle = 'rgba(255,233,168,' + (0.35 + r() * 0.3).toFixed(2) + ')'; kz8Isilti(q, x, y, 1.4 + r() * 1.3); q.fill(); }
    q.strokeStyle = '#ac93ea'; q.lineWidth = 3.6; q.beginPath(); q.moveTo(-44, -9.5);
    for (let i = 0; i < 7; i++) { const xa = -42.5 + i * 12.14, xb = xa + 12.14; q.quadraticCurveTo((xa + xb) / 2, -2.4, xb, -9.6); } q.stroke();
    // önlük bağı (belde)
    q.fillStyle = '#fff2dc'; q.fillRect(-48, -51, 96, 5.5); q.fillStyle = 'rgba(214,186,150,0.6)'; q.fillRect(-48, -46.2, 96, 0.9);
    q.restore();
    yol(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.8; q.stroke();
    // önlük: krem, fırfırlı, cebinde minik kabak
    const on = () => { q.beginPath(); q.moveTo(-19, -46); q.lineTo(19, -46); q.quadraticCurveTo(21, -26, 18, -15); q.quadraticCurveTo(0, -7, -18, -15); q.quadraticCurveTo(-21, -26, -19, -46); q.closePath(); };
    on(); q.fillStyle = kz8Lin(q, 0, -46, 0, -8, [0, '#fff6e6', 1, '#f2dcbc']); q.fill(); q.strokeStyle = 'rgba(176,140,100,0.7)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = '#fffaf0'; for (let i = 0; i < 7; i++) { const u = i / 6, x = lerp(-17, 17, u), y = -14.5 + Math.sin(u * Math.PI) * 6.2; q.beginPath(); q.arc(x, y, 2.6, 0, 6.2832); q.fill(); }
    q.strokeStyle = 'rgba(190,150,110,0.6)'; q.lineWidth = 1; q.setLineDash([1.6, 1.6]); q.beginPath(); q.roundRect ? q.roundRect(-8.5, -33, 17, 12, 3) : q.rect(-8.5, -33, 17, 12); q.stroke(); q.setLineDash([]);
    q.fillStyle = '#ff9a3c'; q.beginPath(); q.ellipse(0, -26.6, 3.8, 3.2, 0, 0, 6.2832); q.fill(); q.strokeStyle = '#d0661e'; q.lineWidth = 0.7; q.beginPath(); q.moveTo(0, -29.6); q.lineTo(0, -23.6); q.stroke();
    q.strokeStyle = '#6a9a3a'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(0, -29.4); q.quadraticCurveTo(0.6, -31.4, 1.8, -31.8); q.stroke();
  });
}
function kz8NineSal() {   // turuncu örgü şal + kara kedi broşu
  return kz8Tuval('n_sal', -40, -84, 80, 44, q => {
    const yol = () => { q.beginPath(); q.moveTo(-31, -64); q.quadraticCurveTo(-28, -77, -14, -78.5); q.quadraticCurveTo(0, -81, 14, -78.5); q.quadraticCurveTo(28, -77, 31, -64);
      q.lineTo(33.5, -55); q.quadraticCurveTo(17, -53, 0, -45.5); q.quadraticCurveTo(-17, -53, -33.5, -55); q.closePath(); };
    yol(); q.fillStyle = kz8Lin(q, 0, -81, 0, -46, [0, '#ffc47e', 0.45, '#f39a48', 1, '#d8762e']); q.fill();
    q.save(); yol(); q.clip();
    q.strokeStyle = 'rgba(190,96,30,0.4)'; q.lineWidth = 0.8;
    for (let y = -78; y < -44; y += 3.2) for (let x = -34 + ((y / 3.2) & 1) * 1.6; x < 34; x += 3.2) { q.beginPath(); q.moveTo(x - 1.1, y - 0.9); q.lineTo(x, y + 0.5); q.lineTo(x + 1.1, y - 0.9); q.stroke(); }
    q.strokeStyle = '#ffd7a0'; q.lineWidth = 2;
    for (const k of [4.5, 9]) { q.beginPath(); q.moveTo(-34, -55 - k * 0.8); q.quadraticCurveTo(-17, -53 - k, 0, -45.5 - k); q.quadraticCurveTo(17, -53 - k, 34, -55 - k * 0.8); q.stroke(); }
    q.fillStyle = 'rgba(255,240,210,0.35)'; q.beginPath(); q.ellipse(-14, -74, 12, 3.6, -0.15, 0, 6.2832); q.fill();
    q.restore();
    yol(); q.strokeStyle = 'rgba(150,70,20,0.6)'; q.lineWidth = 1.5; q.stroke();
    // saçak
    q.strokeStyle = '#e8813a'; q.lineWidth = 1.3;
    for (let i = 0; i <= 22; i++) { const u = i / 22, sol = u < 0.5, v = sol ? u * 2 : (u - 0.5) * 2;
      const x = sol ? lerp(-33.5, 0, v) : lerp(0, 33.5, v), y = sol ? lerp(-55, -45.5, v) + Math.sin(v * Math.PI) * 1.6 : lerp(-45.5, -55, v) + Math.sin(v * Math.PI) * 1.6;
      q.beginPath(); q.moveTo(x, y); q.lineTo(x + (sol ? -0.6 : 0.6), y + 4.2); q.stroke(); }
    // kara kedi broşu: altın halka içinde kedi başı
    q.fillStyle = '#ffd36a'; q.beginPath(); q.arc(0, -53, 6.4, 0, 6.2832); q.fill(); q.strokeStyle = '#b97f22'; q.lineWidth = 1; q.stroke();
    q.fillStyle = '#2b2238'; q.beginPath(); q.arc(0, -52.4, 4.2, 0, 6.2832); q.fill();
    q.beginPath(); q.moveTo(-3.9, -54.6); q.lineTo(-3.4, -59.3); q.lineTo(-0.8, -56.2); q.closePath(); q.fill();
    q.beginPath(); q.moveTo(3.9, -54.6); q.lineTo(3.4, -59.3); q.lineTo(0.8, -56.2); q.closePath(); q.fill();
    q.fillStyle = '#ffe066'; q.beginPath(); q.arc(-1.6, -53, 0.95, 0, 6.2832); q.arc(1.6, -53, 0.95, 0, 6.2832); q.fill();
    q.fillStyle = '#ff9ab0'; q.beginPath(); q.arc(0, -51.4, 0.6, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(-3.6, -56.4, 1, 0, 6.2832); q.fill();
  });
}
function kz8NineUstKol() {   // omuzdan (0,0) dirseğe (0,15): kabarık kol
  return kz8Tuval('n_ustkol', -11, -9, 22, 32, q => {
    q.beginPath(); q.moveTo(-8.2, 0); q.bezierCurveTo(-9.8, 7.5, -8.6, 14, -6.6, 18); q.quadraticCurveTo(0, 21.2, 6.6, 18); q.bezierCurveTo(8.6, 14, 9.8, 7.5, 8.2, 0); q.quadraticCurveTo(0, -8, -8.2, 0); q.closePath();
    q.fillStyle = kz8Lin(q, -9, 0, 9, 0, [0, '#8467cc', 0.5, '#6447a0', 1, '#47307e']); q.fill(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.5; q.stroke();
    q.fillStyle = 'rgba(200,175,255,0.3)'; q.beginPath(); q.ellipse(-3.2, 4, 2.6, 6, 0.1, 0, 6.2832); q.fill();
  });
}
function kz8NineOnKol() {   // dirsekten (0,0) bileğe (0,15): manşetli
  return kz8Tuval('n_onkol', -8, -7, 16, 27, q => {
    q.beginPath(); q.moveTo(-6.2, 0); q.lineTo(-5.6, 14); q.quadraticCurveTo(0, 16.5, 5.6, 14); q.lineTo(6.2, 0); q.quadraticCurveTo(0, -6.5, -6.2, 0); q.closePath();
    q.fillStyle = kz8Lin(q, -6, 0, 6, 0, [0, '#7a5dc2', 1, '#4a3282']); q.fill(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.4; q.stroke();
    q.fillStyle = '#b8a0f0'; q.beginPath(); q.ellipse(0, 14.9, 6.6, 3.4, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(80,50,150,0.5)'; q.lineWidth = 1; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.45)'; q.beginPath(); q.ellipse(-1.6, 13.9, 3, 1.1, 0, 0, 6.2832); q.fill();
  });
}
function kz8El(ad, r, ten, golge) {   // tombul el (yumru başparmaklı)
  return kz8Tuval(ad, -r - 3, -r - 3, 2 * r + 6, 2 * r + 6, q => {
    q.fillStyle = kz8Rad(q, -r * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.1, [0, '#fff0e2', 0.45, ten, 1, golge]);
    q.beginPath(); q.arc(0, 0, r, 0, 6.2832); q.fill(); q.beginPath(); q.arc(-r * 0.72, -r * 0.42, r * 0.42, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(170,100,70,0.55)'; q.lineWidth = 1.1; q.beginPath(); q.arc(0, 0, r, -2.2, 3.6); q.stroke(); q.beginPath(); q.arc(-r * 0.72, -r * 0.42, r * 0.42, 2.0, 5.3); q.stroke();
  }, 5);
}
function kz8SacTopak(q, list, acik, koyu, kontur) {   // kıvırcık saç topakları: önce dış kontur, sonra dolgu, sonra gölge
  q.strokeStyle = kontur; q.lineWidth = 2.6; for (const [x, y, r] of list) { q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.stroke(); }
  for (const [x, y, r] of list) { q.fillStyle = koyu; q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
  for (const [x, y, r] of list) { q.fillStyle = acik; q.beginPath(); q.arc(x - r * 0.14, y - r * 0.16, r * 0.8, 0, 6.2832); q.fill(); }
}
function kz8NineBas() {   // baş (merkez 0,0): gümüş kıvırcık saç, tombul yanaklar, düğme burun, kaşlar (gözler/gözlük/ağız karede)
  return kz8Tuval('n_bas', -36, -36, 72, 66, q => {
    kz8SacTopak(q, [[-21, -5, 9.5], [-23.5, 6, 7.6], [-17, -15, 9.5], [21, -5, 9.5], [23.5, 6, 7.6], [17, -15, 9.5], [-8, -20, 9], [8, -20, 9], [0, -22, 9]], '#f7f5ff', '#cdc5e8', 'rgba(110,96,160,0.55)');
    const yuz = () => { q.beginPath(); q.moveTo(0, -20); q.bezierCurveTo(14, -20, 22, -10, 22, 1); q.bezierCurveTo(22, 14, 12, 21.5, 0, 21.5); q.bezierCurveTo(-12, 21.5, -22, 14, -22, 1); q.bezierCurveTo(-22, -10, -14, -20, 0, -20); q.closePath(); };
    yuz(); q.fillStyle = kz8Rad(q, -6, -7, 2, -2, 0, 27, [0, '#ffe6d2', 0.5, '#ffd2b2', 1, '#efae8a']); q.fill();
    q.strokeStyle = 'rgba(190,120,90,0.6)'; q.lineWidth = 1.5; q.stroke();
    q.strokeStyle = 'rgba(226,150,120,0.45)'; q.lineWidth = 1.1; q.beginPath(); q.ellipse(0, 17.6, 7.5, 2.6, 0, 0.2, Math.PI - 0.2); q.stroke();   // tombul çene
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,128,156,0.5)'; q.beginPath(); q.ellipse(sx * 12.6, 7.4, 6.2, 4.3, 0, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(sx * 12.6 - 1.8, 5.8, 1.1, 0, 6.2832); q.fill(); }
    q.fillStyle = '#f2a587'; q.beginPath(); q.arc(2.2, 2.6, 3.7, 0, 6.2832); q.fill();   // düğme burun
    q.fillStyle = 'rgba(255,236,224,0.65)'; q.beginPath(); q.arc(1.2, 1.4, 1.3, 0, 6.2832); q.fill();
    q.strokeStyle = '#b8aed6'; q.lineWidth = 1.8; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 8.3 + 1.2, -7.2, 4.6, Math.PI * 1.18, Math.PI * 1.82); q.stroke(); }
    kz8SacTopak(q, [[-12, -16.5, 5.4], [-4, -18.6, 5.8], [4.5, -18.6, 5.8], [12.5, -16, 5.4]], '#f7f5ff', '#cdc5e8', 'rgba(110,96,160,0.5)');
  }, 5);
}
function kz8NineGozluk() {
  return kz8Tuval('n_gozluk', -24, -13, 48, 20, q => {
    for (const sx of [-1, 1]) { const x = sx * 8.3 + 1.2;
      q.fillStyle = 'rgba(255,255,255,0.12)'; q.beginPath(); q.arc(x, -3, 6.9, 0, 6.2832); q.fill();
      q.strokeStyle = '#d29b3a'; q.lineWidth = 1.7; q.stroke();
      q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = 1.2; q.beginPath(); q.arc(x, -3, 5, Math.PI * 1.08, Math.PI * 1.42); q.stroke(); }
    q.strokeStyle = '#d29b3a'; q.lineWidth = 1.5; q.beginPath(); q.moveTo(-0.6, -4.5); q.quadraticCurveTo(1.2, -6.6, 3, -4.5); q.stroke();
    q.lineWidth = 1.3; q.beginPath(); q.moveTo(-14, -4); q.lineTo(-20.5, -5.6); q.moveTo(16.4, -4); q.lineTo(21.5, -5.6); q.stroke();
  }, 5);
}
function kz8NineSapka() {   // mor yıldızlı şapka gövdesi; taban ortası (0,0) başın tepesi, tepe kıvrımı (−1,−48)
  return kz8Tuval('n_sapka', -46, -56, 92, 70, q => {
    q.fillStyle = '#3e2385'; q.beginPath(); q.ellipse(0, 4, 41.5, 10, 0, 0, 6.2832); q.fill();
    q.fillStyle = kz8Lin(q, 0, -8, 0, 10, [0, '#7452d2', 1, '#4f2fa2']); q.beginPath(); q.ellipse(0, 2, 41, 9.5, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(30,14,70,0.55)'; q.lineWidth = 1.5; q.beginPath(); q.ellipse(0, 3, 41.5, 10.2, 0, 0, 6.2832); q.stroke();
    const kon = () => { q.beginPath(); q.moveTo(-20, 1); q.quadraticCurveTo(-16, -24, -7, -47); q.quadraticCurveTo(-1, -50.5, 5, -48); q.quadraticCurveTo(13, -24, 20, 1); q.closePath(); };
    kon(); q.fillStyle = kz8Lin(q, -20, 0, 20, 0, [0, '#9d7cec', 0.45, '#6d48c9', 1, '#4a2e9a']); q.fill();
    q.save(); kon(); q.clip();
    q.strokeStyle = 'rgba(60,30,130,0.35)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(-10, -31); q.quadraticCurveTo(-3, -27, 7, -32); q.stroke();
    q.fillStyle = 'rgba(220,200,255,0.25)'; q.beginPath(); q.ellipse(-9, -18, 3.5, 14, 0.25, 0, 6.2832); q.fill();
    q.fillStyle = '#ffe08a'; for (const [x, y, r] of [[-9, -16, 3.3], [7.5, -27, 2.7], [-2.5, -38, 2.3], [11.5, -9, 2.4]]) { kz8Yildiz(q, x, y, r, 0.48); q.fill(); }
    q.fillStyle = '#fff3c4'; q.beginPath(); q.arc(-9.5, -31, 3, 0, 6.2832); q.fill(); q.fillStyle = '#6a46c6'; q.beginPath(); q.arc(-8.1, -32, 2.6, 0, 6.2832); q.fill();
    q.fillStyle = '#ffb347'; q.fillRect(-22, -9, 44, 8.5); q.fillStyle = '#ffd590'; q.fillRect(-22, -9, 44, 1.6); q.fillStyle = 'rgba(190,100,30,0.5)'; q.fillRect(-22, -1.4, 44, 1);
    q.restore();
    kon(); q.strokeStyle = 'rgba(30,14,70,0.6)'; q.lineWidth = 1.6; q.stroke();
    kz8Yildiz(q, 3, -5, 3.6, 0.5); q.fillStyle = '#fff0a8'; q.fill(); q.strokeStyle = '#d08a2a'; q.lineWidth = 0.8; q.stroke();
    q.beginPath(); q.ellipse(0, 2, 41, 9.5, 0, 0.02, Math.PI - 0.02); q.closePath(); q.fillStyle = kz8Lin(q, 0, 2, 0, 12, [0, '#6c4ac6', 1, '#53319f']); q.fill();   // ön kenar
    q.strokeStyle = 'rgba(170,140,240,0.8)'; q.lineWidth = 1.1; q.beginPath(); q.ellipse(0, 2.4, 39, 8.4, 0, 0.25, Math.PI - 0.25); q.stroke();
  });
}
function kz8NineSapkaUc() {   // eğri, sarkık şapka ucu (kıvrım noktası 0,0) ve ucunda altın yıldız
  return kz8Tuval('n_sapkaUc', -10, -21, 44, 30, q => {
    const yol = () => { q.beginPath(); q.moveTo(-6.4, 1.5); q.quadraticCurveTo(-5, -14.5, 9, -15.5); q.quadraticCurveTo(22.5, -15.5, 27.5, -1); q.quadraticCurveTo(21, -9.2, 10.5, -8.6); q.quadraticCurveTo(4.5, -8.2, 6.6, 1.5); q.closePath(); };
    yol(); q.fillStyle = kz8Lin(q, -6, -14, 20, 2, [0, '#9d7cec', 0.5, '#6d48c9', 1, '#4a2e9a']); q.fill(); q.strokeStyle = 'rgba(30,14,70,0.6)'; q.lineWidth = 1.5; q.stroke();
    q.fillStyle = '#ffe08a'; kz8Yildiz(q, 3, -8, 1.9, 0.5); q.fill();
    kz8Yildiz(q, 28, 1.6, 4.1, 0.5, 0.2); q.fillStyle = '#ffe27a'; q.fill(); q.strokeStyle = '#c98a22'; q.lineWidth = 0.9; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(26.8, 0.4, 0.9, 0, 6.2832); q.fill();
  });
}
function kz8KepceKase() {   // kepçenin kâsesi (karıştırmadığı zaman görünür); kök (0,0), +x yönüne
  return kz8Tuval('n_kase', -2, -8, 18, 16, q => {
    q.fillStyle = '#a8692e'; q.beginPath(); q.ellipse(7, 0, 7.4, 5.4, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#7a4520'; q.beginPath(); q.ellipse(7.4, -0.6, 5.4, 3.4, 0, 0, 6.2832); q.fill();
    q.strokeStyle = '#5a3216'; q.lineWidth = 1; q.beginPath(); q.ellipse(7, 0, 7.4, 5.4, 0, 0, 6.2832); q.stroke();
    q.strokeStyle = 'rgba(255,214,160,0.7)'; q.lineWidth = 0.9; q.beginPath(); q.arc(6, 0.4, 5.8, 0.6, 2.2); q.stroke();
  });
}
function kz8KepceCiz(c, ax, ay, bx, by, w) {   // tahta kepçe sapı (çizgi): (ax,ay) → (bx,by), w kalınlık ölçeği
  c.lineCap = 'round';
  c.strokeStyle = '#6a3e1e'; c.lineWidth = 5.4 * w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
  c.strokeStyle = '#c98a4a'; c.lineWidth = 3.6 * w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke();
  const dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 1, nx = dy / d * 0.8 * w, ny = -dx / d * 0.8 * w;
  c.strokeStyle = 'rgba(248,212,150,0.85)'; c.lineWidth = 1.1 * w; c.beginPath(); c.moveTo(ax + nx, ay + ny); c.lineTo(bx + nx, by + ny); c.stroke();
}

// ═══════════════════════════════ CADI KIZ (parçalar) ═══════════════════════════════
function kz8KizGovde() {   // çizgili çoraplar, tokalı ayakkabılar, yıldızlı elbise, turuncu fiyonk; taban (0,0)
  return kz8Tuval('k_govde', -26, -54, 52, 58, q => {
    for (const sx of [-1, 1]) {   // çoraplar: turuncu-mor çizgili
      const x = sx * 6.6; q.save(); q.beginPath(); q.roundRect ? q.roundRect(x - 3.3, -29, 6.6, 27, 3) : q.rect(x - 3.3, -29, 6.6, 27); q.clip();
      for (let y = -29, i = 0; y < 0; y += 3.4, i++) { q.fillStyle = i % 2 ? '#6b46c8' : '#ff9a3c'; q.fillRect(x - 4, y, 8, 3.4); } q.restore();
      q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.1; q.beginPath(); q.moveTo(x - 3.3, -27); q.lineTo(x - 3.3, -3); q.moveTo(x + 3.3, -27); q.lineTo(x + 3.3, -3); q.stroke();
      q.fillStyle = '#2e2440'; q.beginPath(); q.ellipse(x + sx * 1.2, -2.4, 5.8, 3.4, 0, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(170,150,220,0.6)'; q.beginPath(); q.ellipse(x + sx * 1.2 - 1.6, -3.8, 2.4, 0.9, 0, 0, 6.2832); q.fill();
      q.fillStyle = '#ffd36a'; q.fillRect(x + sx * 1.2 - 1.3, -4.9, 2.6, 2);
    }
    const yol = () => { q.beginPath(); q.moveTo(-9, -49); q.quadraticCurveTo(-13, -46, -14, -40); q.lineTo(-20.5, -27);
      for (let i = 0; i < 5; i++) { const xa = -20.5 + i * 8.2, xb = xa + 8.2; q.quadraticCurveTo((xa + xb) / 2, -21.6, xb, -26.4); }
      q.lineTo(14, -40); q.quadraticCurveTo(13, -46, 9, -49); q.quadraticCurveTo(0, -51.5, -9, -49); q.closePath(); };
    yol(); q.fillStyle = kz8Lin(q, -20, 0, 20, 0, [0, '#b48af0', 0.5, '#9264dc', 1, '#6f45bc']); q.fill();
    q.save(); yol(); q.clip(); const r = rng(5507);
    for (let i = 0; i < 9; i++) { q.fillStyle = 'rgba(255,233,168,0.7)'; kz8Isilti(q, -17 + r() * 34, -46 + r() * 20, 1.2 + r()); q.fill(); }
    q.strokeStyle = '#ffb3dc'; q.lineWidth = 2.4; q.beginPath(); q.moveTo(-21, -29.4); for (let i = 0; i < 5; i++) { const xa = -20.5 + i * 8.2, xb = xa + 8.2; q.quadraticCurveTo((xa + xb) / 2, -25, xb, -29.6); } q.stroke();
    q.restore(); yol(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.5; q.stroke();
    q.fillStyle = '#ff9a3c'; for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(0, -45); q.quadraticCurveTo(sx * 5, -50, sx * 6.5, -46); q.quadraticCurveTo(sx * 6, -42, 0, -45); q.fill(); }
    q.fillStyle = '#ffbe6e'; q.beginPath(); q.arc(0, -45, 1.9, 0, 6.2832); q.fill();
  });
}
function kz8KizPelerin() {   // sırttaki minik pelerin (pembe astarlı), omuzlardan sarkar
  return kz8Tuval('k_pelerin', -24, -52, 48, 30, q => {
    q.beginPath(); q.moveTo(-9, -49); q.quadraticCurveTo(-19, -40, -22, -26); q.quadraticCurveTo(0, -22, 22, -26); q.quadraticCurveTo(19, -40, 9, -49); q.closePath();
    q.fillStyle = kz8Lin(q, -20, 0, 20, 0, [0, '#5a3a92', 1, '#3e2570']); q.fill(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.3; q.stroke();
    q.fillStyle = '#ff9fd0'; q.beginPath(); q.moveTo(-21.5, -26.6); q.quadraticCurveTo(0, -22.6, 21.5, -26.6); q.quadraticCurveTo(0, -25, -21.5, -26.6); q.fill();
  });
}
function kz8KizKol(ad, uz, gen) {   // kabarık kısa kol (0,0) → (0,uz)
  return kz8Tuval(ad, -gen - 2, -gen - 2, gen * 2 + 4, uz + gen + 6, q => {
    q.beginPath(); q.moveTo(-gen, 0); q.quadraticCurveTo(-gen - 0.8, uz * 0.6, -gen * 0.7, uz); q.quadraticCurveTo(0, uz + gen * 0.55, gen * 0.7, uz); q.quadraticCurveTo(gen + 0.8, uz * 0.6, gen, 0); q.quadraticCurveTo(0, -gen * 1.1, -gen, 0); q.closePath();
    q.fillStyle = kz8Lin(q, -gen, 0, gen, 0, [0, '#b48af0', 1, '#7a50c8']); q.fill(); q.strokeStyle = KZ8_KONTUR; q.lineWidth = 1.2; q.stroke();
  });
}
function kz8KizBas() {   // baş (merkez 0,0): zencefil saç, çiller, pembe yanaklar (gözler/ağız karede)
  return kz8Tuval('k_bas', -26, -26, 52, 50, q => {
    q.fillStyle = '#c8602a'; q.beginPath(); q.arc(0, -2.5, 19, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(120,50,20,0.55)'; q.lineWidth = 1.6; q.stroke();
    const yuz = () => { q.beginPath(); q.moveTo(0, -15.5); q.bezierCurveTo(11, -15.5, 16.5, -7, 16.5, 1.5); q.bezierCurveTo(16.5, 11.5, 9, 16.5, 0, 16.5); q.bezierCurveTo(-9, 16.5, -16.5, 11.5, -16.5, 1.5); q.bezierCurveTo(-16.5, -7, -11, -15.5, 0, -15.5); q.closePath(); };
    yuz(); q.fillStyle = kz8Rad(q, -5, -5, 2, -2, 0, 21, [0, '#ffe2c8', 0.55, '#f8c9a2', 1, '#e8a77e']); q.fill(); q.strokeStyle = 'rgba(180,110,80,0.6)'; q.lineWidth = 1.3; q.stroke();
    for (const sx of [-1, 1]) { q.fillStyle = 'rgba(255,120,150,0.5)'; q.beginPath(); q.ellipse(sx * 10, 6.6, 4.4, 3, 0, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(190,110,70,0.65)'; for (const [dx, dy] of [[-1.8, 3.4], [0.6, 2.6], [2.4, 4.2], [-0.4, 5]]) { q.beginPath(); q.arc(sx * 10 + dx * sx, dy - 1.5, 0.55, 0, 6.2832); q.fill(); } }
    q.fillStyle = '#eea07c'; q.beginPath(); q.arc(1.4, 3, 1.7, 0, 6.2832); q.fill();
    // kâkül: üç kıvrım
    q.fillStyle = '#f08a3c'; q.beginPath(); q.moveTo(-16.5, -2); q.quadraticCurveTo(-17, -16, -3, -17.5); q.quadraticCurveTo(12, -18.5, 16.5, -3);
    q.quadraticCurveTo(12, -9.5, 7, -8); q.quadraticCurveTo(4, -12, 0, -9); q.quadraticCurveTo(-4, -12.5, -8, -8.5); q.quadraticCurveTo(-13, -10, -16.5, -2); q.closePath(); q.fill();
    q.strokeStyle = 'rgba(140,60,20,0.5)'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = 'rgba(255,200,140,0.5)'; q.beginPath(); q.ellipse(-6, -14, 5, 1.6, -0.2, 0, 6.2832); q.fill();
  }, 5);
}
function kz8KizOrgu() {   // tek örgü topuzu (kök 0,0 → aşağı), naneli fiyonk
  return kz8Tuval('k_orgu', -10, -6, 20, 26, q => {
    q.fillStyle = '#e8803a'; q.beginPath(); q.ellipse(0, 9, 6.4, 9, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(130,56,20,0.55)'; q.lineWidth = 1.3; q.stroke();
    q.strokeStyle = 'rgba(170,80,30,0.55)'; q.lineWidth = 1; for (const y of [6, 10.5, 14.5]) { q.beginPath(); q.moveTo(-5, y - 1.2); q.quadraticCurveTo(0, y + 1.6, 5, y - 1.2); q.stroke(); }
    q.fillStyle = 'rgba(255,200,140,0.45)'; q.beginPath(); q.ellipse(-2.2, 6, 1.6, 4, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#7dffc4'; for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(sx * 6, -4.5, sx * 6.5, 0.5); q.quadraticCurveTo(sx * 5, 3, 0, 0); q.fill(); }
    q.strokeStyle = 'rgba(40,140,100,0.6)'; q.lineWidth = 0.8; for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(sx * 6, -4.5, sx * 6.5, 0.5); q.quadraticCurveTo(sx * 5, 3, 0, 0); q.stroke(); }
    q.fillStyle = '#c8fff0'; q.beginPath(); q.arc(0, 0, 1.7, 0, 6.2832); q.fill();
  });
}
function kz8KizSapka() {   // minik mor sivri şapka; taban (0,0)
  return kz8Tuval('k_sapka', -26, -34, 52, 42, q => {
    q.fillStyle = '#4a2c95'; q.beginPath(); q.ellipse(0, 1.5, 22.5, 5.6, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#6a46c6'; q.beginPath(); q.ellipse(0, 0.6, 22, 5.2, 0, 0, 6.2832); q.fill();
    const kon = () => { q.beginPath(); q.moveTo(-11, 0.6); q.quadraticCurveTo(-8, -14, -2.5, -24); q.quadraticCurveTo(2, -30, 9, -29); q.quadraticCurveTo(4, -26, 3, -22); q.quadraticCurveTo(7, -12, 11, 0.6); q.closePath(); };
    kon(); q.fillStyle = kz8Lin(q, -11, 0, 11, 0, [0, '#a280ee', 0.5, '#7a4fd6', 1, '#5232a8']); q.fill(); q.strokeStyle = 'rgba(30,14,70,0.6)'; q.lineWidth = 1.3; q.stroke();
    q.save(); kon(); q.clip(); q.fillStyle = '#ff8fc8'; q.fillRect(-12, -5, 24, 5); q.restore();
    q.fillStyle = '#ffe08a'; kz8Yildiz(q, 1, -12, 2.6, 0.48); q.fill(); kz8Yildiz(q, 9, -29, 2.4, 0.5); q.fill();
    q.beginPath(); q.ellipse(0, 0.6, 22, 5.2, 0, 0.02, Math.PI - 0.02); q.closePath(); q.fillStyle = '#6040b8'; q.fill();
    q.strokeStyle = 'rgba(30,14,70,0.55)'; q.lineWidth = 1.2; q.beginPath(); q.ellipse(0, 1, 22.4, 5.6, 0, 0, 6.2832); q.stroke();
  });
}

// ═══════════════════════════════ cadiCiz ═══════════════════════════════
const KZ8_CO = { kepce: false, ax: 0, ay: 0, bx: 0, by: 0 };
const KZ8_IKO = { ex: 0, ey: 0, hx: 0, hy: 0 };
const KZ8_TF = { x: 0, y: 0, sx: 1, s: 1, hop: 0, sw: 0, sq: 0, eg: 0, bel: -46 };
const KZ8_KIZ = 0.8;   // Cadı Kız'ın iç ölçeği: s = 1'de şapkası dahil ≈ 88 birim
function kz8IK(sx, sy, hx, hy, L1, L2, out) {   // iki kemikli kol: dirsek her zaman aşağıda kalan çözüm
  let dx = hx - sx, dy = hy - sy, d = Math.hypot(dx, dy);
  if (d < 1e-4) { dx = 0; dy = 1; d = 1e-4; }
  const dd = clamp(d, Math.abs(L1 - L2) + 0.5, L1 + L2 - 0.02), th = Math.atan2(dy, dx);
  const a = Math.acos(clamp((L1 * L1 + dd * dd - L2 * L2) / (2 * L1 * dd), -1, 1));
  const e1x = sx + Math.cos(th + a) * L1, e1y = sy + Math.sin(th + a) * L1, e2x = sx + Math.cos(th - a) * L1, e2y = sy + Math.sin(th - a) * L1;
  if (e1y >= e2y) { out.ex = e1x; out.ey = e1y; } else { out.ex = e2x; out.ey = e2y; }
  out.hx = sx + Math.cos(th) * dd; out.hy = sy + Math.sin(th) * dd;
  return out;
}
function kz8Parca(c, sp, x0, y0, x1, y1) {   // +y yönüne çizilmiş parça sprite'ını (x0,y0)'dan (x1,y1)'e çevirip koy
  const M = c.getTransform(); c.translate(x0, y0); c.rotate(Math.atan2(-(x1 - x0), y1 - y0)); kz8Koy(c, sp, 0, 0); c.setTransform(M);
}
// Gövde çerçevesindeki noktayı çağıranın koordinatına çevir (kz8NineCiz dönüşümleriyle aynı)
function kz8Ileri(px, py, out) {
  const f = KZ8_TF, b = f.bel; let x = px, y = py - b; const ce = Math.cos(f.eg), se = Math.sin(f.eg);
  let x1 = x * ce - y * se, y1 = x * se + y * ce + b;
  x1 *= 1 + f.sq; y1 *= 1 - f.sq;
  const cs = Math.cos(f.sw), ss = Math.sin(f.sw); x = x1 * cs - y1 * ss; y = x1 * ss + y1 * cs - f.hop;
  out[0] = f.x + x * f.sx; out[1] = f.y + y * f.s; return out;
}
function kz8Geri(X, Y, out) {
  const f = KZ8_TF; let x = (X - f.x) / f.sx, y = (Y - f.y) / f.s + f.hop;
  const cs = Math.cos(-f.sw), ss = Math.sin(-f.sw); let x1 = x * cs - y * ss, y1 = x * ss + y * cs;
  x1 /= 1 + f.sq; y1 /= 1 - f.sq;
  const b = f.bel, ce = Math.cos(-f.eg), se = Math.sin(-f.eg); y1 -= b;
  out[0] = x1 * ce - y1 * se; out[1] = x1 * se + y1 * ce + b; return out;
}
const KZ8_P2 = [0, 0], KZ8_P3 = [0, 0];
function kz8Goz(c, x, y, rx, ry, mutlu, kapak, bx, by, parla) {   // göz: açık (bakış + parıltı), mutlu kavis ya da kırpma
  if (mutlu > 0.5) { c.strokeStyle = '#3a2846'; c.lineWidth = 1.8; c.beginPath(); c.arc(x, y + ry * 0.45, rx * 1.15, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); return; }
  if (kapak < 0.25) { c.strokeStyle = '#3a2846'; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y - ry * 0.3, rx * 1.1, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); return; }
  c.fillStyle = '#35243f'; c.beginPath(); c.ellipse(x + bx, y + by, rx, ry * kapak, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x + bx - rx * 0.32, y + by - ry * 0.34 * kapak, rx * 0.38, 0, 6.2832); c.fill();
  if (parla) { c.beginPath(); c.arc(x + bx + rx * 0.35, y + by + ry * 0.3 * kapak, rx * 0.2, 0, 6.2832); c.fill(); }
}
function kz8Agiz(c, x, y, w, acik, mir, dil) {   // gülümseme: kapalı · açık (dil) · mırıldanma
  if (mir > 0.5 && acik < 0.2) { c.strokeStyle = '#8a3a4a'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - w * 0.42, y); c.quadraticCurveTo(x, y + w * 0.32, x + w * 0.42, y); c.stroke(); return; }
  if (acik < 0.12) { c.strokeStyle = '#8a3a4a'; c.lineWidth = 1.7; c.beginPath(); c.moveTo(x - w, y - 0.6); c.quadraticCurveTo(x, y + w * 0.75, x + w, y - 0.6); c.stroke();
    c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - w - 1.1, y - 1.6); c.lineTo(x - w + 0.3, y + 0.2); c.moveTo(x + w + 1.1, y - 1.6); c.lineTo(x + w - 0.3, y + 0.2); c.stroke(); return; }
  const d = w * (0.45 + 0.6 * acik);
  c.fillStyle = '#7a2c44'; c.beginPath(); c.moveTo(x - w, y - 0.8); c.quadraticCurveTo(x, y + 0.9, x + w, y - 0.8); c.quadraticCurveTo(x + w * 0.6, y + d, x, y + d); c.quadraticCurveTo(x - w * 0.6, y + d, x - w, y - 0.8); c.closePath(); c.fill();
  if (dil) { c.save(); c.clip(); c.fillStyle = '#ff8a9e'; c.beginPath(); c.ellipse(x, y + d, w * 0.55, d * 0.5, 0, 0, 6.2832); c.fill(); c.restore(); }
  c.strokeStyle = '#6a2238'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(x - w, y - 0.8); c.quadraticCurveTo(x, y + 0.9, x + w, y - 0.8); c.quadraticCurveTo(x + w * 0.6, y + d, x, y + d); c.quadraticCurveTo(x - w * 0.6, y + d, x - w, y - 0.8); c.stroke();
}
function cadiCiz(c, x, y, s, t, o) {
  o = o || KZ8_BOS; t = t || 0; s = s || 1;
  KZ8_CO.kepce = false;
  if (!(Number.isFinite(x) && Number.isFinite(y))) return KZ8_CO;
  if (o.tip === 'kiz') kz8KizCiz(c, x, y, s, t, o); else kz8NineCiz(c, x, y, s, t, o);
  return KZ8_CO;
}
function kz8NineCiz(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, al = o.alfa == null ? 1 : clamp(o.alfa, 0, 1); if (al <= 0.01) return;
  const kar = clamp(+o.karistir || 0, 0, 1), sev = clamp(+o.sevinc || 0, 0, 1), el = clamp(+o.el || 0, 0, 1), alk = clamp(+o.alkis || 0, 0, 1);
  const dans = clamp(+o.dans || 0, 0, 1), mir = clamp(+o.mirildan || 0, 0, 1), kon = clamp(+o.konus || 0, 0, 1);
  const fz = Number.isFinite(o.faz) ? o.faz : t, B = fz * Math.PI * 2;   // dans: saniyede iki vuruş (sin(B) tam devir = 1 sn)
  // gövde hareketi
  let hop = 0, sw = 0, sq = Math.sin(t * 2.2) * 0.012, eg = Number.isFinite(o.egil) ? o.egil : 0, basE = 0, uc = Math.sin(t * 2.1) * 0.07;
  if (sev > 0) { const h = Math.abs(Math.sin(t * 6.6)); hop += h * 6.5 * sev; sq += (h < 0.25 ? (0.25 - h) * 0.22 : -h * 0.02) * sev; uc += Math.cos(t * 6.6) * 0.18 * sev; }
  if (dans > 0) { const h = Math.abs(Math.sin(B)); hop += h * 7 * dans; sw += Math.sin(B * 0.5) * 0.1 * dans; basE += Math.sin(B * 0.5 + 0.6) * 0.1 * dans; uc += Math.sin(B * 0.5 + 1.2) * 0.3 * dans; sq += (h < 0.22 ? (0.22 - h) * 0.3 : 0) * dans; }
  if (kar > 0) { const ph = Number.isFinite(o.kph) ? o.kph : t * 2.6; sw += Math.sin(ph) * 0.02 * kar; eg += 0.1 * kar; }
  if (mir > 0) basE += Math.sin(t * 1.7) * 0.06 * mir;
  basE += (+o.bakY || 0) * -0.04;
  const f = KZ8_TF; f.x = x; f.y = y; f.sx = s * yon; f.s = s; f.hop = hop; f.sw = sw; f.sq = sq; f.eg = eg; f.bel = -46;
  const M0 = c.getTransform(), a0 = c.globalAlpha;
  c.globalAlpha = a0 * al;
  c.translate(x, y); c.scale(s * yon, s);
  { const gs = 1 - Math.min(0.4, hop / 30), sp = kz8Golge(); c.globalAlpha = a0 * al * 0.8 * gs; c.drawImage(sp, -46 * gs, -6, 92 * gs, 12); c.globalAlpha = a0 * al; }
  c.translate(0, -hop); c.rotate(sw); c.scale(1 + sq, 1 - sq);
  kz8Koy(c, kz8NineGovde(), 0, 0);
  c.translate(0, -46); c.rotate(eg); c.translate(0, 46);
  // kol hedefleri (gövde çerçevesinde; +x baktığı yön)
  const sF = kar > 0 ? 3 * kar : 0, FX = 18 + sF, FY = -66, BX = -18 + sF * 1.6, BY = -66.5;
  let fhx = 22, fhy = -40, bhx = -22, bhy = -40;   // dinlenirken: eller yanlarda
  if (sev > 0) { fhx = lerp(fhx, 40, sev); fhy = lerp(fhy, -94 + Math.sin(t * 6.6) * 4, sev); bhx = lerp(bhx, -40, sev); bhy = lerp(bhy, -94 + Math.sin(t * 6.6 + 1) * 4, sev); }
  if (dans > 0) { const a = Math.sin(B * 0.5); fhx = lerp(fhx, 38, dans); fhy = lerp(fhy, -82 - a * 16, dans); bhx = lerp(bhx, -38, dans); bhy = lerp(bhy, -82 + a * 16, dans); }
  if (alk > 0) { const k = Math.abs(Math.sin(t * 10.5)); fhx = lerp(fhx, 4 + k * 9, alk); fhy = lerp(fhy, -60, alk); bhx = lerp(bhx, -4 - k * 9, alk); bhy = lerp(bhy, -60, alk); }
  // kepçe
  let kepce = kar > 0.02 || !!o.kepce, kax = 0, kay = 0, kbx = 0, kby = 0;
  if (kepce) {
    const ph = Number.isFinite(o.kph) ? o.kph : t * 2.6;
    let tx = 64 + Math.cos(ph) * 10, ty = -28 + Math.sin(ph) * 3;
    if (Number.isFinite(o.kepceUcX) && Number.isFinite(o.kepceUcY)) { kz8Geri(o.kepceUcX, o.kepceUcY, KZ8_P2); tx = KZ8_P2[0]; ty = KZ8_P2[1]; }
    const Ax = 10 + Math.cos(ph) * 2.6, Ay = -66 + Math.sin(ph) * 1.5, dx = tx - Ax, dy = ty - Ay, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
    kax = Ax - ux * 5; kay = Ay - uy * 5; kbx = tx; kby = ty;
    const w = kar > 0.02 ? kar : 1;
    bhx = lerp(bhx, Ax, w * (1 - alk)); bhy = lerp(bhy, Ay, w * (1 - alk));
    const gx = Ax + ux * Math.min(22, d * 0.4), gy = Ay + uy * Math.min(22, d * 0.4);
    fhx = lerp(fhx, gx, w * (1 - alk)); fhy = lerp(fhy, gy, w * (1 - alk));
  }
  if (el > 0) { const w = smooth(el); fhx = lerp(fhx, 40 + Math.sin(t * 10) * 4, w); fhy = lerp(fhy, -92 - Math.cos(t * 10) * 3, w); }
  // kollar (kollar şalın altından çıkar; eller en üstte)
  const UK = kz8NineUstKol(), OK = kz8NineOnKol(), EL = kz8El('n_el', 6.4, '#ffd2b2', '#eba882');
  kz8IK(BX, BY, bhx, bhy, 16.5, 16.5, KZ8_IKO); const bex = KZ8_IKO.ex, bey = KZ8_IKO.ey, bwx = KZ8_IKO.hx, bwy = KZ8_IKO.hy;
  kz8IK(FX, FY, fhx, fhy, 16.5, 16.5, KZ8_IKO); const fex = KZ8_IKO.ex, fey = KZ8_IKO.ey, fwx = KZ8_IKO.hx, fwy = KZ8_IKO.hy;
  kz8Parca(c, UK, BX, BY, bex, bey); kz8Parca(c, OK, bex, bey, bwx, bwy);
  kz8Parca(c, UK, FX, FY, fex, fey); kz8Parca(c, OK, fex, fey, fwx, fwy);
  kz8Koy(c, kz8NineSal(), 0, 0);
  if (kepce) {
    if (o.kepceBatik) kz8KepceCiz(c, kax, kay, kbx, kby, 1);
    else { kz8KepceCiz(c, kax, kay, kbx, kby, 1); const M = c.getTransform(); c.translate(kbx, kby); c.rotate(Math.atan2(kby - kay, kbx - kax)); kz8Koy(c, kz8KepceKase(), 0, 0); c.setTransform(M); }
    kz8Ileri(kax, kay, KZ8_P3); KZ8_CO.ax = KZ8_P3[0]; KZ8_CO.ay = KZ8_P3[1]; kz8Ileri(kbx, kby, KZ8_P3); KZ8_CO.bx = KZ8_P3[0]; KZ8_CO.by = KZ8_P3[1]; KZ8_CO.kepce = true;
  }
  kz8Koy(c, EL, bwx, bwy + 3); kz8Koy(c, EL, fwx, fwy + 3);
  // baş
  const hx = 0, hy = -93; const M1 = c.getTransform(); c.translate(hx, hy); c.rotate(basE);
  kz8Koy(c, kz8NineBas(), 0, 0);
  const bx = clamp(+o.bakX || 0, -1, 1) * 1.4 + 0.6, by = clamp(+o.bakY || 0, -1, 1) * 1.2;
  const kirp = ((t + 0.9) % 4.1) < 0.13 ? 0 : 1, mutlu = sev > 0.45 || alk > 0.6 || dans > 0.5 ? 1 : 0;
  kz8Goz(c, -8.3 + 1.2, -3, 2.4, 2.9, mutlu, kirp, bx, by, true); kz8Goz(c, 8.3 + 1.2, -3, 2.4, 2.9, mutlu, kirp, bx, by, true);
  kz8Koy(c, kz8NineGozluk(), 0, 0);
  const acik = Math.max(sev * 0.9, alk * 0.6, dans * 0.7, kon * (0.35 + 0.35 * Math.abs(Math.sin(t * 13))));
  kz8Agiz(c, 1.6, 10, 7.6, acik, mir, true);
  // şapka (biraz yana yatık) + eğri uç
  c.translate(0.5, -19.5); c.rotate(-0.1 + Math.sin(t * 1.3) * 0.015); c.scale(0.92, 0.92);
  kz8Koy(c, kz8NineSapka(), 0, 0);
  c.translate(-1, -48); c.rotate(-0.35 + uc); kz8Koy(c, kz8NineSapkaUc(), 0, 0);
  c.setTransform(M1);
  c.setTransform(M0); c.globalAlpha = a0;
}
function kz8KizCiz(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, al = o.alfa == null ? 1 : clamp(o.alfa, 0, 1); if (al <= 0.01) return;
  const sev = clamp(+o.sevinc || 0, 0, 1), el = clamp(+o.el || 0, 0, 1), alk = clamp(+o.alkis || 0, 0, 1), dans = clamp(+o.dans || 0, 0, 1), kon = clamp(+o.konus || 0, 0, 1);
  const sas = clamp(+o.sasir || 0, 0, 1), asa = clamp(+o.asa || 0, 0, 1);
  const fz = Number.isFinite(o.faz) ? o.faz : t, B = fz * Math.PI * 2;
  let hop = 0, sw = 0, sq = Math.sin(t * 2.6) * 0.014, basE = Math.sin(t * 1.4) * 0.03, orgu = Math.sin(t * 2.3) * 0.08, uc = 0;
  if (sev > 0) { const h = Math.abs(Math.sin(t * 7.5)); hop += h * 8 * sev; sq += (h < 0.25 ? (0.25 - h) * 0.28 : -h * 0.03) * sev; orgu += Math.cos(t * 7.5) * 0.5 * sev; }
  if (dans > 0) { const h = Math.abs(Math.sin(B)); hop += h * 7 * dans; sw += Math.sin(B * 0.5) * 0.14 * dans; basE += Math.sin(B * 0.5 + 0.5) * 0.12 * dans; orgu += Math.sin(B * 0.5 + 1) * 0.6 * dans; }
  if (sas > 0) { sw -= 0.06 * sas; basE -= 0.06 * sas; orgu -= 0.25 * sas; }
  orgu += hop * 0.02; uc = orgu * 0.3;
  const M0 = c.getTransform(), a0 = c.globalAlpha; c.globalAlpha = a0 * al;
  c.translate(x, y); c.scale(s * yon * KZ8_KIZ, s * KZ8_KIZ);
  { const gs = 1 - Math.min(0.45, hop / 24), sp = kz8Golge(); c.globalAlpha = a0 * al * 0.7 * gs; c.drawImage(sp, -26 * gs, -4, 52 * gs, 8); c.globalAlpha = a0 * al; }
  c.translate(0, -hop); c.rotate(sw); c.scale(1 + sq, 1 - sq);
  const PL = kz8KizPelerin(); { const M = c.getTransform(); c.translate(0, -49); c.rotate(Math.sin(t * 2) * 0.03 - hop * 0.004); kz8Koy(c, PL, 0, 49); c.setTransform(M); }
  kz8Koy(c, kz8KizGovde(), 0, 0);
  const FX = 10, FY = -47, BX = -10, BY = -47;
  let fhx = 13, fhy = -28, bhx = -13, bhy = -28;
  if (sev > 0) { fhx = lerp(fhx, 18, sev); fhy = lerp(fhy, -64 + Math.sin(t * 7.5) * 3, sev); bhx = lerp(bhx, -18, sev); bhy = lerp(bhy, -64 + Math.sin(t * 7.5 + 1) * 3, sev); }
  if (dans > 0) { const a = Math.sin(B * 0.5); fhx = lerp(fhx, 20, dans); fhy = lerp(fhy, -60 - a * 12, dans); bhx = lerp(bhx, -20, dans); bhy = lerp(bhy, -60 + a * 12, dans); }
  if (alk > 0) { const k = Math.abs(Math.sin(t * 11)); fhx = lerp(fhx, 2.5 + k * 6, alk); fhy = lerp(fhy, -42, alk); bhx = lerp(bhx, -2.5 - k * 6, alk); bhy = lerp(bhy, -42, alk); }
  if (el > 0) { const w = smooth(el); fhx = lerp(fhx, 20 + Math.sin(t * 11) * 4, w); fhy = lerp(fhy, -68, w); }
  if (sas > 0) { const w = smooth(sas); fhx = lerp(fhx, 14, w); fhy = lerp(fhy, -59, w); bhx = lerp(bhx, -14, w); bhy = lerp(bhy, -59, w); }   // şaşırınca eller yanaklarda
  if (asa > 0) { const w = smooth(asa); fhx = lerp(fhx, 22 + Math.sin(t * 9) * 3, w); fhy = lerp(fhy, -68 - Math.cos(t * 9) * 2.5, w); }   // asayı kaldırıp sallar
  const UK = kz8KizKol('k_ustkol', 9.5, 5.2), OK = kz8KizKol('k_onkol', 9, 4.2), EL = kz8El('k_el', 3.9, '#f8caa4', '#e3a37c');
  kz8IK(BX, BY, bhx, bhy, 10, 10, KZ8_IKO); kz8Parca(c, UK, BX, BY, KZ8_IKO.ex, KZ8_IKO.ey); kz8Parca(c, OK, KZ8_IKO.ex, KZ8_IKO.ey, KZ8_IKO.hx, KZ8_IKO.hy); kz8Koy(c, EL, KZ8_IKO.hx, KZ8_IKO.hy + 1.5);
  kz8IK(FX, FY, fhx, fhy, 10, 10, KZ8_IKO); kz8Parca(c, UK, FX, FY, KZ8_IKO.ex, KZ8_IKO.ey); kz8Parca(c, OK, KZ8_IKO.ex, KZ8_IKO.ey, KZ8_IKO.hx, KZ8_IKO.hy);
  if (asa > 0.02 || o.asaVar) {   // ucu yıldızlı minik asa (elde)
    const hx = KZ8_IKO.hx, hy = KZ8_IKO.hy + 1, a = -0.85 + 0.75 * (1 - asa) + Math.sin(t * 9) * 0.4 * asa, ux = Math.cos(a), uy = Math.sin(a), L = 21, tx = hx + ux * L, ty = hy + uy * L;
    c.lineCap = 'round'; c.strokeStyle = '#3e2560'; c.lineWidth = 3.2; c.beginPath(); c.moveTo(hx - ux * 3, hy - uy * 3); c.lineTo(tx, ty); c.stroke();
    c.strokeStyle = '#c9a2ff'; c.lineWidth = 1.8; c.stroke();
    kz8Isik(c, '#ffe08a', tx, ty, 16 + asa * 10, 0.45 + asa * 0.4);
    const M = c.getTransform(); c.translate(tx, ty); c.rotate(Math.sin(t * 9) * 0.3 * asa); c.scale(1.25, 1.25); kz8Koy(c, kz8SupYildiz(), 0, 0); c.setTransform(M);
  }
  kz8Koy(c, EL, KZ8_IKO.hx, KZ8_IKO.hy + 1.5);
  // baş + örgüler + şapka
  const M1 = c.getTransform(); c.translate(0, -66); c.rotate(basE);
  const OR = kz8KizOrgu();
  for (const sx of [-1, 1]) { const M = c.getTransform(); c.translate(sx * 15.5, -4); c.rotate(-sx * 0.35 + orgu * (sx > 0 ? 1 : 0.8)); kz8Koy(c, OR, 0, 0); c.setTransform(M); }
  kz8Koy(c, kz8KizBas(), 0, 0);
  const kirp = sas > 0.3 ? 1 : ((t + 1.7) % 3.6) < 0.13 ? 0 : 1, mutlu = (sev > 0.55 || dans > 0.6) && sas < 0.3 ? 1 : 0, gb = 1 + sas * 0.22;
  const bx = clamp(+o.bakX || 0, -1, 1) * 1.2 + 0.5, by = clamp(+o.bakY || 0, -1, 1);
  kz8Goz(c, -6 + 0.8, -1, 3.1 * gb, 3.9 * gb, mutlu, kirp, bx, by, true); kz8Goz(c, 6 + 0.8, -1, 3.1 * gb, 3.9 * gb, mutlu, kirp, bx, by, true);
  if (sas > 0.3) { c.strokeStyle = 'rgba(160,70,30,0.7)'; c.lineWidth = 1.2; for (const sx of [-1, 1]) { c.beginPath(); c.arc(sx * 6 + 0.8, -3, 5.6, Math.PI * 1.25, Math.PI * 1.75); c.stroke(); } }   // kaşlar havada
  if (!mutlu && kirp) { c.strokeStyle = '#35243f'; c.lineWidth = 1.1; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * 6 + 0.8 + sx * 3, -3.6); c.lineTo(sx * 6 + 0.8 + sx * 4.6, -5); c.stroke(); } }
  const acik = Math.max(0.3, sev * 0.9, alk * 0.6, dans * 0.7, kon * (0.35 + 0.4 * Math.abs(Math.sin(t * 13))));
  if (sas > 0.4) { c.fillStyle = '#7a2c44'; c.beginPath(); c.ellipse(1, 10, 2.4 + sas * 0.8, 2.8 + sas * 1.2, 0, 0, 6.2832); c.fill(); c.fillStyle = '#ff8a9e'; c.beginPath(); c.ellipse(1, 11.4 + sas * 0.6, 1.6, 1.1, 0, 0, 6.2832); c.fill(); }   // şaşkın "o" ağız
  else kz8Agiz(c, 1, 8.6, 5.2, acik, 0, true);
  c.translate(0.5, -14.5); c.rotate(0.14 + uc * 0.3); kz8Koy(c, kz8KizSapka(), 0, 0);
  c.setTransform(M1);
  c.setTransform(M0); c.globalAlpha = a0;
}

// ═══════════════════════════════ KAZAN (parçalar) ═══════════════════════════════
// Yerel koordinat: kazanın ortası, zemin (0,0). Gövde + arka kenar + ağız boşluğu · iksir yüzeyi · köpük · ön kenar · taşlar.
function kz8KazanGovde() {
  return kz8Tuval('kz_govde', -92, -80, 184, 86, q => {
    for (const sx of [-1, 1]) { q.strokeStyle = '#231a3e'; q.lineWidth = 4.6; q.beginPath(); q.arc(sx * 79, -44, 7.5, 0, 6.2832); q.stroke();
      q.strokeStyle = 'rgba(150,135,210,0.6)'; q.lineWidth = 1.3; q.beginPath(); q.arc(sx * 79, -44, 7.5, Math.PI * 1.05, Math.PI * 1.6); q.stroke(); }
    const yol = () => { q.beginPath(); q.moveTo(-53, -60); q.bezierCurveTo(-90, -54, -86, -14, -42, -9); q.quadraticCurveTo(0, -3, 42, -9); q.bezierCurveTo(86, -14, 90, -54, 53, -60); q.closePath(); };
    yol(); q.fillStyle = kz8Rad(q, -28, -44, 4, -4, -34, 94, [0, '#6c5c9a', 0.32, '#45376e', 0.68, '#2b2149', 1, '#1b1330']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = kz8Rad(q, 0, 4, 2, 0, 4, 76, [0, 'rgba(255,176,226,0.55)', 0.5, 'rgba(255,176,226,0.18)', 1, 'rgba(255,176,226,0)']); q.fillRect(-92, -80, 184, 86);
    q.fillStyle = kz8Lin(q, 0, -62, 0, -42, [0, 'rgba(206,186,255,0.3)', 1, 'rgba(206,186,255,0)']); q.fillRect(-92, -62, 184, 22);
    q.fillStyle = 'rgba(226,214,255,0.22)'; q.beginPath(); q.ellipse(-50, -38, 9, 19, 0.55, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.ellipse(-56, -44, 2.6, 5.4, 0.55, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(120,100,180,0.35)'; q.lineWidth = 2; q.beginPath(); q.ellipse(0, -51, 78, 9, 0, 0.05, Math.PI - 0.05); q.stroke();
    q.restore();
    yol(); q.strokeStyle = 'rgba(14,8,28,0.75)'; q.lineWidth = 2.2; q.stroke();
    // karnında altın yıldız
    kz8Yildiz(q, 0, -29, 10.5, 0.5); q.fillStyle = kz8Lin(q, 0, -40, 0, -19, [0, '#ffe9a0', 1, '#f0b040']); q.fill(); q.strokeStyle = '#a8701c'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(-2.5, -33, 1.6, 0, 6.2832); q.fill();
    // kenar halkası ve ağız boşluğu (arka duvar)
    q.fillStyle = kz8Lin(q, 0, -76, 0, -48, [0, '#6a5a9e', 0.45, '#463870', 1, '#2c2250']); q.beginPath(); q.ellipse(0, -62, 58, 14, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(14,8,28,0.7)'; q.lineWidth = 1.8; q.stroke();
    q.fillStyle = '#140c26'; q.beginPath(); q.ellipse(0, -62, 47, 9.6, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(200,186,255,0.55)'; q.lineWidth = 1.3; q.beginPath(); q.ellipse(0, -62.6, 56, 12.6, 0, Math.PI * 1.08, Math.PI * 1.92); q.stroke();
  });
}
function kz8KazanOn() {   // ağzın ön kenarı (iksirin önünü örter)
  return kz8Tuval('kz_on', -62, -66, 124, 22, q => {
    q.beginPath(); q.ellipse(0, -62, 58, 14, 0, 0, Math.PI); q.ellipse(0, -62, 47, 9.6, 0, Math.PI, 0, true); q.closePath();
    q.fillStyle = kz8Lin(q, 0, -56, 0, -47, [0, '#6e5ea6', 0.5, '#4a3c78', 1, '#2e2454']); q.fill();
    q.strokeStyle = 'rgba(14,8,28,0.7)'; q.lineWidth = 1.6; q.beginPath(); q.ellipse(0, -62, 58, 14, 0, 0.05, Math.PI - 0.05); q.stroke();
    q.strokeStyle = 'rgba(214,200,255,0.75)'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, -61.6, 47.4, 9.8, 0, 0.15, Math.PI - 0.15); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.4)'; q.beginPath(); q.ellipse(-30, -51.5, 7, 1.3, 0.2, 0, 6.2832); q.fill();
  });
}
function kz8IksirSpr(i) {   // iksir yüzeyi (renk i), merkez (0,0)
  return kz8Tuval('kz_iksir' + i, -48, -11, 96, 22, q => {
    const col = KZ8_RENK[i], k = KZ8_IRY / KZ8_IRX;
    q.save(); q.scale(1, k);
    q.beginPath(); q.arc(0, 0, KZ8_IRX, 0, 6.2832);
    if (i === 5) {
      q.fillStyle = '#ffd6f0'; q.fill(); q.save(); q.clip();
      for (let j = 0; j < 6; j++) { q.fillStyle = KZ8_GOK[j]; q.globalAlpha = 0.85; q.beginPath(); q.arc(4, -6, KZ8_IRX * (1.05 - j * 0.16), 0, 6.2832); q.fill(); }
      q.globalAlpha = 1; q.fillStyle = kz8Rad(q, -8, -10, 2, 0, 0, KZ8_IRX, [0, 'rgba(255,255,255,0.55)', 0.6, 'rgba(255,255,255,0.1)', 1, 'rgba(60,20,90,0.25)']); q.fillRect(-50, -50, 100, 100); q.restore();
    } else { q.fillStyle = kz8Rad(q, -12, -16, 2, 0, 0, KZ8_IRX + 2, [0, kz8Hex(col, '#ffffff', 0.4), 0.5, col, 1, kz8Hex(col, '#2a1650', 0.3)]); q.fill(); }
    q.restore();
    q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(-15, -3.2, 15, 2.1, -0.04, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.65)'; q.beginPath(); q.ellipse(-20, -3.6, 4.5, 1, 0, 0, 6.2832); q.fill();
  });
}
function kz8KopukSpr(i) {   // köpük kubbesi: taban (0,0) iksir yüzeyi
  return kz8Tuval('kz_kopuk' + i, -64, -48, 128, 58, q => {
    const col = KZ8_RENK[i], ac = kz8Hex(col, '#ffffff', 0.45), ko = kz8Hex(col, '#2a1650', 0.12), r = rng(4410 + i);
    const top = []; for (let j = 0; j < 15; j++) { const u = j / 14, x = lerp(-47, 47, u) + (r() - 0.5) * 6, y = -3 - Math.sin(u * Math.PI) * (16 + r() * 12), rr = 8 + Math.sin(u * Math.PI) * 6 + r() * 3; top.push([x, y, rr]); }
    for (let j = 0; j < 6; j++) top.push([lerp(-30, 30, j / 5) + (r() - 0.5) * 8, -26 - r() * 10, 9 + r() * 4]);
    kz8SacTopak(q, top, ac, ko, 'rgba(255,255,255,0.35)');
    q.fillStyle = 'rgba(255,255,255,0.8)'; for (const [x, y, rr] of top) if (r() < 0.5) { q.beginPath(); q.arc(x - rr * 0.35, y - rr * 0.4, rr * 0.18, 0, 6.2832); q.fill(); }
  }, 3);
}
function kz8Taslar(on) {   // kazanın altındaki yuvarlak taşlar (ön / arka)
  return kz8Tuval(on ? 'kz_tasOn' : 'kz_tasArka', -96, -24, 192, 30, q => {
    const list = on ? [[-58, -3, 17, 10.5], [-22, 0, 19, 11.5], [15, -0.5, 18, 11], [52, -3, 17, 10.5]] : [[-76, -8, 14, 9], [74, -8, 14, 9], [-38, -10, 12, 8], [38, -10, 12, 8]];
    for (const [x, y, rx, ry] of list) {
      q.beginPath(); q.ellipse(x, y, rx, ry, 0, Math.PI, 0); q.lineTo(x + rx, y + 2); q.quadraticCurveTo(x, y + 5, x - rx, y + 2); q.closePath();
      q.fillStyle = kz8Lin(q, 0, y - ry, 0, y + 4, on ? [0, '#a99fd0', 0.5, '#7a70a8', 1, '#4e4478'] : [0, '#7a70a8', 1, '#3e3566']); q.fill();
      q.strokeStyle = 'rgba(30,22,60,0.6)'; q.lineWidth = 1.4; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(x - rx * 0.35, y - ry * 0.55, rx * 0.35, ry * 0.18, -0.2, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,170,220,0.25)'; q.beginPath(); q.ellipse(x + rx * 0.2, y - ry * 0.95, rx * 0.5, ry * 0.15, 0, 0, 6.2832); q.fill();   // üstüne vuran sihirli ışık
    }
  });
}
function kz8Tabure() {   // Nine'nin bal rengi tahta taburesi (üstünde minik yıldız oyması)
  return kz8Tuval('kz_tabure', -32, -36, 64, 40, q => {
    q.strokeStyle = '#6e4220'; q.lineWidth = 7.4; for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(sx * 17, -26); q.lineTo(sx * 22, -1); q.stroke(); }
    q.strokeStyle = '#b97a3c'; q.lineWidth = 5; for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(sx * 17, -26); q.lineTo(sx * 22, -1); q.stroke(); }
    q.strokeStyle = '#6e4220'; q.lineWidth = 5; q.beginPath(); q.moveTo(-19, -12); q.lineTo(19, -12); q.stroke(); q.strokeStyle = '#a86c32'; q.lineWidth = 3; q.stroke();
    q.fillStyle = kz8Lin(q, 0, -32, 0, -23, [0, '#f2c27e', 0.4, '#d89a54', 1, '#a8692e']); q.beginPath(); q.roundRect ? q.roundRect(-26, -32, 52, 8.5, 3.2) : q.rect(-26, -32, 52, 8.5); q.fill();
    q.strokeStyle = '#6e4220'; q.lineWidth = 1.4; q.stroke();
    q.strokeStyle = 'rgba(120,70,30,0.45)'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(-22, -28.5); q.quadraticCurveTo(-6, -27.4, 8, -28.8); q.stroke();
    kz8Yildiz(q, 12, -27.8, 2.6, 0.48); q.fillStyle = '#ffe08a'; q.fill();
  });
}

// ═══════════════════════════════ malzemeler, baloncuk, bulut, küçük süsler ═══════════════════════════════
function kz8MalzSpr(ad) {
  return kz8Tuval('m_' + ad, -24, -24, 48, 48, q => {
    if (ad === 'yildiz') {
      kz8YildizTombul(q, 0, 1.5, 19, 0.5); q.fillStyle = kz8Rad(q, -5, -6, 1, 0, 0, 21, [0, '#fff6c4', 0.45, '#ffd84a', 1, '#f0a42c']); q.fill();
      q.strokeStyle = '#c47a16'; q.lineWidth = 1.7; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(-5, -7, 2.4, 4.2, 0.5, 0, 6.2832); q.fill();
    } else if (ad === 'seker') {   // ambalajlı şeker: pembe-beyaz çizgili, iki ucu kıvrık
      for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(sx * 10, 0); q.lineTo(sx * 22, -9); q.quadraticCurveTo(sx * 19, 0, sx * 22, 9); q.closePath();
        q.fillStyle = '#ffc6e4'; q.fill(); q.strokeStyle = '#d0569a'; q.lineWidth = 1.3; q.stroke();
        q.strokeStyle = 'rgba(208,86,154,0.5)'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(sx * 13, -1.5); q.lineTo(sx * 20, -6); q.moveTo(sx * 13, 1.5); q.lineTo(sx * 20, 6); q.stroke();
        q.fillStyle = '#ff8fc8'; q.beginPath(); q.ellipse(sx * 11, 0, 2.6, 3.8, 0, 0, 6.2832); q.fill(); }
      q.save(); q.beginPath(); q.ellipse(0, 0, 12.5, 10.5, 0, 0, 6.2832); q.clip();
      q.fillStyle = '#ff7fbf'; q.fillRect(-14, -12, 28, 24); q.fillStyle = '#fff4fa';
      for (let i = -3; i <= 3; i++) { q.beginPath(); q.moveTo(i * 7 - 4, -12); q.lineTo(i * 7 + 0, -12); q.lineTo(i * 7 + 8, 12); q.lineTo(i * 7 + 4, 12); q.closePath(); q.fill(); }
      q.fillStyle = 'rgba(255,255,255,0.45)'; q.beginPath(); q.ellipse(-4, -5, 6, 2.6, -0.3, 0, 6.2832); q.fill(); q.restore();
      q.strokeStyle = '#c0408a'; q.lineWidth = 1.6; q.beginPath(); q.ellipse(0, 0, 12.5, 10.5, 0, 0, 6.2832); q.stroke();
    } else if (ad === 'kabak') {   // minik balkabağı (yüzsüz), kıvrık sap ve yaprak
      const seg = [[-9, 2, 8, 12, '#f07a2c'], [9, 2, 8, 12, '#f07a2c'], [-4.5, 2, 8, 13, '#ff9a3c'], [4.5, 2, 8, 13, '#ff9a3c'], [0, 2, 7.5, 13.5, '#ffad55']];
      q.fillStyle = '#c85a1c'; q.beginPath(); q.ellipse(0, 3, 18.5, 14.5, 0, 0, 6.2832); q.fill();
      for (const [x, y, rx, ry, col] of seg) { q.fillStyle = col; q.beginPath(); q.ellipse(x, y, rx, ry, 0, 0, 6.2832); q.fill(); }
      q.strokeStyle = 'rgba(160,70,20,0.55)'; q.lineWidth = 1; for (const x of [-6.5, 0, 6.5]) { q.beginPath(); q.moveTo(x, -9.5); q.quadraticCurveTo(x * 1.5, 3, x, 15); q.stroke(); }
      q.strokeStyle = '#a04a16'; q.lineWidth = 1.6; q.beginPath(); q.ellipse(0, 3, 18.5, 14.5, 0, 0, 6.2832); q.stroke();
      q.fillStyle = 'rgba(255,240,200,0.5)'; q.beginPath(); q.ellipse(-8, -3, 2.6, 5, 0.3, 0, 6.2832); q.fill();
      q.strokeStyle = '#5e7a2c'; q.lineWidth = 3.4; q.beginPath(); q.moveTo(0, -9); q.quadraticCurveTo(1, -15, 4, -17); q.stroke(); q.strokeStyle = '#8ab04a'; q.lineWidth = 1.6; q.stroke();
      q.strokeStyle = '#7dd36a'; q.lineWidth = 1.1; q.beginPath(); q.moveTo(2, -13); q.bezierCurveTo(-6, -16, -8, -10, -4, -9); q.stroke();
      q.fillStyle = '#7dd36a'; q.beginPath(); q.moveTo(3, -12); q.quadraticCurveTo(10, -19, 16, -13); q.quadraticCurveTo(9, -9, 3, -12); q.fill(); q.strokeStyle = '#3e8a3a'; q.lineWidth = 0.9; q.stroke();
    } else {   // ay çiçeği: beyaz-lila altı taç yaprak, ortasında altın hilal
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832 - Math.PI / 2; q.save(); q.rotate(a);
        q.beginPath(); q.ellipse(11, 0, 10.5, 6.6, 0, 0, 6.2832); q.fillStyle = kz8Lin(q, 0, 0, 21, 0, [0, '#c9aaff', 0.45, '#efe6ff', 1, '#ffffff']); q.fill();
        q.strokeStyle = 'rgba(140,100,210,0.6)'; q.lineWidth = 1.1; q.stroke(); q.strokeStyle = 'rgba(170,130,230,0.45)'; q.lineWidth = 0.7; q.beginPath(); q.moveTo(3, 0); q.lineTo(17, 0); q.stroke(); q.restore(); }
      q.fillStyle = '#fff1b8'; q.beginPath(); q.arc(0, 0, 6.6, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(200,150,60,0.6)'; q.lineWidth = 1; q.stroke();
      q.fillStyle = '#ffc94a'; q.beginPath(); q.arc(-0.8, 0, 4.6, 0, 6.2832); q.fill(); q.fillStyle = '#fff1b8'; q.beginPath(); q.arc(1.2, -1, 3.9, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.9)'; q.beginPath(); q.arc(-2.8, -2.2, 0.8, 0, 6.2832); q.fill();
    }
  });
}
function kz8Balon() {   // gökkuşağı yanardönerli sabun/ışık baloncuğu (r = 32)
  return kz8Tuval('kz_balon', -36, -36, 72, 72, q => {
    q.fillStyle = kz8Rad(q, -8, -10, 2, 0, 0, 32, [0, 'rgba(255,255,255,0.04)', 0.7, 'rgba(230,240,255,0.08)', 1, 'rgba(255,255,255,0.22)']); q.beginPath(); q.arc(0, 0, 32, 0, 6.2832); q.fill();
    for (let j = 0; j < 6; j++) { q.strokeStyle = KZ8_GOK[j]; q.globalAlpha = 0.55; q.lineWidth = 2.4; q.beginPath(); q.arc(0, 0, 30.5, j * Math.PI / 3 + 0.3, (j + 1) * Math.PI / 3 + 0.3); q.stroke(); }
    q.globalAlpha = 1; q.strokeStyle = 'rgba(255,255,255,0.4)'; q.lineWidth = 1; q.beginPath(); q.arc(0, 0, 32, 0, 6.2832); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.85)'; q.lineWidth = 3.4; q.beginPath(); q.arc(0, 0, 24, Math.PI * 1.1, Math.PI * 1.42); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.9)'; q.beginPath(); q.arc(-12, -19, 2.8, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(255,255,255,0.35)'; q.lineWidth = 2; q.beginPath(); q.arc(0, 0, 25, Math.PI * 0.2, Math.PI * 0.45); q.stroke();
  }, 3);
}
function kz8BulutSpr(i) {   // tatlı kokulu ışık bulutu (renk i; 6 = beyaz)
  return kz8Tuval('kz_bulut' + i, -60, -44, 120, 80, q => {
    const col = i >= 6 ? '#ffffff' : (i === 5 ? '#ffd6f0' : KZ8_RENK[i]), ac = kz8Hex(col, '#ffffff', 0.5), A = hex(ac);
    for (const [x, y, r] of [[-30, 2, 21], [-10, -11, 25], [15, -9, 23], [35, 3, 19], [0, 9, 23], [-22, 13, 17], [22, 13, 17]]) {
      q.fillStyle = kz8Rad(q, x, y, r * 0.2, x, y, r, [0, 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',0.95)', 0.62, 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',0.8)', 1, 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',0)']);
      q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill();
    }
    q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.ellipse(-12, -16, 13, 6, -0.2, 0, 6.2832); q.fill();
  }, 2);
}
function kz8Kalp() { return kz8Tuval('kz_kalp', -9, -9, 18, 18, q => { const s = 6.5; q.beginPath(); q.moveTo(0, s * 0.95); q.bezierCurveTo(-s * 1.35, -s * 0.1, -s * 0.6, -s * 1.15, 0, -s * 0.35); q.bezierCurveTo(s * 0.6, -s * 1.15, s * 1.35, -s * 0.1, 0, s * 0.95); q.fillStyle = '#ff8fb8'; q.fill(); q.strokeStyle = '#e0508a'; q.lineWidth = 1; q.stroke(); q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(-2.6, -2.6, 1.3, 0, 6.2832); q.fill(); }); }
function kz8Nota() { return kz8Tuval('kz_nota', -7, -15, 16, 22, q => { q.fillStyle = '#f2e8ff'; q.strokeStyle = 'rgba(120,80,200,0.7)'; q.lineWidth = 1.1; q.beginPath(); q.ellipse(-1.5, 3, 4.2, 3.2, -0.4, 0, 6.2832); q.fill(); q.stroke(); q.fillRect(1.8, -12, 1.8, 15); q.strokeRect(1.8, -12, 1.8, 15); q.beginPath(); q.moveTo(3.6, -12); q.quadraticCurveTo(9, -9, 7.5, -3.5); q.quadraticCurveTo(7, -7, 3.6, -8); q.closePath(); q.fill(); q.stroke(); }); }
function kz8IsiltiSpr() { return kz8Tuval('kz_isilti', -10, -10, 20, 20, q => { q.fillStyle = kz8Rad(q, 0, 0, 0, 0, 0, 9, [0, 'rgba(255,255,255,0.8)', 1, 'rgba(255,255,255,0)']); q.beginPath(); q.arc(0, 0, 9, 0, 6.2832); q.fill(); q.fillStyle = '#ffffff'; kz8Isilti(q, 0, 0, 8.5); q.fill(); }); }

// ═══════════════════════════════ SÜPÜRGE ═══════════════════════════════
// Yerel: oturma yeri (0,0); sap +x yönünde (topuz +80), çalı −x yönünde (bağ −34, uç −84).
function kz8SupSap() {
  return kz8Tuval('sp_sap', -40, -10, 128, 20, q => {
    const yol = () => { q.beginPath(); q.moveTo(-36, -3.6); q.quadraticCurveTo(20, -4.6, 76, -2.9); q.lineTo(76, 2.9); q.quadraticCurveTo(20, 3.8, -36, 3.6); q.closePath(); };
    yol(); q.fillStyle = kz8Lin(q, 0, -4.5, 0, 4.5, [0, '#f6c98a', 0.45, '#e0a35a', 1, '#a8692e']); q.fill(); q.strokeStyle = '#7a4520'; q.lineWidth = 1.3; q.stroke();
    q.strokeStyle = 'rgba(140,80,30,0.45)'; q.lineWidth = 0.7; for (const [a, b, y] of [[-26, 10, 0.6], [16, 48, -0.8], [40, 70, 1.2]]) { q.beginPath(); q.moveTo(a, y); q.quadraticCurveTo((a + b) / 2, y - 0.8, b, y + 0.2); q.stroke(); }
    q.fillStyle = kz8Rad(q, 78, -2, 0.5, 80, 0, 6, [0, '#ffe2b0', 0.5, '#e0a35a', 1, '#a8692e']); q.beginPath(); q.arc(80, 0, 5.4, 0, 6.2832); q.fill(); q.strokeStyle = '#7a4520'; q.lineWidth = 1.2; q.stroke();
    q.fillStyle = '#ff8fc8'; q.beginPath(); q.roundRect ? q.roundRect(17, -4.8, 8, 9.6, 1.6) : q.rect(17, -4.8, 8, 9.6); q.fill(); q.strokeStyle = '#d0569a'; q.lineWidth = 0.9; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.6)'; q.lineWidth = 0.8; q.beginPath(); q.moveTo(18.5, -3.6); q.lineTo(23.5, 3.6); q.stroke();
  });
}
function kz8SupCali() {   // altın saman çalı; kök (0,0) bağın yeri, −x yönüne açılır
  return kz8Tuval('sp_cali', -56, -26, 62, 52, q => {
    const yol = () => { q.beginPath(); q.moveTo(4, -5.5); q.quadraticCurveTo(-18, -9, -44, -21); q.quadraticCurveTo(-55, -12, -52, 0); q.quadraticCurveTo(-55, 12, -44, 21); q.quadraticCurveTo(-18, 9, 4, 5.5); q.closePath(); };
    yol(); q.fillStyle = kz8Lin(q, 4, 0, -54, 0, [0, '#e0a040', 0.35, '#ffd27a', 1, '#ffe7a8']); q.fill();
    q.save(); yol(); q.clip(); const r = rng(6464);
    for (let i = 0; i < 34; i++) { const v = (r() - 0.5) * 2, x1 = -46 - r() * 8, y1 = v * 20; q.strokeStyle = i % 3 ? 'rgba(200,130,40,0.55)' : 'rgba(255,248,214,0.85)'; q.lineWidth = 0.8 + r() * 0.7; q.beginPath(); q.moveTo(2, v * 4.5); q.quadraticCurveTo(-20, v * 9, x1, y1); q.stroke(); }
    q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(-24, -8, 16, 3, -0.3, 0, 6.2832); q.fill();
    q.restore(); yol(); q.strokeStyle = '#a86a1e'; q.lineWidth = 1.3; q.stroke();
    q.fillStyle = '#ffe7a8'; for (let i = 0; i < 7; i++) { const v = (i / 6 - 0.5) * 2, x = -50 + Math.abs(v) * 5, y = v * 17; q.beginPath(); q.arc(x, y, 3.2, 0, 6.2832); q.fill(); }
  });
}
function kz8SupBag() {   // mor kurdele bağı ve fiyonk (bağ −34'te)
  return kz8Tuval('sp_bag', -48, -18, 28, 28, q => {
    q.fillStyle = kz8Lin(q, 0, -6, 0, 6, [0, '#a98cf0', 0.5, '#7b4fd0', 1, '#5a34a8']); q.beginPath(); q.roundRect ? q.roundRect(-39, -6.4, 9, 12.8, 2) : q.rect(-39, -6.4, 9, 12.8); q.fill();
    q.strokeStyle = '#3e2280'; q.lineWidth = 1; q.stroke();
    for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(-34.5, -6); q.bezierCurveTo(-34.5 + sx * 9, -15, -34.5 + sx * 11, -6, -34.5 + sx * 1.5, -6.5); q.closePath();
      q.fillStyle = '#9b74ea'; q.fill(); q.strokeStyle = '#4a2a98'; q.lineWidth = 0.9; q.stroke(); }
    q.fillStyle = '#c3a8ff'; q.beginPath(); q.arc(-34.5, -6.6, 2.1, 0, 6.2832); q.fill();
  });
}
function kz8SupYildiz() { return kz8Tuval('sp_yildiz', -7, -7, 14, 14, q => { kz8Yildiz(q, 0, 0, 5.4, 0.48); q.fillStyle = '#ffe08a'; q.fill(); q.strokeStyle = '#c98a22'; q.lineWidth = 0.9; q.stroke(); q.fillStyle = '#fff'; q.beginPath(); q.arc(-1.2, -1.4, 0.9, 0, 6.2832); q.fill(); }, 5); }
function kazanSupurgeCiz(c, x, y, s, t, o) {
  o = o || KZ8_BOS; t = t || 0; s = s || 1;
  const al = o.alfa == null ? 1 : clamp(o.alfa, 0, 1); if (al <= 0.01 || !Number.isFinite(x) || !Number.isFinite(y)) return;
  const aci = Number.isFinite(o.aci) ? o.aci : 0, ys = Number.isFinite(o.yon) ? clamp(o.yon, -1, 1) : 1, yon = Math.abs(ys) < 0.14 ? (ys < 0 ? -0.14 : 0.14) : ys;
  const kip = clamp(+o.kipir || 0, 0, 1), isik = clamp(+o.isik || 0, 0, 1), sg = yon < 0 ? -1 : 1;
  const M = c.getTransform(), a0 = c.globalAlpha; c.globalAlpha = a0 * al;
  if (isik > 0) { kz8Isik(c, '#ffe7a8', x, y, 110 * s, isik * 0.42); kz8Isik(c, '#ff9fd3', x - Math.cos(aci) * 40 * s * sg, y - Math.sin(aci) * 40 * s * sg, 60 * s, isik * 0.3); }
  c.translate(x, y); c.rotate(aci); c.scale(s * yon, s);
  { const M2 = c.getTransform(); c.translate(-34, 0); c.rotate(Math.sin(t * 13) * 0.1 * kip + Math.sin(t * 2.1) * 0.025); c.scale(1, 1 + Math.sin(t * 17) * 0.08 * kip); kz8Koy(c, kz8SupCali(), 0, 0); c.setTransform(M2); }
  kz8Koy(c, kz8SupSap(), 0, 0);
  // pembe kurdelenin uçları (rüzgârda dalgalanır)
  c.fillStyle = '#ff8fc8';
  for (let i = 0; i < 2; i++) { const w = Math.sin(t * (6 + kip * 5) + i * 1.3), L = 10 + i * 2.5; c.beginPath(); c.moveTo(21, 3.5); c.quadraticCurveTo(16 - i * 2, 7 + w * 2, 21 - L, 7 + i * 3 + w * 2.6); c.lineTo(22 - L, 10 + i * 3 + w * 2.6); c.quadraticCurveTo(17 - i * 2, 9 + w * 2, 23, 4.5); c.closePath(); c.fill(); }
  kz8Koy(c, kz8SupBag(), 0, 0);
  c.setTransform(M);
  // bağdan sarkan minik altın yıldız (yerçekimiyle aşağı)
  const ca = Math.cos(aci), sa = Math.sin(aci), lx = -33 * s * yon, ly = 6 * s, px = x + lx * ca - ly * sa, py = y + lx * sa + ly * ca;
  const sal = Math.sin(t * 3.1) * 0.35 + Math.sin(t * 7.3) * 0.2 * kip, L = 10 * s, qx = px + Math.sin(sal) * L, qy = py + Math.cos(sal) * L;
  c.strokeStyle = '#d6a13e'; c.lineWidth = 0.8 * s; c.beginPath(); c.moveTo(px, py); c.lineTo(qx, qy); c.stroke();
  const ys2 = kz8SupYildiz(), M3 = c.getTransform(); c.translate(qx, qy); c.rotate(sal * 0.6); c.scale(s, s); kz8Koy(c, ys2, 0, 0); c.setTransform(M3);
  c.globalAlpha = a0;
}
function kz8Hazirla() {   // bütün sprite'lar kurulumda bir kez (oyun sırasında takılma olmasın)
  kz8Golge(); kz8NineGovde(); kz8NineSal(); kz8NineUstKol(); kz8NineOnKol(); kz8El('n_el', 6.4, '#ffd2b2', '#eba882'); kz8NineBas(); kz8NineGozluk(); kz8NineSapka(); kz8NineSapkaUc(); kz8KepceKase();
  kz8KazanGovde(); kz8KazanOn(); for (let i = 0; i < 6; i++) { kz8IksirSpr(i); kz8KopukSpr(i); kz8BulutSpr(i); } kz8BulutSpr(6); kz8Taslar(true); kz8Taslar(false); kz8Tabure();
  for (const d of KZ8_MALZ) kz8MalzSpr(d.ad); kz8Balon(); kz8Kalp(); kz8Nota(); kz8IsiltiSpr();
  kz8SupSap(); kz8SupCali(); kz8SupBag(); kz8SupYildiz();
}

// ═══════════════════════════════ parçacıklar (sabit havuzlar) ═══════════════════════════════
// tip 0 damla (iksir rengi, düşer) · 1 ışık tozu · 2 kalp · 3 ışıltı · 4 nota (mırıldanma) · 5 süpürgenin ışık izi
const KZ8_TZ = []; for (let i = 0; i < 170; i++) KZ8_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#ffffff', ph: 0, zy: 0 });
function kz8Toz(tip, x, y, vx, vy, max, s, col) {
  for (let i = 0; i < KZ8_TZ.length; i++) { const p = KZ8_TZ[i]; if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.ph = Math.random() * 6.2832; p.zy = 1e9; return p; } }
  return null;
}
const KZ8_KB = []; for (let i = 0; i < 30; i++) KZ8_KB.push({ a: false, x: 0, y: 0, vx: 0, vy: 0, r: 4, t: 0, max: 2, ph: 0 });   // gökkuşağı baloncukları
function kz8Kabarcik(x, y, r, vx, vy, max) { for (let i = 0; i < KZ8_KB.length; i++) { const b = KZ8_KB[i]; if (!b.a) { b.a = true; b.x = x; b.y = y; b.r = r; b.vx = vx; b.vy = vy; b.t = 0; b.max = max; b.ph = Math.random() * 6.2832; return b; } } return null; }
const KZ8_PP = []; for (let i = 0; i < 10; i++) KZ8_PP.push({ a: false, u: 0, v: 0, t: 0, max: 1, r: 3 });   // yüzeyde patlayan kabarcıklar
const KZ8_BL = []; for (let i = 0; i < 12; i++) KZ8_BL.push({ a: false, x: 0, y: 0, vx: 0, vy: 0, s: 1, t: 0, max: 2, i: 0, rot: 0 });   // kokulu ışık bulutları
function kz8Bulut(x, y, i, s, vx, vy, max) { for (let j = 0; j < KZ8_BL.length; j++) { const b = KZ8_BL[j]; if (!b.a) { b.a = true; b.x = x; b.y = y; b.i = i; b.s = s; b.vx = vx; b.vy = vy; b.t = 0; b.max = max; b.rot = (Math.random() - 0.5) * 0.3; return b; } } return null; }
const KZ8_HL = []; for (let i = 0; i < 4; i++) KZ8_HL.push({ a: false, t: 0, max: 1, u: 0 });   // yüzeyde yayılan halkalar
const KZ8_PARLA = ['#ffd27a', '#ff9fd3', '#c39bff', '#ffe7a8'];
function kz8IsikSac(x, y, n, hiz, cols) { cols = cols || KZ8_PARLA; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); kz8Toz(i % 3 ? 1 : 3, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.8 + Math.random() * 0.7, i % 3 ? 5 + Math.random() * 6 : 6 + Math.random() * 4, cols[i % cols.length]); } }
function kz8EfektAdim(dt) {
  for (let i = 0; i < KZ8_TZ.length; i++) {
    const p = KZ8_TZ[i]; if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 0) { p.vy += 560 * dt; p.vx *= Math.exp(-dt * 0.8); if (p.vy > 0 && p.y > p.zy) { p.a = false; continue; } }
    else if (p.tip === 1) { p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) - 12 * dt; }
    else if (p.tip === 2) { p.vy = -34; p.vx = Math.sin(p.t * 3 + p.ph) * 16; }
    else if (p.tip === 3) { p.vx *= Math.exp(-dt * 3); p.vy *= Math.exp(-dt * 3); }
    else if (p.tip === 4) { p.vy = -26; p.vx = Math.sin(p.t * 2.6 + p.ph) * 14 + 6; }
    else if (p.tip === 5) { p.vx *= Math.exp(-dt * 1.6); p.vy = p.vy * Math.exp(-dt * 1.6) + 8 * dt; }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (let i = 0; i < KZ8_KB.length; i++) { const b = KZ8_KB[i]; if (!b.a) continue; b.t += dt; if (b.t >= b.max) { b.a = false; if (Math.random() < 0.5) kz8Toz(3, b.x, b.y, 0, -6, 0.35, b.r * 1.1, '#ffffff'); continue; }
    b.x += (b.vx + Math.sin(b.t * 3.2 + b.ph) * 10) * dt; b.y += b.vy * dt; b.vy *= Math.exp(-dt * 0.35); b.vx *= Math.exp(-dt * 0.8); }
  for (let i = 0; i < KZ8_PP.length; i++) { const p = KZ8_PP[i]; if (!p.a) continue; p.t += dt; if (p.t >= p.max) p.a = false; }
  for (let i = 0; i < KZ8_BL.length; i++) { const b = KZ8_BL[i]; if (!b.a) continue; b.t += dt; if (b.t >= b.max) { b.a = false; continue; } b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= Math.exp(-dt * 1.1); b.vy *= Math.exp(-dt * 0.5); }
  for (let i = 0; i < KZ8_HL.length; i++) { const h = KZ8_HL[i]; if (!h.a) continue; h.t += dt; if (h.t >= h.max) h.a = false; }
}
function kz8TozCiz(c) {
  const a0 = c.globalAlpha, KA = kz8Kalp(), NO = kz8Nota(), IS = kz8IsiltiSpr();
  for (let i = 0; i < KZ8_TZ.length; i++) {
    const p = KZ8_TZ[i]; if (!p.a) continue; const u = p.t / p.max, f = 1 - u;
    if (p.tip === 0) { c.globalAlpha = a0 * Math.min(1, f * 2); c.fillStyle = p.col; c.beginPath(); c.arc(p.x, p.y, p.s, 0, 6.2832); c.fill(); c.fillStyle = 'rgba(255,255,255,0.8)'; c.beginPath(); c.arc(p.x - p.s * 0.3, p.y - p.s * 0.35, p.s * 0.35, 0, 6.2832); c.fill(); }
    else if (p.tip === 1 || p.tip === 5) { kz8Isik(c, p.col, p.x, p.y, p.s * (0.6 + f * 0.6), f * (p.tip === 5 ? 0.75 : 0.9)); c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.1, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); kz8KoyS(c, KA, p.x, p.y, (p.s || 1) * (0.8 + u * 0.4)); }
    else if (p.tip === 3) { const k = p.s / 9 * (0.7 + 0.3 * Math.sin(p.t * 14 + p.ph)) * (u < 0.2 ? u * 5 : 1); c.globalAlpha = a0 * f; kz8KoyS(c, IS, p.x, p.y, k); }
    else if (p.tip === 4) { c.globalAlpha = a0 * Math.min(1, f * 1.6) * Math.min(1, u * 5); const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(Math.sin(p.t * 3 + p.ph) * 0.25); kz8Koy(c, NO, 0, 0); c.setTransform(M); }
  }
  c.globalAlpha = a0;
}

// ═══════════════════════════════ oyun durumu ═══════════════════════════════
const KZ8_P = { puf: 1.0, cik: 1.35, don0: 2.6, don1: 3.6, yat: 4.05, cev1: 4.45, gel: 5.5, cev2: 6.0, cev3: 6.35, birak: 6.4, var: 8.9 };   // PUF → süpürge zaman çizelgesi (sn)
function kz8Kagiz(o) { return [o.x + KZ8_KX, o.y + KZ8_IKS]; }
function kz8Siradaki(o) { const k = o.kz; for (const m of k.malz) if (m.durum === 'bekle' || m.durum === 'geri') return m; for (const m of k.malz) if (m.durum === 'cik') return m; return null; }
function kz8Kullanici(o) { const k = o.kz; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
function kz8OyunBasla(o) {   // Nine kepçeyle kazana vurur, dört ışık baloncuğu kazandan yükselir
  const k = o.kz; k.faz = 'oyun'; k.fT = 0; k.idle = 0;
  k.malz.forEach((m, i) => { if (m.durum === 'gizli') { m.durum = 'cik'; m.t = -0.15 - i * 0.32; m.s = 0.3; } });
  k.wob = Math.max(k.wob, 0.7); k.kopukT = 0.5; k.nine.sevT = 0.7;
  const [mx, my] = kz8Kagiz(o); kz8IsikSac(mx, my - 8, 14, 110); for (let i = 0; i < 8; i++) kz8Kabarcik(mx + (Math.random() - 0.5) * 60, my, 3 + Math.random() * 5, 0, -60 - Math.random() * 50, 1.6 + Math.random());
  kz8Sfx('kazanFokur', 0.9);
}
function kz8MalzUc(o, m, kaynak) {   // malzeme kazana uçar (dokunuş, bırakma, yakalama, Pırıl)
  if (!m || m.durum === 'uc' || m.durum === 'dus' || m.durum === 'bitti' || m.durum === 'gizli') return false;
  if (m.durum === 'cik' && m.t < 0) return false;
  const [mx, my] = kz8Kagiz(o), d = Math.hypot(mx - m.x, my - m.y);
  if (KAZAN.tut === m) KAZAN.tut = null;
  m.durum = 'uc'; m.t = 0; m.x1 = m.x; m.y1 = m.y; m.s1 = m.s;
  m.sure = kaynak === 'yakala' ? 0.3 : kaynak === 'piril' ? 0.42 : clamp(d / 480, 0.5, 0.95); m.yay = kaynak === 'yakala' ? 8 : kaynak === 'piril' ? 14 : Math.min(90, d * 0.25);
  kz8IsikSac(m.x, m.y, 9, 80, [m.d.renk, '#ffffff', '#c8f4ff']); kz8Sfx('parilti', 0.45);   // baloncuk "pıt" diye açılır
  o.kz.nine.bakT = 1.2;
  return true;
}
function kz8Malzeme(o, m) {   // malzeme iksire düştü: şıp! renk, köpük, gökkuşağı baloncukları, kokulu ışık bulutu, Nine sevinir
  const k = o.kz; k.n++; const n = k.n, [mx, my] = kz8Kagiz(o);
  k.renkOnce = k.renkU < 0.5 ? k.renkOnce : k.renk; k.renk = Math.min(4, n); k.renkU = 0;
  k.kopukT = 1.1; k.wob = 1; k.flas = 1;
  const col = KZ8_RENK[k.renk];
  for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.2, v = 150 + Math.random() * 140; const p = kz8Toz(0, mx + (Math.random() - 0.5) * 14, my - 2, Math.cos(a) * v, Math.sin(a) * v, 1.4, 2 + Math.random() * 2.8, i % 4 ? col : '#ffffff'); if (p) p.zy = my + 4; }
  for (const h of KZ8_HL) if (!h.a) { h.a = true; h.t = 0; h.max = 0.9; h.u = (Math.random() - 0.5) * 0.2; break; }
  for (let i = 0; i < 9; i++) kz8Kabarcik(mx + (Math.random() - 0.5) * 70, my - 4, 3 + Math.random() * 6, (Math.random() - 0.5) * 30, -70 - Math.random() * 60, 1.8 + Math.random() * 1.2);
  kz8Bulut(mx + (Math.random() - 0.5) * 20, my - 40, k.renk, 0.75, (Math.random() - 0.5) * 16, -30, 3);
  for (let i = 0; i < 3; i++) kz8Toz(2, mx + (i - 1) * 22, my - 50 - i * 8, 0, -34, 2.2 + i * 0.3, 1, '#ff8fb8');
  kz8IsikSac(mx, my - 20, 12, 120, [col, '#ffffff', '#fff3c4']);
  const N = k.nine; N.sevT = 1.4; N.alkT = 1.15; N.kokT = 1.6;
  k.fzSev = 1.4; k.pr.kirp = 1.2;
  kz8Sfx('kazanMalzeme', n); k.fokurT = 0.4;
  OLAY.emit('kazanMalzeme', { o, n, ad: m.d.ad });
  if (n >= KZ8_MALZ.length) k.pufBek = 1.15;
}
function kz8MalzAdim(o, dt) {
  const k = o.kz, [mx, my] = kz8Kagiz(o);
  let yakin = 0;
  for (const m of k.malz) {
    const fx = o.x + m.d.fx, fy = o.y + m.d.fy;
    m.sal = Math.max(0, m.sal - dt * 1.6);
    if (m.durum === 'cik') {
      m.t += dt; if (m.t < 0) { m.x = mx; m.y = my; continue; }
      const u = clamp(m.t / KZ8_CIK, 0, 1), e = 1 - Math.pow(1 - u, 3);
      m.x = lerp(mx, fx, e) + Math.sin(u * Math.PI) * (fx < mx ? -30 : 30); m.y = lerp(my - 10, fy, e) - Math.sin(u * Math.PI) * 50;
      m.s = 0.3 + (KZ8_BS - 0.3) * smooth(Math.min(1, u * 1.5)); m.rot = (1 - e) * 2.4 * (fx < mx ? -1 : 1);
      if (u >= 1) { m.durum = 'bekle'; m.t = 0; kz8IsikSac(m.x, m.y, 5, 40, [m.d.renk, '#ffffff']); }
    } else if (m.durum === 'bekle') {
      m.t += dt; const tt = k.t, w = Math.sin(m.sal * 9) * m.sal;
      m.x = fx + Math.sin(tt * 1.1 + m.i * 1.7) * 5 + w * 6; m.y = fy + Math.sin(tt * 1.5 + m.i) * 7 - m.sal * 6; m.s += (KZ8_BS * (1 + m.sal * 0.12) - m.s) * (1 - Math.exp(-dt * 6)); m.rot = Math.sin(tt * 1.2 + m.i * 2) * 0.12 + w * 0.2;
    } else if (m.durum === 'tut') {
      const kk = 1 - Math.exp(-dt * 20), ox = m.x; m.x += (KAZAN.hx - m.x) * kk; m.y += (KAZAN.hy - m.y) * kk;
      m.s += (KZ8_BS * 1.12 - m.s) * (1 - Math.exp(-dt * 10)); m.rot += (clamp((m.x - ox) / Math.max(dt, 1e-3) * 0.0012, -0.5, 0.5) - m.rot) * (1 - Math.exp(-dt * 8));
      const d = Math.hypot(mx - m.x, my - 20 - m.y); yakin = Math.max(yakin, 1 - clamp((d - KZ8_YAKALA) / 260, 0, 1));
      if (Math.abs(m.x - ox) > 0.4 && Math.random() < dt * 24) kz8Toz(Math.random() < 0.3 ? 3 : 1, m.x + (Math.random() - 0.5) * 30, m.y + (Math.random() - 0.5) * 30, 0, 10, 0.7, 5 + Math.random() * 3, m.d.renk);   // sürüklerken ışık izi
      if (d < KZ8_YAKALA) kz8MalzUc(o, m, 'yakala');
    } else if (m.durum === 'geri') {
      m.t += dt; const u = clamp(m.t / 0.7, 0, 1), e = smooth(u);
      m.x = lerp(m.x1, fx, e); m.y = lerp(m.y1, fy, e) - Math.sin(u * Math.PI) * 14; m.s += (KZ8_BS - m.s) * (1 - Math.exp(-dt * 6)); m.rot *= Math.exp(-dt * 5);
      if (u >= 1) { m.durum = 'bekle'; m.t = 0; }
    } else if (m.durum === 'pir') {
      const pr = k.pr; m.x = pr.x + pr.f * 3; m.y = pr.y + 27; m.s += (0.9 - m.s) * (1 - Math.exp(-dt * 6)); m.rot = Math.sin(k.t * 5) * 0.15;
    } else if (m.durum === 'uc') {
      m.t += dt; const u = clamp(m.t / m.sure, 0, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, tx = mx, ty = my - 6;
      m.x = lerp(m.x1, tx, e); m.y = lerp(m.y1, ty, e) - Math.sin(u * Math.PI) * m.yay; m.rot += dt * 7; m.s = lerp(m.s1, 0.85, e);
      if (u >= 1) { m.durum = 'dus'; m.t = 0; }
    } else if (m.durum === 'dus') {
      m.t += dt; const u = clamp(m.t / 0.24, 0, 1); m.x = mx; m.y = my - 6 + u * 9; m.s = lerp(0.85, 0.3, u); m.rot += dt * 7;
      if (u >= 1) { m.durum = 'bitti'; kz8Malzeme(o, m); }
    }
  }
  k.yakin += (yakin - k.yakin) * (1 - Math.exp(-dt * 6));
}
function kz8OyunAdim(o, dt) {
  const k = o.kz; let bekleyen = false, hareket = false;
  for (const m of k.malz) { if (m.durum === 'bekle' || m.durum === 'geri') bekleyen = true; else if (m.durum === 'uc' || m.durum === 'dus' || m.durum === 'pir' || m.durum === 'tut' || m.durum === 'cik') hareket = true; }
  const esik = k.helpN > 0 ? KZ8_YARDIM2 : KZ8_YARDIM;
  if (KAZAN.ptr < 0 && bekleyen && !hareket) { k.idle += dt; if (!k.helpOn && k.idle >= esik) { k.helpOn = true; k.helpT = 0; k.helpN++; } }
  if (k.helpOn) k.helpT += dt;
  if (k.pufBek > 0) { k.pufBek -= dt; if (k.pufBek <= 0) { k.pufBek = -1; k.faz = 'puf'; k.pt = 0; k.helpOn = false; kz8GirdiBirak(); } }
}
function kz8IksirAdim(o, dt, gorunur) {
  const k = o.kz, puf = k.faz === 'puf';
  k.renkU = Math.min(1, k.renkU + dt / 0.9);
  k.kopukT = Math.max(0, k.kopukT - dt); const hk = k.kopukT > 0 ? 1 : 0;
  k.kopuk += (hk - k.kopuk) * (1 - Math.exp(-dt * (hk ? 7 : 1.2)));
  k.wob = Math.max(0, k.wob - dt * 1.5); k.flas = Math.max(0, k.flas - dt * 1.6);
  k.swA += dt * (0.6 + k.kopuk * 1.6 + (puf && k.pt < KZ8_P.puf ? 6 * k.pt : 0));
  if (puf && k.pt < KZ8_P.puf) k.wob = Math.max(k.wob, 0.35 + 0.5 * k.pt);
  if (!gorunur) return;
  const mx = o.x + KZ8_KX, my = o.y + KZ8_IKS;
  k.popT -= dt * (1.2 + k.kopuk * 4 + (puf && k.pt < KZ8_P.puf ? 8 : 0));
  if (k.popT <= 0) { k.popT = 0.5 + Math.random() * 0.6; for (const p of KZ8_PP) if (!p.a) { p.a = true; p.t = 0; p.max = 0.55 + Math.random() * 0.4; p.u = (Math.random() - 0.5) * 1.5; p.v = (Math.random() - 0.5) * 1.2; p.r = 2 + Math.random() * 2.6; break; } }
  k.balT -= dt * (0.5 + k.kopuk * 9 + (puf && k.pt < KZ8_P.cik ? 16 : 0) + (o.done ? 0.5 : 0));
  if (k.balT <= 0) { k.balT = 0.7 + Math.random() * 0.6; kz8Kabarcik(mx + (Math.random() - 0.5) * 70, my - 2, 2.5 + Math.random() * 5, (Math.random() - 0.5) * 20, -40 - Math.random() * 45, 1.8 + Math.random() * 1.3); }
  k.isT -= dt; if (k.isT <= 0) { k.isT = 0.3 + Math.random() * 0.45; kz8Toz(1, mx + (Math.random() - 0.5) * 120, o.y - 8, (Math.random() - 0.5) * 10, -28 - Math.random() * 26, 1.3 + Math.random(), 4 + Math.random() * 4, KZ8_PARLA[(Math.random() * 4) | 0]); }
  if (Math.abs(P.x - o.x) < 520) { k.fokurT -= dt; if (k.fokurT <= 0) { k.fokurT = (k.aktif ? 3.2 : 5) + Math.random() * 2.5; kz8Sfx('kazanFokur', k.aktif ? 0.55 : 0.3); } }
}
function kz8NineYer(o) { return [o.x + KZ8_NX, o.y - KZ8_TAB]; }
function kz8NineAdim(o, dt, gorunur) {
  const k = o.kz, n = k.nine;
  n.sevT = Math.max(0, n.sevT - dt); n.elT = Math.max(0, n.elT - dt); n.alkT = Math.max(0, n.alkT - dt); n.konT = Math.max(0, n.konT - dt); n.kokT = Math.max(0, n.kokT - dt); n.bakT = Math.max(0, n.bakT - dt);
  const ap = (v, h, sp) => v + (h - v) * (1 - Math.exp(-dt * sp));
  n.sev = ap(n.sev, n.sevT > 0 ? 1 : 0, 6); n.el = ap(n.el, n.elT > 0 ? 1 : 0, 5); n.alk = ap(n.alk, n.alkT > 0 ? 1 : 0, 7); n.kon = ap(n.kon, n.konT > 0 ? 1 : 0, 8);
  const puf = k.faz === 'puf' || k.faz === 'ucus';
  const birak = n.alkT > 0 || (puf && k.pt > 0.7 && k.pt < KZ8_P.var + 0.6);
  n.kar = ap(n.kar, birak ? 0 : 1, 3.5);
  n.kph += dt * (2.4 + k.kopuk * 1.4 + (puf && k.pt < KZ8_P.puf ? 4 : 0)) * Math.max(0.25, n.kar);
  const mirH = (k.faz === 'bekle' || k.faz === 'bitti' || (k.faz === 'oyun' && k.idle > 1.5 && !KAZAN.tut)) && n.sevT <= 0 && n.alkT <= 0 && n.konT <= 0 ? 1 : 0;
  n.mir = ap(n.mir, mirH, 2);
  // bakış: tutulan / uçan malzeme · süpürge · Feza
  const [nx0, ny0] = kz8NineYer(o), hx = nx0, hy = ny0 - 93;
  let tx = P.x, ty = P.y - 50;
  const tut = KAZAN.tut; if (tut) { tx = tut.x; ty = tut.y; }
  else { const u = k.malz.find(m => m.durum === 'uc' || m.durum === 'pir'); if (u) { tx = u.x; ty = u.y; } else if (k.faz === 'oyun' && n.kar > 0.5 && !(k.idle > 6)) { tx = o.x + KZ8_KX; ty = o.y + KZ8_IKS; } }
  if (puf && KAZAN.supurge.gorunur) { tx = KAZAN.supurge.x; ty = KAZAN.supurge.y; }
  n.bakX = ap(n.bakX, clamp((hx - tx) / 160, -1, 1), 5); n.bakY = ap(n.bakY, clamp((ty - hy) / 160, -1, 1), 5);
  n.egil = ap(n.egil, tut ? 0.06 : 0, 4);
  if (gorunur && n.mir > 0.55) { n.notaT -= dt; if (n.notaT <= 0) { n.notaT = 1.2 + Math.random() * 0.9; kz8Toz(4, hx - 14, hy + 4, 0, -26, 2.4, 1, '#f2e8ff'); } }
  if (o.done && !k.aktif && k.faz === 'bitti' && Math.abs(P.x - nx0) < 340 && Math.abs(P.y - o.y) < 200) { n.salBek -= dt; if (n.salBek <= 0) { n.elT = 2.1; n.salBek = 9 + Math.random() * 5; } }
}
function kz8PufAdim(o, dt) {   // dördüncü malzemeden sonra: PUF → gökkuşağı girdabı → süpürge canlanır → Feza'ya sokulur → kalkış yerine
  const k = o.kz, t0 = k.pt; k.pt += dt; const t = k.pt, gec = a => t0 < a && t >= a, [mx, my] = kz8Kagiz(o), N = k.nine;
  if (k.faz === 'bitti') return;
  if (gec(0.001)) { k.renkOnce = k.renk; k.renk = 5; k.renkU = 0; k.kopukT = 1.0; N.sevT = 0.6; }
  if (gec(KZ8_P.puf)) {
    kz8Sfx('kazanPuf'); OLAY.emit('kazanPuf', { o });
    k.flas = 1.4; k.wob = 1; k.kopukT = 1.6;
    for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.36; kz8Bulut(mx + Math.cos(a) * 20, my - 30 + Math.sin(a) * 10, i % 6 === 5 ? 6 : [1, 2, 3, 4, 0][i % 5], 0.7 + Math.random() * 0.35, Math.cos(a) * 120, Math.sin(a) * 70 - 20, 2.6 + Math.random() * 0.6); }
    kz8IsikSac(mx, my - 40, 26, 230, KZ8_GOK);
    for (let i = 0; i < 14; i++) kz8Kabarcik(mx + (Math.random() - 0.5) * 80, my - 10, 4 + Math.random() * 6, (Math.random() - 0.5) * 90, -90 - Math.random() * 80, 2 + Math.random());
    N.sevT = 2.4; N.alkT = 1.6; k.fzSev = 2.0; k.pr.kirp = 1.4;
  }
  if (gec(KZ8_P.cik)) { kz8Sfx('supurgeCanlan'); kz8IsikSac(mx, my - 20, 16, 140, ['#ffe7a8', '#ffd27a', '#ffffff']); }
  if (gec(KZ8_P.don0)) for (let i = 0; i < 10; i++) { const a = i / 10 * 6.2832; kz8Toz(3, mx + Math.cos(a) * 60, my - 190 + Math.sin(a) * 30, Math.cos(a) * 40, Math.sin(a) * 20, 0.9, 8, '#ffffff'); }
  if (gec(KZ8_P.gel)) { const S = KAZAN.supurge; for (let i = 0; i < 4; i++) kz8Toz(2, S.x - 40 + i * 18, S.y - 30, 0, -34, 2.2, 1, '#ff8fb8'); k.fzSev = 1.4; k.pr.kirp = 1; kz8Sfx('parilti', 0.6); }
  if (gec(KZ8_P.cev2 - 0.2)) N.elT = 2.6;
  if (gec(KZ8_P.birak)) { k.faz = 'ucus'; N.alkT = 1.2; N.sevT = 1.4; k.fzSev = 1.6; }   // süpürge kalkış yerine uçar; kadraj sahnede kalır
  if (gec(KZ8_P.var)) {
    const S = KAZAN.supurge; S.hazir = true; k.faz = 'bitti';
    kz8Birak(o, true);   // süpürge yerine varınca: Feza bırakılır, o.done, V8.kazan (kapı açılır) ve kazanBitti birlikte
    if (typeof V8 !== 'undefined' && V8) { V8.kazan = true; V8.supurgeHazir = true; }
    for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832; kz8Toz(i % 2 ? 1 : 3, KZ8_SUP_YER.x + Math.cos(a) * 30, KZ8_SUP_YER.y + Math.sin(a) * 14, Math.cos(a) * 90, Math.sin(a) * 40, 1, 7, KZ8_GOK[i % 6]); }
    kz8Sfx('parilti', 0.7);
    OLAY.emit('kazanBitti', { o, supurge: { x: KZ8_SUP_YER.x, y: KZ8_SUP_YER.y, aci: -0.06, s: 1 } });
  }
}
function kz8SupurgeAdim(o, dt) {   // süpürgenin pozu (zaman çizelgesinden) + bekleme salınımı + ışık izi
  const k = o.kz, S = KAZAN.supurge, t = k.t;
  if (k.faz === 'puf' || k.faz === 'ucus') kz8SupPoz(o, k.pt, t);
  else if (k.faz === 'bitti') { S.gorunur = true; S.hazir = true; kz8SupBekle(t); }
  else { S.gorunur = false; }
  if (typeof V8 !== 'undefined' && V8 && V8.supurgeAldi) S.gorunur = false;
  const sn = k.supN; if (sn) { sn.x = S.gorunur ? S.x : KZ8_SUP_YER.x; sn.y = S.y; }
  if (S.gorunur && k.faz === 'ucus') { k.izT -= dt; if (k.izT <= 0) { k.izT = 0.028; const sg = S.yon < 0 ? -1 : 1, bx = S.x - Math.cos(S.aci) * 70 * sg, by = S.y - Math.sin(S.aci) * 70 * sg; kz8Toz(5, bx + (Math.random() - 0.5) * 12, by + (Math.random() - 0.5) * 12, -sg * 30, (Math.random() - 0.5) * 20, 2.2 + Math.random() * 0.8, 6 + Math.random() * 5, KZ8_GOK[(Math.random() * 6) | 0]); } }
  if (S.gorunur && k.faz === 'bitti' && Math.random() < dt * 2.2) kz8Toz(3, S.x + (Math.random() - 0.5) * 140, S.y + (Math.random() - 0.5) * 30, 0, -10, 0.9, 6, '#ffffff');
}
function kz8SupBekle(t) { const S = KAZAN.supurge; S.x = KZ8_SUP_YER.x; S.y = KZ8_SUP_YER.y + Math.sin(t * 2.2) * 4; S.aci = -0.06 + Math.sin(t * 1.7) * 0.03; S.s = 1; S.yon = 1; S.alfa = 1; S.isik = 0.7; S.kipir = 0.25 + 0.35 * Math.max(0, Math.sin(t * 0.9)); }
function kz8SupPoz(o, pt, t) {
  const k = o.kz, S = KAZAN.supurge, P8 = KZ8_P, [mx, my] = kz8Kagiz(o), e = k.entry, fx = e.x + 104, fy = e.y - 50, H = my - 190;
  S.kipir = 1; S.isik = 1; S.alfa = 1; S.s = 1; S.yon = 1; S.aci = 0; S.hazir = false;
  if (pt < P8.cik) { S.gorunur = false; S.x = mx; S.y = my; return; }
  S.gorunur = true;
  if (pt < P8.don0) { const u = (pt - P8.cik) / (P8.don0 - P8.cik), e1 = 1 - Math.pow(1 - u, 3); S.x = mx + Math.sin(pt * 7) * 3 * (1 - u); S.y = lerp(my + 6, H, e1); S.aci = -Math.PI / 2 + Math.sin(pt * 9) * 0.1 * (1 - u); S.s = 0.3 + 0.7 * smooth(Math.min(1, u * 1.4)); S.alfa = Math.min(1, u * 5); return; }
  if (pt < P8.don1) { const u = (pt - P8.don0) / (P8.don1 - P8.don0); S.x = mx; S.y = H - Math.sin(u * Math.PI) * 26; S.aci = -Math.PI / 2 + smooth(u) * 6.2832; return; }
  if (pt < P8.yat) { const u = smooth((pt - P8.don1) / (P8.yat - P8.don1)); S.x = mx + u * 10; S.y = H - Math.sin(u * Math.PI) * 6; S.aci = -Math.PI / 2 * (1 - u); return; }   // dikeyden yataya (sap sağa)
  if (pt < P8.cev1) { const u = (pt - P8.yat) / (P8.cev1 - P8.yat); S.x = mx + 10; S.y = H; S.yon = Math.cos(u * Math.PI); S.aci = Math.sin(pt * 8) * 0.05; return; }   // döner: sap Feza'ya
  if (pt < P8.gel) { const u = (pt - P8.cev1) / (P8.gel - P8.cev1), e2 = smooth(u); S.yon = -1; S.x = lerp(mx + 10, fx, e2); S.y = lerp(H, fy, e2) - Math.sin(u * Math.PI) * 40; S.aci = 0.12 * Math.sin(u * Math.PI); return; }
  if (pt < P8.cev2) { const u = (pt - P8.gel) / (P8.cev2 - P8.gel); S.yon = -1; S.x = fx - Math.sin(u * Math.PI * 2) * 9; S.y = fy + Math.sin(t * 5) * 2; S.aci = Math.sin(u * Math.PI * 3) * 0.12; return; }   // sokulur
  if (pt < P8.cev3) { const u = (pt - P8.cev2) / (P8.cev3 - P8.cev2); S.x = fx; S.y = fy - u * 6; S.yon = -Math.cos(u * Math.PI); return; }   // kalkış yerine döner
  if (pt < P8.var) { const u = (pt - P8.cev3) / (P8.var - P8.cev3), e3 = smooth(u); S.x = lerp(fx, KZ8_SUP_YER.x, e3); S.y = lerp(fy - 6, KZ8_SUP_YER.y, e3) - Math.sin(e3 * Math.PI) * 120; S.aci = -0.06 * u - 0.2 * Math.sin(u * Math.PI) * (1 - u) + 0.08 * Math.sin(u * Math.PI) * u; S.kipir = 0.6; return; }
  kz8SupBekle(t);
}
function kz8PirilAdim(o, dt) {   // Pırıl: Feza'nın yanı · ipucu (malzemenin yanında kazana doğru süzülür) · yardım (taşır) · kutlama
  const k = o.kz, pr = k.pr, e = k.entry, [mx, my] = kz8Kagiz(o);
  pr.kirp = Math.max(0, pr.kirp - dt);
  let tx = e.x + 46, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'oyun') {
    const sira = kz8Siradaki(o), ta = k.tasinan, ipucu = k.idle > KZ8_GOSTER || k.helpOn;
    if (ta && ta.durum === 'pir') {   // malzemeyi kazanın üstüne taşıyor
      tx = mx + 4; ty = my - 112 + Math.sin(k.t * 4) * 3; hiz = 3; bak = Math.sign(mx - pr.x) || 1;
      if (Math.hypot(tx - pr.x, ty - pr.y) < 16) { kz8MalzUc(o, ta, 'piril'); k.tasinan = null; k.helpT = -0.8; pr.kirp = 0.5; }
    } else if (k.tasinan && k.tasinan.durum !== 'pir') k.tasinan = null;
    else if (k.helpOn && sira && sira.durum === 'bekle' && k.helpT > 0.8) {   // sıradakini almaya gider
      tx = sira.x - 2; ty = sira.y - 27; hiz = 3.2; bak = Math.sign(sira.x - pr.x) || 1;
      if (Math.hypot(tx - pr.x, ty - pr.y) < 18) { sira.durum = 'pir'; k.tasinan = sira; kz8Sfx('parilti', 0.5); kz8IsikSac(sira.x, sira.y, 6, 50, [sira.d.renk, '#ffffff']); }
    } else if (ipucu && sira && sira.durum === 'bekle') {   // yol gösterir: malzemenin yanından kazana doğru kısa bir süzülüş, ardında ışık izi
      const u = (k.t * 0.5) % 1, s = smooth(Math.min(1, u * 1.4)), ax = sira.x - 34, ay = sira.y - 18;
      tx = lerp(ax, lerp(ax, mx, 0.35), s); ty = lerp(ay, lerp(ay, my - 80, 0.35), s) - Math.sin(Math.min(1, u * 1.4) * Math.PI) * 18; hiz = 5; bak = Math.sign(mx - sira.x) || 1;
      if (Math.random() < dt * 12) kz8Toz(1, pr.x - bak * 8, pr.y + 6, -bak * 14, 6, 0.9, 5, KZ8_PARLA[(Math.random() * 4) | 0]);
    } else bak = Math.sign(mx - pr.x) || 1;
  } else if (k.faz === 'puf') {
    const t = k.pt, S = KAZAN.supurge;
    if (t > KZ8_P.puf && t < KZ8_P.don0) { tx = mx - 86; ty = my - 150 + Math.sin(k.t * 3) * 6; hiz = 3; bak = 1; }
    else if (t >= KZ8_P.don0 && t < KZ8_P.cev1 + 0.2) { const a = (t - KZ8_P.don0) * 3.4; tx = S.x + Math.cos(a) * 78; ty = S.y + Math.sin(a) * 34; hiz = 6; bak = Math.sin(a) > 0 ? -1 : 1; }
    else { tx = e.x + 40; ty = e.y - 122 + Math.sin(k.t * 2.4) * 5; hiz = 4; bak = 1; }
  } else if (k.faz === 'gel') bak = 1;
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}
function kz8Aktiflestir(o) {
  const k = o.kz; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x = clamp(P.x, o.x + KZ8_GIR0, o.x + KZ8_GIR1); e.y = P.y; e.safeX = P.safeX; e.safeY = P.safeY; e.f = 1;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; KAZAN.o = o; kz8GirdiBirak();
  P.ucus = o; P.x = e.x; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  if (k.faz === 'bekle') { k.faz = 'gel'; k.fT = 0; k.nine.elT = 2.0; k.nine.konT = 0; }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kazan', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('kazanBasla', { o }); }
  return true;
}
function kz8Birak(o, tamam) {   // Feza'yı bırak: giriş fotoğrafındaki konum aynen geri verilir
  const k = o.kz, e = k.entry; if (!k.aktif) return;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; kz8GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kazan', 0.1, k.kameraFn, 1, 0.42);
  if (tamam && !o.done) { o.done = true; o.tk.bitti = true; k.bitti = true; if (typeof V8 !== 'undefined' && V8) V8.kazan = true; }
}
function kz8Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza girişte durur
  const k = o.kz; if (!k.aktif || P.ucus !== o) return;
  P.x = k.entry.x; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function kz8Kamera(o) {
  const k = o.kz; omDkEkle(o.x - 470, o.y - 345, o.x + 168, o.y + 25);
  const S = KAZAN.supurge; if (k.faz === 'puf' && S.gorunur && k.pt < KZ8_P.cev3) omDkEkle(S.x - 90, S.y - 40, S.x + 90, S.y + 30);
  if (k.faz === 'ucus' || (k.faz === 'puf' && k.pt > KZ8_P.cev2)) { omDkEkle(S.x - 100, S.y - 50, S.x + 100, S.y + 30); omDkEkle(KZ8_SUP_YER.x - 110, KZ8_SUP_YER.y - 60, KZ8_SUP_YER.x + 110, o.y + 25); omDkEkle(o.x, o.y - 640, o.x, o.y - 640); }   // uçuşta kadraj kalkış yerini de alır
}
function kz8Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.kz;
  if (DURUM !== 'oyun' && (k.aktif || k.faz === 'puf' || k.faz === 'ucus')) return;
  k.t += dt;
  const gorunur = typeof cam !== 'undefined' && o.x > cam.x - 760 && o.x < cam.x + VW + 760;
  kz8EfektAdim(dt);
  kz8IksirAdim(o, dt, gorunur);
  kz8NineAdim(o, dt, gorunur);
  if (k.faz === 'puf' || k.faz === 'ucus') kz8PufAdim(o, dt);
  kz8SupurgeAdim(o, dt);
  k.fzSev = Math.max(0, k.fzSev - dt);
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - KZ8_AKTIF && P.x < o.x + 200 && Math.abs(P.y - o.y) < 160) kz8Aktiflestir(o);
  if (!k.aktif) return;
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kazan', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  if (k.faz === 'gel') { if (k.fT >= KZ8_GEL) kz8OyunBasla(o); }
  else if (k.faz === 'oyun') kz8OyunAdim(o, dt);
  kz8MalzAdim(o, dt);
  kz8PirilAdim(o, dt);
}

// ═══════════════════════════════ çizim ═══════════════════════════════
const KZ8_NO = {};   // cadiCiz seçenekleri (karede yeniden kullanılır)
const KZ8_FZ_OPT = { ruzgar: 0.1 };
const KZ8_SUP_O = {};
function kz8Ciz(o, tm) {   // Feza'nın arkası: yer ışığı, taşlar, tabure, Cadı Nine, kazan, iksir, köpük
  const k = o.kz, X = o.x, Y = o.y, kx = X + KZ8_KX, ky = Y + KZ8_IKS, n = k.nine;
  const c0 = KZ8_RENK[k.renkOnce], c1 = KZ8_RENK[k.renk], u = k.renkU, nab = 0.85 + 0.15 * Math.sin(tm * 1.7);
  // kazanın altındaki sihirli ışık (ateş değil): iksirin rengiyle yumuşak parıltı
  kz8IsikE(g, c0, kx, Y - 6, 175, 50, (1 - u) * 0.75 * nab); kz8IsikE(g, c1, kx, Y - 6, 175, 50, u * 0.75 * nab);
  kz8IsikE(g, '#ffd27a', kx, Y - 6, 100, 26, 0.45 * nab + k.flas * 0.3);
  kz8Koy(g, kz8Taslar(false), kx, Y);
  kz8Koy(g, kz8Tabure(), X + KZ8_NX, Y);
  // Cadı Nine (kazanın arkasında, taburede); kepçenin ucu iksirin içinde döner
  const N = KZ8_NO, [nx0, ny0] = kz8NineYer(o);
  N.tip = 'nine'; N.yon = -1; N.karistir = n.kar; N.kph = n.kph; N.kepceBatik = true;
  N.kepceUcX = kx + 30 + Math.cos(n.kph) * 11; N.kepceUcY = ky + 1 + Math.sin(n.kph) * 2.6;
  N.sevinc = Math.max(n.sev, n.kokT > 0 ? 0.25 : 0); N.el = n.el; N.alkis = n.alk; N.mirildan = n.mir; N.konus = n.kon; N.bakX = n.bakX; N.bakY = n.bakY; N.egil = n.egil; N.dans = 0; N.alfa = 1; N.faz = undefined;
  const L = cadiCiz(g, nx0, ny0, 1, tm, N), kep = L.kepce && n.kar > 0.02, ax = L.ax, ay = L.ay, bx = L.bx, by = L.by;
  // kazan (malzeme düşünce yaylanır)
  const M = g.getTransform(), w = k.wob, sq = Math.sin(tm * 21) * 0.03 * w;
  if (w > 0.001) { g.translate(kx, Y); g.scale(1 + sq, 1 - sq); g.translate(-kx, -Y); }
  kz8Koy(g, kz8KazanGovde(), kx, Y);
  // iksir: renk geçişi, girdap, kabarcıklar
  g.globalAlpha = 1; kz8Koy(g, kz8IksirSpr(u >= 1 ? k.renk : k.renkOnce), kx, ky);
  if (u < 1) { g.globalAlpha = u; kz8Koy(g, kz8IksirSpr(k.renk), kx, ky); g.globalAlpha = 1; }
  { const M2 = g.getTransform(); g.translate(kx, ky); g.scale(1, KZ8_IRY / KZ8_IRX); g.rotate(k.swA);
    g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 3.2; g.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const r = 12 + i * 11, a = i * 2.1; g.beginPath(); g.arc(0, 0, r, a, a + 1.5); g.stroke(); }
    g.setTransform(M2); }
  for (const p of KZ8_PP) if (p.a) { const v = p.t / p.max, x = kx + p.u * KZ8_IRX * 0.75, y = ky + p.v * KZ8_IRY * 0.7;
    if (v < 0.75) { const r = p.r * (0.4 + v); g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(x, y - r * 0.4, r, r * 0.8, 0, 0, 6.2832); g.fill(); }
    else { const r = p.r * (1.2 + (v - 0.75) * 6); g.strokeStyle = 'rgba(255,255,255,' + (0.6 * (1 - v) * 4).toFixed(2) + ')'; g.lineWidth = 1.1; g.beginPath(); g.ellipse(x, y, r, r * 0.3, 0, 0, 6.2832); g.stroke(); } }
  for (const h of KZ8_HL) if (h.a) { const v = h.t / h.max, r = 6 + v * 40; g.strokeStyle = 'rgba(255,255,255,' + (0.7 * (1 - v)).toFixed(2) + ')'; g.lineWidth = 2; g.beginPath(); g.ellipse(kx + h.u * 20, ky, r, r * KZ8_IRY / KZ8_IRX, 0, 0, 6.2832); g.stroke(); }
  // kepçenin iksire giren parçası (kazanın önünde kalan kısmı) + ucunda dalgacık
  if (kep) {
    const ex = kx + 58, uu = Math.abs(ax - bx) > 0.5 ? clamp((ex - bx) / (ax - bx), 0, 1) : 1;
    kz8KepceCiz(g, bx, by, lerp(bx, ax, uu), lerp(by, ay, uu), 1);
    g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1.3; g.beginPath(); g.ellipse(bx, by + 0.5, 8 + Math.sin(tm * 6) * 1.2, 2.3, 0, 0, 6.2832); g.stroke();
  }
  // köpük
  if (k.kopuk > 0.02) {
    const h = k.kopuk, ws = 0.82 + 0.18 * h, sp0 = kz8KopukSpr(k.renkOnce), sp1 = kz8KopukSpr(k.renk);
    const dw = sp1.w * ws, dh = sp1.h * h, x0 = kx + sp1.x0 * ws, y0 = ky + 2 + sp1.y0 * h;
    g.globalAlpha = Math.min(1, h * 1.6) * (1 - u); if (g.globalAlpha > 0.01) g.drawImage(sp0, x0, y0, dw, dh);
    g.globalAlpha = Math.min(1, h * 1.6) * u; g.drawImage(sp1, x0, y0, dw, dh); g.globalAlpha = 1;
  }
  kz8Koy(g, kz8KazanOn(), kx, Y);
  kz8Isik(g, c0, kx, ky - 8, 78, 0.3 * (1 - u) * nab); kz8Isik(g, c1, kx, ky - 8, 78, 0.3 * u * nab);   // iksirin kendi ışığı (renk değişimi uzaktan da görünsün)
  if (k.flas > 0.01) kz8Isik(g, c1, kx, ky - 10, 120, k.flas * 0.5);
  if (k.yakin > 0.02) kz8Isik(g, '#fff3c4', kx, ky - 14, 100, k.yakin * 0.45 * (0.85 + 0.15 * Math.sin(tm * 8)));
  g.setTransform(M);
  // ön taşlar ve aralarındaki ışık taşları
  kz8Koy(g, kz8Taslar(true), kx, Y);
  for (let i = 0; i < 3; i++) { const x = kx + [-40, -3, 34][i], y = Y - 7, a = 0.55 + 0.3 * Math.sin(tm * 2.1 + i * 2.2); kz8Isik(g, KZ8_PARLA[i], x, y, 20, a); g.fillStyle = '#fff6e0'; g.globalAlpha = 0.8; g.beginPath(); g.arc(x, y, 2.6, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
}
function kz8CizOn(o, tm) {   // Feza'nın önü: koku kurdeleleri, bulutlar, baloncuklar, girdap, Feza, Pırıl, malzemeler, parçacıklar
  const k = o.kz, kx = o.x + KZ8_KX, ky = o.y + KZ8_IKS, c1 = KZ8_RENK[k.renk];
  // tatlı koku kurdeleleri (dalgalı, yükselen)
  g.lineCap = 'round'; g.lineWidth = 2.6; g.strokeStyle = mixc(c1, '#ffffff', 0.35, 0.26 + k.kopuk * 0.2);
  for (let j = 0; j < 3; j++) { g.beginPath(); for (let i = 0; i <= 10; i++) { const v = i / 10, x = kx + (j - 1) * 22 + Math.sin(v * 7 + tm * 2 + j * 2) * 7 * (0.4 + v), y = ky - 12 - v * (70 + k.kopuk * 40); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  // kokulu ışık bulutları
  for (const b of KZ8_BL) if (b.a) { const v = b.t / b.max, sp = kz8BulutSpr(b.i), s = b.s * (0.6 + v * 0.7); g.globalAlpha = Math.min(1, v * 5) * (1 - v) * 0.72; const M = g.getTransform(); g.translate(b.x, b.y); g.rotate(b.rot); kz8KoyS(g, sp, 0, 0, s); g.setTransform(M); }
  g.globalAlpha = 1;
  // gökkuşağı baloncukları
  const BA = kz8Balon();
  for (const b of KZ8_KB) if (b.a) { const v = b.t / b.max, r = b.r * (0.6 + Math.min(1, v * 4) * 0.4); g.globalAlpha = Math.min(1, (1 - v) * 3); g.drawImage(BA, b.x - r * 1.125, b.y - r * 1.125, r * 2.25, r * 2.25); }
  g.globalAlpha = 1;
  // PUF sonrası gökkuşağı girdabı
  if ((k.faz === 'puf' || k.faz === 'ucus') && k.pt > KZ8_P.puf && k.pt < KZ8_P.yat + 0.6) kz8GirdapCiz(kx, ky, k.pt - KZ8_P.puf, tm);
  // Feza ve Pırıl (etkinlik sürerken bu dosya çizer)
  if (k.aktif && P.ucus === o) {
    const sev = k.fzSev > 0 || (k.faz === 'gel' && k.fT > 0.3 && k.fT < 0.9);
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, P.x, P.y, 1, sev ? 'sevinc' : 'ayakta_yan', tm, null, KZ8_FZ_OPT); } catch (e) {}
    if (typeof pirilCizPoz === 'function') { const pr = k.pr; try { g.save(); g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, pr.kirp > 0 ? 'goz_kirp' : 'ucus', tm); g.restore(); } catch (e) { g.restore(); } }
  }
  // havadaki malzemeler (ışık baloncuklarının içinde)
  if (k.aktif || k.faz === 'oyun') kz8MalzCiz(o, tm);
  kz8TozCiz(g);
}
function kz8GirdapCiz(kx, ky, t, tm) {   // yükselen gökkuşağı girdabı: renkli ışık tanelerinden sarmal
  const a0 = g.globalAlpha, sol = Math.min(1, t * 3) * (1 - clamp((t - 2.6) / 0.9, 0, 1));
  if (sol <= 0.01) return;
  for (let i = 0; i < 42; i++) {
    const v = (i / 42 + t * 0.45) % 1, h = v * 250, a = v * 13 + t * 5, r = 14 + h * 0.3, z = Math.cos(a);
    const x = kx + Math.sin(a) * r, y = ky - 8 - h, col = KZ8_GOK[i % 6], s = (7 + 5 * (z + 1) * 0.5) * (1 - v * 0.4);
    kz8Isik(g, col, x, y, s * 2.4, sol * (0.45 + 0.35 * z) * (1 - v * 0.6));
    if (z > 0) { g.globalAlpha = a0 * sol * (1 - v); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 1.6, 0, 6.2832); g.fill(); g.globalAlpha = a0; }
  }
}
function kz8MalzCiz(o, tm) {
  const k = o.kz, sira = kz8Siradaki(o), ipucu = k.faz === 'oyun' && (k.idle > KZ8_IPUCU || k.helpOn) && !k.tasinan, BA = kz8Balon(), [mx, my] = kz8Kagiz(o);
  if (ipucu && sira && sira.durum === 'bekle') {   // kazana doğru akan ışık tozu
    const cxp = (sira.x + mx) / 2, cyp = Math.min(sira.y, my) - 70;
    for (let i = 0; i < 8; i++) { const v = (i / 8 + tm * 0.4) % 1, q = 1 - v, x = q * q * sira.x + 2 * q * v * cxp + v * v * mx, y = q * q * sira.y + 2 * q * v * cyp + v * v * (my - 10);
      kz8Isik(g, sira.d.renk, x, y, 14, 0.5 * Math.sin(v * Math.PI)); g.globalAlpha = 0.8 * Math.sin(v * Math.PI); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 1.6, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  }
  for (const m of k.malz) {
    if (m.durum === 'gizli' || m.durum === 'bitti' || (m.durum === 'cik' && m.t < 0)) continue;
    const vurgu = m === sira && ipucu ? 0.5 + 0.3 * Math.sin(tm * 4) : 0, tut = m.durum === 'tut', balon = m.durum !== 'uc' && m.durum !== 'dus';
    const a = m.durum === 'dus' ? 1 - clamp(m.t / 0.24, 0, 1) : 1;
    kz8Isik(g, m.d.renk, m.x, m.y, (56 + vurgu * 30) * m.s, (0.6 + vurgu * 0.4 + (tut ? 0.25 : 0)) * a);
    kz8Isik(g, '#ffffff', m.x, m.y, 26 * m.s, 0.35 * a);
    const M = g.getTransform(); g.translate(m.x, m.y); g.rotate(m.rot); g.globalAlpha = a; kz8KoyS(g, kz8MalzSpr(m.d.ad), 0, 0, m.s); g.setTransform(M);
    if (balon) { const r = 33 * m.s * (1 + Math.sin(tm * 2.3 + m.i) * 0.03 + vurgu * 0.06); g.globalAlpha = 0.95; g.drawImage(BA, m.x - r * 1.125, m.y - r * 1.125, r * 2.25, r * 2.25); }
    g.globalAlpha = 1;
  }
}
function kz8SupNesneCiz(n, tm) {   // süpürge (ayrı nesne: kalkış yerinde de çizilsin diye)
  const S = KAZAN.supurge; if (!S.gorunur || !(S.alfa > 0.01)) return;
  const O = KZ8_SUP_O; O.aci = S.aci; O.yon = S.yon; O.kipir = S.kipir; O.isik = S.isik; O.alfa = S.alfa;
  kazanSupurgeCiz(g, S.x, S.y, S.s, tm, O);
}
TUR.kaydet('kazanSupurge', { cizOn: kz8SupNesneCiz });

// ═══════════════════════════════ girdi ═══════════════════════════════
// Parmak/fare malzemeyi tutup sürükler; kısa dokunuş uçurur; kazana / Nine'ye dokunmak sıradakini getirir (pencere yakalama evresi:
// motorun yürüme parmağına gitmez).
function kz8Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function kz8Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function kz8MalzBul(o, x, y) {
  const k = o.kz, rr = Math.max(60, 46 * DPR / Math.max(S, 0.001)); let en = null, ed = Infinity;
  for (const m of k.malz) { if (!(m.durum === 'bekle' || m.durum === 'geri' || (m.durum === 'cik' && m.t > 0.25))) continue; const d = Math.hypot(m.x - x, m.y - y); if (d < rr * Math.max(0.7, m.s) && d < ed) { ed = d; en = m; } }
  return en;
}
function kz8Tut(o, m, p) { m.durum = 'tut'; m.t = 0; m.hx = m.x - p.x; m.hy = m.y - p.y; KAZAN.tut = m; KAZAN.hx = m.x; KAZAN.hy = m.y; const [mx, my] = kz8Kagiz(o); KAZAN.tutUzak = Math.hypot(mx - m.x, my - m.y); kz8Sfx('parilti', 0.3); }
function kz8GirdiBirak() {
  const id = KAZAN.ptr; KAZAN.ptr = -1;
  const m = KAZAN.tut; if (m && m.durum === 'tut') { m.durum = 'geri'; m.t = 0; m.x1 = m.x; m.y1 = m.y; } KAZAN.tut = null;
  if (id >= 0 && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} }
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
}
addEventListener('pointerdown', e => {
  const o = KAZAN.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === KAZAN.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  kz8Sahip(e); if (KAZAN.ptr >= 0) return;
  const k = o.kz, p = kz8Dunya(e);
  KAZAN.ptr = e.pointerId; KAZAN.px = p.x; KAZAN.py = p.y; KAZAN.pt = k.t; KAZAN.yol = 0; KAZAN.tut = null;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  kz8Kullanici(o);
  if (k.faz !== 'oyun') return;
  const m = kz8MalzBul(o, p.x, p.y);
  if (m) { kz8Tut(o, m, p); return; }
  const [mx, my] = kz8Kagiz(o), [nx0, ny0] = kz8NineYer(o);
  if (Math.abs(p.x - mx) < 100 && p.y > my - 95 && p.y < o.y + 12) { const s = kz8Siradaki(o); if (s) kz8MalzUc(o, s, 'dokun'); k.wob = Math.max(k.wob, 0.45); kz8Sfx('kazanFokur', 0.5); return; }
  if (Math.abs(p.x - nx0) < 58 && p.y > ny0 - 190 && p.y < o.y + 10) { k.nine.elT = 1.8; k.nine.sevT = 0.7; const s = kz8Siradaki(o); if (s) kz8MalzUc(o, s, 'dokun'); return; }
  let en = null, ed = 240; for (const q of k.malz) if (q.durum === 'bekle') { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < ed) { ed = d; en = q; } }
  if (en && ed < 150 * Math.max(1, 0.6 * DPR / Math.max(S, 0.001))) { en.sal = 1; kz8MalzUc(o, en, 'dokun'); return; }   // baloncuğun yanına (ıska) dokunuş: o malzeme yine kazana uçar
  if (en) en.sal = 1;   // daha uzak boşluk: en yakın malzeme "buradayım" diye hoplar
}, true);
addEventListener('pointermove', e => {
  const o = KAZAN.aktif; if (!o || e.pointerId !== KAZAN.ptr) return; kz8Sahip(e);
  const p = kz8Dunya(e), dx = p.x - KAZAN.px, dy = p.y - KAZAN.py; KAZAN.px = p.x; KAZAN.py = p.y;
  const d = Math.hypot(dx, dy); if (d > 300) return;   // sıçrama (ekran döndü vb.)
  KAZAN.yol += d; o.kz.idle = 0;
  const m = KAZAN.tut;
  if (m && m.durum === 'tut') { KAZAN.hx = p.x + m.hx * 0.6; KAZAN.hy = p.y + m.hy * 0.6; }
  else if (!m && o.kz.faz === 'oyun') { const q = kz8MalzBul(o, p.x, p.y); if (q) kz8Tut(o, q, p); }   // parmak bir malzemenin üstünden geçerse onu da tutar
}, true);
function kz8BirakE(e) {
  const o = KAZAN.aktif; if (!o || e.pointerId !== KAZAN.ptr) return; kz8Sahip(e);
  const k = o.kz, m = KAZAN.tut;
  if (m && m.durum === 'tut') {
    // Çizim parmağı yumuşakça izler; hızlı bırakışın hedefi son parmak konumudur.
    const q = kz8Dunya(e), sonlu = Number.isFinite(q.x) && Number.isFinite(q.y);
    const x = sonlu ? q.x + m.hx * 0.6 : KAZAN.hx, y = sonlu ? q.y + m.hy * 0.6 : KAZAN.hy;
    if (sonlu) KAZAN.yol += Math.hypot(q.x - KAZAN.px, q.y - KAZAN.py);
    const [mx, my] = kz8Kagiz(o), d = Math.hypot(mx - x, my - y), kisa = KAZAN.yol < 18;   // kıpırdamadan basılı tutup bırakmak da dokunuş sayılır (5 yaş: uzun basar)
    if (kisa || d < KZ8_BIRAK || d < KAZAN.tutUzak * 0.65) kz8MalzUc(o, m, kisa ? 'dokun' : 'birak');
  }
  kz8GirdiBirak();
}
addEventListener('pointerup', kz8BirakE, true);
addEventListener('pointercancel', e => { if (e.pointerId !== KAZAN.ptr) return; kz8Sahip(e); kz8GirdiBirak(); }, true);
cv.addEventListener('lostpointercapture', e => { if (e.pointerId === KAZAN.ptr) kz8GirdiBirak(); });
addEventListener('blur', () => { if (KAZAN.ptr >= 0) kz8GirdiBirak(); });
addEventListener('pagehide', () => { if (KAZAN.ptr >= 0) kz8GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && KAZAN.ptr >= 0) kz8GirdiBirak(); });
addEventListener('keydown', e => {
  const o = KAZAN.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  kz8Sahip(e); kz8Kullanici(o);
  if (!e.repeat && o.kz.faz === 'oyun' && /^(Space|Enter|KeyE|ArrowRight|ArrowUp|KeyW|KeyD)$/.test(e.code)) { const s = kz8Siradaki(o); if (s) kz8MalzUc(o, s, 'tus'); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = KAZAN.aktif; if (o && d !== 'mola' && d !== 'duraklat') kz8Birak(o, false); kz8GirdiBirak(); });
OLAY.on('konusma', e => { const o = KAZAN.o; if (!o || !o.kz || !e) return; if (e.kim === 'nine' || /^cn_|nine/i.test(e.anahtar || '')) o.kz.nine.konT = Math.max(o.kz.nine.konT, +e.sure || 2); });   // Cadı Nine konuşurken ağzı oynar

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" kadrajı ezer; kazan etkinliğinde dikkat kadrajı geçerli olsun (kardan.js'teki sarmalayıcının
// aynısı; CORE oyun.js'e kazanMini istisnasını eklerse bu sarmalayıcı zararsızdır).
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.kz8Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'kazanMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.kz8Sarili = true; if (f.kdSarili) s.kdSarili = true;
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('kazanMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js "takim" bitiş bayrağını okur → miniKapi açılır
    o.kz = { aktif: false, faz: 'bekle', fT: 0, t: 0, n: 0, renk: 0, renkOnce: 0, renkU: 1, kopuk: 0, kopukT: 0, wob: 0, flas: 0, swA: 0, yakin: 0,
      malz: KZ8_MALZ.map((d, i) => ({ d, i, durum: 'gizli', t: 0, x: o.x + KZ8_KX, y: o.y + KZ8_IKS, x1: 0, y1: 0, s: 0.3, s1: 1, rot: 0, sure: 0.7, yay: 0, hx: 0, hy: 0, sal: 0 })),
      idle: 0, helpOn: false, helpT: 0, helpN: 0, tasinan: null, pufBek: -1, pt: 0, fzSev: 0, popT: 0.5, balT: 0.6, isT: 0.4, fokurT: 2, izT: 0,
      entry: { x: o.x - KZ8_AKTIF, y: o.y, safeX: o.x - KZ8_AKTIF, safeY: o.y, f: 1 }, pr: { x: o.x - 320, y: o.y - 130, f: 1, kirp: 0 },
      nine: { sev: 0, el: 0, alk: 0, kar: 1, mir: 1, kon: 0, bakX: 0.3, bakY: 0.2, egil: 0, kph: 0, sevT: 0, elT: 0, alkT: 0, konT: 0, kokT: 0, bakT: 0, notaT: 1, salBek: 2 },
      basladi: false, bitti: false, kameraFn: null, supN: null };
    o.kz.kameraFn = typeof omDkEkle === 'function' ? () => kz8Kamera(o) : null;
    o.adim = dt => kz8Adim(o, dt);
    KAZAN.o = o;
    // süpürgenin bekleyeceği yer: supurgeMini (sütun 646) nesnesinin üstü
    const sm = NESNELER.find(n => n.tip === 'supurgeMini');
    KZ8_SUP_YER.x = sm ? sm.x : o.x + 800; KZ8_SUP_YER.y = (sm ? sm.y : o.y) - 44;
    let sn = NESNELER.find(n => n.tip === 'kazanSupurge');
    if (!sn) { sn = { tip: 'kazanSupurge', id: 'kazanSupurge', x: KZ8_SUP_YER.x, y: KZ8_SUP_YER.y }; NESNELER.push(sn); }
    o.kz.supN = sn;
    try { kz8Hazirla(); } catch (e) {}
  },
  guncelle: kz8Guncelle, ciz: kz8Ciz, cizOn: kz8CizOn
});
