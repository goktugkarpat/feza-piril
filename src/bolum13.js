/* bolum13.js — İpek Göğü. Yaşayan kökler, bulut çayırları ve yıldız korusu. Ana yol y=720; büyüyen dallar isteğe bağlıdır.
   Etkinlikler isteğe bağlıdır; yolculuk ve final kendi yumuşak akışlarını yönetir. */
'use strict';
const ROWS = 30, COLS = 720;
const grid = Array.from({length: ROWS}, () => new Uint8Array(COLS));
const ground = (a,b,h) => {for(let c=Math.max(0,a);c<=Math.min(COLS-1,b);c++)for(let r=ROWS-h;r<ROWS;r++)grid[r][c]=1;};
const plat = (a,b,r) => {for(let c=Math.max(0,a);c<=Math.min(COLS-1,b);c++)grid[r][c]=2;};
ground(0,COLS-1,12);
const topOf = c => {c=Math.floor(c);if(c<0||c>=COLS)return ROWS;for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r;return ROWS;};
const cell = (c,r) => c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey = c => topOf(c)*T;
const nx = c => c*T+T/2;
function nesne(tip,c,y,o={}) {const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}
const BOLUM = {
 ad:'İpek Göğü', baslangic:{x:nx(8),y:720}, gol:null,gollar:[],
 bolgeler:[{ad:'kiyi',x0:0,x1:90*T},{ad:'kopru',x0:90*T,x1:170*T},{ad:'tepeler',x0:170*T,x1:285*T},
  {ad:'kelebek',x0:285*T,x1:390*T},{ad:'perde',x0:390*T,x1:470*T},{ad:'kurdele',x0:470*T,x1:630*T},{ad:'meydan',x0:630*T,x1:720*T}],
 kamera:[{x0:0,x1:90*T,zoom:.94,yOfs:-10},{x0:90*T,x1:170*T,zoom:.9,yOfs:0},
  {x0:170*T,x1:285*T,zoom:.9,yOfs:10},{x0:285*T,x1:390*T,zoom:.9,yOfs:-10},
  {x0:390*T,x1:470*T,zoom:.86,yOfs:0},{x0:470*T,x1:634*T,zoom:.9,yOfs:0},
  {x0:634*T,x1:720*T,zoom:.9,yOfs:0}],
 ucus:{x0:nx(478),x1:nx(632),yUst:160,yAlt:720,inisX:nx(632),inisY:720},
 final:{x:nx(690),y:720}, ipekY:720
};
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;P.vx=P.vy=0;P.ground=true;
D.x=P.x-60;D.y=P.y-110;light=lightTarget=.95;
// Uyuyan ışık tohumları dokununca kök salar ve gerçek yaprak basamakları büyütür.
[18,34,54,76,86].forEach((c,i)=>nesne('k13Ponpon',c,720,{sira:i,r:64}));
[102,123,145,165].forEach((c,i)=>nesne('k13Dokuma',c,720,{sira:i,r:170}));
[187,208,232,256,276].forEach((c,i)=>nesne('k13Minder',c,720,{sira:i,r:92}));
[304,330,355,380].forEach((c,i)=>{const bahce=nesne('k13Kelebek',c,720,{sira:i,r:230,dallar:[]});[-145,0,145].forEach((dx,j)=>bahce.dallar.push(nesne('k13YeniDal',c,720,{x:nx(c)+dx,sira:j,hedefH:[85,155,105][j]})));});
[406,432,454].forEach((c,i)=>nesne('k13Perde',c,720,{sira:i,r:215}));
nesne('k13Kurdele',478,720,{r:140,inisX:nx(632)});
[646,665,680].forEach((c,i)=>nesne('k13Ilmek',c,720,{sira:i,r:90}));
nesne('k13Gok',690,720,{r:160});
// Bu görünmez çalışma nesnesi havuzları bir kez günceller; ana yola/karaktere çarpmaz.
nesne('k13Ritim',0,0,{});
const FLOWERS=[];
const TREE=null;
