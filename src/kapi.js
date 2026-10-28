/* kapi.js – mini oyun kapısı ("rüya perdesi", önek kp). Şarkı çiçekleri (sarki.js), takımyıldızı çiz (takim.js) ve bulut şekilleri (sekil.js)
   yürüyüp geçilebildiği için fark edilmiyordu: mini oyunun hemen ilerisine yumuşak, ışıklı bir perde gerilir ve oyun bitene kadar Feza'yı
   o noktada tutar (sert değil: ışık dalgalanır, hafif bir çan çalar). Mini oyun bitince perde ışık zerrelerine dağılır, yol açılır.
   Çocuk takılmasın diye mini oyunların kendi "geç yardım"ları (Pırıl'ın ipucu/dokunuşu) devreye girer; perde yalnız ileri yönü tutar,
   geri yürümek her zaman serbesttir. Yazı yok, yeni ses kaydı yok.
   Yerleşim (bolum*.js): nesne('miniKapi', c, yuzey(c), { bagId: <mini oyun nesnesinin id'si>, stil: 'sarki'|'takim'|'sekil' }).
   Bağlı nesnenin bittiği: sarki .sk.bitti · takim .tk.bitti · sekil .skl.bitti. Sözleşme: src/SPEC.md. */
'use strict';
const KP_RENK = { sarki: ['#7fe9ff', '#c9a2ff', '#ff9fd3'], takim: ['#ffe08a', '#7fe9ff', '#c9a2ff'], sekil: ['#ffb3d9', '#c9a2ff', '#ffe5a0'], cadi: ['#ffb347', '#c39bff', '#7dffc4'], ejder: ['#b89cff', '#6fd8a8', '#ffd27a'], sato: ['#c39bff', '#cfe6ff', '#ff8fb0'] };   // sato: Bölüm 11 lila, ay gümüşü, çilek pembesi   // ejder: Bölüm 9 lila, nane, altın
const KP_YUK = 250;     // perdenin yüksekliği (zeminden yukarı)
const KP_TUT = 220;     // perdenin ötesinde, bu kadar uzaklığa kadar "geçmiş" sayılmaz (yeniden doğan/taşınan Feza takılmasın)
// B8: kabak yüzü / iskelet orkestrası / Cadı Nine'nin kazanı bitince (modülün V8 bayrağı, o.done ya da oyun.js'in olayla yazdığı o.om8)
const KP_B8 = { kabakYuzMini: 'kabakYuz', iskeletMini: 'iskelet', kazanMini: 'kazan' };
// B9: yavrulara meyve / uçma dersi / Büyükanne'nin pul kolyesi bitince (V9 bayrağı, o.done ya da oyun.js'in olayla yazdığı o.om9)
const KP_B9 = { meyveMini: 'meyve', kanatMini: 'kanat', kolyeMini: 'kolye' };
// B11: ayna salonu / org konseri / Vampir Nine'nin pastası bitince (V11 bayrağı, o.done, o.tk.bitti ya da oyun.js'in olayla yazdığı o.om11)
const KP_B11 = { aynaSalonMini: 'salon', orgMini: 'org', pastaMini: 'pasta' };
function kpBitti(b) { return !!b && !!((b.sk && b.sk.bitti) || (b.tk && b.tk.bitti) || (b.skl && b.skl.bitti) || (b.tip === 'halkaMini' && (b.done || typeof V6 !== 'undefined' && V6.mini)) || (b.tip === 'kizakMini' && (b.done || typeof V7 !== 'undefined' && V7.kizak)) || (b.tip === 'kardanMini' && (b.done || typeof V7 !== 'undefined' && V7.kardan)) ||
  (KP_B8[b.tip] && (b.done || b.om8 || typeof V8 !== 'undefined' && V8[KP_B8[b.tip]])) || (KP_B9[b.tip] && (b.done || b.om9 || typeof V9 !== 'undefined' && V9[KP_B9[b.tip]])) || (KP_B11[b.tip] && (b.done || b.om11 || typeof V11 !== 'undefined' && V11[KP_B11[b.tip]]))); }   // B6: halka kapma, B7: kardan adam bitince
// Asla takılmasın: bağlı nesne yoksa ya da türünün dosyası yüklenemediyse (zayıf ağ) perde açıktır. Mini oyun bir hata yüzünden hiç
// bitmezse son çare: Feza perdenin önünde toplam KP_SABIR sn bekleyince (mini oyunların kendi Pırıl yardımı ~25 sn'de gelir) perde açılır.
const KP_SABIR = 120;
function kpYok(o) { return !o.bag || !(typeof TUR !== 'undefined' && TUR.al(o.bag.tip)); }
TUR.kaydet('miniKapi', {
  kur(o) { o.a = 1; o.acik = false; o.acT = 0; o.vur = 0; o.ph = Math.random() * 6.283; o.bag = null; o.bekle = 0; o.stil = KP_RENK[o.stil] ? o.stil : 'sarki';
    if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 8) o.stil = 'cadi';   // Balkabağı Gecesi: kabak turuncusu, lila, nane
    if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 9) o.stil = 'ejder';  // Ejderha Vadisi: Pırıl leylağı, nane, altın
    if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 11) o.stil = 'sato';   // Ay Işığı Şatosu: lila, ay gümüşü, çilek pembesi
    o.grads = null; },
  guncelle(o, dt) {
    if (!o.bag && !o.bagArandi) { o.bag = NESNELER.find(n => n.id === o.bagId) || null; o.bagArandi = true; }
    o.ph += dt; o.vur = Math.max(0, o.vur - dt * 1.4);
    if (!o.acik && (kpBitti(o.bag) || kpYok(o) || o.bekle > KP_SABIR)) {
      if (o.bekle > KP_SABIR) console.warn('[kapi] mini oyun bitmedi, perde açıldı:', o.bagId);
      o.acik = true; o.acT = 0;
      burst(o.x, o.y - KP_YUK * 0.5, 42, KP_RENK[o.stil], 240, 1.6, 10);
      burst(o.x, o.y - KP_YUK * 0.25, 24, ['#ffffff', ...KP_RENK[o.stil]], 180, 1.3, 7);
      if (typeof AU !== 'undefined' && AU && AU.sfx) { try { AU.sfx('cicek', 1); } catch (e) {} }
    }
    if (o.acik) { o.acT += dt; o.a = Math.max(0, 1 - o.acT / 1.6); return; }
    if (DURUM !== 'oyun' || P.fade > 0 || P.ucus) return;
    if (P.x > o.x - 14 && P.x < o.x + KP_TUT) {   // ileri yönde perdeden geçilmez (geri yürümek serbest)
      P.x = o.x - 14; if (P.vx > 0) P.vx = 0;
      o.bekle += dt;   // perdenin önünde geçen süre (son çare sayacı)
      // Pırıl'ın yardımı (Bölüm 8, 9): Feza perdeye ~5 sn dayanıp kaldıysa Pırıl mini oyunu gösterir (piril.js 'kayboldu' → yol gösterme; 10 sn'de bir)
      if ((BOLUM_NO === 8 || BOLUM_NO === 9 || BOLUM_NO === 11) && o.bekle - (o.ipucuT || 0) > 5 && o.bag && !kpYok(o)) { o.ipucuT = o.bekle + 5; OLAY.emit('kayboldu', o.bag); }
      if (o.vur < 0.25) {
        o.vur = 1;
        burst(o.x, P.y - 30, 5, KP_RENK[o.stil], 45, 0.5, 4);
        if (typeof AU !== 'undefined' && AU && AU.sfx) { try { AU.sfx('cicek', 0.5); } catch (e) {} }
      }
    }
  },
  ciz(o, tm) {
    if (o.a < 0.01 || o.x < cam.x - 120 || o.x > cam.x + VW + 120) return;
    const R = KP_RENK[o.stil], yb = o.y + 4, yt = o.y - KP_YUK, al = o.a * (0.78 + 0.14 * Math.sin(tm * 1.4 + o.ph)) + o.vur * 0.25 * o.a;
    // gradyanları önbellekle (iPad 60 FPS: karede createLinearGradient yok)
    if (!o.grads) {
      o.grads = R.map(col => {
        const gr = g.createLinearGradient(0, yb, 0, yt);
        gr.addColorStop(0, col + 'ee'); gr.addColorStop(0.55, col + '99'); gr.addColorStop(1, col + '00');
        return gr;
      });
    }
    // alttan yukarı sönen üç renkli ışık şeridi demeti (ipeksi salınır)
    g.save(); g.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      g.strokeStyle = o.grads[i % 3]; g.lineWidth = 13 + (i % 2) * 5; g.globalAlpha = Math.min(1, al);
      const bx = o.x + (i - 2.5) * 11;
      g.beginPath();
      for (let s = 0; s <= 10; s++) { const u = s / 10, y = yb - u * (yb - yt), x = bx + Math.sin(tm * 1.1 + i * 1.3 + u * 5) * (4 + 9 * u) * (1 + o.vur * 0.6); if (s) g.lineTo(x, y); else g.moveTo(x, y); }
      g.stroke();
    }
    g.restore();
    dglow(R[0], o.x, yb - 6, 110, Math.min(1, al * 0.8));
    dglow(R[1], o.x, yb - KP_YUK * 0.45, 96, al * 0.35);
    dglow('#ffffff', o.x, yb - KP_YUK * 0.5, 42, al * 0.18);
    for (let k = 0; k < 14; k++) {   // yükselen ışık zerreleri
      const u = ((tm * 0.09 + k * 0.113 + o.ph) % 1), x = o.x + Math.sin(tm * 0.8 + k * 2.4) * 28, y = yb - u * KP_YUK;
      const za = Math.min(1, al * Math.sin(u * Math.PI) * 1.2);
      dglow(R[k % 3], x, y, 12, za);
      if (k % 3 === 0) dglow('#ffffff', x, y, 3.5, za * 0.9);
    }
  },
});

