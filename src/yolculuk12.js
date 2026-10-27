/* yolculuk12.js — Bölüm 12 binişleri (k12Binis): Feza kendi aracında, anne kendi bisikletinde ARKADAN gelir.
   Haritada iki biniş var (bolum12.js): 'yol1' mavi kick scooter (sütun 66→296), 'yol2' Feza'nın küçük bisikleti (562→660).
   Akış (hiç kesinti, kararma, ışınlanma, panel yok):
     · park: araçlar bisiklet parkında (ONPLAN'ın rafının önünde) durur; Feza'nın aracı nx(c)+60, annenin bisikleti nx(c)-60.
     · biniş: Feza aracın yanına yürüyünce DURMADAN biner (0.7 sn, fezaPoz12 'binis_in'); anne bisikletine yürür, biner
       (ANNE12.devral + anne12Ciz 'bisiklet_bin'). Basılı parmak bırakılmaz: Feza basılı tutuyorsa hemen hızlanır.
     · sürüş: P.ucus = o; ekrana basılı tut = hızlan, bırak = yavaşça süzül ve dur (asla geri gitmez). Scooter'da ayak itişi
       hıza bağlı (yerde kaymaz), bisiklette krank tekerle orantılı döner, süzülürken krank durur (serbest dişli).
       Anne ~110–170 birim geride yumuşak yetişir, Feza'yı asla geçmez.
     · yol sürprizleri (hepsi isteğe bağlı): zil (Feza'ya ya da annenin bisikletine dokun), sabun köpükleri, uçuşan çiçek
       yaprakları, ışıklı halkalar.
     · iniş: parka yaklaşınca kendiliğinden yavaşlar, durur, Feza aracın yanında ayakta kalır (P.x sıçramaz); anne de
       bisikletinden iner ve ANNE12.birak ile yürüyüşüne döner. Araçlar varış parkında kalır.
   Ölçüler: FEZA12_ARAC (fezapoz12.js) ve ANNE12_BISIKLET (anne12.js); yoksa aşağıdaki yedek değerler. Köken (0,0) = aracın
   yere değdiği orta nokta, +x ileri, -y yukarı. Binişte P.x, P.y = Feza'nın aracının kökeni.
   Olaylar: k12BinisBasla/Bitti, k12BinisAdim, k12Zil, k12ScooterIt, k12Surpriz. Durum: V12.binis = ad | null.
   Ses yok (MUZIK olayları dinler). Dışa açık: YOL12 (hiz, arac, pedal, test). */
'use strict';

const YOL12 = (() => {
  const TAU = Math.PI * 2;

  // ── ölçüler (sahipleri kendi dosyalarında tanımlarsa onlarınki geçerli) ──
  const YEDEK_ANNE = { sele: [-16, -72], gidon: [28, -92], pedal: [-2, -21], krank: 13, teker: 25, arkaTeker: [-46, -25], onTeker: [46, -25] };
  const YEDEK_FEZA = {
    scooter: { ayak: [-3, -4], gidon: [20, -44], itYer: [5, -10] },
    bisiklet: { sele: [-8, -24], gidon: [15, -41], pedal: [-1, -10], krank: 5 }
  };
  // Feza'nın araçlarının tekerlekleri (yalnız bu dosyanın)
  const SCOOTER_TEKER = { r: 6.8, arka: [-24, -6.8], on: [26, -6.8] };
  const KUCUK_TEKER = { r: 12, arka: [-24, -12], on: [25, -12], destekR: 5 };
  function anneOlcu() { return typeof ANNE12_BISIKLET !== 'undefined' && ANNE12_BISIKLET && ANNE12_BISIKLET.sele ? ANNE12_BISIKLET : YEDEK_ANNE; }
  function fezaOlcu(arac) {
    const F = typeof FEZA12_ARAC !== 'undefined' && FEZA12_ARAC ? FEZA12_ARAC : null;
    return F && F[arac] && (F[arac].gidon) ? F[arac] : YEDEK_FEZA[arac];
  }
  // FEZA12 hazırsa Feza'yı drawFeza çizer (fezaPoz12 ile); değilse burada yedek çizim
  function fezaHazir() { return typeof fezaPoz12 === 'function' && typeof FEZA12_ARAC !== 'undefined'; }
  function kaskDestek() { return fezaHazir(); }   // FEZA12 kaskı başın üstüne çiziyor
  function anneVar() { return typeof ANNE12 !== 'undefined' && ANNE12 && typeof ANNE12.devral === 'function' && typeof anne12Ciz === 'function'; }

  // ── sürüş ayarları (dünya birimi / sn) ──
  const AYAR = {
    scooter: { vMax: 280, itIvme: 1400, surt: 12, surtK: 0.05 },
    bisiklet: { vMax: 300, pedalIvme: 250, surt: 12, surtK: 0.05 }   // yol2 göletin yokuşu: uzun süzülür
  };
  const BINIS_SURE = 0.7, INIS_SURE = 0.65, ANNE_BIN_SURE = 0.8, ANNE_IN_SURE = 0.7;
  const ANNE_ARA = 158, ANNE_VMAX = 400;   // en az ara araçların boyundan hesaplanır (anneAdim)
  const FREN = 150;            // varışta yumuşak yavaşlama ivmesi
  const KASK_RENK = '#7cc8ee';

  // ── renk takımları ──
  const RENK_ANNE = {
    nane: { kadro: '#7fcfc0', kenar: '#4f9e93', isik: '#c9f3ea', camur: '#f6efdf', camurK: '#cfc3a8', sele: '#8a5a3c', seleI: '#b07a55' },
    kampus: { kadro: '#4f8fd8', kenar: '#2f5f9e', isik: '#bfe0ff', camur: '#f4f6f8', camurK: '#b9c4cf', sele: '#3e4552', seleI: '#5f6878' }
  };
  const PARILTI = ['#ffe9a8', '#ffc4dd', '#bff3e6', '#c9e2ff', '#ffffff'];
  const LED = ['#ff8fc8', '#7fe6ff', '#ffe27a'];

  // ── yumuşak ışık lekeleri: bir kez hazırlanır (karede gradyan yok) ──
  const PARLAK = {};
  function parlak(renk) {
    let c = PARLAK[renk];
    if (c) return c;
    c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, renk); gr.addColorStop(0.35, renk + 'aa'); gr.addColorStop(1, renk + '00');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    PARLAK[renk] = c; return c;
  }
  function lekeCiz(c, renk, x, y, r, a) { if (a <= 0.01) return; c.globalAlpha = a; c.drawImage(parlak(renk), x - r, y - r, r * 2, r * 2); }

  // ── küçük çizim yardımcıları (tur 2: sade, temiz, kalın konturlu şekiller) ──
  const KONTUR = '#2a3149';
  function oval(c, x, y, rx, ry, renk, aci) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y, rx, ry, aci || 0, 0, TAU); c.fill(); }
  // Konturlu boru: önce koyu kontur, sonra ana renk, ortada ince ışık (path çağırandan önce kurulmuş olmalı)
  function boruBoya(c, w, ana, isik, kw) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = KONTUR; c.lineWidth = w + 2 * (kw === undefined ? 1.3 : kw); c.stroke();
    c.strokeStyle = ana; c.lineWidth = w; c.stroke();
    if (isik) { const a = c.globalAlpha; c.globalAlpha = a * 0.55; c.strokeStyle = isik; c.lineWidth = w * 0.3; c.stroke(); c.globalAlpha = a; }
  }
  // Konturlu dolgu (path kurulmuş olmalı)
  function dolguBoya(c, renk, kw) {
    c.fillStyle = renk; c.fill();
    c.strokeStyle = KONTUR; c.lineWidth = kw === undefined ? 1.2 : kw; c.lineJoin = 'round'; c.stroke();
  }
  function cizgi(c, x1, y1, x2, y2) { c.moveTo(x1, y1); c.lineTo(x2, y2); }

  // Yumuşak yer gölgesi: bir kez hazırlanan bulanık leke, elips gibi gerilir
  let golgeTuval = null;
  function golge(c, x, y, rx, a) {
    if (!golgeTuval) {
      golgeTuval = document.createElement('canvas'); golgeTuval.width = golgeTuval.height = 64;
      const x2 = golgeTuval.getContext('2d'), gr = x2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(28,38,32,1)'); gr.addColorStop(0.55, 'rgba(28,38,32,.55)'); gr.addColorStop(1, 'rgba(28,38,32,0)');
      x2.fillStyle = gr; x2.fillRect(0, 0, 64, 64);
    }
    c.globalAlpha = a; c.drawImage(golgeTuval, x - rx * 1.1, y - 6, rx * 2.2, 13); c.globalAlpha = 1;
  }

  // Sade tekerlek: kalın koyu lastik, açık jant, okunur ama ince teller; hızlıyken teller saydamlaşıp bulanık disk olur
  function tekerlek(c, cx, cy, r, aci, w, stil) {
    const bul = clamp((Math.abs(w) - 8) / 14, 0, 1), t = r * 0.2;
    // bulanık disk (hız hissi)
    if (bul > 0) { c.globalAlpha = 0.13 * bul; oval(c, cx, cy, r - t, r - t, stil.tel || '#e8eef2'); c.globalAlpha = 1; }
    // teller (düz, göbekten janta)
    const n = stil.tel_n || 10, gr = r * 0.13, jr = r - t - r * 0.05;
    c.globalAlpha = 0.85 * (1 - 0.6 * bul);
    c.beginPath();
    for (let i = 0; i < n; i++) { const a = aci + i * TAU / n; c.moveTo(cx + Math.cos(a) * gr, cy + Math.sin(a) * gr); c.lineTo(cx + Math.cos(a) * jr, cy + Math.sin(a) * jr); }
    c.strokeStyle = stil.tel || '#c8d0d8'; c.lineWidth = Math.max(0.5, r * 0.035); c.lineCap = 'round'; c.stroke();
    c.globalAlpha = 1;
    // jant
    c.beginPath(); c.arc(cx, cy, jr, 0, TAU); c.strokeStyle = stil.jant || '#dfe5ec'; c.lineWidth = Math.max(1, r * 0.075); c.stroke();
    // lastik (kontur içinde)
    c.beginPath(); c.arc(cx, cy, r - t / 2, 0, TAU); c.strokeStyle = KONTUR; c.lineWidth = t + 1.6; c.stroke();
    c.strokeStyle = stil.lastik || '#3a4154'; c.lineWidth = t; c.stroke();
    if (stil.beyazYan) { c.beginPath(); c.arc(cx, cy, r - t * 0.78, 0, TAU); c.strokeStyle = '#f4f1ea'; c.lineWidth = t * 0.28; c.stroke(); }
    c.beginPath(); c.arc(cx, cy, r - t * 0.35, -2.5, -1.3); c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = t * 0.3; c.stroke();
    // supap (dönüşü okunur kılar) + göbek
    oval(c, cx + Math.cos(aci) * jr, cy + Math.sin(aci) * jr, r * 0.055, r * 0.055, '#f2c94c');
    c.beginPath(); c.arc(cx, cy, gr * 1.2, 0, TAU); dolguBoya(c, stil.gobek || '#a9b3bd', 0.9);
    oval(c, cx - gr * 0.35, cy - gr * 0.35, gr * 0.4, gr * 0.4, 'rgba(255,255,255,.75)');
  }
  // Çamurluk: teker üstünde konturlu yay
  function camurluk(c, cx, cy, r, a0, a1, renk) {
    c.beginPath(); c.arc(cx, cy, r, a0, a1);
    boruBoya(c, Math.max(2.2, r * 0.12), renk, 'rgba(255,255,255,.9)', 1);
  }
  // Okunur zincir: aynadan arka dişliye kapalı halka; baklalar krankla birlikte akar
  function zincir(c, B, ar, R, cr, krank) {
    c.beginPath();
    c.moveTo(B[0], B[1] - ar); c.lineTo(R[0], R[1] - cr);
    c.arc(R[0], R[1], cr, -Math.PI / 2, Math.PI / 2, true);
    c.lineTo(B[0], B[1] + ar);
    c.arc(B[0], B[1], ar, Math.PI / 2, -Math.PI / 2, true);
    c.strokeStyle = KONTUR; c.lineWidth = 2.2; c.stroke();
    c.setLineDash([1.3, 1.1]); c.lineDashOffset = -krank * ar;
    c.strokeStyle = '#a7b0ba'; c.lineWidth = 1; c.stroke();
    c.setLineDash([]); c.lineDashOffset = 0;
  }
  // Aynalı dişli: krankla döner (beş kollu yıldız)
  function ayna(c, B, ar, krank, renk) {
    c.beginPath(); c.arc(B[0], B[1], ar * 0.92, 0, TAU); dolguBoya(c, renk || '#cdd5dc', 1);
    c.save(); c.translate(B[0], B[1]); c.rotate(krank);
    c.beginPath(); for (let i = 0; i < 5; i++) { const a = i * TAU / 5; cizgi(c, 0, 0, Math.cos(a) * ar * 0.75, Math.sin(a) * ar * 0.75); }
    c.strokeStyle = '#8f99a3'; c.lineWidth = Math.max(0.8, ar * 0.16); c.lineCap = 'round'; c.stroke(); c.restore();
  }
  // Krank kolu + pedal (krank merkezi bx,by; açı a); uzak taraf koyu
  function pedalKol(c, bx, by, kr, a, uzak) {
    const px = bx + Math.cos(a) * kr, py = by + Math.sin(a) * kr;
    c.beginPath(); cizgi(c, bx, by, px, py);
    boruBoya(c, Math.max(1.5, kr * 0.2), uzak ? '#7a838d' : '#cfd6dd', null, 0.9);
    c.beginPath(); c.roundRect(px - kr * 0.42, py - kr * 0.13, kr * 0.84, kr * 0.26, kr * 0.12);
    dolguBoya(c, uzak ? '#454b57' : '#3c4250', 0.8);
    oval(c, bx, by, kr * 0.2, kr * 0.2, '#e3e8ec');
  }
  // Zil: gidon üstünde küçük kubbe; z 0..1 çalarken titrer
  function zilCiz(c, x, y, s, z, tm) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(tm * 46) * 0.35 * z); c.scale(s, s);
    c.beginPath(); c.moveTo(-3.4, 0.4); c.quadraticCurveTo(-3.4, -3.6, 0, -3.8); c.quadraticCurveTo(3.4, -3.6, 3.4, 0.4); c.closePath();
    dolguBoya(c, '#f5cf4e', 1);
    oval(c, -1.2, -2.2, 1, 0.7, 'rgba(255,255,255,.85)');
    c.restore();
  }

  // ── yol pürüzü: ön ve arka tekere ayrı yay; derzlerde minik tık ──
  function yayKur() { return { yo: 0, vo: 0, ya: 0, va: 0, derzO: 0, derzA: 0, s: 0 }; }
  function yayAdim(y, dt, xOn, xArka, v) {
    const k = 900, d = 22, amp = 38 * clamp(v / 240, 0, 1);
    const dO = Math.floor(xOn / 160), dA = Math.floor(xArka / 160);
    if (dO !== y.derzO) { y.derzO = dO; y.vo -= amp; }
    if (dA !== y.derzA) { y.derzA = dA; y.va -= amp * 0.9; }
    y.vo += (-k * y.yo - d * y.vo) * dt; y.yo += y.vo * dt;
    y.va += (-k * y.ya - d * y.va) * dt; y.ya += y.va * dt;
    y.s += v * dt;
  }
  function yayBob(y, v) { return (y.yo + y.ya) * 0.5 + Math.sin(y.s * 0.29) * 0.22 * clamp(v / 200, 0, 1); }
  function yayEgim(y, aks) { return clamp((y.yo - y.ya) / aks, -0.02, 0.02); }

  // ── ortak parçacık havuzları (yükleme anında bir kez; karede new yok) ──
  const KIV = [];      // kıvılcım / nota / toz
  for (let i = 0; i < 90; i++) KIV.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, t: 0, omur: 1, r: 3, renk: '#fff', tur: 0 });
  function kivilcim(x, y, vx, vy, omur, r, renk, tur) {
    for (let i = 0; i < KIV.length; i++) {
      const p = KIV[i]; if (p.on) continue;
      p.on = true; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.omur = omur; p.r = r; p.renk = renk; p.tur = tur || 0;
      return p;
    }
    return null;
  }
  function patlat(x, y, n, hiz, renkler) {
    for (let i = 0; i < n; i++) {
      const a = i * TAU / n + Math.random() * 0.5, s = hiz * (0.6 + Math.random() * 0.5);
      kivilcim(x, y, Math.cos(a) * s, Math.sin(a) * s - 20, 0.6 + Math.random() * 0.4, 2.5 + Math.random() * 2.5, renkler[i % renkler.length], 0);
    }
  }
  function kivAdim(dt) {
    for (let i = 0; i < KIV.length; i++) {
      const p = KIV[i]; if (!p.on) continue;
      p.t += dt; if (p.t >= p.omur) { p.on = false; continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.tur === 1) { p.vy -= 10 * dt; p.vx *= 1 - dt * 0.8; }            // nota: süzülerek yükselir
      else if (p.tur === 2) { p.vx *= 1 - dt * 3; p.vy *= 1 - dt * 3; p.vy -= 12 * dt; }   // toz
      else { p.vy += 60 * dt; p.vx *= 1 - dt * 1.5; }
    }
  }
  function yildiz4(c, x, y, r) {
    c.beginPath(); c.moveTo(x, y - r);
    c.quadraticCurveTo(x + r * 0.2, y - r * 0.2, x + r, y); c.quadraticCurveTo(x + r * 0.2, y + r * 0.2, x, y + r);
    c.quadraticCurveTo(x - r * 0.2, y + r * 0.2, x - r, y); c.quadraticCurveTo(x - r * 0.2, y - r * 0.2, x, y - r); c.fill();
  }
  function notaCiz(c, x, y, r) {
    oval(c, x, y, r, r * 0.75, c.fillStyle, -0.4);
    c.fillRect(x + r * 0.75, y - r * 3, r * 0.32, r * 3);
    c.beginPath(); c.moveTo(x + r * 1.05, y - r * 3); c.quadraticCurveTo(x + r * 2.4, y - r * 2.4, x + r * 1.9, y - r * 1.3);
    c.lineWidth = r * 0.35; c.strokeStyle = c.fillStyle; c.stroke();
  }
  function kivCiz(c) {
    for (let i = 0; i < KIV.length; i++) {
      const p = KIV[i]; if (!p.on) continue;
      const u = p.t / p.omur, a = u < 0.15 ? u / 0.15 : 1 - smooth((u - 0.15) / 0.85);
      if (p.x < cam.x - 60 || p.x > cam.x + VW + 60) continue;
      c.globalAlpha = a; c.fillStyle = p.renk;
      if (p.tur === 1) notaCiz(c, p.x, p.y, p.r);
      else if (p.tur === 2) oval(c, p.x, p.y, p.r * (1 + u * 1.5), p.r * (0.7 + u), p.renk);
      else yildiz4(c, p.x, p.y, p.r * (1 - u * 0.4));
    }
    c.globalAlpha = 1;
  }

  // sabun köpükleri, çiçek yaprakları
  const KOPUK = [];
  for (let i = 0; i < 26; i++) KOPUK.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, r: 10, faz: 0, t: 0, pat: -1, ad: '' });
  const YAPRAK = [];
  for (let i = 0; i < 40; i++) YAPRAK.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, don: 0, vd: 0, cev: 0, vc: 0, t: 0, r: 4, renk: '#fff', on2: false });
  const YAPRAK_RENK = ['#ffd3e2', '#ffc0d6', '#fff2f6', '#ffe0ea', '#f8b4cc'];

  // ── durum ──
  let aktif = null;            // P.ucus olan biniş
  const binisler = [];         // tüm k12Binis nesneleri (dokunma için)
  let sonDt = 1 / 60;

  function yol(o) { return o.yk; }
  function arac(o) { return o.arac === 'bisiklet' ? 'bisiklet' : 'scooter'; }

  // ── kurulum ──
  function kur(o) {
    o.done = false;
    if (!Number.isFinite(o.x0)) o.x0 = o.x;
    if (!Number.isFinite(o.x1)) o.x1 = o.x0 + 120 * T;
    const cBas = Math.round(o.x0 / T - 0.5) - 2, cSon = Math.round(o.x1 / T - 0.5);
    const zemin = o.y;
    const k = o.yk = {
      faz: 'park', t: 0, arac: arac(o), zemin,
      parkBas: nx(cBas), parkSon: nx(cSon),
      x: nx(cBas) + 60, v: 0, ivme: 0, teker: 0, w: 0, krank: 0, krankW: 0, pedal: false,
      it: 0, itAktif: false, itYerde: false, birIt: 0, basOnce: false, binBob: 0, nese: 0, salla: 0, bakGeri: 0,
      selam: { durum: 0, t: 0, x: 0 }, yokus0: 0, yokus1: 0, yokusta: false, egim: 0, yay: yayKur(), zil: 0, zilT: 0, ayak: 0, bekle: 0,
      renk: o.ad === 'yol2' ? RENK_ANNE.kampus : RENK_ANNE.nane,
      anne: { faz: 'park', x: nx(cBas) - 60, bx: nx(cBas) - 60, ax: 0, v: 0, t: 0, teker: 0, w: 0, krank: 0, krankW: 0, pedal: false,
        egim: 0, yay: yayKur(), zil: 0, zilBekle: -1, yon: 1, ilkZil: false },
      piril: { x: 0, y: 0, vx: 0, vy: 0, sevinc: 0 },
      surpriz: [], halka: [],
      poz: { u: 0, arac: arac(o), it: 0, krank: 0, hiz: 0, egim: 0, kask: KASK_RENK, salla: 0, nese: 0, bakGeri: 0 },
      anneOpt: { poz: 'bisiklet', u: 0, krank: 0, egim: 0, hiz: 0, bak: 0.2, yon: 1, zil: 0, salla: 0, nese: 0, egil: 0, katman: undefined, golge: undefined }
    };
    o.x = k.x;
    // yol1: yolun ortasında anne yanaşır, el sallaşırlar · yol2: göletin yokuşu (pedal durur, keyifle süzülürler)
    k.selam.x = o.ad === 'yol1' ? k.parkBas + (k.parkSon - k.parkBas) * 0.5 : Infinity;
    if (o.ad === 'yol2') { k.yokus0 = k.parkBas + (k.parkSon - k.parkBas) * 0.32; k.yokus1 = k.parkBas + (k.parkSon - k.parkBas) * 0.76; }
    // Yol sürprizleri: rotanın kesirlerine dağıtılır (kısa yol2'de daha az)
    const L = k.parkSon - k.parkBas;
    const plan = o.ad === 'yol2'
      ? [['kopuk', 0.22], ['halka', 0.42], ['yaprak', 0.58], ['halka', 0.78]]
      : [['kopuk', 0.12], ['halka', 0.22], ['yaprak', 0.32], ['halka', 0.45], ['kopuk', 0.55], ['yaprak', 0.68], ['halka', 0.78], ['kopuk', 0.88]];
    let hi = 0;
    for (const [tur, f] of plan) {
      const sx = k.parkBas + L * f;
      k.surpriz.push({ tur, x: sx, oldu: false });
      if (tur === 'halka') {
        const yuksek = hi % 2 === 1;   // her ikinci üçlüde ortadaki halka yukarıda (dokununca da alınır)
        for (let j = 0; j < 3; j++) k.halka.push({ x: sx + j * 95, y: zemin - 54 - (yuksek && j === 1 ? 70 : j === 1 ? 10 : 0), i: j, al: -1, faz: j * 1.7 + hi });
        hi++;
      }
    }
    o.adim = (dt, u) => adim(o, dt, u);
    if (binisler.indexOf(o) < 0) binisler.push(o);
  }

  // ── biniş başlangıcı (Feza aracın kökenine yürüdü) ──
  function basla(o) {
    const k = yol(o);
    if (aktif || P.ucus) return;
    aktif = o; k.faz = 'binis'; k.t = 0;
    // araç Feza'nın ayağına birkaç birim kayar (görünmez); P.x sıçramaz. Nesneler ara-kare (çizim) konumunda güncellenir:
    // fiziğin gerçek konumunu al ki bir sonraki fizik adımında Feza geri kaymasın
    k.x = typeof omSimX !== 'undefined' && Number.isFinite(omSimX) && Math.abs(omSimX - P.x) < 40 ? omSimX : P.x;
    k.v = 0; k.it = 0; k.itAktif = false; k.krankW = 0; k.ayak = 0; k.bekle = 0;
    k.yay.derzO = Math.floor((k.x + 30) / 160); k.yay.derzA = Math.floor((k.x - 30) / 160);
    o.x = k.x;
    P.ucus = o; P.vx = P.vy = 0; P.f = 1; P.ground = true; P.buf = 0;
    // Pırıl bulunduğu yerden süzülerek Feza'nın yanına gelir
    const pr = k.piril;
    pr.x = typeof D !== 'undefined' && Number.isFinite(D.x) ? D.x : P.x - 70; pr.y = typeof D !== 'undefined' && Number.isFinite(D.y) ? D.y : P.y - 120;
    pr.vx = pr.vy = 0; pr.sevinc = 0;
    // anne: kendi bisikletine yürür
    const a = k.anne;
    if (anneVar() && a.faz === 'park') {
      // anne hâlâ başka bir binişteyse (ör. o binişin inişi bitmeden buraya gelindiyse) onu orada park ettir
      const once = ANNE12.sahip;
      if (once && once !== o && once.yk && once.yk.anne.faz !== 'bitti') { const b = once.yk.anne; b.faz = 'bitti'; b.v = 0; b.bx = b.x; }
      try { ANNE12.devral(o); } catch (e) { omHataBildir('ANNE12.devral', e); }
      a.faz = 'yuru'; a.t = 0; a.ax = Number.isFinite(ANNE12.x) ? ANNE12.x : k.x - 120; a.v = 0;
      // anne çok uzaktaysa (ekran dışında; ör. test ışınlaması) bisikletinin biraz gerisinden yürüyerek gelsin
      if (Math.abs(a.ax - (a.bx - 22)) > 500) a.ax = a.bx - 22 - 60;
    }
    if (typeof V12 !== 'undefined' && V12) V12.binis = o.ad;
    OLAY.emit('k12BinisBasla', { ad: o.ad, o, arac: k.arac });
  }

  // ── Feza'nın sürüş adımı (oyun.js stepPlayer'dan, 120 Hz) ──
  function adim(o, dt, u) {
    const k = yol(o);
    if (P.ucus !== o || !(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, 0.05);
    k.t += dt;
    const A = AYAR[k.arac];
    const bas = !!(u && (u.basili || u.eksenX > 0));
    const fren = !!(u && !u.basili && u.eksenX < 0);
    const kalan = k.parkSon + 60 - k.x;            // varış noktasına kalan
    const v0 = k.v;
    if (k.faz === 'binis') {
      const w = clamp(k.t / BINIS_SURE, 0, 1);
      k.poz.u = smooth(w);
      if (k.t >= BINIS_SURE * 0.55 && !k.ayak) { k.ayak = 1; OLAY.emit('k12BinisAdim', { ad: o.ad, o, arac: k.arac, faz: 'bin', kim: 'feza' }); }
      if (k.t >= BINIS_SURE) { k.faz = 'surus'; k.t = 0; }
    } else if (k.faz === 'surus') {
      let ivme = 0;
      if (k.arac === 'scooter') {
        // itme döngüsü: 0–.25 ayak iner, .25–.65 yerde iter (ayak yerde kaymaz), .65–1 tablaya döner.
        // Basılı tutuldukça ritim hiç kesilmez: hıza göre 1.1–1.6 itiş/sn, en yüksek hızda da iter (hızı itişlerle korur:
        // itişler arasında sürtünmeyle hafif yavaşlar, itişte hafif hızlanır). Bırakınca bir itiş daha yapıp süzülmeye geçer.
        const SC = fezaOlcu('scooter'), L = Math.max(8, SC.itYer[0] - SC.itYer[1]);
        if (bas) k.birIt = 1;
        else if (k.basOnce) k.birIt = k.itAktif && k.it > 0.5 ? 1 : 0;   // az önce bırakıldı: itiş geçtiyse bir itiş daha, değilse bu itiş son
        k.basOnce = bas;
        if (!k.itAktif && k.birIt > 0 && kalan > 300) { k.itAktif = true; k.it = 0; if (!bas) k.birIt = 0; }
        if (k.itAktif) {
          const sik = lerp(1.1, 1.6, clamp(k.v / A.vMax, 0, 1));            // itiş/sn
          const tYer = clamp(L / Math.max(1, k.v), 0.07, 0.35);               // ayağın yerde kalma süresi (yerde kaymaz)
          const tHava = Math.max(0.25, 1 / sik - tYer);                        // iniş + dönüş süresi
          if (k.it < 0.25) k.it += dt * 0.25 / (tHava * 0.42);
          else if (k.it < 0.65) {
            if (!k.itYerde) { k.itYerde = true; OLAY.emit('k12ScooterIt', { ad: o.ad, o, arac: k.arac }); toz(k.x + SC.itYer[0], k.zemin); }
            k.it += Math.max(0.4 * k.v * dt / L, 0.4 * dt / 0.35);
            // kazanç: bir döngüde sürtünmeyle kaybedilen + en yüksek hıza doğru pay
            const kayip = (A.surt + A.surtK * k.v) * (tYer + tHava), pay = Math.max(0, A.vMax - k.v) * 0.45;
            ivme += Math.min(A.itIvme, (kayip + pay) / tYer);
          } else { k.itYerde = false; k.it += dt * 0.35 / (tHava * 0.58); }
          if (k.it >= 1) { k.it = 0; k.itAktif = false; k.itYerde = false; }
        }
      } else if (bas && kalan > 220) {
        ivme += A.pedalIvme * (1 - k.v / A.vMax) + 15;
      }
      // göletin yokuşu: yerçekimi gibi hafif ivme, pedal durur (süzülme), yüz çok mutlu
      const yokusOnce = k.yokusta;
      k.yokusta = k.x > k.yokus0 && k.x < k.yokus1;
      if (k.yokusta && !yokusOnce) OLAY.emit('k12Surpriz', { ad: o.ad, o, tur: 'yokus', x: k.x, y: k.zemin });
      if (k.yokusta && k.v < A.vMax * 1.15) ivme += 85;
      if (k.yokusta && k.arac === 'scooter') { k.birIt = 0; }
      k.pedal = k.arac === 'bisiklet' && bas && kalan > 220 && !k.yokusta;
      // sürtünme (süzülme), fren
      if (!(k.arac === 'scooter' && k.itYerde) && !k.pedal) ivme -= A.surt + A.surtK * k.v;
      if (fren) ivme -= 280;
      k.v = Math.max(0, Math.min(A.vMax * (k.yokusta ? 1.15 : 1), k.v + ivme * dt));
      if (!k.yokusta && k.v > A.vMax) k.v = Math.max(A.vMax, k.v - 40 * dt);   // yokuştan sonra yavaşça normale
      if (k.v < 6 && !bas && !(k.itAktif)) k.v = 0;
      // varış: hıza göre yumuşak yavaşlama; son 420 birimde parmak olmasa da parka kadar süzülür
      if (kalan < 420) {
        const lim = Math.sqrt(2 * FREN * Math.max(0, kalan));
        if (k.v > lim) k.v = Math.max(lim, k.v - 420 * dt);
        if (k.v < Math.min(70, lim) && kalan > 1) k.v = Math.max(k.v, Math.min(70, Math.max(16, lim)));
      }
      k.x += k.v * dt;
      if (k.x >= k.parkSon + 60 - 0.5) { k.x = k.parkSon + 60; k.v = 0; k.faz = 'inis'; k.t = 0; k.ayak = 0; k.itAktif = false; k.it = 0; }
    } else if (k.faz === 'inis') {
      const w = clamp(k.t / INIS_SURE, 0, 1);
      k.poz.u = 1 - smooth(w);
      if (k.t >= INIS_SURE * 0.5 && !k.ayak) { k.ayak = 1; OLAY.emit('k12BinisAdim', { ad: o.ad, o, arac: k.arac, faz: 'in', kim: 'feza' }); }
      if (k.t >= INIS_SURE) { bitir(o); return; }
    }
    k.ivme = lerp(k.ivme, (k.v - v0) / dt, 1 - Math.exp(-dt * 6));
    // tekerlek, krank, gövde
    const TK = k.arac === 'bisiklet' ? KUCUK_TEKER : SCOOTER_TEKER;
    k.w = k.v / TK.r; k.teker += k.w * dt;
    if (k.arac === 'bisiklet') krankAdim(k, dt, TK.r, 2.2, 4.2);
    yayAdim(k.yay, dt, k.x + TK.on[0], k.x + TK.arka[0], k.v);
    const egimHedef = clamp(k.ivme / 2600, -0.05, 0.1) + (bas && k.faz === 'surus' ? 0.03 : 0) + (k.yokusta ? 0.04 : 0);
    k.egim = lerp(k.egim, egimHedef, 1 - Math.exp(-dt * 4));
    // binici sallantısı: bisiklette her pedal basışında hafif iniş, scooter'da itişte hafif çömelme (araç sallanmaz)
    let bb = 0;
    if (k.arac === 'bisiklet') bb = 0.45 * (1 - Math.cos(2 * k.krank)) * clamp(k.krankW / 6, 0, 1);
    else if (k.itYerde) bb = 0.9 * Math.sin(Math.PI * clamp((k.it - 0.25) / 0.4, 0, 1));
    k.binBob = lerp(k.binBob, bb, 1 - Math.exp(-dt * 16));
    k.nese = lerp(k.nese, k.yokusta ? 1 : 0, 1 - Math.exp(-dt * 2.5));
    selamAdim(o, k, dt);
    // Feza
    P.x = k.x; P.y = k.zemin + yayBob(k.yay, k.v) + k.binBob; P.vx = k.v; P.vy = 0; P.ground = true; P.f = 1;
    o.x = k.x;
    pozYaz(k);
  }
  // yol1 selamlaşması (~4 sn): anne yanaşır (yine arkada), zilini çalar; Feza zille cevap verip ona el sallar, anne de sallar;
  // sonra anne yine arkaya düşer. Feza durmuşsa/yavaşsa bekler; olmazsa da yol devam eder.
  function selamAdim(o, k, dt) {
    const s = k.selam;
    if (s.durum === 0) {
      if (k.faz === 'surus' && k.x > s.x && k.v > 140 && k.anne.faz === 'sur') { s.durum = 1; s.t = 0; OLAY.emit('k12Surpriz', { ad: o.ad, o, tur: 'selam', x: k.x, y: k.zemin }); }
      return;
    }
    if (s.durum !== 1) { k.salla = 0; k.bakGeri = 0; k.yanas = 0; return; }
    s.t += dt;
    const t = s.t, ac = (t0, t1) => smooth(clamp((t - t0) / (t1 - t0), 0, 1));
    if (t >= 1.0 && t - dt < 1.0) zilCal(o, 'anne', true);
    if (t >= 1.45 && t - dt < 1.45) zilCal(o, 'feza', true);
    k.salla = ac(1.6, 2.0) * (1 - ac(3.3, 3.8));
    k.yanas = ac(0, 1.1) * (1 - ac(3.4, 4.6));
    k.bakGeri = ac(1.2, 1.7) * (1 - ac(3.4, 3.9));
    if (t > 4.6 || k.faz !== 'surus') { s.durum = 2; k.salla = 0; k.bakGeri = 0; }
  }
  // Krank: pedal çevrilirken tekerle orantılı (en az bir ritimle); süzülürken yavaşlar, pedallar yatay kalır
  function krankAdim(k, dt, r, oran, enAz) {
    let hedef;
    if (k.pedal) hedef = Math.max(k.v / (r * oran), enAz);
    else {
      hedef = 0;
      if (k.krankW < 1.2) {   // yatay pedala yumuşakça yerleş (en yakın 0 ya da π)
        const m = ((k.krank % Math.PI) + Math.PI) % Math.PI, fark = m < Math.PI / 2 ? -m : Math.PI - m;
        k.krank += fark * (1 - Math.exp(-dt * 3));
      }
    }
    k.krankW = lerp(k.krankW, hedef, 1 - Math.exp(-dt * (k.pedal ? 5 : 3.5)));
    k.krank += k.krankW * dt;
  }
  function pozYaz(k) {
    const q = k.poz, A = AYAR[k.arac];
    q.hiz = clamp(k.v / A.vMax, 0, 1); q.egim = k.egim; q.it = k.it; q.krank = k.krank; q.arac = k.arac;
    q.kask = KASK_RENK; q.salla = k.salla; q.bakGeri = k.bakGeri; q.nese = k.nese;
    if (!fezaHazir()) return;
    try {
      if (k.faz === 'binis' || k.faz === 'inis') fezaPoz12('binis_in', q);
      else fezaPoz12(k.arac, q);
    } catch (e) { omHataBildir('fezaPoz12', e); }
  }

  // ── iniş bitti: Feza aracın yanında ayakta, kontrol ona döner ──
  function bitir(o) {
    const k = yol(o);
    if (fezaHazir()) { try { fezaPoz12(null); } catch (e) { omHataBildir('fezaPoz12', e); } }
    if (P.ucus === o) {
      P.ucus = null; P.x = k.x; P.y = k.zemin; P.vx = P.vy = 0; P.ground = true; P.safeX = P.x; P.safeY = P.y; P.f = 1;
    }
    k.faz = 'bitti'; k.v = 0; k.t = 0; o.done = true; o.x = k.parkSon;
    if (aktif === o) aktif = null;
    if (typeof V12 !== 'undefined' && V12) V12.binis = null;
    OLAY.emit('k12BinisBitti', { ad: o.ad, o, arac: k.arac });
  }
  // Beklenmedik bırakma (hata kalkanı uçuşu kesti vb.): olduğu yerde park et, anneyi bırak
  function acilBitir(o) {
    const k = yol(o);
    if (fezaHazir()) { try { fezaPoz12(null); } catch (e) { /* yoksay */ } }
    k.faz = 'bitti'; k.v = 0; o.done = true;
    if (aktif === o) aktif = null;
    if (typeof V12 !== 'undefined' && V12) V12.binis = null;
    const a = k.anne;
    if (a.faz !== 'park' && a.faz !== 'bitti') anneBirak(o);
    OLAY.emit('k12BinisBitti', { ad: o.ad, o, arac: k.arac });
  }

  // ── anne (ANNE12 devredildiğinde her kare) ──
  function anneAdim(o, dt) {
    const k = yol(o), a = k.anne, AO = anneOlcu();
    if (a.faz === 'park' || a.faz === 'bitti') return;
    a.t += dt;
    const q = k.anneOpt;
    if (a.faz === 'yuru') {
      // bisikletinin yanına (bin u=0 duruş noktası: bisiklet x - 22) yumuşak yürür
      const hedef = a.bx - 22, d = hedef - a.ax, ad = Math.abs(d);
      const kos = ad > 140;   // uzaksa (Feza koşarak gelmiş) anne de seğirtir
      const vHedef = Math.min(kos ? 230 : 115, Math.sqrt(2 * 260 * ad));
      a.v = lerp(a.v, vHedef, 1 - Math.exp(-dt * 6));
      const adimX = Math.sign(d) * Math.min(ad, a.v * dt);
      a.ax += adimX; a.yon = ad > 1 ? Math.sign(d) : 1;
      q.poz = a.v > 140 ? 'kos' : 'yuru'; q.hiz = a.v; q.yon = a.yon; q.u = 0;
      ANNE12.x = a.ax; ANNE12.y = k.zemin;
      if (ad < 1.5 || (a.t > 6 && ad < 60)) { a.faz = 'bin'; a.t = 0; a.v = 0; a.yon = 1; }
      return;
    }
    if (a.faz === 'bin') {
      const w = clamp(a.t / ANNE_BIN_SURE, 0, 1);
      q.poz = 'bisiklet_bin'; q.u = smooth(w); q.yon = 1; q.krank = a.krank; q.hiz = 0;
      if (w >= 0.6 && !a.ilkZil) { a.ilkZil = true; OLAY.emit('k12BinisAdim', { ad: o.ad, o, arac: 'bisiklet', faz: 'bin', kim: 'anne' }); }
      ANNE12.x = a.x = a.bx; ANNE12.y = k.zemin;
      if (w >= 1) { a.faz = 'sur'; a.t = 0; a.zilBekle = 0.9; }   // yola çıkarken neşeyle bir zil
      return;
    }
    if (a.faz === 'sur') {
      // Feza'nın arkasında kal: hedef ara ANNE_ARA; varış parkını geçme; Feza'yı asla geçme
      const parkHedef = k.parkSon - 60;
      const fezaBitti = k.faz === 'inis' || k.faz === 'bitti';
      // selamlaşmada anne yanaşır (yine arkada, ~82 birim), sonra yine geriye düşer
      const st = k.selam.durum === 1 ? k.selam.t : -1, ac = (t0, t1) => smooth(clamp((st - t0) / (t1 - t0), 0, 1));
      const yanas = st < 0 ? 0 : ac(0, 1.1) * (1 - ac(3.4, 4.6));
      // annenin ön tekeri Feza'nın arka tekerinden hep en az ~45 birim geride: selamlaşmada "hemen arkasına" yanaşır,
      // başını uzatıp (opt.egil) el sallar; asla yan yana gelip üstüne binmez
      const TKf = k.arac === 'bisiklet' ? KUCUK_TEKER : SCOOTER_TEKER;
      const temas = AO.onTeker[0] + AO.teker - (TKf.arka[0] - TKf.r - (k.arac === 'bisiklet' ? 7 : 0));   // anne ön ucu ↔ Feza arka ucu
      const araMin = temas + 45, araNormal = Math.max(ANNE_ARA, temas + 58);
      const ara = lerp(araNormal, araMin + 3, yanas);
      q.egil = 0.85 * yanas;
      const izle = fezaBitti ? parkHedef : Math.min(k.x - ara, parkHedef);   // Feza indiyse anne kendi park yerine süzülür
      const fv = fezaBitti || k.x - ara >= parkHedef ? 0 : k.v;
      let vHedef = clamp(fv + (izle - a.x) * 1.1, 0, ANNE_VMAX);
      if (!fezaBitti && k.x - a.x < araMin) vHedef = Math.min(vHedef, k.v * 0.85);   // parkta (Feza indi) raf aralığına yanaşabilir
      const kalan = parkHedef - a.x;
      vHedef = Math.min(vHedef, Math.sqrt(2 * 130 * Math.max(0, kalan)));
      const v0 = a.v, maxIv = vHedef > a.v ? 170 : 240;
      a.v += clamp((vHedef - a.v) * 2.2, -maxIv, maxIv) * dt;
      if (a.v < 3 && vHedef < 3) a.v = 0;
      a.v = Math.max(0, a.v);
      a.x = Math.min(a.x + a.v * dt, parkHedef);
      if (!fezaBitti && a.x > k.x - araMin + 6) { a.x = k.x - araMin + 6; a.v = Math.min(a.v, k.v); }   // emniyet: Feza'nın üstüne asla binmez
      const yokusta = a.x > k.yokus0 && a.x < k.yokus1;
      a.pedal = vHedef > a.v - 4 && a.v > 2 && kalan > 150 && !yokusta;
      // Feza kendiliğinden anneye el sallarsa (FEZA12.anneBak) anne de gecikmeyle karşılık verir
      const cevap = typeof FEZA12 !== 'undefined' && FEZA12 && Number.isFinite(FEZA12.anneBak) ? clamp(FEZA12.anneBak, 0, 1) : 0;
      a.cevap = lerp(a.cevap || 0, cevap, 1 - Math.exp(-dt * 3));
      q.salla = Math.max(st < 0 ? 0 : ac(1.15, 1.5) * (1 - ac(3.2, 3.7)), smooth(a.cevap)); q.zil = a.zil;
      q.nese = lerp(q.nese || 0, yokusta ? 1 : 0, 1 - Math.exp(-dt * 2.5));
      a.w = a.v / AO.teker; a.teker += a.w * dt;
      krankAdim(a, dt, AO.teker, 2.4, 2.6);
      yayAdim(a.yay, dt, a.x + AO.onTeker[0], a.x + AO.arkaTeker[0], a.v);
      a.egim = lerp(a.egim, clamp((a.v - v0) / dt / 3000, -0.04, 0.06), 1 - Math.exp(-dt * 4));
      q.poz = 'bisiklet'; q.krank = a.krank; q.hiz = clamp(a.v / 300, 0, 1); q.egim = 0; q.yon = 1; q.u = 1;
      q.bak = Math.max(clamp(0.15 + (k.x - a.x - ANNE_ARA) / 400, 0, 0.4), yanas);
      ANNE12.x = a.x; ANNE12.y = k.zemin;
      if (fezaBitti && kalan < 1 && a.v < 4) { a.x = parkHedef; a.v = 0; a.faz = 'in'; a.t = 0; a.ilkZil = false; }
    } else if (a.faz === 'in') {
      const w = clamp(a.t / ANNE_IN_SURE, 0, 1);
      q.poz = 'bisiklet_in'; q.u = smooth(w); q.krank = a.krank; q.hiz = 0; q.yon = 1;
      if (w >= 0.5 && !a.ilkZil) { a.ilkZil = true; OLAY.emit('k12BinisAdim', { ad: o.ad, o, arac: 'bisiklet', faz: 'in', kim: 'anne' }); }
      ANNE12.x = a.x; ANNE12.y = k.zemin;
      if (w >= 1) anneBirak(o);
    }
    // zil: Feza çalınca anne cevap verir
    if (a.zilBekle >= 0) { a.zilBekle -= dt; if (a.zilBekle < 0) zilCal(o, 'anne'); }
  }
  function anneBirak(o) {
    const k = yol(o), a = k.anne;
    a.faz = 'bitti'; a.v = 0; a.bx = a.x;
    if (typeof ANNE12 !== 'undefined' && ANNE12 && (!ANNE12.sahip || ANNE12.sahip === o)) {   // anne başka binişe geçtiyse dokunma
      ANNE12.x = a.x; ANNE12.y = k.zemin;
      if (typeof ANNE12.birak === 'function') { try { ANNE12.birak(o); } catch (e) { omHataBildir('ANNE12.birak', e); } }
    }
  }

  // ── zil ──
  function zilCal(o, kim, sahne) {   // sahne: selamlaşmanın kendi zili (anne ayrıca cevap vermez)
    const k = yol(o);
    let x, y;
    if (kim === 'anne') {
      const a = k.anne, AO = anneOlcu(), bx = a.faz === 'park' ? a.bx : a.x;
      a.zil = 1; x = bx + AO.gidon[0] + 6; y = k.zemin + AO.gidon[1] - 4;
    } else {
      const F = fezaOlcu(k.arac); k.zil = 1; x = k.x + F.gidon[0] - 3; y = k.zemin + F.gidon[1] - 3;
      if (!sahne && k.anne.faz === 'sur' && k.anne.zilBekle < 0) k.anne.zilBekle = 0.45;
      k.piril.sevinc = 1;
    }
    for (let i = 0; i < 2; i++) kivilcim(x + 4 + i * 6, y - 6, 18 + i * 10, -40 - i * 12, 1.3, 3.2, i ? '#ffd36b' : '#ff9fc6', 1);
    OLAY.emit('k12Zil', { ad: o.ad, o, arac: k.arac, kim, x, y });
  }

  function toz(x, y) {
    for (let i = 0; i < 3; i++) kivilcim(x + (Math.random() - 0.5) * 6, y - 2, -20 - Math.random() * 30, -8 - Math.random() * 10, 0.6, 3 + Math.random() * 2, 'rgba(226,214,190,.55)', 2);
  }

  // ── yol sürprizleri (Feza sürerken önünde belirir; dokunmak isteğe bağlı) ──
  function surprizAdim(o, dt) {
    const k = yol(o);
    if (k.faz !== 'surus' && k.faz !== 'binis') return;
    for (const s of k.surpriz) {
      if (s.oldu || s.tur === 'halka' || k.x < s.x - (VW * 0.75 + 200)) continue;
      s.oldu = true;
      if (s.tur === 'kopuk') kopukUret(o, s.x);
      else if (s.tur === 'yaprak') { yaprakUret(o); OLAY.emit('k12Surpriz', { ad: o.ad, o, tur: 'yaprak', x: s.x, y: k.zemin - 120 }); }
    }
    // halkalar: Feza'nın gövdesi içinden geçince ışıl ışıl dağılır
    const gx = k.x + 4, gy = k.zemin - 50;
    for (const h of k.halka) {
      if (h.al >= 0) { h.al += dt; continue; }
      if (Math.abs(h.x - gx) < 12 && Math.abs(h.y - gy) < 42) halkaAl(o, h);
    }
  }
  function halkaAl(o, h) {
    h.al = 0;
    patlat(h.x, h.y, 9, 120, PARILTI);
    yol(o).piril.sevinc = Math.max(yol(o).piril.sevinc, 0.6);
    OLAY.emit('k12Surpriz', { ad: o.ad, o, tur: 'halka', x: h.x, y: h.y, i: h.i });
  }
  function kopukUret(o, sx) {
    const k = yol(o);
    let n = 0;
    for (let i = 0; i < KOPUK.length && n < 8; i++) {
      const b = KOPUK[i]; if (b.on) continue;
      b.on = true; b.ad = o.ad; b.t = 0; b.pat = -1;
      b.x = sx + n * 34 + Math.random() * 30; b.y = k.zemin - 40 - Math.random() * 130;
      b.vx = -12 - Math.random() * 18; b.vy = -6 - Math.random() * 10; b.r = 8 + Math.random() * 10; b.faz = Math.random() * TAU;
      n++;
    }
  }
  function yaprakUret(o) {
    const k = yol(o);
    let n = 0;
    for (let i = 0; i < YAPRAK.length && n < 22; i++) {
      const p = YAPRAK[i]; if (p.on) continue;
      p.on = true; p.t = 0; p.on2 = n % 2 === 0;
      p.x = cam.x + VW + 30 + Math.random() * 380; p.y = k.zemin - 60 - Math.random() * 260;
      p.vx = -70 - Math.random() * 80; p.vy = 8 + Math.random() * 20;
      p.don = Math.random() * TAU; p.vd = (Math.random() - 0.5) * 6; p.cev = Math.random() * TAU; p.vc = 3 + Math.random() * 5;
      p.r = 3.2 + Math.random() * 2.6; p.renk = YAPRAK_RENK[n % YAPRAK_RENK.length];
      n++;
    }
  }
  function havuzAdim(dt, tm) {
    const fx = P.x + 4, fy = P.y - 48;
    for (let i = 0; i < KOPUK.length; i++) {
      const b = KOPUK[i]; if (!b.on) continue;
      b.t += dt;
      if (b.pat >= 0) { b.pat += dt; if (b.pat > 0.35) b.on = false; continue; }
      b.x += (b.vx + Math.sin(tm * 1.3 + b.faz) * 10) * dt; b.y += (b.vy + Math.sin(tm * 2.1 + b.faz) * 8) * dt;
      if (b.t > 14 || b.x < cam.x - 200) { b.on = false; continue; }
      if (aktif && Math.hypot(b.x - fx, b.y - fy) < b.r + 26) kopukPatla(b, aktif);
    }
    for (let i = 0; i < YAPRAK.length; i++) {
      const p = YAPRAK[i]; if (!p.on) continue;
      p.t += dt;
      // Feza'nın yanından geçerken rüzgârıyla havalanıp döner
      const dx = p.x - fx, dy = p.y - fy, d = Math.hypot(dx, dy);
      if (aktif && d < 90) { const f = (1 - d / 90) * (P.vx || 0) * 2.2; p.vy -= f * dt; p.vx -= f * 0.6 * dt; p.vc += dt * 6; }
      p.vy += (14 - p.vy) * dt * 0.6;
      p.vx += (-90 - p.vx) * dt * 0.3;
      p.x += (p.vx + Math.sin(p.cev) * 18) * dt; p.y += p.vy * dt;
      p.don += p.vd * dt; p.cev += p.vc * dt;
      if (p.t > 12 || p.x < cam.x - 120 || p.y > (aktif ? yol(aktif).zemin : P.y) + 10) p.on = false;
    }
  }
  function kopukPatla(b, o) {
    b.pat = 0;
    for (let j = 0; j < 6; j++) { const a = j * TAU / 6; kivilcim(b.x + Math.cos(a) * b.r, b.y + Math.sin(a) * b.r, Math.cos(a) * 50, Math.sin(a) * 50, 0.4, 1.8, '#e8fbff', 0); }
    OLAY.emit('k12Surpriz', { ad: o ? o.ad : b.ad, o, tur: 'kopuk', x: b.x, y: b.y });
  }

  // ── Pırıl binişte Feza'nın yanında uçar (oyun.js P.ucus'ta çizmez) ──
  function pirilAdim(o, dt, tm) {
    const k = yol(o), pr = k.piril;
    // anne yanaşınca Pırıl öne-yukarı süzülür (annenin başının önünde kalmasın)
    const ys = k.yanas || 0;
    const hx = P.x - 72 + 120 * ys + Math.sin(tm * 0.8) * 16, hy = P.y - 128 - 22 * ys + Math.sin(tm * 1.6) * 8 - pr.sevinc * 14;
    const kk = 34, dd = 2 * Math.sqrt(kk) * 0.9;
    pr.vx += (kk * (hx - pr.x) - dd * (pr.vx - k.v)) * dt; pr.vy += (kk * (hy - pr.y) - dd * pr.vy) * dt;
    pr.x += pr.vx * dt; pr.y += pr.vy * dt;
    pr.sevinc = Math.max(0, pr.sevinc - dt / 1.2);
  }

  // ── TUR ──
  function guncelle(o, dt) {
    const k = yol(o);
    if (!k) return;
    sonDt = dt;
    if (k.zil > 0) k.zil = Math.max(0, k.zil - dt / 0.9);
    if (k.anne.zil > 0) k.anne.zil = Math.max(0, k.anne.zil - dt / 0.9);
    if (DURUM !== 'oyun') return;
    if (o === binisler[0]) { kivAdim(dt); havuzAdim(dt, now); }
    if (k.faz === 'park') {
      // Feza parka yürüdü: durmadan biner (ışınlanma ile yanından geçilmişse de)
      const bx = k.x;
      if (!P.ucus && !aktif && P.ground && !(P.fade > 0) && P.x >= bx - 3 && P.x < bx + 260 && Math.abs(P.y - o.y) < 60) basla(o);
    } else if (k.faz === 'binis' || k.faz === 'surus' || k.faz === 'inis') {
      if (P.ucus !== o) { acilBitir(o); return; }
      pirilAdim(o, dt, now);
      surprizAdim(o, dt);
    }
    anneAdim(o, dt);
  }

  // Annenin bisikleti + anne (Feza'nın arkasında; 'ciz' katmanı). Derinlik: annenin uzak kolu/bacağı → bisiklet → annenin gerisi.
  function anneCiz(o, tm) {
    const k = yol(o), a = k.anne, AO = anneOlcu();
    const parkta = a.faz === 'park' || a.faz === 'yuru' || a.faz === 'bitti';
    const bx = parkta ? a.bx : a.x, by = k.zemin;
    if (bx < cam.x - 250 || bx > cam.x + VW + 250) {
      if (a.faz === 'yuru') anneYuruCiz(k, tm);
      return;
    }
    const surus = a.faz === 'sur';
    const bob = surus ? yayBob(a.yay, a.v) : 0, egim = surus ? yayEgim(a.yay, AO.onTeker[0] - AO.arkaTeker[0]) : 0;
    golge(g, bx, by, 64 + bob * 1.5, 0.34);
    g.save(); g.translate(bx, by + bob); g.rotate(egim);
    const durum = AN_DURUM;
    durum.teker = parkta ? 0 : a.teker; durum.w = surus ? a.w : 0; durum.krank = a.krank; durum.zil = a.zil; durum.hiz = surus ? a.v : 0;
    durum.ayak = parkta ? 1 : a.faz === 'bin' ? 1 - smooth(clamp(a.t / 0.3, 0, 1)) : a.faz === 'in' ? smooth(clamp((a.t - ANNE_IN_SURE + 0.3) / 0.3, 0, 1)) : 0;
    const binik = (a.faz === 'bin' || a.faz === 'sur' || a.faz === 'in') && anneVar();
    if (binik) anneParca(k, 'uzak', tm);
    anneBisikletCiz(g, AO, k.renk, durum, tm);
    if (binik) anneParca(k, 'yakin', tm);
    g.restore();
    if (a.faz === 'yuru') anneYuruCiz(k, tm);
  }
  function anneParca(k, katman, tm) {
    const q = k.anneOpt; q.katman = katman; q.golge = false;
    try { anne12Ciz(g, 0, 0, 1, tm, q); } catch (e) { omHataBildir('anne12Ciz', e); }
    q.katman = undefined; q.golge = undefined;
  }
  const AN_DURUM = { teker: 0, w: 0, krank: 0, zil: 0, hiz: 0, ayak: 1 };
  function anneYuruCiz(k, tm) {
    if (!anneVar()) return;
    try { anne12Ciz(g, k.anne.ax, k.zemin, 1, tm, k.anneOpt); } catch (e) { omHataBildir('anne12Ciz', e); }
  }

  // ── annenin şehir bisikleti (köken yer-orta; ölçüler ANNE12_BISIKLET): alçak kadro, sepet, zil, çamurluklar, okunur zincir ──
  function anneBisikletCiz(c, A, R, d, tm) {
    const r = A.teker, rA = A.arkaTeker, rO = A.onTeker, B = A.pedal, S = A.sele, G = A.gidon, kr = A.krank;
    const Ht = [rO[0] - 12, G[1] + 16], Hb = [rO[0] - 7, G[1] + 30];   // gidon borusu üstü/altı
    const Sp = [S[0] + 3, S[1] + 10];                                    // sele borusu ağzı
    const ar = kr * 0.62;
    pedalKol(c, B[0], B[1], kr, d.krank + Math.PI, true);               // uzak pedal (kadronun arkasında)
    const stil = { lastik: '#394052', jant: '#e3e8ee', tel: '#c9d1d9', gobek: '#b3bcc5', tel_n: 12 };
    tekerlek(c, rA[0], rA[1], r, d.teker, d.w, stil);
    tekerlek(c, rO[0], rO[1], r, d.teker, d.w, stil);
    camurluk(c, rA[0], rA[1], r + 3, Math.PI * 1.0, Math.PI * 1.9, R.camur);
    camurluk(c, rO[0], rO[1], r + 3, Math.PI * 1.15, Math.PI * 2.02, R.camur);
    c.beginPath(); c.ellipse(rA[0] - r - 2.6, rA[1] - 4, 1.6, 2.6, 0, 0, TAU); dolguBoya(c, '#ff6f5e', 0.8);   // arka reflektör
    // arka bagaj
    const bgY = rA[1] - r - 6;
    c.beginPath(); cizgi(c, rA[0] - 14, bgY, Sp[0] - 3, bgY); cizgi(c, rA[0] - 10, bgY, rA[0], rA[1]);
    boruBoya(c, 1.8, '#c3cbd3', null, 0.9);
    zincir(c, B, ar, rA, 3.4, d.krank);
    // kadro: tek kalın alçak kavis (adım atılarak binilir), sele borusu, arka çatallar, gidon borusu
    c.beginPath();
    c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(B[0] + 20, B[1] + 5, B[0], B[1]);
    c.moveTo(B[0], B[1]); c.lineTo(Sp[0], Sp[1]);
    c.moveTo(B[0], B[1]); c.lineTo(rA[0], rA[1]);
    c.moveTo(Sp[0] - 0.5, Sp[1] + 4); c.lineTo(rA[0], rA[1]);
    c.moveTo(Ht[0], Ht[1]); c.lineTo(Hb[0], Hb[1]);
    boruBoya(c, 4.4, R.kadro, R.isik, 1.3);
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(rO[0] - 1, rO[1] - 14, rO[0], rO[1]);   // ön çatal
    boruBoya(c, 3, '#c8d0d8', '#f4f7f9', 1.1);
    ayna(c, B, ar, d.krank, '#d3dae0');
    // sele borusu + yaylı deri sele
    c.beginPath(); c.moveTo(Sp[0], Sp[1]); c.lineTo(S[0] + 1, S[1] + 3); boruBoya(c, 2.2, '#cdd4db', null, 1);
    c.beginPath(); c.moveTo(S[0] - 9, S[1] + 0.8); c.quadraticCurveTo(S[0] - 9, S[1] - 3.8, S[0] - 1, S[1] - 3.6); c.quadraticCurveTo(S[0] + 8, S[1] - 2.8, S[0] + 11, S[1] - 0.4);
    c.quadraticCurveTo(S[0] + 2, S[1] + 2.8, S[0] - 9, S[1] + 0.8); dolguBoya(c, R.sele, 1.1);
    c.beginPath(); c.moveTo(S[0] - 6, S[1] - 2.2); c.quadraticCurveTo(S[0], S[1] - 3.4, S[0] + 6, S[1] - 2); c.strokeStyle = R.seleI; c.lineWidth = 1; c.stroke();
    // ön sepet (sade hasır) + içinde bohça ve çiçekler; altında far
    const sx0 = Ht[0] + 4, sy0 = Ht[1] - 9, sw = 26, sh = 18;
    c.beginPath(); c.moveTo(sx0, sy0); c.lineTo(sx0 + sw, sy0); c.lineTo(sx0 + sw - 3, sy0 + sh); c.lineTo(sx0 + 3, sy0 + sh); c.closePath();
    dolguBoya(c, '#dcae6c', 1.2);
    c.beginPath();
    for (let i = 1; i < 3; i++) { const yy = sy0 + i * sh / 3; cizgi(c, sx0 + i, yy, sx0 + sw - i, yy); }
    for (let i = 1; i < 4; i++) { const xx = sx0 + i * sw / 4; cizgi(c, xx, sy0 + 1, xx - (xx - sx0 - sw / 2) * 0.12, sy0 + sh - 1); }
    c.strokeStyle = 'rgba(150,98,48,.55)'; c.lineWidth = 0.9; c.stroke();
    c.beginPath(); cizgi(c, sx0 - 1, sy0, sx0 + sw + 1, sy0); boruBoya(c, 1.8, '#c08a4b', null, 0.9);
    const sal = Math.sin(tm * 3.1) * 0.5 * clamp(d.hiz / 200, 0.2, 1);
    c.beginPath(); c.ellipse(sx0 + 8, sy0 - 2.5, 6.5, 4.8, 0, Math.PI, TAU); dolguBoya(c, '#f26b6b', 1);
    const cicek = ['#ffd84d', '#ff9ec7', '#ffffff'];
    for (let i = 0; i < 3; i++) {
      const fx = sx0 + 16 + i * 4 + sal * (i + 1), fy = sy0 - 8 - (i % 2) * 4;
      c.beginPath(); c.moveTo(sx0 + 15 + i * 3, sy0); c.quadraticCurveTo(sx0 + 16 + i * 3.5, sy0 - 4, fx, fy); c.strokeStyle = '#4d9a52'; c.lineWidth = 1.1; c.stroke();
      c.beginPath(); c.arc(fx, fy, 2.6, 0, TAU); dolguBoya(c, cicek[i], 0.8);
      oval(c, fx, fy, 1, 1, '#f5a623');
    }
    c.beginPath(); c.roundRect(Hb[0] + 2, Hb[1] - 6, 6, 5, 2); dolguBoya(c, '#f7f1dc', 0.9);   // far
    oval(c, Hb[0] + 7.6, Hb[1] - 3.5, 1.1, 1.8, '#fff3a8');
    // gidon: kısa boğaz, geriye kıvrık şehir gidonu, deri sap
    const St = [Ht[0] - 1, G[1] + 5];
    c.beginPath(); c.moveTo(Ht[0], Ht[1]); c.lineTo(St[0], St[1]); c.quadraticCurveTo(St[0] + 8, G[1] - 3, G[0] + 4, G[1] - 0.5);
    boruBoya(c, 2.4, '#cdd4db', '#f7f9fb', 1.1);
    c.beginPath(); c.moveTo(G[0] + 4.5, G[1] - 0.6); c.lineTo(G[0] - 3, G[1] + 0.4); boruBoya(c, 3.2, '#7d5d45', null, 1);
    zilCiz(c, St[0] + 4, St[1] - 1.5, 1, d.zil, tm);
    // park ayağı: parkta yere iner, sürerken çatal boyunca katlanır
    const ay = d.ayak, pv = [B[0] - 7, B[1] + 2];
    const uc = [lerp(pv[0] - 24, pv[0] - 9, ay), lerp(pv[1] - 3, -0.5, ay)];
    c.beginPath(); c.moveTo(pv[0], pv[1]); c.lineTo(uc[0], uc[1]); boruBoya(c, 1.8, '#a8b1ba', null, 0.9);
    pedalKol(c, B[0], B[1], kr, d.krank, false);                        // yakın pedal (annenin yakın bacağı üstünden geçer)
  }

  // ── Feza'nın mavi kick scooter'ı: alçak tabla, ışıklı tekerlekler ──
  function scooterCiz(c, F, d, tm) {
    const TK = SCOOTER_TEKER, r = TK.r, ar = TK.arka, on = TK.on, G = F.gidon, dy = F.ayak[1];
    const isik = clamp(d.hiz / 120, 0, 1) * 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(tm * 3));
    // ışıklı tekerlerin parıltısı (arkada, yumuşak)
    c.globalCompositeOperation = 'lighter';
    const li = Math.floor((d.teker / TAU) * 3) % 3, lr = LED[(li + 3) % 3], lo = LED[(li + 4) % 3];
    lekeCiz(c, lr, ar[0], ar[1], r * 3.2, 0.5 * isik); lekeCiz(c, lo, on[0], on[1], r * 3.2, 0.5 * isik);
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    ledTeker(c, ar[0], ar[1], r, d.teker, isik, li);
    ledTeker(c, on[0], on[1], r, d.teker, isik, li + 1);
    // arka fren çamurluğu + tablayı göbeğe bağlayan kol
    c.beginPath(); c.arc(ar[0], ar[1], r + 1.8, Math.PI * 1.32, Math.PI * 1.96); boruBoya(c, 2.2, '#3f9be6', '#bfe4ff', 1);
    const x0 = ar[0] + 4, x1 = on[0] - 7, th = 3.6;
    c.beginPath(); c.moveTo(x0 - 3, dy - 1); c.quadraticCurveTo(ar[0] + 1, ar[1] - 0.5, ar[0] + 2.5, ar[1] - 2.5); boruBoya(c, 2.6, '#2f8be0', null, 1);
    // tabla: konturlu, kaymaz bant, yıldız çıkartmalar
    c.beginPath(); c.roundRect(x0, dy - 0.6, x1 - x0, th, th / 2); dolguBoya(c, '#3b9df0', 1.2);
    c.fillStyle = '#2c3a52'; c.beginPath(); c.roundRect(x0 + 3, dy - 0.9, x1 - x0 - 7, 1.2, 0.6); c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(x0 + 2.5, dy + 1.2, x1 - x0 - 5, 0.5);
    c.fillStyle = '#ffe27a'; yildiz4(c, x0 + 8, dy + 1.4, 1.2); c.fillStyle = '#ffffff'; yildiz4(c, x0 + 21, dy + 1.4, 1.1);
    // boyun + çatal + T-çubuk (ön teker üstündeki başlıktan yükselir)
    const Hb = [on[0] - 2.5, on[1] - r - 3.5], Ht = [G[0] + 2, G[1] + 4];
    c.beginPath(); c.moveTo(x1 - 1.5, dy + 1); c.quadraticCurveTo(Hb[0] - 2, dy, Hb[0], Hb[1]); boruBoya(c, 3.8, '#3b9df0', '#bfe4ff', 1.2);
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.lineTo(on[0], on[1]); boruBoya(c, 2.2, '#c9d2da', '#f5f8fa', 1);
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.lineTo(Ht[0], Ht[1]); boruBoya(c, 2.9, '#47a7f2', '#d3edff', 1.2);
    c.beginPath(); c.roundRect(lerp(Hb[0], Ht[0], 0.35) - 2.3, lerp(Hb[1], Ht[1], 0.35) - 1.4, 4.6, 2.8, 1); dolguBoya(c, '#f2f5f8', 0.8);   // kelepçe
    // sap (yandan): kısa çubuk, pembe elcik, rüzgârda püsküller
    c.beginPath(); c.moveTo(G[0] - 4, G[1] + 0.6); c.lineTo(G[0] + 4, G[1] - 0.6); boruBoya(c, 3, '#ff8fbf', '#ffd6e8', 1);
    const p = clamp(d.hiz / 200, 0, 1);
    for (let i = 0; i < 3; i++) {
      const sx = G[0] - 4, sy = G[1] + 0.5, uz = 6 + i * 1.2, a = 1.9 - p * 1.25 + Math.sin(tm * (7 + i) + i) * (0.12 + p * 0.15);
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.cos(a) * uz * 0.5 + 1, sy + Math.sin(a) * uz * 0.5, sx + Math.cos(a) * uz, sy + Math.sin(a) * uz);
      c.strokeStyle = PARILTI[i]; c.lineWidth = 1.1; c.lineCap = 'round'; c.stroke();
    }
    zilCiz(c, G[0] + 1, G[1] - 1.8, 0.75, d.zil, tm);
    c.beginPath(); c.arc(Hb[0] + 2.5, Hb[1] + 1, 1.6, 0, TAU); dolguBoya(c, '#fff4b0', 0.7);   // ön lamba
    if (d.kaskAsili) kaskCiz(c, G[0] + 1, G[1] + 9, 0.5, tm);
    // park ayağı
    const ay = d.ayak, pv = [x0 + 8, dy + th], uc = [lerp(pv[0] - 8, pv[0] - 5, ay), lerp(pv[1] + 0.2, -0.3, ay)];
    c.beginPath(); c.moveTo(pv[0], pv[1]); c.lineTo(uc[0], uc[1]); boruBoya(c, 1.1, '#a8b1ba', null, 0.7);
  }
  function ledTeker(c, cx, cy, r, aci, isik, li) {
    oval(c, cx, cy, r, r, '#d6f0ff');
    c.globalAlpha = 0.85; oval(c, cx, cy, r * 0.76, r * 0.76, '#9fd8f6'); c.globalAlpha = 1;
    // dönen üç LED: yanınca parlak, dururken soluk
    for (let i = 0; i < 3; i++) {
      const a = aci + i * TAU / 3, lx = cx + Math.cos(a) * r * 0.5, ly = cy + Math.sin(a) * r * 0.5;
      c.globalAlpha = 0.35 + 0.65 * isik; oval(c, lx, ly, r * 0.2, r * 0.2, LED[(li + i) % 3]);
    }
    c.globalAlpha = 1;
    c.beginPath(); c.arc(cx, cy, r - 0.6, 0, TAU); c.strokeStyle = KONTUR; c.lineWidth = 1.5; c.stroke();
    c.beginPath(); c.arc(cx, cy, r * 0.24, 0, TAU); dolguBoya(c, '#eef5fa', 0.7);
  }

  // ── Feza'nın küçük bisikleti: canlı kırmızı kadro, lacivert/beyaz ayrıntı, şimşek çıkartma, destek tekerlekli, flamalı ──
  const PUSKUL = ['#ffffff', '#4a64a8', '#ff5a45', '#ffd34d'];
  // Şimşek çıkartma (sarı, ince lacivert kenarlı)
  function simsek(c, x, y, s) {
    c.beginPath(); c.moveTo(x + 0.4 * s, y - s); c.lineTo(x - 0.5 * s, y + 0.1 * s); c.lineTo(x + 0.05 * s, y + 0.1 * s);
    c.lineTo(x - 0.4 * s, y + s); c.lineTo(x + 0.55 * s, y - 0.2 * s); c.lineTo(x, y - 0.2 * s); c.closePath();
    c.fillStyle = '#ffd34d'; c.fill(); c.strokeStyle = '#162248'; c.lineWidth = 0.4; c.stroke();
  }
  function kucukBisikletCiz(c, F, d, tm) {
    const TK = KUCUK_TEKER, r = TK.r, ar = TK.arka, on = TK.on, B = F.pedal, S = F.sele, G = F.gidon, kr = F.krank;
    const Ht = [on[0] - 7, G[1] + 9], Hb = [on[0] - 4, Math.max(G[1] + 18, on[1] - r - 2)], Sp = [S[0] + 2, S[1] + 6];
    const kad = '#e8392b', isk = '#ff9c86', lac = '#24346b', lacI = '#4a64a8';
    const p = clamp(d.hiz / 220, 0, 1);
    // flama: arka göbekten yükselen esnek direk, ucunda dalgalanan turuncu-sarı bayrak (hızla geriye eğilir)
    const fx0 = ar[0] - 3, fy0 = ar[1] - 2, boy = 78, egil = 6 + p * 16 + Math.sin(tm * 2.3) * 1.5;
    const ux = fx0 - egil, uy = fy0 - boy + egil * 0.25;
    c.beginPath(); c.moveTo(fx0, fy0); c.quadraticCurveTo(fx0 - egil * 0.2, fy0 - boy * 0.55, ux, uy);
    c.strokeStyle = KONTUR; c.lineWidth = 2; c.lineCap = 'round'; c.stroke(); c.strokeStyle = '#e8edf2'; c.lineWidth = 1; c.stroke();
    const dal = tm * (5 + p * 9);
    c.beginPath(); c.moveTo(ux, uy);
    for (let i = 1; i <= 5; i++) { const u = i / 5; c.lineTo(ux - u * 27, uy + u * 4.5 + Math.sin(dal - u * 4) * 3 * u); }
    for (let i = 5; i >= 0; i--) { const u = i / 5; c.lineTo(ux - u * 27, uy + 14 - u * 9 + Math.sin(dal - u * 4 + 0.4) * 3 * u); }
    c.closePath(); dolguBoya(c, '#ffa63d', 1);
    c.beginPath(); c.moveTo(ux, uy + 4.8); for (let i = 1; i <= 5; i++) { const u = i / 5; c.lineTo(ux - u * 24, uy + 6.2 - u * 0.8 + Math.sin(dal - u * 4 + 0.2) * 3 * u); }
    c.strokeStyle = '#ffe58a'; c.lineWidth = 1.6; c.stroke();
    c.beginPath(); c.arc(ux, uy, 1.5, 0, TAU); dolguBoya(c, '#ffe27a', 0.6);
    pedalKol(c, B[0], B[1], kr, d.krank + Math.PI, true);               // uzak pedal
    // tekerlekler (beyaz yanaklı) + beyaz çamurluklar
    const stil = { lastik: '#394052', jant: '#e9edf1', tel: '#cfd6de', gobek: lac, tel_n: 10, beyazYan: true };
    tekerlek(c, ar[0], ar[1], r, d.teker, d.w, stil);
    tekerlek(c, on[0], on[1], r, d.teker, d.w, stil);
    camurluk(c, ar[0], ar[1], r + 2.4, Math.PI * 1.0, Math.PI * 1.85, '#f7f9fc');
    camurluk(c, on[0], on[1], r + 2.4, Math.PI * 1.15, Math.PI * 1.98, '#f7f9fc');
    zincir(c, B, kr * 0.75, ar, 2.6, d.krank);
    // kadro: eğimli üst boru, alt boru, sele borusu, çatallar
    c.beginPath();
    c.moveTo(Ht[0], Ht[1] + 2); c.lineTo(Sp[0], Sp[1] + 1.5);
    c.moveTo(Hb[0], Hb[1]); c.lineTo(B[0], B[1]);
    c.moveTo(B[0], B[1]); c.lineTo(Sp[0], Sp[1]);
    c.moveTo(B[0], B[1]); c.lineTo(ar[0], ar[1]);
    c.moveTo(Sp[0], Sp[1] + 1); c.lineTo(ar[0], ar[1]);
    c.moveTo(Ht[0], Ht[1]); c.lineTo(Hb[0], Hb[1]);
    boruBoya(c, 3.4, kad, isk, 1.15);
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(on[0], on[1] - 6, on[0], on[1]); boruBoya(c, 2.4, '#d5dde4', '#f7f9fb', 1);
    // zincirin üstünde lacivert ince muhafaza + şimşek; dönen aynalı dişli
    c.beginPath(); c.moveTo(B[0] + kr * 0.2, B[1] - kr * 0.9); c.lineTo(ar[0] + 3, ar[1] - 3.4); boruBoya(c, 2.6, lac, lacI, 0.9);
    simsek(c, (B[0] + ar[0]) / 2 + 1, B[1] - 4.8, 3.2);
    ayna(c, B, kr * 0.75, d.krank, '#dfe4ea');
    // kadroda beyaz yıldızlar
    c.fillStyle = '#ffffff'; yildiz4(c, lerp(Ht[0], Sp[0], 0.38), lerp(Ht[1] + 2, Sp[1] + 1.5, 0.38) - 0.2, 1.5);
    c.fillStyle = '#ffffff'; yildiz4(c, lerp(Hb[0], B[0], 0.45), lerp(Hb[1], B[1], 0.45), 1.3);
    // sele (lacivert)
    c.beginPath(); c.moveTo(Sp[0], Sp[1]); c.lineTo(S[0] + 1, S[1] + 2); boruBoya(c, 1.7, '#d5dde4', null, 0.9);
    c.beginPath(); c.moveTo(S[0] - 5.5, S[1] + 0.3); c.quadraticCurveTo(S[0] - 5, S[1] - 2.6, S[0], S[1] - 2.2); c.quadraticCurveTo(S[0] + 5, S[1] - 1.6, S[0] + 6.5, S[1]);
    c.quadraticCurveTo(S[0], S[1] + 2, S[0] - 5.5, S[1] + 0.3); dolguBoya(c, lac, 0.9);
    c.beginPath(); c.moveTo(S[0] - 3.5, S[1] - 1.2); c.quadraticCurveTo(S[0] + 1, S[1] - 2.4, S[0] + 5, S[1] - 0.6); c.strokeStyle = lacI; c.lineWidth = 0.8; c.stroke();
    // gidon borusunda küçük far
    c.beginPath(); c.roundRect(Ht[0] + 1.2, Ht[1] + 1.5, 4.4, 3.6, 1.6); dolguBoya(c, lac, 0.8);
    oval(c, Ht[0] + 5.2, Ht[1] + 3.3, 1, 1.5, '#fff6c2');
    // gidon + elcik püskülleri
    c.beginPath(); c.moveTo(Ht[0], Ht[1]); c.lineTo(Ht[0] - 0.5, G[1] + 3); c.quadraticCurveTo(Ht[0] + 3, G[1] - 1.5, G[0] + 2.5, G[1] - 0.2);
    boruBoya(c, 2, '#d5dde4', '#f7f9fb', 1);
    c.beginPath(); c.moveTo(G[0] + 2.8, G[1] - 0.3); c.lineTo(G[0] - 2.8, G[1] + 0.3); boruBoya(c, 2.8, lac, lacI, 1);
    for (let i = 0; i < 4; i++) {
      const sx = G[0] - 3, sy = G[1] + 0.4, uz = 7 + (i % 2) * 1.5, a = 2.0 - p * 1.35 + Math.sin(tm * (8 + i) + i * 1.3) * (0.1 + p * 0.18);
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.cos(a) * uz * 0.5 + 1, sy + Math.sin(a) * uz * 0.5, sx + Math.cos(a) * uz, sy + Math.sin(a) * uz);
      c.strokeStyle = PUSKUL[i]; c.lineWidth = 1.1; c.lineCap = 'round'; c.stroke();
    }
    zilCiz(c, Ht[0] + 1, G[1] + 1, 0.75, d.zil, tm);
    if (d.kaskAsili) kaskCiz(c, G[0] - 1, G[1] + 8, 0.55, tm);           // parkta kask gidonda asılı
    // destek tekerleği (yakın taraf; arka tekerin önünde)
    const dr = TK.destekR, dx = ar[0] - 7, dyy = -dr;
    c.beginPath(); c.moveTo(ar[0], ar[1]); c.lineTo(dx + 1, dyy - 1); boruBoya(c, 1.6, '#d5dde4', null, 0.9);
    tekerlek(c, dx, dyy, dr, d.teker * r / dr, d.w * r / dr, { lastik: '#3a4154', jant: '#ffffff', tel: '#c9d3ea', gobek: kad, tel_n: 6 });
    pedalKol(c, B[0], B[1], kr, d.krank, false);                        // yakın pedal
  }
  function kaskCiz(c, x, y, s, tm) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(tm * 1.7) * 0.06); c.scale(s, s);
    c.beginPath(); c.moveTo(-15, 2); c.quadraticCurveTo(-15, -17, 0, -18); c.quadraticCurveTo(15, -17, 16, 2); c.closePath();
    dolguBoya(c, KASK_RENK, 2.2);
    c.beginPath(); c.moveTo(-9, -14); c.quadraticCurveTo(0, -19, 9, -14); c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.stroke();
    oval(c, -6, -9, 4, 2.4, 'rgba(255,255,255,.6)', -0.4);
    c.restore();
  }

  // Feza'nın aracı ('ciz': Feza'nın arkasında). Binişte P.x/P.y (çizim konumu, ara-kare yumuşatmalı) kullanılır;
  // P.y'deki binici sallantısı (pedal/itiş) araca geçmesin diye çıkarılır.
  function fezaAracCiz(o, tm) {
    const k = yol(o), binik = P.ucus === o;
    const x = binik ? P.x : k.x, y = binik ? P.y - k.binBob : k.zemin;
    if (x < cam.x - 200 || x > cam.x + VW + 200) return;
    const F = fezaOlcu(k.arac);
    const ayak = k.faz === 'park' || k.faz === 'bitti' ? 1 : k.faz === 'binis' ? 1 - smooth(clamp(k.t / 0.35, 0, 1)) : k.faz === 'inis' ? smooth(clamp((k.t - INIS_SURE + 0.3) / 0.3, 0, 1)) : 0;
    const d = AC_DURUM;
    d.teker = k.teker; d.w = k.faz === 'surus' ? k.w : 0; d.krank = k.krank; d.zil = k.zil; d.hiz = k.v; d.ayak = ayak;
    d.kaskAsili = kaskDestek() && (k.faz === 'park' || k.faz === 'bitti');
    const TK = k.arac === 'bisiklet' ? KUCUK_TEKER : SCOOTER_TEKER;
    golge(g, x, k.zemin, k.arac === 'bisiklet' ? 34 : 30, 0.36);
    g.save(); g.translate(x, y);
    if (binik) g.rotate(yayEgim(k.yay, TK.on[0] - TK.arka[0]));
    if (k.arac === 'bisiklet') kucukBisikletCiz(g, F, d, tm); else scooterCiz(g, F, d, tm);
    g.restore();
    if (binik && !fezaHazir()) yedekFezaCiz(k, x, y, tm);
  }
  const AC_DURUM = { teker: 0, w: 0, krank: 0, zil: 0, hiz: 0, ayak: 1, kaskAsili: false };
  // FEZA12 pozları gelene kadar geçici Feza (feza.js'in kendi ara-sahne çizimi)
  function yedekFezaCiz(k, x, y, tm) {
    if (typeof fezaCizPoz !== 'function') return;
    const F = fezaOlcu(k.arac), u = k.faz === 'surus' ? 1 : k.poz.u;
    try {
      if (k.arac === 'scooter') fezaCizPoz(g, x + F.ayak[0] * u, y + F.ayak[1] * u, 1, 'ayakta_yan', tm);
      else if (u > 0.5) fezaCizPoz(g, x + F.sele[0], y + F.sele[1] + 8, 0.95, 'binis', tm, null, { ruzgar: clamp(k.v / 300, 0, 1) });
      else fezaCizPoz(g, x, y, 1, 'ayakta_yan', tm);
    } catch (e) { omHataBildir('yedekFeza', e); }
  }

  // ── halkalar (arka yarısı Feza'nın arkasında, ön yarısı önünde: içinden geçiyor gibi) ──
  function halkaCiz(o, tm, on) {
    const k = yol(o);
    if (k.faz === 'park' && !on) return;
    for (const h of k.halka) {
      if (h.x < cam.x - 60 || h.x > cam.x + VW + 60) continue;
      if (h.al > 0.6) continue;
      const u = h.al >= 0 ? h.al / 0.6 : 0, s = 1 + u * 0.7, a = (1 - u) * (k.faz === 'park' ? 0 : 1);
      if (a <= 0.01) continue;
      const renk = PARILTI[(h.i + Math.floor(h.faz)) % 4], yy = h.y + Math.sin(tm * 1.8 + h.faz) * 4;
      const rx = 9 * s, ry = 30 * s;
      if (!on) {
        g.globalCompositeOperation = 'lighter'; lekeCiz(g, renk, h.x, yy, 46 * s, 0.35 * a); g.globalCompositeOperation = 'source-over';
      }
      g.globalAlpha = a;
      g.beginPath(); g.ellipse(h.x, yy, rx, ry, 0, on ? Math.PI / 2 : -Math.PI / 2, on ? Math.PI * 1.5 : Math.PI / 2);
      g.strokeStyle = renk; g.lineWidth = 4.5; g.lineCap = 'round'; g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1.6; g.stroke();
      if (on && h.al < 0) { g.fillStyle = '#ffffff'; yildiz4(g, h.x - rx, yy - ry * 0.4 + Math.sin(tm * 3 + h.faz) * 3, 2.6 + Math.sin(tm * 4 + h.faz)); }
      g.globalAlpha = 1;
    }
  }
  function kopukCiz(tm) {
    for (let i = 0; i < KOPUK.length; i++) {
      const b = KOPUK[i]; if (!b.on || b.x < cam.x - 40 || b.x > cam.x + VW + 40) continue;
      const gir = clamp(b.t / 0.5, 0, 1), cik = clamp((14 - b.t) / 1.5, 0, 1);
      if (b.pat >= 0) {
        const u = b.pat / 0.35; g.globalAlpha = 1 - u;
        g.beginPath(); g.arc(b.x, b.y, b.r * (1 + u * 0.8), 0, TAU); g.strokeStyle = '#ffffff'; g.lineWidth = 1.2; g.stroke();
        g.globalAlpha = 1; continue;
      }
      const r = b.r * (1 + Math.sin(tm * 3 + b.faz) * 0.04), sx = 1 + Math.sin(tm * 2.4 + b.faz) * 0.05;
      g.globalAlpha = gir * cik;
      g.save(); g.translate(b.x, b.y); g.scale(sx, 2 - sx);
      oval(g, 0, 0, r, r, 'rgba(210,240,255,.12)');
      g.beginPath(); g.arc(0, 0, r, 0, TAU); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1; g.stroke();
      g.beginPath(); g.arc(0, 0, r - 1, Math.PI * 0.1 + b.faz, Math.PI * 0.9 + b.faz); g.strokeStyle = 'rgba(255,170,220,.55)'; g.lineWidth = 1.6; g.stroke();
      g.beginPath(); g.arc(0, 0, r - 1, Math.PI * 1.1 + b.faz, Math.PI * 1.7 + b.faz); g.strokeStyle = 'rgba(150,235,255,.55)'; g.lineWidth = 1.6; g.stroke();
      oval(g, -r * 0.38, -r * 0.42, r * 0.22, r * 0.13, 'rgba(255,255,255,.9)', -0.6);
      g.restore();
    }
    g.globalAlpha = 1;
  }
  function yaprakCiz(on) {
    for (let i = 0; i < YAPRAK.length; i++) {
      const p = YAPRAK[i]; if (!p.on || p.on2 !== on || p.x < cam.x - 30 || p.x > cam.x + VW + 30) continue;
      g.globalAlpha = clamp(p.t / 0.4, 0, 1) * clamp((12 - p.t) / 1.5, 0, 1);
      g.save(); g.translate(p.x, p.y); g.rotate(p.don); g.scale(Math.cos(p.cev), 1);
      g.beginPath(); g.moveTo(0, -p.r); g.quadraticCurveTo(p.r * 1.1, -p.r * 0.4, 0, p.r); g.quadraticCurveTo(-p.r * 1.1, -p.r * 0.4, 0, -p.r);
      g.fillStyle = p.renk; g.fill();
      g.beginPath(); g.moveTo(0, -p.r * 0.6); g.lineTo(0, p.r * 0.5); g.strokeStyle = 'rgba(230,140,170,.5)'; g.lineWidth = 0.6; g.stroke();
      g.restore();
    }
    g.globalAlpha = 1;
  }
  // Zil dalgaları
  function zilDalga(x, y, z) {
    if (z <= 0.02) return;
    const u = 1 - z;
    g.globalAlpha = z * 0.8; g.strokeStyle = '#ffe9a0'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (let i = 0; i < 2; i++) {
      const rr = 6 + u * 16 + i * 6;
      g.beginPath(); g.arc(x, y, rr, -0.9, 0.2); g.stroke();
      g.beginPath(); g.arc(x, y, rr, Math.PI - 0.2, Math.PI + 0.9); g.stroke();
    }
    g.globalAlpha = 1;
  }
  // Hızlıyken arkada ince rüzgâr çizgileri
  // Hız hissi: Feza'nın arkasında rüzgâr çizgileri (hız arttıkça daha çok, daha uzun, daha belirgin) ve yerde, tekerleklerin
  // arkasında kısa toz/hız izleri. Önbellek yok ama yalnız birkaç çizgi: karede gradyan/nesne yok.
  function ruzgarCiz(k, tm) {
    const vm = AYAR[k.arac].vMax, h = clamp((k.v - vm * 0.35) / (vm * 0.6), 0, 1);
    if (h <= 0.01) return;
    g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#ffffff'; g.lineCap = 'round';
    const n = 3 + Math.round(h * 4);
    for (let i = 0; i < n; i++) {
      const hz = 1.8 + h * 1.6 + (i % 3) * 0.35, f = ((tm * hz + i * 0.37) % 1);
      const x = P.x - 36 - f * (60 + 50 * h), y = P.y - 22 - ((i * 23) % 100) - Math.sin(i * 2.1) * 6, L = 18 + 22 * h + (i % 2) * 8;
      const al = (0.35 + 0.5 * h) * Math.sin(f * Math.PI);
      g.lineWidth = i % 2 ? 1.4 : 2;
      // önce ince mavi-gri gölge (açık çimen ve gök önünde de okunsun), üstüne beyaz çizgi
      g.globalAlpha = al * 0.45; g.strokeStyle = '#5d7f99';
      g.beginPath(); g.moveTo(x, y + 1.2); g.quadraticCurveTo(x - L * 0.5, y - 0.8, x - L, y + 2.2); g.stroke();
      g.globalAlpha = al; g.strokeStyle = '#ffffff';
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - L * 0.5, y - 2, x - L, y + 1); g.stroke();
    }
    // yerde hız izleri (tekerleklerin arkasında, yolun rengini açan kısa çizgiler)
    g.lineWidth = 1.2; g.strokeStyle = '#ffffff';
    for (let i = 0; i < 3; i++) {
      const f = ((tm * (2.6 + h) + i * 0.33) % 1), x = P.x - 26 - f * 90;
      g.globalAlpha = 0.3 * h * (1 - f);
      g.beginPath(); g.moveTo(x, k.zemin + 1.5 + i * 1.6); g.lineTo(x - 16 - 10 * h, k.zemin + 1.5 + i * 1.6); g.stroke();
    }
    g.globalAlpha = 1;
  }

  function ciz(o, tm) {
    const k = yol(o);
    if (!k) return;
    anneCiz(o, tm);
    fezaAracCiz(o, tm);
    if (k.faz === 'binis' || k.faz === 'surus' || k.faz === 'inis') { halkaCiz(o, tm, false); yaprakCiz(false); }
  }
  function cizOn(o, tm) {
    const k = yol(o);
    if (!k) return;
    const surer = k.faz === 'binis' || k.faz === 'surus' || k.faz === 'inis';
    if (surer) {
      halkaCiz(o, tm, true);
      ruzgarCiz(k, tm);
    }
    if (o === aktif || (!aktif && o === binisler[0])) { kopukCiz(tm); yaprakCiz(true); kivCiz(g); }
    // zil dalgaları
    const F = fezaOlcu(k.arac);
    zilDalga((P.ucus === o ? P.x : k.x) + F.gidon[0], (P.ucus === o ? P.y : k.zemin) + F.gidon[1] - 4, k.zil);
    const a = k.anne, AO = anneOlcu(), abx = a.faz === 'park' || a.faz === 'yuru' || a.faz === 'bitti' ? a.bx : a.x;
    zilDalga(abx + AO.gidon[0] + 6, k.zemin + AO.gidon[1] - 6, a.zil);
    // Pırıl
    if (P.ucus === o && typeof pirilCizPoz === 'function') {
      const pr = k.piril;
      try { pirilCizPoz(g, pr.x, pr.y, 1, 'ucus', tm); } catch (e) { omHataBildir('pirilCizPoz', e); }
      if (typeof D !== 'undefined') { D.x = pr.x; D.y = pr.y; }   // iniş anında Pırıl buradan normal uçuşuna devam eder
    }
  }

  // ── dokunma: zil (Feza / araçlar / annenin bisikleti), köpük, yüksek halka. Sürüş girdisini engellemez. ──
  function dokun(e) {
    if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12 || DURUM !== 'oyun' || e.target !== cv) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
    if (!Number.isFinite(wx) || !Number.isFinite(wy)) return;
    let isabet = false;
    for (let i = 0; i < KOPUK.length; i++) {
      const b = KOPUK[i]; if (!b.on || b.pat >= 0) continue;
      if (Math.hypot(wx - b.x, wy - b.y) < b.r + 24) { kopukPatla(b, aktif); isabet = true; }
    }
    for (const o of binisler) {
      const k = yol(o); if (!k) continue;
      for (const h of k.halka) if (h.al < 0 && k.faz === 'surus' && Math.hypot(wx - h.x, wy - h.y) < 40) { halkaAl(o, h); isabet = true; }
      if (isabet) continue;
      const binik = P.ucus === o, fx = binik ? P.x : k.x;
      // Feza'nın aracı ya da (binişte) Feza'nın kendisi
      if (Math.abs(wx - fx) < 42 && wy > k.zemin - (binik ? 100 : 60) && wy < k.zemin + 12 && (binik || k.faz === 'park' || k.faz === 'bitti')) {
        if (k.zil < 0.4) zilCal(o, 'feza');
        isabet = true; continue;
      }
      // annenin bisikleti
      const a = k.anne, AO = anneOlcu(), abx = a.faz === 'park' || a.faz === 'yuru' || a.faz === 'bitti' ? a.bx : a.x;
      if (Math.abs(wx - abx) < 70 && wy > k.zemin + AO.gidon[1] - 30 && wy < k.zemin + 12 && a.faz !== 'bin' && a.faz !== 'in') {
        if (a.zil < 0.4) zilCal(o, 'anne');
        isabet = true;
      }
    }
    // Olayı hiç durdurmuyoruz: binişte dokunmak hızlanmak da demektir; parkta araca dokunan çocuk Feza'yı oraya yürütür
    // (yanına varınca biner). isabet yalnız aynı dokunuşta birden çok zil çalmasın diye.
    return isabet;
  }
  if (typeof cv !== 'undefined' && cv) cv.addEventListener('pointerdown', dokun, true);

  TUR.kaydet('k12Binis', {
    kur, guncelle, ciz, cizOn,
    testBitir(o) {   // test kancası: binişi hemen sona getir (iniş animasyonu yine oynar)
      const k = yol(o); if (!k) return;
      if (k.faz === 'park') { P.x = k.x; basla(o); }
      if (k.faz === 'binis' || k.faz === 'surus') { k.faz = 'surus'; k.x = k.parkSon + 60 - 2; k.v = 20; }
      if (k.anne.faz === 'yuru' || k.anne.faz === 'bin') { k.anne.faz = 'sur'; k.anne.x = k.parkSon - 60 - 5; }
      else if (k.anne.faz === 'sur') k.anne.x = Math.max(k.anne.x, k.parkSon - 60 - 5);
    }
  });
  // nesneler önceden kurulduysa (bolum12.js TUR kaydından önce yüklendiyse) kur'u çalıştır
  for (let i = 0; i < NESNELER.length; i++) if (NESNELER[i].tip === 'k12Binis' && !NESNELER[i].yk) kur(NESNELER[i]);

  return {
    hiz() { return aktif ? clamp(aktif.yk.v / AYAR[aktif.yk.arac].vMax, 0, 1) : 0; },
    arac() { return aktif ? aktif.yk.arac : null; },
    pedal() { return !!(aktif && (aktif.yk.pedal || aktif.yk.itYerde)); },
    get aktif() { return aktif; },
    binisler,
    test: { bitir(ad) { const o = binisler.find(b => b.ad === ad); if (o) TUR.al('k12Binis').testBitir(o); } }
  };
})();
