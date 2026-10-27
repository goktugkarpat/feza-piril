/* sahne12.js — Kampüs rüyasının seçim kavanozu ve sabah hatırası.
   sh12Fon(c,w,h): durağan ve önbelleğe alınabilir minyatür.
   sh12Canli(ox,oy,w,h,tm,a,hov): global g üzerinde hafif hareketli katman.
   sh12Ikon(c,r), sh12Sabah(tm,a), sh12Hediye(tm,a): sahne.js arayüzü.
   Gerçek fotoğraf içermez; çizimler kampüsün biçimlerinden esinlenen özgün yorumlardır. */
'use strict';

// Duru gökyüzü, gölet, yeşil kıyı, kubbeli Bilgi Merkezi ve gözlem kulesi.
function sh12Fon(c,w,h) {
  if (!(w>0 && h>0)) return;
  c.save(); c.scale(w/1000,h/1000); c.lineJoin='round'; c.lineCap='round';
  let sky=c.createLinearGradient(0,0,0,1000);
  sky.addColorStop(0,'#8bd6ef'); sky.addColorStop(.48,'#c5eced'); sky.addColorStop(1,'#f8dfc6');
  c.fillStyle=sky; c.fillRect(0,0,1000,1000);
  c.fillStyle='#fff1bd'; c.beginPath(); c.arc(760,190,76,0,6.2832); c.fill();
  c.fillStyle='rgba(255,255,255,.68)';
  for(const [x,y,r] of [[130,182,44],[175,169,55],[224,185,37],[528,114,35],[566,99,42],[605,115,31]]) {c.beginPath();c.arc(x,y,r,0,6.2832);c.fill();}
  c.fillStyle='#a5d3c1'; c.beginPath(); c.moveTo(0,617);c.quadraticCurveTo(180,469,360,550);c.quadraticCurveTo(550,431,740,528);c.quadraticCurveTo(900,470,1000,526);c.lineTo(1000,1000);c.lineTo(0,1000);c.fill();
  // Uzak akademik binalar: açık sıva, kırmızı-kiremit cephe ve pencereler.
  c.fillStyle='#e5e2d4';c.fillRect(506,440,390,184);c.fillStyle='#bd7d76';c.fillRect(506,440,390,30);c.fillStyle='#a4c8d2';
  for(let row=0;row<3;row++)for(let i=0;i<10;i++)c.fillRect(520+i*37,486+row*39,24,21);
  c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;c.beginPath();c.moveTo(506,477);c.lineTo(896,477);c.stroke();
  // Kampüsün düz, yüksek kulesi; üstte geniş gözlem bölümü ve ince çatı.
  c.fillStyle='#8a8d84';c.fillRect(210,302,48,324);c.fillStyle='#d3d2c0';c.fillRect(214,306,31,319);
  c.fillStyle='#697c79';c.fillRect(196,280,76,48);c.fillStyle='#d6dfd5';c.fillRect(203,285,62,7);
  c.fillStyle='#879d9b';for(let i=0;i<4;i++)c.fillRect(203+i*15,296,11,19);
  c.fillStyle='#aaa89a';c.fillRect(192,271,84,10);c.fillStyle='#e4e5d6';c.fillRect(202,264,64,8);
  c.strokeStyle='rgba(255,255,255,.48)';c.lineWidth=3;c.beginPath();c.moveTo(222,330);c.lineTo(222,618);c.stroke();
  // Bilgi Merkezi: yuvarlak gövde ve kampüs fotoğraflarından tanınan geniş kubbe.
  c.fillStyle='#b66b62';c.fillRect(318,515,245,111);c.fillStyle='#d8d3c5';c.fillRect(330,525,221,101);
  c.fillStyle='#9cc1ca';for(let i=0;i<7;i++)c.fillRect(339+i*30,542,20,50);
  c.fillStyle='#81979b';c.beginPath();c.moveTo(310,518);c.bezierCurveTo(325,468,367,430,440,430);c.bezierCurveTo(510,430,550,468,570,518);c.closePath();c.fill();
  c.fillStyle='#b6cbca';c.beginPath();c.moveTo(329,508);c.bezierCurveTo(355,455,388,444,440,444);c.bezierCurveTo(469,444,485,451,504,462);c.bezierCurveTo(451,447,390,467,363,508);c.closePath();c.fill();
  c.fillStyle='#e6ddd1';c.fillRect(309,510,262,13);
  // Kıyı ve gölet: suda binaların yumuşak renkleri, gerçekçi ama masalsı.
  c.fillStyle='#75bca2';c.beginPath();c.moveTo(0,623);c.quadraticCurveTo(270,590,456,637);c.quadraticCurveTo(690,591,1000,650);c.lineTo(1000,1000);c.lineTo(0,1000);c.fill();
  c.fillStyle='#74c5d0';c.beginPath();c.moveTo(0,688);c.bezierCurveTo(210,643,535,660,785,680);c.bezierCurveTo(920,691,980,729,1000,775);c.lineTo(1000,885);c.bezierCurveTo(770,917,342,887,0,819);c.closePath();c.fill();
  c.fillStyle='rgba(238,250,231,.45)';c.beginPath();c.ellipse(596,701,213,6,0,0,6.2832);c.ellipse(360,737,108,4,0,0,6.2832);c.fill();
  c.fillStyle='#aed2b4';c.beginPath();c.moveTo(0,850);c.bezierCurveTo(255,803,490,925,1000,844);c.lineTo(1000,1000);c.lineTo(0,1000);c.fill();
  c.fillStyle='#e8d5b3';c.beginPath();c.moveTo(376,1000);c.bezierCurveTo(410,919,521,907,580,887);c.quadraticCurveTo(620,877,650,881);c.bezierCurveTo(580,908,505,938,496,1000);c.fill();
  // Önde iki sakura; açık gövde değil, çiçek kümesi ve yapraklar.
  for(const [x,y,s,dir] of [[92,854,1,1],[918,858,.9,-1]]) {
    c.strokeStyle='#70554e';c.lineWidth=23*s;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-dir*20*s,y-175*s,x+dir*12*s,y-315*s);c.stroke();
    c.lineWidth=9*s;c.beginPath();c.moveTo(x-dir*7*s,y-205*s);c.quadraticCurveTo(x+dir*54*s,y-266*s,x+dir*72*s,y-315*s);c.moveTo(x-dir*5*s,y-210*s);c.lineTo(x-dir*52*s,y-285*s);c.stroke();
    for(const [dx,dy,r] of [[-80,-302,53],[-43,-350,65],[8,-354,71],[64,-335,61],[95,-295,50],[-3,-286,70]]) {
      c.fillStyle=(dx%2?'#efa5ba':'#f6c1cf');c.beginPath();c.arc(x+dx*s,y+dy*s,r*s,0,6.2832);c.fill();
      c.fillStyle='rgba(255,243,239,.42)';c.beginPath();c.arc(x+(dx-10)*s,y+(dy-13)*s,r*.48*s,0,6.2832);c.fill();
    }
  }
  // Anne ve Feza el ele: yakın, okunabilir minyatür; özel bir fotoğraf kullanılmaz.
  c.strokeStyle='#755d61';c.lineWidth=8;c.beginPath();c.moveTo(710,894);c.lineTo(716,850);c.lineTo(727,820);c.moveTo(752,900);c.lineTo(748,875);c.lineTo(742,856);c.moveTo(724,839);c.lineTo(743,857);c.stroke();
  c.fillStyle='#f9f6e8';c.beginPath();c.ellipse(717,847,17,30,0,0,6.2832);c.fill();
  c.fillStyle='#f2c4a6';c.beginPath();c.arc(718,810,15,0,6.2832);c.arc(744,847,10,0,6.2832);c.fill();
  c.fillStyle='#59413a';c.beginPath();c.arc(717,805,14,Math.PI,Math.PI*2);c.fill();c.beginPath();c.arc(743,843,10,Math.PI,Math.PI*2);c.fill();
  c.fillStyle='#e7b3cc';c.beginPath();c.ellipse(745,869,11,18,0,0,6.2832);c.fill();
  c.restore();
}

function sh12Canli(ox,oy,w,h,tm,a,hov) {
  if (!(a>.01) || !(w>0 && h>0)) return;
  const t=tm*(1+(hov||0)*.18), s=Math.min(w,h);
  g.save();g.globalAlpha=a*.72;g.lineCap='round';
  // Suyun üstünde yavaş kayan üç ince ışık çizgisi.
  g.strokeStyle='#e4fbfa';g.lineWidth=Math.max(.7,s*.004);
  for(let i=0;i<3;i++){const x=ox+w*(.26+i*.20+.025*Math.sin(t*.7+i)),y=oy+h*(.704+i*.027);g.beginPath();g.moveTo(x-s*.045,y);g.quadraticCurveTo(x,y-s*.006,x+s*.045,y);g.stroke();}
  // Uçuşan iri ama az sayıda sakura yaprağı.
  g.fillStyle='#fff0f2';for(let i=0;i<7;i++){const q=(t*.07+i*.19)%1,x=ox+w*((.1+i*.13+q*.12)%1),y=oy+h*(.31+q*.52);g.save();g.translate(x,y);g.rotate(t*.8+i);g.beginPath();g.ellipse(0,0,s*.008,s*.014,0,0,6.2832);g.fill();g.restore();}
  g.restore();
}

function sh12Ikon(c,r) {
  if (!(r>0)) return; c.save();c.lineJoin='round';c.lineCap='round';
  // Kule ve mavi gölet: küçücük etikette dahi ayırt edilir siluet.
  c.fillStyle='#b9e9e8';c.beginPath();c.arc(0,0,r*.96,0,6.2832);c.fill();
  c.fillStyle='#d4d5c5';c.fillRect(-r*.57,-r*.62,r*.23,r*1.16);c.fillStyle='#879c9a';c.fillRect(-r*.63,-r*.75,r*.35,r*.18);
  c.fillStyle='#decab9';c.fillRect(-r*.12,-r*.08,r*.77,r*.53);c.fillStyle='#9db4b1';c.beginPath();c.moveTo(-r*.2,-r*.08);c.quadraticCurveTo(r*.24,-r*.72,r*.72,-r*.08);c.fill();
  c.fillStyle='#72bfca';c.beginPath();c.ellipse(r*.12,r*.66,r*.77,r*.19,0,0,6.2832);c.fill();
  c.fillStyle='#f0a9bc';c.beginPath();c.arc(-r*.62,r*.33,r*.22,0,6.2832);c.arc(r*.72,r*.31,r*.21,0,6.2832);c.fill();c.restore();
}

let sh12SabahGr=null;
function sh12Sabah(tm,a) {
  if (!(a>.01)) return;
  g.save();shOdaT();shPencereYol(g,0);g.clip();g.globalAlpha=a;
  if(!sh12SabahGr){sh12SabahGr=g.createLinearGradient(0,SH_PEN.ust,0,48);sh12SabahGr.addColorStop(0,'#a7dbee');sh12SabahGr.addColorStop(.7,'#f8d8cb');sh12SabahGr.addColorStop(1,'#fce8cc');}
  g.fillStyle=sh12SabahGr;g.fillRect(SH_PEN.x0-1,SH_PEN.ust-1,SH_PEN.x1-SH_PEN.x0+2,52-SH_PEN.ust);
  g.fillStyle='#f9ecc0';g.beginPath();g.arc(34,21,2.3,0,6.2832);g.fill();
  g.fillStyle='#a7ccb0';g.beginPath();g.moveTo(13,46);g.lineTo(13,38);g.quadraticCurveTo(27,33,42,39);g.lineTo(42,50);g.lineTo(13,50);g.fill();
  g.fillStyle='#c8d3ca';g.fillRect(17.7,27,2.1,13);g.fillStyle='#839b97';g.fillRect(17.2,26,3.1,1.3);
  g.fillStyle='#e7d4c6';g.fillRect(24,35,9.4,5.3);g.fillStyle='#9bb5b2';g.beginPath();g.moveTo(23.4,35);g.quadraticCurveTo(28.7,28.2,33.8,35);g.fill();
  g.fillStyle='#95d7db';g.beginPath();g.ellipse(29,44,10,2.2,0,0,6.2832);g.fill();
  g.fillStyle='#efb7c4';for(const q of [[15.5,36,2.3],[37.3,37,2.6]]){g.beginPath();g.arc(q[0],q[1],q[2],0,6.2832);g.fill();}
  g.restore();g.save();shOdaT();g.globalAlpha=a;g.fillStyle=SH_SABAH.frame;const cx=(SH_PEN.x0+SH_PEN.x1)/2;g.fillRect(cx-.6,SH_PEN.ust,1.2,SH_PEN.alt-SH_PEN.ust);g.fillRect(SH_PEN.x0,31,SH_PEN.x1-SH_PEN.x0,1.2);g.restore();
}

function sh12Hediye(tm,a) {
  if (!(a>.01)) return;
  const kom=-(W/2+(sh.oxp||0))/sh.k0 < -57.5, x=kom?-55.4:-40.2, y=kom?SH_KOMODIN.ust-.05:38;
  g.save();shOdaT();g.globalAlpha=a;g.translate(x,y);g.lineJoin='round';
  // Sıcak bir çerçevede iki küçük el ele siluet ve kule: anneli rüyanın hatırası.
  g.fillStyle='rgba(83,57,57,.18)';g.beginPath();g.ellipse(0,.1,3.8,.42,0,0,6.2832);g.fill();
  g.fillStyle='#b98c69';g.fillRect(-3.3,-6.1,6.6,6.1);g.fillStyle='#f8e7d0';g.fillRect(-2.9,-5.7,5.8,5.3);
  g.fillStyle='#b7dede';g.fillRect(-2.6,-5.4,5.2,4.7);g.fillStyle='#c5d4c3';g.fillRect(-2.3,-4.5,.65,2.8);g.fillStyle='#8da6a2';g.fillRect(-2.5,-4.8,1.05,.35);
  g.fillStyle='#bad8b5';g.fillRect(-2.6,-1.8,5.2,1.1);
  g.strokeStyle='#74564d';g.lineWidth=.32;g.beginPath();g.moveTo(-.6,-1.3);g.lineTo(-.5,-3.1);g.moveTo(1,-1.3);g.lineTo(.9,-2.5);g.moveTo(-.4,-2.5);g.lineTo(.8,-2.1);g.stroke();
  g.fillStyle='#f3c5a6';g.beginPath();g.arc(-.5,-3.2,.55,0,6.2832);g.arc(.9,-2.65,.38,0,6.2832);g.fill();
  g.fillStyle='#5b433d';g.beginPath();g.arc(-.5,-3.4,.56,Math.PI,Math.PI*2);g.arc(.9,-2.8,.38,Math.PI,Math.PI*2);g.fill();
  g.fillStyle='#f7f3e9';g.fillRect(-.9,-2.7,.8,1);g.fillStyle='#e5a9c4';g.fillRect(.6,-2.3,.7,.7);
  g.fillStyle='#eeb3c5';g.beginPath();g.arc(2.6,-5.7,.5,0,6.2832);g.arc(3,-5.3,.42,0,6.2832);g.fill();g.restore();
}

if (typeof SH_KUR !== 'undefined') SH_KUR.kampus = () => {
  const A={c:null,W,H,adim:[()=>{A.c=shTuval();sh12Fon(A.c.getContext('2d'),W,H);} ]}; return A;
};
