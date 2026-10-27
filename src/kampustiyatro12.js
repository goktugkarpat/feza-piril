/* Bilgi Merkezi yakınında anne, Feza ve Pırıl ile kâğıt kukla tiyatrosu.
   Tür: kampusTiyatro. 3 kısa sahne: çiçekli çim / gölet / ışıklı akşam.
   Yazı, puan, süre ve kayıp yok. Kuklayı sürüklemek veya hedefe dokunmak yeterli.
   Olaylar: kampusTiyatroBasla/Asama/Dokun/Ipucu/Bitti {o,sahne,i?}. */
'use strict';
(() => {
 let active=null,ptr=null;
 const C=(v,a,b)=>Math.max(a,Math.min(b,v)),finite=Number.isFinite,PI2=Math.PI*2;
 const events=(name,o,extra)=>{if(typeof OLAY!=='undefined'&&OLAY&&typeof OLAY.emit==='function')OLAY.emit(name,Object.assign({o,sahne:o.kt12.sahne},extra||{}));};
 const sfx=(v=.4)=>{if(typeof AU!=='undefined'&&AU&&typeof AU.sfx==='function')try{AU.sfx('parilti',v);}catch(_){}};
 const note=i=>{if(typeof MZ12!=='undefined'&&MZ12&&typeof MZ12.nota==='function')try{MZ12.nota(i%4);}catch(_){}};
 const clear=()=>{ptr=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();};
 const point=e=>{const r=cv.getBoundingClientRect();return {x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};};
 const eat=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation();};
 function oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,PI2);c.fill();}
 function rect(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill();}
 function path(c,points,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.stroke();}
 function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let j=0;j<10;j++){const a=-Math.PI/2+j*Math.PI/5,q=j%2?r*.44:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
 function flower(c,x,y,r,col){for(let j=0;j<5;j++){const a=j*PI2/5;oval(c,x+Math.cos(a)*r*.7,y+Math.sin(a)*r*.7,r*.5,r*.5,col);}oval(c,x,y,r*.34,r*.34,'#f8cf77');}
 function heart(c,x,y,s,col){c.fillStyle=col;c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.1,y+s*.1,x-s*.9,y-s*.9,x,y-s*.3);c.bezierCurveTo(x+s*.9,y-s*.9,x+s*1.1,y+s*.1,x,y+s*.9);c.fill();}
 function puppet(c,x,y,who,t,happy){c.save();c.translate(x,y);const swing=Math.sin(t*3+(who==='anne'?1:0))*(happy?.09:.025);c.rotate(swing);
  path(c,[[0,17],[0,73]],'#ae805e',4);oval(c,0,73,8,3,'rgba(87,74,65,.2)');
  if(who==='piril'){c.fillStyle='#b9b0e9';c.beginPath();c.moveTo(-12,-1);c.quadraticCurveTo(-28,-18,-22,2);c.lineTo(-8,8);c.moveTo(12,-1);c.quadraticCurveTo(28,-18,22,2);c.lineTo(8,8);c.fill();oval(c,0,0,15,13,'#a195d5');oval(c,-4,-2,2,2,'#fff');oval(c,5,-2,2,2,'#fff');c.restore();return;}
  const adult=who==='anne';oval(c,0,3,adult?16:14,adult?19:17,adult?'#fff8e8':'#f4a8b2');
  path(c,[[-10,-1],[-21,8]],adult?'#efd0b3':'#edc0a4',4);path(c,[[10,-1],[21,happy?-9:8]],adult?'#efd0b3':'#edc0a4',4);
  oval(c,0,-20,adult?15:14,adult?17:15,'#f2c8aa');oval(c,0,-28,adult?15:14,adult?10:8,'#5b433e');
  if(adult)oval(c,12,-23,5,11,'#5b433e');oval(c,-5,-20,1.4,2,'#54423d');oval(c,5,-20,1.4,2,'#54423d');
  c.strokeStyle='#a96767';c.lineWidth=1.4;c.beginPath();c.arc(0,-16,4,.2,Math.PI-.2);c.stroke();oval(c,-9,-16,3,2,'rgba(235,140,145,.45)');oval(c,9,-16,3,2,'rgba(235,140,145,.45)');c.restore();}
 function targets(o){const y=o.y;return [{x:o.x-120,y:y-250},{x:o.x,y:y-300},{x:o.x+120,y:y-250}];}
 // Yalnız son sahnenin kutlama sonunda normal takip konumuna yumuşak geçiş.
 const devir=k=>{const u=k.sahne===2&&k.wait>0?C((1.2-k.wait)/1.2,0,1):0;return u*u*(3-2*u);};
 function dist(q,a,b){const dx=b.x-a.x,dy=b.y-a.y,d=dx*dx+dy*dy,u=d?C(((q.x-a.x)*dx+(q.y-a.y)*dy)/d,0,1):0;return Math.hypot(q.x-a.x-u*dx,q.y-a.y-u*dy);}
 function markPending(o,a,b){const L=targets(o);for(let i=0;i<L.length;i++)if(!o.kt12.hit[i]&&dist(L[i],a,b)<58)ptr.seen[i]=true;}
 function basla(o){if(active||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
  const k=o.kt12;active=o;k.active=true;k.sahne=0;k.hit.fill(false);k.idle=0;k.wait=0;k.yardimN=0;k.px=-165;k.py=-210;
  P.ucus=o;P.x=o.x-280;P.y=o.y;P.vx=P.vy=P.buf=P.kilit=P.fade=0;clear();events('kampusTiyatroBasla',o);sfx(.25);}
 function birak(o,tamam){const k=o.kt12;if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-260;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.kilit=P.fade=P.air=0;P.ground=true;P.dj=true;P.f=1;}
  if(active===o)active=null;k.active=false;clear();if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
  if(tamam&&!o.done){o.done=true;o.tk.bitti=true;events('kampusTiyatroBitti',o);}
  else if(!tamam&&!o.done){k.sahne=0;k.hit.fill(false);k.wait=k.idle=k.glow=0;k.px=-165;k.py=-210;}}
 function mark(o,i,help){const k=o.kt12;if(k.wait>0||i<0||i>2||k.hit[i])return;k.hit[i]=true;k.idle=0;k.hint=false;k.glow=1;
  const p=targets(o)[i];k.px=p.x-o.x;k.py=p.y-o.y;sfx(.45);note(i+k.sahne);events('kampusTiyatroDokun',o,{i,yardim:!!help});
  if(k.hit.every(Boolean)){k.wait=k.sahne===2?6:2.7;events('kampusTiyatroAsama',o);}}
 function bas(e){if(!active||DURUM!=='oyun'||e.target!==cv||ptr||e.pointerType==='mouse'&&e.button!==0)return;
  const o=active,k=o.kt12,p=point(e);if(!finite(p.x)||!finite(p.y)||k.wait>0)return;
  const L=targets(o),insideTarget=L.some((q,i)=>!k.hit[i]&&Math.hypot(q.x-p.x,q.y-p.y)<72),nearPuppet=Math.hypot(p.x-(o.x+k.px),p.y-(o.y+k.py))<92;
  if(!insideTarget&&!nearPuppet)return;eat(e);ptr={id:e.pointerId,x:p.x,y:p.y,oldX:k.px,oldY:k.py,seen:[false,false,false]};try{cv.setPointerCapture(e.pointerId);}catch(_){}
  k.idle=0;k.px=C(p.x-o.x,-220,220);k.py=C(p.y-o.y,-340,-145);markPending(o,p,p);}
 function sur(e){if(!ptr||!active||e.pointerId!==ptr.id)return;eat(e);const p=point(e);if(!finite(p.x)||!finite(p.y))return;const old={x:ptr.x,y:ptr.y};ptr.x=p.x;ptr.y=p.y;
  active.kt12.px=C(p.x-active.x,-220,220);active.kt12.py=C(p.y-active.y,-340,-145);active.kt12.idle=0;markPending(active,old,p);}
 function cancel(){if(ptr&&active){active.kt12.px=ptr.oldX;active.kt12.py=ptr.oldY;}ptr=null;}
 function son(e){if(!ptr||!active||e.pointerId!==ptr.id)return;eat(e);if(e.type!=='pointerup'){cancel();return;}const seen=ptr.seen,o=active;ptr=null;for(let i=0;i<3;i++)if(seen[i])mark(o,i,false);}
 addEventListener('pointerdown',bas,true);addEventListener('pointermove',sur,true);addEventListener('pointerup',son,true);addEventListener('pointercancel',son,true);
 cv.addEventListener('lostpointercapture',e=>{if(ptr&&ptr.id===e.pointerId)cancel();});
 addEventListener('blur',cancel);addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 OLAY.on('durum',d=>{cancel();if(active&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')birak(active,false);});
 addEventListener('keydown',e=>{if(!active||DURUM!=='oyun'||e.repeat||e.target&&/^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(e.target.tagName)||!(/^(Space|Enter|KeyE)$/.test(e.code)))return;
  if(active.kt12.wait>0)return;eat(e);const i=active.kt12.hit.findIndex(v=>!v);if(i>=0)mark(active,i,false);},true);
 function frame(x,y){
  // Arkası açık sahne: kampüs manzarası kuklaların çevresinde görünür.
  rect(g,x-250,y-392,500,272,24,'rgba(255,248,229,.68)');
  rect(g,x-262,y-405,524,23,10,'#bd786f');rect(g,x-270,y-130,540,25,10,'#bb8062');
  g.fillStyle='#e89aa7';g.beginPath();g.moveTo(x-258,y-388);g.quadraticCurveTo(x-200,y-402,x-176,y-346);g.quadraticCurveTo(x-196,y-300,x-258,y-273);g.closePath();g.fill();
  g.beginPath();g.moveTo(x+258,y-388);g.quadraticCurveTo(x+200,y-402,x+176,y-346);g.quadraticCurveTo(x+196,y-300,x+258,y-273);g.closePath();g.fill();
  path(g,[[x-258,y-367],[x-231,y-350],[x-205,y-355]],'#ffd5bf',3);path(g,[[x+258,y-367],[x+231,y-350],[x+205,y-355]],'#ffd5bf',3);
  for(let i=0;i<7;i++)oval(g,x-210+i*70,y-398,7,5,i%2?'#ffd79c':'#f9c6cf');
 }
 function scene(o,t){const k=o.kt12,x=o.x,y=o.y,L=targets(o);g.save();
  if(!k.active){oval(g,x,y-12,78,12,'rgba(68,115,86,.18)');rect(g,x-80,y-230,160,190,16,'#c58673');rect(g,x-68,y-218,136,150,9,'#fff0d5');
   puppet(g,x-25,y-140,'feza',t,false);puppet(g,x+32,y-140,'anne',t,false);g.strokeStyle='rgba(255,251,223,.8)';g.lineWidth=3;g.beginPath();g.arc(x,y-160,83+3*Math.sin(t*2),0,PI2);g.stroke();g.restore();return;}
  frame(x,y);
  if(k.sahne===0){for(let i=0;i<3;i++){const p=L[i];path(g,[[p.x,p.y+30],[p.x,p.y+12]],'#80ad75',3);flower(g,p.x,p.y,k.hit[i]?14:10,k.hit[i]?'#ffadc6':'#f4c4c9');}
   for(let i=0;i<4;i++)oval(g,x-190+i*120,y-165,33,8,'rgba(153,205,147,.4)');}
  if(k.sahne===1){oval(g,x,y-180,185,38,'rgba(135,205,211,.57)');for(let i=0;i<3;i++){const p=L[i];oval(g,p.x,p.y+18,26,6,'#8bc6ba');flower(g,p.x,p.y,k.hit[i]?13:9,k.hit[i]?'#f6b5c1':'#fff5dc');}
   const bx=x-140+k.hit.filter(Boolean).length*85;g.fillStyle='#c18c67';g.beginPath();g.moveTo(bx-35,y-198);g.lineTo(bx+35,y-198);g.quadraticCurveTo(bx+25,y-178,bx-20,y-182);g.closePath();g.fill();}
  if(k.sahne===2){for(let i=0;i<3;i++){const p=L[i];path(g,[[p.x,y-385],[p.x,p.y-16]],'#c9a98d',2);oval(g,p.x,p.y,19,23,k.hit[i]?['#ffe096','#ffbdc9','#b5e3d4'][i]:'#e8d8cb');if(k.hit[i])star(g,p.x,p.y,8,'#fff7d1');}}
  for(let i=0;i<3;i++){const p=L[i],pending=ptr&&ptr.seen[i];if(!k.hit[i]){
   const a=.56+.15*Math.sin(t*2+i);g.beginPath();g.arc(p.x,p.y,36+2*Math.sin(t*2+i),0,PI2);
   // Açık bina ve sahne önünde sıcak, ince dış kontur; hedef konumu değişmez.
   g.globalAlpha=a*.72;g.strokeStyle='#a86e59';g.lineWidth=6;g.stroke();
   g.globalAlpha=a;g.strokeStyle=pending?'#ffe6a3':'#fff9e8';g.lineWidth=3;g.stroke();g.globalAlpha=1;
  }}
  // Yalnız bekleyen çocuğa ilk kalan hedefi göster; basılı parmakta ve
  // molada hiç müdahale etme, mevcut hedef konumlarını değiştirme.
  if(k.hint&&k.wait<=0&&!ptr&&DURUM==='oyun'&&!(typeof document!=='undefined'&&document.hidden)){
   const i=k.hit.findIndex(v=>!v);if(i>=0){const p=L[i];g.save();g.strokeStyle='#d59b51';g.globalAlpha=.76+.1*Math.sin(t*2);g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,47+Math.sin(t*2)*3,0,PI2);g.stroke();
    for(let j=0;j<3;j++){const a=t*.8+j*PI2/3;star(g,p.x+Math.cos(a)*54,p.y+Math.sin(a)*54,4,'#ffe8a3');}g.restore();}}
  puppet(g,x+155,y-220,'anne',t,k.glow>0||k.wait>0);puppet(g,x-155,y-340+Math.sin(t*2)*5,'piril',t,true);
  puppet(g,x+k.px,y+k.py,'feza',t,!!ptr||k.glow>0);if(k.glow>0){g.globalAlpha=k.glow;heart(g,x+170,y-300,8,'#ffabc3');star(g,x+k.px+28,y+k.py-30,9,'#fff2a5');g.globalAlpha=1;}g.restore();
 }
 function front(o,t){if(!o.kt12.active||P.ucus!==o)return;if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,o.kt12.wait>0?'sevinc':'ayakta_yan',t);
  if(typeof anne12Ciz==='function'){const u=devir(o.kt12);anne12Ciz(g,P.x+100-36*u,o.y,.9+.1*u,t,{poz:o.kt12.wait>0?'dans':'el',yon:1,hareket:.3});}
  if(typeof pirilCizPoz==='function'){g.save();pirilCizPoz(g,P.x+58,P.y-115+Math.sin(t*2)*5,.6,'ucus',t);g.restore();}}
 TUR.kaydet('kampusTiyatro',{
  kur(o){o.done=false;o.tk={bitti:false};o.kt12={active:false,sahne:0,hit:[false,false,false],idle:0,hint:false,wait:0,glow:0,px:-165,py:-210};
   o.adim=()=>{if(P.ucus===o){P.x=o.x-280+20*devir(o.kt12);P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};},
  guncelle(o,dt){const k=o.kt12;if(DURUM!=='oyun'||!(dt>0)||!finite(dt))return;dt=Math.min(dt,.05);k.glow=Math.max(0,k.glow-dt*.65);
   if(!k.active){if(!o.done&&!active&&!P.ucus&&P.ground&&P.x>o.x-340&&P.x<o.x-160&&Math.abs(P.y-o.y)<100)basla(o);return;}
   if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampusTiyatro',1.5,()=>omDkEkle(o.x-330,o.y-420,o.x+330,o.y+20),1,.48);
   if(k.wait>0){k.wait-=dt;if(k.wait<=0){if(k.sahne===2)birak(o,true);else{k.sahne++;k.hit.fill(false);k.idle=0;k.hint=false;k.px=-165;k.py=-210;}}return;}
   if(ptr)return;k.idle+=dt;if(k.idle>8&&!k.hint){k.hint=true;events('kampusTiyatroIpucu',o);sfx(.2);}if(k.idle>(k.yardimN?12:24)){const i=k.hit.findIndex(v=>!v);if(i>=0){k.yardimN++;mark(o,i,true);}}
  },ciz:scene,cizOn:front,
  testBitir(o){if(!o.kt12.active)basla(o);if(active===o)birak(o,true);}
 });
})();
