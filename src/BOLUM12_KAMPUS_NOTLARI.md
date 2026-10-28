# Bölüm 12 — Kampüs yerleşimi ve görsel cila notları

28 Ekim 2026. Bu sahne Sabancı Üniversitesi Tuzla kampüsünün **resmî komşuluklarına göre uyarlanmış iki boyutlu bir yürüyüş panoramasıdır**; ölçekli bir harita veya birebir mimari rekonstrüksiyon değildir. Aktivitelerin konumu, düz yürüyüş zemini ve kesintisiz çocuk dostu akış korunur.

## Yerleşim

[Resmî kampüs planı](https://www.sabanciuniv.edu/sites/default/files/2023-12/kampus_haritasi_0.pdf) görsel olarak incelendi. Lojmanlar, FENS ve SUNUM aynı akademik bölgenin yakınındadır. Üniversite Merkezi/yemekhane FENS ve SBS tarafındadır; FASS ile Bilgi Merkezi komşudur. Gösteri Merkezi ile Spor Merkezi göletin aynı kıyısındadır.

Panoramada korunan sıra:

- Lojmanlar → SUNUM (`c82`) ve FENS (`c125`). SUNUM, FASS–Bilgi Merkezi arasından FENS'in yakınına alındı.
- Üniversite Merkezi (`c222`), yanında yazısız şemsiyeli küçük sosyal teras (`c240`), ardından SBS (`c293`).
- FASS (`c372`) → merkez çimeni/uzak akademik cephe (`c441`) → Bilgi Merkezi/kütüphane (`c505`) ve gözlem kulesi (`c547`).
- Bahçe ve gölet yürüyüşü; kıyıda Gösteri Merkezi (`c880`) ile Spor Merkezi (`c901`). Botanik bahçesi ve sera oyun dünyasının stilize, hayalî uzantılarıdır.

SBS'nin botanik ve gölet çevresindeki tekrarları genel fakülte/yurt çizimleriyle değiştirildi. Tek bir SBS görseli akademik merkezde kaldı. Son bölümdeki kıyı panoraması aynı kampüse başka bir bakış olarak kullanılır.

## Yapılar ve görsel dil

- **Bilgi Merkezi, kütüphanenin kendisidir.** [Üniversitenin açıklaması](https://www.sabanciuniv.edu/tr/arastirma/arastirma-olanaklari/bilgi-merkezi) kubbeli yapıyı doğrular. Mevcut cam rotunda, yatay güneş kırıcılar ve yan kanatlar korunur; keyfî bir büyük kubbe eklenmez.
- **Ana yemekhane Üniversite Merkezi'nin içindedir.** [Resmî kampüste yemek sayfası](https://iro.sabanciuniv.edu/en/where-eat-campus) bu işlevi doğrular. Eklenen küçük teras, masa/şemsiye/çiçek siluetleriyle bu sosyal işlevi anlatan bir oyun dekorudur; belirli bir işletmenin birebir çizimi değildir.
- **Kule, gözlem kulesidir; saat kulesi değildir.** [Üniversitenin 2025 Lise Yaz Okulu broşürü](https://liseyazokulu.sabanciuniv.edu/sites/default/files/2025-06/SU_LYO_brosur2025_3.pdf) yapıyı “Gözlem Kulesi” diye adlandırır. [Resmî FENS kampüs fotoğrafı](https://fens.sabanciuniv.edu/sites/fens.sabanciuniv.edu/files/card/2023-11/layer-2-copy_0.jpg) açık taş gövdeyi, düşey camları ve seyir balkonunu destekler. [Kampüs bakım bölge listesinde](https://mysu.sabanciuniv.edu/purchasing/sites/mysu.sabanciuniv.edu.purchasing/files/2022-861709_teknik_sartname.pdf) Bilgi Merkezi'nin kule tarafı ve havuzu ayrı bölgeler olarak yer alır.
- İyi durumdaki sekiz boyalı kampüs resmi korunur. Dış kaynak fotoğrafları oyuna kopyalanmaz; yalnız araştırma referansıdır.
- Kodla çizilen bitkilerde doğal sıcak zeytin yeşilleri, krem yaprak uçları ve yumuşak kiraz pembeleri kullanılır. Kuleyi gizleyen ön ağaç arka katmana alınır.

## Görsel bütünlük ve maliyet

Sekiz bina çizimindeki ağaç/palmiye taçları ile beş arka plan ağacı türünün yaprak uçları önbellek tuvalinin kenarında kesiliyordu. Her binanın gerçek dekor genişliğine uygun pay ve arka plan ağaçlarına 12 birim saydam kenar eklenerek bu kesikler giderildi; ekran dışına çıkarma sınırları ve gölet yansımaları aynı payı kullanır. Gündüz/gece çözünürlüğü düşürülmedi.

Teras yalnız bir kez hazırlanan `465 × 156` piksellik tuvaldir. Ekranda olduğu sürece kare başına tek `drawImage` kullanır; kare içinde yeni gradyan veya dizi oluşturmaz. Yerleşim değişiklikleri çarpışma, dokunma, ödül, kamera veya hareket hızını değiştirmez.

Doğrulama: sekiz binanın gündüz sağ/sol, gece sağ/sol/üst ve beş arka plan ağacının sağ/sol/üst tuval kenarında kesilen opak piksel sayısı sıfır; SUNUM ve SBS birer konumda; kule önünde onu gizleyen yakın arka plan ağacı yok. Kampüs, kütüphane, kule ve sera kadrajlarında tarayıcı hatası ve oyun hata kalkanı sayacı sıfır.


Yerel `file://` açılışı ayrıca `1896 × 988` gerçek tarayıcı alanında denendi. Üniversite Merkezi/teras, merkez çimen, Bilgi Merkezi/kule ve sera kadrajları kontrol edildi; tarayıcı günlüğü ve oyun hata sayacı sıfırdı. Bu görsel ve işlevsel kontrol, gerçek iPad donanımında kare hızı ölçümü yerine geçmez.

Gölet resminin su yansımalarının düz çizim suyuna bağlandığı kenar da yumuşatıldı. Kıyı ve binaların üstü aynı kalır; yalnız su satırlarında yan alfa geçişi %14'ten %26'ya genişler. Tam çözünürlüklü türev bir kez hazırlanır (yerel ölçümde yaklaşık 5 ms); kaynak resim, kalıcı önbellek boyutu ve kare başına çizim sayısı değişmez.
