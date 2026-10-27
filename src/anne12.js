/* anne12.js — Bölüm 12 "Annemle Sabancı'da Bir Gün": Feza'nın annesi (çizim + pozlar + yumuşak animasyon + arkadan takip).
   Klasik script. Bu dosyadaki yardımcı adlar an/AN ile başlar (başka dosyalarla çakışmasın). Sözleşme: src/BOLUM12.md.

   Model: ayak tabanı ortası (0,0), sağa bakıyor, yukarı = -y, birim = dünya birimi (olcek 1). Boy ~136 birim (ANNE12_BOY;
   oyunda Feza ~80 birim, anne onun ~1.7 katı). İskelet: kalça → diz → ayak bileği (ters kinematik, diz öne), omuz → dirsek → bilek
   (ters kinematik, dirsek arkaya/aşağı), gövde eğimi, omuz kalkışı (nefes), baş eğimi. Pozlar eklem hedeflerinden oluşan tek bir
   sayı dizisidir (AN_N değer); poz değişince eski dizi 0.3 sn'de yenisine karışır (blend). İkincil hareket: at kuyruğu saç (üç
   parçalı yay, baş ivmesine ve rüzgâra gecikmeli tepki), omuzdaki bez çanta (sarkaç), hırka eteği (yay).
   Yürüyüş: adım uzunluğu hıza bağlı, faz kat edilen yoldan ilerler → yerdeki ayak kaymaz. Topuk-taban-parmak (heel-toe) dönüşü,
   kol salınımı karşıt fazda, kalça iniş-çıkışı (bacak boyu yetmezse kalça kendiliğinden alçalır), hız arttıkça yürüyüş hafif koşuya
   karışır. Durunca ayaklar küçük bir ağırlık aktarma adımıyla yerine oturur; nefes, göz kırpma, ara sıra Feza'ya eğilip gülümseme.

   Çizim: anne önce kendi küçük tuvaline (anC) Feza ile aynı dilde çizilir (yumuşak gölgeli hacimli uzuvlar, sıcak ten, büyük ifadeli
   gözler), sonra Feza'daki gibi ışık/kenar ışığı ve ince iki katlı kontur (krem dış + lacivert iç) ile oyun tuvaline basılır.
   Gradyanlar bir kez kurulur (kare başına yeni gradyan yok); kare başına dizi/nesne ayrılmaz.

   Dışa açık:
     anne12Ciz(ctx, x, y, olcek, tm, opt)   (x,y) ayak tabanı ortası; bisiklet pozlarında bisikletin yere değdiği orta nokta.
       opt.poz: dur, yuru, kos, el_salla, isaret (opt.aci: kol açısı, - yukarı), kokla (opt.u eğilme 0..1), bisiklet (opt.krank,
         opt.egim), bisiklet_bin / bisiklet_in (opt.u 0..1), kayik_kurek (opt.kurek 0..1 kürek fazı; oturur), ucurtma_ver (opt.u:
         0 uçurtmayı yukarı tutar → 1 ipi Feza'ya uzatır), otur, alkis, saril (opt.u 0..1: diz çöküp sarılır; Feza x + 28*yon'da),
         dans. Eski adlar da çalışır: el → el_salla, kayik → kayik_kurek.
       opt.yon ±1, opt.hiz (birim/sn; verilmezse x değişiminden), opt.bak (1 Feza'ya bak/gülümse, -1 yukarı bak), opt.egil (0..1
         Feza'ya doğru eğilme), opt.katman ('uzak' uzak kol+bacak, 'arka' yakın kol hariç, 'on' yalnız yakın kol, 'yakin' uzak
         uzuvlar hariç; yoksa hepsi), opt.golge (false: yer gölgesi yok).
     ANNE12_ELLER {onX, onY, arkaX, arkaY}: son çizimde ellerin konumu (çağıranın koordinatında; uçurtma ipi, kürek sapı için).
     ANNE12_BISIKLET: annenin bisikletine oturduğu noktalar (YOLCULUK ile kararlaştırıldı; b12/istek/ANNE_YOLCULUK_bisiklet.md).
     ANNE12 = { hazir, x, y, yon, poz, vx, sahip, reset(P), adim(dt, P, yerY), ciz(g, tm), devral(sahip), birak(sahip) }
       adim: anne hep Feza'nın arkasında (hareket yönünün gerisinde 85–118 birim); Feza durunca ~66 birim geride yanaşır ve ona döner;
       Feza ona doğru gelirse kenara çekilip (biraz arka plana) bekler, Feza geçince yine arkasına düşer. Yumuşak hızlanma,
       uzak kalınca koşar, asla ışınlanmaz (yalnız reset). Feza zıplarsa zıplamaz. Pırıl'ın (D) üstüne durmaz.
       devral: sahip anneyi anne12Ciz ile çizer ve ANNE12.x/y'yi yazar; adim bekler, ciz çizmez. birak: anne olduğu yerden devam eder. */
'use strict';

// ── ortak ölçüler (başka modüller okur) ──
const ANNE12_BOY = 136;
// Annenin bisikleti (alçak kadrolu şehir bisikleti). Orijin: iki tekerin yere değdiği noktaların ortası, sağa bakış.
// sele: selenin üstü · gidon: tutma noktası · pedal: krank merkezi · krank: kol boyu · opt.krank 0 = yakın pedal önde, artınca ileri pedal iner.
const ANNE12_BISIKLET = { sele: [-16, -66], gidon: [27, -88], pedal: [-2, -21], krank: 13, teker: 25, arkaTeker: [-46, -25], onTeker: [46, -25] };
const ANNE12_ELLER = { onX: 0, onY: 0, arkaX: 0, arkaY: 0 };

// ── renkler ──
const AN = {
  ten: '#f7d3bb', tenA: '#fde8da', tenG: '#e8b69c', tenK: '#c98f76', tenU: '#e9bda3',
  sac: '#5a3526', sacK: '#3b2117', sacA: '#86533a', sacP: '#a9744f',
  bluz: '#fcf8f0', bluzG: '#e5ddcf', bluzK: '#cfc5b4',
  hirka: '#f4ad9d', hirkaG: '#dc8f80', hirkaK: '#b86f63', hirkaU: '#de9888', hirkaUG: '#c47c6f', hirkaA: '#fcd3c8',
  kot: '#6b90c2', kotG: '#5072a1', kotK: '#3c5b86', kotU: '#587aa9', kotUG: '#456893', kotA: '#93b2da',
  ayk: '#fbfaf6', aykU: '#dfe0e4', aykT: '#e3e5ec', aykTU: '#c7c9d2', serit: '#f08a7c', seritU: '#d9776b',
  canta: '#efe2c4', cantaG: '#d6c39e', cantaK: '#b9a47c', baski: '#f08f85',
  toka: '#f28d84', tokaG: '#cf6c64',
  goz: '#7b5132', gozA: '#b3824f', gozK: '#2a170d', kirpik: '#2f1c15', kas: '#7a4c38',
  dudak: '#cf7d77', dudakK: '#a65751', agiz: '#8a3a36', dil: '#e27f7f', dis: '#fffaf4',
  altin: '#d7b46e'
};

// ── iskelet ölçüleri (model birimi) ──
const AN_UY = 30, AN_BA = 28, AN_AB = 5.5;     // uyluk, baldır, ayak bileği yüksekliği
const AN_UK = 18, AN_OK = 16.5;                 // üst kol, ön kol (bileğe kadar)
const AN_BACAK = AN_UY + AN_BA;                 // 58: kalça → bilek en çok
const AN_GK = 0.86, AN_GE = 1.22, AN_BK = 1.5;   // gövde boy/en çarpanı, baş büyüklüğü (sevimli oran)
// poz dizisinin alanları
const A_HX = 0, A_HY = 1, A_GV = 2, A_OMZ = 3, A_BA = 4,
  A_AYX = 5, A_AYY = 6, A_AYP = 7,              // yakın ayak bileği (x, y) + ayak eğimi (+ = parmak yukarı)
  A_UYX = 8, A_UYY = 9, A_UYP = 10,             // uzak ayak
  A_OEX = 11, A_OEY = 12, A_UEX = 13, A_UEY = 14,   // bilek hedefi (omuza göre): yakın, uzak
  A_OEA = 15, A_UEA = 16,                       // el açıklığı: 0 gevşek, 1 açık (sallama), -1 işaret parmağı
  A_GUL = 17, A_AGZ = 18, A_GOZ = 19, A_BKX = 20, A_BKY = 21, A_KAS = 22,
  A_OEK = 23, A_UEK = 24, A_CNT = 25, A_MUT = 26;   // el bükümü (yakın, uzak), çanta görünür, mutlu kısık göz
const AN_N = 27;

// ── küçük yardımcılar ──
const anSn = (v, a, b) => v < a ? a : v > b ? b : v;
const anKr = (a, b, t) => a + (b - a) * t;
const anYm = t => { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
const anKs = v => v - Math.floor(v);
const AN_PI = Math.PI, AN_2PI = Math.PI * 2;

// ── durum (tek anne; anne12Ciz kim çağırırsa çağırsın aynı annedir) ──
const AN_ST = {
  tm: -1, x: NaN, y: NaN, olcek: 1, ilk: true,
  hiz: 0, hizV: 0, faz: 0.1, vx: 0, ivme: 0, kumX: 0,
  poz: 'dur', aile: 'ayakta', gecis: 1, durT: 0, idleT: 0,
  yonG: 1, donU: 1, donEski: 1,
  kirpT: 2.2, kirpU: 1,
  dAyak: new Float64Array(6), ilkAyak: 0,
  sac: new Float64Array(6), cnt: new Float64Array(2), etek: new Float64Array(2),
  apx: 0, apy: 0, avx: 0, avy: 0, fizikHazir: false, sacEk: 0,
  kokX: NaN, kokY: NaN
};
const AN_R = new Float64Array(AN_N), AN_R0 = new Float64Array(AN_N), AN_RS = new Float64Array(AN_N),
  AN_KA = new Float64Array(AN_N), AN_KB = new Float64Array(AN_N);
const AN_SP = new Float64Array(8);   // at kuyruğu noktaları (x,y)×4, model koordinatı
const AN_CANTA = new Float64Array(3);  // çantanın ortası (model) + bu karede çizildi mi

// ── ters kinematik (iki kemik) ──
let anJX = 0, anJY = 0, anEX = 0, anEY = 0;
function anIK(ax, ay, bx, by, L1, L2, yan) {   // yan +1: diz öne; -1: dirsek arkaya/aşağı. anJ*: orta eklem, anE*: ulaşılan uç
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy);
  if (d < 1e-4) { dx = 0; dy = 1; d = 1e-4; }
  const ux = dx / d, uy = dy / d, dd = anSn(d, Math.abs(L1 - L2) + 0.02, L1 + L2 - 0.02);
  const a = (L1 * L1 - L2 * L2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const nx = yan > 0 ? uy : -uy, ny = yan > 0 ? -ux : ux;
  anJX = ax + ux * a + nx * h; anJY = ay + uy * a + ny * h;
  anEX = ax + ux * dd; anEY = ay + uy * dd;
}
// gövde çerçevesindeki noktayı modele çevir (kalça merkezli, GV kadar öne eğik)
let anPX = 0, anPY = 0;
function anGv(R, px, py) {
  const c = Math.cos(R[A_GV]), s = Math.sin(R[A_GV]);
  anPX = R[A_HX] + px * c - py * s; anPY = R[A_HY] + px * s + py * c;
}
function anOmuz(R, yakin) { anGv(R, yakin ? 0.7 : -1.5, -28.7 - R[A_OMZ]); }
function anKalca(R, yakin) {   // kalça eklemi: leğen gövdenin yarısı kadar eğilir
  const a = R[A_GV] * 0.45, c = Math.cos(a), s = Math.sin(a), px = yakin ? 1.7 : -1.6, py = yakin ? 0.3 : -0.3;
  anPX = R[A_HX] + px * c - py * s; anPY = R[A_HY] + px * s + py * c;
}
// baş merkezi ve açısı
let anBX = 0, anBY = 0, anBA = 0;
function anBas(R) {
  anGv(R, 3.0, -35.2 - R[A_OMZ] * 0.6);
  anBA = R[A_GV] * 0.75 + R[A_BA];
  const c = Math.cos(anBA), s = Math.sin(anBA);
  anBX = anPX + 1.2 * c + 15.3 * s; anBY = anPY + 1.2 * s - 15.3 * c;
}
// ayak yerleştirme: gx = ayak düzken bileğin x'i; eğim > 0 topuk üstünde döner, < 0 parmak ucunda (topuk kalkar)
function anAyakYer(R, i, gx, p, kalk) {
  const c = Math.cos(p), s = Math.sin(p);
  let ax, ay;
  if (p >= 0) { const hx = -4.0, hy = AN_AB; ax = gx - 4.0 - (hx * c + hy * s); ay = -(-hx * s + hy * c); }
  else { const tx = 7.2, ty = AN_AB; ax = gx + 7.2 - (tx * c + ty * s); ay = -(-tx * s + ty * c); }
  R[i] = ax; R[i + 1] = ay - kalk; R[i + 2] = p;
}
// kol açılarından bilek hedefi (omuza göre): a1 kol aşağıdan öne (+), a2 dirsek bükümü (+ öne)
function anKolAci(R, i, a1, a2) {
  R[i] = Math.sin(a1) * AN_UK + Math.sin(a1 + a2) * AN_OK;
  R[i + 1] = Math.cos(a1) * AN_UK + Math.cos(a1 + a2) * AN_OK;
}
function anElMutlak(R, i, yakin, x, y) { anOmuz(R, yakin); R[i] = x - anPX; R[i + 1] = y - anPY; }

// ══════════════════════ POZLAR ══════════════════════
// Her poz R dizisini baştan doldurur. Ortak yüz/el değerleri:
function anTemel(R) {
  R[A_HX] = 0; R[A_HY] = -63.2; R[A_GV] = 0.03; R[A_OMZ] = 0; R[A_BA] = 0;
  R[A_OEA] = 0.15; R[A_UEA] = 0.15; R[A_GUL] = 0.72; R[A_AGZ] = 0; R[A_GOZ] = 1; R[A_BKX] = 0.35; R[A_BKY] = 0.05;
  R[A_KAS] = 0; R[A_OEK] = 0; R[A_UEK] = 0; R[A_CNT] = 1; R[A_MUT] = 0;
}
// ayakta duran pozların ayakları: aileye yeni girildiyse önceki yerinden küçük bir adımla yerine oturur
function anAyakDur(R, tm) {
  const st = AN_ST, t = st.durT;
  for (let i = 0; i < 2; i++) {
    const j = i ? A_UYX : A_AYX, sx = st.dAyak[i * 3], sy = st.dAyak[i * 3 + 1], sp = st.dAyak[i * 3 + 2];
    const tx = i ? -4.2 : 4.6, ty = -AN_AB, d = Math.abs(tx - sx) + Math.abs(sy - ty) * 0.6;
    const t0 = i === st.ilkAyak ? 0.04 : 0.27, u = anSn((t - t0) / 0.3, 0, 1), e = anYm(u);
    const kalk = d > 2 ? Math.sin(AN_PI * u) * Math.min(4.5, d * 0.45) : 0;
    R[j] = anKr(sx, tx, e); R[j + 1] = anKr(sy, ty, e) - kalk; R[j + 2] = anKr(sp, 0, e) + (d > 2 ? 0.18 * Math.sin(AN_PI * u) : 0);
  }
}
function anPozDur(R, tm, o) {
  anTemel(R);
  const ag = Math.sin(tm * 0.52) * 0.5 + Math.sin(tm * 0.21 + 1.3) * 0.5;   // ağırlık aktarımı (yavaş)
  const nf = Math.sin(tm * 1.65);                                         // nefes
  R[A_HX] = 0.4 + ag * 1.5; R[A_HY] = -63.3 + nf * 0.22 + Math.abs(ag) * 0.35;
  R[A_GV] = 0.025 - ag * 0.012 + nf * 0.006; R[A_OMZ] = 0.45 + nf * 0.45;
  R[A_BA] = 0.03 * Math.sin(tm * 0.37) + 0.02 * Math.sin(tm * 0.83 + 2);
  anAyakDur(R, tm);
  anKolAci(R, A_OEX, 0.06 + 0.02 * nf, 0.22); anKolAci(R, A_UEX, -0.02 + 0.02 * nf, 0.25);
  R[A_OEK] = 0.15; R[A_UEK] = 0.1;
  // eğilip Feza'ya bakma: kalça geri, gövde öne, dizler hafif bükük, eller dizlere
  const e = anYm(o && o.egil > 0 ? o.egil : 0);
  if (e > 0.001) {
    R[A_HX] += -4.5 * e; R[A_HY] += 2.6 * e; R[A_GV] += 0.4 * e; R[A_BA] += -0.02 * e;
    R[A_BKY] = anKr(R[A_BKY], 0.7, e); R[A_BKX] = anKr(R[A_BKX], 0.55, e); R[A_GUL] = anKr(R[A_GUL], 0.95, e); R[A_KAS] += 0.25 * e;
    anOmuz(R, true); const ox = R[A_OEX], oy = R[A_OEY];
    R[A_OEX] = anKr(ox, R[A_HX] + 15 - anPX, e); R[A_OEY] = anKr(oy, R[A_HY] + 25 - anPY, e);
    anOmuz(R, false); const ux = R[A_UEX], uy = R[A_UEY];
    R[A_UEX] = anKr(ux, R[A_HX] + 12 - anPX, e); R[A_UEY] = anKr(uy, R[A_HY] + 24 - anPY, e);
  }
}
// adım uzunluğu (bir tam döngü = iki adım) ve yürüyüş/koşu karışımı
function anKosuK(v, zorla) { const k = anYm((v - 200) / 80); return zorla ? Math.max(k, 0.8) : k; }   // 250'de (Feza'nın hızı) hafif tempolu koşu
function anDongu(v, k) { return anKr(anSn(46 + 0.33 * v, 52, 118), anSn(118 + 0.42 * v, 150, 255), k); }
function anPozYuru(R, tm, o, zorla) {
  anTemel(R);
  const st = AN_ST, v = st.hiz, k = anKosuK(v, zorla), a = anSn(v / 55, 0, 1), f = st.faz;
  const Lc = anDongu(v, k), bet = anKr(0.6, 0.36, k), s = Lc * bet / 2;
  const lift = anKr(5.2, 10, k) * a;
  for (let i = 0; i < 2; i++) {
    const p = anKs(f + i * 0.5), j = i ? A_UYX : A_AYX;
    if (p < bet) {   // basma: ayak yerde, gövde ilerledikçe geriye kalır
      const u = p / bet;
      let pit = 0;
      if (u < 0.18) pit = 0.34 * (1 - k * 0.7) * Math.pow(1 - u / 0.18, 2) * a;
      else if (u > 0.6) pit = -0.8 * Math.pow((u - 0.6) / 0.4, 1.6) * (0.4 + 0.6 * a);
      anAyakYer(R, j, s * (1 - 2 * u), pit, 0);
    } else {         // salınım: ayak havada öne taşınır (koşuda topuk geriye-yukarı fırlar)
      const w = (p - bet) / (1 - bet), e = anYm(w);
      anAyakYer(R, j, -s, -0.8 * (0.4 + 0.6 * a), 0); const x0 = R[j], y0 = R[j + 1];
      anAyakYer(R, j, s, 0.34 * (1 - k * 0.7) * a, 0); const x1 = R[j], y1 = R[j + 1];
      const tek = Math.sin(AN_PI * Math.min(1, w * 1.7));
      R[j] = anKr(x0, x1, e) - 9 * k * tek * (1 - w);
      R[j + 1] = anKr(y0, y1, e) - lift * Math.sin(AN_PI * w) - 11 * k * tek * (1 - w);
      R[j + 2] = anKr(-0.8 * (0.4 + 0.6 * a), 0.34 * (1 - k * 0.7) * a, anYm(w * 1.15)) - 0.35 * k * Math.sin(AN_PI * w);
    }
  }
  // kalça: yürüyüşte basma ortasında en yüksek, koşuda en alçak (yaylanma); bacak yetmezse alçalır
  const ph = Math.cos(4 * AN_PI * (f - bet / 2));
  let hy = anKr(-62.9 - 1.3 * a * ph, -60.2 + 2.4 * ph, k);
  for (let i = 0; i < 2; i++) {
    const p = anKs(f + i * 0.5); if (p >= bet + 0.04) continue;
    const j = i ? A_UYX : A_AYX, dx = R[j] - (i ? -1.6 : 1.7), m = AN_BACAK * 0.985;
    const lim = R[j + 1] - Math.sqrt(Math.max(0, m * m - dx * dx));
    if (hy < lim) hy = lim;
  }
  R[A_HX] = 1.2 * k + 0.6 * a; R[A_HY] = hy;
  R[A_GV] = anKr(0.05 + 0.0002 * v, 0.16, k) + 0.018 * Math.sin(4 * AN_PI * f + 0.7) * a + anSn(st.ivme * 0.00022, -0.07, 0.09);
  R[A_OMZ] = 0.35 * Math.sin(4 * AN_PI * f - 0.4) * a;
  R[A_BA] = -R[A_GV] * 0.55 + 0.035 * Math.sin(4 * AN_PI * f - 1.1) * a;
  // kollar: bacakların karşıt fazında; koşuda dirsekler bükük
  const A = anKr(0.38, 0.7, k) * a, c = Math.cos(AN_2PI * f - 0.3);
  const n1 = -A * c + R[A_GV] * 0.4, u1 = A * c + R[A_GV] * 0.4;
  anKolAci(R, A_OEX, n1, anKr(0.2 + 0.32 * Math.max(0, n1) / (A + 0.01) * a, 1.5 + 0.2 * Math.max(0, n1), k));
  anKolAci(R, A_UEX, u1, anKr(0.2 + 0.32 * Math.max(0, u1) / (A + 0.01) * a, 1.5 + 0.2 * Math.max(0, u1), k));
  R[A_OEK] = anKr(0.2, -0.2, k); R[A_UEK] = R[A_OEK];
  R[A_AGZ] = 0.22 * k; R[A_GUL] = 0.72 + 0.1 * k; R[A_BKX] = 0.45; R[A_BKY] = 0;
  st.sacEk = 0.12 * Math.sin(4 * AN_PI * f - 1.5) * a * (1 + k);
}
function anPozElSalla(R, tm, o) {
  anPozDur(R, tm, null);
  const w = Math.sin(tm * 8.5);
  anKolAci(R, A_OEX, AN_PI - 0.42 + 0.06 * w, -0.35 + 0.42 * w);
  R[A_OEA] = 1; R[A_OEK] = 0.25 * w;
  R[A_GV] -= 0.03; R[A_HX] -= 0.6; R[A_BA] = -0.08 + 0.04 * Math.sin(tm * 4.25);
  R[A_GUL] = 1; R[A_AGZ] = 0.42; R[A_KAS] = 0.45; R[A_BKY] = -0.25; R[A_BKX] = 0.6;
}
function anPozIsaret(R, tm, o) {
  anPozDur(R, tm, null);
  const aci = o && Number.isFinite(o.aci) ? o.aci : -0.55, t = 0.02 * Math.sin(tm * 3);
  anOmuz(R, true);
  R[A_OEX] = Math.cos(aci + t) * (AN_UK + AN_OK) * 0.98; R[A_OEY] = Math.sin(aci + t) * (AN_UK + AN_OK) * 0.98;
  R[A_OEA] = -1; R[A_OEK] = 0;
  anElMutlak(R, A_UEX, false, R[A_HX] - 7, R[A_HY] - 4);   // öbür el belde
  R[A_UEK] = 1.2; R[A_GV] += 0.04; R[A_BA] = anSn(aci * 0.3, -0.25, 0.2);
  R[A_GUL] = 0.95; R[A_AGZ] = 0.32; R[A_KAS] = 0.5; R[A_BKX] = 0.9; R[A_BKY] = anSn(aci * 0.9, -0.9, 0.9);
}
function anPozKokla(R, tm, o) {
  anPozDur(R, tm, null);
  const u = anYm(o && Number.isFinite(o.u) ? o.u : 1), sn = Math.sin(tm * 4.4) * Math.max(0, Math.sin(tm * 0.9));   // ara sıra küçük "koklama"
  R[A_HX] += -7 * u; R[A_HY] += 12 * u; R[A_GV] += 1.05 * u; R[A_BA] += (-0.35 + 0.05 * sn) * u;
  anOmuz(R, true); const ox = R[A_OEX], oy = R[A_OEY];
  anBas(R); const bx = anBX, by = anBY;
  R[A_OEX] = anKr(ox, bx + 9 - anPX, u); R[A_OEY] = anKr(oy, by + 10 - anPY, u);   // çiçeği burnuna doğru tutar
  anOmuz(R, false);
  R[A_UEX] = anKr(R[A_UEX], R[A_HX] + 11 - anPX, u); R[A_UEY] = anKr(R[A_UEY], R[A_HY] + 21 - anPY, u);   // öbür el dizde
  R[A_OEA] = 0.3 * u; R[A_OEK] = -0.6 * u;
  R[A_GOZ] = anKr(1, 0.05, u); R[A_MUT] = u; R[A_GUL] = 0.95; R[A_AGZ] = 0.05 + 0.08 * sn * u; R[A_KAS] = 0.35 * u;
}
function anPozBisiklet(R, tm, o) {
  anTemel(R);
  const B = ANNE12_BISIKLET, kr = o && Number.isFinite(o.krank) ? o.krank : AN_ST.faz * AN_2PI;
  R[A_HX] = B.sele[0] - 0.5; R[A_HY] = B.sele[1] - 2.4 + 0.35 * Math.sin(2 * kr);
  R[A_GV] = 0.33; R[A_OMZ] = 0.2 * Math.sin(2 * kr);
  for (let i = 0; i < 2; i++) {
    const a = kr + (i ? AN_PI : 0), px = B.pedal[0] + Math.cos(a) * B.krank, py = B.pedal[1] + Math.sin(a) * B.krank;
    const p = -0.12 - 0.2 * Math.sin(a + 0.6), c = Math.cos(p), s = Math.sin(p);   // ayağın topu pedalda
    const j = i ? A_UYX : A_AYX, tx = 6.8, ty = AN_AB;
    R[j] = px - (tx * c + ty * s); R[j + 1] = py - (-tx * s + ty * c) - 0.6; R[j + 2] = p;
  }
  anElMutlak(R, A_OEX, true, B.gidon[0], B.gidon[1]);
  anElMutlak(R, A_UEX, false, B.gidon[0] - 2.5, B.gidon[1] - 0.8);
  R[A_OEK] = -0.9; R[A_UEK] = -0.9; R[A_OEA] = 0;
  R[A_BA] = -0.2; R[A_GUL] = 0.85; R[A_AGZ] = 0.12; R[A_BKX] = 0.6; R[A_BKY] = -0.05;
}
// bisiklete biniş anahtar pozları (u 0 ayakta bisikletin solunda → 1 sürüş pozu)
function anBinisAnahtar(R, n, tm, o) {
  const B = ANNE12_BISIKLET;
  if (n >= 4) { anPozBisiklet(R, tm, o); return; }
  anTemel(R);
  const nf = Math.sin(tm * 1.65);
  R[A_OMZ] = 0.4 + 0.3 * nf; R[A_GUL] = 0.75; R[A_BKX] = 0.6;
  if (n === 0) {          // bisikletin yanında ayakta
    R[A_HX] = -22.6; R[A_HY] = -63.3 + nf * 0.2; R[A_GV] = 0.03;
    anAyakYer(R, A_AYX, -18.4, 0, 0); anAyakYer(R, A_UYX, -26.8, 0, 0);
    anKolAci(R, A_OEX, 0.1, 0.3); anKolAci(R, A_UEX, 0, 0.3);
  } else if (n === 1) {   // eller gidonda, bir adım öne
    R[A_HX] = -12; R[A_HY] = -62.4; R[A_GV] = 0.3;
    anAyakYer(R, A_AYX, -8, 0, 0); anAyakYer(R, A_UYX, -20, -0.3, 0);
    anElMutlak(R, A_OEX, true, B.gidon[0], B.gidon[1]); anElMutlak(R, A_UEX, false, B.gidon[0] - 2.5, B.gidon[1] - 0.8);
  } else if (n === 2) {   // uzak bacak alçak kadronun üstünden geçer
    R[A_HX] = -13; R[A_HY] = -64.1; R[A_GV] = 0.34;
    anAyakYer(R, A_AYX, -8, 0, 0); R[A_UYX] = 2; R[A_UYY] = -34; R[A_UYP] = -0.4;
    anElMutlak(R, A_OEX, true, B.gidon[0], B.gidon[1]); anElMutlak(R, A_UEX, false, B.gidon[0] - 2.5, B.gidon[1] - 0.8);
  } else {                // selede: uzak ayak pedalda, yakın ayak hâlâ yerde
    anPozBisiklet(R, tm, o);
    anAyakYer(R, A_AYX, -6, 0, 0);
  }
  R[A_OEK] = n ? -0.9 : 0.15; R[A_UEK] = R[A_OEK];
}
const AN_BIN_U = [0, 0.3, 0.55, 0.8, 1];
function anPozBinis(R, tm, o, ters) {
  let u = anSn(o && Number.isFinite(o.u) ? o.u : 1, 0, 1); if (ters) u = 1 - u;
  let n = 0; while (n < 3 && u > AN_BIN_U[n + 1]) n++;
  const e = anYm((u - AN_BIN_U[n]) / (AN_BIN_U[n + 1] - AN_BIN_U[n]));
  anBinisAnahtar(AN_KA, n, tm, o); anBinisAnahtar(AN_KB, n + 1, tm, o);
  for (let i = 0; i < AN_N; i++) R[i] = anKr(AN_KA[i], AN_KB[i], e);
  if (n === 1) { R[A_UYY] -= Math.sin(AN_PI * e) * 3; }   // adım atarken küçük kalkış
}
function anPozKayik(R, tm, o) {
  anTemel(R);
  const u = anKs(o && Number.isFinite(o.kurek) ? o.kurek : tm * 0.55);
  // çekiş (0..0.55): eller göğüsten öne-yukarı iter, gövde öne eğilir; dönüş: eller biraz aşağıdan göğse döner, gövde dikleşir
  let d, alt;
  if (u < 0.55) { d = anYm(u / 0.55); alt = 0; } else { d = 1 - anYm((u - 0.55) / 0.45); alt = Math.sin(AN_PI * (u - 0.55) / 0.45); }
  R[A_HX] = -10; R[A_HY] = -24; R[A_GV] = anKr(-0.05, 0.4, d); R[A_OMZ] = 0.3 * d;
  anAyakYer(R, A_AYX, 30, 0.15, 0); anAyakYer(R, A_UYX, 26, 0.1, 0);
  const hx = anKr(10, 34, d), hy = anKr(-44, -48, d) + alt * 6;   // göğüs hizası (küpeşte ayaktan ~30 yukarıda)
  anElMutlak(R, A_OEX, true, hx, hy); anElMutlak(R, A_UEX, false, hx - 2.5, hy - 1.2);
  R[A_OEK] = -1.1; R[A_UEK] = -1.1; R[A_OEA] = 0;
  R[A_BA] = -R[A_GV] * 0.6; R[A_CNT] = 0;
  R[A_GUL] = 0.8; R[A_AGZ] = 0.1 + 0.18 * Math.sin(AN_PI * d); R[A_BKX] = 0.5; R[A_BKY] = 0.1;
}
function anPozCagir(R, tm, o) {   // ayakta: eliyle "gel gel" (avuç yukarı, parmaklar kıvrılır)
  anPozDur(R, tm, null);
  const w = 0.5 + 0.5 * Math.sin(tm * 7);
  anKolAci(R, A_OEX, 1.05, 0.55 + 0.75 * w);
  R[A_OEA] = 0.6 - 0.5 * w; R[A_OEK] = -1.3; R[A_GV] += 0.08; R[A_BA] = 0.08;
  R[A_GUL] = 1; R[A_AGZ] = 0.3; R[A_KAS] = 0.4; R[A_BKY] = 0.5; R[A_BKX] = 0.7;
}
// oturarak (opt.otur: true = yerde, 'kayik' = kayıkta) yapılan pozlar: oturuşun üstüne kollar ve yüz konur
const AN_BOS_O = {};
function anPozOturarak(R, ad, tm, o) {
  const kayik = o.otur === 'kayik';
  if (kayik) anPozKayik(R, tm, o); else anPozOturTam(R, tm);
  if (ad === 'saril' && !kayik) {   // yanındaki (x + 28*yon) oturan Feza'ya dönüp sarılır
    const u = anYm(Number.isFinite(o.u) ? o.u : 1), nf = Math.sin(tm * 1.6);
    AN_KB.set(R);
    R[A_GV] = anKr(R[A_GV], 0.42, u); R[A_HX] = anKr(R[A_HX], 2, u);
    anElMutlak(R, A_OEX, true, 40 + nf * 0.3, -36); anElMutlak(R, A_UEX, false, 36, -44);
    R[A_OEX] = anKr(AN_KB[A_OEX], R[A_OEX], u); R[A_OEY] = anKr(AN_KB[A_OEY], R[A_OEY], u);
    R[A_UEX] = anKr(AN_KB[A_UEX], R[A_UEX], u); R[A_UEY] = anKr(AN_KB[A_UEY], R[A_UEY], u);
    R[A_OEK] = anKr(0.5, -0.9, u); R[A_UEK] = anKr(-1.3, -0.9, u); R[A_OEA] = 0.5 * u; R[A_UEA] = 0.5 * u;
    R[A_BA] = anKr(R[A_BA], 0.32, u); R[A_GUL] = 1; R[A_GOZ] = anKr(1, 0.05, u); R[A_MUT] = u; R[A_BKY] = 0.6;
    return;
  }
  if (ad === 'cagir' && !kayik) {   // yanındaki örtüye eliyle hafifçe vurur
    const w = Math.max(0, Math.sin(tm * 6.5));
    R[A_GV] += 0.1; anElMutlak(R, A_OEX, true, 30, -8 - 9 * w);
    R[A_OEA] = 0.8; R[A_OEK] = -0.3; R[A_BA] = 0.12;
    R[A_GUL] = 1; R[A_AGZ] = 0.32; R[A_KAS] = 0.4; R[A_BKY] = 0.45; R[A_BKX] = 0.75;
    return;
  }
  const ust = AN_KA;
  anPozUret(ust, ad, tm, AN_BOS_O);
  // kolların omuza göre hedefi aynen geçer; kayıkta uzak el kürekte kalır (alkışta ikisi de gelir)
  R[A_OEX] = ust[A_OEX]; R[A_OEY] = ust[A_OEY]; R[A_OEA] = ust[A_OEA]; R[A_OEK] = ust[A_OEK];
  if (!kayik || ad === 'alkis') { R[A_UEX] = ust[A_UEX]; R[A_UEY] = ust[A_UEY]; R[A_UEA] = ust[A_UEA]; R[A_UEK] = ust[A_UEK]; }
  if (ad === 'alkis') R[A_GV] += 0.06;
  R[A_GUL] = ust[A_GUL]; R[A_AGZ] = ust[A_AGZ]; R[A_KAS] = ust[A_KAS]; R[A_MUT] = ust[A_MUT]; R[A_GOZ] = ust[A_GOZ];
  R[A_BKX] = ust[A_BKX]; R[A_BKY] = ust[A_BKY]; R[A_BA] += ust[A_BA] * 0.7;
}
function anPozUcurtma(R, tm, o) {
  anPozDur(R, tm, null);
  const u = anYm(o && Number.isFinite(o.u) ? o.u : 1), s = Math.sin(tm * 2.2);
  // 0: uçurtmayı iki eliyle yukarıda tutar; 1: ipi öne eğilip Feza'nın eline uzatır
  R[A_GV] += anKr(-0.06, 0.32, u); R[A_HX] += anKr(0, -2.5, u); R[A_HY] += anKr(0, 3.5, u);
  anElMutlak(R, A_OEX, true, anKr(16, 37, u) + s * 0.8, anKr(-127, -64, u) + s * 1.2);
  anElMutlak(R, A_UEX, false, anKr(11, 29, u), anKr(-124, -70, u));
  R[A_OEK] = anKr(-1.6, -0.5, u); R[A_UEK] = R[A_OEK]; R[A_OEA] = 0; R[A_UEA] = 0;
  R[A_BA] = anKr(-0.3, 0.12, u); R[A_BKY] = anKr(-0.9, 0.7, u); R[A_BKX] = 0.7;
  R[A_GUL] = 1; R[A_AGZ] = 0.3; R[A_KAS] = 0.4;
}
function anPozOturTam(R, tm) {   // yere oturmuş: (0,0) kalçanın altındaki yer noktası; yakın bacak uzanır, uzak diz kalkık
  anTemel(R);
  const nf = Math.sin(tm * 1.5), sl = Math.sin(tm * 0.6);
  R[A_HX] = 0; R[A_HY] = -11; R[A_GV] = -0.1 + 0.02 * sl + 0.01 * nf; R[A_OMZ] = 0.4 + 0.4 * nf;
  anAyakYer(R, A_AYX, 53, 0.55, 0); anAyakYer(R, A_UYX, 30, 0.05, 0);
  anElMutlak(R, A_OEX, true, 22, -27);      // el kucakta
  anElMutlak(R, A_UEX, false, -16, -3.5);   // öbür el geride yere dayalı
  R[A_OEK] = 0.5; R[A_UEK] = -1.3; R[A_OEA] = 0.3; R[A_UEA] = 0.6;
  R[A_BA] = 0.08 + 0.05 * sl; R[A_CNT] = 0; R[A_GUL] = 0.85; R[A_BKX] = 0.5; R[A_BKY] = 0.25;
}
function anComel(R) {   // çömelmiş ara poz (oturmaya inerken)
  R[A_HX] = -7; R[A_HY] = -37; R[A_GV] = 0.55; anKolAci(R, A_OEX, 0.7, 0.5); anKolAci(R, A_UEX, 0.5, 0.4); R[A_BKY] = 0.5; R[A_CNT] = 0;
}
function anPozOtur(R, tm, o) {   // opt.u: 0 ayakta → 0.5 çömelir → 1 oturur
  const u = anSn(o && Number.isFinite(o.u) ? o.u : 1, 0, 1);
  if (u >= 0.999) { anPozOturTam(R, tm); return; }
  if (u < 0.5) {
    anPozDur(AN_KA, tm, null); AN_KB.set(AN_KA); anComel(AN_KB);
  } else {
    anPozDur(AN_KA, tm, null); anComel(AN_KA); anPozOturTam(AN_KB, tm);
  }
  const e = anYm(u < 0.5 ? u / 0.5 : (u - 0.5) / 0.5);
  for (let i = 0; i < AN_N; i++) R[i] = anKr(AN_KA[i], AN_KB[i], e);
  if (u >= 0.5) R[A_HY] -= Math.sin(AN_PI * e) * 2;
}
function anPozAlkis(R, tm, o) {
  anPozDur(R, tm, null);
  const c = Math.pow(Math.abs(Math.sin(tm * 8.4)), 0.6), z = Math.abs(Math.sin(tm * 4.2));
  R[A_HY] += -1.0 * z; R[A_GV] = 0.06;
  anGv(R, 0, -17); const gx = anPX + 14, gy = anPY;
  anElMutlak(R, A_OEX, true, gx + 4.5 * c, gy - 1.5); anElMutlak(R, A_UEX, false, gx - 3.5 * c, gy - 2.5);
  R[A_OEK] = -1.4; R[A_UEK] = -1.4; R[A_OEA] = 0.7; R[A_UEA] = 0.7;
  R[A_GUL] = 1; R[A_AGZ] = 0.5; R[A_MUT] = 0.7; R[A_GOZ] = 0.4; R[A_KAS] = 0.4; R[A_BA] = -0.06;
}
function anPozSaril(R, tm, o) {
  const u = anSn(o && Number.isFinite(o.u) ? o.u : 1, 0, 1), d = anYm(u / 0.55), s = anYm((u - 0.45) / 0.55), nf = Math.sin(tm * 1.6);
  anPozDur(R, tm, null);
  const hx = R[A_HX], hy = R[A_HY], gv = R[A_GV], ax = R[A_AYX], ay = R[A_AYY], ap = R[A_AYP], ux = R[A_UYX], uy = R[A_UYY], up = R[A_UYP];
  // diz çökme: yakın diz yere, uzak ayak önde basar
  R[A_HX] = anKr(hx, -4, d); R[A_HY] = anKr(hy, -33.5 + nf * 0.3, d); R[A_GV] = anKr(gv, 0.24 + 0.06 * s, d);
  R[A_AYX] = anKr(ax, -27, d); R[A_AYY] = anKr(ay, -4.5, d); R[A_AYP] = anKr(ap, -1.25, d);
  R[A_UYX] = anKr(ux, 14, d); R[A_UYY] = anKr(uy, -AN_AB, d); R[A_UYP] = anKr(up, 0, d);
  // kollar Feza'nın sırtına (Feza x+28'de)
  const nx = R[A_OEX], ny = R[A_OEY], fx = R[A_UEX], fy = R[A_UEY];
  anElMutlak(R, A_OEX, true, 34 + nf * 0.3, -50); anElMutlak(R, A_UEX, false, 31, -58);
  R[A_OEX] = anKr(nx, R[A_OEX], s); R[A_OEY] = anKr(ny, R[A_OEY], s); R[A_UEX] = anKr(fx, R[A_UEX], s); R[A_UEY] = anKr(fy, R[A_UEY], s);
  R[A_OEK] = anKr(0.15, -0.9, s); R[A_UEK] = R[A_OEK]; R[A_OEA] = 0.5 * s; R[A_UEA] = 0.5 * s;
  R[A_BA] = anKr(0.03, 0.36, s); R[A_GUL] = 1; R[A_GOZ] = anKr(1, 0.05, s); R[A_MUT] = s; R[A_BKY] = 0.6; R[A_KAS] = 0.3 * s;
}
function anPozDans(R, tm, o) {
  anTemel(R);
  const w = tm * AN_PI * 2.1, s = Math.sin(w), z = Math.abs(Math.sin(w)), c2 = Math.sin(w * 0.5);
  R[A_HX] = 2.5 * s; R[A_HY] = -62.2 + 2.0 * z; R[A_GV] = 0.04 - 0.07 * s; R[A_OMZ] = 1.2 * z;
  // yerinde adım-dokun: ayaklar sırayla küçük dokunuşlar yapar
  const p0 = Math.max(0, Math.sin(w * 0.5)), p1 = Math.max(0, -Math.sin(w * 0.5));
  anAyakYer(R, A_AYX, 6 + 3 * p0, -0.5 * p0, 4.5 * p0); anAyakYer(R, A_UYX, -5 - 3 * p1, -0.5 * p1, 4.5 * p1);
  anKolAci(R, A_OEX, 1.75 + 0.75 * c2, 0.45 + 0.3 * s); anKolAci(R, A_UEX, 1.75 - 0.75 * c2, 0.45 - 0.3 * s);
  R[A_OEA] = 1; R[A_UEA] = 1; R[A_OEK] = 0.3 * s; R[A_UEK] = -0.3 * s;
  R[A_BA] = 0.12 * c2 - 0.06; R[A_GUL] = 1; R[A_AGZ] = 0.45; R[A_MUT] = 0.5 + 0.5 * Math.max(0, c2); R[A_GOZ] = 0.6; R[A_KAS] = 0.4;
  AN_ST.sacEk = 0.25 * s;
}

// poz adı → üretici ve aile (aile değişince ayaklar yeniden yerleşir)
const AN_POZ = {
  dur: [anPozDur, 'ayakta'], el_salla: [anPozElSalla, 'ayakta'], isaret: [anPozIsaret, 'ayakta'], kokla: [anPozKokla, 'ayakta'],
  ucurtma_ver: [anPozUcurtma, 'ayakta'], alkis: [anPozAlkis, 'ayakta'], saril: [anPozSaril, 'ayakta'],
  yuru: [anPozYuru, 'hareket'], kos: [anPozYuru, 'hareket'], dans: [anPozDans, 'dans'],
  bisiklet: [anPozBisiklet, 'bisiklet'], bisiklet_bin: [anPozBinis, 'bisiklet'], bisiklet_in: [anPozBinis, 'bisiklet'],
  kayik_kurek: [anPozKayik, 'kayik'], otur: [anPozOtur, 'otur'], cagir: [anPozCagir, 'ayakta']
};
const AN_OTURARAK = { el_salla: 1, isaret: 1, alkis: 1, saril: 1, cagir: 1 };
const AN_ESKI_AD = { el: 'el_salla', kayik: 'kayik_kurek' };
function anPozUret(R, ad, tm, o) {
  const p = AN_POZ[ad] || AN_POZ.dur;
  if (o.otur && AN_OTURARAK[ad]) anPozOturarak(R, ad, tm, o);
  else if (ad === 'kos') anPozYuru(R, tm, o, true);
  else if (ad === 'bisiklet_in') anPozBinis(R, tm, o, true);
  else p[0](R, tm, o);
}

// ══════════════════════ ÇİZİM ══════════════════════
const anC = document.createElement('canvas'), anG = anC.getContext('2d');
const anH = document.createElement('canvas'), anHG = anH.getContext('2d');   // kontur / kenar ışığı yardımcısı
const AN_KX = 84, AN_KY = 180, AN_KW = 168, AN_KH = 196;   // model kutusu: x -84..84, y -180..16
let anGr = null;
function anGrad() {   // sabit renk geçişleri (model / parça koordinatında bir kez)
  if (anGr) return anGr;
  const x = anG, r = {};
  r.yuz = x.createRadialGradient(5.5, -2.5, 1, 2.5, 1, 15.5);
  r.yuz.addColorStop(0, AN.tenA); r.yuz.addColorStop(0.5, AN.ten); r.yuz.addColorStop(1, AN.tenG);
  r.govde = x.createLinearGradient(-10, 0, 10, 0);
  r.govde.addColorStop(0, 'rgba(120,60,62,0.26)'); r.govde.addColorStop(0.38, 'rgba(120,60,62,0)'); r.govde.addColorStop(0.78, 'rgba(255,250,240,0.12)'); r.govde.addColorStop(1, 'rgba(120,60,62,0.12)');
  r.sac = x.createLinearGradient(0, -15, 0, 9);
  r.sac.addColorStop(0, 'rgba(255,215,170,0.16)'); r.sac.addColorStop(0.45, 'rgba(255,215,170,0)'); r.sac.addColorStop(1, 'rgba(30,10,5,0.22)');
  r.allik = x.createRadialGradient(0, 0, 0, 0, 0, 1);
  r.allik.addColorStop(0, 'rgba(242,118,108,0.52)'); r.allik.addColorStop(1, 'rgba(242,124,112,0)');
  r.deger = x.createLinearGradient(0, -140, 0, 6);   // aşağı doğru hafif koyulaşma (Feza ile aynı ışık dili)
  r.deger.addColorStop(0, 'rgba(34,18,12,0.04)'); r.deger.addColorStop(0.55, 'rgba(22,16,24,0.1)'); r.deger.addColorStop(1, 'rgba(14,16,32,0.26)');
  return (anGr = r);
}
let anGolgeS = null;
function anGolgeSpr() {   // yer gölgesi (bir kez)
  if (anGolgeS) return anGolgeS;
  const c = document.createElement('canvas'); c.width = 96; c.height = 32; const h = c.getContext('2d');
  h.translate(48, 16); h.scale(1, 1 / 3);
  const rg = h.createRadialGradient(0, 0, 0, 0, 0, 48);
  rg.addColorStop(0, 'rgba(20,26,40,0.5)'); rg.addColorStop(0.55, 'rgba(20,26,40,0.26)'); rg.addColorStop(1, 'rgba(20,26,40,0)');
  h.fillStyle = rg; h.fillRect(-48, -48, 96, 96);
  return (anGolgeS = c);
}

// şekil yardımcıları (anG üzerinde)
function anKaps(x1, y1, x2, y2, r1, r2, col) {   // iki ucu yuvarlak, incelen kapsül
  const a = Math.atan2(y2 - y1, x2 - x1), g = anG;
  g.fillStyle = col; g.beginPath();
  g.arc(x1, y1, r1, a + 1.5708, a - 1.5708); g.arc(x2, y2, r2, a - 1.5708, a + 1.5708);
  g.closePath(); g.fill();
}
function anBant(x1, y1, x2, y2, r, col) {   // uzuv boyunca düz kenarlı bant (manşet, paça)
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1, nx = -dy / l * r, ny = dx / l * r, g = anG;
  g.fillStyle = col; g.beginPath(); g.moveTo(x1 + nx, y1 + ny); g.lineTo(x2 + nx, y2 + ny); g.lineTo(x2 - nx, y2 - ny); g.lineTo(x1 - nx, y1 - ny); g.closePath(); g.fill();
}
function anOval(cx, cy, rx, ry, rot, col) { const g = anG; g.fillStyle = col; g.beginPath(); g.ellipse(cx, cy, rx, ry, rot, 0, AN_2PI); g.fill(); }
// hacimli uzuv: gölge rengi tam kapsül + ışık yanına kaymış ana renk (silindir gibi) + isteğe bağlı ince koyu kenar
function anUzuv(x1, y1, x2, y2, r1, r2, ana, golge, kenar) {
  if (kenar) anKaps(x1, y1, x2, y2, r1 + 0.5, r2 + 0.5, kenar);
  anKaps(x1, y1, x2, y2, r1, r2, golge);
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1;
  let nx = -dy / l, ny = dx / l; if (nx * 0.45 - ny * 0.89 < 0) { nx = -nx; ny = -ny; }
  anKaps(x1 + nx * r1 * 0.26, y1 + ny * r1 * 0.26, x2 + nx * r2 * 0.26, y2 + ny * r2 * 0.26, r1 * 0.76, r2 * 0.76, ana);
}

function anAyakkabi(ax, ay, p, yakin) {
  const g = anG;
  g.save(); g.translate(ax, ay); g.rotate(-p);
  g.fillStyle = yakin ? AN.ayk : AN.aykU; g.beginPath();
  g.moveTo(-3.6, -1.9); g.quadraticCurveTo(-5.1, -1.5, -5.1, 1.4); g.lineTo(-5.1, 4.0); g.quadraticCurveTo(-5.1, 5.5, -3.6, 5.5);
  g.lineTo(10.6, 5.5); g.quadraticCurveTo(12.9, 5.5, 12.7, 3.5); g.quadraticCurveTo(12.4, 1.5, 9.6, 0.8);
  g.quadraticCurveTo(6.3, 0.1, 3.8, -1.4); g.quadraticCurveTo(0.6, -2.8, -3.6, -1.9); g.closePath(); g.fill();
  g.fillStyle = yakin ? AN.aykT : AN.aykTU; g.beginPath();   // taban
  g.moveTo(-5.1, 3.8); g.lineTo(12.75, 3.8); g.quadraticCurveTo(12.9, 5.6, 10.9, 5.7); g.lineTo(-3.7, 5.7); g.quadraticCurveTo(-5.2, 5.6, -5.1, 3.8); g.fill();
  g.strokeStyle = yakin ? AN.serit : AN.seritU; g.lineWidth = 1.05; g.lineCap = 'round';   // yan şerit
  g.beginPath(); g.moveTo(-2.6, 2.7); g.quadraticCurveTo(2.4, 3.2, 6.6, 0.9); g.stroke();
  g.strokeStyle = yakin ? '#cfd2da' : '#b5b8c2'; g.lineWidth = 0.45;   // bağcıklar
  g.beginPath(); g.moveTo(2.6, -1.3); g.lineTo(3.4, -0.3); g.moveTo(4.4, -0.6); g.lineTo(5.1, 0.3); g.stroke();
  g.restore();
}
function anBacak(R, yakin) {
  anKalca(R, yakin); const hx = anPX, hy = anPY;
  const ax = yakin ? R[A_AYX] : R[A_UYX], ay = yakin ? R[A_AYY] : R[A_UYY], p = yakin ? R[A_AYP] : R[A_UYP];
  anIK(hx, hy, ax, ay, AN_UY, AN_BA, 1); const kx = anJX, ky = anJY, ex = anEX, ey = anEY;
  const ana = yakin ? AN.kot : AN.kotU, gol = yakin ? AN.kotG : AN.kotUG, ken = yakin ? AN.kotK : null;
  const dx = ex - kx, dy = ey - ky, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  anAyakkabi(ex, ey, p, yakin);
  anOval(ex - ux * 0.6, ey - uy * 0.6, 2.7, 2.7, 0, yakin ? AN.ten : AN.tenU);   // bilek
  anUzuv(kx, ky, ex - ux * 2.4, ey - uy * 2.4, 5.3, 3.9, ana, gol, ken);         // baldır
  anBant(ex - ux * 5.0, ey - uy * 5.0, ex - ux * 2.4, ey - uy * 2.4, 4.15, yakin ? AN.kotA : '#7f9fcb');   // kıvrılmış paça
  anUzuv(hx, hy, kx, ky, 7.9, 5.6, ana, gol, ken);                               // uyluk
  if (yakin) {   // dizdeki ışık ve paça dikişi
    anOval(kx + 1.2, ky - 0.8, 1.4, 0.9, 0, 'rgba(200,220,245,0.22)');
    anG.strokeStyle = 'rgba(40,60,100,0.35)'; anG.lineWidth = 0.4;
    anG.beginPath(); anG.moveTo(ex - ux * 4.6 - uy * 3.4, ey - uy * 4.6 + ux * 3.4); anG.lineTo(ex - ux * 4.6 + uy * 3.4, ey - uy * 4.6 - ux * 3.4); anG.stroke();
  }
}
function anKalcaCiz(R) {   // kot pantolonun oturağı
  const g = anG; g.save(); g.translate(R[A_HX], R[A_HY]); g.rotate(R[A_GV] * 0.45); g.scale(AN_GE, 1);
  anOval(-0.8, 0.6, 9.3, 8.0, 0, AN.kotG); anOval(0.1, 0.0, 8.2, 7.2, 0, AN.kot);
  g.strokeStyle = 'rgba(40,60,100,0.3)'; g.lineWidth = 0.4; g.beginPath(); g.moveTo(-7.5, -1.5); g.quadraticCurveTo(-6.4, 3.6, -2.6, 5.2); g.stroke();   // arka cep
  g.restore();
}
function anGovdeYol(et, o) {   // bluzun dış çizgisi (gövde çerçevesi; et: hırka eteğinin savrulması, o: omuz kalkışı)
  const g = anG; g.beginPath();
  g.moveTo(-9.1 + et, 2.2);
  g.bezierCurveTo(-9.9 + et * 0.6, -6, -8.4, -14, -7.4, -19);
  g.bezierCurveTo(-6.6, -24, -8.0, -30.5 - o * 0.5, -6.4, -34.6 - o);
  g.quadraticCurveTo(-4.4, -37.4 - o, -0.8, -37.4 - o);
  g.lineTo(3.4, -37.0 - o);
  g.quadraticCurveTo(6.8, -36.4 - o, 8.0, -32.6 - o * 0.6);
  g.bezierCurveTo(9.5, -28.6, 9.3, -24.6, 7.4, -21.6);
  g.bezierCurveTo(6.2, -19.2, 6.0, -14.6, 6.6, -10.2);
  g.bezierCurveTo(7.6, -5.6, 8.4, -1.6, 8.0, 2.4);
  g.quadraticCurveTo(-0.5, 4.7, -9.1 + et, 2.2);
  g.closePath();
}
function anHirkaYol(et, o) {   // açık hırka: sırtı ve yanları örter, önde bluz görünür
  const g = anG; g.beginPath();
  g.moveTo(-9.6 + et, 3.2);
  g.bezierCurveTo(-10.4 + et * 0.6, -6, -8.8, -14, -7.8, -19);
  g.bezierCurveTo(-7.0, -24, -8.4, -30.5 - o * 0.5, -6.8, -34.9 - o);
  g.quadraticCurveTo(-4.6, -37.9 - o, -0.8, -37.9 - o);
  g.lineTo(2.2, -37.5 - o);
  g.quadraticCurveTo(3.6, -30, 2.6, -22);
  g.bezierCurveTo(2.0, -14, 3.0, -6, 4.0, 3.0);
  g.quadraticCurveTo(-1.6, 5.4, -9.6 + et, 3.2);
  g.closePath();
}
function anGovde(R) {
  const g = anG, gr = anGrad(), o = R[A_OMZ], et = AN_ST.etek[0];
  g.save(); g.translate(R[A_HX], R[A_HY]); g.rotate(R[A_GV]); g.scale(AN_GE, AN_GK);
  // bluz
  anGovdeYol(et, o); g.fillStyle = AN.bluz; g.fill();
  g.save(); g.clip();
  anOval(6.8, -19.6, 3.4, 1.4, -0.2, 'rgba(160,140,125,0.16)');   // göğüs altı yumuşak gölge
  g.strokeStyle = AN.bluzG; g.lineWidth = 0.45; g.lineCap = 'round';
  g.beginPath(); g.moveTo(6.2, -15.5); g.quadraticCurveTo(5.6, -11, 6.4, -7); g.moveTo(7.2, -4.2); g.quadraticCurveTo(6.4, -1.5, 6.9, 1.6); g.stroke();
  g.restore();
  // V yaka ve ince kolye
  g.fillStyle = AN.ten; g.beginPath(); g.moveTo(0.6, -37.3 - o); g.lineTo(4.1, -31.2 - o * 0.5); g.lineTo(6.2, -36.6 - o); g.closePath(); g.fill();
  g.strokeStyle = AN.bluzK; g.lineWidth = 0.5; g.beginPath(); g.moveTo(0.8, -37.2 - o); g.lineTo(4.1, -31.1 - o * 0.5); g.lineTo(6.1, -36.5 - o); g.stroke();
  g.strokeStyle = AN.altin; g.lineWidth = 0.38; g.beginPath(); g.moveTo(1.6, -36.8 - o); g.quadraticCurveTo(3.7, -32.8 - o * 0.6, 5.5, -36.3 - o); g.stroke();
  anOval(3.75, -33.3 - o * 0.6, 0.62, 0.7, 0, AN.altin); anOval(3.6, -33.5 - o * 0.6, 0.22, 0.25, 0, '#fff6dc');
  // hırka
  anHirkaYol(et, o); g.fillStyle = AN.hirka; g.fill();
  g.save(); g.clip();
  g.fillStyle = gr.govde; g.fillRect(-12, -40, 24, 46);
  g.fillStyle = 'rgba(190,120,110,0.35)'; g.fillRect(-12, 0.2, 24, 6);   // örgü etek bandı
  g.strokeStyle = 'rgba(170,100,92,0.45)'; g.lineWidth = 0.35; g.beginPath();
  for (let i = -8; i <= 4; i += 1.6) { g.moveTo(i, 0.6); g.lineTo(i + 0.15, 4.6); }
  g.moveTo(-3.6, -30.5); g.quadraticCurveTo(-2.8, -25, -3.8, -20);   // koltuk altı kıvrımı
  g.stroke();
  g.restore();
  // hırkanın ön kenarı (pat) ve düğmeler
  g.strokeStyle = AN.hirkaA; g.lineWidth = 1.0; g.lineCap = 'round'; g.beginPath();
  g.moveTo(2.0, -37 - o); g.quadraticCurveTo(3.3, -30, 2.3, -22); g.bezierCurveTo(1.7, -14, 2.7, -6, 3.7, 2.6); g.stroke();
  anOval(2.85, -27.5, 0.55, 0.6, 0, AN.hirkaK); anOval(2.3, -19.5, 0.55, 0.6, 0, AN.hirkaK); anOval(2.5, -11.5, 0.55, 0.6, 0, AN.hirkaK);
  // boyun
  anUzuv(1.4, -34.8 - o, 2.5, -41.6 - o * 0.6, 3.4, 3.1, AN.ten, AN.tenG, null);
  anOval(2.6, -39.6 - o * 0.6, 3.0, 1.5, -0.2, 'rgba(201,143,118,0.45)');   // çene altı gölgesi
  g.restore();
}
function anCanta(R) {   // omuzdan sarkan bez çanta (sarkaç)
  const g = anG, th = AN_ST.cnt[0];
  anGv(R, 1.0, -34.4 - R[A_OMZ]); const hx = anPX, hy = anPY;
  const bx = hx + Math.sin(th) * 23, by = hy + Math.cos(th) * 23;
  AN_CANTA[0] = bx + Math.sin(th) * 7; AN_CANTA[1] = by + Math.cos(th) * 7; AN_CANTA[2] = 1;
  // saplar: çantanın iki köşesinden omza
  const c = Math.cos(-th), s = Math.sin(-th);
  const lx = bx + (-3.8) * c, ly = by + (-3.8) * s, rx = bx + 3.8 * c, ry = by + 3.8 * s;
  g.strokeStyle = AN.cantaK; g.lineWidth = 1.5; g.lineCap = 'round'; g.beginPath();
  g.moveTo(lx, ly); g.quadraticCurveTo(hx - 4.5, hy + 4, hx - 1.2, hy); g.moveTo(rx, ry); g.quadraticCurveTo(hx + 3.8, hy + 5, hx + 0.6, hy - 0.2); g.stroke();
  g.strokeStyle = AN.cantaG; g.lineWidth = 0.9; g.beginPath();
  g.moveTo(lx, ly); g.quadraticCurveTo(hx - 4.5, hy + 4, hx - 1.2, hy); g.moveTo(rx, ry); g.quadraticCurveTo(hx + 3.8, hy + 5, hx + 0.6, hy - 0.2); g.stroke();
  g.save(); g.translate(bx, by); g.rotate(-th); g.scale(0.82, 0.82);
  g.fillStyle = AN.cantaG; g.beginPath();
  g.moveTo(-6.2, 0); g.lineTo(6.2, 0); g.lineTo(7.4, 12.2); g.quadraticCurveTo(7.4, 13.6, 6, 13.6); g.lineTo(-6, 13.6); g.quadraticCurveTo(-7.4, 13.6, -7.4, 12.2); g.closePath(); g.fill();
  g.fillStyle = AN.canta; g.beginPath();
  g.moveTo(-5.2, 0); g.lineTo(6.2, 0); g.lineTo(7.2, 12); g.quadraticCurveTo(7.2, 13.1, 6, 13.1); g.lineTo(-4.6, 13.1); g.quadraticCurveTo(-6.2, 13.1, -6.3, 11.6); g.closePath(); g.fill();
  g.fillStyle = 'rgba(150,120,80,0.25)'; g.fillRect(-6, 0, 12.8, 1.2);   // üst dikiş bandı
  // ön yüzde küçük kalp baskısı
  g.fillStyle = AN.baski; g.beginPath(); g.moveTo(0.9, 9.6); g.bezierCurveTo(-2.6, 7.2, -1.6, 4.2, 0.9, 5.6); g.bezierCurveTo(3.4, 4.2, 4.4, 7.2, 0.9, 9.6); g.fill();
  g.restore();
}
function anKuyrukHesap(R) {   // at kuyruğu noktaları (fizik açılarından)
  anBas(R);
  const c = Math.cos(anBA), s = Math.sin(anBA), lx = -11.0 * AN_BK, ly = -5.6 * AN_BK;
  let x = anBX + lx * c - ly * s, y = anBY + lx * s + ly * c;
  AN_SP[0] = x; AN_SP[1] = y;
  const L = [10, 11, 9], ek = AN_ST.sacEk;
  for (let i = 0; i < 3; i++) {
    const a = AN_ST.sac[i * 2] + (i ? ek * i : 0);
    x += Math.sin(a) * L[i]; y += Math.cos(a) * L[i];
    AN_SP[i * 2 + 2] = x; AN_SP[i * 2 + 3] = y;
  }
}
const AN_KW_W = [2.6, 3.3, 2.5, 0.7];
function anKuyruk() {
  const g = anG, P = AN_SP;
  // her noktada normal ve genişlik: sol kenar → uç → sağ kenar
  g.fillStyle = AN.sac; g.beginPath();
  for (let side = 0; side < 2; side++) {
    for (let k = 0; k < 4; k++) {
      const i = side ? 3 - k : k, i0 = Math.max(0, i - 1), i1 = Math.min(3, i + 1);
      const dx = P[i1 * 2] - P[i0 * 2], dy = P[i1 * 2 + 1] - P[i0 * 2 + 1], l = Math.hypot(dx, dy) || 1;
      const sg = side ? -1 : 1, w = AN_KW_W[i] * sg, x = P[i * 2] - dy / l * w, y = P[i * 2 + 1] + dx / l * w;
      if (side === 0 && k === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    if (!side) {   // yuvarlak uç (hafif kıvrım)
      const dx = P[6] - P[4], dy = P[7] - P[5], l = Math.hypot(dx, dy) || 1;
      g.quadraticCurveTo(P[6] + dx / l * 2.6 + dy / l * 1.2, P[7] + dy / l * 2.6 - dx / l * 1.2, P[6] + dy / l * 0.9, P[7] - dx / l * 0.9);
    }
  }
  g.closePath(); g.lineJoin = 'round'; g.strokeStyle = AN.sac; g.lineWidth = 1.2; g.stroke(); g.fill();
  // tutam çizgileri: koyu orta, açık üst
  g.lineCap = 'round';
  g.strokeStyle = 'rgba(40,18,10,0.45)'; g.lineWidth = 0.5; g.beginPath();
  g.moveTo(P[0], P[1]); g.quadraticCurveTo(P[2], P[3], (P[2] + P[4]) / 2, (P[3] + P[5]) / 2); g.quadraticCurveTo(P[4], P[5], P[6], P[7]); g.stroke();
  g.strokeStyle = 'rgba(215,160,115,0.7)'; g.lineWidth = 0.9; g.beginPath();
  g.moveTo(P[0] + 1.2, P[1] - 1.2); g.quadraticCurveTo(P[2] + 1.6, P[3] - 0.6, (P[2] + P[4]) / 2 + 1.2, (P[3] + P[5]) / 2); g.stroke();
}
function anGoz(cx, cy, w, h, R, uzak, dis) {   // dis: gözün dış köşesinin yönü
  const g = anG, ac = anSn(R[A_GOZ], 0, 1), mt = R[A_MUT];
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (ac < 0.2 || (mt > 0.55 && ac < 0.65)) {   // kapalı göz: mutluysa yukarı kavis (^ ^)
    g.strokeStyle = AN.kirpik; g.lineWidth = uzak ? 0.6 : 0.78; g.beginPath();
    if (mt > 0.3) { g.moveTo(cx - w, cy + 0.5); g.quadraticCurveTo(cx, cy - h * 0.75, cx + w, cy + 0.5); }
    else { g.moveTo(cx - w, cy + 0.2); g.quadraticCurveTo(cx, cy + h * 0.5, cx + w, cy + 0.2); }
    g.moveTo(cx + dis * w, cy + 0.3); g.lineTo(cx + dis * w * 1.45, cy - 0.5);
    g.stroke(); return;
  }
  const a = 0.25 + 0.75 * ac, ry = h * a, cy2 = cy + h * (1 - a) * 0.45;
  g.fillStyle = '#fffdf8'; g.beginPath(); g.ellipse(cx, cy2, w, ry, 0, 0, AN_2PI); g.fill();
  g.save(); g.clip();
  const ix = cx + w * 0.22 + R[A_BKX] * w * 0.3, iy = cy2 + h * 0.08 + R[A_BKY] * h * 0.22;
  anOval(ix, iy, w * 0.88, h * 0.84, 0, AN.goz);
  anOval(ix, iy + h * 0.38, w * 0.62, h * 0.36, 0, AN.gozA);
  anOval(ix + w * 0.05, iy + h * 0.02, w * 0.4, h * 0.44, 0, AN.gozK);
  anOval(cx, cy2 - ry * 0.95, w * 1.2, h * 0.32, 0, 'rgba(120,70,60,0.2)');   // üst kapak gölgesi
  g.restore();
  anOval(ix + w * 0.3, iy - h * 0.3, w * 0.42, w * 0.42, 0, '#ffffff');      // ışıltılar
  anOval(ix - w * 0.32, iy + h * 0.3, w * 0.14, w * 0.14, 0, 'rgba(255,255,255,0.85)');
  g.strokeStyle = AN.kirpik; g.lineWidth = uzak ? 0.55 : 0.7; g.beginPath();   // kirpik çizgisi
  g.moveTo(cx - w * 1.05, cy2 + ry * 0.1); g.quadraticCurveTo(cx, cy2 - ry * 1.4, cx + w * 1.05, cy2 - ry * 0.05); g.stroke();
  g.lineWidth = 0.55; g.beginPath();
  if (!uzak) { g.moveTo(cx + dis * w * 0.98, cy2 - ry * 0.15); g.quadraticCurveTo(cx + dis * w * 1.3, cy2 - ry * 0.35, cx + dis * w * 1.38, cy2 - ry * 0.7); }
  else { g.moveTo(cx + w * 0.95, cy2 - ry * 0.2); g.quadraticCurveTo(cx + w * 1.12, cy2 - ry * 0.4, cx + w * 1.12, cy2 - ry * 0.62); }
  g.stroke();
}
function anAgiz(R) {
  const g = anG, s = anSn(R[A_GUL], 0, 1), o = anSn(R[A_AGZ], 0, 1), cx = 9.0, cy = 7.3, hw = 2.0 + 0.8 * s;
  g.lineCap = 'round';
  if (o < 0.08) {
    g.strokeStyle = AN.dudakK; g.lineWidth = 0.72; g.beginPath();
    g.moveTo(cx - hw, cy - 0.3 - 0.4 * s); g.quadraticCurveTo(cx - 0.1, cy + 0.5 + 1.3 * s, cx + hw * 0.88, cy - 0.45 - 0.5 * s); g.stroke();
    g.strokeStyle = 'rgba(207,125,119,0.55)'; g.lineWidth = 0.55; g.beginPath();   // alt dudak
    g.moveTo(cx - hw * 0.4, cy + 1.2 + 1.0 * s); g.quadraticCurveTo(cx, cy + 1.7 + 1.1 * s, cx + hw * 0.4, cy + 1.1 + 0.9 * s); g.stroke();
    return;
  }
  const y0 = cy - 0.4 - 0.4 * s, yb = cy + 0.6 + 0.7 * s + 2.6 * o;
  g.beginPath(); g.moveTo(cx - hw, y0); g.quadraticCurveTo(cx, cy + 0.2 + 0.4 * s, cx + hw * 0.9, y0 - 0.15);
  g.quadraticCurveTo(cx + 0.2, yb, cx - hw, y0); g.closePath();
  g.fillStyle = AN.agiz; g.fill();
  g.save(); g.clip();
  g.fillStyle = AN.dis; g.fillRect(cx - hw, y0 - 1, hw * 2, 1.45 + 0.3 * o);
  anOval(cx + 0.1, yb - 0.2, hw * 0.6, 1.1 * o + 0.3, 0, AN.dil);
  g.restore();
  g.strokeStyle = AN.dudak; g.lineWidth = 0.5; g.beginPath(); g.moveTo(cx - hw, y0); g.quadraticCurveTo(cx + 0.2, yb, cx + hw * 0.9, y0 - 0.15); g.stroke();
}
function anBasCiz(R, tm) {
  const g = anG, gr = anGrad();
  anBas(R);
  g.save(); g.translate(anBX, anBY); g.rotate(anBA); g.scale(AN_BK, AN_BK);
  // kafa + yüz (tek dolgu, sıcak ışık geçişi)
  g.fillStyle = gr.yuz; g.beginPath();
  g.moveTo(10.8, -1.2); g.ellipse(-0.6, -1.2, 11.4, 11.8, 0, 0, AN_2PI);
  g.moveTo(12.0, 2.6); g.ellipse(4.6, 2.6, 7.4, 7.6, 0, 0, AN_2PI);
  g.moveTo(12.0, 3.8); g.ellipse(8.4, 3.8, 3.6, 4.3, 0, 0, AN_2PI);
  g.moveTo(10.2, 8.0); g.ellipse(6.8, 8.0, 3.4, 2.9, 0, 0, AN_2PI);
  g.moveTo(7.6, 5.0); g.ellipse(1.0, 5.0, 6.6, 5.5, 0, 0, AN_2PI);
  g.moveTo(12.85, 2.6); g.ellipse(11.75, 2.6, 1.1, 1.45, 0, 0, AN_2PI);   // burun
  g.fill();
  g.save(); g.clip();
  anOval(3.4, 10.6, 6.5, 1.6, 0.15, 'rgba(201,130,105,0.22)');        // çene altı
  g.save(); g.translate(5.6, 5.4); g.scale(3.5, 2.3); g.fillStyle = gr.allik; g.beginPath(); g.arc(0, 0, 1, 0, AN_2PI); g.fill(); g.restore();   // yanak pembeliği
  g.save(); g.translate(11.4, 4.6); g.scale(1.3, 1.1); g.fillStyle = gr.allik; g.beginPath(); g.arc(0, 0, 1, 0, AN_2PI); g.fill(); g.restore();
  g.restore();
  // kulak ve minik inci küpe
  anOval(-2.4, 2.7, 2.55, 3.3, 0.12, 'rgba(201,143,118,0.55)'); anOval(-2.3, 2.6, 2.25, 3.0, 0.12, AN.ten);
  g.strokeStyle = 'rgba(190,118,95,0.65)'; g.lineWidth = 0.42; g.lineCap = 'round';
  g.beginPath(); g.arc(-2.2, 2.7, 1.35, -1.3, 1.9); g.stroke();
  anOval(-2.1, 6.0, 0.75, 0.75, 0, '#fff5ea'); anOval(-2.3, 5.8, 0.28, 0.28, 0, '#ffffff');
  // saç kütlesi (geriye toplanmış)
  g.fillStyle = AN.sac; g.beginPath();
  g.moveTo(9.4, -7.2);
  g.bezierCurveTo(8.6, -12.4, 3.0, -14.8, -2.0, -14.2);
  g.bezierCurveTo(-8.2, -13.4, -12.9, -8.2, -12.7, -2.0);
  g.bezierCurveTo(-12.5, 3.0, -10.2, 6.6, -7.4, 8.4);
  g.bezierCurveTo(-6.3, 6.0, -5.4, 3.4, -5.0, 0.8);
  g.bezierCurveTo(-4.6, -1.8, -2.6, -3.7, 0.3, -4.5);
  g.bezierCurveTo(3.6, -5.3, 6.9, -5.3, 9.4, -7.2);
  g.closePath(); g.fill();
  g.save(); g.clip();
  g.fillStyle = gr.sac; g.fillRect(-14, -16, 26, 26);
  g.strokeStyle = 'rgba(40,18,10,0.42)'; g.lineWidth = 0.42; g.lineCap = 'round'; g.beginPath();   // geriye taranmış teller
  g.moveTo(7.8, -7.4); g.quadraticCurveTo(0, -11.5, -10, -6.4);
  g.moveTo(4.2, -5.6); g.quadraticCurveTo(-2, -8.6, -10.2, -5.0);
  g.moveTo(0.6, -4.6); g.quadraticCurveTo(-4.4, -6.2, -10.4, -4.4);
  g.moveTo(-5.6, 3.6); g.quadraticCurveTo(-7.6, -1.6, -10.6, -4.0);
  g.stroke();
  g.strokeStyle = 'rgba(225,170,120,0.7)'; g.lineWidth = 0.9; g.beginPath();                       // parlaklık yayı
  g.moveTo(5.0, -11.4); g.quadraticCurveTo(-0.6, -13.4, -6.6, -10.6); g.stroke();
  g.restore();
  // gözler, kaşlar, burun, ağız
  anGoz(5.3, 0.5, 2.75, 3.35, R, false, -1);
  anGoz(9.95, 0.3, 1.3, 3.0, R, true, 1);
  const k = R[A_KAS] * 0.9;
  g.strokeStyle = AN.kas; g.lineCap = 'round'; g.lineWidth = 0.62; g.beginPath();
  g.moveTo(3.2, -4.9 - k * 0.8); g.quadraticCurveTo(5.4, -6.4 - k * 1.1, 7.6, -5.6 - k); g.stroke();
  g.lineWidth = 0.5; g.beginPath(); g.moveTo(9.2, -5.5 - k); g.quadraticCurveTo(10.2, -6.0 - k, 11.0, -5.3 - k * 0.8); g.stroke();
  g.strokeStyle = 'rgba(196,128,104,0.7)'; g.lineWidth = 0.5; g.beginPath();
  g.moveTo(11.5, 1.0); g.quadraticCurveTo(12.9, 3.2, 11.6, 3.9); g.stroke();
  anOval(11.0, 3.7, 0.5, 0.28, 0.2, 'rgba(190,115,95,0.5)');
  anOval(12.1, 2.2, 0.35, 0.35, 0, 'rgba(255,246,238,0.7)');
  anAgiz(R);
  // yana taranmış perçem ve kulak önünde sallanan ince tutam
  const sw = Math.sin(tm * 1.7) * 0.25 + AN_ST.sac[1] * 0.02;
  g.fillStyle = AN.sac; g.beginPath();
  g.moveTo(1.2, -13.8); g.bezierCurveTo(7.4, -13.6, 11.6, -10.2, 12.0 + sw, -5.2);
  g.bezierCurveTo(10.9, -6.9, 9.3, -7.6, 7.4, -7.6);
  g.bezierCurveTo(8.0, -9.4, 5.6, -11.6, 1.2, -13.8); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(200,140,95,0.6)'; g.lineWidth = 0.55; g.beginPath(); g.moveTo(2.6, -12.9); g.quadraticCurveTo(8.0, -12.0, 10.6, -7.4); g.stroke();
  // toka (at kuyruğunun dibinde)
  anOval(-11.2, -5.4, 2.4, 3.0, 0.4, AN.tokaG); anOval(-10.9, -5.8, 1.8, 2.4, 0.4, AN.toka);
  anOval(-10.4, -6.6, 0.6, 0.5, 0, 'rgba(255,230,225,0.8)');
  g.restore();
}
function anEl(wx, wy, dx, dy, ek, acik, yakin) {   // bilekten itibaren el; (dx,dy) ön kolun yönü
  const g = anG, sk = yakin ? AN.ten : AN.tenU;
  g.save(); g.translate(wx, wy); g.rotate(Math.atan2(dy, dx) + ek);
  g.scale(0.95, 0.95);
  if (yakin) anOval(2.9, 0, 3.55, 2.75, 0, AN.tenK);
  if (acik > 0.45) {   // açık el: yelpaze parmaklar
    for (let f = 0; f < 4; f++) { const a = -0.42 + f * 0.27, l = 3.4 + (f === 1 || f === 2 ? 0.6 : 0); anKaps(4.2, (f - 1.5) * 0.85, 4.2 + Math.cos(a) * l, (f - 1.5) * 0.85 + Math.sin(a) * l, 0.78, 0.62, sk); }
  } else if (acik < -0.5) {   // işaret parmağı
    anKaps(4.4, -0.9, 9.4, -1.2, 0.85, 0.68, sk);
  } else anOval(5.2, 0.3, 2.0, 2.2, 0, sk);
  anOval(2.9, 0, 3.3, 2.5, 0, sk);
  anOval(2.6, -2.2, 1.65, 1.05, -0.5, sk);   // başparmak
  g.strokeStyle = 'rgba(190,118,95,0.45)'; g.lineWidth = 0.32; g.beginPath(); g.moveTo(3.8, -0.6); g.lineTo(5.6, -0.4); g.stroke();
  g.restore();
}
function anKol(R, yakin) {
  anOmuz(R, yakin); const sx = anPX, sy = anPY;
  const tx = sx + (yakin ? R[A_OEX] : R[A_UEX]), ty = sy + (yakin ? R[A_OEY] : R[A_UEY]);
  anIK(sx, sy, tx, ty, AN_UK, AN_OK, -1); const ex = anJX, ey = anJY, wx = anEX, wy = anEY;
  const ana = yakin ? AN.hirka : AN.hirkaU, gol = yakin ? AN.hirkaG : AN.hirkaUG, ken = yakin ? AN.hirkaK : null;
  const dx = wx - ex, dy = wy - ey, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
  anUzuv(sx, sy, ex, ey, 5.3, 4.3, ana, gol, ken);
  anUzuv(ex, ey, wx - ux * 1.2, wy - uy * 1.2, 4.3, 3.5, ana, gol, ken);
  anBant(wx - ux * 3.6, wy - uy * 3.6, wx - ux * 0.6, wy - uy * 0.6, 3.7, yakin ? AN.hirkaA : '#ebb7aa');   // örgü manşet
  anEl(wx, wy, ux, uy, yakin ? R[A_OEK] : R[A_UEK], yakin ? R[A_OEA] : R[A_UEA], yakin);
  if (yakin) { ANNE12_ELLER.onX = wx + ux * 3; ANNE12_ELLER.onY = wy + uy * 3; } else { ANNE12_ELLER.arkaX = wx + ux * 3; ANNE12_ELLER.arkaY = wy + uy * 3; }
}
// tüm vücut (katman bitleri: 1 uzak kol, 2 uzak bacak, 4 gövde+baş, 8 yakın bacak, 16 yakın kol)
function anVucut(R, tm, kat) {
  if (kat & 1) anKol(R, false);
  if (kat & 2) anBacak(R, false);
  if (kat & 4) anKalcaCiz(R);
  if (kat & 8) anBacak(R, true);
  if (kat & 4) {
    anGovde(R);
    if (R[A_CNT] > 0.5) anCanta(R);
    anKuyrukHesap(R); anKuyruk();
    anBasCiz(R, tm);
  }
  if (kat & 16) anKol(R, true);
  else { anOmuz(R, true); anIK(anPX, anPY, anPX + R[A_OEX], anPY + R[A_OEY], AN_UK, AN_OK, -1); ANNE12_ELLER.onX = anEX; ANNE12_ELLER.onY = anEY; }
  if (!(kat & 1)) { anOmuz(R, false); anIK(anPX, anPY, anPX + R[A_UEX], anPY + R[A_UEY], AN_UK, AN_OK, -1); ANNE12_ELLER.arkaX = anEX; ANNE12_ELLER.arkaY = anEY; }
}

// ── kontur ve kenar ışığı (Feza'nınkiyle aynı yöntem) ──
const AN_HEX = [[1, 0], [0.5, 0.866], [-0.5, 0.866], [-1, 0], [-0.5, -0.866], [0.5, -0.866]];
function anHalka(d, col) {   // anC silüetinin d piksel dışındaki halka → anH
  const r = anHG, w = anH.width, h = anH.height;
  r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'source-over'; r.globalAlpha = 1; r.clearRect(0, 0, w, h);
  for (let k = 0; k < 6; k++) r.drawImage(anC, AN_HEX[k][0] * d, AN_HEX[k][1] * d);
  r.globalCompositeOperation = 'source-in'; r.fillStyle = col; r.fillRect(0, 0, w, h);
  r.globalCompositeOperation = 'destination-out'; r.drawImage(anC, 0, 0); r.globalCompositeOperation = 'source-over';
}
function anKenarIsik(lx, ly, d, col, al) {   // silüetin (lx,ly) yanındaki ince ışık bandı
  if (al < 0.02) return;
  const r = anHG, w = anH.width, h = anH.height;
  r.setTransform(1, 0, 0, 1, 0, 0); r.globalCompositeOperation = 'copy'; r.globalAlpha = al; r.fillStyle = col; r.fillRect(0, 0, w, h);
  r.globalAlpha = 1; r.globalCompositeOperation = 'destination-out'; r.drawImage(anC, -lx * d, -ly * d);
  r.globalCompositeOperation = 'source-over';
  anG.setTransform(1, 0, 0, 1, 0, 0); anG.globalCompositeOperation = 'source-atop'; anG.drawImage(anH, 0, 0); anG.globalCompositeOperation = 'source-over';
}

// ── zaman, faz, karışım ve ikincil hareket ──
function anAdim(x, y, olcek, tm, o, poz, yon) {
  const st = AN_ST;
  let dt = st.tm < 0 ? 0 : tm - st.tm;
  if (!(dt >= 0) || dt > 0.25) dt = 0;   // geri sarma ya da uzun ara: yalnız zamanı al
  dt = Math.min(dt, 0.05);
  const dxw = Number.isFinite(st.x) ? x - st.x : 0, dyw = Number.isFinite(st.y) ? y - st.y : 0;
  const sicra = Math.abs(dxw) > 60 * olcek || Math.abs(dyw) > 60 * olcek || st.ilk;
  st.tm = tm; st.x = x; st.y = y; st.olcek = olcek;
  const dxm = sicra ? 0 : dxw / olcek;
  if (dt > 0) {
    // hız: verilmişse o, yoksa x değişiminden (yumuşatılmış)
    const vo = st.hiz, vOlc = Math.abs(dxm) / dt;
    const vH = o && Number.isFinite(o.hiz) ? Math.abs(o.hiz) / olcek : vOlc;
    st.hiz = anKr(st.hiz, vH, 1 - Math.exp(-dt * (vH > st.hiz ? 9 : 6)));
    st.ivme = anKr(st.ivme, (st.hiz - vo) / dt, 1 - Math.exp(-dt * 6));
    st.vx = anKr(st.vx, dxm * yon / dt, 1 - Math.exp(-dt * 10));   // yüzün baktığı yöne göre hız
    if (poz === 'yuru' || poz === 'kos' || poz === 'bisiklet') {
      const yol = Math.abs(dxm) > 1e-4 ? Math.abs(dxm) : st.hiz * dt;
      const Lc = poz === 'bisiklet' ? 46 : anDongu(st.hiz, anKosuK(st.hiz, poz === 'kos'));
      st.faz = anKs(st.faz + yol / Lc);
    }
    st.durT += dt; st.idleT = poz === 'dur' ? st.idleT + dt : 0;
    // göz kırpma
    st.kirpT -= dt;
    if (st.kirpT <= 0) { st.kirpU = 0; st.kirpT = 2.4 + Math.random() * 3.2; if (Math.random() < 0.18) st.kirpT = 0.32; }
    st.kirpU = Math.min(1, st.kirpU + dt / 0.17);
    if (st.gecis < 1) st.gecis = Math.min(1, st.gecis + dt / 0.3);
    if (st.donU < 1) st.donU = Math.min(1, st.donU + dt / 0.22);
  }
  // poz değişimi: eski son pozu dondur, yenisine karış; aile değişince ayaklar yerleşir
  const ai = o.otur && AN_OTURARAK[poz] ? (o.otur === 'kayik' ? 'kayik' : 'otur') : (AN_POZ[poz] || AN_POZ.dur)[1];
  if (poz !== st.poz) {
    if (!st.ilk) { AN_R0.set(AN_RS); st.gecis = 0; }
    if (ai !== st.aile || st.ilk) {
      st.durT = 0;
      const src = st.ilk ? null : AN_RS;
      st.dAyak[0] = src ? src[A_AYX] : 4.6; st.dAyak[1] = src ? src[A_AYY] : -AN_AB; st.dAyak[2] = src ? src[A_AYP] : 0;
      st.dAyak[3] = src ? src[A_UYX] : -4.2; st.dAyak[4] = src ? src[A_UYY] : -AN_AB; st.dAyak[5] = src ? src[A_UYP] : 0;
      st.ilkAyak = Math.abs(st.dAyak[0] - 4.6) >= Math.abs(st.dAyak[3] + 4.2) ? 0 : 1;
    }
    st.poz = poz; st.aile = ai;
  }
  // yön değişimi: kısa dönüş (genişlik daralıp aynalanır)
  if (yon !== st.yonG) { st.donEski = st.yonG; st.yonG = yon; st.donU = st.ilk ? 1 : 0; st.vx = 0; st.fizikHazir = false; }
  if (sicra) st.fizikHazir = false;
  st.ilk = false;
  return dt;
}
function anFizik(R, dt) {
  const st = AN_ST;
  anKuyrukHesap(R);
  const ax = AN_SP[0], ay = AN_SP[1];
  if (!st.fizikHazir) {
    st.fizikHazir = true; st.apx = ax; st.apy = ay; st.avx = 0; st.avy = 0; st.kumX = 0;
    anBas(R); const ba = anBA;
    st.sac[0] = -0.62 + ba * 0.75 - anSn(st.vx * 0.0021, -0.45, 0.6); st.sac[2] = st.sac[0] + 0.34; st.sac[4] = st.sac[2] + 0.26;
    st.sac[1] = st.sac[3] = st.sac[5] = 0; st.cnt[0] = -0.16; st.cnt[1] = 0; st.etek[0] = 0; st.etek[1] = 0;
    return;
  }
  if (!(dt > 0)) return;
  st.kumX += st.vx * dt;
  const px = st.kumX + ax, vx = (px - (st.kumX - st.vx * dt + st.apx)) / dt, vy = (ay - st.apy) / dt;
  let acx = (vx - st.avx) / dt, acy = (vy - st.avy) / dt;
  acx = anSn(acx, -2500, 2500); acy = anSn(acy, -2500, 2500);
  st.apx = ax; st.apy = ay; st.avx = vx; st.avy = vy;
  anBas(R);
  const ruz = anSn(st.vx * 0.003, -0.5, 0.75), n = dt > 0.02 ? 2 : 1, h = dt / n;
  for (let s = 0; s < n; s++) {
    for (let i = 0; i < 3; i++) {
      const j = i * 2, th = st.sac[j];
      const hedef = i === 0 ? -0.62 + anBA * 0.75 - ruz : st.sac[j - 2] + (i === 1 ? 0.34 : 0.26) - ruz * 0.4;
      const K = i === 0 ? 32 : i === 1 ? 55 : 70, C = i === 0 ? 4.2 : 5.2, m = 0.02;
      const al = K * (hedef - th) - C * st.sac[j + 1] + m * (-acx * Math.cos(th) + acy * Math.sin(th));
      st.sac[j + 1] += al * h; st.sac[j] += st.sac[j + 1] * h;
    }
    st.sac[0] = anSn(st.sac[0], -2.1, 0.35); st.sac[2] = anSn(st.sac[2], st.sac[0] - 0.5, st.sac[0] + 1.3); st.sac[4] = anSn(st.sac[4], st.sac[2] - 0.6, st.sac[2] + 1.3);
    // çanta: sarkaç (kalçaya yaslanır)
    const tc = st.cnt[0], ac = 32 * (-0.16 - ruz * 0.3 - tc) - 4.5 * st.cnt[1] + 0.008 * (-acx * Math.cos(tc) + acy * Math.sin(tc));
    st.cnt[1] += ac * h; st.cnt[0] = anSn(st.cnt[0] + st.cnt[1] * h, -0.85, 0.35);
    // hırka eteği: hızla geriye savrulur, durunca yaylanıp döner
    const te = anSn(-st.vx * 0.011, -3.5, 2.5), ae = 70 * (te - st.etek[0]) - 7 * st.etek[1] - acx * 0.0025;
    st.etek[1] += ae * h; st.etek[0] = anSn(st.etek[0] + st.etek[1] * h, -4.5, 3);
  }
}

// ── ana çizim ──
let anHataSay = 0;
function anne12Ciz(ctx, x, y, olcek, tm, opt) {
  if (!ctx || !Number.isFinite(x) || !Number.isFinite(y)) return;
  const o = opt || {};
  olcek = Number.isFinite(olcek) && olcek > 0.05 ? olcek : 1;
  tm = Number.isFinite(tm) ? tm : 0;
  let poz = typeof o.poz === 'string' ? (AN_ESKI_AD[o.poz] || o.poz) : 'dur';
  if (!AN_POZ[poz]) poz = 'dur';
  const yon = o.yon === -1 ? -1 : 1;
  ctx.save();
  try {
    const dt = anAdim(x, y, olcek, tm, o, poz, yon), st = AN_ST, R = AN_R;
    // poz → dizi; geçişte donmuş eski pozdan karış
    anPozUret(R, poz, tm, o);
    if (st.gecis < 1) { const e = anYm(st.gecis); for (let i = 0; i < AN_N; i++) R[i] = anKr(AN_R0[i], R[i], e); }
    // yüz katmanı: Feza'ya bakma / yukarı bakma, göz kırpma
    const bak = Number.isFinite(o.bak) ? anSn(o.bak, -1, 1) : 0;
    if (bak > 0) { R[A_BA] += 0.14 * bak; R[A_BKY] = anKr(R[A_BKY], 0.65, bak); R[A_BKX] = anKr(R[A_BKX], 0.6, bak); R[A_GUL] = Math.max(R[A_GUL], 0.6 + 0.4 * bak); R[A_AGZ] += 0.12 * bak; R[A_KAS] += 0.25 * bak; }
    else if (bak < 0) { R[A_BA] += 0.2 * bak; R[A_BKY] = anKr(R[A_BKY], -0.85, -bak); R[A_GUL] = Math.max(R[A_GUL], 0.75); R[A_AGZ] += -0.15 * bak; }
    const kp = st.kirpU < 1 ? Math.abs(1 - 2 * st.kirpU) : 1;
    R[A_GOZ] *= kp;
    AN_RS.set(R);
    anFizik(R, dt);
    // bisikletin yere değdiği nokta mı, ayak tabanı mı: kök (ayakta durulan nokta) devir için saklanır
    const kokOfs = poz === 'bisiklet_in' && (o.u === undefined || o.u > 0.97) ? -22.6 : poz === 'bisiklet_bin' && o.u !== undefined && o.u < 0.03 ? -22.6 : (st.aile === 'bisiklet' ? NaN : 0);
    st.kokX = x + kokOfs * olcek * yon; st.kokY = y;

    // piksel ölçeği ve tuval boyu (çağıranın dönüşümünden)
    const m = ctx.getTransform ? ctx.getTransform() : null;
    const kp0 = m ? Math.hypot(m.a, m.b) : (typeof S === 'number' ? S : 1), k = anSn(kp0 * olcek, 0.2, 6);
    const needW = Math.ceil(AN_KW * k), needH = Math.ceil(AN_KH * k);
    if (anC.width < needW || anC.height < needH || anC.width > needW * 1.35 + 64 || anC.height > needH * 1.35 + 64) {
      anC.width = anH.width = Math.ceil(needW * 1.12 / 32) * 32; anC.height = anH.height = Math.ceil(needH * 1.12 / 32) * 32;
    }
    const ox = AN_KX * k, oy = AN_KY * k;
    // dönüş: genişlik daralıp ters yöne açılır (hiç çizgi kadar incelmez)
    let sx = yon;
    if (st.donU < 1) { const c = Math.cos(AN_PI * st.donU), w = Math.max(0.42, Math.abs(c)); sx = (c >= 0 ? st.donEski : yon) * w; }
    const g = anG;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; g.clearRect(0, 0, anC.width, anC.height);
    g.setTransform(k * sx, 0, 0, k, ox, oy);
    g.lineJoin = 'round'; g.lineCap = 'round';
    AN_CANTA[2] = 0;
    const kat = o.katman === 'uzak' ? 3 : o.katman === 'arka' ? 15 : o.katman === 'on' ? 16 : o.katman === 'yakin' ? 28 : 31;
    anVucut(R, tm, kat);
    // ışık: aşağı doğru hafif koyulaşma + günün rengi + kenar ışıkları
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = anGrad().deger; g.fillRect(-AN_KX, -AN_KY, AN_KW, AN_KH);
    let ton = '#ffe2b8', guc = 0.3;
    if (typeof dn12Isik === 'function') { try { const L = dn12Isik(); if (L && typeof L.ton === 'string') { ton = L.ton; guc = anSn(+L.guc || 0, 0, 1); } } catch (e) { /* ışık yoksa varsayılan */ } }
    g.globalAlpha = 0.03 + 0.08 * guc; g.fillStyle = ton; g.fillRect(-AN_KX, -AN_KY, AN_KW, AN_KH);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    const kw = kp0;   // dünya birimi başına piksel (kontur/kenar ışığı kalınlığı Feza ile aynı)
    anKenarIsik(0.72, -0.69, 1.0 * kw, '#fff3d6', 0.55 + 0.25 * guc);
    anKenarIsik(-0.25, 0.97, 0.6 * kw, '#9ccf8a', 0.22);
    // oyun tuvaline: yer gölgesi, iki katlı yumuşak kontur, anne
    const ayakta = st.aile === 'ayakta' || st.aile === 'hareket' || st.aile === 'dans' || st.aile === 'otur';
    if (o.golge !== false && ayakta && (kat & 4)) {
      const gw = (st.aile === 'otur' ? 78 : poz === 'saril' ? 58 : 40) * olcek, gx = st.aile === 'otur' ? 22 * olcek * yon : 0;
      ctx.globalAlpha = 0.55; ctx.drawImage(anGolgeSpr(), x + gx - gw / 2, y - gw / 7 + 1 * olcek, gw, gw / 3.2); ctx.globalAlpha = 1;
    }
    ctx.translate(x, y);
    const eg = Number.isFinite(o.egim) ? o.egim : 0;
    if (eg) ctx.rotate(eg);
    ctx.scale(olcek / k, olcek / k);
    const d1 = Math.max(1.2, 0.34 * kw), d2 = d1 + Math.max(1, 0.3 * kw);
    anHalka(d2, '#fff1d6'); ctx.globalAlpha = 0.3; ctx.drawImage(anH, -ox, -oy);
    anHalka(d1, '#22152a'); ctx.globalAlpha = 0.62; ctx.drawImage(anH, -ox, -oy);
    ctx.globalAlpha = 1; ctx.drawImage(anC, -ox, -oy);
    // ellerin konumu çağıranın koordinatına
    const ce = Math.cos(eg), se = Math.sin(eg);
    const ex1 = ANNE12_ELLER.onX * sx * olcek, ey1 = ANNE12_ELLER.onY * olcek, ex2 = ANNE12_ELLER.arkaX * sx * olcek, ey2 = ANNE12_ELLER.arkaY * olcek;
    ANNE12_ELLER.onX = x + ex1 * ce - ey1 * se; ANNE12_ELLER.onY = y + ex1 * se + ey1 * ce;
    ANNE12_ELLER.arkaX = x + ex2 * ce - ey2 * se; ANNE12_ELLER.arkaY = y + ex2 * se + ey2 * ce;
    ANNE12.elX = ANNE12_ELLER.onX; ANNE12.elY = ANNE12_ELLER.onY;
    if (AN_CANTA[2]) { const cx = AN_CANTA[0] * sx * olcek, cy = AN_CANTA[1] * olcek; ANNE12.cantaX = x + cx * ce - cy * se; ANNE12.cantaY = y + cx * se + cy * ce; }
    else { ANNE12.cantaX = x - 8 * olcek * yon; ANNE12.cantaY = y - 75 * olcek; }
  } catch (e) {
    if (anHataSay++ < 3 && typeof omHataBildir === 'function') { try { omHataBildir('anne12Ciz', e); } catch (_) { /* yut */ } }
  } finally {
    ctx.restore();
  }
}

// ══════════════════════ ARKADAN TAKİP ══════════════════════
const ANNE12 = {
  hazir: false, x: 0, y: 0, vx: 0, yon: 1, poz: 'dur', sahip: null,
  derin: 0, bak: 0, egil: 0, mod: 'yanas', pGap: NaN, pW: 0,
  fYon: 1, fV: 0, sonPX: NaN, durSure: 0, bekleT: 0, bakT: 4, bakU: 0, egilT: 0, yerY: 0, pirilKac: 0,
  elX: 0, elY: 0, cantaX: 0, cantaY: 0,
  kisa: { poz: '', t: 0, hx: NaN, yol: 0, var: false, opt: null },
  // kısa poz (etkinlikler anneyi devralmadan ister): anne yavaşlayıp durur, pozu yapar, sonra yine Feza'nın arkasına yetişir.
  // opt.hedefX: anne o noktaya döner (uzaksa önce yanına yürür). Binişte/devredilmişken false.
  kisaPoz(poz, sure, opt) {
    if (!this.hazir || this.sahip || !AN_POZ[poz]) return false;
    const k = this.kisa;
    k.poz = poz; k.t = anSn(Number.isFinite(sure) ? sure : 1.4, 0.3, 6); k.yol = 0; k.var = false; k.opt = opt || null;
    k.hx = opt && Number.isFinite(opt.hedefX) ? opt.hedefX : NaN;
    return true;
  },
  reset(p) {
    const px = p && Number.isFinite(p.x) ? p.x : 0, py = p && Number.isFinite(p.y) ? p.y : 0, f = p && p.f === -1 ? -1 : 1;
    this.x = px - f * 92; this.y = py; this.vx = 0; this.yon = f; this.poz = 'dur'; this.fYon = f; this.fV = 0; this.sonPX = px;
    this.derin = 0; this.bak = 0; this.egil = 0; this.durSure = 0; this.bekleT = 0; this.bakT = 4; this.bakU = 0; this.egilT = 0;
    this.mod = 'yanas'; this.sahip = null; this.kisa.t = 0;
    if (typeof COLS === 'number' && typeof T === 'number') this.x = anSn(this.x, 30, COLS * T - 30);
    AN_ST.ilk = true; AN_ST.x = NaN; AN_ST.tm = -1; AN_ST.poz = ''; AN_ST.gecis = 1;
    this.hazir = true;
  },
  devral(sahip) { this.sahip = sahip || true; this.vx = 0; this.kisa.t = 0; return true; },
  birak(sahip) {
    if (this.sahip && sahip && this.sahip !== sahip && this.sahip !== true) return;
    // sahibin son çiziminde annenin ayakta durduğu yer (bisikletten inince bisikletin solu): oradan yürür, ışınlanmaz
    if (Number.isFinite(AN_ST.kokX) && Math.abs(AN_ST.kokX - this.x) < 300) {
      // kök kayınca son pozu da aynı miktar kaydır: geçişte gövde yerinde kalır (sıçrama yok)
      if (Number.isFinite(AN_ST.x) && AN_ST.olcek > 0) {
        const k = (AN_ST.x - AN_ST.kokX) * AN_ST.yonG / AN_ST.olcek;
        AN_RS[A_HX] += k; AN_RS[A_AYX] += k; AN_RS[A_UYX] += k; AN_ST.x = AN_ST.kokX;
      }
      this.x = AN_ST.kokX;
    }
    if (Number.isFinite(AN_ST.kokY) && Math.abs(AN_ST.kokY - this.y) < 300) this.y = AN_ST.kokY;
    this.yon = AN_ST.yonG === -1 ? -1 : 1;   // sahibin son çizdiği yön korunur
    this.sahip = null; this.vx = 0; this.sonPX = NaN; this.bekleT = 0.4; this.kisa.t = 0;
  },
  adim(dt, P, yerY) {
    try {
      if (!P || !Number.isFinite(P.x) || !Number.isFinite(P.y)) return;
      if (!this.hazir) this.reset(P);
      if (this.sahip) { this.sonPX = P.x; return; }
      if (!(dt > 0)) return;
      dt = Math.min(dt, 0.05);
      const px = P.x;
      // Feza'nın gerçek hızı (biniş modülleri P.x'i doğrudan yazar, P.vx 0 olabilir)
      const dpx = Number.isFinite(this.sonPX) ? px - this.sonPX : 0; this.sonPX = px;
      if (Math.abs(dpx) > 300) { this.fV = 0; } else this.fV = anKr(this.fV, dpx / dt, 1 - Math.exp(-dt * 9));
      if (Math.abs(this.x - px) > 2400) { this.reset(P); return; }   // yalnız test/sahne atlaması
      const fv = this.fV, hareket = Math.abs(fv) > 35;
      if (hareket) { this.fYon = Math.sign(fv); this.durSure = 0; } else this.durSure += dt;
      const d = this.fYon, yan = Math.sign(this.x - px) || -d, ara = Math.abs(this.x - px);
      let hedef = this.x, ileri = 0, derinH = 0;
      if (hareket || this.durSure < 0.2) {
        if (yan === -d) {          // anne arkada: izle
          this.mod = 'takip';
          let gap = anKr(86, 118, anSn(Math.abs(fv) / 250, 0, 1));
          // Pırıl koşuda geride kalıp annenin yüzünün önüne gelirse: anne onun hemen önüne ya da gerisine kayar (yumuşak)
          let pk = 0;
          if (typeof D !== 'undefined' && D && Number.isFinite(D.x) && Number.isFinite(D.y) && D.y > this.y - 165 && D.y < this.y - 55) {
            const pb = (px - D.x) * d;   // Pırıl Feza'nın ne kadar gerisinde
            if (pb > 20 && Math.abs(pb - gap) < 40) {
              const g1 = pb - 50, g2 = pb + 58;
              this.pGap = g1 >= 58 && Math.abs(g1 - gap) <= Math.abs(g2 - gap) ? g1 : Math.min(g2, 172);
              pk = 1;
            }
          }
          this.pW = anKr(this.pW || 0, pk, 1 - Math.exp(-dt * (pk ? 2.5 : 0.8)));
          if (this.pW > 0.01 && Number.isFinite(this.pGap)) gap = anKr(gap, this.pGap, anYm(this.pW));
          hedef = px - d * gap; ileri = fv;
          if (this.derin > 0.05 && ara < 70) derinH = 1;   // Feza yeni geçti: önce biraz açılsın
        } else {                   // Feza anneye doğru geliyor: kenara çekil, bekle
          this.mod = 'kenar'; hedef = this.x; derinH = ara < 200 ? 1 : 0;
        }
      } else {                     // Feza durdu: arkasına yanaş, ona dön
        this.mod = 'yanas';
        let gap = 66;
        if (typeof D !== 'undefined' && D && Number.isFinite(D.x) && Number.isFinite(D.y) && D.y > this.y - 150) {
          const tx = px + yan * gap;
          if (Math.abs(D.x - tx) < 26) this.pirilKac = Math.min(1, this.pirilKac + dt * 2); else if (Math.abs(D.x - tx) > 40) this.pirilKac = Math.max(0, this.pirilKac - dt);
          gap += 30 * anYm(this.pirilKac);   // Pırıl omzundaysa onun gerisinde dur
        }
        hedef = px + yan * gap;
        if (ara < 50) hedef = px + yan * 62;
        derinH = ara < 36 ? 1 : 0;
      }
      // kısa poz: (gerekirse hedefin yanına yürü) dur ve pozu yap; süre bitince takip kaldığı yerden sürer
      const ks = this.kisa; let kisaPoz = '';
      if (ks.t > 0 && ara > 260) ks.t = 0;   // Feza çok uzaklaştı: poz yarıda kalsın, yetiş
      if (ks.t > 0) {
        let yakin = true;
        if (Number.isFinite(ks.hx) && ks.yol < 2.5) {
          const sy = Math.sign(this.x - ks.hx) || -this.yon, dur = ks.hx + sy * 26;
          if (Math.abs(ks.hx - this.x) > 60 || (!ks.var && Math.abs(dur - this.x) > 10 && Math.abs(ks.hx - this.x) > 40)) {
            yakin = false; ks.yol += dt; hedef = dur; ileri = 0; this.mod = 'kisa';
          } else ks.var = true;
        }
        if (yakin) { hedef = this.x; ileri = 0; this.mod = 'kenar'; if (Math.abs(this.vx) < 30) { ks.t -= dt; kisaPoz = ks.poz; } }
        derinH = 0;
      }
      // hız: hedefe yumuşak yaklaşma + Feza'nın hızı; küçük geri düzeltmeler yok
      const err = hedef - this.x;
      let vd = this.mod === 'kenar' ? 0 : ileri + anSn(err * 2.3, -280, 280);
      if (this.mod === 'yanas' && Math.abs(err) < 12) vd = 0;
      if (this.mod === 'yanas' && vd * this.yon < 0 && Math.abs(err) < 26 && ara > 48) vd = 0;   // küçük geri adım yok
      if (this.mod === 'takip' && vd * d < 0 && Math.abs(err) < 30) vd = 0;   // geri geri yürümesin
      if (this.bekleT > 0) { this.bekleT -= dt; vd *= 0.4; }
      const vmax = ara > 520 ? 420 : 360;
      vd = anSn(vd, -vmax, vmax);
      const ivme = Math.abs(vd) > Math.abs(this.vx) && vd * this.vx >= 0 ? 470 : 700;
      this.vx += anSn(vd - this.vx, -ivme * dt, ivme * dt);
      let nx = this.x + this.vx * dt;
      if (this.mod === 'takip' && (nx - px) * d > -48) { nx = px - d * 48; this.vx = Math.min(Math.abs(this.vx), Math.abs(fv)) * d; }   // asla Feza'nın önüne geçmez
      if (typeof COLS === 'number' && typeof T === 'number') nx = anSn(nx, 24, COLS * T - 24);
      this.x = nx;
      // yön: yürürken gittiği yöne, dururken Feza'ya
      if (Math.abs(this.vx) > 22) this.yon = this.vx > 0 ? 1 : -1;
      else if (kisaPoz && Number.isFinite(ks.hx) && Math.abs(ks.hx - this.x) > 4) this.yon = ks.hx > this.x ? 1 : -1;
      else if (Math.abs(this.vx) < 8 && Math.abs(px - this.x) > 10 && (this.mod !== 'takip' || this.durSure > 0.3)) this.yon = px > this.x ? 1 : -1;
      // zemin (Feza zıplasa da anne yerde)
      let z = typeof yerY === 'function' ? yerY(this.x) : P.y;
      if (!Number.isFinite(z)) z = this.y;
      this.y = Math.abs(z - this.y) > 200 ? z : anKr(this.y, z, 1 - Math.exp(-dt * 12));
      const v = Math.abs(this.vx);
      this.poz = kisaPoz || (v > 14 ? (v > 240 ? 'kos' : 'yuru') : 'dur');
      // kenara çekilme (biraz arka plana) yumuşak
      this.derin = anKr(this.derin, derinH, 1 - Math.exp(-dt * 3.2));
      // bakışlar: yürürken ara sıra Feza'ya bakıp gülümser; Feza zıplayınca bakar; dururken eğilip bakar
      this.bakT -= dt;
      if (this.bakT <= 0) { this.bakU = 1.6; this.bakT = 6 + Math.random() * 4; }
      if (this.bakU > 0) this.bakU -= dt;
      const zipla = P.ground === false && !P.ucus;
      const bakH = zipla ? -0.6 : this.bakU > 0 || (this.poz === 'dur' && this.durSure > 0.5) ? 1 : 0;
      this.bak = anKr(this.bak, bakH, 1 - Math.exp(-dt * 4));
      if (this.poz === 'dur' && this.durSure > 0.9 && ara < 110) {
        this.egilT += dt; const c = this.egilT % 8.5;
        this.egil = anKr(this.egil, c > 0.3 && c < 3.4 ? 1 : 0, 1 - Math.exp(-dt * 3));
      } else { this.egilT = 0; this.egil = anKr(this.egil, 0, 1 - Math.exp(-dt * 5)); }
    } catch (e) {
      if (anHataSay++ < 3 && typeof omHataBildir === 'function') { try { omHataBildir('ANNE12.adim', e); } catch (_) { /* yut */ } }
    }
  },
  ciz(g, tm) {
    if (!this.hazir || this.sahip) return;
    const k = 1 - 0.07 * this.derin;
    const o = AN_CIZ_O;
    o.poz = this.poz; o.yon = this.yon; o.hiz = Math.abs(this.vx) * k; o.bak = this.bak; o.egil = this.egil;
    const ko = this.kisa.t > 0 && this.poz === this.kisa.poz ? this.kisa.opt : null;
    o.u = ko && Number.isFinite(ko.u) ? ko.u : undefined; o.aci = ko && Number.isFinite(ko.aci) ? ko.aci : undefined;
    if (this.kisa.t > 0 && this.poz === this.kisa.poz) o.bak = 0;
    anne12Ciz(g, this.x, this.y - 9 * this.derin, k, tm, o);
  }
};
const AN_CIZ_O = { poz: 'dur', yon: 1, hiz: 0, bak: 0, egil: 0, u: undefined, aci: undefined };
