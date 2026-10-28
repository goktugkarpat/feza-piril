/* Annemle Yıldız Yolculuğu: Dünya, Ay, Mars ve korumalı dev-gezegen istasyonları. */
'use strict';
const ROWS=30,COLS=1800;
const grid=Array.from({length:ROWS},()=>new Uint8Array(COLS));
for(let c=0;c<COLS;c++)for(let r=18;r<ROWS;r++)grid[r][c]=1;
const topOf=c=>{c=Math.floor(c);return c<0||c>=COLS?ROWS:18;};
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>720;
const nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}){const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}
const BOLUM={ad:'Annemle Yıldız Yolculuğu',baslangic:{x:nx(8),y:720},gol:null,gollar:[],
 bolgeler:[{ad:'dunya',x0:0,x1:90*T},{ad:'ay',x0:180*T,x1:480*T},{ad:'mars',x0:570*T,x1:900*T},{ad:'jupiter',x0:990*T,x1:1290*T},{ad:'uranus',x0:1380*T,x1:1680*T},{ad:'ev',x0:1770*T,x1:1800*T}],
 kamera:[{x0:0,x1:COLS*T,zoom:.87,yOfs:-45}],final:{x:nx(1780),y:720}};
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=720;P.vx=P.vy=0;P.ground=true;
D.x=P.x-60;D.y=P.y-110;light=lightTarget=1;
nesne('k14Launch',58,720,{x0:nx(48),x1:nx(90)});
[[90,180,0,1],[480,570,1,2],[900,990,2,3],[1290,1380,3,4],[1680,1770,4,0]].forEach(([a,b,from,to])=>nesne('k14Voyage',a,720,{from,to,x0:nx(a),x1:nx(b),inisX:nx(b+1),inisY:720}));
[220,310,410,610,720,830,1030,1130,1230,1420,1530,1630].forEach((c,i)=>nesne('k14Activity',c,720,{world:Math.floor(i/3),kind:i%3,sira:i,r:150}));
nesne('k14Final',1780,720,{r:140});nesne('k14Runtime',0,0,{});
const FLOWERS=[],TREE=null;
