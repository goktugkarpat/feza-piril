/* iskelet.js – Bölüm 8 (Balkabağı Gecesi) mini oyun 2: İSKELET ORKESTRASI (önek is8), nesne türü 'iskeletMini'.
   Koru ile şeker sokağı arasındaki açıklıkta küçük, tahta bir sahne: önünde gülen kabak ışıkları, üstünde kadife saçak, bayrak süsü ve
   minik ampuller. Sahnede beş SEVİMLİ iskelet uyuklar (tombul, fiyonklu, silindir şapkalı, atkılı, minik); Feza yaklaşınca kabak ışıkları
   sırayla yanar, iskeletler birer birer uyanıp kafalarını takırdatır. Kaburgaları KSİLOFON: her kaburga pastel renkli bir çubuk.
   Feza sahnenin önüne gelince fizik devralınır (kardan.js gibi P.ucus = o; Feza'yı ve Pırıl'ı bu dosya çizer), kadraj yerleşir:
   1) Tanışma: iskeletler soldan sağa birer nota çalıp el sallar (Re Fa Sol La Do Re).
   2) Ezgi: 4 kısa cümle × 4 nota (IS8_EZGI). Sırası gelen iskeletin üstüne sahne ışığı düşer; parlar, kıpır kıpır "ben!" der, diğerleri
      ona bakar. Feza ona dokununca (cömert: ekrana nereye dokunulsa en yakın iskelet çalar) iskelet tokmağıyla kendi kaburgasına vurur:
      AU.sfx('iskeletNota', i), zıplar, çubuk yanar, ışıktan bir nota havalanır ve komik bir figür yapar (el sallama, kalça sallama,
      kafayı havaya atıp döndürüp yakalama, çene takırdatıp kıkırdama, tekme, şapka selamı, koca zıplayış). Başka bir iskelete dokunmak da
      güzel: o da kendi notasını çalar ve figür yapar, ışık sıradakinde kalır. Yanlış yok.
   3) Her cümlenin sonunda bir ölçü (4 vuruş, 112 BPM) hep birlikte dans (AU.sfx 'iskeletDans' n + her vuruşta 'kemikTakir').
   4) Son cümleden sonra BÜYÜK KEMİK DANSI (~6 sn): el ele dizilip 1-2-3-tekme, kafalar takır takır, kaburgalar bütün ezgiyi swing'li
      sekizliklerle yeniden çalar; sonunda "ta-da!" zıplayışı. Sonra V8.iskelet = true, o.done = true, OLAY 'iskeletBitti'.
   ~6 sn dokunulmazsa Pırıl sıradaki iskeletin üstüne uçup ışık serper (ipucu); ~20 sn (sonra ~10 sn) dokunulmazsa Pırıl kendisi
   burnuyla dokunup çalar; çocuk dokununca bırakır. Asla takılmaz. Kaybetme/yazı/öğretici el yok.
   Klavye yedeği: Boşluk/Enter/E = sıradaki iskelet, 1-5 = iskelet seç.
   Olaylar: 'iskeletBasla' {o}, 'iskeletNota' {o, n (1..16), i, kim, cumle (1..4), yardim}, 'iskeletSerbest' {o, i, kim},
   'iskeletDans' {o, n (1..3 cümle sonu, 5 final), vurus}, 'iskeletIpucu' {o, n, kim} (boşta 6 sn), 'iskeletYardim' {o, n}
   (Pırıl çalmaya başlar), 'iskeletBitti' {o}. Saat: ISKELET.vurus() ('iskeletBasla'dan beri vuruş).
   Bitince iskeletler sahnede hafifçe dans etmeyi sürdürür; Feza yakındayken birine dokunmak notasını çalar (serbest çalma).
   Ortak çizici: iskeletCiz(c, x, y, s, t, o) — x,y ayakların ortası (zemin), s ölçek, t saniye. s = 1'de boy × en (birim; Feza ≈ 60 boy):
     tombul 85 × 59 · fiyonklu 85 × 47 · silindir şapkalı 118 × 51 (şapkayla) · atkılı 89 × 51 · minik 61 × 34 · nine 85 × 42
     (el sallarken 46). Sahnede (iskeletMini) s = IS8_OLC = 1.18.
     o: { tip: 0 tombul · 1 fiyonklu · 2 silindir şapkalı · 3 atkılı · 4 minik (boy farkı tipten gelir; nine'de verilmezse 1),
          dans: 0..1 (genel dans: vuruşta zıplar, kollar havada, kafa takırdar), faz (dans fazı, vuruş; yoksa t·112/60),
          kafa: 0..1 (kafa sallantısı/takırtı), nine: true (şal + gözlük + topuz: kapıdaki iskelet nine; tip yalnız gövdeyi seçer),
          calma: 0..1 (ksilofon vuruşu zarfı: 1 = tokmak kaburgaya değdi), cubuk (vurulan kaburga), cubukI: 0..1 (o kaburganın ışığı;
          yoksa calma), hepsi: 0..1 (bütün kaburgalar yanar), yon: -1..1 (bakış), el: 0..1 (el sallama), alkis: 0..1 (alkış),
          heves: 0..1 ("ben!" kıpırtısı), mutlu (gülen kapalı gözler), sevinc: 0..1 (gülen kısık gözler + gülüş),
          sasir: 0..1 (şaşkın-sevinçli "o" ağız, iri gözler), uyku: 0..1, parla: 0..1 (kendi renginde hale),
          hareket: 'el'|'kalca'|'kafa'|'cene'|'tekme'|'sapka'|'zipla'|'selam'|'conga'|'tada', hu: 0..1 (figürün ilerleyişi),
          tokmak: false (tokmaksız), alpha }.
     Karede gradyan/filtre yok: bütün parçalar ilk çağrıda bir kez önbellek tuvallerine çizilir; birkaç iskelet aynı anda ucuzdur.
   Yerleşim (bolum8.js): nesne('iskeletMini', 406, yuzey(406)) — o.x sahnenin ortası; o.x-420 … o.x+340 DÜZ zemin; Feza o.x-372
   civarında durur; hemen ilerisinde miniKapi (bagId; o.done / V8.iskelet ile açılır). */
'use strict';
const IS8_BPM = 112, IS8_VUR = 60 / IS8_BPM;                 // vuruş süresi (sn)
const IS8_EZGI = [[0, 1, 2, 3], [4, 3, 2, 3], [5, 4, 3, 2], [1, 2, 1, 0]];   // "kemik dansı": Re Fa Sol La | Do La Sol La | Re' Do La Sol | Fa Sol Fa Re
const IS8_SAHIP = [0, 1, 2, 3, 4, 4];                         // nota (0..5) → çalan iskelet (sahnede soldan sağa)
const IS8_DX = [-230, -115, 0, 113, 220];                     // iskeletlerin sahnedeki yeri (o.x'e göre)
const IS8_SY = -40;                                           // sahne tahtası: iskeletlerin bastığı yer (o.y'ye göre)
const IS8_GIRIS = 372;                                        // Feza o.x - 372'de durur
const IS8_IPUCU = 6, IS8_YARDIM = 20, IS8_YARDIM2 = 10;       // boşta bekleme eşikleri (sn)
const IS8_FIG = 1.15;                                         // tek iskelet figürü (sn)
const IS8_OLC = 1.18;                                         // sahnedeki iskeletlerin ölçeği
const IS8_R = 4, IS8_R2 = 2.5;                                // sprite çözünürlüğü (piksel / birim): iskelet parçaları · sahne
const IS8_KEMIK = '#fff6e8', IS8_KONTUR = '#4f3c86';
// kişilikler (tip = sahnedeki sıra): boy, kafa, göğüs (ksilofon) eni/boyu, bacak, kol, kaburga renkleri (üstten), kendi rengi, sevdiği figürler
const IS8_TIP = [
  { ad: 'tombul',   s: 0.92, kafa: 1.05, gw: 1.42, gh: 1.1,  bacak: 0.78, kol: 0.92, cubuk: ['#ff9fc8', '#ffc38a', '#fff08a', '#9effc8', '#9fd8ff'], renk: '#ffb347', fig: ['kalca', 'cene', 'el', 'kafa'] },
  { ad: 'fiyonk',   s: 0.9,  kafa: 1.0,  gw: 1.0,  gh: 1.0,  bacak: 0.95, kol: 0.95, cubuk: ['#ff9fc8', '#fff08a', '#9effc8', '#c9a8ff'], renk: '#ff8fc8', fig: ['el', 'kalca', 'kafa', 'cene'] },
  { ad: 'silindir', s: 1.02, kafa: 0.97, gw: 0.94, gh: 1.06, bacak: 1.2,  kol: 1.05, cubuk: ['#c9a8ff', '#9fd8ff', '#9effc8', '#fff08a'], renk: '#c39bff', fig: ['sapka', 'kafa', 'tekme', 'el'] },
  { ad: 'atki',     s: 0.97, kafa: 1.0,  gw: 1.0,  gh: 1.0,  bacak: 1.0,  kol: 1.0,  cubuk: ['#9effc8', '#9fd8ff', '#c9a8ff', '#ff9fc8'], renk: '#7dffc4', fig: ['cene', 'tekme', 'el', 'kafa'] },
  { ad: 'minik',    s: 0.68, kafa: 1.2,  gw: 0.92, gh: 0.82, bacak: 0.78, kol: 0.9,  cubuk: ['#fff08a', '#ff9fc8', '#9fd8ff'], renk: '#e8ff8a', fig: ['zipla', 'kafa', 'cene', 'tekme'] }];
// temel ölçüler (birim, s = 1, kişilik çarpanlarından önce)
const IS8_B = { ayak: 2.6, uyluk: 10.4, baldir: 9.8, kalca: 5.6, pelW: 19, pelH: 8, omur: 5.2, gogW: 26, gogH: 25, boyun: 3.4, kafaR: 17, pazu: 10, onkol: 9.2, kemik: 4.8 };
const IS8_OL = [];
function is8Ol(tip) {   // kişiliğe göre ölçüler + kaburga çubukları (bir kez)
  let ol = IS8_OL[tip]; if (ol) return ol;
  const tp = IS8_TIP[tip], B = IS8_B, uy = B.uyluk * tp.bacak, ba = B.baldir * tp.bacak, gw = B.gogW * tp.gw, gh = B.gogH * tp.gh;
  const n = tp.cubuk.length, adim = (gh - 9) / Math.max(1, n - 1), ch = Math.min(4.2, adim - 1.05), cub = [];
  for (let i = 0; i < n; i++) cub.push({ y: -gh / 2 + 6.4 + i * adim, w: gw * (1.08 - 0.3 * i / Math.max(1, n - 1)), h: ch, col: tp.cubuk[i], sp: null });
  ol = IS8_OL[tip] = { uy, ba, kw: B.kalca * Math.sqrt(tp.gw), pw: B.pelW * Math.pow(tp.gw, 0.75), ph: B.pelH * (tip === 0 ? 1.1 : 1),
    om: B.omur * (tip === 4 ? 0.65 : 1), gw, gh, by: B.boyun * (tip === 4 ? 0.8 : 1), kr: B.kafaR * tp.kafa, pz: B.pazu * tp.kol, ok: B.onkol * tp.kol,
    kal: B.kemik * (tip === 0 ? 1.12 : tip === 4 ? 0.94 : 1), hipY: -(B.ayak + (uy + ba) * 0.965), cub, gogus: null, pelvis: null, tokmak: null, tokL: tip === 4 ? 10.5 : 13 };
  // dinlenirken göğüs ortasının ve kafa tepesinin yüksekliği (yerden; ışık notası, Pırıl'ın ipucu yeri, dokunma hedefi için)
  ol.gogusY = ol.hipY + 0.5 - (ol.ph * 0.5 + ol.om) - gh / 2;
  ol.tepeY = ol.hipY - (ol.ph * 0.5 + ol.om) - gh - ol.by - ol.kr * 1.85 - (tip === 2 ? 20 : tip === 1 ? 6 : 0);
  return ol;
}

// ── önbellek tuvalleri ──
function is8Cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
// sprite: birim cinsinden en/boy ve çapa (ox, oy); fn(q) birim koordinatında çizer (çapa = 0,0)
function is8Spr(w, h, ox, oy, fn, R) {
  R = R || IS8_R; const cv = is8Cv(w * R, h * R), q = cv.getContext('2d');
  q.scale(R, R); q.translate(ox, oy); q.lineCap = 'round'; q.lineJoin = 'round'; fn(q);
  return { c: cv, w, h, ox, oy };
}
function is8Bas(c, sp, x, y, k) { k = k || 1; c.drawImage(sp.c, x - sp.ox * k, y - sp.oy * k, sp.w * k, sp.h * k); }
function is8Glow(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
function is8Elips(q, x, y, rx, ry, r) { q.beginPath(); q.ellipse(x, y, rx, ry, r || 0, 0, 6.2832); }
function is8Yuv(q, x, y, w, h, r) {   // yuvarlak köşeli dikdörtgen yolu (beginPath dahil)
  r = Math.min(r, w / 2, h / 2); q.beginPath(); q.moveTo(x + r, y); q.arcTo(x + w, y, x + w, y + h, r); q.arcTo(x + w, y + h, x, y + h, r); q.arcTo(x, y + h, x, y, r); q.arcTo(x, y, x + w, y, r); q.closePath();
}
function is8Kat(q, fn, col, e) {   // aynı yolu önce koyu kontur (e kadar taşkın), sonra kendi rengiyle doldur
  q.save(); q.strokeStyle = IS8_KONTUR; q.lineWidth = e * 2; fn(q); q.stroke(); q.fillStyle = col; q.fill(); q.restore();
}
const IS8_S = { hazir: false, kemik: new Map() };
function is8Hazirla() {
  if (IS8_S.hazir) return; IS8_S.hazir = true;
  const S1 = IS8_S;
  // kafa: yuvarlak, krem; sol üstten ay ışığı, sağ altta lila gölge, altta sıcak sahne ışığı yansıması
  S1.kafa = is8Spr(44, 42, 22, 21, q => {
    const r = 17;
    q.fillStyle = IS8_KONTUR; is8Elips(q, 0, 0, r + 1.05, r * 0.96 + 1.05); q.fill();
    const gr = q.createRadialGradient(-r * 0.38, -r * 0.42, r * 0.08, -r * 0.05, 0, r * 1.12);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#fff7ea'); gr.addColorStop(0.78, '#f1e3ee'); gr.addColorStop(1, '#d6c3e8');
    q.fillStyle = gr; is8Elips(q, 0, 0, r, r * 0.96); q.fill();
    q.save(); is8Elips(q, 0, 0, r, r * 0.96); q.clip();
    const ga = q.createRadialGradient(r * 0.1, r * 1.15, r * 0.1, r * 0.1, r * 1.15, r * 0.95);
    ga.addColorStop(0, 'rgba(255,196,120,0.42)'); ga.addColorStop(1, 'rgba(255,196,120,0)'); q.fillStyle = ga; q.fillRect(-r, 0, r * 2, r * 1.2);
    q.restore();
    q.fillStyle = 'rgba(255,255,255,0.9)'; is8Elips(q, -r * 0.45, -r * 0.55, r * 0.24, r * 0.12, -0.65); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.6)'; is8Elips(q, -r * 0.18, -r * 0.74, r * 0.07, r * 0.05, -0.3); q.fill();
  });
  // boncuk göz: kocaman, parlak; iki ışık noktası (göz çukuru değil)
  S1.goz = is8Spr(12, 14, 6, 7, q => {
    const gr = q.createRadialGradient(0.4, 2.6, 0.4, 0, 0.6, 6.2);
    gr.addColorStop(0, '#6b58b0'); gr.addColorStop(0.5, '#2e2356'); gr.addColorStop(1, '#191132');
    q.fillStyle = gr; is8Elips(q, 0, 0, 4.6, 5.6); q.fill();
    q.strokeStyle = 'rgba(196,166,255,0.6)'; q.lineWidth = 0.75; q.beginPath(); q.arc(0, 0.5, 3.5, 0.35 * Math.PI, 0.78 * Math.PI); q.stroke();
    q.fillStyle = '#ffffff'; is8Elips(q, -1.45, -2.2, 1.75, 1.95); q.fill();
    q.beginPath(); q.arc(1.75, 1.7, 0.85, 0, 6.2832); q.fill();
    q.globalAlpha = 0.8; q.beginPath(); q.arc(-2.5, 0.5, 0.45, 0, 6.2832); q.fill(); q.globalAlpha = 1;
  });
  // pembe yanak
  S1.yanak = is8Spr(12, 8, 6, 4, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 5.6); gr.addColorStop(0, 'rgba(255,130,190,0.7)'); gr.addColorStop(0.55, 'rgba(255,140,195,0.38)'); gr.addColorStop(1, 'rgba(255,150,200,0)');
    q.fillStyle = gr; q.save(); q.scale(1, 0.62); q.beginPath(); q.arc(0, 0, 5.6, 0, 6.2832); q.fill(); q.restore();
  });
  // minik kalp burun
  S1.burun = is8Spr(6, 5.4, 3, 2.4, q => {
    q.fillStyle = '#d98ccf'; q.beginPath(); q.moveTo(0, 1.9); q.bezierCurveTo(-2.4, 0.2, -1.3, -1.9, 0, -0.8); q.bezierCurveTo(1.3, -1.9, 2.4, 0.2, 0, 1.9); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.arc(-0.7, -0.6, 0.4, 0, 6.2832); q.fill();
  });
  // omur, leğen (göğüs ve leğen kişiliğe göre is8OlSpr'de)
  S1.omur = is8Spr(9, 6, 4.5, 3, q => { is8Kat(q, q => is8Yuv(q, -3.3, -1.75, 6.6, 3.5, 1.6), IS8_KEMIK, 0.85); q.fillStyle = 'rgba(205,185,228,0.7)'; q.fillRect(-2.6, 0.5, 5.2, 0.8); });
  // el: tombul eldiven (bilekten +x yönünde)
  S1.el = is8Spr(12, 11, 2, 5.5, q => {
    const yol = q => { q.beginPath(); q.arc(2.7, 0, 3.1, 0, 6.2832); q.moveTo(6.6, -1.6); q.arc(5.4, -1.6, 1.3, 0, 6.2832); q.moveTo(7.2, 0.1); q.arc(5.9, 0.1, 1.35, 0, 6.2832); q.moveTo(6.6, 1.8); q.arc(5.3, 1.8, 1.25, 0, 6.2832); q.moveTo(4.6, -3.1); q.arc(3.4, -3.1, 1.2, 0, 6.2832); };
    q.fillStyle = IS8_KONTUR; q.strokeStyle = IS8_KONTUR; q.lineWidth = 1.7; yol(q); q.stroke(); q.fill();
    q.fillStyle = IS8_KEMIK; yol(q); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(2.0, -1.2, 1.0, 0, 6.2832); q.fill();
  });
  // ayak: yuvarlak kemik ayakkabı (bilekten +x yönünde)
  S1.ayak = is8Spr(14, 8, 2.5, 3.2, q => {
    const yol = q => { q.beginPath(); q.ellipse(2.4, 0.5, 5.2, 2.3, 0, 0, 6.2832); q.moveTo(8.6, -0.3); q.arc(7.4, -0.3, 1.2, 0, 6.2832); q.moveTo(8.9, 1.2); q.arc(7.7, 1.2, 1.15, 0, 6.2832); };
    q.fillStyle = IS8_KONTUR; q.strokeStyle = IS8_KONTUR; q.lineWidth = 1.7; yol(q); q.stroke(); q.fill();
    q.fillStyle = IS8_KEMIK; yol(q); q.fill();
    q.fillStyle = 'rgba(205,185,228,0.75)'; q.beginPath(); q.ellipse(2.6, 1.9, 4.2, 0.8, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(1.6, -0.8, 2.4, 0.7, 0, 0, 6.2832); q.fill();
  });
  // zemin gölgesi
  S1.golge = is8Spr(32, 8, 16, 4, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 16); gr.addColorStop(0, 'rgba(40,24,80,0.6)'); gr.addColorStop(0.6, 'rgba(40,24,80,0.25)'); gr.addColorStop(1, 'rgba(40,24,80,0)');
    q.fillStyle = gr; q.save(); q.scale(1, 0.25); q.beginPath(); q.arc(0, 0, 16, 0, 6.2832); q.fill(); q.restore();
  }, 3);
  // fiyonk (pembe, beyaz puantiyeli)
  S1.fiyonk = is8Spr(22, 14, 11, 7, q => {
    const kanat = (s) => q => { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(s * 3, -6.5, s * 9.5, -6.5, s * 9.2, -0.5); q.bezierCurveTo(s * 9, 4.8, s * 3.5, 5.5, 0, 0); };
    for (const s of [-1, 1]) {
      is8Kat(q, kanat(s), '#ff8fc8', 0.85);
      q.fillStyle = '#e86aa8'; q.beginPath(); q.moveTo(s * 1.2, 0); q.bezierCurveTo(s * 3.5, -2.2, s * 5.5, -1.8, s * 5.2, 0.6); q.bezierCurveTo(s * 4, 1.6, s * 2.6, 1.4, s * 1.2, 0); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.92)'; for (const [dx, dy] of [[6.8, -3], [7.6, 1.6], [4, -3.6]]) { q.beginPath(); q.arc(s * dx, dy, 0.8, 0, 6.2832); q.fill(); }
    }
    is8Kat(q, q => { q.beginPath(); q.ellipse(0, 0, 2.3, 2.8, 0, 0, 6.2832); }, '#ffb3d9', 0.8);
    q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(-0.7, -1, 0.7, 0, 6.2832); q.fill();
  });
  // silindir şapka: mor, turuncu kurdeleli, yıldız tokalı (çapa: kenarın ortası)
  S1.sapka = is8Spr(36, 32, 18, 27, q => {
    is8Kat(q, q => { q.beginPath(); q.moveTo(-9.6, 0); q.lineTo(-10.6, -21); q.quadraticCurveTo(0, -23.5, 10.6, -21); q.lineTo(9.6, 0); q.closePath(); }, '#5b3fa0', 0.95);
    q.fillStyle = '#7d5cc4'; q.beginPath(); q.moveTo(-8.4, -1); q.lineTo(-9.3, -20); q.quadraticCurveTo(-6.5, -20.8, -5, -21); q.lineTo(-4.6, -1); q.closePath(); q.fill();
    q.fillStyle = 'rgba(160,130,230,0.5)'; is8Elips(q, 0, -21.2, 10.2, 1.7); q.fill();
    q.fillStyle = '#ff9a3c'; q.fillRect(-9.75, -6.6, 19.5, 4.4); q.fillStyle = '#ffc070'; q.fillRect(-9.75, -6.6, 19.5, 1.1);
    q.fillStyle = '#ffe7a8'; q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.1 : 2.6; q.lineTo(4.6 + Math.cos(a) * r, -4.4 + Math.sin(a) * r); } q.closePath(); q.fill();
    is8Kat(q, q => { q.beginPath(); q.ellipse(0, 0, 15, 2.9, 0, 0, 6.2832); }, '#4a3290', 0.95);
    q.fillStyle = 'rgba(170,140,240,0.55)'; is8Elips(q, -3, -0.9, 9, 1); q.fill();
  });
  // papyon (silindir şapkalının boynunda)
  S1.papyon = is8Spr(16, 10, 8, 5, q => {
    for (const s of [-1, 1]) is8Kat(q, q => { q.beginPath(); q.moveTo(0, 0); q.lineTo(s * 6.4, -3.4); q.quadraticCurveTo(s * 7.4, 0, s * 6.4, 3.4); q.closePath(); }, '#ff9a3c', 0.8);
    q.fillStyle = '#c39bff'; for (const [dx, dy] of [[-4.5, -0.8], [4.6, 0.9], [-3, 1.6], [3.2, -1.5]]) { q.beginPath(); q.arc(dx, dy, 0.7, 0, 6.2832); q.fill(); }
    is8Kat(q, q => is8Yuv(q, -1.6, -2, 3.2, 4, 1.2), '#e8702a', 0.7);
  });
  // atkı: boyun bandı (çapa ortası) ve sarkan uç (kök 0,0; aşağı doğru)
  const serit = (q, w, h) => { q.save(); q.clip(); q.fillStyle = '#c39bff'; for (let x = -w; x < w; x += 6) q.fillRect(x, -h, 2.6, h * 3); q.restore(); };
  S1.atki = is8Spr(34, 12, 17, 6, q => {
    const yol = q => { q.beginPath(); q.moveTo(-14, -2.6); q.quadraticCurveTo(0, 1.4, 14, -2.6); q.lineTo(14.6, 1.6); q.quadraticCurveTo(0, 6.2, -14.6, 1.6); q.closePath(); };
    is8Kat(q, yol, '#7dffc4', 0.9); yol(q); serit(q, 16, 6);
    q.fillStyle = 'rgba(255,255,255,0.35)'; q.beginPath(); q.moveTo(-12, -1.6); q.quadraticCurveTo(0, 2.2, 12, -1.6); q.quadraticCurveTo(0, 3.2, -12, -1.6); q.fill();
    is8Kat(q, q => { q.beginPath(); q.ellipse(8.5, 1.2, 3.2, 2.8, 0, 0, 6.2832); }, '#5fe6aa', 0.8);
  });
  S1.atkiUc = is8Spr(10, 24, 5, 1.5, q => {
    const yol = q => { q.beginPath(); q.moveTo(-2.8, 0); q.lineTo(2.8, 0); q.quadraticCurveTo(3.8, 9, 3, 17.5); q.lineTo(-3, 17.5); q.quadraticCurveTo(-3.6, 9, -2.8, 0); q.closePath(); };
    is8Kat(q, yol, '#7dffc4', 0.85); q.save(); yol(q); q.clip(); q.fillStyle = '#c39bff'; for (let y = 2; y < 18; y += 5.2) q.fillRect(-5, y, 10, 2.2); q.restore();
    q.strokeStyle = '#5fe6aa'; q.lineWidth = 0.9; for (let i = 0; i < 4; i++) { const x = -2.2 + i * 1.5; q.beginPath(); q.moveTo(x, 17.6); q.lineTo(x + (i - 1.5) * 0.3, 20.8); q.stroke(); }
  });
  // nine: şal (omuzlarda, önde çiçek broş), gözlük, topuz
  S1.sal = is8Spr(40, 20, 20, 5, q => {   // örgü şal: omuzlara dökülür, önde V ucu ve çiçek broş, dantel kenar
    const yol = q => { q.beginPath(); q.moveTo(-16.5, 1.5); q.quadraticCurveTo(-14, -3.4, -6, -3.2); q.quadraticCurveTo(0, -1.2, 6, -3.2); q.quadraticCurveTo(14, -3.4, 16.5, 1.5);
      q.quadraticCurveTo(17.5, 5.5, 13.5, 6.2); q.quadraticCurveTo(6, 6.4, 0, 11); q.quadraticCurveTo(-6, 6.4, -13.5, 6.2); q.quadraticCurveTo(-17.5, 5.5, -16.5, 1.5); q.closePath(); };
    is8Kat(q, yol, '#b48cf0', 0.95);
    q.save(); yol(q); q.clip();
    q.strokeStyle = 'rgba(120,80,200,0.32)'; q.lineWidth = 0.7; for (let x = -18; x < 18; x += 2.6) { q.beginPath(); q.moveTo(x, -4); q.quadraticCurveTo(x * 0.85, 4, x * 0.5, 12); q.stroke(); }
    q.fillStyle = 'rgba(255,255,255,0.25)'; is8Elips(q, -7, -0.5, 7, 2.2, -0.1); q.fill();
    q.restore();
    q.fillStyle = '#e2d0ff'; for (let i = 0; i <= 10; i++) { const u = i / 10, x = u < 0.5 ? lerp(-13.5, 0, u * 2) : lerp(0, 13.5, u * 2 - 1), y = u < 0.5 ? lerp(6.4, 11, u * 2) : lerp(11, 6.4, u * 2 - 1); q.beginPath(); q.arc(x, y + 0.6, 1.0, 0, 6.2832); q.fill(); }
    for (let i = 0; i < 5; i++) { const a = i / 5 * 6.2832; q.fillStyle = '#ff8fc8'; q.beginPath(); q.arc(Math.cos(a) * 1.6, 6.6 + Math.sin(a) * 1.6, 1.2, 0, 6.2832); q.fill(); }
    q.fillStyle = '#fff08a'; q.beginPath(); q.arc(0, 6.6, 0.95, 0, 6.2832); q.fill();
  });
  S1.gozluk = is8Spr(28, 15, 14, 7.5, q => {   // yuvarlak altın çerçeve (cam ortaları ±6.2)
    for (const s of [-1, 1]) {
      q.fillStyle = 'rgba(220,235,255,0.18)'; q.beginPath(); q.arc(s * 6.2, 0, 6, 0, 6.2832); q.fill();
      q.strokeStyle = '#e0a640'; q.lineWidth = 1.15; q.stroke();
      q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = 0.8; q.beginPath(); q.arc(s * 6.2, 0, 4.4, 3.5, 4.5); q.stroke();
    }
    q.strokeStyle = '#e0a640'; q.lineWidth = 1.1; q.beginPath(); q.moveTo(-0.6, -1.2); q.quadraticCurveTo(0, -2.4, 0.6, -1.2); q.stroke();
    for (const s of [-1, 1]) { q.beginPath(); q.moveTo(s * 12.1, -0.8); q.lineTo(s * 13.6, -1.6); q.stroke(); }
  });
  S1.topuz = is8Spr(20, 18, 10, 11, q => {
    is8Kat(q, q => { q.beginPath(); q.ellipse(0, 0, 7.4, 6.2, 0, 0, 6.2832); }, '#f3eeff', 0.9);
    q.strokeStyle = 'rgba(170,150,215,0.7)'; q.lineWidth = 0.8; q.beginPath(); q.arc(0.4, 0.4, 3.8, 3.4, 8.2); q.stroke(); q.beginPath(); q.arc(-0.8, 0.8, 1.8, 0.2, 4.4); q.stroke();
    for (let i = 0; i < 5; i++) { const a = i / 5 * 6.2832; q.fillStyle = '#ff8fc8'; q.beginPath(); q.arc(5.2 + Math.cos(a) * 1.6, -3.8 + Math.sin(a) * 1.6, 1.2, 0, 6.2832); q.fill(); }
    q.fillStyle = '#fff08a'; q.beginPath(); q.arc(5.2, -3.8, 0.9, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.7)'; is8Elips(q, -2.8, -2.8, 2.2, 1.1, -0.5); q.fill();
  });
  // uyku "z"si (açık lila)
  S1.z = is8Spr(10, 10, 5, 5, q => { q.strokeStyle = IS8_KONTUR; q.lineWidth = 2.6; const z = () => { q.beginPath(); q.moveTo(-2.6, -2.6); q.lineTo(2.6, -2.6); q.lineTo(-2.6, 2.6); q.lineTo(2.6, 2.6); q.stroke(); }; z(); q.strokeStyle = '#e8dcff'; q.lineWidth = 1.4; z(); }, 3);
  // parıltı yıldızı (beyaz, dört kollu)
  S1.yildiz = is8Spr(10, 10, 5, 5, q => { q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 1.1 : 4.6; q.lineTo(Math.cos(a) * r, Math.sin(a) * r); } q.closePath(); q.fill(); }, 3);
}
// kişiliğe özel parçalar: göğüs kafesi çerçevesi, kaburga çubukları, leğen, tokmak (ilk kullanımda)
function is8OlSpr(tip) {
  const ol = is8Ol(tip); if (ol.gogus) return ol;
  const tp = IS8_TIP[tip], gw = ol.gw, gh = ol.gh;
  ol.gogus = is8Spr(gw + 12, gh + 12, gw / 2 + 6, gh / 2 + 6, q => {
    // içi: koyu lila zemin (çubuklar her arka planda okunsun)
    q.fillStyle = 'rgba(46,30,92,0.62)'; q.beginPath(); q.moveTo(-gw * 0.44, -gh / 2 + 2); q.quadraticCurveTo(-gw * 0.56, gh * 0.1, -gw * 0.3, gh / 2); q.lineTo(gw * 0.3, gh / 2); q.quadraticCurveTo(gw * 0.56, gh * 0.1, gw * 0.44, -gh / 2 + 2); q.closePath(); q.fill();
    const cizgi = (fn, w) => { q.strokeStyle = IS8_KONTUR; q.lineWidth = w + 1.8; fn(); q.stroke(); q.strokeStyle = IS8_KEMIK; q.lineWidth = w; fn(); q.stroke(); };
    // omurga (çubukların arkasında)
    cizgi(() => { q.beginPath(); q.moveTo(0, -gh / 2 + 2); q.lineTo(0, gh / 2 + 1); }, 3.4);
    // yan kemerler: ksilofonun rayları, kafesin dış çizgisi
    for (const s of [-1, 1]) cizgi(() => { q.beginPath(); q.moveTo(s * gw * 0.42, -gh / 2 + 2.5); q.bezierCurveTo(s * gw * 0.6, -gh * 0.12, s * gw * 0.54, gh * 0.3, s * gw * 0.3, gh / 2 + 0.5); }, 3.3);
    // köprücük: omuzdan omuza hafif kavis, uçlarda yuvarlak boğum
    cizgi(() => { q.beginPath(); q.moveTo(-gw / 2 - 1, -gh / 2 + 2.2); q.quadraticCurveTo(0, -gh / 2 - 1.6, gw / 2 + 1, -gh / 2 + 2.2); }, 3.4);
    for (const s of [-1, 1]) { q.fillStyle = IS8_KONTUR; q.beginPath(); q.arc(s * (gw / 2 + 1), -gh / 2 + 2.2, 3.3, 0, 6.2832); q.fill(); q.fillStyle = IS8_KEMIK; q.beginPath(); q.arc(s * (gw / 2 + 1), -gh / 2 + 2.2, 2.4, 0, 6.2832); q.fill(); }
    q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(-gw * 0.3, -gh / 2 + 0.9); q.quadraticCurveTo(0, -gh / 2 - 1.6, gw * 0.3, -gh / 2 + 0.9); q.stroke();
  });
  // kaburga çubukları: oyuncak ksilofon tuşu gibi yuvarlak köşeli pastel çubuk, iki ucunda gümüş çivi
  for (const b of ol.cub) {
    const w = b.w, h = b.h;
    b.sp = is8Spr(w + 4, h + 4, w / 2 + 2, h / 2 + 2, q => {
      const yol = q => is8Yuv(q, -w / 2, -h / 2, w, h, h * 0.48);
      const gr = q.createLinearGradient(0, -h / 2, 0, h / 2);
      gr.addColorStop(0, mixc(b.col, '#ffffff', 0.45)); gr.addColorStop(0.5, b.col); gr.addColorStop(1, mixc(b.col, '#6a4aa0', 0.22));
      q.strokeStyle = 'rgba(79,60,134,0.85)'; q.lineWidth = 1.5; yol(q); q.stroke(); q.fillStyle = gr; yol(q); q.fill();
      q.strokeStyle = 'rgba(255,255,255,0.75)'; q.lineWidth = h * 0.18; q.beginPath(); q.moveTo(-w / 2 + h * 0.6, -h * 0.2); q.lineTo(w / 2 - h * 0.6, -h * 0.2); q.stroke();
      for (const s of [-1, 1]) { const x = s * (w / 2 - 2.7); q.fillStyle = '#ffffff'; q.beginPath(); q.arc(x, 0.1, 0.9, 0, 6.2832); q.fill(); q.fillStyle = '#9a88c8'; q.beginPath(); q.arc(x + 0.15, 0.3, 0.38, 0, 6.2832); q.fill(); }
    });
  }
  // leğen: yuvarlak "kelebek" kemik
  { const pw = ol.pw, ph = ol.ph;
    ol.pelvis = is8Spr(pw + 6, ph + 6, pw / 2 + 3, ph / 2 + 3, q => {
      is8Kat(q, q => { q.beginPath(); q.moveTo(-pw / 2, -ph * 0.38); q.quadraticCurveTo(-pw * 0.25, -ph * 0.62, 0, -ph * 0.2); q.quadraticCurveTo(pw * 0.25, -ph * 0.62, pw / 2, -ph * 0.38);
        q.quadraticCurveTo(pw * 0.54, ph * 0.22, pw * 0.22, ph * 0.5); q.quadraticCurveTo(0, ph * 0.3, -pw * 0.22, ph * 0.5); q.quadraticCurveTo(-pw * 0.54, ph * 0.22, -pw / 2, -ph * 0.38); q.closePath(); }, IS8_KEMIK, 0.9);
      q.fillStyle = 'rgba(205,185,228,0.75)'; q.beginPath(); q.ellipse(0, ph * 0.18, pw * 0.12, ph * 0.18, 0, 0, 6.2832); q.fill();
      q.fillStyle = 'rgba(255,255,255,0.8)'; for (const s of [-1, 1]) { q.beginPath(); q.ellipse(s * pw * 0.26, -ph * 0.2, pw * 0.1, ph * 0.1, s * 0.3, 0, 6.2832); q.fill(); }
    }); }
  // tokmak: açık tahta sap + kendi renginde yuvarlak baş (tutulan yer 0,0; baş +x'te)
  { const L = ol.tokL, col = tp.renk;
    ol.tokmak = is8Spr(L + 9, 9, 1.5, 4.5, q => {
      q.strokeStyle = IS8_KONTUR; q.lineWidth = 3.2; q.beginPath(); q.moveTo(0, 0); q.lineTo(L - 2, 0); q.stroke();
      q.strokeStyle = '#e8c39a'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(0, 0); q.lineTo(L - 2, 0); q.stroke();
      const gr = q.createRadialGradient(L - 0.9, -1.1, 0.3, L, 0, 3.4); gr.addColorStop(0, mixc(col, '#ffffff', 0.7)); gr.addColorStop(0.55, col); gr.addColorStop(1, mixc(col, '#6a4aa0', 0.3));
      q.fillStyle = IS8_KONTUR; q.beginPath(); q.arc(L, 0, 3.9, 0, 6.2832); q.fill(); q.fillStyle = gr; q.beginPath(); q.arc(L, 0, 3.1, 0, 6.2832); q.fill();
      q.fillStyle = '#ffffff'; q.beginPath(); q.arc(L - 1.1, -1.2, 0.8, 0, 6.2832); q.fill();
    }); }
  return ol;
}
// kemik: iki ucu çift boğumlu tombul kemik (uzunluk + kalınlık başına bir kez)
function is8KemikSpr(L, k) {
  L = Math.round(L * 2) / 2; const key = L * 1000 + Math.round(k * 10);
  let sp = IS8_S.kemik.get(key); if (sp) return sp;
  const r = k * 0.5, oy = k * 0.36, pad = r + 1.3, H = (oy + r) * 2 + 2.6;
  sp = is8Spr(L + pad * 2, H, pad, H / 2, q => {
    const sekil = (e, col) => {
      q.strokeStyle = col; q.fillStyle = col; q.lineWidth = k + e * 2; q.beginPath(); q.moveTo(0, 0); q.lineTo(L, 0); q.stroke();
      for (const x of [0, L]) for (const y of [-oy, oy]) { q.beginPath(); q.arc(x, y, r + e, 0, 6.2832); q.fill(); }
    };
    sekil(0.85, IS8_KONTUR); sekil(0, IS8_KEMIK);
    q.strokeStyle = 'rgba(206,186,230,0.6)'; q.lineWidth = k * 0.26; q.beginPath(); q.moveTo(r * 0.7, k * 0.25); q.lineTo(L - r * 0.7, k * 0.25); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.9)'; q.lineWidth = k * 0.2; q.beginPath(); q.moveTo(r * 0.9, -k * 0.2); q.lineTo(L - r * 0.9, -k * 0.2); q.stroke();
  });
  IS8_S.kemik.set(key, sp); return sp;
}
function is8Kemik(c, x0, y0, x1, y1, k) {   // (x0,y0) → (x1,y1) arası kemik
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 0.3) return;
  const sp = is8KemikSpr(L, k), a = Math.atan2(y1 - y0, x1 - x0);
  c.translate(x0, y0); c.rotate(a); c.drawImage(sp.c, -sp.ox, -sp.oy, sp.w, sp.h); c.rotate(-a); c.translate(-x0, -y0);
}
function is8Don(c, sp, x, y, a, k, ayna) {   // döndürülmüş sprite (çapa x,y)
  c.translate(x, y); c.rotate(a); if (ayna) c.scale(1, -1); c.drawImage(sp.c, -sp.ox * k, -sp.oy * k, sp.w * k, sp.h * k); if (ayna) c.scale(1, -1); c.rotate(-a); c.translate(-x, -y);
}
// iki kemikli uzanma: kök (ax,ay) → hedef (bx,by); dirsek/diz (px,py)'ye en yakın çözüm (px NaN ise yan (±1) tarafı, dışa doğru)
const IS8_IKO = { ex: 0, ey: 0, hx: 0, hy: 0 };
function is8IK(ax, ay, bx, by, l1, l2, yan, px, py) {
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
  if (!(d > 1e-4)) { dx = 0; dy = 1; d = 1; }
  const dmax = (l1 + l2) * 0.999, dmin = Math.abs(l1 - l2) + 0.05;
  if (d > dmax) { dx *= dmax / d; dy *= dmax / d; d = dmax; } else if (d < dmin) { dx *= dmin / d; dy *= dmin / d; d = dmin; }
  const a0 = Math.atan2(dy, dx), u = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const x1 = ax + Math.cos(a0 + u) * l1, y1 = ay + Math.sin(a0 + u) * l1, x2 = ax + Math.cos(a0 - u) * l1, y2 = ay + Math.sin(a0 - u) * l1;
  const bir = px === px ? (x1 - px) * (x1 - px) + (y1 - py) * (y1 - py) <= (x2 - px) * (x2 - px) + (y2 - py) * (y2 - py) : (x1 - ax) * yan >= (x2 - ax) * yan;
  const O = IS8_IKO; O.ex = bir ? x1 : x2; O.ey = bir ? y1 : y2; O.hx = ax + dx; O.hy = ay + dy; return O;
}
function is8AciLerp(a, b, t) { let d = (b - a) % 6.2832; if (d > Math.PI) d -= 6.2832; else if (d < -Math.PI) d += 6.2832; return a + d * t; }
function is8Goz(t, ph) { const u = (t + ph * 0.77) % 3.7; return u < 0.07 ? 1 - u / 0.07 : u < 0.14 ? (u - 0.07) / 0.07 : 1; }   // göz kırpma: 1 açık

// ── poz: girdi seçeneklerinden eklem değerleri (tek nesne, her çağrıda yeniden yazılır) ──
const IS8_Q = {};
function is8Poz(q, t, o, tip, nine) {
  const ph = o.faz0 != null ? +o.faz0 : tip * 1.37 + (nine ? 0.6 : 0);
  const nef = Math.sin(t * 2.1 + ph);
  q.zip = 0; q.dip = 0.5 + nef * 0.45; q.hx = 0; q.egil = Math.sin(t * 0.85 + ph) * 0.03; q.sq = 0;
  q.aR = 0.3 + Math.sin(t * 1.25 + ph) * 0.06; q.bR = -0.3; q.aL = 0.3 + Math.sin(t * 1.25 + ph + 1.9) * 0.06; q.bL = -0.3;
  q.tR = 0; q.tRm = 0; q.tRx = 0; q.tRy = 0; q.tL = 0; q.tLm = 0; q.tLx = 0; q.tLy = 0;
  q.fLx = q.fLy = q.fRx = q.fRy = 0;
  // komik kafa sallantısı: arada bir, yay gibi boynunun üstünde hoplar
  const gb = (t * 0.52 + ph * 0.29) % 1, gbe = gb < 0.16 ? Math.sin(gb / 0.16 * Math.PI) : 0;
  q.kHop = gbe * 2.4 + nef * 0.3; q.kDx = 0; q.kRot = Math.sin(t * 1.6 + ph) * 0.07 + gbe * 0.14 * (tip % 2 ? 1 : -1); q.kDon = 0; q.kSq = -gbe * 0.04;
  q.agiz = 0; q.goz = is8Goz(t, ph); q.mutlu = o.mutlu ? 1 : 0; q.bakX = 0; q.bakY = 0; q.sapka = 0; q.sapkaD = 0; q.cal = 0;
  if (nine) { q.egil += 0.04; q.dip += 1.2; q.kHop -= 1; q.aR -= 0.06; q.aL -= 0.06; }
  const uyku = clamp(+o.uyku || 0, 0, 1);
  if (uyku > 0) {   // uyuklama: dizler hafif bükük, kafa yana düşmüş, kollar sarkık, derin nefes
    const sy = tip % 2 ? 1 : -1, w = smooth(uyku);
    q.dip += (3 + Math.sin(t * 1.3 + ph) * 0.7) * w; q.egil += 0.04 * sy * w; q.kRot = lerp(q.kRot, 0.36 * sy, w); q.kHop = lerp(q.kHop, -3.6, w); q.kDx += 1.4 * sy * w;
    q.aR = lerp(q.aR, 0.1, w); q.aL = lerp(q.aL, 0.1, w); q.bR = lerp(q.bR, -0.05, w); q.bL = lerp(q.bL, -0.05, w);
    if (uyku > 0.45) q.goz = 0;
  }
  const dans = clamp(+o.dans || 0, 0, 1), f = o.faz != null ? +o.faz : t * IS8_BPM / 60;
  if (dans > 0) {   // genel dans: her vuruşta diz kırıp hoplar, kollar havada sallanır, kafa takırdar
    const fr = ((f % 1) + 1) % 1, vur = Math.exp(-fr * 7), iki = Math.sin(f * Math.PI);
    q.dip += vur * 3.4 * dans; q.zip += Math.sin(fr * Math.PI) * 2.4 * dans; q.hx += iki * 3.2 * dans; q.egil += -iki * 0.07 * dans;
    q.aR = lerp(q.aR, 2.05 + iki * 0.5, dans); q.bR = lerp(q.bR, -0.45 + Math.sin(f * Math.PI * 2) * 0.35, dans);
    q.aL = lerp(q.aL, 2.05 - iki * 0.5, dans); q.bL = lerp(q.bL, -0.45 - Math.sin(f * Math.PI * 2) * 0.35, dans);
    q.kHop += vur * 3.2 * dans; q.kRot += iki * 0.14 * dans; q.agiz = Math.max(q.agiz, 0.55 * dans);
    if (dans > 0.5 && (Math.floor(f) & 1)) q.mutlu = 1;
  }
  const kafa = +o.kafa || 0;
  if (kafa) { const w = clamp(kafa, 0, 1.5), s = Math.sin(t * 10.5 + ph); q.kRot += s * 0.2 * w; q.kHop += Math.abs(s) * 2.6 * w; }
  const yon = clamp(+o.yon || 0, -1, 1);
  if (yon) { q.bakX += yon * 2.5; q.kDx += yon * 0.8; q.kRot += yon * 0.05; }
  if (o.hareket) is8Hareket(q, o.hareket, clamp(+o.hu || 0, 0, 1), t, f, tip);
  const hv = clamp(+o.heves || 0, 0, 1);
  if (hv > 0) {   // "ben! ben!": parmak uçlarında hoplar, tokmağını havada sallar
    const b = Math.abs(Math.sin(t * 6.2 + ph));
    q.zip += b * 3.2 * hv; q.dip += (1 - b) * 1.1 * hv; q.aR = lerp(q.aR, 1.9, hv); q.bR = lerp(q.bR, -0.45 + Math.sin(t * 12.4) * 0.45, hv);
    q.kRot += Math.sin(t * 6.2 + ph) * 0.08 * hv; q.agiz = Math.max(q.agiz, 0.4 * hv);
  }
  const el = clamp(+o.el || 0, 0, 1);
  if (el > 0) { const w = smooth(el); q.aR = lerp(q.aR, 2.55, w); q.bR = lerp(q.bR, -0.35 + Math.sin(t * 9) * 0.55, w); q.kRot += Math.sin(t * 4.5) * 0.05 * w; q.agiz = Math.max(q.agiz, 0.4 * w); }
  const alk = clamp(+o.alkis || 0, 0, 1);
  if (alk > 0) {   // alkış: eller göğsün önünde buluşur
    const w = smooth(alk), ac = Math.abs(Math.sin(t * 7.5));
    q.tR = Math.max(q.tR, w); q.tL = Math.max(q.tL, w); q.tRm = q.tLm = 3; q.tRx = 1.4 + ac * 5.5; q.tLx = -(1.4 + ac * 5.5); q.tRy = q.tLy = -4;
    if (w > 0.5) q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.5 * w); q.zip += Math.abs(Math.sin(t * 7.5)) * 1.2 * w;
  }
  const cal = clamp(+o.calma || 0, 0, 1);
  if (cal > 0) { q.cal = cal > 0.62 ? 1 : smooth(cal / 0.62); q.zip += Math.sin(cal * Math.PI) * 3.2; q.kHop += cal * 2.2; q.agiz = Math.max(q.agiz, cal * 0.55); q.dip -= cal * 0.8; }
  const sev = clamp(+o.sevinc || 0, 0, 1);   // sevinç: gülen kısık gözler, kocaman gülüş
  if (sev > 0) { if (sev > 0.45) q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.45 * sev); q.kRot += Math.sin(t * 5) * 0.04 * sev; }
  const sas = clamp(+o.sasir || 0, 0, 1); q.sasir = sas;   // şaşkın-sevinçli: kafa hafif geri, gözler iri, ağız "o"
  if (sas > 0) { q.kHop += sas * 1.6; q.mutlu = sas > 0.5 ? 0 : q.mutlu; if (q.goz < 0.3 && sas > 0.5) q.goz = 1; }
}
// figürler (u: 0..1 ilerleyiş)
function is8Hareket(q, h, u, t, f, tip) {
  const e = u < 0.12 ? smooth(u / 0.12) : u > 0.82 ? smooth((1 - u) / 0.18) : 1;   // giriş/çıkış zarfı
  if (h === 'el' || h === 'selam') {   // el sallama (selam: kısa, tek kol)
    const dal = Math.sin(u * Math.PI * (h === 'selam' ? 4 : 6));
    q.aR = lerp(q.aR, h === 'selam' ? 2.35 : 2.75, e); q.bR = lerp(q.bR, -0.2 + dal * 0.65, e);
    if (h === 'el') { const s = Math.sin(u * Math.PI * 3); q.aL = lerp(q.aL, 0.85, e); q.bL = lerp(q.bL, -1.85, e); q.hx += s * 2.4 * e; q.egil += -s * 0.06 * e; q.zip += Math.abs(s) * 2 * e; }
    q.kRot += dal * 0.08 * e; if (e > 0.5) q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.5 * e);
  } else if (h === 'kalca') {   // eller belde, kalça sağa sola
    const s = Math.sin(u * Math.PI * 8);
    q.hx += s * 4.8 * e; q.egil += -s * 0.09 * e; q.dip += 1.6 * e;
    q.aR = lerp(q.aR, 0.85, e); q.bR = lerp(q.bR, -1.85, e); q.aL = lerp(q.aL, 0.85, e); q.bL = lerp(q.bL, -1.85, e);
    q.kRot += -s * 0.1 * e; q.agiz = Math.max(q.agiz, 0.65 * e); q.bakX += s * 1.2 * e;
  } else if (h === 'kafa') {   // kafa havaya hoplar, fırıl fırıl döner, iki eliyle yakalar, "tak!" diye yerine oturur
    const v = clamp(u / 0.72, 0, 1), up = Math.sin(v * Math.PI);
    q.kHop += up * 17; q.kDon = smooth(v) * 6.2832 * (tip % 2 ? -1 : 1); q.zip += up * 1.5;
    const yk = smooth(clamp((u - 0.18) / 0.3, 0, 1)) * (u > 0.86 ? smooth((1 - u) / 0.14) : 1);
    q.tR = q.tL = yk; q.tRm = q.tLm = 1;
    const tak = u > 0.72 ? Math.exp(-(u - 0.72) * 18) : 0;   // oturma anında ezilme
    q.kSq += tak * 0.13; q.dip += tak * 2; q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.6 * up + tak * 0.4);
  } else if (h === 'cene') {   // çene takırdatıp kıkırdama: ağız hızlı açılıp kapanır, elleri yanaklarında, omuzları sarsılır
    const ch = Math.sin(t * 46) > 0 ? 1 : 0.12;
    q.agiz = Math.max(q.agiz, ch * 0.85 * e); q.mutlu = 1;
    q.tR = q.tL = e; q.tRm = q.tLm = 2;
    q.zip += Math.abs(Math.sin(t * 23)) * 1.3 * e; q.kRot += Math.sin(t * 23) * 0.06 * e; q.kHop += Math.abs(Math.sin(t * 23)) * 1.2 * e; q.egil += Math.sin(u * Math.PI * 2) * 0.05 * e;
  } else if (h === 'tekme') {   // hoplayıp yana tekme, kollar açık
    const v = Math.sin(u * Math.PI);
    q.zip += v * 7; q.fRx += v * 10; q.fRy += v * 10; q.egil += -v * 0.12;
    q.aR = lerp(q.aR, 1.75, e); q.aL = lerp(q.aL, 1.75, e); q.bR = lerp(q.bR, 0.15, e); q.bL = lerp(q.bL, 0.15, e);
    q.agiz = Math.max(q.agiz, 0.75 * v); if (v > 0.4) q.mutlu = 1;
  } else if (h === 'sapka') {   // silindir şapkasını kaldırıp selam verir (tokmaklı el karnında, reverans)
    const v = smooth(clamp(u / 0.3, 0, 1)) * (u > 0.75 ? smooth((1 - u) / 0.25) : 1);
    q.sapka = Math.sin(clamp(u / 0.8, 0, 1) * Math.PI); q.sapkaD = smooth(clamp(u / 0.8, 0, 1)); q.dip += v * 1.6; q.kRot += -0.1 * v; if (v > 0.5) q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.35 * v);
    q.aR = lerp(q.aR, 1.25, v); q.bR = lerp(q.bR, 0.5, v); q.aL = lerp(q.aL, 1.25, v); q.bL = lerp(q.bL, 0.5, v);
    if (u > 0.8) { const w = Math.exp(-(u - 0.8) * 16); q.kSq += w * 0.1; q.kHop -= w * 1.5; }
  } else if (h === 'zipla') {   // koca zıplayış, kollar havada
    const v = Math.sin(u * Math.PI), on = u < 0.15 ? Math.sin(u / 0.15 * Math.PI) : 0;
    q.zip += v * 20; q.dip += on * 3 - v * 1.5; q.fLy += v * 4; q.fRy += v * 4; q.fLx -= v * 2; q.fRx += v * 2;
    q.aR = lerp(q.aR, 2.75, v); q.aL = lerp(q.aL, 2.75, v); q.bR = lerp(q.bR, 0.2, v); q.bL = lerp(q.bL, 0.2, v);
    q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.9 * v); q.kHop += v * 3; q.sq -= v * 0.05;
  } else if (h === 'conga') {   // el ele dizi: 1-2-3-tekme (faz = vuruş)
    const fb = ((f % 4) + 4) % 4, b = Math.floor(fb), x = fb - b, vu = Math.sin(x * Math.PI);
    q.aR = lerp(q.aR, 1.5, e); q.aL = lerp(q.aL, 1.5, e); q.bR = lerp(q.bR, 0.12, e); q.bL = lerp(q.bL, 0.12, e);
    if (b === 3) { q.zip += vu * 6 * e; q.fRx += vu * 8 * e; q.fRy += vu * 9 * e; q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.8 * vu); }
    else { q.zip += vu * 1.5 * e; if (b & 1) q.fRy += vu * 3.5 * e; else q.fLy += vu * 3.5 * e; q.agiz = Math.max(q.agiz, 0.45 * e); }
    q.kHop += Math.exp(-x * 7) * 3.6 * e; q.kRot += (b & 1 ? 0.13 : -0.13) * e; q.hx += Math.sin(fb * Math.PI / 2) * 2 * e; q.egil += Math.sin(fb * Math.PI / 2) * -0.05 * e;
  } else if (h === 'tada') {   // "ta-da!": zıplar, kollar V
    const v = Math.sin(clamp(u / 0.45, 0, 1) * Math.PI), w = smooth(clamp(u / 0.18, 0, 1)) * (u > 0.85 ? smooth((1 - u) / 0.15) : 1);
    q.zip += v * 15; q.aR = lerp(q.aR, 2.55, w); q.aL = lerp(q.aL, 2.55, w); q.bR = lerp(q.bR, 0.25, w); q.bL = lerp(q.bL, 0.25, w);
    q.mutlu = 1; q.agiz = Math.max(q.agiz, 0.9 * w); q.fLx -= v * 3; q.fRx += v * 3; q.sq += -v * 0.05 + (u > 0.45 ? Math.exp(-(u - 0.45) * 14) * 0.08 : 0);
  }
}

// el hedefi kipine göre (IS8_IKO.hx/hy'ye yazar): 1 kafanın yanı (yakalama) · 2 yanak/çene · 3 göğsün önü (alkış) · yoksa düz eklem
function is8ElHedef(m, sx, ox, oy, hcx, hcy, kr, rcx, rcy, wx, wy) {
  let x0 = wx, y0 = wy;
  if (m === 1) { x0 = hcx + sx * (kr + 1.6); y0 = hcy + kr * 0.12; }
  else if (m === 2) { x0 = hcx + sx * kr * 0.8; y0 = hcy + kr * 0.66; }
  else if (m === 3) { x0 = rcx + ox; y0 = rcy + oy; }
  IS8_IKO.hx = x0; IS8_IKO.hy = y0;
}
// ── ortak çizici ──
const IS8_BOS = {};
function iskeletCiz(c, x, y, s, t, o) {
  if (!c || !(s > 0) || !Number.isFinite(x) || !Number.isFinite(y)) return;
  o = o || IS8_BOS; t = Number.isFinite(t) ? t : 0;
  const al = o.alpha == null ? 1 : clamp(+o.alpha || 0, 0, 1); if (al <= 0.01) return;
  is8Hazirla();
  const nine = !!o.nine, tip = o.tip == null && nine ? 1 : clamp(o.tip | 0, 0, 4), tp = IS8_TIP[tip], ol = is8OlSpr(tip), q = IS8_Q, S1 = IS8_S, B = IS8_B, K = ol.kal;
  is8Poz(q, t, o, tip, nine);
  const a0 = c.globalAlpha, aa = a0 * al;
  c.save();
  c.translate(x, y); const sc = s * tp.s * (nine ? 0.97 : 1); c.scale(sc, sc);
  // zemin gölgesi (zıplayınca küçülür)
  { const gs = 1 - Math.min(0.5, q.zip / 40), gw = (ol.gw * 0.6 + 11) * gs; c.globalAlpha = aa * 0.6 * gs; c.drawImage(S1.golge.c, -gw, -3.4, gw * 2, 6.8); }
  c.globalAlpha = aa;
  c.translate(0, -q.zip);
  if (q.sq) c.scale(1 + q.sq, 1 - q.sq);
  // ── noktalar (yerel birim; y aşağı) ──
  const fx = ol.kw + 1.5;
  const aLx = -fx + q.fLx, aLy = -B.ayak - q.fLy, aRx = fx + q.fRx, aRy = -B.ayak - q.fRy;
  const hx = q.hx, hy = ol.hipY + q.dip, ce = Math.cos(q.egil), se = Math.sin(q.egil);
  const hLx = hx - ce * ol.kw, hLy = hy - se * ol.kw, hRx = hx + ce * ol.kw, hRy = hy + se * ol.kw;
  let ik = is8IK(hLx, hLy, aLx, aLy, ol.uy, ol.ba, -1, NaN, 0); const dLx = ik.ex, dLy = ik.ey, fLx = ik.hx, fLy = ik.hy;
  ik = is8IK(hRx, hRy, aRx, aRy, ol.uy, ol.ba, 1, NaN, 0); const dRx = ik.ex, dRy = ik.ey, fRx = ik.hx, fRy = ik.hy;
  const g0 = ol.ph * 0.5 + ol.om;                                       // leğen ortasından göğüs altına
  const rbx = hx + se * g0, rby = hy - ce * g0;                         // göğüs altı
  const rcx = rbx + se * ol.gh / 2, rcy = rby - ce * ol.gh / 2;         // göğüs ortası
  const rtx = rbx + se * ol.gh, rty = rby - ce * ol.gh;                 // göğüs üstü
  const ow = ol.gw / 2 + 0.6, oh = 2.4;
  const sRx = rtx + ce * ow - se * oh, sRy = rty + se * ow + ce * oh, sLx = rtx - ce * ow - se * oh, sLy = rty - se * ow + ce * oh;
  const nkx = rtx + se * ol.by, nky = rty - ce * ol.by;                 // boyun ucu
  const ke = q.egil * 0.6, kr = ol.kr;
  const hcx = nkx + Math.sin(ke) * kr * 0.9 + q.kDx, hcy = nky - Math.cos(ke) * kr * 0.9 - q.kHop;   // kafa ortası
  const ka = ke + q.kRot + q.kDon, kca = Math.cos(ka), ksa = Math.sin(ka);
  // atkı ucu (gövdenin arkasında, sağ omuzdan sarkar)
  if (tip === 3 && !nine) { const ux = nkx + ce * 5.5, uy = nky + se * 5.5 + 1, a = -0.32 + Math.sin(t * 2.3) * 0.12 - q.hx * 0.03 + (q.zip > 2 ? -0.25 : 0) + q.egil; is8Don(c, S1.atkiUc, ux, uy, a, 1, false); is8Don(c, S1.atkiUc, ux - 1.5, uy + 0.5, a + 0.32, 0.92, false); }
  // ışık halesi (sırası gelen / parlayan)
  const pa = clamp(+o.parla || 0, 0, 1);
  if (pa > 0.01) { c.globalCompositeOperation = 'lighter'; is8Glow(c, tp.renk, rcx, rcy - 8, 58 + ol.gw * 0.6, 76, pa * 0.72); is8Glow(c, '#ffffff', rcx, rcy - 4, 30, 42, pa * 0.28); c.globalCompositeOperation = 'source-over'; }
  // bacaklar + ayaklar
  is8Kemik(c, hLx, hLy, dLx, dLy, K); is8Kemik(c, dLx, dLy, fLx, fLy, K * 0.94);
  is8Kemik(c, hRx, hRy, dRx, dRy, K); is8Kemik(c, dRx, dRy, fRx, fRy, K * 0.94);
  { const A = S1.ayak, rl = -q.fLy * 0.05, rr = -q.fRy * 0.05;
    c.translate(fLx, fLy); c.scale(-1, 1); c.rotate(rl); c.drawImage(A.c, -A.ox, -A.oy, A.w, A.h); c.rotate(-rl); c.scale(-1, 1); c.translate(-fLx, -fLy);
    c.translate(fRx, fRy); c.rotate(rr); c.drawImage(A.c, -A.ox, -A.oy, A.w, A.h); c.rotate(-rr); c.translate(-fRx, -fRy); }
  // leğen + omurlar
  is8Don(c, ol.pelvis, hx + se * 1.2, hy - ce * 1.2, q.egil * 0.8, 1, false);
  { const n = tip === 4 ? 1 : 2; for (let i = 0; i < n; i++) { const d = ol.ph * 0.45 + ol.om * (n === 1 ? 0.55 : 0.3 + i * 0.42); is8Don(c, S1.omur, hx + se * d, hy - ce * d, q.egil, 1, false); } }
  // göğüs kafesi + kaburga ksilofonu
  const cn = ol.cub.length, ci = o.cubuk == null ? (cn >> 1) : clamp(o.cubuk | 0, 0, cn - 1), cI = clamp(o.cubukI == null ? +o.calma || 0 : +o.cubukI || 0, 0, 1), hep = clamp(+o.hepsi || 0, 0, 1);
  c.translate(rcx, rcy); c.rotate(q.egil);
  is8Bas(c, ol.gogus, 0, 0);
  for (let i = 0; i < cn; i++) {
    const b = ol.cub[i], L = Math.max(i === ci ? cI : 0, hep), wx = L > 0.05 ? Math.sin(t * 72 + i) * L * 0.8 : 0;
    is8Bas(c, b.sp, wx, b.y);
    if (L > 0.02) {
      c.globalCompositeOperation = 'lighter'; c.globalAlpha = aa * L * 0.8; is8Bas(c, b.sp, wx, b.y); c.globalAlpha = aa;
      is8Glow(c, b.col, wx, b.y, b.w * 0.9, b.h * 3.4, L * 0.8); is8Glow(c, '#ffffff', wx, b.y, b.w * 0.42, b.h * 1.5, L * 0.45);
      c.globalCompositeOperation = 'source-over';
    }
  }
  c.rotate(-q.egil); c.translate(-rcx, -rcy);
  // boyun omuru + boyun süsleri
  is8Don(c, S1.omur, (rtx + nkx) / 2, (rty + nky) / 2 + 0.6, q.egil, 0.85, false);
  if (tip === 2 && !nine) is8Don(c, S1.papyon, nkx, nky + 1.6, q.egil + Math.sin(t * 3) * 0.05, 1, false);
  else if (tip === 3 && !nine) is8Don(c, S1.atki, nkx, nky + 1.4, q.egil, 0.92, false);
  // kafa
  {
    c.translate(hcx, hcy); c.rotate(ka); if (q.kSq) c.scale(1 + q.kSq, 1 - q.kSq);
    const ks = kr / 17;
    if (nine) is8Bas(c, S1.topuz, kr * 0.12, -kr * 0.9, ks);
    is8Bas(c, S1.kafa, 0, 0, ks);
    const ya = tip === 0 ? 1.18 : 1; c.globalAlpha = aa * (nine ? 1 : 0.9);
    is8Bas(c, S1.yanak, -kr * 0.6 + q.bakX * 0.4, kr * 0.3, ks * ya); is8Bas(c, S1.yanak, kr * 0.6 + q.bakX * 0.4, kr * 0.3, ks * ya); c.globalAlpha = aa;
    // gözler
    const gz = q.goz, es = kr * 0.27 / 4.6 * (tip === 4 ? 1.13 : 1) * (1 + q.sasir * 0.12), gy = -kr * 0.05 + q.bakY;
    c.strokeStyle = '#2a1f4e'; c.lineWidth = kr * 0.085;
    for (let sx = -1; sx <= 1; sx += 2) {
      const ex = sx * kr * 0.36 + q.bakX;
      if (q.mutlu) { c.beginPath(); c.arc(ex, gy + kr * 0.1, kr * 0.17, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
      else if (gz < 0.3) { c.beginPath(); c.arc(ex, gy - kr * 0.06, kr * 0.16, Math.PI * 0.15, Math.PI * 0.85); c.stroke(); }
      else { const sp = S1.goz; c.drawImage(sp.c, ex - sp.ox * es, gy - sp.oy * es * gz, sp.w * es, sp.h * es * gz); }
      if (tip === 1 && !nine && !q.mutlu && gz >= 0.3) {   // fiyonkluya kirpik
        c.lineWidth = kr * 0.05; for (let i = 0; i < 2; i++) { const a = -Math.PI / 2 + sx * (0.75 + i * 0.4), r0 = kr * 0.3; c.beginPath(); c.moveTo(ex + Math.cos(a) * r0, gy + Math.sin(a) * r0 * 1.1); c.lineTo(ex + Math.cos(a) * (r0 + kr * 0.12), gy + Math.sin(a) * (r0 * 1.1 + kr * 0.1)); c.stroke(); } c.lineWidth = kr * 0.085;
      }
    }
    if (nine) is8Bas(c, S1.gozluk, q.bakX, gy, kr * 0.36 / 6.2);
    is8Bas(c, S1.burun, q.bakX * 0.5, kr * 0.19, ks);
    // ağız: tatlı gülümseme; açılınca pembe dilli "D"
    const mw = kr * (tip === 0 ? 0.56 : tip === 4 ? 0.36 : 0.44), mx = q.bakX * 0.45, my = kr * 0.4, ag = q.agiz;
    if (q.sasir > 0.3) {   // "o" ağız
      const r = mw * (0.18 + 0.12 * q.sasir);
      c.fillStyle = '#7a3c78'; c.beginPath(); c.ellipse(mx, my + r * 0.7, r * 0.85, r, 0, 0, 6.2832); c.fill();
      c.fillStyle = '#ff8fb0'; c.beginPath(); c.ellipse(mx, my + r * 1.2, r * 0.5, r * 0.4, 0, 0, 6.2832); c.fill();
      c.lineWidth = kr * 0.07; c.beginPath(); c.ellipse(mx, my + r * 0.7, r * 0.85, r, 0, 0, 6.2832); c.stroke();
    } else if (ag > 0.08) {
      const h = mw * (0.3 + 0.5 * ag);
      c.fillStyle = '#7a3c78'; c.beginPath(); c.moveTo(mx - mw / 2, my - 0.4); c.quadraticCurveTo(mx, my + mw * 0.12, mx + mw / 2, my - 0.4); c.quadraticCurveTo(mx + mw * 0.4, my + h, mx, my + h); c.quadraticCurveTo(mx - mw * 0.4, my + h, mx - mw / 2, my - 0.4); c.fill();
      if (ag > 0.3) { c.fillStyle = '#ff8fb0'; c.beginPath(); c.ellipse(mx, my + h * 0.78, mw * 0.22, h * 0.24, 0, 0, 6.2832); c.fill(); }
      c.lineWidth = kr * 0.07; c.stroke();
    } else {
      c.lineWidth = kr * 0.075; c.beginPath(); c.moveTo(mx - mw / 2, my); c.quadraticCurveTo(mx, my + mw * (tip === 2 ? 0.34 : 0.45), mx + mw / 2, my - (tip === 2 ? 0.8 : 0)); c.stroke();
    }
    if (tip === 1 && !nine) is8Don(c, S1.fiyonk, kr * 0.6, -kr * 0.74, 0.5 + Math.sin(t * 2.7) * 0.04, ks, false);
    if (tip === 2 && !nine) { const ly = -kr * 0.8 - q.sapka * 16, lx = kr * 0.06, la = -0.14 + q.sapkaD * 6.2832; is8Don(c, S1.sapka, lx, ly, la, ks, false); }
    if (q.kSq) c.scale(1 / (1 + q.kSq), 1 / (1 - q.kSq)); c.rotate(-ka); c.translate(-hcx, -hcy);
  }
  // kollar: önce düz eklem (FK); hedef varsa (yakala, yanak, alkış, şapka, ksilofon vuruşu) uzanma çözümü, dirsek FK'ya en yakın tarafta
  const rA = q.aR - q.egil, rB = q.aR + q.bR - q.egil, lA = q.aL + q.egil, lB = q.aL + q.bL + q.egil;
  let eRx = sRx + Math.sin(rA) * ol.pz, eRy = sRy + Math.cos(rA) * ol.pz, wRx = eRx + Math.sin(rB) * ol.ok, wRy = eRy + Math.cos(rB) * ol.ok;
  let eLx = sLx - Math.sin(lA) * ol.pz, eLy = sLy + Math.cos(lA) * ol.pz, wLx = eLx - Math.sin(lB) * ol.ok, wLy = eLy + Math.cos(lB) * ol.ok;
  if (q.tL > 0.001 && q.tLm) { is8ElHedef(q.tLm, -1, q.tLx, q.tLy, hcx, hcy, kr, rcx, rcy, wLx, wLy); const tx = lerp(wLx, IS8_IKO.hx, q.tL), ty = lerp(wLy, IS8_IKO.hy, q.tL); ik = is8IK(sLx, sLy, tx, ty, ol.pz, ol.ok, -1, eLx, eLy); eLx = ik.ex; eLy = ik.ey; wLx = ik.hx; wLy = ik.hy; }
  if (q.tR > 0.001 && q.tRm) { is8ElHedef(q.tRm, 1, q.tRx, q.tRy, hcx, hcy, kr, rcx, rcy, wRx, wRy); const tx = lerp(wRx, IS8_IKO.hx, q.tR), ty = lerp(wRy, IS8_IKO.hy, q.tR); ik = is8IK(sRx, sRy, tx, ty, ol.pz, ol.ok, 1, eRx, eRy); eRx = ik.ex; eRy = ik.ey; wRx = ik.hx; wRy = ik.hy; }
  // ksilofon vuruşu: tokmağın başı vurulan kaburgaya değer
  let tokA = Math.atan2(wRy - eRy, wRx - eRx) - 0.95;
  if (q.cal > 0.001) {
    const b = ol.cub[ci], cxl = b.w * 0.16, cyl = b.y, kx = rcx + cxl * ce - cyl * se, ky = rcy + cxl * se + cyl * ce;
    const th = lerp(0.8, 0.12, ci / Math.max(1, cn - 1)) + q.egil, L = ol.tokL;
    const tx = lerp(wRx, kx + Math.cos(th) * L, q.cal), ty = lerp(wRy, ky + Math.sin(th) * L, q.cal);
    ik = is8IK(sRx, sRy, tx, ty, ol.pz, ol.ok, 1, eRx, eRy); eRx = ik.ex; eRy = ik.ey; wRx = ik.hx; wRy = ik.hy;
    tokA = is8AciLerp(Math.atan2(wRy - eRy, wRx - eRx) - 0.95, Math.atan2(ky - wRy, kx - wRx), q.cal);
  }
  // üst kollar → (nine: şal omuzların üstünde) → ön kollar, eller, tokmak
  is8Kemik(c, sLx, sLy, eLx, eLy, K * 0.92); is8Kemik(c, sRx, sRy, eRx, eRy, K * 0.92);
  if (nine) is8Don(c, S1.sal, rtx, rty + 1, q.egil, ol.gw / 26, false);
  is8Kemik(c, eLx, eLy, wLx, wLy, K * 0.86);
  is8Don(c, S1.el, wLx, wLy, Math.atan2(wLy - eLy, wLx - eLx), 1, true);
  is8Kemik(c, eRx, eRy, wRx, wRy, K * 0.86);
  if (o.tokmak !== false) is8Don(c, ol.tokmak, wRx, wRy, tokA, 1, false);
  is8Don(c, S1.el, wRx, wRy, Math.atan2(wRy - eRy, wRx - eRx), 1, false);
  c.restore(); c.globalAlpha = a0;
}

// ══════════════════════ sahne: tahta sahne, kabak ışıkları, kadife saçak, ampuller, bayrak süsü ══════════════════════
const IS8_KABAKX = [-284, -172, -57, 57, 166, 276];                 // ön kenardaki kabak ışıkları (iskeletlerin arasında)
const IS8_BAYRAK = ['#ff9a3c', '#c39bff', '#7dffc4', '#ff8fc8', '#ffe7a8'];
const IS8_AMPUL = ['#ffd27a', '#ff8fc8', '#7dffc4', '#c39bff', '#e8ff8a'];
const IS8_SACAK = { N: 16, x0: -314, w: 628 / 16 };
const IS8_SH = { hazir: false };
function is8SahneHazirla() {
  if (IS8_SH.hazir) return; IS8_SH.hazir = true; is8Hazirla();
  const H = IS8_SH, R = IS8_R2, K2 = '#2e1a36';
  // zemin: soldaki iki basamak, dikey tahtalı ön yüz, ışık vuran üst yüz, pervaz ve minik flamalar (x -352..320, y -52..6)
  H.zemin = is8Spr(672, 58, 352, 52, q => {
    for (const [x0, x1, y] of [[-344, -322, -12], [-328, -305, -24]]) {
      q.fillStyle = K2; q.fillRect(x0 - 1, y - 1, x1 - x0 + 2, -y + 2);
      q.fillStyle = '#7a4a33'; q.fillRect(x0, y, x1 - x0, -y);
      q.fillStyle = '#c08a5a'; q.fillRect(x0, y, x1 - x0, 3); q.fillStyle = '#e6b07a'; q.fillRect(x0, y, x1 - x0, 0.9);
    }
    q.fillStyle = K2; q.fillRect(-308, -36, 616, 37.5);
    for (let i = 0, x = -306; x < 306; i++, x += 20.4) {
      const w = Math.min(20.4, 306 - x);
      q.fillStyle = i % 2 ? '#86543a' : '#7a4a33'; q.fillRect(x, -31, w - 0.9, 31);
      q.fillStyle = 'rgba(255,220,170,0.08)'; q.fillRect(x + 1, -31, 3, 31);
      q.fillStyle = 'rgba(232,195,154,0.6)'; q.beginPath(); q.arc(x + 4, -27.5, 0.75, 0, 6.2832); q.arc(x + 4, -4, 0.75, 0, 6.2832); q.fill();
    }
    const ga = q.createLinearGradient(0, -18, 0, 0); ga.addColorStop(0, 'rgba(30,14,40,0)'); ga.addColorStop(1, 'rgba(30,14,40,0.5)'); q.fillStyle = ga; q.fillRect(-306, -18, 612, 18);
    const ust = () => { q.beginPath(); q.moveTo(-306, -33); q.lineTo(306, -33); q.lineTo(297, -47); q.lineTo(-297, -47); q.closePath(); };
    q.fillStyle = K2; q.beginPath(); q.moveTo(-307.5, -32); q.lineTo(307.5, -32); q.lineTo(298, -48.3); q.lineTo(-298, -48.3); q.closePath(); q.fill();
    ust(); q.fillStyle = '#a46f47'; q.fill();
    q.save(); ust(); q.clip();
    q.strokeStyle = 'rgba(120,72,44,0.8)'; q.lineWidth = 0.7; for (const y of [-43.4, -39.6, -36]) { q.beginPath(); q.moveTo(-310, y); q.lineTo(310, y); q.stroke(); }
    for (let i = 0; i < 26; i++) { const x = -300 + ((i * 97) % 600), y = [-45.2, -41.5, -37.8][i % 3]; q.beginPath(); q.moveTo(x, y - 1.6); q.lineTo(x, y + 1.6); q.stroke(); }
    const gl = q.createRadialGradient(0, -40, 10, 0, -40, 290); gl.addColorStop(0, 'rgba(255,214,150,0.5)'); gl.addColorStop(1, 'rgba(255,214,150,0)'); q.fillStyle = gl; q.fillRect(-310, -50, 620, 20);
    q.restore();
    q.fillStyle = '#5e3828'; q.fillRect(-307, -31.2, 614, 1.6);
    is8Yuv(q, -308, -35.5, 616, 5, 2); q.fillStyle = '#cf955d'; q.fill(); q.fillStyle = '#f3c58c'; q.fillRect(-305, -35, 610, 1.1);
    q.strokeStyle = 'rgba(255,231,168,0.8)'; q.lineWidth = 0.6; q.beginPath(); q.moveTo(-304, -29.8); q.lineTo(304, -29.8); q.stroke();
    for (let i = 0, x = -296; x <= 296; i++, x += 18.5) {
      q.fillStyle = IS8_BAYRAK[i % 5]; q.beginPath(); q.moveTo(x - 6, -29.8); q.lineTo(x + 6, -29.8); q.lineTo(x, -20.5); q.closePath(); q.fill();
      q.strokeStyle = 'rgba(46,26,54,0.55)'; q.lineWidth = 0.6; q.stroke(); q.fillStyle = 'rgba(255,255,255,0.6)'; q.beginPath(); q.arc(x, -26.4, 0.9, 0, 6.2832); q.fill();
    }
  }, R);
  // arka fon perdesi: boyalı gece göğü (yıldızlar, hilal, yumuşak tepeler); iskeletler her arka planda okunsun (x -292..292, y -258..-40)
  H.fon = is8Spr(584, 218, 292, 258, q => {
    const gr = q.createLinearGradient(0, -258, 0, -40); gr.addColorStop(0, '#1e1544'); gr.addColorStop(0.65, '#33256a'); gr.addColorStop(1, '#4a3585');
    q.fillStyle = gr; q.fillRect(-292, -258, 584, 218);
    const r = rng(8808);
    for (let i = 0; i < 46; i++) { const x = -280 + r() * 560, y = -250 + r() * 150, s = 0.5 + r() * 1.1; q.fillStyle = 'rgba(255,240,205,' + (0.35 + r() * 0.5).toFixed(2) + ')'; q.beginPath(); q.arc(x, y, s, 0, 6.2832); q.fill(); }
    for (const [x, y] of [[-150, -222], [120, -200], [230, -236]]) { q.fillStyle = 'rgba(255,240,205,0.8)'; q.beginPath(); for (let j = 0; j < 8; j++) { const a = j * Math.PI / 4, rr = j % 2 ? 0.8 : 3.2; q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } q.closePath(); q.fill(); }
    q.fillStyle = 'rgba(255,231,168,0.85)'; q.beginPath(); q.arc(-212, -206, 15, 0, 6.2832); q.fill();
    q.fillStyle = '#251a4f'; q.beginPath(); q.arc(-205, -211, 13.5, 0, 6.2832); q.fill();
    q.fillStyle = '#2c2060'; q.beginPath(); q.moveTo(-292, -40); q.lineTo(-292, -86); q.quadraticCurveTo(-200, -120, -110, -84); q.quadraticCurveTo(-30, -60, 40, -92); q.quadraticCurveTo(150, -132, 292, -80); q.lineTo(292, -40); q.closePath(); q.fill();
    q.fillStyle = '#3a2a72'; q.beginPath(); q.moveTo(-292, -40); q.lineTo(-292, -62); q.quadraticCurveTo(-150, -86, -20, -60); q.quadraticCurveTo(120, -40, 292, -66); q.lineTo(292, -40); q.closePath(); q.fill();
    for (const [x, y] of [[-170, -101], [60, -99], [205, -104]]) { q.fillStyle = 'rgba(255,200,110,0.55)'; q.fillRect(x - 2, y - 3, 4, 4); }
  }, 1.5);
  // sol direk + kadife perde (sağdaki aynası); x -332..-228, y -298..-32
  H.direk = is8Spr(104, 266, 332, 298, q => {
    const perde = () => { q.beginPath(); q.moveTo(-304, -254); q.lineTo(-236, -254); q.bezierCurveTo(-238, -215, -252, -178, -270, -152); q.bezierCurveTo(-256, -120, -242, -80, -232, -44); q.lineTo(-304, -44); q.closePath(); };
    q.strokeStyle = IS8_KONTUR; q.lineWidth = 2.4; perde(); q.stroke();
    const gp = q.createLinearGradient(-304, 0, -232, 0); gp.addColorStop(0, '#2f1d62'); gp.addColorStop(0.55, '#6a46b4'); gp.addColorStop(1, '#4a3090'); q.fillStyle = gp; perde(); q.fill();
    q.save(); perde(); q.clip();
    for (let i = 0; i < 5; i++) { const x = -298 + i * 13; q.strokeStyle = i % 2 ? 'rgba(150,115,230,0.45)' : 'rgba(30,16,70,0.45)'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(x + 4, -254); q.bezierCurveTo(x + 2, -210, x - 4 + i * 2.5, -180, -282 + i * 3.5, -152); q.bezierCurveTo(-276 + i * 6, -120, x + 10 + i * 3, -80, x + 14 + i * 4, -44); q.stroke(); }
    const gv = q.createLinearGradient(0, -100, 0, -44); gv.addColorStop(0, 'rgba(255,190,120,0)'); gv.addColorStop(1, 'rgba(255,190,120,0.25)'); q.fillStyle = gv; q.fillRect(-310, -100, 90, 60);   // kabak ışığının perdeye vuruşu
    q.restore();
    is8Kat(q, q => is8Elips(q, -270, -152, 10, 4, 0.25), '#ffd27a', 0.8);
    q.strokeStyle = '#e8b04a'; q.lineWidth = 1.2; for (let i = 0; i < 4; i++) { q.beginPath(); q.moveTo(-262 + i * 0.8, -150); q.lineTo(-263 + i * 1.4, -137); q.stroke(); }
    is8Kat(q, q => { q.beginPath(); q.arc(-262, -150, 2.2, 0, 6.2832); }, '#ffe7a8', 0.6);
    q.fillStyle = IS8_KONTUR; q.fillRect(-304.2, -292, 16.4, 258);
    q.fillStyle = '#8a5a3c'; q.fillRect(-303, -291, 14, 256); q.fillStyle = '#b07a50'; q.fillRect(-303, -291, 3.4, 256); q.fillStyle = '#5e3a28'; q.fillRect(-292.4, -291, 3.4, 256);
    for (const y of [-200, -120, -60]) { q.fillStyle = 'rgba(46,26,40,0.5)'; q.fillRect(-303, y, 14, 1.2); }
  }, R);
  // üst: kiriş, fistolu kadife saçak, altın şerit, ampuller, ortada gökkuşağı ksilofonlu altın madalyon (x -328..328, y -298..-238)
  H.ust = is8Spr(656, 60, 328, 298, q => {
    is8Kat(q, q => is8Yuv(q, -322, -296, 644, 9, 3), '#8a5a3c', 0.9);
    q.fillStyle = '#b07a50'; q.fillRect(-318, -295, 636, 2);
    const { N, x0, w } = IS8_SACAK;
    const sacak = () => { q.beginPath(); q.moveTo(x0, -287); q.lineTo(-x0, -287); q.lineTo(-x0, -264); for (let i = N - 1; i >= 0; i--) { const a = x0 + i * w; q.quadraticCurveTo(a + w / 2, -242, a, -264); } q.closePath(); };
    q.strokeStyle = IS8_KONTUR; q.lineWidth = 2.2; sacak(); q.stroke();
    const gs = q.createLinearGradient(0, -287, 0, -246); gs.addColorStop(0, '#3d2680'); gs.addColorStop(0.6, '#6a44b8'); gs.addColorStop(1, '#7c56cc'); q.fillStyle = gs; sacak(); q.fill();
    q.save(); sacak(); q.clip(); q.fillStyle = 'rgba(255,255,255,0.12)'; for (let i = 0; i < N; i++) { q.beginPath(); q.ellipse(x0 + i * w + w * 0.36, -262, w * 0.15, 8, 0, 0, 6.2832); q.fill(); } q.restore();
    q.strokeStyle = '#ffd27a'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(x0, -283); q.lineTo(-x0, -283); q.stroke();
    q.beginPath(); q.moveTo(x0, -264); for (let i = 0; i < N; i++) { const a = x0 + i * w; q.quadraticCurveTo(a + w / 2, -244.5, a + w, -264); } q.stroke();
    for (let i = 0; i <= N; i++) is8Kat(q, q => { q.beginPath(); q.arc(x0 + i * w, -264, 2.1, 0, 6.2832); }, '#ffe08a', 0.55);
    for (let i = 0; i < N; i++) { const x = x0 + i * w + w / 2, col = IS8_AMPUL[i % 5]; q.fillStyle = '#4a3a30'; q.fillRect(x - 1, -251.2, 2, 2.4); is8Kat(q, q => is8Elips(q, x, -246.6, 2.3, 2.8), col, 0.55); q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(x - 0.7, -247.5, 0.8, 0, 6.2832); q.fill(); }
    is8Kat(q, q => { q.beginPath(); q.arc(0, -268, 17, 0, 6.2832); }, '#ffd27a', 1.1);
    q.strokeStyle = '#ffeab4'; q.lineWidth = 1.2; q.beginPath(); q.arc(0, -268, 14.2, 0, 6.2832); q.stroke();
    const cb = ['#ff9fc8', '#fff08a', '#9effc8', '#c9a8ff'];
    for (let i = 0; i < 4; i++) { const h = 15 - i * 2.4, x = -7.5 + i * 5; is8Kat(q, q => is8Yuv(q, x - 1.9, -260.5 - h, 3.8, h, 1.6), cb[i], 0.55); }
    is8Kat(q, q => { q.beginPath(); q.arc(9.5, -279, 1.9, 0, 6.2832); }, '#ff9a3c', 0.5);
    q.strokeStyle = IS8_KONTUR; q.lineWidth = 0.9; q.beginPath(); q.moveTo(9.5, -279); q.lineTo(4.5, -271); q.stroke();
  }, R);
  // bayrak süsü: yuvarlak uçlu üçgen flamalar (yıldız · nokta · ay motifli)
  H.bayrak = IS8_BAYRAK.map((col, i) => is8Spr(16, 20, 8, 1.5, q => {
    const yol = q => { q.beginPath(); q.moveTo(-6.5, 0); q.lineTo(6.5, 0); q.quadraticCurveTo(1.6, 8, 0.4, 15.5); q.quadraticCurveTo(0, 16.4, -0.4, 15.5); q.quadraticCurveTo(-1.6, 8, -6.5, 0); q.closePath(); };
    is8Kat(q, yol, col, 0.7);
    q.fillStyle = 'rgba(255,255,255,0.35)'; q.beginPath(); q.moveTo(-5, 0.8); q.lineTo(-1.2, 0.8); q.lineTo(-0.6, 9); q.closePath(); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.9)';
    if (i % 3 === 0) { q.beginPath(); for (let j = 0; j < 10; j++) { const a = -Math.PI / 2 + j * Math.PI / 5, r = j % 2 ? 0.9 : 2.2; q.lineTo(Math.cos(a) * r, 5 + Math.sin(a) * r); } q.closePath(); q.fill(); }
    else if (i % 3 === 1) { q.beginPath(); q.arc(0, 5, 1.6, 0, 6.2832); q.fill(); }
    else { q.beginPath(); q.arc(0, 5, 2.1, 0, 6.2832); q.fill(); q.fillStyle = col; q.beginPath(); q.arc(0.9, 4.4, 1.8, 0, 6.2832); q.fill(); }
  }, 3));
  // kabak ışığı: gülen oyma yüz, içi sihirli ışık (sönük ve yanık iki hâl; taban ortası 0,0)
  const kabak = (q, yanik) => {
    q.fillStyle = '#4a2236'; is8Elips(q, 0, -7.2, 10.6, 8); q.fill();
    const gr = q.createRadialGradient(-3, -10, 1, 0, -7, 11); gr.addColorStop(0, yanik ? '#ffc777' : '#a86a50'); gr.addColorStop(0.6, yanik ? '#ff9a3c' : '#8a5040'); gr.addColorStop(1, yanik ? '#e0662a' : '#6a3a34');
    q.fillStyle = gr; is8Elips(q, 0, -7.2, 9.6, 7); q.fill();
    q.strokeStyle = yanik ? 'rgba(200,80,30,0.7)' : 'rgba(70,30,30,0.6)'; q.lineWidth = 0.9; for (const x of [-4.6, 0, 4.6]) { q.beginPath(); q.moveTo(x * 0.6, -13.8); q.quadraticCurveTo(x * 1.25, -7, x * 0.6, -0.4); q.stroke(); }
    is8Kat(q, q => is8Yuv(q, -1.4, -17.2, 2.8, 4.6, 1.2), '#7dbb5a', 0.6);
    q.strokeStyle = '#7dbb5a'; q.lineWidth = 0.9; q.beginPath(); q.moveTo(1.2, -15.4); q.quadraticCurveTo(4.2, -17.4, 4.6, -14.8); q.stroke();
    const ic = yanik ? '#ffe9a8' : '#4a2224';
    q.fillStyle = ic; for (const s of [-1, 1]) { q.beginPath(); q.moveTo(s * 3.6 - 2.1, -8.2); q.quadraticCurveTo(s * 3.6, -12.6, s * 3.6 + 2.1, -8.2); q.closePath(); q.fill(); }
    q.beginPath(); q.moveTo(-5.4, -5.6); q.quadraticCurveTo(0, -4.2, 5.4, -5.6); q.quadraticCurveTo(0, 1.4, -5.4, -5.6); q.fill();
    if (yanik) { q.fillStyle = '#fffbe0'; q.beginPath(); q.moveTo(-3.4, -4.8); q.quadraticCurveTo(0, -3.8, 3.4, -4.8); q.quadraticCurveTo(0, -1, -3.4, -4.8); q.fill(); }
    q.fillStyle = 'rgba(255,255,255,0.45)'; is8Elips(q, -5, -11, 2, 1.1, -0.6); q.fill();
  };
  H.kabak = is8Spr(24, 20, 12, 18.5, q => kabak(q, true), 3); H.kabakS = is8Spr(24, 20, 12, 18.5, q => kabak(q, false), 3);
  // sahne ışığı konisi (üstten aşağı; yumuşak kenarlı, aşağı doğru söner)
  H.spot = is8Spr(200, 300, 100, 0, q => {
    for (let i = 0; i < 9; i++) { const a = 12 + i * 2.2, b = 42 + i * 7; q.fillStyle = 'rgba(255,241,200,0.075)'; q.beginPath(); q.moveTo(-a, 0); q.lineTo(a, 0); q.lineTo(b, 300); q.lineTo(-b, 300); q.closePath(); q.fill(); }
    q.globalCompositeOperation = 'destination-in';
    const gr = q.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.7, 'rgba(0,0,0,0.6)'); gr.addColorStop(1, 'rgba(0,0,0,0.28)'); q.fillStyle = gr; q.fillRect(-100, 0, 200, 300);
    q.globalCompositeOperation = 'source-over';
  }, 1);
}
// ışık notası sprite'ı (♪, renk başına bir kez)
const IS8_NOTA = new Map();
function is8NotaSpr(col) {
  let sp = IS8_NOTA.get(col); if (sp) return sp;
  sp = is8Spr(22, 28, 9, 16, q => {
    const ciz = (renk, e) => {
      q.fillStyle = renk; q.strokeStyle = renk;
      q.beginPath(); q.ellipse(-1.6, 6, 4.6 + e, 3.5 + e, -0.4, 0, 6.2832); q.fill();
      q.lineWidth = 2.2 + e * 2; q.beginPath(); q.moveTo(2.4, 5); q.lineTo(2.4, -12); q.stroke();
      q.lineWidth = 1 + e * 2; q.beginPath(); q.moveTo(2.4, -12.6); q.quadraticCurveTo(10.2, -9.4, 8.8, -2); q.quadraticCurveTo(7, -6.2, 2.4, -6.8); q.closePath(); q.fill(); q.stroke();
    };
    ciz(mixc(col, '#4a3585', 0.5), 0.85); ciz(mixc(col, '#ffffff', 0.55), 0);
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(-3, 4.8, 1.5, 0.9, -0.4, 0, 6.2832); q.fill();
  }, 3);
  IS8_NOTA.set(col, sp); return sp;
}

// ── parçacıklar (sabit havuz): ışık notaları, parıltılar ──
const IS8_NT = []; for (let i = 0; i < 28; i++) IS8_NT.push({ a: false, x: 0, y: 0, vx: 0, t: 0, max: 1, col: '#ffffff', sp: null, s: 1, ph: 0 });
const IS8_TZ = []; for (let i = 0; i < 110; i++) IS8_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, col: '#ffffff', s: 1 });
function is8NotaUcur(x, y, col, s) {
  for (const p of IS8_NT) if (!p.a) { p.a = true; p.x = x; p.y = y; p.vx = (Math.random() - 0.5) * 36; p.t = 0; p.max = 1.7 + Math.random() * 0.4; p.col = col; p.sp = is8NotaSpr(col); p.s = s || 1; p.ph = Math.random() * 6.28; return p; }
  return null;
}
function is8Toz(tip, x, y, vx, vy, max, s, col) {
  for (const p of IS8_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; return p; }
  return null;
}
function is8Kivilcim(x, y, n, col, hiz) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = (hiz || 90) * (0.35 + Math.random() * 0.75); is8Toz(i % 3 === 0 ? 1 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 25, 0.6 + Math.random() * 0.5, 3 + Math.random() * 4, i % 2 ? col : '#ffffff'); }
}
function is8ParcaAdim(dt) {
  for (const p of IS8_NT) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; } p.y -= (44 + 22 * (1 - p.t / p.max)) * dt; p.x += (p.vx + Math.sin(p.t * 3.2 + p.ph) * 22) * dt; p.vx *= Math.exp(-dt * 2); }
  for (const p of IS8_TZ) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; } p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) + (p.tip === 2 ? 40 : -10) * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
}
function is8ParcaCiz() {
  g.globalCompositeOperation = 'lighter';
  for (const p of IS8_TZ) {
    if (!p.a) continue; const f = 1 - p.t / p.max;
    dglow(p.col, p.x, p.y, p.s * (1 + f), f * 0.9);
    if (p.tip === 1) { g.globalAlpha = f; g.drawImage(IS8_S.yildiz.c, p.x - p.s * 0.7, p.y - p.s * 0.7, p.s * 1.4, p.s * 1.4); g.globalAlpha = 1; }
  }
  for (const p of IS8_NT) { if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u); dglow(p.col, p.x, p.y, 24 * p.s, al * 0.6); }
  g.globalCompositeOperation = 'source-over';
  for (const p of IS8_NT) {
    if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u), sc = p.s * (0.7 + 0.3 * Math.min(1, u * 4)), r = Math.sin(p.t * 2.5 + p.ph) * 0.25;
    g.globalAlpha = al; is8Don(g, p.sp, p.x, p.y, r, sc, false); g.globalAlpha = 1;
  }
}

// ══════════════════════ mini oyun ══════════════════════
const ISKELET = {
  o: null,
  get aktif() { const o = this.o; return o && o.is && o.is.aktif && !o.done ? o : null; },
  vurus() { const o = this.o; return o && o.is ? o.is.saat / IS8_VUR : 0; },   // 'iskeletBasla'dan beri geçen vuruş (112 BPM)
  ezgi: IS8_EZGI, sahip: IS8_SAHIP
};
function is8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function is8Olc(s) { return IS8_TIP[s.tip].s * IS8_OLC; }
function is8Hedef(o) { const k = o.is; return k.faz === 'cal' && k.cumle < 4 && k.adim < 4 ? IS8_SAHIP[IS8_EZGI[k.cumle][k.adim]] : -1; }
function is8KendiNota(s) { if (s.tip !== 4) return s.tip; s.kn = s.kn ? 0 : 1; return 4 + s.kn; }   // minik iki notalı: Do ↔ üst Re
function is8CubukSec(s, i) { const n = IS8_TIP[s.tip].cubuk.length; if (s.tip === 4) return i === 5 ? n - 1 : 1; return (s.sira++) % n; }
// iskelet kendi kaburgasına vurur: nota + çubuk ışığı + havalanan ışık notası (+ figür: true = sıradaki kendi figürü, ad, ya da null)
function is8Cal(o, kim, i, figur) {
  const k = o.is, s = k.isk[kim], tp = IS8_TIP[s.tip], ol = is8Ol(s.tip);
  is8Sfx('iskeletNota', i);
  s.cal = 1; s.cubI = 1; s.cub = is8CubukSec(s, i); s.uyan = true;
  const b = ol.cub[s.cub], sc = is8Olc(s), x = s.x + b.w * 0.1 * sc, y = s.y + (ol.gogusY + b.y) * sc;
  is8NotaUcur(x, y - 6, b.col, 1); is8Kivilcim(x, y, 7, b.col, 95);
  if (figur) { s.har = figur === true ? tp.fig[s.fig++ % tp.fig.length] : figur; s.hu = 0; s.harS = s.har === 'selam' ? 0.9 : IS8_FIG; }
}
// dokunuş (çocuk ya da Pırıl): sıradaki iskeletse ezgi ilerler; değilse o da kendi notasını çalar (yanlış yok)
function is8Dokun(o, kim, yardim) {
  const k = o.is; if (!k.aktif || kim < 0 || kim > 4) return;
  if (!yardim) { k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
  const s = k.isk[kim];
  if (k.faz === 'cal') {
    const i = IS8_EZGI[k.cumle][k.adim];
    if (kim === IS8_SAHIP[i]) {
      is8Cal(o, kim, i, true); k.adim++; k.say++;
      OLAY.emit('iskeletNota', { o, n: k.say, i, kim, cumle: k.cumle + 1, yardim: !!yardim });
      if (k.adim >= 4) { k.faz = 'ara'; k.fT = 0; k.b0 = Math.ceil(k.saat / IS8_VUR + 0.75); k.fzSev = 1; }   // ~0,4 sn sonra ilk vuruşta dans
      return;
    }
    const ki = is8KendiNota(s); is8Cal(o, kim, ki, true); OLAY.emit('iskeletSerbest', { o, i: ki, kim });
    return;
  }
  if (k.faz === 'final' || k.faz === 'don') { is8Kivilcim(s.x, s.y - 60, 6, IS8_TIP[s.tip].renk, 80); return; }   // finali bozmayan sessiz parıltı
  const ki = is8KendiNota(s); is8Cal(o, kim, ki, k.faz === 'dans' ? null : true); OLAY.emit('iskeletSerbest', { o, i: ki, kim });
}
function is8Faz(o, f, b0) {
  const k = o.is; k.faz = f; k.fT = 0; k.b0 = b0; k.sonVur = Math.floor(b0) - 1;
  if (f === 'tanit') k.nota = 0;
  else if (f === 'dans') { k.dansN = k.cumle + 1; is8Sfx('iskeletDans', k.dansN); OLAY.emit('iskeletDans', { o, n: k.dansN, vurus: b0 }); }
  else if (f === 'final') { k.nota = 0; is8Sfx('iskeletDans', 5); OLAY.emit('iskeletDans', { o, n: 5, vurus: b0 }); }
}
function is8Vurus(o, vb, fn) { const k = o.is, bi = Math.floor(vb + 1e-6); if (bi > k.sonVur) { k.sonVur = bi; k.flas = 1; fn(bi - Math.round(k.b0)); } }
function is8Aktiflestir(o) {
  const k = o.is; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x0 = P.x; e.x = Math.min(P.x, o.x - IS8_GIRIS); e.y = o.y; e.safeX = e.x; e.safeY = o.y; e.f = P.f;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; k.dalis = 0; k.fzx = P.x; ISKELET.o = o; is8GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  for (const s of k.isk) { s.x = s.x0; if (!s.uyan) { s.uyan = true; s.har = 'selam'; s.hu = 0; s.harS = 0.9; } }
  if (k.adim >= 4) k.adim = 0;   // yarıda kalan cümle baştan
  is8Faz(o, 'gel', k.saat / IS8_VUR);
  if (!k.basladi) { k.basladi = true; OLAY.emit('iskeletBasla', { o }); }
  return true;
}
function is8Birak(o, tamam) {   // güvenli dönüş: Feza sahnenin solunda, sağa bakarak bırakılır
  const k = o.is, e = k.entry; if (!k.aktif) return;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.x; P.safeY = e.y; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; k.dalis = 0; is8GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('iskelet', 0.1, k.kameraFn, 1, 0.5);
  for (const s of k.isk) { s.x = s.x0; s.har = null; s.hu = 0; s.dans = 0; s.kafaD = 0; }
  if (tamam && !o.done) {
    o.done = true; k.faz = 'bitti';
    if (typeof V8 !== 'undefined' && V8) V8.iskelet = true;
    OLAY.emit('iskeletBitti', { o });
  } else if (!tamam && !o.done) { k.faz = 'bekle'; if (k.adim >= 4 || k.cumle > 3) { k.cumle = Math.min(k.cumle, 3); k.adim = 0; } }
}
function is8GirdiBirak() { if (typeof omHepsiniBirak === 'function') { try { omHepsiniBirak(); } catch (e) {} } }

// ── her kare ──
function is8Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza sahnenin solunda durur
  const k = o.is; if (!k.aktif || P.ucus !== o) return;
  P.x = k.fzx; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function is8IskAdim(o, s, dt, sesli) {
  s.cal = Math.max(0, s.cal - dt * 2.9); s.cubI = Math.max(0, s.cubI - dt * 1.5); s.hepsi = Math.max(0, s.hepsi - dt * 0.9);
  if (s.har) {
    const u0 = s.hu; s.hu += dt / s.harS;
    if (sesli && s.har === 'kafa' && u0 < 0.72 && s.hu >= 0.72) { is8Sfx('kemikTakir', 0.5); const ol = is8Ol(s.tip); is8Kivilcim(s.x, s.y + ol.tepeY * is8Olc(s) * 0.75, 5, '#ffffff', 60); }
    if (s.hu >= 1) { s.har = null; s.hu = 0; }
  }
  s.parla += (s.parlaH - s.parla) * (1 - Math.exp(-dt * 5));
  s.heves += (s.hevesH * (s.har ? 0.15 : 1) - s.heves) * (1 - Math.exp(-dt * 7));
  s.yon += (s.yonH - s.yon) * (1 - Math.exp(-dt * 4));
}
function is8Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.is; k.t += dt; is8ParcaAdim(dt);
  // Feza yaklaştıkça kabak ışıkları sırayla yanar, iskeletler birer birer uyanır (geri giderse ışık yavaşça kısılır; uyanan uyumaz)
  const hd = o.done || k.aktif ? 1 : Math.abs(P.y - o.y) < 420 ? clamp((1000 - Math.abs(P.x - o.x)) / 520, 0, 1) : 0;
  k.ap = hd > k.ap ? Math.min(hd, k.ap + dt * 0.8) : Math.max(hd, k.ap - dt * 0.25);
  k.fzSev = Math.max(0, k.fzSev - dt); k.flas = Math.max(0, k.flas - dt * 4.5);
  const dansEdiyor = k.faz === 'dans' || k.faz === 'final';
  k.parlak += ((dansEdiyor ? 1 : k.aktif ? 0.45 : o.done ? 0.35 : 0) - k.parlak) * (1 - Math.exp(-dt * 3));
  for (const s of k.isk) {
    if (!s.uyan && k.ap > 0.42 + s.kim * 0.1) { s.uyan = true; s.har = 'selam'; s.hu = 0; s.harS = 1.0; is8Sfx('kemikTakir', 0.3); const ol = is8Ol(s.tip); is8Kivilcim(s.x, s.y + ol.tepeY * is8Olc(s) * 0.8, 6, IS8_TIP[s.tip].renk, 70); }
    s.uyku = s.uyan ? Math.max(0, s.uyku - dt * 2.6) : 1;
    is8IskAdim(o, s, dt, !dansEdiyor);
  }
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - IS8_GIRIS - 8 && P.x < o.x + 900 && Math.abs(P.y - o.y) < 120) is8Aktiflestir(o);
  if (!k.aktif) { is8BosAdim(o, dt); return; }
  if (typeof omDikkat === 'function') omDikkat('iskelet', 1.5, k.kameraFn, 1, 0.5);
  k.fT += dt; k.saat += dt;
  const vb = k.saat / IS8_VUR, hk = is8Hedef(o);
  // bakışlar, hale, sahne ışığı
  for (const s of k.isk) {
    if (k.faz === 'cal') {
      const ben = s.kim === hk, h = hk >= 0 ? k.isk[hk] : null;
      s.parlaH = ben ? 1 : 0; s.hevesH = ben ? (k.idle > IS8_IPUCU || k.helpOn ? 1 : 0.75) : 0;
      s.yonH = ben ? -0.55 : h ? clamp((h.x - s.x) / 90, -0.75, 0.75) : 0;
    } else if (!dansEdiyor) { s.parlaH = 0; s.hevesH = 0; s.yonH = k.faz === 'gel' ? -0.6 : 0; }
  }
  if (k.faz === 'cal' && hk >= 0) { k.spX += (k.isk[hk].x - k.spX) * (1 - Math.exp(-dt * 7)); k.spA = Math.min(1, k.spA + dt * 2.5); }
  else if (k.faz === 'tanit') k.spA = Math.min(0.85, k.spA + dt * 3);
  else k.spA = Math.max(0, k.spA - dt * (dansEdiyor ? 3 : 1.2));
  // akış
  if (k.faz === 'gel') {
    k.fzx = lerp(k.entry.x0, k.entry.x, smooth(clamp(k.fT / 0.7, 0, 1)));
    if (vb >= k.b0 + 2) { if (!k.tanitildi) is8Faz(o, 'tanit', k.b0 + 2); else is8Faz(o, 'cal', vb); }
  } else if (k.faz === 'tanit') {   // tanışma: Re Fa Sol La Do Re sekizliklerle, soldan sağa
    k.fzx = k.entry.x;
    const j = Math.floor((vb - k.b0) * 2 + 1e-6);
    while (k.nota <= Math.min(j, 5)) { const i = k.nota++, kim = IS8_SAHIP[i]; is8Cal(o, kim, i, i === 5 ? null : 'selam'); k.spX = lerp(k.spX, k.isk[kim].x, 0.75); }
    if (vb >= k.b0 + 3.5) { k.tanitildi = true; is8Faz(o, 'cal', vb); }
  } else if (k.faz === 'cal') {
    if (!k.helpOn) {
      const i0 = k.idle; k.idle += dt;
      if (i0 < IS8_IPUCU && k.idle >= IS8_IPUCU) { k.ipucuN++; OLAY.emit('iskeletIpucu', { o, n: k.ipucuN, kim: hk }); }
      if (k.idle >= (k.helpN > 0 ? IS8_YARDIM2 : IS8_YARDIM)) { k.helpOn = true; k.helpT = 0; k.helpN++; OLAY.emit('iskeletYardim', { o, n: k.helpN }); }
    }
  } else if (k.faz === 'ara') {
    if (vb >= k.b0) { if (k.cumle >= 3) is8Faz(o, 'final', k.b0); else is8Faz(o, 'dans', k.b0); }
  } else if (k.faz === 'dans') is8DansAdim(o, vb);
  else if (k.faz === 'final') is8FinalAdim(o, vb);
  else if (k.faz === 'don') { k.fzSev = 0.3; if (k.fT > 0.75) is8Birak(o, true); }
  is8PirilAdim(o, dt);
}
// cümle sonu: bir ölçü hep birlikte dans (1: el sallama + hoplama · 2: kalça sallama · 3: kafalar takır takır, sonunda hepsi kafa döndürür)
function is8DansAdim(o, vb) {
  const k = o.is, u = clamp((vb - k.b0) / 4, 0, 1), n = k.dansN;
  is8Vurus(o, vb, b => { if (b >= 0 && b < 4) is8Sfx('kemikTakir', b % 2 ? 1 : 0.55); });
  const w = u < 0.06 ? smooth(u / 0.06) : u > 0.93 ? smooth((1 - u) / 0.07) : 1;
  for (const s of k.isk) {
    s.parlaH = 0.3; s.hevesH = 0; s.yonH = 0; s.faz = vb - k.b0; s.kafaD = 0;
    if (n === 1) { s.dans = 0.55 * w; s.har = 'el'; s.hu = u; }
    else if (n === 2) { s.dans = 0.3 * w; s.har = 'kalca'; s.hu = u; }
    else { s.dans = w; s.kafaD = u < 0.72 ? 0.9 * w : 0; if (u >= 0.72) { s.har = 'kafa'; s.hu = (u - 0.72) / 0.28 * 0.92; } else s.har = null; }
  }
  k.fzSev = Math.max(k.fzSev, 0.2);
  if (vb >= k.b0 + 4) { for (const s of k.isk) { s.har = null; s.hu = 0; s.dans = 0; s.kafaD = 0; } k.cumle++; k.adim = 0; is8Faz(o, 'cal', vb); }
}
// BÜYÜK KEMİK DANSI: toplanma (1 vuruş) → el ele dizi 1-2-3-tekme (8 vuruş; kaburgalar ezgiyi swing'li sekizliklerle çalar) → "ta-da!"
function is8FinalAdim(o, vb) {
  const k = o.is, fb = vb - k.b0;
  is8Vurus(o, vb, b => {
    if (b >= 0 && b < 9) is8Sfx('kemikTakir', b % 4 === 3 ? 1 : 0.7);
    if (b === 9) {   // ta-da!
      is8Sfx('iskeletDans', 6);
      for (const s of k.isk) { s.hepsi = 1; const ol = is8Ol(s.tip), tp = IS8_TIP[s.tip], sc = is8Olc(s); is8Kivilcim(s.x0, s.y + ol.gogusY * sc, 12, tp.renk, 150); is8NotaUcur(s.x0 + (Math.random() - 0.5) * 30, s.y + ol.tepeY * sc, tp.cubuk[(Math.random() * tp.cubuk.length) | 0], 1.2); }
    }
  });
  while (k.nota < 16) {   // ezginin tekrarı (sekizlik çifti uzun-kısa)
    const n = k.nota, tb = 1 + (n >> 1) + (n & 1 ? 0.56 : 0); if (fb < tb) break;
    k.nota++; const i = IS8_EZGI[n >> 2][n & 3], s = k.isk[IS8_SAHIP[i]], ol = is8Ol(s.tip), tp = IS8_TIP[s.tip];
    is8Sfx('iskeletNota', i); s.cub = is8CubukSec(s, i); s.cubI = 1;
    const b = ol.cub[s.cub]; is8NotaUcur(s.x, s.y + (ol.gogusY + b.y) * is8Olc(s) - 6, b.col, 0.9);
  }
  const topla = smooth(clamp(fb, 0, 1)), dag = smooth(clamp((fb - 8.55) / 0.5, 0, 1));
  const sal = Math.sin(clamp(fb - 1, 0, 8) * Math.PI / 4) * 34, salV = Math.cos(clamp(fb - 1, 0, 8) * Math.PI / 4);
  for (const s of k.isk) {
    const yer = o.x + (s.kim - 2) * 68 + sal;
    s.x = lerp(lerp(s.x0, yer, topla), s.x0, dag);
    s.parlaH = 0.45; s.hevesH = 0; s.dans = 0; s.kafaD = 0; s.faz = fb - 1;
    if (fb < 9) { s.har = 'conga'; s.hu = fb < 1 ? fb * 0.12 : fb < 8.55 ? 0.5 : 0.82 + clamp((fb - 8.55) / 0.45, 0, 1) * 0.17; s.yonH = salV * 0.5; }
    else { s.har = 'tada'; s.hu = clamp((fb - 9) / 2.2, 0, 0.99); s.yonH = -0.3; }
  }
  k.fzSev = Math.max(k.fzSev, 0.3);
  if (fb >= 11.2) { for (const s of k.isk) { s.har = null; s.hu = 0; s.x = s.x0; } is8Faz(o, 'don', vb); }
}
// etkinlik yokken: uyanık iskeletler Feza'ya bakar, arada bir kendi kendine figür yapar; bitince hafifçe dans etmeyi sürdürür
function is8BosAdim(o, dt) {
  const k = o.is, yakin = Math.abs(P.x - o.x) < 700;
  for (const s of k.isk) {
    s.parlaH = 0; s.hevesH = 0; s.yonH = yakin && s.uyan ? clamp((P.x - s.x) / 260, -0.8, 0.8) : 0;
    s.dans += ((o.done ? 0.22 : 0) - s.dans) * (1 - Math.exp(-dt * 2)); s.faz = k.t * IS8_BPM / 60; s.kafaD = 0;
  }
  k.spA = Math.max(0, k.spA - dt * 1.2);
  k.rasT = (k.rasT || 3) - dt;
  if (k.rasT <= 0) { k.rasT = 2.6 + Math.random() * 3.2; const s = k.isk[(Math.random() * 5) | 0], tp = IS8_TIP[s.tip]; if (s.uyan && !s.har && k.ap > 0.6) { s.har = tp.fig[(Math.random() * tp.fig.length) | 0]; s.hu = 0; s.harS = IS8_FIG; } }
}
function is8Serbest(o, kim) {   // etkinlik yokken dokunuş: o iskelet notasını çalar + figür
  const k = o.is, s = k.isk[kim]; if (!s) return;
  if (!s.uyan) { s.uyan = true; s.uyku = 0.6; }
  const i = is8KendiNota(s); is8Cal(o, kim, i, true); OLAY.emit('iskeletSerbest', { o, i, kim });
}
// Pırıl: Feza'nın yanında · ipucu (sıradakinin üstüne uçup ışık serper, sonra Feza'ya döner) · yardım (burnuyla dokunup çalar) · dansta tur atar
function is8PirilAdim(o, dt) {
  const k = o.is, pr = k.pr, hk = is8Hedef(o);
  let tx = k.fzx + 46, ty = o.y - 116 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'cal' && hk >= 0) {
    const s = k.isk[hk], ol = is8Ol(s.tip), tepe = s.y + ol.tepeY * is8Olc(s);
    if (k.helpOn) {
      k.helpT += dt;
      if (k.dalis > 0) {   // burnuyla "dıt" diye dokunur
        k.dalis -= dt; const u = 1 - k.dalis / 0.34;
        tx = s.x - 4; ty = tepe - 26 + Math.sin(clamp(u, 0, 1) * Math.PI) * 22; hiz = 16;
        if (!k.dalisVurdu && u > 0.5) { k.dalisVurdu = true; is8Dokun(o, hk, true); is8Kivilcim(s.x, tepe, 8, '#e2ccff', 70); }
      } else {
        tx = s.x - 4; ty = tepe - 26 + Math.sin(k.t * 3) * 3; hiz = 5;
        if (Math.hypot(pr.x - tx, pr.y - ty) < 18 && k.helpT > 1.0) { k.dalis = 0.34; k.dalisVurdu = false; k.helpT = 0; }
      }
    } else if (k.idle > IS8_IPUCU) {
      const u = ((k.idle - IS8_IPUCU) % 5) / 5, ust = u < 0.62;
      tx = ust ? s.x - 8 : k.fzx + 46; ty = ust ? tepe - 40 + Math.sin(k.t * 3.2) * 6 : o.y - 116; hiz = 3.2;
      if (ust && Math.hypot(pr.x - tx, pr.y - ty) < 40 && Math.random() < dt * 14) is8Toz(2, pr.x + (Math.random() - 0.5) * 16, pr.y + 8, (Math.random() - 0.5) * 20, 20, 1.1, 4 + Math.random() * 3, Math.random() < 0.5 ? '#e2ccff' : IS8_TIP[s.tip].renk);
      bak = Math.sign(s.x - pr.x) || 1;
    } else bak = Math.sign(o.x - pr.x) || 1;
  } else if (k.faz === 'dans' || k.faz === 'final' || k.faz === 'don') {
    const a = k.t * 2.1; tx = o.x + Math.sin(a) * 150; ty = o.y - 246 + Math.sin(a * 2) * 16; hiz = 3; bak = Math.cos(a) > 0 ? 1 : -1;
    if (Math.random() < dt * 6) is8Toz(0, pr.x, pr.y + 6, 0, 10, 0.8, 4, '#e2ccff');
  } else if (k.faz === 'tanit') { tx = k.fzx + 50; ty = o.y - 130; bak = 1; }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function is8SahneCiz(o, tm) {
  const H = IS8_SH, k = o.is, X = o.x, Y = o.y, ap = k.ap, pk = k.parlak, fl = k.flas * pk;
  g.globalAlpha = 0.5 + 0.35 * ap; is8Bas(g, H.fon, X, Y); g.globalAlpha = 1;
  g.globalCompositeOperation = 'lighter';
  is8Glow(g, '#ffb070', X, Y - 120, 390, 200, 0.12 * ap + 0.07 * pk + 0.04 * fl);   // sahnenin sıcak ışığı
  g.globalCompositeOperation = 'source-over';
  is8Bas(g, H.direk, X, Y); g.save(); g.translate(X, Y); g.scale(-1, 1); is8Bas(g, H.direk, 0, 0); g.restore();
  is8Bas(g, H.ust, X, Y);
  // direk tepesindeki kabak fenerler + ampul parıltıları
  g.globalCompositeOperation = 'lighter';
  const { N, x0, w } = IS8_SACAK;
  for (let i = 0; i < N; i++) { const a = ap * (0.28 + 0.22 * Math.sin(tm * 2.2 + i * 1.9) + 0.25 * fl + 0.12 * pk); is8Glow(g, IS8_AMPUL[i % 5], X + x0 + i * w + w / 2, Y - 246.6, 11, 11, a); }
  for (let sx = -1; sx <= 1; sx += 2) is8Glow(g, '#ffb347', X + sx * 296, Y - 304, 34, 30, ap * (0.5 + 0.1 * Math.sin(tm * 1.7 + sx)));
  g.globalCompositeOperation = 'source-over';
  for (let sx = -1; sx <= 1; sx += 2) { is8Bas(g, H.kabakS, X + sx * 296, Y - 296, 1.15); g.globalAlpha = ap; is8Bas(g, H.kabak, X + sx * 296, Y - 296, 1.15); g.globalAlpha = 1; }
  // bayrak süsü: iki sarkık ip, üstünde salınan flamalar
  g.strokeStyle = 'rgba(255,231,168,0.75)'; g.lineWidth = 0.9;
  for (let yi = 0; yi < 2; yi++) {
    const ax = yi ? 0 : -292, bx = yi ? 292 : 0, ay = Y - 238, cx = X + (ax + bx) / 2, cy = ay + 52;
    g.beginPath(); g.moveTo(X + ax, ay); g.quadraticCurveTo(cx, cy, X + bx, ay); g.stroke();
    for (let j = 0; j < 7; j++) {
      const u = (j + 0.5) / 7, v = 1 - u, px = v * v * (X + ax) + 2 * u * v * cx + u * u * (X + bx), py = v * v * ay + 2 * u * v * cy + u * u * ay;
      const dx = 2 * v * (cx - X - ax) + 2 * u * (X + bx - cx), dy = 2 * v * (cy - ay) + 2 * u * (ay - cy), a = Math.atan2(dy, dx) * 0.6 + Math.sin(tm * 1.6 + j * 1.3 + yi * 2) * 0.07;
      is8Don(g, H.bayrak[(j + yi * 2) % 5], px, py, a, 1, false);
    }
  }
  is8Bas(g, H.zemin, X, Y);
}
function is8Spot(o, tm) {   // sıradaki iskeletin üstüne düşen sahne ışığı (saçaktaki küçük lamba kayarak izler)
  const k = o.is, a = k.spA; if (a < 0.01) return;
  const top = o.y - 242, bot = o.y + IS8_SY, h = bot - top, x = k.spX, x0 = o.x + (x - o.x) * 0.3, sp = IS8_SH.spot;
  g.globalCompositeOperation = 'lighter';
  g.globalAlpha = a * (0.62 + 0.06 * Math.sin(tm * 2.3));
  g.save(); g.translate(x0, top); g.transform(1, 0, (x - x0) / h, 1, 0, 0); g.drawImage(sp.c, -sp.w * 0.5, 0, sp.w, h); g.restore();
  g.globalAlpha = 1;
  is8Glow(g, '#fff1c6', x, bot - 2, 84, 17, a * 0.8); is8Glow(g, '#ffffff', x, bot - 3, 40, 8, a * 0.45);
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#2e1a36'; g.fillRect(x0 - 5.5, top - 7.5, 11, 8.5); g.fillStyle = '#d8a24a'; g.fillRect(x0 - 4.5, top - 6.5, 9, 6.5); g.fillStyle = '#fff1c6'; g.fillRect(x0 - 4.5, top - 1.2, 9, 1.4);
}
function is8Kabaklar(o, tm) {   // ön kenardaki kabak ışıkları (iskeletlerin ayaklarının önünde): sihirli ışık, yumuşak nabız (alev değil)
  const H = IS8_SH, k = o.is, Y = o.y - 33.5, fl = k.flas * k.parlak;
  for (let j = 0; j < IS8_KABAKX.length; j++) {
    const x = o.x + IS8_KABAKX[j], l = clamp(k.ap * 7.5 - j - 0.3, 0, 1), nb = 0.88 + 0.12 * Math.sin(tm * 1.6 + j * 1.1) + 0.25 * fl;
    if (l > 0.01) {
      g.globalCompositeOperation = 'lighter';
      g.globalAlpha = l * 0.16 * nb; g.save(); g.translate(x, Y - 8); g.scale(0.42, -0.5); g.drawImage(H.spot.c, -H.spot.w * 0.5, 0, H.spot.w, H.spot.h); g.restore(); g.globalAlpha = 1;
      is8Glow(g, '#ffb347', x, Y - 7, 40, 30, l * 0.5 * nb); is8Glow(g, '#fff1c6', x, Y - 7, 14, 11, l * 0.55 * nb);
      g.globalCompositeOperation = 'source-over';
    }
    if (l < 0.99) is8Bas(g, H.kabakS, x, Y);
    if (l > 0.01) { g.globalAlpha = l; is8Bas(g, H.kabak, x, Y); g.globalAlpha = 1; }
  }
}
function is8IskCiz(o, s, tm) {
  const op = s.opt;
  op.tip = s.tip; op.calma = s.cal; op.cubuk = s.cub; op.cubukI = s.cubI; op.hepsi = s.hepsi; op.hareket = s.har; op.hu = s.hu;
  op.parla = s.parla * (0.82 + 0.18 * Math.sin(tm * 4.2)); op.heves = s.heves; op.yon = s.yon; op.uyku = s.uyku; op.dans = s.dans; op.faz = s.faz; op.kafa = s.kafaD || 0;
  iskeletCiz(g, s.x, s.y, IS8_OLC, tm, op);
}
function is8ZzzCiz(o, tm) {   // uyuklayan iskeletlerin "z"leri
  const k = o.is, sp = IS8_S.z;
  for (const s of k.isk) {
    if (s.uyku < 0.3) continue;
    const ol = is8Ol(s.tip), sc = is8Olc(s), hx = s.x + (s.tip % 2 ? 12 : -12) * sc, hy = s.y + (ol.tepeY + 6) * sc;
    for (let j = 0; j < 2; j++) {
      const u = (tm * 0.32 + s.kim * 0.37 + j * 0.5) % 1, al = Math.sin(u * Math.PI) * s.uyku * 0.9;
      g.globalAlpha = al; is8Bas(g, sp, hx + Math.sin(u * 5 + j) * 5 + u * 10 * (s.tip % 2 ? 1 : -1), hy - u * 30, 0.55 + u * 0.6); g.globalAlpha = 1;
    }
  }
}
let is8D8 = null;
function is8Dans8() { if (is8D8 === null) { try { is8D8 = typeof fezaCizPoz === 'function' && /['"]dans8['"]/.test(String(fezaCizPoz)); } catch (e) { is8D8 = false; } } return is8D8; }
const IS8_FZ_OPT = { ruzgar: 0.05 };
function is8Ciz(o, tm) {
  if (o.x + 430 < cam.x || o.x - 470 > cam.x + VW) return;
  is8SahneHazirla();
  is8SahneCiz(o, tm);
  is8Spot(o, tm);
  for (const s of o.is.isk) is8IskCiz(o, s, tm);
  is8Kabaklar(o, tm);
}
function is8CizOn(o, tm) {
  const k = o.is; is8SahneHazirla();
  if (!k.aktif && (o.x + 470 < cam.x || o.x - 520 > cam.x + VW)) return;
  if (k.aktif && P.ucus === o) {
    // Feza: sahnenin solunda, sahneye dönük; cümle bitince ve danslarda sevinçle hoplar
    const sev = k.fzSev > 0 || k.faz === 'dans' || k.faz === 'final' || k.faz === 'don';
    const poz = sev ? ((k.faz === 'dans' || k.faz === 'final') && is8Dans8() ? 'dans8' : 'sevinc') : 'ayakta_yan';
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, k.fzx, P.y, 1, poz, tm, null, IS8_FZ_OPT); } catch (e) {}
    if (typeof pirilCizPoz === 'function') {
      const pr = k.pr, kirp = k.fzSev > 0.5 || k.faz === 'don';
      g.save(); try { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, kirp ? 'goz_kirp' : 'ucus', tm); } catch (e) {} g.restore();
    }
  }
  is8ZzzCiz(o, tm);
  is8ParcaCiz();
}

// ── girdi: etkinlikte her dokunuş en yakın iskelete gider (cömert); Feza'ya dokunmak onu sevindirir. Pencere yakalama evresi:
// motorun yürüme parmağına ulaşmaz. Etkinlik yokken yalnız iskeletin kendisine dokunuş (serbest çalma) yakalanır. ──
function is8Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function is8Bul(o, x, y, comert) {
  const k = o.is; let en = -1, ed = 1e9;
  for (const s of k.isk) {
    const ol = is8Ol(s.tip), sc = is8Olc(s), cy = s.y + (ol.gogusY - 8) * sc, dx = x - s.x, dy = (y - cy) * 0.55, d = Math.hypot(dx, dy);
    if (d < ed) { ed = d; en = s.kim; }
  }
  return comert || ed < 62 ? en : -1;
}
addEventListener('pointerdown', e => {
  if (DURUM !== 'oyun' || e.pointerType === 'mouse' && e.button !== 0) return;
  const o = ISKELET.aktif;
  if (o) {
    if (e.target !== cv) return;
    e.preventDefault(); e.stopPropagation();
    const p = is8Dunya(e), k = o.is;
    if (Math.abs(p.x - k.fzx) < 30 && p.y > P.y - 76 && p.y < P.y + 10) { k.fzSev = 0.9; k.idle = 0; is8Kivilcim(k.fzx, P.y - 40, 8, '#ffe7a8', 80); return; }
    try { is8Dokun(o, is8Bul(o, p.x, p.y, true), false); } catch (er) { console.warn('[iskelet]', er); }
    return;
  }
  const so = ISKELET.o;
  if (!so || !so.is || so.is.ap < 0.3 || P.ucus || e.target !== cv || Math.abs(P.x - so.x) > 900) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi her zaman önce
  const p = is8Dunya(e), kim = is8Bul(so, p.x, p.y, false); if (kim < 0) return;
  e.preventDefault(); e.stopPropagation();
  try { is8Serbest(so, kim); } catch (er) { console.warn('[iskelet]', er); }
}, true);
addEventListener('keydown', e => {
  const o = ISKELET.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  const m = /^Digit([1-5])$/.exec(e.code);
  if (!m && !/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  e.preventDefault(); e.stopPropagation(); if (e.repeat) return;
  if (m) { is8Dokun(o, +m[1] - 1, false); return; }
  if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { const h = is8Hedef(o); is8Dokun(o, h >= 0 ? h : 2, false); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = ISKELET.aktif; if (o && d !== 'mola' && d !== 'duraklat') is8Birak(o, false); });

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" kadrajı ezer; iskelet etkinliğinde dikkat kadrajı geçerli olsun (kardan.js'teki
// sarmalayıcının aynısı; CORE oyun.js'e istisna eklediyse zararsız).
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.is8Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'iskeletMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  s.is8Sarili = true; if (f.kdSarili) s.kdSarili = true;
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('iskeletMini', {
  kur(o) {
    o.done = false;
    const isk = [];
    for (let i = 0; i < 5; i++) isk.push({ kim: i, tip: i, x: o.x + IS8_DX[i], x0: o.x + IS8_DX[i], y: o.y + IS8_SY, cal: 0, cub: 1, cubI: 0, sira: i, kn: 1, har: null, hu: 0, harS: IS8_FIG, fig: 0,
      parla: 0, parlaH: 0, heves: 0, hevesH: 0, yon: 0, yonH: 0, uyku: 1, uyan: false, dans: 0, faz: 0, kafaD: 0, hepsi: 0, opt: { tip: i } });
    o.is = { aktif: false, faz: 'bekle', fT: 0, t: 0, saat: 0, ap: 0, b0: 0, sonVur: -1, cumle: 0, adim: 0, say: 0, nota: 0, dansN: 0, idle: 0, helpOn: false, helpT: 0, helpN: 0,
      dalis: 0, dalisVurdu: false, tanitildi: false, basladi: false, ipucuN: 0, fzx: o.x - IS8_GIRIS, fzSev: 0, flas: 0, parlak: 0, spX: o.x, spA: 0, rasT: 3, isk,
      entry: { x: o.x - IS8_GIRIS, x0: o.x - IS8_GIRIS, y: o.y, safeX: o.x - IS8_GIRIS, safeY: o.y, f: 1 }, pr: { x: o.x - 420, y: o.y - 120, f: 1 }, kameraFn: null };
    o.is.kameraFn = () => { if (typeof omDkEkle === 'function') omDkEkle(o.x - IS8_GIRIS - 64, o.y - 356, o.x + 336, o.y + 26); };
    o.adim = dt => is8Adim(o, dt);
    ISKELET.o = o;
  },
  guncelle: is8Guncelle, ciz: is8Ciz, cizOn: is8CizOn
});
