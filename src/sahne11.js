/* sahne11.js — Ay Işığı Şatosu'nun sahne parçaları (UCUS). HER bölümde yüklenir (seçim rafındaki kavanoz). sahne.js 'sato' adını şu
   işlevlere yönlendirir:
     sh11Fon(c, w, h)                    kavanozun ve uyku → rüya geçişinin DURAĞAN resmi (önbelleğe bir kez çizilir; degrade serbest):
                                         mor-lacivert gece, kocaman inci-sarı ay (gümüş hâle, lila bulut tülleri), tepede eğri büğrü sevimli
                                         şato (pembe külahlı yuvarlak kuleler, soğan kubbeli ince kule, yuvarlak pencereler), budanmış kalp /
                                         yarasa / ay biçimli çalılar, pembe-lila yer sisi, ay ışığı fenerleri
     sh11Canli(ox, oy, w, h, tm, a, hov) kavanoz içinde canlı katman: şato pencereleri sırayla yanar (sonra hep birlikte nefes alır),
                                         ayın önünden lila yarasa süzülür (sahne.js sh8Yarasa: lila top gövde, gülen yüz), kubbe flaması
                                         dalgalanır, fenerlerde sihirli ay ışığı, yerde sis kayar, yıldızlar ışıldar
     sh11Ikon(c, r)                      kavanoz etiketi simgesi (minik pembe külahlı kule + hilal + minik yarasa)
     sh11Oda(tm, a, gece)                uyku/sabah odasında rüyanın süsü: perde çubuğundan baş aşağı sarkan keçe lila yarasa (gece uyur,
                                         ara sıra bir gözünü açıp kırpar; sabah gülümser) ve iki yanında iplerde kâğıt yıldız + hilal
     sh11Sabah(tm, a)                    sabah penceresi: şeftali-pembe şafak, uzak tepede pastel şato, batan solgun ay, şatoya dönen
                                         iki minik yarasa, pembe bulutlar
     sh11Hediye(tm, a)                   komodinde rüyadan kalan küçük lila yarasa peluşu (göz kırpar) ve parlak bir çilek; çevrede ışıltı
     sh11OnPlan() / sh11OnToz(tm, a)     uyku → rüya geçişinin ön planı (sahne.js 'onPlanS' yönlendirmesi CORE'dan istendi)
   Sözleşme: src/BOLUM11.md. Önek: sh11. Karede yeni degrade yok (yalnız önbelleğe çizilen resimlerde). */
'use strict';
const SH11_RENK = ['#cfe6ff', '#c39bff', '#ffb3d1', '#ffe7a8', '#9ff0d0'];   // ay gümüşü, lila, pastel pembe, şamdan altını, nane
// yerleşim: ölçü başına bir kez (balon nefes aldıkça boyu birkaç piksel oynar → küçük, sınırlı önbellek)
const sh11YerB = new Map();
function sh11Yer(w, h) {
  const key = Math.round(w) * 8192 + Math.round(h);
  let O = sh11YerB.get(key);
  if (O) return O;
  const s = Math.min(w, h), kare = w < h * 1.2;
  O = { s, kare,
    ay: kare ? { x: w * 0.5, y: h * 0.42, r: s * 0.21 } : { x: w * 0.47, y: h * 0.37, r: s * 0.17 },   // kocaman ay şatonun arkasında (simge gibi okunsun)
    st: kare ? { x: w * 0.45, y: h * 0.8, u: s * 0.18 } : { x: w * 0.43, y: h * 0.74, u: s * 0.165 },
    tepe: kare ? h * 0.8 : h * 0.74,
    pen: [], fener: [], cali: [] };
  const u = O.st.u, cx = O.st.x, by = O.st.y;
  // pencereler (soldan sağa, aşağıdan yukarı yanma sırası) [x, y, r]
  O.pen.push([cx - 0.72 * u, by - 0.75 * u, 0.1 * u], [cx - 0.28 * u, by - 0.62 * u, 0.12 * u], [cx + 0.28 * u, by - 0.62 * u, 0.12 * u],
    [cx + 0.83 * u, by - 0.5 * u, 0.08 * u], [cx - 0.72 * u, by - 1.15 * u, 0.09 * u], [cx, by - 1.2 * u, 0.1 * u], [cx + 0.65 * u, by - 1.3 * u, 0.13 * u], [cx + 0.65 * u, by - 1.75 * u, 0.07 * u]);
  O.kapi = [cx, by - 0.02 * u, 0.2 * u, 0.42 * u];   // kemerli kapı (alt orta, yarım en, boy)
  O.bay = [cx + 0.65 * u, by - 2.62 * u];            // kubbe flamasının direği
  O.fener = kare ? [[w * 0.2, h * 0.86, s * 0.03], [w * 0.64, h * 0.88, s * 0.03]] : [[w * 0.24, h * 0.82, s * 0.028], [w * 0.56, h * 0.83, s * 0.028], [w * 0.86, h * 0.9, s * 0.032]];
  O.cali = kare ? [[w * 0.14, h * 0.93, s * 0.06, 'kalp'], [w * 0.84, h * 0.93, s * 0.055, 'yarasa']] : [[w * 0.08, h * 0.93, s * 0.07, 'kalp'], [w * 0.68, h * 0.92, s * 0.06, 'ay'], [w * 0.95, h * 0.95, s * 0.07, 'yarasa']];
  if (sh11YerB.size > 12) sh11YerB.delete(sh11YerB.keys().next().value);
  sh11YerB.set(key, O);
  return O;
}
// ── durağan resim parçaları (önbelleğe) ──
function sh11Bulut(x, cx, cy, R, sd, al) {   // yumuşak lila bulut tülü: kabarık üst, düz alt; üst kenarı ay ışığı alır
  const q = rng(sd), T0 = [];
  for (let i = 0; i < 6; i++) { const e = Math.sin(Math.PI * (i + 0.5) / 6); T0.push([cx + (i - 2.5) * R * 0.5 + (q() - 0.5) * R * 0.25, R * (0.22 + 0.42 * e + q() * 0.12)]); }
  x.fillStyle = `rgba(130,100,200,${0.3 * al})`; x.beginPath();
  for (const [px, pr] of T0) { x.moveTo(px + pr, cy - pr * 0.4); x.arc(px, cy - pr * 0.4, pr, 0, 6.283); }
  x.moveTo(cx - R * 1.2, cy - R * 0.2); x.lineTo(cx + R * 1.2, cy - R * 0.2); x.lineTo(cx + R * 1.45, cy); x.quadraticCurveTo(cx, cy + R * 0.2, cx - R * 1.45, cy); x.closePath(); x.fill();
  x.fillStyle = `rgba(230,215,255,${0.16 * al})`; x.beginPath();
  for (const [px, pr] of T0) { x.moveTo(px + pr * 0.7, cy - pr * 0.7); x.arc(px - pr * 0.1, cy - pr * 0.7, pr * 0.7, 0, 6.283); }
  x.fill();
}
function sh11Govde(x, x0, x1, y0, y1, ton) {   // pastel taş gövde: soldan ay ışığı, sağı gölgeli; birkaç yumuşak taş sırası
  const gr = x.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, ton[0]); gr.addColorStop(0.45, ton[1]); gr.addColorStop(1, ton[2]);
  x.fillStyle = '#231a4e'; x.fillRect(x0 - (x1 - x0) * 0.04, y0 - (x1 - x0) * 0.03, (x1 - x0) * 1.08, y1 - y0 + (x1 - x0) * 0.03);
  x.fillStyle = gr; x.fillRect(x0, y0, x1 - x0, y1 - y0);
  x.strokeStyle = 'rgba(35,26,78,0.22)'; x.lineWidth = Math.max(0.6, (x1 - x0) * 0.012);
  const sat = (x1 - x0) * 0.16;
  for (let y = y0 + sat, i = 0; y < y1 - 1; y += sat, i++) { x.beginPath(); x.moveTo(x0, y); x.lineTo(x1, y); for (let px = x0 + (i % 2 ? sat * 0.9 : sat * 0.3); px < x1; px += sat * 1.3) { x.moveTo(px, y - sat); x.lineTo(px, y); } x.stroke(); }
  x.fillStyle = 'rgba(234,244,255,0.22)'; x.fillRect(x0, y0, (x1 - x0) * 0.06, y1 - y0);
}
function sh11Kulah(x, cx, y, bw, rh, kv, ton) {   // kıvrık uçlu külah çatı ((cx, y) saçak ortası, bw yarım en, rh boy, kv kıvrım yönü)
  const yol = () => { x.beginPath(); x.moveTo(cx - bw * 1.18, y + bw * 0.08); x.quadraticCurveTo(cx - bw * 0.5, y - rh * 0.35, cx - bw * 0.06 * kv, y - rh + bw * 0.12); x.quadraticCurveTo(cx + bw * 0.12 * kv, y - rh - bw * 0.2, cx + bw * 0.5 * kv, y - rh - bw * 0.1); x.quadraticCurveTo(cx + bw * 0.22 * kv, y - rh + bw * 0.05, cx + bw * 0.12 * kv, y - rh + bw * 0.32); x.quadraticCurveTo(cx + bw * 0.5, y - rh * 0.3, cx + bw * 1.18, y + bw * 0.08); x.quadraticCurveTo(cx, y + bw * 0.2, cx - bw * 1.18, y + bw * 0.08); x.closePath(); };
  x.lineWidth = Math.max(1, bw * 0.12); x.strokeStyle = '#231a4e'; yol(); x.stroke();
  const gr = x.createLinearGradient(cx - bw, 0, cx + bw, 0); gr.addColorStop(0, ton[0]); gr.addColorStop(0.45, ton[1]); gr.addColorStop(1, ton[2]); x.fillStyle = gr; yol(); x.fill();
  x.save(); yol(); x.clip(); x.strokeStyle = 'rgba(255,255,255,0.25)'; x.lineWidth = Math.max(0.6, bw * 0.05);   // pul kiremit
  const pr = bw * 0.16; for (let yy = y - rh * 0.75, i = 0; yy < y + pr; yy += pr * 1.6, i++) { x.beginPath(); for (let px = cx - bw * 1.3 + (i % 2 ? pr : 0); px < cx + bw * 1.3; px += pr * 2) { x.moveTo(px - pr, yy); x.arc(px, yy, pr, Math.PI, 0, true); } x.stroke(); }
  x.restore();
  x.fillStyle = 'rgba(255,255,255,0.22)'; x.beginPath(); x.moveTo(cx - bw * 1.05, y + bw * 0.05); x.quadraticCurveTo(cx - bw * 0.5, y - rh * 0.35, cx - bw * 0.06 * kv, y - rh + bw * 0.14); x.quadraticCurveTo(cx - bw * 0.3, y - rh * 0.4, cx - bw * 0.45, y + bw * 0.05); x.closePath(); x.fill();
  x.fillStyle = '#ffe27a'; shYildiz5(x, cx + bw * 0.5 * kv, y - rh - bw * 0.1, Math.max(1, bw * 0.16)); x.fill();
}
function sh11PenKoyu(x, px, py, r) {   // sönük pencere (canlı katman ışığı yakar): koyu cam, açık pervaz, haç kayıt
  x.fillStyle = '#231a4e'; x.beginPath(); x.arc(px, py, r * 1.35, 0, 6.283); x.fill();
  x.fillStyle = '#e6dcff'; x.beginPath(); x.arc(px, py, r * 1.18, 0, 6.283); x.fill();
  x.fillStyle = '#4a3c84'; x.beginPath(); x.arc(px, py, r, 0, 6.283); x.fill();
  x.fillStyle = 'rgba(207,230,255,0.35)'; x.beginPath(); x.arc(px - r * 0.3, py - r * 0.3, r * 0.35, 0, 6.283); x.fill();
  x.strokeStyle = '#2a2158'; x.lineWidth = Math.max(0.5, r * 0.16); x.beginPath(); x.moveTo(px - r, py); x.lineTo(px + r, py); x.moveTo(px, py - r); x.lineTo(px, py + r); x.stroke();
}
function sh11Sato(x, O) {   // tepedeki eğri büğrü sevimli şato (durağan; pencereler sönük çizilir)
  const u = O.st.u, cx = O.st.x, by = O.st.y;
  x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
  const tLila = ['#cfc0f2', '#ab97e0', '#7a66be'], tMavi = ['#c6ccf4', '#a2aae2', '#717dc0'], tPembe = ['#e6cbea', '#c9a8d8', '#987ab6'];
  // arka sağ ince kule + soğan kubbe + flama direği
  sh11Govde(x, cx + 0.48 * u, cx + 0.82 * u, by - 2.05 * u, by, tMavi);
  { const kx = cx + 0.65 * u, ky = by - 2.05 * u, kw = 0.24 * u, kh = 0.55 * u;
    const kub = () => { x.beginPath(); x.moveTo(kx - kw, ky + 0.02 * u); x.bezierCurveTo(kx - kw * 2.1, ky - kh * 0.45, kx - kw * 0.6, ky - kh * 0.75, kx, ky - kh); x.bezierCurveTo(kx + kw * 0.6, ky - kh * 0.75, kx + kw * 2.1, ky - kh * 0.45, kx + kw, ky + 0.02 * u); x.closePath(); };
    x.lineWidth = Math.max(1, u * 0.03); x.strokeStyle = '#231a4e'; kub(); x.stroke();
    const gr = x.createLinearGradient(kx - kw * 1.6, 0, kx + kw * 1.6, 0); gr.addColorStop(0, '#ece2ff'); gr.addColorStop(0.42, '#c39bff'); gr.addColorStop(1, '#8a66d8'); x.fillStyle = gr; kub(); x.fill();
    x.strokeStyle = '#ffd27a'; x.lineWidth = Math.max(1, u * 0.035); x.beginPath(); x.moveTo(kx - kw * 1.05, ky); x.quadraticCurveTo(kx, ky + 0.06 * u, kx + kw * 1.05, ky); x.stroke();
    x.strokeStyle = '#231a4e'; x.lineWidth = Math.max(0.8, u * 0.018); x.beginPath(); x.moveTo(kx, ky - kh); x.lineTo(O.bay[0], O.bay[1]); x.stroke();
    x.fillStyle = '#ffd27a'; x.beginPath(); x.arc(kx, ky - kh, u * 0.03, 0, 6.283); x.fill(); }
  // arka sol yuvarlak kule + pembe külah
  sh11Govde(x, cx - 0.95 * u, cx - 0.5 * u, by - 1.45 * u, by, tLila);
  sh11Kulah(x, cx - 0.725 * u, by - 1.45 * u, 0.26 * u, 0.9 * u, -1, ['#ffd6e6', '#ffa6c8', '#d97aa8']);
  // ana yapı + yuvarlak tepeli mor çatı + çatı penceresi
  sh11Govde(x, cx - 0.6 * u, cx + 0.6 * u, by - 0.98 * u, by, tPembe);
  { const yol = () => { x.beginPath(); x.moveTo(cx - 0.72 * u, by - 0.96 * u); x.quadraticCurveTo(cx - 0.18 * u, by - 1.62 * u, cx, by - 1.66 * u); x.quadraticCurveTo(cx + 0.18 * u, by - 1.62 * u, cx + 0.72 * u, by - 0.96 * u); x.quadraticCurveTo(cx, by - 0.9 * u, cx - 0.72 * u, by - 0.96 * u); x.closePath(); };
    x.lineWidth = Math.max(1, u * 0.03); x.strokeStyle = '#231a4e'; yol(); x.stroke();
    const gr = x.createLinearGradient(cx - 0.7 * u, 0, cx + 0.7 * u, 0); gr.addColorStop(0, '#9a80e2'); gr.addColorStop(0.45, '#6a4fb8'); gr.addColorStop(1, '#4b3a8c'); x.fillStyle = gr; yol(); x.fill();
    x.save(); yol(); x.clip(); x.strokeStyle = 'rgba(217,200,255,0.3)'; x.lineWidth = Math.max(0.6, u * 0.014); const pr = u * 0.045;
    for (let yy = by - 1.5 * u, i = 0; yy < by - 0.9 * u; yy += pr * 1.6, i++) { x.beginPath(); for (let px = cx - 0.8 * u + (i % 2 ? pr : 0); px < cx + 0.8 * u; px += pr * 2) { x.moveTo(px - pr, yy); x.arc(px, yy, pr, Math.PI, 0, true); } x.stroke(); }
    x.restore();
    x.fillStyle = 'rgba(234,244,255,0.16)'; x.beginPath(); x.moveTo(cx - 0.66 * u, by - 0.97 * u); x.quadraticCurveTo(cx - 0.18 * u, by - 1.6 * u, cx, by - 1.64 * u); x.quadraticCurveTo(cx - 0.2 * u, by - 1.3 * u, cx - 0.3 * u, by - 0.96 * u); x.closePath(); x.fill();
    // tepede yarasa rüzgârgülü
    x.strokeStyle = '#231a4e'; x.lineWidth = Math.max(0.8, u * 0.02); x.beginPath(); x.moveTo(cx, by - 1.66 * u); x.lineTo(cx, by - 1.86 * u); x.stroke();
    x.fillStyle = '#c39bff'; x.beginPath(); x.arc(cx, by - 1.89 * u, u * 0.035, 0, 6.283); x.fill();
    for (const sd of [-1, 1]) { x.beginPath(); x.moveTo(cx + sd * u * 0.02, by - 1.9 * u); x.quadraticCurveTo(cx + sd * u * 0.08, by - 1.97 * u, cx + sd * u * 0.13, by - 1.92 * u); x.quadraticCurveTo(cx + sd * u * 0.09, by - 1.88 * u, cx + sd * u * 0.02, by - 1.87 * u); x.closePath(); x.fill(); } }
  // ön sağ küçük kule + pembe külah
  sh11Govde(x, cx + 0.68 * u, cx + 0.98 * u, by - 0.82 * u, by, tLila);
  sh11Kulah(x, cx + 0.83 * u, by - 0.82 * u, 0.17 * u, 0.55 * u, 1, ['#ffd6e6', '#ffa6c8', '#d97aa8']);
  // tombul, yuvarlak dişli alçak surlar
  for (const sd of [-1, 1]) {
    const x0 = sd < 0 ? cx - 1.45 * u : cx + 0.98 * u, x1 = sd < 0 ? cx - 0.95 * u : cx + 1.42 * u, yt = by - 0.34 * u;
    sh11Govde(x, x0, x1, yt, by, tPembe);
    const n = 3, dw = (x1 - x0) / (n * 2 - 1);
    for (let i = 0; i < n; i++) { const mx = x0 + dw * i * 2 + dw / 2; x.fillStyle = '#231a4e'; x.beginPath(); x.arc(mx, yt, dw * 0.62, Math.PI, 0); x.fill(); x.fillStyle = '#d8c0e8'; x.beginPath(); x.arc(mx, yt, dw * 0.5, Math.PI, 0); x.fill(); }
  }
  // kemerli kapı (sıcak ışık canlı katmanda) ve sancak
  { const [kx, ky, kw, kh] = O.kapi;
    x.fillStyle = '#231a4e'; x.beginPath(); x.moveTo(kx - kw - u * 0.03, ky); x.lineTo(kx - kw - u * 0.03, ky - kh + kw); x.arc(kx, ky - kh + kw, kw + u * 0.03, Math.PI, 0); x.lineTo(kx + kw + u * 0.03, ky); x.fill();
    x.fillStyle = '#6a4a6a'; x.beginPath(); x.moveTo(kx - kw, ky); x.lineTo(kx - kw, ky - kh + kw); x.arc(kx, ky - kh + kw, kw, Math.PI, 0); x.lineTo(kx + kw, ky); x.fill();
    x.strokeStyle = 'rgba(35,26,78,0.5)'; x.lineWidth = Math.max(0.6, u * 0.015); x.beginPath(); x.moveTo(kx, ky); x.lineTo(kx, ky - kh); x.stroke();
    x.fillStyle = '#ffd27a'; x.beginPath(); x.arc(kx - kw * 0.3, ky - kh * 0.4, u * 0.02, 0, 6.283); x.arc(kx + kw * 0.3, ky - kh * 0.4, u * 0.02, 0, 6.283); x.fill(); }
  for (const [px, py, pr] of O.pen) sh11PenKoyu(x, px, py, pr);
  x.restore();
}
function sh11Cali(x, px, py, r, tip) {   // budanmış çalı (kalp / yarasa / ay biçimli), ay ışığı alan üst kenar, saksı gibi yuvarlak dip
  x.save(); x.translate(px, py);
  const yol = () => {
    x.beginPath();
    if (tip === 'kalp') { x.moveTo(0, -r * 0.35); x.bezierCurveTo(-r * 0.2, -r * 1.25, -r * 1.25, -r * 1.0, -r * 0.95, -r * 0.2); x.quadraticCurveTo(-r * 0.6, r * 0.35, 0, r * 0.75); x.quadraticCurveTo(r * 0.6, r * 0.35, r * 0.95, -r * 0.2); x.bezierCurveTo(r * 1.25, -r * 1.0, r * 0.2, -r * 1.25, 0, -r * 0.35); }
    else if (tip === 'ay') { x.arc(0, 0, r * 0.95, Math.PI * 0.3, Math.PI * 1.7); x.quadraticCurveTo(r * 0.1, -r * 0.2, r * 0.42, r * 0.75); }
    else { x.arc(0, 0, r * 0.5, 0, 6.283); for (const sd of [-1, 1]) { x.moveTo(sd * r * 0.4, -r * 0.2); x.quadraticCurveTo(sd * r * 1.0, -r * 0.95, sd * r * 1.45, -r * 0.45); x.quadraticCurveTo(sd * r * 1.2, -r * 0.2, sd * r * 1.22, r * 0.1); x.quadraticCurveTo(sd * r * 0.95, -r * 0.1, sd * r * 0.85, r * 0.25); x.quadraticCurveTo(sd * r * 0.6, 0, sd * r * 0.4, r * 0.25); x.closePath(); }
      x.moveTo(-r * 0.42, -r * 0.3); x.lineTo(-r * 0.32, -r * 0.78); x.lineTo(-r * 0.1, -r * 0.45); x.lineTo(r * 0.1, -r * 0.45); x.lineTo(r * 0.32, -r * 0.78); x.lineTo(r * 0.42, -r * 0.3); }
    x.closePath();
  };
  x.fillStyle = '#7a5aa8'; x.fillRect(-r * 0.08, r * 0.6, r * 0.16, r * 0.6);   // gövdecik
  x.lineWidth = Math.max(1, r * 0.1); x.strokeStyle = '#231a4e'; yol(); x.stroke();
  const gr = x.createLinearGradient(0, -r, 0, r); gr.addColorStop(0, '#8fd8b8'); gr.addColorStop(1, '#3f8a72'); x.fillStyle = gr; yol(); x.fill();
  x.save(); yol(); x.clip(); x.fillStyle = 'rgba(207,230,255,0.35)'; for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.28; x.beginPath(); x.arc(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8, r * 0.16, 0, 6.283); x.fill(); } x.restore();   // ay ışığı alan yapraklar
  x.restore();
}
function sh11Fon(x, w, h) {
  const O = sh11Yer(w, h), s = O.s, r = rng(1101), A = O.ay;
  x.save(); x.lineJoin = 'round'; x.lineCap = 'round';
  // gök: tepede derin gece moru, ufka doğru lila ve pembe pus
  let gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1d1840'); gr.addColorStop(0.35, '#2a2158'); gr.addColorStop(0.6, '#3a2c74'); gr.addColorStop(0.78, '#6a4f9e'); gr.addColorStop(1, '#3a2c74');
  x.fillStyle = gr; x.fillRect(0, 0, w, h);
  gr = x.createRadialGradient(w * 0.45, O.tepe, 0, w * 0.45, O.tepe, s * 0.8); gr.addColorStop(0, 'rgba(255,170,210,0.22)'); gr.addColorStop(1, 'rgba(255,170,210,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
  // yıldızlar
  x.fillStyle = '#eaf4ff';
  for (let i = 0; i < 60; i++) { const px = r() * w, py = r() * h * 0.62; if (Math.hypot(px - A.x, py - A.y) < A.r * 1.4) continue; x.globalAlpha = 0.25 + r() * 0.6; x.beginPath(); x.arc(px, py, Math.max(0.6, s * (0.0018 + r() * 0.003)), 0, 6.283); x.fill(); }
  x.globalAlpha = 0.85; for (const [px, py, pr] of [[0.12, 0.13, 0.016], [0.3, 0.07, 0.012], [0.47, 0.22, 0.01], [0.93, 0.5, 0.013], [0.2, 0.4, 0.009]]) { shYildiz4(x, px * w, py * h, pr * s, 0.3); x.fill(); }
  x.globalAlpha = 1;
  // kocaman inci-sarı ay: gümüş hâle, sıcak disk, süt lekesi gibi yumuşak lekeler
  gr = x.createRadialGradient(A.x, A.y, A.r * 0.8, A.x, A.y, A.r * 3.4); gr.addColorStop(0, 'rgba(234,244,255,0.36)'); gr.addColorStop(0.45, 'rgba(207,230,255,0.12)'); gr.addColorStop(1, 'rgba(207,230,255,0)');
  x.fillStyle = gr; x.fillRect(A.x - A.r * 3.4, A.y - A.r * 3.4, A.r * 6.8, A.r * 6.8);
  gr = x.createRadialGradient(A.x - A.r * 0.3, A.y - A.r * 0.35, A.r * 0.1, A.x, A.y, A.r); gr.addColorStop(0, '#fffdf3'); gr.addColorStop(0.6, '#fff4d6'); gr.addColorStop(1, '#efd6a2');
  x.fillStyle = gr; x.beginPath(); x.arc(A.x, A.y, A.r, 0, 6.283); x.fill();
  x.fillStyle = 'rgba(222,190,140,0.2)'; for (const [dx, dy, dr] of [[-0.4, -0.34, 0.17], [0.42, -0.1, 0.12], [0.22, 0.46, 0.14], [-0.5, 0.32, 0.09]]) { x.beginPath(); x.arc(A.x + dx * A.r, A.y + dy * A.r, dr * A.r, 0, 6.283); x.fill(); }
  x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = Math.max(1, A.r * 0.025); x.beginPath(); x.arc(A.x, A.y, A.r * 0.97, Math.PI * 0.95, Math.PI * 1.6); x.stroke();
  // ayın önünden geçen lila bulut tülleri ve gökte yumuşak bulut kümeleri
  sh11Bulut(x, A.x - A.r * 1.05, A.y + A.r * 0.35, A.r * 0.6, 7, 1.3);
  sh11Bulut(x, A.x + A.r * 1.05, A.y + A.r * 0.15, A.r * 0.55, 9, 1.1);
  sh11Bulut(x, w * (O.kare ? 0.2 : 0.14), h * 0.17, s * 0.1, 3, 1); if (!O.kare) sh11Bulut(x, w * 0.84, h * 0.14, s * 0.09, 5, 0.9);
  // uzak tepeler ve uzakta minik kule siluetleri
  x.fillStyle = '#3e2f7c'; x.beginPath(); x.moveTo(-2, h); for (let i = 0; i <= 30; i++) { const px = i / 30 * w; x.lineTo(px, O.tepe - s * 0.07 - Math.sin(px / s * 3.4 + 1.2) * s * 0.035); } x.lineTo(w + 2, h); x.fill();
  x.fillStyle = '#35296c';
  for (const fx of O.kare ? [0.86, 0.95] : [0.08, 0.18, 0.88, 0.97]) { const px = fx * w, py = O.tepe - s * 0.07 - Math.sin(px / s * 3.4 + 1.2) * s * 0.035, kw = s * 0.018; x.fillRect(px - kw, py - s * 0.09, kw * 2, s * 0.1); x.beginPath(); x.moveTo(px - kw * 1.6, py - s * 0.09); x.quadraticCurveTo(px, py - s * 0.16, px + kw * 1.6, py - s * 0.09); x.fill(); }
  x.fillStyle = 'rgba(255,215,122,0.55)'; for (const fx of O.kare ? [0.86, 0.95] : [0.08, 0.18, 0.88, 0.97]) { const px = fx * w, py = O.tepe - s * 0.07 - Math.sin(px / s * 3.4 + 1.2) * s * 0.035; x.beginPath(); x.arc(px, py - s * 0.06, s * 0.005, 0, 6.283); x.fill(); }
  // şatonun tepesi ve şato
  const tp = px => O.tepe - Math.sin((px - O.st.x) / s * 2.2) * s * 0.012 + Math.pow((px - O.st.x) / (s * 0.9), 2) * s * 0.12;
  gr = x.createLinearGradient(0, O.tepe - s * 0.05, 0, h); gr.addColorStop(0, '#2f2566'); gr.addColorStop(1, '#1b1540');
  x.fillStyle = gr; x.beginPath(); x.moveTo(-2, h); for (let i = 0; i <= 40; i++) { const px = i / 40 * w; x.lineTo(px, tp(px)); } x.lineTo(w + 2, h); x.fill();
  x.strokeStyle = 'rgba(207,230,255,0.25)'; x.lineWidth = Math.max(1, s * 0.004); x.beginPath(); for (let i = 0; i <= 40; i++) { const px = i / 40 * w; if (i) x.lineTo(px, tp(px) + 1); else x.moveTo(px, tp(px) + 1); } x.stroke();
  // ay ışığının şatoya düşen yumuşak ışığı
  gr = x.createRadialGradient(O.st.x, O.st.y - O.st.u, 0, O.st.x, O.st.y - O.st.u, O.st.u * 2.6); gr.addColorStop(0, 'rgba(207,230,255,0.2)'); gr.addColorStop(1, 'rgba(207,230,255,0)');
  x.fillStyle = gr; x.fillRect(O.st.x - O.st.u * 2.6, O.st.y - O.st.u * 3.6, O.st.u * 5.2, O.st.u * 5.2);
  sh11Sato(x, O);
  // kapıdan aşağı kıvrılan soluk patika
  { const [kx, ky] = O.kapi; x.strokeStyle = 'rgba(217,200,255,0.35)'; x.lineWidth = s * 0.03; x.beginPath(); x.moveTo(kx, ky); x.bezierCurveTo(kx - s * 0.02, ky + s * 0.08, kx + s * 0.12, ky + s * 0.1, kx + s * 0.06, h + 2); x.stroke(); x.strokeStyle = 'rgba(255,230,245,0.25)'; x.lineWidth = s * 0.012; x.stroke(); }
  // yerde parlayan pembe-lila sis kuşağı
  gr = x.createLinearGradient(0, O.tepe - s * 0.02, 0, O.tepe + s * 0.14); gr.addColorStop(0, 'rgba(255,179,209,0)'); gr.addColorStop(0.45, 'rgba(255,179,209,0.3)'); gr.addColorStop(0.75, 'rgba(195,155,255,0.22)'); gr.addColorStop(1, 'rgba(195,155,255,0)');
  x.fillStyle = gr; x.fillRect(0, O.tepe - s * 0.02, w, s * 0.16);
  // ön tepe, budanmış çalılar, fener direkleri
  gr = x.createLinearGradient(0, h * 0.86, 0, h); gr.addColorStop(0, '#2a205a'); gr.addColorStop(1, '#150f34');
  x.fillStyle = gr; x.beginPath(); x.moveTo(-2, h); for (let i = 0; i <= 24; i++) { const px = i / 24 * w; x.lineTo(px, h * (O.kare ? 0.92 : 0.89) - Math.sin(px / s * 2.4 + 0.5) * s * 0.02); } x.lineTo(w + 2, h); x.fill();
  for (const [px, py, pr, tip] of O.cali) sh11Cali(x, px, py, pr, tip);
  for (const [px, py, fr] of O.fener) {   // ince kıvrık direk, ucunda kafes fener (ışık topu canlı katmanda)
    x.strokeStyle = '#231a4e'; x.lineWidth = Math.max(1, fr * 0.22); x.beginPath(); x.moveTo(px, py + fr * 3); x.lineTo(px, py + fr * 0.8); x.quadraticCurveTo(px, py - fr * 0.2, px + fr * 0.5, py - fr * 0.4); x.stroke();
    x.fillStyle = '#4b3a8c'; x.beginPath(); x.moveTo(px - fr * 0.55, py - fr * 0.6); x.lineTo(px + fr * 0.55, py - fr * 0.6); x.lineTo(px, py - fr * 1.15); x.closePath(); x.fill();
    x.strokeStyle = '#8a76c8'; x.lineWidth = Math.max(0.6, fr * 0.1); x.beginPath(); x.rect(px - fr * 0.45, py - fr * 0.6, fr * 0.9, fr * 1.2); x.stroke();
  }
  x.strokeStyle = '#2f2a5e'; x.lineWidth = Math.max(1, s * 0.004);   // ot tutamları
  { const q = rng(19); for (let i = 0; i < Math.ceil(w / s * 12); i++) { const px = q() * w, py = h * (0.975 + q() * 0.03), hh = s * (0.015 + q() * 0.02); x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + hh * 0.2, py - hh * 0.6, px + hh * 0.35 * (q() - 0.3), py - hh); x.moveTo(px, py); x.quadraticCurveTo(px - hh * 0.25, py - hh * 0.5, px - hh * 0.4, py - hh * 0.8); x.stroke(); } }
  x.restore();
}
function sh11Canli(ox, oy, w, h, tm, a, hov) {
  if (a <= 0.01) return;
  hov = hov || 0;
  const O = sh11Yer(w, h), s = O.s, A = O.ay, hz = 1 + 0.35 * hov, t = tm * hz;
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  g.globalCompositeOperation = 'lighter';
  // 1) ay hâlesi nefes alır; yıldızcıklar ışıldar
  dglow('#eaf4ff', ox + A.x, oy + A.y, A.r * (2.4 + 0.2 * Math.sin(tm * 0.7)), a * 0.28);
  for (let i = 0; i < 6; i++) {
    const tw = Math.pow(0.5 + 0.5 * Math.sin(t * (1.1 + i * 0.17) + i * 2.3), 3), px = w * (0.07 + 0.15 * i + 0.04 * Math.sin(i * 3.7)), py = h * (0.07 + 0.3 * sh7Hs(i + 1100));
    if (Math.abs(px - A.x) < A.r * 1.3 && Math.abs(py - A.y) < A.r * 1.3) continue;
    shParilti(ox + px, oy + py, s * 0.02 * (0.4 + tw), a * tw * 0.9);
  }
  // 2) şato pencereleri sırayla yanar (aşağıdan yukarı), bir süre hep birlikte nefes alır, yumuşakça söner; döngü
  const ph = (t * 0.9) % 8, n = O.pen.length;
  for (let i = 0; i < n; i++) {
    const L = smooth(clamp((ph - 0.6 - i * 0.42) / 0.35, 0, 1)) * (1 - smooth(clamp((ph - 7.0) / 0.8, 0, 1)));
    if (L <= 0.01) continue;
    const q = O.pen[i], tw = 0.85 + 0.15 * Math.sin(t * 1.7 + i * 1.9);
    dglow(i % 3 === 2 ? '#cfe6ff' : '#ffd27a', ox + q[0], oy + q[1], q[2] * 5, a * 0.45 * L * tw);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = a * L;
    g.fillStyle = i % 3 === 2 ? '#dcecff' : '#ffe08a'; g.beginPath(); g.arc(ox + q[0], oy + q[1], q[2], 0, 6.283); g.fill();
    g.fillStyle = '#fff7dc'; g.beginPath(); g.arc(ox + q[0] - q[2] * 0.25, oy + q[1] - q[2] * 0.25, q[2] * 0.45, 0, 6.283); g.fill();
    g.strokeStyle = '#8a6070'; g.lineWidth = Math.max(0.5, q[2] * 0.16); g.beginPath(); g.moveTo(ox + q[0] - q[2], oy + q[1]); g.lineTo(ox + q[0] + q[2], oy + q[1]); g.moveTo(ox + q[0], oy + q[1] - q[2]); g.lineTo(ox + q[0], oy + q[1] + q[2]); g.stroke();
    g.globalAlpha = 1; g.globalCompositeOperation = 'lighter';
  }
  // kapının sıcak ışığı (son pencereyle birlikte açılır)
  { const L = smooth(clamp((ph - 0.6 - n * 0.42) / 0.5, 0, 1)) * (1 - smooth(clamp((ph - 7.0) / 0.8, 0, 1))), [kx, ky, kw, kh] = O.kapi;
    if (L > 0.01) { dglow('#ffd27a', ox + kx, oy + ky - kh * 0.4, kw * 3.2, a * 0.4 * L); g.globalCompositeOperation = 'source-over'; g.globalAlpha = a * L * 0.85; g.fillStyle = '#ffd98a'; g.beginPath(); g.moveTo(ox + kx - kw * 0.8, oy + ky); g.lineTo(ox + kx - kw * 0.8, oy + ky - kh + kw); g.arc(ox + kx, oy + ky - kh + kw, kw * 0.8, Math.PI, 0); g.lineTo(ox + kx + kw * 0.8, oy + ky); g.fill(); g.globalAlpha = 1; g.globalCompositeOperation = 'lighter'; } }
  // 3) fenerlerde sihirli ay ışığı topları; yerde süzülen pembe-lila sis
  for (let i = 0; i < O.fener.length; i++) { const [px, py, fr] = O.fener[i], nb = 0.8 + 0.2 * Math.sin(tm * 2.1 + i * 1.7); dglow('#cfe6ff', ox + px, oy + py, fr * 3.4 * nb, a * 0.45); dglow('#ffffff', ox + px, oy + py, fr * 0.9, a * 0.7); }
  for (let i = 0; i < 5; i++) { const u = (tm * 0.014 * hz + i * 0.23) % 1, px = (u * 1.3 - 0.15) * w, py = O.tepe + s * (0.03 + 0.02 * Math.sin(i * 1.7 + tm * 0.3)); dglow(i % 2 ? '#c39bff' : '#ffb3d1', ox + px, oy + py, s * (0.14 + 0.04 * (i % 3)), a * 0.13 * Math.sin(u * Math.PI)); }
  // 4) ışık tozları: tepeden yükselen pastel zerreler (böcek değil)
  for (let i = 0; i < 10; i++) {
    const r1 = sh7Hs(i * 3 + 1501), r2 = sh7Hs(i * 3 + 1502), u = (tm * (0.05 + 0.03 * r2) * hz + r1) % 1, px = w * ((r1 * 1.7 + r2) % 1) + Math.sin(tm * 0.7 + i) * s * 0.02, py = h * (0.95 - u * 0.5);
    const al = a * Math.sin(u * Math.PI) * (0.5 + 0.5 * Math.sin(tm * 2.1 + i * 1.3));
    dglow(SH11_RENK[i % 5], ox + px, oy + py, s * (0.012 + 0.01 * r2), al * 0.7);
  }
  g.globalCompositeOperation = 'source-over';
  // 5) kubbe flaması dalgalanır
  { const bx = ox + O.bay[0], by = oy + O.bay[1], fw = O.st.u * 0.26, w1 = Math.sin(t * 4.2), w2 = Math.sin(t * 5.1 + 1);
    g.globalAlpha = a; g.fillStyle = '#ff7a9a'; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(bx + fw * 0.5, by - fw * 0.08 + w1 * fw * 0.08, bx + fw, by + fw * 0.14 + w2 * fw * 0.1); g.quadraticCurveTo(bx + fw * 0.5, by + fw * 0.26 + w1 * fw * 0.06, bx, by + fw * 0.4); g.closePath(); g.fill(); g.globalAlpha = 1; }
  // 6) lila yarasa ayın önünden süzülür (kanat çırpar, ara sıra göz kırpar); uzakta iki minik yarasa
  if (typeof sh8Yarasa === 'function') {
    const u = (t * 0.06) % 1, an = u * 6.2832, bx = ox + A.x + Math.cos(an) * A.r * 1.35, by = oy + A.y - A.r * 0.5 + Math.sin(an) * A.r * 0.35 + Math.sin(t * 1.3) * s * 0.012, gc = (t / 3.9) % 1;
    sh8Yarasa(bx, by, s * (O.kare ? 0.042 : 0.034), Math.sin(t * 8), gc > 0.94 ? 0 : 1, Math.sin(an) > 0 ? -1 : 1, a);
    for (let i = 0; i < 2; i++) { const v = (tm * (0.025 + i * 0.008) * hz + i * 0.5) % 1, px = ox + w * (-0.1 + v * 1.2), py = oy + h * (0.12 + i * 0.1) + Math.sin(v * 9 + i) * s * 0.02; sh8Yarasa(px, py, s * (i ? 0.011 : 0.014), Math.sin(tm * 9 + i * 2), 1, 1, a * 0.85 * Math.sin(v * Math.PI)); }
  }
  g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function sh11Ikon(c, r) {   // etiket simgesi: pembe külahlı minik kule, ışıklı yuvarlak pencere, hilal ve minik yarasa
  c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
  c.fillStyle = '#fff4d6'; c.beginPath(); c.arc(r * 0.5, -r * 0.55, r * 0.34, 0, 6.283); c.fill();   // hilal
  c.fillStyle = '#6a58b0'; c.beginPath(); c.arc(r * 0.64, -r * 0.66, r * 0.28, 0, 6.283); c.fill();
  c.fillStyle = '#231a4e'; c.fillRect(-r * 0.42, -r * 0.24, r * 0.84, r * 1.02);   // kule (kontur)
  c.fillStyle = '#b8a4ea'; c.fillRect(-r * 0.36, -r * 0.2, r * 0.72, r * 0.96);
  c.fillStyle = '#d6c8f6'; c.fillRect(-r * 0.36, -r * 0.2, r * 0.18, r * 0.96);
  c.fillStyle = '#231a4e'; c.beginPath(); c.moveTo(-r * 0.6, -r * 0.16); c.quadraticCurveTo(-r * 0.2, -r * 0.5, -r * 0.02, -r * 1.0); c.quadraticCurveTo(r * 0.14, -r * 1.12, r * 0.34, -r * 1.04); c.quadraticCurveTo(r * 0.16, -r * 0.98, r * 0.12, -r * 0.86); c.quadraticCurveTo(r * 0.24, -r * 0.48, r * 0.6, -r * 0.16); c.closePath(); c.fill();
  c.fillStyle = '#ff9fc4'; c.beginPath(); c.moveTo(-r * 0.5, -r * 0.2); c.quadraticCurveTo(-r * 0.18, -r * 0.5, -r * 0.01, -r * 0.92); c.quadraticCurveTo(r * 0.12, -r * 1.02, r * 0.26, -r * 1.0); c.quadraticCurveTo(r * 0.1, -r * 0.92, r * 0.06, -r * 0.8); c.quadraticCurveTo(r * 0.2, -r * 0.48, r * 0.5, -r * 0.2); c.closePath(); c.fill();
  c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(0, r * 0.18, r * 0.17, 0, 6.283); c.fill();   // ışıklı pencere
  c.strokeStyle = '#8a6070'; c.lineWidth = r * 0.05; c.beginPath(); c.moveTo(-r * 0.17, r * 0.18); c.lineTo(r * 0.17, r * 0.18); c.moveTo(0, r * 0.01); c.lineTo(0, r * 0.35); c.stroke();
  // minik lila yarasa (solda)
  c.fillStyle = '#9d7bdf'; const yx = -r * 0.62, yy = -r * 0.62;
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(yx + sd * r * 0.06, yy); c.quadraticCurveTo(yx + sd * r * 0.2, yy - r * 0.14, yx + sd * r * 0.3, yy - r * 0.04); c.quadraticCurveTo(yx + sd * r * 0.2, yy + r * 0.0, yx + sd * r * 0.06, yy + r * 0.06); c.closePath(); c.fill(); }
  c.fillStyle = '#c39bff'; c.beginPath(); c.arc(yx, yy, r * 0.1, 0, 6.283); c.fill();
  c.fillStyle = '#231a4e'; c.beginPath(); c.arc(yx - r * 0.035, yy - r * 0.01, r * 0.02, 0, 6.283); c.arc(yx + r * 0.035, yy - r * 0.01, r * 0.02, 0, 6.283); c.fill();
  c.restore();
}
// ── odanın süsü: perde çubuğundan baş aşağı sarkan keçe lila yarasa + iplerde kâğıt yıldız ve hilal (oda birimi; karede degrade yok) ──
const SH11_YAR = { x: 27, y: 9.8, ip: 2.4 };   // perde çubuğundaki asılma yeri, ipin boyu
function sh11KeceYarasa(r, gece, goz, kanat) {   // (0,0) asılma noktası; baş aşağı (ayaklar yukarıda); r gövde yarıçapı
  const gv = gece ? '#7d68c4' : '#b9a0f0', gvA = gece ? '#9a86dc' : '#d6c6ff', kn = gece ? '#5f4fae' : '#9d84e0', kon = gece ? 'rgba(30,20,70,0.6)' : 'rgba(90,60,140,0.45)';
  g.lineJoin = 'round'; g.lineCap = 'round';
  g.strokeStyle = kon; g.lineWidth = r * 0.12; g.beginPath(); g.moveTo(-r * 0.25, 0); g.lineTo(-r * 0.2, r * 0.4); g.moveTo(r * 0.25, 0); g.lineTo(r * 0.2, r * 0.4); g.stroke();   // ayakçıklar
  const cy = r * 1.3;
  for (const sd of [-1, 1]) {   // kanatlar gövdeye sarılı (uyurken), kanat > 0: hafifçe açılır
    g.save(); g.translate(sd * r * 0.7, cy - r * 0.2); g.rotate(sd * (0.25 + 0.5 * kanat)); g.fillStyle = kn;
    g.beginPath(); g.moveTo(0, -r * 0.5); g.quadraticCurveTo(sd * r * 0.75, -r * 0.2, sd * r * 0.55, r * 0.75); g.quadraticCurveTo(sd * r * 0.35, r * 0.5, sd * r * 0.15, r * 0.8); g.quadraticCurveTo(0, r * 0.4, 0, -r * 0.5); g.fill(); g.restore();
  }
  g.fillStyle = kon; g.beginPath(); g.arc(0, cy, r * 1.06, 0, 6.283); g.fill();
  g.fillStyle = gv; g.beginPath(); g.arc(0, cy, r, 0, 6.283); g.fill();
  g.fillStyle = gvA; g.beginPath(); g.ellipse(0, cy - r * 0.32, r * 0.55, r * 0.42, 0, 0, 6.283); g.fill();   // açık karın (baş aşağı: yukarıda)
  // kulaklar (baş aşağı: altta)
  g.fillStyle = gv; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * r * 0.68, cy + r * 0.5); g.quadraticCurveTo(sd * r * 0.82, cy + r * 1.25, sd * r * 0.5, cy + r * 1.38); g.quadraticCurveTo(sd * r * 0.32, cy + r * 1.0, sd * r * 0.12, cy + r * 0.88); g.closePath(); g.fill(); }
  g.fillStyle = '#ffb3dc'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * r * 0.58, cy + r * 0.66); g.quadraticCurveTo(sd * r * 0.64, cy + r * 1.08, sd * r * 0.5, cy + r * 1.16); g.quadraticCurveTo(sd * r * 0.4, cy + r * 0.94, sd * r * 0.28, cy + r * 0.88); g.closePath(); g.fill(); }
  // yüz (ters): gözler gövdenin alt yarısında; uyurken ^ biçimi (ters: v), açıkken iri parlak
  const ey = cy + r * 0.28;
  if (goz > 0.35) { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(-r * 0.36, ey, r * 0.24, r * 0.27 * goz, 0, 0, 6.283); g.ellipse(r * 0.36, ey, r * 0.24, r * 0.27 * goz, 0, 0, 6.283); g.fill(); g.fillStyle = '#2a1f4e'; g.beginPath(); g.ellipse(-r * 0.33, ey + r * 0.03, r * 0.14, r * 0.17 * goz, 0, 0, 6.283); g.ellipse(r * 0.39, ey + r * 0.03, r * 0.14, r * 0.17 * goz, 0, 0, 6.283); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(-r * 0.29, ey + r * 0.1, r * 0.06, 0, 6.283); g.arc(r * 0.43, ey + r * 0.1, r * 0.06, 0, 6.283); g.fill(); }
  else { g.strokeStyle = '#2a1f4e'; g.lineWidth = r * 0.09; g.beginPath(); g.moveTo(-r * 0.56, ey); g.quadraticCurveTo(-r * 0.36, ey + r * 0.16, -r * 0.16, ey); g.moveTo(r * 0.16, ey); g.quadraticCurveTo(r * 0.36, ey + r * 0.16, r * 0.56, ey); g.stroke(); }
  g.fillStyle = 'rgba(255,130,190,0.55)'; g.beginPath(); g.ellipse(-r * 0.6, ey - r * 0.22, r * 0.14, r * 0.09, 0, 0, 6.283); g.ellipse(r * 0.6, ey - r * 0.22, r * 0.14, r * 0.09, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#4a2f7a'; g.lineWidth = r * 0.08; g.beginPath(); g.arc(0, ey - r * 0.16, r * 0.17, Math.PI + 0.45, -0.45); g.stroke();   // gülümseme (ters)
  // kenar dikişi (keçe)
  g.strokeStyle = gece ? 'rgba(200,185,255,0.35)' : 'rgba(255,255,255,0.6)'; g.lineWidth = r * 0.05; g.setLineDash([r * 0.14, r * 0.12]); g.beginPath(); g.arc(0, cy, r * 0.86, 0, 6.283); g.stroke(); g.setLineDash([]);
}
function sh11KagitSus(x, y, tip, r, gece, sal) {   // ipte kâğıt yıldız / hilal
  g.save(); g.translate(x, y); g.rotate(sal);
  g.fillStyle = tip ? (gece ? '#d8c86e' : '#ffe08a') : (gece ? '#a9b8e8' : '#cfe0ff'); g.strokeStyle = gece ? 'rgba(40,30,80,0.5)' : 'rgba(150,120,80,0.45)'; g.lineWidth = r * 0.1;
  if (tip) { shYildiz5(g, 0, r, r); g.fill(); g.stroke(); }
  else { g.beginPath(); g.arc(0, r, r, Math.PI * 0.35, Math.PI * 1.65); g.quadraticCurveTo(-r * 0.15, r, Math.cos(Math.PI * 0.35) * r, r + Math.sin(Math.PI * 0.35) * r); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
}
function sh11Oda(tm, a, gece) {
  if (a <= 0.01) return;
  g.save(); shOdaT(); g.globalAlpha = a;
  const Y = SH11_YAR, ipc = gece ? 'rgba(150,140,210,0.75)' : 'rgba(170,120,80,0.7)';
  // iki yanında iplerde kâğıt yıldız ve hilal
  for (const [dx, boy, tip, ph] of [[-6.5, 5.5, 1, 0], [4.8, 3.4, 1, 1.7], [-11, 8.5, 0, 2.4], [10.2, 2.4, 0, 3.1]]) {
    const sal = Math.sin(tm * (gece ? 0.9 : 0.6) + ph) * 0.12, ex = Y.x + dx + Math.sin(sal) * boy, ey = Y.y + Math.cos(sal) * boy;
    g.strokeStyle = ipc; g.lineWidth = 0.1; g.beginPath(); g.moveTo(Y.x + dx, Y.y); g.lineTo(ex, ey); g.stroke();
    sh11KagitSus(ex, ey, tip, tip ? 1.2 : 1.1, gece, -sal);
  }
  // keçe yarasa: gece uyur (ara sıra bir gözünü açıp kırpar), sabah gözleri açık gülümser
  const sal = Math.sin(tm * (gece ? 0.8 : 0.55)) * 0.08 + Math.sin(tm * 0.31 + 1) * 0.04;
  const kc = (tm / 6.4) % 1, uyan = gece ? (kc > 0.86 ? Math.sin((kc - 0.86) / 0.14 * Math.PI) : 0) : 1;
  g.strokeStyle = ipc; g.lineWidth = 0.12; g.beginPath(); g.moveTo(Y.x, Y.y); g.lineTo(Y.x + Math.sin(sal) * Y.ip, Y.y + Math.cos(sal) * Y.ip); g.stroke();
  g.save(); g.translate(Y.x + Math.sin(sal) * Y.ip, Y.y + Math.cos(sal) * Y.ip); g.rotate(-sal);
  sh11KeceYarasa(1.9, gece, uyan, gece ? uyan * 0.4 : 0.15 + 0.1 * Math.sin(tm * 1.2));
  g.restore();
  g.restore(); g.globalAlpha = 1;
}
// ── sabah penceresi: şeftali-pembe şafak, uzak tepede pastel şato (ışıkları sönmüş, uykuda), batan solgun ay, eve dönen iki minik yarasa ──
let sh11SabahGr = null;
function sh11Sabah(tm, a) {
  if (a <= 0.01) return;
  g.save(); shOdaT(); shPencereYol(g, 0); g.clip(); g.globalAlpha = a;
  if (!sh11SabahGr) { sh11SabahGr = g.createLinearGradient(0, SH_PEN.ust, 0, 48); sh11SabahGr.addColorStop(0, '#b4c4f0'); sh11SabahGr.addColorStop(0.45, '#e6d0f0'); sh11SabahGr.addColorStop(0.8, '#ffd6d6'); sh11SabahGr.addColorStop(1, '#ffe2c4'); }   // oda birimi: dönüşümden bağımsız, bir kez
  g.fillStyle = sh11SabahGr; g.fillRect(SH_PEN.x0 - 1, SH_PEN.ust - 1, SH_PEN.x1 - SH_PEN.x0 + 2, 52 - SH_PEN.ust);
  // pembe bulutlar
  g.fillStyle = 'rgba(255,200,220,0.7)'; for (const [cx, cy, rr] of [[18.5, 21.5, 1.8], [20.6, 21, 2.2], [22.6, 21.6, 1.6], [30, 17.6, 1.4], [31.8, 17.2, 1.8], [33.4, 17.7, 1.3]]) { g.beginPath(); g.arc(cx, cy, rr, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.45)'; for (const [cx, cy, rr] of [[20.2, 20.2, 1.2], [31.4, 16.4, 1.0]]) { g.beginPath(); g.arc(cx, cy, rr, 0, 6.283); g.fill(); }
  // batan solgun ay (tepenin arkasına iniyor, hâlâ inci gibi)
  g.fillStyle = 'rgba(255,250,236,0.35)'; g.beginPath(); g.arc(33.2, 34.0, 3.9, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,248,228,0.95)'; g.beginPath(); g.arc(33.2, 34.0, 2.8, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(230,200,160,0.25)'; g.beginPath(); g.arc(32.4, 33.2, 0.65, 0, 6.283); g.arc(34.2, 34.6, 0.5, 0, 6.283); g.fill();
  // uzak lila tepe ve pastel şato
  g.fillStyle = '#c8b6e6'; g.beginPath(); g.moveTo(13, 50); g.lineTo(13, 41); g.quadraticCurveTo(20, 35.5, 27, 37.2); g.quadraticCurveTo(34, 35.4, 42, 39.4); g.lineTo(42, 50); g.fill();
  { const cx = 26, by = 37.4, u = 2.6;
    g.fillStyle = '#e6d8f4'; g.fillRect(cx - 1.4 * u, by - 1.3 * u, 0.6 * u, 1.3 * u); g.fillRect(cx + 0.9 * u, by - 1.7 * u, 0.4 * u, 1.7 * u); g.fillRect(cx - 0.8 * u, by - 0.9 * u, 1.6 * u, 0.9 * u);
    g.fillStyle = '#f2a8c6'; g.beginPath(); g.moveTo(cx - 1.55 * u, by - 1.3 * u); g.quadraticCurveTo(cx - 1.2 * u, by - 1.8 * u, cx - 1.1 * u, by - 2.25 * u); g.quadraticCurveTo(cx - 0.95 * u, by - 2.35 * u, cx - 0.8 * u, by - 2.25 * u); g.quadraticCurveTo(cx - 0.98 * u, by - 2.2 * u, cx - 1.0 * u, by - 2.05 * u); g.quadraticCurveTo(cx - 0.9 * u, by - 1.7 * u, cx - 0.65 * u, by - 1.3 * u); g.closePath(); g.fill();
    g.fillStyle = '#c9a6f0'; g.beginPath(); g.moveTo(cx + 0.82 * u, by - 1.7 * u); g.bezierCurveTo(cx + 0.5 * u, by - 2.0 * u, cx + 1.0 * u, by - 2.3 * u, cx + 1.1 * u, by - 2.5 * u); g.bezierCurveTo(cx + 1.2 * u, by - 2.3 * u, cx + 1.7 * u, by - 2.0 * u, cx + 1.38 * u, by - 1.7 * u); g.closePath(); g.fill();
    g.fillStyle = '#a98ad8'; g.beginPath(); g.moveTo(cx - 0.95 * u, by - 0.9 * u); g.quadraticCurveTo(cx, by - 1.55 * u, cx + 0.95 * u, by - 0.9 * u); g.closePath(); g.fill();
    g.fillStyle = '#ffe8b8'; for (const [px, py] of [[cx - 1.1 * u, by - 0.8 * u], [cx - 0.3 * u, by - 0.45 * u], [cx + 0.3 * u, by - 0.45 * u], [cx + 1.1 * u, by - 1.2 * u]]) { g.beginPath(); g.arc(px, py, 0.26, 0, 6.283); g.fill(); }
    g.strokeStyle = '#9a80c0'; g.lineWidth = 0.1; g.beginPath(); g.moveTo(cx + 1.1 * u, by - 2.5 * u); g.lineTo(cx + 1.1 * u, by - 3.0 * u); g.stroke();
    g.fillStyle = '#ff9fb8'; g.beginPath(); g.moveTo(cx + 1.1 * u, by - 3.0 * u); g.lineTo(cx + 1.1 * u + 1.1 + Math.sin(tm * 3) * 0.15, by - 2.85 * u); g.lineTo(cx + 1.1 * u, by - 2.7 * u); g.closePath(); g.fill(); }
  // yakın çayır ve pembe sis
  g.fillStyle = '#b9d8c0'; g.beginPath(); g.moveTo(13, 50); g.lineTo(13, 45.5); g.quadraticCurveTo(22, 42.8, 30, 45); g.quadraticCurveTo(36, 46.4, 42, 44.6); g.lineTo(42, 50); g.fill();
  g.fillStyle = 'rgba(255,214,230,0.45)'; g.beginPath(); g.ellipse(27, 44.2, 15, 1.4, 0, 0, 6.283); g.fill();
  // eve (şatoya) dönen iki minik yarasa
  for (let i = 0; i < 2; i++) {
    const u = (tm * 0.03 + i * 0.45) % 1, x = 37 - u * 10 - i * 2, y = 24 + u * 8 + Math.sin(u * 9 + i) * 0.8, k = Math.sin(tm * 9 + i * 2), r = 0.42;
    g.globalAlpha = a * Math.sin(u * Math.PI); g.fillStyle = '#9d84d8';
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(x + sd * r * 0.5, y); g.quadraticCurveTo(x + sd * r * 1.6, y - r * (0.6 + k * 0.6), x + sd * r * 2.2, y + r * 0.2); g.quadraticCurveTo(x + sd * r * 1.4, y + r * 0.1, x + sd * r * 0.5, y + r * 0.4); g.closePath(); g.fill(); }
    g.fillStyle = '#b9a0f0'; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill();
  }
  g.globalAlpha = a; g.restore();
  // pencere kayıtları göğün önünde kalsın
  g.save(); shOdaT(); g.globalAlpha = a; g.fillStyle = SH_SABAH.frame; const cxw = (SH_PEN.x0 + SH_PEN.x1) / 2;
  g.fillRect(cxw - 0.6, SH_PEN.ust, 1.2, SH_PEN.alt - SH_PEN.ust); g.fillRect(SH_PEN.x0, 31, SH_PEN.x1 - SH_PEN.x0, 1.2);
  g.restore(); g.globalAlpha = 1;
}
// ── komodinde rüyadan kalan küçük lila yarasa peluşu ve parlak bir çilek (dar ekranda yatağın üstündeki rafta) ──
function sh11Hediye(tm, a) {
  if (a <= 0.01) return;
  const kom = -(W / 2 + (sh.oxp || 0)) / sh.k0 < -57.5, k = sh.k0 * sh.zoom;
  const yx = kom ? -55.4 : -40.2, yy = kom ? SH_KOMODIN.ust - 0.05 : 38, cx = kom ? -62.2 : -28.6, cy = kom ? SH_KOMODIN.ust - 0.05 : 38, u = kom ? 1.8 : 1.5;
  // rüyanın ışığı (yumuşak gümüş-lila)
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  dglow('#d9c8ff', shEkranX(yx), shEkranY(yy - u * 1.2), k * u * 3, a * (0.24 + 0.06 * Math.sin(tm * 1.4)));
  g.globalCompositeOperation = 'source-over';
  g.save(); shOdaT(); g.globalAlpha = a; g.lineJoin = 'round'; g.lineCap = 'round';
  // çilek: parlak çilek kırmızısı, açık benekler, yeşil yaprak tacı
  g.save(); g.translate(cx, cy); g.scale(kom ? 1.4 : 1.2, kom ? 1.4 : 1.2);
  g.fillStyle = 'rgba(120,60,60,0.25)'; g.beginPath(); g.ellipse(0, 0.02, 0.95, 0.16, 0, 0, 6.283); g.fill();
  g.fillStyle = '#c42e58'; g.beginPath(); g.moveTo(0, -0.02); g.bezierCurveTo(-0.95, -0.25, -1.05, -1.5, -0.55, -1.75); g.quadraticCurveTo(0, -1.92, 0.55, -1.75); g.bezierCurveTo(1.05, -1.5, 0.95, -0.25, 0, -0.02); g.fill();
  g.fillStyle = '#ff4f7a'; g.beginPath(); g.moveTo(0, -0.12); g.bezierCurveTo(-0.85, -0.32, -0.95, -1.45, -0.5, -1.66); g.quadraticCurveTo(0, -1.82, 0.5, -1.66); g.bezierCurveTo(0.95, -1.45, 0.85, -0.32, 0, -0.12); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(-0.38, -1.25, 0.14, 0.3, 0.3, 0, 6.283); g.fill();
  g.fillStyle = '#ffe9a8'; for (const [px, py] of [[-0.45, -0.8], [0, -1.0], [0.45, -0.8], [-0.25, -0.5], [0.25, -0.5], [-0.2, -1.4], [0.3, -1.3], [0, -0.3]]) { g.beginPath(); g.ellipse(px, py, 0.05, 0.08, 0, 0, 6.283); g.fill(); }
  g.fillStyle = '#4fae5e'; for (const an of [-1.1, -0.5, 0.1, 0.7, 1.3]) { g.save(); g.translate(0, -1.75); g.rotate(an * 0.9); g.beginPath(); g.ellipse(0, -0.28, 0.14, 0.34, 0, 0, 6.283); g.fill(); g.restore(); }
  g.strokeStyle = '#3f8a4a'; g.lineWidth = 0.1; g.beginPath(); g.moveTo(0, -1.85); g.quadraticCurveTo(0.08, -2.2, 0.25, -2.3); g.stroke();
  g.restore();
  // lila yarasa peluşu: oturur; tombul top gövde, kanatları iki yanda (biri hafifçe el sallar), iri parlak gözler (ara sıra kırpar), pembe yanak
  g.save(); g.translate(yx, yy); g.scale(u, u);
  const gc = (tm / 4.4) % 1, goz = gc > 0.94 ? 1 - Math.sin((gc - 0.94) / 0.06 * Math.PI) : 1, el = Math.max(0, Math.sin(tm * 1.1)) * 0.35;
  g.fillStyle = 'rgba(80,50,120,0.25)'; g.beginPath(); g.ellipse(0, 0.05, 1.3, 0.2, 0, 0, 6.283); g.fill();
  for (const sd of [-1, 1]) {   // kanatlar (taraklı keçe)
    g.save(); g.translate(sd * 0.8, -1.05); g.rotate(sd * (0.35 + (sd > 0 ? el : 0))); g.fillStyle = '#8a6fd6';
    g.beginPath(); g.moveTo(0, -0.3); g.quadraticCurveTo(sd * 0.9, -0.75, sd * 1.25, -0.2); g.quadraticCurveTo(sd * 1.05, 0.0, sd * 0.95, 0.25); g.quadraticCurveTo(sd * 0.75, 0.05, sd * 0.55, 0.3); g.quadraticCurveTo(sd * 0.35, 0.1, 0, 0.3); g.closePath(); g.fill(); g.restore();
  }
  g.fillStyle = '#9d7bdf'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 0.42, -0.08, 0.3, 0.16, 0, 0, 6.283); g.fill(); }   // ayakçıklar
  g.fillStyle = '#6a4fb8'; g.beginPath(); g.arc(0, -1.0, 1.04, 0, 6.283); g.fill();
  g.fillStyle = '#b39af0'; g.beginPath(); g.arc(0, -1.0, 0.98, 0, 6.283); g.fill();
  g.fillStyle = '#c9b6ff'; g.beginPath(); g.arc(-0.2, -1.3, 0.6, 0, 6.283); g.fill(); g.fillStyle = '#b39af0'; g.beginPath(); g.arc(0.1, -0.9, 0.78, 0, 6.283); g.fill();
  g.fillStyle = '#e4d8ff'; g.beginPath(); g.ellipse(0, -0.6, 0.55, 0.42, 0, 0, 6.283); g.fill();   // açık karın
  g.fillStyle = '#b39af0'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 0.72, -1.48); g.quadraticCurveTo(sd * 0.82, -2.2, sd * 0.55, -2.32); g.quadraticCurveTo(sd * 0.32, -1.96, sd * 0.12, -1.86); g.closePath(); g.fill(); }   // kulaklar
  g.fillStyle = '#ffb3dc'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 0.6, -1.6); g.quadraticCurveTo(sd * 0.64, -2.0, sd * 0.52, -2.1); g.quadraticCurveTo(sd * 0.38, -1.9, sd * 0.26, -1.84); g.closePath(); g.fill(); }
  const ey = -1.2;
  if (goz > 0.3) { g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(-0.36, ey, 0.25, 0.29 * goz, 0, 0, 6.283); g.ellipse(0.36, ey, 0.25, 0.29 * goz, 0, 0, 6.283); g.fill(); g.fillStyle = '#2a1f4e'; g.beginPath(); g.ellipse(-0.31, ey + 0.03, 0.15, 0.19 * goz, 0, 0, 6.283); g.ellipse(0.41, ey + 0.03, 0.15, 0.19 * goz, 0, 0, 6.283); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(-0.27, ey - 0.05, 0.065, 0, 6.283); g.arc(0.45, ey - 0.05, 0.065, 0, 6.283); g.fill(); }
  else { g.strokeStyle = '#2a1f4e'; g.lineWidth = 0.08; g.beginPath(); g.moveTo(-0.56, ey); g.quadraticCurveTo(-0.36, ey - 0.16, -0.16, ey); g.moveTo(0.16, ey); g.quadraticCurveTo(0.36, ey - 0.16, 0.56, ey); g.stroke(); }
  g.fillStyle = 'rgba(255,130,190,0.6)'; g.beginPath(); g.ellipse(-0.62, -0.9, 0.15, 0.09, 0, 0, 6.283); g.ellipse(0.62, -0.9, 0.15, 0.09, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#4a2f7a'; g.lineWidth = 0.08; g.beginPath(); g.arc(0, -0.95, 0.18, 0.45, Math.PI - 0.45); g.stroke();
  g.fillStyle = '#ff7aa8'; g.beginPath(); g.moveTo(0.42, -1.92); g.lineTo(0.78, -2.12); g.lineTo(0.78, -1.78); g.closePath(); g.moveTo(0.42, -1.92); g.lineTo(0.12, -2.14); g.lineTo(0.14, -1.78); g.closePath(); g.fill();   // kulağında minik pembe fiyonk
  g.fillStyle = '#ffb3d1'; g.beginPath(); g.arc(0.44, -1.94, 0.09, 0, 6.283); g.fill();
  g.restore();
  g.restore(); g.globalAlpha = 1;
  // rüya tozu ışıltıları
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const tw = Math.pow(Math.max(0, Math.sin(tm * 1.3 + i * 1.7)), 2), an = i * 1.9 + tm * 0.2, bx = i < 3 ? yx : cx, by = i < 3 ? yy - u * 1.1 : cy - 1.2; shParilti(shEkranX(bx + Math.cos(an) * u * 1.5), shEkranY(by + Math.sin(an) * u), k * 0.9 * tw, a * tw * 0.9); }
  g.globalCompositeOperation = 'source-over';
}
// ── uyku → rüya geçişinin ön planı: alt köşelerde koyu budanmış çalı ve kıvrık fener direği siluetleri; üstte sarkan yarasa / ay /
//    yıldız biçimli kâğıt flamalar (paralaksla kayar). sahne.js 'onPlanS' adıyla çağırırsa kullanılır (istek: CORE). ──
function sh11OnPlan() {
  const c = shTuval(), x = c.getContext('2d'), s = Math.min(W, H), r = rng(1131);
  x.lineCap = 'round'; x.lineJoin = 'round';
  const kol = 'rgba(20,14,46,0.92)';
  for (const sd of [-1, 1]) {
    const bx = sd < 0 ? 0 : W;
    x.fillStyle = kol;
    for (let i = 0; i < 5; i++) { const px = bx + sd * s * (0.02 + i * 0.05 + r() * 0.02), py = H * (1.0 - r() * 0.04), rr = s * (0.05 + r() * 0.035); x.beginPath(); x.arc(px, py, rr, 0, 6.283); x.fill(); }   // tombul çalılar
    { const px = bx + sd * s * 0.07, py = H * 0.93, rr = s * 0.06;   // kalp biçimli budanmış çalı
      x.beginPath(); x.moveTo(px, py - rr * 0.35); x.bezierCurveTo(px - rr * 0.2, py - rr * 1.25, px - rr * 1.25, py - rr * 1.0, px - rr * 0.95, py - rr * 0.2); x.quadraticCurveTo(px - rr * 0.6, py + rr * 0.35, px, py + rr * 0.75); x.quadraticCurveTo(px + rr * 0.6, py + rr * 0.35, px + rr * 0.95, py - rr * 0.2); x.bezierCurveTo(px + rr * 1.25, py - rr * 1.0, px + rr * 0.2, py - rr * 1.25, px, py - rr * 0.35); x.fill();
      x.strokeStyle = 'rgba(207,230,255,0.3)'; x.lineWidth = Math.max(1, s * 0.003); x.beginPath(); x.moveTo(px - rr * 0.95, py - rr * 0.25); x.bezierCurveTo(px - rr * 1.2, py - rr * 0.95, px - rr * 0.25, py - rr * 1.2, px, py - rr * 0.4); x.stroke(); }
    { const px = bx + sd * s * 0.16, py = H * 1.01, fr = s * 0.018;   // kıvrık fener direği silueti
      x.strokeStyle = kol; x.lineWidth = fr * 0.5; x.beginPath(); x.moveTo(px, py); x.lineTo(px, H * 0.83); x.quadraticCurveTo(px, H * 0.8, px - sd * fr * 1.3, H * 0.795); x.stroke();
      x.fillStyle = kol; x.beginPath(); x.rect(px - sd * fr * 1.3 - fr * 0.6, H * 0.8, fr * 1.2, fr * 1.6); x.fill(); }
  }
  // üstte sarkan flama dizisi: yarasa, hilal, yıldız
  x.strokeStyle = 'rgba(40,28,70,0.7)'; x.lineWidth = Math.max(1, s * 0.003);
  const yA = H * 0.025, sark = H * 0.07, nok = u => [-W * 0.05 + u * W * 1.1, yA + Math.sin(u * Math.PI) * sark];
  x.beginPath(); for (let i = 0; i <= 24; i++) { const [px, py] = nok(i / 24); if (i) x.lineTo(px, py); else x.moveTo(px, py); } x.stroke();
  const n = Math.max(9, Math.round(W / s * 9));
  for (let i = 0; i < n; i++) {
    const [px, py] = nok((i + 0.5) / n), fs = s * 0.022; x.globalAlpha = 0.88; x.fillStyle = SH11_RENK[i % 5];
    if (i % 3 === 0) { x.beginPath(); x.arc(px, py + fs, fs * 0.42, 0, 6.283); x.moveTo(px, py + fs * 0.8); x.quadraticCurveTo(px + fs * 0.7, py + fs * 0.2, px + fs * 1.3, py + fs * 0.6); x.quadraticCurveTo(px + fs * 0.8, py + fs * 0.9, px, py + fs); x.quadraticCurveTo(px - fs * 0.8, py + fs * 0.9, px - fs * 1.3, py + fs * 0.6); x.quadraticCurveTo(px - fs * 0.7, py + fs * 0.2, px, py + fs * 0.8); x.fill(); }   // yarasa
    else if (i % 3 === 1) { x.beginPath(); x.arc(px, py + fs, fs * 0.8, Math.PI * 0.35, Math.PI * 1.65); x.quadraticCurveTo(px - fs * 0.1, py + fs, px + Math.cos(Math.PI * 0.35) * fs * 0.8, py + fs + Math.sin(Math.PI * 0.35) * fs * 0.8); x.fill(); }   // hilal
    else { shYildiz5(x, px, py + fs, fs * 0.85); x.fill(); }
  }
  x.globalAlpha = 1;
  return c;
}
function sh11OnToz(tm, a) {   // ön planda süzülen iri, yumuşak ay ışığı tozları (canlı, ekran pikseli)
  if (a <= 0.01) return;
  const s = Math.min(W, H);
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 10; i++) {
    const r1 = sh7Hs(i * 5 + 1701), r2 = sh7Hs(i * 5 + 1702), u = (r2 + tm * (0.03 + 0.02 * r1)) % 1, px = (r1 + Math.sin(tm * 0.4 + i * 1.3) * 0.03) * W, py = H * (1.05 - u * 1.1);
    dglow(SH11_RENK[i % 5], px, py, s * (0.02 + 0.012 * r1), a * 0.35 * Math.sin(u * Math.PI));
  }
  g.restore(); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
SH_BALON_RENK.sato = '#c9b8ff';
SH_ONBELLEK.push('sato', 'onPlanS');
SH_KUR.sato = () => { const A = { c: null, W, H, adim: [() => { A.c = shTuval(); sh11Fon(A.c.getContext('2d'), W, H); }] }; return A; };
SH_KUR.onPlanS = () => { const A = { c: null, W, H, adim: [() => { A.c = sh11OnPlan(); }] }; return A; };
OLAY.on('konusma', e => { if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 11 && e && e.anahtar === 'a_s_final1' && !sh.mod) sh.f6Ozet = 1; });
