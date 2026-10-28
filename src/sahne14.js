/* Annemle Yıldız Yolculuğu: rafta küçük bir uzay dioraması, başucunda gerçek bir hatıra.
   Ortak seçim/oda koordinatlarını kullanır; önbellekler bütün bölümlerde sınırlıdır. */
'use strict';
const SH14={atlas:null,stars:Array.from({length:43},(_,i)=>({x:(i*.6180339)%1,y:(i*.381966+.13)%1,r:i%7===0?1.8:i%3===0?1:.55,p:i*2.399}))};
function sh14Star(c,x,y,r,col){if(!(r>0))return;c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,q=i%2?r*.26:r;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
function sh14Oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.001,rx),Math.max(.001,ry),0,0,Math.PI*2);c.fill();}
function sh14Line(c,p,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();for(let i=0;i<p.length;i+=2)i?c.lineTo(p[i],p[i+1]):c.moveTo(p[i],p[i+1]);c.stroke();}
function sh14Canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function sh14Face(c,x,y,k,mother){c.save();c.translate(x,y);c.scale(k,k);sh14Oval(c,0,0,12,14,'#efc5aa');c.fillStyle=mother?'#65503e':'#6c4c32';c.beginPath();c.moveTo(-12,5);c.bezierCurveTo(-19,-12,-2,-23,12,-8);c.lineTo(13,0);c.quadraticCurveTo(7,-11,2,-8);c.lineTo(-8,-2);c.closePath();c.fill();if(mother){c.fillStyle='#65503e';c.beginPath();c.moveTo(-11,-1);c.quadraticCurveTo(-22,14,-14,25);c.quadraticCurveTo(-9,14,-9,5);c.fill();}for(const xx of [-4,5]){sh14Oval(c,xx,1,1.5,2,'#3c413b');sh14Oval(c,xx-.3,.3,.4,.5,'#fff8ea');}sh14Oval(c,-7,6,2.7,1.4,'#df9a9970');sh14Oval(c,8,6,2.7,1.4,'#df9a9970');sh14Line(c,[-3,8,1,10,5,7],'#a96b69',.9);c.restore();}
function sh14Build(){
 if(SH14.atlas)return SH14.atlas;const A={planet:[],ship:null};
 for(let k=0;k<4;k++){
  const im=sh14Canvas(192,192),c=im.getContext('2d');c.save();c.beginPath();c.arc(96,96,81,0,Math.PI*2);c.clip();
  const cols=[['#e2e5d5','#7485a3'],['#e2a878','#985a61'],['#eed5ae','#94778e'],['#b4eee0','#4a91b1']][k],gr=c.createRadialGradient(55,38,8,98,99,119);gr.addColorStop(0,cols[0]);gr.addColorStop(1,cols[1]);c.fillStyle=gr;c.fillRect(0,0,192,192);
  if(k===0){for(let i=0;i<13;i++){const x=35+(i*61)%134,y=30+(i*43)%129,r=6+(i*7)%17;sh14Oval(c,x+1,y+2,r,r*.63,'#687b9638');c.strokeStyle='#f0eed680';c.lineWidth=2;c.beginPath();c.ellipse(x,y,r,r*.63,0,Math.PI*.9,Math.PI*1.85);c.stroke();}}
  if(k===1){for(let i=0;i<8;i++){const y=31+i*21;c.strokeStyle=i%2?'#eac19870':'#8c526350';c.lineWidth=5;c.beginPath();c.moveTo(5,y);c.bezierCurveTo(42,y-16,102,y+23,192,y-9);c.stroke();}for(let i=0;i<7;i++)sh14Oval(c,30+i*23,46+(i*43)%100,7,4,'#854a5b30');}
  if(k===2){for(let i=0;i<11;i++){const y=i*20,cx=i%2?'#ac7d8166':'#f3ddbd88';c.fillStyle=cx;c.beginPath();c.moveTo(0,y);c.bezierCurveTo(52,y-14,122,y+14,192,y-3);c.lineTo(192,y+13);c.bezierCurveTo(125,y+30,58,y+4,0,y+17);c.fill();}sh14Oval(c,133,121,25,13,'#b66b70');c.strokeStyle='#e2a280';c.lineWidth=4;c.beginPath();c.ellipse(132,121,28,15,-.15,.3,5.7);c.stroke();}
  if(k===3){for(let i=0;i<9;i++)sh14Line(c,[15,i*25,90,i*25-4,180,i*25+5],i%2?'#b2e3dc44':'#6aafc133',4);}
  const sh=c.createLinearGradient(0,0,192,140);sh.addColorStop(0,'#081b4200');sh.addColorStop(.65,'#081b4211');sh.addColorStop(1,'#081b4277');c.fillStyle=sh;c.fillRect(0,0,192,192);c.restore();A.planet.push(im);
 }
 const im=sh14Canvas(340,230),c=im.getContext('2d');c.translate(170,138);
 sh14Oval(c,0,31,137,13,'#101f3c33');sh14Line(c,[-85,15,-102,39,-121,39],'#8ca3bb',7);sh14Line(c,[75,17,94,39,114,39],'#8ca3bb',7);
 const shell=c.createLinearGradient(0,-99,0,31);shell.addColorStop(0,'#fff5db');shell.addColorStop(.45,'#dce9eb');shell.addColorStop(.8,'#a0b6c9');shell.addColorStop(1,'#657997');c.fillStyle=shell;c.beginPath();c.moveTo(-137,1);c.bezierCurveTo(-159,-28,-130,-77,-97,-85);c.bezierCurveTo(-46,-126,36,-109,79,-72);c.bezierCurveTo(112,-62,146,-32,158,-11);c.quadraticCurveTo(139,25,70,30);c.lineTo(-96,29);c.quadraticCurveTo(-128,21,-137,1);c.fill();
 c.fillStyle='#8995b2';c.beginPath();c.moveTo(-102,16);c.lineTo(-137,60);c.lineTo(-78,26);c.fill();c.beginPath();c.moveTo(47,25);c.lineTo(86,64);c.lineTo(85,17);c.fill();
 sh14Line(c,[-141,-24,-126,-61,-94,-77],'#fff6df',2.7);sh14Line(c,[-102,6,-43,18,83,13,122,0],'#728ba3',1.2);
 for(let j=0;j<6;j++)sh14Oval(c,-90+j*35,21,1.7,1.2,'#f2dfb9');
 c.fillStyle='#526a8c';c.beginPath();c.ellipse(-19,-50,76,49,-.05,0,Math.PI*2);c.fill();c.fillStyle='#203d60';c.beginPath();c.ellipse(-19,-50,69,42,-.05,0,Math.PI*2);c.fill();
 for(let j=0;j<2;j++){const x=-47+j*49;sh14Oval(c,x,-24,18,24,j?'#9ecce2':'#b6a4d3');sh14Oval(c,x,-55,j?18:21,j?20:24,'#c5e5e64d');sh14Face(c,x,-56,j?.91:1.05,!j);c.strokeStyle=j?'#c5f2ef':'#ddd2ee';c.lineWidth=2;c.beginPath();c.ellipse(x,-55,j?19:22,j?21:25,0,0,Math.PI*2);c.stroke();}
 c.fillStyle='#bfdae1';c.globalAlpha=.1;c.beginPath();c.ellipse(-19,-50,69,42,-.05,0,Math.PI*2);c.fill();c.globalAlpha=1;sh14Line(c,[-72,-69,-51,-83,-21,-88],'#e6f9efaa',3);sh14Line(c,[-64,-59,-51,-67],'#ecffff66',1.5);
 sh14Oval(c,113,-11,6,4,'#d7e7d0');sh14Star(c,81,-16,12,'#f3dfaa');sh14Oval(c,-144,-7,11,24,'#647b9e');sh14Oval(c,-150,-9,5,17,'#b1e0df');A.ship=im;SH14.atlas=A;return A;
}
function sh14Rocket(c,x,y,s,t){const A=sh14Build();c.save();c.translate(x,y);c.scale(s,s);c.rotate(-.16+Math.sin(t*.65)*.035);c.globalAlpha*=.68;for(let j=0;j<3;j++)sh14Oval(c,-156-j*12,3,16-j*3,9-j*2,['#addfe8','#e6f2d7','#f5ddb5'][j]);c.globalAlpha/=.68;c.drawImage(A.ship,-170,-138);c.restore();}
function sh14Fon(c,w,h){
 const gr=c.createLinearGradient(0,0,w*.2,h);gr.addColorStop(0,'#101b42');gr.addColorStop(.53,'#273653');gr.addColorStop(1,'#7c738b');c.fillStyle=gr;c.fillRect(0,0,w,h);
 for(const p of SH14.stars)sh14Star(c,p.x*w,p.y*h*.8,p.r*w*.0021,'#f1e8d2a0');
 c.fillStyle='#929cb5';c.beginPath();c.moveTo(0,h*.88);c.bezierCurveTo(w*.2,h*.65,w*.53,h*.99,w,h*.82);c.lineTo(w,h);c.lineTo(0,h);c.fill();
 c.fillStyle='#b7c1ce';c.beginPath();c.moveTo(0,h*.96);c.bezierCurveTo(w*.3,h*.87,w*.7,h*.91,w,h*.94);c.lineTo(w,h);c.lineTo(0,h);c.fill();
 for(let i=0;i<3;i++){const x=w*(.16+i*.31),y=h*(.95+i%2*.025);sh14Oval(c,x,y,w*(.06+i*.01),h*.009,'#576c8955');c.strokeStyle='#e6e6d777';c.lineWidth=w*.003;c.beginPath();c.ellipse(x,y-1,w*(.06+i*.01),h*.01,0,Math.PI,Math.PI*2);c.stroke();}
}
function sh14Canli(ox,oy,w,h,tm,a,hov){
 if(!(w>0&&h>0&&a>0))return;const c=g,A=sh14Build(),s=Math.min(w,h);c.save();c.globalAlpha*=a;c.translate(ox,oy);
 const worlds=[[.21,.29,.11],[.68,.2,.087],[.78,.63,.146],[.22,.64,.1]];
 for(let i=0;i<4;i++){const p=worlds[i],x=w*p[0]+Math.sin(tm*.13+i)*s*.013,y=h*p[1]+Math.sin(tm*.21+i*1.7)*s*.011,r=s*p[2];if(i===3){c.save();c.translate(x,y);c.rotate(-.8);c.strokeStyle='#aedee18c';c.lineWidth=s*.004;c.beginPath();c.ellipse(0,0,r*1.6,r*.5,0,Math.PI,Math.PI*2);c.stroke();c.restore();}c.drawImage(A.planet[i],x-r*1.185,y-r*1.185,r*2.37,r*2.37);if(i===3){c.save();c.translate(x,y);c.rotate(-.8);c.strokeStyle='#d2ebe1b3';c.lineWidth=s*.004;c.beginPath();c.ellipse(0,0,r*1.6,r*.5,0,0,Math.PI);c.stroke();c.restore();}}
 c.strokeStyle='#e0d8b75c';c.lineWidth=Math.max(.65,s*.0025);c.setLineDash([s*.009,s*.017]);c.beginPath();c.moveTo(w*.24,h*.32);c.bezierCurveTo(w*.45,h*.03,w*.99,h*.4,w*.75,h*.66);c.bezierCurveTo(w*.62,h*.88,w*.16,h*.94,w*.2,h*.65);c.stroke();c.setLineDash([]);
 sh14Rocket(c,w*.48,h*.51+Math.sin(tm*.8)*s*.015,s*.00165*(1+(hov||0)*.035),tm);
 const cx=w*.5+Math.sin(tm*.33)*s*.035,cy=h*.17+Math.cos(tm*.4)*s*.02;
 for(let i=0;i<3;i++)sh14Line(c,[cx-s*.028,cy+i*s*.007,cx-s*.10,cy-s*.015+i*s*.007,cx-s*.15,cy+s*.015+i*s*.007],['#a0cfe477','#e5cfe177','#f0e1b277'][i],s*.007-i*s*.0015);
 sh14Star(c,cx,cy,s*.029,'#fff0b8');for(let i=0;i<6;i++){const p=SH14.stars[i*5],tw=.35+.4*Math.sin(tm*1.2+i);c.globalAlpha=a*Math.max(.05,tw);sh14Star(c,p.x*w,p.y*h*.85,s*.009,'#fff2c9');}c.restore();
}
function sh14Ikon(c,r){if(r>0)sh14Rocket(c,0,0,r*.006,0);}
function sh14Sabah(tm,a){
 if(!(a>.01)||typeof shOdaT!=='function'||typeof shPencereYol!=='function')return;const c=g;c.save();shOdaT();shPencereYol(c,0);c.clip();c.globalAlpha=a;
 const gr=c.createLinearGradient(0,10,0,52);gr.addColorStop(0,'#b3d2de');gr.addColorStop(.7,'#f3dfc4');gr.addColorStop(1,'#f6d8b8');c.fillStyle=gr;c.fillRect(SH_PEN.x0-1,SH_PEN.ust-1,SH_PEN.x1-SH_PEN.x0+2,54-SH_PEN.ust);
 sh14Oval(c,35,23,3,3,'#f9edc8');c.fillStyle='#98b2ab';c.beginPath();c.moveTo(12,48);c.quadraticCurveTo(22,37,32,43);c.quadraticCurveTo(41,38,44,44);c.lineTo(44,54);c.lineTo(12,54);c.fill();
 for(let i=0;i<3;i++){const x=19+i*8,y=27+i%2*5;sh14Oval(c,x,y,4.2,1.1,'#faf1dbb3');}c.restore();
 c.save();shOdaT();c.globalAlpha=a;c.fillStyle=SH_SABAH.frame;c.fillRect((SH_PEN.x0+SH_PEN.x1)/2-.6,SH_PEN.ust,1.2,SH_PEN.alt-SH_PEN.ust);c.fillRect(SH_PEN.x0,31,SH_PEN.x1-SH_PEN.x0,1.2);c.restore();
}
function sh14Hediye(tm,a,u){
 if(!(a>.01&&u>0)||typeof shOdaT!=='function')return;const c=g,kom=-(W/2+(sh.oxp||0))/sh.k0<-57.5,x=kom?-55.5:-36.8,y=kom?SH_KOMODIN.ust-1.6:36.8,r=kom?2.25:2.6,sc=r/31;
 c.save();shOdaT();c.globalAlpha*=a*u;c.translate(x,y);c.scale(sc,sc);sh14Oval(c,0,0,34,7,'#35435444');
 c.fillStyle='#8b7159';c.beginPath();c.roundRect(-29,-9,58,13,5);c.fill();sh14Line(c,[-23,-7,23,-7],'#d7bd93',1.5);sh14Oval(c,0,-10,25,6,'#b4caca');
 c.fillStyle='#badfdf1c';c.beginPath();c.arc(0,-39,31,Math.PI,Math.PI*2);c.lineTo(31,-12);c.quadraticCurveTo(0,0,-31,-12);c.closePath();c.fill();c.strokeStyle='#c8e9e0aa';c.lineWidth=1.3;c.stroke();
 sh14Rocket(c,3,-27,.115,0);sh14Star(c,-10,-61,5,'#ead7a1');sh14Line(c,[-23,-38,-22,-49,-17,-60],'#f7ffff99',2);c.restore();
}
if(typeof SH_BALON_RENK!=='undefined')SH_BALON_RENK.uzay='#a9d7df';
if(typeof SH_ONBELLEK!=='undefined'&&SH_ONBELLEK.indexOf('uzay')<0)SH_ONBELLEK.push('uzay');
if(typeof SH_KUR!=='undefined')SH_KUR.uzay=()=>{const A={c:null,W,H,adim:[()=>{A.c=shTuval();sh14Fon(A.c.getContext('2d'),W,H);}]};return A;};
