/* kizak.js – Bölüm 7 (Kuzey Işıkları) kızak kayışı mini oyunu (önek kz), nesne türü 'kizakMini'.
   Kızak tepesinin ucunda ahşap, kırmızı bir kızak bekler. Feza yanına gelince içine atlar; yavru ren geyiği koşup koşumuna girer,
   kardan adam (kardan adam mini oyunu bittiyse) kendi küçük mavi kızağıyla arkaya bağlanır, Pırıl önde uçar. Ritim (~80 sn):
   KAY (orman, dalgalı tepeler, tümsekler) → rampa → UÇ 1 (geyiğin boynuzları/toynakları yanar, havada dörtnala, çam tepelerinin
   üstünde, bulut tülleri) → yumuşak iniş → KAY (buzlu göl, kardan tünel, buz köprüsü) → rampa → UÇ 2 (daha uzun ve yüksek: bulutlar,
   iki kuzey ışığı perdesinin içinden geçiş, aşağıda vadide minicik ışıklı kulübe) → KAY (tümsek dizisi) → büyük iniş.
   Tek kontrol iki modda: kayarken dokununca zıplar, uçarken dokununca yükselir (bırakınca süzülerek alçalır).
   Havada ve yolda kuzey ışığı renginde ışık taneleri ve kar kristalleri süzülür. Ekrana dokununca (ya da Boşluk/↑/W) kızak zıplar,
   basılı tutunca biraz daha yükselir, havadayken yeniden dokunmak küçük bir sıçrama daha verir; önündeki tane kızağı nazikçe kendi
   yüksekliğine çeker (mıknatıs). Yolda duran taneler kendiliğinden toplanır (ilk anlar hep ödüllü). Toplanan her tane göğe uçar,
   gökteki sönük kuzey ışıkları o noktada parlar ve yolculuk boyunca topladıkça belirginleşir (sayaç yerine gökyüzü: yazı yok).
   Her tanede kızak biraz hızlanır (yumuşak geçiş, azalan artış; kaçırınca düşmez) ve kısa bir "hız patlaması" görünür (rüzgâr
   çizgileri, kızak demirlerinden buz kıvılcımı, iri kar püskürmesi). Kaçan tane ceza değildir: yavaşça göğe süzülüp kaybolur.
   Hız hissi: üç katman paralaks (uzak ve orta karlı sırtlar, yol kenarı çamları, öndeki iri çamlar), hızla yatay çizgiye dönen
   kar taneleri, rüzgâr çizgileri, kızak ve toynaklardan kar püskürmesi, karda kayak izleri.
   Son ~10 sn: büyük iniş. Uzun, dik bir yokuş; geyik dörtnala, kuzey ışıkları tam parlak, ışık hızı çizgileri, yol boyu "kuzey
   kristalleri" kendiliğinden toplanır; yokuşun ucundaki kar rampasından büyük bir sıçrayış (sinematik yavaşlama) ve final tepesinin
   eteğine yumuşak iniş: kar bulutu patlaması, kızak kayarak durur, Feza iner, geyik sevinçle zıplar (V7.kizak, OLAY 'kizakBitti').
   Kaybetme, ceza, süre baskısı yok: ~12 sn dokunulmazsa sıradaki tane parlar ve Pırıl onun çevresinde döner; ~20 sn dokunulmazsa
   Pırıl taneleri kendisi toplar; uçuşlar ve büyük iniş her durumda gelir, yolculuk asla takılmaz (~80 sn).
   Sanal yol (halka.js gibi): haritadaki boşluk (339..470) 60 sn'lik hızlı kayışa yetmez. Yol, ağaçlar, taneler ve parçacıklar sanal
   yolda (v, sanal y) durur; dünyaya o.dx / o.dy kaymasıyla çizilir (dünya x = v + o.dx, dünya y = sanal y + o.dy). Kızağın dünya x'i
   (kzkEsle) başta ve sonda sanalla birebir (tepe ve iniş düzlüğü yola yapışık), ortada yavaş ilerler. o.dy, kızağın uzun vadeli
   inişini dünyada bir bantta tutar (kamera ve gök yerinde kalır; yol katmanı aşağı akar), sonda rampa dudağını iniş yüksekliğine getirir.
   Kızak yolculuğu boyunca kendi gökyüzü katmanlarını (kuzey ışığı, uzak/orta sırtlar) opak çizer: dunya7'nin boşluktaki tepeleri altta kalır.
   Fizik devralma: P.ucus = o, motor her adımda o.adim(dt, OM_UCUS_GIRDI) çağırır; Feza, Pırıl, geyik ve kardan adamı bu dosya çizer
   (dünyadaki geyik P.ucus sırasında gizlenir; kardan adam takipçisine KIZAK.kardanBende() bakılabilir).
   Kamera: oyun.js uçuş kamerası BOLUM.kizak koridorunu okur; yolculuk süresince yUst/yAlt kızağın yumuşatılmış yüksekliğini izler
   (bitince asıl değerlere döner).
   Yerleşim (bolum7.js): nesne('kizakMini', c, yuzey(c), { inisX, inisY }) ya da aynı alanlar BOLUM.kizak içinde (inisX yoksa x1, o da
   yoksa o.x + 140 kare). Olaylar: kizakBasla {o, top}, kizakZipla {o, hava}, kizakTane {n, top, x, y, kim, tip, o}, kizakKacti {o},
   kizakUc {n} (her uçuşun kalkışı), kizakIn {n} (uçuştan sonra kara konuş), kizakPerde {i} (kuzey ışığı perdesinden geçiş),
   kizakHiz (büyük iniş başladı), kizakKristal {i, top} (büyük inişin kendiliğinden toplanan kristalleri), kizakFinalSicrama,
   kizakInis {o, buyuk}, kizakBitti {o, n, top, sure}. Bitince: V7.kizak = true, o.done, o.skl.bitti (kapi.js uyumu).
   Karede gradyan/filtre yok: bütün çizimler ilk kullanımda önbelleğe alınır; parçacıklar sabit havuzlarda. */
'use strict';
const KZK_BINIS = 1.9, KZK_INIS = 2.1, KZK_SIC = 2.8;     // biniş, iniş (kayıp durma + Feza'nın inişi), final sıçrayışı (sn)
const KZK_LY = 36000, KZK_LF = 6000;                     // sanal yol: oyun bölümü (iki uçuş dahil), büyük iniş (birim)
const KZK_V0 = 350, KZK_V1 = 425, KZK_VF = 1040;          // kayış hızı: taban (başta → oyun sonunda), büyük inişte (birim/sn)
const KZK_HB = 12, KZK_HBMAX = 200, KZK_HB_K = 5;         // her tanede hız artışı (azalarak, en çok +200); ~0,6 sn'de yumuşak geçiş
const KZK_A0 = 520, KZK_B0 = 700, KZK_B1 = 800, KZK_E = 1150;   // sanal→dünya eşlemesi: baştaki/sondaki birebir parça ve geçişler
const KZK_IPUCU = 12, KZK_YARDIM = 20;                   // dokunulmadan geçen süre: ipucu / Pırıl kendisi toplar
const KZK_KOLTUK = 20, KZK_SEDX = -6;                    // kızak demirinin altından oturma noktasına; oturma noktasının x kayması
const KZK_GOVDE = 24, KZK_TOL = 60;                      // oturma noktasından göğse (tane denetim noktası); dikey tolerans (cömert)
const KZK_GON = 106, KZK_KAR = 150;                      // geyik önde, kardan adamın kızağı arkada (sanal birim)
const KZK_ADIM = 10;                                    // yol profili tablosunun adımı
const KZK_G = 1350, KZK_ZIP = 560, KZK_HOP = 300;         // yerçekimi, zıplama hızı, havada ek sıçrama
const KZK_GS = 1;                                       // geyikCiz ölçeği (s = 1'de sırt ≈ 44, Feza 60)
const KZK_KOPRU = [19400, 20200], KZK_TUNEL = [17400, 18700], KZK_ORMAN = [2600, 5600], KZK_GOL = [14700, 16900];
// uçuşlar: [kalkış, iniş, yay (göğe yükselme), vadi (yerin alçalması)]. İkincisi daha uzun ve yüksek: bulutlar, kuzey ışığı perdeleri, kulübe.
const KZK_UCUS = [[7000, 14000, 250, 330], [21500, 31500, 330, 430]];
const KZK_PERDE = [25300, 28400], KZK_KULUBE = 29300, KZK_DALGA = 1.3;
const KZK_UC_UST = 150, KZK_UC_ALT = -90;               // uçuşta yükseklik payı (uçuş şeridine göre): dokununca yükselir, bırakınca süzülerek alçalır
const KZK_TAVAN = 196, KZK_TUNEL_H = 104;                // tünel tavanı (yoldan), tünelde en çok yükseklik
const KZK_REN = ['#8dffc8', '#ff9fd8', '#c4a6ff', '#9fe6ff'];
const KZK_TOZ = ['#f2fbff', '#8dffc8', '#ff9fd8', '#c4a6ff', '#9fe6ff'];
// yol profili: inişler [başla, bitir, düşüş] ve tümsekler [orta, yarı genişlik, yükseklik] (sanal y aşağı artı; düşüş < 0 = rampa)
// Akış: KAY (orman, tümsekler) → rampa → UÇ 1 (çam tepeleri) → KAY (buzlu göl, kardan tünel, buz köprüsü) → rampa → UÇ 2 (bulutlar,
// kuzey ışığı perdeleri, kulübe) → KAY (tümsek dizisi) → büyük iniş.
const KZK_INISLER = [[260, 1500, 330], [1950, 2700, 170], [3100, 3900, 160], [4300, 4800, 70], [5100, 5700, 90], [6000, 6400, 120], [6450, 7000, -110],
  [14000, 14600, 120], [16900, 17300, 80], [18800, 19300, 120], [20300, 20800, 140], [20900, 21500, -120],
  [31500, 32200, 130], [34800, 35600, 170]];
const KZK_TUMSEK = [[1850, 240, 55], [2950, 250, 70], [4100, 200, 45], [4950, 220, 55], [19800, 420, 12],
  [32700, 190, 50], [33150, 190, 55], [33600, 200, 60], [34050, 190, 55], [34500, 200, 60]];
// taneler: [sanal konum, yükseklik (göğsün üstü; 0 = yolda; uçuşta uçuş şeridine göre, eksi = aşağıda), tür t tane | k kristal]
const KZK_TANE = [
  [900, 0, 't'], [1040, 0, 't'], [1180, 0, 't'], [1320, 0, 't'], [2010, 70, 't'], [2180, 105, 't'], [2350, 75, 't'], [3150, 0, 't'], [3300, 0, 't'],
  [3600, 90, 't'], [4250, 110, 'k'], [4500, 0, 't'], [4650, 0, 't'], [5050, 100, 't'], [5300, 70, 't'], [5850, 0, 't'], [6000, 0, 't'], [6600, 0, 't'], [6750, 0, 't'],
  [7600, 40, 't'], [7800, 80, 't'], [8000, 120, 't'], [8200, 80, 't'], [9000, -40, 't'], [9200, -60, 't'], [9400, -40, 't'], [10200, 100, 'k'],
  [11000, 60, 't'], [11200, 110, 't'], [11400, 150, 't'], [12400, 20, 't'], [12600, -30, 't'], [13200, 0, 't'],
  [14400, 0, 't'], [14550, 0, 't'], [15000, 0, 't'], [15150, 0, 't'], [15300, 0, 't'], [15700, 90, 't'], [16100, 0, 't'], [16250, 0, 't'], [16500, 110, 'k'],
  [17700, 0, 't'], [17900, 25, 't'], [18100, 0, 't'], [18300, 25, 't'], [19600, 100, 't'], [19800, 145, 'k'], [20000, 100, 't'],
  [20600, 0, 't'], [20750, 0, 't'], [21100, 0, 't'], [21300, 0, 't'],
  [22200, 60, 't'], [22400, 100, 't'], [22600, 140, 't'], [23600, -40, 't'], [23800, -70, 't'], [24500, 120, 'k'], [25500, 30, 't'], [25700, 80, 't'],
  [25900, 130, 't'], [26300, 40, 'k'], [27000, -50, 't'], [27200, -20, 't'], [27400, 20, 't'], [28400, 60, 'k'], [29200, 100, 't'], [29400, 60, 't'],
  [29600, 20, 't'], [30400, 0, 't'], [30800, -20, 't'],
  [32000, 0, 't'], [32150, 0, 't'], [32800, 85, 't'], [33250, 95, 't'], [33700, 105, 'k'], [34150, 95, 't'], [34600, 85, 't'], [35200, 0, 't'], [35350, 0, 't'], [35700, 110, 't']];
const KZK_TOP = KZK_TANE.length;
const KZK_KRIS = 10, KZK_KRIS_V = 700, KZK_KRIS_ARA = 470;     // büyük iniş: kendiliğinden toplanan kuzey kristalleri
const KIZAK = {
  o: null, aktif() { return !!this.o && P.ucus === this.o; }, baslat(o) { o = o || this.o; if (o) kzkBasla(o); return o; },
  kayma() { const o = this.o; return o && o.K && P.ucus === o ? o.K.xs - o.dx : 0; },   // yol katmanının dünyaya göre fazladan kayması
  hiz() { return this.o ? this.o.spd || 0 : 0; }, faz() { return this.o ? this.o.faz : null; },
  isik() { return this.o ? this.o.isik || 0 : 0; },        // kızaktaki kuzey ışıklarının parlaklığı (0..1)
  ortu() { return this.o ? this.o.parA || 0 : 0; },        // kızak manzarasının dünyayı örtme oranı (dunya7 boşluk tepelerini soldurabilir)
  geyikBende() { const o = this.o; return !!o && P.ucus === o; },
  kardanBende() { const o = this.o; return !!o && P.ucus === o && !!o.kardanVar; },
  geyikYer() { const o = this.o; return o ? { x: o.gx, y: o.gyW, yon: 1 } : null; },
  kardanYer() { const o = this.o; return o ? { x: o.kax, y: o.kay, yon: 1 } : null; }
};

function kzkSfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }

// ── önbellekli çizimler (yalnız ilk kullanımda üretilir) ──
const kzkArts = {};
function kzkTuval(w, h, olc) { const c = document.createElement('canvas'); c.width = Math.ceil(w * olc); c.height = Math.ceil(h * olc); const q = c.getContext('2d'); q.scale(olc, olc); return [c, q]; }
function kzkTaneArt(ci) {   // ışık tanesi: 28×28 birim (merkez 14,14): hâle + parlak çekirdek + dört köşeli parıltı
  const k = 't' + ci; if (kzkArts[k]) return kzkArts[k];
  const [c, q] = kzkTuval(28, 28, 3); q.translate(14, 14);
  const col = KZK_REN[ci];
  let gr = q.createRadialGradient(0, 0, 0, 0, 0, 14); gr.addColorStop(0, col); gr.addColorStop(0.35, col); gr.addColorStop(1, 'rgba(255,255,255,0)');
  q.globalAlpha = 0.55; q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 14, 0, 6.2832); q.fill(); q.globalAlpha = 1;
  gr = q.createRadialGradient(-1.5, -1.5, 0, 0, 0, 6.5); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#ffffff'); gr.addColorStop(1, col);
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 6, 0, 6.2832); q.fill();
  q.fillStyle = 'rgba(255,255,255,.95)';
  q.beginPath(); q.moveTo(0, -13); q.quadraticCurveTo(1, -1, 13, 0); q.quadraticCurveTo(1, 1, 0, 13); q.quadraticCurveTo(-1, 1, -13, 0); q.quadraticCurveTo(-1, -1, 0, -13); q.fill();
  return kzkArts[k] = c;
}
function kzkKristalArt(ci) {   // kar kristali: 48×48 birim (merkez 24,24), altı kollu, dallı; buz beyazı + renkli hâle
  const k = 'k' + ci; if (kzkArts[k]) return kzkArts[k];
  const [c, q] = kzkTuval(48, 48, 3); q.translate(24, 24);
  const col = KZK_REN[ci];
  const gr = q.createRadialGradient(0, 0, 0, 0, 0, 24); gr.addColorStop(0, col); gr.addColorStop(0.4, col); gr.addColorStop(1, 'rgba(255,255,255,0)');
  q.globalAlpha = 0.45; q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 24, 0, 6.2832); q.fill(); q.globalAlpha = 1;
  q.lineCap = 'round';
  for (const [w, s] of [[4.2, col], [2, '#ffffff']]) {
    q.strokeStyle = s; q.lineWidth = w;
    for (let i = 0; i < 6; i++) {
      q.save(); q.rotate(i * Math.PI / 3); q.beginPath();
      q.moveTo(0, 0); q.lineTo(0, -16);
      q.moveTo(0, -7); q.lineTo(-4.5, -11); q.moveTo(0, -7); q.lineTo(4.5, -11);
      q.moveTo(0, -12); q.lineTo(-3, -15); q.moveTo(0, -12); q.lineTo(3, -15);
      q.stroke(); q.restore();
    }
  }
  q.fillStyle = '#ffffff'; q.beginPath(); q.arc(0, 0, 3.2, 0, 6.2832); q.fill();
  return kzkArts[k] = c;
}
function kzkTozArt(ci) {   // parıltı yıldızı: 24×24 birim (merkez 12,12)
  const k = 'z' + ci; if (kzkArts[k]) return kzkArts[k];
  const [c, q] = kzkTuval(24, 24, 2); q.translate(12, 12);
  const col = KZK_TOZ[ci];
  const gr = q.createRadialGradient(0, 0, 0, 0, 0, 12); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,255,255,0)');
  q.globalAlpha = 0.45; q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 12, 0, 6.2832); q.fill(); q.globalAlpha = 1;
  const yz = (r, f) => { q.fillStyle = f; q.beginPath(); q.moveTo(0, -r); q.quadraticCurveTo(r * 0.14, -r * 0.14, r, 0); q.quadraticCurveTo(r * 0.14, r * 0.14, 0, r); q.quadraticCurveTo(-r * 0.14, r * 0.14, -r, 0); q.quadraticCurveTo(-r * 0.14, -r * 0.14, 0, -r); q.fill(); };
  yz(8, col); yz(4, '#fffdf6');
  return kzkArts[k] = c;
}
function kzkPufArt() {   // yumuşak kar bulutçuğu: 32×32 birim
  if (kzkArts.puf) return kzkArts.puf;
  const [c, q] = kzkTuval(32, 32, 2); q.translate(16, 16);
  const gr = q.createRadialGradient(-2, -3, 0, 0, 0, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(240,244,255,.85)'); gr.addColorStop(0.75, 'rgba(214,222,250,.4)'); gr.addColorStop(1, 'rgba(200,210,245,0)');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 16, 0, 6.2832); q.fill();
  return kzkArts.puf = c;
}
function kzkKizakArt(tur) {   // kızak (yandan, sağa bakar): 120×70 birim, köken (60,56) = demirin altı ortası. arka: Feza'nın arkası, on: önü
  const k = 'kz' + tur; if (kzkArts[k]) return kzkArts[k];
  const kirmizi = tur === 0, ana = kirmizi ? '#d9454f' : '#4f86d6', koyu = kirmizi ? '#9e2b3a' : '#2f5aa3', acik = kirmizi ? '#ff8a86' : '#9cc6ff';
  const tahta = '#c48a55', tahtaK = '#8e5a33', demir = '#e9d7b8', demirK = '#a8906e';
  const mk = () => { const r = kzkTuval(120, 70, 3); r[1].translate(60, 56); return r; };
  const [ca, a] = mk(), [co, f] = mk();
  // ARKA: uzak demir (gölgede), uzak dikmeler, oturak tahtası, sırtlık
  a.save(); a.translate(5, -4); a.globalAlpha = 0.75;
  a.strokeStyle = demirK; a.lineWidth = 3.4; a.lineCap = 'round';
  a.beginPath(); a.moveTo(-44, -1.5); a.lineTo(36, -1.5); a.quadraticCurveTo(52, -2, 50, -16); a.quadraticCurveTo(48, -26, 41, -24); a.stroke();
  a.fillStyle = tahtaK; for (const x of [-30, -6, 18]) a.fillRect(x - 2, -10, 4, 9);
  a.restore();
  a.fillStyle = tahtaK; a.beginPath(); a.roundRect ? a.roundRect(-40, -22, 70, 6, 2) : a.rect(-40, -22, 70, 6); a.fill();
  a.fillStyle = tahta; a.fillRect(-38, -22, 66, 3);
  // sırtlık: yuvarlak tepeli kırmızı tahta + altın kenar
  a.fillStyle = koyu; a.beginPath(); a.moveTo(-46, -12); a.lineTo(-48, -40); a.quadraticCurveTo(-46, -50, -36, -48); a.lineTo(-33, -16); a.closePath(); a.fill();
  a.fillStyle = ana; a.beginPath(); a.moveTo(-44, -14); a.lineTo(-46, -39); a.quadraticCurveTo(-44.5, -46.5, -37.5, -45.5); a.lineTo(-35, -17); a.closePath(); a.fill();
  a.strokeStyle = '#ffd68a'; a.lineWidth = 1.3; a.beginPath(); a.moveTo(-46, -39); a.quadraticCurveTo(-44.5, -46.5, -37.5, -45.5); a.stroke();
  // ÖN: yakın dikmeler, yan tahta (tahta çizgili, altın süs şeridi, beyaz kar tanesi resmi), yakın demir ve öndeki kıvrım
  f.fillStyle = tahtaK; for (const x of [-30, -6, 18]) { f.fillRect(x - 2.4, -8, 4.8, 8); }
  f.fillStyle = koyu; f.beginPath(); f.moveTo(-44, -31); f.lineTo(30, -31); f.quadraticCurveTo(44, -30, 46, -18); f.quadraticCurveTo(44, -6, 34, -5); f.lineTo(-42, -5); f.quadraticCurveTo(-46, -5, -46, -9); f.lineTo(-46, -28); f.quadraticCurveTo(-46, -31, -44, -31); f.closePath(); f.fill();
  f.fillStyle = ana; f.beginPath(); f.moveTo(-43, -29); f.lineTo(30, -29); f.quadraticCurveTo(42, -28, 43.5, -18); f.quadraticCurveTo(42, -8, 33, -7); f.lineTo(-41, -7); f.quadraticCurveTo(-44, -7, -44, -10); f.lineTo(-44, -27); f.closePath(); f.fill();
  f.strokeStyle = koyu; f.globalAlpha = 0.5; f.lineWidth = 0.9; f.beginPath();
  for (const y of [-21.5, -14.5]) { f.moveTo(-43, y); f.lineTo(38, y); }
  f.stroke(); f.globalAlpha = 1;
  f.fillStyle = acik; f.globalAlpha = 0.55; f.fillRect(-42, -28.5, 72, 2.2); f.globalAlpha = 1;
  f.strokeStyle = '#ffd68a'; f.lineWidth = 1.4; f.beginPath(); f.moveTo(-44, -29.5); f.lineTo(30, -29.5); f.quadraticCurveTo(42, -28.5, 43.5, -18); f.stroke();
  // kar tanesi resmi (beyaz)
  f.save(); f.translate(-8, -18); f.strokeStyle = '#fff6ef'; f.lineWidth = 1.3; f.lineCap = 'round'; f.beginPath();
  for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3, cx = Math.cos(an), sy = Math.sin(an); f.moveTo(0, 0); f.lineTo(cx * 6, sy * 6); f.moveTo(cx * 3.6 - sy * 1.6, sy * 3.6 + cx * 1.6); f.lineTo(cx * 4.4, sy * 4.4); }
  f.stroke(); f.restore();
  for (const x of [-36, 20]) { f.fillStyle = '#fff6ef'; f.beginPath(); f.arc(x, -18, 2.2, 0, 6.2832); f.fill(); f.fillStyle = acik; f.beginPath(); f.arc(x, -18, 1.2, 0, 6.2832); f.fill(); }
  // altın perçinler
  f.fillStyle = '#ffd68a'; for (const x of [-40, -24, 8, 28]) { f.beginPath(); f.arc(x, -9.5, 1, 0, 6.2832); f.fill(); }
  // yakın demir: altta düz, önde yukarı kıvrılan sarmal uç
  f.lineCap = 'round'; f.strokeStyle = demirK; f.lineWidth = 4.2;
  f.beginPath(); f.moveTo(-46, -1.6); f.lineTo(36, -1.6); f.quadraticCurveTo(54, -2, 52, -18); f.quadraticCurveTo(50, -30, 41, -28); f.quadraticCurveTo(36, -26, 39, -22); f.stroke();
  f.strokeStyle = demir; f.lineWidth = 2.2;
  f.beginPath(); f.moveTo(-46, -2.2); f.lineTo(36, -2.2); f.quadraticCurveTo(53, -2.6, 51, -18); f.quadraticCurveTo(49, -29, 41.5, -27.4); f.stroke();
  f.strokeStyle = 'rgba(255,255,255,.75)'; f.lineWidth = 0.8; f.beginPath(); f.moveTo(-40, -3); f.lineTo(30, -3); f.stroke();
  f.fillStyle = '#ffd68a'; f.beginPath(); f.arc(39, -22, 1.8, 0, 6.2832); f.fill();
  return kzkArts[k] = { arka: ca, on: co };
}
function kzkCamArt(k) {   // çam: 120×220 birim (gövde tabanı 60,214). k 0..2 yol kenarı çeşitleri, 3 öndeki koyu çam
  const ad = 'cam' + k; if (kzkArts[ad]) return kzkArts[ad];
  const [c, q] = kzkTuval(120, 220, k === 3 ? 1.6 : 1.4); q.translate(60, 214);
  const r = rng(911 + k * 37);
  const yap = k === 3 ? ['#1a2244', '#232d55', '#d4dcf5', '#a9b5e2'] : k === 1 ? ['#2a3c66', '#345082', '#eef3ff', '#b9c6ec'] : ['#26385e', '#304a78', '#e9f0ff', '#b3c0e8'];
  q.fillStyle = '#3a2c3c'; q.fillRect(-5, -26, 10, 26);
  const kat = k === 3 ? 6 : 5 + (k % 2);
  for (let i = 0; i < kat; i++) {
    const u = i / (kat - 1), w = lerp(54, 14, u) * (0.92 + r() * 0.12), yb = lerp(-20, -176, u), h = lerp(56, 40, u);
    q.fillStyle = yap[0]; q.beginPath(); q.moveTo(-w, yb); q.quadraticCurveTo(-w * 0.4, yb - h * 0.45, 0, yb - h); q.quadraticCurveTo(w * 0.4, yb - h * 0.45, w, yb);
    q.quadraticCurveTo(0, yb + 8, -w, yb); q.fill();
    q.fillStyle = yap[1]; q.beginPath(); q.moveTo(0, yb - h); q.quadraticCurveTo(w * 0.4, yb - h * 0.45, w, yb); q.quadraticCurveTo(w * 0.5, yb + 4, 0, yb + 3); q.fill();
    // kat üstündeki kar yastığı (sarkık uçlu)
    q.fillStyle = yap[3]; q.beginPath(); q.moveTo(-w * 0.92, yb - 1); q.quadraticCurveTo(-w * 0.45, yb - h * 0.42 - 2, 0, yb - h + 2);
    q.quadraticCurveTo(w * 0.45, yb - h * 0.42 - 2, w * 0.95, yb - 1); q.quadraticCurveTo(w * 0.7, yb - h * 0.2, w * 0.35, yb - h * 0.28);
    q.quadraticCurveTo(0, yb - h * 0.18, -w * 0.4, yb - h * 0.3); q.quadraticCurveTo(-w * 0.7, yb - h * 0.16, -w * 0.92, yb - 1); q.fill();
    q.fillStyle = yap[2]; q.beginPath(); q.moveTo(-w * 0.85, yb - 4); q.quadraticCurveTo(-w * 0.45, yb - h * 0.45, 0, yb - h + 1);
    q.quadraticCurveTo(w * 0.3, yb - h * 0.55, w * 0.55, yb - h * 0.33); q.quadraticCurveTo(w * 0.2, yb - h * 0.3, -w * 0.3, yb - h * 0.34); q.quadraticCurveTo(-w * 0.6, yb - h * 0.2, -w * 0.85, yb - 4); q.fill();
    for (let j = 0; j < 3; j++) { const x = (r() - 0.5) * w * 1.3, y = yb - 2 + r() * 3; q.beginPath(); q.ellipse(x, y, 3 + r() * 3, 2, 0, 0, 6.2832); q.fill(); }
  }
  q.fillStyle = yap[2]; q.beginPath(); q.arc(0, -178 - 40, 4, 0, 6.2832); q.fill();
  return kzkArts[ad] = c;
}
function kzkTepeArt(k) {   // paralaks karlı sırt şeridi (döşenebilir): 1600 birim geniş. k 0 uzak, 1 orta. { c, w, h, sirt, alt }
  const ad = 'tepe' + k; if (kzkArts[ad]) return kzkArts[ad];
  const W = 1600, H = k ? 330 : 300, olc = k ? 1.2 : 1, [c, q] = kzkTuval(W, H, olc), r = rng(4040 + k * 77), P2 = 6.2832 / W;
  const sirt = k ? x => 120 + 34 * Math.sin(x * P2 * 2 + 0.7) + 22 * Math.sin(x * P2 * 5 + 2.1) + 9 * Math.sin(x * P2 * 13 + 0.3)
    : x => 110 + 46 * Math.sin(x * P2 * 1 + 1.1) + 26 * Math.sin(x * P2 * 4 + 0.4) + 12 * Math.sin(x * P2 * 9 + 2.6);
  const renk = k ? ['#8592cf', '#cdd5f4', '#9aa6dc', '#3c4f86', '#e8eeff'] : ['#454c8c', '#7f88c6', '#4f5899', '#2e3470', '#a3abdc'];
  const gr = q.createLinearGradient(0, 40, 0, H); gr.addColorStop(0, renk[0]); gr.addColorStop(1, renk[2]);
  q.fillStyle = gr; q.beginPath(); q.moveTo(0, H); for (let x = 0; x <= W; x += 8) q.lineTo(x, sirt(x)); q.lineTo(W, H); q.closePath(); q.fill();
  // kar tepesi: sırtın hemen altındaki açık bant (sola bakan yamaçlarda daha geniş)
  q.fillStyle = renk[1]; q.beginPath(); q.moveTo(0, sirt(0));
  for (let x = 0; x <= W; x += 8) q.lineTo(x, sirt(x));
  for (let x = W; x >= 0; x -= 8) { const e = sirt(x + 8) - sirt(x); q.lineTo(x, sirt(x) + 5 + clamp(e, 0, 6) * (k ? 4 : 3)); }
  q.closePath(); q.fill();
  // çam siluetleri (sırt boyunca; dikiş yerinde iki kez çizilir)
  const cam = (x, y, s) => {
    q.fillStyle = renk[3]; q.beginPath(); q.moveTo(x, y - 30 * s);
    for (let i = 0; i < 3; i++) { const yy = y - 30 * s + (i + 1) * 9 * s, w = (4 + i * 3.4) * s; q.lineTo(x + w, yy); q.lineTo(x + w * 0.45, yy - 2 * s); }
    q.lineTo(x + 2 * s, y); q.lineTo(x - 2 * s, y);
    for (let i = 2; i >= 0; i--) { const yy = y - 30 * s + (i + 1) * 9 * s, w = (4 + i * 3.4) * s; q.lineTo(x - w * 0.45, yy - 2 * s); q.lineTo(x - w, yy); }
    q.closePath(); q.fill();
    if (k) { q.fillStyle = renk[4]; q.beginPath(); q.moveTo(x, y - 30 * s); q.lineTo(x + 3 * s, y - 24 * s); q.lineTo(x - 3 * s, y - 24 * s); q.fill(); }
  };
  for (let x = 6; x < W; x += (k ? 26 : 15) + r() * (k ? 46 : 24)) {
    if (r() < 0.3) continue;
    const s = (k ? 1.1 : 0.55) + r() * (k ? 0.9 : 0.5), y = sirt(x) + 8 + r() * 10;
    cam(x, y, s); if (x < 40) cam(x + W, y, s); if (x > W - 40) cam(x - W, y, s);
  }
  // uzakta parlayan minik kulübe pencereleri yerine: orta şeritte birkaç kar yığını parıltısı
  q.fillStyle = 'rgba(255,255,255,.5)';
  for (let i = 0; i < 40; i++) { const x = r() * W, y = sirt(x) + 14 + r() * (H - sirt(x) - 20); q.fillRect(x, y, 1.4, 1.4); }
  return kzkArts[ad] = { c, w: W, h: H, sirt: 110, alt: renk[2] };
}
function kzkAuroraArt(k) {   // kuzey ışığı sütunu (dunya7 ile aynı dil): altta parlak yumuşak kenar, yukarı sönen ışık; yanları yumuşak
  const ad = 'au' + k; if (kzkArts[ad]) return kzkArts[ad];   // komşu dilimler ×3 üst üste biner → keskin kenarsız, sürekli kurdele
  const c = document.createElement('canvas'); c.width = 48; c.height = 160; const q = c.getContext('2d');
  const [alt, orta, ust] = [['#7dffc4', '#6fe8ff', '#b48cff'], ['#ff8fd0', '#c39bff', '#8f8cff'], ['#8fd8ff', '#a6ffde', '#c39bff']][k];
  let gr = q.createLinearGradient(0, 0, 0, 160);
  gr.addColorStop(0, kzkRgba(ust, 0)); gr.addColorStop(0.3, kzkRgba(ust, 0.28)); gr.addColorStop(0.55, kzkRgba(orta, 0.5));
  gr.addColorStop(0.8, kzkRgba(alt, 0.95)); gr.addColorStop(0.87, kzkRgba(alt, 1)); gr.addColorStop(0.93, kzkRgba(alt, 0.45)); gr.addColorStop(1, kzkRgba(alt, 0));
  q.fillStyle = gr; q.fillRect(0, 0, 48, 160);
  q.globalCompositeOperation = 'destination-in'; gr = q.createLinearGradient(0, 0, 48, 0);
  gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(0.28, 'rgba(0,0,0,.45)'); gr.addColorStop(0.5, 'rgba(0,0,0,1)'); gr.addColorStop(0.72, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  q.fillStyle = gr; q.fillRect(0, 0, 48, 160);
  return kzkArts[ad] = c;
}
function kzkRgba(h, a) { const n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')'; }

// ── sanal yol: dünya x eşlemesi, profil, dikey kayma ──
function kzkEsle(K, v) {   // sanal yol uzunluğu → kızağın dünya x'i (K.xs'ten itibaren). Başta ve sonda eğim 1, ortada K.r.
  if (v <= 0) return v;
  if (K.lin) return v * K.lin;
  const r = K.r;
  if (v <= KZK_A0) return v;
  if (v <= KZK_A0 + KZK_B0) { const u = (v - KZK_A0) / KZK_B0; return KZK_A0 + KZK_B0 * (u + (r - 1) * (u * u * u - u * u * u * u / 2)); }
  const X1 = KZK_A0 + KZK_B0 * (1 + r) / 2, v1 = KZK_A0 + KZK_B0, v2 = K.vE - KZK_B1;
  if (v <= v2) return X1 + r * (v - v1);
  const X2 = X1 + r * (v2 - v1);
  if (v <= K.vE) { const u = (v - v2) / KZK_B1; return X2 + KZK_B1 * (r * u + (1 - r) * (u * u * u - u * u * u * u / 2)); }
  return X2 + KZK_B1 * (1 + r) / 2 + (v - K.vE);
}
function kzkTablo(A, v) { if (v <= 0) return A[0]; const f = v / KZK_ADIM, i = f | 0; if (i >= A.length - 1) return A[A.length - 1]; const u = f - i; return A[i] + (A[i + 1] - A[i]) * u; }
function kzkP(o, v) { return o.y0 + kzkTablo(o.Pf, v); }      // sanal y: yolun üst kenarı
function kzkDY(o, v) { return kzkTablo(o.DY, v); }           // kızak v'deyken yol katmanının dikey kayması
function kzkY(o, v) { return kzkP(o, v) + o.dy; }            // şu anki karede yolun dünya y'si
function kzkUcus(v) { for (const u of KZK_UCUS) if (v >= u[0] && v < u[1]) return u; return null; }
function kzkLane(o, v) { return o.y0 + kzkTablo(o.LN, v); }   // uçuş şeridi (sanal y): kızağın uçuşta süzüldüğü yol
function kzkGolde(v) { return v > KZK_GOL[0] && v < KZK_GOL[1]; }
function kzkKopruda(v) { return v > KZK_KOPRU[0] && v < KZK_KOPRU[1]; }
function kzkTunelde(v) { return v > KZK_TUNEL[0] + 40 && v < KZK_TUNEL[1] - 40; }
function kzkProfilKur(o) {
  const K = o.K, n = Math.ceil((K.vJ + 800) / KZK_ADIM) + 2, Pf = new Float32Array(n), LN = new Float32Array(n), Yol = new Float32Array(n), DY = new Float32Array(n);
  const fA = K.Ly + 150, fB = K.vJ - 900;
  let taban = 0;
  for (let i = 0; i < n; i++) {
    const v = i * KZK_ADIM; let y = 0;
    if (v > 260 && !kzkGolde(v)) taban += 0.06 * KZK_ADIM * smooth(clamp((v - 260) / 900, 0, 1));   // hep hafif iniş (gölde düz)
    y += taban;
    for (const [a0, b0, h] of KZK_INISLER) y += h * KZK_DALGA * smooth(clamp((v - a0) / (b0 - a0), 0, 1));
    for (const [c, w, h] of KZK_TUMSEK) if (Math.abs(v - c) < w) y -= h * (w > 400 ? 1 : KZK_DALGA) * 0.5 * (1 + Math.cos(Math.PI * (v - c) / w));
    for (const [a0, b0, , vadi] of KZK_UCUS) y += vadi * (smooth(clamp((v - a0) / 1600, 0, 1)) - smooth(clamp((v - (b0 - 1700)) / 1600, 0, 1)));   // uçuşta yer alçalır (vadi)
    y += 950 * smooth(clamp((v - fA) / (fB - fA), 0, 1));                 // büyük iniş: uzun, dik yokuş
    y -= 95 * smooth(clamp((v - (K.vJ - 700)) / 640, 0, 1));              // ucunda kar rampası (dudak)
    if (v > K.vJ) y += Math.min(160, Math.pow((v - K.vJ) / 40, 2) * 8);   // rampanın ardı: yuvarlak düşüş
    Pf[i] = y;
  }
  // uçuş şeridi: kalkış dudağından iniş yerinin biraz üstüne, ortada göğe doğru yay. Kızağın izlediği yol (Yol) eğilim hesabına girer.
  for (let i = 0; i < n; i++) { LN[i] = Pf[i]; Yol[i] = Pf[i]; }
  for (const [a0, b0, yay] of KZK_UCUS) {
    const ia = Math.round(a0 / KZK_ADIM), ib = Math.min(n - 1, Math.round(b0 / KZK_ADIM)), ya = Pf[ia], yb = Pf[ib] - 26;
    for (let i = ia; i <= ib; i++) { const u = (i - ia) / (ib - ia), ark = yay * Math.pow(Math.sin(Math.PI * u), 0.75); LN[i] = lerp(ya, yb, smooth(u) * 0.3 + u * 0.7) - ark; Yol[i] = LN[i] + ark * 0.55; }
  }
  // uzun vadeli eğilim: ±1100 birimlik kayan ortalama (rampa dudağına kadar)
  const S = new Float64Array(n + 1); for (let i = 0; i < n; i++) S[i + 1] = S[i] + Yol[i];
  const W = 110, iS = Math.min(n - 1, Math.round(K.vJ / KZK_ADIM)), Ts = new Float32Array(n);
  for (let i = 0; i < n; i++) { const a = Math.max(0, Math.min(i, iS) - W), b = Math.min(iS, i + W); Ts[i] = (S[b + 1] - S[a]) / (b - a + 1); }
  // dikey kayma: başta 0 (tepeye yapışık), ortada kızak dünyada bir bantta kalır, sonda rampa dudağı iniş yüksekliğine gelir
  const y0 = o.y0, lip = K.gy - 40, Bf = v => y0 + (lip - y0) * smooth(clamp(v / K.vJ, 0, 1));
  for (let i = 0; i < n; i++) { const v = i * KZK_ADIM, w = smooth(clamp((v - 300) / 1400, 0, 1)); DY[i] = w * (Bf(v) - (y0 + Ts[i])); }
  const iJ = Math.round(K.vJ / KZK_ADIM), cor = lip - (y0 + Pf[iJ] + DY[iJ]);
  for (let i = 0; i < n; i++) { const v = i * KZK_ADIM; DY[i] += cor * smooth(clamp((v - (K.vJ - 3500)) / 3000, 0, 1)); }
  o.Pf = Pf; o.LN = LN; o.DY = DY;
}
const KZK_KARN = 240, kzkKar = []; for (let i = 0; i < KZK_KARN; i++) kzkKar.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, s: 1, g: 300, a: 1 });
let kzkKarI = 0;
const KZK_TOZN = 220, kzkToz = []; for (let i = 0; i < KZK_TOZN; i++) kzkToz.push({ x: 0, y: 0, vx: 0, vy: 0, l: 0, m: 1, c: 0, s: 1, g: 40 });
let kzkTozI = 0;
function kzkDX() { return KIZAK.o ? KIZAK.o.dx || 0 : 0; }
function kzkDYc() { return KIZAK.o ? KIZAK.o.dy || 0 : 0; }
function kzkKarAt(wx, wy, vx, vy, life, s, gr, a) { const p = kzkKar[kzkKarI]; kzkKarI = (kzkKarI + 1) % KZK_KARN; p.x = wx - kzkDX(); p.y = wy - kzkDYc(); p.vx = vx; p.vy = vy; p.l = p.m = life; p.s = s; p.g = gr === undefined ? 300 : gr; p.a = a === undefined ? 1 : a; }
function kzkKarPatla(x, y, n, hiz, vxEk, s0) {
  for (let i = 0; i < n; i++) { const an = Math.PI + Math.random() * Math.PI, v = hiz * (0.3 + Math.random() * 0.8); kzkKarAt(x + (Math.random() - 0.5) * 30, y, Math.cos(an) * v * 1.3 + (vxEk || 0), Math.sin(an) * v * 0.7, 0.7 + Math.random() * 0.8, (s0 || 10) * (0.6 + Math.random() * 0.8), 160); }
}
function kzkTozAt(wx, wy, vx, vy, life, ci, s, gr) { const p = kzkToz[kzkTozI]; kzkTozI = (kzkTozI + 1) % KZK_TOZN; p.x = wx - kzkDX(); p.y = wy - kzkDYc(); p.vx = vx; p.vy = vy; p.l = p.m = life; p.c = ci; p.s = s; p.g = gr === undefined ? 40 : gr; }
function kzkTozPatla(x, y, n, hiz, vxEk, ci0) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.35 + Math.random() * 0.75); kzkTozAt(x, y, Math.cos(a) * v + (vxEk || 0), Math.sin(a) * v * 0.8 - 30, 0.8 + Math.random() * 0.8, ci0 === undefined ? i % KZK_TOZ.length : ci0, 2.2 + Math.random() * 3); }
}
function kzkParcaAdim(dt) {
  const k = Math.exp(-dt * 1.8), kk = Math.exp(-dt * 2.6);
  for (const p of kzkToz) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= k; p.vy = p.vy * k + p.g * dt; }
  for (const p of kzkKar) { if (p.l <= 0) continue; p.l -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= kk; p.vy = p.vy * kk + p.g * dt; }
}
function kzkParcaCiz() {
  const dx = kzkDX(), dy = kzkDYc(), xa = cam.x - 60 - dx, xb = cam.x + VW + 60 - dx, puf = kzkPufArt();
  for (const p of kzkKar) {
    if (p.l <= 0 || p.x < xa || p.x > xb) continue;
    const u = p.l / p.m, r = p.s * (1.5 - 0.7 * u);
    g.globalAlpha = Math.min(1, u * 1.6) * 0.8 * p.a; g.drawImage(puf, p.x + dx - r, p.y + dy - r, r * 2, r * 2);
  }
  for (const p of kzkToz) {
    if (p.l <= 0 || p.x < xa || p.x > xb) continue;
    const u = p.l / p.m, r = p.s * (1.6 + 1.4 * u) * (0.85 + 0.15 * Math.sin(p.l * 17 + p.c));
    g.globalAlpha = Math.min(1, u * 1.5); g.drawImage(kzkTozArt(p.c), p.x + dx - r, p.y + dy - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}
function kzkParilti(x, y, r, ci, a) { if (a <= 0.01) return; g.globalAlpha = Math.min(1, a); g.drawImage(kzkTozArt(ci), x - r * 1.5, y - r * 1.5, r * 3, r * 3); g.globalAlpha = 1; }

// ── ekran efektleri (sabit havuzlar): hızla çizgiye dönen kar taneleri, rüzgâr çizgileri, ışık hızı çizgileri, göğe uçan kıvılcımlar ──
const KZK_EKN = 96, kzkEk = []; for (let i = 0; i < KZK_EKN; i++) kzkEk.push({ x: Math.random() * 1400, y: Math.random() * 800, z: 0.3 + Math.random() * 0.7, f: Math.random() * 6.28 });
const KZK_RUZ = 20, kzkRuz = []; for (let i = 0; i < KZK_RUZ; i++) kzkRuz.push({ x: -9999, y: 0, l: 0, k: 1 });
const KZK_ISIK = 48, kzkIsik = []; for (let i = 0; i < KZK_ISIK; i++) kzkIsik.push({ a: 0, d: -1, c: i % 3, w: 1 });
const KZK_KIV = 10, KZK_AUR = 24;

// ── kurulum / başlama ──
function kzkKur(o) {
  const B = (typeof BOLUM !== 'undefined' && BOLUM.kizak) || {};
  const al = k => Number.isFinite(o[k]) ? o[k] : Number.isFinite(B[k]) ? B[k] : null;
  const x1 = al('inisX') !== null ? al('inisX') : al('x1') !== null ? al('x1') : o.x + 140 * T;   // iniş noktası (final tepesinin eteği)
  let gy = al('inisY') !== null ? al('inisY') : o.y;
  if (al('inisY') === null && typeof yuzey === 'function') { try { const v = yuzey(Math.floor(x1 / T)); if (Number.isFinite(v) && v < ROWS * T) gy = v; } catch (e) {} }
  const xs = o.x + 70, xJ = Math.max(xs + 1600, x1 - 950), vJ = KZK_LY + KZK_LF, vE = vJ - KZK_E;
  const K = { x0: o.x, x1, xs, xJ, xL: x1 - 150, xDur: x1 - 64, gy, Ly: KZK_LY, vJ, vE, r: 0.1, lin: 0 };
  const pay = KZK_B0 / 2 + (vE - KZK_B1 - KZK_A0 - KZK_B0) + KZK_B1 / 2, sabit = KZK_A0 + KZK_B0 / 2 + KZK_B1 / 2 + KZK_E;
  K.r = (xJ - xs - sabit) / pay;
  if (!(K.r > 0.02 && K.r <= 1) || vE - KZK_B1 < KZK_A0 + KZK_B0) K.lin = (xJ - xs) / vJ;
  o.K = K; o.kx = o.x; o.y0 = o.y;
  kzkProfilKur(o);
  o.faz = 'bekle'; o.t = 0; o.total = 0; o.done = false; o.skl = { bitti: false };
  o.v = 0; o.vOn = 0; o.dx = xs; o.dy = 0; o.spd = 0; o.sb = 0; o.hb = 0; o.hbH = 0; o.pat = 0; o.eh = 1; o.egim = 0;
  o.mx = o.x; o.my = o.y; o.sy = o.y; o.vy = 0; o.yer = true; o.coy = 0; o.h = 0; o.rot = 0; o.bas = false; o.idle = 0; o.n = 0; o.isik = 0;
  o.ft = 0; o.pt = 0; o.gt = 0; o.sq = 0; o.sqv = 0; o.sevT = 0; o.tk = 0; o.tkYon = 1; o.kirp = 0; o.havaT = 0; o.kayma = 0; o.yerT = 0;
  o.prX = o.x; o.prY = o.y - 90; o.prW = 0; o.ipucu = 0; o.zorYardim = false; o.hizA = 0; o.flas = 0; o.gidisT = 0; o.kalk = 0;
  o.yolA = 0; o.parA = 0; o.aurA = 0; o.kh = 0; o.khv = 0; o.kardanVar = false; o.kardanA = 0; o.kamY = o.y; o.kor = null;
  o.gx = o.x + KZK_GON; o.gyW = o.y; o.gx0 = o.gx; o.gy0 = o.y; o.kax = o.x - KZK_KAR; o.kay = o.y; o.kax0 = o.kax; o.kay0 = o.y; o.gzip = 0;
  o.camI = -1; o.krisI = 0; o.sxs = 0;
  o.ucuyor = false; o.uc = null; o.uOff = 0; o.uV = 0; o.ucT = 0; o.ucA = 0; o.ucN = 0; o.ucSlow = 0; o.inisBekle = false; o.gSev = 0; o.perdeA = 0; o.kOff = 0;
  o.ucIz = new Float32Array(96); o.ucIzN = 0; o.ucIzI = 0; o.ucIzT = 0;   // uçuşta kızağın ardındaki yıldız tozu / renkli ışık izi (48 nokta; sanal)
  o.aurF = new Float32Array(KZK_AUR);
  o.izler = new Float32Array(40); o.izK = 0; o.izAcik = false; o.izN = 0;   // kayak izleri: 20 [başla, bitir] aralığı (sanal)
  o.kv = []; for (let i = 0; i < KZK_KIV; i++) o.kv.push({ a: false, t: 0, sx: 0, sy: 0, tx: 0, ty: 0, b: 0, c: 0 });
  o.taneler = KZK_TANE.map(([v, lift, tip], i) => ({ i, v, lift, tip, ci: i % 4, d: 'bekle', t: 0, x: 0, y: 0, yardim: false, faz: i * 1.7 }));
  o.kristaller = []; for (let i = 0; i < KZK_KRIS; i++) o.kristaller.push({ i, v: KZK_LY + KZK_KRIS_V + i * KZK_KRIS_ARA, d: 'bekle', t: 0, x: 0, y: 0 });
  // yol kenarı çamları (sanal konumlarda, köprü ve tünelde yok; ormanda sık) ve öndeki iri çamlar
  const r = rng(7171), yasak = v => (v > KZK_KOPRU[0] - 180 && v < KZK_KOPRU[1] + 180) || (v > KZK_TUNEL[0] - 120 && v < KZK_TUNEL[1] + 120);
  o.camArka = []; o.camOn = [];
  for (let v = 380; v < vJ - 300;) {
    const orman = v > KZK_ORMAN[0] && v < KZK_ORMAN[1] || v > KZK_UCUS[0][0] + 600 && v < KZK_UCUS[0][1] - 600, gol = kzkGolde(v) || Math.abs(v - KZK_KULUBE) < 260;
    if (!yasak(v) && !gol) o.camArka.push({ v, k: (r() * 3) | 0, s: (orman ? 0.95 : 0.7) + r() * 0.42, dus: false, dy: (r() * 16) | 0 });
    v += orman ? 85 + r() * 70 : 210 + r() * 260;
  }
  o.bulutlar = [];   // uçuşların bulutları: arkadakiler ve önden geçen yarı saydamlar (uçuş şeridine göre)
  for (const U of KZK_UCUS) for (let v = U[0] + 700; v < U[1] - 700; v += (U === KZK_UCUS[1] ? 480 : 700) + r() * 520) o.bulutlar.push({ v, y: -170 + r() * 330, s: 0.7 + r() * 0.8, on: r() < 0.35, f: r() * 6 });
  for (let v = 1300; v < vJ - 600;) {
    const orman = v > KZK_ORMAN[0] - 200 && v < KZK_ORMAN[1];
    if (!yasak(v)) o.camOn.push({ v, s: 1.05 + r() * 0.35 });
    v += orman ? 230 + r() * 140 : 1300 + r() * 1100;
  }
  o.fzOpt = { el: { x: 22, y: -7 }, vy: 0, sevinc: 0, aci: 0, ruzgar: 0.6 };
  o.gOpt = { yon: 1, kos: 0, zipla: 0, kristal: 0, renkler: null, bak: 0, cek: 1, parla: 0, sevinc: 0, buhar: 1, kulak: 0.3 };
  o.adim = (dt, input) => kzkAdim(o, dt, input);
  if (typeof BOLUM !== 'undefined') {
    if (!BOLUM.kizak) BOLUM.kizak = { x0: o.x, x1, yUst: o.y - 320, yAlt: o.y + 260, inisX: x1, inisY: gy };   // harita vermediyse kamera koridoru
    BOLUM.kizakTop = KZK_TOP;   // sonuç kartı ve ses (oyun.js SAYAC.kizakTop'u kurulumdan sonra buradan okur)
  }
  if (typeof SAYAC !== 'undefined' && 'kizakTop' in SAYAC) SAYAC.kizakTop = KZK_TOP;
  for (let i = 0; i < 4; i++) { kzkTaneArt(i); kzkKristalArt(i); }
  for (let i = 0; i < KZK_TOZ.length; i++) kzkTozArt(i);
  kzkPufArt(); kzkKizakArt(0); kzkKizakArt(1);
  KIZAK.o = o;
}
const KZK_ISIT = [['cam0', () => kzkCamArt(0)], ['cam1', () => kzkCamArt(1)], ['cam2', () => kzkCamArt(2)], ['cam3', () => kzkCamArt(3)], ['tepe0', () => kzkTepeArt(0)],
  ['tepe1', () => kzkTepeArt(1)], ['au0', () => kzkAuroraArt(0)], ['au1', () => kzkAuroraArt(1)], ['au2', () => kzkAuroraArt(2)]];
function kzkIsit() {   // ağır önbellekleri (çam, sırt, ışık dokusu) ayrı karelere yay: yolculuğa yaklaşınca her karede biri; hepsi hazırsa true
  for (const [k, f] of KZK_ISIT) if (!kzkArts[k]) { f(); return false; }
  return true;
}
function kzkBasla(o) {
  if (!o || o.done || o.faz !== 'bekle' || P.ucus || DURUM !== 'oyun' || P.fade > 0) return;
  if (typeof D !== 'undefined' && D.mode === 'tasi') return;
  while (!kzkIsit());   // eksik önbellek kalmasın
  o.faz = 'binis'; o.t = 0; o.total = 0; o.px0 = P.x; o.py0 = P.y; o.idle = 0; o.bas = false; o.h = 0; o.vy = 0; o.yer = true; o.sy = o.y0;
  o.v = 0; o.vOn = 0; o.dx = o.K.xs; o.dy = 0; o.spd = 0; o.sb = 0; o.hb = 0; o.hbH = 0; o.pat = 0; o.kamY = o.y0;
  P.ucus = o; P.vx = P.vy = 0; P.kilit = 0; P.fade = 0; P.buf = 0; KIZAK.o = o;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  // geyik dünyadaki yerinden koşup koşuma girer (P.ucus sırasında dünyadaki geyik gizlenir)
  const G = typeof GEYIK !== 'undefined' && GEYIK && GEYIK.o ? GEYIK.o : null;
  if (G && Number.isFinite(G.x) && Number.isFinite(G.y) && Math.abs(G.x - o.kx) < 900) { o.gx0 = G.x; o.gy0 = G.y; } else { o.gx0 = o.kx - 140; o.gy0 = o.y0; }
  o.kardanVar = typeof V7 !== 'undefined' && !!V7.kardan;
  const KT = typeof KARDAN !== 'undefined' && KARDAN && KARDAN.takipci ? KARDAN.takipci : null;
  if (KT && Number.isFinite(KT.x) && Number.isFinite(KT.y) && Math.abs(KT.x - o.kx) < 900) { o.kax0 = KT.x; o.kay0 = KT.y; } else { o.kax0 = o.kx - 320; o.kay0 = o.y0; }
  o.prX = typeof D !== 'undefined' ? D.x : P.x - 80; o.prY = typeof D !== 'undefined' ? D.y : P.y - 90;
  // kamera koridoru: yolculuk boyunca kızağı izler (bitince geri)
  if (typeof BOLUM !== 'undefined' && BOLUM.kizak) { o.kor = BOLUM.kizak; o.korEski = { yUst: o.kor.yUst, yAlt: o.kor.yAlt }; }
  o.skl.bitti = true;   // ilerideki ışık perdesi kızak kalkarken açılır (yol yalnız kızakla geçilir)
  OLAY.emit('kizakBasla', { o, top: KZK_TOP });
}

// ── her fizik adımı (P.ucus === o iken motor çağırır) ──
function kzkAdim(o, dt, input) {
  if (!(dt > 0) || !Number.isFinite(dt) || DURUM !== 'oyun' || P.ucus !== o) return;
  dt = Math.min(dt, 0.05);
  const K = o.K, basili = !!(input && (input.basili || input.eksenY < 0));
  o.ts = 1;
  if (o.faz === 'sicrama') { const u = clamp(o.t / KZK_SIC, 0, 1); o.ts = 1 - 0.6 * Math.sin(Math.PI * clamp(u * 1.12, 0, 1)); }   // sinematik yavaşlama
  if (o.ucSlow > 0) { o.ucSlow = Math.max(0, o.ucSlow - dt); o.ts = 1 - 0.4 * Math.sin(Math.PI * (1 - o.ucSlow / 0.7)); }   // kalkışta kısa yavaşlama (canlandırma)
  o.flasP = Math.max(0, (o.flasP || 0) - dt * 1.3);
  const dtA = dt * o.ts;
  o.t += dt; o.total += dt; o.sevT = Math.max(0, o.sevT - dt); o.kirp = Math.max(0, o.kirp - dt);
  if (o.tk > 0) { o.tk += dt / 0.8; if (o.tk >= 1) { o.tk = 0; o.kirp = 0.7; } }
  P.vx = P.vy = 0; P.ground = false; P.f = 1;
  o.sqv += (-o.sq * 170 - o.sqv * 13) * dt; o.sq += o.sqv * dt;
  o.ft += dtA; o.pt += dtA * (1 + o.spd / 900); o.gt += dtA * clamp(0.85 + o.spd / 700, 0.9, 2.1);
  const hizK = clamp(o.spd / KZK_VF, 0, 1);
  if (o.faz === 'binis') {
    const u = clamp(o.t / KZK_BINIS, 0, 1), atla = smooth(clamp(u / 0.55, 0, 1)), git = smooth(clamp((u - 0.62) / 0.38, 0, 1)), gk = smooth(clamp(u / 0.7, 0, 1));
    o.mx = lerp(o.kx, K.xs, git); o.my = o.y0; o.sy = o.y0;
    o.yolA = Math.min(1, o.yolA + dt / 0.8); o.aurA = Math.min(1, o.aurA + dt / 2);
    if (u > 0.52 && !o.kalk) { o.kalk = 1; o.sqv -= 6; kzkKarPatla(o.mx, o.my - 4, 10, 90, 0, 9); kzkTozPatla(o.mx, o.my - 30, 10, 110, 0, 1); }   // Feza oturunca kızak yaylanır
    const sx = o.mx + KZK_SEDX, sy = o.my - KZK_KOLTUK;
    P.x = lerp(o.px0, sx, atla); P.y = lerp(o.py0, sy, atla) - Math.sin(atla * Math.PI) * 44;
    // geyik koşup gelir, koşuma girer; kardan adam kendi kızağıyla arkaya kayar
    o.gx = lerp(o.gx0, o.mx + KZK_GON, gk); o.gyW = lerp(o.gy0, o.y0, gk) - Math.sin(gk * Math.PI) * (Math.abs(o.gx0 - o.mx) > 200 ? 60 : 18);
    o.gOpt.kos = gk < 1 ? 0.9 : 0.3; o.gzip = gk < 0.95 && Math.abs(o.gx0 - o.mx) > 200 ? Math.sin(gk * Math.PI) : 0;
    const ku = smooth(clamp((u - 0.15) / 0.75, 0, 1));
    o.kax = lerp(o.kax0, o.mx - KZK_KAR, ku); o.kay = lerp(o.kay0, o.y0, ku) - Math.sin(ku * Math.PI) * 30; o.kardanA = Math.min(1, o.kardanA + dt * 3);
    if (u >= 1) { o.faz = 'yol'; o.t = 0; o.idle = 0; o.spd = 130; o.sb = 130; o.hb = 0; o.yer = true; o.vy = 0; }
    o.isik = lerp(o.isik, 0.08, 1 - Math.exp(-dt));
  } else if (o.faz === 'yol' || o.faz === 'hiz') {
    if (o.faz === 'yol') {   // taban hız + tanelerden kazanılan hız (yumuşakça artar, hiç düşmez); inişte ve buzda biraz hızlanır
      o.sb = lerp(o.sb, lerp(KZK_V0, KZK_V1, smooth(clamp(o.v / KZK_LY, 0, 1))), 1 - Math.exp(-dt * 1.1));
      o.hb = lerp(o.hb, o.hbH, 1 - Math.exp(-dt * KZK_HB_K));
      const ehH = o.ucuyor ? 1.04 : (1 + clamp(o.egim, -0.15, 0.45) * 0.35) * (kzkGolde(o.v) ? 1.15 : 1);
      o.eh = lerp(o.eh, ehH, 1 - Math.exp(-dt * 1.5));
      o.spd = (o.sb + o.hb) * o.eh;
    } else o.spd = lerp(o.spd, KZK_VF, 1 - Math.exp(-dt * 0.8));
    o.pat = Math.max(0, o.pat - dt / 1.1);
    o.vOn = o.v; o.v += o.spd * dt;
    o.mx = K.xs + kzkEsle(K, o.v); o.dx = o.mx - o.v; o.dy = kzkDY(o, o.v);
    o.yolA = Math.min(1, o.yolA + dt / 0.8); o.aurA = Math.min(1, o.aurA + dt / 2);
    o.parA = smooth(clamp((o.v - 120) / 480, 0, 1));
    const yol = kzkP(o, o.v), yolOn = kzkP(o, o.vOn), yolVy = (yol - yolOn) / dt;
    o.egim = (kzkP(o, o.v + 20) - kzkP(o, o.v - 20)) / 40;
    const uc = o.faz === 'yol' ? kzkUcus(o.v) : null;
    // uçuş: rampanın dudağında kalkış (toplanma → fırlama), sonunda yumuşak iniş
    if (uc && !o.ucuyor && o.vOn < uc[0] + 60) kzkUcBasla(o, uc);
    if (!uc && o.ucuyor) kzkUcBitir(o);
    if (!o.ucuyor && o.faz === 'yol') { for (const u of KZK_UCUS) { const d = u[0] - o.v; if (d > 0 && d < 160 && o.yer) o.sq = lerp(o.sq, -0.5, 1 - Math.exp(-dt * 10)); } }   // kalkıştan hemen önce toplanır
    if (o.ucuyor) {
      // uçuşta: dokununca yükselir, bırakınca süzülerek alçalır (uçuş şeridine göre pay); sonda şeride döner
      const u = (o.v - o.uc[0]) / (o.uc[1] - o.uc[0]), son = smooth(clamp((u - 0.84) / 0.13, 0, 1));
      if (basili && !o.bas) { o.idle = 0; o.sqv += 3; OLAY.emit('kizakZipla', { o, hava: true, ucus: true }); }
      if (basili) { o.idle = 0; o.uV = Math.min(o.uV + 900 * dt, 230); } else { o.uV = Math.max(o.uV - 420 * dt, -75); if (o.faz === 'yol') o.idle += dt; }
      o.bas = basili;
      o.uOff += o.uV * dt;
      const ust = lerp(KZK_UC_UST, 0, son), alt = lerp(KZK_UC_ALT, 0, son);
      if (o.uOff > ust) { o.uOff = lerp(o.uOff, ust, 1 - Math.exp(-dt * 8)); if (o.uV > 0) o.uV *= Math.exp(-dt * 6); }
      if (o.uOff < alt) { o.uOff = lerp(o.uOff, alt, 1 - Math.exp(-dt * 8)); if (o.uV < 0) o.uV *= Math.exp(-dt * 6); }
      kzkMiknatisUc(o, dt);
      const syOn = o.sy; o.sy = kzkLane(o, o.v) - o.uOff; o.vy = (o.sy - syOn) / dt; o.yer = false; o.coy = 0;
      o.ucT += dt; o.ucA = Math.min(1, o.ucA + dt / 1.5);
    } else {
    o.ucA = Math.max(0, o.ucA - dt / 1.5);
    // zıplama: yerdeyken (ya da az önce ayrıldıysa) sıçrar; havadayken yeni dokunuş küçük bir sıçrama daha verir
    if (basili && !o.bas) {
      o.idle = 0;
      if (o.yer || o.coy > 0) { o.vy = Math.min(yolVy, 0) * 0.5 - KZK_ZIP; o.yer = false; o.coy = 0; o.sqv += 8; kzkKarPatla(o.mx - 30, kzkY(o, o.v), 5, 90, -o.spd * 0.15, 6); OLAY.emit('kizakZipla', { o, hava: false }); kzkSfx('kizakZipla', 0); }
      else if (o.h > 6) { o.vy = Math.min(o.vy, -KZK_HOP); o.sqv += 4; kzkTozPatla(o.mx - 30, o.sy + o.dy - 10, 6, 80, -40, 4); OLAY.emit('kizakZipla', { o, hava: true }); }
    }
    if (basili) o.idle = 0; else if (o.faz === 'yol') o.idle += dt;
    o.bas = basili;
    if (o.yer) {
      const serbest = o.sy + (o.vy + KZK_G * dt) * dt;   // o.sy: önceki adımda yolun üstü
      if (yol > serbest + 0.3) { o.yer = false; o.coy = 0.14; o.vy += KZK_G * dt; o.sy = serbest; }   // yol düşüşten hızlı kaçıyor: tümsekten havalan
      else { o.sy = yol; o.vy = yolVy; }
    }
    if (!o.yer) {
      const gr = o.vy < 0 ? (basili ? 760 : 1500) : KZK_G;
      o.vy += gr * dt; if (o.vy > 950) o.vy = 950;
      o.sy += o.vy * dt;
      let h = yol - o.sy;
      if (h > 200 && !o.inisBekle) { o.sy = yol - 200 - (h - 200) * 0.5; if (o.vy < 0) o.vy *= 0.5; }
      if (kzkTunelde(o.v) && yol - o.sy > KZK_TUNEL_H) { o.sy = yol - KZK_TUNEL_H; if (o.vy < 0) o.vy = 0; }   // tünel tavanına çarpmaz
      if (o.faz === 'yol') kzkMiknatis(o, dt, yol);
      if (o.sy >= yol) {
        const vur = o.vy - yolVy;
        o.sy = yol; o.yer = true;
        if (o.inisBekle) {   // uçuştan iniş: kar bulutu, geyik sevinçle zıplar
          o.inisBekle = false; o.gSev = 1.6; o.sqv -= 10;
          kzkKarPatla(o.mx - 10, kzkY(o, o.v), 18, 200, -o.spd * 0.25, 9); kzkTozPatla(o.mx, kzkY(o, o.v) - 20, 16, 160, o.spd * 0.3);
          OLAY.emit('kizakIn', { n: o.ucN, o }); OLAY.emit('kizakInis', { o, buyuk: true }); kzkSfx('kizakIn', o.ucN);
        } else if (vur > 220) { const k = clamp(vur / 800, 0.3, 1); o.sqv -= 9 * k; kzkKarPatla(o.mx - 20, kzkY(o, o.v), (5 + 9 * k) | 0, 90 + 110 * k, -o.spd * 0.2, 6 + 3 * k); OLAY.emit('kizakInis', { o, buyuk: false }); }
        o.vy = yolVy;
      }
    }
    }
    o.coy = Math.max(0, o.coy - dt);
    o.h = Math.max(0, yol - o.sy);
    o.havaT = o.yer ? 0 : o.havaT + dt; o.yerT = o.yer ? o.yerT + dt : 0;
    o.my = o.sy + o.dy;
    const hedefRot = o.ucuyor ? clamp(Math.atan2(o.vy, Math.max(o.spd, 120)) * 0.7, -0.3, 0.3) : o.yer ? Math.atan(o.egim) : clamp(Math.atan2(o.vy, Math.max(o.spd, 120)) * 0.55 + Math.atan(o.egim) * 0.35, -0.42, 0.5);
    o.rot = lerp(o.rot, hedefRot, 1 - Math.exp(-dt * (o.yer ? 12 : 5)));
    kzkIzAdim(o); kzkUcIzAdim(o, dt);
    kzkPuskurt(o, dt);
    o.isik = lerp(o.isik, o.faz === 'hiz' ? 1 : 0.1 + 0.9 * o.n / KZK_TOP, 1 - Math.exp(-dt * 1.6));
    o.gSev = Math.max(0, o.gSev - dt); o.perdeA = Math.max(0, o.perdeA - dt / 3.5);
    if (o.faz === 'yol') {
      kzkTaneler(o, dt); kzkPerdeAdim(o);
      if (o.v >= K.Ly) kzkHizBasla(o);
    } else {
      o.hizA = Math.min(1, o.hizA + dt * 1.2); o.flas = Math.max(0, o.flas - dt * 1.4);
      kzkTanelerSon(o, dt); kzkKristalAdim(o, dt);
      if (o.v >= K.vJ) kzkSicramaBasla(o);
    }
    // geyik önde (uçuşta havada dörtnala, karda sevinçle zıplar), kardan adam arkada (biraz gecikmeli)
    const gv = o.v + KZK_GON, gU = o.ucuyor && kzkUcus(gv), zz = o.gSev > 0 ? Math.abs(Math.sin((1.6 - o.gSev) * 7.5)) * smooth(Math.min(1, o.gSev / 0.4)) : 0;
    o.gx = gv + o.dx;
    o.gyW = (gU ? kzkLane(o, gv) - o.uOff + Math.sin(o.total * 3.3) * 4 : kzkP(o, gv) - (o.ucuyor ? 0 : o.h) - zz * 26) + o.dy;
    o.gOpt.kos = gU ? 1 : o.h > 4 && !o.ucuyor ? 0.4 : 1; o.gzip = gU ? 0.12 : Math.max(clamp(o.h / 60, 0, 1) * (o.ucuyor ? 0 : 1), zz * 0.8);
    if (o.ucuyor) { o.kh = 0; o.khv = 0; } else { o.khv += ((o.h - o.kh) * 60 - o.khv * 9) * dt; o.kh = Math.max(0, o.kh + o.khv * dt); }
    const kv = o.v - KZK_KAR, kU = kzkUcus(kv) && o.ucT > 0.1;
    o.kax = kv + o.dx; o.kay = (kU ? kzkLane(o, kv) - o.kOff : kzkP(o, kv) - o.kh) + o.dy;
    o.kOff = lerp(o.kOff, o.uOff, 1 - Math.exp(-dt * 4));
  } else if (o.faz === 'sicrama') {
    const u = clamp(o.t / KZK_SIC, 0, 1);
    o.mx = o.sx0 + o.sD * (1 - Math.pow(1 - u, o.sk));
    const p = Math.pow(u, 0.85), taban = lerp(o.sy0, K.gy, smooth(u));
    o.my = taban - o.sH * Math.pow(Math.sin(Math.PI * p), 1.35);
    const vx = o.sD * o.sk * Math.pow(1 - u, o.sk - 1) / KZK_SIC, dy = (o.my - (o.smyOn === undefined ? o.my : o.smyOn)) / dt;
    o.smyOn = o.my; o.spd = vx;
    o.rot = lerp(o.rot, clamp(Math.atan2(dy, Math.max(vx, 60)) * 0.5, -0.32, 0.3), 1 - Math.exp(-dt * 6));
    o.h = 80 * Math.sin(Math.PI * u); o.havaT += dt;
    o.hizA = Math.max(0, o.hizA - dt * 0.5); o.flas = Math.max(0, o.flas - dt * 1.4);
    o.parA = Math.max(0, 1 - smooth(clamp((u - 0.15) / 0.6, 0, 1)));
    if (Math.random() < dtA * 24) kzkTozAt(o.mx - 30 + Math.random() * 30, o.my - 20 + Math.random() * 30, -30 - Math.random() * 40, 10 + Math.random() * 30, 1.1, (Math.random() * 5) | 0, 2 + Math.random() * 2.5, 20);
    if (Math.random() < dtA * 14) kzkKarAt(o.mx - 40, o.my, -40, 20, 0.9, 6 + Math.random() * 5, 60, 0.7);
    // geyik önde, kardan adam arkada: aynı yayın biraz ilerisi / gerisi
    const yay = w => { const uu = clamp(w, 0, 1), pp = Math.pow(uu, 0.85); return [o.sx0 + o.sD * (1 - Math.pow(1 - uu, o.sk)), lerp(o.sy0, K.gy, smooth(uu)) - o.sH * Math.pow(Math.sin(Math.PI * pp), 1.35)]; };
    let q = yay(u + 0.05); o.gx = q[0] + KZK_GON * (1 - u * 0.1); o.gyW = q[1]; o.gzip = u < 0.9 ? 1 : 0.4; o.gOpt.kos = 0.4;
    q = yay(u - 0.07); o.kax = q[0] - KZK_KAR; o.kay = u < 0.07 ? o.kay : q[1];
    P.x = o.mx + KZK_SEDX; P.y = o.my - KZK_KOLTUK;
    o.kamY = lerp(o.kamY, lerp(o.sy0, K.gy, smooth(u)) - 40, 1 - Math.exp(-dt * 3));
    if (u >= 1) kzkSicramaBitti(o);
  } else if (o.faz === 'inis') {
    const u = clamp(o.t / KZK_INIS, 0, 1), ku = clamp(u / 0.5, 0, 1), kay = 1 - Math.pow(1 - ku, 2.4), atla = smooth(clamp((u - 0.52) / 0.42, 0, 1));
    o.mx = lerp(o.ix, K.xDur, kay); o.my = K.gy; o.rot *= Math.exp(-dt * 6); o.h = 0; o.spd = (1 - ku) * 400;
    if (ku < 0.97 && Math.random() < dt * 40 * (1 - ku)) kzkKarAt(o.mx - 44 + Math.random() * 10, o.my - 1, -30 - Math.random() * 60, -40 - Math.random() * 70, 0.5 + Math.random() * 0.3, 4 + Math.random() * 5, 300, 0.7);
    o.hizA = Math.max(0, o.hizA - dt * 0.8); o.flas = Math.max(0, o.flas - dt * 1.2);
    const sx = o.mx + KZK_SEDX, sy = o.my - KZK_KOLTUK;
    P.x = lerp(sx, K.x1, atla); P.y = lerp(sy, K.gy, atla) - Math.sin(atla * Math.PI) * 40;
    // geyik durur ve sevinçle zıplar; kardan adam kayarak yanaşır
    o.gx = o.mx + KZK_GON; o.gzip = 0; o.gOpt.kos = (1 - ku) * 0.8;
    const zz = u > 0.45 ? Math.abs(Math.sin((u - 0.45) * 13)) : 0; o.gyW = K.gy - zz * 22; o.gzip = zz * 0.8;
    o.kax = lerp(o.kax, o.mx - KZK_KAR, 1 - Math.exp(-dt * 5)); o.kay = lerp(o.kay, K.gy, 1 - Math.exp(-dt * 8));
    o.prX = lerp(o.prX, P.x - 70, 1 - Math.exp(-dt * 4)); o.prY = lerp(o.prY, P.y - 92, 1 - Math.exp(-dt * 4));
    if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
    o.kamY = lerp(o.kamY, K.gy - 30, 1 - Math.exp(-dt * 3)); kzkKoridor(o);
    if (u >= 1) { kzkIndi(o); return; }
    o.x = P.x; return;
  }
  if (o.faz !== 'sicrama') { P.x = o.mx + KZK_SEDX; P.y = o.my - KZK_KOLTUK; }
  if (o.faz === 'yol' || o.faz === 'hiz') o.kamY = lerp(o.kamY, o.my + (o.ucuyor ? Math.min(50, o.h * 0.1) : 0), 1 - Math.exp(-dt * 1.3));   // uçuşta kamera kızakla yükselir: yer ekranın dibine iner
  if (o.faz === 'binis') o.kamY = o.y0;
  kzkKoridor(o);
  kzkPirilAdim(o, dt);
  o.x = P.x;
  if (typeof D !== 'undefined') { D.x = o.prX; D.y = o.prY; }
}
function kzkKoridor(o) { if (o.kor) { o.kor.yUst = o.kamY - 300; o.kor.yAlt = o.kamY + 160; } }
function kzkIzAdim(o) {   // kayak izleri: yerdeyken açık aralığı uzat, havalanınca kapat (20 aralıklık halka)
  const arka = o.v - 40;
  if (o.yer) {
    if (!o.izAcik) { o.izK = (o.izK + 1) % 20; o.izler[o.izK * 2] = arka; o.izler[o.izK * 2 + 1] = arka; o.izAcik = true; o.izN = Math.min(20, o.izN + 1); }
    else o.izler[o.izK * 2 + 1] = arka;
  } else o.izAcik = false;
}
function kzkPuskurt(o, dt) {   // kızak demirlerinden ve toynaklardan kar püskürmesi; dallardan dökülen kar
  const y = kzkY(o, o.v), hk = clamp(o.spd / KZK_VF, 0, 1);
  if (o.ucuyor) {   // uçuşta: toynaklardan ve kızak demirlerinden yıldız tozu dökülür
    const c = Math.cos(o.rot), sn = Math.sin(o.rot);
    if (Math.random() < dt * 34) kzkTozAt(o.gx - 14 + Math.random() * 30, o.gyW - 2, -40 - Math.random() * 60, 30 + Math.random() * 40, 0.9 + Math.random() * 0.6, 1 + ((Math.random() * 4) | 0), 1.6 + Math.random() * 1.8, 60);
    if (Math.random() < dt * 26) kzkTozAt(o.mx - 40 * c + Math.random() * 50, o.my - 40 * sn - 2, -50 - Math.random() * 50, 20 + Math.random() * 30, 0.8 + Math.random() * 0.5, (Math.random() * 5) | 0, 1.4 + Math.random() * 1.6, 50);
    return;
  }
  if (o.yer && Math.random() < dt * (10 + o.spd / 26)) { const buz = kzkGolde(o.v); if (buz) kzkTozAt(o.mx - 40 + Math.random() * 12, y - 2, -40 - Math.random() * 60, -30 - Math.random() * 50, 0.4, 0, 1.2 + Math.random() * 1.2, 200); else kzkKarAt(o.mx - 44 + Math.random() * 10, y - 1, -30 - Math.random() * 60, -40 - Math.random() * 70 - o.spd * 0.05, 0.35 + Math.random() * 0.35, 3 + Math.random() * 4 + hk * 3, 320, 0.6); }
  if (o.yer && o.pat > 0.1 && Math.random() < dt * 40 * o.pat) kzkTozAt(o.mx - 36 + Math.random() * 20, y - 3, -60 - Math.random() * 120, -40 - Math.random() * 90, 0.5, 4, 1.4 + Math.random() * 1.4, 260);   // buz kıvılcımı
  if (o.h < 4 && Math.random() < dt * (6 + o.spd / 60)) { const gv = o.v + KZK_GON; kzkKarAt(gv + o.dx - 10 + Math.random() * 20, kzkY(o, gv) - 2, -30 - Math.random() * 50, -40 - Math.random() * 60, 0.4 + Math.random() * 0.3, 4 + Math.random() * 4, 300, 0.7); }
  if (o.kardanVar && o.kh < 4 && Math.random() < dt * (6 + o.spd / 50)) { const kv = o.v - KZK_KAR; kzkKarAt(kv + o.dx - 26, kzkY(o, kv) - 2, -20 - Math.random() * 40, -40 - Math.random() * 60, 0.4 + Math.random() * 0.3, 4 + Math.random() * 4, 300, 0.7); }
  // yanından geçilen çamın dallarından kar dökülür
  const L = o.camArka;
  while (o.camI + 1 < L.length && L[o.camI + 1].v < o.v) {
    o.camI++; const c = L[o.camI];
    if (c.k !== 1 && o.camI % 3) continue;
    const cy = kzkY(o, c.v) - 150 * c.s;
    for (let k = 0; k < 5; k++) kzkKarAt(c.v + o.dx + (Math.random() - 0.5) * 50 * c.s, cy + Math.random() * 70 * c.s, (Math.random() - 0.5) * 30, 10 + Math.random() * 30, 1 + Math.random() * 0.6, 4 + Math.random() * 5, 140, 0.8);
  }
}

// ── taneler: konum, toplama, kaçırma, Pırıl yardımı ──
function kzkTaban(o, v) { return kzkUcus(v) ? kzkLane(o, v) : kzkP(o, v); }   // tanenin dayandığı yükseklik (sanal): yol ya da uçuş şeridi
function kzkTaneY(o, r) { return kzkTaban(o, r.v) + o.dy - KZK_KOLTUK - KZK_GOVDE - r.lift; }
function kzkSonraki(o) { let en = null; for (const r of o.taneler) if (r.d === 'bekle' && r.v > o.v - 10 && (!en || r.v < en.v)) en = r; return en; }
function kzkSonrakiHava(o) { let en = null; for (const r of o.taneler) if (r.d === 'bekle' && r.lift > 30 && r.v > o.v - 10 && (!en || r.v < en.v)) en = r; return en; }
function kzkMiknatis(o, dt, yol) {   // havadayken öndeki tane kızağı nazikçe kendi yüksekliğine çeker (5 yaş kolaylığı)
  const r = kzkSonraki(o); if (!r || r.yardim) return;
  const d = r.v - o.v; if (d <= 0 || d > 260 || yol - o.sy < 6) return;
  const hedef = kzkP(o, r.v) - r.lift;   // bu yükseklikte göğüs taneye denk gelir
  if (Math.abs(hedef - o.sy) > 170) return;
  const w = smooth(1 - d / 260);
  o.sy = lerp(o.sy, Math.min(hedef, yol - 8), 1 - Math.exp(-dt * 6 * w)); o.vy *= Math.exp(-dt * 3 * w);
}
function kzkUcBasla(o, uc) {   // rampanın dudağı: toplanmış kızak fırlar, geyiğin boynuzları ve toynakları ışıl ışıl yanar
  o.ucuyor = true; o.uc = uc; o.ucN++; o.ucT = 0; o.inisBekle = false; o.ucSlow = 0.7;
  o.uOff = clamp(kzkLane(o, o.v) - o.sy, 0, KZK_UC_UST); o.uV = 240 + Math.max(0, -o.vy) * 0.3; o.kOff = 0;
  o.sqv += 15; o.sevT = 1.4; o.gSev = 0; o.izAcik = false;
  const y = o.sy + o.dy;
  kzkKarPatla(o.mx - 20, y, 12, 150, -o.spd * 0.2, 8);
  kzkTozPatla(o.mx, y - 20, 26, 230, o.spd * 0.3); kzkTozPatla(o.gx, o.gyW - 10, 20, 180, o.spd * 0.3, 1);
  OLAY.emit('kizakUc', { n: o.ucN, o }); kzkSfx('kizakUc', o.ucN);
}
function kzkUcBitir(o) {   // uçuş şeridinin sonu: kızak yerçekimine bırakılır, yumuşakça kara konar (kizakIn konunca)
  o.ucuyor = false; o.inisBekle = true; o.yer = false; o.coy = 0; o.vy = clamp(o.vy, -80, 260);
}
function kzkMiknatisUc(o, dt) {   // uçuşta öndeki tane kızağı nazikçe kendi yüksekliğine çeker
  const r = kzkSonraki(o); if (!r || r.yardim || !kzkUcus(r.v)) return;
  const d = r.v - o.v; if (d <= 0 || d > 280) return;
  if (Math.abs(r.lift - o.uOff) > 150) return;
  const w = smooth(1 - d / 280);
  o.uOff = lerp(o.uOff, r.lift, 1 - Math.exp(-dt * 5 * w)); o.uV *= Math.exp(-dt * 3 * w);
}
function kzkPerdeAdim(o) {   // kuzey ışığı perdesinin içinden geçiş: ışık patlaması, gök baştan uca parlar, kızağın ardında renkli iz
  for (let i = 0; i < KZK_PERDE.length; i++) {
    const v = KZK_PERDE[i]; if (!(o.vOn < v && o.v >= v)) continue;
    o.perdeA = 1; o.sevT = 1.3; o.flasP = 1;
    if (!(o.tk > 0)) { o.tk = 0.001; o.tkYon = 1; }
    const x = o.mx, y = o.my - 30;
    for (let k = 0; k < 4; k++) kzkTozPatla(x + 30, y, 16, 260, o.spd * 0.4, 1 + k);
    for (let k = 0; k < KZK_AUR; k++) o.aurF[k] = 1;
    OLAY.emit('kizakPerde', { i: i + 1, o }); kzkSfx('halkaHiz', 0);
  }
}
function kzkTaneler(o, dt) {
  const fy = o.sy - KZK_KOLTUK - KZK_GOVDE;   // göğüs (sanal y)
  const yardimModu = o.zorYardim || o.idle >= KZK_YARDIM;
  for (const r of o.taneler) {
    r.t += dt;
    if (r.d === 'bitti') continue;
    if (r.d === 'alindi') { if (r.t > 0.6) r.d = 'bitti'; continue; }
    if (r.d === 'kacti') { if (r.t > 2.4) r.d = 'bitti'; continue; }
    if (yardimModu && r.v > o.v && r.v - o.v < 900) r.yardim = true;
    if (r.v > o.vOn - 2 && r.v <= o.v + 2) {   // bu adımda tanenin hizasından geçildi
      const ry = kzkTaban(o, r.v) - KZK_KOLTUK - KZK_GOVDE - r.lift, d = ry - fy, tol = r.tip === 'k' ? KZK_TOL + 12 : KZK_TOL;
      if (d > -(tol + 22) && d < tol) kzkTopla(o, r, 'feza');
      else if (r.yardim) kzkTopla(o, r, 'piril');
      else { r.d = 'kacti'; r.t = 0; OLAY.emit('kizakKacti', { o }); }
    }
  }
  o.ipucu = lerp(o.ipucu, o.idle >= KZK_IPUCU && !yardimModu ? 1 : 0, 1 - Math.exp(-dt * 2));
}
function kzkTanelerSon(o, dt) { for (const r of o.taneler) { r.t += dt; if ((r.d === 'alindi' && r.t > 0.6) || (r.d === 'kacti' && r.t > 2.4)) r.d = 'bitti'; } }
function kzkTopla(o, r, kim) {
  r.d = 'alindi'; r.t = 0; o.n++; o.sevT = 1.1;
  if (!(o.tk > 0) && (kim === 'piril' || o.n % 3 === 0)) { o.tk = 0.001; o.tkYon = o.n % 2 ? 1 : -1; }   // Pırıl sevinçle takla atar
  const x = r.v + o.dx, y = kzkTaneY(o, r), kr = r.tip === 'k';
  kzkTozPatla(x, y, kr ? 34 : 18, kr ? 240 : 170, o.spd * 0.5, kr ? undefined : r.ci + 1);
  kzkTozPatla(x, y, 8, 80, o.spd * 0.7, 0);
  o.sqv += 3;
  if (o.faz === 'yol') {   // hız patlaması: kızak biraz hızlanır (azalan artış), demirlerden buz kıvılcımı, iri kar püskürmesi
    o.hbH += KZK_HB * (1 - o.hbH / KZK_HBMAX) * (kr ? 1.6 : 1); o.pat = 1;
    const yy = kzkY(o, o.v);
    for (let i = 0; i < 8; i++) kzkKarAt(o.mx - 40 + Math.random() * 20, yy - 2, -80 - Math.random() * 150, -90 - Math.random() * 120, 0.6 + Math.random() * 0.4, 8 + Math.random() * 8, 320);
  }
  kzkKivilcim(o, x, y, r.ci);
  kzkSfx('halka', Math.min(o.n, 12));
  OLAY.emit('kizakTane', { n: o.n, top: KZK_TOP, x, y, kim, tip: kr ? 'kristal' : 'tane', o });
}
function kzkKivilcim(o, wx, wy, ci) {   // tane göğe uçar, kuzey ışığının o noktasını yakar
  for (const k of o.kv) if (!k.a) {
    k.a = true; k.t = 0; k.sx = wx - cam.x; k.sy = wy - cam.y; k.c = ci;
    k.b = clamp(Math.round(k.sx / VW * (KZK_AUR - 1)) + 2 + ((Math.random() * 4) | 0), 0, KZK_AUR - 1);
    k.tx = k.b / (KZK_AUR - 1) * VW; k.ty = (VH / cam.zoom) * 0.2; return;
  }
  o.aurF[clamp(Math.round((wx - cam.x) / VW * (KZK_AUR - 1)), 0, KZK_AUR - 1)] = 1;
}
function kzkHizBasla(o) {   // büyük iniş
  o.faz = 'hiz'; o.t = 0; o.flas = 1; o.sevT = 1.4; o.sqv += 6; o.zorYardim = false;
  kzkTozPatla(o.mx, o.my - 40, 30, 260, o.spd);
  for (const p of kzkIsik) p.d = -1;
  for (let i = 0; i < KZK_AUR; i++) o.aurF[i] = 0.6;
  OLAY.emit('kizakHiz', { o }); kzkSfx('halkaHiz', 0);
}
function kzkKristalAdim(o, dt) {   // büyük inişin kristalleri: kızak geçtikçe kendiliğinden toplanır, gök parlar
  for (const k of o.kristaller) {
    k.x = k.v + o.dx; k.y = kzkY(o, k.v) - KZK_KOLTUK - KZK_GOVDE - 18 - Math.sin(k.i / (KZK_KRIS - 1) * Math.PI) * 30;
    if (k.d === 'alindi') { k.t += dt; if (k.t > 0.7) k.d = 'bitti'; continue; }
    if (k.d === 'bekle' && k.v <= o.v + 8) {
      k.d = 'alindi'; k.t = 0; o.sevT = Math.max(o.sevT, 0.5);
      kzkTozPatla(k.x, k.y, 16, 220, o.spd * 0.6, 1 + (k.i % 4));
      kzkKivilcim(o, k.x, k.y, k.i % 4);
      kzkSfx('halkaNota', 13 + k.i);
      OLAY.emit('kizakKristal', { i: k.i + 1, top: KZK_KRIS, o });
    }
  }
}
function kzkSicramaBasla(o) {
  const K = o.K;
  o.faz = 'sicrama'; o.t = 0; o.sx0 = o.mx; o.sy0 = o.my; o.smyOn = undefined;
  o.sD = Math.max(80, K.xL - o.mx); o.sk = clamp(o.spd * KZK_SIC / o.sD, 1.4, 4.5);
  o.sH = clamp(190 + (K.gy - o.sy0) * 0.2, 160, 280);
  o.vy = 0; o.bas = false; o.sqv += 10; o.sevT = KZK_SIC + 0.6; o.yer = false; o.izAcik = false;
  kzkKarPatla(o.mx, o.my - 4, 26, 220, 120, 12); kzkTozPatla(o.mx, o.my - 20, 20, 200, 160);
  OLAY.emit('kizakFinalSicrama', { o }); kzkSfx('halkaFinalSicrama', 0);
}
function kzkSicramaBitti(o) {
  o.faz = 'inis'; o.t = 0; o.ix = o.mx; o.sqv -= 12; o.ts = 1; o.yer = true; o.parA = 0;
  // kar bulutu patlaması
  kzkKarPatla(o.mx - 20, o.my - 2, 24, 260, -40, 10); kzkKarPatla(o.mx + KZK_GON, o.my - 2, 10, 160, 20, 8);
  kzkTozPatla(o.mx, o.my - 30, 40, 280, 0); kzkTozPatla(o.mx, o.my - 10, 16, 140, 0, 0);
  o.flas = 0.8;
  OLAY.emit('kizakInis', { o, buyuk: true });
}
function kzkPirilAdim(o, dt) {
  // Pırıl geyiğin önünde uçar; ipucunda sıradaki tanenin çevresinde döner, yardımda taneye süzülür; finalde yanında süzülür
  const gx = o.gx, gy = o.gyW;
  let evX = gx + 74 + Math.sin(o.total * 1.1) * 18, evY = gy - 96 + Math.sin(o.total * 2.1) * 10;
  if (o.faz === 'binis') { evX = o.kx + KZK_GON + 70; evY = o.y0 - 110; }
  if (o.faz === 'hiz') { evX = P.x + 70 + Math.sin(o.total * 2.3) * 16; evY = P.y - 100 + Math.sin(o.total * 3.1) * 8; }
  if (o.faz === 'sicrama') { const a = clamp(o.t / KZK_SIC, 0, 1) * 6.2832 - 1.6; evX = P.x + 20 + Math.cos(a) * 100; evY = P.y - 70 + Math.sin(a) * 75; }
  if (o.tk > 0) evY -= Math.sin(o.tk * Math.PI) * 26;
  const r = o.faz === 'yol' ? kzkSonraki(o) : null;
  let w = 0, hx = evX, hy = evY;
  if (r) {
    const uzak = r.v + o.dx - P.x, ry = kzkTaneY(o, r);
    if (r.yardim) { w = smooth(clamp((640 - uzak) / 400, 0, 1)); hx = r.v + o.dx + 4; hy = ry; }
    else if (o.ipucu > 0.05 && r.lift > 30) { const a = o.total * 2.6; w = o.ipucu * 0.85 * smooth(clamp((900 - uzak) / 420, 0, 1)); hx = r.v + o.dx + Math.cos(a) * 40; hy = ry + Math.sin(a) * 34; }
  }
  o.prW = lerp(o.prW, w, 1 - Math.exp(-dt * 3));
  const tx = lerp(evX, hx, o.prW), ty = lerp(evY, hy, o.prW), k = 1 - Math.exp(-dt * (r && r.yardim ? 8 : o.faz === 'sicrama' ? 6 : 4));
  o.prX = lerp(o.prX, tx, k); o.prY = lerp(o.prY, ty, k);
  if ((o.prW > 0.3 || o.faz === 'hiz') && Math.random() < dt * 14) kzkTozAt(o.prX - 14, o.prY + 6, -40, 10, 0.6, 3, 1.8);
}
function kzkIndi(o) {
  const K = o.K;
  P.x = K.x1; P.y = K.gy; P.vx = P.vy = 0; P.ground = true; P.safeX = P.x; P.safeY = P.y; P.ucus = null; P.dj = true; P.buf = 0; P.fade = 0;
  if (typeof D !== 'undefined') { D.x = P.x - 74; D.y = P.y - 91; D.vx = D.vy = 0; }
  o.done = true; o.faz = 'bitti'; o.t = 0; o.gidisT = 0; o.skl.bitti = true; o.mx = K.xDur; o.my = K.gy; o.ts = 1; o.spd = 0;
  if (o.kor && o.korEski) { o.kor.yUst = o.korEski.yUst; o.kor.yAlt = o.korEski.yAlt; }
  if (typeof V7 !== 'undefined') V7.kizak = true;
  kzkTozPatla(P.x, P.y - 20, 18, 150, 0);
  OLAY.emit('kizakBitti', { o, n: o.n, top: KZK_TOP, sure: o.total, toplanan: o.n });
}

// ── çizim: gök, paralaks, yol ──
function kzkAuroraCiz(o, tm) {   // kızaktaki kuzey ışıkları: üç kıvrımlı yumuşak kurdele; topladıkça belirginleşir, tane gelince o kesim parlar; uçuşta yakın ve dev
  const ua = o.ucA * (o.uc === KZK_UCUS[1] ? 1 : 0.75), A = o.aurA * Math.max(0.12 + 0.6 * o.isik, 0.7 * ua) * (1 + o.flasP * 0.6); if (A < 0.01) return;
  const VHg = VH / cam.zoom, cx = cam.x, cy = cam.y, N = 34, hz = o.faz === 'hiz' ? 1.8 : 1 + ua * 0.4;
  const PR = [[0, -0.05, 0.75, 0.42, 0.10, 3.2, 8, 0.14, 0.4], [1, 0.3, 1.08, 0.35, 0.09, 3.8, 7, 0.11, 2.1], [2, 0.05, 0.9, 0.26, 0.08, 2.8, 6.5, 0.09, 4.2]];
  g.globalCompositeOperation = 'lighter';
  for (const [k, x0u, x1u, yu, amp, k1, k2, sp, ph] of PR) {
    const tex = kzkAuroraArt(k), x0 = cx + x0u * VW - ((o.v * 0.004) % 60), x1 = cx + x1u * VW, dw = (x1 - x0) / N, tt = tm * sp * hz;
    let yOn = 0;
    for (let i = 0; i <= N; i++) {
      const u = i / N, ta = Math.pow(Math.sin(u * Math.PI), 0.9); if (ta < 0.02) continue;
      const x = x0 + dw * i, yb = cy + VHg * (yu + 0.1 * ua + amp * (Math.sin(u * k1 + tt + ph) * 0.7 + Math.sin(u * k2 - tt * 1.6 + ph * 2) * 0.3));
      const ray = 0.85 + 0.15 * Math.sin(i * 2.7 + tm * 2.3 + ph) * Math.sin(i * 1.3 - tm * 1.1), hh = VHg * (0.3 + 0.18 * ua + 0.06 * o.isik) * (0.8 + 0.2 * Math.sin(u * 4 + tm * 0.35 + ph)) * ray;
      const sl = i ? Math.abs(yb - yOn) / dw : 0; yOn = yb;
      const fl = o.aurF[Math.min(KZK_AUR - 1, Math.floor((x - cx) / VW * KZK_AUR))] || 0;
      const aa = (A * 0.42 * ta * (0.6 + 0.55 * Math.min(1, sl * 1.4)) + fl * 0.22 * o.aurA) * (k ? 0.8 : 1); if (aa < 0.006) continue;
      g.globalAlpha = Math.min(1, aa); g.drawImage(tex, x - dw * 1.6, yb - hh * 0.87, dw * 3.2, hh);
    }
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function kzkGokArt() {   // uçuş göğü: üstte saydam, aşağı doğru dunya7 gecesinin lacivert-morunda opak (yükseldikçe dünyanın arka katmanlarını örter)
  if (kzkArts.gok) return kzkArts.gok;
  const c = document.createElement('canvas'); c.width = 4; c.height = 256; const q = c.getContext('2d'), gr = q.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, 'rgba(30,33,84,0)'); gr.addColorStop(0.1, 'rgba(32,35,88,.7)'); gr.addColorStop(0.2, 'rgba(36,40,98,1)'); gr.addColorStop(1, 'rgba(58,62,134,1)');
  q.fillStyle = gr; q.fillRect(0, 0, 4, 256); return kzkArts.gok = c;
}
function kzkGokCiz(o, tm) {
  const a = o.ucA * o.parA; if (a < 0.01) return;
  const VHg = VH / cam.zoom, puf = kzkPufArt();
  g.globalAlpha = a; g.drawImage(kzkGokArt(), cam.x - 2, cam.y + VHg * 0.02, VW + 4, VHg + 4);
  g.globalCompositeOperation = 'lighter';   // ay ve birkaç yıldız (örtülen göğün yerine)
  const ax = cam.x + VW * 0.8, ay = cam.y + VHg * 0.13; dglow('#c8d2ff', ax, ay, 90, 0.35 * a); dglow('#ffffff', ax, ay, 26, 0.9 * a);
  for (let i = 0; i < 26; i++) { const h = ((i * 2654435761) >>> 0) / 4294967296, h2 = ((i * 40503 + 17) % 997) / 997; dglow('#eef2ff', cam.x + h * VW, cam.y + VHg * (0.06 + h2 * 0.45), 2 + (i % 3), a * (0.3 + 0.3 * Math.sin(tm * (1 + h) + i))); }
  g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
}
function kzkParalaksCiz(o, tm) {   // uzak ve orta karlı sırtlar (ekrana göre; yoldan yavaş akar), altları dolu: boşluğun dünya tepelerini örter
  const a = o.parA; if (a < 0.01) return;
  const VHg = VH / cam.zoom, cx = cam.x, cy = cam.y;
  for (let k = 0; k < 2; k++) {
    const art = kzkTepeArt(k), W = art.w, f = k ? 0.3 : 0.1;
    const top = cy + VHg * ((k ? 0.5 : 0.38) + o.ucA * (k ? 0.34 : 0.24) * (o.uc === KZK_UCUS[1] ? 1.3 : 1)) - art.sirt + Math.sin(tm * 0.2 + k) * 3;
    let sx = -((o.v * f) % W); if (sx > 0) sx -= W;
    g.globalAlpha = a;
    for (let x = sx; x < VW + 2; x += W) g.drawImage(art.c, cx + x - 1, top, W + 2, art.h);
    g.fillStyle = art.alt; g.fillRect(cx - 2, top + art.h - 1, VW + 4, cy + VHg - top - art.h + 6);
    if (k === 1 && o.uc === KZK_UCUS[1] && o.ucA > 0.02) {   // ikinci uçuş: aşağıda vadide minicik ışıklı kulübe(ler)
      for (let x = sx + 820; x < VW + 60; x += W) {
        const bx = cx + x, by = top + art.sirt + 34, ka = a * o.ucA;
        g.globalCompositeOperation = 'lighter'; dglow('#ffc070', bx, by - 6, 46, 0.45 * ka); g.globalCompositeOperation = 'source-over';
        g.globalAlpha = ka; g.fillStyle = '#4d3a3c'; g.fillRect(bx - 9, by - 9, 18, 9); g.fillStyle = '#e9efff'; g.beginPath(); g.moveTo(bx - 12, by - 8); g.lineTo(bx, by - 17); g.lineTo(bx + 12, by - 8); g.fill();
        g.fillStyle = '#ffd28a'; g.fillRect(bx - 5, by - 6, 3.5, 3); g.fillRect(bx + 2, by - 6, 3.5, 3); g.globalAlpha = 1;
        const puf = kzkPufArt(); for (let q = 0; q < 3; q++) { const u = (tm * 0.2 + q / 3) % 1; g.globalAlpha = 0.3 * Math.sin(u * Math.PI) * ka; g.drawImage(puf, bx + 5 + u * 8 - 3 - u * 4, by - 20 - u * 24 - 3 - u * 4, 6 + u * 8, 6 + u * 8); }
        g.globalAlpha = 1;
      }
    }
  }
  g.globalAlpha = 1;
}
function kzkCamCiz(o, c, x, yb, s, k, a) { const art = kzkCamArt(k), w = 120 * s, h = 220 * s; if (a < 1) g.globalAlpha = a; g.drawImage(art, x - w / 2, yb - h * (214 / 220), w, h); if (a < 1) g.globalAlpha = 1; }
function kzkCamlarArka(o, tm) {
  const dx = o.dx, v0 = cam.x - 90 - dx, v1 = cam.x + VW + 90 - dx;
  for (const c of o.camArka) { if (c.v < v0 || c.v > v1) continue; kzkCamCiz(o, c, c.v + dx, kzkY(o, c.v) + 12 + c.dy, c.s, c.k, 1); }
}
function kzkCamlarOn(o, tm) {   // öndeki iri koyu çamlar: yoldan 1,3 kat hızlı akar (yakın), tabanları yolun altında
  const dx = o.dx, a = o.parA; if (a < 0.02) return;
  for (const c of o.camOn) {
    const sx = (c.v - o.v) * 1.3 + o.v + dx; if (sx < cam.x - 120 || sx > cam.x + VW + 120) continue;
    const vv = sx - dx; kzkCamCiz(o, c, sx, kzkY(o, vv) + 90, c.s, 3, a);
  }
}
function kzkYolParca(o, va, vb, solUc, sagUc, alt) {   // karlı yamaç parçası (dolu çokgen); uçlarda uçurum kenarı
  const dx = o.dx, n = Math.max(4, Math.ceil((vb - va) / 22));
  g.beginPath();
  if (solUc) { g.moveTo(va + dx - 46, alt); g.lineTo(va + dx - 20, kzkY(o, va) + 160); g.lineTo(va + dx, kzkY(o, va) + 26); }
  else g.moveTo(va + dx, alt);
  for (let i = 0; i <= n; i++) { const v = lerp(va, vb, i / n); g.lineTo(v + dx, kzkY(o, v)); }
  if (sagUc) { g.lineTo(vb + dx, kzkY(o, vb) + 26); g.lineTo(vb + dx + 20, kzkY(o, vb) + 160); g.lineTo(vb + dx + 46, alt); }
  else g.lineTo(vb + dx, alt);
  g.closePath(); g.fill();
}
function kzkKenar(o, va, vb, ofs) { const dx = o.dx, n = Math.max(3, Math.ceil((vb - va) / 22)); g.beginPath(); for (let i = 0; i <= n; i++) { const v = lerp(va, vb, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) + ofs); else g.moveTo(v + dx, kzkY(o, v) + ofs); } }
function kzkYolCiz(o, tm) {
  const a = o.yolA * (o.done ? 1 - smooth(clamp(o.gidisT / 2.5, 0, 1)) : 1); if (a < 0.01) return;
  const K = o.K, dx = o.dx, VHg = VH / cam.zoom, alt = cam.y + VHg + 40;
  const v0 = Math.max(-260, cam.x - 70 - dx), v1 = Math.min(K.vJ + 60, cam.x + VW + 70 - dx);
  if (v1 <= v0) return;
  g.globalAlpha = a;
  const kb0 = KZK_KOPRU[0], kb1 = KZK_KOPRU[1], kc0 = kb0 + 50, kc1 = kb1 - 50, kopru = v1 > kb0 - 60 && v0 < kb1 + 60;
  if (kopru) kzkVadiCiz(o, tm, kc0, kc1, alt);
  // parçalar (köprünün altı boş)
  const parcalar = [];
  if (kopru) { if (v0 < kc0) parcalar.push([v0, Math.min(v1, kc0), false, v1 > kc0]); if (v1 > kc1) parcalar.push([Math.max(v0, kc1), v1, v0 < kc1, false]); }
  else parcalar.push([v0, v1, false, false]);
  const sonUc = v1 >= K.vJ;
  for (const p of parcalar) {
    g.fillStyle = '#c7d0f1'; kzkYolParca(o, p[0], p[1], p[2], p[3] || (sonUc && p[1] >= K.vJ), alt);
    g.fillStyle = '#aeb8e4'; g.globalAlpha = a * 0.55;   // derin kar katmanı
    g.beginPath(); { const n = Math.max(4, Math.ceil((p[1] - p[0]) / 22)); g.moveTo(p[0] + dx + (p[2] ? 20 : 0), alt); for (let i = 0; i <= n; i++) { const v = lerp(p[0], p[1], i / n); g.lineTo(v + dx, kzkY(o, v) + 70 + Math.sin(v * 0.006) * 14); } g.lineTo(p[1] + dx - (p[3] ? 20 : 0), alt); g.closePath(); g.fill(); }
    g.globalAlpha = a;
    // yüzey gölgesi ve parlak kenar
    g.lineCap = 'round'; g.lineJoin = 'round';
    g.strokeStyle = 'rgba(140,152,215,.30)'; g.lineWidth = 18; kzkKenar(o, p[0], p[1], 15); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 7; kzkKenar(o, p[0], p[1], 2.5); g.stroke();
    g.strokeStyle = '#f7f9ff'; g.lineWidth = 2.2; kzkKenar(o, p[0], p[1], 0); g.stroke();
  }
  // karda parıltılar
  g.globalCompositeOperation = 'lighter';
  for (let i = Math.floor(v0 / 46); i <= Math.ceil(v1 / 46); i++) {
    const h = ((i * 2654435761) >>> 0) / 4294967296; if (h < 0.45) continue;
    const v = i * 46 + h * 30; if (kopru && v > kc0 && v < kc1) continue;
    const al = Math.sin(tm * 2.3 + i * 1.7) * 0.5 + 0.2; if (al <= 0) continue;
    dglow('#ffffff', v + dx, kzkY(o, v) + 6 + h * 34, 3 + h * 3, al * a);
  }
  g.globalCompositeOperation = 'source-over';
  kzkGolCiz(o, tm, v0, v1, a);
  if (kopru) kzkKopruCiz(o, tm, a);
  g.globalAlpha = 1;
}
function kzkVadiCiz(o, tm, va, vb, alt) {   // köprünün altındaki derin vadi: koyu mavi, dipte donmuş derenin ışığı, uçuşan sis
  const dx = o.dx;
  g.fillStyle = '#2a3168'; g.beginPath(); g.moveTo(va + dx - 40, alt); g.lineTo(va + dx - 20, kzkY(o, va) + 40);
  g.lineTo(vb + dx + 20, kzkY(o, vb) + 40); g.lineTo(vb + dx + 40, alt); g.closePath(); g.fill();
  const dy = (kzkY(o, va) + kzkY(o, vb)) / 2 + 300;
  g.fillStyle = '#3c4685'; g.beginPath(); g.ellipse((va + vb) / 2 + dx, dy + 30, (vb - va) * 0.6, 60, 0, 0, 6.2832); g.fill();
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) { const x = lerp(va, vb, (i + 0.5) / 6) + dx; dglow(i % 2 ? '#9fe6ff' : '#c4a6ff', x, dy + Math.sin(tm + i) * 4, 80, 0.16); }
  g.strokeStyle = 'rgba(190,240,255,.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(va + dx, dy); g.quadraticCurveTo((va + vb) / 2 + dx, dy + 18, vb + dx, dy); g.stroke();
  g.globalCompositeOperation = 'source-over';
  const puf = kzkPufArt();
  for (let i = 0; i < 5; i++) { const u = ((tm * 0.05 + i * 0.21) % 1), x = lerp(va, vb, u) + dx, y = dy - 60 - i * 26; g.globalAlpha = 0.18 * Math.sin(u * Math.PI); g.drawImage(puf, x - 80, y - 25, 160, 50); }
  g.globalAlpha = 1;
}
function kzkKopruCiz(o, tm, a) {   // buz köprüsü: saydam buz kemer, sarkan buz sarkıtları, renkli ışıklı kristal direkler
  const dx = o.dx, va = KZK_KOPRU[0] + 20, vb = KZK_KOPRU[1] - 20, n = 30;
  g.globalAlpha = a * 0.5; g.fillStyle = '#9fd8ff'; g.beginPath();
  for (let i = 0; i <= n; i++) { const v = lerp(va, vb, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) + 12); else g.moveTo(v + dx, kzkY(o, v) + 12); }
  for (let i = n; i >= 0; i--) { const u = i / n, v = lerp(va, vb, u); g.lineTo(v + dx, kzkY(o, v) + 14 + Math.sin(u * Math.PI) * 62); }
  g.closePath(); g.fill();
  g.globalAlpha = a; g.strokeStyle = 'rgba(230,248,255,.8)'; g.lineWidth = 1.6; g.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(va, vb, u); if (i) g.lineTo(v + dx, kzkY(o, v) + 14 + Math.sin(u * Math.PI) * 62); else g.moveTo(v + dx, kzkY(o, v) + 14); }
  g.stroke();
  // döşeme
  g.fillStyle = 'rgba(205,240,255,.95)'; g.beginPath();
  for (let i = 0; i <= n; i++) { const v = lerp(va - 30, vb + 30, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) - 1); else g.moveTo(v + dx, kzkY(o, v) - 1); }
  for (let i = n; i >= 0; i--) { const v = lerp(va - 30, vb + 30, i / n); g.lineTo(v + dx, kzkY(o, v) + 13); }
  g.closePath(); g.fill();
  g.strokeStyle = '#ffffff'; g.lineWidth = 2; kzkKenar(o, va - 30, vb + 30, -1); g.stroke();
  // buz sarkıtları
  g.fillStyle = 'rgba(225,246,255,.85)'; g.beginPath();
  for (let v = va; v < vb; v += 24) { const y = kzkY(o, v) + 13, l = 8 + ((v * 7) % 13); g.moveTo(v + dx - 4, y); g.lineTo(v + dx, y + l); g.lineTo(v + dx + 4, y); }
  g.fill();
  // kristal direkler ve korkuluk
  g.strokeStyle = 'rgba(190,235,255,.75)'; g.lineWidth = 1.4; kzkKenar(o, va, vb, -28); g.stroke();
  for (let i = 0; i <= 5; i++) {
    const v = lerp(va, vb, i / 5), x = v + dx, y = kzkY(o, v), c = KZK_REN[i % 4];
    g.fillStyle = 'rgba(210,240,255,.9)'; g.fillRect(x - 2, y - 30, 4, 30);
    g.fillStyle = c; g.beginPath(); g.moveTo(x, y - 44); g.lineTo(x + 6, y - 34); g.lineTo(x, y - 26); g.lineTo(x - 6, y - 34); g.closePath(); g.fill();
    dglow(c, x, y - 35, 30, (0.45 + 0.25 * Math.sin(tm * 2 + i)) * a);
  }
}
function kzkTunelArka(o, tm) {   // kardan tünel (Feza'nın arkası): kar tepeciği, içi loş buz mavisi, tavanda parlayan kristaller
  const dx = o.dx, ta = KZK_TUNEL[0], tb = KZK_TUNEL[1];
  if (tb + dx < cam.x - 100 || ta + dx > cam.x + VW + 100) return;
  const a = o.yolA, n = 40, ust = u => KZK_TAVAN + 30 + 70 * Math.pow(Math.sin(u * Math.PI), 0.5) + 14 * Math.sin(u * 23);
  g.globalAlpha = a;
  g.fillStyle = '#d3dbf6'; g.beginPath();
  g.moveTo(ta + dx - 90, kzkY(o, ta - 90));
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(ta, tb, u); g.lineTo(v + dx, kzkY(o, v) - ust(u) * smooth(clamp(Math.min(u, 1 - u) * 14, 0, 1))); }
  g.lineTo(tb + dx + 90, kzkY(o, tb + 90)); g.closePath(); g.fill();
  g.strokeStyle = '#f7f9ff'; g.lineWidth = 2.5; g.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(ta, tb, u), y = kzkY(o, v) - ust(u) * smooth(clamp(Math.min(u, 1 - u) * 14, 0, 1)); if (i) g.lineTo(v + dx, y); else g.moveTo(v + dx, y); }
  g.stroke();
  // iç: girişte ve çıkışta yay biçiminde açılan loş oyuk
  const ic = u => { const e = Math.min(u, 1 - u) * (tb - ta) / 70; return KZK_TAVAN * Math.sqrt(clamp(e, 0, 1) * (2 - clamp(e, 0, 1))); };
  g.fillStyle = '#56649f'; g.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(ta, tb, u); if (i) g.lineTo(v + dx, kzkY(o, v) - ic(u)); else g.moveTo(v + dx, kzkY(o, v) - ic(u)); }
  for (let i = n; i >= 0; i--) { const u = i / n, v = lerp(ta, tb, u); g.lineTo(v + dx, kzkY(o, v) + 2); }
  g.closePath(); g.fill();
  g.fillStyle = '#6b79b6'; g.beginPath();   // iç duvarın aydınlık alt kısmı
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(ta, tb, u); if (i) g.lineTo(v + dx, kzkY(o, v) - ic(u) * 0.45); else g.moveTo(v + dx, kzkY(o, v) - ic(u) * 0.45); }
  for (let i = n; i >= 0; i--) { const u = i / n, v = lerp(ta, tb, u); g.lineTo(v + dx, kzkY(o, v) + 2); }
  g.closePath(); g.fill();
  // tavandaki kristaller (renkli, nabızlı)
  g.globalCompositeOperation = 'lighter';
  for (let v = ta + 90, i = 0; v < tb - 80; v += 85, i++) {
    const u = (v - ta) / (tb - ta), x = v + dx, y = kzkY(o, v) - ic(u) + 10, c = KZK_REN[i % 4], p = 0.55 + 0.35 * Math.sin(tm * 2.4 + i * 1.3);
    dglow(c, x, y + 8, 44, 0.35 * p * a); dglow('#ffffff', x, y + 4, 8, 0.6 * p * a);
  }
  g.globalCompositeOperation = 'source-over';
  for (let v = ta + 90, i = 0; v < tb - 80; v += 85, i++) {
    const u = (v - ta) / (tb - ta), x = v + dx, y = kzkY(o, v) - ic(u);
    g.fillStyle = 'rgba(225,246,255,.9)'; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x, y + 18 + (i % 3) * 5); g.lineTo(x + 5, y); g.fill();
  }
  g.globalAlpha = 1;
}
function kzkTunelOn(o, tm) {   // tünelin önü: saydam buz tülü + girişte ve çıkışta opak kar kemer
  const dx = o.dx, ta = KZK_TUNEL[0], tb = KZK_TUNEL[1];
  if (tb + dx < cam.x - 100 || ta + dx > cam.x + VW + 100) return;
  const n = 36, ic = u => { const e = Math.min(u, 1 - u) * (tb - ta) / 70; return KZK_TAVAN * Math.sqrt(clamp(e, 0, 1) * (2 - clamp(e, 0, 1))); };
  g.globalAlpha = 0.12 * o.yolA; g.fillStyle = '#e4ecff'; g.beginPath();
  for (let i = 0; i <= n; i++) { const u = i / n, v = lerp(ta, tb, u); if (i) g.lineTo(v + dx, kzkY(o, v) - ic(u)); else g.moveTo(v + dx, kzkY(o, v) - ic(u)); }
  for (let i = n; i >= 0; i--) { const u = i / n, v = lerp(ta, tb, u); g.lineTo(v + dx, kzkY(o, v) + 2); }
  g.closePath(); g.fill();
  g.globalAlpha = o.yolA; g.lineCap = 'round';
  for (const [u0, u1] of [[0, 0.07], [0.93, 1]]) {
    g.strokeStyle = '#e8eeff'; g.lineWidth = 20; g.beginPath();
    for (let i = 0; i <= 12; i++) { const u = lerp(u0, u1, i / 12), v = lerp(ta, tb, u); if (i) g.lineTo(v + dx, kzkY(o, v) - ic(u) - 6); else g.moveTo(v + dx, kzkY(o, v) - ic(u) - 6); }
    g.stroke();
    g.strokeStyle = 'rgba(150,165,225,.6)'; g.lineWidth = 4; g.stroke();
  }
  g.globalAlpha = 1;
}
function kzkGolCiz(o, tm, v0, v1, a) {   // buzlu göl: parlak buz yüzeyi, yansıma çizgileri, buzda parıltılar
  const ga = Math.max(v0, KZK_GOL[0]), gb = Math.min(v1, KZK_GOL[1]); if (gb <= ga) return;
  const dx = o.dx, n = Math.max(3, Math.ceil((gb - ga) / 30));
  g.fillStyle = '#a9d8f2'; g.beginPath();
  for (let i = 0; i <= n; i++) { const v = lerp(ga, gb, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) - 1); else g.moveTo(v + dx, kzkY(o, v) - 1); }
  for (let i = n; i >= 0; i--) { const v = lerp(ga, gb, i / n); g.lineTo(v + dx, kzkY(o, v) + 46); }
  g.closePath(); g.fill();
  g.globalAlpha = a * 0.5; g.fillStyle = '#d6f1ff'; g.beginPath();
  for (let i = 0; i <= n; i++) { const v = lerp(ga, gb, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) - 1); else g.moveTo(v + dx, kzkY(o, v) - 1); }
  for (let i = n; i >= 0; i--) { const v = lerp(ga, gb, i / n); g.lineTo(v + dx, kzkY(o, v) + 14); }
  g.closePath(); g.fill(); g.globalAlpha = a;
  // derin buz gövdesi (ekranın altına kadar), yansıyan çamlar ve kuzey ışığı, buz çatlakları, kıyıda karlı kayalar
  const alt = cam.y + VH / cam.zoom + 40;
  g.fillStyle = '#7f9fdb'; g.beginPath();
  for (let i = 0; i <= n; i++) { const v = lerp(ga, gb, i / n); if (i) g.lineTo(v + dx, kzkY(o, v) + 44); else g.moveTo(v + dx, kzkY(o, v) + 44); }
  g.lineTo(gb + dx, alt); g.lineTo(ga + dx, alt); g.closePath(); g.fill();
  const cam3 = kzkCamArt(1);
  g.globalAlpha = a * 0.22;
  for (let v = Math.floor(ga / 210) * 210 + 60; v < gb - 40; v += 210) { const s = 0.7 + ((v * 13) % 7) / 14, w = 120 * s, h = 220 * s, y = kzkY(o, v) + 8; g.save(); g.translate(v + dx, y); g.scale(1, -0.75); g.drawImage(cam3, -w / 2, -h, w, h); g.restore(); }
  g.globalAlpha = a; g.globalCompositeOperation = 'lighter';
  for (let v = Math.floor(ga / 260) * 260; v < gb; v += 260) dglow(KZK_REN[(v / 260 | 0) % 4], v + dx + Math.sin(tm * 0.5 + v) * 20, kzkY(o, v) + 120, 120, 0.12 + 0.2 * o.isik);
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = 'rgba(230,246,255,.45)'; g.lineWidth = 1; g.beginPath();
  for (let v = Math.floor(ga / 330) * 330 + 100; v < gb - 60; v += 330) { const y = kzkY(o, v) + 70 + (v % 90); g.moveTo(v + dx, y); g.lineTo(v + dx + 24, y + 14); g.lineTo(v + dx + 18, y + 40); g.moveTo(v + dx + 24, y + 14); g.lineTo(v + dx + 56, y + 20); }
  g.stroke();
  for (const e of [KZK_GOL[0], KZK_GOL[1]]) { if (e + dx < cam.x - 120 || e + dx > cam.x + VW + 120) continue; const y = kzkY(o, e);
    g.fillStyle = '#5a5f9a'; g.beginPath(); g.ellipse(e + dx, y + 14, 46, 26, 0, 0, 6.2832); g.fill(); g.beginPath(); g.ellipse(e + dx + 30, y + 22, 26, 16, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#eef3ff'; g.beginPath(); g.ellipse(e + dx - 4, y - 6, 40, 13, 0, 0, 6.2832); g.ellipse(e + dx + 30, y + 8, 22, 8, 0, 0, 6.2832); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.4; g.lineCap = 'round'; g.beginPath();
  for (let v = Math.floor(ga / 90) * 90; v < gb; v += 90) { const h = ((v * 9301 + 49297) % 233280) / 233280, y = kzkY(o, v) + 18 + h * 22; g.moveTo(v + dx, y); g.lineTo(v + dx + 30 + h * 40, y); }
  g.stroke();
  g.strokeStyle = '#ffffff'; g.lineWidth = 2; kzkKenar(o, ga, gb, -1); g.stroke();
  g.globalCompositeOperation = 'lighter';
  for (let v = Math.floor(ga / 70) * 70; v < gb; v += 70) { const al = Math.sin(tm * 3 + v * 0.05) * 0.5 + 0.2; if (al > 0) dglow(KZK_REN[(v / 70 | 0) % 4], v + dx, kzkY(o, v) + 8, 10, al * a); }
  g.globalCompositeOperation = 'source-over';
}
function kzkKulubeCiz(o, tm) {   // ikinci uçuşun altında, vadide ışıklı küçük kulübe (pencerelerinde sıcak ışık, bacasından duman)
  const v = KZK_KULUBE, x = v + o.dx; if (x < cam.x - 200 || x > cam.x + VW + 200) return;
  const y = kzkY(o, v) + 6;
  g.globalCompositeOperation = 'lighter'; dglow('#ffcf8a', x, y - 30, 130, 0.35 + 0.05 * Math.sin(tm * 2)); g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#6b4a3c'; g.fillRect(x - 46, y - 52, 92, 52);
  g.strokeStyle = '#4a3229'; g.lineWidth = 1.2; g.beginPath(); for (let k = 1; k < 5; k++) { g.moveTo(x - 46, y - 52 + k * 10.4); g.lineTo(x + 46, y - 52 + k * 10.4); } g.stroke();
  g.fillStyle = '#3d2a24'; g.fillRect(x + 18, y - 92, 12, 30);
  g.fillStyle = '#e9efff'; g.beginPath(); g.moveTo(x - 62, y - 46); g.lineTo(x, y - 92); g.lineTo(x + 62, y - 46); g.quadraticCurveTo(x, y - 54, x - 62, y - 46); g.fill();
  g.fillStyle = '#ffd28a'; for (const wx of [-30, 10]) g.fillRect(x + wx, y - 38, 18, 16);
  g.fillStyle = '#ffb35c'; g.fillRect(x - 6, y - 30, 12, 30);
  g.strokeStyle = '#6b4a3c'; g.lineWidth = 1.5; g.beginPath(); for (const wx of [-30, 10]) { g.moveTo(x + wx + 9, y - 38); g.lineTo(x + wx + 9, y - 22); g.moveTo(x + wx, y - 30); g.lineTo(x + wx + 18, y - 30); } g.stroke();
  g.globalCompositeOperation = 'lighter'; for (const wx of [-21, 19]) dglow('#ffd28a', x + wx, y - 30, 26, 0.6); g.globalCompositeOperation = 'source-over';
  const puf = kzkPufArt();
  for (let k = 0; k < 4; k++) { const u = (tm * 0.18 + k / 4) % 1; g.globalAlpha = 0.35 * Math.sin(u * Math.PI); const r = 8 + u * 22; g.drawImage(puf, x + 24 + u * 30 - r, y - 96 - u * 90 - r, r * 2, r * 2); }
  g.globalAlpha = 1;
}
function kzkBulutlarCiz(o, tm, on) {   // ikinci uçuşun bulutları: kümelenmiş yumuşak bulutçuklar; öndekiler yarı saydam geçer
  if (!o.bulutlar || o.ucA < 0.01 && !o.ucuyor) return;
  const puf = kzkPufArt(), dx = o.dx;
  for (const b of o.bulutlar) {
    if (b.on !== on) continue;
    const x = b.v + dx + (on ? (b.v - o.v) * 0.25 : 0), w = 300 * b.s; if (x < cam.x - w || x > cam.x + VW + w) continue;
    const y = kzkLane(o, b.v) + o.dy + b.y + Math.sin(tm * 0.4 + b.f) * 6;
    g.globalAlpha = on ? 0.42 : 0.75;
    for (let k = 0; k < 6; k++) { const px = x + (k - 2.5) * 44 * b.s, py = y - Math.sin((k + 0.5) / 6 * Math.PI) * 30 * b.s, r = (44 + (k % 3) * 14) * b.s; g.drawImage(puf, px - r, py - r * 0.75, r * 2, r * 1.5); }
  }
  g.globalAlpha = 1;
}
function kzkPerdeCiz(o, tm, on) {   // kuzey ışığı perdesi (dünyada): yumuşak, dalgalanan ışık sütunları; kızak içinden geçer
  const VHg = VH / cam.zoom;
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < KZK_PERDE.length; i++) {
    const v = KZK_PERDE[i], x0 = v + o.dx; if (x0 < cam.x - 400 || x0 > cam.x + VW + 400) continue;
    const top = cam.y - 60, h = VHg + 120;
    for (let k = 0; k < 3; k++) {
      const tex = kzkAuroraArt((k + i) % 3);
      for (let j = 0; j < 12; j++) {
        const u = j / 11, x = x0 - 200 + j * 36 + Math.sin(tm * 0.9 + j * 0.6 + k * 2) * 26, ta = Math.pow(Math.sin(u * Math.PI), 1.2);
        const yb = top + h * (0.78 + 0.1 * Math.sin(tm * 0.7 + j * 0.5 + k)), hh = h * (0.95 + 0.1 * Math.sin(tm + j));
        g.globalAlpha = (on ? 0.1 : 0.22) * ta * (0.7 + 0.3 * Math.sin(tm * 1.7 + j + k)); g.drawImage(tex, x - 54, yb - hh * 0.87, 108, hh);
      }
    }
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function kzkUcIzAdim(o, dt) {   // uçuş izi: ~60 Hz örnek (sanal yolda; arkada uzun bir şerit olarak akar)
  if (!o.ucuyor && o.ucIzN === 0) return;
  o.ucIzT += dt;
  if (o.ucIzT < 1 / 60) return; o.ucIzT = 0;
  if (!o.ucuyor) { o.ucIzN = Math.max(0, o.ucIzN - 2); return; }
  const I = o.ucIzI * 2; o.ucIz[I] = o.mx - 40 - o.dx; o.ucIz[I + 1] = o.my - 6 - o.dy;
  o.ucIzI = (o.ucIzI + 1) % 48; o.ucIzN = Math.min(48, o.ucIzN + 1);
}
function kzkUcIzCiz(o, tm) {
  if (o.ucIzN < 3) return;
  const dx = o.dx, dy = o.dy, N = o.ucIzN, pa = o.perdeA;
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round'; g.lineJoin = 'round';
  const serit = (oran, w, col, ofs) => {
    const m = Math.max(2, Math.floor(N * oran)); g.strokeStyle = col; g.lineWidth = w; g.beginPath();
    for (let j = 0; j < m; j++) { const i = (o.ucIzI - 1 - j + 48) % 48, x = o.ucIz[i * 2] + dx, y = o.ucIz[i * 2 + 1] + dy + ofs + Math.sin(j * 0.5 - tm * 8) * j * 0.1; if (j) g.lineTo(x, y); else g.moveTo(x, y); }
    g.stroke();
  };
  if (pa > 0.02) { serit(1, 10, 'rgba(141,255,200,' + (0.35 * pa).toFixed(2) + ')', -12); serit(1, 10, 'rgba(255,159,216,' + (0.35 * pa).toFixed(2) + ')', 0); serit(1, 10, 'rgba(196,166,255,' + (0.35 * pa).toFixed(2) + ')', 12); }
  serit(1, 14, 'rgba(200,220,255,.10)', 0);
  serit(0.5, 4, 'rgba(255,255,255,.35)', 0);
  g.globalCompositeOperation = 'source-over';
  for (let j = 3; j < N; j += 5) { const i = (o.ucIzI - 1 - j + 48) % 48; kzkParilti(o.ucIz[i * 2] + dx, o.ucIz[i * 2 + 1] + dy, 2.4 * (1 - j / N) + 1, 1 + (j / 5 | 0) % 4, (1 - j / N) * (0.6 + 0.4 * Math.sin(tm * 8 + j))); }
}
function kzkIzCiz(o) {   // karda kayak izleri: iki ince çizgi (gölge + parlak kenar)
  const dx = o.dx, v0 = cam.x - 40 - dx, v1 = cam.x + VW + 40 - dx;
  g.lineCap = 'round';
  for (const [ofs, col, w] of [[4.5, 'rgba(110,122,196,.55)', 1.8], [8, 'rgba(110,122,196,.45)', 1.6], [5.6, 'rgba(255,255,255,.6)', 0.8]]) {
    g.strokeStyle = col; g.lineWidth = w; g.beginPath();
    for (let j = 0; j < o.izN; j++) {
      const i = (o.izK - j + 20) % 20, a = Math.max(o.izler[i * 2], v0), b = Math.min(o.izler[i * 2 + 1], v1);
      if (b - a < 4) continue;
      const n = Math.max(2, Math.ceil((b - a) / 24));
      for (let k = 0; k <= n; k++) { const v = lerp(a, b, k / n); if (kzkKopruda(v) && false) continue; if (k) g.lineTo(v + dx, kzkY(o, v) + ofs); else g.moveTo(v + dx, kzkY(o, v) + ofs); }
    }
    g.stroke();
  }
}
function kzkTanelerCiz(o, tm) {
  const dx = o.dx, VHg = VH / cam.zoom, sira = o.faz === 'yol' ? kzkSonraki(o) : null;
  for (const r of o.taneler) {
    if (r.d === 'bitti') continue;
    let x = r.v + dx; if (x < cam.x - 80 || x > cam.x + VW + 80) continue;
    let y = kzkTaneY(o, r) + Math.sin(tm * 2 + r.faz) * 5, a = 1, sc = 1;
    const kr = r.tip === 'k';
    if (r.d === 'alindi') { const u = clamp(r.t / 0.5, 0, 1); a = 1 - u; sc = 1 + u * 1.4; dglow('#ffffff', x, y, 30 + u * 60, (1 - u) * 0.8); if (u >= 1) continue; }
    else if (r.d === 'kacti') { const u = clamp(r.t / 2.4, 0, 1); y -= smooth(u) * 260; x += u * 40; a = (1 - u) * 0.7; sc = 1 - u * 0.5; }
    const nab = r === sira ? o.ipucu * (0.5 + 0.5 * Math.sin(tm * 5)) : 0;
    g.globalCompositeOperation = 'lighter';
    dglow(KZK_REN[r.ci], x, y, (kr ? 58 : 34) * sc + nab * 30, (0.35 + nab * 0.4) * a);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = a;
    if (kr) { const s = 46 * sc * (1 + 0.06 * Math.sin(tm * 3 + r.i)); g.save(); g.translate(x, y); g.rotate(tm * 0.6 + r.i); g.drawImage(kzkKristalArt(r.ci), -s / 2, -s / 2, s, s); g.restore(); }
    else { const s = 26 * sc * (1 + 0.1 * Math.sin(tm * 4 + r.faz)); g.drawImage(kzkTaneArt(r.ci), x - s / 2, y - s / 2, s, s); }
    g.globalAlpha = 1;
    if (r.d === 'bekle') { const an = tm * 2 + r.i; kzkParilti(x + Math.cos(an) * (kr ? 26 : 16), y + Math.sin(an) * (kr ? 26 : 16), kr ? 3.4 : 2.4, 0, 0.5 + 0.5 * Math.cos(an)); }
  }
}
function kzkKristallerCiz(o, tm) {
  for (const k of o.kristaller) {
    if (k.d === 'bitti' || k.x < cam.x - 100 || k.x > cam.x + VW + 100) continue;
    let a = 1, sc = 1.2;
    if (k.d === 'alindi') { const u = clamp(k.t / 0.7, 0, 1); a = 1 - u * u; sc = 1.2 + u * 1.2; dglow('#ffffff', k.x, k.y, 50 + u * 100, (1 - u) * 0.7); }
    g.globalCompositeOperation = 'lighter'; dglow(KZK_REN[k.i % 4], k.x, k.y, 80 * sc, 0.4 * a); g.globalCompositeOperation = 'source-over';
    const s = 48 * sc; g.globalAlpha = a; g.save(); g.translate(k.x, k.y); g.rotate(tm * 1.2 + k.i); g.drawImage(kzkKristalArt(k.i % 4), -s / 2, -s / 2, s, s); g.restore(); g.globalAlpha = 1;
  }
}

// ── çizim: binekler (geyik, kızak, Feza, kardan adam, Pırıl) ──
function kzkGeyikCiz(o, x, y, rot, tm, cek) {
  const G = o.gOpt, GO = typeof GEYIK !== 'undefined' && GEYIK && GEYIK.o && GEYIK.o.gy ? GEYIK.o.gy : null;
  G.zipla = o.gzip; G.cek = cek; G.parla = o.ucuyor ? 1 : o.faz === 'hiz' ? 0.6 : o.isik * 0.4; G.sevinc = o.faz === 'inis' || o.done ? 1 : o.sevT > 0.3 ? 0.6 : 0;
  G.renkler = GO && GO.renkler && GO.renkler.length ? GO.renkler : null;
  const kris = GO && GO.renkler ? GO.renkler.length / 10 : (typeof V7 !== 'undefined' ? V7.fener / 10 : 0);
  G.kristal = clamp(Math.max(kris, o.isik * 0.6), 0, 1);
  g.save(); g.translate(x, y); g.rotate(rot);
  let kx = 14, ky = -34;
  if (typeof geyikCiz === 'function') {
    try { geyikCiz(g, 0, 0, KZK_GS, o.gt, G); if (cek > 0.02 && typeof GEYIK !== 'undefined') { kx = GEYIK.kosum.x; ky = GEYIK.kosum.y; } }
    catch (e) { kzkGeyikYedek(o, tm); }
  } else kzkGeyikYedek(o, tm);
  g.restore();
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: x + kx * c - ky * s, y: y + kx * s + ky * c };
}
function kzkGeyikYedek(o, tm) {   // geyik.js yoksa basit, sevimli yavru ren geyiği (sağa bakar; 0,0 toynak tabanı)
  const k = o.gt * 10, uc = o.gzip > 0.3;
  const bacak = (bx, ph) => { const a = uc ? 0.6 * (bx > 0 ? -1 : 1) : Math.sin(k + ph) * 0.6 * o.gOpt.kos; g.save(); g.translate(bx, -26); g.rotate(a); g.fillStyle = '#8a5a3c'; g.fillRect(-2.5, 0, 5, 24); g.fillStyle = '#4a3030'; g.fillRect(-2.8, 21, 5.6, 4); g.restore(); };
  bacak(-14, 0); bacak(12, Math.PI);
  g.fillStyle = '#b98257'; g.beginPath(); g.ellipse(0, -36, 22, 13, 0, 0, 6.2832); g.fill();
  g.fillStyle = '#ead2b0'; g.beginPath(); g.ellipse(2, -29, 15, 6, 0, 0, 6.2832); g.fill();
  bacak(-10, Math.PI); bacak(15, 0);
  g.fillStyle = '#b98257'; g.beginPath(); g.moveTo(12, -42); g.quadraticCurveTo(20, -58, 26, -62); g.lineTo(32, -55); g.quadraticCurveTo(26, -46, 22, -34); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(31, -64, 11, 8, 0.3, 0, 6.2832); g.fill();
  g.fillStyle = '#ead2b0'; g.beginPath(); g.ellipse(39, -60, 6, 4.5, 0.3, 0, 6.2832); g.fill();
  g.fillStyle = '#ee9fae'; g.beginPath(); g.arc(44, -61, 2.6, 0, 6.2832); g.fill();
  g.fillStyle = '#3a2a2a'; g.beginPath(); g.arc(32, -67, 2.1, 0, 6.2832); g.fill();
  g.strokeStyle = '#e8d3a8'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(27, -71); g.quadraticCurveTo(22, -84, 16, -90); g.moveTo(22, -82); g.lineTo(28, -88); g.stroke();
  dglow(KZK_REN[0], 16, -90, 9, 0.7 * o.isik + 0.2);
  g.fillStyle = '#d9454f'; g.fillRect(18, -50, 9, 4);
}
function kzkKardanCiz(o, x, y, rot, tm) {   // kardan adam kendi küçük mavi kızağında (kardanCiz varsa onu kullanır)
  const art = kzkKizakArt(1), s = 0.7;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.drawImage(art.arka, -60, -56, 120, 70);
  g.restore();
  g.save(); g.translate(x, y); g.rotate(rot);
  let ok = false;
  if (typeof kardanCiz === 'function') { try { kardanCiz(g, -2, -12, 0.62, tm, { poz: 'kay', yon: 1, kizak: 1, mutlu: 1, sevinc: o.sevT > 0.3 ? 1 : 0.4, ruzgar: clamp(o.spd / KZK_VF, 0, 1) }); ok = true; } catch (e) { ok = false; } }
  if (!ok) kzkKardanYedek(o, tm);
  g.scale(s, s); g.drawImage(art.on, -60, -56, 120, 70);
  g.restore();
}
function kzkKardanYedek(o, tm) {   // üç kar topu, havuç burun, kömür gözler, kırmızı atkı, şapka, dal kollar havada
  const sal = Math.sin(tm * 6) * 0.15, rz = clamp(o.spd / KZK_VF, 0.2, 1);
  g.fillStyle = '#eef2ff';
  g.beginPath(); g.arc(-2, -24, 15, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(0, -44, 11, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(1, -60, 8.5, 0, 6.2832); g.fill();
  g.fillStyle = 'rgba(160,172,225,.5)'; g.beginPath(); g.arc(-6, -20, 9, 0, 6.2832); g.fill();
  g.strokeStyle = '#6b4a35'; g.lineWidth = 1.8; g.lineCap = 'round'; g.beginPath();
  g.moveTo(-8, -46); g.lineTo(-20, -60 + sal * 20); g.moveTo(-16, -55 + sal * 18); g.lineTo(-20, -52); g.moveTo(8, -46); g.lineTo(18, -62 - sal * 20); g.stroke();
  g.fillStyle = '#ff9a3c'; g.beginPath(); g.moveTo(8, -61); g.lineTo(17, -59); g.lineTo(8, -57.5); g.fill();
  g.fillStyle = '#2a2a3a'; g.beginPath(); g.arc(3, -63, 1.4, 0, 6.2832); g.arc(-1.5, -63.5, 1.4, 0, 6.2832); g.fill();
  for (const yy of [-48, -41]) { g.beginPath(); g.arc(4, yy, 1.4, 0, 6.2832); g.fill(); }
  g.fillStyle = '#d9454f'; g.fillRect(-8, -54, 17, 4);
  g.beginPath(); g.moveTo(-6, -53); g.quadraticCurveTo(-18 - rz * 8, -54 + Math.sin(tm * 12) * 3, -24 - rz * 10, -50 + Math.sin(tm * 12 + 1) * 4); g.lineTo(-22 - rz * 8, -46); g.quadraticCurveTo(-14, -50, -6, -50); g.fill();
  g.fillStyle = '#2b2b40'; g.fillRect(-6, -76, 13, 9); g.fillRect(-9, -68, 19, 2.6);
}
function kzkBinicilerCiz(o, tm) {
  const art = kzkKizakArt(0), f = o.fzOpt, sq = clamp(o.sq || 0, -1, 1);
  const zipKizak = o.faz === 'binis' && o.t < KZK_BINIS * 0.55;
  // kardan adam (arkada) + ona bağlı ip
  if (o.kardanVar) {
    const kr = o.faz === 'yol' || o.faz === 'hiz' ? Math.atan((kzkP(o, o.v - KZK_KAR + 15) - kzkP(o, o.v - KZK_KAR - 15)) / 30) : o.rot * 0.6;
    const c = Math.cos(o.rot), s = Math.sin(o.rot), bx = o.mx + (-46) * c - (-10) * s, by = o.my + (-46) * s + (-10) * c;
    const kc = Math.cos(kr), ks = Math.sin(kr), fx = o.kax + 36 * kc - (-10) * ks, fy = o.kay + 36 * ks + (-10) * kc;
    g.strokeStyle = '#7a4a30'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(fx, fy); g.quadraticCurveTo((fx + bx) / 2, Math.max(fy, by) + 10 - Math.min(20, Math.abs(bx - fx) * 0.05), bx, by); g.stroke();
    g.globalAlpha = o.kardanA; kzkKardanCiz(o, o.kax, o.kay, kr, tm); g.globalAlpha = 1;
  }
  // kızak + Feza
  const havada = !o.ucuyor && !o.inisBekle && o.havaT > 0.28 && o.h > 45 || o.faz === 'sicrama';
  if (havada) o.kayma = 1; else if (o.yerT > 0.2 || o.faz !== 'yol' && o.faz !== 'hiz') o.kayma = 0;
  const poz = o.kayma ? 'kayma' : 'binis';
  f.vy = o.faz === 'sicrama' ? 0 : o.vy * 0.35; f.sevinc = Math.max(smooth(clamp(o.sevT / 0.4, 0, 1)), o.faz === 'hiz' ? 0.3 + 0.3 * Math.sin(o.total * 2.4) : 0);
  f.aci = 0.04 * Math.max(0, -sq); f.ruzgar = clamp(0.45 + o.spd / 1100, 0.45, 1);
  let el = null;
  g.save(); g.translate(o.mx, o.my); g.rotate(o.rot); g.scale(1 + 0.04 * sq, 1 - 0.05 * sq);
  g.drawImage(art.arka, -60, -56, 120, 70);
  if (typeof fezaCizPoz === 'function' && !zipKizak && !(o.faz === 'inis' && o.t > KZK_INIS * 0.52)) {
    try { el = fezaCizPoz(g, KZK_SEDX, -KZK_KOLTUK, 1, poz, o.ft, null, f) || null; } catch (e) { el = null; }
  }
  g.drawImage(art.on, -60, -56, 120, 70);
  g.restore();
  // Feza kızağa atlarken / inerken (kızağın dışında)
  if (typeof fezaCizPoz === 'function' && (zipKizak || o.faz === 'inis' && o.t > KZK_INIS * 0.52)) { try { fezaCizPoz(g, P.x, P.y, 1, 'sevinc', o.ft); } catch (e) {} }
  // geyik + koşum ipleri + dizgin
  const gr = o.faz === 'yol' || o.faz === 'hiz' ? Math.atan((kzkP(o, o.v + KZK_GON + 15) - kzkP(o, o.v + KZK_GON - 15)) / 30) * 0.9 + (o.h > 4 ? o.rot * 0.4 : 0) : o.faz === 'sicrama' ? o.rot : 0;
  const ko = kzkGeyikCiz(o, o.gx, o.gyW, gr, tm, o.faz === 'binis' ? smooth(clamp(o.t / KZK_BINIS * 1.3, 0, 1)) : 1);
  const c = Math.cos(o.rot), s = Math.sin(o.rot), on = (lx, ly) => [o.mx + lx * c - ly * s, o.my + lx * s + ly * c];
  const [ax, ay] = on(48, -22), [bx, by] = on(44, -8);
  g.strokeStyle = '#7a3b2a'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath();
  const sark = Math.max(0, 14 - Math.abs(ko.x - ax) * 0.02);
  g.moveTo(ax, ay); g.quadraticCurveTo((ax + ko.x) / 2, (ay + ko.y) / 2 + sark, ko.x, ko.y);
  g.moveTo(bx, by); g.quadraticCurveTo((bx + ko.x) / 2, (by + ko.y) / 2 + sark + 4, ko.x, ko.y + 3);
  g.stroke();
  g.strokeStyle = '#ffd68a'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(ax, ay - 1); g.quadraticCurveTo((ax + ko.x) / 2, (ay + ko.y) / 2 + sark - 1, ko.x, ko.y - 1); g.stroke();
  if (el && Number.isFinite(el.x) && poz === 'binis' && !zipKizak) {   // dizgin: Feza'nın elinden geyiğin koşumuna
    const [hx, hy] = on(el.x, el.y);
    g.strokeStyle = '#c0392b'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo((hx + ko.x) / 2, Math.max(hy, ko.y) + 8, ko.x - 4, ko.y - 6); g.stroke();
  }
  // Pırıl
  if (typeof pirilCizPoz === 'function') {
    try {
      const tk = o.tk > 0 ? smooth(o.tk) : 0, pz = o.kirp > 0 && o.prW < 0.3 ? 'goz_kirp' : 'ucus';
      g.save(); g.translate(o.prX, o.prY); g.rotate(tk * 6.2832 * o.tkYon + (o.faz === 'hiz' ? 0.06 : 0)); g.scale(1 + 0.08 * Math.sin(tk * Math.PI), 1 - 0.08 * Math.sin(tk * Math.PI));
      pirilCizPoz(g, 0, 0, 0.95, pz, o.pt); g.restore();
    } catch (e) { g.restore(); }
  }
  // hız patlaması: kızağın çevresinde geriye kayan rüzgâr çizgileri
  if (o.pat > 0.02 && o.faz === 'yol') {
    const a = Math.min(1, o.pat * 1.6), u = 1 - o.pat, x = o.mx, y = o.my;
    g.lineCap = 'round'; g.strokeStyle = 'rgba(245,250,255,' + (0.75 * a).toFixed(2) + ')'; g.lineWidth = 2.4; g.beginPath();
    for (let i = 0; i < 6; i++) { const yy = y - 10 - i * 15 + (i % 2) * 5, x0 = x + 30 - (i * 37 % 50) - u * 170, l = 50 + (i * 23 % 40) + u * 40; g.moveTo(x0, yy); g.lineTo(x0 - l, yy); }
    g.stroke();
    g.globalCompositeOperation = 'lighter'; dglow('#c8fff0', x - 10, y - 30, 90, 0.25 * a); g.globalCompositeOperation = 'source-over';
  }
}
function kzkBekleCiz(o, tm) {   // biniş öncesi: tepede bekleyen boş kızak, önünde karda duran koşum; oturağın üstünde davetkâr parıltı
  const art = kzkKizakArt(0), x = o.kx, y = o.y0;
  g.strokeStyle = '#7a3b2a'; g.lineWidth = 2; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 48, y - 22); g.quadraticCurveTo(x + 80, y - 2, x + 112, y - 3); g.moveTo(x + 44, y - 8); g.quadraticCurveTo(x + 76, y + 1, x + 110, y - 1); g.stroke();
  g.fillStyle = '#d9454f'; g.beginPath(); g.ellipse(x + 116, y - 3, 7, 3, 0, 0, 6.2832); g.fill();
  g.fillStyle = '#ffd36a'; g.beginPath(); g.arc(x + 116, y - 5, 2.6, 0, 6.2832); g.fill();
  g.globalCompositeOperation = 'lighter'; dglow('#ffd7e6', x, y - 20, 70, 0.22 + 0.06 * Math.sin(tm * 2)); g.globalCompositeOperation = 'source-over';
  g.drawImage(art.arka, x - 60, y - 56, 120, 70); g.drawImage(art.on, x - 60, y - 56, 120, 70);
  for (let i = 0; i < 3; i++) { const u = (tm * 0.35 + i / 3) % 1; kzkParilti(x - 4 + Math.sin(i * 2.1 + tm) * 16, y - 34 - u * 60, 4.2, 1 + i, Math.sin(u * Math.PI) * 0.85); }
}
function kzkBitmisCiz(o, tm) {   // yolculuktan sonra: iniş düzlüğünde boş kızak (kardan adamın kızağı da) ve izleri
  const art = kzkKizakArt(0), x = o.K.xDur, y = o.K.gy;
  g.strokeStyle = 'rgba(110,122,196,.45)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(o.K.xL - 40, y + 4); g.lineTo(x - 40, y + 4); g.moveTo(o.K.xL - 40, y + 7); g.lineTo(x - 40, y + 7); g.stroke();
  g.drawImage(art.arka, x - 60, y - 56, 120, 70); g.drawImage(art.on, x - 60, y - 56, 120, 70);
}
function kzkEfektAdim(o, dt) {   // ekran havuzları (karede ayırma yok)
  const VHg = VH / cam.zoom, hk = clamp(o.spd / KZK_VF, 0, 1), aktif = P.ucus === o && (o.faz === 'yol' || o.faz === 'hiz' || o.faz === 'sicrama'), ts = o.ts || 1;
  const vx = (o.faz === 'yol' || o.faz === 'hiz' || o.faz === 'sicrama') ? o.spd : 0;
  for (const p of kzkEk) {   // kar taneleri: hızla yatay çizgilere döner
    p.x -= (vx * 0.95 * p.z + 12) * dt * ts; p.y += (26 + 46 * p.z) * dt * ts; p.f += dt * 2;
    if (p.x < -60) { p.x = VW + Math.random() * 80; p.y = Math.random() * VHg; }
    if (p.y > VHg + 10) { p.y = -10; p.x = Math.random() * (VW + 60); }
  }
  const nR = aktif ? Math.round(lerp(5, KZK_RUZ, hk)) : 0;
  for (let i = 0; i < KZK_RUZ; i++) {
    const p = kzkRuz[i];
    if (p.x < -p.l - 10) { if (i >= nR) { p.x = -9999; continue; } p.x = VW + Math.random() * 300; p.y = VHg * (0.08 + Math.random() * 0.85); p.l = 40 + Math.random() * 90; p.k = 0.8 + Math.random() * 0.8; }
    p.x -= (o.spd * 1.5 + 200) * p.k * dt * ts;
  }
  const R0 = 0.42 * Math.max(VHg, VW * 0.5), Rm = Math.hypot(VW, VHg);
  for (const p of kzkIsik) {
    if (p.d < 0 || p.d > Rm) {
      if (o.hizA < 0.05 || o.faz !== 'hiz') { p.d = -1; continue; }
      let a; do { a = Math.random() * 6.2832; } while (Math.abs(Math.sin(a)) < 0.42);
      p.a = a; p.d = R0 * (0.75 + Math.random() * 0.6); p.c = (Math.random() * 3) | 0; p.w = 0.7 + Math.random() * 0.8;
    }
    p.d += (260 + p.d * 2.6) * p.w * dt * ts;
  }
  for (const k of o.kv) { if (!k.a) continue; k.t += dt / 0.9; if (k.t >= 1) { k.a = false; o.aurF[k.b] = 1; if (k.b > 0) o.aurF[k.b - 1] = Math.max(o.aurF[k.b - 1], 0.6); if (k.b < KZK_AUR - 1) o.aurF[k.b + 1] = Math.max(o.aurF[k.b + 1], 0.6); } }
  for (let i = 0; i < KZK_AUR; i++) o.aurF[i] = Math.max(0, o.aurF[i] - dt * 0.9);
}
function kzkEkranCiz(o, tm) {   // ekrana göre çizilenler (dünya dönüşümü içinde cam.x/cam.y ile)
  const VHg = VH / cam.zoom, cx = cam.x, cy = cam.y, hk = clamp(o.spd / KZK_VF, 0, 1), aktif = P.ucus === o && o.faz !== 'binis';
  const ea = o.yolA * (o.done ? 0 : 1);
  if (aktif && ea > 0.02) {
    // kar taneleri → çizgi
    g.lineCap = 'round';
    for (let b = 0; b < 2; b++) {
      g.strokeStyle = b ? 'rgba(255,255,255,.85)' : 'rgba(235,240,255,.55)'; g.lineWidth = b ? 2.6 : 1.4; g.beginPath();
      for (const p of kzkEk) {
        if ((p.z > 0.65) !== !!b) continue;
        const L = 0.4 + o.spd * 0.04 * p.z * p.z, x = cx + p.x + Math.sin(p.f) * 3, y = cy + p.y;
        g.moveTo(x, y); g.lineTo(x + L, y - L * 0.06);
      }
      g.stroke();
    }
    // rüzgâr çizgileri
    g.strokeStyle = 'rgba(240,246,255,' + (0.14 + 0.16 * hk).toFixed(2) + ')'; g.lineWidth = 1.3; g.beginPath();
    for (const p of kzkRuz) { if (p.x < -500) continue; g.moveTo(cx + p.x, cy + p.y); g.lineTo(cx + p.x + p.l * (1 + hk), cy + p.y); }
    g.stroke();
    // ışık hızı çizgileri (büyük iniş)
    if (o.hizA > 0.02) {
      const vx = VW * 0.8, vy = VHg * 0.5, renk = ['200,255,232', '255,175,220', '200,190,255'];
      for (let c = 0; c < 3; c++) {
        g.strokeStyle = 'rgba(' + renk[c] + ',' + (0.4 * o.hizA).toFixed(2) + ')'; g.lineWidth = 5; g.beginPath();
        for (const p of kzkIsik) { if (p.d < 0 || p.c !== c) continue; const ca = Math.cos(p.a), sa = Math.sin(p.a), l = 40 + p.d * 0.35; g.moveTo(cx + vx + ca * p.d, cy + vy + sa * p.d); g.lineTo(cx + vx + ca * (p.d + l), cy + vy + sa * (p.d + l)); }
        g.stroke();
        g.strokeStyle = 'rgba(255,255,255,' + (0.6 * o.hizA).toFixed(2) + ')'; g.lineWidth = 1.5; g.stroke();
      }
      if (o.flas > 0.01) { g.globalCompositeOperation = 'lighter'; dglow('#d8fff0', P.x + 40, P.y - 20, 260, o.flas * 0.5); g.globalCompositeOperation = 'source-over'; }
    }
  }
  if (o.flasP > 0.01) {   // perdeden geçiş: ekranı soldan sağa saran yumuşak renkli ışık dalgası
    const VHg2 = VH / cam.zoom, u = 1 - o.flasP; g.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 7; k++) { const x = cx + VW * (k / 6) , y = cy + VHg2 * (0.3 + 0.12 * Math.sin(k * 1.3 + u * 6)); dglow(KZK_REN[k % 4], x, y, VW * 0.32, 0.22 * o.flasP * (0.6 + 0.4 * Math.sin(u * 9 + k))); }
    g.globalCompositeOperation = 'source-over';
  }
  if (o.flas > 0.01 && o.faz === 'inis') { g.globalCompositeOperation = 'lighter'; dglow('#f0f6ff', o.mx, o.my - 30, 230, o.flas * 0.5); g.globalCompositeOperation = 'source-over'; }
  // göğe uçan tane kıvılcımları
  for (const k of o.kv) {
    if (!k.a) continue;
    const u = smooth(clamp(k.t, 0, 1)), x = cx + lerp(k.sx, k.tx, u) + Math.sin(u * Math.PI) * 50, y = cy + lerp(k.sy, k.ty, u) - Math.sin(u * Math.PI) * 40;
    g.globalCompositeOperation = 'lighter'; dglow(KZK_REN[k.c], x, y, 24, 0.75); g.globalCompositeOperation = 'source-over';
    kzkParilti(x, y, 5, k.c + 1, 1);
  }
}
TUR.kaydet('kizakMini', {
  kur: kzkKur,
  dokun: kzkBasla,
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    kzkParcaAdim(dt * (P.ucus === o ? o.ts || 1 : 1));
    if (o.faz === 'bekle') {
      if (Math.abs(P.x - o.kx) < 2400) kzkIsit();   // yaklaşırken önbellekleri karelere yayarak hazırla
      if (DURUM === 'oyun' && !P.ucus && !o.done && Math.abs(P.x - o.kx) < 90 && Math.abs(P.y - o.y0) < 110) kzkBasla(o);
      return;
    }
    if (P.ucus !== o) o.x = o.done && o.gidisT > 3 ? o.K.xDur : clamp(cam.x + VW / 2, o.K.x0, o.K.x1 + 300);
    kzkEfektAdim(o, dt);
    if (o.done) { o.gidisT += dt; o.aurA = Math.max(0, o.aurA - dt / 3); o.isik = Math.max(0, o.isik - dt * 0.2); }
  },
  ciz(o, tm) {
    if (o.faz === 'bekle') { kzkBekleCiz(o, tm); return; }
    kzkGokCiz(o, tm);
    kzkAuroraCiz(o, tm);
    kzkParalaksCiz(o, tm);
    if (o.yolA > 0.01 && !(o.done && o.gidisT > 2.6)) {
      kzkCamlarArka(o, tm);
      kzkYolCiz(o, tm); kzkKulubeCiz(o, tm);
      if (!o.done) { kzkTunelArka(o, tm); kzkIzCiz(o); }
    }
    if (o.faz === 'yol') { kzkBulutlarCiz(o, tm, false); kzkPerdeCiz(o, tm, false); }
    if (o.faz === 'yol' || o.faz === 'binis') kzkTanelerCiz(o, tm);
    if (o.faz === 'hiz') { kzkTanelerCiz(o, tm); kzkKristallerCiz(o, tm); }
    if (o.done) kzkBitmisCiz(o, tm);
  },
  cizOn(o, tm) {
    if (o.faz === 'bekle') return;
    kzkParcaCiz();   // kar püskürmesi ve yıldız tozu binicilerin arkasında: Feza ve kızak hep net
    if (P.ucus === o) {
      kzkUcIzCiz(o, tm);
      kzkBinicilerCiz(o, tm);
      kzkBulutlarCiz(o, tm, true); kzkPerdeCiz(o, tm, true);
      if (o.faz === 'yol' || o.faz === 'hiz') { kzkTunelOn(o, tm); kzkCamlarOn(o, tm); }
    }
    kzkEkranCiz(o, tm);
  }
});
