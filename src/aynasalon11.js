/* aynasalon11.js — Bölüm 11 (Ay Işığı Şatosu) mini oyun 1: AYNA SALONU (önek as11), nesne türü 'aynaSalonMini'. Sahibi: MINI1.
   Şatonun aynalı salonunda ortada ayakta duran kocaman, kemerli, altın çerçeveli bir ayna; iki yanında duvarda üçer oval, süslü (yarasa /
   ay / yıldız işlemeli) BUĞULU ayna. Feza büyük aynanın önüne gelince kadraj salonu kucaklar (P.ucus = o ile fizik devralınır; Feza'yı,
   Pırıl'ı ve Vela'yı bu dosya çizer) ve OLAY 'salonBasla'.
   1) ŞAKA (~6,5 sn): Feza ile Vela aynanın önünde. Aynada Feza'nın ve Pırıl'ın yansıması el sallar; Vela da el sallar ama aynada
      GÖRÜNMEZ: yansımada yalnız yıldızlı tacı ve kurdelesi havada süzülür, sallanır. Vela kıkırdar (OLAY 'salonSaka' → Vela'nın sözü
      "Ben aynada görünmem ki!"), tacı aynada fırıl fırıl döner. Sonra Vela buğulu aynaları gösterir: elinden ışık zerreleri aynalara uçar.
   2) SİLME: Feza parmağıyla buğuyu siler (sürükleme; bir aynadan ötekine geçerek de olur). Dokunup bırakmak ya da basılı tutmak da yeter:
      sihirli bir ışık sarmalı o aynayı kendisi siler. Buğunun altında saklı altın yıldızlar parıldar; camın yarısı açılınca ayna
      "bulunur": buğu dağılır, yıldızlar fırlar ve KOMİK YANSIMA kısa bir gösteri yapar:
        sapkaPiril — Pırıl'ın yansımasına kocaman çizgili silindir şapka konar, uzar uzar, şapkasını çıkarıp selam verir (tepede yaylı yıldız)
        kediDede   — Vampir Dede'nin yansımasında kedi kulakları, pembe kedi burnu ve bıyıklar çıkar: "miyav", başını yana yatırır
        pitirKirp  — bebek Pıtır'ın kocaman yüzü aynaya yaklaşır, kirpikli KOCAMAN bir göz kırpar, kıkırdar
        cilekNine  — Vampir Nine'nin topuzu "puf" diye kocaman bir çileğe dönüşür, zıplar, kalpler uçuşur
        gulenAy    — aynada gece göğü: uyuyan Ay aşağıdan yükselir, uyanır, kahkahayla sallanır, göz kırpar; yıldızlar etrafında döner
        uzunFeza   — lunapark aynası: Feza'nın yansıması upuzun ince olur, sonra yassı tombul, jöle gibi dalgalanır
      Bulunmuş aynaya yeniden dokunmak gösteriyi tekrarlatır (her dokunuş bir şey yapsın). Vela ve Pırıl her bulunuşa sevinir.
   3) KAPANIŞ (~4,6 sn): bütün çerçeveler sırayla parlar; büyük aynada Vela'nın yansıması bir anlığına belirir, el sallar, GÖZ KIRPAR
      (OLAY 'salonVela'), yine görünmez olur (yalnız tacı kalır). Sonra Feza serbest, OLAY 'salonBitti', V11.salon = true, o.done.
   Kaybetme/yanlış/süre/yazı/öğretici el yok. İpucu ışıkla: sıradaki ayna nabız gibi parlar ve buğusunda bir ışık noktası zikzak çizer;
   ~9 sn'de Pırıl o aynanın yanında süzülür. ~25 sn dokunulmazsa (bir kez yardım ettiyse ~14 sn) Pırıl aynaya uçar, kuyruğuyla zikzak
   çizerek buğuyu kendisi siler. Klavye yedeği: ←/→ ayna seçer, Boşluk/Enter/E siler.
   Olaylar: 'salonBasla' {o} · 'salonSaka' {o} (Vela kıkırdar: vk_ayna) · 'salonOyun' {o} (silme başlar: p_s_salon_giris için uygun an) ·
     'salonIpucu' {o, n} (turda ~9 sn dokunulmadı; ayna başına bir kez) · 'salonYardim' {o, n} (Pırıl siliyor) ·
     'salonBul' {o, n (1..6), ad, i, yardim} · 'salonVela' {o} (Vela'nın yansıması göz kırpar) · 'salonBitti' {o}.
   Sesler (MUZIK; typeof korumalı): 'aynaSil' (v 0..1, silerken seyrek), 'aynaBul' (v = n), 'aynaKikir' (Vela), ayrıca genel 'parilti',
     'gozKirp', 'boing', 'puf', 'kediMiyav' (B8'den).
   Dışa açık: SALON11.o, SALON11.aktif (oyun sürerken nesne), SALON11.kutu() (kamera kutusu).
   Yerleşim (bolum11.js): nesne('aynaSalonMini', 232, yuzey(232), {x0, x1}); o.x ± 520 DÜZ zemin; Feza o.x - 150'yi geçince başlar.
   Hemen ilerisinde miniKapi (bagId) — o.done / o.tk.bitti / V11.salon ile açılır.
   Performans: bütün çerçeveler, camlar, yüzler, şapka, Ay, taç önbellekli sprite (ısıtma kareye yayılır); karede gradyan/filtre/shadowBlur
   yok; buğu her aynada küçük bir tuval (silinince yalnız fırça damgası); Feza/Pırıl yansıması küçük aynalarda bir kez çekilen fotoğraf. */
'use strict';
const AS11_PX = 2.5;                 // önbellek sprite çözünürlüğü (birim başına piksel)
const AS11_N = 6;
const AS11_RX = 60, AS11_RY = 78;    // küçük ayna camı (oval) yarı eksenleri
const AS11_BB = [104, 98];           // büyük ayna camının yarı genişliği (yatay, dikey ekran) — cila: daha dar, kadraj sıkı, Feza büyük
const AS11_BY0 = -84, AS11_BY1 = -408;   // büyük ayna camının altı / üstü (zemine göre)
// küçük aynaların yeri (cam merkezi; o.x'e ve zemine göre): yatay ekranda iki yanda üçgen, dikeyde iki sütun
const AS11_YAT = [[-210, -146], [-326, -278], [-214, -400], [214, -400], [326, -278], [210, -146]];
const AS11_DIK = [[-204, -142], [-204, -362], [-204, -582], [204, -582], [204, -362], [204, -142]];
const AS11_AD = ['sapkaPiril', 'kediDede', 'pitirKirp', 'cilekNine', 'gulenAy', 'uzunFeza'];
const AS11_SUS = ['yarasa', 'ay', 'yildiz', 'yildiz', 'ay', 'yarasa'];   // çerçevenin tepesindeki süs
const AS11_SIRA = [0, 5, 1, 4, 2, 3];   // ipucu/yardım sırası: alttakiler önce
const AS11_FX = -74, AS11_VX = 84, AS11_VH = 66;   // Feza ve Vela'nın yeri (merkeze göre), Vela'nın boyu (taç yüksekliği)
const AS11_REF = 0.86, AS11_REFY = -96;           // büyük aynadaki yansıma: ölçek, ayak yüksekliği (zemine göre)
const AS11_IPUCU = 5, AS11_GOSTER = 9, AS11_YARDIM = 25, AS11_YARDIM2 = 14;
const AS11_ESIK = 0.5;     // camın bu kadarı silinince ayna bulunur
const AS11_FIR = 27;       // parmak fırçası yarıçapı (birim)
const AS11_SAKA = 6.6, AS11_SON = 4.6, AS11_DON = 0.5, AS11_ANIM = 3.4;
const AS11_GX = 10, AS11_GY = 13, AS11_FPX = 1.25;   // silinme ızgarası, buğu tuvali çözünürlüğü
const AS11_ISIK = ['#cfe6ff', '#ffe7a8', '#ffb3d1', '#c39bff', '#ffffff', '#9ff0d0'];
const AS11_ALTIN = ['#ffd27a', '#ffe7a8', '#ffffff', '#fff4d6'];
const AS11_YLD = [[[-36, -50], [40, -30], [-26, 52]], [[34, -52], [-42, -20], [30, 50]]];   // buğunun altındaki saklı yıldızlar (cam içi)
const AS11_FZ_OPT = { ruzgar: 0.1 };
const SALON11 = {
  o: null, ptr: -1, klavye: false,
  get aktif() { const o = this.o; return o && o.as && o.as.aktif && !o.done ? o : null; },
  kutu() { const o = this.o; return o && o.as ? as11Kutu(o) : null; }
};
function as11Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function as11Cv(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
function as11Glow(c, col, x, y, rx, ry, a) { if (a <= 0.003) return; const ea = c.globalAlpha; c.globalAlpha = ea * Math.min(1, a); c.drawImage(glow(col), x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = ea; }
const as11Yay = u => u >= 1 ? 1 : u <= 0 ? 0 : 1 - Math.exp(-6 * u) * Math.cos(u * 9);   // yaylı (biraz taşıp oturan) geçiş
const as11Ac = (a, a0, a1) => clamp((a - a0) / (a1 - a0), 0, 1);
const as11Tepe = (a, a0, a1) => a <= a0 || a >= a1 ? 0 : Math.sin((a - a0) / (a1 - a0) * Math.PI);
function as11Yildiz(q, x, y, R, r) { q.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; i ? q.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d) : q.moveTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } q.closePath(); }
function as11Kalp(q, x, y, s) { q.beginPath(); q.moveTo(x, y + s * 0.82); q.bezierCurveTo(x - s * 1.3, y - s * 0.05, x - s * 0.72, y - s * 1.12, x, y - s * 0.45); q.bezierCurveTo(x + s * 0.72, y - s * 1.12, x + s * 1.3, y - s * 0.05, x, y + s * 0.82); q.closePath(); }
function as11Kemer(q, x, yb, yt, hw) { q.beginPath(); q.moveTo(x - hw, yb); q.lineTo(x - hw, yt + hw); q.arc(x, yt + hw, hw, Math.PI, 0); q.lineTo(x + hw, yb); q.closePath(); }
// silinme ızgarası: camın (oval) içindeki hücreler
const AS11_IC = new Uint8Array(AS11_GX * AS11_GY); let AS11_ICN = 0;
for (let j = 0; j < AS11_GY; j++) for (let i = 0; i < AS11_GX; i++) { const x = (i + 0.5) / AS11_GX * 2 - 1, y = (j + 0.5) / AS11_GY * 2 - 1; if (x * x + y * y < 0.9) { AS11_IC[j * AS11_GX + i] = 1; AS11_ICN++; } }

// ── önbellekli sprite'lar: ısıtma kareye yayılır (her karede bir parça) ──
const AS11S = { hazir: false, adim: 0 };
const AS11_ISIT = [
  () => { AS11S.firca = as11FircaCiz(); AS11S.yildiz = as11YildizSp(); AS11S.pirilti = as11PiriltiSp(); AS11S.serit = as11SeritSp(); AS11S.golge = as11GolgeSp(); },
  () => { AS11S.cam = as11CamCiz(false); AS11S.ust = as11CamCiz(true); },
  () => { AS11S.cerceve = { yarasa: as11CerceveCiz('yarasa') }; },
  () => { AS11S.cerceve.ay = as11CerceveCiz('ay'); },
  () => { AS11S.cerceve.yildiz = as11CerceveCiz('yildiz'); },
  () => { AS11S.bcam = as11BuyukCamCiz(false); AS11S.bust = as11BuyukCamCiz(true); },
  () => { AS11S.bcerceve = as11BuyukCerceveCiz(); },
  () => { AS11S.tac = as11TacCiz(); AS11S.sapka = as11SapkaCiz(); AS11S.kulak = as11KulakCiz(); },
  () => { AS11S.yuz = { dede: as11YuzCiz('dede') }; },
  () => { AS11S.yuz.bebek = as11YuzCiz('bebek'); },
  () => { AS11S.yuz.nine = as11YuzCiz('nine'); AS11S.cilek = as11CilekCiz(); AS11S.topuz = as11TopuzCiz(); },
  () => { AS11S.ay = as11AyCiz(); AS11S.gece = as11GeceCiz(); }
];
function as11Isit(n) { while (n-- > 0 && AS11S.adim < AS11_ISIT.length) AS11_ISIT[AS11S.adim++](); if (AS11S.adim >= AS11_ISIT.length) AS11S.hazir = true; return AS11S.hazir; }
function as11FircaCiz() {   // yumuşak silme fırçası (destination-out): ortası dolu, kenarı yumuşak
  const cv = as11Cv(64, 64), q = cv.getContext('2d'), gr = q.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(0.55, 'rgba(0,0,0,0.92)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); return cv;
}
function as11YildizSp() {   // altın beş köşeli yıldız (hafif hâleli); ref 32 px = 1 birim yarıçap 16
  const cv = as11Cv(64, 64), q = cv.getContext('2d'); q.translate(32, 32);
  const gh = q.createRadialGradient(0, 0, 0, 0, 0, 32); gh.addColorStop(0, 'rgba(255,231,168,0.55)'); gh.addColorStop(0.45, 'rgba(255,210,122,0.18)'); gh.addColorStop(1, 'rgba(255,210,122,0)'); q.fillStyle = gh; q.fillRect(-32, -32, 64, 64);
  const gr = q.createRadialGradient(-4, -5, 1, 0, 0, 18); gr.addColorStop(0, '#fffbe6'); gr.addColorStop(0.5, '#ffe08a'); gr.addColorStop(1, '#f2b53e');
  q.fillStyle = gr; q.strokeStyle = '#c8873a'; q.lineWidth = 2; q.lineJoin = 'round'; as11Yildiz(q, 0, 1, 17, 7.6); q.fill(); q.stroke();
  q.fillStyle = 'rgba(255,255,255,0.8)'; q.beginPath(); q.ellipse(-4, -5, 2.6, 4, -0.5, 0, 6.2832); q.fill(); return cv;
}
function as11PiriltiSp() {   // dört köşeli beyaz parıltı
  const cv = as11Cv(48, 48), q = cv.getContext('2d'); q.translate(24, 24);
  const gr = q.createRadialGradient(0, 0, 0, 0, 0, 22); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.3, 'rgba(255,255,255,0.25)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  q.fillStyle = gr; q.fillRect(-24, -24, 48, 48);
  q.fillStyle = '#ffffff'; q.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, d = i % 2 ? 3.2 : 20; i ? q.lineTo(Math.cos(a) * d, Math.sin(a) * d) : q.moveTo(Math.cos(a) * d, Math.sin(a) * d); } q.closePath(); q.fill(); return cv;
}
function as11SeritSp() {   // camdan geçen parlama şeridi (kenarları yumuşak)
  const cv = as11Cv(64, 8), q = cv.getContext('2d'), gr = q.createLinearGradient(0, 0, 64, 0);
  gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.75)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 8); return cv;
}
function as11GolgeSp() {   // duvara düşen yumuşak gölge
  const cv = as11Cv(64, 64), q = cv.getContext('2d'), gr = q.createRadialGradient(32, 32, 10, 32, 32, 32);
  gr.addColorStop(0, 'rgba(18,10,46,0.5)'); gr.addColorStop(0.7, 'rgba(18,10,46,0.22)'); gr.addColorStop(1, 'rgba(18,10,46,0)'); q.fillStyle = gr; q.fillRect(0, 0, 64, 64); return cv;
}
function as11CamParla(q, rx, ry) {   // camda iki çapraz parlama şeridi
  q.save(); q.rotate(-0.55); q.fillStyle = 'rgba(255,255,255,0.15)'; q.fillRect(-rx * 0.95, -ry * 1.4, rx * 0.34, ry * 2.8);
  q.fillStyle = 'rgba(255,255,255,0.08)'; q.fillRect(-rx * 0.45, -ry * 1.4, rx * 0.13, ry * 2.8); q.fillRect(rx * 0.5, -ry * 1.4, rx * 0.1, ry * 2.8); q.restore();
}
function as11CamCiz(ust) {   // küçük oval cam: arka plan (gümüş lila) ya da üst katman (kenar gölgesi + parlama şeritleri); köken cam merkezi
  const PX = AS11_PX, RX = AS11_RX, RY = AS11_RY, w = RX * 2 + 4, h = RY * 2 + 4, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, w / 2 * PX, h / 2 * PX); cv.bw = w; cv.bh = h;
  q.beginPath(); q.ellipse(0, 0, RX + 1, RY + 1, 0, 0, 6.2832); q.clip();
  if (!ust) {
    const gr = q.createRadialGradient(-16, -26, 6, 0, 0, RY * 1.1); gr.addColorStop(0, '#e2dcfa'); gr.addColorStop(0.55, '#b2a8e2'); gr.addColorStop(1, '#7466b8');
    q.fillStyle = gr; q.fillRect(-w, -h, 2 * w, 2 * h);
    const gm = q.createRadialGradient(10, 40, 2, 10, 40, 60); gm.addColorStop(0, 'rgba(207,230,255,0.35)'); gm.addColorStop(1, 'rgba(207,230,255,0)'); q.fillStyle = gm; q.fillRect(-w, -h, 2 * w, 2 * h);
  } else {
    const gr = q.createRadialGradient(0, 0, Math.min(RX, RY) * 0.7, 0, 0, RY * 1.05); gr.addColorStop(0, 'rgba(60,44,120,0)'); gr.addColorStop(0.7, 'rgba(60,44,120,0.08)'); gr.addColorStop(1, 'rgba(40,28,96,0.42)');
    q.fillStyle = gr; q.fillRect(-w, -h, 2 * w, 2 * h); as11CamParla(q, RX, RY);
    // derinlik: çerçeve camın içine üst-soldan gölge düşürür, alt-sağda kalın camın parlak pahı
    q.lineWidth = 7; q.strokeStyle = 'rgba(30,20,80,0.32)'; q.beginPath(); q.ellipse(2.5, 3.5, RX - 1, RY - 1, 0, Math.PI * 0.85, Math.PI * 1.75); q.stroke();
    q.lineWidth = 2; q.strokeStyle = 'rgba(234,244,255,0.75)'; q.beginPath(); q.ellipse(-1, -1, RX - 3.5, RY - 3.5, 0, -Math.PI * 0.1, Math.PI * 0.62); q.stroke();
    q.lineWidth = 1; q.strokeStyle = 'rgba(255,255,255,0.5)'; q.beginPath(); q.ellipse(0, 0, RX - 8, RY - 8, 0, Math.PI * 1.08, Math.PI * 1.42); q.stroke();
  }
  return cv;
}
function as11BuyukCamCiz(ust) {   // büyük kemerli cam (yarı genişlik AS11_BB[0]); köken: zemin ortası
  const PX = 2.2, hw = AS11_BB[0], yb = AS11_BY0, yt = AS11_BY1, w = hw * 2 + 4, h = yb - yt + 4, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, w / 2 * PX, (2 - yt) * PX); cv.bw = w; cv.bh = h;
  as11Kemer(q, 0, yb + 1, yt - 1, hw + 1); q.clip();
  if (!ust) {
    const gr = q.createLinearGradient(-hw, yt, hw, yb); gr.addColorStop(0, '#e6e0fb'); gr.addColorStop(0.45, '#bdb3e8'); gr.addColorStop(1, '#7c6fc0');
    q.fillStyle = gr; q.fillRect(-w, yt - 4, 2 * w, h + 8);
    const gm = q.createRadialGradient(0, yb - 40, 4, 0, yb - 40, 170); gm.addColorStop(0, 'rgba(207,230,255,0.4)'); gm.addColorStop(1, 'rgba(207,230,255,0)'); q.fillStyle = gm; q.fillRect(-w, yt - 4, 2 * w, h + 8);
    // aynanın içindeki salonun belli belirsiz zemini (yansıyan halı)
    q.fillStyle = 'rgba(90,70,160,0.22)'; q.fillRect(-w, yb - 22, 2 * w, 30);
    q.fillStyle = 'rgba(255,179,209,0.16)'; q.beginPath(); q.ellipse(0, yb - 8, hw * 0.8, 9, 0, 0, 6.2832); q.fill();
  } else {
    const gr = q.createLinearGradient(-hw, 0, hw, 0); gr.addColorStop(0, 'rgba(40,28,96,0.36)'); gr.addColorStop(0.18, 'rgba(40,28,96,0)'); gr.addColorStop(0.82, 'rgba(40,28,96,0)'); gr.addColorStop(1, 'rgba(40,28,96,0.36)');
    q.fillStyle = gr; q.fillRect(-w, yt - 4, 2 * w, h + 8);
    q.save(); q.translate(0, (yt + yb) / 2); as11CamParla(q, hw * 1.1, (yb - yt) * 0.6); q.restore();
    q.lineWidth = 9; q.strokeStyle = 'rgba(30,20,80,0.28)'; as11Kemer(q, 3, yb + 8, yt + 4, hw - 1); q.stroke();   // çerçevenin camdaki gölgesi
    q.lineWidth = 2; q.strokeStyle = 'rgba(234,244,255,0.6)'; as11Kemer(q, -1, yb - 3, yt + 3, hw - 4); q.stroke();   // cam pahı
  }
  return cv;
}
function as11Inci(q, x, y, r) { const gr = q.createRadialGradient(x - r * 0.35, y - r * 0.4, 0.3, x, y, r); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.6, '#f3ecff'); gr.addColorStop(1, '#bfb2dc'); q.fillStyle = gr; q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
function as11KalpTas(q, x, y, s) {
  q.fillStyle = '#b8862e'; as11Kalp(q, x, y, s + 1.8); q.fill();
  const gr = q.createRadialGradient(x - s * 0.3, y - s * 0.4, 0.5, x, y, s * 1.2); gr.addColorStop(0, '#ffd0de'); gr.addColorStop(0.5, '#ff7a9a'); gr.addColorStop(1, '#d8325e');
  q.fillStyle = gr; as11Kalp(q, x, y, s); q.fill(); q.fillStyle = 'rgba(255,255,255,0.75)'; q.beginPath(); q.ellipse(x - s * 0.35, y - s * 0.3, s * 0.18, s * 0.28, -0.5, 0, 6.2832); q.fill();
}
function as11AltinGr(q, x0, y0, x1, y1) { const al = q.createLinearGradient(x0, y0, x1, y1); al.addColorStop(0, '#fff3c4'); al.addColorStop(0.3, '#ffd27a'); al.addColorStop(0.62, '#c98f34'); al.addColorStop(1, '#ffe3a0'); return al; }
function as11YarasaSus(q, x, y, s) {   // tombul lila yarasa süsü: kanatlar açık, gülümser
  q.save(); q.translate(x, y); q.scale(s, s);
  for (const sx of [-1, 1]) {   // kanat: üç tombul dilimli
    q.fillStyle = '#7d5fd0'; q.beginPath(); q.moveTo(sx * 7, -3); q.quadraticCurveTo(sx * 20, -16, sx * 30, -8); q.quadraticCurveTo(sx * 27, -2, sx * 25, 2); q.quadraticCurveTo(sx * 21, -1, sx * 18, 4); q.quadraticCurveTo(sx * 14, 0, sx * 10, 6); q.closePath(); q.fill();
    q.strokeStyle = '#4b3a8c'; q.lineWidth = 1; q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.3)'; q.beginPath(); q.moveTo(sx * 9, -4); q.quadraticCurveTo(sx * 19, -13, sx * 28, -8); q.stroke();
  }
  const gr = q.createRadialGradient(-3, -4, 1, 0, 0, 11); gr.addColorStop(0, '#e6d6ff'); gr.addColorStop(1, '#a685f0');
  for (const sx of [-1, 1]) { q.fillStyle = '#a685f0'; q.beginPath(); q.moveTo(sx * 3, -8); q.quadraticCurveTo(sx * 7, -16, sx * 8.5, -7); q.closePath(); q.fill(); }
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 10, 0, 6.2832); q.fill(); q.strokeStyle = '#6a4fc0'; q.lineWidth = 1.1; q.stroke();
  q.fillStyle = '#2b2240'; for (const sx of [-1, 1]) { q.beginPath(); q.ellipse(sx * 3.6, -1.5, 2.1, 2.6, 0, 0, 6.2832); q.fill(); }
  q.fillStyle = '#ffffff'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 3.6 - 0.7, -2.4, 0.8, 0, 6.2832); q.fill(); }
  q.fillStyle = 'rgba(255,130,170,0.55)'; for (const sx of [-1, 1]) { q.beginPath(); q.arc(sx * 6.4, 2.2, 1.8, 0, 6.2832); q.fill(); }
  q.strokeStyle = '#5a2f5a'; q.lineWidth = 1; q.lineCap = 'round'; q.beginPath(); q.arc(0, 1.6, 2.4, 0.3, Math.PI - 0.3); q.stroke();
  q.restore();
}
function as11AySus(q, x, y, s) {   // uykulu, gülümseyen altın hilal
  q.save(); q.translate(x, y); q.scale(s, s);
  const gr = q.createLinearGradient(-12, -12, 10, 12); gr.addColorStop(0, '#fff6cc'); gr.addColorStop(0.5, '#ffd27a'); gr.addColorStop(1, '#d99b3c');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 13, Math.PI * 0.32, Math.PI * 1.68); q.arc(6, -1, 10.5, Math.PI * 1.55, Math.PI * 0.45, true); q.closePath(); q.fill();
  q.strokeStyle = '#a8742a'; q.lineWidth = 1.1; q.stroke();
  q.strokeStyle = '#7a4e1c'; q.lineWidth = 1.2; q.lineCap = 'round'; q.beginPath(); q.arc(-6.5, -3, 2.4, Math.PI * 0.1, Math.PI * 0.9); q.stroke();
  q.beginPath(); q.arc(-5, 4, 2.6, 0.2, Math.PI - 0.6); q.stroke();
  q.fillStyle = 'rgba(255,130,170,0.5)'; q.beginPath(); q.arc(-9, 1.5, 1.8, 0, 6.2832); q.fill();
  q.fillStyle = '#fff6cc'; as11Yildiz(q, 13, -10, 4, 1.8); q.fill();
  q.restore();
}
function as11YildizSus(q, x, y, s) {   // pembe taşlı altın yıldız
  q.save(); q.translate(x, y); q.scale(s, s);
  q.fillStyle = as11AltinGr(q, -13, -13, 13, 13); q.strokeStyle = '#a8742a'; q.lineWidth = 1.2; q.lineJoin = 'round'; as11Yildiz(q, 0, 0, 14, 6.4); q.fill(); q.stroke();
  as11KalpTas(q, 0, 0.5, 3.4); q.restore();
}
function as11Kivrim(q, sx, x, y, s) {   // altın kıvrım (çerçeve süsü)
  q.strokeStyle = '#b8862e'; q.lineWidth = 3.4 * s; q.lineCap = 'round';
  q.beginPath(); q.moveTo(x, y); q.bezierCurveTo(x + sx * 10 * s, y - 8 * s, x + sx * 22 * s, y - 2 * s, x + sx * 20 * s, y + 5 * s); q.arc(x + sx * 16 * s, y + 4 * s, 4 * s, 0, Math.PI * 1.6, sx < 0); q.stroke();
  q.strokeStyle = '#ffe7a8'; q.lineWidth = 1.4 * s; q.stroke();
}
function as11CerceveCiz(sus) {   // oval altın çerçeve (ortası boş), tepesinde süs; köken cam merkezi
  const PX = AS11_PX, RX = AS11_RX, RY = AS11_RY, w = 2 * (RX + 34), h = 2 * (RY + 22) + 42, ox = w / 2, oy = RY + 22 + 40;
  const cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, ox * PX, oy * PX);
  cv.ox = ox; cv.oy = oy; cv.bw = w; cv.bh = h;
  q.beginPath(); q.ellipse(0, 0, RX + 8, RY + 8, 0, 0, 6.2832);
  q.lineWidth = 16.5; q.strokeStyle = '#6a4318'; q.stroke();
  q.lineWidth = 13; q.strokeStyle = as11AltinGr(q, -RX, -RY - 14, RX, RY + 14); q.stroke();
  q.lineWidth = 1.3; q.strokeStyle = 'rgba(122,78,28,0.7)'; q.beginPath(); q.ellipse(0, 0, RX + 8, RY + 8, 0, 0, 6.2832); q.stroke();
  q.lineWidth = 2.4; q.strokeStyle = '#c39bff'; q.beginPath(); q.ellipse(0, 0, RX + 1.4, RY + 1.4, 0, 0, 6.2832); q.stroke();
  q.lineCap = 'round'; q.lineWidth = 3; q.strokeStyle = 'rgba(255,255,240,0.75)'; q.beginPath(); q.ellipse(0, 0, RX + 10, RY + 10, 0, Math.PI * 1.06, Math.PI * 1.46); q.stroke();
  q.lineWidth = 2; q.strokeStyle = 'rgba(255,240,200,0.35)'; q.beginPath(); q.ellipse(0, 0, RX + 6, RY + 6, 0, Math.PI * 0.1, Math.PI * 0.45); q.stroke();
  for (let i = 0; i < 34; i++) { const a = i / 34 * 6.2832, x = Math.cos(a) * (RX + 14.2), y = Math.sin(a) * (RY + 14.2); q.fillStyle = '#fff1c8'; q.beginPath(); q.arc(x, y, 1.5, 0, 6.2832); q.fill(); }
  for (const sx of [-1, 1]) as11Inci(q, sx * (RX + 8), 0, 4.6);
  as11Kivrim(q, -1, -6, RY + 14, 0.8); as11Kivrim(q, 1, 6, RY + 14, 0.8);
  as11KalpTas(q, 0, RY + 12, 7.5);
  as11Kivrim(q, -1, -10, -RY - 12, 1); as11Kivrim(q, 1, 10, -RY - 12, 1);
  if (sus === 'yarasa') as11YarasaSus(q, 0, -RY - 22, 1.05); else if (sus === 'ay') as11AySus(q, 0, -RY - 24, 1.2); else as11YildizSus(q, 0, -RY - 24, 1.15);
  return cv;
}
function as11BuyukCerceveCiz() {   // büyük kemerli altın ayna: konsol ayakları yerde, tepede gülümseyen hilal, omuzlarda yarasalar; köken zemin ortası
  const PX = 2.2, hw = AS11_BB[0], yb = AS11_BY0, yt = AS11_BY1, w = 2 * (hw + 44), top = yt - 78, h = -top + 6, ox = w / 2, oy = -top;
  const cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, ox * PX, oy * PX);
  cv.ox = ox; cv.oy = oy; cv.bw = w; cv.bh = h;
  // konsol: alt çubuk + kıvrık ayaklar
  for (const sx of [-1, 1]) {
    q.lineCap = 'round'; q.lineWidth = 9; q.strokeStyle = '#6a4318'; q.beginPath(); q.moveTo(sx * (hw - 8), yb + 10); q.bezierCurveTo(sx * (hw + 14), yb + 34, sx * (hw - 18), yb + 60, sx * (hw + 4), -4); q.stroke();
    q.lineWidth = 6; q.strokeStyle = as11AltinGr(q, sx * hw - 20, yb, sx * hw + 20, 0); q.stroke();
    q.fillStyle = '#6a4318'; q.beginPath(); q.ellipse(sx * (hw + 6), -3, 8, 4.5, 0, 0, 6.2832); q.fill(); q.fillStyle = '#ffd27a'; q.beginPath(); q.ellipse(sx * (hw + 6), -4, 6.5, 3.2, 0, 0, 6.2832); q.fill();
  }
  q.fillStyle = '#6a4318'; q.beginPath(); q.moveTo(-hw - 18, yb - 2); q.lineTo(hw + 18, yb - 2); q.lineTo(hw + 12, yb + 16); q.lineTo(-hw - 12, yb + 16); q.closePath(); q.fill();
  q.fillStyle = as11AltinGr(q, -hw, yb, hw, yb + 14); q.beginPath(); q.moveTo(-hw - 15, yb); q.lineTo(hw + 15, yb); q.lineTo(hw + 10, yb + 13); q.lineTo(-hw - 10, yb + 13); q.closePath(); q.fill();
  as11KalpTas(q, 0, yb + 16, 8);
  // kemer çerçeve
  as11Kemer(q, 0, yb + 2, yt - 9, hw + 9); q.lineJoin = 'round';
  q.lineWidth = 19; q.strokeStyle = '#6a4318'; q.stroke();
  q.lineWidth = 15; q.strokeStyle = as11AltinGr(q, -hw, yt, hw, yb); q.stroke();
  q.lineWidth = 2.6; q.strokeStyle = '#c39bff'; as11Kemer(q, 0, yb + 1, yt - 1.5, hw + 1.5); q.stroke();
  q.lineCap = 'round'; q.lineWidth = 3; q.strokeStyle = 'rgba(255,255,240,0.7)'; q.beginPath(); q.arc(0, yt + hw, hw + 12, Math.PI * 1.08, Math.PI * 1.42); q.stroke();
  q.beginPath(); q.moveTo(-hw - 12, yt + hw + 10); q.lineTo(-hw - 12, yb - 30); q.stroke();
  for (let i = 0; i <= 22; i++) { const a = Math.PI + i / 22 * Math.PI, x = Math.cos(a) * (hw + 15.5), y = yt + hw + Math.sin(a) * (hw + 15.5); q.fillStyle = '#fff1c8'; q.beginPath(); q.arc(x, y, 1.7, 0, 6.2832); q.fill(); }
  for (let i = 0; i < 9; i++) for (const sx of [-1, 1]) { const y = yt + hw + 20 + i * (yb - yt - hw - 30) / 8; q.fillStyle = '#fff1c8'; q.beginPath(); q.arc(sx * (hw + 15.5), y, 1.7, 0, 6.2832); q.fill(); }
  for (const sx of [-1, 1]) { as11Inci(q, sx * (hw + 9), (yt + yb) / 2 + 40, 5.5); as11Inci(q, sx * (hw + 9), (yt + yb) / 2 + 58, 4); }
  // tepe: kıvrımlar + gülümseyen hilal + yıldızcıklar
  as11Kivrim(q, -1, -14, yt - 16, 1.3); as11Kivrim(q, 1, 14, yt - 16, 1.3);
  as11Kivrim(q, -1, -46, yt - 4, 1); as11Kivrim(q, 1, 46, yt - 4, 1);
  as11AySus(q, 0, yt - 40, 2.1);
  q.fillStyle = '#ffe7a8'; as11Yildiz(q, -34, yt - 50, 6, 2.6); q.fill(); as11Yildiz(q, 36, yt - 58, 5, 2.2); q.fill();
  // omuzlarda iki tombul yarasa
  as11YarasaSus(q, -hw - 8, yt + hw - 6, 1.1); as11YarasaSus(q, hw + 8, yt + hw - 6, 1.1);
  return cv;
}
function as11TacCiz() {   // Vela'nın yıldızlı tacı + çilek pembesi kurdelesi; köken: taç bandının ortası
  const PX = 4, w = 60, h = 48, ox = 26, oy = 28, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, ox * PX, oy * PX);
  cv.ox = ox; cv.oy = oy; cv.bw = w; cv.bh = h;
  // kurdele (arkada, sağda): iki ilmek + iki uç
  q.fillStyle = '#e8507a'; q.beginPath(); q.moveTo(15, 2); q.quadraticCurveTo(12, 10, 10, 16); q.lineTo(14, 14.5); q.lineTo(15.5, 17); q.quadraticCurveTo(17, 9, 16, 2); q.fill();
  q.beginPath(); q.moveTo(16, 2); q.quadraticCurveTo(21, 9, 25, 14); q.lineTo(26, 10.5); q.lineTo(28.5, 11.5); q.quadraticCurveTo(23, 6, 17, 1); q.fill();
  for (const [x, y, r] of [[10, -2, 0.5], [22, -1, -0.5]]) { q.fillStyle = '#ff7a9a'; q.beginPath(); q.ellipse(x, y, 7, 4.6, r, 0, 6.2832); q.fill(); q.strokeStyle = '#d23a64'; q.lineWidth = 0.9; q.stroke(); q.fillStyle = 'rgba(255,220,232,0.7)'; q.beginPath(); q.ellipse(x - 1, y - 1.5, 3, 1.4, r, 0, 6.2832); q.fill(); }
  q.fillStyle = '#ff4f7a'; q.beginPath(); q.arc(16, 0.5, 2.8, 0, 6.2832); q.fill();
  // taç
  q.beginPath(); q.moveTo(-14, 2); q.quadraticCurveTo(0, 6, 14, 2); q.lineTo(13, -3); q.lineTo(12, -7); q.lineTo(9, -3); q.lineTo(6, -10); q.lineTo(3, -4); q.lineTo(0, -6);
  q.lineTo(-3, -4); q.lineTo(-6, -10); q.lineTo(-9, -3); q.lineTo(-12, -7); q.lineTo(-13, -3); q.closePath();
  q.fillStyle = as11AltinGr(q, -14, -10, 14, 4); q.fill(); q.strokeStyle = '#a0702a'; q.lineWidth = 0.9; q.lineJoin = 'round'; q.stroke();
  for (const [x, y, r] of [[-12, -7, 1.6], [12, -7, 1.6], [-6, -10, 1.8], [6, -10, 1.8]]) as11Inci(q, x, y, r);
  for (const [x, c] of [[-7, '#ff7a9a'], [0, '#c39bff'], [7, '#ff7a9a']]) { q.fillStyle = c; q.beginPath(); q.arc(x, 1.6, 1.4, 0, 6.2832); q.fill(); }
  q.fillStyle = as11AltinGr(q, -7, -19, 7, -5); q.strokeStyle = '#a0702a'; q.lineWidth = 0.8; as11Yildiz(q, 0, -12, 7, 3.2); q.fill(); q.stroke();
  q.fillStyle = '#ffffff'; q.beginPath(); q.arc(-1.5, -13.5, 1.2, 0, 6.2832); q.fill();
  return cv;
}
function as11SapkaCiz() {   // kocaman çizgili silindir şapka; köken: siperliğin ortası
  const PX = 3, w = 66, h = 86, ox = 33, oy = 80, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, ox * PX, oy * PX);
  cv.ox = ox; cv.oy = oy; cv.bw = w; cv.bh = h;
  const govde = () => { q.beginPath(); q.moveTo(-17, -4); q.bezierCurveTo(-19, -30, -24, -55, -21, -70); q.quadraticCurveTo(0, -75, 21, -70); q.bezierCurveTo(24, -55, 19, -30, 17, -4); q.closePath(); };
  govde(); q.lineWidth = 3; q.strokeStyle = '#3a2c74'; q.stroke();
  const gr = q.createLinearGradient(-22, 0, 22, 0); gr.addColorStop(0, '#8f6cf0'); gr.addColorStop(0.4, '#c9a8ff'); gr.addColorStop(1, '#6a4fc0'); q.fillStyle = gr; q.fill();
  q.save(); govde(); q.clip();
  q.fillStyle = 'rgba(255,122,154,0.85)'; for (let i = -4; i < 6; i++) { q.save(); q.translate(i * 14, -40); q.rotate(0.35); q.fillRect(-3.5, -60, 7, 120); q.restore(); }
  q.fillStyle = 'rgba(255,255,255,0.25)'; q.fillRect(-15, -72, 5, 70);
  q.fillStyle = 'rgba(30,20,70,0.18)'; q.fillRect(10, -72, 14, 70);
  q.fillStyle = as11AltinGr(q, -20, -18, 20, -10); q.fillRect(-24, -18, 48, 8);
  q.restore();
  q.fillStyle = as11AltinGr(q, -5, -19, 5, -8); q.strokeStyle = '#a0702a'; q.lineWidth = 0.9; as11Yildiz(q, 0, -14, 5.5, 2.4); q.fill(); q.stroke();
  q.fillStyle = '#b49aff'; q.beginPath(); q.ellipse(0, -70, 21, 5, 0, 0, 6.2832); q.fill(); q.strokeStyle = '#3a2c74'; q.lineWidth = 1.6; q.stroke();
  q.fillStyle = '#3a2c74'; q.beginPath(); q.ellipse(0, -3, 31, 7.5, 0, 0, 6.2832); q.fill();
  q.fillStyle = '#5b47a8'; q.beginPath(); q.ellipse(0, -4, 29, 6, 0, 0, 6.2832); q.fill();
  q.strokeStyle = 'rgba(200,180,255,0.6)'; q.lineWidth = 1.2; q.beginPath(); q.ellipse(0, -4, 27, 5, 0, Math.PI * 1.1, Math.PI * 1.9); q.stroke();
  return cv;
}
function as11KulakCiz() {   // gümüş kedi kulağı (pembe içli); köken alt orta
  const PX = 4, w = 28, h = 30, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 14 * PX, 28 * PX); cv.ox = 14; cv.oy = 28; cv.bw = w; cv.bh = h;
  q.beginPath(); q.moveTo(-11, 0); q.quadraticCurveTo(-10, -18, -2, -25); q.quadraticCurveTo(2, -27, 4, -22); q.quadraticCurveTo(10, -10, 11, 0); q.closePath();
  q.fillStyle = '#dfe2f4'; q.fill(); q.strokeStyle = '#8f95b8'; q.lineWidth = 1.4; q.stroke();
  q.beginPath(); q.moveTo(-6, -1); q.quadraticCurveTo(-5, -14, -1, -19); q.quadraticCurveTo(5, -10, 6, -1); q.closePath(); q.fillStyle = '#ffb3d1'; q.fill();
  return cv;
}
const AS11_YUZ = {   // yakın çekim vampir yüzleri (cam merkezine göre)
  dede: { cy: 8, rx: 41, ry: 37, sac: ['#f2f3fb', '#aab1cf'], pel: ['#3a2c74', '#1d1840'], ast: '#ff4f7a', goz: [[-15, 4], [15, 4]], gr: 6.2, agiz: [0, 22, 9], burun: [0, 13], kulak: [[-21, -22], [21, -22]] },
  bebek: { cy: 8, rx: 46, ry: 43, sac: ['#6a56a8', '#2a2158'], pel: ['#4b3a8c', '#2a2158'], ast: '#ffb3d1', goz: [[-18, 6], [18, 6]], gr: 11.5, agiz: [0, 25, 8], burun: [0, 16] },
  nine: { cy: 12, rx: 39, ry: 37, sac: ['#f4eefb', '#bcaedb'], pel: ['#3a2c74', '#1d1840'], ast: '#ffb3d1', goz: [[-14, 8], [14, 8]], gr: 6.6, agiz: [0, 25, 9], burun: [0, 17], topuz: [0, -26] }
};
function as11YuzCiz(tip) {   // pelerin yakası, kulaklar, yüz, yanaklar, geriye taranmış saç; gözler/ağız canlı çizilir
  const Y = AS11_YUZ[tip], PX = AS11_PX, w = AS11_RX * 2 + 8, h = AS11_RY * 2 + 8, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, w / 2 * PX, h / 2 * PX); cv.bw = w; cv.bh = h;
  const cy = Y.cy, rx = Y.rx, ry = Y.ry;
  q.beginPath(); q.ellipse(0, 0, AS11_RX + 3, AS11_RY + 3, 0, 0, 6.2832); q.clip();
  // pelerin omuzları
  let gr = q.createLinearGradient(0, cy + ry * 0.6, 0, AS11_RY); gr.addColorStop(0, Y.pel[0]); gr.addColorStop(1, Y.pel[1]);
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, cy + ry + 36, 74, 42, 0, 0, 6.2832); q.fill();
  // yüksek pelerin yakası (iki yanda, kenarları yuvarlak)
  for (const sx of [-1, 1]) {
    q.fillStyle = Y.pel[0]; q.beginPath(); q.moveTo(sx * 10, cy + ry + 10); q.quadraticCurveTo(sx * (rx + 32), cy + ry * 0.75, sx * (rx + 22), cy - ry * 0.5); q.quadraticCurveTo(sx * (rx + 14), cy - ry * 0.62, sx * (rx + 8), cy - ry * 0.3); q.quadraticCurveTo(sx * (rx * 0.75), cy + ry * 0.4, sx * (rx * 0.5), cy + ry * 0.85); q.closePath(); q.fill();
    q.fillStyle = Y.ast; q.beginPath(); q.moveTo(sx * 14, cy + ry + 6); q.quadraticCurveTo(sx * (rx + 24), cy + ry * 0.7, sx * (rx + 17), cy - ry * 0.36); q.quadraticCurveTo(sx * (rx + 10), cy - ry * 0.4, sx * (rx + 5), cy - ry * 0.18); q.quadraticCurveTo(sx * (rx * 0.75), cy + ry * 0.45, sx * (rx * 0.52), cy + ry * 0.86); q.closePath(); q.fill();
  }
  // gömlek yakası
  q.fillStyle = '#fbf6ff'; q.beginPath(); q.moveTo(-18, cy + ry - 8); q.lineTo(18, cy + ry - 8); q.lineTo(0, cy + ry + 22); q.closePath(); q.fill();
  // kulaklar (hafif uçlu ama yuvarlak)
  for (const sx of [-1, 1]) {
    q.save(); q.translate(sx * rx * 0.95, cy + 2); q.rotate(sx * 0.18);
    q.fillStyle = '#f9cfc2'; q.beginPath(); q.moveTo(0, 11); q.quadraticCurveTo(sx * 14, 10, sx * 13, -14); q.quadraticCurveTo(sx * 4, -9, 0, -7); q.closePath(); q.fill();
    q.strokeStyle = '#d99a8e'; q.lineWidth = 1.3; q.stroke();
    q.fillStyle = 'rgba(255,140,170,0.45)'; q.beginPath(); q.moveTo(sx * 2, 6); q.quadraticCurveTo(sx * 9, 5, sx * 9, -7); q.quadraticCurveTo(sx * 4, -4, sx * 2, -3); q.closePath(); q.fill();
    q.restore();
  }
  // yüz
  gr = q.createRadialGradient(-rx * 0.25, cy - ry * 0.35, 4, 0, cy, Math.max(rx, ry) * 1.05); gr.addColorStop(0, '#fff4ee'); gr.addColorStop(0.6, '#ffe3d8'); gr.addColorStop(1, '#f6c6b8');
  q.fillStyle = gr; q.beginPath(); q.ellipse(0, cy, rx, ry, 0, 0, 6.2832); q.fill(); q.lineWidth = 1.6; q.strokeStyle = '#d99a8e'; q.stroke();
  for (const sx of [-1, 1]) { const x = sx * rx * 0.58, y = cy + ry * 0.32, yg = q.createRadialGradient(x, y, 0, x, y, rx * 0.3); yg.addColorStop(0, 'rgba(255,118,160,0.6)'); yg.addColorStop(1, 'rgba(255,118,160,0)'); q.fillStyle = yg; q.fillRect(x - rx * 0.3, y - rx * 0.3, rx * 0.6, rx * 0.6); }
  // saç: geriye taranmış, alında yumuşak bir dul tepesi
  gr = q.createLinearGradient(0, cy - ry * 1.25, 0, cy); gr.addColorStop(0, Y.sac[0]); gr.addColorStop(1, Y.sac[1]);
  q.fillStyle = gr; q.beginPath();
  if (tip === 'bebek') {
    q.moveTo(-rx * 0.86, cy - ry * 0.32); q.bezierCurveTo(-rx * 0.95, cy - ry * 1.18, rx * 0.95, cy - ry * 1.18, rx * 0.86, cy - ry * 0.32);
    q.quadraticCurveTo(rx * 0.45, cy - ry * 0.72, 0, cy - ry * 0.5); q.quadraticCurveTo(-rx * 0.45, cy - ry * 0.72, -rx * 0.86, cy - ry * 0.32);
  } else {
    q.moveTo(-rx * 0.97, cy - ry * 0.12); q.bezierCurveTo(-rx * 1.1, cy - ry * 1.3, rx * 1.1, cy - ry * 1.3, rx * 0.97, cy - ry * 0.12);
    q.quadraticCurveTo(rx * 0.9, cy - ry * 0.42, rx * 0.55, cy - ry * 0.5); q.quadraticCurveTo(rx * 0.2, cy - ry * 0.62, 0, cy - ry * 0.3);
    q.quadraticCurveTo(-rx * 0.2, cy - ry * 0.62, -rx * 0.55, cy - ry * 0.5); q.quadraticCurveTo(-rx * 0.9, cy - ry * 0.42, -rx * 0.97, cy - ry * 0.12);
  }
  q.closePath(); q.fill(); q.lineWidth = 1.4; q.strokeStyle = Y.sac[1]; q.stroke();
  q.strokeStyle = tip === 'bebek' ? 'rgba(200,180,255,0.45)' : 'rgba(255,255,255,0.6)'; q.lineWidth = 1.3; q.lineCap = 'round';
  for (const [x0, x1] of [[-0.35, -0.8], [-0.12, -0.42], [0.12, 0.42], [0.35, 0.8]]) { q.beginPath(); q.moveTo(rx * x0 * 0.7, cy - ry * 0.6); q.quadraticCurveTo(rx * x0, cy - ry * 1.02, rx * x1, cy - ry * 0.95); q.stroke(); }
  if (tip === 'bebek') {   // tepede kıvrık tek perçem
    q.strokeStyle = Y.sac[1]; q.lineWidth = 4.5; q.beginPath(); q.moveTo(-2, cy - ry * 0.98); q.bezierCurveTo(-12, cy - ry * 1.38, 14, cy - ry * 1.5, 9, cy - ry * 1.18); q.quadraticCurveTo(4, cy - ry * 1.06, 2, cy - ry * 1.2); q.stroke();
    q.fillStyle = '#ffd27a'; as11Yildiz(q, 0, cy + ry + 6, 5, 2.2); q.fill();   // yakada minik yıldız toka
  }
  if (tip === 'dede') {   // gümüş favoriler + gözlük + çilek kırmızısı papyon
    for (const sx of [-1, 1]) { q.fillStyle = Y.sac[0]; q.beginPath(); q.moveTo(sx * rx * 0.97, cy - ry * 0.18); q.quadraticCurveTo(sx * rx * 1.02, cy + ry * 0.3, sx * rx * 0.78, cy + ry * 0.42); q.quadraticCurveTo(sx * rx * 0.82, cy + ry * 0.05, sx * rx * 0.8, cy - ry * 0.28); q.closePath(); q.fill(); q.strokeStyle = Y.sac[1]; q.lineWidth = 1; q.stroke(); }
    q.strokeStyle = '#d8a440'; q.lineWidth = 2.4; for (const [x, y] of Y.goz) { q.fillStyle = 'rgba(255,255,255,0.22)'; q.beginPath(); q.arc(x, y, 10.5, 0, 6.2832); q.fill(); q.stroke(); }
    q.beginPath(); q.moveTo(-5, Y.goz[0][1] - 1); q.quadraticCurveTo(0, Y.goz[0][1] - 4, 5, Y.goz[0][1] - 1); q.stroke();
    q.strokeStyle = 'rgba(255,255,255,0.7)'; q.lineWidth = 1.4; for (const [x, y] of Y.goz) { q.beginPath(); q.arc(x, y, 8, Math.PI * 1.1, Math.PI * 1.4); q.stroke(); }
    const by = cy + ry + 4; q.fillStyle = '#ff4f7a'; q.strokeStyle = '#c42a56'; q.lineWidth = 1;
    for (const sx of [-1, 1]) { q.beginPath(); q.moveTo(0, by); q.quadraticCurveTo(sx * 9, by - 9, sx * 13, by - 4); q.quadraticCurveTo(sx * 14, by + 4, sx * 12, by + 6); q.quadraticCurveTo(sx * 8, by + 8, 0, by); q.fill(); q.stroke(); }
    q.beginPath(); q.arc(0, by, 3.4, 0, 6.2832); q.fill(); q.stroke();
  } else {
    q.fillStyle = '#f2a8a0'; q.beginPath(); q.ellipse(Y.burun[0], Y.burun[1] + cy - 8, 3.4, 2.4, 0, 0, 6.2832); q.fill();
    q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.arc(Y.burun[0] - 1, Y.burun[1] + cy - 9, 0.9, 0, 6.2832); q.fill();
  }
  if (tip === 'nine') for (let i = 0; i < 11; i++) { const a = Math.PI * (0.12 + i / 10 * 0.76); as11Inci(q, Math.cos(a) * 24, cy + ry - 4 + Math.sin(a) * 12, 2.6); }   // inci kolye
  return cv;
}
function as11CilekCiz() {   // Nine'nin topuzu → kocaman çilek (yeşil yaprakları başına tutturulmuş, ucu yukarıda); köken alt orta
  const PX = 3, w = 60, h = 64, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 30 * PX, 60 * PX); cv.ox = 30; cv.oy = 60; cv.bw = w; cv.bh = h;
  q.beginPath(); q.moveTo(0, -56); q.bezierCurveTo(17, -50, 27, -28, 23, -12); q.quadraticCurveTo(14, -3, 0, -3); q.quadraticCurveTo(-14, -3, -23, -12); q.bezierCurveTo(-27, -28, -17, -50, 0, -56); q.closePath();
  const gr = q.createRadialGradient(-7, -36, 2, 0, -26, 30); gr.addColorStop(0, '#ffb0c4'); gr.addColorStop(0.45, '#ff4f7a'); gr.addColorStop(1, '#cf2f5c');
  q.fillStyle = gr; q.fill(); q.strokeStyle = '#a82450'; q.lineWidth = 1.4; q.stroke();
  q.fillStyle = '#ffe7a8'; for (let j = 0; j < 5; j++) for (let i = -2; i <= 2; i++) { const x = i * 7.5 + (j % 2) * 3.7, y = -46 + j * 8.5; if (Math.abs(x) > 19 - Math.abs(y + 26) * 0.25) continue; q.beginPath(); q.ellipse(x, y, 1.1, 1.8, 0, 0, 6.2832); q.fill(); }
  q.fillStyle = 'rgba(255,255,255,0.7)'; q.beginPath(); q.ellipse(-9, -38, 3, 6, -0.4, 0, 6.2832); q.fill();
  for (let i = 0; i < 5; i++) { const a = Math.PI * (0.05 + i * 0.225); q.save(); q.translate(0, -4); q.rotate(a - Math.PI / 2); q.fillStyle = i % 2 ? '#5fbf6a' : '#7fd88a'; q.beginPath(); q.ellipse(0, 9, 4.2, 9.5, 0, 0, 6.2832); q.fill(); q.strokeStyle = '#3f8a4a'; q.lineWidth = 0.9; q.stroke(); q.restore(); }
  return cv;
}
function as11TopuzCiz() {   // Nine'nin gümüş topuzu (incili tokalı); köken alt orta
  const PX = 3, w = 40, h = 40, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 20 * PX, 36 * PX); cv.ox = 20; cv.oy = 36; cv.bw = w; cv.bh = h;
  const gr = q.createRadialGradient(-5, -22, 2, 0, -16, 18); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.5, '#e7def5'); gr.addColorStop(1, '#ad9fd0');
  q.fillStyle = gr; q.beginPath(); q.arc(0, -16, 15, 0, 6.2832); q.fill(); q.strokeStyle = '#9a8cc4'; q.lineWidth = 1.2; q.stroke();
  q.strokeStyle = 'rgba(150,130,200,0.6)'; q.lineWidth = 1.3; q.beginPath(); q.arc(0, -16, 9, 0.4, 4.2); q.stroke(); q.beginPath(); q.arc(1, -15, 4.5, 3, 6.6); q.stroke();
  as11Inci(q, 11, -25, 3); as11Inci(q, 14, -21, 2.2);
  return cv;
}
function as11AyCiz() {   // inci sarısı Ay (yüzü canlı çizilir); köken merkez, yarıçap 42
  const PX = 2.5, w = 112, cv = as11Cv(w * PX, w * PX), q = cv.getContext('2d'); q.setTransform(PX, 0, 0, PX, 56 * PX, 56 * PX); cv.bw = w;
  let gr = q.createRadialGradient(0, 0, 36, 0, 0, 56); gr.addColorStop(0, 'rgba(255,244,214,0.5)'); gr.addColorStop(1, 'rgba(255,244,214,0)'); q.fillStyle = gr; q.fillRect(-56, -56, 112, 112);
  gr = q.createRadialGradient(-13, -15, 4, 0, 0, 44); gr.addColorStop(0, '#fffef8'); gr.addColorStop(0.55, '#fff4d6'); gr.addColorStop(1, '#ffdf9a');
  q.fillStyle = gr; q.beginPath(); q.arc(0, 0, 42, 0, 6.2832); q.fill(); q.strokeStyle = 'rgba(230,180,100,0.6)'; q.lineWidth = 1.4; q.stroke();
  q.fillStyle = 'rgba(225,190,130,0.22)'; for (const [x, y, r] of [[-26, -18, 6], [24, -24, 4.5], [30, 14, 5], [-30, 18, 4], [-8, -32, 3.5], [10, 33, 3.5]]) { q.beginPath(); q.arc(x, y, r, 0, 6.2832); q.fill(); }
  q.strokeStyle = 'rgba(255,255,255,0.8)'; q.lineWidth = 2.4; q.lineCap = 'round'; q.beginPath(); q.arc(0, 0, 38, Math.PI * 1.08, Math.PI * 1.42); q.stroke();
  return cv;
}
function as11GeceCiz() {   // aynadaki gece göğü (oval cam boyu): lacivertten lilaya, yıldızlar, altta pembe-lila bulutlar
  const PX = AS11_PX, RX = AS11_RX, RY = AS11_RY, w = RX * 2 + 4, h = RY * 2 + 4, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, w / 2 * PX, h / 2 * PX); cv.bw = w; cv.bh = h;
  q.beginPath(); q.ellipse(0, 0, RX + 1, RY + 1, 0, 0, 6.2832); q.clip();
  const gr = q.createLinearGradient(0, -RY, 0, RY); gr.addColorStop(0, '#1d1840'); gr.addColorStop(0.55, '#3a2c74'); gr.addColorStop(1, '#6a52a8'); q.fillStyle = gr; q.fillRect(-w, -h, 2 * w, 2 * h);
  const r = rng(1123);
  for (let i = 0; i < 46; i++) { q.fillStyle = `rgba(255,255,255,${(0.35 + r() * 0.6).toFixed(2)})`; q.beginPath(); q.arc((r() - 0.5) * 2 * RX, (r() - 0.6) * 2 * RY, 0.5 + r() * 1.1, 0, 6.2832); q.fill(); }
  for (const [x, y, c] of [[-30, 60, '#c39bff'], [0, 70, '#ffb3d1'], [32, 62, '#d9c8ff'], [-48, 70, '#ffb3d1'], [50, 72, '#c39bff']]) { q.fillStyle = c; q.globalAlpha = 0.5; q.beginPath(); q.ellipse(x, y, 26, 11, 0, 0, 6.2832); q.fill(); }
  q.globalAlpha = 1; return cv;
}
// buğu: her aynada küçük bir tuval (silinen yer şeffaf); sis rengi, damlacıklar, akan izler
function as11SisYap(m) {
  const F = AS11_FPX, RX = AS11_RX, RY = AS11_RY, w = Math.ceil((RX * 2 + 8) * F), h = Math.ceil((RY * 2 + 8) * F), cv = as11Cv(w, h), q = cv.getContext('2d'), r = rng(4400 + m.i * 97);
  q.setTransform(F, 0, 0, F, (RX + 4) * F, (RY + 4) * F);
  q.save(); q.beginPath(); q.ellipse(0, 0, RX + 1.5, RY + 1.5, 0, 0, 6.2832); q.clip();
  const gr = q.createRadialGradient(-18, -28, 6, 0, 0, RY * 1.1); gr.addColorStop(0, 'rgba(246,242,255,0.96)'); gr.addColorStop(0.6, 'rgba(226,218,246,0.95)'); gr.addColorStop(1, 'rgba(204,192,236,0.95)');
  q.fillStyle = gr; q.fillRect(-RX - 4, -RY - 4, RX * 2 + 8, RY * 2 + 8);
  for (let i = 0; i < 26; i++) { const x = (r() - 0.5) * 2 * RX, y = (r() - 0.5) * 2 * RY, rr = 8 + r() * 18; q.fillStyle = i % 2 ? 'rgba(255,255,255,0.16)' : 'rgba(190,176,230,0.14)'; q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill(); }
  for (let i = 0; i < 70; i++) { const x = (r() - 0.5) * 2 * RX, y = (r() - 0.5) * 2 * RY, rr = 0.6 + r() * 1.8; q.fillStyle = 'rgba(150,135,200,0.3)'; q.beginPath(); q.arc(x + 0.4, y + 0.5, rr, 0, 6.2832); q.fill(); q.fillStyle = 'rgba(255,255,255,0.65)'; q.beginPath(); q.arc(x, y, rr * 0.8, 0, 6.2832); q.fill(); }
  q.globalCompositeOperation = 'destination-out'; q.lineCap = 'round';   // akan damla izleri (incecik, yarı şeffaf)
  for (let i = 0; i < 5; i++) { const x = (r() - 0.5) * 1.5 * RX, y0 = -RY * (0.2 + r() * 0.6), L = 18 + r() * 40; q.strokeStyle = 'rgba(0,0,0,0.38)'; q.lineWidth = 1.6 + r(); q.beginPath(); q.moveTo(x, y0); q.quadraticCurveTo(x + (r() - 0.5) * 4, y0 + L * 0.5, x + (r() - 0.5) * 3, y0 + L); q.stroke(); }
  q.globalCompositeOperation = 'source-over'; q.restore();
  q.setTransform(1, 0, 0, 1, 0, 0);
  m.sis = cv; m.sq = q; m.grid.fill(0); m.sil = 0;
}

// ── parçacıklar (sabit havuz) ──
const AS11_TZ = []; for (let i = 0; i < 240; i++) AS11_TZ.push({ a: false, tip: 0, x: 0, y: 0, vx: 0, vy: 0, t: 0, max: 1, s: 1, col: '#fff', r: 0 });
function as11Toz(tip, x, y, vx, vy, max, s, col) {
  for (const p of AS11_TZ) if (!p.a) { p.a = true; p.tip = tip; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.t = 0; p.max = max; p.s = s; p.col = col || '#ffffff'; p.r = Math.random() * 6.28; return p; }
  return null;
}
function as11IsikSac(x, y, n, hiz, cols) { cols = cols || AS11_ISIK; for (let i = 0; i < n; i++) { const a = Math.random() * 6.2832, v = hiz * (0.3 + Math.random() * 0.8); as11Toz(i % 4 === 0 ? 2 : 0, x, y, Math.cos(a) * v, Math.sin(a) * v - 20, 0.7 + Math.random() * 0.7, i % 4 === 0 ? 7 + Math.random() * 5 : 6 + Math.random() * 7, cols[i % cols.length]); } }
function as11Halka(x, y, r, col) { as11Toz(3, x, y, 0, 0, 0.5, r, col); }
function as11TozAdim(dt) {
  for (const p of AS11_IZ) if (p.a) { p.t += dt; if (p.t >= 1.1) p.a = false; }
  AS11_EK = Math.max(0, AS11_EK - dt * 2.2);
  for (const p of AS11_TZ) {
    if (!p.a) continue; p.t += dt; if (p.t >= p.max) { p.a = false; continue; }
    if (p.tip === 0 || p.tip === 2 || p.tip === 6) { p.vx *= Math.exp(-dt * 2.4); p.vy = p.vy * Math.exp(-dt * 2.4) - 16 * dt; p.r += dt * 2; }
    else if (p.tip === 5) { p.vy += 260 * dt; p.vx *= Math.exp(-dt * 0.6); p.r += dt * 4; }   // fırlayan altın yıldız
    else if (p.tip === 4) { p.vy = -38; p.vx = Math.sin(p.t * 4 + p.r) * 18; }
    p.x += p.vx * dt; p.y += p.vy * dt;
  }
}
function as11TozCiz(c) {
  if (!AS11S.hazir) return;
  const a0 = c.globalAlpha;
  for (const p of AS11_TZ) {
    if (!p.a) continue; const u = p.t / p.max, f = 1 - u; c.globalAlpha = a0;
    if (p.tip === 0) { as11Glow(c, p.col, p.x, p.y, p.s * (0.6 + f * 0.6), p.s * (0.6 + f * 0.6), f * 0.9); c.globalAlpha = a0 * f; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(p.x, p.y, 1.3, 0, 6.2832); c.fill(); }
    else if (p.tip === 2) { const sc = p.s * (0.5 + 0.5 * Math.sin(Math.min(1, u * 1.6) * Math.PI)); as11Glow(c, p.col, p.x, p.y, sc * 1.2, sc * 1.2, f * 0.6); const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(p.r * 0.5); c.globalAlpha = a0 * Math.min(1, f * 1.5); c.drawImage(AS11S.pirilti, -sc, -sc, sc * 2, sc * 2); c.setTransform(M); }
    else if (p.tip === 3) { c.globalAlpha = a0 * f * 0.85; c.strokeStyle = p.col; c.lineWidth = 3 * f + 0.5; c.beginPath(); c.arc(p.x, p.y, p.s * (1 + u * 0.6), 0, 6.2832); c.stroke(); }
    else if (p.tip === 4) { c.globalAlpha = a0 * Math.min(1, f * 2) * Math.min(1, u * 6); c.fillStyle = p.col; as11Kalp(c, p.x, p.y, 5 + u * 2); c.fill(); }
    else if (p.tip === 5) { const sc = p.s * (0.7 + 0.3 * Math.sin(Math.min(1, u * 2) * Math.PI)); const M = c.getTransform(); c.translate(p.x, p.y); c.rotate(p.r); c.globalAlpha = a0 * Math.min(1, f * 2); c.drawImage(AS11S.yildiz, -sc, -sc, sc * 2, sc * 2); c.setTransform(M); }
    else if (p.tip === 6) { as11Glow(c, p.col, p.x, p.y, p.s * (0.8 + u * 1.2), p.s * (0.8 + u * 1.2), f * 0.5); }
  }
  c.globalAlpha = a0;
}

// ── yerleşim ve durum ──
function as11Yerlestir(o, dt) {
  const k = o.as, asp = W / Math.max(H, 1), hd = clamp((1.2 - asp) / 0.5, 0, 1);
  if (k.lay < 0 || !(dt > 0)) { if (k.lay < 0) k.lay = hd; }
  else { k.lay += (hd - k.lay) * Math.min(1, dt * 3); if (Math.abs(k.lay - hd) < 0.002) k.lay = hd; }
  const L = k.lay;
  for (const m of k.ay) { const a = AS11_YAT[m.i], b = AS11_DIK[m.i]; m.x = o.x + lerp(a[0], b[0], L); m.y = o.y + lerp(a[1], b[1], L); }
  k.bw = lerp(AS11_BB[0], AS11_BB[1], L);
}
function as11Kutu(o) {   // salonun tamamı (aynalar + Feza + Vela): kamera dikkat kutusu
  const k = o.as, L = k.lay < 0 ? 0 : k.lay, xw = lerp(326, 204, L) + AS11_RX - 8, yt = lerp(-400, -582, L) - AS11_RY - 38;
  return { x0: o.x - xw, y0: o.y + yt, x1: o.x + xw, y1: o.y + 12 };   // dış çerçeveler kenar payına taşar (kadraj sıkı: Feza büyük)
}
function as11Faz(o, f) { const k = o.as; k.faz = f; k.fT = 0; }
function as11VelaPoz(k, ad, sure) { k.vp = ad; k.vpT = sure; }
function as11Siradaki(k) { for (const i of AS11_SIRA) { const m = k.ay[i]; if (!m.bulundu) return i; } return -1; }
function as11Hedef(k) {   // ipucu/yardım hedefi: klavyeyle seçilen ya da sıradaki
  if (SALON11.klavye && k.ay[k.secK] && !k.ay[k.secK].bulundu) return k.secK;
  return as11Siradaki(k);
}
function as11Aktiflestir(o) {
  const k = o.as; if (o.done || k.aktif || P.ucus || DURUM !== 'oyun') return false;
  if (P.fade > 0 || P.kilit > 0.05 || (typeof D !== 'undefined' && D.mode === 'tasi') || P.y < o.y - 230) return false;
  as11Isit(99); as11Fotolar(o);
  const e = k.entry; e.x = o.x + AS11_FX; e.y = o.y; e.safeX = e.x; e.safeY = o.y; e.f = P.f;
  k.gx0 = P.x; k.gy0 = P.y; const d = Math.hypot(P.x - e.x, P.y - e.y); k.gT = d < 3 ? 1 : 0; k.gSure = clamp(d / 380, 0.35, 0.9);
  k.aktif = true; k.idle = 0; k.helpOn = false; k.helpT = 0; SALON11.o = o; as11GirdiBirak();
  P.ucus = o; P.vx = P.vy = P.buf = P.kilit = P.fade = 0;
  if (typeof D !== 'undefined') { k.pr.x = D.x; k.pr.y = D.y; k.pr.f = D.face || 1; }
  if (!k.basladi) { k.basladi = true; as11Faz(o, 'saka'); OLAY.emit('salonBasla', { o }); }
  else as11Faz(o, k.n >= AS11_N ? 'son' : 'oyun');   // yarıda kalmıştı: kaldığı yerden
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('salon', 1.5, k.kameraFn, 1, 0.42);
  return true;
}
function as11Birak(o, tamam) {   // güvenli dönüş: Feza girişteki yerde, yüzü ileri
  const k = o.as, e = k.entry; if (!k.aktif) return;
  if (!tamam && (k.faz === 'son' || k.faz === 'don')) tamam = true;
  if (P.ucus === o) {
    P.ucus = null; P.x = P.rx = e.x; P.y = P.ry = e.y; P.safeX = e.safeX; P.safeY = e.safeY; P.f = tamam ? 1 : e.f;
    P.vx = P.vy = P.buf = P.fade = P.kilit = P.air = 0; P.ground = true; P.dj = true; P.bounce = false;
    if (typeof D !== 'undefined') { D.x = k.pr.x; D.y = k.pr.y; D.vx = D.vy = 0; if ('pvx' in D) D.pvx = D.pvy = 0; }
  }
  k.aktif = false; k.helpOn = false; as11GirdiBirak();
  for (const m of k.ay) if (m.oto && m.oto.kim === 'piril') m.oto = null;
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('salon', 0.1, k.kameraFn, 1, 0.42);
  if (tamam) as11Tamam(o);
  else k.faz = 'bekle';
}
function as11Tamam(o) {   // bitti (bir kez): bayraklar + olay
  if (o.done) return;
  const k = o.as; o.done = true; o.tk.bitti = true; k.faz = 'bitti'; k.son.t = 0;
  for (const m of k.ay) if (!m.bulundu) { m.bulundu = true; m.at = AS11_ANIM + 1; m.fogA = 0; }
  if (typeof V11 !== 'undefined' && V11) V11.salon = true;
  OLAY.emit('salonBitti', { o });
}
function as11GirdiBirak() { const id = SALON11.ptr; SALON11.ptr = -1; if (id >= 0 && typeof cv.releasePointerCapture === 'function') { try { cv.releasePointerCapture(id); } catch (_) {} } if (typeof omHepsiniBirak === 'function') omHepsiniBirak(); }
function as11Kullanici(o) { const k = o.as; k.idle = 0; if (k.helpOn) { k.helpOn = false; k.helpT = 0; for (const m of k.ay) if (m.oto && m.oto.kim === 'piril') m.oto = null; } }
// Feza ve Pırıl'ın "fotoğrafı": küçük aynalardaki komik yansımalar için bir kez çekilir (pelerin rengi seçildikten sonra)
function as11Foto(fn, w, h, ox, oy) {
  const PX = AS11_PX, cv = as11Cv(w * PX, h * PX), q = cv.getContext('2d');
  q.setTransform(PX, 0, 0, PX, ox * PX, oy * PX);
  try { fn(q); } catch (e) { return null; }
  let x0 = 0, y0 = 0, x1 = w, y1 = h, ux = ox;
  try {   // görünür piksellerin kutusu (sığdırmak ve şapkayı başa koymak için)
    const d = q.getImageData(0, 0, cv.width, cv.height).data, Wd = cv.width, Hd = cv.height; let a = Wd, b = Hd, c = -1, e = -1, ust = -1, sx = 0, n = 0;
    for (let y = 0; y < Hd; y += 2) for (let x = 0; x < Wd; x += 2) if (d[(y * Wd + x) * 4 + 3] > 120) { if (x < a) a = x; if (x > c) c = x; if (y < b) b = y; if (y > e) e = y; if (ust < 0 || y <= ust + 4) { if (ust < 0) ust = y; sx += x; n++; } }
    if (c > a && e > b) { x0 = a / PX; y0 = b / PX; x1 = c / PX; y1 = e / PX; ux = n ? sx / n / PX : (x0 + x1) / 2; }
  } catch (e) {}
  return { cv, w, h, ox, oy, x0: x0 - ox, y0: y0 - oy, x1: x1 - ox, y1: y1 - oy, ux: ux - ox };
}
function as11Fotolar(o) {
  const k = o.as; if (k.foto.hazir) return; k.foto.hazir = true;
  if (typeof fezaCizPoz === 'function') k.foto.feza = as11Foto(q => fezaCizPoz(q, 0, 0, 1, 'sevinc', 0.35, null, AS11_FZ_OPT), 150, 150, 75, 130);
  if (typeof pirilCizPoz === 'function') { k.foto.piril = as11Foto(q => pirilCizPoz(q, 0, 0, 1, 'ucus', 0.2), 200, 180, 100, 100); k.foto.pirilK = as11Foto(q => pirilCizPoz(q, 0, 0, 1, 'goz_kirp', 0.2), 200, 180, 100, 100); }
}
function as11FotoCiz(c, sp, x, y, sx, sy) { c.drawImage(sp.cv, x - sp.ox * sx, y - sp.oy * sy, sp.w * sx, sp.h * sy); }

// ── buğu silme ──
function as11Icinde(m, x, y, pay) { const dx = (x - m.x) / (AS11_RX + pay), dy = (y - m.y) / (AS11_RY + pay); return dx * dx + dy * dy <= 1; }
// parmağın buğudaki izi: silinen yerden sızan ay ışığı + nemli camda yumuşak parmak izi (sabit havuz)
const AS11_IZ = []; for (let i = 0; i < 48; i++) AS11_IZ.push({ a: false, m: -1, x: 0, y: 0, t: 0 });
let AS11_IZI = 0, AS11_EK = 0;
function as11IzEkle(m, x, y) {
  const s = AS11_IZ[(AS11_IZI + 47) % 48]; if (s.a && s.m === m.i && Math.abs(s.x - x) + Math.abs(s.y - y) < 9) return;
  const p = AS11_IZ[AS11_IZI]; AS11_IZI = (AS11_IZI + 1) % 48; p.a = true; p.m = m.i; p.x = x; p.y = y; p.t = 0;
}
function as11IzCiz(m) {   // cam kırpmasının içinde, buğunun üstünde
  let var_ = false; for (const p of AS11_IZ) if (p.a && p.m === m.i) { var_ = true; break; } if (!var_) return;
  g.globalCompositeOperation = 'lighter';
  for (const p of AS11_IZ) { if (!p.a || p.m !== m.i) continue; const f = 1 - p.t / 1.1; as11Glow(g, '#cfe6ff', p.x, p.y, 26 + 12 * (1 - f), 26 + 12 * (1 - f), f * 0.24); as11Glow(g, '#ffffff', p.x, p.y, 10, 10, f * 0.18); }
  g.globalCompositeOperation = 'source-over';
  for (const p of AS11_IZ) { if (!p.a || p.m !== m.i) continue; const f = 1 - p.t / 1.1; g.globalAlpha = f * 0.22; g.strokeStyle = '#ffffff'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(p.x, p.y, 9, 11, 0.2, 0, 6.2832); g.stroke(); g.beginPath(); g.ellipse(p.x, p.y, 5, 6.5, 0.2, 0, 6.2832); g.stroke(); }
  g.globalAlpha = 1;
}
function as11Damga(o, m, wx, wy, r) {   // buğuya fırça damgası (+ ızgara); damga bu cama değdiyse true
  if (m.bulundu || !m.sis || !as11Icinde(m, wx, wy, r * 0.7)) return false;
  as11IzEkle(m, wx, wy);
  const F = AS11_FPX, lx = wx - m.x, ly = wy - m.y, q = m.sq;
  q.globalCompositeOperation = 'destination-out'; q.drawImage(AS11S.firca, (lx + AS11_RX + 4 - r) * F, (ly + AS11_RY + 4 - r) * F, 2 * r * F, 2 * r * F); q.globalCompositeOperation = 'source-over';
  const cw = 2 * AS11_RX / AS11_GX, ch = 2 * AS11_RY / AS11_GY, rr = r * 0.85, rr2 = rr * rr;
  const i0 = Math.max(0, Math.floor((lx - rr + AS11_RX) / cw)), i1 = Math.min(AS11_GX - 1, Math.floor((lx + rr + AS11_RX) / cw));
  const j0 = Math.max(0, Math.floor((ly - rr + AS11_RY) / ch)), j1 = Math.min(AS11_GY - 1, Math.floor((ly + rr + AS11_RY) / ch));
  for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
    const id = j * AS11_GX + i; if (!AS11_IC[id] || m.grid[id]) continue;
    const cx = -AS11_RX + (i + 0.5) * cw - lx, cy = -AS11_RY + (j + 0.5) * ch - ly; if (cx * cx + cy * cy < rr2) { m.grid[id] = 1; m.sil++; }
  }
  m.sonSil = 0;
  return true;
}
function as11Kontrol(o, m, yardim) { if (!m.bulundu && m.sil >= AS11_ICN * AS11_ESIK) as11Bul(o, m, yardim); }
function as11Bul(o, m, yardim) {
  const k = o.as; if (m.bulundu) return;
  m.bulundu = true; m.at = 0; m.fogA = 1; m.oto = null; k.n++;
  as11Halka(m.x, m.y, AS11_RX * 0.9, '#ffe7a8'); as11Halka(m.x, m.y, AS11_RX * 0.6, '#ffffff');
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42, v = 170 + Math.random() * 90; as11Toz(5, m.x + Math.cos(a) * 20, m.y - 10, Math.cos(a) * v, Math.sin(a) * v, 1.3 + Math.random() * 0.4, 8 + Math.random() * 4, '#ffd27a'); }
  as11IsikSac(m.x, m.y, 14, 150, AS11_ISIK);
  for (let i = 0; i < 10; i++) as11Toz(6, m.x + (Math.random() - 0.5) * AS11_RX * 1.4, m.y + (Math.random() - 0.5) * AS11_RY * 1.4, (Math.random() - 0.5) * 60, -20 - Math.random() * 30, 0.9, 22, '#e2daf6');   // buğu dağılır
  as11Sfx('aynaBul', k.n); as11Sfx('aynaKikir', 0.5); AS11_EK = 1;
  for (let i = 0; i < 6; i++) as11Toz(5, m.x + (Math.random() - 0.5) * 30, m.y - AS11_RY - 10, (Math.random() - 0.5) * 220, -180 - Math.random() * 120, 1.2, 9, '#ffd27a');
  k.sevT = 1.4; as11VelaPoz(k, k.n % 2 ? 'kikir' : 'alkis', 1.5); k.idle = 0; k.helpOn = false; k.helpT = 0;
  if (yardim) k.helpN++;
  OLAY.emit('salonBul', { o, n: k.n, ad: m.ad, i: m.i, yardim: !!yardim });
  if (k.n >= AS11_N) k.sonBek = 2.4;   // son gösteri bir süre oynasın, sonra kapanış
}
function as11OtoBasla(o, m, kim) {   // sihirli ışık sarmalı (dokunuş) ya da Pırıl'ın zikzağı (yardım) aynayı kendisi siler
  if (!m || m.bulundu || (m.oto && m.oto.kim === kim)) return;
  m.oto = { kim, t: 0, sure: kim === 'piril' ? 2.3 : 1.0, px: NaN, py: NaN, x: m.x, y: m.y };
  if (kim === 'oto') { as11Sfx('parilti', 0.6); as11Halka(m.x, m.y, 30, '#ffffff'); }
}
function as11OtoNokta(m, u, kim, out) {
  if (kim === 'piril') { const y = -AS11_RY * 0.72 + u * AS11_RY * 1.44, w = Math.sqrt(Math.max(0, 1 - (y / AS11_RY) * (y / AS11_RY))); out.x = m.x + Math.sin(u * Math.PI * 6.5) * AS11_RX * 0.78 * w; out.y = m.y + y; }
  else { const a = u * 6.2832 * 2.1 + m.i, rr = 1 - u * 0.86; out.x = m.x + Math.cos(a) * AS11_RX * 0.8 * rr; out.y = m.y + Math.sin(a) * AS11_RY * 0.8 * rr; }
  return out;
}
const AS11_P = { x: 0, y: 0 };
function as11OtoAdim(o, m, dt) {
  const z = m.oto; if (!z) return;
  z.t += dt; const u = clamp(z.t / z.sure, 0, 1), p = as11OtoNokta(m, u, z.kim, AS11_P);
  const r = z.kim === 'piril' ? 30 : 31;
  if (Number.isFinite(z.px)) { const d = Math.hypot(p.x - z.px, p.y - z.py), n = Math.max(1, Math.ceil(d / 7)); for (let i = 1; i <= n; i++) as11Damga(o, m, lerp(z.px, p.x, i / n), lerp(z.py, p.y, i / n), r); }
  else as11Damga(o, m, p.x, p.y, r);
  z.px = z.x = p.x; z.py = z.y = p.y;
  if (Math.random() < dt * 26) as11Toz(Math.random() < 0.4 ? 2 : 0, p.x + (Math.random() - 0.5) * 14, p.y + (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 40, -10, 0.6, 6 + Math.random() * 4, AS11_ISIK[(Math.random() * 6) | 0]);
  if (u >= 1) { m.oto = null; as11Bul(o, m, z.kim === 'piril'); }
}
function as11SilYol(o, x0, y0, x1, y1) {   // parmağın iki konumu arası: her camda damga (aynadan aynaya geçerek silinebilir)
  const k = o.as, d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(d / 6)); let sildi = false;
  for (let s = 1; s <= n; s++) { const x = lerp(x0, x1, s / n), y = lerp(y0, y1, s / n); for (const m of k.ay) if (as11Damga(o, m, x, y, AS11_FIR)) { sildi = true; m.elde = true; } }
  if (sildi) {
    k.silYol += d;
    while (k.silYol > 22) { k.silYol -= 22; as11Toz(Math.random() < 0.35 ? 2 : 0, x1 + (Math.random() - 0.5) * 22, y1 + (Math.random() - 0.5) * 22, (Math.random() - 0.5) * 50, -20 - Math.random() * 30, 0.7, 6 + Math.random() * 4, AS11_ISIK[(Math.random() * 6) | 0]); }
    if (now - k.sesT > 0.22) { k.sesT = now; as11Sfx('aynaSil', clamp(d / 30, 0.2, 1)); }
    for (const m of k.ay) if (m.elde) { m.elde = false; as11Kontrol(o, m, false); }
  }
  return sildi;
}

// ── her kare ──
function as11Adim(o, dt) {   // P.ucus === o iken motor her fizik adımında çağırır: Feza aynanın önünde durur
  const k = o.as; if (!k.aktif || P.ucus !== o) return;
  const e = k.entry;
  if (k.gT < 1 && dt > 0) {
    k.gT = Math.min(1, k.gT + dt / k.gSure); const u = k.gT, h = Math.abs(k.gx0 - e.x) > 16 ? 26 : 0;
    P.x = lerp(k.gx0, e.x, smooth(u)); P.y = lerp(k.gy0, e.y, u * u) - Math.sin(u * Math.PI) * h;
    if (!Number.isFinite(P.x) || !Number.isFinite(P.y)) { P.x = e.x; P.y = e.y; k.gT = 1; }
  } else { P.x = e.x; P.y = e.y; }
  P.vx = P.vy = P.buf = 0; P.ground = true; P.f = 1;
}
function as11Guncelle(o, dt) {
  if (!(dt > 0) || !Number.isFinite(dt)) return;
  dt = Math.min(dt, 0.05);
  const k = o.as, fx = P.rx !== undefined ? P.rx : P.x, yakin = Math.abs(fx - o.x) < 2600;
  if (!yakin && !k.aktif) return;
  if (!AS11S.hazir) { as11Isit(1); }
  for (const m of k.ay) if (!m.sis && AS11S.firca) { as11SisYap(m); break; }   // buğu tuvalleri de kareye yayılır
  k.t += dt; as11Yerlestir(o, dt); as11TozAdim(dt);
  k.sevT = Math.max(0, k.sevT - dt); k.vpT = Math.max(0, k.vpT - dt); k.konus = Math.max(0, k.konus - dt); k.tacDon = Math.max(0, k.tacDon - dt);
  for (const m of k.ay) {
    if (m.bulundu) { m.at += dt; if (m.fogA > 0) m.fogA = Math.max(0, m.fogA - dt / 0.7); as11AnimSes(m, dt); }
    else if (m.sil > 0) { m.sonSil += dt; if (k.aktif && k.faz === 'oyun' && !m.oto && m.sonSil > 2.2 && m.sil >= AS11_ICN * 0.14 && SALON11.ptr < 0) as11OtoBasla(o, m, 'oto'); }   // yarım bırakılan ayna kendiliğinden tamamlanır
    if (m.oto) as11OtoAdim(o, m, dt);
  }
  if (o.done) { as11SonAdim(o, dt); return; }
  if (DURUM !== 'oyun') return;
  if (!k.aktif && !P.ucus && P.x > o.x - 150 && P.x < o.x + 820 && P.y > o.y - 230 && P.y < o.y + 60) as11Aktiflestir(o);
  if (!k.aktif) {   // bekliyor: büyük aynanın çevresinde davetkâr ışık zerreleri; Vela el sallar
    if (Math.abs(fx - o.x) < 1400 && Math.random() < dt * 1.6) { const a = Math.random() * 6.2832; as11Toz(0, o.x + Math.cos(a) * 140, o.y - 250 + Math.sin(a) * 150, 0, -14, 1.8, 6, AS11_ISIK[(Math.random() * 6) | 0]); }
    return;
  }
  if (typeof omDikkat === 'function' && k.kameraFn) omDikkat('salon', 1.5, k.kameraFn, 1, 0.42);
  k.fT += dt;
  if (k.faz === 'saka') as11SakaAdim(o, dt);
  else if (k.faz === 'oyun') as11OyunAdim(o, dt);
  else if (k.faz === 'son') as11KapanisAdim(o, dt);
  else if (k.faz === 'don') { if (k.fT >= AS11_DON) as11Birak(o, true); }
  // basılı tutma = kendi siler
  const d = k.dok; if (SALON11.ptr >= 0 && d && d.i >= 0 && !d.oto && k.faz === 'oyun' && d.yol < 10 && now - d.t > 0.6) { d.oto = true; as11OtoBasla(o, k.ay[d.i], 'oto'); }
  as11PirilAdim(o, dt);
}
function as11SakaAdim(o, dt) {   // Vela aynada görünmez: el sallar, kıkırdar, tacı döner; sonra buğulu aynaları gösterir
  const k = o.as, t0 = k.fT - dt, t = k.fT, gec = a => t0 < a && t >= a, vx = o.x + AS11_VX;
  if (gec(0.9)) { k.sevT = 1.3; as11IsikSac(o.x + AS11_FX * AS11_REF, o.y + AS11_REFY - 40, 6, 50, AS11_ISIK); }
  if (gec(2.0)) { as11VelaPoz(k, 'el', 1.0); }
  if (gec(2.9)) { as11VelaPoz(k, 'kikir', 1.8); k.tacDon = 1.1; as11Sfx('aynaKikir', 1); OLAY.emit('salonSaka', { o }); as11IsikSac(o.x + AS11_VX * AS11_REF, o.y + AS11_REFY - AS11_VH * AS11_REF, 10, 70, ['#ffe7a8', '#ffb3d1', '#ffffff']); }
  if (gec(4.8)) as11VelaPoz(k, 'el', 1.6);
  for (let i = 0; i < AS11_N; i++) if (gec(4.9 + i * 0.16)) {   // Vela'nın elinden aynalara ışık zerresi uçar
    const m = k.ay[AS11_SIRA[i]], p = as11Toz(2, vx - 10, o.y - 48, (m.x - vx + 10) / 0.75, (m.y - o.y + 48) / 0.75 - 140, 0.75, 9, AS11_ISIK[i % 6]);
    if (p) p.r = 0; m.parla = 1.2;
  }
  if (t >= AS11_SAKA) { as11Faz(o, 'oyun'); k.idle = 0; OLAY.emit('salonOyun', { o }); }
}
function as11OyunAdim(o, dt) {
  const k = o.as;
  for (const m of k.ay) if (m.parla > 0) m.parla = Math.max(0, m.parla - dt * 1.5);
  if (k.n >= AS11_N) { k.sonBek -= dt; if (k.sonBek <= 0) { as11Faz(o, 'son'); as11Sfx('parilti', 1); } return; }
  let oto = false; for (const m of k.ay) if (m.oto) oto = true;
  if (SALON11.ptr < 0 && !oto) {
    k.idle += dt; const i = as11Hedef(k), esik = k.helpN > 0 ? AS11_YARDIM2 : AS11_YARDIM;
    if (i >= 0 && !k.ay[i].ipucu && k.idle >= AS11_GOSTER) { k.ay[i].ipucu = true; OLAY.emit('salonIpucu', { o, n: k.n + 1 }); }
    if (!k.helpOn && i >= 0 && k.idle >= esik) { k.helpOn = true; k.helpT = 0; k.helpI = i; OLAY.emit('salonYardim', { o, n: k.n + 1 }); }
  }
  if (k.helpOn) { k.helpT += dt; const m = k.ay[k.helpI]; if (!m || m.bulundu) { k.helpOn = false; k.helpT = 0; } }
  if (k.vpT <= 0 && Math.random() < dt * 0.12) as11VelaPoz(k, 'kikir', 0.9);   // Vela arada bir kendi kendine kıkırdar
}
function as11KapanisAdim(o, dt) {   // bütün çerçeveler parlar; Vela'nın yansıması bir an belirip göz kırpar
  const k = o.as, t0 = k.fT - dt, t = k.fT, gec = a => t0 < a && t >= a;
  for (let i = 0; i < AS11_N; i++) if (gec(0.05 + i * 0.13)) { const m = k.ay[AS11_SIRA[i]]; m.parla = 1.4; as11IsikSac(m.x, m.y - AS11_RY - 10, 6, 70, AS11_ALTIN); as11Halka(m.x, m.y, AS11_RX + 6, '#ffe7a8'); }
  if (gec(0.9)) { as11Sfx('parilti', 0.8); as11IsikSac(o.x + AS11_VX * AS11_REF, o.y + AS11_REFY - 40, 14, 90, ['#ffffff', '#cfe6ff', '#ffb3d1']); }
  if (gec(1.6)) as11VelaPoz(k, 'el', 1.4);
  if (gec(2.3)) { as11Sfx('gozKirp', 0.8); OLAY.emit('salonVela', { o }); const p = as11Toz(2, o.x + AS11_VX * AS11_REF + 7, o.y + AS11_REFY - AS11_VH * AS11_REF * 0.78, 0, -6, 0.9, 13, '#ffffff'); if (p) p.r = 0.4; }
  if (gec(3.0)) { as11VelaPoz(k, 'kikir', 1.4); as11Sfx('aynaKikir', 1); }
  if (gec(4.0)) as11VelaPoz(k, 'alkis', 1.4);
  for (const m of k.ay) if (m.parla > 0) m.parla = Math.max(0, m.parla - dt * 1.1);
  if (t >= AS11_SON) as11Faz(o, 'don');
}
function as11VelaGor(k) {   // büyük aynada Vela'nın görünürlüğü (yalnız kapanışta bir an)
  if (k.faz !== 'son' && k.faz !== 'don') return 0;
  const t = k.faz === 'don' ? AS11_SON + k.fT : k.fT;
  return smooth(as11Ac(t, 0.9, 1.55)) * (1 - smooth(as11Ac(t, 3.0, 3.7)));
}
function as11SonAdim(o, dt) {   // bitti: aynalar parlak; Vela, Feza giderken el sallar
  const k = o.as, fx = P.rx !== undefined ? P.rx : P.x, dx = fx - (o.x + AS11_VX);
  k.son.t += dt;
  if (Math.abs(dx) < 1600 && k.vpT <= 0) { if (dx > 120 && dx < 900) as11VelaPoz(k, 'el', 1.2); else if (Math.random() < dt * 0.15) as11VelaPoz(k, 'kikir', 0.9); }
  for (const m of k.ay) if (m.parla > 0) m.parla = Math.max(0, m.parla - dt * 1.1);
  if (Math.abs(fx - o.x) < 1400 && Math.random() < dt * 1.2) { const m = k.ay[(Math.random() * AS11_N) | 0]; as11Toz(2, m.x + (Math.random() - 0.5) * AS11_RX * 1.6, m.y + (Math.random() - 0.5) * AS11_RY * 1.6, 0, -8, 1.1, 6 + Math.random() * 4, AS11_ALTIN[(Math.random() * 4) | 0]); }
}
// her yansımanın gösteri sesleri (gösteri zaman çizelgesiyle)
function as11AnimSes(m, dt) {
  const a = m.at, a0 = a - dt, gec = x => a0 < x && a >= x;
  if (m.ad === 'sapkaPiril') { if (gec(0.42)) as11Sfx('boing', 0.5); if (gec(1.75)) as11Sfx('boing', 0.4); }
  else if (m.ad === 'kediDede') { if (gec(1.0)) as11Sfx('kediMiyav', 0.6); }
  else if (m.ad === 'pitirKirp') { if (gec(0.85)) { as11Sfx('gozKirp', 0.9); const Y = AS11_YUZ.bebek; as11Toz(2, m.x + Y.goz[0][0] * 1.12 - 12, m.y + Y.goz[0][1] - 14, 0, -10, 0.8, 12, '#ffffff'); } if (gec(1.5)) as11Sfx('aynaKikir', 0.4); }
  else if (m.ad === 'cilekNine') { if (gec(0.22)) { as11Sfx('puf', 0.5); as11Halka(m.x, m.y + AS11_YUZ.nine.topuz[1] - 18, 22, '#ff7a9a'); } if (a > 0.5 && a < 2.2 && Math.random() < dt * 5) as11Toz(4, m.x + (Math.random() - 0.5) * 70, m.y - 30 - Math.random() * 30, 0, -38, 1.3, 0, Math.random() < 0.5 ? '#ff7a9a' : '#ffb3d1'); }
  else if (m.ad === 'gulenAy') { if (gec(0.95)) as11Sfx('parilti', 0.6); }
  else if (m.ad === 'uzunFeza') { if (gec(0.2)) as11Sfx('boing', 0.35); if (gec(1.2)) as11Sfx('boing', 0.5); }
}
function as11PirilAdim(o, dt) {   // Pırıl: Feza'nın yanında · şakada ikisinin arasında · ipucunda aynanın yanında · yardımda buğuyu siler
  const k = o.as, pr = k.pr, e = k.entry;
  let tx = e.x - 58, ty = e.y - 112 + Math.sin(k.t * 2.1) * 5, hiz = 3.5, bak = 1;
  if (k.faz === 'saka') { tx = o.x - 26; ty = o.y - 122 + Math.sin(k.t * 2.4) * 4; bak = k.fT > 2.6 && k.fT < 4.6 ? 1 : -1; }
  else if (k.faz === 'oyun' && k.n < AS11_N) {
    const hm = k.helpOn ? k.ay[k.helpI] : null;
    if (hm && !hm.bulundu) {
      if (hm.oto && hm.oto.kim === 'piril') { tx = hm.oto.x + 4; ty = hm.oto.y - 8; hiz = 14; bak = Math.sign(hm.x - pr.x) || 1; }
      else { tx = hm.x - AS11_RX * 0.6; ty = hm.y - AS11_RY * 0.68; hiz = 4.5; bak = 1; if (k.helpT > 1.1 && Math.hypot(pr.x - tx, pr.y - ty) < 26) as11OtoBasla(o, hm, 'piril'); }
    } else if (k.idle > AS11_GOSTER) {   // ipucu: sıradaki aynanın yanında süzülür, Feza'ya döner bakar
      const i = as11Hedef(k), m = i >= 0 ? k.ay[i] : null;
      if (m) { const sx = m.x < o.x ? 1 : -1; tx = m.x + sx * (AS11_RX + 38); ty = m.y + Math.sin(k.t * 3.1) * 6; hiz = 3; bak = Math.sin(k.t * 0.9) > 0 ? Math.sign(e.x - pr.x) || 1 : -sx;
        if (Math.random() < dt * 8) as11Toz(0, pr.x, pr.y + 6, -bak * 14, 6, 0.9, 5, AS11_ISIK[(Math.random() * 6) | 0]); }
    }
  } else if (k.faz === 'son' || k.faz === 'don') { tx = e.x - 62 + Math.sin(k.fT * 2.2) * 16; ty = o.y - 118 + Math.sin(k.fT * 4) * 8; hiz = 5; bak = 1; }   // Vela'nın anı: Pırıl kenarda sevinir, büyük aynayı kapatmaz
  const kk = 1 - Math.exp(-dt * hiz); pr.x += (tx - pr.x) * kk; pr.y += (ty - pr.y) * kk;
  if (!Number.isFinite(pr.x) || !Number.isFinite(pr.y)) { pr.x = tx; pr.y = ty; }
  if (Math.abs(tx - pr.x) > 6) pr.f = Math.sign(tx - pr.x); else pr.f = bak;
}

// ── çizim ──
function as11FezaPoz(k) { return k.sevT > 0.2 || (k.faz === 'saka' && k.fT > 0.9 && k.fT < 2.1) || (k.faz === 'son' && k.fT > 0.3) || k.faz === 'don' ? 'sevinc' : 'ayakta_yan'; }
function as11VelaPozAd(o) {
  const k = o.as;
  if (k.vpT > 0) return k.vp;
  if (!k.aktif && !o.done) { const fx = P.rx !== undefined ? P.rx : P.x; return Math.abs(fx - o.x) < 700 ? 'el' : 'dur'; }
  return 'dur';
}
const AS11_VO = { yon: -1, poz: 'dur', mutlu: 1, pelerin: 0, agiz: undefined, kirp: 0, kirpTek: 0, faz: 0, gorunmez: 0 };
function as11VelaCiz(o, tm, x, y, s, gorunmez, kirp) {   // Vela (vampirCiz; VAMPIR) — yoksa yer tutucu hiçbir şey çizmez
  if (typeof vampirCiz !== 'function') return;
  const k = o.as, q = AS11_VO, fx = P.rx !== undefined ? P.rx : P.x;
  q.poz = as11VelaPozAd(o); q.yon = fx < o.x + AS11_VX ? -1 : 1; q.mutlu = 1; q.pelerin = q.poz === 'kikir' ? 0.25 : 0;
  q.agiz = q.poz === 'kikir' && !(k.konus > 0) ? 0.4 + 0.3 * Math.abs(Math.sin(tm * 16)) : undefined;   // konuşurken (vk_) ağzı vampirCiz kendisi oynatır
  q.kirp = kirp || 0; q.kirpTek = kirp ? 1 : 0; q.faz = tm; q.gorunmez = gorunmez || 0;
  as11Dis(k, 'vela', () => vampirCiz(g, 'kiz', x, y, s, tm, q));
}
// başka dosyanın çizicisi: dönüşüm/saydamlık her durumda geri alınır; hata verirse 5 sn çağrılmaz (her karede save yığını büyümesin)
function as11Dis(k, ad, fn) {
  if (k.hata[ad] > now) return;
  const M = g.getTransform(), a = g.globalAlpha, op = g.globalCompositeOperation;
  g.save(); try { fn(); } catch (e) { k.hata[ad] = now + 5; } finally { g.restore(); g.setTransform(M); g.globalAlpha = a; g.globalCompositeOperation = op; }
}
function as11Ciz(o, tm) {
  const k = o.as; if (!AS11S.hazir || o.x + 760 < cam.x || o.x - 760 > cam.x + VW) return;
  if (k.lay < 0) as11Yerlestir(o, 0);
  as11BuyukCiz(o, tm);
  for (const m of k.ay) as11AynaCiz(o, m, tm);
  // Vela: büyük aynanın sağında, Feza'ya dönük (kendisi görünür; aynada yalnız tacı)
  as11VelaCiz(o, tm, o.x + AS11_VX, o.y, 1, 0, 0);
}
function as11AynaCiz(o, m, tm) {
  const k = o.as, RX = AS11_RX, RY = AS11_RY, x = m.x, y = m.y, vurgu = as11Vurgu(o, m, tm);
  g.globalAlpha = 0.85; g.drawImage(AS11S.golge, x - RX - 22 + 5, y - RY - 22 + 9, (RX + 22) * 2, (RY + 22) * 2); g.globalAlpha = 1;
  if (vurgu > 0.01 || m.parla > 0 || m.bulundu) {   // hâle: çerçevenin arkasında (camı beyazlatmaz)
    g.globalCompositeOperation = 'lighter';
    if (m.bulundu) as11Glow(g, '#cfe6ff', x, y, RX * 1.9, RY * 1.7, 0.2 + 0.06 * Math.sin(tm * 2 + m.i));
    if (vurgu > 0.01) as11Glow(g, '#ffd27a', x, y, RX * 2.3 + vurgu * 18, RY * 2.05 + vurgu * 18, 0.85 * vurgu);
    if (m.parla > 0) as11Glow(g, '#ffe7a8', x, y, RX * 2.4, RY * 2.1, 0.6 * Math.min(1, m.parla));
    g.globalCompositeOperation = 'source-over';
  }
  g.drawImage(AS11S.cam, x - AS11S.cam.bw / 2, y - AS11S.cam.bh / 2, AS11S.cam.bw, AS11S.cam.bh);
  g.save(); g.beginPath(); g.ellipse(x, y, RX + 0.5, RY + 0.5, 0, 0, 6.2832); g.clip();
  try { as11IcCiz(o, m, tm); } catch (e) {}
  // buğunun altında saklı yıldızlar
  const Y = AS11_YLD[m.i & 1];
  for (let j = 0; j < 3; j++) { const p = Y[j], tw = 0.6 + 0.4 * Math.sin(tm * 3 + j * 2.1 + m.i), s = (m.bulundu ? 7 : 6) * tw + 2; g.globalAlpha = 0.55 + 0.45 * tw; g.drawImage(AS11S.yildiz, x + p[0] - s, y + p[1] - s, s * 2, s * 2); }
  g.globalAlpha = 1;
  if (m.sis && (!m.bulundu || m.fogA > 0)) {   // buğu (silinen yerler şeffaf)
    g.globalAlpha = m.bulundu ? m.fogA : 1; const F = AS11_FPX;
    g.drawImage(m.sis, x - RX - 4, y - RY - 4, m.sis.width / F, m.sis.height / F); g.globalAlpha = 1;
  }
  as11IzCiz(m);
  g.drawImage(AS11S.ust, x - AS11S.ust.bw / 2, y - AS11S.ust.bh / 2, AS11S.ust.bw, AS11S.ust.bh);
  if (m.bulundu && m.at < 1.3) {   // bulununca camdan geçen parlama şeridi
    const u = m.at / 1.3, M = g.getTransform(); g.translate(x - RX * 1.4 + u * RX * 2.8, y); g.rotate(0.5); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.45 * Math.sin(u * Math.PI);
    g.drawImage(AS11S.serit, -12, -RY * 1.3, 24, RY * 2.6); g.setTransform(M); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  }
  g.restore();
  // çerçeve + parıltı
  const cf = AS11S.cerceve[AS11_SUS[m.i]], sk = (m.parla > 0 ? 1 + 0.03 * Math.sin(Math.min(1, m.parla) * Math.PI) : 1) + (m.bulundu && m.at >= 0 && m.at < 0.7 ? 0.09 * Math.sin(m.at / 0.7 * Math.PI * 2.5) * (1 - m.at / 0.7) : 0);
  if (m.parla > 0) { g.globalCompositeOperation = 'lighter'; as11Glow(g, '#fff4d6', x, y, RX * 1.3, RY * 1.25, 0.22 * Math.min(1, m.parla)); g.globalCompositeOperation = 'source-over'; }   // kısa ışık parlaması
  g.drawImage(cf, x - cf.ox * sk, y - cf.oy * sk, cf.bw * sk, cf.bh * sk);
  if (vurgu > 0.3) for (let i = 0; i < 10; i++) {   // ipucu: çerçevenin çevresinde dönen ışık zerreleri
    const an = tm * 1.4 + i * 0.6283, tw = Math.max(0, Math.sin(tm * 4 + i * 1.9)); if (tw < 0.05) continue;
    g.globalAlpha = tw * vurgu; g.fillStyle = i % 3 ? '#ffffff' : '#ffe7a8'; g.beginPath(); g.arc(x + Math.cos(an) * (RX + 22), y + Math.sin(an) * (RY + 22), 2.2 + tw * 1.8, 0, 6.2832); g.fill();
  }
  g.globalAlpha = 1;
  // ipucu: buğuda ışık noktası zikzak çizer ("sil" hareketi; el yok)
  if (vurgu > 0.3 && !m.bulundu && !m.oto) {
    const u = (tm * 0.42 + m.i * 0.13) % 1, p = as11OtoNokta(m, u, 'piril', AS11_P);
    g.globalCompositeOperation = 'lighter'; as11Glow(g, '#ffe7a8', p.x, p.y, 30, 30, 0.45 * vurgu); as11Glow(g, '#ffffff', p.x, p.y, 13, 13, 0.9 * vurgu); g.globalCompositeOperation = 'source-over';
    if (Math.random() < 0.25) as11Toz(0, p.x, p.y, 0, 0, 0.5, 5, '#ffffff');
  }
  if (m.oto) { const z = m.oto; g.globalCompositeOperation = 'lighter'; as11Glow(g, '#ffffff', z.x, z.y, 22, 22, 0.8); as11Glow(g, '#c39bff', z.x, z.y, 40, 40, 0.45); g.globalCompositeOperation = 'source-over'; }
}
function as11Vurgu(o, m, tm) {   // sıradaki aynanın ipucu parıltısı (0..1)
  const k = o.as; if (m.bulundu || !k.aktif || k.faz !== 'oyun') return 0;
  const sec = SALON11.klavye && k.secK === m.i, hedef = as11Hedef(k) === m.i;
  let v = 0;
  if (hedef && k.idle > AS11_IPUCU) v = 0.55 + 0.45 * Math.sin(tm * 3.2);
  if (k.helpOn && k.helpI === m.i) v = Math.max(v, 0.5 + 0.3 * Math.sin(tm * 6));
  if (sec) v = Math.max(v, 0.7 + 0.25 * Math.sin(tm * 5));
  return v;
}
// büyük ayna: Feza ve Pırıl'ın yansıması; Vela yerine havada süzülen taç ve kurdele
function as11BuyukCiz(o, tm) {
  const k = o.as, cx = o.x, fy = o.y, hw = k.bw, yb = fy + AS11_BY0, yt = fy + AS11_BY1, sx = hw / AS11_BB[0], rf = AS11_REF, ry0 = fy + AS11_REFY;
  g.globalAlpha = 0.8; g.drawImage(AS11S.golge, cx - hw - 40 + 8, yt - 30 + 10, (hw + 40) * 2, yb - yt + 80); g.globalAlpha = 1;
  const bc = AS11S.bcam; g.drawImage(bc, cx - bc.bw / 2 * sx, yt - 2, bc.bw * sx, bc.bh);
  // (kırpma yok: başka dosyaların çizicileri hata verip save/restore dengesini bozarsa kırpma ekranda kalmasın; yansımalar camın içinde tutulur)
  const aktif = k.aktif && P.ucus === o;
  if (aktif) {   // Pırıl ve Feza'nın yansıması (aynı poz, biraz küçük: ayna derinliği)
    const pr = k.pr, px = cx + (pr.x - cx) * rf, py = ry0 - (fy - pr.y) * rf;
    if (typeof pirilCizPoz === 'function' && Math.abs(px - cx) < hw - 34 && py > yt + 40) as11Dis(k, 'piril', () => { g.translate(px, py); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, rf, as11PirilPoz(k), tm); });
    if (typeof fezaCizPoz === 'function') as11Dis(k, 'feza', () => { g.globalAlpha = 0.95; fezaCizPoz(g, cx + (P.x - cx) * rf, ry0 + (P.y - fy) * rf, rf, as11FezaPoz(k), tm, null, AS11_FZ_OPT); });
  }
  // Vela: yansımada görünmez — yalnız tacı ve kurdelesi süzülür (kapanışta bir an kendisi de belirir)
  const vg = as11VelaGor(k), vx = cx + AS11_VX * rf, vk = k.faz === 'son' && k.fT > 2.3 && k.fT < 2.65 ? 1 : 0;
  if (vg > 0.01) as11VelaCiz(o, tm, vx, ry0, rf, 1 - vg, vk);
  const pz = as11VelaPozAd(o), el = pz === 'el' ? 1 : 0, kik = pz === 'kikir' ? 1 : 0;
  const bob = Math.sin(tm * 2.1) * 3 + kik * Math.abs(Math.sin(tm * 14)) * -3, sw = Math.sin(tm * 1.5) * 0.08 + el * Math.sin(tm * 9) * 0.22;
  const tx = vx + Math.sin(tm * 1.3) * 2 + el * Math.sin(tm * 9) * 5, ty = ry0 - AS11_VH * rf - 2 + bob;
  const dn = k.tacDon > 0 ? Math.cos((1.1 - k.tacDon) / 1.1 * Math.PI * 4) : 1;   // fırıl fırıl döner
  const ta = 1 - vg;
  if (ta > 0.01) {
    g.globalCompositeOperation = 'lighter'; as11Glow(g, '#ffe7a8', tx, ty - 8, 40, 34, 0.5 * ta * (0.8 + 0.2 * Math.sin(tm * 3))); g.globalCompositeOperation = 'source-over';
    const tc = AS11S.tac, M = g.getTransform(), s = rf * 1.3;   // biraz iri: şaka uzaktan da okunsun g.translate(tx, ty); g.rotate(sw); g.scale(s * (Math.abs(dn) < 0.15 ? 0.15 * Math.sign(dn || 1) : dn), s); g.globalAlpha = ta;
    g.drawImage(tc, -tc.ox, -tc.oy, tc.bw, tc.bh); g.setTransform(M); g.globalAlpha = 1;
    for (let i = 0; i < 4; i++) { const a = tm * 1.4 + i * 1.571, rx = tx + Math.cos(a) * 28, ry = ty - 6 + Math.sin(a) * 13, tw = Math.max(0, Math.sin(tm * 4 + i * 1.7)); if (tw < 0.05) continue; g.globalAlpha = tw * ta * 0.9; g.fillStyle = i & 1 ? '#ffffff' : '#ffe7a8'; g.beginPath(); g.arc(rx, ry, 1.6 + tw * 1.4, 0, 6.2832); g.fill(); }
    g.globalAlpha = 1;
  }
  const bu = AS11S.bust; g.drawImage(bu, cx - bu.bw / 2 * sx, yt - 2, bu.bw * sx, bu.bh);
  if (k.faz === 'son' || k.faz === 'don') { const t = k.faz === 'don' ? AS11_SON : k.fT, a = as11Tepe(t, 0.6, 3.9); if (a > 0) { g.globalCompositeOperation = 'lighter'; as11Glow(g, '#cfe6ff', cx, (yb + yt) / 2, hw * 1.6, (yb - yt) * 0.7, 0.45 * a); g.globalCompositeOperation = 'source-over'; } }
  const bf = AS11S.bcerceve; g.drawImage(bf, cx - bf.ox * sx, fy - bf.oy, bf.bw * sx, bf.bh);
}
function as11PirilPoz(k) { return k.sevT > 0.5 || (k.faz === 'saka' && k.fT > 3 && k.fT < 4.6) || k.faz === 'son' || k.faz === 'don' ? 'goz_kirp' : 'ucus'; }

// ── küçük aynaların komik yansımaları (cam kırpması içinde) ──
function as11IcCiz(o, m, tm) {
  const a = m.bulundu ? m.at : -1, t = tm + m.i * 1.7;
  switch (m.ad) {
    case 'sapkaPiril': as11IcPiril(o, m, a, t); break;
    case 'kediDede': as11IcDede(m, a, t); break;
    case 'pitirKirp': as11IcPitir(m, a, t); break;
    case 'cilekNine': as11IcNine(m, a, t); break;
    case 'gulenAy': as11IcAy(m, a, t); break;
    case 'uzunFeza': as11IcFeza(o, m, a, t); break;
  }
}
function as11Goz(c, x, y, r, kapa, mutlu, bx, kirpik) {   // iri parlak göz (koyu; beyaz parıltılı) · kapanınca yumuşak kavis
  c.lineCap = 'round';
  if (mutlu > 0.5 || kapa > 0.88) {
    c.strokeStyle = '#3a2440'; c.lineWidth = Math.max(1.4, r * 0.3); c.beginPath();
    if (mutlu > 0.5) c.arc(x, y + r * 0.4, r * 0.72, Math.PI * 1.15, Math.PI * 1.85); else c.arc(x, y - r * 0.15, r * 0.72, Math.PI * 0.15, Math.PI * 0.85);
    c.stroke();
    if (kirpik) { c.lineWidth = Math.max(1.1, r * 0.16); for (let i = 0; i < 3; i++) { const an = Math.PI * (0.3 + i * 0.2), ex = x + Math.cos(an) * r * 0.72, ey = y - r * 0.15 + Math.sin(an) * r * 0.72; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + Math.cos(an) * r * 0.32, ey + Math.sin(an) * r * 0.32); c.stroke(); } }
    return;
  }
  const ry = r * (1 - 0.9 * clamp(kapa, 0, 1));
  c.fillStyle = '#2b2240'; c.beginPath(); c.ellipse(x + bx, y, r * 0.8, ry, 0, 0, 6.2832); c.fill();
  if (r > 8) { c.fillStyle = '#6a4fa8'; c.beginPath(); c.ellipse(x + bx, y + ry * 0.35, r * 0.55, ry * 0.45, 0, 0, 6.2832); c.fill(); }
  if (ry > r * 0.35) { c.fillStyle = '#ffffff'; c.beginPath(); c.arc(x + bx - r * 0.28, y - ry * 0.38, r * 0.28, 0, 6.2832); c.fill(); c.beginPath(); c.arc(x + bx + r * 0.25, y + ry * 0.3, r * 0.13, 0, 6.2832); c.fill(); }
}
function as11Agiz(c, x, y, w, acik, kedi) {   // gülümseme + iki minik YUVARLAK dişçik (sivri değil) · açık kahkaha · kedi ağzı (ω)
  c.lineCap = 'round'; c.lineJoin = 'round';
  if (acik > 0.08) {
    const h = w * (0.4 + 0.8 * acik);
    c.fillStyle = '#7a2f52'; c.beginPath(); c.moveTo(x - w, y - 1); c.quadraticCurveTo(x, y + 2, x + w, y - 1); c.quadraticCurveTo(x + w * 0.85, y + h, x, y + h); c.quadraticCurveTo(x - w * 0.85, y + h, x - w, y - 1); c.fill();
    c.fillStyle = '#ff8fb0'; c.beginPath(); c.ellipse(x, y + h * 0.72, w * 0.5, h * 0.26, 0, 0, 6.2832); c.fill();
    c.fillStyle = '#ffffff'; for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * w * 0.3, y + w * 0.12, w * 0.14, 0, 6.2832); c.fill(); }
    return;
  }
  c.strokeStyle = '#7a3a5a'; c.lineWidth = Math.max(1.3, w * 0.17);
  if (kedi) {
    c.beginPath(); c.arc(x - w * 0.4, y, w * 0.4, 0.2, Math.PI - 0.2); c.stroke(); c.beginPath(); c.arc(x + w * 0.4, y, w * 0.4, 0.2, Math.PI - 0.2); c.stroke();
    c.fillStyle = '#ffffff'; for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * w * 0.42, y + w * 0.5, w * 0.12, 0, 6.2832); c.fill(); }
    return;
  }
  c.beginPath(); c.arc(x, y - w * 0.55, w, Math.PI * 0.22, Math.PI * 0.78); c.stroke();
  c.fillStyle = '#ffffff'; c.strokeStyle = 'rgba(122,58,90,0.5)'; c.lineWidth = 0.7;
  for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * w * 0.28, y + w * 0.5, w * 0.13, 0, 6.2832); c.fill(); c.stroke(); }
}
function as11YuzSp(c, sp, x, y, s, rot) { const M = c.getTransform(); c.translate(x, y); if (rot) c.rotate(rot); c.scale(s, s); c.drawImage(sp, -sp.bw / 2, -sp.bh / 2, sp.bw, sp.bh); return M; }
function as11Kirp(t, per, ofs) { return ((t + ofs) % per) < 0.13 ? 1 : 0; }
function as11IcDede(m, a, t) {   // Vampir Dede → kedi: kulaklar, pembe kedi burnu, bıyıklar, "miyav"
  const Y = AS11_YUZ.dede, x = m.x, y = m.y;
  const kul = a < 0 ? 0 : as11Yay(as11Ac(a, 0, 0.5)), kedi = a >= 0.3 ? 1 : 0, biyik = a < 0 ? 0 : smooth(as11Ac(a, 0.5, 0.9));
  let rot = Math.sin(t * 0.8) * 0.03, acik = 0, mutlu = 0;
  if (a >= 0 && a < AS11_ANIM) { if (a > 1.0 && a < 1.5) { acik = Math.sin(as11Ac(a, 1.0, 1.5) * Math.PI) * 0.8; rot += 0.12 * Math.sin(as11Ac(a, 1.0, 1.5) * Math.PI); } if (a >= 1.6 && a < 2.9) { rot += Math.sin((a - 1.6) * 6) * 0.13; mutlu = 1; } }
  const twitch = a >= 0 ? ((t % 2.6) < 0.35 ? Math.sin(t * 40) * 0.09 : 0) + (a > 0.5 && a < 1.5 ? Math.sin(a * 30) * 0.12 : 0) : 0;
  const M0 = g.getTransform(); g.translate(x, y + 6); g.rotate(rot);
  if (kul > 0.01) { const ku = AS11S.kulak; for (let j = 0; j < 2; j++) { const p = Y.kulak[j], sxx = j ? 1 : -1, M = g.getTransform(); g.translate(p[0], p[1] + Y.cy); g.rotate(sxx * 0.32 + (j ? 1 : -1) * twitch * 0.6); g.scale(kul, kul); g.drawImage(ku, -ku.ox, -ku.oy, ku.bw, ku.bh); g.setTransform(M); } }
  { const yz = AS11S.yuz.dede; g.drawImage(yz, -yz.bw / 2, -yz.bh / 2, yz.bw, yz.bh); }
  const kp = as11Kirp(t, 3.3, 0.6);
  for (const p of Y.goz) as11Goz(g, p[0], p[1] + Y.cy - 8, Y.gr, kp, mutlu, 0, false);
  const bx = Y.burun[0], by = Y.burun[1] + Y.cy - 8;
  if (kedi) { g.fillStyle = '#ff8fb0'; g.beginPath(); g.moveTo(bx - 4.5, by - 2.5); g.lineTo(bx + 4.5, by - 2.5); g.quadraticCurveTo(bx + 1, by + 3.5, bx, by + 3.5); g.quadraticCurveTo(bx - 1, by + 3.5, bx - 4.5, by - 2.5); g.fill(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(bx - 1.5, by - 1.2, 1, 0, 6.2832); g.fill(); }
  else { g.fillStyle = '#f2a8a0'; g.beginPath(); g.ellipse(bx, by, 4.2, 3, 0, 0, 6.2832); g.fill(); }
  as11Agiz(g, Y.agiz[0], Y.agiz[1] + Y.cy - 8, Y.agiz[2], acik, kedi);
  if (biyik > 0.01) {   // bıyıklar: üçer, ince, seğiren
    g.strokeStyle = '#5a4a72'; g.lineWidth = 1.3; g.lineCap = 'round';
    for (const s of [-1, 1]) for (let j = -1; j <= 1; j++) { const an = j * 0.22 + twitch * s, x0 = bx + s * 9, y0 = by + 3 + j * 3, L = 30 * biyik; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + s * L * 0.55, y0 + Math.sin(an) * L * 0.4 - 2, x0 + s * Math.cos(an) * L, y0 + Math.sin(an) * L); g.stroke(); }
  }
  g.setTransform(M0);
}
function as11IcPitir(m, a, t) {   // bebek Pıtır: kocaman yüz yaklaşır, kirpikli koca bir göz kırpar, kıkırdar
  const Y = AS11_YUZ.bebek, x = m.x, y = m.y;
  let s = 1, rot = Math.sin(t * 1.1) * 0.04, kapa0 = as11Kirp(t, 3.6, 0.2), kapa1 = kapa0, acik = 0, bob = 0, mutlu = 0;
  if (a >= 0 && a < AS11_ANIM) {
    s = 1 + 0.14 * as11Yay(as11Ac(a, 0, 0.4)) - 0.08 * smooth(as11Ac(a, 2.4, 3.2));
    if (a > 0.6 && a < 1.5) { kapa0 = a < 0.85 ? as11Ac(a, 0.6, 0.85) : a < 1.3 ? 1 : 1 - as11Ac(a, 1.3, 1.5); kapa1 = 0; }
    if (a >= 1.5 && a < 2.5) { acik = 0.5 + 0.4 * Math.abs(Math.sin(a * 14)); bob = -Math.abs(Math.sin(a * 9)) * 4; mutlu = 1; }
  } else if (a >= AS11_ANIM) { s = 1.06; const w = (t % 4.6); if (w < 0.7) { kapa0 = Math.sin(w / 0.7 * Math.PI) > 0.4 ? 1 : 0; kapa1 = 0; } }
  const M0 = as11YuzSp(g, AS11S.yuz.bebek, x, y + 6 + bob, s, rot);
  for (let j = 0; j < 2; j++) { const p = Y.goz[j], kp = j === 0 ? kapa0 : kapa1; as11Goz(g, p[0], p[1] + Y.cy - 8, Y.gr, mutlu ? 1 : kp, mutlu, 0, j === 0 && kp > 0.88); }
  as11Agiz(g, Y.agiz[0], Y.agiz[1] + Y.cy - 8, Y.agiz[2], acik, false);
  g.setTransform(M0);
}
function as11IcNine(m, a, t) {   // Vampir Nine: topuzu "puf" diye kocaman bir çileğe dönüşür, zıplar
  const Y = AS11_YUZ.nine, x = m.x, y = m.y;
  let rot = Math.sin(t * 0.9) * 0.03, mutlu = 0, acik = 0, cs = 0, ts = 1, csq = 0, bob = 0;
  if (a < 0) { ts = 1; cs = 0; }
  else if (a < 0.25) { ts = 1 + 0.5 * as11Ac(a, 0, 0.25); cs = 0; }
  else { ts = 0; cs = 0.55 + 0.7 * as11Yay(as11Ac(a, 0.25, 0.85)); if (a > 0.85 && a < 2.1) { const ph = (a - 0.85) * 9; csq = Math.sin(ph) * 0.12; bob = -Math.abs(Math.sin(ph * 0.5)) * 6; } if (a >= AS11_ANIM) { csq = Math.sin(t * 2.4) * 0.05; bob = -Math.abs(Math.sin(t * 1.2)) * 3; } }
  if (a >= 0.5 && a < 2.3) { mutlu = 1; acik = 0.4 + 0.35 * Math.abs(Math.sin(a * 12)); }
  const M0 = g.getTransform(); g.translate(x, y + 6); g.rotate(rot);
  const tx = Y.topuz[0], ty = Y.topuz[1] + Y.cy - 8;
  if (ts > 0.01) { const tp = AS11S.topuz; g.drawImage(tp, tx - tp.ox * ts, ty + 6 - tp.oy * ts, tp.bw * ts, tp.bh * ts); }
  { const yz = AS11S.yuz.nine; g.drawImage(yz, -yz.bw / 2, -yz.bh / 2, yz.bw, yz.bh); }
  if (cs > 0.01) { const ck = AS11S.cilek, M = g.getTransform(); g.translate(tx, ty + 8 + bob); g.rotate(Math.sin(t * 1.7) * 0.07); g.scale(cs * (1 + csq), cs * (1 - csq)); g.drawImage(ck, -ck.ox, -ck.oy, ck.bw, ck.bh); g.setTransform(M); }
  const kp = as11Kirp(t, 3.9, 1.3);
  for (const p of Y.goz) as11Goz(g, p[0], p[1] + Y.cy - 8, Y.gr, kp, mutlu, 0, true);
  as11Agiz(g, Y.agiz[0], Y.agiz[1] + Y.cy - 8, Y.agiz[2], acik, false);
  g.setTransform(M0);
}
function as11IcAy(m, a, t) {   // aynada gece göğü: uyuyan Ay yükselir, uyanır, kahkahayla sallanır, göz kırpar
  const x = m.x, y = m.y, gc = AS11S.gece; g.drawImage(gc, x - gc.bw / 2, y - gc.bh / 2, gc.bw, gc.bh);
  for (let i = 0; i < 4; i++) { const tw = Math.max(0, Math.sin(t * 2.3 + i * 1.9)); if (tw < 0.1) continue; g.globalAlpha = tw; g.drawImage(AS11S.pirilti, x - 40 + i * 26 - 6, y - 58 + (i % 2) * 18 - 6, 12, 12); }
  g.globalAlpha = 1;
  let rise = 54, rot = Math.sin(t * 0.9) * 0.06, uyku = 1, acik = 0, k0 = 0, k1 = 0, mutlu = 0;
  if (a >= 0) {
    rise = 54 * (1 - as11Yay(as11Ac(a, 0, 0.9))); uyku = a < 0.95 ? 1 : 0;
    if (a >= 1.3 && a < 2.4) { rot = Math.sin((a - 1.3) * 9) * 0.16; acik = 0.5 + 0.45 * Math.abs(Math.sin(a * 13)); mutlu = 1; }
    else if (a >= 2.4 && a < 2.95) { k1 = 1; }
    else if (a >= AS11_ANIM) { k0 = k1 = as11Kirp(t, 3.7, 0); if ((t % 9) < 0.5) k1 = 1; }
  }
  const my = y + 4 + rise, ay = AS11S.ay, M0 = g.getTransform();
  g.translate(x, my); g.rotate(rot); g.drawImage(ay, -ay.bw / 2, -ay.bw / 2, ay.bw, ay.bw);
  g.globalAlpha = 0.6; as11Glow(g, '#ff8fb0', -22, 10, 10, 7, 0.9); as11Glow(g, '#ff8fb0', 22, 10, 10, 7, 0.9); g.globalAlpha = 1;
  if (uyku) { as11Goz(g, -14, -4, 8, 1, 0, 0, false); as11Goz(g, 14, -4, 8, 1, 0, 0, false); }
  else { as11Goz(g, -14, -4, 8, k0, mutlu, 0, false); as11Goz(g, 14, -4, 8, k1, mutlu, 0, k1 > 0.88); }
  as11Agiz(g, 0, 13, 11, acik, false);
  g.setTransform(M0);
  if (a >= 0.9) { const w = smooth(as11Ac(a, 0.9, 1.4)); for (let i = 0; i < 3; i++) { const an = t * 1.2 + i * 2.094, s = 8; g.globalAlpha = w; const M = g.getTransform(); g.translate(x + Math.cos(an) * 54, my + Math.sin(an) * 60); g.rotate(an); g.drawImage(AS11S.yildiz, -s, -s, s * 2, s * 2); g.setTransform(M); } g.globalAlpha = 1; }
}
function as11IcPiril(o, m, a, t) {   // Pırıl'ın yansıması + kocaman çizgili silindir şapka (tepesinde yaylı yıldız)
  const k = o.as, sp0 = k.foto.piril; if (!sp0) return;
  const kik = a >= 0.55 && a < 2.3;
  const sp = kik && k.foto.pirilK ? k.foto.pirilK : sp0, bh = Math.max(20, sp0.y1 - sp0.y0), s = clamp(70 / bh, 0.5, 1.5);
  let bob = Math.sin(t * 2.2) * 3; if (kik) bob -= Math.abs(Math.sin(a * 9)) * 4;
  const cxs = (sp0.x0 + sp0.x1) / 2, cys = (sp0.y0 + sp0.y1) / 2, px = m.x - cxs * s, py = m.y + 24 - cys * s + bob;
  as11FotoCiz(g, sp, px, py, s, s);
  if (a < 0) return;
  let hs = 1, hy = 0, hsy = 1, hr = 0, yay = 0;
  if (a < 0.45) { const u = a / 0.45; hs = as11Yay(u); hy = -(1 - smooth(u)) * 60; }
  else if (a < 1.6) { hsy = 1 + 0.65 * as11Yay(as11Ac(a, 0.5, 1.4)); hr = Math.sin(a * 11) * 0.06 * (1 - as11Ac(a, 0.5, 1.6)); }
  else if (a < 2.6) { hsy = 1.65; const u = as11Ac(a, 1.7, 2.5); hr = -Math.sin(u * Math.PI) * 0.5; hy = -Math.sin(u * Math.PI) * 12; yay = Math.sin(u * Math.PI); }
  else { hsy = 1.6 + 0.06 * Math.sin(t * 2); hr = Math.sin(t * 1.3) * 0.08; if ((t % 4.4) < 0.8) { const u = (t % 4.4) / 0.8; hr -= Math.sin(u * Math.PI) * 0.3; hy = -Math.sin(u * Math.PI) * 8; } }
  const hx = px + sp0.ux * s, hyy = py + sp0.y0 * s + 8 + hy, sap = AS11S.sapka, hsc = 0.62 * hs, M = g.getTransform();
  g.translate(hx, hyy); g.rotate(-0.12 + hr); g.scale(hsc, hsc * hsy);
  g.drawImage(sap, -sap.ox, -sap.oy, sap.bw, sap.bh);
  // yaylı yıldız (şapkanın tepesinden)
  const L = 14 + yay * 16 + Math.sin(t * 5) * 2, ty = -72; g.scale(1, 1 / hsy);
  g.strokeStyle = '#ffd27a'; g.lineWidth = 2.4; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, ty * hsy);
  for (let i = 1; i <= 8; i++) g.lineTo((i % 2 ? 5 : -5) * (i < 8 ? 1 : 0), ty * hsy - L * i / 8);
  g.stroke();
  const ys = 9 + yay * 3; g.translate(Math.sin(t * 4) * 2, ty * hsy - L); g.rotate(Math.sin(t * 3) * 0.3); g.drawImage(AS11S.yildiz, -ys, -ys, ys * 2, ys * 2);
  g.setTransform(M);
}
function as11IcFeza(o, m, a, t) {   // lunapark aynası: Feza'nın yansıması upuzun, sonra yassı tombul, jöle gibi dalgalı
  const k = o.as, sp = k.foto.feza; if (!sp) return;
  const bh = Math.max(20, sp.y1 - sp.y0), s = clamp(74 / bh, 0.5, 1.6);
  let sx = 1, sy = 1, amp = 1.5;
  if (a >= 0 && a < AS11_ANIM) {
    if (a < 1.1) { const e = as11Yay(a / 1.1); sx = 1 - 0.38 * e; sy = 1 + 0.72 * e; amp = 3; }
    else if (a < 2.2) { const e = as11Yay((a - 1.1) / 1.1); sx = lerp(0.62, 1.6, e); sy = lerp(1.72, 0.62, e); amp = 4; }
    else { const u = (a - 2.2) / 1.2, d = Math.exp(-u * 3) * Math.cos(u * 14); sx = 1 + 0.6 * d; sy = 1 - 0.38 * d; amp = 3; }
  } else if (a >= AS11_ANIM) { const w = Math.sin(t * 1.6); sx = 1 - 0.14 * w; sy = 1 + 0.2 * w; amp = 2.5; }
  // dalgalı dilimler (lunapark camı)
  const N = 12, fx = m.x - ((sp.x0 + sp.x1) / 2) * s * sx, fy = m.y + 60, ih = sp.cv.height / N;
  for (let i = 0; i < N; i++) {
    const v = (i + 0.5) / N, off = Math.sin(v * 7 + t * 5) * amp, yy = fy + (-sp.oy + i * sp.h / N) * s * sy;
    g.drawImage(sp.cv, 0, i * ih, sp.cv.width, ih, fx - sp.ox * s * sx + off, yy, sp.w * s * sx, sp.h / N * s * sy + 0.8);
  }
  // camın lunapark dalgaları
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2;
  for (let j = 0; j < 3; j++) { g.beginPath(); for (let i = 0; i <= 12; i++) { const yy = m.y - AS11_RY + i * AS11_RY * 2 / 12, xx = m.x - 34 + j * 34 + Math.sin(yy * 0.08 + t * 3 + j) * 6; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
}
function as11CizOn(o, tm) {
  const k = o.as; if (!AS11S.hazir || o.x + 760 < cam.x || o.x - 760 > cam.x + VW) return;
  if (k.aktif && P.ucus === o) {
    if (typeof fezaCizPoz === 'function') as11Dis(k, 'fezaG', () => fezaCizPoz(g, P.x, P.y, 1, as11FezaPoz(k), tm, null, AS11_FZ_OPT));
    if (typeof pirilCizPoz === 'function') { const pr = k.pr; as11Dis(k, 'pirilG', () => { g.translate(pr.x, pr.y); if (pr.f < 0) g.scale(-1, 1); pirilCizPoz(g, 0, 0, 1, as11PirilPoz(k), tm); }); }
  }
  as11TozCiz(g);
  if (AS11_EK > 0.01) { const z = cam.zoom || 1, W = VW / z, H = VH / z; g.globalCompositeOperation = 'lighter'; as11Glow(g, '#cfe6ff', cam.x + W / 2, cam.y + H * 0.42, W * 0.8, H * 0.75, AS11_EK * 0.15); g.globalCompositeOperation = 'source-over'; }   // kısa ekran parıltısı
}

// ── girdi: parmak buğuyu siler (sürükleme), dokunuş/basılı tutma kendi siler; pencere yakalama evresi (yürüme parmağına gitmez) ──
function as11Dunya(e) { const r = cv.getBoundingClientRect(); return { x: cam.x + (e.clientX - r.left) * DPR / S, y: cam.y + (e.clientY - r.top) * DPR / S }; }
function as11Sahip(e) { e.preventDefault && e.preventDefault(); e.stopPropagation && e.stopPropagation(); }
function as11AynaAl(o, p) {   // dokunulan ayna (cömert pay: ≥ 34 CSS px); önce buğulu olanlar
  const k = o.as, pay = Math.max(16, 34 * DPR / Math.max(S, 0.001)); let en = -1, ed = 1e9;
  for (const m of k.ay) { if (!as11Icinde(m, p.x, p.y, pay)) continue; const d = Math.hypot(m.x - p.x, m.y - p.y) + (m.bulundu ? 400 : 0); if (d < ed) { ed = d; en = m.i; } }
  return en;
}
function as11Dokun(o, p) {
  const k = o.as;
  if (k.faz === 'oyun') {
    const i = as11AynaAl(o, p);
    if (i >= 0) { const m = k.ay[i]; k.dok.i = i;
      if (!m.bulundu) { if (!as11SilYol(o, p.x, p.y, p.x, p.y)) as11SilYol(o, m.x + (p.x - m.x) * 0.6, m.y + (p.y - m.y) * 0.6, m.x + (p.x - m.x) * 0.6, m.y + (p.y - m.y) * 0.6); }
      else if (m.at > 2.4) { m.at = 0; as11Sfx('aynaKikir', 0.5); as11IsikSac(m.x, m.y, 8, 80, AS11_ISIK); }   // bulunmuş aynaya dokunuş: gösteri yeniden
      return; }
  }
  const vx = o.x + AS11_VX;
  if (Math.abs(p.x - vx) < 46 && p.y > o.y - 100 && p.y < o.y + 10) { if (k.vpT <= 0.3) { as11VelaPoz(k, 'kikir', 1.1); as11Sfx('aynaKikir', 0.6); } as11IsikSac(p.x, p.y, 8, 70, ['#ffb3d1', '#ffe7a8', '#ffffff']); return; }
  if (Math.abs(p.x - o.x) < k.bw && p.y > o.y + AS11_BY1 && p.y < o.y + AS11_BY0) { if (k.tacDon <= 0) { k.tacDon = 1.1; as11Sfx('aynaKikir', 0.4); } as11IsikSac(p.x, p.y, 6, 60, AS11_ISIK); return; }
  as11IsikSac(p.x, p.y, 5, 50, ['#ffffff', '#cfe6ff', '#c39bff']);   // boşluğa dokunuş: minik parıltı
}
addEventListener('pointerdown', e => {
  const o = SALON11.aktif; if (!o || DURUM !== 'oyun' || !(e.target === cv || e.pointerId === SALON11.ptr) || e.pointerType === 'mouse' && e.button !== 0) return;
  as11Sahip(e); const k = o.as; if (SALON11.ptr >= 0) return;   // ikinci parmak etkin parmağı değiştirmez
  const p = as11Dunya(e); SALON11.ptr = e.pointerId; SALON11.klavye = false;
  try { cv.setPointerCapture(e.pointerId); } catch (_) {}
  as11Kullanici(o);
  const d = k.dok; d.x0 = d.x = p.x; d.y0 = d.y = p.y; d.t = now; d.yol = 0; d.i = -1; d.oto = false; k.silYol = 0;
  as11Dokun(o, p);
}, true);
addEventListener('pointermove', e => {
  const o = SALON11.aktif; if (!o || e.pointerId !== SALON11.ptr) return;
  as11Sahip(e); const k = o.as, d = k.dok; if (k.faz !== 'oyun') return;
  const L = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : null, n = L && L.length ? L.length : 1;
  for (let j = 0; j < n; j++) {
    const p = as11Dunya(L && L.length ? L[j] : e); if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) continue;
    const dd = Math.hypot(p.x - d.x, p.y - d.y); if (dd < 0.5) continue;
    d.yol += dd; as11SilYol(o, d.x, d.y, p.x, p.y); d.x = p.x; d.y = p.y;
    if (d.i < 0) d.i = as11AynaAl(o, p);
  }
  k.idle = 0;
}, true);
function as11BirakE(e) {
  const o = SALON11.aktif; if (!o || e.pointerId !== SALON11.ptr) return;
  as11Sahip(e); const k = o.as, d = k.dok;
  if (e.type === 'pointerup' && k.faz === 'oyun' && d.i >= 0 && !d.oto && d.yol < 12 * DPR / Math.max(S, 0.001) && now - d.t < 0.6) as11OtoBasla(o, k.ay[d.i], 'oto');   // dokunup bırakma: kendi siler
  as11GirdiBirak();   // pointercancel: ilerleme korunur (yalnız parmak bırakılır)
}
addEventListener('pointerup', as11BirakE, true); addEventListener('pointercancel', as11BirakE, true);
cv.addEventListener('lostpointercapture', e => { if (e.pointerId === SALON11.ptr) as11GirdiBirak(); });
addEventListener('blur', () => { if (SALON11.ptr >= 0) as11GirdiBirak(); });
addEventListener('pagehide', () => { if (SALON11.ptr >= 0) as11GirdiBirak(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && SALON11.ptr >= 0) as11GirdiBirak(); });
addEventListener('keydown', e => {
  const o = SALON11.aktif; if (!o || DURUM !== 'oyun' || e.target && /^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName)) return;
  if (!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) return;
  as11Sahip(e); const k = o.as; as11Kullanici(o);
  if (k.faz !== 'oyun') return;
  const kalan = AS11_SIRA.filter(i => !k.ay[i].bulundu); if (!kalan.length) return;
  if (/^(ArrowLeft|ArrowRight|ArrowUp|ArrowDown|KeyW|KeyA|KeyS|KeyD)$/.test(e.code)) {
    const ileri = e.code === 'ArrowRight' || e.code === 'ArrowDown' || e.code === 'KeyD' || e.code === 'KeyS';
    if (!SALON11.klavye || k.ay[k.secK].bulundu) k.secK = kalan[0];
    else { const j = kalan.indexOf(k.secK); k.secK = kalan[(j + (ileri ? 1 : kalan.length - 1)) % kalan.length]; }
    SALON11.klavye = true;
  } else if (!e.repeat) as11OtoBasla(o, k.ay[SALON11.klavye && !k.ay[k.secK].bulundu ? k.secK : kalan[0]], 'oto');
}, true);
OLAY.on('konusma', e => { const o = SALON11.o; if (o && o.as && e && typeof e.anahtar === 'string' && /^vk_/.test(e.anahtar)) o.as.konus = clamp(+e.sure || 2, 0.5, 6); });   // Vela konuşuyor: ağzı oynar
OLAY.on('durum', d => { if (d === 'oyun') return; const o = SALON11.aktif; if (o && d !== 'mola' && d !== 'duraklat') as11Birak(o, false); as11GirdiBirak(); });

TUR.kaydet('aynaSalonMini', {
  kur(o) {
    o.done = false; o.tk = { bitti: false };
    o.as = { aktif: false, faz: 'bekle', fT: 0, t: 0, n: 0, lay: -1, bw: AS11_BB[0], idle: 0, helpOn: false, helpT: 0, helpN: 0, helpI: 0, secK: 0,
      ay: AS11_AD.map((ad, i) => ({ i, ad, x: o.x, y: o.y, sis: null, sq: null, grid: new Uint8Array(AS11_GX * AS11_GY), sil: 0, sonSil: 0, bulundu: false, fogA: 1, at: -1, oto: null, ipucu: false, parla: 0, elde: false })),
      entry: { x: o.x + AS11_FX, y: o.y, safeX: o.x + AS11_FX, safeY: o.y, f: 1 }, gx0: 0, gy0: 0, gT: 1, gSure: 0.4, pr: { x: o.x - 300, y: o.y - 130, f: 1 },
      sevT: 0, vp: 'dur', vpT: 0, konus: 0, tacDon: 0, sonBek: 0, basladi: false, kameraFn: null, sesT: 0, silYol: 0,
      dok: { x0: 0, y0: 0, x: 0, y: 0, t: 0, yol: 0, i: -1, oto: false }, foto: { hazir: false, feza: null, piril: null, pirilK: null }, son: { t: 0 }, hata: {} };
    o.as.kameraFn = typeof omDkEkle === 'function' ? () => { const b = as11Kutu(o); omDkEkle(b.x0, b.y0, b.x1, b.y1); } : null;
    o.adim = dt => as11Adim(o, dt);
    SALON11.o = o;
  },
  guncelle: as11Guncelle, ciz: as11Ciz, cizOn: as11CizOn,
  testBitir(o) {   // başsız deneme: oyunu anında bitirir (aynalar bulunmuş sayılır)
    const k = o.as; if (o.done) return;
    if (!k.basladi) { k.basladi = true; OLAY.emit('salonBasla', { o }); }
    if (k.aktif) as11Birak(o, true); else as11Tamam(o);
  }
});
