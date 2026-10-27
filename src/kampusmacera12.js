/* Anneyle kampüste iki çok aşamalı, yazısız etkinlik.
   kampusSakuraAtolye: FASS merkez çiminde serbest uçurtma, rüzgâr yolu,
   kampüs anılarıyla çerçeve. kampusSanatAtolye: fırça, damga, yıldız izi.
   Olaylar: kampusMaceraBasla/Asama/Dokun/Ipucu/Bitti {o, ad, asama}.
   Bu modül kendi nesneleri dışında dünya, kayıt ve ses sistemini değiştirmez. */
'use strict';
(() => {
 const NAMES=['ucurtmaBahcesi','kampusSanati'];
 const COLORS=['#f27eaa','#86cbe0','#f5bb6d','#a995d4','#7dbb89'];
 let current=null,pointer=null;
 const clampM=(v,a,b)=>Math.max(a,Math.min(b,v));
 const good=n=>Number.isFinite(n);
 const world=e=>{const r=cv.getBoundingClientRect();return {x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};};
 const eat=e=>{if(e.cancelable)e.preventDefault();e.stopPropagation();};
 const clear=()=>{pointer=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();};
 const emit=(name,o,extra)=>{if(typeof OLAY!=='undefined'&&OLAY&&typeof OLAY.emit==='function')OLAY.emit(name,Object.assign({o,ad:o.m12.ad,asama:o.m12.faz},extra||{}));};
 const sfx=(n=.55)=>{if(typeof AU!=='undefined'&&AU&&typeof AU.sfx==='function')try{AU.sfx('parilti',n);}catch(_){}};
 function note(i){if(typeof MZ12!=='undefined'&&MZ12&&typeof MZ12.nota==='function')try{MZ12.nota(i%4);}catch(_){}}
 function el(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 function round(c,x,y,w,h,r,col){c.fillStyle=col;c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);c.fill();}
 function line(c,pts,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.stroke();}
 function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r*.43:r;c.lineTo(x+Math.cos(a)*d,y+Math.sin(a)*d);}c.closePath();c.fill();}
 function flower(c,x,y,r,col){for(let i=0;i<5;i++){const a=i*Math.PI*2/5;el(c,x+Math.cos(a)*r*.68,y+Math.sin(a)*r*.68,r*.55,r*.55,col);}el(c,x,y,r*.33,r*.33,'#ffdb83');}
 function kite(c,x,y,s,col,t){c.save();c.translate(x,y);c.rotate(Math.sin(t*.9)*.08);c.scale(s,s);c.fillStyle=col;c.beginPath();c.moveTo(0,-34);c.quadraticCurveTo(14,-16,26,0);c.lineTo(0,38);c.lineTo(-26,0);c.quadraticCurveTo(-14,-16,0,-34);c.fill();line(c,[[0,-31],[0,34]],'#fff5dc',2);line(c,[[-22,0],[22,0]],'#fff5dc',2);line(c,[[0,36],[5,51],[-3,64],[2,74]],'#f7dfbd',2);el(c,2,52,5,3,'#ffd875');el(c,-1,66,5,3,'#a6d6d9');c.restore();}
 function icon(c,type,x,y,s,t){c.save();c.translate(x,y);c.scale(s,s);
  if(type==='kite'){kite(c,0,0,.65,'#f695ab',t);}
  if(type==='flower')flower(c,0,0,18,'#f7aabd');
  if(type==='sun'){for(let i=0;i<8;i++){const a=i*Math.PI/4;line(c,[[Math.cos(a)*19,Math.sin(a)*19],[Math.cos(a)*26,Math.sin(a)*26]],'#eab764',3);}el(c,0,0,15,15,'#ffdc82');}
  if(type==='boat'){el(c,0,12,31,4,'#a6d9d4');c.fillStyle='#b67f55';c.beginPath();c.moveTo(-28,0);c.lineTo(29,0);c.quadraticCurveTo(20,20,-19,17);c.closePath();c.fill();line(c,[[0,-21],[0,1]],'#fff0d3',2);c.fillStyle='#fff2d9';c.beginPath();c.moveTo(2,-19);c.lineTo(20,-1);c.lineTo(2,-1);c.fill();}
  if(type==='library'){c.fillStyle='#f5e8d1';c.fillRect(-27,-9,54,27);c.fillStyle='#83b9c0';c.fillRect(-14,-6,28,19);c.fillStyle='#a6b9af';c.beginPath();c.moveTo(-25,-9);c.quadraticCurveTo(0,-32,25,-9);c.fill();line(c,[[-14,3],[14,3]],'#f6f4df',2);}
  if(type==='heart'){c.fillStyle='#ee9ab0';c.beginPath();c.moveTo(0,20);c.bezierCurveTo(-29,2,-21,-22,0,-10);c.bezierCurveTo(21,-22,29,2,0,20);c.fill();}
  c.restore();}
 function focus(o){if(typeof omDikkat==='function'&&typeof omDkEkle==='function'){
  // Dar portrede rüzgâr rotasının iki ucu ve Feza aynı kadraja sığsın.
  const darRota=o.m12.ad===NAMES[0]&&o.m12.faz===1&&typeof W==='number'&&typeof H==='number'&&H>0&&W/H<.55;
  const altSinir=darRota?Math.max(.34,Math.min(.48,.93*W/H)):.48;
  omDikkat('kampusMacera'+o.m12.ad,1.5,()=>omDkEkle(o.x-350,o.y-440,o.x+350,o.y+20),1,altSinir);
 }}
 function start(o){if(current||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
  current=o;const m=o.m12;m.active=true;m.faz=0;m.idle=0;m.help=0;m.yardimN=0;m.kutla=0;m.routeSeen.fill(false);m.routeLast=-1;m.dotSeen.fill(false);m.dotOrder.length=0;P.ucus=o;P.x=o.x-280;P.y=o.y;m.prX=P.x+70;m.prY=P.y-130;P.vx=P.vy=P.buf=P.kilit=P.fade=0;clear();emit('kampusMaceraBasla',o);sfx(.3);}
 function release(o,completed){const m=o.m12;if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-260;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.kilit=P.fade=P.air=0;P.ground=true;P.dj=true;P.f=1;
  if(completed&&typeof D!=='undefined'&&D){D.x=P.x-34;D.y=P.y-96;D.vx=D.vy=0;}}
  if(current===o)current=null;m.active=false;clear();if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
  if(completed&&!o.done){o.done=true;o.tk.bitti=true;emit('kampusMaceraBitti',o);}
  else if(!completed&&!o.done){
   // Başka sahneye çıkıp aynı etkinliğe dönülürse eski aşamanın tüm hedefleri
   // tamamlanmış kalıp yeni ilk aşamayı kilitlemesin. Mola bu yolu kullanmaz.
   m.faz=-1;m.idle=0;m.help=0;m.n=0;m.glow=0;m.kx=0;m.ky=-250;m.choice=2;
   m.sky.fill(false);m.used.fill(false);m.routeSeen.fill(false);m.routeLast=-1;m.dotSeen.fill(false);m.dotOrder.length=0;m.placed.fill(false);m.paint.length=0;m.marks.length=0;m.color=0;
  }}
 function next(o){const m=o.m12;m.faz++;m.idle=0;m.help=0;m.glow=1;pointer=null;sfx(.7);emit('kampusMaceraAsama',o);if(m.faz===3)m.kutla=0;}
 function action(o,i,help){const m=o.m12;m.idle=0;m.help=0;m.glow=1;sfx(.45);note(i);emit('kampusMaceraDokun',o,{i,yardim:!!help});}
 const flight=o=>[[-190,-310],[0,-385],[190,-300]].map(p=>({x:o.x+p[0],y:o.y+p[1]}));
 const route=o=>[[-240,-215],[-150,-310],[-55,-240],[35,-345],[135,-265],[230,-345]].map(p=>({x:o.x+p[0],y:o.y+p[1]}));
 const dots=o=>[[-125,-290],[-65,-330],[0,-285],[65,-325],[125,-280]].map(p=>({x:o.x+p[0],y:o.y+p[1]}));
 function distSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy,u=l?clampM(((p.x-a.x)*dx+(p.y-a.y)*dy)/l,0,1):0;return Math.hypot(p.x-a.x-u*dx,p.y-a.y-u*dy);}
 function moveTrail(o,a,b,help){const m=o.m12,L=m.ad===NAMES[0]?route(o):dots(o);while(m.n<L.length&&distSegment(L[m.n],a,b)<54){action(o,m.n,help);m.n++;if(m.n===L.length){m.n=0;next(o);break;}}}
 function markFlight(o,i,help){const m=o.m12;if(m.faz!==0||m.ad!==NAMES[0]||m.sky[i])return;
  const p=flight(o)[i];m.sky[i]=true;m.kx=p.x-o.x;m.ky=p.y-o.y;action(o,i,help);if(m.sky.every(Boolean))next(o);}
 function flightPending(o,a,b){const L=flight(o);for(let i=0;i<L.length;i++)if(!o.m12.sky[i]&&distSegment(L[i],a,b)<68)pointer.visited[i]=true;}
 function routePending(o,a,b){const L=route(o);for(let i=0;i<L.length;i++)if(!o.m12.routeSeen[i]&&distSegment(L[i],a,b)<54)pointer.visited[i]=true;}
 function markRoute(o,i,help){const m=o.m12;if(m.ad!==NAMES[0]||m.faz!==1||i<0||i>=m.routeSeen.length||m.routeSeen[i])return;
  m.routeSeen[i]=true;m.routeLast=i;m.n++;action(o,i,help);if(m.n===m.routeSeen.length){m.n=0;next(o);}}
 function dotPending(o,a,b){const L=dots(o);for(let i=0;i<L.length;i++)if(!o.m12.dotSeen[i]&&distSegment(L[i],a,b)<54)pointer.visited[i]=true;}
 function markDot(o,i,help){const m=o.m12;if(m.ad!==NAMES[1]||m.faz!==2||i<0||i>=m.dotSeen.length||m.dotSeen[i])return;
  m.dotSeen[i]=true;m.dotOrder.push(i);m.n++;action(o,i,help);if(m.n===m.dotSeen.length){m.n=0;next(o);}}
 function place(o,i,p,help){const m=o.m12;if(i<0||i>=m.placed.length||m.placed[i])return;
  m.placed[i]=true;const nx=clampM(p&&good(p.x)?p.x:o.x-105+i*70,o.x-145,o.x+145),ny=clampM(p&&good(p.y)?p.y:o.y-305,o.y-360,o.y-190);
  m.marks.push({x:nx-o.x,y:ny-o.y,type:(m.ad===NAMES[0]?['kite','boat','flower','heart']:['flower','library','sun'])[i]});
  action(o,i,help);if(m.placed.every(Boolean)){m.placed.fill(false);next(o);}}
 function paint(o,p,help){const m=o.m12;if(m.ad!==NAMES[1]||m.faz!==0)return;const x=clampM(p.x-o.x,-165,165),y=clampM(p.y-o.y,-365,-180),last=m.paint[m.paint.length-1];
  if(!last||Math.hypot(last.x-x,last.y-y)>7||last.col!==m.color){if(m.paint.length>=180)m.paint.shift();m.paint.push({x,y,col:m.color});}
  if(!m.used[m.color]){m.used[m.color]=true;action(o,m.color,help);}else m.idle=0;
 }
 function paletteIndex(o,p,y){for(let i=0;i<3;i++)if(Math.hypot(p.x-(o.x+(i-1)*110),p.y-(o.y+y))<48)return i;return -1;}
 function tokenIndex(o,p){const m=o.m12,n=m.ad===NAMES[0]?4:3;for(let i=0;i<n;i++){const x=o.x+(i-(n-1)/2)*105;if(!m.placed[i]&&Math.hypot(p.x-x,p.y-(o.y-102))<49)return i;}return -1;}
 function startPointer(e){if(!current||DURUM!=='oyun'||e.target!==cv||pointer||e.pointerType==='mouse'&&e.button!==0)return;
  const o=current,m=o.m12,p=world(e);if(!good(p.x)||!good(p.y)||m.faz>=3)return;
  let kind='',i=-1;
  if(m.ad===NAMES[0]&&m.faz===0){if(Math.abs(p.x-o.x)<320&&p.y>o.y-455&&p.y<o.y-135)kind='flight';}
  else if(m.ad===NAMES[0]&&m.faz===1){const L=route(o),q=L[m.routeLast<0?0:m.routeLast],kiteHit=Math.hypot(p.x-(q.x-12),p.y-(q.y-42))<28;
   if(kiteHit||L.some((v,j)=>!m.routeSeen[j]&&Math.hypot(p.x-v.x,p.y-v.y)<75))kind='route';}
  else if(m.ad===NAMES[1]&&m.faz===2){const list=dots(o);if(list.some((v,j)=>!m.dotSeen[j]&&Math.hypot(p.x-v.x,p.y-v.y)<75))kind='dots';}
  else if(m.ad===NAMES[1]&&m.faz===0){i=paletteIndex(o,p,-110);if(i>=0)kind='color';else if(Math.abs(p.x-o.x)<180&&p.y>o.y-380&&p.y<o.y-165)kind='paint';}
  else {i=tokenIndex(o,p);if(i>=0)kind='token';}
  if(!kind)return;eat(e);const q=route(o)[m.routeLast<0?0:m.routeLast],kiteHit=kind==='flight'?Math.hypot(p.x-(o.x+m.kx),p.y-(o.y+m.ky))<28:kind==='route'&&Math.hypot(p.x-(q.x-12),p.y-(q.y-42))<28;
  pointer={id:e.pointerId,kind,i,x:p.x,y:p.y,moved:0,kiteHit,visited:Array(kind==='route'?6:kind==='dots'?5:3).fill(false),oldX:m.kx,oldY:m.ky};try{cv.setPointerCapture(e.pointerId);}catch(_){}
  m.idle=0;if(kind==='flight'){m.kx=clampM(p.x-o.x,-300,300);m.ky=clampM(p.y-o.y,-445,-145);flightPending(o,p,p);}
  if(kind==='route')routePending(o,p,p);if(kind==='dots')dotPending(o,p,p);if(kind==='trail')moveTrail(o,p,p,false);if(kind==='paint')paint(o,p,false);if(kind==='color'){m.color=i;sfx(.25);}
 }
 function drag(e){if(!pointer||!current||pointer.id!==e.pointerId)return;eat(e);const p=world(e);if(!good(p.x)||!good(p.y))return;
  const old={x:pointer.x,y:pointer.y};pointer.moved+=Math.hypot(p.x-old.x,p.y-old.y);pointer.x=p.x;pointer.y=p.y;current.m12.idle=0;
  if(pointer.kind==='flight'){current.m12.kx=clampM(p.x-current.x,-300,300);current.m12.ky=clampM(p.y-current.y,-445,-145);flightPending(current,old,p);}
  else if(pointer.kind==='route')routePending(current,old,p);else if(pointer.kind==='dots')dotPending(current,old,p);else if(pointer.kind==='trail')moveTrail(current,old,p,false);else if(pointer.kind==='paint')paint(current,p,false);
 }
 function stop(e){if(!pointer||!current||pointer.id!==e.pointerId)return;eat(e);const t=pointer;pointer=null;const o=current;
  if(e.type!=='pointerup'){if(t.kind==='flight'){o.m12.kx=t.oldX;o.m12.ky=t.oldY;}return;}
  const p=world(e);
  if(t.kind==='flight'){let hit=false;for(let i=0;i<t.visited.length;i++)if(t.visited[i]&&o.m12.faz===0){hit=true;markFlight(o,i,false);}if(!hit&&t.kiteHit&&t.moved<12&&o.m12.faz===0){const i=o.m12.sky.findIndex(v=>!v);if(i>=0)markFlight(o,i,false);}}
  else if(t.kind==='route'){let hit=false;for(let i=0;i<t.visited.length;i++)if(t.visited[i]&&o.m12.faz===1){hit=true;markRoute(o,i,false);}if(!hit&&t.kiteHit&&t.moved<12&&o.m12.faz===1){const i=o.m12.routeSeen.findIndex(v=>!v);if(i>=0)markRoute(o,i,false);}}
  else if(t.kind==='dots'){for(let i=0;i<t.visited.length;i++)if(t.visited[i]&&o.m12.faz===2)markDot(o,i,false);}
  else if(t.kind==='token'){const inside=good(p.x)&&good(p.y)&&Math.abs(p.x-o.x)<170&&p.y>o.y-380&&p.y<o.y-170;place(o,t.i,inside?p:null,false);}}
 addEventListener('pointerdown',startPointer,true);addEventListener('pointermove',drag,true);addEventListener('pointerup',stop,true);addEventListener('pointercancel',stop,true);
 const cancel=()=>{if(pointer&&current&&pointer.kind==='flight'){current.m12.kx=pointer.oldX;current.m12.ky=pointer.oldY;}pointer=null;};
 cv.addEventListener('lostpointercapture',e=>{if(pointer&&pointer.id===e.pointerId)cancel();});
 addEventListener('blur',cancel);addEventListener('pagehide',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 OLAY.on('durum',d=>{cancel();if(current&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')release(current,false);});
 function help(o,immediate){const m=o.m12;if(!immediate){emit('kampusMaceraIpucu',o);sfx(.2);return;}
  if(m.ad===NAMES[0]&&m.faz===0){const i=m.sky.findIndex(x=>!x);if(i>=0)markFlight(o,i,true);}
  else if(m.ad===NAMES[0]&&m.faz===1){const i=m.routeSeen.findIndex(v=>!v);if(i>=0)markRoute(o,i,true);}
  else if(m.ad===NAMES[1]&&m.faz===2){const i=m.dotSeen.findIndex(v=>!v);if(i>=0)markDot(o,i,true);}
  else if(m.ad===NAMES[1]&&m.faz===0){const i=m.used.findIndex(x=>!x);if(i>=0){m.color=i;paint(o,{x:o.x-110+i*110,y:o.y-260},true);}}
  else {const i=m.placed.findIndex(x=>!x);if(i>=0)place(o,i,null,true);}
 }
 addEventListener('keydown',e=>{if(!current||DURUM!=='oyun'||e.repeat||e.target&&/^(INPUT|BUTTON|TEXTAREA|SELECT|A)$/.test(e.target.tagName))return;
  if(!/^(Space|Enter|KeyE)$/.test(e.code))return;eat(e);help(current,true);},true);
 function bg(o){const x=o.x,y=o.y;el(g,x,y-2,240,14,'rgba(67,113,76,.12)');
  round(g,x-215,y-420,430,290,30,'rgba(106,103,100,.12)');round(g,x-220,y-430,440,290,30,'rgba(167,110,94,.63)');
  round(g,x-207,y-417,414,264,23,'rgba(255,240,213,.82)');round(g,x-193,y-403,386,236,17,'rgba(227,244,233,.74)');}
 function badge(x,y,i,on){el(g,x,y,38,38,on?'#fff6d9':'rgba(255,255,255,.7)');el(g,x,y,32,32,on?'#ffe6af':'#fff8ed');}
 function draw(o,t){const m=o.m12,x=o.x,y=o.y;if(x+520<cam.x||x-520>cam.x+VW)return;g.save();
  if(!m.active){el(g,x,y-14,65,12,'rgba(74,123,81,.2)');round(g,x-52,y-68,104,48,14,'#c68c65');round(g,x-48,y-76,96,17,8,'#f5d7af');
   if(m.ad===NAMES[0])kite(g,x,y-155,1.45,'#f194ac',t);else {round(g,x-75,y-250,150,154,12,'#c99a77');round(g,x-67,y-242,134,136,8,'#fff6e7');flower(g,x,y-184,22,'#f4a4b7');}
   g.strokeStyle='rgba(255,251,222,.8)';g.lineWidth=3;g.beginPath();g.arc(x,y-170,68+3*Math.sin(t*2),0,Math.PI*2);g.stroke();g.restore();return;}
  if(m.ad===NAMES[1])bg(o);
  if(m.ad===NAMES[0]){
   if(m.faz===0){const L=flight(o);g.strokeStyle='rgba(255,250,220,.62)';g.lineWidth=2;g.beginPath();g.moveTo(P.x+14,y-80);g.quadraticCurveTo(x+m.kx*.5,y-170,x+m.kx,y+m.ky+25);g.stroke();
    for(let i=0;i<L.length;i++){const p=L[i],pending=pointer&&pointer.kind==='flight'&&pointer.visited[i],a=(m.sky[i]||pending)?0.42:0.78;g.globalAlpha=a;el(g,p.x,p.y,30,30,'rgba(255,250,222,.75)');star(g,p.x,p.y,14,m.sky[i]?'#fff1b0':COLORS[(i+1)%5]);g.globalAlpha=1;
     if(m.help&&!m.sky[i]&&i===m.sky.findIndex(v=>!v)){g.strokeStyle='#fff6c4';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,37+Math.sin(t*2)*3,0,Math.PI*2);g.stroke();}}
    kite(g,x+m.kx,y+m.ky,1.05,COLORS[m.choice],t);}
   if(m.faz===1){const L=route(o);g.strokeStyle='rgba(255,248,220,.75)';g.lineWidth=5;g.setLineDash([8,10]);g.beginPath();g.moveTo(L[0].x,L[0].y);for(let i=1;i<L.length;i++)g.lineTo(L[i].x,L[i].y);g.stroke();g.setLineDash([]);
    for(let i=0;i<L.length;i++){const p=L[i],pending=pointer&&pointer.kind==='route'&&pointer.visited[i],done=m.routeSeen[i]||pending;el(g,p.x,p.y,done?18:23,done?18:23,done?'#f3cd75':'#fff6e0');star(g,p.x,p.y,done?9:13,done?'#fff7da':COLORS[i%5]);
     if(m.help&&!m.routeSeen[i]&&i===m.routeSeen.findIndex(v=>!v)){g.strokeStyle='#fff6c4';g.lineWidth=3;g.beginPath();g.arc(p.x,p.y,33+Math.sin(t*2)*3,0,Math.PI*2);g.stroke();}}
    const p=pointer&&pointer.kind==='route'?pointer:L[m.routeLast<0?0:m.routeLast];kite(g,p.x-12,p.y-42,.75,COLORS[m.choice<0?0:m.choice],t);}
   if(m.faz>=2){round(g,x-158,y-380,316,198,14,'#ca9675');round(g,x-147,y-369,294,176,10,'#f9efcf');round(g,x-138,y-360,276,158,8,'#b7dfdf');
    for(const mark of m.marks)icon(g,mark.type,x+mark.x,y+mark.y,.8,t);if(m.faz===2){for(let i=0;i<4;i++){const xx=x+(i-1.5)*105;badge(xx,y-102,i,m.placed[i]);icon(g,['kite','boat','flower','heart'][i],xx,y-102,.7,t+i);}}}
  }else{
   // Fırçayla boyanan tuval: gerçek parmak hareketi tutulur, çizgi serbesttir.
   round(g,x-168,y-378,336,205,10,'#fff7e7');g.save();g.beginPath();g.rect(x-165,y-375,330,199);g.clip();
   el(g,x,y-300,165,65,'#d1e9e3');el(g,x,y-215,195,65,'#d9edbf');
   for(const p of m.paint)el(g,x+p.x,y+p.y,13,10,['rgba(246,154,177,.65)','rgba(137,206,224,.68)','rgba(247,207,122,.68)'][p.col]);
   for(const mark of m.marks)icon(g,mark.type,x+mark.x,y+mark.y,.65,t);g.restore();
   if(m.faz===0)for(let i=0;i<3;i++){const xx=x+(i-1)*110;badge(xx,y-110,i,m.color===i);el(g,xx,y-110,20,20,COLORS[i]);if(m.used[i])star(g,xx+23,y-131,6,'#f4bb59');}
   if(m.faz===1)for(let i=0;i<3;i++){const xx=x+(i-1)*105;badge(xx,y-102,i,m.placed[i]);icon(g,['flower','library','sun'][i],xx,y-102,.7,t+i);}
   if(m.faz>=2){const L=dots(o);g.strokeStyle='rgba(255,245,204,.9)';g.lineWidth=4;g.beginPath();for(let j=0;j<m.dotOrder.length;j++){const p=L[m.dotOrder[j]];if(j)g.lineTo(p.x,p.y);else g.moveTo(p.x,p.y);}g.stroke();
    for(let i=0;i<L.length;i++){const pending=pointer&&pointer.kind==='dots'&&pointer.visited[i],done=m.dotSeen[i]||pending;star(g,L[i].x,L[i].y,done?9:14,done?'#f6c95e':'#fff3d2');
     if(m.help&&m.faz===2&&!m.dotSeen[i]&&i===m.dotSeen.findIndex(v=>!v)){g.strokeStyle='#fff6c4';g.lineWidth=3;g.beginPath();g.arc(L[i].x,L[i].y,27+Math.sin(t*2)*3,0,Math.PI*2);g.stroke();}}}
  }
  if(m.faz===3){for(let i=0;i<9;i++)star(g,x+Math.cos(i*6.28/9+t)*210,y-280+Math.sin(i*6.28/9+t)*115,5+i%3,'#fff1ad');}
  if(m.glow>0){g.globalAlpha=m.glow;star(g,x+170,y-390,12,'#fff5be');g.globalAlpha=1;}g.restore();
 }
 // Hedef, etkileşim ve sahne değişimlerinde Pırıl mevcut konumundan uçar.
 function pirilAdim(o,dt){const m=o.m12;let x=P.x+70,y=P.y-130;
  if(m.faz===3&&m.kutla>=3){x=o.x-260-34;y=P.y-96;}
  else if(m.help&&m.idle>=8&&(m.ad===NAMES[0]&&m.faz<2||m.ad===NAMES[1]&&m.faz===2)){
   const seen=m.ad===NAMES[1]?m.dotSeen:m.faz===0?m.sky:m.routeSeen,L=m.ad===NAMES[1]?dots(o):m.faz===0?flight(o):route(o),i=seen.findIndex(v=>!v);if(i>=0){x=L[i].x-65;y=L[i].y-55;}}
  const dx=x-m.prX,dy=y-m.prY,d=Math.hypot(dx,dy),u=d>0?Math.min(1,160*dt/d):0;m.prX+=dx*u;m.prY+=dy*u;}
 function drawOn(o,t){const m=o.m12;if(!m.active||P.ucus!==o)return;const u=m.faz===3?clampM((m.kutla-3)/2.5,0,1):0,a=u*u*(3-2*u);
  if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,m.faz===3?'sevinc':'ayakta_yan',t);
  const anneX=P.x+110+(o.x-260+64-(P.x+110))*a;
  if(typeof anne12Ciz==='function')anne12Ciz(g,anneX,o.y,.9+.1*a,t,{poz:m.faz===3?(a<.99?'dans':'dur'):'el',yon:1,hareket:.35*(1-a)});
  if(typeof pirilCizPoz==='function'){g.save();pirilCizPoz(g,m.prX,m.prY+Math.sin(t*2)*5*(1-a),.65,'ucus',t);g.restore();}}
 for(let j=0;j<2;j++){const ad=NAMES[j],tip=['kampusSakuraAtolye','kampusSanatAtolye'][j];TUR.kaydet(tip,{
   kur(o){o.done=false;o.tk={bitti:false};o.m12={ad,active:false,faz:-1,idle:0,help:0,kutla:0,glow:0,choice:2,kx:0,ky:-250,sky:[false,false,false],routeSeen:[false,false,false,false,false,false],routeLast:-1,dotSeen:[false,false,false,false,false],dotOrder:[],n:0,used:[false,false,false],color:0,paint:[],placed:Array(ad===NAMES[0]?4:3).fill(false),marks:[]};
    o.adim=()=>{if(P.ucus===o){const m=o.m12,u=m.faz===3?clampM((m.kutla-3)/2.5,0,1):0,a=u*u*(3-2*u);P.x=o.x-280+20*a;P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};},
   guncelle(o,dt){const m=o.m12;if(DURUM!=='oyun'||!(dt>0)||!good(dt))return;dt=Math.min(dt,.05);m.glow=Math.max(0,m.glow-dt*.7);
    if(!m.active){if(!o.done&&!current&&!P.ucus&&P.ground&&P.x>o.x-340&&P.x<o.x-160&&Math.abs(P.y-o.y)<100)start(o);return;}
    pirilAdim(o,dt);focus(o);if(m.faz===3){m.kutla+=dt;if(m.kutla>=6)release(o,true);return;}if(pointer)return;
    // Son renk seçilse de devam eden fırça darbesi kesilmez; çocuk çizmeyi
    // sürdürdükçe sayaç sıfırlanır, bırakınca sahne kendiliğinden ilerler.
    if(m.ad===NAMES[1]&&m.faz===0&&m.used.every(Boolean)){m.idle+=dt;if(m.idle>=8){m.n=0;next(o);}return;}
    m.idle+=dt;const assist=m.yardimN?12:24;
    if(m.idle>8&&m.help===0){m.help=1;help(o,false);}if(m.idle>assist){m.idle=0;m.yardimN++;help(o,true);}
   },ciz:draw,cizOn:drawOn,
   testBitir(o){if(!o.m12.active)start(o);if(current===o)release(o,true);}
  });}
})();
