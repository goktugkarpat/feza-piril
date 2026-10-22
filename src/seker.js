/* seker.js — Bölüm 8 şeker sokağı: altı kapı, ŞEKER Mİ ŞAKA MI, kapıdaki sevimli komşular. Sahibi: SOKAK. Sözleşme src/BOLUM8.md.
   sekerKapi : eğri büğrü, yuvarlak tepeli sevimli kapı (çerçeve + kapıya özgü süs, basamak, paspas, yanında minik kabaklar, kapıda
               perdeli yuvarlak pencere, parlayan tokmak/zil, sağ üstte kıvrık demir kolda küçük fener). Feza kapının önüne gelince
               (havadan geçerse indiği yerde) kısa bir sahne kendiliğinden oynar; atlanmaz. P.kilit her kare kısa yenilenir; sahne ne
               olursa olsun en geç 12 sn'de biter. Takvim (sn): Feza kapının 46 birim önüne yürüyüp kapıya döner → 0,45/0,72/0,99 üç
               vuruş (AU 'kapiTak', OLAY 'sekerKapiTak'; feza.js tık tık pozu, yoksa burada küçük yedek kol) → 0,55 Pırıl "Şeker mi şaka
               mı!" (SES 'p_c_sekermi') → 1,35 kapı içeri açılır, sıcak ışık sokağa taşar ('kapiAc', dn8IsikEkle) → 1,6 komşu sıcak
               ışığın içinden belirir, Feza'nın KOSTÜMÜNÜ görüp şaşırır-sevinir, hoplar, alkışlar; kalpler, pırıltılar ve başının
               üstünde kostümün minik resmiyle kalp balonu → 2,0 OLAY 'komsuSoz' {o, kim, tur, kostum, an:'ovgu'} (CORE cümleyi
               Pırıl'ınkinden sonra söyler; gelen 'konusma' {anahtar, sure} olayıyla komşunun ağzı oynar ve takvim cümleye oturur:
               şaka cümlenin "şaka!" yerine, şekerler "buyur" yerine, veda ve kapanış cümle sonuna) → ŞAKA (yalnız şaka kapılarında,
               OLAY 'sekerSaka' {o, saka}): yaylı kutudan gülen kabak (iskeletNine), şapkadan tavşan + yıldız yağmuru (cadiKiz),
               baloncuklar (hayaletTeyze), tokmağın çiçek açması + konfeti patlatıcıları (ikizler; çiçek 3. vuruşta açar)
               → ŞEKER: sargılı şeker, lolipop, şeker mısırı, çikolata para yay çizip sepete düşer ('sekerUc'/'sekerSepet', her düşüşte
               V8.seker++, sonra OLAY 'seker' {n, top}) → Feza serbest (şeker/şaka kapısı ≈ 5,5–6 sn), SEKER8.aktif = null
               → komşu el sallar (an:'veda') → kapı kapanır → fener yanar: V8.kapi++, OLAY 'sekerKapi' {o, n, kim, tur} → komşu kapının
               penceresinden el sallar (Feza yakındayken). Feza serbest kalınca bir sonraki kapı, önceki kapanırken de başlayabilir.
               Ek olaylar: 'sekerKapiBasla' {o, x, kapiX}. Dışa açık: SEKER8.aktif (Feza'yı tutan kapı ya da null), SEKER8.son,
               o.bitti / o.done.
   komsuCiz(c, kim, x, y, s, t, o) — ortak komşu çizicisi (finalde KABAK da kullanır). (x, y) ayak tabanı ortası; s = 1'de boy:
               kabakDede ≈ 104, iskeletNine ≈ 95, cadiKiz ≈ 90, karaKedi ≈ 92, hayaletTeyze ≈ 78–100, kabakDede2 = KABAK İKİZLER
               (iki minik kabak kafalı çocuk yan yana) ≈ 70. Hepsi önden ya da yarım yandan, iri parlak gözlü, pembe yanaklı.
               o = { yon -1|1 (bakış), sevinc 0..1, sasir 0..1, kik 0..1 (kıkırdama), el 0..1 (el sallama), alkis 0..1, uzat 0..1
                     (ellerini öne uzatır), dans 0..1 + faz (zıplar, sallanır, kollar sırayla havaya), hop 0..1 (tek sekme),
                     konus 0..1 (konuşur: ağız oynar) }. Çizimden sonra KOMSU {elX, elY, basX, basY} (dünya).
               İskelet Nine, Cadı Kız, Kara Kedi ve Hayalet Teyze dünyadaki akrabalarıyla aynı görünsün diye başka dosyaların ortak
               çizicileriyle (iskeletCiz nine / cadiCiz kiz / kediCiz ayakta / hayaletCiz teyze; SK8_DIS ölçekleri) çizilir; o dosya
               yüklenmemiş ya da hata vermişse buradaki yedek (kendi başına da sevimli) kullanılır. Kabak Dede ve ikizler buradadır.
   Çizimler önbellek tuvallerinden (sk8Tuval; sokağa yaklaşırken kare başına bir tane ısıtılır); karede gradient/filtre/gölge
   üretilmez, efektler sabit sayılı havuzlarda (konfeti 40, baloncuk 12, yıldız 16, kalp 8). Sahnedeki kapı ≈ 0,1–0,3 ms/kare. */
'use strict';
const SK8 = { spr: new Map(), efO: null, isit: 0, bos: {}, kk: 0, kt: 0 };
const SEKER8 = { aktif: null, son: null };   // dışa açık: o anki kapı sahnesi (müzik / zıplama düğmesi için)
const SK8_PI2 = Math.PI * 2;
const SK8_AG = 33, SK8_BAS = 8, SK8_AY = 118;          // açıklık yarı genişliği, basamak yüksekliği, açıklık yüksekliği
const SK8_UST = -SK8_BAS - SK8_AY;                      // açıklığın tepesi (y)
const SK8_PEN = { y: -92, r: 14 };                    // kapı kanadındaki yuvarlak pencere
const SK8_TOK = -60;                                    // tokmağın yüksekliği (kanatta)
const SK8_DUR = 46;                                     // kapı sahnesinde Feza'nın kapı ortasına uzaklığı
const SK8_FEN = { x: 63, y: -126 };                     // fener askısının ucu (kapıya göre; kapının sağ üstünde, bayrak süslerinin altında)
// Başka dosyaların ortak çizicileri: ölçek (s = 1'deki boylarına göre) ve açık mı. Test edilince açılır (dosyalar hazır olunca).
// el: [yana, yukarı] el/şeker kaynağı (s = 1 hedef boyda); yüklenmemişse (typeof) kendiliğinden yedek çizilir.
const SK8_DIS = { iskeletNine: { ad: 'iskeletCiz', ac: true, olc: 1.12, el: [17, -44], basY: -70 }, cadiKiz: { ad: 'cadiCiz', ac: true, olc: 1.03, el: [13, -38], basY: -56 },
  karaKedi: { ad: 'kediCiz', ac: true, olc: 1.4, el: [14, -46], basY: -60 }, hayaletTeyze: { ad: 'hayaletCiz', ac: true, olc: 1.7, el: [21, -36], basY: -50 } };
// Kapılar: renkler, tokmak, süs, şeker sayısı, şaka. (kapi: kanat, cer: çerçeve; K koyu, A açık)
const SK8_KAPI = {
  kabakDede:    { tur: 'seker', n: 5, saka: null, kapi: '#e8843c', kapiK: '#a04c1c', kapiA: '#ffb56c', cer: '#6f9a52', cerK: '#36592e', cerA: '#a2c97e', tokmak: 'halka', fener: '#ffb347', egim: -.045, sus: 'kabak' },
  iskeletNine:  { tur: 'saka', n: 4, saka: 'kutu', kapi: '#a68ad8', kapiK: '#62509a', kapiA: '#d0bdf4', cer: '#efe2cc', cerK: '#978670', cerA: '#fffaf0', tokmak: 'zil', fener: '#c39bff', egim: .035, sus: 'dantel' },
  cadiKiz:      { tur: 'saka', n: 4, saka: 'tavsan', kapi: '#7b4fc4', kapiK: '#45277c', kapiA: '#a888ea', cer: '#ffb347', cerK: '#a9601e', cerA: '#ffd890', tokmak: 'yildiz', fener: '#ffe7a8', egim: -.03, sus: 'yildiz' },
  karaKedi:     { tur: 'seker', n: 6, saka: null, kapi: '#3fae9a', kapiK: '#1f6a5e', kapiA: '#82dec8', cer: '#5c4672', cerK: '#31244a', cerA: '#8c76a8', tokmak: 'balik', fener: '#7dffc4', egim: .045, sus: 'kulak' },
  hayaletTeyze: { tur: 'saka', n: 5, saka: 'baloncuk', kapi: '#f4a8ca', kapiK: '#b86890', kapiA: '#ffd6e8', cer: '#fff2f8', cerK: '#c09cb2', cerA: '#ffffff', tokmak: 'kalp', fener: '#ff8fc8', egim: -.035, sus: 'dantel2' },
  kabakDede2:   { tur: 'saka', n: 8, saka: 'cicek', kapi: '#ffc24d', kapiK: '#c27e26', kapiA: '#ffe49c', cer: '#8a5fc8', cerK: '#4f3486', cerA: '#b498e8', tokmak: 'cicek', fener: '#e8ff8a', egim: .03, sus: 'ikiz' },
};
// Kostüm ↔ komşu eşleşmesi: eşleşince komşu ayrıca hoplar, kalpler iki katı ("sen de benim gibisin!")
const SK8_ES = { kabakDede: 'kabak', kabakDede2: 'kabak', iskeletNine: 'iskelet', cadiKiz: 'cadi', karaKedi: 'cadi', hayaletTeyze: 'yarasa' };
// Pencerede baş merkezi (s = 1, ayaktan) — komşuyu kapı penceresine küçük çizerken
const SK8_BASY = { kabakDede: -78, kabakDede2: -50, iskeletNine: -68, cadiKiz: -60, karaKedi: -64, hayaletTeyze: -64 };
const SK8_SEKER_RENK = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffb347', '#8fd8ff'];
const SK8_SEKER_TIP = ['sargi', 'lolipop', 'misir', 'para'];
const SK8_KONF_RENK = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffb347', '#8fd8ff', '#ffd27a'];
// Sahne takvimi (sn, sahne başından). Şeker kapısı ≈ 4,5 sn, şaka kapısı ≈ 5,5–6 sn kilit.
const SK8_T = { tak: [.45, .72, .99], soyle: .55, ac: 1.35, acSure: .5, gel: 1.6, gelSure: .4, sasir: 1.85, soz: 2.0, alkis: 2.2, alkisSon: 3.0,
  balon: 1.95, balonSon: 3.7, seker: 3.2, saka: 3.4, sakaSeker: .75, aralik: .11, ucus: .72 };
// olay bitleri
const SK8_E = { tak0: 1, tak1: 2, tak2: 4, soyle: 8, ac: 16, gel: 32, soz: 64, kalp: 128, saka: 256, cicek: 512, seker: 1024, veda: 2048, kapa: 4096, fener: 8192, takir: 16384 };

function sk8V() { return typeof V8 !== 'undefined' ? V8 : null; }
function sk8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) { } } }
function sk8Soyle(k, ops) { if (typeof SES !== 'undefined' && SES && typeof SES.soyle === 'function') { try { SES.soyle(k, ops); } catch (e) { } } }
function sk8Isik(c, col, x, y, r, a) { if (a <= .003) return; c.globalAlpha = a; c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = 1; }
// Önbellek tuvali: yerel (x0, y0, w, h) kutusu, K piksel/birim
function sk8Tuval(ad, x0, y0, w, h, fn, K) {
  let c = SK8.spr.get(ad); if (c) return c;
  K = K || 4;
  c = document.createElement('canvas'); c.width = Math.ceil(w * K); c.height = Math.ceil(h * K);
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; SK8.spr.set(ad, c); return c;
}
function sk8Koy(c, s, x, y) { c.drawImage(s, x + s.x0, y + s.y0, s.w, s.h); }
function sk8KoyO(c, s, x, y, k) { c.drawImage(s, x + s.x0 * k, y + s.y0 * k, s.w * k, s.h * k); }   // ölçekli
// yuvarlak tepeli kapı yolu: taban alt, tepe ust, yarı genişlik hw
function sk8Kemer(q, hw, alt, ust) { const my = ust + hw; q.beginPath(); q.moveTo(-hw, alt); q.lineTo(-hw, my); q.arc(0, my, hw, Math.PI, SK8_PI2); q.lineTo(hw, alt); q.closePath(); }
function sk8Yildiz(q, x, y, r, ic) { q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * (ic || .45) : r; q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } q.closePath(); }
function sk8Kalp(q, x, y, r) { q.beginPath(); q.moveTo(x, y + r * .9); q.bezierCurveTo(x - r * 1.5, y - r * .1, x - r * .7, y - r * 1.15, x, y - r * .45); q.bezierCurveTo(x + r * .7, y - r * 1.15, x + r * 1.5, y - r * .1, x, y + r * .9); q.closePath(); }
function sk8Elips(q, x, y, rx, ry, a, dolgu, kontur, lw) { q.beginPath(); q.ellipse(x, y, rx, ry, a || 0, 0, SK8_PI2); if (dolgu) { q.fillStyle = dolgu; q.fill(); } if (kontur) { q.strokeStyle = kontur; q.lineWidth = lw || 1.6; q.stroke(); } }
// Kabak (çizim; önbellek içinde): merkez (x, y), yarıçaplar rx, ry; 3 dilim + sap + yaprak
function sk8KabakSekil(q, x, y, rx, ry, renk, koyu, kontur, sapli) {
  renk = renk || '#ff9a3c'; koyu = koyu || '#e8702a'; kontur = kontur || '#b2511c';
  sk8Elips(q, x - rx * .45, y + ry * .04, rx * .6, ry * .92, 0, koyu, kontur, Math.max(1, rx * .08));
  sk8Elips(q, x + rx * .45, y + ry * .04, rx * .6, ry * .92, 0, koyu, kontur, Math.max(1, rx * .08));
  sk8Elips(q, x, y, rx * .62, ry, 0, renk, kontur, Math.max(1, rx * .08));
  q.strokeStyle = 'rgba(178,81,28,.45)'; q.lineWidth = Math.max(.8, rx * .05);
  q.beginPath(); q.moveTo(x - rx * .25, y - ry * .85); q.quadraticCurveTo(x - rx * .38, y, x - rx * .25, y + ry * .85); q.moveTo(x + rx * .25, y - ry * .85); q.quadraticCurveTo(x + rx * .38, y, x + rx * .25, y + ry * .85); q.stroke();
  sk8Elips(q, x - rx * .3, y - ry * .45, rx * .14, ry * .28, -.3, 'rgba(255,214,150,.6)');
  if (sapli !== false) {
    q.strokeStyle = '#3c5222'; q.lineWidth = rx * .26; q.beginPath(); q.moveTo(x, y - ry * .9); q.quadraticCurveTo(x - rx * .05, y - ry * 1.25, x + rx * .16, y - ry * 1.42); q.stroke();
    q.strokeStyle = '#6f8f3e'; q.lineWidth = rx * .16; q.stroke();
    sk8Elips(q, x - rx * .34, y - ry * 1.12, rx * .3, ry * .15, -.5, '#7fb04a', '#4a7a2e', Math.max(.7, rx * .05));
  }
}

// ═══════════════════════════════ ŞEKERLER, ŞAKA EŞYALARI, SİMGELER ═══════════════════════════════
function sk8SekerSpr(tip, renk) {
  return sk8Tuval('sk' + tip + renk, -13, -16, 26, 30, q => {
    const k = mixc(renk, '#3a1a40', .45), a = mixc(renk, '#ffffff', .55);
    if (tip === 'sargi') {   // sargılı şeker: iki ucu büzülmüş
      for (const d of [-1, 1]) { q.beginPath(); q.moveTo(d * 5, 0); q.lineTo(d * 11.5, -5); q.quadraticCurveTo(d * 10, 0, d * 11.5, 5); q.closePath(); q.fillStyle = a; q.fill(); q.strokeStyle = k; q.lineWidth = 1.1; q.stroke();
        q.strokeStyle = mixc(renk, '#ffffff', .2, .8); q.lineWidth = .8; q.beginPath(); q.moveTo(d * 7, -1.8); q.lineTo(d * 10, -3.4); q.moveTo(d * 7, 1.8); q.lineTo(d * 10, 3.4); q.stroke(); }
      sk8Elips(q, 0, 0, 6.6, 5, 0, renk, k, 1.2);
      q.strokeStyle = 'rgba(255,255,255,.75)'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(-3, -5); q.quadraticCurveTo(0, 0, 3, 5); q.stroke();
      sk8Elips(q, -2.6, -2.2, 1.6, 1, -.5, 'rgba(255,255,255,.9)');
    } else if (tip === 'lolipop') {   // sarmal lolipop + çubuk
      q.strokeStyle = '#e9dcc8'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(0, 4); q.lineTo(0, 13); q.stroke();
      q.strokeStyle = '#b8a48a'; q.lineWidth = .6; q.beginPath(); q.moveTo(.9, 5); q.lineTo(.9, 12.6); q.stroke();
      sk8Elips(q, 0, -2, 7.2, 7.2, 0, '#ffffff', k, 1.2);
      q.strokeStyle = renk; q.lineWidth = 2.1; q.beginPath(); for (let i = 0; i <= 40; i++) { const a2 = i * .42, r = .25 + i * .155; q.lineTo(Math.cos(a2) * r, -2 + Math.sin(a2) * r); } q.stroke();
      sk8Elips(q, -2.8, -4.8, 1.8, 1.1, -.6, 'rgba(255,255,255,.85)');
    } else if (tip === 'misir') {   // şeker mısırı: beyaz uç, turuncu orta, sarı taban
      const yol = () => { q.beginPath(); q.moveTo(0, -8.5); q.quadraticCurveTo(2.2, -6, 6.4, 4.6); q.quadraticCurveTo(0, 7.6, -6.4, 4.6); q.quadraticCurveTo(-2.2, -6, 0, -8.5); q.closePath(); };
      q.save(); yol(); q.clip();
      q.fillStyle = '#ffd23a'; q.fillRect(-8, 1, 16, 9); q.fillStyle = '#ff9a3c'; q.fillRect(-8, -4, 16, 5.2); q.fillStyle = '#fff8ee'; q.fillRect(-8, -10, 16, 6.2);
      q.restore(); yol(); q.strokeStyle = '#b8682a'; q.lineWidth = 1.1; q.stroke();
      sk8Elips(q, -1.8, -1, .9, 3, .2, 'rgba(255,255,255,.7)');
    } else {   // çikolata para: altın, kabartma yıldız
      sk8Elips(q, 0, 0, 7, 7, 0, '#e8a83a', '#9a6a1e', 1.2); sk8Elips(q, 0, 0, 5.4, 5.4, 0, '#ffd166', '#c8902a', .8);
      sk8Yildiz(q, 0, .3, 3.2, .48); q.fillStyle = '#ffe9a0'; q.fill(); q.strokeStyle = '#c8902a'; q.lineWidth = .6; q.stroke();
      sk8Elips(q, -2.6, -3, 1.6, .9, -.6, 'rgba(255,255,255,.85)');
    }
  }, 5);
}
function sk8KalpSpr() { return sk8Tuval('kalp', -9, -9, 18, 18, q => { sk8Kalp(q, 0, 0, 6.5); q.fillStyle = '#ff7fb6'; q.fill(); q.strokeStyle = '#d04a86'; q.lineWidth = 1.1; q.stroke(); sk8Elips(q, -2.6, -2.2, 1.6, 1.1, -.6, 'rgba(255,255,255,.85)'); }, 5); }
function sk8YildizSpr(renk) { return sk8Tuval('yil' + renk, -8, -8, 16, 16, q => { sk8Yildiz(q, 0, 0, 6.5, .46); q.fillStyle = renk; q.fill(); q.strokeStyle = mixc(renk, '#7a4a10', .45); q.lineWidth = 1; q.stroke(); sk8Elips(q, -1, -1, 1.6, 1.6, 0, '#ffffff'); }, 5); }
function sk8BalonSpr() {   // sabun baloncuğu (gökkuşağı kenarlı)
  return sk8Tuval('baloncuk', -17, -17, 34, 34, q => {
    const gr = q.createRadialGradient(0, 0, 9, 0, 0, 16); gr.addColorStop(0, 'rgba(255,255,255,0.03)'); gr.addColorStop(.8, 'rgba(220,240,255,0.16)'); gr.addColorStop(1, 'rgba(255,255,255,0.4)');
    q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 15.5, 0, SK8_PI2); q.fill();
    const lg = q.createLinearGradient(-15, -15, 15, 15); lg.addColorStop(0, 'rgba(255,143,200,.8)'); lg.addColorStop(.35, 'rgba(255,240,140,.7)'); lg.addColorStop(.65, 'rgba(125,255,196,.7)'); lg.addColorStop(1, 'rgba(160,140,255,.8)');
    q.strokeStyle = lg; q.lineWidth = 1.5; q.beginPath(); q.arc(0, 0, 15, 0, SK8_PI2); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,.9)'; q.lineWidth = 2; q.beginPath(); q.arc(0, 0, 11, Math.PI * 1.1, Math.PI * 1.45); q.stroke();
    sk8Elips(q, 6, 6, 1.8, 1.8, 0, 'rgba(255,255,255,.7)');
  }, 4);
}
// Kostüm simgesi balonu (komşunun "ne güzel kostüm!" tepkisi): beyaz balon, içinde kostümün minik resmi + kalp. Kuyruk aşağı-sağa.
function sk8KostumSpr(kostum) {
  return sk8Tuval('kos' + kostum, -24, -24, 48, 50, q => {
    q.fillStyle = 'rgba(255,255,255,.96)'; q.strokeStyle = '#b9a6dc'; q.lineWidth = 2;
    q.beginPath(); q.arc(0, 0, 18, 0, SK8_PI2); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(6, 16); q.quadraticCurveTo(11, 23, 15, 24); q.quadraticCurveTo(12, 19, 13, 13); q.closePath(); q.fill(); q.stroke();
    q.fillStyle = 'rgba(255,255,255,.96)'; q.beginPath(); q.arc(0, 0, 16.9, 0, SK8_PI2); q.fill();
    if (kostum === 'cadi') {
      q.beginPath(); q.moveTo(-9, 5); q.quadraticCurveTo(-3, -4, 1, -13); q.quadraticCurveTo(4, -15, 6, -12); q.quadraticCurveTo(4, -2, 8, 5); q.closePath(); q.fillStyle = '#6b46b8'; q.fill(); q.strokeStyle = '#3e2577'; q.lineWidth = 1.2; q.stroke();
      sk8Elips(q, 0, 5.5, 12, 3, 0, '#5a3aa0', '#3e2577', 1.2); q.fillStyle = '#ffb347'; q.fillRect(-7, 1.2, 14, 2.6);
      sk8Yildiz(q, 6.6, -12.6, 3, .45); q.fillStyle = '#ffe066'; q.fill();
    } else if (kostum === 'kabak') {
      sk8KabakSekil(q, 0, 1, 11, 9.5);
      sk8Elips(q, -3.6, 0, 1.4, 1.9, 0, '#5a2410'); sk8Elips(q, 3.6, 0, 1.4, 1.9, 0, '#5a2410');
      q.strokeStyle = '#5a2410'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(-3.5, 4); q.quadraticCurveTo(0, 7, 3.5, 4); q.stroke();
    } else if (kostum === 'iskelet') {   // sevimli kemik
      q.save(); q.rotate(-.5);
      q.fillStyle = '#fbf6ee'; q.strokeStyle = '#a89a8a'; q.lineWidth = 1.3;
      for (const d of [-1, 1]) { q.beginPath(); q.arc(d * 9, -2.6, 3.6, 0, SK8_PI2); q.arc(d * 9, 2.6, 3.6, 0, SK8_PI2); q.fill(); }
      q.beginPath(); q.roundRect(-9, -2.6, 18, 5.2, 2); q.fill(); q.stroke();
      for (const d of [-1, 1]) { q.beginPath(); q.arc(d * 9, -2.6, 3.6, d > 0 ? -2.2 : -1, d > 0 ? 1 : 2.2, d < 0); q.stroke(); q.beginPath(); q.arc(d * 9, 2.6, 3.6, d > 0 ? -1 : -2.2 + Math.PI, d > 0 ? 2.2 : 1 + Math.PI); q.stroke(); }
      q.fillStyle = '#fbf6ee'; q.fillRect(-8, -1.9, 16, 3.8);
      q.restore();
    } else if (kostum === 'genel') {   // kostüm bilinmiyorsa: kocaman kalp + yıldızlar
      sk8Kalp(q, 0, 2, 10); q.fillStyle = '#ff7fb6'; q.fill(); q.strokeStyle = '#d04a86'; q.lineWidth = 1.3; q.stroke(); sk8Elips(q, -4, -2, 2.4, 1.5, -.6, '#ffffff');
      for (const [sx, sy, r] of [[-11, -9, 3.2], [10, 8, 2.6]]) { sk8Yildiz(q, sx, sy, r, .45); q.fillStyle = '#ffe066'; q.fill(); }
    } else {   // yarasa: lila top gövde, kanatlar, gülümseme
      q.fillStyle = '#a88ad8'; q.strokeStyle = '#5e4a96'; q.lineWidth = 1.1;
      for (const d of [-1, 1]) { q.beginPath(); q.moveTo(d * 4, -2); q.quadraticCurveTo(d * 10, -9, d * 15, -5); q.quadraticCurveTo(d * 13, -1, d * 14.5, 3); q.quadraticCurveTo(d * 11, 1, d * 9.5, 4.5); q.quadraticCurveTo(d * 7, 2, d * 4, 3); q.closePath(); q.fill(); q.stroke(); }
      for (const d of [-1, 1]) { q.beginPath(); q.moveTo(d * 2.5, -5); q.lineTo(d * 4.6, -10.5); q.lineTo(d * 6, -4.2); q.closePath(); q.fill(); q.stroke(); }
      sk8Elips(q, 0, 0, 7, 6.6, 0, '#b89ae6', '#5e4a96', 1.2);
      sk8Elips(q, -2.6, -1, 1.5, 1.8, 0, '#2a1a38'); sk8Elips(q, 2.6, -1, 1.5, 1.8, 0, '#2a1a38');
      sk8Elips(q, -2.9, -1.6, .6, .6, 0, '#ffffff'); sk8Elips(q, 2.3, -1.6, .6, .6, 0, '#ffffff');
      q.strokeStyle = '#4a2a5a'; q.lineWidth = .9; q.beginPath(); q.moveTo(-1.6, 2.4); q.quadraticCurveTo(0, 3.8, 1.6, 2.4); q.stroke();
    }
    // köşede kalp
    sk8Kalp(q, 12, -12, 5); q.fillStyle = '#ff7fb6'; q.fill(); q.strokeStyle = '#d04a86'; q.lineWidth = 1; q.stroke();
    sk8Elips(q, 10.2, -13.6, 1.1, .8, -.6, '#ffffff');
  }, 4);
}
// Kâse (Kabak Dede'nin şeker kâsesi; içinden şekerler görünür)
function sk8KaseSpr() {
  return sk8Tuval('kase', -17, -14, 34, 24, q => {
    const rk = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffb347'];
    for (let i = 0; i < 5; i++) sk8Elips(q, -9 + i * 4.5, -3 - (i % 2) * 2.4, 3.4, 3, 0, rk[i], mixc(rk[i], '#3a1a40', .4), .9);
    q.beginPath(); q.moveTo(-14, -2); q.quadraticCurveTo(-13, 9, 0, 9); q.quadraticCurveTo(13, 9, 14, -2); q.closePath(); q.fillStyle = '#a68ad8'; q.fill(); q.strokeStyle = '#5a4690'; q.lineWidth = 1.4; q.stroke();
    sk8Elips(q, 0, -2, 14, 2.6, 0, null, '#5a4690', 1.4);
    q.strokeStyle = '#ffd27a'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(-11, 3); q.quadraticCurveTo(0, 6, 11, 3); q.stroke();
    sk8Elips(q, -8, 2, 2, 1.1, -.4, 'rgba(255,255,255,.7)');
  }, 5);
}
// Sihirli silindir şapka (ağzı yukarı; tavşan çıkar) — arka (ağız) ve ön (gövde) ayrı
function sk8SapkaArkaSpr() { return sk8Tuval('sapkaA', -16, -6, 32, 10, q => { sk8Elips(q, 0, 0, 13.5, 3.8, 0, '#5a3aa0', '#2e1a5a', 1.4); sk8Elips(q, 0, 0, 9.5, 2.4, 0, '#20123c'); }, 5); }
function sk8SapkaOnSpr() {
  return sk8Tuval('sapkaO', -16, -6, 32, 26, q => {
    q.beginPath(); q.moveTo(-9.5, 0); q.lineTo(-8.5, 16); q.quadraticCurveTo(0, 19, 8.5, 16); q.lineTo(9.5, 0); q.quadraticCurveTo(0, 2.4, -9.5, 0); q.closePath();
    q.fillStyle = '#6b46b8'; q.fill(); q.strokeStyle = '#2e1a5a'; q.lineWidth = 1.4; q.stroke();
    q.fillStyle = '#ffb347'; q.beginPath(); q.moveTo(-9.3, 3.5); q.quadraticCurveTo(0, 6, 9.3, 3.5); q.lineTo(9.1, 7); q.quadraticCurveTo(0, 9.4, -9.1, 7); q.closePath(); q.fill();
    sk8Yildiz(q, 0, 12, 3, .45); q.fillStyle = '#ffe066'; q.fill();
    q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(-6.5, 9); q.lineTo(-6, 15); q.stroke();
    q.strokeStyle = '#2e1a5a'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, 0, 13.5, 3.8, 0, 0, Math.PI); q.stroke();
    q.fillStyle = '#5a3aa0'; q.beginPath(); q.ellipse(0, 0, 13.5, 3.8, 0, 0, Math.PI); q.ellipse(0, 0, 9.5, 2.4, 0, Math.PI, 0, true); q.fill();
  }, 5);
}
// Beyaz pofuduk tavşan (şapkadan çıkar; yerel taban (0,0), yukarı -y)
function sk8TavsanSpr() {
  return sk8Tuval('tavsan', -14, -34, 28, 36, q => {
    for (const d of [-1, 1]) { q.save(); q.translate(d * 4, -16); q.rotate(d * .18); sk8Elips(q, 0, -9, 3.6, 9, 0, '#ffffff', '#c9b8d8', 1.2); sk8Elips(q, 0, -9, 1.7, 6.4, 0, '#ffb3cf'); q.restore(); }
    sk8Elips(q, 0, -2, 9.5, 7, 0, '#ffffff', '#c9b8d8', 1.3);
    sk8Elips(q, 0, -11, 8.5, 7.5, 0, '#ffffff', '#c9b8d8', 1.3);
    sk8Elips(q, -3.4, -12, 1.9, 2.3, 0, '#2a1a38'); sk8Elips(q, 3.4, -12, 1.9, 2.3, 0, '#2a1a38');
    sk8Elips(q, -4, -12.8, .8, .8, 0, '#ffffff'); sk8Elips(q, 2.8, -12.8, .8, .8, 0, '#ffffff');
    sk8Elips(q, 0, -8.6, 1.3, .9, 0, '#ff8fb0'); sk8Elips(q, -5.6, -8.6, 2, 1.2, 0, 'rgba(255,128,170,.45)'); sk8Elips(q, 5.6, -8.6, 2, 1.2, 0, 'rgba(255,128,170,.45)');
    q.strokeStyle = '#6e2a3a'; q.lineWidth = .8; q.beginPath(); q.moveTo(-1.4, -7.2); q.quadraticCurveTo(0, -6.2, 1.4, -7.2); q.stroke();
    for (const d of [-1, 1]) sk8Elips(q, d * 5.5, 1, 2.6, 2, 0, '#ffffff', '#c9b8d8', 1);
  }, 5);
}
// Yaylı kutu (gövde) + kapak + fırlayan minik gülen kabak (kabakCiz yoksa)
function sk8KutuSpr() {
  return sk8Tuval('kutu', -14, -18, 28, 20, q => {
    q.beginPath(); q.roundRect(-12, -16, 24, 16, 2.4); q.fillStyle = '#8a5fc8'; q.fill(); q.strokeStyle = '#3e2577'; q.lineWidth = 1.4; q.stroke();
    q.save(); q.beginPath(); q.roundRect(-12, -16, 24, 16, 2.4); q.clip(); q.fillStyle = '#ffb347'; for (let i = -2; i < 3; i++) { q.beginPath(); q.moveTo(i * 8 - 2, -16); q.lineTo(i * 8 + 2, -16); q.lineTo(i * 8 - 6, 0); q.lineTo(i * 8 - 10, 0); q.closePath(); q.fill(); } q.restore();
    q.beginPath(); q.roundRect(-12, -16, 24, 16, 2.4); q.strokeStyle = '#3e2577'; q.lineWidth = 1.4; q.stroke();
    sk8Yildiz(q, 0, -8, 4.6, .45); q.fillStyle = '#ffe066'; q.fill(); q.strokeStyle = '#b8862a'; q.lineWidth = .8; q.stroke();
    q.fillStyle = '#ffd27a'; q.fillRect(9, -10, 4.5, 2); sk8Elips(q, 14, -9, 1.8, 3, 0, '#ffd27a', '#a07a2a', .8);   // kurma kolu
  }, 5);
}
function sk8KapakSpr() { return sk8Tuval('kapak', -14, -4, 28, 6, q => { q.beginPath(); q.roundRect(-13, -3, 26, 4, 1.6); q.fillStyle = '#a27ce0'; q.fill(); q.strokeStyle = '#3e2577'; q.lineWidth = 1.2; q.stroke(); }, 5); }
function sk8MiniKabakSpr() {
  return sk8Tuval('miniKabak', -12, -24, 24, 26, q => {
    sk8KabakSekil(q, 0, -9, 10.5, 9);
    sk8Elips(q, -3.6, -10.5, 1.7, 2.2, 0, '#4a1c0c'); sk8Elips(q, 3.6, -10.5, 1.7, 2.2, 0, '#4a1c0c');
    sk8Elips(q, -4, -11.3, .7, .7, 0, '#ffffff'); sk8Elips(q, 3.2, -11.3, .7, .7, 0, '#ffffff');
    q.fillStyle = '#4a1c0c'; q.beginPath(); q.moveTo(-4.5, -6.4); q.quadraticCurveTo(0, -1.2, 4.5, -6.4); q.quadraticCurveTo(0, -4.6, -4.5, -6.4); q.fill();
    sk8Elips(q, -7, -7, 1.8, 1.1, 0, 'rgba(255,110,140,.5)'); sk8Elips(q, 7, -7, 1.8, 1.1, 0, 'rgba(255,110,140,.5)');
  }, 5);
}
// Konfeti patlatıcısı (külah) ve baloncuk çubuğu, cadı asası
function sk8PatlatSpr() {
  return sk8Tuval('patlat', -5, -14, 10, 16, q => {
    q.beginPath(); q.moveTo(0, 1); q.lineTo(-4.4, -12); q.quadraticCurveTo(0, -13.6, 4.4, -12); q.closePath(); q.fillStyle = '#ff8fc8'; q.fill(); q.strokeStyle = '#b04a7a'; q.lineWidth = 1; q.stroke();
    q.strokeStyle = '#ffe066'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-2.9, -8); q.lineTo(2.9, -8); q.moveTo(-1.5, -4); q.lineTo(1.5, -4); q.stroke();
    sk8Elips(q, 0, -12.2, 4.4, 1.3, 0, '#ffd27a', '#a07a2a', .8);
  }, 6);
}
function sk8AsaSpr() { return sk8Tuval('asa', -6, -22, 12, 24, q => { q.strokeStyle = '#5a3a2a'; q.lineWidth = 1.8; q.beginPath(); q.moveTo(0, 1); q.lineTo(0, -14); q.stroke(); sk8Yildiz(q, 0, -16, 5, .45); q.fillStyle = '#ffe066'; q.fill(); q.strokeStyle = '#b8862a'; q.lineWidth = .9; q.stroke(); sk8Elips(q, -1, -17, 1.2, 1.2, 0, '#fff'); }, 6); }
function sk8CubukSpr() { return sk8Tuval('cubuk', -7, -24, 14, 26, q => { q.strokeStyle = '#ff8fc8'; q.lineWidth = 1.8; q.beginPath(); q.moveTo(0, 1); q.lineTo(0, -12); q.stroke(); q.lineWidth = 2; q.beginPath(); q.arc(0, -17, 5, 0, SK8_PI2); q.stroke(); q.strokeStyle = 'rgba(255,255,255,.7)'; q.lineWidth = .9; q.beginPath(); q.arc(0, -17, 3.4, Math.PI * 1.1, Math.PI * 1.6); q.stroke(); }, 6); }
// Kedinin silindir şapkası (başında; taban (0,0), yukarı -y)
function sk8KediSapkaSpr() {
  return sk8Tuval('kediSapka', -15, -24, 30, 28, q => {
    sk8Elips(q, 0, 0, 13, 3.4, 0, '#5a3aa0', '#2e1a5a', 1.4);
    q.beginPath(); q.moveTo(-8, 0); q.lineTo(-7.4, -18); q.quadraticCurveTo(0, -20.5, 7.4, -18); q.lineTo(8, 0); q.quadraticCurveTo(0, 2, -8, 0); q.closePath();
    q.fillStyle = '#6b46b8'; q.fill(); q.strokeStyle = '#2e1a5a'; q.lineWidth = 1.4; q.stroke();
    sk8Elips(q, 0, -18, 7.4, 1.9, 0, '#7f58cc', '#2e1a5a', 1.2);
    q.fillStyle = '#ffb347'; q.beginPath(); q.moveTo(-7.9, -3); q.quadraticCurveTo(0, -1.2, 7.9, -3); q.lineTo(7.7, -6.6); q.quadraticCurveTo(0, -4.8, -7.7, -6.6); q.closePath(); q.fill();
    sk8Yildiz(q, 3.5, -11, 2.6, .45); q.fillStyle = '#ffe066'; q.fill();
    q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(-5, -8); q.lineTo(-4.8, -16); q.stroke();
  }, 5);
}

// ═══════════════════════════════ KOMŞULAR (komsuCiz) ═══════════════════════════════
// Göz: iri, parlak (iki ışık beneği). kapa 0..1 kırpma, mutlu > .55 → kapalı gülen göz (∩), sasir büyütür.
function sk8Goz(c, x, y, r, gx, gy, kapa, mutlu, sasir, renk, acik) {
  if (mutlu > .55) { c.strokeStyle = acik || renk || '#2a1a38'; c.lineWidth = r * .5; c.beginPath(); c.arc(x, y + r * .45, r * .78, Math.PI * 1.18, Math.PI * 1.82); c.stroke(); return; }
  const rr = r * (1 + .2 * sasir), ry = rr * (1 - kapa * .92);
  if (ry < rr * .2) { c.strokeStyle = acik || renk || '#2a1a38'; c.lineWidth = r * .4; c.beginPath(); c.moveTo(x - rr * .8, y); c.quadraticCurveTo(x, y + rr * .3, x + rr * .8, y); c.stroke(); return; }
  c.fillStyle = renk || '#2a1a38'; c.beginPath(); c.ellipse(x + gx, y + gy, rr * .86, ry, 0, 0, SK8_PI2); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x + gx - rr * .3, y + gy - ry * .36, rr * .36, 0, SK8_PI2); c.fill();
  c.beginPath(); c.arc(x + gx + rr * .32, y + gy + ry * .34, rr * .15, 0, SK8_PI2); c.fill();
}
// Ağız: gul 0..1 gülümseme, acik 0..1 açık gülüş (pembe dil), sasir → küçük "o"
function sk8Agiz(c, x, y, w, gul, acik, sasir, renk) {
  renk = renk || '#6e2a3a';
  const kk = SK8.kk; if (kk > 0) { const kt = SK8.kt, ka = .2 + .62 * Math.abs(Math.sin(kt * 12.5) * Math.sin(kt * 7.1 + 1.3)); acik = Math.max(acik * (1 - kk), ka * kk); sasir *= 1 - kk; }
  if (sasir > .45) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y + w * .2, w * .34, w * (.25 + .3 * sasir), 0, 0, SK8_PI2); c.fill(); c.fillStyle = '#ff8fa8'; c.beginPath(); c.ellipse(x, y + w * .38, w * .2, w * .12, 0, 0, SK8_PI2); c.fill(); return; }
  if (acik > .15) {
    const h = w * (.35 + .55 * acik);
    c.fillStyle = renk; c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x, y + h * 2.1, x + w, y); c.quadraticCurveTo(x, y + h * .3, x - w, y); c.fill();
    c.fillStyle = '#ff8fa8'; c.beginPath(); c.ellipse(x, y + h * .78, w * .46, h * .3, 0, 0, SK8_PI2); c.fill();
    return;
  }
  c.strokeStyle = renk; c.lineWidth = Math.max(1, w * .24); c.beginPath(); c.moveTo(x - w, y); c.quadraticCurveTo(x, y + w * (.25 + .7 * gul), x + w, y); c.stroke();
}
function sk8Kirp(t, ph) { const u = (t + ph) % 3.7; return u < .15 ? Math.sin(u / .15 * Math.PI) : 0; }
// Kollar: omuzlar (±ox, oy), boy L, kalınlık w. Pozlar karışır: dinlenme → alkış → uzatma → el sallama (yon tarafı) / kaldır (öbür
// kol) → dans. Son el konumları SK8_EL'e (yerel) yazılır. eklem: kemik dirsek topuzu (iskelet).
const SK8_EL = { lx: 0, ly: 0, rx: 0, ry: 0 };
function sk8Kollar(c, t, o, ox, oy, L, w, renk, kontur, elRenk, elKontur, elR, eklem) {
  const yon = o.yon < 0 ? -1 : 1, a = o.alkis || 0, u = o.uzat || 0, e = o.el || 0, d = o.dans || 0, kl = o.kaldir || 0;
  const faz = o.faz != null ? o.faz : t * 1.9, cp = .5 + .5 * Math.sin(t * 17);
  c.lineCap = 'round';
  for (let k = -1; k <= 1; k += 2) {
    let hx = k * (ox + 2.5), hy = oy + L * .86 + Math.sin(t * 2.2 + k) * .6;      // dinlenme: yanlarda
    if (a > 0) { hx = lerp(hx, k * (1.4 + 5.6 * cp), a); hy = lerp(hy, oy + L * .4, a); }   // alkış: göğüs önünde
    if (u > 0) { hx = lerp(hx, yon * 5 + k * 8, u); hy = lerp(hy, oy + L * .42, u); }      // öne uzatma (Feza'ya doğru)
    if (k === yon && e > 0) { hx = lerp(hx, k * (ox + L * .45) + Math.sin(t * 10) * 3.2, e); hy = lerp(hy, oy - L * .62, e); }
    if (k !== yon && kl > 0) { hx = lerp(hx, k * (ox + L * .35), kl); hy = lerp(hy, oy - L * .7 + Math.sin(t * 9) * 2, kl); }
    if (d > 0) { const up = .5 + .5 * Math.sin(faz * Math.PI + (k > 0 ? 0 : Math.PI)); hx = lerp(hx, k * (ox + L * .48), d); hy = lerp(hy, lerp(oy + L * .35, oy - L * .72, up), d); }
    const sx = k * ox, sy = oy, mx = (sx + hx) / 2 + k * 3.4, my = (sy + hy) / 2 + 2.2;
    c.strokeStyle = kontur; c.lineWidth = w + 2.4; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(mx, my, hx, hy); c.stroke();
    c.strokeStyle = renk; c.lineWidth = w; c.stroke();
    if (eklem) { const ex = (sx + 2 * mx + hx) / 4, ey = (sy + 2 * my + hy) / 4; c.fillStyle = renk; c.strokeStyle = kontur; c.lineWidth = 1.2; c.beginPath(); c.arc(ex, ey, w * .62, 0, SK8_PI2); c.fill(); c.stroke(); }
    c.fillStyle = elRenk; c.strokeStyle = elKontur; c.lineWidth = 1.4; c.beginPath(); c.arc(hx, hy, elR, 0, SK8_PI2); c.fill(); c.stroke();
    if (k < 0) { SK8_EL.lx = hx; SK8_EL.ly = hy; } else { SK8_EL.rx = hx; SK8_EL.ry = hy; }
  }
}
// Gövde salınımı: nefes, sekme (hop), dans zıplaması. Dönen değer: yukarı kayma (birim)
function sk8Zipla(t, o) {
  const d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  return Math.abs(Math.sin(faz * Math.PI)) * 6 * d + Math.sin(clamp(o.hop || 0, 0, 1) * Math.PI) * 9;
}
// Komşunun çizimden sonraki "eli": şeker/şaka kaynağı (dünya). komsuCiz her çağrıda yazar.
const KOMSU = { elX: 0, elY: 0, basX: 0, basY: 0 };
function sk8ElYaz(x, y, s, lx, ly) { KOMSU.elX = x + lx * s; KOMSU.elY = y + ly * s; }

// ── Kabak Dede: kabak kafalı tombul dede; hırka, papyon, gözlük, bıyık ──
const SK8_DD = { hirka: '#5f9a7a', hirkaK: '#2f5a48', hirkaA: '#8cc6a6', el: '#ffb86b', elK: '#b8692c' };
function sk8DedeGovde() {
  return sk8Tuval('dedeG', -30, -62, 60, 66, q => {
    for (const d of [-1, 1]) { q.beginPath(); q.roundRect(d * 9 - 4.5, -20, 9, 16, 3); q.fillStyle = '#6b4a3a'; q.fill(); q.strokeStyle = '#3f2a22'; q.lineWidth = 1.4; q.stroke(); }
    for (const d of [-1, 1]) { sk8Elips(q, d * 10, -3.6, 9, 4.6, 0, '#a0506a', '#5e2a3c', 1.6); sk8Elips(q, d * 10, -6.6, 2.7, 2.4, 0, '#fff4f8', '#d8b8c8', .8); }
    sk8Elips(q, 0, -35, 23.5, 22, 0, SK8_DD.hirka, SK8_DD.hirkaK, 2);
    q.beginPath(); q.moveTo(-8.5, -55.5); q.lineTo(0, -33); q.lineTo(8.5, -55.5); q.closePath(); q.fillStyle = '#fff3dc'; q.fill(); q.strokeStyle = SK8_DD.hirkaK; q.lineWidth = 1.2; q.stroke();
    q.strokeStyle = SK8_DD.hirkaK; q.lineWidth = 1.3; q.beginPath(); q.moveTo(0, -33); q.lineTo(0, -13.5); q.stroke();
    for (let i = 0; i < 3; i++) sk8Elips(q, -2.8, -29 + i * 7, 1.9, 1.9, 0, '#ffd27a', '#b0862a', .8);
    for (const d of [-1, 1]) { q.beginPath(); q.roundRect(d * 13 - 4.5, -24, 9, 7, 2); q.fillStyle = '#4f8a6a'; q.fill(); q.strokeStyle = SK8_DD.hirkaK; q.lineWidth = 1; q.stroke(); }
    q.strokeStyle = 'rgba(160,220,190,.7)'; q.lineWidth = 2.4; q.beginPath(); q.arc(0, -35, 19.5, Math.PI * 1.08, Math.PI * 1.38); q.stroke();
    q.strokeStyle = 'rgba(47,90,72,.35)'; q.lineWidth = 1; for (let i = 0; i < 6; i++) { const x = -18 + i * 7.2; q.beginPath(); q.moveTo(x, -26); q.lineTo(x + .5, -16); q.stroke(); }   // örgü izleri
    q.fillStyle = '#8a5fc8'; q.strokeStyle = '#4f3486'; q.lineWidth = 1;
    q.beginPath(); q.moveTo(0, -55); q.lineTo(-7.5, -59); q.lineTo(-7.5, -51); q.closePath(); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(0, -55); q.lineTo(7.5, -59); q.lineTo(7.5, -51); q.closePath(); q.fill(); q.stroke();
    sk8Elips(q, 0, -55, 2.4, 2.4, 0, '#a27ce0', '#4f3486', 1);
  });
}
function sk8DedeBas() {
  return sk8Tuval('dedeB', -32, -36, 64, 62, q => {
    sk8KabakSekil(q, 0, 0, 29, 22, '#ff9a3c', '#e8702a', '#b2511c', false);
    q.strokeStyle = '#3c5222'; q.lineWidth = 7.5; q.beginPath(); q.moveTo(0, -19); q.quadraticCurveTo(-1, -26, 3.5, -30); q.stroke();
    q.strokeStyle = '#6f8f3e'; q.lineWidth = 5; q.stroke();
    sk8Elips(q, -8.5, -24, 6.5, 3.2, -.5, '#7fb04a', '#4a7a2e', 1.2);
    q.strokeStyle = '#4a7a2e'; q.lineWidth = .8; q.beginPath(); q.moveTo(-13, -21.5); q.lineTo(-4, -26.5); q.stroke();
    q.strokeStyle = '#7fb04a'; q.lineWidth = 1.3; q.beginPath(); q.moveTo(3.5, -29); q.quadraticCurveTo(9, -33, 11, -28); q.quadraticCurveTo(12, -24, 9, -25); q.stroke();
    sk8Elips(q, -16, 6.5, 4.6, 3, 0, 'rgba(255,100,130,.42)'); sk8Elips(q, 16, 6.5, 4.6, 3, 0, 'rgba(255,100,130,.42)');
  });
}
function sk8Dede(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, z = sk8Zipla(t, o), d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -z);
  c.rotate(Math.sin(faz * Math.PI) * .05 * d);
  const nf = 1 + Math.sin(t * 2.4) * .012;
  c.save(); c.scale(1, nf); sk8Koy(c, sk8DedeGovde(), 0, 0); c.restore();
  if ((o.uzat || 0) > .15) {   // şeker kâsesi ellerin arasında
    const hx = yon * 5, hy = -48 + 25 * .42 + 3;
    c.globalAlpha = clamp((o.uzat - .15) / .3, 0, 1); sk8Koy(c, sk8KaseSpr(), hx, hy); c.globalAlpha = 1;
  }
  sk8Kollar(c, t, o, 19, -48, 25, 7.5, SK8_DD.hirka, SK8_DD.hirkaK, SK8_DD.el, SK8_DD.elK, 4.6);
  sk8ElYaz(x, y - z * s, s, (SK8_EL.lx + SK8_EL.rx) / 2, Math.min(SK8_EL.ly, SK8_EL.ry) - 4);
  // baş
  const bx = Math.sin(t * 1.3) * .6, by = -78 + (nf - 1) * -30, ba = (o.kafa || 0) * .12 + Math.sin(faz * Math.PI) * .07 * d + yon * .03;
  c.save(); c.translate(bx, by); c.rotate(ba);
  sk8Koy(c, sk8DedeBas(), 0, 0);
  const kp = sk8Kirp(t, 0.3), gx = yon * 1.1 * (1 - sev * .5), mut = Math.max(kik, sev > .8 && sas < .2 ? (Math.sin(t * 1.7) > .3 ? 1 : 0) * sev : 0);
  sk8Goz(c, -8.5, -1, 4.3, gx, 0, kp, mut, sas); sk8Goz(c, 8.5, -1, 4.3, gx, 0, kp, mut, sas);
  c.strokeStyle = '#f0cf6a'; c.lineWidth = 1.7; c.beginPath(); c.arc(-8.5, -1, 6.9, 0, SK8_PI2); c.moveTo(15.4, -1); c.arc(8.5, -1, 6.9, 0, SK8_PI2); c.stroke();
  c.beginPath(); c.moveTo(-1.8, -2.4); c.quadraticCurveTo(0, -4, 1.8, -2.4); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1; c.beginPath(); c.arc(-8.5, -1, 5.4, 3.6, 4.4); c.moveTo(8.5 + 5.4 * Math.cos(3.6), -1 + 5.4 * Math.sin(3.6)); c.arc(8.5, -1, 5.4, 3.6, 4.4); c.stroke();
  const kb = -10.5 - sas * 2.5 - sev * .8;   // kaşlar (beyaz, gür)
  c.strokeStyle = '#d8c8b4'; c.lineWidth = 4.6; c.beginPath(); c.moveTo(-12.5, kb + 1); c.quadraticCurveTo(-8.5, kb - 2, -4.5, kb + .6); c.moveTo(4.5, kb + .6); c.quadraticCurveTo(8.5, kb - 2, 12.5, kb + 1); c.stroke();
  c.strokeStyle = '#fffaf0'; c.lineWidth = 3.2; c.stroke();
  sk8Elips(c, 0, 5, 3.4, 2.7, 0, '#ef8a3a', '#b2511c', 1);
  const ag = 14 + sas * 1;
  sk8Agiz(c, 0, ag, 4.8, .8 + sev * .2, Math.max(sev * .8, kik), sas);
  for (const dd of [-1, 1]) sk8Elips(c, dd * 4.8, 9.4, 5.6, 3.1, dd * .28, '#fffaf0', '#d8c8b4', 1);
  c.restore();
  KOMSU.basX = x; KOMSU.basY = y + (by - z) * s;
  c.restore();
}

// ── Kabak İkizler (kabakDede2): iki minik kabak kafalı çocuk; A pembe fiyonklu-mor tulumlu, B yaprak şapkalı-yeşil tulumlu ──
const SK8_IK = [{ tulum: '#8a5fc8', tulumK: '#4f3486', serit: '#ffb347' }, { tulum: '#4fae86', tulumK: '#256a50', serit: '#e8ff8a' }];
function sk8CocukGovde(v) {
  const P2 = SK8_IK[v];
  return sk8Tuval('cocG' + v, -17, -40, 34, 44, q => {
    for (const d of [-1, 1]) { q.beginPath(); q.roundRect(d * 5 - 2.8, -13, 5.6, 10, 2); q.fillStyle = P2.tulum; q.fill(); q.strokeStyle = P2.tulumK; q.lineWidth = 1.2; q.stroke(); sk8Elips(q, d * 5.6, -2.6, 5.4, 3.2, 0, '#4a3060', '#2a1a40', 1.2); }
    const yol = () => { q.beginPath(); q.ellipse(0, -22, 12.5, 13.5, 0, 0, SK8_PI2); };
    yol(); q.fillStyle = P2.tulum; q.fill();
    q.save(); yol(); q.clip(); q.fillStyle = P2.serit; for (let i = 0; i < 3; i++) q.fillRect(-14, -31 + i * 7.5, 28, 3.2); q.restore();
    yol(); q.strokeStyle = P2.tulumK; q.lineWidth = 1.6; q.stroke();
    q.beginPath(); q.moveTo(-6, -34); q.quadraticCurveTo(0, -31, 6, -34); q.lineTo(4, -36.5); q.quadraticCurveTo(0, -35, -4, -36.5); q.closePath(); q.fillStyle = '#fff3dc'; q.fill();
    for (const d of [-1, 1]) sk8Elips(q, d * 5, -27, 1.5, 1.5, 0, '#ffd27a', '#b0862a', .7);
    q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 1.8; q.beginPath(); q.arc(0, -22, 10, Math.PI * 1.1, Math.PI * 1.4); q.stroke();
  });
}
function sk8CocukBas(v) {
  return sk8Tuval('cocB' + v, -22, -30, 44, 48, q => {
    sk8KabakSekil(q, 0, 0, 18.5, 14.5, '#ffa046', '#ee7a2e', '#b2511c', false);
    q.strokeStyle = '#3c5222'; q.lineWidth = 5; q.beginPath(); q.moveTo(0, -13); q.quadraticCurveTo(0, -18, 2.5, -20.5); q.stroke(); q.strokeStyle = '#6f8f3e'; q.lineWidth = 3.2; q.stroke();
    if (v === 0) {   // pembe fiyonk
      q.fillStyle = '#ff8fc8'; q.strokeStyle = '#c04a86'; q.lineWidth = 1;
      q.beginPath(); q.moveTo(5, -13); q.quadraticCurveTo(9, -21, 13, -15); q.quadraticCurveTo(9, -12, 5, -13); q.fill(); q.stroke();
      q.beginPath(); q.moveTo(5, -13); q.quadraticCurveTo(10, -9, 13, -7); q.quadraticCurveTo(7, -7, 5, -13); q.fill(); q.stroke();
      sk8Elips(q, 5, -13, 2, 2, 0, '#ffb3d9', '#c04a86', .9);
    } else {   // yaprak şapka
      q.save(); q.translate(-2, -14); q.rotate(-.25); sk8Elips(q, 0, 0, 12, 4.4, 0, '#7fb04a', '#4a7a2e', 1.2); q.strokeStyle = '#4a7a2e'; q.lineWidth = .8; q.beginPath(); q.moveTo(-10, 0); q.lineTo(10, 0); q.stroke(); q.restore();
    }
    sk8Elips(q, -11, 4.5, 3.2, 2.2, 0, 'rgba(255,100,130,.45)'); sk8Elips(q, 11, 4.5, 3.2, 2.2, 0, 'rgba(255,100,130,.45)');
  });
}
function sk8Cocuk(c, v, lx, t, o, faz0) {
  const yon = o.yon < 0 ? -1 : 1, P2 = SK8_IK[v], d = o.dans || 0, faz = (o.faz != null ? o.faz : t * 1.9) + faz0;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  const z = Math.abs(Math.sin(faz * Math.PI)) * 6 * d + Math.sin(clamp(((o.hop || 0) - faz0 * .4), 0, 1) * Math.PI) * 8 + Math.abs(Math.sin(t * 4 + faz0 * 3)) * 1.2 * sev;
  c.save(); c.translate(lx, -z); c.rotate(Math.sin(faz * Math.PI) * .07 * d + (v ? .03 : -.03));
  sk8Koy(c, sk8CocukGovde(v), 0, 0);
  const oo = SK8.oc; oo.yon = yon; oo.alkis = o.alkis; oo.uzat = o.uzat; oo.el = o.el; oo.dans = o.dans; oo.faz = faz; oo.kaldir = o.kaldir;
  sk8Kollar(c, t + faz0, oo, 10, -31, 14, 5.2, P2.tulum, P2.tulumK, '#ffb86b', '#b8692c', 3.4);
  const elx = yon > 0 ? SK8_EL.rx : SK8_EL.lx, ely = yon > 0 ? SK8_EL.ry : SK8_EL.ly;
  if ((o.patlat || 0) > 0) {   // konfeti patlatıcısı (Feza'ya doğru eğik)
    c.save(); c.translate(elx, ely); c.rotate(yon * (.55 + (o.patlat > .5 ? .25 : 0))); sk8Koy(c, sk8PatlatSpr(), 0, 0); c.restore();
  }
  c.save(); c.translate(0, -50); c.rotate((o.kafa || 0) * .1 + Math.sin(faz * Math.PI) * .08 * d);
  sk8Koy(c, sk8CocukBas(v), 0, 0);
  const kp = sk8Kirp(t, v * 1.3 + .7), gx = yon * .9, mut = Math.max(kik, sev > .8 && sas < .2 && Math.sin(t * 2.1 + v) > .4 ? 1 : 0);
  sk8Goz(c, -6.4, -1, 3.5, gx, 0, kp, mut, sas); sk8Goz(c, 6.4, -1, 3.5, gx, 0, kp, mut, sas);
  const kt0 = SK8.kt; SK8.kt = kt0 + faz0 * .37; sk8Agiz(c, 0, 5.6, 3.8, .9, Math.max(.5 + sev * .4, kik), sas); SK8.kt = kt0;
  c.restore();
  c.restore();
  return [lx + elx, ely - z];
}
function sk8Ikiz(c, x, y, s, t, o) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const yon = o.yon < 0 ? -1 : 1;
  const a = sk8Cocuk(c, 0, -15, t, o, 0), b = sk8Cocuk(c, 1, 15, t, o, .5);
  c.restore();
  // Feza'ya yakın olanın eli kaynak
  const e = yon < 0 ? a : b; KOMSU.elX = x + e[0] * s; KOMSU.elY = y + e[1] * s;
  KOMSU.ikizX = x + (yon < 0 ? b[0] : a[0]) * s; KOMSU.ikizY = y + (yon < 0 ? b[1] : a[1]) * s;
  KOMSU.basX = x; KOMSU.basY = y - 50 * s;
}

// ── Cadı Kız: neşeli küçük cadı; yıldızlı mor şapka (ucu eğik), kızıl örgüler, çizgili çoraplar, yıldızlı asa ──
const SK8_CK = { elbise: '#6b46b8', elbiseK: '#3e2577', ten: '#f8d5bc', tenK: '#cf9a7e', sac: '#d8642a', sacK: '#8a3a18' };
function sk8KizGovde() {
  return sk8Tuval('kizG', -24, -50, 48, 54, q => {
    for (const d of [-1, 1]) {
      q.save(); q.beginPath(); q.roundRect(d * 6.5 - 2.6, -19, 5.2, 16, 2); q.clip(); q.fillStyle = '#c39bff'; q.fillRect(d * 6.5 - 3, -20, 6, 18); q.fillStyle = '#5a3aa0'; for (let i = 0; i < 5; i++) q.fillRect(d * 6.5 - 3, -18 + i * 3.4, 6, 1.6); q.restore();
      sk8Elips(q, d * 7, -2.8, 6, 3.4, 0, '#3a2a55', '#1e1430', 1.2); sk8Elips(q, d * 7, -4.4, 1.6, 1.2, 0, '#ffd27a');
    }
    q.beginPath(); q.moveTo(-9, -46); q.quadraticCurveTo(-14, -30, -20, -17);
    for (let i = 0; i < 5; i++) { const x0 = -20 + i * 8; q.quadraticCurveTo(x0 + 4, -12, x0 + 8, -17); }
    q.quadraticCurveTo(14, -30, 9, -46); q.closePath();
    q.fillStyle = SK8_CK.elbise; q.fill(); q.strokeStyle = SK8_CK.elbiseK; q.lineWidth = 1.6; q.stroke();
    for (const [sx, sy, r] of [[-9, -26, 2.6], [6, -34, 2.2], [10, -22, 2.8], [-2, -19, 2], [-4, -38, 1.8]]) { sk8Yildiz(q, sx, sy, r, .45); q.fillStyle = '#ffe7a8'; q.fill(); }
    q.fillStyle = '#ffb347'; q.strokeStyle = '#b0621e'; q.lineWidth = .9;
    for (const d of [-1, 1]) { q.beginPath(); q.moveTo(0, -45); q.lineTo(d * 8, -47); q.lineTo(d * 5, -41); q.closePath(); q.fill(); q.stroke(); }
    q.strokeStyle = 'rgba(255,255,255,.25)'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-7, -42); q.quadraticCurveTo(-11, -30, -15, -20); q.stroke();
  });
}
function sk8KizBas() {
  return sk8Tuval('kizB', -30, -52, 60, 72, q => {
    for (const d of [-1, 1]) { sk8Elips(q, d * 15.5, 7, 5.6, 8.5, d * .2, SK8_CK.sac, SK8_CK.sacK, 1.3); sk8Elips(q, d * 17, 14.5, 3.6, 3.4, 0, SK8_CK.sac, SK8_CK.sacK, 1.1);
      q.fillStyle = '#7dffc4'; q.strokeStyle = '#2a9a76'; q.lineWidth = .8; q.beginPath(); q.moveTo(d * 14, -1); q.lineTo(d * 19, -4); q.lineTo(d * 19, 2); q.closePath(); q.fill(); q.stroke(); q.beginPath(); q.moveTo(d * 14, -1); q.lineTo(d * 9.5, -4); q.lineTo(d * 9.5, 2); q.closePath(); q.fill(); q.stroke(); }
    sk8Elips(q, 0, 0, 14.5, 14, 0, SK8_CK.ten, SK8_CK.tenK, 1.6);
    q.beginPath(); q.moveTo(-14.6, 0); q.quadraticCurveTo(-15, -13, 0, -14.4); q.quadraticCurveTo(15, -13, 14.6, 0); q.quadraticCurveTo(11, -5, 7, -6); q.quadraticCurveTo(4, -3, 1, -6.5); q.quadraticCurveTo(-3, -3.5, -6, -6.5); q.quadraticCurveTo(-11, -5, -14.6, 0); q.closePath();
    q.fillStyle = SK8_CK.sac; q.fill(); q.strokeStyle = SK8_CK.sacK; q.lineWidth = 1.2; q.stroke();
    sk8Elips(q, -9.5, 6, 3.4, 2.3, 0, 'rgba(255,110,150,.45)'); sk8Elips(q, 9.5, 6, 3.4, 2.3, 0, 'rgba(255,110,150,.45)');
    q.fillStyle = 'rgba(190,110,70,.55)'; for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { q.beginPath(); q.arc(d * (8 + i * 1.6), 4 + (i % 2) * 1.2, .55, 0, SK8_PI2); q.fill(); }
    // şapka: kenar + eğik külah + bant + uçta yıldız
    q.beginPath(); q.moveTo(-11, -12); q.quadraticCurveTo(-6, -30, 2, -41); q.quadraticCurveTo(7, -47, 12, -44); q.quadraticCurveTo(8, -42, 7, -37); q.quadraticCurveTo(9, -24, 11.5, -12); q.closePath();
    q.fillStyle = '#5a3aa0'; q.fill(); q.strokeStyle = '#2e1a5a'; q.lineWidth = 1.5; q.stroke();
    q.fillStyle = '#ffb347'; q.beginPath(); q.moveTo(-10.6, -13.5); q.quadraticCurveTo(0, -11.5, 11.2, -13.5); q.lineTo(10.4, -18); q.quadraticCurveTo(0, -16, -9.4, -18); q.closePath(); q.fill();
    sk8Elips(q, 0, -11.5, 22, 4.6, 0, '#5a3aa0', '#2e1a5a', 1.5);
    sk8Yildiz(q, 12.5, -44.5, 4, .45); q.fillStyle = '#ffe066'; q.fill(); q.strokeStyle = '#b8862a'; q.lineWidth = .8; q.stroke();
    for (const [sx, sy] of [[-3, -26], [4, -31], [-5, -19.5]]) { sk8Yildiz(q, sx, sy, 1.8, .45); q.fillStyle = '#ffe7a8'; q.fill(); }
    q.strokeStyle = 'rgba(255,255,255,.3)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(-6, -17); q.quadraticCurveTo(-3, -28, 1, -36); q.stroke();
  });
}
function sk8Kiz(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, z = sk8Zipla(t, o), d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -z); c.rotate(Math.sin(faz * Math.PI) * .06 * d);
  sk8Koy(c, sk8KizGovde(), 0, 0);
  sk8Kollar(c, t, o, 9.5, -43, 17, 4.8, SK8_CK.elbise, SK8_CK.elbiseK, SK8_CK.ten, SK8_CK.tenK, 3.2);
  // asa: Feza'dan uzak eldedir (kaldır pozunda havada)
  const ax = yon > 0 ? SK8_EL.lx : SK8_EL.rx, ay = yon > 0 ? SK8_EL.ly : SK8_EL.ry;
  c.save(); c.translate(ax, ay); c.rotate(-yon * (.35 + (o.kaldir || 0) * .3 * Math.sin(t * 9))); sk8Koy(c, sk8AsaSpr(), 0, 0); c.restore();
  KOMSU.asaX = x + (ax - yon * 6) * s; KOMSU.asaY = y + (ay - 16 - z) * s;
  sk8ElYaz(x, y - z * s, s, yon > 0 ? SK8_EL.rx : SK8_EL.lx, yon > 0 ? SK8_EL.ry : SK8_EL.ly);
  c.save(); c.translate(0, -60); c.rotate((o.kafa || 0) * .1 + Math.sin(faz * Math.PI) * .08 * d + Math.sin(t * 1.6) * .02);
  sk8Koy(c, sk8KizBas(), 0, 0);
  const kp = sk8Kirp(t, 1.9), gx = yon * 1, mut = Math.max(kik, sev > .8 && sas < .2 && Math.sin(t * 1.9) > .45 ? 1 : 0);
  sk8Goz(c, -5.4, 1.2, 3.6, gx, 0, kp, mut, sas); sk8Goz(c, 5.4, 1.2, 3.6, gx, 0, kp, mut, sas);
  c.strokeStyle = SK8_CK.sacK; c.lineWidth = 1.1; const kb = -4.6 - sas * 1.6; c.beginPath(); c.moveTo(-7.5, kb); c.quadraticCurveTo(-5.4, kb - 1.4, -3.3, kb); c.moveTo(3.3, kb); c.quadraticCurveTo(5.4, kb - 1.4, 7.5, kb); c.stroke();
  sk8Agiz(c, 0, 7.4, 3.6, .9, Math.max(sev * .9, kik), sas);
  c.restore();
  KOMSU.basX = x; KOMSU.basY = y + (-60 - z) * s;
  c.restore();
}

// ── Kara Kedi: iki ayak üstünde duran, iri yeşil gözlü, mor silindir şapkalı, turuncu papyonlu tatlı kara kedi ──
const SK8_KD = { kurk: '#2e2444', kurkA: '#4d4070', kurkK: '#140d22', karin: '#443a64', pati: '#3a2f56' };
function sk8KediGovde() {
  return sk8Tuval('kediG', -26, -60, 52, 64, q => {
    for (const d of [-1, 1]) { sk8Elips(q, d * 9, -3.6, 8.6, 5, 0, SK8_KD.pati, SK8_KD.kurkK, 1.6); q.strokeStyle = SK8_KD.kurkK; q.lineWidth = .9; q.beginPath(); q.moveTo(d * 9 - 2.4, -1.5); q.lineTo(d * 9 - 2.6, -4); q.moveTo(d * 9 + 2.4, -1.5); q.lineTo(d * 9 + 2.6, -4); q.stroke(); }
    sk8Elips(q, 0, -30, 20, 25, 0, SK8_KD.kurk, SK8_KD.kurkK, 2);
    sk8Elips(q, 0, -25, 11.5, 15.5, 0, SK8_KD.karin);
    q.strokeStyle = 'rgba(120,104,170,.55)'; q.lineWidth = 2.2; q.beginPath(); q.arc(0, -30, 17, Math.PI * 1.1, Math.PI * 1.42); q.stroke();
    q.fillStyle = '#ffb347'; q.strokeStyle = '#b0621e'; q.lineWidth = 1;
    q.beginPath(); q.moveTo(0, -52); q.lineTo(-7.5, -56); q.lineTo(-7.5, -48); q.closePath(); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(0, -52); q.lineTo(7.5, -56); q.lineTo(7.5, -48); q.closePath(); q.fill(); q.stroke();
    sk8Elips(q, 0, -52, 2.3, 2.3, 0, '#ffd27a', '#b0621e', 1);
  });
}
function sk8KediBas() {
  return sk8Tuval('kediB', -30, -36, 60, 62, q => {
    for (const d of [-1, 1]) {
      q.beginPath(); q.moveTo(d * 20, -6); q.quadraticCurveTo(d * 19, -24, d * 17, -31); q.quadraticCurveTo(d * 9, -24, d * 4, -16); q.closePath(); q.fillStyle = SK8_KD.kurk; q.fill(); q.strokeStyle = SK8_KD.kurkK; q.lineWidth = 1.8; q.stroke();
      q.beginPath(); q.moveTo(d * 17, -10); q.quadraticCurveTo(d * 17, -21, d * 16, -25.5); q.quadraticCurveTo(d * 11, -21, d * 8, -16); q.closePath(); q.fillStyle = '#ff9fc0'; q.fill();
    }
    sk8Elips(q, 0, 0, 22.5, 18.5, 0, SK8_KD.kurk, SK8_KD.kurkK, 2);
    for (const d of [-1, 1]) { q.fillStyle = SK8_KD.kurk; q.beginPath(); q.moveTo(d * 20, 2); q.lineTo(d * 25, 6); q.lineTo(d * 20.5, 8); q.lineTo(d * 23.5, 11); q.lineTo(d * 18, 11.5); q.closePath(); q.fill(); q.strokeStyle = SK8_KD.kurkK; q.lineWidth = 1.2; q.stroke(); }
    sk8Elips(q, -4.3, 8.5, 5.2, 3.9, 0, '#433863'); sk8Elips(q, 4.3, 8.5, 5.2, 3.9, 0, '#433863');
    q.beginPath(); q.moveTo(-2.4, 4.4); q.quadraticCurveTo(0, 3.6, 2.4, 4.4); q.quadraticCurveTo(1.2, 7, 0, 7.2); q.quadraticCurveTo(-1.2, 7, -2.4, 4.4); q.closePath(); q.fillStyle = '#ff8fb0'; q.fill();
    sk8Elips(q, -13, 8, 3.8, 2.4, 0, 'rgba(255,140,190,.32)'); sk8Elips(q, 13, 8, 3.8, 2.4, 0, 'rgba(255,140,190,.32)');
    q.strokeStyle = 'rgba(214,206,240,.85)'; q.lineWidth = .9;
    for (const d of [-1, 1]) for (let i = 0; i < 3; i++) { q.beginPath(); q.moveTo(d * 9, 7 + i * 1.8); q.quadraticCurveTo(d * 17, 4 + i * 2.8, d * 25, 3 + i * 4.4); q.stroke(); }
    q.strokeStyle = 'rgba(120,104,170,.5)'; q.lineWidth = 2; q.beginPath(); q.arc(0, 0, 19.5, Math.PI * 1.15, Math.PI * 1.45); q.stroke();
  });
}
function sk8Kedi(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, z = sk8Zipla(t, o), d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -z); c.rotate(Math.sin(faz * Math.PI) * .06 * d);
  // kuyruk (arkada, sallanır)
  const kq = Math.sin(t * 2.2) * 5 + Math.sin(faz * Math.PI) * 6 * d, kx = -yon;
  c.strokeStyle = SK8_KD.kurkK; c.lineWidth = 8.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(kx * 14, -14); c.bezierCurveTo(kx * 30, -14, kx * (26 + kq * .3), -40, kx * (30 + kq), -50); c.stroke();
  c.strokeStyle = SK8_KD.kurk; c.lineWidth = 6.2; c.stroke();
  sk8Koy(c, sk8KediGovde(), 0, 0);
  sk8Kollar(c, t, o, 15, -45, 20, 7, SK8_KD.kurk, SK8_KD.kurkK, SK8_KD.pati, SK8_KD.kurkK, 4.8);
  if ((o.alkis || 0) > .3) for (const [px, py] of [[SK8_EL.lx, SK8_EL.ly], [SK8_EL.rx, SK8_EL.ry]]) { c.fillStyle = '#ff9fc0'; c.beginPath(); c.arc(px, py + .8, 1.7, 0, SK8_PI2); c.arc(px - 2, py - 2, .8, 0, SK8_PI2); c.arc(px, py - 2.8, .8, 0, SK8_PI2); c.arc(px + 2, py - 2, .8, 0, SK8_PI2); c.fill(); }
  const elx = yon > 0 ? SK8_EL.rx : SK8_EL.lx, ely = yon > 0 ? SK8_EL.ry : SK8_EL.ly;
  // baş + şapka (sapka 0..1: şapkayı patisiyle alıp Feza'ya doğru eğer → içinden şeker dökülür)
  const sp = clamp(o.sapka || 0, 0, 1), sps = smooth(sp);
  c.save(); c.translate(0, -64); c.rotate((o.kafa || 0) * .1 + Math.sin(faz * Math.PI) * .08 * d + Math.sin(t * 1.4) * .025);
  sk8Koy(c, sk8KediBas(), 0, 0);
  const kp = sk8Kirp(t, 2.6), gx = yon * 1.2, mut = Math.max(kik, sev > .8 && sas < .2 && Math.sin(t * 1.8) > .45 ? 1 : 0);
  for (const dd of [-1, 1]) {
    const ex = dd * 8.6, ey = -2;
    if (mut > .55 || kp > .8) sk8Goz(c, ex, ey, 6, 0, 0, kp, mut, 0, '#2a1a38', '#d6ceef');
    else {
      const rr = 1 + .15 * sas, ry = 7 * rr * (1 - kp * .9);
      c.fillStyle = '#8fe36a'; c.strokeStyle = '#1e3a12'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(ex, ey, 6.2 * rr, ry, 0, 0, SK8_PI2); c.fill(); c.stroke();
      c.fillStyle = '#c8ff9a'; c.beginPath(); c.ellipse(ex - gx * .3, ey + ry * .4, 4.4 * rr, ry * .45, 0, 0, SK8_PI2); c.fill();
      c.fillStyle = '#1a1424'; c.beginPath(); c.ellipse(ex + gx, ey, (3.3 + sas * 1.2) * rr, ry * .78, 0, 0, SK8_PI2); c.fill();
      c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex + gx - 2, ey - ry * .4, 1.9 * rr, 0, SK8_PI2); c.fill(); c.beginPath(); c.arc(ex + gx + 1.8, ey + ry * .3, .9, 0, SK8_PI2); c.fill();
    }
  }
  if (sas > .45 || sev > .3 || kik > .3) sk8Agiz(c, 0, 9.4, 3.4, 1, Math.max(.6, kik), sas, '#5a2440');
  else { c.strokeStyle = '#d6ceef'; c.lineWidth = 1.1; c.beginPath(); c.moveTo(-4, 9); c.quadraticCurveTo(-2, 11.5, 0, 9.4); c.quadraticCurveTo(2, 11.5, 4, 9); c.stroke(); }
  if (sps < .02) { c.save(); c.translate(3, -18); c.rotate(-.18 + Math.sin(t * 1.4) * .03); sk8Koy(c, sk8KediSapkaSpr(), 0, 0); c.restore(); }
  c.restore();
  if (sps >= .02) {   // şapka patide
    const hx0 = 3, hy0 = -82, hx1 = elx + yon * 2, hy1 = ely - 6;
    const hx = lerp(hx0, hx1, sps), hy = lerp(hy0, hy1, sps) - Math.sin(sps * Math.PI) * 10, ha = lerp(-.18, yon * 2.3, sps) + (sp > .99 ? Math.sin(t * 8) * .06 : 0);
    c.save(); c.translate(hx, hy); c.rotate(ha); sk8Koy(c, sk8KediSapkaSpr(), 0, 0); c.restore();
    KOMSU.elX = x + (hx + Math.sin(ha) * 12) * s; KOMSU.elY = y + (hy - Math.cos(ha) * 12 - z) * s;
  } else sk8ElYaz(x, y - z * s, s, elx, ely);
  KOMSU.basX = x; KOMSU.basY = y + (-64 - z) * s;
  c.restore();
}

// ── Hayalet Teyze: dantelli, pastel lila-beyaz, gözlüklü, inci kolyeli, çiçekli minik şapkalı; süzülür, kıkırdar ──
const SK8_HT = { g: '#f6efff', gk: '#b9a6dc', golge: '#d9c8f2' };
function sk8TeyzeSapka() {
  return sk8Tuval('teyzeS', -16, -14, 32, 20, q => {
    sk8Elips(q, 0, 0, 13, 3.6, 0, '#c39bff', '#7a5ab8', 1.3);
    q.beginPath(); q.moveTo(-8, 0); q.quadraticCurveTo(-8, -9, 0, -9.5); q.quadraticCurveTo(8, -9, 8, 0); q.closePath(); q.fillStyle = '#c9a6ff'; q.fill(); q.strokeStyle = '#7a5ab8'; q.lineWidth = 1.3; q.stroke();
    q.fillStyle = '#ff8fc8'; q.fillRect(-7.8, -3.4, 15.6, 2.4);
    for (let i = 0; i < 5; i++) { const a = i / 5 * SK8_PI2; sk8Elips(q, 7 + Math.cos(a) * 2.6, -5 + Math.sin(a) * 2.6, 2.2, 2.2, 0, '#ff9fd0', '#d0609a', .7); }
    sk8Elips(q, 7, -5, 1.5, 1.5, 0, '#ffe066');
  }, 5);
}
function sk8Teyze(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  const z = sk8Zipla(t, o) + 4 + Math.sin(t * 1.8) * 2.5, jx = Math.sin(t * 24) * .7 * kik;
  c.save(); c.translate(x + jx, y); c.scale(s, s); c.translate(0, -z); c.rotate(Math.sin(faz * Math.PI) * .07 * d + Math.sin(t * 1.1) * .02);
  // gövde (dalgalı etek): kare başına tek yol
  const dal = t * 3.2;
  c.beginPath(); c.moveTo(-25, -64); c.arc(0, -64, 25, Math.PI, SK8_PI2); c.quadraticCurveTo(26, -38, 27.5, -14 + Math.sin(dal) * 2);
  for (let i = 0; i < 4; i++) { const x0 = 27.5 - i * 13.75, x1 = x0 - 13.75; c.quadraticCurveTo((x0 + x1) / 2, -6 + Math.sin(dal + i * 1.7) * 2.5, x1, -14 + Math.sin(dal + (i + 1) * 1.4) * 2); }
  c.quadraticCurveTo(-26, -38, -25, -64); c.closePath();
  c.fillStyle = SK8_HT.g; c.fill(); c.strokeStyle = SK8_HT.gk; c.lineWidth = 2; c.stroke();
  sk8Elips(c, 9, -36, 11, 17, .1, 'rgba(201,182,238,.28)');
  sk8Elips(c, -11, -76, 6, 9, -.5, 'rgba(255,255,255,.75)');
  // dantel etek ucu
  for (let i = 0; i < 7; i++) { const lx = -21 + i * 7, ly = -12.5 + Math.sin(dal + i * .9) * 2; c.fillStyle = '#ffffff'; c.strokeStyle = '#e2cdef'; c.lineWidth = .9; c.beginPath(); c.arc(lx, ly, 3, 0, Math.PI); c.fill(); c.stroke(); c.fillStyle = '#ffb8d8'; c.beginPath(); c.arc(lx, ly + 1, .9, 0, SK8_PI2); c.fill(); }
  // dantel yaka + inci kolye
  c.fillStyle = '#ffffff'; c.strokeStyle = '#e2cdef'; c.lineWidth = .9;
  for (let i = 0; i < 6; i++) { const a = Math.PI * (.12 + i * .152), lx = Math.cos(a) * 15, ly = -50 + Math.sin(a) * 5; c.beginPath(); c.arc(lx, ly, 3.4, 0, SK8_PI2); c.fill(); c.stroke(); }
  for (let i = 0; i < 7; i++) { const a = Math.PI * (.18 + i * .107); sk8Elips(c, Math.cos(a) * 11, -46 + Math.sin(a) * 4.6, 1.6, 1.6, 0, '#fff8ee', '#d8c4b0', .6); }
  // kollar (minik)
  sk8Kollar(c, t, o, 22, -44, 13, 8, SK8_HT.g, SK8_HT.gk, SK8_HT.g, SK8_HT.gk, 4.4);
  const elx = yon > 0 ? SK8_EL.rx : SK8_EL.lx, ely = yon > 0 ? SK8_EL.ry : SK8_EL.ly;
  if ((o.cubuk || 0) > 0) {   // baloncuk çubuğu
    c.globalAlpha = clamp(o.cubuk * 3, 0, 1); c.save(); c.translate(elx, ely); c.rotate(yon * .7); sk8Koy(c, sk8CubukSpr(), 0, 0); c.restore(); c.globalAlpha = 1;
    KOMSU.cubukX = x + (elx + Math.sin(yon * .7) * 17) * s; KOMSU.cubukY = y + (ely - Math.cos(yon * .7) * 17 - z) * s;
  }
  sk8ElYaz(x, y - z * s, s, elx, ely);
  // yüz
  const kp = sk8Kirp(t, 3.1), gx = yon * 1.1, mut = Math.max(kik, sev > .8 && sas < .2 && Math.sin(t * 1.6) > .4 ? 1 : 0);
  sk8Goz(c, -9, -64, 4.5, gx, 0, kp, mut, sas); sk8Goz(c, 9, -64, 4.5, gx, 0, kp, mut, sas);
  c.strokeStyle = '#ff8fc8'; c.lineWidth = 1.8; c.beginPath(); c.arc(-9, -64, 7.4, 0, SK8_PI2); c.moveTo(16.4, -64); c.arc(9, -64, 7.4, 0, SK8_PI2); c.stroke();
  c.beginPath(); c.moveTo(-1.8, -65.5); c.quadraticCurveTo(0, -67, 1.8, -65.5); c.stroke();
  sk8Elips(c, -16, -56, 4, 2.6, 0, 'rgba(255,110,160,.4)'); sk8Elips(c, 16, -56, 4, 2.6, 0, 'rgba(255,110,160,.4)');
  sk8Agiz(c, 0, -54, 4, .9, Math.max(sev * .7, kik), sas, '#7a3a5a');
  c.save(); c.translate(7, -86); c.rotate(.22); sk8Koy(c, sk8TeyzeSapka(), 0, 0); c.restore();
  KOMSU.basX = x; KOMSU.basY = y + (-64 - z) * s;
  c.restore();
}

// ── İskelet Nine: yuvarlak gülen kafa, iri parlak gözler, gözlük, lila bere; şal, dantelli uzun etek, tombul kemik kollar ──
const SK8_NN = { kemik: '#fbf6ee', kemikK: '#b3a594', elbise: '#4a3585', elbiseK: '#2a1d55', sal: '#f0a6c8', salK: '#b86a90' };
function sk8NineGovde() {
  return sk8Tuval('nineG', -28, -58, 56, 62, q => {
    for (const d of [-1, 1]) {
      q.beginPath(); q.roundRect(d * 7.5 - 2.3, -15, 4.6, 11, 2); q.fillStyle = SK8_NN.kemik; q.fill(); q.strokeStyle = SK8_NN.kemikK; q.lineWidth = 1.2; q.stroke();
      sk8Elips(q, d * 8, -3, 7, 3.6, 0, '#f0a6c8', '#b86a90', 1.3); sk8Elips(q, d * 8, -5.6, 2.3, 2, 0, '#ffe0ef', '#d8a8c0', .7);
    }
    q.beginPath(); q.moveTo(-12, -46); q.quadraticCurveTo(-16, -30, -20, -15); q.quadraticCurveTo(0, -11, 20, -15); q.quadraticCurveTo(16, -30, 12, -46); q.closePath();
    q.fillStyle = SK8_NN.elbise; q.fill(); q.strokeStyle = SK8_NN.elbiseK; q.lineWidth = 1.6; q.stroke();
    q.fillStyle = '#ffffff'; q.strokeStyle = '#d8c8e8'; q.lineWidth = .8;
    for (let i = 0; i < 6; i++) { const lx = -16.5 + i * 6.6, ly = -14.2 + Math.abs(i - 2.5) * .35; q.beginPath(); q.arc(lx, ly, 3.1, 0, Math.PI); q.fill(); q.stroke(); }
    q.fillStyle = '#c39bff'; for (const [fx, fy] of [[-9, -22], [5, -27], [11, -19], [-3, -33], [-12, -34]]) { q.beginPath(); q.arc(fx, fy, 1.2, 0, SK8_PI2); q.fill(); }
    q.beginPath(); q.roundRect(-3, -54, 6, 6, 2); q.fillStyle = SK8_NN.kemik; q.fill(); q.strokeStyle = SK8_NN.kemikK; q.lineWidth = 1; q.stroke();
    // şal
    q.beginPath(); q.moveTo(-20, -49); q.quadraticCurveTo(0, -55, 20, -49); q.quadraticCurveTo(12, -36, 0, -27); q.quadraticCurveTo(-12, -36, -20, -49); q.closePath();
    q.fillStyle = SK8_NN.sal; q.fill(); q.strokeStyle = SK8_NN.salK; q.lineWidth = 1.4; q.stroke();
    q.strokeStyle = '#ffd0e4'; q.lineWidth = 1.1;
    for (let i = 0; i <= 8; i++) { const u = i / 8; for (const d of [-1, 1]) { const px = d * lerp(20, 0, u), py = lerp(-49, -27, u) + Math.sin(u * Math.PI) * 4; q.beginPath(); q.moveTo(px, py); q.lineTo(px + d * .5, py + 3.4); q.stroke(); } }
    q.strokeStyle = 'rgba(184,106,144,.5)'; q.lineWidth = .9;
    for (let i = 0; i < 4; i++) { q.beginPath(); q.moveTo(-10 + i * 6, -45); q.lineTo(-8 + i * 6, -42.5); q.lineTo(-6 + i * 6, -45); q.stroke(); }
    sk8Elips(q, 0, -47, 2.6, 2.6, 0, '#ffd27a', '#a07a2a', .9);
  });
}
function sk8NineBas() {
  return sk8Tuval('nineB', -24, -34, 48, 56, q => {
    q.fillStyle = SK8_NN.kemikK; q.beginPath(); q.arc(0, -2, 18.6, 0, SK8_PI2); q.fill(); q.beginPath(); q.ellipse(0, 8, 13, 9, 0, 0, SK8_PI2); q.fill();
    q.fillStyle = SK8_NN.kemik; q.beginPath(); q.arc(0, -2, 17, 0, SK8_PI2); q.fill(); q.beginPath(); q.ellipse(0, 8, 11.4, 7.6, 0, 0, SK8_PI2); q.fill();
    sk8Elips(q, -7, -11, 5, 3.4, -.5, 'rgba(255,255,255,.9)');
    sk8Elips(q, -10.5, 4, 3.6, 2.4, 0, 'rgba(255,120,160,.45)'); sk8Elips(q, 10.5, 4, 3.6, 2.4, 0, 'rgba(255,120,160,.45)');
    q.fillStyle = '#e4d8cb'; q.beginPath(); q.moveTo(0, 4.8); q.quadraticCurveTo(-2.6, 2.6, -1.4, 1.6); q.quadraticCurveTo(0, 1.2, 0, 2.4); q.quadraticCurveTo(0, 1.2, 1.4, 1.6); q.quadraticCurveTo(2.6, 2.6, 0, 4.8); q.fill();
    // lila bere + ponpon + çiçek
    q.save(); q.translate(-3, -16); q.rotate(-.22);
    q.beginPath(); q.ellipse(0, 0, 15.5, 6.2, 0, Math.PI, SK8_PI2); q.quadraticCurveTo(0, 3.4, -15.5, 0); q.closePath(); q.fillStyle = '#c39bff'; q.fill(); q.strokeStyle = '#7a5ab8'; q.lineWidth = 1.3; q.stroke();
    q.strokeStyle = 'rgba(122,90,184,.45)'; q.lineWidth = .8; for (let i = -2; i <= 2; i++) { q.beginPath(); q.moveTo(i * 5, -5); q.lineTo(i * 5.6, 1.4); q.stroke(); }
    sk8Elips(q, 0, -6.4, 3.4, 3.2, 0, '#ffd0e4', '#d0889e', 1);
    q.restore();
    for (let i = 0; i < 5; i++) { const a = i / 5 * SK8_PI2; sk8Elips(q, 10 + Math.cos(a) * 2.4, -15 + Math.sin(a) * 2.4, 2, 2, 0, '#ff9fd0', '#d0609a', .7); }
    sk8Elips(q, 10, -15, 1.4, 1.4, 0, '#ffe066');
  });
}
function sk8Nine(c, x, y, s, t, o) {
  const yon = o.yon < 0 ? -1 : 1, z = sk8Zipla(t, o), d = o.dans || 0, faz = o.faz != null ? o.faz : t * 1.9;
  const sev = Math.max(o.sevinc || 0, d), sas = o.sasir || 0, kik = o.kik || 0;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(0, -z); c.rotate(Math.sin(faz * Math.PI) * .05 * d);
  sk8Koy(c, sk8NineGovde(), 0, 0);
  sk8Kollar(c, t, o, 16, -46, 21, 4.4, SK8_NN.kemik, SK8_NN.kemikK, SK8_NN.kemik, SK8_NN.kemikK, 3.7, true);
  sk8ElYaz(x, y - z * s, s, (SK8_EL.lx + SK8_EL.rx) / 2, Math.min(SK8_EL.ly, SK8_EL.ry));
  // baş (takır takır sallanır: o.kafa)
  const kf = o.kafa || 0;
  c.save(); c.translate(kf * 1.2, -70 - Math.abs(kf) * 1.2); c.rotate(kf * .16 + Math.sin(faz * Math.PI) * .1 * d + Math.sin(t * 1.5) * .02);
  sk8Koy(c, sk8NineBas(), 0, 0);
  const kp = sk8Kirp(t, 1.2), gx = yon * 1, mut = Math.max(kik, sev > .8 && sas < .2 && Math.sin(t * 1.5) > .4 ? 1 : 0);
  sk8Goz(c, -6.8, -3, 4.1, gx, 0, kp, mut, sas); sk8Goz(c, 6.8, -3, 4.1, gx, 0, kp, mut, sas);
  c.strokeStyle = '#e0b24a'; c.lineWidth = 1.6; c.beginPath(); c.arc(-6.8, -3, 6.4, 0, SK8_PI2); c.moveTo(13.2, -3); c.arc(6.8, -3, 6.4, 0, SK8_PI2); c.stroke();
  c.beginPath(); c.moveTo(-1.4, -4.2); c.quadraticCurveTo(0, -5.4, 1.4, -4.2); c.stroke();
  c.strokeStyle = 'rgba(224,178,74,.7)'; c.lineWidth = .8; c.beginPath(); c.moveTo(-13, -3); c.quadraticCurveTo(-15, 2, -12, 8); c.moveTo(13, -3); c.quadraticCurveTo(15, 2, 12, 8); c.stroke();   // gözlük zinciri
  sk8Agiz(c, 0, 8.5, 4.2, .9, Math.max(sev * .75, kik), sas, '#6a4a5a');
  c.restore();
  KOMSU.basX = x; KOMSU.basY = y + (-70 - z) * s;
  c.restore();
}

function sk8BasY(kim) { return sk8DisAcik(kim) ? SK8_DIS[kim].basY : (SK8_BASY[kim] || -70); }
function sk8DisAcik(kim) { const d = SK8_DIS[kim]; return !!(d && d.ac && typeof globalThis[d.ad] === 'function'); }
// Ortak çizici. Başka dosyanın çizicisi SK8_DIS'te açıksa o, değilse buradaki yedek.
const SK8_DO = {};   // dış çizicilere giden seçenekler (kare başına yeni nesne yok)
function komsuCiz(c, kim, x, y, s, t, o) {
  if (!(Number.isFinite(x) && Number.isFinite(y))) return;
  c = c || g; o = o || SK8.bos; s = s || 1; t = Number.isFinite(t) ? t : now;
  SK8.kk = clamp(o.konus || 0, 0, 1); SK8.kt = t;
  try { sk8KomsuCiz(c, kim, x, y, s, t, o); } finally { SK8.kk = 0; }
}
function sk8KomsuCiz(c, kim, x, y, s, t, o) {
  const dis = SK8_DIS[kim];
  if (dis && dis.ac && typeof globalThis[dis.ad] === 'function') {
    const D2 = SK8_DO; for (const k in D2) D2[k] = undefined;
    const yon = o.yon < 0 ? -1 : 1, sev = o.sevinc || 0, kik = o.kik || 0, z = sk8Zipla(t, o) * s;
    const mut = Math.max(kik > .3 ? 1 : 0, sev > .8 && !(o.sasir > .2) && Math.sin(t * 1.6) > .45 ? 1 : 0);
    const kk = SK8.kk, ka = kk > 0 ? (.2 + .62 * Math.abs(Math.sin(t * 12.5) * Math.sin(t * 7.1 + 1.3))) * kk : 0;
    D2.yon = yon; D2.sevinc = sev; D2.mutlu = mut; D2.el = o.el; D2.alkis = o.alkis; D2.kik = kik; D2.dans = o.dans; D2.faz = o.faz;
    let yy = y - z;
    if (kim === 'iskeletNine') { D2.nine = true; D2.kafa = Math.min(1, Math.abs(o.kafa || 0) * 1.4 + kk * .25); D2.sasir = o.sasir; D2.sevinc = mut; D2.tokmak = false; }
    else if (kim === 'cadiKiz') { D2.tip = 'kiz'; D2.asa = o.kaldir; D2.asaVar = true; D2.sasir = o.sasir; D2.konus = kk; D2.sevinc = Math.max(mut, kik, sev * .35); }
    else if (kim === 'karaKedi') { D2.ayakta = true; D2.poz = 'ayakta'; D2.sapka = true; D2.kuyruk = 1; D2.zipla = clamp((o.hop || 0) * 2, 0, 1) * Math.sin((o.hop || 0) * Math.PI); D2.sevinc = mut; }
    else if (kim === 'hayaletTeyze') { D2.teyze = true; D2.yon = yon * .6; D2.el = o.alkis; D2.salla = o.el; D2.agiz = Math.max(ka, kik * .7, sev * .3); yy -= (5 + Math.sin(t * 1.8) * 2.5) * s; }
    try {
      globalThis[dis.ad](c, x, yy, s * dis.olc, t, D2);
      KOMSU.elX = x + yon * dis.el[0] * s; KOMSU.elY = yy + dis.el[1] * s; KOMSU.basX = x; KOMSU.basY = yy + dis.basY * s;
      KOMSU.cubukX = KOMSU.elX + yon * 10 * s; KOMSU.cubukY = KOMSU.elY - 16 * s; KOMSU.dis = true;
      return;
    } catch (e) { dis.ac = false; }   // hata verirse bir daha deneme, yedeğe geç
  }
  KOMSU.dis = false;
  switch (kim) {
    case 'iskeletNine': sk8Nine(c, x, y, s, t, o); break;
    case 'cadiKiz': sk8Kiz(c, x, y, s, t, o); break;
    case 'karaKedi': sk8Kedi(c, x, y, s, t, o); break;
    case 'hayaletTeyze': sk8Teyze(c, x, y, s, t, o); break;
    case 'kabakDede2': case 'kabakIkiz': sk8Ikiz(c, x, y, s, t, o); break;
    default: sk8Dede(c, x, y, s, t, o);
  }
}
SK8.oc = { yon: 1, alkis: 0, uzat: 0, el: 0, dans: 0, faz: 0, kaldir: 0 };

// ═══════════════════════════════ KAPI ÇİZİMİ ═══════════════════════════════
// Zemin parçası (eğilmez): basamak, paspas, kapı yanındaki kabaklar
function sk8ZeminSpr(kim) {
  const k = SK8_KAPI[kim];
  return sk8Tuval('zem' + kim, -56, -26, 140, 34, q => {
    sk8Elips(q, 4, 2.5, 60, 5, 0, 'rgba(20,10,40,.35)');
    q.beginPath(); q.roundRect(-52, -SK8_BAS, 104, SK8_BAS + 2, 3); q.fillStyle = '#8f7fae'; q.fill(); q.strokeStyle = '#4c3d6c'; q.lineWidth = 1.6; q.stroke();
    q.fillStyle = '#c2b4dc'; q.beginPath(); q.roundRect(-50, -SK8_BAS + 1, 100, 2.4, 1.2); q.fill();
    q.strokeStyle = 'rgba(76,61,108,.45)'; q.lineWidth = 1; for (const sx of [-26, 4, 30]) { q.beginPath(); q.moveTo(sx, -5); q.lineTo(sx + 1, 1); q.stroke(); }
    if (k.sus === 'kulak') for (const [px, py] of [[-36, -4], [-20, -4.5], [24, -4], [40, -4.6]]) { q.fillStyle = 'rgba(60,40,90,.55)'; sk8Elips(q, px, py, 2.2, 1.2, 0, 'rgba(60,40,90,.55)'); for (let i = -1; i <= 1; i++) sk8Elips(q, px + i * 1.8, py - 1.8, .7, .6, 0, 'rgba(60,40,90,.55)'); }   // pati izleri
    // paspas
    q.beginPath(); q.ellipse(0, 3, 31, 4.4, 0, 0, SK8_PI2); q.fillStyle = k.kapiK; q.fill(); q.strokeStyle = mixc(k.kapiK, '#000000', .35); q.lineWidth = 1; q.stroke();
    q.strokeStyle = k.kapiA; q.lineWidth = 1.2; q.beginPath(); q.ellipse(0, 3, 24, 2.8, 0, 0, SK8_PI2); q.stroke();
    q.strokeStyle = mixc(k.kapiA, '#ffffff', .3, .8); q.lineWidth = .8; for (let i = -1; i <= 1; i += 2) for (let j = 0; j < 4; j++) { q.beginPath(); q.moveTo(i * (31 + j * .3), 1.5 + j); q.lineTo(i * (34 + j * .3), 1.5 + j); q.stroke(); }
    // kapı yanında kabaklar
    sk8KabakSekil(q, 60, -9, 11.5, 9.5); sk8KabakSekil(q, 74, -5.5, 7, 5.8);
  }, 3);
}
// Çerçeve + duvar gölgesi + süsler (eğik grup; taban basamağın üstü y = 0 → burada yerel y, basamak dahil)
function sk8CerSpr(kim) {
  const k = SK8_KAPI[kim];
  return sk8Tuval('cer' + kim, -58, -188, 116, 190, q => {
    q.fillStyle = 'rgba(18,8,36,.32)'; sk8Kemer(q, 48, -SK8_BAS + 2, SK8_UST - 14); q.fill();
    sk8Kemer(q, 42, -SK8_BAS, SK8_UST - 8); q.fillStyle = k.cer; q.fill(); q.strokeStyle = k.cerK; q.lineWidth = 2.2; q.stroke();
    // taş/tahta dilimleri
    q.strokeStyle = mixc(k.cerK, k.cer, .35, .7); q.lineWidth = 1.2;
    const my = SK8_UST + SK8_AG;
    for (let i = 1; i < 8; i++) { const a = Math.PI + i / 8 * Math.PI; q.beginPath(); q.moveTo(Math.cos(a) * 33.5, my + Math.sin(a) * 33.5); q.lineTo(Math.cos(a) * 41.5, my + Math.sin(a) * 41.5); q.stroke(); }
    for (const d of [-1, 1]) for (let i = 1; i < 4; i++) { const yy = -SK8_BAS - i * 21; q.beginPath(); q.moveTo(d * 33.5, yy); q.lineTo(d * 41.5, yy); q.stroke(); }
    q.strokeStyle = k.cerA; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-39.5, -SK8_BAS - 3); q.lineTo(-39.5, my); q.arc(0, my, 39.5, Math.PI, Math.PI * 1.45); q.stroke();
    q.fillStyle = '#2a1640'; sk8Kemer(q, SK8_AG, -SK8_BAS, SK8_UST); q.fill();
    // süsler
    const tp = SK8_UST - 8;
    if (k.sus === 'kabak') {
      q.strokeStyle = '#4a7a2e'; q.lineWidth = 2; q.beginPath(); q.moveTo(-44, -20); q.bezierCurveTo(-50, -60, -36, -90, -42, -120); q.quadraticCurveTo(-30, -146, -6, tp - 4); q.stroke();
      for (const [lx, ly, a] of [[-46, -46, -.6], [-40, -86, .5], [-38, -122, -.8], [-22, -140, .3]]) sk8Elips(q, lx, ly, 6, 3.2, a, '#7fb04a', '#3c6a24', 1);
      sk8KabakSekil(q, 0, tp - 2, 10, 8);
      sk8Elips(q, -3.4, tp - 3, 1.3, 1.7, 0, '#4a1c0c'); sk8Elips(q, 3.4, tp - 3, 1.3, 1.7, 0, '#4a1c0c'); q.strokeStyle = '#4a1c0c'; q.lineWidth = 1; q.beginPath(); q.moveTo(-3, tp + .6); q.quadraticCurveTo(0, tp + 2.6, 3, tp + .6); q.stroke();
    } else if (k.sus === 'dantel' || k.sus === 'dantel2') {
      q.fillStyle = '#ffffff'; q.strokeStyle = '#d8c8d8'; q.lineWidth = .8;
      for (let i = 0; i <= 14; i++) { const a = Math.PI + i / 14 * Math.PI; q.beginPath(); q.arc(Math.cos(a) * 45, my + Math.sin(a) * 45, 3.2, 0, SK8_PI2); q.fill(); q.stroke(); }
      for (const d of [-1, 1]) for (let i = 0; i < 5; i++) { q.beginPath(); q.arc(d * 45, -SK8_BAS - 12 - i * 16, 3.2, 0, SK8_PI2); q.fill(); q.stroke(); }
      if (k.sus === 'dantel') for (const [rx, ry] of [[-10, tp - 1], [10, tp - 1], [0, tp - 5]]) { for (let i = 0; i < 5; i++) { const a = i / 5 * SK8_PI2; sk8Elips(q, rx + Math.cos(a) * 2.8, ry + Math.sin(a) * 2.8, 2.4, 2.4, 0, '#ff9fc8', '#c8608e', .7); } sk8Elips(q, rx, ry, 1.6, 1.6, 0, '#ffe066'); }
      else { sk8Kalp(q, 0, tp - 3, 7); q.fillStyle = '#ff8fc8'; q.fill(); q.strokeStyle = '#c04a86'; q.lineWidth = 1.2; q.stroke(); sk8Elips(q, -2.6, tp - 5.6, 1.6, 1, -.6, '#ffffff'); }
    } else if (k.sus === 'yildiz') {
      q.beginPath(); q.arc(0, tp - 3, 8.5, 0, SK8_PI2); q.arc(3.6, tp - 5.4, 7.6, 0, SK8_PI2, true); q.fillStyle = '#ffe7a8'; q.fill('evenodd');
      for (const [sx, sy, r] of [[-40, -40, 3.4], [41, -70, 3], [-38, -102, 2.6], [30, -138, 3.2], [-24, -146, 2.4], [40, -30, 2.4]]) { sk8Yildiz(q, sx, sy, r, .45); q.fillStyle = '#fff3b0'; q.fill(); q.strokeStyle = '#b8862a'; q.lineWidth = .6; q.stroke(); }
    } else if (k.sus === 'kulak') {
      for (const d of [-1, 1]) { q.beginPath(); q.moveTo(d * 10, tp + 2); q.quadraticCurveTo(d * 22, tp - 28, d * 28, tp - 24); q.quadraticCurveTo(d * 34, tp - 8, d * 32, tp + 8); q.closePath(); q.fillStyle = k.cer; q.fill(); q.strokeStyle = k.cerK; q.lineWidth = 2; q.stroke();
        q.beginPath(); q.moveTo(d * 16, tp); q.quadraticCurveTo(d * 23, tp - 18, d * 27, tp - 16); q.quadraticCurveTo(d * 30, tp - 6, d * 29, tp + 3); q.closePath(); q.fillStyle = '#ff9fc0'; q.fill(); }
      sk8Elips(q, 0, tp - 1, 6, 4.4, 0, '#ffe7a8', '#b8862a', 1); q.fillStyle = '#7dffc4'; q.beginPath(); q.moveTo(-3, tp - 1); q.quadraticCurveTo(0, tp - 4, 3, tp - 1); q.quadraticCurveTo(0, tp + 2, -3, tp - 1); q.fill();
    } else if (k.sus === 'ikiz') {
      sk8KabakSekil(q, -30, tp + 10, 9, 7.5); sk8KabakSekil(q, 30, tp + 10, 9, 7.5);
      q.strokeStyle = '#ffe7a8'; q.lineWidth = 1; q.beginPath(); q.moveTo(-30, tp + 4); q.quadraticCurveTo(0, tp + 22, 30, tp + 4); q.stroke();
      const br = SK8_KONF_RENK;
      for (let i = 0; i < 7; i++) { const u = (i + .5) / 7, bx = lerp(-30, 30, u), by = tp + 4 + Math.sin(u * Math.PI) * 9; q.beginPath(); q.moveTo(bx - 3.6, by); q.lineTo(bx + 3.6, by); q.lineTo(bx, by + 7); q.closePath(); q.fillStyle = br[i % br.length]; q.fill(); }
    }
  }, 3);
}
// Sıcak iç (açık kapının ardı)
function sk8IcSpr() {
  return sk8Tuval('ic', -34, -128, 68, 122, q => {
    q.save(); sk8Kemer(q, SK8_AG, -SK8_BAS, SK8_UST); q.clip();
    const gr = q.createRadialGradient(0, -78, 6, 0, -70, 92); gr.addColorStop(0, '#fff6d6'); gr.addColorStop(.45, '#ffd486'); gr.addColorStop(1, '#e9954a');
    q.fillStyle = gr; q.fillRect(-34, -128, 68, 122);
    q.strokeStyle = 'rgba(255,255,255,.14)'; q.lineWidth = 2; for (let x = -30; x <= 30; x += 8) { q.beginPath(); q.moveTo(x, -128); q.lineTo(x, -22); q.stroke(); }
    q.fillStyle = 'rgba(200,120,60,.55)'; q.fillRect(-34, -22, 68, 16); q.fillStyle = 'rgba(255,230,180,.5)'; q.fillRect(-34, -22.5, 68, 1.6);
    q.fillStyle = 'rgba(160,80,40,.25)'; q.fillRect(-34, -128, 6, 122); q.fillRect(28, -128, 6, 122);
    sk8Elips(q, 0, -116, 16, 6, 0, 'rgba(255,255,240,.5)');
    q.restore();
  }, 3);
}
// Kanat (kapalı kapı): tahtalar, menteşeler, kulp, pencere camı. Pencerenin çerçevesi/kayıtları ayrı (komşu arkasında görünsün).
function sk8PanSpr(kim) {
  const k = SK8_KAPI[kim];
  return sk8Tuval('pan' + kim, -34, -128, 68, 122, q => {
    const hw = SK8_AG - .5;
    q.save(); sk8Kemer(q, hw, -SK8_BAS, SK8_UST + .5); q.clip();
    q.fillStyle = k.kapi; q.fillRect(-34, -128, 68, 122);
    q.strokeStyle = mixc(k.kapiK, k.kapi, .3, .6); q.lineWidth = 1.4; for (const x of [-16.5, 0, 16.5]) { q.beginPath(); q.moveTo(x, -128); q.lineTo(x, -6); q.stroke(); }
    q.strokeStyle = mixc(k.kapiA, k.kapi, .3, .7); q.lineWidth = 1.3; for (const x of [-30, -13.5, 3, 19.5]) { q.beginPath(); q.moveTo(x, -124); q.lineTo(x, -10); q.stroke(); }
    q.fillStyle = mixc(k.kapiK, k.kapi, .2, .5); q.fillRect(-34, -38, 68, 5); q.fillRect(-34, -76, 68, 4.5);
    q.fillStyle = mixc(k.kapiA, k.kapi, .3, .45); q.fillRect(-34, -38, 68, 1.2); q.fillRect(-34, -76, 68, 1.2);
    q.restore();
    sk8Kemer(q, hw, -SK8_BAS, SK8_UST + .5); q.strokeStyle = k.kapiK; q.lineWidth = 1.8; q.stroke();
    // menteşeler (sağ)
    for (const hy of [-36, -100]) { q.beginPath(); q.roundRect(18, hy - 2.5, 14, 5, 2.4); q.fillStyle = '#4a3a5a'; q.fill(); for (const nx2 of [22, 28]) sk8Elips(q, nx2, hy, .9, .9, 0, '#a898c0'); }
    // kulp (sol)
    sk8Elips(q, -24, -54, 3.2, 3.2, 0, '#ffd27a', '#a07a2a', 1.1); sk8Elips(q, -25, -55, 1, 1, 0, '#fff4c8');
    if (k.sus === 'kulak') {   // kedi kapısı
      q.beginPath(); q.moveTo(-9, -SK8_BAS); q.lineTo(-9, -20); q.arc(0, -20, 9, Math.PI, SK8_PI2); q.lineTo(9, -SK8_BAS); q.closePath(); q.fillStyle = mixc(k.kapiK, k.kapi, .3); q.fill(); q.strokeStyle = k.kapiK; q.lineWidth = 1.3; q.stroke();
      q.strokeStyle = '#ffd27a'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(-7, -27); q.lineTo(7, -27); q.stroke();
    }
    // pencere camı
    const gr = q.createRadialGradient(-3, SK8_PEN.y - 3, 1, 0, SK8_PEN.y, SK8_PEN.r); gr.addColorStop(0, '#fff6d6'); gr.addColorStop(1, '#ffbe62');
    q.fillStyle = gr; q.beginPath(); q.arc(0, SK8_PEN.y, SK8_PEN.r, 0, SK8_PI2); q.fill();
  }, 3);
}
function sk8PenCerSpr(kim, bos) {
  const k = SK8_KAPI[kim];
  return sk8Tuval('pen' + kim + (bos ? 'b' : ''), -19, SK8_PEN.y - 19, 38, 38, q => {
    const y = SK8_PEN.y, r = SK8_PEN.r;
    q.strokeStyle = 'rgba(255,255,255,.4)'; q.lineWidth = 1.6; q.beginPath(); q.arc(0, y, r - 3, Math.PI * 1.1, Math.PI * 1.45); q.stroke();
    q.strokeStyle = k.cerK; q.lineWidth = 5.4; q.beginPath(); q.arc(0, y, r + 1.6, 0, SK8_PI2); q.stroke();
    q.strokeStyle = k.cer; q.lineWidth = 3.6; q.stroke();
    q.strokeStyle = k.cerA; q.lineWidth = 1; q.beginPath(); q.arc(0, y, r + 1.6, Math.PI * 1.05, Math.PI * 1.5); q.stroke();
    if (bos) return;
    q.strokeStyle = k.cerK; q.lineWidth = 2.2; q.beginPath(); q.moveTo(-r, y); q.lineTo(r, y); q.moveTo(0, y - r); q.lineTo(0, y + r); q.stroke();
    q.strokeStyle = k.cer; q.lineWidth = 1.2; q.stroke();
    // perdeler (iki yanda toplanmış dantel)
    q.save(); q.beginPath(); q.arc(0, y, r, 0, SK8_PI2); q.clip(); q.fillStyle = 'rgba(255,214,232,.5)';
    for (const d of [-1, 1]) { q.beginPath(); q.moveTo(d * r, y - r); q.quadraticCurveTo(d * r * .55, y - r * .1, d * r * .78, y + r); q.lineTo(d * r * 1.1, y + r); q.closePath(); q.fill(); }
    q.restore();
  }, 4);
}
function sk8PanGolSpr() { return sk8Tuval('pangol', -34, -128, 68, 122, q => { sk8Kemer(q, SK8_AG - .5, -SK8_BAS, SK8_UST + .5); q.fillStyle = '#2a1640'; q.fill(); }, 2); }
// Tokmaklar (kanatta; merkez (0,0))
function sk8TokmakSpr(tip) {
  return sk8Tuval('tok' + tip, -11, -12, 22, 26, q => {
    const al = '#ffd27a', alK = '#a07a2a';
    if (tip === 'halka') { sk8KabakSekil(q, 0, -5, 6, 5, '#ffb347', '#e8862a', '#a0561c', true); q.strokeStyle = alK; q.lineWidth = 3.4; q.beginPath(); q.arc(0, 4, 5.4, 0, SK8_PI2); q.stroke(); q.strokeStyle = al; q.lineWidth = 2; q.stroke(); }
    else if (tip === 'zil') { q.strokeStyle = alK; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-6, -9); q.quadraticCurveTo(0, -12, 6, -9); q.stroke(); q.beginPath(); q.moveTo(-6.5, 6); q.quadraticCurveTo(-6, -7, 0, -7.5); q.quadraticCurveTo(6, -7, 6.5, 6); q.closePath(); q.fillStyle = al; q.fill(); q.strokeStyle = alK; q.lineWidth = 1.2; q.stroke(); sk8Elips(q, 0, 7.4, 2, 2, 0, '#e8a83a', alK, .8); sk8Elips(q, -2.6, -2, 1.2, 3, 0, 'rgba(255,255,255,.7)'); }
    else if (tip === 'yildiz') { sk8Yildiz(q, 0, 0, 8.5, .48); q.fillStyle = al; q.fill(); q.strokeStyle = alK; q.lineWidth = 1.3; q.stroke(); sk8Elips(q, -2, -2, 1.8, 1.8, 0, '#fff4c8'); }
    else if (tip === 'balik') { q.beginPath(); q.moveTo(-8, 0); q.quadraticCurveTo(-1, -7, 5, 0); q.quadraticCurveTo(-1, 7, -8, 0); q.closePath(); q.moveTo(4, 0); q.lineTo(9.5, -4.5); q.lineTo(9.5, 4.5); q.closePath(); q.fillStyle = al; q.fill(); q.strokeStyle = alK; q.lineWidth = 1.2; q.stroke(); sk8Elips(q, -4, -1, 1.2, 1.2, 0, '#5a3a1a'); }
    else if (tip === 'kalp') { q.strokeStyle = alK; q.lineWidth = 3.2; sk8Kalp(q, 0, 1, 7); q.stroke(); q.strokeStyle = al; q.lineWidth = 1.8; q.stroke(); sk8Elips(q, 0, -8, 2, 2, 0, al, alK, .9); }
    else { sk8Elips(q, 0, 0, 5, 6.4, 0, '#7fb04a', '#3c6a24', 1.2); q.fillStyle = '#ff8fc8'; q.beginPath(); q.moveTo(-3, -4); q.quadraticCurveTo(0, -9, 3, -4); q.quadraticCurveTo(0, -1, -3, -4); q.fill(); }   // çiçek tomurcuğu
  }, 5);
}
// Fener: sönük ya da yanık (askıya asılı; askı ucu (0,0), fener aşağıda)
function sk8FenerSpr(kim, yanik) {
  const k = SK8_KAPI[kim];
  return sk8Tuval('fen' + kim + (yanik ? 1 : 0), -12, -2, 24, 34, q => {
    q.strokeStyle = '#3a2c4a'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(0, 0); q.lineTo(0, 5); q.stroke();
    q.beginPath(); q.moveTo(-6, 8); q.quadraticCurveTo(0, 3, 6, 8); q.closePath(); q.fillStyle = '#4a3a5a'; q.fill(); q.strokeStyle = '#241a34'; q.lineWidth = 1; q.stroke();
    const cam = yanik ? k.fener : '#6e6488', gr = q.createRadialGradient(-1.5, 15, 1, 0, 16, 9);
    gr.addColorStop(0, yanik ? '#fffbe8' : '#9a90b4'); gr.addColorStop(1, cam);
    q.beginPath(); q.ellipse(0, 16, 7.6, 9, 0, 0, SK8_PI2); q.fillStyle = gr; q.fill(); q.strokeStyle = '#3a2c4a'; q.lineWidth = 1.3; q.stroke();
    q.strokeStyle = 'rgba(58,44,74,.6)'; q.lineWidth = .9; q.beginPath(); q.moveTo(0, 7.2); q.lineTo(0, 24.8); q.moveTo(-4.6, 9); q.quadraticCurveTo(-7, 16, -4.6, 23); q.moveTo(4.6, 9); q.quadraticCurveTo(7, 16, 4.6, 23); q.stroke();
    q.beginPath(); q.roundRect(-4, 24, 8, 3, 1.2); q.fillStyle = '#4a3a5a'; q.fill(); sk8Elips(q, 0, 28.6, 1.6, 1.6, 0, '#4a3a5a');
    sk8Elips(q, -3, 12, 1.4, 2.6, -.2, 'rgba(255,255,255,.6)');
  }, 5);
}
function sk8AskiSpr() {   // duvardan çıkan kıvrık demir kol (kapı çerçevesinin sağında)
  return sk8Tuval('aski', 40, -142, 28, 24, q => {
    sk8Elips(q, 46.5, -124, 2.6, 7, 0, '#3a2c4a', '#1e1428', 1);
    q.strokeStyle = '#2a1e3a'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(46.5, -121); q.quadraticCurveTo(54, -134, SK8_FEN.x, SK8_FEN.y); q.stroke();
    q.lineWidth = 1.5; q.beginPath(); q.arc(51.5, -125.5, 3.4, Math.PI * .6, Math.PI * 2.1); q.stroke();
    q.beginPath(); q.arc(SK8_FEN.x + 1.6, SK8_FEN.y - 1.4, 1.8, Math.PI, Math.PI * 2.4); q.stroke();
  }, 4);
}

// ═══════════════════════════════ SAHNE ═══════════════════════════════
const SK8_SEPET = { x: 0, y: 0 };
function sk8Sepet() {   // Feza'nın sepetinin ağzı (dünya)
  if (typeof fezaSepetYer === 'function') { try { const r = fezaSepetYer(); if (r && Number.isFinite(r.x) && Number.isFinite(r.y)) { SK8_SEPET.x = r.x; SK8_SEPET.y = r.y; return SK8_SEPET; } } catch (e) { } }
  else if (Number.isFinite(P.a_sepetX) && Number.isFinite(P.a_sepetY)) { SK8_SEPET.x = P.a_sepetX; SK8_SEPET.y = P.a_sepetY; return SK8_SEPET; }
  SK8_SEPET.x = (P.rx ?? P.x) + (P.f || 1) * 14; SK8_SEPET.y = (P.ry ?? P.y) - 34; return SK8_SEPET;
}
// Efekt havuzları (bir sahne aynı anda): konfeti, baloncuk, yıldız yağmuru, kalpler
const SK8_KONF = [], SK8_BAL = [], SK8_YIL = [], SK8_KLP = [];
for (let i = 0; i < 40; i++) SK8_KONF.push({ x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, t: -99, omur: 0, r: 0, ph: 0, yil: false });
for (let i = 0; i < 12; i++) SK8_BAL.push({ x: 0, y: 0, x0: 0, y0: 0, hx: 0, hy: 0, t: -99, omur: 0, r: 0, ph: 0, pt: false });
for (let i = 0; i < 16; i++) SK8_YIL.push({ x: 0, y: 0, vy: 0, t: -99, omur: 0, r: 0, ph: 0, renk: '' });
for (let i = 0; i < 8; i++) SK8_KLP.push({ x: 0, y: 0, t: -99, omur: 0, r: 0, ph: 0, vx: 0 });
function sk8Efektler(dt) {   // t: -99 boş, < 0 sırasını bekliyor, ≥ 0 canlı
  for (const p of SK8_KONF) if (p.t > -50) { p.t += dt; if (p.t < 0) continue; if (p.t > p.omur) { p.t = -99; continue; } const dr = Math.exp(-dt * 2.6); p.vx *= dr; p.vy = p.vy * dr + 260 * dt; if (p.vy > 70) p.vy = 70; p.x += (p.vx + Math.sin(p.t * 7 + p.ph) * 22) * dt; p.y += p.vy * dt; p.a += p.va * dt; }
  for (const b of SK8_BAL) if (b.t > -50) { b.t += dt; if (b.t < 0) continue; if (b.t > b.omur) { if (!b.pt) { b.pt = true; burst(b.x, b.y, 4, ['#ffffff', '#ffd6ec', '#d6fff0'], 50, .45, 4); } b.t = -99; continue; } const u = b.t / b.omur, e = 1 - Math.pow(1 - Math.min(1, u * 1.3), 2); b.x = lerp(b.x0, b.hx, e) + Math.sin(b.t * 3 + b.ph) * 7; b.y = lerp(b.y0, b.hy, e) - b.t * 10 + Math.cos(b.t * 2.4 + b.ph) * 4; }
  for (const s of SK8_YIL) if (s.t > -50) { s.t += dt; if (s.t < 0) continue; if (s.t > s.omur) { s.t = -99; continue; } s.y += s.vy * dt; s.x += Math.sin(s.t * 3 + s.ph) * 14 * dt; }
  for (const h of SK8_KLP) if (h.t > -50) { h.t += dt; if (h.t < 0) continue; if (h.t > h.omur) { h.t = -99; continue; } h.y -= 38 * dt; h.x += h.vx * dt + Math.sin(h.t * 4 + h.ph) * 10 * dt; }
}
function sk8EfektVar() { for (const a of [SK8_KONF, SK8_BAL, SK8_YIL, SK8_KLP]) for (const p of a) if (p.t > -50) return true; return false; }
function sk8Konfeti(x, y, yon, n) {
  let k = 0;
  for (const p of SK8_KONF) { if (k >= n) break; if (p.t > -50) continue; const a = -Math.PI / 2 + yon * (.12 + Math.random() * .5), sp = 200 + Math.random() * 170;
    p.x = x; p.y = y; p.vx = Math.cos(a) * sp; p.vy = Math.sin(a) * sp; p.a = Math.random() * 6; p.va = (Math.random() - .5) * 16; p.t = 0; p.omur = 2.2 + Math.random() * .9; p.r = 2.2 + Math.random() * 1.6; p.ph = Math.random() * 6; p.yil = k % 5 === 0; p.renk = SK8_KONF_RENK[k % SK8_KONF_RENK.length]; k++; }
}
function sk8Kalpler(x, y, n) {
  let k = 0;
  for (const h of SK8_KLP) { if (k >= n) break; if (h.t > -50) continue; h.x = x + (k - (n - 1) / 2) * 11; h.y = y - Math.random() * 6; h.t = -k * .08; h.omur = 1.3 + Math.random() * .4; h.r = 5 + Math.random() * 2.4; h.ph = Math.random() * 6; h.vx = (k - (n - 1) / 2) * 6; k++; }
}
function sk8Baloncuklar(x, y, hx, hy) {
  let k = 0;
  for (const b of SK8_BAL) { if (k >= 10) break; b.x0 = b.x = x; b.y0 = b.y = y; b.hx = hx + (Math.random() - .5) * 90; b.hy = hy - 10 - Math.random() * 70; b.t = -k * .1; b.omur = 1.4 + Math.random() * .8; b.r = 7 + Math.random() * 7; b.ph = Math.random() * 6; b.pt = false; k++; }
}
function sk8YildizYagmuru(x, y) {
  let k = 0;
  for (const s of SK8_YIL) { if (k >= 14) break; s.x = x + (Math.random() - .5) * 150; s.y = y - 60 - Math.random() * 60; s.vy = 45 + Math.random() * 35; s.t = -k * .07; s.omur = 1.6 + Math.random() * .6; s.r = 3 + Math.random() * 2.6; s.ph = Math.random() * 6; s.renk = k % 3 === 0 ? '#ffe7a8' : k % 3 === 1 ? '#ffd27a' : '#fff3b0'; k++; }
}

// Komşunun sahne pozu (o anki st'den): SK8.poz'a yazılır
const SK8_POZ = { yon: 1, sevinc: 0, sasir: 0, kik: 0, el: 0, alkis: 0, uzat: 0, hop: 0, kafa: 0, kaldir: 0, sapka: 0, cubuk: 0, patlat: 0, dans: 0, faz: null, konus: 0 };
const sk8Ar = (st, a, b, g2) => { g2 = g2 || .18; return smooth(clamp((st - a) / g2, 0, 1)) * (1 - smooth(clamp((st - b) / g2, 0, 1))); };
function sk8Poz(o, st) {
  const p = SK8_POZ, T = SK8_T, Z = o.Z, kim = o.kim;
  p.yon = o.taraf; p.dans = 0; p.faz = null; p.kaldir = 0; p.sapka = 0; p.cubuk = 0; p.patlat = 0;
  p.konus = (o.sozBas >= 0 ? sk8Ar(st, o.sozBas + .05, o.sozBas + o.sozSure - .05, .08) : 0) || (now - o.vedaT < o.vedaSure ? 1 : 0);
  p.sasir = sk8Ar(st, T.sasir, T.sasir + .42, .12);
  p.sevinc = smooth(clamp((st - T.sasir - .3) / .3, 0, 1));
  p.alkis = sk8Ar(st, T.alkis, T.alkisSon, .15);
  const hop1 = clamp((st - T.sasir) / .36, 0, 1), hop2 = o.es ? clamp((st - T.alkis - .45) / .36, 0, 1) : 0;
  p.hop = hop1 > 0 && hop1 < 1 ? hop1 : hop2 > 0 && hop2 < 1 ? hop2 : 0;
  p.kik = kim === 'hayaletTeyze' ? sk8Ar(st, T.alkis - .1, T.alkis + 1.2, .15) : o.tur === 'saka' ? sk8Ar(st, Z.saka + .3, Z.saka + 1.1, .15) * .9 : 0;
  p.kafa = kim === 'iskeletNine' ? Math.sin(st * 22) * sk8Ar(st, T.sasir + .2, T.sasir + 1.1, .12) : 0;
  p.uzat = sk8Ar(st, Z.uzat, Z.uzatSon, .22);
  p.el = sk8Ar(st, Z.veda, Z.kapa + .1, .2);
  if (o.tur === 'saka') {
    if (o.saka === 'tavsan') p.kaldir = sk8Ar(st, Z.saka - .25, Z.saka + .9, .2);
    else if (o.saka === 'baloncuk') { p.cubuk = sk8Ar(st, Z.saka - .4, Z.saka + 1.2, .2); p.uzat = Math.max(p.uzat, p.cubuk * .7); }
    else if (o.saka === 'cicek') { p.patlat = sk8Ar(st, Z.saka - .5, Z.saka + .9, .2); if (st > Z.saka) p.patlat = Math.min(p.patlat, .99) * (st < Z.saka + .9 ? 1 : 0) + (st >= Z.saka && st < Z.saka + .9 ? .01 : 0); }
  }
  if (o.saka === 'kutu' || o.saka === 'tavsan') { p.uzat = 0; p.alkis = Math.max(p.alkis, .7 * sk8Ar(st, Z.saka + .35, Z.sonIn, .2)); }
  if (kim === 'karaKedi' && !sk8DisAcik(kim)) { p.sapka = sk8Ar(st, Z.uzat - .1, Z.uzatSon, .35); p.uzat *= .5; }
  return p;
}
// Takvim. Komşunun cümlesi (CORE kaydı, 2,9–4,5 sn) 'konusma' olayıyla gelince şaka cümlenin "şaka!" anına, şekerler "buyur"
// anına, veda ve kapı kapanışı cümlenin sonuna kayar (geçmiş anlar oynatıldıysa yerinde kalır). Olay gelmezse sabit takvim.
const SK8_ONEK = { kabakDede: 'kd_', iskeletNine: 'in_', cadiKiz: 'ck_', karaKedi: 'kk_', hayaletTeyze: 'ht_', kabakDede2: 'k2_' };
const SK8_SOZF = { iskeletNine: .5, cadiKiz: .48, hayaletTeyze: .6, kabakDede2: .55 };   // şakanın cümledeki yeri (oran)
function sk8Aralik(o) { return o.n >= 7 ? .09 : SK8_T.aralik; }   // çok şekerli kapıda şekerler daha sık
function sk8Takvim(o) {
  const T = SK8_T, Z = o.Z, st = o.durum === 'sahne' ? o.st : 0, bil = o.sozBas >= 0, sb = o.sozBas, ss = o.sozSure;
  const koy = (ad, v) => { if (!(Z[ad] <= st) || o.durum !== 'sahne') Z[ad] = v; };   // oynatılmış anı kaydırma
  if (o.tur === 'saka') { koy('saka', bil ? clamp(sb + ss * (SK8_SOZF[o.kim] || .5), 2.9, 5.2) : T.saka); koy('sekerBas', Z.saka + (o.n >= 7 ? .5 : T.sakaSeker)); }
  else { Z.saka = -9; koy('sekerBas', bil ? clamp(sb + ss * .3, 3.0, 4.8) : T.seker); }
  Z.uzat = Z.sekerBas - .25;
  Z.sonIn = Z.sekerBas + (o.n - 1) * sk8Aralik(o) + T.ucus;
  Z.uzatSon = Z.sonIn - .05;
  const son = bil ? sb + ss : 0;
  koy('birak', Math.max(Z.sonIn + .15, Math.min(son - .8, 5.6)));   // Feza serbest (komşu sözünü bitirirken o yürüyebilir)
  koy('veda', Math.min(8.6, Math.max(Z.sonIn + .1, son - .3)));
  koy('kapa', Math.min(9.6, Math.max(Z.veda + .85, son + .2)));
  Z.fener = Z.kapa + .75;
}
OLAY.on('konusma', e => {
  if (!e || typeof e.anahtar !== 'string' || e.kim === 'p' || e.kim === 'a') return;
  let o = null;
  for (const k in SK8_ONEK) if (e.anahtar.indexOf(SK8_ONEK[k]) === 0) { o = sk8KapiBul(k); break; }
  if (!o) return;
  const sure = clamp(+e.sure || 2.5, .5, 7);
  if (/_veda$/.test(e.anahtar)) { o.vedaT = now; o.vedaSure = sure; return; }
  if (o.durum === 'sahne' && !(o.sozBas >= 0)) { o.sozBas = o.st; o.sozSure = sure; sk8Takvim(o); }
});
function sk8KapiBul(kim) { for (let i = 0; i < NESNELER.length; i++) { const n = NESNELER[i]; if (n.tip === 'sekerKapi' && n.kim === kim) return n; } return null; }
function sk8Basla(o) {
  const v = sk8V();
  o.durum = 'sahne'; o.st = 0; o.ev = 0; o.yaklas = true; o.yt = 0; o.serbest = false; o.inen = 0; o.sozBas = -1; o.sozSure = 0; o.yag = false;
  o.Z = {}; sk8Takvim(o);
  o.taraf = P.x < o.x ? -1 : 1; o.hedefX = o.x + o.taraf * SK8_DUR;
  o.kostum = v && v.kostum ? v.kostum : null; o.es = !!(o.kostum && SK8_ES[o.kim] === o.kostum);
  for (let i = 0; i < o.sk.length; i++) { const k = o.sk[i]; k.u = -1; k.in = false; k.t0 = 0; k.tip = SK8_SEKER_TIP[(i + o.sira) % 4]; k.renk = SK8_SEKER_RENK[(i * 2 + o.sira) % SK8_SEKER_RENK.length]; k.don = (Math.random() - .5) * 14; k.h = 88 + Math.random() * 30; }   // yay tepesi iki başın da üstünde (komşunun yüzünü örtmesin)
  SEKER8.aktif = o; SEKER8.son = o; SK8.efO = o;
  OLAY.emit('sekerKapiBasla', { o, x: P.x, kapiX: o.x });
}
function sk8Bitir(o) {   // kapı kapandı: fener yanar, sayaçlar (zaman aşımında da güvenle)
  if (o.bitti) return;
  const v = sk8V();
  for (let i = 0; i < o.n && i < o.sk.length; i++) { const k = o.sk[i]; if (!k.in) { k.in = true; k.u = 2; if (v) v.seker = (v.seker || 0) + 1; o.inen++; } }
  if (!(o.ev & SK8_E.seker)) { o.ev |= SK8_E.seker; OLAY.emit('seker', { n: o.inen, top: v ? v.seker : o.inen }); }
  o.bitti = true; o.done = true; o.durum = 'bitti'; o.bitT = 0; o.fenerT = 0;
  if (v) v.kapi = (v.kapi || 0) + 1;
  if (SEKER8.aktif === o) SEKER8.aktif = null;
  ripples.push({ x: o.x + SK8_FEN.x, y: o.y + SK8_FEN.y + 16, r: 0, life: 1.1, small: true });
  burst(o.x + SK8_FEN.x, o.y + SK8_FEN.y + 16, 12, [o.k.fener, '#fff6d6', '#ffd27a'], 90, .9, 5);
  sk8Sfx('kapiFener', o.sira);
  OLAY.emit('sekerKapi', { o, n: v ? v.kapi : o.sira + 1, kim: o.kim, tur: o.tur });
}
function sk8Guncelle(o, dt) {
  if (o.durum === 'bekle') {
    if (DURUM !== 'oyun' || P.ucus || P.fade > 0 || (SEKER8.aktif && SEKER8.aktif !== o)) return;
    const dx = Math.abs(P.x - o.x);
    if (dx < 120 && Math.abs(P.y - o.y) < 160) { if (P.ground) sk8Basla(o); else o.havada = true; }
    else if (o.havada && P.ground && dx < 520 && Math.abs(P.y - o.y) < 200) sk8Basla(o);   // havadan geçip ileriye indiyse
    else if (dx > 520) o.havada = false;
    return;
  }
  if (o.durum === 'bitti') { o.bitT += dt; o.fenerT += dt; return; }
  // ── sahne ──
  const T = SK8_T, Z = o.Z, v = sk8V();
  o.st += o.yaklas ? 0 : dt; o.yt += dt;
  const st = o.st;
  if (o.yt > 12 || DURUM !== 'oyun' && DURUM !== 'final') { o.serbest = true; if (SEKER8.aktif === o) SEKER8.aktif = null; sk8Bitir(o); return; }   // asla takılma
  if (!o.serbest) {
    P.kilit = Math.max(P.kilit || 0, .15);
    if (o.yaklas) {
      const d = o.hedefX - P.x;
      if (Math.abs(d) < 4 || o.yt > 1.4 || !P.ground) { o.yaklas = false; P.vx = 0; o.st = .2; }
      else { let vx = clamp(d * 9, -210, 210); if (Math.abs(vx) < 95) vx = Math.sign(d) * 95; P.vx = vx; P.f = Math.sign(d); }
    } else { P.vx = 0; P.f = -o.taraf; }
  }
  // olaylar
  const tk = o.x + o.taraf * 22, ty = o.y - 62;
  for (let i = 0; i < 3; i++) if (!(o.ev & (1 << i)) && st >= T.tak[i]) {
    o.ev |= 1 << i; sk8Sfx('kapiTak', i); OLAY.emit('sekerKapiTak', { o, i, x: tk, y: ty });   // feza.js bununla tık tık pozunu yapar
  }
  const E = SK8_E;
  if (!(o.ev & E.cicek) && o.saka === 'cicek' && st >= T.tak[2] + .18) { o.ev |= E.cicek; sk8Sfx('sakaYay', 2); OLAY.emit('sekerSaka', { o, saka: 'cicek' }); burst(o.x, o.y - SK8_BAS + SK8_TOK, 12, ['#ff8fc8', '#ffe066', '#ffffff'], 80, .8, 5); }
  if (!(o.ev & E.soyle) && st >= T.soyle) { o.ev |= E.soyle; sk8Soyle('p_c_sekermi', { o }); }
  if (!(o.ev & E.ac) && st >= T.ac) { o.ev |= E.ac; sk8Sfx('kapiAc', 1); if (typeof dn8IsikEkle === 'function') { try { dn8IsikEkle(o.x, o.y - 60, '#ffd27a', 520); } catch (e) { } } }
  if (!(o.ev & E.gel) && st >= T.gel) { o.ev |= E.gel; if (o.kim === 'karaKedi') sk8Sfx('kediMiyav'); else if (o.kim === 'hayaletTeyze') sk8Sfx('hayaletKikir'); }
  if (!(o.ev & E.soz) && st >= T.soz) { o.ev |= E.soz; OLAY.emit('komsuSoz', { o, kim: o.kim, tur: o.tur, kostum: o.kostum, an: 'ovgu', saka: o.saka }); }
  if (!(o.ev & E.takir) && o.kim === 'iskeletNine' && st >= T.sasir + .25) { o.ev |= E.takir; sk8Sfx('kemikTakir'); }
  if (!(o.ev & E.kalp) && st >= T.alkis + .05) {
    o.ev |= E.kalp; const hx = KOMSU.basX || o.x, hy = (KOMSU.basY || o.y - 80) - 26;
    sk8Kalpler(o.x + o.taraf * 6, hy, o.es ? 6 : 4); burst(o.x, hy + 10, o.es ? 16 : 10, ['#ffd27a', '#ff8fc8', '#ffffff', '#c39bff'], 100, .9, 5);
  }
  if (!(o.ev & E.saka) && o.tur === 'saka' && st >= Z.saka) {
    o.ev |= E.saka; const s = o.saka;
    if (s === 'kutu') { sk8Sfx('sakaYay', 0); burst(o.kx, o.ky - 16, 12, ['#ffb347', '#ffe066', '#ffffff'], 110, .8, 5); }
    else if (s === 'tavsan') { sk8Sfx('sakaYay', 1); burst(o.kx, o.ky - 8, 14, ['#ffffff', '#ffe7a8', '#c39bff'], 110, .8, 5); }
    else if (s === 'baloncuk') { sk8Sfx('sakaKonfeti', 1); const b = sk8Sepet(); sk8Baloncuklar(KOMSU.cubukX || o.x, KOMSU.cubukY || o.y - 60, (b.x + o.x) / 2, b.y - 30); }
    else if (s === 'cicek') { sk8Sfx('sakaKonfeti', 0); sk8Konfeti(KOMSU.elX, KOMSU.elY - 10, o.taraf, 20); if (Number.isFinite(KOMSU.ikizX)) sk8Konfeti(KOMSU.ikizX, KOMSU.ikizY - 10, o.taraf, 16); }
    if (s !== 'cicek') OLAY.emit('sekerSaka', { o, saka: s });
  }
  if (o.saka === 'tavsan' && !(o.ev & E.fener) && st >= Z.saka + .45 && !o.yag) { o.yag = true; sk8Sfx('sakaKonfeti', 2); const b = sk8Sepet(); sk8YildizYagmuru((b.x + o.x) / 2, b.y - 40); }
  // şekerler
  const sp = sk8Sepet();
  for (let i = 0; i < o.n && i < o.sk.length; i++) {
    const k = o.sk[i];
    if (k.u < 0 && st >= Z.sekerBas + i * sk8Aralik(o)) { k.u = 0; k.t0 = st; k.x0 = o.kx; k.y0 = o.ky; sk8Sfx('sekerUc', i); }
    if (k.u >= 0 && !k.in) {
      k.u = (st - k.t0) / T.ucus;
      if (k.u >= 1) { k.in = true; k.u = 2; o.inen++; if (v) v.seker = (v.seker || 0) + 1; sk8Sfx('sekerSepet', i); burst(sp.x, sp.y - 2, 3, [k.renk, '#ffffff', '#ffd27a'], 45, .45, 4); }
    }
  }
  if (!(o.ev & E.seker) && st >= Z.sonIn + .02) { o.ev |= E.seker; OLAY.emit('seker', { n: o.inen, top: v ? v.seker : o.inen }); }
  if (!o.serbest && st >= Z.birak) { o.serbest = true; P.kilit = Math.min(P.kilit || 0, .05); if (SEKER8.aktif === o) SEKER8.aktif = null; }   // Feza serbest; kapı kendi kendine kapanır
  if (!(o.ev & E.veda) && st >= Z.veda) { o.ev |= E.veda; OLAY.emit('komsuSoz', { o, kim: o.kim, tur: o.tur, kostum: o.kostum, an: 'veda' }); }
  if (!(o.ev & E.kapa) && st >= Z.kapa + .25) { o.ev |= E.kapa; sk8Sfx('kapiAc', 0); }
  if (st >= Z.fener) sk8Bitir(o);
}
// kapının açıklığı (0 kapalı .. 1 açık) ve komşunun görünürlüğü
function sk8Acik(o) { if (o.durum !== 'sahne') return 0; const st = o.st, Z = o.Z; return smooth(clamp((st - SK8_T.ac) / SK8_T.acSure, 0, 1)) * (1 - smooth(clamp((st - Z.kapa - .25) / .45, 0, 1))); }
function sk8Gor(o) { if (o.durum !== 'sahne') return 0; const st = o.st, Z = o.Z; return smooth(clamp((st - SK8_T.gel) / SK8_T.gelSure, 0, 1)) * (1 - smooth(clamp((st - Z.kapa) / .32, 0, 1))); }

// Kapının penceresinde komşu (kapı kapalıyken; ziyaretten sonra el sallar)
const SK8_PPOZ = { yon: 1, sevinc: 1, el: 0, sasir: 0, alkis: 0, uzat: 0, hop: 0, kik: 0, dans: 0, konus: 0 };
function sk8Pencere(c, o, tm) {
  if (!o.bitti) return;
  const p = SK8_PPOZ, yak = Math.abs(P.x - o.x) < 340;
  p.yon = P.x < o.x ? -1 : 1; p.el = (o.bitT < 4.5 || yak) ? smooth(clamp(o.bitT / .5, 0, 1)) : 0; p.sevinc = 1; p.kik = 0; p.konus = now - o.vedaT < o.vedaSure ? 1 : 0;
  const sc = .44, hy = sk8BasY(o.kim), by = SK8_PEN.y - hy * sc + 2.5;
  c.save(); c.beginPath(); c.arc(0, SK8_PEN.y, SK8_PEN.r, 0, SK8_PI2); c.clip();
  komsuCiz(c, o.kim, 0, by, sc, tm, p);
  c.restore();
}
const SK8_ELRENK = { kabakDede: ['#ffb86b', '#b8692c'], kabakDede2: ['#ffb86b', '#b8692c'], iskeletNine: ['#fbf6ee', '#b3a594'], cadiKiz: ['#f8d5bc', '#cf9a7e'],
  karaKedi: ['#3a2f56', '#140d22'], hayaletTeyze: ['#f6efff', '#b9a6dc'] };
function sk8PencereEl(c, o, tm) {   // pencerenin kenarında el sallayan minik el
  const p = SK8_PPOZ; if (p.el <= .02 || KOMSU.dis) return;   // dış çizici kendi eliyle sallar
  const R = SK8_ELRENK[o.kim] || SK8_ELRENK.kabakDede, d = p.yon, a = Math.sin(tm * 9) * .45;
  const hx = d * SK8_PEN.r * .78, hy = SK8_PEN.y + SK8_PEN.r * .5 - p.el * 5;
  c.save(); c.translate(hx, hy); c.rotate(a + d * .3);
  c.fillStyle = R[0]; c.strokeStyle = R[1]; c.lineWidth = 1.1;
  c.beginPath(); c.ellipse(0, 0, 3.6, 4.2, 0, 0, SK8_PI2); c.fill(); c.stroke();
  c.beginPath(); c.ellipse(-d * 3.4, .8, 1.5, 1.9, -d * .6, 0, SK8_PI2); c.fill(); c.stroke();
  c.restore();
}
function sk8Tokmak(c, o, tm, st) {
  const k = o.k, tip = k.tokmak, y = SK8_TOK;
  let sal = 0; for (let i = 0; i < 3; i++) { const u = st - SK8_T.tak[i]; if (u >= 0 && u < .5) sal += Math.sin(u * 26) * .35 * (1 - u / .5); }
  c.save(); c.translate(0, y - 8); c.rotate(sal); c.translate(0, 8);
  if (tip === 'cicek' && o.saka === 'cicek' && (o.ev & SK8_E.cicek || o.bitti)) {   // tokmak çiçek açtı
    const u = o.bitti ? 1 : clamp((st - SK8_T.tak[2] - .18) / .45, 0, 1), e = 1 - Math.pow(1 - u, 3), b = e * (1 + Math.sin(u * Math.PI) * .25);
    sk8Elips(c, -6 * b, 6 * b, 5 * b, 2.4 * b, -.6, '#7fb04a', '#3c6a24', 1); sk8Elips(c, 6 * b, 6 * b, 5 * b, 2.4 * b, .6, '#7fb04a', '#3c6a24', 1);
    for (let i = 0; i < 6; i++) { const a = i / 6 * SK8_PI2 + tm * .3; c.save(); c.rotate(a); sk8Elips(c, 0, -6.5 * b, 3.6 * b, 5.4 * b, 0, i % 2 ? '#ff9fd0' : '#ff7fbe', '#c8508e', 1); c.restore(); }
    sk8Elips(c, 0, 0, 3.8 * b + .5, 3.8 * b + .5, 0, '#ffe066', '#c89a2a', 1); sk8Elips(c, -1.2, -1.2, 1.2 * b, 1.2 * b, 0, '#fff8d0');
  } else sk8Koy(c, sk8TokmakSpr(tip), 0, 0);
  c.restore();
}
// Feza'nın kapıyı çalan eli (feza.js kendi pozunu vermezse): arka kol, kapıya uzanır; kostüm renginde kol
const SK8_KOL = { cadi: '#6b4bb0', kabak: '#ff9a3c', iskelet: '#2b3566', yarasa: '#a88ad8' };
function sk8TakEl(c, o) {
  if (typeof fezaKapiTak === 'function' || o.durum !== 'sahne' || o.yaklas) return;
  const st = o.st, T = SK8_T, ac = sk8Ar(st, T.tak[0] - .22, T.tak[2] + .2, .14);
  if (ac <= 0) return;
  let it = 0; for (let i = 0; i < 3; i++) { const u = st - T.tak[i] + .07; if (u >= 0 && u < .16) it = Math.max(it, Math.sin(u / .16 * Math.PI)); }
  const f = -o.taraf, px = P.rx ?? P.x, py = P.ry ?? P.y, sx = px + f * 1, sy = py - 47;
  const ex = lerp(px + f * 6, px + f * (17 + it * 4), ac), ey = lerp(py - 32, py - 52, ac);
  const kol = SK8_KOL[o.kostum] || '#f8f2e5', kk = mixc(kol, '#1a1030', .45);
  c.lineCap = 'round'; c.strokeStyle = kk; c.lineWidth = 7.4; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + f * 9, sy + 6, ex, ey); c.stroke();
  c.strokeStyle = kol; c.lineWidth = 5.2; c.stroke();
  c.fillStyle = '#f8d5bc'; c.strokeStyle = '#cf9a7e'; c.lineWidth = 1.3; c.beginPath(); c.arc(ex + f * 1.5, ey, 3.8, 0, SK8_PI2); c.fill(); c.stroke();
}

TUR.kaydet('sekerKapi', {
  kur(o) {
    o.kim = SK8_KAPI[o.kim] ? o.kim : 'kabakDede'; o.k = SK8_KAPI[o.kim];
    o.tur = o.k.tur; o.n = o.k.n; o.saka = o.k.saka; o.sira = o.sira | 0;
    o.durum = 'bekle'; o.st = 0; o.yt = 0; o.ev = 0; o.bitti = false; o.done = false; o.yaklas = false; o.havada = false; o.serbest = true;
    o.taraf = -1; o.hedefX = o.x - SK8_DUR; o.kx = o.x; o.ky = o.y - 50; o.bitT = 0; o.fenerT = -1; o.inen = 0; o.kostum = null; o.es = false; o.yag = false;
    o.t = (o.x * .013) % 7; o.sozBas = -1; o.sozSure = 0; o.vedaT = -9; o.vedaSure = 0; o.Z = {}; sk8Takvim(o);
    o.sk = []; for (let i = 0; i < 8; i++) o.sk.push({ u: -1, in: false, x0: 0, y0: 0, tip: 'sargi', renk: '#ff8fc8', don: 0, h: 50 });
  },
  guncelle(o, dt) {
    if (!(dt >= 0) || !Number.isFinite(dt)) dt = 0;
    if (dt > .1) dt = .1;
    // önbellek ısıtma: sokağa yaklaşınca kare başına bir sprite (ilk kapının çiziminde takılma olmasın)
    if (o.sira === 0 && SK8.isit < 64 && P.x > o.x - 4200 && P.x < o.x + 7000) sk8Isit();
    sk8Guncelle(o, dt);
    if (SK8.efO === o) sk8Efektler(dt);
  },
  ciz(o, tm) {
    const c = g, k = o.k, st = o.durum === 'sahne' ? o.st : 0, ac = sk8Acik(o), kv = sk8Gor(o);
    sk8Koy(c, sk8ZeminSpr(o.kim), o.x, o.y);
    // eğri büğrü kapı grubu (basamağın üstünden eğik)
    c.save(); c.translate(o.x, o.y - SK8_BAS); c.rotate(k.egim); c.translate(0, SK8_BAS);
    sk8Koy(c, sk8CerSpr(o.kim), 0, 0);
    if (ac > .001) sk8Koy(c, sk8IcSpr(), 0, 0);
    let tit = 0; for (let i = 0; i < 3; i++) { const u = st - SK8_T.tak[i]; if (u >= 0 && u < .18) tit += Math.sin(u * 70) * .9 * (1 - u / .18); }
    if (ac < .985) {
      const kx = lerp(1, .1, ac);
      c.save(); c.translate(SK8_AG, 0); c.scale(kx, 1); c.translate(-SK8_AG + tit, 0);
      sk8Koy(c, sk8PanSpr(o.kim), 0, 0);
      if (ac === 0) sk8Pencere(c, o, tm);
      sk8Koy(c, sk8PenCerSpr(o.kim, o.bitti && ac === 0), 0, 0);
      if (ac === 0 && o.bitti) sk8PencereEl(c, o, tm);
      // tokmak: sahne öncesi davetkâr parıltı
      if (!o.bitti && o.durum === 'bekle') { const n = .5 + .5 * Math.sin(tm * 2.6 + o.t), yak = clamp(1 - Math.abs(P.x - o.x) / 700, 0, 1); c.globalCompositeOperation = 'lighter'; sk8Isik(c, '#ffd27a', 0, SK8_TOK, 16 + 6 * n, (.25 + .35 * yak) * (.6 + .4 * n)); c.globalCompositeOperation = 'source-over'; }
      sk8Tokmak(c, o, tm, st);
      if (ac > 0) { c.globalAlpha = ac * .6; sk8Koy(c, sk8PanGolSpr(), 0, 0); c.globalAlpha = 1; }
      c.restore();
    }
    c.restore();
    if (o.durum === 'bekle' && !o.bitti) {   // tokmağın çevresinde iki minik pırıltı
      const yak = clamp(1 - Math.abs(P.x - o.x) / 600, 0, 1);
      if (yak > 0) { c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 2; i++) { const a = tm * 1.6 + i * 3.1 + o.t; sk8Isik(c, '#fff3c0', o.x + Math.cos(a) * 14 + Math.sin(k.egim) * 60, o.y + SK8_TOK - SK8_BAS + 8 + Math.sin(a * 1.3) * 10, 4, yak * (.5 + .5 * Math.sin(tm * 4 + i))); } c.globalCompositeOperation = 'source-over'; }
    }
    // komşu (dik): açıklıktan sıcak ışığın içinden belirir
    if (kv > 0) {
      const p = sk8Poz(o, st), yy = o.y - SK8_BAS + (1 - kv) * 7, ss = lerp(.92, 1, kv);
      komsuCiz(c, o.kim, o.x, yy, ss, tm, p);
      if (kv < 1) {   // sıcak ışığın içinden belirir (üstünü örten ışık yavaşça çekilir)
        c.save(); c.translate(o.x, o.y - SK8_BAS); c.rotate(k.egim); c.translate(0, SK8_BAS);
        c.globalAlpha = 1 - kv; sk8Koy(c, sk8IcSpr(), 0, 0); c.globalAlpha = 1; c.restore();
      }
      sk8Esya(c, o, st, tm, p);
      if (o.durum === 'sahne') { o.kx = KOMSU.elX; o.ky = KOMSU.elY; if (!Number.isFinite(o.kx)) { o.kx = o.x; o.ky = o.y - 50; } }
    }
    // fener (sağ üstte, kıvrık demir kolda)
    sk8Koy(c, sk8AskiSpr(), o.x, o.y);
    const fx = o.x + SK8_FEN.x, fy = o.y + SK8_FEN.y, sw = Math.sin(tm * 1.3 + o.t) * .05, yan = o.bitti ? smooth(clamp(o.fenerT / .6, 0, 1)) : 0;
    c.save(); c.translate(fx, fy); c.rotate(sw);
    if (yan < 1) sk8Koy(c, sk8FenerSpr(o.kim, false), 0, 0);
    if (yan > 0) { c.globalAlpha = yan; sk8Koy(c, sk8FenerSpr(o.kim, true), 0, 0); c.globalAlpha = 1;
      const n = .85 + .1 * Math.sin(tm * 2.3 + o.t) + .05 * Math.sin(tm * 5.1); c.globalCompositeOperation = 'lighter'; sk8Isik(c, k.fener, 0, 16, 46 * n, .38 * yan); sk8Isik(c, '#fff6d6', 0, 16, 12, .5 * yan); c.globalCompositeOperation = 'source-over'; }
    c.restore();
    sk8TakEl(c, o);
  },
  cizOn(o, tm) {
    const c = g;
    const ac = sk8Acik(o);
    if (ac > 0) {   // kapıdan sokağa taşan sıcak ışık (Feza'nın üstüne de vurur)
      c.globalCompositeOperation = 'lighter';
      c.globalAlpha = .34 * ac; c.drawImage(glow('#ffd27a'), o.x - 120 + o.taraf * 10, o.y - 30, 240, 56);
      sk8Isik(c, '#ffcf7a', o.x, o.y - 66, 92, .22 * ac);
      c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
    }
    if (o.durum === 'sahne') {
      const st = o.st, T = SK8_T;
      // vuruş çizgileri ("tık tık")
      const tx = o.x + o.taraf * 21, ty = o.y - 64;
      for (let i = 0; i < 3; i++) { const u = (st - T.tak[i]) / .3; if (u < 0 || u > 1) continue; c.globalAlpha = 1 - u; c.strokeStyle = '#fff3c0'; c.lineWidth = 2.2; c.lineCap = 'round'; c.beginPath();
        for (let j = 0; j < 3; j++) { const a = (o.taraf < 0 ? Math.PI : 0) + (j - 1) * .7 + Math.PI, r0 = 7 + u * 8, r1 = r0 + 6; c.moveTo(tx + Math.cos(a) * r0, ty + Math.sin(a) * r0); c.lineTo(tx + Math.cos(a) * r1, ty + Math.sin(a) * r1); }
        c.stroke(); c.globalAlpha = 1; }
      // kostüm balonu
      const bal = sk8Ar(st, T.balon, Math.max(T.balon + 1.1, Math.min(T.balonSon, (o.Z.sekerBas || 9) - .12)), .2);   // şekerler uçmaya başlarken balon çekilir (üst üste binmesin)
      if (bal > 0) {
        const sp = sk8KostumSpr(o.kostum || 'genel'), bx = o.x + o.taraf * 30, by = (KOMSU.basY || o.y - 80) - 44 + Math.sin(tm * 2.4) * 2, sc = bal * (1 + Math.sin(clamp((st - T.balon) / .3, 0, 1) * Math.PI) * .18);
        c.save(); c.translate(bx, by); c.scale(-o.taraf * sc, sc); sk8Koy(c, sp, 0, 0); c.restore();
      }
      // uçan şekerler (yay çizip sepete)
      const b = sk8Sepet();
      for (let i = 0; i < o.n && i < o.sk.length; i++) {
        const k = o.sk[i]; if (k.u < 0 || k.in) continue;
        // yatayda biraz önden gider: son kısımda şeker sepete yukarıdan, neredeyse dik düşer ("içine girdi" okunsun)
        const u = clamp(k.u, 0, 1), e = 1 - Math.pow(1 - u, 1.7), x = lerp(k.x0, b.x, e), y = lerp(k.y0, b.y, u) - k.h * 4 * u * (1 - u);
        const sc = u > .82 ? 1 - (u - .82) / .18 * .5 : u < .12 ? .6 + u / .12 * .4 : 1;
        c.save(); c.translate(x, y); c.rotate(k.don * u); c.scale(sc, sc); sk8Koy(c, sk8SekerSpr(k.tip, k.renk), 0, 0); c.restore();
        c.globalCompositeOperation = 'lighter'; sk8Isik(c, k.renk, x, y, 12, .3); c.globalCompositeOperation = 'source-over';
      }
    }
    if (SK8.efO === o) sk8EfektCiz(c, tm);
  },
});
// Şaka eşyaları ve şeker kaynağı (komşunun önünde). Yaylı kutu ve sihirli şapka kapı açılınca basamakta, komşunun Feza tarafında
// durur (merak uyandırır); şaka anında kutudan yayla gülen kabak, şapkadan tavşan fırlar (komşunun yüzünü örtmeden, Feza'ya doğru).
function sk8Esya(c, o, st, tm, p) {
  const Z = o.Z, s = o.saka, T = SK8_T, yon = o.taraf;
  if (o.durum !== 'sahne') return;
  if (KOMSU.dis) {   // başka dosyanın çizicisi: kâse / baloncuk çubuğu burada
    if (o.kim === 'karaKedi' && p.uzat > .15) { const bx = KOMSU.elX - yon * 6, by = KOMSU.elY + 6; c.globalAlpha = clamp((p.uzat - .15) / .3, 0, 1); sk8Koy(c, sk8KaseSpr(), bx, by); c.globalAlpha = 1; o.kx = bx; o.ky = by - 6; }
    if (o.kim === 'hayaletTeyze' && p.cubuk > 0) { c.globalAlpha = clamp(p.cubuk * 3, 0, 1); c.save(); c.translate(KOMSU.elX, KOMSU.elY); c.rotate(yon * .7); sk8Koy(c, sk8CubukSpr(), 0, 0); c.restore(); c.globalAlpha = 1;
      KOMSU.cubukX = KOMSU.elX + Math.sin(yon * .7) * 17; KOMSU.cubukY = KOMSU.elY - Math.cos(yon * .7) * 17; }
  }
  if (o.tur !== 'saka') return;
  if (s === 'kutu' || s === 'tavsan') {
    const g0 = sk8Ar(st, T.ac + .25, Z.kapa + .05, .25); if (g0 <= 0) return;
    const bx = o.x + yon * (s === 'kutu' ? 18 : 19), by = o.y - SK8_BAS, u = st - Z.saka, zp = u > 0 && u < .25 ? Math.sin(u / .25 * Math.PI) * 2.5 : 0;
    c.save(); c.translate(bx, by); c.scale(g0, g0 * (1 + zp * .03));
    if (s === 'kutu') {
      const ac = clamp(u / .12, 0, 1), L = u < 0 ? 0 : (25 + Math.exp(-u * 3.2) * Math.sin(u * 17) * 9) * smooth(clamp(u / .12, 0, 1));
      if (L > 0) {   // yay + gülen kabak (Feza'ya doğru eğik)
        c.save(); c.translate(0, -16); c.rotate(yon * .5 + Math.sin(u * 6) * .06 * Math.exp(-u));   // belirgin eğik: kabak komşunun göğsünü örtmesin
        c.strokeStyle = '#8f86a8'; c.lineWidth = 2.6; c.beginPath(); c.moveTo(0, 0); for (let i = 1; i <= 8; i++) c.lineTo((i % 2 ? -4.2 : 4.2), -L * i / 8); c.stroke();
        c.strokeStyle = '#e4ddf0'; c.lineWidth = 1.4; c.stroke();
        c.translate(0, -L + 3); c.rotate(-yon * .5 + Math.sin(u * 9) * .2 * Math.exp(-u * 1.5));
        if (typeof kabakCiz === 'function') { try { kabakCiz(c, 0, 0, .42, tm, { yuz: 0, yanik: 1, mutlu: 1 }); } catch (e) { sk8Koy(c, sk8MiniKabakSpr(), 0, 0); } }
        else sk8Koy(c, sk8MiniKabakSpr(), 0, 0);
        c.restore();
      }
      sk8Koy(c, sk8KutuSpr(), 0, 0);
      c.save(); c.translate(-yon * 12, -16); c.rotate(-yon * ac * 2.1); c.translate(yon * 12, 0); sk8Koy(c, sk8KapakSpr(), 0, 0); c.restore();
      o.kx = bx; o.ky = by - 18;
    } else {
      const hy = -17; c.translate(0, hy);
      sk8Koy(c, sk8SapkaArkaSpr(), 0, 0);
      const ut = u - .15;
      if (ut > 0) { const up = Math.min(1, ut / .24), yv = (1 - Math.pow(1 - up, 3)) * 21 + Math.sin(ut * 7) * 1.2 * up; c.save(); c.translate(0, 19 - yv); c.rotate(Math.sin(ut * 5) * .08 + yon * .06); sk8Koy(c, sk8TavsanSpr(), 0, 0); c.restore(); }
      sk8Koy(c, sk8SapkaOnSpr(), 0, 0);
      o.kx = bx; o.ky = by + hy - 2;
    }
    c.restore();
    if (s === 'tavsan' && u > -.35 && u < .25 && Number.isFinite(KOMSU.asaX)) {   // asadan şapkaya uçan yıldız ışığı
      const e = smooth(clamp((u + .35) / .45, 0, 1)), sx = lerp(KOMSU.asaX, bx, e), sy = lerp(KOMSU.asaY, by - 18, e) - Math.sin(e * Math.PI) * 14;
      c.globalCompositeOperation = 'lighter'; sk8Isik(c, '#ffe7a8', sx, sy, 16, .8); sk8Isik(c, '#ffffff', sx, sy, 5, .9); c.globalCompositeOperation = 'source-over';
    }
  } else if (s === 'baloncuk') {
    if (Number.isFinite(KOMSU.cubukX) && p.cubuk > .3) { o.kx = KOMSU.elX; o.ky = KOMSU.elY; }
  }
}
function sk8EfektCiz(c, tm) {
  const kalp = sk8KalpSpr();
  for (const h of SK8_KLP) if (h.t >= 0) { const u = h.t / h.omur, a = u < .15 ? u / .15 : 1 - Math.max(0, (u - .6) / .4), r = h.r * (u < .15 ? .5 + u / .3 : 1); c.globalAlpha = a; c.drawImage(kalp, h.x - r, h.y - r, r * 2, r * 2); }
  c.globalAlpha = 1;
  for (const p of SK8_KONF) if (p.t >= 0) {
    const a = p.t > p.omur - .5 ? (p.omur - p.t) / .5 : 1;
    c.globalAlpha = a;
    if (p.yil) { const sp = sk8YildizSpr('#ffe066'), r = p.r * 1.4; c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.drawImage(sp, -r, -r, r * 2, r * 2); c.restore(); }
    else { c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.scale(1, Math.cos(p.t * 9 + p.ph)); c.fillStyle = p.renk; c.fillRect(-p.r, -p.r * .5, p.r * 2, p.r); c.restore(); }
  }
  c.globalAlpha = 1;
  const bs = sk8BalonSpr();
  for (const b of SK8_BAL) if (b.t >= 0) { const u = b.t / b.omur, r = b.r * (u < .2 ? u / .2 : 1) * (1 + Math.sin(b.t * 6 + b.ph) * .04); c.globalAlpha = .95; c.drawImage(bs, b.x - r, b.y - r, r * 2, r * 2); }
  c.globalAlpha = 1;
  c.globalCompositeOperation = 'lighter';
  for (const s of SK8_YIL) if (s.t >= 0) { const u = s.t / s.omur, a = (u < .15 ? u / .15 : u > .7 ? (1 - u) / .3 : 1) * (.7 + .3 * Math.sin(s.t * 9 + s.ph)); sk8Isik(c, s.renk, s.x, s.y, s.r * 3, a * .45); c.globalAlpha = a; const sp = sk8YildizSpr(s.renk); c.drawImage(sp, s.x - s.r, s.y - s.r, s.r * 2, s.r * 2); }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
}
// Önbellek ısıtma listesi (sırayla, kare başına bir tane)
const SK8_ISIT = [];
function sk8Isit() {
  if (!SK8_ISIT.length) {
    const kimler = Object.keys(SK8_KAPI);
    for (const k of kimler) SK8_ISIT.push(() => sk8ZeminSpr(k), () => sk8CerSpr(k), () => sk8PanSpr(k), () => sk8PenCerSpr(k), () => sk8FenerSpr(k, false), () => sk8FenerSpr(k, true));
    SK8_ISIT.push(sk8IcSpr, sk8PanGolSpr, sk8AskiSpr, sk8DedeGovde, sk8DedeBas, sk8NineGovde, sk8NineBas, sk8KizGovde, sk8KizBas, sk8KediGovde, sk8KediBas, sk8TeyzeSapka,
      () => sk8CocukGovde(0), () => sk8CocukGovde(1), () => sk8CocukBas(0), () => sk8CocukBas(1), sk8KaseSpr, sk8KutuSpr, sk8KapakSpr, sk8MiniKabakSpr, sk8SapkaArkaSpr, sk8SapkaOnSpr,
      sk8TavsanSpr, sk8PatlatSpr, sk8AsaSpr, sk8CubukSpr, sk8KediSapkaSpr, sk8KalpSpr, sk8BalonSpr, () => sk8YildizSpr('#ffe066'), () => sk8YildizSpr('#ffe7a8'), () => sk8YildizSpr('#ffd27a'), () => sk8YildizSpr('#fff3b0'));
    for (const t of ['halka', 'zil', 'yildiz', 'balik', 'kalp', 'cicek']) SK8_ISIT.push(() => sk8TokmakSpr(t));
    for (const k of ['cadi', 'kabak', 'iskelet', 'yarasa', 'genel']) SK8_ISIT.push(() => sk8KostumSpr(k));
    for (const tp of SK8_SEKER_TIP) for (const r of SK8_SEKER_RENK) SK8_ISIT.push(() => sk8SekerSpr(tp, r));
  }
  const n = SK8_ISIT.length;
  if (SK8.isit >= n) { SK8.isit = 64; return; }
  try { SK8_ISIT[SK8.isit](); } catch (e) { }
  SK8.isit++; if (SK8.isit >= n) SK8.isit = 1e9;
}
