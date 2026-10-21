/* supurge.js — Bölüm 8 (Balkabağı Gecesi) süpürge yolculuğu (önek sp8), nesne türü 'supurgeMini'. Sahibi: SUPURGE.
   Cadı Nine'nin kazanından canlanan bal rengi süpürge (kazan.js 'kazanSupurgeCiz' ile aynı görünüş; yoksa buradaki yedek) bahçenin
   ucunda (sütun 646) salınarak bekler; Cadı Nine'nin şapkalı kara kedisi de üstüne atlayıp oturur. Feza yanına gelince süpürgeye
   atlar (OLAY 'supurgeBasla', sfx 'supurgeCanlan'), kedi arkasına kurulur, Pırıl yanında uçar. Yolculuk (~65 sn):
   KALKIŞ (bahçenin üstünden yükseliş) → YÜKSELİŞ (ilk şeker yayları; yanımıza mor yarasalar katılır) → AY ANI (kocaman, gülen bal
   rengi ayın tam önünden ağır çekim geçiş: biniciler ayda siluet olur, Feza ve Pırıl el sallar, ayın önünde yıldız yayı) → KÖY
   (eğri büğrü evlerin, ışıklı pencerelerin, çatılardaki gülen kabakların ve fener dizilerinin üstünden süzülüş; bacadan el sallayan
   hayalet, kayan yıldızlar) → İNİŞ (meydanın girişine yumuşak iniş; Feza ve kedi iner; OLAY 'supurgeBitti', V8.supurge = true).
   Kontrol: ekrana basılı tutunca (ya da Boşluk/↑/W) süpürge yükselir, bırakınca yumuşakça süzülerek alçalır; hep kendiliğinden ileri
   gider; yükseklik koridorda sınırlı; düşme, çarpma, kaybetme yok. Havada ışıklı sarılı şekerler ve minik yıldızlar yay, dalga,
   merdiven ve halka biçiminde süzülür; yakından geçince süpürgeye doğru kayar (mıknatıs), alınan şeker Feza'nın sepetine uçar
   (V8.seker += 1, OLAY 'supurgeSeker' {n, top}, sfx 'supurgeSeker'); kaçan sorun değil (yavaşça göğe süzülüp söner).
   ~10 sn dokunulmazsa sıradaki şeker parlar ve Pırıl onun çevresinde döner; ~16 sn dokunulmazsa Pırıl ışıktan bir kurdeleyle
   süpürgeyi çeker ve şekerlere kendisi götürür (dokununca kontrol hemen çocuğa döner). Yolculuk her durumda biter.
   Sanal yol (kizak.js gibi): boşluk (651..801, ~6400 birim) 65 sn'lik uçuşa kısa gelir. Yakın köy katmanı, şekerler ve parçacıklar
   sanal yolda (v) durur, dünyaya o.dx kaymasıyla çizilir (dünya x = v + o.dx). Süpürgenin dünya x'i başta ve sonda sanalla birebir
   (bahçe ve meydan yakın katmanla aynı hızda), ortada yavaş: kamera ve uzak dünya (dunya8) yavaş, yakın köy hızlı akar. Uçuştan önce
   ve sonra yakın katmanın yalnız boşluğun iki ucundaki parçası dünyaya yapışık çizilir (bahçeden / meydandan bakınca köy görünür).
   Ay: dunya8 göğündeki ayı uçuşta SUPURGE.ay() {x, y, r, a} konumunda çizer (dn8Ay() tanımlıysa); tanımlı değilse yedek ay buradadır.
   Fizik devralma: P.ucus = o, motor her adımda o.adim(dt, OM_UCUS_GIRDI) çağırır; Feza, Pırıl, kedi, süpürge ve yarasalar burada
   çizilir. Kamera: oyun.js uçuş kamerası BOLUM.supurge (= BOLUM.ucus) koridorunu okur; uçuşta yUst/yAlt süpürgenin yumuşatılmış
   yüksekliğini izler (ay anında Feza ayın ortasında), bitince eski değerlere döner.
   Olaylar: supurgeHazir {o}, supurgeBasla {o, top}, supurgeKalk {o}, supurgeAy {o}, supurgeKoy {o}, supurgeYarasa {o},
   supurgeHayalet {o}, supurgeSeker {n, top, x, y, kim}, supurgeYildiz {n, top}, supurgeYardim {o}, supurgeInisBasla {o},
   supurgeInis {o, x, y}, supurgeBitti {o, n, top, sure, x, y}. Bitince: V8.supurge = true, o.done. Ortak çizici: supurgeCiz(c, x, y, s, t, o).
   Dışa açık: SUPURGE.aktif() hazir() bitti() faz() ilerleme() hiz() kayma() ay() ayAni() kediBende() kediKaynak() inisYer() supurgeYer().
   Kara kedi: süpürge hazır olunca bahçedeki geceDost kedisi (kabak.js; SUPURGE.kediKaynak() ile gizler) koşup süpürgeye atlar;
   inişten sonra süpürge ve kedi meydanın girişinde dinlenir.
   Karede gradyan/filtre yok: çizimler ilk kullanımda önbelleğe alınır, parçacıklar sabit havuzlarda. */
'use strict';
const SP8_LV = 13600;                                     // sanal yol uzunluğu (birim)
const SP8_A0 = 400, SP8_B0 = 800, SP8_B1 = 900, SP8_E = 700;    // sanal→dünya eşlemesi: baştaki/sondaki birebir parça ve geçişler
const SP8_BINIS = 1.9, SP8_INIS = 2.6, SP8_KZIP = 0.8;     // biniş, iniş, kedinin süpürgeye sıçrayışı (sn)
const SP8_V0 = 236, SP8_VK = 262, SP8_VAY = 72, SP8_VS = 150;   // hız: yükseliş, köy, ay anında en yavaş, iniş sonu (birim/sn)
const SP8_UST = 150, SP8_ALT = -95;                       // şeride göre yükseklik payı (yukarı +): basılı → yükselir, bırakınca süzülür
const SP8_IPUCU = 10, SP8_YARDIM = 16;                    // dokunulmadan geçen süre: ipucu / Pırıl kendisi götürür
const SP8_GOGUS = 30, SP8_KEDX = -34, SP8_HOVER = 44;     // oturma → göğüs; kedi süpürge ortasının arkasında; yerden salınma yüksekliği
const SP8_AY_V = 5100, SP8_AY_W = 760;                    // ay anı: sanal konum, yarı genişlik (yavaşlama)
const SP8_YARASA = [3350, 8600], SP8_HAYALET = 8820, SP8_KOY = 6000, SP8_INISV = SP8_LV - 1400;
const SP8_SIL = 0.84;                                     // ay önünde siluetin en koyu hâli (gece moru; altın kenar ışığıyla)
const SP8_EVY = 660;                                     // yakın köyün saçak çizgisi (dünya y; evler aşağıya, ekranın dibine iner)
const SP8_REN = ['#ff8fc8', '#7dffc4', '#e8ff8a', '#c39bff', '#ffb347'];   // şeker renkleri: pembe, nane, limon, lila, kabak
const SP8_TOZ = ['#fff4c8', '#ffd27a', '#ff8fc8', '#7dffc4', '#c39bff', '#ffe7a8'];
// şeker/yıldız dizileri: [biçim, sanal konum, tür ('s' şeker | 'y' yıldız), taban yükseklik (göğüs şeridine göre, yukarı +), ...]
//   cizgi: n, aralık · yay: n, aralık, tepe · dalga: n, aralık, genlik · merdiven: n, aralık, adım · halka: yarıçap (ortada şeker, 6 yıldız)
const SP8_DIZI = [
  ['cizgi', 760, 's', -10, 3, 120], ['yay', 1700, 's', 0, 5, 110, 90], ['halka', 2750, 's', 45, 54], ['dalga', 3350, 's', 10, 4, 150, 45],
  ['yay', 4520, 'y', -6, 7, 165, 30],                     // ay anı: ayın önünde yıldız yayı
  ['merdiven', 6350, 's', -40, 3, 130, 50], ['yay', 7150, 'y', 40, 5, 120, 80], ['halka', 7950, 's', -15, 54],
  ['cizgi', 8660, 's', -62, 3, 120],                      // bacadaki hayalete doğru alçaktan
  ['dalga', 9450, 's', 20, 4, 150, 50], ['yay', 10250, 'y', 0, 7, 120, 130], ['halka', 11050, 's', 40, 54], ['merdiven', 11700, 's', 60, 3, 130, -40]];
const SUPURGE = {
  o: null,
  aktif() { return !!this.o && P.ucus === this.o; },
  hazir() { return !!this.o && !!this.o.hazir; },
  bitti() { return !!this.o && !!this.o.done; },
  baslat(o) { o = o || this.o; if (o) { if (!o.hazir) sp8HazirOl(o); sp8Basla(o); } return o; },   // test / yedek
  faz() { return this.o ? this.o.faz : null; },
  ilerleme() { const o = this.o; return o ? (o.done ? 1 : clamp(o.v / SP8_LV, 0, 1)) : 0; },
  hiz() { return this.o ? this.o.spd || 0 : 0; },
  kayma() { const o = this.o; return o && o.K && P.ucus === o ? o.K.xs - o.dx : 0; },   // yakın katmanın dünyaya göre fazladan kayması
  ay() { const o = this.o; return o && P.ucus === o && o.ay.a > 0.001 ? o.ay : null; },   // dunya8: uçuşta ayın konumu {x, y, r, a}
  ayAni() { const o = this.o; return o && P.ucus === o && o.faz === 'ucus' ? sp8AyW(o.v) : 0; },   // siluet anı (0..1): biniciler ayın önünde
  kediBende() { const o = this.o; return !!o && (o.kediB || o.done); },   // kedi süpürgenin (kazan bitip süpürge hazır olunca)
  kediKaynak() { const o = this.o; return o && o.kediB ? o.kediK : null; },   // bahçeden alınan geceDost kedisi (kabak.js bunu gizler)
  inisYer() { const o = this.o; return o && o.K ? { x: o.K.inisX, y: o.K.gy } : null; },
  supurgeYer() { const o = this.o; return o ? { x: o.dbx, y: o.dby } : null; }
};
function sp8Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function sp8V8() { return typeof V8 !== 'undefined' && V8 ? V8 : null; }

// ── önbellekli çizimler (yalnız ilk kullanımda üretilir) ──
const sp8Arts = {};
function sp8Tuval(w, h, olc) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * olc)); c.height = Math.max(1, Math.ceil(h * olc)); const q = c.getContext('2d'); q.scale(olc, olc); return [c, q]; }
function sp8Yildiz5(q, r, ic) { q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * ic : r; if (i) q.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); else q.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } q.closePath(); }
function sp8Rgba(h, a) { const n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }
function sp8TozArt(ci) {   // parıltı yıldızı: 24×24 birim (merkez 12,12)
  const k = 'z' + ci; if (sp8Arts[k]) return sp8Arts[k];
  const [c, q] = sp8Tuval(24, 24, 2); q.translate(12, 12);
  const col = SP8_TOZ[ci % SP8_TOZ.length], gr = q.createRadialGradient(0, 0, 0, 0, 0, 12);
  gr.addColorStop(0, col); gr.addColorStop(1, sp8Rgba(col, 0));
  q.globalAlpha = 0.5; q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 12, 0, 6.2832); q.fill(); q.globalAlpha = 1;
  const yz = (r, f) => { q.fillStyle = f; q.beginPath(); q.moveTo(0, -r); q.quadraticCurveTo(r * 0.14, -r * 0.14, r, 0); q.quadraticCurveTo(r * 0.14, r * 0.14, 0, r); q.quadraticCurveTo(-r * 0.14, r * 0.14, -r, 0); q.quadraticCurveTo(-r * 0.14, -r * 0.14, 0, -r); q.fill(); };
  yz(8, col); yz(4, '#fffdf6');
  return sp8Arts[k] = c;
}
function sp8PufArt() {   // yumuşak lila-gri duman bulutçuğu: 32×32 birim
  if (sp8Arts.puf) return sp8Arts.puf;
  const [c, q] = sp8Tuval(32, 32, 2); q.translate(16, 16);
  const gr = q.createRadialGradient(-2, -3, 0, 0, 0, 16);
  gr.addColorStop(0, 'rgba(236,226,255,.95)'); gr.addColorStop(0.5, 'rgba(206,190,240,.6)'); gr.addColorStop(1, 'rgba(180,160,230,0)');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 16, 0, 6.2832); q.fill();
  return sp8Arts.puf = c;
}
function sp8SekerArt(ci) {   // sarılı şeker: 54×34 birim (merkez 27,17): yumuşak hâle, iki yanda büzgülü ambalaj, çizgili gövde, parlak
  const k = 's' + ci; if (sp8Arts[k]) return sp8Arts[k];
  const [c, q] = sp8Tuval(54, 34, 3); q.translate(27, 17);
  const col = SP8_REN[ci], ac = mixc(col, '#ffffff', 0.45), ko = mixc(col, '#3b2a6e', 0.35);
  let gr = q.createRadialGradient(0, 0, 0, 0, 0, 26); gr.addColorStop(0, sp8Rgba(col, 0.55)); gr.addColorStop(0.5, sp8Rgba(col, 0.2)); gr.addColorStop(1, sp8Rgba(col, 0));
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, 0, 27, 17, 0, 0, 6.2832); q.fill();
  for (const s of [-1, 1]) {   // ambalaj uçları (büzgülü yelpaze)
    q.fillStyle = ac; q.strokeStyle = ko; q.lineWidth = 1.2; q.lineJoin = 'round';
    q.beginPath(); q.moveTo(s * 9, -2.5); q.quadraticCurveTo(s * 15, -3, s * 22, -9); q.quadraticCurveTo(s * 20, 0, s * 22, 9); q.quadraticCurveTo(s * 15, 3, s * 9, 2.5); q.closePath(); q.fill(); q.stroke();
    q.strokeStyle = sp8Rgba('#ffffff', 0.7); q.lineWidth = 0.8; q.beginPath(); q.moveTo(s * 12, -1); q.lineTo(s * 20, -5); q.moveTo(s * 12, 1); q.lineTo(s * 20, 5); q.stroke();
  }
  q.fillStyle = col; q.strokeStyle = ko; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, 0, 11, 8.5, 0, 0, 6.2832); q.fill();
  q.save(); q.clip(); q.strokeStyle = sp8Rgba('#ffffff', 0.75); q.lineWidth = 2.4; q.beginPath();
  for (let x = -16; x <= 16; x += 6) { q.moveTo(x, -10); q.lineTo(x + 7, 10); } q.stroke(); q.restore();
  q.beginPath(); q.ellipse(0, 0, 11, 8.5, 0, 0, 6.2832); q.stroke();
  q.fillStyle = 'rgba(255,255,255,.85)'; q.beginPath(); q.ellipse(-4, -3.8, 3.6, 1.8, -0.4, 0, 6.2832); q.fill();
  return sp8Arts[k] = c;
}
function sp8YildizArt() {   // altın yıldız: 40×40 birim (merkez 20,20), yuvarlak köşeli, hâleli
  if (sp8Arts.yil) return sp8Arts.yil;
  const [c, q] = sp8Tuval(40, 40, 3); q.translate(20, 20);
  let gr = q.createRadialGradient(0, 0, 0, 0, 0, 20); gr.addColorStop(0, 'rgba(255,231,168,.6)'); gr.addColorStop(0.45, 'rgba(255,210,122,.22)'); gr.addColorStop(1, 'rgba(255,210,122,0)');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 20, 0, 6.2832); q.fill();
  q.lineJoin = 'round'; q.lineWidth = 3.2; q.strokeStyle = '#e0a040'; sp8Yildiz5(q, 10.5, 0.5); q.stroke();
  gr = q.createRadialGradient(-2, -3, 0, 0, 0, 11); gr.addColorStop(0, '#fffbe6'); gr.addColorStop(0.5, '#ffe7a8'); gr.addColorStop(1, '#ffc95a');
  q.fillStyle = gr; sp8Yildiz5(q, 10.5, 0.5); q.fill();
  q.fillStyle = 'rgba(255,255,255,.9)'; q.beginPath(); q.ellipse(-2.5, -4, 2.4, 1.4, -0.5, 0, 6.2832); q.fill();
  return sp8Arts.yil = c;
}
function sp8FenerArt(ci) {   // fener dizisinin kağıt feneri: 22×26 birim (merkez 11,12; ipe bağlandığı yer 11,2)
  const k = 'f' + ci; if (sp8Arts[k]) return sp8Arts[k];
  const [c, q] = sp8Tuval(22, 26, 3); q.translate(11, 12);
  const col = SP8_REN[ci];
  let gr = q.createRadialGradient(0, 1, 0, 0, 1, 11); gr.addColorStop(0, sp8Rgba(col, 0.5)); gr.addColorStop(1, sp8Rgba(col, 0));
  q.fillStyle = gr; q.beginPath(); q.arc(0, 1, 11, 0, 6.2832); q.fill();
  q.fillStyle = '#3b2a6e'; q.fillRect(-2.6, -9.5, 5.2, 2.4); q.fillRect(-2.2, 7.6, 4.4, 2);
  gr = q.createRadialGradient(-1, 0, 0, 0, 1, 7); gr.addColorStop(0, '#fffbe6'); gr.addColorStop(0.55, mixc(col, '#ffffff', 0.4)); gr.addColorStop(1, col);
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, 0.5, 6, 7.4, 0, 0, 6.2832); q.fill();
  q.strokeStyle = sp8Rgba('#3b2a6e', 0.45); q.lineWidth = 0.7; q.beginPath(); q.ellipse(0, 0.5, 3, 7.2, 0, 0, 6.2832); q.moveTo(0, -6.9); q.lineTo(0, 7.9); q.stroke();
  return sp8Arts[k] = c;
}
function sp8KabakArt(k) {   // çatıdaki / pencere önündeki minik gülen kabak: 36×30 birim, taban ortası (18,28)
  const ad = 'kb' + k; if (sp8Arts[ad]) return sp8Arts[ad];
  const [c, q] = sp8Tuval(36, 30, 3); q.translate(18, 28);
  const gr = q.createRadialGradient(-3, -13, 1, 0, -10, 15); gr.addColorStop(0, '#ffc070'); gr.addColorStop(0.7, '#ff9a3c'); gr.addColorStop(1, '#e8702a');
  q.fillStyle = gr; q.strokeStyle = '#a8501e'; q.lineWidth = 1.2;
  for (const [x, w] of [[-7, 8], [7, 8], [0, 9]]) { q.beginPath(); q.ellipse(x, -10, w, 10, 0, 0, 6.2832); q.fill(); q.stroke(); }
  q.fillStyle = '#5a8a3a'; q.beginPath(); q.moveTo(-1.5, -19); q.quadraticCurveTo(-1, -25, 3, -26); q.lineTo(3.5, -24); q.quadraticCurveTo(1, -23, 1.6, -19); q.fill();
  q.fillStyle = '#7dc45a'; q.beginPath(); q.ellipse(5.5, -22, 3.4, 1.6, -0.5, 0, 6.2832); q.fill();
  // oyulmuş yüz: içi sihirli ışık (sıcak sarı); gözler gülen (^ ^) ya da yuvarlak, kocaman gülümseme
  q.fillStyle = '#fff0a8'; q.strokeStyle = '#ffd27a'; q.lineWidth = 0.6;
  if (k === 0) { for (const s of [-1, 1]) { q.beginPath(); q.moveTo(s * 7.5 - 3, -11); q.quadraticCurveTo(s * 7.5, -16, s * 7.5 + 3, -11); q.quadraticCurveTo(s * 7.5, -13, s * 7.5 - 3, -11); q.fill(); } }
  else if (k === 1) { for (const s of [-1, 1]) { q.beginPath(); q.ellipse(s * 6.5, -12.5, 2.6, 3.2, 0, 0, 6.2832); q.fill(); } q.beginPath(); q.moveTo(8.5, -13); q.lineTo(5, -13); q.stroke(); }
  else { q.beginPath(); q.moveTo(-9.5, -12); q.lineTo(-6.5, -16); q.lineTo(-3.5, -12); q.closePath(); q.fill(); q.beginPath(); q.moveTo(3.5, -12); q.lineTo(6.5, -16); q.lineTo(9.5, -12); q.closePath(); q.fill(); }
  q.beginPath(); q.moveTo(-9, -8); q.quadraticCurveTo(0, 1, 9, -8); q.quadraticCurveTo(0, -3.5, -9, -8); q.fill();
  q.fillStyle = 'rgba(255,143,200,.5)'; for (const s of [-1, 1]) { q.beginPath(); q.ellipse(s * 11, -7.5, 2.4, 1.5, 0, 0, 6.2832); q.fill(); }
  return sp8Arts[ad] = c;
}
function sp8LolipopArt(k) {   // lolipop ağacı: 90×230 birim, taban ortası (45,226): şeker çubuğu + kocaman sarmal şeker + hâle
  const ad = 'lp' + k; if (sp8Arts[ad]) return sp8Arts[ad];
  const [c, q] = sp8Tuval(90, 230, 1.7); q.translate(45, 226);
  const col = k ? '#7dffc4' : '#ff8fc8', ko = k ? '#3fae8a' : '#d0568f', yy = -168;
  let gr = q.createRadialGradient(0, yy, 0, 0, yy, 46); gr.addColorStop(0, sp8Rgba(col, 0.35)); gr.addColorStop(1, sp8Rgba(col, 0));
  q.fillStyle = gr; q.beginPath(); q.arc(0, yy, 46, 0, 6.2832); q.fill();
  q.fillStyle = '#f4ecff'; q.fillRect(-3.2, yy, 6.4, -yy); q.strokeStyle = '#ff8fc8'; q.lineWidth = 2.2; q.beginPath();
  for (let y = yy + 10; y < -4; y += 16) { q.moveTo(-3.2, y); q.lineTo(3.2, y + 7); } q.stroke();
  q.fillStyle = '#fff7fb'; q.beginPath(); q.arc(0, yy, 34, 0, 6.2832); q.fill();
  q.strokeStyle = col; q.lineWidth = 7; q.lineCap = 'round'; q.beginPath();
  for (let i = 0; i <= 60; i++) { const a = i * 0.32, r = 2 + i * 0.5; const x = Math.cos(a) * r, y = yy + Math.sin(a) * r; if (i) q.lineTo(x, y); else q.moveTo(x, y); }
  q.stroke(); q.strokeStyle = ko; q.lineWidth = 2; q.beginPath(); q.arc(0, yy, 34, 0, 6.2832); q.stroke();
  q.fillStyle = 'rgba(255,255,255,.75)'; q.beginPath(); q.ellipse(-12, yy - 14, 8, 4, -0.6, 0, 6.2832); q.fill();
  q.fillStyle = '#c39bff'; q.beginPath(); q.moveTo(0, yy + 34); q.quadraticCurveTo(-14, yy + 40, -12, yy + 50); q.lineTo(0, yy + 38); q.lineTo(12, yy + 50); q.quadraticCurveTo(14, yy + 40, 0, yy + 34); q.fill();
  return sp8Arts[ad] = c;
}
// ── yakın köyün eğri büğrü evleri (6 çeşit; önbellekli). Köken (0,0) = saçak çizgisinin ortası; duvar aşağıya SP8_DUV kadar iner. ──
// ww duvar eni, rh çatı yüksekliği, ov saçak taşması, tip, eg (çatı tepesinin kayması: eğrilik), renkler, baca [x, yükseklik] | null,
// pen pencereler [x, üst y, en, boy], cp çatı penceresi [x, y, r], kb kabak yerleri [x, y] (y: saçağa göre, aşağı +)
const SP8_DUV = 236;
const SP8_EVLER = [
  { ww: 150, rh: 150, ov: 14, tip: 'sivri', eg: 12, cat: '#2f2257', catA: '#4a3585', duv: '#5a3f8f', duvA: '#7c5cb4', baca: [-40, 46], pen: [[-36, 40, 26, 34], [24, 40, 26, 34], [-6, 128, 26, 34]], cp: [2, -52, 12], kb: [[-36, 76], [50, 1]] },
  { ww: 220, rh: 110, ov: 16, tip: 'kubbe', eg: 0, cat: '#3b2a6e', catA: '#5a44a0', duv: '#6e4378', duvA: '#9a68a4', baca: [62, 40], pen: [[-70, 38, 30, 36], [0, 38, 30, 36], [70, 38, 30, 36], [-36, 130, 30, 36], [36, 130, 30, 36]], cp: [0, -62, 13], kb: [[-70, 76], [70, 76], [-34, -86]] },
  { ww: 112, rh: 205, ov: 18, tip: 'kule', eg: 8, cat: '#4a2a6e', catA: '#6c46a4', duv: '#3f5a8a', duvA: '#6a88bc', baca: null, pen: [[0, 44, 26, 46], [0, 142, 24, 40]], cp: [2, -74, 11], kb: [[0, 92]] },
  { ww: 190, rh: 132, ov: 14, tip: 'cifte', eg: -10, cat: '#2a2552', catA: '#463e86', duv: '#4a3585', duvA: '#7058b4', baca: [-58, 50], pen: [[-52, 42, 28, 32], [44, 42, 28, 32], [-4, 128, 28, 34]], cp: [46, -42, 11], kb: [[-52, 76]] },
  { ww: 172, rh: 104, ov: 22, tip: 'yuvarlak', eg: 0, cat: '#5a2a5e', catA: '#7e4684', duv: '#7a5a8e', duvA: '#a688b8', baca: [50, 36], pen: [[-40, 40, 30, 32], [36, 40, 30, 32], [0, 124, 28, 34]], cp: [0, -50, 12], kb: [[-40, 74], [36, 74], [-58, -28]] },
  { ww: 160, rh: 165, ov: 14, tip: 'sivri', eg: -18, cat: '#25305a', catA: '#3e4f8a', duv: '#56408a', duvA: '#8066bc', baca: [44, 72], pen: [[-32, 40, 26, 36], [30, 40, 26, 36], [0, 132, 26, 36]], cp: [-6, -62, 12], kb: [[-32, 78]] }];
function sp8CatiY(d, x) {   // çatının x'teki üst kenarı (saçak çizgisine göre, yukarı −), baca yerleşimi için yaklaşık
  const h = d.ww / 2 + d.ov, u = clamp(Math.abs(x - d.eg) / h, 0, 1);
  if (d.tip === 'kubbe') return -d.rh * (u < 0.45 ? 1 : 1 - (u - 0.45) / 0.55 * 0.9);
  if (d.tip === 'yuvarlak') return -d.rh * Math.sqrt(Math.max(0, 1 - u * u));
  return -d.rh * (1 - u);
}
function sp8CatiYol(q, d) {   // çatı çokgeni (yol): saçaktan tepeye, biraz eğri büğrü
  const h = d.ww / 2 + d.ov, rh = d.rh, e = d.eg;
  q.beginPath(); q.moveTo(-h, 2);
  if (d.tip === 'sivri') { q.quadraticCurveTo(-h * 0.36 + e * 0.3, -rh * 0.42, e, -rh); q.quadraticCurveTo(h * 0.36 + e * 0.3, -rh * 0.42, h, 2); }
  else if (d.tip === 'kule') { q.quadraticCurveTo(-h * 0.22 + e * 0.4, -rh * 0.22, e, -rh); q.quadraticCurveTo(h * 0.22 + e * 0.4, -rh * 0.22, h, 2); }
  else if (d.tip === 'kubbe') { q.lineTo(-h + 10, -rh * 0.52); q.quadraticCurveTo(-h * 0.5, -rh * 1.02, -h * 0.2, -rh); q.lineTo(h * 0.2, -rh); q.quadraticCurveTo(h * 0.5, -rh * 1.02, h - 10, -rh * 0.52); q.lineTo(h, 2); }
  else if (d.tip === 'yuvarlak') { q.bezierCurveTo(-h * 1.02, -rh * 0.8, -h * 0.5, -rh * 1.05, 0, -rh); q.bezierCurveTo(h * 0.5, -rh * 1.05, h * 1.02, -rh * 0.8, h, 2); }
  else { q.lineTo(-h * 0.12 + e, -rh); q.lineTo(h, 2); }   // çifte: büyük üçgen (ön üçgen ayrıca)
  q.quadraticCurveTo(0, 9, -h, 2); q.closePath();
}
function sp8Pencere(q, x, y, w, h, perde) {   // ışıklı pencere: kemerli, çapraz kayıtlı, pervazlı; çevresinde sıcak ışık
  const gr0 = q.createRadialGradient(x, y + h / 2, 2, x, y + h / 2, Math.max(w, h) * 1.25);
  gr0.addColorStop(0, 'rgba(255,200,110,.38)'); gr0.addColorStop(1, 'rgba(255,200,110,0)');
  q.globalCompositeOperation = 'lighter'; q.fillStyle = gr0; q.fillRect(x - w * 1.4, y - h * 0.8, w * 2.8, h * 2.6); q.globalCompositeOperation = 'source-over';
  const yol = () => { q.beginPath(); q.moveTo(x - w / 2, y + h); q.lineTo(x - w / 2, y + w / 2); q.arc(x, y + w / 2, w / 2, Math.PI, 0); q.lineTo(x + w / 2, y + h); q.closePath(); };
  q.fillStyle = '#1c1438'; q.save(); q.translate(x, y + h / 2); q.scale(1.18, 1.1); q.translate(-x, -y - h / 2); yol(); q.fill(); q.restore();
  const gr = q.createLinearGradient(x - w / 2, y + h, x + w / 2, y); gr.addColorStop(0, '#fff2c0'); gr.addColorStop(0.5, '#ffd27a'); gr.addColorStop(1, '#ffb347');
  q.fillStyle = gr; yol(); q.fill();
  if (perde) { q.fillStyle = 'rgba(255,143,200,.55)'; q.beginPath(); q.moveTo(x - w / 2, y + w / 2 - 2); q.quadraticCurveTo(x - w * 0.15, y + h * 0.3, x - w / 2, y + h * 0.75); q.closePath(); q.fill();
    q.beginPath(); q.moveTo(x + w / 2, y + w / 2 - 2); q.quadraticCurveTo(x + w * 0.15, y + h * 0.3, x + w / 2, y + h * 0.75); q.closePath(); q.fill(); }
  q.strokeStyle = '#3b2a6e'; q.lineWidth = 2; q.beginPath(); q.moveTo(x, y + 1); q.lineTo(x, y + h); q.moveTo(x - w / 2, y + h * 0.55); q.lineTo(x + w / 2, y + h * 0.55); q.stroke();
  q.fillStyle = '#2a1f4e'; q.fillRect(x - w / 2 - 5, y + h, w + 10, 4.5); q.fillStyle = 'rgba(255,255,255,.12)'; q.fillRect(x - w / 2 - 5, y + h, w + 10, 1.5);
}
function sp8BacaCiz(q, x, y0, y1, w) {   // tuğla baca: y0 alt (çatının içinde), y1 üst
  q.fillStyle = '#5e4266'; q.fillRect(x - w / 2, y1, w, y0 - y1);
  q.strokeStyle = 'rgba(40,24,52,.55)'; q.lineWidth = 1.1; q.beginPath();
  for (let y = y1 + 8, i = 0; y < y0; y += 8, i++) { q.moveTo(x - w / 2, y); q.lineTo(x + w / 2, y); const ox = i % 2 ? -w / 4 : w / 4; q.moveTo(x + ox, y - 8); q.lineTo(x + ox, y); }
  q.stroke();
  q.fillStyle = 'rgba(255,220,240,.12)'; q.fillRect(x - w / 2, y1, 3, y0 - y1);
  q.fillStyle = '#3e2a4c'; q.fillRect(x - w / 2 - 4, y1 - 6, w + 8, 7); q.fillStyle = 'rgba(255,220,240,.18)'; q.fillRect(x - w / 2 - 4, y1 - 6, w + 8, 1.6);
}
function sp8EvArt(k, bacasiz) {   // evin önbellek tuvali: { c, ox, oy, w, h }
  const ad = 'ev' + k + (bacasiz ? 'b' : ''); if (sp8Arts[ad]) return sp8Arts[ad];
  const d = SP8_EVLER[k], h = d.ww / 2 + d.ov, ust = d.rh + 96, W = h * 2 + 48, H = ust + SP8_DUV;
  const [c, q] = sp8Tuval(W, H, 1.7); q.translate(W / 2, ust); q.lineJoin = 'round'; q.lineCap = 'round';
  const r = rng(300 + k * 41), K = '#1c1438', hw = d.ww / 2;
  // duvar (aşağı doğru hafif genişler, eğri büğrü), tahta dokusu, ahşap kirişler
  const duv = () => { q.beginPath(); q.moveTo(-hw, -2); q.lineTo(hw, -2); q.lineTo(hw + 5 + d.eg * 0.12, SP8_DUV); q.lineTo(-hw - 5 + d.eg * 0.12, SP8_DUV); q.closePath(); };
  let gr = q.createLinearGradient(-hw, 0, hw * 0.6, SP8_DUV); gr.addColorStop(0, d.duvA); gr.addColorStop(0.55, d.duv); gr.addColorStop(1, mixc(d.duv, '#1c1438', 0.45));
  q.fillStyle = gr; duv(); q.fill();
  q.save(); duv(); q.clip();
  q.strokeStyle = 'rgba(28,20,56,.22)'; q.lineWidth = 1.2; q.beginPath();
  for (let y = 12; y < SP8_DUV; y += 13) { q.moveTo(-hw - 8, y + (r() - 0.5) * 2); q.lineTo(hw + 8, y + (r() - 0.5) * 2); }
  q.stroke();
  if (d.tip === 'kubbe' || d.tip === 'cifte') { q.fillStyle = 'rgba(42,28,74,.85)'; for (const x of [-hw + 4, hw - 8, -hw * 0.38, hw * 0.3]) q.fillRect(x, 0, 5, SP8_DUV); q.fillRect(-hw, 92, d.ww, 5); }
  q.fillStyle = 'rgba(255,230,250,.06)'; q.fillRect(-hw, 0, 8, SP8_DUV);
  q.restore();
  q.strokeStyle = K; q.lineWidth = 2.6; duv(); q.stroke();
  for (let i = 0; i < d.pen.length; i++) { const p = d.pen[i]; sp8Pencere(q, p[0], p[1], p[2], p[3], (i + k) % 3 === 0); }
  // baca (çatının arkasından çıkar: önce baca, sonra çatı)
  if (d.baca && !bacasiz) { const bx = d.baca[0], ty = sp8CatiY(d, bx); sp8BacaCiz(q, bx, ty + 26, ty - d.baca[1], 20); }
  // çatı: pul sıraları, kenar, saçak gölgesi
  gr = q.createLinearGradient(-h, -d.rh, h * 0.4, 0); gr.addColorStop(0, d.catA); gr.addColorStop(0.5, d.cat); gr.addColorStop(1, mixc(d.cat, '#120c26', 0.4));
  q.fillStyle = gr; sp8CatiYol(q, d); q.fill();
  q.save(); sp8CatiYol(q, d); q.clip();
  q.fillStyle = sp8Rgba(d.catA, 0.5);
  for (let y = -d.rh + 8, i = 0; y < 8; y += 11, i++) for (let x = -h - 6 + (i % 2) * 6; x < h + 8; x += 12) { q.beginPath(); q.arc(x, y, 6, 0, Math.PI); q.fill(); }
  q.strokeStyle = 'rgba(18,12,38,.35)'; q.lineWidth = 1; q.beginPath();
  for (let y = -d.rh + 8; y < 8; y += 11) { q.moveTo(-h - 4, y); q.lineTo(h + 4, y); } q.stroke();
  q.restore();
  q.strokeStyle = K; q.lineWidth = 2.8; sp8CatiYol(q, d); q.stroke();
  if (d.tip === 'cifte') {   // ön küçük üçgen (bir adım öne çıkan cumba çatısı)
    const a = hw * 0.05, b = h, tx = hw * 0.55, ty = -d.rh * 0.66;
    q.fillStyle = mixc(d.cat, d.catA, 0.55); q.beginPath(); q.moveTo(a, 3); q.lineTo(tx, ty); q.lineTo(b, 3); q.closePath(); q.fill();
    q.strokeStyle = K; q.lineWidth = 2.6; q.stroke();
    q.strokeStyle = 'rgba(255,230,250,.25)'; q.lineWidth = 1.4; q.beginPath(); q.moveTo(a + 6, 0); q.lineTo(tx, ty + 6); q.stroke();
  }
  q.strokeStyle = 'rgba(255,230,250,.22)'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(-h + 4, -1); q.quadraticCurveTo(-h * 0.36 + d.eg * 0.3, -d.rh * 0.42, d.eg, -d.rh + 4); q.stroke();
  q.fillStyle = 'rgba(18,12,38,.55)'; q.beginPath(); q.moveTo(-h, 2); q.quadraticCurveTo(0, 9, h, 2); q.lineTo(hw, 10); q.lineTo(-hw, 10); q.closePath(); q.fill();
  // çatı penceresi (yuvarlak) ve tepe süsü
  if (d.cp) {
    const [x, y, rr] = d.cp; gr = q.createRadialGradient(x, y, 1, x, y, rr * 2.4); gr.addColorStop(0, 'rgba(255,200,110,.4)'); gr.addColorStop(1, 'rgba(255,200,110,0)');
    q.globalCompositeOperation = 'lighter'; q.fillStyle = gr; q.fillRect(x - rr * 2.5, y - rr * 2.5, rr * 5, rr * 5); q.globalCompositeOperation = 'source-over';
    q.fillStyle = K; q.beginPath(); q.arc(x, y, rr + 3, 0, 6.2832); q.fill();
    gr = q.createRadialGradient(x - 2, y + 2, 1, x, y, rr); gr.addColorStop(0, '#fff2c0'); gr.addColorStop(1, '#ffb347'); q.fillStyle = gr; q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill();
    q.strokeStyle = '#3b2a6e'; q.lineWidth = 1.8; q.beginPath(); q.moveTo(x - rr, y); q.lineTo(x + rr, y); q.moveTo(x, y - rr); q.lineTo(x, y + rr); q.stroke();
  }
  if (d.tip === 'kule' || d.tip === 'sivri') {   // tepede kıvrık uç ve minik altın yıldız
    q.strokeStyle = K; q.lineWidth = 2.6; q.beginPath(); q.moveTo(d.eg, -d.rh + 1); q.quadraticCurveTo(d.eg + 9, -d.rh - 12, d.eg + 16, -d.rh - 6); q.stroke();
    q.save(); q.translate(d.eg + 17, -d.rh - 8); q.fillStyle = '#ffe08a'; sp8Yildiz5(q, 5.5, 0.5); q.fill(); q.restore();
  }
  return sp8Arts[ad] = { c, ox: W / 2, oy: ust, w: W, h: H };
}
function sp8OnSeritArt() {   // ön plan: koyu çatı siluetleri şeridi (1600 birim, döşenebilir), birkaç sıcak pencere
  if (sp8Arts.on) return sp8Arts.on;
  const W = 1600, H = 150, [c, q] = sp8Tuval(W, H, 1.1), r = rng(6161);
  q.fillStyle = '#1a1233';
  const ev = (x, w, ust, tip) => {
    q.beginPath(); q.moveTo(x, H); q.lineTo(x, ust + 26);
    if (tip) { q.lineTo(x - 8, ust + 28); q.quadraticCurveTo(x + w * 0.3, ust + 6, x + w * 0.5, ust - 30); q.quadraticCurveTo(x + w * 0.7, ust + 6, x + w + 8, ust + 28); }
    else { q.lineTo(x - 6, ust + 28); q.quadraticCurveTo(x + w * 0.5, ust - 22, x + w + 6, ust + 28); }
    q.lineTo(x + w, ust + 26); q.lineTo(x + w, H); q.closePath(); q.fill();
  };
  const L = [];
  for (let x = -40; x < W - 60;) { const w = 110 + r() * 120, ust = 40 + r() * 40; L.push([x, w, ust, r() < 0.6]); x += w + 6 + r() * 30; }
  for (const e of L) { ev(e[0], e[1], e[2], e[3]); ev(e[0] + W, e[1], e[2], e[3]); ev(e[0] - W, e[1], e[2], e[3]); }
  for (const e of L) {   // sıcak pencereler (yalnız bazıları)
    if (r() < 0.45) continue;
    const x = e[0] + e[1] * (0.3 + r() * 0.4), y = e[2] + 50 + r() * 20;
    for (const ox of [0, W, -W]) {
      const gr = q.createRadialGradient(x + ox, y, 1, x + ox, y, 26); gr.addColorStop(0, 'rgba(255,190,100,.35)'); gr.addColorStop(1, 'rgba(255,190,100,0)');
      q.fillStyle = gr; q.fillRect(x + ox - 26, y - 26, 52, 52); q.fillStyle = '#ffc46a'; q.fillRect(x + ox - 6, y - 7, 12, 14);
      q.fillStyle = '#1a1233'; q.fillRect(x + ox - 0.8, y - 7, 1.6, 14); q.fillRect(x + ox - 6, y - 0.8, 12, 1.6);
    }
  }
  return sp8Arts.on = { c, w: W, h: H };
}
function sp8AyArt() {   // yedek ay (dunya8 dn8Ay vermezse): kocaman, gülen bal rengi ay; 512 px, yarıçap 200 piksel + hâle
  if (sp8Arts.ay) return sp8Arts.ay;
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N; const q = c.getContext('2d'), m = N / 2, R = 172;
  let gr = q.createRadialGradient(m, m, R * 0.9, m, m, m); gr.addColorStop(0, 'rgba(255,231,168,.42)'); gr.addColorStop(0.4, 'rgba(255,210,140,.14)'); gr.addColorStop(1, 'rgba(255,200,140,0)');
  q.fillStyle = gr; q.fillRect(0, 0, N, N);
  gr = q.createRadialGradient(m - R * 0.3, m - R * 0.35, R * 0.1, m, m, R); gr.addColorStop(0, '#fff6d8'); gr.addColorStop(0.6, '#ffe7a8'); gr.addColorStop(1, '#f6c978');
  q.fillStyle = gr; q.beginPath(); q.arc(m, m, R, 0, 6.2832); q.fill();
  q.fillStyle = 'rgba(230,180,110,.28)';   // yumuşak lekeler
  for (const [x, y, r] of [[-70, -60, 26], [60, -86, 16], [84, 40, 22], [-40, 90, 18], [10, -110, 10], [-100, 20, 12]]) { q.beginPath(); q.arc(m + x, m + y, r, 0, 6.2832); q.fill(); }
  q.strokeStyle = '#d99a5a'; q.lineWidth = 7; q.lineCap = 'round';   // gülen yüz: kapalı mutlu gözler, tatlı gülümseme, pembe yanaklar
  for (const s of [-1, 1]) { q.beginPath(); q.arc(m + s * 52, m - 10, 20, Math.PI * 1.1, Math.PI * 1.9); q.stroke(); }
  q.beginPath(); q.arc(m, m + 26, 50, Math.PI * 0.18, Math.PI * 0.82); q.stroke();
  q.fillStyle = 'rgba(255,143,170,.35)'; for (const s of [-1, 1]) { q.beginPath(); q.ellipse(m + s * 92, m + 30, 24, 14, 0, 0, 6.2832); q.fill(); }
  return sp8Arts.ay = { c, r: R, n: N };
}
// ── süpürge: kazan.js'in ortak çizicisi (kazanSupurgeCiz) varsa o; yoksa aynı görünüşte yedek. (x, y) süpürgenin ortası = oturma yeri. ──
function sp8SapArt() {   // bal rengi sap: 130×26 birim, köken (16,13); topuz +104'te, pembe kurdele sargısı +40..+50'de
  if (sp8Arts.sap) return sp8Arts.sap;
  const [c, q] = sp8Tuval(130, 26, 3); q.translate(16, 13); q.lineCap = 'round';
  const yol = (o) => { q.beginPath(); q.moveTo(-12, 1 + o); q.quadraticCurveTo(46, -2.5 + o, 102, 0.5 + o); };
  q.strokeStyle = '#a8692e'; q.lineWidth = 8; yol(0); q.stroke();
  q.strokeStyle = '#e0a35a'; q.lineWidth = 5.4; yol(0); q.stroke();
  q.strokeStyle = '#f6c98a'; q.lineWidth = 1.6; yol(-1.5); q.stroke();
  q.strokeStyle = 'rgba(140,80,30,.45)'; q.lineWidth = 0.8; q.beginPath();
  for (const [a, b] of [[0, 14], [22, 34], [60, 74], [84, 96]]) { q.moveTo(a, 0.6); q.quadraticCurveTo((a + b) / 2, 1.4, b, 0.4); } q.stroke();
  q.fillStyle = '#a8692e'; q.beginPath(); q.arc(104, 0.4, 6.4, 0, 6.2832); q.fill();
  q.fillStyle = '#e0a35a'; q.beginPath(); q.arc(104, 0.4, 5, 0, 6.2832); q.fill();
  q.fillStyle = '#fbe0b0'; q.beginPath(); q.arc(102.4, -1.4, 1.8, 0, 6.2832); q.fill();
  for (let x = 40; x <= 50; x += 3.4) {   // pembe kurdele sargısı
    q.fillStyle = '#ff8fc8'; q.beginPath(); q.moveTo(x, -4); q.lineTo(x + 2.4, -4); q.lineTo(x + 0.6, 4.4); q.lineTo(x - 1.8, 4.4); q.closePath(); q.fill();
    q.fillStyle = '#ffc6e2'; q.fillRect(x + 0.3, -3.6, 1, 2.2);
  }
  return sp8Arts.sap = c;
}
function sp8CaliArt() {   // altın saman çalı: 74×48 birim, köken (66,24): bağdan (x −8) uca (x −62) yelpaze gibi açılır; mor kurdele düğümü
  if (sp8Arts.cali) return sp8Arts.cali;
  const [c, q] = sp8Tuval(74, 48, 3); q.translate(66, 24); q.lineCap = 'round'; q.lineJoin = 'round';
  const yol = () => { q.beginPath(); q.moveTo(-6, -5.5); q.quadraticCurveTo(-30, -9, -55, -18); q.quadraticCurveTo(-66, -12, -64, 0); q.quadraticCurveTo(-66, 12, -55, 18); q.quadraticCurveTo(-30, 9, -6, 5.5); q.closePath(); };
  q.fillStyle = '#c08030'; q.save(); q.translate(-1, 1.2); yol(); q.fill(); q.restore();
  const gr = q.createLinearGradient(0, -18, 0, 18); gr.addColorStop(0, '#ffe7a8'); gr.addColorStop(0.45, '#ffd27a'); gr.addColorStop(1, '#e0a040');
  q.fillStyle = gr; yol(); q.fill();
  q.save(); yol(); q.clip();
  for (let i = 0; i < 26; i++) {   // saman telleri
    const u = i / 25 - 0.5, y0 = u * 9, y1 = u * 36 + Math.sin(i * 2.3) * 2;
    q.strokeStyle = i % 3 === 0 ? '#e0a040' : i % 3 === 1 ? '#fff0c8' : '#f0b850'; q.lineWidth = i % 3 === 1 ? 0.8 : 1.1;
    q.beginPath(); q.moveTo(-8, y0); q.quadraticCurveTo(-36, y0 + (y1 - y0) * 0.45, -66, y1); q.stroke();
  }
  q.restore();
  q.strokeStyle = '#b07028'; q.lineWidth = 1.4; yol(); q.stroke();
  // mor bağ ve fiyonk
  q.fillStyle = '#5a36a8'; q.beginPath(); q.roundRect ? q.roundRect(-17, -7.5, 11, 15, 2.5) : q.rect(-17, -7.5, 11, 15); q.fill();
  q.fillStyle = '#7b4fd0'; q.fillRect(-16, -6.5, 9, 13); q.fillStyle = '#a98cf0'; q.fillRect(-15.5, -6, 8, 2.4);
  for (const s of [-1, 1]) { q.fillStyle = '#7b4fd0'; q.beginPath(); q.ellipse(-11.5 + s * 5.5, -9.5, 5, 3.2, s * 0.5, 0, 6.2832); q.fill(); q.fillStyle = '#a98cf0'; q.beginPath(); q.ellipse(-11.5 + s * 5.8, -10.4, 2.4, 1.3, s * 0.5, 0, 6.2832); q.fill(); }
  q.fillStyle = '#5a36a8'; q.beginPath(); q.arc(-11.5, -9, 2.6, 0, 6.2832); q.fill();
  return sp8Arts.cali = c;
}
function sp8SupurgeYedek(c, x, y, s, t, o) {
  const aci = o && +o.aci || 0, yon = o && o.yon === -1 ? -1 : 1, kip = o && o.kipir != null ? +o.kipir : 0.5, isik = o && +o.isik || 0, al = o && o.alfa != null ? +o.alfa : 1;
  c.save(); if (al < 1) c.globalAlpha *= al; c.translate(x, y); c.rotate(aci); c.scale(s * yon, s);
  if (isik > 0.01) { const ga = c.globalAlpha; c.globalCompositeOperation = 'lighter'; c.globalAlpha = ga * Math.min(1, isik) * 0.45; c.drawImage(glow('#ffd27a'), -95, -46, 190, 92); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over'; }
  const w = Math.sin(t * 13) * kip, w2 = Math.sin(t * 8.7 + 1) * kip;
  c.save(); c.translate(-8, 0); c.rotate(w2 * 0.05); c.scale(1 + w * 0.03, 1 + w * 0.08); c.drawImage(sp8CaliArt(), -58, -24, 74, 48); c.restore();
  // yıldız süsü (düğümden sarkan ipte sallanır)
  const sa = Math.sin(t * 3.1) * 0.45 * (0.4 + kip) + 0.15, sx = -11.5 + Math.sin(sa) * 11, sy = -6 + Math.cos(sa) * 11;
  c.strokeStyle = '#7b4fd0'; c.lineWidth = 0.9; c.beginPath(); c.moveTo(-11.5, -6); c.lineTo(sx, sy); c.stroke();
  c.save(); c.translate(sx, sy + 3); c.rotate(sa * 0.6); c.fillStyle = '#e0a040'; sp8Yildiz5(c, 4.6, 0.5); c.fill(); c.fillStyle = '#ffe08a'; sp8Yildiz5(c, 3.6, 0.5); c.fill(); c.fillStyle = '#fff'; c.fillRect(-1.4, -2, 1.2, 1.2); c.restore();
  c.drawImage(sp8SapArt(), -16, -13, 130, 26);
  // pembe kurdelenin uçları rüzgârda dalgalanır
  c.fillStyle = '#ff8fc8';
  for (let k = 0; k < 2; k++) {
    const f = t * (9 + k * 2) + k * 1.7, a = Math.sin(f) * 2.2, b = Math.sin(f + 1.2) * 2.6;
    c.beginPath(); c.moveTo(45, 3); c.quadraticCurveTo(38, 7 + a + k * 2, 29 - k * 3, 7 + b + k * 3); c.lineTo(30 - k * 3, 10.5 + b + k * 3); c.quadraticCurveTo(39, 11 + a + k * 2, 47, 4.5); c.closePath(); c.fill();
  }
  c.restore();
}
function supurgeCiz(c, x, y, s, t, o) {   // ortak süpürge çizici (kazan.js'inki varsa o)
  if (typeof kazanSupurgeCiz === 'function') { try { kazanSupurgeCiz(c, x, y, s, t, o); return; } catch (e) { /* yedeğe düş */ } }
  sp8SupurgeYedek(c, x, y, s, t, o);
}

// ── kara kedi (kabak.js kediCiz varsa o; yoksa yedek): şapkalı, iri yeşil gözlü, tatlı. (x, y) oturduğu yer, sağa bakar. ──
function sp8KediYedek(c, x, y, s, t, o) {
  const yon = o && o.yon === -1 ? -1 : 1, z = o && +o.zipla || 0, el = o && +o.el || 0, kuy = o && o.kuyruk != null ? +o.kuyruk : 0.6, rz = o && +o.ruzgar || 0;
  c.save(); c.translate(x, y); c.scale(s * yon * (1 + z * 0.22), s * (1 - z * 0.14)); c.lineCap = 'round'; c.lineJoin = 'round';
  const B = '#2b2240', R = '#4c3d72';
  // kuyruk: arkadan yukarı kıvrılır, sallanır
  const sw = Math.sin(t * 2.6) * 6 * kuy - rz * 6;
  c.strokeStyle = B; c.lineWidth = 4.6; c.beginPath(); c.moveTo(-8, -4); c.quadraticCurveTo(-21 + sw * 0.3, -8, -19 + sw, -22); c.quadraticCurveTo(-18 + sw * 1.2, -27, -14 + sw, -26); c.stroke();
  c.strokeStyle = R; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-19 + sw, -21); c.quadraticCurveTo(-18 + sw * 1.2, -26, -15 + sw, -25.5); c.stroke();
  // gövde (armut), ön patiler
  c.fillStyle = B; c.beginPath(); c.moveTo(-10, 0); c.quadraticCurveTo(-13, -16, -3, -19); c.quadraticCurveTo(8, -18, 8, -6); c.quadraticCurveTo(9, 0, 4, 0); c.closePath(); c.fill();
  c.strokeStyle = R; c.lineWidth = 1.3; c.beginPath(); c.moveTo(-10, -6); c.quadraticCurveTo(-11, -15, -3, -18); c.stroke();
  c.fillStyle = '#3a2f58'; c.beginPath(); c.ellipse(2.5, -1.4, 3, 2, 0, 0, 6.2832); c.ellipse(7, -1.4, 3, 2, 0, 0, 6.2832); c.fill();
  if (el > 0.02) { const a = -1.2 - Math.sin(t * 11) * 0.35 * el; c.strokeStyle = B; c.lineWidth = 3.6; c.beginPath(); c.moveTo(5, -9); c.lineTo(5 + Math.cos(a) * 9 * el, -9 + Math.sin(a) * 9 * el); c.stroke(); }
  // baş, kulaklar
  c.fillStyle = B; c.beginPath(); c.arc(5, -25, 9.4, 0, 6.2832); c.fill();
  for (const [a, b] of [[-1, 0], [1, 9]]) { c.fillStyle = B; c.beginPath(); c.moveTo(b - 5.5, -30); c.lineTo(b - 3.6 + a * 0.6, -40); c.lineTo(b + 0.6, -32); c.closePath(); c.fill(); c.fillStyle = '#ff9fc8'; c.beginPath(); c.moveTo(b - 4.3, -31); c.lineTo(b - 3.4 + a * 0.5, -37); c.lineTo(b - 0.8, -32); c.closePath(); c.fill(); }
  c.strokeStyle = R; c.lineWidth = 1.2; c.beginPath(); c.arc(5, -25, 9, -2.6, -1.2); c.stroke();
  // gözler: iri yeşil, parlak; ara sıra mutlu kırpma
  const kirp = ((t + 1.3) % 4.2) < 0.14;
  if (kirp) { c.strokeStyle = '#8dffa8'; c.lineWidth = 1.6; c.beginPath(); c.arc(2, -24.5, 2.4, Math.PI * 1.1, Math.PI * 1.9); c.arc(8.6, -24.5, 2.4, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
  else {
    c.fillStyle = '#9dffb4'; c.beginPath(); c.ellipse(2, -25, 2.9, 3.4, 0, 0, 6.2832); c.ellipse(8.6, -25, 2.9, 3.4, 0, 0, 6.2832); c.fill();
    c.fillStyle = '#18301f'; c.beginPath(); c.ellipse(2.5, -24.6, 1.3, 2.4, 0, 0, 6.2832); c.ellipse(9.1, -24.6, 1.3, 2.4, 0, 0, 6.2832); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(1.4, -26.4, 1, 0, 6.2832); c.arc(8, -26.4, 1, 0, 6.2832); c.fill();
  }
  c.fillStyle = '#ff9fc8'; c.beginPath(); c.moveTo(4.6, -21.6); c.lineTo(6.6, -21.6); c.lineTo(5.6, -20.4); c.closePath(); c.fill();
  c.strokeStyle = '#ff9fc8'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(5.6, -20.4); c.quadraticCurveTo(4.6, -19, 3.6, -19.8); c.moveTo(5.6, -20.4); c.quadraticCurveTo(6.6, -19, 7.6, -19.8); c.stroke();
  c.fillStyle = 'rgba(255,143,200,.4)'; c.beginPath(); c.ellipse(0, -21, 2, 1.2, 0, 0, 6.2832); c.ellipse(11, -21, 2, 1.2, 0, 0, 6.2832); c.fill();
  c.strokeStyle = 'rgba(230,220,255,.55)'; c.lineWidth = 0.6; c.beginPath(); c.moveTo(10, -21.5); c.lineTo(16, -22.5); c.moveTo(10, -20.5); c.lineTo(16, -20); c.moveTo(1, -21.5); c.lineTo(-4, -22.5); c.stroke();
  // minik cadı şapkası (geriye yatık, ucu kıvrık, yıldızlı)
  c.save(); c.translate(5, -32.5); c.rotate(-0.22 - rz * 0.1);
  c.fillStyle = '#4a2a9a'; c.beginPath(); c.ellipse(0, 0, 10, 2.6, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#6a3fc0'; c.beginPath(); c.moveTo(-6, -0.5); c.quadraticCurveTo(-3, -9, -1, -15); c.quadraticCurveTo(2 - rz * 3, -19, -4 - rz * 4, -18 + Math.sin(t * 3) * 0.8); c.quadraticCurveTo(2, -14, 6, -0.5); c.closePath(); c.fill();
  c.fillStyle = '#ff8fc8'; c.fillRect(-5.6, -3, 11.2, 2.2);
  c.translate(0.5, -8); c.fillStyle = '#ffe08a'; sp8Yildiz5(c, 2.6, 0.5); c.fill();
  c.restore();
  c.restore();
}
function sp8KediCiz(c, x, y, s, t, o) {
  if (typeof kediCiz === 'function') { try { kediCiz(c, x, y, s, t, o); return; } catch (e) { /* yedeğe düş */ } }
  sp8KediYedek(c, x, y, s, t, o);
}
// ── mor-lila yarasa (kabak.js yarasaCiz varsa o): top gövde, iri gözler, gülümseme; diş yok. (x, y) gövde ortası. ──
function sp8YarasaYedek(c, x, y, s, t, o) {
  const f = (o && +o.kanat || 0), yon = o && o.yon === -1 ? -1 : 1;
  c.save(); c.translate(x, y); c.scale(s * yon, s); c.lineJoin = 'round';
  const a = Math.sin(f) * 0.75;
  for (const k of [-1, 1]) {   // kanatlar (omuzdan çırpar), alt kenarı dalgalı
    c.save(); c.translate(k * 6, -2); c.rotate(k * a); c.scale(k, 1);
    c.fillStyle = '#6e4fc0'; c.beginPath(); c.moveTo(0, -3); c.quadraticCurveTo(12, -16, 27, -9); c.quadraticCurveTo(24, -3, 21, 1); c.quadraticCurveTo(17, -2, 14, 3); c.quadraticCurveTo(9, -1, 5, 5); c.quadraticCurveTo(2, 3, 0, 4); c.closePath(); c.fill();
    c.strokeStyle = '#9a7ae0'; c.lineWidth = 1; c.beginPath(); c.moveTo(2, -2); c.lineTo(21, -6); c.moveTo(2, -1); c.lineTo(14, 1); c.stroke();
    c.restore();
  }
  c.fillStyle = '#a88be0'; c.beginPath(); c.arc(0, 0, 9.5, 0, 6.2832); c.fill();
  c.fillStyle = '#c9b3f5'; c.beginPath(); c.ellipse(0, 3.5, 5.6, 4.6, 0, 0, 6.2832); c.fill();
  for (const k of [-1, 1]) { c.fillStyle = '#a88be0'; c.beginPath(); c.moveTo(k * 3, -7.5); c.quadraticCurveTo(k * 6, -15, k * 8.4, -13); c.quadraticCurveTo(k * 8.6, -9, k * 7.6, -5.5); c.closePath(); c.fill(); c.fillStyle = '#ffb3d9'; c.beginPath(); c.moveTo(k * 4.4, -8); c.quadraticCurveTo(k * 6.4, -12.5, k * 7.6, -11.5); c.lineTo(k * 7, -7); c.closePath(); c.fill(); }
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(-3.6, -2, 3.3, 0, 6.2832); c.arc(3.6, -2, 3.3, 0, 6.2832); c.fill();
  c.fillStyle = '#2a1f4e'; c.beginPath(); c.arc(-3, -1.6, 1.9, 0, 6.2832); c.arc(4.2, -1.6, 1.9, 0, 6.2832); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(-3.6, -2.6, 0.8, 0, 6.2832); c.arc(3.6, -2.6, 0.8, 0, 6.2832); c.fill();
  c.strokeStyle = '#5a3a9a'; c.lineWidth = 1; c.lineCap = 'round'; c.beginPath(); c.arc(0.4, 1.8, 2.4, 0.3, Math.PI - 0.3); c.stroke();
  c.fillStyle = 'rgba(255,143,200,.55)'; c.beginPath(); c.ellipse(-6, 1.5, 1.8, 1.1, 0, 0, 6.2832); c.ellipse(6.8, 1.5, 1.8, 1.1, 0, 0, 6.2832); c.fill();
  c.restore();
}
function sp8YarasaCiz(c, x, y, s, t, o) {
  if (typeof yarasaCiz === 'function') { try { yarasaCiz(c, x, y, s, t, o); return; } catch (e) { /* yedeğe düş */ } }
  sp8YarasaYedek(c, x, y, s, t, o);
}
// ── bacadan çıkan pastel hayalet (kabak.js hayaletCiz varsa o): yumuşak, pembe yanaklı, kıkırdar, el sallar. (x, y) taban ortası. ──
function sp8HayaletYedek(c, x, y, s, t, o) {
  const el = o && +o.el || 0, kik = o && +o.kik || 0, al = o && o.alfa != null ? +o.alfa : 1, yon = o && o.yon === -1 ? -1 : 1;
  c.save(); if (al < 1) c.globalAlpha *= al; c.translate(x, y); c.scale(s * yon, s); c.lineJoin = 'round';
  const sw = Math.sin(t * 2.2) * 1.5;
  c.globalCompositeOperation = 'lighter'; const ga = c.globalAlpha; c.globalAlpha = ga * 0.35; c.drawImage(glow('#e6dcff'), -34, -64, 68, 68); c.globalAlpha = ga; c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#f6f0ff'; c.beginPath(); c.moveTo(-14, 2); c.quadraticCurveTo(-16 + sw, -20, -12, -30); c.arc(0, -30, 13.5, Math.PI, 0); c.quadraticCurveTo(16 + sw, -20, 14, 2);
  for (let i = 0; i < 4; i++) { const x0 = 14 - i * 7, w = Math.sin(t * 4 + i) * 1.4; c.quadraticCurveTo(x0 - 3.5, 6 + w, x0 - 7, 2); }
  c.closePath(); c.fill();
  c.fillStyle = 'rgba(200,184,245,.45)'; c.beginPath(); c.moveTo(14, 2); c.quadraticCurveTo(16 + sw, -20, 10, -38); c.quadraticCurveTo(10, -18, 4, 2); c.closePath(); c.fill();
  // kollar: biri el sallar
  c.fillStyle = '#f6f0ff';
  c.beginPath(); c.ellipse(-15, -16, 4.4, 3.2, -0.5, 0, 6.2832); c.fill();
  const ea = -0.9 - el * (0.8 + Math.sin(t * 9) * 0.35); c.save(); c.translate(13, -18); c.rotate(ea); c.beginPath(); c.ellipse(6, 0, 6.4, 3.6, 0, 0, 6.2832); c.fill(); c.restore();
  c.fillStyle = '#3b2a6e'; c.beginPath(); c.ellipse(-5, -31, 2.6, 3.4, 0, 0, 6.2832); c.ellipse(5, -31, 2.6, 3.4, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(-5.8, -32.6, 1.1, 0, 6.2832); c.arc(4.2, -32.6, 1.1, 0, 6.2832); c.fill();
  c.fillStyle = 'rgba(255,143,200,.6)'; c.beginPath(); c.ellipse(-9.5, -25.5, 2.6, 1.5, 0, 0, 6.2832); c.ellipse(9.5, -25.5, 2.6, 1.5, 0, 0, 6.2832); c.fill();
  c.fillStyle = '#7a4a8e'; c.beginPath(); c.ellipse(0, -24.5, 2.6 + kik * 1.2, 1.4 + kik * 2.2, 0, 0, 6.2832); c.fill();
  c.restore();
}
function sp8HayaletCiz(c, x, y, s, t, o) {
  if (typeof hayaletCiz === 'function') { try { hayaletCiz(c, x, y, s, t, o); return; } catch (e) { /* yedeğe düş */ } }
  sp8HayaletYedek(c, x, y, s, t, o);
}
// ── Feza'nın yedek pelerini ('supurge' pozu gelene kadar; kostüm cadı ya da yarasa ise): omuzdan geriye savrulur ──
function sp8PelerinCiz(c, tm, kost, rz) {
  if (kost !== 'cadi' && kost !== 'yarasa') return;
  const w = Math.sin(tm * 9.3), w2 = Math.sin(tm * 11.7 + 1), w3 = Math.sin(tm * 8.1 + 2);
  const tx = -30 - 6 * rz + w * 3, ty = -27 + w2 * 3.5, bx = -27 - 5 * rz + w3 * 3, by = -9 + w * 3.5;
  c.fillStyle = kost === 'cadi' ? '#4a2a9a' : '#7a5ac8';
  c.beginPath(); c.moveTo(5, -33); c.quadraticCurveTo(-10, -37 + w2, tx, ty);
  if (kost === 'yarasa') { for (let i = 1; i <= 3; i++) { const u = i / 3; c.quadraticCurveTo(lerp(tx, bx, u - 0.17) + 5, lerp(ty, by, u - 0.17), lerp(tx, bx, u), lerp(ty, by, u)); } }
  else c.quadraticCurveTo(-36 - 4 * rz + w3 * 2, -17 + w2 * 2, bx, by);
  c.quadraticCurveTo(-15, -5, -5, -9); c.quadraticCurveTo(-2, -22, 5, -33); c.closePath(); c.fill();
  c.fillStyle = kost === 'cadi' ? '#7b4fd0' : '#a88be0'; c.beginPath(); c.moveTo(3, -31); c.quadraticCurveTo(-9, -32, tx + 6, ty + 4); c.quadraticCurveTo(-14, -24, -3, -14); c.closePath(); c.fill();
  if (kost === 'cadi') { c.fillStyle = '#ffe08a'; for (const [x, y] of [[-14, -24], [-22, -15], [-9, -14]]) { c.save(); c.translate(x + w * 0.6, y + w2 * 0.6); sp8Yildiz5(c, 2.2, 0.5); c.fill(); c.restore(); } }
}
// ── sanal yol: dünya x eşlemesi (kizak.js gibi), şerit, hız ──
function sp8Esle(K, v) {   // sanal yol → süpürgenin dünya x'i (K.xs'ten itibaren). Başta ve sonda eğim 1, ortada K.r.
  if (v <= 0) return v;
  if (K.lin) return v * K.lin;
  const r = K.r;
  if (v <= SP8_A0) return v;
  if (v <= SP8_A0 + SP8_B0) { const u = (v - SP8_A0) / SP8_B0; return SP8_A0 + SP8_B0 * (u + (r - 1) * (u * u * u - u * u * u * u / 2)); }
  const X1 = SP8_A0 + SP8_B0 * (1 + r) / 2, v1 = SP8_A0 + SP8_B0, v2 = K.vE - SP8_B1;
  if (v <= v2) return X1 + r * (v - v1);
  const X2 = X1 + r * (v2 - v1);
  if (v <= K.vE) { const u = (v - v2) / SP8_B1; return X2 + SP8_B1 * (r * u + (1 - r) * (u * u * u - u * u * u * u / 2)); }
  return X2 + SP8_B1 * (1 + r) / 2 + (v - K.vE);
}
function sp8Tablo(A, v) { if (v <= 0) return A[0]; const f = v / 10, i = f | 0; if (i >= A.length - 1) return A[A.length - 1]; const u = f - i; return A[i] + (A[i + 1] - A[i]) * u; }
function sp8Serit(o, v) { return sp8Tablo(o.LN, v); }      // süpürge ortasının şerit yüksekliği (dünya y)
function sp8SeritKur(o) {
  const n = Math.ceil((SP8_LV + 1600) / 10) + 2, A = new Float32Array(n), y0 = o.ky, yI = o.K.gy - SP8_HOVER;
  for (let i = 0; i < n; i++) {
    const v = i * 10; let y = y0;
    y += (470 - y0) * smooth(clamp(v / 1050, 0, 1));                       // kalkış: bahçenin üstünden yükseliş
    y += (352 - 470) * smooth(clamp((v - 1050) / 3150, 0, 1));             // aya doğru yükseliş
    y -= 26 * Math.sin(Math.PI * clamp((v - 4300) / 1600, 0, 1));          // ayın önünde hafif kabarış
    y += (432 - 352) * smooth(clamp((v - 5900) / 1500, 0, 1));             // köyün üstüne süzülüş
    y += 22 * Math.sin((v - 6000) / 620) * smooth(clamp((v - 6400) / 600, 0, 1)) * (1 - smooth(clamp((v - 11300) / 600, 0, 1)));   // yumuşak dalga
    y += (yI - 432) * smooth(clamp((v - (SP8_LV - 1750)) / 1750, 0, 1));    // iniş
    A[i] = y;
  }
  o.LN = A;
}
function sp8HizH(v) {   // hedef hız: yükseliş → ay anında ağır çekim → köy → iniş
  let s = lerp(SP8_V0, SP8_VK, smooth(clamp((v - 5600) / 1400, 0, 1)));
  const a = (v - SP8_AY_V) / SP8_AY_W; if (Math.abs(a) < 1) s = lerp(s, SP8_VAY, Math.pow(Math.cos(a * Math.PI / 2), 2));
  return lerp(s, SP8_VS, smooth(clamp((v - SP8_INISV) / 1400, 0, 1)));
}
function sp8AyW(v) { const a = (v - SP8_AY_V) / (SP8_AY_W * 1.15); return Math.abs(a) < 1 ? Math.pow(Math.cos(a * Math.PI / 2), 2) : 0; }   // ay anı ağırlığı (0..1)
function sp8AyAdim(o) {   // dunya8'e bildirilen ay konumu: kalkıştan sonra kocaman olur, yavaşça sağdan sola Feza'nın arkasından geçer
  const v = o.v, A = o.ay, VHg = VH / cam.zoom;
  const w = smooth(clamp((v - 350) / 2200, 0, 1)) * (1 - smooth(clamp((v - 7300) / 3300, 0, 1)));
  let fx, fy;
  if (v < 2600) fx = 0.8; else if (v < SP8_AY_V) fx = lerp(0.8, 0.3, (v - 2600) / (SP8_AY_V - 2600)); else fx = lerp(0.3, -0.18, clamp((v - SP8_AY_V) / 2300, 0, 1));
  fy = v < SP8_AY_V ? 0.4 : lerp(0.4, 0.24, smooth(clamp((v - SP8_AY_V) / 2300, 0, 1)));
  // SUPURGE.ay() HEDEF konumu verir (dunya8 kendi ayıyla a oranında karıştırır); dn8Ay()'ı burada okumak geri besleme olurdu.
  // Ay anında (dunya8 uçuş ayının yüzü diskin üst kısmında) biniciler ayın temiz ALT yarısından geçer: ay merkezi göğsün ~0.28 r üstünde
  const px = P.rx !== undefined ? P.rx : P.x, aw = sp8AyW(v);
  A.r = VHg * lerp(0.33, 0.34, aw);
  const gy = (P.ry !== undefined ? P.ry : P.y) - SP8_GOGUS;   // göğüs
  A.x = lerp(cam.x + VW * fx, px + VW * (fx - 0.28), aw); A.y = lerp(cam.y + VHg * fy, gy - A.r * 0.28, aw); A.a = w;   // tam ay anında Feza'ya göre (siluet ortalı)
}
const SP8_AYC = { x: 0, y: 0, r: 0 };
function sp8AyCizilen(o) {   // o karede ekranda çizilen ay: dunya8 (dn8Ay) ya da yedek ay (varsayılan konumdan hedefe karışım)
  if (typeof dn8Ay === 'function') { try { const N = dn8Ay(); if (N && Number.isFinite(N.x) && Number.isFinite(N.y) && N.r > 0) return N; } catch (e) {} }
  const A = o.ay, VHg = VH / cam.zoom;
  SP8_AYC.x = lerp(cam.x + VW * 0.8, A.x, A.a); SP8_AYC.y = lerp(cam.y + VHg * 0.17, A.y, A.a); SP8_AYC.r = lerp(VHg * 0.09, A.r, A.a);
  return SP8_AYC;
}

// ── yakın köy: evler, lolipop ağaçları, fener dizileri, kabaklar, hayaletli baca (sanal konumlarda) ──
function sp8KoyKur(o) {
  const r = rng(80808), E = [], A = [], I = [];
  let v = 420, son = null;   // bahçenin kıyısından sonra (bahçe tepesi ile ilk ev arasında küçük boşluk)
  while (v < SP8_LV - 560) {
    const sonda = v > SP8_LV - 2100, basta = v < 1500, hay = !o.hayEv && v > SP8_HAYALET - 260;   // kalkış ve iniş yolunda alçak kulübeler
    const k = hay ? 0 : sonda || basta ? (r() < 0.65 ? 4 : 1) : (r() * 6) | 0;
    const d = SP8_EVLER[k], sc = hay ? 1 : sonda || basta ? 0.84 + r() * 0.08 : 0.9 + r() * 0.2, w = (d.ww + d.ov * 2) * sc;
    // saçak şeridi izler (ay anında çatılar yükselir: koca ay çatıların arkasından doğar), kalkış ve inişte alçak
    const sy = clamp(sp8Serit(o, v + w / 2) + 236, SP8_EVY - 40, SP8_EVY + 100);
    const ev = { v: v + w / 2, k, sc, flip: hay ? false : r() < 0.5, y: hay ? SP8_EVY + 44 : sy + r() * 36 + (sonda || basta ? 40 : 0), kb: [], hay, w, ft: r() * 6, dk: r() * 6 };
    for (const p of d.kb) if (r() < 0.6) ev.kb.push([p[0] * (ev.flip ? -1 : 1) * sc, p[1] * sc, (r() * 3) | 0]);
    if (d.baca) { const bx = d.baca[0], ty = sp8CatiY(d, bx) - d.baca[1]; ev.bx = bx * (ev.flip ? -1 : 1) * sc; ev.by = ty * sc - 6; }
    if (hay) { o.hayEv = ev; ev.bx = d.baca[0] * sc; ev.by = (sp8CatiY(d, d.baca[0]) - d.baca[1]) * sc - 6; }
    if (son) {   // komşu evlerin saçakları arasında fener dizisi
      const ara = (ev.v - ev.w / 2) - (son.v + son.w / 2);
      if (ara < 190 && r() < 0.8) I.push({ va: son.v + son.w / 2 - 10, ya: son.y + 4, vb: ev.v - ev.w / 2 + 10, yb: ev.y + 4, sag: 26 + ara * 0.12 + r() * 14, n: 5 + ((r() * 3) | 0), c0: (r() * 5) | 0, f: r() * 6 });
    }
    E.push(ev); son = ev;
    let ara = 6 + r() * 34;
    if (r() < 0.22 && !sonda) { ara = 110 + r() * 70; A.push({ v: v + w + ara / 2, k: (r() * 2) | 0, s: 0.85 + r() * 0.3, y: sy + 150 + r() * 30 }); }
    v += w + ara;
  }
  o.evler = E; o.agaclar = A; o.ipler = I;
}
function sp8DiziKur(o) {   // şekerler ve yıldızlar: { v, lift, tip, ci, d, t, ... }
  const L = []; let ci = 0;
  const ekle = (v, lift, tip) => L.push({ v, lift, tip, ci: tip === 's' ? (ci++) % SP8_REN.length : 0, d: 'bekle', t: 0, ek: 0, faz: L.length * 1.37, yD: 0, rx: 0, ry: 0, yardim: false });
  for (const D0 of SP8_DIZI) {
    const [b, v, tip, h] = D0;
    if (b === 'cizgi') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h, tip);
    else if (b === 'yay') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * Math.sin(Math.PI * i / (D0[4] - 1)), tip);
    else if (b === 'dalga') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * (i % 2 ? 1 : -1), tip);
    else if (b === 'merdiven') for (let i = 0; i < D0[4]; i++) ekle(v + i * D0[5], h + D0[6] * i, tip);
    else if (b === 'halka') { ekle(v, h, 's'); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.2832 + 0.52; ekle(v + Math.cos(a) * D0[4], h + Math.sin(a) * D0[4], 'y'); } }
  }
  L.sort((a, b) => a.v - b.v);
  o.dizi = L; o.top = L.filter(r => r.tip === 's').length; o.topY = L.length - o.top;
}
// ── parçacık havuzları (sanal konumda; karede ayırma yok) ──
const SP8_TOZN = 240, sp8Toz = []; for (let i = 0; i < SP8_TOZN; i++) sp8Toz.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, c: 0, s: 1, g: 30 });
let sp8TozI = 0;
const SP8_DUMN = 48, sp8Dum = []; for (let i = 0; i < SP8_DUMN; i++) sp8Dum.push({ x: 0, y: 0, l: 0, m: 1, s: 1 });
let sp8DumI = 0;
const sp8Kayan = []; for (let i = 0; i < 3; i++) sp8Kayan.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1 });
function sp8DX() { return SUPURGE.o ? SUPURGE.o.dx || 0 : 0; }
function sp8TozAt(wx, wy, vx, vy, life, ci, s, gr) { const p = sp8Toz[sp8TozI]; sp8TozI = (sp8TozI + 1) % SP8_TOZN; p.x = wx - sp8DX(); p.y = wy; p.vx = vx; p.vy = vy; p.l = p.m = life; p.c = ci; p.s = s; p.g = gr === undefined ? 30 : gr; }
function sp8TozPatla(x, y, n, hiz, ci0) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.35 + Math.random() * 0.75); sp8TozAt(x, y, Math.cos(a) * v, Math.sin(a) * v * 0.85 - 20, 0.7 + Math.random() * 0.8, ci0 === undefined ? i % SP8_TOZ.length : ci0, 2 + Math.random() * 3); } }
function sp8DumanAt(wx, wy) { const p = sp8Dum[sp8DumI]; sp8DumI = (sp8DumI + 1) % SP8_DUMN; p.x = wx - sp8DX(); p.y = wy; p.l = p.m = 2.6 + Math.random() * 1.2; p.s = 0.8 + Math.random() * 0.5; }
function sp8ParcaAdim(dt) {
  const k = Math.exp(-dt * 1.6);
  for (const p of sp8Toz) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= k; p.vy = p.vy * k + p.g * dt; }
  for (const p of sp8Dum) { if (p.l <= 0) continue; p.l -= dt; p.y -= 22 * dt; p.x -= 12 * dt; }
  for (const p of sp8Kayan) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; }
}

// ── kurulum ──
function sp8Kur(o) {
  const B = (typeof BOLUM !== 'undefined' && BOLUM.supurge) || {};
  const al = k => Number.isFinite(o[k]) ? o[k] : Number.isFinite(B[k]) ? B[k] : null;
  const inisX = al('inisX') !== null ? al('inisX') : al('x1') !== null ? al('x1') : o.x + 160 * T;
  let gy = al('inisY') !== null ? al('inisY') : o.y;
  if (al('inisY') === null && typeof yuzey === 'function') { try { const v = yuzey(Math.floor(inisX / T)); if (Number.isFinite(v) && v < ROWS * T) gy = v; } catch (e) {} }
  o.kx = o.x; o.ky = o.y - SP8_HOVER; o.kAci = -0.06;   // bekleyen süpürgenin yeri (kazan.js'in devrettiği yer)
  const xs = o.kx, xEnd = Math.max(xs + 1800, inisX - 56), vE = SP8_LV - SP8_E;
  const K = { xs, xEnd, inisX, gy, vE, r: 0.4, lin: 0, yUst: al('yUst') !== null ? al('yUst') : o.y - 640, yAlt: al('yAlt') !== null ? al('yAlt') : o.y };
  const pay = SP8_B0 / 2 + (vE - SP8_B1 - SP8_A0 - SP8_B0) + SP8_B1 / 2, sabit = SP8_A0 + SP8_B0 / 2 + SP8_B1 / 2 + SP8_E;
  K.r = (xEnd - xs - sabit) / pay;
  if (!(K.r > 0.05 && K.r <= 1)) K.lin = (xEnd - xs) / SP8_LV;
  o.K = K; o.dxSon = xs + sp8Esle(K, SP8_LV) - SP8_LV;
  sp8SeritKur(o); sp8KoyKur(o); sp8DiziKur(o);
  o.faz = 'bekle'; o.hazir = false; o.done = false; o.skl = { bitti: false }; o.t = 0; o.total = 0; o.kazanT = 0;
  o.v = 0; o.vOn = 0; o.dx = xs; o.dxOn = xs; o.spd = 0; o.off = 0; o.uV = 0; o.bas = false; o.idle = 0; o.yardimA = 0; o.ipucu = 0; o.zorYardim = false;
  o.bx = o.kx; o.by = o.ky; o.byOn = o.ky; o.rot = o.kAci; o.bob = 0; o.dbx = o.kx; o.dby = o.ky; o.ddx = xs; o.al = 1; o.pX = P.x; o.pXOn = P.x;
  o.sq = 0; o.sqv = 0; o.ft = 0; o.pt = 0; o.sevT = 0; o.tk = 0; o.tkYon = 1; o.n = 0; o.ny = 0; o.parla = 0; o.vinT = 0; o.kayanT = 3;
  o.kediA = 'yok'; o.kediT = 0; o.kediB = false; o.kediK = null; o.kediYon = 1; o.kediA0 = 1; o.kx2 = o.kx + 76; o.ky2 = o.y; o.kedX = o.kx2; o.kedY = o.y; o.kZip = 0;
  o.prX = o.kx - 60; o.prY = o.ky - 90; o.prW = 0; o.kamY = o.ky; o.kor = null; o.korEski = null; o.olay = {};
  o.ay = { x: 0, y: 0, r: 0, a: 0 }; o.silA = 0; o.salla = 0; o.yar = []; for (let i = 0; i < 4; i++) o.yar.push({ x: 0, y: 0, a: 0, f: i * 1.9 });
  o.hay = { el: 0, kik: 0, sesli: false };
  o.fzOpt = { el: { x: 20, y: 2 }, vy: 0, sevinc: 0, salla: 0, ruzgar: 0.6, aci: 0 };
  o.sOpt = { aci: 0, yon: 1, kipir: 0.5, isik: 0.3, alfa: 1 };
  o.kOpt = { yon: 1, otur: 1, kuyruk: 0.6, mutlu: 1, zipla: 0, el: 0, ruzgar: 0 };
  o.adim = (dt, input) => sp8Adim(o, dt, input);
  if (typeof BOLUM !== 'undefined') BOLUM.supurgeTop = o.top;
  SUPURGE.o = o;
}
const SP8_ISIT = [['cali', sp8CaliArt], ['sap', sp8SapArt], ['yil', sp8YildizArt], ['puf', sp8PufArt], ['on', sp8OnSeritArt], ['ay', sp8AyArt],
  ['ev0', () => sp8EvArt(0)], ['ev0b', () => sp8EvArt(0, true)], ['ev1', () => sp8EvArt(1)], ['ev2', () => sp8EvArt(2)], ['ev3', () => sp8EvArt(3)], ['ev4', () => sp8EvArt(4)], ['ev5', () => sp8EvArt(5)],
  ['lp0', () => sp8LolipopArt(0)], ['lp1', () => sp8LolipopArt(1)]];
function sp8Isit() {   // ağır önbellekleri karelere yay: süpürgeye yaklaşınca her karede biri; hepsi hazırsa true
  for (const [k, f] of SP8_ISIT) if (!sp8Arts[k]) { f(); return false; }
  for (let i = 0; i < SP8_REN.length; i++) { if (!sp8Arts['s' + i]) { sp8SekerArt(i); return false; } if (!sp8Arts['f' + i]) { sp8FenerArt(i); return false; } }
  for (let i = 0; i < 3; i++) if (!sp8Arts['kb' + i]) { sp8KabakArt(i); return false; }
  for (let i = 0; i < SP8_TOZ.length; i++) if (!sp8Arts['z' + i]) { sp8TozArt(i); return false; }
  return true;
}
// ── bekleme: kazan bitince süpürge 646'da salınır, kedi üstüne atlar ──
function sp8HazirMi(o) {
  const V = sp8V8(); if (!V) return true;
  if (V.supurgeHazir) return true;
  const KZ = typeof KAZAN !== 'undefined' && KAZAN ? KAZAN.supurge : null; if (KZ && KZ.hazir) return true;
  if (!TUR.al('kazanMini') || !NESNELER.some(n => n.tip === 'kazanMini')) return true;   // kazan yüklenemediyse süpürge baştan hazır
  return !!V.kazan && o.kazanT > 4;   // kazan bitti ama devir bilgisi gelmedi: biraz sonra kendimiz hazırız
}
function sp8HazirOl(o) {
  o.hazir = true;
  const KZ = typeof KAZAN !== 'undefined' && KAZAN ? KAZAN.supurge : null;
  if (KZ && Number.isFinite(KZ.x) && Number.isFinite(KZ.y) && Math.abs(KZ.x - o.kx) < 400) { o.bx = KZ.x; o.by = KZ.y; o.rot = Number.isFinite(KZ.aci) ? KZ.aci : o.kAci; }
  else { o.bx = o.kx; o.by = o.ky; o.rot = o.kAci; }
  const V = sp8V8(); if (V) V.supurgeAldi = true;
  // kara kedi: bahçedeki geceDost kedisi (kabak.js) koşup süpürgeye atlar (o andan sonra SUPURGE.kediKaynak() ile kabak.js onu gizler);
  // bahçede kedi yoksa bahçenin kıyısında belirip atlar
  const K0 = NESNELER.find(n => n.tip === 'geceDost' && n.tur === 'kedi' && Number.isFinite(n.x) && Math.abs(n.x - o.kx) < 1400);
  o.kediB = true; o.kediT = 0;
  if (K0) { o.kediK = K0; o.kedX = Number.isFinite(K0.kx) ? K0.kx : K0.x; o.kedY = Number.isFinite(K0.y) ? K0.y : o.y; o.kediA = 'kos'; o.kediA0 = 1; }
  else { o.kedX = o.kx2; o.kedY = o.y; o.kediA = 'atla'; o.kediA0 = 0; }
  o.kx2 = o.kedX; o.ky2 = o.kedY;
  OLAY.emit('supurgeHazir', { o });
}
function sp8BekleAdim(o, dt) {
  o.t += dt; o.ft += dt;
  const V = sp8V8(); if (V && V.kazan) o.kazanT += dt;
  if (!o.hazir) { if (sp8HazirMi(o)) sp8HazirOl(o); }
  if (o.hazir) {   // devraldığı yerden bekleme yerine yumuşakça süzülür, salınır
    o.bx = lerp(o.bx, o.kx, 1 - Math.exp(-dt * 2)); o.by = lerp(o.by, o.ky, 1 - Math.exp(-dt * 2)); o.rot = lerp(o.rot, o.kAci, 1 - Math.exp(-dt * 2));
    o.bob = Math.sin(o.t * 2.1) * 4;
  }
  o.dbx = o.bx; o.dby = o.by + o.bob;
  sp8KediAdim(o, dt, 250);
}
function sp8KediAdim(o, dt, hiz) {   // kedi: bahçeden koşup süpürgeye sıçrar (Feza erken binerse daha hızlı koşar; uçarken hemen sıçrar)
  o.kediA0 = Math.min(1, o.kediA0 + dt * 2.5);   // yedek kedi yavaşça belirir
  const ko = o.kOpt; ko.otur = o.kediA === 'kos' ? 0 : 1; ko.poz = ko.otur ? 'otur' : 'yuru'; ko.adim = o.kediT * 13;   // kabak.js kediCiz: koşarken yürüme pozu
  if (o.kediA === 'kos') {   // süpürgenin arkasına doğru hoplaya hoplaya koşar
    o.kediT += dt; const hx = o.kx - 58, d = hx - o.kedX; o.kediYon = d < 0 ? -1 : 1;
    o.kedX += Math.sign(d) * Math.min(Math.abs(d), hiz * dt);
    let zy = o.y; if (typeof yuzey === 'function') { try { const v = yuzey(Math.floor(o.kedX / T)); if (Number.isFinite(v) && v < ROWS * T) zy = v; } catch (e) {} }
    const hop = Math.abs(Math.sin(o.kediT * 8.5)); o.kedY = zy - hop * 9; o.kZip = hop * 0.5;
    if (Math.abs(d) < 4 || o.faz === 'ucus') { ko.otur = 1; ko.poz = 'otur'; o.kediA = 'atla'; o.kediT = 0; o.kx2 = o.kedX; o.ky2 = zy; o.kediYon = 1; }
  }
  if (o.kediA === 'atla') {
    o.kediT += dt / SP8_KZIP; const u = smooth(clamp(o.kediT, 0, 1)), c = Math.cos(o.rot), s = Math.sin(o.rot); o.kediYon = 1;
    const hx = o.dbx + SP8_KEDX * c + 7 * s, hy = o.dby + SP8_KEDX * s - 7 * c;
    o.kedX = lerp(o.kx2, hx, u); o.kedY = lerp(o.ky2, hy, u) - Math.sin(u * Math.PI) * 52; o.kZip = Math.sin(clamp(o.kediT, 0, 1) * Math.PI);
    if (o.kediT >= 1) { o.kediA = 'binde'; o.kZip = 0; sp8Sfx('kediMiyav', 0); sp8TozPatla(hx, hy - 10, 8, 80, 1); }
  }
}
function sp8Basla(o) {
  if (!o || o.done || o.faz !== 'bekle' || !o.hazir || P.ucus || DURUM !== 'oyun' || P.fade > 0) return;
  if (typeof D !== 'undefined' && D.mode === 'tasi') return;
  while (!sp8Isit());   // eksik önbellek kalmasın
  o.faz = 'binis'; o.t = 0; o.total = 0; o.px0 = P.x; o.py0 = P.y; o.idle = 0; o.bas = false; o.oturdu = false;
  o.v = 0; o.vOn = 0; o.dx = o.K.xs; o.dxOn = o.dx; o.spd = 0; o.off = 0; o.uV = 0; o.bx0 = o.bx; o.by0 = o.by;
  P.ucus = o; P.vx = P.vy = 0; P.kilit = 0; P.fade = 0; P.buf = 0; SUPURGE.o = o;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  o.kediB = true;
  o.prX = typeof D !== 'undefined' && Number.isFinite(D.x) ? D.x : P.x - 70; o.prY = typeof D !== 'undefined' && Number.isFinite(D.y) ? D.y : P.y - 90;
  if (typeof BOLUM !== 'undefined' && BOLUM.supurge) { o.kor = BOLUM.supurge; o.korEski = { yUst: o.kor.yUst, yAlt: o.kor.yAlt }; }
  o.kamY = o.ky - 30; sp8Koridor(o);
  o.skl.bitti = true;
  const V = sp8V8(); if (V) V.supurgeAldi = true;
  OLAY.emit('supurgeBasla', { o, top: o.top });
}
function sp8Koridor(o) { if (o.kor) { o.kor.yUst = o.kamY - 300; o.kor.yAlt = o.kamY + 160; } }
function sp8Olay(o, ad, veri) { if (o.olay[ad]) return; o.olay[ad] = true; OLAY.emit(ad, veri || { o }); }
// ── her fizik adımı (P.ucus === o iken motor çağırır) ──
function sp8Adim(o, dt, input) {
  if (!(dt > 0) || !Number.isFinite(dt) || DURUM !== 'oyun' || P.ucus !== o) return;
  dt = Math.min(dt, 0.05);
  const K = o.K, basili = !!(input && (input.basili || input.eksenY < 0));
  o.t += dt; o.total += dt; o.ft += dt; o.pt += dt;
  o.sevT = Math.max(0, o.sevT - dt); o.parla = Math.max(0, o.parla - dt * 0.8); o.vinT = Math.max(0, o.vinT - dt);
  if (o.tk > 0) { o.tk += dt / 0.8; if (o.tk >= 1) o.tk = 0; }
  o.sqv += (-o.sq * 160 - o.sqv * 11) * dt; o.sq += o.sqv * dt;
  if (o.kediA === 'kos' || o.kediA === 'atla') sp8KediAdim(o, dt, 560);
  P.vx = P.vy = 0; P.ground = false; P.f = 1;
  let seatX, seatY;
  if (o.faz === 'binis') {
    const u = clamp(o.t / SP8_BINIS, 0, 1), atla = smooth(clamp(u / 0.5, 0, 1));
    o.bob = Math.sin(o.t * 2.1) * 4 * (1 - u); o.bx = o.bx0; o.by = o.by0;
    o.rot = lerp(o.rot, o.kAci, 1 - Math.exp(-dt * 4));
    o.sOpt.kipir = lerp(0.5, 1, u);
    if (u >= 0.5 && !o.oturdu) {   // Feza oturdu: süpürge yaylanır, çalı sevinçle kabarır, ışıltı
      o.oturdu = true; o.sqv -= 8; o.sevT = 1.2;
      sp8TozPatla(o.bx, o.by - 20, 22, 150); sp8Sfx('supurgeCanlan', 0);
      if (typeof KAZAN !== 'undefined' && KAZAN && typeof KAZAN.elSalla === 'function') { try { KAZAN.elSalla(); } catch (e) {} }
    }
    seatX = o.bx; seatY = o.by + o.bob - 3;
    if (!o.oturdu) { P.x = lerp(o.px0, seatX, atla); P.y = lerp(o.py0, seatY, atla) - Math.sin(atla * Math.PI) * 46; }
    if (u >= 1) { o.faz = 'ucus'; o.t = 0; o.idle = 0; o.spd = 0; o.uV = 70; o.off = 0; o.byOn = o.by; }
    o.kamY = lerp(o.kamY, o.ky - 30, 1 - Math.exp(-dt * 2));
  } else if (o.faz === 'ucus') {
    const vH = sp8HizH(o.v);
    o.spd = lerp(o.spd, vH, 1 - Math.exp(-dt * (o.v < 500 ? 1.1 : 1.7)));
    o.vOn = o.v; o.v += o.spd * dt;
    o.dxOn = o.dx; o.bx = K.xs + sp8Esle(K, o.v); o.dx = o.bx - o.v;
    const lane = sp8Serit(o, o.v), aw = sp8AyW(o.v), son = smooth(clamp((o.v - (SP8_LV - 1500)) / 1200, 0, 1)), bas0 = smooth(clamp(o.v / 700, 0, 1));
    const ust = SP8_UST * (1 - 0.8 * aw) * (1 - son) * lerp(0.5, 1, bas0), alt = SP8_ALT * (1 - 0.7 * aw) * (1 - son) * smooth(clamp((o.v - 850) / 700, 0, 1));   // kalkışta şeridin altına inmez
    const yardim = o.zorYardim || o.idle >= SP8_YARDIM;
    if (basili && !o.bas) { o.idle = 0; if (o.vinT <= 0) { sp8Sfx('supurgeVin', 1); o.vinT = 1.2; } }
    if (basili) { o.idle = 0; o.uV = Math.min(o.uV + 760 * dt, 200); }
    else {
      o.idle += dt;
      if (yardim) {   // Pırıl kurdeleyle çeker: süpürge sıradaki şekerin yüksekliğine süzülür
        const r = sp8Sonraki(o, 's') || sp8Sonraki(o); let hedef = 0;
        if (r && r.v - o.v < 1000) hedef = r.lift + (lane - sp8Serit(o, r.v));
        o.uV = lerp(o.uV, clamp((hedef - o.off) * 2.4, -120, 160), 1 - Math.exp(-dt * 4));
      } else o.uV = Math.max(o.uV - 360 * dt, -62);
    }
    if (yardim && !o.olay.supurgeYardim) sp8Olay(o, 'supurgeYardim');
    if (!yardim && o.olay.supurgeYardim && o.idle < 1) o.olay.supurgeYardim = false;   // dokundu: bir dahaki yardımda yeniden
    o.yardimA = lerp(o.yardimA, yardim ? 1 : 0, 1 - Math.exp(-dt * 3));
    o.bas = basili;
    if (aw > 0.02) o.off = lerp(o.off, 0, 1 - Math.exp(-dt * 1.8 * aw));   // ay anında süpürge ayın ortasına süzülür
    o.off += o.uV * dt;
    if (o.off > ust) { o.off = lerp(o.off, ust, 1 - Math.exp(-dt * 7)); if (o.uV > 0) o.uV *= Math.exp(-dt * 6); }
    if (o.off < alt) { o.off = lerp(o.off, alt, 1 - Math.exp(-dt * 7)); if (o.uV < 0) o.uV *= Math.exp(-dt * 6); }
    o.byOn = o.by; o.by = clamp(lane - o.off, K.yUst + 70, K.yAlt - 30);
    const vy = (o.by - o.byOn) / dt;
    o.rot = lerp(o.rot, clamp(Math.atan2(vy, Math.max(o.spd, 90)) * 0.75, -0.3, 0.26), 1 - Math.exp(-dt * 5));
    o.bob = Math.sin(o.total * 2.3) * 3 * (1 - son * 0.6);
    o.fzOpt.vy = vy * 0.35;
    o.sOpt.kipir = clamp(0.55 + o.spd / 500 + Math.max(0, -vy) / 400, 0, 1.2);
    o.salla = lerp(o.salla, aw > 0.55 ? 1 : 0, 1 - Math.exp(-dt * 3));
    sp8AyAdim(o);
    sp8Toplar(o, dt, yardim);
    sp8YarasaAdim(o, dt); sp8HayaletAdim(o, dt);
    sp8IzAt(o, dt);
    // anlatı olayları
    if (o.v > 220) { if (!o.olay.supurgeKalk) { sp8Sfx('supurgeVin', 0); sp8Olay(o, 'supurgeKalk'); } }
    if (o.v > SP8_AY_V - 760 && !o.olay.supurgeAy) { sp8Sfx('supurgeVin', 2); sp8Olay(o, 'supurgeAy'); o.kayanT = Math.min(o.kayanT, 1.2); }
    if (o.v > SP8_KOY) sp8Olay(o, 'supurgeKoy');
    if (o.v > SP8_YARASA[0] && !o.olay.supurgeYarasa) { sp8Sfx('yarasaPir', 0); sp8Olay(o, 'supurgeYarasa'); }
    o.kayanT -= dt; if (o.kayanT <= 0) { sp8KayanAt(o); o.kayanT = 4.5 + Math.random() * 4; }
    seatX = o.bx; seatY = o.by + o.bob - 3;
    // kamera: şeridi ve yüksekliğin yarısını izler; ay anında Feza ekranın biraz üstünde (ay arkasında kocaman)
    const kOfs = lerp(-30, 112, smooth(clamp(o.v / 1200, 0, 1))) - 48 * aw - 172 * smooth(clamp((o.v - (SP8_LV - 1400)) / 1400, 0, 1));
    o.kamY = lerp(o.kamY, lane + 0.5 * (o.by - lane) + kOfs, 1 - Math.exp(-dt * 2.2));
    if (o.v >= SP8_LV) sp8InisBasla(o);
  } else if (o.faz === 'inis') {
    const u = clamp(o.t / SP8_INIS, 0, 1);
    o.spd = lerp(o.spd, 0, 1 - Math.exp(-dt * 2.6));
    o.vOn = o.v; o.v += o.spd * dt; o.dxOn = o.dx; o.bx = K.xs + sp8Esle(K, o.v); o.dx = o.bx - o.v;
    o.byOn = o.by; o.by = lerp(o.by, K.gy - SP8_HOVER, 1 - Math.exp(-dt * 4));
    o.rot = lerp(o.rot, -0.04, 1 - Math.exp(-dt * 4)); o.bob = Math.sin(o.total * 2.1) * 3 * u;
    o.sOpt.kipir = lerp(o.sOpt.kipir, 0.45, 1 - Math.exp(-dt * 2)); o.salla = lerp(o.salla, 0, 1 - Math.exp(-dt * 3));
    sp8AyAdim(o); sp8IzAt(o, dt); sp8Toplar(o, dt, false);
    sp8YarasaAdim(o, dt);
    seatX = o.bx; seatY = o.by + o.bob - 3;
    const atla = smooth(clamp((u - 0.34) / 0.4, 0, 1));
    if (u > 0.34) {   // Feza süpürgeden atlar, meydanın girişine konar
      if (!o.indi && atla >= 1) { o.indi = true; o.sevT = 1.2; sp8Sfx('supurgeInis', 0); sp8TozPatla(K.inisX, K.gy - 8, 16, 120); OLAY.emit('supurgeInis', { o, x: K.inisX, y: K.gy }); }
      if (o.kediA === 'binde' && u > 0.5) { o.kediA = 'in'; o.kediT = 0; }
    }
    if (o.kediA === 'in') {   // kedi de iner, süpürgenin yanına oturur
      o.kediT += dt / SP8_KZIP; const k = smooth(clamp(o.kediT, 0, 1)), c = Math.cos(o.rot), s = Math.sin(o.rot);
      const hx = o.bx + SP8_KEDX * c + 7 * s, hy = o.by + o.bob + SP8_KEDX * s - 7 * c;
      o.kx2 = K.inisX + 52; o.ky2 = K.gy;
      o.kedX = lerp(hx, o.kx2, k); o.kedY = lerp(hy, o.ky2, k) - Math.sin(k * Math.PI) * 34; o.kZip = Math.sin(clamp(o.kediT, 0, 1) * Math.PI);
      if (o.kediT >= 1) { o.kediA = 'yer'; o.kZip = 0; o.kediYon = 1; sp8Sfx('kediMiyav', 1); }
    }
    o.kamY = lerp(o.kamY, K.gy - SP8_HOVER - 60, 1 - Math.exp(-dt * 2.4));
    if (u > 0.34) { P.x = lerp(seatX, K.inisX, atla); P.y = lerp(seatY, K.gy, atla) - Math.sin(atla * Math.PI) * 38; }
    else { P.x = seatX; P.y = seatY; }
    sp8Koridor(o); sp8PirilAdim(o, dt);
    o.pXOn = o.pX; o.pX = P.x; o.pYOn = o.pY; o.pY = P.y; o.x = P.x;
    if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
    if (u >= 1) sp8Bitir(o);
    return;
  }
  if (o.faz === 'binis' ? o.oturdu : true) { P.x = seatX; P.y = seatY; }
  sp8Koridor(o);
  sp8PirilAdim(o, dt);
  o.pXOn = o.pX; o.pX = P.x; o.pYOn = o.pY; o.pY = P.y; o.x = P.x;
  if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
}
function sp8InisBasla(o) { o.faz = 'inis'; o.t = 0; o.indi = false; sp8Olay(o, 'supurgeInisBasla'); }
function sp8Bitir(o) {
  const K = o.K;
  P.x = K.inisX; P.y = K.gy; P.vx = P.vy = 0; P.ground = true; P.safeX = P.x; P.safeY = P.y; P.ucus = null; P.dj = true; P.buf = 0; P.fade = 0; P.f = 1;
  if (typeof D !== 'undefined') { D.x = P.x - 72; D.y = P.y - 92; D.vx = D.vy = 0; }
  o.done = true; o.faz = 'bitti'; o.t = 0; o.skl.bitti = true; o.spd = 0; o.x = o.bx; o.ay.a = 0;
  if (o.kediA !== 'yer') { o.kediA = 'yer'; o.kx2 = K.inisX + 52; o.ky2 = K.gy; o.kedX = o.kx2; o.kedY = o.ky2; o.kZip = 0; }
  if (o.kor && o.korEski) { o.kor.yUst = o.korEski.yUst; o.kor.yAlt = o.korEski.yAlt; }
  const V = sp8V8(); if (V) V.supurge = true;
  sp8TozPatla(P.x, P.y - 20, 14, 130);
  OLAY.emit('supurgeBitti', { o, n: o.n, top: o.top, sure: o.total, x: K.inisX, y: K.gy, yildiz: o.ny });
}

// ── şekerler ve yıldızlar: konum, mıknatıs, toplama, kaçırma ──
function sp8ItemY(o, r) { return sp8Serit(o, r.v) - 3 - SP8_GOGUS - r.lift; }   // tanenin dünya y'si (göğüs şeridine göre)
function sp8Sonraki(o, tip) { const L = o.dizi; for (let i = 0; i < L.length; i++) { const r = L[i]; if (r.d === 'bekle' && r.v > o.v + 10 && (!tip || r.tip === tip)) return r; } return null; }
function sp8Toplar(o, dt, yardim) {
  const fx = o.v, fy = o.by + o.bob - 3 - SP8_GOGUS, L = o.dizi;
  for (let i = 0; i < L.length; i++) {
    const r = L[i];
    if (r.d === 'bitti') continue;
    r.t += dt;
    if (r.d === 'alindi') { if (r.t > 0.55) r.d = 'bitti'; continue; }
    if (r.d === 'kacti') { if (r.t > 2.2) r.d = 'bitti'; continue; }
    const dv = r.v - fx; if (dv > 900) break;   // dizi sıralı: ilerisi bekler
    const y0 = sp8ItemY(o, r), dy = fy - y0;
    let w = 0; if (dv > -24 && dv < 180 && Math.abs(dy) < 100) w = smooth(1 - clamp(dv, 0, 180) / 180) * 0.6;   // mıknatıs: göğse doğru kayar
    r.ek = lerp(r.ek, w, 1 - Math.exp(-dt * 6)); r.yD = y0 + dy * r.ek;
    if (yardim && dv > 0 && dv < 700) r.yardim = true;
    if (dv < 22 && dv > -30) {
      const d = Math.abs(fy - r.yD);
      if (d < 46) sp8Topla(o, r, 'feza');
      else if (r.yardim && d < 120) sp8Topla(o, r, 'piril');
    } else if (dv <= -30) { r.d = 'kacti'; r.t = 0; }
  }
  o.ipucu = lerp(o.ipucu, o.idle >= SP8_IPUCU && !(o.zorYardim || o.idle >= SP8_YARDIM) ? 1 : 0, 1 - Math.exp(-dt * 2));
}
function sp8Topla(o, r, kim) {
  r.d = 'alindi'; r.t = 0; o.sevT = 0.9;
  const x = r.v + o.dx, y = r.yD;
  r.rx = x - o.bx; r.ry = y - o.by;   // süpürgeye göre (sepete uçuş buradan başlar)
  if (r.tip === 's') {
    o.n++;
    const V = sp8V8(); if (V) V.seker = (V.seker || 0) + 1;
    if (!(o.tk > 0) && (kim === 'piril' || o.n % 4 === 0)) { o.tk = 0.001; o.tkYon = o.n % 2 ? 1 : -1; }   // Pırıl sevinçle takla atar
    sp8TozPatla(x, y, 14, 140, [2, 3, 2, 4, 0][r.ci]); sp8TozPatla(x, y, 6, 60, 0);
    sp8Sfx('supurgeSeker', o.n);
    OLAY.emit('supurgeSeker', { n: o.n, top: o.top, x, y, kim, o });
  } else {
    o.ny++; o.parla = Math.min(1.4, o.parla + 0.5);
    sp8TozPatla(x, y, 12, 120, 1); sp8TozPatla(x, y, 6, 50, 5);
    sp8Sfx('supurgeSeker', 100 + o.ny);
    OLAY.emit('supurgeYildiz', { n: o.ny, top: o.topY, x, y, kim, o });
  }
}
// ── yarasalar: yükselişte yanımıza katılır, ay anında birlikte siluet olur, köyün ortasında göğe ayrılır ──
const SP8_YAR_OF = [[-92, -116], [-40, -150], [146, -138], [206, -104]], SP8_YAR_AY = [[-150, -34], [-104, -78], [168, -58], [236, -16]];   // ay anında binicilerin iki yanında (ayın temiz alt yarısında)
function sp8YarasaAdim(o, dt) {
  const v = o.v, gir = smooth(clamp((v - SP8_YARASA[0]) / 600, 0, 1)), cik = smooth(clamp((v - SP8_YARASA[1]) / 700, 0, 1));
  for (let i = 0; i < 4; i++) {
    const aw = sp8AyW(v), ox = lerp(SP8_YAR_OF[i][0], SP8_YAR_AY[i][0], aw), oy = lerp(SP8_YAR_OF[i][1], SP8_YAR_AY[i][1], aw);
    const Y = o.yar[i], gi = smooth(clamp(gir * 1.3 - i * 0.1, 0, 1)), ci = smooth(clamp(cik * 1.3 - (3 - i) * 0.1, 0, 1));
    const tx = o.bx + ox + Math.sin(o.total * 0.9 + i * 1.7) * 14, ty = o.by + oy + Math.sin(o.total * 1.7 + i * 2.3) * 9;
    Y.x = lerp(o.bx - 640 - i * 60, tx, gi) + ci * (420 + i * 80); Y.y = lerp(o.by - 330, ty, gi) - ci * (380 + i * 40);
    Y.a = gi * (1 - ci); Y.f += dt * (11 + i * 0.7);
  }
}
// ── bacadaki hayalet: uzaktan görünür (ani belirme yok); süpürge yaklaşınca el sallar, kıkırdar ──
function sp8HayaletAdim(o, dt) {
  const E = o.hayEv; if (!E) return;
  const dv = E.v + E.bx - o.v, yakin = dv < 520 && dv > -260;
  o.hay.el = lerp(o.hay.el, yakin ? 1 : 0.25, 1 - Math.exp(-dt * 3)); o.hay.kik = Math.max(0, o.hay.kik - dt * 0.8);
  if (yakin && !o.hay.sesli) { o.hay.sesli = true; o.hay.kik = 1.4; sp8Sfx('hayaletKikir', 0); sp8Olay(o, 'supurgeHayalet'); }
}
// ── çalıdan dökülen ışıltı izi, kayan yıldızlar ──
function sp8IzAt(o, dt) {
  const c = Math.cos(o.rot), s = Math.sin(o.rot), ex = o.bx - 60 * c, ey = o.by + o.bob - 60 * s, n = dt * (34 + o.spd * 0.06 + o.parla * 40);
  let k = n; while (k > 0) { if (k >= 1 || Math.random() < k) sp8TozAt(ex + (Math.random() - 0.5) * 10, ey + (Math.random() - 0.5) * 16, -30 - Math.random() * 50, 6 + Math.random() * 26, 0.8 + Math.random() * 0.8, (Math.random() * SP8_TOZ.length) | 0, 1.8 + Math.random() * 2.2 + o.parla * 1.2, 26); k -= 1; }
}
function sp8KayanAt(o) {   // kayan yıldız: ayın önünden geçmesin (uzakta, ayın arkasında olmalı) — yolu ay diskine değmeyen bir yer seçilir
  const A = o.ay.a > 0.01 || typeof dn8Ay === 'function' ? sp8AyCizilen(o) : null, VHg = VH / cam.zoom;
  for (const p of sp8Kayan) if (p.l <= 0) {
    for (let k = 0; k < 5; k++) {
      const x = cam.x + VW * (0.3 + Math.random() * 0.75), y = cam.y + VHg * (0.03 + Math.random() * 0.17);
      const a = Math.PI * (0.78 + Math.random() * 0.1), v = 520 + Math.random() * 220, l = 1.1 + Math.random() * 0.4, vx = Math.cos(a) * v, vy = Math.sin(a) * v;
      let ok = true;
      if (A) for (let i = 0; i <= 4 && ok; i++) { const t = l * i / 4, px = x + vx * t, py = y + vy * t; if (Math.hypot(px - A.x, py - A.y) < A.r + 40) ok = false; }
      if (!ok) continue;
      p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.l = p.m = l; return;
    }
    return;
  }
}
// ── Pırıl: yanında uçar; ay anında yakınında el sallar; ipucunda sıradaki şekerin çevresinde döner; yardımda kurdeleyle çeker ──
function sp8PirilAdim(o, dt) {
  const bx = o.bx, by = o.by + o.bob, aw = o.faz === 'ucus' ? sp8AyW(o.v) : 0;
  let evX = bx + 80 + Math.sin(o.total * 1.1) * 14, evY = by - 66 + Math.sin(o.total * 2.0) * 8;
  if (aw > 0) { evX = lerp(evX, bx + 64, aw); evY = lerp(evY, by - 82 + Math.sin(o.total * 2.4) * 5, aw); }
  if (o.faz === 'binis') { evX = bx + 84; evY = by - 78; }
  if (o.faz === 'inis') { const u = clamp(o.t / SP8_INIS, 0, 1); evX = lerp(evX, P.x - 72, smooth(u)); evY = lerp(evY, P.y - 92, smooth(u)); }
  if (o.tk > 0) evY -= Math.sin(o.tk * Math.PI) * 24;
  let w = 0, hx = evX, hy = evY;
  if (o.faz === 'ucus') {
    if (o.yardimA > 0.05) { w = o.yardimA; hx = bx + 178 + Math.sin(o.total * 1.6) * 8; hy = by - 26 + Math.sin(o.total * 2.6) * 7; }
    else if (o.ipucu > 0.05) { const r = sp8Sonraki(o, 's'); if (r) { const uz = r.v - o.v; if (uz < 900) { const a = o.total * 2.6; w = o.ipucu * 0.85 * smooth(clamp((900 - uz) / 400, 0, 1)); hx = r.v + o.dx + Math.cos(a) * 38; hy = sp8ItemY(o, r) + Math.sin(a) * 32; } } }
  }
  o.prW = lerp(o.prW, w, 1 - Math.exp(-dt * 3));
  const tx = lerp(evX, hx, o.prW), ty = lerp(evY, hy, o.prW), k = 1 - Math.exp(-dt * (o.faz === 'binis' ? 3 : 4.5));
  o.prX = lerp(o.prX, tx, k); o.prY = lerp(o.prY, ty, k);
  if (o.prW > 0.3 && Math.random() < dt * 14) sp8TozAt(o.prX - 14, o.prY + 6, -40, 10, 0.6, 4, 1.8);
}
// ── çizim: gök (yedek ay, kayan yıldızlar), yakın köy, şekerler ──
function sp8AyCiz(o) {   // yalnız dunya8 ayı yönetmiyorsa (dn8Ay yoksa): kocaman gülen bal rengi ay
  if (typeof dn8Ay === 'function' || !(o.ay.a > 0.01)) return;
  const A = sp8AyCizilen(o), art = sp8AyArt(), k = A.r / art.r, s = art.n * k;
  g.globalAlpha = o.ay.a; g.drawImage(art.c, A.x - s / 2, A.y - s / 2, s, s); g.globalAlpha = 1;
}
function sp8KayanCiz() {   // kayan yıldız: parlak baş, sönen kuyruk
  g.globalCompositeOperation = 'lighter';
  for (const p of sp8Kayan) {
    if (p.l <= 0) continue;
    const u = p.l / p.m, a = Math.min(1, Math.sin(u * Math.PI) * 1.4), sp = Math.hypot(p.vx, p.vy) || 1, ux = p.vx / sp, uy = p.vy / sp, L = 170;
    g.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const d0 = i * L / 5, d1 = (i + 1) * L / 5; g.strokeStyle = 'rgba(255,240,214,' + (a * (1 - i / 5) * 0.6).toFixed(3) + ')'; g.lineWidth = 3.6 * (1 - i / 5) + 0.6; g.beginPath(); g.moveTo(p.x - ux * d0, p.y - uy * d0); g.lineTo(p.x - ux * d1, p.y - uy * d1); g.stroke(); }
    dglow('#fff4c8', p.x, p.y, 26, 0.7 * a);
    for (let i = 4; i >= 0; i--) { const d = i * 26 + 8, r = (7 - i * 1.1) * (0.6 + 0.4 * a); g.globalAlpha = a * (1 - i / 5) * 0.85; g.drawImage(sp8TozArt(i ? 5 : 0), p.x - ux * d - r, p.y - uy * d + Math.sin(i * 2 + p.l * 9) * 3 - r, r * 2, r * 2); }
    g.globalAlpha = a; g.drawImage(sp8TozArt(0), p.x - 9, p.y - 9, 18, 18);
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function sp8KoyCiz(o, tm, ddx, v0, v1) {   // yakın köy katmanı (sanal v0..v1 arası, ddx kaymasıyla)
  const xa = cam.x - 200 - ddx, xb = cam.x + VW + 200 - ddx, a0 = Math.max(v0, xa), a1 = Math.min(v1, xb);
  if (a1 <= a0) return;
  const isik = typeof dn8IsikOrani === 'function' ? clamp(0.55 + 0.45 * (+dn8IsikOrani() || 0), 0.55, 1) : 1;
  for (const t of o.agaclar) {   // lolipop ağaçları (evlerin arkasında)
    if (t.v < a0 - 60 || t.v > a1 + 60) continue;
    const art = sp8LolipopArt(t.k), w = 90 * t.s, h = 230 * t.s, x = t.v + ddx;
    g.drawImage(art, x - w / 2, t.y - h * (226 / 230), w, h);
  }
  const M = g.getTransform(), ma = M.a, md = M.d, me = M.e, mf = M.f;   // dünya dönüşümü (ev başına save/restore yok)
  for (const e of o.evler) {
    if (e.v + e.w / 2 < a0 || e.v - e.w / 2 > a1) continue;
    const art = sp8EvArt(e.k, e.hay), x = e.v + ddx, sx = e.flip ? -e.sc : e.sc;
    g.setTransform(ma * sx, 0, 0, md * e.sc, ma * x + me, md * e.y + mf);
    g.drawImage(art.c, -art.ox, -art.oy, art.w, art.h);
  }
  g.setTransform(M);
  // pencerelerde yumuşak titreşen ışık, kabaklar, hayaletli baca
  g.globalCompositeOperation = 'lighter';
  for (const e of o.evler) {
    if (e.v + e.w / 2 < a0 || e.v - e.w / 2 > a1) continue;
    const d = SP8_EVLER[e.k], p = d.pen[0], x = e.v + ddx + p[0] * (e.flip ? -e.sc : e.sc), y = e.y + (p[1] + p[3] * 0.5) * e.sc;
    dglow('#ffc070', x, y, 46 * e.sc, (0.12 + 0.08 * Math.sin(tm * 1.3 + e.ft)) * isik);
    for (const k of e.kb) dglow('#ffb347', e.v + ddx + k[0], e.y + k[1] - 10, 26, (0.3 + 0.12 * Math.sin(tm * 2.1 + e.ft + k[0])) * isik);
  }
  g.globalCompositeOperation = 'source-over';
  for (const e of o.evler) {
    if (e.v + e.w / 2 < a0 || e.v - e.w / 2 > a1 || !e.kb.length) continue;
    for (const k of e.kb) { const art = sp8KabakArt(k[2]), s = 0.9 * e.sc; g.drawImage(art, e.v + ddx + k[0] - 18 * s, e.y + k[1] - 28 * s, 36 * s, 30 * s); }
  }
  const H = o.hayEv;
  if (H && H.v > a0 - 100 && H.v < a1 + 100) {   // bacadan yarı çıkmış, el sallayan hayalet (bacanın önü onun altını örter)
    const d = SP8_EVLER[H.k], bx = H.v + ddx + H.bx, ust = H.y + H.by + 6, alt = H.y + sp8CatiY(d, d.baca[0]) * H.sc + 12;
    const yuk = 0.5 + 0.5 * o.hay.el;
    sp8HayaletCiz(g, bx, ust + 18 - 8 * yuk, 1.05, tm, { yon: -1, mutlu: 1, el: o.hay.el, kik: Math.min(1, o.hay.kik), alfa: 1 });
    sp8BacaCiz(g, bx, alt, ust, 22);
  }
  // fener dizileri: saçaktan saçağa sarkan ip, kağıt fenerler ve minik bayraklar (kabak turuncusu, lila, nane)
  g.lineCap = 'round';
  for (const s of o.ipler) {
    if (s.vb < a0 || s.va > a1) continue;
    const xa1 = s.va + ddx, xb1 = s.vb + ddx, sag = s.sag + Math.sin(tm * 1.3 + s.f) * 3, cx = (xa1 + xb1) / 2, cy = Math.max(s.ya, s.yb) + sag;
    g.strokeStyle = '#2a1f4e'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(xa1, s.ya); g.quadraticCurveTo(cx, cy, xb1, s.yb); g.stroke();
    for (let i = 0; i < s.n; i++) {
      const t = (i + 0.5) / s.n, it = 1 - t, x = it * it * xa1 + 2 * it * t * cx + t * t * xb1, y = it * it * s.ya + 2 * it * t * cy + t * t * s.yb;
      const ci = (s.c0 + i) % SP8_REN.length, sal = Math.sin(tm * 1.8 + i + s.f) * 0.12;
      if (i % 2 === 0) {
        g.globalCompositeOperation = 'lighter'; dglow(SP8_REN[ci], x, y + 10, 22, 0.3 * isik); g.globalCompositeOperation = 'source-over';
        g.save(); g.translate(x, y); g.rotate(sal); g.drawImage(sp8FenerArt(ci), -11, -2, 22, 26); g.restore();
      } else {
        g.fillStyle = ['#ff9a3c', '#c39bff', '#7dffc4'][i % 3]; g.beginPath(); g.moveTo(x - 6, y - 1); g.lineTo(x + 6, y - 1); g.lineTo(x + sal * 20, y + 12); g.closePath(); g.fill();
      }
    }
  }
}
function sp8DumanCiz(ddx) {
  const puf = sp8PufArt();
  for (const p of sp8Dum) {
    if (p.l <= 0) continue;
    const u = 1 - p.l / p.m, x = p.x + ddx; if (x < cam.x - 80 || x > cam.x + VW + 80) continue;
    const r = (7 + u * 22) * p.s; g.globalAlpha = 0.32 * Math.sin(Math.min(1, u * 1.15) * Math.PI); g.drawImage(puf, x - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}
function sp8DumanAdim(o, dt, ddx, v0, v1) {   // görünen bacalardan yumuşak duman
  const xa = cam.x - 100 - ddx, xb = cam.x + VW + 100 - ddx;
  for (const e of o.evler) {
    if (e.bx === undefined || e.hay || e.v < Math.max(v0, xa) || e.v > Math.min(v1, xb)) continue;
    e.dk -= dt; if (e.dk <= 0) { e.dk = 0.5 + Math.random() * 0.5; sp8DumanAt(e.v + ddx + e.bx, e.y + e.by); }
  }
}
function sp8DiziCiz(o, tm, ddx) {
  const sira = o.ipucu > 0.05 ? sp8Sonraki(o, 's') : null, xa = cam.x - 80 - ddx, xb = cam.x + VW + 80 - ddx, L = o.dizi;
  for (let i = 0; i < L.length; i++) {
    const r = L[i]; if (r.v < xa) continue; if (r.v > xb) break;
    if (r.d === 'bitti' || r.d === 'alindi') continue;
    let x = r.v + ddx, y = r.yD + Math.sin(tm * 2 + r.faz) * 4, a = 1, sc = 1;
    if (r.d === 'bekle' && r.v > o.v + 900) y = sp8ItemY(o, r) + Math.sin(tm * 2 + r.faz) * 4;
    if (r.d === 'kacti') { const u = clamp(r.t / 2.2, 0, 1); y -= smooth(u) * 190; x += u * 30; a = (1 - u) * 0.75; sc = 1 - u * 0.4; }
    const nab = r === sira ? o.ipucu * (0.5 + 0.5 * Math.sin(tm * 5)) : 0;
    g.globalCompositeOperation = 'lighter';
    dglow(r.tip === 's' ? SP8_REN[r.ci] : '#ffd27a', x, y, (r.tip === 's' ? 30 : 24) * sc + nab * 34, (0.3 + nab * 0.45) * a);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = a;
    if (r.tip === 's') { const s = 0.92 * sc * (1 + 0.05 * Math.sin(tm * 4 + r.faz)); g.save(); g.translate(x, y); g.rotate(Math.sin(tm * 1.6 + r.faz) * 0.25); g.drawImage(sp8SekerArt(r.ci), -27 * s, -17 * s, 54 * s, 34 * s); g.restore(); }
    else { const s = 0.78 * sc * (1 + 0.1 * Math.sin(tm * 5 + r.faz)); g.save(); g.translate(x, y); g.rotate(Math.sin(tm * 0.9 + r.faz) * 0.3); g.drawImage(sp8YildizArt(), -20 * s, -20 * s, 40 * s, 40 * s); g.restore(); }
    g.globalAlpha = 1;
    if (r.d === 'bekle') { const an = tm * 2.2 + r.faz; const pa = 0.5 + 0.5 * Math.cos(an); if (pa > 0.05) { g.globalAlpha = pa; g.drawImage(sp8TozArt(0), x + Math.cos(an) * 17 - 4, y + Math.sin(an) * 13 - 4, 8, 8); g.globalAlpha = 1; } }
  }
}
function sp8IzCiz(ddx) {   // çalıdan dökülen ışıltı izi ve patlama parıltıları (sanal konumda)
  const xa = cam.x - 40 - ddx, xb = cam.x + VW + 40 - ddx;
  for (const p of sp8Toz) {
    if (p.l <= 0 || p.x < xa || p.x > xb) continue;
    const u = p.l / p.m, r = p.s * (1.4 + 1.3 * u) * (0.85 + 0.15 * Math.sin(p.l * 17 + p.c));
    g.globalAlpha = Math.min(1, u * 1.5); g.drawImage(sp8TozArt(p.c), p.x + ddx - r, p.y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}

// ── çizim: biniciler (süpürge, kedi, Feza, Pırıl) ve yarasalar; ay anında siluet ──
function sp8FezaPoz() { return (typeof fezaPozVar === 'function' && fezaPozVar('supurge')) || (typeof FZ_POZLAR !== 'undefined' && FZ_POZLAR && FZ_POZLAR.has && FZ_POZLAR.has('supurge')) ? 'supurge' : 'binis'; }
function sp8YarasalarCiz(c, o, tm, ox, oy) {
  for (let i = 0; i < 4; i++) {
    const Y = o.yar[i]; if (Y.a < 0.02) continue;
    const ga = c.globalAlpha; c.globalAlpha = ga * Y.a;
    sp8YarasaCiz(c, Y.x + ox, Y.y + oy, 0.78, tm + i, { yon: 1, ucus: 1, kanat: Y.f, mutlu: 1 });
    c.globalAlpha = ga;
  }
}
function sp8BinicilerCiz(c, o, tm) {
  const bx = o.dbx, by = o.dby + clamp(o.sq, -1, 1) * 5, rot = o.rot, cs = Math.cos(rot), sn = Math.sin(rot);
  const so = o.sOpt; so.aci = rot; so.isik = 0.25 + 0.35 * o.parla + 0.25 * (o.sevT > 0 ? 1 : 0); so.alfa = 1;
  supurgeCiz(c, bx, by, 1, tm, so);
  // kara kedi: Feza'nın arkasında, çalının bağının üstünde
  const ko = o.kOpt; ko.zipla = o.kZip; ko.el = o.salla; ko.ruzgar = clamp(o.spd / 300, 0, 1); ko.kuyruk = 0.6 + 0.4 * o.salla;
  if (o.kediA === 'binde') { c.save(); c.translate(bx + SP8_KEDX * cs + 7 * sn, by + SP8_KEDX * sn - 7 * cs); c.rotate(rot); sp8KediCiz(c, 0, 0, 0.82, tm, ko); c.restore(); }
  // Feza (oturmuşsa süpürgede)
  const binde = o.faz === 'ucus' || (o.faz === 'binis' && o.oturdu) || (o.faz === 'inis' && o.t < SP8_INIS * 0.34);
  if (binde && typeof fezaCizPoz === 'function') {
    const poz = sp8FezaPoz(), f = o.fzOpt, rz = clamp(0.45 + o.spd / 420, 0.45, 1);
    f.ruzgar = rz; f.salla = o.salla; f.sevinc = Math.max(o.salla, smooth(clamp(o.sevT / 0.4, 0, 1)) * 0.9); f.aci = 0;
    c.save(); c.translate(bx, by); c.rotate(rot); c.translate(0, -3);
    if (poz === 'binis') { const V = sp8V8(); try { sp8PelerinCiz(c, o.ft, V ? V.kostum : null, rz); } catch (e) {} }
    try { o.el = fezaCizPoz(c, 0, 0, 1, poz, o.ft, null, f) || null; } catch (e) { o.el = null; }
    c.restore();
  }
  // Pırıl (yanında uçar; takla, ay anında el sallama)
  if (typeof pirilCizPoz === 'function') {
    const px = o.prX + (o.dbx - o.bx), py = o.prY + (o.dby - o.by - o.bob), tk = o.tk > 0 ? smooth(o.tk) : 0, sal = o.salla * Math.sin(tm * 7) * 0.12;
    try { c.save(); c.translate(px, py); c.rotate(tk * 6.2832 * o.tkYon + sal); c.scale(1 + 0.08 * Math.sin(tk * Math.PI), 1 - 0.08 * Math.sin(tk * Math.PI)); pirilCizPoz(c, 0, 0, 0.95, 'ucus', o.pt, { salla: o.salla }); c.restore(); }
    catch (e) { c.restore(); }
  }
}
let sp8SilC = null, sp8SilQ = null, sp8SilR = null, sp8SilRQ = null;
function sp8SiluetCiz(o, tm, k) {   // biniciler ve yarasalar ara tuvale çizilir, mor-gece rengine boyanır (ay önünde siluet), sonra konur
  const M = g.getTransform(), x0w = o.dbx - 190, x1w = o.dbx + 270, y0w = o.dby - 215, y1w = o.dby + 70;
  const dx0 = Math.max(0, Math.floor(M.a * x0w + M.e)), dy0 = Math.max(0, Math.floor(M.d * y0w + M.f));
  const dx1 = Math.min(cv.width, Math.ceil(M.a * x1w + M.e)), dy1 = Math.min(cv.height, Math.ceil(M.d * y1w + M.f)), w = dx1 - dx0, h = dy1 - dy0;
  if (w < 8 || h < 8) return false;
  if (!sp8SilC) { sp8SilC = document.createElement('canvas'); sp8SilQ = sp8SilC.getContext('2d'); }
  if (sp8SilC.width < w || sp8SilC.height < h) { sp8SilC.width = Math.max(sp8SilC.width, w); sp8SilC.height = Math.max(sp8SilC.height, h); }
  const q = sp8SilQ;
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalAlpha = 1; q.globalCompositeOperation = 'source-over'; q.clearRect(0, 0, w, h);
  q.setTransform(M.a, M.b, M.c, M.d, M.e - dx0, M.f - dy0);
  sp8YarasalarCiz(q, o, tm, o.dbx - o.bx, o.dby - o.by - o.bob);
  sp8BinicilerCiz(q, o, tm);
  q.setTransform(1, 0, 0, 1, 0, 0); q.globalCompositeOperation = 'source-atop'; q.globalAlpha = k; q.fillStyle = '#2a1f4e'; q.fillRect(0, 0, w, h);
  q.globalAlpha = 1; q.globalCompositeOperation = 'source-over';
  // altın kenar ışığı: siluetin aya bakan kenarında ince bant (fezaCizPoz kenar ışığı gibi; ikinci ara tuval)
  if (o.silX !== undefined) {
    let lx = o.silX - (o.dbx + 4), ly = o.silY - (o.dby - 32); const ll = Math.hypot(lx, ly) || 1, ya = clamp(ll / 90, 0, 1);
    lx = lerp(0.25, lx / ll, ya); ly = lerp(-0.97, ly / ll, ya); const l2 = Math.hypot(lx, ly) || 1; lx /= l2; ly /= l2;
    if (!sp8SilR) { sp8SilR = document.createElement('canvas'); sp8SilRQ = sp8SilR.getContext('2d'); }
    if (sp8SilR.width < w || sp8SilR.height < h) { sp8SilR.width = Math.max(sp8SilR.width, w); sp8SilR.height = Math.max(sp8SilR.height, h); }
    const r = sp8SilRQ, dp = 1.8 * Math.abs(M.a);
    r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'copy'; r.globalAlpha = Math.min(1, k * 1.05); r.fillStyle = '#ffe2a0'; r.fillRect(0, 0, w, h);
    r.globalCompositeOperation = 'destination-out'; r.globalAlpha = 1; r.drawImage(sp8SilC, 0, 0, w, h, -lx * dp, -ly * dp, w, h); r.globalCompositeOperation = 'source-over';
    q.globalCompositeOperation = 'source-atop'; q.drawImage(sp8SilR, 0, 0, w, h, 0, 0, w, h); q.globalCompositeOperation = 'source-over';
  }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(sp8SilC, 0, 0, w, h, dx0, dy0, w, h); g.restore();
  return true;
}
function sp8KurdeleCiz(o, tm) {   // yardım: Pırıl'ın patisinden süpürgenin topuzuna ışıktan kurdele
  const a = o.yardimA * (o.faz === 'ucus' ? 1 : 0); if (a < 0.03) return;
  const cs = Math.cos(o.rot), sn = Math.sin(o.rot), tx = o.dbx + 104 * cs, ty = o.dby + 104 * sn, px = o.prX + (o.dbx - o.bx) - 10, py = o.prY + (o.dby - o.by - o.bob) + 10;
  const mx = (tx + px) / 2, my = Math.max(ty, py) + 16 + Math.sin(tm * 3) * 5;
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  g.strokeStyle = 'rgba(255,190,240,' + (0.35 * a).toFixed(3) + ')'; g.lineWidth = 7; g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(mx, my, tx, ty); g.stroke();
  g.strokeStyle = 'rgba(255,250,235,' + (0.8 * a).toFixed(3) + ')'; g.lineWidth = 2; g.stroke();
  g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 4; i++) { const t = ((tm * 0.6 + i / 4) % 1), it = 1 - t, x = it * it * px + 2 * it * t * mx + t * t * tx, y = it * it * py + 2 * it * t * my + t * t * ty; g.globalAlpha = a * Math.sin(t * Math.PI); g.drawImage(sp8TozArt(2 + i % 3), x - 5, y - 5, 10, 10); }
  g.globalAlpha = 1;
}
const SP8_SEPET = { x: 24, y: 6 };   // feza.js 'supurge' pozunda kabak sepeti sapta, ellerin önünde asılı (süpürge ortasına göre)
function sp8UcanCiz(o, tm) {   // alınan şeker sepete (Feza'nın kucağına) uçar; yıldız göğe süzülüp parlar
  const L = o.dizi;
  for (let i = 0; i < L.length; i++) {
    const r = L[i]; if (r.d !== 'alindi') continue;
    const u = clamp(r.t / 0.45, 0, 1), e = smooth(u);
    if (r.tip === 's') {
      const x = o.dbx + lerp(r.rx, SP8_SEPET.x, e), y = o.dby + lerp(r.ry, SP8_SEPET.y, e) - Math.sin(u * Math.PI) * 26, s = lerp(0.95, 0.45, e);
      g.globalCompositeOperation = 'lighter'; dglow(SP8_REN[r.ci], x, y, 26, 0.5 * (1 - u * 0.5)); g.globalCompositeOperation = 'source-over';
      if (u < 1) { g.globalAlpha = 1 - u * 0.4; g.drawImage(sp8SekerArt(r.ci), x - 27 * s, y - 17 * s, 54 * s, 34 * s); g.globalAlpha = 1; }
      else if (r.t < 0.55) { g.globalCompositeOperation = 'lighter'; dglow('#fff4c8', o.dbx + SP8_SEPET.x, o.dby + SP8_SEPET.y, 30, (0.55 - r.t) * 6); g.globalCompositeOperation = 'source-over'; }
    } else {
      const x = o.dbx + r.rx + e * 10, y = o.dby + r.ry - e * 70, s = 0.8 * (1 + e * 0.6);
      g.globalCompositeOperation = 'lighter'; dglow('#ffe7a8', x, y, 30 + e * 30, 0.6 * (1 - e)); g.globalCompositeOperation = 'source-over';
      g.globalAlpha = 1 - e; g.drawImage(sp8YildizArt(), x - 20 * s, y - 20 * s, 40 * s, 40 * s); g.globalAlpha = 1;
    }
  }
}
function sp8OnCiz(o) {   // ön planda hızla akan koyu çatı siluetleri (derinlik); kalkışta belirir, inişte söner
  const a = smooth(clamp((o.v - 300) / 700, 0, 1)) * (1 - smooth(clamp((o.v - (SP8_LV - 1300)) / 900, 0, 1))); if (a < 0.02) return;
  const art = sp8OnSeritArt(), VHg = VH / cam.zoom, top = cam.y + VHg - 88;
  let sx = -((o.v * 1.38) % art.w); if (sx > 0) sx -= art.w;
  g.globalAlpha = a * 0.96;
  for (let x = sx; x < VW + 2; x += art.w) g.drawImage(art.c, cam.x + x - 1, top, art.w + 2, art.h);
  g.globalAlpha = 1;
}
function sp8BekleCiz(o, tm) {   // süpürge bahçenin ucunda salınır; kedi üstünde (ya da yerde); oturağın üstünde davetkâr parıltı
  if (o.hazir) {
    g.globalCompositeOperation = 'lighter'; dglow('#ffd7e6', o.dbx, o.dby - 16, 70, 0.2 + 0.07 * Math.sin(tm * 2)); g.globalCompositeOperation = 'source-over';
    const so = o.sOpt; so.aci = o.rot; so.kipir = 0.55; so.isik = 0.35 + 0.1 * Math.sin(tm * 2); so.alfa = 1;
    supurgeCiz(g, o.dbx, o.dby, 1, tm, so);
    for (let i = 0; i < 3; i++) { const u = (tm * 0.4 + i / 3) % 1, pa = Math.sin(u * Math.PI) * 0.85; g.globalAlpha = pa; const r = 4.5; g.drawImage(sp8TozArt(1 + i), o.dbx - 4 + Math.sin(i * 2.1 + tm) * 14 - r, o.dby - 20 - u * 56 - r, r * 2, r * 2); g.globalAlpha = 1; }
  }
  const ko = o.kOpt; ko.zipla = o.kZip; ko.el = 0; ko.ruzgar = 0; ko.kuyruk = 0.6;
  if (o.kediA === 'binde') { const cs = Math.cos(o.rot), sn = Math.sin(o.rot); g.save(); g.translate(o.dbx + SP8_KEDX * cs + 7 * sn, o.dby + SP8_KEDX * sn - 7 * cs); g.rotate(o.rot); sp8KediCiz(g, 0, 0, 0.82, tm, ko); g.restore(); }
  else if (o.kediA !== 'yok') { ko.yon = o.kediYon; const ga = g.globalAlpha; g.globalAlpha = ga * o.kediA0; sp8KediCiz(g, o.kedX, o.kedY, 0.82, tm, ko); g.globalAlpha = ga; ko.yon = 1; }
}
function sp8BitmisCiz(o, tm) {   // yolculuktan sonra: süpürge meydanın girişinde salınarak dinlenir, kedi yanında oturur
  const so = o.sOpt; so.aci = -0.04; so.kipir = 0.35; so.isik = 0.25; so.alfa = 1;
  so.aci = -0.12; supurgeCiz(g, o.bx, o.by + Math.sin(tm * 1.9) * 3, 1, tm, so);
  const ko = o.kOpt; ko.zipla = o.kZip; ko.el = 0; ko.ruzgar = 0; ko.kuyruk = 0.5;
  sp8KediCiz(g, o.kedX, o.kedY, 0.82, tm, ko);
}
// ── yakın katmanın hangi parçası, hangi kaymayla çizilir: uçuşta hepsi (sanal kayma), önce/sonra boşluğun iki ucu (dünyaya yapışık) ──
function sp8Katman(o) {
  if (o.faz === 'bekle') return [o.K.xs, 0, 1800];
  if (o.faz === 'bitti') return [o.dxSon, SP8_LV - 1800, SP8_LV + 400];
  return [o.ddx, 0, SP8_LV + 400];
}
TUR.kaydet('supurgeMini', {
  kur: sp8Kur,
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    sp8ParcaAdim(dt);
    if (o.faz === 'bekle') {
      if (Math.abs(P.x - o.kx) < 2600) sp8Isit();   // yaklaşırken önbellekleri karelere yayarak hazırla
      sp8BekleAdim(o, dt);
      if (o.hazir && DURUM === 'oyun' && !P.ucus && !o.done && P.fade <= 0) {
        const dx = P.x - o.kx;
        if ((Math.abs(dx) < 72 && Math.abs(P.y - o.y) < 120) || (dx > -10 && dx < 500 && P.y > o.y - 160 && P.y < o.y + 80)) sp8Basla(o);
      }
      sp8DumanAdim(o, dt, o.K.xs, 0, 1800);
      return;
    }
    if (o.faz === 'bitti') {   // süpürge Feza'nın önünden çekilir: arkasından süzülüp meydan yolunun kenarında dinlenir
      o.t += dt; const k = 1 - Math.exp(-dt * 1.6);
      o.bx = lerp(o.bx, o.K.inisX + 120, k); o.by = lerp(o.by, o.K.gy - 40, k); o.x = o.bx;   // Feza'nın arkasından geçip sağında dinlenir
      sp8DumanAdim(o, dt, o.dxSon, SP8_LV - 1800, SP8_LV + 400);
      return;
    }
    // çizim konumu: iki fizik adımı arasındaki yumuşatma (oyun.js P.x'i ara konuma koyar; aynı oranla süpürge ve yakın katman)
    if (o.faz === 'ucus') {
      const d = o.pX - o.pXOn, al = Math.abs(d) > 1e-4 ? clamp((P.x - o.pXOn) / d, 0, 1.25) : 1;
      o.ddx = lerp(o.dxOn, o.dx, al); o.dbx = o.bx + (P.x - o.pX); o.dby = o.by + o.bob + (P.y - o.pY);
    } else { o.ddx = o.dx; o.dbx = o.bx; o.dby = o.by + o.bob; }
    // ay önündeyken siluet oranı (göğüs ayın diskinde)
    const aw = o.faz === 'ucus' ? sp8AyW(o.v) : 0;
    if (aw > 0.005) {
      const A = sp8AyCizilen(o), d = Math.hypot(o.dbx + 4 - A.x, o.dby - 32 - A.y) / Math.max(1, A.r);
      o.silX = A.x; o.silY = A.y;   // ışığın geldiği yer (kenar ışığı yönü)
      o.silA = lerp(o.silA, smooth(clamp((1.0 - d) / 0.38, 0, 1)) * SP8_SIL * smooth(clamp(aw * 2.6, 0, 1)), 1 - Math.exp(-dt * 4));
    } else o.silA = Math.max(0, o.silA - dt);
    sp8DumanAdim(o, dt, o.ddx, 0, SP8_LV);
  },
  ciz(o, tm) {
    const [ddx, v0, v1] = sp8Katman(o);
    if (P.ucus === o) { sp8AyCiz(o); sp8KayanCiz(); }
    sp8KoyCiz(o, tm, ddx, v0, v1);
    sp8DumanCiz(ddx);
    if (P.ucus === o) sp8DiziCiz(o, tm, ddx);
    if (o.faz === 'bekle') sp8BekleCiz(o, tm);
    else if (o.faz === 'bitti') { sp8IzCiz(o.dxSon); sp8BitmisCiz(o, tm); }
  },
  cizOn(o, tm) {
    if (P.ucus !== o) { if (o.faz === 'bekle') sp8IzCiz(o.K.xs); return; }
    sp8IzCiz(o.ddx);
    let sil = false;
    if (o.silA > 0.02) {
      g.globalCompositeOperation = 'lighter'; dglow('#ffe7a8', o.dbx + 10, o.dby - 40, 150, 0.22 * o.silA / SP8_SIL); g.globalCompositeOperation = 'source-over';
      try { sil = sp8SiluetCiz(o, tm, o.silA); } catch (e) { sil = false; }
    }
    if (!sil) { sp8YarasalarCiz(g, o, tm, o.dbx - o.bx, o.dby - o.by - o.bob); sp8BinicilerCiz(g, o, tm); }
    // biniş / iniş: süpürgenin dışındaki Feza (atlarken)
    const disarda = (o.faz === 'binis' && !o.oturdu) || (o.faz === 'inis' && o.t >= SP8_INIS * 0.34);
    if (disarda && typeof fezaCizPoz === 'function') { try { fezaCizPoz(g, P.x, P.y, 1, 'sevinc', o.ft); } catch (e) {} }
    if (o.kediA !== 'binde' && o.kediA !== 'yok') { const ko = o.kOpt; ko.zipla = o.kZip; ko.el = 0; ko.ruzgar = 0; ko.yon = o.kediYon; const ga = g.globalAlpha; g.globalAlpha = ga * o.kediA0; sp8KediCiz(g, o.kedX, o.kedY, 0.82, tm, ko); g.globalAlpha = ga; ko.yon = 1; }
    sp8KurdeleCiz(o, tm);
    sp8UcanCiz(o, tm);
    sp8OnCiz(o);
  }
});
