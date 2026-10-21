/* bolum8.js — Balkabağı Gecesi (sekizinci rüya, Cadılar Bayramı). Ay ışığında, mor-turuncu bir gece: balkabağı tarlası,
   eğri ağaçlı koru, iskelet orkestrası, şeker sokağı, Cadı Nine'nin bahçesi, süpürgeyle uçuş ve köy meydanında Balkabağı Şenliği.
   Korkutucu hiçbir şey yok. Ana patikada her basamak en çok iki kare. Süpürge yolculuğu boşluğu (651..801) yalnız uçuşla geçilir.
   Sözleşme: src/BOLUM8.md. Çizimler dunya8.js (dn8*), nesneler kostum.js / kabak.js / seker.js / kabakyuz.js / iskelet.js /
   kazan.js / supurge.js.
   (İlk yerleşim koordinatörden; HARITA ajanı sözleşmedeki sütun düzenini koruyarak geliştirir.) */
'use strict';
const ROWS = 30, COLS = 880;
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
 [0,30,11],[31,40,12],[41,52,12],[53,64,11],                                        // giriş: kostüm açıklığı
 [65,78,12],[79,92,13],[93,110,12],[111,124,11],[125,140,12],[141,158,13],[159,172,12],[173,204,11],   // balkabağı tarlası
 [205,244,11],                                                                      // kabak yüzü açıklığı (düz, geniş)
 [245,258,12],[259,272,13],[273,290,12],[291,306,11],[307,322,12],[323,340,13],[341,356,12],[357,384,11], // eğri ağaçlar korusu
 [385,430,11],                                                                      // iskelet sahnesi (düz, geniş)
 [431,610,11],                                                                      // şeker sokağı (düz kaldırım)
 [611,650,12],                                                                      // Cadı Nine'nin bahçesi (kalkış)
 [802,822,12],[823,834,13],[835,879,14]])                                           // meydana iniş ve köy meydanı
 ground(a,b,h);

// ── Tek yönlü platformlar (alçak çatı saçakları / dallar: normal zıplamayla oyuncak basamaklar) ──
for(const [a,b,r] of [[84,88,14],[146,150,14],[264,268,14],[328,332,14]]) plat(a,b,r);

const BOLUM={
 ad:'Balkabağı Gecesi',baslangic:{x:nx(5),y:yuzey(5)},
 bolgeler:[{ad:'giris',x0:0,x1:65*T},{ad:'tarla',x0:65*T,x1:205*T},{ad:'kabakYuz',x0:205*T,x1:245*T},{ad:'koru',x0:245*T,x1:385*T},
  {ad:'iskelet',x0:385*T,x1:431*T},{ad:'sokak',x0:431*T,x1:611*T},{ad:'bahce',x0:611*T,x1:651*T},{ad:'yolculuk',x0:651*T,x1:802*T},
  {ad:'meydan',x0:802*T,x1:COLS*T}],
 gol:null,gollar:[],
 // Süpürge yolculuğu koridoru (supurge.js): bahçeden kalkış, ayın önünden ve köyün üstünden uçuş, meydanın girişine iniş.
 // oyun.js uçuş kamerası BOLUM.ucus'u okur (yUst..yAlt ekrana sığar).
 supurge:{x0:nx(646),x1:nx(803),yUst:80,yAlt:720,inisX:nx(806),inisY:yuzey(806)},
 meydan:{x:nx(852),y:yuzey(852)},
 fenerTop:12,hayaletTop:5,kapiTop:6,
 kamera:[{x0:0,x1:64*T,zoom:.92,yOfs:-40},{x0:65*T,x1:204*T,zoom:.86,yOfs:-80},{x0:205*T,x1:244*T,zoom:.84,yOfs:-50},
  {x0:245*T,x1:384*T,zoom:.86,yOfs:-80},{x0:385*T,x1:430*T,zoom:.84,yOfs:-50},{x0:431*T,x1:610*T,zoom:.86,yOfs:-60},
  {x0:611*T,x1:650*T,zoom:.84,yOfs:-60},{x0:802*T,x1:COLS*T,zoom:.8,yOfs:-120}]
};
BOLUM.ucus=BOLUM.supurge;
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;D.x=P.x-60;D.y=P.y-85;

// ── Kostüm seçimi (kostum.js): başlangıçta havada süzülen dört kostüm; Feza birine dokununca giyer. ──
nesne('kostumSec',14,yuzey(14),{r:0});

// ── Balkabağı fenerleri (12; kabak.js): dokununca / yanından geçince içinde ışık yanar, her birinin yüzü başka. ──
for(const c of [22,44,78,104,130,158,186,268,310,352,462,590])
 nesne('kabakFener',c,yuzey(c),{r:80,sira:NESNELER.filter(n=>n.tip==='kabakFener').length});

// ── Saklanan hayaletçikler (5; kabak.js): saklambaç; bulununca "Ce-ee!" deyip bölüm boyunca Feza'nın peşinden süzülür. ──
for(const [c,saklan] of [[58,'kabak'],[140,'cali'],[292,'agac'],[372,'cit'],[538,'baca']])
 nesne('hayaletcik',c,yuzey(c),{r:110,saklan});

// ── Gece dostları (dekor; kabak.js): baş aşağı sallanan yarasalar, şapkalı kara kedi, uykulu baykuş. ──
for(const [c,tur] of [[34,'yarasa'],[70,'kedi'],[116,'yarasa'],[238,'baykus'],[280,'yarasa'],[334,'yarasa'],[396,'baykus'],[452,'kedi'],[622,'kedi']])
 nesne('geceDost',c,yuzey(c),{tur});

// ── Mini oyun 1: kabağa yüz yapmak (kabakyuz.js); bitene kadar ilerisinde ışık perdesi. ──
const bl8Yuz=nesne('kabakYuzMini',224,yuzey(224),{r:150,x0:208*T,x1:241*T});
nesne('miniKapi',243,yuzey(243),{bagId:bl8Yuz.id,stil:'takim'});

// ── Mini oyun 2: iskelet orkestrası (iskelet.js). ──
const bl8Isk=nesne('iskeletMini',406,yuzey(406),{r:150,x0:389*T,x1:425*T});
nesne('miniKapi',428,yuzey(428),{bagId:bl8Isk.id,stil:'takim'});

// ── Şeker sokağı (seker.js): altı kapı, şeker mi şaka mı. ──
for(const [c,kim] of [[448,'kabakDede'],[474,'iskeletNine'],[500,'cadiKiz'],[526,'karaKedi'],[552,'hayaletTeyze'],[578,'kabakDede2']])
 nesne('sekerKapi',c,yuzey(c),{r:90,kim,sira:NESNELER.filter(n=>n.tip==='sekerKapi').length});

// ── Mini oyun 3: Cadı Nine'nin kazanı (kazan.js) → iksirden süpürge canlanır. ──
const bl8Kazan=nesne('kazanMini',626,yuzey(626),{r:150,x0:613*T,x1:642*T});
nesne('miniKapi',643,yuzey(643),{bagId:bl8Kazan.id,stil:'takim'});

// ── Süpürge yolculuğu (supurge.js): bahçenin ucunda kalkış → meydanın girişine iniş. ──
nesne('supurgeMini',646,yuzey(646),{r:120,x1:BOLUM.supurge.x1,yUst:BOLUM.supurge.yUst,yAlt:BOLUM.supurge.yAlt,
 inisX:BOLUM.supurge.inisX,inisY:BOLUM.supurge.inisY});

// ── Final: köy meydanında Balkabağı Şenliği (kabak.js 'cadiMeydan'). ──
nesne('cadiMeydan',852,yuzey(852),{r:170});

// ── İsteğe bağlı ışık tohumları (çatı saçakları / dallar). ──
for(const [c,y] of [[86,14*T],[148,14*T],[266,14*T],[330,14*T]]) nesne('tohum',c,y,{r:46});

const FLOWERS=[];
const TREE=null;
