/* Kampüs rüyası: uçurtma, resimli kitap, piknik ve birlikte müzik.
   Bölüm türleri: kampusUcurtma, kampusKitap, kampusPiknik, kampusMuzik.
   Yazısız, dokunma/sürükleme ve klavye alternatifli, sakin yardım; görseller kendimize ait. */
'use strict';
(() => {
  const RENK = ['#ff7398', '#ffd36d', '#91d8ff', '#ac8ff2', '#8bd7a0'];
  const KOD = ['ucurtma', 'kitap', 'piknik', 'muzik'];
  let etkin = null, pointer = null;
  const limit = (v,a,b) => Math.max(a, Math.min(b,v));
  const yumusat = v => { v=limit(v,0,1);return v*v*(3-2*v); };
  const world = e => { const r=cv.getBoundingClientRect(); return {x:cam.x+(e.clientX-r.left)*DPR/S, y:cam.y+(e.clientY-r.top)*DPR/S}; };
  const sahip = e => { if(e.cancelable) e.preventDefault(); e.stopPropagation(); };
  const sfx = (name, v) => { if(typeof AU!=='undefined' && AU && AU.sfx) { try { AU.sfx(name,v); } catch (_) {} } };
  function geriAl(){if(pointer&&pointer.onizleme&&etkin){const k=etkin.e12,p=pointer;k.sec[p.i]=false;k.sayi=p.once.sayi;k.son=p.once.son;k.sayfa=p.once.sayfa;k.parla=p.once.parla;}pointer=null;}
  function temizle() { geriAl(); if(typeof omHepsiniBirak==='function') omHepsiniBirak(); }
  // Anne çizimi ve uçurtma ipi aynı pozisyon/ölçek/poz hesabını paylaşır.
  function annePozisyon(o){const k=o.e12,gir=yumusat(k.anneT/2),sure=(k.ad==='muzik'||k.ad==='kitap')?8:3.5;
    const cik=k.faz==='kutla'?((k.ad==='muzik'||k.ad==='kitap')?k.anneCik:yumusat((k.sonT-(sure-3))/2.5)):0;
    const ax=k.anneBasX+(o.x+195-k.anneBasX)*gir,son=o.x-250+64,yuruyor=k.faz==='kutla'?cik>0&&cik<.99:gir<.99;
    return {x:ax+(son-ax)*cik,y:o.y,scale:(1-.15*gir)+.15*gir*cik,poz:yuruyor?'yuru':k.faz==='kutla'?'dans':'el',yon:yuruyor?(k.faz==='kutla'?-1:1):(k.faz==='kutla'&&cik>.99?1:-1),hareket:yuruyor?1:.5};}
  function anneOnEl(a,t){const adim=Math.sin(t*7.2)*a.hareket,sal=a.poz==='dans'?Math.sin(t*3):0;
    const hx=a.poz==='el'?28:a.poz==='dans'?25:15-adim*4,hy=a.poz==='el'?-62:a.poz==='dans'?-79-sal*3:-45;
    return {x:a.x+a.scale*a.yon*(sal*1.1+hx),y:a.y+a.scale*(hy-.9*Math.abs(adim))};}
  function baslat(o) {
    const k=o.e12; if(etkin || o.done || P.ucus || DURUM!=='oyun' || P.fade>0 || !P.ground || P.kilit>0.05) return;
    etkin=o; k.aktif=true; k.girisX=P.x; k.girisY=P.y; k.idle=0; k.faz='oyun'; k.bas=0; k.tasima.fill(null); k.sayfa=0;k.notaI=-1;k.notaT=0;k.anneCik=0;k.ipucuA=0;k.ipucuI=-1; temizle();
    k.anneBasX=typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.hazir&&Number.isFinite(ANNE12.x)?ANNE12.x:P.x+64;k.anneT=0;
    P.ucus=o; P.vx=P.vy=P.buf=P.kilit=P.fade=0;
    OLAY.emit('kampusEtkinlikBasla',{o,ad:k.ad});
  }
  function birak(o,tamam) {
    const k=o.e12; if(etkin===o) etkin=null;
    if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-250;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.kilit=P.air=0;P.ground=true;P.dj=true;P.f=1;}
    k.aktif=false; temizle();
    if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
    if(tamam && !o.done){o.done=true;o.tk.bitti=true;k.faz='bitti'; OLAY.emit('kampusEtkinlikBitti',{o,ad:k.ad});}
    else if(!tamam&&!o.done) { k.faz='bekle'; k.sec.fill(false); k.sayi=0; k.son=-1; k.tasima.fill(null); k.sayfa=0; }
  }
  function yildiz(c,x,y,r,col){c.save();c.translate(x,y);c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.47:r;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();c.restore();}
  function oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
  function yuvarlak(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
  function yol(c,pts,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.stroke();}
  function nesne(c,ad,x,y,s,renk,t){
    c.save();c.translate(x,y);c.scale(s,s);c.rotate(Math.sin(t*1.8+x*.02)*.035);
    if(ad==='ucurtma'){c.fillStyle=renk;c.beginPath();c.moveTo(0,-35);c.lineTo(28,0);c.lineTo(0,39);c.lineTo(-28,0);c.closePath();c.fill();yol(c,[[0,-32],[0,36]],'#fff6df',2);yol(c,[[-26,0],[26,0]],'#fff6df',2);}
    if(ad==='kurdele'){oval(c,-13,0,14,9,renk);oval(c,13,0,14,9,renk);oval(c,0,0,7,7,'#fff3cc');yol(c,[[-3,5],[-12,20]],renk,5);yol(c,[[3,5],[12,20]],renk,5);}
    if(ad==='kitap'){yuvarlak(c,-25,-20,50,40,7,'#f7ead5');yol(c,[[0,-18],[0,18]],'#bd9e83',2);oval(c,-12,-3,7,7,renk);yildiz(c,12,-3,9,renk);}
    if(ad==='piknik'){oval(c,0,0,25,19,renk);oval(c,-6,-6,6,4,'rgba(255,255,255,.65)');c.fillStyle='#548d56';c.fillRect(-2,-24,4,10);oval(c,6,-23,8,4,'#71ac62');}
    if(ad==='muzik'){oval(c,-7,20,13,9,renk);oval(c,12,15,13,9,renk);yuvarlak(c,1,-24,5,41,2,renk);yuvarlak(c,20,-29,5,39,2,renk);yol(c,[[3,-22],[22,-27]],renk,5);}
    c.restore();
  }
  // Her piknik yiyeceğinin kendi silueti; her sahne müzik aletinin kendi biçimi vardır.
  function yiyecek(c,i,x,y,s){c.save();c.translate(x,y);c.scale(s,s);
    if(i===0){oval(c,-6,1,15,18,'#f16b67');oval(c,7,1,15,18,'#e95e64');yol(c,[[0,-13],[2,-23]],'#80543a',3);oval(c,9,-22,10,5,'#8dc777');oval(c,-10,-6,4,7,'rgba(255,255,255,.5)');}
    if(i===1){c.fillStyle='#ffd17a';c.beginPath();c.moveTo(-22,-8);c.quadraticCurveTo(-26,24,0,25);c.quadraticCurveTo(26,24,22,-8);c.quadraticCurveTo(0,2,-22,-8);c.fill();yol(c,[[-15,3],[15,4]],'#bd8650',3);yol(c,[[-9,13],[9,13]],'#bd8650',3);}
    if(i===2){yuvarlak(c,-17,-24,34,51,7,'#e2f6f8');yuvarlak(c,-13,-12,26,34,5,'#ff9b9d');yol(c,[[5,-15],[12,-32]],'#ffd986',4);oval(c,-5,-4,4,8,'rgba(255,255,255,.5)');}
    if(i===3){oval(c,0,2,24,20,'#dfa86a');for(const [px,py] of [[-10,-3],[5,-8],[11,7],[-6,10]])oval(c,px,py,3.8,3.8,'#8e5e43');oval(c,-10,-12,5,3,'rgba(255,255,255,.4)');}
    c.restore();}
  // Her eşyanın sepetle buluşması kendi kısa ve sessiz görsel tepkisini alır.
  // Sayaçlar eşya başına tutulur; hızlı dört seçim birbirinin etkisini silmez.
  function piknikTepki(c,i,x,y,u){if(u<=0||u>=1)return;c.save();c.globalAlpha*=Math.sin(Math.PI*u)*.75;
    if(i===0){for(let j=0;j<2;j++){const xx=x+(j?11:-11),yy=y-17-u*19-j*5;c.fillStyle='#f18fa5';c.beginPath();c.moveTo(xx,yy+6);c.bezierCurveTo(xx-11,yy-1,xx-7,yy-9,xx,yy-4);c.bezierCurveTo(xx+7,yy-9,xx+11,yy-1,xx,yy+6);c.fill();}}
    else if(i===1){c.strokeStyle='#fff1d2';c.lineWidth=2;c.lineCap='round';for(let j=0;j<3;j++){const xx=x-12+j*12,yy=y-15-u*13;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx-5,yy-8,xx+2,yy-16);c.stroke();}}
    else if(i===2){c.strokeStyle='#dcf8f5';c.lineWidth=2;for(let j=0;j<3;j++){const xx=x-9+j*9,yy=y-18-u*(15+j*4);c.beginPath();c.arc(xx,yy,3+j%2,0,Math.PI*2);c.stroke();}}
    else {for(let j=0;j<4;j++){const a=j*Math.PI/2+.4,rr=11+u*13;oval(c,x+Math.cos(a)*rr,y-12+Math.sin(a)*rr,2.5,2.5,'#f4d38f');}}
    c.restore();}
  function muzikAleti(c,i,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);
    if(i===0){yuvarlak(c,-23,-15,46,35,8,'#ec92aa');yol(c,[[-20,-11],[20,-11]],'#fff0d6',4);yol(c,[[-14,-25],[12,-10]],'#b88965',5);oval(c,-14,-25,7,7,'#ffe2a2');}
    if(i===1){for(let n=0;n<4;n++)yuvarlak(c,-25+n*13,-24+n*3,10,43-n*4,4,RENK[n]);yol(c,[[-26,20],[28,20]],'#9b755d',4);}
    if(i===2){oval(c,-11,-9,12,17,'#ffd36d');oval(c,11,-9,12,17,'#f39abb');yol(c,[[-11,5],[-14,25]],'#a16a44',5);yol(c,[[11,5],[14,25]],'#a16a44',5);}
    if(i===3){c.fillStyle='#e6b65c';c.beginPath();c.moveTo(-22,14);c.quadraticCurveTo(-18,-18,0,-24);c.quadraticCurveTo(18,-18,22,14);c.closePath();c.fill();oval(c,0,19,7,7,'#a76b44');oval(c,-8,-10,4,8,'rgba(255,255,255,.5)');}
    c.restore();}
  function parcayiCiz(c,k,i,x,y,s,t){if(k.ad==='piknik')return yiyecek(c,i,x,y,s);if(k.ad==='muzik')return muzikAleti(c,i,x,y,s,t);const simge=k.ad==='ucurtma'?'kurdele':['ucurtma','piknik','muzik','kitap'][i];nesne(c,simge,x,y,s,RENK[i],t);}
  function yerler(o) { const y=o.y-185, x=o.x; return [-1.5,-.5,.5,1.5].map((v,i)=>({x:x+v*112,y:y+Math.sin(i*2)*8,i})); }
  // Pırıl yalnız boşta bekleyen çocuğa, henüz seçilmeyen bir nesneyi gösterir.
  function ipucu(o){const k=o.e12;if(!k.aktif||P.ucus!==o||DURUM!=='oyun'||(typeof document!=='undefined'&&document.hidden)||pointer||k.faz!=='oyun'||k.idle<8)return -1;return k.sec.findIndex(v=>!v);}
  function dogru(o,i,help,baslangic){
    const k=o.e12; if(!k.aktif || i<0||i>3) return;
    // Sahne aletleri yeniden çalınabilir: her dokunuş duyulur, tekrarlar boşa gitmez.
    if(k.ad==='muzik'&&(k.faz==='oyun'||k.faz==='kutla')){if(typeof MZ12!=='undefined' && typeof MZ12.nota==='function')MZ12.nota(i);OLAY.emit('kampusMuzikNota',{o,i});k.notaI=i;k.notaT=1;if(k.faz==='kutla')k.sonT=0;if(k.sec[i]||k.faz==='kutla'){k.idle=0;return;}}
    // Açılmış resim yine seçilebilir, ancak yeni sayfa olarak sayılmaz.
    if(k.ad==='kitap'&&k.sec[i]&&(k.faz==='oyun'||k.faz==='kutla')){k.son=i;k.sayfa=1;k.parla=1;k.idle=0;if(k.faz==='kutla')k.sonT=0;sfx('parilti',.4);OLAY.emit('kampusKitapTekrar',{o,i});return;}
    if(k.faz!=='oyun'||k.sec[i]) return;
    k.sec[i]=true;k.sayi++;k.idle=0;k.parla=1;k.son=i;
    if(k.ad==='kitap')k.sayfa=1;
    if(k.ad==='piknik'){const q=yerler(o)[i];k.tasima[i]={x:baslangic&&Number.isFinite(baslangic.x)?baslangic.x:q.x,y:baslangic&&Number.isFinite(baslangic.y)?baslangic.y:q.y,t:0,tepki:0};}
    if(k.ad!=='muzik')sfx('parilti',.55);OLAY.emit('kampusEtkinlikDokun',{o,ad:k.ad,i,yardim:!!help});
    if(k.sayi===4){k.faz=k.ad==='ucurtma'?'ucur':'kutla';k.sonT=0;sfx('parilti',.8);}
  }
  function nokta(o,p){const L=yerler(o);let b=-1,d=Infinity;for(const q of L){const v=Math.hypot(p.x-q.x,p.y-q.y);if(v<d){d=v;b=q.i;}}
    // Biten hedefin yakınındaki tekrar dokunuşu komşuya aktarılmaz.
    if(d>=90||b<0)return -1;const k=o.e12;return k.sec[b]&&k.ad!=='muzik'&&k.ad!=='kitap'?-1:b;}
  function tut(e){if(!etkin||DURUM!=='oyun'||e.target!==cv||e.pointerType==='mouse'&&e.button!==0||pointer) return;const o=etkin; const p=world(e);const i=o.e12.faz==='ucur'?-2:nokta(o,p); if(i===-1)return; sahip(e);pointer={id:e.pointerId,i,x:p.x,y:p.y,yol:0};try{cv.setPointerCapture(e.pointerId);}catch(_){} o.e12.idle=0;if(i===-2)o.e12.ucurY=limit(p.y,o.y-420,o.y-160);}
  function sur(e){if(!pointer||!etkin||e.pointerId!==pointer.id)return;sahip(e);const p=world(e);if(Number.isFinite(p.x)&&Number.isFinite(p.y)){pointer.yol+=Math.hypot(p.x-pointer.x,p.y-pointer.y);pointer.x=p.x;pointer.y=p.y;if(pointer.i===-2)etkin.e12.ucurY=limit(p.y,etkin.y-420,etkin.y-160);else if(etkin.e12.ad==='kitap'&&pointer.yol>=35&&!pointer.onizleme&&!etkin.e12.sec[pointer.i]){const k=etkin.e12;pointer.once={sayi:k.sayi,son:k.son,sayfa:k.sayfa,parla:k.parla};pointer.onizleme=true;k.sec[pointer.i]=true;k.sayi++;k.son=pointer.i;k.sayfa=1;k.parla=1;}}etkin.e12.idle=0;}
  function son(e){if(!pointer||!etkin||e.pointerId!==pointer.id)return;sahip(e);const p=pointer,i=p.i;geriAl();if(e.type==='pointerup'&&i>=0)dogru(etkin,i,false,p.yol>12?{x:p.x,y:p.y}:null);}
  addEventListener('pointerdown',tut,true);addEventListener('pointermove',sur,true);addEventListener('pointerup',son,true);addEventListener('pointercancel',son,true);
  cv.addEventListener('lostpointercapture',e=>{if(pointer&&pointer.id===e.pointerId)geriAl();});
  addEventListener('blur',geriAl);addEventListener('pagehide',geriAl);document.addEventListener('visibilitychange',()=>{if(document.hidden)geriAl();});
  addEventListener('keydown',e=>{if(!etkin||DURUM!=='oyun'||e.repeat||e.target&&/^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(e.target.tagName))return;if(!/^(Space|Enter|KeyE|ArrowLeft|ArrowRight|ArrowUp|ArrowDown)$/.test(e.code))return;
    const k=etkin.e12;if(k.ad==='muzik'&&document.hidden)return;sahip(e);
    if(k.faz==='ucur'){if(e.code==='ArrowUp')k.ucurY=limit(k.ucurY-35,etkin.y-420,etkin.y-160);if(e.code==='ArrowDown')k.ucurY=limit(k.ucurY+35,etkin.y-420,etkin.y-160);}
    else if(k.ad==='muzik'&&k.faz==='kutla'){
      // Kutlamada oklar dört çalgıya karşılık gelir; boşluk/Enter/E sıradakini çalar.
      const notalar={ArrowLeft:0,ArrowDown:1,ArrowUp:2,ArrowRight:3};
      const i=Object.prototype.hasOwnProperty.call(notalar,e.code)?notalar[e.code]:(k.notaI+1)%4;dogru(etkin,i,false);
    }else dogru(etkin,k.sec.findIndex(v=>!v),false);
  },true);
  OLAY.on('durum',d=>{geriAl();if(etkin&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')birak(etkin,false);});
  function ciz(o,tm){
    const k=o.e12,x=o.x,y=o.y,t=Number.isFinite(tm)?tm:0;
    if(x+480<cam.x||x-480>cam.x+VW)return;
    g.save();
    // Sahnenin öznesi: dört bambaşka, açıkça okunur merkez.
    if(k.ad==='ucurtma'){
      const uy=k.faz==='ucur'?k.ucurY:y-260;
      const el=k.aktif&&P.ucus===o&&typeof anne12Ciz==='function'?anneOnEl(annePozisyon(o),t):{x:x+30,y:y-20};
      // Uçurtmanın hem dış hem iç salınımı ucun gerçek yerini değiştirir.
      const aci=.1*Math.sin(t)+.035*Math.sin(t*1.8),ux=x+65-Math.sin(aci)*85.8,uyuc=uy+Math.cos(aci)*85.8;
      g.strokeStyle='#e7d4b4';g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(el.x,el.y);g.quadraticCurveTo((el.x+ux)/2,(el.y+uyuc)/2+30,ux,uyuc);g.stroke();
      g.save();g.translate(x+65,uy);g.rotate(.1*Math.sin(t));nesne(g,'ucurtma',0,0,2.2,'#ffb45f',t);g.restore();
      for(let i=0;i<4;i++)if(k.sec[i]){const yy=y-172+i*28;nesne(g,'kurdele',x+35+i*9,yy,.55,RENK[i],t);}
    } else if(k.ad==='kitap'){
      yuvarlak(g,x-190,y-365,380,220,24,'#a36552');yuvarlak(g,x-177,y-351,354,193,18,'#fff2d3');
      // Her seçilen resim kitabın iki sayfasında farklı bir anıya dönüşür.
      if(k.son>=0){const i=k.son,sky=['#c9edf2','#e1e5fc','#d3efd4','#ffe3ca'][i];yuvarlak(g,x-164,y-336,328,114,12,sky);
        oval(g,x+100,y-315,14,14,i===3?'#ffe4a1':'#fff5cf');
        if(i===1){for(let n=0;n<3;n++)oval(g,x-85+n*80,y-242+Math.sin(t*2+n)*3,33,5,'rgba(110,183,197,.5)');}
        else {for(let n=0;n<5;n++)oval(g,x-130+n*60,y-229+Math.sin(n*2)*3,43,12,i===2?'#a9d39c':'#b6d9aa');}
        const symbols=['ucurtma','piknik','muzik','kitap'];nesne(g,symbols[i],x-45+Math.sin(t*1.6)*7,y-278+Math.sin(t*2)*4,.82,RENK[i],t);
        for(let n=0;n<4;n++)yildiz(g,x+32+n*25,y-285+Math.sin(t*2+n)*9,4+n%2,'#fff4bd');}
      yol(g,[[x,y-347],[x,y-163]],'#d9b995',4);
      for(let i=0;i<4;i++){oval(g,x-120+i*80,y-195,11,11,k.sec[i]?RENK[i]:'#dfd2bc');if(i===k.son)oval(g,x-120+i*80,y-195,4,4,'#fff9e7');}
      if(k.sayfa>0){g.globalAlpha=k.sayfa*.25;yuvarlak(g,x-177,y-351,354,193,18,'#fff9e9');g.globalAlpha=1;}
    } else if(k.ad==='piknik'){
      g.fillStyle='#f9c9d1';g.beginPath();g.moveTo(x-230,y-65);g.lineTo(x+210,y-65);g.lineTo(x+255,y-12);g.lineTo(x-260,y-12);g.closePath();g.fill();
      for(let i=0;i<6;i++)yol(g,[[x-215+i*75,y-64],[x-235+i*82,y-13]],'rgba(255,255,255,.55)',4);
      // Önce seçilen yiyecekler sepete girer; hepsi hazır olunca mevcut
      // kutlama sırasında sepetten örtüye serilir. Dokunma alanları değişmez.
      yuvarlak(g,x+110,y-120,85,54,12,'#c1844f');
      yol(g,[[x+122,y-120],[x+130,y-148],[x+175,y-148],[x+183,y-120]],'#a56b42',6);
      const ser=k.faz==='bitti'?1:k.faz==='kutla'?yumusat((k.sonT-1.15)/.8):0;
      for(let i=0;i<4;i++)if(k.sec[i]){
        const a=k.tasima[i],u=a?limit(a.t/.65,0,1):1,v=yumusat(u),bx=x+130+(i%2)*42,by=y-105+Math.floor(i/2)*23;
        const tx=bx+(x-125+i*85-bx)*ser,ty=by+(y-45-by)*ser;
        const xx=a?a.x+(tx-a.x)*v:tx,yy=(a?a.y+(ty-a.y)*v:ty)-Math.sin(Math.PI*u)*35;
        yiyecek(g,i,xx,yy,.75+(.34-.75)*v*(1-ser));
        if(a&&a.t>=.65)piknikTepki(g,i,xx,yy,a.tepki/1.2);
      }
    } else {
      yuvarlak(g,x-224,y-345,448,290,24,'#a75f72');yuvarlak(g,x-208,y-329,416,250,18,'#ffc6bd');
      for(let i=0;i<4;i++){const xx=x-153+i*102;yuvarlak(g,xx-38,y-300,76,166,18,k.sec[i]?RENK[i]:'#f7e6d4');muzikAleti(g,i,xx,y-225,1.05,t);}
      for(let i=0;i<4;i++)if(k.sec[i])nesne(g,'muzik',x-150+i*100+Math.sin(t+i)*8,y-370-(t*24+i*20)%80,.35,RENK[i],t);
      if(k.notaT>0&&k.notaI>=0){const p=yerler(o)[k.notaI];g.save();g.globalAlpha=k.notaT;nesne(g,'muzik',p.x,p.y-50-(1-k.notaT)*40,.6,RENK[k.notaI],t);g.restore();}
    }
    if(k.aktif&&(k.faz==='oyun'||(k.ad==='muzik'||k.ad==='kitap')&&k.faz==='kutla'))for(const p of yerler(o)){if(k.sec[p.i]&&k.ad!=='muzik'&&k.ad!=='kitap')continue;const pulse=1+.05*Math.sin(t*3+p.i);g.save();g.translate(p.x,p.y);g.scale(pulse,pulse);oval(g,0,0,48,48,'rgba(255,255,255,.85)');oval(g,0,0,42,42,k.sec[p.i]?'#fff2d5':'rgba(255,244,229,.96)');parcayiCiz(g,k,p.i,0,0,.9,t);g.restore();}
    const ip=ipucu(o);if(ip>=0){const p=yerler(o)[ip];g.save();g.strokeStyle='rgba(255,242,173,.88)';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,53+Math.sin(t*2)*3,0,Math.PI*2);g.stroke();g.restore();}
    if(pointer&&etkin===o&&pointer.i>=0)parcayiCiz(g,k,pointer.i,pointer.x,pointer.y,1.05,t);
    if(k.parla>0){g.globalAlpha=k.parla;for(let i=0;i<7;i++)yildiz(g,x+Math.cos(i*6.28/7)*100,y-260+Math.sin(i*6.28/7)*70,6+i%3,'#fff4a3');g.globalAlpha=1;}
    g.restore();
  }
  function cizOn(o,tm){const k=o.e12;if(!k.aktif||P.ucus!==o)return;
    if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,k.faz==='kutla'?'sevinc':'ayakta_yan',tm);
    // Oyun hemen başlar; anne takipçiden sahneye, kutlama sonunda geri yürür.
    const a=annePozisyon(o);
    if(typeof anne12Ciz==='function')anne12Ciz(g,a.x,a.y,a.scale,tm,a);
    if(typeof pirilCizPoz==='function'){let px=P.x+62,py=P.y-110;if(k.ipucuI>=0&&k.ipucuA>0){const q=yerler(o)[k.ipucuI],u=yumusat(k.ipucuA);px+=(q.x-60-px)*u;py+=(q.y-65-py)*u;}g.save();pirilCizPoz(g,px,py+Math.sin(tm*2)*5,.72,'ucus',tm);g.restore();}
  }
  for(let j=0;j<KOD.length;j++){
    const ad=KOD[j],tip=['kampusUcurtma','kampusKitap','kampusPiknik','kampusMuzik'][j];
    TUR.kaydet(tip,{
      kur(o){o.done=false;o.tk={bitti:false};o.e12={ad,aktif:false,faz:'bekle',sec:[false,false,false,false],sayi:0,idle:0,sonT:0,parla:0,son:-1,bas:0,sayfa:0,notaI:-1,notaT:0,tasima:[null,null,null,null],ucurY:o.y-260,anneBasX:0,anneT:0,anneCik:0};o.adim=()=>{if(P.ucus===o){const k=o.e12,son=1-yumusat((k.sonT-12.5)/1.5);P.x=o.x-250+(k.faz==='ucur'?Math.sin(k.sonT*.85)*60*son:0);P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};},
      guncelle(o,dt){const k=o.e12;if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun'||(typeof document!=='undefined'&&document.hidden))return;dt=Math.min(dt,.05);k.parla=Math.max(0,k.parla-dt*.7);k.sayfa=Math.max(0,k.sayfa-dt*2.2);k.notaT=Math.max(0,k.notaT-dt*1.4);for(const a of k.tasima)if(a){const was=a.t;a.t=Math.min(.65,a.t+dt);if(was>=.65)a.tepki=Math.min(1.2,a.tepki+dt);}
        if(!k.aktif){if(!o.done&&!etkin&&!P.ucus&&P.x>o.x-330&&P.x<o.x-150&&Math.abs(P.y-o.y)<100)baslat(o);return;}
        k.anneT+=dt;
        if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampus-'+ad,1.5,()=>omDkEkle(o.x-330,o.y-410,o.x+250,o.y+10),1,.48);
        if(k.faz==='oyun'&&!pointer){k.idle+=dt;if(k.idle>22){const i=k.sec.findIndex(v=>!v);if(i>=0)dogru(o,i,true);}}
        if(k.faz==='ucur'){k.sonT+=dt;if(k.sonT>=14){k.faz='kutla';k.sonT=0;}}
        if(k.faz==='kutla'){if((ad!=='muzik'&&ad!=='kitap')||!pointer)k.sonT+=dt;if(ad==='muzik'||ad==='kitap'){const sure=(ad==='muzik'||ad==='kitap')?8:3.5,hedef=yumusat((k.sonT-(sure-3))/2.5);k.anneCik+=limit(hedef-k.anneCik,-dt*.8,dt*.8);}if(k.sonT>=((ad==='muzik'||ad==='kitap')?8:3.5))birak(o,true);}
        const ih=ipucu(o);if(ih>=0)k.ipucuI=ih;k.ipucuA+=limit((ih>=0?1:0)-k.ipucuA,-dt*.75,dt*.75);
      },ciz,cizOn,
      testBitir(o){if(!o.e12.aktif)baslat(o);if(etkin===o){o.e12.sec=[true,true,true,true];o.e12.sayi=4;birak(o,true);}}
    });
  }
})();
