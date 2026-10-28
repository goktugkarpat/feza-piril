/* muzik12.js — Bölüm 12 "Annemle Sabancı'da Bir Gün": kesintisiz kampüs müziği ve efektler (MZ12).

   Motor muzik.js'tedir (AU): bu dosya yalnız besteyi ve efektleri yazar. AU kurulunca MZ12.bagla(kit) ile çalgıları
   (zil, tus, arp, flut, bas, hop, damla, kabar, sopranoCan...), otobüsleri (B.*), yankıyı ve ses sınırını alır;
   AU'nun zamanlayıcısı her ölçüde MZ12.cubuk(t, d) çağırır (dönüş: ölçünün süresi), ~0,3 sn'de bir MZ12.karisim(t, d).
   Böylece ?sessiz, gizli sekme, iPad kilidi, konuşma kısması ve AU._dene (OfflineAudioContext) aynen çalışır.

   Müzik (Re majör, 4/4): "Annemle" teması — 32 ölçülük A · B · A' · C (nefes) döngüsü, gün boyu aynı tema; çalgılar bölgeye göre:
     sabah (lojman)   flüt ezgi, kalimba kırık akorları, hafif parmakla gitar, uzakta kuşlar
     yol (binişler)   gitar ritmi + shaker + yumuşak davul + zıplayan "bup"; ritim hızla canlanır (basılı tut = dolu, bırak = süzülür),
                      tempo da hızla biraz açılır (100 → 108)
     cim (FASS)       kalimba ezgi, flüt karşı ezgi, hafif shaker
     havuz (Bilgi)    çelesta ezgi, su damlaları, çan ışıltıları
     botanik          sera gibi nemli ve yumuşak: flüt + çelesta, buğulu pad, geniş yankı, bol kuş ve damla; kaplumbağaların
                      ağır ağır yürüyen komik "bup ... bu-bup" motifi (iki ölçüde bir)
     golet / kayik    su gibi akan harp arpejleri (16'lık), uzun flüt notaları, kayıkta kürek nabzı
     tepe             yaylılar + piyano, sıcak; gün ilerledikçe tempo yavaşlar (dn12Gun)
   Bölge geçişi: her bölgenin katmanları ağırlıkla (W) çalınır; ağırlıklar ölçüden ölçüye ve otobüs kazançları saniye saniye
   yumuşakça kayar → çapraz geçiş, hiç susma yok. Armoni ve form tek: geçişte iki bölgenin katmanı aynı akorda buluşur.
   Final (k12FinalBasla, 84 BPM): giriş (piknik, C cümlesi) → 'dans' (Pırıl'ın neşeli ezgisi) → 'saril' DORUK (tema B, koro,
   yaylılar, çanlar) → parıltı → sahnenin ışığında sükûn → 'sabah'ta kısa müzik kutusu kadansı → ninni (AU devralır).
   Olay gelmezse final süreden ilerler (dans +9 sn, doruk +17 sn).

   Efektler (AU.sfx('k12...') ya da OLAY): bisiklet zili, tekerlek tıkırtısı, scooter itişi, kürek şıpırtısı, ördek vak, kedi miyav +
   mırıltı, köpeğin sevimli "huf"u, kuş cıvıltısı, kanat pırpırı, uçurtma vınlaması/takla, çiçek açması, fıskiye, kitap sayfası,
   piknik (kurabiye, limonata), sarılma kalbi; tur 2: kaplumbağa "pop"u ve dalışı, kaz, kuğu, balıkçıl kanadı, sera fıskiyesi. Hepsi kısık, yumuşak, akorla uyumlu; fren sesi yok.
   Test: MZ12.durum (bölge ağırlıkları, form yeri, final fazı), AU._dene senaryosunda d.m12 = {x, bolge, binis, kayik, final, gun, hiz}. */
'use strict';
const MZ12 = (() => {
  let K = null;                      // AU'nun verdiği çalgı takımı (bagla)
  const cl = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = Math.random;
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  const hum = () => (rnd() - 0.5) * 0.008;   // insan eli: notalar ızgaranın birkaç ms çevresinde

  // ───────────────────────── akorlar ─────────────────────────
  // bas: kök (MIDI) · pad: sıcak ses dizilişi · gtr: gitar akoru (pes → tiz) · ton: akorun perde sınıfları · ek: öğleden sonra rengi
  const AKOR = (bas, pad, gtr, ton, ek) => ({ bas, pad, gtr, ton, ek: ek || [] });
  const AK = {
    D:    AKOR(38, [50, 57, 62, 66], [50, 57, 62, 66, 69], [2, 6, 9], [64]),
    AC:   AKOR(37, [49, 57, 61, 64], [49, 52, 57, 61, 64], [9, 1, 4], [66]),
    Bm:   AKOR(35, [50, 54, 59, 62], [47, 54, 59, 62, 66], [11, 2, 6], [57]),
    G:    AKOR(43, [50, 55, 59, 62], [43, 50, 55, 59, 62], [7, 11, 2], [66]),
    DF:   AKOR(42, [50, 57, 62, 66], [42, 50, 57, 62, 66], [2, 6, 9], [64]),
    Em7:  AKOR(40, [50, 55, 59, 62], [40, 47, 50, 55, 62], [4, 7, 11, 2], [66]),
    A:    AKOR(45, [49, 52, 57, 64], [45, 52, 57, 61, 64], [9, 1, 4], [59]),
    A7s:  AKOR(45, [50, 55, 57, 64], [45, 52, 55, 62, 64], [9, 2, 4, 7], [59]),
    Fsm:  AKOR(42, [49, 54, 57, 61], [42, 49, 54, 57, 61], [6, 9, 1], [64]),
    Em:   AKOR(40, [52, 55, 59, 64], [40, 47, 52, 55, 59], [4, 7, 11], [62]),
    Gmj7: AKOR(43, [50, 54, 59, 62], [43, 50, 54, 59, 62], [7, 11, 2, 6], [57]),
    Dad9: AKOR(38, [50, 57, 62, 64, 66], [50, 57, 62, 64, 66], [2, 6, 9, 4], [69]),
    GD:   AKOR(38, [50, 55, 59, 62], [50, 55, 59, 62, 67], [7, 11, 2], [69]),
  };
  const PENT = [2, 4, 6, 9, 11];      // Re majör pentatonik: süsler hep uyumlu
  function akTon(ak, lo, adet, pcs) {   // lo'dan yukarı akor (ya da verilen perde sınıfı) notaları
    const p = pcs || ak.ton, r = [];
    for (let m = lo; r.length < adet && m < lo + 48; m++) if (p.indexOf(((m % 12) + 12) % 12) >= 0) r.push(m);
    return r;
  }

  // ───────────────────────── ezgiler (sekizlik ızgarası: [adım, nota, uzunluk]) ─────────────────────────
  const A_BOL = [
    ['D',   [[0, 78, 2], [2, 76, 1], [3, 74, 1], [4, 76, 2], [6, 78, 2]]],
    ['AC',  [[0, 76, 3], [4, 73, 2], [6, 76, 2]]],
    ['Bm',  [[0, 74, 2], [2, 78, 2], [4, 81, 3]]],
    ['G',   [[0, 83, 2], [2, 81, 2], [4, 79, 4]]],
    ['DF',  [[0, 78, 2], [2, 79, 1], [3, 81, 1], [4, 86, 2], [6, 85, 1], [7, 83, 1]]],
    ['G',   [[0, 83, 2], [2, 79, 2], [4, 81, 2], [6, 83, 2]]],
    ['Em7', [[0, 79, 2], [2, 78, 2], [4, 76, 2], [6, 74, 2]]],
    ['A',   [[0, 76, 4], [4, 73, 2], [6, 76, 2]]],
  ];
  const B_BOL = [
    ['G',   [[0, 83, 3], [3, 81, 1], [4, 79, 2], [6, 81, 2]]],
    ['A',   [[0, 85, 4], [4, 81, 2], [6, 76, 2]]],
    ['Fsm', [[0, 81, 2], [2, 78, 2], [4, 73, 2], [6, 78, 2]]],
    ['Bm',  [[0, 74, 4], [4, 78, 2], [6, 81, 2]]],
    ['G',   [[0, 83, 2], [2, 86, 2], [4, 83, 2], [6, 79, 2]]],
    ['A',   [[0, 81, 3], [3, 79, 1], [4, 76, 4]]],
    ['DF',  [[0, 78, 2], [2, 81, 2], [4, 86, 4]]],
    ['A7s', [[0, 83, 2], [2, 81, 2], [4, 79, 2], [6, 76, 2]]],
  ];
  const A2_BOL = A_BOL.slice(0, 6).concat([
    ['A',   [[0, 76, 2], [2, 79, 2], [4, 78, 2], [6, 76, 2]]],
    ['D',   [[0, 74, 6]]],
  ]);
  const C_BOL = [   // nefes: uzun notalar, ezgi seyrek
    ['Bm',  [[0, 78, 4], [4, 81, 4]]],
    ['G',   [[0, 79, 6]]],
    ['D',   [[0, 78, 4], [4, 74, 4]]],
    ['A',   [[0, 76, 6]]],
    ['Bm',  [[0, 74, 2], [2, 78, 2], [4, 83, 4]]],
    ['G',   [[0, 81, 4], [4, 79, 4]]],
    ['Em',  [[0, 79, 2], [2, 78, 2], [4, 76, 4]]],
    ['A',   [[0, 73, 4], [4, 76, 4]]],
  ];
  const TEMA = [].concat(A_BOL, B_BOL, A2_BOL, C_BOL).map(([ak, m], i) => ({ ak, m, kisim: 'ABAC'[i >> 3] }));
  // final: Pırıl'ın neşeli ezgisi (altılı sıçrayış A–F#'–E'–D'), doruk (tema B), parıltı, sükûn, kapanış
  const DANS = [
    ['D', [[0, 69, 1], [1, 78, 2], [3, 76, 1], [4, 74, 2], [6, 78, 1], [7, 81, 1]]],
    ['G', [[0, 83, 2], [2, 79, 1], [3, 81, 1], [4, 83, 2], [6, 86, 2]]],
    ['A', [[0, 85, 1], [1, 83, 1], [2, 81, 2], [4, 76, 2], [6, 73, 1], [7, 76, 1]]],
    ['D', [[0, 74, 2], [2, 69, 1], [3, 74, 1], [4, 78, 4]]],
  ].map(([ak, m]) => ({ ak, m }));
  const DORUK = B_BOL.slice(0, 6).concat([
    ['D', [[0, 78, 2], [2, 81, 2], [4, 86, 4]]],
    ['D', [[0, 86, 8]]],
  ]).map(([ak, m]) => ({ ak, m }));
  const GIRIS_F = C_BOL.map(([ak, m]) => ({ ak, m }));
  const PARLA = [{ ak: 'Gmj7', m: [] }, { ak: 'D', m: [] }];
  const SUKUN = [{ ak: 'Dad9', m: [] }];
  const KAPANIS = [{ ak: 'GD', m: [[0, 81, 2], [2, 79, 2], [4, 78, 4]] }, { ak: 'D', m: [[0, 74, 8]] }];
  const FINAL_FORM = { giris: GIRIS_F, dans: DANS, bekle: GIRIS_F, doruk: DORUK, parla: PARLA, sukun: SUKUN, kapanis: KAPANIS };
  const FINAL_BPM = { giris: 84, dans: 100, bekle: 84, doruk: 84, parla: 80, sukun: 76, kapanis: 76 };

  // ───────────────────────── durum ─────────────────────────
  const BOLGELER = ['sabah', 'yol', 'cim', 'havuz', 'botanik', 'golet', 'kayik', 'tepe', 'final'];
  const W = {}, WS = {};             // W: ölçü ağırlığı (nota düzeyi) · WS: saniyelik ağırlık (otobüs kazancı)
  let ilk = true, fi = 0, dongu = 0, bpm = 100, sonAk = null, akor = AK.D, sonBolge = 'sabah';
  let hizB = 0, hizS = 0, dansS = 0, karT = -1;
  let fin = null;                    // final: { t0, faz, fazT, i, dans, saril, isik, sabah, bitti }
  let bitti = false;
  let padSes = null;                 // çalan pad: { g, osc: [] }
  // canlı oyunda hız ölçümü (MZ12.adim her karede): binişte basılı tutma = hızlan
  let binisOlay = null, kayikOlay = false, eslikT = -1e9, kopruT = -1e9;   // eslikT: kaplumbağa eşlik ediyor · kopruT: köprünün altı
  let hizHam = 0, hizTepe = 300, sonX = null, sonMs = 0, tekerYol = 0, sonHizHam = 0, kayikSu = 0;

  for (const b of BOLGELER) { W[b] = 0; WS[b] = 0; }

  function bolgeAdi(x) {
    if (typeof BOLUM === 'undefined' || !BOLUM || !BOLUM.bolgeler) return '';
    for (const b of BOLUM.bolgeler) if (x >= b.x0 && x < b.x1) return b.ad;
    return '';
  }
  function v12(k) { try { return typeof V12 !== 'undefined' && V12 ? V12[k] : undefined; } catch (e) { return undefined; } }
  function ucusTip() { try { return typeof P !== 'undefined' && P && P.ucus ? P.ucus.tip || '' : ''; } catch (e) { return ''; } }
  // oyunun durumu → {bolge, binis, kayik, final, gun, hiz, durum}; deneme senaryosu d.m12 ile her şeyi verebilir
  function oku(d) {
    const m = d && d.m12;
    const durum = d && d.durum || (typeof DURUM !== 'undefined' ? DURUM : 'oyun');
    if (m) {
      return { bolge: m.bolge || bolgeAdi(m.x || 0), binis: m.binis || null, kayik: !!m.kayik, final: !!m.final,
        gun: cl(m.gun || 0, 0, 1), hiz: cl(m.hiz || 0, 0, 1), durum };
    }
    const x = typeof P !== 'undefined' && P ? P.x : 0, tip = ucusTip();
    let gun = 0;
    try { if (typeof dn12Gun === 'function') gun = cl(+dn12Gun() || 0, 0, 1); } catch (e) {}
    // biniş/kayık: P.ucus (sözleşme) ya da olaylar (yalnız P.ucus doluyken geçerli: "bitti" olayı kaçsa da takılmaz)
    const ucus = !!tip, binis = tip === 'k12Binis' ? (P.ucus.ad || 'yol') : ucus && binisOlay ? binisOlay : null;
    return { bolge: bolgeAdi(x), binis, kayik: tip === 'k12Kayik' || (ucus && kayikOlay), final: !!v12('final') || !!fin,
      gun, hiz: binis ? yolHiz() : 0, durum };
  }
  // binişin hızı 0..1: YOLCULUK'un YOL12.hiz()'i, yoksa P.x değişiminden ölçülen hız
  function yolHiz() {
    try { if (typeof YOL12 !== 'undefined' && YOL12 && typeof YOL12.hiz === 'function') { const h = +YOL12.hiz(); if (Number.isFinite(h)) return cl(h, 0, 1); } } catch (e) {}
    return cl(hizHam / hizTepe, 0, 1);
  }
  function pedalDonuyor() {
    try { if (typeof YOL12 !== 'undefined' && YOL12 && typeof YOL12.pedal === 'function') return !!YOL12.pedal(); } catch (e) {}
    return null;
  }
  function hedefBolge(st) {
    if (st.final || st.durum === 'final') return 'final';
    if (st.kayik) return 'kayik';
    if (st.binis) return 'yol';
    switch (st.bolge) {
      case 'lojman': return 'sabah';
      case 'yol1': case 'yol2': case 'fass': return 'cim';
      case 'bilgi': return 'havuz';
      case 'botanik': return 'botanik';
      case 'golet': return 'golet';
      case 'tepe': return 'tepe';
      default: return sonBolge;
    }
  }

  // ───────────────────────── çalgılar (kit üstüne) ─────────────────────────
  // telli gitar: testere + üçgen, kapanan süzgeç (tel çekilir, ses yumuşar); otobüs B.klav (tizi 5,2 kHz'de yumuşak)
  function gitar(n, t, vol, pan, dec) {
    if (!K.yerVar(1, t, t + dec, false)) return;
    const f = hz(n), out = K.zarf(t, 0.003, vol, dec, K.panla(K.B.klav, pan));
    const lp = K.suzgec('lowpass', Math.min(5200, f * 9), 0.7, out);
    lp.frequency.setValueAtTime(Math.min(5200, f * 9), t); lp.frequency.setTargetAtTime(Math.max(500, f * 1.6), t + 0.01, dec * 0.22);
    K.osc('sawtooth', f, t, t + dec + 0.05, K.kazanc(0.7, lp), 3);   // tek osilatör: iPad'de ucuz
  }
  // tıngırtı: aşağı (pes → tiz) ya da yukarı (tiz → pes, daha az tel, daha kısık)
  function vurus(ak, t, vol, yukari, pan) {
    const g = ak.gtr, notalar = yukari ? g.slice(2).reverse() : g.slice(0, 4);
    notalar.forEach((n, i) => gitar(n, t + i * (yukari ? 0.011 : 0.016), vol * (yukari ? 0.6 : 1) * (i === 0 && !yukari ? 1.1 : 1), cl(pan + (i - 2) * 0.08, -0.6, 0.6), yukari ? 0.38 : 0.7));
  }
  // kalimba: saf tını + kısa üst kısmi ses + minik "tık" (metal dil); otobüs B.ksil, biraz gecikme yankısı
  function kalimba(n, t, vol, pan, dec) {
    dec = dec || 1.1;
    if (!K.yerVar(2, t, t + dec, false, 1)) return;
    K.ek(t + 0.25);
    const f = hz(n), out = K.zarf(t, 0.002, vol, dec, K.panla(K.B.ksil, pan));
    if (vol > 0.012) out.connect(K.dlyGiris);
    const o = K.osc('sine', f, t, t + dec + 0.05, out);
    o.frequency.setValueAtTime(f * 1.012, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.03);
    K.osc('sine', f * 3.02, t, t + 0.3, K.zarf(t, 0.002, 0.16, 0.22, out));
  }
  function shaker(t, vol, pan, uzun) {
    K.gur(t, uzun ? 0.11 : 0.06, 'highpass', 6500, 5200, 0.7, vol, uzun ? 0.03 : 0.012, pan, 0, K.B.sik);
  }
  function davul(t, vol) {   // yumuşak "dum": iPad hoparlörü de duysun diye 150 → 85 Hz + tok tıkırtı
    K.ton(t, 'sine', 160, 85, 0.24, vol, 0.004, 0, 0, K.B.tahta);
    K.ton(t, 'triangle', 420, 200, 0.05, vol * 0.25, 0.002, 0, 0, K.B.tahta);
  }
  function fircaTrampet(t, vol, pan) {   // fırça: yumuşak "çşş" (korkutmaz)
    K.gur(t, 0.16, 'bandpass', 2600, 1900, 0.9, vol, 0.006, pan, 1, K.B.tahta);
  }
  // kendi pad'imiz: akor değişince eskisi yavaşça söner, yenisi yavaşça gelir (çıtırtı yok); öğleden sonra ek notası açılır
  function padCal(ak, t, renk, parlak) {
    padBirak(t);
    const notalar = renk > 0.45 ? ak.pad.concat(ak.ek) : ak.pad;
    K.yerVar(notalar.length * 2 + 2, t, t + 4, true);
    const g = K.ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.9);
    const lp = K.suzgec('lowpass', 560 + 1500 * parlak, 0.4, g);
    g.connect(K.B.pad);
    const osc = [];
    const ac = K.ac, ses = (tip, f, hedef, det) => { const o = ac.createOscillator(); o.type = tip; o.frequency.value = f; o.detune.value = det || 0; o.connect(hedef); o.start(t); osc.push(o); };
    // durma zamanı bırakılınca verilir (akor ne kadar sürerse sürsün kesilmez)
    notalar.forEach((n, i) => { ses('sine', hz(n), K.kazanc(0.55, lp), i % 2 ? 4 : -4); if (i === 1 || i === 3) ses('sawtooth', hz(n), K.kazanc(0.2, lp), i % 2 ? -7 : 7); });
    const bg = K.kazanc(0.0001, K.B.pad);
    bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(0.045, t + 0.7);
    ses('sine', hz(ak.bas + 12), bg);
    padSes = { g, bg, osc };
  }
  function padBirak(t, rel) {
    if (!padSes) return;
    const p = padSes; padSes = null; rel = rel || 0.55;
    for (const g of [p.g, p.bg]) {
      try { g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0.0001, t, rel); } catch (e) {}
    }
    for (const o of p.osc) { try { o.stop(t + rel * 6 + 0.1); } catch (e) {} }
  }
  function sesYurut(ak, t, tau) {
    K.sesYurut(K.tel, ak, 57, 78, t, tau);
    K.sesYurut(K.koro, ak, 59, 72, t, tau * 1.5);
  }

  // ezgi: çalgı payları ({flut, kalimba, celesta, glok, piyano}) ile; hepsi aynı notayı aynı anda çalar → geçişte kaynaşır
  function ezgi(m, t, e, pay, kisik) {
    if (!m || !m.length) return;
    K.oncelikli(() => {
      for (const [s, n, u] of m) {
        const ts = t + s * e + 0.012 + hum(), dur = u * e, vurgu = s === 0 || u >= 3;
        const pan = cl((n - 79) * 0.03, -0.3, 0.3), v = (vurgu ? 1 : 0.86) * (kisik || 1);
        if (pay.flut > 0.03) K.flut(n > 88 ? n - 12 : n, ts, dur * 0.94, 0.031 * pay.flut * v, pan, K.B.flut);
        if (pay.kalimba > 0.03) kalimba(n, ts, 0.05 * pay.kalimba * v, -pan, 0.9 + dur * 0.4);
        if (pay.celesta > 0.03) K.tus(n, ts, 0.047 * pay.celesta * v, 1.2 + dur * 0.5, pan, true, K.B.tus);
        if (pay.piyano > 0.03) K.tus(n - 12, ts + 0.006, 0.03 * pay.piyano * v, 1.6 + dur * 0.5, -pan, false, K.B.tus);
        if (pay.glok > 0.03 && n + 12 <= 100) K.zil(hz(n + 12), ts + 0.004, 0.011 * pay.glok * v, 1.2, -pan, K.B.zil, false);
      }
    });
  }

  // ───────────────────────── katmanlar (bir ölçü) ─────────────────────────
  function katmanGitar(ak, t, e, w) {
    const parmak = w.sabah * 0.7 + w.cim * 1.0 + w.tepe * 0.8 + w.havuz * 0.5 + w.botanik * 0.45 + w.final * (fin && fin.faz !== 'dans' ? 0.8 : 0);
    if (parmak > 0.04) {   // parmakla: bas + tiz teller (p-i-m-a), sekizlik
      const sira = [0, 2, 3, 4, 1, 3, 2, 4];
      for (let s = 0; s < 8; s++) gitar(ak.gtr[sira[s]], t + s * e + 0.01 + hum(), (s === 0 ? 0.027 : 0.018) * parmak, (sira[s] - 2) * 0.12, s === 0 ? 1.3 : 0.8);
    }
    const ritim = w.yol + w.final * (fin && fin.faz === 'dans' ? 0.7 : 0);
    if (ritim > 0.04) {   // tıngırtı: A . A Y . Y A Y; hız arttıkça yukarı vuruşlar dolar
      const h = hizB, v = (0.018 + 0.011 * h) * ritim;
      const kalip = [[0, 0, 1], [2, 0, 0.75], [3, 1, 0.6], [5, 1, 0.65], [6, 0, 0.8], [7, 1, 0.55]];
      for (const [s, yuk, k] of kalip) {
        if (yuk && h < 0.25 && s !== 3) continue;
        vurus(ak, t + s * e + 0.008 + hum(), v * k, !!yuk, 0.15);
      }
    }
  }
  function katmanBas(ak, t, e, uz, w) {
    const kok = ak.bas < 40 ? ak.bas + 12 : ak.bas;   // 40..50: iPad hoparlörü de duysun
    const uzun = w.sabah * 0.8 + w.havuz * 0.8 + w.botanik * 0.7 + w.golet + w.kayik + w.tepe + w.final * (fin && fin.faz !== 'dans' ? 1 : 0) + w.cim * 0.5;
    if (uzun > 0.05) K.bas(kok, t + 0.01, 0.05 * Math.min(1, uzun), 'uzun', uz * 0.92);
    if (w.cim + w.botanik * 0.6 > 0.05) K.bas(kok + 7, t + 4 * e + 0.01, 0.034 * (w.cim + w.botanik * 0.6), 'pizz');
    if (w.kayik > 0.05) K.bas(kok, t + 4 * e + 0.01, 0.036 * w.kayik, 'nabiz');   // kürek nabzı: bir ... iki
    const yurur = w.yol + w.final * (fin && fin.faz === 'dans' ? 1 : 0);
    if (yurur > 0.05) {   // yürüyen pizz: kök, beşli, oktav, yaklaşma notası
      const sira = [kok, kok + 7, kok + 12, kok + 7], v = 0.042 * yurur * (0.75 + 0.25 * hizB);
      for (let b = 0; b < 4; b++) K.bas(sira[b], t + b * 2 * e + 0.01, v * (b === 0 ? 1.15 : 0.9), 'pizz');
      if (hizB > 0.5) for (const b of [1, 3]) K.bas(sira[b] + (b === 3 ? -2 : 0), t + (b * 2 + 1) * e + 0.01, v * 0.55, 'pizz');
    }
  }
  function katmanKalimba(ak, t, e, w) {
    const v = w.sabah * 0.9 + w.cim * 0.8 + w.havuz * 0.3 + w.botanik * 0.4;
    if (v < 0.05) return;
    const tn = akTon(ak, 74, 5), yol = [0, 2, 4, 3, 1, 3, 2, 4];
    for (let s = 0; s < 8; s++) {
      if (s % 2 && rnd() < 0.35) continue;
      kalimba(tn[yol[s] % tn.length], t + s * e + 0.02 + hum(), 0.014 * v * (s === 0 ? 1.2 : 1), (yol[s] - 2) * 0.18, 0.9);
    }
  }
  function katmanHarp(ak, t, e, w, bar) {   // su gibi akan arpej: 16'lık, iki oktav yukarı aşağı
    const v = w.golet + w.kayik * 0.9 + w.havuz * 0.6 + w.botanik * 0.5 + w.final * (fin && (fin.faz === 'doruk' || fin.faz === 'parla') ? 0.8 : 0);
    if (v < 0.05) return;
    const tn = akTon(ak, ak.bas + 24, 8), s16 = e / 2;
    const yol = bar % 2 ? [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 3, 4, 5] : [0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 4, 5, 3];
    const kayik = w.kayik > 0.5;
    for (let s = 0; s < 16; s++) {
      if (w.havuz + w.botanik > w.golet + w.kayik && s % 2) continue;     // havuzda ve serada sekizlik, gölette 16'lık
      const vurgu = kayik ? s % 8 === 0 || s % 8 === 3 || s % 8 === 6 : s % 4 === 0;   // kayıkta 3+3+2 salınım
      K.arp(tn[yol[s]], t + s * s16 + 0.01 + hum(), 0.0155 * v * (vurgu ? 1.15 : 0.72), (yol[s] - 3.5) * 0.12, vurgu ? 1.9 : 1.3, K.B.arp);
    }
  }
  function katmanRitim(t, e, w) {
    const h = hizB, yol = w.yol, dans = w.final * (fin && fin.faz === 'dans' ? 1 : 0);
    const shk = yol * (0.4 + 0.6 * h) + w.cim * 0.45 + w.sabah * 0.25 + dans * 0.8;
    if (shk > 0.04) {
      for (let s = 0; s < 8; s++) {
        if ((w.cim + w.sabah) > yol + dans && s % 2 === 0) continue;   // çimde yalnız ara vuruşlar
        shaker(t + s * e + 0.004 + hum(), 0.0105 * shk * (s % 2 ? 1 : 0.7), s % 2 ? 0.3 : -0.3);
      }
    }
    const dv = yol * cl((h - 0.2) / 0.5, 0, 1) + dans;
    if (dv > 0.04) {
      davul(t + 0.005, 0.085 * dv); davul(t + 4 * e + 0.005, 0.075 * dv);
      if (h > 0.6 || dans > 0.3) davul(t + 7 * e + 0.005, 0.03 * dv);
      fircaTrampet(t + 2 * e + 0.006, 0.012 * dv, 0.15); fircaTrampet(t + 6 * e + 0.006, 0.012 * dv, -0.15);
    }
  }
  function katmanHop(ak, t, e, w) {   // zıplayan "bup": hızlıyken ve dansta; ördekler peşindeyken gölette de minik "bup"lar
    const ordek = Math.min(5, +v12('ordek') || 0) / 5;
    const v = w.yol * cl((hizB - 0.55) / 0.35, 0, 1) + w.final * (fin && fin.faz === 'dans' ? 1 : 0) + w.golet * ordek * 0.6;
    if (v < 0.05) return;
    const tn = akTon(ak, 62, 4);
    [1, 3, 5, 7].forEach((s, i) => K.hop(tn[i % tn.length], t + s * e + 0.006, 0.03 * v, i % 2 ? 0.3 : -0.3, K.B.hop));
  }
  // kaplumbağa motifi (botanik): alçak, ağır ağır yürüyen "bup ... bu-bup" — komik ve sevimli; iki ölçüde bir, arada minik çan cevabı
  function katmanKaplumbaga(ak, t, e, w, bar) {
    const eslik = t - eslikT < 25, v = Math.max(w.botanik, eslik ? 0.7 : 0);   // eşlikçi kaplumbağa varken her ölçüde
    if (v < 0.1 || (bar % 2 && !eslik)) return;
    const tn = akTon(ak, 55, 4);
    for (const [s, i, k] of [[0, 0, 1], [3, 1, 0.75], [3.5, 0, 0.7], [6, 2, 0.85]]) K.hop(tn[i], t + s * e + 0.01, 0.034 * v * k, i === 1 ? 0.25 : -0.2, K.B.hop);
    if (bar % 4 === 0) K.zil(hz(akTon(ak, 86, 2, PENT)[1]), t + 7 * e, 0.008 * v, 1.2, 0.3, K.B.zil, false);   // "ta-daa"
  }
  function katmanIsilti(ak, t, uz, w) {
    const v = 0.4 + w.havuz * 1.4 + w.botanik * 0.5 + w.golet * 0.6 + w.final * 0.6;
    const n = Math.floor(v + rnd() * 0.8), notalar = akTon(ak, 86, 6, PENT);
    for (let i = 0; i < n; i++) K.zil(hz(notalar[Math.floor(rnd() * notalar.length)]), t + 0.2 + rnd() * (uz - 0.5), 0.006 + 0.003 * w.havuz, 1.4, rnd() * 1.2 - 0.6, K.B.zil, rnd() < 0.5);
    const su = w.havuz + w.botanik * 0.9 + w.golet * 0.7 + w.kayik * 0.5;   // serada nemli damlalar
    if (su > 0.1) {
      const d = Math.floor(1 + su * 2.2 * rnd() + su);
      for (let i = 0; i < d; i++) K.damla(900 + rnd() * 900, t + 0.1 + rnd() * (uz - 0.3), 0.009 * su, rnd() * 1.2 - 0.6, K.B.su);
    }
    const kus = w.sabah + w.cim * 0.6 + w.botanik * 1.6;   // botanik bahçesi kuş cıvıltılı
    if (kus > 0.3 && rnd() < 0.45 * kus) K.kus(t + rnd() * uz, rnd() < 0.5 ? -0.55 : 0.55);
    if (w.botanik > 0.4 && rnd() < 0.5 * w.botanik) K.kus(t + uz * 0.5 + rnd() * uz * 0.4, rnd() < 0.5 ? -0.35 : 0.35);
  }
  function katmanCan(ak, t, e, w, bar) {   // soprano çanı: tepede ve finalde cümle başlarında
    const v = w.tepe * 0.8 + w.final * (fin && (fin.faz === 'doruk' || fin.faz === 'parla' || fin.faz === 'sukun') ? 1 : 0.3);
    if (v < 0.1 || bar % 2) return;
    const tn = akTon(ak, 86, 3, PENT);
    K.sopranoCan(tn[(bar >> 1) % tn.length], t + 4 * e, 0.011 * v, bar % 4 ? 0.3 : -0.3, K.B.soprano);
  }
  // bölgeye göre ezgi çalgıları (ağırlıkla karışır); döngüden döngüye renk değişir
  function ezgiPaylari(w, kisim) {
    const v = dongu % 3, C = kisim === 'C';
    const p = { flut: 0, kalimba: 0, celesta: 0, glok: 0, piyano: 0 };
    p.flut += w.sabah * (C ? 0.5 : 1);          p.kalimba += w.sabah * (C ? 0.7 : 0.25);
    p.flut += w.yol * 0.75;                     p.kalimba += w.yol * 0.45; p.glok += w.yol * hizB * 0.6;
    p.kalimba += w.cim * (v === 1 ? 0.6 : 1);   p.flut += w.cim * (v === 1 ? 0.8 : 0.3);
    p.celesta += w.havuz * 1.0;                 p.glok += w.havuz * 0.5;
    p.flut += w.botanik * 0.75;                 p.celesta += w.botanik * 0.45;   // sera: yumuşak flüt + çelesta
    p.flut += w.golet * 0.9;                    p.celesta += w.golet * (C ? 0.5 : 0.2);
    p.celesta += w.kayik * 0.75;                p.flut += w.kayik * 0.35;
    p.flut += w.tepe * 0.8;                     p.piyano += w.tepe * 0.7;
    if (v === 2 && kisim === 'A') p.glok += 0.35 * (w.sabah + w.cim);   // üçüncü döngüde tepede küçük çan çifti
    return p;
  }

  // ───────────────────────── ölçü planlayıcı ─────────────────────────
  function agirlikIlerlet(hedef, ilkMi) {
    const a = ilkMi ? 1 : hedef === 'yol' || hedef === 'final' ? 0.62 : 0.42;
    for (const b of BOLGELER) W[b] += ((b === hedef ? 1 : 0) - W[b]) * a;
    if (ilkMi) for (const b of BOLGELER) WS[b] = W[b];
  }
  // finalin bölümü: olaylar (dans, saril, sahnenin ışığı, sabah) ya da süre (dans +9 sn, doruk +17 sn) seçer; geçiş ölçü başında
  function finalFazSec(t, st) {
    const f = fin, el = t - f.t0, eski = f.faz;
    let faz = eski;
    if (f.sabah) faz = 'kapanis';
    else if (eski === 'doruk') { if (f.i >= DORUK.length) faz = f.isik || st.durum === 'final' ? 'sukun' : 'parla'; }   // doruk yarıda kesilmez
    else if (f.isik || st.durum === 'final') faz = 'sukun';
    else if (f.saril || el > 17) { if (eski !== 'parla') faz = 'doruk'; }
    else if (eski === 'giris' && (f.dans || el > 9)) faz = 'dans';
    else if (eski === 'dans' && t - f.fazT > 7.2 && f.i % 4 === 0) faz = 'bekle';
    if (faz !== eski) { f.faz = faz; f.fazT = t; f.i = 0; }
    return faz;
  }
  function cubuk(t, d) {
    if (!K) return 2.4;
    const st = oku(d);
    if (st.final && !fin) finalBasla(t);
    const hedef = hedefBolge(st);
    agirlikIlerlet(hedef, ilk);
    ilk = false; sonBolge = hedef;
    hizB += (st.hiz - hizB) * 0.6;
    const w = W;

    // form: tema döngüsü ya da final bölümleri
    let bolum, kisim = 'A', bar;
    if (fin) {
      const faz = finalFazSec(t, st), form = FINAL_FORM[faz];
      bolum = form[fin.i % form.length]; bar = fin.i; kisim = faz === 'dans' ? 'D' : 'F';
      const hedefBpm = FINAL_BPM[faz];
      bpm += cl(hedefBpm - bpm, faz === 'dans' ? -16 : -7, faz === 'dans' ? 16 : 7);
      fin.i++;
      if (faz === 'kapanis' && fin.i >= KAPANIS.length) fin.bitti = true;
    } else {
      bolum = TEMA[fi]; kisim = bolum.kisim; bar = fi;
      const hedefBpm = 100 - 7 * st.gun + 8 * w.yol * hizB - 4 * w.kayik - 3 * w.golet - 3 * w.botanik;
      bpm += cl(hedefBpm - bpm, -3, 3);
      fi++; if (fi >= TEMA.length) { fi = 0; dongu++; }
    }
    const uz = 240 / bpm, e = uz / 8, ak = AK[bolum.ak] || AK.D;
    akor = ak;

    // armoni: pad + yaylılar (akor değişince)
    const parlak = cl(0.75 - 0.35 * st.gun + 0.25 * w.final + 0.15 * w.yol - 0.25 * w.botanik, 0, 1);   // serada pad buğulu
    if (ak !== sonAk) { padCal(ak, t, st.gun + w.final * 0.5, parlak); sesYurut(ak, t, w.final > 0.5 ? 0.25 : 0.08); sonAk = ak; }

    if (fin && fin.faz === 'kapanis') {   // müzik kutusu kadansı: ezgiyi çan çalar, gerisi susar; son akor uzun bırakılır
      K.oncelikli(() => { for (const [s, n, u] of bolum.m) K.zil(hz(n + 12), t + s * e + 0.01, 0.035, Math.min(2.6, 1 + u * e * 0.6), 0.1, K.B.zil); });
      ezgi(bolum.m, t, e, { flut: 0, kalimba: 0.5, celesta: 0, glok: 0, piyano: 0.4 }, 0.8);
      if (fin.bitti) { padBirak(t + uz * 0.9, 1.2); bitti = true; }
      return uz;
    }
    // ezgi
    let pay;
    if (fin) {
      const f = fin.faz;
      pay = f === 'dans' ? { flut: 0, kalimba: 1, celesta: 0, glok: 0.8, piyano: 0 }
        : f === 'doruk' ? { flut: 0.9, kalimba: 0, celesta: 0.7, glok: 0.3, piyano: 0.4 }
        : f === 'giris' || f === 'bekle' ? { flut: 0.75, kalimba: 0, celesta: 0, glok: 0, piyano: 0.5 }
        : { flut: 0, kalimba: 0, celesta: 0, glok: 0, piyano: 0 };
      if (f === 'doruk' && bar === 0) K.kabar(ak.pad.map(n => n + 12), t, 1.4, uz * 0.8, 2.6, 0.02, K.sahneG, true);
    } else pay = ezgiPaylari(w, kisim);
    ezgi(bolum.m, t, e, pay, kisim === 'C' ? 0.85 : 1);

    // eşlik katmanları
    katmanGitar(ak, t, e, w);
    katmanBas(ak, t, e, uz, w);
    katmanKalimba(ak, t, e, w);
    katmanHarp(ak, t, e, w, bar);
    katmanRitim(t, e, w);
    katmanHop(ak, t, e, w);
    katmanIsilti(ak, t, uz, w);
    katmanKaplumbaga(ak, t, e, w, bar);
    katmanCan(ak, t, e, w, bar);
    if (fin && fin.faz === 'sukun') K.zil(hz(akTon(ak, 81, 4, PENT)[Math.floor(rnd() * 4)]), t + uz * 0.5, 0.008, 2.2, rnd() - 0.5, K.B.zil);
    return uz;
  }

  // ───────────────────────── karışım (saniyede ~3 kez) ─────────────────────────
  function karisim(t, d) {
    if (!K) return;
    const dt = karT < 0 ? 1 : cl(t - karT, 0, 1); karT = t;
    const st = oku(d), hedef = sonBolge;
    const a = 1 - Math.exp(-dt / (hedef === 'yol' ? 1.3 : 2.2));
    for (const b of BOLGELER) WS[b] += ((b === hedef ? 1 : 0) - WS[b]) * a;
    hizS += (st.hiz - hizS) * (1 - Math.exp(-dt / 0.45));
    dansS += ((fin && fin.faz === 'dans' ? 1 : 0) - dansS) * (1 - Math.exp(-dt / 0.8));
    const s = WS, T = K.TEMEL, B = K.B, h = K.hedefle;
    const koroD = fin ? (fin.faz === 'doruk' ? 0.7 : fin.faz === 'parla' || fin.faz === 'sukun' ? 0.55 : 0.12) : 0;
    const duzey = {
      zil: 1, tus: 1, arp: 1, su: 1, flut: 1, soprano: 1, ksil: 1, klav: 1, bas: 1, hop: 1,
      pad: 0.82 + 0.25 * s.golet + 0.15 * s.tepe + 0.12 * s.final,
      tel: 0.12 + 0.45 * s.golet + 0.35 * s.kayik + 0.65 * s.tepe + 0.75 * s.final + 0.15 * st.gun,
      koro: s.final * koroD,
      sik: 0.45 * s.cim + 0.3 * s.sabah + s.yol * (0.35 + 0.65 * hizS) + 0.5 * dansS + 0.2,
      tahta: s.yol * (0.25 + 0.75 * hizS) + 0.7 * dansS + 0.15,
      tuba: 0, hay: 0, org: 0, korno: 0,
    };
    for (const ad in T) if (B[ad]) h(B[ad].gain, T[ad] * (duzey[ad] != null ? duzey[ad] : 0), t, ad === 'sik' || ad === 'tahta' ? 0.35 : 1.2);
    for (const [g, gv, tur] of K.kForm) h(g.gain, tur === 2 ? gv : 0, t, 1.5);   // yumuşak "oo" korosu
    const kopru = t - kopruT < 4 ? 0.45 : 0;   // köprünün altında yankı açılır
    h(K.revMuzik.gain, 0.5 * (0.95 + 0.25 * s.golet + 0.2 * s.kayik + 0.3 * s.botanik + 0.3 * s.final + kopru), t, kopru ? 0.5 : 2);   // serada nemli, geniş yankı
    h(K.dly.fbG.gain, 0.32 + 0.06 * s.golet, t, 2);
    h(K.dly.out.gain, 0.6 * (0.42 + 0.25 * s.golet + 0.2 * s.havuz + 0.25 * s.botanik + 0.15 * s.final), t, 2);
    // bölgeler arası ses düzeyi eşitleme (ölçüm: diğer bölümler ~ -24 dB RMS; doruk biraz üstünde)
    const esit = 1 + 0.32 * s.havuz + 0.25 * s.botanik + 0.28 * s.cim + 0.2 * s.yol + 0.08 * s.sabah - 0.08 * s.tepe - s.final * (fin && fin.faz === 'doruk' ? 0.16 : fin && fin.faz === 'sukun' ? 0.2 : 0.06);
    h(K.muzikG.gain, 0.77 * esit, t, 2);
    if (B.telLP) h(B.telLP.frequency, 900 + 1300 * cl(0.75 - 0.3 * st.gun + 0.35 * s.final, 0, 1.1), t, 2);
    h(K.ruzgarG.gain, 0.003 + 0.017 * s.yol * hizS + 0.004 * s.cim, t, 0.8);   // binişte rüzgâr (hızla), çimenlikte uçurtma esintisi
    const kh = cl(+v12('kayikHiz') || 0, 0, 1);
    let selale = 0;   // botanikteki şelalenin şırıltısı: yakınlıkla (BOTANIK: x = 650,5 sütun)
    try {
      const x = d && d.m12 ? d.m12.x : typeof P !== 'undefined' && P ? P.x : NaN;
      if (typeof T !== 'undefined' && Number.isFinite(x)) selale = cl(1 - Math.abs(x - 650.5 * T) / (14 * T), 0, 1) * s.botanik;
    } catch (e) {}
    if (!Number.isFinite(selale)) selale = 0;
    if (K.yalaG) h(K.yalaG.gain, 0.011 * (s.golet + s.kayik) + 0.006 * kh + 0.013 * selale, t, 1.5);   // gölün yalaması (kayıkta şırıltı), şelale
  }

  // ───────────────────────── final ─────────────────────────
  function finalBasla(t) {
    if (fin) return;
    fin = { t0: t, faz: 'giris', fazT: t, i: 0, dans: false, saril: false, isik: false, sabah: false, bitti: false };
  }
  function simdi() { return K && K.ac ? K.zaman() : 0; }

  // ───────────────────────── efektler ─────────────────────────
  // hepsi sfxG'ye (müzikten bağımsız, konuşmada kısılmaz) ve kısık; v: olay verisi
  const S = () => K.sfxG;
  function zilSes(t, kim, uzak) {   // bisiklet zili "dırrıng": iki hızlı vuruş, metal kısmi sesler
    const f = kim === 'anne' ? 2050 : 2500, v = uzak ? 0.006 : 0.017, p = uzak ? 0.45 : kim === 'anne' ? -0.25 : 0.2;
    for (const [dt, k] of [[0, 1], [0.12, 0.85], [0.24, 0.55]]) {
      K.ton(t + dt, 'sine', f, f, 0.55, v * k, 0.002, p, 1);
      K.ton(t + dt, 'sine', f * 1.49, f * 1.49, 0.32, v * 0.55 * k, 0.002, p, 0);
      K.ton(t + dt, 'sine', f * 2.31, f * 2.31, 0.16, v * 0.3 * k, 0.001, p, 0);
    }
  }
  function miyav(t, vol, pan, kisa) {   // yavru kedi "mi-yav": testere + kayan iki formant
    if (!K.yerVar(3, t, t + 0.7, true)) return;
    const ac = K.ac, dur = kisa ? 0.4 : 0.52, f0 = (kisa ? 690 : 620) + rnd() * 60;
    const o = ac.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(f0 * 0.9, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.25, t + 0.16); o.frequency.exponentialRampToValueAtTime(f0 * 0.82, t + dur);
    const amp = ac.createGain(); amp.gain.value = 0.0001; amp.gain.setValueAtTime(0.0001, t); amp.gain.exponentialRampToValueAtTime(vol, t + 0.05);
    amp.gain.setValueAtTime(vol, t + dur * 0.6); amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    amp.connect(K.panla(S(), pan)); amp.connect(K.revSfx);
    for (const [a, b, c, q, gv] of [[350, 850, 450, 5, 1], [2300, 1400, 900, 7, 0.5]]) {
      const bp = K.suzgec('bandpass', a, q, null); bp.frequency.setValueAtTime(a, t); bp.frequency.linearRampToValueAtTime(b, t + 0.2); bp.frequency.linearRampToValueAtTime(c, t + dur);
      o.connect(bp); bp.connect(K.kazanc(gv * 3, amp));
    }
    const lf = ac.createOscillator(); lf.frequency.value = 6; lf.connect(K.kazanc(14, o.detune)); lf.start(t); lf.stop(t + dur + 0.05);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function mirlti(t, vol, pan) {   // mırıltı: alçak, yavaşça titreyen yumuşak gürültü
    if (!K.yerVar(2, t, t + 1.2, true)) return;
    const ac = K.ac, s = ac.createBufferSource(); s.buffer = K.gurBuf; s.loop = true;
    const lp = K.suzgec('lowpass', 260, 1.2, null), am = K.kazanc(0.5, null), g = K.zarf(t, 0.2, vol, 1.0, K.panla(S(), pan));
    const lf = ac.createOscillator(); lf.frequency.value = 23; lf.connect(K.kazanc(0.5, am.gain)); lf.start(t); lf.stop(t + 1.3);
    s.connect(lp); lp.connect(am); am.connect(g); s.start(t, rnd()); s.stop(t + 1.3);
  }
  function vak(t, vol, pan, yavru) {   // ördek: burundan sevimli "vak" (yavruda ince "vik")
    const f = yavru ? 560 : 300;
    K.agiz(t, f * 1.08, f * 0.88, yavru ? 0.11 : 0.17, vol, [yavru ? 1500 : 950, yavru ? 2600 : 1650], [yavru ? 1300 : 760, yavru ? 2300 : 1350], 0.012);
  }
  function popSes(t, vol, pan) {   // kaplumbağanın kafası çıkar: oyuk, sevimli "pop" (perdesi yukarı kayar) + minik tahta tık
    K.ton(t, 'sine', 320, 720, 0.09, vol, 0.003, pan, 0);
    K.ton(t + 0.005, 'triangle', 900, 700, 0.03, vol * 0.25, 0.002, pan, 0);
  }
  function kaz(t, vol, pan) {   // kaz: dostça, burundan "kak" (ördekten kalın değil, kısa)
    K.agiz(t, 400, 360, 0.15, vol, [1100, 2300], [900, 2000], 0.01);
  }
  function huf(t, vol) {   // küçük köpeğin dostça "huf"u: nefesli, kısa, alçak değil (korkutmaz)
    K.agiz(t, 440, 340, 0.1, vol, [700, 1350], [560, 1150], 0.008);
    K.gur(t, 0.09, 'bandpass', 900, 600, 1.2, vol * 0.5, 0.006, 0.2, 0, S());
  }
  function cikCik(t, pan, n) {
    for (let i = 0; i < n; i++) {
      const f = 3000 + rnd() * 700, tt = t + i * (0.11 + rnd() * 0.05);
      K.ton(tt, 'sine', f, f * 1.4, 0.06, 0.007, 0.006, pan, 1);
      K.ton(tt + 0.065, 'sine', f * 1.25, f * 0.95, 0.07, 0.006, 0.006, pan, 0);
    }
  }
  function pirpir(t, pan, n, f, vol) {   // kanat ya da kitap sayfası: hızlı, yumuşak hışırtılar
    for (let i = 0; i < n; i++) K.gur(t + i * (0.045 + rnd() * 0.015), 0.04, 'bandpass', f * (0.9 + rnd() * 0.25), f * 0.8, 1.1, vol * (1 - i / (n + 2)), 0.004, cl(pan + (rnd() - 0.5) * 0.3, -0.8, 0.8), 0, S());
  }
  function yukselenCan(t, vol, adet, taban, pan) {   // akordan yükselen kısa çan dizisi (ödül)
    const ak = akor || AK.D, tn = akTon(ak, taban || 79, adet + 2, PENT.concat(ak.ton));
    for (let i = 0; i < adet; i++) K.zil(hz(tn[i]), t + i * 0.085, vol * (1 - i * 0.08), 1.4, cl((pan || 0) + (i - adet / 2) * 0.12, -0.7, 0.7), S(), i === adet - 1);
  }
  function vin(t, dur, f0, f1, vol, pan) {   // uçurtma/rüzgâr vınlaması: süzgeçli gürültü süpürmesi
    K.gur(t, dur, 'bandpass', f0, f1, 1.6, vol, dur * 0.35, pan, 1, S());
  }
  function sipirti(t, guc, pan) {   // kürek ya da sıçrama: suya girer, iki minik damla
    K.gur(t, 0.32, 'bandpass', 1500, 520, 0.9, 0.022 * guc, 0.015, pan, 1, S());
    K.gur(t + 0.02, 0.14, 'highpass', 4200, 3000, 0.6, 0.006 * guc, 0.004, pan, 0, S());
    K.damla(1100 + rnd() * 500, t + 0.2 + rnd() * 0.1, 0.008 * guc, pan, S());
    if (guc > 0.5) K.damla(1500 + rnd() * 500, t + 0.34 + rnd() * 0.1, 0.005 * guc, -pan, S());
  }
  function kalp(t) {   // sarılma kalbi: sıcak "tum-tum" (orta bölgede; iPad'de de duyulur) + yükselen sıcak çanlar
    for (const [dt, v] of [[0, 1], [0.24, 0.75], [1.05, 0.8], [1.29, 0.6]]) {
      K.ton(t + dt, 'sine', 196, 150, 0.22, 0.03 * v, 0.01, 0, 0);
      K.ton(t + dt, 'triangle', 392, 300, 0.12, 0.008 * v, 0.006, 0, 0);
    }
    yukselenCan(t + 0.5, 0.016, 5, 78, 0);
    K.kabar([62, 66, 69, 74, 78], t + 0.1, 1.2, 1.4, 2.6, 0.018, K.sahneG, true);
  }
  const SFX = {
    k12Zil(t, v) { zilSes(t, v && v.kim, v && v.uzak); },
    k12OgrenciSelam(t, v) { if (v && v.dokun) zilSes(t, 'anne', true); },
    k12ScooterIt(t) { K.gur(t, 0.13, 'lowpass', 900, 500, 0.7, 0.02, 0.01, -0.1, 0, S()); K.gur(t + 0.01, 0.06, 'bandpass', 2600, 2000, 1, 0.005, 0.004, -0.1, 0, S()); },
    k12Teker(t, v) { K.gur(t, 0.018, 'bandpass', v && v.f || 3200, 2600, 3, (v && v.v) || 0.004, 0.002, 0.1, 0, S()); },
    k12BinisBasla(t) { K.ton(t, 'triangle', 700, 650, 0.07, 0.012, 0.003, 0, 0); yukselenCan(t + 0.15, 0.012, 3, 81, 0.2); },
    k12BinisAdim(t, v) { K.ton(t, 'triangle', v && v.faz === 'in' ? 620 : 760, 560, 0.06, 0.011, 0.003, 0, 0); },
    k12BinisBitti(t) { K.ton(t, 'triangle', 650, 600, 0.07, 0.011, 0.003, 0, 0); [86, 81].forEach((n, i) => K.zil(hz(n), t + 0.12 + i * 0.16, 0.011, 1.3, 0.1, S())); },
    k12Kurek(t, v) { sipirti(t, cl(v && Number.isFinite(v.guc) ? 0.45 + 0.55 * v.guc : 0.8, 0.3, 1), v && v.kim === 'feza' ? 0.25 : -0.2); },
    k12Sicrama(t, v) { sipirti(t, cl(v && Number.isFinite(v.guc) ? v.guc : 0.6, 0.25, 1), 0.2); },
    k12BalikZipla(t, v) { const k = v && v.kisik || 1; K.damla(700, t, 0.012 * k, 0.25, S()); sipirti(t + 0.45, 0.5 * k, 0.25); },
    k12OrdekDal(t) { K.damla(520, t, 0.013, 0.2, S()); },
    k12SuDokun(t) { K.damla(1000 + rnd() * 400, t, 0.014, 0, S()); K.damla(1600, t + 0.09, 0.006, 0.2, S()); },
    k12Damla(t) { K.damla(1100 + rnd() * 500, t, 0.013, 0, S()); },
    k12Nilufer(t) { const tn = akTon(akor || AK.D, 74, 3); tn.forEach((n, i) => K.cam(hz(n), t + i * 0.11, 0.012, 1.8, (i - 1) * 0.3, S(), i === 2)); },
    k12OrdekVak(t, v) { const y = !!(v && v.yavru); vak(t, y ? 0.011 : 0.016, 0.3, y); if (!y) vak(t + 0.24, 0.012, 0.3, false); },
    k12OrdekKatildi(t, v) { vak(t, 0.011, 0.3, true); vak(t + 0.15, 0.01, 0.35, true); const n = cl((v && v.n) || 1, 1, 6); yukselenCan(t + 0.3, 0.011, Math.min(4, 1 + n), 81, 0.2); },
    k12Kugu(t) { K.ton(t, 'sine', 620, 820, 0.4, 0.007, 0.05, 0.3, 2); K.ton(t + 0.38, 'sine', 780, 640, 0.35, 0.005, 0.05, 0.3, 2); },
    k12KediSev(t) { miyav(t, 0.017, 0.2, false); mirlti(t + 0.5, 0.012, 0.2); },
    k12KediMiyav(t) { miyav(t, 0.009, 0.35, true); },
    k12KediTakip(t) { kalimba(81, t, 0.014, 0.2); kalimba(86, t + 0.15, 0.012, 0.25); },
    k12KopekSev(t) { huf(t, 0.017); huf(t + 0.22, 0.013); for (let i = 0; i < 4; i++) K.ton(t + 0.5 + i * 0.13, 'triangle', 300, 260, 0.04, 0.006, 0.003, 0.2, 0); },
    k12KopekHav(t) { huf(t, 0.009); },
    k12KusDokun(t) { cikCik(t, 0.3, 3); },
    k12KusHavalan(t) { pirpir(t, 0.2, 9, 1600, 0.012); cikCik(t + 0.2, 0.4, 2); },
    k12MartiDokun(t) { K.ton(t, 'sine', 1300, 1850, 0.28, 0.005, 0.04, 0.5, 2); K.ton(t + 0.3, 'sine', 1800, 1250, 0.4, 0.004, 0.04, 0.5, 2); },
    k12KelebekDokun(t) { yukselenCan(t, 0.011, 4, 86, 0.1); },
    k12SincapDokun(t) { for (let i = 0; i < 3; i++) K.ton(t + i * 0.08, 'sine', 2600, 2300, 0.03, 0.007, 0.002, 0.3, 0); },
    k12FiskiyeDokun(t) { SFX.k12Fiskiye(t, { guc: 1 }); },
    k12Fiskiye(t, v) { const g = cl(v && Number.isFinite(v.guc) ? v.guc : 0.7, 0.3, 1); K.gur(t, 0.7, 'bandpass', 600, 2600, 0.8, 0.012 * g, 0.12, 0, 1, S()); for (let i = 0; i < 3; i++) K.damla(1100 + rnd() * 700, t + 0.45 + i * 0.12 + rnd() * 0.05, 0.006 * g, rnd() - 0.5, S()); },
    k12CicekActi(t, v) {   // çiçek açar: "pıt" + akordan yükselen kalimba; her yeni çiçek biraz daha yukarıdan
      const n = (v && Number.isFinite(v.n) ? v.n : cicekN++) % 6, tn = akTon(akor || AK.D, 74, 9, PENT);
      if (v && v.buyuk === false) { kalimba(tn[n], t, 0.011, (rnd() - 0.5) * 0.6, 0.7); return; }   // geçerken açılan: tek minik "pıt" 
      K.ton(t, 'sine', 500, 900, 0.07, 0.008, 0.004, 0, 0);
      for (let i = 0; i < 3; i++) kalimba(tn[Math.min(tn.length - 1, n + i)], t + 0.05 + i * 0.07, 0.016 - i * 0.003, -0.2 + i * 0.2);
    },
    k12AnneKokla(t) { K.gur(t, 0.7, 'lowpass', 900, 500, 0.6, 0.006, 0.3, -0.2, 0, S()); yukselenCan(t + 0.5, 0.008, 3, 86, -0.2); },
    k12UcurtmaVer(t) { vin(t, 0.8, 500, 1800, 0.01, 0.2); yukselenCan(t + 0.3, 0.011, 4, 79, 0.2); },
    k12Ucurtma(t, v) { vin(t, 0.9, 700, 1100 + 700 * cl(v && v.hiz || 0.5, 0, 1), 0.007, 0.3); },
    k12UcurtmaTakla(t) {   // takla: yükselen-alçalan vınlama + yukarı kayan çelesta + kurdelelerden ışıltı
      vin(t, 1.0, 600, 2600, 0.014, -0.3); vin(t + 0.5, 0.8, 2600, 700, 0.01, 0.3);
      const tn = akTon(akor || AK.D, 74, 7, PENT);
      tn.forEach((n, i) => K.tus(n, t + 0.08 + i * 0.07, 0.016, 0.8, -0.4 + i * 0.13, true, S()));
      for (let i = 0; i < 4; i++) K.zil(hz(tn[tn.length - 1 - i] + 12), t + 0.7 + i * 0.09, 0.007, 1.2, rnd() - 0.5, S(), false);
    },
    k12UcurtmaKurdele(t) { yukselenCan(t, 0.009, 3, 86, 0.3); },
    k12UcurtmaDon(t) { vin(t, 1.2, 1400, 600, 0.008, 0); [86, 81, 78].forEach((n, i) => K.zil(hz(n), t + 0.3 + i * 0.18, 0.009, 1.4, 0.2 - i * 0.2, S(), i === 2)); },
    k12Kelebek(t) { pirpir(t, 0.2, 5, 2200, 0.005); yukselenCan(t + 0.1, 0.008, 3, 88, 0.2); },
    k12SayfaResim(t) { const tn = akTon(akor || AK.D, 81, 5, PENT); tn.forEach((n, i) => K.cam(hz(n), t + i * 0.09, 0.009, 1.6, -0.4 + i * 0.2, S(), i === 4)); },
    k12Sayfa(t, v) { pirpir(t, v && Number.isFinite(v.pan) ? v.pan : 0.1, 6, 2800, 0.008); },
    k12Surpriz(t, v) {
      const tur = v && v.tur;
      if (tur === 'kopuk') for (let i = 0; i < 4; i++) K.ton(t + i * 0.13 + rnd() * 0.05, 'sine', 900 + rnd() * 400, 1600, 0.04, 0.008, 0.002, rnd() - 0.5, 1);
      else if (tur === 'halka') { const tn = akTon(akor || AK.D, 79, 6, PENT), i = cl((v && v.i) | 0, 0, 2); K.zil(hz(tn[i * 2]), t, 0.016, 1.6, -0.2 + i * 0.2, S()); K.zil(hz(tn[i * 2] + 12), t + 0.02, 0.006, 1.2, 0.2, S(), false); }
      else if (tur === 'yaprak') { vin(t, 1.2, 900, 1500, 0.005, 0); yukselenCan(t + 0.3, 0.007, 3, 86, 0); }
      else yukselenCan(t, 0.009, 3, 86, 0);
    },
    // botanik bahçesi ve büyük gölet (tur 2)
    // kaplumbağa sırası: dokunuş "tok" → başını çeker "fup" (Pop gir) → ~0,8 sn sonra "pop!" + iki minik "bup" ve çan (Kafa / Pop cik)
    k12KaplumbagaKafa(t) {
      popSes(t, 0.017, 0.15);
      const tn = akTon(akor || AK.D, 62, 4);
      K.hop(tn[0], t + 0.16, 0.024, -0.1, S()); K.hop(tn[2], t + 0.32, 0.022, 0.15, S());
      K.zil(hz(akTon(akor || AK.D, 86, 2, PENT)[0]), t + 0.5, 0.008, 1.2, 0.2, S(), false);
    },
    k12KaplumbagaDokun(t) { K.ksilofon(67, t, 0.016, 0.1, 'ahsap', S()); },
    k12KaplumbagaPop(t, v) { if (v && v.faz === 'gir') K.ton(t, 'sine', 620, 300, 0.12, 0.012, 0.004, 0.1, 0); },   // 'cik' → Kafa sesi (cal'da)
    k12KaplumbagaBak(t) { const tn = akTon(akor || AK.D, 79, 3, PENT); K.ksilofon(tn[0], t, 0.012, -0.2, 'ahsap', S()); K.ksilofon(tn[2], t + 0.14, 0.011, 0.2, 'ahsap', S()); },   // merakla "pıt-pıt"
    k12KaplumbagaDal(t) { K.damla(480, t, 0.013, 0.2, S()); sipirti(t + 0.06, 0.45, 0.2); },
    k12KaplumbagaAdim(t) { K.ton(t, 'triangle', 230, 180, 0.07, 0.006, 0.004, 0, 0); },
    k12KaplumbagaCik(t) { K.agiz(t, 330, 290, 0.12, 0.007, [700, 1300], [600, 1150], 0.02); K.damla(1200, t + 0.25, 0.006, 0.1, S()); },   // minik "hıh" + damla
    k12KaplumbagaKule(t, v) { const n = cl((v && v.n) | 0, 2, 3); yukselenCan(t, 0.013, n + 2, 74, 0); K.hop(86, t + 0.1 * (n + 2) + 0.05, 0.02, 0, S()); },   // "ta-da!"
    k12KaplumbagaYuru(t) {   // eşlikçi kaplumbağa: ağır adımlı, komik "pöm pöm pom" (alçak marimba); müzikte de kaplumbağa motifi sıklaşır
      eslikT = t;
      const tn = akTon(akor || AK.D, 50, 4);
      [[0, 0], [0.42, 1], [0.84, 0], [1.1, 2]].forEach(([dt, i]) => K.hop(tn[i], t + dt, 0.026, -0.1, S()));
    },
    k12KaplumbagaYoruldu(t) { K.gur(t, 0.3, 'lowpass', 600, 300, 0.7, 0.01, 0.04, 0, 0, S()); K.ton(t + 0.05, 'sine', 420, 250, 0.25, 0.008, 0.02, 0, 0); eslikT = -1e9; },   // komik "pöf"
    k12Selale(t, v) {
      const g = cl(v && Number.isFinite(v.guc) ? v.guc : 0.8, 0.3, 1);
      K.gur(t, 1.0, 'bandpass', 800, 2000, 0.8, 0.012 * g, 0.12, 0, 1, S());
      for (let i = 0; i < 3; i++) K.damla(1000 + rnd() * 800, t + 0.3 + i * 0.15 + rnd() * 0.05, 0.007 * g, rnd() - 0.5, S());
    },
    k12BotNilufer(t, v) { SFX.k12Nilufer(t, v); },
    k12BotSuDokun(t, v) { SFX.k12SuDokun(t, v); },
    // büyük gölet (tur 2 / 3)
    k12KazUcus(t) {   // uzakta V düzeninde kazlar: hafif "kak kak" soldan sağa + yumuşak kanat
      for (let i = 0; i < 4; i++) K.agiz(t + i * 0.35 + rnd() * 0.08, 420, 380, 0.13, 0.005, [1100, 2300], [900, 2000], 0.01);
      K.gur(t + 0.2, 1.4, 'lowpass', 600, 400, 0.6, 0.004, 0.5, 0, 1, S());
    },
    k12GolFiskiye(t, v) { SFX.k12Fiskiye(t, { guc: v && v.dokun ? 1 : 0.55 }); },
    k12Kopru(t) {   // köprünün altı: ferah yankılı an (sıcak akor + uzun yankılı çan); müziğin yankısı da birkaç saniye açılır
      kopruT = t;
      const tn = akTon(akor || AK.D, 74, 3);
      K.kabar((akor || AK.D).pad.map(n => n + 12), t, 0.8, 0.6, 2.4, 0.01, K.sahneG, false);
      tn.forEach((n, i) => K.cam(hz(n + 12), t + 0.2 + i * 0.22, 0.008, 2.6, (i - 1) * 0.4, S(), true));
    },
    k12EkmekAt(t) { K.gur(t,.24,'bandpass',1800,2900,.7,.009,.035,.1,.07,S()); },
    k12EkmekSu(t) { K.damla(1050,t,.009,.2,S()); },
    k12SazanYedi(t) { K.damla(440,t,.011,.15,S()); K.ksilofon(74,t+.12,.012,-.1,'ahsap',S()); },
    k12SazanOp(t) { K.damla(330 + rnd() * 60, t, 0.01, 0.15, S()); K.damla(420 + rnd() * 60, t + 0.13, 0.008, 0.15, S()); },   // "blup-blup" baloncuk
    k12SazanDokun(t) { sipirti(t, 0.7, 0.2); K.damla(380, t + 0.05, 0.01, 0.2, S()); },
    k12OrdekSuru(t, v) {
      if (v && v.faz === 'takip') { vak(t, 0.009, 0.3, true); vak(t + 0.16, 0.008, 0.35, true); yukselenCan(t + 0.35, 0.009, 3, 81, 0.25); return; }
      pirpir(t, 0.1, 10, 1100, 0.012);   // dağılırken kanat çırpışı + birkaç hafif vak
      for (let i = 0; i < 3; i++) vak(t + 0.15 + i * 0.19 + rnd() * 0.05, 0.009 - i * 0.002, -0.4 + i * 0.4, i === 2);
    },
    // botanik canlıları (CANLI tur 2)
    k12KirpiDokun(t) { for (let i = 0; i < 2; i++) K.gur(t + i * 0.12, 0.05, 'bandpass', 3200, 2800, 2, 0.007, 0.006, 0.2, 0, S()); },   // "fıs fıs"
    k12KirlangicDokun(t) { cikCik(t, 0.35, 2); K.ton(t + 0.25, 'sine', 3400, 4300, 0.1, 0.006, 0.01, 0.4, 1); },
    k12KelebekBulut(t, v) {
      const dokun = !!(v && (v.dokun || (v.o && v.o.dokun)));
      if (dokun) [98, 95, 93, 90, 86].forEach((n, i) => K.cam(hz(n), t + i * 0.09, 0.007, 1.6, (rnd() - 0.5) * 1.2, S(), i === 4));
      else yukselenCan(t, 0.005, 3, 88, 0);
    },
    k12KediSu(t) { for (let i = 0; i < 2; i++) K.gur(t + i * 0.2, 0.04, 'lowpass', 1800, 1200, 1, 0.004, 0.004, 0.25, 0, S()); },   // çok kısık "şap şap"
    k12SeraFiskiye(t, v) {   // sera sisi: uzun, yumuşak "fışşş" + birkaç damla
      const g = cl(v && Number.isFinite(v.guc) ? v.guc : 0.6, 0.3, 1);
      K.gur(t, 1.3, 'highpass', 3200, 4200, 0.6, 0.007 * g, 0.35, 0, 1, S());
      for (let i = 0; i < 3; i++) K.damla(1300 + rnd() * 700, t + 0.5 + i * 0.22 + rnd() * 0.08, 0.005 * g, rnd() - 0.5, S());
    },
    k12Kaz(t) { kaz(t, 0.014, 0.3); kaz(t + 0.26, 0.011, 0.3); },
    // kurbağalar (BOTANIK): yavru kurbağa gibi tatlı, iki heceli yumuşak "vı-rak" (boğaz kesesi iki kez şişer) · yapraktan yaprağa "boing"
    k12KurbagaVirak(t) {
      K.ton(t, 'sine', 170, 230, 0.09, 0.009, 0.01, -0.1, 0);                                       // kesenin şişmesi: tok, yumuşak "bu"
      K.agiz(t + 0.02, 330, 300, 0.1, 0.008, [420, 1500], [460, 1450], 0.012);                        // "vı"
      K.ton(t + 0.2, 'sine', 190, 260, 0.1, 0.008, 0.01, -0.1, 0);
      K.agiz(t + 0.22, 360, 280, 0.15, 0.009, [700, 1250], [760, 1200], 0.012);                       // "rak"
    },
    k12KurbagaZipla(t) { K.ton(t, 'sine', 300, 720, 0.13, 0.007, 0.004, 0.1, 0); K.ton(t + 0.04, 'triangle', 600, 1100, 0.07, 0.002, 0.003, 0.1, 0); },
    k12Balikcil(t) { for (let i = 0; i < 3; i++) K.gur(t + i * 0.32, 0.26, 'lowpass', 700, 380, 0.7, 0.012 * (1 - i * 0.2), 0.08, 0.3 - i * 0.2, 1, S()); },
    // final
    k12FinalBasla(t) { K.kabar([50, 57, 62, 66, 69], t, 1.6, 1.2, 2.8, 0.014, K.sahneG, false); },
    k12FinalAn(t, v) {
      const an = v && (v.an || v.ad);
      if (an === 'otur') { K.gur(t, 0.35, 'lowpass', 700, 300, 0.6, 0.012, 0.05, 0, 0, S()); }
      else if (an === 'kurabiye') { for (let i = 0; i < 3; i++) K.gur(t + i * 0.09 + rnd() * 0.02, 0.05, 'bandpass', 2800 + rnd() * 900, 2200, 1.4, 0.012, 0.003, 0.1, 0, S()); }
      else if (an === 'limonata') { K.gur(t, 0.5, 'highpass', 5000, 2500, 0.6, 0.006, 0.12, 0, 0, S()); K.cam(hz(98), t + 0.55, 0.008, 1, 0.2, S(), false); K.cam(hz(103), t + 0.68, 0.006, 0.9, -0.2, S(), false); }
      else if (an === 'takla') { vin(t, 0.6, 500, 2000, 0.01, 0); K.hop(74, t + 0.55, 0.03, 0, S()); K.hop(81, t + 0.7, 0.025, 0, S()); }
      else if (an === 'yildiz') { [98, 93, 90, 86, 81].forEach((n, i) => K.cam(hz(n), t + i * 0.14 + rnd() * 0.03, 0.009, 2, (rnd() - 0.5) * 1.2, S(), i === 0)); }
      else if (an === 'saril') kalp(t);
      else if (an === 'dans') yukselenCan(t, 0.012, 5, 74, 0);
    },
  };
  const ENAZ = { k12Zil: 0.5, k12Teker: 0.03, k12ScooterIt: 0.2, k12Kurek: 0.25, k12Sicrama: 0.2, k12BalikZipla: 0.6, k12OrdekVak: 0.5, k12OrdekKatildi: 0.6,
    k12KediSev: 0.9, k12KediMiyav: 2.5, k12KopekSev: 0.9, k12KopekHav: 2.5, k12KusDokun: 0.4, k12KusHavalan: 1.2, k12MartiDokun: 1.5, k12CicekActi: 0.07,
    k12UcurtmaTakla: 0.8, k12Ucurtma: 0.6, k12Sayfa: 0.15, k12Fiskiye: 0.4, k12FiskiyeDokun: 0.4, k12Damla: 0.06, k12SuDokun: 0.1, k12Nilufer: 0.25,
    k12KaplumbagaPop: 0.3, k12KaplumbagaBak: 2, k12KaplumbagaCik: 0.6, k12KaplumbagaKule: 1, k12KaplumbagaYuru: 3, k12KaplumbagaYoruldu: 2, k12Selale: 0.5,
    k12BotNilufer: 0.25, k12BotSuDokun: 0.1, k12KazUcus: 6, k12GolFiskiye: 0.5, k12Kopru: 3, k12SazanOp: 0.45, k12SazanDokun: 0.4, k12OrdekSuru: 0.8,
    k12KirpiDokun: 0.5, k12KirlangicDokun: 0.5, k12KurbagaVirak: 1.2, k12KurbagaZipla: 0.4, k12KelebekBulut: 0.7, k12KediSu: 2,
    k12FinalBasla: 3, k12KaplumbagaKafa: 0.2, k12KaplumbagaDokun: 0.2, k12KaplumbagaDal: 0.3, k12KaplumbagaAdim: 0.15, k12SeraFiskiye: 1, k12Kaz: 1, k12Balikcil: 1.5, k12Kelebek: 0.3, k12UcurtmaDon: 2, k12SayfaResim: 0.3, k12BinisAdim: 0.2, k12BinisBasla: 2, k12BinisBitti: 2, k12OgrenciSelam: 2, k12Surpriz: 0.3, k12FinalAn: 0.15 };
  let cicekN = 0;
  const sonCal = {};
  function cal(ad, v) {   // efekti şimdi çal (sessiz, uyuyan ya da kurulmamış motorda hiçbir şey olmaz)
    if (!K || !SFX[ad] || !K.calabilir()) return false;
    if (ad === 'k12KaplumbagaPop' && v && v.faz === 'cik') ad = 'k12KaplumbagaKafa';   // aynı "pop" iki olaydan gelir: bir kez çalsın
    if (ad === 'k12BalikZipla' && v && v.suru) v = Object.assign({}, v, { kisik: 0.5 });   // sürüde seyrek ve kısık
    const t = K.zaman() + 0.012, enAz = ENAZ[ad] != null ? ENAZ[ad] : 0.12;
    const anahtar = v && ad === 'k12FinalAn' ? ad + (v.an || v.ad) : v && ad === 'k12Zil' ? ad + (v.kim || '') : v && ad === 'k12Surpriz' ? ad + (v.tur || '') + (v.i | 0) : ad;
    if (sonCal[anahtar] != null && t - sonCal[anahtar] < enAz && t >= sonCal[anahtar]) return true;
    sonCal[anahtar] = t;
    try { SFX[ad](t, v); } catch (e) {}
    return true;
  }
  // AU.sfx('k12...') buraya gelir (muzik.js); true: çalındı/bizim efektimiz
  function sfx(k, v) { return SFX[k] ? (cal(k, v), true) : false; }

  // ───────────────────────── olaylar ─────────────────────────
  const b12 = () => typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 12;
  if (typeof OLAY !== 'undefined' && OLAY && OLAY.on) {
    for (const ad of Object.keys(SFX)) if (ad !== 'k12Teker') OLAY.on(ad, e => { if (b12()) cal(ad, e); });
    OLAY.on('k12BinisBasla', e => { if (b12()) binisOlay = e && e.ad || 'yol'; });
    OLAY.on('k12BinisBitti', () => { binisOlay = null; });
    OLAY.on('k12KayikBasla', () => { if (b12()) kayikOlay = true; });
    OLAY.on('k12KayikBitti', () => { kayikOlay = false; });
    OLAY.on('k12FinalBasla', () => { if (b12() && K && K.ac) finalBasla(K.zaman()); });
    OLAY.on('k12FinalAn', e => {
      if (!b12() || !K || !K.ac) return;
      const an = e && (e.an || e.ad);
      if (!fin) finalBasla(K.zaman());
      if (an === 'dans') fin.dans = true;
      if (an === 'saril') fin.saril = true;
    });
    OLAY.on('sahneAn', e => {
      if (!b12() || !fin) return;
      const ad = e && (e.ad || e);
      if (ad === 'isik' || ad === 'beyaz') fin.isik = true;
      if (ad === 'sabah') fin.sabah = true;
    });
    OLAY.on('durum', dd => { if (b12() && dd === 'final' && !fin && K && K.ac) finalBasla(K.zaman() - 30); });   // final yedeği (sahne doğrudan geldiyse)
  }

  // ───────────────────────── her kare (oyun.js) ─────────────────────────
  // binişte hız ölçümü (basılı tut = hızlan) ve tekerlek tıkırtısı: bisiklette serbest çark "tık-tık"ı süzülürken sıklaşır,
  // scooter'da kaldırım derzlerinin minik "tık"ı
  function adim() {
    if (!b12() || typeof P === 'undefined' || !P) return;
    const ms = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const dt = sonMs ? cl((ms - sonMs) / 1000, 0, 0.1) : 0; sonMs = ms;
    const tip = ucusTip();
    if (dt <= 0 || sonX == null) { sonX = P.x; return; }
    const vx = Math.abs(P.x - sonX) / dt; sonX = P.x;
    if (tip !== 'k12Binis') { hizHam += (0 - hizHam) * Math.min(1, dt * 4); tekerYol = 0; return; }
    hizHam += (cl(vx, 0, 1500) - hizHam) * Math.min(1, dt * 5);
    hizTepe = Math.max(300, hizTepe * (1 - dt * 0.01), hizHam);
    const pd = pedalDonuyor(), suzul = pd === null ? hizHam < sonHizHam - 2 : !pd; sonHizHam = hizHam;
    if (!K || !K.calabilir()) return;
    let arac = P.ucus.arac;
    try { if (typeof YOL12 !== 'undefined' && YOL12 && typeof YOL12.arac === 'function') arac = YOL12.arac() || arac; } catch (e) {}
    const scooter = arac === 'scooter';
    tekerYol += vx * dt;
    const ara = scooter ? 140 : suzul ? 26 : 70;
    if (hizHam > 40 && tekerYol > ara) {
      tekerYol = 0;
      cal('k12Teker', scooter ? { f: 2400, v: 0.005 } : { f: suzul ? 4200 : 3400, v: suzul ? 0.0035 : 0.0025 });
    }
  }
  // çocuğun çaldığı nota (final müzik anı / eski etkinlikler): Re pentatonik kalimba + çan
  let sonNota = -1;
  function nota(i) {
    if (!b12() || !K || !K.calabilir() || !Number.isInteger(i) || i < 0 || i > 3) return false;
    const t = K.zaman();
    if (t - sonNota < 0.065) return false;
    sonNota = t;
    const n = [74, 78, 81, 86][i];
    kalimba(n, t + 0.005, 0.05, (i - 1.5) * 0.25, 1.3);
    K.zil(hz(n + 12), t + 0.01, 0.012, 1.2, -(i - 1.5) * 0.2, S(), false);
    return true;
  }

  // ───────────────────────── kurulum ─────────────────────────
  function reset() {
    ilk = true; fi = 0; dongu = 0; bpm = 100; sonAk = null; akor = AK.D; sonBolge = 'sabah';
    hizB = 0; hizS = 0; dansS = 0; karT = -1; eslikT = -1e9; kopruT = -1e9; fin = null; binisOlay = null; kayikOlay = false; bitti = false; padSes = null; cicekN = 0; sonNota = -1;
    for (const b of BOLGELER) { W[b] = 0; WS[b] = 0; }
    for (const k in sonCal) delete sonCal[k];
  }
  function bagla(kit) { K = kit; reset(); }
  function birak(t) { if (K) padBirak(t != null ? t : simdi(), 1); }

  const yuvarla = o => { const r = {}; for (const k in o) r[k] = Math.round(o[k] * 100) / 100; return r; };
  return {
    bagla, cubuk, karisim, sfx, adim, nota, reset, birak,
    dur: () => birak(),
    get bitti() { return bitti; },
    get durum() {
      return { bagli: !!K, bolge: sonBolge, W: yuvarla(W), WS: yuvarla(WS), bpm: Math.round(bpm * 10) / 10, fi, dongu,
        akor: Object.keys(AK).find(k => AK[k] === akor), hiz: Math.round(hizB * 100) / 100, hizHam: Math.round(hizHam),
        final: fin ? fin.faz + ':' + fin.i : null, bitti };
    },
  };
})();
