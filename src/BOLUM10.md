# Bölüm 10 — Zamanın Uyuduğu Vadi

## Oynanış ve görsel yön

Vadi yalnız uyuyan canlılar içermez: su, havaya sıçramış tilkiler, kuş kanatları, yapraklar ve kum akışı hareketlerinin ortasında gerçekten durur. Feza ve Pırıl hareket eder. Her etkinlik çevresindeki zamanı geri getirir; yalnız renk ya da parlaklık değişmesi tamamlanma sayılmaz. Bölgesel müzik ve doğa sesleri de aynı ilerlemeyle açılır.

Yedi ayrı kompozisyon: güneşli kök geçidi, turkuaz su mağarası, sıcak tilki açıklığı, mevsim terasları, ay gölü ve rasathane, adalı bulut denizi, Zaman Ağacı'nın köklü orman katedrali. Ana fizik yolu geniş ve güvenlidir; zıplamak zorunlu değildir.

Feza okuma bilmez. Yönergeler kısa Türkçe sesler, büyük hareketli nesneler ve Pırıl'ın gösterdiği hedeflerle anlatılır. Ceza, yanlış cevap ve zaman baskısı yoktur. Her sürükleme için dokunma alternatifi, uzun bekleyişte Pırıl yardımı vardır.

## 23 Ekim ikinci görsel turu

Düz yaprak katmanları ve boru gibi çizilen arka ağaçlar değiştirildi. Yakın ağaç, dört mevsim bahçesi, giriş çerçevesi ve final; gölgeli yaprak hacmi, bağlı organik dallar ve kökleri görünen ortak resim üslubunu kullanır. Tilkiler ve kuşlar ayrı gövde, tüy/kürk ve yüz parçalarıyla çizilir. Şelale kayası, oyulmuş ahşap saat, taş adalar, kumaş yelken ve ay sandalı ayrıntılandı. Etkileşimler, sayaçlar, sesler ve süreler korunmuştur.

Yerleşik Imagegen ile üretilen iki saydam varlık projeye kaydedildi:

| Varlık | Üretim tarifi |
|---|---|
| `assets/zaman/enchanted-tree-v1.png` — 1024×1536, ana ağaç | `assets/zaman/enchanted-tree-prompt.txt` |
| `assets/zaman/seasonal-trees-v1.png` — 1254×1254, 2×2 mevsim ağacı atlası | `assets/zaman/seasonal-trees-prompt.txt` |

Tariflerin tamamı ilgili metin dosyalarındadır; ikinci üretim ilk ağacı üslup referansı olarak kullanır. Resimler değiştirilmeden saklanır; kesit/ölçekleme Canvas çiziminde yapılır. Yerel dosya açılışı desteklenir. Resim yüklenmezse kodla çizilen yedek kullanılır; görüntüler SW v103 ART listesinde çevrimdışı saklanır.

## Donmuş zamanın okunaklılığı — 23 Ekim üçüncü tur

- Girişte Feza ve Pırıl yürüyebilirken kısa bir su sıçraması, düşen yaprak ve kuş hareketi görünür. Bir kez geçen sıcak zaman dalgası bunları havada durdurur. Gösteri giriş perdesi kalkmadan başlamaz; mola sırasında ilerlemez ve her bölge saatinden ayrıdır. `zamanDondu` tek seferlik ses olayını verir.
- Donmuş su buz sütunu gibi çizilmez: akışın ortasında kesilen sıvı kıvrımları ve ayrı damlalar görülür. Dokunulan damla sürekli bir yoldan hızlanarak kendi çarpma noktasına düşer, ardından sıçrama ve halka oluşur.
- Tilki, yaprak ve kuşlarda yarım kalmış hareket izleri sabittir. Mini oyunlar tamamlandıkça izler açılır; zaman bölgesel dalganın ulaştığı yerde başlar. Yerel saatler birikmiş zamanı hızlı oynatmaz.
- Ay sandalının çanı her nesneye mesafesine göre ulaşır. Kuş kanadı, kum ve düşen taç yapraklar dondukları pozdan devam eder; ilk canlı karede konum değişmez.
- B10 donukken armoni sabit kalır; ritmik yankı, yaylı ve doğa katmanları susar. Bölge açılınca mevcut melodi ve doğa sesleri kademeli döner. Eski dokuz bölümün ses yolları ve yeni anlatım kayıtları değiştirilmez.

Giriş gösterisi yeni görev değildir; bekleme, ek düğme ya da yazı gerektirmez. Mevcut 9/6/3/3 etkinlik hedefleri, sandal ve 28 saniyelik final korunur. Bu turun çevrimdışı önbelleği v104'tür.

## Durum ve yerleşim

`V10 = {damla:0, tilki:0, bahce:0, kure:0, sandal:false, sandalAktif:false, sandalAsama:0, final:false}`.

| Nesne | Sütun | Sonuç | Etkileşim |
|---|---:|---|---|
| zamanDamla | 90 | 9 damla | Yay biçiminde asılı damlalara dokunma/sürükleme; ses ve gerçek su akışı geri gelir. |
| zamanTilki | 154–159 | 6 dost | Tek açıklıkta geniş bulut trambolini; donmuş sıçrayış geri sarılır, tilki buluta iner ve yeniden sıçrar. |
| zamanBahce | 270 | 3 mevsim | Büyük mevsim çarkını çevirme veya dokunma; çiçek önce tohuma geri sarılır, yeniden büyür. |
| zamanKure | 365 | 3 anı | Birbirinden ayrı yağmur oluşturma, güneşi kaldırma ve kuşlara rüzgâr verme sahneleri. |
| zamanSandal | 397 → 442 | 3 çan, güvenli iniş | Kum saati yelkenli ay sandalında üç donmuş an; büyük çanlar kuşları, altın kum akışını ve çiçek adasını hareketlendirir. |
| zamanAgaci | 460 | final | Ana etkinlikler ve sandal tamamlanınca 28 saniyelik kök, gövde, taç ve bütün vadi uyanışı. |

Ana etkinliklerin hemen sonrasındaki `miniKapi` nesneleri `bagId` ile bağlıdır. Sandalın kapısı c402'dedir: kapı önüne atlayarak inen çocuk da otomatik başlama alanında kalır. Tamamlanma `o.done/o.tk.bitti` ile bildirilir. Son ağaç, sandal yolculuğu bitmeden başlamaz.

## Dosyalar ve API

- `bolum10.js`: 500 sütunluk güvenli harita, yerleşim ve bölüm kamera bölgeleri.
- `dunya10.js`: katmanlı dünya, sabit sanat önbellekleri, bölgesel hareket saatleri. `dn10BolgeSaat(x)` ve `dn10BolgeUyanis(x)`, `dn10IsikEkle(x,y,col,r)`.
- `zaman10.js`: şelale, tilkiler, mevsimler, anılar ve ağaç; `z10/Z10` adları.
- `zamanyol10.js`: ay sandalı, çanlar ve donmuş yolculuk anları; `zy10/ZY10` adları.
- `ses.js / sesler.js / muzik.js / sahne.js`: yalnız B10 için yeni sözler, kayıtlar, müzik, kavanoz ve sabah hatırası.
- `index.html / sw.js / oyun.js / arayuz.js`: koşullu yükleme, hedef bağlantısı, resimli sonuç kartı. Yeni dosya çevrimdışı listede; önbellek v104.

`ZAMAN10`: `aktif` (etkin nesne/null), `hedef()`, `kameraKutu()`, `hedefPiril()`, `finalAn()`, `isit()`.

`ZAMAN_YOL`: `aktif` (boolean), `an` (oyun saniyesi), `ilerleme` (0..1), `konum` ({x,y}), `asama` (0..3), `hedef()`, `kameraKutu()`, `hedefPiril()`, `isit()`.

Etkinlikler `P.ucus=o` ile fiziği devralır. B10 genel uçuş yakınlaştırmasına girmez; her etkinlik `omDikkat/omDkEkle` ile gerçek hedeflerini çerçeveler. Feza/Pırıl birer kez çizilir. Etkinlik bitince giriş niyetleri ve hızlar temizlenir; güvenli yürüme geri verilir.

## Dokunma ve kesintiler

Gerçek çizim hedefleri büyük hit alanlarına sahiptir. Hareket eden kamera sırasında alanlar ekran koordinatından güncel dünya koordinatına çevrilir. Yürürken tutulan aynı parmak hedefe gelince devralınabilir; hover ilerleme sağlamaz. İkinci parmak etkin parmağı değiştirmez. Sağ üst menü alanı serbest kalır.

`pointercancel`, capture kaybı, blur, pagehide, gizlenen sekme, yeniden boyutlandırma ve yön değişimi yalnız jesti bırakır; kazanılmış ilerleme korunur. Oyun durduğunda etkinlik saati ilerlemez. Klavye yedeği Space/Enter/E'dir. Sandalda geniş dikey yönlendirme vardır; çanı doğrudan dokunarak çalmak için tekneyi hassas konumlandırmak gerekmez.

Yardım gecikmelidir. Sandalda beklenen çan yakınındayken 16 saniye etkileşim olmazsa Pırıl çanı çalar; tamamen dokunulmadan yolculuk yaklaşık 62 saniyede güvenli biter. Çocuk katılınca yardım sayacı yeniden başlar.

## Olaylar ve ses

Ana etkinlikler: `zamanBasla`, `zamanAdim`, `zamanBitti`, `zamanFinal {o,box,duration:28}`, `zamanDoruk` (12. saniye), `zamanTamam`.

Sandal: `z_sandalBasla {o}`, `z_sandalIlkCan {o}`, `z_sandalAdim {o,n,helper}`, `z_sandalDoruk {o}`, `z_sandalBitti {o}`. Olaylar anlatı/müzik evresini değiştirir; efektleri sandal bir kez çağırır. Efektler `z_sandal`, `z_yildiz`, `z_sandal_doruk`, `z_sandal_inis`.

Ses metinleri `/*SESLER*/` bloğunda, kayıtlar `sesler.js` bankasındadır. Eski bölümlerin kayıtları korunur; artık geçerli olmayan B10 yönergeleri kuyruktan düşer.

## Performans ve doğrulama

Sabit sanat bir kere tuvale hazırlanır; karede gradyan, filtre ve shadowBlur üretilmez. Dünya önbelleği ve parçacık sayıları sınırlıdır. Animasyon oyun dt'siyle ilerler. Masaüstü her rAF'ta çizilir; tablet/telefon 60 FPS sınırını korur. Bu bölüm için ortak FPS/fizik kuralları değiştirilmez.

23 Ekim 2026 ilk yeniden yapımı aşağıdaki kontrollerle doğrulandı. Bu ilk ölçümler ikinci görsel turundan öncedir; ikinci turun sonuçları en altta ayrıca kaydedilir.

- Baştan sona gerçek dokunma ve yürüme turu: 9 damla, 6 tilki, 3 mevsim, 3 anı, 3 sandal çanı, güvenli iniş, ağaç finali, sonuç kartı ve seçim odasına dönüş. Oyun ve tarayıcı hatası 0. Sonuç kartı yatay/dikey iPad ölçülerinde incelendi.
- Dokunma kenarları: saat çerçevesine basma, parmak kaldırmadan sıradaki tilkiye geçme, sürükleme, ikinci parmak, pointercancel, yön değiştirme ve ekran boyutlandırma. Mola sırasında tilki, mini oyun ve tamamlanmış anı animasyon saatleri sabit.
- Bölgesel dünya: ilk 600 kare hareketsiz; yalnız tamamlanan bölgenin saati açılır. Görünür mola ve duraklatma, birikmiş zaman olmadan devam etme, finalin doruğunda bütün bölgelerin açılması doğrulandı. Arazi önbelleği en çok 8 parça; ışık listesi en çok 24; ısınmış çizimde yeni gradyan 0.
- Sandal yaşam döngüsü 30/60/120/180 Hz adımlarında geçti. Tamamen yardım ile bitiş 61,82–61,93 saniye; tek iniş olayı, güvenli konum, duraklatma ve geçersiz dt korumaları doğru. Üç sabit `zamanYolAni` çizim ankrajı, sandal uzaklaşsa da adaları görünür tutar; ilk adaya geri yürüyüş tarayıcıda doğrulandı.
- 1–10 bölüm açılışı: eksik nesne türü ve hata 0; yeni modüller yalnız 10. bölümde yükleniyor. Bu kontrol önceki dokuz bölümün tamamını oynayarak bitirme testi değildir.
- `file://` açılışı ve klavye hareketi geçti. Yeni profil v101 önbelleğini kurdu; bağlantı kesilip sayfa yenilendiğinde B10 ve sandal modülü çalıştı.
- 35 B10 ses kaydı çözüldü; eski 286 kaydın metin, süre ve MP3 verisi değişmedi. İlk dokuz bölümün müzik olayları karşılaştırmasında 9/9 eşleşme. Yeni müzik/efekt çevriminde kırpılma saptanmadı.
- 68 JavaScript dosyası ve dört HTML içi script sözdizimi kontrolünden geçti.

Aynı Windows bilgisayarda, izole Chrome ile her sahnede ısınma sonrası 8,5 saniyelik örnekler:

| Sahne | Masaüstü FPS | Tablet profili FPS | Masaüstü JS p95 | Tablet JS p95 |
|---|---:|---:|---:|---:|
| Şelale | 177,89 | 60,06 | 0,70 ms | 0,90 ms |
| Mevsim bahçesi | 176,94 | 59,90 | 0,70 ms | 0,80 ms |
| Ay sandalı | 178,96 | 60,01 | 0,70 ms | 0,90 ms |
| Büyük ağaç finali | 177,00 | 59,95 | 0,70 ms | 1,40 ms |

Masaüstü görünümü 1920×1080, tablet görünümü 1194×834 ve cihaz piksel oranı 2 (oyunun tablet yoğunluk sınırı geçerli). Masaüstü kare sınırı 0, tablet hedef aralığı 16,67 ms olarak doğrulandı. JS ölçümü GPU dahil toplam kare süresi değildir; FPS değerleri bu bilgisayardaki kısa örneklerdir. Fiziksel iPad performansı için kanıt sayılmaz.

Sessiz geliştirme adresi: `?bolum=10&atla&sessiz`. Testler izole tarayıcı profilleri kullanır; kullanıcının oynadığı pencere/kayıtlar değiştirilmez. Fiziksel M1 iPad mevcut değildir; masaüstünde iPad ölçülerinde ve dokunma emülasyonuyla yapılan kontroller gerçek cihaz ölçümü değildir.

### İkinci görsel turun son kontrolü — 23 Ekim 2026

İki resim atlası ve son ağaç yerleşimleri dahil son sürüm, aynı Windows bilgisayarda izole Chrome ile ölçüldü. Her sahne için ısınma sonrasında 8,5 saniyelik örnek alındı; aşağıdaki değerler fiziksel iPad ölçümü değildir.

| Sahne | Masaüstü FPS | Tablet profili FPS | Masaüstü JS p95 | Tablet JS p95 |
|---|---:|---:|---:|---:|
| Büyülü orman | 178,25 | 59,96 | 0,80 ms | 1,10 ms |
| Şelale | 178,08 | 59,98 | 0,70 ms | 0,90 ms |
| Mevsim bahçesi | 177,84 | 60,02 | 0,70 ms | 0,80 ms |
| Ay sandalı | 178,02 | 59,90 | 0,80 ms | 1,10 ms |
| Büyük ağaç finali | 178,24 | 59,98 | 0,80 ms | 0,80 ms |

Her iki profilde oyun hatası 0; masaüstü kare sınırı 0 ve tablet aralığı 16,67 ms. Görünümler 1920×1080 ve 1194×834 (tablet DPR 2); oyun yoğunluk sınırı geçerli. JS p95, GPU dahil toplam kare süresi değildir.

- 1–10 bölüm açılışı tekrar geçti: eksik nesne türü, oyun hatası ve geçersiz konum 0; yeni modüller yalnız B10 içinde yüklendi. Bu, ilk dokuz bölümü baştan sona bitirme testi değildir.
- Yerel file:// açılışında iki görsel de yüklendi; klavye hareketi ve sandal nesnesi çalıştı.
- Yeni profil v103 önbelleğine iki PNG ile sandal kodunu aldı. Ağ kesilip sayfa yenilenince bölüm ve iki görsel tekrar yüklendi; hata 0.
- Görsel istekleri engellenince kodla çizilen ağaç yedeği çalıştı; hata 0.
- Sandal inişinden sonra ilk adaya geri yürüme geçti; üç sabit çizim ankrajı korundu, ilk ada görünür kaldı.
- Son kaynakta 68 JavaScript dosyası ve dört HTML içi script sözdizimi kontrolünden geçti; Git boşluk kontrolü temiz.
- Bölgesel donmuş zaman/uyanış, dokunma hedefleri, etkinlik sayıları ve süreleri bu görsel turda değiştirilmedi. Yatay ve dikey yerleşimler resimlerle gözden geçirildi.
### Donmuş zaman turunun doğrulaması

- Normal girişte sahne/perde boyunca gösteri ve olay sayısı 0; görünür oyunda hareket başladı, tek donma olayı oluştu. Donuş anında altı bölge saati, 251 yerel saat ve yıldız saati hâlâ 0. Kontrol serbest; yürüyüş devam ediyor. Yatay/dikey kadraj ve mola doğrulandı.
- Yerel saat kare başına dt'yi aşmıyor; dalga yarıçapı tavana gelince saatler çalışmaya devam ediyor. Bölge değişiminde yıldız fazı sıfırlanmıyor. Önceki dünya saat/önbellek kontrolleri ile 800 kare sonlu çizim turu geçti.
- Dört mini oyunda dokunulmamış görüntü farklı genel yaş değerlerinde piksel olarak aynı. Gerçek dokunmayla damla/tilki tamamlandı, bahçe/anı ilerledi; mola konum ve ilerlemeyi korudu. 9/6/3/3 hedefleri ve tek final kontrolü geçti.
- Üç sandal sahnesinde donuk görüntü sabit, ilk canlı kare donuk pozla aynı ve sonraki hareket farklı. Üç çana dokunma ve güvenli iniş geçti; sıcak çizimde yeni gradyan 0, filtre yok. 30/60/120/180 Hz yaşam döngüsü ve mola kontrolleri geçti.
- Ses: ilk dokuz bölümün eski/yeni planlanan ses çizelgeleri birebir eşleşti. B10 120 saniyelik çevrimde tepe 0,423; taşma, geçersiz örnek ve düşen ses 0. Donma sesi bir kez çalıyor; sessiz mod ses bağlamı açmıyor.
- 1–10 bölüm açılışında hata/eksik tür 0. file://, v104 çevrimdışı açılış, iki resmin yüklenmesi ve resim engellenince yedek çizim tekrar geçti. 68 JavaScript ve dört HTML içi script sözdizimi kontrolü temiz.
- Son Windows Chrome ölçümü: dört sahnenin her birinde ısınma sonrası 8,5 saniye; masaüstü 177,95–178,15 FPS, tablet profili 59,96–60,02 FPS. JS p95 masaüstünde 0,80 ms, tablet profilinde 0,80–1,00 ms. Oyun/tarayıcı hatası 0. Bunlar aynı bilgisayardaki kısa örneklerdir; fiziksel iPad veya toplam GPU kare süresi ölçümü değildir.
### Menü sırası ve yayın sürümü

Ebeveynin son isteğiyle Zamanın Uyuduğu Vadi seçim rafında dördüncüdür: `9, 8, 7, 10, 6, 5, 4, 3, 2, 1`. Sahne katmanı listeyi yeniden numaraya göre sıralamaz. Raf ilk kavanozdan açılır; son oynanan veya henüz oynanmamış bölüm otomatik olarak öne taşınmaz. Bölüm kimlikleri ve kayıt işaretleri korunur.

Gerçek tarayıcıda temiz kayıt, son oynanan B10 ve yalnız B10 oynanmamış durumları aynı sıralamayı gösterdi. Dördüncü kavanoza gerçek dokunma B10'u açtı; hata 0. v105 çevrimdışı yenilemede de sıra ve açılış konumu doğru. Güncel yayın önbelleği v105'tir.