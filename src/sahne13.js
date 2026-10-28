/* sahne13.js — İpek Göğü: yaşayan ay ormanı, bulut bahçeleri ve yıldız kökleri.
   Kavanoz B1 seçiminde de görünür. Bütün resimler Canvas ile önbelleğe çizilir;
   dış resim, kumaş/desen atlası, karede filtre ya da piksel okuma kullanılmaz. */
'use strict';
const SH13={yer:new Map(),isik:new Map(),sabah:null};
const SH13_YAPRAK=[[-105,-184,.92,-.55],[-84,-212,.78,-.8],[-63,-254,.85,-.45],[-31,-274,.65,-.15],[8,-301,.88,.22],[32,-269,.74,.6],[61,-244,.84,.7],[103,-213,.95,.9],[121,-181,.66,1.1],[-123,-153,.57,-1.1],[78,-172,.67,.6],[-14,-224,.6,-.2],[44,-203,.72,.3],[-73,-174,.63,-.8]];
const SH13_KUME=[[-104,-183,46,31,-.3],[-62,-250,39,30,-.2],[7,-292,34,28,.15],[61,-243,42,31,.35],[102,-211,48,31,.3],[-121,-151,35,24,-.22],[76,-172,39,27,.2]];
const sh13Tau=Math.PI*2;
function sh13Yer(w,h){
  const key=Math.round(w)+'x'+Math.round(h);let o=SH13.yer.get(key);if(o)return o;
  const s=Math.min(w,h),kare=w/h<1.35;
  o={s,kare,treeX:w*(kare?.57:.59),treeY:h*.83,treeK:s*(kare?.00178:.00174),
    moonX:w*.72,moonY:h*.245,moonR:s*.148,familyX:w*(kare?.40:.43),familyY:h*.881,familyK:s*.00129};
  if(SH13.yer.size>10)SH13.yer.clear();SH13.yer.set(key,o);return o;
}
function sh13Halo(col){
  let a=SH13.isik.get(col);if(a)return a;
  a=document.createElement('canvas');a.width=a.height=128;const c=a.getContext('2d'),r=c.createRadialGradient(64,64,0,64,64,64);
  r.addColorStop(0,col);r.addColorStop(.18,col);r.addColorStop(.55,col+'55');r.addColorStop(1,col+'00');c.fillStyle=r;c.fillRect(0,0,128,128);SH13.isik.set(col,a);return a;
}
function sh13Glow(c,x,y,r,col,a){if(!(a>0&&r>0))return;c.save();c.globalAlpha*=a;c.drawImage(sh13Halo(col),x-r,y-r,r*2,r*2);c.restore();}
function sh13Isit(){sh13Halo('#b7ffe4');sh13Halo('#b8c7ff');sh13Halo('#f4efbf');return true;}
function sh13Yildiz(c,x,y,r){
  c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*.17,y-r*.17,x+r,y);c.quadraticCurveTo(x+r*.17,y+r*.17,x,y+r);c.quadraticCurveTo(x-r*.17,y+r*.17,x-r,y);c.quadraticCurveTo(x-r*.17,y-r*.17,x,y-r);c.closePath();c.fill();
}
function sh13Yaprak(c,x,y,rx,ry,ang,col,ic){
  c.save();c.translate(x,y);c.rotate(ang);c.fillStyle=col;c.beginPath();c.moveTo(0,-ry);c.bezierCurveTo(rx*1.35,-ry*.4,rx*.9,ry*.75,0,ry);c.bezierCurveTo(-rx*.95,ry*.5,-rx*1.2,-ry*.4,0,-ry);c.fill();
  if(ic){c.fillStyle=ic;c.beginPath();c.moveTo(0,-ry*.84);c.quadraticCurveTo(rx*.63,-ry*.2,0,ry*.72);c.quadraticCurveTo(rx*.11,-ry*.1,0,-ry*.84);c.fill();}
  c.restore();
}
function sh13Bulut(c,x,y,rx,ry,base,light){
  c.fillStyle=base;c.beginPath();c.moveTo(x-rx,y+ry*.32);c.bezierCurveTo(x-rx*1.2,y-ry*.2,x-rx*.8,y-ry*.84,x-rx*.38,y-ry*.53);c.bezierCurveTo(x-rx*.2,y-ry*1.25,x+rx*.37,y-ry*.98,x+rx*.49,y-ry*.45);c.bezierCurveTo(x+rx*.96,y-ry*.75,x+rx*1.25,y+ry*.13,x+rx*.86,y+ry*.39);c.bezierCurveTo(x+rx*.5,y+ry*.64,x-rx*.64,y+ry*.61,x-rx,y+ry*.32);c.fill();
  if(light){c.fillStyle=light;c.beginPath();c.ellipse(x-rx*.08,y-ry*.28,rx*.66,ry*.18,-.06,0,sh13Tau);c.fill();}
}
function sh13Ada(c,x,y,rx,ry){
  const gr=c.createLinearGradient(x,y,x,y+ry*3.6);gr.addColorStop(0,'#386774');gr.addColorStop(.42,'#274b62');gr.addColorStop(1,'#183c56');c.fillStyle=gr;
  c.beginPath();c.moveTo(x-rx*.95,y);c.bezierCurveTo(x-rx*.72,y+ry*.8,x-rx*.86,y+ry*2.1,x-rx*.35,y+ry*2.32);c.bezierCurveTo(x-rx*.16,y+ry*3.1,x+rx*.2,y+ry*2.65,x+rx*.33,y+ry*2.1);c.bezierCurveTo(x+rx*.79,y+ry*2.18,x+rx*.6,y+ry*.73,x+rx*.98,y);c.closePath();c.fill();
  c.fillStyle='#548e89';c.beginPath();c.moveTo(x-rx,y);c.bezierCurveTo(x-rx*.9,y-ry*.57,x-rx*.43,y-ry*.55,x-rx*.12,y-ry*.38);c.bezierCurveTo(x+rx*.14,y-ry*.75,x+rx*.56,y-ry*.4,x+rx*.78,y-ry*.23);c.quadraticCurveTo(x+rx*1.1,y+ry*.13,x+rx*.91,y+ry*.27);c.bezierCurveTo(x+rx*.48,y+ry*.57,x+rx*.19,y+ry*.31,x-rx*.06,y+ry*.37);c.bezierCurveTo(x-rx*.38,y+ry*.57,x-rx*.83,y+ry*.22,x-rx,y);c.fill();
  c.strokeStyle='#8ab7a1';c.lineWidth=Math.max(.7,ry*.06);c.lineCap='round';c.beginPath();c.moveTo(x-rx*.91,y-ry*.08);c.bezierCurveTo(x-rx*.62,y-ry*.36,x-rx*.22,y-ry*.1,x+rx*.1,y-ry*.32);c.stroke();
  for(let i=0;i<4;i++){const xx=x+rx*(-.62+i*.4),yy=y+ry*(.22+i%2*.11),len=ry*(2.1+i%3*.62);c.strokeStyle=i%2?'#54817b':'#3d6e70';c.lineWidth=ry*(.06+i%2*.02);c.beginPath();c.moveTo(xx,yy);c.bezierCurveTo(xx-rx*.12,yy+len*.25,xx+rx*.07,yy+len*.6,xx-rx*.04,yy+len);c.stroke();}
}
function sh13Tac(c,x,y,rx,ry,ang,base,light){
  c.save();c.translate(x,y);c.rotate(ang);c.fillStyle=base;c.beginPath();
  c.moveTo(-rx,-ry*.05);c.bezierCurveTo(-rx*1.05,-ry*.65,-rx*.5,-ry*1.08,-rx*.15,-ry*.73);
  c.bezierCurveTo(rx*.17,-ry*1.13,rx*.74,-ry*.89,rx*.74,-ry*.34);c.bezierCurveTo(rx*1.27,-ry*.18,rx*.94,ry*.57,rx*.48,ry*.49);
  c.bezierCurveTo(rx*.21,ry*.9,-rx*.25,ry*.7,-rx*.39,ry*.41);c.bezierCurveTo(-rx*.87,ry*.61,-rx*1.19,ry*.33,-rx,-ry*.05);c.fill();
  c.fillStyle=light;c.beginPath();c.moveTo(-rx*.8,-ry*.14);c.bezierCurveTo(-rx*.51,-ry*.67,-rx*.24,-ry*.47,0,-ry*.62);c.bezierCurveTo(rx*.48,-ry*.81,rx*.68,-ry*.35,rx*.47,-ry*.24);c.bezierCurveTo(rx*.11,-ry*.4,-rx*.29,-ry*.26,-rx*.8,-ry*.14);c.fill();c.restore();
}
function sh13Fidan(c,x,y,k,col){
  c.save();c.translate(x,y);c.scale(k,k);c.strokeStyle=col;c.lineWidth=1.7;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-4,-15,6,-31,3,-46);c.stroke();
  sh13Yaprak(c,-5,-19,4.2,10,-.7,col,'#aed6ba');sh13Yaprak(c,8,-30,3.8,9,.65,col,'#b9dcc0');sh13Yaprak(c,3,-46,4.5,11,.15,col,'#d2e8c6');c.restore();
}
function sh13Dal(c,x,y,k,back){
  c.save();c.translate(x,y);c.scale(k,k);c.lineCap='round';c.lineJoin='round';
  const branches=[[-4,-96,-46,-134,-103,-181],[3,-124,57,-159,108,-211],[-4,-166,-38,-221,-64,-253],[1,-180,20,-255,8,-299],[-6,-103,-77,-103,-124,-151],[2,-151,66,-170,79,-170],[0,-203,37,-228,63,-241]];
  // Dallar uçlara doğru incelir; sabit kalınlıkta çizgi veya boru görünümü yoktur.
  for(const b of branches){const dx=b[4]-b[0],dy=b[5]-b[1],len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len,ww=back?4.9:5.6;
    c.fillStyle=back?'#235b72':'#3b6d78';c.beginPath();c.moveTo(b[0]+nx*ww,b[1]+ny*ww);c.quadraticCurveTo(b[2]+nx*ww*.46,b[3]+ny*ww*.46,b[4],b[5]);c.quadraticCurveTo(b[2]-nx*ww*.46,b[3]-ny*ww*.46,b[0]-nx*ww,b[1]-ny*ww);c.closePath();c.fill();}
  if(!back){c.strokeStyle='#9ee5d6';c.lineWidth=2.1;for(const b of branches){c.beginPath();c.moveTo(b[0]-1,b[1]);c.quadraticCurveTo(b[2]-2,b[3],b[4],b[5]);c.stroke();}}
  const gr=c.createLinearGradient(-22,0,22,-10);gr.addColorStop(0,back?'#183a59':'#28485f');gr.addColorStop(.48,back?'#235c70':'#6fb0b2');gr.addColorStop(1,back?'#1d425f':'#244459');c.fillStyle=gr;
  c.beginPath();c.moveTo(-30,5);c.bezierCurveTo(-6,-32,-22,-83,-12,-127);c.bezierCurveTo(-5,-157,-8,-185,1,-215);c.bezierCurveTo(7,-183,3,-166,8,-144);c.bezierCurveTo(15,-99,-5,-55,30,7);c.quadraticCurveTo(0,-2,-30,5);c.fill();
  if(!back){
    c.strokeStyle='#c4f4dc';c.lineWidth=2;c.beginPath();c.moveTo(-12,-5);c.bezierCurveTo(-12,-56,4,-75,-4,-119);c.quadraticCurveTo(-7,-149,-1,-183);c.stroke();
    for(let i=0;i<6;i++){const side=i%2?1:-1,xx=side*(47+i*17);c.strokeStyle=i%2?'#89cfc2':'#78bfc0';c.lineWidth=3.8-i*.35;c.beginPath();c.moveTo(side*8,-9);c.bezierCurveTo(side*32,8,xx*.78,-5,xx,15+(i%3)*8);c.stroke();}
  }
  c.restore();
}
function sh13Fon(c,w,h){
  if(!c||!(w>0&&h>0))return;sh13Isit();const o=sh13Yer(w,h),s=o.s;
  c.save();c.beginPath();c.rect(0,0,w,h);c.clip();c.lineCap='round';c.lineJoin='round';
  let gr=c.createLinearGradient(0,0,w*.18,h);gr.addColorStop(0,'#10192f');gr.addColorStop(.43,'#253b63');gr.addColorStop(.75,'#316b78');gr.addColorStop(1,'#1b3d55');c.fillStyle=gr;c.fillRect(0,0,w,h);
  sh13Glow(c,o.moonX,o.moonY,s*.40,'#b8c7ff',.38);sh13Glow(c,w*.4,h*.70,s*.42,'#b7ffe4',.12);
  // Derin uzay, uzak ılık ışıklar: belli bir kültürün mimarisi ya da süsü yok.
  for(let i=0;i<38;i++){const x=w*((Math.sin(i*26.31)*.5+.5)*.94+.03),y=h*(.06+(Math.cos(i*19.7)*.5+.5)*.47),r=s*(i%7===0?.0031:.0013);c.globalAlpha=.25+(i%5)*.1;c.fillStyle=i%4?'#c1e6e7':'#f4efbf';if(i%7===0)sh13Yildiz(c,x,y,r*1.35);else{c.beginPath();c.arc(x,y,r,0,sh13Tau);c.fill();}}c.globalAlpha=1;
  // Ayın yumuşak yüzeyi: açık mavi kenar, süt beyazı çekirdek, belli belirsiz kraterler.
  gr=c.createRadialGradient(o.moonX-o.moonR*.26,o.moonY-o.moonR*.32,0,o.moonX,o.moonY,o.moonR);gr.addColorStop(0,'#fff9db');gr.addColorStop(.56,'#e8f5e8');gr.addColorStop(.88,'#b7d5de');gr.addColorStop(1,'#8baccb');c.fillStyle=gr;c.beginPath();c.arc(o.moonX,o.moonY,o.moonR,0,sh13Tau);c.fill();
  c.save();c.beginPath();c.arc(o.moonX,o.moonY,o.moonR*.985,0,sh13Tau);c.clip();c.fillStyle='#7d9fbd';c.globalAlpha=.13;
  for(let i=0;i<8;i++){const a=i*2.399,rr=o.moonR*(.16+(i%3)*.19),x=o.moonX+Math.cos(a)*rr,y=o.moonY+Math.sin(a)*rr;c.beginPath();c.ellipse(x,y,o.moonR*(.09+i%2*.06),o.moonR*(.06+i%2*.04),a,0,sh13Tau);c.fill();}c.restore();
  // Bulut bahçeleri uzaklaşıp koyulaşır; ufukta üç ayrı, yürünebilir küçük dünya görünür.
  for(let layer=0;layer<3;layer++){
    const yy=h*(.52+layer*.115);c.fillStyle=['#284765','#24506c','#1b5266'][layer];c.beginPath();c.moveTo(-s*.1,h);c.lineTo(-s*.1,yy+s*.04);c.bezierCurveTo(w*.2,yy-s*.12,w*.33,yy+s*.08,w*.55,yy-s*.035);c.bezierCurveTo(w*.75,yy-s*.16,w*.89,yy+s*.03,w+s*.1,yy-s*.11);c.lineTo(w+s*.1,h);c.fill();
  }
  c.globalAlpha=.48;sh13Dal(c,w*.12,h*.69,s*.00084,true);sh13Dal(c,w*.96,h*.76,s*.00108,true);c.globalAlpha=1;
  sh13Ada(c,w*.13,h*.62,s*.17,s*.027);sh13Ada(c,w*.86,h*.62,s*.18,s*.029);

  // Küçük bulut adalarında yıldız filizleri şimdiden uyanır.
  sh13Fidan(c,w*.11,h*.604,s*.00076,'#8fc1b8');sh13Fidan(c,w*.86,h*.601,s*.00104,'#98c6bc');
  for(let i=0;i<5;i++){const xx=w*(i<2?.08+i*.065:.79+(i-2)*.055),yy=h*(i<2?.59:.588),r=s*(.013+(i%2)*.005);c.strokeStyle='#7abbb8';c.lineWidth=s*.002;c.beginPath();c.moveTo(xx,yy+r);c.quadraticCurveTo(xx+r*.3,yy-r*.2,xx-r*.12,yy-r);c.stroke();sh13Yaprak(c,xx-r*.1,yy-r,r*.46,r*.78,-.3,'#b8dfd0','#e5f7d9');}
  // Ağacın dalları birbirini tekrar eden motifler değildir: kök, gövde, canlı yaprak uçları.
  for(let i=0;i<SH13_YAPRAK.length;i++){const p=SH13_YAPRAK[i],x=o.treeX+p[0]*o.treeK,y=o.treeY+p[1]*o.treeK;sh13Glow(c,x,y,25*p[2]*o.treeK,'#b7ffe4',.12);}
  // Hafif yaprak kümeleri ağaca hacim verir; dallar arasında gökyüzü görünür.
  for(let i=0;i<SH13_KUME.length;i++){const p=SH13_KUME[i];sh13Tac(c,o.treeX+p[0]*o.treeK,o.treeY+p[1]*o.treeK,p[2]*o.treeK,p[3]*o.treeK,p[4],i%2?'#315e74':'#356e77',i%2?'#3d7882':'#428a87');}
  sh13Dal(c,o.treeX,o.treeY,o.treeK,false);
  c.save();c.translate(o.treeX,o.treeY);c.scale(o.treeK,o.treeK);c.strokeStyle='#83bcb4';c.lineWidth=1.2;for(let i=0;i<SH13_YAPRAK.length;i++){const p=SH13_YAPRAK[i];c.beginPath();c.moveTo(p[0]*.92,p[1]+12);c.quadraticCurveTo(p[0]-4,p[1]+8,p[0],p[1]);c.stroke();}c.restore();
  // Ön kıyı: serbest kıvrılan yosun ve bulut, düz kumaş yüzey yerine yaşayan zemin.
  gr=c.createLinearGradient(0,h*.81,0,h);gr.addColorStop(0,'#336e73');gr.addColorStop(.28,'#214f5c');gr.addColorStop(1,'#12293f');c.fillStyle=gr;
  c.beginPath();c.moveTo(-s*.1,h);c.lineTo(-s*.1,h*.87);c.bezierCurveTo(w*.20,h*.76,w*.35,h*.89,w*.56,h*.84);c.bezierCurveTo(w*.76,h*.79,w*.91,h*.91,w*1.1,h*.81);c.lineTo(w*1.1,h);c.fill();
  c.strokeStyle='#8bd0bc';c.lineWidth=s*.004;c.beginPath();c.moveTo(w*.08,h*.858);c.bezierCurveTo(w*.28,h*.80,w*.38,h*.89,w*.59,h*.85);c.stroke();
  for(let i=0;i<17;i++){const xx=w*(.025+i*.059),yy=h*(.87+Math.sin(i*.8)*.026),rr=s*(.011+(i%4)*.002);sh13Yaprak(c,xx,yy,rr*.46,rr,-.65+Math.sin(i*2.1)*.6,i%2?'#396d70':'#4b8c82','#80b8a4');}
  // Ön kıyıda yumuşak filizler ve birkaç ay taç yaprağı büyür.
  for(let i=0;i<6;i++){const xx=w*(.045+i*.183),yy=h*(.91+Math.sin(i*2)*.017),kk=s*(.00065+(i%2)*.00013);sh13Fidan(c,xx,yy,kk,i%2?'#4f8d81':'#417b78');}
  c.fillStyle='rgba(169,209,182,.10)';for(let i=0;i<45;i++){const xx=w*(.03+((i*17)%89)/94),yy=h*(.87+(i%7)*.014),r=s*(.0015+(i%3)*.0006);c.beginPath();c.ellipse(xx,yy,r*1.7,r,-.5+i%2,0,sh13Tau);c.fill();}
  c.restore();
}
function sh13Aile(c,x,y,k,tm){
  c.save();c.translate(x,y);c.scale(k,k);c.lineCap='round';c.lineJoin='round';
  const b=Math.sin(tm*1.7)*.45,reach=.5+.5*Math.sin(tm*.65);
  // Anne ve çocuk aynı kökün üzerinde; küçük avuçları birbirine değiyor.
  c.strokeStyle='#343c59';c.lineWidth=12;c.beginPath();c.moveTo(-34,-39);c.lineTo(-39,-7);c.moveTo(-24,-39);c.lineTo(-17,-6);c.stroke();
  c.strokeStyle='#e9dfcf';c.lineWidth=7;c.beginPath();c.moveTo(-42,-3);c.lineTo(-31,-3);c.moveTo(-20,-3);c.lineTo(-8,-3);c.stroke();
  c.fillStyle='#fff7e9';c.beginPath();c.moveTo(-46,-70+b);c.quadraticCurveTo(-27,-78+b,-17,-63+b);c.lineTo(-15,-34);c.quadraticCurveTo(-33,-28,-47,-39);c.fill();
  c.strokeStyle='#d8cbbb';c.lineWidth=.7;c.beginPath();c.moveTo(-31,-71+b);c.quadraticCurveTo(-25,-63+b,-20,-67+b);c.stroke();c.fillStyle='#c1c9cd';c.beginPath();c.arc(-24,-65+b,1.1,0,sh13Tau);c.fill();
  c.fillStyle='#654432';c.beginPath();c.ellipse(-46,-76+b,7,15,-.32,0,sh13Tau);c.fill();
  c.save();c.translate(-33,-87+b);c.rotate(-.08-reach*.035);c.fillStyle='#f0c7ab';c.beginPath();c.ellipse(0,0,12,15,-.05,0,sh13Tau);c.fill();c.fillStyle='#654432';c.beginPath();c.ellipse(-3,-8,12,10,-.2,Math.PI*.8,Math.PI*2.1);c.fill();c.fillStyle='#303c41';c.beginPath();c.arc(6,-1,1.2,0,sh13Tau);c.fill();c.strokeStyle='#b47c75';c.lineWidth=1.2;c.beginPath();c.arc(9,4,3,.3,2.2);c.stroke();c.restore();
  c.strokeStyle='#efbd9d';c.lineWidth=5.6;c.beginPath();c.moveTo(-19,-61+b);c.quadraticCurveTo(-12,-45,-1,-43);c.stroke();c.strokeStyle='#fff7e9';c.lineWidth=10;c.beginPath();c.moveTo(-20,-63+b);c.lineTo(-16,-56+b);c.stroke();c.strokeStyle='#f0c7ab';c.lineWidth=5;c.beginPath();c.moveTo(-2,-43);c.lineTo(5,-42);c.stroke();
  c.strokeStyle='#ebddc6';c.lineWidth=8;c.beginPath();c.moveTo(13,-23);c.lineTo(10,-5);c.moveTo(22,-23);c.lineTo(27,-5);c.stroke();c.fillStyle='#fff3da';c.beginPath();c.ellipse(17,-33,12,17,-.06,0,sh13Tau);c.fill();
  c.fillStyle='#efc4a7';c.beginPath();c.ellipse(20,-58+b,11,13,0,0,sh13Tau);c.fill();c.fillStyle='#5d4635';c.beginPath();c.ellipse(17,-65+b,11,8,-.15,Math.PI*.8,Math.PI*2.1);c.fill();c.fillStyle='#303b40';c.beginPath();c.arc(26,-59+b,1.2,0,sh13Tau);c.fill();
  c.strokeStyle='#fff3da';c.lineWidth=6;c.beginPath();c.moveTo(10,-42);c.lineTo(4,-42);c.moveTo(25,-40);c.quadraticCurveTo(33,-41-reach*3,40,-43-reach*3);c.stroke();c.fillStyle='#efc4a7';c.beginPath();c.arc(42,-43-reach*3,3,0,sh13Tau);c.fill();c.fillStyle='#c5c8df';sh13Yildiz(c,17,-34,2.3);
  // Pırıl'ın tanıdık leylak/yeşil renkleri, önde açık bir ışık tohumu izliyor.
  const dy=-99+Math.sin(tm*2.4)*5;c.fillStyle='rgba(206,238,242,.48)';c.beginPath();c.ellipse(73,dy-5,16,5,-.5,0,sh13Tau);c.ellipse(77,dy+1,13,4,.15,0,sh13Tau);c.fill();c.fillStyle='#b49bd2';c.beginPath();c.ellipse(79,dy+5,14,10,.15,0,sh13Tau);c.ellipse(90,dy-3,10,11,-.1,0,sh13Tau);c.fill();c.fillStyle='#c2db88';c.beginPath();c.ellipse(83,dy+7,8,6,.2,0,sh13Tau);c.fill();c.fillStyle='#59865a';for(let i=0;i<3;i++){c.beginPath();c.ellipse(82+i*4,dy-12-i%2*2,2.5,4,-.3,0,sh13Tau);c.fill();}c.fillStyle='#305b45';c.beginPath();c.arc(94,dy-4,1.6,0,sh13Tau);c.fill();
  c.restore();
}
function sh13Kelebek(c,x,y,r,tm,a){
  const fl=.28+.72*Math.abs(Math.sin(tm*4.2));c.save();c.translate(x,y);c.rotate(Math.sin(tm*.9)*.12);c.globalAlpha*=a;
  c.fillStyle='#b9e9dc';c.beginPath();c.ellipse(-r*.5*fl,-r*.12,r*.54*fl,r*.65,-.35,0,sh13Tau);c.ellipse(r*.5*fl,-r*.12,r*.54*fl,r*.65,.35,0,sh13Tau);c.fill();c.fillStyle='#9eb5eb';c.beginPath();c.ellipse(-r*.4*fl,r*.42,r*.39*fl,r*.34,.4,0,sh13Tau);c.ellipse(r*.4*fl,r*.42,r*.39*fl,r*.34,-.4,0,sh13Tau);c.fill();c.strokeStyle='#edf8dc';c.lineWidth=Math.max(.5,r*.1);c.beginPath();c.moveTo(0,-r*.4);c.lineTo(0,r*.45);c.stroke();c.restore();
}
function sh13Dost(c,x,y,r,tm,a){
  c.save();c.translate(x,y);c.rotate(Math.sin(tm*.9)*.13);c.globalAlpha*=a;
  c.fillStyle='#d2e9dc';c.beginPath();for(let i=0;i<10;i++){const ang=-Math.PI*.5+i*Math.PI/5,rr=i%2?r*.65:r,px=Math.cos(ang)*rr,py=Math.sin(ang)*rr;i?c.quadraticCurveTo(Math.cos(ang-Math.PI/10)*r*.69,Math.sin(ang-Math.PI/10)*r*.69,px,py):c.moveTo(px,py);}c.closePath();c.fill();
  c.fillStyle='#405d6b';c.beginPath();c.ellipse(-r*.21,-r*.06,r*.07,r*.11,0,0,sh13Tau);c.ellipse(r*.21,-r*.06,r*.07,r*.11,0,0,sh13Tau);c.fill();c.strokeStyle='#668e95';c.lineWidth=Math.max(.4,r*.06);c.beginPath();c.arc(0,r*.10,r*.18,.1,Math.PI-.1);c.stroke();c.restore();
}
function sh13Canli(ox,oy,w,h,tm,a,hov){
  if(!(a>.01)||!(w>0&&h>0))return;const o=sh13Yer(w,h),s=o.s,t=tm*(1+.13*(hov||0));
  g.save();g.translate(ox,oy);g.beginPath();g.rect(0,0,w,h);g.clip();g.globalAlpha=a;
  sh13Glow(g,o.moonX,o.moonY,o.moonR*(1.17+.025*Math.sin(t*.7)),'#b8c7ff',.1);
  // Yapraklar esintiyi tek bir kare ritminde, küçük gecikmelerle izler.
  for(let i=0;i<SH13_YAPRAK.length;i++){
    const p=SH13_YAPRAK[i],sw=Math.sin(t*.9+i*.71)*.12,xx=o.treeX+(p[0]+Math.sin(t*.7+i)*2)*o.treeK,yy=o.treeY+(p[1]+Math.cos(t*.9+i)*1.6)*o.treeK,r=17*p[2]*o.treeK;
    const leaf=i%3===0?'#a5dfcc':i%3===1?'#76c4ba':'#91bdce';
    sh13Yaprak(g,xx-r*.48,yy+r*.70,r*.32,r*.62,p[3]-.8+sw,leaf,'#c8e8cf');
    if(i%3!==1)sh13Yaprak(g,xx+r*.55,yy+r*.5,r*.29,r*.58,p[3]+.75+sw,i%2?'#82adce':'#7ec4b3','#b9dfcf');
    sh13Yaprak(g,xx,yy,r*.60,r,p[3]+sw,leaf,'#e0f6d5');
    if(i%3===0){g.fillStyle='#ecf6c9';sh13Yildiz(g,xx,yy-r*.1,r*.19*(.85+.15*Math.sin(t*1.7+i)));}
  }
  const seedX=o.familyX+42*o.familyK,seedY=o.familyY-47*o.familyK;
  sh13Glow(g,seedX,seedY,s*.036,'#b7ffe4',.5+.1*Math.sin(t*1.5));g.fillStyle='#e2f5cf';sh13Yildiz(g,seedX,seedY,s*.006);
  sh13Aile(g,o.familyX,o.familyY,o.familyK,t);
  // Üç kök darbesi ağaca doğru gider; dünya küçük aileye yanıt veriyor.
  g.lineCap='round';for(let i=0;i<3;i++){
    const u=(t*.14+i*.34)%1,px=seedX+(o.treeX-seedX)*u,py=seedY+(o.treeY-seedY)*u+Math.sin(u*Math.PI)*s*.025;
    sh13Glow(g,px,py,s*.017,'#b7ffe4',Math.sin(u*Math.PI)*.45);g.fillStyle='#c4f2d6';g.globalAlpha=a*Math.sin(u*Math.PI)*.65;g.beginPath();g.arc(px,py,s*.0025,0,sh13Tau);g.fill();
  }g.globalAlpha=a;
  for(let i=0;i<7;i++){
    const u=(t*.026+i*.147)%1,xx=w*(.1+(i*.137)%.82)+Math.sin(t*.4+i)*s*.024,yy=h*(.84-u*.49),al=Math.sin(u*Math.PI)*.5;
    sh13Glow(g,xx,yy,s*.014,i%2?'#b8c7ff':'#b7ffe4',al*.48);g.globalAlpha=a*al;g.fillStyle=i%2?'#bed1f1':'#d2efcd';sh13Yildiz(g,xx,yy,s*(i%3===0?.004:.0027));
  }g.globalAlpha=a;
  const fly=(t*.021)%1;sh13Kelebek(g,w*(.13+fly*.69),h*.59+Math.sin(t*.7)*s*.025,s*.017,t,a*.65);
  const starX=w*(.21+.1*Math.sin(t*.27)),starY=h*.40+Math.sin(t*.65)*s*.022;
  sh13Glow(g,starX,starY,s*.03,'#b8c7ff',.18);sh13Dost(g,starX,starY,s*.013,t,.85);
  g.restore();
}
// Yaşayan ince dal: miras adı korunur, eski fiyonk/kumaş resmi çizilmez.
function sh13Kurdele(c,r,tm){
  c.save();c.lineCap='round';c.lineJoin='round';const sw=Math.sin(tm*1.3)*.04;
  c.strokeStyle='#70a9a0';c.lineWidth=r*.105;c.beginPath();c.moveTo(-r*.43,r*.58);c.bezierCurveTo(-r*.18,r*.26,-r*.3,-r*.18,r*.19,-r*.68);c.stroke();
  c.strokeStyle='#bbdfc5';c.lineWidth=r*.034;c.beginPath();c.moveTo(-r*.41,r*.53);c.bezierCurveTo(-r*.2,r*.23,-r*.25,-r*.16,r*.17,-r*.64);c.stroke();
  sh13Yaprak(c,-r*.34,-r*.02,r*.22,r*.43,-.73+sw,'#87c8ba','#d4efce');
  sh13Yaprak(c,r*.15,-r*.36,r*.18,r*.35,.58+sw,'#a6bfdf','#e3ecdb');
  c.strokeStyle='#d2efe0';c.lineWidth=r*.045;c.beginPath();c.moveTo(-r*.09,-r*.22);c.bezierCurveTo(r*.61,-r*.19,r*.6,r*.35,r*.12,r*.28);c.bezierCurveTo(-r*.15,r*.21,r*.03,r*.61,r*.4,r*.56);c.stroke();
  c.fillStyle='#ecf3c9';sh13Yildiz(c,r*.19,-r*.72,r*.13*(1+.08*Math.sin(tm*1.6)));c.restore();
}
function sh13Ikon(c,r){if(!c||!(r>0))return;sh13Kurdele(c,r*.88,0);}
function sh13Sabah(tm,a){
  if(!(a>.01)||typeof shOdaT!=='function')return;
  g.save();shOdaT();shPencereYol(g,0);g.clip();g.globalAlpha=a;
  if(!SH13.sabah){const gr=g.createLinearGradient(0,10,0,50);gr.addColorStop(0,'#b4d6e0');gr.addColorStop(.55,'#e8e8d3');gr.addColorStop(1,'#f5d9b7');SH13.sabah=gr;}
  g.fillStyle=SH13.sabah;g.fillRect(SH_PEN.x0-1,SH_PEN.ust-1,SH_PEN.x1-SH_PEN.x0+2,53-SH_PEN.ust);
  g.fillStyle='#dcebdc';g.beginPath();g.arc(34.2,21.4,3.25,0,sh13Tau);g.fill();g.fillStyle='rgba(163,191,197,.16)';g.beginPath();g.arc(33.3,21,0.7,0,sh13Tau);g.arc(35.1,22,.42,0,sh13Tau);g.fill();
  sh13Bulut(g,21,27,6,1.3,'#eaf0de','#faf7e2');sh13Bulut(g,37,32,7,1.4,'#dce9dc','#f2f5e2');
  g.fillStyle='#96b9bb';g.beginPath();g.moveTo(12,51);g.lineTo(12,42);g.bezierCurveTo(21,37,28,43,34,39);g.quadraticCurveTo(39,37,43,40);g.lineTo(43,51);g.fill();
  g.fillStyle='#82aaa1';g.beginPath();g.moveTo(12,51);g.lineTo(12,46);g.quadraticCurveTo(28,40,43,45);g.lineTo(43,51);g.fill();
  g.strokeStyle='#6f9b98';g.lineWidth=.28;g.lineCap='round';g.beginPath();g.moveTo(18,47);g.quadraticCurveTo(17,41,18.8,37);g.moveTo(18.1,42);g.quadraticCurveTo(15.5,41,14.7,39);g.stroke();sh13Yaprak(g,18.6,37,.7,1.5,.3,'#a5c7b7','#d8e6cb');sh13Yaprak(g,15,39,.6,1.2,-.6,'#abc9bd','#dde7cb');
  g.restore();g.save();shOdaT();g.globalAlpha=a;g.fillStyle=SH_SABAH.frame;g.fillRect((SH_PEN.x0+SH_PEN.x1)/2-.6,SH_PEN.ust,1.2,SH_PEN.alt-SH_PEN.ust);g.fillRect(SH_PEN.x0,31,SH_PEN.x1-SH_PEN.x0,1.2);g.restore();
}
function sh13Hediye(tm,a,uyan){
  if(!(a>.01)||typeof shOdaT!=='function')return;
  const kom=-(W/2+(sh.oxp||0))/sh.k0<-57.5,k=sh.k0*sh.zoom,x=kom?-55.5:-36.8,y=kom?SH_KOMODIN.ust-1.6:36.8,r=kom?2.25:2.6;
  const u=uyan>0&&uyan<1?Math.sin(uyan*Math.PI):0;
  g.save();g.setTransform(1,0,0,1,0,0);sh13Glow(g,shEkranX(x),shEkranY(y-r*.2),k*r*1.65,'#b7ffe4',a*(.16+.04*Math.sin(tm*1.3)+u*.1));g.restore();
  g.save();shOdaT();g.globalAlpha=a;g.fillStyle='rgba(68,105,96,.16)';g.beginPath();g.ellipse(x-r*.07,y+r*.68,r*.85,r*.10,0,0,sh13Tau);g.fill();g.translate(x,y);g.rotate(.07);sh13Kurdele(g,r,tm);g.restore();
  g.save();g.setTransform(1,0,0,1,0,0);for(let i=0;i<3;i++){const al=Math.pow(Math.max(0,Math.sin(tm*1.1+i*2.1)),2),xx=shEkranX(x+Math.sin(tm*.18+i*2.1)*r*.6),yy=shEkranY(y-r*.4+Math.cos(tm*.23+i)*r*.7);g.globalAlpha=a*al*.5;g.fillStyle=i%2?'#d8e7f0':'#e0efcb';sh13Yildiz(g,xx,yy,k*.11);}g.restore();
}
if(typeof SH_BALON_RENK!=='undefined')SH_BALON_RENK.ipek='#a1d9cd';
if(typeof SH_ONBELLEK!=='undefined'&&SH_ONBELLEK.indexOf('ipek')<0)SH_ONBELLEK.push('ipek');
if(typeof SH_KUR!=='undefined')SH_KUR.ipek=()=>{const A={c:null,W,H,adim:[()=>{A.c=shTuval();sh13Fon(A.c.getContext('2d'),W,H);} ]};return A;};

/* Gök bahçeleri: yaprak başına bükülen yüzey, ayrı taç yapraklar ve uzayan damarlar.
   x/y yüzen tabanın alt ortasıdır. Üç atlas sabittir; ciz yalnız bunları ve eğrileri kullanır. */
const IP13GARDEN=(()=>{
  const S={a:[null,null,null],next:0,halo:[null,null,null],core:[null,null,null],ms:0};
  const PAL=[['#1c4052','#5b9b8b','#a4d1ba','#dbe7cf','#7e7b9b'],['#342e61','#8e7cb9','#c3b1dc','#e6ddeb','#7663a6'],['#204b54','#61aa98','#aad3b9','#d8e9cb','#639ba0']];
  const CORE=['#efb7b1','#c9b7ed','#b9e6c7'];
  const CP=new Float64Array(8), PTS=new Float64Array(34), LEAF=new Float64Array(65), PI2=Math.PI*2;
  // Her dalda tohumdan uca doğru sıralanan ayrı yapraklar: t, açı, uzunluk, en, biçim, gecikme.
  const FORMS=[
    {spread:43,fronds:[{x:-61,y:-151,bend:-37,d:.03,end:.62,curl:-1,leaves:[[.28,-2.65,43,47,0,.15],[.57,-.72,39,40,0,.25],[.77,-2.25,32,35,1,.35]]},{x:61,y:-118,bend:31,d:.11,end:.73,curl:1,leaves:[[.32,-.5,44,45,0,.23],[.68,-2.3,34,39,1,.37]]}],cup:0},
    {spread:25,fronds:[{x:-10,y:-199,bend:-38,d:.015,end:.70,curl:1,leaves:[[.22,-2.5,42,37,1,.13],[.43,-.65,46,39,1,.22],[.64,-2.35,39,35,1,.34],[.81,-.6,31,30,1,.44]]},{x:78,y:-132,bend:19,d:.15,end:.82,curl:-1,leaves:[[.31,-.53,40,36,1,.27],[.66,-2.23,32,32,1,.42]]}],cup:1},
    {spread:61,fronds:[{x:-103,y:-101,bend:-29,d:.08,end:.66,curl:-1,leaves:[[.31,-2.75,49,56,0,.22],[.66,-1.05,40,46,2,.34]]},{x:56,y:-165,bend:39,d:.035,end:.76,curl:1,leaves:[[.25,-.45,49,54,0,.15],[.52,-2.1,43,45,2,.28],[.75,-.75,36,39,1,.42]]}],cup:2}
  ];
  const clamp=v=>v<0?0:v>1?1:v;
  const ease=v=>{v=clamp(v);return v*v*(3-2*v);};
  const phase=(v,a,b)=>clamp((v-a)/(b-a));
  function cv(w,h){const a=document.createElement('canvas');a.width=w;a.height=h;return a;}
  function rnd(seed){let n=seed>>>0;return()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
  function bloom(c,x,y,rx,ry,col,a){c.save();c.translate(x,y);c.scale(rx,ry);const gr=c.createRadialGradient(0,0,0,0,0,1);gr.addColorStop(0,col+Math.round(a*255).toString(16).padStart(2,'0'));gr.addColorStop(.42,col+Math.round(a*90).toString(16).padStart(2,'0'));gr.addColorStop(1,col+'00');c.fillStyle=gr;c.fillRect(-1,-1,2,2);c.restore();}
  function paintLeaf(c,k,type){
    const p=PAL[k],r=rnd(912+k*79+type*17),path=new Path2D();c.save();c.translate(64,180);path.moveTo(0,0);
    if(type===1){path.bezierCurveTo(-15,-22,-24,-40,-18,-62);path.bezierCurveTo(-28,-88,-18,-119,-6,-145);path.quadraticCurveTo(1,-162,5,-168);path.bezierCurveTo(19,-143,29,-119,20,-94);path.bezierCurveTo(29,-61,14,-28,0,0);}
    else if(type===2){path.bezierCurveTo(-23,-20,-44,-73,-31,-115);path.bezierCurveTo(-23,-149,-7,-163,2,-168);path.bezierCurveTo(27,-142,43,-106,31,-73);path.bezierCurveTo(25,-36,8,-13,0,0);}
    else{path.bezierCurveTo(-22,-22,-49,-76,-34,-117);path.bezierCurveTo(-28,-145,-8,-162,6,-168);path.bezierCurveTo(36,-132,45,-105,34,-79);path.bezierCurveTo(24,-33,12,-13,0,0);}path.closePath();
    const gr=c.createLinearGradient(-38,-159,35,-10);gr.addColorStop(0,p[3]);gr.addColorStop(.18,p[2]);gr.addColorStop(.56,p[1]);gr.addColorStop(1,p[0]);c.fillStyle=gr;c.fillRect(-64,-180,128,192);c.save();c.beginPath();c.rect(-64,-180,128,192);c.clip();bloom(c,-13,-117,33,67,p[3],.20);bloom(c,24,-55,27,66,p[4],.12);
    for(let j=0;j<100;j++){c.globalAlpha=.025+r()*.034;c.fillStyle=j%4?p[0]:p[3];c.beginPath();c.ellipse((r()-.5)*88,-r()*172,1+r()*7,.5+r()*1.7,-.3,0,PI2);c.fill();}c.globalAlpha=1;
    c.restore();c.restore();
  }
  function paintCloud(c,k,variant){
    const p=PAL[k],r=rnd(441+k*43+variant*13),x=64,y=80,w=variant===1?92:variant===2?98:96,h=variant===1?29:variant===2?31:33,path=new Path2D();
    path.moveTo(x-w*.47,y+h*.08);path.bezierCurveTo(x-w*.61,y-h*.65,x-w*.3,y-h*1.07,x-w*.16,y-h*.52);path.bezierCurveTo(x+w*.02,y-h*1.43,x+w*.32,y-h*.94,x+w*.34,y-h*.42);path.bezierCurveTo(x+w*.63,y-h*.67,x+w*.63,y+h*.41,x+w*.32,y+h*.53);path.bezierCurveTo(x+w*.09,y+h*.93,x-w*.15,y+h*.63,x-w*.22,y+h*.53);path.bezierCurveTo(x-w*.44,y+h*.7,x-w*.54,y+h*.3,x-w*.47,y+h*.08);path.closePath();
    const gr=c.createLinearGradient(0,y-h,0,y+h);gr.addColorStop(0,p[3]);gr.addColorStop(.2,p[2]);gr.addColorStop(.58,p[1]);gr.addColorStop(1,p[0]);c.fillStyle=gr;c.fill(path);c.save();c.clip(path);bloom(c,x-20,y-10,38,30,p[3],.25);bloom(c,x+31,y+6,45,27,p[4],.17);
    for(let j=0;j<75;j++){c.globalAlpha=.025+r()*.03;c.fillStyle=j%3?p[3]:p[0];c.beginPath();c.ellipse(x+(r()-.5)*118,y+(r()-.5)*48,2+r()*8,.6+r()*2,-.1,0,PI2);c.fill();}c.restore();c.globalAlpha=1;
  }
  function build(k){
    const a=cv(512,320),c=a.getContext('2d');for(let j=0;j<3;j++){c.save();c.beginPath();c.rect(j*128,0,128,192);c.clip();c.translate(j*128,0);paintLeaf(c,k,j);c.restore();c.save();c.beginPath();c.rect(j*128,192,128,128);c.clip();c.translate(j*128,192);paintCloud(c,k,j);c.restore();}
    c.save();c.beginPath();c.rect(384,192,128,128);c.clip();c.translate(448,256);bloom(c,0,0,43,48,CORE[k],.45);c.fillStyle=k===0?'#ffe2d5':k===1?'#ece1fb':'#e5f3d4';c.beginPath();c.ellipse(0,0,5,9.5,.18,0,PI2);c.fill();c.fillStyle='#ffffeb';c.beginPath();c.ellipse(-1.5,-3,1.4,3,.18,0,PI2);c.fill();c.restore();
    a.gardenKind=k;S.a[k]=a;S.halo[k]=sh13Halo(k===1?'#b8c7ff':'#b7ffe4');S.core[k]=sh13Halo(CORE[k]);
  }
  function isit(){if(S.next>=3)return true;const t=performance.now();build(S.next++);S.ms=Math.max(S.ms,performance.now()-t);return S.next>=3;}
  function curve(f,u,tm,k){
    const q=phase(u,f.d,f.end),e=ease(q),lag=Math.sin(q*PI2)*Math.pow(1-q,2),wind=Math.sin(tm*.63+k+f.x*.017)*e;
    CP[0]=0;CP[1]=-44;CP[6]=f.x*e+(f.x<0?-3:3)*(1-e)+lag*3;CP[7]=-60+(f.y+60)*e+wind*1.4;
    CP[2]=CP[6]*.12+wind*1.2;CP[3]=-44+(CP[7]+44)*.4;
    CP[4]=CP[6]+f.bend*e+f.curl*4*(1-e)+wind*2.1;CP[5]=CP[7]-(CP[7]+44)*.28;
    for(let j=0;j<=16;j++){const t=j/16,m=1-t;PTS[j*2]=m*m*m*CP[0]+3*m*m*t*CP[2]+3*m*t*t*CP[4]+t*t*t*CP[6];PTS[j*2+1]=m*m*m*CP[1]+3*m*m*t*CP[3]+3*m*t*t*CP[5]+t*t*t*CP[7];}
  }
  function stem(c,k,width){
    c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(PTS[0],PTS[1]);for(let j=1;j<=16;j++)c.lineTo(PTS[j*2],PTS[j*2+1]);c.strokeStyle=PAL[k][0];c.lineWidth=width+1.2;c.stroke();c.strokeStyle=PAL[k][1];c.lineWidth=width;c.stroke();c.strokeStyle=PAL[k][2]+'a0';c.lineWidth=.7;c.stroke();
  }
  // Kesintisiz kenar eğrisi; tek pigment yüzeyi ve kıvrımı izleyen damarlar.
  function leaf(c,a,type,x,y,len,width,ang,curl,view,n){
    const count=n<5?8:12,dl=len/count,k=a.gardenKind,p=PAL[k];let px=x,py=y,minX=x,maxX=x,minY=y,maxY=y;
    for(let j=0;j<=count;j++){
      const t=j/count,th=ang+curl*t*t,co=Math.cos(th),si=Math.sin(th),profile=Math.pow(Math.max(0,Math.sin(Math.PI*t)),type===1?.88:.70)*(type===1?.84:type===2?.93+.12*t:1+.10*Math.sin(t*PI2)),hw=width*view*.33*profile,q=j*5;
      LEAF[q]=px;LEAF[q+1]=py;LEAF[q+2]=-si;LEAF[q+3]=co;LEAF[q+4]=hw;
      const lx=px-si*hw,rx=px+si*hw,ly=py+co*hw,ry=py-co*hw;minX=Math.min(minX,lx,rx);maxX=Math.max(maxX,lx,rx);minY=Math.min(minY,ly,ry);maxY=Math.max(maxY,ly,ry);
      if(j<count){const m=(j+.5)/count,mid=ang+curl*m*m;px+=Math.cos(mid)*dl;py+=Math.sin(mid)*dl;}
    }
    c.beginPath();c.moveTo(x,y);
    for(let j=1;j<count;j++){const q=j*5,r=(j+1)*5,lx=LEAF[q]+LEAF[q+2]*LEAF[q+4],ly=LEAF[q+1]+LEAF[q+3]*LEAF[q+4],nx=LEAF[r]+LEAF[r+2]*LEAF[r+4],ny=LEAF[r+1]+LEAF[r+3]*LEAF[r+4];c.quadraticCurveTo(lx,ly,(lx+nx)*.5,(ly+ny)*.5);}
    c.lineTo(LEAF[count*5],LEAF[count*5+1]);
    for(let j=count-1;j>0;j--){const q=j*5,r=(j-1)*5,rx=LEAF[q]-LEAF[q+2]*LEAF[q+4],ry=LEAF[q+1]-LEAF[q+3]*LEAF[q+4],nx=LEAF[r]-LEAF[r+2]*LEAF[r+4],ny=LEAF[r+1]-LEAF[r+3]*LEAF[r+4];c.quadraticCurveTo(rx,ry,(rx+nx)*.5,(ry+ny)*.5);}c.closePath();
    if(n<5){c.fillStyle=p[1];c.fill();}
    else{c.save();c.clip();c.drawImage(a,type*128,0,128,192,minX-1,minY-1,Math.max(.1,maxX-minX+2),Math.max(.1,maxY-minY+2));c.restore();}
    c.strokeStyle=p[3]+'60';c.lineWidth=n<5?.55:.66;c.beginPath();c.moveTo(x,y);for(let j=1;j<=count;j++)c.lineTo(LEAF[j*5],LEAF[j*5+1]);c.stroke();
    if(n>=5&&width*view>12){c.strokeStyle=p[2]+'3b';c.lineWidth=.45;for(let j=3;j<count-1;j+=3){const q=j*5,r=(j+1)*5;c.beginPath();c.moveTo(LEAF[q],LEAF[q+1]);c.quadraticCurveTo(LEAF[r]+LEAF[r+2]*LEAF[r+4]*.23,LEAF[r+1]+LEAF[r+3]*LEAF[r+4]*.23,LEAF[r]+LEAF[r+2]*LEAF[r+4]*.75,LEAF[r+1]+LEAF[r+3]*LEAF[r+4]*.75);c.stroke();}}
  }
  function pearl(c,a,x,y,size,tm,k,alpha){c.save();c.globalAlpha*=alpha;c.drawImage(S.core[k],x-size*1.65,y-size*1.65,size*3.3,size*3.3);c.globalAlpha*=.72+.12*Math.sin(tm*1.4+k);c.drawImage(a,386,194,124,124,x-size*.96875,y-size*.96875,size*1.9375,size*1.9375);c.restore();}
  function terminal(c,a,f,u,tm,k,n){
    const q=phase(u,f.d+.21,Math.min(1,f.end+.28)),e=ease(q),x=CP[6],y=CP[7],sway=Math.sin(tm*.8+k+f.x)*.035*e;
    pearl(c,a,x,y-8,11,tm,k,.18+.54*e);
    leaf(c,a,2,x-2,y+1,22,27,-Math.PI*.5-.97*e+sway,-.25-.46*Math.sin(Math.PI*e),.86,Math.min(n,5));
    leaf(c,a,2,x+2,y+1,19,25,-Math.PI*.5+.94*e+sway,.25+.42*Math.sin(Math.PI*e),.86,Math.min(n,5));
  }
  function drawFrond(c,a,f,u,tm,k,n){
    curve(f,u,tm,k);stem(c,k,k===1?3.3:3.7);
    for(let j=0;j<f.leaves.length;j++){const l=f.leaves[j],t=l[0],m=1-t,x=m*m*m*CP[0]+3*m*m*t*CP[2]+3*m*t*t*CP[4]+t*t*t*CP[6],y=m*m*m*CP[1]+3*m*m*t*CP[3]+3*m*t*t*CP[5]+t*t*t*CP[7],dx=3*m*m*(CP[2]-CP[0])+6*m*t*(CP[4]-CP[2])+3*t*t*(CP[6]-CP[4]),dy=3*m*m*(CP[3]-CP[1])+6*m*t*(CP[5]-CP[3])+3*t*t*(CP[7]-CP[5]),q=phase(u,l[5],Math.min(1,l[5]+.43)),e=ease(q),side=l[1]<-1.6?-1:1,fold=Math.atan2(dy,dx)+side*.13,settle=Math.sin(q*PI2)*Math.pow(1-q,2)*.16,ang=fold+(l[1]-fold)*e+side*settle+Math.sin(tm*.76+j*.8+k)*.035*e;
      leaf(c,a,l[4],x,y,l[2],l[3],ang,side*(2.65*(1-e)+.13)+Math.sin(tm*.7+j)*.04*e,.10+.90*e,n);
    }
    const rise=phase(u,f.d+.04,f.end),m=1-rise,xx=m*m*m*CP[0]+3*m*m*rise*CP[2]+3*m*rise*rise*CP[4]+rise*rise*rise*CP[6],yy=m*m*m*CP[1]+3*m*m*rise*CP[3]+3*m*rise*rise*CP[5]+rise*rise*rise*CP[7];
    if(rise>.002&&rise<.998){c.save();c.globalAlpha*=Math.sin(rise*Math.PI)*.22;c.drawImage(S.core[k],xx-9,yy-9,18,18);c.restore();}
    terminal(c,a,f,u,tm,k,n);
  }
  function sepal(c,a,k,u,tm,n){
    const q0=phase(u,.025,.58),q1=phase(u,.10,.69),q2=phase(u,.20,.83),e0=ease(q0),e1=ease(q1),e2=ease(q2),sway=Math.sin(tm*.7+k)*.028;
    pearl(c,a,k===2?-3:0,-72+8*e1,14,tm,k,.24+.62*e1);
    leaf(c,a,2,-4,-43,45,k===2?53:46,-Math.PI*.5-1.1*e0+sway,-.12-.64*Math.sin(q0*Math.PI),.82+.13*e0,n);
    leaf(c,a,2,4,-43,41,k===2?51:42,-Math.PI*.5+1.05*e1+sway,.13+.64*Math.sin(q1*Math.PI),.87+.1*e1,n);
    leaf(c,a,k===1?1:0,1,-41,34,k===2?49:40,-Math.PI*.5+.37*e2+sway*.7,.10+.67*Math.sin(q2*Math.PI),.74+.18*e2,n);
  }
  function ciz(x,y,scale,kind,open,tm){
    if(typeof g==='undefined'||!Number.isFinite(x)||!Number.isFinite(y)||!Number.isFinite(scale)||!(scale>0))return;
    const k=kind===1?1:kind===2?2:0,a=S.a[k];if(!a)return;
    const c=g,u=Number.isFinite(open)?clamp(open):1,t=Number.isFinite(tm)?tm:0,F=FORMS[k],e=ease(u),n=scale<.46?4:8,spread=9+(F.spread-9)*ease(phase(u,0,.74));
    c.save();c.translate(x,y);c.scale(scale,scale);c.translate(0,Math.sin(t*.67+k*1.7)*1.4);
    c.save();c.globalAlpha*=.10+.09*e;c.drawImage(S.halo[k],-127,-183,254,231);c.restore();
    // İki piksellik atlas payı, üstteki pigment satırının örneklemeye sızmasını önler.
    c.drawImage(a,130,194,124,124,-62+spread,-111,124,124);c.drawImage(a,2,194,124,124,-62-spread,-109,124,124);
    for(let j=0;j<F.fronds.length;j++)drawFrond(c,a,F.fronds[j],u,t,k,n);
    c.drawImage(a,258,194,124,124,-62+Math.sin(t*.8+k)*1.4,-105,124,124);
    sepal(c,a,k,u,t,n);
    c.strokeStyle=PAL[k][1]+'85';c.lineWidth=.9;c.lineCap='round';for(let j=0;j<3;j++){const xx=(j-1)*spread*.7,len=9+j%2*5;c.beginPath();c.moveTo(xx,-12);c.bezierCurveTo(xx-4,-7,xx+5,-len*.3,xx+Math.sin(t*.5+j)*2,-1);c.stroke();}
    c.restore();
  }
  return{isit,ciz,hazir:()=>S.next===3,bounds:{x0:-160,y0:-248,x1:160,y1:4},state:()=>({ready:S.next===3,atlases:S.next,maxBuildMs:S.ms,rig:'petal-curves',bytes:512*320*4*S.next})};
})();
if(typeof window!=='undefined')window.IP13GARDEN=IP13GARDEN;
