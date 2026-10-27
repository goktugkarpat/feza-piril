/* Kulede üç yazısız keşif: dürbün, ışıklı kule, aile fotoğrafı.
   Tür: kampusKule. Olaylar kampusKuleBasla/Asama/Dokun/Ipucu/Bitti. */
'use strict';
(() => {
 const C=(n,a,b)=>Math.max(a,Math.min(b,n)), PI=Math.PI, colors=['#e98a9e','#83c5c6','#f2c36c','#a996d4'];
 let active=null,ptr=null;
 // Son saniyede çizim ve fizik ayakları yürüyüşteki konuma yaklaşır.
 const cikis=k=>{const u=C(k.faz===3?k.celebrate-2:0,0,1);return u*u*(3-2*u);};
 const emit=(name,o,extra)=>{if(typeof OLAY!=='undefined'&&OLAY&&OLAY.emit)OLAY.emit(name,Object.assign({o,asama:o.ku12.faz},extra||{}));};
 const sound=i=>{if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx('parilti',.36);}catch(_){} if(typeof MZ12!=='undefined'&&MZ12&&MZ12.nota)try{MZ12.nota(i%4);}catch(_){}};
 const clear=()=>{ptr=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();};
 const xy=e=>{const r=cv.getBoundingClientRect();return{x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};};
 const consume=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation();};
 function oval(x,y,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,2*PI);g.fill();}
 function rect(x,y,w,h,r,col){g.fillStyle=col;g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();}
 function star(x,y,r,col){g.fillStyle=col;g.beginPath();for(let i=0;i<10;i++){let a=-PI/2+i*PI/5,d=i%2?r*.44:r;if(i===0)g.moveTo(x+Math.cos(a)*d,y+Math.sin(a)*d);else g.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d);}g.closePath();g.fill();}
 function line(x1,y1,x2,y2,col,w){g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
 function targets(o){const x=o.x,y=o.y; if(o.ku12.faz===0)return [[-195,-320],[-65,-215],[75,-350],[205,-230]].map(v=>({x:x+v[0],y:y+v[1]}));
  if(o.ku12.faz===1)return [[-108,-345],[0,-380],[108,-345],[-108,-235],[0,-265],[108,-235]].map(v=>({x:x+v[0],y:y+v[1]}));
  return [[-150,-115],[0,-115],[150,-115]].map(v=>({x:x+v[0],y:y+v[1]}));}
 // Önce bütün hedeflerin en yakınını bul: bitmiş olanın kenarına basmak
 // komşu hedefe dönüşmesin. -2 bitmiş hedef, -1 hedef dışı anlamına gelir.
 function nearest(o,p,r=75){const k=o.ku12,L=targets(o);let n=-1,d=r;for(let i=0;i<L.length;i++){const z=Math.hypot(p.x-L[i].x,p.y-L[i].y);if(z<d){d=z;n=i;}}return n>=0&&k.hit[n]?-2:n;}
 function reset(k){k.faz=0;k.hit=[false,false,false,false];k.idle=0;k.help=false;k.yardimN=0;k.glow=0;k.lx=0;k.ly=-275;k.celebrate=0;}
 function start(o){if(active||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;reset(o.ku12);active=o;o.ku12.active=true;P.ucus=o;P.x=o.x-280;P.y=o.y;o.ku12.prX=P.x+60;o.ku12.prY=P.y-120;P.vx=P.vy=P.buf=P.kilit=P.fade=0;clear();emit('kampusKuleBasla',o);sound(0);}
 function release(o,done){const k=o.ku12;if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-260;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.kilit=P.fade=P.air=0;P.ground=true;P.dj=true;P.f=1;
   if(done&&typeof D!=='undefined'&&D){D.x=P.x-34;D.y=P.y-96;D.vx=D.vy=0;}}
  if(active===o)active=null;k.active=false;clear();if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);if(done&&!o.done){o.done=true;o.tk.bitti=true;emit('kampusKuleBitti',o);}else if(!done&&!o.done)reset(k);}
 function mark(o,i,yardim=false){const k=o.ku12;if(k.faz>=3||i<0||i>=k.hit.length||k.hit[i])return;k.hit[i]=true;k.idle=0;k.help=false;k.glow=1;sound(i+k.faz);emit('kampusKuleDokun',o,{i,yardim});
  if(k.hit.every(Boolean)){k.faz++;k.hit=Array(k.faz===1?6:k.faz===2?3:0).fill(false);k.idle=0;emit('kampusKuleAsama',o);}}
 function down(e){if(!active||DURUM!=='oyun'||e.target!==cv||ptr||e.pointerType==='mouse'&&e.button!==0||active.ku12.faz>=3)return;const o=active,p=xy(e),k=o.ku12;if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
  const hit=nearest(o,p,86),lens=k.faz===0&&Math.hypot(p.x-(o.x+k.lx),p.y-(o.y+k.ly))<105;
  if(hit<0&&!lens)return;consume(e);ptr={id:e.pointerId,hit,x:p.x,y:p.y,oldX:k.lx,oldY:k.ly};try{cv.setPointerCapture(e.pointerId);}catch(_){}k.idle=0;}
 function move(e){if(!ptr||!active||e.pointerId!==ptr.id)return;consume(e);const p=xy(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;ptr.x=p.x;ptr.y=p.y;const k=active.ku12;if(k.faz===0){k.lx=C(p.x-active.x,-245,245);k.ly=C(p.y-active.y,-390,-165);}k.idle=0;}
 function cancel(){if(ptr&&active&&active.ku12.faz===0){active.ku12.lx=ptr.oldX;active.ku12.ly=ptr.oldY;}ptr=null;}
 function up(e){if(!ptr||!active||e.pointerId!==ptr.id)return;consume(e);if(e.type!=='pointerup'){cancel();return;}const o=active,t=ptr;ptr=null;let i=nearest(o,{x:t.x,y:t.y},100);if(i===-2)return;if(i===-1)i=t.hit;mark(o,i);}
 addEventListener('pointerdown',down,true);addEventListener('pointermove',move,true);addEventListener('pointerup',up,true);addEventListener('pointercancel',up,true);
 cv.addEventListener('lostpointercapture',e=>{if(ptr&&ptr.id===e.pointerId)cancel();});addEventListener('blur',cancel);addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 addEventListener('keydown',e=>{if(!active||DURUM!=='oyun'||e.repeat||e.target&&/^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(e.target.tagName)||!(/^(Space|Enter|KeyE)$/.test(e.code)))return;consume(e);const i=active.ku12.hit.findIndex(v=>!v);if(i>=0)mark(active,i);},true);
 OLAY.on('durum',d=>{cancel();if(active&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')release(active,false);});
 function drawIcon(i,x,y,t){g.save();g.translate(x,y);if(i===0){rect(-23,-20,46,40,5,'#f8eee0');rect(-15,-12,30,24,3,'#9ac9c8');oval(0,-24,25,9,'#adbed0');}
  else if(i===1){oval(0,8,32,11,'#8ed2d2');g.fillStyle='#c28b67';g.beginPath();g.moveTo(-25,0);g.lineTo(25,0);g.lineTo(15,14);g.lineTo(-15,14);g.closePath();g.fill();line(0,-23,0,0,'#f9edcc',3);}
  else if(i===2){for(let j=0;j<5;j++){const a=j*2*PI/5;oval(Math.cos(a)*12,Math.sin(a)*12,9,9,'#f7a9bc');}oval(0,0,6,6,'#f7d87e');}
  else{rect(-9,-25,18,44,3,'#af9c8c');rect(-17,-28,34,9,3,'#f2e6c7');star(0,-37,9,'#f7cd78');}g.restore();}
 function draw(o,t){const k=o.ku12,x=o.x,y=o.y;g.save();
  if(!k.active){oval(x,y-8,70,12,'rgba(73,114,80,.18)');line(x,y-20,x,y-140,'#af8769',8);rect(x-54,y-185,108,52,15,'#94b7b8');oval(x+47,y-159,16,20,'#f3e9ce');oval(x+47,y-159,10,14,'#83b6ba');star(x+68,y-202,12,'#ffdc8b');g.restore();return;}
  const L=targets(o);if(k.faz===0){for(let i=0;i<L.length;i++){const p=L[i];oval(p.x,p.y,46,46,k.hit[i]?'rgba(255,244,205,.35)':'rgba(255,250,227,.76)');drawIcon(i,p.x,p.y,t);if(!k.hit[i]){g.strokeStyle='rgba(255,251,223,.9)';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,50+Math.sin(t*2+i)*2,0,2*PI);g.stroke();}}
   oval(x+k.lx,y+k.ly,68,68,'rgba(176,224,224,.18)');g.strokeStyle='#f7e6bf';g.lineWidth=9;g.beginPath();g.arc(x+k.lx,y+k.ly,68,0,2*PI);g.stroke();line(x+k.lx+48,y+k.ly+49,x+k.lx+94,y+k.ly+93,'#c69d75',12);}
  if(k.faz===1){
   // Aynı özgün kampüs kulesi önbelleği: cam gövde, tuğla kaide ve çokgen seyir katı.
   // Ana dünya çizimi yoksa basit vektör yedek çizilir; hiçbir hedef değişmez.
   let sprite=null;try{if(typeof dn12Sprite==='function')sprite=dn12Sprite('tower');}catch(_){}
   if(sprite&&sprite.width>0&&sprite.height>0)g.drawImage(sprite,x-70.5,y-405,141,360);
   else{
    g.fillStyle='#8d5448';g.beginPath();g.moveTo(x-23,y-96);g.lineTo(x-20,y-150);g.lineTo(x+20,y-150);g.lineTo(x+23,y-96);g.closePath();g.fill();
    g.fillStyle='#354c53';g.beginPath();g.moveTo(x-17,y-150);g.lineTo(x-15,y-335);g.lineTo(x+15,y-335);g.lineTo(x+17,y-150);g.closePath();g.fill();
    line(x-15,y-331,x-15,y-151,'#e3e7dd',3);line(x+15,y-331,x+15,y-151,'#e3e7dd',3);
    for(let yy=y-321;yy<y-160;yy+=20)line(x-13,yy,x+13,yy,'#a9bcb7',1);
    g.fillStyle='#eeeae0';g.beginPath();g.moveTo(x-37,y-336);g.lineTo(x-30,y-347);g.lineTo(x+30,y-347);g.lineTo(x+37,y-336);g.closePath();g.fill();
    rect(x-27,y-369,54,24,3,'#34464b');line(x-9,y-368,x-9,y-347,'#e3e7dd',2);line(x+9,y-368,x+9,y-347,'#e3e7dd',2);
    g.fillStyle='#f3f1e7';g.beginPath();g.moveTo(x-30,y-370);g.lineTo(x-20,y-386);g.lineTo(x,y-393);g.lineTo(x+20,y-386);g.lineTo(x+30,y-370);g.closePath();g.fill();
   }
   for(let i=0;i<L.length;i++){const p=L[i];oval(p.x,p.y,30,30,k.hit[i]?'rgba(255,223,130,.65)':'rgba(255,248,224,.8)');star(p.x,p.y,k.hit[i]?20:15,k.hit[i]?colors[i%4]:'#f2d28d');}}
  if(k.faz>=2){rect(x-172,y-390,344,220,20,'#ca9c7b');rect(x-160,y-378,320,196,13,'#f8efdb');rect(x-150,y-368,300,176,8,'#badfd4');oval(x,y-210,160,45,'#a8d38e');star(x+118,y-340,15,'#fbe39c');
   if(typeof fezaCizPoz==='function')fezaCizPoz(g,x-35,y-204,.56,'sevinc',t);if(typeof anne12Ciz==='function')anne12Ciz(g,x+43,y-204,.5,t,{poz:'el',yon:1,hareket:.2});
   for(let i=0;i<3;i++){if(k.hit[i]||k.faz===3){star(x-102+i*100,y-340+i%2*110,13,colors[i]);}if(k.faz===2){const p=L[i];oval(p.x,p.y,38,38,'#fff7e8');star(p.x,p.y,19,colors[i]);}}}
  if(k.help&&k.faz<3){const i=k.hit.findIndex(v=>!v);if(i>=0){const p=L[i];g.strokeStyle='rgba(255,247,191,.9)';g.lineWidth=4;g.beginPath();g.arc(p.x,p.y,54+Math.sin(t*2)*4,0,2*PI);g.stroke();for(let j=0;j<3;j++){const a=t*1.4+j*2*PI/3;star(p.x+Math.cos(a)*60,p.y+Math.sin(a)*60,4,'#fff0a2');}}}
  if(k.glow>0){g.globalAlpha=k.glow;star(x+205,y-380,14,'#fff4a5');g.globalAlpha=1;}g.restore();}
 // İpucu ve etkileşim arasında Pırıl konum değiştirse de kare atlamaz.
 function pirilAdim(o,dt){const k=o.ku12;let x=P.x+60,y=P.y-120;if(k.faz===3){x=o.x-260-34;y=P.y-96;}else if(k.help&&k.idle>=8&&k.faz<3){const i=k.hit.findIndex(v=>!v);if(i>=0){const q=targets(o)[i];x=q.x-65;y=q.y-60;}}
  const dx=x-k.prX,dy=y-k.prY,d=Math.hypot(dx,dy),a=d>0?Math.min(1,160*dt/d):0;k.prX+=dx*a;k.prY+=dy*a;}
 function front(o,t){const k=o.ku12;if(!k.active||P.ucus!==o)return;const q=cikis(k);if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,k.faz===3?'sevinc':'ayakta_yan',t);if(typeof anne12Ciz==='function')anne12Ciz(g,P.x+105-41*q,o.y,.9+.1*q,t,{poz:k.faz===3?'dans':'el',yon:1,hareket:.3});if(typeof pirilCizPoz==='function'){const bob=k.faz===3?C(3-k.celebrate,0,1):1;g.save();pirilCizPoz(g,k.prX,k.prY+Math.sin(t*2)*5*bob,.6,'ucus',t);g.restore();}}
 TUR.kaydet('kampusKule',{
  kur(o){o.done=false;o.tk={bitti:false};o.ku12={active:false};reset(o.ku12);o.adim=()=>{if(P.ucus===o){P.x=o.x-280+20*cikis(o.ku12);P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};},
  guncelle(o,dt){const k=o.ku12;if(DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);k.glow=Math.max(0,k.glow-dt*.7);if(!k.active){if(!o.done&&!active&&!P.ucus&&P.ground&&P.x>o.x-340&&P.x<o.x-160&&Math.abs(P.y-o.y)<100)start(o);return;}
   pirilAdim(o,dt);if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampusKule',1.5,()=>omDkEkle(o.x-360,o.y-430,o.x+360,o.y+20),1,((typeof W==='number'&&typeof H==='number'&&H>0&&W/H<.55)?Math.max(.34,Math.min(.48,.93*W/H)):.48));
   if(k.faz===3){k.celebrate+=dt;if(k.celebrate>=3)release(o,true);return;}if(ptr)return;k.idle+=dt;
   if(k.idle>=8&&!k.help){k.help=true;emit('kampusKuleIpucu',o);sound(0);}
   if(k.idle>=(k.yardimN?12:24)){const i=k.hit.findIndex(v=>!v);if(i>=0){k.yardimN++;mark(o,i,true);emit('kampusKuleYardim',o,{i});}}},
  ciz:draw,cizOn:front,testBitir(o){if(!o.ku12.active)start(o);if(active===o)release(o,true);}
 });
})();
