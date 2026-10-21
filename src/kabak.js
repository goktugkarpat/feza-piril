/* kabak.js — Balkabağı Gecesi'nin dünya nesneleri (Bölüm 8). Korkutucu hiçbir şey yok, kaybetme yok, yazı yok.
   kabakFener : sönük, gri-mor, gözleri kapalı uyuyan balkabağı (12). Feza yanından geçince ya da kabağa dokununca Feza'dan küçük
                bir sihirli ışık süzülüp kabağın içine girer → ışık içten yayılır, gri-mor kabuk turuncuya döner → oyulmuş yüz
                parlayıp CANLANIR (gözler açılır, zıplar, ışık halkası, pırıltılar). Her fenerin yüzü başka (o.yuz 0..11: gülen,
                göz kırpan, dil çıkaran, kahkaha atan, şaşırıp sevinen, öpücük, uykulu gülümseyen, muzip, yıldız gözlü, kalp gözlü,
                neşeli, utangaç); biçimi, tonu ve süsü de başka. Yandıktan sonra göz kırpar, sapını oynatır, gözüyle Feza'yı izler,
                Feza yakındayken kıkırdayıp hoplar; yüzüne göre kendi küçük oyunu var (kalp yollar, esner, dilini oynatır...).
                o.yandi = o.done = true, V8.fener++, OLAY 'kabakFener' {o, n, x, y, renk, pan}, AU.sfx('kabakFener', n).
                o.rk: fenerin büyü rengi (pırıltılar, ışık halkası, finaldeki ışık sütunu).
   hayaletcik : saklambaç (5; o.saklan 'kabak'|'cali'|'agac'|'cit'|'baca'). Kabak yığını / çalı / ağaç kovuğu / çit / baca arkasında
                saklanır: yalnız yumuşak ışıltısı ve ara sıra görünen minik eli, kuyruk ucu ya da kocaman gözleri; Feza ~6 kare
                yakınken kıkırdar (AU.sfx 'hayaletKikir', OLAY 'hayaletKikir' {o}). Feza yaklaşınca (ya da saklandığı yere dokununca)
                "Ce-ee!": ışıltıyla yavaşça süzülüp çıkar (ani değil), kollarını açıp kıkırdar (AU.sfx 'hayaletCee'), Feza'nın
                çevresinde bir tur atar; sonra bölüm boyunca bulunma sırasıyla Feza'nın arkasında süzülür (sallanarak, kuyruğu
                savrularak, ara sıra takla atarak); geride kalınca ışıltılı süzülüşle yetişir; süpürge yolculuğunda bahçede bekler,
                inişten sonra gelir; finalde meydanda dans eder (bulunamayanlar da finalde gelip katılır; sayılmaz).
                o.bulundu = o.done = true, V8.hayalet++, OLAY 'hayaletBuldu' {o, n}. Hafifçe parlar, yolu aydınlatır.
   geceDost   : dekor (o.tur 'yarasa'|'kedi'|'baykus'; sayılmaz). Dalda baş aşağı uyuyan lila yarasalar (Feza geçince uyanır, kanat
                çırpıp çevresinde uçuşur, sonra dalına döner; 'yarasaPir'), şapkalı kara kedi (gerinir, kuyruğunu sallar, mırlar,
                Feza'nın peşinden birkaç adım gelir; 'kediMiyav'), uykulu baykuş (tek gözünü açar, başını yana eğer, yumuşakça öter;
                'baykusHu'). Dal/direk: o.dalX/o.dalY verilirse (HARITA'nın ağacı) yalnız küçük bir dal ucu, yoksa kendi eğri direğim.
                Bahçedeki kedi süpürgeye binince (SUPURGE.kediKaynak() === o) burada çizilmez; konumu o.kx/o.ky.
   cadiMeydan : final (~35 sn; takvim aşağıda). Dev kabak feneri yanar, Feza'nın yaktığı her fenerin renginde ışık sütunu, şeker
                renkli havai fişekler, herkes vuruşta dans eder: iskeletler (iskelet.js iskeletCiz), Cadı Nine ve Cadı Kız (kazan.js
                cadiCiz), kabak dede (seker.js komsuCiz), mini oyunun canlanan kabağı (kabakyuz.js kabakYuzCiz), kara kedi, hayalet
                teyze, yarasalar, hayaletçikler (çiziciler typeof korumalı; yoksa sade yedek). V8.final = true, OLAY 'cadiFinal' {o, duration: 35, box},
                28. sn OLAY 'cadiDoruk' {o}, 35. sn OLAY 'cadiTamam' {o}.
                TEMPO (MUZIK ile anlaşma): final müziği 120 BPM → vuruş 0,5 sn, ölçü (4/4) 2 sn; doruk 28. sn = 15. ölçünün ilk vuruşu.
                cadiFinalAn() final başından saniye, cadiFinalNabiz() 0..1 (vuruş anında 1, sonra söner), cadiFinalKutu() kadraj
                kutusu {x0, y0, x1, y1}; nesnede o.basla, o.age, o.doruk (feza.js/piril.js dans saati için, kuzeyTepe gibi).
   Ortak çiziciler (imzaları her birinin başında): kabakCiz, hayaletCiz, kediCiz, yarasaCiz, baykusCiz (c, x, y, s, t, o).
   Çizimler önbellek tuvallerinden (kb8Tuval; çözünürlük bağlamın ölçeğine göre kovalanır, sahne.js büyük çizse de keskin);
   karede gradient/filtre üretilmez, parçacıklar sabit sayılı ve analitiktir, ekran dışında çizim yapılmaz. */
'use strict';
const KB8 = { spr: new Map(), fenerN: 0, fenerSira: 0, hSira: 0, takipN: 0, meydan: null, hayaletler: [], kediler: [] };
const KB8_PI2 = Math.PI * 2;
function kb8V() { return typeof V8 !== 'undefined' && V8 ? V8 : null; }
function kb8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function kb8Pan(x) { return typeof cam !== 'undefined' ? clamp((x - cam.x - VW / 2) / (VW / 2), -1, 1) : 0; }
function kb8Ekranda(x, pay) { return typeof cam === 'undefined' || (x > cam.x - pay && x < cam.x + VW + pay); }
// yumuşak ışık lekesi (glow sprite'ı; bağlamın saydamlığıyla çarpılır)
function kb8Isik(c, col, x, y, r, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ga; }
function kb8IsikE(c, col, x, y, rx, ry, a) { if (!(a > .003)) return; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ga; }

// ── Önbellek tuvalleri. K = dünya birimi başına piksel; bağlamın o anki ölçeği × s'ye göre kovadan seçilir ──
const KB8_KOVA = [2, 3, 4, 6, 8, 12];
let kb8MatrisYok = false;
function kb8K(c, s) {
  let m = typeof S !== 'undefined' && S > 0 ? S : 2.5;
  if (!kb8MatrisYok && c && c.getTransform) { try { const t = c.getTransform(); m = Math.sqrt(t.a * t.a + t.b * t.b); } catch (e) { kb8MatrisYok = true; } }
  const n = m * Math.abs(s || 1);
  for (let i = 0; i < KB8_KOVA.length; i++) if (KB8_KOVA[i] >= n * .8) return KB8_KOVA[i];
  return 12;
}
function kb8Tuval(ad, K, x0, y0, w, h, fn) {
  const key = ad + '@' + K; let c = KB8.spr.get(key); if (c) return c;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; KB8.spr.set(key, c); return c;
}
function kb8Koy(c, spr, x, y) { c.drawImage(spr, x + spr.x0, y + spr.y0, spr.w, spr.h); }
// dört uçlu pırıltı + hale; yumuşak ışık bulutçuğu; kalp; yıldız
function kb8Isilti() {
  return kb8Tuval('isilti', 4, -12, -12, 24, 24, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 12); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.3, 'rgba(255,246,222,.42)'); gr.addColorStop(1, 'rgba(255,240,215,0)');
    q.fillStyle = gr; q.fillRect(-12, -12, 24, 24);
    q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(0, -10.5); q.quadraticCurveTo(1, -1, 10.5, 0); q.quadraticCurveTo(1, 1, 0, 10.5); q.quadraticCurveTo(-1, 1, -10.5, 0); q.quadraticCurveTo(-1, -1, 0, -10.5); q.fill();
  });
}
function kb8Puf() {
  return kb8Tuval('puf', 2, -16, -16, 32, 32, q => {
    const gr = q.createRadialGradient(0, 0, 0, 0, 0, 16); gr.addColorStop(0, 'rgba(255,250,255,.9)'); gr.addColorStop(.45, 'rgba(246,238,255,.45)'); gr.addColorStop(1, 'rgba(240,230,255,0)');
    q.fillStyle = gr; q.fillRect(-16, -16, 32, 32);
  });
}
function kb8KalpYol(q, x, y, r) {   // (x, y) merkez, r yarı genişlik
  q.beginPath(); q.moveTo(x, y + r * .95);
  q.bezierCurveTo(x - r * 1.35, y + r * .05, x - r * .95, y - r * 1.1, x, y - r * .42);
  q.bezierCurveTo(x + r * .95, y - r * 1.1, x + r * 1.35, y + r * .05, x, y + r * .95); q.closePath();
}
function kb8YildizYol(q, x, y, r, ic, n, a0) {
  n = n || 5; a0 = a0 == null ? -Math.PI / 2 : a0; q.beginPath();
  for (let i = 0; i < n * 2; i++) { const rr = i % 2 ? r * ic : r, a = a0 + i * Math.PI / n, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i) q.lineTo(px, py); else q.moveTo(px, py); }
  q.closePath();
}
function kb8KalpSpr(renk) {   // süzülen minik kalp (öpücük, kalp gözlü kabak, mırlayan kedi)
  return kb8Tuval('kalp' + renk, 4, -8, -8, 16, 16, q => {
    kb8KalpYol(q, 0, 0, 6); q.fillStyle = renk; q.fill(); q.strokeStyle = 'rgba(190,60,120,.55)'; q.lineWidth = .9; q.stroke();
    q.fillStyle = 'rgba(255,255,255,.75)'; q.beginPath(); q.ellipse(-2.6, -2.4, 1.6, 1, -.6, 0, KB8_PI2); q.fill();
  });
}
function kb8Z(c, x, y, r) { c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x + r, y - r); c.lineTo(x - r, y + r); c.lineTo(x + r, y + r); c.stroke(); }
function kb8ZCiz(c, x, y, r, a) {   // uykucu "z": koyu kenarlı beyaz
  if (a <= .01) return; const ga = c.globalAlpha; c.globalAlpha = ga * a;
  c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = 'rgba(110,90,190,.9)'; c.lineWidth = 2.4; kb8Z(c, x, y, r); c.strokeStyle = '#ffffff'; c.lineWidth = 1.2; kb8Z(c, x, y, r);
  c.globalAlpha = ga;
}
// Zemin yardımcıları (geyik.js gyZemin/gyZeminTam ile aynı mantık; Bölüm 8'de geyik.js yok)
function kb8Zemin(x, yRef, ust) {
  if (typeof cell !== 'function' || typeof ROWS === 'undefined') return null;
  const tx = Math.floor(x / T), r0 = Math.max(0, Math.floor((yRef - (ust == null ? 2.4 * T : ust)) / T)), r1 = Math.min(ROWS - 1, Math.floor((yRef + 7 * T) / T));
  for (let r = r0; r <= r1; r++) {
    const k = cell(tx, r);
    if (k === 1 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;
    if (k === 2 && r * T >= yRef - 4 && (r === 0 || cell(tx, r - 1) !== 1)) return r * T;
  }
  return null;
}
function kb8ZeminTam(x, y) {
  if (typeof cell !== 'function' || typeof ROWS === 'undefined') return null;
  const tx = Math.floor(x / T);
  for (let r = Math.max(0, Math.floor((y - 6) / T)); r < ROWS && r * T < y + 7 * T; r++) { const k = cell(tx, r); if ((k === 1 || k === 2) && (r === 0 || cell(tx, r - 1) !== 1)) return r * T; }
  return null;
}
// Final saati (cadiMeydan): 120 BPM → vuruş 0,5 sn, ölçü 2 sn; 35 sn, doruk 28. sn
const KB8_FIN = { SURE: 35, DORUK: 28, VUR: .5 };
function cadiFinalAn() { const o = KB8.meydan; return o && o.basla ? o.age : 0; }
function cadiFinalNabiz() { const o = KB8.meydan; if (!o || !o.basla) return 0; const u = (o.age % KB8_FIN.VUR) / KB8_FIN.VUR; return Math.pow(1 - u, 3); }
function cadiFinalKutu() { const o = KB8.meydan; return o ? o.box : null; }
const kb8FinalNabiz = cadiFinalNabiz;
// Fenerlerin büyü renkleri (sıra ile): altın, şeker pembesi, nane, lila, limon, kabak, gök, şeftali, su, gül, fıstık, lavanta
const KB8_RENK = ['#ffd27a', '#ff8fc8', '#7dffc4', '#c39bff', '#e8ff8a', '#ffb347', '#8fd8ff', '#ffb59a', '#6fe8ff', '#ffa6c9', '#b8ff9e', '#e0a8ff'];
const KB8_SEKER = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffb347', '#ffd27a', '#8fd8ff'];   // şeker renkleri (fişek, konfeti)

// ═══════════════════════════════ BALKABAĞI ÇİZİCİ ═══════════════════════════════
// kabakCiz(c, x, y, s, t, o) — (x, y) tabanın ortası; s = 1'de yuvarlak kabak ≈ 56 birim en, 44 boy (+ sap ≈ 12).
// o = { yuz 0..11 (-1 yüzsüz), yanik 0..1 (sönük gri-mor → ışıklı turuncu), mutlu 0..1 (gözler sevinçle kısılır, yanaklar
//       pembeleşir), kirp 0..1 (göz kapanması; verilmezse kendisi kırpar), ziplama -1..1 (- basılma, + uzama), bak -1..1 (göz
//       bebekleri yana), bakY -1..1, agiz 0..1 (ağız açılır/kahkaha), dil -1..1 (dil salınımı), sap (sap açısı, rad), sekil 0..2
//       (yuvarlak|basık|uzun), ton 0..4 (turuncu|altın|şeftali|krem|doğal), aks ''|'fiyonk'|'sapka'|'takke'|'cicek', isik (varsayılan
//       true: içten parıltı), yayil 0..1 (verilirse ışık yüzün ortasından bu oranda yayılmış; yanma anı), sas 0..1 (yüz 4: "o"
//       ağız), alfa }
// Gövde/sap/süs önbellekten; yüz (oyulmuş delikler, göz bebekleri, parıltılar, yanaklar) her karede birkaç kısa yolla çizilir.
const KB8_TON = [
  { a: '#ff9a3c', ac: '#ffbd6e', k: '#e2702c', cz: '#9c4419' },   // 0 turuncu
  { a: '#ffb238', ac: '#ffd270', k: '#ec8c20', cz: '#9c5c16' },   // 1 altın
  { a: '#ff9a72', ac: '#ffc09e', k: '#e87452', cz: '#9c4636' },   // 2 şeftali
  { a: '#fde6cc', ac: '#fffaf0', k: '#efcca8', cz: '#a6846a' },   // 3 krem (beyaz kabak)
  { a: '#e0843e', ac: '#f2a666', k: '#b8643a', cz: '#6e3424' },   // 4 doğal (süs kabakları; ay ışığında)
];
const KB8_SONUK = { a: '#7b6c9c', ac: '#988abb', k: '#625681', cz: '#3b3157' };
const KB8_SAP = { a: '#73993f', k: '#4d6a2a', ac: '#9cc45e' }, KB8_SAP_S = { a: '#626e60', k: '#434c45', ac: '#808b7d' };
const KB8_SEKIL = [{ w: 28, h: 44 }, { w: 31.5, h: 38 }, { w: 24.5, h: 50 }];   // yarı genişlik, boy
function kb8DilimYol(q, w, h, hepsi) {   // beş dilimin birleşimi (gölgeleme kırpması için)
  const cy = -h / 2; q.beginPath();
  for (const [x, rx, ry] of [[-.62, .4, .45], [.62, .4, .45], [-.3, .42, .49], [.3, .42, .49], [0, .36, .5]]) { q.moveTo(x * w + rx * w, cy); q.ellipse(x * w, cy, rx * w, ry * h, 0, 0, KB8_PI2); }
}
function kb8GovdeSpr(sk, ton, K) {   // ton -1: sönük
  const S0 = KB8_SEKIL[sk] || KB8_SEKIL[0], w = S0.w, h = S0.h, p = ton < 0 ? KB8_SONUK : KB8_TON[ton] || KB8_TON[0], isikli = ton >= 0 && ton < 4;
  return kb8Tuval('kg' + sk + '_' + ton, K, -w - 3, -h - 3, w * 2 + 6, h + 6, q => {
    const cy = -h / 2;
    const dilim = (x, rx, ry, renk) => { q.beginPath(); q.ellipse(x * w, cy, rx * w, ry * h, 0, 0, KB8_PI2); q.fillStyle = renk; q.fill(); q.strokeStyle = p.cz; q.lineWidth = 1.4; q.stroke(); };
    dilim(-.62, .4, .45, p.k); dilim(.62, .4, .45, p.k);
    dilim(-.3, .42, .49, p.a); dilim(.3, .42, .49, p.a);
    dilim(0, .36, .5, p.a);
    // gölgeleme: sol üstten ay ışığı / içten fener ışığı, sağ altta yumuşak gölge
    q.save(); kb8DilimYol(q, w, h); q.clip();
    let gr = q.createRadialGradient(-w * .4, cy - h * .32, 1, -w * .4, cy - h * .32, w * 1.1); gr.addColorStop(0, isikli ? 'rgba(255,250,220,.32)' : 'rgba(205,190,245,.34)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    q.fillStyle = gr; q.fillRect(-w - 3, -h - 3, w * 2 + 6, h + 6);
    gr = q.createRadialGradient(w * .35, cy + h * .45, 1, w * .35, cy + h * .45, w * 1.25); gr.addColorStop(0, isikli ? 'rgba(120,30,40,.26)' : 'rgba(30,20,60,.34)'); gr.addColorStop(1, 'rgba(30,20,60,0)');
    q.fillStyle = gr; q.fillRect(-w - 3, -h - 3, w * 2 + 6, h + 6);
    if (isikli) {   // içteki sihirli ışık kabuktan sızar: yüzün çevresi sıcak sarı
      gr = q.createRadialGradient(0, cy + 2, 1, 0, cy + 2, w * .95); gr.addColorStop(0, 'rgba(255,238,170,.5)'); gr.addColorStop(.6, 'rgba(255,214,130,.16)'); gr.addColorStop(1, 'rgba(255,200,120,0)');
      q.fillStyle = gr; q.fillRect(-w - 3, -h - 3, w * 2 + 6, h + 6);
    }
    q.restore();
    // parlak benekler (dilim kabartıları)
    q.fillStyle = isikli ? 'rgba(255,255,240,.42)' : 'rgba(225,215,255,.3)';
    q.beginPath(); q.ellipse(-w * .12, cy - h * .3, w * .09, h * .11, -.25, 0, KB8_PI2); q.fill();
    q.beginPath(); q.ellipse(-w * .5, cy - h * .2, w * .06, h * .1, -.3, 0, KB8_PI2); q.fill();
    q.fillStyle = isikli ? 'rgba(255,255,240,.22)' : 'rgba(225,215,255,.16)';
    q.beginPath(); q.ellipse(w * .3, cy - h * .3, w * .07, h * .08, -.2, 0, KB8_PI2); q.fill();
    // sapın girdiği çukur
    q.fillStyle = p.cz; q.globalAlpha = .35; q.beginPath(); q.ellipse(0, -h + 2.6, w * .2, 2.2, 0, 0, KB8_PI2); q.fill(); q.globalAlpha = 1;
  });
}
function kb8SapSpr(sonuk, K) {   // kök (0, 0); kıvrık sap + yaprak + sarmaşık bıyığı
  const p = sonuk ? KB8_SAP_S : KB8_SAP;
  return kb8Tuval('sap' + (sonuk ? 1 : 0), K, -20, -16, 36, 21, q => {
    // sarmaşık bıyığı (kıvrım kıvrım)
    q.strokeStyle = p.ac; q.lineWidth = 1.2; q.beginPath();
    for (let i = 0; i <= 26; i++) { const u = i / 26, a = u * 9.5, r = 5.4 * (1 - u * .7), px = 4 + u * 7 + Math.cos(a) * r * .8, py = -1 - u * 4 + Math.sin(a) * r * .8; if (i) q.lineTo(px, py); else q.moveTo(2.5, 1); }
    q.stroke();
    // yaprak
    q.fillStyle = p.a; q.strokeStyle = p.k; q.lineWidth = 1;
    q.beginPath(); q.moveTo(-2, -2); q.quadraticCurveTo(-9, -13, -18, -7); q.quadraticCurveTo(-11, -.5, -2, -2); q.closePath(); q.fill(); q.stroke();
    q.strokeStyle = p.ac; q.lineWidth = .8; q.beginPath(); q.moveTo(-3, -2.4); q.quadraticCurveTo(-10, -6.5, -15.5, -6.8); q.stroke();
    // sap
    q.fillStyle = p.a; q.strokeStyle = p.k; q.lineWidth = 1.2;
    q.beginPath(); q.moveTo(-3.6, 1.5); q.quadraticCurveTo(-4.4, -7, .4, -12.8); q.lineTo(5.2, -10.9); q.quadraticCurveTo(1.6, -6, 3.7, 1.5); q.closePath(); q.fill(); q.stroke();
    q.strokeStyle = p.ac; q.lineWidth = 1; q.beginPath(); q.moveTo(-1.6, .5); q.quadraticCurveTo(-2, -6, 1.4, -10.8); q.stroke();
    q.fillStyle = p.ac; q.beginPath(); q.ellipse(2.8, -11.9, 2.6, 1.3, .4, 0, KB8_PI2); q.fill(); q.strokeStyle = p.k; q.lineWidth = .8; q.stroke();
  });
}
function kb8AksSpr(ad, K) {   // süsler: kök (0, 0) = kabağın tepesi
  return kb8Tuval('aks' + ad, K, -26, -40, 52, 46, q => {
    if (ad === 'fiyonk') {   // pembe fiyonk (sol üstte)
      q.save(); q.translate(-9, -2); q.rotate(-.3);
      q.fillStyle = '#ff8fc8'; q.strokeStyle = '#c9579a'; q.lineWidth = 1;
      for (const k of [-1, 1]) { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(k * 4, -7, k * 12, -6, k * 11, 0); q.bezierCurveTo(k * 12, 6, k * 4, 7, 0, 0); q.fill(); q.stroke(); }
      q.fillStyle = '#ffd0e8'; for (const k of [-1, 1]) { q.beginPath(); q.ellipse(k * 6.5, -1.8, 2.6, 1.3, k * .3, 0, KB8_PI2); q.fill(); }
      q.fillStyle = '#ff6fb4'; q.beginPath(); q.ellipse(0, 0, 2.8, 3.2, 0, 0, KB8_PI2); q.fill(); q.stroke();
      q.restore();
    } else if (ad === 'sapka') {   // minik cadı şapkası (yıldızlı, ucu kıvrık)
      q.save(); q.translate(1, 1); q.rotate(.12);
      q.fillStyle = '#6a42b8'; q.strokeStyle = '#3a2370'; q.lineWidth = 1.2;
      q.beginPath(); q.ellipse(0, -2, 17, 4.6, 0, 0, KB8_PI2); q.fill(); q.stroke();
      q.beginPath(); q.moveTo(-10, -3); q.quadraticCurveTo(-6, -18, 1, -28); q.quadraticCurveTo(6, -34, 13, -31); q.quadraticCurveTo(7, -29, 5, -22); q.quadraticCurveTo(8, -12, 10, -3); q.closePath(); q.fill(); q.stroke();
      q.fillStyle = '#ffb347'; q.beginPath(); q.moveTo(-10, -3.5); q.quadraticCurveTo(0, -1, 10, -3.5); q.lineTo(9.2, -7.5); q.quadraticCurveTo(0, -5, -9.2, -7.5); q.closePath(); q.fill();
      q.fillStyle = '#ffe27a'; kb8YildizYol(q, -1, -15, 3.6, .45); q.fill();
      q.fillStyle = 'rgba(255,255,255,.25)'; q.beginPath(); q.moveTo(-7, -7); q.quadraticCurveTo(-4, -17, 0, -24); q.lineTo(-2, -12); q.closePath(); q.fill();
      q.restore();
    } else if (ad === 'takke') {   // çizgili uyku takkesi (ponponlu, yana sarkık)
      q.save(); q.translate(0, 1);
      const yol = () => { q.beginPath(); q.moveTo(-15, -2); q.quadraticCurveTo(-12, -16, 2, -18); q.quadraticCurveTo(14, -19, 19, -8); q.quadraticCurveTo(21, -2, 18, 3); q.quadraticCurveTo(14, -9, 6, -9); q.quadraticCurveTo(10, -6, 15, -2); q.closePath(); };
      yol(); q.fillStyle = '#c9b6ff'; q.fill();
      q.save(); yol(); q.clip(); q.fillStyle = '#fff3d8'; for (let i = -3; i < 6; i++) { q.beginPath(); q.moveTo(i * 7 - 4, 0); q.lineTo(i * 7 + 8, -22); q.lineTo(i * 7 + 11, -22); q.lineTo(i * 7 - 1, 0); q.closePath(); q.fill(); } q.restore();
      q.strokeStyle = '#6f5aa8'; q.lineWidth = 1.1; yol(); q.stroke();
      q.fillStyle = '#fff3d8'; q.beginPath(); q.ellipse(0, -1, 16, 3.4, 0, 0, KB8_PI2); q.fill(); q.stroke();
      q.fillStyle = '#ffffff'; q.beginPath(); q.arc(18.6, 4.5, 3.6, 0, KB8_PI2); q.fill(); q.stroke();
      q.restore();
    } else if (ad === 'cicek') {   // sapın yanında minik çiçek
      q.save(); q.translate(-8, -3);
      q.fillStyle = '#ffc6e2'; q.strokeStyle = '#d97aaa'; q.lineWidth = .8;
      for (let i = 0; i < 5; i++) { const a = i / 5 * KB8_PI2 - Math.PI / 2; q.beginPath(); q.ellipse(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 2.9, 2.1, a, 0, KB8_PI2); q.fill(); q.stroke(); }
      q.fillStyle = '#ffe27a'; q.beginPath(); q.arc(0, 0, 2.1, 0, KB8_PI2); q.fill();
      q.restore();
    }
  });
}
// Oyulmuş deliklerin rengi: sönükken koyu mor, yandıkça altın; çekirdek daha açık (11 basamak, önceden hazır)
const KB8_OY = [], KB8_OYI = [];
for (let i = 0; i <= 10; i++) { KB8_OY.push(mixc('#2a2140', '#ffc04f', i / 10)); KB8_OYI.push(mixc('#2a2140', '#fff4c4', i / 10)); }
const KB8_KENAR = 'rgba(150,62,22,.6)', KB8_KENAR_S = 'rgba(22,16,38,.6)', KB8_BEBEK = '#4a2234', KB8_DIL = '#ff86ad', KB8_DIL_K = '#c9587c';
// Yüzler: [sol göz, sağ göz, ağız, kaş (0 yok, 1 iki kaş havada, 2 muzip: biri havada)]
const KB8_YUZ = [
  ['acik', 'acik', 'gulus', 0],        // 0 gülen
  ['acik', 'mutlu', 'yamuk', 0],       // 1 göz kırpan
  ['acik', 'acik', 'dil', 0],          // 2 dil çıkaran
  ['mutlu', 'mutlu', 'genis', 0],      // 3 kahkaha atan
  ['buyuk', 'buyuk', 'sas', 1],        // 4 şaşırıp sevinen ("o" → kocaman gülüş)
  ['kapali', 'kapali', 'opucuk', 0],   // 5 öpücük
  ['kapali', 'kapali', 'kucuk', 0],    // 6 uykulu gülümseyen (o.uyan > .5: mahmur yarım gözle bakar)
  ['acik', 'acik', 'yamukDil', 2],     // 7 muzip
  ['yildiz', 'yildiz', 'genis', 0],    // 8 yıldız gözlü
  ['kalp', 'kalp', 'gulus', 0],        // 9 kalp gözlü
  ['mutlu', 'mutlu', 'kocaman', 1],    // 10 neşeli
  ['acik', 'acik', 'kucuk', 0],        // 11 utangaç
];
const KB8_AKS = ['', 'fiyonk', '', '', 'sapka', '', 'takke', '', '', 'fiyonk', '', 'cicek'];
// Göz: (x, y) yüz koordinatı; ac açıklık; bx/by bakış; yk ışık basamağı (0..10); sg = -1 sol göz / 1 sağ göz
function kb8Goz(c, x, y, tip, ac, bx, by, yk, t, sg) {
  const dolgu = KB8_OY[yk], cek = KB8_OYI[yk], ken = yk > 4 ? KB8_KENAR : KB8_KENAR_S, ga = c.globalAlpha;
  if (tip === 'mutlu' || tip === 'kapali' || ac < .22) {   // kapalı göz: ışıklı kavis (mutlu ^, uyku ∪)
    const yuk = tip === 'mutlu' || (tip !== 'kapali' && ac >= .1 && false);
    c.beginPath();
    if (yuk) { c.moveTo(x - 5.4, y + 1.8); c.quadraticCurveTo(x, y - 5.8, x + 5.4, y + 1.8); }
    else { c.moveTo(x - 5.4, y - .6); c.quadraticCurveTo(x, y + 4.6, x + 5.4, y - .6); }
    c.lineWidth = 4.4; c.strokeStyle = ken; c.stroke(); c.lineWidth = 3; c.strokeStyle = dolgu; c.stroke();
    if (yk > 4) { c.lineWidth = 1.1; c.strokeStyle = cek; c.stroke(); }
    if (!yuk && tip === 'kapali' && yk > 4) { c.lineWidth = 1.6; c.strokeStyle = dolgu; c.beginPath(); c.moveTo(x + sg * 4.6, y + .9); c.lineTo(x + sg * 6.8, y + 2.6); c.moveTo(x + sg * 2.2, y + 2.4); c.lineTo(x + sg * 3.4, y + 4.6); c.stroke(); }
    return;
  }
  if (tip === 'yildiz') {   // yıldız göz: parlayan yıldız deliği, dönüp kırpışır
    const r = 7.2 * (.92 + .08 * Math.sin(t * 5 + sg)), a0 = -Math.PI / 2 + Math.sin(t * 1.7 + sg) * .15;
    c.lineWidth = 2.4; c.strokeStyle = ken; kb8YildizYol(c, x, y, r, .5, 5, a0); c.stroke(); c.fillStyle = dolgu; c.fill();
    c.lineWidth = 1.4; c.strokeStyle = dolgu; c.stroke();
    if (yk > 3) { c.fillStyle = cek; kb8YildizYol(c, x - .4, y - .4, r * .55, .5, 5, a0); c.fill(); }
    if (yk >= 6) { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x - 1.6, y - 1.8, 1.4, 0, KB8_PI2); c.fill(); }
    return;
  }
  if (tip === 'kalp') {   // kalp göz: atan kalp (iki vuruş)
    const ph = (t * 1.3 + sg * .02) % 1, at = ph < .12 ? Math.sin(ph / .12 * Math.PI) : ph > .2 && ph < .32 ? Math.sin((ph - .2) / .12 * Math.PI) * .7 : 0, r = 6.6 * (1 + at * .14);
    c.lineWidth = 2.2; c.strokeStyle = ken; kb8KalpYol(c, x, y + .5, r); c.stroke(); c.fillStyle = dolgu; c.fill();
    if (yk > 3) { c.fillStyle = yk >= 6 ? '#ffb0cf' : cek; kb8KalpYol(c, x - .3, y + .2, r * .62); c.fill(); }
    if (yk >= 6) { c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(x - 2.4, y - 1.6, 1.5, 1, -.6, 0, KB8_PI2); c.fill(); }
    return;
  }
  const buy = tip === 'buyuk', rx = buy ? 7.2 : 6.3, ry0 = buy ? 8.6 : 7.5, ry = ry0 * clamp(ac, 0, 1);
  if (tip === 'yari') {   // uykulu: ağır göz kapağı (dış köşesi sarkık), altta yarım göz + kirpikler
    const yy = y - .6, dL = sg < 0 ? 1.4 : -.9, dR = sg < 0 ? -.9 : 1.4, ryy = ry0 * .62;
    const kapak = () => { c.moveTo(x - rx, yy + dL); c.quadraticCurveTo(x, yy - 1.8, x + rx, yy + dR); };
    c.beginPath(); kapak(); c.ellipse(x, yy, rx, ryy, 0, 0, Math.PI); c.closePath();
    c.lineWidth = 2; c.strokeStyle = ken; c.stroke(); c.fillStyle = dolgu; c.fill();
    if (yk >= 5) {
      c.globalAlpha = ga * clamp((yk - 4) / 4, 0, 1);
      c.save(); c.beginPath(); kapak(); c.ellipse(x, yy, rx, ryy, 0, 0, Math.PI); c.closePath(); c.clip();
      c.fillStyle = KB8_BEBEK; c.beginPath(); c.ellipse(x + bx * 1.5, yy + 1.4, rx * .56, ryy * .9, 0, 0, KB8_PI2); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x + bx * 1.5 - 1.5, yy + 1.2, 1.25, 0, KB8_PI2); c.fill();
      c.restore(); c.globalAlpha = ga;
    }
    c.lineWidth = 1.8; c.strokeStyle = dolgu; c.beginPath(); kapak(); c.stroke();
    const ox = x + sg * rx, oy = yy + (sg < 0 ? dL : dR);   // dış köşede iki minik kirpik
    c.lineWidth = 1.5; c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + sg * 2.2, oy + 1.6); c.moveTo(ox - sg * 1.6, oy + .9); c.lineTo(ox - sg * .6, oy + 3); c.stroke();
    return;
  }
  c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, KB8_PI2); c.lineWidth = 2.2; c.strokeStyle = ken; c.stroke(); c.fillStyle = dolgu; c.fill();
  if (yk > 3) { c.fillStyle = cek; c.beginPath(); c.ellipse(x - rx * .16, y - ry * .2, rx * .64, ry * .6, 0, 0, KB8_PI2); c.fill(); }
  if (yk >= 5 && ac > .3) {   // canlı göz bebeği + iki parıltı (ışık geldikçe belirir)
    c.globalAlpha = ga * clamp((yk - 4) / 4, 0, 1);
    const pr = buy ? .5 : .64, px = x + clamp(bx, -1, 1) * rx * .28, py = y + ry * (buy ? -.05 : .1) + clamp(by, -1, 1) * ry * .2;
    c.fillStyle = KB8_BEBEK; c.beginPath(); c.ellipse(px, py, rx * pr, ry * (pr + .06), 0, 0, KB8_PI2); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px - rx * pr * .38, py - ry * pr * .42, rx * pr * .36, 0, KB8_PI2); c.fill();
    c.beginPath(); c.arc(px + rx * pr * .34, py + ry * pr * .38, rx * pr * .16, 0, KB8_PI2); c.fill();
    c.globalAlpha = ga;
  }
}
function kb8DelikDoldur(c, yk) {   // geçerli yolu oyulmuş delik gibi doldur (kenar + dolgu)
  c.lineWidth = 2.2; c.strokeStyle = yk > 4 ? KB8_KENAR : KB8_KENAR_S; c.stroke(); c.fillStyle = KB8_OY[yk]; c.fill();
}
function kb8DilCiz(c, x, y, r, sal) {   // dışarı çıkmış pembe dil: kök (x, y), aşağı sarkar
  c.save(); c.translate(x, y); c.rotate(sal * .28);
  c.beginPath(); c.moveTo(-r, -1); c.lineTo(-r, r * .9); c.arc(0, r * .9, r, Math.PI, 0, true); c.lineTo(r, -1); c.closePath();
  c.fillStyle = KB8_DIL; c.fill(); c.strokeStyle = KB8_DIL_K; c.lineWidth = .9; c.stroke();
  c.strokeStyle = 'rgba(200,80,120,.6)'; c.lineWidth = .8; c.beginPath(); c.moveTo(0, .5); c.lineTo(0, r * 1.2); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-r * .45, r * .55, r * .25, r * .4, 0, 0, KB8_PI2); c.fill();
  c.restore();
}
function kb8Agiz(c, tip, yk, ac, o, t) {
  const cek = KB8_OYI[yk];
  if (tip === 'sas') tip = (o && o.sas > .5) ? 'o' : 'kocaman';
  if (tip === 'gulus') {
    const d = 18 + ac * 3.5;
    c.beginPath(); c.moveTo(-9.6, 5.4); c.quadraticCurveTo(0, d, 9.6, 5.4); c.quadraticCurveTo(0, 11, -9.6, 5.4); kb8DelikDoldur(c, yk);
    if (yk > 3) { c.fillStyle = cek; c.beginPath(); c.moveTo(-6, 8.6); c.quadraticCurveTo(0, d - 3.2, 6, 8.6); c.quadraticCurveTo(0, 11.4, -6, 8.6); c.fill(); }
  } else if (tip === 'genis' || tip === 'kocaman') {   // açık kahkaha ağzı (D), içinde pembe dil
    const kc = tip === 'kocaman', w = kc ? 11.4 : 9.8, ust = kc ? 3.6 : 5, d = (kc ? 16 : 14.5) + ac * 5.5;
    const yol = () => { c.beginPath(); c.moveTo(-w, ust); c.quadraticCurveTo(0, ust + (kc ? 4.5 : 2.6), w, ust); c.bezierCurveTo(w - .5, ust + (d - ust) * .7, w * .42, d, 0, d); c.bezierCurveTo(-w * .42, d, -w + .5, ust + (d - ust) * .7, -w, ust); c.closePath(); };
    yol(); kb8DelikDoldur(c, yk);
    if (yk > 3) {
      c.save(); yol(); c.clip();
      c.fillStyle = cek; c.beginPath(); c.ellipse(0, ust + 2.6, w * .75, 3.2, 0, 0, KB8_PI2); c.fill();
      if (yk >= 5) { c.fillStyle = KB8_DIL; c.beginPath(); c.ellipse(0, d - 1.2, w * .48, 3.4 + ac, 0, 0, KB8_PI2); c.fill(); c.strokeStyle = 'rgba(200,80,120,.5)'; c.lineWidth = .7; c.beginPath(); c.moveTo(0, d - 3.4); c.lineTo(0, d - .6); c.stroke(); }
      c.restore();
    }
  } else if (tip === 'dil') {
    c.beginPath(); c.moveTo(-7.4, 6.6); c.quadraticCurveTo(0, 15.6, 7.4, 6.6); c.quadraticCurveTo(0, 11, -7.4, 6.6); kb8DelikDoldur(c, yk);
    if (yk > 3) { c.fillStyle = cek; c.beginPath(); c.moveTo(-4.4, 9); c.quadraticCurveTo(0, 13, 4.4, 9); c.quadraticCurveTo(0, 11, -4.4, 9); c.fill(); }
    if (yk >= 4) kb8DilCiz(c, .6, 10.4, 3.4, o && Number.isFinite(o.dil) ? o.dil : Math.sin(t * 3));
  } else if (tip === 'yamuk' || tip === 'yamukDil') {   // yan gülüş (sağ köşe yukarıda)
    c.beginPath(); c.moveTo(-8.4, 8.4); c.quadraticCurveTo(1.5, 16 + ac * 2, 10, 4.2); c.quadraticCurveTo(2.4, 11, -8.4, 8.4); kb8DelikDoldur(c, yk);
    if (yk > 3) { c.fillStyle = cek; c.beginPath(); c.moveTo(-4.6, 10); c.quadraticCurveTo(2, 13.6, 7, 7.2); c.quadraticCurveTo(2, 11.4, -4.6, 10); c.fill(); }
    if (tip === 'yamukDil' && yk >= 4) kb8DilCiz(c, 5.2, 10.2, 2.7, o && Number.isFinite(o.dil) ? o.dil : Math.sin(t * 2.2) * .6);
  } else if (tip === 'kucuk') {
    c.beginPath(); c.moveTo(-5.8, 8); c.quadraticCurveTo(0, 13.6 + ac * 2, 5.8, 8); c.quadraticCurveTo(0, 10.6, -5.8, 8); kb8DelikDoldur(c, yk);
  } else if (tip === 'o') {
    const rx = 3.4 + ac * 1.4, ry = 4.4 + ac * 1.8;
    c.beginPath(); c.ellipse(0, 10, rx, ry, 0, 0, KB8_PI2); kb8DelikDoldur(c, yk);
    if (yk > 3) { c.fillStyle = cek; c.beginPath(); c.ellipse(-.5, 9, rx * .55, ry * .5, 0, 0, KB8_PI2); c.fill(); }
  } else if (tip === 'opucuk') {   // öpücük dudağı: minik pembe kalp
    kb8KalpYol(c, 1.4, 9.6, 3.6 + ac * .8); c.lineWidth = 2.2; c.strokeStyle = yk > 4 ? KB8_KENAR : KB8_KENAR_S; c.stroke();
    c.fillStyle = yk >= 5 ? '#ff7fae' : KB8_OY[yk]; c.fill();
    if (yk >= 5) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(.2, 8.4, 1.2, .7, -.5, 0, KB8_PI2); c.fill(); }
  }
}
function kb8Kas(c, x, y, yuk, yk, egim) {
  c.beginPath(); c.moveTo(x - 4.2, y + 1.2 - egim); c.quadraticCurveTo(x, y - 2.4 - yuk, x + 4.2, y + 1.2 + egim);
  c.lineWidth = 3.2; c.strokeStyle = yk > 4 ? KB8_KENAR : KB8_KENAR_S; c.stroke(); c.lineWidth = 2; c.strokeStyle = KB8_OY[yk]; c.stroke();
}
const KB8_KO = {};   // varsayılan seçenekler (o verilmezse)
function kabakCiz(c, x, y, s, t, o) {
  o = o || KB8_KO; s = s || 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const K = kb8K(c, s), sk = o.sekil | 0, S0 = KB8_SEKIL[sk] || KB8_SEKIL[0], w = S0.w, h = S0.h;
  const yuz = o.yuz == null ? 0 : o.yuz | 0, ton = o.ton == null ? 0 : clamp(o.ton | 0, 0, 4), yan = clamp(o.yanik == null ? 1 : +o.yanik || 0, 0, 1);
  const z = clamp(+o.ziplama || 0, -1, 1), sx = 1 - z * .13, sy = 1 + z * .15, mut = clamp(+o.mutlu || 0, 0, 1);
  c.save(); if (o.alfa != null) c.globalAlpha *= clamp(o.alfa, 0, 1);
  c.translate(x, y); c.scale(s * sx, s * sy);
  // sap (gövdenin arkasında; tepedeki çukurdan çıkar) — şapka/takke varsa onun altında kalır
  const aks = o.aks || '', sapGiz = aks === 'sapka' || aks === 'takke';
  if (!sapGiz) {
    c.save(); c.translate(0, -h + 3); c.rotate(+o.sap || 0);
    if (yan < 1) kb8Koy(c, kb8SapSpr(true, K), 0, 0);
    if (yan > 0) { const ga = c.globalAlpha; c.globalAlpha = ga * yan; kb8Koy(c, kb8SapSpr(false, K), 0, 0); c.globalAlpha = ga; }
    c.restore();
  }
  // gövde: sönük → ışıklı (yayil verilirse ışık yüzün ortasından halka gibi yayılır)
  const yay = o.yayil;
  if (ton === 4) kb8Koy(c, kb8GovdeSpr(sk, 4, K), 0, 0);   // doğal süs kabağı: sönük/ışıklı ayrımı yok
  else if (yan < 1 || (yay != null && yay < 1)) kb8Koy(c, kb8GovdeSpr(sk, -1, K), 0, 0);
  if (ton === 4) { /* çizildi */ }
  else if (yay != null && yay < 1) {
    if (yay > 0) { c.save(); c.beginPath(); c.arc(0, -h * .5, Math.max(.1, yay * (w + h) * .75), 0, KB8_PI2); c.clip(); kb8Koy(c, kb8GovdeSpr(sk, ton, K), 0, 0); c.restore(); }
  } else if (yan > 0) { const ga = c.globalAlpha; c.globalAlpha = ga * yan; kb8Koy(c, kb8GovdeSpr(sk, ton, K), 0, 0); c.globalAlpha = ga; }
  // içten ışık (kabuğun altından parlar)
  const isik = o.isik !== false && ton !== 4 && yan > 0;
  if (isik) { c.globalCompositeOperation = 'lighter'; kb8Isik(c, '#ffb347', 0, -h * .48, w * 1.25, .32 * yan); c.globalCompositeOperation = 'source-over'; }
  // yüz
  if (yuz >= 0) {
    const Y = KB8_YUZ[yuz % KB8_YUZ.length], yk = Math.round(yan * 10);
    const fx = clamp(w / 28, .88, 1.1), fy = clamp(h / 44, .88, 1.08);
    c.save(); c.translate(0, -h * .5 + (sk === 2 ? 2 : 0)); c.scale(fx, fy);
    // yanaklar (ışıklıyken pembe)
    if (yan > .4) {
      const yb = yuz === 11 ? 1.6 : yuz === 5 || yuz === 9 ? 1.3 : 1, ya = (.32 + .3 * mut) * yb * (yan - .4) / .6;
      c.fillStyle = '#ff7fb0'; const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(.85, ya);
      c.beginPath(); c.ellipse(-15.6, 5.6, 4.4 * (yuz === 11 ? 1.2 : 1), 2.7, 0, 0, KB8_PI2); c.ellipse(15.6, 5.6, 4.4 * (yuz === 11 ? 1.2 : 1), 2.7, 0, 0, KB8_PI2); c.fill();
      if (yuz === 11 && yan > .6) {   // utangaç: yanaklarda kızarma çizgileri
        c.globalAlpha = ga * Math.min(1, ya * 1.3); c.strokeStyle = '#ff5f9e'; c.lineWidth = 1;
        c.beginPath(); for (const sx of [-1, 1]) for (let j = -1; j <= 1; j++) { const cx = sx * 15.6 + j * 2.4; c.moveTo(cx - .8, 7.2); c.lineTo(cx + .8, 4.2); } c.stroke();
      }
      c.globalAlpha = ga;
    }
    const yukGoz = o.uyku != null ? o.uyku > .5 : yan < .3;   // sönükken gözler kapalı (uyku)
    let kirp = o.kirp; if (kirp == null) { const kf = t * 1.05 + x * .013; kirp = Math.pow(Math.max(0, Math.sin(kf)), 90); }
    const ac = clamp(1 - kirp, 0, 1), bx = clamp(+o.bak || 0, -1, 1), by = clamp(+o.bakY || 0, -1, 1);
    for (let k = 0; k < 2; k++) {
      let tip = Y[k];
      if (yukGoz) tip = 'kapali';
      else if (yuz === 6 && o.uyan > .5 && ac > .3) tip = 'yari';
      else if (mut > .7 && tip !== 'yildiz' && tip !== 'kalp' && tip !== 'kapali') tip = 'mutlu';
      kb8Goz(c, k ? 10 : -10, -4, tip, tip === 'yildiz' || tip === 'kalp' ? 1 : ac, bx, by, yk, t, k ? 1 : -1);
    }
    if (Y[3] && !yukGoz) {
      if (Y[3] === 1) { kb8Kas(c, -10, -14.5, 1.5 + (o.sas || 0) * 1.5, yk, 0); kb8Kas(c, 10, -14.5, 1.5 + (o.sas || 0) * 1.5, yk, 0); }
      else { kb8Kas(c, -10, -13, -.5, yk, -1.2); kb8Kas(c, 10, -15.5, 2.2, yk, .6); }
    }
    kb8Agiz(c, o.agizTip || (yukGoz && yuz !== 5 ? 'kucuk' : Y[2]), yk, clamp(+o.agiz || 0, 0, 1), o, t);
    c.restore();
  }
  if (aks) kb8Koy(c, kb8AksSpr(aks, K), aks === 'cicek' ? -6 : 0, -h + 3);
  c.restore();
}

// ═══════════════════════════════ BALKABAĞI FENERİ ═══════════════════════════════
// Yanma anı (o.yanT): 0-0,3 Feza'nın göğsünden küçük bir ışık yay çizip kabağın tepesine süzülür → 0,3-0,75 ışık yüzün ortasından
// dışa yayılır (gri-mor kabuk turuncuya döner, oyuklar altınla dolar; kabak titreyip hafifçe basılır, ışık tozları içeri akar) →
// 0,75 CANLANMA: gözler açılır, kabak zıplar, ışık halkası + pırıltı patlaması, yüzüne özgü ilk tepki (kahkaha, öpücük, esneme...).
// Sonra: göz kırpar, sapını oynatır, gözüyle Feza'yı izler, Feza yakındayken kıkırdayıp hoplar, birkaç saniyede bir kendi oyunu.
const KB8_FY = { ORB: .3, DOL: .75 };
function kb8FenerYak(o, kaynak) {
  if (o.yandi) return false;
  o.yandi = true; o.done = true; o.yanT = 0; o.kaynak = kaynak || 'yakin';
  const v = kb8V(); if (v) v.fener = (v.fener || 0) + 1;
  const n = v ? v.fener : ++KB8.fenerN, m = o.kb;
  o.n = n; m.ox = P.x + (P.f || 1) * 6; m.oy = P.y - 38;
  OLAY.emit('kabakFener', { o, n, x: o.x, y: o.y - 22 * o.s, renk: o.rk, pan: kb8Pan(o.x) });
  kb8Sfx('kabakFener', n);
  return true;
}
function kb8Fx(m, tip, x, y, sure, x1, y1) {   // nesne başına 4 yuvalı küçük efekt (kalp, pırıltı, z, uçan kalp)
  let f = m.fx[0]; for (const q of m.fx) { if (q.t < 0) { f = q; break; } if (q.t > f.t) f = q; }
  f.t = 0; f.tip = tip; f.x = x; f.y = y; f.max = sure || 1.6; f.x1 = x1 == null ? x : x1; f.y1 = y1 == null ? y : y1; f.r = Math.random();
}
function kb8Hop(m, v) { if (m.hop <= .01) { m.hop = .01; m.hopV = v; m.sapA = Math.max(m.sapA, .35); } }
// Yüze özgü küçük oyunlar (ilk: canlanma anı)
function kb8FenerOzel(o, ilk) {
  const m = o.kb, s = o.s, x = o.x, h = (KB8_SEKIL[o.sekil] || KB8_SEKIL[0]).h * s, gy = o.y - h * .5 - m.hop, yon = P.x > x ? 1 : -1;
  switch (o.yuz) {
    case 0: kb8Hop(m, 230); m.agizA = .7; break;                                                   // gülen: sevinç hopu
    case 1: m.kirpOz = .9; kb8Fx(m, 'isilti', x + 10 * s, gy - 4 * s, .9); kb8Hop(m, 160); break;  // göz kırpan: kırpışta yıldızcık
    case 2: m.dilA = 1.4; kb8Hop(m, 150); break;                                                   // dil çıkaran: dilini oynatır
    case 3: m.gulT = 1.4; break;                                                                    // kahkaha: ağız açılıp kapanır, hop hop
    case 4: m.sas = 1; m.sasT = .55; break;                                                         // şaşırır, sonra kocaman güler
    case 5: m.agizA = .9; kb8Fx(m, 'kalpUc', x + 2 * s, gy + 10 * s, 1.5, P.x - yon * 4, P.y - 52); break;   // öpücük Feza'ya uçar
    case 6: m.esneT = 1.5; break;                                                                   // uykulu: esner, "z" süzülür
    case 7: m.bakOz = (Math.random() < .5 ? -1 : 1); m.bakOzT = .9; m.dilA = .8; break;            // muzip: yan bakış + dil
    case 8: kb8Fx(m, 'isilti', x - 10 * s, gy - 5 * s, 1); kb8Fx(m, 'isilti', x + 10 * s, gy - 5 * s, 1.1); kb8Hop(m, 170); break;
    case 9: kb8Fx(m, 'kalp', x - 8 * s, gy - 14 * s, 1.8); kb8Fx(m, 'kalp', x + 9 * s, gy - 16 * s, 2); break;
    case 10: m.sallaT = 1.2; kb8Hop(m, 200); m.agizA = .8; break;                                  // neşeli: iki yana sallanır
    case 11: m.bakOz = -yon; m.bakOzT = 1.2; m.utan = 1; break;                                     // utangaç: gözünü kaçırır, kızarır
  }
  if (ilk && o.yuz !== 3 && o.yuz !== 4) kb8Hop(m, 300);
}
TUR.kaydet('kabakFener', {
  kur(o) {
    const i = o.sira != null ? o.sira | 0 : KB8.fenerSira; KB8.fenerSira++;
    o.i = i; o.yandi = false; o.yanT = -1; o.s = o.s || 1.12; o.r = o.r || 80; o.ry = o.ry || 30;
    o.yuz = o.yuz != null ? o.yuz | 0 : i % 12; o.sekil = o.sekil != null ? o.sekil : i % 3; o.ton = o.ton != null ? o.ton : i % 4;
    o.aks = o.aks != null ? o.aks : KB8_AKS[o.yuz % 12] || ''; o.rk = o.renk || KB8_RENK[i % KB8_RENK.length];
    o.kb = { t: (o.x * .011) % 7, tit: 0, davet: 0, canli: false, hop: 0, hopV: 0, sq: 0, sapA: 0, mut: 0, agizA: 0, bak: 0, bakY: 0, kirpT: 1 + (i % 5) * .6, kirpA: -1,
      kirpOz: 0, yakT: 0, ozT: 2.5 + (i % 4) * .7, gulT: 0, sas: 0, sasT: 0, esneT: 0, dilA: 0, bakOz: 0, bakOzT: 0, sallaT: 0, utan: 0, yakinOnce: false, ox: 0, oy: 0,
      fx: [0, 1, 2, 3].map(() => ({ t: -1, tip: '', x: 0, y: 0, x1: 0, y1: 0, max: 1, r: 0 })),
      opt: { yuz: o.yuz, yanik: 0, sekil: o.sekil, ton: o.ton, aks: o.aks, mutlu: 0, kirp: 0, ziplama: 0, bak: 0, bakY: 0, agiz: 0, dil: 0, sap: 0, sas: 0, uyku: 1, yayil: 0, agizTip: null } };
  },
  dokun(o) { kb8FenerYak(o, 'yakin'); },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.kb; m.t += dt;
    for (const f of m.fx) if (f.t >= 0) { f.t += dt; if (f.t > f.max) f.t = -1; }
    if (m.hop > 0) { m.hopV -= 1500 * dt; m.hop += m.hopV * dt; if (m.hop <= 0) { m.sq = -Math.min(.45, Math.max(0, -m.hopV) / 1000); m.hop = 0; m.hopV = 0; } }
    m.sq *= Math.max(0, 1 - dt * 7); m.sapA = Math.max(0, m.sapA - dt * .5);
    const dx = P.x - o.x, uz = Math.abs(dx), yakin = uz < 140 && Math.abs(P.y - o.y) < 170 && DURUM === 'oyun';
    if (!o.yandi) {
      m.tit = Math.max(0, m.tit - dt * 1.5); if (uz < 80 && Math.abs(P.vx) > 60) m.tit = Math.max(m.tit, .4);
      m.davet = clamp(m.davet + (uz < 380 ? dt : -dt) * 1.2, 0, 1);
      return;
    }
    o.yanT += dt; const yt = o.yanT;
    if (!m.canli && yt >= KB8_FY.DOL) {   // CANLANMA
      m.canli = true; m.mut = 1;
      const cy = o.y - 22 * o.s;
      ripples.push({ x: o.x, y: cy, r: 0, life: 1.3, small: true });
      burst(o.x, cy, 16, [o.rk, '#ffd27a', '#ffffff', '#ffb347'], 150, 1.1, 6);
      kb8FenerOzel(o, true);
    }
    if (!m.canli) return;
    // göz kırpma
    m.kirpT -= dt; if (m.kirpT <= 0 && m.kirpA < 0) { m.kirpA = 0; m.kirpT = 2.2 + Math.random() * 3.2; }
    if (m.kirpA >= 0) { m.kirpA += dt; if (m.kirpA > .17) m.kirpA = -1; }
    m.kirpOz = Math.max(0, m.kirpOz - dt);
    // bakış: Feza'yı izler (yakın değilse etrafa bakınır)
    let hb = uz < 700 ? clamp(dx / 220, -1, 1) : Math.sin(m.t * .4 + o.x) * .6, hby = uz < 700 ? clamp((P.y - 40 - (o.y - 22 * o.s)) / 200, -.6, .8) : 0;
    if (m.bakOzT > 0) { m.bakOzT -= dt; hb = m.bakOz; hby = o.yuz === 11 ? .9 : 0; if (m.bakOzT <= 0) m.bakOz = 0; }
    m.bak += (hb - m.bak) * Math.min(1, dt * 6); m.bakY += (hby - m.bakY) * Math.min(1, dt * 6);
    // yakında: kıkırdayıp hoplar; ilk yaklaşışta yüzüne özgü tepki
    if (yakin) {
      if (!m.yakinOnce) { m.yakinOnce = true; if (yt > 2) kb8FenerOzel(o, false); }
      m.mut = Math.min(1, m.mut + dt * 3); m.yakT -= dt;
      if (m.yakT <= 0 && m.hop <= 0) { kb8Hop(m, 150 + Math.random() * 70); m.agizA = Math.max(m.agizA, .5); m.yakT = .8 + Math.random() * .9; }
      if (o.yuz === 11 && m.bakOzT <= 0 && Math.random() < dt * .8) { m.bakOz = dx > 0 ? -1 : 1; m.bakOzT = .8 + Math.random() * .6; }   // utangaç: göz kaçırır
    } else { if (uz > 300) m.yakinOnce = false; m.mut = Math.max(0, m.mut - dt * .5); }
    m.utan = yakin && o.yuz === 11 ? Math.min(1, m.utan + dt * 2) : Math.max(0, m.utan - dt * .6);
    // kendi oyunu (Feza ekrana yakınken)
    m.ozT -= dt; if (m.ozT <= 0) { m.ozT = 3.2 + Math.random() * 3; if (uz < 900 && yt > 2.4) kb8FenerOzel(o, false); }
    m.agizA = Math.max(0, m.agizA - dt * .8); m.dilA = Math.max(0, m.dilA - dt);
    if (m.gulT > 0) { m.gulT -= dt; if (m.hop <= 0 && m.gulT > .2) kb8Hop(m, 130); }
    if (m.sasT > 0) { m.sasT -= dt; if (m.sasT <= 0) { m.sas = 0; kb8Hop(m, 280); m.agizA = 1; burst(o.x, o.y - 30 * o.s, 8, [o.rk, '#ffffff'], 90, .7, 5); } }
    if (m.esneT > 0) { const e0 = m.esneT; m.esneT -= dt; if (e0 > .3 && m.esneT <= .3) kb8Fx(m, 'z', o.x + 12 * o.s, o.y - 52 * o.s, 2.2); }
    m.sallaT = Math.max(0, m.sallaT - dt);
    if (o.yuz === 6 && !yakin && m.esneT <= 0) { m.zT = (m.zT || 0) - dt; if (m.zT <= 0) { m.zT = 2.4 + Math.random(); kb8Fx(m, 'z', o.x + 14 * o.s, o.y - 50 * o.s, 2.2); } }   // uykucu: mışıl mışıl
  },
  ciz(o, tm) {
    const m = o.kb, s = o.s, x = o.x, y = o.y, yt = o.yandi ? o.yanT : -1, sk = KB8_SEKIL[o.sekil] || KB8_SEKIL[0], h = sk.h * s;
    const nb = kb8FinalNabiz(), op = m.opt, cy = y - h * .5;
    const ac = o.yandi ? smooth(clamp((yt - KB8_FY.ORB) / (KB8_FY.DOL - KB8_FY.ORB), 0, 1)) : 0;
    // yerde sıcak ışık lekesi + kabağın çevresinde hale
    if (ac > 0) {
      g.globalCompositeOperation = 'lighter';
      kb8IsikE(g, '#ffb347', x, y - 3, 100 * s, 22 * s, ac * (.34 + .12 * nb)); kb8IsikE(g, o.rk, x, y - 2, 62 * s, 12 * s, ac * .22);
      kb8Isik(g, '#ffcf7a', x, cy - m.hop, 78 * s, ac * (.2 + .1 * nb));
      g.globalCompositeOperation = 'source-over';
    }
    // gölge (zıplarken küçülür)
    const hv = clamp(m.hop / 60, 0, .6);
    g.fillStyle = 'rgba(22,12,44,.3)'; g.beginPath(); g.ellipse(x, y, 27 * s * (1 - hv * .4), 4 * s, 0, 0, KB8_PI2); g.fill();
    // kabak
    let z = 0, don = 0;
    if (!o.yandi) { z = Math.sin(m.t * 1.6 + o.x) * .035; don = Math.sin(tm * 18) * .03 * m.tit; }
    else if (yt < KB8_FY.DOL) { const u = clamp((yt - .4) / .35, 0, 1); z = -.22 * smooth(u); don = Math.sin(yt * 55) * .045 * clamp((yt - .2) / .3, 0, 1); }
    else { z = m.hop > 0 ? clamp(m.hopV / 1100, -.25, .32) : m.sq; }
    if (m.sallaT > 0) don += Math.sin(m.sallaT * 14) * .12 * Math.min(1, m.sallaT * 2);
    if (m.gulT > 0) don += Math.sin(m.gulT * 30) * .04;
    op.yanik = ac; op.yayil = o.yandi && yt < KB8_FY.DOL ? ac : undefined; op.uyku = !o.yandi || yt < KB8_FY.DOL ? 1 : 0;
    op.ziplama = z; op.mutlu = Math.min(1, m.mut * .6 + (m.gulT > 0 || m.hop > 2 || m.agizA > .45 ? .45 : 0) + m.utan * .1);   // gözler hop/kıkırtı anında sevinçle kısılır, arada Feza'ya bakar op.bak = m.bak; op.bakY = m.bakY; op.sas = m.sas;
    let kp = m.kirpA >= 0 ? Math.sin(Math.PI * m.kirpA / .17) : 0;
    if (o.yandi && yt >= KB8_FY.DOL && yt < KB8_FY.DOL + .14) kp = 1 - smooth((yt - KB8_FY.DOL) / .14);   // gözler açılır
    if (m.esneT > 0) kp = Math.max(kp, Math.sin(clamp(m.esneT / 1.5, 0, 1) * Math.PI));
    op.kirp = kp;
    op.agiz = Math.min(1, Math.max(m.agizA, m.gulT > 0 ? .5 + .5 * Math.sin(m.gulT * 24) : 0, m.esneT > 0 ? Math.sin(clamp(m.esneT / 1.5, 0, 1) * Math.PI) : 0) + nb * .3);
    op.agizTip = m.esneT > .1 ? 'o' : null;
    op.dil = Math.sin(m.t * (m.dilA > 0 ? 16 : 3)) * (m.dilA > 0 ? 1 : .45);
    op.sap = Math.sin(m.t * 1.7 + o.x) * .05 + Math.sin(m.t * 13) * m.sapA * .5;
    op.kirpOz = m.kirpOz; op.uyan = o.yuz === 6 && (m.mut > .3 || m.esneT > 0) ? 1 : 0;
    if (don) { g.save(); g.translate(x, y); g.rotate(don); g.translate(-x, -y); }
    kabakCiz(g, x, y - m.hop, s, m.t, op);
    if (don) g.restore();
    g.globalCompositeOperation = 'lighter';
    if (!o.yandi) {   // davet: uyuyan kabağın göz aralığında sıcak ışık nefes alır
      if (m.davet > .02) { const n = .5 + .5 * Math.sin(tm * 2.2 + o.x); for (const k of [-1, 1]) kb8Isik(g, '#ffcf7a', x + k * 10 * s, cy - 4 * s, 9 * s, m.davet * (.16 + .22 * n)); kb8Isik(g, o.rk, x, cy, 24 * s, m.davet * .12 * n); }
      g.globalCompositeOperation = 'source-over'; return;
    }
    const isl = kb8Isilti();
    if (yt < KB8_FY.ORB + .05) {   // Feza'dan kabağa süzülen ışık (izli)
      for (let j = 5; j >= 0; j--) {
        const u = clamp(yt / KB8_FY.ORB - j * .06, 0, 1), e = smooth(u), bx = lerp(m.ox, x, e), by = lerp(m.oy, y - h - 6, e) - Math.sin(e * Math.PI) * 60;
        kb8Isik(g, j ? o.rk : '#ffe9a8', bx, by, j ? 9 - j : 16, j ? .45 * (1 - j / 6) : .9);
        if (!j) { g.globalAlpha = .95; g.drawImage(isl, bx - 7, by - 7, 14, 14); g.globalAlpha = 1; }
      }
    } else if (yt < KB8_FY.DOL) {   // ışık tozları içeri akar
      const u = (yt - KB8_FY.ORB) / (KB8_FY.DOL - KB8_FY.ORB);
      for (let k = 0; k < 7; k++) { const a = k / 7 * KB8_PI2 + yt * 4, r = (1 - u) * 52 * s + 6; kb8Isik(g, k % 2 ? o.rk : '#ffd27a', x + Math.cos(a) * r, cy + Math.sin(a) * r * .8, 7, (1 - u * .5) * .6); }
    }
    if (yt >= KB8_FY.DOL && yt < KB8_FY.DOL + 1.3) {   // canlanma: ışık halkası + pırıltı patlaması
      const u = (yt - KB8_FY.DOL) / 1.3, e = 1 - Math.pow(1 - u, 2.4);
      g.globalAlpha = (1 - u) * .7; g.strokeStyle = o.rk; g.lineWidth = 3 * (1 - u) + 1; g.beginPath(); g.ellipse(x, cy, 20 + e * 90 * s, 14 + e * 56 * s, 0, 0, KB8_PI2); g.stroke();
      g.strokeStyle = '#ffe2a0'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y - 2, 18 + e * 120 * s, 4 + e * 14 * s, 0, 0, KB8_PI2); g.stroke(); g.globalAlpha = 1;
      if (u < .25) kb8Isik(g, '#fff2c8', x, cy, 80 * s, (1 - u * 4) * .55);
      for (let k = 0; k < 12; k++) {
        const a = k / 12 * KB8_PI2 + .4, rr = 12 + e * (56 + (k % 3) * 18) * s, px = x + Math.cos(a) * rr, py = cy + Math.sin(a) * rr * .8 + u * u * 26, r = (k % 2 ? 4.5 : 6.5) * (1 - u * .5);
        kb8Isik(g, k % 3 ? o.rk : '#ffd27a', px, py, 11, (1 - u) * .5);
        g.globalAlpha = (1 - u) * .95; g.drawImage(isl, px - r, py - r, r * 2, r * 2);
      }
      g.globalAlpha = 1;
    }
    // çevresinde süzülen üç ışık tozu
    const bk = smooth(clamp((yt - 1.6) / 1.2, 0, 1));
    if (bk > 0 && kb8Ekranda(x, 120)) {
      for (let k = 0; k < 3; k++) {
        const ph = tm * (.55 + k * .13) + k * 2.1 + o.x, bx = x + Math.cos(ph) * (30 + k * 9) * s, by = cy - 8 + Math.sin(ph * 1.3) * (20 + k * 6) * s, n = .55 + .45 * Math.sin(tm * 3.1 + k * 1.7 + o.x);
        kb8Isik(g, o.rk, bx, by, 9, bk * .5 * n); g.globalAlpha = bk * .85 * n; g.drawImage(isl, bx - 3, by - 3, 6, 6); g.globalAlpha = 1;
      }
    }
    g.globalCompositeOperation = 'source-over';
    kb8FxCiz(m, tm);
  },
});
function kb8FxCiz(m, tm) {
  for (const f of m.fx) {
    if (f.t < 0) continue;
    const u = f.t / f.max, a = u < .15 ? u / .15 : u > .7 ? (1 - u) / .3 : 1;
    if (f.tip === 'kalp') { const x = f.x + Math.sin(f.t * 3 + f.r * 6) * 7, y = f.y - f.t * 26, r = 5 + u * 3; g.globalAlpha = a; g.drawImage(kb8KalpSpr('#ff8fc8'), x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; }
    else if (f.tip === 'kalpUc') {   // Feza'ya uçan öpücük kalbi; varınca pırıltıyla dağılır
      const e = smooth(Math.min(1, u * 1.25)), x = lerp(f.x, f.x1, e), y = lerp(f.y, f.y1, e) - Math.sin(e * Math.PI) * 40, r = 5 + Math.sin(e * Math.PI) * 3;
      if (u < .8) { g.globalAlpha = Math.min(1, a * 1.4); g.drawImage(kb8KalpSpr('#ff7fb0'), x - r, y - r, r * 2, r * 2); g.globalAlpha = 1; }
      else { const v = (u - .8) / .2; g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 5; k++) { const aa = k / 5 * KB8_PI2; kb8Isik(g, '#ff9fd0', f.x1 + Math.cos(aa) * v * 22, f.y1 + Math.sin(aa) * v * 18, 7, (1 - v) * .8); } g.globalCompositeOperation = 'source-over'; }
    } else if (f.tip === 'isilti') { const r = 5 + Math.sin(u * Math.PI) * 6; g.globalCompositeOperation = 'lighter'; g.save(); g.translate(f.x, f.y); g.rotate(u * 2); g.globalAlpha = Math.sin(u * Math.PI); g.drawImage(kb8Isilti(), -r, -r, r * 2, r * 2); g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    else if (f.tip === 'z') { for (let i = 0; i < 2; i++) { const v = u - i * .25; if (v <= 0) continue; kb8ZCiz(g, f.x + v * 14 + Math.sin(v * 6) * 3, f.y - v * 30, 2.4 + v * 2.6, Math.sin(Math.min(1, v) * Math.PI) * .9); } }
  }
}

// ═══════════════════════════════ HAYALETÇİK ÇİZİCİ ═══════════════════════════════
// hayaletCiz(c, x, y, s, t, o) — (x, y) dalgalı eteğin alt ortası; s = 1'de ≈ 40 birim boy, 31 en (teyze ≈ 45 × 37).
// o = { yon -1..1 (bakış; 0 tam önden, ara değerler dönüş), mutlu 0..1 (gözler ^^), el 0..1 (minik kollar havada), kik 0..1
//       (kıkırdama: titrer, ağız açılır), teyze (dantelli etek, yuvarlak gözlük, pembe fiyonk, inci kolye), alfa, iz -1..1 (etek/kuyruk
//       savrulması; + sağa), egim (rad), kirp 0..1 (verilmezse kendisi kırpar), bak/bakY -1..1 (göz bebekleri), agiz 0..1, salla 0..1
//       (el sallama), isik (varsayılan true: yumuşak hale) }
// Pamuk-çarşaf beyazı, pastel lila gölgeli; iri parlak gözler, pembe yanaklar. Gölgelendirme önbellekten; dış hat ve etek her
// karede tek yolla çizilir (etek dalgalanır, kuyruk savrulur).
const KB8_HG = { g: '#fdfaff', cz: '#ad98dc', golge: '#d9ccf4', goz: '#3b2d5e', yanak: '#ffa3cc' };
const KB8_HO = {};
function kb8HYol(c, w, top, t, iz, kik) {
  c.beginPath(); c.moveTo(-w, -9);
  c.bezierCurveTo(-w - 1.2, -24, -w * .78, top, 0, top);
  c.bezierCurveTo(w * .78, top, w + 1.2, -24, w, -9);
  const n = 3, ad = 2 * w / n, sg = iz < 0 ? -1 : 1, ai = Math.abs(iz);
  let px = w;
  for (let i = 0; i < n; i++) {
    const x1 = w - (i + 1) * ad, xm = (px + x1) / 2, dy = 2.4 * Math.sin(t * 4.2 + i * 1.9) + kik * Math.sin(t * 30 + i) * 1.2;
    const ext = Math.max(0, sg * xm / w) * ai;   // savrulan yandaki dalga uzayıp kuyruk olur
    c.quadraticCurveTo(xm + iz * 4 + sg * ext * 15, 6 + dy + ext * 8, x1, i === n - 1 ? -9 : -2.6 + dy * .3);
    px = x1;
  }
  c.closePath();
}
function kb8HGolgeSpr(w, top, K) {   // kubbenin iç gölgesi + parlak benek (eteğe doğru söner; dış hatta taşmaz)
  return kb8Tuval('hg' + w + '_' + top, K, -w - 2, top - 1, w * 2 + 4, -top - 3, q => {
    q.beginPath(); q.moveTo(-w, -9); q.bezierCurveTo(-w - 1.2, -24, -w * .78, top, 0, top); q.bezierCurveTo(w * .78, top, w + 1.2, -24, w, -9); q.lineTo(w, -4); q.lineTo(-w, -4); q.closePath(); q.clip();
    let gr = q.createRadialGradient(w * .55, -12, 1, w * .55, -12, w * 1.3); gr.addColorStop(0, 'rgba(196,176,240,.75)'); gr.addColorStop(.55, 'rgba(210,196,246,.3)'); gr.addColorStop(1, 'rgba(220,210,250,0)');
    q.fillStyle = gr; q.fillRect(-w - 2, top - 1, w * 2 + 4, -top);
    gr = q.createRadialGradient(-w * .35, top + 9, 1, -w * .35, top + 9, w * .9); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    q.fillStyle = gr; q.fillRect(-w - 2, top - 1, w * 2 + 4, -top);
    q.globalCompositeOperation = 'destination-in';
    gr = q.createLinearGradient(0, -16, 0, -5); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    q.fillStyle = gr; q.fillRect(-w - 2, top - 1, w * 2 + 4, -top);
  });
}
function kb8HFiyonkSpr(K) {
  return kb8Tuval('hfiyonk', K, -9, -6, 18, 12, q => {
    q.fillStyle = '#ff9fd2'; q.strokeStyle = '#d66aa6'; q.lineWidth = .9;
    for (const k of [-1, 1]) { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(k * 3, -5, k * 8.5, -4.5, k * 8, 0); q.bezierCurveTo(k * 8.5, 4.5, k * 3, 5, 0, 0); q.fill(); q.stroke(); }
    q.fillStyle = '#ff7fbf'; q.beginPath(); q.ellipse(0, 0, 2.2, 2.6, 0, 0, KB8_PI2); q.fill(); q.stroke();
    q.fillStyle = 'rgba(255,255,255,.6)'; q.beginPath(); q.ellipse(-4.6, -1.6, 1.8, .9, .3, 0, KB8_PI2); q.fill();
  });
}
function hayaletCiz(c, x, y, s, t, o) {
  o = o || KB8_HO; s = s || 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const tz = !!o.teyze, w = tz ? 18.5 : 15.5, top = tz ? -45 : -40, K = kb8K(c, s);
  const yw = clamp(Number.isFinite(o.yon) ? o.yon : 1, -1, 1), mut = clamp(+o.mutlu || 0, 0, 1), kik = clamp(+o.kik || 0, 0, 1), el = clamp(+o.el || 0, 0, 1);
  const iz = clamp(+o.iz || 0, -1, 1), ga0 = c.globalAlpha, al = o.alfa == null ? 1 : clamp(o.alfa, 0, 1);
  if (al <= .01) return;
  c.save(); c.globalAlpha = ga0 * al;
  c.translate(x, y); c.scale(s, s); if (o.egim) c.rotate(o.egim);
  if (kik > 0) c.translate(Math.sin(t * 38) * .8 * kik, 0);
  if (o.isik !== false) { c.globalCompositeOperation = 'lighter'; kb8Isik(c, '#e6dcff', 0, top * .5, 44, .34); kb8Isik(c, '#ffffff', 0, top * .55, 20, .18); c.globalCompositeOperation = 'source-over'; }
  // minik kollar (gövdenin arkasından çıkar)
  c.fillStyle = KB8_HG.g; c.strokeStyle = KB8_HG.cz; c.lineWidth = 1.4;
  const sal = (+o.salla || 0) * Math.sin(t * 9) * .45;
  for (let k = -1; k <= 1; k += 2) {
    const a = lerp(.6, -1.15, el) + (k > 0 ? sal : -sal * .5) + Math.sin(t * 2.3 + k) * .08, ax = k * (w - 2.5), ay = tz ? -20 : -18;
    const hx = ax + k * Math.cos(a) * 6.2, hy = ay + Math.sin(a) * 6.2;
    c.beginPath(); c.ellipse(hx, hy, 4.6, 3.3, k * a, 0, KB8_PI2); c.fill(); c.stroke();
  }
  // gövde
  kb8HYol(c, w, top, t, iz, kik); c.fillStyle = KB8_HG.g; c.fill();
  kb8Koy(c, kb8HGolgeSpr(w, top, K), 0, 0);
  kb8HYol(c, w, top, t, iz, kik); c.lineWidth = 1.6; c.strokeStyle = KB8_HG.cz; c.stroke();
  // teyze: dantelli etek (dalga uçlarında delikli dantel), inci kolye
  if (tz) {
    c.fillStyle = '#ffffff'; c.strokeStyle = '#c8b6ea'; c.lineWidth = .8;
    for (let i = 0; i < 9; i++) { const u = (i + .5) / 9, xx = lerp(w - 1, -w + 1, u), yy = 1.2 + 2.4 * Math.sin(t * 4.2 + Math.floor(u * 3) * 1.9) * Math.sin(u * 3 * Math.PI) ** 2; c.beginPath(); c.arc(xx, yy, 2.3, 0, KB8_PI2); c.fill(); c.stroke(); c.fillStyle = '#d9c8f2'; c.beginPath(); c.arc(xx, yy, .7, 0, KB8_PI2); c.fill(); c.fillStyle = '#ffffff'; }
    for (let i = 0; i < 7; i++) { const a = Math.PI * (.2 + .6 * i / 6), xx = Math.cos(a) * 9 + yw * 1.5, yy = -14.5 + Math.sin(a) * 2.6; c.fillStyle = i % 2 ? '#ffe6f2' : '#ffffff'; c.beginPath(); c.arc(xx, yy, 1.4, 0, KB8_PI2); c.fill(); c.strokeStyle = '#d0b8e8'; c.lineWidth = .5; c.stroke(); }
  }
  // yüz: bakış yönüne kayar (3/4 dönüş)
  const fx = yw * 2.6, gy = tz ? -27 : -24, gx = tz ? 6.2 : 5.6, cl = 1 - Math.abs(yw) * .12;
  let kirp = o.kirp; if (kirp == null) kirp = Math.pow(Math.max(0, Math.sin(t * 1.15 + 1.3)), 70);
  const kapali = mut > .6 || kik > .5 || kirp > .75;
  c.fillStyle = KB8_HG.yanak; c.globalAlpha = ga0 * al * (.55 + .3 * mut);
  c.beginPath(); c.ellipse(fx - gx * 1.72 * cl, gy + 6.4, 3.4, 2.1, 0, 0, KB8_PI2); c.ellipse(fx + gx * 1.72 * cl, gy + 6.4, 3.4, 2.1, 0, 0, KB8_PI2); c.fill();
  c.globalAlpha = ga0 * al;
  c.strokeStyle = KB8_HG.goz; c.fillStyle = KB8_HG.goz; c.lineCap = 'round';
  const bx = clamp(+o.bak || 0, -1, 1) * .9 + yw * .5, by = clamp(+o.bakY || 0, -1, 1) * .8;
  for (let k = -1; k <= 1; k += 2) {
    const ex = fx + k * gx * cl, rk = k * yw > 0 ? 1 - .25 * Math.abs(yw) : 1;
    if (kapali) {
      c.lineWidth = 1.6; c.beginPath();
      if (mut > .6 || kik > .5) { c.moveTo(ex - 2.8 * rk, gy + .9); c.quadraticCurveTo(ex, gy - 2.6, ex + 2.8 * rk, gy + .9); }
      else { c.moveTo(ex - 2.8 * rk, gy); c.quadraticCurveTo(ex, gy + 2.2, ex + 2.8 * rk, gy); }
      c.stroke();
    } else {
      c.beginPath(); c.ellipse(ex + bx * .5, gy + by * .4, 3.1 * rk, 4.1, 0, 0, KB8_PI2); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex + bx * .5 - 1.1, gy + by * .4 - 1.6, 1.35, 0, KB8_PI2); c.fill();
      c.beginPath(); c.arc(ex + bx * .5 + 1, gy + by * .4 + 1.4, .65, 0, KB8_PI2); c.fill(); c.fillStyle = KB8_HG.goz;
    }
  }
  // gözlük (teyze)
  if (tz) {
    c.strokeStyle = '#c8955a'; c.lineWidth = 1.1;
    c.beginPath(); c.arc(fx - gx * cl, gy, 4.9, 0, KB8_PI2); c.moveTo(fx + gx * cl + 4.9, gy); c.arc(fx + gx * cl, gy, 4.9, 0, KB8_PI2); c.stroke();
    c.beginPath(); c.moveTo(fx - gx * cl + 4.6, gy - 1); c.quadraticCurveTo(fx, gy - 2.6, fx + gx * cl - 4.6, gy - 1); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(fx - gx * cl - 1.8, gy - 2.4, 1.6, .8, -.5, 0, KB8_PI2); c.ellipse(fx + gx * cl - 1.8, gy - 2.4, 1.6, .8, -.5, 0, KB8_PI2); c.fill();
  }
  // ağız: minik gülümseme; kıkırdarken ağız açılır
  const ag = Math.max(clamp(+o.agiz || 0, 0, 1), kik * (.6 + .4 * Math.sin(t * 24))), mx = fx * 1.1, my = gy + 6.6;
  if (ag > .15) {
    c.fillStyle = KB8_HG.goz; c.beginPath(); c.moveTo(mx - 2.6, my - .4); c.quadraticCurveTo(mx, my + .5, mx + 2.6, my - .4); c.quadraticCurveTo(mx + 2.2, my + 2.4 + ag * 2.2, mx, my + 2.8 + ag * 2.2); c.quadraticCurveTo(mx - 2.2, my + 2.4 + ag * 2.2, mx - 2.6, my - .4); c.fill();
    c.fillStyle = '#ff8fb8'; c.beginPath(); c.ellipse(mx, my + 1.8 + ag * 1.8, 1.5, .9 + ag * .3, 0, 0, KB8_PI2); c.fill();
  } else { c.lineWidth = 1.3; c.strokeStyle = KB8_HG.goz; c.beginPath(); c.moveTo(mx - 2.2, my); c.quadraticCurveTo(mx, my + 2.2, mx + 2.2, my); c.stroke(); }
  if (tz) kb8Koy(c, kb8HFiyonkSpr(K), 10 + yw * 3, top + 7);
  c.restore();
}
// Saklanırken görünen minik el (eldiven gibi) ve kuyruk ucu
function kb8HEl(c, x, y, s, t, k) {
  c.save(); c.translate(x, y); c.scale(s * k, s); c.rotate(Math.sin(t * 8) * .4 - .3);
  c.fillStyle = KB8_HG.g; c.strokeStyle = KB8_HG.cz; c.lineWidth = 1.3;
  c.beginPath(); c.ellipse(0, 0, 3.4, 5, .2, 0, KB8_PI2); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(-2.6, 1.2, 1.7, 2.4, -.6, 0, KB8_PI2); c.fill(); c.stroke();   // başparmak
  c.restore();
}
function kb8HKuyruk(c, x, y, s, t, k) {
  c.save(); c.translate(x, y); c.scale(s * k, s); c.rotate(Math.sin(t * 5) * .25);
  c.fillStyle = KB8_HG.g; c.strokeStyle = KB8_HG.cz; c.lineWidth = 1.3;
  c.beginPath(); c.moveTo(0, -5); c.quadraticCurveTo(8, -7, 11 + Math.sin(t * 6) * 1.5, -1); c.quadraticCurveTo(14, 3, 9, 3.2); c.quadraticCurveTo(10, .5, 6, 1); c.quadraticCurveTo(3, 4, 0, 4); c.closePath(); c.fill(); c.stroke();
  c.restore();
}

// ═══════════════════════════════ SAKLANMA YERLERİ (önbellek sprite'ları) ═══════════════════════════════
// Her biri: arka (hayaletin arkasında) + ön; giz: saklı duruş, goz: gözleri görünen dikizleme, yan: yandan dikizleme, el/kuy:
// minik el / kuyruk ucunun göründüğü yer, cik: "Ce-ee!" sonrası duruş (nesnenin taban noktasına göre).
// 'agac' ve 'baca' HARITA'nın dünyasında çizilir (dunya8.js: kovuk o.kovukX/o.kovukY ≈ yuzey−118, 50×60; baca ağzı o.bacaX/o.bacaY
// ≈ yuzey−300, 46 en); hayaletçik oraya çizilir, ardından dn8SaklanOn(tip, x, y) ön parçayı yeniden çizer. dunya8 bunları
// vermezse kendi kovuklu ağacım / tuğla bacam (çatı parçasıyla) yedek olarak çizilir. Konumlar her karede kb8YerGuncelle'de.
const KB8_SAK = {
  kabak: { giz: [2, -8], goz: [0, -34], yan: [34, -6, .32], el: [-30, -40, -1], kuy: [36, -4, 1], cik: [0, -78], dik: ['goz', 'yan', 'el', 'kuy'] },
  cali: { giz: [0, -6], goz: [-6, -36], yan: [44, -6, .3], el: [-34, -48, -1], kuy: [40, -6, 1], cik: [0, -82], dik: ['goz', 'el', 'yan', 'kuy'] },
  agac: { giz: [0, -2], goz: [0, -30], el: [13, -72, 1], cik: [0, -118], dik: ['goz', 'el'] },
  cit: { giz: [10, -4], goz: [-8, -26], yan: [62, -6, .3], el: [30, -56, 1], kuy: [-62, -6, -1], cik: [0, -76], dik: ['goz', 'kuy', 'yan', 'el'] },
  baca: { giz: [0, 0], goz: [0, -31], el: [12, -55, 1], cik: [0, -96], dik: ['goz', 'el'] },
};
function kb8YiginSpr(K) {   // kabak yığını: iki büyük, bir üstte, bir minik süs kabağı + sarmaşık yaprakları
  return kb8Tuval('yigin', K, -50, -72, 100, 76, q => {
    q.fillStyle = 'rgba(22,12,44,.3)'; q.beginPath(); q.ellipse(2, 1, 46, 4.5, 0, 0, KB8_PI2); q.fill();
    kabakCiz(q, 1, -26, .64, 0, { yuz: -1, ton: 4, sekil: 0, isik: false, sap: .2 });
    kabakCiz(q, -19, 1, .8, 0, { yuz: -1, ton: 4, sekil: 1, isik: false, sap: -.3 });
    kabakCiz(q, 20, 2, .72, 0, { yuz: -1, ton: 4, sekil: 0, isik: false, sap: .4 });
    kabakCiz(q, 41, 2, .36, 0, { yuz: -1, ton: 1, sekil: 1, isik: false, yanik: 0 });
    q.strokeStyle = '#5f8f3a'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(-44, 1); q.bezierCurveTo(-36, -8, -30, 4, -22, -2); q.stroke();
    q.fillStyle = '#4f7f32'; for (const [lx, ly, a] of [[-40, -3, -.6], [-30, -1, .5], [34, -2, -.3]]) { q.save(); q.translate(lx, ly); q.rotate(a); q.beginPath(); q.ellipse(0, 0, 5, 2.6, 0, 0, KB8_PI2); q.fill(); q.restore(); }
  });
}
function kb8CaliSpr(K) {   // pofuduk gece çalısı: lila-mavi yaprak topakları, şeker renkli minik meyveler
  return kb8Tuval('cali', K, -54, -66, 108, 70, q => {
    q.fillStyle = 'rgba(22,12,44,.3)'; q.beginPath(); q.ellipse(0, 1, 50, 5, 0, 0, KB8_PI2); q.fill();
    const top = [[-34, -16, 18], [34, -16, 18], [-18, -30, 22], [18, -30, 22], [0, -42, 22], [-42, -6, 12], [42, -6, 12], [0, -18, 26]];
    q.fillStyle = '#3c3a78'; q.strokeStyle = '#25234f'; q.lineWidth = 1.6;
    for (const [x, y, r] of top) { q.beginPath(); q.arc(x, y, r + 1.5, 0, KB8_PI2); q.stroke(); }
    for (const [x, y, r] of top) { q.beginPath(); q.arc(x, y, r, 0, KB8_PI2); q.fill(); }
    q.fillStyle = '#4c4a92'; for (const [x, y, r] of top) { q.beginPath(); q.arc(x - r * .2, y - r * .25, r * .72, 0, KB8_PI2); q.fill(); }
    q.fillStyle = '#5f5eaa'; for (const [x, y, r] of top) { q.beginPath(); q.arc(x - r * .32, y - r * .42, r * .36, 0, KB8_PI2); q.fill(); }
    q.fillStyle = 'rgba(30,24,70,.45)'; q.beginPath(); q.ellipse(0, -3, 46, 7, 0, 0, KB8_PI2); q.fill();
    // yaprak uçları
    q.fillStyle = '#6a6abb'; for (let i = 0; i < 12; i++) { const a = Math.PI * (1.05 + i / 11 * .9), x = Math.cos(a) * 44, y = -22 + Math.sin(a) * 38; q.save(); q.translate(x, y); q.rotate(a + Math.PI / 2); q.beginPath(); q.ellipse(0, 0, 2.2, 4.4, 0, 0, KB8_PI2); q.fill(); q.restore(); }
    // şeker renkli meyveler
    const mr = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#ffb347', '#c39bff'];
    for (let i = 0; i < 9; i++) { const x = -36 + i * 9 + ((i * 7) % 5) - 2, y = -14 - ((i * 13) % 4) * 8 - (Math.abs(i - 4) < 2 ? 12 : 0); q.fillStyle = mr[i % 5]; q.beginPath(); q.arc(x, y, 2.6, 0, KB8_PI2); q.fill(); q.fillStyle = 'rgba(255,255,255,.8)'; q.beginPath(); q.arc(x - .8, y - .9, .9, 0, KB8_PI2); q.fill(); }
  });
}
// Kovuklu yaşlı ağaç: tombul eğri gövde, kökler, sonbahar yaprakları; kovuk (0, KB8_KOV.y) rx × ry
const KB8_KOV = { y: -62, rx: 17, ry: 21 };
function kb8AgacSpr(K) {
  return kb8Tuval('agac', K, -92, -214, 184, 218, q => {
    q.fillStyle = 'rgba(22,12,44,.32)'; q.beginPath(); q.ellipse(0, 1, 52, 5, 0, 0, KB8_PI2); q.fill();
    const gov = () => { q.beginPath(); q.moveTo(-40, 2); q.quadraticCurveTo(-26, -6, -27, -26); q.quadraticCurveTo(-31, -80, -16, -118); q.quadraticCurveTo(-30, -136, -50, -140);
      q.quadraticCurveTo(-26, -146, -10, -128); q.quadraticCurveTo(0, -150, 22, -150); q.quadraticCurveTo(8, -138, 14, -118); q.quadraticCurveTo(30, -84, 27, -28); q.quadraticCurveTo(28, -6, 44, 2); q.closePath(); };
    gov(); q.fillStyle = '#5c4064'; q.fill(); q.strokeStyle = '#33223e'; q.lineWidth = 2; q.stroke();
    q.save(); gov(); q.clip();
    q.fillStyle = '#74557c'; q.beginPath(); q.ellipse(-14, -70, 10, 60, .05, 0, KB8_PI2); q.fill();
    q.fillStyle = 'rgba(40,24,52,.45)'; q.beginPath(); q.ellipse(24, -60, 12, 70, -.05, 0, KB8_PI2); q.fill();
    q.strokeStyle = 'rgba(46,30,58,.6)'; q.lineWidth = 1.4;
    for (const [x0, y0, x1, y1] of [[-18, -20, -20, -48], [12, -14, 14, -40], [-8, -100, -12, -120], [16, -96, 18, -112], [-22, -88, -18, -104]]) { q.beginPath(); q.moveTo(x0, y0); q.quadraticCurveTo(x0 + 4, (y0 + y1) / 2, x1, y1); q.stroke(); }
    q.restore();
    // taç: tombul sonbahar yaprak bulutları (mor, erik, turuncu)
    const tac = [[-50, -150, 30, '#5b3d86'], [44, -156, 32, '#5b3d86'], [-20, -178, 34, '#6a4696'], [22, -182, 32, '#6a4696'], [0, -158, 30, '#7a52a6'], [-62, -134, 18, '#5b3d86'], [60, -138, 18, '#5b3d86']];
    for (const [x, y, r] of tac) { q.beginPath(); q.arc(x, y, r + 1.6, 0, KB8_PI2); q.fillStyle = '#2f2050'; q.fill(); }
    for (const [x, y, r, c] of tac) { q.beginPath(); q.arc(x, y, r, 0, KB8_PI2); q.fillStyle = c; q.fill(); q.fillStyle = 'rgba(160,120,220,.35)'; q.beginPath(); q.arc(x - r * .3, y - r * .35, r * .5, 0, KB8_PI2); q.fill(); }
    const yp = ['#ffb347', '#ff9a3c', '#ffd27a', '#ff8fc8'];
    for (let i = 0; i < 16; i++) { const a = i * 2.4, r = 10 + (i * 17) % 44, x = Math.cos(a) * r * 1.3, y = -165 + Math.sin(a) * r * .55; q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = yp[i % 4]; q.beginPath(); q.ellipse(0, 0, 4.4, 2.4, 0, 0, KB8_PI2); q.fill(); q.restore(); }
    // kovuk: koyu iç
    q.fillStyle = '#22163a'; q.beginPath(); q.ellipse(0, KB8_KOV.y, KB8_KOV.rx, KB8_KOV.ry, 0, 0, KB8_PI2); q.fill();
    q.fillStyle = 'rgba(80,50,110,.5)'; q.beginPath(); q.ellipse(2, KB8_KOV.y + 6, KB8_KOV.rx * .7, KB8_KOV.ry * .55, 0, 0, KB8_PI2); q.fill();
    // yerde kökler + mantarcıklar
    q.fillStyle = '#5c4064'; q.strokeStyle = '#33223e'; q.lineWidth = 1.6;
    for (const k of [-1, 1]) { q.beginPath(); q.moveTo(k * 26, -8); q.quadraticCurveTo(k * 46, -4, k * 58, 2); q.lineTo(k * 34, 2); q.closePath(); q.fill(); q.stroke(); }
    for (const [x, r, c] of [[-56, 5, '#ff8fc8'], [-46, 3.6, '#c39bff'], [52, 4.4, '#7dffc4']]) { q.fillStyle = '#f4ecff'; q.fillRect(x - 1, -r - 1, 2, r + 1); q.fillStyle = c; q.beginPath(); q.ellipse(x, -r - 1, r, r * .7, 0, Math.PI, 0); q.fill(); q.fillStyle = '#ffffff'; q.beginPath(); q.arc(x - r * .3, -r - 2, r * .2, 0, KB8_PI2); q.fill(); }
  });
}
function kb8KovukKenarSpr(K) {   // kovuğun kabuk halkası (hayaletin önünde)
  return kb8Tuval('kovuk', K, -26, KB8_KOV.y - 30, 52, 60, q => {
    q.strokeStyle = '#33223e'; q.lineWidth = 7; q.beginPath(); q.ellipse(0, KB8_KOV.y, KB8_KOV.rx + 2, KB8_KOV.ry + 2, 0, 0, KB8_PI2); q.stroke();
    q.strokeStyle = '#7a5a84'; q.lineWidth = 4.4; q.beginPath(); q.ellipse(0, KB8_KOV.y, KB8_KOV.rx + 2, KB8_KOV.ry + 2, 0, 0, KB8_PI2); q.stroke();
    q.strokeStyle = 'rgba(255,230,255,.25)'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, KB8_KOV.y, KB8_KOV.rx + 3, KB8_KOV.ry + 3, 0, Math.PI * 1.05, Math.PI * 1.7); q.stroke();
  });
}
function kb8CitSpr(K) {   // eğri büğrü tahta çit (beş tahta, iki kuşak) + kabak sarmaşığı
  return kb8Tuval('cit', K, -64, -62, 128, 66, q => {
    q.fillStyle = 'rgba(22,12,44,.3)'; q.beginPath(); q.ellipse(0, 1, 60, 4, 0, 0, KB8_PI2); q.fill();
    const tahta = (x, a, h) => { q.save(); q.translate(x, 0); q.rotate(a); q.beginPath(); q.moveTo(-9, 2); q.lineTo(-9, -h + 6); q.quadraticCurveTo(-9, -h - 2, 0, -h - 4); q.quadraticCurveTo(9, -h - 2, 9, -h + 6); q.lineTo(9, 2); q.closePath();
      q.fillStyle = '#8f7db4'; q.fill(); q.strokeStyle = '#4a3d6e'; q.lineWidth = 1.6; q.stroke();
      q.fillStyle = 'rgba(255,255,255,.18)'; q.fillRect(-6.5, -h + 4, 3, h - 6); q.fillStyle = 'rgba(40,30,70,.25)'; q.fillRect(4, -h + 6, 3.2, h - 8);
      q.strokeStyle = 'rgba(60,46,96,.45)'; q.lineWidth = .8; q.beginPath(); q.arc(1, -h * .45, 1.6, 0, KB8_PI2); q.stroke(); q.restore(); };
    q.fillStyle = '#7a69a0'; q.strokeStyle = '#4a3d6e'; q.lineWidth = 1.4;
    for (const y of [-14, -36]) { q.beginPath(); q.moveTo(-60, y + 3); q.quadraticCurveTo(0, y - 1, 60, y + 2); q.lineTo(60, y - 5); q.quadraticCurveTo(0, y - 8, -60, y - 4); q.closePath(); q.fill(); q.stroke(); }
    [[-46, -.05, 46], [-23, .04, 50], [0, -.02, 47], [23, .06, 51], [46, -.04, 45]].forEach(([x, a, h]) => tahta(x, a, h));
    // sarmaşık + yaprak + minik kabak
    q.strokeStyle = '#6fa043'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-60, -20); q.bezierCurveTo(-40, -34, -24, -8, -6, -26); q.bezierCurveTo(8, -38, 18, -18, 30, -30); q.stroke();
    q.fillStyle = '#5a8f36'; for (const [x, y, a] of [[-44, -27, -.5], [-14, -20, .6], [12, -31, -.4], [28, -26, .7]]) { q.save(); q.translate(x, y); q.rotate(a); q.beginPath(); q.ellipse(0, 0, 5.4, 2.8, 0, 0, KB8_PI2); q.fill(); q.restore(); }
    kabakCiz(q, -52, 2, .34, 0, { yuz: -1, ton: 4, sekil: 1, isik: false });
  });
}
function kb8BacaArkaSpr(K) {   // bacanın ağzı (içi): hayaletin arkasında
  return kb8Tuval('bacaA', K, -24, -60, 48, 16, q => {
    q.fillStyle = '#2a1d3a'; q.beginPath(); q.ellipse(0, -50, 17, 4.4, 0, 0, KB8_PI2); q.fill();
    q.fillStyle = 'rgba(255,190,120,.35)'; q.beginPath(); q.ellipse(0, -49, 12, 2.6, 0, 0, KB8_PI2); q.fill();
  });
}
function kb8BacaOnSpr(K, cati) {   // tuğla baca + ön ağız kenarı (+ istenirse altında küçük çatı parçası)
  return kb8Tuval('bacaO' + (cati ? 1 : 0), K, -70, -60, 140, 82, q => {
    if (cati) {   // çatı sırtı: pullu kiremitler
      q.fillStyle = '#4a3a6e'; q.strokeStyle = '#2c2148'; q.lineWidth = 1.6;
      q.beginPath(); q.moveTo(-66, 20); q.lineTo(-8, -6); q.lineTo(8, -6); q.lineTo(66, 20); q.closePath(); q.fill(); q.stroke();
      q.fillStyle = '#5a4a84'; for (let r = 0; r < 3; r++) for (let i = -6; i <= 6; i++) { const x = i * 10 + (r % 2) * 5, y = r * 8 + Math.abs(x) * .42 - 2; if (Math.abs(x) > 60 - r * 4) continue; q.beginPath(); q.arc(x, y, 5, 0, Math.PI); q.fill(); }
    }
    q.fillStyle = '#a06c80'; q.strokeStyle = '#5a3a50'; q.lineWidth = 1.6;
    q.beginPath(); q.moveTo(-15, 6); q.lineTo(-14, -46); q.lineTo(14, -46); q.lineTo(15, 6); q.closePath(); q.fill(); q.stroke();
    q.save(); q.beginPath(); q.rect(-15, -46, 30, 52); q.clip();
    q.strokeStyle = 'rgba(80,44,64,.55)'; q.lineWidth = 1;
    for (let r = 0; r < 7; r++) { const y = -46 + r * 7.4; q.beginPath(); q.moveTo(-15, y); q.lineTo(15, y); q.stroke(); for (let i = 0; i < 3; i++) { const x = -10 + i * 10 + (r % 2) * 5; q.beginPath(); q.moveTo(x, y); q.lineTo(x, y + 7.4); q.stroke(); } }
    q.fillStyle = 'rgba(255,255,255,.14)'; q.fillRect(-12, -44, 4, 48); q.fillStyle = 'rgba(40,20,40,.22)'; q.fillRect(8, -44, 5, 48);
    q.restore();
    // ağız kenarı (ön yarı)
    q.fillStyle = '#7d5468'; q.strokeStyle = '#4a2e42'; q.lineWidth = 1.5;
    q.beginPath(); q.moveTo(-20, -50); q.lineTo(-20, -44); q.quadraticCurveTo(0, -40, 20, -44); q.lineTo(20, -50); q.quadraticCurveTo(0, -45.6, -20, -50); q.closePath(); q.fill(); q.stroke();
    q.fillStyle = 'rgba(255,220,240,.22)'; q.fillRect(-18, -49.5, 36, 1.4);
  });
}
function kb8SaklanCiz(o, tm, arka) {   // arka: hayaletin arkasındaki katman; değilse ön katman
  const m = o.hy, K = kb8K(g, 1), bx = o.x, by = o.y, sal = Math.sin(m.t * 26) * .035 * m.salla;
  if (o.saklan === 'kabak') { if (!arka) { g.save(); g.translate(bx, by); g.rotate(sal); kb8Koy(g, kb8YiginSpr(K), 0, 0); g.restore(); } }
  else if (o.saklan === 'cali') { if (!arka) { g.save(); g.translate(bx, by); g.rotate(sal); g.scale(1 + Math.sin(m.t * 30) * .015 * m.salla, 1); kb8Koy(g, kb8CaliSpr(K), 0, 0); g.restore(); } }
  else if (o.saklan === 'cit') { if (!arka) { g.save(); g.translate(bx, by); g.rotate(sal * .5); kb8Koy(g, kb8CitSpr(K), 0, 0); g.restore(); } }
  else if (o.saklan === 'agac') {
    const v = m.kov;
    if (!m.harita) { if (arka) kb8Koy(g, kb8AgacSpr(K), v.x, v.y - KB8_KOV.y); else kb8Koy(g, kb8KovukKenarSpr(K), v.x, v.y - KB8_KOV.y); }
    else if (!arka) {
      if (typeof dn8SaklanOn === 'function') { try { dn8SaklanOn('agac', v.x, v.y); } catch (e) {} }
      else { g.strokeStyle = '#4a3352'; g.lineWidth = 6; g.beginPath(); g.ellipse(v.x, v.y, v.rx + 2, v.ry + 2, 0, 0, KB8_PI2); g.stroke(); }
    } else { g.fillStyle = 'rgba(34,22,58,.85)'; g.beginPath(); g.ellipse(v.x, v.y, v.rx, v.ry, 0, 0, KB8_PI2); g.fill(); }
  } else if (o.saklan === 'baca') {
    const v = m.baca;
    if (!m.harita) { if (arka) kb8Koy(g, kb8BacaArkaSpr(K), v.x, v.y + 50); else kb8Koy(g, kb8BacaOnSpr(K, o.cati !== false), v.x, v.y + 50); }
    else if (!arka) {
      if (typeof dn8SaklanOn === 'function') { try { dn8SaklanOn('baca', v.x, v.y); } catch (e) {} }
      else kb8Koy(g, kb8BacaOnSpr(K, false), v.x, v.y + 50);
    }
  }
}
function kb8YerAta(a, x, y, z) { a[0] = x; a[1] = y; a[2] = z || 0; }
function kb8YerGuncelle(o) {   // saklanma yerinin dünya konumları (her karede; dunya8 sonradan hazır olabilir)
  const m = o.hy, Y = m.yer, sk = KB8_SAK[o.saklan];
  if (o.saklan === 'agac') {
    const hm = Number.isFinite(o.kovukX) || typeof dn8SaklanOn === 'function', v = m.kov; m.harita = hm;
    v.x = Number.isFinite(o.kovukX) ? o.kovukX : o.x; v.y = Number.isFinite(o.kovukY) ? o.kovukY : hm ? o.y - 118 : o.y + KB8_KOV.y;
    v.rx = hm ? 25 : KB8_KOV.rx; v.ry = hm ? 30 : KB8_KOV.ry;
    kb8YerAta(Y.giz, v.x, v.y + v.ry + 46); kb8YerAta(Y.goz, v.x, v.y + 31); kb8YerAta(Y.el, v.x + v.rx * .55, v.y - v.ry + 3, 1); kb8YerAta(Y.cik, v.x, v.y - 62);
    Y.tepe = v.y - v.ry - 6; Y.isik[0] = v.x; Y.isik[1] = v.y + 4;
  } else if (o.saklan === 'baca') {
    const hm = Number.isFinite(o.bacaX) || typeof dn8SaklanOn === 'function', v = m.baca; m.harita = hm;
    v.x = Number.isFinite(o.bacaX) ? o.bacaX : o.x; v.y = Number.isFinite(o.bacaY) ? o.bacaY : hm ? o.y - 300 : kb8CatiY(o) - 50;
    kb8YerAta(Y.giz, v.x, v.y + 50); kb8YerAta(Y.goz, v.x, v.y + 19); kb8YerAta(Y.el, v.x + 12, v.y - 5, 1); kb8YerAta(Y.cik, v.x, v.y - 46);
    Y.tepe = v.y - 6; Y.isik[0] = v.x; Y.isik[1] = v.y - 4;
  } else {
    for (const k of ['giz', 'goz', 'yan', 'el', 'kuy', 'cik']) if (sk[k]) kb8YerAta(Y[k], o.x + sk[k][0], o.y + sk[k][1], sk[k][2]);
    Y.tepe = o.y + (o.saklan === 'cit' ? -54 : -62); Y.isik[0] = Y.giz[0]; Y.isik[1] = Y.giz[1] - 26;
  }
}

// ═══════════════════════════════ HAYALETÇİK: SAKLAMBAÇ + TAKİP ═══════════════════════════════
// Durumlar: 'sakli' (dikizler, kıkırdar) → 'cik' (1,25 sn: saklandığı yer kıpırdar, ışıltıyla süzülüp çıkar, kollar havada,
// kıkırdar) → 'tur' (1,9 sn: Feza'nın çevresinde bir tur; önden geçerken Feza'nın önünde çizilir) → 'takip' (bulunma sırasıyla
// arkasında süzülür) ⇄ 'bekle' (süpürge yolculuğu: bahçede el sallayıp bekler; inişten sonra ışıltılı süzülüşle gelir) → 'dans'.
// Bulunduktan sonra hayaletçik saklandığı yerden uzaklaşır; motor nesneyi o.x'e göre ekran dışı sayıp çizmezdi, bu yüzden
// hayaletçiği kendi konumunu taşıyan küçük bir vekil nesne ('hayaletcikCiz') çizer (kar.js karYavruCiz gibi).
const KB8_HS = 1.08;   // hayaletçiğin çizim büyüklüğü (≈ 43 birim; Feza 60)
function kb8Supurgede() { return !!(P.ucus && P.ucus.tip === 'supurgeMini'); }
function kb8Final() { const v = kb8V(); return !!(v && v.final); }
function kb8GeriEase(e) { const d = e - 1; return 1 + 2.4 * d * d * d + 1.4 * d * d; }   // hafif taşan yumuşak çıkış
function kb8CatiY(o) {   // bacanın oturduğu çatı yüksekliği: nesnede catiY > dunya8 dn8CatiY(x) > zeminden 5,6 kare yukarı
  if (Number.isFinite(o.catiY)) return o.catiY;
  if (typeof dn8CatiY === 'function') { try { const y = dn8CatiY(o.x); if (Number.isFinite(y)) return y; } catch (e) {} }
  return o.y - 5.6 * T;
}
function kb8HBul(o) {
  const m = o.hy; if (m.durum !== 'sakli') return;
  m.durum = 'cik'; m.u = 0; m.x0 = m.x; m.y0 = m.y; m.pop = false; m.pu = -1;
}
function kb8HPop(o) {
  const m = o.hy, v = kb8V(); m.pop = true; o.bulundu = true; o.done = true;
  if (v) v.hayalet = (v.hayalet || 0) + 1;
  m.k = KB8.takipN++;
  const n = v ? v.hayalet : m.k + 1;
  burst(m.x, m.y - 22, 22, ['#ffffff', '#e6dcff', '#ff9fd2', '#7dffc4', '#ffe27a'], 160, 1.2, 6);
  ripples.push({ x: m.x, y: m.y - 22, r: 0, life: 1.4, small: true });
  kb8Sfx('hayaletCee', n);
  OLAY.emit('hayaletBuldu', { o, n });
  kb8HVekil(o);
}
function kb8HVekil(o) { const m = o.hy; if (!m.vek && typeof NESNELER !== 'undefined') { m.vek = { tip: 'hayaletcikCiz', id: 'hayaletcikCiz' + o.sira, ana: o, x: m.x, y: m.y }; NESNELER.push(m.vek); } }
function kb8HGeriGel(o) {   // çok geride / süpürgeden sonra: ekran dışından ışıltılı süzülüşle gelir
  const m = o.hy, f = P.f || 1, vw = typeof VW !== 'undefined' ? VW : 1000;
  if (Math.abs(m.x - P.x) > vw * .6 || Math.abs(m.y - P.y) > 9 * T) { m.x = P.x - f * (vw * .55 + 90 + m.k * 50); m.y = P.y - 170 - m.k * 16; m.vx = f * 420; m.vy = 40; }
  m.yetis = true;
}
function kb8HDansaKat(o) {   // final: bulunamamış hayaletçik de gelir (sayılmaz)
  const m = o.hy; if (m.durum === 'dans') return;
  if (m.durum === 'sakli' || m.durum === 'cik') {
    m.k = KB8.takipN++; const vw = typeof VW !== 'undefined' ? VW : 1000, mx = typeof cam !== 'undefined' ? cam.x : P.x;
    m.x = mx + vw + 80 + m.k * 50; m.y = P.y - 230 - m.k * 20; m.vx = -300; m.vy = 0; m.el = 1; kb8HVekil(o);
  }
  m.durum = 'dans'; m.on = false;
}
TUR.kaydet('hayaletcik', {
  kur(o) {
    if (!KB8_SAK[o.saklan]) o.saklan = 'kabak';
    o.bulundu = false; o.s = o.s || KB8_HS; o.r = o.r || 110; o.ry = o.ry || 30; o.sira = KB8.hSira++;
    const m = o.hy = { t: (o.x * .017) % 9, durum: 'sakli', x: 0, y: 0, vx: 0, vy: 0, k: -1, pk: '', pu: -1, pkT: 1.2 + (o.sira % 3) * .9, pkI: o.sira,
      kikT: .6 + (o.sira % 2) * .8, kik: 0, kikU: -1, salla: 0, u: 0, x0: 0, y0: 0, a0: 0, dir: 1, yonS: 1, iz: 0, loopU: -1, loopT: 5 + o.sira * 1.7, loopD: 1, el: 0, mut: 0, eg: 0,
      fy: o.y, gecT: 0, bekX: 0, bekY: 0, yetis: false, vek: null, on: false, pop: false, sallaE: 0, izT: 0, izI: 0, kikTak: 5 + o.sira,
      gec: [0, 1, 2, 3, 4, 5, 6, 7].map(() => ({ x: 0, y: 0, t: -9 })),
      opt: { yon: 1, mutlu: 0, el: 0, kik: 0, iz: 0, egim: 0, bak: 0, bakY: 0, salla: 0, alfa: 1, kirp: null },
      yer: { giz: [0, 0, 0], goz: [0, 0, 0], yan: [0, 0, 0], el: [0, 0, 0], kuy: [0, 0, 0], cik: [0, 0, 0], tepe: 0, isik: [0, 0] }, kov: { x: 0, y: 0, rx: 17, ry: 21 }, baca: { x: 0, y: 0 }, harita: false };
    kb8YerGuncelle(o); m.x = m.yer.giz[0]; m.y = m.yer.giz[1];
    KB8.hayaletler.push(o);
  },
  dokun(o) { if (o.hy.durum === 'sakli' && !P.ucus && !kb8Final()) kb8HBul(o); else if (o.hy.durum === 'sakli') o.dokundu = false; },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.hy; m.t += dt; m.kik = Math.max(0, m.kik - dt * 1.3); m.salla = Math.max(0, m.salla - dt * 1.8);
    if (m.kikU >= 0) { m.kikU += dt / 1.3; if (m.kikU >= 1) m.kikU = -1; }
    if (m.durum === 'sakli' || m.durum === 'cik') kb8YerGuncelle(o);
    if (m.durum === 'sakli') kb8HSakli(o, m, dt);
    else if (m.durum === 'cik') kb8HCik(o, m, dt);
    else if (m.durum === 'tur') kb8HTur(o, m, dt);
    else kb8HTakip(o, m, dt);
    if (!Number.isFinite(m.x) || !Number.isFinite(m.y)) { m.x = P.x - 60; m.y = P.y - 60; m.vx = m.vy = 0; }
  },
  ciz(o, tm) {
    const m = o.hy, sakli = m.durum === 'sakli' || m.durum === 'cik', Y = m.yer;
    kb8SaklanCiz(o, tm, true);
    if (!sakli) { kb8SaklanCiz(o, tm, false); return; }
    const nb = .5 + .5 * Math.sin(tm * 2.1 + o.x), agac = o.saklan === 'agac', baca = o.saklan === 'baca';
    // saklandığı yerin arkasından sızan yumuşak ışıltı (hayaletçik oradadır)
    g.globalCompositeOperation = 'lighter';
    if (agac) kb8Isik(g, '#e6dcff', Y.isik[0], Y.isik[1], m.kov.rx * 1.6, .32 + .15 * nb + m.kik * .2);
    else if (baca) { kb8Isik(g, '#ffe6c8', Y.isik[0], Y.isik[1], 34, .22 + .12 * nb + m.kik * .2); kb8Isik(g, '#e6dcff', Y.isik[0], Y.isik[1] - 18, 52, .14 + .08 * nb); }
    else kb8Isik(g, '#e6dcff', Y.isik[0], Y.isik[1], 56, .22 + .1 * nb + m.kik * .18);
    g.globalCompositeOperation = 'source-over';
    // hayaletçiğin kendisi (saklıyken önündeki şeyin arkasında kalır; ağaçta kovuğun içinde)
    const kirp = agac && (m.durum === 'sakli' || m.u < .3), onde = agac && m.durum === 'cik' && m.u >= .3;
    if (kirp) { const v = m.kov; g.save(); g.beginPath(); g.ellipse(v.x, v.y, v.rx, v.ry, 0, 0, KB8_PI2); g.clip(); }
    if (!onde) kb8HCizGhost(o, tm, kirp ? .92 : 1);
    if (kirp) g.restore();
    // dikizleyen minik el / kuyruk ucu (önündeki şeyin kenarından çıkar)
    if (m.durum === 'sakli' && m.pu >= 0 && (m.pk === 'el' || m.pk === 'kuy')) {
      const p = Y[m.pk], e = m.pu < .25 ? smooth(m.pu / .25) : m.pu > .75 ? smooth((1 - m.pu) / .25) : 1, ix = -(p[2] || 1) * (1 - e) * 9;
      if (m.pk === 'el') kb8HEl(g, p[0] + ix, p[1] + (1 - e) * 4, o.s * 1.35, m.t, p[2] || 1);
      else kb8HKuyruk(g, p[0] + ix, p[1], o.s * 1.4, m.t, p[2] || 1);
    }
    kb8SaklanCiz(o, tm, false);
    if (onde) kb8HCizGhost(o, tm, lerp(.92, 1, smooth(clamp((m.u - .3) / .3, 0, 1))));
    // kıkırtı: saklandığı yerden süzülen minik pırıltılar; bacadan ışık "dumanı"
    const isl = kb8Isilti(); g.globalCompositeOperation = 'lighter';
    if (m.kikU >= 0) for (let k = 0; k < 3; k++) { const u = clamp(m.kikU * 1.2 - k * .12, 0, 1); if (u <= 0 || u >= 1) continue; const px = Y.giz[0] + (k - 1) * 14 + Math.sin(u * 7 + k) * 5, py = Y.tepe - u * 40, r = 3 + Math.sin(u * Math.PI) * 4; g.globalAlpha = Math.sin(u * Math.PI) * .9; g.drawImage(isl, px - r, py - r, r * 2, r * 2); }
    if (baca && m.durum === 'sakli') for (let k = 0; k < 4; k++) { const u = (tm * .35 + k / 4) % 1, px = Y.giz[0] + Math.sin(u * 5 + k * 2) * 8, py = Y.tepe - 2 - u * 70; kb8Isik(g, k % 2 ? '#ffe6c8' : '#e6dcff', px, py, 7 + u * 6, Math.sin(u * Math.PI) * .5); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  },
});
function kb8HSakli(o, m, dt) {
  const sk = KB8_SAK[o.saklan], Y = m.yer, dx = P.x - Y.giz[0], uz = Math.abs(dx), yak = uz < 240 && DURUM === 'oyun' && !P.ucus;
  if (kb8Final()) { kb8HDansaKat(o); return; }
  // dikizleme: birkaç saniyede bir gözleri, yanı, minik eli ya da kuyruk ucu görünür (Feza yakınken daha sık)
  if (m.pu >= 0) { m.pu += dt / 1.9; if (m.pu >= 1) m.pu = -1; }
  else { m.pkT -= dt * (yak ? 1.7 : 1); if (m.pkT <= 0) { m.pkT = 1.8 + Math.random() * 2.2; if (uz < 1500) { m.pk = sk.dik[m.pkI++ % sk.dik.length]; m.pu = 0; } } }
  let tx = Y.giz[0], ty = Y.giz[1], eg = 0;
  if (m.pu >= 0 && (m.pk === 'goz' || m.pk === 'yan') && sk[m.pk]) {
    const p = Y[m.pk], e = m.pu < .3 ? smooth(m.pu / .3) : m.pu > .72 ? smooth((1 - m.pu) / .28) : 1;
    tx = lerp(tx, p[0], e); ty = lerp(ty, p[1], e); eg = (p[2] || 0) * e;
  }
  m.x = tx; m.y = ty; m.eg = eg; m.yonS = clamp(dx / 200, -1, 1); m.mut = 0; m.el = 0;
  // kıkırtı (Feza ~6 kare yakınken): saklandığı yer kıpırdar
  if (yak) { m.kikT -= dt; if (m.kikT <= 0) { m.kikT = 2.6 + Math.random() * 1.6; m.kik = 1; m.salla = 1; m.kikU = 0; kb8Sfx('hayaletKikir'); OLAY.emit('hayaletKikir', { o, ilk: !KB8.kikirOnce }); KB8.kikirOnce = true; } }
}
function kb8HCik(o, m, dt) {
  m.u += dt / 1.25; const u = m.u, cx = m.yer.cik[0], cy = m.yer.cik[1];
  if (u < .18) { m.salla = 1; m.x = m.x0; m.y = m.y0 + Math.sin(u / .18 * Math.PI) * 3; }
  else {
    if (!m.pop) kb8HPop(o);
    const e = clamp((u - .18) / .42, 0, 1), eb = kb8GeriEase(e); m.x = lerp(m.x0, cx, eb); m.y = lerp(m.y0, cy, eb);
  }
  m.eg *= Math.max(0, 1 - dt * 6); m.el = u > .18 ? 1 : 0; m.mut = u > .2 ? 1 : 0; m.yonS = clamp((P.x - m.x) / 150, -1, 1);
  if (u > .55 && m.kik < .5) m.kik = 1;
  if (u >= 1) { m.durum = 'tur'; m.u = 0; m.x0 = m.x; m.y0 = m.y; m.dir = P.x > m.x ? -1 : 1; m.a0 = Math.atan2((m.y0 - (P.y - 50)) / 30, (m.x0 - P.x) / 78); kb8HVekil(o); }
}
function kb8HTur(o, m, dt) {
  m.u += dt / 1.9; const u = Math.min(1, m.u), cx = P.x, cy = P.y - 50, e = smooth(u), a = m.a0 + m.dir * KB8_PI2 * e;
  const ox = cx + Math.cos(a) * 78, oy = cy + Math.sin(a) * 30, b = smooth(Math.min(1, u / .3)), nx = lerp(m.x0, ox, b), ny = lerp(m.y0, oy, b);
  m.vx = clamp((nx - m.x) / dt, -900, 900); m.vy = clamp((ny - m.y) / dt, -900, 900); m.x = nx; m.y = ny;
  m.on = Math.sin(a) > .05; m.el = .85; m.mut = 1; m.yonS = clamp(m.vx / 160, -1, 1); m.iz = clamp(-m.vx / 300, -1, 1); m.fy = P.y;
  if (m.u >= 1) { m.durum = 'takip'; m.on = false; if (kb8Supurgede()) { m.durum = 'bekle'; m.bekX = m.x; m.bekY = m.y; } }
}
function kb8HTakip(o, m, dt) {
  if (kb8Final() && m.durum !== 'dans') { kb8HDansaKat(o); }
  if (m.durum === 'dans') { kb8HDans(o, m, dt); return; }
  if (kb8Supurgede() && m.durum !== 'bekle') { m.durum = 'bekle'; m.bekX = m.x; m.bekY = m.y; m.gecT = 0; }
  let tx, ty, om, vmax;
  if (m.durum === 'bekle') {   // süpürgede: bahçede yerinde süzülüp el sallar; iniş bitince peşinden gelir
    if (!kb8Supurgede()) { m.gecT += dt; if (m.gecT > .5 + m.k * .35) { m.durum = 'takip'; kb8HGeriGel(o); } }
    tx = m.bekX; ty = m.bekY; om = 3; vmax = 300; m.sallaE = 1;
  } else {
    m.sallaE = Math.max(0, m.sallaE - dt);
    const f = P.f || 1, mini = !!(P.ucus && !kb8Supurgede());
    m.fy += (P.y - m.fy) * Math.min(1, dt * (P.ground ? 4 : 2.2));
    tx = P.x - f * (58 + m.k * 44 + (mini ? 40 : 0)); ty = m.fy - 56 - (m.k % 2) * 16 + Math.min(m.k, 3) * 2 - (mini ? 48 : 0);
    const d = Math.hypot(tx - m.x, ty - m.y), vw = typeof VW !== 'undefined' ? VW : 1000;
    if (d > vw * 1.3) kb8HGeriGel(o);
    if (d > 330) m.yetis = true; else if (d < 90) m.yetis = false;
    om = m.yetis ? 6.2 : 5.2 - m.k * .42; vmax = m.yetis ? 1300 : 720;
  }
  // yay (kritiğe yakın sönümlü): sallanarak süzülür
  const ax = om * om * (tx - m.x) - 2 * .9 * om * m.vx, ay = om * om * (ty - m.y) - 2 * .9 * om * m.vy;
  m.vx += ax * dt; m.vy += ay * dt;
  const sp = Math.hypot(m.vx, m.vy); if (sp > vmax) { m.vx *= vmax / sp; m.vy *= vmax / sp; }
  m.x += m.vx * dt; m.y += m.vy * dt;
  kb8HDuygu(o, m, dt, m.durum === 'bekle' ? (P.x > m.x ? 1 : -1) : 0);
  // takla (ara sıra, Feza yavaşken)
  m.loopT -= dt;
  if (m.loopU < 0 && m.loopT <= 0 && !m.yetis && m.durum === 'takip') { m.loopT = 7 + Math.random() * 8; if (Math.abs(P.vx) < 200) { m.loopU = 0; m.loopD = m.yonS >= 0 ? 1 : -1; } }
  // ara sıra kendi kendine kıkırdar; Feza zıplayınca sevinir
  m.kikTak -= dt; if (m.kikTak <= 0) { m.kikTak = 6 + Math.random() * 6; m.kik = Math.max(m.kik, .8); }
}
function kb8HDuygu(o, m, dt, bakYon) {   // bakış, kuyruk savrulması, kollar, takla ilerlemesi
  const tyon = bakYon || (Math.abs(m.vx) > 50 ? Math.sign(m.vx) : (P.x > m.x ? 1 : -1));
  m.yonS += clamp(tyon - m.yonS, -dt * 5, dt * 5);
  m.iz += (clamp(-m.vx / 300, -1, 1) - m.iz) * Math.min(1, dt * 6);
  const elH = m.loopU >= 0 ? .95 : Math.max(clamp(Math.abs(m.vx) / 260, 0, .75), m.sallaE * .8);
  m.el += (elH - m.el) * Math.min(1, dt * 5);
  const mutH = !P.ground || m.loopU >= 0 || m.yetis ? 1 : 0;
  m.mut += (mutH - m.mut) * Math.min(1, dt * 5);
  if (m.loopU >= 0) { m.loopU += dt / 1.05; if (m.loopU >= 1) m.loopU = -1; }
  // yetişirken geride ışıltı izi (8 noktalık halka)
  m.izT -= dt;
  if (m.izT <= 0 && (m.yetis || Math.hypot(m.vx, m.vy) > 380)) { m.izT = .045; const p = m.gec[m.izI]; p.x = m.x; p.y = m.y - 20; p.t = m.t; m.izI = (m.izI + 1) % m.gec.length; }
}
function kb8HCizGhost(o, tm, olc) {
  const m = o.hy, s = o.s * (olc || 1), bob = m.durum === 'sakli' ? 0 : Math.sin(m.t * 2.3 + o.sira * 1.3) * 5;
  let x = m.x, y = m.y + bob, rot = m.eg || 0;
  if (m.loopU >= 0) {   // takla: küçük bir çember çizip kendi çevresinde döner
    const u = smooth(m.loopU), a = u * KB8_PI2;
    x += Math.sin(a) * 26 * m.loopD; y -= (1 - Math.cos(a)) * 24; rot += a * m.loopD;
  }
  const isl = kb8Isilti();
  if (m.durum !== 'sakli') {
    // ışıltı izi
    g.globalCompositeOperation = 'lighter';
    for (const p of m.gec) { const yas = m.t - p.t; if (yas > .5 || yas < 0) continue; const a = 1 - yas / .5, r = 3 + a * 4; kb8Isik(g, KB8_RENK[(o.sira * 3 + Math.floor(p.t * 20)) % 12], p.x, p.y, 12 * a + 4, a * .45); g.globalAlpha = a * .9; g.drawImage(isl, p.x - r, p.y - r, r * 2, r * 2); g.globalAlpha = 1; }
    // yolu aydınlatır: yerde yumuşak lila ışık
    const zy = kb8ZeminTam(x, y); if (zy != null && zy - y < 220 && zy > y) kb8IsikE(g, '#e6dcff', x, zy - 2, 46, 10, .26 * (1 - (zy - y) / 220));
    g.globalCompositeOperation = 'source-over';
  }
  const op = m.opt;
  op.yon = m.yonS; op.mutlu = m.mut; op.el = m.el; op.kik = m.kik; op.iz = m.iz; op.egim = rot + clamp(m.vx / 1100, -.2, .2); op.salla = m.sallaE || (m.durum === 'cik' && m.u > .55 ? 1 : 0);
  op.bak = clamp((P.x - x) / 160, -1, 1); op.bakY = clamp((P.y - 40 - (y - 24)) / 120, -1, 1);
  hayaletCiz(g, x, y, s, m.t + o.sira * 2, op);
}
TUR.kaydet('hayaletcikCiz', {
  guncelle(v) { const m = v.ana.hy; v.x = m.x; v.y = m.y; },
  ciz(v, tm) { const m = v.ana.hy; if (m.durum === 'sakli' || m.durum === 'cik' || m.on) return; if (m.x < cam.x - 150 || m.x > cam.x + VW + 150) return; kb8HCizGhost(v.ana, tm); },
  cizOn(v, tm) { const m = v.ana.hy; if (!m.on || m.durum === 'sakli' || m.durum === 'cik') return; kb8HCizGhost(v.ana, tm); },
});

// ═══════════════════════════════ GECE DOSTLARI: ÇİZİCİLER ═══════════════════════════════
// yarasaCiz(c, x, y, s, t, o) — (x, y) gövdenin ortası; s = 1'de gövde ≈ 22 birim, açık kanatlarla ≈ 56 en.
// o = { yon -1|1, ucus 0|1 (uçarken kanat çırpar), ters (dalda baş aşağı asılı; ayaklar yukarıda), kanat (kanat çırpma fazı, rad;
//       verilmezse t'den), kanatAc 0..1 (uçmuyorken kanat açıklığı; 0 = pelerin gibi sarılı), mutlu 0..1, uyku 0..1, alfa, bak -1..1 }
// Lila-mor top gövde, iri parlak gözler, pembe yanak, minik gülümseme (diş yok); kanatlar mor, dalgalı kenarlı.
const KB8_YR = { g: '#b59cf0', ac: '#dccdff', cz: '#6650b0', kn: '#8f74d6', knA: '#a98ff0', goz: '#2e2350', yanak: '#ff9fcf' };
const KB8_YO = {};
function kb8KanatYol(c) {   // sağ kanat, omuz (0, 0)
  c.beginPath(); c.moveTo(0, -3.5); c.quadraticCurveTo(9, -15, 25, -11); c.quadraticCurveTo(23.5, -3, 19.5, 1.5); c.quadraticCurveTo(16.5, -1.5, 13, 3.6);
  c.quadraticCurveTo(9.5, .8, 6, 4.6); c.quadraticCurveTo(2.5, 2.6, 0, 3.4); c.closePath();
}
function yarasaCiz(c, x, y, s, t, o) {
  o = o || KB8_YO; s = s || 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const yn = (o.yon || 1) < 0 ? -1 : 1, uc = !!o.ucus, mut = clamp(+o.mutlu || 0, 0, 1), uy = clamp(+o.uyku || 0, 0, 1);
  const ga0 = c.globalAlpha; c.save(); if (o.alfa != null) c.globalAlpha = ga0 * clamp(o.alfa, 0, 1);
  c.translate(x, y); c.scale(s * yn, s * (o.ters ? -1 : 1));
  // kanatlar: uçarken çırpar (yukarı-aşağı), değilse açıklığa göre gövdeye sarılır
  const ph = Number.isFinite(o.kanat) ? o.kanat : t * 16, ac = uc ? 1 : clamp(+o.kanatAc || 0, 0, 1);
  const cir = uc ? Math.sin(ph) : 0;
  for (let k = -1; k <= 1; k += 2) {
    c.save(); c.translate(k * 7.5, -1); c.scale(k, 1);
    const a = uc ? -cir * .65 + .05 : lerp(1.55, -.15, ac), sy = uc ? .7 + .3 * Math.abs(Math.cos(ph)) : lerp(.62, 1, ac), sx = uc ? 1 : lerp(.5, 1, ac);
    c.rotate(a); c.scale(sx, sy);
    kb8KanatYol(c); c.fillStyle = KB8_YR.kn; c.fill(); c.lineWidth = 1.4 / Math.max(.5, sy); c.strokeStyle = KB8_YR.cz; c.stroke();
    c.strokeStyle = KB8_YR.knA; c.lineWidth = 1; c.beginPath(); c.moveTo(1, -2); c.lineTo(19, 0); c.moveTo(1, -2); c.lineTo(12.5, 2.4); c.moveTo(1, -2); c.lineTo(6, 3.4); c.stroke();
    c.restore();
  }
  // ayaklar
  c.fillStyle = KB8_YR.kn; c.strokeStyle = KB8_YR.cz; c.lineWidth = 1;
  for (const k of [-1, 1]) { c.beginPath(); c.ellipse(k * 3.2, 10.4, 2, 2.6, 0, 0, KB8_PI2); c.fill(); c.stroke(); }
  // kulaklar
  for (const k of [-1, 1]) {
    c.beginPath(); c.moveTo(k * 2.5, -8.5); c.quadraticCurveTo(k * 6.5, -17, k * 9.5, -14.5); c.quadraticCurveTo(k * 9.4, -9.5, k * 8.5, -6); c.closePath(); c.fillStyle = KB8_YR.g; c.fill(); c.lineWidth = 1.3; c.strokeStyle = KB8_YR.cz; c.stroke();
    c.beginPath(); c.moveTo(k * 4.3, -9); c.quadraticCurveTo(k * 6.8, -14.3, k * 8.4, -12.8); c.lineTo(k * 7.6, -8.6); c.closePath(); c.fillStyle = '#f2a8dc'; c.fill();
  }
  // gövde (pofuduk top) + açık karın + tepe tüyü
  c.beginPath(); c.arc(0, 0, 10.6, 0, KB8_PI2); c.fillStyle = KB8_YR.g; c.fill(); c.lineWidth = 1.5; c.strokeStyle = KB8_YR.cz; c.stroke();
  c.fillStyle = KB8_YR.ac; c.beginPath(); c.ellipse(0, 4.2, 6.6, 5.6, 0, 0, KB8_PI2); c.fill();
  c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-4.2, -5.4, 3.2, 1.8, -.5, 0, KB8_PI2); c.fill();
  c.fillStyle = KB8_YR.g; c.beginPath(); c.arc(-1.5, -10.4, 2.2, 0, KB8_PI2); c.arc(1.6, -10.8, 2, 0, KB8_PI2); c.fill();
  // yüz (ters asılıyken de sevimli: gözler, yanaklar, gülümseme)
  const fx = 1.2, kirp = Math.pow(Math.max(0, Math.sin(t * 1.2 + x * .01)), 60), kap = uy > .5 || kirp > .8;
  c.fillStyle = KB8_YR.yanak; c.globalAlpha = c.globalAlpha * .7; c.beginPath(); c.ellipse(fx - 6.6, 2.2, 2.4, 1.5, 0, 0, KB8_PI2); c.ellipse(fx + 6.6, 2.2, 2.4, 1.5, 0, 0, KB8_PI2); c.fill(); c.globalAlpha = o.alfa != null ? ga0 * clamp(o.alfa, 0, 1) : ga0;
  c.strokeStyle = KB8_YR.goz; c.fillStyle = KB8_YR.goz; c.lineCap = 'round'; c.lineWidth = 1.4;
  const bx = clamp(+o.bak || 0, -1, 1) * .6;
  for (const k of [-1, 1]) {
    const ex = fx + k * 3.9;
    if (kap) { c.beginPath(); c.moveTo(ex - 2.2, -1.6); c.quadraticCurveTo(ex, uy > .5 ? .4 : -.2, ex + 2.2, -1.6); c.stroke(); }
    else if (mut > .6) { c.beginPath(); c.moveTo(ex - 2.2, -.8); c.quadraticCurveTo(ex, -3.6, ex + 2.2, -.8); c.stroke(); }
    else { c.beginPath(); c.ellipse(ex + bx, -1.6, 2.3, 2.9, 0, 0, KB8_PI2); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex + bx - .8, -2.7, .95, 0, KB8_PI2); c.fill(); c.beginPath(); c.arc(ex + bx + .7, -.6, .45, 0, KB8_PI2); c.fill(); c.fillStyle = KB8_YR.goz; }
  }
  c.lineWidth = 1.1; c.beginPath(); c.moveTo(fx - 1.8, 2.6); c.quadraticCurveTo(fx, 4.4 + mut, fx + 1.8, 2.6); c.stroke();
  c.restore();
}
// kediCiz(c, x, y, s, t, o) — şapkalı kara kedi; (x, y) ayak tabanının ortası; sağa bakar (yon -1 sola).
// s = 1'de oturuşta kulak uçlarına ≈ 38 birim (şapkayla ≈ 54); ayakta (iki ayak üstünde) ≈ 50 (şapkayla ≈ 66); yürürken ≈ 34.
// o = { yon -1|1, poz 'otur'|'yuru'|'gerin'|'ayakta' (ya da ayakta: true / otur: true), pozB + pozK 0..1 (iki poz arası yumuşak
//       geçiş), adim (yürüme fazı, rad; verilmezse t'den), kuyruk 0..1 (sallanma), mutlu|sevinc 0..1, zipla 0..1, el 0..1 (pati
//       sallama), alkis 0..1, ruzgar 0..1 (şapka/kuyruk geriye savrulur), sapka (varsayılan true), mir 0..1 (mırlama), dans 0..1,
//       bak -1..1, kirp, alfa }
// Koyu mor-kara tüy, lila yumuşak kontur (gecede seçilsin), iri yeşil gözler, pembe burun ve yanaklar, mor yıldızlı cadı şapkası.
const KB8_KD = { g: '#2f2846', ac: '#463d66', cz: '#8b7bc4', goz: '#a8ff8c', gozK: '#3f9a52', bebek: '#1b2a20', burun: '#ff9fc0', kulak: '#d98bb4', yanak: '#ff8fbf' };
// pozlar (sağa bakış, yer y = 0): gövde [x, y, rx, ry, açı], kalça [x, y, rx, ry], baş [x, y], ön bacaklar [omuz x, y, pati x, y] ×2,
// arka bacaklar [kalça x, y, pati x, y] ×2, kuyruk [kök x, y, k1 x, y, k2 x, y, uç x, y]
const KB8_KPOZ = {
  otur: { gv: [1, -13, 9.5, 12, -.08], kl: [-4, -7, 9, 7.5], bs: [5, -28], on: [3.5, -16, 4, -1.6, 8, -16, 8.6, -1.6], ar: [-3, -4, -1, -1.4, -3, -4, -1, -1.4], ky: [-10, -5, -20, -8, -22, -22, -15, -28] },
  yuru: { gv: [0, -15, 14, 8.5, 0], kl: [-9, -13, 7.5, 7.5], bs: [14, -24], on: [8, -14, 8, -1.4, 10, -14, 10, -1.4], ar: [-9, -12, -9, -1.4, -7, -12, -7, -1.4], ky: [-13, -17, -22, -22, -20, -36, -13, -38] },
  gerin: { gv: [-1, -12, 13, 7.5, .32], kl: [-10, -15, 7.5, 7.5], bs: [15, -13], on: [8, -8, 19, -1.4, 9, -8, 22.5, -1.4], ar: [-10, -12, -11, -1.4, -8, -12, -7.5, -1.4], ky: [-15, -18, -22, -30, -12, -44, -6, -42] },
  ayakta: { gv: [0, -19, 9, 13, 0], kl: [0, -9, 9.5, 6.5], bs: [1.5, -37], on: [-5, -25, -7, -15, 6, -25, 8, -15], ar: [-4, -7, -5, -1.4, 4, -7, 5, -1.4], ky: [-7, -9, -17, -10, -19, -26, -13, -31] },
};
const KB8_KTMP = { gv: [0, 0, 0, 0, 0], kl: [0, 0, 0, 0], bs: [0, 0], on: [0, 0, 0, 0, 0, 0, 0, 0], ar: [0, 0, 0, 0, 0, 0, 0, 0], ky: [0, 0, 0, 0, 0, 0, 0, 0] };
const KB8_KDO = {};
function kb8KediSapkaSpr(K) {   // kök (0, 0) kafanın tepesi; ucu geriye kıvrık
  return kb8Tuval('kSapka', K, -16, -26, 34, 30, q => {
    q.fillStyle = '#6a42b8'; q.strokeStyle = '#3a2370'; q.lineWidth = 1.1;
    q.beginPath(); q.ellipse(0, 0, 12.5, 3.3, 0, 0, KB8_PI2); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(-7.2, -.8); q.quadraticCurveTo(-4, -12, -2, -18); q.quadraticCurveTo(-4, -23, -11, -22); q.quadraticCurveTo(-5, -25.5, 1.5, -19); q.quadraticCurveTo(5, -10, 7.4, -.8); q.closePath(); q.fill(); q.stroke();
    q.fillStyle = '#ffb347'; q.beginPath(); q.moveTo(-7.2, -1); q.quadraticCurveTo(0, 1, 7.4, -1); q.lineTo(6.8, -4.2); q.quadraticCurveTo(0, -2.4, -6.7, -4.2); q.closePath(); q.fill();
    q.fillStyle = '#ffe27a'; kb8YildizYol(q, .2, -10, 2.7, .45); q.fill();
    q.fillStyle = 'rgba(255,255,255,.25)'; q.beginPath(); q.moveTo(-5, -4.5); q.quadraticCurveTo(-3, -11, -1.8, -15); q.lineTo(-2.6, -6); q.closePath(); q.fill();
  });
}
function kb8Bacak(c, x1, y1, x2, y2, w) {   // kalın yuvarlak uçlu bacak + pati
  c.lineCap = 'round'; c.strokeStyle = KB8_KD.cz; c.lineWidth = w + 2.4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  c.strokeStyle = KB8_KD.g; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  c.fillStyle = KB8_KD.g; c.beginPath(); c.ellipse(x2 + .8, y2 + .2, w * .62, w * .42, 0, 0, KB8_PI2); c.fill(); c.lineWidth = 1.1; c.strokeStyle = KB8_KD.cz; c.stroke();
}
function kediCiz(c, x, y, s, t, o) {
  o = o || KB8_KDO; s = s || 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const pa = o.ayakta ? 'ayakta' : o.otur ? 'otur' : (KB8_KPOZ[o.poz] ? o.poz : 'otur'), A = KB8_KPOZ[pa], B = KB8_KPOZ[o.pozB] || null, k = B ? clamp(+o.pozK || 0, 0, 1) : 0, Q = KB8_KTMP;
  for (const key in Q) { const qa = Q[key], aa = A[key], bb = B ? B[key] : aa; for (let i = 0; i < qa.length; i++) qa[i] = lerp(aa[i], bb[i], k); }
  const yn = (o.yon || 1) < 0 ? -1 : 1, mut = clamp(+(o.mutlu != null ? o.mutlu : o.sevinc) || 0, 0, 1), el = clamp(+o.el || 0, 0, 1), alk = clamp(+o.alkis || 0, 0, 1);
  const zp = clamp(+o.zipla || 0, 0, 1), rz = clamp(+o.ruzgar || 0, 0, 1), mir = clamp(+o.mir || 0, 0, 1), dans = clamp(+o.dans || 0, 0, 1);
  const yuru = (pa === 'yuru' && k < .5) || (o.pozB === 'yuru' && k >= .5), ph = Number.isFinite(o.adim) ? o.adim : t * 9;
  const ga0 = c.globalAlpha; c.save(); if (o.alfa != null) c.globalAlpha = ga0 * clamp(o.alfa, 0, 1);
  c.translate(x, y); c.scale(s * yn, s);
  if (mir > 0) c.translate(Math.sin(t * 45) * .35 * mir, 0);
  if (zp > 0) { c.translate(0, -zp * 4); c.scale(1 - zp * .06, 1 + zp * .08); }
  const ayk = pa === 'ayakta' && k < .5;
  if (ayk && dans > 0) c.rotate(Math.sin(t * 6.28) * .08 * dans);
  // kuyruk (arkada; sallanır, rüzgârda geriye savrulur)
  const ky = Q.ky, sal = Math.sin(t * (2 + (+o.kuyruk || 0) * 3)) * (3 + (+o.kuyruk || 0) * 5);
  const kyol = () => { c.beginPath(); c.moveTo(ky[0], ky[1]); c.bezierCurveTo(ky[2] - rz * 6, ky[3] + sal * .3, ky[4] + sal - rz * 10, ky[5] + rz * 8, ky[6] + sal * 1.2 - rz * 14, ky[7] + rz * 14); };
  c.lineCap = 'round'; kyol(); c.strokeStyle = KB8_KD.cz; c.lineWidth = 7.4; c.stroke(); kyol(); c.strokeStyle = KB8_KD.g; c.lineWidth = 5; c.stroke();
  // uzak bacaklar (biraz koyu)
  const on = Q.on, ar = Q.ar, ad = yuru ? Math.sin(ph) : 0;
  c.globalAlpha *= .85;
  if (pa !== 'otur' || k > 0) kb8Bacak(c, ar[4], ar[5], ar[6] + (yuru ? -ad * 5 : 0), ar[7] - (yuru ? Math.max(0, ad) * 2.5 : 0), 3.8);
  let fx2 = on[6] + (yuru ? ad * 5 : 0), fy2 = on[7] - (yuru ? Math.max(0, -ad) * 2.5 : 0);
  if (ayk) { const kal = Math.max(el, dans * (.5 + .5 * Math.sin(t * 6.28))); fx2 = lerp(on[6], on[4] + 6, kal) + Math.sin(t * 10) * 2 * el; fy2 = lerp(on[7], on[5] - 12, kal); if (alk > 0) { const ck = .5 + .5 * Math.sin(t * 14); fx2 = lerp(fx2, 7, alk * ck); fy2 = lerp(fy2, -27, alk); } }
  kb8Bacak(c, on[4], on[5], fx2, fy2, 3.8);
  c.globalAlpha = o.alfa != null ? ga0 * clamp(o.alfa, 0, 1) : ga0;
  // kalça + gövde
  const kl = Q.kl, gv = Q.gv;
  c.fillStyle = KB8_KD.g; c.strokeStyle = KB8_KD.cz; c.lineWidth = 1.6;
  c.beginPath(); c.ellipse(kl[0], kl[1], kl[2], kl[3], 0, 0, KB8_PI2); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(gv[0], gv[1], gv[2], gv[3], gv[4], 0, KB8_PI2); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(kl[0], kl[1], kl[2] - 1, kl[3] - 1, 0, 0, KB8_PI2); c.fill();
  c.fillStyle = KB8_KD.ac; c.beginPath(); c.ellipse(gv[0] + (ayk ? 2 : 3.6), gv[1] + (ayk ? 1 : -1), ayk ? 5 : 4.4, ayk ? 8.5 : 6.6, gv[4], 0, KB8_PI2); c.fill();   // göğüs tüyü
  c.fillStyle = 'rgba(200,185,255,.16)'; c.beginPath(); c.ellipse(gv[0] - gv[2] * .3, gv[1] - gv[3] * .45, gv[2] * .45, gv[3] * .22, gv[4] - .3, 0, KB8_PI2); c.fill();
  // yakın bacaklar
  if (pa !== 'otur' || k > 0) kb8Bacak(c, ar[0], ar[1], ar[2] + (yuru ? ad * 5 : 0), ar[3] - (yuru ? Math.max(0, -ad) * 2.5 : 0), 4.2);
  else { c.fillStyle = KB8_KD.g; c.beginPath(); c.ellipse(ar[2] - 1, ar[3], 3.6, 2.2, 0, 0, KB8_PI2); c.fill(); c.lineWidth = 1.1; c.strokeStyle = KB8_KD.cz; c.stroke(); }
  let nx2 = on[2] + (yuru ? -ad * 5 : 0), ny2 = on[3] - (yuru ? Math.max(0, ad) * 2.5 : 0);
  if (ayk) { const kal = Math.max(el * (.6 + .4 * Math.sin(t * 9)), dans * (.5 - .5 * Math.sin(t * 6.28))); nx2 = lerp(on[2], on[0] - 5, kal); ny2 = lerp(on[3], on[1] - 13, kal); if (alk > 0) { const ck = .5 + .5 * Math.sin(t * 14); nx2 = lerp(nx2, 1, alk * ck); ny2 = lerp(ny2, -27, alk); } }
  kb8Bacak(c, on[0], on[1], nx2, ny2, 4.2);
  // baş
  const hx = Q.bs[0], hy = Q.bs[1] + (yuru ? Math.abs(Math.sin(ph)) * -.8 : 0) + (ayk && dans ? -Math.abs(Math.sin(t * 6.28)) * 1.5 * dans : 0);
  c.save(); c.translate(hx, hy); c.rotate((pa === 'gerin' ? .15 * (1 - k) : 0) + Math.sin(t * 1.3) * .04 + (ayk ? -.05 : 0)); c.scale(1.17, 1.17);   // tombul iri baş
  const kp = Math.pow(Math.max(0, Math.sin(t * .9 + 2)), 30);   // kulak seğirmesi
  for (const [bx0, by0, tx, ty, ex, ey, kk] of [[-6, -5.5, -7.5, -15.5, -.6, -8.6, -1], [3, -8.4, 9.2, -15.8, 10, -4.6, 1]]) {
    c.save(); if (kk > 0) { c.translate(6, -8); c.rotate(kp * .25 + rz * .2); c.translate(-6, 8); }
    c.beginPath(); c.moveTo(bx0, by0); c.quadraticCurveTo(tx - kk * .5, ty + 1, tx, ty); c.quadraticCurveTo(tx + kk * 1.6, ty + 3, ex, ey); c.closePath(); c.fillStyle = KB8_KD.g; c.fill(); c.lineWidth = 1.4; c.strokeStyle = KB8_KD.cz; c.stroke();
    c.beginPath(); c.moveTo(lerp(bx0, ex, .25), lerp(by0, ey, .25) - .6); c.quadraticCurveTo(tx, ty + 3.4, lerp(bx0, ex, .78), lerp(by0, ey, .78) - .4); c.closePath(); c.fillStyle = KB8_KD.kulak; c.fill();
    c.restore();
  }
  c.beginPath(); c.ellipse(1, 0, 10.6, 9.2, 0, 0, KB8_PI2); c.fillStyle = KB8_KD.g; c.fill(); c.lineWidth = 1.6; c.strokeStyle = KB8_KD.cz; c.stroke();
  c.beginPath(); c.ellipse(-6.5, 4.6, 4, 3, .4, 0, KB8_PI2); c.ellipse(8.6, 4.6, 4, 3, -.4, 0, KB8_PI2); c.fill();   // yanak tüyleri
  c.fillStyle = 'rgba(200,185,255,.18)'; c.beginPath(); c.ellipse(-2.5, -5.2, 4, 1.8, -.2, 0, KB8_PI2); c.fill();
  // yüz
  const kf = t * .8 + x * .007, kirp = o.kirp != null ? o.kirp : Math.max(Math.pow(Math.max(0, Math.sin(kf)), 50), mir > .5 ? .9 : 0), kap = kirp > .7, bk = clamp(+o.bak || 0, -1, 1);
  c.fillStyle = KB8_KD.yanak; const gA = c.globalAlpha; c.globalAlpha = gA * (.5 + .3 * mut); c.beginPath(); c.ellipse(-5.8, 3.6, 2.5, 1.6, 0, 0, KB8_PI2); c.ellipse(8.3, 3.6, 2.5, 1.6, 0, 0, KB8_PI2); c.fill(); c.globalAlpha = gA;
  for (const [ex, r] of [[-2.6, 2.9], [5, 3.3]]) {
    if (mut > .6 || kap) { c.strokeStyle = '#d8ffcf'; c.lineWidth = 1.4; c.beginPath(); if (mut > .6 && !kap) { c.moveTo(ex - r * .8, -.2); c.quadraticCurveTo(ex, -r - .8, ex + r * .8, -.2); } else { c.moveTo(ex - r * .8, -1); c.quadraticCurveTo(ex, 1.4, ex + r * .8, -1); } c.stroke(); continue; }
    c.fillStyle = KB8_KD.goz; c.beginPath(); c.ellipse(ex, -.8, r, r * 1.08, 0, 0, KB8_PI2); c.fill(); c.lineWidth = .9; c.strokeStyle = KB8_KD.gozK; c.stroke();
    c.fillStyle = KB8_KD.bebek; c.beginPath(); c.ellipse(ex + .5 + bk * .7, -.6, r * .62, r * .78, 0, 0, KB8_PI2); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex - .4 + bk * .5, -2, r * .36, 0, KB8_PI2); c.fill(); c.beginPath(); c.arc(ex + 1.2 + bk * .5, .6, r * .16, 0, KB8_PI2); c.fill();
  }
  c.fillStyle = KB8_KD.burun; c.beginPath(); c.moveTo(1.2, 3); c.lineTo(3.6, 3); c.lineTo(2.4, 4.4); c.closePath(); c.fill();
  c.strokeStyle = '#d9c8ff'; c.lineWidth = .9; c.beginPath(); c.moveTo(2.4, 4.4); c.lineTo(2.4, 5.2); c.moveTo(.6, 5); c.quadraticCurveTo(1.5, 6.6 + mut, 2.4, 5.2); c.quadraticCurveTo(3.3, 6.6 + mut, 4.2, 5); c.stroke();
  c.strokeStyle = 'rgba(220,210,255,.6)'; c.lineWidth = .7; c.beginPath();
  for (const [x0, y0, x1, y1] of [[9, 3.4, 15.5, 2], [9, 4.6, 15.5, 5.4], [-5.5, 3.4, -11, 2.2], [-5.5, 4.6, -11, 5.4]]) { c.moveTo(x0, y0); c.lineTo(x1, y1); }
  c.stroke();
  if (o.sapka !== false) { c.save(); c.translate(1, -7.6); c.rotate(-.12 - rz * .25 + Math.sin(t * 2.2) * .03); kb8Koy(c, kb8KediSapkaSpr(kb8K(c, 1)), 0, 0); c.restore(); }
  c.restore();
  c.restore();
}
// baykusCiz(c, x, y, s, t, o) — uykulu baykuş; (x, y) ayaklarının bastığı yer; s = 1'de ≈ 38 birim boy.
// o = { gozL, gozR 0..1 (göz açıklığı; ikisi de verilmezse açık), uyku 0..1 (iki göz kapalı), egik (baş eğme, rad), hu 0..1 (öterken
//       gaga açılır, tüyler kabarır), kanat 0..1 (kanat sallama), yon -1|1, mutlu 0..1, bak -1..1, alfa }
const KB8_BY = { g: '#9c86c6', ac: '#f2e8ff', cz: '#5e4a8e', kn: '#8470b4', gaga: '#ffb347', disk: '#f7eeff', goz: '#2e2350', ir: '#ffd27a' };
const KB8_BO = {};
function baykusCiz(c, x, y, s, t, o) {
  o = o || KB8_BO; s = s || 1; t = Number.isFinite(t) ? t : 0;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  const yn = (o.yon || 1) < 0 ? -1 : 1, uy = clamp(+o.uyku || 0, 0, 1), hu = clamp(+o.hu || 0, 0, 1), kn = clamp(+o.kanat || 0, 0, 1), mut = clamp(+o.mutlu || 0, 0, 1);
  const ac = o.gozL == null && o.gozR == null ? 1 - uy : 0, gL = o.gozL != null ? clamp(o.gozL, 0, 1) * (1 - uy) : ac, gR = o.gozR != null ? clamp(o.gozR, 0, 1) * (1 - uy) : ac;
  const ga0 = c.globalAlpha; c.save(); if (o.alfa != null) c.globalAlpha = ga0 * clamp(o.alfa, 0, 1);
  c.translate(x, y); c.scale(s * yn, s * (1 + hu * .04 + Math.sin(t * 1.6) * .012));
  // ayaklar
  c.fillStyle = KB8_BY.gaga; c.strokeStyle = '#c47a28'; c.lineWidth = .8;
  for (const k of [-1, 1]) for (let i = -1; i <= 1; i++) { c.beginPath(); c.ellipse(k * 4.4 + i * 1.6, -.6, 1, 1.9, i * .3, 0, KB8_PI2); c.fill(); c.stroke(); }
  // kanatlar (biri sallanabilir)
  c.fillStyle = KB8_BY.kn; c.strokeStyle = KB8_BY.cz; c.lineWidth = 1.4;
  for (const k of [-1, 1]) { c.save(); c.translate(k * 10.5, -20); c.rotate(k * (.12 + (k > 0 ? kn * (1 + .4 * Math.sin(t * 10)) : 0))); c.beginPath(); c.ellipse(0, 7, 5, 10.5, 0, 0, KB8_PI2); c.fill(); c.stroke(); c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = .9; c.beginPath(); c.moveTo(-1.5, 4); c.quadraticCurveTo(0, 10, 1, 15); c.stroke(); c.restore(); c.strokeStyle = KB8_BY.cz; c.lineWidth = 1.4; }
  // gövde + karın tüyleri
  c.beginPath(); c.ellipse(0, -16, 13, 16, 0, 0, KB8_PI2); c.fillStyle = KB8_BY.g; c.fill(); c.lineWidth = 1.6; c.strokeStyle = KB8_BY.cz; c.stroke();
  c.fillStyle = KB8_BY.ac; c.beginPath(); c.ellipse(0, -10.5, 8.6, 9.6, 0, 0, KB8_PI2); c.fill();
  c.strokeStyle = '#c9b6ec'; c.lineWidth = 1;
  for (const [vx, vy] of [[-3.6, -13], [3.6, -13], [0, -9.5], [-4, -6], [4, -6], [0, -3]]) { c.beginPath(); c.moveTo(vx - 1.8, vy - 1); c.quadraticCurveTo(vx, vy + 1.4, vx + 1.8, vy - 1); c.stroke(); }
  // baş (eğilir)
  c.save(); c.translate(0, -24); c.rotate(+o.egik || 0);
  c.fillStyle = KB8_BY.g; c.beginPath(); c.ellipse(0, -2.5, 12.6, 10, 0, Math.PI, 0); c.fill();
  for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 5, -10.5); c.quadraticCurveTo(k * 11, -14, k * 13.5, -18); c.quadraticCurveTo(k * 13, -11, k * 11.5, -7); c.closePath(); c.fill(); c.lineWidth = 1.3; c.strokeStyle = KB8_BY.cz; c.stroke(); }
  c.beginPath(); c.ellipse(0, -2.5, 12.6, 10, 0, Math.PI, 0); c.lineWidth = 1.5; c.strokeStyle = KB8_BY.cz; c.stroke();
  c.fillStyle = KB8_BY.disk; c.strokeStyle = 'rgba(94,74,142,.45)'; c.lineWidth = 1;
  c.beginPath(); c.arc(-5.4, 0, 6.4, 0, KB8_PI2); c.fill(); c.stroke(); c.beginPath(); c.arc(5.4, 0, 6.4, 0, KB8_PI2); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,150,200,.55)'; c.beginPath(); c.ellipse(-8.6, 4, 2.4, 1.4, 0, 0, KB8_PI2); c.ellipse(8.6, 4, 2.4, 1.4, 0, 0, KB8_PI2); c.fill();
  const bk = clamp(+o.bak || 0, -1, 1);
  for (const [k, a] of [[-1, gL], [1, gR]]) {
    const ex = k * 5.4;
    if (a < .2 || mut > .6) { c.strokeStyle = KB8_BY.goz; c.lineWidth = 1.5; c.lineCap = 'round'; c.beginPath(); if (mut > .6 && a >= .2) { c.moveTo(ex - 3, .8); c.quadraticCurveTo(ex, -2.6, ex + 3, .8); } else { c.moveTo(ex - 3.2, -.2); c.quadraticCurveTo(ex, 2.6, ex + 3.2, -.2); c.moveTo(ex + k * 3, .2); c.lineTo(ex + k * 4.4, 1.4); } c.stroke(); continue; }
    c.save(); c.beginPath(); c.rect(ex - 5, 4.4 - 9 * a, 10, 9 * a + 1); c.clip();   // göz kapağı: üstten aralanır
    c.fillStyle = KB8_BY.ir; c.beginPath(); c.arc(ex, 0, 4.4, 0, KB8_PI2); c.fill();
    c.fillStyle = KB8_BY.goz; c.beginPath(); c.arc(ex + bk * .9, .2, 3.2, 0, KB8_PI2); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex + bk * .9 - 1.1, -1.1, 1.2, 0, KB8_PI2); c.fill(); c.beginPath(); c.arc(ex + bk * .9 + 1.2, 1.3, .55, 0, KB8_PI2); c.fill();
    c.restore();
    if (a < .98) { c.strokeStyle = KB8_BY.cz; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ex - 4.4, 4.4 - 9 * a); c.lineTo(ex + 4.4, 4.4 - 9 * a); c.stroke(); }
  }
  // gaga (öterken aralanır)
  c.fillStyle = KB8_BY.gaga; c.strokeStyle = '#c47a28'; c.lineWidth = .8;
  c.beginPath(); c.moveTo(-2, 3.2); c.lineTo(2, 3.2); c.lineTo(0, 6.4 - hu * 1.2); c.closePath(); c.fill(); c.stroke();
  if (hu > .1) { c.beginPath(); c.moveTo(-1.6, 6.4); c.lineTo(1.6, 6.4); c.lineTo(0, 6.4 + hu * 2.6); c.closePath(); c.fill(); c.stroke(); }
  c.restore();
  c.restore();
}

// ═══════════════════════════════ GECE DOSTLARI (dekor nesnesi 'geceDost') ═══════════════════════════════
// o.tur 'yarasa': dalda baş aşağı asılı 2-3 yarasa, kanatlarına sarılıp uyur, sallanır. Feza yaklaşınca sırayla uyanır, ters
//   dönüp kanat çırpar ('yarasaPir'), Feza'nın çevresinde sekiz çizerek uçuşur, sonra dalına dönüp yeniden asılır.
//   Dal: o.dalY (+ o.dalX) verilirse orası (HARITA'nın ağacı; yalnız küçük bir dal ucu çizilir), yoksa kendi eğri dal direğim.
// o.tur 'kedi': şapkalı kara kedi oturur, kuyruğunu sallar, ara sıra gerinir; Feza gelince ona bakar, miyavlar ('kediMiyav'),
//   mırlar (kalpler); Feza geçip giderken peşinden birkaç adım gelir, sonra oturur; Feza uzaklaşınca yavaşça yerine döner.
// o.tur 'baykus': direğin (ya da o.dalY dalının) tepesinde uyuklar ("z"); Feza yaklaşınca TEK gözünü açar, bakar, yumuşakça öter
//   ('baykusHu'), sonra iki gözünü açıp başını yana eğer, kanadını sallar; Feza gidince yeniden uyur. Sayılmaz, cismi yok.
function kb8DalDirekSpr(K, h, tur) {   // eğri ahşap direk + kıvrık dal kolu (yarasa) ya da tepesi yuvarlak direk (baykuş); taban (0, 0)
  return kb8Tuval('direk' + tur + h, K, -60, -h - 30, 130, h + 34, q => {
    q.fillStyle = 'rgba(22,12,44,.3)'; q.beginPath(); q.ellipse(0, 1, 16, 3, 0, 0, KB8_PI2); q.fill();
    q.lineCap = 'round';
    const yol = () => { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(-8, -h * .35, 9, -h * .65, -2, -h); };
    q.strokeStyle = '#2f2148'; q.lineWidth = 9.5; yol(); q.stroke(); q.strokeStyle = '#5c4472'; q.lineWidth = 7; yol(); q.stroke();
    q.strokeStyle = 'rgba(160,130,200,.35)'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-2.4, -4); q.bezierCurveTo(-10, -h * .35, 6.6, -h * .65, -4.4, -h + 2); q.stroke();
    if (tur === 'yarasa') {   // dal kolu sağa uzanır, ucu kıvrılır; birkaç sonbahar yaprağı
      const kol = () => { q.beginPath(); q.moveTo(-3, -h + 2); q.bezierCurveTo(16, -h - 10, 40, -h + 2, 60, -h - 4); q.bezierCurveTo(68, -h - 7, 68, -h - 16, 61, -h - 16); q.bezierCurveTo(56, -h - 16, 56, -h - 10, 60, -h - 10); };
      q.strokeStyle = '#2f2148'; q.lineWidth = 7.5; kol(); q.stroke(); q.strokeStyle = '#5c4472'; q.lineWidth = 5; kol(); q.stroke();
      const yp = ['#ffb347', '#ff8fc8', '#ffd27a', '#c39bff'];
      for (const [x, y, a, i] of [[-6, -h - 6, -.8, 0], [4, -h - 9, .5, 1], [30, -h - 5, -.4, 2], [48, -h - 6, .7, 3], [-10, -h + 3, 2.3, 1]]) { q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = yp[i]; q.beginPath(); q.ellipse(0, -4, 3, 5.4, 0, 0, KB8_PI2); q.fill(); q.strokeStyle = 'rgba(80,40,60,.4)'; q.lineWidth = .7; q.beginPath(); q.moveTo(0, 0); q.lineTo(0, -8); q.stroke(); q.restore(); }
    } else {   // baykuş tüneği: tepede yuvarlak tokmak + minik çimen
      q.fillStyle = '#6a5084'; q.strokeStyle = '#2f2148'; q.lineWidth = 1.6; q.beginPath(); q.ellipse(-2, -h, 9, 4, 0, 0, KB8_PI2); q.fill(); q.stroke();
      q.fillStyle = '#5a8f36'; for (const [x, a] of [[-6, -.4], [-2, .1], [3, .5], [6, -.2]]) { q.save(); q.translate(x, 0); q.rotate(a); q.beginPath(); q.ellipse(0, -4, 1.4, 5, 0, 0, KB8_PI2); q.fill(); q.restore(); }
    }
  });
}
function kb8YarasaKur(o) {
  const m = o.gd, n = Math.floor(o.x / T) % 2 ? 3 : 2;
  m.kendi = !Number.isFinite(o.dalY);
  m.dalY = Number.isFinite(o.dalY) ? o.dalY : o.y - 3.7 * T; m.dalX = Number.isFinite(o.dalX) ? o.dalX : o.x;
  m.yr = [];
  for (let i = 0; i < n; i++) {
    const dx = m.kendi ? [14, 32, 50][i] : [-16, 6, 24][i], sc = [1, .84, .92][i];
    m.yr.push({ i, dx, s: sc, durum: 'as', u: 0, x: 0, y: 0, hx: 0, hy: 0, yon: 1, ph: i * 2.1 + o.x * .01, bek: i * .28, opt: { yon: 1, ucus: 0, ters: true, kanat: 0, kanatAc: 0, mutlu: 0, uyku: 1, bak: 0 } });
  }
}
function kb8YarasaGuncelle(o, m, dt) {
  const uz = Math.abs(P.x - m.dalX - 20), yak = uz < 160 && DURUM === 'oyun' && !P.ucus;
  m.sogu = Math.max(0, m.sogu - dt);
  if (yak && m.sogu <= 0 && m.yr.every(b => b.durum === 'as')) { m.sogu = 9; for (const b of m.yr) { b.durum = 'bek'; b.u = 0; } kb8Sfx('yarasaPir'); }
  for (const b of m.yr) {
    b.hx = m.dalX + b.dx; b.hy = m.dalY + 12 * b.s;
    if (b.durum === 'as') { b.x = b.hx; b.y = b.hy; continue; }
    b.u += dt;
    if (b.durum === 'bek') { b.x = b.hx; b.y = b.hy; if (b.u >= b.bek) { b.durum = 'uyan'; b.u = 0; } continue; }
    if (b.durum === 'uyan') { b.x = b.hx; b.y = b.hy + smooth(clamp(b.u / .45, 0, 1)) * 6; if (b.u >= .45) { b.durum = 'uc'; b.u = 0; b.x0 = b.x; b.y0 = b.y; } continue; }
    if (b.durum === 'uc' || b.durum === 'don') {
      // Feza'nın çevresinde sekiz: merkez dal ile Feza arasında, Feza'nın baş hizasının biraz üstü
      const cx = lerp(m.dalX + 20, P.x, .65), cy = Math.min(m.dalY + 34, P.y - 95), w = 1.7, a = b.u * w + b.ph;
      const fx = cx + Math.sin(a) * (78 + b.i * 10), fy = cy + Math.sin(2 * a) * 26 - b.i * 8;
      let nx = fx, ny = fy;
      if (b.durum === 'uc') { const e = smooth(clamp(b.u / .6, 0, 1)); nx = lerp(b.x0, fx, e); ny = lerp(b.y0, fy, e); if (b.u > 4.4 + b.i * .3) { b.durum = 'don'; b.d0 = b.u; b.x1 = b.x; b.y1 = b.y; } }
      else { const e = smooth(clamp((b.u - b.d0) / 1, 0, 1)); nx = lerp(b.x1, b.hx, e); ny = lerp(b.y1, b.hy, e) - Math.sin(e * Math.PI) * 18; if (e >= 1) { b.durum = 'in'; b.u = 0; } }
      if (Math.abs(nx - b.x) > .3) b.yon = nx > b.x ? 1 : -1;
      b.x = nx; b.y = ny; continue;
    }
    if (b.durum === 'in') { b.x = b.hx; b.y = b.hy + (1 - smooth(clamp(b.u / .4, 0, 1))) * 6; if (b.u >= .4) b.durum = 'as'; }
  }
}
function kb8YarasaCiz(o, m, tm) {
  if (m.kendi) kb8Koy(g, kb8DalDirekSpr(kb8K(g, 1), Math.round(o.y - m.dalY), 'yarasa'), o.x, o.y);
  else {   // HARITA'nın dalına küçük bir dal ucu
    g.strokeStyle = '#3a2a52'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(m.dalX - 30, m.dalY + 1); g.quadraticCurveTo(m.dalX + 6, m.dalY - 4, m.dalX + 40, m.dalY); g.stroke();
  }
  for (const b of m.yr) {
    const op = b.opt, as = b.durum === 'as' || b.durum === 'bek';
    op.yon = b.yon;
    if (as || b.durum === 'in' || b.durum === 'uyan') {
      // asılı: ayaklarından sarkık, sarkaç gibi sallanır; uyanırken ters dönüp kanat açar
      let don = 0, ac = 0, uy = as ? 1 : 0;
      if (b.durum === 'uyan') { const e = smooth(clamp(b.u / .45, 0, 1)); don = e * Math.PI; ac = e; uy = 0; }
      if (b.durum === 'in') { const e = smooth(clamp(b.u / .4, 0, 1)); don = (1 - e) * Math.PI; ac = 1 - e; uy = e; }
      const sal = Math.sin(tm * 1.4 + b.ph) * .12;
      g.save(); g.translate(b.hx, m.dalY); g.rotate(sal); g.translate(-b.hx, -m.dalY);
      g.save(); g.translate(b.x, b.y); g.rotate(don); g.translate(-b.x, -b.y);
      op.ucus = 0; op.ters = true; op.kanatAc = ac; op.uyku = uy; op.mutlu = ac > .5 ? 1 : 0;
      yarasaCiz(g, b.x, b.y, b.s, tm + b.ph, op);
      g.restore(); g.restore();
      if (as && b.i === 0) { const u = (tm * .35 + o.x * .001) % 1; kb8ZCiz(g, b.x + 12 + u * 10, b.y + 6 - u * 22, 2 + u * 2, Math.sin(u * Math.PI) * .7); }
    } else {
      op.ucus = 1; op.ters = false; op.kanat = tm * 17 + b.ph; op.uyku = 0; op.mutlu = Math.sin(tm * 2 + b.ph) > .3 ? 1 : 0; op.bak = clamp((P.x - b.x) / 120, -1, 1) * b.yon;
      g.globalCompositeOperation = 'lighter'; kb8Isik(g, '#c39bff', b.x, b.y, 22 * b.s, .18); g.globalCompositeOperation = 'source-over';
      yarasaCiz(g, b.x, b.y, b.s, tm + b.ph, op);
    }
  }
}
// Kedi: poz geçişleri yumuşak (eski pozdan yenisine 0,3 sn)
function kb8KediPoz(m, poz) { if (m.poz === poz) return; m.pozOnce = m.poz; m.poz = poz; m.pozK = 0; }
function kb8KediSupurgede(o) {   // bahçedeki kedi süpürgeye bindiyse (supurge.js kendi kedisiyle çizer) artık burada yok
  if (typeof SUPURGE === 'undefined' || !SUPURGE || typeof SUPURGE.kediKaynak !== 'function') return false;
  try { return SUPURGE.kediKaynak() === o; } catch (e) { return false; }
}
function kb8KediGuncelle(o, m, dt) {
  o.kx = m.x; o.ky = m.y;
  if (kb8KediSupurgede(o)) return;
  m.pozK = Math.min(1, m.pozK + dt / .3);
  const dx = P.x - m.x, uz = Math.abs(dx), yak = uz < 170 && Math.abs(P.y - m.y) < 150 && DURUM === 'oyun' && !P.ucus;
  m.mir = Math.max(0, m.mir - dt * .7); m.sev = Math.max(0, m.sev - dt * .5); m.zip = Math.max(0, m.zip - dt * 3);
  for (const f of m.fx) if (f.t >= 0) { f.t += dt; if (f.t > f.max) f.t = -1; }
  if (yak && !m.yakin) { m.yakin = true; if (m.miyavT <= 0) { kb8Sfx('kediMiyav'); m.miyavT = 8; m.sev = 1; m.zip = 1; } }
  if (!yak && uz > 260) m.yakin = false;
  m.miyavT = Math.max(0, m.miyavT - dt);
  // hedef: Feza geçip giderse birkaç adım peşinden (evinden en çok 150 birim), çok uzaklaşınca evine
  let hedef = null;
  if (DURUM === 'oyun' && !P.ucus && uz < 420 && uz > 70 && Math.abs(P.vx) > 40 && Math.sign(P.vx) === Math.sign(dx)) hedef = clamp(P.x - Math.sign(dx) * 55, m.ev - 150, m.ev + 150);
  else if (uz > 520 && Math.abs(m.x - m.ev) > 6) hedef = m.ev;
  if (m.gerinT > 0) { m.gerinT -= dt; if (m.gerinT <= 0) kb8KediPoz(m, 'otur'); return; }
  if (hedef != null && Math.abs(hedef - m.x) > 8) {
    const hz = hedef === m.ev ? 70 : 125, adim = clamp(hedef - m.x, -hz * dt, hz * dt);
    m.x += adim; m.yon = adim > 0 ? 1 : -1; m.adim += Math.abs(adim) * .16; kb8KediPoz(m, 'yuru');
    const zy = kb8Zemin(m.x, m.y); if (zy != null && Math.abs(zy - m.y) < T * 1.5) m.y = zy;
    return;
  }
  kb8KediPoz(m, 'otur');
  if (yak) { if (Math.abs(dx) > 14) m.yon = dx > 0 ? 1 : -1; m.mir = Math.min(1, m.mir + dt * 1.5); m.kalpT -= dt; if (m.kalpT <= 0) { m.kalpT = 1.3 + Math.random() * .6; kb8Fx(m, 'kalp', m.x + m.yon * 6, m.y - 44, 1.7); } }
  else { m.bekT -= dt; if (m.bekT <= 0) { m.bekT = 7 + Math.random() * 7; if (Math.random() < .6) { kb8KediPoz(m, 'gerin'); m.gerinT = 1.8; } else m.yon = -m.yon; } }
}
function kb8KediCiz(o, m, tm) {
  if (kb8KediSupurgede(o)) return;
  const op = m.opt;
  op.yon = m.yon; op.poz = m.pozK < 1 && m.pozOnce ? m.pozOnce : m.poz; op.pozB = m.pozK < 1 && m.pozOnce ? m.poz : null; op.pozK = smooth(m.pozK);
  op.adim = m.adim; op.kuyruk = m.yakin ? 1 : .3; op.mutlu = m.sev > .4 || m.mir > .6 ? 1 : 0; op.mir = m.mir; op.zipla = m.zip; op.bak = clamp((P.x - m.x) / 120, -1, 1) * m.yon;
  g.fillStyle = 'rgba(22,12,44,.28)'; g.beginPath(); g.ellipse(m.x, m.y, 15, 3, 0, 0, KB8_PI2); g.fill();
  kediCiz(g, m.x, m.y, 1.05, m.t, op);
  kb8FxCiz(m, tm);
}
function kb8BaykusGuncelle(o, m, dt) {
  const uz = Math.abs(P.x - o.x), yak = uz < 180 && DURUM === 'oyun' && !P.ucus;
  m.huT = Math.max(0, m.huT - dt); m.hu = Math.max(0, m.hu - dt * 1.6);
  if (yak) {
    m.uyanT += dt;
    m.gR = Math.min(1, m.gR + dt * (m.uyanT > .3 ? 1.8 : 0));                 // önce tek göz aralanır
    if (m.uyanT > 1.1 && !m.otti && m.huT <= 0) { m.otti = true; m.hu = 1; m.huT = 7; m.huU = 0; kb8Sfx('baykusHu'); }
    if (m.uyanT > 2.3) m.gL = Math.min(1, m.gL + dt * 1.6);                   // sonra öbür göz
    m.egik += ((m.uyanT > 2.3 ? Math.sin(m.t * 1.3) * .32 : 0) - m.egik) * Math.min(1, dt * 3);
    m.kanat = m.uyanT > 2.6 && m.uyanT < 3.6 ? 1 : Math.max(0, m.kanat - dt * 2);
  } else {
    m.uyanT = 0; if (uz > 300) m.otti = false;
    m.gL = Math.max(0, m.gL - dt * .9); m.gR = Math.max(0, m.gR - dt * .9); m.egik *= Math.max(0, 1 - dt * 2); m.kanat = Math.max(0, m.kanat - dt * 2);
  }
  if (m.huU >= 0) { m.huU += dt / 1.6; if (m.huU >= 1) m.huU = -1; }
}
function kb8BaykusCiz(o, m, tm) {
  const tx = Number.isFinite(o.dalX) ? o.dalX : o.x, ty = m.tunekY;
  if (m.kendi) kb8Koy(g, kb8DalDirekSpr(kb8K(g, 1), Math.round(o.y - ty), 'baykus'), o.x, o.y);
  else { g.strokeStyle = '#3a2a52'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(tx - 26, ty + 2); g.quadraticCurveTo(tx, ty - 2, tx + 26, ty + 1); g.stroke(); }
  const op = m.opt; op.gozL = m.gL; op.gozR = m.gR; op.egik = m.egik; op.hu = m.hu; op.kanat = m.kanat; op.yon = P.x < o.x ? -1 : 1; op.bak = .6;
  baykusCiz(g, tx - 2, ty - 3, 1.05, m.t, op);
  if (m.gL < .1 && m.gR < .1) { const u = (m.t * .3) % 1; kb8ZCiz(g, tx + 14 + u * 12, ty - 40 - u * 24, 2.2 + u * 2.4, Math.sin(u * Math.PI) * .8); }
  if (m.huU >= 0) {   // "hu-hu": gagadan yükselen iki yumuşak halka
    g.strokeStyle = '#efe4ff';
    for (let k = 0; k < 2; k++) { const u = clamp(m.huU * 1.3 - k * .3, 0, 1); if (u <= 0 || u >= 1) continue; g.globalAlpha = Math.sin(u * Math.PI) * .7; g.lineWidth = 2 * (1 - u) + .6; g.beginPath(); g.ellipse(tx + op.yon * (8 + u * 22), ty - 26 - u * 18, 4 + u * 10, 3 + u * 7, 0, 0, KB8_PI2); g.stroke(); }
    g.globalAlpha = 1;
  }
}
TUR.kaydet('geceDost', {
  kur(o) {
    o.tur = o.tur === 'kedi' || o.tur === 'baykus' ? o.tur : 'yarasa'; o.r = 0;
    const m = o.gd = { t: (o.x * .019) % 8, sogu: 0, fx: [0, 1, 2, 3].map(() => ({ t: -1, tip: '', x: 0, y: 0, x1: 0, y1: 0, max: 1, r: 0 })) };
    if (o.tur === 'yarasa') kb8YarasaKur(o);
    else if (o.tur === 'kedi') {
      Object.assign(m, { x: o.x, y: o.y, ev: o.x, yon: -1, poz: 'otur', pozOnce: null, pozK: 1, adim: 0, mir: 0, sev: 0, zip: 0, yakin: false, miyavT: 0, kalpT: 0, bekT: 4 + (o.x % 5), gerinT: 0,
        opt: { yon: -1, poz: 'otur', pozB: null, pozK: 0, adim: 0, kuyruk: .3, mutlu: 0, mir: 0, zipla: 0, bak: 0 } });
      KB8.kediler.push(o);
    } else {
      m.kendi = !Number.isFinite(o.dalY); m.tunekY = Number.isFinite(o.dalY) ? o.dalY : o.y - 2.2 * T;
      Object.assign(m, { gL: 0, gR: 0, egik: 0, hu: 0, huT: 0, huU: -1, kanat: 0, uyanT: 0, otti: false, opt: { gozL: 0, gozR: 0, egik: 0, hu: 0, kanat: 0, yon: -1, bak: 0 } });
    }
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05);
    const m = o.gd; m.t += dt;
    if (Math.abs(P.x - o.x) > 1800) return;
    if (o.tur === 'yarasa') kb8YarasaGuncelle(o, m, dt);
    else if (o.tur === 'kedi') kb8KediGuncelle(o, m, dt);
    else kb8BaykusGuncelle(o, m, dt);
  },
  ciz(o, tm) {
    const m = o.gd;
    if (o.tur === 'yarasa') kb8YarasaCiz(o, m, tm);
    else if (o.tur === 'kedi') kb8KediCiz(o, m, tm);
    else kb8BaykusCiz(o, m, tm);
  },
});

// ═══════════════════════════════ CADI MEYDANI (FİNAL: Balkabağı Şenliği) ═══════════════════════════════
// ~35 sn (a = o.age; 120 BPM: vuruş 0,5 sn, ölçü 2 sn):
//   0-1,6   meydandaki dev kabak feneri uyanır: Feza'dan ışık süzülür, ışık içten yayılır, gözler açılır, kahkaha + zıplayış
//   1,6-5   Feza'nın yaktığı her fenerin renginde ışık sütunu (en çok 12) sırayla göğe fışkırır; her sütunun dibinde o fenerin
//           yüzüyle minik bir kabak belirir ve vuruşta hoplar
//   3-7     misafirler gelir: iskeletler soldan sekerek, kara kedi sıçrayarak, kabak dede ve Cadı Nine sağdan, hayalet teyze
//           gökten süzülerek, yarasalar yukarıdan dalarak; hayaletçikler dev kabağın çevresinde halka olur
//   7-27    dans: herkes vuruşta hoplar, kabaklar şarkı söyler, her ölçüde şeker renkli havai fişek (yıldız / kalp / halka)
//   28      DORUK (OLAY 'cadiDoruk' {o}): dev kabağın en büyük kahkahası, ışık halkası, altı fişek birden, şeker yağmuru,
//           herkes birlikte zıplar (Feza da vuruşta)
//   28-35   doruk dansı → sakin pırıltı → 35. sn OLAY 'cadiTamam' (sabah)
const KB8_TMP = [0, 0, 0];
// fişek takvimi: [zaman, x (meydan ortasından, rK ile), y (zeminden yukarı), renk sırası, biçim 0 halka · 1 yıldız · 2 kalp]
const KB8_FISEK = [];
(function () {
  for (let i = 0; i < 10; i++) { const t = 8 + i * 2; KB8_FISEK.push([t, (i % 2 ? 1 : -1) * (120 + (i * 53) % 150), 330 + (i * 37) % 100, i, i % 3]); if (i % 3 === 2) KB8_FISEK.push([t + 1, (i % 2 ? -1 : 1) * (60 + (i * 31) % 120), 380 + (i * 23) % 70, i + 3, (i + 1) % 3]); }
  for (let i = 0; i < 6; i++) KB8_FISEK.push([28 + i * .12, (i - 2.5) * 110, 340 + (i % 2) * 70, i + 1, i % 3]);
  for (let i = 0; i < 5; i++) KB8_FISEK.push([30 + i * .9, (i % 2 ? 1 : -1) * (90 + i * 40), 360 + (i * 41) % 80, i + 5, (i + 2) % 3]);
})();
const KB8_FIS_N = 22;
// misafirler: [kim, x (meydan ortasından), varış sn, giriş yönü]
const KB8_MISAFIR = [['iskelet', -345, 3.2, -1, 1], ['iskelet', -285, 3.6, -1, 2], ['kiz', -228, 4.0, -1, 0], ['kedi', -100, 4.4, -1, 0], ['dede', 205, 3.8, 1, 0], ['nine', 284, 4.2, 1, 0], ['iskelet', 352, 4.8, 1, 4]];
function kb8MeydanX(o, dx) { return o.x + dx * o.rK; }
function kb8MeydanHYer(o, k, a, out) {   // hayaletçik k'nın dans yeri: dev kabağın çevresinde dönen halka (önden geçen öne çizilir)
  const n = Math.max(5, KB8.takipN), dor = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5, an = a * (dor ? 1.6 : .9) + k / n * KB8_PI2;
  const cx = kb8MeydanX(o, 10), cy = o.y - (dor ? 215 : 172) - Math.abs(Math.sin(a * Math.PI * 2 + k)) * 6, rx = (dor ? 200 : 165) * o.rK, ry = dor ? 50 : 42;
  out[0] = cx + Math.cos(an) * rx; out[1] = cy + Math.sin(an) * ry; out[2] = Math.sin(an);
}
function kb8HDans(o, m, dt) {
  const M = KB8.meydan, a = cadiFinalAn(), nb = cadiFinalNabiz();
  let tx = P.x - (P.f || 1) * (54 + m.k * 36), ty = P.y - 64; m.on = false;
  if (M && M.basla) { kb8MeydanHYer(M, m.k, a, KB8_TMP); tx = KB8_TMP[0]; ty = KB8_TMP[1]; m.on = KB8_TMP[2] > .1; }
  const om = a < 8 ? 3.2 : 5, ax = om * om * (tx - m.x) - 2 * .9 * om * m.vx, ay = om * om * (ty - m.y) - 2 * .9 * om * m.vy;
  m.vx += ax * dt; m.vy += ay * dt; const sp = Math.hypot(m.vx, m.vy); if (sp > 1000) { m.vx *= 1000 / sp; m.vy *= 1000 / sp; }
  m.x += m.vx * dt; m.y += m.vy * dt;
  kb8HDuygu(o, m, dt, 0);
  m.mut = 1; m.el = Math.max(m.el, .45 + .55 * nb);
  // dört ölçüde bir sırayla takla; dorukta hepsi birden
  const b = Math.floor((a + m.k * .5) / 4);
  if (m.loopU < 0 && b !== m.dansB && a > 8) { m.dansB = b; m.loopU = 0; m.loopD = m.k % 2 ? -1 : 1; }
  if (a >= KB8_FIN.DORUK && !m.dorukL) { m.dorukL = true; m.loopU = 0; m.kik = 1; }
}
function kb8KolonSpr(renk) {   // dikey ışık sütunu: dipte parlak, yukarı doğru söner, yanları yumuşak (renk başına bir kez)
  return kb8Tuval('kolon' + renk, 1, 0, 0, 24, 160, q => {
    const gr = q.createLinearGradient(0, 160, 0, 0);
    gr.addColorStop(0, mixc(renk, '#ffffff', .6, .95)); gr.addColorStop(.1, mixc(renk, '#ffffff', .25, .8)); gr.addColorStop(.5, mixc(renk, renk, 0, .4)); gr.addColorStop(1, mixc(renk, renk, 0, 0));
    q.fillStyle = gr; q.fillRect(0, 0, 24, 160);
    q.globalCompositeOperation = 'destination-in';
    const yg = q.createLinearGradient(0, 0, 24, 0); yg.addColorStop(0, 'rgba(0,0,0,0)'); yg.addColorStop(.5, 'rgba(0,0,0,1)'); yg.addColorStop(1, 'rgba(0,0,0,0)');
    q.fillStyle = yg; q.fillRect(0, 0, 24, 160);
  });
}
function kb8SekerSpr(renk, K) {   // şeker yağmuru: iki ucu bükülmüş sargılı şeker
  return kb8Tuval('seker' + renk, K, -9, -5, 18, 10, q => {
    q.fillStyle = renk; q.strokeStyle = 'rgba(80,40,90,.45)'; q.lineWidth = .7;
    for (const k of [-1, 1]) { q.beginPath(); q.moveTo(k * 3.5, 0); q.lineTo(k * 8.4, -3.6); q.lineTo(k * 7.4, 0); q.lineTo(k * 8.4, 3.6); q.closePath(); q.fill(); q.stroke(); }
    q.beginPath(); q.ellipse(0, 0, 4.6, 3.6, 0, 0, KB8_PI2); q.fill(); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,.75)'; q.lineWidth = 1; q.beginPath(); q.moveTo(-2.4, 2.6); q.lineTo(.4, -3); q.moveTo(.6, 2.8); q.lineTo(3, -2); q.stroke();
  });
}
function kb8MeydanBasla(o) {
  if (o.basla) return;
  const v = kb8V(); o.basla = true; o.age = 0; o.tamam = false; o.doruk = false; o.done = false;
  if (v) v.final = true;
  P.kilit = Math.max(P.kilit || 0, KB8_FIN.SURE + 1); P.vx = 0; P.buf = 0;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  lightTarget = 1;
  // sütunlar: Feza'nın yaktığı fenerlerin renk ve yüzleri (hiç yoksa yine üç sütun)
  o.sutun.length = 0;
  for (const n of NESNELER) if (n.tip === 'kabakFener' && n.yandi) o.sutun.push({ renk: n.rk, yuz: n.yuz, sekil: n.sekil, ton: n.ton, aks: n.aks, hop: 0, hopV: 0 });
  for (let i = o.sutun.length; i < 3; i++) o.sutun.push({ renk: KB8_RENK[i * 4], yuz: i * 4, sekil: i % 3, ton: i % 4, aks: '', hop: 0, hopV: 0 });
  o.ox = P.x + (P.f || 1) * 6; o.oy = P.y - 38;
  for (const h of KB8.hayaletler) kb8HDansaKat(h);
  kb8MeydanKadraj(o);
  kb8Sfx('cadiFinal');
  OLAY.emit('cadiFinal', { o, duration: KB8_FIN.SURE, box: o.box });
}
function kb8MeydanKadraj(o) {   // kar.js kyKadraj gibi: yatayda geniş, dikeyde dar kutu; Feza da içinde
  const asp = typeof W !== 'undefined' && typeof H !== 'undefined' && H > 0 ? W / H : 1.33;
  const gen = clamp(Math.min(asp >= 1.2 ? 380 : asp >= .95 ? 330 : 290, (typeof VW !== 'undefined' && VW > 0 ? VW / 2 - 40 : 380)), 220, 380);
  o.gen = gen; o.rK = gen / 380;
  const b = o.box; b.x0 = Math.min(o.x - gen, P.x - 90); b.x1 = Math.max(o.x + gen, P.x + 90); b.y0 = o.y - 520; b.y1 = o.y + (asp >= .95 ? 40 : 20);
}
function kb8SupurgeVar() { return !!(TUR.al('supurgeMini') && NESNELER.some(n => n.tip === 'supurgeMini')); }
TUR.kaydet('cadiMeydan', {
  kur(o) {
    o.basla = false; o.age = 0; o.r = o.r || 170; o.ry = o.ry || 30; o.doruk = false; o.t = 0; o.gen = 380; o.rK = 1; o.sutun = [];
    o.box = { x0: o.x - 420, x1: o.x + 420, y0: o.y - 520, y1: o.y + 40 }; o.ev = { doruk: false, tamam: false }; o.fisI = 0; o.ox = o.x; o.oy = o.y;
    o.dev = { hop: 0, hopV: 0, sq: 0, opt: { yuz: 0, yanik: 0, sekil: 0, ton: 0, aks: '', mutlu: 0, kirp: 0, ziplama: 0, bak: 0, bakY: 0, agiz: 0, uyku: 1, yayil: undefined } };
    o.kOpt = { yuz: 0, yanik: 1, sekil: 0, ton: 0, aks: '', mutlu: 0, kirp: 0, ziplama: 0, bak: 0, agiz: 0, isik: true };
    o.mOpt = { dans: 1, faz: 0, kafa: 0, yon: 1, tip: 0, mutlu: 0, sevinc: 0, el: 0, ayakta: true, poz: 'ayakta', alkis: 0, karistir: 0 };
    o.hOpt = { teyze: true, yon: -1, mutlu: 1, el: .6, kik: 0, iz: 0, egim: 0, salla: 0 };
    o.yOpt = { ucus: 1, kanat: 0, yon: 1, mutlu: 1 };
    o.kyOpt = { dans: 1, faz: 0, nabiz: 0, parla: 0, isin: 0 };
    KB8.meydan = o;
  },
  dokun(o) {
    const v = kb8V();
    if (P.ucus || (v && !v.supurge && kb8SupurgeVar() && !NESNELER.some(n => n.tip === 'supurgeMini' && n.done))) { o.dokundu = false; return; }
    kb8MeydanBasla(o);
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, .05); o.t += dt;
    if (!o.isindi && Math.abs(P.x - o.x) < 2600) {   // yaklaşırken önbellekleri kareye yayarak ısıt
      o.isP = o.isP || 0; const K = kb8K(g, 1);
      if (o.isP < KB8_RENK.length) { kb8KolonSpr(KB8_RENK[o.isP]); if (!o.isP) kb8KolonSpr('#ffffff'); }
      else if (o.isP < KB8_RENK.length + KB8_SEKER.length) kb8SekerSpr(KB8_SEKER[o.isP - KB8_RENK.length], K);
      else if (o.isP === 20) { kb8GovdeSpr(0, -1, kb8K(g, 2.4)); kb8GovdeSpr(0, 0, kb8K(g, 2.4)); }
      else if (o.isP === 21) { kb8KediSapkaSpr(kb8K(g, 1.15)); kb8Isilti(); }
      else o.isindi = true;
      o.isP++;
    }
    const D = o.dev;
    if (D.hop > 0) { D.hopV -= 1400 * dt; D.hop += D.hopV * dt; if (D.hop <= 0) { D.sq = -Math.min(.35, -D.hopV / 1300); D.hop = 0; D.hopV = 0; } }
    D.sq *= Math.max(0, 1 - dt * 6);
    if (!o.basla) return;
    const a0 = o.age; o.age += dt; const a = o.age, ev = o.ev, nb = cadiFinalNabiz();
    kb8MeydanKadraj(o);
    if (a0 < 1.4 && a >= 1.4) { D.hop = .01; D.hopV = 420; ripples.push({ x: kb8MeydanX(o, 10), y: o.y - 60, r: 0, life: 1.8 }); burst(kb8MeydanX(o, 10), o.y - 70, 30, ['#ffd27a', '#ff8fc8', '#7dffc4', '#ffffff', '#ffb347'], 200, 1.4, 7); }
    // dev kabak ve minik kabaklar vuruşta hoplar
    const vb0 = Math.floor(a0 / KB8_FIN.VUR), vb = Math.floor(a / KB8_FIN.VUR);
    if (vb !== vb0 && a > 6) {
      if (vb % 4 === 0 && D.hop <= 0) { D.hop = .01; D.hopV = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5 ? 330 : 190; }
      o.sutun.forEach((k, i) => { if ((vb + i) % 2 === 0 && k.hop <= 0) { k.hop = .01; k.hopV = 150 + (i % 3) * 20; } });
    }
    for (const k of o.sutun) if (k.hop > 0) { k.hopV -= 1500 * dt; k.hop += k.hopV * dt; if (k.hop < 0) { k.hop = 0; k.hopV = 0; } }
    // fişekler (patlama anında ses)
    for (let i = 0; i < KB8_FISEK.length; i++) { const tb = KB8_FISEK[i][0] + .7; if (a0 < tb && a >= tb) kb8Sfx('fisek', i); }
    if (!ev.doruk && a >= KB8_FIN.DORUK) {
      ev.doruk = true; o.doruk = true; lightTarget = 1; kb8Sfx('cadiDoruk'); OLAY.emit('cadiDoruk', { o });
      D.hop = .01; D.hopV = 480; ripples.push({ x: kb8MeydanX(o, 10), y: o.y - 80, r: 0, life: 2.6 });
      burst(kb8MeydanX(o, 10), o.y - 120, 40, ['#ffd27a', '#ff8fc8', '#7dffc4', '#c39bff', '#e8ff8a', '#ffffff'], 240, 2, 7);
    }
    if (o.doruk && a > KB8_FIN.DORUK + 5) o.doruk = false;
    // dorukta Feza iki vuruşta bir sevinçle zıplar (dans pozları feza.js'te)
    if (a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 4.5 && P.ground && !P.ucus && Math.floor(a0 / (KB8_FIN.VUR * 2)) < Math.floor(a / (KB8_FIN.VUR * 2))) {
      P.vy = -540; P.ground = false; burst(P.x, P.y - 4, 6, ['#ffd27a', '#ff8fc8', '#ffffff'], 90, .7, 5);
    }
    if (a >= KB8_FIN.SURE && !ev.tamam) { ev.tamam = true; o.tamam = true; o.done = true; OLAY.emit('cadiTamam', { o }); }
  },
  ciz(o, tm) {
    const a = o.basla ? o.age : 0, nb = cadiFinalNabiz();
    if (o.basla) { kb8Fisekler(o, a); kb8Kolonlar(o, tm, a, nb); }
    kb8DevKabak(o, tm, a, nb);
    if (o.basla) { kb8KabakYuzDans(o, tm, a, nb); kb8Misafirler(o, tm, a, nb); kb8Yarasalar(o, tm, a, nb); }
  },
  cizOn(o, tm) {
    if (!o.basla) return;
    kb8SekerYagmuru(o, tm, o.age);
  },
});
// ── Dev kabak feneri: sönükken uyur (Feza yaklaşınca içinde ışık nefes alır); finalin başında yanıp kahkaha atar, sonra şarkı söyler
function kb8DevKabak(o, tm, a, nb) {
  const D = o.dev, op = D.opt, x = kb8MeydanX(o, 10), y = o.y, s = 2.45, h = 44 * s, cy = y - h * .5;
  const yan = o.basla ? smooth(clamp((a - .35) / 1.05, 0, 1)) : 0;
  const isl = kb8Isilti();
  g.globalCompositeOperation = 'lighter';
  if (yan > 0) { kb8IsikE(g, '#ffb347', x, y - 4, 250, 40, yan * (.4 + .15 * nb)); kb8Isik(g, '#ffcf7a', x, cy - D.hop, 190, yan * (.26 + .14 * nb)); kb8Isik(g, '#ff8fc8', x, cy - 30, 260, yan * .08); }
  else { const yak = clamp(1 - Math.abs(P.x - x) / 700, 0, 1), n = .5 + .5 * Math.sin(tm * 1.8); for (const k of [-1, 1]) kb8Isik(g, '#ffcf7a', x + k * 10 * s, cy - 4 * s, 22, .1 + yak * .3 * n); kb8Isik(g, '#ffd27a', x, cy, 90, .06 + yak * .1 * n); }
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = 'rgba(22,12,44,.32)'; g.beginPath(); g.ellipse(x, y, 62 * (1 - clamp(D.hop / 140, 0, .5) * .4), 8, 0, 0, KB8_PI2); g.fill();
  const dor = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5;
  op.yanik = yan; op.yayil = o.basla && a < 1.4 ? yan : undefined; op.uyku = !o.basla || a < 1.4 ? 1 : 0;
  op.ziplama = D.hop > 0 ? clamp(D.hopV / 1300, -.25, .3) : D.sq + (o.basla ? -nb * .05 : Math.sin(tm * 1.4) * .025);
  op.mutlu = dor || (a > 1.4 && a < 3) ? 1 : .2; op.agiz = o.basla ? (dor ? .7 + .3 * Math.sin(tm * 20) : .3 + .5 * nb) : 0;
  op.yuz = a < 3 || dor ? 3 : 0; op.bak = clamp((P.x - x) / 300, -1, 1); op.bakY = .3;
  op.kirp = o.basla && a >= 1.4 && a < 1.55 ? 1 - smooth((a - 1.4) / .15) : null;
  kabakCiz(g, x, y - D.hop, s, tm, op);
  if (!o.basla) return;
  g.globalCompositeOperation = 'lighter';
  if (a < .5) {   // Feza'dan dev kabağa süzülen ışık
    for (let j = 5; j >= 0; j--) { const u = clamp(a / .5 - j * .06, 0, 1), e = smooth(u), bx = lerp(o.ox, x, e), by = lerp(o.oy, y - h - 10, e) - Math.sin(e * Math.PI) * 90; kb8Isik(g, j ? '#ff8fc8' : '#ffe9a8', bx, by, j ? 10 - j : 20, j ? .45 * (1 - j / 6) : .9); if (!j) { g.globalAlpha = .95; g.drawImage(isl, bx - 9, by - 9, 18, 18); g.globalAlpha = 1; } }
  }
  if (a >= 1.4 && a < 3) {   // uyanış halkası
    const u = (a - 1.4) / 1.6, e = 1 - Math.pow(1 - u, 2.4);
    g.globalAlpha = (1 - u) * .7; g.strokeStyle = '#ffd27a'; g.lineWidth = 4 * (1 - u) + 1; g.beginPath(); g.ellipse(x, cy, 60 + e * 260, 40 + e * 120, 0, 0, KB8_PI2); g.stroke(); g.globalAlpha = 1;
    if (u < .25) kb8Isik(g, '#fff2c8', x, cy, 200, (1 - u * 4) * .5);
  }
  if (a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 2.4) {   // doruk halkası
    const u = (a - KB8_FIN.DORUK) / 2.4, e = 1 - Math.pow(1 - u, 2.2);
    for (let k = 0; k < 2; k++) { g.globalAlpha = (1 - u) * .6; g.strokeStyle = k ? '#ff8fc8' : '#7dffc4'; g.lineWidth = 3; g.beginPath(); g.ellipse(x, cy, 60 + e * (300 + k * 80), 40 + e * (130 + k * 30), 0, 0, KB8_PI2); g.stroke(); }
    g.globalAlpha = 1;
  }
  g.globalCompositeOperation = 'source-over';
}
// ── Işık sütunları: her yanan fenerin renginde, sırayla fışkırır; dipte o fenerin yüzüyle minik kabak hoplar
function kb8Kolonlar(o, tm, a, nb) {
  const n = o.sutun.length, son = a > KB8_FIN.SURE - 2.5 ? 1 - smooth(clamp((a - KB8_FIN.SURE + 2.5) / 2.5, 0, 1)) * .7 : 1, isl = kb8Isilti(), K = kb8K(g, .52);
  for (let i = 0; i < n; i++) {
    const k = o.sutun[i], t0 = 1.6 + i * .2, u = a - t0; if (u <= 0) continue;
    let dx = n > 1 ? lerp(-345, 345, i / (n - 1)) : 200; if (Math.abs(dx - 10) < 75) dx += dx < 10 ? -75 : 75;
    const x = kb8MeydanX(o, dx), y = o.y - 2, cik = smooth(clamp(u / .9, 0, 1)), L = 520 * cik * (1 + .06 * Math.sin(tm * 1.3 + i)), sal = Math.sin(tm * .9 + i * 1.7) * .035;
    g.save(); g.globalCompositeOperation = 'lighter';
    g.translate(x, y); g.rotate(sal); g.globalAlpha = Math.min(1, (.5 + .22 * nb) * son); g.drawImage(kb8KolonSpr(k.renk), -21, -L, 42, L); g.globalAlpha = Math.min(1, .35 * son); g.drawImage(kb8KolonSpr('#ffffff'), -6, -L * .8, 12, L * .8); g.rotate(-sal);
    if (u < .9) { const e = cik; kb8Isik(g, '#ffffff', Math.sin(sal) * L, -L, 14, .9 * (1 - e * .3)); }   // fışkıran uç
    for (let j = 0; j < 3; j++) { const v = ((tm * .4 + j / 3 + i * .13) % 1), py = -v * L * .9, r = 3 + 2 * Math.sin(v * Math.PI); g.globalAlpha = Math.sin(v * Math.PI) * .8 * son; g.drawImage(isl, Math.sin(v * 8 + i) * 5 - r, py - r, r * 2, r * 2); }
    kb8IsikE(g, k.renk, 0, 0, 34, 8, .5 * son);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.restore();
    const ks = .52 * kb8GeriEase(clamp(u / .5, 0, 1)), op = o.kOpt;   // minik kabak "pıt" diye belirir
    op.yuz = k.yuz; op.sekil = k.sekil; op.ton = k.ton; op.aks = k.aks; op.mutlu = k.hop > 3 || o.doruk ? 1 : .3; op.agiz = .3 + .5 * nb; op.ziplama = k.hop > 0 ? clamp(k.hopV / 900, -.2, .3) : 0;
    op.bak = clamp((P.x - x) / 300, -1, 1); op.kirp = null;
    if (ks > .02) kabakCiz(g, x, y - k.hop, ks, tm + i, op);
  }
}
// ── Şeker renkli havai fişekler: yükselen ışık izi → halka / yıldız / kalp biçiminde patlama, kıvılcımlar yavaşça süzülüp söner
function kb8Fisekler(o, a) {
  const isl = kb8Isilti();
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < KB8_FISEK.length; i++) {
    const F = KB8_FISEK[i], u = a - F[0]; if (u < 0 || u > 2.6) continue;
    const bx = kb8MeydanX(o, F[1]), by = o.y - F[2], renk = KB8_SEKER[F[3] % KB8_SEKER.length], r2 = KB8_SEKER[(F[3] + 2) % KB8_SEKER.length];
    if (u < .7) {   // yükseliş
      const e = 1 - Math.pow(1 - u / .7, 2), x = bx + Math.sin(u * 9 + i) * 4, y = lerp(o.y - 10, by, e);
      for (let j = 0; j < 5; j++) kb8Isik(g, renk, x, y + j * 10, 8 - j, .5 * (1 - j / 5));
      kb8Isik(g, '#ffffff', x, y, 6, .9);
      continue;
    }
    const v = (u - .7) / 1.9, e = 1 - Math.pow(1 - Math.min(1, v * 1.4), 3), sn = v < .7 ? 1 : 1 - (v - .7) / .3, R = 128 * e;
    if (v < .14) { kb8Isik(g, '#ffffff', bx, by, 90, (1 - v / .14) * .6); kb8Isik(g, renk, bx, by, 160, (1 - v / .14) * .3); }
    for (let k = 0; k < KB8_FIS_N; k++) {
      const q = k / KB8_FIS_N, an = q * KB8_PI2; let dx, dy;
      if (F[4] === 2) { const tt = an; dx = 16 * Math.pow(Math.sin(tt), 3) / 16; dy = -(13 * Math.cos(tt) - 5 * Math.cos(2 * tt) - 2 * Math.cos(3 * tt) - Math.cos(4 * tt)) / 16; }   // kalp
      else if (F[4] === 1) { const kol = (q * 5) % 1, rr = 1 - .55 * Math.abs(kol - .5) * 2; dx = Math.cos(an - Math.PI / 2) * rr; dy = Math.sin(an - Math.PI / 2) * rr; }   // yıldız
      else { dx = Math.cos(an); dy = Math.sin(an); }
      const x = bx + dx * R, y = by + dy * R + v * v * 34, rr = (k % 2 ? 4.4 : 6) * (1 - v * .5);
      kb8Isik(g, k % 3 ? renk : r2, x, y, 16, .6 * sn);
      if (v < .5 && !(k & 1)) kb8Isik(g, renk, bx + dx * R * .7, by + dy * R * .7, 9, (.5 - v) * .8);   // kıvılcımın izi
      g.globalAlpha = .9 * sn * (.6 + .4 * Math.sin(a * 20 + k)); g.drawImage(isl, x - rr, y - rr, rr * 2, rr * 2); g.globalAlpha = 1;
    }
  }
  g.restore();
}
// ── Misafirler: iskeletler, kara kedi, kabak dede, Cadı Nine, hayalet teyze (çizicileri yoksa sade yedek)
function kb8Misafirler(o, tm, a, nb) {
  const dor = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5, vur = a / KB8_FIN.VUR, M = o.mOpt;
  for (let i = 0; i < KB8_MISAFIR.length; i++) {
    const [kim, dx0, tv, yan, tip] = KB8_MISAFIR[i], gel = smooth(clamp((a - tv + 1.6) / 1.6, 0, 1)); if (gel <= 0) continue;
    const hx = kb8MeydanX(o, dx0), x = lerp(hx + yan * (o.gen + 220), hx, gel), yon = gel < 1 ? -yan : (P.x < x ? -1 : 1);
    const b = ((vur + i * .5) % 2) / 2, hop = gel < 1 ? Math.abs(Math.sin(a * 8 + i)) * 14 : (b < .5 ? Math.sin(b / .5 * Math.PI) * (dor ? 26 : 9) : 0);
    const y = o.y - hop;
    g.fillStyle = 'rgba(22,12,44,.25)'; g.beginPath(); g.ellipse(x, o.y, kim === 'nine' ? 28 : 18, 3.5, 0, 0, KB8_PI2); g.fill();
    if (kim === 'iskelet') {
      M.tip = tip; M.dans = gel >= 1 ? 1 : .4; M.faz = vur; M.kafa = nb; M.yon = yon; M.mutlu = dor ? 1 : 0; M.el = 0; M.alkis = 0;
      if (typeof iskeletCiz === 'function') { try { iskeletCiz(g, x, y, tip === 4 ? .56 : .66, tm + i, M); } catch (e) { kb8IskeletYedek(x, y, tm + i, nb); } } else kb8IskeletYedek(x, y, tm + i, nb);
    } else if (kim === 'kedi') {
      const ko = KB8_KMO; ko.yon = yon; ko.ayakta = true; ko.dans = 1; ko.mutlu = dor || b < .25 ? 1 : 0; ko.el = gel >= 1 ? .5 + .5 * nb : 0; ko.zipla = hop > 4 ? .6 : 0; ko.kuyruk = 1;
      kediCiz(g, x, y, 1.15, tm * 1.0 + 3, ko);
    } else if (kim === 'dede') {
      M.dans = gel >= 1 ? 1 : .3; M.faz = vur; M.yon = yon; M.sevinc = dor ? 1 : .6; M.el = 0; M.alkis = dor ? 1 : 0;
      if (typeof komsuCiz === 'function') { try { komsuCiz(g, 'kabakDede', x, y, .8, tm + i, M); } catch (e) { kb8DedeYedek(o, x, y, tm, nb); } } else kb8DedeYedek(o, x, y, tm, nb);
    } else if (kim === 'nine' || kim === 'kiz') {   // Cadı Nine ve Cadı Kız (kazan.js cadiCiz; faz = dans saati sn, saniyede iki vuruş)
      M.tip = kim; M.dans = gel >= 1 ? 1 : .3; M.faz = a; M.yon = yon; M.sevinc = dor ? 1 : .5; M.el = 0; M.alkis = 0; M.karistir = 0;
      if (typeof cadiCiz === 'function') { try { cadiCiz(g, x, y, kim === 'nine' ? .7 : .72, tm + i, M); } catch (e) { kb8NineYedek(x, y, tm); } } else kb8NineYedek(x, y, tm);
    }
  }
  // hayalet teyze gökten süzülür, dede ile Nine'nin üstünde sallanır
  const tg = smooth(clamp((a - 3.4) / 2, 0, 1));
  if (tg > 0) {
    const x = kb8MeydanX(o, 244) + Math.sin(a * 1.6) * 16, y = lerp(o.y - 520, o.y - 128, tg) + Math.sin(a * Math.PI * 2) * 5, h = o.hOpt;
    h.yon = Math.sin(a * .8) * .6 - .3; h.el = .5 + .5 * nb; h.kik = dor ? 1 : 0; h.iz = Math.sin(a * 1.6 + 1.5) * .4; h.salla = dor ? 1 : 0;
    hayaletCiz(g, x, y, 1.55, tm, h);
  }
}
const KB8_KMO = { yon: 1, ayakta: true, dans: 1, mutlu: 0, el: 0, zipla: 0, kuyruk: 1 };
// ── KABAKYUZ'un canlanan kabağı (mini oyun 1'in hatırası): dev kabağın yanında dans eder
function kb8KabakYuzDans(o, tm, a, nb) {
  const gel = smooth(clamp((a - 2.2) / 1.2, 0, 1)); if (gel <= 0) return;
  const x = kb8MeydanX(o, 128), y = o.y - (1 - gel) * 0 , op = o.kyOpt, dor = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5;
  op.faz = a; op.nabiz = nb; op.parla = dor ? 1 : 0; op.isin = dor ? 1 : 0; op.dans = 1; op.alpha = gel;
  if (typeof kabakYuzCiz === 'function') { try { kabakYuzCiz(g, x, y, .4 * (.6 + .4 * gel), tm, op); return; } catch (e) {} }
  const ko = o.kOpt; ko.yuz = 0; ko.sekil = 0; ko.ton = 0; ko.aks = ''; ko.mutlu = 1; ko.agiz = .4 + .5 * nb; ko.ziplama = 0; ko.kirp = null;
  kabakCiz(g, x, y - Math.abs(Math.sin(a * Math.PI)) * 8, 1.3 * gel, tm, ko);
}
// ── Yarasalar: yukarıdan dalıp gelir, göğün altında sekiz çizerek uçuşur; dorukta dev kabağın çevresinde döner
function kb8Yarasalar(o, tm, a, nb) {
  const gel = smooth(clamp((a - 4) / 2, 0, 1)); if (gel <= 0) return;
  const dor = a >= KB8_FIN.DORUK && a < KB8_FIN.DORUK + 5, op = o.yOpt;
  for (let i = 0; i < 4; i++) {
    const ph = a * 1.1 + i * KB8_PI2 / 4;
    let x = kb8MeydanX(o, 10) + Math.sin(ph) * 300 * o.rK, y = o.y - 300 + Math.sin(2 * ph) * 50 - i * 6;
    if (dor) { const an = a * 2 + i * KB8_PI2 / 4; x = lerp(x, kb8MeydanX(o, 10) + Math.cos(an) * 130, .8); y = lerp(y, o.y - 150 + Math.sin(an) * 50, .8); }
    y = lerp(o.y - 640 - i * 40, y, gel);
    const vx = Math.cos(ph) * 300; op.yon = vx >= 0 ? 1 : -1; op.kanat = tm * 16 + i * 1.3; op.mutlu = Math.sin(a * 2 + i) > 0 ? 1 : 0;
    g.globalCompositeOperation = 'lighter'; kb8Isik(g, '#c39bff', x, y, 24, .2); g.globalCompositeOperation = 'source-over';
    yarasaCiz(g, x, y, .95, tm + i, op);
  }
}
// ── Şeker yağmuru (doruk): sargılı şekerler ve yıldızcıklar sallanarak düşer
const KB8_YAGMUR_N = 40;
function kb8SekerYagmuru(o, tm, a) {
  const u0 = a - KB8_FIN.DORUK; if (u0 < 0 || u0 > 6.5) return;
  const vw = VW, vh = VW * H / Math.max(1, W), K = kb8K(g, 1.2), sn = u0 > 5 ? 1 - (u0 - 5) / 1.5 : 1;
  for (let k = 0; k < KB8_YAGMUR_N; k++) {
    const t0 = (k * .37) % 2.2, u = u0 - t0; if (u < 0) continue;
    const x = cam.x + ((k * .618 * vw) % vw) + Math.sin(u * 2 + k) * 22, y = cam.y - 20 + u * (90 + (k % 5) * 18);
    if (y > cam.y + vh + 20) continue;
    g.save(); g.globalAlpha = sn; g.translate(x, y); g.rotate(u * (1.5 + (k % 3)) + k); const sc = 1.1 + (k % 3) * .3; g.scale(sc, sc);
    if (k % 4 === 3) { g.fillStyle = KB8_SEKER[k % KB8_SEKER.length]; kb8YildizYol(g, 0, 0, 5, .48); g.fill(); }
    else kb8Koy(g, kb8SekerSpr(KB8_SEKER[k % KB8_SEKER.length], K), 0, 0);
    g.restore();
  }
}
// ── Yedek çizimler (başka dosyanın çizicisi yüklenemezse; sade ama sevimli)
function kb8IskeletYedek(x, y, t, nb) {
  g.save(); g.translate(x, y); g.strokeStyle = '#f4f0ff'; g.lineWidth = 4; g.lineCap = 'round';
  const k = Math.sin(t * 6.28) * .5;
  g.beginPath(); g.moveTo(0, -18); g.lineTo(0, -40); g.moveTo(0, -20); g.lineTo(-7, 0); g.moveTo(0, -20); g.lineTo(7, 0); g.moveTo(0, -36); g.lineTo(-12, -46 - k * 6); g.moveTo(0, -36); g.lineTo(12, -46 + k * 6); g.stroke();
  g.fillStyle = '#f4f0ff'; g.beginPath(); g.arc(0, -52, 11, 0, KB8_PI2); g.fill();
  g.fillStyle = '#3b2d5e'; g.beginPath(); g.ellipse(-4, -53, 2.4, 3, 0, 0, KB8_PI2); g.ellipse(4, -53, 2.4, 3, 0, 0, KB8_PI2); g.fill();
  g.strokeStyle = '#3b2d5e'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-3, -47); g.quadraticCurveTo(0, -45, 3, -47); g.stroke();
  g.restore();
}
function kb8DedeYedek(o, x, y, t, nb) {
  g.save(); g.translate(x, y); g.fillStyle = '#6a8f4a'; g.beginPath(); g.ellipse(0, -16, 13, 17, 0, 0, KB8_PI2); g.fill(); g.restore();
  const op = o.kOpt; op.yuz = 0; op.sekil = 1; op.ton = 0; op.aks = ''; op.mutlu = 1; op.agiz = .4; op.ziplama = 0; op.kirp = null; kabakCiz(g, x, y - 30, .7, t, op);
}
function kb8NineYedek(x, y, t) {
  g.save(); g.translate(x, y);
  g.fillStyle = '#6a42b8'; g.beginPath(); g.moveTo(-18, 0); g.lineTo(-10, -40); g.lineTo(10, -40); g.lineTo(18, 0); g.closePath(); g.fill();
  g.fillStyle = '#ffd9c2'; g.beginPath(); g.arc(0, -50, 11, 0, KB8_PI2); g.fill();
  g.fillStyle = '#3b2d5e'; g.beginPath(); g.arc(-4, -51, 1.8, 0, KB8_PI2); g.arc(4, -51, 1.8, 0, KB8_PI2); g.fill();
  g.fillStyle = '#ff9fc8'; g.beginPath(); g.ellipse(-7, -46, 2.4, 1.4, 0, 0, KB8_PI2); g.ellipse(7, -46, 2.4, 1.4, 0, 0, KB8_PI2); g.fill();
  g.fillStyle = '#5a35a0'; g.beginPath(); g.ellipse(0, -59, 18, 4, 0, 0, KB8_PI2); g.fill(); g.beginPath(); g.moveTo(-10, -60); g.lineTo(4, -88); g.lineTo(10, -60); g.closePath(); g.fill();
  g.restore();
}

// ═══════════════════════════════ dokunma (fener, saklanan hayaletçik, gece dostları) ═══════════════════════════════
// Yalnız sönük fenerin ya da saklanan hayaletçiğin yerine gelen dokunuş bu dosyanındır (yürüme kontrolüne gitmez); yanmış
// fenere / gece dostlarına dokunmak yalnız sevimli bir tepki verir, yürümeyi engellemez.
addEventListener('pointerdown', e => {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 8 || DURUM !== 'oyun' || e.target !== cv || P.ucus || P.fade > 0 || P.kilit > .05) return;
  if (kb8Final()) return;
  if (e.button != null && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;
  const r = cv.getBoundingClientRect(), wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  let en = null, best = 1, tur = '';
  for (const o of NESNELER) {
    if (Math.abs(o.x - P.x) > 900) continue;
    if (o.tip === 'kabakFener') {
      const h = (KB8_SEKIL[o.sekil] || KB8_SEKIL[0]).h * o.s, d = ((wx - o.x) / (34 * o.s)) ** 2 + ((wy - (o.y - h * .5 - o.kb.hop)) / (h * .62)) ** 2;
      if (d < best) { best = d; en = o; tur = 'fener'; }
    } else if (o.tip === 'hayaletcik' && o.hy && o.hy.durum === 'sakli') {
      const Y = o.hy.yer, d = ((wx - Y.giz[0]) / 60) ** 2 + ((wy - (Y.goz[1] - 18)) / 52) ** 2;
      if (d < best) { best = d; en = o; tur = 'hayalet'; }
    } else if (o.tip === 'geceDost' && o.gd) {
      const m = o.gd, cx = o.tur === 'kedi' ? m.x : o.tur === 'baykus' ? (Number.isFinite(o.dalX) ? o.dalX : o.x) : m.dalX + 30, cy = o.tur === 'kedi' ? m.y - 22 : o.tur === 'baykus' ? m.tunekY - 20 : m.dalY + 14;
      const d = ((wx - cx) / 40) ** 2 + ((wy - cy) / 36) ** 2;
      if (d < best) { best = d; en = o; tur = 'dost'; }
    }
  }
  if (!en) return;
  if (tur === 'fener' && en.yandi) { const m = en.kb; if (m.canli) { kb8Hop(m, 260); m.agizA = 1; m.mut = 1; kb8FenerOzel(en, false); } return; }   // yanmış kabak: kıkırdayıp hoplar
  if (tur === 'dost') {
    const m = en.gd;
    if (en.tur === 'kedi') { m.zip = 1; m.sev = 1; m.mir = 1; kb8Fx(m, 'kalp', m.x + m.yon * 6, m.y - 44, 1.7); if (m.miyavT <= 0) { kb8Sfx('kediMiyav'); m.miyavT = 4; } }
    else if (en.tur === 'baykus') { if (m.huT <= 0) { m.hu = 1; m.huT = 4; m.huU = 0; m.gR = 1; m.gL = 1; kb8Sfx('baykusHu'); } }
    else if (m.yr.every(b => b.durum === 'as')) { m.sogu = 6; for (const b of m.yr) { b.durum = 'bek'; b.u = 0; } kb8Sfx('yarasaPir'); }
    return;
  }
  e.preventDefault(); e.stopPropagation(); if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); P.buf = 0;
  if (tur === 'fener') kb8FenerYak(en, 'dokunus'); else kb8HBul(en);
}, true);
