/* Zamanın Uyuduğu Vadi: tactile activities. No text, wrong answers or deadlines.
   World objects stay independent; only this chapter loads this classic script.
   Touch targets are rendered world shapes, not a full-screen invisible button.
   All timers advance with game dt, never wall time; interruptions preserve work. */
'use strict';
const Z10_DASH=[3,8],Z10_NO_DASH=[];
const Z10_COL=['#b4f5f3','#ffe8a4','#d9b9ff','#ffc8e5'];
const Z10_DROPS=[[-172,-147],[-146,-224],[-99,-287],[-37,-325],[36,-317],[104,-280],[153,-219],[178,-144],[32,-176]];
const Z10_TYPES=['zamanDamla','zamanTilki','zamanBahce','zamanKure','zamanAgaci'];
const Z10_KEY={zamanDamla:'damla',zamanTilki:'tilki',zamanBahce:'bahce',zamanKure:'kure'};
const Z10_TOTAL={zamanDamla:9,zamanTilki:1,zamanBahce:3,zamanKure:3,zamanAgaci:1};
const Z10_VOICE={zamanDamla:'selale',zamanTilki:'tilki',zamanBahce:'bahce',zamanKure:'kure',zamanAgaci:'agac'};
const Z10={o:null,fox:[],objects:[],ptr:-1,px:0,py:0,held:null,assets:null,fin:null};
const ZAMAN10={
 get aktif(){return Z10.o&&Z10.o.z.aktif?Z10.o:null;},
 hedef(){if(ZAMAN10.aktif)return null;let main=null,fox=null,dist=Infinity;for(const o of Z10.objects){if(o.done)continue;if(o.tip!=='zamanTilki'){if(o.tip==='zamanAgaci'&&V10.sandal!==true)continue;if(!main)main=o;}else{const d=Math.abs(P.x-o.x);if(d<300&&d<dist){dist=d;fox=o;}}}return fox||main;},
 kameraKutu(){return Z10.o?Z10.o.z.box:null;},
 hedefPiril(){return Z10.o?Z10.o.z.pr:null;},
 finalAn(){return Z10.fin?Z10.fin.z.t:0;},
 isit(){z10Assets();return true;}
};
window.ZAMAN10=ZAMAN10;
function z10Ses(k){if(typeof SES!=='undefined'&&SES.soyle)SES.soyle(k);}
function z10Sfx(k,v){if(typeof AU!=='undefined'&&AU.sfx)AU.sfx(k,v);}
function z10Isik(o,col,r){if(typeof dn10IsikEkle==='function')dn10IsikEkle(o.x,o.y-100,col||Z10_COL[0],r||900);}
function z10Glow(c,col,x,y,rx,ry,a){if(a<.003)return;const old=c.globalAlpha;c.globalAlpha=old*a;c.drawImage(glow(col),x-rx,y-ry,rx*2,ry*2);c.globalAlpha=old;}
function z10Ellipse(c,x,y,rx,ry,col,rot){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),rot||0,0,Math.PI*2);c.fill();}
function z10Path(c,fn,col,line,w){c.beginPath();fn(c);if(col){c.fillStyle=col;c.fill();}if(line){c.strokeStyle=line;c.lineWidth=w||2;c.stroke();}}
function z10Sprite(w,h,paint){const c=document.createElement('canvas');c.width=w*2;c.height=h*2;const q=c.getContext('2d');q.scale(2,2);paint(q);return c;}
function z10Star(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*.18,y-r*.18,x+r,y);c.quadraticCurveTo(x+r*.18,y+r*.18,x,y+r);c.quadraticCurveTo(x-r*.18,y+r*.18,x-r,y);c.quadraticCurveTo(x-r*.18,y-r*.18,x,y-r);c.fill();}
function z10Petal(c,x,y,s,a,col){c.save();c.translate(x,y);c.rotate(a);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-s*.75,-s*.55,-s*.55,-s*1.5,0,-s*1.75);c.bezierCurveTo(s*.55,-s*1.5,s*.75,-s*.55,0,0);c.fillStyle=col;c.fill();c.strokeStyle='#ecddff';c.lineWidth=1.2;c.stroke();c.restore();}
// These diorama backdrops are painted only once, in a 180-unit square.
function z10MemoryScene(c,kind){
 const sky=c.createLinearGradient(0,0,0,180);sky.addColorStop(0,kind===0?'#b8e1f2':kind===1?'#a3b6d3':'#b4daf1');sky.addColorStop(1,kind===0?'#ffe1df':kind===1?'#dce9e6':'#fff0c8');c.fillStyle=sky;c.fillRect(0,0,180,180);c.lineCap='round';c.lineJoin='round';
 if(kind===0){
  // A low rose garden with an arch and winding path: no shared tree silhouette.
  z10Ellipse(c,36,38,26,9,'#f5f5ee');z10Ellipse(c,52,33,16,11,'#f5f5ee');z10Ellipse(c,148,53,28,9,'#f9e9ec');
  z10Path(c,q=>{q.moveTo(-5,129);q.bezierCurveTo(31,62,65,84,95,108);q.bezierCurveTo(138,65,164,88,189,126);q.lineTo(189,180);q.lineTo(-5,180);},'#8fc3af');
  z10Path(c,q=>{q.moveTo(-5,141);q.bezierCurveTo(58,104,123,124,186,114);q.lineTo(185,180);q.lineTo(-5,180);},'#acd6b0');
  z10Path(c,q=>{q.moveTo(82,103);q.bezierCurveTo(122,111,116,126,84,136);q.bezierCurveTo(62,146,94,161,118,180);q.lineTo(76,180);q.bezierCurveTo(51,155,53,140,76,131);q.bezierCurveTo(108,118,108,112,82,103);},'#eedbc3');
  c.strokeStyle='#e3c3c7';c.lineWidth=6;c.beginPath();c.moveTo(65,119);c.lineTo(65,85);c.bezierCurveTo(65,56,107,53,111,82);c.lineTo(111,119);c.stroke();
  c.strokeStyle='#fbebdf';c.lineWidth=2;c.beginPath();c.moveTo(69,116);c.lineTo(69,84);c.bezierCurveTo(70,62,104,60,107,83);c.lineTo(107,116);c.stroke();
  for(let i=0;i<9;i++){const a=Math.PI+i/8*Math.PI,x=88+Math.cos(a)*25,y=86+Math.sin(a)*25;z10Ellipse(c,x,y,6,4,i%2?'#9ec7b1':'#c6dfc2',a+.5);if(i%2===0){z10Ellipse(c,x+1,y-3,4,4,'#eab8d8');z10Ellipse(c,x+1,y-3,1.5,1.5,'#fff0b9');}}
  for(let i=0;i<12;i++){const x=i<6?16+i*8:123+(i-6)*9,y=135+(i%3)*12;c.strokeStyle='#779e8c';c.lineWidth=1.8;c.beginPath();c.moveTo(x,y+16);c.lineTo(x+2,y-3);c.stroke();z10Ellipse(c,x-2,y+7,5,2.4,'#c5e9bc',-.5);z10Ellipse(c,x+4,y+4,5,2.4,'#8bbaa0',.5);z10Ellipse(c,x+2,y-4,4.5,5,i%3?'#e8b5d9':'#e5d99f');}
  z10Ellipse(c,40,159,13,4,'#85b3a5');z10Ellipse(c,140,159,15,5,'#8aafa6');
 }else if(kind===1){
  // Tall conifers enclose a deep, oval rain pond and a tiny falling stream.
  z10Path(c,q=>{q.moveTo(0,118);q.quadraticCurveTo(36,76,91,106);q.quadraticCurveTo(136,80,180,118);q.lineTo(180,180);q.lineTo(0,180);},'#89b0ad');
  for(let i=0;i<6;i++){const x=i<3?9+i*18:128+(i-3)*20,y=118+(i%2)*9,h=48+(i%3)*12;
   c.strokeStyle='#72788b';c.lineWidth=3.2;c.beginPath();c.moveTo(x,y+3);c.bezierCurveTo(x+1,y-h*.3,x-2,y-h*.6,x,y-h);c.stroke();
   for(let tier=3;tier>=0;tier--){const by=y-h+12+tier*h*.2,spread=7+tier*4.7;
    const needles=c.createLinearGradient(x-spread,by-11,x+spread*.7,by+12);needles.addColorStop(0,tier%2?'#a3c7bc':'#94bcb7');needles.addColorStop(.43,'#729fa4');needles.addColorStop(1,'#4f718a');
    z10Path(c,q=>{q.moveTo(x-1,by-17);q.bezierCurveTo(x-4,by-9,x-spread*.6,by-6,x-spread,by+3);q.quadraticCurveTo(x-spread*.7,by+2,x-spread*.63,by+5);q.lineTo(x-spread*.85,by+8);q.quadraticCurveTo(x-spread*.3,by+7,x-spread*.25,by+11);q.quadraticCurveTo(x,by+8,x+spread*.2,by+10);q.quadraticCurveTo(x+spread*.6,by+6,x+spread,by+7);q.quadraticCurveTo(x+spread*.83,by+1,x+spread*.48,by-3);q.quadraticCurveTo(x+3,by-7,x-1,by-17);},needles);
    c.strokeStyle='rgba(201,228,204,.4)';c.lineWidth=.6;c.beginPath();c.moveTo(x-1,by-9);c.quadraticCurveTo(x-4,by-1,x-spread*.65,by+3);c.moveTo(x,by-5);c.quadraticCurveTo(x+4,by,x+spread*.5,by+3);c.stroke();
   }
  }
  z10Ellipse(c,93,147,66,31,'#799da4');z10Ellipse(c,92,143,61,26,'#c1d0c2');
  const water=c.createLinearGradient(0,118,0,166);water.addColorStop(0,'#638ba9');water.addColorStop(.55,'#87c8d1');water.addColorStop(1,'#b7dfd9');z10Ellipse(c,92,141,55,22,water);
  c.strokeStyle='#e1f4ea';c.lineWidth=1.2;c.beginPath();c.ellipse(92,141,48,18,0,.25,2.8);c.stroke();
  z10Path(c,q=>{q.moveTo(101,96);q.quadraticCurveTo(89,111,99,127);q.lineTo(106,130);q.quadraticCurveTo(98,111,111,98);},'#c1e7e8');
  for(let i=0;i<7;i++){const a=i/6*Math.PI,x=92+Math.cos(a)*62,y=146+Math.sin(a)*22;z10Ellipse(c,x,y,7+i%2*2,4,'#98aea9',-.3);z10Ellipse(c,x-1,y-1,5,2,'#c9d8cb');}
  z10Ellipse(c,71,142,10,4,'#a4cead',-.2);z10Ellipse(c,115,135,8,3,'#b0d6b9',.1);z10Ellipse(c,73,138,3.3,3.3,'#efd3e8');
  for(let i=0;i<5;i++){const x=22+i*4,y=151+i%2*5;c.strokeStyle='#729d90';c.lineWidth=1.6;c.beginPath();c.moveTo(x,y+13);c.quadraticCurveTo(x-4,y,x,y-8);c.stroke();}

 }else{
  // An open sunny meadow: broad sky, gold rimmed hills and no canopy.
  const sun=c.createRadialGradient(127,42,3,127,42,35);sun.addColorStop(0,'#fff9cc');sun.addColorStop(.6,'#ffe7a1');sun.addColorStop(1,'#ffe5ad00');c.fillStyle=sun;c.fillRect(90,5,74,74);z10Ellipse(c,127,42,17,17,'#ffedb0');
  z10Ellipse(c,30,47,27,8,'#f6f1e8');z10Ellipse(c,48,40,17,12,'#f6f1e8');
  z10Path(c,q=>{q.moveTo(0,124);q.quadraticCurveTo(27,63,76,109);q.quadraticCurveTo(126,73,180,117);q.lineTo(180,180);q.lineTo(0,180);},'#acb5cc');
  z10Path(c,q=>{q.moveTo(0,141);q.bezierCurveTo(44,107,67,101,103,130);q.quadraticCurveTo(148,98,185,133);q.lineTo(185,180);q.lineTo(0,180);},'#bdd5a4');
  z10Path(c,q=>{q.moveTo(0,154);q.quadraticCurveTo(91,120,181,149);q.lineTo(181,180);q.lineTo(0,180);},'#d4deb0');
  z10Path(c,q=>{q.moveTo(156,125);q.bezierCurveTo(122,136,137,146,105,152);q.quadraticCurveTo(87,164,99,180);q.lineTo(83,180);q.quadraticCurveTo(76,159,99,148);q.bezierCurveTo(126,142,123,135,156,125);},'#e9e7bb');
  for(let i=0;i<13;i++){const x=10+i*13,y=143+(i%3)*10;c.strokeStyle='#a5b88d';c.lineWidth=1.1;c.beginPath();c.moveTo(x,y+12);c.quadraticCurveTo(x+3,y+2,x+1,y-2);c.stroke();z10Ellipse(c,x+1,y-3,2.2,4,i%2?'#edcd9f':'#d7bed9',.3);}
  z10Ellipse(c,34,157,14,6,'#b1b5b3');z10Ellipse(c,31,153,10,5,'#dedacc');z10Ellipse(c,142,171,18,5,'#b3c398');
 }
}
function z10Assets(){
 if(Z10.assets)return Z10.assets;
 const A=Z10.assets={};
 A.drop=z10Sprite(82,104,c=>{
  const gr=c.createLinearGradient(12,10,66,98);gr.addColorStop(0,'#ffffff');gr.addColorStop(.3,'#c5fcff');gr.addColorStop(.7,'#62d9ee');gr.addColorStop(1,'#6999dd');
  z10Path(c,q=>{q.moveTo(41,8);q.bezierCurveTo(31,29,12,49,12,66);q.bezierCurveTo(12,104,70,104,70,66);q.bezierCurveTo(70,49,51,29,41,8);},gr,'#d4ffff',2.4);
  z10Ellipse(c,29,58,6,14,'#ffffff',.42);z10Ellipse(c,54,81,4,3,'#ddffff');
  c.strokeStyle='#f0ffff';c.globalAlpha=.4;c.lineWidth=1;c.beginPath();c.moveTo(41,20);c.lineTo(45,65);c.lineTo(65,73);c.moveTo(45,65);c.lineTo(26,89);c.stroke();c.globalAlpha=1;
 });
 A.leaf=z10Sprite(180,94,c=>{
  const gr=c.createLinearGradient(0,0,160,80);gr.addColorStop(0,'#d8ffe1');gr.addColorStop(.45,'#76d9c1');gr.addColorStop(1,'#368b98');
  z10Path(c,q=>{q.moveTo(8,72);q.bezierCurveTo(24,-3,111,-6,171,29);q.bezierCurveTo(133,88,63,99,8,72);},gr,'#bbf9d4',2);
  c.strokeStyle='#d5ffe9';c.lineWidth=2;c.beginPath();c.moveTo(12,70);c.quadraticCurveTo(80,31,163,31);for(let i=0;i<5;i++){const x=36+i*22;c.moveTo(x,57-i*4);c.lineTo(x-3,22-i);c.moveTo(x,57-i*4);c.lineTo(x+18,78-i*5);}c.stroke();
 });
 A.petal=z10Sprite(100,160,c=>{
  const gr=c.createLinearGradient(0,0,90,140);gr.addColorStop(0,'#fff5e0');gr.addColorStop(.4,'#f4d9ff');gr.addColorStop(1,'#9e81dc');
  z10Path(c,q=>{q.moveTo(50,151);q.bezierCurveTo(2,105,0,39,50,8);q.bezierCurveTo(100,39,98,105,50,151);},gr,'#f5e5ff',2);
  c.strokeStyle='#fff1ed';c.lineWidth=2;c.beginPath();c.moveTo(50,145);c.quadraticCurveTo(39,87,50,28);c.stroke();c.strokeStyle='rgba(255,244,223,.35)';c.lineWidth=.8;for(let j=0;j<5;j++){const y=118-j*17;c.beginPath();c.moveTo(47,y);c.quadraticCurveTo(26,y-8,21+j*2,y-21);c.moveTo(48,y-5);c.quadraticCurveTo(70,y-15,79-j*2,y-26);c.stroke();}
 });
 A.ring=z10Sprite(220,68,c=>{c.strokeStyle='#aae9e9';c.lineWidth=3;for(let j=0;j<3;j++){c.globalAlpha=.7-j*.18;c.beginPath();c.ellipse(110,34,99-j*15,26-j*4,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;});
  A.curl=z10Sprite(150,150,c=>{
   // A full, soft leaf blade folds over itself. Only a shaded crease curls;
   // there is no empty spiral cut-out or bright metallic rim.
   const gr=c.createLinearGradient(20,18,120,128);gr.addColorStop(0,'#d2c7d5');gr.addColorStop(.4,'#b8abc8');gr.addColorStop(.73,'#a39cb9');gr.addColorStop(1,'#8fa6aa');
   z10Path(c,q=>{q.moveTo(34,18);q.bezierCurveTo(17,45,13,77,20,105);q.quadraticCurveTo(24,124,34,134);q.quadraticCurveTo(38,111,54,111);q.bezierCurveTo(80,130,118,120,131,94);q.bezierCurveTo(149,60,125,25,97,18);q.bezierCurveTo(73,11,48,24,34,18);},gr,'#c3bfd0',1.2);
   const fold=c.createLinearGradient(44,32,119,111);fold.addColorStop(0,'#d8ceda');fold.addColorStop(.5,'#c2b4cf');fold.addColorStop(1,'#a1a3b9');
   z10Path(c,q=>{q.moveTo(34,18);q.quadraticCurveTo(42,37,60,33);q.bezierCurveTo(86,24,115,42,124,65);q.bezierCurveTo(134,94,106,119,80,111);q.bezierCurveTo(52,102,47,77,62,60);q.bezierCurveTo(75,44,102,48,109,67);q.bezierCurveTo(115,84,99,99,86,90);q.bezierCurveTo(99,90,105,76,97,68);q.bezierCurveTo(86,57,70,65,68,78);q.bezierCurveTo(67,96,90,106,106,96);q.bezierCurveTo(123,85,119,64,107,52);q.bezierCurveTo(86,32,62,42,47,58);q.bezierCurveTo(30,79,28,105,34,134);q.bezierCurveTo(20,116,15,76,24,49);q.closePath();},fold);
   c.strokeStyle='rgba(106,108,142,.4)';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(34,126);c.bezierCurveTo(25,97,31,65,52,45);c.bezierCurveTo(78,23,112,42,122,66);c.bezierCurveTo(134,100,97,121,73,106);c.bezierCurveTo(47,90,58,59,78,56);c.bezierCurveTo(99,53,113,74,99,87);c.stroke();
   c.strokeStyle='rgba(239,228,230,.32)';c.lineWidth=1.4;c.beginPath();c.moveTo(35,119);c.bezierCurveTo(28,91,36,65,55,48);c.bezierCurveTo(78,30,108,44,117,64);c.stroke();
   c.strokeStyle='rgba(116,120,146,.35)';c.lineWidth=.85;c.beginPath();c.moveTo(30,108);c.quadraticCurveTo(23,100,21,88);c.moveTo(30,91);c.quadraticCurveTo(22,82,21,73);c.moveTo(33,72);c.quadraticCurveTo(26,60,27,49);c.moveTo(42,56);c.quadraticCurveTo(36,41,36,29);c.moveTo(55,44);c.quadraticCurveTo(57,31,62,23);c.moveTo(73,39);c.quadraticCurveTo(82,27,91,22);c.moveTo(94,44);c.lineTo(109,32);c.moveTo(111,58);c.lineTo(126,49);c.moveTo(120,78);c.lineTo(133,78);c.moveTo(110,99);c.lineTo(119,109);c.moveTo(90,109);c.lineTo(90,120);c.moveTo(70,102);c.lineTo(64,114);c.stroke();
   z10Path(c,q=>{q.moveTo(29,127);q.quadraticCurveTo(25,113,28,102);q.quadraticCurveTo(40,112,36,128);q.lineTo(33,134);},'#a5b9b2');c.strokeStyle='#cbd9c9';c.lineWidth=1;c.beginPath();c.moveTo(33,131);c.quadraticCurveTo(30,117,29,109);c.stroke();
  });
  A.memory0=z10Sprite(180,180,c=>z10MemoryScene(c,0));
  A.memory1=z10Sprite(180,180,c=>z10MemoryScene(c,1));
  A.memory2=z10Sprite(180,180,c=>z10MemoryScene(c,2));
  A.memoryFlower=z10Sprite(40,40,c=>{
   c.translate(20,20);for(let i=0;i<7;i++){const a=i*Math.PI*2/7;z10Ellipse(c,Math.cos(a)*10,Math.sin(a)*10,7,4.5,i%2?'#ffe5ef':'#fff4d6',a);}
   z10Ellipse(c,0,0,6,6,'#e9bd67');z10Ellipse(c,-1,-2,2.6,2.6,'#fff4ab');
  });
 A.core=z10Sprite(140,140,c=>{const gr=c.createRadialGradient(53,46,3,70,70,66);gr.addColorStop(0,'#fffef5');gr.addColorStop(.32,'#fff2c7');gr.addColorStop(.67,'#f8d892');gr.addColorStop(1,'#d8afd0');z10Ellipse(c,70,70,61,61,gr);for(let i=0;i<24;i++){const a=i*2.39996,r=9+Math.sqrt(i)*9;z10Ellipse(c,70+Math.cos(a)*r,70+Math.sin(a)*r,2.2,2.2,'#fff5d7');}});
 A.source=z10Sprite(420,130,c=>{
  const rock=c.createLinearGradient(70,23,300,126);rock.addColorStop(0,'#c5c9bf');rock.addColorStop(.32,'#8faaa9');rock.addColorStop(.67,'#6f809b');rock.addColorStop(1,'#565d7e');
  z10Path(c,q=>{q.moveTo(25,46);q.bezierCurveTo(54,20,107,23,131,27);q.quadraticCurveTo(187,5,225,20);q.quadraticCurveTo(290,11,321,26);q.quadraticCurveTo(377,24,396,51);q.quadraticCurveTo(383,75,348,78);q.lineTo(325,102);q.quadraticCurveTo(302,105,282,96);q.quadraticCurveTo(250,128,219,111);q.lineTo(184,124);q.quadraticCurveTo(166,103,140,103);q.quadraticCurveTo(113,116,95,91);q.quadraticCurveTo(51,86,39,68);q.closePath();},rock,'#84949e',1.3);
  const water=c.createLinearGradient(0,18,0,65);water.addColorStop(0,'#4c8c9f');water.addColorStop(.48,'#83c5cd');water.addColorStop(1,'#caeae4');
  z10Path(c,q=>{q.moveTo(57,43);q.bezierCurveTo(79,24,137,32,170,24);q.bezierCurveTo(213,17,252,28,289,27);q.bezierCurveTo(329,25,362,36,368,46);q.bezierCurveTo(349,62,306,64,274,59);q.bezierCurveTo(224,71,180,60,147,65);q.bezierCurveTo(101,64,64,60,57,43);},water,'#c4ded7',3);
  c.strokeStyle='rgba(225,255,247,.65)';c.lineWidth=1.2;c.beginPath();c.moveTo(84,44);c.bezierCurveTo(142,32,171,48,224,36);c.bezierCurveTo(264,29,313,39,337,43);c.moveTo(124,53);c.bezierCurveTo(164,47,204,61,262,50);c.stroke();
  for(let j=0;j<12;j++){const x=47+j*29,y=65+Math.sin(j*2)*12;c.strokeStyle=j%2?'rgba(222,231,215,.25)':'rgba(56,66,88,.2)';c.lineWidth=1.2;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+10,y+4,x+8,y+20,x+19,y+25);c.stroke();}
  for(let j=0;j<18;j++){const x=37+j*20,y=39+Math.sin(j*1.7)*11,z=4+j%3*2;const moss=c.createLinearGradient(x,y-z,x,y+z);moss.addColorStop(0,'#bbd3bc');moss.addColorStop(1,'#729b91');z10Ellipse(c,x,y,z*1.7,z*.65,moss,Math.sin(j)*.4);}
  for(const x of [83,208,331]){c.strokeStyle='#8fd4d8';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(x,51);c.bezierCurveTo(x+2,61,x-6,66,x-3,78);c.stroke();c.strokeStyle='#e0fff6';c.lineWidth=2.5;c.stroke();}
  for(const x of [65,115,301,359]){c.strokeStyle='#7caa94';c.lineWidth=1.6;c.beginPath();c.moveTo(x,32);c.quadraticCurveTo(x-11,16,x-4,8);c.stroke();z10Petal(c,x-4,17,5.5,-.6,'#c7d9c0');z10Petal(c,x-5,24,5,.6,'#a5cab7');}
 });
 A.pool=z10Sprite(370,80,c=>{
  z10Path(c,q=>{q.moveTo(9,40);q.bezierCurveTo(34,12,100,18,145,13);q.bezierCurveTo(210,7,249,20,296,18);q.bezierCurveTo(341,20,367,35,360,47);q.bezierCurveTo(338,70,267,66,227,72);q.bezierCurveTo(163,76,103,65,62,65);q.bezierCurveTo(32,64,11,54,9,40);},'#7c8f9c');
  const water=c.createLinearGradient(0,17,0,69);water.addColorStop(0,'#58859c');water.addColorStop(.5,'#8dc6cc');water.addColorStop(1,'#b5d9d1');
  z10Path(c,q=>{q.moveTo(29,40);q.bezierCurveTo(72,20,123,26,171,21);q.bezierCurveTo(221,18,312,27,342,40);q.bezierCurveTo(332,56,276,60,232,60);q.bezierCurveTo(168,69,112,54,70,58);q.quadraticCurveTo(42,54,29,40);},water,'#c1d9d5',1.7);
  c.strokeStyle='rgba(221,250,241,.52)';c.lineWidth=1;c.beginPath();c.moveTo(61,39);c.bezierCurveTo(130,26,224,26,307,39);c.moveTo(94,47);c.bezierCurveTo(144,55,230,54,278,46);c.stroke();
  for(let j=0;j<19;j++){const a=j/18*Math.PI,x=185+Math.cos(a)*166,y=43+Math.sin(a)*22,rx=7+j%4*2,ry=3+j%3;const stone=c.createLinearGradient(x-rx,y-ry,x+rx,y+ry);stone.addColorStop(0,'#d4dfce');stone.addColorStop(.4,j%2?'#a9c3b4':'#a9b6c4');stone.addColorStop(1,'#788d9b');z10Ellipse(c,x,y,rx,ry,stone,Math.sin(j)*.25);c.strokeStyle='rgba(248,247,223,.3)';c.lineWidth=.7;c.beginPath();c.moveTo(x-rx*.4,y-ry*.4);c.lineTo(x+rx*.4,y-ry*.2);c.stroke();}
 });
 A.tree=z10Sprite(480,430,c=>{
  const gr=c.createLinearGradient(160,0,310,400);gr.addColorStop(0,'#c7adbf');gr.addColorStop(.26,'#b297b7');gr.addColorStop(.58,'#917ba1');gr.addColorStop(1,'#584769');
  c.lineCap='round';c.lineJoin='round';
  // Tapered branches fuse into an asymmetrical trunk. Soft bark shading replaces
  // identical round tubes, so the trunk reads as one growing living tree.
  z10Path(c,q=>{q.moveTo(229,340);q.bezierCurveTo(218,291,181,261,150,229);q.bezierCurveTo(113,196,72,184,55,145);q.bezierCurveTo(72,168,127,188,163,215);q.bezierCurveTo(204,245,243,268,248,325);q.closePath();},gr,'#777296',1.3);
  z10Path(c,q=>{q.moveTo(241,341);q.bezierCurveTo(258,285,301,250,335,212);q.bezierCurveTo(374,169,401,152,418,123);q.bezierCurveTo(414,155,372,184,350,220);q.bezierCurveTo(320,264,274,290,260,354);q.closePath();},gr,'#777296',1.3);
  z10Path(c,q=>{q.moveTo(229,281);q.bezierCurveTo(207,239,171,222,157,184);q.bezierCurveTo(143,151,146,121,165,95);q.bezierCurveTo(151,130,157,155,173,184);q.bezierCurveTo(192,216,223,229,242,264);q.closePath();},gr,'#777296',1.1);
  z10Path(c,q=>{q.moveTo(243,254);q.bezierCurveTo(284,223,295,168,311,124);q.bezierCurveTo(324,94,328,76,332,63);q.bezierCurveTo(337,91,323,121,318,142);q.bezierCurveTo(306,197,289,237,255,272);q.closePath();},gr,'#777296',1.1);
  z10Path(c,q=>{q.moveTo(161,407);q.bezierCurveTo(209,398,204,360,214,310);q.bezierCurveTo(229,258,208,218,222,167);q.bezierCurveTo(236,120,239,78,252,43);q.bezierCurveTo(253,91,249,125,253,166);q.bezierCurveTo(258,211,246,252,253,302);q.bezierCurveTo(265,351,250,389,318,407);q.bezierCurveTo(273,417,223,409,161,407);q.closePath();},gr,'#777296',1.6);
  c.strokeStyle='rgba(231,209,225,.38)';c.lineWidth=3;c.beginPath();c.moveTo(214,389);c.bezierCurveTo(241,325,216,278,231,219);c.bezierCurveTo(244,164,234,122,248,81);c.stroke();
  c.strokeStyle='rgba(65,62,102,.28)';c.lineWidth=2;c.beginPath();c.moveTo(248,393);c.bezierCurveTo(233,352,247,324,241,291);c.bezierCurveTo(226,251,242,230,242,201);c.stroke();
  for(let i=0;i<6;i++){c.strokeStyle=i%2?'#b7a2c4':'#82759d';c.lineWidth=1.2;c.beginPath();const x=217+(i%3)*10,y=367-i*23;c.moveTo(x,y);c.bezierCurveTo(x+9,y-9,x-7,y-20,x+1,y-34);c.stroke();}
  // Warm ridged bark catches light down one side of each irregular channel.
  for(let j=0;j<9;j++){const xx=213+j*4.3,yy=372-j%3*15;c.strokeStyle=j%3===0?'rgba(244,218,208,.4)':j%3===1?'rgba(75,52,93,.22)':'rgba(213,178,191,.33)';c.lineWidth=j%3===0?2.1:1.1;c.beginPath();c.moveTo(xx,yy);c.bezierCurveTo(xx+14,yy-35,xx-13,yy-72,xx+7,yy-102);c.bezierCurveTo(xx+17,yy-133,xx-2,yy-163,xx+9,yy-198);c.stroke();}
  c.strokeStyle='rgba(238,206,201,.42)';c.lineWidth=2.5;c.beginPath();c.moveTo(226,320);c.bezierCurveTo(204,265,157,230,129,214);c.bezierCurveTo(103,199,76,184,60,155);c.moveTo(257,326);c.bezierCurveTo(291,276,325,248,349,211);c.bezierCurveTo(372,178,399,154,414,133);c.stroke();
  // Curled twig tips and pointed overlapping leaves replace flattened oval bands.
  for(let i=0;i<10;i++){const side=i%2?1:-1,x=240+side*(55+Math.floor(i/2)*30),y=124+Math.sin(i*1.7)*55;c.strokeStyle='#aa96b2';c.lineWidth=3;c.beginPath();c.moveTo(x,y+25);c.bezierCurveTo(x+side*20,y+8,x-side*12,y-7,x+side*6,y-18);c.stroke();}
  for(let i=0;i<10;i++){const angle=-Math.PI+.25+i/9*(Math.PI-.5),x=240+Math.cos(angle)*174,y=164+Math.sin(angle)*107;
   for(let j=0;j<12;j++){const a=j*2.39996+i*.3,rr=9+Math.sqrt(j)*11,xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr*.58,rot=a*.35;
    c.save();c.translate(xx,yy);c.rotate(rot);
    const leaf=c.createLinearGradient(-14,-13,16,11);leaf.addColorStop(0,j%3===0?'#dfd7e1':j%3===1?'#bcded4':'#d4c2df');leaf.addColorStop(.45,j%3===0?'#bba8cc':j%3===1?'#91bcb6':'#b89bc7');leaf.addColorStop(1,j%3===0?'#827799':j%3===1?'#608f98':'#8e78aa');
    z10Path(c,q=>{q.moveTo(-21,2);q.bezierCurveTo(-11,-13,8,-15,23,-4);q.bezierCurveTo(15,10,-9,16,-21,2);q.closePath();},leaf,'rgba(226,230,225,.35)',.7);
    c.strokeStyle='rgba(246,235,223,.62)';c.lineWidth=.8;c.beginPath();c.moveTo(-17,2);c.quadraticCurveTo(1,-2,19,-4);c.moveTo(-7,1);c.lineTo(-8,-5);c.moveTo(3,-1);c.lineTo(7,5);c.moveTo(10,-2);c.lineTo(11,-8);c.stroke();c.restore();
   }
  }
  // Root curls and bark knots connect the living tree to its mossy island.
  for(let i=0;i<5;i++){c.strokeStyle=i%2?'#9386b4':'#b9a5c9';c.lineWidth=8-i;c.beginPath();c.moveTo(238,363);c.quadraticCurveTo(200+i*20,404,144+i*46,402);c.stroke();}
  for(let i=0;i<4;i++){c.save();c.translate(230+i*4,280+i*25);c.rotate(-.18);c.strokeStyle='#d8bdd8';c.lineWidth=1.1;c.beginPath();c.ellipse(0,0,6,10,0,0,Math.PI*2);c.stroke();c.restore();}
  z10Path(c,q=>{q.moveTo(122,406);q.quadraticCurveTo(142,385,166,390);q.quadraticCurveTo(198,377,233,388);q.quadraticCurveTo(277,378,309,392);q.quadraticCurveTo(336,384,359,405);q.quadraticCurveTo(324,421,286,414);q.quadraticCurveTo(238,424,200,414);q.quadraticCurveTo(151,420,122,406);},'#819f9b');
  for(let j=0;j<21;j++){const x=132+j*11,y=401+Math.sin(j*1.4)*6;z10Ellipse(c,x,y,8,3,j%3?'#adc4ae':'#d0d5b9',Math.sin(j)*.2);c.strokeStyle='#6b958a';c.lineWidth=1.3;c.beginPath();c.moveTo(x,y+3);c.quadraticCurveTo(x-4,y-5,x-3,y-11);c.stroke();}
 });
 z10UpgradeAssets(A);
 for(const col of Z10_COL)glow(col);
 return A;
}
// Larger layered native artwork is cached once; animation only transforms pieces.
function z10UpgradeAssets(A){
 A.cloud=z10Sprite(270,120,c=>{
  const gr=c.createLinearGradient(0,14,0,111);gr.addColorStop(0,'#fffef5');gr.addColorStop(.55,'#e0e8ff');gr.addColorStop(1,'#a8b4e0');
  c.strokeStyle='#ac9ed0';c.lineWidth=2;c.beginPath();c.moveTo(25,79);c.bezierCurveTo(0,63,14,34,42,38);c.bezierCurveTo(52,8,90,9,105,29);c.bezierCurveTo(125,-1,167,2,181,30);c.bezierCurveTo(214,8,242,30,239,49);c.bezierCurveTo(274,47,276,82,251,88);c.bezierCurveTo(225,109,69,118,25,79);c.closePath();c.fillStyle=gr;c.fill();c.stroke();
  c.strokeStyle='#ffffff';c.lineWidth=3;c.beginPath();c.moveTo(35,59);c.bezierCurveTo(29,46,45,44,52,48);c.moveTo(68,36);c.bezierCurveTo(76,21,94,27,98,33);c.moveTo(127,25);c.bezierCurveTo(145,12,160,22,165,30);c.moveTo(201,39);c.quadraticCurveTo(220,32,226,48);c.stroke();
  z10Ellipse(c,135,78,91,16,'#e9dcfa');z10Ellipse(c,135,74,83,11,'#fff8e9');c.strokeStyle='#bfa6da';c.lineWidth=1.3;c.beginPath();c.ellipse(135,74,84,12,0,0,Math.PI*2);c.stroke();
  for(let i=0;i<7;i++)z10Star(c,67+i*23,94+Math.sin(i)*3,3,i%2?'#fff4bd':'#c0d6fc');
 });
 A.autumnLeaf=z10Sprite(180,94,c=>{c.drawImage(A.leaf,0,0,180,94);c.globalCompositeOperation='source-atop';const gr=c.createLinearGradient(0,0,140,90);gr.addColorStop(0,'#ffe2a8');gr.addColorStop(.5,'#e6b070');gr.addColorStop(1,'#bd8193');c.fillStyle=gr;c.fillRect(0,0,180,94);c.globalCompositeOperation='source-over';c.strokeStyle='#ffe7bf';c.lineWidth=1.6;c.beginPath();c.moveTo(12,70);c.quadraticCurveTo(80,31,163,31);for(let i=0;i<5;i++){const x=36+i*22;c.moveTo(x,57-i*4);c.lineTo(x-3,22-i);c.moveTo(x,57-i*4);c.lineTo(x+18,78-i*5);}c.stroke();});
 A.clock=z10Sprite(330,330,c=>{
  c.translate(165,165);const gr=c.createLinearGradient(-150,-145,145,150);gr.addColorStop(0,'#fff2c8');gr.addColorStop(.45,'#d9bd8e');gr.addColorStop(1,'#8b7da2');
  z10Ellipse(c,0,5,154,154,'#625b75');
  const wood=c.createLinearGradient(-130,-140,130,145);wood.addColorStop(0,'#ead3b3');wood.addColorStop(.33,'#bba195');wood.addColorStop(.73,'#997b8d');wood.addColorStop(1,'#776780');
  c.beginPath();for(let j=0;j<=72;j++){const a=j*Math.PI/36,r=151+Math.sin(j*.83)*2+Math.sin(j*1.9);if(j)c.lineTo(Math.cos(a)*r,Math.sin(a)*r);else c.moveTo(Math.cos(a)*r,Math.sin(a)*r);}c.closePath();c.fillStyle=wood;c.fill();
  c.strokeStyle='rgba(255,238,210,.35)';c.lineWidth=1;for(let j=0;j<5;j++){c.beginPath();c.arc(0,0,143+j*2.3,.1+j*.08,3.5+j*.15);c.stroke();}
  const face=c.createRadialGradient(-36,-47,8,0,0,138);face.addColorStop(0,'#c5d7cf');face.addColorStop(.7,'#a0b5b8');face.addColorStop(1,'#728e9a');z10Ellipse(c,0,-2,132,132,face);
  c.strokeStyle='#dfcfb6';c.lineWidth=2;c.beginPath();c.arc(0,0,134,0,Math.PI*2);c.stroke();
  for(let j=0;j<18;j++){const a=2.1+j*.047,r=145+Math.sin(j)*5,x=Math.cos(a)*r,y=Math.sin(a)*r;z10Ellipse(c,x,y,6,3,j%2?'#a5bda3':'#c4d3b2',a);}
  c.strokeStyle='#f5e6c3';c.lineWidth=2;for(let i=0;i<36;i++){const a=i*Math.PI/18,r=i%3?137:132;c.beginPath();c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(Math.cos(a)*146,Math.sin(a)*146);c.stroke();}
  c.strokeStyle='#e0e4e6';c.lineWidth=1;c.beginPath();c.arc(0,0,117,0,Math.PI*2);c.stroke();
  for(let i=0;i<12;i++){const a=i*Math.PI/6;z10Star(c,Math.cos(a)*122,Math.sin(a)*122,i%3?2:4,'#fff2cb');}
  for(let j=0;j<3;j++){const a=-Math.PI/2+j*Math.PI*2/3,x=Math.cos(a)*145,y=Math.sin(a)*145;z10Ellipse(c,x,y,16,16,'#e9e0de');z10Ellipse(c,x,y,12,12,j===0?'#c5ebce':j===1?'#efc59e':'#d5e7f3');if(j===0){for(let i=0;i<5;i++){const aa=i*Math.PI*2/5;z10Ellipse(c,x+Math.cos(aa)*5,y+Math.sin(aa)*5,4,3,'#fff8e5',aa);}z10Ellipse(c,x,y,3,3,'#e4bd68');}else if(j===1){c.save();c.translate(x,y);c.rotate(-.6);c.drawImage(A.leaf,-8,-4,16,8);c.restore();}else{c.strokeStyle='#fff';c.lineWidth=1.4;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+Math.cos(i*Math.PI/3)*8,y+Math.sin(i*Math.PI/3)*8);c.lineTo(x-Math.cos(i*Math.PI/3)*8,y-Math.sin(i*Math.PI/3)*8);c.stroke();}}}
 });
 A.gardenBed=z10Sprite(540,160,c=>{
  const gr=c.createLinearGradient(0,40,0,154);gr.addColorStop(0,'#b9c2bc');gr.addColorStop(.4,'#8e89a5');gr.addColorStop(1,'#655d83');
  z10Path(c,q=>{q.moveTo(13,61);q.quadraticCurveTo(86,14,168,29);q.quadraticCurveTo(281,7,395,28);q.quadraticCurveTo(477,28,526,65);q.lineTo(499,96);q.lineTo(459,104);q.lineTo(430,131);q.lineTo(362,118);q.lineTo(316,150);q.lineTo(274,127);q.lineTo(201,139);q.lineTo(164,111);q.lineTo(88,118);q.lineTo(63,89);q.closePath();},gr,'#b5aec7',2);
  z10Ellipse(c,270,52,239,33,'#b9d1bb');z10Ellipse(c,270,47,217,25,'#d7dfc9');z10Ellipse(c,270,43,193,18,'#abbea9');
  for(let i=0;i<15;i++){const x=45+i*31,y=62+Math.sin(i*1.7)*13;c.strokeStyle='#afa4bf';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-12,y+15,x+12,y+26,x-2,y+39);c.stroke();}
  for(let j=0;j<34;j++){const x=31+j*14,y=54+Math.sin(j*.72)*14;c.strokeStyle=j%3?'rgba(76,113,104,.4)':'rgba(228,234,198,.5)';c.lineWidth=.9;c.beginPath();c.moveTo(x,y+4);c.quadraticCurveTo(x-3,y-2,x-2,y-8);c.moveTo(x,y+4);c.quadraticCurveTo(x+3,y-3,x+6,y-5);c.stroke();}
  for(let i=0;i<13;i++){const x=40+i*37,y=50+Math.sin(i*2)*12;z10Ellipse(c,x,y,12,5,i%2?'#cee2c4':'#a8c5b0',-.2);z10Ellipse(c,x-3,y-2,5,2,'#edf1d5');}
 });
 const foxColors=[['#e5b58e','#a37072'],['#f1d2aa','#bd9279'],['#bed2d3','#778f9e'],['#d5b8d0','#947aab'],['#d1ab99','#92717e'],['#e8cb92','#b2986e']];
 for(let i=0;i<6;i++){const cc=foxColors[i];
  A['foxBody'+i]=z10Sprite(108,76,c=>{
   const gr=c.createLinearGradient(26,12,64,68);gr.addColorStop(0,'#fff0d6');gr.addColorStop(.22,cc[0]);gr.addColorStop(.7,cc[1]);gr.addColorStop(1,'#756174');
   z10Path(c,q=>{q.moveTo(13,43);q.bezierCurveTo(10,22,30,13,52,16);q.bezierCurveTo(67,18,79,8,88,12);q.bezierCurveTo(97,21,105,41,95,55);q.bezierCurveTo(84,68,72,60,59,57);q.bezierCurveTo(38,51,28,62,15,55);q.lineTo(9,53);q.lineTo(13,48);q.closePath();},gr,cc[1],1.2);
   const bib=c.createLinearGradient(75,19,78,63);bib.addColorStop(0,'#fff9e8');bib.addColorStop(1,'#d8c5c4');z10Path(c,q=>{q.moveTo(80,17);q.bezierCurveTo(94,21,100,37,92,53);q.lineTo(86,53);q.quadraticCurveTo(86,62,79,63);q.lineTo(76,57);q.lineTo(69,59);q.quadraticCurveTo(76,42,80,17);},bib);
   c.strokeStyle='rgba(255,241,214,.6)';c.lineWidth=2.3;c.beginPath();c.moveTo(20,29);c.bezierCurveTo(34,17,52,26,66,23);c.stroke();c.strokeStyle='rgba(101,71,84,.23)';c.lineWidth=1.1;
   for(let j=0;j<12;j++){const x=22+j*4.8,y=32+Math.sin(j*.8)*6;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+1,y+5,x+4,y+7);c.stroke();}
   z10Ellipse(c,28,43,8,12,'rgba(255,224,193,.11)',.4);
  });
  A['foxHead'+i]=z10Sprite(92,75,c=>{
   const gr=c.createLinearGradient(24,10,64,64);gr.addColorStop(0,'#fff1d7');gr.addColorStop(.25,cc[0]);gr.addColorStop(.77,cc[1]);gr.addColorStop(1,'#9d7e88');
   z10Path(c,q=>{q.moveTo(17,18);q.bezierCurveTo(31,4,58,7,67,20);q.quadraticCurveTo(76,29,75,36);q.lineTo(86,42);q.quadraticCurveTo(88,48,77,52);q.bezierCurveTo(67,63,43,69,24,58);q.quadraticCurveTo(15,54,8,43);q.lineTo(16,44);q.lineTo(7,35);q.lineTo(16,36);q.lineTo(10,27);q.lineTo(19,28);q.closePath();},gr,cc[1],1.1);
   const mask=c.createLinearGradient(25,33,62,67);mask.addColorStop(0,'#fff9e8');mask.addColorStop(.68,'#f1e1d1');mask.addColorStop(1,'#c8b4b8');
   z10Path(c,q=>{q.moveTo(11,36);q.bezierCurveTo(25,44,30,35,40,42);q.quadraticCurveTo(48,50,58,46);q.bezierCurveTo(64,39,69,36,76,38);q.lineTo(87,43);q.quadraticCurveTo(81,53,68,54);q.bezierCurveTo(53,69,27,64,11,36);},mask);
   z10Path(c,q=>{q.moveTo(55,38);q.quadraticCurveTo(69,33,85,42);q.quadraticCurveTo(83,49,73,50);q.quadraticCurveTo(61,49,55,38);},'#fff4df');
   c.strokeStyle='rgba(255,244,216,.5)';c.lineWidth=1.5;c.beginPath();c.moveTo(25,21);c.quadraticCurveTo(40,12,52,21);c.stroke();
   c.strokeStyle='rgba(157,120,123,.26)';c.lineWidth=.65;for(let j=0;j<5;j++){c.beginPath();c.moveTo(17+j*3,43+j*2);c.lineTo(22+j*3,48+j*2);c.stroke();}
  });
  A['foxEar'+i]=z10Sprite(40,43,c=>{const gr=c.createLinearGradient(5,4,29,40);gr.addColorStop(0,cc[1]);gr.addColorStop(.4,cc[0]);gr.addColorStop(1,'#f3dcc3');z10Path(c,q=>{q.moveTo(5,39);q.bezierCurveTo(7,26,9,9,12,3);q.bezierCurveTo(26,11,36,24,35,40);q.closePath();},gr,cc[1],1);z10Path(c,q=>{q.moveTo(11,34);q.quadraticCurveTo(13,17,14,12);q.quadraticCurveTo(27,22,28,35);q.closePath();},'#9c747f');z10Path(c,q=>{q.moveTo(14,34);q.lineTo(16,24);q.lineTo(18,29);q.lineTo(21,23);q.lineTo(23,34);},'#e8bcc0');});
  A['foxTail'+i]=z10Sprite(132,100,c=>{
   const gr=c.createLinearGradient(29,10,91,93);gr.addColorStop(0,'#fff5de');gr.addColorStop(.28,cc[0]);gr.addColorStop(.7,cc[1]);gr.addColorStop(1,'#756579');
   z10Path(c,q=>{q.moveTo(120,84);q.bezierCurveTo(99,101,52,91,31,70);q.quadraticCurveTo(20,60,18,49);q.lineTo(10,46);q.lineTo(14,40);q.quadraticCurveTo(4,25,10,6);q.bezierCurveTo(18,17,34,17,46,21);q.lineTo(48,15);q.lineTo(57,24);q.bezierCurveTo(83,23,105,46,121,64);q.quadraticCurveTo(130,75,120,84);},gr,cc[1],1.1);
   const tip=c.createLinearGradient(11,9,46,66);tip.addColorStop(0,'#fffdf0');tip.addColorStop(1,'#e6d8ce');z10Path(c,q=>{q.moveTo(10,6);q.bezierCurveTo(20,18,35,17,46,21);q.lineTo(48,15);q.lineTo(57,24);q.quadraticCurveTo(50,35,55,43);q.lineTo(45,40);q.lineTo(45,50);q.lineTo(36,46);q.lineTo(33,57);q.lineTo(27,53);q.lineTo(28,66);q.quadraticCurveTo(18,57,18,49);q.lineTo(10,46);q.lineTo(14,40);q.quadraticCurveTo(4,25,10,6);},tip);
   c.strokeStyle='rgba(255,244,216,.5)';c.lineWidth=2.5;c.beginPath();c.moveTo(33,31);c.bezierCurveTo(47,48,71,50,102,73);c.stroke();c.lineWidth=.8;for(let j=0;j<11;j++){const x=38+j*5,y=51+j*2.2;c.strokeStyle=j%2?'rgba(255,240,213,.3)':'rgba(98,76,97,.18)';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+9,y+1,x+16,y+9);c.stroke();}
  });
 }
 const birds=[['#fff5dc','#caaab9'],['#bcebe8','#6ba5b6'],['#ffe4a8','#cfab70'],['#dbc8ed','#9c83b9'],['#f5d1df','#ba92af']];
 for(let i=0;i<5;i++){const cc=birds[i];A['birdBody'+i]=z10Sprite(59,42,c=>{const gr=c.createLinearGradient(15,8,35,37);gr.addColorStop(0,'#fffbe9');gr.addColorStop(.35,cc[0]);gr.addColorStop(1,cc[1]);z10Path(c,q=>{q.moveTo(12,24);q.bezierCurveTo(21,17,24,11,34,8);q.bezierCurveTo(46,1,53,12,48,21);q.bezierCurveTo(48,35,31,39,18,31);q.lineTo(9,29);q.lineTo(13,27);q.closePath();},gr,cc[1],.6);z10Path(c,q=>{q.moveTo(38,17);q.quadraticCurveTo(49,19,43,29);q.quadraticCurveTo(28,36,25,29);q.quadraticCurveTo(37,28,38,17);},'#fff8e5');z10Ellipse(c,43,13,2.7,3.2,'#5b4b65');z10Ellipse(c,44,12,1,1.2,'#fff');z10Path(c,q=>{q.moveTo(48,15);q.quadraticCurveTo(55,15,58,18);q.lineTo(48,20);},'#dbab6b');c.strokeStyle='rgba(255,247,221,.65)';c.lineWidth=1;c.beginPath();c.moveTo(29,15);c.quadraticCurveTo(35,8,40,9);c.stroke();});
  A['birdWing'+i]=z10Sprite(46,63,c=>{const gr=c.createLinearGradient(4,3,39,56);gr.addColorStop(0,'#fff7e7');gr.addColorStop(.45,cc[0]);gr.addColorStop(1,cc[1]);z10Path(c,q=>{q.moveTo(27,59);q.bezierCurveTo(9,47,3,22,7,7);q.quadraticCurveTo(9,-1,12,6);q.lineTo(15,19);q.quadraticCurveTo(16,1,20,6);q.lineTo(23,23);q.quadraticCurveTo(28,10,31,17);q.bezierCurveTo(30,34,47,43,27,59);},gr,cc[1],.6);c.strokeStyle='rgba(255,253,235,.6)';c.lineWidth=1;c.beginPath();c.moveTo(13,19);c.quadraticCurveTo(13,39,27,53);c.moveTo(21,22);c.quadraticCurveTo(22,41,28,51);c.stroke();});
 }

}
function z10Spark(c,x,y,rad,t,col,n){for(let i=0;i<n;i++){const a=i*2.39996+t*.22,r=rad*(.4+.6*((i*7%13)/13));z10Star(c,x+Math.cos(a)*r,y+Math.sin(a)*r*.65,2+Math.sin(t*2+i)*1.1,col);}}
function z10Bloom(c,x,y,s,t,open,col){c.save();c.translate(x,y);c.scale(s,s);const u=smooth(clamp(open,0,1));for(let i=0;i<7;i++){c.save();c.rotate(i*Math.PI*2/7+t*.06);c.scale(.18+u*.82,.45+u*.55);z10Petal(c,0,0,23,0,col||'#d4b4ef');c.restore();}z10Glow(c,'#ffe8a4',0,0,22,22,.3+u*.4);z10Ellipse(c,0,0,8+u*4,8+u*4,'#ffe7a6');z10Ellipse(c,-3,-4,3,3,'#fffbe5');c.restore();}
function z10Fox(c,x,y,s,t,awake,phase,face,pose){
 const A=z10Assets(),idx=(phase||0)%6,tm=awake?t:0,hop=pose||0,gait=tm*6.7+idx*.8,land=awake?Math.max(0,Math.cos(gait))*.04:0;
 c.save();c.translate(x,y);c.scale((face||1)*s,s);c.scale(1+land-hop*.04,1-land+hop*.05);c.lineCap='round';c.lineJoin='round';
 c.save();c.translate(-24,-26);c.rotate(-.16+(awake?Math.sin(tm*2.7+idx)*.16:idx*.025));c.drawImage(A['foxTail'+idx],-73,-49,94,71);c.restore();
 for(let i=0;i<4;i++){const far=i<2,xx=far?(i?23:-22):(i===2?-20:24),a=gait+(i%2?Math.PI:0)+(far?Math.PI:0),step=awake?Math.sin(a)*9:(i%2?18+idx%2*2:-18),yy=awake?Math.max(0,Math.cos(a))*7:(i%2?-19:-12);c.save();c.globalAlpha=far?.72:1;c.strokeStyle=far?'#9a8395':'#bca09d';c.lineWidth=far?6:7;c.beginPath();c.moveTo(xx,-24);c.quadraticCurveTo(xx+step*.7,-13,xx+step,yy-2);c.stroke();c.strokeStyle='#6d6071';c.lineWidth=5.5;c.beginPath();c.moveTo(xx+step,yy-7);c.lineTo(xx+step,yy-1);c.stroke();z10Ellipse(c,xx+step+2.5,yy,6,2.8,'#e8d9ce');c.restore();}
 c.drawImage(A['foxBody'+idx],-43,-56,84,59);
 c.save();c.translate(24,-48);c.rotate(awake?Math.sin(tm*1.45+idx)*.045:-.12+idx*.02);
 for(let i=0;i<2;i++){c.save();c.translate(i?8:-18,-17);c.rotate((i?.24:-.23)+(awake?Math.sin(tm*2.1+idx+i)*.055:0));c.drawImage(A['foxEar'+idx],-11,-23,29,31);c.restore();}
 c.drawImage(A['foxHead'+idx],-33,-24,70,57);
 const blink=awake&&(tm+idx*.63)%4.6>4.46;for(let i=0;i<2;i++){const ex=i?12:-8,ey=i?-1:0,wide=i?3.5:4.4;c.strokeStyle='#5a465c';c.lineWidth=1.8;if(blink){c.beginPath();c.moveTo(ex-wide,ey);c.quadraticCurveTo(ex,ey+2,ex+wide,ey-.5);c.stroke();}else{z10Ellipse(c,ex,ey,wide,5.1,'#51435b',-.13);z10Ellipse(c,ex+1,ey-1.8,1.45,1.9,'#fff9ec');z10Ellipse(c,ex-1,ey+2.5,.8,.8,'#d3b1c2');}c.strokeStyle='rgba(118,82,97,.45)';c.lineWidth=1;c.beginPath();c.moveTo(ex-wide-1,ey-5);c.quadraticCurveTo(ex,ey-7,ex+wide,ey-5);c.stroke();}
 z10Path(c,q=>{q.moveTo(26,7);q.quadraticCurveTo(31,5,34,9);q.quadraticCurveTo(31,14,27,12);q.closePath();},'#62505c');z10Ellipse(c,29,7.6,2,1,'#b9a2a4');c.strokeStyle='#967783';c.lineWidth=1.2;c.beginPath();c.moveTo(29,12);c.quadraticCurveTo(22,20,14,15);c.stroke();z10Ellipse(c,1,12,5,2,'rgba(228,173,180,.4)');c.strokeStyle='rgba(168,143,147,.48)';c.lineWidth=.6;c.beginPath();c.moveTo(17,13);c.lineTo(8,11);c.moveTo(18,15);c.lineTo(9,16);c.stroke();c.restore();
 if(awake){z10Glow(c,'#ffe8a4',-59,-55,18,14,.13);z10Star(c,-60,-55,2.6,'#fff0c9');}c.restore();
}
function z10Local(o){
 const z=o.z;return z.items;
}
function z10Setup(o){
 o.done=false;o.tk={bitti:false};const n=Z10_TOTAL[o.tip],z=o.z={aktif:false,t:0,n:0,asama:0,idle:0,help:false,helpT:0,age:0,end:-1,celebrate:0,items:[],pr:{x:o.x-170,y:o.y-130},entry:{x:0,y:0},box:{x0:o.x-290,x1:o.x+290,y0:o.y-425,y1:o.y+38},started:false,said:false,doruk:false,transition:0,clock:0,rewind:3,cloudX:o.x,cloudTo:o.x,cloudSquash:0,fly:null};
 if(o.tip==='zamanAgaci'){z.box.x0=o.x-330;z.box.x1=o.x+330;z.box.y0=o.y-500;}
 for(let i=0;i<n;i++){
  let x=0,y=-190,r=158;
  if(o.tip==='zamanDamla'){x=Z10_DROPS[i][0];y=Z10_DROPS[i][1];r=40;}
  else if(o.tip==='zamanKure'){x=0;y=-207;r=132;}
  z.items.push({x:o.x+x,y:o.y+y,bx:x,by:y,r,p:0,open:0,t:0,done:false,flash:0,idx:i,local:0,wind:0,cloud:0,launch:-1});
 }
 z.focus=()=>{if(typeof omDkEkle==='function'){const b=z.box;omDkEkle(b.x0,b.y0,b.x1,b.y1);}};
 o.adim=dt=>{if(!z.aktif||P.ucus!==o||!(dt>0))return;P.vx=P.vy=P.buf=0;P.ground=true;P.f=1;const f=o.tip==='zamanAgaci';const tx=(z.center||o.x)-(f?90:220),ty=o.y;P.x+=(tx-P.x)*(1-Math.exp(-dt*3));P.y+=(ty-P.y)*(1-Math.exp(-dt*6));};
 Z10.objects.push(o);
 if(o.tip==='zamanTilki'){z.fx=o.x;z.fy=o.y;z.homeY=o.y;z.jump=.4+(o.sira||0)*.09;z.foxIndex=Z10.fox.length;Z10.fox.push(o);}
}
function z10FoxGroup(o){
 const z=o.z;if(z.group)return;z.group=true;let center=0;for(const f of Z10.fox)center+=f.x;center/=Math.max(1,Z10.fox.length);z.center=center;z.cloudX=z.cloudTo=center;z.items.length=0;
 z.box.x0=center-310;z.box.x1=center+310;z.box.y0=o.y-420;z.box.y1=o.y+35;
 for(let i=0;i<Z10.fox.length;i++){const f=Z10.fox[i],x=center-175+i*70,y=o.y-198-Math.sin(i/5*Math.PI)*108;f.z.anchorX=x;f.z.anchorY=y;f.z.leader=o;z.items.push({x,y,bx:x-center,by:y-o.y,r:72,p:0,open:0,t:0,done:f.done,flash:0,idx:i,fox:f,local:0,launch:-1});}
 z.cloudTarget={x:center,y:o.y-75,r:125,cloud:true,idx:-1,done:false};
}
function z10Start(o){
 if(o.done||o.z.aktif||P.ucus||DURUM!=='oyun'||P.fade>0||!P.ground)return false;
 if(o.tip==='zamanTilki'&&o!==Z10.fox[0])return false;
 if(o.tip==='zamanAgaci'&&(V10.sandal!==true||Z10.objects.some(n=>n!==o&&n.tip!=='zamanTilki'&&!n.done)))return false;
 if(o.tip==='zamanTilki')z10FoxGroup(o);
 const z=o.z;z.aktif=true;z.entry.x=P.x;z.entry.y=P.y;z.idle=0;z.helpT=0;z.pr.x=D.x;z.pr.y=D.y;Z10.o=o;P.ucus=o;P.vx=P.vy=P.buf=P.kilit=0;z10Release();
 if(!z.started){z.started=true;z.t=0;z10Ses('p_z_'+Z10_VOICE[o.tip]);OLAY.emit('zamanBasla',{o});}
 if(o.tip==='zamanAgaci'){Z10.fin=o;V10.final=true;OLAY.emit('zamanFinal',{o,box:z.box,duration:28});z10Sfx('z_kok');}
 return true;
}
function z10End(o){const z=o.z;z10Release();if(P.ucus===o){P.ucus=null;P.vx=P.vy=P.buf=P.kilit=P.fade=0;P.ground=true;P.dj=true;P.safeX=P.x;P.safeY=P.y;D.x=z.pr.x;D.y=z.pr.y;D.vx=D.vy=0;}z.aktif=false;if(Z10.o===o)Z10.o=null;if(typeof omDikkat==='function')omDikkat('zaman10',.1,z.focus,1,.45);}
function z10StageVoice(o){const z=o.z;if(z.asama>2)return;z.stageSaid=true;z10Ses(o.tip==='zamanBahce'?['p_z_bahce_tohum','p_z_bahce_yaprak','p_z_bahce_kar'][z.asama]:['p_z_kure_yagmur','p_z_kure_gunes','p_z_kure_kus'][z.asama]);}
function z10Complete(o,item){
 const z=o.z;if(item.done)return;item.done=true;item.p=1;item.t=0;z.n++;z.celebrate=1.8;z.transition=o.tip==='zamanKure'?3.3:o.tip==='zamanBahce'?3.8:0;
 if(o.tip==='zamanTilki')z10FoxWake(item.fox);else V10[Z10_KEY[o.tip]]=z.n;
 z10Isik({x:item.x,y:item.y+100},Z10_COL[item.idx%4],600);burst(item.x,item.y,14,Z10_COL,65,1.2,5);
 z10Sfx(o.tip==='zamanDamla'?'z_damla':o.tip==='zamanBahce'?'z_mevsim':o.tip==='zamanTilki'?'z_tilki_inis':item.idx===0?'z_ani_yagmur':item.idx===1?'z_ani_gunes':'z_ani_kus',item.idx);OLAY.emit('zamanAdim',{o,n:z.n});
 if(z.n>=z.items.length){o.done=true;o.tk.bitti=true;z.end=0;z10Ses('p_z_'+Z10_VOICE[o.tip]+'_bitti');OLAY.emit('zamanBitti',{o});z10Isik(o,Z10_COL[1],1800);if(o.tip==='zamanDamla')z10Sfx('z_selale');}
}
function z10Touch(o,item,amount){
 const z=o.z;if(!item||item.done||!z.aktif||z.end>=0||z.transition>0)return false;
 z.idle=0;z.helpT=0;item.flash=.8;
 if(o.tip==='zamanTilki'){
  if(z.fly)return true;item.launch=0;item.startX=item.x;item.startY=item.y;z.fly=item;z.cloudTo=item.x;z10Sfx('z_tilki_hop',item.idx);return true;
 }
 item.p=clamp(item.p+amount,0,1);
 if(item.p<1){if(z.age-(z.soundT||0)>.18){z.soundT=z.age;z10Sfx(o.tip==='zamanBahce'?'z_geri':item.idx===0?'z_ani_yagmur':item.idx===1?'z_ani_gunes':'z_ani_kus',item.p*.25);}return true;}
 z10Complete(o,item);return true;
}
function z10FoxWake(o){if(o.done)return;const z=o.z;o.done=true;o.tk.bitti=true;z.followT=0;if(o!==Z10.fox[0])z.t=0;z.wake=true;z.order=V10.tilki++;z.sneeze=z.order===2;z.fx=z.catchX==null?(z.anchorX==null?o.x:z.anchorX):z.catchX;z.fy=z.homeY;z10Sfx('z_uyan',z.order);burst(z.fx,z.homeY-60,12,Z10_COL,55,1.1,5);z10Isik(o,'#d9b9ff',700);}
function z10Next(o){if(o.tip==='zamanTilki'&&o.z.fly)return o.z.fly;for(const p of o.z.items)if(!p.done)return p;return null;}
function z10Follower(o,dt){const z=o.z;z.followT=(z.followT||0)+dt;const ft=z.followT;const fin=Z10.fin&&Z10.fin.z.aktif;let tx=P.x-(53+z.order*44)*P.f,ty;
 if(fin){tx=Z10.fin.x+(z.order-2.5)*64;ty=Z10.fin.y;}else{tx=clamp(tx,40,(COLS-1)*T);ty=typeof yuzey==='function'?yuzey(Math.floor(tx/T)):z.homeY;}
 const k=1-Math.exp(-dt*(Math.abs(z.fx-tx)>900?5:3));z.fx+=(tx-z.fx)*k;const hop=ft<1.7?Math.sin(clamp(ft/1.7,0,1)*Math.PI)*85:Math.abs(Math.sin(ft*(fin?5:6)+z.order))*9;
 z.fy+=(ty-z.fy)*(1-Math.exp(-dt*7));z.hop=hop;
 if(!(z.leader&&z.leader.z.aktif)){o.x=z.fx;o.y=z.fy;}
 if(z.sneeze&&ft>1.5&&!z.sneezed){z.sneezed=true;z10Ses('p_z_hapsir');burst(z.fx+30,z.fy-40,12,['#fff0ce','#e1c7ff'],70,1.2,6);z10Sfx('z_uyan',.4);}
}
function z10Step(o,dt){
 if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;dt=Math.min(dt,.05);const z=o.z;z.age+=dt;
 if(o.tip==='zamanTilki'){
  const leader=Z10.fox[0];if(leader&&!leader.z.group)z10FoxGroup(leader);
  if(o.done)z10Follower(o,dt);
  if(o!==leader)return;
  if(!z.aktif){if(!o.tk.bitti&&!P.ucus&&Math.abs(P.x-z.center)<400&&Math.abs(P.y-o.y)<90)z10Start(o);return;}
 }
 for(const p of z.items){p.open+=(p.p-p.open)*(1-Math.exp(-dt*4));if(p.done){p.t+=dt;p.local+=dt;}p.flash=Math.max(0,p.flash-dt);}
 if(!z.aktif){const right=o.tip==='zamanAgaci'?COLS*T:o.x+6*T;if(!o.done&&!P.ucus&&P.x>o.x-245&&P.x<right&&Math.abs(P.y-o.y)<90)z10Start(o);return;}
 z.t+=dt;z.celebrate=Math.max(0,z.celebrate-dt);if(typeof omDikkat==='function')omDikkat('zaman10',1.4,z.focus,1,.42);
 if(o.tip==='zamanAgaci'){
  const a=z.t;z.pr.x+=(o.x+158+Math.sin(a*.8)*10-z.pr.x)*(1-Math.exp(-dt*3));z.pr.y+=(o.y-92+Math.sin(a*2)*5-z.pr.y)*(1-Math.exp(-dt*3));
  if(a>4&&!z.bloom){z.bloom=true;z10Isik(o,'#ffe8a4',5000);z10Sfx('z_tac',0);burst(o.x,o.y-310,30,Z10_COL,100,2,8);}
  if(a>12&&!z.doruk){z.doruk=true;lightTarget=1;z10Sfx('z_final');z10Ses('p_z_bitti');OLAY.emit('zamanDoruk',{o});burst(o.x,o.y-270,40,Z10_COL,150,2.5,9);}
  if(a>28&&!z.finished){z.finished=true;o.done=true;OLAY.emit('zamanTamam',{o});z10End(o);if(typeof finaleGec==='function')finaleGec();}return;
 }
 if(o.tip==='zamanTilki'){
  z.cloudX+=(z.cloudTo-z.cloudX)*(1-Math.exp(-dt*9));z.cloudTarget.x=z.cloudX;z.cloudSquash=Math.max(0,z.cloudSquash-dt*2.5);
  const f=z.fly;if(f){f.launch+=dt;const a=f.launch;
   if(a<.5){const u=smooth(a/.5);f.x=f.startX-30*u;f.y=f.startY+25*u;}
   else if(a<1.9){const u=clamp((a-.5)/1.4,0,1);f.x=lerp(f.startX-30,z.cloudX,smooth(u));f.y=lerp(f.startY+25,o.y-83,u*u)-Math.sin(u*Math.PI)*48;}
   else{f.fox.z.catchX=z.cloudX;z.cloudSquash=1;z.fly=null;z10Complete(o,f);}
  }
 }
 if(z.end>=0){z.end+=dt;z.pr.x+=(P.x+60-z.pr.x)*(1-Math.exp(-dt*3));z.pr.y+=(P.y-110-z.pr.y)*(1-Math.exp(-dt*3));if(z.end>(o.tip==='zamanTilki'?4.5:4))z10End(o);return;}
 if(z.transition>0){z.transition-=dt;if(z.transition<=0){z.asama=z.n;z.rewind=3;z.idle=0;z.said=false;z10StageVoice(o);}return;}
 if((o.tip==='zamanBahce'||o.tip==='zamanKure')&&!z.stageSaid&&z.t>3){z.stageSaid=true;z10StageVoice(o);}
 if(o.tip==='zamanBahce')z.rewind=Math.max(0,z.rewind-dt);
 z.idle+=dt;z.helpT+=dt;const p=z10Next(o);const guide=z.idle>8&&p;
 let tx=guide?p.x-55:P.x+55,ty=guide?p.y-60:P.y-115+Math.sin(z.t*2)*5;
 z.pr.x+=(tx-z.pr.x)*(1-Math.exp(-dt*2.4));z.pr.y+=(ty-z.pr.y)*(1-Math.exp(-dt*2.4));
 if(z.idle>10&&!z.said){z.said=true;z10Ses('p_z_'+Z10_VOICE[o.tip]+'_ipucu');}
 if(z.idle>14&&!z.help){z.help=true;z.helpT=2;}
 if(z.help&&z.helpT>1.25&&p){z10Touch(o,p,o.tip==='zamanBahce'||o.tip==='zamanKure'?.34:1);z.helpT=0;z.idle=14;}
}
function z10PausedMark(c,x,y,r,progress){
 c.save();c.translate(x,y);c.strokeStyle='#eee7cc';c.globalAlpha=.6;c.lineWidth=1.5;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();c.rotate((progress||0)*Math.PI*2);c.beginPath();c.moveTo(-r*.15,r*.15);c.lineTo(0,0);c.lineTo(0,-r*.6);c.moveTo(0,0);c.lineTo(r*.4,0);c.stroke();c.restore();
}
// A motion trace stops with its subject, then opens in the same local time.
// It is a thin world-space effect, never a control or an additional hit target.
function z10TimeTrace(c,x,y,rx,ry,phase,release){
 const u=clamp(release||0,0,1);if(u>=1)return;const e=smooth(u);
 c.save();c.translate(x,y);c.rotate(phase||0);c.scale(1+e*.4,1+e*.24);c.globalAlpha*=.55*(1-u);c.strokeStyle='#f9e8ad';c.lineWidth=1.45;c.lineCap='round';
 for(let j=0;j<3;j++){const a=j*Math.PI*2/3+.18+e*.5;c.beginPath();c.ellipse(0,0,rx,ry,0,a,a+1.28-e*.7);c.stroke();const xx=Math.cos(a)*rx,yy=Math.sin(a)*ry;c.beginPath();c.moveTo(xx-2.5,yy-2.5);c.lineTo(xx+2.5,yy+2.5);c.stroke();}
 c.restore();
}
function z10Splash(c,x,y,time){
 const u=clamp(time/.7,0,1);if(!(time>=0)||u>=1)return;c.save();c.globalAlpha*=1-u;
 c.strokeStyle='#ecffff';c.lineWidth=2.2;c.beginPath();c.ellipse(x,y,10+u*43,3+u*10,0,0,Math.PI*2);c.stroke();
 for(let j=0;j<7;j++){const vx=(j-3)*58,vy=-88-(j%3)*28,xx=x+vx*time,yy=y+vy*time+time*time*190;z10Ellipse(c,xx,yy,2.1+(j%2)*.6,4.5-u*2,'#e6ffff',-.65+j*.21);}
 z10Glow(c,'#b4f5f3',x,y-3,38+u*29,13+u*8,.35*(1-u));c.restore();
}
function z10DropDraw(o,t){
 const z=o.z,A=z10Assets(),fill=z.n/9;
 g.drawImage(A.source,o.x-230,o.y-416,460,143);g.drawImage(A.pool,o.x-235,o.y-38,470,101);
 z10Glow(g,'#b4f5f3',o.x,o.y-190,230,205,.11+fill*.14);
 // Every suspended strand has its own stopped time. Touching another strand
 // cannot animate the untouched droplets, even while the pool comes to life.
 for(const p of z.items){
  const landingX=p.x*.78+o.x*.22;
  // A thick water ribbon was caught during its arc; its detached beads stay still.
  g.save();g.strokeStyle=p.done?'#b8fbff':'#b9e9ee';g.globalAlpha=p.done?.5:.27;g.lineCap='round';g.lineWidth=p.done?8:5;
  g.beginPath();g.moveTo(p.x*.16+o.x*.84,o.y-354);g.quadraticCurveTo(p.x+(p.x-o.x)*.16,p.y-75,p.x,p.y-13);if(p.done)g.quadraticCurveTo(p.x+(p.idx%2?36:-36),o.y-50,landingX,o.y-2);g.stroke();
  if(!p.done){g.strokeStyle='#f2ffff';g.lineWidth=1.1;g.globalAlpha=.4;g.beginPath();g.moveTo(p.x*.16+o.x*.84,o.y-354);g.quadraticCurveTo(p.x+(p.x-o.x)*.16,p.y-75,p.x,p.y-13);g.stroke();}g.restore();
  z10TimeTrace(g,p.x,p.y,39,24,-.3+(p.idx%3)*.21,p.done?p.t/.72:0);
  if(p.done){const u=clamp(p.t/.9,0,1);if(u<1){const fall=u*u,xx=lerp(p.x,landingX,fall),yy=lerp(p.y,o.y-8,fall);g.save();g.translate(xx,yy);g.scale(1-u*.28,1+u*.42);g.drawImage(A.drop,-25,-35,50,65);g.restore();
    g.save();g.strokeStyle='#dcffff';g.lineWidth=2;g.globalAlpha=u*.5;g.beginPath();g.moveTo(xx,yy-23);g.lineTo(xx,yy-23-u*32);g.stroke();g.restore();}
   else{for(let j=0;j<3;j++){const v=(p.t*.62+j/3)%1,xx=lerp(p.x,landingX,v)+Math.sin(v*Math.PI)*(p.idx%2?22:-22),yy=lerp(p.y,o.y-7,v);z10Ellipse(g,xx,yy,2.4,6,'#d9ffff');}
    const v=(p.t-.9)%1.5/1.5;g.save();g.globalAlpha=(1-v)*.55;g.strokeStyle='#e6ffff';g.lineWidth=1.8;g.beginPath();g.ellipse(landingX,o.y-1,8+v*43,2+v*9,0,0,Math.PI*2);g.stroke();g.restore();}
   z10Splash(g,landingX,o.y-1,p.t-.9);
   if(p.t<2.6){const u=clamp(p.t/2.6,0,1);z10Star(g,p.x+Math.sin(u*4)*14,p.y-45-u*62,8*(1-u),'#fff3b2');}continue;
  }
  z10Glow(g,'#b4f5f3',p.x,p.y,47,55,.21);g.drawImage(A.drop,p.x-29,p.y-42,58,74);
  // Stretched beads and a half-finished splash make this a paused fall, not resting water.
  z10Ellipse(g,p.x-23,p.y+25,3,7,'#c5effa',-.8);z10Ellipse(g,p.x+24,p.y+20,2.5,5,'#f0ffff',.8);z10Ellipse(g,p.x+6,p.y-57,2.2,6,'#e8ffff',.2);
  g.save();g.strokeStyle='#d9f9ff';g.globalAlpha=.47;g.lineWidth=1.5;g.beginPath();g.moveTo(p.x-22,p.y+31);g.quadraticCurveTo(p.x-14,p.y+19,p.x-8,p.y+34);g.moveTo(p.x+9,p.y+34);g.quadraticCurveTo(p.x+17,p.y+22,p.x+24,p.y+29);g.stroke();g.restore();
  if(z.aktif&&z.idle>7)z10PausedMark(g,p.x,p.y-3,13,0);
 }
 if(fill>0){g.save();g.globalAlpha=fill*.7;g.drawImage(A.ring,o.x-183,o.y-11,366,69);g.restore();for(let i=0;i<8;i++){const u=(z.age*.3+i*.137)%1;z10Star(g,o.x-175+u*350,o.y+4-Math.sin(u*Math.PI)*10,1.7,'#edffff');}}
 for(let i=0;i<5;i++){const growth=clamp(fill*1.4-i*.09,0,1);g.save();g.translate(o.x-178+i*89,o.y+9);g.scale(.55,.55);g.drawImage(A.leaf,-43,-12,86*growth,46*growth);g.restore();z10Bloom(g,o.x-178+i*89,o.y+5,.43,z.n?z.age:0,growth,i%2?'#bfe6e9':'#d7c6f2');}
}
function z10Plant(c,x,y,scale,open,t,color){
 const A=z10Assets(),u=smooth(clamp(open,0,1));c.save();c.translate(x,y);c.scale(scale,scale);const h=20+u*124,sway=Math.sin(t*1.4)*5*u;
 c.strokeStyle='#759c95';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-17,-h*.35,19+sway,-h*.7,sway,-h);c.stroke();
 for(let i=0;i<4;i++){const yy=-h*(.24+i*.16),f=i%2?1:-1;c.save();c.translate(Math.sin(i)*5,yy);c.rotate(f*.3);c.scale(f*(.25+u*.33),.23+u*.18);c.drawImage(A.leaf,0,-37,140,73);c.restore();}
 z10Bloom(c,sway,-h,.9,t,u,color||'#f0c2e2');c.restore();
}
function z10ClockHand(c,x,y,a,r){c.save();c.translate(x,y);c.rotate(a);c.strokeStyle='#a69ac0';c.lineWidth=10;c.lineCap='round';c.beginPath();c.moveTo(0,17);c.lineTo(0,-r);c.stroke();c.strokeStyle='#fff0c6';c.lineWidth=4;c.beginPath();c.moveTo(0,13);c.lineTo(0,-r);c.stroke();z10Star(c,0,-r,7,'#fff6d3');z10Ellipse(c,0,0,12,12,'#dfcda9');z10Ellipse(c,-2,-2,5,5,'#fff7d9');c.restore();}
function z10GardenDraw(o,t){
 const z=o.z,A=z10Assets(),stage=Math.min(2,z.asama),p=z.items[stage],u=p.open,rew=z.aktif?clamp(z.rewind/3,0,1):1,tm=p.done?p.local:p.open*6;
 g.drawImage(A.gardenBed,o.x-270,o.y-34,540,160);z10Glow(g,Z10_COL[stage],o.x,o.y-197,180,180,.13+u*.12);
 g.drawImage(A.clock,o.x-155,o.y-348,310,310);
 z10TimeTrace(g,o.x,o.y-193,141,141,.35,clamp(u*3.2,0,1));
 // The flower visibly runs backwards into its seed before the child's new season.
 if(stage===0){const grow=z.rewind>0?Math.max(u,rew):u;z10Plant(g,o.x,o.y-67,1.02,grow,tm,'#f4c6e7');
  for(let i=0;i<4;i++)z10Plant(g,o.x-112+i*75,o.y-49,.45,clamp(grow*1.3-i*.12,0,1),tm+i,'#e9dfad');
  if(grow<.22){z10Ellipse(g,o.x,o.y-70,13,8,'#d2b6bc',-.35);z10Ellipse(g,o.x-3,o.y-73,6,2.5,'#f1ded5',-.35);}
 }else if(stage===1){
  g.save();g.strokeStyle='#a68b9c';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(o.x,o.y-55);g.bezierCurveTo(o.x-20,o.y-112,o.x+10,o.y-175,o.x,o.y-254);g.stroke();g.lineWidth=7;for(let i=0;i<4;i++){const side=i%2?1:-1,y=o.y-100-i*32;g.beginPath();g.moveTo(o.x,y+24);g.quadraticCurveTo(o.x+side*26,y,o.x+side*63,y-16);g.stroke();}g.restore();
  for(let i=0;i<18;i++){const a=i*2.39996,rad=35+Math.sqrt(i)*14,bx=o.x+Math.cos(a)*rad,by=o.y-224+Math.sin(a)*rad*.65,fall=clamp(u*1.5-(i%5)*.1,0,1),xx=bx+Math.sin(fall*5+i)*fall*42,yy=lerp(by,o.y-52,fall);g.save();g.translate(xx,yy);g.rotate(a*.2+fall*5);g.globalAlpha=1;g.drawImage(A.autumnLeaf,-20,-10,40,21);g.restore();if(i%5===0)z10TimeTrace(g,xx,yy,25,12,a*.2,clamp(u*3.2,0,1));z10Ellipse(g,xx-3,yy,4,2,i%3?'#e8b979':'#eac6a5',a);}
  if(u>.5)for(let i=0;i<3;i++)z10Plant(g,o.x-90+i*90,o.y-44,.34,(u-.5)*2,tm,'#e8b4c6');
 }else{
  z10Ellipse(g,o.x,o.y-61,111,21,'#d3e5eb');z10Ellipse(g,o.x-20,o.y-70,78,18,'#f2f8f1');z10Ellipse(g,o.x+65,o.y-64,40,12,'#e5f1ef');
  for(let i=0;i<12;i++){const startY=o.y-300+(i%3)*34,travel=p.done?p.local*.25:u*.8,fl=(i*.13+travel)%1,xx=o.x-100+(i%6)*42+(p.done?Math.sin(tm+i)*9:0),yy=lerp(startY,o.y-80,fl);g.save();g.strokeStyle='#f4fbff';g.lineWidth=1.4;for(let j=0;j<3;j++){const a=j*Math.PI/3;g.beginPath();g.moveTo(xx-Math.cos(a)*4,yy-Math.sin(a)*4);g.lineTo(xx+Math.cos(a)*4,yy+Math.sin(a)*4);g.stroke();}g.restore();}
  for(let i=0;i<5;i++)z10Plant(g,o.x-97+i*49,o.y-66,.43,clamp(u*1.5-i*.1,0,1),tm+i,i%2?'#d6c0f3':'#fff1d4');
 }
 // One tactile clock, not three progress circles: turn either direction or tap.
 z10ClockHand(g,o.x,o.y-193,z.clock-(z.rewind>0?rew*Math.PI*1.7:0),95);
 for(let i=0;i<3;i++){const px=o.x-205+i*205,py=o.y-31;if(i<z.n){g.drawImage(A.leaf,px-68,py-7,136,40);z10Bloom(g,px,py-6,.38,z.age,1,Z10_COL[i]);}}
 if(z.aktif&&z.idle>7){g.save();g.strokeStyle='#fff5bf';g.lineWidth=4;g.globalAlpha=.7;g.beginPath();g.arc(o.x,o.y-193,114,-1.2,1.2);g.stroke();z10Star(g,o.x+42,o.y-87,9,'#fff5bf');g.restore();}
}
function z10Bird(c,x,y,s,t,color,face){
 const A=z10Assets(),idx=color===Z10_COL[0]?1:color===Z10_COL[1]?2:color===Z10_COL[2]||color==='#ebd7f1'?3:color===Z10_COL[3]?4:0,flap=Math.sin(t*5);
 c.save();c.translate(x,y);c.scale(s*(face||1),s);c.rotate(Math.sin(t*2.5)*.045);
 c.save();c.translate(-1,1);c.rotate(-.35-flap*.58);c.globalAlpha=.72;c.drawImage(A['birdWing'+idx],-14,-29,23,32);c.restore();
 c.save();c.translate(-8,4);c.rotate(-.12+Math.sin(t*3)*.07);z10Path(c,q=>{q.moveTo(3,-3);q.quadraticCurveTo(-6,-7,-16,-4);q.lineTo(-13,0);q.lineTo(-17,4);q.quadraticCurveTo(-7,8,3,4);},color||'#f1deca','#baa3b7',.45);c.restore();
 c.drawImage(A['birdBody'+idx],-16,-12,39,28);c.save();c.translate(-1,1);c.rotate(-.5-flap*.66);c.drawImage(A['birdWing'+idx],-12,-31,24,34);c.restore();c.restore();
}
function z10LittleFace(c,x,y,awake,t,s){
 c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle='#8e6a84';c.lineWidth=1.5;c.lineCap='round';const open=clamp(awake*2,0,1);
 for(let i=0;i<2;i++){const xx=i?7:-7;if(open<.3){c.beginPath();c.moveTo(xx-3,-2);c.quadraticCurveTo(xx,1,xx+3,-2);c.stroke();}else{z10Ellipse(c,xx,-2,2.2,3*open,'#795f80');z10Ellipse(c,xx+.5,-3, .7,.8,'#fff');}z10Ellipse(c,xx,5,3.5,1.5,'#e9b5bd');}
 c.beginPath();c.moveTo(-3,5);c.quadraticCurveTo(0,7+open*2,4,5);c.stroke();c.restore();
}
function z10Memory(c,x,y,r,idx,amount,t,state){
 const A=z10Assets(),tm=state&&state.done?state.local+5:amount*5,unit=r/90;
 c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip();c.drawImage(idx===0?A.memory1:idx===1?A.memory0:A.memory2,x-r,y-r,r*2,r*2);c.save();c.translate(x-r,y-r);c.scale(unit,unit);
 if(idx===0){
  const cx=state?state.cloud||0:0;c.drawImage(A.cloud,42+cx,10,101,45);z10LittleFace(c,92+cx,33,amount,tm,.65);z10Glow(c,'#b4f5f3',90+cx,43,42,22,.18+amount*.25);
  c.strokeStyle='#e7faff';c.lineWidth=2;c.lineCap='round';c.beginPath();for(let i=0;i<14;i++){const u=(i*.239+tm*.51)%1,px=40+(i%7)*16+cx,py=52+u*84;c.moveTo(px,py);c.lineTo(px-2,py+7);}c.stroke();
  if(amount<.34)for(let i=0;i<3;i++)z10TimeTrace(c,56+i*32+cx,69+i*16,11,5,-.4,amount*3);
  for(let i=0;i<4;i++){const u=(tm*.42+i*.25)%1;c.globalAlpha=.25+amount*.4;c.strokeStyle='#dffcf4';c.lineWidth=1;c.beginPath();c.ellipse(55+i*25,143+i%2*6,3+u*12,1+u*4,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;
  for(let i=0;i<3;i++){const growth=clamp(amount*1.5-i*.2,0,1);c.save();c.translate(42+i*43,149-i%2*12);c.scale(growth,growth);c.drawImage(A.memoryFlower,-8,-11,16,16);c.restore();}
 }else if(idx===1){
  const sy=126-amount*94;z10TimeTrace(c,126,sy,27,22,-.35,amount*3);z10Glow(c,'#ffe8a4',126,sy,36,36,.45);z10Ellipse(c,126,sy,18,18,'#ffe4a4');z10Ellipse(c,122,sy-5,7,6,'#fff4c8');z10LittleFace(c,126,sy+2,amount,tm,.65);
  c.strokeStyle='#ffe9b6';c.lineWidth=2;c.lineCap='round';for(let i=0;i<8;i++){const a=i*Math.PI/4+tm*.1;c.beginPath();c.moveTo(126+Math.cos(a)*24,sy+Math.sin(a)*24);c.lineTo(126+Math.cos(a)*29,sy+Math.sin(a)*29);c.stroke();}
  for(let i=0;i<7;i++){const fx=16+i*24,fy=132+i%3*12,sc=.2+amount*.8;c.save();c.translate(fx+(state&&state.done?Math.sin(tm*1.5+i)*2:0),fy);c.scale(sc,sc);c.drawImage(A.memoryFlower,-12,-12,24,24);c.restore();}
  if(amount<.5){c.globalAlpha=(.5-amount)*.55;c.fillStyle='#8e7baf';c.fillRect(0,0,180,180);c.globalAlpha=1;}
 }else{
  for(let i=0;i<3;i++){const fl=state&&state.done?tm:amount*3.8,bx=35+i*50+(state&&state.done?Math.sin(tm*.7+i)*18:amount*22),by=71+i%2*21-Math.sin(fl+i)*12;z10Bird(c,bx,by,.62,fl+i,i===1?'#ebd7f1':'#fff4db',1);if(amount<.34)z10TimeTrace(c,bx-7,by+4,23,9,-.16,amount*3);}
  c.strokeStyle='#f8f3d3';c.lineWidth=1.5;c.globalAlpha=.25+amount*.45;for(let i=0;i<3;i++){const xx=24+i*43+(tm*18)%29,yy=100+i*13;c.beginPath();c.moveTo(xx-18,yy);c.bezierCurveTo(xx-6,yy+4,xx+10,yy-8,xx+22,yy-3);c.stroke();}c.globalAlpha=1;
  if(amount>.2){const u=amount;z10Path(c,q=>{q.moveTo(145,89-u*26);q.lineTo(155,99-u*26);q.lineTo(145,111-u*26);q.lineTo(135,99-u*26);q.closePath();},'#e9bdcf','#fff0df',1);c.strokeStyle='#f6e7c7';c.lineWidth=1;c.beginPath();c.moveTo(145,111-u*26);c.bezierCurveTo(131,125,150,140,127,151);c.stroke();}
 }
 c.restore();if(amount<.995){c.globalAlpha=(1-amount)*.23;c.fillStyle='#a59abd';c.fillRect(x-r,y-r,r*2,r*2);}c.restore();
}
function z10BubbleDraw(o,t){
 const z=o.z,A=z10Assets();g.drawImage(A.gardenBed,o.x-245,o.y-29,490,145);g.save();g.globalAlpha=.7;g.drawImage(A.ring,o.x-208,o.y-17,416,70);g.restore();
 for(const p of z.items){
  const current=p.idx===z.asama,wait=p.idx>z.asama;let settle=p.done?smooth(clamp((p.t-.3)/3,0,1)):0;
  const sx=o.x-165+p.idx*165,smallY=o.y-44;
  if(wait){const xx=o.x+(p.idx===1?196:-196),yy=o.y-242+(p.idx===2?86:0);z10Memory(g,xx,yy,31,p.idx,0,0,p);g.save();g.strokeStyle='#c8c0e2';g.lineWidth=1.7;g.beginPath();g.arc(xx,yy,34,0,Math.PI*2);g.stroke();g.restore();z10PausedMark(g,xx,yy+45,10,0);continue;}
  const xx=lerp(o.x,sx,settle),yy=lerp(o.y-207,smallY,settle)-Math.sin(settle*Math.PI)*35,rr=lerp(126,39,settle);
  z10TimeTrace(g,xx,yy,rr+12,rr+12,.3,clamp(p.open*3.2,0,1));
  z10Glow(g,Z10_COL[p.idx],xx,yy,rr*1.32,rr*1.32,.23+p.open*.13);z10Memory(g,xx,yy,rr,p.idx,p.open,t,p);
  g.save();g.strokeStyle='#e9faff';g.lineWidth=2.5;g.globalAlpha=1-settle*.4;g.beginPath();g.arc(xx,yy,rr+4,0,Math.PI*2);g.stroke();g.strokeStyle='#ffffff';g.lineWidth=5;g.globalAlpha=.65;g.beginPath();g.arc(xx-4,yy-4,rr*.87,Math.PI*1.13,Math.PI*1.45);g.stroke();g.restore();
  if(!p.done){z10PausedMark(g,xx,yy+rr+27,17,p.open);if(z.aktif&&z.idle>7){g.save();g.strokeStyle='#fff2bf';g.lineWidth=3;g.globalAlpha=.6;g.beginPath();if(p.idx===0){g.moveTo(xx-40,yy-45);g.bezierCurveTo(xx-80,yy-80,xx+80,yy-80,xx+40,yy-45);}else if(p.idx===1){g.moveTo(xx+47,yy+47);g.quadraticCurveTo(xx+70,yy,xx+47,yy-47);}else{g.moveTo(xx-63,yy);g.bezierCurveTo(xx-15,yy-25,xx+15,yy+25,xx+63,yy);}g.stroke();g.restore();}}
  if(settle>.85){z10Spark(g,xx,yy,52,t,Z10_COL[p.idx],3);if(p.idx===2)z10Bird(g,xx+Math.sin(p.local)*40,yy-43+Math.cos(p.local)*9,.6,p.local,'#fff2da',1);}
 }
}
function z10FoxClearing(o,t){
 const z=o.z,A=z10Assets(),cx=z.center||o.x;g.save();g.globalAlpha=.75;g.drawImage(A.ring,cx-260,o.y-11,520,77);g.restore();
 const squ=z.cloudSquash||0;z10Glow(g,'#d9b9ff',z.cloudX,o.y-76,137,47,.22);g.save();g.translate(z.cloudX,o.y-75);g.scale(1+squ*.15,1-squ*.25);g.drawImage(A.cloud,-135,-47,270,120);g.restore();
 // The trampoline's warm light connects a real landing to the thawing world.
 if(squ>0)for(let i=0;i<7;i++){const a=i/7*Math.PI;z10Star(g,z.cloudX+Math.cos(a)*(35+(1-squ)*80),o.y-78-Math.sin(a)*(15+(1-squ)*75),3+squ*3,Z10_COL[i%4]);}
 for(const p of z.items){if(p.done)continue;const moving=p.launch>=0,thaw=moving?clamp(p.launch/.72,0,1):0,dir=p.idx%2?-1:1;
  // A fixed parabola ends halfway through the leap. Opening it releases this fox alone.
  g.save();g.strokeStyle='#e8dabf';g.lineWidth=1.7;g.globalAlpha=.42*(1-thaw);g.beginPath();g.moveTo((p.startX||p.x)-dir*93,(p.startY||p.y)+48);g.bezierCurveTo((p.startX||p.x)-dir*72,(p.startY||p.y)+7,(p.startX||p.x)-dir*35,(p.startY||p.y)-32,(p.startX||p.x)+dir*6,(p.startY||p.y)-28);g.stroke();g.restore();
  z10TimeTrace(g,p.startX||p.x,(p.startY||p.y)-18,74,35,-dir*.23,thaw);
  g.save();g.translate(p.x,p.y);g.rotate(-dir*.12*(1-thaw));z10Fox(g,0,0,.73,moving?p.launch:0,moving,p.idx,dir,moving?Math.sin(p.launch*Math.PI):.85);g.restore();
 }
 if(z.aktif&&z.idle>7){g.save();g.strokeStyle='#fff0bd';g.lineWidth=3;g.globalAlpha=.65;g.beginPath();g.moveTo(z.cloudX-83,o.y-7);g.lineTo(z.cloudX+83,o.y-7);g.stroke();z10Star(g,z.cloudX-88,o.y-7,7,'#fff0bd');z10Star(g,z.cloudX+88,o.y-7,7,'#fff0bd');g.restore();}
}
function z10TreeDraw(o,t){
 const z=o.z,A=z10Assets(),a=z.aktif?z.t:o.done?28:0,live=Math.max(0,a-12),open=smooth(clamp((a-4)/8,0,1)),cx=o.x,cy=o.y;
 const painted=typeof DN10_TREE_IMAGE!=='undefined'&&DN10_TREE_IMAGE&&DN10_TREE_IMAGE.complete&&DN10_TREE_IMAGE.naturalWidth;
 z10Glow(g,'#d9b9ff',cx,cy-250,285,260,.16+open*.22);
 // The shared illustration is decoded once; the face and living crown remain animated layers.
 if(painted)g.drawImage(DN10_TREE_IMAGE,cx-210,cy-500,420,520);else g.drawImage(A.tree,cx-264,cy-455,528,473);
 // Roots carry the remembered moments into the old guardian before its eyes open.
 g.save();g.lineCap='round';for(let i=0;i<5;i++){const side=i%2?1:-1,sx=cx+side*(100+i*27),sy=cy-4;g.strokeStyle=i%2?'#d9c8e6':'#b9e6db';g.lineWidth=2;g.globalAlpha=.18+open*.38;g.beginPath();g.moveTo(sx,sy);g.bezierCurveTo(cx+side*75,cy-43,cx-side*14,cy-74,cx,cy-158);g.stroke();if(a>0&&a<12){const u=(a*.23+i*.2)%1,xx=lerp(sx,cx,smooth(u)),yy=lerp(sy,cy-158,u);z10Star(g,xx,yy,4,'#fff3bd');}}g.restore();
 const face=clamp((a-10)/3,0,1),fy=cy-(painted?163:171),faceX=cx-(painted?56:0);g.save();g.translate(faceX,fy);if(painted){g.scale(.88,.88);z10Glow(g,'#ffe8a4',0,8,49,41,.12+face*.07);}
 // Gentle, mossy eyebrows and a small warm smile; this is a friendly living tree.
 for(let i=0;i<2;i++){const ex=i?29:-29;g.save();g.translate(ex,-8);g.rotate(i?.16:-.16);g.drawImage(A.leaf,-25,-12,50,22);g.restore();g.strokeStyle='#685778';g.lineWidth=3;g.lineCap='round';if(face<.5){g.beginPath();g.moveTo(ex-10,2);g.quadraticCurveTo(ex,10,ex+10,2);g.stroke();}else{z10Ellipse(g,ex,1,8,10*face,'#655575');z10Ellipse(g,ex+2,-3,2.7,3,'#fff5d9');z10Ellipse(g,ex-2,6,1.5,1.5,'#c7acd4');}z10Ellipse(g,ex,i?18:19,13,5,'rgba(222,174,185,.42)');}
 g.strokeStyle='#78617f';g.lineWidth=2.3;g.beginPath();g.moveTo(-13,28);g.quadraticCurveTo(0,30+face*12,14,27);g.stroke();g.restore();
 const fx=cx,flowerY=cy-330;
 // The child's water, seasons and memories return along three distinct ribbons.
 if(a>0&&a<12){for(let i=0;i<9;i++){const u=clamp((a-.8-i*.52)/5.4,0,1);if(u<=0||u>=1)continue;const k=smooth(u),type=i%3,side=type===0?-1:1,sx=cx+side*(220+(i>5?35:0)),sy=cy-90-type*70,xx=lerp(sx,fx,k)+Math.sin(k*Math.PI)*side*45,yy=lerp(sy,flowerY,k)-Math.sin(k*Math.PI)*65;g.save();g.globalAlpha=Math.sin(u*Math.PI)*.9;z10Glow(g,Z10_COL[type],xx,yy,27,27,.4);if(type===0)g.drawImage(A.drop,xx-11,yy-17,22,31);else if(type===1){g.translate(xx,yy);g.rotate(-.5+k*1.8);g.drawImage(A.leaf,-21,-11,42,22);}else z10Bird(g,xx,yy,.65,a,'#fff0ce',-1);g.restore();}}
 // A sleeping seed opens into a many-layered crown with real petal depth.
 for(let layer=0;layer<2;layer++)for(let i=0;i<9;i++){g.save();g.translate(fx,flowerY);g.rotate(i*Math.PI*2/9+layer*.35+Math.sin(live*.28)*.025);g.scale((.1+open*.9)*(layer?.72:1)*(.95+(i%3)*.035),(.3+open*.7)*(layer?.72:1)*(.94+(i%4)*.035));g.drawImage(A.petal,-46,-155,92,158);g.restore();}
 z10Glow(g,'#ffe8a4',fx,flowerY,48+open*78,48+open*78,.4+open*.35);const core=18+open*29;g.drawImage(A.core,fx-core,flowerY-core,core*2,core*2);
 // Three broken clock hands agree at the instant the whole valley resumes.
 for(let i=0;i<3;i++){const ang=-Math.PI/2+i*Math.PI*2/3+(a<12?-a*.12:live*.3),rad=99*(1-open*.7),xx=fx+Math.cos(ang)*rad,yy=flowerY+Math.sin(ang)*rad;z10Star(g,xx,yy,6+open*3,Z10_COL[i]);}
 for(let i=0;i<7;i++){const xx=cx-190+i*63,yy=cy-(i===3?62:i===2||i===4?241:i===1||i===5?190:107);z10Bloom(g,xx,yy,.6,live,open,Z10_COL[i%4]);}
 for(let i=0;i<12;i++){const u=(live*.12+i/12)%1,ang=i*2.4+live*.5,xx=fx+Math.cos(ang)*(35+u*230),yy=flowerY+u*310;g.save();g.translate(xx,yy);g.rotate(ang);g.globalAlpha=Math.sin(u*Math.PI)*.8;g.drawImage(A.leaf,-15,-8,30,16);g.restore();if(i%4===1)z10TimeTrace(g,xx,yy,23,10,ang,live/.8);}
 for(let i=0;i<4;i++){const xx=fx+Math.sin(live*.5+i*1.7)*232,yy=flowerY-5+Math.cos(live*.45+i)*75;z10Glow(g,Z10_COL[i],xx,yy,27,20,.3);z10Bird(g,xx,yy,.85,live+i,Z10_COL[i],Math.cos(live*.5+i*1.7)>0?1:-1);z10TimeTrace(g,xx,yy,40,19,-.2,live/.8);}
 if(a>12){
  const pulse=clamp((a-12)/3,0,1);if(pulse<1){g.save();g.globalAlpha=(1-pulse)*.45;g.strokeStyle='#fff0ca';g.lineWidth=6;g.beginPath();g.ellipse(cx,cy-190,35+pulse*560,28+pulse*370,0,0,Math.PI*2);g.stroke();g.restore();}
  // Water and flowers at the guardian's feet repeat the child's earlier gifts.
  for(let side=-1;side<=1;side+=2){g.save();g.globalAlpha=.45;g.strokeStyle='#b4f5f3';g.lineWidth=4;g.beginPath();g.moveTo(cx+side*115,cy-55);g.quadraticCurveTo(cx+side*190,cy-94,cx+side*218,cy+2);g.stroke();g.restore();for(let j=0;j<3;j++){const u=(live*.7+j/3)%1;z10Ellipse(g,lerp(cx+side*115,cx+side*218,u),cy-55-Math.sin(u*Math.PI)*30+u*57,2.3,5,'#ddffff');}}
 }
}
function z10Draw(o,t){
 const z=o.z;t=o.tip==='zamanTilki'&&o.done?(z.followT||0):z.age;if(o.tip==='zamanTilki'){
  if(o===Z10.fox[0]&&(!o.tk.bitti||z.aktif)){if(z.center>cam.x-650&&z.center<cam.x+VW+650){g.save();z10FoxClearing(o,t);g.restore();}}
  if(o.done&&!V10.sandalAktif){const x=z.fx,y=z.fy-(z.hop||0);if(x<cam.x-130||x>cam.x+VW+130)return;z10Ellipse(g,x,z.fy+1,24,4,'rgba(37,30,62,.16)');z10Fox(g,x,y,.59,t,true,z.order||0,P.f||1,(z.hop||0)/60);}return;
 }
 if(o.x<cam.x-650||o.x>cam.x+VW+650)return;g.save();if(o.tip==='zamanDamla')z10DropDraw(o,t);else if(o.tip==='zamanBahce')z10GardenDraw(o,t);else if(o.tip==='zamanKure')z10BubbleDraw(o,t);else z10TreeDraw(o,t);g.restore();
}
function z10Front(o,t){
 const z=o.z;t=z.age;if(!z.aktif||P.ucus!==o)return;g.save();
 if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,z.celebrate>0||o.tip==='zamanAgaci'&&z.t>10?'sevinc':'ayakta',t);
 if(typeof pirilCizPoz==='function'){const finale=o.tip==='zamanAgaci'&&z.t>12,fly=finale?Math.sin((z.t-12)*.7)*23:0;pirilCizPoz(g,z.pr.x+fly,z.pr.y-(finale?Math.abs(Math.sin((z.t-12)*.7))*40:0),.9,'ucus',t);}
 // Pırıl's light leads to a real target when the child pauses; no teaching hand or text.
 const p=z10Next(o);if(z.idle>8&&p){g.strokeStyle='#ffefbc';g.lineWidth=2;g.globalAlpha=.4+.2*Math.sin(t*3);g.setLineDash(Z10_DASH);g.beginPath();g.moveTo(z.pr.x+20,z.pr.y);g.quadraticCurveTo(z.pr.x+50,z.pr.y-25,p.x,p.y);g.stroke();g.setLineDash(Z10_NO_DASH);}
 g.restore();
}
function z10Point(e){const r=cv.getBoundingClientRect();return{x:cam.x+(e.clientX-r.left)*cv.width/r.width/S,y:cam.y+(e.clientY-r.top)*cv.height/r.height/S};}
function z10Reserved(e){const r=cv.getBoundingClientRect();return e.clientY-r.top<Math.max(88,r.height*.11)&&e.clientX-r.left>r.width-Math.max(150,r.width*.16);}
function z10Hit(o,q){
 const z=o.z;if(z.transition>0||z.end>=0)return null;
 if(o.tip==='zamanTilki'&&z.cloudTarget){const p=z.cloudTarget;if(Math.abs(q.x-p.x)<128&&Math.abs(q.y-p.y)<60)return p;}
 let hit=null,dist=Infinity;const min=34*DPR/Math.max(S,.001);
 for(const p of z.items){if(p.done||(o.tip==='zamanBahce'||o.tip==='zamanKure')&&p.idx!==z.asama)continue;const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<Math.max(p.r,min)&&d<dist){dist=d;hit=p;}}
 return hit;
}
function z10Own(e){e.preventDefault();e.stopPropagation();}
function z10Release(){const ptr=Z10.ptr;Z10.ptr=-1;Z10.held=null;if(ptr>=0)try{cv.releasePointerCapture(ptr);}catch(_){}if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
function z10Gesture(o,p,d,first,q){
 const z=o.z;z.help=false;z.idle=0;z.helpT=0;
 if(o.tip==='zamanTilki'){
  if(q&&!first)z.cloudTo=clamp(q.x,z.center-185,z.center+185);
  const f=p.cloud||p.done?z10Next(o):p;if(!f)return false;
  if(first&&!z.fly)z.cloudTo=f.x;
  return z10Touch(o,f,1);
 }
 if(o.tip==='zamanDamla')return z10Touch(o,p,1);
 if(o.tip==='zamanBahce'){
  let angle=0;if(q&&!first){const a=Math.atan2(Z10.py-p.y,Z10.px-p.x),b=Math.atan2(q.y-p.y,q.x-p.x);angle=Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a)));}
  const step=first?.13:Math.min(.22,Math.max(angle/5,d/700));z.clock+=step*Math.PI*2;z.rewind=Math.min(z.rewind,1.2);
  return z10Touch(o,p,step);
 }
 // The three memories have different controls and visible physical consequences.
 // Taps are a complete fallback; a direction is never a failure condition.
 let amount=first?.14:0;
 if(!first&&q){const dx=q.x-Z10.px,dy=q.y-Z10.py;
  if(p.idx===0){p.cloud=clamp((q.x-o.x)*.38,-40,40);amount=Math.min(.2,(Math.abs(dx)+Math.abs(dy)*.45)/370);}
  else if(p.idx===1)amount=Math.min(.2,(Math.max(0,-dy)+Math.abs(dx)*.25+Math.max(0,dy)*.18)/280);
  else{p.wind=Math.sign(dx)||p.wind;amount=Math.min(.2,(Math.abs(dx)+Math.abs(dy)*.3)/360);}
 }
 return z10Touch(o,p,amount);
}
// Segment intersection catches every real water target crossed by sparse tablet events.
function z10Sweep(o,q,d){
 if(d<1||d>900)return;
 if(o.tip==='zamanTilki'){const p=Z10.held||o.z.cloudTarget;z10Gesture(o,p,d,false,q);return;}
 if(o.tip==='zamanBahce'||o.tip==='zamanKure'){const p=z10Next(o);if(p&&!p.done&&o.z.transition<=0&&Math.hypot(q.x-p.x,q.y-p.y)<p.r+35)z10Gesture(o,p,Math.min(d,p.r),false,q);return;}
 const ax=Z10.px,ay=Z10.py,bx=q.x,by=q.y,dx=bx-ax,dy=by-ay,ll=dx*dx+dy*dy;
 for(const p of o.z.items){if(p.done)continue;const u=clamp(((p.x-ax)*dx+(p.y-ay)*dy)/ll,0,1),rr=Math.max(p.r,34*DPR/Math.max(S,.001));
  if(Math.hypot(p.x-(ax+u*dx),p.y-(ay+u*dy))<rr){Z10.held=p;z10Gesture(o,p,Math.min(d,rr*2),false,q);}
 }
}
function z10Take(o,p,q,e){
 // The old walking touch may still be captured by the canvas. Release its motion
 // intent, then adopt that same browser pointer only once it meets a real target.
 if(typeof omHepsiniBirak==='function')omHepsiniBirak();
 z10Own(e);Z10.ptr=e.pointerId;Z10.px=q.x;Z10.py=q.y;Z10.held=p;
 try{cv.setPointerCapture(e.pointerId);}catch(_){}
 z10Gesture(o,p,0,true,q);
}
addEventListener('pointerdown',e=>{
 if(BOLUM_NO!==10||DURUM!=='oyun'||e.target!==cv||e.pointerType==='mouse'&&e.button!==0||z10Reserved(e)||Z10.ptr>=0)return;
 const q=z10Point(e),o=ZAMAN10.aktif;
 if(o&&o.tip!=='zamanAgaci'){const p=z10Hit(o,q);if(!p)return;z10Take(o,p,q,e);}
 else if(!o){const leader=Z10.fox[0];if(leader&&!leader.tk.bitti&&Math.abs(P.x-leader.z.center)<430){for(const f of Z10.fox)if(!f.done&&Math.hypot(q.x-f.z.anchorX,q.y-f.z.anchorY)<65){if(z10Start(leader)){const p=z10Hit(leader,q);if(p)z10Take(leader,p,q,e);}break;}}}
},true);
addEventListener('pointermove',e=>{
  const o=ZAMAN10.aktif;
 if(Z10.ptr<0){
  // No full-screen gesture capture: an already-held finger becomes an activity
  // gesture only at its first actual target hit. Hover and the home corner pass.
  if(BOLUM_NO!==10||DURUM!=='oyun'||!o||o.tip==='zamanAgaci'||e.target!==cv||!(e.buttons&1)||z10Reserved(e))return;
  const q=z10Point(e),p=z10Hit(o,q);if(p)z10Take(o,p,q,e);return;
 }
 if(e.pointerId!==Z10.ptr)return;
 z10Own(e);if(!o||DURUM!=='oyun'){z10Release();return;}
 const q=z10Point(e),d=Math.hypot(q.x-Z10.px,q.y-Z10.py);z10Sweep(o,q,d);Z10.px=q.x;Z10.py=q.y;
},true);
addEventListener('pointerup',e=>{if(e.pointerId!==Z10.ptr)return;z10Own(e);const o=ZAMAN10.aktif;if(o&&DURUM==='oyun'){const q=z10Point(e),d=Math.hypot(q.x-Z10.px,q.y-Z10.py);z10Sweep(o,q,d);}z10Release();},true);
addEventListener('pointercancel',e=>{if(e.pointerId===Z10.ptr){z10Own(e);z10Release();}},true);
cv.addEventListener('lostpointercapture',e=>{if(e.pointerId===Z10.ptr)z10Release();});
// A new viewport invalidates the previous world-space pointer sample; keep earned progress.
addEventListener('resize',z10Release);addEventListener('orientationchange',z10Release);
addEventListener('blur',z10Release);addEventListener('pagehide',z10Release);document.addEventListener('visibilitychange',()=>{if(document.hidden)z10Release();});
OLAY.on('durum',d=>{if(d!=='oyun')z10Release();});
addEventListener('keydown',e=>{const o=ZAMAN10.aktif;if(!o||DURUM!=='oyun'||e.repeat||!['Space','Enter','KeyE'].includes(e.code)||e.target&&/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName))return;const p=z10Next(o);if(p&&o.tip!=='zamanAgaci'){z10Own(e);z10Gesture(o,p,0,true);}},true);
for(const tip of Z10_TYPES)TUR.kaydet(tip,{kur:z10Setup,guncelle:z10Step,ciz:z10Draw,cizOn:z10Front});
