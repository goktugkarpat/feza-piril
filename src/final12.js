/* final12.js — Bölüm 12'nin finali: gün batımı tepesinde piknik (k12Final, sütun 870).
   Feza tepeye yürüyüp piknik örtüsüne basınca kesintisiz bir sinematik an başlar (dokunma gerekmez, ~23 sn):
     1. Feza yavaşlayıp örtünün üstünde durur; anne arkasından gelip örtüye oturur ve Feza'yı yanına çağırır.
     2. Feza annesine dönüp yanına oturur. Gün batımı altınlaşır (güneş göletin üstünde ufka iner).
     3. Pırıl aralarında müzik notalarıyla dans eder; anne alkışlar, Feza sallanır.
     4. Anne Feza'ya sımsıkı sarılır: kalpler ve ışık zerreleri yükselir.
     5. Gün yumuşakça kararır, ilk yıldızlar birer birer yanar → 'kampusFinalBitti' (oyun.js 2 sn sonra sabaha geçer).
   Dokunursa küçük tepkiler: sepete → kurabiye tabağa uçar, Pırıl'a → takla, limonataya → kabarcıklar, başka yere → minik kalp.
   Final süresince kontrol finaldedir (P.ucus = o), ama bu bir duraklama değil: her şey hep hareketli, kamera ikisini yumuşakça çerçeveler.
   Anne ANNE12.devral('final') ile devralınır ve anne12Ciz ile burada çizilir; Feza'yı FEZA12'nin fezaPoz12 pozlarıyla feza.js çizer
   (fezaPoz12 yoksa burada fezaCizPoz yedeğiyle çizilir; FEZA12 ile kararlaştırıldı: b12/istek/FEZA12_to_FINAL_1.md). Pırıl P.ucus doluyken piril.js'te çizilmez: burada pirilCizPoz ile çizilir.
   Olaylar: 'k12FinalBasla' {o, sure}, 'k12FinalAn' {an}, 'kampusFinalBitti' {o}. Durum: V12.final, K12FINAL (ARKA/MUZIK okur).
   Sözleşme: src/BOLUM12.md. Performans: bütün degradeler ve sprite'lar bir kez önbelleğe çizilir; parçacıklar sabit havuzdan. */
'use strict';

// Diğer modüllerin okuyabildiği final durumu (gök kararması, müzik). Salt okunur kullanın.
const K12FINAL = { aktif: false, t: 0, faz: '', altin: 0, aksam: 0, yakin: 1 };   // yakin: kameranın sarılmada hafif yakınlaşması (oyun.js)

(() => {
  if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO !== 12) return;
  const PI2 = Math.PI * 2;
  const ke = v => clamp(v, 0, 1);
  const yum = v => smooth(ke(v));                       // 0..1 yumuşak geçiş
  const arasi = (t, a, b) => yum((t - a) / (b - a));      // t, a..b aralığında 0→1

  // ── yerleşim (dünya birimi; zemin düz, y = 720) ──
  const ORTU_DX = 30;        // örtünün ortası k12Final nesnesinin biraz sağında (Feza soldan gelir)
  const ORTU_YARI = 150;     // örtünün yarı eni
  const ANNE_ARA = 92;       // otururken anne ile Feza arası (annenin uzanan bacakları Feza'ya değmesin)
  const SARIL_ARA = 28;      // sarılırken Feza annenin önünde (anne.x + 28·yön; ANNE ile kararlaştırıldı)
  const ANNE_HIZ = 95;       // annenin örtüye yürüme hızı (birim/sn)
  // örtünün üstündeki şeyler (örtü ortasına göre): hepsi arka sırada, oturanların arkasında kalır
  const YER = { tabak: [32, -7], surahi: [64, -9], bardak1: [50, -6], bardak2: [80, -5], sepet: [116, -8], ucurtma: [190, 0] };

  // ── zaman çizelgesi (sn; P.ucus alındığı andan itibaren). Anne yürüyüşü değişken, gerisi ona göre kurulur ──
  const SURE_OTUR = 0.7;     // ayaktan oturmaya geçiş
  const SURE_CAGIR = 1.3;    // anne çağırır → Feza döner ve oturur
  const SURE_DANS = 8.0;     // Pırıl'ın müzik anı
  const SURE_SARIL = 7.5;    // sarılma (kararma bunun içinde başlar)
  const SON_PAY = 2.0;       // 'kampusFinalBitti' sonrası oyun.js'in beklemesi (yalnız toplam süre hesabı için)

  let aktif = null;          // tek final nesnesi

  // ════════════════ önbellek tuvalleri (bir kez çizilir) ════════════════
  const OB = { ortu: null, sepet: null, surahi: null, nota: [], kalp: [], yildiz: null, huzme: null, aksam: null };
  const OB_K = 3;            // sprite çözünürlüğü: dünya biriminin 3 katı (iPad'de keskin)
  function tuval(w, h) { const c = document.createElement('canvas'); c.width = Math.max(2, Math.ceil(w)); c.height = Math.max(2, Math.ceil(h)); return c; }

  // Piknik örtüsü: pastel pembe-krem kareli, hafif perspektif (arka kenar dar), ön kenarda fırfır, altında yumuşak gölge.
  function ortuCiz() {
    const w = ORTU_YARI * 2 + 20, h = 44, c = tuval(w * OB_K, h * OB_K), x = c.getContext('2d');
    x.scale(OB_K, OB_K); x.translate(w / 2, 22);          // (0,0) = örtünün ortası, zemin hizası
    const R = ORTU_YARI, ust = -13, alt = 11, daral = 0.9;
    const yol = () => { x.beginPath(); x.moveTo(-R * daral, ust); x.lineTo(R * daral, ust); x.lineTo(R, alt); x.lineTo(-R, alt); x.closePath(); };
    // gölge
    x.fillStyle = 'rgba(60,40,60,0.22)'; x.beginPath(); x.ellipse(0, alt + 2, R * 1.02, 6, 0, 0, PI2); x.fill();
    // zemin rengi
    yol(); x.fillStyle = '#fff4e6'; x.fill();
    x.save(); yol(); x.clip();
    // kareler: yatay şeritler arkaya doğru sıklaşır, dikey şeritler arkaya doğru içe yaklaşır (perspektif)
    x.fillStyle = 'rgba(240,140,165,0.42)';
    const n = 8;
    for (let i = 0; i < n; i += 2) {
      const y0 = lerp(ust, alt, Math.pow(i / n, 1.25)), y1 = lerp(ust, alt, Math.pow((i + 1) / n, 1.25));
      x.fillRect(-R - 2, y0, R * 2 + 4, y1 - y0);
    }
    const m = 18;
    for (let i = 0; i < m; i += 2) {
      const a0 = lerp(-R, R, i / m), a1 = lerp(-R, R, (i + 1) / m);
      x.beginPath(); x.moveTo(a0 * daral, ust); x.lineTo(a1 * daral, ust); x.lineTo(a1, alt); x.lineTo(a0, alt); x.closePath(); x.fill();
    }
    // kumaşın yumuşak kıvrımları: iki açık, bir koyu bant
    x.fillStyle = 'rgba(255,255,255,0.28)'; x.beginPath(); x.ellipse(-R * 0.45, -2, R * 0.22, 5, 0.05, 0, PI2); x.ellipse(R * 0.35, 1, R * 0.18, 4, -0.04, 0, PI2); x.fill();
    x.fillStyle = 'rgba(150,80,110,0.08)'; x.beginPath(); x.ellipse(-R * 0.05, 4, R * 0.25, 3, 0, 0, PI2); x.fill();
    x.restore();
    // ön kenar fırfırı ve arka kenarda ince açık çizgi
    x.fillStyle = '#f3a3b8';
    for (let i = 0; i <= 30; i++) { const px = lerp(-R, R, i / 30); x.beginPath(); x.arc(px, alt + 0.6, 3.4, 0, Math.PI); x.fill(); }
    x.strokeStyle = 'rgba(255,255,255,0.75)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-R * daral + 2, ust + 1); x.lineTo(R * daral - 2, ust + 1); x.stroke();
    x.strokeStyle = 'rgba(200,110,140,0.55)'; x.lineWidth = 1; yol(); x.stroke();
    OB.ortu = { c, w, h, oy: 22 };
  }

  // Hasır piknik sepeti: yarı açık kapak, içinden kırmızı-beyaz kareli bez ve bir elma görünür.
  function sepetCiz() {
    const w = 56, h = 54, c = tuval(w * OB_K, h * OB_K), x = c.getContext('2d');
    x.scale(OB_K, OB_K); x.translate(w / 2, h - 4); x.lineJoin = 'round'; x.lineCap = 'round';
    x.fillStyle = 'rgba(60,40,30,0.25)'; x.beginPath(); x.ellipse(0, 1, 24, 4, 0, 0, PI2); x.fill();
    // sap
    x.strokeStyle = '#9a6234'; x.lineWidth = 3.4; x.beginPath(); x.moveTo(-15, -22); x.bezierCurveTo(-14, -46, 14, -46, 15, -22); x.stroke();
    x.strokeStyle = '#d9a46a'; x.lineWidth = 1.4; x.stroke();
    // bez (sepetin içinden taşar) ve elma
    x.fillStyle = '#fbfbf6'; x.beginPath(); x.moveTo(-19, -21); x.quadraticCurveTo(-8, -33, 2, -25); x.quadraticCurveTo(10, -32, 19, -21); x.closePath(); x.fill();
    x.fillStyle = 'rgba(226,84,96,0.75)'; for (const [px, py] of [[-12, -25], [-4, -28], [6, -27], [13, -24]]) x.fillRect(px - 2, py - 2, 4, 4);
    x.fillStyle = '#e0505e'; x.beginPath(); x.arc(9, -26, 5.2, 0, PI2); x.fill();
    x.fillStyle = 'rgba(255,255,255,0.55)'; x.beginPath(); x.arc(7.4, -27.8, 1.6, 0, PI2); x.fill();
    x.strokeStyle = '#6b4a2a'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(9, -31); x.lineTo(10, -34); x.stroke();
    x.fillStyle = '#7cc36a'; x.beginPath(); x.ellipse(12, -33.5, 2.6, 1.3, -0.4, 0, PI2); x.fill();
    // gövde: hafif genişleyen tekne biçimi, hasır örgü
    const govde = () => { x.beginPath(); x.moveTo(-21, -22); x.lineTo(21, -22); x.lineTo(17, 0); x.quadraticCurveTo(0, 3, -17, 0); x.closePath(); };
    govde(); x.fillStyle = '#c98c50'; x.fill();
    x.save(); govde(); x.clip();
    x.strokeStyle = 'rgba(120,70,30,0.45)'; x.lineWidth = 1.1;
    for (let r = 0; r < 5; r++) {
      const y = -19 + r * 4.4;
      for (let i = -6; i <= 6; i++) { const px = i * 3.6 + (r % 2) * 1.8; x.beginPath(); x.moveTo(px - 1.6, y); x.quadraticCurveTo(px, y + 1.8, px + 1.6, y); x.stroke(); }
    }
    x.fillStyle = 'rgba(255,230,180,0.25)'; x.fillRect(-21, -22, 42, 5);
    x.fillStyle = 'rgba(90,50,20,0.18)'; x.fillRect(8, -22, 14, 26);
    x.restore();
    // ağız kenarı ve yarı açık kapak
    x.fillStyle = '#a8703c'; x.beginPath(); x.ellipse(0, -22, 22, 2.6, 0, 0, PI2); x.fill();
    x.fillStyle = '#d8a066'; x.beginPath(); x.moveTo(-21, -23); x.lineTo(-2, -23); x.lineTo(-6, -34); x.lineTo(-23, -31); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(120,70,30,0.5)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-19, -27); x.lineTo(-5, -28.5); x.stroke();
    // kurdele fiyonk
    x.fillStyle = '#f48fb1'; x.beginPath(); x.moveTo(16, -16); x.lineTo(22, -20); x.lineTo(22, -12); x.closePath(); x.moveTo(16, -16); x.lineTo(10, -20); x.lineTo(10, -12); x.closePath(); x.fill();
    x.fillStyle = '#ffc1d6'; x.beginPath(); x.arc(16, -16, 2, 0, PI2); x.fill();
    OB.sepet = { c, w, h, ox: w / 2, oy: h - 4 };
  }

  // Limonata sürahisi: cam, içinde açık sarı limonata, limon dilimi ve buz; yanında iki bardak ayrı çizilir.
  function surahiCiz() {
    const w = 30, h = 44, c = tuval(w * OB_K, h * OB_K), x = c.getContext('2d');
    x.scale(OB_K, OB_K); x.translate(w / 2, h - 3); x.lineJoin = 'round'; x.lineCap = 'round';
    x.fillStyle = 'rgba(60,40,30,0.18)'; x.beginPath(); x.ellipse(0, 1, 11, 2.4, 0, 0, PI2); x.fill();
    const cam = () => { x.beginPath(); x.moveTo(-7, -34); x.quadraticCurveTo(-8, -26, -10, -18); x.quadraticCurveTo(-12, -4, -9, 0); x.lineTo(9, 0); x.quadraticCurveTo(12, -4, 10, -18); x.quadraticCurveTo(8, -26, 7, -34); x.closePath(); };
    cam(); x.fillStyle = 'rgba(225,245,255,0.55)'; x.fill();
    x.save(); cam(); x.clip();
    x.fillStyle = '#fbe58a'; x.fillRect(-14, -22, 28, 24);
    x.fillStyle = 'rgba(255,250,210,0.8)'; x.fillRect(-14, -22, 28, 2.2);
    x.fillStyle = 'rgba(255,255,255,0.7)'; x.fillRect(-4, -18, 5, 5); x.fillRect(2, -13, 5, 4.5);   // buz
    x.fillStyle = '#f6d23c'; x.beginPath(); x.arc(-3, -8, 5, 0, PI2); x.fill();                      // limon dilimi
    x.strokeStyle = '#fff6c8'; x.lineWidth = 0.8; for (let i = 0; i < 6; i++) { const a = i * PI2 / 6; x.beginPath(); x.moveTo(-3, -8); x.lineTo(-3 + Math.cos(a) * 4.2, -8 + Math.sin(a) * 4.2); x.stroke(); }
    x.restore();
    cam(); x.strokeStyle = 'rgba(150,190,210,0.9)'; x.lineWidth = 1.2; x.stroke();
    x.strokeStyle = 'rgba(150,190,210,0.9)'; x.lineWidth = 2; x.beginPath(); x.moveTo(9, -28); x.quadraticCurveTo(17, -24, 10, -12); x.stroke();   // kulp
    x.strokeStyle = 'rgba(255,255,255,0.85)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(-6, -29); x.quadraticCurveTo(-8, -18, -7, -5); x.stroke();   // parlama
    x.fillStyle = 'rgba(150,190,210,0.9)'; x.beginPath(); x.moveTo(-8, -35); x.lineTo(8, -35); x.lineTo(5, -33); x.lineTo(-11, -33); x.closePath(); x.fill();   // ağız
    OB.surahi = { c, w, h, ox: w / 2, oy: h - 3 };
  }

  // Müzik notası (♪ ve ♫) sprite'ları: pastel renk, beyaz ince kontur, yumuşak ışık hâlesi.
  const NOTA_RENK = ['#ff9fc4', '#9fd8ff', '#ffe08a', '#b9f0c8', '#d6b8ff'];
  function notaCiz() {
    for (let k = 0; k < NOTA_RENK.length * 2; k++) {
      const col = NOTA_RENK[k % NOTA_RENK.length], cift = k >= NOTA_RENK.length;
      const w = 34, h = 40, c = tuval(w * OB_K, h * OB_K), x = c.getContext('2d');
      x.scale(OB_K, OB_K); x.translate(w / 2, h / 2); x.lineJoin = 'round'; x.lineCap = 'round';
      const yol = () => {
        x.beginPath();
        if (!cift) {
          x.ellipse(-3, 9, 6, 4.4, -0.4, 0, PI2);
          x.moveTo(2.6, 8); x.lineTo(2.6, -13); x.quadraticCurveTo(10, -9, 9, -2); x.quadraticCurveTo(8, -6, 2.6, -7);
        } else {
          x.ellipse(-7, 10, 5.4, 4, -0.4, 0, PI2); x.ellipse(7, 7, 5.4, 4, -0.4, 0, PI2);
          x.moveTo(-2.2, 9); x.lineTo(-2.2, -11); x.lineTo(12, -15); x.lineTo(12, 6); x.lineTo(10, 6); x.lineTo(10, -9); x.lineTo(-0.2, -6); x.lineTo(-0.2, 9); x.closePath();
        }
      };
      x.strokeStyle = 'rgba(255,255,255,0.95)'; x.lineWidth = 3.6; yol(); x.stroke();
      x.strokeStyle = col; x.lineWidth = 2.2; yol(); x.stroke(); x.fillStyle = col; x.fill();
      x.fillStyle = 'rgba(255,255,255,0.6)'; x.beginPath(); x.ellipse(cift ? -8.5 : -4.5, cift ? 8.8 : 7.8, 2, 1.2, -0.4, 0, PI2); x.fill();
      OB.nota.push({ c, w, h });
    }
  }

  // Kalp sprite'ları (pembe ve şeftali): parlak üst kenar ve küçük ışık noktası.
  function kalpCiz() {
    for (const [col, acik] of [['#ff7fa8', '#ffc4d8'], ['#ffa07a', '#ffd6bf'], ['#f58fd0', '#ffd0ef']]) {
      const w = 36, h = 34, c = tuval(w * OB_K, h * OB_K), x = c.getContext('2d');
      x.scale(OB_K, OB_K); x.translate(w / 2, h / 2);
      const yol = s => { x.beginPath(); x.moveTo(0, 12 * s); x.bezierCurveTo(-16 * s, 1 * s, -12 * s, -12 * s, 0, -5 * s); x.bezierCurveTo(12 * s, -12 * s, 16 * s, 1 * s, 0, 12 * s); x.closePath(); };
      x.fillStyle = 'rgba(255,255,255,0.9)'; yol(1.12); x.fill();
      x.fillStyle = col; yol(1); x.fill();
      x.fillStyle = acik; x.beginPath(); x.ellipse(-5.5, -4.5, 3.2, 2.2, -0.6, 0, PI2); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.9)'; x.beginPath(); x.arc(-6.5, -5.5, 1.1, 0, PI2); x.fill();
      OB.kalp.push({ c, w, h });
    }
  }

  // Dört köşeli yıldız parıltısı (ilk yıldızlar ve ışıltılar).
  function yildizCiz() {
    const d = 64, c = tuval(d, d), x = c.getContext('2d'), m = d / 2;
    const gr = x.createRadialGradient(m, m, 0, m, m, m);
    gr.addColorStop(0, 'rgba(255,250,225,0.9)'); gr.addColorStop(0.25, 'rgba(255,236,180,0.35)'); gr.addColorStop(1, 'rgba(255,236,180,0)');
    x.fillStyle = gr; x.fillRect(0, 0, d, d);
    x.fillStyle = '#fffbe8'; x.beginPath();
    x.moveTo(m, m - 30); x.quadraticCurveTo(m + 3, m - 3, m + 30, m); x.quadraticCurveTo(m + 3, m + 3, m, m + 30);
    x.quadraticCurveTo(m - 3, m + 3, m - 30, m); x.quadraticCurveTo(m - 3, m - 3, m, m - 30); x.fill();
    OB.yildiz = c;
  }

  // Güneşten yayılan yumuşak ışık huzmeleri (dokuz dilim; dönerek nefes alır).
  function huzmeCiz() {
    const d = 512, c = tuval(d, d), x = c.getContext('2d'), m = d / 2;
    const gr = x.createRadialGradient(m, m, 0, m, m, m);
    gr.addColorStop(0, 'rgba(255,226,160,0.9)'); gr.addColorStop(0.35, 'rgba(255,200,130,0.35)'); gr.addColorStop(1, 'rgba(255,190,120,0)');
    x.fillStyle = gr;
    for (let i = 0; i < 9; i++) {
      const a = i * PI2 / 9 + (i % 2) * 0.12, gen = 0.09 + (i % 3) * 0.035;
      x.beginPath(); x.moveTo(m, m); x.arc(m, m, m, a - gen, a + gen); x.closePath(); x.fill();
    }
    OB.huzme = c;
  }

  // Akşam: gök laciverde döner, ufuk pembe-mor kalır. Dikey degrade bir kez çizilir, ekrana gerilerek basılır.
  function aksamCiz() {
    const c = tuval(4, 256), x = c.getContext('2d'), gr = x.createLinearGradient(0, 0, 0, 256);
    gr.addColorStop(0, 'rgba(28,30,92,0.78)'); gr.addColorStop(0.45, 'rgba(70,52,128,0.5)'); gr.addColorStop(0.72, 'rgba(150,80,130,0.28)'); gr.addColorStop(1, 'rgba(46,30,70,0.42)');
    x.fillStyle = gr; x.fillRect(0, 0, 4, 256);
    OB.aksam = c;
  }

  let obHazir = false;
  function onbellek() {
    if (obHazir) return; obHazir = true;
    ortuCiz(); sepetCiz(); surahiCiz(); notaCiz(); kalpCiz(); yildizCiz(); huzmeCiz(); aksamCiz();
  }

  // Sprite'ı dünya biriminde, kökeni (ox, oy) olacak biçimde çiz
  function spr(S0, x, y, ox, oy, sc) {
    sc = sc || 1;
    g.drawImage(S0.c, x - ox * sc, y - oy * sc, S0.c.width / OB_K * sc, S0.c.height / OB_K * sc);
  }

  // ════════════════ parçacık havuzları (yükleme anında bir kez ayrılır) ════════════════
  const havuz = n => { const a = []; for (let i = 0; i < n; i++) a.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, t: 0, omur: 1, k: 0, s: 1, ph: 0 }); return a; };
  const NOTALAR = havuz(18), KALPLER = havuz(14), KURABIYE = havuz(4), KABARCIK = havuz(14);
  function al(dizi) { for (let i = 0; i < dizi.length; i++) if (!dizi[i].on) return dizi[i]; return null; }
  function parcaAdim(dizi, dt, yercekimi) {
    for (let i = 0; i < dizi.length; i++) {
      const p = dizi[i]; if (!p.on) continue;
      p.t += dt; if (p.t >= p.omur) { p.on = false; continue; }
      p.vy += yercekimi * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function notaAt(x, y, yon) {
    const p = al(NOTALAR); if (!p) return;
    p.on = true; p.x = x; p.y = y; p.vx = yon * (14 + Math.random() * 22); p.vy = -48 - Math.random() * 22;
    p.t = 0; p.omur = 2.4 + Math.random() * 0.8; p.k = (Math.random() * OB.nota.length) | 0; p.s = 0.75 + Math.random() * 0.35; p.ph = Math.random() * PI2;
  }
  function kalpAt(x, y, buyuk) {
    const p = al(KALPLER); if (!p) return;
    p.on = true; p.x = x; p.y = y; p.vx = (Math.random() - 0.5) * 30; p.vy = -40 - Math.random() * 25;
    p.t = 0; p.omur = 2.2 + Math.random() * 0.7; p.k = (Math.random() * OB.kalp.length) | 0; p.s = (buyuk ? 0.85 : 0.6) + Math.random() * 0.3; p.ph = Math.random() * PI2;
  }

  // ════════════════ yardımcı çizimler (karede degrade yok) ════════════════
  function kurabiye(x, y, r, don) {   // tereyağlı kurabiye: altın kenar, çikolata damlaları
    g.save(); g.translate(x, y); g.rotate(don || 0);
    g.fillStyle = '#c98a44'; g.beginPath(); g.arc(0, 0, r, 0, PI2); g.fill();
    g.fillStyle = '#e8b86a'; g.beginPath(); g.arc(-r * 0.12, -r * 0.12, r * 0.82, 0, PI2); g.fill();
    g.fillStyle = '#6a3d22';
    g.beginPath(); g.arc(r * 0.3, -r * 0.2, r * 0.17, 0, PI2); g.arc(-r * 0.35, r * 0.15, r * 0.15, 0, PI2); g.arc(r * 0.05, r * 0.4, r * 0.13, 0, PI2); g.arc(-r * 0.15, -r * 0.45, r * 0.12, 0, PI2); g.fill();
    g.restore();
  }
  function tabakCiz(x, y, n, tm) {   // beyaz tabak + üstüne yığılmış kurabiyeler
    g.fillStyle = 'rgba(80,60,70,0.18)'; g.beginPath(); g.ellipse(x, y + 1.5, 17, 3.4, 0, 0, PI2); g.fill();
    g.fillStyle = '#e9eef2'; g.beginPath(); g.ellipse(x, y, 17, 4.6, 0, 0, PI2); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y - 0.6, 13, 3.2, 0, 0, PI2); g.fill();
    g.strokeStyle = '#9fc8e6'; g.lineWidth = 0.8; g.beginPath(); g.ellipse(x, y - 0.3, 15, 3.9, 0, 0, PI2); g.stroke();
    const YIG = [[-6, -3], [6, -3], [0, -4], [-3, -8], [4, -8], [0, -12], [-7, -6], [7, -6]];
    for (let i = 0; i < Math.min(n, YIG.length); i++) kurabiye(x + YIG[i][0], y + YIG[i][1], 5.2, i * 0.7);
  }
  function bardakCiz(x, y, dolu, sal) {   // küçük cam bardak (limonata), çizgili pipet
    g.save(); g.translate(x, y); g.rotate(sal || 0);
    g.fillStyle = 'rgba(60,40,30,0.15)'; g.beginPath(); g.ellipse(0, 0.8, 6, 1.5, 0, 0, PI2); g.fill();
    g.fillStyle = 'rgba(225,245,255,0.6)'; g.beginPath(); g.moveTo(-5, -15); g.lineTo(5, -15); g.lineTo(4, 0); g.lineTo(-4, 0); g.closePath(); g.fill();
    g.fillStyle = '#fbe58a'; g.beginPath(); g.moveTo(-4.6, -15 + 15 * (1 - dolu)); g.lineTo(4.6, -15 + 15 * (1 - dolu)); g.lineTo(4, 0); g.lineTo(-4, 0); g.closePath(); g.fill();
    g.strokeStyle = '#f48fb1'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(1, -6); g.lineTo(4, -21); g.lineTo(7, -22); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(-3.4, -13); g.lineTo(-2.8, -2); g.stroke();
    g.strokeStyle = 'rgba(150,190,210,0.9)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-5, -15); g.lineTo(-4, 0); g.lineTo(4, 0); g.lineTo(5, -15); g.stroke();
    g.restore();
  }
  function ucurtmaYerde(x, y, tm) {   // gündüzün uçurtması çimende uzanıyor; kurdeleleri esintiyle kıpırdar
    g.save(); g.translate(x, y - 6);
    g.strokeStyle = 'rgba(255,250,235,0.9)'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(-14, 2);
    for (let i = 1; i <= 6; i++) g.lineTo(-14 - i * 7, 3 + Math.sin(tm * 2.4 + i) * 2.2);
    g.stroke();
    const KUR = ['#ffd36b', '#8fd6f0', '#c7a6ff'];
    for (let i = 0; i < 3; i++) { const px = -22 - i * 12, py = 3 + Math.sin(tm * 2.4 + i * 2 + 1) * 2.2; g.fillStyle = KUR[i]; g.beginPath(); g.ellipse(px, py, 3.6, 1.7, 0.4, 0, PI2); g.fill(); }
    g.rotate(-0.12);
    g.fillStyle = 'rgba(60,40,60,0.18)'; g.beginPath(); g.ellipse(2, 6, 20, 3, 0, 0, PI2); g.fill();
    g.fillStyle = '#ff8fab'; g.beginPath(); g.moveTo(-14, 0); g.lineTo(0, -6); g.lineTo(20, 0); g.lineTo(0, 5); g.closePath(); g.fill();
    g.fillStyle = '#ffd36b'; g.beginPath(); g.moveTo(0, -6); g.lineTo(20, 0); g.lineTo(0, 0); g.closePath(); g.fill();
    g.fillStyle = '#8fd6f0'; g.beginPath(); g.moveTo(-14, 0); g.lineTo(0, 5); g.lineTo(0, 0); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-14, 0); g.lineTo(20, 0); g.moveTo(0, -6); g.lineTo(0, 5); g.stroke();
    g.restore();
  }

  // ════════════════ karakter bağdaştırıcıları ════════════════
  // Anne: ANNE12.devral varsa biz çizeriz; yoksa (eski anne12) anne kendi yürüyüşünde kalır ve burada çizilmez.
  const AOPT = { poz: 'dur', yon: 1, bak: 0, hiz: 0, u: 1, otur: false, katman: null };
  function anneBizde(o) { return !!o.anneBizde && typeof anne12Ciz === 'function'; }
  function anneCiz(o, tm, katman) {
    if (!anneBizde(o)) return;
    AOPT.katman = katman;
    try { anne12Ciz(g, o.ax, o.ay, 1, tm, AOPT); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('final12.anne', e); }
    AOPT.katman = null;
  }
  // Feza: oturana kadar feza.js'in kendi duruşu (normal fizik, kontrol kapalı: P.kilit); oturunca P.ucus = o ve FEZA12'nin
  // pozları — 'otur' {yon, bak, sallan, salla} piknik örtüsünde bağdaş, 'saril' {u, yon} ayağa kalkıp anneye sarılma.
  // fezaPoz12 yoksa (FEZA12 yüklenemediyse) burada fezaCizPoz yedeğiyle çizeriz. Opt nesneleri her kare aynıdır (çöp yok).
  const FO_OTUR = { yon: 1, u: 0, bak: 0, sallan: 0, salla: 0, sevinc: 0 }, FO_SARIL = { yon: 1, u: 0 };
  let fezaPozAd = null;
  function fezaPozVer(ad) {
    fezaPozAd = ad;
    if (typeof fezaPoz12 !== 'function') return;
    try { fezaPoz12(ad, ad === 'saril' ? FO_SARIL : ad === 'otur' ? FO_OTUR : undefined); }
    catch (e) { if (typeof omHataBildir === 'function') omHataBildir('final12.fezaPoz12', e); }
  }
  function fezaYedekCiz(o, tm) {
    if (typeof fezaPoz12 === 'function' || typeof fezaCizPoz !== 'function' || P.ucus !== o) return;
    g.save(); g.translate(o.fx, o.fy); if (o.fyon < 0) g.scale(-1, 1);
    if (fezaPozAd === 'saril') fezaCizPoz(g, 0, 0, 1, 'kucak9', tm, null, { u: FO_SARIL.u });
    else fezaCizPoz(g, 0, 0, 1, 'binis', tm, null, {});
    g.restore();
  }
  // Pırıl: yolda yandan uçar ('ucus', yönü aynalanır); müzikte önden dans eder ('dans9'), sarılmada kollarını kavuşturur
  // ('kucak9'). Önden pozlar piril.js'te B12'de de açık; takla ve dans salınımı dönüşümle verilir.
  function pirilCiz(o, tm) {
    if (typeof pirilCizPoz !== 'function') return;
    const onden = o.ppoz !== 'ucus' && o.takla < 0, sx = onden ? 1 : (o.pyon < 0 ? -1 : 1), ez = o.ezil;
    g.save(); g.translate(o.px, o.py); g.rotate(o.pdon); g.scale(sx * (1 + ez * 0.06), 1 - ez * 0.06);
    try { pirilCizPoz(g, 0, 0, 1, onden ? o.ppoz : 'ucus', tm, o.ppoz === 'kucak9' ? PU : undefined); }
    catch (e) { if (typeof omHataBildir === 'function') omHataBildir('final12.piril', e); }
    g.restore();
  }
  const PU = { u: 0 };

  // ════════════════ akış ════════════════
  function ortuX(o) { return o.x + ORTU_DX; }

  function basla(o) {
    if (aktif || o.faz || P.ucus || DURUM !== 'oyun' || !P.ground) return;
    onbellek();
    o.faz = 1; o.t = 0; o.yt = 0; aktif = o;
    if (typeof V12 !== 'undefined' && V12) V12.final = true;
    K12FINAL.aktif = true; K12FINAL.faz = 'yavasla';
    // önce Feza kendi yürüyüşüyle yavaşlayıp dursun (kontrol kapalı), sonra sahne başlasın
    P.kilit = Math.max(P.kilit || 0, 2); P.buf = 0;
    if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  }

  function sahneyiKur(o) {
    o.faz = 2; o.t = 0;
    o.fx = P.x; o.fy = P.y; P.vx = P.vy = 0;
    const bx = ortuX(o);
    // anne Feza'nın hangi yanındaysa o yanına oturur (genelde solunda, arkasından gelmiştir)
    const ax0 = typeof ANNE12 !== 'undefined' && ANNE12 && Number.isFinite(ANNE12.x) ? ANNE12.x : o.fx - 110;
    const ay0 = typeof ANNE12 !== 'undefined' && ANNE12 && Number.isFinite(ANNE12.y) ? ANNE12.y : o.fy;
    let yan = ax0 <= o.fx ? -1 : 1;
    let as = clamp(o.fx + yan * ANNE_ARA, bx - ORTU_YARI + 20, bx + ORTU_YARI - 20);
    if (Math.abs(as - o.fx) < 50) { yan = -yan; as = clamp(o.fx + yan * ANNE_ARA, bx - ORTU_YARI + 20, bx + ORTU_YARI - 20); }
    o.yan = yan; o.as = as; o.ax0 = ax0; o.ax = ax0; o.ay = ay0; o.ayon = as >= ax0 ? 1 : -1;
    o.anneBizde = false;
    if (typeof ANNE12 !== 'undefined' && ANNE12 && typeof ANNE12.devral === 'function') {
      try { ANNE12.devral('final'); o.anneBizde = true; } catch (e) { o.anneBizde = false; }
    }
    // zaman çizelgesi: annenin yürüyüşüne göre
    const yol = Math.abs(as - ax0), hiz = Math.max(ANNE_HIZ, yol / 3);
    o.zYuru = yol < 8 ? 0 : yol / hiz;
    o.zOtur = o.zYuru;                         // anne oturmaya başlar
    o.zCagir = o.zOtur + SURE_OTUR + 0.35;     // anne Feza'yı çağırır
    o.zFotur = o.zCagir + SURE_CAGIR;          // Feza döner ve oturur
    o.zDans = o.zFotur + SURE_OTUR + 0.5;      // Pırıl'ın müzik anı
    o.zSaril = o.zDans + SURE_DANS;            // sarılma
    o.zAksam = o.zSaril + 1.2;                 // gün kararmaya başlar
    o.zBitti = o.zSaril + SURE_SARIL;          // kampusFinalBitti
    o.anlar = { otur: false, cagir: false, oturdu: false, dans: false, saril: false, yildiz: false };
    o.pdon = 0; o.ezil = 0; o.ppoz = 'ucus'; o.takla = -1; o.taklaYon = 1; o.notaT = 0; o.kalpT = 0;
    o.fyon = P.f < 0 ? -1 : 1;
    o.kurabiye = 3; o.limon = 0;
    o.adim = () => { if (P.ucus !== o) return; P.x = o.fx; P.y = o.fy; P.vx = P.vy = 0; P.ground = true; P.f = o.fyon; };
    OLAY.emit('k12FinalBasla', { o, sure: o.zBitti + SON_PAY });
  }
  // Feza oturacağı an kontrol finale geçer (o ana dek kendi duruşuyla, kontrolü kapalı ayakta bekler)
  function kontrolAl(o) {
    o.fx = P.x; o.fy = P.y;
    o.px = Number.isFinite(D.x) ? D.x : o.fx - 50; o.py = Number.isFinite(D.y) ? D.y : o.fy - 100;   // Pırıl bulunduğu yerden süzülür
    o.pvx = o.pvy = 0; o.pyon = (D.f || 1) < 0 ? -1 : 1;
    P.ucus = o; P.vx = P.vy = 0; P.ground = true; P.kilit = 0;
  }

  function an(o, ad) { if (o.anlar[ad]) return; o.anlar[ad] = true; OLAY.emit('k12FinalAn', { an: ad, o }); }

  // Kamera: anne + Feza + Pırıl ve üstlerinde biraz gök (akşam olunca yıldızlar için biraz daha)
  function kameraKutu(o) {
    const x0 = Math.min(o.ax, o.fx), x1 = Math.max(o.ax, o.fx);
    omDkEkle(x0 - 120, o.fy - 250 - 70 * K12FINAL.aksam, x1 + 120, o.fy + 36);
    omDkEkle(o.px - 40, o.py - 40, o.px + 40, o.py + 30);
  }

  // Pırıl'ın yolu: çağrıda annenin başının üstünde tur, dansta ikisinin arasında ritimle salınma (bir kez kendiliğinden takla),
  // sarılmada üstlerinde kollarını kavuşturup süzülme. Yaylı (kritik sönümlü) takip: sıçrama yok.
  function pirilAdim(o, t, dt) {
    const orta = (o.as + o.fx) / 2;
    let tx, ty;
    if (t < o.zDans) { tx = orta + Math.sin(t * 1.3) * 18; ty = o.fy - 128 + Math.sin(t * 2.1) * 6; }   // Feza oturunca aralarına süzülür
    else if (t < o.zSaril) {   // dans: ikisinin arasında ritimle salınır, iki kez sağa sola döner, bir kez kendiliğinden takla
      const d = t - o.zDans;
      tx = orta + Math.sin(d * Math.PI * 0.5) * 34; ty = o.fy - 138 - Math.abs(Math.sin(d * Math.PI * 2)) * 14;
      if (o.takla < 0 && d > 3.6 && d < 3.7) { o.takla = 0; o.taklaYon = o.pyon; }
    } else { tx = orta + Math.sin(t * 0.9) * 14; ty = o.fy - 128 + Math.sin(t * 1.8) * 5; }
    const kk = 16, sn = 2 * Math.sqrt(kk);
    o.pvx += (kk * (tx - o.px) - sn * o.pvx) * dt; o.pvy += (kk * (ty - o.py) - sn * o.pvy) * dt;
    o.px += o.pvx * dt; o.py += o.pvy * dt;
    if (Math.abs(o.pvx) > 18) o.pyon = o.pvx > 0 ? 1 : -1;
    else if (t >= o.zSaril || (t > o.zDans && Math.abs(o.pvx) < 6)) o.pyon = o.fx > o.px ? 1 : -1;
    o.ppoz = t > o.zDans && t < o.zSaril ? 'dans9' : t >= o.zSaril + 0.4 ? 'kucak9' : 'ucus';
    PU.u = arasi(t, o.zSaril + 0.4, o.zSaril + 1.4);
    // dans: vuruşta hafif ezilip uzama; takla: tam dönüş
    o.ezil = t > o.zDans && t < o.zSaril ? Math.sin((t - o.zDans) * Math.PI * 4) * 0.5 : 0;
    if (o.takla >= 0) {
      o.takla += dt; const u = ke(o.takla / 0.85);
      o.pdon = -o.taklaYon * yum(u) * PI2;
      if (u >= 1) { o.takla = -1; o.pdon = 0; }
    } else o.pdon = t > o.zDans && t < o.zSaril ? Math.sin((t - o.zDans) * Math.PI) * 0.16 : Math.sin(t * 1.3) * 0.05;
    D.x = o.px; D.y = o.py;   // oyunun Pırıl'ı da aynı yerde kalsın (finalden sonra sıçramasın)
  }

  function guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, 0.05);
    if (!o.faz) {
      const bx = ortuX(o);
      // Feza örtüye basınca (soldan ya da sağdan) başlar; örtünün yanında durup beklerse de (1.2 sn) başlar
      if (DURUM !== 'oyun' || !P.ground || P.ucus) { o.bekle = 0; return; }
      if (P.x > bx - 38 && P.x < bx + 110) { basla(o); return; }
      o.bekle = Math.abs(P.x - bx) < ORTU_YARI + 30 && Math.abs(P.vx) < 6 ? (o.bekle || 0) + dt : 0;
      if (o.bekle > 1.2) basla(o);
      return;
    }
    if (DURUM !== 'oyun' && DURUM !== 'final') return;
    if (o.faz === 1) {   // yavaşlama: kendi yürüyüşüyle durur
      o.yt += dt; P.kilit = Math.max(P.kilit || 0, 0.5);
      if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
      if ((Math.abs(P.vx) < 12 && P.ground) || o.yt > 0.9) sahneyiKur(o);
      return;
    }
    if (P.ucus && P.ucus !== o) return;   // (olmamalı) başka bir biniş sürüyorsa bekle
    o.t += dt;
    const t = o.t;
    K12FINAL.t = t;

    // ── anne: örtüye yürür, oturur, Feza'yı çağırır, müzikte alkışlar, sonra dizlerinin üstüne kalkıp sımsıkı sarılır ──
    const yuz = o.fx >= o.as ? 1 : -1;   // oturunca Feza'ya bakar
    AOPT.hiz = 0; AOPT.bak = 0; AOPT.u = 1; AOPT.otur = true;
    if (t < o.zOtur) {
      const u = o.zYuru > 0 ? yum(t / o.zYuru) : 1, eski = o.ax;
      o.ax = lerp(o.ax0, o.as, u);
      AOPT.poz = 'yuru'; AOPT.yon = o.ayon; AOPT.hiz = Math.abs(o.ax - eski) / dt; AOPT.otur = false;
      K12FINAL.faz = 'anne_gelir';
    } else if (t < o.zCagir) {
      o.ax = o.as; AOPT.poz = 'otur'; AOPT.yon = yuz; AOPT.bak = 1;
      an(o, 'otur'); K12FINAL.faz = 'anne_oturur';
    } else if (t < o.zFotur + SURE_OTUR) {
      o.ax = o.as; AOPT.poz = 'cagir'; AOPT.yon = yuz; AOPT.bak = 1;   // "Gel bakalım yanıma": eliyle örtüye hafifçe vurur
      an(o, 'cagir'); K12FINAL.faz = 'cagir';
    } else if (t < o.zSaril) {
      o.ax = o.as; AOPT.poz = 'alkis'; AOPT.yon = yuz; AOPT.bak = Math.sin(t * 0.9) > 0.3 ? 1 : -0.6;   // alkışlar; bir Pırıl'a bir Feza'ya bakar
      K12FINAL.faz = 'dans';
    } else {
      // Feza ayağa kalkıp kollarını açarken anne dizlerinin üstüne kalkıp ona doğru kayar ve sımsıkı sarılır
      // (Feza annenin önünde: anne.x + 28·yön; FEZA12'nin 'saril' hedefi diz çökmüş annenin boynu)
      const k = arasi(t, o.zSaril, o.zSaril + 0.9);
      o.ax = lerp(o.as, o.fx - SARIL_ARA * yuz, k);
      AOPT.poz = 'saril'; AOPT.otur = false; AOPT.yon = yuz; AOPT.bak = 1; AOPT.u = arasi(t, o.zSaril + 0.3, o.zSaril + 1.8);
      K12FINAL.faz = 'saril';
    }
    if (o.anneBizde && typeof ANNE12 !== 'undefined' && ANNE12) { ANNE12.x = o.ax; ANNE12.y = o.ay; ANNE12.yon = AOPT.yon; }

    // ── Feza: anne çağırana dek ayakta (kendi duruşu, kontrol kapalı); çağrıda annesine döner, oturur, sonra sarılır ──
    if (P.ucus !== o) {
      P.kilit = Math.max(P.kilit || 0, 0.5); P.buf = 0;
      if (typeof omHepsiniBirak === 'function') omHepsiniBirak();   // parmak basılı kalsa da yürümesin
      if (t > o.zCagir + 0.45) P.f = o.fyon = o.as < P.x ? -1 : 1;  // "Gel bakalım!" → annesine döner
      if (t >= o.zFotur && P.ground) kontrolAl(o);
    }
    if (P.ucus === o) {
      o.fyon = o.as < o.fx ? -1 : 1;
      if (t < o.zSaril) {
        FO_OTUR.yon = o.fyon;
        FO_OTUR.sallan = arasi(t, o.zDans, o.zDans + 1) * (1 - arasi(t, o.zSaril - 0.6, o.zSaril));
        FO_OTUR.u = arasi(t, o.zFotur, o.zFotur + SURE_OTUR);                       // ayaktan çömelip bağdaş kurar
        FO_OTUR.bak = -0.5 * FO_OTUR.sallan;                                         // dansta Pırıl'a bakar
        FO_OTUR.sevinc = FO_OTUR.sallan * (0.35 + 0.35 * Math.max(0, Math.sin((t - o.zDans) * Math.PI)));   // ritimle kolları kalkar
        fezaPozVer('otur'); an(o, 'oturdu');
      } else {
        FO_SARIL.yon = o.fyon; FO_SARIL.u = arasi(t, o.zSaril, o.zSaril + 1.8);
        fezaPozVer('saril');
      }
      P.f = o.fyon;
    }

    // ── gök: altın saat → akşam ──
    K12FINAL.altin = arasi(t, 0, o.zDans + 3);
    K12FINAL.aksam = arasi(t, o.zAksam, o.zAksam + 5.5);
    K12FINAL.yakin = 1 + 0.18 * arasi(t, o.zSaril, o.zSaril + 2.5) - 0.08 * K12FINAL.aksam;

    // ── Pırıl (Feza oturunca bizde; öncesinde piril.js'in kendi uçuşu) ──
    if (P.ucus === o) pirilAdim(o, t, dt);
    
    // ── müzik notaları (dans) ve kalpler (sarılma) ──
    if (t > o.zDans && t < o.zSaril + 0.5) {
      an(o, 'dans');
      o.notaT -= dt;
      if (o.notaT <= 0) { o.notaT = 0.3; notaAt(o.px + (Math.random() - 0.5) * 24, o.py - 10, Math.random() < 0.5 ? -1 : 1); }
    }
    if (t > o.zSaril + 0.6) {
      an(o, 'saril');
      o.kalpT -= dt;
      if (o.kalpT <= 0) {   // kalpler başlarının üstünden yükselir (yüzlerini örtmesin)
        o.kalpT = 0.5; const yan = Math.random() < 0.5 ? -1 : 1;
        kalpAt((o.ax + o.fx) / 2 + yan * (22 + Math.random() * 26), o.fy - 118 - Math.random() * 14, true);
      }
    }
    if (t > o.zAksam + 1.6) an(o, 'yildiz');
    parcaAdim(NOTALAR, dt, -6); parcaAdim(KALPLER, dt, -4); parcaAdim(KURABIYE, dt, 520); parcaAdim(KABARCIK, dt, -30);
    // uçan kurabiye tabağa konunca tabakta bir tane artar
    for (let i = 0; i < KURABIYE.length; i++) {
      const p = KURABIYE[i];
      if (p.on && p.t > 0.25 && p.vy > 0 && p.y >= p.ph) { p.on = false; o.kurabiye = Math.min(8, o.kurabiye + 1); if (typeof burst === 'function') burst(p.x, p.y - 4, 6, ['#ffe08a', '#e8b86a', '#ffffff'], 60, 0.6, 4); }
    }
    if (o.limon > 0) o.limon = Math.max(0, o.limon - dt);

    // ── kamera ──
    if (typeof omDikkat === 'function' && typeof omDkEkle === 'function') omDikkat('k12Final', 1.5, o.kameraFn, 1, 0.62);

    // ── son ──
    if (t >= o.zBitti && o.faz === 2) {
      o.faz = 3; o.done = true; K12FINAL.faz = 'bitti';
      OLAY.emit('kampusFinalBitti', { o });
    }
  }

  // ════════════════ çizim ════════════════
  // Örtü ve üstündekiler her zaman (Feza yaklaşırken de) görünür; sahne başlayınca ışık, anne ve arka plan efektleri.
  function ciz(o, tm) {
    onbellek();
    const bx = ortuX(o), y = o.y;
    const sahne = o.faz >= 2;
    // güneş huzmeleri ve altın ışık (gökte, karakterlerin arkasında; ekran pikseli)
    if (sahne) gunIsigi(o, tm);
    spr(OB.ortu, bx, y, OB.ortu.w / 2, OB.ortu.oy);
    ucurtmaYerde(bx + YER.ucurtma[0], y + YER.ucurtma[1], tm);
    spr(OB.sepet, bx + YER.sepet[0], y + YER.sepet[1], OB.sepet.ox, OB.sepet.oy);
    spr(OB.surahi, bx + YER.surahi[0], y + YER.surahi[1], OB.surahi.ox, OB.surahi.oy);
    const sal = o.limon > 0 ? Math.sin(o.limon * 30) * 0.12 * o.limon : 0;
    bardakCiz(bx + YER.bardak1[0], y + YER.bardak1[1], 0.7, -sal);
    bardakCiz(bx + YER.bardak2[0], y + YER.bardak2[1], 0.55, sal);
    tabakCiz(bx + YER.tabak[0], y + YER.tabak[1], o.faz ? o.kurabiye : 3, tm);
    if (!sahne) return;
    // anne (sarılmada yakın kolu hariç; yakın kol cizOn'da Feza'nın önünde)
    anneCiz(o, tm, AOPT.poz === 'saril' ? 'arka' : null);
    fezaYedekCiz(o, tm);
  }

  function cizOn(o, tm) {
    if (o.faz < 2) return;
    if (AOPT.poz === 'saril') anneCiz(o, tm, 'on');
    // uçan kurabiyeler ve limonata kabarcıkları
    for (let i = 0; i < KURABIYE.length; i++) { const p = KURABIYE[i]; if (p.on) kurabiye(p.x, p.y, 5.4, p.t * 9); }
    for (let i = 0; i < KABARCIK.length; i++) {
      const p = KABARCIK[i]; if (!p.on) continue;
      const u = p.t / p.omur; g.globalAlpha = 0.8 * (1 - u); g.strokeStyle = '#ffffff'; g.lineWidth = 0.9;
      g.beginPath(); g.arc(p.x + Math.sin(p.t * 6 + p.ph) * 2, p.y, p.s, 0, PI2); g.stroke(); g.globalAlpha = 1;
    }
    aksamCizim(o, tm);
    // ikisinin üstünde sıcak bir ışık (akşam karardıkça belirginleşir: sanki gün ışığı onlarda kalmış)
    const cx = (o.ax + o.fx) / 2, A = K12FINAL.aksam, sar = arasi(o.t, o.zSaril, o.zSaril + 1.5);
    g.globalCompositeOperation = 'lighter';
    dglow('#ffd2a0', cx, o.fy - 50, 150 + 20 * Math.sin(tm * 1.6), 0.12 * sar + 0.16 * A);
    // ışık zerreleri: sarılınca ikisinin çevresinden yavaşça yükselir
    if (sar > 0) {
      for (let i = 0; i < 16; i++) {
        const r1 = ((i * 0.618) % 1), u = (tm * (0.11 + 0.05 * r1) + r1) % 1;
        const px = cx + (r1 - 0.5) * 220 + Math.sin(tm * 0.8 + i * 1.7) * 12, py = o.fy - 10 - u * 230;
        const al = sar * Math.sin(u * Math.PI) * (0.55 + 0.45 * Math.sin(tm * 2.3 + i));
        dglow(i % 3 ? '#ffe8b0' : '#ffc4d8', px, py, 8 + 5 * r1, al * 0.8);
        dglow('#ffffff', px, py, 2.4, al);
      }
    }
    g.globalCompositeOperation = 'source-over';
    if (P.ucus === o) pirilCiz(o, tm);
    // müzik notaları
    for (let i = 0; i < NOTALAR.length; i++) {
      const p = NOTALAR[i]; if (!p.on) continue;
      const u = p.t / p.omur, al = Math.min(1, p.t * 4) * (1 - yum((u - 0.6) / 0.4)), S0 = OB.nota[p.k];
      g.save(); g.globalAlpha = al; g.translate(p.x + Math.sin(p.t * 3 + p.ph) * 9, p.y); g.rotate(Math.sin(p.t * 2.4 + p.ph) * 0.3);
      const sc = p.s * (0.6 + 0.4 * yum(p.t * 3)) * 0.7;
      g.drawImage(S0.c, -S0.w / 2 * sc, -S0.h / 2 * sc, S0.w * sc, S0.h * sc); g.restore();
    }
    // kalpler
    for (let i = 0; i < KALPLER.length; i++) {
      const p = KALPLER[i]; if (!p.on) continue;
      const u = p.t / p.omur, al = Math.min(1, p.t * 5) * (1 - yum((u - 0.55) / 0.45)), S0 = OB.kalp[p.k];
      const pop = 1 + 0.25 * Math.sin(Math.min(1, p.t * 3) * Math.PI), sc = p.s * pop * 0.7;
      g.save(); g.globalAlpha = al; g.translate(p.x + Math.sin(p.t * 2.2 + p.ph) * 8, p.y); g.rotate(Math.sin(p.t * 1.8 + p.ph) * 0.2);
      g.drawImage(S0.c, -S0.w / 2 * sc, -S0.h / 2 * sc, S0.w * sc, S0.h * sc); g.restore();
    }
  }

  // Güneş: ARKA'nın güneşinin yerinden (DN12.gunesX / dn12GunesXY) yumuşak huzmeler ve altın hâle. Ekran pikseli.
  function gunesYeri(out) {
    if (typeof dn12GunesXY === 'function') { try { const q = dn12GunesXY(); if (q && Number.isFinite(q.x) && Number.isFinite(q.y)) { out.x = q.x; out.y = q.y; return out; } } catch (e) { /* yedek */ } }
    const gx = typeof DN12 !== 'undefined' && DN12 && Number.isFinite(DN12.gunesX) ? DN12.gunesX : 0.2;
    out.x = gx * W; out.y = H * 0.34;   // resimli gökte ufuk ekranın üçte biri civarında
    return out;
  }
  const GY = { x: 0, y: 0 };
  function gunIsigi(o, tm) {
    const A = K12FINAL.altin, K = K12FINAL.aksam, guc = A * (1 - K * 0.8);
    if (guc <= 0.01) return;
    gunesYeri(GY);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
    // huzmeler yalnız gökte (zemine ve çimene düşmesin)
    const yer = (o.y - 24 - cam.y) * S;
    g.beginPath(); g.rect(0, 0, W, Math.max(0, yer)); g.clip();
    const R = Math.max(W, H) * 0.8;
    g.globalAlpha = 0.11 * guc * (0.85 + 0.15 * Math.sin(tm * 0.9));
    g.translate(GY.x, GY.y); g.rotate(tm * 0.03);
    g.drawImage(OB.huzme, -R, -R, R * 2, R * 2);
    g.setTransform(1, 0, 0, 1, 0, 0);
    dglow('#ffcf8a', GY.x, GY.y, Math.min(W, H) * 0.55, 0.22 * guc);
    dglow('#fff0c8', GY.x, GY.y, Math.min(W, H) * 0.14, 0.35 * guc);
    g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
  }

  // Akşam kararması (ARKA gökte kendi kararmasını yapıyorsa yarı güçte) ve ilk yıldızlar. Ekran pikseli.
  const YILDIZLAR = (() => { const r = rng(1287), a = []; for (let i = 0; i < 22; i++) a.push([0.04 + r() * 0.92, 0.03 + r() * 0.24, 0.5 + r() * 0.7, r() * PI2, r()]); a.sort((p, q) => p[4] - q[4]); return a; })();
  function aksamCizim(o, tm) {
    const K = K12FINAL.aksam;
    if (K <= 0.005) return;
    const guc = typeof DN12_AKSAM !== 'undefined' && DN12_AKSAM ? 0.45 : 1;
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = K * 0.9 * guc; g.drawImage(OB.aksam, 0, 0, W, H);
    g.globalAlpha = 1; g.globalCompositeOperation = 'lighter';
    // yıldızlar birer birer: önce en parlak, sonra diğerleri
    const ys = Math.min(W, H) * 0.016;
    for (let i = 0; i < YILDIZLAR.length; i++) {
      const q = YILDIZLAR[i], gor = ke((o.t - o.zAksam - 1.4 - i * 0.22) / 0.6);
      if (gor <= 0) break;
      const tw = 0.7 + 0.3 * Math.sin(tm * (1.5 + q[2]) + q[3]), r = ys * q[2] * (i === 0 ? 1.8 : 1) * (0.6 + 0.4 * gor);
      g.globalAlpha = gor * tw * K;
      g.drawImage(OB.yildiz, q[0] * W - r, q[1] * H - r, r * 2, r * 2);
    }
    g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S);
  }

  // ════════════════ dokunma: küçük sevimli tepkiler (sahneyi değiştirmez) ════════════════
  function dokun(e) {
    const o = aktif;
    if (!o || o.faz < 2 || DURUM !== 'oyun' || typeof cam === 'undefined') return;
    const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
    const bx = ortuX(o), y = o.y;
    let vurdu = false;
    if (P.ucus === o && Math.hypot(wx - o.px, wy - o.py) < 48) {   // Pırıl: takla
      if (o.takla < 0) { o.takla = 0; o.taklaYon = wx < o.px ? -1 : 1; }
      if (typeof burst === 'function') burst(o.px, o.py, 10, ['#ffe08a', '#c9b2ff', '#9ff0c8', '#ffffff'], 110, 0.8, 5);
      OLAY.emit('k12FinalAn', { an: 'takla', o }); vurdu = true;
    } else if (Math.abs(wx - (bx + YER.sepet[0])) < 34 && wy > y - 60 && wy < y + 20) {   // sepet: kurabiye tabağa uçar
      const p = al(KURABIYE);
      if (p) {
        const sx = bx + YER.sepet[0] - 4, sy = y - 34, hx = bx + YER.tabak[0] + (Math.random() - 0.5) * 8, hy = y + YER.tabak[1] - 6, tt = 0.75;
        p.on = true; p.x = sx; p.y = sy; p.t = 0; p.omur = 2; p.vx = (hx - sx) / tt; p.vy = (hy - sy) / tt - 0.5 * 520 * tt; p.ph = hy;
      }
      OLAY.emit('k12FinalAn', { an: 'kurabiye', o }); vurdu = true;
    } else if (Math.abs(wx - (bx + YER.surahi[0])) < 36 && wy > y - 50 && wy < y + 20) {   // limonata: bardaklar tokuşur, kabarcıklar
      o.limon = 1;
      for (let i = 0; i < 6; i++) {
        const p = al(KABARCIK); if (!p) break;
        p.on = true; p.x = bx + YER.surahi[0] + (Math.random() - 0.5) * 14; p.y = y - 14 - Math.random() * 8;
        p.vx = 0; p.vy = -20 - Math.random() * 20; p.t = 0; p.omur = 1 + Math.random() * 0.6; p.s = 1.2 + Math.random() * 1.4; p.ph = Math.random() * 6;
      }
      OLAY.emit('k12FinalAn', { an: 'limonata', o }); vurdu = true;
    } else kalpAt(wx, wy, false);   // başka yere: minik kalp (dokunuşu yutmaz)
    if (vurdu) { e.preventDefault(); e.stopPropagation(); }
  }
  addEventListener('pointerdown', dokun, true);
  // sabah sahnesi bitince (sonuç kartı) Feza'nın final pozunu kapat
  OLAY.on('durum', d => { if (d === 'son' && aktif && typeof fezaPoz12 === 'function') { try { fezaPoz12(null); } catch (e) { /* önemsiz */ } } });

  // ════════════════ tür kaydı ════════════════
  TUR.kaydet('k12Final', {
    kur(o) {
      o.faz = 0; o.t = 0; o.done = false; o.kurabiye = 3; o.limon = 0;
      o.fx = o.x; o.fy = o.y; o.ax = o.x - 80; o.ay = o.y; o.as = o.ax; o.px = o.x; o.py = o.y - 120; o.yan = -1;
      o.kameraFn = () => kameraKutu(o);
    },
    guncelle,
    ciz,
    cizOn,
    testBitir(o) { if (!o.faz) basla(o); if (o.faz === 1) sahneyiKur(o); if (o.faz === 2) o.t = Math.max(o.t, o.zBitti - 0.01); }
  });
})();
