/* bolum7.js — Kuzey Işıkları (yedinci rüya). Mavi-mor bir kış gecesi, hiç durmayan pamuk gibi kar: karlı çam ormanı,
   buz kristali fenerler, kar yığınlarında uyuyan tilki ve tavşan yavruları, yavru ren geyiği, kardan adam açıklığı,
   buzlu göl, kızak tepesi ve kuzey ışıklarının yeniden yandığı final tepesi.
   Ana patikada her basamak en çok iki kare; üst yollara (çam dalı / kar saçağı) yalnız uyanan yavrular sıçratır.
   Kızak tepesinin ucundaki boşluğu (339..469) yalnız kızak yolculuğu geçer; dunya7.js orada inen karlı tepeleri çizer
   (profil: BOLUM.kizak.zemin(x)). Sözleşme: src/BOLUM7.md. Çizimler dunya7.js (dn7*), nesneler kar.js / geyik.js /
   kardan.js / kizak.js. */
'use strict';
const ROWS = 30, COLS = 560;
const grid = Array.from({length:ROWS},()=>new Uint8Array(COLS));
const ground=(a,b,h)=>{for(let c=a;c<=b;c++)for(let r=ROWS-h;r<ROWS;r++)grid[r][c]=1;};
const plat=(a,b,r)=>{for(let c=a;c<=b;c++)grid[r][c]=2;};
const topOf=c=>{c=Math.floor(c);if(c<0||c>=COLS)return ROWS;for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r;return ROWS;};
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>topOf(c)*T;
const nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}){const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}

// ── Zemin: [ilk sütun, son sütun, yükseklik (alttan kare)]. Komşu iki parça arasında en çok iki kare fark. ──
// Orman inişli çıkışlı (11..14), kardan adam açıklığı düz ve geniş, göl bir kare aşağıda (buz), sonra kızak tepesine
// yumuşak yokuş (17). 339..469 boşluk: kızak yolculuğu. Karşıda iniş düzlüğü ve final tepesi (12 → 16).
for(const [a,b,h] of [
 [0,18,11],[19,26,12],[27,36,13],[37,48,12],[49,58,11],[59,66,12],[67,74,13],   // giriş: karlı orman kıyısı
 [75,84,14],[85,92,13],[93,110,12],[111,118,13],[119,128,14],[129,140,13],     // çam ormanı
 [141,152,12],[153,160,11],
 [161,199,11],                                                                 // kardan adam açıklığı (geniş, düz)
 [200,206,11],[207,280,10],[281,288,11],                                       // buzlu göl (kıyıdan bir kare aşağı)
 [289,296,12],[297,304,13],[305,312,14],[313,318,15],[319,324,16],[325,338,17], // kızak tepesine yokuş
 [470,486,12],[487,494,13],[495,502,14],[503,510,15],[511,559,16]])             // iniş düzlüğü ve final tepesi
 ground(a,b,h);

// ── Tek yönlü platformlar ──
// Alçak kar saçakları (zeminden 3 kare): normal zıplamayla oyuncak basamaklar.
for(const [a,b,r] of [[8,12,16],[80,84,13],[250,255,17],[490,494,14]]) plat(a,b,r);
// Yüksek yollar (zeminden 6 kare): yalnız uyanan yavrunun sıçrattığı isteğe bağlı karlı dal / buz saçağı yolları.
for(const [a,b,r] of [
 [42,49,12],[52,58,12],[61,67,11],                 // 1. yavru (sütun 40) → giriş çamlarının dalları
 [100,107,12],[110,116,11],[119,125,11],           // 2. yavru (sütun 98) → orman dalları (fener)
 [135,142,11],[145,151,10],[154,160,10],           // 3. yavru (sütun 133) → yüksek dallar, açıklığa iner
 [206,213,13],[216,222,13],[226,232,12],[236,242,12], // 4. yavru (sütun 203) → gölün üstünde buz saçakları
 [309,316,10],[319,325,9]]) plat(a,b,r);           // 5. yavru (sütun 307) → yokuşun üstünden tepeye

// Kızak yolculuğunun inen karlı tepe profili (dünya y'si): tepenin ucundan (339) iniş düzlüğüne (470) dalgalı, yumuşak iniş.
// Uçlarda eğim sıfır; arada 6 tümsek (kızak uçabilir). dunya7.js bunu karla doldurup çizer; kizak.js isterse yol olarak kullanır.
const BL7_KZ0=339*T,BL7_KZ1=470*T,BL7_KZY0=13*T,BL7_KZY1=18*T;
function bl7KizakZemin(x){
 const u=clamp((x-BL7_KZ0)/(BL7_KZ1-BL7_KZ0),0,1),s=Math.sin(u*Math.PI);
 return lerp(BL7_KZY0,BL7_KZY1,u*u*(3-2*u))-58*s*Math.pow(Math.sin(u*Math.PI*6),2)-22*s*Math.sin(u*Math.PI*13+.6)*s;
}

const BOLUM={
 ad:'Kuzey Işıkları',baslangic:{x:nx(5),y:yuzey(5)},
 bolgeler:[{ad:'giris',x0:0,x1:75*T},{ad:'orman',x0:75*T,x1:161*T},{ad:'aciklik',x0:161*T,x1:200*T},
  {ad:'gol',x0:200*T,x1:289*T},{ad:'yokus',x0:289*T,x1:339*T},{ad:'yolculuk',x0:339*T,x1:470*T},{ad:'tepe',x0:470*T,x1:COLS*T}],
 gol:null,gollar:[],
 // Buzlu göl (kayma bölgesi; kar.js 'buzGol' nesnesi kaydırır, dunya7.js buzu çizer). y: buz yüzeyi.
 buz:{x0:207*T,x1:281*T,y:yuzey(240)},
 // Kızak yolculuğu koridoru (kizak.js): tepeden kalkış, inen karlı tepeler, final tepesinin eteğine iniş.
 // oyun.js uçuş kamerası BOLUM.ucus'u okur (yUst..yAlt ekrana sığar). zemin(x): dunya7'nin çizdiği tepe yüzeyi.
 kizak:{x0:nx(333),x1:nx(472),yUst:200,yAlt:780,inisX:nx(474),inisY:yuzey(474),zemin:bl7KizakZemin,zx0:BL7_KZ0,zx1:BL7_KZ1},
 tepe:{x:nx(534),y:yuzey(534)},
 fenerTop:10,yavruTop:5,
 kamera:[{x0:0,x1:30*T,zoom:.95,yOfs:-30},{x0:36*T,x1:70*T,zoom:.86,yOfs:-90},
  {x0:76*T,x1:92*T,zoom:.92,yOfs:-40},{x0:94*T,x1:160*T,zoom:.85,yOfs:-95},
  {x0:163*T,x1:198*T,zoom:.84,yOfs:-50},{x0:202*T,x1:284*T,zoom:.8,yOfs:-90},
  {x0:292*T,x1:328*T,zoom:.84,yOfs:-110},{x0:328*T,x1:340*T,zoom:.8,yOfs:-60},
  {x0:468*T,x1:500*T,zoom:.86,yOfs:-50},{x0:504*T,x1:COLS*T,zoom:.78,yOfs:-140}]
};
BOLUM.ucus=BOLUM.kizak;
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;D.x=P.x-60;D.y=P.y-85;

const bl7Soz=(c,k,gec)=>nesne('konusma',c,yuzey(c),{anahtar:k,r:90,gec:nx(gec||c+12)});

// ── Kar fenerleri (10): buz kristali; dokununca / yanından geçince yanar, gökte o renkte kuzey ışığı şeridi belirir.
// Dokuzu ana yolda, biri orman dallarında (2. yavrunun yolu). renk: dunya7 DN7_AUR sırası (kar.js isterse kullanır).
for(const [c,y] of [[12],[34],[64],[88],[113,11*T],[146],[171],[244],[300],[482]])
 nesne('karFener',c,y===undefined?yuzey(c):y,{r:80,sira:NESNELER.filter(n=>n.tip==='karFener').length,renk:NESNELER.filter(n=>n.tip==='karFener').length%10});

// ── Kar yığınında uyuyan yavrular (5): 3 kutup tilkisi, 2 tavşan. Üstüne zıplayınca uyanır, yükseğe sıçratır (≈7 kare). ──
for(const [c,hayvan,yon] of [[40,'tilki',1],[98,'tavsan',1],[133,'tilki',1],[203,'tavsan',1],[307,'tilki',1]])
 nesne('karYavru',c,yuzey(c),{r:70,hayvan,yon,guc:1150,w:64,h:30});

// ── Yavru ren geyiği: erken karşılaşılır, sonra Feza'nın arkasında yürür (geyik.js). ──
nesne('geyik',22,yuzey(22),{r:140,yon:-1});

// ── Mini oyun A: kardan adam (açıklığın ortası); bitene kadar ilerisinde ışık perdesi. ──
const bl7Kardan=nesne('kardanMini',182,yuzey(182),{r:150,x0:164*T,x1:197*T});
nesne('miniKapi',196,yuzey(196),{bagId:bl7Kardan.id,stil:'takim'});

// ── Buzlu göl: kayma bölgesi (kar.js). ──
nesne('buzGol',244,BOLUM.buz.y,{x0:BOLUM.buz.x0,x1:BOLUM.buz.x1,w:BOLUM.buz.x1-BOLUM.buz.x0,r:0});

// ── Mini oyun B: kızak (tepenin ucunda kalkış) → inen karlı tepeler → final tepesinin eteğine iniş. ──
const bl7Kizak=nesne('kizakMini',331,yuzey(331),{r:130,x1:BOLUM.kizak.x1,yUst:BOLUM.kizak.yUst,yAlt:BOLUM.kizak.yAlt,
 inisX:BOLUM.kizak.inisX,inisY:BOLUM.kizak.inisY,zemin:bl7KizakZemin});
nesne('miniKapi',336,yuzey(336),{bagId:bl7Kizak.id,stil:'takim'});

// ── Final tepesi: Feza varınca dev kuzey ışıkları (kar.js 'kuzeyTepe'). ──
nesne('kuzeyTepe',534,yuzey(534),{r:170});

// ── Konuşma: p_k_yavru (yakınlık) ve p_k_buz ('buzKay') ses.js / oyun.js'te tetiklenir; haritada ayrıca tetikleyici yok. ──

// ── İsteğe bağlı ışık tohumları: üst yolların ve alçak saçakların küçük sürprizleri. ──
for(const [c,y] of [[10,16*T],[46,12*T],[56,12*T],[64,11*T],[104,12*T],[123,11*T],[138,11*T],[157,10*T],
 [210,13*T],[229,12*T],[239,12*T],[253,17*T],[312,10*T],[322,9*T],[492,14*T]])
 nesne('tohum',c,y,{r:46});

// ── Dekor imzaları (yalnız görüntü; dunya7.js çizer, çarpışma yok). ──
// cam: büyük karlı çamlar (dünya derinliğinde, Feza'nın arkası) [sütun, ölçek]. kardan: — (mini oyun). kutu: kar kaplı
// kütük/kaya. isik: dallara asılı minik buz kristali çanlar (fener yanınca ışır). kulube: uzak kulübenin dünya eşleşmesi.
const DEKOR7={
 cam:[[3,1.1],[17,.85],[31,1.25],[50,1],[72,1.2],[91,1.3],[106,.9],[118,1.15],[137,1.25],[151,1],
  [164,1.3],[199,1.2],[286,1.1],[303,.95],[317,1.2],[477,1.1],[490,1.2],[516,1.25],[552,1.2]],
 cancik:[24,52,96,124,142,214,236,298,488,518],
 kulube:{x:236*T}
};

const FLOWERS=[];
const TREE=null;
