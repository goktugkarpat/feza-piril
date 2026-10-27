/* Kampüs yollarında iki ayrı yolculuk: anne–Feza bisikleti ve Feza'nın mavi scooter'ı.
   Nesneler: kampusBisiklet / kampusScooter, {inisX, inisY}. Yazı, kaybetme ve süre baskısı yok.
   Dokunma veya sağ ok / boşluk daha hızlı sürer; bırakınca keyifli hızda devam eder. */
'use strict';
(() => {
  let aktif=null;
  const TAU=Math.PI*2, limit=(v,a,b)=>Math.max(a,Math.min(b,v));
  const renk=['#ffe59a','#ffd0e0','#bef1e1','#cce7ff'];
  function resetInput(){if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
  function ses(ad,v){if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx(ad,v)}catch(_) {}}
  // Ek hedefler isteğe bağlıdır. Dokunma kendi normal sürüş girdisini engellemez.
  function isaretDokun(e){
    const o=aktif;if(!o||DURUM!=='oyun'||e.target!==cv||e.pointerType==='mouse'&&e.button!==0)return;
    const r=cv.getBoundingClientRect(),px=cam.x+(e.clientX-r.left)*DPR/S,py=cam.y+(e.clientY-r.top)*DPR/S;
    if(!Number.isFinite(px)||!Number.isFinite(py))return;
    for(const z of o.y12.isaret){if(z.hit||Math.hypot(px-z.x,py-(o.y-150))>85)continue;
      z.hit=true;z.flash=1;o.y12.sevinc=2.4;o.y12.tempo=1;ses('parilti',.5);
      OLAY.emit('kampusYolculukNese',{o,ad:o.y12.ad,i:z.i});break;}
  }
  if(typeof addEventListener==='function')addEventListener('pointerdown',isaretDokun,true);
  function basla(o){const k=o.y12;if(aktif||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
    aktif=o;k.aktif=true;k.x0=P.x;k.t=0;k.hiz=115;k.ritim=0;k.ipucu=0;k.sevinc=0;k.tempo=0;P.ucus=o;P.vx=P.vy=P.buf=P.kilit=P.fade=0;resetInput();
    OLAY.emit('kampusYolculukBasla',{o,ad:k.ad});}
  function bitir(o,tamam){const k=o.y12;if(P.ucus===o){P.ucus=null;P.x=P.rx=tamam?o.inisX:k.x0;P.y=P.ry=tamam?o.inisY:o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.kilit=P.air=0;P.ground=true;P.dj=true;P.f=1;}
    k.aktif=false;if(!tamam){o.x=k.baslangicX;for(const z of k.isaret){z.hit=false;z.flash=0;}for(const z of k.nesne){z.hit=false;z.flash=0;}}if(aktif===o)aktif=null;resetInput();
    if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
    if(typeof D!=='undefined'){D.x=P.x-65;D.y=P.y-112;D.vx=D.vy=0;}
    if(tamam&&!o.done){o.done=true;o.tk.bitti=true;OLAY.emit('kampusYolculukBitti',{o,ad:k.ad});}}
  function ilerle(o,dt,u){const k=o.y12;if(!k.aktif||P.ucus!==o||DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);
    k.t+=dt;const bas=!!(u&&(u.basili||u.eksenX>0||u.eksenY<0));k.ipucu=bas?Math.min(1,k.ipucu+dt*3):Math.max(0,k.ipucu-dt*1.3);
    k.sevinc=Math.max(0,k.sevinc-dt);k.tempo=Math.max(0,k.tempo-dt*.4);
    const hedef=(bas?250:135)+k.tempo*20;k.hiz+=(hedef-k.hiz)*(1-Math.exp(-dt*2.4));k.ritim+=k.hiz*dt/26;
    P.x=Math.min(o.inisX,P.x+k.hiz*dt);o.x=P.x;P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;
    for(let i=0;i<k.nesne.length;i++){const z=k.nesne[i];if(!z.hit&&P.x>=z.x-20){z.hit=true;z.flash=1;ses('parilti',.45);OLAY.emit('kampusYolculukIsik',{o,ad:k.ad,i});}z.flash=Math.max(0,z.flash-dt*.7);}
    for(const z of k.isaret)z.flash=Math.max(0,z.flash-dt*.5);
    if(P.x>=o.inisX)bitir(o,true);
  }
  function oval(x,y,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);g.fill();}
  function yol(points,color,width){g.strokeStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)g.lineTo(points[i][0],points[i][1]);g.stroke();}
  function teker(x,y,r,aci){
    oval(x,y+2,r+2,r+2,'#526477');oval(x,y,r-3,r-3,'#d8f1f0');oval(x,y,r-6,r-6,'#a4d0d1');
    g.save();g.translate(x,y);g.rotate(aci);g.strokeStyle='rgba(255,251,231,.9)';g.lineWidth=1.5;g.beginPath();for(let i=0;i<6;i++){const a=i*Math.PI/3;g.moveTo(0,0);g.lineTo(Math.cos(a)*(r-5),Math.sin(a)*(r-5));}g.stroke();g.restore();oval(x,y,4,4,'#fbdf9f');
  }
  function parilti(x,y,r,col){g.fillStyle=col;g.beginPath();g.moveTo(x,y-r);g.quadraticCurveTo(x+r*.2,y-r*.2,x+r,y);g.quadraticCurveTo(x+r*.2,y+r*.2,x,y+r);g.quadraticCurveTo(x-r*.2,y+r*.2,x-r,y);g.quadraticCurveTo(x-r*.2,y-r*.2,x,y-r);g.fill();}
  function kask(x,y,s,renk){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=renk;g.beginPath();g.moveTo(-15,0);g.quadraticCurveTo(-14,-18,0,-20);g.quadraticCurveTo(15,-18,16,0);g.closePath();g.fill();yol([[-12,0],[12,0]],'#fff4dc',2);oval(-5,-13,4,2,'rgba(255,255,255,.55)');g.restore();}
  function arka(o,t){const k=o.y12;if(!k.aktif)return;g.save();for(const z of k.nesne){if(z.x<cam.x-100||z.x>cam.x+VW+100)continue;const y=o.y-40;
      g.globalAlpha=z.hit?.25:.8;g.strokeStyle=renk[z.i%4];g.lineWidth=4;g.beginPath();g.ellipse(z.x,y,23+Math.sin(t*2+z.i)*2,11,0,0,TAU);g.stroke();if(z.flash>0){g.globalAlpha=z.flash;parilti(z.x,y-20,8,renk[z.i%4]);}}
    g.globalAlpha=1;
    for(const z of k.isaret){if(z.x<cam.x-110||z.x>cam.x+VW+110)continue;const y=o.y-150;
      if(!z.hit){oval(z.x,y,37,37,'rgba(255,250,232,.88)');oval(z.x,y,30,30,renk[(z.i+1)%4]);parilti(z.x,y,18,'#fff9dd');
        g.strokeStyle='rgba(255,255,239,.78)';g.lineWidth=3;g.beginPath();g.arc(z.x,y,41+Math.sin(t*2+z.i)*2,0,TAU);g.stroke();}
      if(z.flash>0){g.globalAlpha=z.flash;for(let j=0;j<6;j++){const a=j*TAU/6+t*.3;parilti(z.x+Math.cos(a)*52,y+Math.sin(a)*52,7,renk[(z.i+j)%4]);}g.globalAlpha=1;}}
    g.restore();}
  function bisiklet(x,y,t,k){
    // Sıra: iki teker ve arka iskelet -> birlikte oturan karakterler -> çerçeve/pedallar.
    oval(x,y+1,108,5,'rgba(51,93,79,.18)');teker(x-70,y-26,24,k.ritim);teker(x+62,y-26,24,k.ritim);
    yol([[x-70,y-26],[x-32,y-74],[x+2,y-26],[x-70,y-26],[x+28,y-70],[x+62,y-26],[x+2,y-26]],'#bc7285',5.5);
    yol([[x-70,y-26],[x-32,y-74],[x+2,y-26],[x-70,y-26],[x+28,y-70],[x+62,y-26],[x+2,y-26]],'#f7b4bb',2.3);
    yol([[x-36,y-76],[x-22,y-76]],'#735c55',5);yol([[x+21,y-78],[x+34,y-78],[x+34,y-84]],'#788b8d',4);
    // Arka çocuk selesi ve küçük sepet.
    yol([[x-78,y-51],[x-78,y-75],[x-52,y-75]],'#a7a1a0',4);oval(x-65,y-76,18,4,'#e9b2a4');
    g.fillStyle='#d9af75';g.beginPath();g.moveTo(x+42,y-67);g.lineTo(x+72,y-67);g.lineTo(x+67,y-48);g.lineTo(x+46,y-48);g.closePath();g.fill();
    yol([[x+45,y-62],[x+69,y-62]],'#f2d0a1',2);oval(x+51,y-70,5,5,'#ffd689');oval(x+60,y-72,4,4,'#ffafbd');
    // Karakter bacakları sele düzeyinde kesilir; pedal bacağı aşağıda ayrı hareket eder.
    const bob=Math.sin(k.ritim*2)*(.55+k.ipucu*.35),childBob=Math.sin(k.ritim*2+.6)*.5;
    g.save();g.beginPath();g.rect(x-115,y-220,145,143);g.clip();
    if(typeof anne12Ciz==='function')anne12Ciz(g,x-24,y-56+bob,.96,t,{poz:'kayik',yon:1,hareket:.7,onKolGizle:true});g.restore();
    // Çocuk selesindeki Feza'nın gövdesi de görünür; yalnız selesinin altı örtülür.
    g.save();g.beginPath();g.rect(x-105,y-220,82,168);g.clip();
    if(typeof fezaCizPoz==='function'){
      fezaCizPoz(g,x-60,y-64+childBob,.88,'binis',t,null,{ruzgar:.15});
      // Match the seated hip, torso and head transforms used by fzDraw.
      if(typeof fzCS!=='undefined'&&typeof FZ_SC!=='undefined'){
        const r=fzCS.a_R,by=-.28*r.breath-r.shr;
        g.save();g.translate(x-60,y-64+childBob);g.scale(.88*FZ_SC*r.sx,.88*FZ_SC*r.sy);
        g.translate(0,-fzCS.a_hipY-3.2);g.translate(r.hx,fzCS.a_hipY);g.rotate(r.lean);
        g.translate(1.9,-14.4+by);g.rotate(r.head);g.scale(1.03,1.03);g.translate(1.3,-7.7);
        kask(0,-7.5,.65,'#81c8e2');g.restore();
      }
    }g.restore();
    // Krankın zıt uçlarındaki iki ayak pedallardan ayrılmaz.
    const cx=x+2,cy=y-26,dx=Math.cos(k.ritim)*10,dy=Math.sin(k.ritim)*8;
    const pedx=cx+dx,pedy=cy+dy,arkaX=cx-dx,arkaY=cy-dy;
    yol([[x-25,y-79+bob],[x-32-dx*.3,y-55],[arkaX,arkaY]],'#435968',8);yol([[x-25,y-79+bob],[x-32-dx*.3,y-55],[arkaX,arkaY]],'#718794',4.5);
    yol([[cx,cy],[arkaX,arkaY]],'#b8cfc9',2.2);oval(arkaX,arkaY,7,2.5,'#5d5b5b');
    yol([[x-20,y-79+bob],[x-12+dx*.3,y-55],[pedx,pedy]],'#526a7c',8);yol([[x-20,y-79+bob],[x-12+dx*.3,y-55],[pedx,pedy]],'#8396a0',4.5);
    // Kısa iki kademeli ön kol, doğrudan gidona uzanır.
    const omuzX=x-24+11*.96,omuzY=y-56+bob+.96*(18-.88*(72+.9*Math.abs(Math.sin(t*7.2)*.7)));
    yol([[omuzX,omuzY],[x+5,y-91+bob*.4],[x+25,y-79]],'#edc2a8',5);oval(x+25,y-79,3.4,3.3,'#f7cfb4');
    oval(x+2,y-26,7,7,'#758e91');yol([[x+2,y-26],[pedx,pedy]],'#e5ebe1',2.5);oval(pedx,pedy,7,2.5,'#615e5e');
    // İki küçük kask görsel güvenlik detayı.
    kask(x-23,y-128+bob,.9,'#f8b8b2');
  }
  function scooter(x,y,t,k,inisX){
    // Anne, scooterın arkasından yürüyerek normal takip konumuna geçer.
    const u=limit((900-(inisX-x))/900,0,1),ease=u*u*(3-2*u),mx=x-82+146*ease,ms=.88+.12*ease;
    if(typeof anne12Ciz==='function')anne12Ciz(g,mx,y,ms,t,{poz:'yuru',yon:1,hareket:.8,kosu:true,kosuMesafe:(mx-(k.x0-82))/.88});
    oval(x,y+1,72,5,'rgba(51,93,79,.18)');teker(x-34,y-10,10,k.ritim*1.8);teker(x+38,y-10,10,k.ritim*1.8);
    // Mavi şehir scooter'ı: geniş taban, yuvarlatılmış platform, ayarlı dikme ve gidon.
    g.fillStyle='#147cae';g.beginPath();g.roundRect(x-42,y-24,87,13,5);g.fill();g.fillStyle='#72d7f0';g.beginPath();g.roundRect(x-37,y-24,76,3,2);g.fill();
    yol([[x+31,y-20],[x+25,y-77]],'#146d9d',7);yol([[x+31,y-20],[x+25,y-77]],'#59c4e6',3);yol([[x+15,y-79],[x+36,y-79]],'#436478',5);
    oval(x+39,y-25,4,4,'#fff1b0');
    // Ayaklar platformda kalır; gövde hızla hafifçe öne eğilir.
    const egim=-.025*k.ipucu+Math.sin(k.ritim)*.008;
    g.save();g.translate(x-8,y-24);g.rotate(egim);
    if(typeof fezaCizPoz==='function') {
      fezaCizPoz(g,0,0,.96,'ayakta_yan',t);
      // fezaCizPoz has just evaluated the actual pose. Follow the same hip,
      // torso and head transforms used by fzDraw, rather than the eyes.
      if(typeof fzCS!=='undefined' && typeof FZ_SC!=='undefined') {
        const r=fzCS.a_R, by=-.28*r.breath-r.shr;
        g.save();g.scale(.96*FZ_SC*r.sx,.96*FZ_SC*r.sy);
        g.translate(r.hx,fzCS.a_hipY);g.rotate(r.lean);
        g.translate(1.9,-14.4+by);g.rotate(r.head);g.scale(1.03,1.03);g.translate(1.3,-7.7);
        kask(0,-7.5,.65,'#72c8e6');g.restore();
      }
    }
    g.restore();
    // Eller gidonda; parıltılı kask ve küçük çanta hareketle hafif salınır.
    yol([[x+3,y-57],[x+11,y-67],[x+23,y-78]],'#f0bca5',4);oval(x+23,y-78,3,3,'#f8d4bb');

  }
  function on(o,t){const k=o.y12;if(!k.aktif||P.ucus!==o)return;const x=P.x,y=P.y;
    g.save();if(k.ad==='bisiklet')bisiklet(x,y,t,k);else scooter(x,y,t,k,o.inisX);
    if(typeof pirilCizPoz==='function')pirilCizPoz(g,x-105,y-112+Math.sin(t*2.5)*6,.7,'ucus',t);
    // Hızlandırmaya karşılık küçük yumuşak izler, ödül halka simgeleri; ekran metni yok.
    if(k.ipucu>.01)for(let i=0;i<5;i++){g.globalAlpha=k.ipucu*(.6-i*.08);parilti(x-120-i*23,y-36-(i%2)*15,3+i%2,renk[i%4]);}g.globalAlpha=1;g.restore();
    if(k.sevinc>0){g.save();g.globalAlpha=Math.min(1,k.sevinc);for(let i=0;i<4;i++)parilti(x-30+i*22,y-175-Math.sin(t*3+i)*7,5+i%2,renk[i]);g.restore();}
  }
  function olustur(tip,ad){TUR.kaydet(tip,{
    kur(o){o.done=false;o.tk={bitti:false};if(!Number.isFinite(o.inisX))o.inisX=o.x+2000;if(!Number.isFinite(o.inisY))o.inisY=o.y;
      o.y12={ad,aktif:false,x0:o.x,baslangicX:o.x,t:0,hiz:115,ritim:0,ipucu:0,sevinc:0,tempo:0,nesne:Array.from({length:8},(_,i)=>({i,x:o.x+(o.inisX-o.x)*(i+1)/9,hit:false,flash:0})),isaret:Array.from({length:3},(_,i)=>({i,x:o.x+(o.inisX-o.x)*(i+1)/4,hit:false,flash:0}))};o.adim=(dt,u)=>ilerle(o,dt,u);},
    guncelle(o,dt){if(DURUM==='oyun'&&!o.done&&!P.ucus&&P.x>o.x-70&&P.x<o.x+120&&Math.abs(P.y-o.y)<100)basla(o);},ciz:arka,cizOn:on,
    testBitir(o){if(!o.y12.aktif)basla(o);if(o.y12.aktif)bitir(o,true);}
  });}
  OLAY.on('durum',d=>{if(aktif&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')bitir(aktif,false);});
  olustur('kampusBisiklet','bisiklet');olustur('kampusScooter','scooter');
})();
