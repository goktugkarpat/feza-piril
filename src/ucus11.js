/* ucus11.js — Bölüm 11 (Ay Işığı Şatosu) pelerinle kuleye uçuş (önek uc11), nesne türü 'pelerinUcus'. Sahibi: UCUS.
   Balkonda (sütun 604) Vela ve lila yarasa dostları Feza'yı bekler. Pasta bitince (V11.pasta; pasta türü yoksa hemen) balkon hazırdır;
   Feza balkona gelince ay ışığı huzmesi üstüne düşer, pelerinini kanat gibi açar (sfx 'pelerinAc', OLAY 'pelerinUcusBasla') ve hep birlikte
   havalanırlar (OLAY 'pelerinUcusKalk'). Yolculuk (~60 sn): KALKIŞ (balkondan ay ışığına yükseliş) → BULUT ARALIKLARI (lila bulut
   tutamlarının arasından, içinden geçilen tutamlar aralanır; ay ışığı damlaları yay, dalga, halka biçiminde) → AY ANI (bulutlar aralanır,
   kocaman inci-sarı Ay'ın tam önünden ağır çekim geçiş: Feza, Vela, Pırıl ve yarasalar ayda siluet olur, el sallarlar; ayın önünde altın
   yıldız yayı; OLAY 'pelerinUcusAy') → ŞATO (ışıkları yanmış eğri büğrü kulelerin, yuvarlak pencerelerin, flamaların üstünden süzülüş;
   OLAY 'pelerinUcusSato') → İNİŞ (kule terasına yumuşak iniş; OLAY 'pelerinUcusInis', sonra 'pelerinUcusBitti', V11.ucus = true).
   Kontrol: ekrana basılı tutunca (ya da Boşluk/↑/W) Feza yükselir, bırakınca yumuşakça süzülerek alçalır; hep kendiliğinden ileri gider;
   yükseklik koridorda sınırlı; düşme, çarpma, kaybetme yok. Ay ışığı damlaları (ve ay anında altın yıldızlar) yakından geçince Feza'ya
   doğru kayar (mıknatıs), alınan ışık pelerinine akar (pelerinin ışık izi parlar; OLAY 'pelerinUcusIsik' {n, top}, sfx 'ucusIsik' v = n).
   Kaçan sorun değil (yavaşça göğe süzülüp söner). ~9 sn dokunulmazsa sıradaki damla parlar ve Pırıl yanına gider; ~14 sn dokunulmazsa
   Pırıl ay ışığından bir kurdeleyle Feza'yı damlalara götürür (3,5 sn çeker, 4,5 sn bırakır; OLAY 'pelerinUcusYardim'; dokununca kontrol
   hemen çocuğa döner). Dokunmanın değeri: dokunan çocuğun mıknatısı güçlü (hemen hepsi alınır), hiç dokunmayan ~%45-50 toplar;
   basınca pelerin kanat gibi çırpıp açılır, minik ışık pufu, Feza güler, yükselirken arkasında ay ışığı hız çizgileri akar.
   Sanal yol (supurge.js gibi): boşluk (609..764, ~6500 birim) 60 sn'lik uçuşa kısa gelir. Damlalar, yakın bulutlar, yakın şato çatıları ve
   parçacıklar sanal yolda (v) durur, dünyaya o.dx kaymasıyla çizilir (dünya x = v + o.dx); Feza'nın dünya x'i sanalın ~0,6'sı hızla gider
   (kamera ve uzak dünya yavaş, yakın katman hızlı akar → derinlik). Yakın katman yalnız uçuşta çizilir.
   Ay: ay anında Ay'ı bu modül çizer (nesne katmanında, yakın bulutların ve şatonun arkasında); dunya11 gökteki kendi ayını UCUS11.ayA()
   oranında soldurur ve UCUS11.ay() konumuna kaydırır; ay anının kenarlarında iki ay aynı yerde olduğundan devir kesintisizdir.
   UCUS11.ay() → {x, y, r, a, w} (dünya koordinatı), UCUS11.ayAni() 0..1.
   Fizik devralma: P.ucus = o, motor her adımda o.adim(dt, OYUN.ucusGirdi) çağırır; uçuşta Feza, Pırıl, Vela ve yarasalar burada çizilir
   (oyun.js P.ucus doluyken Feza'yı ve Pırıl'ı çizmez). Kamera: oyun.js uçuş kamerası BOLUM.kule (= BOLUM.ucus) koridorunu okur; uçuşta
   yUst/yAlt Feza'nın yumuşatılmış yüksekliğini izler, bitince eski değerlere döner.
   Olaylar: pelerinUcusHazir {o}, pelerinUcusBasla {o, top}, pelerinUcusKalk {o}, pelerinUcusVela {o}, pelerinUcusIsik {o, n, top, tip},
   pelerinUcusAy {o}, pelerinUcusSato {o}, pelerinUcusYardim {o}, pelerinUcusInis {o}, pelerinUcusBitti {o, n, top, sure, x, y}.
   Dışa açık: UCUS11.o, .aktif, ay(), ayA(), ayAni(), faz(), ilerleme(), hazir(), bitti().
   Sözleşme: src/BOLUM11.md. Karede gradyan/filtre/shadowBlur yok: çizimler ilk kullanımda önbelleğe alınır (uc11Isit karelere yayar),
   parçacıklar sabit havuzda. */
'use strict';
const UC11_LV = 11000;                                         // sanal yol uzunluğu (birim)
const UC11_AC = 2.1, UC11_INIS = 2.8;                          // balkonda pelerin açılışı, iniş (sn)
const UC11_V0 = 205, UC11_VS = 232, UC11_VAY = 80, UC11_VI = 150;   // hız: bulutlar, şato, ay anında en yavaş, iniş sonu (birim/sn)
const UC11_UST = 140, UC11_ALT = -92;                          // şeride göre yükseklik payı (yukarı +)
const UC11_IPUCU = 9, UC11_YARDIM = 14;                       // dokunulmadan geçen süre: ipucu / Pırıl kendisi götürür
const UC11_AY_V = 4600, UC11_AY_W = 540;                       // ay anı: sanal konum, yarı genişlik (yavaşlama)
const UC11_SATO0 = 5600, UC11_SATO1 = UC11_LV - 600;           // yakın şato katmanı
const UC11_INISV = UC11_LV - 1500;                             // iniş yavaşlaması
const UC11_GOGUS = 34;                                         // ayak → göğüs
const UC11_SIL = 0.86;                                         // ay önünde siluetin en koyu hâli
const UC11_TOZ = ['#eaf4ff', '#cfe6ff', '#a9c8ff', '#ffe7a8', '#ffb3d1', '#d9c8ff'];   // ay gümüşü, ay ışığı, mavi, altın, pembe, lila
const UC11_PEN = ['#ffd27a', '#ffe7a8', '#cfe6ff'];            // pencere ışıkları
const UC11_BAY = ['#ff7a9a', '#c39bff', '#9ff0d0', '#ffd27a', '#ffb3d1'];   // flama ve bayrak süsü renkleri
const UC11_PEL = { mor: ['#4b2f8f', '#c39bff', '#ffe27a'], lacivert: ['#24306e', '#a9c8ff', '#eaf4ff'], kirmizi: ['#d93a64', '#ffb3d1', '#fff0f5'], pembe: ['#b77ad8', '#fff0fa', '#eaf4ff'] };
// ışık dizileri: [biçim, sanal konum, tür ('d' damla | 'y' yıldız), taban yükseklik (göğüs şeridine göre, yukarı +), ...]
//   cizgi: n, aralık · yay: n, aralık, tepe · dalga: n, aralık, genlik · merdiven: n, aralık, adım · halka: yarıçap (ortada damla, 6 yıldız)
const UC11_DIZI = [
  ['cizgi', 650, 'd', 0, 3, 110], ['yay', 1350, 'd', 0, 5, 110, 80], ['dalga', 2300, 'd', 15, 5, 140, 50], ['halka', 3250, 'd', 40, 56],
  ['yay', UC11_AY_V - 360, 'y', -4, 7, 120, 34],                // ay anı: ayın önünde altın yıldız yayı
  ['merdiven', 5800, 'd', -40, 4, 120, 40], ['cizgi', 6650, 'd', -66, 3, 110], ['dalga', 7350, 'd', 20, 5, 140, 50],
  ['halka', 8300, 'd', 30, 56], ['yay', 9000, 'y', 10, 6, 120, 100], ['merdiven', 9800, 'd', 70, 3, 120, -40],
  ['merdiven', 10260, 'd', 30, 4, 110, -12]];   // son: terasa inen küçük damla yolu (inişe kadar boş an kalmasın)
const UCUS11 = {
  o: null, aktif: false,
  ay() { const o = this.o; return o && o.ay ? o.ay : null; },
  ayA() { const o = this.o; return o && o.ay && P.ucus === o ? o.ay.a : 0; },
  ayAni() { const o = this.o; return o && o.ay && P.ucus === o ? o.ay.w || 0 : 0; },   // ay anı ağırlığı (dunya11 uzak tepeleri alçaltır)
  faz() { return this.o ? this.o.faz : null; },
  ilerleme() { const o = this.o; return o ? (o.done ? 1 : clamp(o.v / UC11_LV, 0, 1)) : 0; },
  hazir() { return !!this.o && !!this.o.hazir; },
  bitti() { return !!this.o && !!this.o.done; },
};
function uc11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function uc11V() { return typeof V11 !== 'undefined' && V11 ? V11 : null; }

// ── önbellek sprite'ları (degrade yalnız burada, bir kez) ──
const uc11Art = {};
function uc11Tuval(w, h, olc) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * olc)); c.height = Math.max(1, Math.ceil(h * olc)); const q = c.getContext('2d'); q.scale(olc, olc); q.lineJoin = 'round'; q.lineCap = 'round'; return { c, q }; }
function uc11Rgba(h, a) { const n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }
function uc11Yildiz5(q, x, y, r, ic) { q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * ic : r, px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i) q.lineTo(px, py); else q.moveTo(px, py); } q.closePath(); }
function uc11TozArt(ci) {   // parıltı: 24×24 birim (merkez 12,12): dört köşeli ışık + renkli hâle
  const k = 'z' + ci; if (uc11Art[k]) return uc11Art[k];
  const { c, q } = uc11Tuval(24, 24, 3), col = UC11_TOZ[ci % UC11_TOZ.length];
  const gr = q.createRadialGradient(12, 12, 0, 12, 12, 12); gr.addColorStop(0, uc11Rgba(col, 0.75)); gr.addColorStop(0.4, uc11Rgba(col, 0.22)); gr.addColorStop(1, uc11Rgba(col, 0));
  q.fillStyle = gr; q.fillRect(0, 0, 24, 24);
  q.fillStyle = '#ffffff'; q.beginPath(); q.moveTo(12, 2.5); q.quadraticCurveTo(13, 11, 21.5, 12); q.quadraticCurveTo(13, 13, 12, 21.5); q.quadraticCurveTo(11, 13, 2.5, 12); q.quadraticCurveTo(11, 11, 12, 2.5); q.fill();
  q.fillStyle = col; q.beginPath(); q.arc(12, 12, 2.2, 0, 6.283); q.fill();
  return (uc11Art[k] = c);
}
function uc11DamlaArt() {   // ay ışığı damlası: 40×52 birim (merkez 20,30): gümüş-mavi, içi ışıl ışıl, tepesi incecik
  if (uc11Art.d) return uc11Art.d;
  const { c, q } = uc11Tuval(40, 52, 3);
  let gr = q.createRadialGradient(20, 30, 1, 20, 30, 20); gr.addColorStop(0, 'rgba(207,230,255,0.6)'); gr.addColorStop(0.5, 'rgba(169,200,255,0.2)'); gr.addColorStop(1, 'rgba(169,200,255,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 40, 52);
  const yol = k => { q.beginPath(); q.moveTo(20, 13.5 - k * 1.4); q.bezierCurveTo(22 + k, 19, 28.5 + k, 24, 28.5 + k, 31); q.arc(20, 31, 8.5 + k, 0, Math.PI); q.bezierCurveTo(11.5 - k, 24, 18 - k, 19, 20, 13.5 - k * 1.4); q.closePath(); };
  q.fillStyle = 'rgba(96,120,210,0.6)'; yol(1.3); q.fill();
  gr = q.createLinearGradient(14, 16, 26, 40); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.45, '#dcecff'); gr.addColorStop(1, '#94b4ff');
  q.fillStyle = gr; yol(0); q.fill();
  gr = q.createRadialGradient(20, 32, 0, 20, 32, 7.5); gr.addColorStop(0, 'rgba(255,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = gr; q.beginPath(); q.arc(20, 32, 7.5, 0, 6.283); q.fill();   // iç ışık
  q.fillStyle = 'rgba(255,255,255,0.92)'; q.beginPath(); q.ellipse(16.2, 27, 2.1, 3.6, -0.4, 0, 6.283); q.fill();   // parlak benek
  q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.arc(23.6, 35.6, 1.1, 0, 6.283); q.fill();
  q.save(); yol(0); q.clip();   // cam gibi derinlik: alt kenarda yansıyan lila ışık, sağ kenarda koyu kırılma
  gr = q.createRadialGradient(22, 42, 0, 22, 42, 9); gr.addColorStop(0, 'rgba(217,200,255,0.7)'); gr.addColorStop(1, 'rgba(217,200,255,0)'); q.fillStyle = gr; q.fillRect(0, 0, 40, 52);
  q.strokeStyle = 'rgba(70,90,190,0.35)'; q.lineWidth = 2; q.beginPath(); q.arc(20, 31, 8.2, -0.4, 1.3); q.stroke();
  q.restore();
  q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(17.3, 22.5, 0.9, 1.8, -0.4, 0, 6.283); q.fill();
  return (uc11Art.d = c);
}
function uc11YildizArt() {   // altın yıldız: 40×40 birim (merkez 20,20), yuvarlak köşeli, hâleli
  if (uc11Art.y) return uc11Art.y;
  const { c, q } = uc11Tuval(40, 40, 3);
  let gr = q.createRadialGradient(20, 20, 2, 20, 20, 20); gr.addColorStop(0, 'rgba(255,231,168,0.62)'); gr.addColorStop(0.5, 'rgba(255,210,122,0.18)'); gr.addColorStop(1, 'rgba(255,210,122,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 40, 40);
  q.lineWidth = 3; q.strokeStyle = '#e8a94a'; uc11Yildiz5(q, 20, 21, 10.5, 0.5); q.stroke();
  gr = q.createLinearGradient(12, 10, 28, 30); gr.addColorStop(0, '#fff8d8'); gr.addColorStop(0.6, '#ffe08a'); gr.addColorStop(1, '#ffc65a');
  q.fillStyle = gr; uc11Yildiz5(q, 20, 21, 10.5, 0.5); q.fill();
  q.fillStyle = 'rgba(255,255,255,0.85)'; q.beginPath(); q.ellipse(17, 16.5, 2, 1.2, -0.6, 0, 6.283); q.fill();
  return (uc11Art.y = c);
}
function uc11AyArt() {   // kocaman inci-sarı ay: 512 px, disk yarıçapı 190 px (merkez 256), gümüş hâle; süt lekesi gibi yumuşak lekeler
  if (uc11Art.ay) return uc11Art.ay;
  const c = document.createElement('canvas'); c.width = c.height = 512; const q = c.getContext('2d');
  let gr = q.createRadialGradient(256, 256, 178, 256, 256, 256); gr.addColorStop(0, 'rgba(234,244,255,0.5)'); gr.addColorStop(0.3, 'rgba(207,230,255,0.18)'); gr.addColorStop(1, 'rgba(207,230,255,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 512, 512);
  gr = q.createRadialGradient(212, 204, 16, 256, 256, 192); gr.addColorStop(0, '#fffdf3'); gr.addColorStop(0.55, '#fff4d6'); gr.addColorStop(0.88, '#f8e4b8'); gr.addColorStop(1, '#efd6a2');
  q.fillStyle = gr; q.beginPath(); q.arc(256, 256, 190, 0, 6.283); q.fill();
  for (const [dx, dy, r, a] of [[-70, -60, 36, 0.15], [62, -18, 27, 0.12], [28, 82, 42, 0.11], [-92, 62, 22, 0.11], [92, 72, 16, 0.1], [-18, -112, 18, 0.1], [112, -88, 14, 0.09], [-40, 20, 12, 0.08]]) {
    gr = q.createRadialGradient(256 + dx, 256 + dy, 0, 256 + dx, 256 + dy, r); gr.addColorStop(0, 'rgba(222,190,140,' + a + ')'); gr.addColorStop(1, 'rgba(222,190,140,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(256 + dx, 256 + dy, r, 0, 6.283); q.fill();
  }
  q.strokeStyle = 'rgba(255,255,255,0.6)'; q.lineWidth = 4; q.beginPath(); q.arc(256, 256, 186, Math.PI * 0.95, Math.PI * 1.62); q.stroke();
  // uykulu, gülen yüz (dunya11 ayıyla aynı dil): diskin üst yarısında (biniciler alt yarısından geçer)
  q.strokeStyle = 'rgba(196,150,96,0.75)'; q.lineWidth = 7; q.lineCap = 'round';
  q.beginPath(); q.arc(206, 168, 22, Math.PI * 0.15, Math.PI * 0.85); q.moveTo(306 + Math.cos(Math.PI * 0.15) * 22, 168 + Math.sin(Math.PI * 0.15) * 22); q.arc(306, 168, 22, Math.PI * 0.15, Math.PI * 0.85); q.stroke();   // kapalı gözler (aşağı kavis)
  q.beginPath(); q.arc(256, 196, 26, Math.PI * 0.2, Math.PI * 0.8); q.stroke();   // gülümseme
  q.fillStyle = 'rgba(255,150,170,0.28)'; q.beginPath(); q.arc(178, 204, 20, 0, 6.283); q.arc(334, 204, 20, 0, 6.283); q.fill();
  return (uc11Art.ay = c);
}
function uc11BulutArt(k) {   // yumuşak lila bulut tutamı: 300×150 birim, taban ortası (150,124); üstü ay ışığı alır
  const ad = 'b' + k; if (uc11Art[ad]) return uc11Art[ad];
  const { c, q } = uc11Tuval(300, 150, 1.3), r = rng(311 + k * 17), T0 = [], n = 6 + k;
  for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, e = Math.sin(Math.PI * u); T0.push([32 + u * 236 + (r() - 0.5) * 14, 116 - e * (32 + r() * 22), 20 + e * 28 + r() * 10]); }
  const yol = dk => { q.beginPath(); for (const [x, y, rr] of T0) { q.moveTo(x + rr + dk, y); q.arc(x, y, rr + dk, 0, 6.283); } q.rect(26 - dk, 100 - dk, 248 + dk * 2, 24 + dk); };
  q.fillStyle = 'rgba(200,180,255,0.16)'; yol(9); q.fill();   // yumuşak dış pus
  let gr = q.createLinearGradient(0, 20, 0, 126); gr.addColorStop(0, '#f3edff'); gr.addColorStop(0.45, '#cdbaf4'); gr.addColorStop(1, '#8c78cf');
  q.fillStyle = gr; yol(0); q.fill();
  q.strokeStyle = 'rgba(255,255,255,0.5)'; q.lineWidth = 2.4; q.beginPath();   // ay ışığı alan üst kenarlar
  for (const [x, y, rr] of T0) { q.moveTo(x + Math.cos(Math.PI * 1.18) * (rr - 2), y + Math.sin(Math.PI * 1.18) * (rr - 2)); q.arc(x, y, rr - 2, Math.PI * 1.18, Math.PI * 1.72); }
  q.stroke();
  gr = q.createLinearGradient(0, 96, 0, 126); gr.addColorStop(0, 'rgba(110,88,190,0)'); gr.addColorStop(1, 'rgba(90,70,170,0.35)'); q.fillStyle = gr; q.fillRect(20, 96, 260, 30);
  // hacim: her tutamın altında yumuşak öz gölge (komşusunun üstüne düşer), üst-solunda ay ışığı kubbesi → pamuk gibi dolgun
  q.save(); yol(0); q.clip();
  for (let i = 0; i < T0.length; i++) {
    const [x, y, rr] = T0[i];
    gr = q.createRadialGradient(x, y + rr * 0.9, rr * 0.2, x, y + rr * 0.4, rr * 1.25); gr.addColorStop(0, 'rgba(88,66,168,0.3)'); gr.addColorStop(1, 'rgba(88,66,168,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(x, y + rr * 0.4, rr * 1.25, 0, 6.283); q.fill();
  }
  for (let i = 0; i < T0.length; i++) {
    const [x, y, rr] = T0[i];
    gr = q.createRadialGradient(x - rr * 0.3, y - rr * 0.38, 0, x - rr * 0.2, y - rr * 0.25, rr * 0.85); gr.addColorStop(0, 'rgba(255,255,255,0.7)'); gr.addColorStop(0.5, 'rgba(246,240,255,0.28)'); gr.addColorStop(1, 'rgba(246,240,255,0)');
    q.fillStyle = gr; q.beginPath(); q.arc(x - rr * 0.2, y - rr * 0.25, rr * 0.85, 0, 6.283); q.fill();
  }
  q.restore();
  return (uc11Art[ad] = { c, w: 300, h: 150, ax: 150, ay: 124 });
}
// ── yakın şato parçaları (ışıkları yanmış, eğri büğrü, pastel taş): anchor = gövdenin üst ortası; çatılar yukarı, gövde aşağı ──
const UC11_KW = [150, 250, 104, 196];   // parça genişlikleri (saçaklar dahil, yerleşim için)
const UC11_GOV = 470;                   // gövdenin sprite içindeki boyu (ekranın dibine yeter)
function uc11Govde(q, x0, x1, y0, y1, ton, eg) {   // pastel taş gövde: sol aydınlık, sağ gölgeli, yumuşak taş sıraları
  q.save(); q.transform(1, 0, eg || 0, 1, 0, 0);
  q.fillStyle = '#251d52'; q.fillRect(x0 - 3, y0 - 2, x1 - x0 + 6, y1 - y0 + 2);
  const gr = q.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, ton[0]); gr.addColorStop(0.42, ton[1]); gr.addColorStop(1, ton[2]);
  q.fillStyle = gr; q.fillRect(x0, y0, x1 - x0, y1 - y0);
  q.strokeStyle = 'rgba(37,29,82,0.2)'; q.lineWidth = 1.6;
  for (let y = y0 + 28, i = 0; y < y1; y += 28, i++) { q.beginPath(); q.moveTo(x0 + 2, y); q.lineTo(x1 - 2, y); q.stroke(); q.beginPath(); for (let x = x0 + (i % 2 ? 20 : 6); x < x1 - 6; x += 32) { q.moveTo(x, y - 28); q.lineTo(x, y); } q.stroke(); }
  q.fillStyle = 'rgba(234,244,255,0.22)'; q.fillRect(x0, y0, 6, y1 - y0);   // ay ışığı alan sol kenar
  const sg = q.createLinearGradient(0, y0 + 260, 0, y1); sg.addColorStop(0, 'rgba(58,44,116,0)'); sg.addColorStop(1, 'rgba(42,33,88,0.6)'); q.fillStyle = sg; q.fillRect(x0 - 3, y0 + 260, x1 - x0 + 6, y1 - y0 - 260);   // aşağıda gece
  q.restore();
}
function uc11Pencere(q, x, y, r, tip) {   // ışıklı yuvarlak pencere (tip 0 haç kayıtlı, 1 vitray gül pencere)
  q.fillStyle = '#251d52'; q.beginPath(); q.arc(x, y, r + 3.2, 0, 6.283); q.fill();
  q.fillStyle = '#ece0ff'; q.beginPath(); q.arc(x, y, r + 1.8, 0, 6.283); q.fill();
  const gr = q.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r); gr.addColorStop(0, '#fff7dc'); gr.addColorStop(0.6, '#ffe08a'); gr.addColorStop(1, '#ffc46b');
  q.fillStyle = gr; q.beginPath(); q.arc(x, y, r, 0, 6.283); q.fill();
  if (tip === 1) {
    for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; q.fillStyle = ['#ffb3d1', '#c39bff', '#9ff0d0', '#a9c8ff', '#ffe7a8', '#ff9fc4'][i]; q.beginPath(); q.ellipse(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.36, r * 0.21, a, 0, 6.283); q.fill(); }
    q.fillStyle = '#fff7dc'; q.beginPath(); q.arc(x, y, r * 0.24, 0, 6.283); q.fill();
    q.strokeStyle = 'rgba(80,50,120,0.45)'; q.lineWidth = 1.2; q.beginPath(); q.arc(x, y, r, 0, 6.283); q.stroke();
  } else { q.strokeStyle = '#8a6070'; q.lineWidth = Math.max(1.2, r * 0.14); q.beginPath(); q.moveTo(x - r, y); q.lineTo(x + r, y); q.moveTo(x, y - r); q.lineTo(x, y + r); q.stroke(); }
  q.fillStyle = 'rgba(255,255,255,0.55)'; q.beginPath(); q.ellipse(x - r * 0.4, y - r * 0.45, r * 0.25, r * 0.13, -0.6, 0, 6.283); q.fill();
}
function uc11Kemer(q, x, y, w, h) {   // ışıklı kemerli pencere ((x,y) alt orta)
  q.fillStyle = '#251d52'; q.beginPath(); q.moveTo(x - w / 2 - 3, y + 2); q.lineTo(x - w / 2 - 3, y - h + w / 2); q.arc(x, y - h + w / 2, w / 2 + 3, Math.PI, 0); q.lineTo(x + w / 2 + 3, y + 2); q.fill();
  const gr = q.createLinearGradient(0, y - h, 0, y); gr.addColorStop(0, '#fff7dc'); gr.addColorStop(1, '#ffc46b');
  q.fillStyle = gr; q.beginPath(); q.moveTo(x - w / 2, y); q.lineTo(x - w / 2, y - h + w / 2); q.arc(x, y - h + w / 2, w / 2, Math.PI, 0); q.lineTo(x + w / 2, y); q.fill();
  q.strokeStyle = '#8a6070'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(x, y); q.lineTo(x, y - h); q.moveTo(x - w / 2, y - h * 0.45); q.lineTo(x + w / 2, y - h * 0.45); q.stroke();
  q.fillStyle = '#c9b2ff'; q.fillRect(x - w / 2 - 5, y, w + 10, 4);   // denizlik
}
function uc11Kiremit(q, yolFn, x0, x1, y0, y1, col) {   // çatıya pul pul kiremit (kırpılmış yaylar)
  q.save(); yolFn(); q.clip(); q.strokeStyle = col; q.lineWidth = 1.8;
  for (let y = y0, i = 0; y < y1; y += 13, i++) { q.beginPath(); for (let x = x0 + (i % 2 ? 7 : 0); x < x1; x += 14) { q.moveTo(x - 7, y); q.arc(x, y, 7, Math.PI, 0, true); } q.stroke(); }
  q.restore();
}
function uc11KuleArt(k) {   // { c, w, h, ax, ay, pen: [[x, y, r, tip]], bay: [x, y] | null, sa: [x, y], sb: [x, y] } (birim, anchor'a göre)
  const ad = 'k' + k; if (uc11Art[ad]) return uc11Art[ad];
  const tonlar = [['#c4b4f0', '#a894e0', '#7c68c0'], ['#d6c2ee', '#b8a0dc', '#8a70bc'], ['#bfc6f2', '#a0a8e2', '#7480c4'], ['#e2c6e8', '#c8a6d6', '#9c78b4']];
  const ton = tonlar[k];
  const A = { pen: [], bay: null };
  let w, ust;
  if (k === 0) { w = 112; ust = 172; }        // yuvarlak kule + kıvrık uçlu pembe külah
  else if (k === 1) { w = 210; ust = 140; }   // geniş çatı + çatı penceresi + yarasa rüzgârgülü
  else if (k === 2) { w = 74; ust = 196; }    // ince eğri kule + soğan kubbe + flama
  else { w = 168; ust = 62; }                 // yuvarlak dişli burç + gül pencere
  const pad = 30, W0 = w + pad * 2 + 30, H0 = ust + UC11_GOV + 10;
  const { c, q } = uc11Tuval(W0, H0, 1.4);
  const ax = W0 / 2, ay = ust + 4;
  q.translate(ax, ay);
  if (k === 0) {
    uc11Govde(q, -w / 2, w / 2, 0, UC11_GOV, ton, 0);
    const cat = () => { q.beginPath(); q.moveTo(-w / 2 - 16, 8); q.quadraticCurveTo(-w * 0.3, -ust * 0.35, -6, -ust + 16); q.quadraticCurveTo(10, -ust - 10, 34, -ust - 6); q.quadraticCurveTo(14, -ust + 4, 8, -ust + 22); q.quadraticCurveTo(w * 0.3, -ust * 0.3, w / 2 + 16, 8); q.quadraticCurveTo(0, 18, -w / 2 - 16, 8); q.closePath(); };
    q.lineWidth = 6; q.strokeStyle = '#251d52'; cat(); q.stroke();
    let gr = q.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, '#ffd2e4'); gr.addColorStop(0.45, '#ffa6c8'); gr.addColorStop(1, '#d97aa8'); q.fillStyle = gr; cat(); q.fill();
    uc11Kiremit(q, cat, -w / 2 - 20, w / 2 + 20, -ust + 30, 14, 'rgba(255,255,255,0.28)');
    q.fillStyle = 'rgba(255,255,255,0.25)'; q.beginPath(); q.moveTo(-w / 2 - 10, 6); q.quadraticCurveTo(-w * 0.3, -ust * 0.35, -6, -ust + 18); q.quadraticCurveTo(-w * 0.12, -ust * 0.4, -w * 0.2, 4); q.closePath(); q.fill();   // ay ışığı alan yüz
    q.fillStyle = '#ffe27a'; uc11Yildiz5(q, 36, -ust - 7, 8, 0.5); q.fill();
    q.fillStyle = '#b8507e'; q.beginPath(); q.ellipse(0, 9, w / 2 + 14, 7, 0, 0, Math.PI); q.fill();   // saçak
    uc11Pencere(q, -14, 66, 15, 0); uc11Pencere(q, 18, 150, 12, 0); uc11Kemer(q, -10, 250, 22, 40);
    A.pen.push([-14, 66, 15], [18, 150, 12], [-10, 232, 14]); A.sa = [-w / 2 - 12, 8]; A.sb = [w / 2 + 12, 8];
  } else if (k === 1) {
    uc11Govde(q, -w / 2, w / 2, 0, UC11_GOV, ton, 0);
    const cat = () => { q.beginPath(); q.moveTo(-w / 2 - 18, 8); q.quadraticCurveTo(-w * 0.22, -ust * 0.95, 0, -ust); q.quadraticCurveTo(w * 0.22, -ust * 0.95, w / 2 + 18, 8); q.quadraticCurveTo(0, 16, -w / 2 - 18, 8); q.closePath(); };
    q.lineWidth = 6; q.strokeStyle = '#251d52'; cat(); q.stroke();
    let gr = q.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, '#8e72d8'); gr.addColorStop(0.45, '#6a4fb8'); gr.addColorStop(1, '#4b3a8c'); q.fillStyle = gr; cat(); q.fill();
    uc11Kiremit(q, cat, -w / 2 - 20, w / 2 + 20, -ust + 14, 14, 'rgba(217,200,255,0.3)');
    q.fillStyle = 'rgba(234,244,255,0.16)'; q.beginPath(); q.moveTo(-w / 2 - 12, 6); q.quadraticCurveTo(-w * 0.22, -ust * 0.95, 0, -ust + 2); q.quadraticCurveTo(-w * 0.2, -ust * 0.5, -w * 0.3, 4); q.closePath(); q.fill();
    // çatı penceresi (küçük kemerli şapka altında yuvarlak pencere)
    q.fillStyle = '#4b3a8c'; q.beginPath(); q.moveTo(-26, -ust * 0.36 + 18); q.quadraticCurveTo(0, -ust * 0.36 - 40, 26, -ust * 0.36 + 18); q.closePath(); q.fill();
    q.strokeStyle = '#251d52'; q.lineWidth = 3; q.stroke();
    uc11Pencere(q, 0, -ust * 0.36 + 6, 12, 0); A.pen.push([0, -ust * 0.36 + 6, 12]);
    // yarasa rüzgârgülü (tepe)
    q.strokeStyle = '#251d52'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, -ust + 2); q.lineTo(0, -ust - 30); q.stroke();
    q.fillStyle = '#c39bff'; q.beginPath(); q.arc(0, -ust - 34, 6, 0, 6.283); q.fill();
    for (const sd of [-1, 1]) { q.beginPath(); q.moveTo(sd * 4, -ust - 36); q.quadraticCurveTo(sd * 14, -ust - 46, sd * 22, -ust - 38); q.quadraticCurveTo(sd * 17, -ust - 34, sd * 15, -ust - 30); q.quadraticCurveTo(sd * 11, -ust - 33, sd * 4, -ust - 31); q.closePath(); q.fill(); }
    q.fillStyle = '#251d52'; q.beginPath(); q.arc(-2.2, -ust - 35, 1.2, 0, 6.283); q.arc(2.2, -ust - 35, 1.2, 0, 6.283); q.fill();
    q.fillStyle = '#3a2c74'; q.beginPath(); q.ellipse(0, 9, w / 2 + 16, 7, 0, 0, Math.PI); q.fill();
    uc11Kemer(q, -60, 100, 26, 52); uc11Kemer(q, 0, 100, 26, 52); uc11Kemer(q, 60, 100, 26, 52); uc11Pencere(q, -40, 190, 13, 0); uc11Pencere(q, 44, 200, 13, 0);
    A.pen.push([-60, 80, 16], [0, 80, 16], [60, 80, 16], [-40, 190, 13], [44, 200, 13]); A.sa = [-w / 2 - 14, 8]; A.sb = [w / 2 + 14, 8];
  } else if (k === 2) {
    uc11Govde(q, -w / 2, w / 2, 0, UC11_GOV, ton, -0.05);
    const kub = () => { q.beginPath(); q.moveTo(-w / 2 - 10, 6); q.bezierCurveTo(-w * 1.05, -ust * 0.42, -w * 0.3, -ust * 0.72, 0, -ust + 30); q.bezierCurveTo(w * 0.3, -ust * 0.72, w * 1.05, -ust * 0.42, w / 2 + 10, 6); q.quadraticCurveTo(0, 14, -w / 2 - 10, 6); q.closePath(); };
    q.lineWidth = 6; q.strokeStyle = '#251d52'; kub(); q.stroke();
    let gr = q.createLinearGradient(-w, 0, w, 0); gr.addColorStop(0, '#e6d8ff'); gr.addColorStop(0.42, '#c39bff'); gr.addColorStop(1, '#8a66d8'); q.fillStyle = gr; kub(); q.fill();
    q.strokeStyle = 'rgba(255,255,255,0.35)'; q.lineWidth = 2; for (const sx of [-0.5, 0, 0.5]) { q.beginPath(); q.moveTo(sx * w * 0.6, 4); q.quadraticCurveTo(sx * w * 0.9, -ust * 0.4, 0, -ust + 32); q.stroke(); }
    q.strokeStyle = '#ffd27a'; q.lineWidth = 5; q.beginPath(); q.ellipse(0, 2, w / 2 + 8, 5, 0, 0, Math.PI); q.stroke();   // altın bant
    q.strokeStyle = '#251d52'; q.lineWidth = 3; q.beginPath(); q.moveTo(0, -ust + 32); q.lineTo(0, -ust - 18); q.stroke();
    q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(0, -ust + 30, 4.5, 0, 6.283); q.fill();
    uc11Pencere(q, 0, 70, 18, 1); uc11Pencere(q, -4, 170, 10, 0);
    A.pen.push([0, 70, 18], [-4, 170, 10]); A.bay = [0, -ust - 16]; A.sa = [-w / 2 - 8, 6]; A.sb = [w / 2 + 8, 6];
  } else {
    uc11Govde(q, -w / 2, w / 2, 0, UC11_GOV, ton, 0);
    // yuvarlak dişli burç: üstte tombul, yuvarlak dişler; altında taş korkuluk şeridi
    const n = 5, dw = w / (n * 2 - 1);
    q.fillStyle = '#251d52'; q.fillRect(-w / 2 - 6, -4, w + 12, 18);
    q.fillStyle = ton[0]; q.fillRect(-w / 2 - 3, -2, w + 6, 14);
    for (let i = 0; i < n; i++) { const x = -w / 2 + dw * (i * 2) + dw / 2; q.fillStyle = '#251d52'; q.beginPath(); q.moveTo(x - dw / 2 - 3, 0); q.lineTo(x - dw / 2 - 3, -ust * 0.55); q.arc(x, -ust * 0.55, dw / 2 + 3, Math.PI, 0); q.lineTo(x + dw / 2 + 3, 0); q.fill(); q.fillStyle = i % 2 ? ton[1] : ton[0]; q.beginPath(); q.moveTo(x - dw / 2, 0); q.lineTo(x - dw / 2, -ust * 0.55); q.arc(x, -ust * 0.55, dw / 2, Math.PI, 0); q.lineTo(x + dw / 2, 0); q.fill(); q.fillStyle = 'rgba(234,244,255,0.3)'; q.beginPath(); q.arc(x - dw * 0.15, -ust * 0.6, dw * 0.22, 0, 6.283); q.fill(); }
    // burcun önünde sarkan ay işlemeli küçük sancak
    q.fillStyle = '#3a2c74'; q.beginPath(); q.moveTo(-26, 16); q.lineTo(26, 16); q.lineTo(26, 92); q.lineTo(0, 78); q.lineTo(-26, 92); q.closePath(); q.fill();
    q.strokeStyle = '#ffd27a'; q.lineWidth = 2.4; q.stroke();
    q.fillStyle = '#fff4d6'; q.beginPath(); q.arc(2, 46, 13, 0, 6.283); q.fill(); q.fillStyle = '#3a2c74'; q.beginPath(); q.arc(8, 41, 11, 0, 6.283); q.fill();   // hilal
    uc11Pencere(q, -50, 150, 20, 1); uc11Pencere(q, 48, 140, 13, 0); uc11Kemer(q, 46, 250, 22, 42);
    A.pen.push([-50, 150, 20], [48, 140, 13], [46, 230, 14]); A.sa = [-w / 2 - 2, -ust * 0.3]; A.sb = [w / 2 + 2, -ust * 0.3];
  }
  A.c = c; A.w = W0; A.h = H0; A.ax = ax; A.ay = ay;
  return (uc11Art[ad] = A);
}
function uc11OnSeritArt() {   // ön plan: hızla akan koyu şato siluetleri şeridi (1600 birim, döşenebilir), birkaç sıcak pencere
  if (uc11Art.on) return uc11Art.on;
  const w = 1600, h = 170, { c, q } = uc11Tuval(w, h, 1), r = rng(4747);
  q.fillStyle = 'rgba(24,18,52,0.94)';
  q.fillRect(0, 110, w, 60);
  for (let x = 0; x < w; x += 40) { q.beginPath(); q.moveTo(x, 112); q.lineTo(x, 96); q.arc(x + 12, 96, 12, Math.PI, 0); q.lineTo(x + 24, 112); q.fill(); }   // yuvarlak dişli sur
  const kuleler = [];
  for (let x = 120; x < w - 80; x += 260 + r() * 160) kuleler.push([x, 40 + r() * 40, 46 + r() * 30]);
  for (const [x, ty, kw] of kuleler) {
    q.fillRect(x - kw / 2, ty, kw, h - ty);
    q.beginPath(); q.moveTo(x - kw / 2 - 10, ty + 4); q.quadraticCurveTo(x - kw * 0.2, ty - 30, x, ty - 56); q.quadraticCurveTo(x + 12, ty - 66, x + 22, ty - 60); q.quadraticCurveTo(x + 8, ty - 52, x + 6, ty - 46); q.quadraticCurveTo(x + kw * 0.25, ty - 24, x + kw / 2 + 10, ty + 4); q.closePath(); q.fill();
  }
  q.fillStyle = 'rgba(255,210,122,0.85)';
  for (const [x, ty, kw] of kuleler) { q.beginPath(); q.arc(x, ty + 30, kw * 0.14, 0, 6.283); q.fill(); }
  q.fillStyle = 'rgba(195,155,255,0.35)'; for (const [x, ty, kw] of kuleler) q.fillRect(x - kw / 2, ty + 2, 3, h - ty);   // ay ışığı kenar
  return (uc11Art.on = { c, w, h });
}

// ── sanal yol: şerit, hız ──
function uc11Tablo(A, v) { if (!(v > 0)) return A[0]; const f = v / 10, i = f | 0; if (i >= A.length - 1) return A[A.length - 1]; const u = f - i; return A[i] + (A[i + 1] - A[i]) * u; }
function uc11Serit(o, v) { return uc11Tablo(o.LN, v); }   // Feza'nın (ayak) şerit yüksekliği (dünya y)
function uc11SeritKur(o) {
  const n = Math.ceil((UC11_LV + 1600) / 10) + 2, A = new Float32Array(n), y0 = o.y, yI = o.K.gy - 60;
  for (let i = 0; i < n; i++) {
    const v = i * 10; let y = y0;
    y += (330 - y0) * smooth(clamp(v / 1100, 0, 1));                                            // kalkış: balkondan ay ışığına
    y += 26 * Math.sin((v - 1100) / 540) * smooth(clamp((v - 1100) / 500, 0, 1)) * (1 - smooth(clamp((v - 3300) / 500, 0, 1)));   // bulut aralıklarında dalga
    y += (292 - 330) * smooth(clamp((v - 3300) / 1200, 0, 1));                                 // aya doğru yükseliş
    y += (352 - 292) * smooth(clamp((v - (UC11_AY_V + 700)) / 1400, 0, 1));                     // ışıklı şatonun üstüne süzülüş
    y += 20 * Math.sin((v - 6400) / 600) * smooth(clamp((v - 6400) / 600, 0, 1)) * (1 - smooth(clamp((v - (UC11_INISV - 500)) / 500, 0, 1)));
    y += (yI - 352) * smooth(clamp((v - (UC11_LV - 1800)) / 1800, 0, 1));                       // kule terasına alçalış
    A[i] = y;
  }
  o.LN = A;
}
function uc11AyW(v) { const a = (v - UC11_AY_V) / (UC11_AY_W * 1.15); return Math.abs(a) < 1 ? Math.pow(Math.cos(a * Math.PI / 2), 2) : 0; }   // ay anı ağırlığı
function uc11HizH(v) {
  let s = lerp(UC11_V0, UC11_VS, smooth(clamp((v - (UC11_AY_V + 300)) / 1200, 0, 1)));
  const a = (v - UC11_AY_V) / UC11_AY_W; if (Math.abs(a) < 1) s = lerp(s, UC11_VAY, Math.pow(Math.cos(a * Math.PI / 2), 2));
  return lerp(s, UC11_VI, smooth(clamp((v - UC11_INISV) / 1500, 0, 1)));
}
function uc11DiziKur(o) {   // damlalar ve yıldızlar: { v, lift, tip, d: 'bekle'|'alindi'|'kacti', t, m (mıknatıs), ... }
  const L = [];
  const ekle = (v, lift, tip) => L.push({ v, lift, tip, d: 'bekle', t: 0, m: 0, faz: L.length * 1.37, rx: 0, ry: 0, wy: 0 });
  for (const D0 of UC11_DIZI) {
    const [b, v, tip, h] = D0;
    if (b === 'cizgi') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h, tip);
    else if (b === 'yay') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * Math.sin(Math.PI * i / (D0[4] - 1)), tip);
    else if (b === 'dalga') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * (i % 2 ? 1 : -1), tip);
    else if (b === 'merdiven') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * i, tip);
    else if (b === 'halka') { ekle(v, h, 'd'); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832 + 0.52; ekle(v + Math.cos(a) * D0[4], h + Math.sin(a) * D0[4], 'y'); } }
  }
  L.sort((a, b) => a.v - b.v);
  o.dizi = L; o.top = L.length;
}
function uc11BulutKur(o) {   // yakın bulut tutamları: üst ve alt kuşak (aralarından geçilir), ara sıra içinden geçilen yarı saydam tutam
  const r = rng(1111), B = [];
  for (let v = 280; v < UC11_LV - 1000;) {
    const sato = v > UC11_SATO0 - 300, ay = Math.abs(v - UC11_AY_V) < UC11_AY_W * 0.93;
    if (!ay || r() < 0.35) B.push({ v: v + r() * 120, lift: 200 + r() * 110, s: 0.7 + r() * 0.5, k: (r() * 3) | 0, a: 0.5 + r() * 0.25, on: false, ac: 0 });
    if (!sato && !ay) B.push({ v: v + 120 + r() * 160, lift: -160 - r() * 80, s: 0.8 + r() * 0.5, k: (r() * 3) | 0, a: 0.55 + r() * 0.25, on: false, ac: 0 });
    if (!sato && !ay && v > 700 && r() < 0.55) B.push({ v: v + 250 + r() * 100, lift: 20 + r() * 50, s: 0.55 + r() * 0.25, k: (r() * 3) | 0, a: 0.55, on: true, ac: 0 });
    v += sato ? 560 + r() * 280 : 340 + r() * 220;
  }
  B.sort((a, b) => a.v - b.v);
  o.bulut = B;
}
function uc11SatoKur(o) {   // yakın şato parçaları (sanal konumda): tepeleri şeridin altında; aralarında bayrak süsü
  const r = rng(2222), L = [];
  let v = UC11_SATO0, son = -1;
  while (v < UC11_SATO1) {
    let k = (r() * 4) | 0; if (k === son) k = (k + 1 + ((r() * 3) | 0)) % 4; son = k;
    const s = 0.76 + r() * 0.22, w = UC11_KW[k] * s;
    L.push({ v: v + w / 2, k, s, y: uc11Serit(o, v + w / 2) + 150 + r() * 60, f: r() * 6, c: (r() * 5) | 0, ip: r() < 0.7 });
    v += w + 14 + r() * 80;
  }
  o.sato = L;
}
// ── parçacık havuzu (sanal konumda; karede ayırma yok) ──
const UC11_TOZN = 220, uc11Toz = []; for (let i = 0; i < UC11_TOZN; i++) uc11Toz.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, c: 0, s: 1, g: 0 });
let uc11TozI = 0;
function uc11DX() { const o = UCUS11.o; return o && P.ucus === o ? o.dx || 0 : 0; }   // uçuşta sanal, yoksa dünya
function uc11TozAt(wx, wy, vx, vy, life, ci, s, gr) { const p = uc11Toz[uc11TozI]; uc11TozI = (uc11TozI + 1) % UC11_TOZN; p.x = wx - uc11DX(); p.y = wy; p.vx = vx; p.vy = vy; p.l = p.m = life; p.c = ci; p.s = s; p.g = gr === undefined ? 20 : gr; }
function uc11TozPatla(x, y, n, hiz, ci0) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.35 + Math.random() * 0.75); uc11TozAt(x, y, Math.cos(a) * v, Math.sin(a) * v * 0.85 - 18, 0.7 + Math.random() * 0.8, ci0 === undefined ? i % UC11_TOZ.length : ci0, 2 + Math.random() * 3); } }
// pelerinden dökülen yıldız izi (topladıkça sıklaşır, büyür) ve 10'da bir kombo kutlaması (sabit havuz)
const UC11_YIZ = []; for (let i = 0; i < 40; i++) UC11_YIZ.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, s: 1, r: 0 });
let uc11YizI = 0;
const UC11_KOMBO = { t: 0, x: 0, y: 0 };
function uc11YizAt(wx, wy, s) { const p = UC11_YIZ[uc11YizI]; uc11YizI = (uc11YizI + 1) % UC11_YIZ.length; p.x = wx - uc11DX(); p.y = wy; p.vx = -40 - Math.random() * 40; p.vy = 10 + Math.random() * 16; p.l = p.m = 0.9 + Math.random() * 0.5; p.s = s; p.r = Math.random() * 6.28; }
function uc11YizCiz(ddx) {
  const yA = uc11YildizArt();
  for (const p of UC11_YIZ) { if (p.l <= 0) continue; const u = p.l / p.m, r = p.s * (0.5 + 0.5 * u), x = p.x + ddx; if (x < cam.x - 40 || x > cam.x + VW + 40) continue;
    g.globalAlpha = Math.min(1, u * 1.5); const M = g.getTransform(); g.translate(x, p.y); g.rotate(p.r + (1 - u) * 2); g.drawImage(yA, -r, -r, r * 2, r * 2); g.setTransform(M); }
  g.globalAlpha = 1;
  const K = UC11_KOMBO; if (K.t <= 0) return;
  const u = 1 - K.t, R = 30 + 150 * (1 - Math.pow(1 - u, 2.4)), f = K.t, x = P.x + 6, y = P.y - UC11_GOGUS;
  g.globalCompositeOperation = 'lighter';
  dglow('#ffe7a8', x, y, 120 + 80 * u, f * 0.55);
  const z = cam.zoom || 1; dglow('#eaf4ff', cam.x + VW / z / 2, cam.y + VH / z * 0.45, VW / z * 0.7, f * 0.16);   // kısa ekran parıltısı
  g.globalAlpha = f * 0.9; g.strokeStyle = '#ffe7a8'; g.lineWidth = 5 * f + 1; g.beginPath(); g.arc(x, y, R, 0, 6.283); g.stroke();
  g.globalAlpha = f * 0.6; g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, R * 0.8, 0, 6.283); g.stroke();
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283 + u * 1.5, rr = 14 * (1 - u * 0.5) * (i % 2 ? 0.7 : 1); g.globalAlpha = Math.min(1, f * 1.6); g.drawImage(yA, x + Math.cos(a) * R - rr, y + Math.sin(a) * R - rr, rr * 2, rr * 2); }
  g.globalAlpha = 1;
}
function uc11TozAdim(dt) {
  for (const p of UC11_YIZ) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= Math.exp(-dt * 1.2); }
  UC11_KOMBO.t = Math.max(0, UC11_KOMBO.t - dt / 1.1); const k = Math.exp(-dt * 1.6); for (let i = 0; i < UC11_TOZN; i++) { const p = uc11Toz[i]; if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= k; p.vy = p.vy * k + p.g * dt; } }

// ── kurulum ──
function uc11Kur(o) {
  const B = (typeof BOLUM !== 'undefined' && (BOLUM.kule || BOLUM.ucus)) || {};
  const al = k => Number.isFinite(B[k]) ? B[k] : null;
  const inisX = al('inisX') !== null ? al('inisX') : al('x1') !== null ? al('x1') : o.x + 166 * T;
  const gy = al('inisY') !== null ? al('inisY') : o.y;
  o.K = { inisX, gy, xs: o.x, xEnd: inisX - 90, r: 0.5, yUst: al('yUst') !== null ? al('yUst') : o.y - 440, yAlt: al('yAlt') !== null ? al('yAlt') : o.y + 160 };
  o.faz = 'bekle'; o.hazir = false; o.done = false; o.t = 0; o.total = 0; o.ft = 0; o.tk = { bitti: false };
  o.v = 0; o.vOn = 0; o.vD = 0; o.dx = o.x; o.dxOn = o.x; o.ddx = o.x; o.spd = 0; o.off = 0; o.uV = 0; o.bas = false; o.idle = 0; o.yardimA = 0;
  o.bx = o.x; o.by = o.y; o.byOn = o.y; o.rot = 0; o.bob = 0; o.acik = 0; o.pX = o.pXOn = o.x; o.pY = o.pYOn = o.y; o.ex = 0; o.ey = 0;
  o.n = 0; o.parla = 0; o.sevT = 0; o.vinT = 0; o.yTk = 5; o.izT = 0; o.olay = {}; o.kor = null; o.korEski = null; o.kamY = o.y; o.indi = false;
  o.ay = { x: 0, y: 0, r: 0, a: 0, w: 0, ort: 1 }; o.yuk = 0; o.cirp = 0; o.silA = 0; o.salla = 0; o.huzme = 0;
  o.yar = []; for (let i = 0; i < 5; i++) o.yar.push({ x: o.x + 30 + i * 22, y: o.y - 150 - (i % 2) * 30, f: i * 1.7, tk: 0, a: 1 });
  o.vela = { x: o.x + 86, y: o.y, el: 0, kik: 0, a: 1, pel: 0.15 };
  o.pr = { x: o.x - 60, y: o.y - 90, tk: 0, tkYon: 1 };
  o.fzOpt = { acik: 0, vy: 0, ruzgar: 0, el: 0, sevinc: 0, aci: 0 };
  o.vOpt = { yon: 1, poz: 'dur', pelerin: 0.15, mutlu: 1, el: 0, agiz: 0, kirp: 0 };
  o.yOpt = { kanat: 0.5, yon: 1, mutlu: 1 };
  o.pOpt = { salla: 0, sevinc: 0 };
  uc11SeritKur(o); uc11DiziKur(o); uc11BulutKur(o); uc11SatoKur(o);
  o.adim = (dt, G) => uc11Adim(o, dt, G);
  if (typeof BOLUM !== 'undefined') BOLUM.ucusTop = o.top;
  UCUS11.o = o;
}
const UC11_ISIT = [['d', uc11DamlaArt], ['y', uc11YildizArt], ['ay', uc11AyArt], ['on', uc11OnSeritArt], ['b0', () => uc11BulutArt(0)], ['b1', () => uc11BulutArt(1)], ['b2', () => uc11BulutArt(2)],
  ['k0', () => uc11KuleArt(0)], ['k1', () => uc11KuleArt(1)], ['k2', () => uc11KuleArt(2)], ['k3', () => uc11KuleArt(3)]];
function uc11Isit() {   // ağır önbellekleri karelere yay: balkona yaklaşınca her karede biri; hepsi hazırsa true
  for (const [k, f] of UC11_ISIT) if (!uc11Art[k]) { f(); return false; }
  for (let i = 0; i < UC11_TOZ.length; i++) if (!uc11Art['z' + i]) { uc11TozArt(i); return false; }
  return true;
}
function uc11HazirMi() {
  const V = uc11V(); if (!V) return true;
  if (V.pasta) return true;
  return !TUR.al('pastaMini') || !NESNELER.some(n => n.tip === 'pastaMini');   // pasta yüklenemediyse balkon baştan hazır
}
// ── balkonda bekleyiş: Vela el sallar, yarasalar balkonun üstünde süzülür ──
function uc11BekleEslik(o, dt) {
  const yakin = Math.abs(P.x - o.x) < 640, V = o.vela;
  V.x = o.x + 86; V.y = o.y; V.el = lerp(V.el, yakin && o.hazir ? 1 : 0, 1 - Math.exp(-dt * 3)); V.pel = 0.15;
  for (let i = 0; i < 5; i++) {
    const Y = o.yar[i]; Y.f += dt * (9 + i * 0.6);
    const an = o.t * (0.55 + i * 0.07) + i * 1.26, hx = o.x + 50 + Math.cos(an) * (70 + i * 9), hy = o.y - 170 + Math.sin(an * 1.3) * 34 - (i % 2) * 26;
    const k = 1 - Math.exp(-dt * 2); Y.x = lerp(Y.x, hx, k); Y.y = lerp(Y.y, hy, k); Y.a = 1;
  }
}
function uc11Basla(o) {
  if (!o || o.done || o.faz !== 'bekle' || P.ucus || DURUM !== 'oyun') return;
  while (!uc11Isit());   // eksik önbellek kalmasın
  const K = o.K;
  o.faz = 'acil'; o.t = 0; o.total = 0; o.yuk = 0; o.cirp = 0; o.px0 = P.x; o.py0 = P.y; o.idle = 0; o.bas = false; o.acik = 0; o.olay = {};
  K.xs = P.x; K.r = clamp((K.xEnd - K.xs) / UC11_LV, 0.2, 1);
  o.v = 0; o.vOn = 0; o.vD = 0; o.dx = K.xs; o.dxOn = K.xs; o.ddx = K.xs; o.spd = 0; o.off = 0; o.uV = 0;
  o.bx = P.x; o.by = P.y; o.byOn = P.y; o.pX = o.pXOn = P.x; o.pY = o.pYOn = P.y;
  P.ucus = o; P.vx = P.vy = 0; P.kilit = 0; P.buf = 0; UCUS11.o = o; UCUS11.aktif = true;
  if (typeof omHepsiniBirak === 'function') { try { omHepsiniBirak(); } catch (e) {} }
  o.pr.x = typeof D !== 'undefined' && Number.isFinite(D.x) ? D.x : P.x - 70; o.pr.y = typeof D !== 'undefined' && Number.isFinite(D.y) ? D.y : P.y - 90;
  const B = typeof BOLUM !== 'undefined' ? (BOLUM.kule || BOLUM.ucus) : null;
  if (B) { o.kor = B; o.korEski = { yUst: B.yUst, yAlt: B.yAlt }; }
  o.kamY = Math.min(P.y, o.y) - 20; uc11Koridor(o);
  OLAY.emit('pelerinUcusBasla', { o, top: o.top });
}
function uc11Koridor(o) { if (o.kor) { o.kor.yUst = o.kamY - 300; o.kor.yAlt = o.kamY + 160; } }
function uc11Olay(o, ad) { if (o.olay[ad]) return; o.olay[ad] = true; OLAY.emit(ad, { o }); }
// ── her fizik adımı (P.ucus === o iken motor çağırır) ──
function uc11Adim(o, dt, G) {
  if (!(dt > 0) || !Number.isFinite(dt) || DURUM !== 'oyun' || P.ucus !== o) return;
  dt = Math.min(dt, 0.05);
  const K = o.K, basili = !!(G && (G.basili || G.eksenY < 0));
  o.t += dt; o.total += dt; o.ft += dt;
  o.sevT = Math.max(0, o.sevT - dt); o.parla = Math.max(0, o.parla - dt * 0.7); o.vinT = Math.max(0, o.vinT - dt);
  P.vx = P.vy = 0; P.ground = false; P.f = 1;
  if (o.faz === 'acil') {   // balkonda: ay ışığı huzmesi iner, pelerin kanat gibi açılır, hep birlikte havalanırlar
    o.huzme = smooth(clamp(o.t / 0.5, 0, 1)) * (1 - smooth(clamp((o.t - 1.5) / 0.6, 0, 1)));
    o.acik = smooth(clamp((o.t - 0.3) / 0.8, 0, 1));
    if (o.t > 0.3 && !o.olay.ac) { o.olay.ac = true; uc11Sfx('pelerinAc'); uc11TozPatla(P.x, P.y - 40, 20, 150); o.sevT = 1; }
    const yer = smooth(clamp(o.t / 0.35, 0, 1)), kalk = smooth(clamp((o.t - 1.25) / (UC11_AC - 1.25), 0, 1));
    o.off = 30 * kalk; o.uV = 70 * kalk;
    o.bx = K.xs; o.byOn = o.by; o.by = lerp(o.py0, uc11Serit(o, 0), yer) - o.off;
    o.bob = 0; o.rot = lerp(o.rot, 0, 1 - Math.exp(-dt * 4)); o.fzOpt.vy = -60 * kalk;
    o.kamY = lerp(o.kamY, o.y - 40, 1 - Math.exp(-dt * 2));
    if (o.t >= UC11_AC) { o.faz = 'ucus'; o.t = 0; o.idle = 0; o.spd = 30; uc11Sfx('ucusKalk'); uc11Olay(o, 'pelerinUcusKalk'); }
    P.x = o.bx; P.y = o.by;
  } else if (o.faz === 'ucus') {
    const vH = uc11HizH(o.v);
    o.spd = lerp(o.spd, vH, 1 - Math.exp(-dt * (o.v < 500 ? 1.0 : 1.6)));
    o.vOn = o.v; o.v += o.spd * dt;
    o.dxOn = o.dx; o.bx = K.xs + o.v * K.r; o.dx = o.bx - o.v;
    const lane = uc11Serit(o, o.v), aw = uc11AyW(o.v), son = smooth(clamp((o.v - (UC11_LV - 1500)) / 1200, 0, 1)), bas0 = smooth(clamp(o.v / 700, 0, 1));
    const ust = UC11_UST * (1 - 0.8 * aw) * (1 - son) * lerp(0.55, 1, bas0), alt = UC11_ALT * (1 - 0.7 * aw) * (1 - son) * smooth(clamp((o.v - 800) / 700, 0, 1));   // kalkışta şeridin altına inmez
    const yardim = o.idle >= UC11_YARDIM && (o.idle - UC11_YARDIM) % 8 < 3.5;   // Pırıl kurdeleyle çeker, sonra bir süre bırakır (dokunmak hep daha iyi)
    if (basili && !o.bas) {   // dokunuş: pelerin kanat gibi çırpar, minik ışık pufu, Feza sevinir
      if (o.vinT <= 0) { uc11Sfx('ucusVin', 1); o.vinT = 1.2; }
      o.cirp = 1; o.sevT = Math.max(o.sevT, 0.45); uc11TozPatla(o.bx - 22, o.by + o.bob - 26, 6, 70, 1);
    }
    o.cirp = Math.max(0, o.cirp - dt * 2.2); o.yuk = lerp(o.yuk, basili ? 1 : 0, 1 - Math.exp(-dt * (basili ? 7 : 3)));
    o.acik = lerp(o.acik, clamp(0.64 + 0.3 * o.yuk + 0.14 * Math.sin(o.cirp * Math.PI), 0, 1), 1 - Math.exp(-dt * 8));
    if (basili) { o.idle = 0; o.uV = Math.min(o.uV + 720 * dt, 190); }
    else {
      o.idle += dt;
      if (yardim) {   // Pırıl ay ışığı kurdelesiyle çeker: Feza sıradaki damlanın yüksekliğine süzülür
        const r = uc11Sonraki(o); let h = 0;
        if (r && r.v - o.v < 1000) h = r.lift + (lane - uc11Serit(o, r.v));
        o.uV = lerp(o.uV, clamp((h - o.off) * 1.1, -70, 70), 1 - Math.exp(-dt * 1.4));   // tembel kurdele: dokunmak çok daha iyi
      } else {   // bırakınca yumuşak süzülüş; aşağıda yakın bir damla varsa onun hizasında yavaşlar
        const alt0 = -90;
        const nv = o.uV - 460 * dt; o.uV = nv >= alt0 ? nv : o.uV < alt0 ? lerp(o.uV, alt0, 1 - Math.exp(-dt * 6)) : alt0;
      }
    }
    if (yardim && !o.olay.pelerinUcusYardim) uc11Olay(o, 'pelerinUcusYardim');
    if (!yardim && o.olay.pelerinUcusYardim && o.idle < 1) o.olay.pelerinUcusYardim = false;   // dokundu: bir dahaki yardımda yeniden
    o.yardimA = lerp(o.yardimA, yardim ? 1 : 0, 1 - Math.exp(-dt * 3));
    o.bas = basili;
    if (aw > 0.02) o.off = lerp(o.off, 0, 1 - Math.exp(-dt * 1.8 * aw));   // ay anında Feza ayın ortasına süzülür
    o.off += o.uV * dt;
    if (o.off > ust) { o.off = lerp(o.off, ust, 1 - Math.exp(-dt * 7)); if (o.uV > 0) o.uV *= Math.exp(-dt * 6); }
    if (o.off < alt) { o.off = lerp(o.off, alt, 1 - Math.exp(-dt * 7)); if (o.uV < 0) o.uV *= Math.exp(-dt * 6); }
    o.byOn = o.by; o.by = clamp(lane - o.off, K.yUst + 60, K.yAlt - 20);
    const vy = (o.by - o.byOn) / dt;
    o.rot = lerp(o.rot, clamp(Math.atan2(vy, Math.max(o.spd, 90)) * 0.6, -0.25, 0.22), 1 - Math.exp(-dt * 5));
    o.bob = Math.sin(o.total * 2.1) * 4 * (1 - son * 0.6);
    o.fzOpt.vy = vy * 0.35;
    o.salla = lerp(o.salla, aw > 0.55 ? 1 : 0, 1 - Math.exp(-dt * 3));
    uc11Toplar(o, dt, yardim);
    // anlatı olayları
    if (o.v > 2100 && !o.olay.pelerinUcusVela) { o.vela.kik = 2.4; uc11Olay(o, 'pelerinUcusVela'); }
    if (o.v > UC11_AY_V - 700 && !o.olay.pelerinUcusAy) { uc11Sfx('ucusVin', 1); uc11Olay(o, 'pelerinUcusAy'); }
    if (o.v > UC11_SATO0 + 250) uc11Olay(o, 'pelerinUcusSato');
    if (o.total > 150) o.v = Math.max(o.v, UC11_LV);   // güvenlik: asla takılmasın
    // kamera: şeridi ve yüksekliğin yarısını izler; ay anında biraz yukarı bakar
    const kOfs = lerp(0, 60, smooth(clamp(o.v / 1200, 0, 1))) - 34 * aw;
    o.kamY = lerp(o.kamY, lane + 0.5 * (o.by - lane) + kOfs, 1 - Math.exp(-dt * 2.2));
    // pelerinden dökülen ay ışığı izi (toplanan ışıkla parlar)
    o.izT -= dt; if (o.izT <= 0) { o.izT = lerp(0.07, 0.035, clamp(o.n / 30, 0, 1)); uc11TozAt(o.bx - 16 + Math.random() * 10, o.by + o.bob - 30 + Math.random() * 22, -30 - Math.random() * 30, 6 + Math.random() * 14, 0.9 + Math.random() * 0.7, Math.random() < 0.6 ? (Math.random() * 3) | 0 : 3 + ((Math.random() * 3) | 0), 1.6 + Math.random() * 2.2, 8); }
    if (o.n > 0) { o.yizT = (o.yizT || 0) - dt; if (o.yizT <= 0) { const nn = clamp(o.n / 30, 0, 1); o.yizT = lerp(0.32, 0.07, nn); uc11YizAt(o.bx - 20 + Math.random() * 8, o.by + o.bob - 26 + Math.random() * 20, 4 + nn * 7 + Math.random() * 2); } }
    if (o.v >= UC11_LV) { o.faz = 'inis'; o.t = 0; o.indi = false; o.ix0 = o.bx; o.iy0 = o.by + o.bob; o.ivx = o.spd * K.r; o.ivy = vy; uc11Olay(o, 'pelerinUcusInis'); }
    P.x = o.bx; P.y = o.by + o.bob;
  } else if (o.faz === 'inis') {   // kule terasına yumuşak süzülüş; pelerin yavaşça kapanır
    const u = clamp(o.t / UC11_INIS, 0, 1), e = smooth(u);
    o.spd = lerp(o.spd, 0, 1 - Math.exp(-dt * 2.2)); o.vOn = o.v; o.v += o.spd * dt; o.dxOn = o.dx;
    o.bx = uc11Herm(o.ix0, K.inisX, o.ivx * UC11_INIS, u); o.dx = o.bx - o.v;   // uçuş hızıyla başlar (takılma yok), yavaşça durur
    o.byOn = o.by; o.by = uc11Herm(o.iy0, K.gy, o.ivy * UC11_INIS * 0.88, clamp(u / 0.88, 0, 1));
    o.acik = lerp(o.acik, lerp(1, 0.2, smooth(clamp((u - 0.6) / 0.4, 0, 1))), 1 - Math.exp(-dt * 5)); o.yuk = lerp(o.yuk, 0, 1 - Math.exp(-dt * 4));
    o.rot = lerp(o.rot, 0, 1 - Math.exp(-dt * 4)); o.bob = 0; o.fzOpt.vy = (o.by - o.byOn) / dt * 0.35;
    o.salla = lerp(o.salla, 0, 1 - Math.exp(-dt * 3));
    uc11Toplar(o, dt, false);
    if (!o.indi && u > 0.88) { o.indi = true; o.sevT = 1.2; uc11Sfx('ucusInis'); uc11TozPatla(K.inisX, K.gy - 6, 16, 120); }
    o.kamY = lerp(o.kamY, K.gy - 50, 1 - Math.exp(-dt * 2.4));
    P.x = o.bx; P.y = o.by;
    if (u >= 1) { uc11Koridor(o); uc11EslikAdim(o, dt); uc11Bitir(o); return; }
  }
  uc11Koridor(o);
  uc11EslikAdim(o, dt);
  o.pXOn = o.pX; o.pX = P.x; o.pYOn = o.pY; o.pY = P.y; o.x = P.x;
  if (typeof D !== 'undefined') { D.x = o.pr.x; D.y = o.pr.y; }
}
function uc11Herm(a, b, m, u) {   // a→b, başta eğim m (birim/u), sonda 0; aşmasın diye eğim sınırlı
  const d = b - a; m = d > 0 ? clamp(m, 0, 2.6 * d) : d < 0 ? clamp(m, 2.6 * d, 0) : 0;
  const u2 = u * u, u3 = u2 * u; return a + d * (3 * u2 - 2 * u3) + m * (u3 - 2 * u2 + u);
}
function uc11Bitir(o) {
  const K = o.K;
  P.x = P.safeX = K.inisX; P.y = P.safeY = K.gy; P.vx = P.vy = 0; P.ground = true; P.ucus = null; P.dj = true; P.buf = 0; P.fade = 0; P.f = 1;
  if (typeof D !== 'undefined') { D.x = o.pr.x; D.y = o.pr.y; D.vx = D.vy = 0; }
  if (o.kor && o.korEski) { o.kor.yUst = o.korEski.yUst; o.kor.yAlt = o.korEski.yAlt; }
  o.faz = 'bitti'; o.done = true; o.t = 0; o.tk = { bitti: true }; o.x = K.inisX; o.ay.a = 0; o.silA = 0; o.acik = 0; UCUS11.aktif = false;
  o.pX = o.pXOn = P.x; o.pY = o.pYOn = P.y; o.ex = o.ey = 0;
  const V = uc11V(); if (V) V.ucus = true;
  OLAY.emit('pelerinUcusBitti', { o, n: o.n, top: o.top, sure: o.total, x: K.inisX, y: K.gy });
}
// ── ay ışığı damlaları: konum, mıknatıs, toplama, kaçırma ──
function uc11ItemY(o, r) { return uc11Serit(o, r.v) - UC11_GOGUS - r.lift; }
function uc11Sonraki(o) { const L = o.dizi; for (let i = 0; i < L.length; i++) { const r = L[i]; if (r.d === 'bekle' && r.v > o.v + 10) return r; } return null; }
function uc11Toplar(o, dt, yardim) {
  const dk = o.idle < 1.4, L = o.dizi, cx = o.bx + 6, cy = o.by + o.bob - UC11_GOGUS, mR = dk ? 128 : yardim ? 84 : 70, aR = dk ? 48 : 40;   // dokunan çocuğun mıknatısı güçlü; kendi kendine süzülürken zayıf
  for (let i = 0; i < L.length; i++) {
    const r = L[i];
    if (r.d !== 'bekle') { r.t += dt; continue; }
    const dv = r.v - o.v; if (dv > 420) break;   // sıralı: ötesi uzakta
    if (dv < -110 || o.faz === 'inis') { r.d = 'kacti'; r.t = 0; r.wy = uc11ItemY(o, r); continue; }   // kaçan: göğe süzülüp söner (sorun değil)
    const ix = r.v + o.dx, iy = uc11ItemY(o, r), d = Math.hypot(ix - cx, iy - cy);
    if (d < mR) r.m = Math.min(1, r.m + dt * (dk ? 3.2 : 2.2) * (1.25 - d / mR)); else r.m = Math.max(0, r.m - dt);
    const ex = lerp(ix, cx, r.m * 0.7), ey = lerp(iy, cy, r.m * 0.7);
    if (Math.hypot(ex - cx, ey - cy) < aR) uc11Topla(o, r, ex - cx, ey - cy);
  }
}
function uc11Topla(o, r, rx, ry) {
  r.d = 'alindi'; r.t = 0; r.rx = rx; r.ry = ry; o.n++; o.parla = 1; o.sevT = 0.7;
  uc11Sfx('ucusIsik', o.n);
  uc11TozPatla(o.bx + 6 + rx, o.by + o.bob - UC11_GOGUS + ry, 10, 110, r.tip === 'y' ? 3 : 1);
  if (o.n % 10 === 0) { UC11_KOMBO.t = 1; o.vela.kik = Math.max(o.vela.kik, 1.4); o.sevT = 1.4; uc11TozPatla(o.bx + 6, o.by + o.bob - UC11_GOGUS, 18, 200, 3); uc11Sfx('parilti', 1); }
  if (o.n % 6 === 0 && !(o.pr.tk > 0)) { o.pr.tk = 0.001; o.pr.tkYon = Math.random() < 0.5 ? -1 : 1; }   // Pırıl sevinçle takla atar
  OLAY.emit('pelerinUcusIsik', { o, n: o.n, top: o.top, tip: r.tip === 'y' ? 'yildiz' : 'damla', x: o.bx + 6 + rx, y: o.by - UC11_GOGUS + ry });
}
// ── eşlik edenler: yarasalar (dizilişte, ara sıra takla), Vela (sağda kendi pelerini), Pırıl (solda; ipucu ve yardım) ──
const UC11_YAR_OF = [[-118, -100], [-62, -152], [118, -138], [178, -78], [-182, -44]];
const UC11_YAR_AY = [[-170, -48], [-116, -112], [146, -106], [214, -42], [30, -168]];   // ay anında: binicilerin iki yanında, ayın içinde
function uc11EslikAdim(o, dt) {
  const fx = P.x, fy = P.y, aw = o.faz === 'ucus' ? uc11AyW(o.v) : 0;
  // yarasalar
  o.yTk -= dt;
  if (o.yTk <= 0 && o.faz === 'ucus' && aw < 0.1) { const i = (Math.random() * 5) | 0; if (!(o.yar[i].tk > 0)) { o.yar[i].tk = 0.001; uc11Sfx('yarasaPir', i); } o.yTk = 5 + Math.random() * 4; }
  for (let i = 0; i < 5; i++) {
    const Y = o.yar[i], A = UC11_YAR_OF[i], B = UC11_YAR_AY[i];
    Y.f += dt * (aw > 0.4 ? 7.5 : 10.5 + i * 0.6);
    let hx = fx + lerp(A[0], B[0], aw) + Math.sin(o.total * (0.9 + i * 0.13) + i * 2) * 16 * (1 - aw), hy = fy + lerp(A[1], B[1], aw) + Math.sin(o.total * (1.3 + i * 0.1) + i) * 12;
    if (o.faz === 'acil') { const an = o.t * 2.6 + i * 1.26, k0 = smooth(clamp(o.t / UC11_AC, 0, 1)); hx = lerp(fx + Math.cos(an) * (70 + i * 12), hx, k0); hy = lerp(fy - 60 + Math.sin(an) * 40, hy, k0); }
    if (o.faz === 'inis') { const an = o.total * 1.8 + i * 1.26; hx = lerp(hx, o.K.inisX + 40 + Math.cos(an) * (80 + i * 10), smooth(clamp(o.t / UC11_INIS, 0, 1))); }
    let kx0 = -1e9, kx1 = 1e9;
    if (o.faz === 'ucus' && typeof cam !== 'undefined') { kx0 = Math.min(cam.x + 50, fx - 60); kx1 = Math.max(cam.x + VW - 50, fx + 60); hx = clamp(hx, kx0 + 36, kx1 - 36); }   // dar (dikey) ekranda yarasalar kenardan taşmasın
    if (Y.tk > 0) { Y.tk += dt / 1.3; const a = Y.tk * 6.2832; hx += Math.sin(a) * 46; hy -= (1 - Math.cos(a)) * 30; if (Y.tk >= 1) Y.tk = 0; }
    const k = 1 - Math.exp(-dt * (o.faz === 'acil' ? 2.4 : 3.4));
    Y.x = lerp(Y.x, hx, k); if (Y.x < kx0 || Y.x > kx1) Y.x = lerp(Y.x, clamp(Y.x, kx0, kx1), 1 - Math.exp(-dt * 10)); Y.y = lerp(Y.y, hy, k); Y.a = 1;
  }
  // Vela: balkonda pelerinini açar, Feza'yla birlikte havalanır; uçuşta sağında süzülür, ay anında el sallar, inişte yanına konar
  const V = o.vela; V.kik = Math.max(0, V.kik - dt);
  let vx, vy, kv = 2.6;
  if (o.faz === 'acil') { const kalk = smooth(clamp((o.t - 1.0) / (UC11_AC - 1.0), 0, 1)); vx = lerp(o.x + 86, fx + 104, kalk); vy = lerp(o.y, fy + 18, kalk); V.pel = lerp(0.15, 1, smooth(clamp((o.t - 0.6) / 0.6, 0, 1))); kv = 6; }
  else if (o.faz === 'inis') { const u = clamp(o.t / UC11_INIS, 0, 1); vx = lerp(fx + 104, o.K.inisX + 96, smooth(u)); vy = lerp(fy + 18, o.K.gy, smooth(clamp(u / 0.92, 0, 1))); V.pel = lerp(1, 0.2, smooth(clamp((u - 0.7) / 0.3, 0, 1))); kv = 5; }
  else { vx = fx + 104 + Math.sin(o.total * 0.8) * 14 - 22 * aw; vy = fy + 18 + Math.sin(o.total * 1.7 + 1) * 10 - 16 * aw; V.pel = 1; }
  V.x = lerp(V.x, vx, 1 - Math.exp(-dt * kv)); V.y = lerp(V.y, vy, 1 - Math.exp(-dt * kv));
  V.el = lerp(V.el, aw > 0.55 || (o.faz === 'inis' && o.t > UC11_INIS * 0.8) ? 1 : 0, 1 - Math.exp(-dt * 3));
  // Pırıl: solunda uçar; ipucunda sıradaki damlanın yanına gider; yardımda önden kurdeleyle çeker; sevinçle takla
  const Pr = o.pr; let px = fx - 86, py = fy - 96 + Math.sin(o.total * 2.4) * 8;
  if (o.faz === 'ucus') {
    const ip = o.idle >= UC11_IPUCU, r = ip ? uc11Sonraki(o) : null;
    if (r && r.v - o.v < 700 && o.yardimA < 0.5) { const an = o.total * 2.2; px = r.v + o.dx - 34 + Math.cos(an) * 40; py = uc11ItemY(o, r) - 30 + Math.sin(an) * 24; }
    else if (o.yardimA > 0.5) { px = fx + 70; py = fy - 118 + Math.sin(o.total * 3) * 6; }
    px -= 24 * aw; py += 6 * aw;
  } else if (o.faz === 'inis') { px = fx - 70; py = fy - 90; }
  else if (o.faz === 'acil') { px = lerp(Pr.x, fx - 80, 0.5); py = fy - 92; }
  if (Pr.tk > 0) { Pr.tk += dt / 0.8; if (Pr.tk >= 1) Pr.tk = 0; }
  Pr.x = lerp(Pr.x, px, 1 - Math.exp(-dt * 3.2)); Pr.y = lerp(Pr.y, py, 1 - Math.exp(-dt * 3.2));
}
// ── ay: ay anına yaklaşırken bulut aralığından büyür, binicilerin arkasına süzülür; sonra yine bulutlara girer (final ayı HARITA'nın) ──
function uc11AyHesap(o) {
  const A = o.ay, VHg = VH / cam.zoom, v = o.vD, aw = o.faz === 'ucus' ? uc11AyW(v) : 0;
  // dinlenme konumu: dunya11'in boşluktaki ayıyla aynı yer ve boy (yavaş paralaks); ay anında binicilerin arkasına süzülür
  const mx = cam.x + VW * 0.5, ax = typeof DN11_AYX !== 'undefined' && Number.isFinite(DN11_AYX) ? DN11_AYX : 690 * T + T / 2;
  const rx = mx + (ax - mx) * 0.12, ry = cam.y + VHg * 0.38, rr = Math.min(VHg * 0.32, 226), cx = P.x + 6, cy = P.y - UC11_GOGUS, R = VHg * 0.34;
  A.r = lerp(rr, R, aw); A.x = lerp(rx, cx + 26, aw); A.y = lerp(ry, cy - R * 0.2, aw);
  A.a = smooth(clamp(aw / 0.15, 0, 1));   // ay anının dışında gökteki ayı dunya11 çizer; kenarlarda aynı yerde yumuşak devir (iki ay yok)
  A.w = aw; A.ort = 1 - smooth(clamp(aw * 1.7, 0, 1));
  if (aw > 0.005) {   // siluet oranı: göğüs ayın diskinde
    const d = Math.hypot(cx - A.x, cy - A.y) / Math.max(1, R);
    o.silX = A.x; o.silY = A.y; o.silH = smooth(clamp((1.0 - d) / 0.38, 0, 1)) * UC11_SIL * smooth(clamp(aw * 2.6, 0, 1));
  } else o.silH = 0;
}
// ── çizim ──
function uc11AyCiz(o, tm) {
  const A = o.ay; if (A.a < 0.01) return;
  const k = A.r / 190, art = uc11AyArt();
  g.globalCompositeOperation = 'lighter'; dglow('#cfe6ff', A.x, A.y, A.r * 3.1, 0.22 * A.a * (0.6 + 0.4 * (1 - A.ort))); g.globalCompositeOperation = 'source-over';
  g.globalAlpha = A.a; g.drawImage(art, A.x - 256 * k, A.y - 256 * k, 512 * k, 512 * k); g.globalAlpha = 1;
  // ayı saran bulut perdesi: ay anına yaklaşırken iki yana aralanır (bulut aralığı), sonra yeniden kapanır
  const ort = A.ort, R = A.r;
  for (let i = 0; i < 5; i++) {
    const sd = i % 2 ? 1 : -1, aci = (1 - ort) * (0.75 + i * 0.12);
    const bx = A.x + sd * R * (0.35 + i * 0.16 + aci * 1.1), by = A.y + R * (i < 2 ? 0.55 : i < 4 ? -0.45 : 0.15) + Math.sin(tm * 0.3 + i) * R * 0.04;
    const B = uc11BulutArt(i % 3), s = R / 200 * (1.1 + (i % 3) * 0.2), al = A.a * (0.2 + 0.4 * ort) * (i === 4 ? ort : 1) * (0.5 + 0.5 * smooth(clamp(o.vD / 1500, 0, 1)));
    if (al < 0.02) continue;
    g.globalAlpha = al; g.drawImage(B.c, bx - B.ax * s, by - B.ay * s, B.w * s, B.h * s);
  }
  // alt ve üstte kalın bulut kıyıları (aralığın kenarları; ay anında bile durur)
  for (let i = 0; i < 4; i++) {
    const alt = i % 2 === 0, B = uc11BulutArt((i + 1) % 3), s = R / 200 * (alt ? 1.25 : 1.5), bx = A.x + (i - 1.5) * R * 0.95 + Math.sin(tm * 0.2 + i * 2) * R * 0.05, by = A.y + (alt ? 1.12 : -1.02) * R + R * (alt ? 0.25 : 0.2) + (alt ? 1 : -1) * 0.3 * ort * R;
    g.globalAlpha = A.a * (0.25 + 0.55 * smooth(clamp(A.w * 2.2, 0, 1))); g.drawImage(B.c, bx - B.ax * s, by - B.ay * s, B.w * s, B.h * s);
  }
  g.globalAlpha = 1;
}
function uc11BulutCiz(o, tm, ddx, on) {   // yakın bulut tutamları (sanal konumda)
  const L = o.bulut, x0 = cam.x - 420 - ddx, x1 = cam.x + VW + 420 - ddx, gir = smooth(clamp(o.vD / 500, 0, 1)) * (1 - smooth(clamp((o.vD - (UC11_LV - 900)) / 700, 0, 1)));
  if (gir < 0.02) return;
  for (let i = 0; i < L.length; i++) {
    const b = L[i]; if (b.on !== on) continue; if (b.v < x0) continue; if (b.v > x1) break;
    const B = uc11BulutArt(b.k), s = b.s * (1 + 0.25 * b.ac), x = b.v + ddx + Math.sin(tm * 0.25 + i) * 8, y = uc11Serit(o, b.v) - b.lift;
    const al = b.a * gir * (1 - 0.75 * b.ac);
    if (al < 0.02) continue;
    g.globalAlpha = al; g.drawImage(B.c, x - B.ax * s, y - B.ay * s, B.w * s, B.h * s);
  }
  g.globalAlpha = 1;
}
function uc11SatoCiz(o, tm, ddx) {   // ışıkları yanmış yakın şato çatıları: pencereler sıcak ışıkla nefes alır, flamalar dalgalanır
  const L = o.sato, x0 = cam.x - 320 - ddx, x1 = cam.x + VW + 320 - ddx;
  let onceki = null;
  for (let i = 0; i < L.length; i++) {
    const p = L[i]; if (p.v < x0) { onceki = p; continue; } if (p.v > x1) break;
    const A = uc11KuleArt(p.k), s = p.s, X = p.v + ddx, Y = p.y;
    g.drawImage(A.c, X - A.ax * s, Y - A.ay * s, A.w * s, A.h * s);
    // komşu iki parça arasında bayrak süsü (pastel üçgenler; ip hafifçe sallanır)
    if (onceki && onceki.ip) {
      const Ao = uc11KuleArt(onceki.k), xa = onceki.v + ddx + Ao.sb[0] * onceki.s, ya = onceki.y + Ao.sb[1] * onceki.s, xb = X + A.sa[0] * s, yb = Y + A.sa[1] * s;
      if (xb - xa > 20 && xb - xa < 180) {
        const sag = 22 + (xb - xa) * 0.12 + Math.sin(tm * 1.3 + i) * 3;
        g.strokeStyle = 'rgba(37,29,82,0.85)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(xa, ya); g.quadraticCurveTo((xa + xb) / 2, (ya + yb) / 2 + sag * 2, xb, yb); g.stroke();
        for (let j = 1; j < 7; j++) { const u = j / 7, it = 1 - u, fx = it * it * xa + 2 * it * u * (xa + xb) / 2 + u * u * xb, fy = it * it * ya + 2 * it * u * ((ya + yb) / 2 + sag * 2) + u * u * yb; g.fillStyle = UC11_BAY[(j + i) % 5]; g.beginPath(); g.moveTo(fx - 5, fy); g.lineTo(fx + 5, fy); g.lineTo(fx + Math.sin(tm * 3 + j) * 1.5, fy + 11); g.closePath(); g.fill(); }
      }
    }
    if (A.bay) {   // tepe flaması
      const bx = X + A.bay[0] * s, by = Y + A.bay[1] * s, w = Math.sin(tm * 4.2 + p.f), w2 = Math.sin(tm * 5.1 + p.f + 1);
      g.fillStyle = UC11_BAY[p.c]; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + 18, by - 3 + w * 3, bx + 38, by + 5 + w2 * 4); g.quadraticCurveTo(bx + 18, by + 9 + w * 2, bx, by + 15); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.moveTo(bx, by + 2); g.quadraticCurveTo(bx + 14, by + 1 + w * 2, bx + 26, by + 5 + w2 * 3); g.lineTo(bx, by + 6); g.closePath(); g.fill();
    }
    onceki = p;
  }
  // pencere ışıkları (yumuşak, nefes alır)
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < L.length; i++) {
    const p = L[i]; if (p.v < x0) continue; if (p.v > x1) break;
    const A = uc11KuleArt(p.k), s = p.s, X = p.v + ddx;
    for (let j = 0; j < A.pen.length; j++) { const q = A.pen[j], tw = 0.75 + 0.25 * Math.sin(tm * (1.2 + j * 0.3) + p.f + j * 2); dglow(UC11_PEN[(j + p.c) % 3], X + q[0] * s, p.y + q[1] * s, q[2] * s * 3.6, 0.3 * tw); }
  }
  g.globalCompositeOperation = 'source-over';
}
function uc11DiziCiz(o, tm, ddx) {   // bekleyen ve kaçan damlalar / yıldızlar
  const L = o.dizi, x0 = cam.x - 80 - ddx, x1 = cam.x + VW + 80 - ddx, cx = P.x + 6, cy = P.y - UC11_GOGUS;
  const sira = o.idle >= UC11_IPUCU && o.faz === 'ucus' ? uc11Sonraki(o) : null, dA = uc11DamlaArt(), yA = uc11YildizArt();
  for (let i = 0; i < L.length; i++) {
    const r = L[i]; if (r.v < x0 - 300) continue; if (r.v > x1) break;
    let x, y, al = 1, s = 1;
    if (r.d === 'bekle') { const ix = r.v + ddx, iy = uc11ItemY(o, r) + Math.sin(tm * 2 + r.faz) * 5; x = lerp(ix, cx, r.m * 0.7); y = lerp(iy, cy, r.m * 0.7); s = 1 + 0.06 * Math.sin(tm * 3 + r.faz); }
    else if (r.d === 'kacti') { const u = clamp(r.t / 1.6, 0, 1); if (u >= 1) continue; x = r.v + ddx; y = r.wy - u * 70; al = 1 - u; s = 1 - 0.3 * u; }
    else continue;
    if (x < cam.x - 60 || x > cam.x + VW + 60) continue;
    g.globalCompositeOperation = 'lighter';
    dglow(r.tip === 'y' ? '#ffe7a8' : '#cfe6ff', x, y, 30, al * (0.32 + 0.12 * Math.sin(tm * 2.6 + r.faz)));
    if (r === sira) { const nb = 0.5 + 0.5 * Math.sin(tm * 5); dglow('#eaf4ff', x, y, 64 + 14 * nb, 0.35 + 0.25 * nb); for (let j = 0; j < 3; j++) { const an = tm * 2.4 + j * 2.09; g.globalAlpha = 0.8; g.drawImage(uc11TozArt(j), x + Math.cos(an) * 34 - 7, y + Math.sin(an) * 26 - 7, 14, 14); } g.globalAlpha = 1; }
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = al;
    if (r.tip === 'y') { g.save(); g.translate(x, y); g.rotate(Math.sin(tm * 1.5 + r.faz) * 0.25); g.drawImage(yA, -20 * s, -20 * s, 40 * s, 40 * s); g.restore(); }
    else g.drawImage(dA, x - 20 * s, y - 30 * s, 40 * s, 52 * s);
    g.globalAlpha = 1;
  }
}
function uc11UcanCiz(o, tm) {   // alınan ışık pelerine akar (küçülerek), pelerinde bir an parlar
  const L = o.dizi, cx = P.x + 6, cy = P.y - UC11_GOGUS, dA = uc11DamlaArt(), yA = uc11YildizArt();
  for (let i = 0; i < L.length; i++) {
    const r = L[i]; if (r.d !== 'alindi' || r.t > 0.6) continue;
    const u = clamp(r.t / 0.42, 0, 1), e = smooth(u), x = cx + lerp(r.rx, -16, e), y = cy + lerp(r.ry, 6, e) - Math.sin(u * Math.PI) * 18, s = lerp(1, 0.35, e);
    g.globalCompositeOperation = 'lighter'; dglow(r.tip === 'y' ? '#ffe7a8' : '#eaf4ff', x, y, 28, 0.5 * (1 - u * 0.5));
    if (u >= 1) dglow('#eaf4ff', cx - 16, cy + 6, 36, (0.6 - r.t) * 4);
    g.globalCompositeOperation = 'source-over';
    if (u < 1) { g.globalAlpha = 1 - u * 0.4; if (r.tip === 'y') g.drawImage(yA, x - 20 * s, y - 20 * s, 40 * s, 40 * s); else g.drawImage(dA, x - 20 * s, y - 30 * s, 40 * s, 52 * s); g.globalAlpha = 1; }
  }
}
function uc11TozCiz(ddx) {   // pelerin izi ve patlama parıltıları
  for (let i = 0; i < UC11_TOZN; i++) {
    const p = uc11Toz[i]; if (p.l <= 0) continue;
    const x = p.x + ddx; if (x < cam.x - 40 || x > cam.x + VW + 40) continue;
    const u = p.l / p.m, r = p.s * (0.6 + 0.6 * u) * 2.2;
    g.globalAlpha = Math.min(1, u * 1.4); g.drawImage(uc11TozArt(p.c), x - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}
function uc11FezaPoz() { return typeof fezaPozVar === 'function' && fezaPozVar('ucus11'); }
function uc11PelerinYedek(c, tm, acik, ad) {   // 'ucus11' pozu yoksa: omuzlardan kanat gibi açılan taraklı pelerin (Feza'nın arkasında)
  const R = UC11_PEL[ad] || UC11_PEL.mor, w = Math.sin(tm * 8.3), w2 = Math.sin(tm * 6.1 + 1);
  for (const sd of [-1, 1]) {
    const tx = sd * (12 + 34 * acik) - 6, ty = -48 - 12 * acik + w * 2, bx = sd * (8 + 20 * acik) - 6, by = -8 + w2 * 2;
    for (let k = 0; k < 2; k++) {
      const ic = k === 1, f = ic ? 0.78 : 1;
      c.fillStyle = ic ? R[1] : R[0]; c.beginPath(); c.moveTo(sd * 3, -45);
      c.quadraticCurveTo(sd * (8 + 22 * acik) * f - 4, -56 - 6 * acik, tx * f, ty + (ic ? 5 : 0));
      for (let i = 1; i <= 3; i++) { const u = i / 3; c.quadraticCurveTo(lerp(tx, bx, u - 0.17) * f - sd * 5, lerp(ty, by, u - 0.17) + 3, lerp(tx, bx, u) * f, lerp(ty, by, u) - (ic ? 3 : 0)); }
      c.quadraticCurveTo(sd * 3, -14, -2, -22); c.closePath(); c.fill();
    }
    c.fillStyle = R[2]; c.beginPath(); c.arc(tx * 0.62, ty * 0.72 - 6, 1.6, 0, 6.283); c.arc(tx * 0.45, -30, 1.3, 0, 6.283); c.fill();   // işleme benekleri
  }
}
function uc11FezaCiz(c, o, tm, x, y) {
  const f = o.fzOpt, V = uc11V();
  f.acik = o.acik; f.ruzgar = clamp(o.spd / 240, 0, 1); f.el = o.salla; f.sevinc = Math.max(o.salla * 0.6, smooth(clamp(o.sevT / 0.4, 0, 1)) * 0.9); f.aci = o.rot;
  if (uc11FezaPoz()) { try { fezaCizPoz(c, x, y, 1, 'ucus11', o.ft, null, f); return; } catch (e) {} }
  if (typeof fezaCizPoz !== 'function') return;
  c.save(); c.translate(x, y); c.rotate(o.rot * 0.6);
  if (o.acik > 0.02) { try { uc11PelerinYedek(c, o.ft, o.acik, V && V.pelerin); } catch (e) {} }
  try { fezaCizPoz(c, 0, 0, 1, 'sevinc', o.ft); } catch (e) {}
  c.restore();
}
function uc11VelaCiz(c, o, tm, x, y, uc) {
  if (typeof vampirCiz !== 'function') return;
  const V = o.vela, vo = o.vOpt, kik = V.kik > 0;
  vo.yon = 1; vo.mutlu = 1; vo.pelerin = V.pel; vo.el = V.el; vo.kirp = ((tm + 0.8) % 3.6) < 0.12 ? 1 : 0;
  vo.poz = uc ? (kik ? 'kikir' : 'ucus') : (V.el > 0.5 ? 'el' : 'dur'); vo.agiz = kik ? 0.5 + 0.5 * Math.abs(Math.sin(tm * 9)) : 0;
  const ga = c.globalAlpha; c.globalAlpha = ga * V.a;
  try { vampirCiz(c, 'kiz', x, y, 0.9, tm, vo); } catch (e) {}
  c.globalAlpha = ga;
}
function uc11YarasalarCiz(c, o, tm, ex, ey) {
  if (typeof yarasa11Ciz !== 'function') return;
  const yo = o.yOpt, sync = o.faz === 'ucus' ? uc11AyW(o.vD) : 0;
  for (let i = 0; i < 5; i++) {
    const Y = o.yar[i]; if (Y.a < 0.02) continue;
    yo.kanat = 0.5 + 0.5 * Math.sin(lerp(Y.f, tm * 7.5, sync)); yo.yon = Y.tk > 0 ? (Math.cos(Y.tk * 6.2832) > 0 ? 1 : -1) : 1; yo.mutlu = 1;
    const ga = c.globalAlpha; c.globalAlpha = ga * Y.a;
    try { yarasa11Ciz(c, Y.x + ex, Y.y + ey, 0.8, tm + i, yo); } catch (e) {}
    c.globalAlpha = ga;
  }
}
function uc11PirilCiz(c, o, tm, ex, ey) {
  if (typeof pirilCizPoz !== 'function') return;
  const Pr = o.pr, tk = Pr.tk > 0 ? smooth(Pr.tk) : 0, sal = o.salla * Math.sin(tm * 7) * 0.12, po = o.pOpt;
  po.salla = o.salla; po.sevinc = Math.max(smooth(clamp(o.sevT / 0.5, 0, 1)), tk > 0 ? 1 : 0);
  try { c.save(); c.translate(Pr.x + ex, Pr.y + ey); c.rotate(tk * 6.2832 * Pr.tkYon + sal); c.scale(1 + 0.08 * Math.sin(tk * Math.PI), 1 - 0.08 * Math.sin(tk * Math.PI)); pirilCizPoz(c, 0, 0, 0.95, 'ucus', o.ft, po); }
  catch (e) {}
  c.restore();
}
function uc11BinicilerCiz(c, o, tm) {   // uçuşta: yarasalar, Vela, Feza, Pırıl (arkadan öne)
  const ex = o.ex, ey = o.ey;
  uc11YarasalarCiz(c, o, tm, ex, ey);
  uc11VelaCiz(c, o, tm, o.vela.x + ex, o.vela.y + ey, true);
  uc11FezaCiz(c, o, tm, P.x, P.y);
  uc11PirilCiz(c, o, tm, ex, ey);
}
let uc11SilC = null, uc11SilQ = null, uc11SilR = null, uc11SilRQ = null;
function uc11SiluetCiz(o, tm, k) {   // biniciler ara tuvale çizilir, gece moruna boyanır (ay önünde siluet), ay gümüşü kenar ışığı, sonra konur
  const M = g.getTransform(), x0w = P.x - 270, x1w = P.x + 300, y0w = P.y - 270, y1w = P.y + 90;
  const dx0 = Math.max(0, Math.floor(M.a * x0w + M.e)), dy0 = Math.max(0, Math.floor(M.d * y0w + M.f));
  const dx1 = Math.min(cv.width, Math.ceil(M.a * x1w + M.e)), dy1 = Math.min(cv.height, Math.ceil(M.d * y1w + M.f)), w = dx1 - dx0, h = dy1 - dy0;
  if (w < 8 || h < 8) return false;
  if (!uc11SilC) { uc11SilC = document.createElement('canvas'); uc11SilQ = uc11SilC.getContext('2d'); }
  if (uc11SilC.width < w || uc11SilC.height < h) { uc11SilC.width = Math.max(uc11SilC.width, w); uc11SilC.height = Math.max(uc11SilC.height, h); }
  const q = uc11SilQ;
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, w, h);
  q.setTransform(M.a, M.b, M.c, M.d, M.e - dx0, M.f - dy0);
  uc11BinicilerCiz(q, o, tm);
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-atop'; q.globalAlpha = k; q.fillStyle = '#2a2158'; q.fillRect(0, 0, w, h);
  q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  if (o.silX !== undefined) {   // aya bakan kenarda ince ay gümüşü bant (ikinci ara tuval)
    let lx = o.silX - P.x, ly = o.silY - (P.y - UC11_GOGUS); const ll = Math.hypot(lx, ly) || 1, ya = clamp(ll / 90, 0, 1);
    lx = lerp(0.25, lx / ll, ya); ly = lerp(-0.97, ly / ll, ya); const l2 = Math.hypot(lx, ly) || 1; lx /= l2; ly /= l2;
    if (!uc11SilR) { uc11SilR = document.createElement('canvas'); uc11SilRQ = uc11SilR.getContext('2d'); }
    if (uc11SilR.width < w || uc11SilR.height < h) { uc11SilR.width = Math.max(uc11SilR.width, w); uc11SilR.height = Math.max(uc11SilR.height, h); }
    const r = uc11SilRQ, dp = 1.8 * Math.abs(M.a);
    r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'copy'; r.globalAlpha = Math.min(1, k * 1.05); r.fillStyle = '#eaf4ff'; r.fillRect(0, 0, w, h);
    r.globalCompositeOperation = 'destination-out'; r.globalAlpha = 1; r.drawImage(uc11SilC, 0, 0, w, h, -lx * dp, -ly * dp, w, h); r.globalCompositeOperation = 'source-over';
    q.globalCompositeOperation = 'source-atop'; q.drawImage(uc11SilR, 0, 0, w, h, 0, 0, w, h); q.globalCompositeOperation = 'source-over';
  }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(uc11SilC, 0, 0, w, h, dx0, dy0, w, h); g.restore();
  return true;
}
const UC11_CIZ = [[-40, -62, 46, 0], [-58, -36, 64, 0.37], [-44, -12, 40, 0.71], [-70, -50, 34, 0.19], [-52, -24, 52, 0.55]];   // hız çizgileri: [x, y, boy, faz]
function uc11HizCiz(o, tm) {   // yükselirken Feza'nın arkasında akan ince ay ışığı çizgileri (dokunmanın hissi)
  const a = o.faz === 'ucus' ? o.yuk * (1 - o.silA) : 0; if (a < 0.05) return;
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineWidth = 3; g.strokeStyle = '#cfe6ff';
  for (let i = 0; i < UC11_CIZ.length; i++) {
    const C = UC11_CIZ[i], u = (tm * 2.6 + C[3]) % 1, x = P.x + C[0] - u * 90, y = P.y + C[1] + 10 + u * 10;
    g.globalAlpha = a * 0.55 * Math.sin(u * Math.PI); g.beginPath(); g.moveTo(x, y); g.lineTo(x - C[2] * (0.6 + 0.4 * u), y + 4); g.stroke();
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function uc11KurdeleCiz(o, tm) {   // yardım: Pırıl'ın patisinden Feza'nın eline ay ışığı kurdelesi
  const a = o.yardimA * (o.faz === 'ucus' ? 1 : 0); if (a < 0.03) return;
  const tx = P.x + 10, ty = P.y - 44, px = o.pr.x + o.ex - 10, py = o.pr.y + o.ey + 12;
  const mx = (tx + px) / 2, my = Math.max(ty, py) + 16 + Math.sin(tm * 3) * 5;
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  g.strokeStyle = 'rgba(169,200,255,' + (0.35 * a).toFixed(3) + ')'; g.lineWidth = 7; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(mx, my, tx, ty); g.stroke();
  g.strokeStyle = 'rgba(245,250,255,' + (0.8 * a).toFixed(3) + ')'; g.lineWidth = 2; g.stroke();
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 4; i++) { const t = (tm * 0.6 + i / 4) % 1, it = 1 - t, x = it * it * px + 2 * it * t * mx + t * t * tx, y = it * it * py + 2 * it * t * my + t * t * ty; g.globalAlpha = a * Math.sin(t * Math.PI); g.drawImage(uc11TozArt(i % 3), x - 5, y - 5, 10, 10); }
  g.globalAlpha = 1;
}
function uc11OnCiz(o) {   // ön planda hızla akan koyu şato siluetleri (derinlik): şato bölümünde belirir, inişte söner
  const a = smooth(clamp((o.vD - (UC11_SATO0 - 700)) / 700, 0, 1)) * (1 - smooth(clamp((o.vD - (UC11_LV - 1200)) / 800, 0, 1))); if (a < 0.02) return;
  const art = uc11OnSeritArt(), VHg = VH / cam.zoom, top = cam.y + VHg - 110;
  let sx = -((o.vD * 1.4) % art.w); if (sx > 0) sx -= art.w;
  g.globalAlpha = a;
  for (let x = sx; x < VW + 2; x += art.w) g.drawImage(art.c, cam.x + x - 1, top, art.w + 2, art.h);
  g.globalAlpha = 1;
}
function uc11HuzmeCiz(o, tm) {   // kalkışta gökten Feza'nın üstüne inen ay ışığı huzmesi (ayna11 ortak çizicisi; yoksa yumuşak ışık)
  const a = o.huzme; if (!(a > 0.02)) return;
  const x1 = P.x, y1 = P.y - 30, x0 = x1 + 260, y0 = cam.y - 60;
  if (typeof aynaHuzmeCiz === 'function') { try { aynaHuzmeCiz(g, x0, y0, x1, y1, tm, a); return; } catch (e) {} }
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i <= 6; i++) { const u = i / 6; dglow('#cfe6ff', lerp(x0, x1, u), lerp(y0, y1, u), 46 + 20 * u, 0.16 * a); }
  dglow('#eaf4ff', x1, y1, 80, 0.3 * a);
  g.globalCompositeOperation = 'source-over';
}
function uc11BekleCiz(o, tm) {   // balkonda: Vela ve yarasalar; hazırken ayakta durulacak yerde ay ışığı halkası
  if (o.hazir) { g.globalCompositeOperation = 'lighter'; dglow('#cfe6ff', o.x + 10, o.y - 6, 70, 0.16 + 0.06 * Math.sin(tm * 2)); dglow('#eaf4ff', o.x + 10, o.y - 2, 26, 0.18); g.globalCompositeOperation = 'source-over'; }
  uc11YarasalarCiz(g, o, tm, 0, 0);
  uc11VelaCiz(g, o, tm, o.vela.x, o.vela.y, false);
}
function uc11BitmisCiz(o, tm) {   // inişten sonra: Vela el sallar, sonra pelerinini açıp balo salonuna doğru süzülür; yarasalar önden uçar
  if (o.vela.a > 0.02) uc11VelaCiz(g, o, tm, o.vela.x, o.vela.y, o.t > 1.6);
  uc11YarasalarCiz(g, o, tm, 0, 0);
}
TUR.kaydet('pelerinUcus', {
  kur: uc11Kur,
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    uc11TozAdim(dt);
    if (o.faz === 'bekle') {
      o.t += dt;
      if (Math.abs(P.x - o.x) < 2600) uc11Isit();   // yaklaşırken önbellekleri karelere yayarak hazırla
      if (!o.hazir && uc11HazirMi()) { o.hazir = true; OLAY.emit('pelerinUcusHazir', { o }); }
      uc11BekleEslik(o, dt);
      if (o.hazir && DURUM === 'oyun' && !P.ucus && !o.done && P.fade <= 0 && !(typeof D !== 'undefined' && D.mode === 'tasi')) {
        const dx = P.x - o.x;
        if (dx > -70 && dx < 420 && P.y > o.y - 160 && P.y < o.y + 420) uc11Basla(o);   // balkonda ya da balkondan boşluğa düşerken
      }
      return;
    }
    if (o.faz === 'bitti') {   // Vela el sallar, sonra balo salonuna süzülüp kaybolur; yarasalar önden uçup gider
      o.t += dt; const V = o.vela, K = o.K;
      if (o.t < 1.6) { V.x = lerp(V.x, K.inisX + 96, 1 - Math.exp(-dt * 4)); V.y = lerp(V.y, K.gy, 1 - Math.exp(-dt * 4)); V.el = lerp(V.el, 1, 1 - Math.exp(-dt * 4)); V.pel = 0.2; }
      else { const u = o.t - 1.6; V.el = lerp(V.el, 0, 1 - Math.exp(-dt * 3)); V.pel = lerp(V.pel, 1, 1 - Math.exp(-dt * 3)); V.x += (90 + 80 * Math.min(1, u)) * dt; V.y -= 26 * dt * Math.min(1, u); V.a = Math.max(0, 1 - u / 2.2); }
      for (let i = 0; i < 5; i++) { const Y = o.yar[i]; Y.f += dt * 11; if (o.t > 0.8 + i * 0.15) { Y.x += (150 + i * 20) * dt; Y.y -= (40 + i * 8) * dt; Y.a = Math.max(0, Y.a - dt * 0.5); } }
      o.x = o.vela.a > 0.02 ? Math.min(V.x, K.inisX + 600) : K.inisX;
      return;
    }
    // çizim konumu: iki fizik adımı arasındaki yumuşatma (oyun.js P.x'i ara konuma koyar; aynı oranla yakın katman ve eşlikçiler)
    const d = o.pX - o.pXOn, al = Math.abs(d) > 1e-4 ? clamp((P.x - o.pXOn) / d, 0, 1.25) : 1;
    o.ddx = lerp(o.dxOn, o.dx, al); o.vD = lerp(o.vOn, o.v, al); o.ex = P.x - o.pX; o.ey = P.y - o.pY;
    if (o.faz === 'ucus' || o.faz === 'inis') uc11AyHesap(o); else { o.ay.a = 0; o.silH = 0; }
    o.silA = o.silH > o.silA ? lerp(o.silA, o.silH, 1 - Math.exp(-dt * 4)) : Math.max(o.silH, o.silA - dt);
    // içinden geçilen bulut tutamları Feza değince aralanır
    if (o.faz === 'ucus') {
      const L = o.bulut;
      for (let i = 0; i < L.length; i++) {
        const b = L[i]; if (!b.on) continue; const x = b.v + o.ddx; if (x < P.x - 400) continue; if (x > P.x + 400) break;
        const y = uc11Serit(o, b.v) - b.lift - 40 * b.s;
        if (!(b.ac > 0) && Math.abs(x - P.x) < 120 * b.s && Math.abs(y - (P.y - 30)) < 90) { b.ac = 0.001; uc11TozPatla(P.x + 20, P.y - 30, 8, 90, 5); }
        if (b.ac > 0) b.ac = Math.min(1, b.ac + dt * 1.6);
      }
    }
  },
  testBitir(o) {
    if (o.faz === 'bekle') { o.hazir = true; uc11Basla(o); }
    if (o.faz === 'bitti') return;
    if (P.ucus !== o) { o.faz = 'inis'; P.ucus = o; }
    o.pr.x = o.K.inisX - 70; o.pr.y = o.K.gy - 90; o.vela.x = o.K.inisX + 96; o.vela.y = o.K.gy;
    uc11Bitir(o);
  },
  ciz(o, tm) {
    if (o.faz === 'bekle') { uc11BekleCiz(o, tm); return; }
    if (o.faz === 'bitti') { uc11BitmisCiz(o, tm); return; }
    if (P.ucus !== o) return;
    uc11AyCiz(o, tm);
    uc11BulutCiz(o, tm, o.ddx, false);
    uc11SatoCiz(o, tm, o.ddx);
    uc11DiziCiz(o, tm, o.ddx);
  },
  cizOn(o, tm) {
    if (P.ucus !== o) return;
    uc11HuzmeCiz(o, tm);
    uc11TozCiz(o.ddx);
    // okunurluk: Feza'nın çevresinde yumuşak ay ışığı (topladıkça parlar)
    g.globalCompositeOperation = 'lighter'; dglow('#cfe6ff', P.x, P.y - 34, 86, 0.12 + 0.14 * o.parla + 0.06 * o.acik); g.globalCompositeOperation = 'source-over';
    let sil = false;
    if (o.silA > 0.02) {
      g.globalCompositeOperation = 'lighter'; dglow('#eaf4ff', P.x + 10, P.y - 40, 160, 0.2 * o.silA / UC11_SIL); g.globalCompositeOperation = 'source-over';
      try { sil = uc11SiluetCiz(o, tm, o.silA); } catch (e) { sil = false; }
    }
    uc11HizCiz(o, tm);
    uc11YizCiz(o.ddx);
    if (!sil) uc11BinicilerCiz(g, o, tm);
    uc11KurdeleCiz(o, tm);
    uc11UcanCiz(o, tm);
    uc11BulutCiz(o, tm, o.ddx, true);
    uc11OnCiz(o);
  }
});
