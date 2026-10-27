/* durak12.js — Kampüste dört isteğe bağlı, tekrarlanabilir oyuncak.
   Türler: kampusOrigami (38), kampusDurbun (164), kampusSanat (505), kampusFoto (838).
   Yazı/zaman baskısı yok; yalnız nesnenin açık dokunma alanı yakalanır.
   Her durak bağımsızdır, ana ilerleme veya kayda müdahale etmez. */
'use strict';
const DURAK12 = (()=>{
  const TUR12=['kampusOrigami','kampusDurbun','kampusSanat','kampusFoto'];
  const RENK=['#fa7197','#f5c75f','#73bdd2','#b392df','#7abf91'];
  let ptr=null, anneSon=0, anneTur='el', fotoBas=null, fotoTada=false;
  const lim=(v,a,b)=>Math.max(a,Math.min(b,v));
  function elips(c,x,y,rx,ry,col,rot=0){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,rot,0,Math.PI*2);c.fill();}
  function yol(c,p,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.stroke();}
  function yildiz(c,x,y,r,col){c.save();c.translate(x,y);c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,d=i%2?r*.38:r;c.lineTo(Math.cos(a)*d,Math.sin(a)*d);}c.closePath();c.fill();c.restore();}
  function dunya(e){const r=cv.getBoundingClientRect();return{x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};}
  function sakin(e){if(e.cancelable)e.preventDefault();e.stopPropagation();}
  function isaret(o,tip){
    anneSon=1.9;anneTur=tip==='kampusFoto'?'saril':'el';
    fotoBas=tip==='kampusFoto'?{x:P.x,y:P.y}:null;fotoTada=false;
    // Feza'nın zaten var olan kısa ta-da jesti: hareket/atlama başlayınca
    // normal animasyon sistemi devralır; fizik veya kontrol kilitlenmez.
    if(fotoBas&&P.a_pose&&P.ground&&Math.abs(P.vx||0)<30&&(!Number.isFinite(P.a_cheerT)||P.a_cheerT>=1.9)){P.a_tadaT=0;fotoTada=true;}
    if(typeof drDokunAlkis==='function')try{drDokunAlkis(1.1);}catch(_){}
    if(typeof AU!=='undefined'&&AU&&typeof AU.sfx==='function')try{AU.sfx('parilti',.42);}catch(_){}
    if(typeof OLAY!=='undefined'&&OLAY&&OLAY.emit)OLAY.emit('kampusDurak',{o,tip});
  }
  function renkNokta(o,p){
    const k=o.d12; if(p.y>o.y-88){const j=lim(Math.round((p.x-(o.x-70))/70),0,2);k.renk=j;return;}
    if(p.y<o.y-255||p.y>o.y-92)return;
    const x=lim(p.x-o.x,-84,84), y=lim(p.y-(o.y-175),-70,70), last=k.boya[k.boya.length-1];
    if(!last||Math.hypot(last.x-x,last.y-y)>10){if(k.boya.length>=70)k.boya.shift();k.boya.push({x,y,r:k.renk});}
  }
  function nesneBul(p){
    if(typeof NESNELER==='undefined'||!Array.isArray(NESNELER))return null;
    for(const o of NESNELER){if(!o.d12||TUR12.indexOf(o.tip)<0||Math.abs(P.x-o.x)>440)continue;
      const dx=Math.abs(p.x-o.x),dy=p.y-o.y;
      if(o.tip==='kampusSanat' ? dx<118&&dy>-275&&dy<-25 : dx<92&&dy>-238&&dy<-45) return o;
    }return null;
  }
  function bas(e){
    if(typeof BOLUM_NO==='undefined'||BOLUM_NO!==12||DURUM!=='oyun'||e.target!==cv||P.ucus||ptr||e.pointerType==='mouse'&&e.button!==0)return;
    const p=dunya(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;const o=nesneBul(p);if(!o)return;
    sakin(e);ptr={id:e.pointerId,o,x:p.x,y:p.y,move:0};try{cv.setPointerCapture(e.pointerId);}catch(_){}
    if(typeof omHepsiniBirak==='function')omHepsiniBirak();
    o.d12.isaret=2;isaret(o,o.tip);
    if(o.tip==='kampusOrigami'){o.d12.t=0;o.d12.uc=1;o.d12.fx=lim(p.x-o.x,-160,160);o.d12.fy=lim(p.y-(o.y-155),-100,70);}
    if(o.tip==='kampusDurbun'){o.d12.seyir=6;}
    if(o.tip==='kampusSanat')renkNokta(o,p);
    if(o.tip==='kampusFoto'){o.d12.foto=7;o.d12.cekim++;}
  }
  function sur(e){if(!ptr||e.pointerId!==ptr.id)return;sakin(e);const p=dunya(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
    ptr.move+=Math.hypot(p.x-ptr.x,p.y-ptr.y);ptr.x=p.x;ptr.y=p.y;const o=ptr.o;
    if(o.tip==='kampusOrigami'){o.d12.fx=lim(p.x-o.x,-160,160);o.d12.fy=lim(p.y-(o.y-155),-100,70);}
    if(o.tip==='kampusSanat')renkNokta(o,p);
  }
  function son(e){if(!ptr||e.pointerId!==ptr.id)return;sakin(e);const o=ptr.o;
    if(o.tip==='kampusOrigami'){if(e.type==='pointerup'){o.d12.uc=3;o.d12.t=0;if(ptr.move<8){o.d12.fx=52;o.d12.fy=-35;}}else{o.d12.uc=0;o.d12.fx=0;o.d12.fy=0;}}
    ptr=null;
  }
  addEventListener('pointerdown',bas,true);addEventListener('pointermove',sur,true);addEventListener('pointerup',son,true);addEventListener('pointercancel',son,true);
  cv.addEventListener('lostpointercapture',e=>{if(ptr&&ptr.id===e.pointerId){if(ptr.o.tip==='kampusOrigami')ptr.o.d12.uc=0;ptr=null;}});
  function temizle(yalnizGirdi){if(ptr&&ptr.o.tip==='kampusOrigami')ptr.o.d12.uc=0;ptr=null;if(!yalnizGirdi){anneSon=0;fotoBas=null;fotoTada=false;}}
  addEventListener('blur',()=>temizle(false));addEventListener('pagehide',()=>temizle(false));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)temizle();});
  if(typeof OLAY!=='undefined'&&OLAY&&OLAY.on)OLAY.on('durum',d=>{if(d!=='oyun')temizle(d==='mola'||d==='duraklat');});

  function kus(c,x,y,r,t,renk){c.save();c.translate(x,y);c.scale(r,r);const kanat=Math.sin(t*7)*.16;
    c.fillStyle=renk;c.beginPath();c.moveTo(-1,0);c.quadraticCurveTo(-.15,-.95-kanat,0,-.16);c.quadraticCurveTo(.15,-.95-kanat,1,0);c.quadraticCurveTo(.2,-.35,0,.12);c.quadraticCurveTo(-.2,-.35,-1,0);c.fill();
    elips(c,0,0,.23,.3,'#f4e6d9');c.restore();}
  function origami(c,x,y,s,t){c.save();c.translate(x,y);c.rotate(Math.sin(t*2)*.08);c.scale(s,s);c.fillStyle='#ff9ab6';c.beginPath();c.moveTo(-35,7);c.lineTo(0,-27);c.lineTo(30,5);c.lineTo(0,22);c.closePath();c.fill();
    c.fillStyle='#ffd5dc';c.beginPath();c.moveTo(-35,7);c.lineTo(0,-27);c.lineTo(-4,7);c.closePath();c.fill();c.fillStyle='#e96991';c.beginPath();c.moveTo(-4,7);c.lineTo(0,-27);c.lineTo(30,5);c.closePath();c.fill();
    yol(c,[[-3,7],[20,15],[34,7]],'#a45474',2);elips(c,30,6,3,3,'#fff5eb');c.restore();}
  function davet(o,t){g.save();g.globalAlpha=.53+.22*Math.sin(t*3);g.strokeStyle='#fff9db';g.lineWidth=3;g.beginPath();g.arc(o.x,o.y-145,67+3*Math.sin(t*2),0,Math.PI*2);g.stroke();g.restore();}
  function ciz(o,t){const k=o.d12,x=o.x,y=o.y;g.save();g.lineCap='round';g.lineJoin='round';
    if(o.tip==='kampusOrigami'){
      // Geniş renkli kâğıt şerit ve canlı, sürüklenebilir origami.
      elips(g,x,y-10,65,9,'rgba(68,115,86,.2)');g.fillStyle='#e2c39d';g.fillRect(x-48,y-30,96,24);g.fillStyle='#fce8cb';g.fillRect(x-51,y-40,102,15);
      const bob=Math.sin(t*1.8)*5, fx=k.fx, fy=k.fy;origami(g,x+fx,y-155+fy+bob,1.12,t);
      if(k.uc)for(let i=0;i<6;i++){const q=(k.t*.3+i*.17)%1;elips(g,x+fx-18-q*90,y-145+fy+Math.sin(q*9+i)*18,4,8,'rgba(255,195,211,.72)',q*3);}
      if(!k.uc)davet(o,t);
    }
    if(o.tip==='kampusDurbun'){
      // Sabit sevimli dürbün; dokununca kuşlar ortaya çıkar ve kanat çırpar.
      elips(g,x,y-8,74,9,'rgba(68,115,86,.2)');g.fillStyle='#a97c63';g.fillRect(x-8,y-118,16,110);g.fillStyle='#d5a47e';g.fillRect(x-35,y-132,70,16);
      elips(g,x-27,y-162,30,37,'#739eae');elips(g,x+27,y-162,30,37,'#739eae');elips(g,x-27,y-162,22,27,'#c7eced');elips(g,x+27,y-162,22,27,'#c7eced');
      elips(g,x-33,y-170,8,11,'rgba(255,255,255,.7)');elips(g,x+21,y-170,8,11,'rgba(255,255,255,.7)');
      if(k.seyir>0){for(let i=0;i<4;i++){const q=(k.t*.12+i*.24)%1;kus(g,x-140+q*280,y-275-i*23+Math.sin(t*2+i)*12,14-i*2,t+i,'#94bfd1');}}
      else davet(o,t);
    }
    if(o.tip==='kampusSanat'){
      // Açık renkli büyük tuval, yumuşak renkli izler; alt üç renk tek dokunuşla seçilir.
      elips(g,x,y-7,76,9,'rgba(68,115,86,.2)');yol(g,[[x-74,y],[x-48,y-250],[x+45,y-250],[x+76,y]],'#aa7b60',8);
      g.fillStyle='#c79a75';g.fillRect(x-102,y-262,204,183);g.fillStyle='#fff7eb';g.fillRect(x-92,y-252,184,164);
      g.fillStyle='#b6dedd';g.fillRect(x-87,y-247,174,67);g.fillStyle='#c5dda9';g.fillRect(x-87,y-180,174,86);
      for(const b of k.boya)elips(g,x+b.x,y-175+b.y,8,6,RENK[b.r]);
      for(let j=0;j<3;j++){elips(g,x-70+j*70,y-55,19,19,RENK[j]);if(j===k.renk){g.strokeStyle='#fff8dc';g.lineWidth=3;g.beginPath();g.arc(x-70+j*70,y-55,21,0,Math.PI*2);g.stroke();}}
      if(!k.boya.length){g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=2;g.strokeRect(x-92,y-252,184,164);}
    }
    if(o.tip==='kampusFoto'){
      // Yuvarlak, açık pembe oyuncak fotoğraf makinesi; her dokunuş yeni hatırayı gösterir.
      elips(g,x,y-8,66,9,'rgba(68,115,86,.2)');g.fillStyle='#a97c63';g.fillRect(x-7,y-130,14,122);
      g.fillStyle='#e8829f';g.fillRect(x-62,y-205,124,77);g.fillStyle='#f4a9bc';g.fillRect(x-57,y-201,114,66);g.fillStyle='#b56881';g.fillRect(x-42,y-217,33,13);
      elips(g,x,y-169,30,30,'#6f9ca8');elips(g,x,y-169,21,21,'#ccebed');elips(g,x-7,y-177,7,7,'rgba(255,255,255,.72)');elips(g,x+45,y-190,5,5,'#fff0c4');
      if(k.foto>0){const a=Math.min(1,k.foto,Math.max(0,7-k.foto)*2);g.save();g.globalAlpha=a;g.translate(x+100,y-223);g.rotate(.08);g.fillStyle='#fff9ec';g.fillRect(-58,-68,116,136);g.fillStyle='#badfdd';g.fillRect(-48,-58,96,99);g.fillStyle='#bad7ae';g.fillRect(-48,14,96,27);
        // Özgün minik anı çizimi: anne ve Feza el ele, üniversite kulesi arkada.
        g.fillStyle='#ddd8c8';g.fillRect(-38,-48,9,62);g.fillStyle='#839a98';g.fillRect(-40,-51,13,6);
        g.save();g.translate(0,Math.sin(k.t*2)*.8);
        g.strokeStyle='#775e57';g.lineWidth=4;g.beginPath();g.moveTo(-7,34);g.lineTo(-7,-3);g.moveTo(18,35);g.lineTo(18,12);g.moveTo(-4,8);g.lineTo(15,15);g.stroke();
        elips(g,-7,-12,10,12,'#edbda2');elips(g,18,5,8,9,'#edbda2');g.fillStyle='#554038';g.beginPath();g.arc(-7,-15,10,Math.PI,Math.PI*2);g.arc(18,3,8,Math.PI,Math.PI*2);g.fill();
        g.fillStyle='#fbf8ee';g.fillRect(-15,0,16,20);g.fillStyle='#eea8c2';g.fillRect(11,13,14,15);g.restore();
        // Pırıl da küçük hatıraya süzülür; hiçbir gerçek kamera kullanılmaz.
        const py=-33+Math.sin(k.t*2.2)*2;elips(g,31,py,6,4,'#aa82d1');elips(g,26,py-4,4,5,'#d9b9ec');elips(g,36,py-4,4,5,'#d9b9ec');elips(g,32,py-1,1,1,'#fff5df');g.restore();}
      else davet(o,t);
    }
    if(k.isaret>0){for(let i=0;i<3;i++)yildiz(g,x+(i-1)*48,y-240+Math.sin(t*3+i)*10,6+(i%2)*2,'#fff5ba');}
    g.restore();
  }
  for(const tip of TUR12)TUR.kaydet(tip,{
    kur(o){o.d12={isaret:0,t:0,uc:0,fx:0,fy:0,seyir:0,boya:[],renk:0,foto:0,cekim:0};},
    guncelle(o,dt){const k=o.d12;if(!k||DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);k.t+=dt;k.isaret=Math.max(0,k.isaret-dt);k.seyir=Math.max(0,k.seyir-dt);k.foto=Math.max(0,k.foto-dt);
      if(k.uc===3&&(!ptr||ptr.o!==o)){k.fx*=Math.exp(-dt*1.4);k.fy*=Math.exp(-dt*1.4);if(k.t>3){k.uc=0;k.fx=k.fy=0;}}},
    ciz
  });
  // Global sayaç güncellemesi tek bir durak tarafından yapılır (dört kez değil).
  const ilk=TUR.al('kampusOrigami'), eski=ilk.guncelle;
  ilk.guncelle=function(o,dt){eski(o,dt);if(DURUM==='oyun'&&dt>0&&Number.isFinite(dt)){
    anneSon=Math.max(0,anneSon-Math.min(dt,.05));
    if(fotoTada&&P.a_tadaT>=1.1)fotoTada=false;
    if(fotoBas&&(P.ucus||Math.hypot(P.x-fotoBas.x,P.y-fotoBas.y)>12||Math.abs(P.vx||0)>60)){
      anneSon=0;fotoBas=null;if(fotoTada&&P.a_tadaT<1.1)P.a_tadaT=9;fotoTada=false;
    }else if(anneSon<=0)fotoBas=null;
  }};
  return {get annePoz(){return anneSon>0?anneTur:null;}};
})();
