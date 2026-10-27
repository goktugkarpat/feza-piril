/* Sabancı kampüsü: rüya 12. Her rota yürünebilir; etkinlikler birbirinden bağımsızdır. */
'use strict';
const ROWS=30, COLS=980;
const grid=Array.from({length:ROWS},()=>new Uint8Array(COLS));
for(let c=0;c<COLS;c++) for(let r=18;r<ROWS;r++) grid[r][c]=1;
const topOf=c=>{ c=Math.floor(c); if(c<0||c>=COLS)return ROWS; for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r; return ROWS; };
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>topOf(c)*T, nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}) { const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o); NESNELER.push(n); return n; }
const BOLUM={ad:'Annemle Sabancı’da Bir Gün',baslangic:{x:nx(6),y:yuzey(6)},gol:null,gollar:[],
 bolgeler:[{ad:'lojman',x0:0,x1:55*T},{ad:'merkez',x0:55*T,x1:245*T},{ad:'sakura',x0:245*T,x1:450*T},{ad:'bilgi',x0:450*T,x1:650*T},{ad:'golet',x0:650*T,x1:900*T},{ad:'gosteri',x0:900*T,x1:COLS*T}],
 kamera:[{x0:0,x1:COLS*T,zoom:.82,yOfs:-110}],
 ucus:{x0:nx(675),x1:nx(790),yUst:100,yAlt:720,inisX:nx(790),inisY:yuzey(790)},
 final:{x:nx(965),y:yuzey(965)} };
P.x=P.safeX=BOLUM.baslangic.x; P.y=P.safeY=BOLUM.baslangic.y; D.x=P.x-60; D.y=P.y-85;
nesne('kampusOrigami',30,yuzey(30),{});
nesne('kampusDurbun',590,yuzey(590),{});
nesne('kampusSanat',410,yuzey(410),{});
nesne('kampusFoto',645,yuzey(645),{});
function etkinlik(tip,c,extra){const o=nesne(tip,c,yuzey(c),extra);const k=nesne('miniKapi',c,yuzey(c),{bagId:o.id,stil:'sarki'});k.x=o.x-(['kampusKayik','kampusBisiklet','kampusScooter'].includes(tip)?-40:160);return o;}
etkinlik('kampusBahce',40,{});
etkinlik('kampusBisiklet',70,{inisX:nx(120),inisY:yuzey(120)});
etkinlik('kampusScooter',145,{inisX:nx(210),inisY:yuzey(210)});
etkinlik('kampusUcurtma',285,{x0:nx(273),x1:nx(297)});
etkinlik('kampusSakuraAtolye',350,{});
etkinlik('kampusKitap',490,{x0:nx(478),x1:nx(502)});
etkinlik('kampusTiyatro',555,{});
etkinlik('kampusKule',615,{});
etkinlik('kampusKayik',675,{inisX:nx(790),inisY:yuzey(790)});
etkinlik('kampusGolet',800,{});
etkinlik('kampusPiknik',820,{x0:nx(808),x1:nx(832)});
etkinlik('kampusSanatAtolye',860,{});
etkinlik('kampusMuzik',900,{x0:nx(888),x1:nx(912)});
etkinlik('kampusTopSenligi',925,{});
nesne('kampusFinal',965,yuzey(965),{});
nesne('kampusKelebek',250,yuzey(250),{});
nesne('kampusKelebek',445,yuzey(445),{});
const FLOWERS=[]; const TREE=null;
