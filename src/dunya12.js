/* Sabancı kampüsü rüyası. Fotoğraflar kopyalanmaz; kampüsün belirgin mimari
   çizgilerinden esinlenen özgün, önbelleklenmiş 2B sahne katmanları.
   Kancalar: dn12Background, dn12Motes, dn12World, dn12Petals,
   dn12Foreground, dn12Vignette, dn12Isit. Hiçbiri çarpışma üretmez. */
'use strict';
const DN12 = {cache:Object.create(null), step:0};
// Aynı-origin/file:// güvenli bağımsız görsel. Yüklenmezse tüm özgün vektör katmanları çalışır.
const DN12_FASS=typeof Image==='function'?new Image():null;
if(DN12_FASS){DN12_FASS.decoding='async';DN12_FASS.src='assets/kampus/orta-cim-v2.png';}
const DN12_FASS_FRONT=typeof Image==='function'?new Image():null;
if(DN12_FASS_FRONT){DN12_FASS_FRONT.decoding='async';DN12_FASS_FRONT.src='assets/kampus/fass-cim-v1.png';}
const DN12_UC=typeof Image==='function'?new Image():null;
if(DN12_UC){DN12_UC.decoding='async';DN12_UC.src='assets/kampus/universite-merkezi.png';}
const DN12_FENS=typeof Image==='function'?new Image():null;
if(DN12_FENS){DN12_FENS.decoding='async';DN12_FENS.src='assets/kampus/fens.png';}
const DN12_HOME=typeof Image==='function'?new Image():null;
if(DN12_HOME){DN12_HOME.decoding='async';DN12_HOME.src='assets/kampus/lojman.png';}
const DN12_LIBRARY=typeof Image==='function'?new Image():null;
if(DN12_LIBRARY){DN12_LIBRARY.decoding='async';DN12_LIBRARY.src='assets/kampus/bilgi-merkezi.png';}
const DN12_TOWER_ENV=typeof Image==='function'?new Image():null;
if(DN12_TOWER_ENV){DN12_TOWER_ENV.decoding='async';DN12_TOWER_ENV.src='assets/kampus/kule-cevre.png';}
const DN12_LAKE=typeof Image==='function'?new Image():null;
if(DN12_LAKE){DN12_LAKE.decoding='async';DN12_LAKE.src='assets/kampus/golet.png';}
const DN12_SCENES=[
 {img:DN12_HOME,start:-Infinity,end:42,fadeEnd:65,panStart:0,panEnd:65,early:'home'},
 {img:DN12_FENS,start:32,fadeStart:40,end:48,fadeEnd:60,panStart:32,panEnd:60,early:'fens'},
 {img:DN12_UC,start:42,fadeStart:65,end:230,fadeEnd:255,panStart:55,panEnd:245,early:'center'},
 {img:DN12_FASS,start:230,fadeStart:255,end:430,fadeEnd:455,panStart:245,panEnd:450,fass:'field'},
 {img:DN12_FASS_FRONT,start:230,fadeStart:255,end:430,fadeEnd:455,panStart:270,panEnd:455,focus:.44,fass:'front'},
 {img:DN12_LIBRARY,start:430,fadeStart:455,end:630,fadeEnd:655,panStart:450,panEnd:650},
 {img:DN12_TOWER_ENV,start:565,fadeStart:590,end:630,fadeEnd:655,panStart:565,panEnd:650,tower:true},
 {img:DN12_LAKE,start:630,fadeStart:655,end:Infinity,panStart:650,panEnd:980}
];
// Yalnız geç yüklenmiş bir resim ekrana girerse önceki fon karışımını kısa
// süre koru. Diziler bir kez ayrılır; kamera/oyuncu ve ön katman saklanmaz.
const DN12_READY={mask:-1,lastCol:null,lastTime:null,start:0,active:false,lastVector:1,oldVector:1,
 last:new Float64Array(DN12_SCENES.length),old:new Float64Array(DN12_SCENES.length),want:new Float64Array(DN12_SCENES.length),draw:new Float64Array(DN12_SCENES.length)};
function dn12SceneWeight(scene,col){
 const i=scene.img;if(!i||!i.complete||!i.naturalWidth||!i.naturalHeight)return 0;
 let weight=(scene.fadeStart?dn12Smooth(scene.start,scene.fadeStart,col):1)*(scene.fadeEnd?1-dn12Smooth(scene.end,scene.fadeEnd,col):1);
 // FENS yoksa ilk iki sahnenin önceki ağırlıklarını aynen koru.
 const fensReady=DN12_FENS&&DN12_FENS.complete&&DN12_FENS.naturalWidth>0&&DN12_FENS.naturalHeight>0;
 if(fensReady&&scene.early==='home') weight=1-dn12Smooth(32,40,col);
 if(fensReady&&scene.early==='center') weight=dn12Smooth(48,60,col)*(scene.fadeEnd?1-dn12Smooth(scene.end,scene.fadeEnd,col):1);
 // Kule çevresi hazır değilken mevcut Bilgi Merkezi fonu bütünüyle korunur.
 const towerReady=DN12_TOWER_ENV&&DN12_TOWER_ENV.complete&&DN12_TOWER_ENV.naturalWidth>0&&DN12_TOWER_ENV.naturalHeight>0;
 if(towerReady&&scene.img===DN12_LIBRARY)weight*=1-dn12Smooth(565,590,col);
 // Ana çim görünümü ile FASS'a yakın görünüm arasında karışım; yeni dosya
 // yüklenemezse önceki çim sahnesi eksiksiz kalır.
 if(scene.fass){const ready=DN12_FASS_FRONT&&DN12_FASS_FRONT.complete&&DN12_FASS_FRONT.naturalWidth>0&&DN12_FASS_FRONT.naturalHeight>0;
  const mix=ready?dn12Smooth(260,285,col):0;weight*=scene.fass==='front'?mix:1-mix;}
 return weight;
}
// FENS etrafında etkinlik kamerasının ileri/geri hareketi rota fonunu
// geri yürütmesin: yalnız erken bölümde Feza'nın konumu için yumuşak alt sınır.
// Resim yüklenmediyse eski ev–merkez geçişi tamamen korunur.
function dn12SceneColumn(){
 const view=(cam.x+VW*.5)/T;
 if(!(DN12_FENS&&DN12_FENS.complete&&DN12_FENS.naturalWidth>0&&DN12_FENS.naturalHeight>0)||typeof P==='undefined'||!Number.isFinite(P.x))return view;
 const player=P.x/T;
 if(player<=25||player>=60)return view;
 const gate=dn12Smooth(25,27,player)*(1-dn12Smooth(58,60,player));
 return view+Math.max(0,player+6.5-view)*gate;
}
function dn12HasScene(){const col=dn12SceneColumn();for(const scene of DN12_SCENES)if(dn12SceneWeight(scene,col)>0)return true;return false;}
function dn12DrawScene(scene,col,alpha){
 const img=scene.img,k=Math.max(W/img.naturalWidth,H/img.naturalHeight),w=img.naturalWidth*k,h=img.naturalHeight*k,max=Math.max(0,w-W);
 const local=dn12Smooth(scene.panStart,scene.panEnd,col),center=w*(scene.focus||.5)-W*.5;
 const offset=Math.max(0,Math.min(max,center+(local-.5)*Math.min(160,max)));
 g.globalAlpha=alpha;g.drawImage(img,-offset,-Math.max(0,h-H)*.25,w,h);g.globalAlpha=1;
}
function dn12Smooth(a,b,x){const q=Math.max(0,Math.min(1,(x-a)/(b-a)));return q*q*(3-2*q);}
const dn12Keys=['sky','campus','lawn','lake','cloud','tower','library','faculty','stage','sakura','tree','bench','hedge','grass'];
const dn12Hash=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s);};
function dn12Canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function dn12Ellipse(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function dn12Line(c,col,w,fn){c.strokeStyle=col;c.lineWidth=w;c.beginPath();fn(c);c.stroke();}
function dn12Gradient(c,x0,y0,x1,y1,stops){const gr=c.createLinearGradient(x0,y0,x1,y1);for(const s of stops)gr.addColorStop(s[0],s[1]);return gr;}
function dn12Rounded(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);}
function dn12Sprite(key){
 if(DN12.cache[key])return DN12.cache[key];
 let cv,c;
 if(key==='sky'){
  cv=dn12Canvas(16,800);c=cv.getContext('2d');c.fillStyle=dn12Gradient(c,0,0,0,800,[[0,'#70b5e3'],[.48,'#b5dff1'],[.76,'#e5e9df'],[1,'#f8dcbf']]);c.fillRect(0,0,16,800);
 }else if(key==='campus'){
  // Fotoğraflardaki alçak beyaz/kızıl akademik kanatlar, kubbe ve çim avlular.
  cv=dn12Canvas(2400,430);c=cv.getContext('2d');
  c.fillStyle='#afd1b4';c.beginPath();c.moveTo(0,345);c.bezierCurveTo(250,280,400,320,660,290);c.bezierCurveTo(960,260,1200,330,1450,283);c.bezierCurveTo(1800,246,2050,312,2400,282);c.lineTo(2400,430);c.lineTo(0,430);c.closePath();c.fill();
  function block(x,y,w,h){c.fillStyle='#e9e5d7';c.fillRect(x,y,w,h);c.fillStyle='#c99683';c.fillRect(x,y+h*.35,w,h*.2);c.fillRect(x,y+h*.7,w,h*.13);
   c.fillStyle='#f4eee1';for(let row=0;row<3;row++)c.fillRect(x,y+row*h/3,w,5);
   for(let xx=x+14;xx<x+w-14;xx+=28)for(let yy=y+13;yy<y+h-10;yy+=h/3){c.fillStyle='#8ab4bc';c.fillRect(xx,yy,18,16);c.fillStyle='rgba(255,255,255,.65)';c.fillRect(xx+8,yy,2,16);}
   c.fillStyle='#dddccf';c.fillRect(x-3,y-5,w+6,7);}
  block(70,195,420,145);block(530,130,480,185);block(1050,182,360,155);block(1530,145,470,170);block(2050,220,300,130);
  c.fillStyle='#d6d9d2';c.fillRect(1322,191,300,155);c.fillStyle='#91bbc3';c.fillRect(1345,211,255,108);
  for(let x=1355;x<1600;x+=25){c.fillStyle='rgba(244,246,232,.8)';c.fillRect(x,211,4,108);}
  c.fillStyle='#798e8b';c.beginPath();c.moveTo(1322,191);c.quadraticCurveTo(1472,70,1622,191);c.closePath();c.fill();
  c.fillStyle='#ecede3';c.beginPath();c.moveTo(1325,190);c.quadraticCurveTo(1470,125,1619,190);c.lineTo(1619,200);c.quadraticCurveTo(1470,137,1325,200);c.closePath();c.fill();
  // Aradaki küçük selviler gerçek kampüsün çevre düzenine referans.
  for(let i=0;i<45;i++){const x=30+i*54,base=335+(i%4)*8,h=30+dn12Hash(i*11)*32;c.fillStyle=i%2?'#84b692':'#97c39a';c.beginPath();c.moveTo(x,base-h);c.quadraticCurveTo(x-11,base-h*.5,x-8,base);c.lineTo(x+8,base);c.quadraticCurveTo(x+11,base-h*.5,x,base-h);c.fill();}
 }else if(key==='lawn'){
  cv=dn12Canvas(8,360);c=cv.getContext('2d');c.fillStyle=dn12Gradient(c,0,0,0,360,[[0,'#b3d6a8'],[.42,'#a0ca97'],[.85,'#8dbb84'],[1,'#78aa78']]);c.fillRect(0,0,8,360);
 }else if(key==='lake'){
  cv=dn12Canvas(8,180);c=cv.getContext('2d');c.fillStyle=dn12Gradient(c,0,0,0,180,[[0,'#a9d8d2'],[.3,'#87c3c8'],[.7,'#8cc5c2'],[1,'#b3d9ca']]);c.fillRect(0,0,8,180);
 }else if(key==='cloud'){
  cv=dn12Canvas(420,140);c=cv.getContext('2d');c.save();c.scale(3,1);const gr=c.createRadialGradient(70,70,0,70,70,70);gr.addColorStop(0,'rgba(255,255,255,.68)');gr.addColorStop(.55,'rgba(255,255,255,.24)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,140,140);c.restore();
 }else if(key==='tower'){
  // Fotoğraf: ince çokgen cam gövde, kızıl kaide, geniş beyaz seyir balkonu ve küçük kubbe.
  cv=dn12Canvas(310,790);c=cv.getContext('2d');
  dn12Ellipse(c,155,766,132,15,'rgba(65,92,87,.15)');
  c.fillStyle='#8d5448';c.beginPath();c.moveTo(108,747);c.lineTo(112,648);c.lineTo(128,620);c.lineTo(182,620);c.lineTo(199,648);c.lineTo(202,747);c.closePath();c.fill();
  for(let y=658;y<728;y+=12){c.fillStyle='rgba(69,45,41,.25)';c.fillRect(113,y,84,2);c.fillRect(120+(y%24?17:0),y+2,2,9);c.fillRect(154+(y%24?17:0),y+2,2,9);}
  c.fillStyle='#e8dfca';c.fillRect(105,731,100,16);c.fillRect(111,643,88,10);
  c.fillStyle=dn12Gradient(c,118,0,192,0,[[0,'#e8e9df'],[.10,'#8f9b97'],[.15,'#26383f'],[.36,'#354c53'],[.51,'#59747a'],[.68,'#283c45'],[.86,'#1b2b32'],[.91,'#e6eae1'],[1,'#9caea7']]);
  c.beginPath();c.moveTo(118,647);c.lineTo(121,163);c.lineTo(190,163);c.lineTo(194,647);c.closePath();c.fill();
  // İnce beyaz düşey taşıyıcılar, koyu cam ve düzenli kat çizgileri.
  for(const x of [122,143,167,187]){c.fillStyle=x===122||x===187?'#d9ded6':'#aabbb7';c.fillRect(x,170,x===122||x===187?4:2,472);}
  for(let y=188;y<630;y+=30){c.fillStyle='rgba(201,215,208,.58)';c.fillRect(123,y,66,2);c.fillStyle='rgba(208,232,226,.13)';c.fillRect(128,y+7,10,19);}
  // Reference-visible tower foot: pale sloping side supports, dark entrance, low steps.
  // All shapes remain within the existing 310 x 790 sprite; no interactive geometry changes.
  c.fillStyle='#e4e8dd';c.beginPath();c.moveTo(112,625);c.lineTo(124,580);c.lineTo(124,648);c.lineTo(109,657);c.closePath();c.fill();
  c.fillStyle='#b9c5bc';c.beginPath();c.moveTo(186,580);c.lineTo(199,625);c.lineTo(202,657);c.lineTo(186,648);c.closePath();c.fill();
  c.fillStyle='#cfdbd4';c.fillRect(138,660,34,82);
  c.fillStyle='#293c3d';c.fillRect(142,664,26,78);
  c.fillStyle='#668279';c.fillRect(153,665,3,77);
  c.fillStyle='#ecede1';c.beginPath();c.moveTo(95,744);c.lineTo(215,744);c.lineTo(224,751);c.lineTo(86,751);c.closePath();c.fill();
  c.fillStyle='#d3dbd1';c.beginPath();c.moveTo(86,751);c.lineTo(224,751);c.lineTo(235,758);c.lineTo(75,758);c.closePath();c.fill();
  c.fillStyle='#eef0e7';c.fillRect(75,758,160,4);
  c.fillStyle='#f1ece0';c.beginPath();c.moveTo(93,170);c.lineTo(216,170);c.lineTo(231,148);c.lineTo(80,148);c.closePath();c.fill();
  c.fillStyle='#b8c3ba';c.fillRect(87,158,136,7);c.fillStyle='#eef1e7';c.fillRect(98,112,115,39);
  c.fillStyle='#283d45';c.fillRect(107,116,96,31);for(let x=110;x<205;x+=16){c.fillStyle='#e7e8dc';c.fillRect(x,116,4,31);}
  c.fillStyle='#f6f4e9';c.fillRect(94,110,122,7);
  c.fillStyle='#dce2d9';c.beginPath();c.moveTo(105,110);c.quadraticCurveTo(155,48,205,110);c.closePath();c.fill();
  dn12Line(c,'#a8b5af',3,p=>{p.moveTo(113,107);p.quadraticCurveTo(155,65,197,107);});
  c.fillStyle='#c2d0c9';c.fillRect(151,69,8,12);dn12Ellipse(c,155,69,7,4,'#e8ece4');
 }else if(key==='library'){
  // Bilgi Merkezi: iki tuğla-beyaz kanat, yarım daire camlı orta cephe, basık kubbe.
  cv=dn12Canvas(1120,620);c=cv.getContext('2d');
  dn12Ellipse(c,560,592,540,21,'rgba(55,100,91,.15)');
  c.fillStyle='#dfb39d';c.fillRect(40,275,1040,300);c.fillStyle='#bd7f70';c.fillRect(40,332,1040,58);c.fillRect(40,435,1040,52);
  for(let i=0;i<7;i++){let y=280+i*43;c.fillStyle='#f7f1e4';c.fillRect(40,y,1040,10);}
  for(let row=0;row<2;row++)for(let i=0;i<12;i++){let x=58+i*84,y=318+row*104;if(x>300&&x<820)continue;c.fillStyle='#edf2e9';c.fillRect(x-4,y-4,68,60);c.fillStyle=dn12Gradient(c,x,y,x+60,y+50,[[0,'#94c9d5'],[.5,'#568b9d'],[1,'#bfdce0']]);c.fillRect(x,y,60,52);c.fillStyle='rgba(255,255,255,.6)';c.fillRect(x+28,y,3,52);c.fillRect(x,y+24,60,3);}
  c.fillStyle='#e4e6dc';c.beginPath();c.moveTo(300,282);c.quadraticCurveTo(560,225,820,282);c.lineTo(820,570);c.quadraticCurveTo(560,600,300,570);c.closePath();c.fill();
  c.fillStyle=dn12Gradient(c,300,0,820,0,[[0,'#6d94a0'],[.3,'#9ac4c9'],[.52,'#c7dfdd'],[.75,'#79a9b8'],[1,'#547b8d']]);c.beginPath();c.moveTo(322,294);c.quadraticCurveTo(560,248,798,294);c.lineTo(798,551);c.quadraticCurveTo(560,576,322,551);c.closePath();c.fill();
  for(let x=344;x<800;x+=42){c.strokeStyle='rgba(238,245,235,.85)';c.lineWidth=5;c.beginPath();c.moveTo(x,286);c.lineTo(x,564);c.stroke();}
  for(let y=315;y<550;y+=47)dn12Line(c,'rgba(239,244,233,.9)',6,p=>{p.moveTo(315,y);p.quadraticCurveTo(560,y+24,805,y);});
  c.fillStyle='#536f76';c.beginPath();c.moveTo(300,278);c.quadraticCurveTo(332,136,560,120);c.quadraticCurveTo(788,136,820,278);c.closePath();c.fill();
  c.fillStyle='#d7ded5';c.beginPath();c.moveTo(320,265);c.quadraticCurveTo(560,178,800,265);c.lineTo(800,280);c.quadraticCurveTo(560,198,320,280);c.closePath();c.fill();
  for(let i=0;i<5;i++)dn12Line(c,'rgba(245,248,236,.65)',2,p=>{p.moveTo(350+i*25,255-i*10);p.quadraticCurveTo(560,178-i*9,770-i*25,255-i*10);});
  c.fillStyle='#dcebe4';c.fillRect(15,572,1090,11);c.fillStyle='#a9d7db';c.fillRect(80,582,960,11);
 }else if(key==='faculty'){
  cv=dn12Canvas(920,470);c=cv.getContext('2d');c.fillStyle='#f4eee2';c.fillRect(22,88,876,352);c.fillStyle='#bf7d6b';c.fillRect(22,145,876,78);c.fillRect(22,275,876,62);
  for(let y=92;y<430;y+=44){c.fillStyle='#f6eee0';c.fillRect(22,y,876,10);}
  for(let row=0;row<2;row++)for(let col=0;col<13;col++){let x=44+col*64,y=135+row*132;c.fillStyle='#f8f4e9';c.fillRect(x-3,y-3,56,87);c.fillStyle='#86b8c9';c.fillRect(x,y,50,80);c.fillStyle='rgba(255,255,255,.65)';c.fillRect(x+24,y,3,80);c.fillRect(x,y+40,50,3);}
  c.fillStyle='#e7e8df';c.fillRect(12,80,896,15);c.fillStyle='#bdc7c2';c.fillRect(12,75,896,7);
 }else if(key==='stage'){
  cv=dn12Canvas(980,470);c=cv.getContext('2d');
  c.fillStyle='#e8ded0';c.beginPath();c.moveTo(10,155);c.lineTo(970,155);c.lineTo(930,435);c.lineTo(50,435);c.closePath();c.fill();
  c.fillStyle='#c37e70';c.fillRect(55,240,870,150);c.fillStyle='#648f9b';c.fillRect(86,252,808,116);
  for(let x=100;x<900;x+=66){c.fillStyle='rgba(234,242,232,.8)';c.fillRect(x,252,5,116);}c.fillStyle='#f7f1e4';c.fillRect(35,225,910,18);c.fillRect(55,383,870,13);
  c.fillStyle='#f4ece0';c.beginPath();c.moveTo(20,152);c.quadraticCurveTo(480,73,960,152);c.lineTo(940,179);c.quadraticCurveTo(480,112,40,179);c.closePath();c.fill();
  c.fillStyle='#d9b49a';c.fillRect(70,410,840,15);c.fillStyle='#ead9c6';c.fillRect(35,425,910,15);
 }else if(key==='sakura'){
  cv=dn12Canvas(440,500);c=cv.getContext('2d');
  c.fillStyle='#795458';c.beginPath();c.moveTo(184,492);c.bezierCurveTo(195,418,200,325,203,224);c.lineTo(231,224);c.bezierCurveTo(230,340,239,424,254,492);c.closePath();c.fill();
  c.strokeStyle='#805c60';c.lineWidth=17;c.lineCap='round';for(const [x,y] of [[85,140],[135,83],[270,70],[345,128],[372,188]]){c.beginPath();c.moveTo(216,320);c.quadraticCurveTo(220,210,x,y);c.stroke();}
  // Küçük, çok katmanlı çiçek demetleri; dallar aradan seçilir.
  for(let i=0;i<260;i++){const a=i*2.399,r=10+Math.sqrt(dn12Hash(i*4.7))*175,x=220+Math.cos(a)*r,y=147+Math.sin(a)*r*.62,rr=8+dn12Hash(i*7.1)*14;dn12Ellipse(c,x,y,rr,rr*.78,['#cb8195','#e6a3b0','#f6c6cb','#df94a5','#fae1df'][i%5]);}
  for(let i=0;i<190;i++){let x=65+dn12Hash(i*3)*310,y=52+dn12Hash(i*13)*200;if(((x-220)*(x-220)/27000+(y-150)*(y-150)/11000)>1.2)continue;const s=1.5+dn12Hash(i*5)*3;dn12Ellipse(c,x,y,s,s*.75,i%2?'#fff5ef':'#f9d8da');}
  c.fillStyle='rgba(255,255,255,.16)';c.fillRect(207,279,5,190);
 }else if(key==='tree'){
  cv=dn12Canvas(330,410);c=cv.getContext('2d');c.fillStyle='#766457';c.beginPath();c.moveTo(140,407);c.bezierCurveTo(150,340,152,260,150,184);c.lineTo(178,184);c.bezierCurveTo(175,280,183,345,193,407);c.closePath();c.fill();
  c.strokeStyle='#766457';c.lineCap='round';c.lineWidth=10;for(const a of [[64,87],[106,62],[230,70],[274,120]]){c.beginPath();c.moveTo(164,250);c.quadraticCurveTo(165,180,a[0],a[1]);c.stroke();}
  for(let i=0;i<240;i++){const a=i*2.399,r=20+Math.sqrt(dn12Hash(i*6.1))*120,x=165+Math.cos(a)*r,y=141+Math.sin(a)*r*.72;dn12Ellipse(c,x,y,8+dn12Hash(i*2)*13,6+dn12Hash(i*3)*11,['#4f8d69','#68a878','#81b687','#a3c993','#5c9b70'][i%5]);}
  for(let i=0;i<130;i++){const x=55+dn12Hash(i*7)*220,y=58+dn12Hash(i*19)*170;if(((x-165)*(x-165)/14000+(y-140)*(y-140)/6500)>1)continue;dn12Ellipse(c,x,y,2+dn12Hash(i)*3,1.5,'rgba(206,232,178,.45)');}
 }else if(key==='bench'){
  cv=dn12Canvas(220,110);c=cv.getContext('2d');c.fillStyle='#5c5d59';c.fillRect(35,56,8,50);c.fillRect(177,56,8,50);c.fillStyle='#9e715c';c.fillRect(22,28,176,12);c.fillRect(22,44,176,12);c.fillRect(16,68,188,15);c.fillStyle='#ddb193';c.fillRect(24,30,172,3);c.fillRect(18,70,184,3);
 }else if(key==='hedge'){
  cv=dn12Canvas(520,100);c=cv.getContext('2d');
  c.fillStyle='#80ad81';c.fillRect(0,58,520,42);
  for(let i=0;i<150;i++){const x=dn12Hash(i*7)*520,y=45+dn12Hash(i*13)*40,r=7+dn12Hash(i*3)*13;dn12Ellipse(c,x,y,r,r*.7,['#76a97b','#8cb989','#9ac594','#6fa47b'][i%4]);}
  for(let i=0;i<90;i++){const x=dn12Hash(i*11)*520,y=45+dn12Hash(i*31)*37;dn12Ellipse(c,x,y,2+dn12Hash(i*6)*3,2,i%7===0?'#f5d9c5':'rgba(223,238,198,.45)');}
 }else if(key==='grass'){
  cv=dn12Canvas(640,100);c=cv.getContext('2d');c.fillStyle=dn12Gradient(c,0,0,0,100,[[0,'#a4d47d'],[.24,'#83bd68'],[.64,'#6ca55d'],[1,'#609654']]);c.fillRect(0,0,640,100);
  for(let i=0;i<550;i++){let x=dn12Hash(i*5)*640,y=dn12Hash(i*9)*100;c.fillStyle=i%3?'rgba(49,111,62,.10)':'rgba(226,246,175,.19)';dn12Ellipse(c,x,y,1+dn12Hash(i)*4,.8+dn12Hash(i*3)*2,c.fillStyle);}
  for(let i=0;i<180;i++){let x=dn12Hash(i*7)*640,y=5+dn12Hash(i*15)*93,h=3+dn12Hash(i*13)*9;c.strokeStyle=i%2?'rgba(71,143,76,.5)':'rgba(190,225,138,.5)';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-3,y-h*.6,x-3,y-h);c.stroke();}
  // Küçük kır çiçekleri yalnız zeminde; kullanılabilir hedeflerle karışmaz.
  for(let i=0;i<32;i++){const x=dn12Hash(i*23)*640,y=12+dn12Hash(i*29)*75,r=1+dn12Hash(i*31)*1.5;dn12Ellipse(c,x,y,r*2,r*.7,'rgba(42,109,57,.25)');dn12Ellipse(c,x,y-r*2,r,r,i%4?'#f9ecd1':'#f6b7c6');}
 }
 DN12.cache[key]=cv;return cv;
}
function dn12Isit(){if(DN12_HOME&&DN12_HOME.complete&&DN12_HOME.naturalWidth>0&&DN12_HOME.naturalHeight>0){if(!DN12.cache.grass){dn12Sprite('grass');return false;}if(!DN12.cache.tower){dn12Sprite('tower');return false;}return true;}if(DN12.step<dn12Keys.length){dn12Sprite(dn12Keys[DN12.step++]);return false;}return true;}
function dn12Ready(){return typeof W==='number'&&typeof H==='number'&&typeof S==='number'&&S>0&&typeof cam!=='undefined'&&Number.isFinite(cam.x)&&Number.isFinite(cam.y);}
function dn12Ground(){return typeof topOf==='function'?topOf(2)*T:720;}
function dn12DrawAsset(key,x,y,w,h){if(x+w/2<cam.x-100||x-w/2>cam.x+VW+100)return;const img=dn12Sprite(key);g.drawImage(img,x-w/2,y-h,w,h);}
// Çok dar ekranda kule merkezini biraz içeri taşır; oyun alanı ve hedefler değişmez.
function dn12TowerX(){return 606*T+Math.max(0,Math.min(260,9.5*T+71-VW/2));}
// Yalnız mini oyunun kule çizdiği aşamada çevre kopyasını gizle.
function dn12TowerMiniDraws(){return typeof P!=='undefined' && !!P && !!P.ucus && P.ucus.tip==='kampusKule' && !!P.ucus.ku12 && P.ucus.ku12.active===true && P.ucus.ku12.faz===1;}
// Yalnız gölet kıyısında, ayak düzleminin ALTINDA yumuşak toprak yolu.
// Bu çizim çarpışma, kayık su hizası veya karakter konumlarını değiştirmez.
function dn12LakePath(y,col,opacity=1){
 const a=dn12Smooth(640,660,col)*(1-dn12Smooth(890,910,col))*opacity;if(a<=0)return;
 const left=cam.x-30,width=VW+60;g.save();
 g.fillStyle='#d49a77';g.globalAlpha=a*.15;g.fillRect(left,y+2,width,5);g.fillRect(left,y+77,width,7);
 g.globalAlpha=a*.42;g.fillRect(left,y+7,width,5);g.fillRect(left,y+72,width,5);
 g.globalAlpha=a*.78;g.fillRect(left,y+12,width,60);
 g.fillStyle='#efc8a3';g.globalAlpha=a*.22;g.fillRect(left,y+14,width,5);
 // Yolun çime karışan alt sınırı ve sabit, seyrek zemin dokusu.
 g.fillStyle='#92b178';g.globalAlpha=a*.22;g.fillRect(left,y+64,width,10);
 for(let x=Math.floor(left/87)*87;x<left+width;x+=87){const k=x/87,h=dn12Hash(k),yy=y+20+dn12Hash(k+7)*44;
  g.fillStyle=k%2?'#b47d60':'#f3d3b2';g.globalAlpha=a*(.11+h*.1);g.fillRect(x+8*h,yy,4+h*8,1.3);}
 g.restore();
}
// Zeminin sert kenarını çok ince ve dünyaya bağlı çim izleriyle birleştir.
// Yalnız çizim: yüzey yüksekliği, etkileşim ve yol koordinatları değişmez.
function dn12GroundSeam(y,opacity=1){
 if(!(opacity>0))return;const left=cam.x-30,width=VW+60;g.save();
 g.fillStyle='#bddb9d';g.globalAlpha=opacity*.09;g.fillRect(left,y-4,width,2);
 g.globalAlpha=opacity*.16;g.fillRect(left,y-2,width,2);
 g.fillStyle='#a9d294';g.globalAlpha=opacity*.21;g.fillRect(left,y,width,3);
 g.globalAlpha=opacity*.1;g.fillRect(left,y+3,width,3);
 g.strokeStyle='#e0edc6';g.lineWidth=1;g.globalAlpha=opacity*.24;g.beginPath();
 // FASS çiminde yürüyen Feza'nın yakınındaki birkaç ot yana yatabilir.
 // Dünya koordinatına bağlıdır; araçlar, mini oyunlar ve diğer alanlar etkilenmez.
 const brush=typeof P!=='undefined'&&typeof DURUM!=='undefined'&&DURUM==='oyun'&&
  P.ground&&!P.ucus&&Number.isFinite(P.x)&&Number.isFinite(P.vx)&&Math.abs(P.vx)>30&&
  P.x>=265*T&&P.x<430*T;
 let count=0;for(let x=Math.floor(left/112)*112;x<left+width&&count<20;x+=112){
  const h=dn12Hash(x/112),distance=brush?Math.abs(x-P.x):120;
  const bend=distance<120?(1-distance/120)*Math.max(-1,Math.min(1,P.vx/150))*3:0;
  g.moveTo(x,y+1);g.lineTo(x+(h-.5)*5+bend,y-2-h*3);count++;
 }
 g.stroke();g.restore();
}
// Kayık geçerken suya tutunan az sayıda küçük nilüfer ve ışık.
// Yatay konumları dünyaya sabit; su yüksekliği kayığın cover hesabıyla aynıdır.
function dn12BoatLakeLife(tm){
 if(typeof P==='undefined'||!P.ucus||P.ucus.tip!=='kampusKayik'||!DN12_LAKE||!DN12_LAKE.complete||!DN12_LAKE.naturalWidth||!DN12_LAKE.naturalHeight||!(S>0))return;
 const col=(cam.x+VW*.5)/T;if(col<650||col>=900)return;
 const opacity=DN12_READY.last[DN12_SCENES.length-1];if(!(opacity>0))return;
 const k=Math.max(W/DN12_LAKE.naturalWidth,H/DN12_LAKE.naturalHeight),height=DN12_LAKE.naturalHeight*k;
 const water=cam.y+(height*.50-Math.max(0,height-H)*.25)/S,step=390;
 const first=Math.ceil((cam.x+90)/step)*step,right=cam.x+VW-90;
 g.save();g.globalAlpha=opacity*.58;
 let count=0;for(let x=first;x<right&&count<5;x+=step){
  if(Number.isFinite(P.x)&&Math.abs(x-P.x)<160)continue;
  const i=x/step,b=dn12Hash(i*17),yy=water+22+b*42+Math.sin(tm*.75+i)*1.7;
  dn12Ellipse(g,x,yy+3,23,4,'rgba(234,255,239,.38)');
  dn12Ellipse(g,x,yy,15,4.5,'#71af9c');dn12Ellipse(g,x+3,yy-3,4,3,'#fff0df');
  if(i%2===0){dn12Ellipse(g,x-3,yy-4,3.4,3,'#f8cdd8');dn12Ellipse(g,x+2,yy-5,3.4,3,'#ffe6df');dn12Ellipse(g,x,yy-4,1.5,1.5,'#f1c675');}
  count++;
 }
 g.restore();
}
// Ana mekânlar arasında sabit hızla gezmek yerine rota boyunca doğru yapıya yumuşak odaklanır.
function dn12Background(tm){
 if(!dn12Ready())return;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;
 const R=DN12_READY,col=dn12SceneColumn(),time=Number.isFinite(tm)?tm:0;let mask=0,total=0;R.vectorWorldDrawn=false;
 for(let i=0;i<DN12_SCENES.length;i++){const s=DN12_SCENES[i],im=s.img;
  if(im&&im.complete&&im.naturalWidth>0&&im.naturalHeight>0)mask|=1<<i;
  R.want[i]=dn12SceneWeight(s,col);total+=R.want[i];}
 // Eksik sahnenin payını vektöre ver; mevcut fotoğrafı tam opakta tutup bir anda kesme.
 const wantVector=Math.max(0,1-total);
 if(total>1)for(let i=0;i<R.want.length;i++)R.want[i]/=total;
 const jumped=R.lastCol!==null&&Math.abs(col-R.lastCol)>12,rewound=R.lastTime!==null&&time<R.lastTime;
 const added=R.mask<0?0:mask&~R.mask;let relevant=false;
 for(let i=0;i<R.want.length;i++)if((added&(1<<i))&&R.want[i]>0)relevant=true;
 if(jumped||rewound)R.active=false;
 else if(relevant){R.old.set(R.last);R.oldVector=R.lastVector;R.start=time;R.active=true;}
 R.mask=mask;R.lastCol=col;R.lastTime=time;
 const u=R.active?dn12Smooth(0,.45,time-R.start):1;
 if(u>=1)R.active=false;
 let vector=R.active?R.oldVector*(1-u)+wantVector*u:wantVector,sum=vector;
 for(let i=0;i<R.want.length;i++){
  // Kaybolmuş/bozuk bir resmin eski kopyası çizilemez; güvenli biçimde atla.
  const old=R.active&&(mask&(1<<i))?R.old[i]:0;
  R.draw[i]=old*(1-u)+R.want[i]*u;sum+=R.draw[i];
 }
 if(total===0&&!R.active){vector=1;sum=1;}
 if(!(sum>0)){vector=1;sum=1;}
 R.lastVector=vector/sum;for(let i=0;i<R.draw.length;i++)R.last[i]=R.draw[i]/sum;
 if(vector>0){dn12VectorBackground(tm);g.save();dn12VectorWorld(tm);g.restore();R.vectorWorldDrawn=true;}
 let cumulative=vector;
 for(let i=0;i<R.draw.length;i++){const weight=R.draw[i];if(weight<=0)continue;
  cumulative+=weight;dn12DrawScene(DN12_SCENES[i],col,weight/cumulative);}
}
function dn12VectorBackground(tm){
 g.drawImage(dn12Sprite('sky'),0,0,W,H);
 // Uzak bulutlar, tepeler ve yeşil kampüs yamaçları ekran ölçeğinde yavaş paralaks.
 const u=((cam.x*.025)%(W+600)+(W+600))%(W+600);
 const cloud=dn12Sprite('cloud');for(let i=0;i<5;i++){const x=(((i*410-u)%(W+500))+(W+500))%(W+500)-200,y=H*(.055+(i%3)*.055);g.globalAlpha=.72;g.drawImage(cloud,x-150,y,330,90);}g.globalAlpha=1;
 g.fillStyle='#bed9cb';g.beginPath();g.moveTo(0,H*.65);g.bezierCurveTo(W*.2,H*.42,W*.3,H*.55,W*.49,H*.47);g.bezierCurveTo(W*.7,H*.39,W*.85,H*.57,W,H*.46);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();
 g.fillStyle='#a6cda5';g.beginPath();g.moveTo(0,H*.73);g.bezierCurveTo(W*.2,H*.59,W*.37,H*.67,W*.5,H*.58);g.bezierCurveTo(W*.68,H*.53,W*.82,H*.68,W,H*.60);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();
 // Arkada kesintisiz, alçak akademik kanatlar: kuşaklı cepheler, cam kubbe ve selviler.
 const city=dn12Sprite('campus'),cw=W*1.85,ch=H*.5,off=((cam.x*.055)%cw+cw)%cw;
 for(let x=-off-cw;x<W+cw;x+=cw)g.drawImage(city,x,H*.21,cw,ch);
}
function dn12World(tm){
 if(!dn12Ready())return;g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);const y=dn12Ground(),L=cam.x-1000,R=cam.x+VW+1000;
 const vectorDrawn=!!DN12_READY.vectorWorldDrawn;DN12_READY.vectorWorldDrawn=false;
 if(!vectorDrawn&&!dn12HasScene()){dn12VectorWorld(tm);return;}
 const photoAlpha=vectorDrawn?1-DN12_READY.lastVector:1;
 if(photoAlpha<=0)return;
 g.save();g.globalAlpha=photoAlpha;
  // Fotoğrafın altında gerçek oyun zemini; Feza, Anne ve etkinlikler oyun katmanında kalır.
  // Kapalı şekilli tek döşeme ve seyrek çiçekler karakterlerin önüne geçmez.
  const c0=(cam.x+VW*.5)/T;
  // Gözlem kulesi BM'nin önünde, etkileşim alanından solda; aynı sprite önbelleğinden çizilir.
  // Kamera BM'den uzaklaşırken kule usulca kaybolur, hiçbir çarpışma oluşturmaz.
  const kuleAlpha=dn12Smooth(585,594,c0)*(1-dn12Smooth(630,640,c0));
  if(kuleAlpha>0&&!dn12TowerMiniDraws()){g.save();g.globalAlpha=kuleAlpha*photoAlpha;dn12DrawAsset('tower',dn12TowerX(),y-25,141,360);g.restore();}
  const suGecis=dn12Smooth(645,655,c0)*(1-dn12Smooth(895,905,c0));
  if(suGecis>0){
   // Sadece gölet kıyısında suyun üstüne çok ince hareketli ışıltı bırak.
   g.save();g.globalAlpha=photoAlpha*suGecis;
   g.strokeStyle='rgba(240,255,246,.35)';g.lineWidth=2;g.beginPath();
   for(let x=Math.floor((cam.x-100)/167)*167;x<cam.x+VW+100;x+=167){const i=x/167,xx=x+Math.sin(tm*.7+i)*10,sy=y-82+(Math.abs(i)%4)*14;g.moveTo(xx,sy);g.quadraticCurveTo(xx+14,sy+2,xx+29,sy);}g.stroke();
   g.restore();
  }
  if(c0>650&&c0<900)dn12BoatLakeLife(tm);
  const fenerGecis=dn12Smooth(895,905,c0)*(1-dn12Smooth(975,985,c0));
  if(fenerGecis>0){
   // Gösteri mekânında renkli küçük kâğıt fenerler, nesnelerin üzerinde değil arkada.
   g.save();g.globalAlpha=photoAlpha*fenerGecis;
   const firstLight=Math.floor((cam.x-900)/900)*900;
   for(let ox=firstLight;ox<cam.x+VW+900;ox+=900){g.strokeStyle='rgba(145,115,91,.52)';g.lineWidth=2;g.beginPath();g.moveTo(ox,y-230);g.quadraticCurveTo(ox+450,y-170,ox+900,y-230);g.stroke();
    for(let i=0;i<8;i++){const u=i/7,x=ox+u*900,yy=y-230+u*(1-u)*120;dn12Ellipse(g,x,yy+11,6,8,['#ffb6c1','#ffdb8e','#b7e2cb','#badbef'][i%4]);}}
   g.restore();
  }
  const grass=dn12Sprite('grass'),step=640,first=Math.floor((cam.x-20)/step)*step,last=cam.x+VW+20;
  g.fillStyle='#609654';g.fillRect(cam.x-30,y,VW+60,500);
  for(let x=first;x<last;x+=step)g.drawImage(grass,x,y,step,100);
  dn12GroundSeam(y,photoAlpha);
  dn12LakePath(y,c0,photoAlpha);
  for(let x=Math.floor((cam.x-50)/95)*95;x<cam.x+VW+50;x+=95){const k=x/95,a=dn12Hash(k);g.strokeStyle='#60945f';g.lineWidth=1.5;g.beginPath();g.moveTo(x,y+2);g.lineTo(x,y-6-a*5);g.stroke();dn12Ellipse(g,x,y-7-a*5,2.7,2.7,k%3===0?'#fff5d9':k%3===1?'#f59bb7':'#f6cf72');}
  g.restore();
}
function dn12VectorWorld(tm){
 if(!dn12Ready())return;g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);const y=dn12Ground(),L=cam.x-1000,R=cam.x+VW+1000;
 // Yerleşim referans fotoğraflarındaki açık yeşil çimler ve uzun akademik bloklar.
 g.drawImage(dn12Sprite('lawn'),cam.x-100,y-265,VW+200,285);
 // Kampüs çimenleri arasındaki kıvrımlı açık renkli yollar üç derinlik katmanı oluşturur.
 const from=Math.floor((cam.x-2300)/3600)*3600;
 for(let x=from;x<cam.x+VW+2000;x+=3600){g.fillStyle='rgba(239,229,203,.65)';g.beginPath();g.moveTo(x-500,y-180);g.bezierCurveTo(x+130,y-177,x+200,y-118,x+600,y-95);g.lineTo(x+790,y-94);g.bezierCurveTo(x+270,y-125,x+190,y-202,x-500,y-190);g.closePath();g.fill();
  g.fillStyle='rgba(246,238,218,.48)';g.beginPath();g.moveTo(x+620,y-98);g.bezierCurveTo(x+850,y-78,x+1000,y-42,x+1120,y-22);g.lineTo(x+1220,y-22);g.bezierCurveTo(x+1100,y-58,x+905,y-90,x+760,y-101);g.closePath();g.fill();}
 // İlk buluşmada bina kanatları kampüsü güçlü biçimde tanıtır; kule onların önünde kalır.
 dn12DrawAsset('faculty',20*T,y-180,1280,510);
 dn12DrawAsset('faculty',160*T,y-134,870,444);
 const fac=[90,185,270,330,395,455,520,590,890,954];for(const n of fac){let x=n*T;if(x<L||x>R)continue;dn12DrawAsset('faculty',x,y-134,870,444);}
 for(const n of [490,590])dn12DrawAsset('library',n*T,y-110,900,430);
 for(const n of [920,970])dn12DrawAsset('stage',n*T,y-132,1050,510);
 if(!dn12TowerMiniDraws())dn12DrawAsset('tower',dn12TowerX(),y-25,141,360);
 // Gölet görünen kıyıda: bina/çimen yansımaları ve yavaş, ince su izleri.
 const gx0=650*T,gx1=900*T;if(gx1>L&&gx0<R){
  // Geniş gölet: öte kıyısı yumuşakça kıvrılır; çizilmiş manzaranın keskin şerit gibi görünmesini önler.
  g.save();g.beginPath();g.moveTo(gx0,y-224);
  for(let x=gx0;x<=gx1;x+=160)g.lineTo(x,y-224+Math.sin((x-gx0)*.0017)*13+Math.sin((x-gx0)*.004)*5);
  g.lineTo(gx1,y-8);g.lineTo(gx0,y-8);g.closePath();g.clip();
  g.drawImage(dn12Sprite('lake'),gx0,y-245,gx1-gx0,237);g.fillStyle='rgba(210,239,225,.25)';g.fillRect(gx0,y-218,gx1-gx0,15);
  // Gölet kıyısında açık renkli binaların kırık yansımaları; yatay çizgiler yavaşça kayar.
  for(let i=0;i<8;i++){const xx=681*T+i*760;if(xx<cam.x-300||xx>cam.x+VW+300)continue;
   g.fillStyle='rgba(235,242,218,.15)';g.fillRect(xx,y-215,160,145);g.fillStyle='rgba(96,151,161,.16)';g.fillRect(xx+32,y-215,13,135);g.fillRect(xx+105,y-215,10,135);}
  g.strokeStyle='rgba(240,253,241,.64)';g.lineWidth=3;g.beginPath();const start=Math.max(gx0,Math.floor((cam.x-100)/105)*105),end=Math.min(gx1,cam.x+VW+100);
  for(let x=start;x<end;x+=105){const yy=y-205+(dn12Hash(x)*170),o=Math.sin(tm*.8+x*.014)*4;g.moveTo(x+o,yy);g.lineTo(x+34+o,yy);}g.stroke();
  // Kıyıda küçük, sakin beyaz su kuşları. Gerçek hayvan kopyası değil, stilize siluet.
  for(const c of [678,714,762,809,864]){const x=c*T+Math.sin(tm*.34+c)*16;if(x<cam.x-60||x>cam.x+VW+60)continue;const sy=y-76+Math.sin(tm*.8+c)*2;
   dn12Ellipse(g,x,sy,19,7,'#fffaf1');dn12Ellipse(g,x+13,sy-8,5,5,'#fffaf1');g.strokeStyle='#fffaf1';g.lineWidth=5;g.beginPath();g.moveTo(x+11,sy);g.quadraticCurveTo(x+18,sy-4,x+13,sy-8);g.stroke();g.fillStyle='#e7b06d';g.fillRect(x+16,sy-8,5,2);}
  for(const c of [662,698,736,781,820,872]){const x=c*T;if(x<cam.x-30||x>cam.x+VW+30)continue;const sy=y-55-dn12Hash(c)*100;dn12Ellipse(g,x,sy,15,4,'#78ad95');dn12Ellipse(g,x,sy-3,5,3,'#ffe3e5');}
  g.restore();g.fillStyle='#d5d3b4';g.fillRect(gx0,y-19,gx1-gx0,14);g.fillStyle='#77a96f';g.fillRect(gx0,y-5,gx1-gx0,12);
  // Sazlıklar ekran çevresinde üretilir; ön oyun hedeflerinin üstüne binmez.
  for(let x=Math.max(gx0,Math.floor((cam.x-80)/180)*180);x<Math.min(gx1,cam.x+VW+80);x+=180){
   const h=18+dn12Hash(x)*14;g.strokeStyle='rgba(77,143,108,.7)';g.lineWidth=2;g.beginPath();g.moveTo(x,y-15);g.quadraticCurveTo(x-5,y-24,x-8,y-15-h);g.moveTo(x+4,y-15);g.quadraticCurveTo(x+8,y-24,x+12,y-19-h*.8);g.stroke();}
 }
 // Çiçekli sakuralar ve koyu yeşil kampüs ağaçları; hedeflerin üstüne örtü bindirmez.
 const trees=[2,31,53,130,220,260,315,390,435,480,520,565,615,640,815,845,890,950];
 for(const n of trees){const x=n*T;if(x<cam.x-500||x>cam.x+VW+500)continue;const s=.72+dn12Hash(n)*.27;
  // Çok hafif rüzgâr: gövde kökü sabit, taç birkaç piksel salınır.
  g.save();g.translate(x,y-35);g.rotate(Math.sin(tm*.45+n)*.006);g.drawImage(dn12Sprite(n%4===0?'tree':'sakura'),-220*s,-500*s,440*s,500*s);g.restore();}
 const hedge=dn12Sprite('hedge'),hedgeStart=Math.floor((cam.x-400)/920)*920;
 for(let x=hedgeStart;x<cam.x+VW+400;x+=920)g.drawImage(hedge,x,y-65,650,90);
 for(const n of [35,125,220,275,390,475,530,615,665,815,875,945])dn12DrawAsset('bench',n*T,y-8,165,82);
 // İnce park yolu: karakter siluetinin arkasında, zeminle aynı hizada.
 g.fillStyle='#e6d7bd';g.fillRect(cam.x-200,y-9,VW+400,16);g.fillStyle='#f5e5ca';g.fillRect(cam.x-200,y-9,VW+400,3);
 const grass=dn12Sprite('grass'),step=640,first=Math.floor((cam.x-20)/step)*step,last=cam.x+VW+20;
 for(let x=first;x<last;x+=step)g.drawImage(grass,x,y,step,100);
 dn12LakePath(y,(cam.x+VW*.5)/T);
 // Çimler arasında belirgin, küçük çiçekler; hedef alanları kaplamaz.
 for(let x=Math.floor((cam.x-50)/78)*78;x<cam.x+VW+50;x+=78){const k=x/78,a=dn12Hash(k),fy=y+4;g.strokeStyle='#60945f';g.lineWidth=1.5;g.beginPath();g.moveTo(x,fy+2);g.lineTo(x,fy-6-a*5);g.stroke();dn12Ellipse(g,x,fy-7-a*5,3,3,k%3===0?'#fff5d9':k%3===1?'#f59bb7':'#f6cf72');}
 g.globalAlpha=1;
}
const DN12_PETAL=Array.from({length:34},(_,i)=>({x:dn12Hash(i*7)*2300,y:dn12Hash(i*11)*1000,z:i%3===0?.9:.45,phase:dn12Hash(i*13)*6.28,r:2+dn12Hash(i*5)*3}));
function dn12Motes(tm,z0,z1){
 if(!dn12Ready())return;g.setTransform(S,0,0,S,0,0);const w=W/S,h=H/S,col=(cam.x+VW*.5)/T;
 // Sakura yaprakları FASS çiminde; gölette yumuşak su pırıltıları,
 // lojman ve merkezde sıcak, seyrek ışık tozları. Hedefleri kapatmaz.
 const sakura=dn12Smooth(228,250,col)*(1-dn12Smooth(440,462,col));
 const water=dn12Smooth(635,660,col)*(1-dn12Smooth(892,915,col));
 const color=`rgb(${Math.round(255-water*31)},${Math.round(242-sakura*15+water*9)},${Math.round(201+sakura*27+water*44)})`;
 for(const p of DN12_PETAL){if(p.z<z0||p.z>=z1)continue;
  const x=((p.x-cam.x*p.z+Math.sin(tm*.5+p.phase)*24)%(w+120)+(w+120))%(w+120)-60;
  const y=((p.y-cam.y*p.z+tm*7)%(h+100)+(h+100))%(h+100)-50;
  const a=(.26+.12*Math.sin(tm+p.phase))*(.75+sakura*.45);g.globalAlpha=a;
  dn12Ellipse(g,x,y,p.r*(.8+.45*sakura),p.r*(.8-.18*sakura),color);
 }
 g.globalAlpha=1;
}
function dn12Petals(tm){} // Ön hedefler kapanmasın; bütün yapraklar iki derinlikte Motes ile çizilir.
function dn12Foreground(tm){} // Oyun nesnelerini örten büyük ön plan örtüsü kullanılmaz.
function dn12Vignette(){if(!dn12Ready())return;g.setTransform(1,0,0,1,0,0);g.fillStyle='rgba(255,242,219,.035)';g.fillRect(0,0,W,H);}
