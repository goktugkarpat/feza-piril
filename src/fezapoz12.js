/* fezapoz12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün): Feza'nın oyun içi pozları.
   Feza'nın çizimi feza.js'in kendi çizimidir (fzDraw: aynı hacimli, sevimli karakter); bu dosya yalnız eklem açılarını,
   kalçayı, gövde eğimini, saçın/giysinin rüzgârını ve kaskı yönlendirir. Klasik script; feza.js'ten SONRA yüklenir
   (fzFy, fzSideIK, FZ_* sabitleri oradan). Her şey yalnız BOLUM_NO === 12 iken çalışır.

   ── Kullanım ──
   fezaPoz12(poz, opt) → true/false. Aynı poz zaten açıksa yalnız opt alanları güncellenir (geçiş baştan başlamaz), yani her
   karede çağırmak serbesttir (opt'u her kare aynı nesne olarak vermek en iyisi: kare başına çöp olmaz). fezaPoz12(null) → normal oyun.
   Pozlar arası (ve normal oyundan/oyuna) geçiş eklem eklem yumuşak karışır (~0.3 sn); kesme/çapraz söndürme yok.

   Tüm beden pozları (normal yürüyüş çizilmez; feza.js drawFeza P.ucus doluyken de bunları çizer):
     'scooter'  { it, hiz, egim, kask, salla }   it: itme fazı 0..1 (0 = iki ayak tablada süzülür; 0–.25 arka ayak öne-aşağı iner,
                .25 yere değer (itYer[0]), .25–.65 yerde itYer[0]→itYer[1] (ayak kaymasın diye hızı sahibi eşitler), .65–1 tablaya döner).
                Yakın (kameraya dönük) bacak iter, uzak bacak tablada. hiz 0..1 (rüzgâr, öne eğilme), egim radyan (+ öne).
     'bisiklet' { krank, hiz, egim, kask, salla } krank radyan: yakın ayak = pedal + krank·(cos k, sin k) (ekranda y aşağı; k artınca
                ileri), uzak ayak k+π. Selede oturur, dizler pedala göre IK ile doğru açıda, bilekler doğal oynar; eller gidonda.
     'binis_in' { u, arac:'scooter'|'bisiklet'|'kayik', kask, krank } u 0: kökende normal ayakta (normal duruşla aynı) … 1: sürüş
                pozu. İniş aynı pozun u 1→0'ı; u=0'da fezaPoz12(null) + P.ucus = null → P.x sıçramaz, görüntü de sıçramaz.
                Kayıkta P'yi (iskeleden kayık tabanına zıplama yayı) GOLET taşır; poz: adım → çömelip oturma → yerleşme.
     'kayik'    { kurek, aci, el, salla }  kayıkta oturur (P.x,P.y = Feza'nın kalçasının altındaki kayık TABANI; oturak FEZA12_ARAC.kayik).
                kurek: kürek fazı 0..1 (0–.55 çekiş: eller göğse, gövde geriye; .55–1 eller öne). Verilmezse elleri dizinde, keyifle bakar.
                aci: kayığın yalpası (radyan, taban noktası çevresinde). el: [x,y] kürek sapı (P'ye göre dünya birimi; verilmezse kendi yolu).
                bak -1 (geriye, ördeklere) … 1, sevinc 0..1 (iki kol hafif kalkar), salla 0..1 (el sallar).
     'otur'     { u, bak, sallan, salla, sevinc }  piknik örtüsünde bağdaş (P = popo altındaki yer noktası). u 0..1 (verilirse): ayaktan
                çömelip oturma geçişi (1 = oturmuş). bak -1..1 bakış, sallan 0..1 müzikle hafif salınma.
     'saril'    { u, hedef }  anneye sarılma: u 0–.35 kollar açık "gel!", .35–.6 uzanıp sarar, .6–1 sımsıkı sarılı (sıkar, sallanır, gözler ^ ^).
                hedef: [x,y] ellerin buluşacağı yer (P'ye göre dünya birimi, yon'a göre ileri +x; vars. [25,-40] = annenin beli/göğsü; daha yukarısı Feza'nın kısa kollarıyla yüzünü örter).
                otur: true → örtüde bağdaş otururken yanındaki anneye dönüp sarılır (vars. hedef [20,-17]). Yön değişince (yon) kısa çapraz geçiş.
                u < .35 iken Feza yürüyor/koşuyorsa (|P.vx| > 25) normal koşu bacakları sürer, yalnız kollar açılır ("kollar açık koşar").
   Üst pozlar (normal yürüyüş/koşu/zıplama sürer; yalnız kollar):
     'ucurtma'  { yonX, yonY, cek }  yakın kol yukarı-geri kalkar (uçurtma arkada), yumrukla ipi tutar. yonX/yonY: elden uçurtmaya birim vektör
                (dünya), cek 0..1 ip gerginliği. Elin dünya konumu: P.a_ipX, P.a_ipY (her fezaUpdate'te) ve FEZA12.ip.
     'el_salla' {}  yakın kol havada, açık elle sallar (yürürken de).
   Ortak opt: yon ±1 (vars. araçlarda +1, diğerlerinde P.f), sure (sn; sonra kendiliğinden kapanır), ox/oy (çizim kayması, dünya).
   Araç pozları (scooter, bisiklet, binis_in, kayik) 1 sn çağrılmazsa ve P.ucus boşsa kendiliğinden kapanır (unutulursa Feza takılmasın).
   Dışa: FEZA12 = { poz, el:{x,y} yakın el, el2:{x,y} uzak el, ip:{x,y}, kask 0..1 } (dünya konumları, her çizimde).

   ── Araç ölçüleri ve P.y kararı (YOLCULUK ile kararlaştırıldı: b12/istek/FEZA12_to_YOLCULUK_cevap.md) ──
   Binişte P.x, P.y = aracın yere değdiği orta nokta; P.y YERDE kalır (araç yüksekliği kadar kalkmaz). Feza'yı bu dosya kalça ve ayak
   hedefleriyle aracın üstüne yerleştirir. Aşağıdaki noktalar dünya birimi, P'ye göre, +x ileri (Feza sağa bakar), -y yukarı.
   YOLCULUK aracı bu noktalardan çizer (typeof FEZA12_ARAC ile okur): değerler değişirse araç da uyar. Kayık noktaları GOLET içindir. */
'use strict';

const FEZA12_ARAC = {
  scooter: { ayak: [-3, -4],      // tablada duran (uzak) ayağın tabanı = tabla üstü (alçak tabla: itme ayağı yere yetişsin)
             gidon: [19, -37],    // T-gidon tutma yeri (göbek hizası; Feza başı büyük, omzu ~-44)
             itYer: [5, -10] },   // itme ayağının yerdeki yolu: x +5 → -10 (y = 0)
  bisiklet: { sele: [-8, -24],    // sele üstü (popo buraya oturur; kalça 4.5 birim yukarıda)
              gidon: [15, -38],   // tutma yeri (göğsün altı)
              pedal: [-1, -10],   // krank merkezi
              krank: 5 },         // krank kolu boyu
  kayik: { oturak: [0, -13],      // oturak üstü (P = kayık tabanı)
           ayak: [12, 0],         // ayakların bastığı yer (taban)
           binisIn: true },       // binis_in {arac:'kayik'} var (GOLET)
  kask: true                      // kaskı Feza'nın başına bu dosya çizer (YOLCULUK park hâlinde gidona asar)
};
const FEZA12 = { poz: null, el: { x: 0, y: 0 }, el2: { x: 0, y: 0 }, ip: { x: 0, y: 0 }, kask: 0 };

const FZ12_TAM = { scooter: 1, bisiklet: 1, binis_in: 1, kayik: 1, otur: 1, saril: 1 };   // fezaCizPoz ile tüm beden
const FZ12_UST = { ucurtma: 1, el_salla: 1 };                                           // normal pozun üstüne yalnız kol
const FZ12_ARACP = { scooter: 1, bisiklet: 1, binis_in: 1, kayik: 1 };                 // her karede tazelenmesi beklenenler
const FZ12_KAR_SURE = 0.3;      // pozlar arası eklem karışımı (sn)
const FZ12_UST_SURE = 0.35;     // üst kol pozunun kalkışı/inişi (sn)
const FZ12_KASK = '#7cc8ee';
const FZ12_IP_YAKIN = true;   // uçurtma ipini yakın kol tutar (uzak kol büyük saçın arkasında kayboluyordu)
const FZ12 = {
  poz: null, src: null, t: 0, tazele: 0, sure: 0, yon: 1, ox: 0, oy: 0,
  cizPoz: null, kar: 1,          // son çizilen tüm beden pozu, karışımın ilerleyişi (0 eski … 1 yeni)
  ustPoz: null, ustW: 0,         // üst kol pozu ve ağırlığı
  ipA: -1.9, ipAs: -1.9,         // uçurtma kolunun açısı (sarılmış, yumuşatılmış)
  kaskRenk: FZ12_KASK, gAn: 1
};
const FZ12_OPT = { isik: 0 };    // drawFeza'dan fezaCizPoz'a: ışığı drawFeza verir; seçenekler FZ12.src'den okunur
const FZ12_DON = { front: false, rotA: 0 };
const FZ12_NS = FZ_N + 6;        // anlık görüntü: eklemler + kalça + saç x/y + etek + iki ayakkabı açısı
const FZ12_SON = new Float64Array(FZ12_NS), FZ12_ESK = new Float64Array(FZ12_NS), FZ12_TMP = new Float64Array(FZ12_NS);
const FZ12_I_BOB = FZ_KEYS.indexOf('bob');
const FZ12_AYAK = [0, 0];        // fzLeg'e: [yakın, uzak] ayakkabı açısı (+ = parmak ucu aşağı)
const FZ12_B = [0, 0], FZ12_KA = [0, 0, 1], FZ12_KB = [0, 0, 1], FZ12_P = [0, 0];

// poz hedefi: kalça, eğim, ayak temas noktaları (yerel birim; taban çerçevesi, y=0 = P.y), el hedefleri ya da kol açıları
function fz12Hedef() {
  return { hx: 0, hy: -17.7, lean: 0.03, head: 0,
    bA: false, n1: 0, n2: 0, f1: 0, f2: 0,                                     // bA: bacaklar doğrudan açıyla (bağdaş)
    nX: 2.5, nY: 0, nR: 0, nU: 0, fX: -0.6, fY: 0, fR: 0, fU: 0,               // temas noktası, ayakkabı açısı, 0 top … 1 parmak ucu
    elW: 0, nTx: 0, nTy: 0, fTx: 0, fTy: 0,                                    // el hedefleri ve ağırlığı (0: aşağıdaki açılar)
    kn1: 0.12, kn2: 0.35, kf1: -0.1, kf2: 0.3 };
}
const FZ12_H = fz12Hedef(), FZ12_HS = fz12Hedef(), FZ12_HR = fz12Hedef();

function fz12Wrap(a) { while (a > Math.PI) a -= 6.2832; while (a < -Math.PI) a += 6.2832; return a; }
function fz12Yaklas(v, h, d) { return v < h ? Math.min(h, v + d) : Math.max(h, v - d); }
function fz12E(u, a, b) { return smooth(clamp((u - a) / (b - a), 0, 1)); }   // u'nun [a,b] aralığındaki yumuşak ilerleyişi
function fz12Geri(v) { if (!(v < 1)) return 1; if (!(v > 0)) return 0; const w = v - 1; return 1 + 2.70158 * w * w * w + 1.70158 * w * w; }   // geri esneyen "pıt"

// ── dış arayüz ──
function fezaPoz12(poz, opt) {
  if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12) return false;
  if (!poz) { fz12Bitir(); return true; }
  if (!FZ12_TAM[poz] && !FZ12_UST[poz]) return false;
  const o = opt && typeof opt === 'object' ? opt : FZ_BOS;
  const yeni = poz !== FZ12.poz;
  FZ12.src = o; FZ12.tazele = 0;
  if (yeni) { FZ12.poz = poz; FZ12.t = 0; FZ12.yon = FZ12_ARACP[poz] ? 1 : (P.f < 0 ? -1 : 1); }
  if (o.yon === 1 || o.yon === -1) FZ12.yon = o.yon;
  FZ12.sure = isFinite(o.sure) && o.sure > 0 ? +o.sure : 0;
  FZ12.ox = isFinite(o.ox) ? +o.ox : 0; FZ12.oy = isFinite(o.oy) ? +o.oy : 0;
  if (typeof o.kask === 'string' && o.kask) FZ12.kaskRenk = o.kask;
  FEZA12.poz = poz;
  return true;
}
function fz12Bitir() { FZ12.poz = null; FZ12.src = null; FZ12.sure = 0; FZ12.ox = FZ12.oy = 0; FEZA12.poz = null; }
// drawFeza'nın soracağı: şu an tüm beden pozu mu (adı) yoksa normal çizim mi (null)
function fz12Tam() {
  const p = FZ12.poz;
  if (!p || !FZ12_TAM[p]) return null;
  if (p === 'saril' && fz12SarilKos()) return null;   // kollar açık koşarken: normal koşu + üst kol
  return p;
}
function fz12SarilKos() { const o = FZ12.src || FZ_BOS, u = isFinite(o.u) ? +o.u : 0; return u < 0.35 && Math.abs(P.vx || 0) > 25 && !P.ucus; }
function fz12GecisAnahtar(p12) {   // drawFeza çapraz geçişi için: yalnız tüm beden pozunda yön değişince değişir
  if (p12) FZ12.gAn = FZ12.yon;
  return FZ12.gAn;
}
function fz12Golgesiz() { const p = FZ12.cizPoz; return p === 'kayik'; }   // kayıkta Feza'nın yer gölgesi yok (su)

// drawFeza (feza.js) → her karede: fzX tuvalinde Feza'yı (0,0) = P noktasına bu pozla çizer
function fz12Ciz(x, tm) {
  const p = fz12Tam();
  if (p !== FZ12.cizPoz) {   // poz değişti: son görünen eklemler yeni poza karışarak geçsin
    if (!FZ12.cizPoz) fz12SonNormal();
    FZ12_ESK.set(FZ12_SON); FZ12.kar = 0; FZ12.cizPoz = p;
  }
  fezaCizPoz(x, 0, 0, FZ12.yon, p, P.a_t, null, FZ12_OPT);
}
function fz12SonNormal() {   // normal oyundaki son görüntü (fezaUpdate bu karede zaten çalıştı)
  const R = P.a_R; if (!R) return;
  fzPack(R, FZ12_SON);
  FZ12_SON[FZ_N] = P.a_hipY; FZ12_SON[FZ_N + 1] = P.a_hx || 0; FZ12_SON[FZ_N + 2] = P.a_hy || 0; FZ12_SON[FZ_N + 3] = P.a_cl || 0;
  FZ12_SON[FZ_N + 4] = 0; FZ12_SON[FZ_N + 5] = 0;
}

// fezaUpdate (feza.js) → her karede, yaylardan sonra: saatler, kendiliğinden kapanma, tüm beden pozundan çıkış, üst kol pozu
function fz12Kol(R, dt, t) {
  FZ12.t += dt; FZ12.tazele += dt;
  FZ12.kar = Math.min(1, FZ12.kar + dt / FZ12_KAR_SURE);
  if (FZ12.poz) {
    if (FZ12.sure > 0 && FZ12.t >= FZ12.sure) fz12Bitir();
    else if (FZ12_ARACP[FZ12.poz] && !P.ucus && FZ12.tazele > 1.0) fz12Bitir();
  }
  const tam = fz12Tam();
  if (!tam && FZ12.cizPoz) { fz12Devret(R); FZ12.cizPoz = null; }
  // üst kol pozu (uçurtma / el sallama / kollar açık koşu)
  const up = FZ12.poz && (FZ12_UST[FZ12.poz] || (FZ12.poz === 'saril' && !tam)) ? FZ12.poz : null;
  if (up) FZ12.ustPoz = up;
  FZ12.ustW = fz12Yaklas(FZ12.ustW, up ? 1 : 0, dt / FZ12_UST_SURE);
  const w = smooth(FZ12.ustW);
  if (w > 0.001 && FZ12.ustPoz && !tam) fz12UstKol(R, w, t, dt, FZ12.ustPoz);
  else if (w <= 0.001) FZ12.ustPoz = null;
  // uçurtma ipini tutan elin dünya konumu
  const hip = lerp(-Math.max(fzFy(R.lt1, R.lt2), fzFy(R.bt1, R.bt2)), FZ_AIRHIP, R.air) + R.bob, sd = P.a_side || 1;
  fz12ElYeri(R, hip, FZ12_IP_YAKIN, FZ12_P);
  P.a_ipX = (P.rx ?? P.x) + (P.a_ox || 0) + sd * FZ_SC * R.sx * FZ12_P[0];
  P.a_ipY = (P.ry ?? P.y) + (P.a_oy || 0) + (P.a_lf || 0) + FZ_SC * R.sy * FZ12_P[1];
  FEZA12.ip.x = P.a_ipX; FEZA12.ip.y = P.a_ipY;
}
// tüm beden pozu bitti: oyunun yayları son görünen eklemlerden devam etsin (Feza aynı yerden yumuşakça normale döner)
function fz12Devret(R) {
  const cur = P.a_pose, V = P.a_pv; if (!cur || !V) return;
  for (let i = 0; i < FZ_N; i++) { cur[i] = FZ12_SON[i]; V[i] = 0; }
  fzUnpack(cur, R);
  P.a_hx = FZ12_SON[FZ_N + 1]; P.a_hy = FZ12_SON[FZ_N + 2]; P.a_hvx = P.a_hvy = 0; P.a_cl = FZ12_SON[FZ_N + 3];
  const y = FZ12.yon; P.f = y; P.a_side = y; P.a_face = y; P.a_turnU = 1; P.a_turnTo = y; P.a_fu = 0;
}

// ── üst kol pozları (normal çizim; R = P.a_R, yaylardan sonra) ──
function fz12UstKol(R, w, t, dt, poz) {
  const o = FZ12.src || FZ_BOS;
  if (poz === 'ucurtma') {   // uzak kol yukarı-geri, ipi tutar
    const sd = P.a_side || 1, cek = clamp(+o.cek || 0, 0, 1);
    let dx = isFinite(o.yonX) ? o.yonX * sd : -0.7, dy = isFinite(o.yonY) ? +o.yonY : -0.72;
    const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    let a = Math.atan2(dx, dy);   // aşağıdan ölçülen; geri-yukarı ≈ -2.4
    a = a > 0 ? clamp(a, 1.9, 2.45) : clamp(a, -2.3, -1.3);   // hep yukarıda kalsın; kafanın üstünden/yüzün önünden geçmesin
    a = FZ12.ipA + fz12Wrap(a - FZ12.ipA); FZ12.ipA = a;      // ±π geçişinde sıçramasın
    FZ12.ipAs += (a - FZ12.ipAs) * (1 - Math.exp(-dt * 9));
    const cekis = Math.sin(t * 6.3) * 0.05 * (0.4 + cek);    // uçurtma rüzgârda hafif çekiştirir
    if (FZ12_IP_YAKIN) { R.la1 = lerp(R.la1, FZ12.ipAs - R.lean + cekis, w); R.la2 = lerp(R.la2, 0.28 - 0.18 * cek + cekis * 0.6, w); }
    else { R.ba1 = lerp(R.ba1, FZ12.ipAs - R.lean + cekis, w); R.ba2 = lerp(R.ba2, 0.28 - 0.18 * cek + cekis * 0.6, w); }
    R.arm = lerp(R.arm, 1.04 + 0.08 * cek, w);
    if (cek > 0.05) { const k = w * cek; R.gy = lerp(R.gy, -0.6, k); R.mOpen = Math.max(R.mOpen, 0.55 * k); R.brow = lerp(R.brow, 0.6, k); R.mSmile = lerp(R.mSmile, 1, k); }
  } else if (poz === 'el_salla') {   // yakın kol havada, açık el sallanır
    R.la1 = lerp(R.la1, 1.42 + 0.05 * Math.sin(t * 3.1) - R.lean * 0.5, w); R.la2 = lerp(R.la2, 0.88 + 0.32 * Math.sin(t * 10.5), w);   // kol öne, ön kol yukarıda bilekten sallanır
    R.hOpen = lerp(R.hOpen, 1, w); R.arm = lerp(R.arm, 1.08, w);
    R.mSmile = lerp(R.mSmile, 1, w); R.mOpen = Math.max(R.mOpen, 0.45 * w); R.brow = lerp(R.brow, 0.4, w); R.head -= 0.06 * w;
    if (w > 0.5 && (t % 2.4) < 1.0) R.happy = 1;
    if (w > 0.5) P.a_kenar = true;   // el yüzün önünden geçerken ince ten kenarı
  } else if (poz === 'saril') {   // kollar açık koşar: "anneciğim!"
    const wv = Math.sin(t * 9);
    R.la1 = lerp(R.la1, 1.6 + 0.08 * wv, w); R.la2 = lerp(R.la2, 0.25, w);
    R.ba1 = lerp(R.ba1, 1.95 - 0.08 * wv, w); R.ba2 = lerp(R.ba2, 0.3, w);
    R.hOpen = lerp(R.hOpen, 1, w); R.arm = lerp(R.arm, 1.1, w);
    R.mSmile = lerp(R.mSmile, 1, w); R.mOpen = Math.max(R.mOpen, 0.7 * w); R.brow = lerp(R.brow, 0.5, w);
    if (w > 0.5) { R.happy = 1; P.a_kenar = true; }
  }
}

// ── yardımcılar (yerel birim, taban çerçevesi) ──
function fz12Ayak(cx, cy, rot, uc, out) {   // temas noktası (top ya da parmak ucu) → bilek
  const ox = lerp(1.7, 3.9, uc), oy = lerp(2.1, 1.4, uc), c = Math.cos(rot), s = Math.sin(rot);
  out[0] = cx - (ox * c - oy * s); out[1] = cy - (ox * s + oy * c);
}
function fz12Bacak(rx, ry, cx, cy, rot, uc, out) {   // iki kemikli bacak IK (diz önde): out = [uyluk açısı, diz bükülmesi]
  fz12Ayak(cx, cy, rot, uc, FZ12_P);
  const L1 = FZ_TH, L2 = FZ_SH, dx = FZ12_P[0] - rx, dy = FZ12_P[1] - ry, d0 = Math.hypot(dx, dy) || 0.01, d = clamp(d0, 1.0, L1 + L2 - 0.03);
  const a0 = Math.atan2(dx, dy), ac = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), a1 = a0 + ac;
  const kx = rx + Math.sin(a1) * L1, ky = ry + Math.cos(a1) * L1, ex = rx + dx / d0 * d, ey = ry + dy / d0 * d;
  out[0] = a1; out[1] = fz12Wrap(Math.atan2(ex - kx, ey - ky) - a1);
  return d0 / (L1 + L2);
}
function fz12Uzan(rx, cx, cy, rot, uc) {   // ayak bu temas noktasına yetişsin diye kalçanın en yüksek yeri (y; daha büyük = daha alçak)
  fz12Ayak(cx, cy, rot, uc, FZ12_P);
  const Rm = 0.975 * (FZ_TH + FZ_SH), dx = FZ12_P[0] - rx;
  return Math.abs(dx) >= Rm ? FZ12_P[1] : FZ12_P[1] - Math.sqrt(Rm * Rm - dx * dx);
}
function fz12KolIK(R, hx, hip, lean, tx, ty, yakin, al, out) {   // el hedefi → kol açıları (eğik gövde çerçevesinde)
  const by = -0.28 * R.breath - R.shr, sx = yakin ? 1.2 : -0.8, sy = yakin ? -11.4 + by : -11.8 + by * 0.6;
  const c = Math.cos(-lean), s = Math.sin(-lean), dx = tx - hx, dy = ty - hip;
  fzSideIK(sx, sy, dx * c - dy * s, dx * s + dy * c, al, FZ_IKO);
  out[0] = FZ_IKO[0]; out[1] = FZ_IKO[1]; out[2] = FZ_IKO[2];
}
function fz12ElYeri(R, hip, yakin, out) {   // avucun taban çerçevesindeki yeri (fzDraw ile aynı zincir)
  const by = -0.28 * R.breath - R.shr, sx = yakin ? 1.2 : -0.8, sy = yakin ? -11.4 + by : -11.8 + by * 0.6;
  const a1 = yakin ? R.la1 : R.ba1, a2 = yakin ? R.la2 : R.ba2, L1 = FZ_UA * R.arm, L2 = FZ_FA * R.arm + 1.2;
  const ex = sx + Math.sin(a1) * L1 + Math.sin(a1 + a2) * L2, ey = sy + Math.cos(a1) * L1 + Math.cos(a1 + a2) * L2;
  const c = Math.cos(R.lean), s = Math.sin(R.lean);
  out[0] = R.hx + ex * c - ey * s; out[1] = hip + ex * s + ey * c;
}
// hedefi R'ye uygula: bacaklar (IK ya da açı), kollar (el hedefi ile dinlenme açıları arası), kalça (R.bob ile)
function fz12Uygula(H, R, Q) {
  R.hx = H.hx; R.lean = H.lean; R.head = H.head;
  if (H.bA) { R.lt1 = H.n1; R.lt2 = H.n2; R.bt1 = H.f1; R.bt2 = H.f2; }
  else {
    fz12Bacak(H.hx + 0.8, H.hy, H.nX, H.nY, H.nR, H.nU, FZ12_B); R.lt1 = FZ12_B[0]; R.lt2 = FZ12_B[1];
    fz12Bacak(H.hx - 1.2, H.hy, H.fX, H.fY, H.fR, H.fU, FZ12_B); R.bt1 = FZ12_B[0]; R.bt2 = FZ12_B[1];
  }
  FZ12_AYAK[0] = H.nR; FZ12_AYAK[1] = H.fR; Q.a_ayak12 = FZ12_AYAK;
  if (H.elW > 0.001) {   // iki el aynı kol boyuyla (R.arm ortak): gerekirse kollar çizgi film gibi biraz uzar
    let al = 1;
    for (let k = 0; k < 6; k++) {
      fz12KolIK(R, H.hx, H.hy, H.lean, H.nTx, H.nTy, true, al, FZ12_KA);
      fz12KolIK(R, H.hx, H.hy, H.lean, H.fTx, H.fTy, false, al, FZ12_KB);
      if (Math.max(FZ12_KA[2], FZ12_KB[2]) <= 0.97 || al >= 1.24) break;
      al += 0.05;
    }
    const w = H.elW;
    R.la1 = lerp(H.kn1, FZ12_KA[0], w); R.la2 = lerp(H.kn2, FZ12_KA[1], w);
    R.ba1 = lerp(H.kf1, FZ12_KB[0], w); R.ba2 = lerp(H.kf2, FZ12_KB[1], w); R.arm = lerp(1, al, w);
  } else { R.la1 = H.kn1; R.la2 = H.kn2; R.ba1 = H.kf1; R.ba2 = H.kf2; R.arm = 1; }
  R.bob = H.hy + Math.max(fzFy(R.lt1, R.lt2), fzFy(R.bt1, R.bt2));
}
function fz12Ruzgar(Q, hz, tm) {   // saç ve gömlek eteği rüzgârda (hiz 0..1)
  fzSwF = 1.7 + 7.8 * hz; fzSwA = 1 + 3.6 * hz;
  Q.a_hx = -(0.6 + 3.6 * hz) + 0.5 * Math.sin(tm * 8.3) * hz;
  Q.a_hy = -0.4 * hz + 0.4 * Math.sin(tm * 6.1) * hz;
  Q.a_cl = -(0.3 + 1.6 * hz) + (0.45 * Math.sin(tm * 13.7) + 0.25 * Math.sin(tm * 21.3)) * hz;
}
function fz12Salla(R, Q, s, tm) {   // sürerken yakın el gidonu bırakıp el sallar (s 0..1)
  if (!(s > 0.001)) return;
  R.la1 = lerp(R.la1, 1.45 + 0.05 * Math.sin(tm * 3.2) - R.lean * 0.5, s); R.la2 = lerp(R.la2, 0.68 + 0.3 * Math.sin(tm * 10.5), s);   // kol öne, ön kol yukarı, el çenenin önünde sallanır (Feza'nın kolu kısa, başı büyük: daha yukarıda el yüzü örter)
  R.hOpen = s; R.mOpen = Math.max(R.mOpen, 0.5 * s); R.brow = lerp(R.brow, 0.45, s); R.gx = lerp(R.gx, 0.5, s);
  if (s > 0.5) { Q.a_kenar = true; if ((tm % 2.6) < 1.1) R.happy = 1; }
}

function fz12Sevinc(R, s, tm) {   // balık zıplayınca / sevinçle iki kol hafif kalkar (s 0..1)
  if (!(s > 0.001)) return;
  const wv = Math.sin(tm * 9) * 0.08;
  R.la1 = lerp(R.la1, 1.45 + wv, s); R.la2 = lerp(R.la2, 0.55, s); R.ba1 = lerp(R.ba1, 1.3 - wv, s); R.ba2 = lerp(R.ba2, 0.6, s);   // eller göğüs önünde açık, titrer (yukarıda yüzü örterdi)
  R.hOpen = Math.max(R.hOpen, s); R.mOpen = Math.max(R.mOpen, 0.75 * s); R.brow = lerp(R.brow, 0.55, s); if (s > 0.5) R.happy = 1;
}
function fz12Bak(R, b) {   // bakış -1 (geriye) … 1 (ileri); baş hafif döner
  if (!isFinite(b) || b === 0) return;
  b = clamp(b, -1, 1); R.gx = lerp(R.gx, b, Math.abs(b)); R.head += 0.06 * b;
}

// ── poz hedefleri ──
function fz12Dur(H, tm) {   // normal duruş (feza.js FZ_REST ile aynı): binişin başı/inişin sonu
  const b = Math.sin(tm * 2.2);
  H.bA = false; H.hx = 0; H.hy = -Math.max(fzFy(0.04, -0.08), fzFy(-0.04, -0.06)); H.lean = 0.03; H.head = 0;
  H.nX = 2.52; H.nY = 0; H.nR = 0; H.nU = 0; H.fX = -0.58; H.fY = 0; H.fR = 0; H.fU = 0;
  H.elW = 0; H.kn1 = 0.12 + 0.04 * b; H.kn2 = 0.35; H.kf1 = -0.1 + 0.03 * b; H.kf2 = 0.3;
}
function fz12Scooter(H, o, tm, R) {
  const A = FEZA12_ARAC.scooter, k = 1 / FZ_SC, dX = A.ayak[0] * k, dY = A.ayak[1] * k, i0 = A.itYer[0] * k, i1 = A.itYer[1] * k;
  const hz = clamp(+o.hiz || 0, 0, 1), eg = clamp(+o.egim || 0, -0.3, 0.4);
  const ph = isFinite(o.it) ? ((+o.it % 1) + 1) % 1 : 0;
  const gbX = dX - 4.0;   // süzülürken yakın ayak tablada, uzak ayağın arkasında
  let nx = gbX, ny = dY, nr = 0, nu = 0, gay = 0;   // gay: itiş gayreti (0..1)
  if (ph > 0 && ph < 0.25) {          // tabladan kalkar, öne-aşağı uzanır (parmak ucu hafif aşağı), düz tabanla yere değer
    const u = ph / 0.25, s = smooth(u), m = 1 - s;
    const cx = lerp(gbX, i0, 0.45), cy = dY - 3.6;   // ikinci dereceden eğri: tabladan yukarı, öne, yere
    nx = m * m * gbX + 2 * m * s * cx + s * s * i0; ny = m * m * dY + 2 * m * s * cy + s * s * 0;
    nr = 0.32 * Math.sin(u * Math.PI) - 0.06 * smooth(clamp((u - 0.7) / 0.3, 0, 1)) * (1 - u) * 4; gay = 0.3 * s;
  } else if (ph >= 0.25 && ph < 0.65) {   // yerde: ayak yere basılı geriye gider; sonda topuk kalkar, parmak ucuyla iter
    const u = (ph - 0.25) / 0.4, pu = smooth(clamp((u - 0.55) / 0.45, 0, 1));
    nx = lerp(i0, i1, u); ny = 0; nr = 0.78 * pu; nu = pu; gay = 0.3 + 0.7 * Math.sin(Math.min(1, u * 1.15) * Math.PI * 0.5 + 0.3);
  } else if (ph >= 0.65) {            // yaylanarak geri gelir: diz bükülür, ayak tablaya konar
    const u = (ph - 0.65) / 0.35, s = smooth(u), m = 1 - s;
    const cx = i1 + 1.2, cy = -5.6;
    nx = m * m * i1 + 2 * m * s * cx + s * s * gbX; ny = m * m * 0 + 2 * m * s * cy + s * s * dY;
    nr = lerp(0.78, 0, smooth(clamp(u / 0.6, 0, 1))) + 0.25 * Math.sin(u * Math.PI) * (1 - s); nu = 1 - smooth(clamp(u / 0.5, 0, 1)); gay = 0.4 * (1 - s);
  }
  H.bA = false;
  H.fX = dX + 1.0; H.fY = dY; H.fR = 0; H.fU = 0;
  H.nX = nx; H.nY = ny; H.nR = nr; H.nU = nu;
  H.hx = dX + 1.1 + 0.6 * hz - 0.7 * gay;
  // kalça: süzülürken uzak bacak neredeyse düz; iterken yer ayağına yetişecek kadar çöker (uzak diz bükülür)
  let hy = dY - FZ_FT - 0.955 * (FZ_TH + FZ_SH) + 0.12 * Math.sin(tm * 2.2);
  hy = Math.max(hy, fz12Uzan(H.hx + 0.8, nx, ny, nr, nu) + 0.15) + 0.5 * gay;
  H.hy = hy;
  H.lean = 0.22 + 0.12 * hz + eg + 0.06 * gay + 0.015 * Math.sin(tm * 2.1);
  H.head = -(H.lean - 0.08) * 0.8 + 0.03 * Math.sin(tm * 3.1);
  H.elW = 1; H.nTx = A.gidon[0] * k; H.nTy = A.gidon[1] * k; H.fTx = H.nTx - 0.7; H.fTy = H.nTy + 0.4;
  H.kn1 = 0.12; H.kn2 = 0.35; H.kf1 = -0.1; H.kf2 = 0.3;
  // yüz: keyifli, hızlanınca ağız açılır ("yihuu"), arada ^ ^
  R.mSmile = 1; R.mOpen = 0.22 + 0.45 * hz + 0.15 * gay; R.brow = 0.25 + 0.25 * hz; R.gx = 0.9; R.gy = -0.05; R.lid = 1.04;
  R.happy = hz > 0.55 && ((tm + 0.4) % 3.2) < 1.0 ? 1 : 0;
  return hz;
}
function fz12Bisiklet(H, o, tm, R) {
  const A = FEZA12_ARAC.bisiklet, k = 1 / FZ_SC, kr = isFinite(o.krank) ? +o.krank : 0;
  const hz = clamp(+o.hiz || 0, 0, 1), eg = clamp(+o.egim || 0, -0.3, 0.4);
  const cx = A.pedal[0] * k, cy = A.pedal[1] * k, r = A.krank * k;
  const efor = Math.abs(Math.sin(kr));   // pedala basarken (önde/arkada) gövde hafifçe oynar
  H.bA = false;
  H.hx = A.sele[0] * k + 0.25; H.hy = A.sele[1] * k - 3.2 - 0.1 * efor;
  // pedallar: tabanın topu pedalın üstünde; bilek arkada parmak ucu aşağı, önde düz
  const nk = kr, fk = kr + Math.PI;
  H.nX = cx + r * Math.cos(nk); H.nY = cy + r * Math.sin(nk) - 0.45; H.nR = 0.22 + 0.2 * Math.sin(nk - 0.785); H.nU = 0;
  H.fX = cx + r * Math.cos(fk); H.fY = cy + r * Math.sin(fk) - 0.45; H.fR = 0.22 + 0.2 * Math.sin(fk - 0.785); H.fU = 0;
  H.lean = 0.3 + 0.06 * hz + eg + 0.018 * Math.sin(kr * 2) + 0.01 * Math.sin(tm * 2.1);
  H.head = -(H.lean - 0.12) * 0.8 + 0.025 * Math.sin(tm * 3.1);
  H.elW = 1; H.nTx = A.gidon[0] * k; H.nTy = A.gidon[1] * k; H.fTx = H.nTx - 0.7; H.fTy = H.nTy + 0.3;
  H.kn1 = 0.12; H.kn2 = 0.35; H.kf1 = -0.1; H.kf2 = 0.3;
  R.mSmile = 1; R.mOpen = 0.25 + 0.4 * hz; R.brow = 0.25 + 0.25 * hz; R.gx = 0.9; R.gy = 0; R.lid = 1.04;
  R.happy = hz > 0.55 && ((tm + 1.3) % 3.4) < 1.0 ? 1 : 0;
  return hz;
}
function fz12Binis(H, o, tm, R) {   // biniş/iniş: normal duruştan sürüş pozuna adım adım (iniş = u geri)
  const u = clamp(isFinite(o.u) ? +o.u : 0, 0, 1), bis = o.arac === 'bisiklet', kay = o.arac === 'kayik';
  const S = FZ12_HS, D = FZ12_HR;
  fz12Dur(S, tm);
  const hz = bis ? fz12Bisiklet(D, o, tm, R) : kay ? fz12Kayik(D, FZ_BOS, tm, R) : fz12Scooter(D, FZ_BOS, tm, R);
  H.bA = false;
  if (kay) {    // kayık (GOLET P'yi iskeleden kayığa taşır): 0–.4 yakın ayak öne adım · .4–.8 çömelip oturur · .8–1 yerleşir
    const wN = fz12E(u, 0.05, 0.4), wF = fz12E(u, 0.35, 0.72), wS = fz12E(u, 0.4, 0.8), wH = fz12E(u, 0.45, 0.9);
    H.nX = lerp(S.nX, D.nX, wN); H.nY = -2.4 * Math.sin(Math.PI * wN); H.nR = 0.25 * Math.sin(Math.PI * wN); H.nU = 0;
    H.fX = lerp(S.fX, D.fX, wF); H.fY = -1.8 * Math.sin(Math.PI * wF); H.fR = 0.2 * Math.sin(Math.PI * wF); H.fU = 0;
    H.hx = lerp(S.hx, D.hx, wS) + 1.2 * Math.sin(Math.PI * wN);
    let hy = lerp(S.hy, D.hy, wS);
    hy = Math.max(hy, fz12Uzan(H.hx + 0.8, H.nX, H.nY, H.nR, 0) + 0.1, fz12Uzan(H.hx - 1.2, H.fX, H.fY, H.fR, 0) + 0.1);
    H.hy = hy + 0.5 * Math.sin(Math.PI * fz12E(u, 0.8, 1));   // oturunca küçük yaylanma
    H.lean = lerp(S.lean, D.lean, wS) + 0.22 * Math.sin(Math.PI * wS); H.head = lerp(S.head, D.head, wS) - 0.1 * Math.sin(Math.PI * wS);
    H.elW = wH;
  } else if (!bis) {   // scooter: eller gidona → uzak ayak tablaya adım → ağırlık tablaya → yakın ayak da tablaya
    const wH = fz12E(u, 0, 0.35), wF = fz12E(u, 0.18, 0.5), wK = fz12E(u, 0.32, 0.72), wN = fz12E(u, 0.55, 0.88);
    H.fX = lerp(S.fX, D.fX, wF); H.fY = lerp(S.fY, D.fY, wF) - 3.0 * Math.sin(Math.PI * wF); H.fR = 0.3 * Math.sin(Math.PI * wF); H.fU = 0;
    H.nX = lerp(S.nX, D.nX, wN); H.nY = lerp(S.nY, D.nY, wN) - 2.6 * Math.sin(Math.PI * wN); H.nR = 0.3 * Math.sin(Math.PI * wN); H.nU = 0;
    H.hx = lerp(S.hx, D.hx, wK); H.lean = lerp(S.lean, D.lean, wH) + 0.06 * Math.sin(Math.PI * wF);
    let hy = lerp(S.hy, D.hy, wK) + 0.9 * Math.sin(Math.PI * wF);   // adım atarken hafif çöker
    hy = Math.max(hy, fz12Uzan(H.hx + 0.8, H.nX, H.nY, H.nR, H.nU) + 0.1, fz12Uzan(H.hx - 1.2, H.fX, H.fY, H.fR, H.fU) + 0.1);
    H.hy = hy + 0.45 * Math.sin(Math.PI * fz12E(u, 0.86, 1));   // sonda küçük yaylanma
    H.head = lerp(S.head, D.head, wH); H.elW = wH;
  } else {      // bisiklet: eller gidona → uzak bacak kadronun üstünden geçer, yere → yakın ayak pedala → seleye oturur → uzak ayak pedala
    const wH = fz12E(u, 0, 0.3), wF1 = fz12E(u, 0.12, 0.42), wN = fz12E(u, 0.38, 0.62), wS = fz12E(u, 0.5, 0.84), wF2 = fz12E(u, 0.66, 0.94);
    const fgX = -1.4;   // uzak ayağın kadronun öbür yanında yere bastığı yer
    let fx = lerp(S.fX, fgX, wF1), fy = -8.5 * Math.sin(Math.PI * wF1), fr = 0.35 * Math.sin(Math.PI * wF1);
    if (wF2 > 0) { fx = lerp(fgX, D.fX, wF2); fy = lerp(0, D.fY, wF2) - 2.4 * Math.sin(Math.PI * wF2); fr = lerp(0, D.fR, wF2) + 0.2 * Math.sin(Math.PI * wF2); }
    H.fX = fx; H.fY = fy; H.fR = fr; H.fU = 0;
    H.nX = lerp(S.nX, D.nX, wN); H.nY = lerp(S.nY, D.nY, wN) - 2.8 * Math.sin(Math.PI * wN); H.nR = lerp(0, D.nR, wN) + 0.2 * Math.sin(Math.PI * wN); H.nU = 0;
    H.hx = lerp(S.hx, D.hx, wS); H.lean = lerp(S.lean, D.lean, Math.max(wH * 0.7, wS)) + 0.12 * Math.sin(Math.PI * wF1);
    let hy = lerp(S.hy, D.hy, wS) - 0.7 * Math.sin(Math.PI * wS);   // seleye kalkarken hafifçe yukarı yaylanır
    hy = Math.max(hy, fz12Uzan(H.hx + 0.8, H.nX, H.nY, H.nR, 0) + 0.1, fz12Uzan(H.hx - 1.2, H.fX, H.fY, H.fR, 0) + 0.1);
    H.hy = hy + 0.6 * Math.sin(Math.PI * wF1);   // bacağını kaldırırken diz hafif bükülür
    H.head = lerp(S.head, D.head, wH); H.elW = wH;
  }
  H.nTx = D.nTx; H.nTy = D.nTy; H.fTx = D.fTx; H.fTy = D.fTy;
  H.kn1 = S.kn1; H.kn2 = S.kn2; H.kf1 = S.kf1; H.kf2 = S.kf2;
  // yüz: heyecanla bakar, binince keyifli
  const w = fz12E(u, 0, 0.6);
  R.mSmile = 1; R.mOpen = lerp(0.3, R.mOpen, w); R.brow = lerp(0.35, R.brow, w); R.gx = lerp(0.6, 0.9, w); R.gy = lerp(0.35, 0, w); R.happy = 0;
  if (u > 0.92 && ((tm + 0.4) % 3) < 0.8) R.happy = 1;
  return hz * w;
}
function fz12Kayik(H, o, tm, R) {
  const A = FEZA12_ARAC.kayik, k = 1 / FZ_SC, b = Math.sin(tm * 2.2);
  H.bA = false;
  H.hx = A.oturak[0] * k + 0.3; H.hy = A.oturak[1] * k - 3.2;
  H.nX = A.ayak[0] * k + 0.5; H.nY = A.ayak[1] * k; H.nR = 0; H.nU = 0;
  H.fX = A.ayak[0] * k - 1.0; H.fY = A.ayak[1] * k; H.fR = 0; H.fU = 0;
  R.mSmile = 1; R.lid = 1.04; R.gx = 0.85;
  if (isFinite(o.kurek)) {   // küreğe yardım: çekişte eller göğse gelir, gövde geriye; dönüşte eller öne uzanır
    const ph = ((+o.kurek % 1) + 1) % 1, cek = ph < 0.55, s = cek ? smooth(ph / 0.55) : smooth((ph - 0.55) / 0.45);
    const Cx = H.hx + 12.2, Cy = H.hy - 4.6, Fx = H.hx + 5.6, Fy = H.hy - 7.8;   // öndeki tutuş ve göğüsteki bitiş
    let tx = cek ? lerp(Cx, Fx, s) : lerp(Fx, Cx, s), ty = cek ? lerp(Cy, Fy, s) + 0.9 * Math.sin(Math.PI * s) : lerp(Fy, Cy, s) - 1.1 * Math.sin(Math.PI * s);
    if (o.el && isFinite(o.el[0]) && isFinite(o.el[1])) { tx = o.el[0] * k; ty = o.el[1] * k; }
    const ileri = clamp((tx - Fx) / (Cx - Fx), -0.2, 1.2);   // eller öndeyse gövde öne eğilir
    H.lean = lerp(0.0, 0.36, ileri) + 0.01 * b; H.head = -H.lean * 0.7 + 0.04 * Math.sin(tm * 2.7);
    H.elW = 1; H.nTx = tx; H.nTy = ty; H.fTx = tx - 1.3; H.fTy = ty + 0.5;
    const gay = cek ? Math.sin(Math.PI * s) : 0;
    R.mOpen = 0.25 + 0.3 * gay; R.mRound = gay > 0.5 ? 0.6 : 0; R.brow = 0.3 + 0.35 * gay; R.gy = 0.1;
    R.happy = !cek && s > 0.3 && s < 0.9 ? 1 : 0;
  } else {                   // dinlenir: eller dizlerde, etrafa keyifle bakar
    H.lean = 0.1 + 0.012 * b; H.head = -0.06 + 0.05 * Math.sin(tm * 0.9);
    H.elW = 1; H.nTx = H.hx + 9.6; H.nTy = H.hy - 0.9 + 0.12 * b; H.fTx = H.hx + 8.4; H.fTy = H.hy - 0.6 + 0.12 * b;
    R.mOpen = 0.3; R.brow = 0.3; R.gy = -0.15 + 0.2 * Math.sin(tm * 0.7); R.gx = 0.7 + 0.3 * Math.sin(tm * 0.53);
    R.happy = ((tm + 2) % 5.2) < 1.2 ? 1 : 0;
  }
  H.kn1 = 0.12; H.kn2 = 0.35; H.kf1 = -0.1; H.kf2 = 0.3;
  return 0.2;
}
function fz12Otur(H, o, tm, R) {   // piknik örtüsünde bağdaş (yandan): dizler önde, ayaklar çaprazlanıp altta
  const b = Math.sin(tm * 2.2), sl = clamp(+o.sallan || 0, 0, 1), sw = Math.sin(tm * 2.0) * (0.25 + 0.75 * sl);
  H.bA = true; H.hx = 0; H.hy = -3.3;
  H.n1 = 1.74 + 0.02 * sw; H.n2 = -2.84; H.f1 = 1.58 - 0.02 * sw; H.f2 = -2.95;
  H.nR = -0.42; H.fR = -0.3;
  H.lean = 0.06 + 0.035 * sw + 0.01 * b; H.head = -0.04 - 0.05 * sw + clamp(+o.bak || 0, -1, 1) * 0.12;
  H.elW = 1; H.nTx = 7.2; H.nTy = -5.4 + 0.12 * b; H.fTx = 5.7; H.fTy = -5.0 + 0.12 * b;   // eller dizlerin üstünde
  H.kn1 = 0.12; H.kn2 = 0.35; H.kf1 = -0.1; H.kf2 = 0.3;
  R.mSmile = 1; R.mOpen = 0.22 + 0.1 * sl; R.brow = 0.25; R.lid = 1.02; R.gx = 0.8;
  R.gy = clamp(+o.bak || 0, -1, 1) * 0.6 - 0.15;
  R.happy = ((tm + 1) % 4.6) < 1.1 || sl > 0.6 && ((tm * 1.5) % 2) < 0.8 ? 1 : 0;
  return 0;
}
function fz12Saril(H, o, tm, R, Q) {   // anneye sarılma (yandan, anneye dönük)
  const u = clamp(isFinite(o.u) ? +o.u : 0, 0, 1), k = 1 / FZ_SC;
  const ac = fz12E(u, 0, 0.12) * (1 - fz12E(u, 0.35, 0.55)), sar = fz12E(u, 0.35, 0.6), sq = Math.max(0, Math.sin((u - 0.6) * 22)) * fz12E(u, 0.6, 0.7), sw = Math.sin(tm * 2.2) * sar;
  const otur = !!o.otur;   // örtüde otururken yanındaki anneye dönüp sarılır
  if (otur) fz12Otur(H, FZ_BOS, tm, R); else fz12Dur(H, tm);
  const hx0 = isFinite(o.hedef && o.hedef[0]) ? o.hedef[0] * k : (otur ? 20 : 25) * k, hy0 = isFinite(o.hedef && o.hedef[1]) ? o.hedef[1] * k : (otur ? -17 : -40) * k;
  const yuk = otur ? 0 : clamp((-hy0 - 32) / 8, 0, 1);   // hedef yüksekse parmak ucuna kalkar
  const hop = Math.abs(Math.sin(tm * 6.5)) * ac;  // "gel!" diye zıp zıp
  H.nR = H.fR = 0.45 * yuk * sar; H.nU = H.fU = yuk * sar;
  if (otur) { H.lean = 0.06 + 0.2 * sar + 0.03 * sq + 0.025 * sw; H.head = 0.14 * sar + 0.05 * sw - 0.1 * ac; H.hy += 0.15 * sq; }
  else {
    H.hy = H.hy - 1.3 * yuk * sar - 0.9 * hop + 0.25 * sq;
    H.hx = 0.7 * sar; H.lean = 0.03 + 0.12 * sar + 0.03 * sq + 0.025 * sw; H.head = 0.14 * sar + 0.05 * sw - 0.1 * ac;
    H.nX += 0.6 * sar; H.fX += 0.6 * sar;
  }
  H.elW = sar; H.nTx = hx0 + 0.4 * sq; H.nTy = hy0; H.fTx = hx0 - 1.6; H.fTy = hy0 + 1.8;
  H.kn1 = lerp(0.12, 1.58 + 0.08 * Math.sin(tm * 9), ac); H.kn2 = lerp(0.35, 0.22, ac); H.kf1 = lerp(-0.1, 1.95, ac); H.kf2 = lerp(0.3, 0.3, ac);
  R.hOpen = ac; R.mSmile = 1; R.mOpen = lerp(0.3, 0.75, ac) * (1 - sar) + 0.25 * sar; R.brow = 0.4; R.lid = 1.05; R.gx = 0.9;
  R.gy = -0.35 * (1 - sar); R.happy = sar > 0.5 || ac > 0.6 ? 1 : 0;
  R.shr = 0.15 * sq; R.sy = 1 - 0.02 * sq; R.sx = 2 - R.sy;
  Q.a_kenar = true;
  return 0;
}

// 'otur' opt.u < 1: ayakta (0) → dizler bükülür, çömelir → bağdaş (1). Bacak açıları karışır; kalça hep ayakların yere bastığı yükseklikte.
function fz12OturGecis(R, Q, u, tm) {
  const H = FZ12_HS, T0 = FZ12_TMP;
  fzPack(R, T0); const a0 = FZ12_AYAK[0], a1 = FZ12_AYAK[1];   // oturuş
  fz12Dur(H, tm); fz12Uygula(H, R, Q);                          // ayakta
  const w = smooth(u), wl = smooth(clamp(u / 0.85, 0, 1));
  R.lt1 = lerp(R.lt1, T0[3], wl); R.lt2 = lerp(R.lt2, T0[4], wl); R.bt1 = lerp(R.bt1, T0[5], wl); R.bt2 = lerp(R.bt2, T0[6], wl);
  R.lean = lerp(R.lean, T0[0], w) + 0.22 * Math.sin(Math.PI * u); R.hx = lerp(R.hx, T0[1], w) - 0.8 * Math.sin(Math.PI * u);
  R.la1 = lerp(R.la1, T0[7], w) + 0.35 * Math.sin(Math.PI * u); R.la2 = lerp(R.la2, T0[8], w); R.ba1 = lerp(R.ba1, T0[9], w) + 0.3 * Math.sin(Math.PI * u); R.ba2 = lerp(R.ba2, T0[10], w);
  R.arm = lerp(R.arm, T0[27], w); R.head = lerp(R.head, T0[12], w);
  FZ12_AYAK[0] = a0 * w; FZ12_AYAK[1] = a1 * w;
  const hip = lerp(-Math.max(fzFy(R.lt1, R.lt2), fzFy(R.bt1, R.bt2)), -3.3, smooth(clamp((u - 0.6) / 0.4, 0, 1)));
  FZ12_H.hy = hip; R.bob = hip + Math.max(fzFy(R.lt1, R.lt2), fzFy(R.bt1, R.bt2));
}

// fezaCizPoz (feza.js) → Bölüm 12 tüm beden pozları. R = fzCS.a_R (FZ_REST ile doldurulmuş), Q = fzCS.
function fz12Poz(poz, tm, opt, R, Q, olcek, x, y) {
  const oyun = opt === FZ12_OPT, o = oyun ? (FZ12.src || FZ_BOS) : (opt && typeof opt === 'object' ? opt : FZ_BOS);
  const H = FZ12_H; let hz = 0, kask = 0;
  R.breath = Math.sin(tm * 2.2) * 0.55;
  FZ12_DON.front = false; FZ12_DON.rotA = 0;
  if (poz === 'scooter') { hz = fz12Scooter(H, o, tm, R); kask = o.kask ? 1 : 0; }
  else if (poz === 'bisiklet') { hz = fz12Bisiklet(H, o, tm, R); kask = o.kask ? 1 : 0; }
  else if (poz === 'binis_in') { hz = fz12Binis(H, o, tm, R); kask = o.kask ? fz12Geri(clamp((isFinite(o.u) ? +o.u : 0) / 0.3, 0, 1)) : 0; }
  else if (poz === 'kayik') { hz = fz12Kayik(H, o, tm, R); FZ12_DON.rotA = isFinite(o.aci) ? clamp(+o.aci, -0.5, 0.5) : 0; }
  else if (poz === 'otur') hz = fz12Otur(H, o, tm, R);
  else hz = fz12Saril(H, o, tm, R, Q);
  fz12Uygula(H, R, Q);
  if (poz === 'otur' && isFinite(o.u) && +o.u < 1) fz12OturGecis(R, Q, clamp(+o.u, 0, 1), tm);
  if (poz === 'scooter' || poz === 'bisiklet' || poz === 'kayik' || poz === 'otur') fz12Salla(R, Q, clamp(+o.salla || 0, 0, 1), tm);
  if (poz === 'kayik' || poz === 'otur') { fz12Sevinc(R, clamp(+o.sevinc || 0, 0, 1), tm); fz12Bak(R, +o.bak || 0); }
  fz12Ruzgar(Q, hz, tm);
  if (poz === 'kayik' || poz === 'otur') Q.a_cl = 0.15 * Math.sin(tm * 1.7);
  Q.a_kask12 = kask; if (kask > 0) Q.a_kaskRenk = typeof o.kask === 'string' && o.kask ? o.kask : FZ12.kaskRenk;
  if (!oyun) return FZ12_DON;
  // oyunda: önceki görüntüden yumuşak karışım (eklemler, kalça, saç, etek, ayakkabı)
  const w = smooth(FZ12.kar), T0 = FZ12_TMP;
  fzPack(R, T0);
  T0[FZ_N] = H.hy; T0[FZ_N + 1] = Q.a_hx; T0[FZ_N + 2] = Q.a_hy; T0[FZ_N + 3] = Q.a_cl; T0[FZ_N + 4] = FZ12_AYAK[0]; T0[FZ_N + 5] = FZ12_AYAK[1];
  if (w < 1) {
    const E = FZ12_ESK;
    for (let i = 0; i < FZ12_NS; i++) T0[i] = lerp(E[i], T0[i], w);
    fzUnpack(T0, R);
    R.bob = T0[FZ_N] + Math.max(fzFy(R.lt1, R.lt2), fzFy(R.bt1, R.bt2));
    T0[FZ12_I_BOB] = R.bob;
    Q.a_hx = T0[FZ_N + 1]; Q.a_hy = T0[FZ_N + 2]; Q.a_cl = T0[FZ_N + 3]; FZ12_AYAK[0] = T0[FZ_N + 4]; FZ12_AYAK[1] = T0[FZ_N + 5];
  }
  FZ12_SON.set(T0);
  FEZA12.kask = kask;
  // ellerin dünya konumu (kürek sapı, gidon, uçurtma ipi için)
  const hip = T0[FZ_N], sc = olcek * FZ_SC, c = Math.cos(FZ12_DON.rotA), s = Math.sin(FZ12_DON.rotA), bx = (P.rx ?? P.x) + FZ12.ox, by = (P.ry ?? P.y) + FZ12.oy;
  fz12ElYeri(R, hip, true, FZ12_P); { const lx = FZ12_P[0] * sc, ly = FZ12_P[1] * Math.abs(sc); FEZA12.el.x = bx + lx * c - ly * s; FEZA12.el.y = by + lx * s + ly * c; }
  fz12ElYeri(R, hip, false, FZ12_P); { const lx = FZ12_P[0] * sc, ly = FZ12_P[1] * Math.abs(sc); FEZA12.el2.x = bx + lx * c - ly * s; FEZA12.el2.y = by + lx * s + ly * c; }
  return FZ12_DON;
}

// ── kask (fzDraw'dan, başın çerçevesinde: kafatası merkezi (-0.3,-1.6) r 8.6, yüz +x'e) ──
function fz12Kask(x, R, tm) {
  const k = fzQ.a_kask12; if (!(k > 0.01)) return;
  const col = fzQ.a_kaskRenk || FZ12_KASK;
  x.save();
  x.translate(-0.4, -5.5); x.scale(k, k); x.translate(0.4, 5.5);   // "pıt" diye takılır (tepeden büyür)
  // kask kabuğu: alnın üstünden başın arkasına, kulağın üstünde biter
  x.beginPath();
  x.moveTo(8.9, -3.6);
  x.bezierCurveTo(9.6, -9.6, 4.2, -13.1, -1.2, -12.6);
  x.bezierCurveTo(-7.4, -12.0, -10.6, -6.6, -9.9, -0.9);
  x.quadraticCurveTo(-9.2, 0.6, -7.6, 0.2);
  x.quadraticCurveTo(-4.6, -2.4, -0.6, -3.0);
  x.quadraticCurveTo(4.6, -3.6, 8.9, -3.6);
  x.closePath();
  x.fillStyle = col; x.fill();
  x.save(); x.clip();
  x.fillStyle = 'rgba(20,60,120,0.2)'; x.beginPath(); x.ellipse(-2.5, 1.2, 12, 6.2, -0.15, 0, 6.2832); x.fill();   // alt yarı gölge
  x.fillStyle = 'rgba(255,255,255,0.32)'; x.beginPath(); x.ellipse(1.6, -10.2, 5.4, 1.9, -0.18, 0, 6.2832); x.fill();   // tepe parıltısı
  // beyaz şeritler (havalandırma) ve minik yıldız
  x.strokeStyle = 'rgba(255,255,255,0.92)'; x.lineWidth = 1.05; x.lineCap = 'round';
  x.beginPath(); x.moveTo(6.6, -8.6); x.quadraticCurveTo(2.0, -12.0, -4.4, -11.0); x.stroke();
  x.beginPath(); x.moveTo(7.6, -5.6); x.quadraticCurveTo(1.0, -9.6, -7.2, -7.4); x.stroke();
  x.restore();
  x.fillStyle = FZ.yel; fz8Yildiz(x, -4.6, -5.0, 1.55, 0.2);
  x.strokeStyle = 'rgba(16,50,96,0.45)'; x.lineWidth = 0.5;   // alt kenar
  x.beginPath(); x.moveTo(-9.9, -0.9); x.quadraticCurveTo(-9.2, 0.6, -7.6, 0.2); x.quadraticCurveTo(-4.6, -2.4, -0.6, -3.0); x.quadraticCurveTo(4.6, -3.6, 8.9, -3.6); x.stroke();
  // çene kayışı (kulağın önünden çeneye) ve tokası
  x.strokeStyle = 'rgba(120,128,150,0.85)'; x.lineWidth = 0.55;
  x.beginPath(); x.moveTo(0.4, -2.9); x.quadraticCurveTo(0.6, 3.6, 3.4, 7.7); x.stroke();
  x.fillStyle = '#dfe4ee'; x.beginPath(); x.roundRect(2.6, 6.9, 1.6, 1.1, 0.4); x.fill();
  x.restore();
}
