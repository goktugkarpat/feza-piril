/* org11.js — Bölüm 11 (Ay Işığı Şatosu) mini oyun 2: ORG KONSERİ (MINI2; önek or11), nesne türü 'orgMini'.
   Şatonun org salonunda dev, pastel, süslü bir org: lavanta tahtadan gövde, altın süsler, kadife arka pano, iki yan kulecikte
   minik süs boruları ve soğan kubbeler, tepede gülümseyen altın hilal. Önde ALTI BÜYÜK BORU (lila, pembe, nane, altın, ay mavisi,
   çilek pembesi; ay/yıldız/kalp/yarasa işlemeli); her borunun ağzı sevimli bir yüz: Feza gelmeden uyuklar (göz kapalı), uyanınca
   gözlerini açar, çalınca "Ooo" diye şarkı söyler. Vampir Dede orgun önünde, Pıtır kadife minderinde, iki lila yarasa yan
   kuleciklerin altın kancalarında baş aşağı asılı, biri hilalin üstünde oturur. Yanlarda sihirli ay ışığı aplikleri (alev değil).
   Feza orga yaklaştıkça org ışıl ışıl uyanır (aplikler, yüzler); Feza orgun önüne gelince fizik devralınır (P.ucus = o; Feza'yı ve
   Pırıl'ı bu dosya çizer; kamera normal + omDikkat kadrajı: dikey iPad'de de bütün org görünür):
   1) Tanışma: Dede el sallar; borular soldan sağa birer birer uyanıp kendi notasını söyler (La Do Re Mi Sol La', sekizlik).
   2) Ezgi: 4 cümle × 4 nota (OR11_EZGI). Sırası gelen boru PARLAR (ışık sütunu, ağzının çevresinde nabız gibi halkalar, üstünde
      süzülen altın nota, yüzü "ben! ben!" diye hoplar; diğer borular ona bakar). Feza ona dokununca (cömert: ekranda nereye dokunsa
      en yakın boru) boru şarkı söyler: AU.sfx('orgNota', i), tepesinden ışık halkası + renkli notalar yükselir; Vampir Dede komik bir
      figür yapar (göbek sallama, pelerin savurma, papyon döndürme, zıplayış, takla, reverans), Pıtır alkışlar, yarasalar ritimle
      sallanır. Başka bir boruya dokunmak da güzel: o da kendi notasını söyler, Dede yine dans eder; ışık sıradakinde kalır. Yanlış yok.
   3) Her cümlenin sonunda iki ölçü (6 vuruş, 104 BPM, 3/4) vals: Dede pelerini açık döner, yarasalar geniş sallanır, borular sırayla
      parlar (AU.sfx 'orgDans' n, her ölçü başında 'valsAdim').
   4) Son cümleden sonra KISA VALS kendiliğinden çalar (OR11_FINAL; ≈4 ölçü): borular ezgiyi söyler, herkes döner (Dede, Feza,
      Pıtır alkışla), yarasalar orgun çevresinde daire çizerek uçar, sonunda "ta-da!" (bütün borular ışıl ışıl, ışık yağmuru).
      Sonra V11.org = true, o.done = true, o.tk.bitti = true, OLAY 'orgBitti'.
   ~6 sn dokunulmazsa Pırıl sıradaki borunun üstüne uçup ışık serper (ipucu); ~20 sn (sonra ~10 sn) dokunulmazsa Pırıl kendisi
   burnuyla dokunup çalar; çocuk dokununca bırakır. Asla takılmaz. Kaybetme, yazı, öğretici el yok.
   Klavye yedeği: Boşluk/Enter/E = sıradaki boru, 1-6 = boru seç.
   Olaylar: 'orgBasla' {o}, 'orgNota' {o, n (1..16), i, cumle (1..4), yardim}, 'orgSerbest' {o, i}, 'orgDans' {o, n (1..3 cümle sonu,
   4 final valsi, 5 ta-da), vurus}, 'orgIpucu' {o, n, i}, 'orgYardim' {o, n}, 'orgBitti' {o}.
   Saat: ORG11.vurus() ('orgBasla'dan beri vuruş, 104 BPM; 0 = 1. ölçünün 1. vuruşu), ORG11.aktif (etkin nesne ya da null), ORG11.faz().
   Bitince org ışıl ışıl kalır, Dede hafifçe vals yapar; Feza yakındayken bir boruya dokunmak notasını çalar (serbest çalma).
   Ortak çiziciler (VAMPIR, typeof korumalı; yoksa sade yedek): vampirCiz('dede'|'bebek'), yarasa11Ciz. Feza: fezaCizPoz ('ayakta_yan',
   'sevinc', varsa 'dans11'); Pırıl: pirilCizPoz ('ucus', 'goz_kirp').
   Yerleşim (bolum11.js): nesne('orgMini', 442, yuzey(442), {x0, x1}) — o.x orgun 40 birim solu; o.x-330 … o.x+330 DÜZ zemin; Feza
   o.x-262'de durur; ilerisinde miniKapi 465 (bagId). Karede gradyan/filtre/shadowBlur yok: her şey ilk kullanımda önbellek tuvallerine
   çizilir (Feza yaklaşırken karelere yayılarak), parçacık havuzları sabit. Sözleşme: src/BOLUM11.md. */
'use strict';
const OR11_BPM = 104, OR11_VUR = 60 / OR11_BPM;                       // vuruş süresi (sn); ölçü = 3 vuruş (vals)
const OR11_EZGI = [[0, 1, 3, 2], [1, 2, 4, 3], [3, 4, 5, 4], [3, 2, 1, 0]];   // La Do Mi Re | Do Re Sol Mi | Mi Sol La' Sol | Mi Re Do La
const OR11_FINAL = [[0, 0], [1, 1], [2, 3], [3, 4], [5, 3], [6, 2], [7, 3], [8, 4], [9, 5]];   // final valsi [vuruş, nota]: La Do Mi | Sol – Mi | Re Mi Sol | La' – –
const OR11_TADA = 12, OR11_FBIT = 15;                                 // final: ta-da vuruşu, bitiş vuruşu
const OR11_CX = 40;                                                   // orgun ortası (o.x'e göre)
const OR11_GIRIS = 262;                                               // Feza o.x - 262'de durur
const OR11_KASA = 132;                                                // gövde yüksekliği: boruların ayağı burada
const OR11_BX = [-145, -87, -29, 29, 87, 145];                        // boruların ortası (orgun ortasına göre)
const OR11_BH = [236, 280, 322, 322, 280, 236];                       // boru boyları (ayakla)
const OR11_BW = 44;                                                   // boru eni
const OR11_REN = ['#c39bff', '#ffb3d1', '#9ff0d0', '#ffd27a', '#a9c8ff', '#ff8fb0'];   // lila, pembe, nane, altın, ay mavisi, çilek pembesi
const OR11_AMB = ['ay', 'yildiz', 'kalp', 'yarasa', 'yildiz', 'ay'];   // borunun üstündeki işleme
const OR11_DEDE = 108, OR11_DEDE_S = 1.15;                            // Dede (orgun ortasına göre) ve ölçeği
const OR11_PITIR = -222, OR11_PITIR_S = 0.95;                         // Pıtır'ın minderi
const OR11_APLIK = 238, OR11_APLIK_Y = -250;                          // ay ışığı aplikleri
const OR11_YARASA = [[-226, -356, 1], [226, -356, 1], [0, -552, 0]];  // [x, y, asılı mı] (orgun ortasına ve zemine göre)
const OR11_IPUCU = 6, OR11_YARDIM = 20, OR11_YARDIM2 = 10;            // boşta bekleme eşikleri (sn)
const OR11_FIG = ['gobek', 'pelerin', 'papyon', 'zipla', 'takla', 'egil'], OR11_FIG_S = 1.1;   // Dede'nin figürleri (sırayla), süre
const OR11_R = 2.5, OR11_R2 = 2;                                      // sprite çözünürlüğü (piksel / birim): borular, gövde · arka pano
const OR11_KONTUR = '#3b2a6e', OR11_ALTIN = '#e8c06a', OR11_ALTIN2 = '#ffe7a8';

// ── önbellek tuvalleri ──
function or11Cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function or11Spr(w, h, ox, oy, fn, R) {   // birim cinsinden en/boy ve çapa (ox, oy); fn(q) birim koordinatında çizer
  R = R || OR11_R; const cv = or11Cv(w * R, h * R), q = cv.getContext('2d');
  q.scale(R, R); q.translate(ox, oy); q.lineCap = 'round'; q.lineJoin = 'round'; fn(q);
  return { c: cv, w, h, ox, oy };
}
function or11Bas(c, sp, x, y, k) { k = k || 1; c.drawImage(sp.c, x - sp.ox * k, y - sp.oy * k, sp.w * k, sp.h * k); }
function or11Glow(c, col, x, y, rx, ry, a) { if (!(a > 0.003)) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
function or11Yuv(q, x, y, w, h, r) {   // yuvarlak köşeli dikdörtgen yolu (beginPath dahil)
  r = Math.min(r, w / 2, h / 2); q.beginPath(); q.moveTo(x + r, y); q.arcTo(x + w, y, x + w, y + h, r); q.arcTo(x + w, y + h, x, y + h, r); q.arcTo(x, y + h, x, y, r); q.arcTo(x, y, x + w, y, r); q.closePath();
}
function or11Yildiz(q, x, y, r, ic, n) { n = n || 5; q.beginPath(); for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, rr = i % 2 ? r * ic : r; q.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } q.closePath(); }
function or11Kalp(q, x, y, s) { q.beginPath(); q.moveTo(x, y + s * 0.9); q.bezierCurveTo(x - s * 1.4, y - s * 0.1, x - s * 0.7, y - s * 1.2, x, y - s * 0.45); q.bezierCurveTo(x + s * 0.7, y - s * 1.2, x + s * 1.4, y - s * 0.1, x, y + s * 0.9); q.closePath(); }
function or11Hilal(q, x, y, r, yon) {   // hilal: kalın tarafı yon'un tersinde, ısırık yon tarafında (iki çemberin kesişimi, beginPath dahil)
  const d = r * 0.52, r2 = r * 0.84, ix = (d * d + r * r - r2 * r2) / (2 * d), iy = Math.sqrt(Math.max(0, r * r - ix * ix));
  const a = Math.atan2(iy, ix), b = Math.atan2(iy, ix - d);
  q.save(); q.translate(x, y); q.scale(yon < 0 ? -1 : 1, 1);
  q.beginPath(); q.arc(0, 0, r, -a, a, true); q.arc(d, 0, r2, b, -b, false); q.closePath();
  q.restore();
}
function or11Yarasa(q, x, y, s) {   // minik yarasa silüeti (işleme)
  q.beginPath(); q.moveTo(x, y - s * 0.35);
  q.quadraticCurveTo(x + s * 0.5, y - s * 0.75, x + s * 1.25, y - s * 0.55); q.quadraticCurveTo(x + s * 0.95, y - s * 0.2, x + s, y + s * 0.15);
  q.quadraticCurveTo(x + s * 0.6, y - s * 0.05, x + s * 0.45, y + s * 0.3); q.quadraticCurveTo(x + s * 0.2, y + s * 0.05, x, y + s * 0.35);
  q.quadraticCurveTo(x - s * 0.2, y + s * 0.05, x - s * 0.45, y + s * 0.3); q.quadraticCurveTo(x - s * 0.6, y - s * 0.05, x - s, y + s * 0.15);
  q.quadraticCurveTo(x - s * 0.95, y - s * 0.2, x - s * 1.25, y - s * 0.55); q.quadraticCurveTo(x - s * 0.5, y - s * 0.75, x, y - s * 0.35); q.closePath();
  q.moveTo(x - s * 0.22, y - s * 0.42); q.lineTo(x - s * 0.12, y - s * 0.7); q.lineTo(x - s * 0.02, y - s * 0.44); q.moveTo(x + s * 0.22, y - s * 0.42); q.lineTo(x + s * 0.12, y - s * 0.7); q.lineTo(x + s * 0.02, y - s * 0.44);
}
// sönük (ışıksız) renk: gece moruna karışmış, soluk
const OR11_SONUK = '#3d3170';
function or11P(sonuk) { return sonuk ? col => mixc(col, OR11_SONUK, 0.6) : col => col; }

// ── boru: ayak (koni) + gövde (silindir), altın bileziklerle; ağızda yanak (yüz karede çizilir); üstte işleme. Çapa: ayağın altı ──
function or11BoruSpr(i, sonuk) {
  const H = OR11_BH[i], W = OR11_BW, col = OR11_REN[i], P = or11P(sonuk);
  return or11Spr(W + 12, H + 14, W / 2 + 6, H + 8, q => {
    const hw = W / 2, ay = -34;   // ayak/gövde sınırı
    // gövde: yatay gölgeli silindir (solda ay ışığı, sağda lila gölge)
    const gr = q.createLinearGradient(-hw, 0, hw, 0);
    gr.addColorStop(0, sonuk ? P(col) : mixc(col, '#ffffff', 0.35)); gr.addColorStop(0.28, sonuk ? P(or11Hex(col, '#ffffff', 0.5)) : mixc(col, '#ffffff', 0.62));
    gr.addColorStop(0.55, P(col)); gr.addColorStop(1, sonuk ? mixc(col, '#1d1840', 0.75) : mixc(col, '#4b3a8c', 0.38));
    q.strokeStyle = OR11_KONTUR; q.lineWidth = 3; or11Yuv(q, -hw, -H, W, H + ay + 2, 6); q.stroke();
    q.fillStyle = gr; or11Yuv(q, -hw, -H, W, H + ay + 2, 6); q.fill();
    // parlak dikey çizgi
    if (!sonuk) { q.fillStyle = 'rgba(255,255,255,0.55)'; or11Yuv(q, -hw + 6, -H + 18, 4.5, H + ay - 30, 2.2); q.fill(); q.fillStyle = 'rgba(255,255,255,0.25)'; or11Yuv(q, -hw + 13, -H + 26, 2.2, H + ay - 46, 1.1); q.fill(); }
    // hacim (cila): sağ kenarda ay ışığı kenar çizgisi, solda keskin emaye parlaması, gövde altında yumuşak gölge
    if (!sonuk) {
      const gs = q.createLinearGradient(-hw, 0, hw, 0);
      gs.addColorStop(0, 'rgba(255,255,255,0)'); gs.addColorStop(0.2, 'rgba(255,255,255,0)'); gs.addColorStop(0.27, 'rgba(255,255,255,0.75)'); gs.addColorStop(0.33, 'rgba(255,255,255,0)');
      gs.addColorStop(0.84, 'rgba(255,255,255,0)'); gs.addColorStop(0.92, 'rgba(207,230,255,0.5)'); gs.addColorStop(0.97, 'rgba(207,230,255,0)');
      q.fillStyle = gs; or11Yuv(q, -hw, -H + 10, W, H + ay - 8, 6); q.fill();
      const gd = q.createLinearGradient(0, ay - 70, 0, ay); gd.addColorStop(0, 'rgba(42,33,88,0)'); gd.addColorStop(1, 'rgba(42,33,88,0.32)');
      q.fillStyle = gd; or11Yuv(q, -hw, ay - 70, W, 72, 4); q.fill();
      const gt = q.createLinearGradient(0, -H, 0, -H + 40); gt.addColorStop(0, 'rgba(255,255,255,0.3)'); gt.addColorStop(1, 'rgba(255,255,255,0)');
      q.fillStyle = gt; or11Yuv(q, -hw, -H, W, 40, 6); q.fill();
    }
    // tepe ağzı (açık uç)
    q.fillStyle = P(or11Hex(col, '#ffffff', 0.45)); q.beginPath(); q.ellipse(0, -H, hw, 6, 0, 0, 6.2832); q.fill();
    q.strokeStyle = OR11_KONTUR; q.lineWidth = 2; q.stroke();
    q.fillStyle = sonuk ? '#1d1840' : '#2a2158'; q.beginPath(); q.ellipse(0, -H + 0.5, hw - 5, 3.6, 0, 0, 6.2832); q.fill();
    if (!sonuk) { q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 1.4; q.beginPath(); q.ellipse(0, -H, hw - 1.5, 4.8, 0, Math.PI * 0.05, Math.PI * 0.95); q.stroke(); }   // ön dudakta parlak kenar
    // altın bilezikler
    const altin = P(OR11_ALTIN), altin2 = P(OR11_ALTIN2);
    for (const by of [-H + 14, ay - 4]) {
      q.fillStyle = OR11_KONTUR; or11Yuv(q, -hw - 2.5, by - 4.5, W + 5, 9, 3.5); q.fill();
      q.fillStyle = altin; or11Yuv(q, -hw - 1.5, by - 3.5, W + 3, 7, 3); q.fill();
      q.fillStyle = altin2; or11Yuv(q, -hw + 2, by - 3, W - 10, 2.2, 1.1); q.fill();
      if (!sonuk) {
        const gb = q.createLinearGradient(-hw, 0, hw, 0); gb.addColorStop(0, 'rgba(255,255,255,0)'); gb.addColorStop(0.25, 'rgba(255,255,255,0.9)'); gb.addColorStop(0.4, 'rgba(255,255,255,0)'); gb.addColorStop(1, 'rgba(90,50,20,0.3)');
        q.fillStyle = gb; or11Yuv(q, -hw - 1.5, by - 3.5, W + 3, 7, 3); q.fill();
        q.fillStyle = 'rgba(42,33,88,0.28)'; or11Yuv(q, -hw + 1, by + 4.5, W - 2, 3.5, 1.5); q.fill();   // bileziğin gövdeye düşen gölgesi
      }
    }
    // ayak: koni (gövdeden aşağı daralır), açık altın-pastel
    q.fillStyle = OR11_KONTUR; q.beginPath(); q.moveTo(-hw * 0.92 - 1.5, ay - 1); q.lineTo(hw * 0.92 + 1.5, ay - 1); q.lineTo(hw * 0.3 + 1.5, 1); q.lineTo(-hw * 0.3 - 1.5, 1); q.closePath(); q.fill();
    const ga = q.createLinearGradient(-hw, 0, hw, 0); ga.addColorStop(0, P(or11Hex(col, '#ffffff', 0.55))); ga.addColorStop(0.5, P(or11Hex(col, OR11_ALTIN, 0.45))); ga.addColorStop(1, P(or11Hex(col, '#6d55b0', 0.35)));
    q.fillStyle = ga; q.beginPath(); q.moveTo(-hw * 0.92, ay); q.lineTo(hw * 0.92, ay); q.lineTo(hw * 0.3, -0.5); q.lineTo(-hw * 0.3, -0.5); q.closePath(); q.fill();
    // ağız kısmı: yüzün oturduğu hafif açık oval + pembe yanaklar
    q.fillStyle = sonuk ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.22)'; q.beginPath(); q.ellipse(0, ay - 26, hw - 6, 22, 0, 0, 6.2832); q.fill();
    if (!sonuk) { q.fillStyle = 'rgba(255,120,170,0.42)'; for (const s of [-1, 1]) { q.beginPath(); q.ellipse(s * 13.5, ay - 21, 5, 3.2, 0, 0, 6.2832); q.fill(); } }
    // işleme (ay / yıldız / kalp / yarasa), altın
    const ey = -H + 46, amb = OR11_AMB[i];
    q.fillStyle = OR11_KONTUR; q.strokeStyle = OR11_KONTUR; q.lineWidth = 2.6;
    const amblem = (f) => { f(); q.stroke(); q.fillStyle = altin; f(); q.fill(); };
    if (amb === 'ay') amblem(() => or11Hilal(q, 0, ey, 11, 1));
    else if (amb === 'yildiz') amblem(() => or11Yildiz(q, 0, ey, 11, 0.46));
    else if (amb === 'kalp') amblem(() => or11Kalp(q, 0, ey, 9.5));
    else amblem(() => or11Yarasa(q, 0, ey, 12));
    if (!sonuk) { q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.arc(-3, ey - 4, 1.6, 0, 6.2832); q.fill(); }
    // işlemenin çevresinde minik altın noktalar
    q.fillStyle = altin2; for (let j = 0; j < 6; j++) { const a = j / 6 * 6.2832 + 0.3; q.beginPath(); q.arc(Math.cos(a) * 17, ey + Math.sin(a) * 17, 1.3, 0, 6.2832); q.fill(); }
  }, OR11_R);
}
// mixc rgba döndürür; sprite içinde ara rengi yeniden karıştırmak için onaltılık sürüm
function or11Hex(a, b, t) { const A = hex(a), B = hex(b); const h = v => ('0' + Math.round(v).toString(16)).slice(-2); return '#' + h(lerp(A[0], B[0], t)) + h(lerp(A[1], B[1], t)) + h(lerp(A[2], B[2], t)); }

// ── arka pano, yan kulecikler, tepe hilali (çapa: orgun ortası, zemin) ──
function or11ArkaSpr(sonuk) {
  const P = or11P(sonuk);
  return or11Spr(500, 470, 250, 580, q => {
    const R = rng(1107);
    // yan kulecikler: minik süs boruları + soğan kubbe + yarasa kancası
    for (const s of [-1, 1]) {
      const x0 = s * 168, x1 = s * 214, xl = Math.min(x0, x1), w = Math.abs(x1 - x0);
      q.fillStyle = OR11_KONTUR; or11Yuv(q, xl - 2, -376, w + 4, 262, 8); q.fill();
      q.fillStyle = P('#6d55b0'); or11Yuv(q, xl, -374, w, 258, 7); q.fill();
      q.fillStyle = P('#8a6cc8'); or11Yuv(q, xl + 4, -366, w - 8, 244, 5); q.fill();
      // üç minik süs borusu
      const pr = ['#d9c8ff', '#ffd6e6', '#c8f5e4'];
      for (let j = 0; j < 3; j++) {
        const px = s * (176 + j * 15), ph = 150 + (j === 1 ? 40 : 0) + R() * 18, pw = 10;
        q.fillStyle = OR11_KONTUR; or11Yuv(q, px - pw / 2 - 1.5, -128 - ph - 1.5, pw + 3, ph + 3, 4); q.fill();
        q.fillStyle = P(pr[j]); or11Yuv(q, px - pw / 2, -128 - ph, pw, ph, 3.5); q.fill();
        if (!sonuk) { q.fillStyle = 'rgba(255,255,255,0.5)'; q.fillRect(px - pw / 2 + 2, -128 - ph + 5, 2, ph - 12); }
        q.fillStyle = P(OR11_ALTIN); q.fillRect(px - pw / 2 - 1, -128 - ph + 8, pw + 2, 3);
        q.fillStyle = P('#2a2158'); q.beginPath(); q.ellipse(px, -128 - ph, pw / 2 - 1.5, 1.6, 0, 0, 6.2832); q.fill();
      }
      // soğan kubbe
      const dx = s * 191, dy = -374;
      const kubbe = () => { q.beginPath(); q.moveTo(dx - 26, dy); q.bezierCurveTo(dx - 30, dy - 22, dx - 6, dy - 30, dx, dy - 50); q.bezierCurveTo(dx + 6, dy - 30, dx + 30, dy - 22, dx + 26, dy); q.closePath(); };
      q.fillStyle = OR11_KONTUR; q.lineWidth = 5; q.strokeStyle = OR11_KONTUR; kubbe(); q.stroke();
      const gk = q.createLinearGradient(dx - 26, 0, dx + 26, 0); gk.addColorStop(0, P('#e6d6ff')); gk.addColorStop(0.45, P('#c39bff')); gk.addColorStop(1, P('#7d5cc4'));
      q.fillStyle = gk; kubbe(); q.fill();
      q.strokeStyle = P(OR11_ALTIN); q.lineWidth = 1.6; for (const k of [-0.5, 0, 0.5]) { q.beginPath(); q.moveTo(dx + k * 40, dy); q.quadraticCurveTo(dx + k * 26, dy - 26, dx, dy - 48); q.stroke(); }
      q.fillStyle = P(OR11_ALTIN); q.beginPath(); q.arc(dx, dy - 52, 4, 0, 6.2832); q.fill();
      q.fillStyle = P(OR11_ALTIN2); or11Yildiz(q, dx, dy - 62, 6, 0.45); q.fill();
      q.fillStyle = P(OR11_ALTIN); or11Yuv(q, dx - 29, dy - 3, 58, 7, 3); q.fill();
      // yarasa kancası: kulecikten dışa uzanan kıvrık altın kol
      q.strokeStyle = OR11_KONTUR; q.lineWidth = 5.5; q.beginPath(); q.moveTo(s * 212, -350); q.quadraticCurveTo(s * 228, -352, s * 226, -366); q.stroke();
      q.strokeStyle = P(OR11_ALTIN); q.lineWidth = 3; q.beginPath(); q.moveTo(s * 212, -350); q.quadraticCurveTo(s * 228, -352, s * 226, -366); q.stroke();
      q.fillStyle = P(OR11_ALTIN2); q.beginPath(); q.arc(s * 226, -367, 2.6, 0, 6.2832); q.fill();
    }
    // kadife arka pano: kemerli
    const pano = (e) => { q.beginPath(); q.moveTo(-168 - e, -112); q.lineTo(-168 - e, -400); q.quadraticCurveTo(0, -556 - e * 2, 168 + e, -400); q.lineTo(168 + e, -112); q.closePath(); };
    q.fillStyle = OR11_KONTUR; pano(3); q.fill();
    q.fillStyle = P(OR11_ALTIN); pano(0); q.fill();
    const gp = q.createLinearGradient(0, -480, 0, -112); gp.addColorStop(0, P('#4b3a8c')); gp.addColorStop(1, P('#2a2158'));
    q.fillStyle = gp; q.save(); q.translate(0, 4); q.scale(0.95, 0.985); pano(0); q.restore(); q.fill();
    // kadife kıvrımları
    q.save(); pano(-8); q.clip();
    for (let x = -160; x <= 160; x += 26) { q.fillStyle = sonuk ? 'rgba(255,255,255,0.025)' : 'rgba(217,200,255,0.07)'; q.fillRect(x, -560, 9, 460); }
    // pano üstünde altın yıldız tozu
    for (let j = 0; j < 34; j++) { const x = (R() - 0.5) * 320, y = -130 - R() * 340; q.fillStyle = P(j % 3 ? OR11_ALTIN2 : '#cfe6ff'); or11Yildiz(q, x, y, 1.6 + R() * 2.4, 0.45, 4); q.fill(); }
    q.restore();
    // kemerin omuzlarında altın kıvrımlar
    q.strokeStyle = P(OR11_ALTIN2); q.lineWidth = 2.2;
    for (const s of [-1, 1]) { q.beginPath(); q.arc(s * 130, -432, 10, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2.6 : -Math.PI * 1.6, s < 0); q.stroke(); q.beginPath(); q.arc(s * 108, -452, 6, 0, 6.2832); q.stroke(); }
    // tepe: gülümseyen altın hilal + iki yıldız
    const hx = 0, hy = -510;
    q.fillStyle = OR11_KONTUR; q.lineWidth = 6; q.strokeStyle = OR11_KONTUR; or11Hilal(q, hx, hy, 34, 1); q.stroke();
    const gh = q.createLinearGradient(-34, hy - 34, 20, hy + 34); gh.addColorStop(0, P('#fff4d6')); gh.addColorStop(0.6, P(OR11_ALTIN2)); gh.addColorStop(1, P('#e8b04a'));
    q.fillStyle = gh; or11Hilal(q, hx, hy, 34, 1); q.fill();
    // hilalin yüzü (iç kavise bakar): kapalı gülen göz, gülümseme, yanak
    q.strokeStyle = sonuk ? '#3a2c74' : '#7a4a3a'; q.lineWidth = 2.2;
    q.beginPath(); q.arc(-19, hy - 9, 3.6, Math.PI * 1.15, Math.PI * 1.85); q.stroke();
    q.beginPath(); q.arc(-17, hy + 4, 5.5, 0.2 * Math.PI, 0.75 * Math.PI); q.stroke();
    if (!sonuk) { q.fillStyle = 'rgba(255,140,170,0.55)'; q.beginPath(); q.ellipse(-25, hy - 1, 3.6, 2.4, 0, 0, 6.2832); q.fill(); }
    for (const s of [-1, 1]) { q.fillStyle = OR11_KONTUR; or11Yildiz(q, s * 52, hy + 6, 11, 0.45); q.fill(); q.fillStyle = P(OR11_ALTIN2); or11Yildiz(q, s * 52, hy + 6, 8.5, 0.45); q.fill(); }
    // panonun altında gövdeye oturan altın korniş
    q.fillStyle = OR11_KONTUR; or11Yuv(q, -222, -124, 444, 14, 6); q.fill();
    q.fillStyle = P(OR11_ALTIN); or11Yuv(q, -220, -122, 440, 10, 5); q.fill();
  }, OR11_R2);
}
// ── gövde: lavanta tahta, altın süsler, klavye, nota sehpası (çapa: orgun ortası, zemin) ──
function or11KasaSpr(sonuk) {
  const P = or11P(sonuk);
  return or11Spr(452, 150, 226, 140, q => {
    // gövde
    q.fillStyle = OR11_KONTUR; or11Yuv(q, -209, -136, 418, 134, 14); q.fill();
    const gk = q.createLinearGradient(0, -132, 0, -6); gk.addColorStop(0, P('#c8b2f0')); gk.addColorStop(0.55, P('#a689dc')); gk.addColorStop(1, P('#7d5cc4'));
    q.fillStyle = gk; or11Yuv(q, -206, -133, 412, 128, 12); q.fill();
    // yan panolar: kemerli nişler, içinde ay ve kalp
    for (const s of [-1, 1]) for (let j = 0; j < 2; j++) {
      const cx = s * (j ? 172 : 136), w = 30;
      q.fillStyle = OR11_KONTUR; or11Yuv(q, cx - w / 2 - 2, -112, w + 4, 86, 14); q.fill();
      q.fillStyle = P('#8a6cc8'); or11Yuv(q, cx - w / 2, -110, w, 82, 13); q.fill();
      q.fillStyle = P(j ? '#ffb3d1' : OR11_ALTIN2);
      if (j) or11Kalp(q, cx, -70, 6); else or11Hilal(q, cx, -70, 8, s);
      q.fill();
    }
    // klavye masası (ortada öne çıkıntı)
    q.fillStyle = OR11_KONTUR; or11Yuv(q, -122, -98, 244, 42, 8); q.fill();
    q.fillStyle = P('#6d55b0'); or11Yuv(q, -120, -96, 240, 38, 7); q.fill();
    // tuşlar: beyaz (krem) + lila
    q.fillStyle = P('#fff8ee'); for (let j = 0; j < 16; j++) { q.fillStyle = P('#fff8ee'); or11Yuv(q, -108 + j * 13.5, -86, 12, 20, 2.5); q.fill(); }
    q.fillStyle = P('#5a4a8a'); for (let j = 0; j < 15; j++) { if (j % 7 === 2 || j % 7 === 6) continue; or11Yuv(q, -99 + j * 13.5, -86, 7, 11, 2); q.fill(); }
    q.fillStyle = sonuk ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.35)'; q.fillRect(-110, -64, 220, 2);
    // nota sehpası: altın çerçeve, krem kâğıt, minik notalar
    q.fillStyle = OR11_KONTUR; or11Yuv(q, -44, -130, 88, 34, 5); q.fill();
    q.fillStyle = P(OR11_ALTIN); or11Yuv(q, -42, -128, 84, 30, 4); q.fill();
    q.fillStyle = P('#fff6e0'); or11Yuv(q, -37, -125, 74, 24, 3); q.fill();
    q.strokeStyle = P('#c3b0e8'); q.lineWidth = 0.7; for (let j = 0; j < 4; j++) { q.beginPath(); q.moveTo(-33, -120 + j * 4.5); q.lineTo(33, -120 + j * 4.5); q.stroke(); }
    q.fillStyle = P('#8a6cc8'); for (let j = 0; j < 7; j++) { const x = -27 + j * 9, y = -108 - (j % 3) * 3.5; q.beginPath(); q.ellipse(x, y, 2.2, 1.6, -0.4, 0, 6.2832); q.fill(); q.fillRect(x + 1.6, y - 8, 0.9, 8); }
    q.fillStyle = P('#ff7a9a'); or11Kalp(q, 30, -103, 2.6); q.fill();
    // üst altın korniş ve alt kaide
    q.fillStyle = P(OR11_ALTIN); or11Yuv(q, -212, -138, 424, 9, 4); q.fill();
    q.fillStyle = P(OR11_ALTIN2); q.fillRect(-206, -136, 412, 2);
    q.fillStyle = OR11_KONTUR; or11Yuv(q, -214, -16, 428, 16, 6); q.fill();
    q.fillStyle = P('#6d55b0'); or11Yuv(q, -212, -14, 424, 12, 5); q.fill();
    q.fillStyle = P(OR11_ALTIN); q.fillRect(-210, -14, 420, 2.2);
    // kıvrık altın ayaklar
    for (const fx of [-198, -100, 100, 198]) { q.fillStyle = OR11_KONTUR; q.beginPath(); q.ellipse(fx, -1, 11, 6, 0, 0, 6.2832); q.fill(); q.fillStyle = P(OR11_ALTIN); q.beginPath(); q.ellipse(fx, -2, 9, 4.5, 0, 0, 6.2832); q.fill(); q.fillStyle = P(OR11_ALTIN2); q.beginPath(); q.ellipse(fx - 3, -3.5, 3, 1.4, 0, 0, 6.2832); q.fill(); }
    // gövde üstü: pedal yerine minik yıldız sırası
    q.fillStyle = P(OR11_ALTIN2); for (let j = 0; j < 9; j++) { or11Yildiz(q, -96 + j * 24, -40, 3, 0.45); q.fill(); }
    if (!sonuk) { q.fillStyle = 'rgba(255,255,255,0.18)'; or11Yuv(q, -200, -128, 400, 10, 5); q.fill(); }
  }, OR11_R);
}
// ── ay ışığı apliği: altın kol + kâse (ışık topu karede, katmanlı glow ile) ──
function or11AplikSpr() {
  return or11Spr(44, 70, 22, 46, q => {
    q.strokeStyle = OR11_KONTUR; q.lineWidth = 6; q.beginPath(); q.moveTo(0, 20); q.quadraticCurveTo(-14, 6, 0, -4); q.stroke();
    q.strokeStyle = OR11_ALTIN; q.lineWidth = 3.2; q.beginPath(); q.moveTo(0, 20); q.quadraticCurveTo(-14, 6, 0, -4); q.stroke();
    q.fillStyle = OR11_KONTUR; q.beginPath(); q.moveTo(-15, -6); q.quadraticCurveTo(0, 8, 15, -6); q.closePath(); q.fill(); q.lineWidth = 3; q.stroke();
    q.fillStyle = OR11_ALTIN; q.beginPath(); q.moveTo(-13, -5.5); q.quadraticCurveTo(0, 6, 13, -5.5); q.closePath(); q.fill();
    q.fillStyle = OR11_ALTIN2; q.fillRect(-12, -6.5, 24, 2);
    q.fillStyle = OR11_KONTUR; q.beginPath(); q.arc(0, 21, 5, 0, 6.2832); q.fill(); q.fillStyle = OR11_ALTIN; q.beginPath(); q.arc(0, 21, 3.4, 0, 6.2832); q.fill();
  }, OR11_R);
}
// ── Pıtır'ın kadife minderi (çapa: alt orta) ──
function or11MinderSpr() {
  return or11Spr(80, 34, 40, 30, q => {
    const yol = () => { q.beginPath(); q.ellipse(0, -11, 32, 12.5, 0, 0, 6.2832); };
    q.strokeStyle = OR11_KONTUR; q.lineWidth = 3; yol(); q.stroke();
    const gm = q.createLinearGradient(0, -24, 0, 2); gm.addColorStop(0, '#ffc6dc'); gm.addColorStop(0.6, '#ff8fb0'); gm.addColorStop(1, '#d9668f');
    q.fillStyle = gm; yol(); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.4)'; q.beginPath(); q.ellipse(-8, -17, 15, 4, -0.1, 0, 6.2832); q.fill();
    q.fillStyle = '#c94f7c'; q.beginPath(); q.arc(0, -11, 2.2, 0, 6.2832); q.fill();   // düğme
    for (const s of [-1, 1]) {   // altın püsküller
      q.strokeStyle = OR11_ALTIN; q.lineWidth = 1.6; q.beginPath(); q.moveTo(s * 30, -8); q.lineTo(s * 34, 0); q.stroke();
      q.fillStyle = OR11_ALTIN; q.beginPath(); q.moveTo(s * 34, -2); q.lineTo(s * 37, 4); q.lineTo(s * 31, 4); q.closePath(); q.fill();
    }
  }, OR11_R);
}
// ── küçükler: ışık notası (renk başına), parıltı yıldızı, uyku "z"si, zemin gölgesi ──
const OR11_NOTA = new Map();
function or11NotaSpr(col) {
  let sp = OR11_NOTA.get(col); if (sp) return sp;
  sp = or11Spr(22, 28, 9, 16, q => {
    const ciz = (renk, e) => {
      q.fillStyle = renk; q.strokeStyle = renk;
      q.beginPath(); q.ellipse(-1.6, 6, 4.6 + e, 3.5 + e, -0.4, 0, 6.2832); q.fill();
      q.lineWidth = 2.2 + e * 2; q.beginPath(); q.moveTo(2.4, 5); q.lineTo(2.4, -12); q.stroke();
      q.lineWidth = 1 + e * 2; q.beginPath(); q.moveTo(2.4, -12.6); q.quadraticCurveTo(10.2, -9.4, 8.8, -2); q.quadraticCurveTo(7, -6.2, 2.4, -6.8); q.closePath(); q.fill(); q.stroke();
    };
    ciz(mixc(col, '#3b2a6e', 0.5), 0.85); ciz(mixc(col, '#ffffff', 0.5), 0);
    q.fillStyle = '#ffffff'; q.beginPath(); q.ellipse(-3, 4.8, 1.5, 0.9, -0.4, 0, 6.2832); q.fill();
  }, 3);
  OR11_NOTA.set(col, sp); return sp;
}
const OR11_S = { hazir: false, adim: 0, boru: [], boruS: [] };
// hazırlık işleri (sırayla; Feza yaklaşırken her karede biri yapılır, takılma olmasın)
const OR11_ISLER = [
  () => { OR11_S.arka = or11ArkaSpr(false); },
  () => { OR11_S.arkaS = or11ArkaSpr(true); },
  () => { OR11_S.kasa = or11KasaSpr(false); },
  () => { OR11_S.kasaS = or11KasaSpr(true); },
  () => { for (let i = 0; i < 3; i++) OR11_S.boru[i] = or11BoruSpr(i, false); },
  () => { for (let i = 3; i < 6; i++) OR11_S.boru[i] = or11BoruSpr(i, false); },
  () => { for (let i = 0; i < 6; i++) OR11_S.boruS[i] = or11BoruSpr(i, true); },
  () => {
    OR11_S.aplik = or11AplikSpr(); OR11_S.minder = or11MinderSpr();
    OR11_S.yildiz = or11Spr(10, 10, 5, 5, q => { q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, r = i % 2 ? 1.1 : 4.6; q.lineTo(Math.cos(a) * r, Math.sin(a) * r); } q.closePath(); q.fill(); }, 3);
    OR11_S.z = or11Spr(10, 10, 5, 5, q => { q.strokeStyle = OR11_KONTUR; q.lineWidth = 2.6; const z = () => { q.beginPath(); q.moveTo(-2.6, -2.6); q.lineTo(2.6, -2.6); q.lineTo(-2.6, 2.6); q.lineTo(2.6, 2.6); q.stroke(); }; z(); q.strokeStyle = '#e8dcff'; q.lineWidth = 1.4; z(); }, 3);
    OR11_S.golge = or11Spr(40, 10, 20, 5, q => { const gr = q.createRadialGradient(0, 0, 0, 0, 0, 20); gr.addColorStop(0, 'rgba(29,24,64,0.55)'); gr.addColorStop(0.6, 'rgba(29,24,64,0.22)'); gr.addColorStop(1, 'rgba(29,24,64,0)'); q.fillStyle = gr; q.save(); q.scale(1, 0.25); q.beginPath(); q.arc(0, 0, 20, 0, 6.2832); q.fill(); q.restore(); }, 3);
    for (const c of OR11_REN) or11NotaSpr(c); or11NotaSpr(OR11_ALTIN2);
  }
];
function or11HazirlaAdim() { if (OR11_S.hazir) return; OR11_ISLER[OR11_S.adim++](); if (OR11_S.adim >= OR11_ISLER.length) OR11_S.hazir = true; }
function or11Hazirla() { while (!OR11_S.hazir) or11HazirlaAdim(); }

// ── parçacıklar (sabit havuz): ışık notaları, ışık halkaları, parıltılar ──
const OR11_NT = []; for (let i = 0; i < 30; i++) OR11_NT.push({ a: false, x: 0, y: 0, vx: 0, t: 0, max: 1, col: '#ffffff', sp: null, s: 1, ph: 0 });
const OR11_HL = []; for (let i = 0; i < 16; i++) OR11_HL.push({ a: false, x: 0, y: 0, t: 0, max: 1, col: '#ffffff', r: 1 });
const OR11_TZ = []; for (let i = 0; i < 110; i++) OR11_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, col: '#ffffff', s: 1 });
const OR11_SUT = []; for (let i = 0; i < 14; i++) OR11_SUT.push({ a: false, x: 0, y0: 0, y1: 0, t: 0, max: 1, col: '#ffffff', gec: 0 });
const OR11_EK = { t: 0, col: '#ffffff' };   // kısa ekran parıltısı
function or11Sutun(x, y0, y1, col) {   // borunun ağzından tavana: biri hemen, ikisi peş peşe
  let n = 0; for (const p of OR11_SUT) if (!p.a) { p.a = true; p.x = x; p.y0 = y0; p.y1 = y1; p.t = -n * 0.16; p.max = 1.3; p.col = col; if (++n >= 3) break; }
}
function or11NotaUcur(x, y, col, s) {
  for (const p of OR11_NT) if (!p.a) { p.a = true; p.x = x; p.y = y; p.vx = (Math.random() - 0.5) * 50; p.t = 0; p.max = 1.7 + Math.random() * 0.5; p.col = col; p.sp = or11NotaSpr(col); p.s = s || 1; p.ph = Math.random() * 6.28; return p; }
  return null;
}
function or11Halka(x, y, col, r) { for (const p of OR11_HL) if (!p.a) { p.a = true; p.x = x; p.y = y; p.t = 0; p.max = 1.1; p.col = col; p.r = r || 1; return p; } return null; }
function or11Toz(tip, x, y, vx, vy, max, s, col) {
  for (const p of OR11_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; return p; }
  return null;
}
function or11Kivilcim(x, y, n, col, hiz) {
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = (hiz || 90) * (0.35 + Math.random() * 0.75); or11Toz(i % 3 === 0 ? 1 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 25, 0.6 + Math.random() * 0.5, 3 + Math.random() * 4, i % 2 ? col : '#ffffff'); }
}
function or11ParcaAdim(dt) {
  for (const p of OR11_NT) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; } p.y -= (52 + 26 * (1 - p.t / p.max)) * dt; p.x += (p.vx + Math.sin(p.t * 3.2 + p.ph) * 22) * dt; p.vx *= Math.exp(-dt * 2); }
  for (const p of OR11_HL) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) p.a = false; }
  for (const p of OR11_SUT) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) p.a = false; }
  OR11_EK.t = Math.max(0, OR11_EK.t - dt * 2.6);
  for (const p of OR11_TZ) { if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; } p.vx *= Math.exp(-dt * 2.2); p.vy = p.vy * Math.exp(-dt * 2.2) + (p.tip === 2 ? 40 : -10) * dt; p.x += p.vx * dt; p.y += p.vy * dt; }
}
function or11ParcaCiz() {
  g.globalCompositeOperation = 'lighter';
  for (const p of OR11_TZ) {
    if (!p.a) continue; const f = 1 - p.t / p.max;
    dglow(p.col, p.x, p.y, p.s * (1 + f), f * 0.9);
    if (p.tip === 1) { g.globalAlpha = f; g.drawImage(OR11_S.yildiz.c, p.x - p.s * 0.7, p.y - p.s * 0.7, p.s * 1.4, p.s * 1.4); g.globalAlpha = 1; }
  }
  for (const p of OR11_NT) { if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u); dglow(p.col, p.x, p.y, 24 * p.s, al * 0.6); }
  // ışık halkaları: borunun ağzından yükselip genişleyen yumuşak halka (iki çizgi: renkli + beyaz iç)
  for (const p of OR11_HL) {
    if (!p.a) continue; const u = p.t / p.max, e = 1 - u, r = (14 + 46 * smooth(Math.min(1, u * 1.3))) * p.r, y = p.y - u * 54 * p.r;
    g.globalAlpha = e * 0.85; g.strokeStyle = p.col; g.lineWidth = 5 * e + 1; g.beginPath(); g.ellipse(p.x, y, r, r * 0.34, 0, 0, 6.2832); g.stroke();
    g.globalAlpha = e * 0.6; g.strokeStyle = '#ffffff'; g.lineWidth = 1.6 * e + 0.4; g.beginPath(); g.ellipse(p.x, y, r * 0.92, r * 0.3, 0, 0, 6.2832); g.stroke();
  }
  // ışık sütunu: borudan tavana yükselen nota renginde halkalar + incecik ışık şeridi
  for (const p of OR11_SUT) {
    if (!p.a || p.t < 0) continue; g.globalAlpha = 1; const u = p.t / p.max, e = 1 - u, uy = smooth(Math.min(1, u * 1.1)), y = p.y0 + (p.y1 - p.y0) * uy, r = 22 + 20 * uy;
    or11Glow(g, p.col, p.x, (p.y0 + y) / 2, 24 + 10 * e, Math.abs(y - p.y0) / 2 + 30, e * 0.55);
    or11Glow(g, '#ffffff', p.x, (p.y0 + y) / 2, 8, Math.abs(y - p.y0) / 2 + 10, e * 0.35);
    or11Glow(g, p.col, p.x, y, r * 1.7, r * 0.9, e * 0.85);
    g.globalAlpha = e * 0.95; g.strokeStyle = p.col; g.lineWidth = 6 * e + 1.5; g.beginPath(); g.ellipse(p.x, y, r, r * 0.32, 0, 0, 6.2832); g.stroke();
    g.globalAlpha = e * 0.7; g.strokeStyle = '#ffffff'; g.lineWidth = 1.4; g.beginPath(); g.ellipse(p.x, y - 1, r * 0.86, r * 0.26, 0, Math.PI, 6.2832); g.stroke();
  }
  g.globalAlpha = 1;
  if (OR11_EK.t > 0.01 && typeof cam !== 'undefined') { const z = cam.zoom || 1, w = VW / z, h = VH / z; or11Glow(g, OR11_EK.col, cam.x + w / 2, cam.y + h * 0.42, w * 0.75, h * 0.7, OR11_EK.t * 0.16); }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  for (const p of OR11_NT) {
    if (!p.a) continue; const u = p.t / p.max, al = Math.min(1, u * 6) * (1 - u * u), sc = p.s * (0.7 + 0.3 * Math.min(1, u * 4)), r = Math.sin(p.t * 2.5 + p.ph) * 0.25;
    g.globalAlpha = al; g.translate(p.x, p.y); g.rotate(r); g.drawImage(p.sp.c, -p.sp.ox * sc, -p.sp.oy * sc, p.sp.w * sc, p.sp.h * sc); g.rotate(-r); g.translate(-p.x, -p.y); g.globalAlpha = 1;
  }
}

// ══════════════════════ mini oyun ══════════════════════
const ORG11 = {
  o: null,
  get aktif() { const o = this.o; return o && o.or && o.or.aktif && !o.done ? o : null; },
  vurus() { const o = this.o; return o && o.or ? o.or.saat / OR11_VUR : 0; },   // 'orgBasla'dan beri geçen vuruş (104 BPM)
  faz() { const o = this.o; return o && o.or ? o.or.faz : 'bekle'; },
  ezgi: OR11_EZGI, final: OR11_FINAL
};
function or11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function or11Cx(o) { return o.x + OR11_CX; }
function or11Taban(o) { return o.y - OR11_KASA; }
function or11Hedef(o) { const k = o.or; return k.faz === 'cal' && k.cumle < 4 && k.adim < 4 ? OR11_EZGI[k.cumle][k.adim] : -1; }
// boru şarkı söyler: nota + ışık halkası + yükselen notalar (+ Dede figürü, Pıtır alkışı)
function or11Cal(o, i, figur, sessiz) {
  const k = o.or, b = k.boru[i];
  if (!sessiz) or11Sfx('orgNota', i);
  b.cal = 1; b.uyan = true; b.uyku = Math.min(b.uyku, 0.2); b.sarki = 1;
  const x = b.x, ust = b.top;
  or11Halka(x, ust + 2, OR11_REN[i], 1); or11NotaUcur(x + (Math.random() - 0.5) * 10, ust - 8, OR11_REN[i], 1.1);
  if (Math.random() < 0.6) or11NotaUcur(x + (Math.random() - 0.5) * 24, ust - 22, OR11_ALTIN2, 0.85);
  or11Kivilcim(x, ust, 6, OR11_REN[i], 90);
  or11Sutun(x, ust - 4, o.y - 620, OR11_REN[i]);
  OR11_EK.t = Math.max(OR11_EK.t, 0.6); OR11_EK.col = OR11_REN[i];
  k.flas = 1; k.yarasaHop = 1;
  if (figur) { const d = k.dede; d.har = OR11_FIG[d.fig++ % OR11_FIG.length]; d.hu = 0; d.harS = OR11_FIG_S; }
  k.pitir = Math.max(k.pitir, 0.9);
}
// dokunuş (çocuk ya da Pırıl): sıradaki boruysa ezgi ilerler; değilse o da kendi notasını söyler (yanlış yok)
function or11Dokun(o, i, yardim) {
  const k = o.or; if (!k.aktif || i < 0 || i > 5) return;
  if (!yardim) { k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; } }
  if (k.faz === 'cal') {
    const h = OR11_EZGI[k.cumle][k.adim];
    if (i === h) {
      or11Cal(o, i, true); k.adim++; k.say++;
      { const b = k.boru[i]; or11Kivilcim(b.x, b.top, 8, '#ffe7a8', 130); OR11_EK.t = 1; if (k.adim >= 4) { or11Halka(b.x, b.top - 30, '#ffffff', 1.8); for (const bb of k.boru) or11Sutun(bb.x, bb.top - 4, o.y - 620, OR11_REN[bb.i]); } }
      OLAY.emit('orgNota', { o, n: k.say, i, cumle: k.cumle + 1, yardim: !!yardim });
      if (k.adim >= 4) { k.faz = 'ara'; k.fT = 0; k.b0 = Math.ceil((k.saat / OR11_VUR + 0.75) / 3) * 3; k.fzSev = 1; }   // bir sonraki ölçü başında dans
      return;
    }
    or11Cal(o, i, true); OLAY.emit('orgSerbest', { o, i });
    return;
  }
  if (k.faz === 'final' || k.faz === 'don') { const b = k.boru[i]; or11Kivilcim(b.x, b.top, 6, OR11_REN[i], 80); return; }   // finali bozmayan sessiz parıltı
  or11Cal(o, i, k.faz !== 'dans'); OLAY.emit('orgSerbest', { o, i });
}
function or11Faz(o, f, b0) {
  const k = o.or; k.faz = f; k.fT = 0; k.b0 = b0; k.sonVur = Math.floor(b0) - 1;
  if (f === 'tanit') k.nota = 0;
  else if (f === 'dans') { k.dansN = k.cumle + 1; or11Sfx('orgDans', k.dansN); OLAY.emit('orgDans', { o, n: k.dansN, vurus: b0 }); const d = k.dede; d.har = null; }
  else if (f === 'final') { k.nota = 0; or11Sfx('orgDans', 4); OLAY.emit('orgDans', { o, n: 4, vurus: b0 }); }
}
function or11Vurus(o, vb, fn) { const k = o.or, bi = Math.floor(vb + 1e-6); if (bi > k.sonVur) { k.sonVur = bi; k.flas = Math.max(k.flas, 0.6); fn(bi - Math.round(k.b0)); } }
function or11GirdiBirak() { if (typeof omHepsiniBirak === 'function') { try { omHepsiniBirak(); } catch (e) {} } }
function or11Aktiflestir(o) {
  const k = o.or; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || !P.ground || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi')) return false;
  const e = k.entry; e.x0 = P.x; e.x = o.x - OR11_GIRIS; e.y = o.y;
  k.aktif = true; k.fT = 0; k.idle = 0; k.helpOn = false; k.helpT = 0; k.dalis = 0; k.fzx = P.x; ORG11.o = o; or11GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; }
  for (const b of k.boru) if (!b.uyan) b.uyku = Math.max(b.uyku, 0.6);
  if (k.adim >= 4) k.adim = 0;   // yarıda kalan cümle baştan
  if (!k.basladi) { k.saat = 0; }
  or11Faz(o, 'gel', Math.ceil(k.saat / OR11_VUR / 3) * 3);
  if (!k.basladi) { k.basladi = true; OLAY.emit('orgBasla', { o }); }
  return true;
}
function or11Birak(o, tamam) {   // güvenli dönüş: Feza orgun solunda, sağa bakarak bırakılır
  const k = o.or, e = k.entry;
  if (k.aktif && P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.x; P.safeY = e.y; P.f = 1;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  const aktifti = k.aktif;
  k.aktif = false; k.helpOn = false; k.dalis = 0; if (aktifti) or11GirdiBirak();
  if (aktifti && typeof omDikkat === 'function' && k.kameraFn) omDikkat('org', 0.1, k.kameraFn, 1, 0.48);
  k.dede.har = null; k.dede.hu = 0;
  if (tamam && !o.done) {
    o.done = true; o.tk.bitti = true; k.faz = 'bitti';
    for (const b of k.boru) { b.uyan = true; b.uyku = 0; }
    if (typeof V11 !== 'undefined' && V11) V11.org = true;
    OLAY.emit('orgBitti', { o });
  } else if (!tamam && !o.done) { k.faz = 'bekle'; if (k.adim >= 4 || k.cumle > 3) { k.cumle = Math.min(k.cumle, 3); k.adim = 0; } }
}

// ── her kare ──
function or11Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza orgun solunda durur
  const k = o.or; if (!k.aktif || P.ucus !== o) return;
  P.x = k.fzx; P.y = k.entry.y; P.vx = P.vy = P.buf = 0; P.ground = true;
}
function or11BoruAdim(o, b, dt, hk) {
  const k = o.or;
  b.cal = Math.max(0, b.cal - dt * 2.4); b.sarki = Math.max(0, b.sarki - dt * 1.6); b.hepsi = Math.max(0, b.hepsi - dt * (k.tada > 0 ? 0.35 : 0.8));
  b.uyku = b.uyan ? Math.max(0, b.uyku - dt * 2.4) : Math.min(1, b.uyku + dt);
  const ben = hk === b.i;
  b.parla += ((ben ? 1 : 0) - b.parla) * (1 - Math.exp(-dt * 5));
  b.heves += ((ben ? (k.idle > OR11_IPUCU || k.helpOn ? 1 : 0.7) : 0) * (b.cal > 0.3 ? 0.2 : 1) - b.heves) * (1 - Math.exp(-dt * 7));
  const bak = hk >= 0 && !ben ? clamp((k.boru[hk].x - b.x) / 60, -1, 1) : k.aktif ? -0.6 : clamp((P.x - b.x) / 300, -1, 1) * (b.uyan ? 1 : 0);
  b.bak += (bak - b.bak) * (1 - Math.exp(-dt * 5));
}
function or11Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.or; k.t += dt;
  // hazırlık: Feza yaklaşırken sprite'lar karelere yayılarak çizilir
  if (!OR11_S.hazir && Math.abs(P.x - o.x) < 3200) or11HazirlaAdim();
  or11ParcaAdim(dt);
  // Feza yaklaştıkça org uyanır: aplikler yanar, borular gözlerini açar (geri giderse ışık yavaşça kısılır; uyanan uyumaz)
  const hd = o.done || k.aktif ? 1 : Math.abs(P.y - o.y) < 420 ? clamp((1100 - Math.abs(P.x - o.x)) / 560, 0, 1) : 0;
  k.ap = hd > k.ap ? Math.min(hd, k.ap + dt * 0.8) : Math.max(hd, k.ap - dt * 0.25);
  k.fzSev = Math.max(0, k.fzSev - dt); k.flas = Math.max(0, k.flas - dt * 4); k.pitir = Math.max(0, k.pitir - dt); k.tada = Math.max(0, k.tada - dt * 0.4); k.yarasaHop = Math.max(0, k.yarasaHop - dt * 2.2);
  const dansEdiyor = k.faz === 'dans' || k.faz === 'final';
  k.parlak += ((dansEdiyor ? 1 : k.aktif ? 0.5 : o.done ? 0.55 : 0) - k.parlak) * (1 - Math.exp(-dt * 3));
  const d = k.dede;
  if (d.har) { d.hu += dt / d.harS; if (d.hu >= 1) { d.har = null; d.hu = 0; } }
  d.dans += ((dansEdiyor ? 1 : o.done && !k.aktif ? 0.45 : 0) - d.dans) * (1 - Math.exp(-dt * 4));
  if (!k.aktif) {
    // etkinlik yokken de saat işler (bittiyse Dede hafif vals yapar, yarasalar sallanır)
    k.saat += dt;
    const hk = -1; for (const b of k.boru) { if (!b.uyan && k.ap > 0.55 + b.i * 0.06) { b.uyan = true; or11Kivilcim(b.x, b.top + b.h - 70, 4, OR11_REN[b.i], 50); } or11BoruAdim(o, b, dt, hk); }
    k.spA = Math.max(0, k.spA - dt * 1.2);
    if (DURUM === 'oyun' && !o.done && !P.ucus && P.x > o.x - OR11_GIRIS - 70 && P.x < o.x + 900 && Math.abs(P.y - o.y) < 120) or11Aktiflestir(o);
    or11PirilAdim(o, dt);
    return;
  }
  if (DURUM !== 'oyun') return;
  if (typeof omDikkat === 'function') omDikkat('org', 1.5, k.kameraFn, 1, 0.48);
  k.fT += dt; k.saat += dt;
  const vb = k.saat / OR11_VUR, hk = or11Hedef(o);
  for (const b of k.boru) or11BoruAdim(o, b, dt, hk);
  if (k.faz === 'cal' && hk >= 0) k.spA = Math.min(1, k.spA + dt * 2.5); else k.spA = Math.max(0, k.spA - dt * (dansEdiyor ? 3 : 1.2));
  // akış
  if (k.faz === 'gel') {
    k.fzx = lerp(k.entry.x0, k.entry.x, smooth(clamp(k.fT / 0.8, 0, 1)));
    if (vb >= k.b0 + 3) { if (!k.tanitildi) or11Faz(o, 'tanit', k.b0 + 3); else or11Faz(o, 'cal', vb); }
  } else if (k.faz === 'tanit') {   // tanışma: La Do Re Mi Sol La' sekizliklerle, soldan sağa
    k.fzx = k.entry.x;
    const j = Math.floor((vb - k.b0) * 2 + 1e-6);
    while (k.nota <= Math.min(j, 5)) { const i = k.nota++; or11Cal(o, i, false); }
    if (vb >= k.b0 + 4) { k.tanitildi = true; or11Faz(o, 'cal', vb); }
  } else if (k.faz === 'cal') {
    if (!k.helpOn) {
      const i0 = k.idle; k.idle += dt;
      if (i0 < OR11_IPUCU && k.idle >= OR11_IPUCU) { k.ipucuN++; OLAY.emit('orgIpucu', { o, n: k.ipucuN, i: hk }); }
      if (k.idle >= (k.helpN > 0 ? OR11_YARDIM2 : OR11_YARDIM)) { k.helpOn = true; k.helpT = 0; k.helpN++; OLAY.emit('orgYardim', { o, n: k.helpN }); }
    }
  } else if (k.faz === 'ara') {
    if (vb >= k.b0) { if (k.cumle >= 3) or11Faz(o, 'final', k.b0); else or11Faz(o, 'dans', k.b0); }
  } else if (k.faz === 'dans') or11DansAdim(o, vb);
  else if (k.faz === 'final') or11FinalAdim(o, vb);
  else if (k.faz === 'don') { k.fzSev = 0.3; if (k.fT > 0.8) or11Birak(o, true); }
  or11PirilAdim(o, dt);
}
// cümle sonu: iki ölçü vals (Dede pelerini açık döner, borular sırayla parlar, yarasalar geniş sallanır)
function or11DansAdim(o, vb) {
  const k = o.or, fb = vb - k.b0;
  or11Vurus(o, vb, b => {
    if (b < 0 || b >= 6) return;
    if (b % 3 === 0) or11Sfx('valsAdim', b ? 0.6 : 1);
    const i = (b + k.dansN) % 6, x = k.boru[i]; x.hepsi = 1; or11Halka(x.x, x.top + 2, OR11_REN[i], 0.7);
    if (b === 0) k.pitir = 3.6;
  });
  k.fzSev = Math.max(k.fzSev, 0.2);
  if (fb >= 6) { k.cumle++; k.adim = 0; or11Faz(o, 'cal', vb); }
}
// final: kısa vals kendiliğinden çalar; herkes döner; sonunda "ta-da!"
function or11FinalAdim(o, vb) {
  const k = o.or, fb = vb - k.b0;
  while (k.nota < OR11_FINAL.length && fb >= OR11_FINAL[k.nota][0]) { const i = OR11_FINAL[k.nota++][1]; or11Cal(o, i, false); k.boru[i].hepsi = 1; }
  or11Vurus(o, vb, b => {
    if (b >= 0 && b < OR11_TADA && b % 3 === 0) or11Sfx('valsAdim', 0.8);
    if (b === 3) or11Sfx('yarasaPir');
    if (b === OR11_TADA) {   // ta-da!
      or11Sfx('orgNota', 0); or11Sfx('orgNota', 5); or11Sfx('orgDans', 5); OLAY.emit('orgDans', { o, n: 5, vurus: vb });
      for (const bb of k.boru) { bb.hepsi = 1; bb.cal = 1; bb.sarki = 1.4; or11Kivilcim(bb.x, bb.top, 10, OR11_REN[bb.i], 150); or11Halka(bb.x, bb.top + 2, OR11_REN[bb.i], 1.3); or11NotaUcur(bb.x, bb.top - 10, OR11_REN[bb.i], 1.2); }
      const cx = or11Cx(o); for (let j = 0; j < 22; j++) or11Toz(2, cx + (Math.random() - 0.5) * 460, o.y - 560 + Math.random() * 60, (Math.random() - 0.5) * 30, 30 + Math.random() * 40, 2.2 + Math.random() * 0.8, 4 + Math.random() * 4, j % 3 ? OR11_ALTIN2 : '#cfe6ff');
      k.pitir = 3; k.dede.har = 'zipla'; k.dede.hu = 0; k.dede.harS = 1.2; k.tada = 1;
    }
  });
  k.fzSev = Math.max(k.fzSev, 0.3);
  if (fb >= OR11_FBIT) or11Faz(o, 'don', vb);
}
// Pırıl: Feza'nın yanında · ipucu (sıradakinin üstüne uçup ışık serper, sonra Feza'ya döner) · yardım (burnuyla dokunup çalar) · dansta orgun çevresinde döner
function or11PirilAdim(o, dt) {
  const k = o.or, pr = k.pr, hk = or11Hedef(o), cx = or11Cx(o);
  if (!k.aktif) { pr.x = typeof D !== 'undefined' ? D.x : pr.x; pr.y = typeof D !== 'undefined' ? D.y : pr.y; return; }
  let tx = k.fzx + 44, ty = o.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'cal' && hk >= 0) {
    const b = k.boru[hk], tepe = b.top;
    if (k.helpOn) {
      k.helpT += dt;
      if (k.dalis > 0) {   // burnuyla "dıt" diye dokunur
        k.dalis -= dt; const u = 1 - k.dalis / 0.34;
        tx = b.x - 4; ty = tepe - 26 + Math.sin(clamp(u, 0, 1) * Math.PI) * 22; hiz = 16;
        if (!k.dalisVurdu && u > 0.5) { k.dalisVurdu = true; or11Dokun(o, hk, true); or11Kivilcim(b.x, tepe, 8, '#e2ccff', 70); }
      } else {
        tx = b.x - 4; ty = tepe - 26 + Math.sin(k.t * 3) * 3; hiz = 5;
        if (Math.hypot(pr.x - tx, pr.y - ty) < 18 && k.helpT > 1.0) { k.dalis = 0.34; k.dalisVurdu = false; k.helpT = 0; }
      }
      bak = Math.sign(b.x - pr.x) || 1;
    } else if (k.idle > OR11_IPUCU) {
      const u = ((k.idle - OR11_IPUCU) % 5) / 5, ust = u < 0.62;
      tx = ust ? b.x - 8 : k.fzx + 44; ty = ust ? tepe - 40 + Math.sin(k.t * 3.2) * 6 : o.y - 112; hiz = 3.2;
      if (ust && Math.hypot(pr.x - tx, pr.y - ty) < 40 && Math.random() < dt * 14) or11Toz(2, pr.x + (Math.random() - 0.5) * 16, pr.y + 8, (Math.random() - 0.5) * 20, 20, 1.1, 4 + Math.random() * 3, Math.random() < 0.5 ? '#e2ccff' : OR11_REN[hk]);
      bak = Math.sign(b.x - pr.x) || 1;
    } else bak = 1;
  } else if (k.faz === 'dans' || k.faz === 'final' || k.faz === 'don') {
    const a = k.t * 2.1; tx = cx + Math.sin(a) * 250; ty = o.y - 360 + Math.sin(a * 2) * 26; hiz = 3; bak = Math.cos(a) > 0 ? 1 : -1;
    if (Math.random() < dt * 6) or11Toz(0, pr.x, pr.y + 6, 0, 10, 0.8, 4, '#e2ccff');
  } else if (k.faz === 'tanit') { tx = k.fzx + 50; ty = o.y - 130; bak = 1; }
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function or11Don(u) { const c = Math.cos(u * 6.2832); return (c < 0 ? -1 : 1) * (0.46 + 0.54 * Math.pow(Math.abs(c), 0.5)); }   // tur dönüşü: Dede hiç çizgi gibi incelmez (en dar ~%46); en dar yerde yön değiştirip yumuşakça açılır
function or11Katman(c, lit, sonuk, x, y, a) {   // sönük + ışıklı sprite'ı ışık oranına göre karıştır
  if (a < 0.995) or11Bas(c, sonuk, x, y);
  if (a > 0.005) { c.globalAlpha = a; or11Bas(c, lit, x, y); c.globalAlpha = 1; }
}
function or11Aplikler(o, tm) {
  const cx = or11Cx(o), y = o.y + OR11_APLIK_Y, k = o.or, ap = k.ap, fl = k.flas * k.parlak;
  for (const s of [-1, 1]) {
    const x = cx + s * OR11_APLIK;
    or11Bas(g, OR11_S.aplik, x, y);
    if (ap > 0.02) {   // sihirli ay ışığı topu (alev değil): gümüş-mavi, yumuşak nabız
      const nb = 0.88 + 0.12 * Math.sin(tm * 1.7 + s) + 0.2 * fl, by = y - 16 + Math.sin(tm * 1.3 + s) * 2;
      g.globalCompositeOperation = 'lighter';
      or11Glow(g, '#a9c8ff', x, by, 70, 70, ap * 0.32 * nb); or11Glow(g, '#cfe6ff', x, by, 26, 26, ap * 0.7 * nb); or11Glow(g, '#ffffff', x, by, 9, 9, ap * 0.85);
      g.globalCompositeOperation = 'source-over';
    }
  }
}
// boru yüzü: göz (uyku / açık / mutlu), ağız (gülümseme / "Ooo" şarkısı); yerel koordinat: ayak altı (0,0)
function or11Yuz(b, tm) {
  const ay = -34, ex = 9, ey = ay - 38, my = ay - 15, bx = b.bak * 2;
  const sarki = clamp(b.sarki, 0, 1), uyku = b.uyku, heves = b.heves;
  const kirp = ((tm + b.i * 0.9) % 3.6) < 0.12;
  const mutlu = b.hepsi > 0.4 || b.cal > 0.55;
  g.lineWidth = 2.4; g.strokeStyle = '#3b2a6e'; g.fillStyle = '#2b2240';
  if (uyku > 0.5 || kirp) {   // kapalı gözler (uyku: ︶)
    for (const s of [-1, 1]) { g.beginPath(); g.arc(s * ex + bx, ey - 1, 4.2, 0.18 * Math.PI, 0.82 * Math.PI); g.stroke(); }
  } else if (mutlu) {   // mutlu (︵)
    for (const s of [-1, 1]) { g.beginPath(); g.arc(s * ex + bx, ey + 2.5, 4.4, 1.15 * Math.PI, 1.85 * Math.PI); g.stroke(); }
  } else {
    const ry = 4.8 + heves * 0.9;
    for (const s of [-1, 1]) { g.beginPath(); g.ellipse(s * ex + bx, ey, 3.7 + heves * 0.5, ry, 0, 0, 6.2832); g.fill(); }
    g.fillStyle = '#ffffff'; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * ex + bx - 1.2, ey - 1.8, 1.45, 0, 6.2832); g.fill(); g.beginPath(); g.arc(s * ex + bx + 1.3, ey + 1.6, 0.7, 0, 6.2832); g.fill(); }
  }
  if (sarki > 0.08) {   // "Ooo": yuvarlak açık ağız + pembe dil
    const rx = 3.6 + 2.6 * sarki, ry = 3 + 6 * sarki;
    g.fillStyle = '#5a2a5a'; g.beginPath(); g.ellipse(bx * 0.6, my + 1, rx, ry, 0, 0, 6.2832); g.fill();
    g.fillStyle = '#ff8fb0'; g.beginPath(); g.ellipse(bx * 0.6, my + 1 + ry * 0.45, rx * 0.65, ry * 0.38, 0, 0, 6.2832); g.fill();
  } else if (uyku > 0.5) {   // uykuda minik "o"
    g.fillStyle = '#5a2a5a'; g.beginPath(); g.ellipse(bx * 0.6, my + 1, 2.2, 2.6, 0, 0, 6.2832); g.fill();
  } else {   // gülümseme (hevesliyse kocaman)
    g.beginPath(); g.arc(bx * 0.6, my - 3, 6 + heves * 2, 0.18 * Math.PI, 0.82 * Math.PI); g.stroke();
  }
}
function or11Borular(o, tm) {
  const k = o.or, ap = k.ap, tb = or11Taban(o), hk = or11Hedef(o), pk = k.parlak;
  // sıradaki borunun ışık sütunu ve ağzında nabız gibi atan halkalar (arkadan)
  if (hk >= 0 && k.spA > 0.01) {
    const b = k.boru[hk], col = OR11_REN[hk], ip = k.idle > OR11_IPUCU || k.helpOn ? 1 : 0, nb = 0.5 + 0.5 * Math.sin(tm * 4.4);
    g.globalCompositeOperation = 'lighter';
    or11Glow(g, col, b.x, tb - b.h * 0.5, OR11_BW * 1.5, b.h * 0.75, k.spA * (0.45 + 0.2 * nb + 0.15 * ip));
    or11Glow(g, '#ffffff', b.x, b.top, 46, 46, k.spA * 0.42 * (0.6 + 0.4 * nb));
    g.globalCompositeOperation = 'source-over';
  }
  for (const b of k.boru) {
    // boru: çalınca uzayıp kısalır (yay gibi), hevesliyken hoplar
    const zip = b.heves * Math.abs(Math.sin(tm * 6.4 + b.i)) * 5 + Math.sin(b.cal * Math.PI) * 4 + (b.i === hk ? Math.abs(Math.sin(tm * 4.4)) * 6 * k.spA : 0);   // sıradaki ayrıca hoplar
    const sy = 1 + (b.cal > 0 ? Math.sin((1 - b.cal) * Math.PI * 2.6 - 0.9) * 0.11 * b.cal * b.cal : 0) + (k.faz === 'dans' || k.faz === 'final' ? Math.sin(tm * Math.PI * OR11_BPM / 60 + b.i * 0.9) * 0.015 : 0), sx = 1 - (sy - 1) * 0.7;
    const isik = clamp(Math.max(ap * (b.uyan ? 1 : 0.55), 0), 0, 1) * (hk >= 0 ? 1 - 0.3 * k.spA * (1 - b.parla) : 1);   // sıradaki varken ötekiler biraz sönük: o çok net seçilsin
    g.save(); g.translate(b.x, tb - zip); g.scale(sx, sy);
    or11Katman(g, OR11_S.boru[b.i], OR11_S.boruS[b.i], 0, 0, isik);
    // sıradaki boru (ve çalınan) kendi renginde ışıldar: aynı sprite'ı toplamalı kipte bir kez daha bas
    const isil = Math.max(b.parla * k.spA * (0.36 + 0.18 * Math.sin(tm * 4.4)), b.cal * 0.22, b.hepsi * 0.16);
    if (isil > 0.01) { g.globalCompositeOperation = 'lighter'; g.globalAlpha = isil; or11Bas(g, OR11_S.boru[b.i], 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    if (isik > 0.15 || b.uyku > 0.5) or11Yuz(b, tm);
    g.restore();
    // parıltı (çalınca, dansta, sıradaysa)
    const p = Math.max(b.cal * 0.8, b.hepsi * 0.7, b.parla * 0.22 * k.spA, pk * 0.12);
    if (p > 0.02) {
      g.globalCompositeOperation = 'lighter';
      or11Glow(g, OR11_REN[b.i], b.x, tb - b.h * 0.55 - zip, OR11_BW * 1.2, b.h * 0.62, p * 0.55);
      if (b.cal > 0.05) or11Glow(g, '#ffffff', b.x, b.top - zip, 34, 22, b.cal * 0.5);
      g.globalCompositeOperation = 'source-over';
    }
  }
  // sıradaki borunun ağzında dışa açılan iki yumuşak halka + üstünde süzülen altın nota ("şimdi ben!")
  if (hk >= 0 && k.spA > 0.01) {
    const b = k.boru[hk], col = OR11_REN[hk], ip = k.idle > OR11_IPUCU || k.helpOn ? 1 : 0, my = tb - 50;
    g.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 2; j++) {
      const u = (tm * (0.8 + 0.3 * ip) + j * 0.5) % 1;
      g.globalAlpha = k.spA * (1 - u) * (0.6 + 0.3 * ip); g.strokeStyle = col; g.lineWidth = 2.6 * (1 - u) + 0.6;
      g.beginPath(); g.ellipse(b.x, my, 26 + u * 26, 30 + u * 34, 0, 0, 6.2832); g.stroke();
    }
    g.globalAlpha = 1;
    const ny = b.top - 40 + Math.sin(tm * 3.2) * 7, sp = or11NotaSpr(OR11_ALTIN2), sc = 1.85 + 0.18 * Math.sin(tm * 4.4);
    or11Glow(g, '#ffe7a8', b.x, ny, 28, 28, k.spA * 0.55);
    g.globalCompositeOperation = 'source-over';
    g.globalAlpha = k.spA; const r = Math.sin(tm * 2.4) * 0.18; g.translate(b.x, ny); g.rotate(r); g.drawImage(sp.c, -sp.ox * sc, -sp.oy * sc, sp.w * sc, sp.h * sc); g.rotate(-r); g.translate(-b.x, -ny); g.globalAlpha = 1;
  }
}
// uyuklayan boruların "z"leri
function or11ZzzCiz(o, tm) {
  const k = o.or, sp = OR11_S.z, tb = or11Taban(o);
  for (const b of k.boru) {
    if (b.uyku < 0.3) continue;
    const hx = b.x + 12, hy = tb - 80;
    for (let j = 0; j < 2; j++) {
      const u = (tm * 0.3 + b.i * 0.37 + j * 0.5) % 1, al = Math.sin(u * Math.PI) * b.uyku * 0.85;
      g.globalAlpha = al; or11Bas(g, sp, hx + Math.sin(u * 5 + j) * 4 + u * 10, hy - u * 28, 0.55 + u * 0.55); g.globalAlpha = 1;
    }
  }
}
// Vampir Dede: figürlerin bütün gövde hareketleri (zıplama, takla, reverans, dönüş) burada; iç hareketleri vampirCiz (o.figur/fu)
const OR11_DEDE_OPT = { yon: -1, poz: 'dur', mutlu: 1, pelerin: 0, agiz: 0, kirp: false, faz: 0, figur: null, fu: 0 };
function or11DedeCiz(o, tm) {
  const k = o.or, d = k.dede, cx = or11Cx(o), op = OR11_DEDE_OPT, vb = k.saat / OR11_VUR;
  const s = OR11_DEDE_S, boy = 70 * s * 1.35;
  let x = cx + OR11_DEDE, lift = 0, rot = 0, piv = boy * 0.45, sx = 1, sy = 1, yon = -1, pel = 0, agiz = 0, poz = 'dur', kirp = false;
  // Feza gelmeden: orgun yanında uyuklar (gözler kapalı); Feza yaklaşınca uyanıp el sallar
  if (!k.aktif && !o.done) {
    if (k.ap < 0.6) { kirp = true; poz = 'dur'; sy = 1 + Math.sin(tm * 1.4) * 0.012; }
    else { poz = 'el'; agiz = 0.4; }
  } else if (k.faz === 'gel' || k.faz === 'tanit') { poz = 'el'; agiz = 0.35 + 0.25 * Math.sin(tm * 6); }
  else poz = 'dur';
  // dans (cümle sonu valsi, final, bitince hafif): her ölçüde bir tur döner, pelerin açık, vuruşta hafif hop
  const dn = d.dans;
  if (dn > 0.01) {
    const fr = ((vb % 1) + 1) % 1, olcu = ((vb / 3) % 1 + 1) % 1;
    const fb = vb - k.b0, don = k.faz === 'final' && fb >= OR11_TADA - 0.5 ? 0 : dn;   // ta-da'da yüzü bize dönük
    sx = lerp(1, or11Don(olcu), don); lift += Math.exp(-fr * 6) * 5 * dn; x += Math.sin(vb * Math.PI / 3) * 14 * dn;
    pel = Math.max(pel, 0.75 * dn); poz = dn > 0.4 ? 'dans' : poz; agiz = Math.max(agiz, 0.5 * dn);
  }
  // figür (her notada)
  const h = d.har, u = d.hu, e = u < 0.12 ? smooth(u / 0.12) : u > 0.85 ? smooth((1 - u) / 0.15) : 1;
  if (h) {
    poz = h === 'takla' || h === 'zipla' ? 'dans' : poz === 'dur' ? 'dans' : poz; agiz = Math.max(agiz, 0.6 * e);
    if (h === 'gobek') { const w = Math.sin(u * Math.PI * 8); x += w * 4.5 * e; rot += w * 0.05 * e; sy *= 1 - Math.abs(w) * 0.03 * e; lift += Math.abs(Math.sin(u * Math.PI * 4)) * 3 * e; }
    else if (h === 'pelerin') { sx *= or11Don(smooth(u)); pel = Math.max(pel, Math.sin(u * Math.PI)); lift += Math.sin(u * Math.PI) * 9; }
    else if (h === 'papyon') { rot += Math.sin(u * Math.PI * 4) * 0.06 * e; lift += Math.abs(Math.sin(u * Math.PI * 3)) * 4 * e; }
    else if (h === 'zipla') { const v = Math.sin(clamp(u / 0.8, 0, 1) * Math.PI), on = u < 0.14 ? Math.sin(u / 0.14 * Math.PI) : 0, son = u > 0.8 ? Math.sin((u - 0.8) / 0.2 * Math.PI) : 0; lift += v * 34; sy *= 1 - on * 0.1 - son * 0.08 + v * 0.05; sx *= 1 + on * 0.06 + son * 0.05; }
    else if (h === 'takla') { const v = Math.sin(clamp(u / 0.85, 0, 1) * Math.PI); lift += v * 44; rot += smooth(clamp((u - 0.08) / 0.72, 0, 1)) * 6.2832 * yon; sy *= 1 + (u > 0.85 ? -Math.sin((u - 0.85) / 0.15 * Math.PI) * 0.1 : 0); }
    else if (h === 'egil') { rot += yon * 0.42 * e; piv = 0; agiz = 0.3; pel = Math.max(pel, 0.3 * e); }
  }
  op.yon = yon; op.poz = poz; op.mutlu = 1; op.pelerin = pel; op.agiz = agiz; op.kirp = kirp; op.faz = vb; op.figur = h || (dn > 0.4 ? 'vals' : null); op.fu = h ? u : ((vb / 3) % 1 + 1) % 1;
  // gölge (havalanınca küçülür)
  const gk = clamp(1 - lift / 90, 0.45, 1);
  g.globalAlpha = 0.9 * gk; or11Bas(g, OR11_S.golge, x, o.y + 2, 1.5 * gk); g.globalAlpha = 1;
  g.save(); g.translate(x, o.y - lift);
  if (rot) { g.translate(0, -piv); g.rotate(rot); g.translate(0, piv); }
  if (sx !== 1 || sy !== 1) g.scale(Math.abs(sx) < 0.08 ? (sx < 0 ? -0.08 : 0.08) : sx, sy);
  try {
    if (typeof vampirCiz === 'function') vampirCiz(g, 'dede', 0, 0, s, tm, op);
    else { g.fillStyle = '#2a2158'; g.beginPath(); g.ellipse(0, -boy * 0.4, boy * 0.25, boy * 0.4, 0, 0, 6.2832); g.fill(); g.fillStyle = '#ffd8cc'; g.beginPath(); g.arc(0, -boy * 0.85, boy * 0.17, 0, 6.2832); g.fill(); }
  } catch (er) {}
  g.restore();
  // papyon figürü: boyun hizasında fırıl fırıl dönen minik ışık yıldızları (VAMPIR papyonu döndürmese de okunur)
  if (h === 'papyon' && e > 0.05) {
    const ny = o.y - lift - boy * 0.6, a0 = u * 6.2832 * 3;
    g.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 3; j++) { const a = a0 + j * 2.094, px = x + Math.cos(a) * 16, py = ny + Math.sin(a) * 6; or11Glow(g, j ? '#ffb3d1' : '#ffe7a8', px, py, 8, 8, e * 0.8); g.globalAlpha = e; g.drawImage(OR11_S.yildiz.c, px - 3.5, py - 3.5, 7, 7); g.globalAlpha = 1; }
    g.globalCompositeOperation = 'source-over';
  }
  // uyurken "z"
  if (kirp && !k.aktif) { const u2 = (tm * 0.3) % 1; g.globalAlpha = Math.sin(u2 * Math.PI) * 0.8; or11Bas(g, OR11_S.z, x - 18 - u2 * 10, o.y - boy - 6 - u2 * 26, 0.7 + u2 * 0.5); g.globalAlpha = 1; }
}
// Pıtır: kadife minderinde oturur, her notada alkışlar, dansta kıpır kıpır
const OR11_PITIR_OPT = { yon: 1, poz: 'otur', mutlu: 1, faz: 0, agiz: 0 };
function or11PitirCiz(o, tm) {
  const k = o.or, x = or11Cx(o) + OR11_PITIR, y = o.y, op = OR11_PITIR_OPT;
  or11Bas(g, OR11_S.minder, x, y + 1);
  const alk = k.pitir > 0, hop = alk ? Math.abs(Math.sin(tm * 9)) * 3 : 0;
  op.yon = k.aktif ? 1 : (P.x < x ? -1 : 1); op.poz = alk ? 'alkis' : 'otur'; op.faz = k.saat / OR11_VUR; op.agiz = alk ? 0.5 : 0; op.mutlu = 1;
  try {
    if (typeof vampirCiz === 'function') vampirCiz(g, 'bebek', x, y - 16 - hop, OR11_PITIR_S, tm, op);
    else { g.fillStyle = '#ffe6dc'; g.beginPath(); g.arc(x, y - 40 - hop, 12, 0, 6.2832); g.fill(); }
  } catch (er) {}
  if (alk && Math.random() < 0.08) or11Toz(0, x + (Math.random() - 0.5) * 20, y - 40, (Math.random() - 0.5) * 30, -30, 0.6, 3, '#ffb3d1');
}
// lila yarasalar: kancalarda baş aşağı asılı, ritimle sallanır; finalde orgun çevresinde daire çizerek uçar
const OR11_YARASA_OPT = { kanat: 0, yon: 1, uyku: 1, mutlu: 1, goz: 1 };
function or11Yarasalar(o, tm) {
  const k = o.or, cx = or11Cx(o), vb = k.saat / OR11_VUR, op = OR11_YARASA_OPT;
  const amp = k.faz === 'dans' ? 0.42 : k.aktif ? 0.2 : o.done ? 0.14 : 0.05;
  for (let j = 0; j < OR11_YARASA.length; j++) {
    const [dx, dy, asili] = OR11_YARASA[j], ax = cx + dx, ay = o.y + dy, ucus = k.ucus[j];
    let x = ax, y = ay, a = 0;
    if (ucus > 0.01) {   // finalde uçuş: orgun çevresinde daire
      const ang = vb * Math.PI / 3 + j * 2.094, fx = cx + Math.cos(ang) * 270, fy = o.y - 330 + Math.sin(ang) * 110;
      x = lerp(ax, fx, smooth(ucus)); y = lerp(ay, fy, smooth(ucus));
      op.uyku = 0; op.kanat = 0.5 + 0.5 * Math.sin(tm * 14 + j); op.yon = Math.sin(ang) > 0 ? -1 : 1; op.mutlu = 1;
      try { if (typeof yarasa11Ciz === 'function') yarasa11Ciz(g, x, y, 0.85, tm, op); } catch (er) {}
      continue;
    }
    if (asili) {
      a = Math.sin(vb * Math.PI * 2 / 3 + j) * amp + k.yarasaHop * 0.18 * Math.sin(tm * 12);
      op.uyku = 1; op.kanat = k.yarasaHop * (0.5 + 0.5 * Math.sin(tm * 16)); op.yon = 1; op.goz = k.ap > 0.5 ? 1 : 0;
      g.save(); g.translate(ax, ay); g.rotate(a);
      try { if (typeof yarasa11Ciz === 'function') yarasa11Ciz(g, 0, 17, 0.8, tm, op); } catch (er) {}
      g.restore();
    } else {   // hilalin üstünde oturan yarasa: vuruşta kanat çırpar, sağa sola sallanır
      a = Math.sin(vb * Math.PI * 2 / 3) * amp * 0.6;
      op.uyku = 0; op.kanat = 0.15 + k.yarasaHop * 0.7 * (0.5 + 0.5 * Math.sin(tm * 16)); op.yon = 1;
      g.save(); g.translate(ax, ay); g.rotate(a);
      try { if (typeof yarasa11Ciz === 'function') yarasa11Ciz(g, 0, -k.yarasaHop * 6, 0.75, tm, op); } catch (er) {}
      g.restore();
    }
  }
}
let or11D11 = null, or11D11T = 0;
function or11Dans11() {
  if (or11D11 === false && or11D11T && now - or11D11T > 4) { or11D11 = null; or11D11T = 0; }   // KARAKTER pozu sonradan hazır olabilir
  if (or11D11 === null) { try { or11D11 = typeof fezaCizPoz === 'function' && ((typeof fezaPozVar === 'function' && fezaPozVar('dans11')) || /['"]dans11['"]/.test(String(fezaCizPoz))); } catch (e) { or11D11 = false; } }
  return or11D11;
}
const OR11_FZ_OPT = { ruzgar: 0.05 };
function or11Ciz(o, tm) {
  const cx = or11Cx(o);
  if (cx + 340 < cam.x || cx - 360 > cam.x + VW) return;
  or11Hazirla();
  const k = o.or, ap = k.ap, pk = k.parlak, fl = k.flas * pk;
  // salonun sıcak ışığı (arkada)
  if (ap > 0.02) {
    g.globalCompositeOperation = 'lighter';
    or11Glow(g, '#c39bff', cx, o.y - 300, 420, 300, 0.1 * ap + 0.06 * pk + 0.04 * fl);
    or11Glow(g, '#ffe7a8', cx, o.y - 500, 120, 90, (0.18 + 0.1 * Math.sin(tm * 1.3)) * ap + 0.1 * pk + 0.5 * k.tada);   // hilal
    if (k.tada > 0) {   // ta-da: orgun arkasından yayılan büyük, yumuşak altın-lila ışık
      const u = smooth(k.tada); or11Glow(g, '#ffe7a8', cx, o.y - 300, 360 + 120 * (1 - u), 330 + 100 * (1 - u), 0.45 * u); or11Glow(g, '#ffb3d1', cx, o.y - 250, 520, 360, 0.22 * u);
    }
    g.globalCompositeOperation = 'source-over';
  }
  or11Aplikler(o, tm);
  or11Katman(g, OR11_S.arka, OR11_S.arkaS, cx, o.y, ap);
  // pano üstünde ışıkla parıldayan yıldızlar
  if (ap > 0.3) {
    g.globalCompositeOperation = 'lighter';
    for (let j = 0; j < 7; j++) { const x = cx + Math.sin(j * 2.7) * 140, y = o.y - 160 - ((j * 53) % 290), a = (0.5 + 0.5 * Math.sin(tm * 1.5 + j * 1.9)) * ap * (0.4 + 0.4 * pk); or11Glow(g, j % 2 ? '#ffe7a8' : '#cfe6ff', x, y, 10, 10, a); }
    g.globalCompositeOperation = 'source-over';
  }
  or11Borular(o, tm);
  or11Katman(g, OR11_S.kasa, OR11_S.kasaS, cx, o.y, ap);
  or11ZzzCiz(o, tm);
  or11PitirCiz(o, tm);
  or11DedeCiz(o, tm);
  or11Yarasalar(o, tm);
}
function or11CizOn(o, tm) {
  const k = o.or; if (!OR11_S.hazir) return;
  const cx = or11Cx(o);
  if (!k.aktif && (cx + 400 < cam.x || cx - 640 > cam.x + VW)) return;
  if (k.aktif && P.ucus === o) {
    // Feza: orgun solunda, orga dönük; cümle bitince ve danslarda sevinçle hoplar; finalde her ölçüde bir tur döner
    const dans = k.faz === 'dans' || k.faz === 'final';
    const sev = k.fzSev > 0 || dans || k.faz === 'don';
    const poz = sev ? (dans && or11Dans11() ? 'dans11' : 'sevinc') : 'ayakta_yan';
    let sx = 1;
    if (k.faz === 'final') { const fb = k.saat / OR11_VUR - k.b0, ol = ((fb / 3) % 1 + 1) % 1; if (fb >= 0 && fb < OR11_TADA - 0.5) sx = or11Don(ol); }
    if (typeof fezaCizPoz === 'function') {
      const M = g.getTransform();
      const fz = pz => { if (sx !== 1) { g.translate(k.fzx, P.y); g.scale(Math.abs(sx) < 0.08 ? (sx < 0 ? -0.08 : 0.08) : sx, 1); fezaCizPoz(g, 0, 0, 1, pz, tm, null, OR11_FZ_OPT); } else fezaCizPoz(g, k.fzx, P.y, 1, pz, tm, null, OR11_FZ_OPT); };
      try { fz(poz); } catch (e) {
        g.setTransform(M); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
        if (poz === 'dans11') { or11D11 = false; or11D11T = now; try { fz('sevinc'); } catch (e2) {} }   // poz henüz hazır değilse bir süre 'sevinc'
      }
      g.setTransform(M);
    }
    if (typeof pirilCizPoz === 'function') {
      const pr = k.pr, kirp = k.fzSev > 0.5 || k.faz === 'don';
      g.save(); try { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, kirp ? 'goz_kirp' : 'ucus', tm); } catch (e) {} g.restore();
    }
  }
  or11ParcaCiz();
}

// ── girdi: etkinlikte her dokunuş en yakın boruya gider (cömert); Feza'ya dokunmak onu sevindirir, Dede'ye dokunmak figür yaptırır,
// Pıtır'a dokunmak alkışlatır. Pencere yakalama evresi: motorun yürüme parmağına ulaşmaz. Etkinlik yokken yalnız borunun kendisine
// dokunuş (serbest çalma) yakalanır. ──
function or11Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function or11Bul(o, x, y, comert) {
  const k = o.or, tb = or11Taban(o); let en = -1, ed = 1e9;
  for (const b of k.boru) {
    const dx = Math.abs(x - b.x), dy = y < b.top ? b.top - y : y > tb ? y - tb : 0, d = dx + dy * 0.35;
    if (d < ed) { ed = d; en = b.i; }
  }
  if (comert) return en;
  const b = k.boru[en]; return en >= 0 && Math.abs(x - b.x) < OR11_BW * 0.5 + 12 && y > b.top - 24 && y < tb + 8 ? en : -1;
}
function or11DedeDokun(o) { const d = o.or.dede; if (d.har) return; d.har = OR11_FIG[d.fig++ % OR11_FIG.length]; d.hu = 0; d.harS = OR11_FIG_S; or11Sfx('orgDans', 0); }
addEventListener('pointerdown', e => {
  if (DURUM !== 'oyun' || e.pointerType === 'mouse' && e.button !== 0) return;
  const o = ORG11.aktif;
  if (o) {
    if (e.target !== cv) return;
    e.preventDefault(); e.stopPropagation();
    const p = or11Dunya(e), k = o.or, cx = or11Cx(o);
    try {
      if (Math.abs(p.x - k.fzx) < 32 && p.y > P.y - 78 && p.y < P.y + 12) { k.fzSev = 0.9; k.idle = 0; or11Kivilcim(k.fzx, P.y - 40, 8, '#ffe7a8', 80); return; }
      const px = cx + OR11_PITIR; if (Math.abs(p.x - px) < 34 && p.y > o.y - 70 && p.y < o.y + 10) { k.pitir = 1.2; k.idle = 0; or11Kivilcim(px, o.y - 40, 8, '#ffb3d1', 70); return; }
      if (p.x < cx - 236) { k.fzSev = 0.6; k.idle = 0; return; }   // Feza'nın tarafı (borulardan uzak): Feza sevinir
      const dx = cx + OR11_DEDE; if (k.faz === 'cal' && Math.abs(p.x - dx) < 40 && p.y > o.y - 120 && p.y < o.y + 10) { k.idle = 0; or11DedeDokun(o); return; }
      or11Dokun(o, or11Bul(o, p.x, p.y, true), false);
    } catch (er) { console.warn('[org11]', er); }
    return;
  }
  const so = ORG11.o;
  if (!so || !so.or || so.or.ap < 0.3 || P.ucus || e.target !== cv || Math.abs(P.x - so.x) > 900 || !OR11_S.hazir) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi her zaman önce
  const p = or11Dunya(e), i = or11Bul(so, p.x, p.y, false); if (i < 0) return;
  e.preventDefault(); e.stopPropagation();
  try { or11Cal(so, i, true); OLAY.emit('orgSerbest', { o: so, i }); } catch (er) { console.warn('[org11]', er); }
}, true);
addEventListener('keydown', e => {
  const o = ORG11.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  const m = /^Digit([1-6])$/.exec(e.code);
  if (!m && !/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  e.preventDefault(); e.stopPropagation(); if (e.repeat) return;
  if (m) { or11Dokun(o, +m[1] - 1, false); return; }
  if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') { const h = or11Hedef(o); or11Dokun(o, h >= 0 ? h : 2, false); }
}, true);
OLAY.on('durum', d => { if (d === 'oyun') return; const o = ORG11.aktif; if (o && d !== 'mola' && d !== 'duraklat') or11Birak(o, false); });

TUR.kaydet('orgMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };
    const cx = o.x + OR11_CX, tb = o.y - OR11_KASA, boru = [];
    for (let i = 0; i < 6; i++) boru.push({ i, x: cx + OR11_BX[i], h: OR11_BH[i], top: tb - OR11_BH[i], cal: 0, sarki: 0, hepsi: 0, parla: 0, heves: 0, bak: 0, uyku: 1, uyan: false });
    o.or = { aktif: false, faz: 'bekle', fT: 0, t: 0, saat: 0, ap: 0, b0: 0, sonVur: -1, cumle: 0, adim: 0, say: 0, nota: 0, dansN: 0, idle: 0, helpOn: false, helpT: 0, helpN: 0,
      dalis: 0, dalisVurdu: false, tanitildi: false, basladi: false, ipucuN: 0, fzx: o.x - OR11_GIRIS, fzSev: 0, flas: 0, parlak: 0, spA: 0, pitir: 0, tada: 0, yarasaHop: 0, ucus: [0, 0, 0], boru,
      dede: { har: null, hu: 0, harS: OR11_FIG_S, fig: 0, dans: 0 },
      entry: { x: o.x - OR11_GIRIS, x0: o.x - OR11_GIRIS, y: o.y }, pr: { x: o.x - 300, y: o.y - 120, f: 1 }, kameraFn: null };
    o.or.kameraFn = () => { if (typeof omDkEkle === 'function') omDkEkle(o.x - OR11_GIRIS - 50, o.y - 600, cx + 270, o.y + 16); };
    o.adim = dt => or11Adim(o, dt);
    ORG11.o = o;
  },
  guncelle(o, dt) {
    or11Guncelle(o, dt);
    // finalde yarasalar havalanır, bitince yerlerine döner
    if (dt > 0) { const k = o.or, uc = k.faz === 'final' && k.saat / OR11_VUR - k.b0 >= 3 && k.saat / OR11_VUR - k.b0 < OR11_TADA + 2; for (let j = 0; j < 3; j++) k.ucus[j] = clamp(k.ucus[j] + (uc ? dt * 0.9 : -dt * 0.7), 0, 1); }
  },
  testBitir(o) {   // başsız deneme kancası (B11T.bitir('org')): hemen biter
    const k = o.or;
    if (!k.basladi) { k.basladi = true; OLAY.emit('orgBasla', { o }); }
    or11Birak(o, true);
  },
  ciz: or11Ciz, cizOn: or11CizOn
});
