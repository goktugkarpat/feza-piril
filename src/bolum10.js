/* bolum10.js — Zamanın Uyuduğu Vadi. Kesintisiz, düz ve geniş çocuk patikası; isteğe bağlı yaprak basamakları.
   Tüm etkinlikler yerde ve erişilebilir. Yeni rüya yalnız kendi haritasını ve dn10 dünyasını yükler. */
'use strict';
const ROWS=30,COLS=500;
const grid=Array.from({length:ROWS},()=>new Uint8Array(COLS));
const ground=(a,b,h)=>{for(let c=a;c<=b;c++)for(let r=ROWS-h;r<ROWS;r++)grid[r][c]=1;};
const plat=(a,b,r)=>{for(let c=a;c<=b;c++)grid[r][c]=2;};
const topOf=c=>{c=Math.floor(c);if(c<0||c>=COLS)return ROWS;for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r;return ROWS;};
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>topOf(c)*T;
const nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}){const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}
// Ana yol tamamen düzdür: beş yaşındaki çocuk yalnız sağa basılı tutarak her etkinliğe ulaşır.
// Yükseklik hissi çizilen arka plan ve isteğe bağlı yaprak platformlarıyla verilir.
ground(0,COLS-1,12);
// Geri dönmek ve zıplamak isteğe bağlıdır; bu basamakların altında da yürünebilir zemin vardır.
for(const [a,b,r] of [[31,34,16],[47,50,16],[123,126,16],[229,232,16],[309,312,16],[332,335,16],[409,412,16]])plat(a,b,r);
const BOLUM={ad:'Zamanın Uyuduğu Vadi',baslangic:{x:nx(10),y:yuzey(10)},gol:null,gollar:[],
 bolgeler:[{ad:'uyanis',x0:0,x1:67*T},{ad:'damlalar',x0:67*T,x1:130*T},{ad:'tilkiler',x0:130*T,x1:237*T},
 {ad:'bahce',x0:237*T,x1:328*T},{ad:'anilar',x0:328*T,x1:390*T},{ad:'yolculuk',x0:390*T,x1:445*T},{ad:'zamanAgaci',x0:445*T,x1:COLS*T}],
 kamera:[{x0:0,x1:67*T,zoom:.88,yOfs:-45},{x0:67*T,x1:130*T,zoom:.84,yOfs:-70},{x0:130*T,x1:237*T,zoom:.9,yOfs:-35},
 {x0:237*T,x1:328*T,zoom:.87,yOfs:-55},{x0:328*T,x1:390*T,zoom:.86,yOfs:-65},{x0:390*T,x1:445*T,zoom:.82,yOfs:-80},{x0:445*T,x1:COLS*T,zoom:.8,yOfs:-100}],
 zamanAgaci:{x:nx(460),y:yuzey(460)},tilkiTop:6};
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;D.x=P.x-60;D.y=P.y-85;
const bl10Damla=nesne('zamanDamla',90,yuzey(90),{x0:nx(74),x1:nx(108)});
nesne('miniKapi',96,yuzey(96),{bagId:bl10Damla.id,stil:'ejder'});
for(const c of [154,155,156,157,158,159])nesne('zamanTilki',c,yuzey(c),{sira:NESNELER.filter(n=>n.tip==='zamanTilki').length});
const bl10Bahce=nesne('zamanBahce',270,yuzey(270),{x0:nx(251),x1:nx(290)});
nesne('miniKapi',276,yuzey(276),{bagId:bl10Bahce.id,stil:'ejder'});
const bl10Kure=nesne('zamanKure',365,yuzey(365),{x0:nx(347),x1:nx(385)});
nesne('miniKapi',371,yuzey(371),{bagId:bl10Kure.id,stil:'ejder'});
// Each suspended moment has its own fixed drawing anchor, including on the walk back.
for(const [sira,u] of [.22,.51,.79].entries())nesne('zamanYolAni',397,yuzey(397),{x:nx(397)+(442*T-nx(397))*u,sira});
const bl10Sandal=nesne('zamanSandal',397,yuzey(397),{varisX:442*T,varisY:yuzey(442)});
nesne('miniKapi',402,yuzey(402),{bagId:bl10Sandal.id,stil:'ejder'});
nesne('zamanAgaci',460,yuzey(460),{r:140});
// Dekor etkinlik hedeflerinden uzakta; sadece resim, hiçbir görünmez çarpışma kutusu yok.
const DEKOR10={
 agac:[[4,.85],[52,.85],[121,.72],[200,.9],[232,.8],[314,.9],[388,.72],[482,.85]],
 cicek:[[18,1,0],[42,.85,1],[62,.9,2],[110,.9,1],[124,.8,2],[146,.6,0],[183,.85,2],[193,.75,0],[230,.9,1],[248,1,2],[294,1.15,0],[316,.95,1],[338,.85,2],[391,.8,0],[420,1.1,1],[441,1,2],[480,1.2,0]],
 ada:[[31,-400,.8],[104,-440,1],[211,-420,.65],[235,-360,.8],[310,-450,.9],[382,-460,1],[443,-440,.8]],
 selale:[[58,280,80],[82,430,170],[105,330,100],[317,300,100],[355,430,140],[388,350,105]],
 kemer:[],
 saat:[[24,-315],[59,-270],[128,-300],[175,-290],[226,-280],[307,-300],[335,-320],[406,-300],[434,-330]]
};
const FLOWERS=[],TREE=null;
