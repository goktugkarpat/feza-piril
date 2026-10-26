# Bölüm 11: Ay Işığı Şatosu — sözleşme (ajanlar arası)

On birinci rüya, sevimli vampir temalı bir Cadılar Bayramı gecesi. Tepedeki eski şatoda minik, neşeli bir vampir ailesi yaşıyor:
Feza yaşında **Vela** (vampir kız), **Vampir Dede**, **Vampir Nine** ve bebek kardeş **Pıtır**. Bu gece Ay Balosu var ama Ay
bulutların arkasına saklanmış, şatonun bütün ışıkları sönmüş; balo başlayamıyor. Feza ve Pırıl, Ay'dan sızan TEK bir ay ışığı
huzmesini büyük süslü AYNALARLA aynadan aynaya sektirerek şatoyu bölüm bölüm aydınlatır ve canlandırır; üç küçük oyun oynar,
pelerinini açıp lila yarasa dostlarıyla kuleye uçar; bulutlar dağılır, kocaman Ay çıkar, Ay Balosu başlar.
Kalite ve uzunluk ölçüsü: Bölüm 8 (Balkabağı Gecesi) — aynı çizim dili, aynı yumuşaklık, ≈ aynı uzunluk (880 sütun), iPad M1'de 60 fps.

Ebeveynin özel isteği: **çiçek açtırma ve yavru/hayvan toplayıp peşine takma YOK** (önceki rüyalarda çok kullanıldı). Ana yol
mekaniği AY IŞIĞI AYNALARI'dır. Takip eden toplanmış dost yok; vampir ailesi kendi yerlerinde karşılar (durak), finalde hep birlikte.

## KORKUTUCU HİÇBİR ŞEY YOK (Feza 5 yaşında) — herkes için bağlayıcı
- `src/BOLUM8.md` "KORKUTUCU HİÇBİR ŞEY YOK" listesinin TAMAMI geçerli (örümcek ve ağ yok, HER TÜR BÖCEK yok — ateşböceği dahil →
  "ışık tozu"; mezar/mezarlık yok, kan yok, kırmızı göz yok, keskin diş yok, zombi/mumya/kurt adam yok, kızgın/ağlayan yüz yok,
  kötü karakter/kovalanma yok, karanlıkta aniden çıkan şey yok, sert/ani ses yok, ateş/yanma yok; kaybetme, süre baskısı, yazı,
  öğretici el yok).
- Vampirler: tombul, yuvarlak, pembe yanaklı, iri parlak gözlü (göz bebeği koyu, beyaz parıltılı; KIRMIZI GÖZ YOK), hep gülen.
  Gülümserken İKİ MİNİK, YUVARLAK UÇLU beyaz dişçik görünür (ebeveyn onayı; sivri/keskin değil, Pırıl'ın dişleri gibi tatlı).
  Pelerin (dışı gece moru/lacivert, astarı çilek kırmızısı ya da pembe), geriye taranmış saç + bir tutam perçem. Ten açık
  pembe-şeftali (yeşil/gri/ölü ten YOK). Vela: iki örgülü saç ya da kurdeleli perçem, yıldızlı taç; Dede: tombul göbek, papyon,
  gümüş favoriler, gözlük; Nine: topuz, inci kolye, önlük (mutfakta); Pıtır: kundakta/emekleyen, minik pelerin, emzik yok gerekmez.
- Vampirler KAN içmez: kırmızı ÇİLEK şerbeti ve çilekli pasta sever. TABUT yok, mezar yok, yarasa ısırması yok, "Böö" yok.
- Yarasalar: lila-mor top gövdeli, iri gözlü, gülümseyen (siyah değil, sivri diş yok). Hayaletler: pamuk gibi beyaz-pastel,
  pembe yanaklı, kıkırdayan dekor (B8 hayaletçik gibi). Şato: eğri büğrü sevimli kuleler, yuvarlak pencereler, pastel taş; gotik
  sivri/karanlık korkutucu mimari değil. Portreler gülen aile üyeleri; zırh, silah, zincir, kafes yok.
- Şamdanlar/fenerler "sihirli ay ışığı" ile yanar (gümüş-mavi ya da altın ışık topu), alev değil.

## Sanat yönü
Gece mor-lacivert gökyüzü (#1d1840, #2a2158, #3a2c74, #4b3a8c), gümüş-mavi ay ışığı (#cfe6ff, #a9c8ff, #eaf4ff), kocaman inci-sarı
Ay (#fff4d6; finalde tam çıkar), ÇİLEK kırmızısı aksan (#ff4f7a, #ff7a9a — şarap/kan koyuluğu değil, şeker gibi parlak), altın
şamdan ışığı (#ffd27a, #ffe7a8), pastel pembe (#ffb3d1), lila (#c39bff, #d9c8ff), nane aksan (#9ff0d0) az. Sisli pastel bahçe
(lila-pembe yer sisi), budanmış çalılar (yarasa/kalp/ay biçimli), eğri büğrü şato kuleleri, yuvarlak vitray pencereler, kadife perdeler,
yıldızlı tavan, kristal mağarada pastel kristaller. Şato sönükken gri-mor ve soluk; huzme eriştikçe parça parça gümüş-mavi + altın
ışık, renk ve hareket kazanır (dunya11 `dn11IsikOrani()` 0..1 — herkes kullanabilir).

## Kimlik
- `BOLUM_NO === 11`, tema/fon adı `'sato'`, ses harfi **`s`** (`p_s_*` Pırıl, `a_s_*` anlatıcı). (`v` harfi Bölüm 5'te kullanılıyor.)
- Aile ses önekleri: `vk_` Vela (vampir kız), `vd_` Vampir Dede, `vn_` Vampir Nine, `vb_` Pıtır (bebek; çok kısa).
- Müzik program adları: `sato` (gezi teması), `satoFinal` (Ay Balosu) — ayrıntı MUZIK'te. Şimdilik muzik.js 11'i Bölüm 8 temasına
  (`cadi` / `cadiFinal`) yönlendirir; MUZIK kendi temasını yazınca yönlendirmeyi değiştirir.
- Genel durum (index.html, HAZIR):
  `var V11 = { pelerin: null, ayna: 0, aynaTop: 12, salon: false, org: false, pasta: false, ucus: false, final: false };`
- `index.html` (HAZIR) yalnız `BOLUM_NO === 11` için şu sırayla yükler: `dunya11, vampir11, ayna11, pelerin11, aynasalon11, org11,
  pasta11, ucus11, balo11` (+ `bolum11.js` harita). `sahne11.js` HER bölümde yüklenir (seçim rafındaki kavanoz). `sw.js` SRC'de hepsi
  var. Dosyalar iskelet olarak açıldı: türler kayıtlı, yer tutucu çizim, bölüm baştan sona oynanır.
- Test: `?bolum=11&atla&sessiz`. Test kancaları: `window.B11T` (bolum11.js; `isinla(sutun)`, `bitir(ad)`), `OYUN`.

## Dosya sahipliği (YALNIZ kendi dosyana yaz)
| Ajan | Dosyalar | Global öneki |
|---|---|---|
| HARITA | `src/bolum11.js` (harita, nesne yerleşimi, kamera; aşağıdaki sütun düzenini KORU), `src/dunya11.js` (gök, saklanan/çıkan Ay, bulutlar, uzak tepe ve şato silüeti, sisli bahçe, yokuş, asma köprü, kristal mağara, org salonu, galeri, mutfak duvarları/dekoru, balkon, uçuş koridorunun gece manzarası, kule terası + balo salonu mimarisi, zemin dokusu, ön plan, ışık arttıkça renklenme, sabah ışığı; `dn11*`) | `bl11`, `dn11`, `DEKOR11` |
| AYNA | `src/ayna11.js` (`ayAyna` 12 ayna + `satoParca` 12 şato parçası + huzme zinciri; ortak `aynaHuzmeCiz`) | `ay11`, `AYNA11` |
| KARAKTER | `src/feza.js` (pelerin kostümü her pozda — 4 renk, kol açınca/zıplayınca kanat gibi açılır; `'ucus11'`, `'dans11'` pozları), `src/pelerin11.js` (`pelerinSec` nesnesi), `src/piril.js` (Pırıl'ın minik gece mavisi pelerini + ay tokası; Bölüm 11 rehberlik/tepki kancaları — B9 bloklarını örnek al) | `fz`, `pl11`, `dr` |
| VAMPIR | `src/vampir11.js` (ortak `vampirCiz`, `hayalet11Ciz`, `yarasa11Ciz`; `vampirDurak` karşılamalar, `hayaletDekor`, `yarasaDekor`), `src/balo11.js` (`ayBalosu` final) | `vp11`, `bl11B`, `BALO11` |
| MINI1 | `src/aynasalon11.js` (`aynaSalonMini`: buğulu aynaları silme, Vela aynada görünmez şakası) | `as11`, `SALON11` |
| MINI2 | `src/org11.js` (`orgMini`: dev org, Vampir Dede dansı) | `or11`, `ORG11` |
| MINI3 | `src/pasta11.js` (`pastaMini`: Vampir Nine'nin çilekli pastası) | `pa11`, `PASTA11` |
| UCUS | `src/ucus11.js` (`pelerinUcus`: P.ucus ile kuleye uçuş), `src/sahne11.js` (seçim rafında 11. kavanoz: içinde minik şato + ay; uyku → rüya geçişinin 'sato' fonu ve oda süsleri; sabah: pencerede ay batımı + komodinde küçük lila yarasa peluşu ve bir çilek) | `uc11`, `UCUS11`, `sh11` |
| MUZIK | `src/muzik.js` (Ay Işığı Şatosu müziği + bütün Bölüm 11 efektleri), `src/ses.js` Bölüm 11 bölümü (SESLER bloğundaki `p_s_* a_s_* vk_ vd_ vn_ vb_` cümleleri, `sesB11` kancaları) + `python3 gen_voice.py` → `sesler.js` | `au11`, `s11` |
| CORE (koordinatör birleştirir) | `index.html`, `sw.js`, `src/oyun.js`, `src/arayuz.js`, `src/kapi.js`, `src/sahne.js` (yalnız 11 yönlendirmeleri; çizimler sahne11.js'te) | `om11` |

Başka bir dosyada değişiklik gerekiyorsa DOKUNMA: istek dosyası yaz:
`/private/tmp/claude-501/-Users-goktugkarpat-Library-CloudStorage-Dropbox-Game-Development/6a76d4aa-ea53-43f5-b361-140c6c3f5633/scratchpad/b11/istek/<KIMDEN>_<KIME>.md`
(kısa, somut; CORE dosyaları için `<KIMDEN>_CORE.md`). İşinin sonunda ve arada bir `b11/istek/*_<SENIN_ADIN>.md` dosyalarına bak ve
sana gelen istekleri yap. Örnek: Bölüm 8 (`src/BOLUM8.md`), Bölüm 9 (`src/BOLUM9.md`). Entegrasyon noktaları:
`grep -n "BOLUM_NO === 11\|V11\|om11" index.html sw.js src/*.js`.

## Harita (sütun; T = 40; COLS = 880; bolum11.js ilk yerleşimi HAZIR — HARITA geliştirir ama bölge sınırlarını ve nesne sütunlarını korur)
| Bölge (`BOLUM.bolgeler` adı) | Sütun | İçerik |
|---|---|---|
| giris | 0–64 | Feza 6'da başlar. `pelerinSec` (14). `vampirDurak` Vela (38, bahçe kapısında karşılar). Ayna 1 (26), 2 (52) |
| bahce | 65–210 | Sisli şato bahçesi ve yokuş (zemin basamak basamak yükselir): aynalar 86, 122, 158, 194; `yarasaDekor` (100, 170) |
| salon | 211–254 | `aynaSalonMini` (232, alan 215..250), `miniKapi` 253 |
| kopru | 255–320 | Asma köprü (plat 268..302, altı yumuşak sis çanağı — düşmek acıtmaz, iki ucu basamakla çıkılır): ayna 312 |
| magara | 321–420 | Kristal mağara: aynalar 340, 372, 404; `hayaletDekor` (334, 360, 392) kıkırdayan pastel hayaletler |
| org | 421–466 | `orgMini` (442, alan 425..462), `miniKapi` 465; `vampirDurak` Dede orgun başında (orgMini kendisi çizer) |
| galeri | 467–550 | Şato galerisi (portreler, perdeler, şamdanlar): aynalar 486, 522; `vampirDurak` Pıtır (536, beşiğinde) |
| mutfak | 551–598 | `pastaMini` (572, alan 555..594), `miniKapi` 597 |
| balkon | 599–608 | `pelerinUcus` (604) kalkış balkonu |
| yolculuk | 609–764 | BOŞLUK: yalnız pelerinle uçuş geçer (~60 sn) |
| balo | 765–879 | Kule terasına iniş (770), balo salonu, `ayBalosu` final (826) |

`BOLUM.ucus = BOLUM.kule = {x0, x1, yUst, yAlt, inisX, inisY}` (uçuş koridoru), `BOLUM.balo {x, y}`, `BOLUM.ayKaynak {x, y}` (ilk
huzmenin geldiği bulut aralığı, dünya koordinatı), `BOLUM.aynaTop` (12).

## Akış
0. **Pelerin seçimi** (`pelerinSec`, KARAKTER): ilk ekranda havada süzülen sihirli baloncuklarda dört pelerin: MOR (yıldız işlemeli),
   GECE MAVİSİ (ay işlemeli), ÇİLEK KIRMIZISI (pembe astarlı, kalp tokalı), PEMBE-LİLA (gümüş yıldız tozlu; dördüncü tatlı seçenek).
   Feza bir baloncuğa dokunur ya da içine yürür → parıltılı "puf", pelerin omzunda, Feza bir tur döner, pelerin kanat gibi açılıp kapanır.
   Seçmeden ilerlerse (~sütun 30'u geçerse ya da ~15 sn) en yakın baloncuk süzülüp kendiliğinden giydirir (asla takılmaz).
   `V11.pelerin = 'mor'|'lacivert'|'kirmizi'|'pembe'`, `OLAY 'pelerinSec' {ad}`. Bütün rüya boyunca pelerin her pozda (yürüme: hafif
   dalgalanır; zıplama/kol açma: kanat gibi açılır; uçuş, dans). Ayrıca minik yarasa kanadı biçimli taç/toka (KARAKTER karar verir).
1. **Ay ışığı aynaları** (`ayAyna` 12 + `satoParca` 12, AYNA): Ay bulutların ardında; bir bulut aralığından (`BOLUM.ayKaynak`) tek, parlak,
   gümüş-mavi bir huzme iner. Yol boyunca büyük, süslü (altın çerçeveli, yarasa/ay/yıldız işlemeli, iri) aynalar vardır; huzme bir
   aynaya ulaşmışsa ayna yumuşak parıldar ve "bekler". Feza aynaya DOKUNUR ya da YANINDAN GEÇERKEN ona değer → ayna tatlı bir sesle
   DOĞRU AÇIYA döner (yanlış yok, tek dokunuş), huzme aynadan sekip o aynanın `satoParca`'sına (şatonun bir parçası) ulaşır → parça
   aydınlanır ve CANLANIR, oradan da yansıyarak bir sonraki aynaya ulaşır (o ayna "bekler" parıltısına geçer). Huzme her ulaşmada
   parıltı + tatlı çan (`AU.sfx('aynaDon', n)`, `'huzmeVar'`). Asla takılmaz: önceki aynayı atlayan Feza ileri bir aynaya dokunursa,
   atlanan aynalar art arda kendiliğinden döner (ışık zinciri şelalesi — güzel bir an). Zorunlu değildir (final aynasız da açılır),
   ama Pırıl hep sıradakini gösterir. `V11.ayna++`, `OLAY 'aynaDondu' {o, n, x, y}`, `OLAY 'satoCanlan' {o, n, tur, x, y}`.
   12 canlanma (`satoParca.tur`, sırayla): `kapi` (bahçe kapısı kemerindeki ay taşları + iki sihirli fener), `cesme` (ay ışığı
   fıskiyesi), `calı` (budanmış yarasa/kalp çalıları ışıl ışıl), `pencere` (şatonun alt pencereleri sıra sıra yanar), `bayrak`
   (kule flamaları açılır, dalgalanır), `kule` (uzak kule pencereleri + yıldız), `fener` (köprü fenerleri), `kristal` (kristal kümeleri
   renk renk yanar), `avize` (mağara kristal avizesi döner), `hayalet` (hayalet dostlar kıkırdayıp ışıklanır), `portre` (galerideki aile
   portreleri gülümser, göz kırpar), `perde` (kadife perdeler açılır, şamdanlar sihirli ışıkla yanar). Sütunlar bolum11.js'te.
2. **Mini oyun 1 – Ayna salonu** (`aynaSalonMini`, MINI1): duvarda 5–6 büyük, buğulu (sisli) ayna. Şaka ile açılır: Vela, Feza'yla
   aynanın önünde durur — aynada Feza ve Pırıl görünür ama Vela GÖRÜNMEZ (Vela kıkırdar, aynaya el sallar, yansımada yalnız havada
   süzülen tacı/kurdelesi). Feza buğulu aynaları PARMAĞIYLA SİLER (sürükleme; dokunma da yeter → kendi siler): altından saklı yıldızlar
   ve komik yansımalar çıkar (Pırıl'ın yerine kocaman komik şapkalı Pırıl, Feza'nın yansıması uzun bacaklı/yassı (lunapark aynası),
   Dede'nin yansıması bıyıklı kedi, ay yansıması gülümser...). Her ayna kıkırtı + parıltı. Sonunda bütün aynalar parlar, Vela'nın
   yansıması da bir an göz kırparak belirir (sevimli kapanış). ~25 sn dokunulmazsa Pırıl yardım eder. `V11.salon = true`,
   `OLAY 'salonBasla'`, `'salonBul' {n, ad}`, `'salonBitti'`. Bitmeden `miniKapi` (253) geçilmez.
3. **Asma köprü ve kristal mağara** (HARITA dekor + AYNA aynaları + VAMPIR `hayaletDekor`): pastel kristaller, sisli köprü, kıkırdayan
   pastel hayaletler (dekor; takip etmezler), lila yarasalar tavanda baş aşağı uyuklar ve huzme geçince gözlerini açıp gülümser.
4. **Mini oyun 2 – Org konseri** (`orgMini`, MINI2): şatonun dev, pastel, süslü orgu (boruları ay/yıldız işlemeli). Sırası gelen
   boru parlar; Feza ona dokunur → nota (`AU.sfx('orgNota', i)`, i = 0..5) + borudan renkli ışık halkası/baloncuk çıkar; Vampir Dede
   (pelerinli, tombul) her notada komik bir dans figürü yapar (pelerin savrulur, takla, papyonu döner). Kısa melodi (4 cümle × 4 nota;
   cümle sonunda Dede + yarasalar bir ölçü dans). Yanlış yok (başka boru da sevimli ses + dans). ~20 sn dokunulmazsa Pırıl yardım.
   Toplam ~45–60 sn. Müzik anlaşması: LA MİNÖR PENTATONİK (i: 0 La, 1 Do, 2 Re, 3 Mi, 4 Sol, 5 üst La), 104 BPM, 3/4 vals.
   `V11.org = true`, `OLAY 'orgBasla'`, `'orgNota' {n, i}`, `'orgBitti'`.
5. **Mini oyun 3 – Vampir Nine'nin pastası** (`pastaMini`, MINI3): şato mutfağında Nine'nin kocaman, üç katlı çilekli pastası (sade
   krema). Havada süslemeler süzülür (çilekler, krema kalpleri, yıldız şekerler, ay biçimli bisküvi, en üste minik yarasa kurabiyesi);
   Feza her birini parmağıyla pastaya sürükler (ya da dokunur → kendisi uçar ve yerine oturur). Her süsle pasta biraz parlar,
   Nine sevinir; son süste pasta ışıl ışıl, Pıtır alkışlar, Nine pastayı baloya götürmek üzere kapağa koyar. ~25 sn dokunulmazsa Pırıl
   yardım eder. `V11.pasta = true`, `OLAY 'pastaBasla'`, `'pastaSus' {n, ad}`, `'pastaBitti'`.
6. **Pelerinle uçuş** (`pelerinUcus`, UCUS; Bölüm 8 `supurge.js` / Bölüm 9 `buyukanne.js` gibi `P.ucus` ile fiziği devralır): balkonda
   Feza pelerinini kanat gibi açar, lila yarasa dostları etrafında; Vela yanında uçar (kendi pelerini), Pırıl yanında. Ay ışığında,
   bulut aralıklarından geçerek, aydınlanmış şatonun üstünden (pencereler yanıyor) kule terasına yumuşak iniş. Havada ay ışığı
   damlaları/yıldızlar; dokununca yükselir (bırakınca yumuşakça süzülür), toplar. Ortada "ayın önünden siluet anı" (`'pelerinUcusAy'`).
   ~60 sn; kaybetme yok, dokunulmazsa Pırıl yardım eder. `V11.ucus = true`, `OLAY 'pelerinUcusBasla'`, `'pelerinUcusIsik' {n, top}`,
   `'pelerinUcusAy'`, `'pelerinUcusYardim'`, `'pelerinUcusBitti'`.
7. **Final – Ay Balosu** (`ayBalosu`, VAMPIR; Bölüm 8 `cadiMeydan` gibi): Feza kule terasında son büyük aynaya (ya da Ay taşına)
   dokunur → bütün aynalardan toplanan ışık göğe yükselir, bulutlar dağılır, KOCAMAN AY çıkar; balo salonunun kubbesinden ay ışığı
   dolar, avizeler yanar, Nine'nin pastası gelir. Vela, Dede, Nine, Pıtır, Feza (pelerinli), Pırıl, hayaletler ve yarasalar vals
   eder (3/4). ~35 sn, 28. sn DORUK (ay ışığı halkası + yıldız yağmuru). `V11.final = true`, `OLAY 'baloFinal' {o, duration: 35, box}`,
   `OLAY 'baloDoruk' {o}`, sonunda `OLAY 'baloTamam'` (sabah). balo11.js ayrıca `baloFinalAn()` (sn) ve `baloFinalNabiz()` (0..1, vuruş) verir.
8. **Sabah** (UCUS, sahne11.js): Feza odasında uyanır; komodinin üstünde küçük bir lila yarasa peluşu ve bir çilek (rüyadan kalmış gibi).

## Ortak API'ler (çağırırken `typeof` kontrolü yap; yoksa sade yedek çiz)
- `vampirCiz(c, kim, x, y, s, t, o)` — kim: `'kiz'|'dede'|'nine'|'bebek'`; o: `{ yon: ±1, poz: 'dur'|'el'|'alkis'|'dans'|'otur'|'ucus'|'kikir'|'sasir'|'org'|'karistir', mutlu: 0..1, pelerin: 0..1 (açıklık),
  agiz: 0..1 (konuşma), kirp, faz (dans fazı), gorunmez: 0..1 (ayna şakası için saydamlık) }` (VAMPIR). Taban ortası (x, y), s = ölçek (1 ≈ Feza boyu).
  VAMPIR erkenden (ilk 15 dk) çalışan bir sürüm koyar; MINI1/MINI2/MINI3/UCUS bunu çağırır (iskelette yer tutucu var).
- `hayalet11Ciz(c, x, y, s, t, o)` — o: `{ yon, mutlu, kik: 0..1, alfa }`; `yarasa11Ciz(c, x, y, s, t, o)` — o: `{ kanat: 0..1, yon, uyku: 0/1 (baş aşağı), mutlu }` (VAMPIR).
- `aynaHuzmeCiz(c, x0, y0, x1, y1, t, a)` — ay ışığı huzmesi (önbellekli sprite ile, gradyansız) (AYNA). `AYNA11 = { huzme: [{x0,y0,x1,y1}], sira (bekleyen ayna), hedef() }`.
- `aynaCerceveCiz(c, x, y, s, t, o)` — süslü ayna çerçevesi (AYNA; MINI1 ayna salonunda isterse kullanır, kendi çizimini de yapabilir).
- Feza: `fezaCizPoz(c, x, y, olcek, poz, tm)` mevcut; KARAKTER `'ucus11'` (pelerin kanat gibi açık süzülme) ve `'dans11'` (vals) pozlarını
  ekler; pelerin her pozda `V11.pelerin`'den. `fezaPelerinCiz(c, x, y, s, acik 0..1, renk)` (ayrı çizmek isteyenler için).
- Pırıl: `pirilCizPoz` mevcut; Bölüm 11'de minik gece mavisi pelerin + ay tokası (KARAKTER).
- Işık oranı: `dn11IsikOrani()` 0..1 (HARITA; V11.ayna/aynaTop + mini oyunlar + final), iz: `dn11Iz(x, y, tip)` (yer sisinde yumuşak halka).
- Mini oyun nesneleri: `o.done = true` + `o.tk = { bitti: true }` ile bittiğini bildirir (kapi.js ikisini de okur) VE `'…Bitti'` olayını yayar.
- Uçuş: `P.ucus = o` ile fiziği devralır, `o.adim(dt, girdi)` (girdi = `OYUN.ucusGirdi`: `basili, hedefY, eksenY`); bitince `P.ucus = null`,
  Feza `BOLUM.ucus.inisX/inisY`'de yerde, `OLAY 'pelerinUcusBitti'`.

## Ses efektleri (MUZIK tanımlar, diğerleri `AU.sfx(ad, v)` ile çağırır; typeof kontrolü)
`bolum11Basla`, `pelerinPuf`, `pelerinAc` (kanat açılışı, hafif kumaş "fıp"), `aynaDon` (v = sıra 0..11, yükselen tatlı çan), `huzmeVar`,
`satoCanlan` (v = sıra), `aynaKikir` (Vela'nın kıkırtısı yerine yumuşak çan; sesli kıkırtı ses kaydı), `aynaSil` (buğu silme, yumuşak
"vıjj"), `aynaBul`, `orgNota` (v = 0..5), `orgDans`, `pastaSus`, `pastaParla`, `ucusKalk`, `ucusIsik`, `ucusVin`, `ucusInis`,
`yarasaPir` (lila yarasa kanat pırpırı), `hayaletKikir`, `baloFinal`, `baloDoruk`, `ayCik` (bulutlar dağılır), `valsAdim`.
Hepsi yumuşak, sevimli, kısa; ürkütücü/ani/yüksek ses yok.

## Müzik (MUZIK)
Gülümseten, ürpertmeyen sevimli vampir şatosu: "Addams Ailesi"nin tatlı hali + "Otel Transilvanya"nın çocuk dostu valsi, ama sakin.
LA MİNÖR (finalde La majöre açılır), 3/4 VALS ağırlıklı; çelesta, klavsen, minik org, pizzicato yaylılar, harp, yumuşak klarnet,
müzik kutusu, hafif tef/zil, "uuu" hayalet düdüğü (az). Bölgeye göre: giris/bahce gizemli-sevimli ninni valsi; salon kıkırdayan,
parmak uçlu; kopru/magara kristal çan yankıları; org mini oyunu 104 BPM vals eşliği (MINI2'nin notaları üstüne oturur; melodiyi müzik
çalmaz, eşlik çalar); galeri/mutfak neşeli; uçuş geniş, süzülen, ay ışığı; `satoFinal` tam balo valsi (35 sn, 28. sn doruk).
Işık arttıkça (V11.ayna) enstrüman katmanları eklenir. Bölge adları `BOLUM.bolgeler`'den; mini oyun/uçuş/final durumu V11 + olaylardan.

## Ses (MUZIK yazar — ses.js'te Bölüm 11 bölümü; diğerleri yalnız olay yayar ya da `SES.soyle('…')`)
İskelette HAZIR temel cümleler (MUZIK geliştirir, yeni ekler, gen_voice çalıştırır): `p_s_uyku`, `p_s_giris`, `p_s_pelerin`,
`p_s_ayna` (ilk ayna yakınken), `p_s_ayna2` (yarısı), `p_s_ayna_son`, `p_s_salon_giris`, `p_s_salon_bitti`, `p_s_org_giris`,
`p_s_org_bitti`, `p_s_pasta_giris`, `p_s_pasta_bitti`, `p_s_ucus_giris`, `p_s_ucus` (ay anı), `p_s_ucus_bitti`, `p_s_final`, `p_dost_sato`,
`a_s_final1..3`, `vk_merhaba`.
Eklenecekler (öneri): `p_s_pelerin_mor|lacivert|kirmizi|pembe`, `p_s_ayna_ipucu`, `p_s_salon_yardim`, `p_s_org_yardim`, `p_s_pasta_yardim`,
`p_s_ucus_yardim`; Vela `vk_ayna` (kıkırdar: "Ben aynada görünmem ki!"), `vk_org`, `vk_ucus`, `vk_balo`, `vk_tesekkur`; Dede `vd_merhaba`,
`vd_dans`, `vd_tesekkur`; Nine `vn_merhaba`, `vn_pasta`, `vn_tesekkur`; Pıtır `vb_mutlu` (tek sözcük, çok kısa).
Kural: Övgü ara sıra ve çeşitli. Kısaltmaya benzeyen sözcük yok ("Aa", "Oo", "Hi" yok; "Bak bak", "Vay" yaz). İngilizce kelime yok.
Ses kaydı `tr-TR-EmelNeural` (gen_voice.py STYLE'da aile tonları; Pıtır biraz tiz, Dede biraz kalın, ama doğal).

## CORE notları (kancalar HAZIR — oyun.js `om11`)
- Sayaçlar: `SAYAC.ayna/aynaTop` (OLAY 'aynaDondu', nesne başına bir kez), `SAYAC.oyun/oyunTop` (salonBitti, orgBitti, pastaBitti;
  tür yüklenmediyse sayılmaz). Sonuç kartı: ay aynası · gülen altın mini oyun yıldızı. Oyun içi üst sıra: dönen aynalar.
- Rehber `om11Hedef`: zorunlu adımlar (pelerinSec → aynaSalonMini → orgMini → pastaMini → pelerinUcus → ayBalosu) ve aradaki isteğe
  bağlı aynalar (yalnız öndekiler, ≤6 kare geride). Bitti: modül bayrağı / o.done / olayla gelen o.om11. Türü yüklenemeyen adım atlanır.
- Mini oyun etkin (`om11MiniAktif()`): 'Basla' → 'Bitti' arası; zıplama düğmesi gizli, "bu tarafa gel" yok.
- Kamera: yalnız `pelerinUcus` uçuş kamerası (koridor BOLUM.ucus); üç mini oyun P.ucus tutsa da normal kamera (kendi omDikkat'leri).
  Final `baloFinal` {o, duration, box} → Bölüm 6–9 kadrajı (om6Final), sonra `baloTamam` → 2 sn → sabah (yedek duration+1,5 sn).
- Yedekler (asla takılmasın): miniKapi bağlı nesne/tür yoksa açık; Feza perde önünde 120 sn beklerse açılır; uçuş boşluğuna düşen Feza
  (uçuş türü yoksa ilk, varsa ikinci düşüşte) kule terasına taşınır; ayBalosu türü yoksa baloya varınca sabah.
- Isıtma `dn11Isit()` her karede (true dönene kadar). Pırıl hâlesi lila + ay gümüşü (küçük). kapi.js `KP_RENK.sato` (lila, ay gümüşü, çilek pembesi).
- Seçim rafı: 11 EN BAŞTA (en yeni rüya): `11, 9, 8, 7, 10, 6, 5, 4, 3, 2, 1`.

## Kurallar (hepsi bağlayıcı)
- Klasik script, ES module yok, kütüphane yok, file:// çalışır. Türkçe yorumlar, mevcut dosyalarla aynı yoğunluk ve üslupta. Kendi özel
  global adlarına önek koy (tablodaki önekler). Ortak çizici adları yukarıdaki gibi. Aynı adı iki dosyada tanımlama.
- Performans (iPad M1 60 fps, 2048×1536 tuval): karede `ctx.filter`/`shadowBlur`/yeni gradient YOK; sprite'ları önbellek tuvallerine
  bir kez çiz (bkz. kar.js `kyTuval`, kabak.js); parçacık sayıları sabit; ekran dışındaki nesne çizilmez; karede bellek ayırma az; ısıtma
  işleri kareye yayılır. Masaüstü her rAF, tablet 60 FPS kuralı (oyun.js) değiştirilmez.
- `dt` 0 olabilir; konumlar sonlu kalsın. Hiçbir nesne Feza'yı kalıcı olarak kilitlemesin; her mini oyunda Pırıl yardımı var.
- Dokunma: büyük hit alanları; sürükleme olan her yerde tek dokunuş alternatifi; ikinci parmak etkin parmağı değiştirmez; pointercancel
  ilerlemeyi bozmaz.
- TEST: yalnız görünmez (headless) Chrome, her zaman `?sessiz`, aynı anda TEK tarayıcı, iş bitince KAPAT (try/finally). Yardımcı:
  `/private/tmp/claude-501/-Users-goktugkarpat-Library-CloudStorage-Dropbox-Game-Development/6a76d4aa-ea53-43f5-b361-140c6c3f5633/scratchpad/b11/br.py`
  (`sys.path.insert` ile; `Br(port, w, h)`: goto/ev/pump/shot/click/close; await için `(async()=>...)()`). Her ajan KENDİ portunu
  kullanır (HTTP 8901–8909, CDP 9811–9899; tabloda: HARITA 8901/9811, AYNA 8902/9812, KARAKTER 8903/9813, VAMPIR 8904/9814, MINI1 8905/9815,
  MINI2 8906/9816, MINI3 8907/9817, UCUS 8908/9818, MUZIK 8909/9819). Kullanıcının ekranında pencere açma; Tarayıcı paneli/Blender açma.
  Test araçları oyun klasörüne konmaz (`b11/test/<AJAN>/`). Kısayol: `B11T.isinla(sutun)` Feza'yı sütuna taşır.
- Commit atma, GitHub'a gönderme (koordinatör yapar). Başkasının dosyasını düzenleme.
- İlerleme: `b11/ilerleme/<AJAN>.txt` dosyasına ~5 dakikada bir TEK SATIR yaz (üzerine): `yüzde | kalan dk | ne yapıyorsun`.
- Ekran görüntüleri (ebeveyne gösterilecek; ATMOSFER ve SEVİMLİLİK önemli): `b11/ss/<AJAN>_<sıra>_<ne>.png` (1180×820) — ilkini erken kaydet.
- `b11/` = `/private/tmp/claude-501/-Users-goktugkarpat-Library-CloudStorage-Dropbox-Game-Development/6a76d4aa-ea53-43f5-b361-140c6c3f5633/scratchpad/b11`
