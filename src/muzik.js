/* muzik.js – müzik ve sesler (hepsi Web Audio ile üretilir): AU
   Sözleşme: src/SPEC.md. Klasik script; tek üst düzey ad: AU.

   Müzik: müzik kutusu ezgisi + sıcak pad (ana ruh), üstüne yumuşak piyano/çelesta, arp arpejleri, yaylı pad,
   çok hafif "aa" korosu (formant süzgeçli), alçak nabızlar. Bölgeye göre (P.x + BOLUM.bolgeler) karakter değişir ve
   katmanlar yavaşça geçiş yapar; ışık (light) arttıkça katmanlar çoğalır. Büyük Pofuduk uyurken uykulu tuba motifi +
   horlama (OLAY 'horlama' {faz:'al'|'ver', sure} ile pofuduk.js çizimi eşleyebilir). Giriş sahnesi: müzik kutusu ninnisi.
   Ağaç yanınca büyük bir kabarış, ardından sabah ninnisi.
   Hikâye anları (sahne.js OLAY 'sahneAn' {ad, mod}): uyudu · piril_uyandi (ninninin üstüne "rüya" katmanı açılır) ·
   eriyor (arp glissandoları + yükselen parıltı) · orman (sıcak çözülme) · isik (giriş: ışık yükselir / final: altın
   kabarış → final müziği doruğa atlar) · sabah (kuşlar; final müziği çözülüp ninniye bağlanır) · goz_kirp (çelesta).
   Büyük Pofuduk kıpırdadıkça (buyukAsama) açıklıkta umutlu bir çelesta cevabı belirir; uyanınca açıklık müziği
   "şenlik"e döner (akor her ölçüde, neşeli tuba "ım-pa"). Feza'nın peşindeki uyanık Pofuduklar (geçit) için
   zıplayan bir "bup" motifi: kaç Pofuduk varsa o kadar dolu, Feza durunca kısılır; finalde dans ederler.
   Adımlar feza.js'in 'adim' {x,y,hiz,inis} olayıyla, yüzeye göre: yosun / dal (ızgara 2) / nilüfer (sulu) / Pofuduk.
   Besteler (PARCA / TEMA / FINAL_MEL): iki motif her şeyi taşır – Feza'nın sallanan "üç–iki–bir"i ve Pırıl'ın altılı
   sıçrayışı (A–F#'–E'–D'). Başlık/giriş: "Feza ve Pırıl" ana teması (3/4 müzik kutusu, ilk dokunuşta yumuşakça başlar);
   Pırıl uyanınca onun teması (çelesta). Her bölgenin A/B temaları motiflerden; döngüler A → B → A çelesta → B seyrek.
   Pırıl ışık üflerken, Feza'yı kurtarırken ve sabah göz kırparken motifi o anki akora oturtulup alıntılanır.
   Büyük Pofuduk uyanınca şenlik polkası (ım-pa tuba); finalde dans, sonra doruk: Pırıl'ın teması tüm orkestrayla,
   sabah olunca tema kaldığı yerden müzik kutusunda sürer.
   Zamanlama: 2.4 sn'lik ölçüler önceden planlanır (look-ahead), ses sayısı sınırlı, her nota zarflı (çıt yok),
   son katta limiter. ?sessiz → hiç ses yok.

   Bölüm 2 "Yıldız Gölü" (BOLUM_NO==2): orman bölgeleri yerine tek 'yildiz' bölgesi – A Lidyen (A B C# D# E F# G#; Bölüm 1 D majör),
   geniş ve yavaş: cam çan ezgisi (Yıldız Teması, 16 ölçü: A / B / A+ / C seyrek), kristal kıvılcımlar, su damlaları, harp arpı,
   yumuşak pad, "oo" korosu, sakin bas. Katmanlar SAYAC.yildiz/yildizTop oranına göre açılır (yildizEtkisi / yildizCubuk), yıldız
   hayvanı uyanırken (hayvanAsama 1–3) zenginleşir, hayvanUyandi'da doruk; DURUM 'final' gelince Bölüm 1'in final müziği (D majör) aynen çalar.
   Efektler (AU.sfx / OLAY): yildizUyan, yildizYuksel, yildizYerles (perde yerleşme sırasıyla yükselir), yildizTas(i), yildizTasBelir,
   hayvanAsama, hayvanUyan, hayvanFirlat, hayvanUyandi. sarki* notaları Bölüm 2'de A majör pentatoniğe (−5 yarım ses) taşınır.

   Bölüm 3 "Bulut Ülkesi" (BOLUM_NO==3): G Lidyen gün doğumu – 'bulut' (Bulut Teması: harp, flüt/okarina, yaylı pad, hafif çan; katmanlar
   SAYAC.kuzu/kuzuTop ile açılır) · uçuşta 'ucus' (ucusBasla→ucusBitti) · gokkusagiBasla'da doruk. Efektler: bulutZip esinti gokkusagiParca
   gokkusagiBasla gokkusagiTamam kayma kuzuRenk kuzuMee ucusBasla pirilBuyu isiltiTopla ucusIn sekilOv sekilCanlan sekilBitti. Ayrıntı: src/BOLUM3.md › SES notları.

   Bölüm 6 "Şenlik Kalesi" (BOLUM_NO==6): G Miksolidyen masal şenliği (G C Em D + büyülü F), 12/8 hafif hoplayan dans (0.2 sn sekizlik).
   'kale': müzik kutusu / kaval (flüt) / çelesta sırayla ezgiyi taşır; fenerler (V6.fener/fenerTop, OLAY 'fener') yandıkça katmanlar açılır:
   arp akışı → pizz bas → yumuşak tef → yaylı + çelesta akorları → koro ve soprano çanları; midilli uyandıkça uzakta minik toynak "tık-tok".
   Her fener kasabadan minik bir cevap alır (kule çanı / pencere çanları / kaval / toynak); yeni katman açılınca o ölçüde kendini tanıtır.
   'halkaMini' (halkaBasla→halkaBitti): 32 ölçülük yolculuk A (kaval) · B (süzülen çelesta) · A' · C (köprü), yarım zamanda dörtnala toynak;
   'halkaHiz' → 'halkaKosu' (büyük final koşusu: çift zaman, yükselen arp kaskadları, parlak çanlar); 'halkaFinalSicrama' → büyük glissando +
   tutulmuş akor, müzik nefesini tutar; iniş kale temasına bağlanır. Her halkada akora uyan yükselen çan.
   'senlikFinal' {duration} (V6.final / DURUM final): bölümler s6FinalSec'te: dans (kaval, oyuncak borular, alkış şıkırtısı, çan kulesi) →
   doruk ('senlikDoruk' ya da süre × 0,6: ön vuruş kabarışı, büyük akor, koro, çanlar) → son (müzik kutusu kadansı) → sükûn → sabah ninnisi.
   'fisek' {tip, x, y}: türe göre fiyuu / püf / pırıl serpinti / altın yağmur (akordan, patlamasız); dünyada fişek varken müzik kendi fişeğini atmaz.
   Efektler: senlikFener · sovalye (tahta tık + minik fanfar) · halkaNota · halkaHiz · halkaFinalSicrama · senlikDoruk · fisek · midilli ·
   midilliZipla · kopruIndi (büyülü glissando) · bolum6Basla.

   Bölüm 7 "Kuzey Işıkları" (BOLUM_NO==7): E majör kış ninnisi (3/4, 0.4 sn adım; A'da Lidyen D#, finalde ♭VI C büyüsü). 'kar': müzik kutusu /
   çelesta / kristal çan sırayla ezgiyi taşır; kar fenerleri (V7.fener/fenerTop, OLAY 'karFener') yandıkça katmanlar açılır: harp akışı →
   yaylılar → kristal çan cevabı → "aah" korosu → soprano çanları; ferah yankı, çok kısık uzak rüzgâr + kar hışırtısı. 'kardanMini'
   (kardanBasla→kardanBitti): hoplayan "bup" teması (12/8) · 'kizakMini' (kizakBasla→kizakBitti): hızlı zilli kızak teması (16'lık, çıngırak);
   'kizakUc' {n} → 'kizakIn': gökyüzünde uçuş (ferah: yaylı + koro yükselir, süzülen flüt/kristal ezgi, uzun arp glissandoları; 2. uçuş daha
   büyük: kuzey ışığı perdesi, soprano çanları; uçuşta 'kizakTane' parlak akor da açar) · 'kizakHiz' → büyük iniş (her 16'lıkta çıngırak, arp kaskadı) · 'kizakFinalSicrama' → büyük glissando, müzik nefesini tutar · 'kizakInis'
   {buyuk} → aşağı süzülen iniş glissandosu + karda "pof". 'kuzeyFinal' {duration} (V7.final / DURUM final): dalga (dalgalanan kuzey ışığı
   perdesi) → doruk ('kuzeyDoruk' ya da süre × 0,85) → son → sükûn → sabah ninnisi (sabah doruğun ortasına gelirse önce son kadansı çalar).
   Efektler: kFener (kristal çın + gökte yükselen ince glissando) · kYavru (pizzicato) · kZipla · geyikTanis · kardanTop · kardanParca ·
   kardanCanlan (yumuşak fanfar) · kizakTane (yükselen çan) · kizakKristal · kizakKacti · kizakZipla ("vıııı") · kuzeyDoruk · kuzeyTamam ·
   golKay (buzlu gölde süzülme: P.buz (oyun.js) ile kayarken ya da OLAY 'buzKay'/'golKay') · bolum7Basla · karda adım ve iniş.

   Bölüm 8 "Balkabağı Gecesi" (BOLUM_NO==8): Cadılar Bayramı ama gülümseten (Addams Ailesi'nin tatlı hâli) – Re minör, ay anında ve finalin doruğunda
   Re majör. Çalgılar: kemik ksilofon, klavsen, oyuncak org, hayalet düdüğü ("uuu": vibratolu sinüs, portamento), parmak şıklatma, tef, tuba/fagot,
   pizzicato, çelesta, müzik kutusu; sevimli-gizemli iniş çizgisi (D–C#–C–B), armonik minör A7. Bölgeler (BOLUM.bolgeler): giris/tarla 'cadi' ve
   koru 'koru8' (parmak ucu ninni temposu, 100 BPM; döngüden döngüye renk değişir, fenerler V8.fener/fenerTop yandıkça katman katman dolar:
   1 şıklatma + pizz yürüyüş · 3 klavsen tik-tak · 5 tuba ım-pa · 7 tef + org · 10 göksel çan; hayaletçikler bulundukça "uuu" cevapları) ·
   'kabakYuzMini' (12/8 hoplayan; KABAKYUZ.aktif / kabakYuzBasla–Bitti) · 'iskeletMini' (112 BPM 4/4 hafif swing eşlik; 'iskeletBasla' anına
   hizalanır, akor çocuğun cümlesini izler: Dm · F · Gm/C · Dm; ezgiyi iskeletler çalar, büyük dansta eşlik susar) · 'sokak' (şeker mi şaka mı
   yürüyüşü, kapılarla şenlenir; SEKER8.aktif iken biraz kısılır) · 'kazanMini' (köpüklü cadı valsi; bahçede hafif) · 'supurgeMini' (120 BPM:
   kalkış → gece → 'supurgeAy' ay anı (Re majör, yarım zaman) → köy) · 'meydan8' (120 BPM şenlik hazırlığı) · 'cadiFinal' (120 BPM, ölçüler
   'cadiFinal' anına = kabak.js final saatine hizalı: ön vuruş · 2–9 A · 10–13 B · 28. sn DORUK Re majör · 34. sn sıcak son · sükûn → sabah).
   Değişken ölçü süresi: cubukUz. Efektler: bolum8Basla kostumPuf kabakFener hayaletKikir hayaletCee kabakYuzBaloncuk kabakYuzParca kabakYuzKikir
   kabakYuzCanlan iskeletNota (i 0..5 = D F G A C D') iskeletDans (1–3 · 5 · 6) kemikTakir kapiTak kapiAc kapiFener sekerUc sekerSepet sakaKonfeti
   sakaYay kazanFokur kazanMalzeme kazanPuf supurgeCanlan supurgeVin supurgeSeker supurgeInis cadiFinal cadiDoruk cadiTamam fisek yarasaPir
   kediMiyav baykusHu. AU.nabiz() → o anki vuruş {bpm, vurus, faz, olcu, prog} (dans eşlemesi).

   API: AU.start() · AU.sfx(ad, v) · AU.muzik('orman'|'ninni'|'final') (sahne zorlaması, isteğe bağlı)
        AU.baglam() / AU.sesCikis() / AU.kis(acik, kim) (ses.js konuşma için) · AU.akor() (o anki akorun notaları)
   Olaylar kendiliğinden dinlenir (zıplama, iniş, çiçek, tohum, uyandi, aydinlat, dustu, kurtarildi, agac, buyukAsama...);
   Finalde: 'fener' (her fenere pentatonik tırmanan bir çan) · 'yildizIz' (fırlatılış ışıltısı) · 'sarsinti' (Büyük
   Pofuduk'un neşeli inişi: yumuşak "bumf" + ışıltı; aynı anda gelen AU.sfx('puf') çalmaz).
   eski AU.sfx('jump'|'dbl'|'bloom'|'land'|'splash') çağrıları aynı anda olay geldiyse iki kez çalmaz. */
'use strict';
const AU = (() => {
  // ───────────────────────── temel ─────────────────────────
  let ac = null, test = null, sessizDeneme = false;
  let cikis, limit, master, muzikG, kisG, kisEQ, sfxG, sesG, sahneG, sahneHam, rev, revMuzik, revSfx, revSfxCok, dly, dlyGiris;
  let gurBuf = null, ruzgarG = null, ruzgarBP = null, yalaG = null, karG = null;
  const B = {};                 // müzik katmanı otobüsleri
  const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
  const cl = (v, a, b) => v < a ? a : v > b ? b : v;
  const rnd = Math.random;
  const sec = a => a[Math.floor(rnd() * a.length)];
  const BAR = 2.4;              // ölçü (sn): 4/4'te 8 sekizlik × 0.3 sn; ninnide 3/4, 6 × 0.4 sn
  const zaman = () => test ? test.t : ac.currentTime;
  const isik = () => (typeof light === 'number' ? cl(light, 0, 1) : 0);

  // ───────────────────────── akorlar (MIDI) ─────────────────────────
  // bas: bas notası · pad: ses dizilişi · mel: ezginin kullanabileceği perde sınıfları (çatışmasız)
  const A = (bas, pad, mel) => ({ bas, pad, mel, ton: pad.map(n => n % 12) });
  const AK = {
    D9: A(38, [50, 54, 57, 61, 64], [2, 4, 6, 9, 11, 1]),
    Bm9: A(47, [47, 50, 54, 57, 61], [11, 1, 2, 4, 6, 9]),
    G7: A(43, [43, 50, 54, 59, 62], [7, 9, 11, 2, 4, 6]),
    Asus: A(45, [45, 50, 52, 57, 59], [9, 11, 2, 4, 6]),
    Em9: A(40, [52, 55, 59, 62, 66], [4, 6, 7, 11, 2]),
    A6: A(45, [49, 52, 54, 57, 61], [9, 11, 1, 4, 6]),
    G9s: A(43, [50, 54, 57, 59, 61], [7, 9, 11, 1, 2, 6]),
    Fsm7: A(42, [49, 52, 54, 57, 61], [6, 9, 11, 1, 4]),
    Bm11: A(47, [50, 52, 54, 57, 59], [11, 2, 4, 6, 9]),
    C7s: A(48, [52, 55, 59, 62, 66], [4, 7, 11, 2, 6]),
    Fs7sus: A(42, [47, 52, 54, 59, 61], [6, 11, 1, 4]),
    D: A(38, [50, 54, 57, 62, 66], [2, 6, 9, 4, 11]),
    ACs: A(49, [52, 57, 61, 64, 69], [9, 1, 4, 11, 6]),
    Bm: A(47, [50, 54, 59, 62, 66], [11, 2, 6, 1, 4]),
    DFs: A(42, [50, 57, 62, 66, 69], [2, 6, 9, 4]),
    A: A(45, [49, 52, 57, 61, 64], [9, 1, 4, 11, 6]),
    GD: A(38, [50, 55, 59, 62, 67], [7, 11, 2, 9, 4]),
    G: A(43, [50, 55, 59, 62, 67], [7, 11, 2, 9, 4]),
    Em: A(40, [52, 55, 59, 64, 67], [4, 7, 11, 2, 6]),
    // Bölüm 2 – Yıldız Gölü: A Lidyen (A B C# D# E F# G#); Bölüm 1'in D majöründen bir basamak "yukarıda", geniş, havadar
    YA: A(45, [57, 61, 64, 68, 71], [9, 11, 1, 4, 6, 8]),
    YB: A(47, [54, 59, 63, 66, 69], [11, 1, 3, 6, 9, 8]),
    YF: A(42, [54, 57, 61, 64, 68], [6, 9, 1, 4, 8, 11]),
    YE: A(40, [52, 59, 64, 66, 71], [4, 6, 8, 11, 1, 9]),
    YL: A(45, [57, 61, 64, 68, 75], [9, 11, 1, 3, 4, 6, 8]),
    YC: A(49, [56, 59, 64, 68, 73], [1, 4, 8, 11, 6, 9, 3]),
    YG: A(44, [56, 59, 63, 66, 71], [8, 11, 3, 6, 1, 4]),
    // Bölüm 3 – Bulut Ülkesi: G Lidyen (G A B C# D E F#; Bölüm 1'in D majörüyle aynı notalar, G'nin üstünde: gün doğumu, havada asılı)
    BG: A(43, [55, 59, 62, 66, 69], [7, 9, 11, 2, 4, 6]),        // Gmaj9
    BA: A(43, [57, 61, 64, 69, 71], [9, 11, 1, 4, 6]),           // A/G (Lidyen II: ışıklı #4)
    BE: A(40, [52, 55, 59, 62, 66], [4, 6, 7, 11, 2, 9]),        // Em9
    BD: A(42, [54, 57, 62, 66, 69], [2, 4, 6, 9, 11]),           // D/F#
    BB: A(47, [50, 54, 57, 59, 64], [11, 2, 4, 6, 9]),           // Bm11
    BS: A(45, [50, 52, 57, 59, 64], [9, 11, 2, 4, 6]),           // Asus
    // Uyuyan Yanardağ: F Lidyen. Sıcak majör yedililer, açık beşliler ve B doğalın masalsı ışığı.
    VF: A(41, [53, 57, 60, 64, 67], [5, 7, 9, 0, 2, 4, 11]),
    VC: A(48, [52, 55, 59, 62, 67], [0, 2, 4, 7, 9, 11]),
    VD: A(38, [50, 53, 57, 60, 64], [2, 4, 5, 9, 0, 7]),
    VG: A(43, [55, 59, 62, 64, 69], [7, 9, 11, 2, 4, 0]),
    VA: A(45, [57, 60, 64, 67, 71], [9, 11, 0, 4, 7, 2]),
    VR: A(41, [55, 60, 64, 67, 71], [5, 7, 9, 11, 0, 2, 4]),
    // Şenlik Kalesi: G Miksolidyen (G A B C D E F): sıcak majör akorlar + masalsı ♭VII (F) – orta çağ şenliği
    SG: A(43, [55, 59, 62, 69, 71], [7, 9, 11, 2, 4]),          // G add9
    SC: A(48, [52, 55, 60, 62, 67], [0, 2, 4, 7, 9]),           // C add9
    SEm: A(40, [52, 55, 59, 62, 67], [4, 7, 11, 2, 9]),         // Em7
    SD: A(38, [54, 57, 62, 64, 69], [2, 4, 6, 9, 11]),          // D add9
    SF: A(41, [53, 57, 60, 65, 69], [5, 9, 0, 7, 2]),           // F (♭VII: büyülü an)
    SAm: A(45, [57, 60, 64, 67, 71], [9, 0, 4, 7, 11, 2]),      // Am9 (halka yolculuğunun B kısmı / koşu: yükselen bas)
    // Kuzey Işıkları: E majör (E F# G# A B C# D#) kış ninnisi; A'da Lidyen D# ışıltısı, finalde ♭VI (C) kuzey ışığı büyüsü
    KE: A(40, [52, 56, 59, 63, 66], [4, 6, 8, 11, 1, 3]),       // Emaj9
    KC: A(37, [49, 52, 56, 59, 63], [1, 3, 4, 8, 11, 6]),       // C#m9
    KA: A(45, [57, 61, 64, 68, 75], [9, 11, 1, 4, 8, 3]),       // Amaj9#11 (D# tepede: buz ışıltısı)
    KB: A(47, [54, 59, 61, 63, 66], [11, 1, 3, 6, 8, 4]),       // B add9
    KBs: A(47, [52, 54, 59, 61, 66], [11, 1, 4, 6, 8]),         // Bsus4 add9 (çözülmeyi bekleyen)
    KG: A(44, [54, 56, 59, 63, 66], [8, 11, 3, 6, 1]),          // G#m7
    KF: A(42, [54, 57, 61, 64, 68], [6, 8, 9, 1, 4, 11]),       // F#m9
    KCb: A(48, [55, 59, 60, 64, 67], [0, 2, 4, 7, 11]),         // Cmaj7 (♭VI: kuzey ışıklarının büyülü anı)
    // Balkabağı Gecesi: Re minör (D E F G A Bb C; armonik minörde C#) – "sevimli-gizemli" iniş çizgisi D–C#–C–B; ay anı ve finalin doruğu Re majör (AK.D/G/A/Bm)
    CDm: A(38, [50, 53, 57, 62, 65], [2, 4, 5, 7, 9, 0]),        // Dm
    CDmM: A(37, [49, 53, 57, 62, 65], [2, 4, 5, 9, 1]),          // Dm/C# (majör yedili: tatlı gizem)
    CDm7: A(36, [48, 53, 57, 62, 65], [2, 4, 5, 7, 9, 0]),       // Dm7/C
    CDm6: A(35, [47, 53, 57, 62, 65], [2, 4, 5, 9, 11, 7]),      // Dm6/B
    CGm: A(43, [50, 55, 58, 62, 67], [7, 9, 10, 2, 5, 0]),       // Gm
    CGmB: A(46, [50, 55, 58, 62, 67], [7, 9, 10, 2, 5, 0]),      // Gm/Bb
    CGmD: A(38, [50, 55, 58, 62, 67], [7, 9, 10, 2, 5, 0]),      // Gm/D (koru)
    CA7: A(45, [49, 52, 55, 57, 61], [9, 1, 4, 7, 2]),           // A7 (armonik minör)
    CA7C: A(37, [52, 55, 57, 61, 64], [9, 1, 4, 7, 2]),          // A7/C#
    CA7s: A(45, [50, 52, 55, 57, 62], [9, 2, 4, 7, 11]),         // A7sus4
    CBb: A(46, [50, 53, 58, 62, 65], [10, 0, 2, 5, 7, 9]),       // Bb
    CF: A(41, [53, 57, 60, 65, 69], [5, 7, 9, 0, 2, 4]),         // F
    CC: A(48, [52, 55, 60, 64, 67], [0, 2, 4, 7, 9]),            // C
    CC7: A(48, [52, 55, 58, 60, 64], [0, 2, 4, 7, 9, 10]),       // C7
    CAm: A(45, [52, 57, 60, 64, 69], [9, 11, 0, 2, 4, 7]),       // Am
    CGB: A(47, [50, 55, 59, 62, 67], [7, 9, 11, 2, 4]),          // G/B (Dorian ışığı: koru)
    CEd: A(40, [52, 55, 58, 61, 64], [4, 7, 10, 1, 2]),          // E°7 (gizemli ama kısa)
    CAC: A(37, [49, 52, 57, 61, 64], [9, 1, 4, 11, 6, 2]),       // A/C# (ay anı, Re majör)
    // iskelet orkestrası: Re minör pentatoniğin (D F G A C) her notası her akorda uyumlu (E/B/C# yok). ISKELET'in cümleleri: Dm · F · Gm/C · Dm
    IDm: A(38, [50, 53, 57, 60, 65], [2, 5, 7, 9, 0]),           // Dm7
    IF: A(41, [53, 57, 60, 65, 69], [5, 7, 9, 0, 2]),            // F
    IGmC: A(36, [48, 55, 58, 62, 67], [7, 9, 10, 0, 2]),         // Gm/C
    IBb: A(46, [50, 53, 57, 62, 65], [2, 5, 7, 9, 0]),           // Bbmaj7
    IGm: A(43, [50, 53, 55, 58, 62], [7, 9, 0, 2, 5]),           // Gm7
  };
  // Başlık / rüya seçimi "Rüya Beşiği": 37 ölçü (3/4, 2.4 sn) ≈ 89 sn. Giriş 4 · A1 8 (ana tema) · B 9 (Pırıl'ın teması) · köprü 4 · A2 8 · son 4
  const BSL_AK = ('D D GD A  D GD D A Bm G A D  D Bm G A D Bm G A D  Bm9 Em9 Fsm7 Asus  D GD D A Bm Em A D  D GD A D').split(/\s+/);
  // cb: akor başına ölçü sayısı
  const PROG = {
    patika: { cb: 4, ak: ['D9', 'Bm9', 'G7', 'Asus'] },
    pofuduk: { cb: 2, ak: ['D9', 'G7', 'Em9', 'A6'] },
    gol: { cb: 4, ak: ['G9s', 'D9', 'Fsm7', 'Bm11'] },
    dallar: { cb: 2, ak: ['Bm9', 'G7', 'D9', 'A'] },
    sakli: { cb: 4, ak: ['Em9', 'C7s', 'Bm11', 'Fs7sus'] },
    aciklik: { cb: 4, ak: ['G7', 'D9', 'Em9', 'Asus'] },
    // Büyük Pofuduk uyandıktan sonra açıklık: aynı tonda, akor her ölçüde değişen, zıplayan bir şenlik
    senlik: { cb: 1, ak: ['D', 'G', 'Em9', 'A6', 'D', 'Bm9', 'G9s', 'Asus'] },
    // final: 0–7 şenlik dansı (ım-pa) · 8–15 doruk: Pırıl'ın teması, tüm orkestra · 16–17 çözülme → ninni
    final: { cb: 1, ak: ['D', 'G', 'Em9', 'A6', 'D', 'Bm9', 'G9s', 'Asus', 'D', 'Bm9', 'G7', 'A', 'D', 'Bm9', 'G7', 'A', 'D', 'D'], bitis: 'ninni' },
    // Bölüm 2: 8 akor × 2 ölçü (4.8 sn) = 38 sn'lik döngü; ezgi 16 ölçü (A / B / A+ / C seyrek)
    yildiz: { cb: 2, ak: ['YA', 'YB', 'YF', 'YE', 'YA', 'YL', 'YC', 'YG'] },
    // Bölüm 3: 8 akor × 2 ölçü (38 sn) · uçuş: akor her ölçüde (19 sn), daha hızlı ve yukarı bakan
    bulut: { cb: 2, ak: ['BG', 'BA', 'BE', 'BD', 'BG', 'BA', 'BB', 'BS'] },
    deniz: { cb: 2, ak: ['BG', 'BD', 'BE', 'BA', 'BG', 'BB', 'BE', 'BS'] },
    ucus: { cb: 1, ak: ['BG', 'BA', 'BE', 'BD', 'BG', 'BA', 'BD', 'BS'] },
    volkan: { cb: 2, ak: ['VF', 'VC', 'VD', 'VG', 'VF', 'VA', 'VR', 'VC', 'VD', 'VA', 'VG', 'VC', 'VF', 'VR', 'VG', 'VF'] },
    volkanKalp: { cb: 2, ak: ['VR', 'VC', 'VD', 'VA', 'VF', 'VG', 'VC', 'VF'] },
    // 14 ölçü / 33,6 sn: 35 sn'lik sal yolculuğunda giriş, uçuş, doruk ve iniş duyulur.
    lavsal: { cb: 1, ak: ['VF', 'VF', 'VD', 'VA', 'VF', 'VR', 'VF', 'VG', 'VA', 'VC', 'VR', 'VG', 'VC', 'VF'] },
    volkanFinal: { cb: 1, ak: ['VF', 'VR', 'VD', 'VC', 'VF', 'VA', 'VG', 'VC', 'VF', 'VR', 'VD', 'VG', 'VF', 'VC', 'VR', 'VF', 'VF', 'VF'] },
    // Bölüm 6: 8 akor × 2 ölçü = 38,4 sn'lik döngü (S_MEL 16 ölçü) · halka yolculuğu: akor her ölçüde · final: S_MEL ölçü ölçü + iki ölçü son
    kale: { cb: 2, ak: ['SG', 'SC', 'SEm', 'SD', 'SG', 'SF', 'SC', 'SD'] },
    // halka yolculuğu (32 ölçü = 76,8 sn; uzun yolculukta tekrar hissi olmasın): A koşan kaval · B süzülen çelesta (Am) ·
    // A' kaval + çelesta yankısı · C köprü (♭VII'den yükselir, A'ya bağlanır). 'halkaHiz' gelince 'halkaKosu' (büyük final koşusu).
    halkaMini: { cb: 1, ak: ['SG', 'SC', 'SD', 'SG', 'SEm', 'SC', 'SF', 'SD', 'SEm', 'SC', 'SG', 'SD', 'SEm', 'SC', 'SAm', 'SD',
      'SG', 'SC', 'SD', 'SG', 'SEm', 'SC', 'SF', 'SD', 'SF', 'SC', 'SG', 'SD', 'SF', 'SC', 'SEm', 'SD'] },
    halkaKosu: { cb: 1, ak: ['SG', 'SC', 'SAm', 'SD', 'SEm', 'SC', 'SF', 'SD'] },
    // final şenliği: bölümü s6FinalSec seçer (pi): 0–7 dans (S_MEL 0–7) · 8–15 doruk (S_MEL 8–15) · 16–17 son · 18–19 sükûn (sabaha)
    senlikFinal: { cb: 1, ak: ['SG', 'SG', 'SC', 'SC', 'SEm', 'SEm', 'SD', 'SD', 'SG', 'SG', 'SF', 'SF', 'SC', 'SC', 'SD', 'SD', 'SG', 'SG', 'SC', 'SG'] },
    // Bölüm 7: 8 akor × 2 ölçü = 38,4 sn'lik döngü (K_MEL 16 ölçü) · kardan adam: akor her ölçüde · kızak: 16 ölçü · final: kuzeyFinalCubuk bölümleri
    kar: { cb: 2, ak: ['KE', 'KC', 'KA', 'KBs', 'KE', 'KG', 'KA', 'KB'] },
    kardanMini: { cb: 1, ak: ['KE', 'KA', 'KBs', 'KE', 'KC', 'KA', 'KB', 'KE'] },
    kizakMini: { cb: 1, ak: ['KE', 'KE', 'KA', 'KB', 'KE', 'KC', 'KF', 'KB', 'KA', 'KB', 'KG', 'KC', 'KA', 'KB', 'KE', 'KE'] },
    // 0–7 dalga (K_MEL 0–7) · 8–15 doruk (K_DORUK) · 16–17 son · 18–19 sükûn (sabaha)
    kuzeyFinal: { cb: 1, ak: ['KE', 'KE', 'KC', 'KC', 'KA', 'KA', 'KBs', 'KB', 'KE', 'KB', 'KC', 'KA', 'KE', 'KCb', 'KA', 'KB', 'KE', 'KE', 'KA', 'KE'] },
    // Bölüm 8: ana tema 16 ölçü (38,4 sn; A iniş çizgisi · B hayalet cevabı) · koru 16 · kabak yüzü 8 (12/8) · iskelet 4 (112 BPM; oyun
    // başlayınca akor çocuğun cümlesini izler: c8AkorSec) · sokak 16 · kazan valsi 16 · süpürge (120 BPM) A 8 + B 8 + ay 4 (c8UcusSec seçer) ·
    // meydan 4 (120 BPM) · final: c8FinalSec seçer – 0–1 giriş, 2–9 A, 10–13 B, 14–16 doruk (Re majör), 17 son, 18–19 sükûn, 20 ön vuruş
    cadi: { cb: 1, ak: ['CDm', 'CDmM', 'CDm7', 'CDm6', 'CGmB', 'CA7', 'CDm', 'CA7', 'CBb', 'CF', 'CGm', 'CA7', 'CBb', 'CF', 'CEd', 'CA7'] },
    koru8: { cb: 1, ak: ['CDm', 'CGmD', 'CDm', 'CA7C', 'CDm7', 'CGB', 'CGmB', 'CA7', 'CBb', 'CC', 'CAm', 'CDm', 'CGm', 'CEd', 'CA7s', 'CA7'] },
    kabakYuzMini: { cb: 1, ak: ['CDm', 'CGm', 'CA7', 'CDm', 'CBb', 'CGm', 'CA7', 'CDm'] },
    iskeletMini: { cb: 1, ak: ['IDm', 'IF', 'IGmC', 'IDm'] },
    sokak: { cb: 1, ak: ['CDm', 'CA7', 'CA7', 'CDm', 'CGm', 'CDm', 'CA7', 'CDm', 'CF', 'CC7', 'CC7', 'CF', 'CBb', 'CF', 'CGm', 'CA7'] },
    kazanMini: { cb: 1, ak: ['CDm', 'CA7', 'CA7', 'CDm', 'CGm', 'CDm', 'CBb', 'CA7', 'CF', 'CC7', 'CC7', 'CF', 'CBb', 'CDm', 'CGm', 'CA7'] },
    supurgeMini: { cb: 1, ak: ['CDm', 'CBb', 'CF', 'CC', 'CDm', 'CBb', 'CGm', 'CA7', 'CBb', 'CF', 'CGm', 'CDm', 'CBb', 'CF', 'CGm', 'CA7', 'D', 'CAC', 'Bm', 'G'] },
    meydan8: { cb: 1, ak: ['CDm', 'CBb', 'CGm', 'CA7'] },
    cadiFinal: { cb: 1, ak: ['CDm', 'CA7', 'CDm', 'CDmM', 'CDm7', 'CDm6', 'CGmB', 'CA7', 'CDm', 'CA7', 'CBb', 'CF', 'CGm', 'CA7', 'D', 'G', 'CA7', 'D', 'D', 'G', 'CDm'] },
    baslik: { cb: 1, ak: BSL_AK },
    ninni: { cb: 1, ak: null },   // akorlar çalınan parçanın ölçülerinden gelir (PARCA.ana / PARCA.piril)
  };

  // ───────────────────────── bestelenmiş temalar ─────────────────────────
  // Yazım: "A5:2 F#6:3 E6:1 | ..." – nota:uzunluk (adım), r = sus, | = ölçü. 4/4 ölçüde 8 sekizlik (0.3 sn),
  // 3/4 ölçüde 6 adım (0.4 sn); ikisi de 2.4 sn. Bütün tema iki motiften doğar:
  //   Feza motifi: üç–iki–bir, sallanan (F#–E–D)     Pırıl motifi: beşliden altılı sıçrama ve iniş (A–F#'–E'–D')
  const notaNo = s => { const m = /^([A-G])(#|b)?(\d)$/.exec(s); return 12 * (+m[3] + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0); };
  function yaz(metin) {   // → ölçüler: [[adım, nota, uzunluk], ...]
    return metin.split('|').map(o => { let a = 0; const r = []; for (const p of o.trim().split(/\s+/)) { const [n, u] = p.split(':'); if (n !== 'r') r.push([a, notaNo(n), +u]); a += +u; } return r; });
  }
  function parca(akorlar, metin) { const m = yaz(metin); return akorlar.split(' ').map((ak, i) => ({ ak, m: m[i] || [] })); }
  const PARCA = {
    // "Feza ve Pırıl" ana teması (3/4, müzik kutusu): Feza'nın sallanan motifi, Pırıl'ın sıçrayan cevabı
    ana: parca('D GD D A Bm G A D D GD D A Bm Em A D',
      'F#5:3 E5:1 D5:2 | G5:2 B5:2 A5:2 | F#5:3 E5:1 D5:2 | C#5:2 E5:4 | A5:2 F#6:3 E6:1 | B5:3 A5:1 G5:2 | A5:2 B5:2 C#6:2 | D6:6 |' +
      'F#5:3 E5:1 D5:2 | G5:2 B5:2 E6:2 | D6:2 A5:2 F#5:2 | E5:4 C#5:2 | A5:2 F#6:3 E6:1 | D6:3 B5:1 G5:2 | A5:2 C#6:2 E6:2 | D6:6'),
    // Pırıl'ın teması (3/4, çelesta): şefkatli, umutlu – altılı sıçrama, inen ezgi, ikinci yarıda yükselen doruk
    piril: parca('D Bm G A D Bm G A D',
      'A5:2 F#6:3 E6:1 | D6:3 C#6:1 B5:2 | G5:2 E6:3 D6:1 | E6:2 D6:1 C#6:3 | A5:2 F#6:3 E6:1 | D6:3 C#6:1 B5:2 | B5:2 D6:2 G6:2 | F#6:2 E6:1 C#6:3 | D6:6'),
  };
  // Pırıl motifinin baş kısmı (alıntılar: ışık nefesi, kurtarma, göz kırpma)
  const PIRIL_BAS = [[0, 81, 2], [2, 90, 3], [5, 88, 1], [6, 86, 3]];
  // Başlık teması: bölümler ve köprü/giriş/son ezgileri (ana ve Pırıl temaları PARCA'dan gelir)
  const BSL_PLAN = []; for (const [ad, n] of [['giris', 4], ['A1', 8], ['B', 9], ['kopru', 4], ['A2', 8], ['son', 4]]) for (let k = 0; k < n; k++) BSL_PLAN.push([ad, k, n]);
  const BSL_MEL = {   // giriş: Pırıl'ın sıçrayışı (çelesta) + inen pes ezgisi · köprü: cam çan · son: Feza'nın üç–iki–biri sönerek
    giris: yaz('r:6 | r:6 | A5:2 F#6:3 E6:1 | D6:3 C#6:1 B5:2'),
    kopru: yaz('A5:2 F#6:4 | E6:3 D6:1 B5:2 | F#6:3 E6:1 C#6:2 | B5:2 D6:2 E6:2'),
    son: yaz('F#6:3 E6:1 D6:2 | D6:2 B5:2 G5:2 | C#6:3 B5:1 A5:2 | D6:6'),
  };
  const BSL_MIX = {   // katman düzeyleri (karisimGuncelle bunları KARISIM.baslik ile çarpar; ölçü ölçü yumuşakça geçer)
    giris: { pad: 0.8, zil: 0.8, tus: 0.5, arp: 0.6, tel: 0, koro: 0, bas: 0.5 },
    A1: { pad: 0.85, zil: 1, tus: 0.5, arp: 0.7, tel: 0, koro: 0.15, bas: 0.7 },
    B: { pad: 1, zil: 0.75, tus: 1, arp: 1, tel: 0.6, koro: 0.7, bas: 0.8 },
    kopru: { pad: 0.9, zil: 0.65, tus: 0.4, arp: 0.5, tel: 0.3, koro: 1, bas: 0.55 },
    A2: { pad: 1, zil: 1, tus: 0.8, arp: 1, tel: 1, koro: 0.9, bas: 1 },
    son: { pad: 0.7, zil: 0.8, tus: 0.3, arp: 0.4, tel: 0.2, koro: 0.3, bas: 0.5 },
  };
  // Bölge temaları (4/4): A ve B; döngüler A → B → A (çelesta) → B (seyrek, nefes alan) diye değişir
  const TEMA = {
    patika: {   // D9 ×4 · Bm9 ×4 · G7 ×4 · Asus ×4 – ana temanın yürüyen hâli
      A: yaz('F#6:3 E6:1 D6:4 | r:2 A5:2 B5:2 C#6:2 | D6:3 E6:1 F#6:2 A6:2 | E6:6 r:2 | A5:2 F#6:3 E6:1 D6:2 | C#6:4 B5:4 | r:2 F#5:2 B5:2 D6:2 | C#6:6 r:2 |' +
        'B5:3 A5:1 G5:4 | r:2 D6:2 E6:2 F#6:2 | G6:3 F#6:1 E6:2 D6:2 | B5:6 r:2 | A5:2 E6:3 D6:1 B5:2 | A5:4 r:4 | B5:2 D6:2 E6:2 F#6:2 | E6:6 r:2'),
      B: yaz('A5:2 F#6:3 E6:1 D6:2 | E6:2 F#6:2 A5:4 | B5:2 C#6:2 D6:2 E6:2 | F#6:6 r:2 | F#6:3 E6:1 D6:4 | r:2 B5:2 C#6:2 D6:2 | E6:3 D6:1 C#6:2 B5:2 | B5:6 r:2 |' +
        'D6:2 B6:3 A6:1 G6:2 | F#6:4 D6:4 | E6:3 D6:1 B5:2 G5:2 | A5:6 r:2 | E6:3 D6:1 B5:2 A5:2 | B5:4 r:4 | A5:2 B5:2 D6:2 E6:2 | D6:6 r:2'),
    },
    pofuduk: {  // D9 D9 G7 G7 Em9 Em9 A6 A6 – zıplayan, kesik
      A: yaz('D6:1 r:1 F#6:1 r:1 A6:2 F#6:2 | E6:1 F#6:1 E6:1 D6:1 B5:2 A5:2 | B5:1 r:1 D6:1 r:1 G6:2 F#6:2 | E6:1 F#6:1 E6:1 D6:1 B5:4 |' +
        'G5:1 r:1 B5:1 r:1 E6:2 D6:2 | B5:1 D6:1 B5:1 G5:1 F#5:4 | A5:1 r:1 C#6:1 r:1 E6:2 F#6:2 | E6:2 C#6:2 B5:2 r:2'),
      B: yaz('A5:2 F#6:2 E6:1 D6:1 E6:2 | F#6:4 r:2 A5:2 | B5:2 G6:2 F#6:1 E6:1 D6:2 | E6:4 r:2 D6:1 E6:1 |' +
        'F#6:2 E6:2 D6:2 B5:2 | G5:2 B5:2 E6:4 | C#6:2 E6:2 A6:2 F#6:2 | E6:1 F#6:1 E6:1 C#6:1 B5:2 r:2'),
    },
    gol: {      // G9s ×4 · D9 ×4 · F#m7 ×4 · Bm11 ×4 – geniş, boşluklu, yansıyan
      A: yaz('A5:4 F#6:4 | r:2 D6:4 C#6:2 | B5:8 | r:8 | F#6:4 E6:2 D6:2 | A5:6 r:2 | r:4 B5:2 C#6:2 | D6:8 |' +
        'C#6:4 A6:4 | r:2 F#6:4 E6:2 | C#6:8 | r:8 | B5:4 F#6:4 | E6:4 D6:4 | r:2 A5:2 B5:2 D6:2 | F#6:8'),
      B: yaz('D6:2 B5:2 A5:4 | G5:2 A5:2 B5:4 | r:2 C#6:2 D6:4 | r:8 | A5:2 F#6:3 E6:1 D6:2 | C#6:4 r:4 | B5:2 C#6:2 D6:2 E6:2 | F#6:8 |' +
        'E6:2 C#6:2 A5:4 | B5:4 C#6:4 | r:2 F#6:4 E6:2 | C#6:8 | D6:4 B5:4 | A5:2 B5:2 D6:4 | E6:2 F#6:2 A6:4 | F#6:8'),
    },
    dallar: {   // Bm9 Bm9 G7 G7 D9 D9 A A – tırmanan, canlı
      A: yaz('B5:1 C#6:1 D6:2 F#6:2 D6:2 | E6:1 D6:1 C#6:2 B5:4 | B5:1 D6:1 E6:2 G6:2 E6:2 | F#6:1 E6:1 D6:2 B5:4 |' +
        'A5:2 F#6:3 E6:1 D6:2 | C#6:2 D6:2 E6:2 F#6:2 | A6:3 F#6:1 E6:2 C#6:2 | B5:2 C#6:2 E6:4'),
      B: yaz('F#6:3 E6:1 D6:2 B5:2 | C#6:2 D6:2 E6:4 | D6:3 B5:1 G5:2 B5:2 | D6:2 E6:2 F#6:4 |' +
        'A6:3 F#6:1 E6:2 D6:2 | E6:2 F#6:2 A6:4 | B6:2 A6:2 F#6:2 E6:2 | C#6:6 r:2'),
    },
    sakli: {    // Em9 ×4 · C ×4 · Bm11 ×4 · F#sus ×4 – gizemli, alçak, yavaş
      A: yaz('B5:4 G5:4 | F#5:2 G5:2 B5:4 | E6:6 r:2 | r:8 | D6:4 B5:4 | G5:2 F#5:2 E5:4 | r:2 B5:2 D6:4 | E6:8 |' +
        'D6:4 F#5:4 | A5:2 B5:2 D6:4 | E6:6 r:2 | r:8 | F#5:4 B5:4 | C#6:4 E6:4 | F#6:6 r:2 | r:8'),
      B: yaz('B5:2 G6:3 F#6:1 E6:2 | D6:4 B5:4 | r:2 G5:2 B5:2 D6:2 | E6:8 | E6:2 B5:2 G5:4 | F#5:4 G5:4 | B5:8 | r:8 |' +
        'F#5:2 D6:3 B5:1 A5:2 | B5:8 | r:2 D6:2 E6:2 F#6:2 | E6:8 | C#6:4 B5:4 | F#5:8 | r:4 E6:4 | r:8'),
    },
    aciklik: {  // G7 ×4 · D9 ×4 · Em9 ×4 · Asus ×4 – bekleyiş, ağacın önü
      A: yaz('B5:3 A5:1 G5:4 | r:2 D6:2 B5:4 | A5:4 B5:2 D6:2 | E6:8 | F#6:3 E6:1 D6:4 | r:2 A5:2 B5:2 C#6:2 | D6:6 r:2 | r:8 |' +
        'G5:2 B5:2 E6:4 | D6:3 B5:1 G5:4 | F#5:4 G5:4 | B5:8 | A5:2 E6:3 D6:1 B5:2 | A5:8 | r:2 B5:2 D6:2 E6:2 | E6:6 r:2'),
      B: yaz('D6:2 B6:3 A6:1 G6:2 | F#6:4 D6:4 | E6:2 D6:2 B5:4 | r:8 | A5:2 F#6:3 E6:1 D6:2 | C#6:4 B5:2 A5:2 | B5:4 C#6:4 | D6:6 r:2 |' +
        'B5:2 G6:3 F#6:1 E6:2 | D6:4 B5:4 | G5:2 B5:2 D6:2 E6:2 | F#6:8 | E6:3 D6:1 B5:2 A5:2 | B5:8 | A5:2 B5:2 D6:2 E6:2 | E6:8'),
    },
    senlik: {   // D G Em9 A6 D Bm9 G9s Asus – Büyük Pofuduk uyandı: akılda kalan, oynak bir polka (tuba ım-pa)
      A: yaz('F#6:1 E6:1 D6:1 r:1 A5:1 r:1 D6:2 | B5:1 A5:1 G5:1 r:1 D6:1 r:1 B5:2 | E6:1 F#6:1 G6:1 r:1 E6:1 r:1 B5:2 | C#6:1 B5:1 A5:1 r:1 E6:2 r:2 |' +
        'F#6:1 E6:1 D6:1 r:1 A5:1 r:1 D6:2 | D6:1 C#6:1 B5:1 r:1 F#6:1 r:1 D6:2 | B5:1 C#6:1 D6:1 F#6:1 A6:2 G6:2 | A6:1 r:1 E6:1 r:1 A5:2 r:2'),
      B: yaz('A5:1 r:1 F#6:2 E6:1 D6:1 E6:2 | D6:1 r:1 B5:2 D6:2 G6:2 | F#6:1 E6:1 D6:1 B5:1 E6:2 B5:2 | C#6:2 E6:2 A6:2 r:2 |' +
        'A5:1 r:1 F#6:2 E6:1 D6:1 E6:2 | F#6:1 r:1 D6:2 F#6:2 B6:2 | A6:1 G6:1 F#6:1 D6:1 B5:2 C#6:2 | B5:1 D6:1 E6:2 D6:2 r:2'),
    },
    // Bölüm 2 "Yıldız Teması" (A Lidyen, 16 ölçü = 8 akor × 2): Feza'nın yükselen beşlisi (E–B), Lidyen D# ışıltısı.
    // A: yavaş, geniş; B: akıp inen cevap; C: yalnız seyrek yüksek yıldız kıvılcımları (nefes)
    yildiz: {
      A: yaz('E5:2 B5:3 A5:3 | C#6:5 r:3 | D#6:3 C#6:1 B5:4 | F#5:2 A5:2 B5:4 |' +
        'A5:3 C#6:1 E6:4 | C#6:2 B5:2 A5:4 | B5:2 E6:3 F#6:3 | E6:4 B5:2 r:2 |' +
        'A5:2 E6:3 C#6:3 | B5:4 A5:4 | D#6:3 E6:1 F#6:4 | C#6:2 E6:2 A6:4 |' +
        'G#5:2 B5:3 C#6:3 | E6:4 C#6:2 B5:2 | B5:3 D#6:1 F#6:4 | D#6:3 B5:5'),
      B: yaz('A6:2 E6:2 C#6:2 B5:2 | A5:3 B5:1 C#6:4 | D#6:2 F#6:3 D#6:1 B5:2 | A5:2 B5:2 D#6:4 |' +
        'C#6:2 E6:2 G#6:3 E6:1 | F#6:4 C#6:2 A5:2 | B5:2 E6:2 F#6:2 E6:2 | B5:4 G#5:2 r:2 |' +
        'E6:3 C#6:1 A5:4 | r:2 C#6:2 E6:2 A6:2 | D#6:3 C#6:1 B5:2 A5:2 | E6:6 r:2 |' +
        'B5:2 G#5:2 E5:2 G#5:2 | B5:4 C#6:4 | F#6:3 D#6:1 B5:2 F#5:2 | G#5:2 B5:2 D#6:4'),
      C: yaz('r:2 A5:1 C#6:1 E6:4 | r:8 | r:2 D#6:1 F#6:1 B5:4 | r:8 | r:2 C#6:1 E6:1 G#6:4 | r:8 | r:2 B5:1 F#6:1 E6:4 | r:8 |' +
        'r:2 E6:1 A6:1 C#6:4 | r:8 | r:2 F#6:1 E6:1 D#6:4 | r:8 | r:2 G#5:1 B5:1 E6:4 | r:8 | r:2 D#6:1 B5:1 F#5:4 | r:8'),
    },
    // Bölüm 3 "Bulut Teması" (G Lidyen, 16 ölçü = 8 akor × 2): Pırıl'ın altılı sıçrayışı (D–B–A–G) açar, Feza'nın üç–iki–biri
    // (B–A–G) cevaplar; A/G'de Lidyen C# ışığı. A: harp/flüt · B: yüksek, geniş flüt cevabı · C: seyrek (nefes)
    bulut: {
      A: yaz('D5:2 B5:3 A5:1 G5:2 | A5:2 B5:2 D6:4 | C#6:3 B5:1 A5:2 E5:2 | A5:6 r:2 |' +
        'B5:3 A5:1 G5:2 E5:2 | F#5:2 G5:2 B5:4 | A5:3 F#5:1 D5:4 | E5:2 F#5:2 A5:4 |' +
        'D5:2 B5:3 A5:1 G5:2 | A5:2 D6:2 G6:4 | E6:3 C#6:1 B5:2 A5:2 | B5:2 C#6:2 E6:4 |' +
        'F#6:3 E6:1 D6:2 B5:2 | A5:2 B5:2 D6:4 | E6:3 D6:1 B5:2 A5:2 | A5:6 r:2'),
      B: yaz('G6:4 F#6:2 D6:2 | E6:3 D6:1 B5:4 | C#6:2 E6:2 A6:4 | A6:3 E6:1 C#6:4 |' +
        'B5:2 E6:3 D6:1 B5:2 | G5:2 A5:2 B5:4 | A5:2 D6:3 E6:1 F#6:2 | E6:6 r:2 |' +
        'D6:2 G6:3 F#6:1 D6:2 | E6:2 D6:2 B5:4 | C#6:3 E6:1 A6:4 | F#6:2 E6:2 C#6:4 |' +
        'D6:3 C#6:1 B5:2 F#5:2 | A5:2 B5:2 D6:4 | E6:2 D6:2 B5:2 A5:2 | A5:6 r:2'),
      C: yaz('r:2 D6:1 G6:1 B5:4 | r:8 | r:2 E6:1 A6:1 C#6:4 | r:8 | r:2 B5:1 E6:1 G6:4 | r:8 | r:2 A5:1 D6:1 F#6:4 | r:8 |' +
        'r:2 B5:1 D6:1 A6:4 | r:8 | r:2 C#6:1 E6:1 B5:4 | r:8 | r:2 F#6:1 D6:1 B5:4 | r:8 | r:2 E6:1 B5:1 A5:4 | r:8'),
    },
    // uçuş (8 ölçü, akor her ölçüde): A koşan sekizlikler, yukarı açılan; B süzülen, uzun notalı (ikinci tur)
    ucus: {
      A: yaz('D5:1 G5:1 B5:1 D6:1 B5:2 A5:1 G5:1 | E5:1 A5:1 C#6:1 E6:1 D6:2 C#6:2 | B5:1 E6:1 G6:1 F#6:1 E6:2 D6:1 B5:1 | A5:2 F#6:3 E6:1 D6:2 |' +
        'G5:1 B5:1 D6:1 G6:1 F#6:2 D6:2 | A5:1 C#6:1 E6:1 A6:3 E6:2 | F#6:2 E6:1 D6:1 E6:2 F#6:2 | E6:3 F#6:1 A6:4'),
      B: yaz('G6:3 F#6:1 D6:2 B5:2 | C#6:3 E6:1 A6:4 | G6:2 F#6:2 E6:2 B5:2 | A5:2 F#6:3 E6:1 D6:2 |' +
        'D6:2 G6:3 A6:1 B6:2 | A6:3 E6:1 C#6:2 E6:2 | F#6:3 E6:1 D6:2 A5:2 | E6:2 F#6:2 A6:4'),
    },
  };
  // final: 0–7 şenliğin B kısmı (dans), 8–15 Pırıl'ın teması (4/4, geniş), 16 çözülme
  const FINAL_MEL = TEMA.senlik.B.concat(yaz(
    'A5:2 F#6:5 E6:1 | D6:5 C#6:1 B5:2 | G5:2 E6:5 D6:1 | E6:3 D6:1 C#6:4 | A5:2 F#6:5 E6:1 | D6:5 C#6:1 B5:2 | B5:2 D6:2 G6:4 | F#6:3 E6:1 C#6:4 | D6:8 | r:8'));
  // diyatonik kaydırma: bir motifi o anki akora en iyi oturan basamağa taşır (alıntılar hep uyumlu)
  const SKALA = []; for (let m = 36; m <= 110; m++) if ([1, 2, 4, 6, 7, 9, 11].includes(m % 12)) SKALA.push(m);
  function diyatonik(n, s) { let i = SKALA.indexOf(n); if (i < 0) { i = 0; while (i < SKALA.length - 1 && SKALA[i] < n) i++; } return SKALA[cl(i + s, 0, SKALA.length - 1)]; }
  function uyarla(notalar, ak) {
    let enIyi = 0, enP = -1;
    for (const s of [0, -2, 2, -1, 1, 3, -3]) {
      let p = 0; for (const [, n, u] of notalar) if (ak.mel.includes(diyatonik(n, s) % 12)) p += u >= 2 ? 2 : 1;
      if (p > enP) { enP = p; enIyi = s; }
    }
    return notalar.map(([a, n, u]) => [a, diyatonik(n, enIyi), u]);
  }
  // katman karışımları (bölge/mod) – ışıkla ayrıca ölçeklenir
  const KARISIM = {
    patika: { zil: 1, pad: 1, tus: 0.55, arp: 0.5, tel: 0.45, koro: 0.15, bas: 0.7, tuba: 0, hop: 1, rev: 0.75, dly: 0.5, flut: 0.7, soprano: 0.55 },
    pofuduk: { zil: 1, pad: 0.8, tus: 0.9, arp: 0.65, tel: 0.35, koro: 0.1, bas: 1, tuba: 0.4, hop: 1, rev: 0.6, dly: 0.35, flut: 0.5, soprano: 0.5 },
    gol: { zil: 0.9, pad: 1.1, tus: 0.65, arp: 0.9, tel: 0.7, koro: 0.9, bas: 0.45, tuba: 0, hop: 0.45, rev: 1.3, dly: 0.8, flut: 0.45, soprano: 0.75 },
    dallar: { zil: 1, pad: 0.9, tus: 0.7, arp: 1, tel: 1, koro: 0.45, bas: 1, tuba: 0, hop: 0.9, rev: 0.8, dly: 0.45, flut: 0.85, soprano: 1.2 },
    sakli: { zil: 0.85, pad: 1, tus: 0.85, arp: 0.55, tel: 0.6, koro: 1, bas: 0.55, tuba: 0, hop: 0.5, rev: 1.15, dly: 0.9, flut: 0.75, soprano: 0.65 },
    aciklik: { zil: 0.9, pad: 1, tus: 0.6, arp: 0.6, tel: 0.7, koro: 0.5, bas: 0.6, tuba: 1, hop: 0.6, rev: 0.9, dly: 0.5, flut: 0.65, soprano: 0.8 },
    senlik: { zil: 1.1, pad: 0.85, tus: 1, arp: 0.9, tel: 0.85, koro: 0.55, bas: 1, tuba: 0.8, hop: 1.1, rev: 0.7, dly: 0.45, flut: 0.9, soprano: 1.0 },
    // Bölüm 2: katmanlar yıldız oranına (SAYAC.yildiz / yildizTop) göre ayrıca ölçeklenir (yildizEtkisi)
    yildiz: { zil: 1, pad: 1, tus: 0.7, arp: 0.9, tel: 0.9, koro: 1, bas: 0.7, tuba: 0, hop: 0.6, rev: 1.9, dly: 1.15, su: 1, flut: 0.35, soprano: 1.2 },
    // Bölüm 3: katmanlar kuzucuk oranına (SAYAC.kuzu / kuzuTop) göre ayrıca ölçeklenir (bulutEtkisi); flüt = yumuşak üflemeli (okarina gibi)
    bulut: { zil: 0.9, pad: 1, tus: 0.75, arp: 1, tel: 0.85, koro: 0.7, bas: 0.7, tuba: 0, hop: 0.6, rev: 1.35, dly: 0.85, flut: 1, soprano: 1.15 },
    deniz: { zil: 0.9, pad: 1, tus: 0.82, arp: 1, tel: 0.92, koro: 0.6, bas: 0.68, tuba: 0, hop: 0, rev: 1.5, dly: 0.75, flut: 0.85, soprano: 0.88 },
    volkan: { zil: 0.76, pad: 0.85, tus: 0.94, arp: 0.82, tel: 0.8, koro: 0.38, bas: 0.64, tuba: 0, hop: 0, rev: 1.15, dly: 0.58, flut: 0.9, soprano: 0.75 },
    volkanKristal: { zil: 0.55, pad: 0.78, tus: 0.58, arp: 0.52, tel: 0.55, koro: 0.5, bas: 0.5, tuba: 0, hop: 0, rev: 1.3, dly: 0.65, flut: 0.58, soprano: 0.6 },
    volkanKalp: { zil: 0.85, pad: 0.95, tus: 0.86, arp: 0.9, tel: 0.95, koro: 0.65, bas: 0.62, tuba: 0, hop: 0, rev: 1.3, dly: 0.7, flut: 0.88, soprano: 0.85 },
    lavsal: { zil: 0.76, pad: 0.92, tus: 0.85, arp: 1.05, tel: 1.05, koro: 0.65, bas: 0.8, tuba: 0, hop: 0, rev: 1.15, dly: 0.6, flut: 1.0, soprano: 0.9 },
    volkanFinal: { zil: 0.9, pad: 1, tus: 0.9, arp: 1.05, tel: 1.1, koro: 0.95, bas: 0.8, tuba: 0, hop: 0, rev: 1.4, dly: 0.7, flut: 1, soprano: 1 },
    // Bölüm 6: fener oranına göre ayrıca ölçeklenir (kaleEtkisi); hop otobüsü = yumuşak tef
    kale: { zil: 0.95, pad: 0.9, tus: 0.9, arp: 0.9, tel: 0.8, koro: 0.45, bas: 0.7, tuba: 0, hop: 0.9, rev: 1.2, dly: 0.6, flut: 0.95, soprano: 0.8 },
    halkaMini: { zil: 0.95, pad: 0.9, tus: 0.9, arp: 1.05, tel: 0.95, koro: 0.5, bas: 0.85, tuba: 0, hop: 1, rev: 1.05, dly: 0.55, flut: 1.05, soprano: 0.9 },
    halkaKosu: { zil: 1, pad: 0.9, tus: 0.95, arp: 1.1, tel: 1.05, koro: 0.6, bas: 0.9, tuba: 0, hop: 1.05, rev: 1, dly: 0.5, flut: 1.05, soprano: 1 },
    senlikFinal: { zil: 1, pad: 1, tus: 0.95, arp: 1.05, tel: 1.1, koro: 0.9, bas: 0.85, tuba: 0, hop: 1, rev: 1.3, dly: 0.65, flut: 1, soprano: 1 },
    // Bölüm 7: fener oranına göre ayrıca ölçeklenir (kuzeyEtkisi); hop otobüsü = kardan "bup"ları ve kızak çıngırakları
    kar: { zil: 1, pad: 1, tus: 0.85, arp: 0.9, tel: 0.85, koro: 0.8, bas: 0.7, tuba: 0, hop: 0.9, rev: 1.6, dly: 0.85, flut: 0.6, soprano: 1.05 },
    kardanMini: { zil: 0.95, pad: 0.85, tus: 0.95, arp: 0.9, tel: 0.7, koro: 0.45, bas: 0.85, tuba: 0, hop: 1, rev: 1.2, dly: 0.6, flut: 0.6, soprano: 0.9 },
    kizakMini: { zil: 1, pad: 0.85, tus: 1, arp: 1.05, tel: 0.9, koro: 0.5, bas: 0.9, tuba: 0, hop: 1, rev: 1.05, dly: 0.5, flut: 0.6, soprano: 1 },
    kuzeyFinal: { zil: 1, pad: 1.05, tus: 0.95, arp: 1.05, tel: 1.15, koro: 1.05, bas: 0.85, tuba: 0, hop: 0.8, rev: 1.6, dly: 0.75, flut: 0.6, soprano: 1.05 },
    // Bölüm 8: fener oranına göre ayrıca ölçeklenir (cadiEtkisi). Yeni otobüsler: ksil (kemik ksilofon) · klav (klavsen) · sik (parmak şıklatma,
    // kemik tıkırtısı) · hay (hayalet düdüğü "uuu", ayrı yankılı) · org (oyuncak org); hop otobüsü = tef + kabak "bup"ları + kazan köpüğü
    cadi: { zil: 1, pad: 0.6, tus: 0.85, arp: 0.75, tel: 0.6, koro: 0.55, bas: 0.95, tuba: 1.4, hop: 0.85, rev: 1.15, dly: 0.5, flut: 0.7, soprano: 0.9, ksil: 1, klav: 1, sik: 1, hay: 1, org: 1 },
    koru8: { zil: 0.95, pad: 0.65, tus: 0.9, arp: 0.9, tel: 0.6, koro: 0.65, bas: 0.9, tuba: 1.4, hop: 0.75, rev: 1.3, dly: 0.6, flut: 0.75, soprano: 0.9, ksil: 0.95, klav: 0.9, sik: 0.85, hay: 1.1, org: 1 },
    kabakYuzMini: { zil: 0.95, pad: 0.6, tus: 0.95, arp: 0.8, tel: 0.55, koro: 0.35, bas: 0.95, tuba: 1.4, hop: 1, rev: 1, dly: 0.45, flut: 0.6, soprano: 0.85, ksil: 1, klav: 1, sik: 0.95, hay: 0.9, org: 0.9 },
    iskeletMini: { zil: 0.9, pad: 0.32, tus: 0.85, arp: 0.6, tel: 0.35, koro: 0.25, bas: 0.9, tuba: 1.4, hop: 1, rev: 0.9, dly: 0.35, flut: 0.5, soprano: 0.7, ksil: 1, klav: 1, sik: 1, hay: 0.9, org: 0.9 },
    sokak: { zil: 1, pad: 0.6, tus: 0.95, arp: 0.8, tel: 0.65, koro: 0.45, bas: 0.95, tuba: 1.4, hop: 1, rev: 1.05, dly: 0.45, flut: 0.65, soprano: 0.9, ksil: 1, klav: 1, sik: 1, hay: 1, org: 1 },
    kazanMini: { zil: 1, pad: 0.65, tus: 0.95, arp: 0.85, tel: 0.7, koro: 0.5, bas: 0.95, tuba: 1.4, hop: 1, rev: 1.2, dly: 0.55, flut: 0.7, soprano: 0.9, ksil: 1, klav: 1, sik: 0.9, hay: 1, org: 1 },
    supurgeMini: { zil: 0.95, pad: 0.85, tus: 0.95, arp: 1.05, tel: 1.05, koro: 0.7, bas: 0.95, tuba: 1.4, hop: 1, rev: 1.1, dly: 0.55, flut: 1.05, soprano: 1.05, ksil: 0.95, klav: 0.9, sik: 0.9, hay: 1, org: 0.9 },
    meydan8: { zil: 1, pad: 0.65, tus: 0.9, arp: 0.85, tel: 0.75, koro: 0.5, bas: 0.95, tuba: 1.4, hop: 1, rev: 1.15, dly: 0.5, flut: 0.7, soprano: 0.9, ksil: 1, klav: 1, sik: 1, hay: 1, org: 1 },
    cadiFinal: { zil: 1, pad: 0.85, tus: 0.95, arp: 1, tel: 1.05, koro: 0.9, bas: 0.95, tuba: 1.4, hop: 1, rev: 1.2, dly: 0.55, flut: 0.8, soprano: 1, ksil: 1, klav: 0.95, sik: 1, hay: 1, org: 1 },
    ucus: { zil: 0.9, pad: 1.05, tus: 0.85, arp: 1.1, tel: 1.1, koro: 0.6, bas: 0.9, tuba: 0, hop: 0.6, rev: 1.05, dly: 0.6, flut: 1.05, soprano: 1.25 },
    final: { zil: 1.1, pad: 1.15, tus: 0.9, arp: 1.1, tel: 1.35, koro: 1.25, bas: 1.1, tuba: 0.8, hop: 0.75, rev: 1.1, dly: 0.55, flut: 0.8, soprano: 1.25 },
    baslik: { zil: 1, pad: 0.6, tus: 0.9, arp: 1, tel: 0.5, koro: 0.7, bas: 0.55, tuba: 0, hop: 0, rev: 1.05, dly: 0.65, soprano: 0.65 },   // BSL_MIX ile ölçeklenir
    ninni: { zil: 1.1, pad: 0.55, tus: 0.25, arp: 0.35, tel: 0.3, koro: 0, bas: 0.35, tuba: 0, hop: 0, rev: 0.75, dly: 0.45, soprano: 0.4 },
    // rüya: giriş sahnesinde Pırıl uyanıp oda eridikçe ninninin üstüne koro, yaylı ve arp açılır
    ruya: { zil: 1, pad: 1.2, tus: 0.45, arp: 1, tel: 0.95, koro: 0.7, bas: 0.5, tuba: 0, hop: 0, rev: 1.3, dly: 0.75, soprano: 0.85 },
  };
  // katmanların temel düzeyleri (otobüs kazancı = temel × karışım × ışık etkisi)
  const TEMEL = { zil: 1, pad: 0.75, tus: 1.2, arp: 1, tel: 0.026, koro: 0.09, bas: 0.9, tuba: 1, hop: 1, su: 1, flut: 1, soprano: 1, ksil: 1, klav: 1, sik: 1, hay: 1, org: 1 };   // son beşi yalnız Bölüm 8
  function isikEtkisi(k, l, m) {
    if (m !== 'orman') return 1;
    switch (k) {
      case 'zil': return 0.85 + 0.15 * l;
      case 'tus': return 0.35 + 0.65 * l;
      case 'arp': return cl(0.15 + 1.1 * l, 0, 1);
      case 'tel': return 0.25 + 0.75 * l;
      case 'koro': return 0.25 + 0.75 * l * l;
      case 'bas': return 0.55 + 0.45 * l;
      case 'flut': return cl(0.25 + 0.75 * l, 0, 1);
      case 'soprano': return cl(0.35 + 0.65 * l + 0.45 * (typeof yukseklikS !== 'undefined' ? yukseklikS : 0), 0, 1.4);
      default: return 1;
    }
  }

  // ───────────────────────── ses sınırlama + yardımcı düğümler ─────────────────────────
  const SINIR = 80;             // aynı anda en çok geçici osilatör (eşlik notaları; ezgi ve sahne geçişleri öncelikli)
  // bitiş zamanları sabit boyutlu bir halkada (dizi kopyalama / çöp yok); dolarsa en eski kayıt üstüne yazılır
  const YUK_N = 256, yuk = new Float64Array(YUK_N), yukB = new Float64Array(YUK_N);   // bitiş / başlangıç
  let yukI = 0, yukTepe = 0, yukDus = 0;
  // n osilatör yer var mı? (zorunlu: yine de çal). kayit: t1'de biten kaç tanesi kaydedilsin (kalanı ek() ile,
  // kendi – daha erken – bitişleriyle). Final doruğunda ezgi notaları 'oncelikli' (sınır 96, atılmaz).
  let oncelikli = false;
  function yerVar(n, t0, t1, zorunlu, kayit) {
    let c = 0; for (let i = 0; i < YUK_N; i++) if (yuk[i] > t0 && yukB[i] <= t0 + 0.05) c++;   // t0 anında çalan
    if (!zorunlu && !oncelikli && c + n > (mod === 'final' || (progAd === 'yildiz' && yDoruk > 0.5) || progAd === 'ucus' || gDoruk > 0.5 || progAd === 'senlikFinal' || progAd === 'halkaKosu' || progAd === 'kuzeyFinal' || progAd === 'kizakMini' || C8_YOGUN[progAd] ? 96 : SINIR)) { yukDus++; return false; }
    const k = kayit == null ? n : kayit;
    for (let i = 0; i < k; i++) { yuk[yukI] = t1; yukB[yukI] = t0; yukI = (yukI + 1) & (YUK_N - 1); }
    yukT0 = t0;
    if (c + n > yukTepe) yukTepe = c + n;
    return true;
  }
  let yukT0 = 0;
  function ek(t1) { yuk[yukI] = t1; yukB[yukI] = yukT0; yukI = (yukI + 1) & (YUK_N - 1); }
  const panlar = new WeakMap();
  function panla(hedef, p) {     // otobüs başına 9 sabit pan konumu (nota başına panner yok)
    if (!ac.createStereoPanner || !p) return hedef;
    const q = Math.round(cl(p, -1, 1) * 4);
    if (!q) return hedef;
    let m = panlar.get(hedef); if (!m) { m = {}; panlar.set(hedef, m); }
    if (!m[q]) { const pn = ac.createStereoPanner(); pn.pan.value = q / 4; pn.connect(hedef); m[q] = pn; }
    return m[q];
  }
  function osc(tip, f, t0, t1, hedef, det) {
    const o = ac.createOscillator(); o.type = tip; o.frequency.value = f; if (det) o.detune.value = det;
    o.connect(hedef); o.start(t0); o.stop(t1); return o;
  }
  function kazanc(v, hedef) { const g = ac.createGain(); g.gain.value = v; if (hedef) g.connect(hedef); return g; }
  function zarf(t0, atk, tepe, dec, hedef) {   // hızlı vuruş + üstel sönüm (sonunda ~-80 dB, çıt yok)
    const g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(tepe, t0 + atk);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + atk + dec);
    if (hedef) g.connect(hedef); return g;
  }
  function suzgec(tip, f, Q, hedef) { const b = ac.createBiquadFilter(); b.type = tip; b.frequency.value = f; b.Q.value = Q; if (hedef) b.connect(hedef); return b; }
  function hedefle(param, v, t, tau) { param.setTargetAtTime(v, t, tau); }

  // ───────────────────────── çalgılar ─────────────────────────
  // müzik kutusu / çan: temel + çabuk sönen üst kısmi sesler
  function zil(f, t, vol, dec, pan, hedef, gecikme) {
    if (test && test.log && oncelikli) test.log.push(['z', +t.toFixed(2), Math.round(69 + 12 * Math.log2(f / 440)), progAd]);
    const h2var = f * 4.2 < 14000 && vol > 0.012;
    if (!yerVar(h2var ? 3 : 2, t, t + dec, false, 1)) return;
    ek(t + dec * 0.36); if (h2var) ek(t + dec * 0.14);
    hedef = hedef || B.zil;
    const out = zarf(t, 0.004, vol, dec, panla(hedef, pan));
    if (gecikme !== false) out.connect(dlyGiris);
    osc('sine', f, t, t + dec + 0.05, out);
    const h1 = zarf(t, 0.003, 0.2, dec * 0.32, out); osc('sine', f * 2, t, t + dec * 0.36 + 0.05, h1);
    if (h2var) { const h2 = zarf(t, 0.002, 0.07, dec * 0.12, out); osc('sine', f * 4.2, t, t + dec * 0.14 + 0.05, h2); }
  }
  // yumuşak piyano / çelesta: üçgen + oktav, kararan süzgeç
  function tus(n, t, vol, dec, pan, parlak, hedef) {
    if (test && test.log && oncelikli) test.log.push(['c', +t.toFixed(2), n, progAd]);
    if (!yerVar(2, t, t + dec, false, 1)) return;
    ek(t + dec * 0.5);
    const f = NOTE(n);
    const out = zarf(t, 0.005, vol, dec, panla(hedef || B.tus, pan));
    const lp = suzgec('lowpass', Math.min(9000, f * (parlak ? 9 : 5)), 0.5, out);
    lp.frequency.setTargetAtTime(Math.min(4000, f * 1.6), t + 0.02, dec * 0.25);
    osc('triangle', f, t, t + dec + 0.08, lp);
    osc('sine', f * (parlak ? 4 : 2), t, t + dec * 0.5, kazanc(parlak ? 0.12 : 0.28, lp));
  }
  // arp telinin çekilmesi
  function arp(n, t, vol, pan, dec, hedef) {
    const f = NOTE(n); dec = dec || cl(2.6 - (n - 50) * 0.04, 0.7, 2.4);
    if (!yerVar(2, t, t + dec, false, 1)) return;
    ek(t + dec * 0.4);
    const out = zarf(t, 0.002, vol, dec, panla(hedef || B.arp, pan));
    osc('triangle', f, t, t + dec + 0.05, out);
    osc('sine', f * 2, t, t + dec * 0.4, zarf(t, 0.002, 0.35, dec * 0.3, out));
  }
  // sıcak pad (her akorda yeni, uzun çapraz geçiş)
  // sıcak pad (her akorda yeni, uzun çapraz geçiş)
  let padSon = null;
  function padBirak(t) {   // bölge değişince eski akorun padi ortada asılı kalmasın (sıfır çıtırtı)
    if (!padSon) return;
    try {
      padSon.gain.cancelScheduledValues(t);
      padSon.gain.setValueAtTime(Math.max(0.0001, padSon.gain.value), t);
      padSon.gain.exponentialRampToValueAtTime(0.0001, t + 0.75);
    } catch (e) {}
    padSon = null;
  }
  function pad(ak, t0, dur, relZ) {   // relZ: bırakış süresi (verilmezse ölçüye göre)
    const atk = Math.min(3, dur * 0.45), rel = relZ || Math.min(3.5, Math.max(1.2, dur * 0.6));
    if (!yerVar(ak.pad.length * 2 + 2, t0, t0 + dur + rel, true)) return;
    const lp = suzgec('lowpass', 520 + (progAd === 'baslik' ? 260 : progAd === 'yildiz' ? 150 + 1700 * yoS : progAd === 'bulut' || progAd === 'ucus' ? 350 + 1100 * koS + 500 * gDoruk + (progAd === 'ucus' ? 300 : 0) : S6_PROG[progAd] ? 250 + 1300 * s6S + (progAd === 'halkaKosu' ? 600 : 0) : K7_PROG[progAd] ? 380 + 1200 * k7S + (progAd === 'kuzeyFinal' ? 700 : progAd === 'kizakMini' ? (k7Ucus ? 900 : 500) : 0) : C8_PROG[progAd] ? 420 + 1250 * c8S + (progAd === 'cadiFinal' ? 700 : progAd === 'supurgeMini' ? 600 : 0) : isik() * 1500), 0.4);
    const vg = ac.createGain();
    vg.gain.value = 0.0001; vg.gain.setValueAtTime(0.0001, t0); vg.gain.exponentialRampToValueAtTime(0.05, t0 + atk);
    vg.gain.setValueAtTime(0.05, t0 + dur); vg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + rel);
    lp.connect(vg); vg.connect(B.pad); padSon = vg;
    const son = t0 + dur + rel + 0.12;
    ak.pad.forEach((n, i) => {
      osc('sine', NOTE(n), t0, son, kazanc(0.55, lp), i % 2 ? 4 : -4);
      osc('sawtooth', NOTE(n), t0, son, kazanc(0.16, lp), i % 2 ? -7 : 7);
    });
    // alt bas (yumuşak)
    const bg = ac.createGain(); bg.gain.value = 0.0001; bg.gain.setValueAtTime(0.0001, t0); bg.gain.exponentialRampToValueAtTime(0.05, t0 + atk * 0.7);
    bg.gain.setValueAtTime(0.05, t0 + dur); bg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + rel * 0.8); bg.connect(B.pad);
    osc('sine', NOTE(ak.bas), t0, son, bg);
    osc('sine', NOTE(ak.bas + 12), t0, son, kazanc(0.25, bg));
  }
  // bas notaları: uzun / nabız / pizzicato
  function bas(n, t, vol, tip, dur) {
    const f = NOTE(n);
    if (tip === 'uzun') {
      if (!yerVar(2, t, t + dur + 1.2)) return;
      const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.35);
      g.gain.setTargetAtTime(vol * 0.6, t + 0.4, dur * 0.4); g.gain.setTargetAtTime(0.0001, t + dur, 0.25); g.connect(B.bas);
      osc('sine', f, t, t + dur + 1.4, g); osc('sine', f * 2, t, t + dur + 1.4, kazanc(0.3, g));
    } else if (tip === 'nabiz') {
      if (!yerVar(2, t, t + 0.9)) return;
      const g = zarf(t, 0.02, vol, 0.75, B.bas);
      osc('sine', f, t, t + 0.85, g); osc('sine', f * 2, t, t + 0.5, kazanc(0.35, g));
    } else {   // pizz
      if (!yerVar(2, t, t + 0.6)) return;
      const g = zarf(t, 0.004, vol, 0.45, B.bas);
      const lp = suzgec('lowpass', f * 6, 0.7, g); lp.frequency.setTargetAtTime(f * 2, t, 0.06);
      osc('triangle', f, t, t + 0.55, lp); osc('sine', f * 2, t, t + 0.3, kazanc(0.4, lp));
    }
  }
  // tuba/fagot: uykulu, komik (testere dişi + kapanan süzgeç, sonda perde düşer)
  function tuba(n, t, dur, vol, dusus, hedef) {
    if (!yerVar(2, t, t + dur + 0.3, true)) return;
    const f = NOTE(n);
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.06);
    g.gain.setTargetAtTime(vol * 0.7, t + 0.08, dur * 0.5); g.gain.setTargetAtTime(0.0001, t + dur, 0.06); g.connect(hedef || B.tuba);
    const lp = suzgec('lowpass', f * 3.2, 1.2, g);
    lp.frequency.setValueAtTime(f * 1.5, t); lp.frequency.exponentialRampToValueAtTime(f * 4.5, t + 0.07); lp.frequency.setTargetAtTime(f * 2.5, t + 0.1, dur * 0.4);
    const o1 = osc('sawtooth', f, t, t + dur + 0.4, lp), o2 = osc('square', f * 0.5, t, t + dur + 0.4, kazanc(0.25, lp));
    if (dusus) for (const o of [o1, o2]) { o.detune.setValueAtTime(0, t + dur * 0.55); o.detune.linearRampToValueAtTime(dusus, t + dur + 0.1); }
  }
  // zıplayan "bup" (Pofuduk geçidi): perdesi aşağıdan sıçrayan yumuşak sinüs + minik tahta tıkırtısı (marimba gibi)
  function hop(n, t, vol, pan, hedef) {
    if (!yerVar(2, t, t + 0.42)) return;
    const f = NOTE(n);
    const g = zarf(t, 0.006, vol, 0.34, panla(hedef || B.hop, pan));
    const o = osc('sine', f, t, t + 0.42, g);
    o.frequency.setValueAtTime(f * 0.7, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05);
    osc('triangle', f * 3, t, t + 0.08, zarf(t, 0.002, 0.1, 0.06, g));
  }
  // tatmin edici haptik çalgılar: tok ahşap ksilofon, sedef ksilofon, cam armonika ve su damlası marimba
  function ksilofon(n, t, vol, pan, tur, hedef) {
    tur = tur || 'ahsap';
    const f = typeof n === 'number' && n < 130 ? NOTE(n) : n;
    hedef = hedef || sfxG;
    if (tur === 'ahsap') {
      // 1) Tok ahşap ksilofon / gül ağacı marimba: sıcak tokmak teması + ahşap rezonansı
      if (!yerVar(3, t, t + 0.45, true)) return;
      const out = zarf(t, 0.002, vol, 0.32, panla(hedef, pan));
      if (dlyGiris && vol > 0.03) out.connect(dlyGiris);
      const o1 = ac.createOscillator();
      o1.type = 'sine';
      o1.frequency.setValueAtTime(f * 1.035, t);
      o1.frequency.exponentialRampToValueAtTime(f, t + 0.012);
      o1.connect(out); o1.start(t); o1.stop(t + 0.4);
      const hWood = zarf(t, 0.002, 0.28, 0.07, out);
      osc('sine', f * 3.96, t, t + 0.12, hWood);
      if (gurBuf) {
        const s = ac.createBufferSource(); s.buffer = gurBuf;
        const bp = suzgec('bandpass', Math.min(3200, f * 2.8), 2.8, null);
        const ng = zarf(t, 0.001, vol * 0.35, 0.016, panla(hedef, pan));
        s.connect(bp); bp.connect(ng);
        s.start(t, rnd() * 1.5); s.stop(t + 0.04);
      }
    } else if (tur === 'sedef') {
      // 2) Sedef ksilofon: pürüzsüz, sedefli, ışıltılı metallofon tınısı
      if (!yerVar(3, t, t + 0.9, true)) return;
      const out = zarf(t, 0.003, vol, 0.75, panla(hedef, pan));
      if (revSfx) out.connect(revSfx);
      osc('sine', f, t, t + 0.85, out);
      osc('triangle', f * 2, t, t + 0.5, zarf(t, 0.002, 0.22, 0.35, out));
      if (f * 3.14 < 14000) osc('sine', f * 3.14, t, t + 0.25, zarf(t, 0.002, 0.08, 0.18, out));
    } else if (tur === 'cam') {
      // 3) Yumuşak cam armonika: saf, kadifemsi, hipnotik kuvars rezonansı
      if (!yerVar(2, t, t + 1.4, true)) return;
      const out = zarf(t, 0.018, vol, 1.2, panla(hedef, pan));
      if (revSfxCok) out.connect(revSfxCok);
      osc('sine', f, t, t + 1.3, out, -2);
      osc('sine', f, t, t + 1.3, out, 2);
      if (f * 2 < 12000) osc('sine', f * 2, t, t + 0.8, zarf(t, 0.02, 0.14, 0.65, out));
    } else if (tur === 'damlaMarimba') {
      // 4) Su damlası marimba: damla kayması ("blup") + tok ahşap gövde rezonansı
      if (!yerVar(3, t, t + 0.5, true)) return;
      const out = zarf(t, 0.003, vol, 0.38, panla(hedef, pan));
      if (dlyGiris) out.connect(dlyGiris);
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f * 0.82, t);
      o.frequency.exponentialRampToValueAtTime(f * 1.25, t + 0.04);
      o.frequency.exponentialRampToValueAtTime(f, t + 0.09);
      o.connect(out); o.start(t); o.stop(t + 0.45);
      osc('triangle', f * 2.02, t, t + 0.2, zarf(t, 0.002, 0.25, 0.14, out));
      if (gurBuf) {
        const s = ac.createBufferSource(); s.buffer = gurBuf;
        const bp = suzgec('bandpass', Math.min(4500, f * 3.2), 3.0, null);
        const ng = zarf(t, 0.001, vol * 0.3, 0.014, panla(hedef, pan));
        s.connect(bp); bp.connect(ng);
        s.start(t, rnd() * 1.5); s.stop(t + 0.03);
      }
    }
  }
  // göksel soprano çanları: yüksek oktavda (MIDI 88–106) saf, havadar, parıldayan çan tınısı
  function sopranoCan(n, t, vol, pan, hedef) {
    if (test && test.log && oncelikli) test.log.push(['s', +t.toFixed(2), n, progAd]);
    if (!yerVar(3, t, t + 2.8, false, 1)) return;
    ek(t + 1.2);
    const f = typeof n === 'number' && n < 130 ? NOTE(n) : n, dec = 2.4;
    const out = zarf(t, 0.003, vol, dec, panla(hedef || B.soprano || B.zil, pan));
    if (dlyGiris) out.connect(dlyGiris);
    if (revMuzik) out.connect(revMuzik);
    osc('sine', f, t, t + dec + 0.05, out);
    const h2 = zarf(t, 0.002, 0.22, dec * 0.45, out);
    osc('sine', f * 2.002, t, t + dec * 0.45 + 0.05, h2);
    const h3 = zarf(t, 0.002, 0.08, dec * 0.22, out);
    osc('sine', f * 3.76, t, t + dec * 0.22 + 0.05, h3);
  }
  // rüzgar arpları: yüksek dallarda veya gökyüzünde rüzgarın tellere dokunuşu gibi dalgalanan arpej
  function ruzgarArp(notalar, t, vol, pan, ara, hedef) {
    if (!notalar || !notalar.length) return;
    const step = ara || 0.12;
    const total = notalar.length * step + 1.8;
    if (!yerVar(Math.min(6, notalar.length), t, t + total, false)) return;
    notalar.forEach((n, i) => {
      const ts = t + i * step + (rnd() - 0.5) * 0.01;
      const p = cl(pan + (i - notalar.length / 2) * 0.14, -0.65, 0.65);
      const v = vol * (0.8 + 0.4 * Math.sin((i / notalar.length) * Math.PI));
      arp(n, ts, v, p, 1.8 + i * 0.1, hedef || B.arp);
    });
  }
  // cam çan / kristal (Bölüm 2): temel + hafif uyumsuz üst kısmi sesler (2.76×, 5.4×) – parlak ama yumuşak, uzun yankılı
  function cam(f, t, vol, dec, pan, hedef, gecikme) {
    if (test && test.log && oncelikli) test.log.push(['k', +t.toFixed(2), Math.round(69 + 12 * Math.log2(f / 440)), progAd]);
    const h2 = f * 2.76 < 12000, h3 = f * 5.4 < 12000 && vol > 0.01;
    if (!yerVar(1 + (h2 ? 1 : 0) + (h3 ? 1 : 0), t, t + dec, false, 1)) return;
    ek(t + dec * 0.3); if (h3) ek(t + dec * 0.1);
    const out = zarf(t, 0.003, vol, dec, panla(hedef || B.zil, pan));
    if (gecikme !== false) out.connect(dlyGiris);
    osc('sine', f, t, t + dec + 0.05, out);
    if (h2) osc('sine', f * 2.76, t, t + dec * 0.3 + 0.05, zarf(t, 0.002, 0.16, dec * 0.26, out));
    if (h3) osc('sine', f * 5.4, t, t + dec * 0.1 + 0.05, zarf(t, 0.001, 0.05, dec * 0.09, out));
  }
  // kristal kâse (Bölüm 2): saf kuvars tınısı – iki yakın sinüs (hipnotik 0.6 Hz vuru), yumuşak 2. ve 3. harmonik, uzun şarkı söyleyen kuyruk
  function kase(f, t, vol, dec, pan, hedef) {
    if (!yerVar(3, t, t + dec, false, 1)) return;
    ek(t + dec * 0.4);
    const out = zarf(t, 0.25, vol, dec, panla(hedef || B.zil, pan));
    out.connect(dlyGiris);
    if (revSfxCok) out.connect(revSfxCok);
    osc('sine', f, t, t + dec + 0.1, out, -2.5);
    osc('sine', f, t, t + dec + 0.1, out, 2.5);
    if (f * 2 < 10000) {
      const h2 = zarf(t, 0.32, 0.16, dec * 0.6, out);
      osc('sine', f * 2, t, t + dec * 0.6 + 0.1, h2);
    }
    if (f * 3.01 < 12000 && vol > 0.015) {
      const h3 = zarf(t, 0.42, 0.05, dec * 0.35, out);
      osc('sine', f * 3.01, t, t + dec * 0.35 + 0.1, h3);
    }
  }
  // flüt / okarina (Bölüm 3): yumuşak üflemeli – sinüs gövde + süzgeçli üçgen, nefesli atak (kısa süzgeçli gürültü),
  // geç başlayan hafif vibrato, yumuşak bırakış. dur = nota süresi (sn). Tizde kısılır (iPad hoparlöründe tırmalamasın).
  function flut(n, t, dur, vol, pan, hedef, gecikme) {
    if (test && test.log && oncelikli) test.log.push(['f', +t.toFixed(2), n, progAd]);
    if (!yerVar(3, t, t + dur + 0.5, false, 2)) return;
    ek(t + dur * 0.5);
    const f = NOTE(n), v = vol * (n > 88 ? 1 - (n - 88) * 0.045 : 1), son = t + dur + 0.6;
    const g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.07);
    g.gain.setTargetAtTime(v * 0.78, t + 0.08, 0.3); g.gain.setTargetAtTime(0.0001, t + Math.max(0.1, dur), 0.11);
    g.connect(panla(hedef || B.flut, pan));
    if (gecikme !== false) g.connect(dlyGiris);
    const o1 = osc('sine', f, t, son, g);
    const lp = suzgec('lowpass', Math.min(5000, f * 2.6), 0.5, g);
    const o2 = osc('triangle', f, t, son, kazanc(0.32, lp));
    if (dur > 0.45) {   // vibrato: uzun notalarda, nota başladıktan sonra yavaşça girer
      const lf = ac.createOscillator(); lf.frequency.value = 4.8 + rnd() * 0.6;
      const lg = ac.createGain(); lg.gain.value = 0; lg.gain.setValueAtTime(0, t + 0.22); lg.gain.linearRampToValueAtTime(9, t + 0.6);
      lf.connect(lg); lg.connect(o1.detune); lg.connect(o2.detune); lf.start(t); lf.stop(son);
    }
    // nefes: atakta kısa, notanın perdesinde süzgeçli "ff"
    const s = ac.createBufferSource(); s.buffer = gurBuf;
    const bp = suzgec('bandpass', Math.min(7000, f * 2), 1.4, null), ng = ac.createGain();
    ng.gain.value = 0.0001; ng.gain.setValueAtTime(0.0001, t); ng.gain.exponentialRampToValueAtTime(v * 0.35, t + 0.03); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    s.connect(bp); bp.connect(ng); ng.connect(panla(hedef || B.flut, pan)); s.start(t, rnd() * 1.5); s.stop(t + 0.2);
  }
  // su damlası: aşağıdan yukarı kayan kısa sinüs ("bluk") + minik üst "plink"; müzikte B.su, efektte sfxG
  function damla(f, t, vol, pan, hedef) {
    if (!yerVar(2, t, t + 0.5, false, 1)) return;
    ek(t + 0.2);
    const out = zarf(t, 0.004, vol, 0.32, panla(hedef || B.su, pan));
    out.connect(dlyGiris);
    const o = osc('sine', f, t, t + 0.4, out);
    o.frequency.setValueAtTime(f * 0.78, t); o.frequency.exponentialRampToValueAtTime(f * 1.28, t + 0.05);
    osc('sine', f * 2.01, t, t + 0.18, zarf(t, 0.002, 0.22, 0.12, out));
  }
  // kabarış: yavaşça açılan, sonra sönen sıcak akor (sahne geçişleri). Tek zarf + tek süzgeç, nota başına iki sinüs (sıfır çıtırtı)
  function kabar(notalar, t, atk, kal, rel, vol, hedef, parlak) {
    if (!yerVar(notalar.length * 2, t, t + atk + kal + rel, true)) return;
    const son = t + atk + kal + rel + 0.15;
    const g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk);
    g.gain.setValueAtTime(vol, t + atk + kal); g.gain.exponentialRampToValueAtTime(0.0001, t + atk + kal + rel);
    g.connect(hedef || sahneG);
    const lp = suzgec('lowpass', parlak ? 600 : 400, 0.5, g);
    lp.frequency.setValueAtTime(parlak ? 600 : 400, t); lp.frequency.exponentialRampToValueAtTime(parlak ? 4200 : 2200, t + atk);
    lp.frequency.setTargetAtTime(900, t + atk + kal, rel * 0.5);
    notalar.forEach((n, i) => {
      const k = n < 52 ? 0.9 : 0.5;
      osc('sine', NOTE(n), t, son, kazanc(k, lp), i % 2 ? 5 : -5);
      osc('triangle', NOTE(n), t, son, kazanc(k * 0.35, lp), i % 2 ? -6 : 6);
    });
  }

  // ───────────────────────── kalıcı sesler: yaylılar + koro ─────────────────────────
  const tel = [], koro = [], kForm = [];   // kForm: [kazanç düğümü, düzey, 1=aa / 2=oo]
  function kaliciKur() {
    const lfo = ac.createOscillator(); lfo.frequency.value = 4.6; lfo.start();
    const lfoTel = kazanc(5, null), lfoKoro = kazanc(9, null); lfo.connect(lfoTel); lfo.connect(lfoKoro);
    const telLP = suzgec('lowpass', 1500, 0.5, B.tel);
    B.telLP = telLP;
    const telHP = suzgec('highpass', 160, 0.5, telLP);
    [62, 66, 69, 73].forEach((n, i) => {
      const v = { n, o: [] };
      for (const det of [-7, 8]) {
        const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE(n); o.detune.value = det;
        lfoTel.connect(o.detune); o.connect(panla(telHP, (i - 1.5) * 0.25 + det / 40)); o.start(); v.o.push(o);
      }
      tel.push(v);
    });
    // "aa" korosu: testere dişi → üç formant (F1 ~800, F2 ~1150, F3 ~2800)
    const kIn = ac.createGain(); kIn.gain.value = 1;
    for (const [f, q, gv] of [[780, 7, 1], [1160, 9, 0.5], [2800, 12, 0.22]]) { const bp = suzgec('bandpass', f, q, null); kIn.connect(bp); const g = kazanc(gv, B.koro); bp.connect(g); kForm.push([g, gv, 1]); }
    // Bölüm 2: "uu/oo" korosu (daha kapalı, ışıltılı; F1 ~380, F2 ~780) – Bölüm 1'in açık "aa"sından ayrı bir renk
    for (const [f, q, gv] of [[390, 6, 1.6], [790, 9, 0.5], [2400, 12, 0.12]]) { const bp = suzgec('bandpass', f, q, null); kIn.connect(bp); const g = kazanc(0, B.koro); bp.connect(g); kForm.push([g, gv, 2]); }
    [62, 66, 69].forEach((n, i) => {
      const v = { n, o: [] };
      for (const det of [-11, 10]) {
        const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = NOTE(n); o.detune.value = det;
        lfoKoro.connect(o.detune); o.connect(panla(kIn, (i - 1) * 0.5)); o.start(); v.o.push(o);
      }
      koro.push(v);
    });
  }
  function sesYurut(sesler, ak, lo, hi, t, tau) {   // akora en yakın notalarla yumuşak geçiş (ses yürütme)
    const aday = []; for (let m = lo; m <= hi; m++) if (ak.ton.includes(m % 12)) aday.push(m);
    const alinan = new Set();
    for (const v of sesler) {
      let en = null, ed = 1e9;
      for (const m of aday) { if (alinan.has(m)) continue; const d = Math.abs(m - v.n); if (d < ed) { ed = d; en = m; } }
      if (en == null) continue; alinan.add(en); v.n = en;
      for (const o of v.o) hedefle(o.frequency, NOTE(en), t, tau);
    }
  }

  // ───────────────────────── durum okuma (oyundan) ─────────────────────────
  // Bölüm 2 (Yıldız Gölü) müziği: BOLUM_NO==2 (ya da ?bolum=2) iken orman yerine 'yildiz' bölgesi çalar; yoS = yıldız oranı (yumuşatılmış)
  let b2Deger = null;
  const bolum2 = () => { if (b2Deger === null) b2Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 2 : (typeof location !== 'undefined' && /[?&]bolum=2(&|$)/.test(location.search)); return b2Deger; };
  let alanH = false, yoS = 0, yDoruk = 0, yHayvanA = 0, yBitti = false, yOzelT = -1e9, yYerlesen = 0;
  // Bölüm 3 (Bulut Ülkesi): koS = kuzucuk oranı (yumuşatılmış), gDoruk = gökkuşağı doruğu, ucusOlay = uçuş sürüyor (OLAY ucusBasla→ucusBitti)
  let b3Deger = null;
  const bolum3 = () => { if (b3Deger === null) b3Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 3 : (typeof location !== 'undefined' && /[?&]bolum=3(&|$)/.test(location.search)); return b3Deger; };
  let koS = 0, gDoruk = 0, gBasladi = false, ucusOlay = false, kuzuSay = 0, kOzelT = -1e9, kBekle = [], ucusT0 = -1e9;
  // Bölüm 4 (İnci Denizi): yuzmeS = yüzme hızı (yumuşatılmış, 0..1.5)
  let b4Deger = null;
  const bolum4 = () => { if (b4Deger === null) b4Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 4 : (typeof location !== 'undefined' && /[?&]bolum=4(&|$)/.test(location.search)); return b4Deger; };
  let b5Deger = null;
  const bolum5 = () => { if (b5Deger === null) b5Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 5 : (typeof location !== 'undefined' && /[?&]bolum=5(&|$)/.test(location.search)); return b5Deger; };
  let vBahce = 0, vIsik = 0, vMini = false, vMiniAsama = 0, vSal = false, vSalT0 = -1e9, vFinal = false;
  // Bölüm 6 (Şenlik Kalesi): s6S = fener oranı (yumuşatılmış); olay sayaçları V6 yoksa yedek
  let b6Deger = null;
  const bolum6 = () => { if (b6Deger === null) b6Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 6 : (typeof location !== 'undefined' && /[?&]bolum=6(&|$)/.test(location.search)); return b6Deger; };
  const S6_PROG = { kale: 1, halkaMini: 1, halkaKosu: 1, senlikFinal: 1 };
  let s6Fener = 0, s6Midilli = 0, s6Mini = false, s6MiniT0 = -1e9, s6Kopru = false, s6Final = false, s6S = 0, s6HalkaSon = 0, s6HalkaT = -1e9;
  // cila: halka koşusu ('halkaHiz') ve final sıçrayışı ('halkaFinalSicrama') · final şenliği bölümleri ('senlikFinal' {duration}, 'senlikDoruk')
  // · fener katmanı tanıtımı (s6Tanit: bir sonraki ölçüde yeni açılan katman kısa bir süsle kendini duyurur) · 'fisek' (dünyadaki havai fişekler)
  let s6Hiz = false, s6SicT = -1e9, s6FinalT0 = -1e9, s6FinalSure = 22, s6FB0 = -1, s6DorukT = -1e9, s6DorukBar = -1, s6DorukVurgu = false, s6SonT = -1;
  let s6FB = { tur: 'dans', k: 0 }, s6Tanit = 0, s6Asama = 0, s6FisekT = -1e9, s6FisekSay = 0, s6FisekGur = -1e9, s6HizT = -1e9;
  const s6AsamaBul = f => f < 0.12 ? 0 : f < 0.33 ? 1 : f < 0.5 ? 2 : f < 0.7 ? 3 : f < 0.9 ? 4 : 5;   // fener oranı → açık katman sayısı
  function v6Al(k) { try { return typeof V6 !== 'undefined' && V6 ? V6[k] : undefined; } catch (e) { return undefined; } }
  function s6Oran() {
    const top = v6Al('fenerTop') > 0 ? v6Al('fenerTop') : 12, n = Math.max(s6Fener, +v6Al('fener') || 0);
    return cl(n / top, 0, 1);
  }
  const s6MidilliSay = () => Math.max(s6Midilli, +v6Al('midilli') || 0);
  const s6FinalMi = () => s6Final || v6Al('final') === true;
  // Bölüm 7 (Kuzey Işıkları): k7S = fener oranı (yumuşatılmış); mini oyunlar ve final olaylardan; V7 yoksa olay sayaçları yedek
  let b7Deger = null;
  const bolum7 = () => { if (b7Deger === null) b7Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 7 : (typeof location !== 'undefined' && /[?&]bolum=7(&|$)/.test(location.search)); return b7Deger; };
  const K7_PROG = { kar: 1, kardanMini: 1, kizakMini: 1, kuzeyFinal: 1 };
  let k7Fener = 0, k7S = 0, k7Asama = 0, k7Tanit = 0, k7Yavru = 0, k7Kardan = false, k7KardanT0 = -1e9, k7KardanN = 0, k7Kizak = false, k7KizakT0 = -1e9;
  let k7Final = false, k7FinalT0 = -1e9, k7FinalSure = 30, k7FB0 = -1, k7DorukT = -1e9, k7DorukBar = -1, k7DorukVurgu = false, k7SonT = -1, k7FB = { tur: 'dalga', k: 0 };
  let k7TaneSon = 0, k7TaneT = -1e9, k7KayT = -1e9, k7CanlanT = -1e9, k7KizakHiz = false, k7KizakHizT = -1e9, k7SicT = -1e9, k7InisT = -1e9, k7KrisSon = 0, k7Ucus = false, k7UcusN = 0, k7UcusT0 = -1e9, k7ParlakT = -1e9;
  const k7AsamaBul = f => f < 0.1 ? 0 : f < 0.3 ? 1 : f < 0.5 ? 2 : f < 0.7 ? 3 : f < 0.9 ? 4 : 5;   // fener oranı → açık katman sayısı
  function v7Al(k) { try { return typeof V7 !== 'undefined' && V7 ? V7[k] : undefined; } catch (e) { return undefined; } }
  function k7Oran() { const top = v7Al('fenerTop') > 0 ? v7Al('fenerTop') : 10; return cl(Math.max(k7Fener, +v7Al('fener') || 0) / top, 0, 1); }
  const k7FinalMi = () => k7Final || v7Al('final') === true;
  function k7KayOku() {   // buzlu gölde kayma: oyun.js'in P.buz'u (0..1) + yatay hız
    if (typeof P === 'undefined' || !P || !P.ground) return 0;
    const b = typeof P.buz === 'number' ? P.buz : P.buz || P.buzda || P.kaygan ? 1 : 0;
    return b > 0.3 ? cl(Math.abs(P.vx || 0) / 380, 0, 1) * b : 0;
  }
  function k7KayIzle(t, v, olay) { if (t - k7KayT < (olay ? 1.2 : 2.4)) return; k7KayT = t; cal('golKay', v); }
  // Bölüm 8 (Balkabağı Gecesi): c8S = fener oranı (yumuşatılmış); bölge BOLUM.bolgeler'den (0,9 sn kararlılık). Mini oyunlar, uçuş ve final
  // olaylardan (src/BOLUM8.md) + V8 bayraklarından + modüllerin 'aktif' durumundan (KABAKYUZ.aktif, ISKELET.aktif, KAZAN8/KAZAN.aktif, SUPURGE.aktif()).
  let b8Deger = null;
  const bolum8 = () => { if (b8Deger === null) b8Deger = typeof BOLUM_NO !== 'undefined' ? BOLUM_NO === 8 : (typeof location !== 'undefined' && /[?&]bolum=8(&|$)/.test(location.search)); return b8Deger; };
  const C8_PROG = { cadi: 1, koru8: 1, kabakYuzMini: 1, iskeletMini: 1, sokak: 1, kazanMini: 1, supurgeMini: 1, meydan8: 1, cadiFinal: 1 };
  const C8_YOGUN = { sokak: 1, supurgeMini: 1, meydan8: 1, cadiFinal: 1 };   // yoğun ölçüler: geçici ses sınırı 96
  let c8Fener = 0, c8S = 0, c8Asama = 0, c8Tanit = 0, c8Hay = 0, c8Kapi = 0, c8Bolge = 'giris', c8BolgeAday = 'giris', c8BolgeAdayT = 0, c8ProgT0 = -1e9;
  const c8Hafiza = {};   // bölgeye dönünce tema bir sonraki çeşitlemeden sürsün (prog → döngü)
  let c8Yuz = false, c8YuzT0 = -1e9, c8YuzTamam = false;
  // iskelet: c8IskN = doğru nota sayısı (cümle = N/4) · c8IskHiza: 'iskeletBasla' anına ölçü hizalaması · c8IskFin: büyük kemik dansı başı (eşlik susar)
  let c8Isk = false, c8IskT0 = -1e9, c8IskHiza = false, c8IskN = 0, c8IskFin = -1e9, c8IskTada = false, c8IskBittiT = -1e9, c8IskTamam = false;
  let c8Kazan = false, c8KazanT0 = -1e9, c8KazanN = 0, c8KazanTamam = false;
  let c8Ucus = false, c8UcusT0 = -1e9, c8UcusBittiT = -1e9, c8AyT = -1e9, c8KoyT = -1e9, c8UcusB0 = -1, c8AyB0 = -1, c8UcusFB = { tur: 'kalkis', k: 0 };
  let c8Final = false, c8FinT0 = -1e9, c8FinSure = 35, c8FinHiza = -1, c8FinUz = 2, c8DorukT = -1e9, c8DorukB = -1, c8DorukVurgu = false, c8SonB = -1, c8SonIste = false;
  let c8FB = { tur: 'giris', k: 0 }, c8SekerSon = 0, c8SekerT = -1e9, c8SupSon = 0, c8SupT = -1e9;
  const c8Cubuklar = [];   // son ölçüler {t, uz, vur, prog}: vuruş eşleme (AU.nabiz, iskeletDans)
  const c8AsamaBul = f => f < 0.08 ? 0 : f < 0.24 ? 1 : f < 0.4 ? 2 : f < 0.58 ? 3 : f < 0.82 ? 4 : 5;   // fener oranı → açık katman (12 fenerde 1 · 3 · 5 · 7 · 10)
  function v8Al(k) { try { return typeof V8 !== 'undefined' && V8 ? V8[k] : undefined; } catch (e) { return undefined; } }
  function c8Oran() { const top = v8Al('fenerTop') > 0 ? v8Al('fenerTop') : 12; return cl(Math.max(c8Fener, +v8Al('fener') || 0) / top, 0, 1); }
  const c8HaySay = () => Math.max(c8Hay, +v8Al('hayalet') || 0);
  const c8FinalMi = () => c8Final || v8Al('final') === true;
  const c8Tamam = k => (k === 'kabakYuz' ? c8YuzTamam : k === 'iskelet' ? c8IskTamam : k === 'kazan' ? c8KazanTamam : false) || v8Al(k) === true;
  function c8AlanOku() {
    if (typeof BOLUM === 'undefined' || typeof P === 'undefined' || !BOLUM.bolgeler) return c8Bolge;
    for (const b of BOLUM.bolgeler) if (P.x >= b.x0 && P.x < b.x1) return b.ad;
    return c8Bolge;
  }
  function c8BolgeIzle(t, a) { if (!a) return; if (a !== c8BolgeAday) { c8BolgeAday = a; c8BolgeAdayT = t; } else if (a !== c8Bolge && t - c8BolgeAdayT > 0.9) c8Bolge = a; }
  function c8UcusOku() {   // süpürge uçuşu sürüyor mu (olay gelmediyse P.ucus / SUPURGE.aktif())
    try {
      if (typeof SUPURGE !== 'undefined' && SUPURGE && typeof SUPURGE.aktif === 'function' && SUPURGE.aktif()) return true;
      return !!(typeof P !== 'undefined' && P && P.ucus && /supurge/i.test(P.ucus.tip || ''));
    } catch (e) { return false; }
  }
  function c8UcusOranOku() {   // yolculuğun ilerlemesi 0..1 (ay anı yedeği)
    try {
      if (typeof SUPURGE !== 'undefined' && SUPURGE && typeof SUPURGE.ilerleme === 'function') { const v = +SUPURGE.ilerleme(); if (Number.isFinite(v)) return cl(v, 0, 1); }
      const s = typeof BOLUM !== 'undefined' && BOLUM && (BOLUM.supurge || BOLUM.ucus);
      if (s && typeof P !== 'undefined' && P && s.x1 > s.x0) return cl((P.x - s.x0) / (s.x1 - s.x0), 0, 1);
    } catch (e) {}
    return 0;
  }
  function c8AktifOku(ad) {   // mini oyun modülünün 'aktif' durumu (ad: 'KABAKYUZ' | 'ISKELET' | 'KAZAN')
    try {
      const m = ad === 'KABAKYUZ' ? (typeof KABAKYUZ !== 'undefined' ? KABAKYUZ : null) : ad === 'ISKELET' ? (typeof ISKELET !== 'undefined' ? ISKELET : null)
        : (typeof KAZAN8 !== 'undefined' ? KAZAN8 : typeof KAZAN !== 'undefined' ? KAZAN : null);
      if (!m) return false;
      const a = typeof m.aktif === 'function' ? m.aktif() : m.aktif;
      return !!a;
    } catch (e) { return false; }
  }
  // çalınacak Bölüm 8 parçası: final > uçuş > iniş/meydan > mini oyunlar (bölgede ve bitmemişse; başlamadıysa hafif) > sokak / koru / ana tema
  function c8Ad(d) {
    if (c8FinalMi()) return 'cadiFinal';
    const t = zaman(), b = c8Bolge;
    if (c8Ucus || (d && d.ucus8)) return 'supurgeMini';
    if (t - c8UcusBittiT < 6 || b === 'meydan' || b === 'yolculuk') return 'meydan8';
    if (c8Isk || (d && d.isk8) || (c8IskFin > -1e8 && t - c8IskBittiT < 1.6) || (b === 'iskelet' && !c8Tamam('iskelet'))) return 'iskeletMini';
    if (c8Yuz || (d && d.yuz8) || (b === 'kabakYuz' && !c8Tamam('kabakYuz'))) return 'kabakYuzMini';
    if (c8Kazan || (d && d.kazan8) || b === 'bahce') return 'kazanMini';
    if (b === 'sokak' || b === 'iskelet') return 'sokak';
    if (b === 'koru') return 'koru8';
    return 'cadi';
  }
  function volkanAlani() {
    if (typeof BOLUM === 'undefined' || typeof P === 'undefined' || !BOLUM.bolgeler) return 'koz';
    for (const b of BOLUM.bolgeler) if (P.x >= b.x0 && P.x < b.x1) return b.ad;
    return 'koz';
  }
  let yuzmeS = 0, yukseklikS = 0;
  function kuzuOrani() {
    if (typeof SAYAC !== 'undefined' && SAYAC && SAYAC.kuzuTop > 0) return cl(SAYAC.kuzu / SAYAC.kuzuTop, 0, 1);
    return cl(kuzuSay / 7, 0, 1);
  }
  const ucusVar = () => ucusOlay || !!(typeof P !== 'undefined' && P && P.ucus);
  const sm = (a, b, x) => { const u = cl((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  let mod = 'ninni', zorlaMod = null, bolge = 'patika', bolgeAday = 'patika', bolgeAdayT = 0;
  let buyukPof = null;
  function bolgeBul() {
    if (typeof BOLUM === 'undefined' || typeof P === 'undefined' || !BOLUM.bolgeler) return bolge;
    let s = null;
    for (const b of BOLUM.bolgeler) if (P.x >= b.x0 && P.x < b.x1 && (!b.ust || P.y < b.ust)) s = b.ad;
    return s && PROG[s] ? s : bolge;
  }
  function yildizAlani() {   // Bölüm 2 alanı (BOLUM.bolgeler adı): patika · goletKiyi · yildizGol · pofuduk · hayvan
    if (typeof BOLUM === 'undefined' || typeof P === 'undefined' || !BOLUM.bolgeler) return 'patika';
    let s = 'patika';
    for (const b of BOLUM.bolgeler) if (P.x >= b.x0 && P.x < b.x1) s = b.ad;
    return s;
  }
  let yCagriT = -1e9, yBekle = [];   // gökte yerleşen yıldızların notaları: müzik bir sonraki ölçüde ızgaraya oturtup yankılar

  function yildizOrani() {
    if (typeof SAYAC !== 'undefined' && SAYAC && SAYAC.yildizTop > 0) return cl(SAYAC.yildiz / SAYAC.yildizTop, 0, 1);
    return cl(yYerlesen / 14, 0, 1);
  }
  function oku() {   // test bunu değiştirebilir
    const d = typeof DURUM !== 'undefined' ? DURUM : 'oyun';
    if (!buyukPof && typeof NESNELER !== 'undefined') buyukPof = NESNELER.find(n => n.tip === 'buyukPofuduk') || null;
    const bp = buyukPof;
    // Feza'nın peşindeki uyanık Pofuduk sayısı (geçit töreni) – nesne listesi üstünden, ayırma yapmadan
    let takip = 0;
    if (typeof NESNELER !== 'undefined') for (let i = 0; i < NESNELER.length; i++) { const o = NESNELER[i]; if (o.tip === 'pofuduk' && o.pf && o.pf.durum === 'takip') takip++; }
    const pVar = typeof P !== 'undefined' && P;
    const yuzmeHiz = pVar ? cl(Math.hypot(P.vx || 0, P.vy || 0) / (P.denizHamle > 0 ? 320 : 220) + (P.denizHamle > 0 ? 0.35 : 0), 0, 1.5) : 0;
    const pY = pVar && typeof P.y === 'number' ? P.y : 480;
    const yukseklik = pVar ? cl((460 - pY) / 340, 0, 1.4) : 0;
    return {
      durum: d, bolge: bolgeBul(), light: isik(),
      uyku: bp && !bp.uyandi && d === 'oyun' && pVar ? cl(1.15 - Math.abs(P.x - bp.x) / 950, 0, 1) : 0,
      uykuYakin: bp && pVar ? cl(1.15 - Math.abs(P.x - bp.x) / 950, 0, 1) : 0,
      uyandi: !!(bp && bp.uyandi),
      yo: yildizOrani(), alan: bolum2() ? yildizAlani() : '',
      ko: bolum3() ? kuzuOrani() : 0, ucus: bolum3() && ucusVar(),
      yuzme: yuzmeHiz, denizHamle: pVar && pVar.denizHamle > 0 ? 1 : 0,
      yukseklik,
      takip, hareket: pVar && Math.abs(P.vx || 0) > 40 ? 1 : 0,
      kay7: bolum7() ? k7KayOku() : 0,
      alan8: bolum8() ? c8AlanOku() : '', ucus8: bolum8() && c8UcusOku(), oran8: bolum8() ? c8UcusOranOku() : 0,
      yuz8: bolum8() && c8AktifOku('KABAKYUZ'), isk8: bolum8() && c8AktifOku('ISKELET'), kazan8: bolum8() && c8AktifOku('KAZAN'),
      kapi8: bolum8() && typeof SEKER8 !== 'undefined' && !!(SEKER8 && SEKER8.aktif),
    };
  }
  // sahne/hikâye durumu (olaylardan): rüya katmanı, Büyük Pofuduk aşaması, finalde atlama isteği, geçidin hareketi
  let ruya = 0, asama = 0, finalIstek = null, gecitHareket = 0, sabahKus = false;
  // orman modunda çalınacak bölüm: Büyük Pofuduk uyanınca açıklık şenliğe döner
  const ormanAd = d => bolum8() ? c8Ad(d) : bolum7() ? (k7FinalMi() ? 'kuzeyFinal' : k7Kizak ? 'kizakMini' : k7Kardan ? 'kardanMini' : 'kar') : bolum6() ? (s6FinalMi() ? 'senlikFinal' : s6Mini ? (s6Hiz ? 'halkaKosu' : 'halkaMini') : 'kale') : bolum5() ? (vFinal ? 'volkanFinal' : vSal ? 'lavsal' : /kalp|kor/.test(volkanAlani()) && volkanAlani() !== 'koz' ? 'volkanKalp' : 'volkan') : bolum4() ? 'deniz' : bolum2() ? 'yildiz' : bolum3() ? (d && d.ucus ? 'ucus' : 'bulut') : bolge === 'aciklik' && d && d.uyandi ? 'senlik' : bolge;
  let okuFn = oku;

  // ───────────────────────── ölçü planlayıcı ─────────────────────────
  let progAd = 'ninni', pi = 0, bic = 0, cubukNo = 0, sonrakiCubuk = 0, akor = AK.D, oncekiAk = null, cubukUz = BAR;   // cubukUz: planlanan ölçünün süresi
  const akorlar = [];           // [{t, ak}]
  function akorAt(t) { for (let i = akorlar.length - 1; i >= 0; i--) if (akorlar[i].t <= t + 0.02) return akorlar[i].ak; return akor; }
  let d0 = null;                // son okunan oyun durumu

  // ninni: hangi parçanın kaçıncı ölçüsü çalıyor (ana tema döner; Pırıl uyanınca onun teması araya girer)
  let ninniSira = { ad: 'ana', i: 0 }, pirilBekle = false, dongu = 0;
  const ninniIleri = s => s.i + 1 < PARCA[s.ad].length ? { ad: s.ad, i: s.i + 1 } : { ad: 'ana', i: 0 };
  function ninniBas(s) { ninniSira = s || { ad: 'ana', i: 0 }; }
  function cubukPlanla(t) {
    const d = d0;
    const istenen = mod === 'final' && bolum8() ? 'cadiFinal' : mod === 'final' && bolum5() ? 'volkanFinal' : mod === 'final' && bolum6() ? 'senlikFinal' : mod === 'final' && bolum7() ? 'kuzeyFinal' : mod === 'orman' ? ormanAd(d) : mod;
    if (istenen !== progAd && (mod !== 'orman' || bic % 2 === 0 || istenen === 'senlik' || istenen === 'ucus' || istenen === 'lavsal' || istenen === 'volkanKristal' || istenen === 'volkanFinal' || istenen === 'halkaMini' || istenen === 'halkaKosu' || istenen === 'senlikFinal' || istenen === 'kardanMini' || istenen === 'kizakMini' || istenen === 'kuzeyFinal' || C8_PROG[istenen] || progAd === 'ninni' || progAd === 'final')) {
      if (!(progAd === 'final' && mod === 'final')) {
        if (istenen === 'ninni' && progAd !== 'ninni') ninniBas();
        if (C8_PROG[progAd]) c8Hafiza[progAd] = dongu + 1;   // Bölüm 8: bölgeye dönünce tema bir sonraki çeşitlemeden sürer
        progAd = istenen; pi = 0; bic = 0; dongu = C8_PROG[istenen] ? c8Hafiza[istenen] || 0 : 0; padBirak(t); oncekiAk = null;
        if (C8_PROG[istenen]) c8ProgT0 = t;
      }
    }
    // final sahnesi: altın ışık dolunca doruğa (8. ölçü: Pırıl'ın teması). Sabah olunca tema, kaldığı yerden
    // yatak odasında müzik kutusuyla (3/4) sürer; ardından ana tema.
    if ((progAd === 'final' || progAd === 'volkanFinal' || progAd === 'senlikFinal' || progAd === 'kuzeyFinal' || progAd === 'cadiFinal') && bic === 0 && finalIstek) {
      if (finalIstek === 'zirve' && progAd === 'cadiFinal') { if (c8DorukT < -1e8) c8DorukT = t; }
      else if (finalIstek === 'sabah' && progAd === 'cadiFinal' && c8FB.tur !== 'sukun') { c8SonIste = true; t7Bekle = true; }   // Bölüm 8: önce sıcak kapanış ölçüsü
      else if (finalIstek === 'zirve' && progAd === 'kuzeyFinal') { if (k7DorukT < -1e8) k7DorukT = t; }
      else if (finalIstek === 'zirve' && pi < 8) pi = 8;
      else if (finalIstek === 'sabah' && progAd === 'kuzeyFinal' && k7FB.tur !== 'sukun') { if (k7SonT < 0) k7SonT = t; t7Bekle = true; }
      else if (finalIstek === 'sabah') {
        ninniBas(pi >= 17 || bolum6() || bolum7() || bolum8() ? null : { ad: 'piril', i: pi > 8 ? Math.min(pi - 8, PARCA.piril.length - 1) : 0 });   // Bölüm 6: şenlikten sonra ana tema baştan
        mod = 'ninni'; progAd = 'ninni'; pi = 0; bic = 0; dongu = 0; padBirak(t); oncekiAk = null;
      }
      if (t7Bekle) t7Bekle = false; else finalIstek = null;
    }
    if (progAd === 'senlikFinal' && bic === 0) pi = s6FinalSec(t);
    if (progAd === 'kuzeyFinal' && bic === 0) pi = k7FinalSec(t);   // Bölüm 7 finali: bölüm (dalga/doruk/son/sükûn) olaylardan ve süreden seçilir   // Bölüm 6 finali: bölüm (dans/doruk/son/sükûn) olaylardan ve süreden seçilir
    if (progAd === 'cadiFinal' && bic === 0) pi = c8FinalSec(t);   // Bölüm 8 finali: ölçüler finalin saatine oturur (c8FinalSec)
    if (progAd === 'supurgeMini' && bic === 0) pi = c8UcusSec(t);   // süpürge: kalkış / gece / ay / köy bölümleri olaylardan
    cubukUz = C8_PROG[progAd] ? c8Uz(progAd, t) : BAR;   // bu ölçünün süresi (Bölüm 8'de 112 / 120 BPM ve hizalama ön vuruşları)
    // Pırıl uyandı (giriş): ana temanın yarım cümle sonunda onun teması başlar
    if (progAd === 'ninni' && pirilBekle && ninniSira.ad === 'ana' && ninniSira.i % 2 === 0) { ninniSira = { ad: 'piril', i: 0 }; pirilBekle = false; }
    const pr = PROG[progAd];
    if (bic === 0) {
      const ninni = progAd === 'ninni'; let akAd = ninni ? PARCA[ninniSira.ad][ninniSira.i].ak : pr.ak[pi];
      if (C8_PROG[progAd]) akAd = c8AkorSec(akAd, t);   // iskelet: oyun başlayınca akor çocuğun cümlesini izler (pad bir ölçü; org her ölçüde)
      if (progAd === 'yildiz' && pi === 7 && dongu % 2 === 1 && yoS > 0.4) akAd = 'YB';   // her ikinci döngüde G#m yerine parlak B: yükselişli, çözülmeyen bir özlem (tekrar hissini azaltır)
      const ak = AK[akAd];
      akorlar.push({ t, ak }); if (akorlar.length > 6) akorlar.shift();
      if (ak !== oncekiAk) {
        let n = 1;
        if (ninni) { let s = ninniIleri(ninniSira); while (n < 4 && PARCA[s.ad][s.i].ak === akAd) { n++; s = ninniIleri(s); } }
        else if (!C8_PROG[progAd]) while (n < pr.ak.length && pr.ak[(pi + n) % pr.ak.length] === pr.ak[pi]) n++;
        pad(ak, t, n * pr.cb * cubukUz, progAd === 'iskeletMini' ? 0.9 : 0);
        sesYurut(tel, ak, 57, 78, t, progAd === 'ninni' || progAd === 'baslik' ? 0.1 : 0.045);
        sesYurut(koro, ak, 59, 72, t, progAd === 'baslik' ? 0.3 : 0.08);
      }
      akor = ak; oncekiAk = ak;
    }
    const l = d.light;
    if (progAd === 'ninni') ninniCubuk(t);
    else if (progAd === 'final') finalCubuk(t, pi);
    else if (progAd === 'volkanFinal') volkanFinalCubuk(t, akor, pi);
    else if (progAd === 'baslik') baslikCubuk(t, akor, pi, dongu);
    else if (progAd === 'yildiz') yildizCubuk(t, akor, bic, pi, d);
    else if (progAd === 'bulut') bulutCubuk(t, akor, bic, pi, d);
    else if (progAd === 'deniz') denizCubuk(t, akor, bic, pi, d);
    else if (progAd === 'ucus') ucusCubuk(t, akor, pi, d);
    else if (progAd === 'lavsal') lavsalCubuk(t, akor, pi);
    else if (progAd === 'volkan' || progAd === 'volkanKristal' || progAd === 'volkanKalp') volkanCubuk(t, akor, bic, pi);
    else if (progAd === 'kale') kaleCubuk(t, akor, bic, pi);
    else if (progAd === 'halkaMini') halkaCubuk(t, akor, pi);
    else if (progAd === 'halkaKosu') halkaKosuCubuk(t, akor, pi);
    else if (progAd === 'senlikFinal') senlikFinalCubuk(t, akor, pi);
    else if (progAd === 'kar') karCubuk(t, akor, bic, pi);
    else if (progAd === 'kardanMini') kardanCubuk(t, akor, pi);
    else if (progAd === 'kizakMini') kizakCubuk(t, akor, pi);
    else if (progAd === 'kuzeyFinal') kuzeyFinalCubuk(t, akor, pi);
    else if (C8_PROG[progAd]) c8Cubuk(t, akor, pi);
    else ormanCubuk(t, akor, progAd, bic, pr.cb, l, d);
    if (mod === 'orman' && d.uyku > 0.02 && progAd === 'aciklik') uykuCubuk(t, d.uyku);
    if (mod === 'orman' && d.takip > 0 && PROG[progAd].ak) gecitCubuk(t, akor, d.takip, progAd);
    // ilerle
    bic++;
    if (progAd === 'ninni') { ninniSira = ninniIleri(ninniSira); bic = 0; pi++; }
    else if (bic >= pr.cb) { bic = 0; pi++; if (pi >= pr.ak.length) { pi = 0; dongu++; if (pr.bitis && mod === progAd) { mod = pr.bitis; } } }
    cubukNo++;
  }

  // ── orman: bestelenmiş bölge temaları (TEMA) + bölgeye göre eşlik ostinatoları ──
  // Döngü: 0 A müzik kutusu · 1 B müzik kutusu (+ alt oktav çelesta) · 2 A çelesta (üstte çan ışıltısı) · 3 B seyrek (nefes)
  // Işık azken ve Büyük Pofuduk uyurken süs notaları seyrelir; motifin vurgulu notaları (ölçü başı / uzun) hep çalar.
  let ezgiSusT0 = -1, ezgiSusT1 = -1, t7Bekle = false;   // t7Bekle: Bölüm 7 sabahı son kadansını bekliyor (finalIstek korunur)   // Pırıl'ın motifi alıntılanırken bölge ezgisi bir an susar (iki ezgi çakışmasın)
  function ezgiSus(t0, t1) { ezgiSusT0 = t0; ezgiSusT1 = t1; }
  function melTonu(ak, n) { for (let d = 0; d < 6; d++) { if (ak.mel.includes((n - d + 120) % 12)) return n - d; if (ak.mel.includes((n + d) % 12)) return n + d; } return n; }
  function akorTonu(ak, n) { for (let d = 0; d < 6; d++) { if (ak.ton.includes((n - d + 120) % 12)) return n - d; if (ak.ton.includes((n + d) % 12)) return n + d; } return n; }
  function ormanCubuk(t, ak, b, bic, cb, l, d) {
    const S8 = 0.3, hum = () => (rnd() - 0.5) * 0.008;
    const uykuSus = d.uyku > 0.3 ? 0.55 : 1;
    const tema = TEMA[b];
    if (tema) {
      const v = dongu % 4, A = v === 0 || v === 2, bars = A ? tema.A : tema.B;
      const mel = bars[(pi * cb + bic) % bars.length] || [];
      const celesta = v === 2, seyrek = v === 3;
      const vol0 = b === 'gol' || b === 'sakli' ? 0.044 : 0.05;
      const dec0 = b === 'gol' ? 3.2 : b === 'pofuduk' ? 1.6 : b === 'senlik' ? 1.4 : b === 'sakli' ? 2.8 : 2.4;
      oncelikli = true;   // ezgi hiç atılmaz; eşlik atılabilir
      for (const [s, n, u] of mel) {
        const vurgu = s === 0 || u >= 3, ts = t + s * S8 + hum();
        if (ts > ezgiSusT0 - 0.15 && ts < ezgiSusT1) continue;
        if (!vurgu && ((seyrek && s % 4) || (l < 0.1 && rnd() < 0.3) || (uykuSus < 1 && rnd() < 0.45))) continue;
        const pan = cl((n - 84) * 0.05, -0.45, 0.45), vv = vol0 * (vurgu ? 1.1 : 0.88) * (seyrek ? 0.85 : 1);
        const dec = Math.min(dec0, 0.9 + u * 0.45) + (b === 'gol' ? 0.6 : 0);
        if (celesta) {
          tus(n, ts, vv * 0.85, dec + 0.4, pan, true, B.zil);
          if (vurgu && l > 0.25) zil(NOTE(n + 12), ts + 0.012, vv * 0.32, 1.4, -pan, null, false);
        } else {
          zil(NOTE(n), ts, vv, dec, pan);
          if (v === 1 && u >= 4 && l > 0.4) tus(n - 12, ts + 0.01, 0.018, 2, -pan, false);
          if (vurgu && l > 0.55 && u >= 3 && !seyrek) zil(NOTE(n + 12), ts + 0.2, 0.016, 1.6, -pan, null, true);
        }
        if ((b === 'gol' || b === 'sakli') && vurgu && l > 0.2 && !celesta) tus(n, ts, 0.016, 2.2, pan, true);
        if (b === 'senlik' && vurgu) tus(n - 12, ts, 0.016, 0.9, -pan, true);   // şenlikte ezgiye alt oktavdan çelesta eşliği
        // Lidyen orman flütleri (Bölüm 1): nefesli ahşap tınısı, melodik karşı ezgiler ve ışıkla açılan doku
        if (l > 0.18 && u >= 3 && b !== 'senlik') {
          if ((v === 1 || v === 2) && rnd() < 0.88) flut(diyatonik(n, -2), ts + 0.03, u * S8 * 0.92, 0.024 * (0.6 + 0.4 * l), -pan * 0.6, B.flut, false);
          else if (v === 0 && l > 0.4 && vurgu) flut(n - 12, ts + 0.02, u * S8 * 0.88, 0.02 * l, -pan * 0.5, B.flut, false);
        }
      }
      oncelikli = false;
    }
    const tonlar = (taban, adet) => { const r = []; for (let m = taban; r.length < adet && m < taban + 40; m++) if (ak.ton.includes(m % 12)) r.push(m); return r; };
    // Lidyen orman flütü tematik soloları ve kanopi yankıları:
    if (l > 0.18) {
      if (b === 'dallar' && bic === 1) {
        const flMel = tonlar(ak.bas + 36, 4);
        flMel.slice(0, 3).forEach((fn, k) => flut(fn, t + 0.5 + k * 0.24, 0.38, 0.022 * (0.5 + 0.5 * l), 0.3 - k * 0.2, B.flut, false));
      } else if (b === 'sakli' && bic === 0) {
        flut(ak.bas + 36, t + 1.15, 1.1, 0.02 * (0.5 + 0.5 * l), -0.25, B.flut, false);
      } else if (b === 'aciklik' && asama >= 1 && bic % 2 === 1) {
        flut(ak.bas + 38, t + 1.2, 0.85, 0.024, 0.22, B.flut, false);
      } else if (b === 'senlik' && (bic === 0 || bic === 2)) {
        flut(ak.bas + 48, t + 0.3, 0.22, 0.022, 0.28, B.flut, false);
      } else if (b === 'patika' && bic === 2 && l > 0.4) {
        flut(ak.bas + 36, t + 1.0, 0.8, 0.02 * l, -0.2, B.flut, false);
      }
    }
    // arp
    const av = 0.045;
    // Feza yüksek dallara veya gökyüzüne çıktıkça müziğe eklenen göksel soprano çanları ve rüzgar arpları:
    if (b === 'dallar' || yukseklikS > 0.28) {
      const altGuc = Math.max(b === 'dallar' ? 0.7 : 0, yukseklikS);
      if ((bic === 1 || bic === 3) && rnd() < 0.85) {
        const tnArp = tonlar(ak.bas + 36, 6);
        ruzgarArp(tnArp, t + 0.35, 0.024 * altGuc, 0.2, 0.15);
      }
      if (bic === 0 || bic === 2) {
        const sCand = [ak.bas + 48, ak.bas + 55, ak.bas + 60].filter(m => ak.mel.includes(m % 12));
        if (sCand.length) sopranoCan(sec(sCand), t + 0.95 + (rnd() - 0.5) * 0.12, 0.019 * altGuc, (rnd() - 0.5) * 0.6);
      }
    }
    if (b === 'patika') { if (bic === 0 || (bic === 2 && l > 0.4)) tonlar(ak.bas + 24, 5).forEach((n, i) => arp(n, t + i * 0.11, av * 0.8, -0.3 + i * 0.15)); }
    else if (b === 'pofuduk') { const tn = tonlar(ak.bas + 24, 4); [1, 3, 5, 7].forEach((s, i) => { if (rnd() < 0.85) arp(tn[(i + cubukNo) % tn.length], t + s * S8, av * 0.7, i % 2 ? 0.3 : -0.3, 0.6); }); }
    else if (b === 'gol') {
      if (bic === 0) tonlar(ak.bas + 19, 9).forEach((n, i) => arp(n, t + i * 0.075, av * (0.55 + i * 0.04), -0.6 + i * 0.15, 2.6));
      else if (rnd() < 0.7) arp(sec(tonlar(ak.bas + 36, 4)), t + sec([2, 4, 5]) * S8, av * 0.6, (rnd() - 0.5), 2.4);
    } else if (b === 'dallar') { const tn = tonlar(ak.bas + 12, 5), yol = [0, 1, 2, 3, 4, 3, 2, 1]; yol.forEach((k, s) => arp(tn[k], t + s * S8 + hum(), av * (s % 2 ? 0.55 : 0.75), (k - 2) * 0.2, 1.2)); }
    else if (b === 'sakli') { const tn = tonlar(ak.bas + 24, 4); [0, 2, 1, 3].forEach((k, i) => arp(tn[k], t + i * 0.6, av * 0.55, (i - 1.5) * 0.3, 2)); }
    else if (b === 'aciklik') {
      const tn = tonlar(ak.bas + 24, 4); [0, 1, 2, 3].forEach((k, i) => { if (rnd() < (0.8 + 0.1 * asama) * uykuSus) arp(tn[k], t + i * 0.6, av * 0.6, (i - 1.5) * 0.25, 1.8); });
      // Büyük Pofuduk kıpırdadıkça (aşama 1–2) umutlu, yukarı tırmanan küçük bir çelesta cevabı belirir
      if (asama >= 1 && (asama >= 2 || bic % 2 === 1)) { const um = tonlar(ak.bas + 36 + (asama >= 2 ? 2 : 0), 4); um.forEach((n, i) => tus(n, t + (4 + i) * S8, 0.016 + 0.003 * i, 1.6, -0.3 + i * 0.2, true)); }
    }
    else if (b === 'senlik') {   // sıçrayan kırık akor: aşağı-yukarı, her sekizlikte
      const tn = tonlar(ak.bas + 24, 5), yol = [0, 2, 1, 3, 2, 4, 3, 1];
      yol.forEach((k, s) => { if (s % 2 || rnd() < 0.7) arp(tn[k], t + s * S8 + hum(), av * (s % 2 ? 0.5 : 0.62), (k - 2) * 0.22, 0.9); });
      if (bic === 0 && cubukNo % 4 === 0) { const kf = tonlar(86, 6); for (let i = 0; i < 6; i++) zil(NOTE(kf[i]), t + 1.2 + i * 0.06, 0.014, 1.2, (i % 2 ? 0.5 : -0.5), null, false); }   // konfeti ışıltısı
    }
    // tuşlu (piyano/çelesta)
    const ust = ak.pad.slice(1).map(n => n + 12);
    if (b === 'pofuduk' || b === 'senlik') { [2, 6].forEach(s => ust.slice(b === 'senlik' ? 2 : 1).forEach((n, i) => tus(n, t + s * S8 + i * 0.012, b === 'senlik' ? 0.019 : 0.022, 0.35, (i - 1) * 0.3))); }
    else if (b === 'dallar') { [0, 3].forEach(s => ust.forEach((n, i) => tus(n, t + s * S8 + i * 0.02, 0.02, 1.3, (i - 1.5) * 0.25))); }
    else if (b === 'gol') { if (rnd() < 0.6) tus(sec(ust) + 12, t + sec([3, 7]) * S8, 0.02, 2.4, rnd() - 0.5, true); }
    else if (b === 'sakli') { const n = sec(ust) + 12; tus(n, t + 1.2, 0.022, 2, 0.3, true); tus(akorTonu(ak, n - 3), t + 1.8, 0.018, 2, -0.3, true); }
    else if (bic === 0) ust.forEach((n, i) => tus(n, t + i * 0.06, 0.024, 2.6, (i - 1.5) * 0.3));
    // bas / nabız
    const bv = 0.11;
    if (b === 'senlik') {   // uyanan Büyük Pofuduk'un tubası artık neşeli: "ım-pa, ım-pa"
      const kok = ak.bas < 43 ? ak.bas + 12 : ak.bas;
      tuba(kok, t, 0.22, 0.075, 0); tuba(kok + 7, t + 4 * S8, 0.2, 0.06, 0);
      if (pi % 4 === 3) { tuba(kok + 4, t + 6 * S8, 0.12, 0.05, 0); tuba(kok + 5, t + 7 * S8, 0.12, 0.05, 0); }
      bas(ak.bas + 12, t + 2 * S8, bv * 0.45, 'pizz'); bas(ak.bas + 12, t + 6 * S8, bv * 0.45, 'pizz');
    }
    else if (b === 'pofuduk') { bas(ak.bas + 12, t, bv, 'pizz'); bas(ak.bas + 19, t + 4 * S8, bv * 0.8, 'pizz'); if (rnd() < 0.5) bas(ak.bas + 12, t + 6 * S8, bv * 0.5, 'pizz'); }
    else if (b === 'dallar') { const nv = bv * (0.45 + 0.55 * l); [0, 2, 4, 6].forEach(s => bas(ak.bas + 12, t + s * S8, nv * (s ? 0.6 : 1), 'nabiz')); if (bic === 0) bas(ak.bas, t, bv * 0.6, 'uzun', cb * BAR); }
    else if (b === 'sakli') { bas(ak.bas + 12, t, bv * 0.6, 'nabiz'); bas(ak.bas + 12, t + 0.45, bv * 0.35, 'nabiz'); }
    else if (bic === 0) bas(ak.bas + (b === 'gol' ? 0 : 12), t, bv * (b === 'gol' ? 0.6 : 0.7), 'uzun', cb * BAR);
  }

  // ── Bölüm 2 "Yıldız Gölü": gece göğü + sakin göl. yoS (0..1) = uyanıp göğe yerleşen yıldız oranı. Katmanlar yoS arttıkça açılır:
  //   0     : yalnız pad + seyrek yüksek kıvılcımlar + su damlaları (sönük gökyüzü)
  //   >.08  : Yıldız Teması (cam çan) belirir, yavaş harp arpı
  //   >.30  : çelesta akorları, bas nabzı · >.50 ikinci arp · >.40 yaylı · >.50 "oo" korosu · >.72 alt oktav, hafif ışıltı ritmi
  //   doruk (gökyüzü dolu / yıldız hayvanı uyandı): ezgi iki oktavda, koro + yaylı + cam çan şelalesi
  const YARP = [[0, 1, 2, 3, 4, 5, 6], [0, 2, 1, 3, 2, 4, 3, 5], [0, 1, 2, 1, 3, 2, 4, 3], [1, 0, 2, 4, 3, 5, 4, 6]];
  function yildizCubuk(t, ak, bic, pi, d) {
    const S8 = 0.3, y = yoS, dr = yDoruk, hum = () => (rnd() - 0.5) * 0.01;
    const bar = pi * 2 + bic, oz = t - yOzelT < 16;
    const al = d.alan || 'patika';
    const v = y < 0.08 && !oz ? 3 : al === 'pofuduk' ? 1 : dongu % 4;     // 0 A cam · 1 B çelesta · 2 A üst oktav+çelesta · 3 C seyrek (başlangıçta hep seyrek)
    const bars = v === 1 ? TEMA.yildiz.B : v === 3 ? TEMA.yildiz.C : TEMA.yildiz.A, mel = bars[bar % 16] || [];
    const pOlasi = (0.4 + 0.6 * sm(0.05, 0.5, y)) * (al === 'goletKiyi' ? 0.8 : 1) + (dr > 0.5 ? 0.3 : 0);
    const ton4 = (taban, adet) => { const r = []; for (let m = taban; r.length < adet && m < taban + 48; m++) if (ak.ton.includes(m % 12)) r.push(m); return r; };
    oncelikli = true;   // ezgi atılmaz
    for (const [s, n, u] of mel) {
      const vurgu = s === 0 || u >= 3, ts = t + s * S8 + hum();
      if (!vurgu && rnd() > pOlasi) continue;
      const pan = cl((n - 86) * 0.05, -0.45, 0.45), vv = (0.036 + 0.014 * sm(0.05, 0.4, y)) * (vurgu ? 1.12 : 0.86);
      const dec = Math.min(4, 1.7 + u * 0.5);
      if (v === 1) {
        tus(n, ts, vv * 0.85, dec, pan, true, B.zil); cam(NOTE(n + 12), ts + 0.01, vv * 0.3, 1.8, -pan, null, false);
      } else {
        cam(NOTE(n), ts, vv, dec + (v === 3 ? 0.8 : 0), pan);
        if (v === 2) { tus(n + 12 < 100 ? n + 12 : n, ts + 0.012, vv * 0.4, 1.8, -pan, true, B.zil); }
        if (v === 0 && vurgu && y > 0.3) tus(n - 12, ts + 0.005, 0.016, 2.4, -pan, false);
      }
      if (dr > 0.35 && v !== 3) cam(NOTE(n + 12), ts + 0.015, vv * 0.28 * dr, 2.4, -pan * 0.7, null, false);
      if (y > 0.6 && vurgu && v !== 3) tus(n - 12, ts, 0.014 * sm(0.6, 0.9, y), 2.6, pan * -0.5, false);
    }
    oncelikli = false;
    // yıldız kıvılcımları: gökyüzü doldukça sıklaşan, akora uyan yüksek cam notalar
    const kn = Math.round(0.7 + 4.5 * y + 3 * dr + rnd() * 0.8);
    for (let i = 0; i < kn; i++) {
      const pc = ak.mel, cand = []; for (let m = 84; m <= 103; m++) if (pc.includes(m % 12)) cand.push(m);
      cam(NOTE(sec(cand)), t + 0.1 + rnd() * 2.1, 0.0085 + 0.007 * y, 1.2 + rnd() * 1.2, rnd() * 1.6 - 0.8, null, rnd() < 0.5);
    }
    // kristal kâseler: saf kuvars tınısı, gölün üstünde yavaşça yankılanan meditatif kâse rezonansı
    if (bic === 0) {
      kase(NOTE(ak.bas + 24), t, 0.03 * (0.8 + 0.4 * y), 5.4, -0.35 + (pi % 2) * 0.7, B.zil);
      if (y > 0.35 || oz) kase(NOTE(ak.bas + 31), t + 0.6, 0.02 * sm(0.35, 0.9, y), 4.8, 0.35, B.zil);
    }
    // su damlaları: gölün yüzeyi (akor sesleriyle)
    const dn = (al === 'goletKiyi' || al === 'yildizGol' ? 1 : 0) + (rnd() < 0.7 ? 1 : 0) + (y > 0.3 && rnd() < 0.6 ? 1 : 0) + (y > 0.7 && rnd() < 0.5 ? 1 : 0);
    for (let i = 0; i < dn; i++) { const cand = []; for (let m = 72; m <= 93; m++) if (ak.ton.includes(m % 12)) cand.push(m); damla(NOTE(sec(cand)), t + (1 + Math.floor(rnd() * 7)) * S8 + rnd() * 0.12, 0.028, rnd() * 1.4 - 0.7); }
    // harp: parıldayan pentatonik yıldız arpı (gece göğü ve su yansıması)
    if (y > 0.08) {
      const kac = 5 + Math.floor(y * 3), tn = ton4(ak.bas + 24 + ((dongu + bic) % 2 ? 12 : 0), 8), yol = sec(YARP);
      if (bic === 0) for (let i = 0; i < kac; i++) arp(tn[yol[i % yol.length] % tn.length], t + 0.05 + i * (0.2 - 0.08 * y), 0.038 * (0.6 + 0.5 * sm(0.08, 0.5, y)), -0.5 + i * 0.16, 2.4);
      if (y > 0.45 && bic === 1) { const t2 = ton4(ak.bas + 31, 8); for (let i = 0; i < 6; i++) arp(t2[(5 - i) % t2.length], t + 0.55 + i * 0.17, 0.028, 0.5 - i * 0.18, 1.9); }
      if (y > 0.75) { const t3 = ton4(ak.bas + 36, 8); for (let s = 0; s < 8; s++) if (s % 2 === 0 || rnd() < 0.6) arp(t3[[0, 2, 1, 3, 2, 4, 3, 5][s]], t + 1.1 + s * 0.15, 0.018 * sm(0.75, 1, y), (s - 3.5) * 0.12, 1.2); }
    }
    // Feza gece göğünde yükseldikçe göksel soprano çanları ve rüzgar arpları:
    if (yukseklikS > 0.24 || y > 0.28) {
      const sGuc = Math.max(sm(0.2, 0.8, yukseklikS), sm(0.25, 0.85, y));
      if (bic === 1 && rnd() < 0.8) {
        const wNotes = ton4(ak.bas + 36, 6);
        ruzgarArp(wNotes, t + 0.45, 0.024 * sGuc, -0.25, 0.15);
      }
      if (bic === 0 || bic === 1) {
        const sCand = [ak.bas + 48, ak.bas + 55, ak.bas + 60, ak.bas + 64].filter(m => ak.mel.includes(m % 12));
        if (sCand.length) sopranoCan(sec(sCand), t + 1.25 + (rnd() - 0.5) * 0.15, 0.018 * sGuc, (rnd() - 0.5) * 0.7);
      }
    }
    // "yıldız çağrısı": hedef yoksa müzik boş kalmasın – ilk yıldız yakındayken (uyanmamışken) tek seferlik yumuşak çelesta ipucu (uzun beklemede bir kez daha)
    if (yYerlesen === 0 && yildizOrani() === 0 && t - yCagriT > 30 && typeof NESNELER !== 'undefined' && typeof P !== 'undefined') {
      const o = NESNELER.find(n => n.tip === 'yildiz' && !n.done && Math.abs(n.x - P.x) < 700);
      if (o) { yCagriT = t; ton4(ak.bas + 36, 4).forEach((n, i) => { tus(n, t + 0.5 + i * 0.22, 0.034 - i * 0.004, 2.4, -0.3 + i * 0.2, true); if (i % 2) cam(NOTE(n + 12), t + 0.52 + i * 0.22, 0.014, 2, 0.4, null, false); }); }
    }
    // gökyüzü doldukça geniş akor katmanı: üç oktava yayılmış açık dizilim + sağ-sol cam çanlar (genişlik hissi)
    if (y > 0.5 && bic === 0) {
      const g = sm(0.5, 1, y), wide = [ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12, ak.pad[1] + 24];
      kabar(wide, t + 0.1, 1.6, 1.2, 1.9, 0.02 * g, null, true);
      [[-0.85, 0], [0.85, 1]].forEach(([pn, k]) => cam(NOTE(ak.pad[1 + k] + 24), t + 0.5 + k * 0.35, 0.016 * g, 3.4, pn));
    }
    // gökte yerleşen yıldızın perdesi: ölçünün ızgarasında iki kez yankılanır ("yıldız uyandı" dokunuşu müzikle senkron)
    while (yBekle.length) { const nb = yBekle.shift(); [1.2, 1.8].forEach((dt, k) => cam(NOTE(nb + (k ? 12 : 0)), t + dt, 0.03 * (k ? 0.6 : 1), 2.6, k ? 0.4 : -0.4)); }
    // alan ruh halleri (çok hafif): göl taşları – yukarı akan damla dizisi · Pofuduk kıyısı – hafif zıplayan nabız · kaplumbağa – derin sıcak kök
    if (al === 'yildizGol' && bic === 1) { const tt = ton4(ak.bas + 36, 5); tt.forEach((n, i) => damla(NOTE(n), t + 0.3 + i * 0.3, 0.02, -0.5 + i * 0.25)); }
    if (al === 'pofuduk') { bas(ak.bas + 12, t, 0.05, 'pizz'); bas(ak.bas + 19, t + 4 * S8, 0.04, 'pizz'); [2, 6].forEach(s2 => ak.pad.slice(2).forEach((n, i) => tus(n + 12, t + s2 * S8 + i * 0.012, 0.012, 0.5, (i - 1) * 0.3))); }
    if (al === 'hayvan' && bic === 0) { bas(ak.bas, t, 0.07, 'uzun', 2 * BAR); ton4(ak.bas + 12, 3).forEach((n, i) => arp(n, t + 0.4 + i * 0.5, 0.02, (i - 1) * 0.4, 3)); }
    // çelesta akoru (yavaş yukarı kırık)
    if (y > 0.3 && bic === 0) ak.pad.slice(1).map(n => n + 12).forEach((n, i) => tus(n, t + 0.08 + i * 0.11, 0.019 * sm(0.3, 0.6, y), 3, (i - 1.5) * 0.3, true));
    // bas: sakin, derin gece kökü; yıldız artınca yumuşak nabız
    const bv = 0.11;
    if (bic === 0) bas(ak.bas + 12, t, bv * 0.72, 'uzun', 2 * BAR);
    if (y > 0.12 && bic === 0) bas(ak.bas, t, bv * 0.5, 'uzun', 2 * BAR);   // derin gece bası
    if (y > 0.5) { bas(ak.bas + 12, t + 4 * S8, bv * 0.48, 'nabiz'); if (y > 0.7) bas(ak.bas + 19, t + 6 * S8, bv * 0.28, 'pizz'); }
    // ışıltı ritmi (çok hafif): tizde yumuşak "fş" vuruşları
    if (y > 0.72) for (let s = 0; s < 8; s += 2) gur(t + s * S8, 0.07, 'highpass', 6500, 9500, 0.8, 0.0035 * sm(0.72, 1, y) * (s % 4 ? 0.7 : 1.3), 0.08 * (s % 4 ? 1 : -1), 0, B.zil);
    // doruk / özel an (yıldız hayvanı): her akorda cam çan şelalesi
    if ((dr > 0.5 || oz) && bic === 0) {
      const tn = ton4(ak.bas + 36, 9);
      tn.forEach((n, i) => cam(NOTE(n), t + 0.12 + i * 0.085, 0.022 * Math.max(dr, 0.6), 2.8, -0.6 + i * 0.15, null, i > 5));
    }
  }

  // ── Bölüm 3 "Bulut Ülkesi": gün doğumu, ferah, uçan. koS (0..1) = renklenen kuzucuk oranı; katmanlar kuzucuk bulundukça açılır:
  //   0     : pad + yavaş harp arpejleri + Bulut Teması müzik kutusunda (A) / seyrek çanlar (C) dönüşümlü, uzak kuşlar
  //   ≥1    : flüt girer (A/B temaları flütte) · >.25 inen ikinci harp dalgası, yaylılar · >.4 çelesta akorları, alt bas
  //   >.55  : flüt karşı ezgisi (C çelesta turunda), bas nabzı, "oo" korosu · >.7 harp sekizlikleri, alt oktav çelesta · >.85 ışıltı ritmi
  //   gökkuşağı (gokkusagiBasla → gDoruk): ezgi iki oktavda + her akorda yedi renkli çan şelalesi (gökkuşağı gamı)
  const akTon = (ak, taban, adet, mel) => { const pc = mel ? ak.mel : ak.ton, r = []; for (let m = taban; r.length < adet && m < taban + 48; m++) if (pc.includes(m % 12)) r.push(m); return r; };
  const GOK7 = [67, 69, 71, 73, 74, 76, 78];   // G Lidyen gamı: kırmızı → mor (kuzucuk renkleri ve gökkuşağı parçaları bu sırayla yükselir)
  // İnci motifi: flüt sorar, sedef çelesta cevap verir; 16 ölçülük bir masal cümlesi.
  const DENIZ_MEL = [[71,74,76],[74,71,69],[69,71,74],[76,74,71],[71,74,78],[76,74,71],[74,71,69],[69,71,74],
    [71,76,78],[78,76,74],[74,71,69],[71,74,76],[76,78,81],[78,76,74],[74,71,69],[71,69,67]];
  const DENIZ_OYUN = [[74,78,81,78],[76,74,71,74],[71,74,78,76],[74,71,69,71],
    [76,78,81,83],[81,78,76,74],[74,76,78,71],[71,69,67,74]];
  // ── Uyuyan Yanardağ: “Dağın Nefesi” (6/8, noktalı dörtlük = 50) ──
  // Yeni bir beste: 32 ölçülük soru/cevap; Feza'nın üç–iki–bir'i F'ye taşınır, Pırıl'ın
  // altılı sıçrayışı C–A–G–F olarak geri gelir. Kalimba/ılık taş tınısı toprağı, flüt nefesi dağı taşır.
  const V_MEL = yaz(
    'A5:3 G5:1 F5:2 | r:2 C5:1 F5:1 G5:2 | E5:2 G5:1 A5:1 G5:2 | r:1 E5:2 D5:1 C5:2 |' +
    'A5:2 F5:2 E5:2 | D5:3 E5:1 F5:2 | B5:2 A5:1 G5:1 E5:2 | D5:4 r:2 |' +
    'C6:2 A6:3 G6:1 | F6:3 E6:1 D6:2 | E6:2 C6:2 A5:2 | G5:3 A5:1 C6:2 |' +
    'B5:3 A5:1 G5:2 | E5:2 G5:2 B5:2 | A5:2 G5:1 E5:1 D5:2 | C5:4 r:2 |' +
    'F5:2 A5:1 C6:1 D6:2 | C6:3 A5:1 F5:2 | E5:2 A5:2 B5:2 | C6:2 B5:1 A5:1 G5:2 |' +
    'D6:3 B5:1 G5:2 | A5:2 G5:2 E5:2 | G5:3 A5:1 B5:2 | C6:4 r:2 |' +
    'C6:2 A6:3 G6:1 | F6:2 E6:1 D6:1 C6:2 | B5:2 D6:2 G6:2 | E6:3 D6:1 C6:2 |' +
    'A5:3 G5:1 F5:2 | G5:2 B5:1 C6:1 D6:2 | C6:2 B5:1 G5:1 A5:2 | F5:6');
  const V_SAL_MEL = yaz(
    'r:2 F5:2 A5:2 | C6:3 A5:1 G5:2 | E5:2 G5:2 C6:2 | B5:2 A5:2 G5:2 |' +
    'A5:1 C6:1 D6:2 F6:2 | E6:2 C6:1 B5:1 A5:2 | B5:1 D6:1 E6:2 G6:2 | E6:3 D6:1 C6:2 |' +
    'C6:2 A6:3 G6:1 | F6:2 E6:1 D6:1 C6:2 | D6:2 F6:2 A6:2 | G6:2 E6:1 D6:1 B5:2 |' +
    'A5:1 C6:1 F6:2 E6:2 | G6:1 E6:1 C6:2 B5:2 | A5:1 B5:1 C6:1 E6:1 G6:2 | D6:2 B5:1 A5:1 G5:2 |' +
    'F6:3 E6:1 D6:2 | E6:2 C6:1 A5:1 G5:2 | B5:2 G6:3 E6:1 | D6:2 E6:1 G6:1 C7:2 |' +
    'C6:2 A6:3 G6:1 | G6:2 B6:2 A6:2 | E6:2 G6:1 A6:1 C7:2 | B6:3 G6:1 E6:2 |' +
    'C6:2 A5:2 G5:2 | B5:2 A5:1 G5:1 E5:2 | G5:2 E5:1 D5:1 C5:2 | F5:6');
  const V_KALP_MEL = yaz(
    'C6:3 B5:1 A5:2 | G5:2 E5:2 C5:2 | A5:3 F5:1 E5:2 | C6:2 B5:2 A5:2 |' +
    'C6:2 A6:3 G6:1 | F6:2 D6:2 C6:2 | B5:2 D6:1 E6:1 G6:2 | F6:6 |' +
    'A5:3 G5:1 F5:2 | E5:2 G5:2 C6:2 | D6:2 C6:1 A5:1 F5:2 | E6:3 C6:1 A5:2 |' +
    'G5:2 C6:2 F6:2 | E6:2 D6:1 B5:1 G5:2 | E6:3 D6:1 C6:2 | F5:6');
  // Aynı temanın kısa düzenlemesi: tempo hızlandırılmaz, müzikal cümleler yeni yolculuğa seçilir.
  const V_SAL_CUE = [0,1,4,5,8,9,20,21,22,23,24,25,26,27];
  function korTasi(n, t, vol, pan, hedef, uzun) {
    // El yapımı çelik dil tamburunun yuvarlak, tok sesi; keskin metalik çınlama/sert vuruş yok.
    const dec = uzun ? 1.65 : 1.05;
    if (!yerVar(3, t, t + dec, false, 1)) return;
    ek(t + .38); ek(t + .18);
    const f = NOTE(n), out = zarf(t, .007, vol, dec, panla(hedef || B.tus, pan));
    const low = suzgec('lowpass', Math.min(4300, f * 4.2), .45, out);
    osc('sine', f, t, t + dec + .05, low);
    osc('sine', f * 2.005, t, t + .42, zarf(t, .005, .19, .35, low));
    osc('sine', f * 3.99, t, t + .22, zarf(t, .004, .035, .16, low));
    if (uzun) out.connect(revSfx);
  }
  function volkanEzgi(phrase, t, bar, guc, renk) {
    oncelikli = true;
    try {
      for (const [s, n, u] of phrase || []) {
        const ts = t + s * .4 + .025, pan = Math.sin((bar + s * .4) * .7) * .2;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        // Flüt ile dokunulan taşın farklı cümleleri birbirine cevap verir; aynı notayı her çalgıda çoğaltmaz.
        if (renk === 'tas') korTasi(n - 12, ts, .045 * guc, pan, B.tus, u >= 3);
        else flut(n, ts, Math.max(.15, u * .4 * .9), .032 * guc, pan, B.flut, false);
        if (u >= 3 && n < 96) tus(n + (renk === 'tas' ? 0 : 12), ts + .04, .009 * guc, 1.8, -pan, true, B.zil);
      }
    } finally { oncelikli = false; }
  }
  function volkanEsleme(t, ak, bar, guc, tam) {
    const ns = akTon(ak, 53, 8), yol = bar % 2 ? [0, 3, 2, 5, 3, 1] : [0, 2, 4, 1, 3, 5];
    for (let s = 0; s < 6; s++) {
      if (!tam && s % 3 === 1) continue;
      arp(ns[yol[s]], t + s * .4 + .012, (s % 3 === 0 ? .027 : .017) * guc, (yol[s] - 2.5) * .12, 1.3);
    }
    bas(ak.bas + 12, t, .055 * guc, 'uzun', BAR * .86);
    // 6/8 salınımın ikinci büyük vuruşu: çok yumuşak, melodik bir sıcak taş; davul patlaması yok.
    if (tam) korTasi(ns[2] - 12, t + 1.2, .021 * guc, -.12, B.tus, false);
  }
  function volkanCubuk(t, ak, bic, pi) {
    const bar = pi * 2 + bic, alan = volkanAlani();
    const guc = .82 + vIsik * .18, kalp = progAd === 'volkanKalp';
    const phrase = kalp ? V_KALP_MEL[bar % 16] : V_MEL[bar % 32];
    const renk = alan === 'buhar' || (dongu % 2 === 0 && bar % 8 >= 4) ? 'nefes' : 'tas';
    volkanEzgi(phrase, t, bar, guc, renk);
    volkanEsleme(t, ak, bar, guc * (kalp ? .9 : 1), vBahce > 0 || kalp);
    // İkinci turda sorunun ardına tek bir cevap: tekrar yerine küçük, nefes alan bir varyasyon.
    if (dongu % 2 && bar % 4 === 3) {
      const ns = akTon(ak, 77, 5, true);
      tus(ns[3], t + 1.65, .014, 1.8, .25, true, B.zil);
      korTasi(ns[1] - 12, t + 2.05, .02, -.25, B.tus, true);
    }
    if ((kalp || vBahce >= 2) && bar % 4 === 2) {
      const ns = akTon(ak, 86, 5, true);
      sopranoCan(ns[2], t + 1.7, .01, .3);
    }
  }
  function lavsalCubuk(t, ak, pi) {
    const b = pi % V_SAL_CUE.length, giris = b < 2, yuksel = b >= 2 && b < 6, zirve = b >= 6 && b < 10, inis = b >= 10;
    const guc = giris ? .78 + b * .04 : inis ? .84 : zirve ? 1.04 : .94;
    volkanEzgi(V_SAL_MEL[V_SAL_CUE[b]], t, b, guc, giris || inis ? 'tas' : 'nefes');
    volkanEsleme(t, ak, b, guc, !giris && !inis);
    if (yuksel || zirve) {
      const ns = akTon(ak, 65, 7);
      for (let s = 0; s < 6; s++) if (s % 3 !== 0) arp(ns[(s + b) % 7], t + s * .4 + .2, .014 * guc, (s - 2.5) * .13, 1.05);
      if (b % 2 === 1) tus(ns[3], t + .82, .017, 1.5, -.25, true, B.zil);
    }
    if ((b === 3 || b === 5 || b === 9) && !inis) {
      const ns = akTon(ak, 76, 6, true);
      ns.forEach((n, i) => arp(n, t + 1.35 + i * .11, .02, -.4 + i * .16, 1.6));
    }
    // Kemerlerin üstünde çok seyrek göksel ışık; ince gürültü/perküsyon katmanı eklenmez.
    if ((b >= 4 && b < 6) || zirve) {
      const ns = akTon(ak, 89, 4, true); sopranoCan(ns[b % 4], t + 1.7, zirve ? .013 : .009, b % 2 ? .3 : -.3);
    }
  }
  function volkanFinalCubuk(t, ak, pi) {
    // Altın çiçeğin yavaş açılışı → Pırıl'ın teması → sıcak son akor; ormanın polkası burada kullanılmaz.
    const b = pi % 18, doruk = b >= 8 && b < 16;
    const phrase = b < 8 ? V_KALP_MEL[b] : b < 16 ? V_MEL[24 + b - 8] : b === 16 ? [[0, 81, 3], [3, 79, 1], [4, 77, 2]] : [[0, 77, 6]];
    volkanEzgi(phrase, t, b, doruk ? 1.06 : .88, doruk ? 'nefes' : 'tas');
    volkanEsleme(t, ak, b, doruk ? 1 : .8, doruk);
    if (doruk) {
      const ns = akTon(ak, 65, 8);
      [1, 2, 4, 5].forEach((s, i) => arp(ns[(i * 2 + b) % ns.length], t + s * .4 + .2, .017, (i - 1.5) * .17, 1.6));
      if (b % 2 === 0) sopranoCan(akorTonu(ak, 93), t + 1.6, .012, .25);
    }
  }

  // ── Bölüm 6 "Şenlik Kalesi": “Fener Dansı” (12/8, sekizlik 0.2 sn; ölçüde dört hoplayan vuruş) ──
  // Feza'nın üç–iki–biri (B–A–G) ilk ölçüde, Pırıl'ın altılı sıçrayışı (D–B) ikincide; 11–12. ölçüde ♭VII (F) masal ışığı.
  const S6 = 0.2;
  const S_MEL = yaz(
    'D5:2 G5:1 B5:2 A5:1 G5:3 D5:3 | G5:2 A5:1 B5:2 C6:1 D6:6 | E6:2 D6:1 C6:2 B5:1 C6:3 G5:3 | A5:2 B5:1 C6:2 D6:1 E6:6 |' +
    'G6:2 E6:1 B5:2 E6:1 D6:3 B5:3 | G5:2 A5:1 B5:2 D6:1 E6:6 | F#6:2 E6:1 D6:2 A5:1 D6:3 F#5:3 | A5:2 B5:1 A5:2 F#5:1 A5:3 r:3 |' +
    'D5:2 G5:1 B5:2 A5:1 G5:3 D5:3 | G5:2 B5:1 D6:2 E6:1 D6:6 | C6:2 A5:1 F5:2 A5:1 C6:3 F6:3 | D6:2 C6:1 A5:2 G5:1 A5:6 |' +
    'G5:2 C6:1 E6:2 D6:1 C6:3 E6:3 | G6:2 E6:1 D6:2 C6:1 D6:6 | F#6:2 E6:1 D6:2 E6:1 F#6:3 A6:3 | A6:2 F#6:1 E6:2 F#6:1 D6:6');
  // halka yolculuğu: koşan, süzülen kaval cümlesi (akor her ölçüde)
  const S_HALKA_MEL = yaz(
    'G5:1 B5:1 D6:1 G6:2 D6:1 B5:2 D6:1 G6:3 | E6:1 G6:1 E6:1 C6:2 E6:1 D6:2 C6:1 G5:3 | F#6:1 A6:1 F#6:1 D6:2 F#6:1 E6:2 D6:1 A5:3 | B5:1 D6:1 G6:1 B6:3 A6:2 G6:1 D6:3 |' +
    'E6:1 G6:1 B6:1 G6:2 E6:1 B5:2 E6:1 G6:3 | G6:2 E6:1 C6:2 E6:1 G6:3 E6:3 | A6:2 G6:1 F6:2 C6:1 F6:3 A6:3 | F#6:2 E6:1 D6:2 E6:1 F#6:3 A5:3');
  // B: süzülen çelesta cümlesi (Em C G D Em C Am D) · C: geniş köprü (F C G D F C Em D), A'ya bağlanır
  const S_HALKA_B = yaz(
    'B5:3 E6:3 G6:4 E6:2 | D6:3 C6:3 E6:4 G5:2 | B5:3 D6:3 G6:6 | F#6:3 E6:3 D6:4 A5:2 |' +
    'G6:3 B6:3 A6:4 G6:2 | E6:3 G6:3 E6:4 D6:2 | C6:3 E6:3 A6:4 G6:2 | F#6:4 E6:2 D6:6');
  const S_HALKA_C = yaz(
    'A5:3 C6:3 F6:6 | E6:3 D6:3 C6:4 G5:2 | B5:3 D6:3 G6:6 | A6:3 F#6:3 D6:4 E6:2 |' +
    'C6:3 F6:3 A6:6 | G6:3 E6:3 D6:4 C6:2 | B5:2 E6:2 G6:2 B6:3 G6:3 | A6:3 F#6:3 E6:2 D6:2 A5:2');
  // büyük final koşusu (G C Am D Em C F D): her sekizlikte koşan kaval, ölçü sonunda yukarı atılan uzun nota
  const S_KOSU_MEL = yaz(
    'G5:1 B5:1 D6:1 G6:1 D6:1 B5:1 D6:1 G6:1 B6:1 A6:3 | G6:1 E6:1 C6:1 E6:1 G6:1 C7:1 G6:2 E6:1 C6:3 |' +
    'A6:1 E6:1 C6:1 E6:1 A6:1 C7:1 B6:2 A6:1 E6:3 | F#6:1 A6:1 B6:1 A6:1 F#6:1 D6:1 E6:2 F#6:1 A6:3 |' +
    'E6:1 G6:1 B6:1 G6:1 E6:1 B5:1 D6:2 E6:1 G6:3 | C6:1 E6:1 G6:1 E6:1 C6:1 G5:1 A5:2 C6:1 E6:3 |' +
    'F6:1 A6:1 G6:1 F6:1 C6:1 A5:1 D6:2 F6:1 A6:3 | A6:2 F#6:1 E6:2 D6:1 A6:3 B6:3');
  const S_SON_MEL = yaz('B5:2 D6:1 G6:3 D6:2 B5:1 D6:3 | G6:12');
  const s6Hum = () => (rnd() - 0.5) * 0.008;
  // yumuşak oyuncak boru (şövalye fanfarı, finalde uzak boru akorları): iki hafif ayrık testere + sinüs, kapalı süzgeç
  function boru(n, t, dur, vol, pan, hedef) {
    if (!yerVar(3, t, t + dur + 0.45, true)) return;
    const f = NOTE(n), g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
    g.gain.setTargetAtTime(vol * 0.75, t + 0.07, 0.2); g.gain.setTargetAtTime(0.0001, t + dur, 0.07);
    g.connect(panla(hedef || sfxG, pan)); if (revSfx) g.connect(revSfx);
    const lp = suzgec('lowpass', f * 1.2, 0.7, g);
    lp.frequency.setValueAtTime(f * 1.2, t); lp.frequency.exponentialRampToValueAtTime(Math.min(5000, f * 3.2), t + 0.05); lp.frequency.setTargetAtTime(Math.min(3500, f * 2), t + 0.08, 0.25);
    osc('sawtooth', f, t, t + dur + 0.45, kazanc(0.5, lp), -5); osc('sawtooth', f, t, t + dur + 0.45, kazanc(0.5, lp), 5);
    osc('sine', f, t, t + dur + 0.45, kazanc(0.6, g));
  }
  // yumuşak tef: kadife "dum" (deri) + çok kısık zil şıkırtısı – sert vuruş yok
  function tef(t, dum, sik, pan, hedef) {
    hedef = hedef || B.hop;
    if (dum > 0) { ton(t, 'sine', 150, 84, 0.24, 0.034 * dum, 0.005, pan, 0, hedef); ton(t, 'triangle', 260, 170, 0.06, 0.006 * dum, 0.003, pan, 0, hedef); }
    if (sik > 0) gur(t, 0.11, 'highpass', 7200, 7200, 0.7, 0.0042 * sik, 0.004, pan, 0, hedef);
  }
  // midilli toynağı: minik tahta "tık-tok" (uzakta, çok kısık)
  function toynak(t, v, pan, hedef) {
    hedef = hedef || B.zil;
    ton(t, 'sine', 1150, 820, 0.045, 0.011 * v, 0.002, pan, 0, hedef);
    ton(t + 0.13, 'sine', 950, 700, 0.045, 0.009 * v, 0.002, pan, 0, hedef);
  }
  // ışık fişeği: uzaktan yükselen incecik "fiyuu", yumuşak "püf", akordan dökülen "pırıl" çanlar (korkutmaz: patlama yok)
  function havaiFisek(t, guc, pan, hedef, ham) {
    hedef = hedef || sahneG; ham = ham || sahneHam;
    const ak = akorAt(t + 0.6), ns = akTon(ak, 84, 8, true), y = 0.55 + rnd() * 0.15;
    ton(t, 'sine', 560 + rnd() * 80, 1250 + rnd() * 200, y, 0.0032 * guc, y * 0.6, pan, 1, hedef);
    gur(t + y, 0.5, 'lowpass', 900, 240, 0.7, 0.011 * guc, 0.03, pan, 1, ham);
    for (let i = 0; i < 7; i++) {
      const n = ns[(7 - i + (rnd() * 2 | 0)) % ns.length];
      cam(NOTE(n), t + y + 0.05 + i * 0.075 + rnd() * 0.05, 0.0085 * guc * (1 - i * 0.07), 1.3 + rnd() * 0.5, cl(pan + (rnd() - 0.5) * 0.6, -0.8, 0.8), hedef, i < 2);
    }
    gur(t + y + 0.05, 0.9, 'highpass', 6000, 9000, 0.7, 0.0032 * guc, 0.05, pan, 2, ham);
  }
  // ezgi: renk = 'kutu' (müzik kutusu, kasaba uyurken) · 'kaval' (flüt) · 'celesta'
  function s6Ezgi(mel, t, bar, guc, renk, f) {
    oncelikli = true;
    try {
      for (const [s, n, u] of mel || []) {
        const ts = t + s * S6 + 0.02 + s6Hum(), vurgu = s === 0 || u >= 3;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        if (f < 0.1 && !vurgu && rnd() < 0.3) continue;   // kasaba uyurken süs notaları seyrek
        const pan = cl((n - 81) * 0.04, -0.35, 0.35), dur = u * S6;
        if (renk === 'kutu') {
          zil(NOTE(n), ts, 0.046 * guc, Math.min(2.4, 0.9 + u * 0.22), pan);
          if (vurgu) arp(n - 12, ts + 0.01, 0.02 * guc, -pan, 1.6);
        } else if (renk === 'kaval') {
          flut(n, ts, dur * 0.92, 0.034 * guc, pan);
          if (vurgu) arp(n - 12, ts + 0.008, 0.019 * guc, -pan, 1.5);
          if (u >= 6 && f > 0.45) zil(NOTE(n + 12), ts + 0.01, 0.011, 1.6, -pan, null, false);
        } else {
          tus(n, ts, 0.042 * guc, 1.3 + u * 0.18, pan, true, B.zil);
          if (u >= 3) zil(NOTE(n + 12), ts + 0.01, 0.012 * guc, 1.5, -pan, null, false);
        }
        // kasaba canlandıkça: uzun notalarda kaval / çelesta bir üçlü aşağıdan karşı ses
        if (f > 0.7 && u >= 3 && renk !== 'kaval') flut(melTonu(akorAt(ts), n - 4), ts + 0.03, dur * 0.9, 0.017, -pan);
        if (f > 0.7 && u >= 6 && renk === 'kaval') tus(melTonu(akorAt(ts), n - 3), ts + 0.03, 0.016, 2.2, -pan, true, B.tus);
      }
    } finally { oncelikli = false; }
  }
  // eşlik: 12/8 arp akışı, pizz bas, tef, çelesta akorları, toynak, ışık tozu. hiz: 0 kasaba · 1 halka / final dansı
  function s6Esleme(t, ak, bar, f, hiz, guc) {
    guc = guc || 1;
    const tn = akTon(ak, ak.bas + 24, 7), yol = bar % 2 ? [0, 2, 4, 1, 3, 5, 2, 4, 6, 1, 3, 5] : [0, 2, 4, 2, 4, 6, 1, 3, 5, 0, 4, 2];
    const akis = hiz ? 1 : sm(0.12, 0.35, f);
    for (let s = 0; s < 12; s++) {
      const bas0 = s % 3 === 0;
      if (!bas0 && rnd() > akis) continue;
      arp(tn[yol[s]], t + s * S6 + 0.012 + s6Hum(), (bas0 ? 0.024 : 0.014) * guc * (hiz ? 1 : 0.85 + 0.15 * f), (yol[s] - 3) * 0.12, bas0 ? 1.4 : 0.9);
    }
    // bas: kasaba uyurken uzun sıcak kök; fener yandıkça hoplayan pizz (1. ve 3. vuruş)
    if (f < 0.12 && !hiz) { if (bar % 2 === 0) bas(ak.bas + 12, t, 0.06, 'uzun', 2 * BAR * 0.9); }
    else {
      bas(ak.bas + 12, t + 0.01, 0.055 * guc, 'pizz'); bas(ak.bas + 19, t + 6 * S6 + 0.01, 0.038 * guc, 'pizz');
      if (hiz || f > 0.6) { bas(ak.bas + 12, t + 3 * S6, 0.022 * guc, 'pizz'); bas(ak.bas + 12, t + 9 * S6, 0.022 * guc, 'pizz'); }
    }
    // tef: kasaba yarı uyanınca (≈5 fener) girer; dum 1. ve 3. vuruşta, şıkırtı ara vuruşlarda
    const tg = hiz ? 1 : sm(0.33, 0.6, f);
    if (tg > 0.02) {
      tef(t, tg * guc, 0, -0.1); tef(t + 6 * S6, 0.6 * tg * guc, 0, 0.1);
      tef(t + 3 * S6, 0, tg * guc, 0.25); tef(t + 9 * S6, 0, tg * guc, -0.25);
      if (hiz) { tef(t + 5 * S6, 0, 0.5 * guc, 0.3); tef(t + 11 * S6, 0, 0.5 * guc, -0.3); }
    }
    // çelesta akor "hop"ları (2. ve 4. vuruş): kasaba canlanınca
    if (f > 0.5 || hiz) [3, 9].forEach(s => ak.pad.slice(1, 4).forEach((n, i) => tus(n + 12, t + s * S6 + i * 0.012, 0.011 * guc * (hiz ? 1 : sm(0.5, 0.8, f)), 0.5, (i - 1) * 0.3, true, B.tus)));
    // uyanık midilliler uzakta tıpırdar (iki ölçüde bir, kısık)
    const md = s6MidilliSay();
    if (md > 0 && bar % 2 === 1) toynak(t + 7 * S6, cl(0.45 + md * 0.11, 0, 1), bar % 4 === 1 ? -0.45 : 0.45);
    // havada ışık tozu: seyrek, yüksek cam notalar (fener yandıkça sıklaşır)
    const kn = Math.round(0.3 + 1.6 * f + rnd() * 0.7);
    if (kn > 0) { const c = akTon(ak, 86, 7, true); for (let i = 0; i < kn; i++) cam(NOTE(sec(c)), t + 0.1 + rnd() * 2.1, 0.006 + 0.004 * f, 1.2 + rnd(), rnd() * 1.4 - 0.7, null, rnd() < 0.5); }
    // tüm fenerler yanınca: göksel soprano çan (iki ölçüde bir)
    if (f > 0.8 && bar % 2 === 0) sopranoCan(akTon(ak, 88, 4, true)[bar % 4 === 0 ? 1 : 2], t + 6 * S6, 0.011 * guc, bar % 4 ? -0.3 : 0.3);
  }
  function kaleCubuk(t, ak, bic, pi) {
    const f = s6S, bar = pi * 2 + bic;
    const renk = f < 0.2 ? 'kutu' : dongu % 2 ? 'celesta' : bar % 16 < 8 || f > 0.5 ? 'kaval' : 'kutu';
    s6Ezgi(S_MEL[bar % 16], t, bar, 0.86 + 0.14 * f, renk, f);
    s6Esleme(t, ak, bar, f, 0, 1);
    if (s6Tanit) { const a = s6Tanit; s6Tanit = 0; s6TanitCal(t, ak, a); }
  }
  // fener yeni bir katmanı açınca o ölçüde katman kendini kısa bir süsle tanıtır ("kasaba uyanıyor")
  function s6TanitCal(t, ak, a) {
    if (a === 1) {   // arp akışı + pizz bas: yukarı harp süpürmesi, 4. vuruşta basın tırmanışı
      akTon(ak, ak.bas + 24, 10).forEach((n, i) => arp(n, t + 0.02 + i * 0.07, 0.016 + i * 0.001, -0.5 + i * 0.1, 1.5));
      [0, 2, 4].forEach((d, i) => bas(akTon(ak, ak.bas + 12, 3)[i], t + (9 + i) * S6, 0.04, 'pizz'));
    } else if (a === 2) {   // tef: ölçü sonunda yumuşak tef çağrısı
      for (let i = 0; i < 5; i++) tef(t + (7 + i) * S6, i === 4 ? 0.8 : 0, 0.5 + i * 0.12, i % 2 ? 0.3 : -0.3);
      toynak(t + 6 * S6, 0.9, -0.4);
    } else if (a === 3) {   // çelesta: Feza'nın üç–iki–biri, kasabanın pencerelerinden cevap gibi
      akTon(ak, 79, 3, true).reverse().forEach((n, i) => tus(n, t + (6 + i * 2) * S6 + 0.02, 0.026 - i * 0.003, 1.6, 0.3 - i * 0.2, true, B.zil));
    } else if (a === 4) {   // koro + soprano: yumuşak "aa" kabarışı ve göksel çan
      kabar(ak.pad.map(n => n + 12), t + 0.05, 1.1, 0.6, 1.6, 0.01, B.tel, false);
      sopranoCan(akTon(ak, 88, 3, true)[1], t + 6 * S6, 0.013, -0.3);
    } else {   // hepsi yandı: oyuncak boru fanfarı + çan kulesi
      [[0, 0.12], [0.16, 0.12], [0.32, 0.7]].forEach(([d, u], j) => { const n = j === 2 ? akorTonu(ak, 74) : akorTonu(ak, 67); boru(n, t + 6 * S6 + d, u, 0.01, -0.3, B.tus); boru(akorTonu(ak, n - 4), t + 6 * S6 + d + 0.005, u, 0.007, 0.3, B.tus); });
      canKulesi(t + 0.05, ak, 6, 0.016, 0.45, 0.24);
    }
  }
  // midilli toynağı (tek vuruş): yumuşak tahta "tık" + kadife gövde (tef otobüsünde, sert değil)
  // oyunun kamerası (oyun.js 'cam'; burada 'cam' cam çan çalgısının adı olduğu için genel kapsamdan okunur)
  let camOku = null;
  function camKonum() {
    if (camOku === null) { try { camOku = Function('return typeof cam !== "undefined" && cam && typeof cam.x === "number" ? { x: cam.x, y: cam.y, w: typeof VW === "number" ? VW : 1280, h: typeof VH === "number" ? VH : 720 } : null'); } catch (e) { camOku = () => null; } }
    try { return camOku(); } catch (e) { return null; }
  }
  function toynakTek(t, v, pan) {
    ton(t, 'sine', 980 + rnd() * 60, 700, 0.04, 0.0075 * v, 0.002, pan, 0, B.hop);
    ton(t, 'sine', 190, 120, 0.07, 0.012 * v, 0.003, pan, 0, B.hop);
  }
  // dörtnala: her vuruşa iki toynak ("tı-kı-DUM"); hafif: yalnız 2. ve 4. vuruş (yarım zaman), tam: dört vuruş (çift zaman)
  function dortnala(t, v, tam, pan) {
    for (let b = 0; b < 4; b++) {
      if (!tam && b % 2 === 0) continue;
      const s0 = b * 3;
      toynakTek(t + (s0 + 1) * S6 + s6Hum(), 0.55 * v, pan + 0.15);
      toynakTek(t + (s0 + 2) * S6 + s6Hum(), 0.75 * v, pan - 0.15);
    }
  }
  // yumuşak alkış şıkırtısı: üç minik süzgeçli gürültü (kalabalık, uzak); kesik ve kısık
  function alkis(t, v, pan) {
    for (let i = 0; i < 3; i++) gur(t + i * 0.012 + rnd() * 0.008, 0.07, 'bandpass', 1400 + rnd() * 900, 0, 1.2, 0.0032 * v, 0.002, cl(pan + (rnd() - 0.5) * 0.7, -0.8, 0.8), 0, B.hop);
  }
  // çan kulesi: kasabanın çanları akordan aşağı iner (uzak, geniş)
  function canKulesi(t, ak, adet, vol, pan, ara) {
    const ns = akTon(ak, 67, adet, true).reverse();
    ns.forEach((n, i) => zil(NOTE(n), t + i * (ara || 0.27), vol * (1 - i * 0.05), 2.6, cl(pan + (i % 2 ? 0.25 : -0.25), -0.8, 0.8), null, i === 0));
    zil(NOTE(ns[ns.length - 1] - 12), t + ns.length * (ara || 0.27), vol * 0.8, 3, pan, null, false);
  }
  // halka yolculuğu (32 ölçü): A kaval · B çelesta (süzülme) · A' kaval + üstte çelesta yankısı · C köprü (kaval + çelesta oktav)
  function halkaCubuk(t, ak, pi) {
    const gir = cl((zaman() - s6MiniT0) / 4, 0.55, 1), bar = pi, bol = (pi >> 3) & 3, k = pi & 7;
    const mel = bol === 1 ? S_HALKA_B[k] : bol === 3 ? S_HALKA_C[k] : S_HALKA_MEL[k];
    oncelikli = true;
    try {
      for (const [s, n, u] of mel || []) {
        const ts = t + s * S6 + 0.02 + s6Hum(), pan = cl((n - 86) * 0.04, -0.35, 0.35), dur = u * S6;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        if (bol === 1) {   // B: çelesta önde, uzun notada müzik kutusu ışıltısı; kaval alttan tutar
          tus(n, ts, 0.04, 1.4 + u * 0.15, pan, true, B.zil);
          if (u >= 4) zil(NOTE(n + 12), ts + 0.01, 0.011 * gir, 1.8, -pan, null, false);
          if (s === 0) flut(melTonu(akorAt(ts), n - 5), ts + 0.03, BAR * 0.85, 0.017, -pan);
        } else if (bol === 3) {   // C: geniş köprü, kaval + çelesta bir oktav üstte
          flut(n, ts, dur * 0.92, 0.032, pan);
          if (u >= 2) tus(n + 12, ts + 0.006, 0.018, 1.4, -pan, true, B.zil);
        } else {
          flut(n, ts, u * S6 * 0.9, 0.033 * (s === 0 || u >= 2 ? 1.05 : 0.9), pan);
          if (u >= 2) tus(n - 12, ts + 0.008, 0.017, 1.1, -pan, true);
          if (u >= 3) zil(NOTE(n + 12), ts + 0.012, 0.01 * gir, 1.4, -pan, null, false);
          if (bol === 2 && u >= 2) tus(n + 12, ts + 0.3, 0.013, 1.2, pan * 0.5, true, B.zil);   // A': yankı gibi çelesta cevabı
        }
      }
    } finally { oncelikli = false; }
    if (bol === 1) {   // B: geniş arp (yarım ölçüde altı nota yukarı), uzun bas, yalnız 4. vuruşta toynak
      const tn = akTon(ak, ak.bas + 24, 7);
      for (let s = 0; s < 12; s++) arp(tn[s % 6 + (s >= 6 ? 1 : 0)], t + s * S6 + 0.012 + s6Hum(), (s % 6 === 0 ? 0.022 : 0.013) * gir, ((s % 6) - 2.5) * 0.14, 1.6);
      bas(ak.bas + 12, t, 0.055, 'uzun', BAR * 0.92);
      toynakTek(t + 10 * S6, 0.5 * gir, 0.3); toynakTek(t + 11 * S6, 0.65 * gir, -0.3);
      tef(t + 9 * S6, 0, 0.6 * gir, -0.25);
    } else {
      s6Esleme(t, ak, bar, Math.max(s6S, 0.72), 0, gir * (bol === 3 && k < 4 ? 0.9 : 1));   // yarım zaman: koşu gelince çift zamana geçer
      dortnala(t, gir, false, 0);
      if (bol === 3 && k >= 6) for (let i = 0; i < 4; i++) tef(t + (8 + i) * S6, 0, (0.4 + i * 0.15) * gir, (i % 2 ? 0.3 : -0.3));   // köprü sonu: tef çağırır
      if (bol === 3 && k % 2 === 0) [ak.bas + 24, akorTonu(ak, ak.bas + 28)].forEach((n, i) => boru(n, t + 0.02, BAR * 1.6, 0.007, (i - 0.5) * 0.4, B.tus));
    }
    if (pi % 4 === 3) akTon(ak, ak.bas + 36, 7, true).forEach((n, i) => cam(NOTE(n), t + 1.4 + i * 0.09, 0.012 + i * 0.001, 1.6, -0.6 + i * 0.2, null, i > 4));
    if (bol === 2 && k % 2 === 0) sopranoCan(akTon(ak, 88, 3, true)[k % 4 ? 2 : 1], t + 0.03, 0.009, k % 4 ? 0.3 : -0.3);
  }
  // büyük final koşusu ('halkaHiz'): çift zaman — her vuruşta bas ve tef, dörtnala toynaklar, yükselen arp kaskadları, parlak çanlar.
  // 'halkaFinalSicrama'dan sonra: tutulmuş, havada asılı ölçüler (yalnız pad + inen ışıltı), iniş kale temasına bağlanır.
  function halkaKosuCubuk(t, ak, pi) {
    if (s6SicT > -1e8 && t > s6SicT - 0.1) {
      if (t - s6SicT > 1.2) akTon(ak, 84, 6, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.3 + i * 0.32, 0.007, 1.8, -0.5 + i * 0.2, null, i < 2));
      return;
    }
    const k = pi & 7, gir = cl((zaman() - s6HizT) / 3, 0.75, 1);
    oncelikli = true;
    try {
      for (const [s, n, u] of S_KOSU_MEL[k] || []) {
        const ts = t + s * S6 + 0.015 + s6Hum(), pan = cl((n - 86) * 0.04, -0.35, 0.35);
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        flut(n, ts, u * S6 * 0.88, 0.031 * (s === 0 || u >= 2 ? 1.05 : 0.88), pan);
        if (u >= 2) tus(n - 12, ts + 0.006, 0.018, 1.1, -pan, true);
        if (u >= 3) { zil(NOTE(n + 12), ts + 0.01, 0.012, 1.5, -pan, null, false); tus(melTonu(akorAt(ts), n - 4), ts + 0.02, 0.014, 1.2, pan, true, B.zil); }
      }
    } finally { oncelikli = false; }
    // arp akışı + bas her vuruşta (çift zaman) + tef: dum her vuruşta, şıkırtı ara sekizliklerde
    const tn = akTon(ak, ak.bas + 24, 7), yol = k % 2 ? [0, 2, 4, 1, 3, 5, 2, 4, 6, 1, 3, 5] : [0, 2, 4, 2, 4, 6, 1, 3, 5, 0, 4, 2];
    for (let s = 0; s < 12; s++) arp(tn[yol[s]], t + s * S6 + 0.012 + s6Hum(), (s % 3 === 0 ? 0.024 : 0.015) * gir, (yol[s] - 3) * 0.12, s % 3 === 0 ? 1.3 : 0.8);
    for (let b = 0; b < 4; b++) {
      bas(ak.bas + (b % 2 ? 19 : 12), t + b * 3 * S6 + 0.01, (b % 2 ? 0.04 : 0.055) * gir, 'pizz');
      tef(t + b * 3 * S6, (b % 2 ? 0.55 : 0.85) * gir, 0, b % 2 ? 0.1 : -0.1);
      tef(t + (b * 3 + 2) * S6, 0, 0.55 * gir, b % 2 ? -0.3 : 0.3);
    }
    dortnala(t, 1.1 * gir, true, 0);
    // çelesta akor "hop"ları her vuruşta
    [0, 3, 6, 9].forEach(s => ak.pad.slice(1, 4).forEach((n, i) => tus(n + 12, t + s * S6 + 0.1 + i * 0.012, 0.009 * gir, 0.45, (i - 1) * 0.3, true, B.tus)));
    // yükselen arp kaskadı (4. vuruş; iki ölçüde bir daha uzun), ölçü başında parlak çan
    const kas = akTon(ak, ak.bas + 36, k % 2 ? 12 : 8, true);
    kas.forEach((n, i) => arp(n, t + 9 * S6 + i * (0.56 / kas.length) * (k % 2 ? 1.25 : 1), 0.012 + 0.008 * i / kas.length, -0.6 + 1.2 * i / kas.length, 1.2, B.arp));
    sopranoCan(akTon(ak, 88, 3, true)[k % 3], t + 0.02, 0.01, k % 2 ? 0.35 : -0.35);
    const kn = 2 + (rnd() * 2 | 0), c = akTon(ak, 86, 7, true);
    for (let i = 0; i < kn; i++) cam(NOTE(sec(c)), t + 0.2 + rnd() * 2, 0.008, 1.2 + rnd(), rnd() * 1.4 - 0.7, null, rnd() < 0.5);
  }
  // final şenliği: bölüm seçici (pi döner). Olay yoksa: dans → (süre × 0,6'da) doruk → gösteri sonunda son → sabaha sükûn
  function s6FinalSec(t) {
    if (s6FinalT0 < -1e8) s6FinalT0 = t;
    if (s6FB0 < 0) s6FB0 = t;
    const e = t - s6FB0, sonA = s6FinalT0 + s6FinalSure + 1;
    if (s6SonT < 0) {
      if (s6DorukBar < 0 && ((s6DorukT > -1e8 && t >= s6DorukT - 0.4) || t - s6FinalT0 >= Math.max(BAR * 5, s6FinalSure * 0.6))) { s6DorukBar = t; s6DorukVurgu = true; }
      if (t + 2 * BAR >= sonA && ((s6DorukBar >= 0 && t - s6DorukBar >= 2 * BAR - 0.1) || t + 2 * BAR >= sonA + 2.5)) s6SonT = t;
    }
    if (s6SonT >= 0) { const k = Math.round((t - s6SonT) / BAR); s6FB = k < 2 ? { tur: 'son', k } : { tur: 'sukun', k: k - 2 }; return k < 2 ? 16 + k : 18 + (k - 2) % 2; }
    if (s6DorukBar >= 0) { const k = Math.round((t - s6DorukBar) / BAR); s6FB = { tur: 'doruk', k }; return 8 + k % 8; }
    const k = Math.round(e / BAR); s6FB = { tur: 'dans', k }; return k % 8;
  }
  function senlikFinalCubuk(t, ak, pi) {
    const { tur, k } = s6FB, b = pi;
    const fisekVar = zaman() - s6FisekT < 6;   // dünyada havai fişek varsa müzik kendi fişeklerini atmaz (çift olmasın)
    if (tur === 'dans') {
      const guc = 0.9 + Math.min(k, 7) * 0.016;
      s6Ezgi(S_MEL[b], t, b, guc, k >= 8 && k % 16 >= 8 ? 'celesta' : 'kaval', 1);
      s6Esleme(t, ak, b, 1, 1, 0.92 + Math.min(k, 6) * 0.012);
      if (k >= 2) [ak.bas + 24, akorTonu(ak, ak.bas + 28)].forEach((n, i) => boru(n, t + 0.02, BAR * 0.8, 0.006 + 0.0004 * Math.min(k, 7), (i - 0.5) * 0.5, B.tus));   // uzak oyuncak borular
      if (k >= 1) [3, 9].forEach(s => alkis(t + s * S6, 0.6 + 0.06 * Math.min(k, 6), s === 3 ? 0.35 : -0.35));
      if (k % 4 === 0) canKulesi(t + 0.02, ak, k ? 6 : 4, 0.015 + (k ? 0.003 : 0), k % 8 ? 0.45 : -0.45);
      if (!fisekVar) { const fs = rnd() < 0.6 ? 1 : 0; for (let i = 0; i < fs; i++) havaiFisek(t + 0.2 + rnd() * 1.6, 0.8, (rnd() < 0.5 ? -1 : 1) * (0.3 + rnd() * 0.4)); }
    } else if (tur === 'doruk') {
      s6Ezgi(S_MEL[b], t, b, 1.04, 'celesta', 1);
      oncelikli = true;   // kaval ezgiyi bir oktav altta
      try { for (const [s, n, u] of S_MEL[b] || []) if (s === 0 || u >= 2) flut(n - 12, t + s * S6 + 0.03, u * S6 * 0.9, 0.022, -0.2, null, false); } finally { oncelikli = false; }
      if (b % 2 === 0) [ak.bas + 24, akorTonu(ak, ak.bas + 28)].forEach((n, i) => boru(n, t + 0.02, BAR * 1.7, 0.009, (i - 0.5) * 0.4, B.tus));
      s6Esleme(t, ak, b, 1, 1, 1);
      [0, 3, 6, 9].forEach(s => s % 6 ? alkis(t + s * S6, 0.85, s === 3 ? 0.4 : -0.4) : null);
      if (k % 2 === 0) canKulesi(t + 0.02, ak, 6, 0.017, k % 4 ? 0.5 : -0.5, 0.22);
      sopranoCan(akTon(ak, 88, 4, true)[k % 3], t + 3 * S6, 0.011, k % 2 ? 0.3 : -0.3);
      if (s6DorukVurgu) {   // doruğun ilk vuruşu: büyük akor + koro kabarışı + çan dizisi (olay gelince yükselen ön vuruş SFX'te çalar)
        s6DorukVurgu = false;
        oncelikli = true;
        try {
          kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.01, 0.5, 1.2, 2.6, 0.02, sahneG, true);
          for (let i = 0; i < 10; i++) cam(NOTE(akorTonu(ak, 84 + i * 1.3 | 0)), t + 0.25 + i * 0.1, 0.014, 2.3, i % 2 ? 0.5 : -0.5, null, false);
        } finally { oncelikli = false; }
      }
      if (!fisekVar) { const fs = 1 + (rnd() < 0.45 ? 1 : 0); for (let i = 0; i < fs; i++) havaiFisek(t + 0.2 + rnd() * 1.6, 1, (rnd() < 0.5 ? -1 : 1) * (0.3 + rnd() * 0.4)); }
    } else if (tur === 'son') {   // kadans: müzik kutusu son cümlesi, uzun bas, aşağı süzülen arp, büyük çanlar yavaşça
      s6Ezgi(S_SON_MEL[k], t, b, 0.95, 'kutu', 1);
      bas(ak.bas + 12, t, 0.07, 'uzun', BAR * 1.8);
      if (k === 0) { akTon(ak, ak.bas + 24, 9).forEach((n, i) => arp(n, t + 0.2 + i * 0.12, 0.026, -0.5 + i * 0.12, 2.2)); canKulesi(t + 1.2, ak, 3, 0.016, 0, 0.5); }
      else [67, 74, 79].forEach((n, i) => zil(NOTE(n), t + 0.6 + i * 0.6, 0.014, 3, (i - 1) * 0.4, null, false));
    } else {   // sükûn: sabah gelene kadar yumuşak müzik kutusu (Feza'nın üç–iki–biri) ve seyrek ışıltı
      const m = k % 2 ? [[0, 79, 3], [3, 76, 3], [6, 74, 6]] : [[0, 83, 3], [3, 81, 3], [6, 79, 6]];
      oncelikli = true;
      try { m.forEach(([s, n, u], i) => zil(NOTE(akorTonu(ak, n)), t + s * S6 + 0.02, 0.03 - i * 0.003, 1.2 + u * 0.2, (i - 1) * 0.25)); } finally { oncelikli = false; }
      bas(ak.bas + 12, t, 0.05, 'uzun', BAR * 0.9);
      const c = akTon(ak, 86, 6, true); for (let i = 0; i < 2; i++) cam(NOTE(sec(c)), t + 0.3 + rnd() * 1.8, 0.006, 1.6, rnd() - 0.5, null, true);
    }
  }

  // ── Bölüm 7 "Kuzey Işıkları": kış ninnisi (3/4, adım 0.4 sn) · kardan adam (12/8, 0.2 sn) · kızak (16'lık, 0.15 sn) ──
  // Pırıl'ın altılı sıçrayışı (B–G#'–F#') açar, Feza'nın üç–iki–biri (G#–F#–E) kapatır; A'da Lidyen D# ışıltısı, finalde ♭VI (C) büyüsü.
  const K7 = 0.4, K12 = 0.2, K16 = 0.15;
  const K_MEL = yaz(
    'B4:2 G#5:3 F#5:1 | E5:3 F#5:1 G#5:2 | E5:2 C#6:3 B5:1 | G#5:4 r:2 |' +
    'A5:2 C#6:2 E6:2 | D#6:3 C#6:1 B5:2 | C#6:3 B5:1 F#5:2 | E5:4 r:2 |' +
    'B4:2 G#5:3 F#5:1 | E5:2 G#5:2 B5:2 | D#6:3 C#6:1 B5:2 | G#5:4 F#5:2 |' +
    'A5:2 E6:3 D#6:1 | C#6:2 B5:2 A5:2 | G#5:3 F#5:1 D#5:2 | F#5:2 E5:4');
  // ikinci tur (kristal çanlar, seyrek ve yüksek: karlı sessizlikte nefes)
  const K_MEL_B = yaz(
    'r:2 E6:2 G#6:2 | B6:4 G#6:2 | r:2 C#6:2 E6:2 | G#6:6 |' +
    'r:2 E6:2 A6:2 | G#6:3 E6:1 C#6:2 | F#6:4 E6:2 | F#6:6 |' +
    'r:2 B5:2 E6:2 | G#6:4 F#6:2 | r:2 D#6:2 F#6:2 | B6:6 |' +
    'r:2 C#6:2 E6:2 | A6:4 G#6:2 | F#6:3 D#6:1 B5:2 | E6:6');
  // kardan adam: hoplayan, oyunbaz (KE KA KBs KE KC KA KB KE)
  const K_KARDAN = yaz(
    'E5:1 r:1 G#5:1 B5:2 G#5:1 E6:2 r:1 B5:2 r:1 | C#6:1 r:1 A5:1 E6:2 C#6:1 D#6:3 r:3 |' +
    'B5:1 r:1 F#5:1 B5:2 C#6:1 E6:2 C#6:1 B5:2 r:1 | G#5:1 F#5:1 E5:1 B4:2 r:1 E5:3 r:3 |' +
    'E5:1 r:1 G#5:1 C#6:2 B5:1 G#5:2 r:1 E5:2 r:1 | A5:1 r:1 C#6:1 E6:2 C#6:1 B5:2 A5:1 G#5:2 r:1 |' +
    'F#5:1 G#5:1 B5:1 D#6:2 C#6:1 B5:2 r:1 F#6:2 r:1 | G#6:2 E6:1 B5:2 G#5:1 E6:3 r:3');
  // kızak: hızlı, zilli kış koşusu (16 ölçü, 16'lık ızgara)
  const K_KIZAK = yaz(
    'B5:2 B5:2 G#5:2 E5:2 F#5:2 G#5:2 B5:4 | E6:4 D#6:2 B5:2 G#5:6 r:2 | A5:2 A5:2 C#6:2 E6:2 D#6:2 C#6:2 B5:4 | D#6:4 C#6:2 B5:2 F#5:6 r:2 |' +
    'B5:2 B5:2 G#5:2 E5:2 F#5:2 G#5:2 E6:4 | G#6:4 E6:2 C#6:2 B5:6 r:2 | A5:2 B5:2 C#6:2 F#6:2 E6:2 C#6:2 A5:4 | B5:4 C#6:2 D#6:2 F#6:6 r:2 |' +
    'E6:2 C#6:2 E6:2 A6:2 G#6:2 E6:2 C#6:4 | D#6:2 F#6:2 B6:4 G#6:2 F#6:2 D#6:4 | B5:2 D#6:2 G#6:4 F#6:2 D#6:2 B5:4 | C#6:2 E6:2 G#6:4 E6:2 C#6:2 G#5:4 |' +
    'A5:2 C#6:2 E6:2 A6:2 G#6:4 E6:4 | F#6:2 D#6:2 B5:2 C#6:2 D#6:4 F#6:4 | G#6:3 F#6:1 E6:2 B5:2 G#5:2 B5:2 E6:4 | E6:8 r:4 B5:2 D#6:2');
  // kızakla gökyüzünde uçuş ('kizakUc'→'kizakIn'): aynı akorlar üstünde uzun, süzülen, ferah ezgi
  const K_UCUS = yaz(
    'B5:8 G#6:8 | F#6:4 E6:4 B5:8 | C#6:8 E6:4 A6:4 | F#6:8 D#6:8 | B5:8 G#6:6 B6:2 | G#6:8 E6:4 C#6:4 | A6:8 F#6:4 C#6:4 | D#6:8 F#6:8 |' +
    'E6:6 A6:2 G#6:8 | F#6:8 B6:8 | D#6:8 G#6:4 F#6:4 | E6:8 C#6:8 | C#6:4 E6:4 A6:8 | B6:8 F#6:8 | G#6:6 F#6:2 E6:8 | B5:16');
  // final: doruk (KE KB KC KA KE KCb KA KB) ve son
  const K_DORUK = yaz('B5:2 G#6:3 F#6:1 | D#6:3 F#6:1 B6:2 | C#6:2 G#6:3 E6:1 | C#6:2 E6:2 A6:2 | B5:2 G#6:3 F#6:1 | E6:2 G6:3 B6:1 | A6:3 G#6:1 E6:2 | F#6:2 D#6:2 B5:2');
  const K_SON = yaz('G#5:3 F#5:1 E5:2 | E5:6');
  const k7Hum = () => (rnd() - 0.5) * 0.01;
  // ezgi: renk = 'kutu' (müzik kutusu) · 'celesta' · 'kristal' (cam çan)
  function k7Ezgi(mel, t, renk, guc, f, adim) {
    adim = adim || K7;
    oncelikli = true;
    try {
      for (const [s, n, u] of mel || []) {
        const ts = t + s * adim + 0.02 + k7Hum(), vurgu = s === 0 || u >= 3;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        if (f < 0.1 && !vurgu && rnd() < 0.3) continue;   // ışıklar sönükken süs notaları seyrek
        const pan = cl((n - 78) * 0.035, -0.35, 0.35);
        if (renk === 'kutu') {
          zil(NOTE(n), ts, 0.044 * guc, Math.min(2.6, 1.0 + u * 0.25), pan);
          if (vurgu) arp(n - 12, ts + 0.01, 0.018 * guc, -pan, 1.8);
        } else if (renk === 'celesta') {
          tus(n, ts, 0.042 * guc, 1.5 + u * 0.2, pan, true, B.zil);
          if (u >= 3) zil(NOTE(n + 12), ts + 0.01, 0.011 * guc, 1.8, -pan, null, false);
        } else cam(NOTE(n), ts, 0.021 * guc, 2.2 + u * 0.15, pan, null, true);
        // ışıklar çoğaldıkça uzun notalarda bir oktav üstte kristal yankı
        if (f > 0.7 && u >= 3 && renk !== 'kristal' && n + 12 <= 100) cam(NOTE(n + 12), ts + 0.03, 0.007, 2, -pan, null, false);
      }
    } finally { oncelikli = false; }
  }
  // eşlik (3/4): harp akışı, uzun bas, valsin 2–3. vuruşunda çelesta, kristal toz, soprano çanı
  function k7Esleme(t, ak, bar, f, guc) {
    guc = guc || 1;
    const tn = akTon(ak, ak.bas + 24, 7), yol = bar % 2 ? [0, 2, 4, 6, 4, 2] : [0, 3, 5, 3, 4, 2], akis = sm(0.08, 0.3, f);
    for (let s = 0; s < 6; s++) {
      if (s && rnd() > akis) continue;
      arp(tn[yol[s]], t + s * K7 + 0.012 + k7Hum(), (s ? 0.013 : 0.021) * guc * (0.85 + 0.15 * f), (yol[s] - 3) * 0.12, s ? 1.5 : 2);
    }
    if (bar % 2 === 0) bas(ak.bas + 12, t + 0.01, 0.05 * (0.7 + 0.3 * f) * guc, 'uzun', 2 * BAR * 0.9);
    if (f > 0.5) [2, 4].forEach(s => ak.pad.slice(1, 4).forEach((n, i) => tus(n + 12, t + s * K7 + i * 0.015, 0.009 * guc * sm(0.5, 0.8, f), 0.6, (i - 1) * 0.3, true, B.tus)));
    const kn = Math.round(0.4 + 1.6 * f + rnd() * 0.7);
    if (kn > 0) { const c = akTon(ak, 86, 7, true); for (let i = 0; i < kn; i++) cam(NOTE(sec(c)), t + 0.1 + rnd() * 2.1, 0.005 + 0.004 * f, 1.4 + rnd(), rnd() * 1.4 - 0.7, null, rnd() < 0.5); }
    if (f > 0.85 && bar % 2 === 0) sopranoCan(akTon(ak, 88, 4, true)[bar % 4 ? 2 : 1], t + 3 * K7, 0.011 * guc, bar % 4 ? -0.3 : 0.3);
  }
  // kuzey ışığı perdesi: yavaşça dalgalanan geniş pad (süzgeç ve genlik iki ayrı yavaş dalgayla salınır)
  function perde(ak, t, dur, vol, hedef) {
    const ns = ak.pad.map(n => n + 12).concat([ak.bas + 12]);
    if (!yerVar(ns.length * 2 + 3, t, t + dur + 3, true)) return;
    const atk = Math.min(2.4, dur * 0.4), rel = 3, son = t + dur + rel + 0.1;
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk);
    g.gain.setValueAtTime(vol, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel); g.connect(hedef || B.pad);
    const tr = kazanc(0.72, g), lf2 = ac.createOscillator(); lf2.frequency.value = 0.11 + rnd() * 0.05; lf2.connect(kazanc(0.26, tr.gain)); lf2.start(t); lf2.stop(son);
    const lp = suzgec('lowpass', 1100, 1.1, tr), lf = ac.createOscillator(); lf.frequency.value = 0.17 + rnd() * 0.06; lf.connect(kazanc(700, lp.frequency)); lf.start(t); lf.stop(son);
    ns.forEach((n, i) => {
      osc('sawtooth', NOTE(n), t, son, kazanc(0.16, lp), i % 2 ? -9 : 9);
      osc('sine', NOTE(n), t, son, kazanc(0.5, lp), i % 2 ? 4 : -4);
    });
  }
  // kızak çıngırağı: süzgeçli tıs + iki metalik kısmi ses (çok kısa, kısık)
  function cingirak(t, v, pan, hedef, uzun) {
    hedef = hedef || B.hop;
    gur(t, uzun ? 0.2 : 0.08, 'highpass', 6500, uzun ? 8200 : 0, 0.8, 0.0055 * v, 0.003, pan, 0, hedef);
    ton(t + rnd() * 0.005, 'sine', 5300 * (0.98 + rnd() * 0.04), 0, uzun ? 0.16 : 0.09, 0.0022 * v, 0.002, pan, 0, hedef);
    ton(t + rnd() * 0.005, 'sine', 7700 * (0.98 + rnd() * 0.04), 0, uzun ? 0.12 : 0.07, 0.0014 * v, 0.002, pan, 0, hedef);
  }
  // fener yeni bir katmanı açınca bir sonraki ölçü onu kısa bir süsle tanıtır
  function k7TanitCal(t, ak, a) {
    if (a === 1) akTon(ak, ak.bas + 24, 9).forEach((n, i) => arp(n, t + 0.02 + i * 0.08, 0.015 + i * 0.001, -0.5 + i * 0.12, 1.8));
    else if (a === 2) kabar(ak.pad.map(n => n + 12), t + 0.05, 1.4, 0.8, 2, 0.01, B.pad, false);
    else if (a === 3) akTon(ak, 83, 3, true).reverse().forEach((n, i) => cam(NOTE(n), t + (2 + i * 2) * K7 + 0.02, 0.016 - i * 0.002, 2.4, 0.3 - i * 0.3, null, i === 0));
    else if (a === 4) { kabar(ak.pad.map(n => n + 12), t + 0.05, 1.2, 0.8, 2, 0.011, B.pad, true); sopranoCan(akTon(ak, 88, 3, true)[1], t + 3 * K7, 0.013, -0.3); }
    else { akTon(ak, 84, 8, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.1 + i * 0.16, 0.011, 2.2, i % 2 ? 0.4 : -0.4, null, i < 2)); kabar([ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.1, 1, 1, 2.2, 0.012, B.pad, true); }
  }
  function karCubuk(t, ak, bic, pi) {
    const f = k7S, bar = pi * 2 + bic, d = dongu % 3;
    if (d === 2) k7Ezgi(K_MEL_B[bar % 16], t, 'kristal', 0.9 + 0.15 * f, f);
    else k7Ezgi(K_MEL[bar % 16], t, d === 1 && f > 0.25 ? 'celesta' : 'kutu', 0.88 + 0.14 * f, f);
    if (d === 1 && f > 0.7 && bar % 2 === 1) k7Ezgi(K_MEL_B[bar % 16], t, 'kristal', 0.55, f);   // ışıklar çoğalınca üstte kristal karşı ezgi
    k7Esleme(t, ak, bar, f, 1);
    if (k7Tanit) { const a = k7Tanit; k7Tanit = 0; k7TanitCal(t, ak, a); }
  }
  // kardan adam: hoplayan "bup" ezgisi + çelesta, pizz ım-pa, valsin karşı vuruşunda akor
  function kardanCubuk(t, ak, pi) {
    const k = pi & 7, tur = (pi >> 3) & 1, gir = cl((zaman() - k7KardanT0) / 3, 0.6, 1);
    oncelikli = true;
    try {
      for (const [s, n, u] of K_KARDAN[k] || []) {
        const ts = t + s * K12 + 0.015 + k7Hum(), pan = cl((n - 78) * 0.04, -0.35, 0.35);
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        hop(n, ts, 0.042 * gir * (s === 0 || u >= 2 ? 1 : 0.85), pan);
        if (u >= 2) tus(n, ts + 0.005, 0.024, 0.9 + u * 0.15, -pan, true, B.zil);
        if (tur && u >= 2) zil(NOTE(n + 12), ts + 0.01, 0.011, 1.2, pan, null, false);
      }
    } finally { oncelikli = false; }
    bas(ak.bas + 12, t + 0.01, 0.055 * gir, 'pizz'); bas(ak.bas + 19, t + 6 * K12 + 0.01, 0.04 * gir, 'pizz');
    [3, 9].forEach(s => ak.pad.slice(1, 4).forEach((n, i) => tus(n + 12, t + s * K12 + i * 0.012, 0.01 * gir, 0.45, (i - 1) * 0.3, true, B.tus)));
    if (tur) [5, 11].forEach(s => cingirak(t + s * K12, 0.35, s === 5 ? 0.3 : -0.3));
    if (pi % 2 === 1) akTon(ak, ak.bas + 36, 5, true).forEach((n, i) => cam(NOTE(n), t + 1.6 + i * 0.08, 0.009, 1.4, -0.4 + i * 0.2, null, i > 3));
  }
  // kızak: hızlı zilli kış koşusu — çelesta + müzik kutusu ezgi, pizz ım-pa, sekizlik çıngırak, koşan arp
  function kizakCubuk(t, ak, pi) {
    if (k7SicT > -1e8 && t > k7SicT - 0.1) {   // final sıçrayışı ve iniş: havada asılı ölçüler (pad + inen ışıltı)
      if (t - k7SicT > 1.2) akTon(ak, 84, 6, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.3 + i * 0.32, 0.007, 1.8, -0.5 + i * 0.2, null, i < 2));
      return;
    }
    const k = pi & 15, gir = cl((zaman() - k7KizakT0) / 3, 0.6, 1), hiz = k7KizakHiz;
    if (k7Ucus) { ucusKizakCubuk(t, ak, k); return; }
    oncelikli = true;
    try {
      for (const [s, n, u] of K_KIZAK[k] || []) {
        const ts = t + s * K16 + 0.012 + k7Hum() * 0.5, pan = cl((n - 80) * 0.04, -0.35, 0.35);
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        tus(n, ts, 0.036 * gir, 0.8 + u * 0.12, pan, true, B.zil);
        zil(NOTE(n), ts + 0.004, 0.022 * gir, 0.7 + u * 0.15, -pan, null, u >= 4);
        if (u >= 4 && n + 12 <= 100) cam(NOTE(n + 12), ts + 0.02, 0.007, 1.4, pan, null, false);
      }
    } finally { oncelikli = false; }
    for (let b = 0; b < 4; b++) {
      bas(ak.bas + (b % 2 ? 19 : 12), t + b * 4 * K16 + 0.01, (b % 2 ? 0.04 : 0.055) * gir, 'pizz');
      if (b % 2) ak.pad.slice(1, 4).forEach((n, i) => tus(n + 12, t + b * 4 * K16 + 0.01 + i * 0.01, 0.009 * gir, 0.35, (i - 1) * 0.3, true, B.tus));
    }
    for (let s = 0; s < 16; s += hiz ? 1 : 2) cingirak(t + s * K16 + k7Hum() * 0.3, (s % 4 === 0 ? 0.85 : s % 2 ? 0.4 : 0.55) * gir, s % 4 ? 0.25 : -0.25, null, s === 4 || s === 12);
    if (hiz) {   // büyük iniş: her vuruşta bas, her ölçüde yükselen arp kaskadı ve parlak çan
      [2, 6, 10, 14].forEach(s => bas(ak.bas + 12, t + s * K16 + 0.01, 0.026, 'pizz'));
      const kas = akTon(ak, ak.bas + 36, 12, true); kas.forEach((n, i) => arp(n, t + 10 * K16 + i * 0.05, 0.011 + 0.008 * i / kas.length, -0.6 + 1.2 * i / kas.length, 1.2));
      sopranoCan(akTon(ak, 88, 3, true)[k % 3], t + 0.02, 0.01, k % 2 ? 0.35 : -0.35);
    } else if (k % 2 === 1) { const ns = akTon(ak, ak.bas + 36, 8); ns.forEach((n, i) => arp(n, t + 8 * K16 + i * K16 * 0.5, (0.011 + 0.001 * i) * gir, -0.5 + i * 0.14, 1.1)); }
    else akTon(ak, ak.bas + 24, 4).forEach((n, i) => arp(n, t + i * 2 * K16 + 0.012, 0.014 * gir, (i - 1.5) * 0.25, 1.2));
    if (k % 4 === 0) sopranoCan(akTon(ak, 88, 3, true)[(k >> 2) % 3], t + 0.03, 0.009, k % 8 ? 0.3 : -0.3);
    const c = akTon(ak, 86, 7, true); for (let i = 0; i < 2; i++) cam(NOTE(sec(c)), t + 0.2 + rnd() * 2, 0.007, 1.2 + rnd(), rnd() * 1.4 - 0.7, null, rnd() < 0.5);
  }
  // kızakla uçuş: çıngırak seyrekleşir (yarım), yaylı + koro yükselir (karışım), süzülen ezgi (flüt + kristal), uzun arp glissandoları;
  // ikinci uçuş daha büyük: kuzey ışığı perdesi ve soprano çanları her ölçüde
  function ucusKizakCubuk(t, ak, k) {
    const gir = cl((zaman() - k7UcusT0) / 2.5, 0.45, 1), buyuk = k7UcusN >= 2;
    oncelikli = true;
    try {
      for (const [s, n, u] of K_UCUS[k] || []) {
        const ts = t + s * K16 + 0.02, pan = cl((n - 84) * 0.04, -0.35, 0.35), dur = u * K16;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        flut(n, ts, dur * 0.95, 0.03 * gir, pan);
        tus(n, ts + 0.005, 0.022 * gir, 1.6 + dur * 0.3, -pan, true, B.zil);
        if (u >= 8 && n + 12 <= 100) cam(NOTE(n + 12), ts + 0.03, (buyuk ? 0.011 : 0.008) * gir, 2.4, -pan, null, false);
      }
    } finally { oncelikli = false; }
    for (let s = 0; s < 16; s += 4) cingirak(t + s * K16, (s ? 0.4 : 0.6) * gir, s % 8 ? 0.3 : -0.3, null, s === 0);
    bas(ak.bas + 12, t + 0.01, 0.05, 'uzun', BAR * 0.9);
    const g = akTon(ak, ak.bas + 24, 14, true);   // uzun yükselen arp glissandosu (her ölçü), büyük uçuşta ikinci dalga inerek
    g.forEach((n, i) => arp(n, t + 0.05 + i * 0.1, (0.011 + 0.006 * i / g.length) * gir, -0.6 + 1.2 * i / g.length, 1.8));
    if (buyuk) g.slice(5).reverse().forEach((n, i) => arp(n, t + 1.5 + i * 0.08, 0.009 * gir, 0.6 - i * 0.13, 1.6));
    if (buyuk || k % 2 === 0) perde(ak, t + 0.02, BAR * (buyuk ? 1.1 : 2), (buyuk ? 0.022 : 0.015) * gir);
    if (buyuk || k % 2 === 1) sopranoCan(akTon(ak, 88, 3, true)[k % 3], t + 1.2, 0.011, k % 2 ? 0.3 : -0.3);
    const c = akTon(ak, 86, 7, true); for (let i = 0; i < (buyuk ? 4 : 3); i++) cam(NOTE(sec(c)), t + 0.2 + rnd() * 2, 0.007, 1.6 + rnd(), rnd() * 1.4 - 0.7, null, rnd() < 0.5);
  }
  // final bölüm seçici: dalga → (kuzeyDoruk ya da süre × 0,85) doruk → son → sükûn (sabaha)
  function k7FinalSec(t) {
    if (k7FinalT0 < -1e8) k7FinalT0 = t;
    if (k7FB0 < 0) k7FB0 = t;
    const e = t - k7FB0, sonA = k7FinalT0 + k7FinalSure + 1;
    if (k7SonT < 0) {
      if (k7DorukBar < 0 && ((k7DorukT > -1e8 && t >= k7DorukT - 0.4) || t - k7FinalT0 >= Math.max(BAR * 5, k7FinalSure * 0.85))) { k7DorukBar = t; k7DorukVurgu = true; }
      if (t + 2 * BAR >= sonA && ((k7DorukBar >= 0 && t - k7DorukBar >= 3 * BAR - 0.1) || t + 2 * BAR >= sonA + 2.5)) k7SonT = t;
    }
    if (k7SonT >= 0) { const k = Math.round((t - k7SonT) / BAR); k7FB = k < 2 ? { tur: 'son', k } : { tur: 'sukun', k: k - 2 }; return k < 2 ? 16 + k : 18 + (k - 2) % 2; }
    if (k7DorukBar >= 0) { const k = Math.round((t - k7DorukBar) / BAR); k7FB = { tur: 'doruk', k }; return 8 + k % 8; }
    const k = Math.round(e / BAR); k7FB = { tur: 'dalga', k }; return k % 8;
  }
  function kuzeyFinalCubuk(t, ak, pi) {
    const { tur, k } = k7FB, b = pi;
    if (tur === 'dalga') {
      const guc = 0.9 + Math.min(k, 7) * 0.015;
      k7Ezgi(K_MEL[b], t, k % 16 >= 8 ? 'kutu' : 'celesta', guc, 1);
      k7Esleme(t, ak, b, 1, 0.95);
      if (b % 2 === 0) perde(ak, t + 0.02, BAR * 2, 0.02 + 0.0015 * Math.min(k, 6));
      if (k >= 1) akTon(ak, ak.bas + 24, 9).forEach((n, i) => arp(n, t + 4 * K7 + i * 0.09, 0.011 + i * 0.001, -0.6 + i * 0.15, 1.6));   // ışık dalgası
      if (k % 4 === 2) akTon(ak, 84, 6, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.3 + i * 0.2, 0.01, 2.2, i % 2 ? 0.45 : -0.45, null, i < 2));
    } else if (tur === 'doruk') {
      const mel = K_DORUK[(b - 8) & 7];
      k7Ezgi(mel, t, 'celesta', 1.05, 1);
      oncelikli = true;   // müzik kutusu ezgiyi bir oktav altta, kristal bir oktav üstte
      try { for (const [s, n, u] of mel) { zil(NOTE(n - 12), t + s * K7 + 0.03, 0.022, 1.6 + u * 0.2, -0.2, null, false); if (u >= 3 && n + 12 <= 100) cam(NOTE(n + 12), t + s * K7 + 0.04, 0.009, 2.4, 0.3, null, false); } } finally { oncelikli = false; }
      k7Esleme(t, ak, b, 1, 1);
      perde(ak, t + 0.02, BAR * 1.1, 0.026);
      akTon(ak, ak.bas + 24, 10).forEach((n, i) => arp(n, t + 3 * K7 + i * 0.08, 0.011 + i * 0.001, -0.6 + i * 0.13, 1.6));
      if (k % 2 === 0) akTon(ak, 84, 7, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.25 + i * 0.17, 0.011, 2.4, i % 2 ? 0.5 : -0.5, null, i < 2));
      sopranoCan(akTon(ak, 88, 4, true)[k % 3], t + 3 * K7, 0.011, k % 2 ? 0.3 : -0.3);
      if (k7DorukVurgu) {   // doruğun ilk vuruşu: büyük akor + çan dizisi (ön vuruş SFX'te)
        k7DorukVurgu = false;
        oncelikli = true;
        try {
          kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.01, 0.6, 1.4, 2.8, 0.019, sahneG, true);
          for (let i = 0; i < 10; i++) cam(NOTE(akorTonu(ak, 84 + i * 1.3 | 0)), t + 0.25 + i * 0.11, 0.013, 2.4, i % 2 ? 0.5 : -0.5, null, false);
        } finally { oncelikli = false; }
      }
    } else if (tur === 'son') {   // kadans: müzik kutusunda Feza'nın üç–iki–biri, uzun bas, aşağı süzülen arp
      k7Ezgi(K_SON[k], t, 'kutu', 0.95, 1);
      bas(ak.bas + 12, t, 0.065, 'uzun', BAR * 1.8);
      if (k === 0) { perde(ak, t + 0.02, BAR * 1.6, 0.016); akTon(ak, ak.bas + 24, 9).reverse().forEach((n, i) => arp(n, t + 0.2 + i * 0.13, 0.022, 0.5 - i * 0.12, 2.2)); }
      else [76, 80, 83].forEach((n, i) => cam(NOTE(n + 12), t + 0.6 + i * 0.6, 0.012, 3, (i - 1) * 0.4, null, false));
    } else {   // sükûn: sabaha kadar seyrek müzik kutusu ve kar tanesi ışıltısı
      const m = k % 2 ? [[0, 80, 2], [2, 78, 2], [4, 76, 2]] : [[0, 83, 2], [2, 80, 2], [4, 78, 2]];
      oncelikli = true;
      try { m.forEach(([s, n, u], i) => zil(NOTE(akorTonu(ak, n)), t + s * K7 + 0.02, 0.028 - i * 0.003, 1.4 + u * 0.3, (i - 1) * 0.25)); } finally { oncelikli = false; }
      bas(ak.bas + 12, t, 0.045, 'uzun', BAR * 0.9);
      const c = akTon(ak, 86, 6, true); for (let i = 0; i < 2; i++) cam(NOTE(sec(c)), t + 0.3 + rnd() * 1.8, 0.006, 1.8, rnd() - 0.5, null, true);
    }
  }

  // ── Bölüm 8 "Balkabağı Gecesi": Cadılar Bayramı ama gülümseten (Addams Ailesi'nin tatlı hâli) – Re minör, ay anında ve finalin doruğunda Re majör ──
  // Ölçü: ana tema / koru / sokak / kabak yüzü (12/8) / kazan valsi 2.4 sn (100 BPM; sekizlik 0.3, 12/8 ve valste 0.2) · iskelet 112 BPM (ölçü 2.143 sn,
  // hafif swing; 'iskeletBasla' anına hizalı) · süpürge, meydan ve final 120 BPM (ölçü 2 sn, vuruş 0.5; final ölçüleri kabak.js'in final saatine hizalı).
  // Çalgılar: kemik ksilofon, klavsen, oyuncak org, hayalet düdüğü ("uuu": vibratolu sinüs + portamento), parmak şıklatma, tef, tuba/fagot, pizzicato,
  // çelesta, müzik kutusu. Sevimli-gizemli renk: iniş çizgisi (D–C#–C–B), armonik minör A7, kısa E°7; ani ya da sert ses yok.
  const C8 = 0.3, C12 = 0.2, U8 = 0.25, U16 = 0.125;
  const ISK_V = 60 / 112, ISK_BAR = 4 * ISK_V, ISK_SW = 0.58;   // iskelet: vuruş, ölçü, swing (ikinci sekizlik vuruşun %58'inde)
  const ISK_NOTA = [74, 77, 79, 81, 84, 86];                      // iskeletNota i = 0..5 → Re Fa Sol La Do Re' (Re minör pentatonik)
  const ISK_CUMLE_AK = ['IDm', 'IF', 'IGmC', 'IDm'];              // ISKELET'in cümleleri: Re Fa Sol La | Do La Sol La | Re' Do La Sol | Fa Sol Fa Re
  const iskZ = (t, v) => { const b = Math.floor(v), x = v - b; return t + (b + (x < 0.5 ? x * 2 * ISK_SW : ISK_SW + (x - 0.5) * 2 * (1 - ISK_SW))) * ISK_V; };   // vuruş konumu → zaman (swing)
  // Ana tema "Balkabağı Gecesi" (giris/tarla, 16 ölçü): A – parmak ucu yürüyüşü ("tıp . tıp-tıp TIP . TIP .") ve kromatik kıpırtı (G#–A–Bb–A);
  // B – hayaletçiklerin uzun notalı, yükselen cevabı (Bb F Gm A7 · Bb F E°7 A7)
  const C_MEL = yaz(
    'D5:1 r:1 D5:1 E5:1 F5:1 r:1 A5:1 r:1 | G#5:1 A5:1 Bb5:1 A5:1 G#5:1 A5:3 | C6:1 r:1 C6:1 Bb5:1 A5:1 r:1 F5:1 r:1 | B5:1 A5:1 G#5:1 A5:1 F5:1 D5:3 |' +
    'Bb5:1 r:1 Bb5:1 C6:1 D6:1 r:1 G6:1 r:1 | F6:1 E6:1 F6:1 E6:1 C#6:1 A5:3 | F5:1 r:1 E5:1 r:1 D5:1 r:1 A4:1 r:1 | C#5:1 D5:1 E5:1 F5:1 G5:1 G#5:1 A5:2 |' +
    'D6:3 C6:1 Bb5:2 F5:2 | A5:3 G5:1 F5:2 C5:2 | Bb5:2 A5:1 G5:1 D6:2 Bb5:2 | A5:4 r:2 E5:1 G5:1 |' +
    'F5:1 Bb5:1 D6:1 F6:1 A6:2 F6:2 | G6:1 F6:1 E6:1 C6:1 A5:2 C6:2 | Bb5:1 C#6:1 E6:1 G6:1 Bb6:2 G6:1 E6:1 | E6:1 F6:1 E6:1 C#6:1 A5:2 r:2');
  // Koru (eğri büğrü ağaçlar, 16 ölçü): noktalı, "topallayan" sevimli yürüyüş; G/B'de Dorian ışığı, C–Am'de açıklık
  const K8_MEL = yaz(
    'A4:3 D5:1 F5:3 E5:1 | D5:2 G5:2 Bb5:3 A5:1 | F5:3 E5:1 D5:2 A4:2 | C#5:2 E5:2 A5:4 |' +
    'A5:3 C6:1 F6:3 E6:1 | D6:2 B5:2 G5:3 B5:1 | Bb5:3 A5:1 G5:2 D5:2 | E5:2 G5:2 C#6:2 A5:2 |' +
    'F5:2 Bb5:2 D6:4 | E6:2 D6:1 C6:1 G5:4 | A5:2 C6:2 E6:3 D6:1 | F6:4 D6:2 A5:2 |' +
    'Bb5:3 A5:1 G5:2 Bb5:2 | C#6:2 E6:2 G6:3 F6:1 | E6:2 D6:2 A5:4 | G6:2 E6:2 C#6:2 A5:2');
  // Sokak (şeker mi şaka mı yürüyüşü, 16 ölçü): ana motif "Şe-ker mi şa-ka MI?" ritmi (1 1 2 1 1 2), cevabı "tak . tak ." kapı vuruşu
  const S8_MEL = yaz(
    'A5:1 A5:1 F5:2 G5:1 A5:1 D6:2 | C#6:1 r:1 E6:1 r:1 A5:2 r:2 | G5:1 G5:1 E5:2 F5:1 G5:1 C#6:2 | D6:1 r:1 F6:1 r:1 D6:2 r:2 |' +
    'Bb5:1 Bb5:1 G5:2 A5:1 Bb5:1 D6:2 | F6:1 r:1 E6:1 D6:1 A5:2 r:2 | E6:1 F6:1 E6:1 C#6:1 A5:1 B5:1 C#6:1 E6:1 | D6:2 A5:2 D5:2 r:2 |' +
    'C6:1 C6:1 A5:2 Bb5:1 C6:1 F6:2 | E6:1 r:1 G6:1 r:1 C6:2 r:2 | Bb5:1 Bb5:1 G5:2 A5:1 Bb5:1 E6:2 | F6:1 r:1 A6:1 r:1 F6:2 r:2 |' +
    'D6:1 D6:1 Bb5:2 C6:1 D6:1 F6:2 | A6:1 r:1 G6:1 F6:1 C6:2 r:2 | G6:1 F6:1 E6:1 D6:1 Bb5:1 D6:1 G6:2 | E6:1 F6:1 E6:1 C#6:1 A5:2 r:2');
  // Kabak yüzü (12/8, 8 ölçü): hoplayan, oyunbaz "oymaca" ezgisi
  const KY8_MEL = yaz(
    'D5:1 r:1 F5:1 A5:2 F5:1 D6:2 r:1 A5:2 r:1 | Bb5:1 r:1 G5:1 D6:2 Bb5:1 G6:3 r:3 | A5:1 r:1 C#6:1 E6:2 C#6:1 G6:2 F6:1 E6:2 r:1 | D6:1 C#6:1 D6:1 A5:2 r:1 D5:3 r:3 |' +
    'F5:1 r:1 Bb5:1 D6:2 Bb5:1 F6:2 r:1 D6:2 r:1 | G5:1 A5:1 Bb5:1 D6:2 G6:1 F6:3 r:3 | E6:1 F6:1 E6:1 C#6:2 A5:1 E5:2 G5:1 C#6:2 r:1 | D6:2 A5:1 F5:2 E5:1 D5:3 r:3');
  // Cadı Nine'nin kazanı: köpüklü cadı valsi (3/4; 2.4 sn'lik ölçüde iki vals ölçüsü, vuruş 0.4)
  const KZ8_MEL = yaz(
    'A5:2 D6:2 F6:2 E6:3 D6:1 A5:2 | E6:2 A5:2 C#6:2 E6:4 r:2 | G5:2 A5:2 E6:2 G6:3 F6:1 E6:2 | F6:2 D6:2 A5:2 D6:4 r:2 |' +
    'Bb5:2 D6:2 G6:2 F6:3 E6:1 D6:2 | A5:2 D6:2 F6:2 A6:4 r:2 | D6:2 F6:2 Bb6:2 A6:3 G6:1 F6:2 | E6:2 C#6:2 A5:2 E6:2 r:2 A5:2 |' +
    'C6:2 F6:2 A6:2 G6:3 F6:1 E6:2 | G6:2 C6:2 E6:2 G6:4 r:2 | Bb5:2 C6:2 G6:2 Bb6:3 A6:1 G6:2 | A6:2 F6:2 C6:2 F6:4 r:2 |' +
    'D6:2 F6:2 Bb6:2 A6:3 G6:1 F6:2 | F6:2 E6:2 D6:2 A5:4 r:2 | Bb5:2 D6:2 G6:2 F6:2 E6:2 D6:2 | C#6:2 E6:2 A6:2 G6:2 E6:2 C#6:2');
  // Süpürge yolculuğu (120 BPM, 16'lık ızgara): A kalkış (süzülen uzun notalar) · B köyün üstünde · ay anı (Re majör, 4 ölçü)
  const UC8_MEL = yaz(
    'A5:4 D6:4 F6:6 E6:2 | D6:4 F6:4 Bb6:8 | A6:4 G6:2 F6:2 C6:8 | E6:4 G6:4 C6:8 | F6:4 E6:2 D6:2 A5:4 D6:4 | F6:4 D6:4 Bb5:4 D6:4 | G6:6 F6:2 E6:4 D6:4 | C#6:4 E6:4 A6:8 |' +
    'Bb5:4 D6:4 F6:4 Bb6:4 | A6:6 G6:2 F6:4 C6:4 | D6:4 G6:4 Bb6:6 A6:2 | A6:8 F6:4 D6:4 | F6:4 Bb6:4 A6:4 F6:4 | G6:4 F6:2 E6:2 F6:4 C6:4 | Bb5:4 D6:4 G6:4 F6:4 | E6:4 C#6:4 E6:4 A6:4 |' +
    'F#6:8 A6:8 | E6:8 C#6:4 E6:4 | D6:6 C#6:2 B5:8 | B5:4 D6:4 G6:8');
  // final: doruk (ana motif Re majörde: D G A7) · doruğa kabarış (kromatik tırmanış) · sıcak kapanış
  const F8_DORUK = yaz('D6:1 r:1 D6:1 E6:1 F#6:1 r:1 A6:1 r:1 | B6:2 A6:1 G6:1 F#6:1 E6:1 D6:2 | C#6:1 D6:1 E6:1 F#6:1 G6:1 G#6:1 A6:2');
  const F8_KABAR = yaz('E5:1 F5:1 G5:1 G#5:1 A5:1 C#6:1 E6:1 G6:1');
  const F8_SON = yaz('A6:2 F#6:2 D6:4');
  const c8Hum = () => (rnd() - 0.5) * 0.008;
  const c8Kok = ak => ak.bas < 43 ? ak.bas + 12 : ak.bas;   // tuba / pizz bas perdesi (D3 çevresi: iPad hoparlöründe duyulur)
  // zıplayan tuba: tombul ama iPad hoparlöründe duyulsun diye tuba()'dan biraz açık süzgeç + yumuşak 2. harmonik; kısa "ım"lar (dusus: sonda perde iner)
  function c8Tuba(n, t, dur, vol, dusus, hedef) {
    if (!yerVar(3, t, t + dur + 0.3, true)) return;
    const f = NOTE(n), g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.022);
    g.gain.setTargetAtTime(vol * 0.62, t + 0.03, Math.max(0.04, dur * 0.45)); g.gain.setTargetAtTime(0.0001, t + dur, 0.05); g.connect(hedef || B.tuba);
    const lp = suzgec('lowpass', f * 2, 1, g);
    lp.frequency.setValueAtTime(f * 2, t); lp.frequency.exponentialRampToValueAtTime(Math.min(2400, f * 6.5), t + 0.03); lp.frequency.setTargetAtTime(Math.min(1600, f * 3.6), t + 0.05, Math.max(0.05, dur * 0.4));
    const o1 = osc('sawtooth', f, t, t + dur + 0.35, lp), o2 = osc('square', f * 0.5, t, t + dur + 0.35, kazanc(0.18, lp));
    osc('sine', f * 2, t, t + dur + 0.2, kazanc(0.22, g));
    if (dusus) for (const o of [o1, o2]) { o.detune.setValueAtTime(0, t + dur * 0.55); o.detune.linearRampToValueAtTime(dusus, t + dur + 0.1); }
  }

  // kemik ksilofon: sert tokmaklı, kuru ve kısa "tok" (gülen iskeletlerin kaburgası) – temel + onikili (3×, ksilofonun parlak kısmisi),
  // kemik tıkırtısı (süzgeçli kısa gürültü), minik ahşap gövde. Tizde kısılır (iPad hoparlöründe batmasın).
  function c8Ksil(n, t, vol, pan, hedef, uzun) {
    if (!yerVar(3, t, t + 0.5, false, 1)) return;
    ek(t + 0.12);
    hedef = hedef || B.ksil;
    const f = NOTE(n), v = vol * (n > 86 ? Math.max(0.5, 1 - (n - 86) * 0.04) : 1), dec = (uzun ? 0.62 : 0.36) * (n < 72 ? 1.3 : 1);
    const out = zarf(t, 0.0025, v, dec, panla(hedef, pan));
    const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.02, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.012);
    o.connect(out); o.start(t); o.stop(t + dec + 0.05);
    if (f * 3 < 12000) osc('sine', f * 3, t, t + 0.12, zarf(t, 0.002, 0.28, 0.08, out));
    osc('triangle', f * 2, t, t + 0.07, zarf(t, 0.002, 0.12, 0.045, out));
    if (gurBuf && v > 0.012) {
      const s = ac.createBufferSource(); s.buffer = gurBuf;
      const bp = suzgec('bandpass', cl(f * 4, 1800, 5200), 3, null), ng = zarf(t, 0.001, v * 0.3, 0.014, panla(hedef, pan));
      s.connect(bp); bp.connect(ng); s.start(t, rnd() * 1.5); s.stop(t + 0.03);
    }
  }
  // minik klavsen: iki koro (8' + hafif 4'), çekilişte parlak sonra hızla kararan süzgeç; tepe en çok 5 kHz (sert değil)
  function c8Klav(n, t, vol, pan, hedef, dec) {
    if (!yerVar(2, t, t + 1, false, 1)) return;
    const f = NOTE(n); dec = dec || cl(1.5 - (n - 55) * 0.025, 0.45, 1.5);
    ek(t + dec * 0.5);
    const out = zarf(t, 0.0015, vol, dec, panla(hedef || B.klav, pan));
    const lp = suzgec('lowpass', Math.min(5000, f * 9), 0.9, out);
    lp.frequency.setValueAtTime(Math.min(5000, f * 9), t); lp.frequency.setTargetAtTime(Math.min(2600, f * 2.6), t + 0.004, 0.07);
    osc('sawtooth', f, t, t + dec + 0.05, lp);
    osc('sawtooth', f * 2, t, t + dec * 0.6, kazanc(0.16, lp), 4);
  }
  // oyuncak org: çekmeli sinüsler (1-2-3. harmonik), yumuşak atak, hafif tremolo – kısa, gülümseten "gizemli" org süsleri
  function c8Org(notalar, t, dur, vol, hedef, pan) {
    if (!notalar || !notalar.length || !yerVar(notalar.length * (notalar.length < 3 ? 3 : 2) + 1, t, t + dur + 0.4, true)) return;
    const son = t + dur + 0.45, g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
    g.gain.setValueAtTime(vol, t + Math.max(0.06, dur)); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.06, dur) + 0.35);
    g.connect(panla(hedef || B.org, pan || 0));
    const tr = kazanc(0.8, g), lf = ac.createOscillator(); lf.frequency.value = 5.6; lf.connect(kazanc(0.18, tr.gain)); lf.start(t); lf.stop(son);
    const lp = suzgec('lowpass', 3200, 0.5, tr);
    const ucu = notalar.length < 3;   // kalabalık akorda 3. harmonik yok (ses sayısı)
    for (const n of notalar) { const f = NOTE(n); osc('sine', f, t, son, kazanc(0.6, lp)); osc('sine', f * 2, t, son, kazanc(0.26, lp)); if (ucu && f * 3 < 6000) osc('sine', f * 3, t, son, kazanc(0.1, lp)); }
  }
  // hayalet düdüğü "uuu": vibratolu sinüs, notalar arasında kayarak (portamento), yavaş atak, ayrı yankı (B.hay) – sevimli, kısık.
  // yol: [[t'den sn, nota, (kayış sn)], ...]; son öğenin zamanı bitiş (sonda minik bir iniş)
  function c8Hayalet(yol, t, vol, pan, hedef) {
    if (!yol || yol.length < 2) return;
    const son = t + yol[yol.length - 1][0];
    if (son - t < 0.2 || !yerVar(2, t, son + 0.6, false)) return;
    const o = ac.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(NOTE(yol[0][1]), t);
    for (let i = 1; i < yol.length; i++) {
      const [a, n, k] = yol[i], a0 = yol[i - 1][0], kay = Math.min(k || 0.22, (a - a0) * 0.6);
      if (i === yol.length - 1) { o.frequency.setValueAtTime(NOTE(yol[i - 1][1]), t + a - 0.18); o.frequency.exponentialRampToValueAtTime(NOTE(n) * 0.95, t + a + 0.25); break; }
      o.frequency.setValueAtTime(NOTE(yol[i - 1][1]), t + a - kay); o.frequency.exponentialRampToValueAtTime(NOTE(n), t + a);
    }
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.16);
    g.gain.setValueAtTime(vol, son - 0.12); g.gain.exponentialRampToValueAtTime(0.0001, son + 0.32);
    g.connect(panla(hedef || B.hay, pan || 0));
    const lf = ac.createOscillator(); lf.frequency.value = 5.2 + rnd() * 0.6;
    const lg = ac.createGain(); lg.gain.value = 0; lg.gain.setValueAtTime(0, t + 0.12); lg.gain.linearRampToValueAtTime(26, t + 0.5);
    lf.connect(lg); lg.connect(o.detune); o.connect(g);
    o.start(t); o.stop(son + 0.4); lf.start(t); lf.stop(son + 0.4);
  }
  // parmak şıklatma: kısa süzgeçli "çıt" (2–3 kHz gövde + tiz kıvılcım) ve çok kısık alçak dolgu – sert değil
  function c8Sik(t, v, pan, hedef) {
    hedef = hedef || B.sik;
    gur(t, 0.055, 'bandpass', 2200 + rnd() * 300, 0, 1.6, 0.06 * v, 0.003, pan, 0, hedef);
    gur(t + 0.002, 0.028, 'highpass', 5000, 0, 0.7, 0.013 * v, 0.0025, pan, 0, hedef);
    ton(t, 'sine', 210, 140, 0.032, 0.012 * v, 0.002, pan, 0, hedef);
  }
  // kemik takırtısı: tok tahta "tak" (iki kısa ton + gürültü çıtı)
  function c8Kemik(t, v, pan, hedef, f) {
    f = f || 1100 + rnd() * 300;
    ton(t, 'sine', f, f * 0.9, 0.045, 0.016 * v, 0.0025, pan, 0, hedef);
    ton(t, 'triangle', f * 1.52, f * 1.45, 0.024, 0.005 * v, 0.002, pan, 0, hedef);
    gur(t, 0.016, 'bandpass', Math.min(6000, f * 2.2), 0, 2.5, 0.008 * v, 0.0015, pan, 0, hedef);
  }
  // fagot: tombul, burnundan konuşan tahta üflemeli (testere → kapalı süzgeç + ~480 Hz formant); koru temasında alçaktan "tıpış"
  function c8Fagot(n, t, dur, vol, pan, hedef) {
    if (!yerVar(2, t, t + dur + 0.3, false, 2)) return;
    const f = NOTE(n), g = ac.createGain();
    g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.035);
    g.gain.setTargetAtTime(vol * 0.75, t + 0.045, 0.15); g.gain.setTargetAtTime(0.0001, t + Math.max(0.07, dur), 0.05);
    g.connect(panla(hedef || B.tuba, pan));
    const lp = suzgec('lowpass', Math.min(2600, f * 4.5), 0.6, g), bp = suzgec('bandpass', 480, 1.6, null); bp.connect(kazanc(1.2, g));
    const o = osc('sawtooth', f, t, t + dur + 0.3, lp); o.connect(bp);
    osc('triangle', f, t, t + dur + 0.3, kazanc(0.5, g));
  }
  // müzik pizzicatosu (orta perde akor "pa"ları; efektlerin pizzK'sinden farklı olarak doğrudan yankı göndermez)
  function c8Pizz(n, t, vol, pan, hedef) {
    if (!yerVar(2, t, t + 0.45, false, 1)) return;
    const f = NOTE(n), g = zarf(t, 0.003, vol, 0.32, panla(hedef || B.bas, pan));
    const lp = suzgec('lowpass', Math.min(7000, f * 6), 0.8, g); lp.frequency.setTargetAtTime(f * 2, t, 0.05);
    osc('triangle', f, t, t + 0.4, lp); osc('sine', f * 2, t, t + 0.2, kazanc(0.3, lp));
  }
  // kazan köpüğü: aşağıdan yukarı kayan minik "blup"
  function c8Kabarcik(t, f, vol, pan, hedef) {
    if (!yerVar(1, t, t + 0.2, false)) return;
    const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.9, t + 0.07);
    const g = zarf(t, 0.004, vol, 0.12, panla(hedef || B.hop, pan)); o.connect(g); o.start(t); o.stop(t + 0.16);
  }
  // yaylı kutu "boing": titreşimi sönen yumuşak yay (üçgen + süzgeç)
  function c8Boing(t, v, pan, hedef) {
    if (!yerVar(2, t, t + 0.8, true)) return;
    const o = ac.createOscillator(); o.type = 'triangle';
    o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(520, t + 0.09); o.frequency.exponentialRampToValueAtTime(330, t + 0.6);
    const lf = ac.createOscillator(); lf.frequency.setValueAtTime(13, t); lf.frequency.linearRampToValueAtTime(7, t + 0.6);
    const lg = ac.createGain(); lg.gain.setValueAtTime(240, t); lg.gain.exponentialRampToValueAtTime(8, t + 0.65); lf.connect(lg); lg.connect(o.detune);
    const g = zarf(t, 0.006, 0.03 * v, 0.6, panla(hedef || sfxG, pan)); const lp = suzgec('lowpass', 2200, 0.7, g); o.connect(lp);
    o.start(t); o.stop(t + 0.7); lf.start(t); lf.stop(t + 0.7);
  }
  // ezgi: renk = 'kutu' (müzik kutusu) · 'ksil' (kemik ksilofon) · 'klav' (klavsen) · 'celesta' · 'fagot' (bir oktav alttan, kesik)
  function c8Ezgi(mel, t, adim, renk, guc, f) {
    oncelikli = true;
    try {
      for (const [s, n, u] of mel || []) {
        const ts = t + s * adim + 0.015 + c8Hum(), vurgu = s === 0 || u >= 3;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        if (f < 0.08 && !vurgu && rnd() < 0.25) continue;   // fenerler sönükken süs notaları seyrek
        const pan = cl((n - 80) * 0.035, -0.35, 0.35), dur = u * adim;
        if (renk === 'kutu') { zil(NOTE(n), ts, 0.052 * guc, Math.min(2.2, 0.8 + u * 0.3), pan); if (vurgu) arp(n - 12, ts + 0.01, 0.016 * guc, -pan, 1.4); }
        else if (renk === 'ksil') { c8Ksil(n, ts, 0.06 * guc, pan, B.ksil, u >= 3); if (u >= 3) tus(n + 12, ts + 0.012, 0.011 * guc, 1.2, -pan, true, B.zil); }
        else if (renk === 'klav') { c8Klav(n, ts, 0.03 * guc, pan, B.klav); if (vurgu) c8Klav(n - 12, ts + 0.006, 0.011 * guc, -pan, B.klav); }
        else if (renk === 'celesta') { tus(n, ts, 0.05 * guc, 1.2 + u * 0.2, pan, true, B.zil); if (u >= 3) zil(NOTE(n + 12), ts + 0.01, 0.011 * guc, 1.4, -pan, null, false); }
        else if (renk === 'fagot') { c8Fagot(n - 12, ts, dur * (u >= 3 ? 0.8 : 0.55), 0.034 * guc, pan * 0.5); if (vurgu && f > 0.3) tus(n, ts + 0.01, 0.013 * guc, 1, -pan, true, B.zil); }
      }
    } finally { oncelikli = false; }
  }
  // seyrek tur (nefes): ezgi yok – akor seslerinde süzülen hayalet düdüğü, kemik ksilofon tıkırtısı, çelesta
  function c8Nefes(t, ak, bar, f, h) {
    const ns = akTon(ak, 72, 6, true);
    if (bar % 2 === 0) c8Hayalet([[0, ns[1]], [0.9, ns[3]], [1.8, ns[2]], [2.3, ns[2]]], t + 0.05, 0.015 + 0.0015 * Math.min(h, 3), bar % 4 ? 0.3 : -0.3);
    else { c8Ksil(ns[3], t + 6 * C8 + 0.01, 0.03, 0.3); c8Ksil(ns[2], t + 7 * C8 + 0.01, 0.026, -0.3); }
    if (bar % 4 === 3) tus(ns[5] + 12, t + 0.3, 0.02, 1.8, 0.2, true, B.zil);
    if (h >= 2 && bar % 4 === 2) c8Hayalet([[0, ns[3]], [0.7, ns[4]], [1.3, ns[4]]], t + 1.0, 0.008, -0.35);   // ikinci hayaletçik cevap verir
  }
  // hayaletçikler cümle sonunda "uuu-u" diye cevap verir (üç ve üstünde üçlü aralıkla iki ses)
  function c8HayaletCevap(t, ak, bar, h, vol) {
    const ns = akTon(ak, 74, 6, true), a = ns[2], b = ns[4] || ns[3];
    const yol = bar % 4 === 3 ? [[0, b], [0.55, a], [1.1, ns[1]], [1.6, ns[1]]] : [[0, a], [0.5, b], [1.15, a], [1.6, a]];
    c8Hayalet(yol, t + 4 * C8 + 0.02, vol * (0.85 + 0.08 * Math.min(h, 3)), -0.3);
    if (h >= 3) c8Hayalet(yol.map(([s, n]) => [s, melTonu(ak, n - 3)]), t + 4 * C8 + 0.07, vol * 0.6, 0.35);
  }
  // fener yeni bir katman açınca bir sonraki ölçü onu kısa bir süsle tanıtır ("köy uyanıyor")
  function c8TanitCal(t, ak, a) {
    const kok = c8Kok(ak);
    if (a === 1) { [4, 5, 6, 7].forEach((s, i) => c8Sik(t + s * C8 + 0.004, 0.55 + i * 0.12, i % 2 ? 0.3 : -0.3)); akTon(ak, kok, 4).forEach((n, i) => c8Pizz(n, t + i * 0.15 + 0.01, 0.03, -0.3 + i * 0.2, B.bas)); }
    else if (a === 2) akTon(ak, 62, 9).forEach((n, i) => c8Klav(n, t + 4 * C8 + i * 0.07, 0.012 + i * 0.0006, -0.4 + i * 0.1, B.klav, 0.5));   // klavsen kıvrımı
    else if (a === 3) [[0, 0], [2, 7], [3, 12], [3.5, 7]].forEach(([b, d]) => c8Tuba(kok + d, t + b * 2 * C8 + 0.01, 0.16, 0.05, 0));   // tuba "ım-pa-pa-pam"
    else if (a === 4) {   // org: sevimli-gizemli kısa akor ve mordan (Re–Do#–Re), tef sallanması
      c8Org(ak.pad.slice(1, 4).map(n => n + 12), t + 0.02, 1.1, 0.007);
      [74, 73, 74].forEach((n, i) => c8Org([n], t + 1.25 + i * 0.12, 0.1, 0.005));
      for (let i = 0; i < 6; i++) tef(t + 1.5 + i * 0.1, 0, 0.4 + i * 0.08, i % 2 ? 0.3 : -0.3);
    } else {   // hepsi (neredeyse) yandı: sıcak kabarış + çelesta merdiveni + hayaletçik düeti
      kabar(ak.pad.map(n => n + 12), t + 0.05, 1.1, 0.7, 1.8, 0.011, B.pad, true);
      akTon(ak, 74, 10, true).forEach((n, i) => tus(n, t + 0.3 + i * 0.06, 0.012, 1, -0.5 + i * 0.1, true, B.zil));
      c8HayaletCevap(t, ak, 3, 3, 0.011);
    }
  }
  // ana tema eşliği (4/4, parmak ucu): fenerler yandıkça katman katman dolar
  //   0: müzik kutusu ezgisi + uzun bas · 1 fener: pizz yürüyüş + şıklatma · 3: pizz "pa"lar + klavsen tik-tak (korud harp) · 5: tuba ım-pa
  //   7: tef + cümle sonu org · 10: göksel çan (koro ve yaylılar karışımda açılır)
  function c8Esleme(t, ak, sonraki, bar, f, koru, giris, renk) {
    const kok = c8Kok(ak), hk = c8Kok(sonraki || ak), tubaVar = f >= 0.4 && !giris && renk !== 'fagot';   // fagot ezgisi alçakta: o turda bas pizz kalır
    if (tubaVar) {
      c8Tuba(kok, t + 0.008, 0.2, 0.052 * (0.85 + 0.15 * f), 0); c8Tuba(kok + 7, t + 4 * C8 + 0.008, 0.2, 0.044 * (0.85 + 0.15 * f), 0);
      if (bar % 2) c8Tuba(hk + 1, t + 7 * C8 + 0.008, 0.1, 0.026, 0);   // bir sonraki köke yarım sesle yaklaşma
    } else {
      const yol = [kok, kok + 7, kok + 12, bar % 2 ? hk + 1 : kok + 7];
      for (let b = 0; b < 4; b++) { if (f < 0.08 && b % 2) continue; bas(yol[b], t + b * 2 * C8 + 0.008, (b % 2 ? 0.052 : 0.065) * (0.8 + 0.25 * f), 'pizz'); }
    }
    if (f >= 0.08) [1, 3].forEach(b => c8Sik(t + b * 2 * C8 + 0.004, (0.45 + 0.5 * sm(0.08, 0.5, f)) * (koru ? 0.75 : 1), b === 1 ? -0.25 : 0.25));
    if (f >= 0.24) [1, 3].forEach(b => ak.pad.slice(1, 4).forEach((n, i) => c8Pizz(n + 12, t + b * 2 * C8 + 0.014 + i * 0.008, 0.012 * sm(0.24, 0.5, f) * (tubaVar ? 1.2 : 1), (i - 1) * 0.3, B.bas)));
    if (f >= 0.24 && !koru && renk !== 'klav') { const tn = akTon(ak, 62, 4); [1, 3, 5, 7].forEach((s, i) => c8Klav(tn[(i + bar) % 4], t + s * C8 + 0.006, 0.0085 * sm(0.24, 0.5, f), (i - 1.5) * 0.22, B.klav, 0.45)); }
    if (koru && f >= 0.24) { const tn = akTon(ak, ak.bas + 24, 6); [0, 2, 4, 6].forEach((s, i) => arp(tn[[0, 2, 4, 3][i]], t + s * C8 + 0.01, 0.016, (i - 1.5) * 0.25, 1.6)); }
    if (f >= 0.58 && !koru) { tef(t + 0.004, 0.35, 0, 0); for (let s = 1; s < 8; s += 2) tef(t + s * C8 + 0.004, 0, 0.38, s % 4 === 1 ? 0.25 : -0.25); }
    else if (f >= 0.58 && bar % 2 === 1) tef(t + 6 * C8 + 0.004, 0, 0.4, 0.3);
    if (f >= 0.58 && (bar === 7 || bar === 15)) c8Org(ak.pad.slice(1).map(n => n + 12), t + 4 * C8 + 0.01, 4 * C8 * 0.95, 0.0055);
    const kn = f >= 0.4 ? 1 + (rnd() < f ? 1 : 0) : rnd() < 0.3 ? 1 : 0;
    if (kn) { const c = akTon(ak, 86, 6, true); for (let i = 0; i < kn; i++) cam(NOTE(sec(c)), t + 0.2 + rnd() * 2, 0.005 + 0.004 * f, 1.3 + rnd() * 0.6, rnd() * 1.4 - 0.7, null, rnd() < 0.5); }
    if (f >= 0.82 && bar % 2 === 0) sopranoCan(akTon(ak, 88, 4, true)[bar % 4 ? 2 : 1], t + 4 * C8, 0.01, bar % 4 ? -0.3 : 0.3);
    if (f < 0.08) bas(kok, t + 0.01, 0.035, 'uzun', BAR * 0.9);
  }
  // giris / tarla ('cadi') ve koru ('koru8'): döngü döngü renk değişir – 0 müzik kutusu (koruda fagot) · 1 kemik ksilofon (cadı kostümünde klavsen;
  // koruda çelesta) · 2 klavsen / çelesta (koruda ksilofon + müzik kutusu) · 3 nefes (hayalet düdüğü)
  function c8AnaCubuk(t, ak, pi, koru) {
    const f = c8S, bar = pi & 15, v = dongu % 4, B2 = bar >= 8, h = c8HaySay(), kost = v8Al('kostum');
    const mel = (koru ? K8_MEL : C_MEL)[bar];
    let renk = koru ? (v === 0 ? 'fagot' : v === 1 ? 'celesta' : v === 2 ? (B2 ? 'kutu' : 'ksil') : null)
      : (v === 0 ? 'kutu' : v === 1 ? (kost === 'cadi' ? 'klav' : 'ksil') : v === 2 ? (B2 ? 'celesta' : kost === 'cadi' ? 'ksil' : 'klav') : null);
    if (f < 0.08) renk = koru ? 'fagot' : 'kutu';   // fenerler sönükken: müzik kutusu (koruda fagot), seyrek tur da ezgili
    if (renk) c8Ezgi(mel, t, C8, renk, 0.9 + 0.12 * f, f);
    else c8Nefes(t, ak, bar, f, h);
    if (renk === 'fagot' && f > 0.4 && B2) c8Ezgi(mel, t + 0.01, C8, 'kutu', 0.45, f);   // fenerler çoğalınca fagota müzik kutusu eşlik eder
    if (renk && B2 && (h > 0 || f > 0.55) && (bar === 11 || bar === 15)) c8HayaletCevap(t, ak, bar, h, 0.015);
    const pr = PROG[progAd], sonraki = AK[pr.ak[(pi + 1) % pr.ak.length]];
    c8Esleme(t, ak, sonraki, bar, f, koru, c8Bolge === 'giris', renk);
    if (c8Tanit) { const a = c8Tanit; c8Tanit = 0; c8TanitCal(t, ak, a); }
  }
  // kabak yüzü (12/8): hoplayan "bup" ezgisi + kemik ksilofon / çelesta; tuba 1-3, şıklatma 2-4, klavsen akorları. Oyun başlamadıysa hafif.
  function c8YuzCubuk(t, ak, pi) {
    const k = pi & 7, tur = dongu % 2, aktif = c8Yuz || (d0 && d0.yuz8), guc = aktif ? cl((zaman() - c8YuzT0) / 3, 0.65, 1) : 0.6;
    oncelikli = true;
    try {
      for (const [s, n, u] of KY8_MEL[k] || []) {
        const ts = t + s * C12 + 0.015 + c8Hum(), pan = cl((n - 80) * 0.04, -0.35, 0.35);
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        hop(n, ts, 0.04 * guc * (s === 0 || u >= 2 ? 1 : 0.85), pan);
        if (u >= 2) { if (tur) tus(n, ts + 0.005, 0.022 * guc, 0.8 + u * 0.15, -pan, true, B.zil); else c8Ksil(n, ts + 0.004, 0.026 * guc, -pan); }
      }
    } finally { oncelikli = false; }
    const kok = c8Kok(ak);
    c8Tuba(kok, t + 0.01, 0.22, 0.055 * guc, 0); c8Tuba(kok + 7, t + 6 * C12 + 0.01, 0.2, 0.045 * guc, 0);
    [3, 9].forEach(s => { c8Sik(t + s * C12 + 0.003, 0.7 * guc + 0.1, s === 3 ? -0.25 : 0.25); ak.pad.slice(1, 4).forEach((n, i) => c8Klav(n + 12, t + s * C12 + 0.008 + i * 0.01, 0.009 * guc, (i - 1) * 0.3, B.klav, 0.4)); });
    if (aktif) [1, 2, 4, 5, 7, 8, 10, 11].forEach(s => tef(t + s * C12 + 0.004, 0, (s % 3 === 1 ? 0.3 : 0.42) * guc, s < 6 ? -0.2 : 0.2));
    if (k % 2 === 1) akTon(ak, 84, 5, true).forEach((n, i) => cam(NOTE(n), t + 1.6 + i * 0.08, 0.008, 1.3, -0.4 + i * 0.2, null, i > 3));   // oyma ışıltısı
    if (k === 7 && aktif) ton(t + 9 * C12, 'sine', 700, 1350, 0.32, 0.004, 0.08, 0.2, 1, B.hop);   // döngü sonunda minik kaydırma düdüğü "fiyuu"
    if (k === 3 && tur) c8Hayalet([[0, 81], [0.4, 86], [0.9, 84], [1.2, 84]], t + 6 * C12, 0.009, -0.3);
  }
  // iskelet orkestrası eşliği (112 BPM, hafif swing): melodiyi çocuk iskeletlere dokunarak çalar; eşlik ezginin altında kalır.
  // Oyun başlamadan (bölgede bekleyiş): yalnız bas + şıklatma + seyrek ksilofon çağrısı. Başlayınca akor çocuğun cümlesini izler.
  // Büyük kemik dansı ('iskeletDans' 5) başlayınca eşlik susar; dansı ve "ta-da"yı efekt çalar.
  function c8IskCubuk(t, ak, pi) {
    const uz = cubukUz, now = zaman();
    if (c8IskFin > -1e8 && t >= c8IskFin - 0.05) return;
    const basli = c8Isk || c8IskTamam, guc = basli ? cl((now - c8IskT0) / 2.5, 0.7, 1) : 0.55;
    const k = pi & 3, kok = c8Kok(ak);
    const sonAk = c8Isk ? AK[ISK_CUMLE_AK[Math.min(3, (c8IskN >> 2) + 1)]] : AK[PROG.iskeletMini.ak[(pi + 1) & 3]], hk = c8Kok(sonAk || ak);
    const vT = v => iskZ(t, v), icinde = v => v * ISK_V < uz - 0.02;
    const yol = [kok, kok + 7, kok + 12, hk === kok ? kok + 7 : hk + 1];   // zıplayan bas: kök – beşli – oktav – yaklaşma
    for (let b = 0; b < 4; b++) if (icinde(b)) c8Tuba(yol[b], vT(b) + 0.005, b === 0 ? 0.22 : 0.16, (b === 0 ? 0.058 : 0.046) * guc, 0);
    if (basli && icinde(3.5)) c8Tuba(hk === kok ? kok + 12 : hk + 12, vT(3.5) + 0.005, 0.09, 0.024 * guc, 0);   // swing'li ara nota
    [1, 3].forEach(b => { if (icinde(b)) c8Sik(vT(b) + 0.003, 0.65 + 0.35 * guc, b === 1 ? -0.3 : 0.3); });
    if (guc > 0.5) [1.5, 3.5].forEach(v => { if (icinde(v)) ak.pad.slice(1, 4).forEach((n, i) => c8Klav(n < 57 ? n + 12 : n, vT(v) + i * 0.008, 0.0095 * guc, (i - 1) * 0.3, B.klav, 0.35)); });
    if (basli) for (let v = 0; v < 4; v += 0.5) if (icinde(v)) tef(vT(v) + 0.004, v === 0 ? 0.35 * guc : 0, (v % 1 ? 0.5 : 0.28) * guc, v % 1 ? 0.2 : -0.2);
    if (basli && (k % 2 === 0 || c8Isk)) c8Org(ak.pad.slice(1, 4), t + 0.02, uz * 0.92, 0.004 * guc);
    if (basli && k === 3) [3, 3.5, 3.75].forEach((v, i) => { if (icinde(v)) c8Kemik(vT(v), 0.6, i % 2 ? 0.35 : -0.35, B.sik, 1000 + i * 160); });
    if (!basli && k % 2 === 1) [0, 3, 5].forEach((j, q) => { if (icinde(2 + q * 0.5)) c8Ksil(ISK_NOTA[j] - 12, vT(2 + q * 0.5), 0.02, (q - 1) * 0.3); });   // sahneye davet
  }
  // sokak: şeker mi şaka mı yürüyüşü – tuba ım-pa, 2-4'te pizz "pa" + şıklatma, tef; kapılar çalındıkça şenlenir
  function c8SokakCubuk(t, ak, pi) {
    const bar = pi & 15, v = dongu % 4, B2 = bar >= 8, f = Math.max(c8S, 0.5), kapi = Math.min(6, Math.max(c8Kapi, +v8Al('kapi') || 0));
    const dolu = cl(0.6 + kapi * 0.07, 0.6, 1);
    const renk = v === 0 ? 'ksil' : v === 1 ? 'klav' : v === 2 ? (B2 ? 'celesta' : 'kutu') : null;
    if (renk) {
      c8Ezgi(S8_MEL[bar], t, C8, renk, 0.95 + 0.1 * dolu, f);
      if (renk === 'ksil') { oncelikli = true; try { for (const [s, n, u] of S8_MEL[bar]) if (u >= 2 || s === 0) zil(NOTE(n + 12), t + s * C8 + 0.02, 0.012 * dolu, 1, 0.2, null, false); } finally { oncelikli = false; } }   // glokenşpil
    } else {   // seyrek tur: ezginin yerine kapı vuruşu "tak-tak" + hayalet "uuu"
      [4, 5].forEach((s, i) => c8Kemik(t + s * C8 + 0.005, 0.8 - i * 0.15, 0.2, B.sik, 900 - i * 80));
      if (bar % 2 === 0) { const ns = akTon(ak, 74, 5, true); c8Hayalet([[0, ns[0]], [0.6, ns[2]], [1.2, ns[1]], [1.7, ns[1]]], t + 0.05, 0.011, -0.25); }
    }
    const kok = c8Kok(ak);
    c8Tuba(kok, t + 0.01, 0.2, 0.058, 0); c8Tuba(bar % 2 ? kok + 7 : kok + 12, t + 4 * C8 + 0.01, 0.2, 0.048, 0);
    [2, 6].forEach(s => { c8Sik(t + s * C8 + 0.003, 0.85, s === 2 ? -0.25 : 0.25); ak.pad.slice(1, 4).forEach((n, i) => c8Pizz(n + 12, t + s * C8 + 0.012 + i * 0.008, 0.014, (i - 1) * 0.3, B.bas)); });
    tef(t + 0.004, 0.45, 0, 0);
    if (dolu > 0.65) for (let s = 1; s < 8; s += 2) tef(t + s * C8 + 0.004, 0, 0.42 * dolu, s % 4 === 1 ? 0.25 : -0.25);
    if (bar % 4 === 3) akTon(ak, 84, 6, true).forEach((n, i) => cam(NOTE(n), t + 1.5 + i * 0.07, 0.008, 1.2, -0.5 + i * 0.2, null, i > 4));
    if ((bar === 7 || bar === 15) && dolu > 0.7) c8Org(ak.pad.slice(1).map(n => n + 12), t + 4 * C8, 4 * C8 * 0.95, 0.0055);
    if (renk && B2 && bar % 4 === 1 && c8HaySay() > 0) c8HayaletCevap(t, ak, bar, c8HaySay(), 0.01);
  }
  // Cadı Nine'nin kazanı: köpüklü cadı valsi (ım-pa-pa), fokurdayan kabarcıklar akordan; oyun başlamadan (bahçede) hafif, bitince sıcak
  function c8KazanCubuk(t, ak, pi) {
    const bar = pi & 15, v = dongu % 3, aktif = c8Kazan || (d0 && d0.kazan8), guc = aktif ? cl((zaman() - c8KazanT0) / 3, 0.65, 1) : c8Tamam('kazan') ? 0.8 : 0.55;
    const renk = v === 0 ? (guc < 0.6 ? 'kutu' : 'celesta') : v === 1 ? 'klav' : 'ksil';
    c8Ezgi(KZ8_MEL[bar], t, C12, renk, 0.8 + 0.2 * guc, 1);
    const kok = c8Kok(ak);
    c8Tuba(kok, t + 0.01, 0.24, 0.056 * guc, 0); c8Tuba(bar % 2 ? kok + 7 : kok, t + 6 * C12 + 0.01, 0.24, 0.048 * guc, 0);
    [2, 4, 8, 10].forEach(s => ak.pad.slice(1, 4).forEach((n, i) => c8Pizz(n + 12, t + s * C12 + 0.01 + i * 0.008, (s % 6 === 2 ? 0.014 : 0.011) * guc, (i - 1) * 0.3, B.bas)));
    const kp = akTon(ak, 62, 8, true), kn = 2 + Math.round(3 * guc * rnd());
    for (let i = 0; i < kn; i++) c8Kabarcik(t + rnd() * 2.3, NOTE(sec(kp)), 0.012 * guc, rnd() - 0.5, B.hop);
    if (guc > 0.6) [0, 6].forEach(s => tef(t + s * C12 + 0.004, 0.3, 0.4, s ? 0.2 : -0.2));
    if (bar >= 8 && bar % 2 === 1) c8HayaletCevap(t, ak, bar, Math.max(1, c8HaySay()), 0.009);
    if (bar === 7 || bar === 15) akTon(ak, 74, 10, true).forEach((n, i) => tus(n, t + 1.2 + i * 0.07, 0.011 + i * 0.0006, 1.1, -0.5 + i * 0.1, true, B.zil));   // şapka ışıltısı
    if (guc >= 0.8 && bar % 4 === 0) c8Org(ak.pad.slice(1, 4).map(n => n + 12), t + 0.02, 1.1, 0.0045);
  }
  // süpürge yolculuğu bölüm seçici: kalkış (A) → gece (B, döner) → ay anı ('supurgeAy' ya da yolculuğun ~%36'sı; 4 ölçü Re majör) → köy (A+B, şenlikli)
  function c8UcusSec(t) {
    if (c8UcusB0 < 0) c8UcusB0 = t;
    const oran = d0 && d0.oran8 || 0;
    if (c8AyB0 < 0 && ((c8AyT > -1e8 && t >= c8AyT - 0.4) || (c8AyT < -1e8 && oran >= 0.36 && t - c8UcusB0 > 12))) c8AyB0 = t;
    if (c8AyB0 >= 0) {
      const k = Math.round((t - c8AyB0) / 2);
      if (k < 4) { c8UcusFB = { tur: 'ay', k }; return 16 + k; }
      const j = k - 4; c8UcusFB = { tur: 'koy', k: j }; return j % 16;
    }
    const k = Math.round((t - c8UcusB0) / 2); c8UcusFB = { tur: k < 8 ? 'kalkis' : 'gece', k }; return k < 8 ? k : 8 + (k - 8) % 8;
  }
  function c8UcusCubuk(t, ak, pi) {
    const { tur, k } = c8UcusFB, gir = cl((zaman() - c8UcusT0) / 3, 0.55, 1), ay = tur === 'ay', koy = tur === 'koy';
    oncelikli = true;
    try {
      for (const [s, n, u] of UC8_MEL[pi] || []) {
        const ts = t + s * U16 + 0.015, pan = cl((n - 84) * 0.04, -0.35, 0.35), dur = u * U16;
        if (ts >= ezgiSusT0 && ts < ezgiSusT1) continue;
        flut(n, ts, dur * 0.95, (ay ? 0.026 : 0.03) * gir, pan);
        tus(n, ts + 0.005, (ay ? 0.03 : 0.022) * gir, 1.2 + dur * 0.4, -pan, true, B.zil);
        if (koy && u >= 4) c8Ksil(n - 12, ts + 0.008, 0.022, pan * 0.5);
        if ((ay || u >= 8) && n + 12 <= 100) cam(NOTE(n + 12), ts + 0.03, ay ? 0.01 : 0.008 * gir, ay ? 2.4 : 2, -pan, null, false);
      }
    } finally { oncelikli = false; }
    if (ay) { c8AyAni(t, ak, k); return; }
    const tn = akTon(ak, 62, 6), yol = [0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1];   // hız: 16'lık klavsen arpeji
    for (let s = 0; s < 16; s++) c8Klav(tn[yol[s]], t + s * U16 + 0.005, (s % 4 === 0 ? 0.012 : 0.0075) * gir, (yol[s] - 2.5) * 0.15, B.klav, 0.28);
    const kok = c8Kok(ak);
    c8Tuba(kok, t + 0.008, 0.2, 0.058 * gir, 0); c8Tuba(kok + 7, t + 4 * U8 + 0.008, 0.2, 0.05 * gir, 0);
    [2, 6].forEach(s => { bas(kok + 12, t + s * U8 + 0.008, 0.032 * gir, 'pizz'); c8Sik(t + s * U8 + 0.003, 0.75 * gir, s === 2 ? -0.25 : 0.25); });
    tef(t + 0.004, 0.5 * gir, 0, 0);
    for (let s = 1; s < 16; s += koy ? 1 : 2) tef(t + s * U16 + 0.004, 0, (koy ? 0.36 : 0.45) * gir * (s % 2 ? 1 : 0.6), s % 4 < 2 ? 0.2 : -0.2);
    if (k % 4 === 3) { const g = akTon(ak, 64, 12, true); g.forEach((n, i) => arp(n, t + 1.0 + i * 0.075, 0.011 + 0.008 * i / 12, -0.6 + i * 0.1, 1.3)); }   // rüzgâr gibi yükselen arp
    const c = akTon(ak, 86, 6, true); for (let i = 0; i < 2; i++) cam(NOTE(sec(c)), t + 0.2 + rnd() * 1.6, 0.006, 1.4, rnd() * 1.4 - 0.7, null, rnd() < 0.5);
    if (koy && k % 2 === 0) c8Org(ak.pad.slice(1).map(n => n + 12), t + 0.02, 3.8, 0.004);
  }
  // ay anı (Re majör, yarım zaman): yavaşlayan süzülüş – geniş perde, uzun arp, soprano çanları, iki hayaletçik "uuu" düeti (koro ve yaylılar karışımda)
  function c8AyAni(t, ak, k) {
    perde(ak, t + 0.02, 2 * 1.1, 0.022);
    const g = akTon(ak, ak.bas + 24, 12, true); g.forEach((n, i) => arp(n, t + 0.05 + i * 0.13, 0.012 + 0.006 * i / 12, -0.6 + i * 0.1, 2));
    bas(c8Kok(ak), t + 0.01, 0.05, 'uzun', 2 * 0.95);
    sopranoCan(akTon(ak, 88, 3, true)[k % 3], t + 1.0, 0.012, k % 2 ? 0.3 : -0.3);
    tef(t + 0.004, 0, 0.3, 0); tef(t + 4 * U8 + 0.004, 0, 0.22, 0.2);
    if (k % 2 === 0) { const ns = akTon(ak, 76, 6, true), yol = [[0, ns[2]], [0.9, ns[4]], [2.2, ns[3]], [3.6, ns[3]]]; c8Hayalet(yol, t + 0.1, 0.011, -0.35); c8Hayalet(yol.map(([s, n]) => [s, melTonu(ak, n - 4)]), t + 0.16, 0.007, 0.35); }
  }
  // meydan (120 BPM): şenlik hazırlığı – tuba ım-pa, şıklatma, pizz "pa"; ksilofonda uzaktan ana motif; tef giderek artar
  function c8MeydanCubuk(t, ak, pi) {
    const k = pi & 3, gir = cl((t - c8ProgT0) / 6, 0.35, 1), kok = c8Kok(ak);
    c8Tuba(kok, t + 0.008, 0.2, 0.055, 0); c8Tuba(kok + 7, t + 4 * U8 + 0.008, 0.2, 0.046, 0);
    [2, 6].forEach(s => { c8Sik(t + s * U8 + 0.003, 0.8, s === 2 ? -0.28 : 0.28); ak.pad.slice(1, 4).forEach((n, i) => c8Pizz(n + 12, t + s * U8 + 0.01 + i * 0.007, 0.013, (i - 1) * 0.3, B.bas)); });
    for (let s = 1; s < 8; s += 2) tef(t + s * U8 + 0.004, 0, 0.5 * gir, s % 4 === 1 ? 0.2 : -0.2);
    if (gir > 0.6) tef(t + 0.004, 0.4 * gir, 0, 0);
    if (k === 0 || k === 2) c8Ezgi(C_MEL[k === 0 ? 0 : 4], t, U8, 'ksil', 0.75, 1);
    else if (k === 3) c8Ezgi(C_MEL[7], t, U8, 'klav', 0.7, 1);   // kromatik tırmanış: şenlik başlıyor gibi
    else akTon(ak, 84, 5, true).forEach((n, i) => cam(NOTE(n), t + 1.0 + i * 0.07, 0.008, 1.2, -0.4 + i * 0.2, null, i > 3));
    if (k % 2 === 0) c8Org(ak.pad.slice(1).map(n => n + 12), t + 0.02, 3.8, 0.0035 * gir);
  }
  // final bölüm seçici: ölçüler finalin saatine oturur (c8FinT0 + 2·k sn; kabak.js cadiFinalNabiz ile aynı vuruş). İlk ölçü hizalama ön vuruşu
  // (bir sonraki çift saniyeye kadar, 0,45–2,45 sn). 1 giriş · 2–9 A (ana tema, tam şenlik) · 10–13 B (13: doruğa kabarış) · 14–16 DORUK
  // (35 sn'lik finalde 28. sn = 15. ölçü; 'cadiDoruk' daha erken gelirse bir sonraki ölçüde) · 17 son (34. sn, sıcak Re majör) · 18+ sükûn (sabaha)
  function c8FinalSec(t) {
    if (c8FinT0 < -1e8) c8FinT0 = t;
    const e = t - c8FinT0;
    if (c8FinHiza < 0) { c8FinHiza = Math.ceil((e + 0.45) / 2) * 2; c8FinUz = c8FinHiza - e; c8FB = { tur: 'on', k: 0 }; return 20; }
    c8FinUz = 2;
    const b = Math.round(e / 2), dB0 = Math.max(4, Math.round(c8FinSure * 0.8 / 2));
    if (c8DorukB < 0 && (b >= dB0 || (c8DorukT > -1e8 && t >= c8DorukT - 0.4))) { c8DorukB = b; c8DorukVurgu = true; }
    if (c8SonB < 0 && (c8SonIste || (c8DorukB >= 0 && b >= c8DorukB + 3))) c8SonB = b;
    if (c8SonB >= 0) { const k = b - c8SonB; c8FB = k < 1 ? { tur: 'son', k } : { tur: 'sukun', k: k - 1 }; return k < 1 ? 17 : 18 + ((k - 1) & 1); }
    if (c8DorukB >= 0) { const k = b - c8DorukB; c8FB = { tur: 'doruk', k }; return 14 + Math.min(k, 2); }
    if (b < 2) { c8FB = { tur: 'giris', k: b }; return 1; }
    if (b < 10) { c8FB = { tur: 'A', k: b - 2 }; return b; }
    const k = (b - 10) % 4; c8FB = { tur: 'B', k, kabar: b + 1 === dB0 }; return 10 + k;
  }
  // tam şenlik eşliği (120 BPM): tuba ım-pa (oktav zıplar), 2-4'te pizz "pa" + şıklatma, klavsen ara vuruşlarda, tef, iki ölçüde bir org yastığı
  function c8Parti(t, ak, k, guc, dolu, doruk) {
    const kok = c8Kok(ak);
    c8Tuba(kok, t + 0.008, 0.2, 0.062 * guc, 0); c8Tuba(k % 2 ? kok + 7 : kok + 12, t + 4 * U8 + 0.008, 0.2, 0.052 * guc, 0);
    if (dolu) c8Tuba(kok + 7, t + 3 * U8 + 0.008, 0.1, 0.028 * guc, 0);
    [2, 6].forEach(s => { c8Sik(t + s * U8 + 0.003, guc, s === 2 ? -0.28 : 0.28); ak.pad.slice(1, 4).forEach((n, i) => c8Pizz(n + 12, t + s * U8 + 0.01 + i * 0.007, 0.016 * guc, (i - 1) * 0.3, B.bas)); });
    const tn = akTon(ak, 62, 4);
    [1, 3, 5, 7].forEach((s, i) => c8Klav(tn[(i + k) % 4], t + s * U8 + 0.006, 0.009 * guc, (i - 1.5) * 0.25, B.klav, 0.4));
    tef(t + 0.004, 0.6 * guc, 0, 0);
    for (let s = 1; s < (doruk ? 16 : 8); s += 2) tef(t + s * (doruk ? U16 : U8) + 0.004, 0, (doruk ? 0.45 : 0.55) * guc, s % 4 < 2 ? 0.2 : -0.2);
    if (k % 2 === 0) c8Org(ak.pad.slice(1).map(n => n + 12), t + 0.02, 3.8, 0.0045 * guc);
    if (k % 4 === 3) akTon(ak, 74, 4, true).forEach((n, i) => c8Ksil(n, t + (6 + i * 0.5) * U8, 0.024, (i - 1.5) * 0.3));
  }
  // doruğa kabarış (B'nin son ölçüsü, 26–28. sn): kromatik tırmanış, yükselen tef sağanağı, yukarı kayan hayalet "uuuu", org ve arp kabarışı
  function c8Kabaris(t, ak) {
    c8Ezgi(F8_KABAR[0], t, U8, 'ksil', 1.1, 1);
    oncelikli = true; try { for (const [s, n] of F8_KABAR[0]) tus(n + 12, t + s * U8 + 0.01, 0.014, 0.8, 0.2, true, B.zil); } finally { oncelikli = false; }
    const kok = c8Kok(ak);
    [0, 1, 2, 3].forEach(b => c8Tuba(kok + (b === 3 ? 7 : 0), t + b * 2 * U8 + 0.008, 0.18, 0.05 + b * 0.006, 0));
    for (let s = 0; s < 16; s++) tef(t + s * U16 + 0.004, s % 4 === 0 ? 0.3 + s * 0.03 : 0, 0.25 + s * 0.04, s % 2 ? 0.25 : -0.25);
    c8Hayalet([[0, 74], [1.6, 86, 1.5], [1.95, 86]], t + 0.02, 0.01, 0.2);
    c8Org(ak.pad.slice(1).map(n => n + 12), t + 0.02, 1.9, 0.006);
    const g = akTon(ak, 62, 16, true); g.forEach((n, i) => arp(n, t + 1.0 + i * 0.06, 0.012 + 0.008 * i / 16, -0.6 + i * 0.08, 1.2));
  }
  function c8FinalCubuk(t, ak, pi) {
    const { tur, k } = c8FB, fisekVar = zaman() - s6FisekT < 6, fisek = (g, n) => { if (fisekVar) return; for (let i = 0; i < n; i++) havaiFisek(t + 0.2 + rnd() * 1.4, g, (rnd() < 0.5 ? -1 : 1) * (0.3 + rnd() * 0.4)); };
    if (tur === 'on') {   // ön vuruş: final saatinin ilk vuruşuna yükselen tef şıkırtısı + klavsen glissandosu
      const L = c8FinUz, ns = akTon(AK.CDm, 50, cl(Math.round(L / 0.1), 5, 22));
      ns.forEach((n, i) => c8Klav(n, t + L * Math.pow(i / ns.length, 0.9), 0.01 + 0.008 * i / ns.length, -0.5 + i / ns.length, B.klav, 0.5));
      for (let x = 0; x < L - 0.06; x += U16) tef(t + x + 0.004, 0, 0.25 + 0.5 * x / L, (x / U16) % 2 ? 0.2 : -0.2);
      return;
    }
    if (tur === 'giris') { c8Ezgi(C_MEL[7], t, U8, 'ksil', 1, 1); c8Parti(t, ak, 1, 0.9, false, false); }
    else if (tur === 'A') {   // ana tema tam şenlikte: kemik ksilofon + glokenşpil, ikinci yarıda klavsen bir oktav altta
      c8Ezgi(C_MEL[k], t, U8, 'ksil', 1.05, 1);
      oncelikli = true;
      try { for (const [s, n, u] of C_MEL[k]) { if (u >= 2 || s === 0) zil(NOTE(n + 12), t + s * U8 + 0.02, 0.014, 1.2, 0.2, null, false); if (k >= 4) c8Klav(n - 12, t + s * U8 + 0.01, 0.012, -0.2, B.klav, 0.4); } } finally { oncelikli = false; }
      c8Parti(t, ak, k, 1, k >= 4, false);
      if (k % 2 === 1 && rnd() < 0.7) fisek(0.75, 1);
    } else if (tur === 'B') {
      if (c8FB.kabar) c8Kabaris(t, ak);
      else {   // hayaletçikler ve hayalet teyze ezgiyi "uuu" diye birlikte söyler
        const m = C_MEL[8 + k], yol = m.map(([s, n]) => [s * U8, n]); yol.push([8 * U8 - 0.05, m[m.length - 1][1]]);
        c8Ezgi(m, t, U8, 'celesta', 1.05, 1);
        c8Hayalet(yol, t + 0.02, 0.009, 0.3);
        c8Parti(t, ak, k, 1, true, false);
      }
      if (rnd() < 0.6) fisek(0.8, 1);
    } else if (tur === 'doruk') {   // DORUK: Re majör – ana motif çelesta + ksilofon + müzik kutusu, 16'lık tef, perde, çanlar, fişekler
      const mel = F8_DORUK[Math.min(k, 2)];
      c8Ezgi(mel, t, U8, 'celesta', 1.1, 1);
      oncelikli = true;
      try { for (const [s, n] of mel) { c8Ksil(n - 12, t + s * U8 + 0.012, 0.03, -0.2); zil(NOTE(n), t + s * U8 + 0.02, 0.02, 1.4, 0.25, null, false); } } finally { oncelikli = false; }
      c8Parti(t, ak, k, 1.08, true, true);
      perde(ak, t + 0.02, 2 * 1.05, 0.02);
      sopranoCan(akTon(ak, 88, 4, true)[k % 3], t + 2 * U8, 0.012, k % 2 ? 0.3 : -0.3);
      if (c8DorukVurgu) {   // doruğun ilk vuruşu: büyük akor + çan dizisi
        c8DorukVurgu = false;
        oncelikli = true;
        try {
          kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.01, 0.4, 1.2, 2.6, 0.02, sahneG, true);
          for (let i = 0; i < 10; i++) cam(NOTE(akorTonu(ak, 84 + i * 1.3 | 0)), t + 0.2 + i * 0.09, 0.013, 2.2, i % 2 ? 0.5 : -0.5, null, false);
        } finally { oncelikli = false; }
      }
      fisek(1, 1 + (rnd() < 0.5 ? 1 : 0));
    } else if (tur === 'son') {   // sıcak kapanış: Re majör akor, müzik kutusu La–Fa#–Re, ksilofon tremolosu, tuba, çanlar
      c8Ezgi(F8_SON[0], t, U8, 'kutu', 1, 1);
      c8Tuba(50, t + 0.01, 0.6, 0.06, 0); bas(50, t, 0.06, 'uzun', 2 * 1.6);
      for (let i = 0; i < 10; i++) c8Ksil([74, 78, 81, 86][i % 4], t + 0.02 + i * 0.07, 0.022 - i * 0.0015, (i % 4 - 1.5) * 0.25);
      akTon(ak, 62, 9).reverse().forEach((n, i) => arp(n, t + 0.4 + i * 0.12, 0.02, 0.5 - i * 0.12, 2.2));
      [86, 90, 93].forEach((n, i) => zil(NOTE(n), t + 0.8 + i * 0.35, 0.014, 2.6, (i - 1) * 0.4, null, false));
      c8Org(ak.pad.slice(1).map(n => n + 12), t + 0.02, 1.6, 0.006);
    } else {   // sükûn: sabaha kadar yumuşak müzik kutusu (Re majörde Feza'nın üç–iki–biri) ve seyrek ışıltı
      const m = k % 2 ? [[0, 83, 3], [3, 81, 3], [6, 79, 2]] : [[0, 78, 3], [3, 76, 3], [6, 74, 2]];
      oncelikli = true;
      try { m.forEach(([s, n, u], i) => zil(NOTE(n), t + s * U8 + 0.02, 0.03 - i * 0.003, 1.2 + u * 0.25, (i - 1) * 0.25)); } finally { oncelikli = false; }
      bas(c8Kok(ak), t, 0.045, 'uzun', 2 * 0.9);
      const c = akTon(ak, 86, 6, true); for (let i = 0; i < 2; i++) cam(NOTE(sec(c)), t + 0.3 + rnd() * 1.4, 0.006, 1.6, rnd() - 0.5, null, true);
    }
  }
  // bu ölçünün süresi: iskelet 112 BPM ('iskeletBasla' anına hizalayan ön ölçü), uçuş/meydan/final 120 BPM, diğerleri 2.4 sn
  function c8Uz(p, t) {
    if (p === 'cadiFinal') return c8FinUz;
    if (p === 'iskeletMini') {
      if (c8IskHiza && c8IskT0 > -1e8) {
        c8IskHiza = false;
        const off = (((t - c8IskT0) % ISK_BAR) + ISK_BAR) % ISK_BAR;
        if (off > 0.03 && off < ISK_BAR - 0.03) return ISK_BAR - off;
      }
      return ISK_BAR;
    }
    return p === 'supurgeMini' || p === 'meydan8' ? 2 : BAR;
  }
  // akor seçimi: iskelet oyunu sürerken çocuğun cümlesi (Dm · F · Gm/C · Dm); büyük dansta Dm
  function c8AkorSec(akAd, t) {
    if (progAd !== 'iskeletMini' || !c8Isk) return akAd;
    return c8IskFin > -1e8 && t >= c8IskFin - 0.05 ? 'IDm' : ISK_CUMLE_AK[Math.min(3, c8IskN >> 2)];
  }
  function c8Cubuk(t, ak, pi) {
    const vur = progAd === 'iskeletMini' ? cubukUz / ISK_V : progAd === 'supurgeMini' || progAd === 'meydan8' || progAd === 'cadiFinal' ? cubukUz / 0.5 : progAd === 'kazanMini' ? 6 : 4;
    c8Cubuklar.push({ t, uz: cubukUz, vur, prog: progAd }); if (c8Cubuklar.length > 6) c8Cubuklar.shift();
    if (progAd === 'cadi') c8AnaCubuk(t, ak, pi, false);
    else if (progAd === 'koru8') c8AnaCubuk(t, ak, pi, true);
    else if (progAd === 'kabakYuzMini') c8YuzCubuk(t, ak, pi);
    else if (progAd === 'iskeletMini') c8IskCubuk(t, ak, pi);
    else if (progAd === 'sokak') c8SokakCubuk(t, ak, pi);
    else if (progAd === 'kazanMini') c8KazanCubuk(t, ak, pi);
    else if (progAd === 'supurgeMini') c8UcusCubuk(t, ak, pi);
    else if (progAd === 'meydan8') c8MeydanCubuk(t, ak, pi);
    else if (progAd === 'cadiFinal') c8FinalCubuk(t, ak, pi);
  }
  // planlanmış ölçülerden t anını içereni bul (vuruş eşleme)
  function c8CubukBul(t) {
    let c = null; for (let i = c8Cubuklar.length - 1; i >= 0; i--) if (c8Cubuklar[i].t <= t + 0.001) { c = c8Cubuklar[i]; break; }
    return c && t < c.t + c.uz + 0.5 ? c : null;
  }
  function c8SonrakiVurus(t) {   // t'den sonraki ilk vuruş (yoksa t)
    const c = c8CubukBul(t); if (!c) return t;
    const V = c.uz / c.vur, x = Math.ceil((t - c.t - 0.02) / V);
    return c.t + Math.max(0, x) * V;
  }

  let denizDostSay = 0;
  // Su altı yüzme arpej katmanı: Feza'nın yüzme hızına göre (yz: 0..1.5) dinamik olarak açılır.
  // Sakin yüzerken (0.3..0.8) masalsı Lidyen çelesta, kristal kâse parıltısı ve berrak su damlacığı hissi;
  // hızlandıkça yumuşak flüt nefesi ve pürüzsüz akıntı arpı katılır.
  const YUZ_DALGA = [[0, 2, 4, 6, 5, 3, 1, 3], [1, 3, 5, 7, 6, 4, 2, 4], [0, 1, 3, 5, 7, 5, 3, 2]];
  function denizYuzmeArpej(t, ak, bar, yz, d) {
    if (yz < 0.12) return;
    const tones = akTon(ak, 71, 9, true);
    if (!tones || tones.length < 4) return;
    const S8 = 0.3, pattern = YUZ_DALGA[bar % YUZ_DALGA.length];
    const sakin = yz >= 0.22 && yz <= 0.88, dash = (d && d.denizHamle) || yz > 0.95;
    const volBase = (0.015 + 0.018 * sm(0.12, 0.9, yz)) * (dash ? 1.25 : 1);
    for (let s = 0; s < 8; s++) {
      const idx = pattern[s] % tones.length, n = tones[idx];
      const ts = t + s * S8 + (rnd() - 0.5) * 0.008;
      const pan = Math.sin((bar * 8 + s) * 0.65) * 0.36;
      // 1) Masalsı Lidyen çelesta (su altında süzülen dalga ve ışık halkaları):
      tus(n, ts, volBase * (s % 2 === 0 ? 1.08 : 0.9), sakin ? 1.8 : 1.4, pan, true, B.zil);
      // 2) Sakin ve normal yüzmede su içinde parıldayan kristal damlacık ve kâse tınısı:
      if (sakin || dash) {
        if (s === 0 || s === 4 || (s === 2 && yz > 0.42)) {
          cam(NOTE(n + 12), ts + 0.012, 0.009 * (0.7 + 0.5 * sm(0.2, 0.8, yz)), 2.2, -pan * 0.8, B.zil, true);
        }
        if (s === 1 || s === 5 || (s === 3 && rnd() < 0.65)) {
          damla(NOTE(n), ts + 0.035, 0.016 * (0.65 + 0.45 * sm(0.2, 0.8, yz)), pan * 0.6, B.su);
        }
      }
      // 3) Sakin tempoda masalsı alt arp dokusu (akora yaslanan sıcak tını):
      if (yz > 0.25 && (s === 2 || s === 6 || dash)) {
        arp(tones[(idx + 3) % tones.length] - 12, ts + 0.14, 0.017 * (0.65 + 0.5 * sm(0.25, 0.9, yz)), pan * 0.4, 1.8, B.arp);
      }
      // 4) Hızlandıkça aralara katılan hafif flüt nefesi:
      if (yz > 0.38 && (s === 1 || s === 3 || s === 5 || s === 7)) {
        const fn = tones[(idx + 2) % tones.length];
        flut(fn, ts + 0.11, 0.24, 0.014 * sm(0.38, 1.1, yz), -pan * 0.7, B.flut, false);
      }
      // 5) Yunus vuruşu dash anında 16'lık su damlası ve ikinci arp akışı:
      if (dash && (s % 2 === 1)) {
        arp(tones[(idx + 4) % tones.length] - 12, ts + 0.15, 0.022, pan * 0.5, 1.4, B.arp);
        damla(NOTE(n + 12), ts + 0.08, 0.02, -pan * 0.5, B.su);
      }
    }
  }

  function denizCubuk(t, ak, bic, pi, d) {
    const yz = cl(Math.max(yuzmeS, (d && d.yuzme) || 0), 0, 1.5);
    const bar = pi * 2 + bic;
    denizYuzmeArpej(t, ak, bar, yz, d);
    if (typeof INCI !== 'undefined' && INCI.active && INCI.t >= 5) {
      // Dostların dansında ana deniz ezgisi daha canlı bir cevapla açılır.
      const part = Math.floor((INCI.t - 5) / BAR), melodies = [[74,78,81,78],[76,79,83,81],[78,81,86,83],[81,83,86,90],[86,83,81,78],[79,81,83,78],[78,76,74,71]], phrase = melodies[Math.min(melodies.length-1,part)], vol = .029;
      for(let i=0;i<4;i++){const n=diyatonik(phrase[i],0), ts=t+i*.5; flut(n,ts,.47,vol,(i-1.5)*.1); arp(n-12,ts+.02,.023,(1.5-i)*.12,2.2); if(i===0||i===3)tus(n+12,ts+.06,.011,2.0,(i-1.5)*.13,true,B.zil);}
      if(bic===0)bas(ak.bas,t,.045,'uzun',BAR*1.7);
      return;
    }
    const phrase = DENIZ_MEL[bar % 16], pan = Math.sin(bar * 0.6) * 0.22;
    const bright = 0.75 + Math.min(5, denizDostSay) * 0.05, variation = dongu % 3, tones = akTon(ak, 67, 6);
    arp(tones[0], t + 0.015, 0.036, -0.3, 2.5); arp(tones[2], t + 0.7, 0.029, 0.2, 2.4);
    arp(tones[3], t + 1.45, 0.024, -0.12, 2.5);
    if (denizDostSay >= 2) {
      // Aynı nota/node bütçesi: uzun üç notanın yerine hafif senkoplu flüt sorusu ve çelesta cevabı.
      const playful=DENIZ_OYUN[(bar+Math.floor(dongu/2)*2)%DENIZ_OYUN.length], times=[.12,.64,1.28,1.85];
      for(let i=0;i<4;i++){const n=diyatonik(playful[i],0),ts=t+times[i],question=i<2,v=(i===0?.029:.025)*bright;
        if(question!==(bar%2===1))flut(n,ts,i===0?.39:.35,v,pan-.12);
        else tus(n,ts,v*.8,1.65,-pan+.12,true,B.zil);
      }
      if(bic===1)arp(tones[0]+12,t+1.04,.011,-.2,1.35);
      if(bic===0)bas(ak.bas,t,.052,'uzun',BAR*1.8);
      return;
    }
    for (let i = 0; i < phrase.length; i++) {
      const n = diyatonik(phrase[i], 0), ts = t + [0.12, 0.92, 1.62][i], dur = i === 2 ? 0.74 : 0.8, v = (i === 0 ? 0.034 : 0.027) * bright;
      if (variation === 1 || bar % 4 === 3) {
        tus(n, ts, v * 0.78, 2.3, pan, true, B.zil);
        if (yz > 0.2) cam(NOTE(n + 12), ts + 0.015, v * 0.26, 2.2, -pan, null, true);
      } else {
        flut(n, ts, dur, v, pan);
        if (yz > 0.25) cam(NOTE(n + 12), ts + 0.02, v * 0.22, 2.0, -pan * 0.7, null, true);
      }
      if (i === 0) arp(n - 12, ts + 0.025, 0.018, -pan, 1.9);
    }
    // Sakin keşifte su içinde parıldayan hafif kristal damlacık:
    if (yz > 0.18) {
      const dropTones = akTon(ak, 74, 5, true);
      if (dropTones && dropTones.length) {
        const dt = t + (bic === 0 ? 0.55 : 1.35) + (rnd() - 0.5) * 0.12;
        damla(NOTE(sec(dropTones)), dt, 0.02 * (0.7 + 0.4 * yz), (rnd() - 0.5) * 0.6, B.su);
      }
    }
    // Su yüzeyine yaklaştıkça veya yukarı süzüldükçe güneşli su soprano çanları:
    if (yukseklikS > 0.28 || yz > 0.45) {
      const dGuc = Math.max(yukseklikS, yz * 0.7);
      if (bic === 1 && rnd() < 0.65) {
        const sCand = akTon(ak, 91, 5, true);
        if (sCand.length) sopranoCan(sec(sCand), t + 0.85, 0.015 * dGuc, (rnd() - 0.5) * 0.5, B.zil);
      }
    }
    if (denizDostSay >= 2 && bic === 1) flut(tones[0], t + 1.2, 1.0, 0.012, -0.22);
    if (bic === 0) bas(ak.bas, t, 0.052, 'uzun', BAR * 1.8);
  }

  function bulutCubuk(t, ak, bic, pi, d) {
    const S8 = 0.3, k = koS, dr = gDoruk, hum = () => (rnd() - 0.5) * 0.01;
    const bar = pi * 2 + bic, oz = t - kOzelT < 10;
    const v = k < 0.08 && dr < 0.3 ? (dongu % 2 ? 3 : 0) : dongu % 4;   // 0 A · 1 B (flüt) · 2 A çelesta + karşı ezgi · 3 C seyrek
    const bars = v === 1 ? TEMA.bulut.B : v === 3 ? TEMA.bulut.C : TEMA.bulut.A, mel = bars[bar % 16] || [];
    const flutVar = k >= 0.12 || dr > 0.3;
    const pOlasi = 0.6 + 0.4 * sm(0, 0.5, k) + (dr > 0.5 ? 0.3 : 0);
    oncelikli = true;   // ezgi atılmaz
    try {
      for (const [s, n, u] of mel) {
        const vurgu = s === 0 || u >= 3, ts = t + s * S8 + hum();
        if (!vurgu && rnd() > pOlasi) continue;
        const pan = cl((n - 83) * 0.05, -0.4, 0.4), dur = u * S8, vv = (0.04 + 0.012 * sm(0, 0.5, k)) * (vurgu ? 1.1 : 0.88);
        if (v === 3) { cam(NOTE(n), ts, vv * 0.8, 2.6, pan); continue; }
        if (v === 0) {
          if (flutVar) { flut(n, ts, dur * 0.95, vv * 0.62, pan); if (vurgu) arp(n - 12, ts + 0.006, 0.026, -pan, 1.6); }
          else { zil(NOTE(n), ts, vv, Math.min(2.6, 1.0 + u * 0.4), pan); if (vurgu) arp(n - 12, ts + 0.01, 0.024, -pan, 1.8); }
        } else if (v === 1) {
          if (flutVar) flut(n, ts, dur * 0.95, vv * 0.62, pan); else tus(n, ts, vv * 0.85, 1.6 + u * 0.4, pan, true, B.zil);
          if (vurgu && k > 0.4) zil(NOTE(n + 12), ts + 0.01, vv * 0.22, 1.4, -pan, null, false);
        } else {
          tus(n, ts, vv * 0.85, 1.6 + u * 0.45, pan, true, B.zil);
          if (vurgu && k > 0.28) zil(NOTE(n + 12), ts + 0.012, vv * 0.25, 1.5, -pan, null, false);
          if (k > 0.55 && u >= 3) flut(diyatonik(n, -2), ts + 0.03, dur * 0.95, vv * 0.4, -pan);   // flüt üçlü aşağıdan karşı ses
        }
        if (dr > 0.35) cam(NOTE(n + 12), ts + 0.015, vv * 0.3 * dr, 2.2, -pan * 0.7, null, false);
        if (k > 0.7 && vurgu && v !== 2) tus(n - 12, ts, 0.014 * sm(0.7, 1, k), 2.2, -pan * 0.5, false);
      }
    } finally { oncelikli = false; }
    // harp: göksel vals salınımı (bulutların üstünde 6/8 süzülüşü); kuzucuk arttıkça inen ikinci dalga ve sekizlik akış
    const tn = akTon(ak, ak.bas + 24, 8);
    if (bic === 0) {
      for (let i = 0; i < 7; i++) arp(tn[i], t + 0.05 + i * (0.22 - 0.06 * k), 0.032 * (0.75 + 0.35 * k), -0.55 + i * 0.18, 2.4);
      // Göksel vals ritmik lilti: 2. ve 3. vuruşlarda hafif akor dokunuşları
      [2, 4, 6].forEach(s => ak.pad.slice(1, 4).forEach((n, idx) => tus(n + 12, t + s * S8 + idx * 0.015, 0.014 * (0.7 + 0.4 * k), 0.8, (idx - 1) * 0.25, true, B.tus)));
    }
    if (bic === 1 && k > 0.25) { const t2 = akTon(ak, ak.bas + 31, 8); for (let i = 0; i < 6; i++) arp(t2[(7 - i) % t2.length], t + 0.55 + i * 0.18, 0.024, 0.5 - i * 0.18, 1.9); }
    if (k > 0.68) { const t3 = akTon(ak, ak.bas + 36, 6); for (let s = 0; s < 8; s++) if (s % 2 === 0 || rnd() < 0.6) arp(t3[[0, 2, 1, 3, 2, 4, 3, 5][s]], t + s * S8 + 0.15, 0.015 * sm(0.68, 1, k), (s - 3.5) * 0.12, 1.1); }
    // Bulut zirvelerinde ve gökyüzünde göksel soprano çanları ve rüzgar arpları:
    if (yukseklikS > 0.22 || k > 0.35) {
      const bGuc = Math.max(sm(0.2, 0.8, yukseklikS), sm(0.25, 0.85, k));
      if (bic === 1 && rnd() < 0.82) {
        const wNotes = akTon(ak, ak.bas + 36, 6, true);
        ruzgarArp(wNotes, t + 0.38, 0.024 * bGuc, 0.18, 0.14);
      }
      if (rnd() < 0.65) {
        const sCand = akTon(ak, 93, 6, true);
        if (sCand.length) sopranoCan(sec(sCand), t + 1.15, 0.017 * bGuc, (rnd() - 0.5) * 0.65);
      }
    }
    // güneş pırıltıları: akora uyan yüksek cam notalar (kuzucuk ve gökkuşağıyla sıklaşır)
    const kn = Math.round(0.4 + 2.2 * k + 1.8 * dr + rnd() * 0.8);
    if (kn > 0) { const cand = akTon(ak, 86, 8, true); for (let i = 0; i < kn; i++) cam(NOTE(sec(cand)), t + 0.1 + rnd() * 2.1, 0.0075 + 0.006 * k, 1.2 + rnd(), rnd() * 1.6 - 0.8, null, rnd() < 0.5); }
    // gün doğumu: uzakta ara ara kuşlar (çok kısık)
    if (rnd() < 0.14 + 0.08 * k) { const tk = t + 0.3 + rnd() * 1.8, p = rnd() < 0.5 ? -0.6 : 0.6; kus(tk, p); if (rnd() < 0.4) kus(tk + 0.4, p); }
    // çelesta akoru (yavaş yukarı kırık)
    if (k > 0.35 && bic === 0) ak.pad.slice(1).map(n => n + 12).forEach((n, i) => tus(n, t + 1.1 + i * 0.11, 0.019 * sm(0.35, 0.7, k), 2.6, (i - 1.5) * 0.3, true));
    // renklenen kuzucuğun notası: ölçünün ızgarasında flüt + çanla yankılanır
    while (kBekle.length) { const nb = kBekle.shift(); flut(nb + 12, t + 1.2, 0.9, 0.03, 0.3); cam(NOTE(nb + 24), t + 1.8, 0.018, 2.5, -0.3); }
    // bas: uzun, sıcak göksel vals kökü; kuzucuk arttıkça alt oktav ve yumuşak nabız
    if (bic === 0) bas(ak.bas + 12, t, 0.075, 'uzun', 2 * BAR);
    if (k > 0.4 && bic === 0) bas(ak.bas, t, 0.038, 'uzun', 2 * BAR);
    if (k > 0.55) { bas(ak.bas + 12, t + 4 * S8, 0.048, 'nabiz'); if (k > 0.85) bas(ak.bas + 19, t + 6 * S8, 0.028, 'pizz'); }
    if (k > 0.85) for (let s = 0; s < 8; s += 2) gur(t + s * S8, 0.07, 'highpass', 6500, 9500, 0.8, 0.003 * (s % 4 ? 0.7 : 1.2), 0.08 * (s % 4 ? 1 : -1), 0, B.zil);
    // gökkuşağı doruğu / kuzucuk anı: her akorda yükselen yedi renkli gökkuşağı çan şelalesi + geniş akor
    if ((dr > 0.38 || oz) && bic === 0 && (pi % 2 === 0 || oz)) {
      const g = Math.max(dr, 0.55);
      GOK7.forEach((m, i) => cam(NOTE(m + 12), t + 0.12 + i * 0.09, 0.025 * g, 2.9, -0.7 + i * 0.23, null, i > 4));
      if (dr > 0.38) kabar([ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12, ak.pad[1] + 24], t + 0.1, 1.3, 1.3, 2.0, 0.02 * dr, null, true);
    }
  }
  // ── Bölüm 3 uçuş: Pırıl'ın sırtında. Koşan flüt ezgisi + on altılık harp akışı + nabız; coşkulu ama yumuşak ──
  function ucusCubuk(t, ak, pi, d) {
    const S8 = 0.3, S16 = 0.15, hum = () => (rnd() - 0.5) * 0.008;
    const mel = (dongu % 2 ? TEMA.ucus.B : TEMA.ucus.A)[pi % 8] || [];
    const gir = cl((t - ucusT0) / 4.5, 0.5, 1);   // ilk saniyelerde coşkuyla dolar
    oncelikli = true;
    try {
      for (const [s, n, u] of mel) {
        const ts = t + s * S8 + hum(), pan = cl((n - 83) * 0.05, -0.4, 0.4), uz = s === 0 || u >= 2;
        flut(n, ts, u * S8 * 0.92, 0.036 * (uz ? 1.08 : 0.9), pan);
        if (uz) tus(n - 12, ts + 0.008, 0.018, 1.3, -pan, true);
        if (u >= 3) {
          zil(NOTE(n + 12), ts + 0.012, 0.014, 1.7, -pan, null, false);
          cam(NOTE(n + 24), ts + 0.02, 0.008 * gir, 1.4, pan * 0.8, null, false);
        }
      }
    } finally { oncelikli = false; }
    // harp: on altılıklarla rüzgâr gibi yukarı-aşağı akan akor akışı
    const tn = akTon(ak, ak.bas + 24, 9), yol = [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1];
    for (let s = 0; s < 16; s++) arp(tn[yol[s]], t + s * S16 + hum(), (s % 4 === 0 ? 0.026 : 0.016) * gir, (yol[s] - 4) * 0.12, 0.85);
    // çelesta: ara vuruşlarda neşeli akor desteği
    [2, 6].forEach(s => ak.pad.slice(1).forEach((n, i) => tus(n + 12, t + s * S8 + i * 0.012, 0.013 * gir, 0.55, (i - 1) * 0.28, true, B.tus)));
    // bas: ölçü başında uzun kök + dörtlük nabız
    bas(ak.bas + 12, t, 0.078, 'uzun', BAR);
    [2, 4, 6].forEach(s => bas(ak.bas + 12, t + s * S8, 0.04 * gir, 'nabiz'));
    // rüzgâr ışıltısı: ara vuruşlarda yumuşak "fş"
    for (let s = 1; s < 8; s += 2) gur(t + s * S8, 0.08, 'highpass', 6500, 9000, 0.8, 0.0028 * gir, 0.03, s % 4 === 1 ? -0.25 : 0.25, 0, B.zil);
    // 4 ölçüde bir yukarı süzülen göksel çan dizisi
    if (pi % 4 === 3) akTon(ak, ak.bas + 36, 8, true).forEach((n, i) => cam(NOTE(n), t + 1.1 + i * 0.1, 0.014 + i * 0.001, 1.7, -0.6 + i * 0.17, null, i > 4));
    while (kBekle.length) { const nb = kBekle.shift(); cam(NOTE(nb + 24), t + 1.2, 0.022, 2.3, 0.3); }
  }

  // ── final: 0–7 Pofuduklar dans ediyor (şenlik polkası, ım-pa tuba) → 8–15 doruk: Pırıl'ın teması → 16–17 çözülme ──
  function finalCubuk(t, i) {
    const S8 = 0.3, ak = akor, zirve = i >= 8, buyuk = zirve ? 1 : 0.8 + i * 0.025;
    const tn = []; for (let m = ak.bas + 12; tn.length < 8; m++) if (ak.ton.includes(m % 12)) tn.push(m);
    oncelikli = true;   // ezgi notaları finalde asla atılmasın
    for (const [s, n, u] of FINAL_MEL[i] || []) {
      const ts = t + s * S8, pan = cl((n - 84) * 0.05, -0.4, 0.4);
      if (!zirve) {   // dans: müzik kutusu + alt oktavdan çelesta
        zil(NOTE(n), ts, 0.056 * buyuk, 1.6, pan);
        if (s === 0 || u >= 2) tus(n - 12, ts, 0.017, 0.9, -pan, true);
      } else {        // Pırıl'ın teması: çelesta önde, müzik kutusu ve bir oktav üstte çan
        tus(n, ts, 0.05, 1.6 + u * 0.45, 0.1, true, B.zil);
        zil(NOTE(n), ts + 0.004, 0.04, 1.8 + u * 0.3, -0.1);
        if (bolum3()) flut(n, ts + 0.006, u * S8 * 0.95, 0.024, -0.15, null, false);   // Bölüm 3: Pırıl'ın temasına flüt de katılır
        zil(NOTE(n + 12), ts + 0.012, 0.016, 1.6 + u * 0.2, 0.35, null, false);
        if (u >= 4) zil(NOTE(n - 12), ts + 0.01, 0.022, 2.6, -0.35, null, false);
      }
    }
    oncelikli = false;
    if (!zirve) {
      const kok = ak.bas < 43 ? ak.bas + 12 : ak.bas;
      tuba(kok, t, 0.22, 0.075 * buyuk, 0); tuba(kok + 7, t + 4 * S8, 0.2, 0.06 * buyuk, 0);
      if (i % 4 === 3) { tuba(kok + 4, t + 6 * S8, 0.12, 0.05, 0); tuba(kok + 5, t + 7 * S8, 0.12, 0.05, 0); }
      bas(ak.bas + 12, t + 2 * S8, 0.05, 'pizz'); bas(ak.bas + 12, t + 6 * S8, 0.05, 'pizz');
      [2, 6].forEach(s => ak.pad.slice(2).forEach((n, k) => tus(n + 12, t + s * S8 + k * 0.012, 0.018, 0.35, (k - 1) * 0.3)));
      const yol = [0, 2, 1, 3, 2, 4, 3, 1]; yol.forEach((k, s) => { if (s % 2) arp(tn[k + 2], t + s * S8, 0.03, (k - 2) * 0.22, 0.9); });
      // Pofuduklar dans ediyor: ara vuruşlarda zıplayan "bup"lar
      if (i >= 1) { let k = 0; for (let m = ak.bas + 24; k < 4; m++) if (ak.ton.includes(m % 12)) gecitTon[k++] = m; [1, 3, 5, 7].forEach((s, j) => hop(gecitTon[(j + i) % 4] + 12, t + s * S8, 0.04, j % 2 ? 0.35 : -0.35)); }
      if (i === 0) bas(ak.bas, t, 0.1, 'uzun', 2.4);
    } else if (i < 16) {
      const yol = i % 2 ? [7, 5, 3, 1, 0, 2, 4, 6] : [0, 2, 4, 6, 7, 5, 3, 1];
      yol.forEach((k, s) => arp(tn[k], t + s * S8, 0.034, (k - 3.5) * 0.15, 1.6));
      ak.pad.slice(1).forEach((n, k) => tus(n + 12, t + k * 0.03, 0.02, 2.2, (k - 1.5) * 0.3));
      bas(ak.bas, t, 0.1, 'uzun', 2.4); [2, 4, 6].forEach(s => bas(ak.bas + 12, t + s * S8, 0.045, 'nabiz'));
      if (i === 8) for (let k = 0; k < 12; k++) zil(NOTE(akorTonu(ak, 86 + k * 1.2 | 0)), t + 0.6 + k * 0.11, 0.018, 2.5, (k % 2 ? 0.5 : -0.5), null);
    } else {
      if (i === 16) { bas(ak.bas, t, 0.1, 'uzun', 4.8); [0, 1, 2, 3, 4].forEach(k => arp(tn[k + 2], t + 0.4 + k * 0.16, 0.026, -0.4 + k * 0.2, 2.2)); }
    }
  }

  // ── ninni (3/4): müzik kutusu – başlık, yatak odası ve sabah. Ana tema müzik kutusunda; Pırıl'ın teması çelestada ──
  function ninniCubuk(t) {
    const S6 = 0.4, ak = akor, sira = ninniSira, bar = PARCA[sira.ad][sira.i], piril = sira.ad === 'piril', baslik = mod === 'baslik';
    oncelikli = true;
    for (const [s, n, u] of bar.m) {
      const ts = t + s * S6 + (rnd() - 0.5) * 0.01;
      if (piril) { tus(n, ts, 0.048, 1.5 + u * 0.4, 0.15, true, B.zil); zil(NOTE(n + 12), ts + 0.006, 0.014, 1.1 + u * 0.2, -0.25, null, false); }
      else zil(NOTE(n), ts, 0.058, 1.4 + u * 0.35, 0.12, null);
    }
    oncelikli = false;
    // müzik kutusu eşliği: 1. vuruşta bas, 2–3'te akor
    const kok = ak.bas + 24 > 66 ? ak.bas + 12 : ak.bas + 24;
    zil(NOTE(kok), t, 0.03, 2.2, -0.25, null, false);
    const ic = ak.pad.slice(2, 4).map(n => n + 12);
    [2, 4].forEach(s => ic.forEach((n, k) => zil(NOTE(n), t + s * S6 + k * 0.008, 0.016, 1.3, k ? 0.3 : -0.1, null, false)));
    if (baslik) return;
    if (sira.i % 4 === 3) { const tn = []; for (let m = ak.bas + 24; tn.length < 5; m++) if (ak.ton.includes(m % 12)) tn.push(m); tn.forEach((n, k) => arp(n, t + 1.6 + k * 0.1, 0.025, -0.4 + k * 0.2, 1.8)); }
    if (sabahKus && rnd() < 0.45) { const tk = t + 0.4 + rnd() * 1.6, p = rnd() < 0.5 ? -0.55 : 0.55; kus(tk, p); if (rnd() < 0.5) kus(tk + 0.42, p); }   // sabah: uzakta kuşlar
    if (sira.i % 4 !== 3 && ruya > 0.3) {   // rüya: yukarı süzülen ince bir arp + ara ara tepede bir çan
      const tn = []; for (let m = ak.bas + 36; tn.length < 4; m++) if (ak.ton.includes(m % 12)) tn.push(m);
      tn.forEach((n, k) => arp(n, t + 1.65 + k * 0.13, 0.016 * ruya, 0.5 - k * 0.3, 1.6));
      if (sira.i % 2) zil(NOTE(tn[3] + 12), t + 2.0, 0.011 * ruya, 2, -0.5, null);
    }
  }

  // ── başlık / rüya seçimi: "Rüya Beşiği" – 37 ölçülük uzun ninni (D majör, 3/4, ~75 vuruş/dk) ──
  // giriş (pad kabarır, uzak çanlar) → A1 (ana tema, müzik kutusu) → B (Pırıl'ın teması çelestada, harp akıntısı, "aa" korosu) →
  // köprü (cam çanlar, koro, en sessiz an) → A2 (ana temanın ikinci yarısı, çelesta eşliğinde, en dolu ama yine yumuşak) → son (Feza'nın
  // üç–iki–biri sönerek, başa bağlanır). Katman düzeyleri bölüme göre BSL_MIX'ten gelir; hiçbir şey ani başlamaz/bitmez.
  let baslikSec = false, baslikIlgiT = -1e9, bslMix = BSL_MIX.giris;
  function harpa(t, ak, tur, v, ofs, ara) {   // akor sesleriyle harp: 'dalga' (yükselen), 'ters' (inen), 'osti' (6 sekizlik, sallanan)
    const tn = []; for (let m = 57; m <= 86; m++) if (ak.ton.includes(m % 12)) tn.push(m);
    const lo = Math.max(0, tn.findIndex(x => x >= 62)), at = i => tn[cl(lo + i, 0, tn.length - 1)];
    const S6 = 0.4;
    if (tur === 'osti') {
      [0, 1, 2, 3, 2, 1].forEach((g, i) => { if (i && rnd() < 0.12) return; arp(at(g), t + i * S6 + (rnd() - 0.5) * 0.01, v * (i ? 1 : 1.25), -0.3 + g * 0.13, 1.9); });
    } else {
      const a = ara || 0.11;
      for (let i = 0; i < 5; i++) arp(tur === 'ters' ? at(5 - i) : at(i), t + ofs + i * a, v * (tur === 'ters' ? 1 - 0.1 * i : 0.8 + 0.1 * i), -0.4 + i * 0.2, 2.4);
    }
  }
  function baslikIsilti(t, ak, n, v, ofs) {   // tepede tek tük yıldız ışıltısı (akor sesleriyle, cam çan)
    for (let i = 0; i < n; i++) cam(NOTE(akorTonu(ak, 86 + Math.floor(rnd() * 12))), t + ofs + i * (0.2 + rnd() * 0.3), v * (0.8 + 0.4 * rnd()), 2.4, rnd() - 0.5, null);
  }
  function baslikCubuk(t, ak, pi, dg) {
    const [sec, k] = BSL_PLAN[pi % BSL_PLAN.length], S6 = 0.4, S = baslikSec;
    const mx = BSL_MIX[sec];
    // giriş yükselir, son sönerek başa bağlanır
    const f = sec === 'giris' ? [0.7, 0.8, 0.9, 1][k] : sec === 'son' ? [1, 0.85, 0.72, 0.62][k] : 1;
    bslMix = {}; for (const a in mx) bslMix[a] = mx[a] * f;
    const bar = sec === 'A1' ? PARCA.ana[k].m : sec === 'A2' ? PARCA.ana[8 + k].m : sec === 'B' ? PARCA.piril[k].m : BSL_MEL[sec][k];
    const kutu = sec === 'A1' || sec === 'A2' || sec === 'son' || (sec === 'giris' && k === 3);
    oncelikli = true;
    if (!S) {
      for (const [s, n, u] of bar) {
        const ts = t + s * S6 + (rnd() - 0.5) * 0.012, pan = cl((n - 84) * 0.04, -0.3, 0.3);
        if (kutu) {
          zil(NOTE(n), ts, 0.066 * f, 1.4 + u * 0.35, 0.12, null);
          if (sec === 'A2') tus(n + 12, ts + 0.012, 0.016, 1.3 + u * 0.3, -0.2, true, B.zil);   // çelesta üstten eşlik eder
        } else if (sec === 'kopru') cam(NOTE(n), ts, 0.04, 2.4 + u * 0.35, pan, null);
        else {   // çelesta: Pırıl'ın teması (giriş 3. ölçü dahil)
          tus(n, ts, 0.055 * f, 1.5 + u * 0.4, 0.15, true, B.zil); zil(NOTE(n + 12), ts + 0.006, 0.015 * f, 1.1 + u * 0.2, -0.25, null, false);
        }
      }
    }
    oncelikli = false;
    if (S) { bslMix = { pad: 0.9, zil: 0.2, tus: 0.1, arp: 0.15, tel: 0.3, koro: 0.9, bas: 0.4 }; return; }   // rüya seçildi: yalnız pad + koro kalır
    // müzik kutusu eşliği: 1. vuruşta bas, 2–3'te akor (A bölümlerinde); B'de yalnız kök
    const kok = ak.bas + 24 > 66 ? ak.bas + 12 : ak.bas + 24;
    if (kutu || sec === 'B') zil(NOTE(kok), t, 0.028, 2.2, -0.25, null, false);
    if (kutu && sec !== 'giris') {
      const ic = ak.pad.slice(2, 4).map(n => n + 12);
      [2, 4].forEach(s => ic.forEach((n, i) => zil(NOTE(n), t + s * S6 + i * 0.008, 0.015 * f, 1.3, i ? 0.3 : -0.1, null, false)));
    }
    // derin, yumuşak bas: 1. vuruşta kök (B/A2'de 3. vuruşta beşli)
    if (!(sec === 'giris' && k < 1)) {
      bas(ak.bas + 12, t, 0.065, 'nabiz');
      if (sec === 'B' || sec === 'A2') bas(akorTonu(ak, ak.bas + 19), t + 4 * S6, 0.032, 'nabiz');
    }
    // harp
    const v = 0.019;
    if (sec === 'giris') { if (k === 0) harpa(t, ak, 'dalga', v * 0.8, 1.2, 0.16); else if (k === 1) harpa(t, ak, 'dalga', v * 0.9, 0.4, 0.14); }
    else if (sec === 'A1') { if (dg % 2 === 0) { if (k % 2 === 1) harpa(t, ak, 'dalga', v, 1.6, 0.11); } else if (k >= 2 && rnd() < 0.8) harpa(t, ak, 'osti', v * 0.7); }
    else if (sec === 'B') harpa(t, ak, k === 8 ? 'ters' : 'osti', k === 8 ? v : v * 0.85, 0.6, 0.15);
    else if (sec === 'kopru') harpa(t, ak, k % 2 ? 'dalga' : 'ters', v * 0.9, k % 2 ? 1.0 : 0.6, 0.17);
    else if (sec === 'A2') { harpa(t, ak, 'osti', v * 0.9); if (k === 7) harpa(t, ak, 'ters', v * 0.8, 1.2, 0.14); }
    else if (sec === 'son') { if (k === 0) harpa(t, ak, 'dalga', v * 0.8, 0.8, 0.14); else if (k === 1) harpa(t, ak, 'ters', v * 0.7, 0.6, 0.16); else if (k === 2) harpa(t, ak, 'dalga', v * 0.55, 0.4, 0.18); }
    // ışıltılar: köprüde her ölçü, öbür bölümlerde ara sıra (nefes alan, makine gibi değil)
    if (sec === 'kopru') baslikIsilti(t, ak, 1 + (k % 2), 0.012, 1.0 + rnd() * 0.5);
    else if (sec === 'giris' && k >= 1 && k <= 2) baslikIsilti(t, ak, 1, 0.01, 1.6);
    else if ((sec === 'A1' || sec === 'A2' || sec === 'B') && rnd() < 0.35) baslikIsilti(t, ak, 1, 0.011, 1.4 + rnd() * 0.8);
    else if (sec === 'son' && (k === 1 || k === 2)) baslikIsilti(t, ak, 1, 0.009, 1.4);
  }
  function baslikIlgi() {   // seçim ekranında boş dokunuş: üç yumuşak çan yukarı süzülür (en sık 3 sn'de bir)
    if (!ac || mod !== 'baslik' || baslikSec || (ac.state !== 'running' && !test)) return;
    const t = zaman() + 0.02; if (t - baslikIlgiT < 3) return; baslikIlgiT = t;
    const ak = akorAt(t), tn = []; for (let m = 81; m <= 98; m++) if (ak.ton.includes(m % 12)) tn.push(m);
    const i0 = Math.floor(rnd() * Math.max(1, tn.length - 3));
    oncelikli = true; try { for (let i = 0; i < 3; i++) cam(NOTE(tn[Math.min(tn.length - 1, i0 + i)]), t + i * 0.16, 0.02, 1.8, -0.3 + i * 0.3, null); } finally { oncelikli = false; }
  }

  // ── Büyük Pofuduk uykusu: horlama + uykulu tuba, ölçüye eşli (2 ölçülük döngü) ──
  let horlamaDis = -1;   // pofuduk.js kendisi AU.sfx('horlama') çağırırsa kendi döngümüz susar
  function uykuCubuk(t, yakin) {
    const cift = cubukNo % 2 === 0;
    if (horlamaDis < zaman()) {
      if (cift) { horAl(t, 1.6, yakin); olayIleri(t, 'horlama', { faz: 'al', sure: 1.6 }); }
      else { horVer(t + 0.1, 1.5, yakin); olayIleri(t + 0.1, 'horlama', { faz: 'ver', sure: 1.5 }); }
    }
    const tv = 0.12 * (0.5 + 0.5 * yakin);
    if (cift) tuba(akor.bas + 12 + 7 > 57 ? akor.bas + 7 : akor.bas + 19, t + 6 * 0.3, 0.5, tv * 0.8, -60);
    else { tuba(akor.bas + 16 > 57 ? akor.bas + 4 : akor.bas + 16, t + 1.2, 0.45, tv, 0); tuba(akor.bas + 12 > 55 ? akor.bas : akor.bas + 12, t + 1.8, 0.7, tv, -110); }
  }
  // ── Pofuduk geçidi: Feza'nın peşindeki uyanık Pofuduklar için zıplayan, oyunbaz bir motif ──
  // Kaç Pofuduk varsa o kadar dolu (1: üç "bup", 2+: cevap veren üst ses, 3+: alttan "bom"). Feza durunca
  // otobüs kısılır (karisimGuncelle), yürüyünce açılır; ritim bölgenin ruhuna göre seyrekleşir.
  const HOP_RIT = [[1, 0, 1, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0], [1, 0, 1, 1, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 1, 1]];
  const HOP_YOL = [0, 2, 1, 3, 2, 4, 3, 1];
  let hopRit = HOP_RIT[0];
  function gecitCubuk(t, ak, n, b) {
    if (cubukNo % 2 === 0) hopRit = HOP_RIT[(n >= 2 ? 1 : 0) + Math.floor(rnd() * (n >= 3 ? 3 : 2))] || HOP_RIT[0];
    const seyrek = b === 'gol' || b === 'sakli' ? 0.5 : 1;
    let tn0 = ak.bas + 24; while (tn0 > 62) tn0 -= 12;
    let k = 0; const tn = gecitTon; for (let m = tn0; k < 5 && m < tn0 + 30; m++) if (ak.ton.includes(m % 12)) tn[k++] = m;
    for (let s = 0; s < 8; s++) {
      if (!hopRit[s] || rnd() > seyrek) continue;
      const nn = tn[HOP_YOL[(s + cubukNo) % 8] % k];
      hop(nn + 12, t + s * 0.3, 0.05, s % 2 ? 0.25 : -0.25);
      if (n >= 2 && s === 6) hop(nn + 24, t + s * 0.3 + 0.15, 0.025, 0.45);   // ikinci Pofuduk cevap verir
    }
    if (n >= 3 && b !== 'gol') hop(tn[0], t, 0.05, 0);                          // üçüncüsü alttan "bom"
  }
  const gecitTon = [0, 0, 0, 0, 0];
  function olayIleri(t, ad, veri) {
    if (test || typeof OLAY === 'undefined') return;
    const ms = Math.max(0, (t - ac.currentTime) * 1000);
    setTimeout(() => OLAY.emit(ad, veri), ms);
  }

  // ───────────────────────── ses efektleri ─────────────────────────
  function gur(t, dur, tip, f0, f1, Q, vol, atk, pan, rv, hedef) {
    if (!yerVar(1, t, t + dur, true)) return null;
    const s = ac.createBufferSource(); s.buffer = gurBuf;
    const f = suzgec(tip, f0, Q, null); if (f1 && f1 !== f0) { f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); }
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(panla(hedef || sfxG, pan || 0));
    if (rv) g.connect(rv > 1 ? revSfxCok : revSfx);
    s.loop = true; s.start(t, rnd() * (gurBuf.duration - 0.1)); s.stop(t + dur + 0.05);
    return f;
  }
  function ton(t, tip, f0, f1, dur, vol, atk, pan, rv, hedef) {
    if (!yerVar(1, t, t + dur, true)) return null;
    const o = ac.createOscillator(); o.type = tip; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(panla(hedef || sfxG, pan || 0)); if (rv) g.connect(rv > 1 ? revSfxCok : revSfx);
    o.start(t); o.stop(t + dur + 0.05); return o;
  }
  // minik "ağız" sesi: testere dişi → iki formant (sevimli hapşu / esneme)
  function agiz(t, f0, f1, dur, vol, F, F2, atk) {
    if (!yerVar(1, t, t + dur, true)) return;
    const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (atk || 0.04)); g.gain.setTargetAtTime(0.0001, t + dur * 0.7, dur * 0.12); g.connect(sfxG); g.connect(revSfx);
    for (const [fa, q, gv] of [[F[0], 6, 1], [F[1], 8, 0.5]]) {
      const bp = suzgec('bandpass', fa, q, null); if (F2) bp.frequency.linearRampToValueAtTime(F2[fa === F[0] ? 0 : 1], t + dur);
      o.connect(bp); bp.connect(kazanc(gv * 3, g));
    }
    o.start(t); o.stop(t + dur + 0.6);
  }
  // o anki akordan, verilen aralıkta notalar (efektler hep uyumlu)
  function akorNotalari(t, lo, hi, melodik) {
    const ak = akorAt(t), pcs = melodik ? ak.mel : ak.ton, r = [];
    for (let m = lo; m <= hi; m++) if (pcs.includes(m % 12)) r.push(m);
    return r.length ? r : [74, 78, 81, 86];
  }

  // Pırıl'ın motifi (A–F#'–E'–D'), o anki akora oturtulmuş: çelesta + bir oktav üstte ince çan. Bölge ezgisi bu sırada susar.
  function pirilAlinti(t, adim, vol, hedef, kac, pan0) {
    const ak0 = akorAt(t), m = uyarla(PIRIL_BAS.slice(0, kac || 4), ak0).map(([a, n, u]) => bolum2() || bolum7() ? [a, melTonu(ak0, n), u] : [a, n, u]), son = t + (m[m.length - 1][0] + 3) * adim;
    ezgiSus(t, son + 0.3);
    oncelikli = true;
    try {
      m.forEach(([a, n, u], i) => {
        const ts = t + a * adim, p = (pan0 || 0) + (i - 1.5) * 0.12;
        tus(n, ts, vol, 1.3 + u * 0.4, p, true, hedef);
        zil(NOTE(n + 12), ts + 0.006, vol * 0.38, 1.1 + u * 0.25, -p, hedef, false);
      });
    } finally { oncelikli = false; }
    return son;
  }
  const PENT = [2, 4, 6, 9, 11];   // D pentatonik (fener ezgisi)
  let fenerSon = 0, fenerT = -1e9, fenerI = -1, sarsintiT = -1e9;
  const yPent = (ak, lo, hi) => { const r = []; for (let m = lo; m <= hi; m++) if (ak.mel.includes(m % 12)) r.push(m); return r.length ? r : [81, 85, 88, 93]; };
  let yTasT = -1e9, yTasN = 0;
  let vatozKemerT = -1e9, vatozKemerN = 0;
  let adimSol = false, cicekSay = 0, adimYuzey = 'yosun', adimOlayT = -1e9;
  // Feza'nın bastığı yüzey: olay verisi ('yuzey') → üstünde durduğu nesne (nilüfer / Pofuduk) → ızgara (2 = dal)
  function yuzeyBul(e) {
    if (e && e.yuzey) return e.yuzey;
    try {
      const u = typeof ustundeki !== 'undefined' ? ustundeki : null;
      if (u && u.tip) { if (u.tip === 'nilufer' || u.tip === 'yildizTasi') return 'su'; if (u.tip === 'pofuduk' || u.tip === 'buyukPofuduk') return 'pof'; }
      if (typeof grid !== 'undefined' && typeof T !== 'undefined' && typeof P !== 'undefined') {
        const x = e && e.x != null ? e.x : P.x, y = e && e.y != null ? e.y : P.y;
        const row = grid[Math.floor((y + 3) / T)], c = row ? row[Math.floor(x / T)] : 0;
        if (c === 2) return 'dal';
      }
    } catch (er) {}
    return 'yosun';
  }
  // Bölüm 7 efekt yardımcıları: olay konumundan pan (x → kamera) · orta perdede pizzicato (yavrular, kardan adam)
  function k7Pan(e, varsay) {
    if (e && Number.isFinite(e.pan)) return cl(e.pan, -0.6, 0.6);
    const c = e && Number.isFinite(e.x) ? camKonum() : null;
    return c ? cl((e.x - c.x - c.w / 2) / (c.w / 2) * 0.6, -0.6, 0.6) : varsay;
  }
  function pizzK(n, t, vol, pan, hedef) {
    if (!yerVar(2, t, t + 0.5, true)) return;
    const f = NOTE(n), g = zarf(t, 0.003, vol, 0.38, panla(hedef || sfxG, pan));
    if (revSfx) g.connect(revSfx);
    const lp = suzgec('lowpass', Math.min(9000, f * 7), 0.8, g); lp.frequency.setTargetAtTime(f * 2.2, t, 0.05);
    osc('triangle', f, t, t + 0.45, lp); osc('sine', f * 2, t, t + 0.25, kazanc(0.35, lp));
  }
  const ky = () => bolum2() ? -5 : 0;   // sarki.js notaları D pentatonikte: Bölüm 2'de A majör pentatoniğe (−5) taşınır
  const SFX = {
    // Yanardağ sesleri hep küçük, sıcak ve akortlu. Lav bir tehdit değil, ışık nehri.
    bolum5Basla(t) {
      kabar([53, 60, 64, 67, 71], t + .15, 1.2, .6, 2.5, .021, sfxG, true);
      [[77, 0], [81, .4], [79, 1.05], [77, 1.45]].forEach(([n, u], i) => korTasi(n, t + .2 + u, .032, (i - 1.5) * .15, sfxG, true));
    },
    korUyandi(t, e) {
      const k = cl((e && (e.index != null ? e.index : e.i)) || vBahce - 1, 0, 2), ns = [[65, 69, 72, 76], [67, 71, 74, 76], [69, 72, 76, 79]][k];
      ns.forEach((n, i) => { korTasi(n, t + i * .14, .038 - i * .003, (i - 1.5) * .16, sfxG, true); if (i === 3) cam(NOTE(n + 12), t + i * .14, .012, 1.7, .25, sfxG, false); });
    },
    buharZip(t, e) {
      const v = typeof e === 'number' ? cl(e, .2, 1) : .65;
      gur(t, .75, 'bandpass', 460, 1550, .65, .018 * v, .22, .05, 1);
      const ns = akorNotalari(t, 72, 88, true);
      korTasi(ns[0], t + .08, .018, -.2, sfxG, false); korTasi(ns[Math.min(3, ns.length - 1)], t + .3, .016, .2, sfxG, false);
    },
    volkanKristal(t, e) {
      const i = cl(e && Number.isFinite(e.index) ? e.index | 0 : 0, 0, 4), stage = cl(e && e.stage | 0, 0, 2);
      const n = [65, 67, 69, 72, 74][i] + (stage === 2 ? 12 : 0), strength = e && Number.isFinite(e.strength) ? cl(e.strength, .2, 1) : .8;
      korTasi(n, t, .055 * (.7 + strength * .3), (i - 2) * .22, sfxG, true);
      if (stage >= 1) cam(NOTE(n + 12), t + .045, .014, .95, (2 - i) * .12, sfxG, false);
      // Gecikmeli, yumuşak ve uyumlu cevap: solist hep çocuk.
      if (stage === 2 && i % 2 === 0) arp(n - 12, t + .23, .02, (2 - i) * .16, 1.35, sfxG);
    },
    volkanCicekSec(t, e) {
      const pan = cl(((e && e.index) || 0) / 5 - .5, -.5, .5);
      gur(t, .09, 'bandpass', 1100, 2400, .6, .006, .005, pan, 1);
    },
    volkanCicekNefes(t, e) {
      const pan = cl(((e && e.index) || 0) / 5 - .5, -.5, .5);
      gur(t, .43, 'bandpass', 420, 1400, .65, .014, .075, pan, 1);
    },
    volkanCicekAc(t, e) {
      // Tek çiçeğin açılması: kısa yaprak hışırtısı ve sıcak bir parıltı; çalınacak nota yok.
      const pan = cl(((e && e.index) || 0) / 5 - .5, -.5, .5);
      gur(t, .32, 'bandpass', 700, 1600, .65, .009, .018, pan, 1);
      korTasi(77, t + .08, .026, pan, sfxG, false);
    },
    volkanYemTut(t) {
      // Altın meyvenin kâğıt sapını tutma: kısa, yumuşak bir hışırtı.
      gur(t, .13, 'bandpass', 650, 1800, .55, .006, .014, 0, 0);
    },
    volkanYavruBesle(t, e) {
      const i = cl(e && Number.isFinite(e.index) ? e.index | 0 : 0, 0, 2), pan = (i - 1) * .32;
      const full = !!(e && e.babyFed >= 2), n = [65, 69, 72][i];
      // Minik bir lokma ve boğuk, mutlu ötüş; tınlama veya keskin cıvıltı yok.
      gur(t, .14, 'bandpass', 360, 850, .7, .009, .012, pan, 0);
      ton(t + .025, 'sine', 190, 135, .11, .008, .018, pan, 0, sfxG);
      ton(t + .17, 'sine', NOTE(n) * .94, NOTE(n) * 1.05, .17, .008, .035, pan, 1, sfxG);
      if (full) ton(t + .38, 'sine', NOTE(n + 7) * .97, NOTE(n + 7), .22, .006, .055, pan, 1, sfxG);
    },
    volkanYavruUctu(t, e) {
      const i = cl(e && Number.isFinite(e.index) ? e.index | 0 : 0, 0, 2), pan = (i - 1) * .32, n = [65, 69, 72][i];
      gur(t, .22, 'bandpass', 700, 1550, .5, .005, .05, pan, 0);
      gur(t + .2, .22, 'bandpass', 900, 1800, .5, .004, .055, pan, 0);
      ton(t + .1, 'sine', NOTE(n), NOTE(n + 2), .2, .006, .045, pan, 1, sfxG);
      ton(t + .34, 'sine', NOTE(n + 7) * .97, NOTE(n + 7), .25, .005, .06, pan, 1, sfxG);
    },
    ankaYumurta(t, e) {
      // Kabuğun sıcaklığı: çok hafif bir kâğıt nefesi ve alçak, yuvarlak taş sesi.
      const u = cl(e && Number.isFinite(e.progress) ? e.progress : e && Number.isFinite(e.warm) ? e.warm : .3, 0, 1);
      gur(t, .22, 'bandpass', 430, 1050, .6, .004, .045, 0, 0);
      korTasi(u < .4 ? 65 : u < .75 ? 69 : 72, t + .045, .012, -.12 + u * .24, sfxG, false);
    },
    ankaTuy(t, e) {
      // Beş gerçek tüy, tek yükselen Anka cümlesi. Sürtme başına çan yağmuru yok.
      const i = cl(e && Number.isFinite(e.index) ? e.index | 0 : 0, 0, 4), n = [65, 69, 72, 77, 81][i], pan = (i - 2) * .17;
      arp(n, t + .025, .027, pan, 1.15, sfxG);
      korTasi(n + 12, t + .08, .015, pan * .7, sfxG, false);
      gur(t, .16, 'bandpass', 650, 1450, .6, .0035, .035, pan, 0);
    },
    ankaUyanis(t) {
      // Uyanış bir patlama değil: katlanan geniş kanatlar ve sıcak, nefesli bir motif.
      gur(t, 1.15, 'bandpass', 320, 1250, .6, .01, .32, 0, 1);
      kabar([53, 60, 65, 69, 76], t + .15, 1.1, .55, 2.0, .016, sfxG, false);
      [65, 69, 72, 77, 81].forEach((n, i) => arp(n, t + .2 + i * .2, .025, -.3 + i * .15, 1.5, sfxG));
      ton(t + .62, 'sine', NOTE(77) * .97, NOTE(81), .48, .006, .14, .12, 1, sfxG);
    },
    volkanMiniTamam(t, e) {
      if (e && e.phoenix) { korTasi(77, t + .08, .023, 0, sfxG, false); return; }
      if (e && e.yavru) { kabar([53, 60, 65, 69, 76], t + .1, .8, .45, 1.7, .013, sfxG, false); return; }
      [65, 69, 72, 77, 81].forEach((n, i) => korTasi(n, t + i * .14, .04, -.35 + i * .17, sfxG, true));
      kabar([53, 60, 65, 69, 76], t + .45, .7, .4, 2.0, .018, sfxG, true);
    },
    lavSalBasla(t) {
      gur(t, 1.5, 'bandpass', 320, 900, .6, .013, .45, 0, 1);
      korTasi(65, t + .1, .032, -.22, sfxG, true); korTasi(72, t + .45, .03, .22, sfxG, true);
    },
    lavSalAn(t, e) {
      const phase = e && (e.phase || e.faz), ns = phase === 'lift' ? [72, 77, 81] : phase === 'surf' ? [69, 72, 77] : phase === 'arch' ? [77, 81, 84] : [72, 69, 65];
      ns.forEach((n, i) => korTasi(n, t + i * .1, .026, (i - 1) * .3, sfxG, false));
      if (phase === 'lift' || phase === 'surf') gur(t, .75, 'bandpass', 400, 1400, .6, .009, .2, 0, 1);
    },
    lavSalBitti(t) {
      [77, 72, 69, 65].forEach((n, i) => korTasi(n, t + i * .2, .035, (i - 1.5) * .17, sfxG, true));
    },
    volkanFinalBasla(t) {
      ezgiSus(t, t + 3.2);
      kabar([53, 60, 65, 69, 76], t + .12, 2.1, .5, 3.0, .028, sfxG, true);
      [77, 81, 84, 86, 89].forEach((n, i) => cam(NOTE(n), t + .5 + i * .22, .017, 2.4, -.4 + i * .2, sfxG, false));
    },
    volkanTamam(t) {
      kabar([53, 60, 65, 69, 76], t, .65, .6, 3.0, .02, sfxG, true);
      korTasi(77, t + .25, .038, 0, sfxG, true);
    },
    // ── Bölüm 7 (Kuzey Işıkları): hepsi akora uyar; kristal, yumuşak, kısık ──
    bolum7Basla(t) {   // rüya açılır: E majör kış akoru, yukarıdan süzülen kar kristalleri, müzik kutusunda üç–iki–bir
      kabar([40, 52, 59, 63, 66, 71], t + 0.1, 1.3, 0.8, 3, 0.021, sahneG, true);
      [95, 92, 88, 83, 80, 76, 71].forEach((n, i) => cam(NOTE(n), t + 0.2 + i * 0.16, 0.016 - i * 0.001, 2.2, 0.55 - i * 0.18, sahneG, i === 0));
      [[80, 1.5], [78, 1.9], [76, 2.3]].forEach(([n, u], i) => zil(NOTE(n), t + u, 0.032 - i * 0.004, 2.4, -0.2 + i * 0.2, sahneG));
      gur(t, 2.6, 'bandpass', 500, 1300, 0.7, 0.007, 1.1, 0, 1, sahneHam);
    },
    kFener(t, e) {   // kar feneri yanar: kristal "çın" (fener sırasıyla yükselir) + gökte ışık şeridi için yükselen ince glissando
      const i = cl(e && Number.isFinite(e.n) ? e.n : Math.max(k7Fener, +v7Al('fener') || 0), 1, 24), top = v7Al('fenerTop') > 0 ? v7Al('fenerTop') : 10;
      const c = akorNotalari(t, 76, 98, true).filter(m => [4, 6, 8, 11, 1].includes(m % 12)), ns = c.length ? c : akorNotalari(t, 76, 98, true);
      const k = Math.min(ns.length - 1, Math.floor((i - 1) / Math.max(1, top) * ns.length)), n = ns[k];
      const p = k7Pan(e, i % 2 ? 0.25 : -0.25), yon = p < 0 ? 1 : -1;
      oncelikli = true;
      try {
        cam(NOTE(n), t, 0.03, 2.8, p, sfxG, true);
        zil(NOTE(n), t + 0.004, 0.026, 1.8, -p * 0.5, sfxG, false);
        tus(n - 12, t + 0.01, 0.028, 1.8, p, true, sfxG);
        kase(NOTE(n - 12), t + 0.02, 0.01, 3.4, p * 0.5, sfxG);   // buz kristalinin içinde yanan sıcak ışık
        const g = akTon(akorAt(t + 0.5), n - 5, 9, true);   // ışık şeridi: yukarı süzülen incecik çanlar
        g.forEach((m, j) => { if (m <= 103) cam(NOTE(m), t + 0.32 + j * 0.1, 0.0055 + 0.0007 * j, 1.5, cl(p + j * 0.07 * yon, -0.75, 0.75), sfxG, false); });
        ton(t + 0.3, 'sine', NOTE(n), NOTE(n + 12), 1.2, 0.003, 0.5, p, 2, sfxG);
        if (i >= top) kabar([40, 52, 59, 64, 68, 71], t + 0.4, 0.8, 0.6, 2.4, 0.013, sfxG, true);
      } finally { oncelikli = false; }
      gur(t + 0.25, 1.2, 'highpass', 5000, 9000, 0.7, 0.0035, 0.45, p, 2);
      const as = k7AsamaBul(cl(i / Math.max(1, top), 0, 1));
      if (as > k7Asama) { k7Asama = as; k7Tanit = as; }
    },
    kYavru(t, e) {   // yavru kardan fırlayıp uyanır: sevimli pizzicato motifi (yukarı hoplar) + kar serpintisi
      const i = cl(e && Number.isFinite(e.n) ? e.n : k7Yavru, 1, 9), ns = akTon(akorAt(t), i % 2 ? 67 : 71, 5, true), p = k7Pan(e, i % 2 ? -0.2 : 0.2);
      const m = i % 2 ? [0, 1, 2, 4] : [0, 2, 1, 3, 4];
      gur(t, 0.28, 'lowpass', 1800, 450, 0.7, 0.012, 0.01, p, 0);
      oncelikli = true;
      try {
        m.forEach((j, q) => pizzK(ns[j], t + 0.06 + q * 0.11, 0.05 - q * 0.003, cl(p + (q - 2) * 0.1, -0.7, 0.7)));
        zil(NOTE(ns[4] + 12), t + 0.06 + m.length * 0.11, 0.018, 1.5, -p, sfxG, false);
      } finally { oncelikli = false; }
    },
    kZipla(t) {   // yavru Feza'yı yukarı sıçratır: kar "püf"ü + yükselen yumuşak hop + çan
      gur(t, 0.22, 'lowpass', 1400, 380, 0.8, 0.028, 0.008, 0, 0);
      ton(t, 'sine', 230, 620, 0.26, 0.03, 0.012, 0, 1);
      const n = akorNotalari(t, 76, 88, true)[0];
      zil(NOTE(n + 12), t + 0.09, 0.024, 1.4, 0.1, sfxG); cam(NOTE(Math.min(100, n + 19)), t + 0.17, 0.008, 1.3, -0.2, sfxG, false);
    },
    kardanBasla(t) {   // kardan adam oyunu: hoplayan pizz girişi + yuvarlanan karın yumuşak hışırtısı
      akTon(akorAt(t), 64, 5, true).forEach((n, i) => pizzK(n, t + i * 0.12, 0.04, -0.4 + i * 0.2));
      gur(t, 0.9, 'lowpass', 600, 1400, 0.7, 0.01, 0.3, 0, 1);
    },
    kardanTop(t, e) {   // kar topu yerine oturdu: yumuşak "pof" + tatlı çan (büyük → orta → küçük: perde yükselir)
      const i = cl(e && Number.isFinite(e.n) ? e.n : ++k7KardanN, 1, 3), ak = akorAt(t), n = akorTonu(ak, [76, 80, 83][i - 1]);
      gur(t, 0.2, 'lowpass', 900, 300, 0.8, 0.014, 0.01, 0, 0);   // kardan.js ayrıca 'puf' çalar: burada yalnız hafif gövde
      ton(t, 'sine', 180, 110, 0.14, 0.022, 0.006, 0);
      oncelikli = true;
      try {
        zil(NOTE(n), t + 0.03, 0.04, 2, 0.1, sfxG);
        zil(NOTE(n + 12), t + 0.035, 0.013, 1.6, -0.15, sfxG, false);
        tus(n - 12, t + 0.04, 0.02, 1.4, 0, true, sfxG);
        if (i >= 3) akorNotalari(t, n + 1, n + 14, true).slice(0, 3).forEach((m, j) => cam(NOTE(m), t + 0.25 + j * 0.12, 0.012 - j * 0.002, 1.8, (j - 1) * 0.4, sfxG, false));
      } finally { oncelikli = false; }
    },
    kardanParca(t, e) {   // havuç, kömür, atkı, şapka uçarak yerine konar: küçük süzülme + sırayla yükselen tatlı çan
      const i = cl(e && Number.isFinite(e.n) ? e.n : 1, 1, 12), ns = akorNotalari(t, 79, 98, true), n = ns[Math.min(ns.length - 1, (i - 1) % ns.length)], p = ((i % 3) - 1) * 0.3;
      gur(t, 0.22, 'bandpass', 1500, 3200, 0.8, 0.004, 0.09, p, 1);
      oncelikli = true;
      try { zil(NOTE(n), t + 0.15, 0.032, 1.6, p, sfxG); ksilofon(n, t + 0.152, 0.018, -p, 'sedef', sfxG); } finally { oncelikli = false; }
    },
    kardanCanlan(t) {   // kardan adam canlanır: yumuşak oyuncak boru fanfarı + yukarı ışıltı glissandosu + sıcak akor
      ezgiSus(t, t + 2.4);
      [[0, 71, 68, 0.13], [0.17, 71, 68, 0.13], [0.34, 76, 71, 0.16], [0.54, 80, 76, 0.75]].forEach(([d, a, b, u]) => { boru(a, t + d, u, 0.0085, -0.25, sfxG); boru(b, t + d + 0.005, u, 0.006, 0.25, sfxG); tus(a + 12, t + d, 0.012, 0.8, 0, true, sfxG); });
      akTon(AK.KE, 64, 14, true).forEach((n, i) => arp(n, t + 1.2 + i * 0.07, 0.014 + 0.001 * i, -0.6 + i * 0.09, 1.5, sfxG));
      kabar([40, 52, 59, 64, 68, 71], t + 1.1, 0.7, 0.8, 2.4, 0.014, sfxG, true);
      [88, 92, 95].forEach((n, i) => cam(NOTE(n), t + 2.2 + i * 0.13, 0.011, 1.8, (i - 1) * 0.4, sfxG, false));
    },
    kizakBasla(t) {   // kızak kalkar: çıngırak sallanır, esinti, yukarı koşan arp
      for (let i = 0; i < 8; i++) cingirak(t + i * 0.12, 0.4 + i * 0.08, i % 2 ? 0.3 : -0.3, sfxG, i === 7);
      gur(t, 1.4, 'bandpass', 500, 2200, 0.6, 0.009, 0.8, 0, 1);
      akTon(akorAt(t), 64, 10, true).forEach((n, i) => arp(n, t + 0.1 + i * 0.09, 0.02, -0.5 + i * 0.11, 1.3, sfxG));
    },
    kizakTane(t, e) {   // ışık tanesi: akora uyan, sırayla yükselen çan (kaçanlar sırayı bozmaz; uzun arada baştan)
      const ak = akorAt(t), uyar = m => [4, 6, 8, 11, 1].includes(m % 12) && (ak.mel.includes(m % 12) || ak.ton.includes(m % 12));
      if (t - k7TaneT > 6 || !k7TaneSon) k7TaneSon = 75;
      let n = k7TaneSon + 1; while (n <= 98 && !uyar(n)) n++;
      if (n > 98) { n = 81; while (n <= 98 && !uyar(n)) n++; }
      k7TaneSon = n; k7TaneT = t;
      const p = ((n % 5) - 2) * 0.15;
      oncelikli = true;
      try {
        zil(NOTE(n), t, 0.042, 1.4, p, sfxG);
        if (n + 12 <= 103) cam(NOTE(n + 12), t + 0.01, 0.011, 1.3, -p, sfxG, false);
        arp(n - 12, t + 0.015, 0.02, p * 0.5, 1.2, sfxG);
      } finally { oncelikli = false; }
      cingirak(t + 0.02, 0.45, -p, sfxG);
      if (k7Ucus && t - k7ParlakT > 1.5) {   // uçuşta kuzey ışığı perdesinden geçiş: parlak, kısa akor
        k7ParlakT = t;
        kabar(ak.pad.map(m => m + 12), t + 0.02, 0.25, 0.3, 1.4, 0.009, sfxG, true);
      }
    },
    kizakZipla(t, e) {   // tümsekten uçuş: "vıııı" — yükselen yumuşak kaydırma düdüğü + tepede çan (havada ikinci sıçrama: kısa, tiz)
      if (!yerVar(4, t, t + 0.9, true)) return;
      const hv = e && e.hava ? 1.35 : 1;
      const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(500 * hv, t); o.frequency.exponentialRampToValueAtTime(1300 * hv, t + 0.48 / hv);
      const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.018, t + 0.06);
      g.gain.setValueAtTime(0.018, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.66);
      const lp = suzgec('lowpass', 2400, 0.6, g); o.connect(lp); g.connect(sfxG); g.connect(revSfx);
      const lf = ac.createOscillator(); lf.frequency.value = 7; const lg = kazanc(28, o.detune); lf.connect(lg);
      o.start(t); o.stop(t + 0.72); lf.start(t); lf.stop(t + 0.72);
      const n = akorNotalari(t + 0.5, 86, 96, true)[0];
      zil(NOTE(n), t + 0.48, 0.022, 1.4, 0.15, sfxG); cam(NOTE(Math.min(103, n + 12)), t + 0.52, 0.007, 1.2, -0.2, sfxG, false);
    },
    kizakHiz(t) {   // büyük iniş başlar: bir sonraki ölçü başına kadar yükselen arp + hızlanan çıngırak + esinti
      const ak = akorAt(t), uz = cl(sonrakiCubuk - t, 0.6, 3.2), ns = akTon(ak, 59, cl(Math.round(uz / 0.1), 8, 24), true);
      ns.forEach((n, i) => arp(n, t + uz * Math.pow(i / ns.length, 0.8), 0.013 + 0.011 * i / ns.length, -0.6 + 1.2 * i / ns.length, 1.3, sfxG));
      for (let i = 0, x = 0; x < uz - 0.05; i++) { cingirak(t + x, 0.4 + 0.5 * x / uz, i % 2 ? 0.25 : -0.25, sfxG); x += Math.max(0.08, 0.26 - i * 0.02); }
      gur(t, uz + 0.4, 'bandpass', 500, 2600, 0.6, 0.008, uz * 0.8, 0, 1);
      zil(NOTE(akTon(ak, 88, 1, true)[0]), t + uz, 0.022, 2, 0, sfxG);
    },
    kizakKristal(t, e) {   // büyük inişin kuzey kristalleri: yüksekten, sırayla tırmanan cam çan
      const i = cl(e && Number.isFinite(e.i) ? e.i : (k7KrisSon = k7KrisSon + 1), 1, 16), ns = akorNotalari(t, 86, 103, true), n = ns[Math.min(ns.length - 1, (i - 1) % ns.length)], p = (i % 2 ? 0.3 : -0.3);
      oncelikli = true;
      try { cam(NOTE(n), t, 0.018, 1.8, p, sfxG, i % 3 === 0); zil(NOTE(n - 12), t + 0.006, 0.02, 1.4, -p, sfxG, false); } finally { oncelikli = false; }
    },
    kizakUc(t, e) {   // geyik kızağı göğe kaldırır: yukarı süzülen büyülü glissando + açılan parlak akor + çıngırak sağanağı (2. uçuş daha büyük)
      const ak = akorAt(t), b = e && e.n >= 2, g = akTon(ak, 52, b ? 22 : 16, true);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.85) * 1.6, 0.013 + 0.01 * i / g.length, -0.7 + 1.4 * i / g.length, 1.8, sfxG));
        kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.4, 1.3, 1, 2.6, b ? 0.018 : 0.014, sfxG, true);
        akTon(ak, 86, b ? 5 : 3, true).forEach((n, i) => sopranoCan(n, t + 1.4 + i * 0.18, 0.011 - i * 0.0012, (i - 1.5) * 0.3, sfxG));
      } finally { oncelikli = false; }
      for (let i = 0; i < 6; i++) cingirak(t + i * 0.1, 0.35 + i * 0.07, i % 2 ? 0.3 : -0.3, sfxG, i === 5);
      gur(t, 2, 'bandpass', 500, 3400, 0.6, 0.008, 1.2, 0, 2);
    },
    kizakIn(t) {   // uçuş biter, kızak kara iner: yumuşakça inen arp + karda hafif "pof" + iki çan
      const ak = akorAt(t), g = akTon(ak, 64, 10, true).reverse();
      g.forEach((n, i) => arp(n, t + i * 0.09, 0.016 - i * 0.0008, 0.5 - i * 0.1, 1.4, sfxG));
      gur(t + 0.9, 0.3, 'lowpass', 1200, 300, 0.8, 0.016, 0.01, 0, 0);
      [0, 1].forEach(i => cingirak(t + 0.92 + i * 0.12, 0.5 - i * 0.15, i ? 0.3 : -0.3, sfxG));
    },
    kizakKacti(t) {   // kaçan tane göğe süzülür: çok kısık, yukarı kayan tek ince çan (ceza değil)
      const n = akorNotalari(t, 88, 98, true)[0];
      cam(NOTE(n), t, 0.005, 1.6, (rnd() - 0.5) * 0.6, sfxG, false);
    },
    kizakFinalSicrama(t) {   // final sıçrayışı: büyük büyülü glissando (akordan) + tepede tutulmuş parlak akor; müzik nefesini tutar
      const ak = akorAt(t), g = akTon(ak, 55, 18, true);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.85) * 1.1, 0.015 + 0.011 * i / g.length, -0.7 + 1.4 * i / g.length, 1.8, sfxG));
        kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.25, 1, 1.4, 2.6, 0.019, sfxG, true);
        akTon(ak, 88, 4, true).forEach((n, i) => sopranoCan(n, t + 1.1 + i * 0.18, 0.012 - i * 0.002, (i - 1.5) * 0.3, sfxG));
      } finally { oncelikli = false; }
      gur(t, 1.5, 'bandpass', 600, 4200, 0.7, 0.007, 1.0, 0, 2);
    },
    kizakInis(t) {   // büyük iniş: tepeden aşağı süzülen büyük glissando, karda yumuşak "pof", sıcak akor
      const g = []; for (let m = 98; m >= 52; m--) if ([4, 6, 8, 9, 11, 1, 3].includes(m % 12)) g.push(m);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.9) * 1.5, 0.021 - 0.007 * (i / g.length), 0.6 - 1.2 * i / g.length, 1.4, sfxG));
        kabar([40, 52, 59, 64, 68, 71], t + 0.3, 0.7, 0.9, 2.6, 0.016, sfxG, true);
        [83, 88, 92].forEach((n, i) => zil(NOTE(n), t + 1.7 + i * 0.16, 0.02 - i * 0.003, 2, (i - 1) * 0.4, sfxG));
      } finally { oncelikli = false; }
      for (let i = 0; i < 4; i++) cingirak(t + 0.02 + i * 0.15, 0.6 - i * 0.12, i % 2 ? 0.3 : -0.3, sfxG, i === 0);
      gur(t, 0.55, 'lowpass', 900, 200, 0.8, 0.03, 0.02, 0, 1);   // karda "pof"
      ton(t, 'sine', 120, 62, 0.3, 0.032, 0.01, 0);
    },
    kizakKucukInis(t) {   // tümsekten sonra karda minik iniş
      gur(t, 0.18, 'lowpass', 1300, 380, 0.8, 0.014, 0.008, 0, 0);
      cingirak(t + 0.01, 0.4, 0, sfxG);
    },
    kizakBitti(t) {   // kızak durur, Feza iner: iki tatlı çan (yolculuk tamam)
      [80, 88].forEach((n, i) => zil(NOTE(akorTonu(akorAt(t), n)), t + i * 0.22, 0.024 - i * 0.004, 2.2, (i - 0.5) * 0.4, sfxG));
    },
    geyikTanis(t, e) {   // yavru ren geyiğiyle tanışma: sıcak kâse + çelestada Pırıl'ın sıçrayışı, boynuz kristallerinde ışıltı
      const p = k7Pan(e, 0.2);
      kase(NOTE(64), t, 0.01, 3, p * 0.5, sfxG);
      pirilAlinti(t + 0.15, 0.16, 0.028, sfxG, 4, p);
      akTon(akorAt(t), 88, 4, true).forEach((n, i) => cam(NOTE(n), t + 1 + i * 0.09, 0.006, 1.3, cl(p + (i - 1.5) * 0.15, -0.7, 0.7), sfxG, false));
    },
    kuzeyFinal(t) {   // kuzey ışıkları gökyüzünü kaplar: büyük E akoru, göğe yükselen kristal çanlar, rüzgâr nefesi
      ezgiSus(t, t + 2.8);
      kabar([40, 52, 59, 63, 66, 71, 75], t + 0.05, 2, 1, 3.4, 0.02, sfxG, true);
      akTon(AK.KE, 71, 12, true).forEach((n, i) => cam(NOTE(n), t + 0.3 + i * 0.17, 0.011 + i * 0.0005, 2.4, -0.6 + i * 0.11, sfxG, i % 3 === 0));
      gur(t, 3.2, 'bandpass', 400, 2600, 0.6, 0.007, 1.8, 0, 2);
    },
    // doruk ön vuruşu: olay anından bir sonraki ölçü başına kadar kabaran ışık; büyük akoru doruğun ilk ölçüsü çalar
    kuzeyDoruk(t) {
      const ak = akorAt(t), uz = cl(sonrakiCubuk - t, 0.6, 3.2), ns = akTon(ak, 62, cl(Math.round(uz / 0.09), 8, 22), true);
      oncelikli = true;
      try { ns.forEach((n, i) => arp(n, t + uz * Math.pow(i / ns.length, 0.75), 0.012 + 0.011 * i / ns.length, -0.6 + 1.2 * i / ns.length, 1.4, sahneG)); } finally { oncelikli = false; }
      gur(t, uz + 0.5, 'bandpass', 400, 3600, 0.6, 0.007, uz * 0.85, 0, 2, sahneHam);
    },
    kuzeyTamam(t) {   // gösteri biter: tek, uzun kristal çan
      cam(NOTE(88), t, 0.014, 3.2, 0, sfxG, true); zil(NOTE(76), t + 0.02, 0.018, 3, 0, sfxG, false);
    },
    golKay(t, v) {   // buzlu gölde süzülme: buzun üstünde ince "şşiuu" + akordan süzülen üç cam nota
      v = typeof v === 'number' ? cl(v, 0.3, 1) : 0.7;
      const p = (rnd() - 0.5) * 0.4, ns = akorNotalari(t, 83, 96, true);
      gur(t, 1.3, 'bandpass', 1400, 3200, 1.2, 0.006 * v, 0.35, p, 1);
      ton(t + 0.05, 'sine', 900, 1500, 1.0, 0.0016 * v, 0.3, p, 2);
      [0, 2, 1].forEach((j, i) => cam(NOTE(ns[Math.min(ns.length - 1, j)]), t + 0.15 + i * 0.22, 0.008 * v, 1.6, p + (i - 1) * 0.25, sfxG, i === 2));
    },
    // ── Bölüm 8 (Balkabağı Gecesi): sevimli, yumuşak, kısa; hepsi o anki akora uyar; ani, sert ya da ürkütücü ses yok ──
    bolum8Basla(t) {   // rüya açılır: Re minör akoru (org + sıcak kabarış), yukarıdan inen çelesta, uzakta hayalet "uuu", müzik kutusunda ana motif
      kabar([38, 50, 57, 62, 65, 69], t + 0.1, 1.2, 0.8, 3, 0.02, sahneG, true);
      c8Org([62, 65, 69], t + 0.15, 1.6, 0.006, sahneG);
      [93, 89, 86, 81, 77, 74, 69].forEach((n, i) => tus(n, t + 0.25 + i * 0.13, 0.022 - i * 0.0015, 1.6, 0.55 - i * 0.18, true, sahneG));
      c8Hayalet([[0, 81], [0.6, 86], [1.3, 84], [1.8, 84]], t + 1.0, 0.01, -0.3, sahneG);
      [[74, 2.0], [74, 2.3], [76, 2.45], [77, 2.6], [81, 2.9]].forEach(([n, u], i) => zil(NOTE(n), t + u, 0.03, 1.6, -0.2 + i * 0.1, sahneG));
    },
    kostumPuf(t, v) {   // kostüm giyilir: yumuşak sihirli "puf" + yukarı süzülen çelesta + parıltı; kostüme göre minik imza
      const ak = akorAt(t), ad = typeof v === 'string' ? v : v && v.ad || v8Al('kostum');
      gur(t, 0.45, 'lowpass', 1500, 320, 0.7, 0.026, 0.012, 0, 1);
      ton(t, 'sine', 240, 140, 0.18, 0.018, 0.008, 0);
      oncelikli = true;
      try {
        akTon(ak, 76, 8, true).forEach((n, i) => tus(n, t + 0.08 + i * 0.05, 0.02 + i * 0.001, 1.2, -0.5 + i * 0.14, true, sfxG));
        akTon(ak, 88, 3, true).forEach((n, i) => cam(NOTE(n), t + 0.5 + i * 0.09, 0.012, 1.6, (i - 1) * 0.4, sfxG, i === 2));
        if (ad === 'kabak') { c8Tuba(50, t + 0.75, 0.16, 0.045, 0, sfxG); c8Tuba(57, t + 0.95, 0.24, 0.04, 0, sfxG); }   // tombul "pom-pom"
        else if (ad === 'iskelet') [74, 77, 81, 86].forEach((n, i) => c8Ksil(n, t + 0.72 + i * 0.07, 0.03, -0.3 + i * 0.2, sfxG));   // kemik tıngırtısı
        else if (ad === 'cadi') [86, 90, 93, 98].forEach((n, i) => tus(n, t + 0.72 + i * 0.06, 0.014, 1, 0.3 - i * 0.2, true, sfxG));   // asanın yıldızı
      } finally { oncelikli = false; }
      if (ad === 'yarasa') SFX.yarasaPir(t + 0.7, 0.7);
      gur(t + 0.1, 0.8, 'highpass', 6000, 9000, 0.7, 0.0035, 0.05, 0, 2);
    },
    kabakFener(t, v) {   // kabak feneri canlanır: ışık doğar ("fuuş"), kabak "blup" diye uyanır, sırayla yükselen sıcak çan; yüzüne göre minik imza
      const sayi = typeof v === 'number' && Number.isFinite(v) ? v : v && Number.isFinite(v.n) ? v.n : null;
      const top = v8Al('fenerTop') > 0 ? v8Al('fenerTop') : 12, i = cl(Math.round(sayi != null && sayi >= 1 ? sayi : Math.max(c8Fener, +v8Al('fener') || 0, 1)), 1, 24);
      const c = akorNotalari(t, 74, 96, true).filter(m => [2, 5, 7, 9, 0].includes(m % 12)), ns = c.length ? c : akorNotalari(t, 74, 96, true);
      const k = Math.min(ns.length - 1, Math.floor((i - 1) / Math.max(1, top) * ns.length)), n = ns[k], p = k7Pan(v && typeof v === 'object' ? v : null, i % 2 ? 0.25 : -0.25);
      gur(t, 0.8, 'bandpass', 300, 1800, 1, 0.008, 0.6, p, 1);   // ışık doğar (kabak 0,75 sn sonra canlanır: kabak.js)
      oncelikli = true;
      try {
        const d = 0.72;
        hop(n - 12, t + d, 0.035, p, sfxG);
        zil(NOTE(n), t + d + 0.04, 0.032, 1.8, p, sfxG); tus(n - 12, t + d + 0.045, 0.022, 1.6, -p * 0.5, true, sfxG);
        cam(NOTE(n + 12 <= 100 ? n + 12 : n), t + d + 0.06, 0.008, 1.6, -p, sfxG, false);
        const yuz = (i - 1) % 4, y = akTon(akorAt(t + 1), n - 2, 4, true);
        if (yuz === 0) [2, 1, 0].forEach((j, q) => tus(y[j] + 12, t + d + 0.32 + q * 0.09, 0.015, 0.6, p, true, sfxG));   // kıkır kıkır (gülen)
        else if (yuz === 1) [0, 3].forEach((j, q) => zil(NOTE(y[j] + 12), t + d + 0.32 + q * 0.16, 0.015, 1.2, -p, sfxG, false));   // göz kırpan "çın-çın"
        else if (yuz === 2) ton(t + d + 0.32, 'sine', NOTE(n - 7), NOTE(n - 2), 0.16, 0.011, 0.01, p, 1, sfxG);   // dil çıkaran "blırp"
        else for (let q = 0; q < 5; q++) c8Ksil(y[q % 2 ? 1 : 2], t + d + 0.32 + q * 0.06, 0.016 - q * 0.002, p, sfxG);   // kahkaha (ksilofon)
        if (i >= top) { const ak = akorAt(t + 1); kabar([ak.bas + 12].concat(ak.pad.map(m => m + 12)), t + d + 0.2, 0.7, 0.7, 2.2, 0.013, sfxG, true); }
      } finally { oncelikli = false; }
      const as = c8AsamaBul(cl(i / Math.max(1, top), 0, 1));
      if (as > c8Asama) { c8Asama = as; c8Tanit = as; }
    },
    hayaletKikir(t, v) {   // saklanan hayaletçiğin kıkırtısı: ses değil, inen beş minik ıslık cıvıltısı ("hi-hi-hi" gibi), uzaktan ve yankılı
      const g = typeof v === 'number' && v > 0 ? cl(v, 0.3, 1) : 1, p = v && Number.isFinite(v.pan) ? cl(v.pan, -0.7, 0.7) : (rnd() - 0.5) * 0.8, f0 = 1250 + rnd() * 200;   // v 0 / yok: tam
      for (let i = 0; i < 5; i++) {
        const ts = t + i * (0.075 + i * 0.006), f = f0 * (1 - i * 0.035);
        if (!yerVar(1, ts, ts + 0.1, true)) continue;
        const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 0.92, ts); o.frequency.exponentialRampToValueAtTime(f * 1.12, ts + 0.025); o.frequency.exponentialRampToValueAtTime(f * 0.96, ts + 0.06);
        const gg = zarf(ts, 0.008, 0.011 * g * (1 - i * 0.12), 0.06, panla(sfxG, p)); gg.connect(revSfxCok); o.connect(gg); o.start(ts); o.stop(ts + 0.09);
      }
    },
    hayaletCee(t, v) {   // "Ce-ee!": hayaletçik çıkar – yukarı kayan neşeli hayalet ıslığı, yumuşak "pop", parlak akor ışıltısı ve kıkırtı (ani değil)
      const ak = akorAt(t), ns = akTon(ak, 74, 6, true), p = k7Pan(v && typeof v === 'object' ? (v.o || v) : null, 0.15);
      c8Hayalet([[0, ns[1]], [0.15, ns[3]], [0.3, ns[2]], [0.45, ns[4]], [0.95, ns[4]]], t, 0.015, p, sfxG);
      gur(t + 0.02, 0.22, 'lowpass', 1600, 400, 0.8, 0.01, 0.015, p, 1);
      oncelikli = true;
      try {
        ak.pad.slice(1).forEach((n, i) => tus(n + 24, t + 0.45 + i * 0.03, 0.013 - i * 0.0015, 1.4, cl(p + (i - 2) * 0.15, -0.7, 0.7), true, sfxG));
        akTon(ak, 86, 4, true).forEach((n, i) => cam(NOTE(n), t + 0.6 + i * 0.08, 0.009, 1.4, cl(p + (i - 1.5) * 0.2, -0.7, 0.7), sfxG, i === 3));
      } finally { oncelikli = false; }
      SFX.hayaletKikir(t + 1.0, 0.8);
    },
    kabakYuzBaloncuk(t, v) {   // kabağın tepesinden üç sihirli baloncuk yükselir: "blup-blup-blup" + incecik ışıltı (tur ilerledikçe perde yükselir)
      const tur = cl(Number.isFinite(v) ? v : 0, 0, 2), ns = akTon(akorAt(t), 69 + tur * 3, 3, true);
      ns.forEach((n, i) => { c8Kabarcik(t + i * 0.18, NOTE(n), 0.018, -0.3 + i * 0.3, sfxG); cam(NOTE(n + 24 <= 100 ? n + 24 : n + 12), t + i * 0.18 + 0.06, 0.005, 1, -0.3 + i * 0.3, sfxG, false); });
    },
    kabakYuzParca(t, v) {   // parça uçup yerine oturur: "fiuu" + tahta "tık" + yükselen çan; kabağın tepkisi (göz kırpar · burnunu oynatır · gülümser)
      const n0 = cl(Math.round(v && Number.isFinite(v.n) ? v.n : Number.isFinite(v) ? v : 1), 1, 9), ad = String(v && (v.tur || v.ad) || '').toLowerCase(), ak = akorAt(t), p = ((n0 % 3) - 1) * 0.3;
      gur(t, 0.25, 'bandpass', 700, 2600, 1, 0.005, 0.18, p, 1);
      const ns = akorNotalari(t, 76, 96, true), m = ns[Math.min(ns.length - 1, (n0 - 1) * 2)];
      oncelikli = true;
      try {
        c8Kemik(t + 0.02, 0.8, p, sfxG, 1300);
        zil(NOTE(m), t + 0.04, 0.03, 1.5, p, sfxG); c8Ksil(m - 12, t + 0.042, 0.02, -p, sfxG);
        const tip = /goz|göz/.test(ad) ? 0 : /burun/.test(ad) ? 1 : /agiz|ağız/.test(ad) ? 2 : (n0 - 1) % 3, y = akTon(ak, m, 3, true);
        if (tip === 0) [0, 2].forEach((j, q) => tus(y[j] + 12, t + 0.22 + q * 0.13, 0.014, 0.8, -p, true, sfxG));
        else if (tip === 1) { ton(t + 0.22, 'sine', 900, 520, 0.14, 0.012, 0.006, -p, 1, sfxG); hop(m - 5, t + 0.38, 0.022, -p, sfxG); }
        else akTon(ak, m - 7, 5, true).forEach((x, q) => tus(x, t + 0.22 + q * 0.05, 0.013 + q * 0.001, 0.9, cl(-p + q * 0.1, -0.7, 0.7), true, sfxG));
      } finally { oncelikli = false; }
    },
    kabakYuzKikir(t, v) {   // kabak kıkırdar: ses değil, hoplayan "bup" notaları (0.3 küçük · 0.5 gıdıklanma · 1 canlanmadaki kahkaha ~1,2 sn)
      const g = Number.isFinite(v) ? cl(v, 0.2, 1) : 0.5, say = g >= 0.9 ? 9 : g >= 0.45 ? 5 : 3, ns = akTon(akorAt(t), 72, 5, true);
      oncelikli = true;
      try {
        for (let q = 0; q < say; q++) {
          const n = ns[say > 5 ? [3, 2, 3, 2, 4, 3, 2, 1, 0][q] : [3, 2, 1, 2, 0][q % 5]];
          hop(n, t + q * (say > 5 ? 0.13 : 0.1), (0.022 + 0.01 * g) * (1 - q * 0.05), (q % 2 ? 0.2 : -0.2), sfxG);
        }
        if (g >= 0.9) akTon(akorAt(t), 86, 4, true).forEach((n, i) => cam(NOTE(n), t + 0.4 + i * 0.2, 0.007, 1.2, (i % 2 ? 0.4 : -0.4), sfxG, false));
      } finally { oncelikli = false; }
    },
    kabakYuzCanlan(t) {   // kabak canlanır (0–1,3 sn ışık doğar): yükselen sıcak kabarış + akordan yukarı glissando; 1,3'te ışıl ışıl Re majör çan sağanağı
      ezgiSus(t, t + 3);
      const ak = akorAt(t);
      gur(t, 1.3, 'bandpass', 300, 2400, 0.8, 0.01, 1.0, 0, 2);
      oncelikli = true;
      try {
        akTon(ak, 62, 14, true).forEach((n, i) => arp(n, t + Math.pow(i / 14, 0.85) * 1.25, 0.013 + 0.008 * i / 14, -0.6 + i * 0.09, 1.5, sfxG));
        kabar([38, 50, 57, 62, 66, 69, 74], t + 0.05, 1.25, 0.8, 2.4, 0.016, sfxG, true);   // içi ışıl ışıl: Re majör (sevinç)
        [93, 90, 86, 81, 78, 74].forEach((n, i) => cam(NOTE(n), t + 1.32 + i * 0.1, 0.011, 1.6, 0.5 - i * 0.2, sfxG, i < 2));
        [86, 90, 93].forEach((n, i) => tus(n, t + 1.3 + i * 0.07, 0.016, 1.2, (i - 1) * 0.3, true, sfxG));
      } finally { oncelikli = false; }
    },
    iskeletNota(t, v) {   // kaburga ksilofonu: i = 0..5 → Re Fa Sol La Do Re' (eşlik 112 BPM bu notalara uyar); çocuğun dokunduğu an çalar
      const i = cl(Math.round(Number.isFinite(v) ? v : v && Number.isFinite(v.i) ? v.i : 0), 0, 5), n = ISK_NOTA[i], p = (i - 2.5) * 0.14;
      oncelikli = true;
      try {
        c8Ksil(n, t, 0.1, p, sfxG, true);
        tus(n + 12, t + 0.004, 0.012, 0.9, -p * 0.5, true, sfxG);
        c8Kemik(t + 0.002, 0.2, p, sfxG, 1500 + i * 120);
      } finally { oncelikli = false; }
    },
    iskeletDans(t, v) {   // iskeletler dans eder (ISKELET vuruşunda çağırır): 1–3 cümle sonu (bir ölçü) · 5 büyük kemik dansı (iki ölçü) · 6 "ta-da!" (Re majör)
      const n = Number.isFinite(v) ? v : 1, V = ISK_V, z = x => iskZ(t, x);
      oncelikli = true;
      try {
        if (n === 6) {   // kapanış vuruşu: Re majör akor, ksilofon tremolosu, tuba, org, çanlar; yaylı ve koro Re majöre geçer
          c8IskTada = true;
          kabar([38, 50, 57, 62, 66, 69, 74], t + 0.01, 0.05, 0.9, 1.8, 0.02, sfxG, true);
          c8Tuba(50, t + 0.005, 0.5, 0.068, 0, sfxG); c8Org([62, 66, 69, 74], t + 0.01, 1.1, 0.008, sfxG);
          for (let q = 0; q < 8; q++) c8Ksil([74, 78, 81, 86][q % 4], t + 0.01 + q * 0.06, 0.03 - q * 0.002, (q % 4 - 1.5) * 0.25, sfxG);
          [86, 90, 93].forEach((m, q) => zil(NOTE(m), t + 0.3 + q * 0.16, 0.018, 2.2, (q - 1) * 0.4, sfxG));
          c8Sik(t, 1.1, 0, sfxG); for (let q = 0; q < 5; q++) tef(t + 0.02 + q * 0.07, q ? 0 : 0.6, 0.5, q % 2 ? 0.3 : -0.3, sfxG);
          sesYurut(tel, AK.D, 57, 78, t, 0.05); sesYurut(koro, AK.D, 59, 72, t, 0.08);
          akorlar.push({ t, ak: AK.D }); akorlar.sort((a, b) => a.t - b.t); if (akorlar.length > 6) akorlar.shift();
        } else if (n >= 4) {   // büyük kemik dansı (8 vuruş; ezgiyi iskeletler çalar): eşlik susar, burada şenlik bandı – akor 2 vuruşta bir (Dm F Gm/C Dm)
          c8IskFin = t;
          const aks = ['IDm', 'IF', 'IGmC', 'IDm'];
          for (let b = 0; b < 8; b++) {
            const ak = AK[aks[b >> 1]], kok = c8Kok(ak);
            c8Tuba(b % 2 ? kok + 7 : kok, z(b) + 0.005, b % 2 ? 0.15 : 0.2, b % 2 ? 0.044 : 0.058, 0, sfxG);
            if (b % 2 === 0) c8Org(ak.pad.slice(1, 4), z(b) + 0.01, 2 * V * 0.9, 0.005, sfxG);
            if (b % 2) c8Sik(z(b) + 0.003, 1, b % 4 === 1 ? -0.3 : 0.3, sfxG);
            tef(z(b) + 0.004, b % 2 ? 0 : 0.4, 0.3, 0, sfxG); tef(z(b + 0.5) + 0.004, 0, 0.55, b % 2 ? 0.2 : -0.2, sfxG);
            ak.pad.slice(1, 4).forEach((m, i) => c8Klav(m < 57 ? m + 12 : m, z(b + 0.5) + i * 0.008, 0.009, (i - 1) * 0.3, sfxG, 0.3));
          }
          akTon(AK.IDm, 62, 10, true).forEach((m, i) => c8Ksil(m, t + i * 0.035, 0.018 + i * 0.001, -0.5 + i * 0.1, sfxG));   // girişte minik glissando
        } else {   // cümle sonu dansı (bir ölçü): alçak ksilofon "tıngırtı" (swing), zıplayan pizz bası, 2-4'te şıklatma
          const ak = akorAt(t + 0.1), kok = c8Kok(ak), riff = [[0, 69], [0.5, 72], [1, 74], [1.5, 72], [2, 69], [2.5, 67], [3, 69], [3.5, 74]];
          riff.forEach(([x, m], q) => c8Ksil(m - (q % 4 === 3 ? 0 : 0), z(x) + 0.006, 0.026 - (q % 2 ? 0.006 : 0), (q % 2 ? 0.3 : -0.3), sfxG));
          [0, 1, 2, 3].forEach(b => pizzK(b % 2 ? kok + 19 : kok + 12, z(b) + 0.008, 0.03, b % 2 ? 0.2 : -0.2, sfxG));
          [1, 3].forEach(b => c8Sik(z(b) + 0.003, 0.9, b === 1 ? -0.3 : 0.3, sfxG));
        }
      } finally { oncelikli = false; }
    },
    kemikTakir(t, v) {   // kemikler takır takır: yumuşak tahta "ta-kır" (v 0..1 güç; ISKELET her vuruşta çağırır) · güçsüz çağrıda dört tık (iskelet nine sevinir)
      const cok = v && typeof v === 'object' && v.cok, g = (cok ? 0.85 : cl(Number.isFinite(v) ? v : 0.8, 0.2, 1.2)) * 0.8, say = cok ? 4 : 2, p0 = (rnd() - 0.5) * 0.5;
      for (let q = 0; q < say; q++) c8Kemik(t + q * (cok ? 0.085 : 0.07) + rnd() * 0.01, g * (1 - q * 0.12), cl(p0 + (q % 2 ? 0.2 : -0.2), -0.7, 0.7), sfxG, 950 + ((q * 7 + (rnd() * 3 | 0)) % 5) * 110);
    },
    kapiTak(t, v) {   // kapı tokmağı: tek yumuşak, tok "tak" (keçe sarılı tokmak gibi; SOKAK üç kez 0,3 sn arayla çağırır, v = 0, 1, 2)
      const i = cl(Number.isFinite(v) ? v : 0, 0, 2), g = 1 - i * 0.1;
      ton(t, 'sine', 205 - i * 8, 140, 0.1, 0.03 * g, 0.002, 0.15, 1);
      ton(t, 'triangle', 640 - i * 20, 480, 0.03, 0.008 * g, 0.001, 0.15, 0);
      gur(t, 0.045, 'lowpass', 1400, 600, 0.8, 0.012 * g, 0.001, 0.15, 0);
    },
    kapiAc(t, v) {   // kapı açılır (v 1): gıcırtısız sıcak "vuşş" + kapı zili "din-don" + içeriden sıcak ışık · kapanır (v 0): yumuşak "tık" + minik çan
      const ak = akorAt(t);
      if (v === 0) { ton(t, 'sine', 320, 240, 0.06, 0.016, 0.002, -0.1, 0); gur(t, 0.04, 'lowpass', 1800, 700, 0.8, 0.008, 0.001, -0.1, 0); zil(NOTE(akorTonu(ak, 86)), t + 0.06, 0.012, 1.2, 0.1, sfxG, false); return; }
      gur(t, 0.6, 'lowpass', 500, 1100, 0.7, 0.012, 0.25, 0, 1);
      oncelikli = true;
      try {
        zil(NOTE(81), t + 0.05, 0.036, 2.2, -0.15, sfxG); tus(69, t + 0.055, 0.018, 1.8, 0.1, true, sfxG);
        zil(NOTE(77), t + 0.47, 0.036, 2.6, 0.15, sfxG); tus(65, t + 0.475, 0.018, 2.2, -0.1, true, sfxG);
        kabar(ak.pad.map(n => n + 12), t + 0.3, 0.5, 0.5, 1.6, 0.008, sfxG, false);
        akTon(akorAt(t + 0.6), 86, 4, true).forEach((n, i) => cam(NOTE(n), t + 0.75 + i * 0.07, 0.007, 1.3, -0.3 + i * 0.2, sfxG, i === 3));
      } finally { oncelikli = false; }
    },
    kapiFener(t) {   // kapının üstündeki küçük fener yanar: yumuşak sıcak çan + ışıltı
      const n = akorNotalari(t, 81, 93, true)[0];
      oncelikli = true; try { zil(NOTE(n), t, 0.022, 1.8, 0.2, sfxG); cam(NOTE(n + 12 <= 100 ? n + 12 : n), t + 0.02, 0.007, 1.4, -0.2, sfxG, false); } finally { oncelikli = false; }
      gur(t, 0.4, 'highpass', 5000, 8000, 0.7, 0.003, 0.05, 0.2, 2);
    },
    sekerUc(t, v) {   // şeker yay çizip sepete uçar: yükselip inen çelesta kıvrımı (şeker sırasıyla perde yükselir) + incecik "fiyuu"
      const i = cl(Number.isFinite(v) ? v : 0, 0, 9), ak = akorAt(t), ns = akTon(ak, 79 + Math.min(i, 6) * 2, 4, true), p = ((i % 3) - 1) * 0.3;
      [0, 1, 2, 1].forEach((j, q) => tus(ns[j] + 12 > 100 ? ns[j] : ns[j] + 12, t + q * 0.055, 0.011 + (q === 2 ? 0.003 : 0), 0.55, cl(p + q * 0.1, -0.7, 0.7), true, sfxG));
      ton(t, 'sine', 900 + i * 40, 1500 + i * 60, 0.28, 0.0022, 0.11, p, 1, sfxG);
    },
    sekerSepet(t, v) {   // şeker sepete düşer: yumuşak "pıt" + sepet doldukça yükselen tatlı çan (v sıra; yoksa kendi sayacımız, uzun arada baştan)
      const ak = akorAt(t), uyar = m => (ak.mel.includes(m % 12) || ak.ton.includes(m % 12)) && [2, 5, 7, 9, 0, 4].includes(m % 12);
      if (Number.isFinite(v) && v >= 0 && v < 20) { const ns = akorNotalari(t, 77, 96, true).filter(uyar); c8SekerSon = (ns.length ? ns : [81])[Math.min(v, (ns.length || 1) - 1)]; }
      else { if (t - c8SekerT > 5 || !c8SekerSon) c8SekerSon = 76; let n = c8SekerSon + 1; while (n <= 96 && !uyar(n)) n++; c8SekerSon = n > 96 ? 81 : n; }
      c8SekerT = t; const n = c8SekerSon;
      gur(t, 0.08, 'lowpass', 1200, 500, 0.9, 0.011, 0.003, 0.2, 0);
      ton(t, 'sine', 320, 200, 0.07, 0.012, 0.003, 0.2, 0);
      oncelikli = true; try { zil(NOTE(n), t + 0.02, 0.028, 1.3, 0.2, sfxG); c8Ksil(n - 12, t + 0.022, 0.013, -0.1, sfxG); } finally { oncelikli = false; }
    },
    sakaKonfeti(t, v) {   // tatlı şaka: 0 konfeti (yumuşak "pomf", patlama değil + çan yağmuru) · 1 baloncuklar (yükselen "blup"lar, minik "pıt"lar) · 2 yıldız yağmuru
      const tip = Number.isFinite(v) ? v : 0, ak = akorAt(t), ns = akTon(ak, 79, 12, true);
      oncelikli = true;
      try {
        if (tip === 1) {
          for (let q = 0; q < 8; q++) c8Kabarcik(t + q * 0.11 + rnd() * 0.04, NOTE(ns[(q * 3) % 12] - 12), 0.016, (rnd() - 0.5) * 1, sfxG);
          for (let q = 0; q < 4; q++) { const ts = t + 0.9 + q * 0.22 + rnd() * 0.05; gur(ts, 0.05, 'bandpass', 2400, 0, 1.2, 0.006, 0.002, (rnd() - 0.5) * 0.8, 1); cam(NOTE(ns[11 - q * 2]), ts + 0.01, 0.006, 0.9, (rnd() - 0.5) * 0.8, sfxG, false); }
        } else if (tip === 2) {
          for (let q = 0; q < 10; q++) cam(NOTE(ns[11 - q] + (q < 3 ? 12 : 0) > 100 ? ns[11 - q] : ns[11 - q] + (q < 3 ? 12 : 0)), t + q * 0.11 + rnd() * 0.03, 0.009 - q * 0.0004, 1.5, (rnd() - 0.5) * 1.2, sfxG, q < 2);
          gur(t, 1.4, 'highpass', 6500, 8500, 0.7, 0.003, 0.3, 0, 2);
        } else {
          gur(t, 0.35, 'lowpass', 1300, 280, 0.7, 0.024, 0.02, 0, 1);
          ton(t, 'sine', 180, 110, 0.2, 0.014, 0.01, 0);
          for (let q = 0; q < 12; q++) (q % 3 ? cam : zil)(NOTE(ns[11 - q]), t + 0.12 + q * 0.07 + rnd() * 0.03, 0.009 - q * 0.0004, 1.2, (rnd() - 0.5) * 1.2, sfxG, q < 2);
          gur(t + 0.1, 1.6, 'highpass', 4500, 7000, 0.7, 0.004, 0.3, 0, 1);   // dökülen kâğıt
        }
      } finally { oncelikli = false; }
    },
    sakaYay(t, v) {   // 0 yaylı kutudan gülen kabak "boing" · 1 şapkadan tavşan "pop" (yumuşak mantar sesi) · 2 kapı tokmağı çiçek açar (yukarı arp + çan)
      const tip = Number.isFinite(v) ? v : 0, ak = akorAt(t);
      oncelikli = true;
      try {
        if (tip === 1) {
          ton(t, 'sine', 900, 380, 0.09, 0.02, 0.003, 0, 1); gur(t, 0.06, 'bandpass', 1800, 900, 1.2, 0.01, 0.002, 0, 1);
          akTon(ak, 79, 5, true).forEach((n, i) => tus(n + 12 > 100 ? n : n + 12, t + 0.15 + i * 0.05, 0.013, 0.8, -0.3 + i * 0.15, true, sfxG));
        } else if (tip === 2) {
          akTon(ak, 64, 10, true).forEach((n, i) => arp(n, t + i * 0.06, 0.014 + i * 0.001, -0.5 + i * 0.1, 1.4, sfxG));
          zil(NOTE(akorTonu(ak, 86)), t + 0.62, 0.022, 1.8, 0.2, sfxG); cam(NOTE(akorTonu(ak, 93)), t + 0.68, 0.008, 1.6, -0.2, sfxG, false);
        } else {
          gur(t, 0.12, 'lowpass', 1500, 600, 0.8, 0.011, 0.004, 0, 0);
          c8Boing(t + 0.03, 1, 0, sfxG);
          [86, 81, 86, 81].forEach((n, q) => c8Ksil(akorTonu(ak, n), t + 0.55 + q * 0.07, 0.02 - q * 0.003, q % 2 ? 0.25 : -0.25, sfxG));
        }
      } finally { oncelikli = false; }
    },
    kazanFokur(t, v) {   // kazan fokurdar: alçak yumuşak "glup"lar + akordan minik kabarcıklar
      const g = Number.isFinite(v) ? cl(v, 0.3, 1.5) : 1, kp = akTon(akorAt(t), 57, 8, true);
      for (let q = 0; q < 5; q++) {
        const ts = t + q * 0.17 + rnd() * 0.1;
        c8Kabarcik(ts, NOTE(sec(kp)), 0.012 * g, (rnd() - 0.5) * 0.6, sfxG);
        if (q % 2 === 0) ton(ts, 'sine', 140 + rnd() * 40, 240, 0.09, 0.011 * g, 0.01, (rnd() - 0.5) * 0.5, 0);
      }
      gur(t, 0.9, 'lowpass', 500, 300, 0.8, 0.004 * g, 0.2, 0, 0);
    },
    kazanMalzeme(t, v) {   // malzeme kazana düşer: "blup" + kabarcık sağanağı + kazan rengi değişir (her malzemede bir kat yukarıda parlak akor)
      const n = cl(Math.round(v && Number.isFinite(v.n) ? v.n : Number.isFinite(v) ? v : ++c8KazanN), 1, 6), ak = akorAt(t + 0.3);
      ton(t, 'sine', 260, 120, 0.18, 0.022, 0.005, 0, 1);
      gur(t, 0.3, 'lowpass', 1200, 400, 0.8, 0.011, 0.01, 0, 1);
      for (let q = 0; q < 6; q++) c8Kabarcik(t + 0.1 + q * 0.06 + rnd() * 0.04, NOTE(akTon(ak, 62 + n * 3, 6, true)[q]), 0.011, (rnd() - 0.5) * 0.6, sfxG);
      oncelikli = true;
      try {
        akTon(ak, 64 + n * 3, 5).forEach((m, i) => tus(m + 12 > 100 ? m : m + 12, t + 0.35 + i * 0.045, 0.015 - i * 0.0015, 1.6, -0.4 + i * 0.2, true, sfxG));
        akTon(ak, 86, 3, true).forEach((m, i) => cam(NOTE(m), t + 0.6 + i * 0.09, 0.008, 1.6, (i - 1) * 0.4, sfxG, i === 2));
      } finally { oncelikli = false; }
      gur(t + 0.3, 1.2, 'bandpass', 600, 2400, 0.7, 0.004, 0.5, 0, 2);   // kokulu ışık bulutu
    },
    kazanPuf(t) {   // kazandan büyük renkli bulut: yumuşak "vuuf" (patlama yok) + gökkuşağı kabarcıkları + yukarı süzülen ışıltı
      const ak = akorAt(t), kp = akTon(ak, 62, 12, true);
      gur(t, 0.9, 'lowpass', 900, 300, 0.7, 0.024, 0.06, 0, 2);
      ton(t, 'sine', 140, 90, 0.5, 0.017, 0.04, 0);
      for (let q = 0; q < 12; q++) c8Kabarcik(t + 0.05 + q * 0.05, NOTE(kp[q]), 0.011, -0.6 + q * 0.1, sfxG);
      oncelikli = true;
      try { kabar([ak.bas + 12].concat(ak.pad.map(m => m + 12)), t + 0.2, 0.6, 0.6, 2, 0.013, sfxG, true); akTon(ak, 86, 4, true).forEach((m, i) => cam(NOTE(m), t + 0.7 + i * 0.1, 0.009, 1.6, -0.4 + i * 0.27, sfxG, i === 3)); } finally { oncelikli = false; }
    },
    supurgeCanlan(t, v) {   // süpürge canlanır (kazan sonu): yükselen sihirli glissando + "vııın" + sevinçli çelesta + sıcak akor · v 0: Feza biner (kısa, hafif)
      const ak = akorAt(t);
      if (v === 0) {
        oncelikli = true;
        try { akTon(ak, 69, 8, true).forEach((n, i) => arp(n, t + i * 0.06, 0.013 + 0.001 * i, -0.4 + i * 0.1, 1.2, sfxG)); akTon(ak, 84, 3, true).forEach((n, i) => tus(n, t + 0.5 + i * 0.08, 0.016, 1, -0.2 + i * 0.2, true, sfxG)); } finally { oncelikli = false; }
        SFX.supurgeVin(t + 0.1, 0); return;
      }
      ezgiSus(t, t + 2.4);
      const g = akTon(ak, 57, 16, true);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.8) * 1.0, 0.014 + 0.01 * i / g.length, -0.7 + 1.4 * i / g.length, 1.6, sfxG));
        kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.6, 0.6, 0.8, 2.2, 0.014, sfxG, true);
        akTon(ak, 84, 4, true).forEach((n, i) => tus(n, t + 1.1 + i * 0.09, 0.019, 1.2, -0.3 + i * 0.2, true, sfxG));
      } finally { oncelikli = false; }
      SFX.supurgeVin(t + 0.4, 0.8);
    },
    supurgeVin(t, v) {   // süpürge "vuuş": yumuşak rüzgâr süpürmesi (0 kalkış · 1 yükseliş, kısa · 2 ay anında yavaş, uzun süzülüş)
      const tip = Number.isFinite(v) && v >= 0 && v <= 2 ? Math.round(v) : 1, p = (rnd() - 0.5) * 0.6, d = tip === 2 ? 2.2 : tip === 0 ? 1.2 : 0.8, g = tip === 1 ? 0.75 : 1;
      const f = gur(t, d, 'bandpass', 380, 0, 1.2, 0.018 * g, d * 0.35, p, 1);
      if (f) { f.frequency.setValueAtTime(tip === 2 ? 300 : 380, t); f.frequency.exponentialRampToValueAtTime(tip === 2 ? 1100 : 1900, t + d * 0.45); f.frequency.exponentialRampToValueAtTime(tip === 2 ? 450 : 700, t + d); }
      gur(t + 0.05, d * 0.8, 'highpass', 2500, 4000, 0.7, 0.0028 * g, d * 0.35, -p, 1);
      if (tip === 2) akTon(akorAt(t), 86, 3, true).forEach((n, i) => cam(NOTE(n), t + 0.6 + i * 0.4, 0.006, 2, (i - 1) * 0.4, sfxG, false));
    },
    supurgeSeker(t, v) {   // uçuşta şeker (v 1..24) / yıldız (v 100+i): akora uyan, sırayla yükselen çan; yıldızda daha parlak cam çan
      const yildiz = Number.isFinite(v) && v >= 100, ak = akorAt(t), uyar = m => ak.mel.includes(m % 12) && (ak.ton.includes(m % 12) || [2, 9].includes(m % 12));
      if (t - c8SupT > 6 || !c8SupSon) c8SupSon = 76;
      let n = c8SupSon + 1; while (n <= 98 && !uyar(n)) n++;
      if (n > 98) { n = 81; while (n <= 98 && !uyar(n)) n++; if (n > 98) n = akorNotalari(t, 84, 96, true)[0]; }
      c8SupSon = n; c8SupT = t; const p = ((n % 5) - 2) * 0.15;
      oncelikli = true;
      try {
        zil(NOTE(n), t, yildiz ? 0.03 : 0.038, 1.4, p, sfxG);
        if (n + 12 <= 103) cam(NOTE(n + 12), t + 0.01, yildiz ? 0.016 : 0.009, yildiz ? 1.8 : 1.3, -p, sfxG, yildiz);
        c8Ksil(n - 12, t + 0.012, 0.015, p * 0.5, sfxG);
      } finally { oncelikli = false; }
    },
    supurgeInis(t) {   // meydana yumuşak iniş: aşağı süzülen glissando + yumuşak "pof" + sıcak akor + iki çan
      const g = []; for (let m = 96; m >= 50; m--) if ([2, 4, 5, 7, 9, 10, 0].includes(m % 12)) g.push(m);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.9) * 1.3, 0.02 - 0.007 * (i / g.length), 0.6 - 1.2 * i / g.length, 1.4, sfxG));
        kabar([38, 50, 57, 62, 65, 69], t + 1.1, 0.6, 0.8, 2.4, 0.014, sfxG, true);
        [81, 86].forEach((n, i) => zil(NOTE(n), t + 1.5 + i * 0.2, 0.022 - i * 0.004, 2, (i - 0.5) * 0.4, sfxG));
      } finally { oncelikli = false; }
      gur(t + 1.0, 0.45, 'lowpass', 900, 220, 0.8, 0.02, 0.02, 0, 1); ton(t + 1.0, 'sine', 130, 70, 0.28, 0.022, 0.01, 0);
    },
    cadiFinal(t) {   // şenlik başlar: dev kabak feneri yanar – sıcak akor kabarışı, oyuncak boru "ta-ta-taa", çan dizisi, iki ışık fişeği
      ezgiSus(t, t + 2.4);
      kabar([38, 50, 57, 62, 65, 69, 74], t + 0.05, 1.0, 0.8, 2.6, 0.02, sfxG, true);
      [[0.3, 74, 69, 0.12], [0.46, 74, 69, 0.12], [0.62, 81, 77, 0.7]].forEach(([d, a, b, u]) => { boru(a, t + d, u, 0.011, -0.3, sfxG); boru(b, t + d + 0.005, u, 0.008, 0.3, sfxG); });
      [81, 86, 89, 93].forEach((n, i) => cam(NOTE(n), t + 0.9 + i * 0.14, 0.012, 2, -0.4 + i * 0.27, sfxG, false));
      if (zaman() - s6FisekT > 1.5) { havaiFisek(t + 1.2, 0.85, -0.45, sfxG, sfxG); havaiFisek(t + 2.0, 0.75, 0.45, sfxG, sfxG); }
    },
    cadiDoruk(t) {   // doruk (28. sn): müzik doruğunu finalin saatine zaten oturtur – burada yalnız ışık sağanağı; doruk planlanmadıysa ön vuruş kabarışı
      const ak = akorAt(t + 0.1);
      if (progAd === 'cadiFinal' && c8DorukB < 0) {
        const uz = cl(sonrakiCubuk - t, 0.6, 3.2), ns = akTon(ak, 62, cl(Math.round(uz / 0.09), 8, 22), true);
        oncelikli = true;
        try { ns.forEach((n, i) => arp(n, t + uz * Math.pow(i / ns.length, 0.75), 0.012 + 0.011 * i / ns.length, -0.6 + 1.2 * i / ns.length, 1.4, sahneG)); } finally { oncelikli = false; }
        gur(t, uz + 0.5, 'bandpass', 400, 3600, 0.6, 0.007, uz * 0.85, 0, 2, sahneHam);
        return;
      }
      oncelikli = true;
      try { akTon(ak, 84, 9, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.15 + i * 0.08, 0.009, 1.8, i % 2 ? 0.45 : -0.45, sfxG, i < 2)); } finally { oncelikli = false; }
      gur(t + 0.1, 1.2, 'highpass', 6500, 9000, 0.7, 0.0035, 0.2, 0, 2);
    },
    cadiTamam(t) {   // şenlik biter: tek, uzun, sıcak çan (sabaha)
      zil(NOTE(74), t + 0.02, 0.022, 3, 0, sfxG, false); cam(NOTE(86), t, 0.012, 3.2, 0, sfxG, true);
    },
    yarasaPir(t, v) {   // yarasa pırpırı: yumuşak kanat çırpışı (genliği dalgalanan süzgeçli hava) + minik tatlı "cik"
      const p = v && Number.isFinite(v.pan) ? cl(v.pan, -0.8, 0.8) : (rnd() - 0.5) * 0.8, g = 1;   // v çağıranın türü (0/1), ses gücü değil
      for (let q = 0; q < 7; q++) gur(t + q * 0.055, 0.05, 'bandpass', 1100 + q * 40, 0, 1.4, 0.007 * g * (1 - q * 0.08), 0.008, cl(p + q * 0.04, -0.8, 0.8), 1);
      ton(t + 0.42, 'sine', 2600, 3200, 0.06, 0.0032 * g, 0.008, p, 2);
      ton(t + 0.5, 'sine', 2900, 2500, 0.05, 0.0026 * g, 0.008, p, 2);
    },
    kediMiyav(t, v) {   // kara kedinin "miyav"ı: ince, sevimli (yavru kedi gibi) – testere dişi + kayan iki formant ("mi-ya-v"), kısık
      if (!yerVar(3, t, t + 0.7, true)) return;
      const g = 1, p = v && Number.isFinite(v.pan) ? cl(v.pan, -0.7, 0.7) : 0.2, dur = v === 0 ? 0.42 : 0.5, f0 = (v === 0 ? 680 : 620) + rnd() * 60;   // v 0: kısa, merakla "mi-yav?" · diğer: neşeli
      const o = ac.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(f0 * 0.9, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.25, t + 0.16); o.frequency.exponentialRampToValueAtTime(f0 * 0.82, t + dur);
      const amp = ac.createGain(); amp.gain.value = 0.0001; amp.gain.setValueAtTime(0.0001, t); amp.gain.exponentialRampToValueAtTime(0.018 * g, t + 0.05);
      amp.gain.setValueAtTime(0.018 * g, t + dur * 0.6); amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      amp.connect(panla(sfxG, p)); amp.connect(revSfx);
      for (const [a, b, c, q, gv] of [[350, 850, 450, 5, 1], [2300, 1400, 900, 7, 0.5]]) {
        const bp = suzgec('bandpass', a, q, null); bp.frequency.setValueAtTime(a, t); bp.frequency.linearRampToValueAtTime(b, t + 0.2); bp.frequency.linearRampToValueAtTime(c, t + dur);
        o.connect(bp); bp.connect(kazanc(gv * 3, amp));
      }
      const lf = ac.createOscillator(); lf.frequency.value = 6; lf.connect(kazanc(14, o.detune)); lf.start(t); lf.stop(t + dur + 0.05);
      o.start(t); o.stop(t + dur + 0.05);
    },
    baykusHu(t, v) {   // uykulu baykuş: iki yumuşak, sıcak "hu-huu" (sinüs + hafif nefes), uzaktan – korkutucu değil
      const p = v && Number.isFinite(v.pan) ? cl(v.pan, -0.7, 0.7) : -0.25, g = Number.isFinite(v) ? cl(v, 0.3, 1) : 1;
      [[0, 0.22, 470], [0.34, 0.46, 440]].forEach(([d, u, f]) => {
        const ts = t + d;
        if (!yerVar(2, ts, ts + u + 0.2, true)) return;
        const o = ac.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.04, ts); o.frequency.exponentialRampToValueAtTime(f, ts + 0.06); o.frequency.exponentialRampToValueAtTime(f * 0.93, ts + u);
        const gg = ac.createGain(); gg.gain.value = 0.0001; gg.gain.setValueAtTime(0.0001, ts); gg.gain.exponentialRampToValueAtTime(0.02 * g, ts + 0.06);
        gg.gain.setValueAtTime(0.02 * g, ts + u * 0.6); gg.gain.exponentialRampToValueAtTime(0.0001, ts + u + 0.05);
        o.connect(gg); gg.connect(panla(sfxG, p)); gg.connect(revSfxCok); o.start(ts); o.stop(ts + u + 0.1);
        osc('triangle', f * 2, ts, ts + u, kazanc(0.05, gg));
        gur(ts, u, 'bandpass', f * 2, 0, 2, 0.0025 * g, 0.05, p, 1);
      });
    },
    // ── Bölüm 6 (Şenlik Kalesi): hepsi akora uyar, kısa ve yumuşak ──
    bolum6Basla(t) {   // rüya açılır: sıcak G akoru, aşağı süzülen arp, müzik kutusunda Feza'nın üç–iki–biri
      kabar([43, 55, 62, 67, 71, 74], t + 0.1, 1.1, 0.8, 2.8, 0.022, sahneG, true);
      [91, 86, 83, 79, 74, 71, 67].forEach((n, i) => arp(n, t + 0.2 + i * 0.13, 0.026 - i * 0.002, 0.55 - i * 0.18, 2, sahneG));
      [[71, 1.3], [69, 1.7], [67, 2.1]].forEach(([n, u], i) => zil(NOTE(n + 12), t + u, 0.034 - i * 0.004, 2.2, -0.2 + i * 0.2, sahneG));
    },
    senlikFener(t, e) {   // fener yanar: sıcak çan (fener sırasıyla yükselir) + diziye yayılan minik ışık dalgası
      const i = cl(e && Number.isFinite(e.n) ? e.n : Math.max(s6Fener, +v6Al('fener') || 0), 1, 24), top = v6Al('fenerTop') > 0 ? v6Al('fenerTop') : 12;
      const c = akorNotalari(t, 74, 98, true).filter(m => [7, 9, 11, 2, 4].includes(m % 12));
      const ns = c.length ? c : akorNotalari(t, 74, 98, true);
      const k = Math.min(ns.length - 1, Math.floor((i - 1) / Math.max(1, top) * ns.length)), n = ns[k];
      let p = i % 2 ? 0.25 : -0.25;
      if (e && Number.isFinite(e.pan)) p = cl(e.pan, -0.6, 0.6);
      oncelikli = true;
      try {
        tus(n, t, 0.07, 1.8, p, true, sfxG);
        zil(NOTE(n + 12), t + 0.006, 0.024, 1.6, -p, sfxG);
        zil(NOTE(n - 12), t + 0.012, 0.018, 2.4, p * 0.5, sfxG, false);   // sıcak gövde
        for (let j = 1; j <= 3; j++) { const m = ns[Math.min(ns.length - 1, k + j)] + 12; if (m < 104) cam(NOTE(m), t + 0.16 + j * 0.09, 0.008 - j * 0.0012, 1.1, cl(p + j * 0.18 * (p < 0 ? 1 : -1), -0.7, 0.7), sfxG, false); }
        if (i >= top) kabar([43, 55, 62, 67, 71], t + 0.3, 0.6, 0.6, 2.2, 0.014, sfxG, true);
        // "kasaba uyanıyor": fenerden sonra kasabadan minik bir cevap (sırayla: uzak kule çanı · pencere çanları · kaval 3-2-1 · toynak + tef)
        const ak = akorAt(t + 0.6), q = -p * 0.8, tc = t + 0.62;
        if (i % 4 === 1) { const ns2 = akTon(ak, 62, 3, true); zil(NOTE(ns2[2]), tc, 0.017, 2.6, q, sfxG); zil(NOTE(ns2[0]), tc + 0.34, 0.015, 2.8, q * 0.6, sfxG, false); }
        else if (i % 4 === 2) akTon(ak, 79, 4, true).forEach((n2, j) => ksilofon(n2, tc + j * 0.085, 0.017 - j * 0.002, cl(q + j * 0.12, -0.7, 0.7), 'sedef', sfxG));
        else if (i % 4 === 3) [[0, 2], [0.2, 1], [0.4, 0]].forEach(([d, j]) => { const ns2 = akTon(ak, 74, 3, true); flut(ns2[j] + 12, tc + d, d < 0.4 ? 0.18 : 0.5, 0.017, q, sfxG, false); });
        else { toynak(tc, 1, q, sfxG); tef(tc + 0.3, 0, 0.7, q, sfxG); tef(tc + 0.42, 0, 0.5, -q, sfxG); }
      } finally { oncelikli = false; }
      gur(t, 0.45, 'highpass', 5000, 8000, 0.7, 0.005, 0.08, p, 2);
      // yeni bir müzik katmanı açıldıysa bir sonraki ölçü onu kısa bir süsle tanıtır (kaleCubuk)
      const as = s6AsamaBul(cl(i / Math.max(1, top), 0, 1));
      if (as > s6Asama) { s6Asama = as; s6Tanit = as; }
    },
    sovalye(t, e) {   // tahta oyuncak şövalye selam verir: tık-tık + minik "ta-ta-taa" fanfarı (uzak, yumuşak)
      const p = e && Number.isFinite(e.pan) ? cl(e.pan, -0.6, 0.6) : 0.15, ak = akorAt(t);
      ksilofon(74, t, 0.045, p, 'ahsap'); ksilofon(79, t + 0.1, 0.032, p, 'ahsap');
      const a = melTonu(ak, 74), b = melTonu(ak, 79);
      boru(a, t + 0.3, 0.1, 0.012, p); boru(a, t + 0.45, 0.1, 0.011, p); boru(b, t + 0.6, 0.5, 0.014, p);
      tus(b + 12, t + 0.6, 0.016, 1.4, -p, true, sfxG);
    },
    halkaNota(t, e) {   // halka kapıldı: akora uyan yükselen çan (kaçırılan halkalar da dizinin sırasını bozmaz)
      const ak = akorAt(t), uyar = m => [7, 9, 11, 2, 4].includes(m % 12) && (ak.mel.includes(m % 12) || ak.ton.includes(m % 12));
      if (t - s6HalkaT > 8 || !s6HalkaSon) s6HalkaSon = 74;
      let n = s6HalkaSon + 1; while (n <= 98 && !uyar(n)) n++;
      if (n > 98) { n = 86; while (n <= 98 && !uyar(n)) n++; }
      s6HalkaSon = n; s6HalkaT = t;
      const son = e && Number.isFinite(e.n) && e.n >= 8, p = ((n % 5) - 2) * 0.15;
      oncelikli = true;
      try {
        zil(NOTE(n), t, 0.05, 1.6, p, sfxG);
        cam(NOTE(n + 12), t + 0.01, 0.013, 1.4, -p, sfxG, false);
        arp(n - 12, t + 0.015, 0.024, p * 0.5, 1.4, sfxG);
        if (son) akorNotalari(t, n + 1, n + 14, true).slice(0, 3).forEach((m, j) => zil(NOTE(m), t + 0.2 + j * 0.11, 0.022 - j * 0.003, 2.2, (j - 1) * 0.4, sfxG));
      } finally { oncelikli = false; }
      gur(t, 0.35, 'highpass', 6000, 9000, 0.7, 0.004, 0.03, p, 2);
    },
    halkaBasla(t) {   // midilliye binilir: yukarı süzülen arp + yumuşak esinti
      akTon(akorAt(t), 62, 8, true).forEach((n, i) => arp(n, t + i * 0.08, 0.022, -0.5 + i * 0.14, 1.4, sfxG));
      gur(t, 1.2, 'bandpass', 500, 1600, 0.6, 0.008, 0.35, 0, 1);
    },
    halkaBitti(t) {   // sekiz halka tamam: çan dizisi + sıcak akor
      [79, 83, 86, 91].forEach((n, i) => zil(NOTE(n), t + i * 0.13, 0.034 - i * 0.003, 2.2, -0.4 + i * 0.27, sfxG));
      kabar([43, 55, 62, 67, 71, 74], t + 0.35, 0.7, 0.6, 2.2, 0.016, sfxG, true);
    },
    midilli(t, e) {   // midilli uyanır: tatlı çelesta motifi (yukarı), yıldız tozu, iki minik toynak
      const ns = akTon(akorAt(t), 79, 4), p = e && Number.isFinite(e.pan) ? cl(e.pan, -0.6, 0.6) : -0.15;
      oncelikli = true;
      try {
        ns.forEach((n, i) => { tus(n, t + i * 0.11, 0.04 - i * 0.003, 1.5, p + i * 0.1, true, sfxG); if (i === 3) zil(NOTE(n + 12), t + i * 0.11 + 0.01, 0.02, 1.8, -p, sfxG); });
        akTon(akorAt(t), 91, 5, true).reverse().forEach((n, i) => cam(NOTE(n), t + 0.55 + i * 0.07, 0.008, 1.1, cl(p + 0.3 - i * 0.15, -0.7, 0.7), sfxG, false));
      } finally { oncelikli = false; }
      toynak(t + 0.75, 1.1, p, sfxG);
    },
    midilliZipla(t) {   // midilli Feza'yı yukarı sıçratır: yumuşak yükselen "hop" + çan
      const n = akorNotalari(t, 74, 86, true)[0];
      ton(t, 'sine', 260, 560, 0.24, 0.026, 0.012, 0, 1);
      zil(NOTE(n + 12), t + 0.08, 0.026, 1.4, 0.1, sfxG);
      cam(NOTE(n + 19 > 103 ? n + 7 : n + 19), t + 0.16, 0.008, 1.2, -0.2, sfxG, false);
    },
    kopruIndi(t) {   // kale köprüsü ışıkla iner: yukarı büyülü arp glissandosu, inen çan ışıltısı, sıcak akor
      const g = []; for (let m = 55; m <= 93; m++) if ([7, 9, 11, 0, 2, 4, 5].includes(m % 12)) g.push(m);
      g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.85) * 1.9, 0.016 + 0.01 * (i / g.length), -0.6 + 1.2 * i / g.length, 1.6, sfxG));
      [98, 95, 91, 86, 83, 79].forEach((n, i) => cam(NOTE(n), t + 2.1 + i * 0.12, 0.011, 1.8, 0.5 - i * 0.2, sfxG, i > 2));
      kabar([41, 53, 60, 65, 69], t + 0.1, 1.6, 0.3, 1.2, 0.012, sfxG, false);   // F → G: ♭VII'den eve
      kabar([43, 55, 62, 67, 71, 74], t + 2, 0.8, 0.8, 2.4, 0.018, sfxG, true);
      gur(t, 2.2, 'bandpass', 600, 4000, 0.7, 0.006, 1.6, 0, 2);
    },
    senlikFinal(t) {   // şenlik başlar: büyük sıcak akor, yükselen çanlar, iki ışık fişeği
      ezgiSus(t, t + 2.6);
      kabar([43, 55, 62, 67, 71, 74], t + 0.05, 1.4, 0.8, 3, 0.024, sfxG, true);
      [79, 83, 86, 91, 95].forEach((n, i) => cam(NOTE(n), t + 0.35 + i * 0.16, 0.015, 2.2, -0.4 + i * 0.2, sfxG, false));
      if (zaman() - s6FisekT > 1.5) { havaiFisek(t + 1.2, 1, -0.45, sfxG, sfxG); havaiFisek(t + 2.1, 0.9, 0.45, sfxG, sfxG); }
      // şenlik açılışı: uzak oyuncak boru fanfarı (ta-ta-taa) ve kasabanın çan kulesi
      [[0.5, 67, 0.12], [0.66, 67, 0.12], [0.82, 74, 0.7]].forEach(([d, n, u], j) => { boru(n, t + d, u, 0.011, -0.3, sfxG); boru(n - 5 + (j === 2 ? 2 : 0), t + d + 0.005, u, 0.008, 0.3, sfxG); });
      canKulesi(t + 1.6, AK.SG, 6, 0.016, 0.4, 0.24);
    },
    // büyük final koşusu başladı: şimdiden bir sonraki ölçü başına kadar yükselen arp kaskadı + hızlanan toynaklar + esinti
    halkaHiz(t) {
      const ak = akorAt(t), uz = cl(sonrakiCubuk - t, 0.6, 3.2), ns = akTon(ak, 55, cl(Math.round(uz / 0.1), 8, 24), true);
      ns.forEach((n, i) => arp(n, t + uz * Math.pow(i / ns.length, 0.8), 0.014 + 0.012 * i / ns.length, -0.6 + 1.2 * i / ns.length, 1.3, sfxG));
      for (let i = 0, x = 0; x < uz - 0.05; i++) { toynakTek(t + x, 0.5 + 0.5 * x / uz, i % 2 ? 0.2 : -0.2); x += Math.max(0.1, 0.3 - i * 0.025); }
      gur(t, uz + 0.4, 'bandpass', 500, 2400, 0.6, 0.007, uz * 0.8, 0, 1);
      zil(NOTE(akTon(ak, 86, 1, true)[0]), t + uz, 0.024, 2, 0, sfxG);
    },
    // final sıçrayışı: büyük büyülü glissando (akordan, iki buçuk oktav) + tepede tutulmuş parlak akor; müzik bir an nefesini tutar
    halkaFinalSicrama(t) {
      const ak = akorAt(t), g = akTon(ak, 55, 18, true);
      oncelikli = true;
      try {
        g.forEach((n, i) => arp(n, t + Math.pow(i / g.length, 0.85) * 1.0, 0.016 + 0.012 * i / g.length, -0.7 + 1.4 * i / g.length, 1.8, sfxG));
        kabar([ak.bas, ak.bas + 12].concat(ak.pad.map(n => n + 12)), t + 0.2, 0.9, 1.6, 3.2, 0.022, sfxG, true);
        akTon(ak, 88, 4, true).forEach((n, i) => sopranoCan(n, t + 1.0 + i * 0.16, 0.013 - i * 0.002, (i - 1.5) * 0.3, sfxG));
        akTon(ak, 84, 7, true).reverse().forEach((n, i) => cam(NOTE(n), t + 1.9 + i * 0.16, 0.009, 1.8, 0.5 - i * 0.15, sfxG, i < 2));
      } finally { oncelikli = false; }
      gur(t, 1.4, 'bandpass', 600, 4200, 0.7, 0.008, 1.0, 0, 2);
    },
    // doruk ön vuruşu: olay anından bir sonraki ölçü başına kadar kabaran ışık; büyük akoru doruğun ilk ölçüsü çalar (senlikFinalCubuk)
    senlikDoruk(t) {
      const ak = akorAt(t), uz = cl(sonrakiCubuk - t, 0.6, 3.2), ns = akTon(ak, 62, cl(Math.round(uz / 0.09), 8, 22), true);
      oncelikli = true;
      try { ns.forEach((n, i) => arp(n, t + uz * Math.pow(i / ns.length, 0.75), 0.013 + 0.012 * i / ns.length, -0.6 + 1.2 * i / ns.length, 1.4, sahneG)); } finally { oncelikli = false; }
      gur(t, uz + 0.5, 'bandpass', 400, 3600, 0.6, 0.008, uz * 0.85, 0, 2, sahneHam);
    },
    // dünyadaki havai fişek (senlik.js 'fisek' {tip, x, y}): türe göre yumuşak ses; hepsi o anki akordan, patlama yok
    fisek(t, e) {
      s6FisekT = t; s6FisekSay++;
      const tip = String(e && e.tip != null ? e.tip : '').toLowerCase();
      let p = 0;
      if (e && Number.isFinite(e.pan)) p = e.pan;
      else if (e && Number.isFinite(e.x) && camKonum()) { const c = camKonum(); p = (e.x - c.x - c.w / 2) / (c.w / 2); }
      p = cl(p * 0.7, -0.7, 0.7);
      const tur = /yagmur|yağmur|altin|altın|sogut|söğüt|salkim|salkım|willow|serpme|duş|dus/.test(tip) ? 'altin'
        : /piril|pırıl|kivilcim|kıvılcım|yildiz|yıldız|serp|cicek|çiçek|kalp|star|isilti|ışıltı/.test(tip) ? 'piril'
        : /fiy|roket|yuksel|yüksel|spiral|kuyruk|uc|uç|ok\b/.test(tip) ? 'fiyuu'
        : /puf|püf|top|daire|halka|kure|küre|peony|buyuk|büyük|dev/.test(tip) ? 'puf'
        : ['puf', 'piril', 'fiyuu', 'altin'][(tip.length ? tip.charCodeAt(0) + tip.length : s6FisekSay) % 4];
      const ak = akorAt(t + 0.3), yuk = e && Number.isFinite(e.y) && camKonum() ? cl(1 - (e.y - camKonum().y) / (camKonum().h * 0.75), 0, 1) : 0.5;
      const ns = akTon(ak, 79 + Math.round(yuk * 5), 8, true), sik = t - s6FisekGur < 0.35;
      oncelikli = true;
      try {
        if (tur === 'fiyuu') {   // uzaktan yükselen incecik "fiyuu" → tepede iki üç çan
          ton(t, 'sine', 560 + rnd() * 80, 1300 + rnd() * 200, 0.6, 0.003, 0.36, p, 1, sahneG);
          if (!sik) gur(t, 0.6, 'bandpass', 1400, 5200, 1.2, 0.0026, 0.45, p, 1, sahneHam);
          for (let i = 0; i < 3; i++) cam(NOTE(ns[(i * 3 + 2) % ns.length]), t + 0.62 + i * 0.07, 0.009 - i * 0.0015, 1.4, cl(p + (i - 1) * 0.2, -0.8, 0.8), sahneG, i === 0);
        } else if (tur === 'puf') {   // yumuşak "püf" + akor çiçeği (yuvarlanan akor)
          if (!sik) gur(t, 0.45, 'lowpass', 800, 220, 0.7, 0.009, 0.025, p, 1, sahneHam);
          ak.pad.slice(1).forEach((n, i) => tus(n + 12, t + 0.03 + i * 0.03, 0.012 - i * 0.0012, 1.5, cl(p + (i - 2) * 0.15, -0.8, 0.8), true, sahneG));
          zil(NOTE(ns[4]), t + 0.05, 0.012, 1.8, -p, sahneG, false);
        } else if (tur === 'piril') {   // pırıl pırıl çan serpintisi
          for (let i = 0; i < 9; i++) cam(NOTE(ns[(8 - i + (rnd() * 3 | 0)) % ns.length] + (i < 3 ? 12 : 0)), t + i * 0.06 + rnd() * 0.04, 0.0085 * (1 - i * 0.06), 1.1 + rnd() * 0.5, cl(p + (rnd() - 0.5) * 0.7, -0.85, 0.85), sahneG, i < 2);
          if (!sik) gur(t + 0.05, 0.7, 'highpass', 7000, 9000, 0.7, 0.0026, 0.04, p, 2, sahneHam);
        } else {   // altın yağmur: yavaşça inen çanlar + uzun, yumuşak hışırtı
          for (let i = 0; i < 7; i++) cam(NOTE(ns[7 - i]), t + 0.1 + i * 0.2 + rnd() * 0.05, 0.008 - i * 0.0006, 1.6, cl(p + (i % 2 ? 0.2 : -0.2), -0.8, 0.8), sahneG, i < 2);
          if (!sik) gur(t, 2.2, 'highpass', 6500, 3200, 0.6, 0.0034, 0.5, p, 2, sahneHam);
        }
      } finally { oncelikli = false; }
      if (!sik) s6FisekGur = t;
    },
    adim(t, v) {   // yüzeye göre: yosun (yumuşak), dal (tok tahta), nilüfer (sulu "pıt"), Pofuduk (pofuk)
      adimSol = !adimSol; const p = adimSol ? -0.12 : 0.12, y = adimYuzey;
      if (bolum5() && y !== 'pof') {
        // Bazalt: kısa, yuvarlak taş teması; müziğe rastgele perdeli ayak sesi karışmaz.
        gur(t, .065, 'bandpass', 820 + rnd() * 160, 460, 1.2, .018 * v, .005, p);
        ton(t, 'sine', adimSol ? 180 : 164, 118, .055, .016 * v, .004, p);
      } else if (y === 'dal') {
        ton(t, 'sine', (adimSol ? 230 : 205) * (0.97 + rnd() * 0.06), 150, 0.07, 0.05 * v, 0.003, p);
        gur(t, 0.045, 'bandpass', 1500 + rnd() * 400, 900, 2.5, 0.022 * v, 0.003, p);
        ton(t, 'triangle', 640 + rnd() * 60, 520, 0.035, 0.008 * v, 0.002, p);
        ksilofon(adimSol ? 62 : 59, t, 0.028 * v, p, 'ahsap');
      } else if (y === 'su') {
        gur(t, 0.13, 'bandpass', 1100 + rnd() * 300, 520, 2.2, 0.04 * v, 0.006, p);
        gur(t, 0.09, 'lowpass', 600, 250, 0.8, 0.03 * v, 0.006, p);
        const f = 520 + rnd() * 200; ton(t + 0.03, 'sine', f, f * 1.9, 0.07, 0.016 * v, 0.004, p, 1);   // minik kabarcık
        ksilofon(adimSol ? 74 : 76, t + 0.015, 0.025 * v, p, 'damlaMarimba');
      } else if (bolum3() && y !== 'dal') {   // Bölüm 3: bulut zemin – pamuk gibi, çok yumuşak "pof"
        gur(t, 0.11, 'lowpass', 520 + rnd() * 200, 240, 0.8, 0.045 * v, 0.012, p);
        ton(t, 'sine', adimSol ? 118 : 106, 80, 0.08, 0.022 * v, 0.008, p);
      } else if (y === 'pof') {
        gur(t, 0.12, 'lowpass', 520, 220, 1.2, 0.05 * v, 0.012, p);
        ton(t, 'sine', 160, 110, 0.12, 0.04 * v, 0.01, p);
        ksilofon(adimSol ? 57 : 55, t, 0.024 * v, p, 'ahsap');
      } else if (bolum7()) {   // kar: yumuşak "kırç" (iki minik süzgeçli tıs) + pamuk gibi alçak gövde
        gur(t, 0.09, 'bandpass', 1900 + rnd() * 500, 1200, 1.3, 0.014 * v, 0.008, p);
        gur(t + 0.035, 0.06, 'bandpass', 2600 + rnd() * 600, 0, 1.6, 0.008 * v, 0.004, p);
        gur(t, 0.1, 'lowpass', 520, 260, 0.8, 0.03 * v, 0.01, p);
        ton(t, 'sine', adimSol ? 118 : 106, 72, 0.08, 0.02 * v, 0.008, p);
      } else {
        gur(t, 0.085, 'lowpass', 700 + rnd() * 300, 380, 0.8, 0.05 * v, 0.006, p);
        gur(t + 0.004, 0.05, 'bandpass', 2600 + rnd() * 900, 0, 1.4, 0.006 * v, 0.004, p);
        ton(t, 'sine', adimSol ? 125 : 112, 70, 0.07, 0.035 * v, 0.004, p);
      }
    },
    zipla(t) {
      // Tok, sıcak, yaylanan bas gövde (kulak tırmalamayan, pamuksu itiş)
      ton(t, 'sine', 165, 82, 0.16, 0.07, 0.006, 0);
      ton(t, 'triangle', 220, 110, 0.12, 0.022, 0.008, 0);
      gur(t, 0.22, 'bandpass', 480, 1800, 1.2, 0.045, 0.04, 0, 1);
      // O anki akordan yumuşacık bir müzik kutusu zili + hafif çelesta + tok ahşap vuruş
      const n = akorNotalari(t, 81, 91, true), nota = n[Math.floor(n.length / 2)] || 86;
      zil(NOTE(nota), t + 0.015, 0.038, 1.0, 0, sfxG, false);
      tus(nota, t + 0.018, 0.018, 0.9, -0.15, true, sfxG);
      ksilofon(nota - 12, t + 0.012, 0.044, 0, 'ahsap');
    },
    cift(t) {
      // Pırıl havalandırır: yukarı süzülen sıcak ton + peri kanadı hışırtısı + sedef ksilofon ışıltısı
      ton(t, 'sine', 180, 360, 0.26, 0.065, 0.01, 0, 1);
      gur(t, 0.36, 'bandpass', 750, 3000, 1.1, 0.045, 0.06, 0, 1);
      // Yükselen uyumlu çan ve çelesta sıçrayışı
      const n = akorNotalari(t, 81, 98);
      const sec4 = n.slice(0, 4);
      sec4.forEach((m, i) => {
        tus(m, t + i * 0.045, 0.032 - i * 0.002, 1.2, (i - 1.5) * 0.2, true, sfxG);
        zil(NOTE(m + 12), t + i * 0.045 + 0.006, 0.018, 1.0, (1.5 - i) * 0.15, sfxG, false);
      });
      if (sec4.length) ksilofon(sec4[0], t + 0.015, 0.038, 0, 'sedef');
      for (let i = 0; i < 4; i++) ton(t + 0.06 + i * 0.07, 'sine', 3400 + i * 400, 0, 0.1, 0.004, 0.003, rnd() - 0.5, 2);
    },
    inis(t, v) {
      if (bolum7() && adimYuzey === 'yosun' && v >= 0.2) gur(t, 0.24, 'lowpass', 1600, 420, 0.8, 0.022 * v, 0.006, 0);   // karda yumuşak "püf"
      if (adimYuzey === 'su' && v >= 0.15) {
        gur(t, 0.3, 'bandpass', 1400, 450, 1.8, 0.07 * v, 0.008, 0, 1);
        ksilofon(74, t + 0.02, 0.04 * v, 0, 'damlaMarimba');
        for (let i = 0; i < 3; i++) { const f = 450 + rnd() * 500; ton(t + 0.04 + i * 0.05, 'sine', f, f * 1.8, 0.07, 0.014, 0.004, rnd() - 0.5, 1); }
      } else if (adimYuzey === 'dal' && v >= 0.15) {
        ton(t, 'sine', 190, 120, 0.12, 0.07 * v, 0.003, 0);
        gur(t, 0.06, 'bandpass', 1300, 800, 2, 0.03 * v, 0.003, 0);
        ksilofon(57, t, 0.045 * v, 0, 'ahsap');
      }
      if (v < 0.2) return;
      gur(t, 0.18, 'lowpass', 420, 140, 0.9, 0.09 * v, 0.006, 0);
      ton(t, 'sine', 96, 46, 0.2, 0.12 * v, 0.005, 0);
      gur(t + 0.01, 0.12, 'bandpass', 1300, 900, 1.2, 0.012 * v, 0.01, 0);
    },
    boing(t, v) {
      const k = v > 1 ? 0.62 : 1, d = v > 1 ? 0.75 : 0.5;
      const o = ton(t, 'sine', 150 * k, 0, d, 0.11, 0.008, 0, 1), o2 = ton(t, 'triangle', 150 * k, 0, d * 0.8, 0.045, 0.008, 0);
      for (const x of [o, o2]) if (x) {
        x.frequency.setValueAtTime(150 * k, t); x.frequency.exponentialRampToValueAtTime(470 * k, t + 0.09);
        x.frequency.setTargetAtTime(380 * k, t + 0.09, 0.12);
        const lfo = ac.createOscillator(); lfo.frequency.value = 13; const lg = ac.createGain();
        lg.gain.setValueAtTime(60 * k, t + 0.05); lg.gain.exponentialRampToValueAtTime(1, t + d);
        lfo.connect(lg); lg.connect(x.frequency); lfo.start(t); lfo.stop(t + d + 0.05);
      }
      gur(t, 0.16, 'lowpass', 750, 260, 1.4, 0.06, 0.008, 0);
      const n = akorNotalari(t, 79, 93, true);
      const bNota = n[Math.min(n.length - 1, 2)] || 86;
      tus(bNota, t + 0.08, 0.032, 1.4, 0.2, true, sfxG);
      ksilofon(bNota, t + 0.06, 0.042, 0.2, 'sedef');
    },
    puf(t) {
      // Pofuduk üstüne zıplama: pamuksu, tok ve yumuşacık marshmallow ezilmesi + sıcak ahşap ksilofon
      gur(t, 0.38, 'lowpass', 580, 160, 0.9, 0.12, 0.014, 0, 1);
      ton(t, 'sine', 110, 52, 0.26, 0.11, 0.008, 0);
      ton(t, 'triangle', 170, 85, 0.15, 0.03, 0.008, 0);
      const n = akorNotalari(t, 84, 96);
      tus(n[0], t + 0.05, 0.036, 1.3, 0.15, true, sfxG);
      zil(NOTE(n[0] + 12), t + 0.055, 0.02, 1.1, -0.15, sfxG, false);
      ksilofon(n[0] - 12, t + 0.03, 0.038, 0, 'ahsap');
    },
    hapsuAl(t) {   // "ha… ha…" (hapşırmadan önce nefes çeker)
      gur(t, 0.4, 'bandpass', 900, 1700, 2.5, 0.03, 0.32, 0);
      agiz(t + 0.03, 560, 780, 0.36, 0.026, [800, 1250], null, 0.3);
    },
    hapsu(t) {     // "(hap)ŞU!" – minik, sevimli; pofuduk.js hapşırdığı karede çağırır
      agiz(t, 700, 760, 0.07, 0.03, [800, 1250], null, 0.01);
      const t2 = t + 0.06;
      gur(t2, 0.3, 'highpass', 3200, 2600, 0.7, 0.11, 0.006, 0, 1);
      agiz(t2, 820, 430, 0.26, 0.05, [380, 820], null, 0.01);
      const n = akorNotalari(t, 88, 100); zil(NOTE(n[0]), t2 + 0.05, 0.016, 0.8, 0.3, sfxG, false);
    },
    parilti(t) {   // küçük ışıltı (sahne/arayüz)
      const n = akorNotalari(t, 86, 100); [0, 2, 4].forEach((k, i) => zil(NOTE(n[Math.min(n.length - 1, k)]), t + i * 0.07, 0.03, 1.4, (i - 1) * 0.4, sfxG));
      gur(t, 0.6, 'highpass', 6000, 9000, 0.7, 0.008, 0.1, 0, 2);
    },
    nefesAl(t) {   // Pırıl nefes çeker: hafif, yükselen hava sesi
      gur(t, 0.55, 'bandpass', 350, 1100, 1.8, 0.03, 0.45, 0, 1);
    },
    uyanma(t) {
      const n = akorNotalari(t, 79, 96); [0, 1, 2, 3].forEach(i => zil(NOTE(n[Math.min(n.length - 1, i * 2)]), t + i * 0.12, 0.035, 1.8, (i - 1.5) * 0.3, sfxG));
    },
    tohum(t) {
      const n = akorNotalari(t, 86, 100);
      arp(n[0] - 12, t, 0.045, -0.2, 2.2, sfxG);
      zil(NOTE(n[0]), t + 0.02, 0.075, 2.8, -0.2, sfxG); zil(NOTE(n[Math.min(n.length - 1, 3)]), t + 0.13, 0.068, 3, 0.2, sfxG);
      ksilofon(n[0], t + 0.015, 0.045, -0.2, 'sedef');
      for (let i = 0; i < 9; i++) zil(NOTE(sec(n) + 12), t + 0.2 + i * 0.045 + rnd() * 0.02, 0.01, 0.6, rnd() - 0.5, sfxG, false);
      gur(t, 0.9, 'highpass', 5000, 8000, 0.7, 0.012, 0.2, 0, 2);
    },
    nefes(t) {     // ışık nefesi: büyülü, yükselen "fuuuş" + ışıltı
      gur(t, 1.3, 'bandpass', 380, 3000, 1.6, 0.08, 0.25, 0, 2);
      gur(t + 0.1, 1.3, 'highpass', 3000, 7000, 0.7, 0.014, 0.6, 0.2, 2);
      const son = pirilAlinti(t + 0.18, 0.14, 0.05, sfxG);   // Pırıl'ın motifi ışıkla birlikte üflenir
      const n = akorNotalari(son, 90, 100); n.slice(0, 4).forEach((m, i) => zil(NOTE(m), son - 0.1 + i * 0.07, 0.012, 1.6, (i % 2 ? 0.5 : -0.5), sfxG, false));
    },
    nilufer(t) {
      const n = akorNotalari(t, 62, 79, true);
      for (let i = 0; i < 5; i++) {
        const m = n[Math.min(n.length - 1, i * 2)], f = NOTE(m), ti = t + i * 0.24, p = -0.6 + i * 0.3;
        const o = ton(ti, 'sine', f * 0.75, 0, 0.7, 0.06, 0.01, p, 2); if (o) { o.frequency.setValueAtTime(f * 0.75, ti); o.frequency.exponentialRampToValueAtTime(f, ti + 0.06); }
        zil(f * 2, ti + 0.02, 0.018, 1.6, p, sfxG);
        gur(ti, 0.35, 'bandpass', 2800, 1800, 3, 0.008, 0.05, p, 1);
      }
    },
    su(t) {
      gur(t, 0.55, 'lowpass', 2600, 450, 0.7, 0.09, 0.012, 0, 1);
      gur(t, 0.25, 'bandpass', 1300, 800, 1.2, 0.04, 0.01, 0);
      for (let i = 0; i < 5; i++) { const ti = t + 0.06 + rnd() * 0.35, f = 900 + rnd() * 900; ton(ti, 'sine', f, f * 1.6, 0.06, 0.02, 0.003, rnd() - 0.5, 1); }
    },
    kurtar(t) {
      gur(t, 0.8, 'bandpass', 380, 3200, 1.4, 0.06, 0.45, 0, 2);
      pirilAlinti(t + 0.3, 0.11, 0.042, sfxG);   // "tuttum seni": Pırıl'ın motifi, çabuk ve sıcak
    },
    cicek(t, v) {
      cicekSay++;
      const ust = 86 + Math.min(10, cicekSay);
      const n = akorNotalari(t, 74, ust);
      const sec5 = n.slice(Math.max(0, n.length - 7));
      // Sıcak kabarış çiçeği:
      kabar([sec5[0] - 12, sec5[1] - 12, (sec5[2] || sec5[0]) - 12], t, 0.2, 0.45, 1.8, 0.026, sfxG, true);
      sec5.forEach((m, i) => {
        tus(m, t + i * 0.08, 0.045 - i * 0.002, 2.6, -0.45 + i * 0.15, true, sfxG);
        zil(NOTE(m), t + i * 0.085, 0.042 + i * 0.002, 2.8, -0.45 + i * 0.15, sfxG);
      });
      if (sec5.length) ksilofon(sec5[0], t + 0.035, 0.042, -0.3, 'sedef');
      sec5.slice(-3).forEach((m, i) => arp(m - 12, t + 0.05 + i * 0.09, 0.032, 0.2));
      gur(t, 0.7, 'lowpass', 300, 1400, 0.9, 0.035, 0.25, 0, 1);
      zil(NOTE(sec5[sec5.length - 1] + 12), t + sec5.length * 0.085 + 0.1, 0.024, 3, 0.4, sfxG);
      if (bolum2()) {
        oncelikli = true;
        try {
          yPent(akorAt(t), 76, 100).forEach((m, i) => cam(NOTE(m), t + 0.12 + i * 0.07, 0.034, 2.4, -0.6 + i * 0.1, sfxG, i % 3 === 0));
        } finally { oncelikli = false; }
      }
    },
    // şarkı çiçekleri (sarki.js): v = {n: MIDI notası (D pentatonik), g: güç, x: pan}. Çelesta + çan + minik ışıltı; hep akorla uyumlu (pentatonik)
    sarki(t, v) {
      const n = (v && v.n || 78) + ky(), gc = v && v.g || 1, p = v && v.x || 0;
      oncelikli = true;
      try {
        tus(n, t, 0.085 * gc, 2.2, p, true, sfxG);
        zil(NOTE(n + 12), t + 0.004, 0.034 * gc, 1.7, -p * 0.6, sfxG);
        zil(NOTE(n + 24), t + 0.05, 0.011 * gc, 0.7, p * 0.5, sfxG, false);
      } finally { oncelikli = false; }
      gur(t, 0.35, 'highpass', 5200, 8000, 0.7, 0.004 * gc, 0.04, p, 2);
    },
    // yanlış değil, "yine deneyelim": notanın kendisi yumuşakça, ardından sakin bir nefes (ceza hissi yok)
    sarkiOlmadi(t, v) {
      const n = (v && v.n || 78) + ky();
      oncelikli = true;
      try { tus(n, t, 0.04, 1.1, 0, false, sfxG); } finally { oncelikli = false; }
      gur(t + 0.05, 0.5, 'lowpass', 900, 300, 0.8, 0.012, 0.15, 0, 1);
    },
    // doğru dizi: pentatonik yükselen çelesta dalgası (k=1: büyük kutlama, daha uzun ve parlak)
    sarkiBitti(t, v) {
      const buyuk = v && v.k, dizi = (buyuk ? [74, 78, 81, 86, 90, 93, 98] : [74, 78, 81, 86]).map(m => m + ky());
      oncelikli = true;
      try {
        dizi.forEach((m, i) => { tus(m, t + 0.12 + i * 0.1, 0.05 - i * 0.002, 2.4, (i - dizi.length / 2) * 0.18, true, sfxG); zil(NOTE(m + 12), t + 0.125 + i * 0.1, 0.02, 1.8, (dizi.length / 2 - i) * 0.15, sfxG); });
        if (buyuk) { const k = akorNotalari(t + 0.9, 79, 98); k.slice(0, 5).forEach((m, j) => zil(NOTE(m), t + 1.0 + j * 0.08, 0.026 - j * 0.003, 2.8, (j - 2) * 0.3, sfxG)); }
      } finally { oncelikli = false; }
      gur(t, 0.9, 'lowpass', 300, 1800, 0.9, 0.03, 0.3, 0, 1);
    },
    // şarkı etkinliği finali: kısa, neşeli çelesta/çan arpejli "zafer" fanfarı (D pentatonik; sert değil, ışıl ışıl)
    sarkiZafer(t, v) {
      const p = (v && v.x) || 0;
      oncelikli = true;
      try {
        const yuk = [74, 78, 81, 86, 90, 93, 98].map(m => m + ky());
        yuk.forEach((m, i) => { tus(m, t + 0.05 + i * 0.085, 0.06 - i * 0.003, 2.4, (i - 3) * 0.2, true, sfxG); zil(NOTE(m + 12), t + 0.055 + i * 0.085, 0.022, 1.8, (3 - i) * 0.15, sfxG); });
        [[86, 0], [90, 0.1], [93, 0.2], [98, 0.3]].forEach(([m0, d], i) => { const m = m0 + ky(); tus(m, t + 0.65 + d, 0.055, 2.6, (i - 1.5) * 0.25, true, sfxG); zil(NOTE(m + 12), t + 0.655 + d, 0.02, 1.6, 0, sfxG); });
        [62, 66, 69, 74].forEach((m, i) => tus(m + ky(), t + 0.65 + i * 0.01, 0.045, 3, p, false, sfxG));   // alttan sıcak D majör akoru
        for (let i = 0; i < 9; i++) zil(NOTE(sec([86, 90, 93, 98, 102]) + ky()), t + 1.05 + i * 0.1 + rnd() * 0.04, 0.012, 1, rnd() * 1.4 - 0.7, sfxG, false);
        const k = akorNotalari(t + 1.0, 79, 98); k.slice(0, 5).forEach((m, j) => zil(NOTE(m), t + 1.0 + j * 0.08, 0.024 - j * 0.003, 2.2, (j - 2) * 0.3, sfxG));
      } finally { oncelikli = false; }
      gur(t, 1.1, 'lowpass', 300, 2400, 0.9, 0.035, 0.35, 0, 2);
    },
    // ── Bölüm 2: yıldız efektleri (hepsi o anki akorun notalarından; A Lidyen ile uyumlu) ──
    // yıldız uyanışı: kristal çan akoru + derin şarkı kasesi rezonansı + hafif gece ışıltısı
    yildizUyan(t, v) {
      const ak = akorAt(t), N = yPent(ak, 81, 97), k0 = Math.floor(N.length / 3) + ((typeof v === 'number' ? v : 0) % 3), n0 = N[Math.min(N.length - 1, k0)], n1 = N[Math.min(N.length - 1, k0 + 2)];
      kase(NOTE(n0 - 24), t, 2.5, 0.045, 0, sfxG);
      ksilofon(n0, t + 0.01, 0.065, -0.15, 'cam');
      oncelikli = true;
      try {
        tus(n0, t, 0.05, 2.2, -0.15, true, sfxG);
        cam(NOTE(n0), t, 0.1, 2.8, -0.15, sfxG); cam(NOTE(n0 + 12), t + 0.006, 0.042, 2.2, 0.2, sfxG);
        cam(NOTE(n1), t + 0.07, 0.065, 2.6, 0.25, sfxG); cam(NOTE(n1 - 12), t + 0.07, 0.04, 2.4, -0.25, sfxG);
      } finally { oncelikli = false; }
      gur(t, 0.55, 'bandpass', 600, 4200, 1.3, 0.03, 0.3, 0, 2);
      gur(t + 0.05, 0.6, 'highpass', 5500, 9500, 0.7, 0.006, 0.25, 0, 2);
    },
    // yıldız göğe yükselir: yükselen ışıltı + masalsı harp arpeji (akor notalarıyla tırmanır)
    yildizYuksel(t) {
      const N = yPent(akorAt(t), 76, 103);
      const o = ton(t, 'sine', 160, 320, 1.6, 0.02, 0.3, 0, 1.5);
      oncelikli = true;
      try {
        for (let i = 0; i < 18; i++) {   // hafif yükselen şelale
          const m = N[Math.min(N.length - 1, Math.round(i * (N.length - 1) / 17))];
          cam(NOTE(m), t + 0.05 + i * 0.09, 0.015 + i * 0.0014, 1.3 + i * 0.07, -0.7 + i * 0.08, sfxG, i < 12 ? false : undefined);
          if (i % 3 === 0) arp(m - 12, t + 0.05 + i * 0.09, 0.022, -0.5 + i * 0.06, 1.8, sfxG);
        }
      } finally { oncelikli = false; }
      gur(t, 1.5, 'bandpass', 500, 6500, 1.2, 0.03, 0.9, 0, 2);
      for (let i = 0; i < 6; i++) ton(t + 0.4 + rnd() * 1.0, 'sine', 4200 + rnd() * 3000, 0, 0.12, 0.005, 0.003, rnd() - 0.5, 2);
    },
    // yıldız gökte yerleşir: kristal singing bowl "tınn" + sıcak çelesta ve geniş akor çiçeği
    yildizYerles(t, v) {
      const ak = akorAt(t), N = yPent(ak, 76, 100), i = yYerlesen++, n = N[Math.min(N.length - 1, i)];   // yerleşme sırası: her yıldız bir öncekinden yüksek
      const f = NOTE(n), son = yildizOrani() >= 0.999;
      yBekle.push(n); if (yBekle.length > 3) yBekle.shift();
      const gg = 1 + 0.4 * yildizOrani();   // gökyüzü doldukça ödül büyür
      kase(NOTE(n - 12), t, 3.2, 0.055 * gg, 0, sfxG);
      ksilofon(n, t + 0.015, 0.06 * gg, 0, 'sedef');
      oncelikli = true;
      try {
        tus(n, t, 0.065 * gg, 2.2, 0, true, sfxG);
        cam(f, t, 0.1 * gg, 3.8, 0, sfxG); cam(f * 2, t + 0.004, 0.03 * gg, 2.4, 0, sfxG, false);
        kabar([ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12, ak.pad[1] + 24], t, 0.15, 0.6, 2.8, 0.026 * gg, sfxG, true);   // geniş akor çiçeği
        cam(NOTE(ak.pad[1] + 24), t + 0.05, 0.02 * gg, 3, -0.85, sfxG, false); cam(NOTE(ak.pad[2] + 24), t + 0.12, 0.02 * gg, 3, 0.85, sfxG, false);
        [[0.15, 0.35, -0.5], [0.32, 0.2, 0.5], [0.52, 0.11, -0.3], [0.78, 0.06, 0.3]].forEach(([dt, g, p]) => cam(f, t + dt, 0.09 * g, 1.8, p, sfxG, false));
        if (son) N.slice(0, 7).forEach((m, k) => cam(NOTE(m + 12), t + 0.2 + k * 0.1, 0.03, 3, (k - 3) * 0.2, sfxG));
      } finally { oncelikli = false; }
      gur(t + 0.05, 0.9, 'bandpass', 1500, 700, 1.4, 0.008, 0.35, 0, 2);
    },
    // yıldız taşına basış: su damlası + sıcak bas pıtırtısı + akor notası (basamak basamak tırmanış)
    yildizTasi(t, v) {
      const ak = akorAt(t), N = yPent(ak, 69, 93), now = t;
      if (now - yTasT > 3 || yTasN >= 8) yTasN = 0;
      yTasT = now; const st = typeof v === 'number' ? v : yTasN, n = N[Math.min(N.length - 1, Math.floor(st * 1.2))]; yTasN = st + 1;
      const p = (yTasN % 2) ? -0.2 : 0.2;
      ton(t, 'sine', 160, 85, 0.16, 0.045, 0.01, p);
      damla(NOTE(n + 12), t, 0.075, p, sfxG);
      damla(NOTE(n + 19), t + 0.11, 0.025, -p, sfxG); damla(NOTE(n + 24), t + 0.2, 0.012, p, sfxG);
      ksilofon(n, t + 0.01, 0.055, p, 'damlaMarimba');
      oncelikli = true;
      try {
        arp(n, t + 0.01, 0.035, p, 1.8, sfxG);
        tus(n, t + 0.015, 0.055, 2.2, p, true, sfxG);
        cam(NOTE(n + 12), t + 0.02, 0.026, 1.8, -p, sfxG, false);
      } finally { oncelikli = false; }
      gur(t, 0.14, 'bandpass', 1500, 650, 2, 0.02, 0.004, p, 1);
    },
    // Bölüm 2 açılışı (OLAY 'bolum2Basla'): 0.6 sn karanlık → ışık tanecikleri Feza ve Pırıl'da toplanır (kısa ışık tozu) → ayaklarda sudan yükselen ışık
    bolum2Basla(t) {
      const ak = AK.YA, N = []; for (let m = 76; m <= 100; m++) if (ak.mel.includes(m % 12)) N.push(m);
      oncelikli = true;
      try {
        for (let i = 0; i < 12; i++) cam(NOTE(N[(i * 5) % N.length]), t + 0.6 + i * 0.13, 0.008 + i * 0.0012, 1.6, Math.sin(i * 1.7) * (0.9 - i * 0.07), sfxG, false);   // sağ-soldan merkeze toplanan ışık tozu
        tus(N[Math.min(N.length - 1, 5)], t + 2.2, 0.04, 2.8, -0.15, true, sfxG); tus(N[Math.min(N.length - 1, 8)], t + 2.38, 0.034, 2.8, 0.15, true, sfxG);   // yeniden toplanma: iki çelesta (p_y_giris ~2.4 sn)
        [57, 64, 69].forEach((m, i) => damla(NOTE(m), t + 3.0 + i * 0.22, 0.03, (i - 1) * 0.3, sfxG));   // ayaklarda sudan yükselen ışık
      } finally { oncelikli = false; }
      gur(t + 0.6, 2.2, 'bandpass', 500, 4500, 1.1, 0.015, 1.4, 0, 2);
    },
    // ── Yatak odası: AKŞAM ve SABAH küçük ses katmanları (hepsi çok hafif, sert değil) ──
    // yatağa girerken yorgan/kumaş hışırtısı: iki yumuşak, filtrelenmiş gürültü kabarması
    yatagaGir(t) { gur(t, 0.55, 'bandpass', 1500, 750, 0.8, 0.02, 0.18, -0.2, 1); gur(t + 0.5, 0.7, 'bandpass', 1100, 600, 0.8, 0.016, 0.25, 0.2, 1); },
    // başı yastığa koyma: yumuşak "pof"
    yastik(t) { ton(t, 'sine', 140, 75, 0.22, 0.07, 0.01, 0); gur(t, 0.2, 'lowpass', 420, 160, 0.9, 0.04, 0.012, 0, 1); },
    // gece lambası kısılırken: iki alçalan yumuşak çan + minik tık
    lambaKis(t) {
      oncelikli = true; try { cam(NOTE(88), t, 0.03, 2.2, 0.2, sfxG); cam(NOTE(81), t + 0.3, 0.024, 2.6, -0.2, sfxG); } finally { oncelikli = false; }
      ton(t, 'triangle', 1800, 900, 0.025, 0.01, 0.002, 0.3);
    },
    // uyku nefesi: iki yavaş, çok yumuşak, ritmik pad "ah…" (Feza uykuya dalarken ninni ağırlaşır)
    uykuNefes(t) { [0, 2.6].forEach((d, i) => kabar([50, 57, 62], t + d, 1.2, 0.2, 1.3, 0.016 - i * 0.004, sfxG, false)); gur(t, 1.6, 'lowpass', 500, 300, 0.7, 0.008, 0.8, 0, 1); gur(t + 2.6, 1.6, 'lowpass', 450, 280, 0.7, 0.006, 0.8, 0, 1); },
    // sabah kuşu (v = sıra: her seferinde farklı): 2–3 kısa yükselen/düşen sinüs ıslığı, uzaktan, yumuşak
    sabahKus(t, v) {
      const k = (typeof v === 'number' ? v : 0), n = 2 + (k % 2), p = k % 2 ? 0.55 : -0.55, f = 2500 + ((k * 337) % 900);
      for (let i = 0; i < n; i++) { const ti = t + i * (0.1 + 0.03 * (k % 3)), fi = f * (1 + 0.12 * ((i + k) % 3)); ton(ti, 'sine', fi, fi * (i % 2 ? 0.8 : 1.35), 0.08, 0.007, 0.01, p, 2); }
    },
    // Feza gerinirken: yumuşak yükselen üç nota + hafif hava
    gerinme(t) {
      oncelikli = true; try { [74, 78, 81].forEach((m, i) => tus(m + 12, t + i * 0.28, 0.03, 1.8, (i - 1) * 0.2, true, sfxG)); } finally { oncelikli = false; }
      gur(t, 1.0, 'bandpass', 500, 1200, 1.2, 0.012, 0.5, 0, 1);
    },
    // Feza esnerken (Büyük Pofuduk'un 'esneme'sinden ayrı): çok hafif nefes
    fezaEsne(t) { agiz(t, 230, 170, 1.0, 0.018, [750, 1150], [450, 800], 0.25); gur(t, 1.0, 'bandpass', 700, 450, 1.3, 0.008, 0.3, 0, 1); },
    // Pırıl göz kırpar: tek çelesta notası
    gozKirp(t) { oncelikli = true; try { tus(93, t, 0.04, 1.6, 0.2, true, sfxG); } finally { oncelikli = false; } },
    // ── Bölüm 4 "İnci Denizi" efektleri ──
    // Yunus vuruşu dash hamlesi: kadifemsi, pürüzsüz ve sihirli su kabarcığı ışıltısıyla süslenmiş yunus süzülüşü
    denizHamle(t, v) {
      const g = cl(typeof v === 'number' ? v : 1, 0.5, 1.5);
      // 1) Kadifemsi su altı basınç dalgası (sert darbe yerine yumuşak, dolgun yunus kuyruk süzülüşü):
      ton(t, 'sine', 135, 68, 0.38, 0.085 * g, 0.032, 0);
      ton(t, 'triangle', 95, 48, 0.24, 0.026 * g, 0.025, 0);
      gur(t, 0.38, 'lowpass', 460, 160, 0.9, 0.055 * g, 0.03, 0, 1.2);
      // 2) İpeksi ve akıcı hidrodinamik süzülme ("wwoooşşş"):
      gur(t + 0.02, 0.52, 'bandpass', 360, 1800, 1.1, 0.052 * g, 0.05, 0, 1.4);
      gur(t + 0.04, 0.42, 'lowpass', 950, 360, 0.8, 0.036 * g, 0.06, 0, 1.2);
      // Yunus rezonansı (yumuşak akustik dalga):
      const o = ton(t + 0.01, 'sine', 340, 220, 0.32, 0.026 * g, 0.03, 0, 1.4);
      if (o) {
        o.frequency.setValueAtTime(320, t + 0.01);
        o.frequency.exponentialRampToValueAtTime(540, t + 0.1);
        o.frequency.exponentialRampToValueAtTime(340, t + 0.32);
      }
      // 3) Sihirli su kabarcıkları kaskadı (pentatonik akora bağlı, berrak pıtırtılar):
      const ak = akorAt(t), nts = akTon(ak, 67, 5, true);
      const bubFreqs = [
        NOTE(nts[1] || 74),
        NOTE(nts[2] || 79),
        NOTE(nts[3] || 83),
        NOTE((nts[1] || 74) + 12),
        NOTE((nts[2] || 79) + 12),
        NOTE((nts[4] || 86) + 12),
      ];
      bubFreqs.forEach((f, i) => {
        const ti = t + 0.02 + i * 0.032 + (rnd() - 0.5) * 0.008;
        const p = (i % 2 === 0 ? -0.28 : 0.28) + (rnd() - 0.5) * 0.1;
        const bo = ton(ti, 'sine', f * 0.85, f * 1.45, 0.052, (0.02 - i * 0.0018) * g, 0.004, p, 1.2);
        if (bo) { bo.frequency.setValueAtTime(f * 0.85, ti); bo.frequency.exponentialRampToValueAtTime(f * 1.45, ti + 0.04); }
        if (i % 2 === 0) damla(f, ti + 0.005, 0.022 * g, p, sfxG);
      });
      gur(t + 0.03, 0.42, 'highpass', 4800, 8500, 0.75, 0.011 * g, 0.04, 0, 1.8);
      // 4) Masalsı arp & kristal çan ışıltısı:
      arp(nts[1] || 74, t + 0.035, 0.036 * g, 0.18, 1.6, sfxG);
      arp((nts[2] || 79) - 12, t + 0.07, 0.026 * g, -0.18, 1.8, sfxG);
      cam(NOTE((nts[3] || 83) + 12), t + 0.06, 0.02 * g, 2.0, 0.3, sfxG, false);
      cam(NOTE((nts[1] || 74) + 24), t + 0.12, 0.012 * g, 1.6, -0.3, sfxG, false);
    },
    // Işıklı su akıntılarına (suAkinti) giriş: berrak kristal su çağlaması, masalsı çan tınısı ve yumuşak su süzülmesi
    suAkinti(t, v) {
      const g = cl(typeof v === 'number' ? v : 1, 0.4, 1.4);
      // 1) Berrak kristal su çağlaması (sert rüzgâr/itme yerine akıcı, ipeksi su akışı):
      gur(t, 1.1, 'bandpass', 450, 1900, 1.2, 0.042 * g, 0.22, 0, 1.8);
      gur(t + 0.06, 0.9, 'lowpass', 1100, 480, 0.9, 0.032 * g, 0.18, 0, 1.4);
      // 2) Çağlayan kristal su damlacıkları:
      const ak = akorAt(t), nts = akTon(ak, 74, 6, true);
      const d1 = nts[0] || 74, d2 = nts[2] || 79, d3 = nts[4] || 83;
      damla(NOTE(d1), t + 0.04, 0.048 * g, -0.3, sfxG);
      damla(NOTE(d2), t + 0.13, 0.042 * g, 0.3, sfxG);
      damla(NOTE(d3), t + 0.23, 0.036 * g, -0.15, sfxG);
      damla(NOTE(d1 + 12), t + 0.34, 0.026 * g, 0.2, sfxG);
      // 3) Masalsı kristal çan ve çelesta tınısı (Lidyen ışıltısı):
      oncelikli = true;
      try {
        cam(NOTE(d1 + 12), t + 0.06, 0.046 * g, 2.6, 0.25, sfxG);
        cam(NOTE(d2 + 12), t + 0.15, 0.038 * g, 2.4, -0.25, sfxG, true);
        cam(NOTE(d3 + 12), t + 0.25, 0.032 * g, 2.2, 0.15, sfxG, true);
        tus(d2, t + 0.05, 0.036 * g, 2.0, -0.1, true, sfxG);
        // Geniş su altı hâlesi (sıcak akor çiçeği):
        kabar([d1 - 12, d2 - 12, (nts[1] || 76) - 12], t + 0.04, 0.3, 0.5, 1.6, 0.024 * g, sfxG, true);
      } finally { oncelikli = false; }
      // 4) Kadifemsi hidrodinamik süzülme ve peri tozu ışıltısı:
      const o = ton(t, 'sine', 280, 0, 0.75, 0.024 * g, 0.06, 0, 1.5);
      if (o) {
        o.frequency.setValueAtTime(260, t);
        o.frequency.exponentialRampToValueAtTime(420, t + 0.22);
        o.frequency.exponentialRampToValueAtTime(310, t + 0.7);
      }
      gur(t + 0.08, 0.75, 'highpass', 5200, 8800, 0.7, 0.009 * g, 0.12, 0, 2);
    },
    // Vatoz kemerlerinden geçerken art arda yükselen pırıltılı pentatonik kristal zil sesleri:
    vatozKemer(t, v) {
      if (t - vatozKemerT > 6) vatozKemerN = 0;
      let sira = 0;
      if (v && v.o && v.o.kemer) {
        sira = v.o.kemer.filter(a => a.gecti).length - 1;
      } else if (typeof v === 'number') {
        sira = v <= 1 && v > 0 ? (v >= 0.4 ? Math.round((v - 0.4) / 0.12) - 1 : 0) : Math.round(v) - 1;
      } else if (v && typeof v.sira === 'number') {
        sira = v.sira;
      } else {
        sira = vatozKemerN++;
      }
      vatozKemerT = t;
      sira = cl(sira, 0, 4);
      // G Lidyen pentatonik kristal dizisi (5 kemer art arda tırmanır):
      const KEMER_NOTALARI = [
        [74, 79, 83],             // 1. Kemer: D5, G5, B5 (parlak giriş)
        [76, 81, 86],             // 2. Kemer: E5, A5, D6 (bir basamak yukarı)
        [79, 83, 88],             // 3. Kemer: G5, B5, E6 (daha da yükseliş)
        [83, 86, 91, 93],         // 4. Kemer: B5, D6, G6, A6 (doruğa yaklaşma)
        [86, 91, 93, 95, 98],     // 5. Kemer: D6, G6, A6, B6, D7 (büyük kristal kutlama!)
      ];
      const notes = KEMER_NOTALARI[sira];
      oncelikli = true;
      try {
        const panDir = sira % 2 === 0 ? 1 : -1;
        notes.forEach((m, i) => {
          const ts = t + i * 0.072;
          const p = panDir * (-0.45 + (i / Math.max(1, notes.length - 1)) * 0.9);
          // Kristal çan tınlaması:
          cam(NOTE(m), ts, 0.052 + sira * 0.007, 2.6, p, sfxG);
          // Üst oktav pırıltısı:
          cam(NOTE(m + 12), ts + 0.006, 0.024 + sira * 0.004, 2.0, -p * 0.7, sfxG, false);
          // Net çelesta dokunuşu:
          tus(m, ts, 0.034 + sira * 0.005, 1.8, p, true, sfxG);
        });
        // 5. (son) kemerde ekstra kristal serpintisi ve sıcak akor çiçeği:
        if (sira >= 4) {
          for (let k = 0; k < 8; k++) {
            cam(NOTE(sec([91, 93, 95, 98, 103])), t + 0.35 + k * 0.08 + rnd() * 0.02, 0.014, 1.8, (k % 2 ? 0.6 : -0.6) * rnd(), sfxG, false);
          }
          kabar([55, 62, 67, 71, 76], t + 0.1, 0.4, 0.9, 2.4, 0.035, sfxG, true);
        }
      } finally { oncelikli = false; }
      // Kemerden geçişteki su-kristal hava pırıltısı ("fşşş-tın"):
      gur(t, 0.58, 'highpass', 5200, 9200, 0.7, 0.012 + sira * 0.003, 0.06, 0, 2);
      gur(t + 0.02, 0.48, 'bandpass', 500, 3200, 1.1, 0.028, 0.08, 0, 1.5);
    },
    // Bölüm 4 açılışı (OLAY 'bolum4Basla'): su altı uyanışı – ışık tozu, flüt nefesi, su damlaları ve sıcak G majör akoru
    bolum4Basla(t) {
      oncelikli = true;
      try {
        const G4 = [67, 71, 74, 78, 81, 86];
        for (let i = 0; i < 10; i++) cam(NOTE(G4[(i * 3) % G4.length] + (i % 2 ? 12 : 0)), t + 0.5 + i * 0.13, 0.009 + i * 0.001, 1.8, Math.sin(i * 1.7) * (0.85 - i * 0.07), sfxG, false);
        [[71, 0, 0.5], [74, 0.55, 0.8], [78, 1.4, 0.4], [76, 1.75, 1.3]].forEach(([m, d, u], k) => flut(m, t + 1.8 + d, u, 0.028, (k - 1.5) * 0.15, sfxG));
        for (let i = 0; i < 4; i++) damla(NOTE(67 + i * 7), t + 2.2 + i * 0.18, 0.024, (i - 1.5) * 0.25, sfxG);
      } finally { oncelikli = false; }
      kabar([43, 55, 62, 67, 71, 74], t + 1.5, 1.6, 1.2, 2.8, 0.03, sfxG, true);
      gur(t + 0.4, 2.4, 'bandpass', 400, 3800, 1.1, 0.016, 1.4, 0, 2);
    },
    denizZafer(t) {
      const ak = akorAt(t), notes = ak ? akTon(ak, 69, 5, true) : [69, 74, 78, 81, 86];
      oncelikli = true;
      try {
        kabar([notes[0] - 12, notes[1] - 12, notes[2] - 12, notes[3] - 12], t + 0.05, 0.4, 0.9, 2.6, 0.038, sfxG, true);
        for (let i = 0; i < 5; i++) {
          const n = notes[i], ts = t + i * 0.12, p = (i - 2) * 0.2;
          tus(n, ts, 0.045 - i * 0.003, 2.2, p, true, sfxG);
          arp(n, ts + 0.01, 0.032 - i * 0.002, -p, 2.0, sfxG);
          cam(NOTE(n + 12), ts + 0.02, 0.022, 2.4, p, sfxG, i === 4);
          if (i % 2 === 0) damla(NOTE(n + 12), ts + 0.04, 0.03, -p, sfxG);
        }
      } finally { oncelikli = false; }
      gur(t + 0.05, 1.2, 'bandpass', 450, 3600, 1.1, 0.022, 0.6, 0, 1.5);
    },
    denizati(t) {
      oncelikli = true;
      try {
        damla(NOTE(74), t, 0.05, -0.2, sfxG);
        tus(74, t + 0.02, 0.055, 1.8, -0.15, true, sfxG);
        arp(79, t + 0.14, 0.035, 0.15, 1.6, sfxG);
        tus(81, t + 0.16, 0.048, 2.0, 0.2, true, sfxG);
        cam(NOTE(86), t + 0.22, 0.025, 2.2, 0, sfxG, false);
      } finally { oncelikli = false; }
      gur(t, 0.25, 'bandpass', 1100, 650, 1.4, 0.016, 0.02, 0, 1);
    },
    ahtapotKol(t) { gur(t, 0.22, 'lowpass', 650, 330, 0.7, 0.012, 0.02, 0, 0.5); arp(69, t + 0.04, 0.028, 0, 1.3, sfxG); },
    kabukYer(t, v) {
      const idx = typeof v === 'number' ? v : (v && v.i) || 0;
      const notes = [[74, 78], [78, 83], [81, 86, 93]][idx % 3] || [74, 78];
      notes.forEach((n, k) => {
        arp(n, t + k * 0.1, 0.026, ((idx % 3) - 1) * 0.18, 2.0, sfxG);
        cam(NOTE(n + 12), t + 0.02 + k * 0.1, 0.022, 1.6, 0, sfxG, false);
      });
      gur(t, 0.18, 'lowpass', 520, 260, 0.8, 0.01, 0.02, 0, 0.4);
    },
    inciUyan(t) { [62, 67, 71, 74].forEach((n, i) => arp(n, t + i * 0.22, 0.03, (i - 1.5) * 0.12, 2.7, sfxG)); },
    inciDostlar(t) { [74,78,81,86].forEach((n,i)=>{arp(n,t+i*.17,.025,(i-1.5)*.15,2.4,sfxG);flut(n-12,t+i*.17,.55,.015,(1.5-i)*.1,sfxG);}); },
    inciDalga(t) { [67,71,74,78,81,86].forEach((n,i)=>arp(n,t+i*.16,.027-i*.002,(i-2.5)*.12,3.1,sfxG));kabar([55,62,67,71],t+.2,.7,1.2,2,.024,sfxG,false); },
    inciDoruk(t) { flut(78,t,.65,.024,-.12,sfxG);flut(76,t+.65,.65,.024,.12,sfxG);flut(74,t+1.3,1.8,.028,0,sfxG);[62,67,71,74].forEach((n,i)=>arp(n,t+1.3+i*.05,.025,(i-1.5)*.1,3.6,sfxG)); },
    secim(t, v) {
      const i = typeof v === 'number' ? v : (v && v.i) || 0, n = [74, 78, 81, 86, 90][i % 5];
      oncelikli = true;
      try {
        tus(n, t, 0.09, 1.5, ((i % 3) - 1) * 0.25, true, sfxG);
        cam(NOTE(n + 12), t + 0.005, 0.035, 1.4, 0, sfxG, false);
        ksilofon(n, t + 0.008, 0.065, ((i % 3) - 1) * 0.25, 'sedef');
      } finally { oncelikli = false; }
    },
    // seçilen baloncuk rüyaya akar: kısa yükselen ışıltı (D pentatonik: giriş ninnisinin tonu)
    ruyayaGec(t) {
      ninniKaydet();
      const N = RE.filter(m => m >= 69 && m <= 100);
      oncelikli = true; try { for (let i = 0; i < 9; i++) cam(NOTE(N[Math.min(N.length - 1, i * 2)]), t + i * 0.1, 0.03 + i * 0.003, 1.8, -0.6 + i * 0.15, sfxG, i < 5 ? false : undefined); } finally { oncelikli = false; }
      gur(t, 1.1, 'bandpass', 500, 5000, 1.1, 0.02, 0.6, 0, 2);
    },
    // tamamlanan rüya baloncuğunda altın yıldız belirir: hafif çan
    yildizRozet(t) {
      oncelikli = true; try { cam(NOTE(93), t, 0.06, 2.6, 0.2, sfxG); cam(NOTE(98), t + 0.14, 0.045, 2.8, -0.2, sfxG); tus(86, t + 0.02, 0.02, 2, 0, true, sfxG); } finally { oncelikli = false; }
    },
    // ── Yıldız Kaplumbağası animasyon sesleri ──
    hayvanBurun(t) { horAl(t, 1.3, 0.45); },   // uykuda burun kıpırtısı / yumuşak horultu (Pofuduk horlamasının çok kısık hâli)
    hayvanEsne(t) { agiz(t, 210, 140, 1.5, 0.035, [700, 1100], [420, 760], 0.3); gur(t, 1.4, 'bandpass', 800, 450, 1.5, 0.012, 0.35, 0); },
    // sırttaki bir yıldız noktası yandı: v = nokta sırası (0..) → yukarı tırmanan akor notası + minik ışıltı
    hayvanNokta(t, v) {
      const i = typeof v === 'number' ? v : 0, N = yPent(akorAt(t), 64, 96), n = N[Math.min(N.length - 1, Math.round(i * 1.5))];
      oncelikli = true; try { tus(n, t, 0.06, 2.4, ((i % 3) - 1) * 0.35, true, sfxG); cam(NOTE(n + 12), t + 0.01, 0.028, 2.2, -((i % 3) - 1) * 0.35, sfxG); cam(NOTE(n + 24), t + 0.06, 0.01, 1, 0.4, sfxG, false); } finally { oncelikli = false; }
    },
    hayvanComel(t) { ton(t, 'sine', 105, 52, 0.34, 0.1, 0.012, 0); gur(t, 0.22, 'lowpass', 450, 150, 0.9, 0.06, 0.012, 0, 1); },   // kabuk çömelir: tok, yumuşak
    // ── Takımyıldızı çiz (Bölüm 2 mini oyunu) ──
    // doğru bağlantı: v = sıra (0..): akora uyan notalar yukarı tırmanır (çelesta + cam çan)
    takimNota(t, v) {
      const ak = akorAt(t), N = yPent(ak, 72, 100), i = typeof v === 'number' ? v : (v && v.i) || 0, n = N[Math.min(N.length - 1, i)];
      oncelikli = true;
      try { tus(n, t, 0.07, 0.75, ((i % 3) - 1) * 0.3, true, sfxG); cam(NOTE(n + 12), t + 0.005, 0.03, 0.7, -((i % 3) - 1) * 0.3, sfxG, false); cam(NOTE(n + 24), t + 0.05, 0.008, 0.35, 0.4, sfxG, false); } finally { oncelikli = false; }   // kısa kuyruk: art arda bağlantılar çamurlaşmaz
      gur(t, 0.3, 'highpass', 5500, 8500, 0.7, 0.004, 0.04, 0, 2);
    },
    // şekil tamamlandı (~2 sn): sıcak akor çiçeği + parlak çan arpejli
    takimBitti(t) {
      const ak = akorAt(t), N = yPent(ak, 72, 103);
      kabar([ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12, ak.pad[1] + 24], t, 0.3, 0.9, 2.6, 0.035, sfxG, true);
      oncelikli = true;
      try {
        N.forEach((m, i) => { if (i % 2 === 0 || i > 6) cam(NOTE(m), t + 0.1 + i * 0.1, 0.04 - Math.min(i, 8) * 0.002, 2.8, -0.7 + 1.4 * i / N.length, sfxG, i % 3 === 0); });
        [N[N.length - 1], N[N.length - 3] || N[0]].forEach((m, k) => tus(m, t + 1.4 + k * 0.12, 0.05, 3, k ? 0.4 : -0.4, true, sfxG));
      } finally { oncelikli = false; }
      gur(t, 1.8, 'bandpass', 500, 6000, 1, 0.025, 1.0, 0, 2);
    },
    // yanlış değil, "hmm": çok yumuşak, hafif alçalan tek nota (ceza hissi yok)
    takimYanlis(t) {   // iki çok yumuşak, hafifçe alçalan nota
      const N = yPent(akorAt(t), 62, 80), m = Math.floor(N.length / 2), a = N[Math.min(N.length - 1, m + 1)], b = N[Math.max(0, m - 1)];
      oncelikli = true; try { tus(a, t, 0.024, 0.7, -0.1, false, sfxG); tus(b, t + 0.2, 0.02, 0.9, 0.1, false, sfxG); } finally { oncelikli = false; }
    },
    // noktalar gökte belirir: ışıltılı kısa süpürme + yukarı akan minik çanlar
    takimBelir(t) {
      gur(t, 0.6, 'bandpass', 800, 5200, 1.3, 0.02, 0.3, 0, 2);
      const N = yPent(akorAt(t), 84, 103);
      oncelikli = true; try { for (let i = 0; i < 6; i++) cam(NOTE(N[Math.min(N.length - 1, i + 1)]), t + 0.05 + i * 0.07, 0.014 + i * 0.001, 1.4, -0.5 + i * 0.2, sfxG, false); } finally { oncelikli = false; }
    },
    // suda sıçrayan yıldız balığı: hafif damla + minik çan + küçük su serpintisi
    balikSic(t, v) {
      const N = yPent(akorAt(t), 76, 98), n = N[Math.min(N.length - 1, ((typeof v === 'number' ? v : 0) * 3) % N.length)];
      gur(t, 0.18, 'bandpass', 1800, 900, 1.8, 0.02, 0.01, 0, 1);
      damla(NOTE(n), t + 0.02, 0.04, 0.2, sfxG); cam(NOTE(n + 12), t + 0.08, 0.02, 1.6, -0.3, sfxG, false);
      damla(NOTE(n + 7), t + 0.26, 0.02, -0.3, sfxG);   // geri düşerken ikinci damla
    },
    // taş suyun üstünde belirir: minik su halkası + yukarı "plink"
    yildizTasBelir(t, v) {
      const N = yPent(akorAt(t), 76, 96), n = N[Math.min(N.length - 1, ((typeof v === 'number' ? v : 0) * 2) % N.length)];
      damla(NOTE(n), t, 0.03, 0, sfxG); cam(NOTE(n + 12), t + 0.06, 0.018, 1.6, 0.25, sfxG, false);
      gur(t, 0.4, 'bandpass', 1800, 900, 1.5, 0.006, 0.12, 0, 2);
    },
    // yıldız hayvanı aşamaları (sırtındaki bir yıldız yandı): derin sıcak uğultu + yükselen yıldız ışıltısı
    hayvanAsama(t, v) {
      yHayvanA = Math.max(yHayvanA, Math.min(3, typeof v === 'number' ? v : (v && v.asama) || 1));
      const a = Math.max(1, typeof v === 'number' ? v : (v && v.asama) || 1), ak = akorAt(t), N = yPent(ak, 45, 69), n = N[Math.min(N.length - 1, (a - 1) * 2)];
      const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.6); g.gain.setTargetAtTime(0.0001, t + 0.9, 0.5); g.connect(sfxG); g.connect(revSfx);
      if (yerVar(4, t, t + 3, true)) { osc('sine', NOTE(n), t, t + 3, g); osc('sine', NOTE(n + 12), t, t + 3, kazanc(0.4, g), 5); osc('triangle', NOTE(n + 7), t, t + 3, kazanc(0.12, g), -4); }
      gur(t, 1.4, 'lowpass', 300, 700, 0.8, 0.03, 0.6, 0, 1);
      const M = yPent(ak, 78, 100);
      oncelikli = true;
      try { for (let i = 0; i < 4; i++) cam(NOTE(M[Math.min(M.length - 1, a + i * 2)]), t + 0.25 + i * 0.1, 0.03 + i * 0.002, 2.2, -0.4 + i * 0.27, sfxG); } finally { oncelikli = false; }
      if (a === 2) {   // esneme: "uyku sonu" – sıcak, yavaş açılan akor çiçeği + alçak, uykulu bir "ooo" notası
        kabar([ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12], t + 0.1, 0.9, 1.0, 2.2, 0.035, sfxG, false);
        tuba(ak.bas + 12, t + 0.3, 0.9, 0.04, -120, sfxG);
      }
    },
    // yıldız hayvanı uyandı ("Günaydın"): sıcak geniş akor kabarışı + cam çan şelalesi; müzik özel an'a girer
    hayvanUyan(t) {   // kabuk çöküşü: tok ve yumuşak bir düşüş + toz/parıltı halkası, sonra uyanış kutlaması
      ton(t, 'sine', 120, 52, 0.38, 0.11, 0.01, 0); gur(t, 0.3, 'lowpass', 500, 160, 0.9, 0.07, 0.012, 0, 1);
      oncelikli = true;
      try { const N = yPent(akorAt(t), 84, 103); for (let i = 0; i < 8; i++) cam(NOTE(N[(i * 3) % N.length]), t + 0.06 + i * 0.05, 0.016, 1.5, Math.sin(i * 0.8) * 0.8, sfxG, false); } finally { oncelikli = false; }
      gur(t + 0.05, 0.7, 'highpass', 5500, 9000, 0.7, 0.01, 0.1, 0, 2);
      yOzelT = t; SFX.hayvanKutla(t + 0.4, 0.8);
    },
    // gökyüzü tamamen doldu (hayvan Feza'yı fırlatıp son yıldızlar yerleşince): doruk, büyük şelale
    hayvanUyandi(t) { yBitti = true; yOzelT = t; SFX.hayvanKutla(t, 1); },
    hayvanKutla(t, g) {
      const ak = akorAt(t);
      kabar(ak.pad.concat([ak.bas + 12]), t, 1.0, 1.6, 3.4, 0.045 * g, sfxG, true);
      const M = yPent(ak, 69, 105);
      oncelikli = true;
      try {
        M.forEach((m, i) => cam(NOTE(m), t + 0.25 + i * 0.09, 0.034 * g, 3, -0.7 + 1.4 * i / M.length, sfxG, i % 3 === 0));
        for (let i = 0; i < Math.round(18 * g); i++) cam(NOTE(sec(M.slice(-8))), t + 1.0 + rnd() * 2.6, 0.012, 1.4 + rnd(), rnd() * 1.6 - 0.8, sfxG, false);
      } finally { oncelikli = false; }
      gur(t, 3, 'bandpass', 250, 5500, 0.9, 0.04 * g, 1.8, 0, 2);
    },
    // yıldız hayvanı Feza'yı göğe zıplatır: yumuşak, tombul "bumf" + yukarı akan ışıltı
    hayvanZipla(t) {
      ton(t, 'sine', 140, 62, 0.4, 0.13, 0.015, 0); ton(t, 'triangle', 280, 130, 0.18, 0.02, 0.01, 0);
      gur(t, 0.4, 'lowpass', 650, 180, 0.9, 0.09, 0.015, 0, 1);
      const ak = akorAt(t), N = yPent(ak, 69, 105);
      oncelikli = true;   // fırlatış: geniş, yükselen çan şelalesi (iki yöne açılan) + akor çiçeği
      try { for (let i = 0; i < 16; i++) cam(NOTE(N[Math.min(N.length - 1, Math.round(i * (N.length - 1) / 15))]), t + 0.08 + i * 0.075, 0.026 + i * 0.0012, 1.8 + i * 0.05, Math.sin(i * 0.9) * (0.3 + i * 0.04), sfxG, i < 10 ? false : undefined); } finally { oncelikli = false; }
      kabar([ak.bas + 12, ak.bas + 19, ak.pad[2], ak.pad[3] + 12, ak.pad[1] + 24], t + 0.1, 0.5, 0.8, 2.6, 0.03, sfxG, true);
      gur(t + 0.08, 1.0, 'bandpass', 600, 5200, 1.2, 0.03, 0.55, 0, 2);
    },
    // Bölüm 1 → 2 geçişi (OLAY 'bolumGecis'): Işık Ağacı'ndan ışık küreleri göğe yükselirken sakin, yükselen çan arpejleri (D pentatonik,
    // gittikçe tizleşip seyrekleşir) + sıcak bir akor çiçeği; son notalar A (Bölüm 2'nin köküne) açılır
    bolumGecis(t) {   // ~13 sn, sakin, sinematik: ağaç parlar → ışık göğe yükselir → panoramik kayma → yıldız göle düşer → A köküne toplanma
      const N = []; for (let m = 62; m <= 98; m++) if ([2, 4, 6, 9, 11].includes(m % 12)) N.push(m);
      oncelikli = true;
      try {
        kabar([50, 57, 62, 66, 69, 74], t + 0.1, 2.2, 2.4, 3.2, 0.04, sfxG, true);                  // 0–6: ağacın sıcak D akoru
        for (let w = 0; w < 4; w++) {                                                                // 0.4–6: yükselen çan arpejleri (ışık küreleriyle)
          const lo = 2 + w * 4, t0 = t + 0.4 + w * 1.25;
          for (let i = 0; i < 7; i++) {
            const m = N[Math.min(N.length - 1, lo + i)], g = 1 - w * 0.17;
            tus(m, t0 + i * 0.12, 0.05 * g, 2.2, -0.6 + i * 0.2, true, sfxG);
            if (i % 2 === 0) cam(NOTE(m + 12), t0 + i * 0.12 + 0.01, 0.014 * g, 2.0, 0.5 - i * 0.15, sfxG, false);
          }
        }
        // 6–9: panoramik kayma – geniş, yavaş açılan akor (D → A'ya kayar), uzak cam çanlar
        kabar([45, 52, 57, 64, 69, 76], t + 6.0, 2.2, 1.6, 3.4, 0.035, sfxG, true);
        [88, 93, 100].forEach((m, i) => cam(NOTE(m), t + 6.6 + i * 0.7, 0.014, 3.5, -0.8 + i * 0.8, sfxG));
        // 9–11: yıldız göle düşer – inen cam notalar (A Lidyen) + suya "bluk" ve halkalar
        [100, 96, 93, 88, 85, 81].forEach((m, i) => cam(NOTE(m), t + 8.4 + i * 0.3, 0.03 - i * 0.003, 2.4, 0.5 - i * 0.2, sfxG, i > 2));
        damla(NOTE(69), t + 10.4, 0.08, 0, sfxG); damla(NOTE(76), t + 10.56, 0.03, -0.4, sfxG); damla(NOTE(81), t + 10.7, 0.018, 0.4, sfxG);
        // 11–13: A köküne toplanma – Bölüm 2'nin pad akoru, tek çelesta yıldız notası
        kabar([45, 57, 61, 64, 68, 71], t + 10.8, 1.6, 0.8, 2.4, 0.03, sfxG, false);   // kararma sırasında A akoru
        tus(88, t + 11.9, 0.04, 3.2, 0, true, sfxG);
      } finally { oncelikli = false; }
      gur(t + 0.3, 6, 'bandpass', 400, 6000, 0.9, 0.02, 3.6, 0, 2);
      gur(t + 8.4, 2.0, 'bandpass', 3500, 700, 1.2, 0.015, 0.6, 0, 2);   // kayan yıldız "fiyuuu" (u≈8.4)
      gur(t + 10.4, 1.2, 'lowpass', 900, 250, 0.9, 0.03, 0.02, 0, 1);    // su
    },
    horlama(t, v) { horAl(t, 1.5, v || 1); horVer(t + 1.7, 1.4, v || 1); },
    horPuf(t, v) { horVer(t, 1.3, v); gur(t, 0.18, 'lowpass', 600, 250, 1.5, 0.07 * v, 0.01, 0); ton(t, 'sine', 140, 90, 0.16, 0.05 * v, 0.008, 0); },
    goz(t) {
      const n = akorNotalari(t, 86, 98); zil(NOTE(n[0]), t, 0.05, 1.2, 0.2, sfxG); zil(NOTE(n[2] || n[0]), t + 0.16, 0.05, 1.5, 0.3, sfxG);
      gur(t + 0.35, 0.16, 'lowpass', 500, 300, 2, 0.06, 0.01, 0); ton(t + 0.35, 'sawtooth', 85, 70, 0.14, 0.03, 0.01, 0);
    },
    esneme(t) {   // kocaman, komik bir esneme: "haaa-ooo"
      agiz(t, 230, 150, 1.7, 0.07, [760, 1180], [430, 780], 0.25);
      gur(t, 1.6, 'bandpass', 900, 500, 1.5, 0.02, 0.4, 0);
      tuba(57, t + 0.1, 1.2, 0.07, -300, sfxG);
    },
    kalk(t) {
      [38, 45, 50, 54, 57].forEach((n, i) => tuba(n + 12, t + i * 0.14, 0.13, 0.08, 0, sfxG));
      SFX.uyanma(t + 0.75);
    },
    buyukUyandi(t) {
      [50, 54, 57, 62].forEach((n, i) => tuba(n, t + i * 0.16, 0.14, 0.09, 0, sfxG));
      tuba(57, t + 0.75, 0.5, 0.09, 0, sfxG);
      const n = akorNotalari(t, 79, 98); n.forEach((m, i) => zil(NOTE(m), t + 0.3 + i * 0.07, 0.03, 2.2, (i % 2 ? 0.4 : -0.4), sfxG));
    },
    mmf(t) { agiz(t, 190, 160, 0.2, 0.03, [350, 700], null, 0.02); gur(t, 0.12, 'lowpass', 500, 250, 1, 0.03, 0.01, 0); },
    // finalde Pofuduklar Işık Ağacı'na fener asar (pofuduk.js 'fener' {i, x}): her fenere bir çelesta + çan. Notalar
    // D pentatoniğinde bir basamak yukarı tırmanır, ama yalnız o anki akora uyan basamaklara basar → 10 fener
    // birlikte küçük, yükselen bir ezgi çalar. Sonuncusu akoru yukarı doğru açan minik bir kapanış ekler.
    fener(t, v) {
      const ak = akorAt(t), i = v && v.i != null ? v.i : fenerI + 1, uyar = m => PENT.includes(m % 12) && (ak.mel.includes(m % 12) || ak.ton.includes(m % 12));
      if (i <= 0 || t - fenerT > 6 || !fenerSon) fenerSon = 72;
      let n = fenerSon + 1; while (n <= 100 && !uyar(n)) n++;
      if (n > 100) { n = 86; while (n <= 100 && !uyar(n)) n++; }   // tavana vardıysa bir oktav aşağıdan sürsün
      fenerSon = n; fenerT = t; fenerI = i;
      let p = i % 2 ? 0.3 : -0.3;
      try { if (v && v.x != null && typeof cam !== 'undefined' && typeof VW !== 'undefined') p = cl(((v.x - cam.x) / VW) * 1.4 - 0.7, -0.7, 0.7); } catch (er) {}
      const son = i >= 9;
      oncelikli = true;
      try {
        tus(n, t, 0.1, 1.8, p, true, sfxG);
        zil(NOTE(n + 12), t + 0.006, 0.038, 1.5, -p, sfxG);
        zil(NOTE(n + 24), t + 0.07 + rnd() * 0.03, 0.009, 0.6, p * 0.5, sfxG, false);   // minik ışıltı
        if (son) { const k = akorNotalari(t, n + 1, n + 14, true); k.slice(0, 3).forEach((m, j) => zil(NOTE(m), t + 0.22 + j * 0.11, 0.024 - j * 0.003, 2.2, (j - 1) * 0.4, sfxG)); }
      } finally { oncelikli = false; }
      gur(t, 0.5, 'highpass', 5000, 8000, 0.7, 0.006, 0.08, p, 2);   // fener yanarken yumuşak "fış"
    },
    // Büyük Pofuduk Feza'yı ağaca fırlatır (yıldız izi): yükselen büyülü "fuuuş" + akordan yukarı tırmanan ışıltı
    yildizIz(t) {
      gur(t, 1.25, 'bandpass', 450, 5200, 1.3, 0.055, 0.55, 0, 2);
      gur(t + 0.2, 1.1, 'highpass', 4500, 9500, 0.7, 0.011, 0.55, 0, 2);
      const n = akorNotalari(t, 79, 103);
      for (let i = 0; i < 9; i++) {
        const m = n[Math.min(n.length - 1, Math.round(i * (n.length - 1) / 8))];
        zil(NOTE(m), t + 0.06 + i * 0.075, 0.016 + i * 0.002, 1.1 + i * 0.12, -0.6 + i * 0.15, sfxG, i < 6 ? false : undefined);
      }
      for (let i = 0; i < 6; i++) ton(t + 0.25 + rnd() * 0.7, 'sine', 4200 + rnd() * 2800, 0, 0.1, 0.005, 0.003, rnd() - 0.5, 2);
    },
    // Büyük Pofuduk'un neşeli zıplayışının inişi ('sarsinti'): yumuşak, sıcak, tombul bir "bumf" (korkutucu değil:
    // derin değil, süzgeçli, yavaş vuruşlu) + iki minik hoplama "bup" + aşağı dökülen ışıltı kuyruğu
    bumf(t, v) {
      const g = cl((v || 0.5) * 1.6, 0.6, 1);
      ton(t, 'sine', 130, 58, 0.45, 0.15 * g, 0.02, 0);
      ton(t, 'triangle', 250, 120, 0.2, 0.022 * g, 0.015, 0);
      gur(t, 0.5, 'lowpass', 560, 150, 0.9, 0.12 * g, 0.018, 0, 1);
      gur(t + 0.01, 0.28, 'bandpass', 1000, 480, 1, 0.018 * g, 0.025, 0);
      const b = akorNotalari(t, 62, 74);
      hop(b[0], t + 0.17, 0.05 * g, -0.2, sfxG); hop(b[Math.min(b.length - 1, 2)], t + 0.33, 0.042 * g, 0.2, sfxG);
      const n = akorNotalari(t, 86, 101);
      for (let i = 0; i < 6; i++) zil(NOTE(n[Math.max(0, n.length - 1 - i)]), t + 0.14 + i * 0.075 + rnd() * 0.015, 0.014 - i * 0.0015, 1.1, i % 2 ? 0.5 : -0.5, sfxG, false);
      gur(t + 0.08, 0.9, 'highpass', 6000, 9000, 0.7, 0.007, 0.25, 0, 2);
    },
    agac(t) {   // ardından final D majörde başlar: parıltı da D majör
      const n = []; for (let m = 74; m <= 101; m++) if (AK.D.ton.includes(m % 12)) n.push(m);
      for (let i = 0; i < 22; i++) zil(NOTE(n[i % n.length] + (i >= n.length ? 12 : 0)), t + 0.05 + i * 0.12 + rnd() * 0.02, 0.032, 3.2, (i % 2 ? 0.55 : -0.55) * rnd(), sfxG);
      for (let i = 0; i < 14; i++) arp(akorNotalari(t, 50, 86)[i % 10] || 62, t + i * 0.05, 0.035, -0.7 + i * 0.1, 2.2);
      gur(t, 3.2, 'bandpass', 200, 6000, 0.9, 0.06, 2.2, 0, 2);
      if (yerVar(2, t, t + 5, true)) { const g = zarf(t, 0.06, 0.16, 4.5, sfxG); osc('sine', NOTE(38), t, t + 4.7, g); osc('sine', NOTE(50), t, t + 4.7, kazanc(0.4, g)); }
    },
    // ── Bölüm 3 "Bulut Ülkesi" efektleri (hepsi yumuşak; notalar G Lidyen / o anki akordan) ──
    // zıplatan bulut: pamuk gibi "puf" + yumuşak yay sesi + akordan basamak basamak yükselen harp & çelesta
    bulutZip(t, v) {
      const g = cl(typeof v === 'number' ? v : 0.7, 0.3, 1);
      if (t - bZipT > 2.5) bZipN = 0; bZipT = t;
      ton(t, 'sine', 150, 75, 0.28, 0.08 * g, 0.015, 0);
      gur(t, 0.28, 'lowpass', 680, 220, 0.8, 0.07 * g, 0.012, 0, 1);
      const o = ton(t, 'sine', 180, 0, 0.45, 0.05 * g, 0.012, 0, 1);
      if (o) { o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(420 + 80 * g, t + 0.12); o.frequency.setTargetAtTime(390, t + 0.12, 0.1); }
      const N = akorNotalari(t, 79, 98, true), n = N[Math.min(N.length - 1, bZipN++)];
      ksilofon(n, t + 0.04, 0.045 * g, 0.1, 'ahsap');
      oncelikli = true;
      try {
        arp(n - 12, t + 0.05, 0.05 * g, -0.15, 1.4, sfxG);
        tus(n, t + 0.06, 0.045 * g, 1.8, 0.15, true, sfxG);
        cam(NOTE(n + 12), t + 0.07, 0.02 * g, 1.2, 0.15, sfxG, false);
      } finally { oncelikli = false; }
    },
    // esinti (yukarı taşıyan hava akımı) – içine girince: havadar "fuuu" + yukarı uçan flüt & arp dizisi
    esinti(t) {
      gur(t, 1.4, 'bandpass', 320, 1700, 1.1, 0.035, 0.4, 0, 2);
      gur(t + 0.1, 1.2, 'highpass', 4200, 7200, 0.7, 0.006, 0.4, 0.2, 2);
      const N = akorNotalari(t, 76, 98, true);
      oncelikli = true;
      try {
        for (let i = 0; i < 4; i++) {
          const m = N[Math.min(N.length - 1, 1 + i * 2)];
          flut(m, t + 0.2 + i * 0.12, i < 3 ? 0.25 : 0.65, 0.024 + i * 0.002, -0.4 + i * 0.25, sfxG, false);
          arp(m - 12, t + 0.18 + i * 0.12, 0.022, -0.3 + i * 0.2, 1.6, sfxG);
        }
      } finally { oncelikli = false; }
    },
    // gökkuşağına bir renk eklendi (v = renk sırası 0..6): o rengin notası (G Lidyen, yükselen) çan + flüt + hafif akor
    gokkusagiParca(t, v) {
      const i = cl(typeof v === 'number' ? Math.round(v) : gParcaN, 0, 6), n = GOK7[i] + 12, p = -0.6 + i * 0.2; gParcaN = Math.min(6, i + 1);
      oncelikli = true;
      try { cam(NOTE(n), t, 0.055, 3, p, sfxG); cam(NOTE(n + 12), t + 0.01, 0.018, 2.4, -p, sfxG, false); flut(n, t + 0.03, 0.9, 0.026, p, sfxG); } finally { oncelikli = false; }
      gur(t, 1.0, 'highpass', 5000, 8500, 0.7, 0.006, 0.3, p, 2);
    },
    // gökkuşağı başlıyor (kuzucuklar sıraya diziliyor): yavaş açılan, ışıklı geniş akor + yukarı süzülen çanlar
    gokkusagiBasla(t) {
      kabar([43, 55, 62, 66, 71, 73, 78], t, 1.6, 1.4, 2.8, 0.03, sfxG, true);
      oncelikli = true; try { GOK7.forEach((m, i) => cam(NOTE(m + 12), t + 0.4 + i * 0.16, 0.022 + i * 0.002, 2.6, -0.6 + i * 0.2, sfxG, i > 3)); } finally { oncelikli = false; }
      gur(t, 2.2, 'bandpass', 400, 4500, 1, 0.018, 1.2, 0, 2);
    },
    // gökkuşağı tamam: büyük ışık çiçeği – iki oktav renk şelalesi, flütte Pırıl'ın motifi (D–B–A–G), sıcak geniş akor
    gokkusagiTamam(t) {
      kabar([43, 55, 62, 66, 71, 74, 78, 83], t, 0.8, 1.8, 3.4, 0.045, sfxG, true);
      oncelikli = true;
      try {
        for (let i = 0; i < 14; i++) cam(NOTE(GOK7[i % 7] + 12 + (i >= 7 ? 12 : 0)), t + 0.1 + i * 0.085, 0.03 - i * 0.001, 2.8, -0.7 + i * 0.1, sfxG, i % 4 === 0);
        [[86, 0, 0.55], [95, 0.6, 0.85], [93, 1.5, 0.3], [91, 1.8, 1.6]].forEach(([m, d, u], k) => { flut(m - 12, t + 1.3 + d, u, 0.045, (k - 1.5) * 0.15, sfxG); tus(m - 12, t + 1.3 + d, 0.03, 1.4 + u, 0.1, true, sfxG); });
        for (let i = 0; i < 10; i++) cam(NOTE(sec([91, 93, 95, 98, 100, 103])), t + 2.0 + rnd() * 2.2, 0.011, 1.4 + rnd(), rnd() * 1.6 - 0.8, sfxG, false);
      } finally { oncelikli = false; }
      gur(t, 3.2, 'bandpass', 250, 5500, 0.9, 0.035, 1.6, 0, 2);
    },
    // gökkuşağından kayma: yukarıdan aşağı akan arp & çelesta glissandosu + kayan hava
    kayma(t) {
      const N = []; for (let m = 98; m >= 62; m--) if ([7, 9, 11, 1, 2, 4, 6].includes(m % 12)) N.push(m);
      oncelikli = true;
      try {
        N.forEach((m, i) => {
          const ts = t + Math.pow(i / N.length, 0.9) * 2.2;
          arp(m, ts, 0.032 - 0.012 * i / N.length, 0.6 - 1.2 * i / N.length, 1.5, sfxG);
          if (i % 3 === 0) tus(m, ts, 0.024, 1.4, 0.5 - i / N.length, true, sfxG);
          if (i % 4 === 0) ksilofon(m, ts + 0.01, 0.024, 0.4 - 0.8 * i / N.length, 'sedef');
        });
      } finally { oncelikli = false; }
      gur(t, 2.4, 'bandpass', 2600, 500, 1, 0.022, 0.4, 0, 2);
      const o = ton(t + 0.1, 'sine', 1250, 0, 1.6, 0.01, 0.2, 0.2, 2); if (o) { o.frequency.setValueAtTime(1250, t + 0.1); o.frequency.exponentialRampToValueAtTime(620, t + 1.7); }
    },
    // kuzucuk rengine kavuştu (v = renk sırası 0..6): 7 notalık yükselen dizi (G Lidyen) – çelesta + flüt + çan + pamuk "puf";
    // yedincide dizi G'ye çözülür. Müzik bir sonraki ölçüde bu notayı flütle yankılar.
    kuzuRenk(t, v) {
      const i = cl(typeof v === 'number' ? Math.round(v) : Math.max(0, kuzuSay - 1), 0, 6), n = GOK7[i] + 12, p = -0.45 + i * 0.15;
      kBekle.push(GOK7[i]); if (kBekle.length > 2) kBekle.shift(); kOzelT = t;
      ton(t, 'sine', 160, 105, 0.32, 0.065, 0.03, 0);
      gur(t, 0.3, 'lowpass', 700, 260, 0.8, 0.05, 0.02, 0, 1);   // sarılma: yumuşak yün "puf"
      ksilofon(n, t + 0.04, 0.05, p, 'sedef');
      oncelikli = true;
      try {
        arp(n - 12, t + 0.04, 0.035, p, 2.0, sfxG);
        tus(n, t + 0.05, 0.08, 2.4, p, true, sfxG);
        flut(n, t + 0.06, 0.85, 0.038, p, sfxG);
        cam(NOTE(n + 12), t + 0.07, 0.025, 2.2, -p, sfxG, false);
        const N = akorNotalari(t, n + 2, n + 16, true); N.slice(0, 3).forEach((m, k) => cam(NOTE(m + 12), t + 0.3 + k * 0.08, 0.012, 1.4, (k - 1) * 0.4, sfxG, false));
        if (i === 6) { [79, 83, 86, 91].forEach((m, k) => { tus(m, t + 0.9 + k * 0.12, 0.05, 2.6, (k - 1.5) * 0.25, true, sfxG); cam(NOTE(m + 12), t + 0.91 + k * 0.12, 0.02, 2.4, 0, sfxG, false); }); kabar([43, 55, 62, 66, 71], t + 0.9, 0.5, 1.0, 2.4, 0.03, sfxG, true); }
      } finally { oncelikli = false; }
      gur(t + 0.05, 0.9, 'highpass', 5000, 8500, 0.7, 0.007, 0.2, 0, 2);
    },
    // minik, sevimli "mee" (kuzucuk): formant süzgeçli, titrek, kısık; her seferinde biraz farklı
    kuzuMee(t, v) {
      if (!yerVar(3, t, t + 0.8, true)) return;
      const f0 = 470 + rnd() * 140, iki = rnd() < 0.35, d1 = iki ? 0.2 : 0.42;
      const hece = (t0, d, f) => {
        const o = ac.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(f * 0.94, t0); o.frequency.linearRampToValueAtTime(f * 1.04, t0 + d * 0.3); o.frequency.linearRampToValueAtTime(f * 0.9, t0 + d);
        const lf = ac.createOscillator(); lf.frequency.value = 8.5 + rnd(); const lg = kazanc(f * 0.035, o.frequency); lf.connect(lg); lf.start(t0); lf.stop(t0 + d + 0.1);
        const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.024, t0 + 0.035);
        g.gain.setTargetAtTime(0.017, t0 + 0.05, 0.08); g.gain.setTargetAtTime(0.0001, t0 + d * 0.8, d * 0.15);
        const lp = suzgec('lowpass', 2800, 0.5, null); lp.connect(g); g.connect(panla(sfxG, typeof v === 'number' ? cl(v, -1, 1) * 0.5 : 0)); g.connect(revSfx);
        for (const [fa, q, gv] of [[480, 5, 1], [1950, 7, 0.45]]) { const bp = suzgec('bandpass', fa, q, null); o.connect(bp); bp.connect(kazanc(gv * 3, lp)); }
        o.start(t0); o.stop(t0 + d + 0.12);
      };
      hece(t, d1, f0); if (iki) hece(t + 0.24, 0.3, f0 * 1.06);
    },
    // uçuş başlıyor: üç yumuşak kanat "fuf"u + yukarı açılan harp glissandosu + ışıklı akor
    ucusBasla(t) {
      ucusT0 = t;
      [0, 0.36, 0.7].forEach((d, i) => { gur(t + d, 0.3, 'lowpass', 900, 300, 0.8, 0.05 - i * 0.008, 0.06, 0, 1); ton(t + d, 'sine', 120, 85, 0.22, 0.03 - i * 0.005, 0.03, 0); });
      const N = []; for (let m = 55; m <= 91; m++) if ([7, 9, 11, 1, 2, 4, 6].includes(m % 12)) N.push(m);
      oncelikli = true; try { N.forEach((m, i) => arp(m, t + 0.6 + Math.pow(i / N.length, 1.1) * 1.3, 0.024 + 0.012 * i / N.length, -0.6 + 1.2 * i / N.length, 1.6, sfxG)); } finally { oncelikli = false; }
      kabar([43, 55, 62, 66, 69, 74], t + 0.6, 1.0, 1.0, 2.2, 0.03, sfxG, true);
      gur(t + 0.4, 2.0, 'bandpass', 300, 3200, 1, 0.025, 1.2, 0, 2);
    },
    // Pırıl büyüyor: sıcak, yükselen bir kabarış (alçaktan değil, tatlı) + yukarı tırmanan ışıltı. v=0: uçuş sonunda normal boyuna döner (kısa, inen ışıltı)
    pirilBuyu(t, v) {
      if (v === 0) {
        const N = akorNotalari(t, 79, 98);
        oncelikli = true; try { for (let i = 0; i < 5; i++) cam(NOTE(N[Math.max(0, N.length - 1 - i * 2)]), t + i * 0.09, 0.016 - i * 0.002, 1.4, 0.4 - i * 0.2, sfxG, false); tus(N[0], t + 0.5, 0.03, 1.8, 0, true, sfxG); } finally { oncelikli = false; }
        gur(t, 0.8, 'highpass', 7000, 3500, 0.7, 0.007, 0.15, 0, 2);
        return;
      }
      if (yerVar(3, t, t + 2.6, true)) {
        const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.045, t + 0.9); g.gain.setTargetAtTime(0.0001, t + 1.5, 0.35); g.connect(sfxG); g.connect(revSfx);
        const lp = suzgec('lowpass', 900, 0.5, g);
        for (const [m, k] of [[55, 1], [62, 0.5], [67, 0.3]]) { const o = osc('sine', NOTE(m - 12), t, t + 2.6, kazanc(k, lp)); o.frequency.setValueAtTime(NOTE(m - 12), t); o.frequency.exponentialRampToValueAtTime(NOTE(m), t + 1.4); }
      }
      const N = akorNotalari(t, 79, 103);
      oncelikli = true; try { for (let i = 0; i < 9; i++) cam(NOTE(N[Math.min(N.length - 1, i)]), t + 0.3 + i * 0.12, 0.012 + i * 0.002, 1.6, -0.6 + i * 0.15, sfxG, i > 5); } finally { oncelikli = false; }
      gur(t, 1.8, 'highpass', 3000, 8000, 0.7, 0.012, 1.0, 0, 2);
    },
    // uçuşta ışıltı toplama (v = sıra): G majör pentatonikte sırayla yükselen kısa çelesta + çan (tepeye varınca bir oktav aşağıdan sürer)
    isiltiTopla(t, v) {
      if (t - isiltiT > 4) isiltiN = 0; isiltiT = t;
      const i = typeof v === 'number' ? Math.max(0, Math.round(v)) : isiltiN; isiltiN = i + 1;
      const N = [79, 81, 83, 86, 88, 91, 93, 95, 98], n = N[i % N.length], p = ((i % 3) - 1) * 0.3;
      oncelikli = true; try { tus(n, t, 0.06, 0.9, p, true, sfxG); cam(NOTE(n + 12), t + 0.005, 0.022, 0.9, -p, sfxG, false); } finally { oncelikli = false; }
      gur(t, 0.25, 'highpass', 6000, 9000, 0.7, 0.004, 0.02, p, 2);
    },
    // uçuşta gökkuşağı kemerinin içinden geçiş: tatlı bir "fuuş" + yukarı açılan üç flüt notası ve akor çanı
    kemer(t) {
      gur(t, 0.7, 'bandpass', 500, 3000, 1.1, 0.026, 0.25, 0, 2);
      const N = akorNotalari(t, 79, 98, true);
      oncelikli = true; try { [0, 2, 4].forEach((k, i) => flut(N[Math.min(N.length - 1, k)], t + 0.05 + i * 0.1, i < 2 ? 0.15 : 0.6, 0.03, (i - 1) * 0.3, sfxG, false)); cam(NOTE(N[Math.min(N.length - 1, 4)] + 12), t + 0.3, 0.02, 2.2, 0, sfxG); } finally { oncelikli = false; }
    },
    // uçuşta yanından geçen kuş sürüsü: soldan sağa kayan birkaç tatlı cıvıltı + hafif kanat hışırtısı
    kuslar(t) {
      for (let i = 0; i < 7; i++) { const ti = t + i * 0.22 + rnd() * 0.1, p = -0.7 + i * 0.22; kus(ti, p); if (rnd() < 0.4) kus(ti + 0.12, p); }
      gur(t + 0.2, 1.6, 'bandpass', 1800, 1200, 1.4, 0.006, 0.6, 0, 1);
    },
    // uçuşta bütün ışıltılar toplandı: kısa, parlak pentatonik koşu + akor çiçeği
    isiltiTamam(t) {
      oncelikli = true;
      try { [79, 83, 86, 91, 95, 98].forEach((m, i) => { tus(m, t + i * 0.07, 0.045 - i * 0.003, 1.8, (i - 2.5) * 0.2, true, sfxG); cam(NOTE(m + 12), t + 0.005 + i * 0.07, 0.016, 1.6, (2.5 - i) * 0.15, sfxG, i === 5); }); } finally { oncelikli = false; }
      kabar([43, 55, 62, 66, 71, 74], t + 0.3, 0.35, 0.8, 2.0, 0.026, sfxG, true);
    },
    // uçuş inişi: inen harp + yumuşak bulut "puf" + G akoruna dinlenme
    ucusIn(t) {
      const N = akorNotalari(t, 67, 91, true);
      oncelikli = true; try { for (let i = 0; i < 6; i++) arp(N[Math.max(0, N.length - 1 - i)], t + i * 0.1, 0.028, 0.5 - i * 0.18, 1.6, sfxG); } finally { oncelikli = false; }
      gur(t + 0.6, 0.35, 'lowpass', 700, 220, 0.8, 0.06, 0.015, 0, 1); ton(t + 0.6, 'sine', 140, 80, 0.25, 0.05, 0.01, 0);
      kabar([43, 55, 62, 66, 71], t + 0.7, 0.6, 0.8, 2.0, 0.022, sfxG, false);
    },
    // bulut şekli ovuluyor (v = 0..1 ilerleme): kısık havadar "fş" (ilerledikçe parlar) + her sekizde birde yükselen çan
    sekilOv(t, v) {
      const x = cl(typeof v === 'number' ? v : 0, 0, 1), adim = Math.floor(x * 8);
      if (x < sekilSonV - 0.3) sekilAdim = -1;
      sekilSonV = x;
      gur(t, 0.16, 'bandpass', 700 + 2200 * x, 0, 1.2, 0.012, 0.04, (rnd() - 0.5) * 0.4, 1);
      if (adim > sekilAdim) {
        sekilAdim = adim;
        const N = [79, 81, 83, 86, 88, 91, 93, 95, 98], n = N[Math.min(N.length - 1, adim)];
        oncelikli = true;
        try {
          tus(n, t, 0.045, 1.4, (adim - 4) * 0.1, true, sfxG);
          cam(NOTE(n + 12), t + 0.01, 0.018, 1.2, 0, sfxG, false);
        } finally { oncelikli = false; }
      }
    },
    // bulut şekli canlanır (v = hayvan): büyülü kabarış + her hayvana kendi küçük flüt motifi + harp kutlaması
    sekilCanlan(t, v) {
      sekilAdim = -1; sekilSonV = 0;
      let h = 0; if (typeof v === 'number') h = Math.abs(Math.round(v)); else if (v && typeof v === 'string') for (let i = 0; i < v.length; i++) h += v.charCodeAt(i); else if (v && v.hayvan != null) h = typeof v.hayvan === 'number' ? v.hayvan : String(v.hayvan).length;
      // 0 tavşan (hoplayan) · 1 balina (alçak, geniş) · 2 fil (tok, oyunbaz) · 3 kuş (tiz cıvıltı) · 4 ayıcık (sıcak) · 5 Feza (Feza'nın üç–iki–biri + Pırıl'ın sıçrayışı)
      const M = [[79, 86, 83, 91], [67, 74, 71, 79], [71, 67, 74, 79], [91, 95, 93, 98], [74, 78, 76, 79], [83, 81, 79, 86]][h % 6];
      gur(t, 1.0, 'bandpass', 500, 4500, 1, 0.022, 0.5, 0, 2);
      kabar([43, 55, 62, 66, 71], t, 0.5, 0.8, 2.0, 0.026, sfxG, true);
      oncelikli = true;
      try {
        M.forEach((m, i) => {
          const u = i === 3 ? 0.8 : 0.2;
          flut(m, t + 0.35 + i * 0.2, u, 0.04, (i - 1.5) * 0.2, sfxG);
          tus(m, t + 0.35 + i * 0.2, 0.03, 1 + u, 0, true, sfxG);
          arp(m - 12, t + 0.3 + i * 0.2, 0.025, (1.5 - i) * 0.15, 1.6, sfxG);
        });
        for (let i = 0; i < 6; i++) cam(NOTE(sec([91, 93, 95, 98, 100])), t + 0.2 + i * 0.09, 0.012, 1.2, rnd() * 1.4 - 0.7, sfxG, false);
      } finally { oncelikli = false; }
    },
    // mini oyun bitti: neşeli, kısa pentatonik çelesta + çan kutlaması
    // Bölüm 3: buluttan aşağı düşüş (ceza değil): yumuşak, aşağı kayan hava + inen iki harp notası (su sesi yok)
    bulutDus(t) {
      gur(t, 0.9, 'bandpass', 1800, 450, 1.1, 0.03, 0.12, 0, 1);
      const o = ton(t, 'sine', 700, 0, 0.7, 0.012, 0.05, 0, 1); if (o) { o.frequency.setValueAtTime(700, t); o.frequency.exponentialRampToValueAtTime(380, t + 0.6); }
      const N = akorNotalari(t, 67, 86, true);
      oncelikli = true; try { arp(N[Math.min(N.length - 1, 4)], t + 0.05, 0.026, 0.2, 1.4, sfxG); arp(N[Math.min(N.length - 1, 2)], t + 0.25, 0.022, -0.2, 1.6, sfxG); } finally { oncelikli = false; }
    },
    // Bölüm 3 açılışı (OLAY 'bolum3Basla'): gün doğumu – ışık tozu toplanır, flütte Pırıl'ın sıçrayışı, sıcak G Lidyen akor açılır
    bolum3Basla(t) {
      oncelikli = true;
      try {
        for (let i = 0; i < 10; i++) cam(NOTE(GOK7[(i * 3) % 7] + 12 + (i % 2 ? 12 : 0)), t + 0.5 + i * 0.13, 0.008 + i * 0.0012, 1.6, Math.sin(i * 1.7) * (0.9 - i * 0.08), sfxG, false);
        [[74, 0, 0.5], [83, 0.6, 0.8], [81, 1.5, 0.3], [79, 1.8, 1.2]].forEach(([m, d, u], k) => flut(m, t + 1.9 + d, u, 0.03, (k - 1.5) * 0.15, sfxG));
      } finally { oncelikli = false; }
      kabar([43, 55, 62, 66, 69, 73], t + 1.6, 1.6, 1.2, 2.8, 0.03, sfxG, true);
      gur(t + 0.4, 2.4, 'bandpass', 500, 4500, 1.1, 0.014, 1.4, 0, 2);
    },
    sekilBitti(t) {
      oncelikli = true;
      try { [79, 83, 86, 91, 95].forEach((m, i) => { tus(m, t + i * 0.09, 0.05 - i * 0.003, 2.2, (i - 2) * 0.2, true, sfxG); cam(NOTE(m + 12), t + 0.005 + i * 0.09, 0.018, 1.8, (2 - i) * 0.15, sfxG, i === 4); }); } finally { oncelikli = false; }
      kabar([43, 55, 62, 66, 71, 74], t + 0.4, 0.4, 0.9, 2.2, 0.03, sfxG, true);
      gur(t, 1.0, 'lowpass', 300, 2000, 0.9, 0.025, 0.35, 0, 1);
    },
  };
  let gParcaN = 0, bZipT = -1e9, bZipN = 0, isiltiT = -1e9, isiltiN = 0, sekilAdim = -1, sekilSonV = 0;
  function horAl(t, dur, v) {   // horlama: alçak, tırtıklı "hrrr" (korkutucu değil: yumuşak süzgeç, kısık)
    if (!yerVar(4, t, t + dur, true)) return;
    const g = ac.createGain(); g.gain.value = 0.0001; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14 * v, t + dur * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const am = ac.createGain(); am.gain.value = 0.55; am.connect(g); g.connect(sfxG); g.connect(revSfx);
    const lfo = ac.createOscillator(); lfo.frequency.value = 17; const lg = kazanc(0.45, am.gain); lfo.connect(lg); lfo.start(t); lfo.stop(t + dur + 0.05);
    const lp = suzgec('lowpass', 520, 1.2, am); lp.frequency.setValueAtTime(420, t); lp.frequency.linearRampToValueAtTime(900, t + dur);
    const o = osc('sawtooth', 92, t, t + dur + 0.05, lp); o.frequency.linearRampToValueAtTime(108, t + dur);   // korkutucu olmasın: tok değil, tatlı bir "hırr"
    const s = ac.createBufferSource(); s.buffer = gurBuf; s.loop = true; const nb = suzgec('bandpass', 700, 1.2, am); s.connect(kazanc(0.5, nb)); s.start(t, rnd()); s.stop(t + dur + 0.05);
  }
  function horVer(t, dur, v) {   // nefes verirken minik ıslık: "fiyuuu"
    const o = ton(t, 'sine', 950, 0, dur, 0.035 * v, 0.15, 0.1, 1);
    if (o) { o.frequency.setValueAtTime(950, t); o.frequency.linearRampToValueAtTime(1350, t + dur * 0.35); o.frequency.linearRampToValueAtTime(900, t + dur); }
    gur(t, dur, 'lowpass', 900, 500, 0.7, 0.025 * v, 0.2, 0);
  }
  // ───────────────────────── sahne geçişleri (sahne.js: OLAY 'sahneAn' {ad}) ─────────────────────────
  // Hepsi müzik otobüsüne (sahneG) gider: anlatıcı konuşurken müzikle birlikte kısılır. Notalar D majörden
  // (ninni/final tonu) seçilir; hiçbir şey ani başlamaz/bitmez.
  const RE = []; for (let m = 50; m <= 100; m++) if ([2, 4, 6, 9, 11].includes(m % 12)) RE.push(m);   // D pentatonik
  let kirpT = -1e9;
  const SAHNE_SES = {
    uyudu(t) {        // Feza uykuya dalar: aşağı süzülen üç yumuşak çelesta notası + derin, sıcak bir nefes
      [86, 81, 78].forEach((n, i) => tus(n, t + i * 0.5, 0.026 - i * 0.004, 2.8, 0.25 - i * 0.2, true, sahneG));
      kabar([38, 50, 57], t + 0.2, 1.6, 0.8, 2.6, 0.03);
      gur(t, 2.4, 'lowpass', 900, 380, 0.7, 0.012, 1.1, 0, 1, sahneHam);
      ruya = 0;
    },
    piril_uyandi(t) { // Pırıl'ın gözleri açılır: iki tatlı ışıltı (beşli yukarı) + incecik parıltı; rüya katmanı belirir
      zil(NOTE(86), t, 0.04, 2.2, -0.2, sahneG); zil(NOTE(93), t + 0.22, 0.04, 2.6, 0.25, sahneG);
      for (let i = 0; i < 7; i++) zil(NOTE(RE[RE.length - 1 - (i * 2) % 9]), t + 0.5 + i * 0.09 + rnd() * 0.03, 0.009, 1, rnd() - 0.5, sahneG, false);
      gur(t + 0.1, 2.2, 'highpass', 5000, 8500, 0.7, 0.01, 0.8, 0, 2, sahneHam);
      ruya = Math.max(ruya, 0.35);
      pirilBekle = true;   // ninni yarım cümle sonunda Pırıl'ın temasına geçer
    },
    eriyor(t) {       // oda erir (~9 sn): yükselen büyülü parıltı, arp glissandoları, açılan rüya akoru
      // 1) iki arp glissandosu: alttan tepeye (2.2 sn), sonra daha yukarıdan ikinci, daha kısa bir dalga
      const g1 = RE.filter(n => n >= 57 && n <= 93);
      g1.forEach((n, i) => arp(n, t + 0.3 + Math.pow(i / g1.length, 0.85) * 2.2, 0.03 + 0.012 * (i / g1.length), -0.7 + 1.4 * i / g1.length, 1.7, sahneG));
      const g2 = RE.filter(n => n >= 69 && n <= 100);
      g2.forEach((n, i) => arp(n, t + 4.6 + i * 0.075, 0.022, 0.7 - 1.4 * i / g2.length, 1.4, sahneG));
      // 2) yükselen ışıltı: yoğunlaşan ve tizleşen çan serpintisi
      for (let i = 0; i < 20; i++) {
        const x = i / 20, ti = t + 0.8 + 6.6 * Math.pow(x, 0.8) + rnd() * 0.08;
        const lo = Math.floor(8 + x * 12), n = RE[Math.min(RE.length - 1, lo + Math.floor(rnd() * 6))];
        zil(NOTE(n), ti, 0.009 + 0.011 * x, 1.3, rnd() * 1.4 - 0.7, sahneG, false);
      }
      // 3) gürültüden yükselen "fıııış" (çok kısık) ve rüya akoru (D add9, A üstünde asılı)
      gur(t, 8, 'bandpass', 900, 7000, 0.9, 0.018, 6, 0, 2, sahneHam);
      kabar([45, 57, 62, 64, 69, 71, 76], t + 0.2, 4.5, 2.2, 3.2, 0.028, sahneG, true);
      ruya = 1;
    },
    orman(t) {        // orman belirir: sıcak bir çözülme – derin re, açık akor, aşağı inen yumuşak arp
      if (bolum5()) { SFX.bolum5Basla(t); return; }
      if (bolum6()) { SFX.bolum6Basla(t); return; }
      if (bolum7()) { SFX.bolum7Basla(t); return; }
      if (bolum8()) { SFX.bolum8Basla(t); return; }
      kabar([38, 50, 57, 62, 66, 69], t, 0.5, 2.4, 3.6, 0.04, sahneG, true);
      [93, 90, 86, 81, 78, 74, 69].forEach((n, i) => arp(n, t + 0.15 + i * 0.14, 0.03 - i * 0.002, 0.6 - i * 0.2, 2.2, sahneG));
      zil(NOTE(86), t + 1.2, 0.04, 3, 0, sahneG);
    },
    feza_uyan(t) { SFX.fezaEsne(t); SFX.gerinme(t + 0.9); },   // sabah: Feza kıpırdanır, esner, gerinir
    feza_uyandi(t) { kabar([62, 66, 69, 74, 78], t, 0.6, 1.2, 2.4, 0.026, sahneG, true); },   // gözler açılır: sıcak majör çiçeği
    feza_bakti(t) { oncelikli = true; try { cam(NOTE(90), t, 0.02, 2, 0.3, sahneG, false); } finally { oncelikli = false; } },
    oda(t) { kabar([50, 57, 62, 66, 74], t, 1.5, 1.5, 3, 0.03, sahneG, true); },   // pencereden ışık dolarken sıcak akor
    ruyayaGec(t) { SFX.ruyayaGec(t); },
    ic_cek(t) {       // uykuya dalmadan önce derin, tatlı bir iç çekiş (çok kısık, yumuşak hava)
      gur(t, 1.5, 'bandpass', 700, 380, 1.2, 0.012, 0.6, 0, 1, sahneHam);
    },
    isik(t, sm) {     // giriş: dünya parlar (yükselen ışık) · final: altın ışık ekranı doldurur (sıcak, büyük akor)
      if (bolum5()) {
        const final = sm === 'final' || mod === 'final';
        kabar([53, 60, 65, 69, 76], t, final ? 1.6 : .65, .8, 2.8, final ? .027 : .02, sahneG, true);
        [77, 81, 84, 86, 89].forEach((n, i) => korTasi(n, t + .15 + i * .16, .025 - i * .002, -.3 + i * .15, sahneG, true));
        if (final) finalIstek = 'zirve';
        return;
      }
      if (bolum8()) {   // Balkabağı Gecesi: Re minör (finalde Re majör) akoru + yükselen sıcak çanlar; finalde doruğa atlar
        const final = sm === 'final' || mod === 'final';
        kabar(final ? [38, 50, 57, 62, 66, 69] : [38, 50, 57, 62, 65, 69], t, final ? 1.6 : 0.65, 0.8, 2.8, final ? 0.024 : 0.019, sahneG, true);
        (final ? [78, 81, 86, 90, 93] : [77, 81, 86, 89, 93]).forEach((n, i) => zil(NOTE(n), t + 0.15 + i * 0.15, 0.024 - i * 0.002, 2.4, -0.3 + i * 0.15, sahneG));
        if (final) finalIstek = 'zirve';
        return;
      }
      if (bolum7()) {   // Kuzey Işıkları: E akoru + yükselen kristal çanlar; finalde doruğa atlar
        const final = sm === 'final' || mod === 'final';
        kabar([40, 52, 59, 63, 66, 71], t, final ? 1.6 : 0.65, 0.8, 2.8, final ? 0.024 : 0.019, sahneG, true);
        [80, 83, 88, 92, 95].forEach((n, i) => cam(NOTE(n), t + 0.15 + i * 0.15, 0.018 - i * 0.0015, 2.4, -0.3 + i * 0.15, sahneG, i === 0));
        if (final) finalIstek = 'zirve';
        return;
      }
      if (bolum6()) {   // Şenlik Kalesi: G akoru + yükselen sıcak çanlar; finalde doruğa atlar
        const final = sm === 'final' || mod === 'final';
        kabar([43, 55, 62, 67, 71, 74], t, final ? 1.6 : 0.65, 0.8, 2.8, final ? 0.026 : 0.02, sahneG, true);
        [79, 83, 86, 91, 95].forEach((n, i) => zil(NOTE(n), t + 0.15 + i * 0.15, 0.026 - i * 0.002, 2.4, -0.3 + i * 0.15, sahneG));
        if (final) finalIstek = 'zirve';
        return;
      }
      if (sm === 'final' || mod === 'final' || (!sm && typeof DURUM !== 'undefined' && DURUM === 'final' && !test)) {
        kabar([38, 45, 50, 54, 57, 62, 66, 69, 74], t, 1.8, 2.4, 4, 0.04, sahneG, true);
        RE.filter(n => n >= 62 && n <= 98).forEach((n, i) => zil(NOTE(n), t + 0.4 + i * 0.1, 0.022, 2.6, (i % 2 ? 0.5 : -0.5), sahneG));
        gur(t, 3.4, 'bandpass', 300, 5000, 0.8, 0.03, 2.6, 0, 2, sahneHam);
        finalIstek = 'zirve';
      } else {
        [74, 78, 81, 86, 90].forEach((n, i) => zil(NOTE(n), t + i * 0.13, 0.03, 2.4, -0.5 + i * 0.25, sahneG));
        kabar([62, 66, 69, 74], t, 0.4, 1.2, 2.6, 0.025, sahneG, true);
        gur(t, 1.8, 'highpass', 4000, 8000, 0.7, 0.012, 0.5, 0, 2, sahneHam);
      }
    },
    sabah(t) {        // sabah: uzakta kuşlar cıvıldar, güneşli yükselen çanlar; final müziği ninniye bağlanır
      [74, 78, 81, 86].forEach((n, i) => zil(NOTE(n), t + 0.2 + i * 0.32, 0.03, 2.6, -0.3 + i * 0.2, sahneG));
      kus(t + 1.0, 0.5); kus(t + 1.9, -0.45); kus(t + 2.35, -0.45); kus(t + 3.6, 0.5);
      if (mod === 'final') finalIstek = 'sabah';
      sabahKus = true;
    },
    goz_kirp(t) {     // göz kırpma: minik çelesta "tiling" (yukarı bir altılı) + ışıltı
      kirpT = performance.now();
      const son = pirilAlinti(t, 0.13, 0.04, sahneG, 3, 0.1);   // Pırıl'ın motifinin başı: göz kırpan bir "ben buradayım"
      zil(NOTE(akorNotalari(son, 96, 103)[0]), son, 0.014, 1.4, 0.4, sahneG, false);
      gur(t + 0.1, 0.7, 'highpass', 6000, 9000, 0.7, 0.008, 0.15, 0.3, 2, sahneHam);
    },
  };
  function kus(t, pan) {   // tatlı, kısa bir kuş cıvıltısı: iki hızlı perde kayması (yumuşak, uzaktan)
    const f = 2700 + rnd() * 600;
    ton(t, 'sine', f, f * 1.35, 0.07, 0.007, 0.01, pan, 2, sahneG);
    ton(t + 0.09, 'sine', f * 1.2, f * 0.95, 0.09, 0.006, 0.01, pan, 2, sahneG);
  }
  let atlandiT = -1e9;
  function sahneAn(ad, sm) {
    if (ad === 'atlandi') { atlandiT = performance.now(); ruya = 0; return; }   // giriş atlandı: erime/orman aynı karede gelir
    if (!ac || !SAHNE_SES[ad]) return;
    if (ac.state !== 'running' && !test) return;
    if ((ad === 'eriyor' || ad === 'orman') && performance.now() - atlandiT < 2000) return;   // yalnız ışık yükselişi kalsın
    const k = 'sahne_' + ad;
    if (sonCal[k] && zaman() - sonCal[k] < 1) return;
    sonCal[k] = zaman();
    oncelikli = true;   // bir kerelik geçişler: glissandonun ortasından nota düşmesin
    try { SAHNE_SES[ad](zaman() + 0.02, sm); } finally { oncelikli = false; }
  }
  // ad eşlemesi (eski ve yeni adlar)
  const AD = { jump: 'zipla', zipla: 'zipla', dbl: 'cift', cift: 'cift', ciftzipla: 'cift', land: 'inis', inis: 'inis', bloom: 'cicek', cicek: 'cicek',
    splash: 'su', su: 'su', boing: 'boing', ziplat: 'boing', puf: 'puf', hapsu: 'hapsu', hapsuAl: 'hapsuAl', uyanma: 'uyanma', zilcik: 'uyanma', tohum: 'tohum', nefes: 'nefes',
    nilufer: 'nilufer', kurtar: 'kurtar', horlama: 'horlama', parilti: 'parilti', nefesAl: 'nefesAl', agac: 'agac', adim: 'adim', goz: 'goz', esneme: 'esneme', kalk: 'kalk', mmf: 'mmf', buyukUyandi: 'buyukUyandi',
    yildizTas: 'yildizTasi', yildizTasBelir: 'yildizTasBelir', hayvanFirlat: 'hayvanZipla', hayvanUyandi: 'hayvanUyandi', yildizUyan: 'yildizUyan', yildizYuksel: 'yildizYuksel', yildizYerles: 'yildizYerles', yildizTasi: 'yildizTasi', hayvanAsama: 'hayvanAsama', hayvanUyan: 'hayvanUyan', balikSic: 'balikSic', yatagaGir: 'yatagaGir', yastik: 'yastik', lambaKis: 'lambaKis', uykuNefes: 'uykuNefes', sabahKus: 'sabahKus', gerinme: 'gerinme', fezaEsne: 'fezaEsne', gozKirp: 'gozKirp', secim: 'secim', ruyayaGec: 'ruyayaGec', yildizRozet: 'yildizRozet', bolum2Basla: 'bolum2Basla', hayvanBurun: 'hayvanBurun', hayvanEsne: 'hayvanEsne', hayvanNokta: 'hayvanNokta', hayvanComel: 'hayvanComel', takimNota: 'takimNota', takimBitti: 'takimBitti', takimYanlis: 'takimYanlis', takimBelir: 'takimBelir', bolumGecis: 'bolumGecis', hayvanZipla: 'hayvanZipla',
    sarki: 'sarki', sarkiOlmadi: 'sarkiOlmadi', sarkiBitti: 'sarkiBitti', sarkiZafer: 'sarkiZafer', fener: 'fener', yildizIz: 'yildizIz', bumf: 'bumf', sarsinti: 'bumf',
    bulutZip: 'bulutZip', esinti: 'esinti', gokkusagiParca: 'gokkusagiParca', gokkusagiBasla: 'gokkusagiBasla', gokkusagiTamam: 'gokkusagiTamam', kayma: 'kayma', kuzuRenk: 'kuzuRenk', kuzuMee: 'kuzuMee',
    ucusBasla: 'ucusBasla', pirilBuyu: 'pirilBuyu', isiltiTopla: 'isiltiTopla', isilti: 'isiltiTopla', ucusIn: 'ucusIn', bulutDus: 'bulutDus', kuslar: 'kuslar', bolum3Basla: 'bolum3Basla', kemer: 'kemer', ucusKemer: 'kemer', isiltiTamam: 'isiltiTamam', sekilOv: 'sekilOv', sekilCanlan: 'sekilCanlan', sekilBitti: 'sekilBitti', denizHamle: 'denizHamle', denizati: 'denizati', ahtapotKol: 'ahtapotKol', kabukYer: 'kabukYer', ahtapotTamam: 'inciUyan', vatozBasla: 'denizHamle', vatozBitti: 'denizati', vatozKemer: 'vatozKemer', bolum4Basla: 'bolum4Basla', inciUyan: 'inciUyan', inciDostlar: 'inciDostlar', inciDalga: 'inciDalga', inciDoruk: 'inciDoruk', inci: 'denizati', denizZafer: 'denizZafer', suAkinti: 'suAkinti', akinti: 'suAkinti' };
  const ESKI = { jump: 1, dbl: 1, bloom: 1, land: 1, splash: 1 };   // olaylar da tetikler → çift çalmasın
  const sonCal = {};
  // Bölüm 8 efektlerinin en kısa tekrar aralığı (sn): aynı anda gelen AU.sfx + olay yedeği iki kez çalmasın
  const C8_ENAZ = { bolum8Basla: 3, kostumPuf: 1, kabakFener: 0.15, hayaletKikir: 0.5, hayaletCee: 1, kabakYuzBaloncuk: 0.3, kabakYuzParca: 0.3, kabakYuzKikir: 0.25, kabakYuzCanlan: 4,
    iskeletNota: 0.05, iskeletDans: 0.4, kemikTakir: 0.1, kapiTak: 0.12, kapiAc: 0.4, kapiFener: 0.4, sekerUc: 0.08, sekerSepet: 0.05, sakaKonfeti: 0.6, sakaYay: 0.6,
    kazanFokur: 0.35, kazanMalzeme: 0.4, kazanPuf: 1.5, supurgeCanlan: 3, supurgeVin: 0.5, supurgeSeker: 0.05, supurgeInis: 3, cadiFinal: 3, cadiDoruk: 3, cadiTamam: 3,
    yarasaPir: 0.4, kediMiyav: 0.8, baykusHu: 1.5 };
  const C8_SFX = /^(bolum8Basla|kostumPuf|kabakFener|hayaletKikir|hayaletCee|kabakYuzBaloncuk|kabakYuzParca|kabakYuzKikir|kabakYuzCanlan|iskeletNota|iskeletDans|kemikTakir|kapiTak|kapiAc|kapiFener|sekerUc|sekerSepet|sakaKonfeti|sakaYay|kazanFokur|kazanMalzeme|kazanPuf|supurgeCanlan|supurgeVin|supurgeSeker|supurgeInis|cadiFinal|cadiDoruk|cadiTamam|fisek|yarasaPir|kediMiyav|baykusHu)$/;
  const K7_ENAZ = { kFener: 0.12, kYavru: 0.3, kZipla: 0.25, kardanBasla: 3, kardanTop: 0.2, kardanParca: 0.12, kardanCanlan: 6, kizakHiz: 3, kizakKristal: 0.06, kizakKacti: 0.4, kizakFinalSicrama: 3, kizakInis: 3, kizakUc: 3, kizakIn: 3, kizakKucukInis: 0.3, geyikTanis: 4, kizakBasla: 3, kizakTane: 0.07, kizakZipla: 0.35, kizakBitti: 3, kuzeyFinal: 3, kuzeyDoruk: 3, kuzeyTamam: 3, golKay: 1, bolum7Basla: 3 };
  let sonOlay = -1;
  function cal(ad, v, gecik, anahtar) {   // anahtar: aynı efektin farklı notaları ayrı sayılsın (iskeletNota i)
    if (!ac || !SFX[ad]) return;
    if (ac.state !== 'running' && !test) return;
    const t = zaman() + 0.012 + (gecik || 0);
    const enAz = C8_ENAZ[ad] != null ? C8_ENAZ[ad] : K7_ENAZ[ad] != null ? K7_ENAZ[ad] : ad === 'senlikFener' || ad === 'halkaNota' || ad === 'fisek' ? 0.12 : ad === 'halkaHiz' || ad === 'halkaFinalSicrama' || ad === 'senlikDoruk' ? 3 : ad === 'midilli' || ad === 'sovalye' ? 0.5 : ad === 'kopruIndi' || ad === 'senlikFinal' || ad === 'halkaBasla' || ad === 'halkaBitti' ? 3 : ad === 'midilliZipla' ? 0.25 : ad === 'ankaYumurta' ? .55 : ad === 'ankaTuy' ? .13 : ad === 'ankaUyanis' ? 8 : ad === 'adim' ? 0.1 : ad === 'horlama' ? 1 : ad === 'fener' || ad === 'sarki' || ad === 'isiltiTopla' || ad === 'vatozKemer' ? 0.03 : ad === 'denizHamle' ? 0.15 : ad === 'suAkinti' ? 0.75 : ad === 'sekilOv' ? 0.12 : ad === 'kuzuMee' ? 0.6 : ad === 'ucusIn' || ad === 'ucusBasla' || ad === 'gokkusagiTamam' || ad === 'gokkusagiBasla' || ad === 'kayma' || ad === 'pirilBuyu' || ad === 'isiltiTamam' ? 1.5 : 0.09;
    const sk = anahtar || ad;
    if (sonCal[sk] && t - sonCal[sk] < enAz) return;
    sonCal[sk] = t; if (anahtar) sonCal[ad] = t;
    SFX[ad](t, v == null ? 1 : v);
  }
  function olaySes(ad, v, gecik) { sonOlay = performance.now(); cal(ad, v, gecik); }
  // pofuduk.js horlamayı kendi çizimine eşli çağırır ("HORR-PUF" anında): biz "puf"u hemen çalarız, bir sonraki
  // nefesin "hrrr"ını da ölçülen periyoda göre önceden başlatırız (puf'a tam yetişsin).
  let horSon = 0, horPer = 0, horZ = null;
  function disHorlama(v) {
    const t = zaman(), yakin = d0 ? Math.max(0.35, d0.uykuYakin) : 1;
    horlamaDis = t + 8;
    const ara = t - horSon; horSon = t;
    if (ara > 1.5 && ara < 9) horPer = horPer ? horPer * 0.5 + ara * 0.5 : ara;
    if (sonCal.horPuf && t - sonCal.horPuf < 0.8) return;
    sonCal.horPuf = t; if (ac.state === 'running' || test) SFX.horPuf(t + 0.01, (v || 1) * yakin);
    if (horZ) clearTimeout(horZ);
    if (horPer && !test) {
      const sure = horPer * 0.5;
      horZ = setTimeout(() => {
        horZ = null;
        if (!ac || ac.state !== 'running' || (buyukPof && buyukPof.uyandi) || typeof DURUM === 'undefined' || DURUM !== 'oyun') return;
        horAl(zaman() + 0.02, sure, (v || 1) * yakin);
      }, Math.max(0, (horPer - sure - 0.02) * 1000));
    }
  }
  let hapsuDis = -1, hapsuZ = null;
  function sfx(k, v) {
    if (k === 'bloom' && v === 0) {   // sahne.js göz kırpınca: 'goz_kirp' olayı geldiyse onun çelestası yeter
      if (performance.now() - kirpT < 600) return;
      setTimeout(() => { if (performance.now() - kirpT > 700) cal('parilti', 1); }, 60);
      return;
    }
    let ad = AD[k] || (bolum5() && /^(bolum5Basla|korUyandi|buharZip|volkanKristal|volkanCicekSec|volkanCicekNefes|volkanCicekAc|volkanYemTut|volkanYavruBesle|volkanYavruUctu|ankaYumurta|ankaTuy|ankaUyanis|volkanMiniTamam|lavSalBasla|lavSalAn|lavSalBitti|volkanFinalBasla|volkanTamam)$/.test(k) ? k : null);
    if (!ad && bolum6() && /^(bolum6Basla|senlikFener|sovalye|halkaNota|halkaBasla|halkaBitti|midilli|midilliZipla|kopruIndi|senlikFinal|halka|sovalyeSelam|midilliUyandi|halkaHiz|halkaFinalSicrama|senlikDoruk|fisek)$/.test(k) && ac) ad = k === 'halka' ? 'halkaNota' : k === 'sovalyeSelam' ? 'sovalye' : k === 'midilliUyandi' ? 'midilli' : k;
    if (!ad && bolum7() && /^(bolum7Basla|karFener|kFener|yavruUyandi|kYavru|kZipla|kardanBasla|kardanTop|kardanParca|kardanCanlan|kardanBitti|geyikTanis|kizakHiz|kizakKristal|kizakFinalSicrama|kizakInis|kizakUc|kizakIn|kizakBasla|kizakTane|kizakZipla|kizakBitti|kuzeyFinal|kuzeyDoruk|kuzeyTamam|golKay)$/.test(k) && ac) ad = k === 'karFener' ? 'kFener' : k === 'yavruUyandi' ? 'kYavru' : k === 'kardanBitti' ? 'kardanCanlan' : k;
    if (!ad && bolum8() && C8_SFX.test(k) && ac) ad = k;
    if (!ad || !ac) return;
    if (bolum8() && ad === 'iskeletNota') { const i = cl(Math.round(Number.isFinite(v) ? v : v && Number.isFinite(v.i) ? v.i : 0), 0, 5); cal(ad, i, 0, 'iskeletNota' + i); return; }   // hızlı dokunuşta farklı notalar birbirini yutmasın
    if (bolum8() && ad === 'kemikTakir' && v == null) v = { cok: 1 };
    if (ad === 'fener' && bolum6()) ad = 'senlikFener';   // Bölüm 6 fenerleri: sıcak çan (Bölüm 1'in final fenerleri değil)
    if (ad === 'su' && bolum3()) ad = 'bulutDus';   // Bölüm 3'te su yok
    if (ad === 'zipla' && bolum4()) ad = 'suAkinti'; // Bölüm 4'te zıplama yerine ışıklı akıntı süzülüşü
    if (v == null && (ad === 'isiltiTopla' || ad === 'kuzuRenk' || ad === 'gokkusagiParca')) v = { oto: 1 };   // sıra verilmediyse kendi sayacımız
    if (ad === 'puf' && performance.now() - sarsintiT < 250) return;   // 'sarsinti' inişi: onun "bumf"u yeter
    if (ad === 'horlama') { disHorlama(v); return; }
    if (ad === 'hapsu') { hapsuDis = performance.now(); if (hapsuZ) { clearTimeout(hapsuZ); hapsuZ = null; } }
    if (ESKI[k]) {   // eski çağrı: hemen ardından aynı olay gelirse olay sesi yeter
      const t0 = performance.now();
      setTimeout(() => { if (sonOlay < t0 - 5) cal(ad, k === 'bloom' && v ? 1 : v); }, 30);
      return;
    }
    cal(ad, v);
  }

  // ───────────────────────── olaylar ─────────────────────────
  // Bölüm 8 olay yedeği: efekt AU.sfx ile yakın zamanda çaldıysa (ya da gec sn içinde çalarsa) olay sessiz kalır; pen = tekrar penceresi (sn)
  function c8Yedek(ad, v, gec, pen) {
    if (!ac) return;
    const t0 = zaman(); pen = pen || Math.max(1, gec + 0.6);
    if (sonCal[ad] && t0 - sonCal[ad] < pen) return;
    if (test) { cal(ad, v); return; }
    setTimeout(() => { if (!ac) return; if (!sonCal[ad] || zaman() - sonCal[ad] > pen) { sonOlay = performance.now(); cal(ad, v); } }, gec * 1000);
  }
  function olaylariBagla() {
    if (typeof OLAY === 'undefined') return;
    OLAY.on('bolum5Basla', () => { if (bolum5()) olaySes('bolum5Basla'); });
    // Bölüm 6 (src/BOLUM6.md): fener · midilliUyandi · sovalyeSelam · halkaBasla · halka {n} · halkaBitti · kopruIndi · senlikFinal
    OLAY.on('midilliUyandi', e => { if (!bolum6()) return; s6Midilli = Math.max(s6Midilli + 1, e && Number.isFinite(e.n) ? e.n : 0); olaySes('midilli', e); });
    OLAY.on('sovalyeSelam', e => { if (bolum6()) olaySes('sovalye', e); });
    OLAY.on('halkaBasla', () => { if (!bolum6()) return; s6Mini = true; s6MiniT0 = zaman(); s6HalkaSon = 0; s6Hiz = false; s6SicT = -1e9; olaySes('halkaBasla'); });
    OLAY.on('halkaHiz', () => { if (!bolum6() || s6Hiz) return; s6Hiz = true; s6HizT = zaman(); olaySes('halkaHiz'); });
    OLAY.on('halkaFinalSicrama', () => { if (!bolum6() || s6SicT > -1e8) return; s6SicT = zaman(); s6Hiz = true; s6Tut(); olaySes('halkaFinalSicrama'); });
    OLAY.on('senlikDoruk', () => { if (!bolum6() || s6DorukT > -1e8) return; s6DorukT = zaman(); if (progAd !== 'senlikFinal') return; if (s6DorukBar >= 0) s6DorukVurgu = true; olaySes('senlikDoruk'); });
    OLAY.on('fisek', e => { if (bolum6() || bolum8()) olaySes('fisek', e); });
    OLAY.on('halka', e => { if (bolum6()) olaySes('halkaNota', e); });
    OLAY.on('halkaBitti', () => { if (!bolum6()) return; s6Mini = false; s6Hiz = false; olaySes('halkaBitti'); });
    OLAY.on('kopruIndi', () => { if (!bolum6()) return; s6Kopru = true; s6Mini = false; olaySes('kopruIndi'); });
    OLAY.on('senlikFinal', e => {
      if (!bolum6()) return;
      if (!s6Final) { s6FinalT0 = zaman(); if (e && Number.isFinite(e.duration) && e.duration > 5) s6FinalSure = e.duration; }
      s6Final = true; s6Mini = false; s6Hiz = false; olaySes('senlikFinal');
    });
    // Bölüm 7 (src/BOLUM7.md): karFener · yavruUyandi · ziplatti {tip:'karYavru'} · kardanBasla/Top/Parca/Bitti · kizakBasla/Tane/Zipla/Bitti ·
    // kuzeyFinal {duration} · kuzeyDoruk · kuzeyTamam · golKay {hiz} (isteğe bağlı; yoksa P'deki buz bayrağından izlenir)
    OLAY.on('karFener', e => { if (!bolum7()) return; k7Fener = Math.max(k7Fener + 1, e && Number.isFinite(e.n) ? e.n : 0); olaySes('kFener', { n: k7Fener, x: e && e.x, pan: e && e.pan }); });
    OLAY.on('yavruUyandi', e => { if (!bolum7()) return; k7Yavru = Math.max(k7Yavru + 1, e && Number.isFinite(e.n) ? e.n : 0); olaySes('kYavru', { n: k7Yavru, x: e && e.x, pan: e && e.pan }); });
    OLAY.on('kardanBasla', () => { if (!bolum7() || k7Kardan) return; k7Kardan = true; k7KardanT0 = zaman(); k7KardanN = 0; olaySes('kardanBasla'); });
    OLAY.on('kardanTop', e => { if (bolum7()) olaySes('kardanTop', e); });
    OLAY.on('kardanParca', e => { if (bolum7()) olaySes('kardanParca', e); });
    OLAY.on('kardanCanlan', () => { if (!bolum7()) return; k7CanlanT = zaman(); olaySes('kardanCanlan'); });
    OLAY.on('kardanBitti', () => { if (!bolum7()) return; k7Kardan = false; if (zaman() - k7CanlanT > 12) olaySes('kardanCanlan'); });   // canlanma olayı gelmediyse fanfar burada
    OLAY.on('kizakBasla', () => { if (!bolum7() || k7Kizak) return; k7Kizak = true; k7Kardan = false; k7KizakT0 = zaman(); k7TaneSon = 0; k7KizakHiz = false; k7SicT = -1e9; k7Ucus = false; k7UcusN = 0; olaySes('kizakBasla'); });
    OLAY.on('kizakTane', e => { if (bolum7()) olaySes('kizakTane', e); });
    OLAY.on('kizakZipla', e => { if (bolum7()) olaySes('kizakZipla', { hava: !!(e && e.hava) }); });
    OLAY.on('kizakHiz', () => { if (!bolum7() || k7KizakHiz) return; k7KizakHiz = true; k7KizakHizT = zaman(); olaySes('kizakHiz'); });
    OLAY.on('kizakUc', e => { if (!bolum7() || k7Ucus) return; k7Ucus = true; k7UcusN = Math.max(k7UcusN + 1, e && Number.isFinite(e.n) ? e.n : 0); k7UcusT0 = zaman(); olaySes('kizakUc', { n: k7UcusN }); });
    OLAY.on('kizakIn', () => { if (!bolum7() || !k7Ucus) return; k7Ucus = false; olaySes('kizakIn'); });
    OLAY.on('kizakKristal', e => { if (bolum7()) olaySes('kizakKristal', e); });
    OLAY.on('kizakKacti', () => { if (bolum7()) olaySes('kizakKacti'); });
    OLAY.on('kizakFinalSicrama', () => { if (!bolum7() || k7SicT > -1e8) return; k7SicT = zaman(); k7KizakHiz = true; k7Tut(); olaySes('kizakFinalSicrama'); });
    OLAY.on('kizakInis', e => { if (!bolum7()) return; if (e && e.buyuk) { k7InisT = zaman(); olaySes('kizakInis'); } else olaySes('kizakKucukInis'); });
    OLAY.on('kizakBitti', () => { if (!bolum7()) return; k7Kizak = false; k7KizakHiz = false; k7Ucus = false; if (zaman() - k7InisT > 8) olaySes('kizakInis'); else olaySes('kizakBitti'); });   // büyük iniş olayı gelmediyse glissando burada
    OLAY.on('geyikTanis', e => { if (bolum7()) olaySes('geyikTanis', e); });
    OLAY.on('kuzeyFinal', e => {
      if (!bolum7()) return;
      if (!k7Final) { k7FinalT0 = zaman(); if (e && Number.isFinite(e.duration) && e.duration > 5) k7FinalSure = e.duration; }
      k7Final = true; k7Kardan = false; k7Kizak = false; olaySes('kuzeyFinal');
    });
    OLAY.on('kuzeyDoruk', () => { if (!bolum7() || k7DorukT > -1e8) return; k7DorukT = zaman(); if (progAd === 'kuzeyFinal' && k7DorukBar < 0) olaySes('kuzeyDoruk'); });
    OLAY.on('kuzeyTamam', () => { if (bolum7()) olaySes('kuzeyTamam'); });
    for (const ad of ['golKay', 'buzKay', 'buzKayma']) OLAY.on(ad, e => { if (bolum7()) k7KayIzle(zaman(), e && Number.isFinite(e.hiz) ? cl(e.hiz, 0.3, 1) : 0.7, true); });
    // Bölüm 8 (src/BOLUM8.md): efektler asıl AU.sfx ile çalar; olaylar müziğin durumunu tutar ve efekt çağrılmadıysa yedek olarak çalar (c8Yedek)
    OLAY.on('kostumSec', e => { if (bolum8()) c8Yedek('kostumPuf', e && e.ad, 0.3); });
    OLAY.on('kabakFener', e => { if (!bolum8()) return; c8Fener = Math.max(c8Fener + 1, e && Number.isFinite(e.n) ? e.n : 0); c8Yedek('kabakFener', { n: c8Fener, x: e && e.x, pan: e && e.pan }, 0.12, 0.6); });
    OLAY.on('hayaletBuldu', e => { if (!bolum8()) return; c8Hay = Math.max(c8Hay + 1, e && Number.isFinite(e.n) ? e.n : 0); c8Yedek('hayaletCee', e && e.o, 0.3); });
    OLAY.on('kabakYuzBasla', () => { if (!bolum8() || c8Yuz) return; c8Yuz = true; c8YuzT0 = zaman(); });
    OLAY.on('kabakYuzParca', e => { if (bolum8()) c8Yedek('kabakYuzParca', e, 0.3, 0.6); });
    OLAY.on('kabakYuzCanlan', () => { if (bolum8()) c8Yedek('kabakYuzCanlan', 1, 0.3); });
    OLAY.on('kabakYuzBitti', () => { if (!bolum8()) return; c8Yuz = false; c8YuzTamam = true; });
    // iskelet: 'iskeletBasla' anı = ISKELET'in 1. ölçüsünün 1. vuruşu → eşlik ölçüleri bu ana hizalanır (c8Uz); akor cümleyi izler ('iskeletNota' {n})
    OLAY.on('iskeletBasla', () => { if (!bolum8() || c8Isk) return; c8Isk = true; c8IskT0 = zaman(); c8IskHiza = true; c8IskN = 0; c8IskFin = -1e9; c8IskTada = false; });
    OLAY.on('iskeletNota', e => {
      if (!bolum8()) return;
      if (e && Number.isFinite(e.n)) c8IskN = Math.max(c8IskN, e.n);
      if (e && Number.isFinite(e.i)) { const i = cl(Math.round(e.i), 0, 5); cal('iskeletNota', i, 0, 'iskeletNota' + i); }
    });
    OLAY.on('iskeletSerbest', e => { if (bolum8() && e && Number.isFinite(e.i)) { const i = cl(Math.round(e.i), 0, 5); cal('iskeletNota', i, 0, 'iskeletNota' + i); } });
    OLAY.on('iskeletBitti', () => {
      if (!bolum8()) return;
      if (c8IskFin < -1e8) c8IskFin = zaman();   // büyük dans efekti gelmediyse eşlik yine sussun, "ta-da" burada
      if (!c8IskTada) cal('iskeletDans', 6);
      c8Isk = false; c8IskTamam = true; c8IskBittiT = zaman();
    });
    OLAY.on('sekerKapi', e => { if (bolum8()) c8Kapi = Math.max(c8Kapi + 1, e && Number.isFinite(e.n) ? e.n : 0); });
    OLAY.on('kazanBasla', () => { if (!bolum8() || c8Kazan) return; c8Kazan = true; c8KazanT0 = zaman(); c8KazanN = 0; });
    OLAY.on('kazanMalzeme', e => { if (bolum8()) c8Yedek('kazanMalzeme', e, 0.3, 0.6); });
    OLAY.on('kazanBitti', () => { if (!bolum8()) return; c8Kazan = false; c8KazanTamam = true; });
    OLAY.on('supurgeBasla', () => { if (!bolum8() || c8Ucus) return; c8Ucus = true; c8UcusT0 = zaman(); c8UcusB0 = -1; c8AyB0 = -1; c8AyT = -1e9; c8KoyT = -1e9; c8SupSon = 0; });
    OLAY.on('supurgeAy', () => { if (bolum8() && c8AyT < -1e8) c8AyT = zaman(); });
    OLAY.on('supurgeKoy', () => { if (bolum8() && c8KoyT < -1e8) c8KoyT = zaman(); });
    OLAY.on('supurgeSeker', e => { if (bolum8()) c8Yedek('supurgeSeker', e && Number.isFinite(e.n) ? e.n : 1, 0.06, 0.12); });
    OLAY.on('supurgeBitti', () => { if (!bolum8()) return; c8Ucus = false; c8UcusBittiT = zaman(); c8Yedek('supurgeInis', 1, 0.5, 4); });
    // final: 'cadiFinal' anı = finalin saati (kabak.js o.age, cadiFinalNabiz) → müzik ölçüleri c8FinT0 + 2·k sn'ye hizalanır
    OLAY.on('cadiFinal', e => {
      if (!bolum8()) return;
      if (!c8Final) { c8FinT0 = zaman(); c8FinHiza = -1; c8DorukB = -1; c8SonB = -1; c8SonIste = false; c8DorukT = -1e9; }
      if (e && Number.isFinite(e.duration) && e.duration > 8) c8FinSure = e.duration;
      c8Final = true; c8Ucus = false; c8Kazan = false; c8Isk = false; olaySes('cadiFinal');
    });
    OLAY.on('cadiDoruk', () => { if (!bolum8()) return; if (c8DorukT < -1e8) c8DorukT = zaman(); olaySes('cadiDoruk'); });
    OLAY.on('cadiTamam', () => { if (bolum8()) olaySes('cadiTamam'); });
    OLAY.on('korUyandi', e => { if (!bolum5()) return; vBahce = Math.min(3, vBahce + 1); olaySes('korUyandi', e); });
    OLAY.on('buharZip', e => { if (bolum5()) olaySes('buharZip', e); });
    OLAY.on('volkanMiniBasla', () => { if (bolum5()) vMini = true; });
    // Bahçeler ve Anka etkinliğinde normal dünya bestesi korunur; yalnız gerçek eylemler cevap verir.
    OLAY.on('volkanKristal', e => { if (bolum5()) olaySes('volkanKristal', e); });
    OLAY.on('volkanCicekSec', e => { if (bolum5()) olaySes('volkanCicekSec', e); });
    OLAY.on('volkanCicekNefes', e => { if (bolum5()) olaySes('volkanCicekNefes', e); });
    OLAY.on('volkanCicekAc', e => { if (bolum5()) olaySes('volkanCicekAc', e); });
    OLAY.on('volkanYemTut', e => { if (bolum5()) olaySes('volkanYemTut', e); });
    OLAY.on('volkanYavruBesle', e => { if (bolum5()) olaySes('volkanYavruBesle', e); });
    OLAY.on('volkanYavruUctu', e => { if (bolum5()) olaySes('volkanYavruUctu', e); });
    OLAY.on('ankaYumurta', e => { if (bolum5()) olaySes('ankaYumurta', e); });
    OLAY.on('ankaTuy', e => { if (!bolum5()) return; vMiniAsama = 2; olaySes('ankaTuy', e); });
    OLAY.on('ankaUyanis', e => { if (!bolum5()) return; vMiniAsama = 3; olaySes('ankaUyanis', e); });
    OLAY.on('volkanMiniAsama', e => { if (bolum5()) vMiniAsama = e && e.stage || 1; });
    OLAY.on('volkanMiniTamam', e => { if (!bolum5()) return; vMini = false; vMiniAsama = 3; olaySes('volkanMiniTamam', e); });
    OLAY.on('lavSalBasla', () => { if (!bolum5()) return; vSal = true; vSalT0 = zaman(); olaySes('lavSalBasla'); });
    OLAY.on('lavSalAn', e => { if (bolum5()) olaySes('lavSalAn', e); });
    OLAY.on('lavSalBitti', () => { if (!bolum5()) return; vSal = false; olaySes('lavSalBitti'); });
    OLAY.on('volkanFinalBasla', () => { if (!bolum5()) return; vFinal = true; vMini = false; olaySes('volkanFinalBasla'); });
    OLAY.on('volkanTamam', () => { if (bolum5()) olaySes('volkanTamam'); });
    OLAY.on('denizati', () => { if (typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 4) { denizDostSay++; olaySes('denizZafer'); } });
    OLAY.on('ahtapotTamam', () => { if (bolum4()) olaySes('inciUyan'); });
    OLAY.on('vatozBasla', () => { if (bolum4()) olaySes('denizHamle'); });
    OLAY.on('vatozBitti', () => { if (bolum4()) olaySes('denizati'); });
    OLAY.on('denizHamle', () => olaySes('denizHamle'));
    OLAY.on('suAkinti', e => olaySes('suAkinti', e));
    OLAY.on('vatozKemer', e => olaySes('vatozKemer', e));
    OLAY.on('bolum4Basla', () => olaySes('bolum4Basla'));
    OLAY.on('ahtapotKol', () => olaySes('ahtapotKol'));
    OLAY.on('inciUyan', () => olaySes('inciUyan'));
    OLAY.on('inciDostlar', () => olaySes('inciDostlar'));
    OLAY.on('inciDalga', () => olaySes('inciDalga'));
    OLAY.on('inciDoruk', () => olaySes('inciDoruk'));
    OLAY.on('ziplama', () => olaySes('zipla'));
    OLAY.on('ciftZiplama', () => olaySes('cift'));
    OLAY.on('inis', e => { adimMesafe = 0; adimYuzey = yuzeyBul(e); olaySes('inis', cl(((e && e.siddet) || 500) / 900, 0.15, 1)); });
    // feza.js ayak yere bastığı karede 'adim' {x,y,hiz} yayar → o varken mesafeye göre adım sayımı susar
    OLAY.on('adim', e => {
      adimOlayT = performance.now(); adimYuzey = yuzeyBul(e);
      const h = e && e.hiz != null ? Math.abs(e.hiz) : 250;
      if (h < 15) return;
      cal('adim', cl(0.4 + h / 450, 0.45, 1) * (e && e.inis ? 0.6 : 1));   // inis: parmak ucuyla yumuşak konuş
    });
    OLAY.on('sahneAn', e => { const ad = e && (e.ad || e); if (typeof ad === 'string') sahneAn(ad, e && e.mod); });
    OLAY.on('ziplatti', o => { if (bolum7() && o && /yavru/i.test(o.tip || '')) { olaySes('kZipla'); return; } if (bolum6() && o && /midilli/i.test(o.tip || '')) { olaySes('midilliZipla'); return; } if (o && /hayvan/i.test(o.tip || '')) olaySes('hayvanZipla'); else olaySes('boing', o && o.tip === 'buyukPofuduk' ? 2 : 1); });
    // Bölüm 2 (src/BOLUM2.md): 'yildiz' {o} uyanış · 'yildizYerlesti' gökte yerleşme · 'hayvanUyandi' · 'yildizTasi' basış · 'hayvanAsama' {asama} (isteğe bağlı)
    OLAY.on('yildiz', o => {
      if (o && (o.hayvan || /hayvan/i.test(o.tip || ''))) { olaySes('hayvanAsama', { asama: o.asama || 1 }); return; }
      olaySes('yildizUyan');   // yükseliş ışıltısı: yildiz.js yükselmeye başlayınca AU.sfx('yildizYuksel') çağırır
    });
    OLAY.on('yildizYerlesti', () => olaySes('yildizYerles'));
    OLAY.on('hayvanAsama', e => { yHayvanA = Math.max(yHayvanA, Math.min(3, (e && e.asama) || 1)); olaySes('hayvanAsama', e); });
    OLAY.on('hayvanFirlat', () => olaySes('hayvanZipla'));
    OLAY.on('hayvanHazir', () => olaySes('hayvanUyan'));
    OLAY.on('hayvanUyandi', () => { yBitti = true; yOzelT = zaman(); olaySes('hayvanUyandi'); });
    OLAY.on('yildizTasi', e => olaySes('yildizTasi', e));
    OLAY.on('bolumGecis', () => olaySes('bolumGecis'));
    OLAY.on('bolum2Basla', () => olaySes('bolum2Basla'));
    OLAY.on('bolum3Basla', () => olaySes('bolum3Basla'));
    for (const ad of ['yatagaGir', 'yastik', 'lambaKis', 'uykuNefes', 'sabahKus', 'gerinme', 'fezaEsne', 'gozKirp']) OLAY.on(ad, e => olaySes(ad, e));
    OLAY.on('secim', e => { baslikSec = true; olaySes('secim', e); });   // başlık müziği yumuşakça kısılır; yeni sahne gelince açılır
    OLAY.on('secimIlgi', () => setTimeout(() => { if (!sonCal.secim || zaman() - sonCal.secim > 0.6) baslikIlgi(); }, 110));
    OLAY.on('ruyayaGec', () => { olaySes('ruyayaGec'); ninniKaydet(); });
    OLAY.on('yildizRozet', () => olaySes('yildizRozet'));
    OLAY.on('uyandi', o => {
      if (o && o.tip === 'buyukPofuduk') { olaySes('buyukUyandi'); return; }
      // pofuduk.js hapşırığı kendi karesinde çağırır; biz önce "puf", sonra "ha…" nefesi, en sonda uyanma zili.
      // Dışarıdan hapşu gelmezse 1.1 sn sonra kendimiz hapşırırız.
      olaySes('puf'); olaySes('hapsuAl', 1, 0.5); olaySes('uyanma', 1, 1.35);
      const t0 = performance.now();
      if (hapsuZ) clearTimeout(hapsuZ);
      hapsuZ = setTimeout(() => { hapsuZ = null; if (hapsuDis < t0) cal('hapsu', 1); }, 1100);
    });
    OLAY.on('carpti', o => { if (o && (o.tip === 'pofuduk' || o.tip === 'buyukPofuduk') && !o.uyandi) olaySes('mmf'); });
    OLAY.on('tohum', () => olaySes('tohum'));
    // Pırıl'ın ışık nefesi: piril.js 'nefes' {asama:'al'|'ver'} yayar; gelmezse karanlığa dokununca yedek ses
    let nefesGeldi = -1e9;
    OLAY.on('nefes', e => { const a = e && e.asama; if (a === 'al') { nefesGeldi = performance.now(); olaySes('nefesAl'); } else if (a === 'ver') { nefesGeldi = performance.now(); olaySes('nefes'); } else if (a === 'basla') nefesGeldi = performance.now(); });
    OLAY.on('dokun:karanlik', () => { const t0 = performance.now(); setTimeout(() => { if (nefesGeldi < t0) cal('nefes'); }, 1500); });
    OLAY.on('aydinlat', () => olaySes('nilufer'));
    OLAY.on('dustu', () => olaySes(bolum3() ? 'bulutDus' : 'su'));   // Bölüm 3'te göl yok: buluttan düşüş
    OLAY.on('kurtarildi', () => olaySes('kurtar'));
    OLAY.on('cicek', () => olaySes('cicek'));
    OLAY.on('buyukAsama', e => { const a = e && e.asama; if (a) asama = Math.max(asama, a); olaySes(a === 1 ? 'goz' : a === 2 ? 'esneme' : 'kalk'); });
    OLAY.on('agac', () => { olaySes('agac'); finaleGir(); });
    OLAY.on('fener', e => {
      if (bolum6()) { s6Fener = Math.max(s6Fener + 1, e && Number.isFinite(e.n) ? e.n : 0); olaySes('senlikFener', { n: s6Fener, pan: e && e.pan }); return; }
      olaySes('fener', { i: e && e.i, x: e && e.x });
    });
    OLAY.on('yildizIz', () => olaySes('yildizIz'));
    OLAY.on('sarsinti', e => { sarsintiT = performance.now(); olaySes('bumf', e && e.guc != null ? e.guc : 0.5); });
    // Bölüm 3 (src/BOLUM3.md): aynı adlı olaylar da dinlenir; AU.sfx ile aynı anda gelirse bir kez çalar (cal: sonCal)
    const sayi = e => typeof e === 'number' ? e : null;
    // olay, efektten farklı anda gelebilir (kuzu.js: 'kuzu' sarılma başında, kuzuRenk renk dalgasında; bulut.js: gokkusagiTamam parlamada, olay kaymadan sonra):
    // o zaman olay yalnız yedektir – efekt 'pencere' sn içinde (önce ya da sonra) çalmadıysa çalar
    const yedek = (ad, v, pencere, gec) => { const t0 = zaman(); if (sonCal[ad] && t0 - sonCal[ad] < pencere) return; setTimeout(() => { if (!ac) return; if (!sonCal[ad] || zaman() - sonCal[ad] > pencere) { sonOlay = performance.now(); cal(ad, v); } }, gec * 1000); };
    OLAY.on('bulutZip', e => olaySes('bulutZip', sayi(e) != null ? e : e && typeof e.v === 'number' ? e.v : e && typeof e.guc === 'number' && e.guc <= 1.5 ? e.guc : 0.7));
    OLAY.on('esinti', () => olaySes('esinti'));
    OLAY.on('gokkusagiParca', e => olaySes('gokkusagiParca', sayi(e) != null ? e : e && e.renkI));
    OLAY.on('gokkusagiBasla', () => { gBasladi = true; olaySes('gokkusagiBasla'); });
    OLAY.on('gokkusagiTamam', () => { gBasladi = true; yedek('gokkusagiTamam', 1, 25, 0.05); });
    OLAY.on('kayma', () => { if (bolum7()) { k7KayIzle(zaman(), 0.7, true); return; } olaySes('kayma'); });   // Bölüm 7: buzlu gölde süzülme
    OLAY.on('kuzu', e => { kuzuSay++; yedek('kuzuRenk', e && typeof e.renkI === 'number' ? e.renkI : kuzuSay - 1, 1.2, 0.9); });
    OLAY.on('kuzuMee', e => olaySes('kuzuMee', e));
    OLAY.on('ucusBasla', () => { ucusOlay = true; ucusT0 = zaman(); olaySes('ucusBasla'); });
    OLAY.on('pirilBuyu', () => olaySes('pirilBuyu'));
    OLAY.on('isilti', e => olaySes('isiltiTopla', sayi(e) != null ? e : e && typeof e.i === 'number' ? e.i : e && typeof e.sira === 'number' ? e.sira : { oto: 1 }));
    OLAY.on('ucusIn', () => olaySes('ucusIn'));
    OLAY.on('ucusBitti', () => { ucusOlay = false; setTimeout(() => { if (!sonCal.ucusIn || zaman() - sonCal.ucusIn > 3) cal('ucusIn'); }, 60); });   // iniş sesi gelmediyse
    OLAY.on('sekil', e => yedek('sekilCanlan', e && e.i != null && typeof e.hayvan !== 'string' ? e.i : e && e.hayvan != null ? e.hayvan : 0, 1, 0.1));
    OLAY.on('ucusKemer', () => yedek('kemer', 1, 0.5, 0.05));
    OLAY.on('sekilBitti', () => olaySes('sekilBitti'));
    OLAY.on('durum', d => durumDegisti(d));
  }
  // seçim ekranından rüyaya geçerken sayfa yeniden yüklenir: ninninin yerini sakla, yeni sayfada kaldığı cümleden sürsün
  function ninniKaydet() { try { if (progAd === 'ninni') sessionStorage.setItem('fezaNinni', JSON.stringify({ ad: ninniSira.ad, i: ninniSira.i, z: Date.now() })); } catch (e) {} }
  function ninniSur() {
    try {
      const v = JSON.parse(sessionStorage.getItem('fezaNinni') || 'null'); sessionStorage.removeItem('fezaNinni');
      if (v && PARCA[v.ad] && Date.now() - v.z < 20000 && progAd === 'ninni') { const i = ((v.i | 0) + 1) % PARCA[v.ad].length; ninniSira = i ? { ad: v.ad, i } : { ad: 'ana', i: 0 }; }
    } catch (e) {}
  }
  function finaleGir() { ruya = 0; if (mod !== 'final') { if (progAd === 'yildiz' && ac) padBirak(zaman()); mod = 'final'; if (!(bolum5() && progAd === 'volkanFinal') && !(bolum6() && progAd === 'senlikFinal') && !(bolum7() && progAd === 'kuzeyFinal') && !(bolum8() && progAd === 'cadiFinal')) { progAd = bolum8() ? 'cadiFinal' : bolum5() ? 'volkanFinal' : bolum6() ? 'senlikFinal' : bolum7() ? 'kuzeyFinal' : 'final'; pi = 0; bic = 0; } } }
  function durumDegisti(d) {
    if (d === 'oyun' || d === 'baslik' || d === 'giris') { baslikSec = false; ruya = 0; sabahKus = false; pirilBekle = false; }
    if (zorlaMod) return;
    if (d === 'giris') mod = 'ninni';   // Bölüm 2'nin kısa uyku girişi de ninniyle başlar; 'oyun' gelince ninni yumuşakça 'yildiz' müziğine geçer
    else if (d === 'baslik') mod = 'baslik';
    else if (d === 'oyun') mod = 'orman';
    else if (d === 'final') finaleGir();
    else if (d === 'son' && mod !== 'final') mod = 'ninni';
  }

  // ───────────────────────── karışım güncelleme ─────────────────────────
  let kisik = false, kisKim = 'p';
  function yildizEtkisi(k) {   // Bölüm 2 katman düzeyleri (yoS: yıldız oranı, yDoruk: doruk)
    const y = yoS, dr = yDoruk;
    switch (k) {
      case 'zil': return 0.8 + 0.2 * y;
      case 'pad': return 0.75 + 0.3 * y + 0.2 * dr;
      case 'tus': return 0.55 + 0.45 * y;
      case 'arp': return 0.4 + 0.6 * sm(0.08, 0.5, y);
      case 'tel': return sm(0.4, 0.8, y) * (0.75 + 0.35 * dr);
      case 'koro': return Math.max(sm(0.5, 0.85, y), alanH ? 0.5 : 0) * (0.8 + 0.6 * dr);
      case 'bas': return 0.65 + 0.35 * y;
      case 'su': return 1 - 0.45 * y;
      case 'soprano': return 0.8 + 0.3 * y + 0.35 * yukseklikS;
      default: return 1;
    }
  }
  function bulutEtkisi(k) {   // Bölüm 3 katman düzeyleri (koS: kuzucuk oranı, gDoruk: gökkuşağı doruğu)
    const c = koS, dr = gDoruk;
    switch (k) {
      case 'zil': return 0.8 + 0.2 * c;
      case 'pad': return 0.8 + 0.25 * c + 0.15 * dr;
      case 'tus': return 0.6 + 0.4 * c;
      case 'arp': return 0.7 + 0.3 * sm(0, 0.4, c);
      case 'flut': return 0.85 + 0.15 * c;
      case 'tel': return Math.max(sm(0.2, 0.7, c), ucusVar() ? 0.8 : 0) * (0.8 + 0.3 * dr);
      case 'koro': return sm(0.5, 0.9, c) * (0.7 + 0.6 * dr);
      case 'bas': return 0.7 + 0.3 * c;
      case 'soprano': return 0.75 + 0.35 * c + 0.4 * yukseklikS;
      default: return 1;
    }
  }
  function denizEtkisi(k) {   // Bölüm 4 katman düzeyleri (yuzmeS: yüzme hızı, denizDostSay: uyanan dostlar)
    const yz = yuzmeS, dost = Math.min(5, denizDostSay);
    switch (k) {
      case 'tus': return 0.88 + 0.35 * yz;
      case 'flut': return 0.82 + 0.35 * yz;
      case 'arp': return 0.92 + 0.3 * yz;
      case 'zil': return 0.85 + 0.35 * yz;
      case 'tel': return 0.72 + 0.15 * yz + 0.05 * dost;
      case 'koro': return 0.56 + dost * 0.08;
      case 'pad': return 0.95 + 0.15 * dost;
      case 'bas': return 0.72 + 0.25 * yz;
      case 'su': return 0.9 + 0.35 * yz;
      case 'soprano': return 0.7 + 0.25 * yz + 0.4 * yukseklikS;
      default: return 1;
    }
  }
  function volkanEtkisi(k, ob) {
    const sal = ob === 'lavsal', kalp = ob === 'volkanKalp' || ob === 'volkanFinal';
    const form = sal ? cl((zaman() - vSalT0) / 9, 0, 1) : vIsik;
    switch (k) {
      case 'pad': return .86 + form * .14;
      case 'tel': return .6 + form * .35 + (kalp ? .1 : 0);
      case 'koro': return kalp ? .95 : sal ? .55 + form * .4 : .2 + form * .55;
      case 'flut': return .88 + form * .12;
      case 'soprano': return .65 + form * .3;
      case 'bas': return .85 + form * .15;
      default: return 1;
    }
  }
  function kaleEtkisi(k, ob) {   // Bölüm 6 katman düzeyleri (s6S: fener oranı); halka ve finalde dolu
    const f = ob === 'kale' ? s6S : Math.max(s6S, ob === 'senlikFinal' ? 1 : 0.7);
    // final sıçrayışında müzik nefesini tutar (yalnız pad, koro ve çanlar); iniş/kale yumuşakça geri gelir
    if (s6TutVar() && (k === 'hop' || k === 'arp' || k === 'flut' || k === 'bas' || k === 'tus')) return k === 'bas' ? 0.25 : 0.1;
    if (ob === 'senlikFinal') {   // final bölümleri: dansta koro geride, dorukta tam; son ve sükûnda tef/arp çekilir
      const tur = s6FB.tur, m = tur === 'dans' ? { koro: 0.55, tel: 0.9, soprano: 0.9 } : tur === 'doruk' ? { koro: 1.2, tel: 1.12, soprano: 1.15, zil: 1.05 } : { hop: 0.25, arp: 0.7, koro: 0.75, tel: 0.85 };
      if (m[k] != null) return m[k];
    }
    if (ob === 'halkaKosu' && (k === 'tel' || k === 'soprano')) return 1.1;
    switch (k) {
      case 'zil': return 0.85 + 0.15 * f;
      case 'pad': return 0.8 + 0.2 * f;
      case 'tus': return 0.75 + 0.25 * f;
      case 'arp': return 0.75 + 0.25 * f;
      case 'tel': return 0.2 + 0.8 * sm(0.3, 0.85, f);
      case 'koro': return 0.1 + 0.9 * sm(0.55, 1, f);
      case 'bas': return 0.8 + 0.2 * f;
      case 'flut': return 0.88 + 0.12 * f;
      case 'soprano': return 0.6 + 0.4 * f;
      default: return 1;
    }
  }
  function kuzeyEtkisi(k, ob) {   // Bölüm 7 katman düzeyleri (k7S: fener oranı); mini oyunlarda ve finalde dolu
    const f = ob === 'kar' ? k7S : Math.max(k7S, ob === 'kuzeyFinal' ? 1 : 0.7);
    if (ob === 'kizakMini' && k7TutVar() && (k === 'hop' || k === 'arp' || k === 'bas' || k === 'tus')) return k === 'bas' ? 0.25 : 0.12;
    if (ob === 'kizakMini' && k7Ucus) { const b = k7UcusN >= 2 ? 1.25 : 1; const m = { tel: 1.2 * b, koro: 0.95 * b, soprano: 1.15 * b, pad: 1.1, hop: 0.7, arp: 1, flut: 1.4, bas: 0.8 }; if (m[k] != null) return m[k]; }
    if (ob === 'kizakMini' && k7KizakHiz && (k === 'tel' || k === 'soprano' || k === 'koro')) return k === 'koro' ? 0.8 : 1.1;
    if (ob === 'kuzeyFinal') {   // final bölümleri: dalgada koro geride, dorukta tam; son ve sükûnda arp ve çıngırak çekilir
      const tur = k7FB.tur, m = tur === 'dalga' ? { koro: 0.8, tel: 0.95, soprano: 0.95 } : tur === 'doruk' ? { koro: 1.25, tel: 1.15, soprano: 1.15, zil: 1.05, pad: 1.1 } : { hop: 0.2, arp: 0.7, koro: 0.7, tel: 0.85 };
      if (m[k] != null) return m[k];
    }
    switch (k) {
      case 'zil': return 0.88 + 0.12 * f;
      case 'pad': return 0.85 + 0.2 * f;
      case 'tus': return 0.7 + 0.3 * f;
      case 'arp': return 0.7 + 0.3 * f;
      case 'tel': return 0.15 + 0.85 * sm(0.25, 0.6, f);
      case 'koro': return 0.05 + 0.95 * sm(0.45, 0.85, f);
      case 'bas': return 0.75 + 0.25 * f;
      case 'soprano': return 0.6 + 0.4 * f;
      default: return 1;
    }
  }
  const s6TutVar = () => zaman() - s6SicT < 2.2;
  const k7TutVar = () => zaman() - k7SicT < 2.9;   // kızak final sıçrayışı (kizak.js KZK_SIC 2,8 sn): müzik havada asılı kalır
  function k7Tut() {
    if (!ac) return; const t = zaman();
    for (const ad of ['hop', 'arp', 'bas', 'tus']) if (B[ad]) { B[ad].gain.cancelScheduledValues(t); B[ad].gain.setValueAtTime(B[ad].gain.value, t); hedefle(B[ad].gain, B[ad].gain.value * (ad === 'bas' ? 0.25 : 0.12), t, 0.15); }
  }
  function s6Tut() {   // final sıçrayışı: katmanlar hemen (0,12 sn) kısılır; karisimGuncelle sonra aynı hedefi korur
    if (!ac) return; const t = zaman();
    for (const ad of ['hop', 'arp', 'flut', 'bas', 'tus']) if (B[ad]) { B[ad].gain.cancelScheduledValues(t); B[ad].gain.setValueAtTime(B[ad].gain.value, t); hedefle(B[ad].gain, B[ad].gain.value * (ad === 'bas' ? 0.25 : 0.1), t, 0.12); }
  }
  function cadiEtkisi(k, ob) {   // Bölüm 8 katman düzeyleri (c8S: fener oranı); mini oyunlarda, sokakta, uçuşta ve finalde dolu
    const f = ob === 'cadi' || ob === 'koru8' ? c8S : Math.max(c8S, ob === 'cadiFinal' ? 1 : 0.7);
    if (ob === 'cadiFinal') {   // final bölümleri: dansta koro geride, dorukta tam; son ve sükûnda ritim çekilir
      const tur = c8FB.tur, m = tur === 'doruk' ? { koro: 1.25, tel: 1.15, soprano: 1.15, pad: 1.1 } : tur === 'son' || tur === 'sukun' ? { hop: 0.3, sik: 0.3, klav: 0.6, koro: 0.7, tel: 0.85 } : { koro: 0.55, tel: 0.85 };
      if (m[k] != null) return m[k];
    }
    if (ob === 'supurgeMini' && c8UcusFB.tur === 'ay') { const m = { tel: 1.25, koro: 1.1, soprano: 1.2, pad: 1.15, hop: 0.5, sik: 0.3, klav: 0.4, tuba: 0.4, flut: 1.2 }; if (m[k] != null) return m[k]; }
    if (ob === 'iskeletMini' && (k === 'tel' || k === 'koro')) return 0.6;
    switch (k) {
      case 'zil': return 0.9 + 0.1 * f;
      case 'pad': return 0.8 + 0.25 * f;
      case 'tus': return 0.75 + 0.25 * f;
      case 'arp': return 0.6 + 0.4 * f;
      case 'tel': return 0.12 + 0.88 * sm(0.24, 0.62, f);
      case 'koro': return 0.04 + 0.96 * sm(0.5, 0.9, f);
      case 'bas': return 0.85 + 0.15 * f;
      case 'tuba': return 0.3 + 0.7 * sm(0.3, 0.5, f);
      case 'sik': return 0.35 + 0.65 * sm(0.05, 0.35, f);
      case 'klav': return 0.7 + 0.3 * f;
      case 'org': return 0.5 + 0.5 * sm(0.4, 0.8, f);
      case 'soprano': return 0.6 + 0.4 * f;
      default: return 1;
    }
  }
  // Bölüm 8 genel düzeyi (muzikG çarpanı; ölçüm: b8/test/MUZIK – Bölüm 7 ile aynı algılanan ses yüksekliği)
  function c8Duzey(ob) {
    return ob === 'cadi' ? 1.6 - 0.33 * c8S : ob === 'koru8' ? 0.95 - 0.15 * c8S : ob === 'kabakYuzMini' ? 1.3 : ob === 'iskeletMini' ? 1.75 : ob === 'sokak' ? 0.87
      : ob === 'kazanMini' ? 0.76 : ob === 'supurgeMini' ? 0.7 : ob === 'meydan8' ? 0.83 : ob === 'cadiFinal' ? 1.04 : 1;
  }
  function karisimGuncelle(t, d) {
    const ob = mod === 'final' && bolum8() ? 'cadiFinal' : mod === 'final' && bolum5() ? 'volkanFinal' : mod === 'final' && bolum6() ? 'senlikFinal' : mod === 'final' && bolum7() ? 'kuzeyFinal' : mod === 'orman' ? ormanAd(d) : mod;
    const k = KARISIM[ob] || KARISIM.patika;
    const r = mod === 'ninni' ? ruya : 0, kr = KARISIM.ruya, kk = (ad) => (k[ad] || 0) * (1 - r) + (kr[ad] || 0) * r;
    // Bölüm 2: yıldız oranı yumuşak izlenir (≈2.5 sn), doruk ayrıca
    yoS += ((yBitti ? 1 : Math.max(d.yo || 0, yHayvanA ? 0.55 + 0.13 * yHayvanA : 0)) - yoS) * 0.14;   // hayvan uyanırken (aşama 1–3) müzik de adım adım zenginleşir
    yDoruk += (((yBitti || yoS > 0.97) ? 1 : 0) - yDoruk) * 0.08;
    // Bölüm 3: kuzucuk oranı yumuşak izlenir, gökkuşağı başlayınca doruk
    koS += ((gBasladi ? 1 : (d.ko || 0)) - koS) * 0.12;
    gDoruk += ((gBasladi ? 1 : 0) - gDoruk) * 0.06;
    // Bölüm 4: yüzme hızı yumuşatılır (≈0.6 sn)
    yuzmeS += ((d.yuzme || 0) - yuzmeS) * 0.22;
    if (bolum6()) s6S += ((s6FinalMi() ? 1 : Math.min(1, s6Oran() + (s6Kopru ? 0.1 : 0))) - s6S) * 0.15;
    if (bolum7()) k7S += ((k7FinalMi() ? 1 : Math.min(1, k7Oran() + (v7Al('kardan') === true ? 0.04 : 0) + (v7Al('kizak') === true ? 0.04 : 0))) - k7S) * 0.15;
    if (bolum8()) c8S += ((c8FinalMi() ? 1 : Math.min(1, c8Oran() + (c8Tamam('kabakYuz') ? 0.03 : 0) + (c8Tamam('iskelet') ? 0.03 : 0) + (c8Tamam('kazan') ? 0.03 : 0))) - c8S) * 0.15;
    if (bolum5()) vIsik += ((.25 + vBahce * .17 + (vMiniAsama >= 3 ? .12 : 0) + (vFinal ? .5 : 0)) - vIsik) * .1;
    // İrtifa (Feza ağaç tepesinde veya gökyüzündeyken rüzgar ve soprano katmanları açılır)
    yukseklikS += ((d.yukseklik || 0) - yukseklikS) * 0.16;
    const b3 = ob === 'bulut' || ob === 'ucus', b5 = ob === 'lavsal' || ob.indexOf('volkan') === 0, b6 = !!S6_PROG[ob], b7 = !!K7_PROG[ob], b8 = !!C8_PROG[ob];
    const lEff = b8 ? 0.4 + 0.55 * c8S : b7 ? 0.4 + 0.55 * k7S : b6 ? 0.4 + 0.55 * s6S : b5 ? .45 + .5 * vIsik : ob === 'deniz' ? 0.65 + denizDostSay * 0.05 + 0.35 * yuzmeS : ob === 'yildiz' ? 0.3 + 0.7 * yoS : b3 ? 0.45 + 0.55 * koS : d.light;
    const l = d.light;
    const okM = ob === 'yildiz' || ob === 'deniz' || b3 || b5 || b6 || b8 ? 1 : 0;   // Bölüm 8: sıcak "oo" (hayaletimsi ama tatlı) alanH = d.alan === 'hayvan';
    for (const [g, gv, tur] of kForm) hedefle(g.gain, gv * (tur === 2 ? okM : 1 - okM), t, 1.5);
    // geçit: Feza yürürken tam, durunca (biraz gecikmeyle) kısık; Pofuduk sayısıyla 1–2 arası dolulaşır
    if (d.hareket) gecitHareket = t; const yuru = t - gecitHareket < 1.2 ? 1 : 0.3;
    for (const ad in TEMEL) {
      let v = TEMEL[ad] * kk(ad) * (b8 ? cadiEtkisi(ad, ob) : b6 ? kaleEtkisi(ad, ob) : b7 ? kuzeyEtkisi(ad, ob) : b5 ? volkanEtkisi(ad, ob) : ob === 'yildiz' ? yildizEtkisi(ad) : b3 ? bulutEtkisi(ad) : ob === 'deniz' ? denizEtkisi(ad) : isikEtkisi(ad, l, mod));
      if (ad === 'tuba' && mod === 'orman' && !b8) v = ob === 'aciklik' ? 1 : k.tuba;
      if (ad === 'hop' && mod !== 'final' && !b6 && !b7 && !b8) v *= cl((d.takip || 0) / 2, 0, 1) * yuru;
      if (ob === 'baslik') v *= (bslMix[ad] != null ? bslMix[ad] : 1) * (baslikSec ? 0.5 : 1);
      if (solo && solo !== ad) v = 0;
      hedefle(B[ad].gain, v, t, ad === 'hop' ? 0.5 : (b6 && s6TutVar()) || (b7 && k7TutVar()) ? 0.12 : 1.4);
    }
    hedefle(revMuzik.gain, 0.5 * kk('rev'), t, 2);
    hedefle(dly.fbG.gain, 0.3 + 0.12 * kk('dly'), t, 2);
    hedefle(dly.out.gain, 0.6 * kk('dly'), t, 2);
    hedefle(muzikG.gain, ob === 'baslik' && baslikSec ? 0.5 : b8 ? 0.77 * c8Duzey(ob) * (d.kapi8 ? 0.82 : 1) : b7 ? .77 * (ob === 'kuzeyFinal' ? 1.2 : ob === 'kar' ? 1.1 - 0.22 * k7S : ob === 'kizakMini' ? 0.92 : 1) : b6 ? .77 * (ob === 'senlikFinal' ? 1 : ob === 'kale' ? 1.1 - 0.24 * s6S : ob === 'halkaKosu' ? 0.95 : 1.12 - 0.3 * s6S) : b5 ? .77 : ob === 'yildiz' ? 0.8 * (1.1 - 0.4 * yoS) : b3 ? 0.8 * (1.06 - 0.22 * koS - 0.14 * gDoruk) : 0.8, t, 2);   // Bölüm 2 doruğu Bölüm 1'den yüksek kalmasın (ölçüm: ~−3 dB)
    hedefle(yalaG.gain, ob === 'yildiz' ? 0.012 : 0, t, 2.5);
    if (karG) hedefle(karG.gain, b7 ? (ob === 'kizakMini' ? 0.007 : ob === 'kuzeyFinal' ? 0.0022 : ob === 'kardanMini' ? 0.003 : 0.004) : 0, t, 2.5);   // kar hışırtısı (çok kısık)
    hedefle(B.telLP.frequency, 750 + 1100 * lEff + (mod === 'final' ? 700 : 0) + (ob === 'halkaKosu' || ob === 'kizakMini' || ob === 'supurgeMini' ? 500 : 0), t, 2);
    const ruzgarAlt = 1 + 0.7 * yukseklikS;
    hedefle(ruzgarG.gain, (mod === 'orman' ? (b8 ? (ob === 'supurgeMini' ? 0.02 : ob === 'koru8' ? 0.008 : 0.005) : b7 ? (ob === 'kizakMini' ? 0.02 : ob === 'kuzeyFinal' ? 0.005 : 0.009) : b6 ? (ob === 'halkaKosu' ? 0.017 : ob === 'halkaMini' ? 0.012 : 0.006) : b5 ? (vSal ? .012 : .007) : ob === 'yildiz' ? 0.011 : ob === 'ucus' ? 0.03 : ob === 'bulut' ? 0.016 : 0.018 * (1 - 0.5 * l) * (bolge === 'gol' ? 1.4 : 1)) : mod === 'ninni' ? 0.004 : mod === 'baslik' ? 0.002 : 0.008) * ruzgarAlt, t, 2);
  }
  function kis(acik, kim) {
    if (!ac) return;
    kisik = !!acik; kisKim = kim || 'p';
    const t = ac.currentTime;
    const hedefGain = acik ? (kim === 'a' ? 0.45 : 0.52) : 1;
    kisG.gain.cancelScheduledValues(t); kisG.gain.setValueAtTime(Math.max(0.0001, kisG.gain.value), t);
    kisG.gain.setTargetAtTime(hedefGain, t, acik ? 0.08 : 0.45);
    if (kisEQ) {
      kisEQ.gain.cancelScheduledValues(t); kisEQ.gain.setValueAtTime(kisEQ.gain.value, t);
      kisEQ.gain.setTargetAtTime(acik ? -4.5 : 0, t, acik ? 0.08 : 0.45);
    }
  }

  // ───────────────────────── zamanlayıcı ─────────────────────────
  const ILERI = 0.7;
  function tick() {
    // Otomatik oynatma engelindeyken ses saati durur. Burada önceden ölçü
    // planlamak, dokunuştan sonra bitmiş başlık/uyku sahnesini çaldırırdı.
    if (!ac || (!test && ac.state !== 'running')) return;
    const t = zaman();
    const d = okuFn();
    d0 = d;
    // bölge (1.2 sn kararlılık ister: zıplarken gidip gelmesin)
    if (d.bolge !== bolgeAday) { bolgeAday = d.bolge; bolgeAdayT = t; }
    else if (bolgeAday !== bolge && t - bolgeAdayT > 1.2) bolge = bolgeAday;
    if (d.durum === 'oyun' && mod === 'ninni' && !zorlaMod) mod = 'orman';
    if (sonrakiCubuk < t) sonrakiCubuk = t + 0.05;   // sekme uyurken geride kalınca atla
    if (bolum8()) c8BolgeIzle(t, d.alan8);
    while (sonrakiCubuk < t + ILERI) { cubukPlanla(sonrakiCubuk); sonrakiCubuk += cubukUz; }
    if (bolum7() && mod === 'orman' && d.kay7 > 0.15) k7KayIzle(t, d.kay7, false);   // buzlu gölde süzülme
    if (!test && (++tickN % 4 === 0)) karisimGuncelle(t, d);
    if (test && (++tickN % 4 === 0)) karisimGuncelle(t, d);
  }
  let tickN = 0;

  // adımlar: Feza'nın yürüdüğü yola göre (yosun üstünde yumuşak, sağ–sol)
  let adimMesafe = 0, sonKare = 0;
  function adimDongu(ms) {
    requestAnimationFrame(adimDongu);
    const dt = Math.min(0.05, (ms - sonKare) / 1000 || 0); sonKare = ms;
    if (!ac || typeof P === 'undefined' || typeof DURUM === 'undefined' || DURUM !== 'oyun') return;
    if (adimOlayT > -1e8) return;   // feza.js adımları kendisi gönderiyor: onlar yeter
    const hiz = Math.abs(P.vx || 0);
    if (P.ground && hiz > 40) {
      adimMesafe += hiz * dt;
      if (adimMesafe > 54) { adimMesafe = 0; adimYuzey = yuzeyBul(null); cal('adim', cl(0.45 + hiz / 450, 0.5, 1)); }
    } else if (!P.ground) adimMesafe = 40;   // inişten sonra ilk adım çabuk gelsin
  }

  // ───────────────────────── kurulum ─────────────────────────
  function yankiDarbe(sn) {     // koyulaşan kuyruklu stereo yankı (iki kanal farklı → geniş)
    const sr = ac.sampleRate, len = Math.floor(sr * sn), b = ac.createBuffer(2, len, sr);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c); let y = 0;
      for (let i = 0; i < len; i++) {
        const x = i / len, a = 0.65 - 0.55 * x;
        y += a * ((rnd() * 2 - 1) - y);
        d[i] = y * Math.pow(1 - x, 2.4) * (i < sr * 0.012 ? i / (sr * 0.012) : 1);
      }
    }
    return b;
  }
  function kur(ctx) {
    ac = ctx;
    cikis = ac.createGain(); cikis.gain.value = 0;
    limit = ac.createDynamicsCompressor();
    limit.threshold.value = -4; limit.knee.value = 2; limit.ratio.value = 20; limit.attack.value = 0.002; limit.release.value = 0.18;
    master = ac.createGain(); master.gain.value = 0.9;
    master.connect(limit); limit.connect(cikis); cikis.connect(ac.destination);
    // müzik: katmanlar → yapıştırıcı kompresör → kısma (konuşma) → master
    muzikG = ac.createGain(); muzikG.gain.value = 0.8;
    const yap = ac.createDynamicsCompressor(); yap.threshold.value = -20; yap.ratio.value = 2.5; yap.attack.value = 0.02; yap.release.value = 0.3; yap.knee.value = 8;
    kisG = ac.createGain(); kisG.gain.value = 1;
    kisEQ = suzgec('peaking', 2400, 1.0, null); kisEQ.gain.value = 0;
    // iPad hoparlörü ~150 Hz altını veremez: o bölgedeki enerji yalnız kompresörü/limiter'ı boşuna sıkıştırıyordu (ölçüm: toplam enerjinin yarısı
    // 150 Hz altındaydı). Daha derin raf + 50 Hz altı kesim: kulaklıkta hâlâ sıcak, hoparlörde orta bölge daha açık.
    const rafa = suzgec('lowshelf', 170, 0, null); rafa.gain.value = -7;
    const altKes = suzgec('highpass', 50, 0.6, null);
    muzikG.connect(altKes); altKes.connect(rafa); rafa.connect(yap); yap.connect(kisEQ); kisEQ.connect(kisG); kisG.connect(master);
    // sahne gürültüleri (parıltı "fışş"ları) yapıştırıcı kompresörü atlar: Chrome'da süzgeçli gürültünün başı orada tek örneklik çıt yapıyordu
    sahneHam = ac.createGain(); sahneHam.gain.value = 0.8; sahneHam.connect(kisG);
    sfxG = ac.createGain(); sfxG.gain.value = 0.85; sfxG.connect(master);
    sesG = ac.createGain(); sesG.gain.value = 1; sesG.connect(master);
    sahneG = ac.createGain(); sahneG.gain.value = 1; sahneG.connect(muzikG);   // sahne geçişleri: müzikle birlikte kısılır
    // yankı
    rev = ac.createConvolver(); rev.buffer = yankiDarbe(3.6);   // 5 sn iPad için pahalı; gecikme kuyruğu uzatır
    const revCik = ac.createGain(); revCik.gain.value = 0.9; const revHP = suzgec('highpass', 190, 0.6, revCik); rev.connect(revHP); revCik.connect(kisG);   // yankıda bas çamuru olmasın
    revMuzik = ac.createGain(); revMuzik.gain.value = 0.4; muzikG.connect(revMuzik); revMuzik.connect(rev);
    revSfx = kazanc(0.18, rev); revSfxCok = kazanc(0.5, rev);
    // gecikme (noktalı sekizlik = 0.45 sn)
    dlyGiris = ac.createGain(); dlyGiris.gain.value = 0.5;
    dly = ac.createDelay(1); dly.delayTime.value = 0.45;
    dly.fbG = kazanc(0.36, null); dly.out = kazanc(0.4, null);
    const dlf = suzgec('lowpass', 2600, 0.5, null), dhp = suzgec('highpass', 300, 0.5, null);
    dlyGiris.connect(dly); dly.connect(dlf); dlf.connect(dhp); dhp.connect(dly.fbG); dly.fbG.connect(dly);
    dhp.connect(dly.out); dly.out.connect(muzikG);
    // katman otobüsleri
    for (const ad in TEMEL) { B[ad] = ac.createGain(); B[ad].gain.value = 0; B[ad].connect(muzikG); }
    B.zil.gain.value = 1; B.pad.gain.value = 0.75;
    const arpLP = suzgec('lowpass', 3800, 0.4, muzikG); B.arp.disconnect(); B.arp.connect(arpLP);
    const sopranoHP = suzgec('highpass', 420, 0.5, muzikG); if (B.soprano) { B.soprano.disconnect(); B.soprano.connect(sopranoHP); }
    // Bölüm 8 otobüsleri: klavsenin ve şıklatmanın tizi yumuşak (iPad hoparlöründe batmasın), hayalet düdüğüne ayrı uzun yankı
    { const kl = suzgec('lowpass', 5200, 0.5, muzikG); B.klav.disconnect(); B.klav.connect(kl); const sk = suzgec('lowpass', 6200, 0.5, muzikG); B.sik.disconnect(); B.sik.connect(sk); B.hay.connect(kazanc(0.35, rev)); }
    // gürültü (bir kez)
    gurBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const nd = gurBuf.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1;
    // rüzgâr
    const ns = ac.createBufferSource(); ns.buffer = gurBuf; ns.loop = true;
    ruzgarBP = suzgec('bandpass', 500, 0.7, null); ruzgarG = kazanc(0.0, null);
    const lfo = ac.createOscillator(); lfo.frequency.value = 0.07; const lg = kazanc(300, ruzgarBP.frequency); lfo.connect(lg); lfo.start();
    ns.connect(ruzgarBP); ruzgarBP.connect(ruzgarG); ruzgarG.connect(muzikG); ns.start();
    // Bölüm 2 ortamı: gölün çok hafif yalaması (yavaşça kabarıp sönen yumuşak gürültü, iki LFO, stereo) – müziği örtmesin diye yalnız fon
    yalaG = kazanc(0, muzikG);
    [[0.13, 700, -0.5], [0.09, 520, 0.5]].forEach(([hz, fc, pn]) => {
      const sr2 = ac.createBufferSource(); sr2.buffer = gurBuf; sr2.loop = true; sr2.playbackRate.value = 0.9 + rnd() * 0.2;
      const lp = suzgec('lowpass', fc, 0.6, null), am = kazanc(0.5, null), lf = ac.createOscillator(); lf.frequency.value = hz;
      const lg = kazanc(0.5, am.gain); lf.connect(lg); lf.start(); sr2.connect(lp); lp.connect(am); am.connect(panla(yalaG, pn)); sr2.start(0, rnd());
    });
    // Bölüm 7 ortamı: karın çok hafif hışırtısı (tiz, yavaşça kabarıp sönen gürültü, iki LFO) – yalnız fon
    if (bolum7()) {
      karG = kazanc(0, muzikG);
      [[0.17, -0.45, 0.82], [0.12, 0.45, 0.71]].forEach(([hz, pn, hiz]) => {
        const kr = ac.createBufferSource(); kr.buffer = gurBuf; kr.loop = true; kr.playbackRate.value = hiz;
        const hp = suzgec('highpass', 3600, 0.5, null), lp = suzgec('lowpass', 8500, 0.5, null), am = kazanc(0.55, null), lf = ac.createOscillator(); lf.frequency.value = hz;
        lf.connect(kazanc(0.45, am.gain)); lf.start(); kr.connect(hp); hp.connect(lp); lp.connect(am); am.connect(panla(karG, pn)); kr.start(0, hiz);
      });
    }
    kaliciKur();
    const t = zaman();
    cikis.gain.value = 0.0001; cikis.gain.setValueAtTime(0.0001, t); if (!sessizDeneme) cikis.gain.exponentialRampToValueAtTime(1, t + 2.5);
    sonrakiCubuk = t + 0.25;
    olaylariBagla();
  }

  let sonSesDurum = null;
  function sesDurumuBildir() {
    const durum = ac && ac.state;
    if (durum === sonSesDurum) return;
    sonSesDurum = durum;
    if (durum === 'running') {
      tick();   // İlk işitilen ölçü, kilit açıldığı andaki gerçek sahneye ait.
      if (typeof OLAY !== 'undefined') OLAY.emit('sesHazir', { state: durum });
    }
  }
  function uyandir() {
    const a = ac;
    if (!a || test || document.hidden || a.state === 'closed') return;
    if (a.state === 'running') { sesDurumuBildir(); return; }
    // İlk otomatik açılışta resume bekleyebilir: sonraki gerçek dokunuşta
    // yeniden çağırmak gerekir. Bekleyen Promise, dokunuşun önünü kesmesin.
    try { const p = a.resume && a.resume(); if (p && p.then) p.then(sesDurumuBildir, () => {}); } catch (_) {}
    try { const b = a.createBuffer(1, 1, 22050), s = a.createBufferSource(); s.buffer = b; s.connect(a.destination); s.start(0); } catch (_) {}
    sesDurumuBildir();
  }
  function uyut() {
    if (!ac || test || ac.state === 'closed') return;
    try { const p = ac.suspend && ac.suspend(); if (p && p.catch) p.catch(() => {}); } catch (_) {}
    sesDurumuBildir();
  }
  function start() {
    // ?sessiz&sesdene: motor çalışır ama çıkış tamamen kapalı (sessiz deneme)
    const dene = typeof Q !== 'undefined' && Q.has && Q.has('sesdene');
    if (typeof SESSIZ !== 'undefined' && SESSIZ && !dene) return;
    if (ac) { uyandir(); return; }
    sessizDeneme = !!(typeof SESSIZ !== 'undefined' && SESSIZ);
    // iPad: sessiz anahtarı açıkken de çalsın (iOS 17+: medya oturumu 'playback')
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {}
    let ctx;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' }); } catch (e) { return; }
    kur(ctx);
    ninniSur();
    if (typeof DURUM !== 'undefined') durumDegisti(DURUM);
    setInterval(tick, 80); tick();
    requestAnimationFrame(adimDongu);
    // Capture: mini oyun canvas olayını durdursa da gerçek dokunuş sesi açar.
    // iPad'de parmak kalkışı da ayrı bir geçerli kullanıcı hareketidir.
    for (const ev of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'keydown']) addEventListener(ev, uyandir, { passive: true, capture: true });
    document.addEventListener('visibilitychange', () => { if (document.hidden) uyut(); else uyandir(); });
    addEventListener('pagehide', uyut); addEventListener('pageshow', uyandir);
    if (ac.addEventListener) ac.addEventListener('statechange', sesDurumuBildir);
    uyandir();
  }

  // çevrimdışı deneme (OfflineAudioContext): AU._dene(ctx, sure, senaryo(t) → {durum, bolge, light, uyku}, olaylar)
  let sonTestMod = null, solo = null;
  function dene(ctx, sure, senaryo, olaylar, ayar) {
    test = { t: 0, log: ayar && ayar.log ? [] : null }; solo = ayar && ayar.solo || null;
    kur(ctx);
    okuFn = () => senaryo(test.t);
    olaylar = (olaylar || []).slice().sort((a, b) => a[0] - b[0]);
    let oi = 0;
    for (let t = 0; t < sure; t += 0.05) {
      test.t = t;
      const d = okuFn();
      if (d.mod && d.mod !== sonTestMod) { sonTestMod = d.mod; if (d.mod === 'final') finaleGir(); else mod = d.mod; }
      if (d.uyandi && buyukPof === null) buyukPof = { uyandi: true };
      while (oi < olaylar.length && olaylar[oi][0] <= t) {
        const [, ad, v] = olaylar[oi++];
        if (ad[0] === '@') { if (typeof OLAY !== 'undefined') OLAY.emit(ad.slice(1), v); continue; }   // '@olay': oyun olayı
        if (ad === 'agac') finaleGir(); if (SFX[ad]) { sonCal[ad] = -1; cal(ad, v); }
      }
      tick();
    }
    return ctx.startRendering();
  }

  return {
    start, sfx,
    muzik(m) { zorlaMod = m || null; if (m) { if (m === 'final') finaleGir(); else mod = m; } },
    baglam: () => (ac && !test ? ac : null),
    sesCikis: () => sesG,
    kis,
    akor: () => (ac ? akorAt(zaman()).pad.slice() : [50, 54, 57, 61, 64]),
    get bolge() { return bolge; }, get mod() { return mod; },
    get _senlik() { return { fener: s6Fener, oran: +s6S.toFixed(2), midilli: s6MidilliSay(), mini: s6Mini, kopru: s6Kopru, final: s6FinalMi(), prog: progAd }; },
    _bolum6: v => { b6Deger = !!v; },
    get _kuzey() { return { fener: k7Fener, oran: +k7S.toFixed(2), yavru: k7Yavru, kardan: k7Kardan, kizak: k7Kizak, final: k7FinalMi(), bolum: k7FB.tur, prog: progAd }; },
    _bolum7: v => { b7Deger = !!v; },
    get _cadi() { return { fener: c8Fener, oran: +c8S.toFixed(2), bolge: c8Bolge, prog: progAd, uz: +cubukUz.toFixed(3), final: c8FinalMi(), bolum: c8FB.tur, ucus: c8UcusFB.tur, isk: c8Isk, iskN: c8IskN, yuz: c8Yuz, kazan: c8Kazan, hay: c8HaySay() }; },
    _bolum8: v => { b8Deger = !!v; },
    // o anki müziğin vuruşu (dans eşlemesi; Bölüm 8 ölçülerinden): { bpm, vurus (ölçüde kaçıncı), faz 0..1, olcu (sn), prog } ya da null
    nabiz() {
      if (!ac || test) return null;
      const t = zaman() - (ac.outputLatency || ac.baseLatency || 0), c = c8CubukBul(t);
      if (!c) return null;
      const V = c.uz / c.vur, x = (t - c.t) / V, b = Math.floor(x);
      return { bpm: Math.round(600 / V) / 10, vurus: b, faz: x - b, olcu: c.uz, prog: c.prog };
    },
    get _volkan() { return { bahce: vBahce, mini: vMini, miniAsama: vMiniAsama, sal: vSal, final: vFinal }; },
    get _tepe() { return { tepe: yukTepe, dusen: yukDus }; }, _yuzey: e => yuzeyBul(e || null),   // deneme: aynı anda en çok geçici ses (ölçüm)
    _bolum2: v => { b2Deger = !!v; }, _bolum3: v => { b3Deger = !!v; }, _bolum4: v => { b4Deger = !!v; }, _yuzme: v => { yuzmeS = v; }, get _durum() { return { prog: progAd, koS: +koS.toFixed(2), gDoruk: +gDoruk.toFixed(2), ucus: ucusVar(), ac: ac ? ac.state : null }; }, _gok: v => { gBasladi = !!v; }, _yo: v => { yoS = v; }, _dene: dene, _tema: () => ({ PARCA, TEMA, FINAL_MEL, PROG, AK }), _log: () => test && test.log,
  };
})();
