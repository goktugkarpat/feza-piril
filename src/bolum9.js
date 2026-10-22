/* bolum9.js — Pırıl'ın Ejderha Vadisi (dokuzuncu rüya). Pırıl, Feza'yı kendi evine, minik ejderhaların yaşadığı yemyeşil, büyülü bir
   vadiye götürür: çiçekli çayır, şelale ormanı, uçan adacıklar, en sonda Büyükanne Ejderha'nın dağ tepesindeki yuvası.
   Vadinin Ejderha Kalbi kristali sönmüş, yumurtalar üşümüş: Feza ile Pırıl pul çiçeklerini açar, yumurtaları ısıtıp yavruları çıkarır,
   üç küçük oyunu oynar, Büyükanne'nin sırtında yuvaya uçar ve Kalp yeniden parlar. Korkutucu hiçbir şey yok.
   Ana patikada her basamak en çok iki kare. Büyükanne yolculuğu boşluğu (605..760) yalnız uçuşla geçilir.
   Sözleşme: src/BOLUM9.md. Çizimler dunya9.js (dn9*), nesneler yavru.js / meyve.js / kanat.js / kolye.js / buyukanne.js / yuva.js.
   (İlk yerleşim koordinatörden; HARITA ajanı sözleşmedeki sütun düzenini koruyarak geliştirir.) */
'use strict';
const ROWS = 30, COLS = 840;
const grid = Array.from({length:ROWS},()=>new Uint8Array(COLS));
const ground=(a,b,h)=>{for(let c=a;c<=b;c++)for(let r=ROWS-h;r<ROWS;r++)grid[r][c]=1;};
const plat=(a,b,r)=>{for(let c=a;c<=b;c++)grid[r][c]=2;};
const topOf=c=>{c=Math.floor(c);if(c<0||c>=COLS)return ROWS;for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r;return ROWS;};
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>topOf(c)*T;
const nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}){const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}

// ── Zemin: [ilk sütun, son sütun, yükseklik (alttan kare)]. Komşu iki parça arasında en çok iki kare fark. ──
for(const [a,b,h] of [
 [0,30,11],[31,44,12],[45,60,11],                                                   // giriş: Pırıl'ın vadisine iniş
 [61,78,12],[79,96,13],[97,118,12],[119,136,11],[137,156,12],[157,176,13],[177,200,12],  // çiçekli çayır
 [201,240,12],                                                                      // meyve açıklığı (düz, geniş)
 [241,256,13],[257,270,12],[271,288,11],[289,304,12],[305,322,13],[323,340,12],[341,362,11],[363,380,12], // şelale ormanı (271..288 dere: taş basamaklar)
 [381,426,12],                                                                      // uçma dersi tepesi (düz, geniş)
 [427,440,12],[441,452,13],[503,516,13],[517,534,12],[535,560,12],                  // uçan adacıklar (ortası adacık platformları)
 [561,604,12],                                                                      // pul kolyesi terası ve kalkış kayalığı
 [761,780,13],[781,794,14],[795,839,15]])                                           // yuvaya iniş ve Büyükanne'nin yuvası
 ground(a,b,h);
// uçan adacıkların altı: yumuşak yosun çanağı (düşmek acıtmaz; iki ucunda basamak basamak çıkılır, yol hep yürünebilir)
for(const [a,b,h] of [[453,455,11],[456,493,9],[494,497,10],[498,502,12]]) ground(a,b,h);

// ── Tek yönlü platformlar (çayırda kocaman yaprak / mantar, şelale ormanında yosunlu taş çıkıntı: normal zıplamayla oyuncak basamaklar) ──
for(const [a,b,r] of [[86,90,15],[148,152,15],[262,266,15],[316,320,15]]) plat(a,b,r);
// isteğe bağlı: girişte kocaman bir yaprak, çayırda dev çiçek tablası (tepeden vadiye bakılır)
for(const [a,b,r] of [[36,39,16],[164,167,15]]) plat(a,b,r);
// uçan adacıklar (yüzen yosunlu kaya adaları; üstleri yürünür, aralar kısa zıplama; altları yumuşak yosun çanağı)
for(const [a,b,r] of [[456,461,17],[465,471,16],[475,482,15],[486,491,16],[494,497,17]]) plat(a,b,r);

const BOLUM={
 ad:"Pırıl'ın Ejderha Vadisi",baslangic:{x:nx(10),y:yuzey(10)},
 bolgeler:[{ad:'giris',x0:0,x1:61*T},{ad:'cayir',x0:61*T,x1:201*T},{ad:'meyve',x0:201*T,x1:241*T},{ad:'selale',x0:241*T,x1:381*T},
  {ad:'kanat',x0:381*T,x1:427*T},{ad:'adalar',x0:427*T,x1:561*T},{ad:'kolye',x0:561*T,x1:605*T},{ad:'yolculuk',x0:605*T,x1:761*T},
  {ad:'yuva',x0:761*T,x1:COLS*T}],
 gol:null,gollar:[],
 // Büyükanne Ejderha'nın sırtında yolculuk koridoru (buyukanne.js): kalkış kayalığından gün batımında, uçan adacıkların ve şelalelerin
 // üstünden, Büyükanne'nin dağ yuvasının girişine iniş. oyun.js uçuş kamerası BOLUM.ucus'u okur (yUst..yAlt ekrana sığar).
 binis:{x0:nx(602),x1:nx(762),yUst:80,yAlt:700,inisX:nx(766),inisY:yuzey(766)},
 yuva:{x:nx(812),y:yuzey(812)},
 pulTop:10,yavruTop:6,
 kamera:[{x0:0,x1:60*T,zoom:.92,yOfs:-40},{x0:61*T,x1:200*T,zoom:.86,yOfs:-80},{x0:201*T,x1:240*T,zoom:.84,yOfs:-50},
  {x0:241*T,x1:380*T,zoom:.84,yOfs:-90},{x0:381*T,x1:426*T,zoom:.84,yOfs:-60},{x0:427*T,x1:560*T,zoom:.8,yOfs:-140},
  {x0:561*T,x1:604*T,zoom:.84,yOfs:-60},{x0:761*T,x1:COLS*T,zoom:.8,yOfs:-120}]
};
BOLUM.ucus=BOLUM.binis;
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;D.x=P.x-60;D.y=P.y-85;

// ── Pul çiçekleri (10; yavru.js): kapalı, solgun tomurcuklar. Feza yanından geçince / dokununca açılır, içinden ejderha pulu gibi
//    parıldayan taç yapraklar çıkar, çevresinde renk dalgası. V9.pul++ ──
for(const c of [20,44,80,150,185,265,300,340,450,520])
 nesne('pulCicek',c,yuzey(c),{r:80,sira:NESNELER.filter(n=>n.tip==='pulCicek').length});

// ── Üşümüş ejderha yumurtaları (6; yavru.js): Feza sarılır/ısıtır → çatlar, yavru çıkar (her biri başka renk), Feza'yı izler. V9.yavru++ ──
for(const [c,renk] of [[54,'nane'],[120,'seftali'],[170,'gok'],[285,'limon'],[360,'gul'],[509,'lila']])
 nesne('ejderYumurta',c,yuzey(c),{renk,sira:NESNELER.filter(n=>n.tip==='ejderYumurta').length});

// ── Mini oyun 1: yavrulara meyve (meyve.js) ──
const bl9Meyve=nesne('meyveMini',220,yuzey(220),{x0:nx(204),x1:nx(237)});
nesne('miniKapi',239,yuzey(239),{bagId:bl9Meyve.id,stil:'ejder'});
// ── Mini oyun 2: uçma dersi (kanat.js) ──
const bl9Kanat=nesne('kanatMini',402,yuzey(402),{x0:nx(385),x1:nx(421)});
nesne('miniKapi',424,yuzey(424),{bagId:bl9Kanat.id,stil:'ejder'});
// ── Mini oyun 3: Büyükanne'nin pul kolyesi (kolye.js) ──
const bl9Kolye=nesne('kolyeMini',580,yuzey(580),{x0:nx(564),x1:nx(597)});
nesne('miniKapi',599,yuzey(599),{bagId:bl9Kolye.id,stil:'ejder'});
// ── Büyükanne Ejderha'nın sırtında yolculuk (buyukanne.js; P.ucus ile fiziği devralır) ──
nesne('buyukanneBinis',602,yuzey(602),{});
// ── Final: Ejderha Kalbi Şöleni (yuva.js) ──
nesne('ejderYuva',812,yuzey(812),{});
// ── Dekor dostlar: yavru.js. Giriş sesi CORE'dan (p_e_giris). ──

// ── Dekor imzaları (yalnız görüntü; dunya9.js çizer, çarpışma yok) ──
// agac: dev çiçekli ağaçlar [sütun, ölçek, taç rengi (0 pembe, 1 beyaz-gül, 2 leylak, 3 şeftali), salıncak/yuva dalı (0/1)].
// kaya: yosunlu yuvarlak kayalar [sütun, ölçek]. yuva: boş, yaprak döşeli ejderha yuvaları (dekor) [sütun, ölçek, 'yer'|'kaya'].
// selale: şelale ormanının arkasındaki kayalıklar ve şelaleler [sütun, yükseklik (birim), genişlik, katman sayısı].
// dere: taş basamaklı dere [ilk, son sütun]. ada: uçan adacık süsleri (platformlardan kendiliğinden). fener: yuva dağında asılı
// fenerler [sütun, dy]. kristal: yuvada parıldayan kristal kümeleri [sütun, ölçek, renk 0 lila 1 nane 2 altın].
const DEKOR9={
 agac:[[2,1.05,0],[29,.95,1],[63,1.1,2],[100,1.15,3],[133,1,0],[161,1.2,1,1],[196,1.05,2],
  [243,1.15,1],[312,1.1,0],[351,1.25,3],[377,1,2],[383,1.1,0],[427,1.15,3],[438,.95,1],[537,1.1,2],[548,1.05,0],[566,1,3]],
 kaya:[[12,1],[38,.8],[70,1.2],[92,.9],[112,1.1],[140,.8],[178,1.2],[198,.9],[252,1.3],[268,1],[292,1.1],[308,.9],[326,1.2],[346,1],[370,1.1],
  [432,1],[446,.9],[508,1.1],[527,.9],[545,1.2],[558,.8],[772,1],[786,1.2]],
 yuva:[[8,.9,'yer'],[96,1,'kaya'],[144,.9,'yer'],[192,1.1,'kaya'],[256,1,'kaya'],[372,.9,'yer'],[434,1,'kaya'],[552,1,'yer'],[776,1.1,'kaya']],
 selale:[[279,560,150,3],[330,500,110,2],[254,420,80,2],[368,460,90,2]],
 dere:[[271,288]],
 fener:[[766,-200],[778,-240],[790,-260],[800,-300],[826,-300],[836,-280]],
 kristal:[[784,.8,0],[798,1,1],[806,.7,2],[822,.9,0],[830,1.1,2],[838,.8,1]]
};

const FLOWERS=[];
const TREE=null;
