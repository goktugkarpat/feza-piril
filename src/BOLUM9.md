# Bölüm 9: Pırıl'ın Ejderha Vadisi — sözleşme (ajanlar arası)

Dokuzuncu rüya. Pırıl, Feza'yı ilk kez KENDİ EVİNE götürür: minik ejderhaların yaşadığı yemyeşil, büyülü bir vadi. Çiçekli çayır,
şelale ormanı, gökte süzülen uçan adacıklar ve dağın tepesinde Büyükanne Ejderha'nın sıcak yuvası. Ana tema "Işıklı Rüyalar": vadinin
kalbindeki EJDERHA KALBİ kristali sönmüş, ejderha yumurtaları üşümüş, pul çiçekleri kapanmış. Feza ile Pırıl ışığı geri getirir:
pul çiçeklerini açarlar, yumurtaları sarılarak ısıtıp yavruları çıkarırlar, üç küçük oyunu oynarlar, Büyükanne'nin sırtında yuvaya
uçarlar ve Kalp yeniden parlar. Duygusal çekirdek: Pırıl'ın ailesi (annesi, babası, Büyükanne) Feza'yı kucaklar; Feza Pırıl'ın en iyi
arkadaşıdır. Kalite ölçüsü: Bölüm 7 ve 8'in cilalı hali (en üst). Aynı çizim dili, aynı yumuşaklık, iPad M1'de 60 fps. Uzunluk ≈ Bölüm 8.

## KORKUTUCU HİÇBİR ŞEY YOK (Feza 5 yaşında) — herkes için bağlayıcı
- Bütün ejderhalar SEVİMLİ: yuvarlak, tombul, iri parlak gözlü, pembe yanaklı, kalın yumuşak konturlu (Pırıl'la aynı aile çizgisi:
  yumuşak ibik, yüzgeç kulak, çizgili karın, minik iki diş). Büyükanne kocaman ama yumuşacık, gözlüklü, örgü atkılı, gülümseyen.
- Ejderha nefesi ATEŞ DEĞİL: ılık ışık, parıltı, sabun köpüğü, çiçek tozu, renkli duman halkası. Yanma/ateş tehlikesi yok.
- YASAK: böcek (ateşböceği dahil → "ışık tozu"), örümcek, kötü karakter, kovalanma, kızgın/ağlayan yüz, keskin diş/pençe, kan,
  karanlık mağara korkusu, aniden çıkan şey, sert/ani ses, düşüp acıma, kaybetme, süre baskısı, yazı, öğretici el yok (yalnız Pırıl'ın
  sesi + ışık ipuçları). Yükseklik korkutmasın: uçan adacıkların altı yumuşak yosun çanağı, düşmek yok/acısız.
- Feza okuma bilmez: yönlendirme yalnız Pırıl'ın sesi + ışık/parıltı ipuçlarıyla.

## Sanat yönü
Altın saat / gün batımına doğru ilerleyen sıcak bir gün: girişte sabahımsı tatlı ışık, şelale ormanında yeşil-turkuaz serinlik ve su
parıltısı, uçan adacıklarda şeftali-pembe gökyüzü, yolculukta gün batımı, yuvada mor-altın alacakaranlık ve yıldızlar. Palet: zümrüt
ve yeşim yeşilleri (#3fbf8a, #6fd8a8, #2e8f6f), Pırıl leylağı (#b89cff, #d9c8ff), fıstık yeşili (#c8f08a), şeftali (#ffc29a),
gül (#ff9fc0), gök turkuazı (#7fe0f0), altın (#ffd27a), ejderha kalbi kristali (gökkuşağı değil: lila-altın-nane ışıması).
Dev çiçekli ağaçlar (taç yaprakları süzülür), kıvrık eğrelti otları, yosunlu yuvarlak kayalar, ejderha pulu gibi parıldayan
çiçekler, çok katmanlı şelaleler (yumuşak su perdesi, köpük, gökkuşağımsı değil ışıltılı su tozu), uçan adacıkların altından sarkan
kökler ve minik şelaleler, uzakta süzülen yetişkin ejderha siluetleri (sevimli, yavaş, kanat çırpan), ejderha yuvaları (dev
kuş yuvası gibi, yumuşak, yaprak döşeli), Büyükanne'nin dağ yuvası: fenerli, kristalli, battaniyeli, ev gibi sıcak.
Işık arttıkça (açılan pul çiçeği + çıkan yavru sayısı) vadi daha renkli ve sıcak olur: dunya9 `dn9IsikOrani()` 0..1 (herkes kullanabilir).

## Kimlik
- `BOLUM_NO === 9`, tema/fon adı `'ejderha'`, ses harfi `e` (`p_e_*` Pırıl, `a_e_*` anlatıcı; aile sesleri CORE önekleri).
- Genel durum (index.html, HAZIR): `var V9 = { pul: 0, pulTop: 10, yavru: 0, yavruTop: 6, meyve: false, kanat: false, kolye: false,
  binis: false, final: false };`
- `index.html` (HAZIR) yalnız `BOLUM_NO === 9` için şu sırayla yükler: `dunya9, yavru, meyve, kanat, kolye, buyukanne, yuva`
  (+ `bolum9.js` harita). `sw.js` SRC'de hepsi var (CACHE v93). Dosyalar iskelet olarak açıldı.
- Test: `?bolum=9&atla&sessiz`.

## Dosya sahipliği (YALNIZ kendi dosyana yaz)
| Ajan | Dosyalar |
|---|---|
| HARITA | `src/bolum9.js` (harita, nesne yerleşimi, kamera; aşağıdaki sütun düzenini KORU), `src/dunya9.js` (gök, güneş/gün batımı, uzak dağlar ve süzülen ejderha siluetleri, çayır, dev çiçekli ağaçlar, şelaleler, uçan adacıklar, yuvanın dağı/dekoru, zemin çizimi, `dn9IsikOrani`, `dn9Isit`, `dn9Iz`) |
| YAVRU | `src/yavru.js` (pulCicek, ejderYumurta → yavru çıkışı + bölüm boyu takip, dekor dostlar; ortak çiziciler `yavruCiz`, `yumurtaCiz`, `pulCicekCiz`) |
| MEYVE | `src/meyve.js` (mini oyun 1: yavrulara meyve) |
| KANAT | `src/kanat.js` (mini oyun 2: utangaç yavrunun uçma dersi) |
| KOLYE | `src/kolye.js` (mini oyun 3: Büyükanne'nin pul kolyesi; Büyükanne burada ilk kez görünür) |
| BUYUKANNE | `src/buyukanne.js` (Büyükanne Ejderha'nın sırtında yolculuk, P.ucus ile fiziği devralır; ortak `buyukanneCiz`), `src/yuva.js` (final: Ejderha Kalbi Şöleni; Pırıl'ın annesi/babası `aileCiz`) |
| KARAKTER | `src/feza.js` (Bölüm 9 pozları: yumurtaya sarılma, meyve uzatma, binis9 Büyükanne sırtında oturuş, dans9; gerekirse kucak pozları), `src/piril.js` (Bölüm 9 rehberlik/tepki kancaları; evine gelmiş Pırıl'ın sevinci; finalde aile kucaklaşması pozları) |
| CORE | `index.html`, `sw.js`, `src/oyun.js`, `src/arayuz.js`, `src/ses.js` (+ `python gen_voice.py` → `sesler.js`), `src/kapi.js` |
| SAHNE | `src/sahne.js` (seçim ekranında 9. kavanoz 'ejderha' + kavanoz SIRASI: EN YENİ rüyalar en başta (9, 8, 7, 6, ...); uyku → rüya geçişinin 'ejderha' teması ve resmi; sabah: komodinde parıldayan leylak bir ejderha pulu + minik yumurta kabuğu) |
| MUZIK | `src/muzik.js` (Ejderha Vadisi müziği ve bütün Bölüm 9 efekt sesleri) |

Başka bir dosyada değişiklik gerekiyorsa DOKUNMA: `b9/istek/<KIMDEN>_<KIME>.md` dosyasına yaz (kısa, somut). İşinin sonunda ve
arada bir `b9/istek/*_<SENIN_ADIN>.md` dosyalarına bak, sana gelen istekleri yap. Koordinatör ayrıca birleştirir.
Örnek: Bölüm 8 (`src/BOLUM8.md`, `bolum8.js`, `dunya8.js`, `kabak.js`, `seker.js`, `kabakyuz.js`, `iskelet.js`, `kazan.js`, `supurge.js`)
ve Bölüm 7 (`kar.js` `karYavru` takip mantığı, `kizak.js` yolculuk). Her entegrasyon noktası için
`grep -n "BOLUM_NO === 8\|V8" index.html sw.js src/*.js` — Bölüm 9'u aynı noktalara aynı biçimde ekleyin.

## Harita (sütun; T = 40; bolum9.js ilk yerleşimi HAZIR — HARITA geliştirir ama bölge sınırlarını ve nesne sütunlarını korur)
| Bölge (`BOLUM.bolgeler` adı) | Sütun | İçerik |
|---|---|---|
| giris | 0–60 | Feza 5'te başlar (Pırıl: "Burası benim evim!"). Pul çiçeği 20, 44; yumurta 1 (54, nane) |
| cayir | 61–200 | Çiçekli çayır: pul çiçekleri 80, 150, 185; yumurta 2 (120, şeftali), 3 (170, gök); dekor dostlar |
| meyve | 201–240 | `meyveMini` (220, alan 204..237), `miniKapi` 239 |
| selale | 241–380 | Şelale ormanı: pul çiçekleri 265, 300, 340; yumurta 4 (285, limon), 5 (360, gül); taş basamaklar, su perdesi |
| kanat | 381–426 | `kanatMini` (402, alan 385..421), `miniKapi` 424 |
| adalar | 427–560 | Uçan adacıklar (platform zinciri 455..502; altı yumuşak yosun çanağı): pul çiçeği 450, 520; yumurta 6 (500, lila) |
| kolye | 561–604 | `kolyeMini` (580, alan 564..597), `miniKapi` 599, `buyukanneBinis` (602) kalkış kayalığı |
| yolculuk | 605–760 | BOŞLUK: yalnız Büyükanne'nin sırtında yolculuk geçer (~60–70 sn) |
| yuva | 761–839 | İniş (766), Büyükanne'nin dağ yuvası, `ejderYuva` final (812) |
`BOLUM.binis = {x0, x1, yUst, yAlt, inisX, inisY}` (= `BOLUM.ucus`), `BOLUM.yuva {x, y}`, `BOLUM.pulTop/yavruTop`.

## Akış
1. **Giriş** (HARITA + CORE): uyku → rüya geçişi (SAHNE 'ejderha'): Pırıl'ın gözleri parlar, oda yeşil bir vadiye erir. Feza vadinin
   girişinde; Pırıl sevinçle döner: "Burası benim evim!" Uzakta sönük Ejderha Kalbi (dağ tepesinde soluk bir kristal ışığı) görünür.
2. **Pul çiçekleri** (`pulCicek`, 10, YAVRU): kapalı, solgun, uykulu tomurcuklar. Feza yanından geçince/dokununca açılır, içinden
   ejderha pulu gibi yanardöner (lila-nane-altın) taç yapraklar çıkar, ışık halkası + çimenlerde renk dalgası, minik ışık tozları yükselir.
   Her biri biraz başka (farklı renk geçişi, farklı açılış: dönerek, zıplayarak, hapşırarak...). `V9.pul++`, `OLAY 'pulCicek' {o, n, x, y}`.
3. **Ejderha yumurtaları** (`ejderYumurta`, 6, YAVRU): yumuşak yaprak yuvada, üşüyüp titreyen benekli yumurta (minik buz parıltısı değil,
   soluk ve grimsi). Feza yanına gelince durur ve YUMURTAYA SARILIR (KARAKTER pozu 'sarilYumurta'), Pırıl ılık ışık üfler; yumurta
   ısınıp renklenir, sallanır, çatlar → İÇİNDEN YAVRU ÇIKAR: her biri başka renkte (nane, şeftali, gök, limon, gül, lila), başında yumurta
   kabuğu şapka, esner, hapşırır (minik parıltı), Feza'ya sevinçle sarılır; sonra bölüm boyunca Feza'nın peşinden zıplayarak/kısa
   uçuşlarla gelir (Bölüm 8 `hayaletcik` / Bölüm 7 `karYavru` takip mantığı: sıralı, geride kalınca ışıltılı yetişme, yolculukta Büyükanne'nin
   sırtında oturur, finalde dansa katılır). Asla takılmaz (sarılma kısa, ~2.5 sn). `V9.yavru++`, `OLAY 'yavruCikti' {o, n, renk}`.
4. **Mini oyun 1 – Yavrulara meyve** (`meyveMini`, MEYVE): açıklıkta yaprak bir yuvada üç aç yavru (ağızlarını açıp "cik cik" eder; her biri
   başında farklı renk meyve resmi düşündüğü minik bir düşünce baloncuğu — yazı yok). Yanındaki meyve ağacında renkli meyveler parlar
   (çilek-gül, mavi yaban mersini, sarı armut, yeşil üzüm, turuncu şeftali). Feza bir meyveye dokunur → meyve yay çizip yavruya uçar;
   doğru renkse yavru mutlu "ham ham" eder, kıpır kıpır dans eder, karnı parlar; yanlışsa yavru sevimli bir "ıh-ıh" yapıp başını çevirir,
   meyve geri ağaca süzülür (ceza yok). 3 tur × 3 yavru (son turda iki meyve isteyen yavru). Bitince üçü birlikte kanat çırpıp havalanır
   ve yuvanın üstünde ışık saçar. ~25 sn dokunulmazsa Pırıl yardım eder (o seçer). `V9.meyve = true`, `OLAY 'meyveBasla'`,
   `'meyveVer' {n, dogru}`, `'meyveBitti'`.
5. **Mini oyun 2 – Uçma dersi** (`kanatMini`, KANAT): tepede utangaç bir yavru (Pırıl'ın küçük kuzeni Fıstık) henüz uçamıyor, kanatlarını
   saklıyor. Pırıl gösterir; Feza ekrana HER DOKUNUŞTA yavru bir kez kanat çırpar ve biraz yükselir (bırakınca yavaşça süzülerek iner,
   asla düşmez). Önünde sırayla beş çiçek-bulutçuk parlar (alçaktan yükseğe); yavru her birine dokunarak geçer (ışık patlaması + nota).
   Sonunda yavru kendi başına tepenin üstünde süzülür, sevinçten takla atar, Feza'ya gelip burnuyla dokunur. Kaybetme yok; ~20 sn
   dokunulmazsa Pırıl yavruyu kanadından tutup birlikte uçarlar. `V9.kanat = true`, `OLAY 'kanatBasla'`, `'kanatCicek' {n}`, `'kanatBitti'`.
6. **Mini oyun 3 – Büyükanne'nin pul kolyesi** (`kolyeMini`, KOLYE): terasta Büyükanne Ejderha (ilk görünüş! kocaman, gözlüklü, örgü
   atkılı, yumuşacık) iç çekerek oturmuş: kolyesindeki beş parlak pul düşmüş, çimenlere saçılmış. Pullar çimenlerde parlar; Feza her
   birine dokunur ya da sürükler → pul uçup kolyedeki DOĞRU yuvasına (biçim eşleşmesi: yuvarlak, yıldız, kalp, damla, ay) oturur,
   Büyükanne her pulda gülümser, kolye bir nota çalar. Son pulda kolye ışıl ışıl yanar, Büyükanne kalkar, Feza'yı ve Pırıl'ı kanatlarıyla
   kucaklar ve sırtına davet eder. ~25 sn dokunulmazsa Pırıl yardım eder. `V9.kolye = true`, `OLAY 'kolyeBasla'`, `'kolyePul' {n, bicim}`,
   `'kolyeBitti'`. Kolye bitmeden `miniKapi` (599) geçilmez.
7. **Büyükanne'nin sırtında yolculuk** (`buyukanneBinis`, BUYUKANNE; Bölüm 8 `supurge.js` / Bölüm 7 `kizak.js` gibi `P.ucus` ile fiziği
   devralan yolculuk): Feza Büyükanne'nin boynundaki yumuşak atkıya tutunmuş oturur, Pırıl yanında uçar, çıkan yavrular Büyükanne'nin
   sırtında sıralı oturur. Kalkış kayalığından → şelalelerin üstünden (su tozu, ışıltı) → uçan adacıkların arasından → gün batımı ve
   bulut denizi (yavaş, görkemli siluet anı) → uzakta süzülen yetişkin ejderhalar selam verir → dağ yuvasının girişine yumuşak iniş.
   Havada ışık baloncukları/çiçek tozları; dokununca Büyükanne yükselir (bırakınca yumuşakça alçalır), toplar. ~60–70 sn; kaybetme yok,
   dokunulmazsa Pırıl yardım eder. `V9.binis = true`, `OLAY 'binisBasla'`, `'binisIsik' {n, top}`, `'binisBitti'`.
8. **Final – Ejderha Kalbi Şöleni** (`ejderYuva`, BUYUKANNE; Bölüm 8 `cadiMeydan` / Bölüm 7 `kuzeyTepe` gibi): yuvada Feza Ejderha
   Kalbi kristaline dokunur, Pırıl ve yavrular hep birlikte ılık ışık üfler → Kalp yeniden parlar, ışık dalgası bütün vadiye yayılır
   (uzaktaki pul çiçekleri ve yuvalar yanar), gökte yetişkin ejderhalar ışık halkaları çizer, yıldızlar doğar. Pırıl'ın annesi ve
   babası gelir (`aileCiz`), Pırıl'a sarılırlar; herkes Feza'yı kucaklar. Büyükanne Feza'ya kolyeden parlak bir leylak PUL hediye eder.
   Yavrular, Fıstık, Büyükanne, aile, Feza ve Pırıl dans eder. ~35 sn, 28. sn DORUK. `V9.final = true`,
   `OLAY 'ejderFinal' {o, duration: 35, box}`, `OLAY 'ejderDoruk' {o}`, sonunda `OLAY 'ejderTamam'` (sabah).
   yuva.js ayrıca `ejderFinalAn()` (sn) ve `ejderFinalNabiz()` (0..1, vuruş) verir.
9. **Sabah** (SAHNE): Feza odasında uyanır; komodinin üstünde parıldayan leylak bir ejderha pulu ve minik bir yumurta kabuğu.

## Ortak API'ler (çağırırken `typeof` kontrolü yap; yoksa sade yedek çiz)
- `yavruCiz(c, x, y, s, t, o)` — o: `{ renk: 'nane'|'seftali'|'gok'|'limon'|'gul'|'lila'|'fistik', yon, mutlu: 0..1, kanat: 0..1 (çırpma),
  ucus, ziplama, kabuk (yumurta kabuğu şapka 0/1), agiz (0..1), dans: 0..1, uyku }` (YAVRU). Taban ortası (x, y). Pırıl çizgisinde mini ejderha.
- `yumurtaCiz(c, x, y, s, t, o)` — o: `{ renk, sicak: 0..1, titre, catlak: 0..1 }` (YAVRU). `pulCicekCiz(c, x, y, s, t, o)` (YAVRU).
- `buyukanneCiz(c, x, y, s, t, o)` — o: `{ yon, poz: 'otur'|'ayakta'|'ucus'|'kucak'|'dans', kanat: 0..1, gulumse, kolye: 0..5 (takılı pul sayısı), isik }`
  (BUYUKANNE; KOLYE mini oyunu da bunu çağırır — BUYUKANNE önce yazar, KOLYE yokken sade yedek çizer).
- `aileCiz(c, kim: 'anne'|'baba', x, y, s, t, o)` (BUYUKANNE, yuva.js).
- Feza: `fezaCizPoz(c, x, y, olcek, poz, tm)` mevcut; KARAKTER `'sarilYumurta'`, `'meyveUzat'`, `'binis9'`, `'dans9'` ekler.
- Pırıl: `pirilCizPoz` mevcut; Bölüm 9 tepki/rehberlik kancaları KARAKTER'de.
- Işık oranı: `dn9IsikOrani()` 0..1, iz: `dn9Iz(x, y, tip)` (HARITA).
- Takip mantığı örneği: `src/kabak.js` `hayaletcik`, `src/kar.js` `karYavru` (takip, geri gelme, final dans).

## Ses efektleri (MUZIK tanımlar, diğerleri `AU.sfx(ad, v)` ile çağırır; typeof kontrolü)
`bolum9Basla`, `pulAcil` (v = sıra), `yumurtaIsit`, `yumurtaCatla`, `yavruCik`, `yavruHapsir`, `yavruCik2` (cik cik), `meyveUc`, `meyveHam`,
`meyveIh`, `kanatCirp`, `kanatCicek` (v = 0..4 yükselen nota), `kanatTakla`, `kolyePul` (v = 0..4), `kolyeParla`, `buyukanneGul`,
`buyukanneKanat`, `binisKalk`, `binisIsik`, `binisVin`, `binisInis`, `ejderSelam` (uzak ejderhaların yumuşak "uuu" çağrısı), `kalpParla`,
`ejderFinal`, `ejderDoruk`, `selaleSu` (ortam), `ruzgar9`. Hepsi yumuşak, sevimli, kısa; ürkütücü/ani/yüksek ses yok.

## Müzik (MUZIK)
Büyülü, sıcak, aile gibi: "Ejderhanı Nasıl Eğitirsin"in tatlı-masalsı hali, çocuk boyutunda. Sol majör (Lidyen renkleriyle), harp ve
çelesta, yumuşak flüt/okarina, sıcak yaylılar, hafif koro "aa", tahta perküsyon, uzak ejderha çağrısı gibi yumuşak korno. Bölgeye göre:
giris sevinçli eve dönüş teması (Pırıl'ın motifi!); cayir hafif oynak; selale serin, akan arplar + su; adalar havada süzülen, geniş;
meyve / kanat / kolye mini oyun müzikleri (kanat'ta her dokunuşa yükselen nota eşliği); binis uçan, görkemli, gün batımı (doruğu
bulut denizinin üstünde); ejderFinal tam şölen (35 sn, 28. sn doruk) — Pırıl'ın motifi tüm orkestrayla. Bölge adları `BOLUM.bolgeler`'den;
mini oyun/uçuş/final durumu V9 bayraklarından ve olaylardan.

## Ses (CORE yazar; diğerleri yalnız olay yayar ya da `SES.soyle('...')`)
Pırıl `p_e_*`: `uyku` (odada), `giris` ("Burası benim evim!" coşkusu), `pul` (ilk), `pul2` (yarısı), `pul_son`, `yumurta` (ilk yumurta
yakınken: "Üşümüş! Hadi sarılalım"), `yavru` (ilk yavru), `yavru2`, `yavru_son`, `meyve_giris`, `meyve_bitti`, `kanat_giris`, `kanat_bitti`,
`kolye_giris`, `kolye_bitti`, `binis_giris`, `binis` (gün batımı anı), `binis_bitti`, `final`, `p_dost_ejder`; anlatıcı `a_e_final1..3`.
Aile: Büyükanne `bn_` (sıcak, yaşlıca, sevecen: merhaba, her pulda bir söz, teşekkür ve davet, finalde hediye sözü), anne `ea_`, baba `eb_`,
Fıstık `fs_` (minik, utangaç, sonra sevinçli). Tonlar gen_voice.py STYLE'da (hep tr-TR-EmelNeural, küçük doğal kaydırmalar).
Övgü ara sıra ve çeşitli. Kısaltmaya benzeyen sözcük yok ("Aa", "Oo" yok). İngilizce kelime yok.
CORE ayrıca: `SAYAC` (pul/pulTop, yavru/yavruTop, oyun/oyunTop=3), sonuç kartı simgeleri (pul çiçeği · yavru · yıldız), hedef sırası `om9Hedef`
(önündeki pul/yumurta → meyve → kanat → kolye → binis → yuva), final kamerası (Bölüm 8 `cadiFinal` gibi `ejderFinal`), zıplama düğmesinin
gizlenmesi (P.ucus, V9.final, mini oyun etkinken), `oyun.js` dünya çizim yönlendirmesi (`dn9`), ısıtma (`dn9Isit`), `kapi.js` `KP_RENK.ejder`
(lila, nane, altın) ve `kpBitti` için `meyveMini/kanatMini/kolyeMini` (o.done / V9 bayrakları). Seçim ekranı listesi (oyun.js) + SAHNE ile
kavanoz sırası: EN YENİ rüyalar EN BAŞTA.

## Kurallar (hepsi bağlayıcı)
- Klasik script, ES module yok, kütüphane yok, file:// çalışır. Türkçe yorumlar, mevcut dosyalarla aynı yoğunluk ve üslupta. Kendi
  özel global adlarına önek koy (dunya9 `dn9`, yavru `yv9`, meyve `my9`, kanat `kn9`, kolye `kl9`, buyukanne `bn9`, yuva `yu9`,
  feza `fz`, piril `dr`, sahne `sh9`). Ortak çizici adları yukarıdaki gibi.
- Performans: iPad M1 60 fps, 2048×1536 tuval. Karede `ctx.filter`/`shadowBlur`/yeni gradient YOK; sprite'ları önbellek tuvallerine
  çiz (bkz. kar.js `kyTuval`, kabak.js); parçacık sayıları sabit; ekran dışındaki nesne çizilmez; karede bellek ayırma az.
- `dt` 0 olabilir; konumlar sonlu kalsın. Hiçbir nesne Feza'yı kalıcı olarak kilitlemesin; her mini oyunda Pırıl yardımı var.
- TEST: yalnız görünmez (headless) tarayıcı, EKRAN KARTIYLA (swiftshader/--disable-gpu YOK), düşük öncelik, her zaman `?sessiz`, aynı anda
  TEK tarayıcı ve iş bitince KAPAT (try/finally). Ortak yardımcı: `b9/vlib.py` (`from vlib import *; b = Br(OYUN, '?bolum=9&atla&sessiz');
  wait_game(b); b.ev(js); b.shot(yol, fmt='jpeg'); b.close()`). Kullanıcının ekranında pencere açma. Test araçları oyun klasörüne konmaz
  (`b9/test/<AJAN>/`).
- Commit atma, GitHub'a gönderme (koordinatör yapar). Başkasının dosyasını düzenleme.
- İlerleme: `b9/ilerleme/<AJAN>.txt` dosyasına ~5 dakikada bir TEK SATIR yaz (üzerine): `yüzde | kalan dk | ne yapıyorsun`.
- Ekran görüntüleri (ebeveyne gösterilecek; ATMOSFER ve SEVİMLİLİK önemli): `b9/ss/<AJAN>_<sıra>_<ne>.jpg` — ilk görüntüyü erken kaydet.
- `b9/` = `C:\Users\gktgk\AppData\Local\Temp\claude\C--Users-gktgk-Dropbox-Game-Development\023091a0-ddeb-40f4-93c0-92dd0f71414e\scratchpad\b9`
