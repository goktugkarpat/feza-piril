# İpek Göğü — Bölüm 13 sözleşmesi

Feza, annesi ve Pırıl'ın birlikte yaşayan gök bahçelerini uyandırdığı bağımsız rüya. 5 yaş; yalnız Türkçe; okuma, kaybetme, süre baskısı yok. Önceki rüyalar korunur; kullanıcının kaldırdığı eski iç kimlik 10 yeniden kullanılmaz. Yeni düğme eklenmez. Yürüme, zıplama, büyük nesnelere dokunma ve geniş sürükleme; bekleyen çocuğa Pırıl/anne yardımcı olur. Ana yol kesilmez. Etkinliklerle oynama süresi çocuğun keşif hızına bağlıdır; süre hedefi veya bekleme kapısı yoktur.

## Modüller
- `bolum13.js`: 720 sütunluk kesintisiz yol, 39 etkinlik/çalışma nesnesi (12 gerçek bahçe yaprağı dahil) ve yedi kamera bölgesi. Ortak motorun çalışma nesnesiyle oyundaki toplam 40 nesnedir.
- `dunya13.js`: `dn13Background/Motes/World/Petals/Foreground/Vignette/Isit`. Hazır arka plan resmi kullanmaz; yedi bölgesel ışık, sınırlı çizim önbelleği ve karelere dağıtılan hazırlama kuyruğu.
- `ipek13.js`: dokuma, minder, çizim, perde, gök düğümleri, yolculuk ve final. Güncelleme/çizim ana `TUR` sözleşmesiyle yapılır. `IPEK13.hedef()` hedefi, `state()` yalnız geliştirme incelemesini sağlar. `test()` eylemleri yalnız `?atla` ile çalışır.
- `anne13.js` / `fezapoz13.js`: `anne12.js` üzerinde `gorunum:'gok13'` seçeneğiyle referans anne: alçak at kuyruğu, beyaz bluz, lacivert pantolon, açık ayakkabı; diğer bölümün çizimi korunur. Bölüme özgü hareketli pozlar, ortak bakış, tek inci geçişi ve tek çizim sahipliği; `IP13CHAR.adim/ciz/poz/state`.
- `gokbahce13.js`: gökte yüzen sevimli ışık canlıları ve yüzen adalardan dökülen yıldız çağlayanları; altı sınırlı çizim önbelleği, yalnız B13 içinde yüklenir. Yüzgeç/kuyruk kesintisiz Bézier biçimleriyle esner. Dokunma `ipekGokDost` olayını üretir; yönlendirme girdisini ele geçirmez. `bakisHedef()` değiştirilmeyen, tekrar kullanılan `{x,y,u}` dünya hedefini verir. Finalde 13,7–23 saniye aralığında aynı dost geri döner; bakış ağırlığı sarılmadan önce söner.
- `sahne13.js`: yaşayan seçim kavanozu, sabah penceresi, ışıklı filiz hatırası ve final gök bahçesi çizimleri; bütün bölümlerde seçim için yüklenir.
- `muzik13.js`: `MZ13`, ortak `AU` çalgılarına bağlanan özgün altı sekizlik beste ve yumuşak ipek efektleri. Kendi ses bağlamını açmaz.
- `ses13.js`: `IP13SES.adim(dt)`, yaklaşma ipuçları ve eskiyen talimatların geçerliliği. Onaylı 16 Türkçe kayıt `sesler13.js` içinde, üretim `gen_voice.py --bolum13`. Yeni yönle uyumlu 16 kayıt toplam 66,3 saniyedir; eski perde/makara talimatı verilmez.
- Ana bağlar: `index.html`, `oyun.js`, `sahne.js`, `arayuz.js`, `muzik.js`, `ses.js`; çevrimdışı kaynaklar `sw.js` v158.

## Harita / görünür ana yol
T=40; ROWS=30, COLS=720, temel ayak çizgisi y=720 (row18). Ana yol yürüme/zıplamayla kesintisiz geçilir; köprü ve bütün yürünebilir zemin, görünür alanın tamamında etkileşimden önce hazırdır. Etkileşimler kök dallarını, öz suyu ve isteğe bağlı basamakları canlandırır. Rampa/tepe varsa grid ile yüzey çizimi birebir aynı olmalı.
Bölgeler (sütun):
- 0–90 İplik Kıyısı: anneyle varış, Pırıl'ın ipliği; dokunmayla canlanan ışık tohumları.
- 90–170 Dokuma Köprüsü: Feza ve anne iki ışık ipliğini birleştirir; kalıcı köprü üzerindeki canlı kökler ve isteğe bağlı yaprak basamakları büyür. Büyük hedefler; dokun/sürükle; yürüyen çocuğun akışı kilitlenmez.
- 170–285 İpek Tepeler: nefes alan bulutlar (görünür yumuşak yükselme, kontrollü sıçrama, anne aşağıda el açar). İsteğe bağlı oyun.
- 285–390 Kelebek Bahçesi: parmakla ışık izi çizme; çizilen izin ardından ışık kelebekleri ve üzerine basılabilen üçer bitki büyür. (Kelebekler kullanıcı tarafından özellikle istendi; böcek yok genel kuralının bu rüyadaki istisnası yalnız bu soyut ışık kelebekleri.)
- 390–470 Perde Korusu: geniş dokunma/sürüklemeyle kuzey ışığı tüllerini aralayıp bahçeyi uyandırma. Anne karşı ucunu tutar.
- 470–630 Kurdele Yolculuğu: anne ve Feza aynı geniş yaşayan yaprakta; Pırıl önde. Ekranda basılı tutarak yol gösterme, canlı dünya karşılık verir; güvenli, başarısızlık yok. Yaklaşık 40–50s. Başlangıç/iniş yumuşak.
- 630–720 Göğü Örme Meydanı: 646/665/680 sütunlarında dokununca canlanan üç ışık tohumu; final merkezi c690. Işık köklerinin geçici iskelesinden ayrılan yapraklar ve ışık canlıları, birlikte örülen hareketli yıldız göğüne dönüşür, sarılma. 30s yumuşak final. Sabah küçük ışıklı bir filiz hatırası.

## Paylaşılan durum / olaylar
`V13 = {kopru:0,minder:0,kelebek:0,perde:0,yolculuk:false,yolculukAktif:false,final:false}` `index.html` içinde tanımlanır. İlk dört alan 0..1 normalize ilerlemedir; sonuç kartı tamamlanan gerçek nesneleri sayar.
Olaylar: `ipekKopruBasla`, `ipekKopruAdim` ({u}), `ipekKopruTamam`; `ipekMinder` ({x,y}); `ipekIz` ({x,y,u}); `ipekKelebekTamam`; `ipekPerdeAdim` ({u}), `ipekPerdeTamam`; `ipekYolculukBasla`, `ipekYolculukAn` ({u}), `ipekYolculukBitti`; `ipekFinalBasla`, `ipekGokYukseldi`, `ipekFinalBitti`. Ek olay `ipekDilek` ({x,y,sira}); sesler olay ve süre aralığıyla sınırlıdır.
Final `ipekFinalBitti` → `omFinalPlanla(2)`; asıl sabah/kayıt mekanizması korunur.
`window.IP13CHAR`: `adim(dt)` (lider her kare çağırır), `ciz(tm)` (Feza'dan önce anne), `poz(ad,opt)` kısa poz (dokuma, hayran, saril, yolculuk); Anneyi oyuncu gibi kontrol etme; çocuk Feza'yı yönetir. Anne hiçbir etkinlikte kaybolmaz/ışınlanmaz. Yolculuk/finalde karakter çizim sahibi yalnız bir tane olmalı.
`src/sahne13.js`: `sh13Fon(ctx,w,h)`, `sh13Canli(ox,oy,w,h,tm,a,hov)`, `sh13Ikon(ctx,r)`, `sh13Sabah(tm,a)`, `sh13Hediye(tm,a,uyan)`, mümkünse giriş hazırlama `sh13Isit()`; lider sahne.js'te bağlar.

## Görsel dil ve performans
Yenilenen sanat yönü: Işık Ormanı, Bulut Ülkesi ve Balkabağı Gecesi ile aynı canlı masal dili; ay ışıklı gök bahçeleri, büyüyen ışık kökleri, doğal yosun/taş zemin, hacimli bulutlar, rüzgârla hareket eden fantastik bitkiler. İlk sürümün oryantal perde/halı/altın nakış görselleri kullanıcı tarafından reddedildi ve silindi. Hazır saten panoraması, makara, kumaş halı ve süslü perde yok; ipek fikri yaşayan ışık akışları ve gökyüzüne dönüşen ortak yıldız örtüsüyle hissedilir. Kahraman okunaklı, zemin belli, az ve kontrollü parçacık. Canvas2D; önbellek atlaslar, culling, sabit havuzlar; karede shadowBlur/filter/getImageData yok. Animasyonlar gerçek dt ve her çizilen karede sürekli; ayrı 15/30 FPS pozu yok. DPR/çözünürlüğe dokunma. Mevcut cihaz profili korunur. `dt=0` ve resize güvenli. Bütün modüller BOLUM_NO!==13 ise hemen çıkar veya iş yapmaz.

Testler yalnız /tmp veya Codex görsel klasöründe; proje içine geçici test dosyası koyma. Şimdilik GitHub'a gönderme; bu istek geliştirme/yerel deneme için, yayın ayrıca istenince.

## Son doğrulama
- Normal klavye/dokunma girdileriyle baştan sabaha kadar tam tur; ışınlanma/ilerlemeyi zorlama yok. Etkinliklerle yaklaşık 222 saniyelik seçim/yatak dahil test rotası tamamlandı; çocuk keşif hızı süreyi değiştirir.
- Büyümekte olan ilk tohum ve çizim yaprağına gerçek zıplamayla inme, üzerinde kalma ve yürüyerek ayrılma; platform ayakları kesintisiz taşır.
- 30/60/120/200 çizim sıklığıyla durum/animasyon akışı, dt=0/NaN, tekrar etkileşim, parmak iptali, sekmenin gizlenmesi ve geri dönüş; ayrı düşük FPS animasyon kilidi yok.
- Yatay/dikey kadraj, uçuş/finalde tek karakter çizim sahipliği, ev düğmesinde kısa dokunuşun çıkış yapmaması ve basılı tutunca güvenli dönüş.
- Yeni HTTP önbelleğiyle ilk kurulumdan sonra ağ kapalıyken B13 açılışı; yalnız 113 oyun kaynağı, kaldırılmış B10 dosyası yok. Sessiz kipte Audio/AudioContext oluşturulmaz.
- Önceki rüyaların açılışları ve kalan eski kayıtların birebir korunması; eski iç kimlik 10 bağlantısından/kaydından seçim rafına güvenli dönüş.
- Tarayıcıdaki bu otomatik kontroller gerçek iPad/Safari donanımında ölçüm yerine geçmez. Masaüstü/tablet çözünürlük ve FPS profilleri değiştirilmedi.

## 28 Ekim cila geçişi
- Uzak katmanlarda eleme ekran koordinatında `[0,W/S]` ile yapılır. Paralaks nesnelerinin görünür sağ sınırına paralaks çarpanı tekrar uygulanmaz. Bölge sınırlarında dekor aç/kapa yok; sabit dünya koordinatında görünürlük ve sürekli geçiş vardır. Bulutların kayma periyodu tekrar aralığıyla aynıdır.
- Zemin ve köprü bütün görünüme baştan çizilir; yaprak basamaklarının hareketli biçimi temas eden orta bölümüyle uyumludur. Gövde/taç yapraklar ayrı açılır; ana yaprağın genişliği görünür yüzeye uyar. 9 kenar/merkez inişi ve 12 bahçe basamağı doğrulandı.
- Dev ışık alanları ilk hazırlamada analitik piksel yazımıyla üretilir; büyük gösterimde düzenli gradient benekleri yoktur. Karede okuma/yazma, filtre ve ek çizim döngüsü yok. Dünya hazırlaması 51 işe dağılır, her karede en çok bir iş; GOK hazırlaması son dünya işinden sonraki karede başlar.
- Kapasite: 96 çizim izi, 36 sıradan ışık dostu, 40 küçük parıltı, 8 bulut dalgası, her biri 64 noktalı 4 çizilmiş yol dostu ve 12 kalıcı son bahçe. Dolu son bahçeler yer değiştirmez; sonraki dokunma yakını canlandırır.
- Kamera normal yüksek yapraklarda anne ve çocuğu birlikte tutar; Pırıl annenin başı çevresinden yaylı uçuşla geçer. Yeni anne her karede eklem/yüz/saçla çizilir; durağan resim veya düşük FPS poz dizisi yok.
- Sessiz gerçek oynanış turu seçim ekranı → yatak → bütün etkinlik türleri → uçuş → gök bahçesi → sarılma → sabah kaydı. Ek olarak dört ekran oranında 620 kamera konumu ve 17.188 beklenen ada çizimi denetlendi; atlanan görünür ada yok. Gerçek iPad/Safari donanımında ölçüm yapılmadı.
