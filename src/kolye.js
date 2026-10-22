/* kolye.js – Bölüm 9 (Pırıl'ın Ejderha Vadisi) mini oyun 3: BÜYÜKANNE'NİN PUL KOLYESİ (önek kl9), nesne türü 'kolyeMini'. Sahibi: KOLYE.
   Dağ yolunun terasında, örgü minderin üstünde Büyükanne Ejderha (ilk görünüş: kocaman, tombul, gözlüklü, örgü atkılı, yumuşacık)
   iç çekerek oturur: kolyesindeki beş parlak pul düşmüş, önündeki çimenlere saçılmış; pullar çimenlerin arasında parlar, göz kırpar.
   Feza yaklaşınca kadraj yumuşakça yerleşir (kazan.js gibi: P.ucus = o ile fizik devralınır, Feza'yı ve Pırıl'ı bu dosya çizer).
   Büyükanne başını kaldırıp gülümser, pullar sırayla "buradayız" diye parlar. Feza bir pula DOKUNUR → pul uçup kolyedeki kendi biçimli
   yuvasına (yuvarlak, yıldız, kalp, damla, ay) oturur; ya da parmağıyla SÜRÜKLER → doğru yuvaya yaklaşınca yuva onu kendisi yakalar,
   yanlış yuvaya bırakılırsa yuva hafifçe "ıh-ıh" diye sallanır, doğru yuva parlar ve pul yumuşakça çimendeki yerine süzülür (ceza yok).
   Büyükanne'ye ya da kolyeye dokunmak da sıradaki pulu getirir. Klavye yedeği: Boşluk/Enter/E/→.
   Her pulda: yuva ışıl ışıl yanar, kolye bir nota çalar (AU.sfx('kolyePul', 0..4)), Büyükanne gülümser (AU.sfx('buyukanneGul')),
   kalpler ve ışık tozu yükselir. Beşincide kolye ışıl ışıl yanar (AU.sfx('kolyeParla')): ışık halkaları, dönen ışık hüzmeleri;
   Büyükanne kalkar, kanat çırparak Feza'nın yanına konar, Feza'yı ve Pırıl'ı kanatlarıyla kucaklar, sonra sırtını gösterip davet eder
   ve süzülerek kalkış kayalığına (buyukanneBinis, sütun 602) konar. Kaybetme/yazı/öğretici el yok; ipucu ışıkla (sıradaki pul parlar
   ve hoplar, yuvasına doğru ışık tozu akar, yuvası parlar, Pırıl yanına uçar). ~25 sn dokunulmazsa (sonrakilerde ~12 sn) Pırıl
   sıradaki pulu kendisi taşıyıp yuvasına bırakır; çocuk dokununca bırakır.
   Durum: Büyükanne kayalığa konduğu karede Feza bırakılır; aynı anda o.done, o.tk.bitti, V9.kolye = true (kapı açılır),
   KOLYE.devir = {x, y, s, yon, poz} ve OLAY 'kolyeBitti'. Kayalıkta Büyükanne'yi buyukanne.js devralana kadar (KOLYE.devirAlindi = true
   yazana kadar) bu dosya çizmeyi sürdürür.
   Olaylar: 'kolyeBasla' {o} · 'kolyePul' {o, n (1..5), bicim, yardim} · 'kolyeYardim' {o} · 'kolyeParla' {o} · 'kolyeKucak' {o} ·
     'kolyeBitti' {o, buyukanne: {x, y}}. Büyükanne'nin sözleri CORE'da (bn_ sesleri bu olaylara bağlı); OLAY 'konusma' (kim 'bn' ya da
     anahtar bn_*) gelince Büyükanne'nin ağzı oynar.
   Ortak: KOLYE_BICIM, KOLYE_RENK, kolyePulCiz(c, x, y, r, bicim, t, parla) — pul çizici (buyukanne.js / yuva.js de kullanabilir).
   Büyükanne: buyukanneCiz (buyukanne.js) typeof kontrolüyle; yoksa sade yedek çizim (kl9BnYedek). Ayrıntı: b9/istek/KOLYE_BUYUKANNE.md.
   Yerleşim (bolum9.js): nesne('kolyeMini', 580, yuzey(580), {x0, x1}); o.x-470 … o.x+300 DÜZ zemin; Feza o.x-380'i geçince başlar. */
'use strict';
const KOLYE_BICIM = ['yuvarlak', 'yildiz', 'kalp', 'damla', 'ay'];
const KOLYE_RENK = ['#b89cff', '#6fd8a8', '#ff9fc0', '#7fe0f0', '#ffd27a'];   // lila · nane · gül · gök · altın (yuvarlak, yıldız, kalp, damla, ay)
const KL9_ACIK = ['#e6dcff', '#c8f6dc', '#ffd8e6', '#d4f8ff', '#fff0c2'];
const KL9_KOYU = ['#7a5cd6', '#2e9f78', '#e0608e', '#3aa8c8', '#e09a2e'];
const KL9_BX = 178;                       // Büyükanne'nin oturduğu yer (o.x'e göre, taban)
const KL9_AKTIF = 380;                    // Feza o.x - 380'i geçince etkinlik başlar
const KL9_GIR0 = -450, KL9_GIR1 = -310;   // Feza'nın oyun boyunca durduğu yerin sınırları (o.x'e göre)
const KL9_GEL = 1.7, KL9_IPUCU = 4, KL9_GOSTER = 10, KL9_YARDIM = 25, KL9_YARDIM2 = 12;
const KL9_PR = 12.5;                        // pulun yuvadaki yarıçapı (çimende 1.25 kat)
const KL9_YAKALA = 24, KL9_YANLIS = 22;   // sürüklenen pulu doğru yuva bu uzaklıkta yakalar · yanlış yuva bu uzaklıkta "ıh-ıh" der
const KL9_BN_S = 1;                       // Büyükanne'nin ölçeği (buyukanne.js BN9_S verirse o kullanılır)
// kolyenin yuvaları: göğüs noktasına göre (buyukanneCiz: göğüs genişliği 96, boyun 34 yukarıda; uzun kolye: omuzlardan karnın üstüne
// sarkan U, ortası en alçak), sırası KOLYE_BICIM. Göğüs genişliği başkaysa x ölçeklenir (k.kx).
const KL9_YUVA = [[-43, -20], [-29, 9], [0, 24], [29, 9], [43, -20]];
const KL9_OMUZ = [[-46, -34], [46, -34]];
const KL9_CIM = 1.5;                     // pulun çimendeki büyüklüğü (yuvadakine göre)
// çimendeki yerler (o.x, o.y'ye göre) ve oradaki pulun biçimi (karışık sıra)
const KL9_YER = [{ fx: -268, fy: -12, b: 2, rot: -0.35 }, { fx: -196, fy: -16, b: 4, rot: 0.3 }, { fx: -124, fy: -11, b: 0, rot: -0.15 },
  { fx: -52, fy: -15, b: 3, rot: 0.4 }, { fx: 20, fy: -12, b: 1, rot: -0.25 }];
// final zaman çizelgesi (sn): parlama → kalkış → Feza'nın yanına kanatlı sıçrayış → kucak → dönüp davet → kayalığa süzülüş
const KL9_F = { kalk: 1.9, yur0: 2.5, yur1: 3.8, sar0: 4.3, kucak1: 6.9, geri1: 8.0, uc0: 9.1, uc1: 11.7 };
const KOLYE = {
  o: null, ptr: -1, px: 0, py: 0, pt: 0, yol: 0, tut: null, tutUzak: 0, hx: 0, hy: 0,
  devir: null, devirAlindi: false,
  get aktif() { const o = this.o; return o && o.kl && o.kl.aktif && !o.done ? o : null; }
};
function kl9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function kl9Isik(c, col, x, y, r, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - r, y - r, r * 2, r * 2); c.globalAlpha = ea; }
function kl9IsikE(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
function kl9BnS() { return typeof BN9_S === 'number' && BN9_S > 0 ? BN9_S : KL9_BN_S; }

// ═══════════════════════════════ önbellek tuvalleri ═══════════════════════════════
const KL9_SPR = new Map();
function kl9Tuval(ad, x0, y0, w, h, fn, K) {
  let c = KL9_SPR.get(ad); if (c) return c;
  K = K || 4;
  c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w * K)); c.height = Math.max(1, Math.ceil(h * K));
  const q = c.getContext('2d'); q.scale(K, K); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  fn(q); c.x0 = x0; c.y0 = y0; c.w = w; c.h = h; KL9_SPR.set(ad, c); return c;
}
function kl9Koy(c, sp, x, y) { c.drawImage(sp, x + sp.x0, y + sp.y0, sp.w, sp.h); }
function kl9KoyS(c, sp, x, y, k) { c.drawImage(sp, x + sp.x0 * k, y + sp.y0 * k, sp.w * k, sp.h * k); }
function kl9Lin(q, x0, y0, x1, y1, st) { const gr = q.createLinearGradient(x0, y0, x1, y1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function kl9Rad(q, x0, y0, r0, x1, y1, r1, st) { const gr = q.createRadialGradient(x0, y0, r0, x1, y1, r1); for (let i = 0; i < st.length; i += 2) gr.addColorStop(st[i], st[i + 1]); return gr; }
function kl9Isilti(q, x, y, r) {   // dört köşeli ışıltı
  q.beginPath(); q.moveTo(x, y - r); q.quadraticCurveTo(x + r * 0.16, y - r * 0.16, x + r, y); q.quadraticCurveTo(x + r * 0.16, y + r * 0.16, x, y + r);
  q.quadraticCurveTo(x - r * 0.16, y + r * 0.16, x - r, y); q.quadraticCurveTo(x - r * 0.16, y - r * 0.16, x, y - r); q.closePath();
}
// hilal: dış daire eksi kaydırılmış iç daire (kesişim noktaları bir kez hesaplanır)
const KL9_AY = (() => { const R1 = 0.98, R2 = 0.8, d = 0.5, th = -0.62, x = (d * d + R1 * R1 - R2 * R2) / (2 * d), h = Math.sqrt(Math.max(0, R1 * R1 - x * x));
  return { R1, R2, d, th, fi: Math.atan2(h, x), psi: Math.atan2(h, x - d), ox: -Math.cos(th) * 0.2, oy: -Math.sin(th) * 0.2 }; })();
function kl9Sekil(q, b, r) {   // biçim yolu, merkez (0,0), yarıçap r: 0 yuvarlak · 1 yıldız · 2 kalp · 3 damla · 4 ay
  q.beginPath();
  if (b === 0) q.arc(0, 0, r * 0.92, 0, 6.2832);
  else if (b === 1) {
    const ic = 0.54, R = r * 1.06;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / 5, bb = a + Math.PI / 5, a2 = a + 2 * Math.PI / 5;
      if (!i) q.moveTo(Math.cos(a - 0.14) * R * 0.92, Math.sin(a - 0.14) * R * 0.92 + r * 0.06);
      q.quadraticCurveTo(Math.cos(a) * R, Math.sin(a) * R + r * 0.06, Math.cos(a + 0.14) * R * 0.92, Math.sin(a + 0.14) * R * 0.92 + r * 0.06);
      q.quadraticCurveTo(Math.cos(bb) * R * ic, Math.sin(bb) * R * ic + r * 0.06, Math.cos(a2 - 0.14) * R * 0.92, Math.sin(a2 - 0.14) * R * 0.92 + r * 0.06);
    }
  } else if (b === 2) {
    const y0 = r * 0.1;
    q.moveTo(0, r * 0.86 + y0); q.bezierCurveTo(-r * 1.32, -r * 0.02 + y0, -r * 0.64, -r * 1.1 + y0, 0, -r * 0.42 + y0);
    q.bezierCurveTo(r * 0.64, -r * 1.1 + y0, r * 1.32, -r * 0.02 + y0, 0, r * 0.86 + y0);
  } else if (b === 3) {
    const yo = -r * 0.1;
    q.moveTo(0, -r * 1.04 + yo); q.bezierCurveTo(r * 0.42, -r * 0.46 + yo, r * 0.82, -r * 0.06 + yo, r * 0.82, r * 0.34 + yo);
    q.arc(0, r * 0.34 + yo, r * 0.82, 0, Math.PI);
    q.bezierCurveTo(-r * 0.82, -r * 0.06 + yo, -r * 0.42, -r * 0.46 + yo, 0, -r * 1.04 + yo);
  } else {
    const A = KL9_AY, ox = A.ox * r, oy = A.oy * r, cx2 = ox + Math.cos(A.th) * A.d * r, cy2 = oy + Math.sin(A.th) * A.d * r;
    q.arc(ox, oy, A.R1 * r, A.th + A.fi, A.th - A.fi + 6.2832);
    q.arc(cx2, cy2, A.R2 * r, A.th - A.psi, A.th + A.psi - 6.2832, true);
  }
  q.closePath();
}
// pul: ejderha pulu gibi yanardöner, altın kenarlı, içinde minik pul dokusu
function kl9PulSpr(b) {
  const r = KL9_PR, m = r * 1.45;
  return kl9Tuval('pul' + b, -m, -m, m * 2, m * 2, q => {
    const col = KOLYE_RENK[b], ac = KL9_ACIK[b], ko = KL9_KOYU[b];
    kl9Sekil(q, b, r); q.fillStyle = kl9Rad(q, -r * 0.3, -r * 0.38, r * 0.08, 0, 0, r * 1.2, [0, '#ffffff', 0.2, ac, 0.62, col, 1, ko]); q.fill();
    q.save(); kl9Sekil(q, b, r); q.clip();
    q.strokeStyle = 'rgba(255,255,255,0.32)'; q.lineWidth = 0.8;
    for (let row = 0; row < 5; row++) for (let i = -3; i <= 3; i++) { const x = i * r * 0.44 + (row & 1) * r * 0.22, y = -r * 0.82 + row * r * 0.4; q.beginPath(); q.arc(x, y, r * 0.24, 0.2, Math.PI - 0.2); q.stroke(); }
    q.fillStyle = kl9Lin(q, -r, -r, r, r, [0, 'rgba(255,255,255,0)', 0.36, 'rgba(200,255,236,0)', 0.46, 'rgba(255,255,255,0.55)', 0.54, 'rgba(255,214,250,0.38)', 0.66, 'rgba(200,255,236,0.18)', 0.78, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,0)']);
    q.fillRect(-m, -m, m * 2, m * 2);
    q.fillStyle = kl9Rad(q, r * 0.3, r * 0.4, 0, r * 0.3, r * 0.4, r * 0.9, [0, 'rgba(40,20,80,0.18)', 1, 'rgba(40,20,80,0)']); q.fillRect(-m, -m, m * 2, m * 2);
    q.restore();
    kl9Sekil(q, b, r); q.strokeStyle = 'rgba(110,64,30,0.5)'; q.lineWidth = 3.2; q.stroke();
    q.strokeStyle = '#f7d277'; q.lineWidth = 2; q.stroke();
    q.strokeStyle = 'rgba(255,250,220,0.85)'; q.lineWidth = 0.7; q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.9)'; q.beginPath(); q.ellipse(-r * 0.32, -r * 0.36, r * 0.22, r * 0.11, -0.65, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.arc(r * 0.28, r * 0.26, r * 0.07, 0, 6.2832); q.fill();
  }, 6);
}
// yuva: altın çerçeve + koyu, biçimli oyuk (içinde pulun renginden soluk bir ışık) + zincire asıldığı halka
function kl9YuvaSpr(b) {
  const r = KL9_PR, m = r * 1.6;
  return kl9Tuval('yuva' + b, -m, -m - 4, m * 2, m * 2 + 4, q => {
    q.fillStyle = '#e6b64e'; q.strokeStyle = 'rgba(110,64,30,0.6)'; q.lineWidth = 1.4;
    q.beginPath(); q.arc(0, -r * 1.22, r * 0.26, 0, 6.2832); q.fill(); q.stroke();
    q.fillStyle = 'rgba(255,246,200,0.9)'; q.beginPath(); q.arc(-r * 0.08, -r * 1.28, r * 0.09, 0, 6.2832); q.fill();
    q.save(); q.scale(1.24, 1.24); kl9Sekil(q, b, r); q.restore();
    q.fillStyle = kl9Lin(q, -r, -r * 1.2, r, r * 1.2, [0, '#fff0b0', 0.35, '#f2c862', 0.7, '#d9a03c', 1, '#b67a26']); q.fill();
    q.strokeStyle = 'rgba(110,64,30,0.6)'; q.lineWidth = 1.5; q.stroke();
    q.save(); q.scale(0.98, 0.98); kl9Sekil(q, b, r); q.restore();
    q.fillStyle = kl9Rad(q, 0, r * 0.15, 0, 0, 0, r * 1.1, [0, mixc(KOLYE_RENK[b], '#3a2457', 0.45, 1), 0.6, '#3a2457', 1, '#2a1840']); q.fill();
    q.save(); q.scale(0.98, 0.98); kl9Sekil(q, b, r); q.restore(); q.save(); q.clip();
    q.fillStyle = 'rgba(20,8,40,0.45)'; q.beginPath(); q.ellipse(0, -r * 1.05, r * 1.3, r * 0.55, 0, 0, 6.2832); q.fill();   // üst iç gölge (oyuk derin görünsün)
    q.restore();
    q.save(); q.scale(0.78, 0.78); kl9Sekil(q, b, r); q.restore();
    q.setLineDash([2.2, 2.4]); q.strokeStyle = mixc(KL9_ACIK[b], '#ffffff', 0.3, 0.7); q.lineWidth = 1.3; q.stroke(); q.setLineDash([]);
    q.strokeStyle = 'rgba(255,248,214,0.8)'; q.lineWidth = 0.9; q.beginPath(); q.arc(0, 0, r * 1.05, Math.PI * 1.1, Math.PI * 1.45); q.stroke();
  }, 6);
}
// zincir: omuzlardan yuvaların halkalarından geçen altın boncuklar (göğüs noktası 0,0)
const KL9_ZN = [];
function kl9ZincirNokta() {
  if (KL9_ZN.length) return KL9_ZN;
  const P0 = [KL9_OMUZ[0], ...KL9_YUVA.map(([x, y]) => [x, y - KL9_PR * 1.22]), KL9_OMUZ[1]];
  for (let i = 0; i < P0.length - 1; i++) {
    const a = P0[Math.max(0, i - 1)], b = P0[i], c = P0[i + 1], d = P0[Math.min(P0.length - 1, i + 2)];
    const L = Math.hypot(c[0] - b[0], c[1] - b[1]), n = Math.max(2, Math.round(L / 6.5));
    for (let j = 0; j < n; j++) { const t = j / n, t2 = t * t, t3 = t2 * t;   // Catmull-Rom
      KL9_ZN.push([0.5 * (2 * b[0] + (-a[0] + c[0]) * t + (2 * a[0] - 5 * b[0] + 4 * c[0] - d[0]) * t2 + (-a[0] + 3 * b[0] - 3 * c[0] + d[0]) * t3),
        0.5 * (2 * b[1] + (-a[1] + c[1]) * t + (2 * a[1] - 5 * b[1] + 4 * c[1] - d[1]) * t2 + (-a[1] + 3 * b[1] - 3 * c[1] + d[1]) * t3)]); }
  }
  KL9_ZN.push(P0[P0.length - 1]);
  return KL9_ZN;
}
function kl9ZincirSpr() {
  return kl9Tuval('zincir', -56, -42, 112, 64, q => {
    const N = kl9ZincirNokta();
    q.strokeStyle = 'rgba(110,64,30,0.45)'; q.lineWidth = 2.4; q.beginPath(); N.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.stroke();
    q.strokeStyle = '#e8bb54'; q.lineWidth = 1.2; q.stroke();
    for (let i = 0; i < N.length; i++) { const [x, y] = N[i], inci = i % 3 === 1;
      q.fillStyle = inci ? '#fff6ee' : '#f0c660'; q.beginPath(); q.arc(x, y, inci ? 2.5 : 2.1, 0, 6.2832); q.fill();
      q.strokeStyle = inci ? 'rgba(160,120,150,0.5)' : 'rgba(110,64,30,0.5)'; q.lineWidth = 0.6; q.stroke();
      q.fillStyle = 'rgba(255,255,255,0.85)'; q.beginPath(); q.arc(x - 0.7, y - 0.8, 0.7, 0, 6.2832); q.fill(); }
  }, 5);
}
function kl9IsiltiSpr() { return kl9Tuval('isilti', -10, -10, 20, 20, q => { q.fillStyle = kl9Rad(q, 0, 0, 0, 0, 0, 9, [0, 'rgba(255,255,255,0.8)', 1, 'rgba(255,255,255,0)']); q.beginPath(); q.arc(0, 0, 9, 0, 6.2832); q.fill(); q.fillStyle = '#ffffff'; kl9Isilti(q, 0, 0, 8.5); q.fill(); }); }
function kl9KalpSpr() { return kl9Tuval('kalp', -9, -9, 18, 18, q => { const s = 6.5; q.beginPath(); q.moveTo(0, s * 0.95); q.bezierCurveTo(-s * 1.35, -s * 0.1, -s * 0.6, -s * 1.15, 0, -s * 0.35); q.bezierCurveTo(s * 0.6, -s * 1.15, s * 1.35, -s * 0.1, 0, s * 0.95); q.fillStyle = '#ff9fc0'; q.fill(); q.strokeStyle = '#e0608e'; q.lineWidth = 1; q.stroke(); q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.arc(-2.6, -2.6, 1.3, 0, 6.2832); q.fill(); }); }
function kl9NotaSpr() { return kl9Tuval('nota', -7, -15, 16, 22, q => { q.fillStyle = '#fff4d6'; q.strokeStyle = 'rgba(190,130,40,0.75)'; q.lineWidth = 1.1; q.beginPath(); q.ellipse(-1.5, 3, 4.2, 3.2, -0.4, 0, 6.2832); q.fill(); q.stroke(); q.fillRect(1.8, -12, 1.8, 15); q.strokeRect(1.8, -12, 1.8, 15); q.beginPath(); q.moveTo(3.6, -12); q.quadraticCurveTo(9, -9, 7.5, -3.5); q.quadraticCurveTo(7, -7, 3.6, -8); q.closePath(); q.fill(); q.stroke(); }); }
function kl9OtSpr(i) {   // pulların önündeki çimen tutamı (pul biraz saklanmış görünsün)
  return kl9Tuval('ot' + i, -26, -24, 52, 26, q => {
    const r = rng(9100 + i * 7);
    for (let k = 0; k < 11; k++) { const x = -20 + k * 4 + (r() - 0.5) * 3, h = 9 + r() * 12, e = (r() - 0.5) * 9;
      q.strokeStyle = k % 3 ? '#4fbf86' : '#7fdca6'; q.lineWidth = 2.6 - r() * 0.8; q.beginPath(); q.moveTo(x, 1); q.quadraticCurveTo(x + e * 0.3, -h * 0.6, x + e, -h); q.stroke(); }
    q.fillStyle = '#ffd8e6'; for (let k = 0; k < 2; k++) { const x = -12 + k * 22 + r() * 4, y = -10 - r() * 6; q.beginPath(); for (let p = 0; p < 5; p++) { const a = p * 1.2566; q.moveTo(x, y); q.arc(x + Math.cos(a) * 1.9, y + Math.sin(a) * 1.9, 1.6, 0, 6.2832); } q.fill(); q.fillStyle = '#ffe27a'; q.beginPath(); q.arc(x, y, 1.2, 0, 6.2832); q.fill(); q.fillStyle = '#fff4f8'; }
  }, 4);
}
function kl9Golge() { return kl9Tuval('golge', -64, -16, 128, 32, q => { q.scale(1, 0.25); q.fillStyle = kl9Rad(q, 0, 0, 0, 0, 0, 62, [0, 'rgba(30,40,60,0.42)', 0.6, 'rgba(30,40,60,0.18)', 1, 'rgba(30,40,60,0)']); q.beginPath(); q.arc(0, 0, 62, 0, 6.2832); q.fill(); }, 2); }

// ═══════════════════════════════ teras süsleri ═══════════════════════════════
function kl9Minder() {   // Büyükanne'nin örgü minderi (gül-şeftali, düğmeli, püsküllü); taban ortası (0,0)
  return kl9Tuval('minder', -132, -40, 264, 52, q => {
    const yol = () => { q.beginPath(); q.ellipse(0, -14, 122, 24, 0, 0, 6.2832); };
    q.fillStyle = '#d9708f'; q.beginPath(); q.ellipse(0, -8, 124, 22, 0, 0, 6.2832); q.fill();
    yol(); q.fillStyle = kl9Lin(q, 0, -38, 0, 8, [0, '#ffd0dc', 0.5, '#ffa8c0', 1, '#e8809e']); q.fill();
    q.save(); yol(); q.clip();
    q.strokeStyle = 'rgba(200,90,120,0.35)'; q.lineWidth = 0.9;
    for (let y = -36; y < 8; y += 3.6) for (let x = -124 + ((y / 3.6) & 1) * 1.8; x < 124; x += 3.6) { q.beginPath(); q.moveTo(x - 1.2, y - 1); q.lineTo(x, y + 0.6); q.lineTo(x + 1.2, y - 1); q.stroke(); }
    q.strokeStyle = 'rgba(255,240,200,0.7)'; q.lineWidth = 2.4; q.beginPath(); q.ellipse(0, -14, 96, 17, 0, 0, 6.2832); q.stroke();
    q.fillStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.ellipse(-40, -26, 46, 6, -0.05, 0, 6.2832); q.fill();
    q.restore();
    yol(); q.strokeStyle = 'rgba(150,50,80,0.55)'; q.lineWidth = 1.8; q.stroke();
    for (const [x, y] of [[-118, -10], [118, -10]]) { q.strokeStyle = '#ffd27a'; q.lineWidth = 1.6; for (let k = -2; k <= 2; k++) { q.beginPath(); q.moveTo(x, y); q.lineTo(x + k * 1.6 + (x < 0 ? -4 : 4), y + 10); q.stroke(); } q.fillStyle = '#ffe7a8'; q.beginPath(); q.arc(x, y, 3, 0, 6.2832); q.fill(); }
  }, 3);
}
function kl9Fener() {   // direkte asılı yuvarlak kâğıt fener (sıcak ışık); taban (0,0)
  return kl9Tuval('fener', -26, -150, 52, 154, q => {
    q.strokeStyle = '#8a5a34'; q.lineWidth = 5; q.beginPath(); q.moveTo(0, 2); q.lineTo(0, -128); q.quadraticCurveTo(0, -140, 12, -140); q.stroke();
    q.strokeStyle = '#c58a52'; q.lineWidth = 2; q.beginPath(); q.moveTo(-1, 0); q.lineTo(-1, -128); q.stroke();
    q.fillStyle = '#7a4a2a'; q.beginPath(); q.ellipse(0, 1, 11, 4, 0, 0, 6.2832); q.fill();
    q.strokeStyle = '#6a4a30'; q.lineWidth = 1; q.beginPath(); q.moveTo(12, -140); q.lineTo(12, -126); q.stroke();
    q.fillStyle = kl9Rad(q, 10, -108, 2, 12, -104, 22, [0, '#fff6d6', 0.5, '#ffd27a', 1, '#ff9f6a']); q.beginPath(); q.ellipse(12, -106, 15, 19, 0, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(200,110,50,0.6)'; q.lineWidth = 0.9; for (const k of [-8, 0, 8]) { q.beginPath(); q.ellipse(12, -106, Math.abs(k) < 1 ? 0.5 : 15 - Math.abs(k) * 0.6, 19, 0, -1.5708, 1.5708, k < 0); q.stroke(); }
    q.fillStyle = '#b84a5a'; q.fillRect(5, -127, 14, 3.5); q.fillRect(5, -88.5, 14, 3.5);
    q.strokeStyle = '#ff9fc0'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(12, -85); q.lineTo(12, -76); q.stroke(); q.fillStyle = '#ff9fc0'; q.beginPath(); q.arc(12, -75, 2, 0, 6.2832); q.fill();
  }, 3);
}
function kl9Sepet() {   // örgü sepeti: yumaklar ve şişler (Büyükanne örgü örer)
  return kl9Tuval('sepet', -34, -52, 68, 56, q => {
    q.fillStyle = '#7fe0f0'; q.beginPath(); q.arc(-9, -24, 12, 0, 6.2832); q.fill(); q.fillStyle = '#ffd27a'; q.beginPath(); q.arc(10, -22, 11, 0, 6.2832); q.fill(); q.fillStyle = '#b89cff'; q.beginPath(); q.arc(1, -30, 10, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(255,255,255,0.45)'; q.lineWidth = 1; for (const [x, y, r] of [[-9, -24, 12], [10, -22, 11], [1, -30, 10]]) for (let k = 0; k < 3; k++) { q.beginPath(); q.arc(x, y, r * (0.4 + k * 0.2), -2.4 + k, -0.6 + k); q.stroke(); }
    q.strokeStyle = '#c98a4a'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(-4, -26); q.lineTo(18, -48); q.moveTo(2, -24); q.lineTo(24, -42); q.stroke();
    q.fillStyle = '#ff9fc0'; q.beginPath(); q.arc(18, -48, 2.4, 0, 6.2832); q.arc(24, -42, 2.4, 0, 6.2832); q.fill();
    const yol = () => { q.beginPath(); q.moveTo(-28, -20); q.lineTo(28, -20); q.quadraticCurveTo(27, -2, 20, 2); q.lineTo(-20, 2); q.quadraticCurveTo(-27, -2, -28, -20); q.closePath(); };
    yol(); q.fillStyle = kl9Lin(q, 0, -20, 0, 2, [0, '#e0a868', 1, '#a86e3a']); q.fill();
    q.save(); yol(); q.clip(); q.strokeStyle = 'rgba(120,70,30,0.5)'; q.lineWidth = 1.2;
    for (let y = -16; y < 2; y += 4.5) { q.beginPath(); q.moveTo(-30, y); q.lineTo(30, y); q.stroke(); } for (let x = -26; x < 30; x += 6) { q.beginPath(); q.moveTo(x, -20); q.lineTo(x + 1, 2); q.stroke(); }
    q.restore(); yol(); q.strokeStyle = 'rgba(100,56,24,0.65)'; q.lineWidth = 1.4; q.stroke();
    q.fillStyle = '#f0c088'; q.beginPath(); q.ellipse(0, -20, 29, 4, 0, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(100,56,24,0.6)'; q.lineWidth = 1; q.stroke();
  }, 3);
}

// ═══════════════════════════════ BÜYÜKANNE: sade yedek çizim (buyukanne.js yokken) ═══════════════════════════════
// Sola bakar (yon −1); taban (0,0); s = 1 ≈ 250 birim boy (otururken). Pırıl ailesinin çizgisi: leylak gövde, fıstık yeşili çizgili
// karın, koyu yeşil yumuşak ibik, açık yeşil yüzgeç kulak; gözlük, gül rengi örgü atkı, gümüş kıvırcık perçem.
const KL9_BK = 'rgba(64,42,112,0.6)';
function kl9BnGovde() {
  return kl9Tuval('bn_govde', -110, -200, 290, 206, q => {
    // kuyruk: sağda kıvrılır, ucunda yumuşak yaprak
    q.strokeStyle = KL9_BK; q.lineWidth = 34; q.beginPath(); q.moveTo(50, -20); q.bezierCurveTo(110, -6, 160, -14, 158, -52); q.stroke();
    q.strokeStyle = '#9c86dc'; q.lineWidth = 30; q.stroke();
    q.strokeStyle = '#b6a4ee'; q.lineWidth = 12; q.beginPath(); q.moveTo(60, -26); q.bezierCurveTo(110, -16, 150, -22, 150, -50); q.stroke();
    q.fillStyle = '#3f9f6f'; q.beginPath(); q.moveTo(150, -62); q.quadraticCurveTo(140, -96, 162, -104); q.quadraticCurveTo(178, -82, 166, -60); q.closePath(); q.fill(); q.strokeStyle = KL9_BK; q.lineWidth = 1.6; q.stroke();
    // gövde
    const yol = () => { q.beginPath(); q.moveTo(-6, -184); q.bezierCurveTo(64, -186, 100, -120, 96, -66); q.bezierCurveTo(94, -20, 60, -2, 8, -2); q.bezierCurveTo(-50, -2, -88, -22, -88, -70); q.bezierCurveTo(-88, -128, -64, -182, -6, -184); q.closePath(); };
    yol(); q.fillStyle = kl9Lin(q, -88, -120, 96, -60, [0, '#c2b2f4', 0.45, '#a690e2', 1, '#8068c6']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = kl9Rad(q, -30, -140, 4, -30, -140, 90, [0, 'rgba(240,232,255,0.5)', 1, 'rgba(240,232,255,0)']); q.fillRect(-110, -200, 220, 206);
    q.fillStyle = kl9Rad(q, 70, -30, 4, 70, -30, 90, [0, 'rgba(40,20,90,0.3)', 1, 'rgba(40,20,90,0)']); q.fillRect(-110, -200, 220, 206);
    // çizgili karın (fıstık yeşili)
    q.fillStyle = kl9Lin(q, 0, -160, 0, -10, [0, '#e8fab8', 1, '#c8ec8a']); q.beginPath(); q.ellipse(-26, -84, 54, 76, 0.05, 0, 6.2832); q.fill();
    q.strokeStyle = 'rgba(140,190,90,0.7)'; q.lineWidth = 2.4;
    for (let i = 0; i < 6; i++) { const y = -140 + i * 22, w = 48 * Math.sqrt(Math.max(0, 1 - Math.pow((y + 84) / 78, 2))); q.beginPath(); q.moveTo(-26 - w, y); q.quadraticCurveTo(-26, y + 7, -26 + w, y); q.stroke(); }
    q.restore();
    yol(); q.strokeStyle = KL9_BK; q.lineWidth = 2.6; q.stroke();
    // ayaklar (tombul, pençesiz: yuvarlak parmak tümsekleri)
    for (const [x, w] of [[-52, 28], [34, 26]]) {
      q.fillStyle = '#9682d8'; q.beginPath(); q.ellipse(x, -9, w, 12, 0, 0, 6.2832); q.fill(); q.strokeStyle = KL9_BK; q.lineWidth = 2; q.stroke();
      q.fillStyle = '#cdbff8'; for (let k = -1; k <= 1; k++) { q.beginPath(); q.arc(x - w * 0.55 + (k + 1) * 4 - 6, -6 + Math.abs(k), 4.2, 0, 6.2832); q.fill(); }
    }
  }, 3);
}
function kl9BnKol() {   // ön kol (omuz 0,0 → pati aşağı); karnın üstünde durur
  return kl9Tuval('bn_kol', -18, -10, 36, 62, q => {
    q.beginPath(); q.moveTo(-12, 0); q.bezierCurveTo(-16, 18, -14, 36, -6, 46); q.quadraticCurveTo(4, 52, 12, 44); q.bezierCurveTo(14, 30, 14, 14, 12, 0); q.quadraticCurveTo(0, -8, -12, 0); q.closePath();
    q.fillStyle = kl9Lin(q, -14, 0, 14, 0, [0, '#c2b2f4', 1, '#9078d6']); q.fill(); q.strokeStyle = KL9_BK; q.lineWidth = 2; q.stroke();
    q.fillStyle = '#d6caf9'; for (let k = 0; k < 3; k++) { q.beginPath(); q.arc(-5 + k * 6, 46 + (k === 1 ? 1.5 : 0), 3.6, 0, 6.2832); q.fill(); }
  }, 3);
}
function kl9BnKanat() {   // katlanmış kanat (omuz kökü 0,0; yukarı-sağa); kanat zarı açık leylak, kemikleri yumuşak kavisler
  return kl9Tuval('bn_kanat', -16, -120, 150, 140, q => {
    const yol = () => { q.beginPath(); q.moveTo(0, 0); q.bezierCurveTo(10, -60, 60, -110, 120, -108); q.quadraticCurveTo(110, -86, 126, -70); q.quadraticCurveTo(100, -60, 112, -36);
      q.quadraticCurveTo(84, -34, 90, -8); q.quadraticCurveTo(56, -18, 40, 12); q.quadraticCurveTo(20, 10, 0, 0); q.closePath(); };
    yol(); q.fillStyle = kl9Lin(q, 0, 0, 120, -100, [0, '#a690e2', 0.5, '#c8b8f6', 1, '#e4dbff']); q.fill();
    q.save(); yol(); q.clip(); q.strokeStyle = 'rgba(120,96,200,0.55)'; q.lineWidth = 2.4;
    for (const [x, y] of [[118, -104], [120, -70], [108, -38], [86, -10]]) { q.beginPath(); q.moveTo(6, -6); q.quadraticCurveTo(x * 0.45, y * 0.6 - 10, x, y); q.stroke(); }
    q.restore(); yol(); q.strokeStyle = KL9_BK; q.lineWidth = 2.2; q.stroke();
  }, 3);
}
function kl9BnBas() {   // baş (merkez 0,0, sola bakar): burun, yanaklar, ibik, yüzgeç kulak, gümüş perçem (gözler/gözlük/ağız karede)
  return kl9Tuval('bn_bas', -110, -80, 190, 150, q => {
    // ibik (3 yumuşak dilim) ve yüzgeç kulak
    q.fillStyle = '#2e8f6f'; q.strokeStyle = KL9_BK; q.lineWidth = 2;
    for (const [x, y, r] of [[-24, -50, 15], [2, -54, 17], [28, -46, 15]]) { q.beginPath(); q.ellipse(x, y, r * 0.8, r, (x / 60), 0, 6.2832); q.fill(); q.stroke(); }
    q.fillStyle = '#9fe6b8'; q.beginPath(); q.moveTo(36, -14); q.quadraticCurveTo(70, -40, 74, -12); q.quadraticCurveTo(64, -2, 72, 10); q.quadraticCurveTo(52, 6, 36, 6); q.closePath(); q.fill(); q.stroke();
    q.strokeStyle = 'rgba(46,143,111,0.6)'; q.lineWidth = 1.4; for (const k of [-8, 0, 7]) { q.beginPath(); q.moveTo(40, -3); q.lineTo(66, k - 4); q.stroke(); }
    // baş + burun
    const yol = () => { q.beginPath(); q.moveTo(0, -48); q.bezierCurveTo(36, -48, 52, -22, 50, 4); q.bezierCurveTo(48, 34, 22, 48, -10, 48); q.bezierCurveTo(-40, 50, -78, 46, -94, 26);
      q.bezierCurveTo(-106, 10, -98, -12, -76, -16); q.bezierCurveTo(-62, -40, -32, -48, 0, -48); q.closePath(); };
    yol(); q.fillStyle = kl9Lin(q, -90, -40, 50, 40, [0, '#d4c8fa', 0.5, '#b4a2ee', 1, '#8e78d2']); q.fill();
    q.save(); yol(); q.clip();
    q.fillStyle = '#e4dcff'; q.beginPath(); q.ellipse(-70, 20, 30, 20, 0, 0, 6.2832); q.fill();   // burun altı açık
    q.fillStyle = 'rgba(255,255,255,0.35)'; q.beginPath(); q.ellipse(-20, -30, 26, 10, -0.2, 0, 6.2832); q.fill();
    q.restore();
    yol(); q.strokeStyle = KL9_BK; q.lineWidth = 2.6; q.stroke();
    q.fillStyle = 'rgba(80,50,130,0.6)'; q.beginPath(); q.ellipse(-92, 6, 3, 4.4, 0.3, 0, 6.2832); q.fill(); q.beginPath(); q.ellipse(-80, 2, 2.6, 4, 0.3, 0, 6.2832); q.fill();   // burun delikleri
    q.fillStyle = 'rgba(255,128,170,0.5)'; q.beginPath(); q.ellipse(-36, 18, 13, 8, 0, 0, 6.2832); q.fill(); q.beginPath(); q.ellipse(14, 16, 10, 7, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(-40, 15, 2, 0, 6.2832); q.arc(11, 13, 1.6, 0, 6.2832); q.fill();
    // gümüş kıvırcık perçem (ibiğin önünde)
    q.strokeStyle = 'rgba(120,110,170,0.5)'; q.lineWidth = 2; q.fillStyle = '#f6f4ff';
    for (const [x, y, r] of [[-18, -44, 9], [-6, -48, 10], [8, -46, 9], [-28, -38, 7]]) { q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.stroke(); }
    for (const [x, y, r] of [[-18, -44, 9], [-6, -48, 10], [8, -46, 9], [-28, -38, 7]]) { q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
    q.fillStyle = '#d8d2f0'; for (const [x, y, r] of [[-15, -42, 4], [-3, -45, 4.5], [10, -43, 4]]) { q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
  }, 4);
}
function kl9BnGozluk() {
  return kl9Tuval('bn_gozluk', -60, -20, 84, 34, q => {
    for (const [x, r] of [[-38, 13], [-2, 15]]) { q.fillStyle = 'rgba(255,255,255,0.14)'; q.beginPath(); q.arc(x, -4, r, 0, 6.2832); q.fill(); q.strokeStyle = '#d29b3a'; q.lineWidth = 2.6; q.stroke();
      q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 1.6; q.beginPath(); q.arc(x, -4, r - 3.5, Math.PI * 1.1, Math.PI * 1.45); q.stroke(); }
    q.strokeStyle = '#d29b3a'; q.lineWidth = 2.2; q.beginPath(); q.moveTo(-25, -6); q.quadraticCurveTo(-20, -11, -17, -6); q.stroke();
    q.beginPath(); q.moveTo(13, -6); q.lineTo(22, -9); q.stroke();
  }, 4);
}
function kl9BnAtki() {   // gül rengi örgü atkı (boyun halkası + sarkan ucu, püsküllü); boyun ortası (0,0)
  return kl9Tuval('bn_atki', -70, -26, 130, 96, q => {
    const yol = () => { q.beginPath(); q.moveTo(-60, -6); q.quadraticCurveTo(-4, -26, 56, -8); q.quadraticCurveTo(58, 8, 52, 16); q.quadraticCurveTo(-4, 2, -58, 14); q.quadraticCurveTo(-64, 4, -60, -6); q.closePath(); };
    const uc = () => { q.beginPath(); q.moveTo(18, 6); q.quadraticCurveTo(30, 30, 24, 60); q.lineTo(44, 62); q.quadraticCurveTo(46, 30, 40, 8); q.closePath(); };
    for (const f of [uc, yol]) {
      f(); q.fillStyle = kl9Lin(q, 0, -20, 0, 60, [0, '#ffb8cc', 0.6, '#ff8fb0', 1, '#e86a92']); q.fill();
      q.save(); f(); q.clip(); q.strokeStyle = 'rgba(190,60,100,0.35)'; q.lineWidth = 0.9;
      for (let y = -24; y < 66; y += 3.4) for (let x = -64 + ((y / 3.4) & 1) * 1.7; x < 60; x += 3.4) { q.beginPath(); q.moveTo(x - 1.1, y - 0.9); q.lineTo(x, y + 0.5); q.lineTo(x + 1.1, y - 0.9); q.stroke(); }
      q.strokeStyle = '#fff0c8'; q.lineWidth = 2.6; q.beginPath(); q.moveTo(-60, 2); q.quadraticCurveTo(-4, -16, 58, 2); q.stroke(); q.beginPath(); q.moveTo(20, 40); q.lineTo(45, 40); q.stroke();
      q.restore(); f(); q.strokeStyle = 'rgba(150,40,80,0.55)'; q.lineWidth = 1.6; q.stroke();
    }
    q.strokeStyle = '#ffd27a'; q.lineWidth = 1.8; for (let k = 0; k < 6; k++) { q.beginPath(); q.moveTo(25 + k * 3.6, 61); q.lineTo(24 + k * 3.8, 70); q.stroke(); }
  }, 4);
}
// karede: gözler (açık / mutlu kavis / kırpma / iç çekişte yarı kapalı), ağız, iki minik diş
const KL9_BNY = { boynX: 0, boynY: 0, gogusX: 0, gogusY: 0, gen: 150 };
function kl9BnYedek(c, x, y, s, t, o) {
  const yon = o.yon || -1, poz = o.poz || 'otur', kal = poz === 'otur' ? clamp(o.kalk || 0, 0, 1) : 1, gul = clamp(o.gulumse || 0, 0, 1);
  const kucak = poz === 'kucak', ucus = poz === 'ucus', kan = clamp(o.kanat || 0, 0, 1), ic = clamp(o.icCek || 0, 0, 1);
  const nefes = Math.sin(t * 1.6) * 1.6 + ic * 5, yuk = smooth(kal) * 26, eg = kucak ? -0.1 : 0;
  const M = c.getTransform();
  c.translate(x, y); c.scale(s * -yon, s);   // yerel çizim sola bakar; yon +1 → aynala
  if (eg) c.rotate(-eg);
  const ar = o.katman !== 'on', on = o.katman !== 'arka';
  const gx = -22, gy = -122 - yuk - nefes * 0.4;
  if (ar) {
    if (!kucak) kl9Koy(c, kl9Golge(), 4, 0);
    // arka kanat (katlanmış → açık/çırpan)
    const ka = ucus ? -0.9 + Math.sin(t * 7) * 0.65 * kan : -0.15 - kan * 0.9 - (kucak ? 0.4 : 0);
    c.save(); c.translate(52, -150 - yuk - nefes * 0.3); c.rotate(ka); c.globalAlpha = 0.85; kl9Koy(c, kl9BnKanat(), 0, 0); c.restore();
    if (yuk > 0.5) { c.fillStyle = '#9682d8'; c.fillRect(-60, -16 - yuk, 24, yuk + 4); c.fillRect(26, -16 - yuk, 22, yuk + 4); c.strokeStyle = KL9_BK; c.lineWidth = 2; c.strokeRect(-60, -16 - yuk, 24, yuk + 4); c.strokeRect(26, -16 - yuk, 22, yuk + 4); }
    c.save(); c.translate(0, -yuk); c.scale(1, 1 + nefes * 0.004); kl9Koy(c, kl9BnGovde(), 0, 0); c.restore();
    if (yuk > 0.5) { const G = kl9BnGovde(); c.save(); c.beginPath(); c.rect(-110, -24, 290, 30); c.clip(); kl9Koy(c, G, 0, 0); c.restore(); }   // ayaklar yerde kalsın
    // baş, atkı, yüz
    const hx = -40 + (o.bakX || 0) * 3 * yon * -1, hy = -206 - yuk - nefes * 0.6 + ic * 4 + (o.bakY || 0) * 3, ha = ic * 0.08 + (kucak ? 0.12 : 0) + Math.sin(t * 0.8) * 0.02;
    c.save(); c.translate(hx, hy); c.rotate(-ha);
    kl9Koy(c, kl9BnBas(), 0, 0);
    // gözler (uzak göz küçük); gülümserken mutlu kavis
    const kirp = ((t + 0.7) % 4.3) < 0.13, mutlu = gul > 0.72, kapak = ic > 0.3 ? 0.45 * ic : 0;
    for (const [ex, er] of [[-58, 8], [-22, 10]]) {
      if (mutlu || kirp) { c.strokeStyle = '#3a2457'; c.lineWidth = 2.6; c.beginPath(); if (mutlu) c.arc(ex, -2, er * 0.75, Math.PI * 1.15, Math.PI * 1.85); else { c.moveTo(ex - er * 0.8, -4); c.quadraticCurveTo(ex, 0, ex + er * 0.8, -4); } c.stroke(); }
      else {
        c.fillStyle = '#ffffff'; c.beginPath(); c.ellipse(ex, -4, er * 0.82, er, 0, 0, 6.2832); c.fill();
        c.fillStyle = '#2e6b4f'; c.beginPath(); c.arc(ex - 1.5 + (o.bakX || 0) * 1.5 * -yon, -3 + (o.bakY || 0) * 1.5, er * 0.62, 0, 6.2832); c.fill();
        c.fillStyle = '#16302a'; c.beginPath(); c.arc(ex - 1.5 + (o.bakX || 0) * 1.5 * -yon, -3 + (o.bakY || 0) * 1.5, er * 0.34, 0, 6.2832); c.fill();
        c.fillStyle = '#ffffff'; c.beginPath(); c.arc(ex - er * 0.35, -er * 0.5, er * 0.26, 0, 6.2832); c.fill(); c.beginPath(); c.arc(ex + er * 0.2, er * 0.05, er * 0.12, 0, 6.2832); c.fill();
        if (kapak > 0.01) { c.fillStyle = '#b4a2ee'; c.beginPath(); c.ellipse(ex, -4 - er * (1 - kapak * 1.2), er * 0.9, er * kapak * 1.2, 0, 0, 6.2832); c.fill(); }
      }
    }
    kl9Koy(c, kl9BnGozluk(), 0, 0);
    c.strokeStyle = 'rgba(200,196,230,0.95)'; c.lineWidth = 2.6;   // gümüş kaşlar (iç çekerken ortası hafif kalkık: dalgın, üzgün değil)
    for (const [ex, w] of [[-58, 7], [-22, 9]]) { c.beginPath(); c.moveTo(ex - w, -20 + ic * 1.5); c.quadraticCurveTo(ex, -24 - gul * 2, ex + w, -20 - ic * 1.5); c.stroke(); }
    // ağız: gülümseme · konuşma · iç çekiş (küçük yuvarlak "ıhh")
    const kon = clamp(o.konus || 0, 0, 1), ac = kon * (0.5 + 0.5 * Math.abs(Math.sin(t * 11))), mx = -66, my = 26;
    if (ic > 0.5 && kon < 0.1) { c.fillStyle = '#6a3060'; c.beginPath(); c.ellipse(mx + 4, my, 3.2, 2.6 + ic, 0, 0, 6.2832); c.fill(); }
    else {
      c.strokeStyle = '#4a2a5a'; c.lineWidth = 2.4; c.beginPath(); c.moveTo(mx - 14, my - 2); c.quadraticCurveTo(mx, my + 6 + gul * 6, mx + 16, my - 3); c.stroke();
      if (ac > 0.05 || gul > 0.6) { const h = Math.max(ac * 8, (gul - 0.6) * 12); c.fillStyle = '#c24a72'; c.beginPath(); c.moveTo(mx - 10, my); c.quadraticCurveTo(mx, my + 4 + h + gul * 4, mx + 12, my - 1); c.quadraticCurveTo(mx, my + 3, mx - 10, my); c.fill();
        c.fillStyle = '#ffffff'; c.fillRect(mx - 5, my - 0.5, 3.6, 3.6); c.fillRect(mx + 2, my - 0.8, 3.6, 3.6); }
    }
    c.restore();
    kl9Koy(c, kl9BnAtki(), -24, -160 - yuk - nefes * 0.5);
    // ön kollar (karnın üstünde; kucakta açık)
    if (!kucak) for (const [ax, aa] of [[-62, 0.15 + kan * 0.3], [12, -0.1]]) { c.save(); c.translate(ax, -128 - yuk - nefes * 0.4); c.rotate(aa); kl9Koy(c, kl9BnKol(), 0, 0); c.restore(); }
  }
  if (on && kucak) {   // kucak: ön kanat Feza'nın ve Pırıl'ın önünden sarar
    c.save(); c.translate(-4, -150 - yuk); c.scale(-1, 1); c.rotate(-0.9 - Math.sin(t * 2) * 0.03); kl9Koy(c, kl9BnKanat(), 0, 0); c.restore();
    c.save(); c.translate(-62, -128 - yuk); c.rotate(0.9); kl9Koy(c, kl9BnKol(), 0, 0); c.restore();
  }
  c.setTransform(M);
  // dönüş: göğüs/boyun noktaları (çağıranın koordinatında)
  const ea = eg, cs = Math.cos(ea), sn = Math.sin(ea);
  const tx = (px, py) => x + (px * cs + py * sn) * s * -yon, ty = (px, py) => y + (-px * sn + py * cs) * s;
  KL9_BNY.gogusX = tx(gx, gy); KL9_BNY.gogusY = ty(gx, gy); KL9_BNY.boynX = tx(gx, gy - 60); KL9_BNY.boynY = ty(gx, gy - 60); KL9_BNY.gen = 120 * s;
  return KL9_BNY;
}
function kl9BnCiz(c, x, y, s, t, o) {   // buyukanne.js varsa onu, yoksa yedeği çizer; göğüs noktası döner (yoksa null)
  if (typeof buyukanneCiz === 'function') {
    try { const r = buyukanneCiz(c, x, y, s, t, o); return r && isFinite(r.gogusX) && isFinite(r.gogusY) ? r : null; }
    catch (e) { if (!kl9BnCiz.hata) { kl9BnCiz.hata = true; console.warn('[kolye] buyukanneCiz hata, yedek çizim', e); } }
  }
  return kl9BnYedek(c, x, y, s, t, o);
}
// pul çizici (ortak): (x, y) merkez, r yarıçap (KL9_PR = 14 doğal), bicim 0..4 ya da ad, parla 0..1
function kolyePulCiz(c, x, y, r, bicim, t, parla) {
  const b = typeof bicim === 'string' ? Math.max(0, KOLYE_BICIM.indexOf(bicim)) : (bicim | 0) % 5, k = r / KL9_PR;
  if (parla > 0.01) kl9Isik(c, KOLYE_RENK[b], x, y, r * 3.2, parla * 0.7);
  kl9KoyS(c, kl9PulSpr(b), x, y, k);
}
// tam kolye çizici (ortak): zincir + beş biçimli yuva + takılı pullar. (x, y) = buyukanneCiz'in göğüs noktası (gogusX/Y), gen = göğüs
// genişliği (dönüşteki gen), dolu = takılı pul sayısı 0..5 (ilk n) ya da maske (5 bit; maske verilirse o), isik 0..1. Mini oyundaki
// kolyenin aynısı: buyukanne.js / yuva.js kendi kolyelerini çizeceklerken bunu çağırırsa kolye bölüm boyunca aynı görünür.
function kolyeTamCiz(c, x, y, gen, t, isik, dolu, maske) {
  const kx = gen > 0 ? clamp(gen / 96, 0.9, 1.35) : 1, is = clamp(+isik || 0, 0, 1), m = maske != null ? maske | 0 : (1 << clamp(dolu | 0, 0, 5)) - 1;
  if (is > 0.01) { kl9Isik(c, '#fff3c4', x, y - 10, 120 * kx, 0.4 * is); kl9Isik(c, '#d9c8ff', x, y - 10, 70 * kx, 0.3 * is); }
  const Z = kl9ZincirSpr(); c.drawImage(Z, x + Z.x0 * kx, y + Z.y0, Z.w * kx, Z.h);
  for (let b = 0; b < 5; b++) {
    const yx = x + KL9_YUVA[b][0] * kx, yy = y + KL9_YUVA[b][1];
    kl9Koy(c, kl9YuvaSpr(b), yx, yy);
    if (m & (1 << b)) kolyePulCiz(c, yx, yy, KL9_PR, b, t, 0.25 + 0.45 * is + 0.15 * Math.sin(t * 2.4 + b * 1.2));
  }
}

function kl9Hazirla() {
  for (let b = 0; b < 5; b++) { kl9PulSpr(b); kl9YuvaSpr(b); kl9OtSpr(b); }
  kl9ZincirSpr(); kl9IsiltiSpr(); kl9KalpSpr(); kl9NotaSpr(); kl9Golge(); kl9Minder(); kl9Fener(); kl9Sepet();
  if (typeof buyukanneCiz !== 'function') { kl9BnGovde(); kl9BnKol(); kl9BnKanat(); kl9BnBas(); kl9BnGozluk(); kl9BnAtki(); }
}

// ═══════════════════════════════ parçacıklar (sabit havuz) ═══════════════════════════════
// tip 1 ışık tozu · 2 kalp · 3 ışıltı · 4 nota · 6 iç çekiş bulutçuğu (yumuşak, yükselen)
const KL9_TZ = []; for (let i = 0; i < 150; i++) KL9_TZ.push({ a: false, tip: 1, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#ffffff', ph: 0 });
function kl9Toz(tip, x, y, vx, vy, max, s, col) {
  for (let i = 0; i < KL9_TZ.length; i++) { const p = KL9_TZ[i]; if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.ph = Math.random() * 6.2832; return p; } }
  return null;
}
const KL9_HL = []; for (let i = 0; i < 6; i++) KL9_HL.push({ a: false, x: 0, y: 0, t: 0, max: 1, r: 60, col: '#ffffff' });   // yayılan ışık halkaları
function kl9Halka(x, y, r, max, col) { for (const h of KL9_HL) if (!h.a) { h.a = true; h.x = x; h.y = y; h.r = r; h.max = max; h.t = 0; h.col = col; return h; } return null; }
function kl9IsikSac(x, y, n, hiz, cols) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); kl9Toz(i % 3 ? 1 : 3, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.8 + Math.random() * 0.7, i % 3 ? 5 + Math.random() * 6 : 6 + Math.random() * 4, cols[i % cols.length]); } }
function kl9EfektAdim(dt) {
  for (let i = 0; i < KL9_TZ.length; i++) {
    const p = KL9_TZ[i]; if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 1) { p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) - 12 * dt; }
    else if (p.tip === 2) { p.vy = -34; p.vx = Math.sin(p.t * 3 + p.ph) * 16; }
    else if (p.tip === 3) { p.vx *= Math.exp(-dt * 3); p.vy *= Math.exp(-dt * 3); }
    else if (p.tip === 4) { p.vy = -30; p.vx = Math.sin(p.t * 2.6 + p.ph) * 14 + 4; }
    else if (p.tip === 6) { p.vx *= Math.exp(-dt * 0.9); p.vy = p.vy * Math.exp(-dt * 0.8) - 6 * dt; }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
  for (const h of KL9_HL) if (h.a) { h.t += dt; if (h.t >= h.max) h.a = false; }
}
function kl9TozCiz(c) {
  const a0 = c.globalAlpha, KA = kl9KalpSpr(), NO = kl9NotaSpr(), IS = kl9IsiltiSpr();
  for (const h of KL9_HL) if (h.a) { const v = h.t / h.max, r = h.r * (0.25 + v * 1.1); c.globalAlpha = a0 * 0.7 * (1 - v) * (1 - v); c.strokeStyle = h.col; c.lineWidth = 3 * (1 - v) + 1; c.beginPath(); c.ellipse(h.x, h.y, r, r * 0.8, 0, 0, 6.2832); c.stroke(); }
  for (let i = 0; i < KL9_TZ.length; i++) {
    const p = KL9_TZ[i]; if (!p.a) continue; const u = p.t / p.max, f = 1 - u;
    if (p.tip === 1) { c.globalAlpha = a0; kl9Isik(c, p.col, p.x, p.y, p.s * (0.6 + f * 0.6), f * 0.9); c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.1, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); kl9KoyS(c, KA, p.x, p.y, (p.s || 1) * (0.8 + u * 0.4)); }
    else if (p.tip === 3) { const k = p.s / 9 * (0.7 + 0.3 * Math.sin(p.t * 14 + p.ph)) * (u < 0.2 ? u * 5 : 1); c.globalAlpha = a0 * f; kl9KoyS(c, IS, p.x, p.y, k); }
    else if (p.tip === 4) { c.globalAlpha = a0 * Math.min(1, f * 1.6) * Math.min(1, u * 5); const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(Math.sin(p.t * 3 + p.ph) * 0.25); kl9Koy(c, NO, 0, 0); c.setTransform(M); }
    else if (p.tip === 6) { c.globalAlpha = a0; kl9Isik(c, p.col, p.x, p.y, p.s * (0.6 + u * 0.9), Math.sin(u * Math.PI) * 0.55); }
  }
  c.globalAlpha = a0;
}

// ═══════════════════════════════ oyun durumu ═══════════════════════════════
function kl9Yuva(o, b) { const k = o.kl, Y = KL9_YUVA[b]; return [k.gx + Y[0] * k.kx, k.gy + Y[1]]; }
function kl9Siradaki(o) {   // ipucu/yardım için: Feza'ya en yakın bekleyen pul
  const k = o.kl; let en = null;
  for (const p of k.pul) if (p.durum === 'yer' || p.durum === 'geri') { if (!en || p.d.fx < en.d.fx) en = p; }
  return en;
}
function kl9Kullanici(o) { const k = o.kl; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
function kl9OyunBasla(o) {   // pullar sırayla "buradayız" diye parlayıp hoplar
  const k = o.kl; k.faz = 'oyun'; k.fT = 0; k.idle = 0;
  k.pul.forEach((p, i) => { p.selam = -0.2 - i * 0.28; });
}
function kl9PulUc(o, p, kaynak) {   // pul kendi yuvasına uçar (dokunuş, yakalama, bırakma, Pırıl)
  if (!p || p.durum === 'uc' || p.durum === 'takili') return false;
  const [yx, yy] = kl9Yuva(o, p.b), d = Math.hypot(yx - p.x, yy - p.y);
  if (KOLYE.tut === p) KOLYE.tut = null;
  p.durum = 'uc'; p.t = 0; p.x1 = p.x; p.y1 = p.y; p.s1 = p.s; p.r1 = p.rot; p.yardim = kaynak === 'piril';
  p.sure = kaynak === 'yakala' ? 0.32 : kaynak === 'piril' ? 0.45 : clamp(d / 520, 0.55, 0.95); p.yay = kaynak === 'yakala' ? 6 : kaynak === 'piril' ? 12 : Math.min(110, 30 + d * 0.22);
  kl9IsikSac(p.x, p.y, 9, 80, [KOLYE_RENK[p.b], '#ffffff', KL9_ACIK[p.b]]); kl9Sfx('parilti', 0.4);
  o.kl.bn.bakT = 1.4; o.kl.yuvaVurgu[p.b] = 1;
  return true;
}
function kl9PulTakildi(o, p) {   // pul yuvasına oturdu: ışık, nota, Büyükanne gülümser
  const k = o.kl; k.n++; const n = k.n, [yx, yy] = kl9Yuva(o, p.b);
  p.durum = 'takili'; p.t = 0; k.yuvaFlas[p.b] = 1;
  kl9Halka(yx, yy, 46, 0.8, KL9_ACIK[p.b]);
  kl9IsikSac(yx, yy, 14, 120, [KOLYE_RENK[p.b], '#ffffff', '#fff3c4']);
  kl9Toz(4, yx + 10, yy - 16, 0, -30, 2.2, 1, '#fff4d6');
  for (let i = 0; i < 2; i++) kl9Toz(2, k.bnX - 40 + i * 30, k.gy - 120 - i * 10, 0, -34, 2.2 + i * 0.3, 1, '#ff9fc0');
  const B = k.bn; B.gulT = 2.2; B.sevT = 0.9;
  k.fzSev = 1.3; k.pr.kirp = 1.1;
  kl9Sfx('kolyePul', n - 1); k.gulBek = 0.28;
  OLAY.emit('kolyePul', { o, n, top: 5, bicim: KOLYE_BICIM[p.b], yardim: !!p.yardim });
  if (n >= 5) k.bitBek = 0.9;
}
function kl9YanlisYuva(o, p, j) {   // yanlış yuvaya bırakıldı: yuva "ıh-ıh" sallanır, doğrusu parlar, pul çimendeki yerine süzülür
  const k = o.kl; k.yuvaHayir[j] = 1; k.yuvaVurgu[p.b] = 1.6;
  p.durum = 'geri'; p.t = 0; p.x1 = p.x; p.y1 = p.y; p.zip = 1;
  kl9IsikSac(p.x, p.y, 5, 40, [KOLYE_RENK[p.b], '#ffffff']); kl9Sfx('parilti', 0.2);
  k.bn.bakT = 1.2; k.bn.hmT = 1.1;
  if (k.t - k.ipucuT > 9) { k.ipucuT = k.t; OLAY.emit('kolyeIpucu', { o, yanlis: true }); }   // Pırıl: "Pulun biçimine bak!" (seyrek)
}
function kl9PulAdim(o, dt) {
  const k = o.kl;
  let yakin = -1;
  for (const p of k.pul) {
    const fx = o.x + p.d.fx, fy = o.y + p.d.fy, sY = KL9_CIM;
    p.zip = Math.max(0, p.zip - dt * 1.4); p.sal = Math.max(0, p.sal - dt * 1.6);
    if (p.selam < 0.9) { p.selam += dt; if (p.selam > 0 && p.selam - dt <= 0) { kl9IsikSac(p.x, p.y - 4, 5, 40, [KOLYE_RENK[p.b], '#ffffff']); kl9Sfx('parilti', 0.18); } }
    if (p.durum === 'yer') {
      const tt = k.t, hop = p.selam > 0 && p.selam < 0.55 ? Math.sin(p.selam / 0.55 * Math.PI) : 0, w = Math.sin(p.sal * 9) * p.sal;
      p.x = fx + w * 5; p.y = fy - hop * 26 - p.sal * 16 + Math.sin(tt * 1.3 + p.i * 1.7) * 1.2;
      p.s += (sY + hop * 0.12 - p.s) * (1 - Math.exp(-dt * 6)); p.rot = p.d.rot * (1 - hop) + w * 0.3 + Math.sin(tt * 0.9 + p.i) * 0.04;
    } else if (p.durum === 'tut') {
      const kk = 1 - Math.exp(-dt * 20), ox = p.x; p.x += (KOLYE.hx - p.x) * kk; p.y += (KOLYE.hy - p.y) * kk;
      p.s += (sY * 1.12 - p.s) * (1 - Math.exp(-dt * 10)); p.rot += (clamp((p.x - ox) / Math.max(dt, 1e-3) * 0.0012, -0.5, 0.5) - p.rot) * (1 - Math.exp(-dt * 8));
      if (Math.abs(p.x - ox) > 0.4 && Math.random() < dt * 22) kl9Toz(Math.random() < 0.3 ? 3 : 1, p.x + (Math.random() - 0.5) * 26, p.y + (Math.random() - 0.5) * 26, 0, 10, 0.7, 5 + Math.random() * 3, KOLYE_RENK[p.b]);   // ışık izi
      // en yakın yuva: kendi yuvasıysa yakalar; başka yuvanın üstünden geçerken o yuva hafifçe başını sallar (bir kez), doğrusu parlar
      let ej = -1, ed = Infinity; for (let j = 0; j < 5; j++) { const [jx, jy] = kl9Yuva(o, j), dj = Math.hypot(jx - p.x, jy - p.y); if (dj < ed) { ed = dj; ej = j; } }
      if (ej === p.b && ed < KL9_YAKALA) { kl9PulUc(o, p, 'yakala'); continue; }
      yakin = p.b;
      const ust = ej !== p.b && ed < KL9_YANLIS ? ej : -1;
      if (ust >= 0 && ust !== p.ust) { k.yuvaHayir[ust] = Math.max(k.yuvaHayir[ust], 0.6); k.yuvaVurgu[p.b] = Math.max(k.yuvaVurgu[p.b], 1); }
      p.ust = ust;
    } else if (p.durum === 'geri') {
      p.t += dt; const u = clamp(p.t / 0.85, 0, 1), e = smooth(u);
      p.x = lerp(p.x1, fx, e); p.y = lerp(p.y1, fy, e) - Math.sin(u * Math.PI) * 40; p.s += (sY - p.s) * (1 - Math.exp(-dt * 6)); p.rot = lerp(p.rot, p.d.rot, 1 - Math.exp(-dt * 5)) + Math.sin(p.t * 14) * 0.06 * (1 - u);
      if (u >= 1) { p.durum = 'yer'; p.t = 0; p.sal = 0.6; }
    } else if (p.durum === 'pir') {
      const pr = k.pr; p.x = pr.x + pr.f * 3; p.y = pr.y + 26; p.s += (1.05 - p.s) * (1 - Math.exp(-dt * 6)); p.rot = Math.sin(k.t * 5) * 0.15;
    } else if (p.durum === 'uc') {
      p.t += dt; const u = clamp(p.t / p.sure, 0, 1), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2, [tx, ty] = kl9Yuva(o, p.b);
      p.x = lerp(p.x1, tx, e); p.y = lerp(p.y1, ty, e) - Math.sin(u * Math.PI) * p.yay; p.s = lerp(p.s1, 1, e); p.rot = lerp(p.r1, 0, e) + Math.sin(u * Math.PI) * 0.6;
      if (u >= 1) kl9PulTakildi(o, p);
    } else if (p.durum === 'takili') {
      p.t += dt; const [tx, ty] = kl9Yuva(o, p.b), pop = p.t < 0.35 ? Math.sin(p.t / 0.35 * Math.PI) * 0.28 : 0;
      p.x = tx; p.y = ty; p.s = 1 + pop; p.rot = Math.sin(p.t * 18) * 0.12 * Math.max(0, 1 - p.t * 2);
    }
  }
  k.yakin = yakin;
  for (let j = 0; j < 5; j++) { k.yuvaHayir[j] = Math.max(0, k.yuvaHayir[j] - dt * 1.3); k.yuvaFlas[j] = Math.max(0, k.yuvaFlas[j] - dt * 1.2); k.yuvaVurgu[j] = Math.max(0, k.yuvaVurgu[j] - dt * 0.8); }
}
function kl9OyunAdim(o, dt) {
  const k = o.kl; let bekleyen = false, hareket = false;
  for (const p of k.pul) { if (p.durum === 'yer' || p.durum === 'geri') bekleyen = true; else if (p.durum !== 'takili') hareket = true; }
  const esik = k.helpN > 0 ? KL9_YARDIM2 : KL9_YARDIM;
  if (KOLYE.ptr < 0 && bekleyen && !hareket) { k.idle += dt; if (!k.helpOn && k.idle >= esik) { k.helpOn = true; k.helpT = 0; k.helpN++; OLAY.emit('kolyeYardim', { o }); } }
  if (k.helpOn) k.helpT += dt;
  if (k.idle >= KL9_GOSTER && !k.ipucuBos && k.n < 5) { k.ipucuBos = true; if (k.t - k.ipucuT > 9) { k.ipucuT = k.t; OLAY.emit('kolyeIpucu', { o }); } }   // uzun beklemede bir kez
  if (k.idle < 1) k.ipucuBos = false;
  if (k.gulBek > 0) { k.gulBek -= dt; if (k.gulBek <= 0) kl9Sfx('buyukanneGul'); }
  if (k.bitBek > 0) { k.bitBek -= dt; if (k.bitBek <= 0) { k.bitBek = -1; k.faz = 'parla'; k.pt = 0; k.helpOn = false; kl9GirdiBirak(); } }
}
function kl9BnAdim(o, dt, gorunur) {   // Büyükanne: iç çekiş, bakış, gülümseme, konuşma
  const k = o.kl, B = k.bn, ap = (v, h, sp) => v + (h - v) * (1 - Math.exp(-dt * sp));
  B.gulT = Math.max(0, B.gulT - dt); B.sevT = Math.max(0, B.sevT - dt); B.konT = Math.max(0, B.konT - dt); B.bakT = Math.max(0, B.bakT - dt); B.hmT = Math.max(0, B.hmT - dt);
  // iç çekiş döngüsü: oyun başlamadan ~4.5 sn'de bir; oyunda yalnız uzun beklemede
  const icSure = 1.6;
  if (k.faz === 'bekle' || (k.faz === 'oyun' && k.idle > 7 && k.n < 3)) { B.icBek -= dt; if (B.icBek <= 0) { B.icBek = k.faz === 'bekle' ? 4.2 + Math.random() * 1.5 : 7 + Math.random() * 3; B.icT = icSure; } }
  if (B.icT > 0) { const t0 = B.icT; B.icT -= dt; if (t0 > icSure * 0.45 && B.icT <= icSure * 0.45 && gorunur) for (let i = 0; i < 3; i++) kl9Toz(6, k.bnX - 130 * kl9BnS() - i * 6, k.bnY - 196 * kl9BnS() + i * 4, -18 - i * 6, -14, 2.4, 16 + i * 4, i % 2 ? '#e6dcff' : '#ffffff'); }
  const icH = B.icT > 0 ? Math.sin(clamp(1 - B.icT / icSure, 0, 1) * Math.PI) : 0;
  B.ic = ap(B.ic, icH, 6);
  const tabanGul = k.faz === 'bekle' ? 0.18 : 0.25 + k.n * 0.1 + (o.done || k.faz === 'parla' ? 0.5 : 0);
  B.gul = ap(B.gul, B.gulT > 0 || B.sevT > 0 ? 1 : B.hmT > 0 ? 0.55 : Math.min(1, tabanGul), B.gulT > 0 ? 7 : 2);
  B.kon = ap(B.kon, B.konT > 0 ? 1 : 0, 8);
  // bakış: tutulan/uçan pul · Feza
  let tx = P.x, ty = P.y - 50;
  const tut = KOLYE.tut; if (tut) { tx = tut.x; ty = tut.y; }
  else { const u = k.pul.find(p => p.durum === 'uc' || p.durum === 'pir'); if (u) { tx = u.x; ty = u.y; } else if (k.faz === 'bekle') { tx = k.gx; ty = k.gy + 40; } }
  const hx = k.bnX - 60, hy = k.bnY - 200;
  B.bakX = ap(B.bakX, clamp((tx - hx) / 160, -1, 1), 5); B.bakY = ap(B.bakY, clamp((ty - hy) / 160, -1, 1), 5);
}
function kl9Kalkis() {   // kalkış kayalığı: buyukanneBinis nesnesi (yoksa terasın 900 birim sağı)
  if (!kl9Kalkis.n) kl9Kalkis.n = (typeof NESNELER !== 'undefined' && NESNELER.find(n => n.tip === 'buyukanneBinis')) || null;
  return kl9Kalkis.n;
}
function kl9FinalAdim(o, dt) {   // parlama → kalkış → Feza'ya sekerek gelir → kucak → geri sekip davet eder → kayalığa süzülüş
  const k = o.kl, t0 = k.pt; k.pt += dt; const t = k.pt, gec = a => t0 < a && t >= a, B = k.bn, F = KL9_F, s = kl9BnS();
  const bx0 = o.x + KL9_BX, hx = k.entry.x + 6 * s, gx2 = hx + 135 * s, kal = kl9Kalkis(), rx = kal ? kal.x : o.x + 900, ry = kal ? kal.y : o.y;
  if (gec(0.001)) {
    kl9Sfx('kolyeParla'); OLAY.emit('kolyeParla', { o });
    k.parla = 1; kl9Halka(k.gx, k.gy - 10, 120, 1.4, '#fff3c4'); kl9Halka(k.gx, k.gy - 10, 80, 1.0, '#d9c8ff');
    kl9IsikSac(k.gx, k.gy - 10, 26, 220, ['#ffd27a', '#b89cff', '#6fd8a8', '#ffffff', '#ff9fc0']);
    B.gulT = 3; B.sevT = 3; k.fzSev = 2.4;
  }
  for (let i = 0; i < 5; i++) if (gec(0.25 + i * 0.16)) { const [yx, yy] = kl9Yuva(o, i); kl9Halka(yx, yy, 40, 0.7, KL9_ACIK[i]); kl9IsikSac(yx, yy, 5, 60, [KOLYE_RENK[i], '#ffffff']); k.yuvaFlas[i] = 1; }
  if (gec(1.2)) kl9Halka(k.gx, k.gy - 10, 170, 1.6, '#ffe7a8');
  if (gec(F.kalk)) { kl9Sfx('buyukanneKanat', 0.5); B.gulT = 2; kl9IsikSac(bx0, o.y - 6, 12, 110, ['#ffffff', '#d9c8ff', '#c8f08a']); }
  if (gec(F.yur0)) { kl9Sfx('buyukanneKanat', 0.7); k.fzSev = 1.4; }
  if (gec(F.yur1)) { kl9IsikSac(hx, o.y - 6, 12, 110, ['#ffffff', '#d9c8ff', '#c8f08a']); }
  if (gec(F.sar0)) { OLAY.emit('kolyeKucak', { o }); kl9Sfx('buyukanneGul'); B.gulT = 3.4; k.fzSev = 0; for (let i = 0; i < 5; i++) kl9Toz(2, hx - 60 + i * 30, o.y - 140 - (i % 2) * 22, 0, -30, 2.6 + i * 0.15, 1.3, '#ff9fc0'); }
  if (gec(F.sar0 + 1.3)) for (let i = 0; i < 3; i++) kl9Toz(2, hx - 40 + i * 40, o.y - 180, 0, -30, 2.4, 1.1, '#ff9fc0');
  if (gec(F.kucak1)) { k.fzSev = 1.8; }
  if (gec(F.kucak1 + 0.45)) kl9Sfx('buyukanneKanat', 0.5);
  if (gec(F.geri1)) { B.gulT = 2.5; k.pr.kirp = 1.2; }
  if (gec(F.uc0)) { kl9Sfx('buyukanneKanat', 1); kl9IsikSac(gx2, o.y - 20, 16, 140, ['#ffffff', '#d9c8ff', '#ffd27a']); }
  if (gec(F.uc1)) {
    kl9Sfx('buyukanneKanat', 0.5); kl9IsikSac(rx, ry - 10, 18, 140, ['#ffffff', '#d9c8ff', '#ffd27a', '#6fd8a8']); kl9Halka(rx, ry - 4, 90, 0.9, '#ffffff');
    k.faz = 'bitti';
    KOLYE.devir = { x: rx, y: ry, s, yon: -1, poz: 'ayakta' };
    kl9Birak(o, true);
    OLAY.emit('kolyeBitti', { o, buyukanne: { x: rx, y: ry } });
  }
  // Büyükanne'nin yeri ve pozu
  const ap = (v, h, sp) => v + (h - v) * (1 - Math.exp(-dt * sp)), sek = (u, n, h) => Math.abs(Math.sin(clamp(u, 0, 1) * Math.PI * n)) * h;
  k.parla = ap(k.parla, t < F.kalk ? 1 : 0.6, 1.5);
  B.sar = 0; B.ucus = false; B.yon = -1; B.y = o.y;
  if (t < F.kalk) { B.poz = 'otur'; B.x = bx0; B.kanat = 0.2 + 0.12 * Math.sin(t * 6); }
  else if (t < F.yur0) { B.poz = 'ayakta'; B.x = bx0; B.y = o.y - sek((t - F.kalk) / 0.45, 1, 16); B.kanat = 0.45; }   // kalkar: minik bir sekme
  else if (t < F.yur1) { const u = (t - F.yur0) / (F.yur1 - F.yur0); B.poz = 'ayakta'; B.x = lerp(bx0, hx, smooth(u)); B.y = o.y - sek(u, 2, 34); B.kanat = 0.5 + 0.5 * Math.abs(Math.sin(u * Math.PI * 2)); }   // iki kanatlı sekişle Feza'nın önüne
  else if (t < F.kucak1 + 0.45) { B.poz = 'kucak'; B.x = hx; B.kanat = 1;
    B.sar = t < F.sar0 ? 0 : t < F.kucak1 ? smooth(clamp((t - F.sar0) / 0.7, 0, 1)) : 1 - smooth(clamp((t - F.kucak1) / 0.45, 0, 1)); }   // kollar açık "gel!" → sımsıkı sarılır → bırakır
  else if (t < F.geri1) { const u = (t - F.kucak1 - 0.45) / (F.geri1 - F.kucak1 - 0.45); B.poz = 'ayakta'; B.x = lerp(hx, gx2, smooth(u)); B.y = o.y - sek(u, 1, 30); B.kanat = 0.7; }
  else if (t < F.uc0) { const u = (t - F.geri1) / (F.uc0 - F.geri1); B.poz = 'ayakta'; B.x = gx2; B.yon = 1; B.kanat = 0.55 + 0.4 * Math.sin(u * Math.PI * 3); B.bakX = -1; }   // kayalığa döner, kanadıyla "hadi!" der
  else if (t < F.uc1) {
    const u = (t - F.uc0) / (F.uc1 - F.uc0), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    B.poz = 'ucus'; B.ucus = true; B.x = lerp(gx2, rx, e); B.y = lerp(o.y, ry, e) - 30 - Math.sin(u * Math.PI) * 150; B.kanat = 1; B.yon = 1;
    if (u > 0.9) { B.poz = 'ayakta'; B.ucus = false; B.yon = -1; B.y = lerp(o.y, ry, e) - (1 - u) * 300; }   // konarken Feza'ya döner
    if (Math.random() < dt * 30) kl9Toz(1, B.x + (Math.random() - 0.5) * 100, B.y - 60 + (Math.random() - 0.5) * 60, -40, 10, 1.2, 7, ['#ffffff', '#d9c8ff', '#ffd27a'][(Math.random() * 3) | 0]);
  }
}
function kl9PirilAdim(o, dt) {   // Pırıl: Feza'nın yanı · ipucu · yardım (pulu taşır) · kutlama · kucakta Feza'ya sokulur
  const k = o.kl, pr = k.pr, e = k.entry;
  pr.kirp = Math.max(0, pr.kirp - dt);
  let tx = e.x + 44, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  pr.poz = pr.kirp > 0 ? 'alkis9' : 'ucus';
  if (k.faz === 'oyun') {
    const sira = kl9Siradaki(o), ta = k.tasinan, ipucu = k.idle > KL9_GOSTER || k.helpOn;
    if (ta && ta.durum === 'pir') {
      const [yx, yy] = kl9Yuva(o, ta.b); tx = yx - 6; ty = yy - 34 + Math.sin(k.t * 4) * 3; hiz = 3; bak = Math.sign(yx - pr.x) || 1; pr.poz = 'ucus';
      if (Math.hypot(tx - pr.x, ty - pr.y) < 16) { kl9PulUc(o, ta, 'piril'); k.tasinan = null; k.helpOn = false; k.helpT = 0; k.idle = 0; pr.kirp = 0.9; }   // bir pul taşır, sonra yine çocuğu bekler (sonraki yardım ~12 sn)
    } else if (k.tasinan && k.tasinan.durum !== 'pir') k.tasinan = null;
    else if (k.helpOn && sira && sira.durum === 'yer' && k.helpT > 0.8) {
      tx = sira.x - 2; ty = sira.y - 26; hiz = 3.2; bak = Math.sign(sira.x - pr.x) || 1; pr.poz = 'ucus';
      if (Math.hypot(tx - pr.x, ty - pr.y) < 18) { sira.durum = 'pir'; k.tasinan = sira; kl9Sfx('parilti', 0.5); kl9IsikSac(sira.x, sira.y, 6, 50, [KOLYE_RENK[sira.b], '#ffffff']); }
    } else if (ipucu && sira && sira.durum === 'yer') {   // yol gösterir: pulun üstünde süzülüp "işte bu!" der, sonra yuvasına doğru kısa süzülüş
      const [yx, yy] = kl9Yuva(o, sira.b), u = (k.t * 0.4) % 1, s = smooth(clamp((u - 0.45) / 0.45, 0, 1)), ax = sira.x - 30, ay = sira.y - 46;
      tx = lerp(ax, lerp(ax, yx, 0.4), s); ty = lerp(ay, lerp(ay, yy - 40, 0.4), s) - Math.sin(s * Math.PI) * 18; hiz = 5; bak = Math.sign(yx - sira.x) || 1;
      pr.poz = u < 0.45 ? 'goster9' : 'ucus';
      if (s > 0 && Math.random() < dt * 12) kl9Toz(1, pr.x - bak * 8, pr.y + 6, -bak * 14, 6, 0.9, 5, KOLYE_RENK[sira.b]);
    } else bak = Math.sign(k.gx - pr.x) || 1;
  } else if (k.faz === 'parla') {
    const t = k.pt, F = KL9_F, B = k.bn;
    if (t < F.yur0) { const a = t * 2.4; tx = k.gx + Math.cos(a) * 150; ty = k.gy - 200 + Math.sin(a) * 26; hiz = 4; bak = Math.sin(a) > 0 ? -1 : 1; pr.poz = 'sevinc9'; }   // kolyenin üstünde sevinçle döner
    else if (t < F.sar0) { tx = e.x + 30; ty = e.y - 84; hiz = 4; bak = 1; pr.poz = 'ucus'; }
    else if (t < F.kucak1 + 0.3) { tx = e.x + 30; ty = e.y - 80 + Math.sin(k.t * 2) * 1.5; hiz = 5; bak = 1; pr.poz = 'kucak9'; }   // Büyükanne'nin kollarının arasında Feza'ya sarılır
    else if (t < F.uc0) { tx = e.x + 46; ty = e.y - 116 + Math.sin(k.t * 2.4) * 4; hiz = 3.5; bak = 1; pr.poz = pr.kirp > 0 ? 'alkis9' : 'ucus'; }
    else { tx = e.x + 50; ty = e.y - 118 + Math.sin(k.t * 2.4) * 5; hiz = 3; bak = Math.sign(B.x - pr.x) || 1; }
  }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}
function kl9Aktiflestir(o) {
  const k = o.kl; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x = clamp(P.x, o.x + KL9_GIR0, o.x + KL9_GIR1); e.y = P.y; e.safeX = P.safeX; e.safeY = P.safeY;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; KOLYE.o = o; kl9GirdiBirak();
  P.ucus = o; P.x = e.x; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  if (k.faz === 'bekle') { k.faz = 'gel'; k.fT = 0; k.bn.icT = 0; k.bn.sevT = 1.2; }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kolye', 1.5, k.kameraFn, 1, 0.42);
  if (!k.basladi) { k.basladi = true; OLAY.emit('kolyeBasla', { o }); }
  return true;
}
function kl9Birak(o, tamam) {   // Feza'yı bırak: giriş fotoğrafındaki konum aynen geri verilir
  const k = o.kl, e = k.entry; if (!k.aktif) return;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; kl9GirdiBirak();
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kolye', 0.1, k.kameraFn, 1, 0.42);
  if (tamam && !o.done) { o.done = true; o.tk.bitti = true; k.bitti = true; if (typeof V9 !== 'undefined' && V9) V9.kolye = true; }
}
function kl9Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza girişte durur
  const k = o.kl; if (!k.aktif || P.ucus !== o) return;
  P.x = k.entry.x; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function kl9Kamera(o) {
  const k = o.kl, s = kl9BnS();
  omDkEkle(o.x - 460, o.y - 300 * s - 20, o.x + KL9_BX + 130 * s, o.y + 25);
  if (k.faz === 'parla' && k.pt > KL9_F.geri1) { const B = k.bn, kal = kl9Kalkis(); omDkEkle(B.x - 130 * s, B.y - 270 * s, B.x + 130 * s, B.y + 20); if (kal) omDkEkle(kal.x - 140 * s, kal.y - 260 * s, kal.x + 140 * s, kal.y + 25); }
}
function kl9Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.kl; k.t += dt;
  const gorunur = typeof cam !== 'undefined' && o.x > cam.x - 800 && o.x < cam.x + VW + 800;
  kl9EfektAdim(dt);
  if (k.faz !== 'parla' && k.faz !== 'bitti') { const B = k.bn; B.x = o.x + KL9_BX; B.y = o.y; B.poz = 'otur'; B.kalk = 0; B.yon = -1; B.kanat = B.sevT > 0 ? 0.25 : 0; }
  k.bnX = k.bn.x; k.bnY = k.bn.y;
  kl9BnAdim(o, dt, gorunur);
  if (k.faz === 'parla') kl9FinalAdim(o, dt);
  k.fzSev = Math.max(0, k.fzSev - dt);
  // çimendeki pullar uzaktan da göz kırpar
  if (gorunur && k.faz !== 'parla' && k.faz !== 'bitti') { k.isT -= dt; if (k.isT <= 0) { k.isT = 0.35 + Math.random() * 0.5; const p = k.pul[(Math.random() * 5) | 0]; if (p.durum === 'yer') kl9Toz(3, p.x + (Math.random() - 0.5) * 22, p.y - 6 - Math.random() * 10, 0, -8, 0.7, 6 + Math.random() * 3, '#ffffff'); } }
  kl9PulAdim(o, dt);
  if (KOLYE.devir && !KOLYE.devirAlindi && typeof BN9_BA !== 'undefined' && BN9_BA && BN9_BA.vis && TUR.al('buyukanneBinis')) KOLYE.devirAlindi = true;   // buyukanne.js kayalıkta çiziyor
  if (KOLYE.devir && !KOLYE.devirAlindi && Math.random() < dt * 2) kl9Toz(3, KOLYE.devir.x + (Math.random() - 0.5) * 160, KOLYE.devir.y - 60 - Math.random() * 120, 0, -10, 0.9, 6, '#ffffff');
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !o.done && !P.ucus && P.x > o.x - KL9_AKTIF && P.x < o.x + 200 && Math.abs(P.y - o.y) < 160) kl9Aktiflestir(o);
  if (!k.aktif) return;
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('kolye', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  if (k.faz === 'gel') { if (k.fT >= KL9_GEL) kl9OyunBasla(o); }
  else if (k.faz === 'oyun') kl9OyunAdim(o, dt);
  kl9PirilAdim(o, dt);
}

// ═══════════════════════════════ çizim ═══════════════════════════════
const KL9_BO = {};          // buyukanneCiz seçenekleri (karede yeniden kullanılır)
const KL9_FZ_OPT = { ruzgar: 0.1 }, KL9_FZ_KUCAK = { u: 0, boy: 1 }, KL9_PR_U = { u: 0, sevinc: 0, yon: 1 };
function kl9BnSecenek(o, katman) {
  const k = o.kl, B = k.bn, O = KL9_BO;
  O.yon = B.yon; O.poz = B.poz; O.kanat = B.kanat; O.gulumse = B.gul; O.kolye = k.n; O.isik = clamp(k.parla, 0, 1); O.sar = B.sar;
  O.icCek = B.ic; O.konus = B.kon; O.bakX = B.bakX; O.bakY = B.bakY; O.kalk = B.kalk; O.katman = katman;
  O.kolyeGizle = !(B.ucus && typeof buyukanneCiz === 'function');   // uçarken kolyeyi buyukanne.js çizer (gövdeyle birlikte eğilir)
  return O;
}
function kl9Ciz(o, tm) {   // Feza'nın arkası: teras süsleri, Büyükanne, kolye, çimendeki pullar
  const k = o.kl, X = o.x, Y = o.y, s = kl9BnS(), B = k.bn;
  const yakinda = typeof cam === 'undefined' || (X > cam.x - 520 && X < cam.x + VW + 520);
  if (yakinda) {
    const bx0 = X + KL9_BX;
    kl9IsikE(g, '#ffd27a', bx0 + 150, Y - 106, 120, 120, 0.35 + 0.08 * Math.sin(tm * 1.9));   // fenerin sıcak ışığı
    kl9Koy(g, kl9Fener(), bx0 + 138, Y);
    kl9Koy(g, kl9Minder(), bx0 + 6, Y + 4);
  }
  // Büyükanne (kayalığa konduktan sonra buyukanne.js devralana kadar burada da çizilir)
  const devirde = k.faz === 'bitti' && KOLYE.devir;
  if (devirde && KOLYE.devirAlindi) { k.bnGorunur = false; }
  else {
    const kucak = B.poz === 'kucak';
    if (yakinda || k.faz === 'parla' || devirde) {
      const O = kl9BnSecenek(o, kucak ? 'arka' : undefined);
      if (devirde) { O.poz = 'ayakta'; O.yon = -1; O.kanat = 0.3 + 0.08 * Math.sin(tm * 1.5); O.kalk = 1; }
      const bx = devirde ? KOLYE.devir.x : B.x, by = devirde ? KOLYE.devir.y : B.y;
      const R = kl9BnCiz(g, bx, by, s, tm, O);
      if (R) { k.gx = R.gogusX; k.gy = R.gogusY; k.gogusVar = true; k.kx = R.gen > 0 ? clamp(R.gen / 96, 0.9, 1.35) : 1; }
      else { k.gx = bx - 22 * s * -B.yon; k.gy = by - 122 * s; k.gogusVar = false; }
      if (!(B.ucus && typeof buyukanneCiz === 'function') || devirde) kl9KolyeCiz(o, tm);
    }
  }
  if (yakinda) {
    kl9Koy(g, kl9Sepet(), X + KL9_BX + 104, Y + 2);
    // çimendeki pullar (ve önlerindeki çimen tutamları)
    const sira = kl9Siradaki(o), ipucu = k.faz === 'oyun' && (k.idle > KL9_IPUCU || k.helpOn) && !k.tasinan;
    for (const p of k.pul) {
      if (p.durum !== 'yer' && p.durum !== 'geri') continue;
      const vurgu = p === sira && ipucu ? 0.5 + 0.5 * Math.sin(tm * 4) : 0, nab = 0.75 + 0.25 * Math.sin(tm * 2.2 + p.i * 1.3);
      kl9IsikE(g, KOLYE_RENK[p.b], p.x, Y + p.d.fy + 6, 46 + vurgu * 14, 16, 0.5 * nab + vurgu * 0.3);   // çimene vuran renkli ışık
      const M = g.getTransform(); g.translate(p.x, p.y); g.rotate(p.rot); kolyePulCiz(g, 0, 0, KL9_PR * p.s * (1 + vurgu * 0.08), p.b, tm, 0.55 * nab + vurgu * 0.5); g.setTransform(M);
      if (p.durum === 'yer' && p.selam > 0.55) kl9Koy(g, kl9OtSpr(p.i), X + p.d.fx + 4, Y + 2);
    }
  }
}
function kl9KolyeCiz(o, tm) {   // zincir + yuvalar + takılı pullar (Büyükanne'nin göğsünde)
  const k = o.kl, gx = k.gx, gy = k.gy, par = clamp(k.parla, 0, 1), sira = kl9Siradaki(o), tutB = KOLYE.tut ? KOLYE.tut.b : -1;
  const ipB = k.faz === 'oyun' && (k.idle > KL9_IPUCU || k.helpOn) && sira ? sira.b : -1;
  if (par > 0.01) { kl9Isik(g, '#fff3c4', gx, gy - 20, 190 * par, 0.55 * par); kl9Isik(g, '#d9c8ff', gx, gy - 20, 120, 0.4 * par); }
  if (par > 0.05) {   // dönen yumuşak ışık hüzmeleri
    const op = g.globalCompositeOperation; g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832 + tm * 0.3, L = 70 + 40 * Math.sin(tm * 1.3 + i * 1.7), w = 0.5 + 0.5 * Math.sin(tm * 2.1 + i * 2.3);
      g.strokeStyle = i % 3 === 0 ? 'rgba(255,214,130,0.09)' : i % 3 === 1 ? 'rgba(196,168,255,0.09)' : 'rgba(160,240,200,0.08)'; g.globalAlpha = par * (0.4 + 0.6 * w);
      for (let z = 0; z < 2; z++) { g.lineWidth = z ? 8 : 18; g.beginPath(); g.moveTo(gx + Math.cos(a) * 30, gy - 14 + Math.sin(a) * 24); g.lineTo(gx + Math.cos(a) * L * 1.4, gy - 14 + Math.sin(a) * L); g.stroke(); } }
    g.globalAlpha = 1; g.globalCompositeOperation = op;
  }
  { const Z = kl9ZincirSpr(), kx = k.kx; g.drawImage(Z, gx + Z.x0 * kx, gy + Z.y0, Z.w * kx, Z.h); }
  for (let b = 0; b < 5; b++) {
    const [yx0, yy] = kl9Yuva(o, b), hay = k.yuvaHayir[b], yx = yx0 + Math.sin(hay * 24) * 6 * hay;
    const vur = Math.max(k.yuvaVurgu[b], b === tutB ? 0.8 + 0.2 * Math.sin(tm * 7) : 0, b === ipB ? 0.5 + 0.5 * Math.sin(tm * 4) : 0);
    if (vur > 0.02) kl9Isik(g, KOLYE_RENK[b], yx, yy, 44 + vur * 10, Math.min(1, vur) * 0.75);
    kl9Koy(g, kl9YuvaSpr(b), yx, yy);
    if (vur > 0.02) { g.globalAlpha = Math.min(1, vur) * 0.5; g.globalCompositeOperation = 'lighter'; kl9Koy(g, kl9YuvaSpr(b), yx, yy); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; }
  }
  for (const p of k.pul) if (p.durum === 'takili') {
    const fl = k.yuvaFlas[p.b], nab = 0.6 + 0.4 * Math.sin(tm * 2.4 + p.b * 1.2);
    if (fl > 0.01) kl9Isik(g, '#ffffff', p.x, p.y, 60 * fl + 20, fl * 0.8);
    const M = g.getTransform(); g.translate(p.x, p.y); g.rotate(p.rot); kolyePulCiz(g, 0, 0, KL9_PR * p.s, p.b, tm, 0.35 * nab + par * 0.5 + fl * 0.5); g.setTransform(M);
    if (par > 0.3 && ((tm * 1.7 + p.b * 0.37) % 1) < 0.08) kl9Koy(g, kl9IsiltiSpr(), p.x + 5, p.y - 6);
  }
}
function kl9CizOn(o, tm) {   // Feza'nın önü: Feza, Pırıl, kucakta ön kanat, havadaki pullar, ipucu tozları, parçacıklar
  const k = o.kl, B = k.bn, s = kl9BnS();
  if (k.aktif && P.ucus === o) {
    const kucak = B.poz === 'kucak', pr = k.pr;
    let poz = 'ayakta_yan', opt = KL9_FZ_OPT;
    if (kucak) { poz = 'kucak9'; opt = KL9_FZ_KUCAK; KL9_FZ_KUCAK.u = clamp(B.sar * 1.1, 0, 1); }
    else if (k.fzSev > 0 || (k.faz === 'gel' && k.fT > 0.4 && k.fT < 1.1)) poz = 'sevinc';
    try { if (typeof fezaCizPoz === 'function') fezaCizPoz(g, P.x, P.y, 1, poz, tm, null, opt); } catch (e) {}
    if (typeof pirilCizPoz === 'function') {
      const U = KL9_PR_U; U.u = B.sar; U.sevinc = k.fzSev > 0 ? 1 : 0.3; U.yon = pr.f;
      try { g.save(); g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, pr.poz || 'ucus', tm, U); g.restore(); } catch (e) { g.restore(); }
    }
    if (kucak) { kl9BnCiz(g, B.x, B.y, s, tm, kl9BnSecenek(o, 'on')); }
  }
  // ipucu: sıradaki pulun yuvasına doğru akan ışık tozu
  const sira = kl9Siradaki(o), ipucu = k.faz === 'oyun' && (k.idle > KL9_IPUCU || k.helpOn) && !k.tasinan;
  if (ipucu && sira && sira.durum === 'yer') {
    const [yx, yy] = kl9Yuva(o, sira.b), cxp = (sira.x + yx) / 2, cyp = Math.min(sira.y, yy) - 80, col = KOLYE_RENK[sira.b];
    for (let i = 0; i < 9; i++) { const v = (i / 9 + tm * 0.4) % 1, q = 1 - v, x = q * q * sira.x + 2 * q * v * cxp + v * v * yx, y = q * q * sira.y + 2 * q * v * cyp + v * v * yy;
      kl9Isik(g, col, x, y, 13, 0.5 * Math.sin(v * Math.PI)); g.globalAlpha = 0.8 * Math.sin(v * Math.PI); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(x, y, 1.6, 0, 6.2832); g.fill(); g.globalAlpha = 1; }
  }
  // havadaki pullar (tutulan, uçan, Pırıl'ın taşıdığı)
  for (const p of k.pul) {
    if (p.durum !== 'tut' && p.durum !== 'uc' && p.durum !== 'pir') continue;
    const tut = p.durum === 'tut';
    const M = g.getTransform(); g.translate(p.x, p.y); g.rotate(p.rot); kolyePulCiz(g, 0, 0, KL9_PR * p.s, p.b, tm, tut ? 0.9 : 0.75); g.setTransform(M);
  }
  kl9TozCiz(g);
}

// ═══════════════════════════════ girdi ═══════════════════════════════
// Parmak/fare pulu tutup sürükler; kısa dokunuş uçurur; Büyükanne'ye / kolyeye dokunmak sıradakini getirir (pencere yakalama evresi:
// motorun yürüme parmağına gitmez).
function kl9Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function kl9Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function kl9PulBul(o, x, y) {
  const k = o.kl, rr = Math.max(58, 46 * DPR / Math.max(S, 0.001)); let en = null, ed = Infinity;
  for (const p of k.pul) { if (!(p.durum === 'yer' || p.durum === 'geri')) continue; const d = Math.hypot(p.x - x, p.y - y); if (d < rr && d < ed) { ed = d; en = p; } }
  return en;
}
function kl9Tut(o, p, q) { p.durum = 'tut'; p.t = 0; p.hx = p.x - q.x; p.hy = p.y - q.y; p.ust = -1; KOLYE.tut = p; KOLYE.hx = p.x; KOLYE.hy = p.y; const [yx, yy] = kl9Yuva(o, p.b); KOLYE.tutUzak = Math.hypot(yx - p.x, yy - p.y); kl9Sfx('parilti', 0.3); }
function kl9GirdiBirak() {
  const id = KOLYE.ptr; KOLYE.ptr = -1;
  const p = KOLYE.tut; if (p && p.durum === 'tut') { p.durum = 'geri'; p.t = 0; p.x1 = p.x; p.y1 = p.y; } KOLYE.tut = null;
  if (id >= 0 && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} }
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
}
addEventListener('pointerdown', e => {
  const o = KOLYE.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === KOLYE.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  kl9Sahip(e); if (KOLYE.ptr >= 0) return;
  const k = o.kl, q = kl9Dunya(e);
  KOLYE.ptr = e.pointerId; KOLYE.px = q.x; KOLYE.py = q.y; KOLYE.pt = k.t; KOLYE.yol = 0; KOLYE.tut = null;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  kl9Kullanici(o);
  if (k.faz !== 'oyun') return;
  const p = kl9PulBul(o, q.x, q.y);
  if (p) { kl9Tut(o, p, q); return; }
  const s = kl9BnS(), bx = k.bnX;
  if ((Math.abs(q.x - k.gx) < 110 && Math.abs(q.y - k.gy) < 70) || (Math.abs(q.x - bx) < 120 * s && q.y > o.y - 270 * s && q.y < o.y + 12)) {   // kolyeye / Büyükanne'ye dokunuş
    k.bn.sevT = 0.8; const sp = kl9Siradaki(o); if (sp) kl9PulUc(o, sp, 'dokun'); return;
  }
  let en = null, ed = 240; for (const r of k.pul) if (r.durum === 'yer') { const d = Math.hypot(r.x - q.x, r.y - q.y); if (d < ed) { ed = d; en = r; } }   // boşluğa dokunuş: en yakın pul "buradayım" diye hoplar
  if (en) en.sal = 1;
}, true);
addEventListener('pointermove', e => {
  const o = KOLYE.aktif; if (!o || e.pointerId !== KOLYE.ptr) return; kl9Sahip(e);
  const q = kl9Dunya(e), dx = q.x - KOLYE.px, dy = q.y - KOLYE.py; KOLYE.px = q.x; KOLYE.py = q.y;
  const d = Math.hypot(dx, dy); if (d > 300) return;   // sıçrama (ekran döndü vb.)
  KOLYE.yol += d; o.kl.idle = 0;
  const p = KOLYE.tut;
  if (p && p.durum === 'tut') { KOLYE.hx = q.x + p.hx * 0.5; KOLYE.hy = q.y + p.hy * 0.5; }
  else if (!p && o.kl.faz === 'oyun') { const r = kl9PulBul(o, q.x, q.y); if (r) kl9Tut(o, r, q); }   // parmak bir pulun üstünden geçerse onu da tutar
}, true);
function kl9BirakE(e) {
  const o = KOLYE.aktif; if (!o || e.pointerId !== KOLYE.ptr) return; kl9Sahip(e);
  const k = o.kl, p = KOLYE.tut;
  if (p && p.durum === 'tut') {
    const [yx, yy] = kl9Yuva(o, p.b), d = Math.hypot(yx - p.x, yy - p.y), kisa = KOLYE.yol < 14 && k.t - KOLYE.pt < 0.5;
    let yanlis = -1, yd = KL9_YANLIS * 1.25; for (let j = 0; j < 5; j++) { if (j === p.b) continue; const [jx, jy] = kl9Yuva(o, j), dj = Math.hypot(jx - p.x, jy - p.y); if (dj < yd && dj < d) { yd = dj; yanlis = j; } }
    if (kisa) kl9PulUc(o, p, 'dokun');
    else if (yanlis >= 0) { KOLYE.tut = null; kl9YanlisYuva(o, p, yanlis); }
    else if (d < 130 || d < KOLYE.tutUzak * 0.5 || Math.hypot(k.gx - p.x, k.gy - p.y) < 120) kl9PulUc(o, p, 'birak');   // kolyeye doğru götürüldü: kendi yuvasına süzülür
  }
  kl9GirdiBirak();
}
addEventListener('pointerup', kl9BirakE, true); addEventListener('pointercancel', kl9BirakE, true);
cv.addEventListener('lostpointercapture', e => { if (e.pointerId === KOLYE.ptr) kl9GirdiBirak(); });
addEventListener('blur', () => { if (KOLYE.ptr >= 0) kl9GirdiBirak(); });
addEventListener('pagehide', () => { if (KOLYE.ptr >= 0) kl9GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && KOLYE.ptr >= 0) kl9GirdiBirak(); });
addEventListener('keydown', e => {
  const o = KOLYE.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  kl9Sahip(e); kl9Kullanici(o);
  if (!e.repeat && o.kl.faz === 'oyun' && /^(Space|Enter|KeyE|ArrowRight|ArrowUp|KeyW|KeyD)$/.test(e.code)) { const s = kl9Siradaki(o); if (s) kl9PulUc(o, s, 'tus'); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = KOLYE.aktif; if (o && d !== 'mola' && d !== 'duraklat') kl9Birak(o, false); kl9GirdiBirak(); });
OLAY.on('konusma', e => { const o = KOLYE.o; if (!o || !o.kl || !e) return; if (e.kim === 'bn' || /^bn_/.test(e.anahtar || '')) o.kl.bn.konT = Math.max(o.kl.bn.konT, +e.sure || 2); });   // Büyükanne konuşurken ağzı oynar

// Kamera: P.ucus doluyken oyun.js "uçuş kamerası" kadrajı ezer; kolye etkinliğinde dikkat kadrajı geçerli olsun (kazan.js'teki
// sarmalayıcının aynısı; CORE oyun.js'e kolyeMini istisnasını eklerse zararsızdır).
addEventListener('load', () => {
  if (typeof omUcusKamera !== 'function' || omUcusKamera.kl9Sarili) return;
  const f = omUcusKamera;
  const s = function (dt, snap, px, py) { const u = P.ucus; if (u && u.tip === 'kolyeMini') { P.ucus = null; try { return f(dt, snap, px, py); } finally { P.ucus = u; } } return f(dt, snap, px, py); };
  for (const a in f) s[a] = f[a];
  s.kl9Sarili = true;
  try { omUcusKamera = s; } catch (e) {}
});

TUR.kaydet('kolyeMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };   // kapi.js "takim" bitiş bayrağını okur → miniKapi açılır
    const s = kl9BnS();
    o.kl = { aktif: false, faz: 'bekle', fT: 0, t: 0, n: 0, pt: 0, parla: 0,
      pul: KL9_YER.map((d, i) => ({ d, i, b: d.b, durum: 'yer', t: 0, x: o.x + d.fx, y: o.y + d.fy, x1: 0, y1: 0, s: KL9_CIM, s1: 1, rot: d.rot, r1: 0, sure: 0.7, yay: 0,
        hx: 0, hy: 0, sal: 0, zip: 0, selam: 1, ust: -1, yardim: false })),
      yuvaHayir: [0, 0, 0, 0, 0], yuvaFlas: [0, 0, 0, 0, 0], yuvaVurgu: [0, 0, 0, 0, 0], yakin: -1,
      gx: o.x + KL9_BX - 22 * s, gy: o.y - 122 * s, kx: 1, gogusVar: false, bnX: o.x + KL9_BX, bnY: o.y, bnGorunur: true,
      idle: 0, helpOn: false, helpT: 0, helpN: 0, tasinan: null, bitBek: -1, gulBek: -1, fzSev: 0, isT: 0.4,
      entry: { x: o.x - KL9_AKTIF, y: o.y, safeX: o.x - KL9_AKTIF, safeY: o.y }, pr: { x: o.x - 320, y: o.y - 130, f: 1, kirp: 0, poz: 'ucus' },
      bn: { x: o.x + KL9_BX, y: o.y, yon: -1, poz: 'otur', kalk: 0, kanat: 0, sar: 0, ucus: false, gul: 0.18, ic: 0, kon: 0, bakX: 0, bakY: 0.4,
        gulT: 0, sevT: 0, konT: 0, bakT: 0, hmT: 0, icT: 0, icBek: 1.5 },
      basladi: false, bitti: false, kameraFn: null, ipucuT: -99, ipucuBos: false };
    o.kl.kameraFn = typeof omDkEkle === 'function' ? () => kl9Kamera(o) : null;
    o.adim = dt => kl9Adim(o, dt);
    KOLYE.o = o; KOLYE.devir = null; KOLYE.devirAlindi = false;
    try { kl9Hazirla(); } catch (e) { console.warn('[kolye] hazırlık', e); }
  },
  guncelle: kl9Guncelle, ciz: kl9Ciz, cizOn: kl9CizOn
});
