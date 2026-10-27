/* botanik12.js — Bölüm 12 (Annemle Sabancı'da Bir Gün), 2. tur: botanik bahçesi ve kaplumbağa göleti. Sözleşme: src/BOLUM12.md 'Tur 2'.
   Tür k12Botanik (bolum12.js: sütun 630, x0 = 560, x1 = 700). Feza ahşap iskeleden (ONPLAN, 604–658) geçerken her şey çevresinde olur;
   HİÇBİR ŞEY onu durdurmaz: P.ucus yok, P.kilit yok, panel yok, ışınlanma yok, çarpışma yok.
   Oyun düzleminde, yolun ARKASINDA küçük bir kaplumbağa göleti (sütun 612–652, su y 650..707):
     · Solda taşlardan küçük bir şelale (dokununca coşar), arka kenarda taş sırası, papirüs, eğrelti, fil kulağı yaprakları, ortanca.
     · Taşlarda güneşlenen yedi kaplumbağa: anne + iki yavru (büyük taş), dede (arka taş), kütüğün üstünde iki kardeş, bir yüzücü.
       Feza yaklaşınca sırayla başlarını uzatıp ona bakarlar (gözleri onu izler), uzaklaşınca yine güneşlenir, gözlerini yumarlar.
       Dokununca: kafasını kabuğuna çekip "pop" diye çıkarır · ya da suya kayıp yüzer ve geri tırmanır · ya da yavrular annenin
       sırtına tırmanır (kule! iki ya da üç kat). Dokunulmazsa da kendiliğinden: Feza ortaya gelince yavru annesine tırmanır,
       kütükteki kardeşlerden biri suya kayar, yüzücü Feza'nın yanına gelip başını kaldırır.
     · Nilüferler (Feza yaklaşınca / dokununca açılır), su halkaları, ışıltı.
   İskelenin arka kenarında bir kaplumbağa Feza'ya eşlik etmeye çalışır: minicik ağır adımlarla peşinden gider, geride kalınca oturup
   "pöf" der ve el sallar; Feza beklerse yetişip sevinçle hoplar.
   Anne, Feza göletin yanına gelince ona kaplumbağaları gösterir (ANNE12.kisaPoz 'isaret'; anne devralınmaz, takip bozulmaz).
   3. tur (ebeveyn: "havuzda kırmızı balıklar ve kurbağalar olabilir"):
     · Beş kırmızı/turuncu Japon balığı (göletin solu, şelalenin sağı 24736–24900): su altında yarı saydam yüzer, kuyruk sallar,
       ara sıra yüzeye çıkıp ağız açar (kabarcık + halka). Feza kenara gelince önüne toplanır, biri zıplayıp suya geri düşer;
       balığa dokununca o zıplar, yanlarındaki suya dokununca toplanırlar (yürümeyi engellemez).
     · Üç yeşil kurbağa (göletin sağı, kendi çiçeksiz nilüfer yaprakları): boğaz kesesini şişirip "vırak" der, Feza geçerken ve
       dokununca yapraktan yaprağa yay çizerek zıplar (konunca yaprak sallanır, halka). Meraklı olanı Feza'nın yanına, iskelenin
       kenarına zıplar ve ona bakar, sonra yaprağına döner. Dil fırlatma / böcek yok.
     · Olaylar: k12SazanOp (ağız açma) · k12BalikZipla · k12Sicrama · k12KurbagaVirak {x, n} · k12KurbagaZipla {x, kiyi}
       (son ikisi SES'e istek: b12/istek/BOTANIK_SES.md; tanımlı değilse sessiz geçer).
   İskelenin altından geçen su kolu (616–648, y 750+): ONPLAN zeminden önce bt12OnSuCiz(tm) çağırırsa çizilir (çağırmazsa hiç).
   Olaylar (ses MUZIK'te): k12KaplumbagaBak {x, n} · k12KaplumbagaDokun {x, y} · k12KaplumbagaKafa {x, y} · k12KaplumbagaPop {x, y, faz}
     · k12KaplumbagaDal {x, y} · k12KaplumbagaYuz {x} · k12KaplumbagaCik {x, y} · k12KaplumbagaKule {x, y, n} · k12KaplumbagaYuru {x}
     · k12KaplumbagaAdim {x} · k12KaplumbagaYoruldu {x} · k12Selale {x, guc} · k12BotNilufer {x} · k12BotSuDokun {x} · k12AnneGoster {x}.
   Dokunma: pencerede yakalama evresinde tek 'pointerdown'; yalnız kendi canlımıza/şelaleye/nilüfere isabet ederse
   preventDefault + stopPropagation (suya dokunuş yalnız halka yapar, Feza'nın yürümesini engellemez).
   Performans: arka bitkiler + taş kenar + su gövdesi iki önbellek döşemesinde (bölgeye yaklaşırken karede bir parça kurulur);
   kabuklar, taşlar, kütük, nilüfer yaprakları önbellek tuvallerinde. Karede gradyan yok, yeni dizi/nesne yok (havuzlar sabit).
   Yalnız BOLUM_NO === 12 iken çalışır. Test kancası: BOTANIK12. */
'use strict';
(() => {
if (typeof BOLUM_NO === 'undefined' || BOLUM_NO !== 12) return;

// ════════════════════════ Yerleşim (dünya birimi; T = 40) ════════════════════════
const BT_PI2 = Math.PI * 2;
const BT_GOL = { x0: 612 * T, x1: 652 * T, ust: 650, alt: 707 };   // gölet suyu (arka kenarı dalgalı, önü iskelenin arkasına girer)
const BT_STATIK = { x0: 24400, x1: 26160, y0: 560, y1: 712, dosemeW: 880 };   // önbellekli arka katmanın kapsadığı alan
const BT_SELALE = { x: 24585, ust: 618, alt: 676, dibX: 24600 };   // şelalenin ağzı ve dibi (solda kaya yığını 24480..24700)
const BT_TAS1 = { x: 24930, y: 701, w: 214, ust: 673 };   // anne ve yavruların büyük yassı taşı
const BT_TAS2 = { x: 25290, y: 688, w: 150, ust: 665 };   // dedenin arka taşı
const BT_KUTUK = { x0: 25500, x1: 25810, y: 692, r: 13 };  // kütük (üstü y 679)
const BT_YUZ = { cx: 25330, cy: 684, rx: 360, ry: 15 };   // yüzücünün dolandığı elips (önde y 699, arkada 669)
const BT_ISKELE = { x0: 604 * T + 30, x1: 658 * T - 30, y: 713 };   // eşlikçinin yürüdüğü iskelenin arka kenarı
const BT_ONSU = { x0: 616 * T, x1: 648 * T, y: 750 };      // iskelenin altından geçen su kolu (ONPLAN kancası)
const BT_GOSTER = 616 * T;                                // anne kaplumbağaları burada gösterir
// Nilüferler: [x, y, ölçek, çiçek rengi 0 pembe / 1 beyaz / -1 çiçeksiz]
const BT_NILUFER = [[24760, 701, 1, 0], [24840, 665, .8, -1], [25120, 703, 1.05, 1], [25190, 668, .78, 0], [25450, 702, .95, -1],
  [25880, 700, 1.1, 0], [25960, 668, .82, 1], [26010, 699, .9, -1],
  [25832, 684, .92, -1], [25928, 690, .86, -1], [26046, 680, .8, -1]];   // son üçü kurbağaların zıpladığı yapraklar
const BT_ONSU_NILUFER = [[24800, 772, 1.1, 0], [25260, 786, 1.25, -1], [25640, 768, 1, 1]];

// Kabuk renkleri (Avrupa tatlısu ve Hazar kaplumbağalarından esinli; sevimli, açık tonlar)
const BT_RENK = [
  { k: '#5f9a57', kk: '#3f7342', s: '#80b96b', c: '#3a6a3c', r: '#e6cf7c', rk: '#b79b4c', d: '#f3df7e', ten: '#8fbf6e', tk: '#5f914f', ser: '#f0dd72' },  // anne: zeytin yeşili, altın benekli
  { k: '#8fca6a', kk: '#65a04c', s: '#b4e08c', c: '#5d9446', r: '#f2e08e', rk: '#c8ae5a', d: '#fff2a4', ten: '#a6d47e', tk: '#73a457', ser: '#fff0a0' },  // yavru: açık fıstık yeşili
  { k: '#9a7a4c', kk: '#6f5432', s: '#c09a62', c: '#5e4528', r: '#ead08e', rk: '#b6964e', d: '#f4d88c', ten: '#93b673', tk: '#64884e', ser: '#ecd070' },  // dede: kehribar kahve
  { k: '#4f927a', kk: '#336955', s: '#74b79a', c: '#2f5d4b', r: '#e2d28a', rk: '#ad9a52', d: '#cdeec0', ten: '#86bd7d', tk: '#578f54', ser: '#f1e27a' },  // kardeş: deniz yeşili
  { k: '#b2a04e', kk: '#857633', s: '#d6c673', c: '#6c5f28', r: '#f0dc94', rk: '#bfa455', d: '#fff3b0', ten: '#9cc777', tk: '#6d9a50', ser: '#f6e47c' }   // kardeş: altın sarısı
];

// ════════════════════════ Modül durumu ════════════════════════
const BT = {
  o: null, saat: 0, K: 0, hazir: false, kuyruk: 0,
  doseme: [null, null], spr: Object.create(null),
  kp: [], yuzucu: null, yurur: null, aile: null,
  nil: [], onNil: [], halka: [], kabarcik: [],
  selaleCos: 0, onSuKare: -1, fezaVx: 0, sonPX: NaN, yakin: false, bakSay: 0,
  goster: false, otoKule: false, otoDal: false, kule: 0, kuleT: 0,
  sira: [], siraN: 0,
  balik: [], kurb: [], kPed: [], balikTop: 0, topX: 0, topY: 0, ziplaT: -1, balikGeldi: false, otoZiplaT: 9, kurbKiyi: false
};
for (let i = 0; i < 24; i++) BT.halka.push({ on: false, x: 0, y: 0, r: 0, t: 0, sure: 1, a: 1 });
for (let i = 0; i < 18; i++) BT.kabarcik.push({ on: false, x: 0, y: 0, t: 0, r: 1 });
for (let i = 0; i < 12; i++) BT.sira.push({ y: 0, tur: 0, ref: null });

function btHash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function btOlay(ad, v) { if (typeof OLAY !== 'undefined' && OLAY && OLAY.emit) { try { OLAY.emit(ad, v); } catch (e) { /* yut */ } } }
function btEkranda(x, pay) { return typeof cam === 'undefined' || (x > cam.x - pay && x < cam.x + VW + pay); }
function btYaklas(v, h, k) { return v + (h - v) * (1 - Math.exp(-k)); }   // k = hız × dt
function btDerin(y) { return 1 - (BT_GOL.alt - y) * 0.0042; }               // göletin gerisi biraz küçük görünür
function btDunya() { g.setTransform(S, 0, 0, S, -cam.x * S, -cam.y * S); }

// yerel koordinatlı önbellek tuvali: (x0, y0) sol üst köşe, w × h dünya birimi, res piksel / birim
function btTuval(x0, y0, w, h, res) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w * res)); c.height = Math.max(1, Math.ceil(h * res));
  const q = c.getContext('2d'); q.scale(res, res); q.translate(-x0, -y0); q.lineCap = 'round'; q.lineJoin = 'round';
  c.x0 = x0; c.y0 = y0; c.w = w; c.h = h;
  return { c, q };
}
function btKoy(c, spr) { c.drawImage(spr, spr.x0, spr.y0, spr.w, spr.h); }
function btEl(q, x, y, rx, ry, rot, renk) { q.fillStyle = renk; q.beginPath(); q.ellipse(x, y, Math.max(.1, rx), Math.max(.1, ry), rot, 0, BT_PI2); q.fill(); }
function btKalp(c, x, y, r) {
  c.beginPath(); c.moveTo(x, y + r * .9);
  c.bezierCurveTo(x - r * 1.6, y - r * .2, x - r * .8, y - r * 1.5, x, y - r * .55);
  c.bezierCurveTo(x + r * .8, y - r * 1.5, x + r * 1.6, y - r * .2, x, y + r * .9); c.fill();
}
function btHalka(x, y, r, sure, a) {   // su halkası; havuz doluysa en eskisinin yerine
  let h = null, en = null;
  for (const q of BT.halka) { if (!q.on) { h = q; break; } if (!en || q.t / q.sure > en.t / en.sure) en = q; }
  h = h || en; h.on = true; h.x = x; h.y = y; h.r = r; h.t = 0; h.sure = sure; h.a = a;
}
function btKabarcik(x, y) {
  for (const q of BT.kabarcik) if (!q.on) { q.on = true; q.x = x; q.y = y; q.t = 0; q.r = 1 + Math.random() * 1.4; return; }
}
function btSicrat(x, y, n, guc) { if (typeof burst === 'function') burst(x, y, n, ['#ffffff', '#dff4ff', '#bfe6f7'], 50 + 50 * guc, .5, 3.5); }
function btYildiz(x, y) { if (typeof burst === 'function') burst(x, y, 6, ['#fff6b0', '#ffffff', '#ffd6e6'], 55, .6, 4); }

// ════════════════════════ Önbellek: kabuk, taş, kütük, nilüfer ════════════════════════
// Kabuk referans boyu: yarı uzunluk 20 (a = 20), kubbe yüksekliği 19, alt kenarı y = 0. Sağa bakar.
function btKabukYol(q) {
  q.beginPath();
  q.moveTo(-20.5, 0);
  q.quadraticCurveTo(-21.5, -9.5, -13, -15.6);
  q.quadraticCurveTo(-1, -22.2, 11.5, -16.2);
  q.quadraticCurveTo(21.2, -10.5, 20.6, 0);
  q.quadraticCurveTo(0, 2.4, -20.5, 0);
  q.closePath();
}
function btKabukSpr(v, res) {
  const p = BT_RENK[v], t = btTuval(-23, -24, 46, 28, res), q = t.q;
  btKabukYol(q); q.fillStyle = p.k; q.fill();
  q.save(); btKabukYol(q); q.clip();
  const gr = q.createLinearGradient(0, -22, 0, 1);
  gr.addColorStop(0, 'rgba(255,255,230,.30)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(20,40,20,.28)');
  q.fillStyle = gr; q.fillRect(-22, -23, 44, 25);
  // pullar: üst sıra (sırt) üç altıgen, yan sıra dört pul; her pulun ortası kabarık (açık renk) ve benekli
  const pul = (cx, cy, w, h) => {
    q.fillStyle = p.s; q.beginPath();
    q.moveTo(cx - w * .5, cy); q.lineTo(cx - w * .3, cy - h * .5); q.lineTo(cx + w * .3, cy - h * .5);
    q.lineTo(cx + w * .5, cy); q.lineTo(cx + w * .3, cy + h * .5); q.lineTo(cx - w * .3, cy + h * .5); q.closePath();
    q.globalAlpha = .55; q.fill(); q.globalAlpha = 1;
    q.strokeStyle = p.c; q.lineWidth = .8; q.stroke();
    btEl(q, cx - w * .06, cy - h * .12, w * .2, h * .16, 0, 'rgba(255,255,240,.35)');
    q.fillStyle = p.d;
    for (let i = 0; i < 3; i++) { const a = i * 2.1 + cx; q.beginPath(); q.arc(cx + Math.cos(a) * w * .22, cy + Math.sin(a) * h * .22, .55, 0, BT_PI2); q.fill(); }
  };
  pul(-9.5, -15.2, 9, 6.2); pul(0, -17.6, 9.4, 6.4); pul(9.5, -15.4, 9, 6.2);
  pul(-15, -7.6, 8, 6.8); pul(-5.2, -9.2, 9.6, 7); pul(5.2, -9.4, 9.6, 7); pul(15, -7.8, 8, 6.8);
  // kenar pulları (alt bant)
  q.fillStyle = p.r; q.beginPath(); q.moveTo(-21.5, -3.2); q.quadraticCurveTo(0, -1.2, 21.5, -3.2); q.lineTo(21.5, 2); q.lineTo(-21.5, 2); q.closePath(); q.fill();
  q.strokeStyle = p.rk; q.lineWidth = .7;
  for (let x = -18; x <= 18; x += 4) { q.beginPath(); q.moveTo(x, -2.4 + Math.abs(x) * .04); q.lineTo(x + .6, 1); q.stroke(); }
  q.strokeStyle = p.rk; q.lineWidth = .8; q.beginPath(); q.moveTo(-21.5, -3.2); q.quadraticCurveTo(0, -1.2, 21.5, -3.2); q.stroke();
  q.globalAlpha = .34; btEl(q, -4, -16.4, 9.5, 2.6, -.12, '#ffffff'); q.globalAlpha = 1;
  q.restore();
  btKabukYol(q); q.strokeStyle = p.kk; q.lineWidth = 1; q.stroke();
  return t.c;
}
// Yassı taş (yandan; suya gömülü alt kısmı su rengiyle kararır). (0,0) taşın su çizgisi ortası.
function btTasSpr(w, h, res, tohum) {
  const t = btTuval(-w / 2 - 4, -h - 4, w + 8, h + 12, res), q = t.q;
  const yol = () => {
    // yuvarlak omuzlu, üstü geniş ve hafif tümsek bir kaya (kaplumbağalar üstünde rahat otursun)
    q.beginPath(); q.moveTo(-w / 2, 3);
    q.bezierCurveTo(-w / 2 - 3, -h * .55, -w * .44, -h * .98, -w * .3, -h * .98);
    q.quadraticCurveTo(-w * .05, -h * 1.1, w * .14, -h * 1.02);
    q.quadraticCurveTo(w * .36, -h * .96, w * .42, -h * .8);
    q.bezierCurveTo(w / 2 + 2, -h * .5, w / 2 + 2, -h * .1, w / 2, 3);
    q.quadraticCurveTo(0, 7, -w / 2, 3); q.closePath();
  };
  yol(); q.fillStyle = '#ab9f88'; q.fill();
  q.save(); yol(); q.clip();
  const gr = q.createLinearGradient(0, -h, 0, 4);
  gr.addColorStop(0, '#e6dcc4'); gr.addColorStop(.3, '#c7b99c'); gr.addColorStop(.75, '#9a8d76'); gr.addColorStop(1, '#6f665a');
  q.fillStyle = gr; q.fillRect(-w / 2 - 4, -h - 4, w + 8, h + 12);
  // yosun lekeleri ve taş damarları
  for (let i = 0; i < 7; i++) {
    const u = btHash(tohum + i * 3.1), v = btHash(tohum + i * 7.7);
    btEl(q, -w * .42 + u * w * .84, -h * .25 - v * h * .3, 4 + v * 7, 2 + u * 2, 0, 'rgba(110,150,80,.32)');
  }
  q.strokeStyle = 'rgba(90,82,70,.35)'; q.lineWidth = .9;
  q.beginPath(); q.moveTo(-w * .2, -h * .9); q.quadraticCurveTo(-w * .1, -h * .5, -w * .18, -h * .1); q.stroke();
  q.beginPath(); q.moveTo(w * .22, -h * .8); q.quadraticCurveTo(w * .3, -h * .4, w * .24, 0); q.stroke();
  btEl(q, -w * .12, -h * .86, w * .3, h * .14, -.04, 'rgba(255,255,245,.45)');   // güneşli üst yüz
  btEl(q, w * .3, -h * .35, w * .2, h * .4, 0, 'rgba(70,60,48,.22)');            // sağ yanda gölge
  btEl(q, -w * .36, -h * .4, w * .08, h * .25, .3, 'rgba(255,255,240,.25)');     // sol yanda ışık
  q.fillStyle = 'rgba(40,90,110,.42)'; q.fillRect(-w / 2 - 4, -3, w + 8, 12);    // su altındaki kısım
  q.restore();
  yol(); q.strokeStyle = 'rgba(92,80,64,.55)'; q.lineWidth = 1.3; q.stroke();      // yumuşak kontur
  // üstte birkaç yuvarlak tümsek (çakıl gibi), kayanın taş olduğu okunsun
  for (let i = 0; i < 4; i++) {
    const u = btHash(tohum * 3 + i), bx = -w * .38 + i * w * .25 + u * 10, by = -h * (.72 + .12 * btHash(tohum + i * 2));
    btEl(q, bx, by, 9 + u * 6, 4 + u * 2, 0, 'rgba(120,106,86,.25)');
    btEl(q, bx - 2, by - 1.6, 6 + u * 4, 1.8, 0, 'rgba(255,250,235,.3)');
  }
  q.strokeStyle = 'rgba(232,248,255,.75)'; q.lineWidth = 1.2;                    // su çizgisi parıltısı
  q.beginPath(); q.moveTo(-w / 2 + 2, -2.6); q.quadraticCurveTo(0, -1, w / 2 - 2, -2.6); q.stroke();
  return t.c;
}
// Kütük: yatay, yosunlu, sağ ucunda yıllık halkalar, kırık dal. (0,0) kütüğün ekseni (sol uç), boy L.
function btKutukSpr(L, r, res) {
  const t = btTuval(-6, -r - 12, L + 14, r * 2 + 18, res), q = t.q;
  q.fillStyle = '#8a6440'; q.beginPath(); q.moveTo(0, -r); q.lineTo(L, -r); q.ellipse(L, 0, r * .5, r, 0, -Math.PI / 2, Math.PI / 2); q.lineTo(0, r);
  q.ellipse(0, 0, r * .5, r, 0, Math.PI / 2, Math.PI * 1.5); q.closePath(); q.fill();
  const gr = q.createLinearGradient(0, -r, 0, r);
  gr.addColorStop(0, 'rgba(255,232,196,.55)'); gr.addColorStop(.25, 'rgba(255,240,210,.18)'); gr.addColorStop(.55, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(40,24,10,.55)');
  q.fillStyle = gr; q.fillRect(-4, -r, L + 4, r * 2);
  q.strokeStyle = 'rgba(70,46,24,.5)'; q.lineWidth = .9;   // kabuk çizgileri
  for (let i = 0; i < 9; i++) { const x = 12 + i * (L - 24) / 8; q.beginPath(); q.moveTo(x, -r * .7); q.quadraticCurveTo(x + 8, 0, x + 2, r * .6); q.stroke(); }
  for (let i = 0; i < 6; i++) btEl(q, 20 + i * (L - 40) / 5, -r * .82, 10, 2.4, 0, 'rgba(120,170,80,.75)');   // yosun
  // kırık dal ve iki yaprak
  q.strokeStyle = '#7a5636'; q.lineWidth = 3.4; q.beginPath(); q.moveTo(L * .3, -r * .6); q.quadraticCurveTo(L * .3 - 4, -r - 6, L * .3 - 10, -r - 9); q.stroke();
  btEl(q, L * .3 - 12, -r - 9.5, 4, 2, -.5, '#6fb15a'); btEl(q, L * .3 - 7, -r - 11, 3.4, 1.8, .4, '#86c46a');
  // sağ uç: yıllık halkalar
  btEl(q, L, 0, r * .5, r, 0, '#d9b384');
  q.strokeStyle = '#a5784a'; q.lineWidth = .7;
  for (let k = 1; k <= 3; k++) { q.beginPath(); q.ellipse(L, 0, r * .5 * k / 4, r * k / 4, 0, 0, BT_PI2); q.stroke(); }
  q.fillStyle = 'rgba(40,90,110,.42)'; q.fillRect(-6, r * .55, L + 12, r);   // suya gömülü alt
  q.strokeStyle = 'rgba(232,248,255,.7)'; q.lineWidth = 1.1; q.beginPath(); q.moveTo(-2, r * .55); q.lineTo(L + 2, r * .55); q.stroke();
  return t.c;
}
function btNiluferSpr(res) {   // nilüfer yaprağı (yandan basık elips, çentikli, damarlı)
  const t = btTuval(-26, -9, 52, 18, res), q = t.q;
  q.beginPath(); q.moveTo(0, 0); q.ellipse(0, 0, 23, 7, 0, .32, Math.PI * 2 - .05); q.closePath();
  q.fillStyle = '#5fae5c'; q.fill(); q.strokeStyle = '#3f8a45'; q.lineWidth = 1.1; q.stroke();
  q.strokeStyle = 'rgba(200,240,170,.55)'; q.lineWidth = .7;
  for (let a = .6; a < 6.1; a += .62) { q.beginPath(); q.moveTo(0, 0); q.lineTo(Math.cos(a) * 19, Math.sin(a) * 5.6); q.stroke(); }
  btEl(q, -6, -2.5, 10, 2.2, 0, 'rgba(255,255,230,.25)');
  return t.c;
}
function btSuSerit(res) {   // ön su kolunun rengi (y 0 → 60); karede gerilerek çizilir
  const c = document.createElement('canvas'); c.width = 2; c.height = 60; const q = c.getContext('2d');
  const gr = q.createLinearGradient(0, 0, 0, 60);
  gr.addColorStop(0, '#2f6f86'); gr.addColorStop(.18, '#4b9cb8'); gr.addColorStop(1, '#6fb8d2');
  q.fillStyle = gr; q.fillRect(0, 0, 2, 60);
  return c;
}

// ════════════════════════ Önbellek: arka katman (bitkiler, taş kenar, su, şelale kayaları) ════════════════════════
function btSuYol(q) {   // göletin su gövdesi (arka kenar dalgalı)
  const { x0, x1, ust, alt } = BT_GOL;
  q.beginPath(); q.moveTo(x0, alt + 2);
  q.bezierCurveTo(x0 - 6, ust + 26, x0 + 20, ust + 4, x0 + 70, ust + 2);
  for (let x = x0 + 70; x < x1 - 70; x += 120) q.quadraticCurveTo(x + 60, ust + (btHash(x) < .5 ? -2 : 3), x + 120, ust + 1);
  q.bezierCurveTo(x1 - 20, ust + 4, x1 + 6, ust + 26, x1, alt + 2);
  q.closePath();
}
function btPapirus(q, x, y, boy, n) {   // papirüs: ince saplar, tepede yıldız gibi püskül
  for (let i = 0; i < n; i++) {
    const a = (i - (n - 1) / 2) * .13 + (btHash(x + i) - .5) * .08, h = boy * (.75 + btHash(x * 1.3 + i) * .3);
    const tx = x + Math.sin(a) * h, ty = y - Math.cos(a) * h;
    q.strokeStyle = '#6ea44e'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(x + (i - n / 2) * 1.5, y); q.quadraticCurveTo(x + Math.sin(a) * h * .5, y - h * .55, tx, ty); q.stroke();
    q.strokeStyle = '#8cc35e'; q.lineWidth = .9;
    for (let k = 0; k < 11; k++) {
      const b = -Math.PI / 2 + (k - 5) * .27 + a;
      q.beginPath(); q.moveTo(tx, ty); q.quadraticCurveTo(tx + Math.cos(b) * 7, ty + Math.sin(b) * 7 - 2, tx + Math.cos(b) * 12, ty + Math.sin(b) * 10 + 3); q.stroke();
    }
  }
}
function btFilKulagi(q, x, y, boy, aci, renk) {   // fil kulağı (alokazya) yaprağı: kalp biçimli, belirgin damarlı
  const ux = x + Math.sin(aci) * boy * .55, uy = y - Math.cos(aci) * boy * .55;
  q.strokeStyle = '#5c8f3e'; q.lineWidth = 2; q.beginPath(); q.moveTo(x, y); q.quadraticCurveTo(x + Math.sin(aci) * boy * .2, y - boy * .3, ux, uy); q.stroke();
  q.save(); q.translate(ux, uy); q.rotate(aci + .5);
  const L = boy * .55, W = boy * .32;
  q.fillStyle = renk; q.beginPath(); q.moveTo(0, 0);
  q.bezierCurveTo(-W, -L * .1, -W * .9, -L * .8, 0, -L); q.bezierCurveTo(W * .9, -L * .8, W, -L * .1, 0, 0); q.fill();
  q.strokeStyle = 'rgba(230,250,200,.6)'; q.lineWidth = .9; q.beginPath(); q.moveTo(0, -2); q.lineTo(0, -L * .95); q.stroke();
  for (let k = 1; k < 5; k++) { const yy = -L * k / 5.2; q.beginPath(); q.moveTo(0, yy); q.quadraticCurveTo(-W * .4, yy - 2, -W * .75, yy - L * .1); q.moveTo(0, yy); q.quadraticCurveTo(W * .4, yy - 2, W * .75, yy - L * .1); q.stroke(); }
  q.globalAlpha = .22; btEl(q, -W * .3, -L * .55, W * .25, L * .25, .2, '#ffffff'); q.globalAlpha = 1;
  q.restore();
}
function btEgrelti(q, x, y, boy, yon) {   // eğrelti: kavisli yaprak sapları, iki yanda küçük yaprakçıklar
  for (let i = 0; i < 5; i++) {
    const a = (i - 2) * .38 * yon + .1 * yon, h = boy * (.8 + btHash(x + i * 9) * .3);
    const ex = x + Math.sin(a) * h, ey = y - Math.cos(a) * h * .75;
    q.strokeStyle = '#4f8f3c'; q.lineWidth = 1.2; q.beginPath(); q.moveTo(x, y); q.quadraticCurveTo(x + Math.sin(a) * h * .4, y - h * .8, ex, ey); q.stroke();
    q.fillStyle = i % 2 ? '#6aae4f' : '#7cbf5c';
    for (let k = 1; k < 8; k++) {
      const u = k / 8, px = lerp(lerp(x, x + Math.sin(a) * h * .4, u), lerp(x + Math.sin(a) * h * .4, ex, u), u);
      const py = lerp(lerp(y, y - h * .8, u), lerp(y - h * .8, ey, u), u), r = 3.4 * (1 - u * .7);
      btEl(q, px - 2.4, py + 1, r, r * .45, -.6, q.fillStyle); btEl(q, px + 2.4, py + 1, r, r * .45, .6, q.fillStyle);
    }
  }
}
function btOrtanca(q, x, y, renk) {   // ortanca çalısı: yaprak kümesi + top top çiçek
  for (let i = 0; i < 6; i++) btEl(q, x - 26 + i * 10, y - 8 - btHash(x + i) * 8, 10, 7, (i - 3) * .2, i % 2 ? '#5d9e49' : '#4b8a3e');
  for (let i = 0; i < 4; i++) {
    const cx = x - 18 + i * 12, cy = y - 20 - btHash(x * 2 + i) * 8;
    btEl(q, cx, cy, 7, 6, 0, renk[0]);
    q.fillStyle = renk[1];
    for (let k = 0; k < 6; k++) { q.beginPath(); q.arc(cx + Math.cos(k) * 3.6, cy + Math.sin(k * 1.3) * 3, 1.6, 0, BT_PI2); q.fill(); }
    btEl(q, cx - 2, cy - 2.5, 3, 1.6, 0, 'rgba(255,255,255,.35)');
  }
}
function btKaya(q, x, y, rx, ry, tohum) {   // yuvarlak kaya (şelale yığını, kenar taşları)
  btEl(q, x, y, rx, ry, 0, '#9d9686');
  q.save(); q.beginPath(); q.ellipse(x, y, rx, ry, 0, 0, BT_PI2); q.clip();
  btEl(q, x - rx * .2, y - ry * .35, rx * .8, ry * .6, -.1, '#bdb5a3');
  btEl(q, x - rx * .3, y - ry * .55, rx * .4, ry * .22, -.1, 'rgba(255,255,245,.45)');
  btEl(q, x + rx * .3, y + ry * .55, rx * .9, ry * .5, 0, 'rgba(60,56,48,.3)');
  if (btHash(tohum) < .6) btEl(q, x + rx * (btHash(tohum + 1) - .5), y - ry * .8, rx * .5, ry * .25, 0, 'rgba(110,160,70,.7)');   // yosun
  q.restore();
}
// Tüm arka katman dünya koordinatında çizilir; döşemeler bunu kendi kırpmalarıyla iki kez kurar (yalnız kurulumda).
function btArkaCiz(q) {
  const { x0, x1, ust, alt } = BT_GOL;
  // 1) arka bitkiler (göletin gerisinde; seranın önünü kapatmasın diye alçak, en çok y ≈ 600)
  btEgrelti(q, 24700, ust + 2, 34, -1);
  btPapirus(q, 24770, ust + 3, 62, 6);
  btOrtanca(q, 24900, ust + 2, ['#c8b2ee', '#e6dcff']);
  btFilKulagi(q, 25000, ust + 4, 70, -.5, '#5da24a'); btFilKulagi(q, 25010, ust + 4, 82, .1, '#4f9442'); btFilKulagi(q, 25020, ust + 4, 64, .7, '#67ac52');
  btEgrelti(q, 25120, ust + 2, 30, 1);
  btOrtanca(q, 25220, ust + 1, ['#ffb9d2', '#ffe1ec']);
  btPapirus(q, 25390, ust + 3, 56, 5);
  btEgrelti(q, 25480, ust + 2, 32, -1);
  btOrtanca(q, 25600, ust + 2, ['#9fc7f2', '#d8ecff']);
  btFilKulagi(q, 25730, ust + 4, 66, -.6, '#58a046'); btFilKulagi(q, 25745, ust + 4, 78, .05, '#4c9040'); btFilKulagi(q, 25760, ust + 4, 60, .6, '#65aa50');
  btPapirus(q, 25900, ust + 3, 60, 6);
  btEgrelti(q, 26020, ust + 2, 36, 1);
  // 2) arka kenar taşları
  for (let x = x0 + 40, i = 0; x < x1 - 30; x += 22 + btHash(i * 5.3) * 10, i++) {
    const rx = 11 + btHash(i * 2.1) * 6, yy = ust + 1 + btHash(i * 4.7) * 3;
    btKaya(q, x, yy, rx, rx * .5, i * 1.7);
    if (btHash(i * 9.1) < .35) { q.strokeStyle = '#6aa64e'; q.lineWidth = 1.1; for (let k = 0; k < 4; k++) { q.beginPath(); q.moveTo(x + k * 2 - 3, yy - rx * .4); q.lineTo(x + k * 3 - 6, yy - rx * .4 - 7 - k); q.stroke(); } }
  }
  // 3) su gövdesi: uzakta gök yansıması (açık), önde daha derin
  btSuYol(q);
  const gr = q.createLinearGradient(0, ust, 0, alt);
  gr.addColorStop(0, '#9fd3e3'); gr.addColorStop(.22, '#7fc0d6'); gr.addColorStop(.6, '#5eabc6'); gr.addColorStop(1, '#4a9bb9');
  q.fillStyle = gr; q.fill();
  q.save(); btSuYol(q); q.clip();
  q.fillStyle = 'rgba(40,90,70,.22)'; q.fillRect(x0 - 10, ust - 4, x1 - x0 + 20, 12);   // arka kenarın yansıması
  for (let x = x0 + 60; x < x1 - 40; x += 90) btEl(q, x + btHash(x) * 30, ust + 12, 22, 3, 0, 'rgba(90,150,80,.18)');   // bitki yansımaları
  q.strokeStyle = 'rgba(255,255,255,.35)'; q.lineWidth = 1;
  for (let i = 0; i < 26; i++) { const x = x0 + 40 + btHash(i * 3.3) * (x1 - x0 - 80), y = ust + 16 + btHash(i * 7.9) * 34; q.beginPath(); q.moveTo(x, y); q.lineTo(x + 8 + btHash(i) * 10, y); q.stroke(); }
  q.restore();
  // 4) şelale kayaları (solda yığın) ve dibindeki küçük havuz kenarı
  const SX = BT_SELALE.x;
  btKaya(q, SX - 90, 668, 34, 22, 1); btKaya(q, SX + 74, 670, 36, 22, 2);
  btKaya(q, SX - 62, 640, 30, 22, 3); btKaya(q, SX + 52, 642, 32, 22, 4);
  btKaya(q, SX - 30, 618, 28, 18, 5); btKaya(q, SX + 32, 616, 30, 18, 6);
  btKaya(q, SX - 4, 600, 24, 14, 7);   // ağzın üstündeki taş
  btEgrelti(q, SX - 44, 604, 24, -1); btEgrelti(q, SX + 46, 600, 22, 1);
  q.fillStyle = '#4b4236'; q.beginPath(); q.ellipse(SX, BT_SELALE.ust + 1, 10, 4, 0, 0, BT_PI2); q.fill();   // suyun çıktığı oyuk
  // 5) sol ve sağ uçta ön köşe taşları + kamışlar
  btKaya(q, x0 + 10, alt - 6, 22, 12, 11); btKaya(q, x0 + 40, alt - 2, 16, 9, 12);
  btKaya(q, x1 - 12, alt - 6, 22, 12, 13); btKaya(q, x1 - 44, alt - 2, 15, 8, 14);
  q.strokeStyle = '#6a9c48'; q.lineWidth = 1.4;
  for (const bx of [x0 + 24, x1 - 28]) for (let k = 0; k < 6; k++) { q.beginPath(); q.moveTo(bx + k * 3, alt - 8); q.quadraticCurveTo(bx + k * 3 - 2, alt - 30, bx + k * 4 - 6, alt - 44 - k * 2); q.stroke(); }
  q.fillStyle = '#8a5a34';
  for (const bx of [x0 + 26, x1 - 22]) { q.beginPath(); q.ellipse(bx + 2, alt - 46, 2.2, 6, -.1, 0, BT_PI2); q.fill(); }
  // 6) yazısız levha: tahta direk, üstünde kaplumbağa simgesi
  const LX = x0 - 18, LY = alt;
  q.fillStyle = '#8a6440'; q.fillRect(LX - 2, LY - 38, 4, 38);
  q.fillStyle = '#c99a63'; q.beginPath(); q.roundRect ? q.roundRect(LX - 20, LY - 62, 40, 26, 5) : q.rect(LX - 20, LY - 62, 40, 26); q.fill();
  q.strokeStyle = '#8a6440'; q.lineWidth = 1.4; q.stroke();
  btEl(q, LX, LY - 49, 10, 7, 0, '#6aa45a'); btEl(q, LX + 12, LY - 49, 3.6, 3, 0, '#8fbf6e');   // simge: kabuk + baş
  btEl(q, LX - 6, LY - 43.5, 2.4, 1.6, 0, '#8fbf6e'); btEl(q, LX + 6, LY - 43.5, 2.4, 1.6, 0, '#8fbf6e');
  q.fillStyle = '#2b2a24'; q.beginPath(); q.arc(LX + 13.2, LY - 50, .9, 0, BT_PI2); q.fill();
  q.strokeStyle = 'rgba(255,255,255,.6)'; q.lineWidth = .8; q.beginPath(); q.moveTo(LX - 5, LY - 53); q.lineTo(LX + 4, LY - 53); q.stroke();
}
function btDosemeKur(i) {
  const s = BT_STATIK, w = s.dosemeW, x0 = s.x0 + i * w, res = Math.min(BT.K, 3);
  const t = btTuval(x0, s.y0, w + 2, s.y1 - s.y0, res), q = t.q;
  q.beginPath(); q.rect(x0, s.y0, w + 2, s.y1 - s.y0); q.clip();
  btArkaCiz(q);
  BT.doseme[i] = t.c;
}
// Kurulum kuyruğu: bölgeye yaklaşırken karede bir parça (girişte takılma yok)
const BT_KUR = [
  () => btDosemeKur(0), () => btDosemeKur(1),
  () => { for (let v = 0; v < BT_RENK.length; v++) BT.spr["kabuk" + v] = btKabukSpr(v, BT.K * 1.8); },
  () => {
    BT.spr.tas1 = btTasSpr(BT_TAS1.w, BT_TAS1.y - BT_TAS1.ust, BT.K, 3);
    BT.spr.tas2 = btTasSpr(BT_TAS2.w, BT_TAS2.y - BT_TAS2.ust, BT.K, 9);
    BT.spr.kutuk = btKutukSpr(BT_KUTUK.x1 - BT_KUTUK.x0, BT_KUTUK.r, BT.K);
    BT.spr.nil = btNiluferSpr(BT.K); BT.spr.onSu = btSuSerit(BT.K);
  }
];
function btKurAdim() {
  if (BT.hazir) return;
  if (!BT.K) BT.K = clamp(Math.ceil((typeof S === 'number' && S > 0 ? S : 2) * 1.1), 2, 4);
  try { BT_KUR[BT.kuyruk](); } catch (e) { if (typeof omHataBildir === 'function') omHataBildir('botanik12.kur', e); }
  BT.kuyruk++;
  if (BT.kuyruk >= BT_KUR.length) BT.hazir = true;
}

// ════════════════════════ Kaplumbağalar: kurulum ════════════════════════
// rol: 'anne' | 'yavru' | 'tas' | 'kutuk' | 'yuzucu' | 'yurur'. (x, y) ayakların bastığı yer, a kabuğun yarı uzunluğu.
function btKpYeni(rol, x, y, a, v, yon, ek) {
  const k = {
    rol, x, y, x0: x, y0: y, a, v, yon, yonS: yon, s: btDerin(y),
    bas: .35, basH: .35, kaldir: 0, kaldirH: 0, bakX: 0, bakY: 0, kapak: .7, kapakH: .7, mutlu: 0, kirpT: 2 + btHash(x) * 3,
    sere: 1, sereH: 1, uzuv: 1, uzuvH: 1, faz: btHash(x * .3) * 6, yuru: 0, egim: 0, batik: 0, popT: 9, el: 0,
    durum: 'gunes', t: 0, uyanT: -1, tepki: 0, kalpT: 9, sel: 0,
    ust: null, alt: null, u: 0,         // kule: altındaki (ust = üstünde duran), tırmanma ilerlemesi
    hx: x, hy: y, hrx: 20, hry: 16
  };
  return Object.assign(k, ek || {});
}
function btKur() {
  BT.kp.length = 0; BT.nil.length = 0; BT.onNil.length = 0;
  const T1 = BT_TAS1, T2 = BT_TAS2, KU = BT_KUTUK;
  const anne = btKpYeni('anne', T1.x + 46, T1.ust + 3, 34, 0, -1);
  const y1 = btKpYeni('yavru', T1.x - 30, T1.ust + 2, 16, 1, 1, { sira: 1 });
  const y2 = btKpYeni('yavru', T1.x - 74, T1.ust + 5, 12.5, 1, 1, { sira: 2 });
  const dede = btKpYeni('tas', T2.x + 4, T2.ust + 3, 28, 2, -1, { tepkiler: 'pp' });
  const k1 = btKpYeni('kutuk', KU.x0 + 80, KU.y - KU.r + 1, 22, 3, -1, { tepkiler: 'dp' });
  const k2 = btKpYeni('kutuk', KU.x0 + 200, KU.y - KU.r + 1, 19, 4, -1, { tepkiler: 'pd' });
  const yz = btKpYeni('yuzucu', BT_YUZ.cx, BT_YUZ.cy, 20, 3, 1, { th: 1.2, durum: 'yuz', sere: 0, sereH: 0, kapak: 0, kapakH: 0 });
  const yr = btKpYeni('yurur', BT_GOL.x0 - 50, BT_ISKELE.y, 18, 1, 1, { durum: 'dinlen', sere: 0, sereH: 0, adimT: 0, geriT: 0 });
  BT.aile = { anne, y1, y2 };
  BT.kp.push(dede, k1, k2, anne, y1, y2, yz, yr);
  BT.yuzucu = yz; BT.yurur = yr;
  for (const n of BT_NILUFER) BT.nil.push({ x: n[0], y: n[1], s: n[2], renk: n[3], acik: n[3] < 0 ? 0 : .15, acH: n[3] < 0 ? 0 : .15, sal: btHash(n[0]) * 6, dokT: 9, kurbT: 9 });
  for (const n of BT_ONSU_NILUFER) BT.onNil.push({ x: n[0], y: n[1], s: n[2], renk: n[3], acik: n[3] < 0 ? 0 : .3, acH: n[3] < 0 ? 0 : .3, sal: btHash(n[0]) * 6, dokT: 9, kurbT: 9 });
  btBalikKur(); btKurbKur();
}

// ════════════════════════ Kaplumbağalar: davranış ════════════════════════
function btFezaBak(k) {   // göz bebekleri ve gövde Feza'ya döner
  const dx = P.x - k.x, dy = (P.y - 50) - (k.y - 10);
  k.bakX = clamp(dx / 160, -1, 1); k.bakY = clamp(dy / 120, -1, 1);
}
function btPop(k) {   // kafa kabuğa, sonra "pop!"
  if (k.durum === 'gir' || k.durum === 'kay' || k.durum === 'yuz' || k.durum === 'tirman' || k.durum === 'dal') return;
  k.durum = 'gir'; k.t = 0; k.basH = 0; k.uzuvH = 0; k.sereH = 0;
  btOlay('k12KaplumbagaPop', { x: k.x, y: k.y, faz: 'gir', yavru: k.a < 17 });
}
function btDal(k) {   // taştan/kütükten suya kayar, yüzer, geri tırmanır
  if (k.durum !== 'gunes' && k.durum !== 'bak') return;
  k.durum = 'kay'; k.t = 0; k.basH = .9; k.uzuvH = 1; k.sereH = 0;
  k.yon = k.rol === 'kutuk' ? (k.x < (BT_KUTUK.x0 + BT_KUTUK.x1) / 2 ? -1 : 1) : -1;
  k.kx = k.x0 + k.yon * 14;   // suya girdiği yer (biraz yana ve öne: göletin bize yakın tarafına)
  k.dalY = k.rol === 'kutuk' ? 25 : 20;   // ne kadar öne (aşağı) kayar: kütüğün/taşın önündeki suya
}
function btKuleIlerle(oto) {   // kule: 0 → yavru1 annede (2 kat) → yavru2 de üstte (3 kat) → hepsi kayarak iner
  const A = BT.aile; if (!A) return;
  const hazir = q => q.durum === 'gunes' || q.durum === 'bak';
  if (BT.kule === 0 && hazir(A.y1) && hazir(A.anne)) { btTirmanBasla(A.y1, A.anne); BT.kule = 1; }
  else if (BT.kule === 2 && hazir(A.y2) && !oto) { btTirmanBasla(A.y2, A.y1); BT.kule = 3; }
  else if (BT.kule === 4 && !oto) btKuleIn();
}
function btTirmanBasla(k, alt) {
  k.durum = 'tirmanK'; k.t = 0; k.u = 0; k.alt = alt; alt.ust = k; k.basH = 1; k.uzuvH = 1; k.sereH = 0;
  k.yon = alt.x > k.x ? 1 : -1;
  btOlay('k12KaplumbagaYuru', { x: k.x, kule: true });
}
function btKuleIn() {
  const A = BT.aile; BT.kule = 5; BT.kuleT = 0;
  if (A.y2.alt) { A.y2.durum = 'inK'; A.y2.t = 0; }
  if (A.y1.alt) { A.y1.durum = 'inK'; A.y1.t = A.y2.alt ? -.7 : 0; }
}
const BT_UST = { x: 0, y: 0 };
// k'nin sırtının tepesi (üstündeki yavru ayaklarını buraya basar)
function btUstNokta(k) {
  const h = 22.5 * k.s * k.a / 20; BT_UST.x = k.x - 1.5 * k.yonS * k.a / 20; BT_UST.y = k.y - h + btSalla(k); return BT_UST; }
function btSalla(k) { return k.popT < .35 ? -Math.sin(Math.PI * k.popT / .35) * 2.5 : 0; }

function btKpGuncelle(k, dt, yakin) {
  k.t += dt; k.popT += dt; k.kalpT += dt; k.faz += dt * (1.5 + 7 * k.yuru);
  // göz kırpma
  k.kirpT -= dt;
  if (k.kirpT < 0) { k.kirpT = 2.6 + Math.random() * 3.2; k.kirp = .14; }
  if (k.kirp > 0) k.kirp -= dt;
  const d = Math.abs(P.x - k.x);
  switch (k.durum) {
    case 'gunes':   // güneşleniyor: gözler yarı kapalı, arka ayaklar geriye uzanmış, baş tembelce önde
      k.basH = .55; k.kaldirH = 0; k.kapakH = .78; k.sereH = 1; k.uzuvH = 1; k.mutlu = btYaklas(k.mutlu, .6, dt * 2);
      k.bakX = btYaklas(k.bakX, 0, dt * 2); k.bakY = 0;
      if (yakin && d < 330 && k.uyanT < 0) k.uyanT = .15 + btHash(k.x) * .9;   // sırayla uyanır
      if (k.uyanT >= 0) { k.uyanT -= dt; if (k.uyanT < 0) { k.durum = 'bak'; k.t = 0; k.uyanT = -1; k.popT = 0; } }
      break;
    case 'bak':     // Feza'ya bakıyor: baş uzun ve havada, gözler kocaman, gövde ona döner
      k.basH = 1.08; k.kaldirH = 1; k.kapakH = 0; k.sereH = 0; k.uzuvH = 1; k.mutlu = btYaklas(k.mutlu, .9, dt * 3);
      btFezaBak(k);
      if (k.rol !== 'yavru' || !k.alt) { if (Math.abs(P.x - k.x) > 30 && k.t > .25) k.yon = P.x > k.x ? 1 : -1; }
      if (d > 520 || !yakin) { k.durum = 'gunes'; k.t = 0; }
      break;
    case 'gir':     // kabuğa çekildi; kabuk küçük titrer, karanlıkta iki göz parlar
      if (k.t > .8) {
        k.durum = 'bak'; k.t = 0; k.basH = 1.08; k.uzuvH = 1; k.bas = 1.25; k.popT = 0; k.kalpT = 0;
        btYildiz(k.x + k.yonS * k.a * .9, k.y - k.a * .6);
        btOlay('k12KaplumbagaPop', { x: k.x, y: k.y, faz: 'cik', yavru: k.a < 17 });
        btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y });
      }
      break;
    case 'kay': {   // suya doğru kayar (eğilir), suya girince halka + damlacık
      const u = Math.min(1, k.t / .9);
      k.x = lerp(k.x0, k.kx, smooth(u)); k.y = k.y0 + k.dalY * u * u; k.egim = .42 * Math.sin(Math.PI * Math.min(1, u * 1.4)) * k.yon;
      k.batik = clamp((u - .45) / .55, 0, 1); k.yuru = 1;
      if (u >= 1) {
        k.durum = 'yuz'; k.t = 0; k.egim = 0;
        btHalka(k.x, k.y - 3, 10, 1.3, 1); btHalka(k.x, k.y - 3, 5, .9, .7); btSicrat(k.x, k.y - 6, 7, .8);
        btOlay('k12KaplumbagaDal', { x: k.x, y: k.y });
      }
      break;
    }
    case 'yuz': {   // (taş/kütük kaplumbağası) suda küçük bir tur: ileri, dönüş, geri
      if (k.rol === 'yuzucu') break;
      k.batik = 1; k.yuru = .8; k.basH = 1; k.kaldirH = .6; k.kapakH = 0; k.mutlu = 1;
      const T1 = 2.2, git = k.t < T1;
      const hedefX = git ? k.kx + k.yon * 70 : k.kx;
      k.x = btYaklas(k.x, hedefX, dt * 1.3);
      if (!git) k.yonS = btYaklas(k.yonS, -k.yon, dt * 6);
      if (Math.floor((k.t + dt) / .7) !== Math.floor(k.t / .7)) { btHalka(k.x - k.yonS * k.a * .7, k.y - 3, 6, 1, .5); btOlay('k12KaplumbagaYuz', { x: k.x }); }
      if (!git && Math.abs(k.x - hedefX) < 4) { k.durum = 'tirman'; k.t = 0; k.yon = -k.yon; }
      break;
    }
    case 'tirman': {   // geri tırmanır (ayaklar telaşla çabalar)
      const u = Math.min(1, k.t / 1.2);
      k.x = lerp(k.kx, k.x0, smooth(u)); k.y = k.y0 + k.dalY * (1 - u) * (1 - u);
      k.egim = -.38 * Math.sin(Math.PI * u) * k.yon; k.batik = clamp(1 - u * 1.8, 0, 1); k.yuru = 1;
      if (Math.floor((k.t + dt) / .4) !== Math.floor(k.t / .4)) btSicrat(k.x, k.y - 4, 2, .3);
      if (u >= 1) {
        k.durum = 'bak'; k.t = 0; k.x = k.x0; k.y = k.y0; k.egim = 0; k.batik = 0; k.yuru = 0; k.popT = 0; k.kalpT = 0;
        btOlay('k12KaplumbagaCik', { x: k.x, y: k.y });
      }
      break;
    }
    case 'tirmanK': {   // yavru annesinin (ya da ağabeyinin) sırtına tırmanıyor
      const u = Math.min(1, k.t / 1.7), A = btUstNokta(k.alt);
      const yanX = k.alt.x - k.yon * (k.alt.a * k.alt.s * .95 + k.a * .6);
      if (u < .35) { const v = smooth(u / .35); k.x = lerp(k.x0, yanX, v); k.y = lerp(k.y0, k.alt.y, v); k.egim = 0; }
      else { const v = smooth((u - .35) / .65); k.x = lerp(yanX, A.x, v); k.y = lerp(k.alt.y, A.y, v) - Math.sin(Math.PI * v) * 5; k.egim = -.5 * Math.sin(Math.PI * v) * k.yon; }
      k.yuru = 1; k.basH = 1; k.kaldirH = .5; k.mutlu = 1;
      if (u >= 1) {
        k.durum = 'kule'; k.t = 0; k.egim = 0; k.yuru = 0; k.popT = 0; k.kalpT = 0; k.alt.kalpT = 0; k.alt.mutlu = 1;
        BT.kule = k.sira === 1 ? 2 : 4; BT.kuleT = 0;
        btYildiz(A.x, A.y - 10);
        btOlay('k12KaplumbagaKule', { x: k.x, y: k.y, n: k.sira + 1 });
      }
      break;
    }
    case 'kule': {   // sırtta: altındakinin üstünde salınır, Feza'ya bakar
      const A = btUstNokta(k.alt);
      k.x = A.x; k.y = A.y; k.yuru = 0; k.basH = 1.1; k.kaldirH = 1; k.kapakH = 0; k.mutlu = 1; k.sereH = 0;
      btFezaBak(k);
      if (Math.abs(P.x - k.x) > 30 && k.t > .4) k.yon = P.x > k.x ? 1 : -1;   // tepede de Feza'ya döner
      break;
    }
    case 'inK': {   // kayarak iner ("vıjjj"), yerine yürür
      if (k.t < 0) { const A = btUstNokta(k.alt); k.x = A.x; k.y = A.y; break; }
      const u = Math.min(1, k.t / 1.3), A = btUstNokta(k.alt);
      const yanX = k.alt.x - k.yon * (k.alt.a * k.alt.s * 1.1 + k.a * .7);
      if (u < .4) { const v = u / .4; k.x = lerp(A.x, yanX, v * v); k.y = lerp(A.y, k.alt.y, v * v); k.egim = .5 * k.yon * Math.sin(Math.PI * v * .5); }
      else { const v = smooth((u - .4) / .6); k.x = lerp(yanX, k.x0, v); k.y = lerp(k.alt.y, k.y0, v); k.egim = btYaklas(k.egim, 0, dt * 8); k.yonS = btYaklas(k.yonS, k.x0 > yanX ? 1 : -1, dt * 4); }
      k.yuru = u < .4 ? 0 : 1; k.mutlu = 1;
      if (u >= 1) {
        k.durum = 'bak'; k.t = 0; k.egim = 0; k.yuru = 0; k.x = k.x0; k.y = k.y0; k.yon = 1;
        if (k.alt) k.alt.ust = null; k.alt = null;
        if (!BT.aile.y1.alt && !BT.aile.y2.alt) BT.kule = 0;
      }
      break;
    }
  }
  // yumuşak geçişler
  if (k.durum !== 'yuz' && k.durum !== 'inK') k.yonS = btYaklas(k.yonS, k.yon, dt * 5);
  k.bas = btYaklas(k.bas, k.basH, dt * (k.basH < k.bas ? 16 : 7));
  k.kaldir = btYaklas(k.kaldir, k.kaldirH, dt * 4);
  k.kapak = btYaklas(k.kapak, k.kapakH, dt * 5);
  k.sere = btYaklas(k.sere, k.sereH, dt * 3);
  k.uzuv = btYaklas(k.uzuv, k.uzuvH, dt * (k.uzuvH < k.uzuv ? 16 : 7));
  if (k.durum !== 'kay' && k.durum !== 'yuz' && k.durum !== 'tirman' && k.durum !== 'tirmanK' && k.durum !== 'inK' && k.rol !== 'yurur') k.yuru = btYaklas(k.yuru, 0, dt * 6);
  if (k.durum !== 'kay' && k.durum !== 'yuz' && k.durum !== 'tirman' && k.rol !== 'yuzucu') k.batik = btYaklas(k.batik, 0, dt * 6);
  k.s = btDerin(k.rol === 'yurur' ? BT_GOL.alt : (k.durum === 'kule' || k.durum === 'tirmanK' || k.durum === 'inK') && k.alt ? k.alt.y : k.y);
}

// Yüzücü: elips üzerinde döner; Feza yanına gelince ona doğru gelip başını kaldırır; dokununca dalar, biraz ötede "pop" diye çıkar
function btYuzucu(k, dt, yakin) {
  k.t += dt; k.popT += dt; k.kalpT += dt; k.faz += dt * 5;
  k.kirpT -= dt; if (k.kirpT < 0) { k.kirpT = 2.6 + Math.random() * 3; k.kirp = .14; } if (k.kirp > 0) k.kirp -= dt;
  const Y = BT_YUZ;
  if (k.durum === 'dal') {   // dalış: suyun altında, kabarcıklar
    k.batik = btYaklas(k.batik, 2.2, dt * 5);
    if (Math.floor((k.t + dt) / .25) !== Math.floor(k.t / .25)) btKabarcik(k.x + (Math.random() - .5) * 10, k.y - 2);
    if (k.t > 1.5) {
      k.th += .55; k.durum = 'yuz'; k.t = 0; k.popT = 0; k.kalpT = 0; k.bas = 1.25;
      k.x = Y.cx + Y.rx * Math.cos(k.th); k.y = Y.cy + Y.ry * Math.sin(k.th);
      btHalka(k.x, k.y - 3, 12, 1.2, 1); btSicrat(k.x, k.y - 6, 6, .6);
      btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y });
    }
    return;
  }
  k.batik = btYaklas(k.batik, 1, dt * 4);
  const yakinF = yakin && Math.abs(P.x - k.x) < 260;
  const w = yakinF ? .05 : .16;          // Feza yakınken yavaşlar, ona bakar
  const onceX = k.x;
  k.th += w * dt;
  k.x = Y.cx + Y.rx * Math.cos(k.th); k.y = Y.cy + Y.ry * Math.sin(k.th);
  const vx = k.x - onceX;
  if (yakinF) { k.yon = P.x > k.x ? 1 : -1; btFezaBak(k); k.kaldirH = 1; k.basH = 1.1; }
  else { if (Math.abs(vx) > .001) k.yon = vx > 0 ? 1 : -1; k.bakX = btYaklas(k.bakX, 0, dt * 2); k.bakY = 0; k.kaldirH = .5; k.basH = .95; }
  k.yuru = yakinF ? .35 : .8; k.kapakH = 0; k.mutlu = btYaklas(k.mutlu, yakinF ? 1 : .6, dt * 2);
  if (Math.floor((k.t + dt) / 1.1) !== Math.floor(k.t / 1.1)) btHalka(k.x - k.yon * 12, k.y - 2, 7, 1.2, .45);
  k.yonS = btYaklas(k.yonS, k.yon, dt * 3);
  k.bas = btYaklas(k.bas, k.basH, dt * 7); k.kaldir = btYaklas(k.kaldir, k.kaldirH, dt * 4); k.kapak = btYaklas(k.kapak, k.kapakH, dt * 5);
  k.uzuv = 1; k.sere = 0; k.s = btDerin(k.y);
}

// Eşlikçi: iskelenin arka kenarında Feza'nın peşinden minicik ağır adımlarla yürür
function btYurur(k, dt) {
  k.t += dt; k.popT += dt; k.kalpT += dt;
  k.kirpT -= dt; if (k.kirpT < 0) { k.kirpT = 2.4 + Math.random() * 3; k.kirp = .14; } if (k.kirp > 0) k.kirp -= dt;
  const B = BT_ISKELE, dx = P.x - k.x, d = Math.abs(dx);
  let hedefV = 0;
  switch (k.durum) {
    case 'dinlen':   // yatıyor, gözler yumuk; Feza yaklaşınca kalkar
      k.basH = .5; k.kapakH = .85; k.mutlu = .7; k.kaldirH = 0; k.el = btYaklas(k.el, 0, dt * 4);
      if (d < 330) { k.durum = 'kalk'; k.t = 0; k.popT = 0; }
      break;
    case 'kalk':     // başını kaldırır, Feza'ya döner
      k.basH = 1.1; k.kapakH = 0; k.kaldirH = 1; k.mutlu = 1; btFezaBak(k);
      if (d > 14) k.yon = dx > 0 ? 1 : -1;
      if (k.t > .7) { k.durum = 'izle'; k.t = 0; if (!k.basladi) { k.basladi = true; btOlay('k12KaplumbagaYuru', { x: k.x }); } }
      break;
    case 'izle': {   // peşinden yürü (Feza durup beklerse yetişir)
      k.basH = 1.05; k.kapakH = 0; k.kaldirH = .7; btFezaBak(k);
      if (d > 14) k.yon = dx > 0 ? 1 : -1;
      if (d > 56) hedefV = 17 * k.yon;          // komik derecede yavaş (Feza ~250 birim/sn)
      if (d < 60 && Math.abs(BT.fezaVx) < 20 && k.t > 2) { k.durum = 'sevin'; k.t = 0; k.kalpT = 0; k.popT = 0; btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y }); }
      if (d > 430) { k.geriT += dt; if (k.geriT > 1) { k.durum = 'yoruldu'; k.t = 0; k.geriT = 0; btOlay('k12KaplumbagaYoruldu', { x: k.x }); if (typeof burst === 'function') burst(k.x + k.yon * 14, k.y - 16, 5, ['#ffffff', '#f2f6ff'], 26, .9, 5); } }
      else k.geriT = 0;
      if ((k.x <= B.x0 && k.yon < 0) || (k.x >= B.x1 && k.yon > 0)) { hedefV = 0; if (d > 200 && k.t > 1) { k.durum = 'yoruldu'; k.t = 0; btOlay('k12KaplumbagaYoruldu', { x: k.x }); } }
      break;
    }
    case 'sevin':    // yetişti: zıp zıp, kalp
      k.basH = 1.15; k.kaldirH = 1; k.mutlu = 1; btFezaBak(k);
      if (k.t > 1.4 || d > 90) { k.durum = 'izle'; k.t = 0; }
      break;
    case 'yoruldu':  // oturur, "pöf", Feza'ya ön ayağıyla el sallar, sonra dinlenir
      k.basH = 1; k.kaldirH = .8; k.mutlu = 1; btFezaBak(k);
      k.el = k.t < 2.4 ? btYaklas(k.el, 1, dt * 6) : btYaklas(k.el, 0, dt * 4);
      if (k.t > 3.2) { k.durum = 'dinlen2'; k.t = 0; }
      if (d < 250 && k.t > .8) { k.durum = 'izle'; k.t = 0; k.el = 0; }
      break;
    case 'dinlen2':  // dinleniyor ama Feza geri gelirse yine kalkar
      k.basH = .55; k.kapakH = .85; k.kaldirH = 0; k.mutlu = .8; k.el = btYaklas(k.el, 0, dt * 4);
      if (d < 250) { k.durum = 'kalk'; k.t = 0; k.popT = 0; }
      break;
    case 'gir':
      if (k.t > .8) { k.durum = 'izle'; k.t = 0; k.basH = 1.1; k.uzuvH = 1; k.bas = 1.25; k.popT = 0; k.kalpT = 0; btYildiz(k.x + k.yonS * 14, k.y - 10); btOlay('k12KaplumbagaPop', { x: k.x, y: k.y, faz: 'cik' }); btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y }); }
      break;
  }
  if (k.durum !== 'gir') k.uzuvH = 1;
  k.vx = btYaklas(k.vx || 0, hedefV, dt * 4);
  k.x = clamp(k.x + k.vx * dt, B.x0, B.x1);
  k.yuru = clamp(Math.abs(k.vx) / 17, 0, 1);
  k.faz += dt * (1.5 + 9 * k.yuru);   // ayaklar hızlı hızlı, yol az: komik
  if (k.yuru > .3) { k.adimT = (k.adimT || 0) + dt; if (k.adimT > .7) { k.adimT = 0; btOlay('k12KaplumbagaAdim', { x: k.x }); } }
  k.yonS = btYaklas(k.yonS, k.yon, dt * 5);
  k.bas = btYaklas(k.bas, k.basH, dt * (k.basH < k.bas ? 16 : 7)); k.kaldir = btYaklas(k.kaldir, k.kaldirH, dt * 4);
  k.kapak = btYaklas(k.kapak, k.kapakH, dt * 5); k.uzuv = btYaklas(k.uzuv, k.uzuvH, dt * (k.uzuvH < k.uzuv ? 16 : 7));
  k.sere = 0; k.batik = 0; k.s = 1;
}

// ════════════════════════ Kaplumbağa çizimi ════════════════════════
// Referans model a = 20: kabuğun alt kenarı y = -3 (ayaklar 0'a basar), kubbe tepesi y ≈ -22. Sağa bakar; yonS ile döner.
function btBacak(c, x, y, uz, aci, renk, tirnak) {
  if (uz < .08) return;
  c.save(); c.translate(x, y); c.rotate(aci);
  btEl(c, 0, 2.2 * uz, 3.5, 3.6 * uz + .8, 0, renk);
  if (tirnak && uz > .5) { c.fillStyle = 'rgba(255,250,220,.85)'; for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 1.6 + .6, 5.6 * uz, .55, 0, BT_PI2); c.fill(); } }
  c.restore();
}
function btGoz(c, x, y, r, k, mutluKapali) {
  const kapali = k.kirp > 0 || k.kapak > .86;
  if (kapali || mutluKapali) {   // kapalı göz: mutlu kavis (^) ya da uykulu (︶)
    c.strokeStyle = '#2b2a24'; c.lineWidth = .9; c.beginPath();
    if (k.kapak > .86 && !mutluKapali) { c.moveTo(x - r, y); c.quadraticCurveTo(x, y + r * .9, x + r, y); }
    else { c.moveTo(x - r, y + r * .3); c.quadraticCurveTo(x, y - r * .8, x + r, y + r * .3); }
    c.stroke(); return;
  }
  btEl(c, x, y, r + .4, r + .45, 0, '#2b2a24');
  btEl(c, x, y, r, r * 1.05, 0, '#ffffff');
  const px = x + k.bakX * r * .32 * k.yonS, py = y + k.bakY * r * .25;
  btEl(c, px + .2, py + .1, r * .64, r * .7, 0, '#2b2a24');
  btEl(c, px - r * .25, py - r * .32, r * .24, r * .24, 0, '#ffffff');
  btEl(c, px + r * .22, py + r * .26, r * .11, r * .11, 0, '#ffffff');
  if (k.kapak > .04) {   // göz kapağı (uykulu)
    c.save(); c.beginPath(); c.ellipse(x, y, r + .45, r + .5, 0, 0, BT_PI2); c.clip();
    c.fillStyle = BT_RENK[k.v].ten; c.fillRect(x - r - 1, y - r - 1, 2 * r + 2, (2 * r + 1) * k.kapak + .4);
    c.strokeStyle = '#2b2a24'; c.lineWidth = .7; c.beginPath(); c.moveTo(x - r, y - r - .6 + (2 * r + 1) * k.kapak); c.lineTo(x + r, y - r - .6 + (2 * r + 1) * k.kapak); c.stroke();
    c.restore();
  }
}
function btKpCiz(c, k, tm) {
  const p = BT_RENK[k.v], spr = BT.spr['kabuk' + k.v];
  if (!spr) return;
  const sk = k.s * k.a / 20, bob = btSalla(k);
  c.save();
  c.translate(k.x, k.y + bob); c.rotate(k.egim);
  const sx = Math.abs(k.yonS) < .3 ? .3 * (k.yonS < 0 ? -1 : 1) : k.yonS;
  let pz = 1, pzx = 1;
  if (k.popT < .3) { const u = Math.sin(Math.PI * k.popT / .3); pz = 1 + .1 * u; pzx = 1 - .06 * u; }   // pop esnemesi
  if (k.durum === 'gir') { const u = Math.min(1, k.t / .12); pz = 1 - .1 * u + Math.sin(k.t * 40) * .015; pzx = 1 + .05 * u; }
  if (k.rol === 'yurur' && k.durum === 'sevin') { c.translate(0, -Math.abs(Math.sin(k.t * 9)) * 5 * sk); }
  c.scale(sk * sx * pzx, sk * pz);
  const yuru = k.yuru, f = k.faz, uz = k.uzuv;
  const adim = Math.sin(f) * 2.6 * yuru, kalk = Math.max(0, Math.cos(f)) * 1.6 * yuru;
  const sere = k.sere, yuz = k.batik > .3;
  const kurek = yuz ? Math.sin(f * 1.3) * .5 : 0;
  // uzak bacaklar (koyu)
  btBacak(c, 13.5 - adim, -3.6 - (yuz ? 0 : Math.max(0, -Math.cos(f)) * 1.6 * yuru), uz, -.25 + kurek, p.tk, false);
  btBacak(c, -10.5 + adim - sere * 3, -3.6 - kalk, uz, .2 + sere * 1.1 - kurek, p.tk, false);
  // kuyruk
  if (uz > .2) { c.fillStyle = p.ten; c.beginPath(); c.moveTo(-18.5, -5.5); c.lineTo(-24.5 - sere * 2, -2.2 + sere); c.lineTo(-18, -2.6); c.closePath(); c.fill(); }
  // boyun + baş (kabuğun önünden çıkar; kabuk boynun dibini örter)
  const e = k.bas, kal = k.kaldir;
  const hx = 11.5 + 11 * e - 1.5 * kal, hy = -7.5 - 2 * e - 6.5 * kal + (k.durum === 'gunes' ? 2.5 : 0) + Math.sin(tm * 1.3 + k.x) * .35;
  const hs = 1 + (1 - Math.min(1, k.a / 34)) * .4;   // yavruların başı oranca iri
  if (e > .05) {
    c.strokeStyle = p.ten; c.lineWidth = 6.4 * Math.min(1, hs * .9); c.beginPath(); c.moveTo(10, -6.5); c.quadraticCurveTo(hx - 5, -6 - kal * 1.5, hx - 1, hy + 1.5); c.stroke();
    c.strokeStyle = p.ser; c.lineWidth = 1.1; c.beginPath(); c.moveTo(11, -5); c.quadraticCurveTo(hx - 5, -4.4 - kal * 1.5, hx - 1.5, hy + 3.4); c.stroke();
  }
  const hk = hs * (.62 + .38 * Math.min(1, e * 3));   // kabuğa çekilirken baş da küçülür (kabuğun ağzından taşmasın)
  c.save(); c.translate(hx, hy); c.scale(hk, hk);
  btEl(c, 0, 0, 7.6, 6.5, kal * -.12, p.ten);
  btEl(c, -1.2, -2.2, 4, 1.9, -.1, 'rgba(255,255,230,.28)');
  c.strokeStyle = p.ser; c.lineWidth = .9;                        // yanakta sarı çizgiler (tatlısu kaplumbağası)
  c.beginPath(); c.moveTo(-5.2, 1.4); c.quadraticCurveTo(-1.5, 3.6, 2.6, 3.4); c.moveTo(-5.6, -1.3); c.quadraticCurveTo(-3, -.4, -.6, -.7); c.stroke();
  const mk = k.mutlu > .85 && (k.durum === 'kule' || k.durum === 'sevin' || (k.kalpT < .8));
  btGoz(c, 2, -1.5, 2.9, k, mk && k.kalpT < .8);
  btGoz(c, 5.9, -1.9, 2.1, k, mk && k.kalpT < .8);
  btEl(c, 7.2, .2, .4, .32, 0, '#3d4a2c');                        // burun deliği
  c.fillStyle = 'rgba(255,140,150,' + (.3 + .25 * k.mutlu) + ')';  // yanak pembesi
  c.beginPath(); c.ellipse(.2, 2.9, 1.9, 1.1, 0, 0, BT_PI2); c.fill();
  if (k.mutlu > .8 && (k.durum === 'bak' || k.durum === 'kule' || k.durum === 'sevin' || k.rol === 'yuzucu')) {   // açık gülümseme
    c.fillStyle = '#6b3a3a'; c.beginPath(); c.moveTo(2.8, 2.7); c.quadraticCurveTo(5, 2.9, 7, 1.7); c.quadraticCurveTo(5.6, 5.6, 2.8, 2.7); c.fill();
    c.fillStyle = '#f08e9e'; c.beginPath(); c.ellipse(4.8, 3.8, 1.1, .6, -.2, 0, BT_PI2); c.fill();
  } else {
    c.strokeStyle = '#3b3a2c'; c.lineWidth = .8; c.beginPath(); c.moveTo(2.8, 2.7); c.quadraticCurveTo(5, 4.2, 7, 1.9); c.stroke();
  }
  c.restore();
  // kabuk
  c.drawImage(spr, spr.x0, spr.y0 - 3, spr.w, spr.h);
  if (k.durum === 'gir' && k.t > .15) {   // kabuğun ağzında karanlık ve iki parlayan göz
    btEl(c, 17.6, -6.2, 2.8, 3.6, 0, 'rgba(30,26,20,.75)');
    c.fillStyle = '#ffffff'; c.beginPath(); c.arc(17.6, -7, .75, 0, BT_PI2); c.arc(18.6, -5.4, .6, 0, BT_PI2); c.fill();
  }
  // yakın bacaklar
  btBacak(c, 11.5 + adim, -3.2 - kalk, uz, -.2 - kurek - k.el * 1.9 + k.el * Math.sin(tm * 12) * .45, p.ten, true);
  btBacak(c, -12.5 - adim - sere * 4.5, -3.2 - (yuz ? 0 : Math.max(0, -Math.cos(f)) * 1.6 * yuru), uz, .15 + sere * 1.25 + kurek, p.ten, true);
  c.restore();
  // dokunma bölgesi (dünya koordinatı)
  k.hx = k.x; k.hy = k.y - 11 * k.s * k.a / 20; k.hrx = Math.max(24, k.a * k.s * 1.35); k.hry = Math.max(20, k.a * k.s * .95);
}
function btKpCizSu(c, k, tm, suY) {   // suda: su çizgisinin üstü net, altı soluk (göl rengi)
  const dip = k.batik * 8 * k.s * k.a / 20;
  if (k.batik > 2) return;               // tam daldı (yalnız kabarcıklar)
  const yy = k.y; k.y = yy + dip;
  c.save(); c.beginPath(); c.rect(k.x - 80, suY - 90, 160, 90); c.clip(); btKpCiz(c, k, tm); c.restore();
  c.save(); c.beginPath(); c.rect(k.x - 80, suY, 160, 40); c.clip(); c.globalAlpha = .28; btKpCiz(c, k, tm); c.globalAlpha = 1; c.restore();
  k.y = yy;
  c.strokeStyle = 'rgba(240,252,255,.8)'; c.lineWidth = 1;   // su çizgisinde ince parıltı
  const w = k.a * k.s * 1.05;
  c.beginPath(); c.moveTo(k.x - w, suY); c.quadraticCurveTo(k.x, suY + 1.5, k.x + w, suY); c.stroke();
  k.hy = suY - 6;
}
function btKalpCiz(c, k) {
  if (k.kalpT > 1.2) return;
  const u = k.kalpT / 1.2, A = btUstNokta(k);
  c.globalAlpha = 1 - u; c.fillStyle = '#ff86a8';
  btKalp(c, A.x + 6 * k.yonS, A.y - 8 - u * 22, 3.2 + u * 1.2);
  c.globalAlpha = 1;
}

// ════════════════════════ Göletin diğer çizimleri ════════════════════════
function btSelaleCiz(c, tm) {   // şelale: akan su şeritleri, dipte köpük, buğu
  const SX = BT_SELALE.x, U = BT_SELALE.ust, A = BT_SELALE.alt, cos = BT.selaleCos, gen = 1 + .7 * cos;
  c.save();
  c.lineCap = 'round';
  c.strokeStyle = 'rgba(190,232,248,.82)'; c.lineWidth = 15 * gen;
  c.beginPath(); c.moveTo(SX, U); c.quadraticCurveTo(SX + 4, U + 18, BT_SELALE.dibX, A); c.stroke();
  c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2.2;
  c.setLineDash(BT_CIZGI);
  for (let i = -1; i <= 1; i++) {
    c.lineDashOffset = -(tm * (70 + 30 * cos) + i * 9);
    c.beginPath(); c.moveTo(SX + i * 4 * gen, U + 1); c.quadraticCurveTo(SX + 4 + i * 4.5 * gen, U + 18, BT_SELALE.dibX + i * 5 * gen, A); c.stroke();
  }
  c.setLineDash(BT_BOS);
  // dipte köpük
  for (let i = 0; i < 6; i++) {
    const a = tm * 3 + i * 1.7, r = (3 + 1.6 * Math.sin(a)) * gen;
    btEl(c, BT_SELALE.dibX - 14 * gen + i * 5.6 * gen, A + 1 + Math.sin(a * 1.3) * 1.2, r, r * .75, 0, 'rgba(255,255,255,.88)');
  }
  if (typeof glow === 'function') { c.globalAlpha = .35 + .25 * cos; c.drawImage(glow('#ffffff'), BT_SELALE.dibX - 34, A - 24, 68, 40); c.globalAlpha = 1; }
  c.restore();
}
const BT_CIZGI = [7, 11], BT_BOS = [];
function btParilti(c, tm) {   // suyun üstünde gezinen küçük ışıltılar
  c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.2; c.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = tm * (.6 + btHash(i) * .5) + i * 2.3, x = BT_GOL.x0 + 60 + btHash(i * 3.7) * (BT_GOL.x1 - BT_GOL.x0 - 120) + Math.sin(a) * 10;
    const y = BT_GOL.ust + 10 + btHash(i * 5.1) * 44, w = (4 + 4 * Math.sin(a * 1.7)) * (.6 + (y - BT_GOL.ust) / 70);
    if (w < 1 || !btEkranda(x, 20)) continue;
    c.moveTo(x - w, y); c.lineTo(x + w, y);
  }
  c.stroke();
}
function btNilCiz(c, n, tm) {
  const sp = BT.spr.nil; if (!sp) return;
  const bob = Math.sin(tm * 1.1 + n.sal) * .8;
  c.save(); c.translate(n.x, n.y + bob); c.scale(n.s, n.s);
  c.drawImage(sp, sp.x0, sp.y0, sp.w, sp.h);
  if (n.renk >= 0) {   // çiçek: taç yapraklar açıklığa göre
    const u = n.acik, ac = n.renk === 0 ? '#ffb3cd' : '#fff8f0', ik = n.renk === 0 ? '#ff86ad' : '#f2e4d4';
    const kat = n.dokT < .6 ? 1 + .2 * Math.sin(Math.PI * n.dokT / .6) : 1;
    c.translate(-3, -3); c.scale(kat, kat);
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * (.22 + .24 * u);
      c.save(); c.rotate(a + Math.PI / 2);
      btEl(c, 0, -5 - 2 * u, 2.3, 5.6, 0, i % 2 ? ac : ik);
      c.restore();
    }
    btEl(c, 0, -1.2, 3 * u + .5, 1.8 * u + .4, 0, '#ffd34d');
  }
  c.restore();
  n.hx = n.x; n.hy = n.y - 4;
}
function btHalkaCiz(c) {
  c.lineWidth = 1;
  for (const h of BT.halka) {
    if (!h.on) continue;
    const u = h.t / h.sure, r = h.r * (1 + u * 2.2);
    c.strokeStyle = 'rgba(255,255,255,' + (.7 * (1 - u) * h.a).toFixed(3) + ')';
    c.beginPath(); c.ellipse(h.x, h.y, r, r * .28, 0, 0, BT_PI2); c.stroke();
  }
  c.fillStyle = 'rgba(255,255,255,.75)'; c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = .6;
  for (const q of BT.kabarcik) {
    if (!q.on) continue;
    c.beginPath(); c.arc(q.x + Math.sin(q.t * 9) * 1.2, q.y - q.t * 8, q.r, 0, BT_PI2); c.stroke();
  }
}
function btYaprakCiz(c, tm) {   // göletin iki ön köşesinde rüzgârla salınan dev yapraklar (iskelenin arka kenarında)
  const r = Math.sin(tm * 1.2) * .05, r2 = Math.sin(tm * 1.5 + 1) * .06;
  if (btEkranda(BT_GOL.x0, 80)) { btFilKulagi(c, BT_GOL.x0 - 6, BT_GOL.alt + 1, 58, -.55 + r, '#5aa548'); btFilKulagi(c, BT_GOL.x0 + 4, BT_GOL.alt + 1, 50, -.15 + r2, '#6cb555'); }
  if (btEkranda(BT_GOL.x1, 80)) { btFilKulagi(c, BT_GOL.x1 + 4, BT_GOL.alt + 1, 56, .5 + r2, '#5aa548'); btFilKulagi(c, BT_GOL.x1 - 6, BT_GOL.alt + 1, 46, .12 + r, '#6cb555'); }
}

// Çizim sırası (arkadan öne): her karede sabit bir diziye yazılıp y'ye göre sıralanır (yeni nesne yok)
function btSiraEkle(y, tur, ref) { const s = BT.sira[BT.siraN++]; s.y = y; s.tur = tur; s.ref = ref; }
function btGoletCiz(c, tm) {
  const s = BT_STATIK;
  if (!BT.hazir) return;
  // önbellek döşemeleri
  for (let i = 0; i < 2; i++) { const d = BT.doseme[i]; if (d && btEkranda(d.x0 + d.w / 2, d.w / 2 + 20)) c.drawImage(d, d.x0, d.y0, d.w, d.h); }
  btParilti(c, tm);
  for (const b of BT.balik) if (b.durum !== 'zipla' && btEkranda(b.x, 30)) btBalikCiz(c, b, false);   // su altındaki balıklar
  if (btEkranda(BT_SELALE.x, 120)) btSelaleCiz(c, tm);
  for (const n of BT.nil) if (btEkranda(n.x, 40)) btNilCiz(c, n, tm);
  for (const f of BT.kurb) if (f.durum !== 'kiyi' && f.durum !== 'zipla' && btEkranda(f.x, 40)) btKurbCiz(c, f, tm);
  btHalkaCiz(c);
  // taşlar, kütük ve kaplumbağalar derinliğe göre
  BT.siraN = 0;
  btSiraEkle(BT_TAS2.y, 1, null);
  btSiraEkle(BT_KUTUK.y + 4, 2, null);
  btSiraEkle(BT_TAS1.y + 4, 3, null);
  btSiraEkle(BT.yuzucu.y, 4, BT.yuzucu);
  const S2 = BT.sira, n = BT.siraN;
  for (let i = 1; i < n; i++) { const a = S2[i]; let j = i - 1; while (j >= 0 && S2[j].y > a.y) { S2[j + 1] = S2[j]; j--; } S2[j + 1] = a; }
  for (let i = 0; i < n; i++) {
    const e = S2[i];
    if (e.tur === 1 && btEkranda(BT_TAS2.x, 150)) { btKoy2(c, BT.spr.tas2, BT_TAS2.x, BT_TAS2.y); btTasKp(c, tm, BT.kp[0]); }
    else if (e.tur === 2 && btEkranda((BT_KUTUK.x0 + BT_KUTUK.x1) / 2, 260)) {
      const sp = BT.spr.kutuk; c.drawImage(sp, BT_KUTUK.x0 + sp.x0, BT_KUTUK.y + sp.y0, sp.w, sp.h);
      btTasKp(c, tm, BT.kp[1]); btTasKp(c, tm, BT.kp[2]);
    }
    else if (e.tur === 3 && btEkranda(BT_TAS1.x, 200)) {
      btKoy2(c, BT.spr.tas1, BT_TAS1.x, BT_TAS1.y);
      const A = BT.aile;   // kule sırası: alttaki önce
      btTasKp(c, tm, A.anne); btTasKp(c, tm, A.y1); btTasKp(c, tm, A.y2);
      if (A.y1.alt) btTasKp(c, tm, A.y1, true);
      if (A.y2.alt) btTasKp(c, tm, A.y2, true);
      btKalpCiz(c, A.anne); btKalpCiz(c, A.y1); btKalpCiz(c, A.y2);
    }
    else if (e.tur === 4 && btEkranda(e.ref.x, 80)) btKpCizSu(c, e.ref, tm, e.ref.y);
  }
  btYaprakCiz(c, tm);
  // havadaki balık ve kurbağalar, kıyıdaki kurbağa (her şeyin önünde)
  for (const b of BT.balik) if (b.durum === 'zipla' && btEkranda(b.x, 40)) btBalikCiz(c, b, true);
  for (const f of BT.kurb) if ((f.durum === 'kiyi' || f.durum === 'zipla') && btEkranda(f.x, 60)) btKurbCiz(c, f, tm);
  // kütük ve dede kalpleri
  btKalpCiz(c, BT.kp[0]); btKalpCiz(c, BT.kp[1]); btKalpCiz(c, BT.kp[2]); btKalpCiz(c, BT.yuzucu);
}
function btKoy2(c, sp, x, y) { if (sp) c.drawImage(sp, x + sp.x0, y + sp.y0, sp.w, sp.h); }
// Bir taş/kütük kaplumbağasını durumuna göre çizer. ikinci: kule halindeki yavru (alttakinden sonra ikinci geçişte)
function btTasKp(c, tm, k, ikinci) {
  const kuleli = !!k.alt;
  if (kuleli !== !!ikinci) return;
  if (k.durum === 'kay' || k.durum === 'yuz' || k.durum === 'tirman') {
    const su = k.y0 + k.dalY - 4;   // kaplumbağanın girdiği yerdeki su çizgisi
    if (k.batik > .05) btKpCizSu(c, k, tm, su); else btKpCiz(c, k, tm);
    return;
  }
  btKpCiz(c, k, tm);
}

// ════════════════════════ İskelenin altındaki su kolu (ONPLAN zeminden önce çağırır) ════════════════════════
function bt12OnSuCiz(tm) {
  if (typeof cam === 'undefined' || !BT.hazir || !BT.spr.onSu) return;
  const O = BT_ONSU, xa = Math.max(O.x0, cam.x - 10), xb = Math.min(O.x1, cam.x + VW + 10);
  if (xa >= xb) return;
  BT.onSuKare = BT.saat;
  const c = g, alt = cam.y + H / S + 6;
  c.save(); btDunya();
  c.drawImage(BT.spr.onSu, 0, 0, 2, 60, O.x0 + 10, O.y, O.x1 - O.x0 - 20, Math.max(60, alt - O.y));
  if (btEkranda(O.x0, 60)) { btEl(c, O.x0 + 6, O.y + 14, 18, 22, 0, '#9d9686'); btEl(c, O.x0 + 2, O.y + 6, 12, 8, 0, '#bdb5a3'); }
  if (btEkranda(O.x1, 60)) { btEl(c, O.x1 - 6, O.y + 14, 18, 22, 0, '#9d9686'); btEl(c, O.x1 - 2, O.y + 6, 12, 8, 0, '#bdb5a3'); }
  c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 1.2; c.beginPath();
  for (let i = 0; i < 10; i++) {
    const x = O.x0 + 50 + btHash(i * 4.4) * (O.x1 - O.x0 - 100) + Math.sin(tm * .8 + i) * 12, y = O.y + 16 + btHash(i * 8.2) * 30;
    if (x < xa - 20 || x > xb + 20) continue;
    c.moveTo(x - 6, y); c.lineTo(x + 6, y);
  }
  c.stroke();
  for (const n of BT.onNil) if (btEkranda(n.x, 40)) btNilCiz(c, n, tm);
  c.restore();
}
globalThis.bt12OnSuCiz = bt12OnSuCiz;
globalThis.BT12_ONSU = { x0: BT_ONSU.x0, x1: BT_ONSU.x1 };   // ONPLAN iskele döşemesini bu aralıkta kısa keser

// ════════════════════════ Kırmızı balıklar (göletin sol yanı, şelalenin önü) ════════════════════════
// Beş Japon balığı suyun altında yarı saydam yüzer, kuyruk sallar; ara sıra yüzeye çıkıp ağız açar (kabarcık + halka).
// Feza kıyıya gelince (ya da suya dokununca) balıklar oraya toplanır ve biri zıplayıp suya geri düşer.
const BT_BALIK = { x0: 24736, x1: 24900, y0: 674, y1: 699 };   // şelale kayalarının sağı; büyük taşın arkasına da yüzüp kaybolabilirler
// [gövde, karın/parlak, yüzgeç] — kırmızı, turuncu, beyaz-kırmızı benekli (kohaku), altın
const BT_BALIK_RENK = [
  ['#ff6a2b', '#ffc08a', '#e2481c'], ['#ff8a2a', '#ffd79a', '#e6661c'], ['#f2482e', '#ffa48a', '#c8301c'],
  ['#fff3e6', '#ffffff', '#ff7048'], ['#ff5a3a', '#ffb6a0', '#d43a20']
];
function btBalikKur() {
  BT.balik.length = 0;
  for (let i = 0; i < BT_BALIK_RENK.length; i++) {
    const x = BT_BALIK.x0 + 40 + btHash(i * 5.7) * (BT_BALIK.x1 - BT_BALIK.x0 - 80), y = BT_BALIK.y0 + 3 + btHash(i * 2.9) * 18;
    BT.balik.push({
      x, y, vx: 0, vy: 0, yon: i % 2 ? 1 : -1, yonS: i % 2 ? 1 : -1, boy: 15 + btHash(i * 3.3) * 3, r: i, faz: i * 1.3,
      hx: x, hy: y, ht: btHash(i) * 3, derin: 1, durum: 'yuz', t: 0, yuzeyT: 2 + i * 1.7, agiz: 0, agizOldu: false,
      zx0: 0, zx1: 0, zy: 0, zh: 0, aci: 0
    });
  }
  BT.balikTop = 0; BT.topX = 0; BT.topY = 0; BT.ziplaT = -1; BT.balikGeldi = false; BT.otoZiplaT = 9;
}
function btBalikZipla(b) {   // balık sudan yay çizerek çıkar ve biraz ileride suya düşer
  if (!b || b.durum === 'zipla') return;
  for (const q of BT.balik) if (q.durum === 'zipla') return;   // aynı anda en çok bir balık havada
  b.durum = 'zipla'; b.t = 0; b.zx0 = b.x; b.zy = b.y; b.zh = 0;
  b.zx1 = clamp(b.x + b.yon * 58, BT_BALIK.x0 + 10, BT_BALIK.x1 - 10);
  if (Math.abs(b.zx1 - b.zx0) < 30) { b.yon = -b.yon; b.yonS = b.yon; b.zx1 = b.x + b.yon * 58; }
  btHalka(b.x, b.y, 8, 1, 1); btSicrat(b.x, b.y - 3, 5, .4);
  btOlay('k12BalikZipla', { x: b.x });
}
function btBalikTopla(x, y, sure, zipla) {   // balıklar (x, y) çevresine toplanır; zipla > 0 ise o kadar sonra biri zıplar
  BT.balikTop = sure;
  BT.topX = clamp(x, BT_BALIK.x0 + 50, BT_BALIK.x1 - 110);   // görünen suda: şelale kayalarının ve büyük taşın arasında
  BT.topY = clamp(y, BT_BALIK.y0 + 5, BT_BALIK.y1 - 3);
  if (zipla > 0 && BT.ziplaT < 0) BT.ziplaT = zipla;
}
function btBalikAdim(b, dt, i) {
  b.faz += dt * (7 + 9 * Math.min(1, Math.abs(b.vx) / 45));
  if (b.durum === 'zipla') {
    b.t += dt;
    const u = Math.min(1, b.t / .9);
    b.x = lerp(b.zx0, b.zx1, u); b.zh = -Math.sin(Math.PI * u) * 40;
    b.aci = -(1 - 2 * u) * 1.05;   // burnu önce yukarı, sonra aşağı (çizimde yöne göre aynalanır)
    if (u >= 1) {   // suya geri düştü
      b.durum = 'yuz'; b.t = 0; b.zh = 0; b.aci = 0; b.derin = .5; b.vx = b.yon * 30; b.x = b.zx1; b.y = b.zy;
      btHalka(b.x, b.y, 10, 1.3, 1); btHalka(b.x, b.y, 5, .9, .8); btSicrat(b.x, b.y - 4, 9, .7);
      btOlay('k12Sicrama', { guc: .45, x: b.x });
    }
    return;
  }
  // hedef: toplanma varsa toplanma noktasının çevresi, yoksa ara sıra seçilen gelişigüzel bir yer
  let hx = b.hx, hy = b.hy, hiz = 26;
  if (BT.balikTop > 0) {
    hx = BT.topX + (i - 2) * 24 + Math.sin(i * 1.9 + BT.saat * .9) * 6; hy = BT.topY + (i % 2 ? 2.5 : -2.5) + Math.sin(i * 2.3 + BT.saat * 1.3) * 1.2; hiz = 110;   // yan yana, yatay dizi
  } else {
    b.ht -= dt;
    if (b.ht <= 0 || Math.abs(hx - b.x) < 8) {
      b.hx = BT_BALIK.x0 + 20 + Math.random() * (BT_BALIK.x1 - BT_BALIK.x0 - 40);
      b.hy = BT_BALIK.y0 + 2 + Math.random() * (BT_BALIK.y1 - BT_BALIK.y0 - 4);
      b.ht = 3 + Math.random() * 4;
    }
  }
  b.vx = btYaklas(b.vx, clamp((hx - b.x) * 1.3, -hiz, hiz), dt * 2.2);
  b.vy = btYaklas(b.vy, clamp((hy - b.y) * 1.3, -10, 10), dt * 2.2);
  b.x = clamp(b.x + b.vx * dt, BT_BALIK.x0, BT_BALIK.x1); b.y = clamp(b.y + b.vy * dt, BT_BALIK.y0, BT_BALIK.y1);
  if (Math.abs(b.vx) > 4) b.yon = b.vx > 0 ? 1 : -1;
  b.yonS = btYaklas(b.yonS, b.yon, dt * 7);
  // yüzeye çıkıp ağız açma: "blup blup"
  if (b.durum === 'yuz') {
    b.yuzeyT -= dt;
    b.derin = btYaklas(b.derin, 1, dt * 1.5);
    if (b.yuzeyT <= 0) { b.durum = 'yuzey'; b.t = 0; b.agizOldu = false; }
  } else {   // 'yuzey'
    b.t += dt;
    b.derin = btYaklas(b.derin, .4, dt * 5);   // gövde yine suyun içinde; yalnız sırtı ve ağzı yüzeye değer
    b.agiz = b.t > .35 && b.t < 1.35 ? Math.abs(Math.sin((b.t - .35) * Math.PI * 3)) : 0;
    if (b.t > .4 && !b.agizOldu) {
      b.agizOldu = true;
      const ax = b.x + b.yon * b.boy * .62;
      btHalka(ax, b.y, 5, 1.2, .9); btKabarcik(ax, b.y - 2); btKabarcik(ax + 2, b.y - 4);
      if (btEkranda(ax, 0)) btOlay('k12SazanOp', { x: ax });
    }
    if (b.t > 1.6) { b.durum = 'yuz'; b.agiz = 0; b.yuzeyT = 5 + Math.random() * 7; }
  }
}
function btBalikGuncelle(dt) {
  if (!BT.balik.length) return;
  // Feza havuz kenarına gelince balıklar ona doğru toplanır, biri zıplar (her gelişte bir kez)
  const kenar = P.x > BT_BALIK.x0 - 420 && P.x < BT_BALIK.x1 + 60;
  if (kenar && !BT.balikGeldi) { BT.balikGeldi = true; btBalikTopla(P.x + 150 + Math.max(0, BT.fezaVx) * .8, BT_BALIK.y0 + 9, 4.5, 1.1); }
  if (!kenar && P.x < BT_BALIK.x0 - 900) BT.balikGeldi = false;
  // Feza yakındayken ara sıra kendiliğinden bir zıplama daha
  if (kenar) { BT.otoZiplaT -= dt; if (BT.otoZiplaT <= 0) { BT.otoZiplaT = 9 + Math.random() * 6; btBalikTopla(P.x + 150, BT_BALIK.y0 + 9, 3, .9); } }
  if (BT.balikTop > 0) BT.balikTop -= dt;
  if (BT.ziplaT >= 0) {
    BT.ziplaT -= dt;
    if (BT.ziplaT < 0) {   // toplanma noktasına en yakın balık zıplar
      let en = null, ed = 1e9;
      for (const b of BT.balik) { if (b.durum === 'zipla') continue; const d = Math.abs(b.x - BT.topX); if (d < ed) { ed = d; en = b; } }
      btBalikZipla(en);
    }
  }
  for (let i = 0; i < BT.balik.length; i++) btBalikAdim(BT.balik[i], dt, i);
}
// Bir balık (yandan): ölçek boy/14, sağa bakar; yonS ile aynalanır (dönerken incelir)
function btBalikCiz(c, b, havada) {
  const R = BT_BALIK_RENK[b.r], s = b.boy / 14 * btDerin(b.y + 4);
  const kuyruk = Math.sin(b.faz) * .45, yuzgec = Math.sin(b.faz * .8 + 1) * .35;
  if (!havada) {   // su altındaki gölgesi (biraz aşağıda, koyu)
    c.globalAlpha = .13 * (1 - b.derin * .4); btEl(c, b.x, b.y + 4, 10 * s, 2.4 * s, 0, '#1d4a5a');
  }
  c.save();
  c.translate(b.x, b.y + b.zh); c.rotate(b.aci * b.yon); c.scale(b.yonS * s, s);
  c.globalAlpha = havada ? 1 : .95 - b.derin * .2;   // suyun içinde yarı saydam
  // kuyruk (yelpaze, sallanır)
  c.save(); c.translate(-8, 0); c.rotate(kuyruk);
  c.fillStyle = R[2]; c.beginPath(); c.moveTo(1, 0);
  c.quadraticCurveTo(-4, -7, -10, -7); c.quadraticCurveTo(-6.5, 0, -10, 7); c.quadraticCurveTo(-4, 7, 1, 0); c.fill();
  c.fillStyle = R[1]; c.globalAlpha *= .5; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(-4, -4, -8, -5); c.quadraticCurveTo(-5, 0, 0, 0); c.fill();
  c.restore();
  c.globalAlpha = havada ? 1 : .95 - b.derin * .2;
  // sırt yüzgeci
  c.fillStyle = R[2]; c.beginPath(); c.moveTo(-4, -3.6); c.quadraticCurveTo(-1, -8.5, 3, -4); c.closePath(); c.fill();
  // gövde, karın, pullu parıltı
  btEl(c, 0, 0, 9.5, 4.6, 0, R[0]);
  btEl(c, 1.5, 1.9, 6.5, 1.8, 0, R[1]);
  btEl(c, -.5, -2.2, 5, 1.1, -.05, 'rgba(255,255,255,.45)');
  if (b.r === 3) { btEl(c, 1.5, -1.6, 3.6, 2.3, .2, '#ff5a2e'); btEl(c, -5, -.4, 2.4, 2, 0, '#ff6a3a'); }   // beyaz balığın kırmızı benekleri
  // göğüs yüzgeci (çırpar)
  c.save(); c.translate(2, 2.6); c.rotate(.6 + yuzgec); btEl(c, -2.4, 0, 3, 1.3, 0, R[2]); c.restore();
  // göz ve ağız
  btEl(c, 5.6, -1.1, 1.7, 1.7, 0, '#ffffff'); btEl(c, 6, -1.1, 1, 1, 0, '#222'); btEl(c, 5.6, -1.7, .45, .45, 0, '#fff');
  if (b.agiz > .05) btEl(c, 9.3, .2, .7 + b.agiz * .6, .5 + b.agiz * 1.1, 0, '#8a2a1c');
  if (!havada) {
    // üstündeki su: gövde ve kuyruk su rengine karışır (derinde daha çok)
    c.globalAlpha = .14 + .12 * b.derin; btEl(c, -3.5, .3, 15.5, 6.6, 0, '#5eabc6');
    // yüzeye yakınken sırtta ve ağızda ince su çizgisi (yüzey burada)
    if (b.derin < .8) {
      c.globalAlpha = (.8 - b.derin) * 1.6; c.strokeStyle = '#ffffff'; c.lineWidth = .9;
      c.beginPath(); c.moveTo(-7, -4.6); c.quadraticCurveTo(1, -6, 10, -4.4); c.stroke();
    }
  }
  c.restore();
  c.globalAlpha = 1;
}

// ════════════════════════ Kurbağalar (göletin sağ yanı, nilüfer yapraklarında) ════════════════════════
// Üç yeşil kurbağa: iri parlak gözler, gülen ağız, pembe yanak. Boğaz kesesini şişirip "vırak" der; Feza yaklaşınca ya da
// dokununca yapraktan yaprağa zıplar (yay çizer, konunca yaprak sallanır, suda halka). Biri Feza'nın yanına, kıyıya zıplar ve ona bakar.
// Dil fırlatma / böcek YOK.
const BT_KURB_RENK = [['#6cc04a', '#4f9a38', '#e8f6b4'], ['#82cc56', '#5ea83f', '#eef8c0'], ['#5db76a', '#43944f', '#e2f4c4']];
function btKurbKur() {
  BT.kPed.length = 0; BT.kurb.length = 0;
  for (let i = 0; i < BT.nil.length; i++) if (BT.nil[i].renk < 0 && BT.nil[i].x > 25800) BT.kPed.push(i);
  const ilk = [0, 2, 3];
  for (let i = 0; i < 3; i++) {
    const n = BT.nil[BT.kPed[ilk[i]]];
    BT.kurb.push({
      ped: BT.kPed[ilk[i]], x: n.x, y: n.y - 1, yon: -1, yonS: -1, r: i, boy: i === 1 ? .85 : 1,
      durum: 'otur', t: 0, kese: 0, keseT: 9, virakT: 1.5 + i * 2.2, kirpT: 2 + i, kapak: 0, bakX: 0, sevT: 0,
      zx0: 0, zy0: 0, zx1: 0, zy1: 0, zh: 0, zs: .5, u: 0, kiyiye: false, hedefPed: -1, hx: 0, hy: 0
    });
  }
  BT.kurbKiyi = false;
}
function btKurbBosPed(f) {   // başka kurbağanın oturmadığı/gitmediği gelişigüzel bir yaprak
  let say = 0, sec = -1;
  for (const p of BT.kPed) {
    if (p === f.ped) continue;
    let dolu = false;
    for (const q of BT.kurb) if (q !== f && ((q.durum !== 'zipla' && q.durum !== 'kiyi' && q.ped === p) || q.hedefPed === p)) dolu = true;
    if (dolu) continue;
    say++; if (Math.random() * say < 1) sec = p;
  }
  return sec;
}
function btKurbZipla(f, x1, y1, ped, kiyiye) {
  const yapraktan = f.durum === 'otur' && f.ped >= 0;
  f.durum = 'zipla'; f.t = 0; f.u = 0; f.zx0 = f.x; f.zy0 = f.y; f.zx1 = x1; f.zy1 = y1; f.kiyiye = kiyiye; f.hedefPed = ped;
  const d = Math.abs(x1 - f.x);
  f.zh = 18 + d * .16; f.zs = .42 + d * .0013;
  if (d > 2) { f.yon = x1 > f.x ? 1 : -1; f.yonS = f.yon; }
  if (yapraktan) { const n = BT.nil[f.ped]; btHalka(n.x, n.y, 7, .8, .7); }
  btOlay('k12KurbagaZipla', { x: f.x, kiyi: kiyiye });
}
function btKurbYaprakla(f) {   // boş bir yaprağa zıpla (yoksa olduğu yerde sevinçle hopla)
  const p = btKurbBosPed(f);
  if (p >= 0) { const n = BT.nil[p]; btKurbZipla(f, n.x, n.y - 1, p, false); }
  else btKurbZipla(f, f.x, f.y, f.ped, f.durum === 'kiyi');
}
function btVirak(f) {
  f.keseT = 0;
  if (btEkranda(f.x, 0)) btOlay('k12KurbagaVirak', { x: f.x, n: f.r });
}
function btKurbAdim(f, dt, i) {
  f.t += dt; f.sevT -= dt; f.keseT += dt;
  // kese: 0,9 sn'de iki kez şişer
  f.kese = f.keseT < .9 ? Math.abs(Math.sin(f.keseT / .9 * BT_PI2)) : 0;
  // göz kırpma
  f.kirpT -= dt; if (f.kirpT <= 0) { f.kapak = 1; f.kirpT = 2.5 + Math.random() * 3; }
  f.kapak = Math.max(0, f.kapak - dt * 7);
  f.bakX = btYaklas(f.bakX, clamp((P.x - f.x) / 150, -1, 1), dt * 6);
  if (f.durum === 'zipla') {
    f.u = Math.min(1, f.t / f.zs);
    f.x = lerp(f.zx0, f.zx1, f.u); f.y = lerp(f.zy0, f.zy1, f.u) - Math.sin(Math.PI * f.u) * f.zh;
    if (f.u >= 1) {
      f.t = 0;
      if (f.kiyiye) { f.durum = 'kiyi'; f.virakT = .6; f.hedefPed = -1; }
      else {
        f.durum = 'otur'; f.ped = f.hedefPed >= 0 ? f.hedefPed : btPedBul(f.zx1); f.hedefPed = -1;
        const n = BT.nil[f.ped]; n.dokT = 0; n.kurbT = 0;
        btHalka(n.x, n.y + 1, 12, 1.1, 1); btHalka(n.x, n.y + 1, 6, .8, .7); btSicrat(n.x, n.y - 2, 4, .3);
        btOlay('k12Sicrama', { guc: .3, x: n.x });
      }
    }
    return;
  }
  const dx = P.x - f.x, yakin = Math.abs(dx) < 420;
  if (yakin && Math.abs(dx) > 12) f.yon = dx > 0 ? 1 : -1;
  f.yonS = btYaklas(f.yonS, f.yon, dt * 8);
  // vırak: Feza bölgedeyken ara sıra
  f.virakT -= dt;
  if (f.virakT <= 0) { f.virakT = 3.5 + Math.random() * 4.5; if (Math.abs(dx) < 900) btVirak(f); }
  if (f.durum === 'kiyi') {   // kıyıda Feza'ya bakar; Feza uzaklaşınca ya da bir süre sonra yaprağına döner
    if (f.t > 2.5 && (Math.abs(dx) > 280 || f.t > 8)) btKurbYaprakla(f);
    return;
  }
  // Feza yaklaşınca bir yapraktan ötekine zıplar
  if (f.sevT <= 0 && Math.abs(dx) < 130 && BT.fezaVx > 15) { f.sevT = 5 + Math.random() * 3; btKurbYaprakla(f); return; }
  // meraklı kurbağa (ilk): Feza göletin sağ ucuna gelince onun yanına, kıyıya zıplar
  if (i === 0 && !BT.kurbKiyi && P.x > 25640 && P.x < BT_GOL.x1 + 60 && Math.abs(dx) < 330) {
    BT.kurbKiyi = true; f.sevT = 3;
    const kx = clamp(P.x + (dx > 0 ? -1 : 1) * 46 + BT.fezaVx * .5, BT_GOL.x0 + 60, BT_GOL.x1 + 30);
    btKurbZipla(f, kx, BT_ISKELE.y - 1, -1, true);
  }
}
function btPedBul(x) { let en = BT.kPed[0], ed = 1e9; for (const p of BT.kPed) { const d = Math.abs(BT.nil[p].x - x); if (d < ed) { ed = d; en = p; } } return en; }
function btKurbGuncelle(dt) {
  if (!BT.kurb.length) return;
  if (P.x < BT_GOL.x0 - 700 || P.x > BT_GOL.x1 + 1400) BT.kurbKiyi = false;
  for (let i = 0; i < BT.kurb.length; i++) btKurbAdim(BT.kurb[i], dt, i);
}
// Kurbağa (yandan, sağa bakar; yonS ile aynalanır). (x, y) ayakların bastığı yer; boy ~22 birim.
function btKurbCiz(c, f, tm) {
  const R = BT_KURB_RENK[f.r], s = 1.5 * f.boy * btDerin(f.durum === 'kiyi' || f.kiyiye ? BT_GOL.alt : f.y);
  let bob = 0;
  if (f.durum === 'otur' && f.ped >= 0) { const n = BT.nil[f.ped]; bob = Math.sin(tm * 1.1 + n.sal) * .8 + (n.kurbT < .5 ? Math.sin(n.kurbT / .5 * Math.PI) * 2 : 0); }
  const zip = f.durum === 'zipla' ? Math.sin(Math.PI * f.u) : 0;   // havadayken bacaklar uzar
  c.save();
  c.translate(f.x, f.y + bob); c.scale(f.yonS * s, s);
  if (f.durum === 'zipla') c.rotate(-(1 - 2 * f.u) * .45);
  // arka bacak: oturunca katlanmış iri but, zıplarken geriye uzanır
  if (zip > .15) {
    c.strokeStyle = R[1]; c.lineWidth = 3.4; c.beginPath(); c.moveTo(-5, -6); c.lineTo(-12 - 4 * zip, -2 + 3 * zip); c.lineTo(-19 - 6 * zip, 1 + 4 * zip); c.stroke();
    btEl(c, -21 - 6 * zip, 1.5 + 4 * zip, 3.6, 1.6, .3, R[1]);
  } else {
    btEl(c, -3, -.8, 7, 1.9, 0, R[1]);   // ayak
    btEl(c, -6, -5.5, 7.5, 5.4, -.25, R[1]);   // but
    btEl(c, -6.5, -6.6, 5, 3, -.25, R[0]);
  }
  // gövde
  c.fillStyle = R[0]; c.beginPath(); c.ellipse(0, -9, 10.5, 8.2, -.22, 0, BT_PI2); c.fill();
  btEl(c, 3.6, -5.8, 6.4, 4.6, -.1, R[2]);   // açık renk karın
  btEl(c, -4, -13.5, 2, 1.4, 0, R[1]); btEl(c, -7.5, -9.5, 1.6, 1.2, 0, R[1]); btEl(c, -1, -15.5, 1.3, 1, 0, R[1]);   // benekler
  btEl(c, -2, -14.5, 5, 1.6, -.25, 'rgba(255,255,255,.35)');   // parıltı
  // ön bacak
  c.strokeStyle = R[0]; c.lineWidth = 2.6;
  c.beginPath(); c.moveTo(5.5, -6); c.lineTo(zip > .15 ? 10 + 3 * zip : 7.5, zip > .15 ? -3 : -.6); c.stroke();
  btEl(c, zip > .15 ? 11 + 3 * zip : 8.6, zip > .15 ? -2.6 : -.5, 2.4, 1.1, 0, R[1]);
  // boğaz kesesi ("vırak")
  if (f.kese > .03) {
    const kr = 1.5 + f.kese * 5;
    btEl(c, 8.2, -6.4 + kr * .2, kr, kr * .85, 0, '#f6f2c4');
    btEl(c, 7.4 - kr * .2, -7 - kr * .1, kr * .4, kr * .25, 0, 'rgba(255,255,255,.8)');
  }
  // ağız: geniş gülümseme, yanak
  c.strokeStyle = '#2f5a2a'; c.lineWidth = 1.1;
  c.beginPath(); c.moveTo(3.5, -10.6); c.quadraticCurveTo(8.5, -7.4, 12.2, -10.6); c.stroke();
  c.globalAlpha = .75; btEl(c, 7, -10.2, 2.1, 1.3, 0, '#ff9ab4'); c.globalAlpha = 1;
  btEl(c, 11.4, -12.4, .45, .35, 0, '#2f5a2a');   // burun deliği
  // iri gözler: başın üstünde iki kubbe (arkadaki biraz küçük)
  for (let k = 0; k < 2; k++) {
    const ex = k ? 2.4 : 7.8, ey = k ? -17.6 : -16.8, er = k ? 3.6 : 4.3;
    btEl(c, ex, ey, er + 1, er + .8, 0, R[0]);
    btEl(c, ex + .3, ey - .2, er * .78, er * .78, 0, '#ffffff');
    const px = ex + .3 + f.bakX * f.yonS * er * .28 + .4;
    btEl(c, px, ey, er * .48, er * .52, 0, '#1f2a22');
    btEl(c, px - er * .18, ey - er * .25, er * .17, er * .17, 0, '#ffffff');
    if (f.kapak > .05) { c.fillStyle = R[0]; c.beginPath(); c.ellipse(ex + .3, ey - .2, er * .82, er * .82 * f.kapak, 0, Math.PI, BT_PI2); c.fill(); }
  }
  c.restore();
}
function btKurbIsabet(wx, wy) {
  for (const f of BT.kurb) {
    const ux = (wx - f.x) / 32, uy = (wy - (f.y - 14)) / 26;
    if (ux * ux + uy * uy < 1) return f;
  }
  return null;
}
function btBalikIsabet(wx, wy) {
  let en = null, ed = 1;
  for (const b of BT.balik) {
    const ux = (wx - b.x) / 22, uy = (wy - (b.y + b.zh)) / 15, d = ux * ux + uy * uy;
    if (d < ed) { ed = d; en = b; }
  }
  return en;
}

// ════════════════════════ Kare güncellemesi ════════════════════════
function btKare(dt) {
  BT.saat += dt;
  // Feza'nın gerçek hızı
  const dpx = Number.isFinite(BT.sonPX) ? P.x - BT.sonPX : 0; BT.sonPX = P.x;
  BT.fezaVx = Math.abs(dpx) > 300 ? 0 : btYaklas(BT.fezaVx, dpx / Math.max(dt, .001), dt * 8);
  const yakin = P.x > BT_GOL.x0 - 260 && P.x < BT_GOL.x1 + 260;
  if (yakin && !BT.yakin) { BT.bakSay++; btOlay('k12KaplumbagaBak', { x: P.x, n: BT.bakSay }); }
  BT.yakin = yakin;
  for (const k of BT.kp) {
    if (k.rol === 'yuzucu') btYuzucu(k, dt, yakin);
    else if (k.rol === 'yurur') btYurur(k, dt);
    else btKpGuncelle(k, dt, yakin);
  }
  // ilk bakışta bir kez "pop" sesi (Pırıl'ın "Bak, kaplumbağalar!" cümlesi için)
  if (yakin && !BT.ilkKafa) for (const k of BT.kp) if (k.durum === 'bak' && k.t < dt * 1.5) { BT.ilkKafa = true; btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y }); break; }
  if (!yakin && P.x < BT_GOL.x0 - 700) { BT.ilkKafa = false; BT.goster = false; BT.otoKule = false; BT.otoDal = false; BT.otoKule3 = false; }
  // kendiliğinden olanlar (dokunulmasa da güzel şeyler olur)
  if (!BT.otoKule && P.x > BT_TAS1.x - 60 && P.x < BT_TAS1.x + 300) { BT.otoKule = true; if (BT.kule === 0) btKuleIlerle(true); }
  if (!BT.otoDal && P.x > BT_KUTUK.x0 - 40 && P.x < BT_KUTUK.x1) { BT.otoDal = true; btDal(BT.kp[1]); }
  if (BT.kule === 2 || BT.kule === 4) { BT.kuleT += dt; if (BT.kuleT > (BT.kule === 4 ? 6 : 9) ) btKuleIn(); }
  if (BT.kule === 2 && BT.kuleT > 3.5 && Math.abs(P.x - BT_TAS1.x) < 200 && !BT.otoKule3) { BT.otoKule3 = true; btTirmanBasla(BT.aile.y2, BT.aile.y1); BT.kule = 3; }
  // anne Feza'ya kaplumbağaları gösterir (bir kez; kısa poz, takip bozulmaz)
  if (!BT.goster && P.x > BT_GOSTER && P.x < BT_GOSTER + 400 && BT.fezaVx > 20 && typeof ANNE12 !== 'undefined' && ANNE12 && typeof ANNE12.kisaPoz === 'function') {
    let ok = false;
    try { ok = ANNE12.kisaPoz('isaret', 1.7, { aci: .05 }) !== false; } catch (e) { ok = false; }
    if (ok) { BT.goster = true; btOlay('k12AnneGoster', { x: P.x }); }
  }
  // havuzlar ve nilüferler
  for (const h of BT.halka) if (h.on) { h.t += dt; if (h.t >= h.sure) h.on = false; }
  for (const q of BT.kabarcik) if (q.on) { q.t += dt; if (q.t > 1) q.on = false; }
  for (const n of BT.nil) btNilAdim(n, dt);
  for (const n of BT.onNil) btNilAdim(n, dt);
  BT.selaleCos = btYaklas(BT.selaleCos, 0, dt * .9);
  btBalikGuncelle(dt);
  btKurbGuncelle(dt);
}
function btNilAdim(n, dt) {
  n.dokT += dt; n.kurbT += dt;
  if (n.renk < 0) return;
  const yakinF = Math.abs(P.x - n.x) < 170;
  n.acik = btYaklas(n.acik, Math.max(n.acH, yakinF ? 1 : .15), dt * 1.6);
}

// ════════════════════════ Dokunma ════════════════════════
function btTepki(k) {
  btOlay('k12KaplumbagaDokun', { x: k.x, y: k.y });
  k.kalpT = 0;
  if (k.rol === 'yuzucu') {
    if (k.durum === 'yuz') { k.durum = 'dal'; k.t = 0; btHalka(k.x, k.y - 3, 10, 1.1, 1); btSicrat(k.x, k.y - 4, 5, .5); btOlay('k12KaplumbagaDal', { x: k.x, y: k.y }); }
    return;
  }
  if (k.rol === 'yurur') {
    if (k.durum !== 'gir') { k.durum = 'gir'; k.t = 0; k.basH = 0; k.uzuvH = 0; k.vx = 0; btOlay('k12KaplumbagaPop', { x: k.x, y: k.y, faz: 'gir' }); }
    return;
  }
  if (k.rol === 'anne' || k.rol === 'yavru') {
    if (BT.kule === 0 || BT.kule === 2 || BT.kule === 4) {
      if (k.rol === 'anne' && BT.kule >= 2) {   // kule varken anneye dokunuş: anne zıplar, yavrular hoplar
        k.popT = 0; if (BT.aile.y1.alt) BT.aile.y1.popT = 0; if (BT.aile.y2.alt) BT.aile.y2.popT = 0;
        btYildiz(k.x, k.y - 30); btOlay('k12KaplumbagaKafa', { x: k.x, y: k.y });
        BT.kuleT = Math.min(BT.kuleT, 2);
        if (BT.kule === 2 && BT.aile.y2.durum !== 'tirmanK') btKuleIlerle(false);
      } else btKuleIlerle(false);
    } else if (k.durum === 'bak' || k.durum === 'gunes') btPop(k);
    return;
  }
  // dede ve kütük kardeşler: sırayla pop / suya kayma
  if (k.durum !== 'gunes' && k.durum !== 'bak') return;
  const tp = k.tepkiler || 'p', ne = tp[k.tepki % tp.length]; k.tepki++;
  if (ne === 'd') btDal(k); else btPop(k);
}
function btIsabet(wx, wy) {
  let en = null, ed = 1;
  for (const k of BT.kp) {
    if (k.durum === 'dal') continue;
    const ux = (wx - k.hx) / k.hrx, uy = (wy - k.hy) / k.hry, d = ux * ux + uy * uy;
    if (d < ed) { ed = d; en = k; }
  }
  return en;
}
function btDokun(wx, wy) {
  // kurbağa: "vırak" + zıplar (kıyıdaysa olduğu yerde sevinçle hoplar)
  const f = btKurbIsabet(wx, wy);
  if (f && f.durum !== 'zipla') { btVirak(f); f.sevT = 2; if (f.durum === 'kiyi') { f.t = 0; btKurbZipla(f, f.x, f.y, -1, true); } else btKurbYaprakla(f); return true; }
  // balık: dokunulan balık zıplar, ötekiler oraya toplanır
  const b = btBalikIsabet(wx, wy);
  if (b) { btBalikTopla(wx, wy, 3, -1); btBalikZipla(b); return true; }
  const k = btIsabet(wx, wy);
  if (k) { btTepki(k); return true; }
  // şelale
  if (Math.abs(wx - BT_SELALE.x) < 42 && wy > BT_SELALE.ust - 24 && wy < BT_SELALE.alt + 12) {
    BT.selaleCos = 1; btSicrat(BT_SELALE.dibX, BT_SELALE.alt - 4, 10, 1);
    btHalka(BT_SELALE.dibX, BT_SELALE.alt + 4, 12, 1.2, 1); btHalka(BT_SELALE.dibX + 20, BT_SELALE.alt + 8, 8, 1, .7);
    btOlay('k12Selale', { x: BT_SELALE.x, guc: 1 });
    return true;
  }
  // nilüferler (arka ve ön)
  const nl = BT.onSuKare === BT.saat || BT.saat - BT.onSuKare < .1 ? 2 : 1;
  for (let L = 0; L < nl; L++) for (const n of (L ? BT.onNil : BT.nil)) {
    if (Math.abs(wx - n.x) < 30 * n.s && Math.abs(wy - (n.y - 4)) < 18) {
      n.dokT = 0;
      if (n.renk >= 0) n.acH = n.acH > .5 ? .15 : 1; else btHalka(n.x, n.y, 10, 1, .8);
      btOlay('k12BotNilufer', { x: n.x });
      return true;
    }
  }
  // suya dokunuş: halka (Feza'nın yürümesini engellemez)
  if (wx > BT_GOL.x0 + 20 && wx < BT_GOL.x1 - 20 && wy > BT_GOL.ust + 4 && wy < BT_GOL.alt) {
    btHalka(wx, wy, 9, 1.2, .9); btHalka(wx, wy, 4, .8, .6);
    btOlay('k12BotSuDokun', { x: wx });
    // balıkların yanına dokunuş: toplanırlar, biri zıplar (yürümeyi engellemez)
    if (wx > BT_BALIK.x0 - 40 && wx < BT_BALIK.x1 + 40) btBalikTopla(wx, wy, 3.5, .8);
  }
  return false;
}
function btDokunus(e) {
  if (typeof DURUM === 'undefined' || DURUM !== 'oyun' || e.target !== cv || !BT.o || !BT.hazir) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (P.ucus) return;
  if (typeof dugmede === 'function' && dugmede(e.clientX, e.clientY)) return;   // zıplama düğmesi hep Feza'nın
  const r = cv.getBoundingClientRect();
  const wx = cam.x + (e.clientX - r.left) * DPR / S, wy = cam.y + (e.clientY - r.top) * DPR / S;
  if (!Number.isFinite(wx) || wx < BT_STATIK.x0 - 400 || wx > BT_STATIK.x1 + 400) return;
  let vurdu = false;
  try { vurdu = btDokun(wx, wy); } catch (err) { vurdu = false; if (typeof omHataBildir === 'function') omHataBildir('botanik12.dokun', err); }
  if (vurdu) { if (e.cancelable) e.preventDefault(); e.stopPropagation(); }
}
addEventListener('pointerdown', btDokunus, true);

// ════════════════════════ Tür ════════════════════════
TUR.kaydet('k12Botanik', {
  kur(o) {
    BT.o = o;
    o.x0 = o.x0 || 560 * T; o.x1 = o.x1 || 700 * T;
    btKur();
  },
  guncelle(o, dt) {
    // çizim ayıklaması o.x'e bakar: bölgedeyken nesne hep kameranın ortasında dursun
    if (typeof cam !== 'undefined') o.x = clamp(cam.x + VW / 2, o.x0, o.x1);
    if (Math.abs(P.x - (BT_STATIK.x0 + BT_STATIK.x1) / 2) > 4200) return;   // uzaktayken hiç çalışma
    if (!BT.hazir) btKurAdim();
    if (!(dt > 0)) return;
    btKare(Math.min(dt, .05));
  },
  ciz(o, tm) {
    if (!BT.hazir || typeof cam === 'undefined') return;
    const c = g;
    if (cam.x + VW > BT_STATIK.x0 - 60 && cam.x < BT_STATIK.x1 + 60) btGoletCiz(c, tm);
    const yr = BT.yurur;
    if (yr && btEkranda(yr.x, 60)) { btKpCiz(c, yr, tm); btKalpCiz(c, yr); }
  }
});

// Test kancası (vlib12 ile): BOTANIK12.BT, BOTANIK12.dokun(i), BOTANIK12.isabet(wx, wy), BOTANIK12.durum()
globalThis.BOTANIK12 = {
  BT, dokun: i => btTepki(BT.kp[i]), balikZipla: i => btBalikZipla(BT.balik[i]), kurbZipla: i => btKurbYaprakla(BT.kurb[i]), isabet: btIsabet, dokunXY: btDokun,
  durum: () => BT.kp.map(k => k.rol[0] + ':' + k.durum).join(' ') + ' kule' + BT.kule,
  ekran: k => { const r = cv.getBoundingClientRect(); return { x: r.left + (k.hx - cam.x) * S / DPR, y: r.top + (k.hy - cam.y) * S / DPR }; }
};
})();
