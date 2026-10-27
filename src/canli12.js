/* canli12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün): kampüsün canlı hayatı. Sözleşme: src/BOLUM12.md.
   Dünya "yaşıyor": Feza yürürken yanından geçer; dokunursa sevimli bir tepki, dokunmazsa her canlı kendi hayatını yaşar.
   HİÇBİRİ Feza'yı durdurmaz, yolu kapatmaz, çarpışma üretmez. Korkutucu hiçbir şey yok; böcek yok (kelebekler de kaldırıldı: yerlerinde karahindiba tohumları süzülür).
   Türler (hepsi bu dosyada, yükleme anında nesne() ile yerleşir; en altta YERLEŞİM):
     k12Kedi      kampüs kedileri: o.kurk 'tekir' | 'sarman' | 'beyaz' (beyaz-siyah), o.hal 'gunes' (güneşlenir) | 'bank'
                  (bankta kıvrılıp uyur) | 'otur' (oturur, kuyruğunu sallar). Feza geçerken başını kaldırıp bakar, ara sıra miyavlar;
                  dokununca miyavlar, Feza'nın bacaklarına sürtünür, kuyruğu dik; bir kedi bir süre Feza'nın önünde koşturup
                  ona bakarak eşlik eder, sonra kendi yerine döner (aynı anda en çok bir kedi). OLAY 'k12KediSev', 'k12KediMiyav',
                  'k12KediTakip'.
     k12Kopek     iri, pofuduk, kulak küpeli kampüs köpeği. Yatar; Feza gelince kalkar, kuyruk sallar, yanına gelip oturur;
                  dokununca oturup pati verir. o.uykucu: yalnız başını kaldırıp kuyruğunu yere vurur. OLAY 'k12KopekSev', 'k12KopekHav'.
     k12Kus       serçe sürüsü: yerde gagalar; Feza yaklaşınca havalanıp biraz ötede yeniden konar (o.kacmaz: binişte kaçmaz,
                  yalnız hoplar, başlarını çevirir). OLAY 'k12KusHavalan', 'k12KusDokun'.
     k12Marti     uzakta süzülen martı (paralaks; gökte). OLAY 'k12MartiDokun'.
     k12Kelebek   çiçeğinin çevresinde uçar, Feza yaklaşınca bir süre başının çevresinde dans eder, sonra çiçeğine konar.
                  OLAY 'k12KelebekDokun'.
     k12Sincap    ağacın dibinde cevizini kemirir; Feza yaklaşınca ağaca tırmanır (ZN12_AGAC varsa; yoksa hoplayıp kaçar),
                  sonra iner. OLAY 'k12SincapDokun'.
     k12Ogrenci   uzakta (arka yolda, küçük ölçek, paralaks .86) yürüyen / bisiklet süren / çimde kitap okuyan öğrenciler;
                  Feza yaklaşınca el sallar. Feza'nın şeridine hiç girmez. OLAY 'k12OgrenciSelam'.
     k12Fiskiye   çim fıskiyesi: kavis kavis su, damlalar, güneşte gökkuşağı parıltısı; dokununca fışkırır. OLAY 'k12FiskiyeDokun'.
   Botanik bahçesi (tur 2; kaplumbağalar BOTANIK'in, ördek/kuğu/kaz GOLET'in):
     k12KelebekBulut  tarhın üstünde 6–7 kelebek; Feza geçerken çevresinde döner. OLAY 'k12KelebekBulut'.
     k12Kirlangic     alçaktan süzülüp Feza'nın önünden dalış yapan kırlangıçlar; dokununca takla. OLAY 'k12KirlangicDokun'.
     k12Kirpi         burnunu kıpırdatarak dolaşan, sırtında yaprak taşıyan yumuşak kirpi. OLAY 'k12KirpiDokun'.
     k12Kus o.tur 'ispinoz', k12Kedi o.hal 'su' (taş kabından su içer; OLAY 'k12KediSu').
   Akıcılık: kuyruklar yaylı ikincil hareketle (cnKuyrukYay) izler, bacaklar dizden bükülür, dururken nefes alır, baş adımla salınır.
   Olayların hepsi { o, x, y } taşır (dünya koordinatı). Ses bu dosyada yok (MUZIK dinler).
   Dokunma: pencereye yakalama evresinde tek 'pointerdown' dinleyicisi; dünya koordinatına çevirip yalnız kendi canlılarımıza
   isabet ederse preventDefault + stopPropagation (Feza'nın yürüme girdisi çalınmaz). Binişte (P.ucus) canlı tepki verir ama
   dokunuş araca da gider (basılı tutma = ilerle bozulmasın).
   Derinlik: Feza'nın şeridi y = 720; yolun arkasındaki çimen y ≈ 704 (biraz küçük çizilir); uzak yol y ≈ 650.
   Performans: gövde/baş/bank/gökkuşağı gibi gölgeli parçalar bir kez önbellek tuvaline çizilir; karede gradient yok, yeni dizi/nesne
   yok; ekran dışındakiler çizilmez, uzaktakiler güncellenmez. Yalnız BOLUM_NO === 12 iken çalışır. */
'use strict';
(() => {
if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12) return;

// ════════════════════ ortak ════════════════════
const CN_PI2 = Math.PI * 2;
const CN_YOL = 720, CN_CIM = 704, CN_UZAK = 650;   // Feza'nın şeridi, yolun arkasındaki çimen, uzak yol (dünya y)
const CN_RES = 5;                                  // önbellek tuvali: dünya birimi başına piksel
const CN = { liste: [], takipci: null, spr: Object.create(null), saat: 0 };

function cnSaat() { return performance.now() / 1000; }
function cnYaklas(v, h, k) { return v + (h - v) * (1 - Math.exp(-k)); }   // k = hız × dt
function cnDerinlik(y) { return 1 - (CN_YOL - y) * 0.006; }                 // çimendeki canlı biraz küçük görünür
function cnGorunur(x, pay) { return typeof cam === 'undefined' || (x > cam.x - pay && x < cam.x + VW + pay); }
function cnOlay(ad, o, x, y) { if (typeof OLAY !== 'undefined') OLAY.emit(ad, { o, x, y }); }
function cnFezaBinis() { return !!P.ucus; }

// yerel koordinatlı önbellek tuvali: (x0, y0) sol üst köşe, w × h dünya birimi
function cnTuval(x0, y0, w, h) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * CN_RES); c.height = Math.ceil(h * CN_RES);
  const q = c.getContext('2d'); q.scale(CN_RES, CN_RES); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  c.x0 = x0; c.y0 = y0; c.w = w; c.h = h;
  return { c, q };
}
function cnKoy(c, spr) { c.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h); }
function cnElips(c, x, y, rx, ry, rot, renk) { c.fillStyle = renk; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, CN_PI2); c.fill(); }
function cnGolge(c, x, y, rx, a) { c.fillStyle = 'rgba(48,72,40,' + (a || .2) + ')'; c.beginPath(); c.ellipse(x, y, rx, rx * .2, 0, 0, CN_PI2); c.fill(); }
function cnIsik(c, renk, x, y, r, a) {   // yumuşak ışık (ortak.js glow önbelleği)
  if (!(a > .004) || typeof glow !== 'function') return;
  const ga = c.globalAlpha; c.globalAlpha = ga * Math.min(1, a); c.drawImage(glow(renk), x - r, y - r, r * 2, r * 2); c.globalAlpha = ga;
}
// Yükselen küçük kalpler: t = tetiklendiğinden beri geçen sn (0..1.8)
function cnKalp(c, x, y, r) {
  c.beginPath(); c.moveTo(x, y + r * .9);
  c.bezierCurveTo(x - r * 1.5, y - r * .1, x - r * .7, y - r * 1.3, x, y - r * .45);
  c.bezierCurveTo(x + r * .7, y - r * 1.3, x + r * 1.5, y - r * .1, x, y + r * .9); c.fill();
}
function cnKalpler(c, x, y, t, olcek) {
  if (!(t >= 0 && t < 1.8)) return;
  const ga = c.globalAlpha;
  for (let i = 0; i < 3; i++) {
    const u = (t - i * .22) / 1.4; if (u <= 0 || u >= 1) continue;
    c.globalAlpha = ga * Math.sin(Math.PI * u) * .95;
    c.fillStyle = i === 1 ? '#ffb3c8' : '#ff8fb1';
    cnKalp(c, x + (i - 1) * 9 * olcek + Math.sin(u * 7 + i) * 3 * olcek, y - u * 34 * olcek, (3.2 + i % 2) * olcek * (.7 + .3 * u));
  }
  c.globalAlpha = ga;
}
// Göz kırpma (0 açık .. 1 kapalı): her canlıya kendi tohumu
function cnKirp(t, tohum) {
  const kf = t * .8 + tohum;
  return Math.max(Math.pow(Math.max(0, Math.sin(kf)), 70), Math.sin(kf * .31) > .7 ? Math.pow(Math.max(0, Math.sin(kf - .35)), 70) : 0);
}
// Dokunma için son çizilen yer (dünya); dokunuş yalnız son 0.3 sn'de çizilmiş canlıya isabet eder
function cnIsabet(o, x, y, rx, ry) { o.hx = x; o.hy = y; o.hrx = rx; o.hry = ry || rx; o.hT = CN.saat; }
function cnKayit(o) { CN.liste.push(o); }

// ════════════════════ kampüs kedileri ════════════════════
// Renkler: g tüy, gk tüy gölgesi, cz çizgi/leke, kr krem (karın, ağız), pt pati, gz göz, ku kuyruk ucu, ki kulak içi
const CN_KURK = {
  tekir:  { g: '#a69482', gk: '#7b6b5d', cz: '#5d4f45', kr: '#f2e9dd', pt: '#f0e6d8', gz: '#a3d06a', ku: '#5d4f45', ki: '#f3bcb6', kuy: '#a69482' },
  sarman: { g: '#f1a760', gk: '#cf8243', cz: '#c76d30', kr: '#fde8cd', pt: '#fde8cd', gz: '#f2c64e', ku: '#c76d30', ki: '#f7b9a9', kuy: '#f1a760' },
  beyaz:  { g: '#f8f4ee', gk: '#d8d0c7', cz: '#3b3541', kr: '#ffffff', pt: '#ffffff', gz: '#cfdc5c', ku: '#3b3541', ki: '#f5c2c2', kuy: '#3b3541' }
};
// Gövde (yatay elips, merkez 0,0): tüy hacmi, krem karın, sırtta tekir çizgileri ya da siyah leke
function cnKediGovde(ad) {
  const p = CN_KURK[ad], t = cnTuval(-17, -11, 34, 22), q = t.q;
  q.fillStyle = p.g; q.beginPath(); q.ellipse(0, 0, 15, 8.6, 0, 0, CN_PI2); q.fill();
  q.save(); q.clip();
  const gr = q.createLinearGradient(0, -8.6, 0, 8.6);
  gr.addColorStop(0, 'rgba(255,248,236,.32)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(-15, -9, 30, 18);
  if (ad === 'beyaz') { cnElips(q, -3.5, -4.6, 9.5, 6.2, -.1, p.cz); cnElips(q, 6.5, -6.5, 4, 3, 0, p.cz); }
  else {
    q.strokeStyle = p.cz; q.globalAlpha = .72; q.lineWidth = 2.1;
    for (let i = -2; i <= 2; i++) { q.beginPath(); q.moveTo(i * 4.8 - 1.2, -9); q.quadraticCurveTo(i * 4.8 + 1.4, -5.5, i * 4.8 + .4, -2.2); q.stroke(); }
    q.globalAlpha = 1;
  }
  cnElips(q, 2, 7, 11, 3.4, 0, p.kr);
  q.globalAlpha = .26; cnElips(q, -1, -5.6, 10, 2.4, -.05, '#ffffff'); q.globalAlpha = 1;
  q.restore();
  q.strokeStyle = p.gk; q.globalAlpha = .45; q.lineWidth = .7; q.beginPath(); q.ellipse(0, 0, 15, 8.6, 0, 0, CN_PI2); q.stroke();
  return t.c;
}
// Baş (3/4 sağa bakış, merkez 0,0): kulaklar, yanak tüyleri, krem ağız, pembe burun, bıyık. Gözler ve ağız karede çizilir.
function cnKediBas(ad) {
  const p = CN_KURK[ad], t = cnTuval(-15, -20, 31, 32), q = t.q;
  const kulak = (x0, y0, xt, yt, x1, y1, ic) => {
    q.fillStyle = ad === 'beyaz' ? p.cz : p.g; q.beginPath(); q.moveTo(x0, y0);
    q.quadraticCurveTo(xt - .6, yt + 1.2, xt, yt); q.quadraticCurveTo(xt + .9, yt + .6, x1, y1); q.closePath(); q.fill();
    q.fillStyle = ic; q.beginPath(); q.moveTo(lerp(x0, x1, .22), lerp(y0, y1, .22) - .4);
    q.quadraticCurveTo(xt, yt + 3.2, xt + .1, yt + 2.4); q.quadraticCurveTo(xt + .6, yt + 3, lerp(x0, x1, .78), lerp(y0, y1, .78) - .4); q.closePath(); q.fill();
  };
  kulak(-10, -2.5, -8.2, -15.5, -2.2, -7.6, p.ki);
  kulak(1.2, -8.2, 7.6, -16.6, 11, -3, p.ki);
  q.fillStyle = p.g; q.beginPath(); q.ellipse(0, 0, 11.4, 9.5, 0, 0, CN_PI2); q.fill();
  cnElips(q, -8.6, 3.6, 4.4, 4, .3, p.g); cnElips(q, 8.9, 3.3, 4.6, 4, -.3, p.g);
  q.save(); q.beginPath(); q.ellipse(0, 0, 11.4, 9.5, 0, 0, CN_PI2); q.ellipse(-8.6, 3.6, 4.4, 4, .3, 0, CN_PI2); q.ellipse(8.9, 3.3, 4.6, 4, -.3, 0, CN_PI2); q.clip();
  const gr = q.createLinearGradient(0, -10, 0, 9);
  gr.addColorStop(0, 'rgba(255,250,240,.34)'); gr.addColorStop(.55, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(-14, -11, 28, 20);
  if (ad === 'beyaz') {   // siyah başlık: alın ve uzak göz çevresi, beyaz burun köprüsü
    q.fillStyle = p.cz; q.beginPath(); q.ellipse(-2.5, -6.6, 11.5, 6.4, -.08, 0, CN_PI2); q.fill();
    cnElips(q, -4.2, -1.2, 4.6, 4.4, 0, p.cz);
    q.fillStyle = p.g; q.beginPath(); q.moveTo(1.4, -9.8); q.quadraticCurveTo(4.6, -4, 4.4, 1); q.lineTo(1, 1); q.quadraticCurveTo(.4, -4, 1.4, -9.8); q.fill();
  } else {   // alında tekir "M"si, yanak çizgileri
    q.strokeStyle = p.cz; q.lineWidth = 1.3; q.globalAlpha = .8;
    q.beginPath(); q.moveTo(-3.6, -9.2); q.lineTo(-2.6, -5.6); q.moveTo(.6, -9.7); q.lineTo(.9, -5.9); q.moveTo(4.6, -9.1); q.lineTo(3.8, -5.6);
    q.moveTo(-12, 1.2); q.lineTo(-8.4, 1.8); q.moveTo(-11.6, 4.2); q.lineTo(-8.6, 4); q.moveTo(12.6, .6); q.lineTo(9.6, 1.4); q.stroke();
    q.globalAlpha = 1;
  }
  cnElips(q, 3.8, 4.2, 6.4, 4, 0, p.kr);
  cnElips(q, 3.2, 7.4, 3.6, 2, 0, p.kr);
  q.globalAlpha = .3; cnElips(q, -3, -6.4, 6, 2.2, -.1, '#ffffff'); q.globalAlpha = 1;
  q.restore();
  // burun (yumuşak pembe üçgen) ve bıyıklar
  q.fillStyle = '#ec919f'; q.beginPath(); q.moveTo(3.9, 1.3); q.lineTo(7.1, 1.1); q.quadraticCurveTo(5.8, 3.4, 5.5, 3.3); q.quadraticCurveTo(5.1, 3.3, 3.9, 1.3); q.fill();
  q.strokeStyle = 'rgba(255,255,255,.85)'; q.lineWidth = .4;
  q.beginPath(); q.moveTo(9, 3.5); q.lineTo(15, 2.2); q.moveTo(9, 4.6); q.lineTo(15.2, 4.8); q.moveTo(-1.5, 3.8); q.lineTo(-6.5, 3); q.stroke();
  return t.c;
}
// Bankta kıvrılmış uyuyan kedi (yer y = 0): yuvarlak sırt, başını patilerine gömmüş, kuyruğu önüne dolanmış, kapalı gözler
function cnKediKivril(ad) {
  const p = CN_KURK[ad], t = cnTuval(-21, -25, 42, 27), q = t.q;
  q.fillStyle = p.g; q.beginPath(); q.ellipse(-1, -10.5, 16.5, 10.5, 0, 0, CN_PI2); q.fill();
  q.save(); q.clip();
  const gr = q.createLinearGradient(0, -21, 0, 0);
  gr.addColorStop(0, 'rgba(255,248,236,.34)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(-18, -21, 36, 21);
  if (ad === 'beyaz') cnElips(q, -5, -15, 10.5, 6.5, -.15, p.cz);
  else {
    q.strokeStyle = p.cz; q.globalAlpha = .7; q.lineWidth = 2.2;
    for (let i = -2; i <= 1; i++) { q.beginPath(); q.moveTo(i * 5.4 - 1, -21); q.quadraticCurveTo(i * 5.4 + 2.2, -16, i * 5.4 + 1.4, -11.5); q.stroke(); }
    q.globalAlpha = 1;
  }
  q.restore();
  // baş: sağ önde, yanağı patilerinin üstünde
  const bas = ad === 'beyaz' ? p.cz : p.g;
  q.fillStyle = bas;
  q.beginPath(); q.moveTo(4.6, -12.5); q.lineTo(6.3, -19.6); q.lineTo(9.6, -14.2); q.closePath(); q.fill();
  q.beginPath(); q.moveTo(11.4, -14.4); q.lineTo(15.6, -19.4); q.lineTo(16.4, -11.8); q.closePath(); q.fill();
  q.fillStyle = p.ki; q.beginPath(); q.moveTo(12.6, -14.2); q.lineTo(15.2, -17.4); q.lineTo(15.6, -12.6); q.closePath(); q.fill();
  cnElips(q, 10.8, -8.8, 8.4, 6.8, .08, p.g);
  if (ad === 'beyaz') { cnElips(q, 9.5, -12.4, 7.6, 3.6, .1, p.cz); }
  else { q.strokeStyle = p.cz; q.lineWidth = 1.1; q.globalAlpha = .75; q.beginPath(); q.moveTo(9, -15); q.lineTo(9.6, -12.4); q.moveTo(12, -15.2); q.lineTo(12, -12.6); q.stroke(); q.globalAlpha = 1; }
  cnElips(q, 13.2, -5.8, 4.4, 2.8, 0, p.kr);
  q.strokeStyle = '#4a3a34'; q.lineWidth = .9;   // mutlu uyku gözleri
  q.beginPath(); q.moveTo(8, -9.4); q.quadraticCurveTo(9.6, -8, 11.2, -9.2); q.moveTo(13.2, -9.6); q.quadraticCurveTo(14.6, -8.4, 16, -9.4); q.stroke();
  q.fillStyle = '#ec919f'; q.beginPath(); q.ellipse(15.6, -6.8, 1.4, 1, 0, 0, CN_PI2); q.fill();
  // pati ve öne dolanan kuyruk
  cnElips(q, 15.4, -2.4, 3.6, 2.4, 0, p.pt);
  q.lineCap = 'round'; q.strokeStyle = p.kuy; q.lineWidth = 5;
  q.beginPath(); q.moveTo(-15.5, -5); q.quadraticCurveTo(-6, 1.6, 9, -1.8); q.stroke();
  q.strokeStyle = p.ku; q.lineWidth = 5.2; q.beginPath(); q.moveTo(5, -1); q.quadraticCurveTo(7.4, -1.4, 9.4, -1.9); q.stroke();
  q.strokeStyle = p.gk; q.globalAlpha = .4; q.lineWidth = .7; q.beginPath(); q.ellipse(-1, -10.5, 16.5, 10.5, 0, Math.PI * 1.05, Math.PI * 1.95); q.stroke();
  return t.c;
}
function cnKediSpr(ad) {
  let s = CN.spr['kedi_' + ad];
  if (!s) s = CN.spr['kedi_' + ad] = { govde: cnKediGovde(ad), bas: cnKediBas(ad), kivril: cnKediKivril(ad) };
  return s;
}
// Kedi gözü: renkli iris, dikey göz bebeği, iki parıltı; kapalıyken kavis (mutlu ^ ya da uykulu ︶)
function cnKediGoz(c, gx, gy, rk, renk, kapak, mutlu, bak) {
  c.lineCap = 'round';
  if (mutlu > .5 || kapak > .82) {
    c.strokeStyle = '#3b2c28'; c.lineWidth = 1.05; c.beginPath();
    if (mutlu > .5) { c.moveTo(gx - 2.6 * rk, gy + .9); c.quadraticCurveTo(gx, gy - 2.1, gx + 2.6 * rk, gy + .9); }
    else { c.moveTo(gx - 2.6 * rk, gy); c.quadraticCurveTo(gx, gy + 2, gx + 2.6 * rk, gy); }
    c.stroke(); return;
  }
  const ry = 3.4 * (1 - kapak), rx = 2.75 * rk;
  c.fillStyle = '#3b2c28'; c.beginPath(); c.ellipse(gx, gy, rx + .45, ry + .45, 0, 0, CN_PI2); c.fill();
  c.fillStyle = renk; c.beginPath(); c.ellipse(gx, gy, rx, ry, 0, 0, CN_PI2); c.fill();
  if (ry > 1.2) {
    // yuvarlak, iri göz bebeği (ince yarık bebek uzaktan "$" gibi okunuyordu); üstte büyük, altta küçük parıltı
    const bx = gx + bak * .55 * rk, by = gy + ry * .08;
    c.fillStyle = '#2a1f1c'; c.beginPath(); c.ellipse(bx, by, 1.85 * rk, Math.min(ry * .74, 2.3), 0, 0, CN_PI2); c.fill();
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(bx - .75 * rk, by - ry * .36, 1.05, 0, CN_PI2); c.fill();
    c.beginPath(); c.arc(bx + .8 * rk, by + ry * .3, .5, 0, CN_PI2); c.fill();
  }
}
// Kuyruk: ikinci dereceden eğri; son çeyrek uç rengiyle
function cnKuyruk(c, bx, by, kx, ky, ux, uy, lw, renk, ucRenk) {
  c.lineCap = 'round'; c.strokeStyle = renk; c.lineWidth = lw;
  c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(kx, ky, ux, uy); c.stroke();
  if (!ucRenk || ucRenk === renk) return;
  const u = .74, a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u;
  c.strokeStyle = ucRenk; c.lineWidth = lw * 1.05;
  c.beginPath(); c.moveTo(a * bx + b * kx + d * ux, a * by + b * ky + d * uy); c.quadraticCurveTo(kx + (ux - kx) * u, ky + (uy - ky) * u, ux, uy); c.stroke();
}
// Bacak: kalçadan patiye; bk ≠ 0 ise diz/bilek o kadar bükülür (adım atarken yumuşak, organik eğri)
function cnAyak(fz, ph, adim) { return Math.sin(fz + ph) * adim; }                 // adım fazında patinin ileri-geri yeri
function cnKaldir(fz, ph, kalk) { return Math.max(0, Math.cos(fz + ph)) * kalk; }    // ileri giderken pati yerden kalkar
function cnBacak(c, x0, y0, x1, y1, lw, renk, pati, pr, bk) {
  c.strokeStyle = renk; c.lineWidth = lw; c.beginPath(); c.moveTo(x0, y0);
  if (bk) c.quadraticCurveTo((x0 + x1) / 2 + bk, (y0 + y1) / 2, x1, y1); else c.lineTo(x1, y1);
  c.stroke();
  cnElips(c, x1 + pr * .25, y1 - pr * .3, pr, pr * .62, 0, pati);
}

// Kuyruk yayı: çizilen kuyruk hedef pozu biraz gecikmeyle izler (ikincil hareket; ani sıçrama olmaz). Sonuç CN_KY'ye yazılır.
const CN_KY = { kx: 0, ky: 0, ux: 0, uy: 0 };
function cnKuyrukYay(k, kx, ky, ux, uy) {
  let y = k.kuyYay;
  if (!y) y = k.kuyYay = { kx, ky, ux, uy, vkx: 0, vky: 0, vux: 0, vuy: 0, t: CN.saat };
  const dt = clamp(CN.saat - y.t, 0, .05); y.t = CN.saat;
  // kritik altı sönümlü yay: kök tarafı sıkı, uç gevşek (uç biraz geç gelir ve hafifçe sallanır)
  const s1 = 260, s2 = 120, d1 = 2 * Math.sqrt(s1) * .62, d2 = 2 * Math.sqrt(s2) * .62;
  y.vkx += ((kx - y.kx) * s1 - y.vkx * d1) * dt; y.kx += y.vkx * dt;
  y.vky += ((ky - y.ky) * s1 - y.vky * d1) * dt; y.ky += y.vky * dt;
  y.vux += ((ux - y.ux) * s2 - y.vux * d2) * dt; y.ux += y.vux * dt;
  y.vuy += ((uy - y.uy) * s2 - y.vuy * d2) * dt; y.uy += y.vuy * dt;
  if (Math.abs(y.ux - ux) > 40 || Math.abs(y.uy - uy) > 40) { y.kx = kx; y.ky = ky; y.ux = ux; y.uy = uy; y.vkx = y.vky = y.vux = y.vuy = 0; }
  CN_KY.kx = y.kx; CN_KY.ky = y.ky; CN_KY.ux = y.ux; CN_KY.uy = y.uy;
  return CN_KY;
}
// Kedinin iskeleti (sağa bakış, yer y = 0) tek bir kalıcı nesneye yazılır (karede yeni nesne yok)
const CN_KI = { kx: 0, ky: 0, ox: 0, oy: 0, rot: 0, gx: 0, gy: 0, bx: 0, by: 0, brot: 0 };
function cnKediIskelet(k) {
  const ot = k.otur, yt = k.yat, hk = k.hareket;
  const kx = -10 + 1.5 * ot, ky = -14 + 6 * ot + 7 * yt, rot = -1.05 * ot;
  const co = Math.cos(rot), si = Math.sin(rot), bob = -Math.abs(Math.sin(k.faz)) * .9 * hk;
  CN_KI.kx = kx; CN_KI.ky = ky + bob; CN_KI.rot = rot + k.egim;
  CN_KI.gx = kx + 10 * co + 1 * si; CN_KI.gy = ky + 10 * si - 1 * co + bob;
  CN_KI.ox = kx + 19 * co + 1 * si; CN_KI.oy = ky + 19 * si - 1 * co + bob + 1.5 * yt;
  CN_KI.bx = CN_KI.ox + 6 - .5 * ot + 1 * yt; CN_KI.by = CN_KI.oy - 12 + .5 * ot + 3.2 * yt - k.ilgi * 1.2 * yt;
  // baş adımda gövdeye göre hafif ters sallanır; dururken nefesle çok az kıpırdar
  CN_KI.by += Math.sin(k.faz * 2 + .6) * .55 * hk + Math.sin(CN.saat * 1.3 + k.tohum) * .3 * (1 - hk);
  CN_KI.bx += (k.icme || 0) * 3.5; CN_KI.by += (k.icme || 0) * 8;
  CN_KI.brot = .1 * yt - .1 * k.mutlu + k.basEgim + (k.icme || 0) * .45;
  return CN_KI;
}
// Kedi çizimi. (x, y) patilerin bastığı yer; s ölçek; k kedi durumu (yon, yonS, otur, yat, hareket, faz, ilgi, mutlu, dik,
// kuyrukT, agiz, kapak, basTers, basEgim, egim, pati, popT, kivril)
function cnKediCiz(c, x, y, s, t, k) {
  const p = CN_KURK[k.kurk], sp = cnKediSpr(k.kurk);
  cnGolge(c, x, y + .5, 17 * s, .2);
  c.save(); c.translate(x, y);
  // dönüş: yonS -1..1 (sıfıra yakınken ince görünür, kısa sürer); uyanış "pop"u: küçük esneme
  const sx = (Math.abs(k.yonS) < .25 ? .25 * Math.sign(k.yonS || 1) : k.yonS);
  let pz = 1, pzx = 1;
  if (k.popT < .32) { const u = Math.sin(Math.PI * k.popT / .32); pz = 1 - .16 * u; pzx = 1 + .1 * u; }
  c.scale(s * sx * pzx, s * pz);
  if (k.kivril) {
    const nef = 1 + Math.sin(t * 1.9 + k.tohum) * .022;
    c.save(); c.scale(1 + (nef - 1) * .4, nef); cnKoy(c, sp.kivril); c.restore();
    // kuyruğun ucu ara sıra kıpırdar, kulak seğirir
    const kip = Math.max(0, Math.sin(t * .7 + k.tohum)) ** 8;
    if (kip > .05) { c.strokeStyle = p.ku; c.lineWidth = 5; c.beginPath(); c.moveTo(7.5, -1.6); c.quadraticCurveTo(10, -2.4 - kip * 2, 11.6, -3 - kip * 4); c.stroke(); }
    c.restore(); return;
  }
  const K = cnKediIskelet(k), hk = k.hareket, ot = k.otur, yt = k.yat;
  const adim = 5.5 * hk, kalk = 2.6 * hk, fz = k.faz;
  // kuyruk anahtar pozları: aşağı (ayakta) / patilere dolanmış (oturuş) / yerde uzanmış (yatış) → dik (mutlu)
  const sal = Math.sin(t * (1.6 + k.kuyrukT * 2.2) + k.tohum) * (2.2 + k.kuyrukT * 3);
  let bx = K.kx - 4, by = K.ky - 3 + 3 * ot;
  let kx2 = -24 + 12 * ot - 1 * yt, ky2 = -13 + 14 * ot + 9 * yt, ux = -27 + 35 * ot - 4 * yt, uy = -3 + 2 * ot + .5 * yt;
  ux += sal * (1 - ot * .5); uy -= Math.abs(sal) * .3 * (ot + yt);
  const dk = k.dik;
  kx2 = lerp(kx2, -19 + sal * .3, dk); ky2 = lerp(ky2, -36, dk); ux = lerp(ux, -13 + sal * .8, dk); uy = lerp(uy, -46, dk);
  { const Y = cnKuyrukYay(k, kx2, ky2, ux, uy); kx2 = Y.kx; ky2 = Y.ky; ux = Y.ux; uy = Y.uy; }
  const kuyrukOnde = ot > .5 && dk < .5;
  if (!kuyrukOnde) cnKuyruk(c, bx, by, kx2, ky2, ux, uy, 4.4, p.kuy, p.ku);
  // uzak bacaklar (gölgeli)
  const bacakY = Math.min(K.ky, K.oy);
  if (yt < .9) {
    const lw = 4.8;
    if (ot < .7) cnBacak(c, K.kx + 2, K.ky + 2, K.kx + 1.5 - cnAyak(fz, 0, adim), -cnKaldir(fz, 0, kalk), lw, p.gk, p.gk, 2.3, -1.2 * hk - cnKaldir(fz, 0, kalk) * .8);
    cnBacak(c, K.ox - 1.5, K.oy + 3, K.ox - 1.5 + cnAyak(fz, Math.PI, adim) * (1 - ot) + 1.2 * ot, -cnKaldir(fz, Math.PI, kalk) * (1 - ot) - 1.5 * yt, lw, p.gk, p.gk, 2.3, cnKaldir(fz, Math.PI, kalk) * .9);
  }
  // gövde
  const nef = Math.sin(t * 2.1 + k.tohum) * (1 - hk);   // nefes: gövde dururken çok hafif kabarıp iner
  c.save(); c.translate(K.gx, K.gy); c.rotate(K.rot); c.scale(1 + nef * .012, 1 + nef * .028); cnKoy(c, sp.govde); c.restore();
  // oturuşta / yatışta kalça (but) ve arka pati
  const bA = Math.max(ot, yt * .85);
  if (bA > .05) {
    c.globalAlpha = Math.min(1, bA * 1.4);
    cnElips(c, K.kx + 2.5, -7 + 1.5 * yt, 8.6, 6.8 - 1.5 * yt, -.2, p.g);
    c.fillStyle = p.gk; c.globalAlpha *= .35; c.beginPath(); c.ellipse(K.kx + 3, -3.6, 7.6, 3, 0, 0, Math.PI); c.fill();
    c.globalAlpha = Math.min(1, bA * 1.4);
    if (k.kurk !== 'beyaz') { c.strokeStyle = p.cz; c.globalAlpha *= .6; c.lineWidth = 1.6; c.beginPath(); c.arc(K.kx + 2.5, -7, 5, -2.4, -1.2); c.stroke(); }
    c.globalAlpha = Math.min(1, bA * 1.4);
    cnElips(c, K.kx + 9.5, -1.4, 3.6, 2.1, 0, p.pt);
    c.globalAlpha = 1;
  }
  if (kuyrukOnde) cnKuyruk(c, bx, by, kx2, ky2, ux, uy, 4.4, p.kuy, p.ku);
  // yakın bacaklar
  if (yt < .9) {
    const lw = 5;
    if (ot < .7) cnBacak(c, K.kx + 4, K.ky + 2, K.kx + 4 + cnAyak(fz, Math.PI, adim), -cnKaldir(fz, Math.PI, kalk), lw, p.g, p.pt, 2.5, -1.2 * hk - cnKaldir(fz, Math.PI, kalk) * .8);
    if (k.pati > .02) {   // pati kaldırma (yalama): ön pati ağza doğru
      const pu = smooth(k.pati), fx = lerp(K.ox + 2, K.bx + 3, pu), fy = lerp(0, K.by + 7, pu);
      cnBacak(c, K.ox + 1.5, K.oy + 3, fx, fy, lw, p.g, p.pt, 2.5);
    } else cnBacak(c, K.ox + 1.5, K.oy + 3, K.ox + 2 + cnAyak(fz, 0, adim) * (1 - ot) + 1.4 * ot + 3.5 * yt, -cnKaldir(fz, 0, kalk) * (1 - ot) - 1.2 * yt, lw, p.g, p.pt, 2.5, cnKaldir(fz, 0, kalk) * .9);
  } else {
    cnElips(c, K.ox + 6, -1.6, 3.6, 2.2, 0, p.pt);   // yatarken öne uzanmış patiler
    cnElips(c, K.ox + 2.5, -1.4, 3.4, 2.1, 0, p.pt);
  }
  // baş (gerekirse gövdeden bağımsız olarak Feza'ya döner)
  c.save(); c.translate(K.bx, K.by); c.rotate(K.brot); if (k.basTers) c.scale(-1, 1);
  c.scale(1.04, 1.04); cnKoy(c, sp.bas);
  const kapak = k.kapak;
  cnKediGoz(c, 5.4, -1.6, 1, p.gz, kapak, k.mutlu, k.bak);
  cnKediGoz(c, -2.4, -1.8, .84, p.gz, kapak, k.mutlu, k.bak);
  // ağız: kapalıyken ω, miyavlarken yuvarlak açık
  if (k.agiz > .05) {
    c.fillStyle = '#7a3e46'; c.beginPath(); c.ellipse(5.3, 5, 1.7 + k.agiz * .6, .6 + k.agiz * 2.3, 0, 0, CN_PI2); c.fill();
    c.fillStyle = '#f08ea0'; c.beginPath(); c.ellipse(5.3, 5.6 + k.agiz * 1.1, 1.2, .5 + k.agiz * .8, 0, 0, Math.PI); c.fill();
  } else {
    c.strokeStyle = '#7a5a54'; c.lineWidth = .55; c.beginPath();
    c.moveTo(5.5, 3.3); c.lineTo(5.5, 4); c.moveTo(3.9, 4.2); c.quadraticCurveTo(4.7, 5, 5.5, 4); c.quadraticCurveTo(6.3, 5, 7.1, 4.2); c.stroke();
  }
  if (k.mutlu > .3) { c.fillStyle = 'rgba(255,140,160,' + (.35 * k.mutlu) + ')'; c.beginPath(); c.ellipse(8.4, 2.6, 2.4, 1.3, 0, 0, CN_PI2); c.fill(); }
  if ((k.icme || 0) > .6) { const dl = Math.max(0, Math.sin(t * 11)); if (dl > .2) cnElips(c, 5.6, 6 + dl * 1.6, 1.3, .7 + dl * .8, 0, '#f08ea0'); }
  c.restore();
  c.restore();
  return bacakY;
}

// Kendi küçük ahşap bankım (ZN12_BANK'ta yakın bank yoksa): dökme ayaklar, üç tahta oturak, iki tahta arkalık. Yer y = 0.
const CN_BANK = { oturak: 20, w: 74 };
function cnBankSpr() {
  if (CN.spr.bank) return CN.spr.bank;
  const t = cnTuval(-40, -42, 80, 44), q = t.q;
  q.strokeStyle = '#4c5b53'; q.lineWidth = 3;
  for (const ax of [-29, 29]) {
    q.beginPath(); q.moveTo(ax - 4, 0); q.quadraticCurveTo(ax - 2, -10, ax, -20); q.lineTo(ax - 3, -38); q.stroke();
    q.beginPath(); q.moveTo(ax + 4, 0); q.quadraticCurveTo(ax + 2, -10, ax, -20); q.stroke();
  }
  const tahta = (y, h, renk) => {
    q.fillStyle = renk; q.beginPath(); q.roundRect ? q.roundRect(-37, y, 74, h, 1.4) : q.rect(-37, y, 74, h); q.fill();
    q.fillStyle = 'rgba(255,236,200,.35)'; q.fillRect(-36, y + .4, 72, h * .3);
  };
  tahta(-37.5, 5, '#b98150'); tahta(-30.5, 5, '#b07a4a');
  tahta(-22, 3.2, '#c48b57'); tahta(-19, 3.2, '#b98150');
  q.fillStyle = 'rgba(60,40,30,.25)'; q.fillRect(-36, -16, 72, 1.4);
  CN.spr.bank = t.c; return t.c;
}
function cnBankBul(x) {   // ONPLAN'ın paralaks-1 bankı varsa onu kullan
  if (typeof ZN12_BANK === 'undefined' || !Array.isArray(ZN12_BANK)) return null;
  let en = null, d = 4 * T;
  for (const b of ZN12_BANK) if (b && Number.isFinite(b.x) && Math.abs(b.x - x) < d) { d = Math.abs(b.x - x); en = b; }
  return en;
}

// ── kedi davranışı ──
const CN_KEDI_TAKIP_SN = 15;
function cnKediKur(o) {
  o.kurk = CN_KURK[o.kurk] ? o.kurk : 'tekir'; o.hal = o.hal || 'gunes';
  o.evX = o.x; o.tohum = (o.x * .013) % 6.28;
  o.evZ = o.hal === 'otur' ? CN_CIM + 2 : CN_CIM;
  o.bank = null; o.kendiBank = false;
  if (o.hal === 'bank') {
    const b = cnBankBul(o.x);
    if (b) { o.bank = b; o.evX = b.x + (b.w ? b.w * .12 : 6); o.evY = b.y; }
    else { o.kendiBank = true; o.bankX = o.x; o.evY = CN_CIM - CN_BANK.oturak * cnDerinlik(CN_CIM) + 1; }
  } else o.evY = o.evZ;
  o.kx = o.evX; o.ky = o.evY; o.zy = o.evZ; o.x = o.kx;
  o.yon = o.yon || -1; o.evYon = o.yon; o.yonS = o.yon; o.basTers = false;
  o.durum = 'dinlen'; o.t = 0; o.v = 0; o.faz = 0; o.hareket = 0; o.durT = 0;
  o.otur = o.hal === 'otur' ? 1 : 0; o.yat = o.hal === 'gunes' ? 1 : o.hal === 'su' ? .5 : 0; o.kivril = o.hal === 'bank';
  o.icme = o.hal === 'su' ? 1 : 0; o.suT = 0; o.suOlay = -99;
  o.ilgi = 0; o.mutlu = 0; o.dik = 0; o.kuyrukT = 0; o.agiz = 0; o.agizT = 0; o.kapak = 0; o.bak = 0; o.basEgim = 0; o.egim = 0;
  o.pati = 0; o.popT = 9; o.kalpT = -9; o.miyavT = -99; o.idleT = 3 + (o.tohum % 4); o.idle = null; o.idleU = 0;
  o.hopU = -1; o.hopY0 = 0; o.hopY1 = 0; o.sevSide = 1; o.takipSay = 0; o.takipYon = 1; o.on = false;
  cnKayit(o);
}
function cnMiyav(o, ad) { o.agizT = .55; o.miyavT = CN.saat; cnOlay(ad, o, o.kx, o.ky - 20); }
function cnKediDurum(o, d) { o.durum = d; o.t = 0; }
// yürüme: hedefe doğru yumuşak hız, adım fazı yol uzunluğuna bağlı (ayak kaymaz)
function cnYuru(o, hedef, vmax, dt, adimBoy) {
  const fark = hedef - o.kx;
  const ist = clamp(fark * 3.2, -vmax, vmax);
  o.v = cnYaklas(o.v, ist, dt * 5);
  if (Math.abs(fark) < 1.5 && Math.abs(o.v) < 6) o.v = 0;
  o.kx += o.v * dt; o.faz += Math.abs(o.v) * dt / adimBoy;
  if (Math.abs(o.v) > 9) o.yon = o.v > 0 ? 1 : -1;
  o.hareket = cnYaklas(o.hareket, clamp(Math.abs(o.v) / 40, 0, 1), dt * 8);
  return Math.abs(fark);
}
// düzlem değişimi: bank ↔ yer arası küçük bir sıçrayış (yay), aksi halde yumuşak kayış
function cnDuzlem(o, hedefZ, hedefY, dt) {
  if (o.hopU >= 0) {
    o.hopU += dt / .42;
    const u = Math.min(1, o.hopU);
    o.ky = lerp(o.hopY0, o.hopY1, u) - Math.sin(Math.PI * u) * 15;
    if (u >= 1) { o.hopU = -1; o.ky = o.hopY1; o.zy = hedefZ; }
    return;
  }
  if (Math.abs(hedefY - o.ky) > 6) { o.hopU = 0; o.hopY0 = o.ky; o.hopY1 = hedefY; return; }
  o.zy = cnYaklas(o.zy, hedefZ, dt * 4); o.ky = cnYaklas(o.ky, hedefY, dt * 4);
}
function cnKediGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const dx = P.x - o.kx, adx = Math.abs(dx), binis = cnFezaBinis();
  if (o.durum === 'dinlen' && adx > 1700) return;   // uzaktayken uyusun
  o.t += dt; o.popT += dt; o.agizT -= dt;
  o.agiz = cnYaklas(o.agiz, o.agizT > 0 ? 1 : 0, dt * 14);
  let hOtur = 0, hYat = 0, hDik = 0, hMutlu = 0, hIlgi = 0;
  const yerY = o.zy;   // bulunduğu düzlem
  switch (o.durum) {
    case 'dinlen': {
      // evinde dinlenir: Feza yakındaysa başını kaldırıp bakar, ara sıra miyavlar; değilse esner, patisini yalar, kuyruk sallar
      if (Math.abs(o.kx - o.evX) > 2) cnYuru(o, o.evX, 50, dt, 7.5); else { o.v = 0; o.hareket = cnYaklas(o.hareket, 0, dt * 8); }
      cnDuzlem(o, o.evZ, o.evY, dt);
      hOtur = o.hal === 'otur' ? 1 : 0; hYat = o.hal === 'gunes' ? 1 : o.hal === 'su' ? .5 : 0;
      if (o.hal === 'su') {
        // taş kabından su içer: 4 sn yalar, başını kaldırıp dudaklarını yalar; Feza yakındaysa başını kaldırıp ona bakar
        o.suT += dt;
        const ic = adx > 200 && (o.suT % 5.5) < 4;
        o.icme = cnYaklas(o.icme, ic ? 1 : 0, dt * 4);
        if (ic && adx < 420 && CN.saat - o.suOlay > 8) { o.suOlay = CN.saat; cnOlay('k12KediSu', o, o.kx + o.yon * 26, o.ky - 6); }
      }
      if (o.hal === 'bank' && !o.kivril && o.t > 1.2 && o.hopU < 0 && Math.abs(o.ky - o.evY) < 1) { o.kivril = true; o.popT = 0; }
      if (adx < 230) { hIlgi = 1; if (o.hal === 'bank' && o.kivril && adx < 90 && !binis && o.t > 2) { o.kivril = false; o.popT = 0; o.t = 0; } }
      if (adx < 140 && !o.kivril && CN.saat - o.miyavT > 13 && Math.random() < dt * .5) cnMiyav(o, 'k12KediMiyav');
      // kendi küçük işleri
      o.idleT -= dt;
      if (!o.idle && o.idleT <= 0 && !o.kivril && hIlgi < .5) { o.idle = Math.random() < .45 ? 'yala' : Math.random() < .5 ? 'esne' : 'kuyruk'; o.idleU = 0; }
      if (o.idle) {
        o.idleU += dt;
        const sure = o.idle === 'yala' ? 2.6 : o.idle === 'esne' ? 1.5 : 2.4;
        if (o.idleU >= sure || hIlgi > .5) { o.idle = null; o.idleT = 5 + Math.random() * 7; }
      }
      break;
    }
    case 'sev': {
      // 1) uyanır, 2) Feza'nın yanına gelir, 3) bacaklarına sürtünür (kuyruk dik, gözler mutlu)
      if (o.kivril) { o.kivril = false; o.popT = 0; }
      hDik = .6;
      if (o.t < .45) { hOtur = o.hal === 'otur' ? .6 : 0; break; }
      const hedef = P.x + o.sevSide * 20;
      if (o.t < 4 && !o.surt) {
        cnDuzlem(o, CN_YOL + 2, CN_YOL + 2, dt);
        const kalan = cnYuru(o, hedef, binis ? 0 : 90, dt, 7.5);
        if (kalan < 6 && o.hopU < 0) { o.surt = true; o.surtT = 0; o.kalpT = CN.saat; }
        if (binis || adx > 340) { o.surt = false; cnKediDurum(o, 'don'); }
        break;
      }
      if (!o.surt) { cnKediDurum(o, 'don'); break; }
      o.surtT += dt; hDik = 1; hMutlu = 1;
      // iki geçiş: Feza'nın bacaklarının önünden yavaşça bir o yana bir bu yana
      const gec = Math.sin(o.surtT * 1.6) * 16;
      cnYuru(o, P.x + o.sevSide * 6 + gec, 46, dt, 7.5);
      cnDuzlem(o, CN_YOL + 2, CN_YOL + 2, dt);
      o.egim = cnYaklas(o.egim, -.06, dt * 4);
      if (o.surtT > 3 || binis) {
        o.surt = false; o.egim = 0;
        if (!binis && !CN.takipci && o.takipSay < 2) {
          CN.takipci = o; o.takipSay++; o.takipYon = P.f || 1; cnKediDurum(o, 'takip'); cnOlay('k12KediTakip', o, o.kx, o.ky - 20);
        } else cnKediDurum(o, 'don');
      }
      break;
    }
    case 'takip': {
      // Feza'nın yürüdüğü yönde biraz önde koşturur, dönüp ona bakar; Feza durunca yanına oturur
      if (Math.abs(P.vx) > 30) o.takipYon = P.vx > 0 ? 1 : -1;
      const hedef = P.x + o.takipYon * 54;
      cnDuzlem(o, CN_YOL - 7, CN_YOL - 7, dt);
      const kalan = cnYuru(o, hedef, 290, dt, Math.abs(o.v) > 150 ? 11 : 7.5);
      if (kalan < 10 && Math.abs(o.v) < 12) { o.durT += dt; } else o.durT = 0;
      if (o.durT > .5) { hOtur = 1; o.yon = dx > 0 ? 1 : -1; }
      hDik = Math.abs(o.v) > 20 ? .8 : .3; hIlgi = 1;
      if (o.t > CN_KEDI_TAKIP_SN || binis || Math.abs(o.kx - o.evX) > 1500 || adx > 420) { CN.takipci = null; cnKediDurum(o, 'don'); }
      break;
    }
    case 'don': {
      // evine yürür (görünmüyorsa çabuk), varınca yerleşir
      if (CN.takipci === o) CN.takipci = null;
      const gor = cnGorunur(o.kx, 60);
      const kalan = cnYuru(o, o.evX, gor ? 95 : 420, dt, 7.5);
      if (kalan < 40) cnDuzlem(o, o.evZ, o.evY, dt); else cnDuzlem(o, CN_CIM + 4, CN_CIM + 4, dt);
      if (kalan < 3 && o.hopU < 0 && Math.abs(o.ky - o.evY) < 1.5) { o.yon = o.evYon; cnKediDurum(o, 'dinlen'); }
      hDik = .25;
      break;
    }
  }
  // poz yumuşatma
  const hiz = dt * 5;
  o.otur = cnYaklas(o.otur, o.hareket > .3 ? 0 : hOtur, hiz);
  o.yat = cnYaklas(o.yat, o.hareket > .3 ? 0 : hYat, hiz * .8);
  o.dik = cnYaklas(o.dik, hDik, hiz);
  o.mutlu = cnYaklas(o.mutlu, Math.max(hMutlu, o.idle === 'esne' ? 1 : 0), dt * 6);
  o.ilgi = cnYaklas(o.ilgi, hIlgi, dt * 3);
  o.kuyrukT = cnYaklas(o.kuyrukT, o.idle === 'kuyruk' ? 1 : hIlgi * .5, dt * 2);
  o.pati = cnYaklas(o.pati, o.idle === 'yala' && o.idleU > .3 && o.idleU < 2.2 ? 1 : 0, dt * 6);
  o.basEgim = cnYaklas(o.basEgim, o.idle === 'yala' ? .3 : o.idle === 'esne' ? -.25 : 0, dt * 5);
  if (o.idle === 'esne') o.agizT = Math.max(o.agizT, o.idleU > .2 && o.idleU < 1.2 ? .05 : 0);
  if (o.idle !== 'yala' && o.idle !== 'esne' && o.durum !== 'sev') o.egim = cnYaklas(o.egim, 0, hiz);
  // göz: güneşlenirken uykulu, ilgilenince açık; kırpma
  const uykulu = o.durum === 'dinlen' && o.hal === 'gunes' ? (1 - o.ilgi) : 0;
  o.kapak = Math.max(cnKirp(CN.saat, o.tohum), uykulu > .5 ? .9 : uykulu * .5, o.idle === 'esne' ? .95 : 0);
  // baş Feza'ya döner (gövde başka yöne bakıyorsa baş tek başına çevrilir)
  const fYon = dx > 0 ? 1 : -1;
  o.basTers = o.ilgi > .5 && fYon !== o.yon && o.hareket < .5;
  const basYon = o.basTers ? -o.yon : o.yon;   // başın baktığı yön; göz bebeği Feza'ya kayar
  o.bak = o.ilgi > .5 ? (basYon === fYon ? 1 : -1) * Math.min(1, adx / 60) * .8 : 0;
  if (o.durum !== 'dinlen') o.icme = cnYaklas(o.icme, 0, dt * 6);
  if (o.icme > .5) o.kapak = Math.max(o.kapak, .55);
  o.yonS = cnYaklas(o.yonS, o.yon, dt * 16);
  o.x = o.kx; o.on = o.zy > CN_YOL - 1;
}
// Bahçedeki küçük taş su kabı: içerken su yüzünde halkalar
function cnSuKabi(c, x, y, s, t, icme) {
  c.save(); c.translate(x, y); c.scale(s, s);
  cnGolge(c, 0, .4, 11, .18);
  cnElips(c, 0, -3, 9.5, 3.6, 0, '#a7aeb2');
  c.fillStyle = '#c3c9cc'; c.beginPath(); c.ellipse(0, -4.4, 9.5, 2.8, 0, Math.PI, CN_PI2); c.fill();
  cnElips(c, 0, -4.6, 7.6, 1.9, 0, '#8fcbe8');
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-3, -5, 2.4, .5, 0, 0, CN_PI2); c.fill();
  if (icme > .5) {
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = .5;
    for (let i = 0; i < 2; i++) { const u = (t * 1.4 + i * .5) % 1; c.globalAlpha = 1 - u; c.beginPath(); c.ellipse(-2, -4.6, 1 + u * 5, .3 + u * 1.2, 0, 0, CN_PI2); c.stroke(); }
    c.globalAlpha = 1;
  }
  c.restore();
}
function cnKediCizO(o, t, on) {
  if (o.on !== on) return;
  if (!cnGorunur(o.kx, 80) && !(o.kendiBank && cnGorunur(o.bankX, 80))) return;
  const s = 1.22 * cnDerinlik(o.zy);
  if (o.kendiBank && !on) { const bs = cnDerinlik(CN_CIM); g.save(); g.translate(o.bankX, CN_CIM); g.scale(bs, bs); cnGolge(g, 0, .5, 40, .16); cnKoy(g, cnBankSpr()); g.restore(); }
  if (o.hal === 'su' && !on) cnSuKabi(g, o.evX + o.evYon * 25 * s, o.evY, s, t, o.icme * (o.durum === 'dinlen' ? 1 : 0));
  if (!cnGorunur(o.kx, 60)) return;
  cnKediCiz(g, o.kx, o.ky, s, t, o);
  cnKalpler(g, o.kx, o.ky - 40 * s, CN.saat - o.kalpT, s);
  cnIsabet(o, o.kx, o.ky - 17 * s, 38, 32);
}
function cnKediDokun(o) {
  cnMiyav(o, 'k12KediSev'); o.kalpT = CN.saat;
  if (o.durum === 'sev' || o.durum === 'takip') { o.mutlu = 1; return; }
  if (cnFezaBinis()) { o.ilgi = 1; return; }
  o.sevSide = o.kx > P.x ? 1 : -1; o.surt = false;
  if (o.kivril) { o.kivril = false; o.popT = 0; }
  cnKediDurum(o, 'sev');
}
TUR.kaydet('k12Kedi', {
  kur: cnKediKur, guncelle: cnKediGuncelle,
  ciz(o, t) { cnKediCizO(o, t, false); }, cizOn(o, t) { cnKediCizO(o, t, true); }
});
// ════════════════════ kampüs köpeği ════════════════════
// İri, pofuduk, bal-krem tüylü, sarkık kulaklı; yakın kulağında sarı belediye küpesi. Yer y = 0, sağa bakış.
const CN_KOPEK = { g: '#ead1a7', gk: '#c9a472', sr: '#d7b07c', kr: '#f9eedc', ku: '#bb8c59', bu: '#3e2c27', kp: '#f5cf35', gz: '#4a2e22' };
function cnKopekSpr() {
  if (CN.spr.kopek) return CN.spr.kopek;
  const p = CN_KOPEK;
  // gövde: fıçı gibi yumuşak, sırtta biraz koyu "eyer", göğüste krem yele, sırt boyunca kabarık tutamlar
  const tg = cnTuval(-31, -21, 64, 40), q = tg.q;
  q.fillStyle = p.g; q.beginPath(); q.ellipse(0, 0, 27, 16.5, 0, 0, CN_PI2); q.fill();
  q.save(); q.beginPath(); q.ellipse(0, 0, 27, 16.5, 0, 0, CN_PI2); q.clip();
  const gr = q.createLinearGradient(0, -17, 0, 16.5);
  gr.addColorStop(0, 'rgba(255,250,236,.22)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, p.gk);
  q.fillStyle = gr; q.fillRect(-28, -18, 56, 36);
  // sırtta tüy dokusu: birkaç yumuşak, açık renk fırça izi
  q.strokeStyle = 'rgba(255,246,228,.5)'; q.lineWidth = 1.4;
  for (let i = 0; i < 4; i++) { q.beginPath(); q.arc(-14 + i * 9, -6, 6, -2.4, -1.2); q.stroke(); }
  cnElips(q, 4, 12, 18, 5, 0, p.kr);
  q.restore();
  cnElips(q, 20.5, 4, 10, 10, .2, p.kr);   // göğüs yelesi
  // baş: yuvarlak kafa, kısa krem burun, kara burun ucu, sarkık kulaklar, kaş noktaları, kulak küpesi
  const tb = cnTuval(-21, -19, 46, 40), b = tb.q;
  const kulak = (x0, y0, x1, y1, w, ad) => {
    b.fillStyle = p.ku; b.beginPath(); b.moveTo(x0 - w * .5, y0);
    b.quadraticCurveTo(x1 - w * .9, y1 - 2, x1 - w * .2, y1 + 1.5); b.quadraticCurveTo(x1 + w * .6, y1 + 1, x0 + w * .55, y0 + 1); b.closePath(); b.fill();
    if (ad) { b.fillStyle = 'rgba(255,240,210,.22)'; b.beginPath(); b.ellipse(x0 - w * .1, y0 + 4, w * .25, 3.5, .2, 0, CN_PI2); b.fill(); }
  };
  kulak(-9, -8, -15, 7, 8, false);
  b.fillStyle = p.g; b.beginPath(); b.ellipse(0, 0, 13.6, 12, 0, 0, CN_PI2); b.fill();
  cnElips(b, -9.5, 5.5, 6, 5.2, .3, p.g);
  b.save(); b.beginPath(); b.ellipse(0, 0, 13.6, 12, 0, 0, CN_PI2); b.clip();
  const gb = b.createLinearGradient(0, -12, 0, 12);
  gb.addColorStop(0, 'rgba(255,250,236,.34)'); gb.addColorStop(.55, 'rgba(255,255,255,0)'); gb.addColorStop(1, p.gk);
  b.fillStyle = gb; b.fillRect(-14, -12, 28, 24);
  b.globalAlpha = .5; cnElips(b, -2, -8, 9, 4, 0, p.sr); b.globalAlpha = 1;
  b.restore();
  cnElips(b, 10.8, 4.8, 9.2, 6.6, -.05, p.kr);
  cnElips(b, 8, 9.2, 6, 3.2, 0, p.kr);
  b.fillStyle = p.bu; b.beginPath(); b.ellipse(18.4, 1.8, 3.5, 2.6, 0, 0, CN_PI2); b.fill();
  b.fillStyle = 'rgba(255,255,255,.55)'; b.beginPath(); b.ellipse(17.6, .9, 1.3, .7, -.3, 0, CN_PI2); b.fill();
  b.strokeStyle = p.bu; b.lineWidth = .9; b.beginPath(); b.moveTo(18.2, 4.3); b.lineTo(18, 6.4); b.stroke();
  cnElips(b, 7.4, -7.6, 1.9, 1.2, -.2, '#f8ecd6'); cnElips(b, 1.2, -8, 1.6, 1.1, .2, '#f8ecd6');
  kulak(-4.5, -10.5, -7.5, 9, 9, true);
  b.save(); b.translate(-7.4, 7); b.rotate(.25);   // sarı küpe
  b.fillStyle = p.kp; b.beginPath(); if (b.roundRect) b.roundRect(-2.6, -1.6, 5.2, 4.2, 1.2); else b.rect(-2.6, -1.6, 5.2, 4.2); b.fill();
  b.fillStyle = 'rgba(255,255,255,.5)'; b.fillRect(-1.8, -1, 2.2, .9);
  b.restore();
  CN.spr.kopek = { govde: tg.c, bas: tb.c };
  return CN.spr.kopek;
}
function cnKopekGoz(c, gx, gy, rk, kapak, mutlu) {
  c.lineCap = 'round';
  if (mutlu > .55 || kapak > .82) {
    c.strokeStyle = '#3a2420'; c.lineWidth = 1.3; c.beginPath();
    if (mutlu > .55 && kapak <= .82) { c.moveTo(gx - 2.6 * rk, gy + 1); c.quadraticCurveTo(gx, gy - 2.4, gx + 2.6 * rk, gy + 1); }
    else { c.moveTo(gx - 2.6 * rk, gy); c.quadraticCurveTo(gx, gy + 2.2, gx + 2.6 * rk, gy); }
    c.stroke(); return;
  }
  const ry = 3.2 * (1 - kapak), rx = 2.7 * rk;
  c.fillStyle = CN_KOPEK.gz; c.beginPath(); c.ellipse(gx, gy, rx, ry, 0, 0, CN_PI2); c.fill();
  if (ry > 1.2) {
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(gx - .8 * rk, gy - ry * .4, 1.05, 0, CN_PI2); c.fill();
    c.beginPath(); c.arc(gx + .9 * rk, gy + ry * .35, .5, 0, CN_PI2); c.fill();
  }
}
const CN_KO = { kx: 0, ky: 0, ox: 0, oy: 0, gx: 0, gy: 0, bx: 0, by: 0, rot: 0 };
function cnKopekCiz(c, x, y, s, t, k) {
  const p = CN_KOPEK, sp = cnKopekSpr(), ot = k.otur, yt = k.yat, hk = k.hareket, fz = k.faz;
  cnGolge(c, x + 2 * s * k.yonS, y + .5, 30 * s, .2);
  c.save(); c.translate(x, y);
  const sx = Math.abs(k.yonS) < .25 ? .25 * Math.sign(k.yonS || 1) : k.yonS;
  c.scale(s * sx, s);
  const kx = -17 + 3 * ot, ky = -29 + 11 * ot + 14 * yt, rot = -.72 * ot, co = Math.cos(rot), si = Math.sin(rot);
  const bob = -Math.abs(Math.sin(fz)) * 1.2 * hk + Math.sin(t * 2.2) * .4 * (1 - hk);
  const K = CN_KO;
  K.kx = kx; K.ky = ky + bob; K.rot = rot;
  K.gx = kx + 17 * co + 1 * si; K.gy = ky + 17 * si - 1 * co + bob;
  K.ox = kx + 32 * co + 1 * si; K.oy = ky + 32 * si - 1 * co + bob + 2 * yt;
  K.bx = K.ox + 11 - 2 * ot + Math.sin(fz * 2 + .5) * .5 * hk; K.by = K.oy - 16 + 2 * ot + 3 * yt - (1 - k.ilgi) * 3 * yt;
  const adim = 9 * hk, kalk = 4 * hk;
  // kuyruk: sevinçte sırtın üstünde kıvrık ve hızla sallanır, yatarken yere pıt pıt vurur
  const hz = 3 + k.kuyrukT * 11, sal = Math.sin(t * hz + 1) * (2 + k.kuyrukT * 7);
  const bx = kx - 6, by = ky - 4 + 6 * ot;
  let kx2 = -36 + 2 * ot + 6 * yt, ky2 = -26 + 24 * ot + 22 * yt, ux = -38 - 6 * ot + 4 * yt, uy = -10 + 7 * ot + 4 * yt;
  ux += sal * (1 - yt * .6); uy -= yt * Math.max(0, sal) * .6;
  const dk = Math.max(k.dik, .45) * (1 - ot * .6) * (1 - yt);   // kampüs köpeklerinin kuyruğu hep biraz kıvrık
  kx2 = lerp(kx2, -40 + sal * .3, dk); ky2 = lerp(ky2, -62, dk); ux = lerp(ux, -27 + sal, dk); uy = lerp(uy, -64 + Math.abs(sal) * .3, dk);
  { const Y = cnKuyrukYay(k, kx2, ky2, ux, uy); kx2 = Y.kx; ky2 = Y.ky; ux = Y.ux; uy = Y.uy; }
  c.lineCap = 'round';
  c.strokeStyle = p.g; c.lineWidth = 9; c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo(kx2, ky2, ux, uy); c.stroke();
  c.strokeStyle = p.kr; c.lineWidth = 6; c.beginPath(); c.moveTo(lerp(kx2, ux, .55), lerp(ky2, uy, .55)); c.lineTo(ux, uy); c.stroke();
  // uzak bacaklar
  const lw = 10.5;
  if (yt < .5) {
    if (ot < .6) cnBacak(c, kx + 3, K.ky + 4, kx + 3 - cnAyak(fz, 0, adim), -cnKaldir(fz, 0, kalk), lw, p.gk, p.gk, 4.8, -2 * hk - cnKaldir(fz, 0, kalk) * 1.2);
    cnBacak(c, K.ox - 3, K.oy + 4, K.ox - 3 + cnAyak(fz, Math.PI, adim) * (1 - ot) + 2 * ot, -cnKaldir(fz, Math.PI, kalk) * (1 - ot), lw, p.gk, p.gk, 4.8);
  } else cnBacak(c, K.ox, K.oy + 6, K.ox + 13, -3.2, lw, p.gk, p.gk, 4.8);
  const nef = Math.sin(t * (2 + k.agiz * 5) + k.tohum) * (1 - hk);   // nefes (soluk soluğa sevinçte hızlanır)
  c.save(); c.translate(K.gx, K.gy); c.rotate(rot); c.scale(1 + nef * .012, 1 + nef * .03); cnKoy(c, sp.govde); c.restore();
  const bA = Math.max(ot, yt);
  if (bA > .05) {   // oturuş / yatış: kalça ve arka pati
    c.globalAlpha = Math.min(1, bA * 1.5);
    cnElips(c, kx + 4, -11 + 2 * yt, 13, 11 - 2.5 * yt, -.2, p.g);
    c.globalAlpha *= .3; c.fillStyle = p.gk; c.beginPath(); c.ellipse(kx + 5, -5, 11, 4, 0, 0, Math.PI); c.fill();
    c.globalAlpha = Math.min(1, bA * 1.5);
    cnElips(c, kx + 16, -2.6, 5.4, 3, 0, p.kr);
    c.globalAlpha = 1;
  }
  // yakın bacaklar (pati verirken yakın ön bacak öne kalkar)
  if (yt < .5) {
    if (ot < .6) cnBacak(c, kx + 7, K.ky + 4, kx + 7 + cnAyak(fz, Math.PI, adim), -cnKaldir(fz, Math.PI, kalk), lw + .4, p.g, p.kr, 5, -2 * hk - cnKaldir(fz, Math.PI, kalk) * 1.2);
    if (k.pati > .02) {
      const pu = smooth(k.pati), sw = Math.sin(t * 6) * 1.2 * pu;
      cnBacak(c, K.ox + 1, K.oy + 5, lerp(K.ox + 3, K.ox + 19, pu), lerp(0, K.oy + 9, pu) + sw, lw + .4, p.g, p.kr, 5);
    } else cnBacak(c, K.ox + 1, K.oy + 5, K.ox + 2 + cnAyak(fz, 0, adim) * (1 - ot) + 2 * ot, -cnKaldir(fz, 0, kalk) * (1 - ot), lw + .4, p.g, p.kr, 5);
  } else cnBacak(c, K.ox + 3, K.oy + 6, K.ox + 17, -3, lw + .4, p.g, p.kr, 5);
  // baş
  c.save(); c.translate(K.bx, K.by); c.rotate(k.basEgim + .05 * yt); if (k.basTers) c.scale(-1, 1);
  cnKoy(c, sp.bas);
  cnKopekGoz(c, 8.2, -2.6, 1, k.kapak, k.mutlu);
  cnKopekGoz(c, 1.4, -3, .84, k.kapak, k.mutlu);
  // ağız: gülümseme, sevinçte açık ağız ve pembe dil
  if (k.agiz > .05) {
    c.fillStyle = '#7a3e3e'; c.beginPath(); c.ellipse(13, 9, 4.6, 1 + k.agiz * 2.6, 0, 0, Math.PI); c.fill();
    c.fillStyle = '#f28fa2'; c.beginPath(); c.ellipse(13.4, 10 + k.agiz * 2.6, 2.6, 2.2 + k.agiz * 2.2, 0, 0, CN_PI2); c.fill();
    c.strokeStyle = 'rgba(200,90,110,.6)'; c.lineWidth = .6; c.beginPath(); c.moveTo(13.4, 10); c.lineTo(13.4, 12 + k.agiz * 3); c.stroke();
  } else {
    c.strokeStyle = '#6b4a3e'; c.lineWidth = .9; c.beginPath(); c.moveTo(10, 8.4); c.quadraticCurveTo(14, 10.6, 18, 7.6); c.stroke();
  }
  if (k.mutlu > .3) { c.fillStyle = 'rgba(255,140,160,' + (.3 * k.mutlu) + ')'; c.beginPath(); c.ellipse(9.5, 3.8, 3, 1.5, 0, 0, CN_PI2); c.fill(); }
  c.restore();
  c.restore();
}
function cnKopekKur(o) {
  o.evX = o.x; o.evZ = CN_CIM; o.kx = o.x; o.zy = CN_CIM; o.tohum = (o.x * .017) % 6.28;
  o.yon = o.yon || 1; o.evYon = o.yon; o.yonS = o.yon; o.basTers = false;
  o.durum = 'dinlen'; o.t = 0; o.v = 0; o.faz = 0; o.hareket = 0; o.durT = 0;
  o.otur = 0; o.yat = 1; o.ilgi = 0; o.mutlu = 0; o.dik = 0; o.kuyrukT = 0; o.agiz = 0; o.agizT = 0; o.kapak = 0; o.basEgim = 0; o.pati = 0;
  o.kalpT = -9; o.havT = -99;
  cnKayit(o);
}
function cnKopekGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const dx = P.x - o.kx, adx = Math.abs(dx), binis = cnFezaBinis();
  if (o.durum === 'dinlen' && adx > 1700) return;
  o.t += dt; o.agizT -= dt;
  let hOtur = 0, hYat = 0, hIlgi = 0, hMutlu = 0, hKuyruk = 0, hDik = 0, hPati = 0;
  switch (o.durum) {
    case 'dinlen':
      hYat = 1;
      if (Math.abs(o.kx - o.evX) > 2) cnYuru(o, o.evX, 60, dt, 13); else { o.v = 0; o.hareket = cnYaklas(o.hareket, 0, dt * 8); }
      if (adx < 320) { hIlgi = 1; hKuyruk = .6; }
      if (!o.uykucu && !binis && adx < 250 && o.t > 1.5) {
        o.durum = 'kalk'; o.t = 0;
        if (CN.saat - o.havT > 25) { o.havT = CN.saat; o.agizT = .35; cnOlay('k12KopekHav', o, o.kx, o.zy - 50); }
      }
      break;
    case 'kalk': {
      // kalkar, kuyruk sallar, Feza'nın yanına (kendi tarafında) gelip oturur; evinden pek uzaklaşmaz
      hIlgi = 1; hKuyruk = 1; hDik = 1; hMutlu = .3;
      // Feza'nın önündeyse yanına gelir; Feza onu geçip gittiyse (annenin yanına karışmasın) yerinde oturup arkasından bakar
      const yan = o.kx > P.x ? 1 : -1, onde = yan === (P.f || 1);
      const hedef = onde ? clamp(P.x + yan * 62, o.evX - 120, o.evX + 120) : o.kx;
      const kalan = cnYuru(o, hedef, 110, dt, 13);
      if (kalan < 8 && Math.abs(o.v) < 10) o.durT += dt; else o.durT = 0;
      if (o.durT > .6) { hOtur = 1; o.yon = dx > 0 ? 1 : -1; }
      o.zy = cnYaklas(o.zy, CN_YOL - 9, dt * 2);
      if (adx > 380 || binis) { o.durum = 'don'; o.t = 0; }
      break;
    }
    case 'pati':
      // oturur, patisini uzatır, dili dışarıda kuyruk sallar
      hOtur = 1; hIlgi = 1; hKuyruk = 1; hMutlu = o.t > .3 && o.t < 2.4 ? 1 : .4; hPati = o.t > .35 && o.t < 2.2 ? 1 : 0;
      o.v = 0; o.hareket = cnYaklas(o.hareket, 0, dt * 8); o.yon = dx > 0 ? 1 : -1;
      if (o.t > 2.7) { o.durum = o.uykucu ? 'dinlen' : 'kalk'; o.t = 0; o.durT = 0; }
      break;
    case 'don': {
      hKuyruk = .3;
      const kalan = cnYuru(o, o.evX, cnGorunur(o.kx, 60) ? 80 : 400, dt, 13);
      o.zy = cnYaklas(o.zy, o.evZ, dt * 2);
      if (kalan < 3) { o.yon = o.evYon; o.durum = 'dinlen'; o.t = 0; }
      if (!binis && adx < 200 && !o.uykucu && o.t > 2) { o.durum = 'kalk'; o.t = 0; }
      break;
    }
  }
  const hiz = dt * 4;
  o.otur = cnYaklas(o.otur, o.hareket > .3 ? 0 : hOtur, hiz);
  o.yat = cnYaklas(o.yat, o.hareket > .3 ? 0 : hYat, hiz * .8);
  o.ilgi = cnYaklas(o.ilgi, hIlgi, dt * 3); o.mutlu = cnYaklas(o.mutlu, hMutlu, dt * 5);
  o.kuyrukT = cnYaklas(o.kuyrukT, hKuyruk, dt * 3); o.dik = cnYaklas(o.dik, hDik, dt * 3);
  o.pati = cnYaklas(o.pati, hPati, dt * 6);
  // sevinçte ağzı açık, dili dışarıda (hızlı soluk)
  const dilAcik = o.ilgi > .6 && (o.durum !== 'dinlen' || o.mutlu > .2);
  o.agiz = cnYaklas(o.agiz, o.agizT > 0 ? 1 : dilAcik ? .55 + Math.sin(CN.saat * 9) * .12 : 0, dt * 10);
  const uyku = o.durum === 'dinlen' && o.ilgi < .3 ? .9 : 0;
  o.kapak = Math.max(cnKirp(CN.saat, o.tohum), uyku);
  const fYon = dx > 0 ? 1 : -1;
  o.basTers = o.ilgi > .5 && fYon !== o.yon && o.hareket < .5;
  o.basEgim = cnYaklas(o.basEgim, o.durum === 'dinlen' && o.ilgi < .3 ? .12 : -.05 * o.ilgi, dt * 3);
  o.yonS = cnYaklas(o.yonS, o.yon, dt * 12);
  o.x = o.kx; o.on = false;
}
function cnKopekCizO(o, t) {
  if (!cnGorunur(o.kx, 90)) return;
  const s = 1.05 * cnDerinlik(o.zy);
  cnKopekCiz(g, o.kx, o.zy, s, t, o);
  cnKalpler(g, o.kx + 20 * s * o.yon, o.zy - 66 * s, CN.saat - o.kalpT, s);
  cnIsabet(o, o.kx + 6 * o.yon * s, o.zy - 32 * s, 52, 38);
}
function cnKopekDokun(o) {
  o.kalpT = CN.saat; o.agizT = .3;
  cnOlay('k12KopekSev', o, o.kx, o.zy - 40);
  if (cnFezaBinis()) { o.ilgi = 1; o.kuyrukT = 1; return; }
  o.durum = 'pati'; o.t = 0;
}
TUR.kaydet('k12Kopek', { kur: cnKopekKur, guncelle: cnKopekGuncelle, ciz: cnKopekCizO });

// ════════════════════ serçeler ════════════════════
// Sürü (o.n kuş): yerde gagalar, hoplar. Feza yaklaşınca birer birer havalanır, Feza'dan uzak tarafta (bölge içinde) yeniden konar.
// o.kacmaz: kaçmaz (binişte yolun kenarında): yalnız başlarını çevirir, Feza çok yaklaşınca yerinde pırpır hoplar.
const CN_SERCE = { g: '#b0835a', gk: '#8a603e', kr: '#f2e6d2', bs: '#8d5a37', yn: '#f8f1e4', ga: '#e7ad55' };
// İspinoz: mavi-gri başlık, şeftali göğüs, kanatta iki beyaz çizgi (botanik bahçesinde)
const CN_ISPINOZ = { g: '#a47a5c', gk: '#7d5a44', kr: '#f2c3a6', bs: '#7f93ab', yn: '#e9a383', ga: '#c9b8a0', cb: '#ffffff' };
function cnSerceCiz(c, x, y, s, yon, gaga, kanat, ucuyor, cik, pal) {
  const p = pal || CN_SERCE;
  c.save(); c.translate(x, y); c.scale(s * yon, s);
  if (!ucuyor) cnGolge(c, 0, .3, 6.5, .16);
  // kuyruk
  c.fillStyle = p.gk; c.beginPath(); c.moveTo(-4.5, -4.5); c.lineTo(-10.5, -6.6 + (ucuyor ? 2 : 0)); c.lineTo(-10, -3.8); c.closePath(); c.fill();
  if (ucuyor) {   // uzak kanat
    c.fillStyle = p.gk; c.beginPath(); c.ellipse(-1, -7, 6.2, 2.6, -1.1 * kanat - .2, 0, CN_PI2); c.fill();
  }
  cnElips(c, 0, -5, 5.6, 4.3, -.1, p.g);
  cnElips(c, 1, -3.4, 4.2, 2.6, -.05, p.kr);
  if (!ucuyor) { c.strokeStyle = '#c98d5c'; c.lineWidth = .9; c.beginPath(); c.moveTo(-.4, -1); c.lineTo(-1, .2); c.moveTo(1.6, -1); c.lineTo(1.8, .2); c.stroke(); }
  // yakın kanat
  if (ucuyor) { c.fillStyle = p.g; c.beginPath(); c.ellipse(-.5, -7.6, 6.8, 2.8, -1.3 * kanat - .1, 0, CN_PI2); c.fill(); }
  else {
    cnElips(c, -1.5, -5.6, 4.4, 2.6, -.2, p.gk);
    c.strokeStyle = p.cb || p.kr; c.lineWidth = p.cb ? .9 : .6; c.beginPath(); c.moveTo(-4, -5.6); c.lineTo(.6, -5);
    if (p.cb) { c.moveTo(-3.6, -4.2); c.lineTo(0, -3.8); }
    c.stroke();
  }
  // baş (gagalarken öne eğilir)
  c.save(); c.translate(3.6, -8); c.rotate(gaga * .9);
  cnElips(c, 0, 0, 3.4, 3.2, 0, p.g);
  c.fillStyle = p.bs; c.beginPath(); c.ellipse(-.4, -1.3, 3, 2, -.2, Math.PI, CN_PI2); c.fill();
  cnElips(c, 1.4, .8, 1.6, 1.2, 0, p.yn);
  c.fillStyle = p.ga; c.beginPath(); c.moveTo(2.8, -.6); c.lineTo(5.4, .2); c.lineTo(2.8, 1); c.closePath(); c.fill();
  c.fillStyle = '#2b1d18'; c.beginPath(); c.arc(1.5, -.5, .85, 0, CN_PI2); c.fill();
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(1.2, -.8, .3, 0, CN_PI2); c.fill();
  c.restore();
  if (cik > 0) {   // cik cik: başın önünde üç minik çizgi
    c.strokeStyle = 'rgba(255,255,255,' + (.85 * cik) + ')'; c.lineWidth = .8;
    c.beginPath(); c.moveTo(9.5, -11); c.lineTo(11.5, -12.5); c.moveTo(10, -8.6); c.lineTo(12.6, -8.8); c.moveTo(9.4, -6.2); c.lineTo(11.4, -5); c.stroke();
  }
  c.restore();
}
function cnKusKur(o) {
  const n = o.n || 4, r = rng(Math.floor(o.x) + 7);
  o.zy = o.zy || CN_CIM + 6; o.evX = o.x; o.mx = o.x; o.kuslar = [];
  o.x0 = o.x0 || o.x - 300; o.x1 = o.x1 || o.x + 300;
  for (let i = 0; i < n; i++) o.kuslar.push({ ox: (i - (n - 1) / 2) * 17 + (r() - .5) * 8, x: 0, y: o.zy, vx: 0, yon: r() < .5 ? 1 : -1,
    uc: false, ucT: 0, hop: 0, pir: false, gaga: 0, gagaT: r() * 3, kanat: 0, faz: r() * 6, hx: 0, sx: 0, sy: 0, sure: 1, tep: 0 });
  for (const k of o.kuslar) { k.x = o.mx + k.ox; k.hx = k.x; }
  o.durum = 'yer'; o.t = 0; o.cikT = -9; o.pal = o.tur === 'ispinoz' ? CN_ISPINOZ : CN_SERCE; o.tur = o.tur || 'serce';
  cnKayit(o);
}
function cnKusHavalan(o, hedefX) {
  o.durum = 'uc'; o.t = 0; o.mx = hedefX;
  let i = 0;
  for (const k of o.kuslar) {
    k.uc = true; k.ucT = -i * .09 - Math.random() * .08; k.sx = k.x; k.sy = k.y; k.hx = hedefX + k.ox + (Math.random() - .5) * 10;
    k.sure = 1.3 + Math.random() * .5; k.tep = 70 + Math.random() * 50; i++;
  }
  cnOlay('k12KusHavalan', o, o.kuslar[0].x, o.zy - 20);
}
function cnKusGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const dx = P.x - o.mx, adx = Math.abs(dx);
  if (adx > 1700 && o.durum === 'yer') {   // uzaktayken eski yerine sessizce dön
    if (o.mx !== o.evX && !cnGorunur(o.mx, 200)) { o.mx = o.evX; for (const k of o.kuslar) { k.x = k.hx = o.mx + k.ox; } }
    return;
  }
  o.t += dt;
  if (o.durum === 'yer' && !o.kacmaz && adx < 150 && o.t > .8) {
    // Feza'dan uzak tarafa konar; o yanda yer yoksa Feza'nın üstünden öbür yana geçer
    const yan = dx > 0 ? -1 : 1, mesafe = 230 + Math.random() * 90;
    let hx = P.x + yan * mesafe;
    if (hx < o.x0 || hx > o.x1) hx = P.x - yan * mesafe;
    cnKusHavalan(o, clamp(hx, o.x0, o.x1));
  }
  let havada = 0;
  for (const k of o.kuslar) {
    k.faz += dt;
    if (k.uc) {
      k.ucT += dt; havada++;
      const u = clamp(k.ucT / k.sure, 0, 1), e = smooth(u);
      k.x = lerp(k.sx, k.hx, e); k.y = lerp(k.sy, o.zy, e) - Math.sin(Math.PI * u) * k.tep;
      k.yon = k.hx > k.sx ? 1 : -1; k.kanat = Math.sin(k.faz * 26) * (u < .85 ? 1 : .5);
      if (u >= 1) { k.uc = false; k.y = o.zy; k.kanat = 0; }
      continue;
    }
    // yerde: arada gagalar, hoplar, yön değiştirir; kaçmazlar Feza'ya bakar ve çok yaklaşınca yerinde pırpır eder
    k.gagaT -= dt;
    if (k.gagaT <= 0) {
      const z = Math.random();
      if (z < .55) { k.gaga = 1; k.gagaT = .25 + Math.random() * .6; }
      else if (z < .8) { k.hop = .3; k.vx = (Math.random() - .5) * 40; k.gagaT = .6 + Math.random(); }
      else { k.yon = -k.yon; k.gagaT = .8 + Math.random(); }
    }
    k.gaga = Math.max(0, k.gaga - dt * 5);
    if (k.hop > 0) {
      k.hop -= dt; const u = 1 - k.hop / .3;
      k.y = o.zy - Math.sin(Math.PI * clamp(u, 0, 1)) * (k.pir ? 14 : 4);
      k.x = clamp(k.x + k.vx * dt, o.mx + k.ox - 14, o.mx + k.ox + 14);
      k.kanat = k.pir ? Math.sin(k.faz * 30) : 0;
      if (k.hop <= 0) { k.y = o.zy; k.pir = false; k.kanat = 0; }
    }
    if (o.kacmaz && Math.abs(P.x - k.x) < 260) {
      k.yon = P.x > k.x ? 1 : -1;
      if (Math.abs(P.x - k.x) < 70 && k.hop <= 0 && Math.random() < dt * 2) { k.hop = .3; k.pir = true; k.vx = 0; }
    }
  }
  if (o.durum === 'uc' && havada === 0) { o.durum = 'yer'; o.t = 0; }
  o.x = o.kuslar[0].x;
}
function cnKusCizO(o, t) {
  if (!cnGorunur(o.mx, 120) && o.durum === 'yer') return;
  const s = 1.25 * cnDerinlik(o.zy), cik = clamp(1 - (CN.saat - o.cikT) / .9, 0, 1);
  let mx = 0, my = 0, n = 0;
  for (const k of o.kuslar) {
    if (!cnGorunur(k.x, 30)) continue;
    cnSerceCiz(g, k.x, k.y, s, k.yon, k.gaga, k.kanat, k.uc || k.pir, cik, o.pal);
    mx += k.x; my += k.y; n++;
  }
  if (n) cnIsabet(o, mx / n, my / n - 7, 44, 26);
}
function cnKusDokun(o) {
  o.cikT = CN.saat; cnOlay('k12KusDokun', o, o.hx, o.hy);
  // dokununca hepsi cik cik diye yerinde pırpır hoplar (kaçmazlar da)
  for (const k of o.kuslar) if (!k.uc) { k.hop = .3 + Math.random() * .1; k.pir = true; k.vx = 0; }
}
TUR.kaydet('k12Kus', { kur: cnKusKur, guncelle: cnKusGuncelle, ciz: cnKusCizO });

// ════════════════════ martılar (uzakta, gökte) ════════════════════
function cnMartiCiz(c, x, y, s, kanat, yon) {
  c.save(); c.translate(x, y); c.scale(s * yon, s);
  const k = kanat;   // -1 aşağı .. 1 yukarı
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#ffffff'; c.lineWidth = 3.2;
  c.beginPath(); c.moveTo(-15, -3 - k * 6); c.quadraticCurveTo(-7, -6 - k * 4, 0, 0); c.quadraticCurveTo(7, -6 - k * 4, 15, -3 - k * 6); c.stroke();
  c.strokeStyle = '#8f9fb2'; c.lineWidth = 3.4;
  c.beginPath(); c.moveTo(-15, -3 - k * 6); c.lineTo(-12, -4.2 - k * 5.4); c.moveTo(15, -3 - k * 6); c.lineTo(12, -4.2 - k * 5.4); c.stroke();
  cnElips(c, .5, .3, 4.2, 1.9, 0, '#ffffff');
  c.fillStyle = '#f2b542'; c.beginPath(); c.moveTo(4.4, -.2); c.lineTo(6.6, .3); c.lineTo(4.4, .9); c.fill();
  c.restore();
}
function cnMartiKur(o) { o.bx = o.x; o.by = o.gy || 400; o.faz = (o.x * .01) % 6.28; o.donT = -9; o.dx = o.x; o.dy = o.by; o.yon = 1; cnKayit(o); }
function cnMartiGuncelle(o, dt) {
  if (!(dt > 0)) return;
  if (Math.abs(P.x - o.bx) > 2200) return;
  o.faz += dt;
  // geniş, yavaş bir elips üstünde süzülür; paralaks .45 (uzakta)
  const camc = cam.x + VW / 2, par = .45;
  let lx = Math.sin(o.faz * .16) * 150, ly = Math.sin(o.faz * .32) * 14;
  const du = CN.saat - o.donT;
  if (du < 2.2) { const a = du / 2.2 * CN_PI2; lx += Math.sin(a) * 26; ly -= (1 - Math.cos(a)) * 18; }   // dokununca bir takla turu
  o.dx = o.bx + (camc - o.bx) * (1 - par) + lx; o.dy = o.by + ly;
  o.yon = Math.cos(o.faz * .16) >= 0 ? 1 : -1;
  o.x = o.dx;
}
function cnMartiCizO(o, t) {
  if (!cnGorunur(o.dx, 40)) return;
  const cirp = Math.sin(o.faz * .9) > .55 ? Math.sin(o.faz * 9) : .15 + Math.sin(o.faz * 1.3) * .1;
  cnMartiCiz(g, o.dx, o.dy, .85, cirp, o.yon);
  cnIsabet(o, o.dx, o.dy, 32, 24);
}
function cnMartiDokun(o) { o.donT = CN.saat; cnOlay('k12MartiDokun', o, o.dx, o.dy); }
TUR.kaydet('k12Marti', { kur: cnMartiKur, guncelle: cnMartiGuncelle, ciz: cnMartiCizO });
// ════════════════════ kelebekler ════════════════════
// Çiçeğine konar (kanatlarını ağır ağır açıp kapar), havalanıp çevresinde dolaşır; Feza yaklaşınca bir süre başının çevresinde
// dans eder, sonra çiçeğine döner. Dokununca parıltıyla bir spiral çizer.
const CN_KELEBEK = [['#f7a8c4', '#fff0f6', '#d9789c'], ['#ffd36e', '#fff7da', '#e2a63c'], ['#a9c8f5', '#eef5ff', '#7598d2'],
  ['#c7a6f0', '#f6eeff', '#9a78c9'], ['#ffb37a', '#fff1e2', '#e08850']];
const CN_CICEK = ['#ffffff', '#ffd6e4', '#fff1a8', '#e6dcff'];
// Not: CLAUDE.md "böcek yok" kuralı gereği kelebekler kaldırıldı; aynı yerlerde ve aynı hareketle artık KARAHİNDİBA TOHUMLARI
// süzülür (adlar/olaylar 'kelebek' kaldı ki SES ve yerleşim bozulmasın). Tohum: ince sap, kahverengi çekirdek, ucunda beyaz
// tüy şemsiyesi; 'acik' (eski kanat açıklığı) burada tüylerin esintiyle hafifçe açılıp kapanması, renk = tüy uçlarındaki pastel parıltı.
function cnKelebekCiz(c, x, y, s, acik, renk, yon, egim) {
  const r = CN_KELEBEK[renk % CN_KELEBEK.length];
  c.save(); c.translate(x, y); c.rotate(egim * .6 + .12 * yon); c.scale(s * 1.6, s * 1.6);
  const ac = .82 + .18 * acik;   // tüy şemsiyesinin açıklığı
  // sap ve çekirdek
  c.strokeStyle = 'rgba(150,130,110,.85)'; c.lineWidth = .45; c.lineCap = 'round';
  c.beginPath(); c.moveTo(0, -3); c.lineTo(0, 5.2); c.stroke();
  cnElips(c, 0, 6.4, .75, 1.6, 0, '#a07650');
  // tüyler: tepedeki noktadan yarım küre biçiminde ışınlar
  c.strokeStyle = 'rgba(255,255,255,.92)'; c.lineWidth = .32; c.beginPath();
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI * (.08 + .84 * i / 10), L = 6.4;
    c.moveTo(0, -3); c.lineTo(Math.cos(a) * L * ac, -3 + Math.sin(a) * L * (.75 + .25 * ac));
  }
  c.stroke();
  c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath();
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI * (.08 + .84 * i / 10), L = 6.4, px = Math.cos(a) * L * ac, py = -3 + Math.sin(a) * L * (.75 + .25 * ac);
    c.moveTo(px + .9, py); c.arc(px, py, .9, 0, CN_PI2);
  }
  c.fill();
  c.fillStyle = r[1]; c.globalAlpha = .7; c.beginPath(); c.arc(0, -8.2, 1.2, 0, CN_PI2); c.fill(); c.globalAlpha = 1;   // tepede pastel ışıltı
  c.restore();
}
function cnCicekCiz(c, x, y, renk, boy) {   // kelebeğin kendi küçük çiçeği
  c.strokeStyle = '#6fa65a'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x - 1.5, y - boy * .5, x, y - boy); c.stroke();
  cnElips(c, x - 3, y - boy * .45, 3, 1.3, -.5, '#7fb862');
  c.fillStyle = renk;
  for (let j = 0; j < 5; j++) { const a = j * CN_PI2 / 5 - .3; c.beginPath(); c.ellipse(x + Math.cos(a) * 3.2, y - boy + Math.sin(a) * 2.2, 2.6, 1.8, a, 0, CN_PI2); c.fill(); }
  cnElips(c, x, y - boy, 1.7, 1.4, 0, '#ffcf5a');
}
function cnKelebekKur(o) {
  o.renk = o.renk === undefined ? Math.floor(o.x / 37) % CN_KELEBEK.length : o.renk;
  o.zy = o.zy || CN_CIM + 3; o.evX = o.x; o.evY = o.zy - 17; o.bx = o.evX; o.by = o.evY;
  o.durum = 'kon'; o.t = Math.random() * 3; o.sure = 3 + Math.random() * 3; o.tohum = (o.x * .021) % 6.28;
  o.yon = 1; o.egim = 0; o.acik = 1; o.dokT = -9; o.eslT = -99; o.cizX = o.bx; o.cizY = o.by;
  cnKayit(o);
}
function cnKelebekGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const adx = Math.abs(P.x - o.bx);
  if (o.durum === 'kon' && adx > 1700) return;
  o.t += dt;
  const T0 = CN.saat + o.tohum;
  let hx = o.evX, hy = o.evY, hiz = 2.2;
  switch (o.durum) {
    case 'kon':
      if (o.t > o.sure) { o.durum = 'uc'; o.t = 0; o.sure = 5 + Math.random() * 4; }
      break;
    case 'uc':
      hx = o.evX + Math.sin(T0 * .7) * 60 + Math.sin(T0 * 1.9) * 14; hy = o.evY - 34 + Math.sin(T0 * 1.3) * 20;
      if (o.t > o.sure) { o.durum = 'don'; o.t = 0; }
      break;
    case 'esl':
      // Feza'nın başının çevresinde dans
      hx = P.x + Math.cos(T0 * 1.4) * 44; hy = P.y - 104 + Math.sin(T0 * 2.1) * 16; hiz = 2.6;
      if (o.t > 8 || cnFezaBinis() || Math.abs(o.bx - o.evX) > 900) { o.durum = 'don'; o.t = 0; }
      break;
    case 'don':
      if (Math.abs(o.bx - o.evX) < 4 && Math.abs(o.by - o.evY) < 4) { o.durum = 'kon'; o.t = 0; o.sure = 3 + Math.random() * 4; }
      hiz = cnGorunur(o.bx, 40) ? 1.8 : 6;
      break;
  }
  if ((o.durum === 'kon' || o.durum === 'uc') && adx < 170 && !cnFezaBinis() && CN.saat - o.eslT > 20) { o.durum = 'esl'; o.t = 0; o.eslT = CN.saat; }
  const ox = o.bx;
  if (o.durum !== 'kon') { o.bx = cnYaklas(o.bx, hx, dt * hiz); o.by = cnYaklas(o.by, hy, dt * hiz); }
  if (Math.abs(o.bx - ox) > dt * 4) o.yon = o.bx > ox ? 1 : -1;
  // kanat: konmuşken ağır ağır, uçarken hızlı çırpar
  o.acik = o.durum === 'kon' ? .6 + .4 * Math.sin(CN.saat * 1.6 + o.tohum) : Math.abs(Math.sin(CN.saat * 11 + o.tohum));
  o.egim = o.durum === 'kon' ? 0 : Math.sin(CN.saat * 2 + o.tohum) * .15;
  // dokunuş: parıltılı küçük spiral
  const du = CN.saat - o.dokT;
  o.cizX = o.bx; o.cizY = o.by;
  if (du < 1.6) { const u = du / 1.6, a = u * CN_PI2 * 1.5, r = Math.sin(Math.PI * u) * 26; o.cizX += Math.cos(a) * r; o.cizY += -Math.sin(a) * r - Math.sin(Math.PI * u) * 22; }
  o.x = o.bx;
}
function cnKelebekCizO(o, t) {
  if (cnGorunur(o.evX, 30)) for (let i = 0; i < 3; i++) cnCicekCiz(g, o.evX - 7 + i * 7, o.zy, CN_CICEK[(o.renk + i) % CN_CICEK.length], 13 + (i % 2) * 4 + (i === 1 ? 2 : 0));
  if (!cnGorunur(o.cizX, 30)) return;
  const du = CN.saat - o.dokT;
  if (du < 1.6) cnIsik(g, '#fff3c4', o.cizX, o.cizY - 3, 22, Math.sin(Math.PI * du / 1.6) * .8);
  cnKelebekCiz(g, o.cizX, o.cizY, 1.15, o.acik, o.renk, o.yon, o.egim);
  cnIsabet(o, o.cizX, o.cizY - 3, 30, 28);
}
function cnKelebekDokun(o) { o.dokT = CN.saat; if (o.durum === 'kon') { o.durum = 'uc'; o.t = 0; } cnOlay('k12KelebekDokun', o, o.bx, o.by); }
TUR.kaydet('k12Kelebek', { kur: cnKelebekKur, guncelle: cnKelebekGuncelle, ciz: cnKelebekCizO });

// ════════════════════ sincaplar ════════════════════
// Kızıl kahve, kocaman kabarık kuyruklu, kulak püsküllü. Yerde oturup cevizini kemirir; Feza yaklaşınca ağaca tırmanır
// (ZN12_AGAC'ta yakın ağaç varsa; yoksa hoplayarak biraz uzaklaşır), Feza gidince aşağı iner.
const CN_SINCAP = { g: '#c46f3b', gk: '#9d5229', ac: '#dd9359', kr: '#f6e2c6', gz: '#2b1b16', cv: '#9a6a3a', ks: '#6e4a2a' };
function cnSincapCiz(c, x, y, s, yon, poz, faz, kemir, kabar, rot) {
  const p = CN_SINCAP;
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(s * yon, s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  if (poz === 'otur') {
    if (!rot) cnGolge(c, 0, .3, 8, .18);
    // kuyruk: arkada kocaman S; kabarınca büyür
    const kb = 1 + kabar * .25, sl = Math.sin(faz * 2.2) * 1.2;
    c.save(); c.translate(-3, -3); c.scale(kb, kb);
    c.strokeStyle = p.ac; c.lineWidth = 10.5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-12, -6, -7, -20); c.quadraticCurveTo(-3 + sl, -29, -9 + sl, -31); c.stroke();
    c.strokeStyle = p.g; c.lineWidth = 7; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-12, -6, -7, -20); c.quadraticCurveTo(-3 + sl, -29, -9 + sl, -31); c.stroke();
    c.restore();
    cnElips(c, 0, -8, 5.6, 7.6, -.18, p.g);
    cnElips(c, 1.6, -7.6, 3, 5, -.15, p.kr);
    cnElips(c, -1.2, -3.4, 4.8, 3.6, 0, p.gk);
    cnElips(c, 2.6, -.8, 3.2, 1.3, 0, p.g);
    // baş (kemirirken hafif sallanır)
    c.save(); c.translate(2.8, -16.6); c.rotate(Math.sin(faz * 18) * .06 * kemir);
    c.fillStyle = p.g; c.beginPath(); c.moveTo(-2.4, -3.2); c.lineTo(-2.6, -7.6); c.lineTo(.6, -4); c.closePath(); c.fill();
    c.strokeStyle = p.ac; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-2.6, -7.4); c.lineTo(-3.2, -9.2); c.stroke();
    cnElips(c, 0, 0, 4.8, 4.3, 0, p.g);
    cnElips(c, 3, .8, 2.6, 2.1, 0, p.kr);
    cnElips(c, 5.3, -.1, .9, .7, 0, '#5b3a30');
    cnElips(c, 1.3, -1.2, 1.55, 1.75, 0, p.gz);
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(.9, -1.8, .55, 0, CN_PI2); c.fill();
    c.restore();
    // patilerinde ceviz
    if (kemir > .05) { cnElips(c, 5.6, -11 + Math.sin(faz * 18) * .4, 2.2, 2.6, 0, p.cv); cnElips(c, 5.6, -13.2, 2.5, 1.2, 0, p.ks); }
    cnElips(c, 4.4, -10.4, 1.6, 1.2, .4, p.gk);
  } else {   // 'kos' (yerde hoplayarak koşu) ve tırmanış (rot ile dikey)
    const h = Math.abs(Math.sin(faz)), yk = rot ? 0 : -h * 5;
    if (!rot) cnGolge(c, 0, .3, 8, .16);
    c.save(); c.translate(0, yk);
    c.strokeStyle = p.ac; c.lineWidth = 9.5; c.beginPath(); c.moveTo(-6, -6); c.quadraticCurveTo(-17, -4 + h * 3, -15, -15); c.quadraticCurveTo(-14, -22, -8, -20); c.stroke();
    c.strokeStyle = p.g; c.lineWidth = 6; c.beginPath(); c.moveTo(-6, -6); c.quadraticCurveTo(-17, -4 + h * 3, -15, -15); c.quadraticCurveTo(-14, -22, -8, -20); c.stroke();
    const ac = Math.sin(faz) * 3;
    cnElips(c, -4 + ac, -1.6, 3.2, 1.6, 0, p.gk); cnElips(c, 5 - ac, -1.4, 2.4, 1.4, 0, p.gk);
    cnElips(c, 0, -6, 7.6, 4.6, -.08, p.g);
    cnElips(c, 1, -3.6, 5, 2, 0, p.kr);
    c.fillStyle = p.g; c.beginPath(); c.moveTo(5.5, -12); c.lineTo(5.6, -16); c.lineTo(8.2, -12.6); c.closePath(); c.fill();
    cnElips(c, 7.4, -9.4, 4.4, 3.8, 0, p.g);
    cnElips(c, 10, -8.6, 2.4, 1.9, 0, p.kr);
    cnElips(c, 12, -9.4, .8, .7, 0, '#5b3a30');
    cnElips(c, 8.4, -10.4, 1.4, 1.6, 0, p.gz);
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(8.1, -11, .5, 0, CN_PI2); c.fill();
    c.restore();
  }
  c.restore();
}
function cnAgacBul(x) {
  if (typeof ZN12_AGAC === 'undefined' || !Array.isArray(ZN12_AGAC)) return null;
  let en = null, d = 5 * T;
  for (const a of ZN12_AGAC) if (a && Number.isFinite(a.x) && Number.isFinite(a.y0) && Number.isFinite(a.y1) && Math.abs(a.x - x) < d) { d = Math.abs(a.x - x); en = a; }
  return en;
}
function cnSincapKur(o) {
  o.evX = o.x; o.zy = CN_CIM + 2; o.sx = o.x; o.sy = o.zy; o.yon = o.yon || 1; o.agac = undefined;
  o.durum = 'yer'; o.t = 0; o.faz = 0; o.kemir = 1; o.kabar = 0; o.hedef = o.x; o.v = 0; o.dokT = -9; o.tep = 0;
  cnKayit(o);
}
function cnSincapKos(o, hedef, hiz, dt) {   // hoplayarak koşu: faz yol uzunluğuna bağlı
  const f = hedef - o.sx; o.yon = f > 0 ? 1 : -1;
  const ad = Math.min(Math.abs(f), hiz * dt); o.sx += Math.sign(f) * ad; o.faz += ad / 9;
  return Math.abs(hedef - o.sx);
}
function cnSincapGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  if (o.agac === undefined) {   // ağaç bir kez aranır (zemin12 yüklemede yayınlar)
    o.agac = cnAgacBul(o.evX);
    if (o.agac) { o.evX = o.agac.x + (o.agac.r || 6) + 14; o.sx = o.evX; }
  }
  const dx = P.x - o.sx, adx = Math.abs(dx), a = o.agac;
  if (o.durum === 'yer' && adx > 1700) return;
  o.t += dt; o.faz += dt;
  switch (o.durum) {
    case 'yer':
      o.kemir = cnYaklas(o.kemir, 1, dt * 3); o.kabar = cnYaklas(o.kabar, 0, dt * 2);
      if (Math.abs(o.sx - o.evX) > 3 && adx > 300) { o.durum = 'eve'; o.t = 0; }
      else if (adx < 175 && o.t > .6) { o.durum = a ? 'agaca' : 'kac'; o.t = 0; o.hedef = a ? a.x : clamp(o.sx - Math.sign(dx || 1) * 150, o.evX - 220, o.evX + 220); }
      else if (Math.random() < dt * .15) o.yon = -o.yon;
      break;
    case 'sasir':   // dokunuldu: dikilir, kuyruğunu kabartır, cevizini gösterir
      o.kabar = cnYaklas(o.kabar, 1, dt * 8); o.kemir = 1; o.yon = dx > 0 ? 1 : -1;
      if (o.t > 1.4) { o.durum = a ? 'agaca' : 'kac'; o.t = 0; o.hedef = a ? a.x : clamp(o.sx - Math.sign(dx || 1) * 150, o.evX - 220, o.evX + 220); }
      break;
    case 'kac':
      o.kemir = 0;
      if (cnSincapKos(o, o.hedef, 150, dt) < 2) { o.durum = 'yer'; o.t = 0; o.yon = dx > 0 ? 1 : -1; }
      break;
    case 'eve':
      o.kemir = 0;
      if (cnSincapKos(o, o.evX, 90, dt) < 2) { o.durum = 'yer'; o.t = 0; o.yon = 1; }
      break;
    case 'agaca':
      o.kemir = 0;
      if (cnSincapKos(o, a.x, 160, dt) < 2) { o.durum = 'tirman'; o.t = 0; }
      break;
    case 'tirman': {
      const tepe = a.y1 + 6, f = tepe - o.sy;
      o.sy += Math.max(f, -120 * dt); o.faz += 120 * dt / 9;
      if (o.sy <= tepe + .5) { o.durum = 'tepe'; o.t = 0; }
      break;
    }
    case 'tepe':
      // yaprakların arasında saklanır; arada başını çıkarıp bakar; Feza uzaklaşınca iner
      if (adx > 300 && o.t > 3) { o.durum = 'in'; o.t = 0; }
      break;
    case 'in': {
      const f = o.zy - o.sy;
      o.sy += Math.min(f, 70 * dt); o.faz += 70 * dt / 9;
      if (o.sy >= o.zy - .5) { o.sy = o.zy; o.durum = 'eve'; o.t = 0; }
      if (adx < 160 && o.sy < o.zy - 30) { o.durum = 'tirman'; o.t = 0; }
      break;
    }
  }
  o.x = o.sx;
}
function cnSincapCizO(o, t) {
  if (!cnGorunur(o.sx, 40)) return;
  const s = 1.5 * cnDerinlik(o.zy);
  if (o.durum === 'tirman' || o.durum === 'in' || o.durum === 'tepe') {
    // gövdenin önünde dikey; inerken baş aşağı. Tepede yalnız baş ve kuyruk ucu görünür (yapraklar ONPLAN'ın taçında örter)
    const asagi = o.durum === 'in', r = (o.agac && o.agac.r) || 6;
    const x = o.agac.x + (asagi ? -1 : 1) * r * .2;
    if (o.durum === 'tepe') {
      // dalların ayrıldığı yerde oturur, kuyruğu kıvrık, Feza'ya bakar; arada bir boynunu uzatıp doğrulur
      const uzan = Math.max(0, Math.sin(o.t * 1.3)) ** 3, yon = P.x > x ? 1 : -1;
      cnSincapCiz(g, x + yon * r * .6, o.sy + 8 - uzan * 3, s * .92, yon, 'otur', o.faz, 0, uzan * .4, 0);
    } else cnSincapCiz(g, x, o.sy, s, 1, 'kos', o.faz, 0, 0, asagi ? Math.PI / 2 : -Math.PI / 2);
    cnIsabet(o, x, o.sy - 6, 28, 30);
    return;
  }
  const poz = o.durum === 'kac' || o.durum === 'eve' || o.durum === 'agaca' ? 'kos' : 'otur';
  cnSincapCiz(g, o.sx, o.sy, s, o.yon, poz, o.faz, o.kemir, o.kabar, 0);
  cnIsabet(o, o.sx, o.sy - 12 * s, 28, 26);
}
function cnSincapDokun(o) {
  o.dokT = CN.saat; cnOlay('k12SincapDokun', o, o.sx, o.sy - 12);
  if (o.durum === 'yer') { o.durum = 'sasir'; o.t = 0; }
  else if (o.durum === 'tepe') o.t = Math.max(o.t, 2.4);   // hemen başını uzatır
}
TUR.kaydet('k12Sincap', { kur: cnSincapKur, guncelle: cnSincapGuncelle, ciz: cnSincapCizO });

// ════════════════════ uzaktaki öğrenciler ════════════════════
// Arka yolda (y ≈ 650), küçük ölçekli, yumuşak çizgili; yürür, bisiklet sürer ya da çimde kitap okur. Feza yaklaşınca el sallar.
// Paralaks .86: uzakta oldukları belli olsun. Feza'nın şeridine hiç inmezler.
const CN_OGR = [
  { sac: '#3a2a22', stil: 'at', ust: '#f39bb1', alt: '#5b6b9a', canta: '#7ec4cf', cilt: '#f3cfb3', bis: '#79b8e8' },
  { sac: '#6b4a2e', stil: 'kisa', ust: '#8fc7ea', alt: '#3f4f63', canta: '#f5b45e', cilt: '#e9bb94', bis: '#ef8f7a' },
  { sac: '#1f1b1e', stil: 'topuz', ust: '#b9e08f', alt: '#6d5a8c', canta: '#f08f8f', cilt: '#d9a37c', bis: '#f2c94c' },
  { sac: '#c98f4e', stil: 'kivir', ust: '#f7d36b', alt: '#4a6a8a', canta: '#9b8ee0', cilt: '#f6d7bf', bis: '#8fd1a8' },
  { sac: '#2c2320', stil: 'kisa', ust: '#2f4f8f', alt: '#38475a', canta: '#88d0a4', cilt: '#c98e6a', bis: '#e86a6a', ayk: true },
  { sac: '#7a3f2a', stil: 'at', ust: '#c3a0e6', alt: '#4b4f6a', canta: '#ffcf86', cilt: '#f0c4a0', bis: '#6fc3c0' }
];
function cnOgrBas(c, v, hx, hy, egim, t) {
  c.save(); c.translate(hx, hy); c.rotate(egim);
  if (v.stil === 'at') { c.fillStyle = v.sac; c.beginPath(); c.ellipse(-12, 2 + Math.sin(t * 9) * .8, 4, 8.5, .5 + Math.sin(t * 9) * .08, 0, CN_PI2); c.fill(); }
  if (v.stil === 'topuz') cnElips(c, -4, -13.5, 5.4, 5, 0, v.sac);
  cnElips(c, 0, 0, 12.5, 12, 0, v.cilt);
  c.fillStyle = v.sac; c.beginPath(); c.ellipse(-1, -3, 13.2, 10.5, -.1, Math.PI * .92, Math.PI * 2.04); c.fill();
  c.beginPath(); c.ellipse(-8, 1, 5.5, 8.5, .1, 0, CN_PI2); c.fill();
  if (v.stil === 'kivir') for (let i = 0; i < 6; i++) cnElips(c, -11 + i * 4.2, -9 - Math.sin(i * 1.3) * 2.5, 3.6, 3.4, 0, v.sac);
  if (v.ayk) {
    c.strokeStyle = '#ef6f8a'; c.lineWidth = 2; c.beginPath(); c.arc(-2, -2, 13.5, Math.PI * 1.05, Math.PI * 1.85); c.stroke();
    cnElips(c, -6.5, 2.5, 3, 4, 0, '#ef6f8a');
  }
  cnElips(c, 4.2, -.5, 1.5, 1.9, 0, '#3a2a26'); cnElips(c, 9.6, -.5, 1.4, 1.8, 0, '#3a2a26');
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(3.8, -1.2, .55, 0, CN_PI2); c.arc(9.2, -1.2, .5, 0, CN_PI2); c.fill();
  c.strokeStyle = '#a5524a'; c.lineWidth = 1.1; c.beginPath(); c.arc(7.2, 3.2, 2.4, .3, Math.PI - .3); c.stroke();
  c.fillStyle = 'rgba(255,140,150,.35)'; c.beginPath(); c.ellipse(2.4, 3.6, 2.4, 1.4, 0, 0, CN_PI2); c.ellipse(11.4, 3.4, 1.6, 1.2, 0, 0, CN_PI2); c.fill();
  c.restore();
}
function cnOgrKol(c, x0, y0, x1, y1, renk, cilt) {
  c.strokeStyle = renk; c.lineWidth = 5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
  cnElips(c, x1, y1, 2.6, 2.6, 0, cilt);
}
// Öğrenci parçaları (karede kapanış/nesne üretmemek için üst düzey işlevler)
function cnOgrAyak(c, hy, fx, fy, renk, bk) {   // kalça (0, hy) → ayak; diz bk kadar öne bükülür
  c.strokeStyle = renk; c.lineWidth = 6; c.beginPath(); c.moveTo(0, hy); c.quadraticCurveTo(fx * .5 + bk, (hy + fy - 4) / 2, fx, fy - 4); c.stroke();
  cnElips(c, fx + 2, fy - 1.8, 3.8, 2.1, 0, '#3a3440');
}
function cnOgrTeker(c, cx, faz) {
  c.strokeStyle = '#4a4f5c'; c.lineWidth = 2.6; c.beginPath(); c.arc(cx, -12, 11.5, 0, CN_PI2); c.stroke();
  c.strokeStyle = 'rgba(90,96,110,.55)'; c.lineWidth = .8; c.beginPath();
  for (let i = 0; i < 3; i++) { const a = faz * .5 + i * Math.PI / 3; c.moveTo(cx + Math.cos(a) * 11, -12 + Math.sin(a) * 11); c.lineTo(cx - Math.cos(a) * 11, -12 - Math.sin(a) * 11); }
  c.stroke();
}
function cnOgrPedal(c, fx, fy, renk) {   // kalça → diz → pedal
  const hx = -7, hy = -37, mx = (hx + fx) / 2 + 6, my = (hy + fy) / 2 - 3;
  c.strokeStyle = renk; c.lineWidth = 5.5; c.beginPath(); c.moveTo(hx, hy); c.quadraticCurveTo(mx + 1, my - 1, fx, fy); c.stroke();
  cnElips(c, fx + 1.5, fy, 3.2, 1.8, 0, '#3a3440');
}
function cnOgrenciCiz(c, x, y, s, yon, v, poz, faz, el, t) {
  c.save(); c.translate(x, y); c.scale(s * yon, s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  const salla = Math.sin(t * 11) * 4 * el;   // el sallama
  if (poz === 'bisiklet') {
    cnGolge(c, 0, .5, 30, .14);
    cnOgrTeker(c, -17, faz); cnOgrTeker(c, 19, faz);
    const pa = faz * .5, p1x = -2 + Math.cos(pa) * 5.5, p1y = -12 + Math.sin(pa) * 5.5, p2x = -2 - Math.cos(pa) * 5.5, p2y = -12 - Math.sin(pa) * 5.5;
    cnOgrPedal(c, p2x, p2y, v.alt);
    c.strokeStyle = v.bis; c.lineWidth = 2.8;
    c.beginPath(); c.moveTo(-17, -12); c.lineTo(-2, -12); c.lineTo(-8, -33); c.lineTo(-17, -12); c.moveTo(-2, -12); c.lineTo(12, -33); c.lineTo(-8, -31); c.moveTo(12, -33); c.lineTo(19, -12); c.stroke();
    c.strokeStyle = '#3a3440'; c.lineWidth = 3; c.beginPath(); c.moveTo(-12, -35); c.lineTo(-4, -35); c.moveTo(12, -34); c.lineTo(10, -40); c.lineTo(14, -41); c.stroke();
    c.fillStyle = v.canta; c.beginPath(); if (c.roundRect) c.roundRect(-17, -62, 9, 18, 3); else c.rect(-17, -62, 9, 18); c.fill();
    c.save(); c.translate(-7, -37); c.rotate(.38);
    c.fillStyle = v.ust; c.beginPath(); if (c.roundRect) c.roundRect(-7, -25, 14, 27, 6); else c.rect(-7, -25, 14, 27); c.fill();
    c.restore();
    cnOgrPedal(c, p1x, p1y, v.alt);
    if (el > .05) cnOgrKol(c, 2, -57, 6 + salla, -80, v.ust, v.cilt);
    else cnOgrKol(c, 2, -57, 13, -41, v.ust, v.cilt);
    cnOgrBas(c, v, 7, -70, .12, t);
  } else if (poz === 'otur') {
    cnGolge(c, 0, .5, 20, .14);
    cnElips(c, 2, -5, 15, 5.5, 0, v.alt);
    cnElips(c, 15, -2, 3.6, 2.2, 0, '#3a3440'); cnElips(c, -10, -2, 3.4, 2.1, 0, '#3a3440');
    c.fillStyle = v.canta; c.beginPath(); if (c.roundRect) c.roundRect(-22, -18, 11, 14, 3); else c.rect(-22, -18, 11, 14); c.fill();
    c.fillStyle = v.ust; c.beginPath(); if (c.roundRect) c.roundRect(-7, -35, 15, 29, 6); else c.rect(-7, -35, 15, 29); c.fill();
    // açık kitap (sayfalar beyaz, kapak renkli)
    c.fillStyle = v.bis; c.beginPath(); c.moveTo(6, -22); c.lineTo(20, -27); c.lineTo(21, -18); c.lineTo(7, -15); c.closePath(); c.fill();
    c.fillStyle = '#fffaf0'; c.beginPath(); c.moveTo(7, -22.5); c.lineTo(13.5, -27); c.lineTo(20, -26.4); c.lineTo(13.6, -20); c.closePath(); c.fill();
    cnOgrKol(c, 2, -30, 9, -19, v.ust, v.cilt);
    if (el > .05) cnOgrKol(c, -1, -31, 2 + salla, -56, v.ust, v.cilt); else cnOgrKol(c, -1, -31, 15, -20, v.ust, v.cilt);
    cnOgrBas(c, v, 3, -46, el > .05 ? -.05 : .18, t);
  } else {   // yürüyüş (el sallarken durur)
    cnGolge(c, 0, .5, 13, .14);
    // adım: bacaklar dizden bükülür, gövde her adımda hafifçe yükselir, kollar ters salınır
    const ad = Math.sin(faz) * 8, kk = Math.max(0, Math.cos(faz)) * 3, bob = Math.abs(Math.cos(faz)) * 1.6 * (1 - el), hy = -31 - bob;
    cnOgrAyak(c, hy, -ad, -kk * (ad < 0 ? 1 : 0), v.alt, ad < 0 ? 2.5 : .8);
    c.save(); c.translate(0, -bob);
    cnOgrKol(c, -1, -52, -1 + ad * .9, -34, v.ust, v.cilt);
    c.fillStyle = v.canta; c.beginPath(); if (c.roundRect) c.roundRect(-15, -55, 9, 21, 3); else c.rect(-15, -55, 9, 21); c.fill();
    c.fillStyle = v.ust; c.beginPath(); if (c.roundRect) c.roundRect(-8, -57, 16, 29, 6); else c.rect(-8, -57, 16, 29); c.fill();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(-6, -55, 4, 24);
    c.restore();
    cnOgrAyak(c, hy, ad, -kk * (ad > 0 ? 1 : 0), v.alt, ad > 0 ? 2.5 : .8);
    c.save(); c.translate(0, -bob);
    if (el > .05) cnOgrKol(c, 2, -52, 9 + salla, -80, v.ust, v.cilt); else cnOgrKol(c, 2, -52, 2 - ad * .9, -34, v.ust, v.cilt);
    cnOgrBas(c, v, 2, -69, Math.sin(faz * 2) * .03, t);
    c.restore();
  }
  c.restore();
}
function cnOgrenciKur(o) {
  o.bx = o.x; o.poz = o.poz || 'yuru'; o.v = CN_OGR[(o.v === undefined ? Math.floor(o.x / 41) : o.v) % CN_OGR.length];
  o.yay = o.yay || (o.poz === 'bisiklet' ? 700 : 180); o.px = 0; o.yon = o.yon || 1; o.hiz = o.poz === 'bisiklet' ? 80 : 26 + (o.x % 7);
  o.faz = 0; o.el = 0; o.selamT = -99; o.selamU = 0; o.bekle = 0; o.dx = o.x; o.dy = o.gy || CN_UZAK; o.dokun = false;
  o.yakin = o.yakin || 300; o.kalpT = -9;
  cnKayit(o);
}
function cnOgrenciGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  if (Math.abs(P.x - (o.bx + o.px)) > 2400) return;
  const camc = cam.x + VW / 2, wx = o.bx + o.px;
  o.dx = wx + (camc - wx) * (1 - .86);
  const gor = cnGorunur(o.dx, 60);
  // el sallama: Feza yaklaşınca kendiliğinden (seyrek), ya da dokununca
  if (o.selamU <= 0 && Math.abs(P.x - o.dx) < o.yakin && CN.saat - o.selamT > 22 && gor) {
    o.selamU = 1.9; o.selamT = CN.saat; o.dokun = false; cnOlay('k12OgrenciSelam', o, o.dx, o.dy - 40);
  }
  o.selamU -= dt;
  o.el = cnYaklas(o.el, o.selamU > 0 ? 1 : 0, dt * 8);
  if (o.poz === 'otur') { o.x = o.dx; return; }
  const yuruyen = o.poz === 'yuru';
  if (yuruyen && o.selamU > 0) { o.yon = P.x > o.dx ? 1 : -1; o.x = o.dx; return; }   // durup Feza'ya döner
  if (o.bekle > 0) { o.bekle -= dt; o.x = o.dx; return; }
  o.px += o.yon * o.hiz * dt; o.faz += o.hiz * dt / (yuruyen ? 6.5 : 4.5);
  if (Math.abs(o.px) > o.yay) {
    if (!yuruyen && !gor) o.px = -Math.sign(o.px) * o.yay;   // bisikletli görünmezken öbür başa geçer
    else if (yuruyen) { o.px = Math.sign(o.px) * o.yay; o.yon = -o.yon; o.bekle = .8 + Math.random(); }
  }
  o.x = o.dx;
}
function cnOgrenciCizO(o, t) {
  if (!cnGorunur(o.dx, 50)) return;
  const s = .5, poz = o.poz;
  cnOgrenciCiz(g, o.dx, o.dy, s, o.yon, o.v, poz, o.faz, o.el, t);
  const du = CN.saat - o.kalpT;
  if (du < 1.8) cnKalpler(g, o.dx + 3, o.dy - 82 * s, du, .8);
  cnIsabet(o, o.dx, o.dy - (poz === 'otur' ? 22 : 38) * s, 30, 32);
}
function cnOgrenciDokun(o) {
  o.selamU = 2.2; o.selamT = CN.saat; o.kalpT = CN.saat; o.dokun = true;
  cnOlay('k12OgrenciSelam', o, o.dx, o.dy - 40);
}
TUR.kaydet('k12Ogrenci', { kur: cnOgrenciKur, guncelle: cnOgrenciGuncelle, ciz: cnOgrenciCizO });

// ════════════════════ çim fıskiyeleri ════════════════════
// Yolun arkasındaki çimende küçük bir fıskiye başı; dört kavis halinde akan su (kesikli çizgi akar = damlalar), yere düşen
// damlaların buğusu, güneşte hafif gökkuşağı. Dokununca su yükselir, gökkuşağı belirginleşir, damlalar saçılır.
const CN_GK = ['rgba(255,120,130,.55)', 'rgba(255,190,110,.55)', 'rgba(255,240,130,.55)', 'rgba(140,220,150,.55)', 'rgba(130,190,255,.55)', 'rgba(185,150,240,.55)'];
function cnGokkusagiSpr() {
  if (CN.spr.gk) return CN.spr.gk;
  const t = cnTuval(-50, -50, 100, 52), q = t.q;
  q.lineWidth = 2.6;
  for (let i = 0; i < CN_GK.length; i++) { q.strokeStyle = CN_GK[i]; q.beginPath(); q.arc(0, 0, 46 - i * 2.5, Math.PI * 1.06, Math.PI * 1.94); q.stroke(); }
  CN.spr.gk = t.c; return t.c;
}
const CN_FIS_YON = [-1, -.42, .42, 1];
function cnFiskiyeKur(o) { o.zy = o.zy || CN_CIM - 1; o.dokT = -9; o.tohum = (o.x * .03) % 6.28; cnKayit(o); }
function cnFiskiyeCizO(o, t) {
  if (!cnGorunur(o.x, 80)) return;
  const x = o.x, y = o.zy, du = CN.saat - o.dokT;
  const fis = du < 2.6 ? Math.sin(Math.PI * Math.min(1, du / 2.6)) ** .6 : 0;
  // ıslak çimen parıltısı ve fıskiye başı
  g.fillStyle = 'rgba(60,120,70,.14)'; g.beginPath(); g.ellipse(x, y + 1, 52 + fis * 20, 6, 0, 0, CN_PI2); g.fill();
  cnElips(g, x, y - 1.5, 4.2, 2.2, 0, '#7d8a86'); cnElips(g, x, y - 3.4, 2, 2.2, 0, '#a7b4b0');
  // su kavisleri (kesikli çizgi akar → damla dizisi)
  g.lineCap = 'round';
  for (let i = 0; i < 4; i++) {
    const yon = CN_FIS_YON[i], nab = Math.sin(t * 1.5 + i * 1.7 + o.tohum);
    const R = (24 + Math.abs(yon) * 18 + nab * 5) * (1 + fis * .7), H = (30 + (1 - Math.abs(yon)) * 16 + nab * 4) * (1 + fis * 1.1);
    const ux = x + yon * R, kx = x + yon * R * .45;
    g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 1.1; g.setLineDash([]);
    g.beginPath(); g.moveTo(x, y - 4); g.quadraticCurveTo(kx, y - 4 - H * 2, ux, y - 1); g.stroke();
    g.strokeStyle = 'rgba(214,240,255,.85)'; g.lineWidth = 2.3; g.setLineDash([2.6, 4.2]); g.lineDashOffset = -t * 46 - i * 3;
    g.beginPath(); g.moveTo(x, y - 4); g.quadraticCurveTo(kx, y - 4 - H * 2, ux, y - 1); g.stroke();
    cnIsik(g, '#e4f6ff', ux, y - 3, 9 + fis * 6, .32 + fis * .3);
  }
  g.setLineDash([]); g.lineDashOffset = 0;
  // dokununca saçılan damlalar (analitik: her damla kendi açısı ve hızıyla yükselip düşer, dizi/nesne üretilmez)
  if (du < 1.4) {
    g.fillStyle = 'rgba(225,245,255,.9)';
    for (let i = 0; i < 14; i++) {
      const a = -Math.PI / 2 + (i / 13 - .5) * 2.2, v = 120 + (i * 37 % 60), dx = Math.cos(a) * v * du, dy = Math.sin(a) * v * du + 260 * du * du;
      if (dy * .9 > 44) continue;   // yere düştü
      const r = 1.8 + (i % 3) * .5;
      g.beginPath(); g.arc(x + dx, y - 40 + dy * .9 - 6, r, 0, CN_PI2); g.fill();
    }
  }
  // gökkuşağı: gün ışığında hafif; dokununca belirgin
  const gun = typeof dn12Gun === 'function' ? dn12Gun() : 0;
  const ga = (.14 + .06 * Math.sin(t * .8 + o.tohum)) * (1 - Math.max(0, gun - .8) * 3) + fis * .5;
  if (ga > .02) {
    g.save(); g.globalAlpha = Math.min(1, ga); g.translate(x, y - 2); g.scale(.95 + fis * .35, .9 + fis * .45); cnKoy(g, cnGokkusagiSpr()); g.restore();
  }
  cnIsabet(o, x, y - 26, 46, 34);
}
function cnFiskiyeDokun(o) {
  o.dokT = CN.saat;
  cnOlay('k12FiskiyeDokun', o, o.x, o.zy - 30);
}
TUR.kaydet('k12Fiskiye', { kur: cnFiskiyeKur, ciz: cnFiskiyeCizO });

// ════════════════════ botanik bahçesi: kirpi ════════════════════
// Yuvarlak, yumuşak dikenli (sivri değil; tombul tutamlar), krem yüzlü, iri gözlü kirpi; sırtında bir yaprak taşır.
// Tarhın kenarında burnunu kıpırdatarak ağır ağır dolaşır, arada durup koklar; Feza yaklaşınca durup ona döner ve burnunu oynatır.
// Dokununca iki küçük sevinç hoplaması, sırtındaki yaprak fırıl döner. OLAY 'k12KirpiDokun'.
const CN_KIRPI = { d1: '#8d6a4f', d2: '#b48e6c', dc: '#d6b896', kr: '#f3dfc4', ku: '#e8c6a5', ay: '#6b4c3a' };
function cnKirpiCiz(c, x, y, s, yon, faz, burun, hk, hop, yaprak) {
  const p = CN_KIRPI;
  cnGolge(c, x, y + .4, 15 * s, .2);
  c.save(); c.translate(x, y - hop); c.scale(s * yon, s);
  // minik ayaklar (adımda öne-arkaya)
  const a = Math.sin(faz) * 2.2 * hk;
  cnElips(c, -7 - a, -1, 2.6, 1.6, 0, p.ay); cnElips(c, 6 + a, -1, 2.6, 1.6, 0, p.ay);
  // gövde: kubbe + kenarında yumuşak diken tutamları (iki tonlu), üstünde açık renk çizgiler
  const bob = Math.abs(Math.sin(faz)) * .6 * hk;
  c.translate(0, -bob);
  cnElips(c, -1, -8, 13.5, 9.5, 0, p.d1);
  for (let i = 0; i <= 10; i++) {
    const t = Math.PI * (1.02 + i * .085), ex = -1 + Math.cos(t) * 13.2, ey = -8 + Math.sin(t) * 9.2;
    cnElips(c, ex, ey, 3.4, 3, t, i % 2 ? p.d2 : p.d1);
  }
  cnElips(c, -1.5, -9, 11, 7.2, 0, p.d2);
  c.strokeStyle = p.dc; c.lineWidth = .9; c.lineCap = 'round'; c.beginPath();
  for (let i = 0; i < 6; i++) { const t = Math.PI * (1.15 + i * .14); c.moveTo(-1.5 + Math.cos(t) * 5, -9 + Math.sin(t) * 3.4); c.lineTo(-1.5 + Math.cos(t) * 9.4, -9 + Math.sin(t) * 6.4); }
  c.stroke();
  // yüz: krem burun konisi, kara burun ucu (kıpır kıpır), iri parlak göz, yuvarlak kulak, pembe yanak
  cnElips(c, 8.5, -5.2, 7.4, 5.4, .12, p.kr);
  const bk = Math.sin(burun) * .7;
  cnElips(c, 13.6, -4.4 + bk * .4, 4.4, 3, .1, p.kr);
  cnElips(c, 17.6, -4.6 + bk, 1.8, 1.6, 0, '#3b2a26');
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(17.1, -5.3 + bk, .5, 0, CN_PI2); c.fill();
  cnElips(c, 6.4, -10.4, 2.2, 2, 0, p.ku); cnElips(c, 6.5, -10.2, 1.1, 1, 0, '#e9a9a0');
  cnElips(c, 10.6, -7.6, 1.55, 1.75, 0, '#2b1d18');
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(10.1, -8.2, .6, 0, CN_PI2); c.fill();
  c.fillStyle = 'rgba(255,140,150,.4)'; c.beginPath(); c.ellipse(10.4, -4.2, 2, 1.1, 0, 0, CN_PI2); c.fill();
  // sırtındaki yaprak (dokununca döner)
  c.save(); c.translate(-3, -17.5); c.rotate(-.4 + yaprak * CN_PI2);
  cnElips(c, 0, -3, 2.6, 4.6, 0, '#86c06a');
  c.strokeStyle = '#5f9a4c'; c.lineWidth = .6; c.beginPath(); c.moveTo(0, 1.5); c.lineTo(0, -6.5); c.stroke();
  c.restore();
  c.restore();
}
function cnKirpiKur(o) {
  o.evX = o.x; o.zy = o.zy || CN_CIM + 3; o.kx = o.x; o.yon = o.yon || 1; o.hedef = o.x + 50 * o.yon;
  o.durum = 'gez'; o.t = 0; o.sure = 3; o.faz = 0; o.burun = 0; o.hk = 0; o.dokT = -9; o.kalpT = -9;
  cnKayit(o);
}
function cnKirpiGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const dx = P.x - o.kx, adx = Math.abs(dx);
  if (adx > 1700) return;
  o.t += dt;
  let hiz = 0, burunHiz = 2;
  if (CN.saat - o.dokT < 1.6) { burunHiz = 14; o.yon = dx > 0 ? 1 : -1; }
  else if (adx < 150 && !cnFezaBinis()) { o.durum = 'bak'; o.yon = dx > 0 ? 1 : -1; burunHiz = 11; }
  else if (o.durum === 'bak') { o.durum = 'gez'; o.t = 0; }
  else if (o.durum === 'kokla') { burunHiz = 16; if (o.t > 1.5) { o.durum = 'gez'; o.t = 0; o.sure = 3 + Math.random() * 2; } }
  else {   // gez: evinin iki yanı arasında ağır ağır
    const f = o.hedef - o.kx; o.yon = f > 0 ? 1 : -1; hiz = 16;
    if (Math.abs(f) < 2) o.hedef = o.evX + (o.hedef > o.evX ? -1 : 1) * (40 + Math.random() * 25);
    if (o.t > o.sure) { o.durum = 'kokla'; o.t = 0; }
  }
  const ad = Math.min(Math.abs(o.hedef - o.kx), hiz * dt);
  o.kx += o.yon * ad; o.faz += ad / 2.4;
  o.hk = cnYaklas(o.hk, hiz > 0 ? 1 : 0, dt * 6);
  o.burun += dt * burunHiz;
  o.x = o.kx;
}
function cnKirpiCizO(o, t) {
  if (!cnGorunur(o.kx, 40)) return;
  const s = 1.35 * cnDerinlik(o.zy), du = CN.saat - o.dokT;
  const hop = du < 1.1 ? Math.abs(Math.sin(du / 1.1 * Math.PI * 2)) * 7 : 0, yaprak = du < 1.1 ? smooth(du / 1.1) : 0;
  cnKirpiCiz(g, o.kx, o.zy, s, o.yon, o.faz, o.burun, o.hk, hop, yaprak);
  cnKalpler(g, o.kx, o.zy - 26 * s, CN.saat - o.kalpT, s * .8);
  cnIsabet(o, o.kx, o.zy - 9 * s, 30, 24);
}
function cnKirpiDokun(o) { o.dokT = o.kalpT = CN.saat; cnOlay('k12KirpiDokun', o, o.kx, o.zy - 10); }
TUR.kaydet('k12Kirpi', { kur: cnKirpiKur, guncelle: cnKirpiGuncelle, ciz: cnKirpiCizO });

// ════════════════════ botanik bahçesi: kırlangıçlar ════════════════════
// Lacivert sırtlı, beyaz karınlı, pas rengi gerdanlı, çatal kuyruklu; çimenin üstünde alçaktan uzun kavislerle süzülür,
// arada kanat çırpar. Feza bölgedeyse onun çevresinde dolanıp önünden alçak bir dalışla geçer. Dokununca bir takla atar.
function cnKirlangicCiz(c, x, y, s, aci, kanat) {
  c.save(); c.translate(x, y); c.rotate(aci); if (Math.cos(aci) < 0) c.scale(s, -s); else c.scale(s, s);
  c.lineCap = 'round'; c.lineJoin = 'round';
  c.strokeStyle = '#26345f'; c.lineWidth = 1.1;
  c.beginPath(); c.moveTo(-4.5, 0); c.lineTo(-14, -2.8); c.moveTo(-4.5, .4); c.lineTo(-14, 3); c.stroke();   // çatal kuyruk
  const w = kanat;   // -1 aşağı .. 1 yukarı
  c.fillStyle = '#1f2a4f'; c.beginPath(); c.moveTo(0, -.5); c.quadraticCurveTo(-3, -6 * w - 2, -9, -10 * w); c.quadraticCurveTo(-3, -3 * w, 2, .4); c.fill();
  cnElips(c, 0, 0, 6.2, 2.5, 0, '#2c3c6e');
  cnElips(c, .6, 1.1, 4.8, 1.4, 0, '#fbf7f0');
  cnElips(c, 5.3, .5, 1.6, 1.3, 0, '#c8643e');
  cnElips(c, 6, -.5, 2.6, 2.3, 0, '#2c3c6e');
  c.fillStyle = '#ffffff'; c.beginPath(); c.arc(6.8, -1, .55, 0, CN_PI2); c.fill();
  c.fillStyle = '#26345f'; c.beginPath(); c.moveTo(8.4, -.6); c.lineTo(10, -.2); c.lineTo(8.4, .3); c.fill();
  c.fillStyle = '#34467f'; c.beginPath(); c.moveTo(0, -.2); c.quadraticCurveTo(-2, -5 * w - 1, -7, -9 * w + .5); c.quadraticCurveTo(-1.5, -2.5 * w, 2.5, .6); c.fill();   // yakın kanat
  c.restore();
}
function cnKirlangicKur(o) {
  o.evX = o.x; o.x0 = o.x0 || o.x - 400; o.x1 = o.x1 || o.x + 400; o.cx = o.x; o.kuslar = [];
  for (let i = 0; i < (o.n || 2); i++) o.kuslar.push({ ph: i * 2.4 + .7, x: o.x + i * 60, y: CN_YOL - 160, vx: 0, vy: 0, aci: 0, kanat: 0, takla: -9 });
  cnKayit(o);
}
function cnKirlangicGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  if (Math.abs(P.x - o.cx) > 2000) return;
  const icerde = P.x > o.x0 && P.x < o.x1 && !cnFezaBinis();
  o.cx = cnYaklas(o.cx, icerde ? P.x : o.evX, dt * .8);
  const T0 = CN.saat;
  for (const k of o.kuslar) {
    // uzun yatay kavisler + Feza'nın önünden alçak dalış
    const dalis = Math.max(0, Math.sin(T0 * .45 + k.ph)) ** 6 * (icerde ? 1 : .4);
    let hx = o.cx + Math.sin(T0 * .62 + k.ph) * 190 + Math.sin(T0 * 1.7 + k.ph * 2) * 30;
    let hy = CN_YOL - 165 + Math.sin(T0 * 1.25 + k.ph) * 45 + dalis * 105;
    const du = CN.saat - k.takla;
    if (du < 1.1) { const a = du / 1.1 * CN_PI2; hx += Math.sin(a) * 30; hy -= (1 - Math.cos(a)) * 26; }
    hx = clamp(hx, o.x0 - 60, o.x1 + 60);
    const nx = cnYaklas(k.x, hx, dt * 2.4), ny = cnYaklas(k.y, hy, dt * 2.4);
    k.vx = cnYaklas(k.vx, (nx - k.x) / dt, dt * 6); k.vy = cnYaklas(k.vy, (ny - k.y) / dt, dt * 6);
    k.x = nx; k.y = ny;
    k.aci = Math.atan2(k.vy, k.vx);
    // süzülürken kanatlar geride ve yukarıda; arada hızlı çırpış
    const cirp = Math.sin(T0 * .9 + k.ph) > .2;
    k.kanat = cirp ? Math.sin(T0 * 22 + k.ph) : .25 + Math.sin(T0 * 2 + k.ph) * .1;
  }
  o.x = o.kuslar[0].x;
}
function cnKirlangicCizO(o, t) {
  for (const k of o.kuslar) {
    if (!cnGorunur(k.x, 30)) continue;
    cnKirlangicCiz(g, k.x, k.y, 1.8, k.aci, k.kanat);
    cnIsabet(o, k.x, k.y, 32, 26);   // son çizilen kuşa isabet
    o.sonKus = k;
  }
}
function cnKirlangicDokun(o) {
  const k = o.sonKus || o.kuslar[0];
  k.takla = CN.saat; cnOlay('k12KirlangicDokun', o, k.x, k.y);
}
TUR.kaydet('k12Kirlangic', { kur: cnKirlangicKur, guncelle: cnKirlangicGuncelle, ciz: cnKirlangicCizO });

// ════════════════════ botanik bahçesi: kelebek bulutları ════════════════════
// Çiçek tarhının üstünde 6–7 kelebek birlikte dans eder; Feza geçerken bir süre onun çevresinde döner (sonra tarhına döner);
// dokununca hepsi parıltıyla yukarı doğru helezon çizip yeniden tarha iner. OLAY 'k12KelebekBulut' (o.dokun: dokunuşla mı).
function cnBulutKur(o) {
  const n = o.n || 7, r = rng(Math.floor(o.x) + 31);
  o.evX = o.x; o.zy = o.zy || CN_CIM + 3; o.kb = []; o.sarT = -99; o.sar = 0; o.dokT = -9; o.dokun = false;
  for (let i = 0; i < n; i++) o.kb.push({ x: o.x + (r() - .5) * 80, y: o.zy - 30, ph: r() * 6.28, hz: .45 + r() * .4, R: 30 + r() * 40, renk: Math.floor(r() * CN_KELEBEK.length), yon: 1, acik: 1, egim: 0 });
  o.cicek = []; for (let i = 0; i < 5; i++) o.cicek.push({ x: (i - 2) * 15 + (r() - .5) * 6, boy: 12 + r() * 8, renk: Math.floor(r() * CN_CICEK.length) });
  cnKayit(o);
}
function cnBulutGuncelle(o, dt) {
  if (!(dt > 0)) return; dt = Math.min(dt, .05);
  const adx = Math.abs(P.x - o.evX);
  if (adx > 1700) return;
  const T0 = CN.saat;
  // Feza yaklaşınca (25 sn'de bir) 7 sn onun çevresinde döner
  if (adx < 160 && !cnFezaBinis() && T0 - o.sarT > 25) { o.sarT = T0; o.dokun = false; cnOlay('k12KelebekBulut', o, o.evX, o.zy - 30); }
  o.sar = cnYaklas(o.sar, T0 - o.sarT < 7 && Math.abs(P.x - o.evX) < 500 ? 1 : 0, dt * 1.5);
  const du = T0 - o.dokT;
  let i = 0;
  for (const k of o.kb) {
    const a = T0 * k.hz + k.ph;
    let hx = o.evX + Math.sin(a) * k.R + Math.sin(T0 * 1.7 + k.ph) * 8;
    let hy = o.zy - 20 - Math.abs(Math.sin(a * 1.3 + i)) * 26 - (i % 3) * 6;
    if (o.sar > .01) {
      const fx = P.x + Math.cos(T0 * 1.2 + k.ph) * (36 + i * 6), fy = P.y - 92 + Math.sin(T0 * 1.6 + k.ph * 1.3) * 26;
      hx = lerp(hx, fx, o.sar); hy = lerp(hy, fy, o.sar);
    }
    if (du < 2) { const u = du / 2, b = Math.sin(Math.PI * u); hx += Math.cos(u * 9 + k.ph) * 30 * b; hy -= (40 + i * 8) * b; }
    const ox = k.x;
    k.x = cnYaklas(k.x, hx, dt * 2.6); k.y = cnYaklas(k.y, hy, dt * 2.6);
    if (Math.abs(k.x - ox) > dt * 3) k.yon = k.x > ox ? 1 : -1;
    k.acik = Math.abs(Math.sin(T0 * (9 + i) + k.ph)); k.egim = Math.sin(T0 * 2 + k.ph) * .18;
    i++;
  }
  o.x = o.evX;
}
function cnBulutCizO(o, t) {
  if (!cnGorunur(o.evX, 520)) return;
  if (cnGorunur(o.evX, 40)) for (const f of o.cicek) cnCicekCiz(g, o.evX + f.x, o.zy, CN_CICEK[f.renk], f.boy);
  const du = CN.saat - o.dokT;
  let mx = 0, my = 0, n = 0;
  for (const k of o.kb) {
    if (!cnGorunur(k.x, 20)) continue;
    if (du < 2) cnIsik(g, '#fff3c4', k.x, k.y - 3, 14, Math.sin(Math.PI * du / 2) * .55);
    cnKelebekCiz(g, k.x, k.y, 1.05, k.acik, k.renk, k.yon, k.egim);
    mx += k.x; my += k.y; n++;
  }
  if (n) cnIsabet(o, mx / n, my / n, 60, 40);
}
function cnBulutDokun(o) { o.dokT = CN.saat; o.dokun = true; cnOlay('k12KelebekBulut', o, o.hx, o.hy); }
TUR.kaydet('k12KelebekBulut', { kur: cnBulutKur, guncelle: cnBulutGuncelle, ciz: cnBulutCizO });

// ════════════════════ dokunma ════════════════════
const CN_DOKUN = { k12Kedi: cnKediDokun, k12Kopek: cnKopekDokun, k12Kus: cnKusDokun, k12Marti: cnMartiDokun, k12Kelebek: cnKelebekDokun,
  k12Sincap: cnSincapDokun, k12Ogrenci: cnOgrenciDokun, k12Fiskiye: cnFiskiyeDokun,
  k12Kirpi: cnKirpiDokun, k12Kirlangic: cnKirlangicDokun, k12KelebekBulut: cnBulutDokun };
// Dünya koordinatında en yakın isabet (son 0.3 sn'de çizilmiş canlılar arasından); yoksa null
function cnIsabetBul(wx, wy) {
  let en = null, ed = 1;
  for (let i = 0; i < CN.liste.length; i++) {
    const o = CN.liste[i];
    if (!(CN.saat - o.hT < .3)) continue;
    const ux = (wx - o.hx) / o.hrx, uy = (wy - o.hy) / o.hry, d = ux * ux + uy * uy;
    if (d < ed) { ed = d; en = o; }
  }
  return en;
}
function cnDokunus(e) {
  if (typeof DURUM === 'undefined' || DURUM !== 'oyun' || e.target !== cv) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi hep Feza'nın
  const r = cv.getBoundingClientRect();
  const wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  const o = cnIsabetBul(wx, wy);
  if (!o) return;
  try { CN_DOKUN[o.tip](o); } catch (err) { if (typeof omHata === 'function') omHata(o.tip + '.dokun', err); }
  CN.sonDokunus = o.tip;
  if (!cnFezaBinis()) { e.preventDefault(); e.stopPropagation(); }   // binişte basılı tutma araca da gitsin
}
addEventListener('pointerdown', cnDokunus, true);
// Her karede saat: çizimden önce güncellenen tek gizli nesne yerine, ilk canlının güncellemesi saati ilerletir
let cnSonKare = -1;
function cnSaatIlerle() { const n = cnSaat(); if (n !== cnSonKare) { cnSonKare = n; CN.saat = n; } }
for (const tip of Object.keys(CN_DOKUN)) {
  const h = TUR.al(tip), gu = h.guncelle, ci = h.ciz;
  TUR.kaydet(tip, { guncelle(o, dt) { cnSaatIlerle(); if (gu) gu(o, dt); }, ciz(o, tm) { cnSaatIlerle(); ci(o, tm); } });
}

// ════════════════════ yerleşim (sütunlar; bölgeler: BOLUM12.md, tur 2 haritası COLS 1100) ════════════════════
const yer = (tip, c, o) => nesne(tip, c, yuzey(c), o || {});
// Yerleşim bir işlevde: bolum12.js (nesne, nx, yuzey) nadiren bu dosyadan SONRA çalışabiliyor (document.write yüklemesi);
// o zaman yerleşimi sayfa yüklenince yaparız — yoksa "nesne is not defined" ile kampüs canlıları hiç kurulmazdı.
function cnYerlestir() {
  // lojman 0–70 (sabah): tekir kedi güneşleniyor, serçeler, çiçek kelebekleri, çimde fıskiye, sabah yürüyüşündeki öğrenci
  yer('k12Kedi', 27, { kurk: 'tekir', hal: 'gunes', yon: -1 });
  yer('k12Kus', 50, { n: 4, x0: nx(38), x1: nx(64) });
  yer('k12Kelebek', 19, { renk: 0 }); yer('k12Kelebek', 43, { renk: 1 });
  yer('k12Fiskiye', 58, {});
  yer('k12Ogrenci', 34, { v: 0, poz: 'yuru', yon: 1 });
  // yol1 70–300 (scooter ile hızla geçilir): el sallayan öğrenciler, kaçmayan serçeler, uyuklayan köpek, oturan sarman
  yer('k12Ogrenci', 96, { v: 1, poz: 'yuru', yon: -1, yakin: 420 });
  yer('k12Ogrenci', 140, { v: 2, poz: 'bisiklet', yon: -1, yakin: 420 });
  yer('k12Kedi', 122, { kurk: 'sarman', hal: 'otur', yon: 1 });
  yer('k12Kus', 165, { n: 3, kacmaz: true });
  yer('k12Ogrenci', 186, { v: 5, poz: 'otur', yon: 1, yakin: 420 });
  yer('k12Kopek', 210, { uykucu: true, yon: 1 });
  yer('k12Ogrenci', 238, { v: 3, poz: 'yuru', yon: 1, yakin: 420 });
  yer('k12Kus', 255, { n: 4, kacmaz: true });
  yer('k12Marti', 225, { gy: 400 });
  yer('k12Kelebek', 270, { renk: 2 });
  yer('k12Ogrenci', 282, { v: 4, poz: 'bisiklet', yon: 1, yakin: 420 });
  // fass 300–450: bankta uyuyan beyaz-siyah kedi, iki fıskiye, sincap, kelebekler, serçeler, kitap okuyan öğrenci
  yer('k12Kedi', 352, { kurk: 'beyaz', hal: 'bank', yon: 1 });
  yer('k12Fiskiye', 332, {}); yer('k12Fiskiye', 424, {});
  yer('k12Sincap', 405, { yon: -1 });
  yer('k12Kelebek', 342, { renk: 3 }); yer('k12Kelebek', 396, { renk: 4 });
  yer('k12Kus', 383, { n: 5, x0: nx(360), x1: nx(445) });
  yer('k12Ogrenci', 318, { v: 2, poz: 'otur', yon: 1 });
  yer('k12Ogrenci', 432, { v: 0, poz: 'yuru', yon: -1 });
  // bilgi 450–560: iri kampüs köpeği, havuz kenarında güneşlenen sarman, öğrenciler, bir kelebek (havuzu ETKINLIK yapıyor)
  yer('k12Kopek', 547, { yon: -1 });
  yer('k12Kedi', 489, { kurk: 'sarman', hal: 'gunes', yon: 1 });
  yer('k12Ogrenci', 468, { v: 4, poz: 'yuru', yon: 1 });
  yer('k12Ogrenci', 532, { v: 1, poz: 'otur', yon: -1 });
  yer('k12Kelebek', 515, { renk: 1 });
  // botanik 560–700 (YENİ; kaplumbağalar ve sera BOTANIK'in): kelebek bulutları, ispinozlar, kırlangıçlar, kirpi, sincap,
  // taş kabından su içen tekir, uzakta bahçede dolaşan bir öğrenci
  yer('k12KelebekBulut', 574, { n: 5 }); yer('k12KelebekBulut', 674, { n: 5 });   // (618: botanik havuzunun üstündeki küme kaldırıldı — balıkları örtüyordu)
  yer('k12Kus', 596, { n: 5, tur: 'ispinoz', x0: nx(565), x1: nx(640) });
  yer('k12Kirlangic', 640, { n: 2, x0: nx(575), x1: nx(698) });
  yer('k12Kirpi', 606, { yon: 1 });
  yer('k12Sincap', 684, { yon: -1 });   // ONPLAN'ın 686'daki ağacına tırmanır
  yer('k12Kedi', 664, { kurk: 'tekir', hal: 'su', yon: 1 });
  yer('k12Ogrenci', 630, { v: 3, poz: 'yuru', yon: -1, yay: 140 });
  // yol2 700–805 (bisiklet, yokuş): sincap, bisikletli öğrenci, kaçmayan serçeler, uzakta martı
  yer('k12Sincap', 728, { yon: 1 });
  yer('k12Ogrenci', 742, { v: 5, poz: 'bisiklet', yon: -1, yakin: 420 });
  yer('k12Ogrenci', 785, { v: 3, poz: 'yuru', yon: -1, yakin: 420 });
  yer('k12Kus', 770, { n: 3, kacmaz: true });
  yer('k12Marti', 760, { gy: 390 });
  // golet 805–1030 (su 830–1005; ördek, kuğu, kaz GOLET'in): martılar suyun üstünde, kıyıda kelebek, karşı kıyıda yürüyen öğrenci
  yer('k12Marti', 865, { gy: 410 }); yer('k12Marti', 930, { gy: 380 }); yer('k12Marti', 985, { gy: 400 });
  yer('k12Kelebek', 816, { renk: 0 });
  yer('k12Ogrenci', 1018, { v: 1, poz: 'yuru', yon: 1, yay: 90 });
  // tepe 1030–1100 (gün batımı, final 1070): yalnız bir kelebek ve uzakta martı; piknik sakin kalsın
  yer('k12Kelebek', 1042, { renk: 3 });
  yer('k12Marti', 1065, { gy: 370 });
}
if (typeof nesne === 'function' && typeof yuzey === 'function' && typeof nx === 'function') cnYerlestir();
else document.addEventListener('DOMContentLoaded', () => { try { cnYerlestir(); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('canli12.yerlesim', e); } });

// Test kancası (vlib12 ile): CANLI12.liste, CANLI12.dokun(o), CANLI12.isabet(wx, wy)
globalThis.CANLI12 = { CN, liste: CN.liste, dokun: o => CN_DOKUN[o.tip](o), isabet: cnIsabetBul,
  cizici: { kedi: cnKediCiz, kopek: cnKopekCiz, serce: cnSerceCiz, marti: cnMartiCiz, kelebek: cnKelebekCiz, sincap: cnSincapCiz, ogrenci: cnOgrenciCiz, ogr: CN_OGR, kirpi: cnKirpiCiz, kirlangic: cnKirlangicCiz, sukabi: cnSuKabi } };
})();
