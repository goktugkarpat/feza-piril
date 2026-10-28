/* etkinlik12.js — Bölüm 12'nin yürürken yaşanan üç etkinliği (sözleşme: src/BOLUM12.md).
   k12Bahce   lojman çiçek tarhı (sütun 12–60): yol kenarındaki uykulu tomurcuklar Feza yanından geçince yaylanarak açılır
              (renk dalgası, uçuşan minik yapraklar, parıltı). Dokunulan çiçek daha da büyür ve içinden bir sabun köpüğü çıkar (böcek yok kuralı).
              Anne yolda açılmış bir çiçeğin başında eğilip onu koklar (ANNE12.kisaPoz 'kokla'; takip bozulmaz).
   k12Ucurtma FASS çimenliği (315–440): anne Pırıl desenli uçurtmayı Feza'ya uzatır (Feza durmaz). Feza yürüdükçe/koştukça
              uçurtma arkasında rüzgârda yükselir; ip ve kuyruk kurdeleleri Verlet zinciri. Dokununca takla atar, kurdeleler
              renk saçar. Çimenlik bitince uçurtma süzülüp annenin çantasına girer.
   k12Bilgi   Bilgi Merkezi havuzu (460–555): havuz kenarından geçerken fıskiyeler sırayla coşar, damlalarda gökkuşağı;
              resimli kitap sayfaları kuş gibi kanat çırpıp Feza'ya eşlik eder. Dokunulan sayfa açılır, içinden ışıkla küçük bir
              resim (yıldız, balina, ejderha, balon) belirir; yazı yok.
   HİÇBİRİ Feza'yı durdurmaz: P.ucus / P.kilit kullanılmaz, panel/perde/ışınlanma yok, anne devralınmaz.
   Dokunma: pencerede yakalama evresinde pointerdown. Uçurtma ve sayfa isabeti olayı yutar (Feza oraya yürümesin);
   çiçek ve fıskiye isabeti yutmaz (Feza dokunduğu yere doğru yürür, bu doğal). Klavye yedeği: Enter / E.
   Ses yok: yalnız olay (ad listesi istek/ETKINLIK_to_MUZIK_1.md). Bütün resimler ilk kullanımda bir kez küçük tuvale çizilir,
   karede gradyan/dizi üretilmez; parçacıklar sabit havuzdan gelir. Test kancası: window.ETK12. */
'use strict';
(() => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12) return;

  // ════════════════════ ortak yardımcılar ════════════════════
  const TAM = Math.PI * 2;
  const sinir = (v, a, b) => v < a ? a : v > b ? b : v;
  const yumusak = v => { v = sinir(v, 0, 1); return v * v * (3 - 2 * v); };
  const karma = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };   // sabit sözde rastgele 0..1
  const aciFark = (a, b) => { let d = (b - a) % TAM; if (d > Math.PI) d -= TAM; if (d < -Math.PI) d += TAM; return d; };
  const RENK = ['#ff7fa8', '#ffd25e', '#8fd3ff', '#b79bff', '#8fe0a6', '#ff9f6e'];
  const GOK7 = ['#ff6b6b', '#ffa94d', '#ffe066', '#8ce99a', '#74c0fc', '#9775fa', '#f783ac'];

  function olay(ad, v) { try { OLAY.emit(ad, v); } catch (_) { /* olay dinleyicisinin hatası etkinliği durdurmasın */ } }
  function oyunda() { return DURUM === 'oyun' && !P.ucus; }

  // Küçük önbellek tuvali: 2 kat çözünürlük, çizim dünya birimiyle yapılır; gw/gh dünya boyutudur.
  function onbellek(w, h, ciz) {
    const t = document.createElement('canvas');
    t.width = Math.ceil(w * 2); t.height = Math.ceil(h * 2);
    const c = t.getContext('2d'); c.scale(2, 2); ciz(c, w, h);
    t.gw = w; t.gh = h;
    return t;
  }
  // Dünya noktasına dönmüş/ölçekli dönüşüm kur (tek setTransform, save/restore yok). q: dönmeden sonra dikey basıklık.
  function yerlestir(x, y, aci, sx, sy, q) {
    const c = Math.cos(aci), s = Math.sin(aci), k = q === undefined ? 1 : q;
    g.setTransform(S * sx * c, S * k * sx * s, -S * sy * s, S * k * sy * c, (x - cam.x) * S, (y - cam.y) * S);
  }
  function dunyaya() { g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S); }
  // Sprite'ı kurulu dönüşümün başlangıcına (ax, ay) çapa oranıyla koy.
  function koy(t, ax, ay) { g.drawImage(t, -t.gw * ax, -t.gh * ay, t.gw, t.gh); }
  function elips(c, x, y, rx, ry, renk, aci) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y, rx, ry, aci || 0, 0, TAM); c.fill(); }
  function cizgiGenis(c, renk, w) { c.strokeStyle = renk; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }
  function yildizYol(c, x, y, r, ic, n) {
    c.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * ic : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    c.closePath();
  }
  // Gün ışığı tonu (dunya12.js varsa): {ton, guc}
  function gunIsigi() {
    if (typeof dn12Isik !== 'function') return null;
    try { const L = dn12Isik(); return L && typeof L.ton === 'string' && L.guc > 0.02 ? L : null; } catch (_) { return null; }
  }

  // ── annenin ve Feza'nın elleri (API yoksa yaklaşık yer) ──
  const ANNE_EL = { x: 0, y: 0 }, ANNE_CANTA = { x: 0, y: 0 }, FEZA_EL = { x: 0, y: 0 };
  function anneVar() { return typeof ANNE12 !== 'undefined' && ANNE12 && Number.isFinite(ANNE12.x) && Number.isFinite(ANNE12.y); }
  function anneYon() { return anneVar() && ANNE12.yon === -1 ? -1 : 1; }
  function anneEli() {
    const E = typeof ANNE12_ELLER !== 'undefined' ? ANNE12_ELLER : null;
    if (anneVar() && E && Number.isFinite(E.onX) && Number.isFinite(E.onY) && Math.abs(E.onX - ANNE12.x) < 120) { ANNE_EL.x = E.onX; ANNE_EL.y = E.onY; }
    else if (anneVar() && Number.isFinite(ANNE12.elX) && Number.isFinite(ANNE12.elY)) { ANNE_EL.x = ANNE12.elX; ANNE_EL.y = ANNE12.elY; }
    else if (anneVar()) { ANNE_EL.x = ANNE12.x + 16 * anneYon(); ANNE_EL.y = ANNE12.y - 66; }
    else { ANNE_EL.x = P.x - 110 * (P.f || 1); ANNE_EL.y = P.y - 66; }
    return ANNE_EL;
  }
  function anneCantasi() {
    if (anneVar() && Number.isFinite(ANNE12.cantaX) && Number.isFinite(ANNE12.cantaY)) { ANNE_CANTA.x = ANNE12.cantaX; ANNE_CANTA.y = ANNE12.cantaY; }
    else if (anneVar()) { ANNE_CANTA.x = ANNE12.x - 12 * anneYon(); ANNE_CANTA.y = ANNE12.y - 62; }
    else { ANNE_CANTA.x = P.x - 120 * (P.f || 1); ANNE_CANTA.y = P.y - 62; }
    return ANNE_CANTA;
  }
  // Kısa poz yalnız "yürürken" biçimiyle istenir: anne durmaz, takip ve adımları bozulmaz, yalnız üst gövdesi poz verir.
  // anne12.js bunu desteklemiyorsa (ANNE12.yuruyerekPoz yok) hiç istenmez: anne dursun da sonra koşsun istemiyoruz.
  function anneYuruyerekPoz(poz, sure, opt) {
    if (typeof ANNE12 === 'undefined' || !ANNE12 || typeof ANNE12.kisaPoz !== 'function' || ANNE12.yuruyerekPoz !== true) return false;
    opt.yuruyerek = true;
    try { return ANNE12.kisaPoz(poz, sure, opt) !== false; } catch (_) { return false; }
  }
  const KOKLA_OPT = { hedefX: 0, yuruyerek: true };
  const VER_OPT = { hedefX: 0, yuruyerek: true, u: 0 };
  const KOKLA_SURE = 1.3;
  const SEVINC_OPT = { hedefX: 0, yuruyerek: true };
  let sonAnneSevinci = -99;
  function anneSevindi(x) {
    if (now - sonAnneSevinci < 5 || P.ucus || Math.abs(P.x - x) > 500) return;
    SEVINC_OPT.hedefX = x;
    if (anneYuruyerekPoz('alkis', 1.15, SEVINC_OPT)) sonAnneSevinci = now;
  }
  // En küçük hedef de tablette yaklaşık 48 CSS piksel olsun; görünür resim büyümez.
  function dokunmaYari(r) { return Math.max(r, Math.min(64, 24 * DPR / S)); }
  // Uçurtma ipini tutan el: FEZA12 'ucurtma' pozunun eli (P.a_ipX/Y), yoksa ön el, o da yoksa omuz hizası.
  function fezaEli() {
    const fx = P.rx !== undefined ? P.rx : P.x, fy = P.ry !== undefined ? P.ry : P.y;
    if (Number.isFinite(P.a_ipX) && Number.isFinite(P.a_ipY) && Math.abs(P.a_ipX - fx) < 70) { FEZA_EL.x = P.a_ipX; FEZA_EL.y = P.a_ipY; }
    else if (Number.isFinite(P.a_elX) && Number.isFinite(P.a_elY) && Math.abs(P.a_elX - fx) < 70) { FEZA_EL.x = P.a_elX; FEZA_EL.y = P.a_elY; }
    else { FEZA_EL.x = fx - (P.f || 1) * 6; FEZA_EL.y = fy - 56; }
    return FEZA_EL;
  }
  function fezaPoz(poz, opt) { if (typeof fezaPoz12 === 'function') { try { fezaPoz12(poz, opt); } catch (_) { /* poz yoksa normal çizim */ } } }

  // ── uçuşan minik yapraklar / taç yaprakları (sabit havuz) ──
  const UCUSAN = [];
  for (let i = 0; i < 72; i++) UCUSAN.push({ aktif: false, x: 0, y: 0, vx: 0, vy: 0, aci: 0, va: 0, omur: 0, max: 1, renk: '#fff', boy: 1, yesil: false, faz: 0 });
  function yaprakAt(x, y, vx, vy, renk, boy, yesil) {
    let p = null;
    for (let i = 0; i < UCUSAN.length; i++) if (!UCUSAN[i].aktif) { p = UCUSAN[i]; break; }
    if (!p) return;
    p.aktif = true; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.aci = Math.random() * TAM; p.va = (Math.random() - .5) * 9;
    p.max = p.omur = 1.3 + Math.random() * 1.1; p.renk = renk; p.boy = boy; p.yesil = !!yesil; p.faz = Math.random() * TAM;
  }
  function ucusanGuncelle(dt) {
    for (let i = 0; i < UCUSAN.length; i++) {
      const p = UCUSAN[i]; if (!p.aktif) continue;
      p.omur -= dt; if (p.omur <= 0) { p.aktif = false; continue; }
      p.vx += Math.sin(now * 3.1 + p.faz) * 70 * dt; p.vx *= 1 - dt * 1.4;   // havada salınarak süzülür
      p.vy += 130 * dt; p.vy *= 1 - dt * 2.2;
      p.x += p.vx * dt; p.y += p.vy * dt; p.aci += p.va * dt;
    }
  }
  function ucusanCiz() {
    for (let i = 0; i < UCUSAN.length; i++) {
      const p = UCUSAN[i]; if (!p.aktif) continue;
      if (p.x < cam.x - 40 || p.x > cam.x + VW + 40) continue;
      const a = Math.min(1, p.omur / .5), cevir = Math.abs(Math.cos(now * 5 + p.faz));   // dönerken ince görünür
      g.globalAlpha = a;
      g.fillStyle = p.renk;
      g.beginPath(); g.ellipse(p.x, p.y, 4.2 * p.boy, (1 + 2.4 * cevir) * p.boy, p.aci, 0, TAM); g.fill();
      if (p.yesil) { g.strokeStyle = 'rgba(40,110,60,.5)'; g.lineWidth = .7; g.beginPath(); g.moveTo(p.x - Math.cos(p.aci) * 3.5 * p.boy, p.y - Math.sin(p.aci) * 3.5 * p.boy); g.lineTo(p.x + Math.cos(p.aci) * 3.5 * p.boy, p.y + Math.sin(p.aci) * 3.5 * p.boy); g.stroke(); }
    }
    g.globalAlpha = 1;
  }

  // ── yerde yayılan renk halkaları (sabit havuz) ──
  const HALKA = [];
  for (let i = 0; i < 10; i++) HALKA.push({ aktif: false, x: 0, y: 0, r: 0, hiz: 0, omur: 0, max: 1, renk: '#fff' });
  function halkaAt(x, y, renk, hiz, omur) {
    let h = null;
    for (let i = 0; i < HALKA.length; i++) if (!HALKA[i].aktif) { h = HALKA[i]; break; }
    if (!h) { h = HALKA[0]; for (let i = 1; i < HALKA.length; i++) if (HALKA[i].omur < h.omur) h = HALKA[i]; }
    h.aktif = true; h.x = x; h.y = y; h.r = 6; h.hiz = hiz; h.omur = h.max = omur; h.renk = renk;
  }
  function halkaGuncelle(dt) {
    for (let i = 0; i < HALKA.length; i++) { const h = HALKA[i]; if (!h.aktif) continue; h.omur -= dt; h.r += h.hiz * dt * (.4 + h.omur / h.max); if (h.omur <= 0) h.aktif = false; }
  }
  function halkaCiz() {
    for (let i = 0; i < HALKA.length; i++) {
      const h = HALKA[i]; if (!h.aktif) continue;
      const u = h.omur / h.max;
      g.globalAlpha = u * .75; g.strokeStyle = h.renk; g.lineWidth = 1.5 + 3.5 * u;
      g.beginPath(); g.ellipse(h.x, h.y, h.r, h.r * .2, 0, 0, TAM); g.stroke();
      g.globalAlpha = u * .2; g.fillStyle = h.renk; g.fill();
    }
    g.globalAlpha = 1;
  }

  // Ortak havuzlar karede bir kez ilerler (hangi nesne görünürse görünsün).
  let sonGuncelle = -1;
  function ortakGuncelle(dt) {
    if (sonGuncelle === now) return; sonGuncelle = now;
    ucusanGuncelle(dt); halkaGuncelle(dt); kelebekGuncelle(dt);
  }
  // Çok geniş nesne kamerada kalsın: çizim ayıklaması o.x'e bakar, o.x bölgenin içinde kameranın ortasını izler.
  function kameraIzle(o) { o.x = sinir(cam.x + VW * .5, o.x0, o.x1); }

  // ════════════════════ ÇİÇEK TARHI (k12Bahce) ════════════════════
  const CICEK_PAL = [
    { yap: '#ff8fb5', koyu: '#e05d86', acik: '#ffd6e4', orta: '#ffd35c', ortaK: '#e89a2c' },   // pembe
    { yap: '#ffd15c', koyu: '#eba02c', acik: '#fff1b5', orta: '#f6874a', ortaK: '#c95b22' },   // sarı
    { yap: '#b9a0ff', koyu: '#8a6ae0', acik: '#e8deff', orta: '#ffe17a', ortaK: '#e3a93a' },   // lila
    { yap: '#ff9f7a', koyu: '#e66c48', acik: '#ffd9c8', orta: '#ffe58c', ortaK: '#e0a440' },   // mercan
    { yap: '#fdfdfa', koyu: '#d7dbe6', acik: '#ffffff', orta: '#ffc93c', ortaK: '#e08f1c' },   // papatya beyazı
    { yap: '#86cdff', koyu: '#4e98e0', acik: '#d8efff', orta: '#fff09a', ortaK: '#e2b64a' },   // mavi
  ];
  const SPR_YAPRAK = [], SPR_YAPRAK_UZUN = [], SPR_TOMURCUK = [], SPR_ORTA = [], SPR_KANAT = [];
  let SPR_YESIL = null;

  function yaprakSpr(pal, uzun) {
    const dizi = uzun ? SPR_YAPRAK_UZUN : SPR_YAPRAK;
    if (dizi[pal]) return dizi[pal];
    const R = CICEK_PAL[pal], w = uzun ? 10 : 15, h = uzun ? 22 : 18;
    dizi[pal] = onbellek(w + 2, h + 2, c => {
      const cx = (w + 2) / 2, alt = h + 1, ust = 1;
      const gr = c.createLinearGradient(0, alt, 0, ust);
      gr.addColorStop(0, R.koyu); gr.addColorStop(.42, R.yap); gr.addColorStop(1, R.acik);
      c.beginPath(); c.moveTo(cx, alt);
      c.bezierCurveTo(cx - w * .64, alt - h * .4, cx - w * .55, ust, cx, ust + 1);
      c.bezierCurveTo(cx + w * .55, ust, cx + w * .64, alt - h * .4, cx, alt);
      c.fillStyle = gr; c.fill();
      c.globalAlpha = .5; c.strokeStyle = R.koyu; c.lineWidth = .7; c.stroke();
      // orta damar ve uçta parlaklık: yaprak düz çıkartma gibi durmasın
      c.globalAlpha = .55; c.beginPath(); c.moveTo(cx, alt - 2); c.quadraticCurveTo(cx - .5, alt - h * .4, cx, alt - h * .6); cizgiGenis(c, R.acik, .8);
      c.globalAlpha = .45; elips(c, cx - w * .17, ust + h * .3, w * .12, h * .15, '#ffffff', -.25);
    });
    dizi[pal].ay = (h + 1) / (h + 2);
    return dizi[pal];
  }
  function tomurcukSpr(pal) {
    if (SPR_TOMURCUK[pal]) return SPR_TOMURCUK[pal];
    const R = CICEK_PAL[pal];
    SPR_TOMURCUK[pal] = onbellek(16, 24, c => {
      // renkli damla biçimli tomurcuk + iki yeşil çanak yaprağı
      const gr = c.createLinearGradient(0, 22, 0, 2);
      gr.addColorStop(0, R.koyu); gr.addColorStop(.5, R.yap); gr.addColorStop(1, R.acik);
      c.beginPath(); c.moveTo(8, 22); c.bezierCurveTo(1, 17, 2, 6, 8, 1.5); c.bezierCurveTo(14, 6, 15, 17, 8, 22);
      c.fillStyle = gr; c.fill(); c.globalAlpha = .45; c.strokeStyle = R.koyu; c.lineWidth = .7; c.stroke(); c.globalAlpha = 1;
      c.beginPath(); c.moveTo(8, 4); c.quadraticCurveTo(6.5, 12, 8, 20); cizgiGenis(c, R.koyu, .6);
      elips(c, 5.6, 8, 1.4, 3, 'rgba(255,255,255,.45)', -.3);
      for (const s of [-1, 1]) {
        c.beginPath(); c.moveTo(8, 23); c.quadraticCurveTo(8 + s * 8, 20, 8 + s * 4.5, 12); c.quadraticCurveTo(8 + s * 2.5, 18, 8, 21);
        c.fillStyle = s < 0 ? '#5aa45a' : '#4b9150'; c.fill();
      }
    });
    return SPR_TOMURCUK[pal];
  }
  function ortaSpr(pal) {
    if (SPR_ORTA[pal]) return SPR_ORTA[pal];
    const R = CICEK_PAL[pal];
    SPR_ORTA[pal] = onbellek(16, 16, c => {
      const gr = c.createRadialGradient(6.5, 6.5, 1, 8, 8, 7.5);
      gr.addColorStop(0, '#fff6c8'); gr.addColorStop(.45, R.orta); gr.addColorStop(1, R.ortaK);
      c.fillStyle = gr; c.beginPath(); c.arc(8, 8, 7, 0, TAM); c.fill();
      for (let i = 0; i < 11; i++) { const a = i * 2.4, r = 2 + (i % 4) * 1.3; elips(c, 8 + Math.cos(a) * r, 8 + Math.sin(a) * r, .55, .55, 'rgba(150,80,20,.35)'); }
    });
    return SPR_ORTA[pal];
  }
  function yesilYaprakSpr() {
    if (SPR_YESIL) return SPR_YESIL;
    SPR_YESIL = onbellek(20, 9, c => {
      const gr = c.createLinearGradient(0, 0, 0, 9); gr.addColorStop(0, '#8fd07a'); gr.addColorStop(1, '#4c9a52');
      c.beginPath(); c.moveTo(.5, 4.5); c.quadraticCurveTo(8, -1.5, 19.5, 4.5); c.quadraticCurveTo(8, 10.5, .5, 4.5);
      c.fillStyle = gr; c.fill();
      c.beginPath(); c.moveTo(1.5, 4.5); c.quadraticCurveTo(10, 3.6, 17, 4.5); cizgiGenis(c, 'rgba(225,250,200,.6)', .6);
    });
    SPR_YESIL.ay = .5;
    return SPR_YESIL;
  }
  function kanatSpr(pal) {
    if (SPR_KANAT[pal]) return SPR_KANAT[pal];
    const R = CICEK_PAL[pal === 4 ? 1 : pal];
    SPR_KANAT[pal] = onbellek(19, 22, c => {
      const gr = c.createLinearGradient(0, 0, 19, 18); gr.addColorStop(0, R.koyu); gr.addColorStop(.55, R.yap); gr.addColorStop(1, R.acik);
      c.fillStyle = gr;
      c.beginPath(); c.moveTo(1, 10); c.bezierCurveTo(3, -1, 18, -2, 17.5, 6.5); c.quadraticCurveTo(16, 11, 1, 11.5); c.fill();
      c.beginPath(); c.moveTo(1, 11.5); c.bezierCurveTo(9, 11, 14, 16, 11.5, 20.5); c.quadraticCurveTo(6, 22.5, 1, 12.5); c.fill();
      c.globalAlpha = .6; c.strokeStyle = R.koyu; c.lineWidth = .8;
      c.beginPath(); c.moveTo(1, 10); c.bezierCurveTo(3, -1, 18, -2, 17.5, 6.5); c.quadraticCurveTo(16, 11, 1, 11.5); c.stroke();
      c.globalAlpha = .85; elips(c, 12, 5.5, 2.4, 2, '#ffffff'); elips(c, 8, 15.5, 1.6, 1.4, '#ffffff'); elips(c, 15.2, 8.6, 1, 1, '#fff6c0');
    });
    return SPR_KANAT[pal];
  }

  // ── kelebekler (sabit havuz): dokunulan çiçekten çıkar, bir süre Feza'nın çevresinde uçar, sonra göğe süzülür ──
  const KELEBEK = [];
  for (let i = 0; i < 6; i++) KELEBEK.push({ aktif: false, x: 0, y: 0, vx: 0, vy: 0, pal: 0, yas: 0, omur: 10, faz: 0, yon: 1, cikX: 0, cikY: 0 });
  function kelebekCikar(x, y, pal) {
    let b = null;
    for (let i = 0; i < KELEBEK.length; i++) if (!KELEBEK[i].aktif) { b = KELEBEK[i]; break; }
    if (!b) return false;
    b.aktif = true; b.x = b.cikX = x; b.y = b.cikY = y; b.vx = (Math.random() - .5) * 40; b.vy = -90; b.pal = pal;
    b.yas = 0; b.omur = 8 + Math.random() * 3; b.faz = Math.random() * TAM; b.yon = 1;
    return true;
  }
  function kelebekGuncelle(dt) {
    for (let i = 0; i < KELEBEK.length; i++) {
      const b = KELEBEK[i]; if (!b.aktif) continue;
      b.yas += dt;
      let tx, ty;
      if (b.yas < 1.1) { tx = b.cikX + Math.sin(b.faz) * 30; ty = b.cikY - 70; }                        // çiçekten yükselir
      else if (b.yas < b.omur) {                                                                          // Feza'nın başı çevresinde döner
        tx = P.x + Math.sin(b.yas * .8 + b.faz) * 70 + (P.vx || 0) * .25;
        ty = P.y - 105 - Math.sin(b.yas * 1.3 + b.faz * 2) * 30;
      } else { tx = b.x + 260 * (b.faz > Math.PI ? 1 : -1); ty = b.y - 420; }                             // göğe süzülüp gider
      b.vx += ((tx - b.x) * 2.1 - b.vx * 1.6) * dt + Math.sin(now * 6.3 + b.faz) * 110 * dt;
      b.vy += ((ty - b.y) * 2.1 - b.vy * 1.6) * dt + Math.cos(now * 7.7 + b.faz) * 130 * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      if (Math.abs(b.vx) > 12) b.yon = b.vx > 0 ? 1 : -1;
      if (b.yas > b.omur + 3.5) b.aktif = false;
    }
  }
  function kelebekCiz() {
    for (let i = 0; i < KELEBEK.length; i++) {
      const b = KELEBEK[i]; if (!b.aktif) continue;
      if (b.x < cam.x - 40 || b.x > cam.x + VW + 40) continue;
      const a = b.yas > b.omur ? Math.max(0, 1 - (b.yas - b.omur) / 3.5) : Math.min(1, b.yas * 3);
      if (a <= .01) continue;
      // CLAUDE.md "böcek yok": çiçekten artık kelebek değil, gökkuşağı yanardönerli bir SABUN KÖPÜĞÜ çıkar (aynı uçuş yolu)
      const r = 13 + Math.sin(b.faz * 3) * 2.5, sal = Math.sin(now * 3.1 + b.faz) * .08;   // iri: Feza'nın başının çevresinde okunur
      dunyaya();
      g.globalAlpha = a * .18; g.fillStyle = '#eaf6ff'; g.beginPath(); g.ellipse(b.x, b.y, r * (1 + sal), r * (1 - sal), 0, 0, TAM); g.fill();
      g.globalAlpha = a * .85; g.lineWidth = 1.4;
      g.strokeStyle = '#ffffff'; g.beginPath(); g.ellipse(b.x, b.y, r * (1 + sal), r * (1 - sal), 0, 0, TAM); g.stroke();
      g.lineWidth = 1.6;   // yanardöner kenar: pembe, sarı, mavi yaylar
      g.strokeStyle = '#ffb3d9'; g.beginPath(); g.ellipse(b.x, b.y, r * (1 + sal) - 1.2, r * (1 - sal) - 1.2, 0, .2, 1.3); g.stroke();
      g.strokeStyle = '#fff1a0'; g.beginPath(); g.ellipse(b.x, b.y, r * (1 + sal) - 1.2, r * (1 - sal) - 1.2, 0, 1.3, 2.3); g.stroke();
      g.strokeStyle = '#a8d8ff'; g.beginPath(); g.ellipse(b.x, b.y, r * (1 + sal) - 1.2, r * (1 - sal) - 1.2, 0, 3.6, 4.6); g.stroke();
      g.globalAlpha = a * .95; g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(b.x - r * .38, b.y - r * .4, r * .22, r * .13, -.6, 0, TAM); g.fill();
    }
    g.globalAlpha = 1;
  }

  // ── çiçek kurulumu ──
  function cicekYap(x, y, i, on) {
    const r = karma(i * 3.7 + 11), lale = karma(i * 2.3 + 5) < .28;
    return {
      x, y, on, i, lale,
      pal: (i * 5 + Math.floor(karma(i * 1.9) * 3)) % CICEK_PAL.length,
      uzun: !lale && karma(i * 4.1 + 2) < .45,                       // papatya gibi ince uzun yapraklı mı
      n: lale ? 3 : 5 + Math.floor(karma(i * 6.3) * 3),
      boy: (on ? 30 : 26) + r * 18, olc: (on ? 1.15 : 1) + karma(i * 1.7) * .24,
      don: karma(i * 8.1) * TAM, faz: karma(i * 13.3) * TAM,
      a: 0, av: 0, hedef: 0, buyuk: 0, bv: 0, bHedef: 0,           // açılma ve büyüme yayları
      egim: 0, ev: 0,                                                // sap eğimi (rüzgâr, Feza'nın sürtünmesi)
      bekle: -1, cevap: -1, acildi: false, kelebek: false, dokunT: 0, parla: 0, koklaT: 0,
      hx: x, hy: y - 40                                              // taç merkezi (çizimde güncellenir; dokunma için)
    };
  }
  function bahceKur(o) {
    o.x0 = Number.isFinite(o.x0) ? o.x0 : o.x - 24 * T; o.x1 = Number.isFinite(o.x1) ? o.x1 : o.x + 24 * T; o.merkez = o.x;
    const k = o.k = { cicekler: [], acilan: 0, kokla: { sayi: 0, hedef: null, sonX: -1e9, bekle: 0 }, dokunuldu: 0 };
    let x = o.x0 + 20, i = 0;
    while (x < o.x1 - 10) {                                    // arka sıra: yolun arka kenarı, Feza'nın arkasında
      k.cicekler.push(cicekYap(x, o.y - 8 - karma(i * 9.1) * 7, i, false));
      x += 58 + karma(i * 7.7) * 46; i++;
    }
    x = o.x0 + 150;
    while (x < o.x1 - 40) {                                    // seyrek ön sıra: kaldırımın önündeki çimende
      k.cicekler.push(cicekYap(x, o.y + 70 + karma(i * 2.9) * 6, i, true));
      x += 230 + karma(i * 5.3) * 120; i++;
    }
  }
  function cicekAc(o, f, buyuk) {
    const k = o.k, R = CICEK_PAL[f.pal];
    if (!f.acildi) {
      f.acildi = true; f.hedef = 1; f.av += 6; f.parla = 1; f.bekle = -1;
      k.acilan++; if (typeof V12 !== 'undefined' && V12) V12.cicek = (V12.cicek || 0) + 1;
      halkaAt(f.x, f.y + 2, R.yap, 150, .9);
      for (let j = 0; j < 5; j++) yaprakAt(f.hx, f.hy, (Math.random() - .5) * 120, -60 - Math.random() * 80, j % 2 ? R.yap : R.acik, .8 + Math.random() * .4, false);
      if (j2 % 3 === 0) yaprakAt(f.x, f.y - f.boy * .5, (Math.random() - .5) * 80, -70, '#7cc46e', 1, true);
      j2++;
      burst(f.hx, f.hy, 6, ['#fff6c4', R.acik, R.yap], 70, .7, 5);
      olay('k12CicekActi', { o, x: f.x, y: f.hy, n: typeof V12 !== 'undefined' && V12 ? V12.cicek : k.acilan, buyuk: false });
    }
    if (buyuk) {
      if (f.dokunT > 0) return;                                  // art arda dokunuşta bir an bekle
      f.dokunT = .35; f.parla = 1;
      if (f.bHedef < 1) { f.bHedef = 1; f.bv += 5; } else f.bv += 3.5;   // yeniden dokununca neşeli bir sekme
      halkaAt(f.x, f.y + 2, R.yap, 240, 1.2);
      for (let j = 0; j < 9; j++) yaprakAt(f.hx, f.hy, (Math.random() - .5) * 190, -90 - Math.random() * 120, j % 3 ? R.yap : R.acik, .9 + Math.random() * .5, false);
      burst(f.hx, f.hy, 12, ['#fff6c4', R.acik, R.yap, '#ffffff'], 130, .9, 7);
      if (!f.kelebek && kelebekCikar(f.hx, f.hy - 6, f.pal)) { f.kelebek = true; olay('k12Kelebek', { o, x: f.hx, y: f.hy }); }
      olay('k12CicekActi', { o, x: f.x, y: f.hy, n: typeof V12 !== 'undefined' && V12 ? V12.cicek : k.acilan, buyuk: true });
    }
  }
  let j2 = 0;   // ara sıra yeşil yaprak da uçsun diye sayaç

  function bahceGuncelle(o, dt) {
    if (!(dt > 0)) return; dt = Math.min(dt, 1 / 30);
    ortakGuncelle(dt); kameraIzle(o);
    const k = o.k, px = P.x, pvx = P.vx || 0, t = now;
    for (let i = 0; i < k.cicekler.length; i++) {
      const f = k.cicekler[i], dx = f.x - px;
      // Feza yaklaşınca (önünden ya da yanından geçerken) küçük bir gecikmeyle açılır
      if (!f.acildi && f.bekle < 0 && DURUM === 'oyun' && Math.abs(P.y - o.y) < 160 && (Math.abs(dx) < 70 || (dx > 0 && dx < 135 && pvx > 60) || (dx < 0 && dx > -135 && pvx < -60))) f.bekle = .04 + karma(f.i * 2.2) * .16;
      if (f.bekle >= 0) { f.bekle -= dt; if (f.bekle < 0) cicekAc(o, f, false); }
      // yaylar: açılma biraz taşar (sevimli patlama), sonra yerine oturur
      f.av += ((f.hedef - f.a) * 95 - f.av * 8.5) * dt; f.a += f.av * dt;
      f.bv += ((f.bHedef - f.buyuk) * 70 - f.bv * 7) * dt; f.buyuk += f.bv * dt;
      // sap: rüzgârda salınır, Feza yanından geçerken sürtünüp eğilir
      let hedefEgim = .06 * Math.sin(t * 1.5 + f.faz) + .03 * Math.sin(t * 3.7 + f.faz * 2);
      if (Math.abs(dx) < 34 && Math.abs(pvx) > 20 && !f.on) hedefEgim += sinir(pvx / 250, -1, 1) * .4 * (1 - Math.abs(dx) / 34);
      if (f.koklaT > 0) { f.koklaT -= dt; hedefEgim -= .25 * anneYon() * Math.sin(Math.PI * sinir(f.koklaT / KOKLA_SURE, 0, 1)); }   // anneye doğru uzanır
      f.ev += ((hedefEgim - f.egim) * 60 - f.ev * 6) * dt; f.egim += f.ev * dt;
      // Dokunulan çiçeğin komşuları uzaklık sırasıyla başlarını kaldırır: küçük bir bahçe dalgası.
      if (f.cevap >= 0) {
        f.cevap -= dt;
        if (f.cevap < 0) {
          if (!f.acildi) cicekAc(o, f, false);
          else { f.bv += 1.7; f.parla = Math.max(f.parla, .7); }
        }
      }
      f.dokunT = Math.max(0, f.dokunT - dt); f.parla = Math.max(0, f.parla - dt * 1.2);
    }
    annenKoklamasi(o, dt);
  }
  // Anne tarhta bir kez, yürümesini hiç bozmadan, açık bir çiçeğin yanından geçerken eğilip onu koklar.
  // Çağrı çiçeğe varmadan biraz önce yapılır: eğilme tam çiçeğin hizasında olur.
  function annenKoklamasi(o, dt) {
    const K = o.k.kokla;
    if (K.sayi >= 1 || !anneVar() || DURUM !== 'oyun' || P.ucus || o.k.acilan < 4) return;
    const ax = ANNE12.x, yon = anneYon(), avx = Number.isFinite(ANNE12.vx) ? Math.abs(ANNE12.vx) : 200;
    if (K.hedef && (K.hedef.x - ax) * yon < 0) K.hedef = null;          // çiçeği geçti: sıradakini seç
    if (!K.hedef) {
      let en = null, enD = 1e9;
      for (let i = 0; i < o.k.cicekler.length; i++) {
        const f = o.k.cicekler[i]; if (!f.acildi || f.on) continue;
        const d = (f.x - ax) * yon;
        if (d > 30 && d < 320 && d < enD) { en = f; enD = d; }
      }
      K.hedef = en;
    }
    const f = K.hedef; if (!f) return;
    const ileri = (f.x - ax) * yon, erken = sinir(avx * .25, 12, 70);   // hızlı yürüyorsa biraz daha erken eğilsin
    if (ileri > 0 && ileri < erken) {
      KOKLA_OPT.hedefX = f.x;
      if (anneYuruyerekPoz('kokla', KOKLA_SURE, KOKLA_OPT)) { f.koklaT = KOKLA_SURE; K.sayi++; olay('k12AnneKokla', { o, x: f.x }); }
      K.hedef = null;
    }
  }

  // ── çiçek çizimi ──
  function cicekCiz(f, t) {
    const R = CICEK_PAL[f.pal], olc = f.olc * (1 + .45 * Math.max(-.2, f.buyuk));
    const ac = Math.max(0, f.a), ac01 = sinir(f.a, 0, 1);
    const H = f.boy * (.82 + .18 * ac01) * (1 + .12 * Math.max(0, f.buyuk));
    // açılmadan önce Feza yaklaşırken tomurcuk heyecanla kıpırdar
    let kipir = 0;
    if (!f.acildi) { const d = Math.abs(f.x - P.x); if (d < 260) kipir = Math.sin(t * 10 + f.faz) * .07 * (1 - d / 260); }
    const egim = f.egim + kipir, hx = f.x + Math.sin(egim) * H, hy = f.y - Math.cos(egim) * H;
    f.hx = hx; f.hy = hy;
    // sap
    g.beginPath(); g.moveTo(f.x, f.y); g.quadraticCurveTo(f.x + Math.sin(egim) * H * .15, f.y - H * .55, hx, hy);
    cizgiGenis(g, '#3f7d4a', 3.6); cizgiGenis(g, '#78bd68', 1.6);
    // sap yaprakları
    const ys = yesilYaprakSpr(), lx = f.x + Math.sin(egim) * H * .12, ly = f.y - H * .34, yb = .75 + .25 * ac01;
    yerlestir(lx, ly, -2.35 + egim * .6 + Math.sin(t * 1.9 + f.faz) * .06, yb, yb); koy(ys, 0, ys.ay);
    yerlestir(lx, ly + 5, -.75 + egim * .6 - Math.sin(t * 2.1 + f.faz) * .06, yb * .9, yb * .9); koy(ys, 0, ys.ay);
    // ışıltı: yeni açılmış ya da dokunulmuş çiçeğin arkasında yumuşak renkli hale
    dunyaya();
    if (f.parla > .02) dglow(R.yap, hx, hy, 34 * olc, f.parla * .55);
    if (f.buyuk > .5) dglow('#fff3c4', hx, hy, 26 * olc, .18 + .06 * Math.sin(t * 3 + f.faz));
    const bas = egim * .8;
    // tomurcuk (kapalıyken): açıldıkça söner
    const tomA = 1 - yumusak(ac01 / .42);
    if (tomA > .01) {
      const ts = tomurcukSpr(f.pal);
      g.globalAlpha = tomA;
      yerlestir(hx, hy + 4 * olc, bas, olc * (1 + .35 * ac01), olc * (1 - .25 * ac01)); koy(ts, .5, .9);
      dunyaya();
      if (tomA > .6) {   // uykulu minik gözler
        const fy = hy - 6 * olc;
        g.strokeStyle = 'rgba(90,50,70,.75)'; g.lineWidth = .8; g.lineCap = 'round';
        g.beginPath(); g.moveTo(hx - 3.4 * olc, fy); g.quadraticCurveTo(hx - 2.2 * olc, fy + 1.3 * olc, hx - 1 * olc, fy);
        g.moveTo(hx + 1 * olc, fy); g.quadraticCurveTo(hx + 2.2 * olc, fy + 1.3 * olc, hx + 3.4 * olc, fy); g.stroke();
      }
    }
    const yapA = yumusak((ac01 - .06) / .34);
    if (yapA > .01) {
      g.globalAlpha = yapA;
      if (f.lale) laleCiz(f, hx, hy, olc, ac, ac01, bas);
      else tacCiz(f, hx, hy, olc, ac, ac01, bas);
      dunyaya();
      if (ac01 > .55) yuzCiz(f, hx, hy, olc, yumusak((ac01 - .55) / .4) * yapA);
    }
    g.globalAlpha = 1;
  }
  // Yuvarlak taç: kapalıyken yukarı toplanmış yapraklar açıldıkça çevreye dağılır; arkada biraz dönük ikinci halka.
  function tacCiz(f, hx, hy, olc, ac, ac01, bas) {
    const spr = yaprakSpr(f.pal, f.uzun), n = f.n, boy = olc * (.4 + .6 * Math.min(ac, 1.25)), q = .9;
    for (let h = 0; h < 2; h++) {
      const kat = h === 0 ? .82 : 1, kayma = h === 0 ? Math.PI / n : 0;
      for (let i = 0; i < n; i++) {
        const acikAci = f.don + kayma + i * TAM / n, kapali = -Math.PI / 2 + (i - (n - 1) / 2) * .2;
        const fi = kapali + aciFark(kapali, acikAci) * ac01 + bas;
        yerlestir(hx, hy, fi + Math.PI / 2, boy * kat, boy * kat * (h === 0 ? .9 : 1), q); koy(spr, .5, spr.ay);
      }
    }
    const os = ortaSpr(f.pal), ob = olc * (.55 + .45 * ac01);
    yerlestir(hx, hy, bas, ob, ob, q); koy(os, .5, .5);
  }
  // Lale: üç ön yaprak kadeh gibi; açıldıkça dışa kıvrılır.
  function laleCiz(f, hx, hy, olc, ac, ac01, bas) {
    const spr = yaprakSpr(f.pal, true), b = olc * (.75 + .35 * Math.min(ac, 1.25)), yay = .14 + .55 * ac;
    yerlestir(hx, hy + 6 * olc, bas - yay * .55, b * .95, b * 1.05); koy(spr, .5, spr.ay);
    yerlestir(hx, hy + 6 * olc, bas + yay * .55, b * .95, b * 1.05); koy(spr, .5, spr.ay);
    if (ac01 > .6) { const os = ortaSpr(f.pal); g.globalAlpha *= yumusak((ac01 - .6) / .4); yerlestir(hx, hy - 2 * olc, bas, olc * .55, olc * .55); koy(os, .5, .5); }
    yerlestir(hx - 4.5 * olc, hy + 6 * olc, bas - yay, b, b * 1.12); koy(spr, .5, spr.ay);
    yerlestir(hx + 4.5 * olc, hy + 6 * olc, bas + yay, b, b * 1.12); koy(spr, .5, spr.ay);
    yerlestir(hx, hy + 6 * olc, bas, b * 1.05, b * 1.2); koy(spr, .5, spr.ay);
  }
  // Mutlu minik yüz: Feza'ya bakar; koklanırken ya da büyükken gözleri mutlulukla kapanır.
  function yuzCiz(f, hx, hy, olc, a) {
    if (a <= .02) return;
    const bak = sinir((P.x - f.x) / 160, -1, 1) * 1.1 * olc, mutlu = f.koklaT > 0 || f.buyuk > .5, cy = hy + (f.lale ? 1 : 0);
    g.globalAlpha = a;
    if (mutlu) {
      g.strokeStyle = '#7a4a1a'; g.lineWidth = .9; g.lineCap = 'round';
      g.beginPath();
      g.moveTo(hx - 3.2 * olc + bak, cy - .8 * olc); g.quadraticCurveTo(hx - 2.1 * olc + bak, cy - 2.5 * olc, hx - 1 * olc + bak, cy - .8 * olc);
      g.moveTo(hx + 1 * olc + bak, cy - .8 * olc); g.quadraticCurveTo(hx + 2.1 * olc + bak, cy - 2.5 * olc, hx + 3.2 * olc + bak, cy - .8 * olc);
      g.stroke();
    } else {
      elips(g, hx - 2.1 * olc + bak, cy - 1.2 * olc, .9 * olc, 1.15 * olc, '#4a2a10');
      elips(g, hx + 2.1 * olc + bak, cy - 1.2 * olc, .9 * olc, 1.15 * olc, '#4a2a10');
      elips(g, hx - 1.8 * olc + bak, cy - 1.6 * olc, .35 * olc, .35 * olc, '#ffffff');
      elips(g, hx + 2.4 * olc + bak, cy - 1.6 * olc, .35 * olc, .35 * olc, '#ffffff');
    }
    g.strokeStyle = '#7a4a1a'; g.lineWidth = .8;
    g.beginPath(); g.moveTo(hx - 1.4 * olc + bak, cy + 1.1 * olc); g.quadraticCurveTo(hx + bak, cy + 2.6 * olc, hx + 1.4 * olc + bak, cy + 1.1 * olc); g.stroke();
    elips(g, hx - 3.8 * olc + bak, cy + 1 * olc, 1.2 * olc, .65 * olc, 'rgba(255,120,150,.5)');
    elips(g, hx + 3.8 * olc + bak, cy + 1 * olc, 1.2 * olc, .65 * olc, 'rgba(255,120,150,.5)');
    g.globalAlpha = 1;
  }
  // Koklanan çiçekten anneye doğru süzülen minik kalp ve kokular
  function kokuCiz(f, t) {
    if (f.koklaT <= 0) return;
    const u = 1 - f.koklaT / KOKLA_SURE, yon = -anneYon();
    for (let j = 0; j < 3; j++) {
      const v = sinir(u * 1.4 - j * .2, 0, 1); if (v <= 0 || v >= 1) continue;
      const x = f.hx + yon * v * 26 + Math.sin(v * 9 + j) * 4, y = f.hy - 8 - v * 34, s = 2.2 + j * .5;
      g.globalAlpha = Math.sin(Math.PI * v) * .9;
      kalpCiz(x, y, s, j === 1 ? '#ffb3c8' : '#ff8fb1');
    }
    g.globalAlpha = 1;
  }
  function bahceCiz(o, tm, onSira) {
    const k = o.k, sol = cam.x - 80, sag = cam.x + VW + 80;
    if (!onSira) halkaCiz();
    for (let i = 0; i < k.cicekler.length; i++) {
      const f = k.cicekler[i]; if (f.on !== onSira || f.x < sol || f.x > sag) continue;
      cicekCiz(f, tm); kokuCiz(f, tm);
    }
    if (onSira) { ucusanCiz(); kelebekCiz(); }
    dunyaya(); g.globalAlpha = 1;
  }
  function bahceDokun(o, p) {
    const k = o.k; let en = null, enD = 1e9;
    for (let i = 0; i < k.cicekler.length; i++) {
      const f = k.cicekler[i], r = dokunmaYari(30 * f.olc * (1 + .45 * Math.max(0, f.buyuk)) + 10);
      const d = Math.hypot(p.x - f.hx, (p.y - f.hy) * 1.15);
      if (d < r && d < enD) { en = f; enD = d; }
      else if (!en && Math.abs(p.x - f.x) < 18 && p.y < f.y + 6 && p.y > f.hy) { en = f; enD = d; }   // sapa dokunmak da sayılır
    }
    if (!en) return 0;
    k.dokunuldu++; cicekAc(o, en, true);
    for (let i = 0; i < k.cicekler.length; i++) {
      const f = k.cicekler[i], d = Math.abs(f.x - en.x);
      if (f !== en && f.on === en.on && d < 290 && f.cevap < 0) f.cevap = .08 + d / 630;
    }
    return 1;   // olayı yutma: Feza dokunduğu çiçeğe doğru yürüsün
  }

  // ════════════════════ UÇURTMA (k12Ucurtma) ════════════════════
  let SPR_UCURTMA = null; const SPR_FIYONK = [];
  // Pırıl desenli uçurtma: leylak baklava gövde, fıstık yeşili çizgili karın, koyu yeşil üç dilimli ibik,
  // açık yeşil yüzgeç kulaklar, kocaman yeşil gözler, iki minik diş.
  function ucurtmaSpr() {
    if (SPR_UCURTMA) return SPR_UCURTMA;
    SPR_UCURTMA = onbellek(150, 172, c => {
      c.translate(75, 82);
      // yüzgeç kulaklar
      for (const s of [-1, 1]) {
        c.beginPath(); c.moveTo(s * 42, -16); c.quadraticCurveTo(s * 72, -36, s * 69, -4); c.quadraticCurveTo(s * 62, 6, s * 44, -2); c.closePath();
        c.fillStyle = '#b8e59c'; c.fill(); cizgiGenis(c, '#5f9e5c', 2);
        c.beginPath(); c.moveTo(s * 48, -10); c.quadraticCurveTo(s * 60, -20, s * 64, -8); cizgiGenis(c, 'rgba(95,158,92,.6)', 1.3);
      }
      // ibik: üç koyu yeşil dilim
      const ibik = [[-15, -50, -.5, 9, 14], [0, -63, 0, 10, 17], [15, -50, .5, 9, 14]];
      for (const b of ibik) {
        c.save(); c.translate(b[0], b[1]); c.rotate(b[2]);
        c.beginPath(); c.moveTo(-b[3], 6); c.quadraticCurveTo(-b[3] * 1.1, -b[4] * .7, 0, -b[4]); c.quadraticCurveTo(b[3] * 1.1, -b[4] * .7, b[3], 6); c.closePath();
        c.fillStyle = '#3f8a5a'; c.fill(); cizgiGenis(c, '#2c6a43', 1.6);
        c.beginPath(); c.moveTo(-b[3] * .3, 0); c.quadraticCurveTo(-b[3] * .4, -b[4] * .5, 0, -b[4] * .75); cizgiGenis(c, 'rgba(160,220,170,.5)', 1.4);
        c.restore();
      }
      // baklava gövde
      const govde = () => { c.beginPath(); c.moveTo(0, -60); c.quadraticCurveTo(30, -40, 52, -10); c.quadraticCurveTo(28, 32, 0, 74); c.quadraticCurveTo(-28, 32, -52, -10); c.quadraticCurveTo(-30, -40, 0, -60); c.closePath(); };
      govde();
      const gr = c.createLinearGradient(-40, -50, 40, 60);
      gr.addColorStop(0, '#e2cffa'); gr.addColorStop(.45, '#bba0ec'); gr.addColorStop(1, '#9479d6');
      c.fillStyle = gr; c.fill();
      c.save(); govde(); c.clip();
      // karın: fıstık yeşili, şeritli
      elips(c, 0, 40, 25, 38, '#cdeba0');
      for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-22, 14 + i * 11); c.quadraticCurveTo(0, 19 + i * 11, 22, 14 + i * 11); cizgiGenis(c, '#a5d27c', 2.2); }
      // çapraz çıtalar ve kumaş parlaklığı
      c.beginPath(); c.moveTo(0, -58); c.lineTo(0, 72); c.moveTo(-50, -10); c.lineTo(50, -10); cizgiGenis(c, 'rgba(255,248,230,.4)', 1.6);
      c.beginPath(); c.moveTo(-30, -36); c.quadraticCurveTo(-18, -48, -4, -54); cizgiGenis(c, 'rgba(255,255,255,.55)', 3);
      c.restore();
      govde(); cizgiGenis(c, '#7457b4', 2.6);
      // yüz
      for (const s of [-1, 1]) {
        elips(c, s * 15, -18, 11, 12, '#ffffff'); c.beginPath(); c.ellipse(s * 15, -18, 11, 12, 0, 0, TAM); cizgiGenis(c, '#6a52a6', 1.3);
        elips(c, s * 15 + 1.5, -16.5, 7.6, 8.4, '#46b25e'); elips(c, s * 15 + 1.5, -16.5, 4.4, 5, '#173826');
        elips(c, s * 15 - 1.5, -20.5, 2.4, 2.4, '#ffffff'); elips(c, s * 15 + 4, -13, 1.1, 1.1, '#ffffff');
        elips(c, s * 25, -1, 5.5, 3.4, 'rgba(255,130,160,.55)');
      }
      c.beginPath(); c.moveTo(-10, -1); c.quadraticCurveTo(0, 9, 10, -1); cizgiGenis(c, '#5a3c7a', 2.2);
      c.fillStyle = '#ffffff'; c.beginPath(); c.roundRect ? c.roundRect(-5.5, 2.6, 4, 4.4, 1.2) : c.rect(-5.5, 2.6, 4, 4.4); c.fill();
      c.beginPath(); c.roundRect ? c.roundRect(1.5, 2.6, 4, 4.4, 1.2) : c.rect(1.5, 2.6, 4, 4.4); c.fill();
      // üstte küçük parıltı yıldızı
      yildizYol(c, -30, -26, 5, .42, 4); c.fillStyle = '#fff7cf'; c.fill();
    });
    SPR_UCURTMA.ax = .5; SPR_UCURTMA.ay = 82 / 172;
    return SPR_UCURTMA;
  }
  function fiyonkSpr(i) {
    if (SPR_FIYONK[i]) return SPR_FIYONK[i];
    const renk = RENK[i % RENK.length];
    SPR_FIYONK[i] = onbellek(20, 13, c => {
      c.fillStyle = renk;
      c.beginPath(); c.moveTo(10, 6.5); c.quadraticCurveTo(3, -1, 1, 3); c.quadraticCurveTo(0, 9, 1.5, 11); c.quadraticCurveTo(4, 13, 10, 6.5); c.fill();
      c.beginPath(); c.moveTo(10, 6.5); c.quadraticCurveTo(17, -1, 19, 3); c.quadraticCurveTo(20, 9, 18.5, 11); c.quadraticCurveTo(16, 13, 10, 6.5); c.fill();
      c.globalAlpha = .35; elips(c, 5, 4.5, 2.5, 1.5, '#ffffff', -.4); elips(c, 15, 4.5, 2.5, 1.5, '#ffffff', .4);
      c.globalAlpha = 1; elips(c, 10, 6.5, 2.6, 2.8, '#fff3d6');
    });
    return SPR_FIYONK[i];
  }
  // Kurdele zinciri (yay fiziği): her parçanın açısı yay-sönümle rüzgâr yönüne döner, bir öncekine bağlı olduğu için dalga
  // kökten uca doğru akar. Bağlantı noktası ani hareket edince (takla, rüzgâr savruluşu) kurdele ters yöne savrulup geri gelir.
  function zincir(n, seg) {
    return { n, seg, x: new Float32Array(n), y: new Float32Array(n), a: new Float32Array(n), w: new Float32Array(n), bx: NaN, by: NaN, ox: 0, oy: 0, vx: 0, vy: 0 };
  }
  function zincirKoy(z, x, y) {
    for (let i = 0; i < z.n; i++) { z.x[i] = x; z.y[i] = y + i * z.seg; z.a[i] = Math.PI / 2; z.w[i] = 0; }
    z.bx = x; z.by = y; z.ox = z.oy = z.vx = z.vy = 0;
  }
  function zincirAdim(z, bx, by, rx, ry, dt, genlik, faz, olcek) {
    const L = z.seg * (olcek || 1);   // uçurtma küçükken (annenin elinde) kurdeleler de kısa
    // bağlantının anlık hızı ile yavaş ortalaması arasındaki fark = savrulma (sabit yürüyüş zaten rx'in içinde)
    if (Number.isFinite(z.bx)) {
      const ivx = (bx - z.bx) / dt, ivy = (by - z.by) / dt;
      z.ox += (ivx - z.ox) * (1 - Math.exp(-dt * 14)); z.oy += (ivy - z.oy) * (1 - Math.exp(-dt * 14));
      z.vx += (z.ox - z.vx) * (1 - Math.exp(-dt * 1.5)); z.vy += (z.oy - z.vy) * (1 - Math.exp(-dt * 1.5));
    }
    z.bx = bx; z.by = by;
    const sx = sinir((z.ox - z.vx) * .0045, -1.2, 1.2), sy = sinir((z.oy - z.vy) * .0045, -1.2, 1.2);
    const taban = Math.atan2(ry - sy, rx - sx);
    z.x[0] = bx; z.y[0] = by;
    for (let i = 1; i < z.n; i++) {
      const u = i / z.n, K = 70 - 45 * u, C = 2 * Math.sqrt(K) * .42;
      const dalga = Math.sin(now * 5.2 - i * .6 + faz) * genlik * u;
      const ust = i > 1 ? z.a[i - 1] : taban;
      const hedef = taban + dalga + aciFark(taban, ust) * .45;        // bir öncekinin açısını izler: dalga uca doğru akar
      z.w[i] += (K * aciFark(z.a[i], hedef) - C * z.w[i]) * dt;
      z.a[i] += z.w[i] * dt;
      z.x[i] = z.x[i - 1] + Math.cos(z.a[i]) * L; z.y[i] = z.y[i - 1] + Math.sin(z.a[i]) * L;
    }
  }
  // İp (yay fiziği): el ile uçurtma arasında tek bir eğri; sarkma noktası yay-sönümle hedefine gider, böylece ip
  // hiç titremez, Feza zıplayınca ya da uçurtma takla atınca yumuşakça dalgalanıp yerine oturur.
  function ipAdim(k, hx, hy, kx, ky, dt) {
    if (k.ipSerbest) {   // elden bırakılınca ipin ucu uçurtmanın altında sallanarak sarkar
      const ex = kx - k.yonY * 26 + Math.sin(now * 2.1) * 14, ey = ky + 95;
      k.ipEvx += ((ex - k.ipEx) * 18 - k.ipEvx * 4.5) * dt; k.ipEvy += ((ey - k.ipEy) * 18 - k.ipEvy * 4.5) * dt;
      k.ipEx += k.ipEvx * dt; k.ipEy += k.ipEvy * dt;
      hx = k.ipEx; hy = k.ipEy;
    } else { k.ipEx = hx; k.ipEy = hy; k.ipEvx = k.ipEvy = 0; }
    const d = Math.hypot(kx - hx, ky - hy);
    const sark = (.07 + .12 * (1 - sinir(k.hiz, 0, 1))) * d + 8;           // yavaşken daha sarkık
    const cx = (hx + kx) * .5 - k.yonY * .05 * d + Math.sin(now * 1.7) * 6, cy = (hy + ky) * .5 + 2 * sark;
    k.ipVx += ((cx - k.ipCx) * 20 - k.ipVx * 5) * dt; k.ipVy += ((cy - k.ipCy) * 20 - k.ipVy * 5) * dt;
    k.ipCx += k.ipVx * dt; k.ipCy += k.ipVy * dt;
  }
  function ipKoy(k, hx, hy, kx, ky) { k.ipCx = (hx + kx) * .5; k.ipCy = (hy + ky) * .5 + 30; k.ipVx = k.ipVy = 0; k.ipEx = hx; k.ipEy = hy; k.ipEvx = k.ipEvy = 0; }
  // Uçurtmanın yerel noktasını (lx, ly) dünyaya çevir
  const UC_NOKTA = { x: 0, y: 0 };
  function ucNokta(k, lx, ly) {
    const c = Math.cos(k.aciCiz), s = Math.sin(k.aciCiz), o = k.olc;
    UC_NOKTA.x = k.cx + (lx * c - ly * s) * o; UC_NOKTA.y = k.cy + (lx * s + ly * c) * o;
    return UC_NOKTA;
  }
  // minik kalp (veriliş anı, koklama)
  function kalpCiz(x, y, s, renk) {
    g.fillStyle = renk;
    g.beginPath(); g.moveTo(x, y + s * 1.1);
    g.bezierCurveTo(x - s * 1.9, y - s * .2, x - s * 1.1, y - s * 1.7, x, y - s * .7);
    g.bezierCurveTo(x + s * 1.1, y - s * 1.7, x + s * 1.9, y - s * .2, x, y + s * 1.1); g.fill();
  }

  // Veriliş zamanlaması: anne uçurtmayı başının üstünde tutar (TUT), sonra öne uzatır ve uçurtma kavis çizerek Feza'nın eline
  // süzülür (UZAT). Anne de Feza da hiç durmaz.
  const VER_TUT = .6, VER_UZAT = .9;
  function ucurtmaKur(o) {
    o.x0 = Number.isFinite(o.x0) ? o.x0 : o.x - 60 * T; o.x1 = Number.isFinite(o.x1) ? o.x1 : o.x + 60 * T; o.merkez = o.x;
    o.k = {
      durum: 'bekle', u: 0, bitisSag: false,
      kx: 0, ky: 0, kvx: 0, kvy: 0, cx: 0, cy: 0, aci: 0, aw: 0, aciCiz: 0, olc: .62, alfa: 1,
      yonY: 1, hiz: 0, boy: 150, takla: 0, taklaSira: 0, taklaSay: 0, sonDokunus: -99,
      ipCx: 0, ipCy: 0, ipVx: 0, ipVy: 0, ipEx: 0, ipEy: 0, ipEvx: 0, ipEvy: 0, ipSerbest: false, ipGor: 0,
      kuyruk: zincir(15, 10), solK: zincir(9, 10), sagK: zincir(9, 10), sevgi: 0, verParca: 0, kurdeleParca: 0
    };
  }
  function ucurtmaGuncelle(o, dt) {
    if (!(dt > 0)) return; dt = Math.min(dt, 1 / 30);
    ortakGuncelle(dt); kameraIzle(o);
    const k = o.k, t = now;
    k.u += dt;
    // Feza'nın yürüyüş hızı (yumuşatılmış) ve yönü: uçurtma rüzgârda arkasında kalır
    const v = Math.abs(P.vx || 0) / ((typeof OM !== 'undefined' && OM.KOS) || 250);
    k.hiz += (sinir(v, 0, 1.3) - k.hiz) * (1 - Math.exp(-dt * 1.1));
    if (Math.abs(P.vx || 0) > 30) k.yonY += ((P.vx > 0 ? 1 : -1) - k.yonY) * (1 - Math.exp(-dt * 1.3));
    const bolgede = P.x > o.x0 && P.x < o.x1;

    if (k.durum === 'bekle') {
      if (oyunda() && P.x > o.x0 + 20 && P.x < o.x1 - 320 && Math.abs(P.y - o.y) < 200) ucurtmaVer(o);
      return;
    }
    if (k.durum === 'bitti') {   // bölgeden tamamen çıkınca yeniden verilebilir
      if (P.x < o.x0 - 100 || P.x > o.x1 + 100) k.durum = 'bekle';
      return;
    }
    const el = fezaEli();
    let hedefAci = 0;
    if (k.durum === 'ver') {
      const a = anneEli();
      VER_OPT.hedefX = P.x; VER_OPT.u = yumusak((k.u - VER_TUT * .6) / (VER_UZAT + .2));   // annenin kolu uçurtmayla birlikte uzanır
      if (k.u < VER_TUT) {
        // annenin elinde, başının üstünde: rüzgârı yakalamış gibi hafifçe sallanır
        const u = yumusak(k.u / VER_TUT);
        k.kx = a.x + k.yonY * 4; k.ky = a.y - 22 - 14 * u;
        k.olc = .34 + .06 * u; hedefAci = Math.sin(t * 6) * .18;
      } else {
        // kavis çizerek Feza'nın eline (ve hemen üstüne) süzülür; arkasında parıltı ve minik kalpler
        const u = yumusak((k.u - VER_TUT) / VER_UZAT), iu = 1 - u;
        const ax = a.x + k.yonY * 4, ay = a.y - 36, bx = el.x - k.yonY * 26, by = el.y - 62;
        const mx = (ax + bx) * .5, my = Math.min(ay, by) - 80;
        k.kx = iu * iu * ax + 2 * iu * u * mx + u * u * bx; k.ky = iu * iu * ay + 2 * iu * u * my + u * u * by;
        k.olc = .4 + .22 * u; hedefAci = Math.sin(u * Math.PI) * .45 * k.yonY;
        k.sevgi = Math.sin(u * Math.PI);
        k.verParca += dt * 30;
        if (k.verParca >= 1) {
          k.verParca -= 1;
          parca(k.kx, k.ky + 10, (Math.random() - .5) * 30, 10 + Math.random() * 20, .7, Math.random() < .5 ? '#fff3b0' : RENK[(Math.random() * RENK.length) | 0], 3 + Math.random() * 3);
        }
        if (u > .45) fezaPoz('ucurtma', ucPozOpt(k, el));
      }
      k.ipGor = sinir((k.u - VER_TUT - VER_UZAT * .5) / (VER_UZAT * .4), 0, 1);   // ip Feza'nın eline geçerken belirir
      if (k.u >= VER_TUT + VER_UZAT) {
        k.durum = 'uc'; k.u = 0; k.kvx = -k.yonY * 70; k.kvy = -180; k.ipGor = 1; k.sevgi = 0;
        burst(k.kx, k.ky, 10, ['#fff3b0', '#ffd6e4', '#ffffff'], 90, .8, 5);
      }
    } else if (k.durum === 'uc') {
      fezaPoz('ucurtma', ucPozOpt(k, el));
      // hedef: elden geriye ve yukarı; hız arttıkça ip uzar, açı dikleşir
      const boyH = 150 + 170 * Math.min(k.hiz, 1.15);
      k.boy += (boyH - k.boy) * (1 - Math.exp(-dt * .9));
      const th = .72 + .5 * Math.min(k.hiz, 1) + .06 * Math.sin(t * .7);
      let tx = el.x - k.yonY * Math.cos(th) * k.boy + 18 * Math.sin(t * 1.3 + 1), ty = el.y - Math.sin(th) * k.boy + 14 * Math.sin(t * 1.9);
      ty = Math.max(ty, o.y - 470);
      k.kvx += ((tx - k.kx) * 5.5 - k.kvx * 3) * dt; k.kvy += ((ty - k.ky) * 5.5 - k.kvy * 3) * dt;
      k.kx += k.kvx * dt; k.ky += k.kvy * dt;
      // ip boyundan uzağa kaçamaz
      const dx = k.kx - el.x, dy = k.ky - el.y, d = Math.hypot(dx, dy), en = k.boy * 1.08;
      if (d > en) { k.kx = el.x + dx / d * en; k.ky = el.y + dy / d * en; }
      // ipin yönüne yaslanır, rüzgârda kafa sallar
      hedefAci = sinir(Math.atan2(dx, -dy) * .35, -.55, .55) + .08 * Math.sin(t * 2.6) + sinir(k.kvx * .001, -.2, .2);
      taklaIlerle(o, k, dt);
      // dokunulmasa da çimenliğin ortasında bir kez kendiliğinden takla
      if (k.taklaSay === 0 && P.x > (o.x0 + o.x1) * .5 && k.u > 3) takla(o, true);
      if (!bolgede || P.x > o.x1 - 60 || P.ucus) ucurtmaGeriDon(o, P.x > o.x1 - 60);
    } else if (k.durum === 'don') {
      // ip elden bırakıldı: uçurtma süzülerek annenin eline gelir, sonra çantaya girer
      const a = anneEli();
      const sert = 1.2 + 3 * yumusak(k.u / 1.6);
      k.kvx += ((a.x - k.kx) * sert - k.kvx * 2.4) * dt; k.kvy += ((a.y - 20 - k.ky) * sert - k.kvy * 2.4) * dt + Math.sin(t * 3) * 20 * dt;
      k.kx += k.kvx * dt; k.ky += k.kvy * dt;
      k.olc += (.4 - k.olc) * (1 - Math.exp(-dt * 1.6));
      hedefAci = Math.sin(t * 2.2) * .2;
      taklaIlerle(o, k, dt);
      if (k.u > 1.2 && (Math.hypot(a.x - k.kx, a.y - 20 - k.ky) < 30 || k.u > 2.6)) { k.durum = 'canta'; k.u = 0; }
    } else if (k.durum === 'canta') {
      const c = anneCantasi(), u = yumusak(k.u / .55);
      k.kx += (c.x - k.kx) * u; k.ky += (c.y - k.ky) * u;
      k.olc = .4 * (1 - .75 * u); k.alfa = 1 - u; k.ipGor = 1 - u;
      if (k.u >= .55) { k.durum = 'bitti'; k.alfa = 1; burst(c.x, c.y, 8, RENK, 60, .6, 4); }
    }
    // gövde açısı da yayla: savrulunca biraz taşar, sonra oturur
    k.aw += ((hedefAci - k.aci) * 42 - k.aw * 7.5) * dt; k.aci += k.aw * dt;
    // çizim konumu (takla döngüsü eklenmiş) ve kurdeleler
    const lu = k.takla > 0 ? yumusak(k.takla) : 0, R = 46;
    k.cx = k.kx + (k.takla > 0 ? -k.yonY * Math.sin(lu * TAM) * R : 0);
    k.cy = k.ky - (k.takla > 0 ? (1 - Math.cos(lu * TAM)) * R : 0);
    k.aciCiz = k.aci - (k.takla > 0 ? k.yonY * lu * TAM : 0);
    // kurdeleler rüzgârda geriye uzanır; Feza hızlandıkça daha yatay, yavaşken daha sarkık; annenin elindeyken aşağı sarkar
    const ucuyor = k.durum !== 'ver' || k.u > VER_TUT;
    const rx = ucuyor ? -k.yonY * (.55 + Math.min(k.hiz, 1.2)) : -k.yonY * .25, ry = ucuyor ? .75 - .3 * Math.min(k.hiz, 1) : 1.6;
    const ko = Math.min(1, k.olc / .62);
    const alt = ucNokta(k, 0, 72); zincirAdim(k.kuyruk, alt.x, alt.y, rx, ry, dt, .45, 0, ko);
    const sl = ucNokta(k, -50, -8); zincirAdim(k.solK, sl.x, sl.y, rx, ry + .35, dt, .6, 1.3, ko);
    const sg = ucNokta(k, 50, -8); zincirAdim(k.sagK, sg.x, sg.y, rx, ry + .35, dt, .6, 2.6, ko);
    const baglanti = ucNokta(k, 0, 10);
    if (k.durum === 'ver' && k.ipGor <= 0) ipKoy(k, el.x, el.y, baglanti.x, baglanti.y);
    else ipAdim(k, el.x, el.y, baglanti.x, baglanti.y, dt);
    // Saniyede aynı sayıda kurdele parçası: 60 / 120 / 180 Hz'de etki yoğunluğu değişmez.
    if (k.takla > 0) {
      k.kurdeleParca += dt * 42;
      while (k.kurdeleParca >= 1) {
        k.kurdeleParca -= 1;
        const z = Math.random() < .5 ? k.kuyruk : (Math.random() < .5 ? k.solK : k.sagK), j = 2 + Math.floor(Math.random() * (z.n - 2));
        parca(z.x[j], z.y[j], (Math.random() - .5) * 60, -20 - Math.random() * 40, .9, RENK[Math.floor(Math.random() * RENK.length)], 4 + Math.random() * 4);
      }
    } else k.kurdeleParca = 0;
  }
  function ucPozOpt(k, el) {
    const dx = k.kx - el.x, dy = k.ky - el.y, d = Math.hypot(dx, dy) || 1;
    UC_OPT.yonX = dx / d; UC_OPT.yonY = dy / d; UC_OPT.cek = k.takla > 0 ? 1 : sinir(k.hiz, 0, 1) * .6;
    return UC_OPT;
  }
  const UC_OPT = { yonX: 0, yonY: -1, cek: 0 };
  function ucurtmaVer(o) {
    const k = o.k, a = anneEli();
    k.durum = 'ver'; k.u = 0; k.alfa = 1; k.takla = 0; k.taklaSira = 0; k.taklaSay = 0; k.boy = 140; k.hiz = 0; k.ipGor = 0;
    k.yonY = P.vx < -30 ? -1 : 1; k.kx = a.x; k.ky = a.y - 22; k.olc = .34; k.aci = k.aw = 0; k.ipSerbest = false;
    k.cx = k.kx; k.cy = k.ky; k.aciCiz = 0; k.verParca = 0; k.kurdeleParca = 0;
    zincirKoy(k.kuyruk, k.kx, k.ky + 20); zincirKoy(k.solK, k.kx - 14, k.ky); zincirKoy(k.sagK, k.kx + 14, k.ky);
    VER_OPT.u = 0; VER_OPT.hedefX = P.x;
    anneYuruyerekPoz('ucurtma_ver', VER_TUT + VER_UZAT + .2, VER_OPT);
    if (typeof V12 !== 'undefined' && V12) V12.ucurtma = true;
    olay('k12UcurtmaVer', { o, x: P.x });
  }
  function ucurtmaGeriDon(o, sag) {
    const k = o.k;
    k.durum = 'don'; k.u = 0; k.ipSerbest = true; k.bitisSag = !!sag;
    fezaPoz(null);
    olay('k12UcurtmaDon', { o, x: k.kx });
  }
  function takla(o, oto) {
    const k = o.k;
    if (k.durum !== 'uc' && k.durum !== 'don') return;
    if (k.takla > 0) { if (k.taklaSira < 2) k.taklaSira++; return; }
    k.takla = .0001; k.taklaSay++;
    k.ipVy -= 160; k.ipVx += k.yonY * 120;   // ip de taklayla birlikte dalgalanır
    burst(k.cx, k.cy, 14, RENK, 150, 1, 6);
    if (!oto) { anneSevindi(k.cx);   // dokunuşla takla: daha büyük kutlama — gökkuşağı renkli yıldız halkası ve iki ışık dalgası
      burst(k.cx, k.cy, 22, GOK7, 240, 1.2, 7);
      halkaAt(k.cx, k.cy, '#ffffff', 170, .8); halkaAt(k.cx, k.cy, RENK[k.taklaSay % RENK.length], 110, 1);
    }
    olay('k12UcurtmaTakla', { o, x: k.cx, y: k.cy, oto: !!oto });
  }
  function taklaIlerle(o, k, dt) {
    if (k.takla <= 0) return;
    const once = k.takla; k.takla += dt / .95;
    if (once < .5 && k.takla >= .5) { olay('k12UcurtmaKurdele', { o, x: k.cx, y: k.cy }); burst(k.cx, k.cy + 30, 10, RENK, 110, 1.1, 5); }
    if (k.takla >= 1) { k.takla = 0; if (k.taklaSira > 0) { k.taklaSira--; k.takla = .0001; k.taklaSay++; olay('k12UcurtmaTakla', { o, x: k.cx, y: k.cy, oto: false }); } }
  }
  // kurdeleyi kalınlığı uca doğru azalan, yumuşak eğrili şerit olarak çiz
  function kurdeleCiz(z, renk, kalin) {
    g.strokeStyle = renk; g.lineCap = 'round'; g.lineJoin = 'round';
    for (let i = 1; i < z.n - 1; i++) {
      g.lineWidth = kalin * (1 - i / (z.n + 1));
      g.beginPath();
      g.moveTo((z.x[i - 1] + z.x[i]) * .5, (z.y[i - 1] + z.y[i]) * .5);
      g.quadraticCurveTo(z.x[i], z.y[i], (z.x[i] + z.x[i + 1]) * .5, (z.y[i] + z.y[i + 1]) * .5);
      g.stroke();
    }
  }
  function ucurtmaCiz(o, tm) {
    const k = o.k;
    if (k.durum === 'bekle' || k.durum === 'bitti') return;
    g.globalAlpha = k.alfa;
    if (k.ipGor > .01) {
      // ip: çizim anındaki elden (fezaUpdate güncelledi) yaylı sarkma noktasından uçurtmaya; ince koyu gölge + krem çizgi
      let hx = k.ipEx, hy = k.ipEy;
      if (!k.ipSerbest) { const el = fezaEli(); hx = el.x; hy = el.y; }
      const b = ucNokta(k, 0, 10);
      g.globalAlpha = k.alfa * k.ipGor;
      g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo(k.ipCx, k.ipCy, b.x, b.y);
      cizgiGenis(g, 'rgba(110,90,80,.35)', 2.6); cizgiGenis(g, '#fffaf0', 1.3);
      g.globalAlpha = k.alfa;
    }
    // kuyruk ve yan kurdeleler
    kurdeleCiz(k.solK, '#ffd25e', 4.5 * k.olc / .62); kurdeleCiz(k.sagK, '#3fc2b4', 4.5 * k.olc / .62);
    const kz = k.kuyruk;
    g.beginPath(); g.moveTo(kz.x[0], kz.y[0]);
    for (let i = 1; i < kz.n - 1; i++) g.quadraticCurveTo(kz.x[i], kz.y[i], (kz.x[i] + kz.x[i + 1]) * .5, (kz.y[i] + kz.y[i + 1]) * .5);
    cizgiGenis(g, '#ff8fb5', 2);
    const fb = .85 * Math.min(1, k.olc / .5);
    for (let i = 3; i < kz.n; i += 3) {
      const aci = Math.atan2(kz.y[i] - kz.y[i - 1], kz.x[i] - kz.x[i - 1]) - Math.PI / 2, fs = fiyonkSpr(i / 3 | 0);
      yerlestir(kz.x[i], kz.y[i], aci, fb, fb); koy(fs, .5, .5);
    }
    dunyaya();
    if (k.takla > 0) dglow('#fff3b0', k.cx, k.cy, 70 * k.olc / .62, .5 * Math.sin(Math.PI * k.takla));
    if (k.durum === 'ver') {   // veriliş: sıcak bir ışıltı ve anneden Feza'ya süzülen kalpler
      dglow('#ffe7b0', k.cx, k.cy, 60, .35 + .25 * k.sevgi);
      for (let j = 0; j < 3; j++) {
        const v = sinir(k.u * 1.3 - .5 - j * .22, 0, 1); if (v <= 0 || v >= 1) continue;
        g.globalAlpha = Math.sin(Math.PI * v) * .85;
        kalpCiz(k.kx + k.yonY * (j - 1) * 14 + Math.sin(v * 8 + j) * 5, k.ky + 20 - v * 40, 2.6 + j * .5, j === 1 ? '#ffb3c8' : '#ff8fb1');
      }
      g.globalAlpha = k.alfa;
    }
    const s = ucurtmaSpr();
    yerlestir(k.cx, k.cy, k.aciCiz, k.olc, k.olc); koy(s, s.ax, s.ay);
    dunyaya(); g.globalAlpha = 1;
  }
  function ucurtmaDokun(o, p) {
    const k = o.k;
    if (k.durum !== 'uc' && k.durum !== 'don') return 0;
    if (Math.hypot(p.x - k.cx, p.y - k.cy) > 95 * k.olc / .62 + 10) {
      // kurdelelere dokunmak da takla attırır
      const z = k.kuyruk; let yakin = false;
      for (let i = 0; i < z.n; i += 2) if (Math.hypot(p.x - z.x[i], p.y - z.y[i]) < 34) { yakin = true; break; }
      if (!yakin) return 0;
    }
    k.sonDokunus = now; takla(o, false);
    return 2;   // olayı yut: Feza uçurtmaya doğru geri yürümesin
  }

  // ════════════════════ BİLGİ MERKEZİ HAVUZU (k12Bilgi) ════════════════════
  const RESIMLER = ['yildiz', 'balina', 'ejderha', 'balon'];
  let SPR_SU = null, SPR_GOKKUSAGI = null; const SPR_SAYFA = [], SPR_RESIM = [];
  function suSpr() {
    if (SPR_SU) return SPR_SU;
    SPR_SU = onbellek(4, 50, c => {
      const gr = c.createLinearGradient(0, 0, 0, 50);
      gr.addColorStop(0, '#bfe6ee'); gr.addColorStop(.18, '#86cbe0'); gr.addColorStop(.6, '#5eb2d2'); gr.addColorStop(1, '#7ccbdc');
      c.fillStyle = gr; c.fillRect(0, 0, 4, 50);
      c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(0, 2, 4, 2);
    });
    return SPR_SU;
  }
  function gokkusagiSpr() {
    if (SPR_GOKKUSAGI) return SPR_GOKKUSAGI;
    SPR_GOKKUSAGI = onbellek(300, 160, c => {
      c.lineCap = 'butt';
      for (let i = 0; i < GOK7.length; i++) {
        const r = 150 - i * 7.5;
        c.globalAlpha = .55; c.strokeStyle = GOK7[i]; c.lineWidth = 7.5;
        c.beginPath(); c.arc(150, 160, r - 4, Math.PI, 0); c.stroke();
      }
      c.globalAlpha = .18; c.strokeStyle = '#ffffff'; c.lineWidth = 3;   // yumuşak kenar
      c.beginPath(); c.arc(150, 160, 150, Math.PI, 0); c.stroke();
      c.beginPath(); c.arc(150, 160, 98, Math.PI, 0); c.stroke();
    });
    return SPR_GOKKUSAGI;
  }
  // Kitap sayfası (kanat): krem kâğıt, üstünde yazısız minik renkli resimcikler; sırt sol kenarda.
  function sayfaSpr(v) {
    if (SPR_SAYFA[v]) return SPR_SAYFA[v];
    SPR_SAYFA[v] = onbellek(32, 40, c => {
      const gr = c.createLinearGradient(0, 0, 32, 0); gr.addColorStop(0, '#e9dcc0'); gr.addColorStop(.15, '#fffaf0'); gr.addColorStop(1, '#fff3dc');
      c.fillStyle = gr; c.beginPath(); c.moveTo(0, 2); c.quadraticCurveTo(16, -1, 31, 3); c.lineTo(31, 38); c.quadraticCurveTo(16, 35, 0, 38); c.closePath(); c.fill();
      c.strokeStyle = '#d4c29e'; c.lineWidth = .8; c.stroke();
      c.beginPath(); c.moveTo(30, 5); c.lineTo(30, 36); cizgiGenis(c, 'rgba(200,180,140,.6)', .6);   // sayfa kalınlığı
      if (v === 0) {        // güneş ve tepeler
        elips(c, 22, 11, 4.2, 4.2, '#ffd25e');
        c.beginPath(); c.moveTo(4, 28); c.quadraticCurveTo(12, 17, 20, 26); c.quadraticCurveTo(25, 21, 29, 27); c.lineTo(29, 31); c.lineTo(4, 31); c.closePath(); c.fillStyle = '#8fd07a'; c.fill();
      } else if (v === 1) { // dalgalar ve sandal
        for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(4, 22 + i * 4); c.quadraticCurveTo(10, 19 + i * 4, 16, 22 + i * 4); c.quadraticCurveTo(22, 25 + i * 4, 28, 22 + i * 4); cizgiGenis(c, '#74c0fc', 1.4); }
        c.beginPath(); c.moveTo(10, 18); c.lineTo(22, 18); c.lineTo(19, 21); c.lineTo(13, 21); c.closePath(); c.fillStyle = '#ff9f6e'; c.fill();
        c.beginPath(); c.moveTo(16, 18); c.lineTo(16, 9); c.lineTo(21, 16); c.closePath(); c.fillStyle = '#ffffff'; c.fill(); c.strokeStyle = '#c9b38c'; c.lineWidth = .5; c.stroke();
      } else if (v === 2) { // ağaç ve çiçekler
        c.fillStyle = '#9a6a4a'; c.fillRect(14, 18, 3, 12);
        elips(c, 15.5, 15, 8, 7, '#7cc46e'); elips(c, 12, 13, 3, 2.5, '#a6dc8e');
        elips(c, 7, 29, 2, 2, '#ff8fb5'); elips(c, 24, 29, 2, 2, '#b79bff'); elips(c, 27, 27, 1.5, 1.5, '#ffd25e');
      }                     // v === 3: boş sayfa (açılan kitapta resmin zemini)
    });
    return SPR_SAYFA[v];
  }
  // Sayfadan ışıkla çıkan resim (yazısız): yıldız, balina, ejderha (Pırıl), sıcak hava balonu
  function resimSpr(i) {
    if (SPR_RESIM[i]) return SPR_RESIM[i];
    SPR_RESIM[i] = onbellek(80, 70, c => {
      c.translate(40, 37);
      const ad = RESIMLER[i];
      if (ad === 'yildiz') {
        yildizYol(c, 0, 2, 31, .5, 5);
        const gr = c.createRadialGradient(-6, -6, 3, 0, 2, 32); gr.addColorStop(0, '#fff8c8'); gr.addColorStop(.6, '#ffd84a'); gr.addColorStop(1, '#f5a623');
        c.fillStyle = gr; c.fill(); cizgiGenis(c, '#e39a1c', 2);
        elips(c, -6, 0, 2.4, 3, '#5a3a10'); elips(c, 6, 0, 2.4, 3, '#5a3a10'); elips(c, -5.4, -1, .8, .8, '#fff'); elips(c, 6.6, -1, .8, .8, '#fff');
        c.beginPath(); c.moveTo(-5, 7); c.quadraticCurveTo(0, 12, 5, 7); cizgiGenis(c, '#5a3a10', 1.6);
        elips(c, -11, 6, 3, 1.8, 'rgba(255,130,120,.5)'); elips(c, 11, 6, 3, 1.8, 'rgba(255,130,120,.5)');
      } else if (ad === 'balina') {
        // fıskiye
        for (let j = 0; j < 3; j++) { c.beginPath(); c.moveTo(-2, -12); c.quadraticCurveTo(-2 + (j - 1) * 6, -30, -2 + (j - 1) * 13, -24); cizgiGenis(c, '#8fd3ff', 2.4); }
        elips(c, -2, -31, 3, 3, '#cfeeff'); elips(c, -15, -24, 2.2, 2.2, '#cfeeff'); elips(c, 11, -24, 2.2, 2.2, '#cfeeff');
        c.beginPath(); c.moveTo(-30, 4); c.bezierCurveTo(-30, -16, 10, -18, 22, -2); c.quadraticCurveTo(30, -8, 36, -14); c.quadraticCurveTo(34, 0, 30, 6);
        c.quadraticCurveTo(34, 12, 36, 18); c.quadraticCurveTo(28, 14, 22, 10); c.bezierCurveTo(10, 22, -30, 22, -30, 4); c.closePath();
        const gr = c.createLinearGradient(0, -16, 0, 20); gr.addColorStop(0, '#6fb3ff'); gr.addColorStop(1, '#3d7fe0'); c.fillStyle = gr; c.fill(); cizgiGenis(c, '#2f63b8', 1.8);
        c.beginPath(); c.moveTo(-28, 8); c.quadraticCurveTo(-8, 20, 14, 10); c.quadraticCurveTo(-6, 14, -28, 8); c.fillStyle = '#e8f6ff'; c.fill();
        elips(c, -16, -2, 2.6, 3, '#173050'); elips(c, -15.2, -3, .9, .9, '#fff');
        c.beginPath(); c.moveTo(-24, 6); c.quadraticCurveTo(-18, 10, -11, 6); cizgiGenis(c, '#173050', 1.4);
        elips(c, -9, 3, 3, 1.8, 'rgba(255,140,170,.5)');
      } else if (ad === 'ejderha') {
        // minik Pırıl: leylak gövde, yeşil çizgili karın, üç dilimli ibik, kocaman yeşil gözler, ışıktan kanatlar
        c.globalAlpha = .55;
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(s * 10, -4); c.quadraticCurveTo(s * 36, -30, s * 34, -6); c.quadraticCurveTo(s * 26, 0, s * 10, 4); c.fillStyle = '#fff2a8'; c.fill(); }
        c.globalAlpha = 1;
        c.beginPath(); c.moveTo(12, 14); c.quadraticCurveTo(30, 18, 30, 6); cizgiGenis(c, '#a68ae0', 5);
        elips(c, 0, 10, 15, 14, '#bba0ec'); elips(c, 0, 13, 9, 10, '#cdeba0');
        for (let j = 0; j < 3; j++) { c.beginPath(); c.moveTo(-7, 8 + j * 5); c.quadraticCurveTo(0, 10 + j * 5, 7, 8 + j * 5); cizgiGenis(c, '#a5d27c', 1.2); }
        elips(c, 0, -10, 17, 14, '#c3a9f0');
        for (let j = 0; j < 3; j++) elips(c, -8 + j * 8, -25 + (j === 1 ? -3 : 0), 3.6, 5.5, '#3f8a5a', (j - 1) * .5);
        elips(c, -18, -12, 4, 6, '#b8e59c', -.6); elips(c, 18, -12, 4, 6, '#b8e59c', .6);
        for (const s of [-1, 1]) { elips(c, s * 6.5, -11, 5, 5.6, '#fff'); elips(c, s * 6.5 + .7, -10.4, 3.6, 4, '#46b25e'); elips(c, s * 6.5 + .7, -10.4, 2, 2.4, '#173826'); elips(c, s * 6.5 - .6, -12.4, 1.1, 1.1, '#fff'); }
        c.beginPath(); c.moveTo(-4, -2); c.quadraticCurveTo(0, 2, 4, -2); cizgiGenis(c, '#5a3c7a', 1.3);
        c.fillStyle = '#fff'; c.fillRect(-2.4, -1.2, 1.8, 2); c.fillRect(.6, -1.2, 1.8, 2);
      } else {
        // sıcak hava balonu
        c.beginPath(); c.moveTo(0, -32); c.bezierCurveTo(27, -32, 27, -2, 8, 12); c.lineTo(-8, 12); c.bezierCurveTo(-27, -2, -27, -32, 0, -32); c.closePath();
        c.fillStyle = '#ff8fb5'; c.fill();
        c.save(); c.clip();
        c.fillStyle = '#ffd25e'; c.fillRect(-9, -34, 6, 48); c.fillRect(4, -34, 6, 48);
        c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-10, -20, 4, 9, -.3, 0, TAM); c.fill();
        c.restore();
        c.beginPath(); c.moveTo(0, -32); c.bezierCurveTo(27, -32, 27, -2, 8, 12); c.lineTo(-8, 12); c.bezierCurveTo(-27, -2, -27, -32, 0, -32); cizgiGenis(c, '#d45a85', 1.6);
        c.beginPath(); c.moveTo(-7, 12); c.lineTo(-5, 22); c.moveTo(7, 12); c.lineTo(5, 22); cizgiGenis(c, '#9a6a4a', 1.2);
        c.fillStyle = '#c28455'; c.fillRect(-6, 21, 12, 8); c.fillStyle = '#e0a874'; c.fillRect(-6, 21, 12, 2.5);
      }
    });
    return SPR_RESIM[i];
  }

  // Kâğıt gemi (açılan sayfa katlanıp havuza iner): krem kâğıt, sayfanın resimciğine uygun renkli kenar
  const SPR_GEMI = [];
  function gemiSpr(v) {
    if (SPR_GEMI[v]) return SPR_GEMI[v];
    const renk = ['#ffd25e', '#74c0fc', '#8fd07a', '#ff8fb5'][v % 4];
    SPR_GEMI[v] = onbellek(40, 26, c => {
      // yelken (ortadaki üçgen kat)
      c.beginPath(); c.moveTo(20, 1.5); c.lineTo(29, 15); c.lineTo(11, 15); c.closePath();
      const gr = c.createLinearGradient(11, 0, 29, 0); gr.addColorStop(0, '#fffaf0'); gr.addColorStop(.5, '#f4ead4'); gr.addColorStop(1, '#fffdf6');
      c.fillStyle = gr; c.fill(); c.strokeStyle = '#d4c29e'; c.lineWidth = .8; c.stroke();
      c.beginPath(); c.moveTo(20, 2.5); c.lineTo(20, 15); cizgiGenis(c, 'rgba(200,180,140,.7)', .6);
      // gövde (iki yana açılan katlar)
      c.beginPath(); c.moveTo(1.5, 13); c.lineTo(38.5, 13); c.lineTo(31, 23); c.lineTo(9, 23); c.closePath();
      const gr2 = c.createLinearGradient(0, 13, 0, 23); gr2.addColorStop(0, '#fffaf0'); gr2.addColorStop(1, '#e6d7b8');
      c.fillStyle = gr2; c.fill(); c.strokeStyle = '#cdb88e'; c.lineWidth = .8; c.stroke();
      c.beginPath(); c.moveTo(4, 14.5); c.lineTo(36, 14.5); cizgiGenis(c, renk, 1.6);
      c.beginPath(); c.moveTo(9, 23); c.lineTo(14, 13); c.moveTo(31, 23); c.lineTo(26, 13); cizgiGenis(c, 'rgba(190,170,130,.55)', .6);
    });
    return SPR_GEMI[v];
  }

  const YAY_ARA = 150;          // sekerek akan su yaylarının memeleri arası
  const GEMI_EN = 3;            // havuzda en çok kaç kâğıt gemi yüzer
  function bilgiKur(o) {
    o.x0 = Number.isFinite(o.x0) ? o.x0 : o.x - 48 * T; o.x1 = Number.isFinite(o.x1) ? o.x1 : o.x + 48 * T; o.merkez = o.x;
    const k = o.k = {
      hx0: o.x0 + 320, hx1: o.x1 - 280,                         // havuzun uçları (sütun ~468..548)
      yU: o.y - 64, yA: o.y - 14, yJ: o.y - 36,                 // su yüzeyinin arkası, ön bordür, fıskiye memeleri
      fiskiye: [], sayfa: [], meme: [], yay: [], gok: 0, gokX: o.x, gokParla: 0, icerdeT: 0, otoT: 0, otoSay: 0, sonDokunus: -99,
      cagriX: 0, cagriT: 0, gemiSay: 0
    };
    let i = 0;
    for (let x = k.hx0 + 130; x < k.hx1 - 100; x += 250) { k.fiskiye.push({ x, i, h: 50, hv: 0, sicra: 0, cevap: -1, dokunT: 0, coskun: false }); i++; }
    for (let x = k.hx0 + 70; x < k.hx1 - 60; x += YAY_ARA) k.meme.push(x);
    // iki su yayı: biri Feza'nın önünden koşar (onu bekler), biri arkasından gelir
    for (let r = 0; r < 2; r++) k.yay.push({ rol: r === 0 ? 'on' : 'arka', i: r * 3, j: r * 3 + 1, u: 0, sure: .55, pi: -1, pj: -1, pu: 2 });
    for (let j = 0; j < 7; j++) {
      const r = karma(j * 4.3 + 7);
      k.sayfa.push({
        x: o.x0 + 380 + j * ((o.x1 - o.x0 - 760) / 6), y: o.y - 300 - r * 90, vx: 0, vy: 0,
        ev: o.x0 + 380 + j * ((o.x1 - o.x0 - 760) / 6), ofX: -360 + j * 125 + r * 40, ofY: 210 + karma(j * 2.1) * 150,
        kanat: r * TAM, faz: karma(j * 9.7) * TAM, olc: .9 + karma(j * 5.9) * .25, v: j % 3, resim: j % RESIMLER.length,
        durum: 'uc', acik: 0, acT: 0, ekX: 0, hedefY: 0, egim: 0,
        kx: 0, ky: 0, gx: 0, gy: 0, ku: 0, gyon: 1, hop: 0, serit: 0     // katlanma ve gemi
      });
    }
  }
  // Fıskiyelerin kendi koreografisi (Feza uzaktayken de): akan dalga → hep birlikte nabız → tek-çift karşılıklı; yumuşak geçişli
  function desen(m, j, t) {
    if (m === 0) return 40 + 34 * Math.sin(t * 2.2 - j.i * .9);
    if (m === 1) return 30 + 46 * Math.max(0, Math.sin(t * 2.6));
    return 40 + 34 * (j.i % 2 ? Math.sin(t * 2.4) : -Math.sin(t * 2.4));
  }
  function bilgiGuncelle(o, dt) {
    if (!(dt > 0)) return; dt = Math.min(dt, 1 / 30);
    ortakGuncelle(dt); kameraIzle(o);
    const k = o.k, t = now, icerde = P.x > o.x0 && P.x < o.x1 && !P.ucus;
    k.icerdeT = icerde ? k.icerdeT + dt : 0;
    k.cagriT = Math.max(0, k.cagriT - dt);
    // dikey fıskiyeler: koreografi + Feza yaklaşınca sırayla coşar
    const fz = (t / 6) % 3, m = Math.floor(fz), gecis = yumusak((fz - m - .8) / .2);
    let enYakin = null, enD = 1e9, gokHedef = 0;
    for (let i = 0; i < k.fiskiye.length; i++) {
      const j = k.fiskiye[i], d = Math.abs(P.x - j.x);
      j.dokunT = Math.max(0, j.dokunT - dt);
      let hedef = desen(m, j, t) * (1 - gecis) + desen((m + 1) % 3, j, t) * gecis;
      if (d < 330 && icerde) {
        const w = 1 - d / 330;
        hedef += 130 * w * (.78 + .22 * Math.sin(t * 5 + j.i));
        if (!j.coskun && w > .35) { j.coskun = true; olay('k12Fiskiye', { o, x: j.x, guc: .6 }); }
      } else if (d > 420) j.coskun = false;
      if (j.cevap >= 0) {
        j.cevap -= dt;
        if (j.cevap < 0) { j.hv = Math.min(650, j.hv + 420); j.sicra = Math.max(j.sicra, .9); }
      }
      if (j.sicra > 0) { j.sicra -= dt; hedef = Math.max(hedef, j.sicra > .9 ? 310 : 250); }   // dokunulan fıskiye ilk anda daha yükseğe
      j.hv += ((hedef - j.h) * 30 - j.hv * 6) * dt; j.h += j.hv * dt;
      if (d < enD) { enD = d; enYakin = j; }
      if (d < 330 && j.h > 90) gokHedef = Math.max(gokHedef, sinir((j.h - 90) / 90, 0, 1));
    }
    k.gokParla = Math.max(0, k.gokParla - dt * .45);
    gokHedef = Math.max(gokHedef, k.gokParla);
    k.gok += (gokHedef - k.gok) * (1 - Math.exp(-dt * 2.2));
    if (enYakin) k.gokX += (enYakin.x - k.gokX) * (1 - Math.exp(-dt * 1.6));
    // sekerek akan su yayları
    for (let i = 0; i < k.yay.length; i++) yayGuncelle(o, k.yay[i], dt, icerde);
    // kitap sayfaları ve kâğıt gemiler
    k.gemiSay = 0;
    for (let i = 0; i < k.sayfa.length; i++) { const s = k.sayfa[i]; if (s.durum === 'katla' || s.durum === 'gemi') k.gemiSay++; }
    for (let i = 0; i < k.sayfa.length; i++) sayfaGuncelle(o, k.sayfa[i], dt, icerde);
    // kendiliğinden: Feza bölgede yürüyorsa ara sıra bir sayfa önünde açılır (en çok iki kez)
    k.otoT = Math.max(0, k.otoT - dt);
    if (icerde && k.icerdeT > 4 && k.otoT <= 0 && k.otoSay < 2 && now - k.sonDokunus > 6) {
      let en = null, d0 = 1e9;
      for (let i = 0; i < k.sayfa.length; i++) {
        const s = k.sayfa[i]; if (s.durum !== 'uc') continue;
        const d = Math.abs(s.x - (P.x + (P.f || 1) * 140));
        if (d < d0 && s.x > cam.x + 100 && s.x < cam.x + VW - 100) { d0 = d; en = s; }
      }
      if (en) { sayfaAc(o, en, true); k.otoSay++; k.otoT = 9; }
    }
  }
  // Su yayı bir memeden komşusuna seker. Öndeki yay Feza'nın biraz önüne koşup orada ileri-geri sekerek onu bekler,
  // arkadaki onu izler. Dokunulan yere ikisi de koşar. Feza bölgede değilse kendi kendine oynar.
  function yayGuncelle(o, h, dt, icerde) {
    const k = o.k, n = k.meme.length; if (n < 2) return;
    if (h.pu < 1.5) h.pu += dt / h.sure;
    h.u += dt / h.sure;
    if (h.u < 1) return;
    // indi: küçük halka, birkaç damla
    const xb = k.meme[h.j];
    if (xb > cam.x - 60 && xb < cam.x + VW + 60) {
      halkaAt(xb, k.yA - 10, '#ffffff', 70, .6);
      for (let d = 0; d < 3; d++) yaprakAt(xb + (Math.random() - .5) * 10, k.yA - 14, (Math.random() - .5) * 90, -70 - Math.random() * 60, d ? '#e8f7ff' : GOK7[(Math.random() * 7) | 0], .65, false);
      olay('k12SuYayi', { o, x: xb });
    }
    h.pi = h.i; h.pj = h.j; h.pu = 1;          // eski yayın kuyruğu süzülerek biter
    h.i = h.j; h.u = 0;
    let hedef;
    const fi = (P.x - k.meme[0]) / YAY_ARA;
    if (k.cagriT > 0) hedef = (k.cagriX - k.meme[0]) / YAY_ARA + (h.rol === 'on' ? .3 : -.3);
    else if (icerde) hedef = fi + (h.rol === 'on' ? 1.8 : -1.4);
    else hedef = h.i + (karma(now * 3.1 + h.i) < .5 ? -1 : 1);
    const fark = hedef - h.i;
    let yon = Math.abs(fark) > .7 ? Math.sign(fark) : (karma(now * 7.3 + h.i) < .5 ? -1 : 1);   // hedefteyse ileri-geri oynar
    let j = h.i + yon;
    if (j < 0 || j >= n) j = h.i - yon;
    h.j = sinir(j, 0, n - 1);
    h.sure = Math.abs(fark) > 2.5 ? .42 : .58;   // uzaktaysa daha çabuk seker
  }
  function sayfaGuncelle(o, s, dt, icerde) {
    const t = now, k = o.k;
    if (s.durum === 'uc') {
      let tx, ty;
      if (icerde) {   // Feza'ya kuş sürüsü gibi eşlik eder
        tx = sinir(P.x + s.ofX + 70 * Math.sin(t * .35 + s.faz), o.x0 + 80, o.x1 - 80);
        ty = o.y - s.ofY - 40 * Math.sin(t * .5 + s.faz * 1.3);
      } else { tx = s.ev + 120 * Math.sin(t * .3 + s.faz); ty = o.y - 330 - 50 * Math.sin(t * .45 + s.faz); }
      s.vx += ((tx - s.x) * 1.1 - s.vx * .95) * dt;
      s.vy += ((ty - s.y) * 1.1 - s.vy * .95) * dt - Math.sin(s.kanat) * 140 * dt;   // her kanat vuruşunda hafif yükselir
      const v = Math.hypot(s.vx, s.vy); if (v > 270) { s.vx *= 270 / v; s.vy *= 270 / v; }
      s.x += s.vx * dt; s.y += s.vy * dt;
      s.kanat += dt * (8.5 + 4 * sinir(-s.vy / 120, 0, 1));
      s.egim += (sinir(s.vx * .0016, -.3, .3) - s.egim) * (1 - Math.exp(-dt * 3));
      s.acik += (0 - s.acik) * (1 - Math.exp(-dt * 7));
    } else if (s.durum === 'ac') {
      s.acT += dt;
      const kapan = s.acT > 2.8;
      // açıkken ekranın aynı yerinde süzülür (Feza yürüse de kaçmaz)
      const tx = cam.x + s.ekX, ty = s.hedefY + Math.sin(t * 1.4 + s.faz) * 6;
      s.x += (tx - s.x) * (1 - Math.exp(-dt * 5)); s.y += (ty - s.y) * (1 - Math.exp(-dt * 5));
      s.acik += ((kapan ? 0 : 1) - s.acik) * (1 - Math.exp(-dt * (kapan ? 9 : 7)));
      s.egim += (0 - s.egim) * (1 - Math.exp(-dt * 6));
      s.kanat = Math.PI / 2;   // kanatlar düz (açık kitap)
      if (kapan && s.acik < .3 && k.gemiSay < GEMI_EN && s.x > k.hx0 + 60 && s.x < k.hx1 - 60) {
        // kapanırken kâğıt gemi gibi katlanıp havuza süzülür
        s.durum = 'katla'; s.ku = 0; s.kx = s.x; s.ky = s.y; k.gemiSay++;
        s.gx = sinir(s.x, k.hx0 + 60, k.hx1 - 60); s.gy = k.yU + 14 + (k.gemiSay % 3) * 11; s.gyon = karma(s.faz) < .5 ? -1 : 1;
      } else if (kapan && s.acik < .05) { s.durum = 'uc'; s.vy = -170; s.vx = (Math.random() - .5) * 80; s.kanat = 0; }
    } else if (s.durum === 'katla') {
      s.ku += dt / 1.3;
      const u = yumusak(s.ku);
      s.x = s.kx + (s.gx - s.kx) * u; s.y = s.ky + (s.gy - s.ky) * u - Math.sin(Math.PI * u) * 50;
      s.acik += (0 - s.acik) * (1 - Math.exp(-dt * 9));
      if (s.ku >= 1) {
        s.durum = 'gemi'; s.x = s.gx; s.y = s.gy; s.vx = 0; s.hop = 0;
        halkaAt(s.x, s.y + 6, '#ffffff', 90, .9);
        olay('k12Damla', { o, x: s.x });
      }
    } else if (s.durum === 'gemi') {
      // havuzda süzülür; fıskiyeler ve su yayları yakından iterse hafifçe sürüklenir; uçlarda döner
      let it = 0;
      for (let i = 0; i < k.fiskiye.length; i++) { const j = k.fiskiye[i], d = s.x - j.x; if (Math.abs(d) < 70) it += Math.sign(d || 1) * (70 - Math.abs(d)) * .9 * (j.h / 120); }
      const hv = 16 * s.gyon + it;
      s.vx += (hv - s.vx) * (1 - Math.exp(-dt * 1.2));
      s.x += s.vx * dt;
      if (s.x < k.hx0 + 40) { s.x = k.hx0 + 40; s.gyon = 1; } else if (s.x > k.hx1 - 40) { s.x = k.hx1 - 40; s.gyon = -1; }
      s.hop = Math.max(0, s.hop - dt / .7);
      s.serit += dt;
    }
  }
  function sayfaAc(o, s, oto) {
    if (s.durum === 'katla') return;
    if (s.durum === 'gemi') {   // gemiye dokununca hoplar, döner, su sıçratır
      if (s.hop <= 0) { s.hop = 1; halkaAt(s.x, s.y + 6, '#ffffff', 110, .8); burst(s.x, s.y, 8, ['#e8f7ff', '#bfe6ff', '#ffffff'], 90, .7, 4); olay('k12Damla', { o, x: s.x }); }
      return;
    }
    if (s.durum === 'ac') { if (s.acT < 2.6) { s.acT = Math.min(s.acT, 1.2); burst(s.x, s.y, 8, ['#fff6c4', '#ffe066', '#ffffff'], 90, .8, 5); } return; }
    s.durum = 'ac'; s.acT = 0;
    s.ekX = sinir(s.x - cam.x, 150, VW - 150);
    s.hedefY = sinir(s.y, cam.y + 130, o.y - 250);
    burst(s.x, s.y, 10, ['#fff6c4', '#ffe066', '#ffffff', '#ffd6e4'], 110, .9, 6);
    olay('k12Sayfa', { o, x: s.x, oto: !!oto });
  }
  // havuzdaki kâğıt gemi (ciz katmanı: suyun üstünde, Feza'nın arkasında)
  function gemiCiz(s, t) {
    if (s.x < cam.x - 60 || s.x > cam.x + VW + 60) return;
    const hu = s.hop > 0 ? Math.sin(Math.PI * (1 - s.hop)) : 0, by = s.y + Math.sin(t * 2.1 + s.faz) * 1.3 - hu * 20;
    // Kâğıt gemi hoplarken yana yatar, sonra suya düzgün konar; yarım tur sonunda ters kalıp sıçramaz.
    const aci = Math.sin(t * 1.7 + s.faz) * .06 + hu * .3 * s.gyon;
    // iz: arkada iki küçük halka
    for (let r = 0; r < 2; r++) {
      const u = (t * .8 + r * .5 + s.faz) % 1;
      g.globalAlpha = (1 - u) * .45; g.strokeStyle = '#ffffff'; g.lineWidth = 1;
      g.beginPath(); g.ellipse(s.x - s.gyon * (12 + u * 18), s.y + 7, 5 + u * 14, 1.2 + u * 2.4, 0, 0, TAM); g.stroke();
    }
    g.globalAlpha = .25; elips(g, s.x, s.y + 8, 21, 3, '#2f6f86');       // suda gölge
    g.globalAlpha = 1;
    const gs = gemiSpr(s.v), o = s.olc * 1.35;
    yerlestir(s.x, by, aci, o * s.gyon, o); koy(gs, .5, .86);
    dunyaya();
  }
  function sayfaCiz(s, t) {
    if (s.x < cam.x - 120 || s.x > cam.x + VW + 120 || s.durum === 'gemi') return;
    let ac = yumusak(s.acik), olc = s.olc * (1 + 1.15 * ac);
    const spr = sayfaSpr(s.v), ga0 = g.globalAlpha;
    let ku = 0;
    if (s.durum === 'katla') { ku = yumusak(s.ku); olc *= 1 - .55 * ku; g.globalAlpha = ga0 * (1 - yumusak((s.ku - .2) / .5)); }
    // kanat çırpma: iki sayfa sırttan V biçiminde iner kalkar; açılınca düzleşir; katlanırken kapanır
    const cirp = s.durum === 'katla' ? ku * 1.2 : Math.sin(s.kanat) * .62 * (1 - ac), yakin = .72 + .28 * Math.abs(Math.cos(s.kanat)) * (1 - ac) + .28 * ac;
    if (ac > .05) { dunyaya(); dglow('#fff3c4', s.x, s.y, 70 * olc / s.olc * .6, .55 * ac); }
    // kitap kurdelesi (sırtta sarkan küçük ayraç; kitap açılınca toplanır)
    dunyaya();
    if (ac < .6 && s.durum !== 'katla') {
      const ko = s.olc * (1 - ac);
      g.beginPath(); g.moveTo(s.x, s.y + 16 * ko); g.quadraticCurveTo(s.x + 3 + Math.sin(t * 4 + s.faz) * 3, s.y + 24 * ko, s.x - 1, s.y + 31 * ko);
      cizgiGenis(g, '#ff7fa8', 2.2 * s.olc);
    }
    const ga = g.globalAlpha;
    if (ac < .95) {
      g.globalAlpha = ga * (1 - ac);
      yerlestir(s.x, s.y, s.egim - cirp, olc * yakin, olc); koy(spr, 0, .5);          // sağ sayfa
      yerlestir(s.x, s.y, s.egim + cirp, -olc * yakin, olc); koy(spr, 0, .5);         // sol sayfa
    }
    if (ac > .05) {   // açılırken resimcikler söner, boş krem sayfalar resmin zemini olur
      const bos = sayfaSpr(3);
      g.globalAlpha = ga * ac;
      yerlestir(s.x, s.y, s.egim - cirp, olc * yakin, olc); koy(bos, 0, .5);
      yerlestir(s.x, s.y, s.egim + cirp, -olc * yakin, olc); koy(bos, 0, .5);
    }
    g.globalAlpha = ga;
    // sırt (cilt)
    dunyaya();
    g.globalAlpha = ga * (1 - .75 * ac);
    g.beginPath(); g.moveTo(s.x, s.y - 19 * olc); g.lineTo(s.x, s.y + 19 * olc); cizgiGenis(g, '#c98a5a', 2.4 * s.olc * (1 + .4 * ac));
    g.globalAlpha = ga0;
    // katlanırken kâğıt gemi belirir
    if (s.durum === 'katla') {
      const ga2 = yumusak((s.ku - .25) / .45);
      if (ga2 > .01) { g.globalAlpha = ga0 * ga2; const gs = gemiSpr(s.v), b = s.olc * (1.7 - .35 * ku); yerlestir(s.x, s.y + 6, Math.sin(ku * 9) * .25 * (1 - ku), b * s.gyon, b); koy(gs, .5, .86); dunyaya(); }
      g.globalAlpha = ga0;
    }
    // açılan sayfanın resmi ışıkla belirir
    if (s.durum === 'ac' && ac > .4) {
      const u = sinir((s.acT - .3) / .6, 0, 1), pop = u < 1 ? 1 + Math.sin(u * Math.PI) * .18 : 1, ra = yumusak(u) * sinir((s.acik - .4) / .4, 0, 1);
      if (ra > .02) {
        dglow('#ffe9a0', s.x, s.y - 4 * olc, 46 * olc, .5 * ra);
        const rs = resimSpr(s.resim), b = olc * .6 * pop * (.6 + .4 * yumusak(u));
        g.globalAlpha = ra; yerlestir(s.x, s.y - 2 * olc, Math.sin(t * 1.6) * .05, b, b); koy(rs, .5, .53);
        dunyaya();
        // çevresinde dönen minik ışık yıldızları
        for (let j = 0; j < 5; j++) {
          const a = t * 1.6 + j * TAM / 5, rx = s.x + Math.cos(a) * 34 * olc, ry = s.y + Math.sin(a) * 22 * olc;
          g.globalAlpha = ra * (.5 + .5 * Math.sin(t * 5 + j));
          yildizYol(g, rx, ry, 3.2 + (j % 2), .42, 4); g.fillStyle = '#fff6c4'; g.fill();
        }
        if (!s.resimOlay && u > .2) { s.resimOlay = true; olay('k12SayfaResim', { o: null, x: s.x, resim: RESIMLER[s.resim] }); }
      }
    }
    if (s.durum === 'uc') s.resimOlay = false;
    g.globalAlpha = 1;
  }
  function fiskiyeCiz(j, yJ, t) {
    const h = Math.max(8, j.h), top = yJ - h, sal = Math.sin(t * 1.7 + j.i) * 4 * (h / 150), tx = j.x + sal;
    // su sütunu: dışta yarı saydam, içte parlak
    g.beginPath(); g.moveTo(j.x, yJ); g.quadraticCurveTo(j.x + sal * .4, yJ - h * .5, tx, top);
    cizgiGenis(g, 'rgba(200,236,255,.55)', 10); cizgiGenis(g, 'rgba(255,255,255,.95)', 4);
    // taç: iki yana dökülen yaylar
    g.beginPath();
    g.moveTo(tx, top); g.quadraticCurveTo(tx - h * .2, top - h * .07, j.x - h * .32, top + h * .5);
    g.moveTo(tx, top); g.quadraticCurveTo(tx + h * .2, top - h * .07, j.x + h * .32, top + h * .5);
    cizgiGenis(g, 'rgba(232,247,255,.7)', 3.4);
    // damlalar: zamanla dönen sabit yörüngeler (dizi yok); güneşte gökkuşağı renkleri
    for (let d = 0; d < 10; d++) {
      const u = (t * .9 + d / 10 + j.i * .37) % 1, s = d % 2 ? 1 : -1, yay = (.16 + .2 * karma(d * 3.1)) * h;
      const x = tx + s * yay * u * 1.7, y = top - h * .1 * u + h * .62 * u * u;
      if (y > yJ) continue;
      g.globalAlpha = .75 * (1 - u * .5);
      g.fillStyle = d % 3 === 0 ? GOK7[(d + j.i) % 7] : '#f2fbff';
      g.beginPath(); g.ellipse(x, y, 2.5, 3.1, 0, 0, TAM); g.fill();
    }
    g.globalAlpha = 1;
    dglow('#ffffff', tx, top, 14 + h * .06, .35);
    // dipteki halkalar ve suda titreyen yansıma
    for (let r = 0; r < 2; r++) {
      const u = (t * .7 + r * .5 + j.i * .21) % 1;
      g.globalAlpha = (1 - u) * .5; g.strokeStyle = '#ffffff'; g.lineWidth = 1.2;
      g.beginPath(); g.ellipse(j.x, yJ + 2, 6 + u * 30, 1.5 + u * 5, 0, 0, TAM); g.stroke();
    }
    g.globalAlpha = .22 * Math.min(1, h / 80);
    for (let r = 0; r < 3; r++) { g.fillStyle = '#ffffff'; g.fillRect(j.x - 3 + Math.sin(t * 6 + r * 2 + j.i) * 2.5, yJ + 4 + r * 5, 6, 2); }
    g.globalAlpha = 1;
  }
  // Su yayının görünen parçası: parabolün s0..s1 arası (baş parlak, kuyruk incelir)
  function yayParcaCiz(k, i, j, s0, s1, t) {
    if (s1 <= s0) return;
    const xa = k.meme[i], xb = k.meme[j], yB = k.yA - 10, hh = 58 + 8 * Math.sin(t * 1.3 + i);
    if (Math.max(xa, xb) < cam.x - 40 || Math.min(xa, xb) > cam.x + VW + 40) return;
    g.beginPath();
    for (let n = 0; n <= 8; n++) {
      const s = s0 + (s1 - s0) * n / 8, x = xa + (xb - xa) * s, y = yB - 4 * hh * s * (1 - s);
      if (n === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    cizgiGenis(g, 'rgba(200,236,255,.55)', 8); cizgiGenis(g, 'rgba(255,255,255,.95)', 3.2);
  }
  function yayCiz(k, h, t) {
    if (h.pu < 1.45 && h.pi >= 0) yayParcaCiz(k, h.pi, h.pj, Math.max(0, h.pu - .45), 1, t);   // önceki yayın son kuyruğu
    const s1 = Math.min(1, h.u), s0 = Math.max(0, h.u - .45);
    yayParcaCiz(k, h.i, h.j, s0, s1, t);
    // baş: parlak damla
    const xa = k.meme[h.i], xb = k.meme[h.j], hh = 58 + 8 * Math.sin(t * 1.3 + h.i), x = xa + (xb - xa) * s1, y = k.yA - 10 - 4 * hh * s1 * (1 - s1);
    if (x > cam.x - 40 && x < cam.x + VW + 40) { dglow('#ffffff', x, y, 11, .55); elips(g, x, y, 2.6, 2.6, '#ffffff'); }
  }
  function bilgiCiz(o, tm) {
    const k = o.k, yU = k.yU, yA = k.yA, yJ = k.yJ;
    const vx0 = Math.max(k.hx0, cam.x - 60), vx1 = Math.min(k.hx1, cam.x + VW + 60);
    if (vx1 > vx0) {
      // havuz: arka taş kenar, su, parıltılar
      g.fillStyle = '#d8cdb5'; g.fillRect(vx0, yU - 5, vx1 - vx0, 6);
      g.fillStyle = 'rgba(120,110,90,.25)'; g.fillRect(vx0, yU, vx1 - vx0, 2);
      g.drawImage(suSpr(), vx0, yU + 1, vx1 - vx0, yA - yU);
      const L = gunIsigi();
      if (L) { g.globalAlpha = L.guc * .22; g.fillStyle = L.ton; g.fillRect(vx0, yU + 1, vx1 - vx0, yA - yU); g.globalAlpha = 1; }
      for (let xx = Math.floor(vx0 / 90) * 90; xx < vx1; xx += 90) {
        const h = karma(xx * .013), x = xx + 40 * Math.sin(tm * .6 + h * 6), y = yU + 8 + h * (yA - yU - 16);
        if (x < vx0 + 10 || x > vx1 - 10) continue;
        g.globalAlpha = .3 + .2 * Math.sin(tm * 1.7 + h * 9);
        g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y, 12 + h * 10, 1.4, 0, 0, TAM); g.fill();
      }
      g.globalAlpha = 1;
      halkaCiz();
      for (let i = 0; i < k.sayfa.length; i++) if (k.sayfa[i].durum === 'gemi') gemiCiz(k.sayfa[i], tm);
      for (let i = 0; i < k.fiskiye.length; i++) { const j = k.fiskiye[i]; if (j.x > cam.x - 120 && j.x < cam.x + VW + 120) fiskiyeCiz(j, yJ, tm); }
      for (let i = 0; i < k.yay.length; i++) yayCiz(k, k.yay[i], tm);
      // memeler: ön bordürün iç kenarında küçük pirinç halkalar
      for (let i = 0; i < k.meme.length; i++) { const x = k.meme[i]; if (x > vx0 && x < vx1) elips(g, x, yA - 9, 3.2, 1.2, 'rgba(200,170,110,.7)'); }
      // ön taş bordür
      g.fillStyle = '#efe6d3'; g.fillRect(vx0, yA - 2, vx1 - vx0, 11);
      g.fillStyle = '#fffaf0'; g.fillRect(vx0, yA - 2, vx1 - vx0, 2);
      g.fillStyle = 'rgba(95,85,65,.22)'; g.fillRect(vx0, yA + 8, vx1 - vx0, 2);
      for (let xx = Math.ceil(vx0 / 120) * 120; xx < vx1; xx += 120) { g.fillStyle = 'rgba(160,145,115,.35)'; g.fillRect(xx, yA, 1.2, 8); }
      // havuzun iki ucu
      for (let e = 0; e < 2; e++) {
        const ux = e ? k.hx1 : k.hx0; if (ux < vx0 - 1 || ux > vx1 + 1) continue;
        g.fillStyle = '#e4d9c2'; g.beginPath(); g.roundRect ? g.roundRect(ux - 7, yU - 6, 14, yA - yU + 16, 5) : g.rect(ux - 7, yU - 6, 14, yA - yU + 16); g.fill();
        g.fillStyle = '#fffaf0'; g.fillRect(ux - 7, yU - 6, 14, 2);
      }
    }
    // damlalardaki gökkuşağı
    if (k.gok > .02) {
      const gs = gokkusagiSpr(), w = 230 + 90 * k.gok;
      g.globalAlpha = Math.min(1, k.gok * 1.5) * .9; g.drawImage(gs, k.gokX - w / 2, yJ - 20 - w * .53, w, w * .53); g.globalAlpha = 1;
    }
  }
  function bilgiCizOn(o, tm) {
    const k = o.k;
    for (let i = 0; i < k.sayfa.length; i++) { if (k.sayfa[i].durum === 'uc') sayfaCiz(k.sayfa[i], tm); }
    for (let i = 0; i < k.sayfa.length; i++) { const d = k.sayfa[i].durum; if (d === 'ac' || d === 'katla') sayfaCiz(k.sayfa[i], tm); }   // açık sayfa en önde
    ucusanCiz();
    dunyaya(); g.globalAlpha = 1;
  }
  function bilgiDokun(o, p) {
    const k = o.k;
    // önce sayfalar (gökte): açık sayfa büyük, önce o denenir
    let en = null, enD = 1e9;
    for (let i = 0; i < k.sayfa.length; i++) {
      const s = k.sayfa[i]; if (s.durum === 'gemi' || s.durum === 'katla') continue;
      const r = dokunmaYari((s.durum === 'ac' ? 70 : 46) * s.olc + 8), d = Math.hypot(p.x - s.x, p.y - s.y);
      if (d < r && d < enD) { en = s; enD = d; }
    }
    if (en) { k.sonDokunus = now; sayfaAc(o, en, false); return 2; }
    if (p.y > o.y - 4 || p.x < k.hx0 || p.x > k.hx1) return 0;
    // kâğıt gemiler
    for (let i = 0; i < k.sayfa.length; i++) {
      const s = k.sayfa[i]; if (s.durum !== 'gemi') continue;
      if (Math.hypot(p.x - s.x, (p.y - s.y) * 1.4) < 34) { k.sonDokunus = now; sayfaAc(o, s, false); return 1; }
    }
    // fıskiyeler (su sütununa ya da dibine)
    const yJ = k.yJ;
    let fj = null, fd = 1e9;
    for (let i = 0; i < k.fiskiye.length; i++) {
      const j = k.fiskiye[i], d = Math.abs(p.x - j.x);
      if (d < 70 && p.y > yJ - j.h - 40 && d < fd) { fj = j; fd = d; }
    }
    if (fj) {
      // Hızlı art arda dokunuşlar su sütununu ekranın dışına fırlatmasın.
      if (fj.dokunT > 0) return 1;
      fj.dokunT = .28; fj.sicra = 1.3; fj.hv = Math.min(980, fj.hv + 900);
      k.gokParla = 1; k.sonDokunus = now;
      // komşu fıskiyeler de sırayla zıplar (küçük bir su dalgası) ve gökkuşağı renkli damlalar saçılır
      for (let i = 0; i < k.fiskiye.length; i++) {
        const j = k.fiskiye[i], d = Math.abs(j.x - fj.x);
        if (j !== fj && d < 760) j.cevap = .1 + d / 820;
      }
      anneSevindi(fj.x);
      burst(fj.x, yJ - fj.h * .8, 16, GOK7, 200, 1, 5);
      for (let i = 0; i < 9; i++) yaprakAt(fj.x + (Math.random() - .5) * 20, yJ - fj.h * .7, (Math.random() - .5) * 220, -120 - Math.random() * 120, i % 3 === 0 ? GOK7[i % 7] : '#e8f7ff', .8, false);
      burst(fj.x, yJ - 10, 10, ['#e8f7ff', '#bfe6ff', '#ffffff'], 140, .8, 5);
      olay('k12Fiskiye', { o, x: fj.x, guc: 1 }); olay('k12Damla', { o, x: fj.x });
      return 1;   // olayı yutma: Feza havuz kenarında oraya yürüyebilir
    }
    // suya dokunmak: halkalar yayılır, su taç gibi sıçrar, iki su yayı oraya koşar
    if (p.y > k.yU - 30) {
      const sx = p.x, sy = sinir(p.y, k.yU + 8, k.yA - 8);
      halkaAt(sx, sy, '#ffffff', 120, 1); halkaAt(sx, sy, '#bfe6ff', 70, .7);
      for (let i = 0; i < 8; i++) yaprakAt(sx + (Math.random() - .5) * 14, sy - 4, (Math.random() - .5) * 160, -110 - Math.random() * 90, i % 3 === 0 ? GOK7[(i * 2) % 7] : '#e8f7ff', .75, false);
      k.cagriX = sx; k.cagriT = 2.5; k.sonDokunus = now;
      olay('k12Damla', { o, x: sx });
      return 1;
    }
    return 0;
  }

  // ════════════════════ türler ════════════════════
  const ETK = { bahce: null, ucurtma: null, bilgi: null };
  TUR.kaydet('k12Bahce', {
    kur(o) { bahceKur(o); ETK.bahce = o; },
    guncelle: bahceGuncelle,
    ciz(o, tm) { bahceCiz(o, tm, false); },
    cizOn(o, tm) { bahceCiz(o, tm, true); },
  });
  TUR.kaydet('k12Ucurtma', {
    kur(o) { ucurtmaKur(o); ETK.ucurtma = o; },
    guncelle: ucurtmaGuncelle,
    ciz: ucurtmaCiz,
    cizOn(o, tm) { ucusanCiz(); kelebekCiz(); dunyaya(); },
  });
  TUR.kaydet('k12Bilgi', {
    kur(o) { bilgiKur(o); ETK.bilgi = o; },
    guncelle: bilgiGuncelle,
    ciz: bilgiCiz,
    cizOn: bilgiCizOn,
  });

  // ── dokunma: dünya noktasına çevir, sırayla etkinliklere sor ──
  const NOKTA = { x: 0, y: 0 };
  function dokunmaYakala(e) {
    if (DURUM !== 'oyun' || P.ucus || e.target !== cv || (e.pointerType === 'mouse' && e.button !== 0)) return;
    if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi oyunun
    const r = cv.getBoundingClientRect();
    NOKTA.x = cam.x + (e.clientX - r.left) * DPR / S; NOKTA.y = cam.y + (e.clientY - r.top) * DPR / S;
    if (!Number.isFinite(NOKTA.x) || !Number.isFinite(NOKTA.y)) return;
    let sonuc = 0;
    try {
      if (ETK.ucurtma && Math.abs(NOKTA.x - ETK.ucurtma.x) < VW) sonuc = ucurtmaDokun(ETK.ucurtma, NOKTA);
      if (!sonuc && ETK.bilgi && NOKTA.x > ETK.bilgi.x0 - 200 && NOKTA.x < ETK.bilgi.x1 + 200) sonuc = bilgiDokun(ETK.bilgi, NOKTA);
      if (!sonuc && ETK.bahce && NOKTA.x > ETK.bahce.x0 - 60 && NOKTA.x < ETK.bahce.x1 + 60) sonuc = bahceDokun(ETK.bahce, NOKTA);
    } catch (err) { if (typeof omHataBildir === 'function') omHataBildir('etkinlik12.dokun', err); sonuc = 0; }
    if (sonuc === 2) { if (e.cancelable) e.preventDefault(); e.stopPropagation(); }
  }
  addEventListener('pointerdown', dokunmaYakala, true);
  // klavye yedeği: Enter / E en yakın etkinliği tetikler (oklar ve boşluk oyunda kalır)
  addEventListener('keydown', e => {
    if (DURUM !== 'oyun' || P.ucus || e.repeat || (e.code !== 'Enter' && e.code !== 'KeyE')) return;
    if (e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
    const u = ETK.ucurtma, b = ETK.bilgi, h = ETK.bahce;
    if (u && (u.k.durum === 'uc')) { takla(u, false); return; }
    if (b && P.x > b.x0 && P.x < b.x1) {
      let en = null, d0 = 1e9;
      for (const s of b.k.sayfa) { const d = Math.abs(s.x - P.x); if (d < d0) { d0 = d; en = s; } }
      if (en) { b.k.sonDokunus = now; sayfaAc(b, en, false); }
      return;
    }
    if (h && P.x > h.x0 - 60 && P.x < h.x1 + 60) {
      let en = null, d0 = 1e9;
      for (const f of h.k.cicekler) { const d = Math.abs(f.x - P.x - (P.f || 1) * 30); if (d < d0) { d0 = d; en = f; } }
      if (en) cicekAc(h, en, true);
    }
  });
  OLAY.on('durum', d => { if (d !== 'oyun' && ETK.ucurtma && ETK.ucurtma.k.durum === 'uc') fezaPoz(null); });

  // Test kancası
  window.ETK12 = {
    get bahce() { return ETK.bahce; }, get ucurtma() { return ETK.ucurtma; }, get bilgi() { return ETK.bilgi; },
    takla() { if (ETK.ucurtma) takla(ETK.ucurtma, false); },
    sayfaAc(i) { const b = ETK.bilgi; if (b) sayfaAc(b, b.k.sayfa[i || 0], false); },
    cicekDokun(i) { const h = ETK.bahce; if (h) cicekAc(h, h.k.cicekler[i || 0], true); },
    dokunXY(tip, x, y) { const o = ETK[tip]; return o ? (tip === 'bahce' ? bahceDokun(o, {x, y}) : tip === 'bilgi' ? bilgiDokun(o, {x, y}) : ucurtmaDokun(o, {x, y})) : 0; },
    get kelebek() { let n = 0; for (const b of KELEBEK) if (b.aktif) n++; return n; },
  };
})();
