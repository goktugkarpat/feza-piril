# Bölüm 7: Kuzey Işıkları — sözleşme (ajanlar arası)

Yedinci rüya. Mavi-mor bir kış gecesi; KAR YAĞIŞI HİÇ DURMAZ (yumuşak, pamuk gibi, katmanlı: uzakta ince, önde iri ağır taneler; rüzgârla hafif salınım; ışığa yakın taneler parlar). Karlı çam ormanı, dallarından kar düşen çamlar, buzlu göl, parlayan buz kristalleri, uzakta ışıklı küçük bir kulübe. Gökyüzündeki kuzey ışıkları sönmüş; Feza onları yeniden yakar ve final de dev, dalgalanan yeşil-pembe-mor kuzey ışıklarıyla biter. Atmosfer büyüleyici, sakin, ninni gibi — "pamuk gibi" bir bölüm. Feza'nın adımları karda iz bırakır, Pırıl'ın nefesi buhar olur. Korkutucu hiçbir şey yok, kaybetme yok, yazı yok, öğretici el yok.
Kalite ölçüsü: ilk altı rüya (en üst: Bölüm 6 cilalı hali). 60 fps (iPad M1).

## Kimlik
- `BOLUM_NO === 7`, tema/fon adı `'kar'`, ses harfi `k` (`p_k_*` Pırıl, `a_k_*` anlatıcı) — DİKKAT: `p_k` öneki ses.js'te başka anlamda kullanılıyorsa CORE uygun bir harf seçip bu dosyayı günceller ve herkese bildirir.
- Genel durum (index.html): `var V7 = { fener: 0, fenerTop: 10, yavru: 0, kardan: false, kizak: false, final: false };`
- `index.html` yalnız `BOLUM_NO === 7` için yükler: `dunya7`, `geyik`, `kar`, `kardan`, `kizak` (+ `bolum7.js` harita). `sw.js` SRC'ye de eklenir.

## Dosya sahipliği
| Ajan | Dosyalar |
|---|---|
| HARITA | `src/bolum7.js` (harita/nesne yerleşimi/kamera), `src/dunya7.js` (gök, sönük/yanan kuzey ışıkları, uzak karlı dağlar, çam ormanı katmanları, buzlu göl, kulübe, zemin karı + ayak izleri, KAR YAĞIŞI sistemi, sabah ışığı) |
| KAR | `src/geyik.js` (ortak `geyikCiz` + yavru ren geyiği dost — eşlik eder), `src/kar.js` (buz kristali fener, kar yığınında uyuyan tilki/tavşan yavruları (zıplayınca fırlayıp uyanır + sıçratır), buzlu göl kayma bölgesi, final tepesi nesnesi) |
| KARDAN | `src/kardan.js` (mini oyun A: kardan adam yapma) |
| KIZAK | `src/kizak.js` (mini oyun B: yavru ren geyiğinin çektiği kızakla kayış yolculuğu) |
| CORE | `index.html`, `sw.js`, `src/oyun.js`, `src/arayuz.js`, `src/piril.js`, `src/ses.js` (+ `gen_voice.py` → `sesler.js`), `src/kapi.js` |
| SAHNE | `src/sahne.js` (seçim ekranında 7. balon + düzen, balon ikonu 'kar', uyku → rüya, sabah) |
| MUZIK | `src/muzik.js` (kış ninnisi + mini oyun ve final müziği) |

Örnek: Bölüm 6 (`src/BOLUM6.md`, `bolum6.js`, `dunya6.js`, `senlik.js`, `midilli.js`, `halka.js`) ve her entegrasyon noktası için `grep -n "BOLUM_NO === 6\|V6" index.html sw.js src/*.js`.

## Akış
1. **Karlı orman** (giriş): kar fenerleri (`tip:'karFener'`, 10 adet) — buz kristali; dokununca/yanından geçince içinde renkli ışık yanar, gökte o renkte ince bir kuzey ışığı şeridi belirir (`V7.fener++`, `OLAY 'karFener' {o,n,x,y}`). Kar yığınlarında uyuyan yavrular (`tip:'karYavru'`, 5 adet: 3 kutup tilkisi, 2 tavşan): Feza üstüne zıplayınca kardan fırlayıp uyanır, Feza'yı yükseğe sıçratır (`V7.yavru++`, `OLAY 'yavruUyandi' {o,n}`, `OLAY 'ziplatti' {tip:'karYavru',o}`), sonra bölüm boyunca peşinden sevinçle hoplar (uyuyan yavru yığının tepesinde kıvrılmış, bütünüyle görünür). Ormanda dekor olarak karda oynayan tilki/tavşanlar (`tip:'karOyuncu'`, sayılmaz): tilki kara dalar, tavşanlar hoplaşır; Feza yaklaşınca ona bakarlar.
2. **Yavru ren geyiği** (`tip:'geyik'`): erken karşılaşılır; boynuzlarındaki kristaller sönük. Fenerler yandıkça boynuz kristalleri de renk renk yanar; Feza'ya yol boyu eşlik eder (Pırıl gibi ama yerde, Feza'nın arkasında).
3. **Mini oyun A – Kardan adam** (`tip:'kardanMini'`): Feza parmağıyla kar topunu yuvarlar (sürükleme yönünde top yuvarlanır ve büyür, arkasında karda iz kalır); 3 top (büyük-orta-küçük) üst üste konur (yakına getirince yerine oturur); sonra havuç burun, kömür gözler/düğmeler, atkı ve şapka parçaları dokununca uçarak yerine konur; kardan adam canlanır, gözlerini kırpar, el sallar, kollarından kar dökerek dans eder ve bölümün geri kalanında yola katılır (yanlarında yürür/kayar, finalde olur). Kaybetme yok; ~25 sn dokunulmazsa Pırıl yardım eder. Bitince `V7.kardan = true`, `OLAY 'kardanBitti'`. Önünde `miniKapi` perdesi (`bagId`).
4. **Buzlu göl**: Feza kayarak ilerler (kayma bölgesi; eğlenceli, kolay, düşme yok).
5. **Mini oyun B – Kızak kayışı** (`tip:'kizakMini'`, Bölüm 6 halka / Bölüm 5 tekne gibi `P.ucus` ile fiziği devralan yolculuk): Yavru ren geyiği Feza'yı (Pırıl kızağın önünde uçar, kardan adam arkada kayar) kızakla karlı tepelerden aşağı çeker; havada ve yolda süzülen ışık taneleri / kar kristalleri; dokununca kızak zıplar (tümseklerden uçar), taneleri toplar; dalgalı karlı tepeler, kar püskürtmesi, hız hissi; ~60 sn; kaybetme yok, kaçanlar sorun değil, dokunulmazsa Pırıl yardım eder; sonunda final tepesinin eteğine yumuşak iniş. `V7.kizak = true`, `OLAY 'kizakBasla'`, `'kizakTane' {n}`, `'kizakBitti'`.
6. **Final tepesi** (`tip:'kuzeyTepe'`): Feza varınca `V7.final = true`, `OLAY 'kuzeyFinal' {o, duration, box}`: dev kuzey ışıkları gökyüzünü kaplar ve dalgalanır, kar taneleri ışıkla renklenir, ren geyiği boynuzları ve fenerler parlar, kardan adam ve yavrular dans eder, Feza ve Pırıl sevinir (Bölüm 6'daki `fzSenlik6`/Pırıl dans modu gibi); ~30 sn; sonra `OLAY 'kuzeyTamam'` → sabah + sonuç kartı.

## Ortak API'ler
- `geyikCiz(c, x, y, s, t, o)` — o: `{ yon, kos (0..1), zipla (0..1), kristal (0..1 yanma), renkler, bak, cek (kızak çekme pozu) }`; önbellekli (karede gradient/filtre yok).
- Kardan adam çizici `kardanCiz(c, x, y, s, t, o)` kardan.js'te; finalde ve kızakta KAR/KIZAK kullanabilir (typeof kontrolüyle).
- Kar yağışı ve "zemin karı" dunya7.js'te; diğer modüller karda iz bırakmak için `dn7Iz(x, y, tip)` çağırabilir (typeof kontrolüyle).
- Olaylar: `karFener`, `yavruUyandi`, `ziplatti`, `kardanBasla`, `kardanTop`, `kardanBitti`, `kizakBasla`, `kizakTane`, `kizakZipla`, `kizakBitti`, `kuzeyFinal`, `kuzeyDoruk`, `kuzeyTamam`.
- Ses anahtarları (CORE yazar): uyku, giriş, ilk fener, fenerlerin yarısı, ilk yavru görülünce, yavru uyanınca, geyikle tanışma, kardan adam giriş/top bitti/canlandı, göl kayması, kızak giriş/yarısı/bitti, final, dostça sözler, anlatıcı sabah 1..3.

## Kurallar
- Klasik script, ES module yok, file:// çalışır. Türkçe yorumlar, mevcut dosyalarla aynı yoğunlukta.
- Test her zaman `?sessiz` (`?bolum=7&atla&sessiz`). Headless Chrome CDP yardımcısı: `/private/tmp/claude-501/-Users-goktugkarpat-Library-CloudStorage-Dropbox-Game-Development/6a76d4aa-ea53-43f5-b361-140c6c3f5633/scratchpad/vlib.py` (sessiz; `--mute-audio`). Kendi portunu kullan, yalnız kendi süreçlerini kapat. Test araçları oyun klasörüne konmaz.
- GitHub'a gönderme, commit atma (koordinatör yapar).
- İlerleme: `.../scratchpad/b7/ilerleme/<AJAN>.txt` ~3 dakikada bir tek satır: `yüzde | kalan dk | ne yapıyorsun`.
- Ekran görüntüleri (ebeveyne gösterilecek, ATMOSFER önemli): `.../scratchpad/b7/ss/<AJAN>_<sıra>_<ne>.png` — ilk görüntüyü erken kaydet, ilerledikçe ekle.

## CORE notları (kancalar hazır; ses harfi `k` kesin — `p_k_` öneki başka yerde kullanılmıyor)
- Ses anahtarları: `p_k_uyku`, `p_k_giris`, `p_k_fener` (ilk fener), `p_k_fener2` (yarısı), `p_k_yavru` (ilk uyuyan yavru görülünce, yakınlıktan), `p_k_yavru_uyan`, `p_k_geyik` (ilk `geyik` nesnesi 5 kare yakına gelince ya da `OLAY 'geyikTanis'`), `p_k_kardan_giris` (`kardanBasla`), `p_k_kardan_top` (`kardanTop` {n≥3 ya da son:true}), `p_k_kardan_bitti`, `p_k_buz` (oyun.js `buzKay`), `p_k_kizak_giris` (`kizakBasla`), `p_k_kizak` (`kizakTane` n = top/2), `p_k_kizak_bitti`, `p_k_final` (`kuzeyFinal`), `p_dost_kar`, `a_k_final1..3`. Modüller ayrıca `SES.soyle('k_...')` diyebilir.
- Buzlu göl fiziği oyun.js'te: `karBuzKayma(x, y)` (0..1) tanımlıysa o, yoksa `BOLUM.buz {x0,x1,y}`; buzda az sürtünme / uzun kayış; `P.buz` (0..1) poz için okunabilir. kar.js P.vx'i ayrıca değiştirmesin (ya da yalnız `karBuzKayma` versin).
- Sayaçlar: `SAYAC.fener/fenerTop` (karFener), `yavru/yavruTop`, `kardan/kardanTop`, `kizak/kizakTop` (`kizakTane` {n, top} ve `kizakBitti` {n, top} ile). Sonuç kartı: fener · yavru · kardan adam · kar kristali (en çok 14).
- Hedef sırası (`om7Hedef`): önündeki fener/yavru (sıradaki mini oyundan önce) → `kardanMini` → `kizakMini` → `kuzeyTepe`. Nesne bayrakları: `karFener.yandi`, `karYavru.uyandi`, `o.done`.
- Final: `OLAY 'kuzeyFinal' {o, duration, box}` → B6 gibi dikey kadraj (`omDk.o6`), `a_k_final1` 6. sn'de; `kuzeyTamam` (yoksa duration+1,5 sn sonra) → sabah. feza.js dans saati `kuzeyTepe` nesnesinin `o.age` (final başından sn) alanına oturur, `o.doruk` true iken kollar havada/göğe bakar. Pırıl 2,4 sn sonra dans moduna geçer.
- Zıplama düğmesi `P.ucus`, `V7.final` ve `KARDAN.aktif` iken gizli; Pırıl'ın kendiliğinden davranışları da `KARDAN.aktif` iken durur.
- Ayak izi: feza.js her basışta `dn7Iz(x, y, 'feza' | 'inis')` çağırır.
