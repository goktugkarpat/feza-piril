# Bölüm 12 — "Annemle Sabancı'da Bir Gün" (yeniden yapım sözleşmesi)

> Durum (27 Ekim 2026): 10 ajanla yeniden yapıldı ve tümleştirildi. Uçtan uca akış testi (dokunmadan basılı yürüyüş): ~165 sn, Feza'nın
> ilerleyemediği süre ≤2 sn, anne hiç önde değil, 0 hata; 1–12 tüm bölümler hatasız açılıyor. Kampüs katmanlarını üreten betik ARKA'nın
> `kes.py`'si; kaynak tam resimler (lojman.png, fens.png …) git geçmişinde (commit fd71ba0). Anne boyu oyunda ~136 birim (Feza 80).

İlk sürüm (commit fd71ba0) ebeveyni memnun etmedi. Ebeveynin şikâyetleri (bu belgenin tek amacı bunları gidermek):
1. **Annenin animasyonu çok kötü** (düz, çıkartma gibi, cansız).
2. **Anne Feza'nın ARKASINDA yürüsün** (önüne geçmesin, yanına yapışmasın).
3. **Oyun çok kopuk, devamlı kesiliyor**: her etkinlik Feza'yı durduruyor, ışık perdesi önünü kapatıyor, bir şey yapmasını
   bekliyor, sonra Feza'yı geri ışınlıyor. 14 ayrı küçük oyun arka arkaya → hep dur-kalk.
4. **Bisiklet animasyonları çok kötü**; Feza annesiyle aynı bisiklete binmiş. Doğrusu: **anne kendi bisikletine, Feza ayrı
   (kendi küçük) bisikletine ya da mavi scooter'ına** biner.
5. İstenen: **çok daha akıcı, animasyonları çok güzel**, Sabancı Üniversitesi binaları **fotoğraflardan alınıp stilize edilmiş gibi**.

Ölçüt: Bölüm 7/8/9/11 kalitesi ve üstü. 5 yaşındaki Feza oynuyor; okuma yok, korkutucu hiçbir şey yok, kaybetme yok.

## Altın kurallar (her ajan için)
- **AKIŞ:** Bölüm 12'de `miniKapi` YOK, ışık perdesi YOK, ekranı kaplayan panel YOK, "dur ve şunu yap" YOK, kararma/ışınlanma YOK.
  Feza hep yürüyebilir. Etkinlikler yürürken/sürerken yolun üstünde ve çevresinde olur; dokunursa güzel bir şey olur,
  dokunmazsa da kendiliğinden güzel bir şey olur ve yol devam eder (kaçırmak sorun değil).
- Kontrolün el değiştirdiği tek yerler **binişler** (scooter, bisiklet, kayık). Binişte de Feza kumanda eder: ekrana basılı
  tut = hızlan/ilerle, bırak = yavaşça süzül; geri gitmek gerekmez. Biniş ve iniş **yumuşak bir animasyondur** (0.5–0.9 sn:
  Feza scooter'a adımını atar, anne bisikletine biner), kesme/kararma/ışınlanma değildir. İnişte Feza tam aracın yanında
  ayakta kalır, `P.x` sıçramaz.
- Kamera hep yumuşak; zoom değişimleri yumuşatılmış. Karakterler ilk sürümdekinden **büyük** görünür (KOORD zoom ~0.95–1.0).
- **Anne hep Feza'nın arkasında**: Feza sağa yürürken anne solunda, ~70–130 birim geride; Feza durunca anne yanına yaklaşıp
  (≥55 birim geride) durur, ona bakar; Feza geri dönerse anne kenara çekilip bekler, Feza tekrar ileri gidince yine arkasına düşer.
  Annenin hızı Feza'ya yumuşak yetişir (ani hızlanma/kayma yok, ayak kayması yok: adım uzunluğu hıza bağlı).
- Performans: iPad'de 60 FPS. Karede `createLinearGradient`/`createRadialGradient` yığını yok (önbellekle), büyük resimler
  önceden `decode()` edilir (bölge girişinde takılma yok), karede `new` ile dizi/nesne yağmuru yok.
- Kod: klasik script, ES module yok, kütüphane yok, `file://` ile de çalışır. Okunur kod yaz: tek satıra sıkıştırılmış
  (minify gibi) kod YOK; çevredeki dosyaların (feza.js, yavru.js, buyukanne.js) yorum ve isimlendirme üslubu. Türkçe yorum.
- Her şey yalnız `BOLUM_NO === 12` iken çalışır; diğer 11 bölüm bozulmaz.
- Sesler: Pırıl `p_q_*`, anne `an_q_*`, anlatıcı `a_q_*`. Ses yalnız MUZIK ajanının dosyalarında (aşağıda).
- Oyun asla takılmaz: bir modül yüklenemezse/hata verirse yol yine yürünür (oyun.js hata kalkanı var).

## Hikâye ve harita (T = 40, COLS = 900, zemin düz: satır 18, `yuzey(c) = 720`)
Gün sabah başlar, yol boyunca öğleden sonraya, gölette altın saate, tepede gün batımına döner (`dn12Gun()` 0..1).

| bölge | sütun | ne olur |
|---|---|---|
| `lojman` | 0–70 | Sabah. Lojmanların önü. Feza (başlangıç sütun 8) annesiyle evden çıkmış; Pırıl uçuyor. Yol kenarında çiçek tarhı (`k12Bahce` 12–60): Feza geçerken/dokununca çiçekler açar, anne bir çiçeği koklar. Bisiklet parkı (64): annenin bisikleti + Feza'nın mavi scooter'ı. |
| `yol1` | 70–300 | **Biniş 1** (`k12Binis` ad `yol1`, 66→296): Feza mavi scooter'ında, anne kendi bisikletinde ARKADAN gelir. FENS, Üniversite Merkezi (kubbe), ağaçlı uzun yol. Yol boyu küçük sürprizler (sabun köpükleri, uçuşan çiçek yaprakları, el sallayan öğrenciler, zil). FASS önündeki parkta inerler (296). |
| `fass` | 300–450 | FASS çimenliği, kiraz çiçekleri. **Uçurtma** (`k12Ucurtma` 315–440): anne uçurtmayı verir, Feza yürüdükçe/koştukça uçurtma arkasında yükselir; dokununca takla atar, kurdeleleri renk saçar. Durmak yok. |
| `bilgi` | 450–560 | Bilgi Merkezi (cam kubbe, havuz/fıskiye), saat kulesi. **Bilgi** (`k12Bilgi` 460–555): havuzdan su damlaları, kuş gibi uçan resimli kitap sayfaları, fıskiye dansı; dokunulabilir, durdurmaz. |
| `yol2` | 560–665 | **Biniş 2** (`k12Binis` ad `yol2`, 562→660): kampüs bisiklet durağından Feza kendi küçük bisikletine (destek tekerlekli, kask), anne kendi bisikletine; göletin yokuşundan aşağı süzülürler. |
| `golet` | 665–830 | Gölet kıyısı. **Gölet** (`k12Golet` 665–830): ördek ailesi kıyıda Feza'nın peşine takılır, nilüferler, zıplayan balıklar. **Kayık** (`k12Kayik` 690→805): iskeleden anneyle kayığa binerler; anne kürek çeker, Feza basılı tutunca kürekler hızlanır; karşı iskelede inerler. |
| `tepe` | 830–900 | Gün batımı tepesi. **Final** (`k12Final` 870): piknik örtüsü, anne ve Feza oturur, Pırıl'la birlikte küçük müzik anı, gün batımı, anne Feza'ya sımsıkı sarılır → sabah. |

## Dosyalar ve sahipleri (yalnız kendi dosyanı düzenle; başkasının dosyası için `b12/istek/` klasörüne not bırak)
| ajan | dosyalar | görev |
|---|---|---|
| KOORD | `bolum12.js`, `oyun.js`, `index.html`, `sw.js`, `kapi.js`, `arayuz.js`, `BOLUM12.md`, `README.md`, `CLAUDE.md` | harita, yükleme sırası, akış, kamera, tümleştirme, uçtan uca test, git |
| ANNE | `anne12.js` (baştan yaz) | anne karakteri: çizim + tüm pozlar + yumuşak animasyon + "arkadan takip" yapay zekâsı |
| FEZA12 | `fezapoz12.js` (yeni) + `feza.js`'te yalnız `BOLUM_NO===12` korumalı küçük kancalar | Feza'nın B12 pozları: scooter, bisiklet, kayık, uçurtma ipi tutma, oturma, anneye sarılma, el sallama |
| YOLCULUK | `yolculuk12.js` (baştan yaz) | `k12Binis`: iki biniş, araç çizimleri (annenin bisikleti, Feza'nın scooter'ı ve küçük bisikleti), biniş/iniş animasyonu, sürüş fiziği, yol sürprizleri |
| ARKA | `dunya12.js` (baştan yaz; `assets/kampus/*.png` kullanılabilir/işlenebilir) | gök (bulut, güneş, gün ilerleyişi), uzak tepeler, **kampüs binaları katmanı** (fotoğraftan stilize), paralaks, ışık/renk tonu, `dn12Gun()` |
| ONPLAN | `zemin12.js` (yeni) | zemin/yol (kampüs kaldırımı, bisiklet yolu, kırmızı koşu yolu), orta plan (fener direkleri, banklar, bisiklet parkları, tabelalar, sallanan ağaçlar, kiraz ağaçları, çiçek tarhları), ön plan (çimen/çiçek/çalı paralaksı), bölgeler arası dikişsiz geçiş |
| CANLI | `canli12.js` (yeni) | kampüs hayatı: kampüs kedileri ve köpekleri (sevimli; dokununca tepki, biraz eşlik), kuşlar, kelebekler, sincaplar, uzakta yürüyen/bisiklet süren öğrenciler, fıskiyeler — hepsi durdurmayan |
| ETKINLIK | `etkinlik12.js` (baştan yaz) | `k12Bahce`, `k12Ucurtma`, `k12Bilgi` |
| GOLET | `golet12.js` (yeni) | `k12Golet` (ördek ailesi, nilüfer, balık, oyun düzlemindeki su şeridi ve yansımalar), `k12Kayik` (kayık çizimi + biniş + kürek + iniş) |
| FINAL | `final12.js` (baştan yaz), `sahne12.js` | `k12Final` (piknik, müzik anı, gün batımı, sarılma, `kampusFinalBitti`), seçim kavanozu simgesi, uyku girişi ve sabah hatırası |
| MUZIK | `muzik12.js` (baştan yaz), `sesler12.js`, `ses.js` içindeki B12 bloğu, `gen_voice.py` | kesintisiz bölüm müziği (sabah→gün batımı), efektler (zil, tekerlek, scooter, kürek, ördek, kedi, uçurtma), Pırıl/anne/anlatıcı sesleri |

Eski GPT dosyaları (`durak12 kampusmacera12 kampuskesif12 kampustiyatro12 kampusbahce12 kampuskule12 kampusgolet12 kampuskelebek12 kayik12`)
artık yüklenmez; fikir/çizim için okunabilir, düzenlenmez (KOORD sonunda siler).

## Ortak arayüzler
- Nesne yerleşimi `bolum12.js`'te (KOORD): `nesne(tip, c, yuzey(c), {x0, x1, ...})`. Dekor/canlı yerleşimini (kedi, kuş, fener direği...)
  modül kendi dosyasında yükleme anında `nesne()` ile kendi sütun aralığına yapabilir (yalnız kendi türleri).
- `TUR.kaydet(tip, { kur(o), guncelle(o, dt), ciz(o, tm) /*Feza'nın arkası*/, cizOn(o, tm) /*önü*/, dokun(o, p)? })`.
  Dokunma: ilk sürüm modüllerinin yaptığı gibi `cv` üzerinde `pointerdown` dinleyip dünya koordinatına çevir
  (`cam.x + (clientX - r.left) * DPR / S`); yalnız kendi nesnene isabet ederse `preventDefault/stopPropagation` (yoksa Feza yürüyemez!).
- **Biniş protokolü (P.ucus):** Binişte modül `P.ucus = o` yapar ve `o.adim(dt, girdi)` her adımda `P.x, P.y` yazar
  (girdi: `GIRDI.hareket`/`GIRDI.hedefX` ya da `OYUN.ucusGirdi`; basılı tutma = ilerle). Bitince `P.ucus = null`, `P.ground = true`,
  `P.vx = 0`; P.x aracın yanında kalır. B12'de oyun.js uçuş kamerasını KULLANMAZ (normal takip kamerası).
- **Anne devri:** `ANNE12.devral(sahip)` → anne kendi yürüyüşünü bırakır; sahip onu `anne12Ciz(ctx, x, y, olcek, tm, opt)` ile çizer
  ve konumunu `ANNE12.x/y` olarak yazar. `ANNE12.birak(sahip)` → anne bulunduğu yerden yürüyüşüne devam eder (ışınlanmaz).
  ANNE pozları (en az): `dur, yuru, kos, el_salla, isaret, kokla, bisiklet` (opt.krank açısı, opt.egim), `bisiklet_bin/in` (opt.u 0..1),
  `kayik_kurek` (opt.kurek 0..1), `ucurtma_ver`, `otur`, `alkis`, `saril` (opt.u), `dans`. opt.yon ±1, opt.bak (baş yönü), opt.hiz.
  ANNE `anne12Ciz`'e verilen (x, y) ayak tabanının ortasıdır; olcek 1 = boyu ~205 birim (Feza'nın ~1.7 katı). Bisiklette (x, y) sele
  hizasında değil, **bisikletin yere değdiği orta nokta** olsun; YOLCULUK aracı aynı noktadan çizer. Gereken ölçüler (sele, gidon,
  pedal merkezi, krank boyu) ANNE ve YOLCULUK arasında `b12/istek/` ile kararlaştırılıp anne12.js başında sabit olarak yazılır
  (`ANNE12_BISIKLET = { sele:[x,y], gidon:[x,y], pedal:[x,y], krank: r }`).
- **Feza pozları:** `fezaPoz12(poz, opt)` (fezapoz12.js) — `poz: 'scooter'` (opt.it: itme fazı 0..1), `'bisiklet'` (opt.krank, opt.egim),
  `'binis_in'`(opt.u, opt.arac), `'kayik'` (opt.kurek), `'ucurtma'` (yürürken bir el yukarıda ip tutar), `'otur'`, `'saril'` (opt.u),
  `'el_salla'`, `null` = normal. Feza çizimi feza.js'in kendi çizimidir (aynı karakter); poz yalnız eklem açılarını/gövdeyi yönlendirir.
  Biniş ölçüleri `FEZA12_ARAC = { scooter:{ayak:[x,y], gidon:[x,y]}, bisiklet:{sele, gidon, pedal, krank} }` fezapoz12.js başında.
- Gün: `dn12Gun()` (dunya12.js) 0 sabah … 1 gün batımı, `dn12Isik()` → `{ton:'#rrggbb', guc:0..1}`; diğerleri renk tonu için okur.
- Olaylar: `k12BinisBasla/Bitti {ad}`, `k12UcurtmaTakla`, `k12CicekActi`, `k12KayikBasla/Bitti`, `k12OrdekKatildi`, `k12KediSev`,
  `k12FinalBasla`, `kampusFinalBitti` (oyun.js sabahı başlatır). MUZIK bunları dinler.
- Durum: `V12 = { final:false, binis:null, cicek:0, ucurtma:false, kayik:false, ordek:0 }` (index.html; KOORD).

## Test (HER AJAN)
- `b12/vlib12.py`: `from vlib12 import *` → `with Tarayici('?bolum=12&atla&sessiz') as b:` … Bu, **bilgisayardaki tek test tarayıcısını**
  kilitle sırayla verir (görünmez, ekran kartıyla, düşük öncelik). Kilidi en çok ~3 dakika tut; iş bitince bırak (with bloğu kapatır).
  Kendi başına `msedge`/`Br()` AÇMA, swiftshader / `--disable-gpu` KULLANMA. Uzun ölçüm (>120 sn) yapma.
- Hızlı konum: `isinla(b, sutun)`; hız: `b.ev('OYUN.hiz = 2')`; ekran görüntüsü: `foto(b, 'AJAN_ne')` → `b12/ss/`.
  iPad oranı için `Tarayici(..., w=1180, h=820)` (varsayılan).
- Hata: `b.logs` ve `omHataK` (oyun.js hata kalkanı) sıfır olmalı.

## İlerleme (ebeveyn 3 dakikada bir çubuk görüyor)
Her ajan `b12/ilerleme/<AJAN>.json` dosyasını **en az 10 dakikada bir** güncel tutar:
`{"yuzde": 0-100, "simdi": "kısa Türkçe ne yapıyorsun", "ss": "b12/ss/... en son güzel ekran görüntüsü (varsa)"}`.
Yüzde dürüst olsun (100 = test edildi, bitti). Bitince son raporu `b12/ilerleme/<AJAN>_rapor.md` olarak yaz.
Git commit/push YAPMA (KOORD yapar).

---
# Tur 2 (27 Ekim 2026, öğleden önce) — ebeveynin yeni istekleri
Ebeveyn 1. turu gördü ve dedi ki:
1. **Annenin animasyonu hâlâ çok iyi değil**; biraz daha (Feza'nın gerçek) annesine benzesin, daha çok oynanmalı. Ebeveyn bir stil örneği
   gönderdi: `b12/ref/ebeveyn_bisiklet_ornegi.png` (bisiklet süren sevimli, sade, temiz şekilli bir karakter — akıcı, yumuşak, okunur).
   Bu örnekteki temizlik/okunurluk ve hareket kalitesi hedef (kopyalama yok, esinlen).
2. **Sabancı Üniversitesi'ni iyice araştır**: binaların bir kısmı gerçeğe benziyor, bir kısmı farklı. İnternetteki fotoğraflara iyice bak
   (kampüs binaları, büyük gölet, botanik bahçesi, kaplumbağalar...) ve ortamı hepsine göre çok güzel kur. Gerçekte olmasa da oyunda güzel
   duracak şeyler olabilir.
3. **Kaplumbağalar** (botanik bahçesi), **büyük bir gölet**.
4. Çok sayıda ajanla her şeyi daha da iyileştir.

## Harita değişikliği (KOORD yaptı: bolum12.js, COLS 900 → 1100)
Eski sütun → yeni sütun: `c < 560` aynı · `560 ≤ c < 805` → `c + 140` · `c ≥ 805` → `c + 200` (gölet suyu uzadı).
| bölge | yeni sütun | not |
|---|---|---|
| lojman, yol1, fass, bilgi | 0–560 | aynı |
| **botanik** (YENİ) | 560–700 | botanik bahçesi: sera, bitki tarhları, ahşap yürüyüş yolu, **kaplumbağa göleti** (`k12Botanik`, BOTANIK ajanı, `botanik12.js`) |
| yol2 | 700–805 | Biniş 2: `k12Binis` 702→800 (bisiklet durağı 700, varış parkı 800) |
| golet | 805–1030 | kıyı 805–830 · **su 830–1005** (`k12Kayik` 830→1005; eskisinden 60 sütun uzun) · kıyı 1005–1030 (`k12Golet` 805–1030) |
| tepe | 1030–1100 | final `k12Final` 1070 (piknik ~1060–1084) |
Her ajan KENDİ dosyasındaki sabit sütunları bu tabloya göre günceller (ör. zemin12.js `ZN12_SU0/SU1`, park rafları 560→700, 660→800, ZN12_BOLGE;
canli12.js yerleşimleri; golet12.js su aralığı; dunya12.js sahne sütunları; muzik12.js bölge sınırları; final12.js piknik konumu).

## Tur 2 dosya sahipleri (yeni: `botanik12.js` BOTANIK, `bina12.js` BINA)
| ajan | dosya | tur 2 görevi |
|---|---|---|
| ANNE | anne12.js | annenin çizimini ve animasyonunu belirgin biçimde iyileştir (stil örneği), daha akıcı, daha canlı yüz ve vücut dili |
| FEZA12 | fezapoz12.js (+ feza.js B12 kancaları) | stil örneğindeki gibi akıcı sürüş pozları; anneyle etkileşim pozları |
| YOLCULUK | yolculuk12.js | yol2'yi yeni sütunlara taşı; bisiklet/scooter animasyonunu stil örneği kalitesine çıkar |
| ARKA | dunya12.js (+ assets/kampus) | gerçek kampüs fotoğraflarına göre bina katmanlarını düzelt/yeniden kur; botanik ve büyük gölet arka planı; yeni sütunlar |
| BINA | bina12.js (YENİ) | ARKA'nın çağıracağı, gerçek binalara sadık stilize çizimler (eksik/yanlış binalar: ör. Sabancı Sanat Merkezi/SUNUM, spor merkezi, yurtlar, sera); ARKA ile kararlaştır |
| BOTANIK | botanik12.js (YENİ) | `k12Botanik`: botanik bahçesi + kaplumbağa göleti, dokununca sevimli tepkiler, durdurmaz |
| GOLET | golet12.js | büyük gölet (830–1005), daha zengin hayat (kaplumbağa, kuğu, balık, kaz), daha uzun ve güzel kayık yolculuğu |
| ONPLAN | zemin12.js | yeni sütunlar; botanik bahçesinin zemini (çakıl, ahşap iskele yol), orta/ön plan |
| CANLI | canli12.js | yeni sütunlar; botanik bölgesine canlılar (kelebek, kuş, sincap — kaplumbağalar BOTANIK'in) |
| MUZIK | muzik12.js, ses.js B12, sesler12.js | yeni bölgeler (botanik), yeni olaylar ve birkaç yeni cümle |
| FINAL | final12.js, sahne12.js | yeni konum (1070) + cila |
| ETKINLIK | etkinlik12.js | çiçek, uçurtma, havuz cilası |
| KOORD | bolum12.js, oyun.js, index.html, sw.js, arayuz.js | harita, tümleştirme, test |
