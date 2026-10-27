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
  const ANNE_ARA = 158, ANNE_ARA_MIN = 112, ANNE_VMAX = 400;
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

  // ── küçük çizim yardımcıları ──
  function oval(c, x, y, rx, ry, renk, aci) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y, rx, ry, aci || 0, 0, TAU); c.fill(); }
  // Hacimli boru: koyu kenar, ana renk, ortada ince ışık (path çağırandan önce kurulmuş olmalı)
  function boruBoya(c, w, kenar, ana, isik) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = kenar; c.lineWidth = w; c.stroke();
    c.strokeStyle = ana; c.lineWidth = w * 0.68; c.stroke();
    if (isik) { c.globalAlpha *= 0.8; c.strokeStyle = isik; c.lineWidth = w * 0.22; c.stroke(); c.globalAlpha /= 0.8; }
  }
  function cizgi(c, x1, y1, x2, y2) { c.moveTo(x1, y1); c.lineTo(x2, y2); }

  // Telli tekerlek: lastik, jant, dönen teller (hızlıyken bulanık disk), göbek
  function tekerlek(c, cx, cy, r, aci, w, stil) {
    const hizli = clamp((Math.abs(w) - 9) / 14, 0, 1);   // açısal hız (rad/sn): teller hızlıda saydamlaşır
    // lastik
    c.beginPath(); c.arc(cx, cy, r - r * 0.08, 0, TAU);
    c.strokeStyle = stil.lastik || '#3a3f4a'; c.lineWidth = r * 0.17; c.stroke();
    if (stil.beyazYan) { c.beginPath(); c.arc(cx, cy, r - r * 0.2, 0, TAU); c.strokeStyle = '#f4f1ea'; c.lineWidth = r * 0.07; c.stroke(); }
    c.beginPath(); c.arc(cx, cy, r - r * 0.02, -2.4, -0.9); c.strokeStyle = 'rgba(255,255,255,.22)'; c.lineWidth = r * 0.05; c.stroke();
    // jant
    const jr = r * 0.76;
    c.beginPath(); c.arc(cx, cy, jr, 0, TAU); c.strokeStyle = stil.jant || '#cdd6de'; c.lineWidth = Math.max(1.2, r * 0.07); c.stroke();
    // bulanık disk (hız hissi)
    if (hizli > 0) { c.globalAlpha = 0.16 * hizli; oval(c, cx, cy, jr, jr, stil.tel || '#e8eef2'); c.globalAlpha = 1; }
    // teller: teğet örgü, göbekten janta
    const n = stil.tel_n || 16, gr = r * 0.12;
    c.globalAlpha = 0.85 * (1 - 0.65 * hizli);
    c.beginPath();
    for (let i = 0; i < n; i++) {
      const a = aci + i * TAU / n, b = a + (i % 2 ? 0.55 : -0.55);
      c.moveTo(cx + Math.cos(a) * gr, cy + Math.sin(a) * gr);
      c.lineTo(cx + Math.cos(b) * jr, cy + Math.sin(b) * jr);
    }
    c.strokeStyle = stil.tel || '#e8eef2'; c.lineWidth = Math.max(0.55, r * 0.028); c.stroke();
    c.globalAlpha = 1;
    // supap ve göbek (dönüşü okunur kılar)
    oval(c, cx + Math.cos(aci) * jr * 0.94, cy + Math.sin(aci) * jr * 0.94, r * 0.05, r * 0.05, '#f6d77a');
    oval(c, cx, cy, gr * 1.15, gr * 1.15, stil.gobek || '#8d99a4');
    oval(c, cx - gr * 0.3, cy - gr * 0.3, gr * 0.45, gr * 0.45, 'rgba(255,255,255,.7)');
  }
  // Çamurluk: teker üstünde yay
  function camurluk(c, cx, cy, r, a0, a1, renk, kenar) {
    c.beginPath(); c.arc(cx, cy, r, a0, a1);
    boruBoya(c, Math.max(2.4, r * 0.13), kenar, renk, 'rgba(255,255,255,.8)');
  }
  // Krank kolu + pedal (krank merkezi bx,by; açı a)
  function pedalKol(c, bx, by, kr, a, uzak) {
    const px = bx + Math.cos(a) * kr, py = by + Math.sin(a) * kr;
    c.beginPath(); cizgi(c, bx, by, px, py);
    boruBoya(c, Math.max(1.6, kr * 0.2), uzak ? '#6b737c' : '#7c858e', uzak ? '#9aa3ab' : '#c9d1d8', uzak ? null : '#f2f5f7');
    c.fillStyle = uzak ? '#4b5058' : '#3c4048';
    c.beginPath(); c.roundRect(px - kr * 0.42, py - kr * 0.12, kr * 0.84, kr * 0.24, kr * 0.1); c.fill();
    if (!uzak) { c.fillStyle = '#ffb347'; c.fillRect(px + kr * 0.25, py - kr * 0.06, kr * 0.14, kr * 0.12); }   // reflektör
  }
  // Zil: gidon üstünde küçük kubbe; z 0..1 çalarken titrer
  function zilCiz(c, x, y, s, z, tm) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(tm * 46) * 0.35 * z); c.scale(s, s);
    c.fillStyle = '#c99b2f'; c.fillRect(-0.6, 0, 1.2, 2.2);
    c.beginPath(); c.moveTo(-3.4, 0.4); c.quadraticCurveTo(-3.4, -3.6, 0, -3.8); c.quadraticCurveTo(3.4, -3.6, 3.4, 0.4); c.closePath();
    c.fillStyle = '#f5cf4e'; c.fill(); c.strokeStyle = '#b8892a'; c.lineWidth = 0.6; c.stroke();
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
      it: 0, itAktif: false, itYerde: false, birIt: 0, basOnce: false, egim: 0, yay: yayKur(), zil: 0, zilT: 0, ayak: 0, bekle: 0,
      renk: o.ad === 'yol2' ? RENK_ANNE.kampus : RENK_ANNE.nane,
      anne: { faz: 'park', x: nx(cBas) - 60, bx: nx(cBas) - 60, ax: 0, v: 0, t: 0, teker: 0, w: 0, krank: 0, krankW: 0, pedal: false,
        egim: 0, yay: yayKur(), zil: 0, zilBekle: -1, yon: 1, ilkZil: false },
      piril: { x: 0, y: 0, vx: 0, vy: 0, sevinc: 0 },
      surpriz: [], halka: [],
      poz: { u: 0, arac: arac(o), it: 0, krank: 0, hiz: 0, egim: 0, kask: KASK_RENK },
      anneOpt: { poz: 'bisiklet', u: 0, krank: 0, egim: 0, hiz: 0, bak: 0.2, yon: 1, zil: 0 }
    };
    o.x = k.x;
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
      try { ANNE12.devral(o); } catch (e) { omHataBildir('ANNE12.devral', e); }
      a.faz = 'yuru'; a.t = 0; a.ax = Number.isFinite(ANNE12.x) ? ANNE12.x : k.x - 120; a.v = 0;
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
      k.pedal = k.arac === 'bisiklet' && bas && kalan > 220;
      // sürtünme (süzülme), fren
      if (!(k.arac === 'scooter' && k.itYerde) && !k.pedal) ivme -= A.surt + A.surtK * k.v;
      if (fren) ivme -= 280;
      k.v = Math.max(0, Math.min(A.vMax, k.v + ivme * dt));
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
    const egimHedef = clamp(k.ivme / 2600, -0.05, 0.1) + (bas && k.faz === 'surus' ? 0.03 : 0);
    k.egim = lerp(k.egim, egimHedef, 1 - Math.exp(-dt * 4));
    // Feza
    P.x = k.x; P.y = k.zemin + yayBob(k.yay, k.v); P.vx = k.v; P.vy = 0; P.ground = true; P.f = 1;
    o.x = k.x;
    pozYaz(k);
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
    q.kask = KASK_RENK;
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
      if (ad < 1.5 || a.t > 6) { a.faz = 'bin'; a.t = 0; a.v = 0; a.yon = 1; }
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
      const izle = Math.min(k.x - ANNE_ARA, parkHedef);
      const fv = fezaBitti || k.x - ANNE_ARA >= parkHedef ? 0 : k.v;
      let vHedef = clamp(fv + (izle - a.x) * 1.1, 0, ANNE_VMAX);
      if (k.x - a.x < ANNE_ARA_MIN) vHedef = Math.min(vHedef, k.v * 0.85);
      const kalan = parkHedef - a.x;
      vHedef = Math.min(vHedef, Math.sqrt(2 * 130 * Math.max(0, kalan)));
      const v0 = a.v, maxIv = vHedef > a.v ? 170 : 240;
      a.v += clamp((vHedef - a.v) * 2.2, -maxIv, maxIv) * dt;
      if (a.v < 3 && vHedef < 3) a.v = 0;
      a.v = Math.max(0, a.v);
      a.x = Math.min(a.x + a.v * dt, parkHedef);
      a.pedal = vHedef > a.v - 4 && a.v > 2 && kalan > 150;
      a.w = a.v / AO.teker; a.teker += a.w * dt;
      krankAdim(a, dt, AO.teker, 2.4, 2.6);
      yayAdim(a.yay, dt, a.x + AO.onTeker[0], a.x + AO.arkaTeker[0], a.v);
      a.egim = lerp(a.egim, clamp((a.v - v0) / dt / 3000, -0.04, 0.06), 1 - Math.exp(-dt * 4));
      q.poz = 'bisiklet'; q.krank = a.krank; q.hiz = clamp(a.v / 300, 0, 1); q.egim = 0; q.yon = 1; q.u = 1;
      q.bak = clamp(0.15 + (k.x - a.x - ANNE_ARA) / 400, 0, 0.4);
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
    if (typeof ANNE12 !== 'undefined' && ANNE12) {
      ANNE12.x = a.x; ANNE12.y = k.zemin;
      if (typeof ANNE12.birak === 'function') { try { ANNE12.birak(o); } catch (e) { omHataBildir('ANNE12.birak', e); } }
    }
  }

  // ── zil ──
  function zilCal(o, kim) {
    const k = yol(o);
    let x, y;
    if (kim === 'anne') {
      const a = k.anne, AO = anneOlcu(), bx = a.faz === 'park' ? a.bx : a.x;
      a.zil = 1; x = bx + AO.gidon[0] + 6; y = k.zemin + AO.gidon[1] - 4;
    } else {
      const F = fezaOlcu(k.arac); k.zil = 1; x = k.x + F.gidon[0] - 3; y = k.zemin + F.gidon[1] - 3;
      if (k.anne.faz === 'sur' && k.anne.zilBekle < 0) k.anne.zilBekle = 0.45;
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
    const hx = P.x - 72 + Math.sin(tm * 0.8) * 16, hy = P.y - 128 + Math.sin(tm * 1.6) * 8 - pr.sevinc * 14;
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

  // Annenin bisikleti + anne (Feza'nın arkasında; 'ciz' katmanı)
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
    golge(g, bx, by, 82, 0.18);
    g.save(); g.translate(bx, by + bob); g.rotate(egim);
    const durum = AN_DURUM;
    durum.teker = parkta ? 0 : a.teker; durum.w = surus ? a.w : 0; durum.krank = a.krank; durum.zil = a.zil; durum.hiz = surus ? a.v : 0;
    durum.ayak = parkta ? 1 : a.faz === 'bin' ? 1 - smooth(clamp(a.t / 0.3, 0, 1)) : a.faz === 'in' ? smooth(clamp((a.t - ANNE_IN_SURE + 0.3) / 0.3, 0, 1)) : 0;
    anneBisikletCiz(g, AO, k.renk, durum, tm);
    const binik = a.faz === 'bin' || a.faz === 'sur' || a.faz === 'in';
    if (binik && anneVar()) {
      try { anne12Ciz(g, 0, 0, 1, tm, k.anneOpt); } catch (e) { omHataBildir('anne12Ciz', e); }
    }
    anneBisikletOnCiz(g, AO, durum, tm);
    g.restore();
    if (a.faz === 'yuru') anneYuruCiz(k, tm);
  }
  const AN_DURUM = { teker: 0, w: 0, krank: 0, zil: 0, hiz: 0, ayak: 1 };
  function anneYuruCiz(k, tm) {
    if (!anneVar()) return;
    try { anne12Ciz(g, k.anne.ax, k.zemin, 1, tm, k.anneOpt); } catch (e) { omHataBildir('anne12Ciz', e); }
  }
  function golge(c, x, y, rx, a) {
    c.globalAlpha = a; oval(c, x, y + 1, rx, 5.5, '#2f3a2c'); c.globalAlpha = a * 0.9; oval(c, x, y + 1, rx * 0.6, 3.5, '#2f3a2c'); c.globalAlpha = 1;
  }

  // ── annenin şehir bisikleti (köken yer-orta; ölçüler ANNE12_BISIKLET) ──
  function anneBisikletCiz(c, A, R, d, tm) {
    const r = A.teker, rA = A.arkaTeker, rO = A.onTeker, B = A.pedal, S = A.sele, G = A.gidon, kr = A.krank;
    const Ht = [rO[0] - 12, G[1] + 16], Hb = [rO[0] - 7, G[1] + 30];   // gidon borusu üstü/altı
    const Sp = [S[0] + 3, S[1] + 10];                                    // sele borusu ağzı
    // uzak pedal kolu (kadronun arkasında)
    pedalKol(c, B[0], B[1], kr, d.krank + Math.PI, true);
    // tekerlekler + çamurluklar
    const stil = { lastik: '#3b3f48', jant: '#d7dee5', tel: '#eef3f6', gobek: '#9aa5af', tel_n: 18 };
    tekerlek(c, rA[0], rA[1], r, d.teker, d.w, stil);
    tekerlek(c, rO[0], rO[1], r, d.teker, d.w, stil);
    camurluk(c, rA[0], rA[1], r + 3.2, Math.PI * 0.98, Math.PI * 1.92, R.camur, R.camurK);
    camurluk(c, rO[0], rO[1], r + 3.2, Math.PI * 1.12, Math.PI * 2.04, R.camur, R.camurK);
    oval(c, rA[0] - r - 2.2, rA[1] - 3, 1.6, 2.6, '#ff6f5e');            // arka reflektör
    // arka bagaj
    const bgY = rA[1] - r - 6;
    c.beginPath(); cizgi(c, rA[0] - 15, bgY, Sp[0] - 3, bgY); cizgi(c, rA[0] - 12, bgY, rA[0], rA[1]); cizgi(c, rA[0] - 2, bgY, rA[0] + 1, rA[1]);
    boruBoya(c, 2.2, '#7b858f', '#b8c2cb', null);
    // zincir: aynadan arka dişliye
    const ar = kr * 0.62;
    c.beginPath(); cizgi(c, B[0], B[1] - ar, rA[0], rA[1] - 3.4); cizgi(c, B[0], B[1] + ar, rA[0], rA[1] + 3.4);
    c.strokeStyle = '#5b6068'; c.lineWidth = 1.3; c.stroke();
    // kadro: alçak (step-through) çift kavisli boru, sele borusu, arka çatallar
    c.beginPath();
    c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(B[0] + 20, B[1] + 6, B[0] - 1, B[1] - 2);               // alt kavis
    c.moveTo(Hb[0] - 1, Hb[1] - 7); c.quadraticCurveTo(B[0] + 14, B[1] - 14, Sp[0] + 1, Sp[1] + 22);   // üst kavis
    c.moveTo(B[0], B[1]); c.lineTo(Sp[0], Sp[1]);                                                         // sele borusu
    c.moveTo(B[0], B[1]); c.lineTo(rA[0], rA[1]);                                                         // zincir çatalı
    c.moveTo(Sp[0] - 0.5, Sp[1] + 5); c.lineTo(rA[0], rA[1]);                                             // sele çatalı
    c.moveTo(Ht[0], Ht[1]); c.lineTo(Hb[0], Hb[1]);                                                       // gidon borusu
    boruBoya(c, 4.6, R.kenar, R.kadro, R.isik);
    // ön çatal
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(rO[0] - 1, rO[1] - 14, rO[0], rO[1]);
    boruBoya(c, 3.2, '#7b858f', '#c8d1d9', '#f4f7f9');
    // zincir muhafazası + aynalı dişli (krankla döner)
    c.save(); c.translate(B[0], B[1]); c.rotate(d.krank);
    c.beginPath(); for (let i = 0; i < 12; i++) { const a = i * TAU / 12; c.moveTo(Math.cos(a) * ar * 0.55, Math.sin(a) * ar * 0.55); c.lineTo(Math.cos(a) * ar, Math.sin(a) * ar); }
    c.strokeStyle = '#8f98a1'; c.lineWidth = 1.2; c.stroke(); c.restore();
    c.beginPath(); c.arc(B[0], B[1], ar + 1.5, Math.PI * 0.95, Math.PI * 2.05); c.lineTo(rA[0] + 4, rA[1] - 5); c.lineTo(rA[0] + 4, rA[1] - 1.5); c.closePath();
    c.fillStyle = R.kadro; c.globalAlpha = 0.92; c.fill(); c.globalAlpha = 1; c.strokeStyle = R.kenar; c.lineWidth = 0.9; c.stroke();
    c.beginPath(); c.moveTo(B[0] - ar, B[1] - ar * 0.55); c.lineTo(rA[0] + 6, rA[1] - 4); c.strokeStyle = R.isik; c.lineWidth = 1; c.stroke();
    oval(c, B[0], B[1], kr * 0.28, kr * 0.28, '#a9b3bc');
    // sele borusu + yaylı deri sele
    c.beginPath(); c.moveTo(Sp[0], Sp[1]); c.lineTo(S[0] + 1, S[1] + 3); boruBoya(c, 2.4, '#7b858f', '#d0d8df', null);
    c.beginPath(); for (let i = 0; i < 2; i++) { const yx = S[0] - 4 + i * 7; c.moveTo(yx, S[1] + 1.5); c.lineTo(yx, S[1] + 4.5); } c.strokeStyle = '#6c737b'; c.lineWidth = 1.4; c.stroke();
    c.beginPath(); c.moveTo(S[0] - 9, S[1] + 0.5); c.quadraticCurveTo(S[0] - 9, S[1] - 3.6, S[0] - 1, S[1] - 3.4); c.quadraticCurveTo(S[0] + 8, S[1] - 2.6, S[0] + 11, S[1] - 0.4);
    c.quadraticCurveTo(S[0] + 2, S[1] + 2.6, S[0] - 9, S[1] + 0.5); c.fillStyle = R.sele; c.fill();
    c.beginPath(); c.moveTo(S[0] - 7, S[1] - 2); c.quadraticCurveTo(S[0], S[1] - 3.4, S[0] + 7, S[1] - 1.8); c.strokeStyle = R.seleI; c.lineWidth = 1.1; c.stroke();
    // ön sepet (hasır) + içinde çiçekler; altında far
    const sx0 = Ht[0] + 4, sy0 = Ht[1] - 9, sw = 27, sh = 19;
    c.beginPath(); c.moveTo(sx0, sy0); c.lineTo(sx0 + sw, sy0); c.lineTo(sx0 + sw - 3, sy0 + sh); c.lineTo(sx0 + 3, sy0 + sh); c.closePath();
    c.fillStyle = '#d9a866'; c.fill(); c.strokeStyle = '#9c6b37'; c.lineWidth = 1.2; c.stroke();
    c.beginPath();
    for (let i = 1; i < 5; i++) { const yy = sy0 + i * sh / 5; c.moveTo(sx0 + 0.6 * i, yy); c.lineTo(sx0 + sw - 0.6 * i, yy); }
    for (let i = 1; i < 7; i++) { const xx = sx0 + i * sw / 7; c.moveTo(xx, sy0); c.lineTo(xx - (xx - sx0 - sw / 2) * 0.12, sy0 + sh); }
    c.strokeStyle = 'rgba(140,90,45,.55)'; c.lineWidth = 0.7; c.stroke();
    c.beginPath(); c.moveTo(sx0 - 1, sy0); c.lineTo(sx0 + sw + 1, sy0); c.strokeStyle = '#b98345'; c.lineWidth = 2.4; c.stroke();
    // sepette piknik bohçası ve çiçekler (rüzgârda hafif sallanır)
    const sal = Math.sin(tm * 3.1) * 0.5 * clamp(d.hiz / 200, 0.2, 1);
    oval(c, sx0 + 9, sy0 - 2, 7, 5, '#f26b6b'); oval(c, sx0 + 7, sy0 - 4, 2.5, 1.6, '#fff4f4');
    const cicek = ['#ffd84d', '#ff9ec7', '#ffffff'];
    for (let i = 0; i < 3; i++) {
      const fx = sx0 + 16 + i * 4 + sal * (i + 1), fy = sy0 - 9 - (i % 2) * 4;
      c.beginPath(); c.moveTo(sx0 + 15 + i * 3, sy0 + 1); c.quadraticCurveTo(sx0 + 16 + i * 3.5, sy0 - 4, fx, fy); c.strokeStyle = '#5aa35a'; c.lineWidth = 1; c.stroke();
      for (let j = 0; j < 5; j++) { const a = j * TAU / 5 + tm * 0.2; oval(c, fx + Math.cos(a) * 2, fy + Math.sin(a) * 2, 1.6, 1.6, cicek[i]); }
      oval(c, fx, fy, 1.1, 1.1, '#f5a623');
    }
    c.fillStyle = '#f7f1dc'; c.beginPath(); c.roundRect(Hb[0] + 2, Hb[1] - 6, 6, 5, 2); c.fill();   // far
    oval(c, Hb[0] + 7.8, Hb[1] - 3.5, 1.3, 2, '#fff8c8');
    // gidon: kısa boğaz, geriye kıvrık şehir gidonu, sap
    const St = [Ht[0] - 1, G[1] + 5];
    c.beginPath(); c.moveTo(Ht[0], Ht[1]); c.lineTo(St[0], St[1]); c.quadraticCurveTo(St[0] + 8, G[1] - 3, G[0] + 4, G[1] - 0.5);
    boruBoya(c, 2.6, '#7b858f', '#d0d8df', '#f7f9fb');
    c.beginPath(); c.moveTo(G[0] + 4.5, G[1] - 0.6); c.lineTo(G[0] - 3, G[1] + 0.4); boruBoya(c, 3.6, '#4a3a2e', '#7d5d45', null);   // sap
    zilCiz(c, St[0] + 4, St[1] - 1.5, 1, d.zil, tm);
    // park ayağı: parkta yere iner, sürerken çatal boyunca katlanır
    const ay = d.ayak, pv = [B[0] - 7, B[1] + 2];
    const uc = [lerp(pv[0] - 24, pv[0] - 9, ay), lerp(pv[1] - 3, -0.5, ay)];
    c.beginPath(); c.moveTo(pv[0], pv[1]); c.lineTo(uc[0], uc[1]); boruBoya(c, 2, '#6c737b', '#a8b1ba', null);
  }
  // Yakın pedal kolu: annenin yakın ayağının altında görünsün diye en son
  function anneBisikletOnCiz(c, A, d) {
    pedalKol(c, A.pedal[0], A.pedal[1], A.krank, d.krank, false);
    oval(c, A.pedal[0], A.pedal[1], A.krank * 0.22, A.krank * 0.22, '#c3ccd4');
  }

  // ── Feza'nın mavi kick scooter'ı ──
  function scooterCiz(c, F, d, tm) {
    const TK = SCOOTER_TEKER, r = TK.r, ar = TK.arka, on = TK.on, G = F.gidon, dy = F.ayak[1];
    const isik = clamp(d.hiz / 120, 0, 1) * 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(tm * 3));
    // ışıklı tekerlerin parıltısı (arkada, yumuşak)
    c.globalCompositeOperation = 'lighter';
    const li = Math.floor((d.teker / TAU) * 3) % 3, lr = LED[(li + 3) % 3], lo = LED[(li + 4) % 3];
    lekeCiz(c, lr, ar[0], ar[1], r * 3.2, 0.55 * isik); lekeCiz(c, lo, on[0], on[1], r * 3.2, 0.55 * isik);
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    // tekerlekler (saydam poliüretan, içinde dönen LED'ler)
    ledTeker(c, ar[0], ar[1], r, d.teker, isik, li);
    ledTeker(c, on[0], on[1], r, d.teker, isik, li + 1);
    // arka fren çamurluğu
    c.beginPath(); c.arc(ar[0], ar[1], r + 1.8, Math.PI * 1.32, Math.PI * 1.96);
    boruBoya(c, 2.6, '#1e5a9a', '#3f9be6', '#bfe4ff');
    // tabla: alçak, iki tekerin arasında sarkık; hacimli, kaymaz bant, yıldız çıkartmalar
    const x0 = ar[0] + 4, x1 = on[0] - 7, th = 3.6;
    c.beginPath(); c.moveTo(x0 - 3, dy - 1.2); c.quadraticCurveTo(ar[0] + 1, ar[1] - 0.5, ar[0] + 2.5, ar[1] - 2.5);   // arka kol: tabladan göbeğe
    boruBoya(c, 3, '#1d5ea6', '#3b9df0', null);
    c.fillStyle = '#1d5ea6'; c.beginPath(); c.roundRect(x0, dy, x1 - x0, th, th / 2); c.fill();
    c.fillStyle = '#3b9df0'; c.beginPath(); c.roundRect(x0, dy - 0.6, x1 - x0, th * 0.7, th * 0.35); c.fill();
    c.fillStyle = '#2c3a52'; c.beginPath(); c.roundRect(x0 + 3, dy - 1, x1 - x0 - 7, 1.3, 0.6); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x0 + 2, dy + 0.3, x1 - x0 - 4, 0.5);
    c.fillStyle = '#ffe27a'; yildiz4(c, x0 + 8, dy + 1.8, 1.3); c.fillStyle = '#ff9fc6'; yildiz4(c, x0 + 21, dy + 1.8, 1.2);
    // boyun + çatal + T-çubuk (ön teker üstündeki başlıktan yükselir)
    const Hb = [on[0] - 2.5, on[1] - r - 3.5], Ht = [G[0] + 2, G[1] + 4];
    c.beginPath(); c.moveTo(x1 - 1.5, dy + 1); c.quadraticCurveTo(Hb[0] - 2, dy, Hb[0], Hb[1]);
    boruBoya(c, 4.2, '#1d5ea6', '#3b9df0', '#bfe4ff');
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.lineTo(on[0], on[1]); boruBoya(c, 2.6, '#7d8792', '#c9d2da', '#f5f8fa');
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.lineTo(Ht[0], Ht[1]); boruBoya(c, 3.2, '#1d5ea6', '#47a7f2', '#d3edff');
    c.fillStyle = '#f2f5f8'; c.beginPath(); c.roundRect(lerp(Hb[0], Ht[0], 0.35) - 2.3, lerp(Hb[1], Ht[1], 0.35) - 1.4, 4.6, 2.8, 1); c.fill();   // kelepçe
    // sap (yandan): kısa çubuk, pembe elcik ve püsküller
    c.beginPath(); c.moveTo(G[0] - 4, G[1] + 0.6); c.lineTo(G[0] + 4, G[1] - 0.6); boruBoya(c, 3.4, '#c9457d', '#ff8fbf', '#ffd6e8');
    const p = clamp(d.hiz / 200, 0, 1);
    for (let i = 0; i < 3; i++) {
      const sx = G[0] - 4, sy = G[1] + 0.5, uz = 6 + i * 1.2, a = 1.9 - p * 1.25 + Math.sin(tm * (7 + i) + i) * (0.12 + p * 0.15);
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.cos(a) * uz * 0.5 + 1, sy + Math.sin(a) * uz * 0.5, sx + Math.cos(a) * uz, sy + Math.sin(a) * uz);
      c.strokeStyle = PARILTI[i]; c.lineWidth = 1; c.stroke();
    }
    zilCiz(c, G[0] + 1, G[1] - 1.8, 0.75, d.zil, tm);
    oval(c, Hb[0] + 2.5, Hb[1] + 1, 1.6, 1.6, '#fff4b0');   // ön lamba
    if (d.kaskAsili) kaskCiz(c, G[0] + 1, G[1] + 9, 0.5, tm);
    // park ayağı
    const ay = d.ayak, pv = [x0 + 8, dy + th], uc = [lerp(pv[0] - 8, pv[0] - 5, ay), lerp(pv[1] + 0.2, -0.3, ay)];
    c.beginPath(); c.moveTo(pv[0], pv[1]); c.lineTo(uc[0], uc[1]); c.strokeStyle = '#6c737b'; c.lineWidth = 1.3; c.lineCap = 'round'; c.stroke();
  }
  function ledTeker(c, cx, cy, r, aci, isik, li) {
    oval(c, cx, cy, r, r, '#d6f0ff');
    c.globalAlpha = 0.85; oval(c, cx, cy, r * 0.78, r * 0.78, '#9fd8f6'); c.globalAlpha = 1;
    c.beginPath(); c.arc(cx, cy, r - 0.7, 0, TAU); c.strokeStyle = '#4f8fc0'; c.lineWidth = 1.4; c.stroke();
    // dönen üç LED: yanınca parlak, dururken soluk
    for (let i = 0; i < 3; i++) {
      const a = aci + i * TAU / 3, lx = cx + Math.cos(a) * r * 0.5, ly = cy + Math.sin(a) * r * 0.5;
      c.globalAlpha = 0.35 + 0.65 * isik; oval(c, lx, ly, r * 0.2, r * 0.2, LED[(li + i) % 3]);
    }
    c.globalAlpha = 1;
    oval(c, cx, cy, r * 0.24, r * 0.24, '#eef5fa'); oval(c, cx - r * 0.06, cy - r * 0.06, r * 0.1, r * 0.1, '#ffffff');
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
    const Ht = [on[0] - 7, G[1] + 9], Hb = [on[0] - 4, G[1] + 18], Sp = [S[0] + 2, S[1] + 6];
    const kad = '#e8392b', ken = '#9e2219', isk = '#ff9c86', lac = '#24346b', lacI = '#4a64a8';
    const p = clamp(d.hiz / 220, 0, 1);
    // flama: arka göbekten yükselen esnek direk, ucunda dalgalanan üçgen bayrak
    const fx0 = ar[0] - 3, fy0 = ar[1] - 2, boy = 78, egil = 6 + p * 16 + Math.sin(tm * 2.3) * 1.5;
    const ux = fx0 - egil, uy = fy0 - boy + egil * 0.25;
    c.beginPath(); c.moveTo(fx0, fy0); c.quadraticCurveTo(fx0 - egil * 0.2, fy0 - boy * 0.55, ux, uy);
    c.strokeStyle = '#e8edf2'; c.lineWidth = 1.2; c.lineCap = 'round'; c.stroke();
    const dal = tm * (5 + p * 9);
    c.beginPath(); c.moveTo(ux, uy);
    for (let i = 1; i <= 5; i++) { const u = i / 5; c.lineTo(ux - u * 27, uy + u * 4.5 + Math.sin(dal - u * 4) * 3 * u); }
    for (let i = 5; i >= 0; i--) { const u = i / 5; c.lineTo(ux - u * 27, uy + 14 - u * 9 + Math.sin(dal - u * 4 + 0.4) * 3 * u); }
    c.closePath(); c.fillStyle = '#ffb347'; c.fill();
    c.beginPath(); c.moveTo(ux, uy + 4.8); for (let i = 1; i <= 5; i++) { const u = i / 5; c.lineTo(ux - u * 24, uy + 6.2 - u * 0.8 + Math.sin(dal - u * 4 + 0.2) * 3 * u); }
    c.strokeStyle = '#fff3c4'; c.lineWidth = 1.2; c.stroke();
    oval(c, ux, uy, 1.4, 1.4, '#ffe27a');
    // uzak pedal kolu
    pedalKol(c, B[0], B[1], kr, d.krank + Math.PI, true);
    // tekerlekler (beyaz yanaklı) + çamurluklar
    const stil = { lastik: '#3e4250', jant: '#e9edf1', tel: '#f4f7f9', gobek: lac, tel_n: 14, beyazYan: true };
    tekerlek(c, ar[0], ar[1], r, d.teker, d.w, stil);
    tekerlek(c, on[0], on[1], r, d.teker, d.w, stil);
    camurluk(c, ar[0], ar[1], r + 2.4, Math.PI * 1.0, Math.PI * 1.85, '#f7f9fc', lac);
    camurluk(c, on[0], on[1], r + 2.4, Math.PI * 1.15, Math.PI * 1.98, '#f7f9fc', lac);
    // kadro: eğimli üst boru, alt boru, sele borusu, çatallar
    c.beginPath();
    c.moveTo(Ht[0], Ht[1] + 2); c.lineTo(Sp[0], Sp[1] + 1.5);
    c.moveTo(Hb[0], Hb[1]); c.lineTo(B[0], B[1]);
    c.moveTo(B[0], B[1]); c.lineTo(Sp[0], Sp[1]);
    c.moveTo(B[0], B[1]); c.lineTo(ar[0], ar[1]);
    c.moveTo(Sp[0], Sp[1] + 1); c.lineTo(ar[0], ar[1]);
    c.moveTo(Ht[0], Ht[1]); c.lineTo(Hb[0], Hb[1]);
    boruBoya(c, 3.4, ken, kad, isk);
    c.beginPath(); c.moveTo(Hb[0], Hb[1]); c.quadraticCurveTo(on[0], on[1] - 6, on[0], on[1]); boruBoya(c, 2.6, '#8b95a0', '#d5dde4', '#f7f9fb');
    // tam zincir muhafazası (çocuk bisikleti)
    c.beginPath(); c.moveTo(B[0] - kr * 0.2, B[1] - kr * 0.85); c.lineTo(ar[0] + 2, ar[1] - 3.2); c.arc(ar[0], ar[1], 3.6, -Math.PI / 2, Math.PI / 2);
    c.lineTo(B[0] - kr * 0.2, B[1] + kr * 0.85); c.arc(B[0], B[1], kr * 0.88, Math.PI / 2, Math.PI * 1.5); c.closePath();
    c.fillStyle = lac; c.fill(); c.strokeStyle = '#162248'; c.lineWidth = 0.8; c.stroke();
    simsek(c, (B[0] + ar[0]) / 2 + 1, B[1] - 0.2, 3.4);   // sarı şimşek çıkartma
    oval(c, B[0], B[1], kr * 0.4, kr * 0.4, '#d9dfe5');
    // sele
    c.beginPath(); c.moveTo(Sp[0], Sp[1]); c.lineTo(S[0] + 1, S[1] + 2); boruBoya(c, 1.8, '#8b95a0', '#d5dde4', null);
    c.beginPath(); c.moveTo(S[0] - 5.5, S[1] + 0.3); c.quadraticCurveTo(S[0] - 5, S[1] - 2.6, S[0], S[1] - 2.2); c.quadraticCurveTo(S[0] + 5, S[1] - 1.6, S[0] + 6.5, S[1]);
    c.quadraticCurveTo(S[0], S[1] + 2, S[0] - 5.5, S[1] + 0.3); c.fillStyle = lac; c.fill(); c.strokeStyle = '#162248'; c.lineWidth = 0.8; c.stroke();
    c.beginPath(); c.moveTo(S[0] - 3.5, S[1] - 1.2); c.quadraticCurveTo(S[0] + 1, S[1] - 2.4, S[0] + 5, S[1] - 0.6); c.strokeStyle = lacI; c.lineWidth = 0.8; c.stroke();
    // kadroda beyaz yıldızlar, gidon borusunda küçük far
    c.fillStyle = '#ffffff'; yildiz4(c, lerp(Ht[0], Sp[0], 0.38), lerp(Ht[1] + 2, Sp[1] + 1.5, 0.38) - 0.2, 1.5);
    c.fillStyle = '#ffffff'; yildiz4(c, lerp(Hb[0], B[0], 0.45), lerp(Hb[1], B[1], 0.45), 1.3);
    c.fillStyle = lac; c.beginPath(); c.roundRect(Ht[0] + 1.2, Ht[1] + 1.5, 4.4, 3.6, 1.6); c.fill();
    oval(c, Ht[0] + 5.2, Ht[1] + 3.3, 1.1, 1.6, '#fff6c2');
    // gidon + elcik püskülleri
    c.beginPath(); c.moveTo(Ht[0], Ht[1]); c.lineTo(Ht[0] - 0.5, G[1] + 3); c.quadraticCurveTo(Ht[0] + 3, G[1] - 1.5, G[0] + 2.5, G[1] - 0.2);
    boruBoya(c, 2.2, '#8b95a0', '#d5dde4', '#f7f9fb');
    c.beginPath(); c.moveTo(G[0] + 2.8, G[1] - 0.3); c.lineTo(G[0] - 2.8, G[1] + 0.3); boruBoya(c, 3, '#162248', lac, lacI);
    for (let i = 0; i < 4; i++) {
      const sx = G[0] - 3, sy = G[1] + 0.4, uz = 7 + (i % 2) * 1.5, a = 2.0 - p * 1.35 + Math.sin(tm * (8 + i) + i * 1.3) * (0.1 + p * 0.18);
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.cos(a) * uz * 0.5 + 1, sy + Math.sin(a) * uz * 0.5, sx + Math.cos(a) * uz, sy + Math.sin(a) * uz);
      c.strokeStyle = PUSKUL[i]; c.lineWidth = 1.1; c.stroke();
    }
    zilCiz(c, Ht[0] + 1, G[1] + 1, 0.75, d.zil, tm);
    // kask park hâlinde gidonda asılı (Feza binince başına geçer)
    if (d.kaskAsili) kaskCiz(c, G[0] - 1, G[1] + 8, 0.55, tm);
    // destek tekerleği (yakın taraf; arka tekerin önünde)
    const dr = TK.destekR, dx = ar[0] - 7, dyy = -dr;
    c.beginPath(); c.moveTo(ar[0], ar[1]); c.lineTo(dx + 1, dyy - 1); boruBoya(c, 2, '#8b95a0', '#d5dde4', null);
    tekerlek(c, dx, dyy, dr, d.teker * r / dr, d.w * r / dr, { lastik: '#4a4e5a', jant: '#ffffff', tel: '#c9d3ea', gobek: kad, tel_n: 6 });
  }
  function kaskCiz(c, x, y, s, tm) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(tm * 1.7) * 0.06); c.scale(s, s);
    c.beginPath(); c.moveTo(-15, 2); c.quadraticCurveTo(-15, -17, 0, -18); c.quadraticCurveTo(15, -17, 16, 2); c.closePath();
    c.fillStyle = KASK_RENK; c.fill(); c.strokeStyle = '#4c97c4'; c.lineWidth = 1.4; c.stroke();
    c.beginPath(); c.moveTo(-9, -14); c.quadraticCurveTo(0, -19, 9, -14); c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.stroke();
    oval(c, -6, -9, 4, 2.4, 'rgba(255,255,255,.6)', -0.4);
    c.restore();
  }

  // Feza'nın aracı ('ciz': Feza'nın arkasında). Binişte P.x/P.y (çizim konumu, ara-kare yumuşatmalı) kullanılır.
  function fezaAracCiz(o, tm) {
    const k = yol(o), binik = P.ucus === o;
    const x = binik ? P.x : k.x, y = binik ? P.y : k.zemin;
    if (x < cam.x - 200 || x > cam.x + VW + 200) return;
    const F = fezaOlcu(k.arac);
    const ayak = k.faz === 'park' || k.faz === 'bitti' ? 1 : k.faz === 'binis' ? 1 - smooth(clamp(k.t / 0.35, 0, 1)) : k.faz === 'inis' ? smooth(clamp((k.t - INIS_SURE + 0.3) / 0.3, 0, 1)) : 0;
    const d = AC_DURUM;
    d.teker = k.teker; d.w = k.faz === 'surus' ? k.w : 0; d.krank = k.krank; d.zil = k.zil; d.hiz = k.v; d.ayak = ayak;
    d.kaskAsili = kaskDestek() && (k.faz === 'park' || k.faz === 'bitti');
    const TK = k.arac === 'bisiklet' ? KUCUK_TEKER : SCOOTER_TEKER;
    golge(g, k.faz === 'surus' || k.faz === 'binis' || k.faz === 'inis' ? x : k.x, k.zemin, k.arac === 'bisiklet' ? 44 : 38, 0.2);
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
  function ruzgarCiz(k, tm) {
    const a = clamp((k.v - 170) / 110, 0, 1) * 0.45;
    if (a <= 0.01) return;
    g.strokeStyle = '#ffffff'; g.lineWidth = 1.3; g.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const f = ((tm * 2.2 + i * 0.37) % 1), x = P.x - 40 - f * 70, y = P.y - 30 - i * 18 - Math.sin(i * 2.1) * 6;
      g.globalAlpha = a * Math.sin(f * Math.PI);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x - 14, y - 2, x - 28, y + 1); g.stroke();
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
