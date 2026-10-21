# Bölüm 8: Balkabağı Gecesi — sözleşme (ajanlar arası)

Sekizinci rüya, Cadılar Bayramı. Feza bu bayramı çok seviyor; bu bölüm diğerlerinden belirgin biçimde UZUN ve EN ZENGİN olanı
(yaklaşık bir buçuk kat). Ay ışığında mor-turuncu, büyülü bir gece: balkabağı tarlası, eğri büğrü sevimli ağaçlı koru, iskelet
orkestrası, şeker sokağı (ŞEKER Mİ ŞAKA MI mutlaka yaşanır), Cadı Nine'nin bahçesi, süpürgeyle uçuş, köy meydanında Balkabağı
Şenliği. Ana tema "Işıklı Rüyalar": köyün kabak fenerleri sönmüş, şenlik başlayamamış; Feza yaktıkça köy renklenir ve canlanır.
Kalite ölçüsü: ilk yedi rüya (en üst: Bölüm 6–7'nin cilalı hali). Aynı çizim dili, aynı yumuşaklık, iPad M1'de 60 fps.

## KORKUTUCU HİÇBİR ŞEY YOK (Feza 5 yaşında) — herkes için bağlayıcı
- Her şey SEVİMLİ: yuvarlak, tombul, iri parlak gözlü, pembe yanaklı, kalın yumuşak konturlu (Pırıl ve Bölüm 7 yavruları gibi).
- İskeletler: yuvarlak gülen kafa, kocaman parlak boncuk gözler (göz çukuru değil), diş sırası yerine tatlı gülümseme, tombul kemikler;
  komik dans eder, kafası takır takır sallanır. Kafatası yığını, kemik çatısı yok.
- Hayaletler: pamuk/çarşaf gibi beyaz-pastel, alt kenarı dalgalı, pembe yanak, minik kollar; kıkırdar. "Böö" yok, ani belirme yok.
- Cadılar: Cadı Nine tombul, gözlüklü, yanakları pembe, normal ten (YEŞİL TEN YOK), yıldızlı mor şapka; Cadı Kız neşeli bir çocuk.
- Yarasalar mor-lila top gövdeli, iri gözlü, gülümseyen (siyah değil, sivri diş yok). Kara kedi şapkalı, iri yeşil gözlü, tatlı.
- YASAK: örümcek ve ağ (örümceksiz ağ da yok), HER TÜR BÖCEK (ateşböceği dahil → "ışık tozu"), mezar/mezarlık, kan, kırmızı göz,
  keskin diş, zombi, mumya, kurt adam, kızgın/ağlayan yüz, kötü karakter, kovalanma, karanlıkta aniden çıkan şey, sert/ani ses,
  yanma/ateş tehlikesi (kabakların içi "sihirli ışık"). Kaybetme yok, süre baskısı yok, yazı yok, öğretici el yok.
- Feza okuma bilmez: yönlendirme yalnız Pırıl'ın sesi + ışık/parıltı ipuçlarıyla.

## Sanat yönü
Palet: gece mor-lacivert (#2a1f4e, #3b2a6e, #4a3585), ay balı (#ffe7a8), kabak turuncusu (#ff9a3c, #ffb347, #e8702a), sıcak fener
ışığı (#ffd27a), şeker pembesi (#ff8fc8), nane (#7dffc4), limon (#e8ff8a), lila (#c39bff). Kocaman, gülümseyen bal rengi ay; havada
ışık tozları; yerde hafifçe parlayan pembe-mor sis; şeker renkli mantarlar; kıvrım kıvrım parlayan kabak sarmaşıkları; eğri büğrü
sevimli evler, pencerelerde sıcak ışık; evler arasında kabak/yarasa/yıldız biçimli bayrak süsleri; şeker mısırı, lolipop ağaçları.
Işık arttıkça (yanan fener sayısı) dünya daha renkli ve sıcak olur (dunya8 `dn8IsikOrani()` 0..1 → herkes kullanabilir).

## Kimlik
- `BOLUM_NO === 8`, tema/fon adı `'cadi'`, ses harfi `c` (`p_c_*` Pırıl, `a_c_*` anlatıcı; komşu sesleri CORE'un seçtiği önekler).
- Genel durum (index.html, HAZIR): `var V8 = { kostum: null, fener: 0, fenerTop: 12, hayalet: 0, hayaletTop: 5, seker: 0, kapi: 0,
  kapiTop: 6, kabakYuz: false, iskelet: false, kazan: false, supurge: false, final: false };`
- `index.html` (HAZIR) yalnız `BOLUM_NO === 8` için şu sırayla yükler: `dunya8, kostum, kabak, seker, kabakyuz, iskelet, kazan,
  supurge` (+ `bolum8.js` harita). `sw.js` SRC'de hepsi var (CACHE v88). Dosyalar iskelet olarak açıldı.
- Test: `?bolum=8&atla&sessiz`.

## Dosya sahipliği (YALNIZ kendi dosyana yaz)
| Ajan | Dosyalar |
|---|---|
| HARITA | `src/bolum8.js` (harita, nesne yerleşimi, kamera; aşağıdaki sütun düzenini KORU), `src/dunya8.js` (gök, ay, uzak köy/tepe katmanları, tarla, koru, sokak evleri cephe/dekor, meydan, sis, ışık tozları, zemin dokusu, ön plan, ışık arttıkça renklenme, uçuş koridorunun gece manzarası, sabah ışığı; `dn8*` işlevleri ve `dn8Isik`/`dn8IsikOrani`) |
| KABAK | `src/kabak.js` (kabakFener, hayaletcik saklambaç + takip, geceDost dekor hayvanları, cadiMeydan finali; ortak çiziciler `kabakCiz`, `hayaletCiz`, `kediCiz`, `yarasaCiz`, `baykusCiz`) |
| SOKAK | `src/seker.js` (sekerKapi: altı kapı, şeker mi şaka mı, kapıdaki komşular, şeker uçuşu sepete, tatlı şakalar; ortak `komsuCiz(c, kim, x, y, s, t, o)`) |
| KABAKYUZ | `src/kabakyuz.js` (mini oyun 1: kabağa yüz yapmak) |
| ISKELET | `src/iskelet.js` (mini oyun 2: iskelet orkestrası; ortak `iskeletCiz`) |
| KAZAN | `src/kazan.js` (mini oyun 3: Cadı Nine'nin kazanı; ortak `cadiCiz`) |
| SUPURGE | `src/supurge.js` (süpürge yolculuğu, P.ucus ile fiziği devralır; Feza'yı, Pırıl'ı, kara kediyi kendisi çizer) |
| KARAKTER | `src/feza.js` (4 kostüm her pozda + kabak sepeti + süpürge/final dans pozları), `src/kostum.js` (kostumSec nesnesi), `src/piril.js` (Pırıl'ın minik cadı şapkası; Bölüm 8 rehberlik/tepki kancaları — Bölüm 7 bloklarını örnek al) |
| CORE | `index.html`, `sw.js`, `src/oyun.js`, `src/arayuz.js`, `src/ses.js` (+ `gen_voice.py` çalıştır → `sesler.js`), `src/kapi.js` |
| SAHNE | `src/sahne.js` (seçim ekranında 8. balon + 8'li düzen, balon ikonu 'cadi'; uyku → rüya geçişinin 'cadi' teması ve resmi; sabah: komodinde gülen küçük kabak + şeker; finaldeki misafirler/hatıra) |
| MUZIK | `src/muzik.js` (Cadılar Bayramı müziği ve bütün Bölüm 8 efekt sesleri) |

Başka bir dosyada değişiklik gerekiyorsa DOKUNMA: `b8/istek/<KIMDEN>_<KIME>.md` dosyasına yaz (kısa, somut). İşinin sonunda
`b8/istek/*_<SENIN_ADIN>.md` dosyalarına bak ve sana gelen istekleri yap. Koordinatör ayrıca birleştirir.
Örnek: Bölüm 7 (`src/BOLUM7.md`, `bolum7.js`, `dunya7.js`, `kar.js`, `geyik.js`, `kardan.js`, `kizak.js`); her entegrasyon noktası için
`grep -n "BOLUM_NO === 7\|V7" index.html sw.js src/*.js`.

## Harita (sütun; T = 40; bolum8.js ilk yerleşimi HAZIR — HARITA geliştirir ama bölge sınırlarını ve nesne sütunlarını korur)
| Bölge (`BOLUM.bolgeler` adı) | Sütun | İçerik |
|---|---|---|
| giris | 0–64 | Feza 5'te başlar. `kostumSec` (14). 1. fener (22), 2. fener (44), hayaletçik 1 (58, kabak arkası) |
| tarla | 65–204 | Balkabağı tarlası: fenerler 78, 104, 130, 158, 186; hayaletçik 2 (140, çalı); dekor hayvanlar |
| kabakYuz | 205–244 | `kabakYuzMini` (224, alan 208..241), `miniKapi` 243 |
| koru | 245–384 | Eğri ağaçlar korusu: fenerler 268, 310, 352; hayaletçik 3 (292, ağaç kovuğu), 4 (372, çit) |
| iskelet | 385–430 | `iskeletMini` (406, alan 389..425), `miniKapi` 428 |
| sokak | 431–610 | Şeker sokağı: `sekerKapi` 448 kabakDede, 474 iskeletNine, 500 cadiKiz, 526 karaKedi, 552 hayaletTeyze, 578 kabakDede2; fenerler 462, 590; hayaletçik 5 (538, baca) |
| bahce | 611–650 | `kazanMini` (626, alan 613..642), `miniKapi` 643, `supurgeMini` (646) kalkış |
| yolculuk | 651–801 | BOŞLUK: yalnız süpürge yolculuğu geçer (~60–70 sn) |
| meydan | 802–879 | İniş (806), köy meydanı, `cadiMeydan` final (852) |
`BOLUM.supurge = {x0, x1, yUst, yAlt, inisX, inisY}` (= `BOLUM.ucus`), `BOLUM.meydan {x, y}`, `BOLUM.fenerTop/hayaletTop/kapiTop`.

## Akış
0. **Kostüm** (`kostumSec`, KARAKTER): ilk ekranda havada sihirli baloncuklar içinde dört kostüm süzülür: CADI (yıldızlı mor sivri şapka
   + yıldızlı pelerin + ucu yıldız minik asa), BALKABAĞI (yuvarlak dilimli turuncu tulum, gülen kabak yüzlü göğüs, yeşil sap-yaprak şapka),
   İSKELET (lacivert tulum üstünde hafifçe parlayan sevimli beyaz kemik desenleri, başında gülen yuvarlak kafa bandı), YARASA (lila-mor
   kanat pelerin, kol açınca kanat açılır, iki sivri kulaklı taç). Feza bir baloncuğa dokunur ya da içine yürür → parıltılı "puf", kostüm
   üstünde, Feza bir tur döner. Seçmeden ilerlerse (~sütun 30'u geçerse ya da ~15 sn) en yakın baloncuk süzülüp kendiliğinden giydirir
   (asla takılmaz). `V8.kostum = 'cadi'|'kabak'|'iskelet'|'yarasa'`, `OLAY 'kostumSec' {ad}`. Kostümle birlikte Feza'nın elinde
   gülen küçük bir KABAK SEPETİ olur (şeker toplandıkça dolar). Bütün rüya boyunca kostüm her pozda (yürüme, zıplama, süpürge, dans).
1. **Balkabağı fenerleri** (`kabakFener`, 12, KABAK): sönük, gri-mor kabaklar. Feza yanından geçince/dokununca içinde sihirli ışık doğar,
   oyulmuş yüzü parlar ve CANLANIR (her biri farklı: gülen, göz kırpan, dil çıkaran, kahkaha atan, şaşıran-sevinen, öpücük...), çevresine
   ışık halkası + sarmaşıklarda renk dalgası. `V8.fener++`, `OLAY 'kabakFener' {o, n, x, y}`.
2. **Hayaletçik saklambacı** (`hayaletcik`, 5, KABAK): kabak/çalı/ağaç kovuğu/çit/baca arkasına saklanır; yalnız ışıltısı ve ara sıra
   görünen minik eli/kuyruğu, kıkırtısı (sfx). Feza yaklaşınca "Ce-ee!" (parıltı + kahkaha) çıkar, etrafında bir tur döner, sonra
   bölüm boyunca Feza'nın arkasında süzülerek takip eder (Bölüm 7 `karYavru` takip mantığı gibi: sıralı, geride kalınca ışıltılı
   yetişme, süpürgede yerinde kalır ve inişte gelir, finalde dansa katılır). Hafifçe parlar, yolu aydınlatır.
   `V8.hayalet++`, `OLAY 'hayaletBuldu' {o, n}`.
3. **Mini oyun 1 – Kabak yüzü** (`kabakYuzMini`, KABAKYUZ): açıklıkta dev, sönük bir balkabağı. Sırayla göz, burun, ağız için üçer
   seçenek havada süzülür; Feza birine dokunur → parça uçup yerine oturur, kabak her parçada tepki verir (göz kırpar, burnunu oynatır,
   gülümser). Son parçada kabak canlanır: içi ışıl ışıl yanar, kahkaha atar, zıplar, ışık saçar; bölüm boyunca küçük bir hatıra kalabilir.
   ~25 sn dokunulmazsa Pırıl yardım eder (o seçer). `V8.kabakYuz = true`, `OLAY 'kabakYuzBasla'`, `'kabakYuzParca' {n, ad}`, `'kabakYuzBitti'`.
4. **Mini oyun 2 – İskelet orkestrası** (`iskeletMini`, ISKELET): küçük bir sahnede beş sevimli iskelet; kaburgaları KSİLOFON. Sırası gelen
   iskelet parlar; Feza ona dokunur → nota çalar (`AU.sfx('iskeletNota', i)`, i = 0..5) ve iskelet komik bir dans figürü yapar. 4 kısa
   cümle × 4 nota; her cümlenin sonunda hepsi birlikte bir ölçü dans eder. Bitince büyük kemik dansı (kafalar takır takır).
   Oyun bekler, yanlış yok (başka iskelete dokunmak da sevimli bir ses + dans; sıradaki yine parlar). ~20 sn dokunulmazsa Pırıl yardım eder.
   Toplam ~45–60 sn. `V8.iskelet = true`, `OLAY 'iskeletBasla'`, `'iskeletNota' {n, i}`, `'iskeletBitti'`.
   Müzik anlaşması: ton RE MİNÖR PENTATONİK (i: 0 Re, 1 Fa, 2 Sol, 3 La, 4 Do, 5 üst Re), tempo 112 BPM, 4/4 hafif swing.
5. **Şeker sokağı – ŞEKER Mİ ŞAKA MI** (`sekerKapi`, 6, SOKAK): eğri büğrü sevimli evler; her kapının tokmağı/zili parlar. Feza kapının
   önüne gelince kısa bir sahne kendiliğinden oynar (asla atlanmaz, her kapı ~4–6 sn, `P.kilit` kısa): Feza kapıyı çalar → Pırıl ile
   "Şeker mi şaka mı!" → kapı açılır, komşu çıkar (kabakDede: kabak kafalı tombul dede; iskeletNine: şallı gözlüklü iskelet nine;
   cadiKiz: neşeli küçük cadı; karaKedi: şapkalı kara kedi; hayaletTeyze: dantelli pastel hayalet teyze; kabakDede2: kabak ninesi/
   kabak ikizler — SOKAK karar verir) ve Feza'nın KOSTÜMÜNE tepki verir (beğenir, alkışlar). Kimisi ŞEKER verir (şekerler yay çizip
   sepete uçar, sepet dolar: `V8.seker += n`), kimisi TATLI ŞAKA yapar (konfeti, baloncuk, yaylı kutudan fırlayan gülen kabak, şapkadan
   tavşan, kapı tokmağı çiçek açar...) ve ardından yine şeker verir. Hiçbir şaka ürkütmez. `V8.kapi++`,
   `OLAY 'sekerKapi' {o, n, kim, tur: 'seker'|'saka'}`, `OLAY 'seker' {n, top: V8.seker}`.
6. **Mini oyun 3 – Cadı Nine'nin kazanı** (`kazanMini`, KAZAN): bahçede kocaman, fokurdayan kazan; Cadı Nine kepçesiyle karıştırır.
   Havada dört malzeme süzülür (yıldız, şeker, minik kabak, ay çiçeği); Feza her birini parmağıyla kazana sürükler (ya da dokunur →
   kendisi uçar). Her malzemede kazan rengi değişir, köpürür, gökkuşağı baloncukları ve kokulu ışık bulutu çıkar; sonda iksirden
   SÜPÜRGE canlanır (kalkar, sevinçle döner, Feza'nın önüne süzülür). ~25 sn dokunulmazsa Pırıl yardım eder. `V8.kazan = true`,
   `OLAY 'kazanBasla'`, `'kazanMalzeme' {n, ad}`, `'kazanBitti'`. Kazan bitmeden `miniKapi` (643) geçilmez.
7. **Süpürge yolculuğu** (`supurgeMini`, SUPURGE; Bölüm 7 `kizak.js` / Bölüm 6 `halka.js` gibi `P.ucus` ile fiziği devralan yolculuk):
   Feza süpürgede (kostümüyle), Pırıl yanında uçar, kara kedi arkada oturur. Bahçeden kalkış → koca ayın önünden geçiş (siluet anı!) →
   köyün üstünden, ışıklı pencereler ve yanan kabakların üstünden → meydanın girişine yumuşak iniş. Havada ışıklı şekerler/yıldızlar;
   dokununca süpürge yükselir (bırakınca yumuşakça alçalır), toplar. ~60–70 sn; kaybetme yok, kaçan sorun değil, dokunulmazsa Pırıl
   yardım eder. `V8.supurge = true`, `OLAY 'supurgeBasla'`, `'supurgeSeker' {n, top}`, `'supurgeBitti'`.
8. **Final – Balkabağı Şenliği** (`cadiMeydan`, KABAK; Bölüm 7 `kuzeyTepe` gibi): meydanda dev kabak feneri yanar; Feza'nın yaktığı her
   fenerden renkli ışık sütunu; şeker renkli havai fişekler; kabak sarmaşıkları ışıkla dolar; herkes dans eder: iskeletler (`iskeletCiz`),
   hayaletçikler ve hayalet teyze, yarasalar, Cadı Nine (`cadiCiz`), kara kedi, kabak dede (`komsuCiz`), canlanan yüz kabağı; Feza (kostümüyle)
   ve Pırıl dans eder. ~35 sn, 28. sn DORUK. `V8.final = true`, `OLAY 'cadiFinal' {o, duration: 35, box}`, `OLAY 'cadiDoruk' {o}`,
   sonunda `OLAY 'cadiTamam'` (sabah). kabak.js ayrıca `cadiFinalAn()` (sn) ve `cadiFinalNabiz()` (0..1, vuruş) verir.
9. **Sabah** (SAHNE): Feza odasında uyanır; komodinin üstünde gülen küçük bir balkabağı ve bir şeker (rüyadan kalmış gibi).

## Ortak API'ler (çağırırken `typeof` kontrolü yap; yoksa sade yedek çiz)
- `kabakCiz(c, x, y, s, t, o)` — o: `{ yuz: 0..7, yanik: 0..1, mutlu: 0..1, kirp, ziplama }` (KABAK). Taban ortası (x, y).
- `hayaletCiz(c, x, y, s, t, o)` — o: `{ yon, mutlu, el, kik (kıkırdama 0..1), teyze (dantel+gözlük), alfa }` (KABAK).
- `kediCiz`, `yarasaCiz`, `baykusCiz(c, x, y, s, t, o)` (KABAK).
- `iskeletCiz(c, x, y, s, t, o)` — o: `{ dans: 0..1, faz, kafa, nine (şal+gözlük), calma (ksilofon vuruşu 0..1), yon }` (ISKELET).
- `cadiCiz(c, x, y, s, t, o)` — o: `{ tip: 'nine'|'kiz', karistir, sevinc, el, yon }` (KAZAN).
- `komsuCiz(c, kim, x, y, s, t, o)` — kapı komşuları (SOKAK). Finalde KABAK kullanır.
- Feza: `fezaCizPoz(c, x, y, olcek, poz, tm)` mevcut; KARAKTER `'supurge'` (süpürgede oturuş, pelerin/kanat savrulur) ve `'dans8'` pozlarını
  ekler; kostüm her pozda `V8.kostum`'dan. `fezaSepetCiz(c, x, y, s, dolu 0..1)` (sepet, ayrı çizmek isteyenler için).
- Pırıl: `pirilCizPoz` mevcut; Bölüm 8'de başında minik mor cadı şapkası (KARAKTER).
- Karda iz yerine: `dn8Iz(x, y, tip)` varsa çağır (yaprak/ışık tozu izi, HARITA).
- Işık oranı: `dn8IsikOrani()` 0..1 (HARITA).
- Takip mantığı örneği: `src/kar.js` `karYavru` (takip, `kyGeriGel`, final 'cik').

## Ses efektleri (MUZIK tanımlar, diğerleri `AU.sfx(ad, v)` ile çağırır; typeof kontrolü)
`bolum8Basla`, `kostumPuf`, `kabakFener` (v = sıra), `hayaletKikir`, `hayaletCee`, `kabakYuzParca`, `kabakYuzCanlan`, `iskeletNota` (v = 0..5),
`iskeletDans`, `kemikTakir`, `kapiTak`, `kapiAc`, `sekerUc`, `sekerSepet`, `sakaKonfeti`, `sakaYay`, `kazanFokur`, `kazanMalzeme`, `kazanPuf`,
`supurgeCanlan`, `supurgeVin`, `supurgeSeker`, `supurgeInis`, `cadiFinal`, `cadiDoruk`, `fisek`, `yarasaPir`, `kediMiyav`, `baykusHu`.
Hepsi yumuşak, sevimli, kısa; ürkütücü/ani/yüksek ses yok.

## Müzik (MUZIK)
Kesinlikle Cadılar Bayramı havası ama ürpertmeyen, gülümseten: "Addams Ailesi"nin tatlı hali. Re minör (finalde Re majöre açılabilir),
parmak şıklatmaları, iskelet kemiği gibi tıngırdayan ksilofon/marimba, pizzicato yaylılar, çelesta, minik org/klavsen, "uuu" diye öten
hayalet düdüğü (vibratolu sinüs, portamento), zıplayan tuba/fagot bası, hafif tef. Bölgeye göre: giris/tarla/koru gizemli-sevimli ninni
temposu; kabakYuz ve kazan mini oyun müzikleri; iskelet sahnesi 112 BPM orkestra eşliği (ISKELET'in notaları üstüne oturur; melodiyi
müzik çalmaz, eşlik çalar); sokak neşeli yürüyüş; süpürge hızlı uçuş; cadiFinal tam şenlik (35 sn, 28. sn doruk). Bölge adları
`BOLUM.bolgeler`'den; mini oyun/uçuş/final durumu V8 bayraklarından ve olaylardan.

## Ses (CORE yazar; diğerleri yalnız olay yayar ya da `SES.soyle('c_...')`)
Pırıl: `p_c_uyku` (odada uyku), `p_c_giris`, `p_c_kostum`, `p_c_kostum_cadi|kabak|iskelet|yarasa`, `p_c_fener` (ilk), `p_c_fener2` (yarısı),
`p_c_hayalet` (ilk saklanan yakınken: kıkırtı duydun mu?), `p_c_hayalet_bul`, `p_c_kabakyuz_giris`, `p_c_kabakyuz_bitti`,
`p_c_iskelet_giris`, `p_c_iskelet_bitti`, `p_c_sokak`, `p_c_sekermi` (her kapıda: "Şeker mi şaka mı!"), `p_c_kazan_giris`, `p_c_kazan_bitti`,
`p_c_supurge_giris`, `p_c_supurge`, `p_c_supurge_bitti`, `p_c_final`, `p_dost_cadi`, `a_c_final1..3`; komşuların cevapları (kapı başına
şeker/şaka sözü + kostüm övgüsü; CORE ayrı ses tonu önekleri tanımlayabilir: dede/nine/kız/kedi/hayalet), Cadı Nine'nin sözleri.
Övgü ara sıra ve çeşitli. Kısaltmaya benzeyen sözcük yok ("Aa", "Oo" yok).
CORE ayrıca: `SAYAC` (fener/fenerTop, hayalet/hayaletTop, seker, oyun/oyunTop=3), sonuç kartı simgeleri (kabak · hayaletçik · şeker ·
yıldız), hedef sırası `om8Hedef` (kostüm → önündeki fener/hayalet → kabakYuz → iskelet → sıradaki kapı → kazan → süpürge → meydan),
final kamerası (Bölüm 7 `kuzeyFinal` gibi `cadiFinal`), zıplama düğmesinin gizlenmesi (P.ucus, V8.final, mini oyun etkinken),
`oyun.js` dünya çizim yönlendirmesi (`dn8`), ısıtma (`dn8Isit`).

## Kurallar (hepsi bağlayıcı)
- Klasik script, ES module yok, kütüphane yok, file:// çalışır. Türkçe yorumlar, mevcut dosyalarla aynı yoğunluk ve üslupta. Kendi
  özel global adlarına önek koy (dunya8 `dn8`, kabak `kb8`, seker `sk8`, kabakyuz `ky8`, iskelet `is8`, kazan `kz8`, supurge `sp8`,
  kostum `ks8`, feza `fz`, piril `dr`, sahne `sh8`). Ortak çizici adları yukarıdaki gibi.
- Performans: iPad M1 60 fps, 2048×1536 tuval. Karede `ctx.filter`/`shadowBlur`/yeni gradient YOK; sprite'ları önbellek tuvallerine
  çiz (bkz. kar.js `kyTuval`); parçacık sayıları sabit; ekran dışındaki nesne çizilmez; karede bellek ayırma az.
- `dt` 0 olabilir; konumlar sonlu kalsın. Hiçbir nesne Feza'yı kalıcı olarak kilitlemesin; her mini oyunda Pırıl yardımı var.
- TEST: yalnız görünmez (headless) Chrome, her zaman `?sessiz`. Ortak yardımcı: `b8/vlib.py` (imleç kilidi kapalı; kullanıcının faresi
  kilitlenmesin diye ASLA görünür pencere açma, oyunu uygulamanın Tarayıcı panelinde açma). Blender vb. açma. Test araçları oyun
  klasörüne konmaz (`b8/test/<AJAN>/`).
- Commit atma, GitHub'a gönderme (koordinatör yapar). Başkasının dosyasını düzenleme.
- İlerleme: `b8/ilerleme/<AJAN>.txt` dosyasına ~3 dakikada bir TEK SATIR yaz (üzerine): `yüzde | kalan dk | ne yapıyorsun`.
- Ekran görüntüleri (ebeveyne gösterilecek; ATMOSFER ve SEVİMLİLİK önemli): `b8/ss/<AJAN>_<sıra>_<ne>.png` — ilk görüntüyü erken kaydet.
- `b8/` = `C:\Users\gktgk\AppData\Local\Temp\claude\C--Users-gktgk-Dropbox-Game-Development\d0282e08-f18e-4d64-9193-13a89766a60d\scratchpad\b8`

## CORE notları (kancalar hazır; ses harfi `c`)
- Ses anahtarları (Pırıl `p_c_*`): `uyku`, `giris`, `kostum` (+ `_cadi|_kabak|_iskelet|_yarasa`, OLAY 'kostumSec'), `fener` (ilk) / `fener2`
  (yarısı) / `fener_son` (12.), `hayalet` (ilk saklanan 7 kare öndeyken), `hayalet_bul` / `hayalet2` / `hayalet_son`, `kabakyuz_giris|_bitti`,
  `iskelet_giris|_bitti`, `sokak`, `sekermi` (kapı başına bir kez; 3 kayıt sırayla: sekermi, sekermi2, sekermi3), `kazan_giris|_bitti`,
  `supurge_giris`, `supurge` (OLAY 'supurgeAy'; yedek 26 sn), `supurge_yardim` ('supurgeYardim'), `supurge_bitti`, `final`; `p_dost_cadi`;
  anlatıcı `a_c_final1..3` (final1 dünyadaki şenlikte, cadiFinal + 6 sn).
- Komşu sesleri (kim:'k'; Pırıl'ın ağzı oynamaz): `kd_` kabak dede · `in_` iskelet nine · `ck_` cadı kız · `kk_` kara kedi · `ht_` hayalet
  teyze · `k2_` kabak ikizler (iki kayıt karışık, "bir ağızdan") · `cn_` Cadı Nine. Kapıda `OLAY 'komsuSoz' {o, kim, kostum, an:'ovgu'|'veda'}`
  → `<önek>_<kostum|genel>` / `<önek>_veda`. Cadı Nine: `kazanBasla` → `cn_merhaba`, 2. `kazanMalzeme` → `cn_malzeme`, `kazanBitti` → `cn_bitti`.
  Tonlar gen_voice.py STYLE'da (hep tr-TR-EmelNeural, küçük doğal kaydırmalar), CHORUS (k2_) ikinci perde.
- Sayaçlar: `SAYAC.fener/fenerTop` (kabakFener), `hayalet/hayaletTop` (hayaletBuldu), `seker` = max(V8.seker, kapı 'seker'.top + 'supurgeSeker'.n),
  `kapi/kapiTop`, `oyun/oyunTop` (kabakYuzBitti, iskeletBitti, kazanBitti; tür yüklenmediyse sayılmaz). Sonuç kartı: kabak feneri · hayaletçik ·
  şeker (en çok 14) · gülen altın mini oyun yıldızı. Oyun içi üst sıra: yanan fenerler ve bulunan hayaletçikler.
- Rehber `om8Hedef`: zorunlu adımlar (kostumSec → kabakYuzMini → iskeletMini → kazanMini → supurgeMini → cadiMeydan) ve aradaki isteğe bağlı
  fener/hayaletçik/kapı (yalnız öndekiler, ≤6 kare geride). Bitti: modül bayrağı / o.done / olayla gelen o.om8. Türü yüklenemeyen adım atlanır.
- Kamera: yalnız `supurgeMini` uçuş kamerası (koridor BOLUM.supurge); üç mini oyun P.ucus tutsa da normal kamera (kendi omDikkat'leri).
  Final `cadiFinal` {o, duration, box} → Bölüm 6/7 kadrajı (om6Final), sonra `cadiTamam` → 2 sn → sabah (yedek duration+1,5 sn).
- Zıplama düğmesi gizli: P.ucus, V8.final, mini oyun 'Basla'→'Bitti' arası (om8MiniAktif), SEKER8.aktif.
- Yedekler (asla takılmasın): miniKapi bağlı nesne/tür yoksa açık, Feza perde önünde toplam 120 sn beklerse açılır; süpürge boşluğuna
  düşen Feza (süpürge türü yoksa ilk, varsa ikinci düşüşte) meydan girişine taşınır; cadiMeydan türü yoksa meydana varınca sabah.
- Isıtma `dn8Isit()` her karede (true dönene kadar). Pırıl hâlesi lila + fener balı (küçük).
- Uçtan uca başsız deneme: `b8/test/CORE/uctan_uca.py [hiz]` (ışınlanarak her bölümü oynar; mini oyunlara dokunmaz → Pırıl yardımı).
- Kapı sahnesi kamerası: `SEKER8.aktif` doluyken ≈1,35 kat yakın kadraj (kapı + komşu + Feza), sonra yumuşak dönüş.
- sw.js CACHE → `feza-piril-v89` (yeni dosya yok; SRC listesi zaten tam).
