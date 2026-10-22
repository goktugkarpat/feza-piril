/* yuva.js — Bölüm 9 (Pırıl'ın Ejderha Vadisi) finali: Ejderha Kalbi Şöleni (nesne 'ejderYuva', önek yu9). Sahibi: BUYUKANNE. Sözleşme: src/BOLUM9.md.
   Büyükanne'nin dağ yuvasında sönük Ejderha Kalbi kristali. Feza yanına gelince (yolculuk bittiyse) final başlar (~35 sn, 120 BPM: vuruş 0,5 sn,
   ölçü 2 sn; a = o.age):
     0–3     Feza kristale dokunur: elinden süzülen ışık; Pırıl (PIRIL9.ufle) ve yavrular ılık ışık üfler, kristal ısınır
     3       KALP PARLAR (sfx 'kalpParla', p_e_final): lila-altın-nane ışıma, kalp biçimli iç ışık, ışık halkası
     3–8     ışık dalgası bütün vadiye yayılır (dn9IsikEkle), gökte yıldızlar doğar, yetişkin ejderhalar ışık halkaları çizer
     7–11    Pırıl'ın annesi ve babası gökten süzülüp gelir (aileCiz), Pırıl'a sarılırlar (PIRIL9.kucak) — ea_merhaba
     11–15   herkes Feza'yı kucaklar (fezaPoz9 'kucak9'; Büyükanne kanatlarıyla sarar) — eb_merhaba
     15–20   Büyükanne kolyesinden parlak leylak pulu çıkarır, pul süzülüp Feza'nın göğsüne konar — bn_hediye
     20–35   herkes dans eder (aile, Büyükanne, Fıstık, Feza 'dans9', Pırıl PIRIL9.dans; yavrular yavru.js) — eb_dans
     28      DORUK (OLAY 'ejderDoruk' {o}, sfx 'ejderDoruk'): kristal en parlak, büyük halka, ejderhalar dev bir ışık çemberi, herkes zıplar
     35      OLAY 'ejderTamam' {o} (sabah)
   Olaylar: 'ejderFinal' {o, duration: 35, box}, 'ejderDoruk' {o}, 'ejderTamam' {o}; ayrıca 'ejderAile', 'ejderHediye' (bilgi). V9.final = true.
   Dışa açık: ejderFinalAn() (sn), ejderFinalNabiz() (0..1, vuruşta 1), ejderFinalKutu(), ejderKalpYer() {x, y, r}, yu9YavruDansYer(k, n, out),
   aileCiz(c, kim: 'anne'|'baba', x, y, s, t, o) (o: buyukanneCiz ile aynı alanlar; s = 1 → otururken ≈ 150 birim).
   Karede gradyan/filtre yok: kristal, ışınlar ve aile çizimleri önbellek tuvallerinde (buyukanne.js bn9Tuval). */
'use strict';
const YU9 = { SURE: 35, DORUK: 28, VUR: 0.5, KALP: 3 };
const YU9_PAL = {
  anne: { pur: '#d4acf4', purL: '#eedafd', purD: '#a87cd8', line: '#5a3a90', kar: '#c8e85a', karL: '#e2f498', karD: '#9cc232',
    ibik: '#2f8a2c', ibikL: '#55ad44', ibikD: '#1f5c1c', kulak: '#bde43a', kulakL: '#d9f27e', kulakD: '#93bd28',
    kanat: '#ffd2ec', kanatL: '#fff0f8', kanatD: '#e8a0cc', atki: '#ff9fc0', atkiL: '#ffd0e0', atkiD: '#e0709a', atkiS: '#fff1d6', atkiS2: '#ffc29a',
    gozluk: '#d9a640', gozlukL: '#ffe7a0', kas: '#7a4ab0', yanak: 'rgba(255,120,180,0.55)', agiz: '#4a1d4a', dil: '#ff8fb8',
    ad: 'a', gozlukVar: false, atkiVar: false, kolyeVar: false, topuz: false, kirpik: true, ek: null },
  baba: { pur: '#a990e8', purL: '#cbbaf8', purD: '#7c62c2', line: '#46307e', kar: '#bde43a', karL: '#d9f27e', karD: '#93bd28',
    ibik: '#287826', ibikL: '#4ea040', ibikD: '#195018', kulak: '#b4dc38', kulakL: '#d4ee78', kulakD: '#8ab424',
    kanat: '#d8caf8', kanatL: '#f0eaff', kanatD: '#a890e0', atki: '#7fe0c0', atkiL: '#c8f8e8', atkiD: '#3fae8a', atkiS: '#fff1d6', atkiS2: '#b89cff',
    gozluk: '#d9a640', gozlukL: '#ffe7a0', kas: '#3f2a6a', yanak: 'rgba(255,120,180,0.42)', agiz: '#4a1d4a', dil: '#ff8fb8',
    ad: 'p', gozlukVar: false, atkiVar: false, kolyeVar: false, topuz: false, kirpik: false, ek: null }
};
// aksesuarlar (canlı, ucuz): annenin başında pembe çiçek, babanın göğsünde nane papyon
YU9_PAL.anne.ek = function (c, t, yer, gu, yon) {
  if (yer === 'bas') { c.save(); c.translate(9.5, -15.5); c.rotate(0.3 + Math.sin(t * 1.3) * 0.05); yu9Cicek(c, 3.4); c.restore(); }
  else if (yer === 'yanBas') { c.save(); c.translate(14, -28.5); c.rotate(0.2); yu9Cicek(c, 3); c.restore(); }
};
YU9_PAL.baba.ek = function (c, t, yer, gu, yon) {
  if (yer === 'gogus') { c.save(); c.translate(0, gu + 2.4); c.rotate(Math.sin(t * 2) * 0.04); yu9Papyon(c); c.restore(); }
};
function yu9Cicek(c, r) {
  c.fillStyle = '#7fd06a'; c.beginPath(); c.ellipse(-r * 1.2, r * 0.6, r * 0.9, r * 0.4, -0.5, 0, 6.2832); c.fill();
  c.fillStyle = '#ff9fc0'; c.strokeStyle = '#e0709a'; c.lineWidth = 0.4;
  for (let i = 0; i < 5; i++) { const a = i * 1.2566; c.beginPath(); c.ellipse(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.55, r * 0.4, a, 0, 6.2832); c.fill(); c.stroke(); }
  c.fillStyle = '#ffe08a'; c.beginPath(); c.arc(0, 0, r * 0.38, 0, 6.2832); c.fill();
}
function yu9Papyon(c) {
  c.fillStyle = '#6fd8a8'; c.strokeStyle = '#2e8f6f'; c.lineWidth = 0.5;
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(0, 0); c.lineTo(sd * 5, -3); c.quadraticCurveTo(sd * 6, 0, sd * 5, 3); c.closePath(); c.fill(); c.stroke(); }
  c.fillStyle = '#3fbf8a'; c.beginPath(); c.ellipse(0, 0, 1.6, 1.9, 0, 0, 6.2832); c.fill(); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-3.2, -1, 1, 0.5, -0.4, 0, 6.2832); c.ellipse(2.8, -1, 1, 0.5, 0.4, 0, 6.2832); c.fill();
}
function aileCiz(c, kim, x, y, s, t, o) {
  const P0 = YU9_PAL[kim === 'baba' ? 'baba' : 'anne'];
  if (typeof buyukanneCiz !== 'function' || typeof bn9PC === 'undefined') return null;
  const eski = bn9PC; bn9PC = P0;
  let d = null; try { d = buyukanneCiz(c, x, y, (s || 1) * (kim === 'baba' ? 0.66 : 0.6), t, o); } finally { bn9PC = eski; }
  return d;
}

// ── final saati ──
const YU9_S = { o: null };
function ejderFinalAn() { const o = YU9_S.o; return o && o.basla ? o.age : 0; }
function ejderFinalNabiz() { const o = YU9_S.o; if (!o || !o.basla) return 0; const u = (o.age % YU9.VUR) / YU9.VUR; return Math.pow(1 - u, 3); }
function ejderFinalKutu() { const o = YU9_S.o; return o ? o.box : null; }
function ejderKalpYer() { const o = YU9_S.o; return o ? { x: o.x, y: o.y - 100, r: 90 } : null; }
function yu9YavruDansYer(k, n, out) {   // yavruların dans yeri: Feza'nın iki yanında, kristalin önünde yarım halka
  const o = YU9_S.o; if (!o) return out;
  const m = Math.max(1, n | 0), u = m > 1 ? k / (m - 1) : 0.5, x = o.x - 330 + u * 520 + (k % 2 ? 14 : -14);
  out[0] = x; out[1] = o.y; return out;
}
function yu9Sfx(ad, v) { if (typeof AU !== 'undefined' && AU && typeof AU.sfx === 'function') { try { AU.sfx(ad, v); } catch (e) {} } }
function yu9Soyle(k) { if (typeof SES !== 'undefined' && SES && typeof SES.soyle === 'function') { try { SES.soyle(k, { oncelik: 3 }); } catch (e) {} } }
function yu9Piril(ad, ...a) { if (typeof PIRIL9 !== 'undefined' && PIRIL9 && typeof PIRIL9[ad] === 'function') { try { PIRIL9[ad](...a); } catch (e) {} } }
function yu9Feza(poz, sure, opt) { if (typeof fezaPoz9 === 'function') { try { fezaPoz9(poz, sure, opt); } catch (e) {} } }

// ── önbellekli çizimler: kristal (sönük / parlak), ışınlar, yıldız ──
function yu9KristalYol(q, sx, h, w) {   // altıgen sivri kristal: taban (0,0), tepe (0,-h)
  q.beginPath(); q.moveTo(0, -h); q.lineTo(-w * 0.9, -h * 0.72); q.lineTo(-w, -h * 0.2); q.lineTo(0, 0); q.lineTo(w, -h * 0.2); q.lineTo(w * 0.9, -h * 0.72); q.closePath();
}
function yu9KalpSpr(parlak) {
  return bn9Tuval(parlak ? 'yuKalpP' : 'yuKalpS', -110, -200, 220, 240, q => {
    // taş kaide: yosunlu, altın bantlı
    q.fillStyle = bn9GL(q, 0, -36, 0, 30, 0, '#a896c8', 1, '#5f5088'); q.beginPath(); q.ellipse(0, 0, 92, 30, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#6fd8a8'; q.beginPath(); q.ellipse(0, -12, 88, 18, 0, 0, 6.2832); q.fill();
    q.fillStyle = '#c8f08a'; q.beginPath(); q.ellipse(-20, -16, 50, 8, -0.05, 0, 6.2832); q.fill();
    q.strokeStyle = '#e8c070'; q.lineWidth = 3; q.beginPath(); q.ellipse(0, -2, 90, 26, 0, 0.1, Math.PI - 0.1); q.stroke();
    for (const [x, y, c] of [[-60, -10, '#ff9fc0'], [-40, -4, '#b89cff'], [52, -8, '#ffd27a'], [70, -14, '#ff9fc0'], [30, -2, '#7fe0f0']]) { q.fillStyle = c; q.beginPath(); q.arc(x, y, 4, 0, 6.2832); q.fill(); }
    const renk = (a, b, c2) => parlak ? bn9GL(q, 0, -190, 0, 0, 0, a, 0.5, b, 1, c2) : bn9GL(q, 0, -190, 0, 0, 0, '#c4bcd8', 0.5, '#a49cba', 1, '#8a84a4');
    const kristal = (x, y, rot, h, w) => {
      q.save(); q.translate(x, y); q.rotate(rot);
      q.fillStyle = renk('#f2eaff', '#c9b4ff', '#8fe8c4'); yu9KristalYol(q, 0, h, w); q.fill();
      q.fillStyle = parlak ? 'rgba(255,240,200,.45)' : 'rgba(255,255,255,.18)'; q.beginPath(); q.moveTo(0, -h); q.lineTo(-w * 0.9, -h * 0.72); q.lineTo(-w, -h * 0.2); q.lineTo(0, 0); q.closePath(); q.fill();
      q.fillStyle = parlak ? 'rgba(120,80,200,.18)' : 'rgba(60,50,90,.22)'; q.beginPath(); q.moveTo(0, -h); q.lineTo(w * 0.9, -h * 0.72); q.lineTo(w, -h * 0.2); q.lineTo(0, 0); q.closePath(); q.fill();
      q.strokeStyle = parlak ? 'rgba(255,255,255,.8)' : 'rgba(255,255,255,.35)'; q.lineWidth = 1.6; q.beginPath(); q.moveTo(0, -h); q.lineTo(0, 0); q.moveTo(-w * 0.9, -h * 0.72); q.lineTo(-w * 0.35, -h * 0.5); q.stroke();
      q.strokeStyle = parlak ? '#9a7ad8' : '#6e6890'; q.lineWidth = 2.2; yu9KristalYol(q, 0, h, w); q.stroke();
      q.restore();
    };
    kristal(-46, -18, -0.42, 70, 15); kristal(48, -16, 0.38, 80, 16); kristal(-22, -20, -0.15, 104, 20);
    kristal(0, -20, 0, 168, 32);
    if (parlak) {   // kalp biçimli iç ışık
      q.save(); q.translate(0, -88);
      q.fillStyle = bn9GR(q, 0, 0, 2, 0, 0, 30, 0, 'rgba(255,250,230,1)', 0.5, 'rgba(255,200,220,.8)', 1, 'rgba(255,170,210,0)');
      q.beginPath(); q.moveTo(0, 20); q.bezierCurveTo(-30, 0, -20, -24, 0, -12); q.bezierCurveTo(20, -24, 30, 0, 0, 20); q.fill();
      q.restore();
    } else { q.fillStyle = 'rgba(200,190,230,.35)'; q.save(); q.translate(0, -88); q.beginPath(); q.moveTo(0, 16); q.bezierCurveTo(-24, 0, -16, -19, 0, -10); q.bezierCurveTo(16, -19, 24, 0, 0, 16); q.fill(); q.restore(); }
  }, 2.4);
}
function yu9IsinSpr() {   // dönen yumuşak ışık ışınları (merkez): 600×600
  return bn9Tuval('yuIsin', -300, -300, 600, 600, q => {
    for (let i = 0; i < 10; i++) {
      const a = i / 10 * 6.2832, w = i % 2 ? 0.09 : 0.14;
      q.fillStyle = bn9GR(q, 0, 0, 10, 0, 0, 300, 0, i % 3 === 0 ? 'rgba(255,230,170,.55)' : i % 3 === 1 ? 'rgba(220,200,255,.5)' : 'rgba(180,250,220,.5)', 1, 'rgba(255,255,255,0)');
      q.beginPath(); q.moveTo(0, 0); q.arc(0, 0, 300, a - w, a + w); q.closePath(); q.fill();
    }
  }, 0.8);
}

// ── sabit havuzlar: yıldızlar, gök ejderhalarının ışık izleri ──
const YU9_YN = 70, yu9Yil = []; { const r = rng(2468); for (let i = 0; i < YU9_YN; i++) yu9Yil.push({ fx: r(), fy: r() * 0.62, t0: 4 + r() * 9, s: 0.5 + r() * 0.9, f: r() * 6, c: (r() * 6) | 0 }); }
const YU9_IZN = 48;
function yu9EjKur() { const L = []; for (let i = 0; i < 3; i++) L.push({ x: 0, y: 0, a: 0, k: 0, iz: new Float32Array(YU9_IZN * 2), n: 0, i: 0, adT: 0, ci: i }); return L; }

TUR.kaydet('ejderYuva', {
  kur(o) {
    o.basla = false; o.age = 0; o.r = o.r || 120; o.t = 0; o.done = false; o.tamam = false; o.doruk = false; o.ev = {};
    o.box = { x0: o.x - 440, x1: o.x + 440, y0: o.y - 560, y1: o.y + 60 };
    o.parla = 0; o.isin = 0; o.ej = yu9EjKur(); o.isindi = false; o.isP = 0;
    o.bn = { x: o.x + 190, y: o.y, yon: -1, poz: 'otur', op: { poz: 'otur', yon: -1, kanat: 0.2, gulumse: 0.85, kolye: 5, kolyeMaske: 31, isik: 0.4, sar: 0, dans: 0, faz: 0, katman: '', bakX: -0.5, bakY: 0.1, basEgim: 0 }, hop: 0 };
    o.an = { x: o.x - 900, y: o.y - 520, yon: 1, op: { poz: 'ucus', yon: 1, kanatF: 0, kanat: 1, gulumse: 1, sar: 0, dans: 0, faz: 0, katman: '' }, hop: 0, gor: 0 };
    o.ba = { x: o.x - 1000, y: o.y - 600, yon: 1, op: { poz: 'ucus', yon: 1, kanatF: 0, kanat: 1, gulumse: 1, sar: 0, dans: 0, faz: 0, katman: '' }, hop: 0, gor: 0 };
    o.fs = { x: o.x - 120, y: o.y - 220, op: { renk: 'fistik', yon: 1, mutlu: 1, kanat: 0, ucus: 1, kanatAc: 1, dans: 0, agiz: 0 } };
    o.pul = { x: 0, y: 0, a: 0, u: 0, t: 0 };
    o.fx = o.x - 90; o.fy = o.y;
    YU9_S.o = o;
  },
  dokun(o) {
    const V = typeof V9 !== 'undefined' ? V9 : null;
    const binisVar = !!(TUR.al('buyukanneBinis') && NESNELER.some(n => n.tip === 'buyukanneBinis'));
    if (P.ucus || o.basla || (V && !V.binis && binisVar && !NESNELER.some(n => n.tip === 'buyukanneBinis' && n.done))) { o.dokundu = false; return; }
    yu9Basla(o);
  },
  guncelle(o, dt) {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    dt = Math.min(dt, 0.05); o.t += dt;
    if (!o.isindi && Math.abs(P.x - o.x) < 3000) {   // yaklaşırken önbellekleri karelere yayarak ısıt
      const L = [() => yu9KalpSpr(false), () => yu9KalpSpr(true), yu9IsinSpr, () => aileCiz(yu9IsitC(), 'anne', 0, 0, 1, 0, { poz: 'otur' }), () => aileCiz(yu9IsitC(), 'baba', 0, 0, 1, 0, { poz: 'otur' }),
        () => aileCiz(yu9IsitC(), 'anne', 0, 0, 1, 0, { poz: 'ayakta' }), () => aileCiz(yu9IsitC(), 'baba', 0, 0, 1, 0, { poz: 'ayakta' }), () => aileCiz(yu9IsitC(), 'anne', 0, 0, 1, 0, { poz: 'ucus' }), () => aileCiz(yu9IsitC(), 'baba', 0, 0, 1, 0, { poz: 'ucus' })];
      if (o.isP < L.length) { try { L[o.isP](); } catch (e) {} o.isP++; } else o.isindi = true;
    }
    yu9BnYer(o, dt);
    if (!o.basla) {   // Feza yaklaşınca kristalde nabız gibi soluk ışık (dokun daveti)
      const yak = clamp(1 - Math.abs(P.x - o.x) / 600, 0, 1); o.parla = lerp(o.parla, 0.08 + 0.14 * yak * (0.5 + 0.5 * Math.sin(o.t * 2.4)), 1 - Math.exp(-dt * 3));
      return;
    }
    const a0 = o.age; o.age += dt; const a = o.age, ev = o.ev, nb = ejderFinalNabiz();
    P.kilit = Math.max(P.kilit || 0, 0.5);
    // 0–3: dokunuş, ışık üfleme; 3: Kalp parlar
    if (a0 < 0.6 && a >= 0.6) yu9Piril('ufle', o.x, o.y - 100, 2.4);
    o.parla = a < YU9.KALP ? lerp(0.1, 0.45, smooth(a / YU9.KALP)) : Math.min(1, 0.75 + 0.15 * nb + (a >= YU9.DORUK && a < YU9.DORUK + 4 ? 0.25 : 0));
    o.isin = smooth(clamp((a - YU9.KALP) / 1.5, 0, 1)) * (a > YU9.SURE - 3 ? 1 - 0.5 * smooth((a - YU9.SURE + 3) / 3) : 1);
    if (!ev.kalp && a >= YU9.KALP) {
      ev.kalp = true; yu9Sfx('kalpParla'); yu9Soyle('p_e_final'); lightTarget = 1;
      ripples.push({ x: o.x, y: o.y - 100, r: 0, life: 2.4 });
      burst(o.x, o.y - 110, 40, ['#d9c8ff', '#ffe6a8', '#a8f0d0', '#ffffff', '#ff9fc0'], 260, 1.6, 8);
      if (typeof dn9IsikEkle === 'function') { try { dn9IsikEkle(o.x, o.y - 100, '#ffe6a8', 4000); } catch (e) {} }
    }
    // 7: aile gelir, Pırıl'a sarılır
    if (!ev.aile && a >= 7) { ev.aile = true; OLAY.emit('ejderAile', { o }); }
    if (!ev.aileSoz && a >= 9) { ev.aileSoz = true; yu9Soyle('ea_merhaba'); }
    if (!ev.pkucak && a >= 9.2) { ev.pkucak = true; yu9Piril('kucak', o.x - 300, o.y - 70, 2.6); }
    // 11: herkes Feza'yı kucaklar
    if (!ev.fkucak && a >= 11.6) { ev.fkucak = true; yu9Feza('kucak9', 3.6, { boy: 1 }); yu9Piril('kucak', o.fx + 40, o.fy - 60, 3.2); yu9Soyle('eb_merhaba'); }
    // 15: hediye pul
    if (!ev.hediye && a >= 15.6) { ev.hediye = true; OLAY.emit('ejderHediye', { o }); yu9Soyle('bn_hediye'); yu9Sfx('kolyeParla'); }
    if (!ev.pulKondu && a >= 19.2) { ev.pulKondu = true; burst(o.fx, o.fy - 40, 18, ['#d9c8ff', '#b89cff', '#ffffff', '#ffe6a8'], 140, 1, 6); yu9Feza('sevinc', 1.2, {}); }
    // 20: dans
    if (!ev.dans && a >= 20.4) { ev.dans = true; yu9Piril('dans', o.fx, o.fy - 70); yu9Soyle('eb_dans'); yu9Feza('dans9', YU9.SURE - 20.4 + 1, { nabiz: 1 }); }
    if (!ev.doruk && a >= YU9.DORUK) {
      ev.doruk = true; o.doruk = true; lightTarget = 1; yu9Sfx('ejderDoruk'); OLAY.emit('ejderDoruk', { o });
      ripples.push({ x: o.x, y: o.y - 110, r: 0, life: 3 });
      burst(o.x, o.y - 140, 50, ['#d9c8ff', '#ffe6a8', '#a8f0d0', '#ff9fc0', '#7fe0f0', '#ffffff'], 300, 2, 8);
      for (const k of [o.an, o.ba, o.bn]) k.hop = 0.01;
    }
    if (o.doruk && a > YU9.DORUK + 5) o.doruk = false;
    // vuruşta zıplayışlar (dans)
    const vb0 = Math.floor(a0 / YU9.VUR), vb = Math.floor(a / YU9.VUR);
    if (vb !== vb0 && a > 20.4) { if (vb % 2 === 0) o.an.hop = 0.01; else o.ba.hop = 0.01; if (vb % 4 === 0) o.bn.hop = 0.01; }
    for (const k of [o.an, o.ba, o.bn]) if (k.hop > 0) { k.hop += dt / 0.42; if (k.hop >= 1) k.hop = 0; }
    yu9AileAdim(o, dt, a);
    yu9EjAdim(o, dt, a);
    yu9PulAdim(o, dt, a);
    if (a >= YU9.SURE && !ev.tamam) { ev.tamam = true; o.tamam = true; o.done = true; OLAY.emit('ejderTamam', { o }); }
  },
  ciz(o, tm) {
    const a = o.basla ? o.age : 0, nb = ejderFinalNabiz();
    if (o.basla) { yu9Yildizlar(o, tm, a); yu9EjCiz(o, tm, a); yu9Dalga(o, a); }
    yu9Kalp(o, tm, a, nb);
    yu9AileCiz(o, tm, a, 'arka');
  },
  cizOn(o, tm) {
    const a = o.basla ? o.age : 0;
    yu9AileCiz(o, tm, a, 'on');
    if (o.basla) { yu9Fistik(o, tm, a); yu9PulCiz(o, tm, a); if (a < 1.2) yu9DokunusIsik(o, a); }
  }
});
let yu9IC = null;
function yu9IsitC() { if (!yu9IC) { const c = document.createElement('canvas'); c.width = c.height = 4; yu9IC = c.getContext('2d'); } return yu9IC; }
function yu9Basla(o) {
  if (o.basla) return;
  o.basla = true; o.age = 0; o.ev = {}; o.done = false;
  const V = typeof V9 !== 'undefined' ? V9 : null; if (V) V.final = true;
  P.kilit = Math.max(P.kilit || 0, YU9.SURE + 1); P.vx = 0; P.buf = 0;
  if (typeof omHepsiniBirak === 'function') omHepsiniBirak();
  o.fx = P.x; o.fy = P.y;
  if (typeof BN9_BA !== 'undefined') { BN9_BA.yuvada = true; if (Number.isFinite(BN9_BA.x) && Math.abs(BN9_BA.x - o.x) < 1500 && BN9_BA.yer === 'yuva') { o.bn.x = BN9_BA.x; o.bn.y = BN9_BA.y; } }
  yu9Kadraj(o);
  yu9Sfx('ejderFinal');
  OLAY.emit('ejderFinal', { o, duration: YU9.SURE, box: o.box });
}
function yu9Kadraj(o) {
  const asp = typeof W !== 'undefined' && typeof H !== 'undefined' && H > 0 ? W / H : 1.33, gen = asp >= 1.2 ? 440 : asp >= 0.95 ? 380 : 330;
  const b = o.box; b.x0 = Math.min(o.x - gen, P.x - 120); b.x1 = Math.max(o.x + gen, P.x + 120); b.y0 = o.y - 560; b.y1 = o.y + (asp >= 0.95 ? 50 : 30);
}
// Büyükanne yuvada: yolculuktan gelince Kalp'in yanında oturur (BN9_BA.yuvada); finalde rolüne göre yer değiştirir
function yu9BnYer(o, dt) {
  const B = typeof BN9_BA !== 'undefined' ? BN9_BA : null;
  if (!o.basla) { if (B && B.yuvada && B.yer === 'yuva') { o.bn.x = B.x; o.bn.y = B.y; } return; }
}
function yu9Git(k, x, y, dt, hiz) { const kk = 1 - Math.exp(-dt * (hiz || 2.2)); k.x = lerp(k.x, x, kk); k.y = lerp(k.y, y, kk); }
function yu9AileAdim(o, dt, a) {
  const an = o.an, ba = o.ba, bn = o.bn, g0 = o.y;
  // aile: 7. sn'de gökten süzülerek gelir (yandan uçuş), 8.6'da yere konar, önden durur
  if (a >= 7) {
    const u = smooth(clamp((a - 7) / 1.8, 0, 1));
    an.gor = Math.min(1, an.gor + dt * 2); ba.gor = Math.min(1, ba.gor + dt * 1.6);
    if (a < 8.8) {
      an.x = lerp(o.x - 900, o.x - 250, u); an.y = lerp(o.y - 520, g0, u) - Math.sin(u * Math.PI) * 40; an.op.poz = 'ucus'; an.op.kanatF = a * 1.4 * 6.2832;
      ba.x = lerp(o.x - 1050, o.x - 380, u); ba.y = lerp(o.y - 600, g0, u) - Math.sin(u * Math.PI) * 50; ba.op.poz = 'ucus'; ba.op.kanatF = a * 1.3 * 6.2832 + 1;
      if (u > 0.92 && !o.ev.kondu) { o.ev.kondu = true; burst(o.x - 300, g0 - 20, 24, ['#d9c8ff', '#ffe6a8', '#ffffff'], 160, 1, 6); yu9Sfx('buyukanneKanat', 3); }
    } else {
      an.op.poz = 'kucak'; ba.op.poz = 'kucak';
      // 9–11.5: Pırıl'a sarılır; 11.6–15: Feza'nın yanına gelip kucaklar; 15–20: bakar; 20+: dans
      if (a < 11.6) { yu9Git(an, o.x - 250, g0, dt); yu9Git(ba, o.x - 360, g0, dt); an.op.sar = smooth(clamp((a - 9.4) / 0.8, 0, 1)) * (1 - smooth(clamp((a - 11) / 0.5, 0, 1))); ba.op.sar = an.op.sar * 0.85; }
      else if (a < 15.2) { yu9Git(an, o.fx - 110, g0, dt, 2.6); yu9Git(ba, o.fx - 210, g0, dt, 2.6); const s = smooth(clamp((a - 12.2) / 0.8, 0, 1)) * (1 - smooth(clamp((a - 14.6) / 0.5, 0, 1))); an.op.sar = s * 0.8; ba.op.sar = s * 0.6; }
      else if (a < 20.4) { an.op.poz = 'ayakta'; ba.op.poz = 'ayakta'; an.op.sar = 0; ba.op.sar = 0; yu9Git(an, o.fx - 150, g0, dt); yu9Git(ba, o.fx - 270, g0, dt); }
      else { an.op.poz = 'dans'; ba.op.poz = 'dans'; yu9Git(an, o.x - 260, g0, dt, 1.6); yu9Git(ba, o.x - 380, g0, dt, 1.6); }
    }
  }
  // Büyükanne: Kalp parlarken oturur; 11.6'da Feza'nın arkasına gelip kanatlarıyla sarar; 15–20 hediye; 20+ dans
  if (a < 11.4) { bn.op.poz = a > YU9.KALP ? 'ayakta' : 'otur'; bn.op.sar = 0; bn.op.kanat = a > YU9.KALP ? 0.5 + 0.2 * Math.sin(a * 2) : 0.2; bn.yon = -1; }
  else if (a < 15.2) { yu9Git(bn, o.fx + 70, g0, dt, 2.4); bn.op.poz = 'kucak'; bn.op.kanat = 1; bn.op.sar = smooth(clamp((a - 12.2) / 0.9, 0, 1)) * (1 - smooth(clamp((a - 14.6) / 0.5, 0, 1))); }
  else if (a < 20.4) { yu9Git(bn, o.fx + 170, g0, dt, 2.4); bn.op.poz = 'ayakta'; bn.op.sar = 0; bn.op.kanat = 0.4; }
  else { yu9Git(bn, o.x + 200, g0, dt, 1.6); bn.op.poz = 'dans'; bn.op.kanat = 0.6; }
  bn.op.basEgim = a > 15.4 && a < 19.4 ? -0.12 * Math.sin(clamp((a - 15.4) / 4, 0, 1) * Math.PI) : 0;
  bn.op.kolyeMaske = o.ev.hediye ? 30 : 31;   // leylak pul (ilk yuva) hediye edildi
  bn.op.isik = Math.max(0.4, o.parla * 0.8);
  // Fıstık: önce Kalp'in üstünde süzülür, dansta herkesin üstünde takla atar
  const fs = o.fs; yu9Git(fs, a < 20 ? o.x - 40 + Math.sin(a * 0.9) * 60 : o.fx + Math.sin(a * 1.6) * 120, (a < 20 ? o.y - 260 : o.y - 230) + Math.sin(a * 2.3) * 16, dt, 2);
}
function yu9EjAdim(o, dt, a) {   // gökte yetişkin ejderhalar ışık halkaları çizer (izleri sabit halka tamponunda)
  const b = o.box, cx0 = (b.x0 + b.x1) / 2, top = b.y0;
  for (let i = 0; i < 3; i++) {
    const E = o.ej[i], gir = smooth(clamp((a - 3.6 - i * 0.6) / 1.4, 0, 1)), dor = a >= YU9.DORUK && a < YU9.DORUK + 5 ? smooth(clamp((a - YU9.DORUK) / 1.2, 0, 1)) * (1 - smooth(clamp((a - YU9.DORUK - 3.8) / 1.2, 0, 1))) : 0;
    const R = lerp(70 + i * 12, 210, dor), cx = lerp(cx0 + (i - 1) * 290, cx0, dor), cy = lerp(top + 120 + (i % 2) * 40, top + 150, dor);
    const an = a * (0.9 + i * 0.12) * (dor ? 1.4 : 1) + i * 2.1;
    E.x = lerp(cx + (i - 1) * 600, cx + Math.cos(an) * R, gir); E.y = lerp(cy - 200, cy + Math.sin(an) * R * 0.55, gir); E.a = gir * (a > YU9.SURE - 2 ? 1 - smooth((a - YU9.SURE + 2) / 2) : 1); E.k = an;
    E.adT += dt; if (E.adT > 0.05 && gir > 0.5) { E.adT = 0; E.iz[E.i * 2] = E.x; E.iz[E.i * 2 + 1] = E.y; E.i = (E.i + 1) % YU9_IZN; E.n = Math.min(YU9_IZN, E.n + 1); }
  }
}
function yu9PulAdim(o, dt, a) {   // hediye pul: Büyükanne'nin kolyesinden süzülür, Feza'nın çevresinde döner, göğsüne konar
  const p = o.pul; if (!o.ev.hediye) return;
  p.t = a - 15.6; const u = clamp(p.t / 3.6, 0, 1), e = smooth(u);
  const kx = o.bn.x - 4, ky = o.bn.y - 96, hx = o.fx + 4, hy = o.fy - 42;
  const tur = Math.sin(u * Math.PI) * 50, an = u * 6.2832 * 1.2;
  p.x = lerp(kx, hx, e) + Math.cos(an) * tur; p.y = lerp(ky, hy, e) - Math.sin(e * Math.PI) * 90 + Math.sin(an) * tur * 0.4; p.a = 1; p.u = u;
}
// ── çizim ──
function yu9Kalp(o, tm, a, nb) {
  const x = o.x, y = o.y, pa = clamp(o.parla, 0, 1), lit = o.basla ? smooth(clamp((a - YU9.KALP + 0.4) / 0.8, 0, 1)) : 0;
  g.globalCompositeOperation = 'lighter';
  dglow('#c8b0ff', x, y - 100, 120 + 160 * pa, 0.12 + 0.35 * pa);
  if (lit > 0) { dglow('#ffe6a8', x, y - 100, 200 + 60 * nb, 0.25 * lit); dglow('#a8f0d0', x, y - 60, 260, 0.12 * lit); }
  if (o.isin > 0.01) { const sp = yu9IsinSpr(); g.save(); g.translate(x, y - 100); g.rotate(tm * 0.12); const s = 0.9 + 0.25 * nb + (o.doruk ? 0.5 : 0); g.scale(s, s); g.globalAlpha = 0.5 * o.isin; bn9Koy(g, sp); g.rotate(-tm * 0.2); g.globalAlpha = 0.3 * o.isin; g.scale(0.7, 0.7); bn9Koy(g, sp); g.restore(); g.globalAlpha = 1; }
  g.globalCompositeOperation = 'source-over';
  const s1 = yu9KalpSpr(false); g.save(); g.translate(x, y); bn9Koy(g, s1);
  if (lit > 0) { g.globalAlpha = lit; bn9Koy(g, yu9KalpSpr(true)); g.globalAlpha = 1; }
  g.restore();
  if (lit > 0 || pa > 0.05) {   // kristalin çevresinde süzülen parıltılar
    for (let i = 0; i < 8; i++) { const u = (tm * 0.3 + i / 8) % 1, r = 4 + 2 * Math.sin(i + tm), xx = x + Math.sin(i * 2.3 + tm * 0.8) * (40 + i * 6), yy = y - 30 - u * 200; g.globalAlpha = Math.sin(u * Math.PI) * Math.max(lit, pa * 0.6); g.drawImage(bn9TozSpr(i % 6).c, xx - r, yy - r, r * 2, r * 2); }
    g.globalAlpha = 1;
  }
}
function yu9Dalga(o, a) {   // Kalp parlayınca vadiye yayılan ışık dalgası (zeminde genişleyen halka)
  const u = (a - YU9.KALP) / 4.5; if (u <= 0 || u >= 1) { if (!(a >= YU9.DORUK && a < YU9.DORUK + 3)) return; }
  g.globalCompositeOperation = 'lighter';
  if (u > 0 && u < 1) { const e = 1 - Math.pow(1 - u, 2); for (let k = 0; k < 3; k++) { g.globalAlpha = (1 - u) * (0.5 - k * 0.12); g.strokeStyle = ['#ffe6a8', '#d9c8ff', '#a8f0d0'][k]; g.lineWidth = 10 - k * 3; g.beginPath(); g.ellipse(o.x, o.y - 20, 80 + e * (1900 + k * 120), 30 + e * 260, 0, 0, 6.2832); g.stroke(); } }
  if (a >= YU9.DORUK && a < YU9.DORUK + 3) { const v = (a - YU9.DORUK) / 3, e = 1 - Math.pow(1 - v, 2.2); for (let k = 0; k < 2; k++) { g.globalAlpha = (1 - v) * 0.6; g.strokeStyle = k ? '#ff9fc0' : '#a8f0d0'; g.lineWidth = 6; g.beginPath(); g.ellipse(o.x, o.y - 110, 90 + e * (520 + k * 90), 60 + e * (260 + k * 40), 0, 0, 6.2832); g.stroke(); } }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
}
function yu9Yildizlar(o, tm, a) {   // yıldızlar doğar: kutunun gök kısmında, ekran genişliğine yayılı
  const VHg = VH / cam.zoom;
  for (let i = 0; i < YU9_YN; i++) {
    const Y = yu9Yil[i], d = a - Y.t0; if (d <= 0) continue;
    const dog = Math.min(1, d / 0.8), x = cam.x + Y.fx * VW, y = cam.y + Y.fy * VHg * 0.8, tw = 0.65 + 0.35 * Math.sin(tm * 2.2 + Y.f), r = (3 + 5 * Y.s) * tw * (d < 0.8 ? 1 + 1.4 * Math.sin(dog * Math.PI) : 1);
    g.globalAlpha = dog * 0.9; g.drawImage(bn9TozSpr(Y.c === 2 ? 0 : Y.c).c, x - r, y - r, r * 2, r * 2);
  }
  g.globalAlpha = 1;
}
function yu9EjCiz(o, tm, a) {
  g.globalCompositeOperation = 'lighter'; g.lineCap = 'round';
  const R = ['#ffe6a8', '#d9c8ff', '#a8f0d0'];
  for (let i = 0; i < 3; i++) {   // ışık izleri (halka)
    const E = o.ej[i]; if (E.n < 2 || E.a < 0.02) continue;
    for (let j = 1; j < E.n; j++) {
      const k0 = (E.i - j + YU9_IZN) % YU9_IZN, k1 = (E.i - j - 1 + YU9_IZN) % YU9_IZN; if (j + 1 > E.n) break;
      const al = (1 - j / E.n) * E.a; g.strokeStyle = R[i]; g.globalAlpha = al * 0.55; g.lineWidth = 7 * (1 - j / E.n) + 1.5;
      g.beginPath(); g.moveTo(E.iz[k0 * 2], E.iz[k0 * 2 + 1]); g.lineTo(E.iz[k1 * 2], E.iz[k1 * 2 + 1]); g.stroke();
    }
  }
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  for (let i = 0; i < 3; i++) {
    const E = o.ej[i]; if (E.a < 0.02 || typeof bn9EjderSpr !== 'function') continue;
    const fr = ((tm * (1.2 + i * 0.1) * 6) | 0) % 6, sp = bn9EjderSpr(i, fr), yon = Math.cos(E.k) > 0 ? -1 : 1, s = 0.5;
    g.save(); g.translate(E.x, E.y); g.scale(yon * s, s); g.globalAlpha = E.a * 0.8; g.drawImage(sp.c, sp.x0, sp.y0, sp.w, sp.h); g.restore(); g.globalAlpha = 1;
    g.globalCompositeOperation = 'lighter'; dglow(R[i], E.x, E.y - 10, 50, 0.3 * E.a); g.globalCompositeOperation = 'source-over';
  }
}
function yu9AileCiz(o, tm, a, kat) {
  const nb = ejderFinalNabiz(), B = typeof BN9_BA !== 'undefined' ? BN9_BA : null;
  // Büyükanne (yolculuktan yuvaya geldiyse ya da final başladıysa burada)
  if (o.basla || (B && B.yuvada)) {
    const bn = o.bn, op = bn.op, h = bn.hop > 0 ? Math.sin(bn.hop * Math.PI) * 34 : 0;
    op.yon = op.poz === 'kucak' || op.poz === 'ayakta' ? (o.fx < bn.x ? -1 : 1) : -1; op.dans = op.poz === 'dans' ? 1 : 0; op.faz = a * 2; op.gulumse = o.basla && a > YU9.KALP ? 1 : 0.85;
    op.katman = op.poz === 'kucak' ? kat : (kat === 'arka' ? '' : 'yok');
    if (op.katman !== 'yok') buyukanneCiz(g, bn.x, bn.y - h, typeof BN9_S !== 'undefined' ? BN9_S : 1, tm, op);
  }
  if (!o.basla) return;
  for (const [kim, k] of [['baba', o.ba], ['anne', o.an]]) {
    if (k.gor <= 0.01) continue;
    const op = k.op, h = k.hop > 0 ? Math.sin(k.hop * Math.PI) * 26 : 0;
    op.dans = op.poz === 'dans' ? 1 : 0; op.faz = a * 2 + (kim === 'baba' ? 0.5 : 0); op.gulumse = 1; op.konus = 0;
    op.yon = op.poz === 'ucus' ? 1 : (a < 11.6 ? (kim === 'anne' ? -1 : 1) : 1); op.bakX = op.yon * 0.5;
    if (op.poz === 'kucak') op.katman = kat; else if (kat === 'on') continue; else op.katman = '';
    const ga = g.globalAlpha; g.globalAlpha = ga * k.gor; aileCiz(g, kim, k.x, k.y - h, 1, tm + (kim === 'baba' ? 1.3 : 0), op); g.globalAlpha = ga;
  }
}
function yu9Fistik(o, tm, a) {
  if (typeof yavruCiz !== 'function') return;
  const fs = o.fs, op = fs.op; op.kanat = 0.5 + 0.5 * Math.sin(tm * 10); op.yon = Math.cos(a * 0.9) > 0 ? 1 : -1; op.dans = a > 20 ? 1 : 0; op.agiz = o.doruk ? 0.7 : 0;
  try { g.save(); g.translate(fs.x, fs.y); if (a > 20.4) g.rotate(Math.max(0, Math.sin((a - 20.4) * 0.8)) > 0.97 ? (a * 6) % 6.2832 : 0); yavruCiz(g, 0, 0, 1.1, tm + 2, op); g.restore(); } catch (e) { g.restore(); }
}
function yu9PulCiz(o, tm, a) {   // hediye leylak pul (önce uçarken, sonra Feza'nın göğsünde parlar)
  if (!o.ev.hediye) return;
  const p = o.pul, kondu = p.u >= 1, x = kondu ? o.fx + 4 : p.x, y = kondu ? o.fy - 42 + (P.y - o.fy) : p.y, r = kondu ? 6 : 9;
  g.globalCompositeOperation = 'lighter'; dglow('#d9c8ff', x, y, kondu ? 26 + 6 * ejderFinalNabiz() : 40, kondu ? 0.45 : 0.6); g.globalCompositeOperation = 'source-over';
  if (!kondu) for (let i = 0; i < 5; i++) { const u = (tm * 1.4 + i / 5) % 1; g.globalAlpha = (1 - u) * 0.8; g.drawImage(bn9TozSpr(4).c, x - 4 - u * 14 * Math.cos(i), y - 4 + u * 20, 8, 8); }
  g.globalAlpha = 1;
  g.save(); g.translate(x, y); g.rotate(kondu ? Math.sin(tm * 2) * 0.1 : tm * 3); g.scale(r / 2, r / 2); bn9PulCiz(g, 0, 0, 2, 0, tm, 1); g.restore();
}
function yu9DokunusIsik(o, a) {   // Feza'nın elinden kristale süzülen ışık
  g.globalCompositeOperation = 'lighter';
  for (let j = 5; j >= 0; j--) { const u = clamp(a / 1.1 - j * 0.06, 0, 1), e = smooth(u), bx = lerp(o.fx + 20, o.x, e), by = lerp(o.fy - 40, o.y - 100, e) - Math.sin(e * Math.PI) * 60; dglow(j ? '#d9c8ff' : '#fff2c8', bx, by, j ? 12 - j : 22, j ? 0.45 * (1 - j / 6) : 0.9); }
  g.globalCompositeOperation = 'source-over';
}
