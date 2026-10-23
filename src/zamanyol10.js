/* Ay sandalı: üç donmuş anın içinden geçen, dokunarak zamanı açan güvenli yolculuk.
   Bölüm 10'a özeldir. Sabit sanat önbelleği; fizik saati; okuma, ceza ve hassas nişan yok. */
'use strict';
const ZY10={o:null,art:null,ptr:-1,colors:['#bcf5f1','#ffdd91','#e2bdff']};
const ZAMAN_YOL={
 get aktif(){return !!ZY10.o&&P.ucus===ZY10.o;},
 get an(){return ZY10.o?ZY10.o.zy.t:0;},
 get ilerleme(){return ZY10.o?ZY10.o.zy.u:0;},
 get konum(){return ZY10.o?ZY10.o.zy.pos:null;},
 get asama(){return V10.sandalAsama||0;},
 hedef(){return ZY10.o&&!ZY10.o.done?ZY10.o:null;},
 kameraKutu(){return ZY10.o?ZY10.o.zy.box:null;},
 hedefPiril(){return ZY10.o?ZY10.o.zy.pr:null;},
 isit(){zy10Art();return true;}
};window.ZAMAN_YOL=ZAMAN_YOL;
function zy10Oval(c,x,y,rx,ry,col,a){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),a||0,0,Math.PI*2);c.fill();}
function zy10Path(c,fn,fill,stroke,w){c.beginPath();fn(c);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=w||2;c.stroke();}}
function zy10Sprite(w,h,paint){const a=document.createElement('canvas');a.width=w*2;a.height=h*2;const c=a.getContext('2d');c.scale(2,2);paint(c);return a;}
function zy10Glow(c,x,y,rx,ry,col,a){if(a<.005)return;const old=c.globalAlpha;c.globalAlpha=old*a;c.drawImage(glow(col),x-rx,y-ry,rx*2,ry*2);c.globalAlpha=old;}
function zy10Sfx(k,v){if(typeof AU!=='undefined'&&AU.sfx)AU.sfx(k,v);}
// All pigment washes, feather shading and grain are prepared once; live drawing only composes sprites.
function zy10Leaf(c,x,y,s,r,col){c.save();c.translate(x,y);c.rotate(r);c.scale(s,s);zy10Path(c,q=>{q.moveTo(0,0);q.bezierCurveTo(-17,-9,-20,-32,-3,-49);q.bezierCurveTo(13,-33,18,-11,0,0);},col);c.strokeStyle='rgba(244,246,203,.3)';c.lineWidth=1.2;c.beginPath();c.moveTo(0,-2);c.quadraticCurveTo(-4,-25,-3,-43);c.stroke();c.restore();}
function zy10Island(c,kind){
 const rock=['#5f7886','#7c777e','#737b94'][kind],moss=['#a5cbb7','#cfcea8','#bad3bc'][kind];
 const gr=c.createLinearGradient(50,45,220,185);gr.addColorStop(0,'#a5b6b0');gr.addColorStop(.28,rock);gr.addColorStop(.75,'#4b536e');gr.addColorStop(1,'#343d5a');
 const outline=q=>{q.moveTo(10,57);q.bezierCurveTo(22,40,51,33,78,35);q.bezierCurveTo(114,19,143,32,177,27);q.bezierCurveTo(220,23,237,41,274,36);q.bezierCurveTo(306,34,339,42,340,61);q.bezierCurveTo(334,89,314,91,302,110);q.bezierCurveTo(293,127,280,134,265,130);q.bezierCurveTo(248,145,233,146,219,139);q.bezierCurveTo(210,154,189,170,177,169);q.bezierCurveTo(153,166,150,142,132,145);q.bezierCurveTo(115,153,92,132,85,123);q.bezierCurveTo(58,125,54,99,37,92);q.bezierCurveTo(21,86,13,73,10,57);};
 zy10Path(c,outline,gr);c.save();c.beginPath();outline(c);c.clip();
 for(let i=0;i<15;i++){const x=13+i*23,y=66+Math.sin(i*1.7)*7;zy10Path(c,q=>{q.moveTo(x,y);q.bezierCurveTo(x-7,y+25,x+13,y+46,x-2,y+82);},null,i%3?'rgba(186,196,180,.12)':'rgba(37,49,78,.3)',3+i%3*2);}
 for(let i=0;i<110;i++){const x=15+(Math.sin(i*51.73)*.5+.5)*321,y=52+(Math.sin(i*32.29+8)*.5+.5)*115;zy10Oval(c,x,y,1.5+i%3,1+i%2,i%3?'rgba(224,230,201,.11)':'rgba(30,51,75,.13)',i);}
 c.restore();
 const top=c.createLinearGradient(0,17,0,83);top.addColorStop(0,'#e1e5c1');top.addColorStop(.45,moss);top.addColorStop(1,'#598b83');
 zy10Path(c,q=>{q.moveTo(12,56);q.bezierCurveTo(27,42,39,39,62,42);q.bezierCurveTo(95,14,127,29,151,26);q.bezierCurveTo(187,13,216,28,236,31);q.bezierCurveTo(267,24,282,37,306,39);q.bezierCurveTo(325,41,339,49,338,58);q.bezierCurveTo(324,70,304,66,283,75);q.bezierCurveTo(246,69,215,86,186,77);q.bezierCurveTo(158,87,137,75,115,79);q.bezierCurveTo(88,76,66,74,48,65);q.bezierCurveTo(34,69,18,65,12,56);},top);
 for(let i=0;i<28;i++){const x=28+i*11,y=48+Math.sin(i*.71)*15;zy10Path(c,q=>{q.moveTo(x-8,y+4);q.quadraticCurveTo(x-9,y-3,x-5,y-9);q.quadraticCurveTo(x-3,y-3,x-2,y+1);q.quadraticCurveTo(x,y-10,x+5,y-12);},null,i%2?'#c9dcb5':'#8ab49b',1.2);}
 for(let k=0;k<5;k++){const x=43+k*61,y=67+Math.sin(k*2)*4;zy10Path(c,q=>{q.moveTo(x,y);q.bezierCurveTo(x-13,y+21,x+9,y+49,x-7,y+67);},null,k%2?'#98b69a':'#658f87',2.4);for(let j=0;j<3;j++)zy10Leaf(c,x-3+j%2*4,y+15+j*14,.25,(j%2?1:-1)*.8,k%2?'#afc6a2':'#8bbaa6');}
 for(let k=0;k<8;k++){const x=43+k*37,y=47+Math.sin(k*2.4)*13;zy10Oval(c,x,y,6,3,'rgba(73,117,105,.25)');zy10Oval(c,x-1,y-2,4,3,kind===1?'#d8cba3':'#c9ddc1',-.2);}
}
function zy10Art(){
 if(ZY10.art)return ZY10.art;const A=ZY10.art={};
 A.hull=zy10Sprite(284,124,c=>{
  const gr=c.createLinearGradient(33,30,199,120);gr.addColorStop(0,'#fbe3aa');gr.addColorStop(.22,'#d8ad73');gr.addColorStop(.52,'#ad794f');gr.addColorStop(.78,'#744f48');gr.addColorStop(1,'#473c51');
  const hull=q=>{q.moveTo(8,14);q.bezierCurveTo(49,65,220,74,275,6);q.bezierCurveTo(267,57,229,107,149,117);q.bezierCurveTo(79,122,23,79,8,14);};zy10Path(c,hull,gr,'#e7bf88',1.3);
  c.save();c.beginPath();hull(c);c.clip();
  for(let j=0;j<6;j++){const y=35+j*13;c.strokeStyle=j%2?'#805b49':'#e8bd80';c.lineWidth=j%2?1.2:1.8;c.beginPath();c.moveTo(5,y);c.bezierCurveTo(85,y+43,192,y+43,282,y-6);c.stroke();}
  for(let i=0;i<55;i++){const x=21+(i*37)%249,y=38+(i*23)%78;zy10Path(c,q=>{q.moveTo(x,y);q.bezierCurveTo(x+12,y+5,x+20,y+7,x+29,y+2);},null,i%3?'rgba(250,214,157,.16)':'rgba(77,54,48,.23)',.65);}
  for(const [x,y] of [[53,69],[206,72]]){for(let j=0;j<3;j++){c.strokeStyle='rgba(102,66,48,.32)';c.lineWidth=.8;c.beginPath();c.ellipse(x,y,6+j*4,2+j*1.7,-.18,0,Math.PI*2);c.stroke();}}
  c.restore();
  zy10Path(c,q=>{q.moveTo(11,16);q.bezierCurveTo(64,83,221,79,272,9);},null,'#715044',7);zy10Path(c,q=>{q.moveTo(11,14);q.bezierCurveTo(64,80,221,76,272,7);},null,'#ffedbd',4.5);
  for(const side of [-1,1]){c.save();c.translate(side<0?20:262,side<0?27:21);c.scale(side,1);zy10Path(c,q=>{q.moveTo(-4,1);q.bezierCurveTo(15,-13,24,4,13,12);q.bezierCurveTo(8,15,4,11,7,7);},null,'#f4d49a',2);c.restore();}
  for(let i=0;i<9;i++){const x=52+i*22,y=82+Math.sin(i/8*Math.PI)*20;c.save();c.translate(x,y);c.rotate(-.35+i*.09);zy10Leaf(c,0,5,.25,.8,'#e8c28d');c.restore();}
  zy10Oval(c,143,95,18.5,18.5,'#543f4c');zy10Oval(c,143,94,16,16,'#d9b579');zy10Oval(c,143,94,12.5,12.5,'#78aaa8');zy10Oval(c,140,90,7,6,'#c2dfcb');
  c.strokeStyle='#f7e3a8';c.lineWidth=1.6;c.beginPath();c.moveTo(143,85);c.lineTo(143,94);c.lineTo(150,98);c.stroke();zy10Oval(c,143,94,2,2,'#fff3c3');
  for(const x of [43,244]){zy10Oval(c,x,67,3,3,'#644b46');zy10Oval(c,x-.7,66,1.7,1.7,'#ffe1a0');}
 });
 A.sail=zy10Sprite(194,254,c=>{
  const sail=q=>{q.moveTo(70,12);q.bezierCurveTo(118,21,159,12,180,5);q.bezierCurveTo(174,65,100,94,99,119);q.bezierCurveTo(97,143,150,170,176,215);q.quadraticCurveTo(97,240,20,213);q.bezierCurveTo(31,169,92,147,91,121);q.bezierCurveTo(90,96,27,74,16,34);q.quadraticCurveTo(43,35,70,12);};
  const gr=c.createLinearGradient(8,27,171,214);gr.addColorStop(0,'#f8e8de');gr.addColorStop(.2,'#d1e6d9');gr.addColorStop(.45,'#77b5b7');gr.addColorStop(.63,'#c6e4d8');gr.addColorStop(.84,'#8fbdb5');gr.addColorStop(1,'#e4e7c3');zy10Path(c,sail,gr,'#f3e3be',2.4);
  c.save();c.beginPath();sail(c);c.clip();
  for(let i=0;i<16;i++){const x=13+i*12;zy10Path(c,q=>{q.moveTo(x,20);q.bezierCurveTo(x+16,57,96,103,96,122);q.bezierCurveTo(95,158,x+11,188,x,225);},null,i%3?'rgba(255,251,224,.24)':'rgba(48,107,114,.15)',i%3?1:4);}
  for(let j=0;j<41;j++){const y=8+j*5.6;zy10Path(c,q=>{q.moveTo(7,y);q.quadraticCurveTo(96,y+9,185,y-2);},null,'rgba(245,247,226,.12)',.6);}
  zy10Path(c,q=>{q.moveTo(46,50);q.quadraticCurveTo(104,66,155,36);q.quadraticCurveTo(133,69,98,110);q.quadraticCurveTo(70,81,46,50);},'#f5d99b');
  zy10Path(c,q=>{q.moveTo(50,204);q.quadraticCurveTo(84,194,98,171);q.quadraticCurveTo(116,193,151,207);q.quadraticCurveTo(100,219,50,204);},'#eaca8c');
  for(let i=0;i<26;i++){const x=55+(i*23)%93,y=54+(i*13)%21;zy10Oval(c,x,y,1.1,1,'rgba(255,246,198,.65)');}
  c.restore();c.setLineDash([3,5]);zy10Path(c,sail,null,'rgba(255,249,215,.7)',1);c.setLineDash([]);
  zy10Path(c,q=>{q.moveTo(23,218);q.quadraticCurveTo(98,238,176,216);},null,'#c6a375',3);
 });
 A.islands=[0,1,2].map(k=>zy10Sprite(350,192,c=>zy10Island(c,k)));A.island=A.islands[0];
 A.arch=zy10Sprite(460,240,c=>{
  const stone=q=>{q.moveTo(66,229);q.bezierCurveTo(45,228,41,209,47,191);q.bezierCurveTo(35,172,45,151,44,133);q.bezierCurveTo(38,115,54,105,59,91);q.bezierCurveTo(56,71,81,62,91,48);q.bezierCurveTo(111,29,129,32,148,24);q.bezierCurveTo(169,11,190,19,209,13);q.bezierCurveTo(234,7,246,16,263,14);q.bezierCurveTo(291,8,309,26,328,29);q.bezierCurveTo(351,27,365,52,378,63);q.bezierCurveTo(399,71,405,95,409,111);q.bezierCurveTo(422,127,419,150,420,169);q.bezierCurveTo(429,193,417,223,401,231);q.bezierCurveTo(386,237,372,226,379,209);q.bezierCurveTo(390,159,369,113,340,86);q.bezierCurveTo(312,58,276,47,236,49);q.bezierCurveTo(195,46,153,55,126,83);q.bezierCurveTo(96,112,81,156,92,198);q.bezierCurveTo(98,218,85,233,66,229);};
  const gr=c.createLinearGradient(60,20,374,220);gr.addColorStop(0,'#d8d5b7');gr.addColorStop(.3,'#b2b9a4');gr.addColorStop(.65,'#8c9c93');gr.addColorStop(1,'#677e84');zy10Path(c,stone,gr,'#6f898b',1.4);
  c.save();c.beginPath();stone(c);c.clip();
  for(let k=0;k<26;k++){const an=Math.PI+(k/25)*Math.PI,x=231+174*Math.cos(an),y=185+155*Math.sin(an);zy10Path(c,q=>{q.moveTo(x-10,y-17);q.bezierCurveTo(x+4,y-9,x-5,y+4,x+5,y+15);q.lineTo(x+15,y+20);},null,k%3?'rgba(78,103,103,.27)':'rgba(240,237,205,.38)',1.2+k%3*.5);}
  for(let i=0;i<220;i++){const x=41+(i*47)%383,y=11+(i*73)%221;zy10Oval(c,x,y,1+i%3,.8+i%2,i%2?'rgba(245,236,195,.23)':'rgba(70,104,103,.19)',i);}
  c.restore();
  zy10Path(c,q=>{q.moveTo(52,185);q.bezierCurveTo(43,146,66,91,96,64);q.bezierCurveTo(129,32,164,34,204,23);q.bezierCurveTo(242,15,282,29,305,33);},null,'rgba(238,234,198,.7)',3);
  for(const side of [-1,1]){const x=230+side*160;zy10Path(c,q=>{q.moveTo(x,215);q.bezierCurveTo(x-side*22,154,x+side*30,118,x-side*4,70);},null,'#718f83',3);for(let j=0;j<7;j++)zy10Leaf(c,x+Math.sin(j)*7,200-j*18,.35,side*(.7+j%2*.35),j%2?'#bfd0ab':'#9cbaa2');}
  for(let i=0;i<13;i++){const x=130+i*15,y=37-Math.sin(i/12*Math.PI)*16;zy10Leaf(c,x,y,.22,(i-6)*.12,'#c3d3b1');}
 });
 A.pool=zy10Sprite(230,59,c=>{const gr=c.createRadialGradient(112,25,3,112,26,101);gr.addColorStop(0,'#fff0be');gr.addColorStop(.4,'#e9cd8b');gr.addColorStop(1,'rgba(151,139,111,0)');zy10Oval(c,115,28,111,25,gr);for(let i=0;i<70;i++){const x=22+(i*37)%185,y=15+(i*23)%28;zy10Oval(c,x,y,1+i%2,.7,i%3?'rgba(255,241,184,.7)':'rgba(164,141,92,.35)');}});
 A.reed=zy10Sprite(150,177,c=>{c.lineCap='round';zy10Path(c,q=>{q.moveTo(103,171);q.bezierCurveTo(71,116,102,67,81,16);},null,'#628f86',5);zy10Path(c,q=>{q.moveTo(101,171);q.bezierCurveTo(70,116,101,67,80,16);},null,'#c4d9ad',1.5);zy10Leaf(c,90,112,1.25,-.8,'#a4cfb5');zy10Leaf(c,94,78,1.08,.8,'#86bca8');zy10Leaf(c,85,36,.7,-.1,'#cfdfbc');});
 A.petal=[0,1,2].map(k=>zy10Sprite(128,208,c=>{const gr=c.createLinearGradient(46,16,78,201);gr.addColorStop(0,['#fbedd8','#e0ebe3','#eaddef'][k]);gr.addColorStop(.4,['#eed8d0','#bddbcf','#d5bddd'][k]);gr.addColorStop(1,['#c295a8','#80b2ac','#a68cb9'][k]);zy10Path(c,q=>{q.moveTo(64,201);q.bezierCurveTo(38,178,17,131,26,85);q.bezierCurveTo(31,50,49,20,59,8);q.bezierCurveTo(70,17,72,29,83,43);q.bezierCurveTo(118,91,113,158,64,201);},gr,'rgba(255,243,213,.75)',1.5);for(let i=0;i<7;i++){const y=53+i*20;zy10Path(c,q=>{q.moveTo(64,201);q.quadraticCurveTo(55,y+30,37+i*1.2,y);q.moveTo(64,201);q.quadraticCurveTo(76,y+24,91-i*.8,y+3);},null,'rgba(255,250,230,.24)',1.2);}zy10Path(c,q=>{q.moveTo(64,194);q.bezierCurveTo(65,130,54,74,59,20);},null,'rgba(255,249,223,.5)',2);}));
 A.flowerCore=zy10Sprite(96,96,c=>{const gr=c.createRadialGradient(35,29,2,48,48,43);gr.addColorStop(0,'#fff4c8');gr.addColorStop(.45,'#f3d49a');gr.addColorStop(1,'#b98d68');zy10Oval(c,48,48,41,38,gr);for(let i=0;i<65;i++){const a=i*2.39996,r=Math.sqrt(i)*4.1;zy10Oval(c,48+Math.cos(a)*r,48+Math.sin(a)*r,2.8,2.4,i%3?'#edc780':'#fff0b6',a);}});
 A.birdBody=zy10Sprite(110,70,c=>{
  zy10Path(c,q=>{q.moveTo(40,40);q.bezierCurveTo(24,37,14,44,6,42);q.quadraticCurveTo(13,51,24,53);q.quadraticCurveTo(15,57,9,59);q.bezierCurveTo(32,64,41,51,47,48);},'#8caeae','#d4e1ce',.7);
  const gr=c.createLinearGradient(40,23,69,58);gr.addColorStop(0,'#c8dbcf');gr.addColorStop(.45,'#e9e7d2');gr.addColorStop(.8,'#f4d6b9');gr.addColorStop(1,'#c69d9c');
  zy10Path(c,q=>{q.moveTo(27,41);q.bezierCurveTo(34,28,52,28,62,22);q.bezierCurveTo(63,10,79,8,86,16);q.bezierCurveTo(91,21,90,28,85,33);q.bezierCurveTo(80,39,74,49,62,53);q.bezierCurveTo(49,59,32,53,27,41);},gr);
  zy10Path(c,q=>{q.moveTo(64,24);q.bezierCurveTo(62,11,76,9,83,14);q.quadraticCurveTo(90,17,87,25);q.quadraticCurveTo(76,20,64,24);},'#76a5aa');
  zy10Path(c,q=>{q.moveTo(87,24);q.quadraticCurveTo(94,23,101,28);q.quadraticCurveTo(94,31,86,29);},'#c18e5d');
  zy10Oval(c,81,23,2.9,3.2,'#435466');zy10Oval(c,81.7,22.1,.95,1.1,'#fff9e6');zy10Oval(c,77,31,3.4,2,'rgba(226,151,145,.45)');
  for(let i=0;i<7;i++){const x=37+i*4.4;zy10Path(c,q=>{q.moveTo(x,42);q.quadraticCurveTo(x+3,47,x+1,49);},null,'rgba(255,250,227,.38)',1);}
 });
 A.birdWing=zy10Sprite(94,88,c=>{
  const gr=c.createLinearGradient(77,79,19,14);gr.addColorStop(0,'#8daeb4');gr.addColorStop(.4,'#bdd8d0');gr.addColorStop(1,'#fff2d9');
  zy10Path(c,q=>{q.moveTo(78,78);q.bezierCurveTo(56,72,23,51,11,27);q.quadraticCurveTo(4,11,10,10);q.quadraticCurveTo(18,14,22,21);q.quadraticCurveTo(14,3,21,5);q.quadraticCurveTo(30,10,36,21);q.quadraticCurveTo(29,1,37,5);q.quadraticCurveTo(44,11,48,24);q.quadraticCurveTo(45,7,52,14);q.bezierCurveTo(69,34,77,50,78,78);},gr,'rgba(246,243,219,.6)',1);
  for(let i=0;i<5;i++){zy10Path(c,q=>{q.moveTo(76,76);q.bezierCurveTo(51+i*3,57,23+i*8,31,12+i*10,14+i%2*4);},null,'rgba(114,155,166,.25)',1.3);}
 });
 A.bell=zy10Sprite(124,142,c=>{
  const gr=c.createLinearGradient(17,20,99,120);gr.addColorStop(0,'#fff7d0');gr.addColorStop(.4,'#e7be70');gr.addColorStop(.7,'#a76c45');gr.addColorStop(1,'#f0d198');
  zy10Oval(c,62,19,14,15,'#d9be83');zy10Oval(c,62,19,7,9,'#4b536b');
  zy10Path(c,q=>{q.moveTo(31,99);q.bezierCurveTo(37,81,28,38,62,35);q.bezierCurveTo(96,38,87,81,94,99);q.lineTo(110,114);q.quadraticCurveTo(64,134,14,114);q.closePath();},gr,'#fff0b6',2.5);
  zy10Oval(c,62,115,47,10,'#5b4b55');zy10Oval(c,62,117,15,12,'#f1d38c');
  c.strokeStyle='#fff0c9';c.lineWidth=2;c.beginPath();c.moveTo(46,49);c.quadraticCurveTo(35,66,39,91);c.moveTo(32,99);c.quadraticCurveTo(62,108,93,99);c.stroke();
  zy10Oval(c,63,75,12,14,'#659d9e');zy10Oval(c,63,74,7,9,'#d5f5d8');
 });
 A.lantern=zy10Sprite(48,74,c=>{
  c.strokeStyle='#b58a62';c.lineWidth=2.4;c.beginPath();c.ellipse(24,10,8,8,0,0,Math.PI*2);c.stroke();c.strokeStyle='#f4d4a1';c.lineWidth=.8;c.stroke();
  const gr=c.createLinearGradient(8,23,39,57);gr.addColorStop(0,'#89b5ab');gr.addColorStop(.35,'#eaf0c9');gr.addColorStop(.5,'#fff5cf');gr.addColorStop(1,'#9bbca9');
  zy10Path(c,q=>{q.moveTo(12,25);q.quadraticCurveTo(24,21,35,25);q.lineTo(39,53);q.quadraticCurveTo(35,62,24,66);q.quadraticCurveTo(13,62,9,53);q.closePath();},gr,'#b08c64',2);
  zy10Path(c,q=>{q.moveTo(9,24);q.quadraticCurveTo(12,18,24,17);q.quadraticCurveTo(36,18,39,24);q.quadraticCurveTo(24,28,9,24);},'#bf9468','#efd1a0',1);
  zy10Oval(c,24,43,6,14,'#fff5c5');zy10Oval(c,23,41,2.5,9,'#fffceb');c.strokeStyle='#b18e6b';c.lineWidth=1.2;c.beginPath();c.moveTo(13,26);c.lineTo(16,53);c.lineTo(24,65);c.lineTo(32,53);c.lineTo(35,26);c.stroke();
  zy10Path(c,q=>{q.moveTo(11,53);q.quadraticCurveTo(24,59,38,53);},null,'#edc994',2);zy10Oval(c,24,67,4,2,'#b18763');
 });
 return A;
}
function zy10Setup(o){
 const x=o.x,y=o.y;o.zy={x0:x,y0:y,x1:o.varisX||x+1800,y1:o.varisY||y,t:0,u:0,idle:0,phase:'bekle',phaseT:0,pos:{x,y:y-18},pr:{x:x+90,y:y-100},box:{x0:x-180,y0:y-330,x1:x+260,y1:y+50},pentry:{x,y},moveY:0,tilt:0,celebrate:0,finished:false,firstHint:false,
 bells:[.22,.51,.79].map((u,i)=>({u,x:x+((o.varisX||x+1800)-x)*u,y:y-[350,410,340][i],r:70,done:false,t:0,flow:0})),focus:null};
 const z=o.zy;z.focus=()=>omDkEkle(z.box.x0,z.box.y0,z.box.x1,z.box.y1);o.adim=dt=>zy10Ride(o,dt);o.tk={bitti:false};ZY10.o=o;
}
function zy10Start(o){
 if(o.done||P.ucus||DURUM!=='oyun'||P.fade>0||!P.ground||V10.kure<3)return;
 const z=o.zy;zy10Art();z.phase='binis';z.phaseT=0;z.pentry.x=P.x;z.pentry.y=P.y;P.ucus=o;P.vx=P.vy=P.buf=P.kilit=0;P.f=1;V10.sandalAktif=true;
 zy10Release();const gate=NESNELER.find(n=>n.tip==='miniKapi'&&n.bagId===o.id);if(gate){gate.acik=true;gate.acT=0;}OLAY.emit('z_sandalBasla',{o});zy10Sfx('z_sandal');
}
function zy10Bell(o,i,helper){
 const z=o.zy,b=z.bells[i];if(!ZAMAN_YOL.aktif||!b||b.done||i!==(V10.sandalAsama||0)||Math.abs(z.pos.x-b.x)>420||z.phase!=='ucus')return false;
 b.done=true;b.t=0;z.idle=0;z.celebrate=2.3;V10.sandalAsama=i+1;zy10Sfx('z_yildiz',i);OLAY.emit('z_sandalAdim',{o,n:i+1,helper:!!helper});
 if(typeof dn10IsikEkle==='function')dn10IsikEkle(b.x,b.y,ZY10.colors[i],1100);
 burst(b.x,b.y,24,ZY10.colors,90,1.5,6);
 if(i===1){OLAY.emit('z_sandalDoruk',{o});zy10Sfx('z_sandal_doruk');}
 return true;
}
function zy10Finish(o){
 const z=o.zy;if(z.finished)return;z.finished=true;z.phase='bitti';o.done=o.tk.bitti=true;V10.sandal=true;V10.sandalAktif=false;zy10Release();
 P.ucus=null;P.x=z.x1;P.y=z.y1;P.vx=P.vy=P.buf=P.kilit=P.fade=0;P.ground=P.dj=true;P.safeX=P.x;P.safeY=P.y;D.x=P.x-65;D.y=P.y-95;D.vx=D.vy=0;
 z.pos.x=z.x1;z.pos.y=z.y1-18;o.x=z.x1;o.y=z.y1;zy10Sfx('z_sandal_inis');OLAY.emit('z_sandalBitti',{o});omDikkat('zamanSandal',.1,z.focus,1,.48);
}
function zy10Ride(o,dt){
 if(!(dt>0)||!Number.isFinite(dt)||P.ucus!==o||DURUM!=='oyun')return;
 const z=o.zy;z.t+=dt;z.phaseT+=dt;z.celebrate=Math.max(0,z.celebrate-dt);
 if(z.phase==='binis'){
  const u=smooth(clamp(z.phaseT/2,0,1));P.x=lerp(z.pentry.x,z.x0-18,u);P.y=lerp(z.pentry.y,z.y0-45,u)-Math.sin(u*Math.PI)*75;
  if(z.phaseT>=2){z.phase='ucus';z.phaseT=0;}
 }else if(z.phase==='ucus'){
  z.idle+=dt;const next=z.bells.find(b=>!b.done);let stop=next?next.u-.075:1;
  z.u=Math.min(stop,z.u+dt/33);const xx=lerp(z.x0,z.x1,z.u),baseY=lerp(z.y0,z.y1,z.u)-24-205*Math.sin(z.u*Math.PI);
  const input=typeof OM_UCUS_GIRDI!=='undefined'?OM_UCUS_GIRDI:null;let steer=0;
  if(input){if(input.basili&&Number.isFinite(input.hedefY))steer=clamp((input.hedefY-baseY)*.4,-44,44);else steer=(input.eksenY||0)*36;}
  z.moveY+=(steer-z.moveY)*(1-Math.exp(-dt*2));const yy=baseY+z.moveY*Math.sin(z.u*Math.PI)+Math.sin(z.t*1.9)*3;
  z.tilt+=(clamp((yy-z.pos.y)*.02,-.10,.10)-z.tilt)*(1-Math.exp(-dt*3));z.pos.x=xx;z.pos.y=yy;
  if(!z.firstHint&&next&&Math.abs(next.x-xx)<300){z.firstHint=true;OLAY.emit('z_sandalIlkCan',{o});}
  P.x=xx-18;P.y=yy-25;
  if(next&&z.u>=stop-.002&&z.idle>16)zy10Bell(o,z.bells.indexOf(next),true);
  if(z.u>=1){z.phase='inis';z.phaseT=0;}
 }else if(z.phase==='inis'){
  const u=smooth(clamp(z.phaseT/2.4,0,1));P.x=lerp(z.pos.x-18,z.x1,u);P.y=lerp(z.pos.y-25,z.y1,u)-Math.sin(u*Math.PI)*55;
  if(z.phaseT>=2.4){zy10Finish(o);return;}
 }
 P.vx=P.vy=P.buf=0;P.ground=true;P.f=1;o.x=z.pos.x;o.y=z.pos.y;
 const next=z.bells.find(b=>!b.done),help=next&&z.idle>10&&Math.abs(next.x-z.pos.x)<370;
 const px=help?next.x-75:z.pos.x+82,py=help?next.y-25:z.pos.y-82;
 z.pr.x+=(px-z.pr.x)*(1-Math.exp(-dt*3));z.pr.y+=(py-z.pr.y)*(1-Math.exp(-dt*3));
 const b=z.box;b.x0=z.pos.x-190;b.x1=z.pos.x+220;b.y0=z.pos.y-290;b.y1=Math.max(z.pos.y+78,P.y+35);
 if(next&&Math.abs(next.x-z.pos.x)<360){b.x1=Math.max(b.x1,next.x+105);b.y0=Math.min(b.y0,next.y-145);}
 omDikkat('zamanSandal',1.5,z.focus,1,.44);
}
function zy10Step(o,dt){
 if(!(dt>0)||DURUM!=='oyun')return;const z=o.zy;
 for(const b of z.bells)if(b.done){b.t+=dt;b.flow+=(1-b.flow)*(1-Math.exp(-dt*1.5));}
 if(z.phase==='bekle'&&!P.ucus&&Math.abs(P.x-z.x0)<220&&Math.abs(P.y-z.y0)<90)zy10Start(o);
}
function zy10Bird(c,x,y,tm,scale,col){
 const A=zy10Art(),wing=Math.sin(tm*5.4);c.save();c.translate(x,y);c.scale(scale,scale);
 c.save();c.translate(-1,2);c.rotate(.24+wing*.47);c.globalAlpha*=.72;c.scale(.79,.80);c.drawImage(A.birdWing,-76,-76,94,88);c.restore();
 c.drawImage(A.birdBody,-51,-34,110,70);
 c.save();c.translate(-4,7);c.rotate(-.19-wing*.40);c.scale(1,.88+wing*.09);c.drawImage(A.birdWing,-76,-76,94,88);c.restore();c.restore();
}
// The bell wave reaches each suspended subject before its own time can resume.
// A continuous time integral avoids a pose/position jump on the first awake frame.
function zy10SubjectTime(b,x,y,originY){
 if(!b.done)return 0;const t=Math.max(0,b.t-Math.hypot(x,y-originY)/260);
 return t-.28*(1-Math.exp(-t/.28));
}
function zy10StillTrace(c,x,y,scale,fade,angle){
 if(fade<.005)return;c.save();c.translate(x,y);c.rotate(angle||0);c.scale(scale,scale);
 c.globalAlpha*=fade*.52;c.strokeStyle='#fff0c8';c.lineWidth=1.7;c.lineCap='round';
 c.beginPath();c.moveTo(-64,11);c.quadraticCurveTo(-50,4,-35,10);c.moveTo(-32,11);c.lineTo(-27,13);
 c.moveTo(-57,22);c.quadraticCurveTo(-45,15,-31,23);c.moveTo(-45,-3);c.lineTo(-34,-2);c.stroke();c.restore();
}
function zy10Moment(c,o,i){
 const z=o.zy,b=z.bells[i],A=zy10Art(),x=b.x,y=z.y0-190,originY=b.y-y;
 if(x<cam.x-500||x>cam.x+VW+600)return;
 c.save();c.translate(x,y);
 if(i===0){
  c.drawImage(A.islands[0],-190,75,310,170);c.drawImage(A.reed,-201,-34,145,171);
  for(let k=0;k<5;k++){
   const bx=-160+k*72,by=-165+Math.sin(k*1.8)*38,tm=zy10SubjectTime(b,bx,by,originY),a=k*.9;
   const xx=bx+(Math.sin(a+tm*.48)-Math.sin(a))*65,yy=by+(Math.cos(a+tm*.48)-Math.cos(a))*35;
   zy10StillTrace(c,bx,by,.8,Math.max(0,1-tm*2),-.12);
   zy10Bird(c,xx,yy,k*.47+tm,.7+k%2*.13);
  }
 }else if(i===1){
  c.drawImage(A.islands[1],-211,-275,420,130);c.drawImage(A.arch,-230,-429,460,240);c.drawImage(A.islands[1],-172,98,344,145);
  zy10Glow(c,0,-40,130,215,'#ffda86',b.flow*.26);
  c.strokeStyle='#ffe1a7';c.lineCap='round';
  for(let k=0;k<44;k++){
   const f0=(k*.61803398875)%1,tm=zy10SubjectTime(b,0,-235+f0*350,originY),f=(f0+tm*.33)%1;
   const xx=Math.sin(k*2.3)*29*(.25+Math.abs(f-.5)*2),yy=-235+f*350;
   c.globalAlpha=.5+(k%3)*.14;c.lineWidth=1.6+k%3;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx,yy+3+Math.min(1,tm*2)*9);c.stroke();
  }
  c.globalAlpha=1;
  for(let k=0;k<3;k++){const yy=-180+k*116,tm=zy10SubjectTime(b,0,yy,originY);zy10StillTrace(c,17,yy,.7,Math.max(0,1-tm*2),-Math.PI/2);}
  c.drawImage(A.pool,-115,90,230,59);
  const poolTime=zy10SubjectTime(b,0,114,originY);
  if(poolTime>0){for(let k=0;k<5;k++){const r=((poolTime*.35+k*.2)%1);c.globalAlpha=(1-r)*.32*Math.min(1,poolTime*2);c.strokeStyle='#fff0c4';c.lineWidth=1.5;c.beginPath();c.ellipse(0,114,20+r*110,5+r*20,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;}
 }else{
  c.drawImage(A.islands[2],-180,55,360,180);const tm=zy10SubjectTime(b,0,-95,originY),a=tm*.4,bl=smooth(clamp(tm/3,0,1));
  c.strokeStyle='#588f89';c.lineWidth=13;c.beginPath();c.moveTo(0,80);c.bezierCurveTo(-35,27,20,-37,0,-89);c.stroke();c.strokeStyle='#bed5ad';c.lineWidth=3;c.stroke();
  c.save();c.translate(-5,29);c.rotate(-.72);c.drawImage(A.reed,-104,-98,102,120);c.restore();
  for(let k=0;k<9;k++){c.save();c.translate(0,-95);c.rotate(k*Math.PI*2/9+a);const w=63+bl*21,h=119+bl*51;c.drawImage(A.petal[k%3],-w*.5,-h,w,h+6);c.restore();}
  for(let k=0;k<5;k++){c.save();c.translate(0,-95);c.rotate(k*Math.PI*2/5+a+.31);c.drawImage(A.petal[(k+1)%3],-21,-71-bl*21,42,77+bl*21);c.restore();}
  zy10Glow(c,0,-95,70,70,'#fff0ab',.14+.24*bl);c.drawImage(A.flowerCore,-31,-126,62,62);
  // Falling petals stop halfway to the island, then continue along that exact path.
  for(let k=0;k<5;k++){
   const bx=-139+k*69,by=-210+(k%3)*67,pt=zy10SubjectTime(b,bx,by,originY),u=(k*.19+pt*.13)%1;
   const xx=bx+Math.sin(pt*.8+k)*22-Math.sin(k)*22,yy=by+(u-k*.19)*170;
   zy10StillTrace(c,bx,by,.55,Math.max(0,1-pt*2),-.65);
   c.save();c.translate(xx,yy);c.rotate(k*.7+pt*.5);c.globalAlpha=.82;c.drawImage(A.petal[k%3],-11,-17,22,36);c.restore();
  }
  for(let k=0;k<8;k++){const bx=-145+k*42,by=45-Math.abs(Math.sin(k*2))*44,tt=zy10SubjectTime(b,bx,by,originY),xx=bx+Math.sin(tt+k)*12,yy=by-Math.sin(tt*.7)*15;zy10Leaf(c,xx,yy,.48,k+tt*.3,k%2?'#c4dbbd':'#a9cbbb');}
 }
 c.restore();
}
function zy10BellDraw(c,b,i){
 const A=zy10Art(),live=b.done,tt=live?b.t:0;
 c.save();c.translate(b.x,b.y);c.strokeStyle='#c9d1b9';c.lineWidth=3;c.beginPath();c.moveTo(0,-113);c.lineTo(0,-57);c.stroke();
 zy10Glow(c,0,0,115,115,ZY10.colors[i],live?.30:.13);
 c.rotate(live?Math.sin(tt*7)*Math.exp(-tt*.65)*.32:0);c.drawImage(A.bell,-53,-60,106,121);
 if(live&&tt<3){const r=tt/3;c.globalAlpha=(1-r)*.65;c.strokeStyle='#fff1bd';c.lineWidth=3;c.beginPath();c.arc(0,0,75+r*240,0,Math.PI*2);c.stroke();}c.restore();
}
function zy10Draw(o){
 const z=o.zy,A=zy10Art();g.save();
 if(z.phase==='bekle'||z.phase==='bitti'){
  g.strokeStyle='#9bb9ac';g.lineWidth=8;g.beginPath();g.moveTo(z.pos.x-165,z.y0);g.lineTo(z.pos.x+140,z.y0);g.stroke();
  for(let k=0;k<9;k++){g.strokeStyle='#d1d8b9';g.lineWidth=3;g.beginPath();g.moveTo(z.pos.x-160+k*35,z.y0-4);g.lineTo(z.pos.x-153+k*35,z.y0+7);g.stroke();}
 }
 const x=z.pos.x,y=z.pos.y,tilt=ZAMAN_YOL.aktif?z.tilt:0;
 g.translate(x,y);g.rotate(tilt);zy10Glow(g,0,-4,155,55,'#bce8db',.16);
 // Carved mast and an hourglass silk sail; riders remain in front of the mast.
 g.strokeStyle='#8c6c59';g.lineWidth=7;g.beginPath();g.moveTo(-69,-12);g.quadraticCurveTo(-67,-160,-76,-265);g.stroke();g.strokeStyle='#e5c390';g.lineWidth=2;g.stroke();
 g.save();g.translate(-73,-274);g.rotate(Math.sin(z.t*1.8)*.035);g.drawImage(A.sail,0,0,158,217);g.restore();
 // Sand only flows while the boat itself is travelling in Feza's time bubble.
 const tm=ZAMAN_YOL.aktif?z.t:0;g.fillStyle='#fff3be';for(let i=0;i<6;i++){const q=(tm*.7+i/6)%1;g.fillRect(2,-172+q*45,2,3);}
 for(let i=0;i<3;i++){g.strokeStyle=ZY10.colors[i];g.lineWidth=3-i*.3;g.beginPath();g.moveTo(-75,-260+i*9);g.bezierCurveTo(-107,-272+i*10+Math.sin(tm*3+i)*5,-120,-253+i*10,-147,-268+i*10+Math.sin(tm*3.5+i)*8);g.stroke();}
 g.strokeStyle='#a9c4b7';g.lineWidth=2;g.beginPath();g.moveTo(-76,-261);g.lineTo(114,-17);g.moveTo(-76,-261);g.lineTo(-119,-18);g.stroke();
 g.fillStyle='#70545a';g.fillRect(-98,-25,199,12);g.fillStyle='#d6bc8c';g.fillRect(-94,-26,190,4);
 if(ZAMAN_YOL.aktif&&typeof z10Fox==='function'){
  const seats=[-108,-79,-49,43,73,103];for(let i=0;i<Math.min(6,V10.tilki);i++){const a=z.phase==='binis'?smooth(clamp((z.phaseT-i*.13)/.8,0,1)):1;if(a<=0)continue;g.save();g.globalAlpha=a;z10Fox(g,seats[i],-26-Math.sin(a*Math.PI)*25,.33,z.t+i*.4,true,i,i<3?1:-1,0);g.restore();}
 }
 if(ZAMAN_YOL.aktif&&z.phase==='ucus'){
  fezaCizPoz(g,-18,-24,1.12,'binis',z.t,null,{ruzgar:.22,sevinc:Math.min(1,z.celebrate),el:{x:20,y:-7}});
 }
 g.drawImage(A.hull,-142,-59,284,124);
 g.save();g.translate(109,-19);g.rotate(Math.sin(tm*2.5)*.08);g.drawImage(A.lantern,-20,0,40,62);g.restore();
 g.restore();
}
function zy10Front(o){
 if(!ZAMAN_YOL.aktif)return;const z=o.zy;g.save();
 if(z.phase!=='ucus')fezaCizPoz(g,P.x,P.y,1.12,z.phase==='inis'?'sevinc':'ayakta',z.t);
 pirilCizPoz(g,z.pr.x,z.pr.y,1,'ucus',z.t);
 const b=z.bells[V10.sandalAsama||0];if(b&&z.idle>9&&Math.abs(b.x-z.pos.x)<370){g.strokeStyle='#ffedb2';g.lineWidth=2;g.globalAlpha=.65;g.setLineDash([3,9]);g.beginPath();g.moveTo(z.pr.x+25,z.pr.y+5);g.quadraticCurveTo(b.x-20,b.y-45,b.x,b.y-8);g.stroke();g.setLineDash([]);}
 g.restore();
}
function zy10Reserved(e){const r=cv.getBoundingClientRect();return e.clientY-r.top<Math.max(88,r.height*.11)&&e.clientX-r.left>r.width-Math.max(150,r.width*.16);}
function zy10Hit(e){
 if(!ZAMAN_YOL.aktif||DURUM!=='oyun'||e.target!==cv||zy10Reserved(e))return -1;
 const z=ZY10.o.zy,i=V10.sandalAsama||0,b=z.bells[i];if(!b||Math.abs(b.x-z.pos.x)>420)return -1;
 const r=cv.getBoundingClientRect(),x=cam.x+(e.clientX-r.left)*cv.width/r.width/S,y=cam.y+(e.clientY-r.top)*cv.height/r.height/S;
 return Math.hypot(x-b.x,y-b.y)<Math.max(76,40*DPR/S)?i:-1;
}
function zy10Release(){const ptr=ZY10.ptr;ZY10.ptr=-1;if(ptr>=0)try{cv.releasePointerCapture(ptr);}catch(_){}if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
function zy10Tap(e){if(ZY10.ptr>=0&&e.pointerId!==ZY10.ptr)return;const i=zy10Hit(e);if(i<0)return;const o=ZY10.o;if(!zy10Bell(o,i,false))return;e.preventDefault();e.stopPropagation();ZY10.ptr=e.pointerId;try{cv.setPointerCapture(e.pointerId);}catch(_){}if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;zy10Tap(e);},true);
addEventListener('pointermove',e=>{if(e.buttons&1)zy10Tap(e);},true);
addEventListener('pointerup',e=>{if(e.pointerId===ZY10.ptr){e.preventDefault();e.stopPropagation();zy10Release();}},true);
addEventListener('pointercancel',e=>{if(e.pointerId===ZY10.ptr)zy10Release();},true);
cv.addEventListener('lostpointercapture',e=>{if(e.pointerId===ZY10.ptr)zy10Release();});
for(const name of ['blur','pagehide','resize','orientationchange'])addEventListener(name,()=>{if(ZAMAN_YOL.aktif)zy10Release();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&ZAMAN_YOL.aktif)zy10Release();});
OLAY.on('durum',d=>{if(d!=='oyun'&&ZAMAN_YOL.aktif)zy10Release();});
addEventListener('keydown',e=>{if(!ZAMAN_YOL.aktif||DURUM!=='oyun'||e.repeat||!['Space','Enter','KeyE'].includes(e.code)||e.target&&/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName))return;if(zy10Bell(ZY10.o,V10.sandalAsama||0,false)){e.preventDefault();e.stopPropagation();}},true);
TUR.kaydet('zamanYolAni',{ciz(o){const boat=ZY10.o;if(!boat)return;const b=boat.zy.bells[o.sira];zy10Moment(g,boat,o.sira);zy10BellDraw(g,b,o.sira);}});
TUR.kaydet('zamanSandal',{kur:zy10Setup,guncelle:zy10Step,ciz:zy10Draw,cizOn:zy10Front});
