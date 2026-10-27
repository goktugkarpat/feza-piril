/* Lojman bahçesi: tohum ek, sula, kelebeklerle tanış. Metin ve kayıp yok. */
'use strict';
(() => {
 let active=null,pointer=null;
 const colors=['#ee7ea1','#f5bf67','#a993da','#82c7b0'];
 const world=e=>{const r=cv.getBoundingClientRect();return {x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};};
 const eat=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation();};
 const emit=(name,o,extra)=>OLAY.emit(name,Object.assign({o,asama:o.bh12.faz},extra||{}));
 const snd=(n=.4)=>{if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx('parilti',n);}catch(_){}};
 function el(x,y,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
 function line(a,b,col,w){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
 function flower(x,y,r,col,t){line([x,y+2],[x,y+48],'#609a61',5);el(x-8,y+30,9,4,'#7eb176');el(x+8,y+23,9,4,'#7eb176');for(let j=0;j<5;j++){const a=j*Math.PI*2/5+t*.05;el(x+Math.cos(a)*r*.64,y+Math.sin(a)*r*.64,r*.52,r*.52,col);}el(x,y,r*.28,r*.28,'#ffe5a0');}
 function butterfly(x,y,col,t){const w=.65+.35*Math.abs(Math.sin(t*3));el(x-8,y-4,9*w,11,col);el(x+8,y-4,9*w,11,col);el(x,y,3,10,'#8c7284');el(x-9,y-7,3*w,4,'rgba(255,255,255,.65)');el(x+9,y-7,3*w,4,'rgba(255,255,255,.65)');}
 function wateringCan(x,y){
  // Süslemeler gövdeye oturur: boşluklu kulp, belirgin boru ve delikli başlık.
  g.save();g.lineCap='round';g.lineJoin='round';
  g.strokeStyle='#467f8a';g.lineWidth=8;g.beginPath();g.moveTo(x+16,y-7);g.bezierCurveTo(x+55,y-33,x+58,y+18,x+22,y+14);g.stroke();
  g.strokeStyle='#b8e6e4';g.lineWidth=3;g.beginPath();g.moveTo(x+18,y-9);g.bezierCurveTo(x+49,y-27,x+53,y+13,x+24,y+10);g.stroke();
  g.fillStyle='#62aeb8';g.beginPath();g.moveTo(x-19,y-7);g.lineTo(x-49,y-23);g.lineTo(x-55,y-16);g.lineTo(x-23,y+6);g.closePath();g.fill();
  line([x-21,y-5],[x-48,y-20],'#b1e2e0',3);
  el(x-54,y-21,10,7,'#4f929e');el(x-57,y-24,8,5,'#b9e4df');
  for(let i=0;i<3;i++)el(x-60+i*4,y-24+(i%2)*2,1,1,'#568d93');
  g.fillStyle='#67b5c0';g.beginPath();g.moveTo(x-25,y-12);g.quadraticCurveTo(x-28,y-19,x-16,y-20);g.lineTo(x+18,y-20);g.quadraticCurveTo(x+28,y-19,x+26,y-8);g.lineTo(x+22,y+13);g.quadraticCurveTo(x,y+23,x-22,y+13);g.closePath();g.fill();
  g.fillStyle='#8ad3d4';g.beginPath();g.moveTo(x-20,y-10);g.quadraticCurveTo(x-20,y-16,x-13,y-16);g.lineTo(x+16,y-16);g.lineTo(x+13,y+10);g.quadraticCurveTo(x-2,y+16,x-19,y+10);g.closePath();g.fill();
  el(x,y-20,20,5,'#478e99');el(x,y-21,15,2.7,'#d6efdf');el(x-11,y-7,4,7,'rgba(240,255,247,.55)');
  // Çiçek motifi, yetişkin nesnesi yerine sevimli bir oyuncak görünümü verir.
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;el(x+5+Math.cos(a)*5,y+Math.sin(a)*5,3.2,3.2,'#fff4d7');}el(x+5,y,2.5,2.5,'#f2c76d');
  g.restore();
 }
 const plot=(o,i)=>({x:o.x-135+i*90,y:o.y-165});
 const bug=(o,i,t)=>({x:o.x-135+i*90+Math.sin(t*1.5+i)*7,y:o.y-285+Math.cos(t*1.7+i)*8});
 // Kutlamanın son 1,2 saniyesinde sonraki normal takip pozisyonuna yumuşak devir.
 const devir=k=>{const u=k.faz===3?Math.max(0,Math.min(1,(k.celebrate-2.8)/1.2)):0;return u*u*(3-2*u);};
 function start(o){if(active||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;const k=o.bh12;active=o;k.aktif=true;k.faz=0;k.hit.fill(false);k.idle=k.celebrate=k.glow=k.help=k.helpN=0;P.ucus=o;P.x=o.x-280;P.y=o.y;P.vx=P.vy=P.buf=P.kilit=P.fade=0;if(typeof omHepsiniBirak==='function')omHepsiniBirak();emit('kampusBahceBasla',o);}
 function release(o,done){const k=o.bh12;if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-260;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.kilit=P.fade=P.air=0;P.ground=true;P.dj=true;P.f=1;}k.aktif=false;if(active===o)active=null;pointer=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);if(done&&!o.done){o.done=true;o.tk.bitti=true;emit('kampusBahceBitti',o);}else if(!done&&!o.done){k.faz=-1;k.hit.fill(false);}}
 function action(o,i,help){const k=o.bh12;if(i<0||i>3||k.faz>=3||k.hit[i])return;k.hit[i]=true;k.idle=0;k.help=0;k.glow=1;snd();if(typeof MZ12!=='undefined'&&MZ12&&MZ12.nota)MZ12.nota(i);emit('kampusBahceDokun',o,{i,yardim:!!help});if(k.hit.every(Boolean)){k.faz++;k.hit.fill(false);emit('kampusBahceAsama',o);snd(.65);}}
 function hit(o,p){const k=o.bh12;let best=-1,d=Infinity;for(let i=0;i<4;i++){const z=k.faz===2?bug(o,i,k.t):plot(o,i),dd=Math.hypot(p.x-z.x,p.y-z.y);if(dd<d){d=dd;best=i;}}
  // En yakın gerçek hedef önceden tamamlandıysa komşusuna yönlendirme.
  if(d<85)return k.hit[best]?-1:best;
  // Sıradaki tohum veya sulama kabına dokunmak da tamamıyla geçerli.
  if(k.faz<2&&Math.abs(p.x-o.x)<220&&p.y>o.y-115&&p.y<o.y-35)return k.hit.findIndex(v=>!v);
  return -1;}
 function down(e){if(!active||DURUM!=='oyun'||e.target!==cv||pointer||e.pointerType==='mouse'&&e.button!==0||active.bh12.faz>=3)return;const p=world(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
  const o=active,can=o.bh12.faz===1&&Math.hypot(p.x-o.x,p.y-(o.y-80))<52,i=can?-1:hit(o,p);if(!can&&i<0)return;
  eat(e);pointer={id:e.pointerId,i,can,x:p.x,y:p.y,startX:p.x,startY:p.y,moved:0};try{cv.setPointerCapture(e.pointerId);}catch(_){}o.bh12.idle=0;}
 function move(e){if(!pointer||!active||pointer.id!==e.pointerId||DURUM!=='oyun')return;eat(e);const p=world(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
  pointer.moved=Math.max(pointer.moved,Math.hypot(p.x-pointer.startX,p.y-pointer.startY));pointer.x=p.x;pointer.y=p.y;active.bh12.idle=0;}
 function up(e){if(!pointer||!active||pointer.id!==e.pointerId)return;eat(e);const held=pointer,o=active;pointer=null;if(e.type!=='pointerup'||DURUM!=='oyun')return;
  if(!held.can){action(o,held.i,false);return;}
  // Kaba dokunmak sıradakini sular; sürüklemekse yalnız bırakılan çiçeği sular.
  if(held.moved<12){action(o,o.bh12.hit.findIndex(v=>!v),false);return;}
  const p=world(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;let i=-1,d=100;
  for(let j=0;j<4;j++){const z=plot(o,j),n=Math.hypot(z.x-p.x,z.y-p.y);if(n<d){d=n;i=j;}}
  if(i>=0&&!o.bh12.hit[i])action(o,i,false);
 }
 addEventListener('pointerdown',down,true);addEventListener('pointermove',move,true);addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);cv.addEventListener('lostpointercapture',()=>{pointer=null;});addEventListener('blur',()=>{pointer=null;});addEventListener('pagehide',()=>{pointer=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden)pointer=null;});
 OLAY.on('durum',d=>{pointer=null;if(active&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')release(active,false);});
 addEventListener('keydown',e=>{if(!active||DURUM!=='oyun'||e.repeat||e.target&&/^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(e.target.tagName)||!(/^(Space|Enter|KeyE)$/.test(e.code)))return;eat(e);action(active,active.bh12.hit.findIndex(v=>!v),false);},true);
 TUR.kaydet('kampusBahce',{
  kur(o){o.done=false;o.tk={bitti:false};o.bh12={aktif:false,faz:-1,hit:[false,false,false,false],idle:0,celebrate:0,glow:0,t:0,help:0};o.adim=()=>{if(P.ucus===o){P.x=o.x-280+20*devir(o.bh12);P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};},
  guncelle(o,dt){const k=o.bh12;if(DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);if(!k.aktif){if(!o.done&&!active&&!P.ucus&&P.ground&&P.x>o.x-340&&P.x<o.x-160&&Math.abs(P.y-o.y)<100)start(o);return;}k.t+=dt;k.glow=Math.max(0,k.glow-dt*.8);if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampusBahce',1.5,()=>omDkEkle(o.x-350,o.y-405,o.x+330,o.y+20),1,.48);if(k.faz>=3){k.celebrate+=dt;if(k.celebrate>=4)release(o,true);return;}if(pointer)return;k.idle+=dt;if(k.idle>8)k.help=1;if(k.idle>(k.helpN?15:24)){k.helpN=(k.helpN||0)+1;action(o,k.hit.findIndex(v=>!v),true);}},
  ciz(o,t){const k=o.bh12,x=o.x,y=o.y;g.save();
   // Yere oturan alçak ahşap çiçeklik: hedeflerin altındaki toprak, gövde ve
   // gölgesi bir bütün oluşturur; havada duran geniş, tek renkli oval yok.
   el(x,y-9,227,16,'rgba(70,111,75,.19)');
   g.fillStyle='#926647';g.beginPath();g.moveTo(x-210,y-160);g.lineTo(x+210,y-160);g.lineTo(x+190,y-26);g.quadraticCurveTo(x,y-4,x-190,y-26);g.closePath();g.fill();
   g.fillStyle='#bb8961';g.beginPath();g.moveTo(x-203,y-152);g.lineTo(x+203,y-152);g.lineTo(x+184,y-35);g.quadraticCurveTo(x,y-18,x-184,y-35);g.closePath();g.fill();
   for(let i=0;i<8;i++){const xx=x-154+i*44;line([xx,y-142],[x+(xx-x)*.91,y-31],'rgba(111,70,47,.26)',2);line([xx+5,y-137],[x+(xx+5-x)*.91,y-38],'rgba(248,213,164,.23)',1);}
   el(x,y-160,214,35,'#75543e');el(x,y-165,207,29,'#a67956');el(x,y-167,196,23,'#936744');
   for(let i=0;i<25;i++){const xx=x-184+i*15,yy=y-165+Math.sin(i*2.7)*10;el(xx,yy,2+i%3,1.5,i%3?'rgba(230,187,131,.38)':'rgba(78,54,40,.3)');}
   for(let i=0;i<4;i++){const p=plot(o,i),planted=k.faz>0||(k.faz===0&&k.hit[i]),watered=k.faz>1||(k.faz===1&&k.hit[i]);el(p.x,p.y+4,30,11,'#76503b');el(p.x,p.y+1,23,6,'#ad7e58');if(planted){if(watered)flower(p.x,p.y-42,19,colors[i],t);else {line([p.x,p.y+2],[p.x,p.y-25],'#71a768',4);el(p.x-7,p.y-20,8,4,'#a4c986');el(p.x+7,p.y-28,8,4,'#a4c986');}}else {el(p.x,p.y+2,9,5,'#513f38');el(p.x-2,p.y,4,2,'#d9b583');}
    if(k.aktif&&k.faz<2&&!k.hit[i]){g.strokeStyle='rgba(255,246,195,.82)';g.lineWidth=2.5;g.beginPath();g.ellipse(p.x,p.y,31+Math.sin(t*2+i)*2,14,0,0,Math.PI*2);g.stroke();}}
   if(k.aktif&&k.faz===0)for(let i=0;i<4;i++)if(!k.hit[i]){const p=plot(o,i);el(p.x,y-75,18,13,colors[i]);el(p.x-4,y-78,5,3,'rgba(255,255,255,.65)');}
   if(k.aktif&&k.faz===1){const moving=pointer&&pointer.can,cx=moving?Math.max(x-220,Math.min(x+220,pointer.x)):x,cy=moving?Math.max(y-270,Math.min(y-50,pointer.y)):y-80;
    wateringCan(cx,cy);
    if(moving){for(let i=0;i<4;i++){const yy=cy-15+i*10+(t*35)%10;el(cx-57+i%2*4,yy,3,5,'rgba(140,218,236,.85)');}}
    else for(let i=0;i<4;i++)if(!k.hit[i]){const p=plot(o,i);el(p.x,p.y-52+Math.sin(t*3+i)*4,4,7,'#a3dce5');}}
   if(k.aktif&&k.faz>=2)for(let i=0;i<4;i++){const p=bug(o,i,t);butterfly(p.x,p.y,colors[i],t+i);if(k.faz===2&&!k.hit[i]){g.strokeStyle='rgba(255,250,217,.75)';g.lineWidth=2;g.beginPath();g.arc(p.x,p.y,23+Math.sin(t*2+i)*2,0,Math.PI*2);g.stroke();}}
   if(k.aktif&&k.help&&k.faz<3){const i=k.hit.findIndex(v=>!v);if(i>=0){const p=k.faz===2?bug(o,i,t):plot(o,i);g.strokeStyle='rgba(255,247,198,.9)';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,37+Math.sin(t*2)*4,0,Math.PI*2);g.stroke();}}
   g.restore();},
  cizOn(o,t){const k=o.bh12;if(!k.aktif||P.ucus!==o)return;
   // Her küçük başarıda birbirlerine dönük, yere sabit ayaklardan yumuşak
   // bir memnuniyet hareketi. Sadece çizimi etkiler; kutlama kendine aittir.
   const tepki=k.faz<3&&k.glow>0?Math.sin(Math.PI*(1-Math.min(1,k.glow))):0;
   if(typeof fezaCizPoz==='function'){if(tepki>.001){g.save();g.translate(P.x,P.y);g.rotate(.045*tepki);g.translate(-P.x,-P.y);}
    fezaCizPoz(g,P.x,P.y,1,k.faz===3?'sevinc':'ayakta_yan',t);if(tepki>.001)g.restore();}
   if(typeof anne12Ciz==='function'){const u=devir(k),ax=P.x+105-41*u;if(tepki>.001){g.save();g.translate(ax,o.y);g.rotate(-.04*tepki);g.translate(-ax,-o.y);}
    anne12Ciz(g,ax,o.y,.9+.1*u,t,{poz:k.faz===3?'dans':'el',yon:1,hareket:.3});if(tepki>.001)g.restore();}
   if(typeof pirilCizPoz==='function'){g.save();pirilCizPoz(g,P.x+60,P.y-115+Math.sin(t*2)*5,.6,'ucus',t);g.restore();}},
  testBitir(o){if(!o.bh12.aktif)start(o);if(active===o)release(o,true);}
 });
})();
