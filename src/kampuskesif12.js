/* Kampüste anneyle top şenliği — yazısız, üç farklı aşamalı oyun.
   Tür: kampusTopSenligi. Paslaşma, üç renkli potaya atış, birlikte top zıplatma.
   Büyük dokunma alanı; sürükleyip bırakma veya dokunma; yanlış ve süre baskısı yok. */
'use strict';
(() => {
 const R=['#f9a6b6','#f4ce78','#8edbd5','#c9adf0'];
 const C=(v,a,b)=>Math.max(a,Math.min(b,v));
 const ease=v=>{v=C(v,0,1);return v*v*(3-2*v);};
 let aktif=null,ptr=null;
 function emit(ad,o,more){OLAY.emit(ad,Object.assign({o,asama:o.ks12.faz},more||{}));}
 function ses(v){if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx('parilti',v);}catch(_) {}}
 function clear(){ptr=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
 function world(e){const r=cv.getBoundingClientRect();return{x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};}
 function eat(e){if(e.cancelable)e.preventDefault();e.stopPropagation();}
 function el(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 function path(c,p,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)c.lineTo(p[i][0],p[i][1]);c.stroke();}
 function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*.2,y-r*.2,x+r,y);c.quadraticCurveTo(x+r*.2,y+r*.2,x,y+r);c.quadraticCurveTo(x-r*.2,y+r*.2,x-r,y);c.quadraticCurveTo(x-r*.2,y-r*.2,x,y-r);c.fill();}
 function top(c,x,y,r,t){c.save();c.translate(x,y);c.rotate(Math.sin(t*2)*.13);el(c,0,0,r,r,'#e98593');c.save();c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.clip();c.fillStyle='#ffd6a2';c.fillRect(-r*.25,-r,r*.5,r*2);c.fillStyle='#8dcfc9';c.fillRect(-r,-r*.2,r*2,r*.4);c.restore();c.strokeStyle='#fff5de';c.lineWidth=2;c.beginPath();c.arc(0,0,r-1,0,Math.PI*2);c.stroke();el(c,-r*.31,-r*.36,r*.16,r*.11,'rgba(255,255,255,.65)');c.restore();}
 function point(o,i){return {x:o.x+(i-1)*133,y:o.y-260};}
 // Annenin gerçek takipçi konumu ile etkinlik sahnesi arasında geçiş.
 function anneDurum(o,ileri){const k=o.ks12,gir=ease((k.anneT+(ileri||0))/2.0),cik=k.durum==='kutlama'?ease(k.t/3.2):0;
  const x=k.anneBasX+(o.x+195-k.anneBasX)*gir,son=o.x-250+64;
  return {x:x+(son-x)*cik,scale:(1-.08*gir)+(.08*gir)*cik,gir,cik};}
 function init(o){if(aktif||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
  const k=o.ks12;aktif=o;k.aktif=true;k.faz=0;k.count=0;k.gol=[false,false,false];k.sira=[];k.durum='bekle';k.idle=0;k.help=0;k.x=o.x-195;k.y=o.y-62;k.fz=P.x;
  k.anneBasX=typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.hazir&&Number.isFinite(ANNE12.x)?ANNE12.x:P.x+64;k.anneT=0;
  P.ucus=o;P.vx=P.vy=P.buf=P.kilit=P.fade=0;clear();emit('kampusTopBasla',o);}
 function release(o,tamam){const k=o.ks12;if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-250;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.kilit=P.air=0;P.ground=true;P.dj=true;P.f=1;}
  k.aktif=false;k.sira.length=0;if(aktif===o)aktif=null;clear();if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
  if(typeof D!=='undefined'){D.x=P.x-65;D.y=P.y-110;D.vx=D.vy=0;}
  if(tamam&&!o.done){o.done=true;o.tk.bitti=true;emit('kampusTopBitti',o);}else if(!tamam&&!o.done)k.faz=-1;}
 function next(o){const k=o.ks12;k.faz++;k.sira.length=0;k.count=0;k.durum=k.faz===3?'kutlama':'bekle';k.t=0;k.idle=0;k.help=0;k.x=o.x-195;k.y=o.y-62;emit('kampusTopAsama',o);ses(.65);}
 function baslatAtis(o,i,help){const k=o.ks12;if(!k.aktif||k.durum!=='bekle'||k.faz>=3)return false;
  const from={x:k.x,y:k.y};let to;
  if(k.faz===0){const a=anneDurum(o,.95),hareket=a.gir<.99;to={x:a.x+(hareket?15:-28)*a.scale,y:o.y-(hareket?45:62)*a.scale};}
  else if(k.faz===1){if(i<0||i>2||k.gol[i])i=k.gol.findIndex(v=>!v);if(i<0)return false;to=point(o,i);}
  else to={x:o.x-65,y:o.y-100};
  k.durum='gidis';k.t=0;k.from=from;k.to=to;k.hedef=i;k.help=0;k.idle=0;k.user=!help;emit('kampusTopAtis',o,{yardim:!!help});ses(.4);return true;}
 function hedef(o,p){const k=o.ks12;let en=-1,d=Infinity;for(let i=0;i<3;i++){const z=point(o,i),dd=Math.hypot(p.x-z.x,p.y-z.y);if(dd<d){d=dd;en=i;}}
  // Önce gerçekten en yakın potayı bul: kullanılan bir potanın kenarına
  // ikinci kez basmak komşu pota seçimine dönüşmesin.
  if(d>=110)return -1;if(k.gol[en]||k.sira.includes(en)||(k.durum!=='bekle'&&k.hedef===en))return -2;return en;}
 function bas(e){const o=aktif;if(!o||DURUM!=='oyun'||e.target!==cv||ptr||e.pointerType==='mouse'&&e.button!==0)return;const k=o.ks12;if(k.faz>=3)return;
  const p=world(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
  // Sadece farklı potalar top havadayken sıraya alınır. Pas ve zıplatma
  // aynı topa tekrar basma davranışını korur, başka bir aşamaya taşınmaz.
  if(k.durum!=='bekle'){if(k.faz!==1||k.sira.length>=3)return;const i=hedef(o,p);if(i<0)return;eat(e);ptr={id:e.pointerId,x:p.x,y:p.y,i,drag:false,sira:true};try{cv.setPointerCapture(e.pointerId);}catch(_){}k.idle=0;k.help=0;return;}
  const a=anneDurum(o),hareket=a.gir<.99,ball=Math.hypot(p.x-k.x,p.y-k.y)<90, target=k.faz===1?hedef(o,p):-1, mother=k.faz===0&&Math.hypot(p.x-(a.x+(hareket?15:-28)*a.scale),p.y-(o.y-(hareket?45:62)*a.scale))<105, field=k.faz===2&&Math.abs(p.x-o.x)<220&&p.y>o.y-300&&p.y<o.y-30;
  if(!ball&&target<0&&!mother&&!field)return;eat(e);ptr={id:e.pointerId,x:p.x,y:p.y,i:target,drag:ball};try{cv.setPointerCapture(e.pointerId);}catch(_){}k.idle=0;k.help=0;}
 function move(e){if(!ptr||!aktif||e.pointerId!==ptr.id)return;eat(e);const p=world(e);if(Number.isFinite(p.x)&&Number.isFinite(p.y)){ptr.x=p.x;ptr.y=p.y;}aktif.ks12.idle=0;}
 function end(e){if(!ptr||!aktif||e.pointerId!==ptr.id)return;eat(e);const t=ptr;ptr=null;if(e.type!=='pointerup')return;const k=aktif.ks12,p=world(e),i=k.faz===1?(t.i>=0?t.i:hedef(aktif,p)):-1;if(k.faz===1&&i===-2)return;
  if(t.sira||(k.faz===1&&k.sira.length)){if(k.faz===1&&i>=0&&!k.gol[i]&&!k.sira.includes(i)&&!(k.durum!=='bekle'&&k.hedef===i)){k.sira.push(i);k.idle=0;ses(.25);}return;}
  baslatAtis(aktif,i,false);}
 addEventListener('pointerdown',bas,true);addEventListener('pointermove',move,true);addEventListener('pointerup',end,true);addEventListener('pointercancel',end,true);
 cv.addEventListener('lostpointercapture',e=>{if(ptr&&ptr.id===e.pointerId)ptr=null;});
 addEventListener('blur',()=>{ptr=null;});addEventListener('pagehide',()=>{ptr=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden)ptr=null;});
 addEventListener('keydown',e=>{if(!aktif||DURUM!=='oyun'||e.repeat||e.target&&/^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName))return;if(!/^(Space|Enter|KeyE|Digit1|Digit2|Digit3)$/.test(e.code))return;eat(e);const i=/^Digit[1-3]$/.test(e.code)?Number(e.code.slice(-1))-1:-1;baslatAtis(aktif,i,false);},true);
 OLAY.on('durum',d=>{ptr=null;if(aktif&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')release(aktif,false);});
 function guncelle(o,dt){const k=o.ks12;if(DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);
  if(!k.aktif){if(!o.done&&!aktif&&!P.ucus&&P.ground&&P.x>o.x-330&&P.x<o.x-150&&Math.abs(P.y-o.y)<100)init(o);return;}
  k.anneT+=dt;
  if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampusTop',1.5,k.kameraFn,1,.48);
  if(k.durum==='kutlama'){k.t+=dt;if(k.t>=5)release(o,true);return;}
  if(k.durum==='bekle'){
   if(ptr)return;if(k.faz===1&&k.sira.length){const i=k.sira.shift();if(!k.gol[i])baslatAtis(o,i,false);return;}k.idle+=dt;if(k.idle>7)k.help=1;if(k.idle>(k.yardimN?14:22)){k.yardimN++;baslatAtis(o,-1,true);}return;
  }
  k.t+=dt;const u=ease(k.t/.95);k.x=k.from.x+(k.to.x-k.from.x)*u;
  // Son bölümde top zemine kadar inip geri yükselir; pas ve pota ise havadan kavislidir.
  k.y=k.from.y+(k.to.y-k.from.y)*u+Math.sin(Math.PI*u)*(k.faz===2?43:k.faz===1?-90:-65);
  if(k.t<.95)return;
  if(k.durum==='gidis'){
   if(k.faz===1&&k.hedef>=0)k.gol[k.hedef]=true;k.count++;ses(.7);emit('kampusTopYakalandi',o);
   k.durum='donus';k.t=0;k.from={x:k.to.x,y:k.to.y};k.to={x:o.x-195,y:o.y-62};
  } else {k.durum='bekle';k.t=0;k.x=o.x-195;k.y=o.y-62;if(k.faz===0&&k.count>=3||k.faz===1&&k.count>=3||k.faz===2&&k.count>=4)next(o);}
 }
 function ciz(o,t){const k=o.ks12;if(o.x+420<cam.x||o.x-420>cam.x+VW)return;const x=o.x,y=o.y;g.save();
  // Açık çim üzerinde dokulu sıcak saha; arkada üç çiçek renkli pota.
  el(g,x,y-6,300,32,'rgba(255,222,171,.38)');g.strokeStyle='rgba(255,251,231,.9)';g.lineWidth=3;g.beginPath();g.ellipse(x,y-6,260,20,0,0,Math.PI*2);g.stroke();
  if(k.aktif&&k.faz===1){for(let i=0;i<3;i++){const p=point(o,i),on=k.gol[i];path(g,[[p.x,p.y+36],[p.x,y-12]],'#c7ac88',5);
    g.fillStyle=on?'#ffefd1':R[i];g.beginPath();g.roundRect(p.x-40,p.y-50,80,42,12);g.fill();g.strokeStyle='#fffbeb';g.lineWidth=4;g.beginPath();g.ellipse(p.x,p.y,36,17,0,0,Math.PI*2);g.stroke();
    if(on){star(g,p.x,p.y-34,11,'#fff6c7');}else{const queued=k.sira.includes(i);g.globalAlpha=queued?.9:.45+.2*Math.sin(t*3+i);g.strokeStyle=queued?'#ffe18c':'#fff9da';g.lineWidth=queued?5:3;g.beginPath();g.ellipse(p.x,p.y,44+Math.sin(t*2)*2,23,0,0,Math.PI*2);g.stroke();g.globalAlpha=1;}}}
  // Her başarılı etap gerçek yıldızla kalır; metin/sayı yok.
  if(k.aktif&&k.faz<3)for(let i=0;i<(k.faz===2?4:3);i++){const px=x-60+i*40;el(g,px,y-375,12,12,'rgba(255,248,225,.75)');if(i<k.count)star(g,px,y-375,8,R[i%4]);}
  if(k.aktif&&k.faz===3){for(let i=0;i<14;i++){const a=i*Math.PI*2/14+t*.35,rr=110+Math.sin(t+i)*8;star(g,x+Math.cos(a)*rr,y-245+Math.sin(a)*rr*.55,3+i%3,R[i%4]);}}
  g.restore();}
 function cizOn(o,t){const k=o.ks12;if(!k.aktif||P.ucus!==o)return;
  if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,k.durum==='kutlama'?'sevinc':'ayakta_yan',t);
  const a=anneDurum(o),yuruyor=k.durum==='kutlama'?a.cik<.99:a.gir<.99;
  if(typeof anne12Ciz==='function')anne12Ciz(g,a.x,o.y,a.scale,t,{poz:yuruyor?'yuru':k.durum==='kutlama'?'dans':'el',yon:yuruyor?(k.durum==='kutlama'?-1:1):(k.durum==='kutlama'?1:-1),hareket:yuruyor?1:.3});
  if(typeof pirilCizPoz==='function'){const hx=k.help?o.x-195:P.x+55,hy=k.help?o.y-135:o.y-125;g.save();pirilCizPoz(g,hx,hy+Math.sin(t*2)*5,.65,'ucus',t);g.restore();}
  if(k.durum!=='kutlama'){const bx=ptr&&ptr.drag?ptr.x:k.x,by=ptr&&ptr.drag?ptr.y:k.y;top(g,bx,by,31,t);
   if(k.durum==='bekle'){g.save();g.globalAlpha=.55+.2*Math.sin(t*3);g.strokeStyle='#fff8df';g.lineWidth=3;g.beginPath();g.arc(k.x,k.y,38+Math.sin(t*2)*3,0,Math.PI*2);g.stroke();g.restore();}}
 }
 TUR.kaydet('kampusTopSenligi',{
  kur(o){o.done=false;o.tk={bitti:false};o.ks12={aktif:false,faz:-1,durum:'bekle',count:0,gol:[false,false,false],sira:[],x:o.x-195,y:o.y-62,idle:0,help:0,yardimN:0,t:0,from:null,to:null,hedef:-1,fz:o.x-250,anneBasX:0,anneT:0};
   o.adim=()=>{if(P.ucus===o){P.x=o.x-250;P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};
   o.ks12.kameraFn=()=>{if(typeof omDkEkle==='function')omDkEkle(o.x-320,o.y-405,o.x+280,o.y+18);};},
  guncelle,ciz,cizOn,
  testBitir(o){if(!o.ks12.aktif)init(o);if(aktif===o)release(o,true);}
 });
})();
