/* kanat.js — Bölüm 9 (Pırıl'ın Ejderha Vadisi) mini oyun 2: UÇMA DERSİ (önek kn9), nesne türü 'kanatMini'. Sahibi: KANAT.
   Şelale ormanından sonraki yemyeşil tepede, yosunlu bir tümseğin üstündeki yaprak yuvada Pırıl'ın minik kuzeni FISTIK (fıstık yeşili,
   tombul, kocaman gözlü yavru ejderha) oturur. Henüz uçamıyor: utangaç, kanatlarını sırtına katlayıp saklıyor, yanakları pembe.
   Feza tepeye gelince fizik devralınır (Bölüm 8 iskelet.js gibi: P.ucus = o; Feza'yı ve Pırıl'ı bu dosya çizer), kadraj yerleşir:
   1) Gösteri (~4 sn): Pırıl Fıstık'ın üstüne uçar, kocaman kanat çırpıp yükselir ve süzülerek iner (ışık tozu serper); Fıstık hayranlıkla
      bakar, kanatlarını azıcık açıp dener. Önünde sırayla BEŞ ÇİÇEK-BULUTÇUK belirir (alçaktan yükseğe, sağa doğru merdiven gibi).
   2) Uçuş: Feza ekrana HER DOKUNUŞTA Fıstık bir kez kanat çırpar ve biraz yükselir (AU.sfx 'kanatCirp'); bırakınca kanatlarını açıp
      yavaşça süzülerek iner (parmak basılıysa daha da yavaş), asla düşmez: yere ya da tümseğe tüy gibi konar, bekler. Havadayken kendi
      kendine sıradaki çiçeğe doğru süzülür; çiçek onu yumuşakça kendine çeker (cömert). Dokununca çiçek açılır: ışık patlaması, halka,
      havalanan ışık notası ve yükselen nota (AU.sfx 'kanatCicek', 0..4); Fıstık sevinçle kıkırdar. Sıradaki çiçek nabız gibi parlar,
      Fıstık'tan ona doğru minik ışık tozları akar (ipucu).
   3) Son (~8 sn): beşinci çiçekten sonra Fıstık kendi başına geniş bir yayla tepenin üstünde süzülür, sevinçten TAKLA atar
      (AU.sfx 'kanatTakla'), Feza'ya gelip burnuyla yanağına "dıt" diye dokunur (kalpçikler), yanına konup hoplar. V9.kanat = true,
      o.done = true, OLAY 'kanatBitti'. Sonra tepede mutlu kalır: arada bir kısa bir tur uçar, Feza'ya el (kanat) sallar.
   Kaybetme/süre/yazı/öğretici el yok. ~7 sn dokunulmazsa Pırıl sıradaki çiçeğin yanına uçup ışık serper (ipucu); ~20 sn (sonra ~10 sn)
   dokunulmazsa Pırıl Fıstık'ı kanadından tutar, birlikte çiçek çiçek uçarlar; çocuk dokununca Pırıl yavaşça bırakır. Asla takılmaz.
   Girdi pencere yakalama evresinde (yürüme parmağına sızmaz). Klavye yedeği: Boşluk/Enter/↑/W/E = kanat çırp.
   Olaylar: 'kanatBasla' {o} · 'kanatGoster' {o} (gösteri bitti, uçuş başlıyor) · 'kanatCirp' {o, n, yardim} (her kanat çırpış) ·
     'kanatCicek' {o, n (1..5), i (0..4), yardim} · 'kanatIpucu' {o, n} · 'kanatYardim' {o, n} · 'kanatSuzul' {o} (son başı) ·
     'kanatTakla' {o} · 'kanatBurun' {o} (Feza'ya burnuyla dokundu) · 'kanatBitti' {o}.
   Fıstık konuşurken (OLAY 'konusma' {anahtar: 'fs_…', sure}) ağzı oynar.
   Fıstık'ı YAVRU'nun ortak çizicisi yavruCiz(c, x, y, s, t, {renk: 'fistik', ...}) çizer (typeof kontrolü); yoksa bu dosyanın sade yedeği.
   Dışa açık: KANAT.o, KANAT.aktif (oyun sürerken nesne, yoksa null), KANAT.fistik() (Fıstık'ın dünyadaki yeri {x, y}; finalde yuva.js
   isterse kullanır).
   Yerleşim (bolum9.js): nesne('kanatMini', 402, yuzey(402), {x0, x1}); o.x-320 … o.x+330 DÜZ zemin; Feza o.x-300'ü geçince başlar;
   hemen ilerisinde miniKapi (bagId; o.done / V9.kanat / o.tk.bitti ile açılır). */
'use strict';
const KN9_GIRIS = 300;                       // Feza o.x - 300'de durur
const KN9_TX = -172, KN9_TW = 104, KN9_TH = 30;   // tümsek (Fıstık'ın yaprak yuvası): o.x'e göre orta, yarı genişlik, yükseklik
const KN9_CICEK = [[-66, -112], [28, -170], [118, -232], [202, -296], [280, -362]];   // çiçek-bulutçuklar (o.x, o.y'ye göre; alçaktan yükseğe)
const KN9_RENK = ['#ff9fc0', '#ffc29a', '#ffd27a', '#7fe0f0', '#b89cff'];               // gül, şeftali, altın, gök turkuazı, Pırıl leylağı
const KN9_OLC = 1.2, KN9_KOKX = 6 + 10 * (KN9_OLC - 1), KN9_KOKY = 27 + 40 * (KN9_OLC - 1);   // P9C: Pırıl'ın tuttuğu kanat kökü (Fıstık büyüyünce Pırıl başının arkasında kalmasın)
// KN9_OLC — P9C: 1 → 1.2 (mini oyunun yıldızı ekranda daha iyi seçilsin). Fıstık'ın genel ölçek çarpanı (1 iken ≈ 37 birim boy, gövde ortası yerden ≈ 18; Feza ≈ 80, Pırıl'dan biraz küçük)
const KN9_ITKI = 172, KN9_YERC = 270, KN9_SUZ = 40, KN9_SUZ_TUT = 21, KN9_TAVAN = -450;   // kanat itkisi, yerçekimi, süzülme hızı (bırakınca / basılıyken), tavan
const KN9_CIRP = 0.42;                       // bir kanat çırpışı (sn)
const KN9_IPUCU = 7, KN9_YARDIM = 20, KN9_YARDIM2 = 10;   // boşta bekleme eşikleri (sn)
const KN9_DOKUN = 42, KN9_CEK = 112;         // çiçeğe değme yarıçapı · çiçeğin yavruyu çekmeye başladığı uzaklık
const KN9_SON = 8.2;                         // son gösterinin süresi (sn)
// yedek Fıstık paleti (Pırıl ailesi: yumuşak kalın kontur, çizgili karın, yumuşak ibik, yüzgeç kulak, iki minik diş)
const KN9_YR = { govde: '#c8f08a', govdeA: '#e2ffb4', govdeK: '#a2d25e', kontur: '#3f6b2a', karin: '#fff1cf', karinC: '#f5d9a6',
  ibik: '#b89cff', ibikA: '#d9c8ff', kanat: '#d9c8ff', kanatK: '#a58ae6', goz: '#1f1a2e', yanak: 'rgba(255,135,175,', agiz: '#a8456e', dil: '#ff9fc0' };

// ── önbellek tuvalleri ──
function kn9Spr(w, h, ox, oy, fn, R) {
  R = R || 3; const cv2 = document.createElement('canvas'); cv2.width = Math.max(1, Math.ceil(w * R)); cv2.height = Math.max(1, Math.ceil(h * R));
  const q = cv2.getContext('2d'); q.scale(R, R); q.translate(ox, oy); q.lineCap = 'round'; q.lineJoin = 'round'; fn(q);
  return { c: cv2, w, h, ox, oy };
}
function kn9Bas(c, sp, x, y, k) { k = k || 1; c.drawImage(sp.c, x - sp.ox * k, y - sp.oy * k, sp.w * k, sp.h * k); }
function kn9Don(c, sp, x, y, a, k) { c.translate(x, y); c.rotate(a); c.drawImage(sp.c, -sp.ox * k, -sp.oy * k, sp.w * k, sp.h * k); c.rotate(-a); c.translate(-x, -y); }
function kn9Glow(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }
function kn9Elips(q, x, y, rx, ry, r) { q.beginPath(); q.ellipse(x, y, rx, ry, r || 0, 0, 6.2832); }
const KN9_S = { hazir: false, adim: 0, bulut: [], cicek: [], tomurcuk: [] };
// Önbellekler parça parça hazırlanır (tepe yaklaşırken karede bir parça; iPad'de tek karede takılma olmasın). Çizimde eksikse hepsi.
function kn9Hazirla() { while (!KN9_S.hazir) kn9HazirlaAdim(); }
function kn9HazirlaAdim() {
  const S1 = KN9_S, n = S1.adim++;
  if (n === 0) {
  // tümsek: yuvarlak, yosunlu, minik pul çiçekli; tepesinde yaprak döşeli yuva (çapa: tümseğin tabanı ortası)
  S1.tumsek = kn9Spr(KN9_TW * 2 + 40, KN9_TH + 46, KN9_TW + 20, KN9_TH + 30, q => {
    const w = KN9_TW, h = KN9_TH;
    const yol = (e) => { q.beginPath(); q.moveTo(-w - 14 - e, 6); q.bezierCurveTo(-w * 0.72, -h * 0.25 - e, -w * 0.5, -h - e, 0, -h - e); q.bezierCurveTo(w * 0.5, -h - e, w * 0.72, -h * 0.25 - e, w + 14 + e, 6); q.closePath(); };
    const gr = q.createLinearGradient(0, -h, 0, 8); gr.addColorStop(0, '#7fd89a'); gr.addColorStop(0.45, '#4fb985'); gr.addColorStop(1, '#2e8f6f');
    q.fillStyle = 'rgba(30,90,70,0.35)'; yol(2.2); q.fill();
    q.fillStyle = gr; yol(0); q.fill();
    // yosun ışığı (sol üstten sabah ışığı) ve yumuşak benekler
    q.save(); yol(0); q.clip();
    const gi = q.createRadialGradient(-w * 0.3, -h * 1.1, 4, -w * 0.3, -h * 0.9, w * 0.9); gi.addColorStop(0, 'rgba(230,255,190,0.55)'); gi.addColorStop(1, 'rgba(230,255,190,0)');
    q.fillStyle = gi; q.fillRect(-w - 20, -h - 10, w * 2 + 40, h + 20);
    q.fillStyle = 'rgba(200,240,138,0.35)'; for (const [x, y, r] of [[-62, -12, 9], [-30, -22, 7], [22, -24, 8], [58, -14, 10], [84, -4, 7], [-88, -2, 6], [4, -10, 6]]) { kn9Elips(q, x, y, r, r * 0.55); q.fill(); }
    q.restore();
    // çim tutamları
    q.strokeStyle = '#3fbf8a'; q.lineWidth = 1.6;
    for (let i = 0; i < 26; i++) { const u = i / 25, x = lerp(-w - 6, w + 6, u), y = -h * Math.pow(Math.sin(clamp((x + w + 14) / (2 * w + 28), 0, 1) * Math.PI), 0.9) + 1.5, l = 4 + (i * 7 % 5); q.beginPath(); q.moveTo(x, y + 1); q.quadraticCurveTo(x + (i % 2 ? 2 : -2), y - l * 0.6, x + (i % 2 ? 3.5 : -3), y - l); q.stroke(); }
    // minik çiçekler (ejderha pulu gibi parlak)
    for (const [x, y, col] of [[-74, -9, '#ff9fc0'], [-44, -21, '#ffd27a'], [46, -20, '#b89cff'], [76, -8, '#7fe0f0'], [-96, 1, '#ffc29a'], [96, 0, '#ff9fc0']]) {
      for (let i = 0; i < 5; i++) { const a = i / 5 * 6.2832; q.fillStyle = col; kn9Elips(q, x + Math.cos(a) * 2.1, y + Math.sin(a) * 2.1, 1.9, 1.9); q.fill(); }
      q.fillStyle = '#fff6c8'; kn9Elips(q, x, y, 1.2, 1.2); q.fill();
    }
    // yaprak yuva (tepede): dev kuş yuvası gibi, yumuşak, yaprak döşeli
    const ny = -h + 2;
    q.fillStyle = '#2e6b4f'; kn9Elips(q, 0, ny, 31, 9.5); q.fill();
    const yaprak = (x, y, a, l, col) => { q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = col; q.beginPath(); q.moveTo(0, 0); q.quadraticCurveTo(l * 0.5, -l * 0.32, l, 0); q.quadraticCurveTo(l * 0.5, l * 0.32, 0, 0); q.fill();
      q.strokeStyle = 'rgba(255,255,255,0.35)'; q.lineWidth = 0.7; q.beginPath(); q.moveTo(l * 0.1, 0); q.lineTo(l * 0.85, 0); q.stroke(); q.restore(); };
    for (let i = 0; i < 11; i++) { const u = i / 10, a = lerp(-2.6, -0.55, u); yaprak(Math.cos(a) * 24, ny + 3 + Math.sin(a) * 4, a + Math.PI * 0.08, 15, i % 3 === 0 ? '#6fd8a8' : i % 3 === 1 ? '#3fbf8a' : '#8ee0b0'); }
    q.fillStyle = '#5aa86e'; kn9Elips(q, 0, ny + 2, 28, 6.5); q.fill();
    for (let i = 0; i < 9; i++) { const u = i / 8, a = lerp(0.35, 2.8, u); yaprak(-Math.cos(a) * 30 * 0.2 + Math.cos(a) * 22, ny + 4 + Math.sin(a) * 3.5, Math.PI + a * 0.25 - 0.1 + (i % 2 ? 0.4 : -0.4) + (u < 0.5 ? 0 : Math.PI), 13, i % 2 ? '#7fd89a' : '#4fb985'); }
    q.fillStyle = 'rgba(255,255,220,0.35)'; kn9Elips(q, -8, ny - 4, 14, 2); q.fill();
  }, 2.5);
  S1.golge = kn9Spr(40, 10, 20, 5, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 20); gr.addColorStop(0, 'rgba(30,70,50,0.5)'); gr.addColorStop(0.6, 'rgba(30,70,50,0.2)'); gr.addColorStop(1, 'rgba(30,70,50,0)');
    q.fillStyle = gr; q.save(); q.scale(1, 0.25); q.beginPath(); q.arc(0, 0, 20, 0, 6.2832); q.fill(); q.restore();
  }, 2);
  } else if (n <= 5) {
  // çiçek-bulutçuklar: yumuşak bulut kümesi (alt yüzü kendi renginde) + üstünde açan pul çiçeği
    const i = n - 1, col = KN9_RENK[i];
    S1.bulut.push(kn9Spr(88, 46, 44, 24, q => {
      const top = [[-24, 4, 13], [-9, -3, 16], [9, -2, 15], [24, 5, 12], [0, 7, 15], [-30, 10, 8], [31, 11, 8]];
      q.fillStyle = mixc(col, '#6a4aa0', 0.25, 0.35); for (const [x, y, r] of top) { kn9Elips(q, x, y + 2.2, r + 1.4, r * 0.86 + 1.4); q.fill(); }
      for (const [x, y, r] of top) {
        const gr = q.createRadialGradient(x - r * 0.3, y - r * 0.55, r * 0.1, x, y + r * 0.2, r * 1.15);
        gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, mixc('#ffffff', col, 0.25)); gr.addColorStop(1, mixc('#ffffff', col, 0.7));
        q.fillStyle = gr; kn9Elips(q, x, y, r, r * 0.86); q.fill();
      }
      q.fillStyle = 'rgba(255,255,255,0.75)'; kn9Elips(q, -10, -10, 7, 2.6, -0.2); q.fill(); kn9Elips(q, 10, -9, 4, 1.6, 0.1); q.fill();
    }, 2.5));
    S1.cicek.push(kn9Spr(40, 40, 20, 20, q => {
      for (let j = 0; j < 6; j++) {   // pul gibi parlayan altı yaprak
        const a = j / 6 * 6.2832 - Math.PI / 2;
        q.save(); q.rotate(a);
        const gr = q.createLinearGradient(0, 0, 14, 0); gr.addColorStop(0, mixc(col, '#fff6c8', 0.5)); gr.addColorStop(0.6, col); gr.addColorStop(1, mixc(col, '#ffffff', 0.35));
        q.fillStyle = mixc(col, '#6a4aa0', 0.45); q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(5, -7.4, 13.5, -6.4, 15.2, 0); q.bezierCurveTo(13.5, 6.4, 5, 7.4, 0, 0); q.fill();
        q.fillStyle = gr; q.beginPath(); q.moveTo(0.6, 0); q.bezierCurveTo(5, -6, 12.6, -5.2, 14, 0); q.bezierCurveTo(12.6, 5.2, 5, 6, 0.6, 0); q.fill();
        q.fillStyle = 'rgba(255,255,255,0.6)'; kn9Elips(q, 8.5, -1.8, 3.4, 1.2, -0.15); q.fill();
        q.restore();
      }
      const gm = q.createRadialGradient(-1, -1, 0.5, 0, 0, 5.5); gm.addColorStop(0, '#fffbe6'); gm.addColorStop(0.6, '#ffd27a'); gm.addColorStop(1, '#f0a850');
      q.fillStyle = gm; kn9Elips(q, 0, 0, 5.2, 5.2); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.9)'; kn9Elips(q, -1.6, -1.8, 1.4, 1.1); q.fill();
    }, 3));
    S1.tomurcuk.push(kn9Spr(22, 26, 11, 20, q => {   // kapalı, uykulu tomurcuk (solgun renk)
      const pal = mixc(col, '#e8e4f0', 0.45);
      q.fillStyle = mixc(col, '#5a4a80', 0.5); q.beginPath(); q.moveTo(0, 2); q.bezierCurveTo(-9.5, -2, -7.5, -14, 0, -17.5); q.bezierCurveTo(7.5, -14, 9.5, -2, 0, 2); q.fill();
      q.fillStyle = pal; q.beginPath(); q.moveTo(0, 0.6); q.bezierCurveTo(-8, -2.5, -6.4, -13.4, 0, -16.2); q.bezierCurveTo(6.4, -13.4, 8, -2.5, 0, 0.6); q.fill();
      q.strokeStyle = mixc(col, '#5a4a80', 0.3, 0.6); q.lineWidth = 0.8; q.beginPath(); q.moveTo(0, -0.5); q.quadraticCurveTo(-2.6, -8, 0, -15.5); q.stroke(); q.beginPath(); q.moveTo(0, -0.5); q.quadraticCurveTo(3.2, -8, 0.6, -15.4); q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.55)'; kn9Elips(q, -2.8, -9, 1.4, 3.4, 0.2); q.fill();
      q.fillStyle = '#6fd8a8'; q.beginPath(); q.moveTo(0, 1.5); q.quadraticCurveTo(-7, 2, -8.5, -2.5); q.quadraticCurveTo(-3, -1.5, 0, 1.5); q.fill(); q.beginPath(); q.moveTo(0, 1.5); q.quadraticCurveTo(7, 2, 8.5, -2.5); q.quadraticCurveTo(3, -1.5, 0, 1.5); q.fill();
    }, 3));
  } else {
  // parıltı yıldızı (dört kollu), kalpçik, ışık notası
  S1.yildiz = kn9Spr(12, 12, 6, 6, q => { q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 1.2 : 5.6; q.lineTo(Math.cos(a) * r, Math.sin(a) * r); } q.closePath(); q.fill(); }, 3);
  S1.kalp = kn9Spr(16, 15, 8, 7, q => {
    const yol = q => { q.beginPath(); q.moveTo(0, 5.6); q.bezierCurveTo(-7.4, 0.6, -5.4, -6.2, 0, -2.6); q.bezierCurveTo(5.4, -6.2, 7.4, 0.6, 0, 5.6); };
    q.strokeStyle = '#b8467a'; q.lineWidth = 1.6; yol(q); q.stroke(); q.fillStyle = '#ff8fbf'; yol(q); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.8)'; kn9Elips(q, -2.6, -1.6, 1.4, 0.9, -0.5); q.fill();
  }, 3);
  S1.nota = [];
  for (const col of KN9_RENK) S1.nota.push(kn9Spr(22, 28, 9, 16, q => {
    const ciz = (renk, e) => {
      q.fillStyle = renk; q.strokeStyle = renk;
      q.beginPath(); q.ellipse(-1.6, 6, 4.6 + e, 3.5 + e, -0.4, 0, 6.2832); q.fill();
      q.lineWidth = 2.2 + e * 2; q.beginPath(); q.moveTo(2.4, 5); q.lineTo(2.4, -12); q.stroke();
      q.lineWidth = 1 + e * 2; q.beginPath(); q.moveTo(2.4, -12.6); q.quadraticCurveTo(10.2, -9.4, 8.8, -2); q.quadraticCurveTo(7, -6.2, 2.4, -6.8); q.closePath(); q.fill(); q.stroke();
    };
    ciz(mixc(col, '#4a3585', 0.45), 0.85); ciz(mixc(col, '#ffffff', 0.5), 0);
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(-3, 4.8, 1.5, 0.9, -0.4, 0, 6.2832); q.fill();
  }, 3));
  S1.hazir = true;
  }
}

// ── yedek Fıstık (YAVRU'nun yavruCiz'i yoksa): karede gradyan yok, yalnız düz dolgu + yarı saydam ışık; önce bütün gövde parçalarının
//    kalın konturu, sonra dolguları (tek parça yumuşak kontur). x,y taban ortası; sağa bakar (yon < 0 aynalar). ──
const KN9_KUY = []; for (let i = 0; i < 7; i++) KN9_KUY.push({ x: 0, y: 0 });
function kn9KanatYol(c, ac) {   // kanat zarı: kökten (0,0) yukarı-geriye açılan üç kıvrımlı minik ejderha kanadı (ac: 0 katlı .. 1 açık)
  const L = lerp(7, 21, ac), H = lerp(5, 15, ac);
  c.beginPath(); c.moveTo(0, 0);
  c.quadraticCurveTo(-L * 0.25, -H * 1.05, -L * 0.62, -H * 1.12);   // üst kemik
  c.quadraticCurveTo(-L * 0.9, -H * 1.1, -L, -H * 0.78);
  c.quadraticCurveTo(-L * 0.86, -H * 0.5, -L * 0.82, -H * 0.36);     // kıvrım 1
  c.quadraticCurveTo(-L * 0.7, -H * 0.3, -L * 0.58, -H * 0.06);       // kıvrım 2
  c.quadraticCurveTo(-L * 0.42, -H * 0.04, -L * 0.3, H * 0.16);       // kıvrım 3
  c.quadraticCurveTo(-L * 0.14, H * 0.1, 0, 0); c.closePath();
}
function kn9Kanat(c, rx, ry, aci, ac, on, alpha) {
  c.save(); c.translate(rx, ry); c.rotate(aci); c.globalAlpha *= alpha;
  c.strokeStyle = KN9_YR.kontur; c.lineWidth = 2.6; kn9KanatYol(c, ac); c.stroke();
  c.fillStyle = on ? KN9_YR.kanat : KN9_YR.kanatK; c.fill();
  if (ac > 0.3) {   // zar damarları
    const L = lerp(7, 21, ac), H = lerp(5, 15, ac);
    c.strokeStyle = on ? 'rgba(150,120,220,0.7)' : 'rgba(110,80,180,0.6)'; c.lineWidth = 0.9;
    c.beginPath(); c.moveTo(-1, -1); c.lineTo(-L * 0.82, -H * 0.4); c.moveTo(-1, -0.5); c.lineTo(-L * 0.58, -H * 0.1); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.45)'; kn9Elips(c, -L * 0.45, -H * 0.85, L * 0.18, H * 0.12, -0.25); c.fill();
  }
  c.restore();
}
function kn9Yedek(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, sq = clamp(+o.sq || 0, -0.3, 0.3), uta = clamp(+o.utangac || 0, 0, 1), mut = clamp(+o.mutlu || 0, 0, 1);
  const ucus = clamp(+o.ucus || 0, 0, 1), ac = clamp(o.kanatAc != null ? +o.kanatAc : 1, 0, 1), kan = clamp(+o.kanat || 0, 0, 1);
  const nef = Math.sin(t * 2.3 + (o.faz || 0)), K = KN9_YR;
  c.save(); c.translate(x, y); c.scale(s * yon * (1 + sq * 0.55), s * (1 - sq));
  // kuyruk (gövdenin arkası): kökten geriye, ucu yukarı kıvrılır; salınır
  const kuy = (+o.kuyruk || 0) + Math.sin(t * 3.1) * 0.22 * (1 - ucus * 0.4);
  let px = -8.5, py = -7.5, a = Math.PI - 0.15 + ucus * 0.35;
  for (let i = 0; i < 7; i++) { KN9_KUY[i].x = px; KN9_KUY[i].y = py; a += -0.33 - ucus * 0.08 + kuy * (0.3 + i * 0.1) + Math.sin(t * 3.1 - i * 0.7) * 0.06; px += Math.cos(a) * 3.6; py += Math.sin(a) * 3.6; }
  const kuyrukCiz = (renk, ek) => { c.strokeStyle = renk; for (let i = 0; i < 6; i++) { c.lineWidth = lerp(8.5, 3.2, i / 5) + ek; c.beginPath(); c.moveTo(KN9_KUY[i].x, KN9_KUY[i].y); c.lineTo(KN9_KUY[i + 1].x, KN9_KUY[i + 1].y); c.stroke(); } };
  c.lineCap = 'round'; c.lineJoin = 'round';
  kuyrukCiz(K.kontur, 2.6);
  const ux = KN9_KUY[6].x, uy = KN9_KUY[6].y, ua = a;   // kuyruk ucu: minik yaprak/kürek (ibik renginde)
  const uc = () => { c.save(); c.translate(ux, uy); c.rotate(ua); c.beginPath(); c.moveTo(-1, 0); c.quadraticCurveTo(3.4, -5, 7.4, 0); c.quadraticCurveTo(3.4, 5, -1, 0); c.restore(); };
  c.strokeStyle = K.kontur; c.lineWidth = 2.6; uc(); c.stroke(); c.fillStyle = K.ibik; uc(); c.fill();
  kuyrukCiz(K.govde, 0);
  // arka kanat
  const kAci0 = lerp(0.55, -0.35, ac), kAci = kAci0 + (ac > 0.2 ? lerp(-0.35, 0.75, kan) + Math.sin(t * 2.2) * 0.05 * (1 - kan) : 0);
  kn9Kanat(c, -2.5, -22.5, kAci - 0.16, ac * 0.9, false, 1);
  // baş konumu: nefes, utangaçlık (aşağı eğik, yana dönük)
  const hx = 3 + uta * -0.8, hy = -30.5 + nef * 0.45 + uta * 1.6, hr = -0.14 * uta + (+o.basEg || 0);
  // gövde + ayaklar + pati + baş: önce kontur
  const ayakY = -1.7 + ucus * 2.2, ayakA = ucus * 0.5;
  const pati = uta > 0.3 ? [9.5, -22 + (1 - uta) * 4] : [8.6, -14.5 - mut * 2 + Math.sin(t * 2.3) * 0.3];
  const govdeYol = (e) => {
    kn9Elips(c, 0, -13.2 + nef * 0.25, 12.4 + e, 12.6 + e); c.fill();
    kn9Elips(c, -5.2, ayakY, 4.4 + e, 2.7 + e, -ayakA); c.fill(); kn9Elips(c, 5.4, ayakY + ucus * 0.8, 4.4 + e, 2.7 + e, ayakA * 0.6); c.fill();
    kn9Elips(c, pati[0], pati[1], 3 + e, 2.6 + e); c.fill();
  };
  const basYol = (e) => {
    c.save(); c.translate(hx, hy); c.rotate(hr);
    kn9Elips(c, 0, 0, 13.2 + e, 11.6 + e); c.fill();
    kn9Elips(c, 8.4, 2.8, 6.4 + e, 5 + e, 0.1); c.fill();   // burun
    c.restore();
  };
  const kulakYol = (e) => {   // yüzgeç kulak (başın arkasında)
    c.save(); c.translate(hx, hy); c.rotate(hr);
    c.beginPath(); c.moveTo(-8, -3.5); c.quadraticCurveTo(-17 - e, -9 - e, -16.5 - e, -1.2); c.quadraticCurveTo(-14 - e, 1.6 + e, -8.5, 1.8); c.closePath(); c.fill();
    c.restore();
  };
  const ibikYol = (e) => {   // üç dilimli yumuşak ibik
    c.save(); c.translate(hx, hy); c.rotate(hr);
    for (const [ix, iy, r] of [[-5.5, -10, 3.2], [-0.6, -11.8, 3.8], [4.6, -10.8, 3.2]]) { kn9Elips(c, ix, iy, r + e, r * 1.1 + e); c.fill(); }
    c.restore();
  };
  c.fillStyle = K.kontur; govdeYol(1.5); kulakYol(1.5); ibikYol(1.5); basYol(1.5);
  c.fillStyle = K.ibikA; kulakYol(0);
  c.fillStyle = K.ibik; ibikYol(0);
  c.fillStyle = K.govde; govdeYol(0);
  // gövde ışığı + çizgili karın
  c.fillStyle = 'rgba(255,255,230,0.42)'; kn9Elips(c, -4.5, -19, 5.2, 3.4, -0.5); c.fill();
  c.fillStyle = K.karin; kn9Elips(c, 3.2, -11.6 + nef * 0.25, 7.6, 9.2, -0.08); c.fill();
  c.strokeStyle = K.karinC; c.lineWidth = 1.3;
  for (const yy of [-16, -12, -8]) { c.beginPath(); c.moveTo(-2.2, yy + nef * 0.25); c.quadraticCurveTo(3.2, yy + 1.6 + nef * 0.25, 9.6, yy - 0.2 + nef * 0.25); c.stroke(); }
  c.fillStyle = K.govdeK; kn9Elips(c, -5.2, ayakY + 0.8, 3, 1, -ayakA); c.fill();
  c.fillStyle = K.govdeA; kn9Elips(c, pati[0] - 0.6, pati[1] - 0.8, 1.6, 1.1); c.fill();
  // baş
  c.save(); c.translate(hx, hy); c.rotate(hr);
  c.fillStyle = K.govde; kn9Elips(c, 0, 0, 13.2, 11.6); c.fill();
  c.fillStyle = K.govdeA; kn9Elips(c, 8.4, 2.8, 6.4, 5, 0.1); c.fill();
  c.fillStyle = 'rgba(255,255,235,0.55)'; kn9Elips(c, -4.6, -6, 5.4, 2.8, -0.35); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; kn9Elips(c, -6.4, -6.8, 1.8, 1, -0.4); c.fill();
  // burun delikleri
  c.fillStyle = K.kontur; kn9Elips(c, 11.6, 1.4, 0.75, 0.6); c.fill(); kn9Elips(c, 13.6, 2.2, 0.6, 0.5); c.fill();
  // yanaklar (utangaçken ve sevinçte daha pembe)
  const ya = 0.38 + uta * 0.35 + mut * 0.15;
  c.fillStyle = K.yanak + (ya * 0.55).toFixed(3) + ')'; kn9Elips(c, -3.6, 4.4, 4.2, 2.6); c.fill(); kn9Elips(c, 10.4, 6.6, 2.8, 1.8); c.fill();
  c.fillStyle = K.yanak + (ya * 0.8).toFixed(3) + ')'; kn9Elips(c, -3.6, 4.4, 2.4, 1.4); c.fill();
  // gözler: kocaman, parlak; kırpma, sevinçte kavis
  const kirp = ((t + (o.faz || 0) * 0.7) % 3.6) < 0.12, kapali = mut > 0.55 || o.uyku;
  const bx = clamp(+o.bakX || 0, -1, 1) * 1.3 - uta * 0.9, by = clamp(+o.bakY || 0, -1, 1) * 1.1 + uta * 0.9;
  const sas = clamp(+o.sasir || 0, 0, 1), gb = 1 + sas * 0.14;
  for (const [ex, ey, rx, ry] of [[0.6, -1.6, 3.5, 4.3], [7.6, -1.9, 2.9, 3.7]]) {
    if (kapali || kirp) {
      c.strokeStyle = K.goz; c.lineWidth = 1.6; c.beginPath();
      if (kapali) c.arc(ex, ey + 1.2, rx * 0.85, Math.PI * 1.12, Math.PI * 1.88); else { c.moveTo(ex - rx, ey + 0.5); c.quadraticCurveTo(ex, ey + 2.2, ex + rx, ey + 0.5); }
      c.stroke(); continue;
    }
    c.fillStyle = K.goz; kn9Elips(c, ex, ey, rx * gb, ry * gb); c.fill();
    c.fillStyle = 'rgba(120,200,110,0.55)'; kn9Elips(c, ex + bx * 0.5, ey + by * 0.5 + ry * 0.35, rx * 0.62, ry * 0.42); c.fill();
    c.fillStyle = '#ffffff'; kn9Elips(c, ex - rx * 0.32 + bx * 0.6, ey - ry * 0.4 + by * 0.5, rx * 0.42, ry * 0.36); c.fill();
    kn9Elips(c, ex + rx * 0.4 + bx * 0.6, ey + ry * 0.35 + by * 0.5, rx * 0.18, rx * 0.18); c.fill();
  }
  // ağız: kapalıyken minik gülümseme; açıkken yuvarlak (konuşma, şaşırma, sevinç) + iki minik diş
  const ag = clamp(+o.agiz || 0, 0, 1);
  if (ag > 0.12 || sas > 0.4) {
    const ar = Math.max(ag, sas * 0.7);
    c.fillStyle = K.agiz; kn9Elips(c, 8.6, 6.4, 2.4 + ar * 1.2, 1 + ar * 2.4); c.fill();
    c.fillStyle = K.dil; kn9Elips(c, 8.8, 7.2 + ar * 1.3, 1.6 + ar * 0.7, 0.6 + ar * 0.9); c.fill();
    if (mut > 0.3) { c.fillStyle = '#ffffff'; c.fillRect(7.2, 5.4 - ar * 1.1, 1.1, 1.3); c.fillRect(9, 5.4 - ar * 1.1, 1.1, 1.3); }
  } else {
    c.strokeStyle = K.kontur; c.lineWidth = 1.2; c.beginPath(); c.moveTo(5.6, 5.4); c.quadraticCurveTo(8.6, 7.6 + mut * 1.2, 12.2, 5.2); c.stroke();
  }
  c.restore();
  // ön kanat (gövdenin önünde, katlıyken sırtta minicik)
  kn9Kanat(c, -0.5, -21.5, kAci, ac, true, 1);
  c.restore();
}

// ── Fıstık'ı çiz: yavruCiz (YAVRU) varsa onu, yoksa yedeği. rot: gövde ortası etrafında "burun yukarı" dönüşü (takla: 0 → 2π). ──
const KN9_YO = { renk: 'fistik', yon: 1, mutlu: 0, kanat: 0, kanatAc: 0, ucus: 0, ziplama: 0, kabuk: 0, agiz: 0, dans: 0, uyku: 0, utangac: 0,
  bakX: 0, bak: 0, bakY: 0, sasir: 0, kuyruk: 0, sq: 0, faz: 0, basEg: 0, kanatF: 0 };
const KN9_YS = 1.03, KN9_YS0 = 0.85;   // ölçek: yavruCiz (s = 1'de ≈ 36 boy) · yedek (s = 1'de ≈ 44 boy) → ikisi de ≈ 37 boy
let kn9YvHata = 0, kn9KF = null;
function kn9KanatF() { if (kn9KF === null) { try { kn9KF = typeof YV9_VO === 'object' && !!YV9_VO && 'kanatF' in YV9_VO; } catch (e) { kn9KF = false; } } return kn9KF; }   // yavruCiz kanat fazını destekliyor mu
function kn9FistikCiz(c, fs, t) {
  const o = KN9_YO, yv = typeof yavruCiz === 'function' && kn9YvHata < 30, s = (yv ? KN9_YS : KN9_YS0) * KN9_OLC * (fs.olc || 1);
  o.yon = fs.yon; o.mutlu = fs.mutlu; o.kanatAc = fs.ac; o.ziplama = fs.zipT > 0 ? 0.5 : 0; o.agiz = fs.agiz; o.dans = fs.dans;
  o.utangac = fs.uta; o.bakX = o.bak = fs.bakX; o.bakY = fs.bakY; o.sasir = fs.sas; o.kuyruk = fs.kuy; o.sq = fs.sq; o.basEg = fs.basEg || 0;
  if (yv && kn9KanatF()) { o.ucus = fs.havada ? 1 : 0; o.kanatF = fs.kf; o.kanat = fs.havada ? 0.35 + fs.kan * 0.65 : fs.kan; }   // her dokunuşa tek çırpış
  else if (yv) { o.ucus = 0; o.kanat = fs.kan; }   // (kanatF yoksa: ucus'un sürekli çırpması yerine çırpış zarfı)
  else { o.ucus = fs.ucus; o.kanat = fs.kan; }
  const rot = fs.rot || 0, cx = fs.x, cy = fs.y - 18;
  if (rot) { c.save(); c.translate(cx, cy); c.rotate(-rot * (fs.yon < 0 ? -1 : 1)); c.translate(-cx, -cy); }   // rot: "burun yukarı" eğimi
  let ok = false;
  if (yv) { try { yavruCiz(c, fs.x, fs.y, s, t, o); ok = true; } catch (e) { if (++kn9YvHata === 1) console.warn('[kanat] yavruCiz', e); } }
  if (!ok) kn9Yedek(c, fs.x, fs.y, s, t, o);
  if (rot) c.restore();
}

// ── parçacıklar (sabit havuz): ışık tozu, yıldız, kalpçik, kanat püfü · ışık notaları · ışık halkaları ──
const KN9_TZ = []; for (let i = 0; i < 130; i++) KN9_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#ffffff', ph: 0 });
const KN9_NT = []; for (let i = 0; i < 12; i++) KN9_NT.push({ a: false, x: 0, y: 0, vx: 0, t: 0, max: 1, i: 0, s: 1, ph: 0 });
const KN9_HL = []; for (let i = 0; i < 8; i++) KN9_HL.push({ a: false, x: 0, y: 0, t: 0, max: 1, r0: 0, r1: 0, col: '#ffffff', w: 3 });
function kn9Toz(tip, x, y, vx, vy, max, s, col) {   // tip: 0 ışık tozu · 1 yıldız · 2 kalpçik · 3 kanat püfü
  for (const p of KN9_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.ph = Math.random() * 6.28; return p; }
  return null;
}
function kn9Kivilcim(x, y, n, col, hiz, yildizOran) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = (hiz || 90) * (0.35 + Math.random() * 0.75); kn9Toz(Math.random() < (yildizOran == null ? 0.33 : yildizOran) ? 1 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.6 + Math.random() * 0.6, 3 + Math.random() * 4, i % 2 ? col : '#ffffff'); }
}
function kn9Kalpler(x, y, n) { for (let i = 0; i < n; i++) kn9Toz(2, x + (Math.random() - 0.5) * 22, y - Math.random() * 8, (Math.random() - 0.5) * 50, -40 - Math.random() * 40, 1.4 + Math.random() * 0.5, 0.8 + Math.random() * 0.35, '#ff8fbf'); }
function kn9Nota(x, y, i, s) { for (const p of KN9_NT) if (!p.a) { p.a = true; p.x = x; p.y = y; p.vx = (Math.random() - 0.5) * 30; p.t = 0; p.max = 1.8 + Math.random() * 0.4; p.i = i; p.s = s || 1; p.ph = Math.random() * 6.28; return; } }
function kn9Halka(x, y, r0, r1, max, col, w) { for (const p of KN9_HL) if (!p.a) { p.a = true; p.x = x; p.y = y; p.r0 = r0; p.r1 = r1; p.t = 0; p.max = max; p.col = col; p.w = w || 3; return; } }
function kn9ParcaAdim(dt) {
  for (const p of KN9_TZ) {
    if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 2) { p.vx *= Math.exp(-dt * 1.5); p.vy = p.vy * Math.exp(-dt * 1.2) - 12 * dt; p.x += (p.vx + Math.sin(p.t * 4 + p.ph) * 14) * dt; p.y += p.vy * dt; continue; }   // kalpçik: yükselir, salınır
    if (p.tip === 3) { p.vx *= Math.exp(-dt * 3); p.vy *= Math.exp(-dt * 3.2); p.x += p.vx * dt; p.y += p.vy * dt; continue; }   // kanat püfü: yavaşlar, söner
    p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) - 10 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (const p of KN9_NT) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; } p.y -= (46 + 22 * (1 - p.t / p.max)) * dt; p.x += (p.vx + Math.sin(p.t * 3.2 + p.ph) * 20) * dt; p.vx *= Math.exp(-dt * 2); }
  for (const p of KN9_HL) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) p.a = false; }
}
function kn9ParcaCiz() {
  const S1 = KN9_S;
  for (const p of KN9_HL) {   // ışık halkaları (yumuşak, genişleyerek söner)
    if (!p.a) continue; const u = p.t / p.max, r = lerp(p.r0, p.r1, 1 - (1 - u) * (1 - u)), al = (1 - u) * (1 - u);
    g.globalAlpha = al * 0.75; g.strokeStyle = p.col; g.lineWidth = p.w * (1 - u * 0.6); g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.stroke();
    g.globalAlpha = al * 0.5; g.strokeStyle = '#ffffff'; g.lineWidth = p.w * 0.35; g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.stroke();
  }
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'lighter';
  for (const p of KN9_TZ) {
    if (!p.a || p.tip === 2) continue; const f = 1 - p.t / p.max;
    if (p.tip === 3) { kn9Glow(g, p.col, p.x, p.y, p.s * (1.6 - f * 0.6), f * 0.45); continue; }
    kn9Glow(g, p.col, p.x, p.y, p.s * (1 + f), f * 0.9);
    if (p.tip === 1) { g.globalAlpha = f; const r = p.s * (0.7 + 0.25 * Math.sin(p.t * 9 + p.ph)); g.drawImage(S1.yildiz.c, p.x - r, p.y - r, r * 2, r * 2); g.globalAlpha = 1; }
  }
  for (const p of KN9_NT) { if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u); kn9Glow(g, KN9_RENK[p.i], p.x, p.y, 24 * p.s, al * 0.6); }
  g.globalCompositeOperation = 'source-over';
  for (const p of KN9_TZ) {
    if (!p.a || p.tip !== 2) continue; const u = p.t / p.max, al = Math.min(1, u * 8) * (1 - u * u), sc = p.s * (0.6 + 0.4 * Math.min(1, u * 5));
    g.globalAlpha = al; kn9Don(g, S1.kalp, p.x, p.y, Math.sin(p.t * 3 + p.ph) * 0.25, sc); g.globalAlpha = 1;
  }
  for (const p of KN9_NT) {
    if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u), sc = p.s * (0.7 + 0.3 * Math.min(1, u * 4));
    g.globalAlpha = al; kn9Don(g, S1.nota[p.i], p.x, p.y, Math.sin(p.t * 2.5 + p.ph) * 0.25, sc); g.globalAlpha = 1;
  }
}

// ══════════════════════ mini oyun ══════════════════════
const KANAT = {
  o: null,
  get aktif() { const o = this.o; return o && o.kn && o.kn.aktif && !o.done ? o : null; },
  fistik() { const o = this.o; return o && o.kn ? { x: o.kn.fs.x, y: o.kn.fs.y } : null; }
};
const KN9_PARMAK = new Set();   // etkinlikte basılı parmaklar (basılı tutmak süzülmeyi yavaşlatır)
function kn9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function kn9Kx(o) { return o.x + KN9_TX; }
function kn9Zemin(o, x) {   // Fıstık'ın bastığı yer: düz tepe, tümsekte yosun, ortada yaprak yuva
  const kx = kn9Kx(o), d = Math.abs(x - kx);
  if (d < 26) return o.y - KN9_TH + 4;
  const W2 = KN9_TW + 14; if (d >= W2) return o.y;
  return o.y - (KN9_TH - 4) * Math.pow(Math.cos(d / W2 * Math.PI / 2), 1.5);
}
function kn9Faz(o, f) {
  const k = o.kn; k.faz = f; k.fT = 0;
  if (f === 'uc') { k.idle = 0; k.ilerT = 0; for (const c of k.cicek) c.apH = 1; OLAY.emit('kanatGoster', { o }); }
  else if (f === 'son') {
    const fs = k.fs;
    k.son = { p0x: fs.x, p0y: fs.y, cx: o.x - 40, cy: o.y - 330, r: 50, burun: false, takla: false, indi: false, cirp: 0, bx: 0, by: 0, lx: 0, ly: 0 };
    k.helpOn = false; k.tutuyor = false;
    for (const c of k.cicek) c.apH = 1;
    OLAY.emit('kanatSuzul', { o });
  }
}
function kn9Aktiflestir(o) {
  const k = o.kn; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x0 = P.x; e.x = Math.min(P.x, o.x - KN9_GIRIS); e.y = o.y; e.f = P.f;
  k.aktif = true; k.idle = 0; k.helpOn = false; k.helpT = 0; k.tutuyor = false; k.fzx = P.x; KANAT.o = o; KN9_PARMAK.clear(); k.tus = false; kn9GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  const fs = k.fs;
  if (!fs.havada) { fs.x = kn9Kx(o); fs.y = kn9Zemin(o, fs.x); }
  if (k.sira >= 5) kn9Faz(o, 'son');                 // (yarıda kalmış son: baştan oynat)
  else { k.gelSonra = k.gosterildi ? 'uc' : 'goster'; kn9Faz(o, 'gel'); }
  if (!k.basladi) { k.basladi = true; OLAY.emit('kanatBasla', { o }); }
  return true;
}
function kn9Birak(o, tamam) {   // güvenli dönüş: Feza tepenin solunda, sağa bakarak bırakılır
  const k = o.kn, e = k.entry; if (!k.aktif) return;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = k.fzx; P.y = P.ry = e.y; P.safeX = k.fzx; P.safeY = e.y; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; k.tutuyor = false; KN9_PARMAK.clear(); k.tus = false; kn9GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kanat', 0.1, k.kameraFn, 1, 0.5);
  const fs = k.fs;
  if (tamam && !o.done) {
    o.done = true; k.faz = 'bitti'; o.tk.bitti = true;
    if (typeof V9 !== 'undefined' && V9) V9.kanat = true;
    fs.havada = false; fs.vx = fs.vy = 0; fs.rot = 0; fs.dans = 0;
    k.ser = { durum: 'otur', t: 2.2, x0: 0, y0: 0, x1: 0, y1: 0, h: 0, sure: 1, u: 0, takla: false, n: 0, cirp: 0 };
    OLAY.emit('kanatBitti', { o });
  } else if (!tamam && !o.done) {
    k.faz = 'bekle';
    fs.havada = false; fs.vx = fs.vy = 0; fs.x = kn9Kx(o); fs.y = kn9Zemin(o, fs.x); fs.rot = 0; fs.dans = 0;   // Fıstık yuvasına döner
  }
}
function kn9GirdiBirak() { KN9_PARMAK.clear(); const o = KANAT.o; if (o && o.kn) o.kn.tus = false; if (typeof omHepsiniBirak === 'function') { try { omHepsiniBirak(); } catch (e) {} } }

// kanat çırpışı (çocuğun dokunuşu ya da Pırıl'ın yardımı)
function kn9Cirp(o, yardim) {
  const k = o.kn, fs = k.fs;
  if (!yardim) { k.idle = 0; if (k.helpOn && !k.helpZor) kn9YardimBirak(o); }   // (zorlanınca gelen yardımda Pırıl çiçeğe kadar tutar)
  if (k.faz === 'gel') return;
  if (k.faz === 'goster') { if (k.fT < 0.6) return; k.gosterildi = true; kn9Faz(o, 'uc'); }   // çocuk erken dokundu: gösteriyi bekletme
  if (k.faz !== 'uc') {   // son gösteride dokunuş: minik parıltı (gösteriyi bozmaz)
    if (k.faz === 'son') kn9Kivilcim(fs.x, fs.y - 22, 4, '#d9c8ff', 60);
    return;
  }
  const ilk = !fs.havada && fs.cirpN === 0;
  fs.cirpT = 0; fs.cirpN++; k.cirpN++;
  // cömert: yavru sıradaki çiçeğin epey ÜSTÜNDEYSE çırpış yalnız minik bir kıpırtı (çiçeği aşıp gitmesin, süzülüp ona konsun)
  const h = k.cicek[Math.min(k.sira, 4)], ustte = fs.y - 18 < h.y - 30 && Math.abs(h.x - fs.x) < 150;
  fs.vy = Math.min(fs.vy, 0) * 0.35 - KN9_ITKI * (fs.y < o.y + KN9_TAVAN + 40 ? 0.4 : ustte ? 0.3 : 1 + 0.8 * kn9Zor(k)); if (fs.vy < -330) fs.vy = -330;
  if (!fs.havada) { fs.havada = true; fs.sq = 0.16; fs.sqv = -3.4; fs.zipT = 0.35; }
  else fs.sqv -= 1.7;   // kanat vuruşunda gövde hafifçe uzar (sonra yaylanır)
  fs.utaH = 0; fs.acH = 1;
  if (ilk) fs.sasT = 1.1;
  // kanatların altından süzülen yumuşak ışık püfleri
  for (let i = 0; i < 3; i++) kn9Toz(3, fs.x - 6 + (Math.random() - 0.5) * 14, fs.y - 12, (Math.random() - 0.5) * 50, 50 + Math.random() * 40, 0.55 + Math.random() * 0.25, 9 + Math.random() * 5, i % 2 ? '#d9c8ff' : '#e8ffd0');
  if (Math.random() < 0.6) kn9Toz(1, fs.x - 10, fs.y - 24, (Math.random() - 0.5) * 40, 20, 0.7, 3.5, '#ffffff');
  kn9Sfx('kanatCirp', clamp((o.y - fs.y) / 380, 0, 1));
  OLAY.emit('kanatCirp', { o, n: k.cirpN, yardim: !!yardim });
}
function kn9YardimBirak(o) { const k = o.kn; k.helpOn = false; k.helpT = 0; k.tutuyor = false; k.helpZor = false; }
// zorlanma: sıradaki çiçeğe uzun süredir ulaşılamadıysa (ör. çok seyrek dokunuş) kanatlar yavaş yavaş güçlenir, süzülüş yavaşlar (0..1)
function kn9Zor(k) { return clamp((k.ilerT - 6) / 8, 0, 1); }
function kn9CicekDokun(o, i, yardim) {
  const k = o.kn, c = k.cicek[i], fs = k.fs; if (c.dokundu) return;
  c.dokundu = true; c.dT = 0; c.pop = 0.35; c.popV = 9; k.sira = i + 1;
  kn9Sfx('kanatCicek', i);
  kn9Kivilcim(c.x, c.y, 16, KN9_RENK[i], 150, 0.4); kn9Kivilcim(c.x, c.y, 6, '#ffffff', 80, 0.8);
  kn9Halka(c.x, c.y, 10, 78, 0.9, KN9_RENK[i], 4); kn9Halka(c.x, c.y, 4, 46, 0.6, '#ffffff', 2.5);
  kn9Nota(c.x + 6, c.y - 20, i, 1.1);
  for (let j = 0; j < 5; j++) { const a = j / 5 * 6.2832 + Math.random() * 0.5; kn9Toz(0, c.x, c.y + 6, Math.cos(a) * 45, 30 + Math.sin(a) * 20, 1.6 + Math.random() * 0.6, 4, KN9_RENK[i]); }   // aşağı süzülen ışık tozu
  fs.mutluT = 1.3; fs.vy = Math.min(fs.vy, 0) - 35; fs.sqv -= 1.2; k.fzSev = 1.1; k.ilerT = 0;
  if (k.helpZor) kn9YardimBirak(o);   // zorlanma yardımı: çiçeğe varınca Pırıl bırakır, çocuk yine kendisi uçurur
  OLAY.emit('kanatCicek', { o, n: i + 1, i, yardim: !!yardim });
  if (k.sira >= 5) kn9Faz(o, 'son');
}
// etkinlik yokken Fıstık'a dokunuş: önce utangaç (kızarıp kanatlarına saklanır), bitince sevinçle havalanıp tur atar
function kn9Selam(o) {
  const k = o.kn, fs = k.fs;
  if (o.done) { if (k.ser && k.ser.durum === 'otur') k.ser.t = 0; fs.mutluT = 1; kn9Kalpler(fs.x, fs.y - 40, 2); kn9Sfx('yavruCik2'); return; }
  fs.kizarT = 1.6; fs.sqv += 1.4; kn9Kivilcim(fs.x, fs.y - 34, 4, '#ffc0d8', 50); kn9Sfx('yavruCik2', 0.4);
}

// ── her kare ──
function kn9Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza tepenin solunda durur
  const k = o.kn; if (!k.aktif || P.ucus !== o) return;
  P.x = k.fzx; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function kn9FsAnim(o, fs, dt, t) {
  fs.cirpT += dt;
  const u = fs.cirpT / KN9_CIRP;   // kanat zarfı: hızlı aşağı vuruş, yavaş geri dönüş
  fs.kan = u < 1 ? (u < 0.32 ? smooth(u / 0.32) : 1 - smooth((u - 0.32) / 0.68)) : 0;
  // kanat fazı (yavruCiz kanatF; sin = +1 vuruşun altı, −1 üstü): kısa kalkış → hızlı aşağı vuruş → süzülme açısına yumuşak dönüş
  const kg = -0.3 + Math.sin(t * 2.2) * 0.12;
  fs.kf = u >= 1 ? kg : u < 0.14 ? lerp(kg, -1.5708, smooth(u / 0.14)) : u < 0.44 ? lerp(-1.5708, 1.5708, smooth((u - 0.14) / 0.3)) : lerp(1.5708, kg, smooth((u - 0.44) / 0.56));
  fs.ac += (fs.acH - fs.ac) * (1 - Math.exp(-dt * 6));
  fs.kizarT = Math.max(0, (fs.kizarT || 0) - dt);
  const utaH = Math.max(fs.utaH, fs.kizarT > 0 ? 1 : 0);
  fs.uta += (utaH - fs.uta) * (1 - Math.exp(-dt * (fs.kizarT > 0 ? 9 : 3)));
  fs.mutluT = Math.max(0, fs.mutluT - dt); fs.sasT = Math.max(0, fs.sasT - dt); fs.zipT = Math.max(0, fs.zipT - dt); fs.konus = Math.max(0, fs.konus - dt);
  const mH = Math.max(fs.mutluT > 0 ? 1 : 0, fs.mutluB);
  fs.mutlu += (mH - fs.mutlu) * (1 - Math.exp(-dt * 6));
  fs.sas = fs.sasT > 0 ? Math.min(1, fs.sasT * 2.5) : Math.max(0, fs.sas - dt * 4);
  if (dt > 0) { fs.sqv += (-fs.sq * 160 - fs.sqv * 12) * dt; fs.sq = clamp(fs.sq + fs.sqv * dt, -0.3, 0.3); }   // yumuşak yay: ezilme-gerilme
  const agH = fs.konus > 0 ? 0.25 + 0.55 * Math.abs(Math.sin(t * 13)) : fs.sas > 0.3 ? 0.55 : fs.mutlu > 0.6 && fs.havada ? 0.42 : 0;
  fs.agiz += (agH - fs.agiz) * (1 - Math.exp(-dt * 14));
  fs.ucus += ((fs.havada ? 1 : 0) - fs.ucus) * (1 - Math.exp(-dt * 6));
  const kuyH = fs.havada ? clamp(fs.vy * 0.004, -0.3, 0.3) + fs.kan * 0.18 : 0;   // süzülürken kuyruk dümen gibi, çırpışta sallanır
  fs.kuy += (kuyH - fs.kuy) * (1 - Math.exp(-dt * 5));
  fs.bakX += (fs.bakXH - fs.bakX) * (1 - Math.exp(-dt * 6)); fs.bakY += (fs.bakYH - fs.bakY) * (1 - Math.exp(-dt * 6));
  if (!Number.isFinite(fs.x) || !Number.isFinite(fs.y)) { fs.x = kn9Kx(o); fs.y = kn9Zemin(o, fs.x); fs.vx = fs.vy = 0; fs.havada = false; }
}
function kn9Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.kn, fs = k.fs;
  if (k.aktif && DURUM !== 'oyun') return;
  k.t += dt; kn9ParcaAdim(dt);
  if (!KN9_S.hazir && Math.abs(P.x - o.x) < 2600) kn9HazirlaAdim();
  k.fzSev = Math.max(0, k.fzSev - dt);
  for (const c of k.cicek) {   // belirme, açılma yayı
    c.ap += (c.apH - c.ap) * (1 - Math.exp(-dt * 3));
    if (c.dokundu) { c.dT += dt; c.popV += (-(c.pop - 1) * 110 - c.popV * 9) * dt; c.pop += c.popV * dt; c.lit = Math.min(1, c.lit + dt * 3); }
  }
  kn9FsAnim(o, fs, dt, k.t);
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - KN9_GIRIS - 8 && P.x < o.x + 600 && Math.abs(P.y - o.y) < 120) kn9Aktiflestir(o);
  if (!k.aktif) { if (o.done) kn9SerbestAdim(o, dt); else kn9BekleAdim(o, dt); return; }
  if (typeof omDikkat === 'function') omDikkat('kanat', 1.5, k.kameraFn, 1, 0.5);
  k.fT += dt;
  if (k.faz === 'gel') {
    k.fzx = lerp(k.entry.x0, k.entry.x, smooth(clamp(k.fT / 0.7, 0, 1)));
    fs.utaH = 1; fs.acH = 0; fs.yon = -1; fs.bakXH = (k.t % 2.4) < 1 ? 0.7 : -0.5; fs.bakYH = 0.3;
    if (k.fT >= 0.8) kn9Faz(o, k.gelSonra);
  } else if (k.faz === 'goster') kn9GosterAdim(o, dt);
  else if (k.faz === 'uc') kn9UcAdim(o, dt);
  else if (k.faz === 'son') kn9SonAdim(o, dt);
  kn9PirilAdim(o, dt);
}
function kn9BekleAdim(o, dt) {   // Feza gelmeden: yuvasında utangaç; Feza yaklaşınca arada bir gizlice bakar, sonra yine kaçırır gözünü
  const k = o.kn, fs = k.fs, yakin = Math.abs(P.x - fs.x) < 560 && Math.abs(P.y - o.y) < 300;
  fs.havada = false; fs.utaH = 1; fs.acH = 0; fs.mutluB = 0; fs.dans = 0;
  fs.x = kn9Kx(o); fs.y = kn9Zemin(o, fs.x);
  fs.yon = yakin && P.x < fs.x ? -1 : 1;
  const bak = yakin && (k.t % 3.4) < 1.3;
  fs.bakXH = bak ? 0.8 : -0.6; fs.bakYH = bak ? 0.05 : 0.6;
}
function kn9GosterAdim(o, dt) {   // Pırıl gösterir; Fıstık hayranlıkla bakar, kanatlarını azıcık açıp dener; çiçek-bulutçuklar sırayla belirir
  const k = o.kn, fs = k.fs, t = k.fT;
  k.fzx = k.entry.x; fs.yon = 1;
  fs.utaH = t < 1.5 ? 1 : 0.4; fs.mutluB = t > 2.2 ? 0.25 : 0;
  fs.bakXH = clamp((k.pr.x - fs.x) / 60, -1, 1); fs.bakYH = -0.9;
  if (t > 2.3 && !k.g1) { k.g1 = true; fs.acH = 0.6; fs.cirpT = 0; fs.sasT = 0.7; fs.sqv -= 1.1; }   // ilk deneme: kanatlar açılır, minik bir çırpış
  if (t > 2.85 && !k.g2) { k.g2 = true; fs.cirpT = 0; fs.sqv -= 1.3; kn9Kivilcim(fs.x - 6, fs.y - 24, 4, '#d9c8ff', 45); }
  for (let i = 0; i < 5; i++) { const c = k.cicek[i]; if (c.apH === 0 && t > 1.0 + i * 0.42) { c.apH = 1; kn9Kivilcim(c.x, c.y, 8, KN9_RENK[i], 70, 0.6); kn9Halka(c.x, c.y, 6, 34, 0.7, KN9_RENK[i], 2.5); kn9Sfx('parilti', i); } }
  if (t >= 4.0) { k.gosterildi = true; kn9Faz(o, 'uc'); }
}
function kn9UcAdim(o, dt) {
  const k = o.kn, fs = k.fs, h = k.cicek[Math.min(k.sira, 4)];
  k.fzx = k.entry.x; fs.yon = 1; fs.mutluB = 0.15 + k.sira * 0.06; k.ilerT += dt; fs.utaH = fs.havada || fs.cirpN > 0 ? 0 : 0.4;
  fs.acH = fs.havada ? 1 : fs.cirpN > 0 ? 0.55 : 0.4;
  fs.bakXH = 0.6; fs.bakYH = clamp((h.y - (fs.y - 26)) / 120, -1, 1);
  // boşta bekleme: ipucu → Pırıl'ın yardımı
  if (!k.helpOn) {
    const i0 = k.idle; k.idle += dt;
    // P9C davet: yerde beklerken Fıstık arada bir kanatlarını çırpıp minik hoplar, sıradaki çiçeğe doğru ışık tozu yollar ("uçalım mı?")
    if (!fs.havada && k.idle > 2.2) { k.davetT = (k.davetT || 0) - dt; if (k.davetT <= 0) { k.davetT = 2.3;
      fs.cirpT = 0; fs.sqv -= 1.4; kn9Kivilcim(fs.x - 6, fs.y - 26, 4, '#e8ffd0', 45);
      const dx = h.x - fs.x, dy = h.y - (fs.y - 26); for (let i = 0; i < 10; i++) { const f = 0.45 + i * 0.13; kn9Toz(i % 2, fs.x + 4, fs.y - 26, dx * f, dy * f + 10 * f, 1.2 + i * 0.05, i % 2 ? 6.5 : 5, i % 2 ? '#ffffff' : KN9_RENK[h.i]); } } }
    else k.davetT = 0.6;
    if (i0 < KN9_IPUCU && k.idle >= KN9_IPUCU) { k.ipucuN++; OLAY.emit('kanatIpucu', { o, n: k.ipucuN }); }
    if (k.idle >= (k.helpN > 0 ? KN9_YARDIM2 : KN9_YARDIM)) { k.helpOn = true; k.helpZor = false; k.helpT = 0; k.helpN++; k.otoT = 0.35; k.tutuyor = false; OLAY.emit('kanatYardim', { o, n: k.helpN }); }
    else if (k.ilerT > 18) { k.helpOn = true; k.helpZor = true; k.helpT = 0; k.helpN++; k.otoT = 0.35; k.tutuyor = false; OLAY.emit('kanatYardim', { o, n: k.helpN, zor: true }); }   // dokunuyor ama yetişemiyor: birlikte uçalım
  } else {
    k.helpT += dt;
    if (k.tutuyor) { k.otoT -= dt; if (k.otoT <= 0 && fs.y - 20 > h.y - 8) { kn9Cirp(o, true); k.otoT = 0.5; } }
  }
  if (fs.havada) {
    // yatay: kendi kendine sıradaki çiçeğe doğru süzülür (yalnız havadayken)
    const vxH = clamp((h.x - 4 - fs.x) * 1.1, -50, 66);
    fs.vx += (vxH - fs.vx) * (1 - Math.exp(-dt * 2.4));
    // dikey: yumuşak yerçekimi, kanatlar açık süzülme hızıyla sınırlı (basılı parmak / Pırıl'ın tuttuğu yavru daha yavaş iner)
    fs.vy += KN9_YERC * dt;
    const sMax = (KN9_PARMAK.size > 0 || k.tus || k.tutuyor ? KN9_SUZ_TUT : KN9_SUZ) * (1 - 0.5 * kn9Zor(k));
    if (fs.vy > sMax) fs.vy += (sMax - fs.vy) * (1 - Math.exp(-dt * 7));
    // çiçek yakındaysa yavruyu yumuşakça kendine çeker (cömert)
    const cy = fs.y - 20, dx = h.x - fs.x, dy = h.y - cy, d = Math.hypot(dx, dy);
    if (d < KN9_CEK) { const p = (1 - d / KN9_CEK) * 1.9 * dt; fs.x += dx * p; fs.y += dy * p; }
    fs.x += fs.vx * dt; fs.y += fs.vy * dt;
    if (fs.y < o.y + KN9_TAVAN) { fs.y = o.y + KN9_TAVAN; if (fs.vy < 0) fs.vy *= 0.3; }
    const z = kn9Zemin(o, fs.x);
    if (fs.y >= z) {   // tüy gibi konar (düşme yok): minik ezilme, çimden ışık tozu
      fs.y = z; if (fs.vy > 0) { fs.sqv += 1.8; for (let i = 0; i < 3; i++) kn9Toz(0, fs.x + (i - 1) * 9, z - 2, (i - 1) * 30, -20, 0.7, 3.5, '#e8ffd0'); }
      fs.vy = 0; fs.vx = 0; fs.havada = false;
    }
    const dd = Math.hypot(h.x - fs.x, h.y - (fs.y - 20));
    if (!h.dokundu && dd < KN9_DOKUN) kn9CicekDokun(o, h.i, k.tutuyor);
    // uçarken arada bir minik ışık tozu izi
    if (Math.random() < dt * 10) kn9Toz(0, fs.x - 12, fs.y - 16, -20, 10, 0.8, 2.5 + Math.random() * 2, Math.random() < 0.5 ? '#e8ffd0' : '#d9c8ff');
  }
  const rH = fs.havada ? clamp(-fs.vy * 0.0013 + fs.vx * 0.0012, -0.22, 0.3) : 0;
  fs.rot += (rH - fs.rot) * (1 - Math.exp(-dt * 6));
}
// Catmull-Rom yol: dört nokta (x0,y0..x3,y3) üstünden geçen yumuşak eğri; u 0..1 → KN9_YP
const KN9_YP = { x: 0, y: 0 };
function kn9Yol(p, u) {
  const n = 3, f = clamp(u, 0, 1) * n, i = Math.min(n - 1, Math.floor(f)), s = f - i;
  const ix = j => j < 0 ? 2 * p[0] - p[2] : j > 3 ? 2 * p[6] - p[4] : p[j * 2], iy = j => j < 0 ? 2 * p[1] - p[3] : j > 3 ? 2 * p[7] - p[5] : p[j * 2 + 1];
  const cr = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * s + (2 * a - 5 * b + 4 * c - d) * s * s + (-a + 3 * b - 3 * c + d) * s * s * s);
  KN9_YP.x = cr(ix(i - 1), ix(i), ix(i + 1), ix(i + 2)); KN9_YP.y = cr(iy(i - 1), iy(i), iy(i + 1), iy(i + 2)); return KN9_YP;
}
const KN9_YA = [0, 0, 0, 0, 0, 0, 0, 0], KN9_YC = [0, 0, 0, 0, 0, 0, 0, 0];
// SON: kendi başına geniş süzülüş → takla → Feza'ya gelip burnuyla dokunur → yanına konar, sevinçle hoplar
function kn9SonAdim(o, dt) {
  const k = o.kn, fs = k.fs, s = k.son, t = k.fT, X = o.x, Y = o.y;
  k.fzx = k.entry.x;
  fs.mutluB = 1; fs.utaH = 0; fs.acH = 1;
  s.bx = k.fzx + 31; s.by = P.y - 37; s.lx = k.fzx + 54; s.ly = Y;   // burun Feza'nın yanağına (Feza ≈ 80 boy): yavru yüz hizasında süzülür
  const ox = fs.x, oy = fs.y; let x = ox, y = oy, rot = null, yon = fs.yon;
  const cirp = (zaman) => { if (t >= zaman && s.cirp < zaman) fs.cirpT = 0; };
  if (t < 2.3) {   // A: geniş yay (yükselir, tepenin üstünde süzülür)
    const p = KN9_YA; p[0] = s.p0x; p[1] = s.p0y; p[2] = X + 222; p[3] = Y - 414; p[4] = X + 72; p[5] = Y - 404; p[6] = s.cx; p[7] = s.cy + s.r;
    const q = kn9Yol(p, t / 2.3); x = q.x; y = q.y;
    cirp(0.05); cirp(0.45); cirp(0.9); cirp(1.6);
  } else if (t < 3.5) {   // B: takla (dikey çember; burun yukarı dönerek tam tur)
    if (!s.takla) { s.takla = true; kn9Sfx('kanatTakla'); OLAY.emit('kanatTakla', { o }); for (const c of k.cicek) { c.popV += 4; kn9Halka(c.x, c.y, 8, 40, 0.6, KN9_RENK[c.i], 2.5); } }
    const u = (t - 2.3) / 1.2, uu = u - Math.sin(u * 6.2832) * 0.06, a = Math.PI / 2 + uu * 6.2832;
    x = s.cx + Math.cos(a) * s.r; y = s.cy + Math.sin(a) * s.r; rot = uu * 6.2832; yon = -1;
    if (Math.random() < dt * 30) kn9Toz(Math.random() < 0.4 ? 1 : 0, x + (Math.random() - 0.5) * 8, y - 18, 0, 0, 0.9, 3 + Math.random() * 3, KN9_RENK[(Math.random() * 5) | 0]);
    cirp(2.35);
  } else if (t < 5.6) {   // C: Feza'ya doğru süzülerek iner
    const p = KN9_YC; p[0] = s.cx; p[1] = s.cy + s.r; p[2] = X - 150; p[3] = Y - 262; p[4] = k.fzx + 78; p[5] = Y - 128; p[6] = s.bx; p[7] = s.by;
    const u = (t - 3.5) / 2.1, q = kn9Yol(p, 1 - (1 - u) * (1 - u) * (1 - u * 0.4)); x = q.x; y = q.y; yon = -1;
    cirp(3.7); cirp(4.25); cirp(4.85); cirp(5.35);
  } else if (t < 6.5) {   // D: burnuyla "dıt dıt"
    const v = (t - 5.6) / 0.9, b = Math.max(0, Math.sin(v * Math.PI * 2 - 0.3));
    x = s.bx - b * 4.5; y = s.by + Math.sin(t * 5) * 1.2; yon = -1; fs.mutluT = 0.5;
    if (!s.burun && t >= 5.72) { s.burun = true; kn9Kalpler(s.bx - 18, s.by - 34, 5); kn9Kivilcim(s.bx - 20, s.by - 26, 6, '#ffc0d8', 60); kn9Sfx('yavruCik2'); k.fzSev = 2.2; OLAY.emit('kanatBurun', { o }); }
    cirp(5.65); cirp(6.1);
  } else if (t < 7.4) {   // E: yanına konar
    const u = (t - 6.5) / 0.9; x = lerp(s.bx, s.lx, smooth(u)); y = lerp(s.by, s.ly, u * u) - Math.sin(u * Math.PI) * 22; yon = -1;
    cirp(6.55);
    if (u > 0.97 && !s.indi) { s.indi = true; fs.sqv += 2.4; for (let i = 0; i < 4; i++) kn9Toz(0, s.lx + (i - 1.5) * 8, s.ly - 2, (i - 1.5) * 26, -24, 0.7, 3.5, '#e8ffd0'); }
  } else {   // F: sevinçle hoplar
    const v = t - 7.4; x = s.lx; y = s.ly - Math.abs(Math.sin(v * Math.PI * 2.2)) * 7; yon = -1; fs.dans = 1;
    if (Math.sin((v - dt) * Math.PI * 2.2) * Math.sin(v * Math.PI * 2.2) < 0) fs.sqv += 1.2;
  }
  s.cirp = t;
  fs.havada = t < 7.35;
  const vx = dt > 0 ? (x - ox) / dt : 0, vy = dt > 0 ? (y - oy) / dt : 0;
  fs.vx = Number.isFinite(vx) ? vx : 0; fs.vy = Number.isFinite(vy) ? vy : 0;
  if (rot === null) {
    if (t >= 2.3 && t < 3.5) rot = 0;
    else {
      if (t < 2.3 && Math.abs(vx) > 8) yon = vx > 0 ? 1 : -1;
      let r0 = fs.rot; while (r0 > Math.PI) r0 -= 6.2832;   // takla bitti: tam tur (2π) ile 0 aynı duruş, geri sarmadan devam
      const rH = fs.havada ? clamp(Math.atan2(-vy, Math.abs(vx) + 30) * 0.55, -0.45, 0.45) : 0; rot = r0 + (rH - r0) * (1 - Math.exp(-dt * 8));
    }
  }
  fs.x = x; fs.y = y; fs.rot = rot; fs.yon = yon;
  fs.bakXH = t < 5.6 ? 0.4 : 0.9; fs.bakYH = t < 5.6 ? 0 : 0.2;
  if (t >= KN9_SON) kn9Birak(o, true);
}
// bitti: tepede mutlu; Feza yakındayken arada bir kısa tur uçar (bazen takla), Feza'ya bakar
function kn9SerbestAdim(o, dt) {
  const k = o.kn, fs = k.fs, s = k.ser; if (!s) return;
  const kx = kn9Kx(o), yakin = Math.abs(P.x - fs.x) < 700 && Math.abs(P.y - o.y) < 300;
  fs.mutluB = 0.45; fs.utaH = 0; fs.dans = 0;
  if (s.durum === 'otur') {
    fs.havada = false; fs.acH = 0.6; fs.rot *= Math.exp(-dt * 8);
    fs.yon = yakin ? (P.x < fs.x ? -1 : 1) : 1; fs.bakXH = 0.6; fs.bakYH = 0;
    s.t -= dt;
    if (s.t <= 0 && yakin) {
      s.durum = 'uc'; s.u = 0; s.x0 = fs.x; s.y0 = fs.y; s.n++;
      const evde = Math.abs(fs.x - kx) < 30;
      s.x1 = evde ? kx + (s.n % 2 ? 96 : -84) : kx; s.y1 = kn9Zemin(o, s.x1);
      s.h = 70 + Math.random() * 50; s.sure = 1.7; s.takla = s.n % 3 === 2; s.cirp = -1;
      fs.sqv += 1.6;
    }
  } else {
    s.u += dt / s.sure; const u = Math.min(1, s.u);
    fs.x = lerp(s.x0, s.x1, smooth(u)); fs.y = lerp(s.y0, s.y1, u) - Math.sin(u * Math.PI) * s.h;
    fs.yon = s.x1 >= s.x0 ? 1 : -1; fs.havada = true; fs.acH = 1;
    const ci = Math.floor(u / 0.17); if (u < 0.7 && ci !== s.cirp) { s.cirp = ci; fs.cirpT = 0; }
    fs.rot = s.takla && u > 0.25 && u < 0.7 ? smooth((u - 0.25) / 0.45) * 6.2832 : 0;
    if (Math.random() < dt * 12) kn9Toz(0, fs.x - 10 * fs.yon, fs.y - 16, 0, 10, 0.8, 3, Math.random() < 0.5 ? '#e8ffd0' : '#d9c8ff');
    if (u >= 1) { s.durum = 'otur'; s.t = 3 + Math.random() * 3.5; fs.havada = false; fs.rot = 0; fs.sqv += 2; fs.y = s.y1; if (s.takla) fs.mutluT = 1; }
  }
}
// Pırıl: Feza'nın yanında · gösteri (kocaman çırpıp yükselir, süzülür) · Fıstık'ın yanında süzülür · ipucu (sıradaki çiçeğe uçup ışık serper) ·
// yardım (Fıstık'ı kanadından tutup birlikte uçar) · son gösteride sevinçle tur atar
function kn9PirilAdim(o, dt) {
  const k = o.kn, pr = k.pr, fs = k.fs, kx = kn9Kx(o), ky = kn9Zemin(o, kx);
  let tx = k.fzx + 44, ty = o.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'goster') {
    const t = k.fT;
    if (t < 0.9) { tx = kx - 8; ty = ky - 92; hiz = 4.5; }
    else if (t < 3.4) {
      const u = (t - 0.9) / 2.5; tx = kx - 8 + Math.sin(u * Math.PI * 2) * 28; ty = ky - 92 - Math.sin(u * Math.PI) * 62; hiz = 8;
      const fz = Math.floor(t / 0.3); if (u < 0.55 && fz !== k.gPuf) { k.gPuf = fz; for (let i = 0; i < 3; i++) kn9Toz(3, pr.x + (Math.random() - 0.5) * 26, pr.y + 16, (Math.random() - 0.5) * 40, 70 + Math.random() * 30, 0.6, 12, i % 2 ? '#e2ccff' : '#fff6d6'); }
      if (Math.random() < dt * 12) kn9Toz(1, pr.x + (Math.random() - 0.5) * 30, pr.y + 10, (Math.random() - 0.5) * 20, 30, 0.9, 3.5, '#e2ccff');
    } else { tx = fs.x - 52; ty = fs.y - 70; }
  } else if (k.faz === 'uc') {
    const h = k.cicek[Math.min(k.sira, 4)];
    if (k.helpOn) {
      const hx = fs.x - KN9_KOKX - k.patiX, hy = fs.y - KN9_KOKY - k.patiY + Math.sin(k.t * 6.8) * 1.2;   // Pırıl'ın patisi Fıstık'ın kanat kökünde
      if (k.tutuyor) { pr.x = hx; pr.y = hy; pr.f = 1; return; }
      tx = hx; ty = hy; hiz = 6.5;
      if (Math.hypot(pr.x - hx, pr.y - hy) < 16 && k.helpT > 0.5) { k.tutuyor = true; kn9Kivilcim(fs.x - 8, fs.y - 30, 6, '#e2ccff', 50); }
    } else if (k.idle > KN9_IPUCU) {
      const u = ((k.idle - KN9_IPUCU) % 5) / 5, ust = u < 0.6;
      tx = ust ? h.x + 34 : fs.x - 50; ty = ust ? h.y - 36 + Math.sin(k.t * 3.2) * 6 : fs.y - 66; hiz = 3.2;
      if (ust && Math.hypot(pr.x - tx, pr.y - ty) < 40 && Math.random() < dt * 14) kn9Toz(Math.random() < 0.3 ? 1 : 0, pr.x + (Math.random() - 0.5) * 16, pr.y + 8, (fs.x - pr.x) * 0.25, (fs.y - 20 - pr.y) * 0.25, 1.2, 3 + Math.random() * 3, Math.random() < 0.5 ? '#e2ccff' : KN9_RENK[h.i]);
      bak = ust ? -1 : 1;
    } else { tx = fs.x - 52; ty = fs.y - 68 + Math.sin(k.t * 2.1) * 5; hiz = 2.8; }
  } else if (k.faz === 'son') {
    if (k.fT < 5.3) { const a = k.t * 1.5; tx = o.x - 70 + Math.sin(a) * 170; ty = o.y - 250 + Math.sin(a * 2) * 26; hiz = 2.4; if (Math.random() < dt * 6) kn9Toz(0, pr.x, pr.y + 6, 0, 10, 0.8, 4, '#e2ccff'); }
    else { tx = k.fzx + 70; ty = o.y - 122 + Math.sin(k.t * 2.1) * 4; hiz = 3; bak = -1; }
  }
  ty = Math.min(ty, o.y - 64);
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function kn9CicekCiz(o, tm) {
  const k = o.kn, S1 = KN9_S, ipucu = k.faz === 'uc' && !k.helpOn ? clamp((k.idle - 3) / 4, 0, 1) : 0;
  for (let i = 0; i < 5; i++) {
    const c = k.cicek[i]; if (c.ap < 0.01) continue;
    const x = c.x + Math.sin(tm * 0.9 + i * 1.3) * 3, y = c.y + Math.sin(tm * 1.3 + i * 1.7) * 4;
    const sirada = !c.dokundu && i === k.sira && (k.faz === 'uc' || k.faz === 'goster');
    const nb = sirada ? 0.5 + 0.5 * Math.sin(tm * 4.2) : 0, col = KN9_RENK[i];
    g.globalCompositeOperation = 'lighter';
    if (c.dokundu) { kn9Glow(g, col, x, y, 74, c.ap * c.lit * (0.42 + 0.08 * Math.sin(tm * 2 + i))); kn9Glow(g, '#ffffff', x, y, 26, c.ap * c.lit * 0.35); }
    else if (sirada) { kn9Glow(g, col, x, y, 58 + nb * 10 + ipucu * 14, c.ap * (0.22 + 0.26 * nb) * (1 + ipucu * 0.6)); kn9Glow(g, '#fff6d6', x, y - 4, 18, c.ap * (0.2 + 0.25 * nb)); }
    else kn9Glow(g, col, x, y, 46, c.ap * 0.2);   // sönükken de yumuşak hâle: renkli ağaç taçlarının önünde okunsun
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = c.ap * (c.dokundu || sirada ? 1 : 0.78);
    kn9Bas(g, S1.bulut[i], x, y + 13, 0.78);
    if (c.dokundu) kn9Don(g, S1.cicek[i], x, y - 3, tm * 0.35 + i, 0.92 * Math.max(0.2, c.pop));
    else kn9Don(g, S1.tomurcuk[i], x, y + 5, Math.sin(tm * 3.1 + i) * (0.05 + 0.1 * nb), 1 + nb * 0.12);
    g.globalAlpha = 1;
  }
  // beş çiçek de açılınca: çiçekleri birbirine bağlayan ışık yolu (son gösteride alttan yukarı akarak belirir, sonra hafifçe parıldar)
  if (k.sira >= 5 && k.yol.length) {
    const ya = k.faz === 'son' ? clamp(k.fT / 1.5, 0, 1) : 1, guc = k.faz === 'son' ? 0.7 : 0.32, n = k.yol.length;
    g.globalCompositeOperation = 'lighter';
    for (let j = 0; j < n; j++) {
      const d = k.yol[j], u = j / (n - 1); if (u > ya) break;
      const on = ya < 1 ? clamp((ya - u) * 8, 0, 1) : 1, a = on * guc * (0.55 + 0.45 * Math.sin(tm * 3.2 - j * 0.55));
      kn9Glow(g, d.c, d.x, d.y + Math.sin(tm * 1.3 + j * 0.4) * 2, 9, a); kn9Glow(g, '#ffffff', d.x, d.y, 2.6, a);
    }
    g.globalCompositeOperation = 'source-over';
  }
  // ipucu: Fıstık'tan sıradaki çiçeğe akan minik ışık tozları
  if (k.faz === 'uc' && k.aktif && k.sira < 5) {
    const h = k.cicek[k.sira], fs = k.fs, sx = fs.x + 6, sy = fs.y - 22, d = Math.hypot(h.x - sx, h.y - sy);
    if (d > 60) {
      const guc = (0.3 + 0.55 * ipucu) * clamp((d - 60) / 60, 0, 1);
      g.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 5; j++) {
        const u = (tm * 0.38 + j / 5) % 1, px = lerp(sx, h.x, u) + Math.sin(u * 9 + j) * 5, py = lerp(sy, h.y, u) - Math.sin(u * Math.PI) * 22, a = Math.sin(u * Math.PI) * guc;
        kn9Glow(g, KN9_RENK[h.i], px, py, 8, a * 0.7); kn9Glow(g, '#ffffff', px, py, 2.8, a);
      }
      g.globalCompositeOperation = 'source-over';
    }
  }
}
function kn9Golge(o) {
  const fs = o.kn.fs, z = kn9Zemin(o, fs.x), h = z - fs.y, kk = clamp(1 - h / 320, 0.25, 1);
  g.globalAlpha = 0.75 * kk; kn9Bas(g, KN9_S.golge, fs.x, z - 0.5, 0.75 + 0.35 * kk); g.globalAlpha = 1;
}
function kn9Ciz(o, tm) {
  if (o.x + 430 < cam.x || o.x - 500 > cam.x + VW) return;
  kn9Hazirla();
  const k = o.kn;
  kn9Bas(g, KN9_S.tumsek, kn9Kx(o), o.y - 3);
  kn9CicekCiz(o, tm);
  if (kn9Finalde()) return;   // finalde Fıstık'ı BUYUKANNE (yuva.js) çizer: iki Fıstık olmasın
  kn9Golge(o);
  if (!k.aktif) kn9FistikCiz(g, k.fs, tm);   // etkinlik yokken Feza onun önünden geçer
}
const KN9_FZ_OPT = { ruzgar: 0.05 };
function kn9Finalde() { return typeof V9 !== 'undefined' && !!V9 && !!V9.final; }
// Pırıl'ı çiz (P.ucus doluyken piril.js çizmez): Bölüm 9 pozları (KARAKTER) — 'ucus' {sevinc, bakX, bakY}, 'goster9' (ipucu: "işte bu!"),
// 'tut9' (Fıstık'ı kanadından tutar; dönüş = pati noktası), 'sevinc9' (havada sevinç taklası)
const KN9_PU = { sevinc: 0, bakX: 0, bakY: 0, yon: 1, salla: 0 };
const KN9_POZ = {};   // pirilCizPoz bu pozu biliyor mu (KARAKTER henüz eklemediyse 'ucus' çizilir)
function kn9PozVar(ad) { let v = KN9_POZ[ad]; if (v === undefined) { try { v = typeof pirilCizPoz === 'function' && String(pirilCizPoz).indexOf("'" + ad + "'") >= 0; } catch (e) { v = false; } KN9_POZ[ad] = v; } return v; }
function kn9PirilCiz(o, tm) {
  const k = o.kn, pr = k.pr, fs = k.fs, U = KN9_PU;
  let poz = 'ucus';
  U.sevinc = k.fzSev > 0 ? 0.8 : 0; U.bakX = clamp((fs.x - pr.x) / 80, -1, 1) * pr.f; U.bakY = clamp((fs.y - 20 - pr.y) / 80, -1, 1); U.yon = pr.f; U.salla = 0;
  if (k.faz === 'uc' && (k.tutuyor || k.helpOn && Math.hypot(pr.x + k.patiX - fs.x + KN9_KOKX, pr.y + k.patiY - fs.y + KN9_KOKY) < 40)) poz = 'tut9';
  else if (k.faz === 'uc' && k.idle > KN9_IPUCU && !k.helpOn && pr.f < 0) poz = 'goster9';
  else if (k.faz === 'goster' && k.fT > 0.9 && k.fT < 3.4) U.sevinc = 0.6;
  else if (k.faz === 'son') { if (k.fT > 2.2 && k.fT < 3.3) poz = 'sevinc9'; U.sevinc = 1; if (k.fT > 6.6) U.salla = 1; }
  if (poz !== 'ucus' && !kn9PozVar(poz)) poz = 'ucus';
  let r = null;   // aynalamayı kendimiz yaparız (olcek hep +1): dönüş değeri Pırıl'ın yerel koordinatında
  g.save(); try { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); r = pirilCizPoz(g, 0, 0, 1, poz, tm, U); } catch (e) { r = null; } g.restore();
  if (poz === 'tut9' && r && Number.isFinite(r.x) && Number.isFinite(r.y) && Math.abs(r.x) < 60 && Math.abs(r.y) < 60) { k.patiX = r.x * (pr.f < 0 ? -1 : 1); k.patiY = r.y; }
}
function kn9CizOn(o, tm) {
  const k = o.kn; kn9Hazirla();
  if (!k.aktif && (o.x + 470 < cam.x || o.x - 520 > cam.x + VW)) return;
  if (k.aktif && P.ucus === o) {
    // Feza: tepenin solunda, Fıstık'a dönük; çiçekte ve burun dokunuşunda sevinçle hoplar
    const sev = k.fzSev > 0 || (k.faz === 'son' && k.fT > 5.5);
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, k.fzx, P.y, 1, sev ? 'sevinc' : 'ayakta_yan', tm, null, KN9_FZ_OPT); } catch (e) {}
    if (typeof pirilCizPoz === 'function') kn9PirilCiz(o, tm);
    if (k.tutuyor) {   // Pırıl'ın patisi Fıstık'ın kanat kökünde: yumuşak ışık
      g.globalCompositeOperation = 'lighter'; kn9Glow(g, '#e2ccff', k.fs.x - 7, k.fs.y - 30, 15, 0.55 + 0.15 * Math.sin(tm * 5)); g.globalCompositeOperation = 'source-over';
    }
    kn9FistikCiz(g, k.fs, tm);
  }
  kn9ParcaCiz();
}

// ── girdi: etkinlikte HER dokunuş bir kanat çırpışı (ekranın neresine olursa). Pencere yakalama evresi: motorun yürüme parmağına
// ulaşmaz. Etkinlik yokken yalnız Fıstık'ın kendisine dokunuş yakalanır. ──
function kn9Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
addEventListener('pointerdown', e => {
  if (DURUM !== 'oyun' || e.pointerType === 'mouse' && e.button !== 0) return;
  const o = KANAT.aktif;
  if (o) {
    if (e.target !== cv) return;
    e.preventDefault(); e.stopPropagation();
    KN9_PARMAK.add(e.pointerId);
    try { kn9Cirp(o, false); } catch (er) { console.warn('[kanat]', er); }
    return;
  }
  const so = KANAT.o;
  if (!so || !so.kn || P.ucus || e.target !== cv || Math.abs(P.x - so.x) > 900) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi her zaman önce
  const p = kn9Dunya(e), fs = so.kn.fs;
  if (Math.abs(p.x - fs.x) > 34 || p.y < fs.y - 58 || p.y > fs.y + 10) return;
  e.preventDefault(); e.stopPropagation();
  try { kn9Selam(so); } catch (er) { console.warn('[kanat]', er); }
}, true);
function kn9ParmakBirak(e) { KN9_PARMAK.delete(e.pointerId); }
addEventListener('pointerup', kn9ParmakBirak, true); addEventListener('pointercancel', kn9ParmakBirak, true);
addEventListener('blur', kn9GirdiBirak);
addEventListener('pagehide', kn9GirdiBirak);
document.addEventListener('visibilitychange', () => { if (document.hidden) kn9GirdiBirak(); });
addEventListener('keydown', e => {
  const o = KANAT.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  e.preventDefault(); e.stopPropagation();
  if (/^(Space|Enter|KeyE|ArrowUp|KeyW)$/.test(e.code)) { o.kn.tus = true; if (!e.repeat) kn9Cirp(o, false); }
}, true);
addEventListener('keyup', e => { const o = KANAT.o; if (o && o.kn && /^(Space|Enter|KeyE|ArrowUp|KeyW)$/.test(e.code)) o.kn.tus = false; }, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = KANAT.aktif; if (o && d !== 'mola' && d !== 'duraklat') kn9Birak(o, false); kn9GirdiBirak(); });
OLAY.on('konusma', e => { const o = KANAT.o; if (o && o.kn && e && typeof e.anahtar === 'string' && /^fs_/.test(e.anahtar)) o.kn.fs.konus = clamp(+e.sure || 2, 0.5, 6); });   // Fıstık'ın sesi (CORE): ağzı oynar

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" kadrajı ezer; uçma dersinde dikkat kadrajı geçerli olsun (iskelet.js'teki
// sarmalayıcının aynısı; CORE oyun.js'e Bölüm 9 istisnası eklediyse zararsız).
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.kn9Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'kanatMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.kn9Sarili = true; for (const a in f) { try { s[a] = f[a]; } catch (e) {} }
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('kanatMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js: o.tk.bitti ile de açılır (CORE kanatMini'yi eklemeden önce de çalışsın)
    const kx = o.x + KN9_TX;
    const cicek = KN9_CICEK.map(([dx, dy], i) => ({ i, x: o.x + dx, y: o.y + dy, ap: 0, apH: 0, dokundu: false, dT: 0, pop: 1, popV: 0, lit: 0 }));
    o.kn = { aktif: false, faz: 'bekle', fT: 0, t: 0, sira: 0, idle: 0, helpOn: false, helpT: 0, helpN: 0, ipucuN: 0, tutuyor: false, otoT: 0,
      basladi: false, gosterildi: false, helpZor: false, ilerT: 0, gelSonra: 'goster', g1: false, g2: false, gPuf: -1, cirpN: 0, fzx: o.x - KN9_GIRIS, fzSev: 0, tus: false, cicek,
      fs: { x: kx, y: o.y, vx: 0, vy: 0, yon: 1, havada: false, cirpT: 9, cirpN: 0, kan: 0, ac: 0, acH: 0, uta: 1, utaH: 1, kizarT: 0, mutlu: 0, mutluB: 0, mutluT: 0,
        sas: 0, sasT: 0, zipT: 0, konus: 0, agiz: 0, ucus: 0, dans: 0, kuy: 0, sq: 0, sqv: 0, rot: 0, bakX: 0, bakY: 0, bakXH: 0, bakYH: 0, olc: 1, basEg: 0, kf: -0.3 },
      patiX: 24, patiY: 24,
      entry: { x: o.x - KN9_GIRIS, x0: o.x - KN9_GIRIS, y: o.y, f: 1 }, pr: { x: o.x - 420, y: o.y - 120, f: 1 }, son: null, ser: null, kameraFn: null };
    o.kn.fs.y = kn9Zemin(o, kx);
    o.kn.yol = [];   // ışık yolu noktaları (çiçekten çiçeğe, hafif yukarı kavisli; sabit, bir kez)
    for (let i = 0; i < 4; i++) { const a = cicek[i], b = cicek[i + 1], L = Math.hypot(b.x - a.x, b.y - a.y), m = Math.max(2, Math.round(L / 15));
      for (let j = i ? 1 : 0; j <= m; j++) { const u = j / m; o.kn.yol.push({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) - Math.sin(u * Math.PI) * 16, c: KN9_RENK[u < 0.5 ? i : i + 1] }); } }
    o.kn.kameraFn = () => { if (typeof omDkEkle === 'function') omDkEkle(o.x - KN9_GIRIS - 60, o.y - 445, o.x + 335, o.y + 26); };
    o.adim = dt => kn9Adim(o, dt);
    KANAT.o = o;
  },
  guncelle: kn9Guncelle, ciz: kn9Ciz, cizOn: kn9CizOn
});
