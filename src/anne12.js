/* anne12.js — Sabancı rüyası için Feza'nın annesi.
   Kaynak fotoğraf dosyası içermez. Ayağa göre çizilir; parametreler dünya birimidir.
   anne12Ciz(ctx,x,y,scale,time,{poz,yon,hareket}) bağımsız kullanılabilir.
   ANNE12.reset(player); ANNE12.adim(dt,player,yerY); ANNE12.ciz(ctx,time,options)
   yerY(x) dünya koordinatında yürünebilir zemin yüksekliğini döndürür.
   poz: dur, yuru, el, saril, kayik, dans. */
'use strict';

function anne12Ciz(c, x, y, scale, tm, opt) {
  if (!c || !Number.isFinite(x) || !Number.isFinite(y)) return;
  opt = opt || {}; tm = Number.isFinite(tm) ? tm : 0;
  const poz = opt.poz || 'dur', yon = opt.yon === -1 ? -1 : 1;
  const yuru = poz === 'yuru', dans = poz === 'dans', otur = poz === 'kayik';
  // Scooter'a eşlik ederken adım zamanı değil, yerde kat edilen mesafe esas alınır.
  const kosu = opt.kosu === true && Number.isFinite(opt.kosuMesafe);
  const hareket = Number.isFinite(opt.hareket) ? Math.max(0, Math.min(1, opt.hareket)) : (yuru ? 1 : 0);
  const faz = kosu ? opt.kosuMesafe / (200/3) : 0;
  const adim = Math.sin(kosu ? faz * Math.PI * 2 : tm * 7.2) * hareket;
  const nefes = Math.sin(tm * 1.9) * 0.55;
  const sal = dans ? Math.sin(tm * 3.0) : 0;
  const kip = ((tm + 0.7) % 4.9 < 0.13);
  const stroke = (col,w) => { c.strokeStyle=col; c.lineWidth=w; c.lineCap='round'; c.lineJoin='round'; c.stroke(); };
  const fill = col => { c.fillStyle=col; c.fill(); };
  const oval = (px,py,rx,ry,col,rot=0) => { c.beginPath(); c.ellipse(px,py,rx,ry,rot,0,Math.PI*2); fill(col); };
  const limb = (p0,p1,p2,width,color,edge) => { c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]); stroke(edge,width+2.1);c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);stroke(color,width); };
  c.save(); c.translate(x,y); c.scale((scale || 1)*yon,scale || 1);
  // Karakterin yerdeki yumuşak ve sabit gölgesi.
  oval(0,0,18,3,'rgba(50,45,63,.15)');
  if (otur) { c.translate(0,18); c.scale(1,.88); }
  c.translate(sal*1.1, Math.abs(adim)*-0.9);
  // Arka ayak ve pantolon; yürürken adımlar karşılıklı, eklemler yumuşak.
  const l = adim*4;
  if(kosu){
    // Basma evresindeki 40 birimlik geri kayma, bedenin aynı süredeki ileri
    // hareketini dengeler; diğer evrede ayak yumuşak bir yayla öne taşınır.
    const ayak=f=>{const p=((f%1)+1)%1;if(p<.6)return {dx:20-40*p/.6,dy:0};
      const u=(p-.6)/.4,e=u*u*(3-2*u);return {dx:-20+40*e,dy:-7*Math.sin(Math.PI*u)};};
    const b=ayak(faz),f=ayak(faz+.5);
    limb([-6,-39],[-8+b.dx*.35,-19+b.dy*.45],[-8+b.dx,-4+b.dy],8,'#5a7080','#455967');
    oval(-8+b.dx,-3+b.dy,8,3.2,'#ece4db',-.05);oval(-6+b.dx,-4.3+b.dy,6,1.2,'#fff8ed',-.05);
    limb([5,-39],[7+f.dx*.35,-19+f.dy*.45],[7+f.dx,-4+f.dy],8,'#6a8190','#4b6070');
    oval(8+f.dx,-3+f.dy,8,3.2,'#f6eee3',-.05);oval(10+f.dx,-4.4+f.dy,5.5,1.2,'#ffffff',-.05);
  }else{
    limb([-6,-39],[-8-l*.3,-19],[-8-l, -4],8,'#5a7080','#455967');
    oval(-8-l,-3,8,3.2,'#ece4db',-.05); oval(-6-l,-4.3,6,1.2,'#fff8ed',-.05);
    limb([5,-39],[7+l*.35,-19],[7+l,-4],8,'#6a8190','#4b6070');
    oval(8+l,-3,8,3.2,'#f6eee3',-.05); oval(10+l,-4.4,5.5,1.2,'#ffffff',-.05);
  }
  // Saç topuzu başın arkasında; omuzlar ve gerideki kol.
  oval(-13,-83,8.5,10,'#49372f',-.3); oval(-15,-84,5.4,7,'#634a3b',-.3);
  c.beginPath();c.moveTo(-12,-92);c.bezierCurveTo(-20,-85,-21,-74,-16,-65);c.quadraticCurveTo(-11,-64,-9,-72);c.lineTo(-8,-87);c.closePath();fill('#503a31');
  c.beginPath();c.moveTo(-16,-84);c.quadraticCurveTo(-19,-76,-16,-69);stroke('#806050',.65);
  const armSwing = (yuru || kosu) ? adim*4 : 0;
  const rear = poz === 'saril' ? [-14,-61] : poz === 'el' ? [-20,-61] : [-15+armSwing,-49];
  limb([-11,-72],[-18,-60],rear,6,'#dfa990','#b78574');
  oval(rear[0],rear[1],3.6,4.1,'#f0bea1');
  // Beyaz bluzun gövdesi, yan gölgesi, kıvrımları ve yakası.
  c.beginPath();c.moveTo(-11,-78);c.bezierCurveTo(-17,-75,-18,-67,-17,-60);c.lineTo(-16,-43);c.quadraticCurveTo(0,-38,16,-43);c.lineTo(16,-64);c.bezierCurveTo(17,-73,12,-77,8,-78);c.closePath();fill('#f9f8f1');stroke('#c5cfd0',1.3);
  c.beginPath();c.moveTo(-15,-70);c.quadraticCurveTo(-11,-61,-13,-46);c.lineTo(-16,-44);c.closePath();fill('#e4ecea');
  // Kumaşın içindeki çok hafif gölge ve sıcak kenar ışığı: mevcut siluete
  // dokunmadan derinlik verir; gradyan/filtre/ek tuval oluşturmaz.
  c.beginPath();c.moveTo(-5,-71);c.bezierCurveTo(-2,-64,-3,-53,-4,-45);c.quadraticCurveTo(1,-44,5,-45);c.bezierCurveTo(7,-54,7,-64,4,-71);c.closePath();fill('rgba(186,202,194,.13)');
  c.beginPath();c.moveTo(8,-73);c.bezierCurveTo(12,-67,11,-55,10,-48);c.lineTo(13,-46);c.bezierCurveTo(15,-56,14,-69,12,-74);c.closePath();fill('rgba(255,239,210,.22)');
  c.beginPath();c.moveTo(-8,-76);c.quadraticCurveTo(0,-68,8,-76);stroke('#c9d3d0',1.1);
  c.beginPath();c.moveTo(-11,-46);c.quadraticCurveTo(0,-43,11,-46);stroke('#d5dedb',.8);
  c.beginPath();c.moveTo(-7,-64);c.quadraticCurveTo(-6,-58,-7,-52);stroke('#e5ece8',.8);
  c.beginPath();c.moveTo(7,-64);c.quadraticCurveTo(6,-58,8,-52);stroke('#e5ece8',.8);
  // Yaka ve kısa kıvrımlı kollar: fotoğraftaki beyaz, geniş yakalı bluz.
  c.beginPath();c.moveTo(-12,-77);c.quadraticCurveTo(-18,-75,-19,-69);c.quadraticCurveTo(-16,-66,-12,-67);c.lineTo(-9,-74);c.closePath();fill('#f6f5ef');
  c.beginPath();c.moveTo(10,-77);c.quadraticCurveTo(17,-75,18,-69);c.quadraticCurveTo(15,-66,12,-67);c.lineTo(8,-74);c.closePath();fill('#fcfbf5');
  c.beginPath();c.moveTo(-6,-85);c.lineTo(-6,-77);c.quadraticCurveTo(0,-71,6,-77);c.lineTo(6,-86);c.closePath();fill('#dfb399');
  c.beginPath();c.moveTo(-5.6,-78);c.quadraticCurveTo(0,-71.8,5.8,-78);stroke('#ede4d9',1.15);
  // Kulaklar ve yüz silueti: geniş alın, yumuşak yanak, daralan çene.
  oval(-13.3,-94,2.8,4.5,'#d5a58d');oval(13.1,-94,2.8,4.5,'#e9bba0');
  c.beginPath();c.moveTo(-13.6,-102);c.bezierCurveTo(-14.7,-96,-13.2,-88,-10,-83);
  c.bezierCurveTo(-7,-79,-3.5,-77.9,0,-77.9);c.bezierCurveTo(3.5,-77.9,8.2,-80.2,10.4,-84.3);
  c.bezierCurveTo(13.5,-89.6,14.3,-97,13,-103.6);c.bezierCurveTo(9.6,-111.6,-8.9,-112.7,-13.6,-102);c.closePath();fill('#e5bca5');
  // Boyutsal ışık, çok hafif yanak gölgesi ve çene hattı; agresif kontur yok.
  c.beginPath();c.moveTo(-12.8,-98);c.quadraticCurveTo(-13,-86,-7.8,-82);c.quadraticCurveTo(-11,-90,-10.8,-98);c.closePath();fill('rgba(165,110,94,.16)');
  c.beginPath();c.moveTo(2,-108);c.quadraticCurveTo(10,-107,11,-101);c.quadraticCurveTo(7,-104,2,-104);c.closePath();fill('rgba(255,236,219,.25)');
  c.beginPath();c.moveTo(-5,-80.6);c.quadraticCurveTo(0,-78.9,5,-80.8);stroke('rgba(173,119,104,.28)',.55);
  // Saç ayrımı, alnın iki yanına geriye taranan koyu saç, alçakta toplanmış kuyruk.
  c.beginPath();c.moveTo(-13.6,-98);c.bezierCurveTo(-16.4,-110,-9,-116,0,-116);
  c.bezierCurveTo(9.4,-116.4,15.3,-110,13,-98.4);c.bezierCurveTo(11.8,-103,8,-107,2,-109.7);
  c.bezierCurveTo(-1.6,-106.8,-7.3,-104.8,-12,-103.4);c.closePath();fill('#503d35');
  c.beginPath();c.moveTo(-12,-105.5);c.bezierCurveTo(-11,-111,-7,-113.8,-3,-114.5);c.quadraticCurveTo(-7.6,-111.5,-10.8,-105.4);c.closePath();fill('rgba(205,163,133,.18)');
  c.beginPath();c.moveTo(5,-113);c.bezierCurveTo(10,-111,13,-108,12.7,-103.4);c.quadraticCurveTo(10,-107,6,-109.2);c.closePath();fill('rgba(36,25,20,.10)');
  c.beginPath();c.moveTo(1.5,-114.5);c.bezierCurveTo(-1.4,-111.2,-7,-108,-12,-105);stroke('#8d6a57',.8);
  c.beginPath();c.moveTo(1.9,-114.1);c.bezierCurveTo(6.1,-112,10.3,-108.5,12.2,-103.2);stroke('#8a6958',.8);
  c.beginPath();c.moveTo(-2,-113.6);c.bezierCurveTo(-5,-112,-9,-109,-11.8,-105.5);stroke('rgba(188,149,124,.42)',.55);
  c.beginPath();c.moveTo(4.4,-113.4);c.bezierCurveTo(8,-111,10.8,-108,12.8,-103);stroke('rgba(188,149,124,.32)',.5);
  // Fotoğraftaki yumuşak kaş eğimi ve dar göz kapakları: büyük yuvarlak göz yok.
  c.beginPath();c.moveTo(-9,-99.8);c.quadraticCurveTo(-6.3,-101.2,-3.1,-100.2);stroke('#6f5246',.83);
  c.beginPath();c.moveTo(3.1,-100.2);c.quadraticCurveTo(6,-101.1,8.8,-99.6);stroke('#6f5246',.83);
  if (kip) {
    c.beginPath();c.moveTo(-8.5,-96.6);c.quadraticCurveTo(-5.7,-95.3,-3,-96.5);c.moveTo(3,-96.5);c.quadraticCurveTo(5.8,-95.3,8.5,-96.5);stroke('#684e45',.95);
  } else {
    c.fillStyle='#f6eee6';c.beginPath();c.moveTo(-8.8,-96.2);c.quadraticCurveTo(-6,-98.2,-3,-96.5);c.quadraticCurveTo(-5.6,-94.8,-8.8,-96.2);c.fill();
    c.beginPath();c.moveTo(3,-96.4);c.quadraticCurveTo(5.9,-98.1,8.8,-96.1);c.quadraticCurveTo(5.9,-94.8,3,-96.4);c.fill();
    oval(-5.75,-96.3,.95,1.05,'#74817a');oval(5.95,-96.3,.95,1.05,'#74817a');
    oval(-5.7,-96.2,.38,.67,'#49443d');oval(6,-96.2,.38,.67,'#49443d');
    oval(-5.35,-96.7,.22,.22,'#fffdf7');oval(6.35,-96.7,.22,.22,'#fffdf7');
    c.beginPath();c.moveTo(-8.8,-96.3);c.quadraticCurveTo(-6,-98.3,-3,-96.6);c.moveTo(3,-96.6);c.quadraticCurveTo(5.9,-98.3,8.8,-96.2);stroke('#775a4b',.65);
    c.beginPath();c.moveTo(-8,-94.8);c.quadraticCurveTo(-5.6,-94,-3.6,-94.8);c.moveTo(3.7,-94.8);c.quadraticCurveTo(5.8,-94,8.1,-94.8);stroke('rgba(165,111,97,.42)',.5);
  }
  // Burun köprüsü ve burun ucu, sakin kapalı dudaklı gülümseme.
  c.beginPath();c.moveTo(.3,-95);c.quadraticCurveTo(-.8,-91.9,-.3,-90.7);c.quadraticCurveTo(.5,-89.8,1.8,-90.5);stroke('#c89781',.7);
  oval(-8.7,-89.7,2.7,1.35,'rgba(215,139,126,.18)');oval(9,-89.7,2.7,1.35,'rgba(215,139,126,.16)');
  c.beginPath();c.moveTo(-4.8,-87.3);c.quadraticCurveTo(-1,-86,0,-86.1);c.quadraticCurveTo(2.6,-86,5.1,-87.5);c.quadraticCurveTo(2.3,-83.9,0,-84.2);c.quadraticCurveTo(-2.8,-84.1,-4.8,-87.3);c.closePath();fill('#c68279');
  c.beginPath();c.moveTo(-4.8,-87.3);c.quadraticCurveTo(.2,-85.4,5.1,-87.5);stroke('#9e6d63',.75);
  c.beginPath();c.moveTo(-2.5,-85.3);c.quadraticCurveTo(.3,-84.8,2.6,-85.5);stroke('rgba(255,218,204,.7)',.5);
  // İnce kolye ve küçük halka: fotoğraftaki zarif ayrıntı.
  c.beginPath();c.moveTo(-5,-77);c.quadraticCurveTo(0,-70,5,-77);stroke('#c4a979',.65);
  oval(0,-72.2,1.4,1.6,'#c9a96e'); oval(0,-72.2,.6,.75,'#fff6d8');
  // Öndeki kol pozla hareket eder; el uzatma ve sarılma farklı jestlerdir.
  let elbow=[15,-57], hand=[15-armSwing,-45];
  if (poz === 'el') { elbow=[19,-63];hand=[28,-62]; }
  if (poz === 'saril') { elbow=[21,-64];hand=[14,-76]; }
  if (otur) { elbow=[17,-57];hand=[23,-51]; }
  if (dans) { elbow=[20,-67+sal*2];hand=[25,-79-sal*3]; }
  // Bisiklette ön kolu gidona bağlayan sahne çizer; böylece iki ön el oluşmaz.
  if (!opt.onKolGizle) {
    limb([11,-72],elbow,hand,7,'#ecc1a7','#c89580');
    oval(hand[0],hand[1],3.6,4.1,'#f2c8ac');
  }
  c.restore();
}

// Takipçi herhangi bir oyun sistemini devralmaz. Zemine bakar, zıplayan Feza'yı havada taklit etmez.
const ANNE12 = {
  x:0, y:0, vx:0, yon:1, poz:'dur', hazir:false, zaman:0, sonP:null,
  reset(p) { const px=p && Number.isFinite(p.x) ? p.x : 0; this.x=px+64; this.sonP=px; this.y=(p && Number.isFinite(p.y) ? p.y : 0); this.vx=0; this.yon=1; this.poz='dur'; this.zaman=0; this.hazir=true; },
  adim(dt,p,yerY) {
    if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    if (!this.hazir) this.reset(p);
    if (!(dt>0)) return;
    dt=Math.min(dt,.05); this.zaman+=dt;
    const face=p.f===-1?-1:1;
    // Anne Feza'nın sağında kalır: soldaki dokunmatik zıplama düğmesinin altında gizlenmez.
    let hedef=p.x+64;
    if (typeof COLS==='number' && typeof T==='number') hedef=Math.min(COLS*T-28,Math.max(28,hedef));
    const adimP=Number.isFinite(this.sonP)?p.x-this.sonP:0; this.sonP=p.x;
    // Gerçek hareketi izle, bağıl konumu yumuşat; hız sınırı nedeniyle geride kalmaz.
    // Büyük konum atlaması yalnız sahne/test geçişlerinde yakın konuma sıfırlar.
    if(Math.abs(adimP)>200) { this.x=hedef; this.vx=0; }
    else {
      this.x+=adimP;
      const on=this.x; this.x+=(hedef-this.x)*(1-Math.exp(-dt*5));
      const v=(adimP+this.x-on)/dt; this.vx+=(v-this.vx)*(1-Math.exp(-dt*12));
    }
    if (typeof COLS==='number' && typeof T==='number') this.x=Math.min(COLS*T-28,Math.max(28,this.x));
    if (Math.abs(this.vx)>7) this.yon=Math.sign(this.vx);
    else this.yon=face;
    let z=typeof yerY==='function'?yerY(this.x):p.y;
    if (!Number.isFinite(z)) z=this.y;
    this.y+=(z-this.y)*(1-Math.exp(-dt*11));
    this.poz=Math.abs(this.vx)>18?'yuru':'dur';
  },
  ciz(ctx,tm,opt) { if (!this.hazir) return; const o=Object.assign({poz:this.poz,yon:this.yon,hareket:Math.min(1,Math.abs(this.vx)/100)},opt||{}); anne12Ciz(ctx,this.x,this.y,1,tm,o); }
};
