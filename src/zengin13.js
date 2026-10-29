/* İpek Göğü'nde dört isteğe bağlı dokunma oyunu. Ana yol, eski etkinlikler ve final korunur.
   Yuvasına ışık dostlarını taşıma, buluttan çiçek sulama, mantar çalgıları ve yuvarlanan bulut topu.
   Yalnız B13; bu dosya ipek13.js'ten ÖNCE yüklenir (dar oyuncak hedefleri eski geniş çizim alanından öncelikli). */
'use strict';
(function(){
 if(typeof BOLUM_NO==='undefined'||BOLUM_NO!==13)return;
 const tau=Math.PI*2,colors=['#b8ece3','#f0d5a7','#d8c5f1'],toys=[],held={id:null,o:null,kind:'',i:0,x:0,y:0,px:0,py:0,distance:0,eventT:0};
 const atlas={ready:false,friend:[],nest:null,cloud:null,ball:null};
 const mushroomSpots=[[[-24,-12,5],[-8,-25,6],[12,-27,4],[26,-10,5]],[[-22,-9,3],[-2,-29,4],[20,-10,3]],[[-25,-10,5],[-10,-17,3],[9,-24,6],[26,-11,4]]];
 const scratch={x:0,y:0};let clock=0,lastFrame=-1;
 const limit=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=v=>{v=limit(v,0,1);return v*v*(3-2*v);};
 function emit(name,o,extra){OLAY.emit(name,Object.assign({x:o.x,y:o.y,kind:o.kind},extra||{}));}
 function near(o,r=650){return Math.abs(P.x-o.x)<r&&Math.abs(P.y-o.y)<420;}
 function visible(x,r=250){return x+r>cam.x-30&&x-r<cam.x+VW+30;}
 function oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,tau);c.fill();}
 function line(c,points,col,width){c.strokeStyle=col;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(points[0],points[1]);for(let i=2;i<points.length;i+=2)c.lineTo(points[i],points[i+1]);c.stroke();}
 function leaf(c,x,y,w,h,a,col){c.save();c.translate(x,y);c.rotate(a);c.fillStyle=col;c.beginPath();c.moveTo(-w*.5,0);c.bezierCurveTo(-w*.2,-h,w*.35,-h,w*.5,0);c.bezierCurveTo(w*.2,h,-w*.3,h,-w*.5,0);c.fill();c.strokeStyle='rgba(224,250,226,.45)';c.lineWidth=1;c.beginPath();c.moveTo(-w*.4,0);c.quadraticCurveTo(0,-h*.2,w*.4,0);c.stroke();c.restore();}
 function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=-Math.PI/2+i*Math.PI/4,rr=i%2?r*.42:r,xx=x+Math.cos(a)*rr,yy=y+Math.sin(a)*rr;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.fill();}
 function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 function prepare(){if(atlas.ready)return;atlas.ready=true;
  for(let i=0;i<3;i++){const a=canvas(112,104),c=a.getContext('2d');c.translate(56,52);const grad=c.createRadialGradient(-10,-10,3,0,0,42);grad.addColorStop(0,'#f7fff0');grad.addColorStop(.55,colors[i]);grad.addColorStop(1,['#5a999d','#bd9a63','#8e79ad'][i]);
   c.fillStyle=grad;c.beginPath();c.moveTo(-36,4);c.bezierCurveTo(-51,-12,-28,-25,-21,-17);c.bezierCurveTo(-23,-44,13,-48,22,-22);c.bezierCurveTo(48,-27,54,11,30,22);c.bezierCurveTo(18,44,-18,40,-29,22);c.bezierCurveTo(-40,27,-48,14,-36,4);c.fill();
   oval(c,-11,-1,3.1,4.6,'#29454c');oval(c,10,-1,3.1,4.6,'#29454c');oval(c,-12,-2,1,1.5,'#fff');oval(c,9,-2,1,1.5,'#fff');line(c,[-6,10,0,13,6,10],'#50716e',1.8);oval(c,-21,9,6,3,'#e4a9ac');oval(c,20,9,6,3,'#e4a9ac');atlas.friend.push(a);
  }
  let a=canvas(260,170),c=a.getContext('2d');for(let i=0;i<13;i++){const x=24+i*17;leaf(c,x,119+Math.sin(i)*5,64,14,-.5+i*.08,i%2?'#70a88d':'#4d8e7c');}c.strokeStyle='#bda577';c.lineWidth=4;for(let i=0;i<5;i++){c.beginPath();c.ellipse(132,122+i*4,75-i*5,17-i,0,0,Math.PI);c.stroke();}c.save();const weave=c.createLinearGradient(0,108,0,159);weave.addColorStop(0,'#cfb384');weave.addColorStop(.45,'#ac8d68');weave.addColorStop(1,'#6d7461');c.fillStyle=weave;c.beginPath();c.moveTo(56,115);c.quadraticCurveTo(65,154,132,155);c.quadraticCurveTo(197,154,208,115);c.quadraticCurveTo(132,139,56,115);c.fill();c.save();c.clip();for(let j=-4;j<15;j++){line(c,[52+j*16,111,93+j*16,163],'#e0c794',1.6);line(c,[52+j*16,163,93+j*16,111],'#8f795d',1.2);}c.restore();oval(c,132,114,73,16,'#456e68');oval(c,132,115,66,11,'#5e8d79');for(let j=0;j<3;j++){oval(c,94+j*38,115,17,8,'#376461');line(c,[80+j*38,119,92+j*38,123,108+j*38,118],'#b1bd8a',1.6);}c.strokeStyle='#ddc698';c.lineWidth=3;c.beginPath();c.ellipse(132,114,76,17,0,0,tau);c.stroke();c.strokeStyle='#8fa486';c.lineWidth=1.3;c.beginPath();c.ellipse(132,114,80,20,0,0,tau);c.stroke();for(let j=0;j<7;j++){leaf(c,58+j*24,132+Math.sin(j*2)*4,25,5,j*.24-.8,j%2?'#81b497':'#5e9982');}c.restore();atlas.nest=a;
  a=canvas(260,160);c=a.getContext('2d');const cg=c.createLinearGradient(0,20,0,150);cg.addColorStop(0,'#f2f8e9');cg.addColorStop(.45,'#b9dce2');cg.addColorStop(1,'#749ab7');c.fillStyle=cg;c.beginPath();c.moveTo(20,115);c.bezierCurveTo(-8,80,20,55,51,63);c.bezierCurveTo(39,19,96,8,117,42);c.bezierCurveTo(139,8,190,25,187,63);c.bezierCurveTo(229,40,272,91,235,119);c.bezierCurveTo(194,150,58,146,20,115);c.fill();oval(c,109,91,3,4,'#486377');oval(c,143,91,3,4,'#486377');line(c,[119,103,126,107,133,103],'#5c7f8e',2);atlas.cloud=a;
  a=canvas(128,128);c=a.getContext('2d');const bg=c.createRadialGradient(43,35,5,64,64,60);bg.addColorStop(0,'#f3fcdf');bg.addColorStop(.55,'#bee4df');bg.addColorStop(1,'#7ca3c0');c.fillStyle=bg;c.beginPath();for(let i=0;i<24;i++){const p=i/24*tau,r=49+Math.sin(i*1.3)*5,xx=64+Math.cos(p)*r,yy=64+Math.sin(p)*r;i?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.closePath();c.fill();c.globalAlpha=.5;oval(c,47,37,26,17,'#fff');c.globalAlpha=1;star(c,79,74,20,'#f4e3a5');atlas.ball=a;
 }
 function init(o){o.kind=o.zkind;o.t=0;o.nearT=0;o.idle=0;o.done=false;o.flare=0;o.plays=0;
  if(o.kind==='nest'){o.friend=Array.from({length:3},(_,i)=>({x:o.x-150+i*44,y:o.y-230-i%2*42,sx:0,sy:0,join:0,home:false,held:false}));o.nx=o.x+180;o.ny=o.y-95;o.selected=-1;o.arch=0;}
  if(o.kind==='rain'){o.cx=o.x-125;o.cy=o.y-270;o.targetX=o.cx;o.pour=0;o.selected=-1;o.flowers=Array.from({length:3},(_,i)=>({x:o.x-105+i*105,y:o.y-14,u:0,pop:0,opened:false}));o.rainbow=0;}
  if(o.kind==='music'){o.caps=Array.from({length:3},(_,i)=>({x:o.x-95+i*95,y:o.y-33,pop:0,hit:false}));o.notes=Array.from({length:12},()=>({on:false,x:0,y:0,t:0,i:0}));o.next=0;o.chorus=0;}
  if(o.kind==='ball'){o.ball={x:o.x-150,y:o.y-38,prevX:o.x-150,prevY:o.y-38,vx:0,vy:0,held:false,turn:0};o.pads=Array.from({length:3},(_,i)=>({x:o.x+30+i*135,pop:0,u:0,hit:false,touch:false}));o.min=o.x-230;o.max=o.x+440;o.cool=0;}
  toys.push(o);
 }
 function friendHome(o,i){const f=o.friend[i];if(f.home||f.join>0)return;f.sx=f.x;f.sy=f.y;f.join=.0001;f.held=false;o.selected=-1;o.flare=1;emit('ipekYuvaYol',o,{i});}
 function note(o,i){const q=o.caps[i];q.pop=1;q.hit=true;o.plays++;o.idle=0;let n=o.notes.find(a=>!a.on)||o.notes[o.next++%o.notes.length];n.on=true;n.x=q.x;n.y=q.y-55;n.t=0;n.i=i;emit('ipekZenginNote',o,{note:i,plays:o.plays});if(o.caps.every(a=>a.hit)&&!o.done){o.done=true;o.chorus=1;emit('ipekOrkestra',o);}}
 function rainAt(o,i){o.targetX=o.flowers[i].x;o.selected=i;o.pour=1;o.idle=0;}
 function ballKick(o,x){const b=o.ball;b.vx=(x<b.x?1:-1)*240;b.vy=-160;o.flare=1;o.idle=0;emit('ipekBulutTop',o,{x:b.x});}
 function step(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;dt=Math.min(dt,.05);o.t+=dt;o.flare=Math.max(0,o.flare-dt*.7);o.idle+=dt;if(near(o))o.nearT+=dt;else o.nearT=0;
  if(o.kind==='nest'){
   let count=0;for(let i=0;i<o.friend.length;i++){const f=o.friend[i];if(f.home){count++;continue;}if(f.join>0){f.join=Math.min(1,f.join+dt/.95);const u=ease(f.join);f.x=lerp(f.sx,o.nx+(i-1)*38,u);f.y=lerp(f.sy,o.ny-20,u)-Math.sin(u*Math.PI)*45;if(f.join>=1){f.home=true;emit('ipekYuvaDost',o,{i});}}}
   if(count===3&&!o.done){o.done=true;o.flare=1;emit('ipekYuvaTamam',o);}o.arch=lerp(o.arch,o.done?1:0,1-Math.exp(-dt*1.5));
   // Waiting only invites play; a real tap or drag sends a friend home.
  }else if(o.kind==='rain'){
   o.cx=lerp(o.cx,o.targetX,1-Math.exp(-dt*5));o.pour=Math.max(0,o.pour-dt*.24);
   for(let i=0;i<3;i++){const f=o.flowers[i];f.pop=Math.max(0,f.pop-dt*.8);if(o.pour>.02&&Math.abs(o.cx-f.x)<62){f.u=Math.min(1,f.u+dt*.57);if(f.u>=1&&!f.opened){f.opened=true;f.pop=1;emit('ipekYagmurBloom',o,{i});}}}
   if(o.flowers.every(f=>f.opened)&&!o.done){o.done=true;o.flare=1;emit('ipekYagmurTamam',o);}o.rainbow=lerp(o.rainbow,o.done?1:0,1-Math.exp(-dt*1.2));
   // Rain starts only with the child's cloud/flower input.
  }else if(o.kind==='music'){
   o.chorus=Math.max(0,o.chorus-dt*.15);for(const c of o.caps)c.pop=Math.max(0,c.pop-dt*1.45);for(const n of o.notes)if(n.on){n.t+=dt;n.y-=dt*40;if(n.t>2.1)n.on=false;}
   // The silent visual cue never plays a note or awards completion.
  }else if(o.kind==='ball'){
   o.cool=Math.max(0,o.cool-dt);const b=o.ball;if(!b.held){const old=b.x;if(!P.ucus&&Math.abs(P.x-b.x)<61&&Math.abs(P.y-o.y)<82&&Math.abs(P.vx)>25)b.vx=lerp(b.vx,P.vx*.91,1-Math.exp(-dt*10));b.vy+=750*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.vx*=Math.exp(-dt*.8);if(b.y>o.y-36){b.y=o.y-36;if(b.vy>35)b.vy=-b.vy*.43;else b.vy=0;}if(b.x<o.min||b.x>o.max){b.x=limit(b.x,o.min,o.max);b.vx*=-.6;}b.turn+=(b.x-old)/36;}
   for(let i=0;i<3;i++){
    const p=o.pads[i],inside=Math.abs(b.x-p.x)<49&&b.y>o.y-100;
    const dx=b.x-b.prevX,along=Math.abs(dx)>.001?limit((p.x-b.prevX)/dx,0,1):0;
    const swept=Math.abs(lerp(b.prevX,b.x,along)-p.x)<49&&lerp(b.prevY,b.y,along)>o.y-100;
    p.pop=Math.max(0,p.pop-dt*.9);p.u=lerp(p.u,p.hit?1:0,1-Math.exp(-dt*2));
    if(!inside)p.touch=false;
    if((inside||swept)&&!p.touch&&(!p.hit||o.cool<=0)){p.touch=true;p.pop=1;p.hit=true;o.cool=.38;o.flare=1;emit('ipekBulutPad',o,{i,x:p.x});}
   }
   b.prevX=b.x;b.prevY=b.y;
   if(o.pads.every(p=>p.hit)&&!o.done){o.done=true;emit('ipekBulutBahce',o);}
  }
 }
 function flower(c,x,y,u,kind,tm,pop=0){const h=12+u*102;line(c,[x,y,x+Math.sin(tm+kind)*3,y-h],'#63a08a',4);leaf(c,x-8,y-h*.4,33,9,-.5,'#73b799');leaf(c,x+9,y-h*.65,28,8,.55,'#8bc7a4');c.save();c.translate(x,y-h);c.scale(.68+.32*u,.68+.32*u);for(let j=0;j<6;j++){const a=j/6*tau+Math.sin(tm*.7)*.04;oval(c,Math.cos(a)*18,Math.sin(a)*18,14+pop*2,10,colors[kind]);}oval(c,0,0,11,11,'#efdb9e');c.restore();}
 function invitation(o,tm){
  if(o.done||!near(o)||held.o===o)return;
  const reveal=ease(o.nearT/.8),wait=ease((o.idle-2)/3),pulse=.5+.5*Math.sin(tm*2),cycle=(tm*.22)%1;let x=o.x,y=o.y-65,tx=x,ty=y;
  if(o.kind==='nest'){const i=o.friend.findIndex(f=>!f.home&&!f.join);if(i<0)return;const f=o.friend[i];x=f.x;y=f.y;tx=o.nx;ty=o.ny-20;}
  else if(o.kind==='rain'){const i=o.flowers.findIndex(f=>!f.opened);if(i<0)return;x=o.cx;y=o.cy+33;tx=o.flowers[i].x;ty=o.flowers[i].y-12-o.flowers[i].u*102;}
  else if(o.kind==='music'){const i=o.caps.findIndex(q=>!q.hit);if(i<0)return;x=tx=o.caps[i].x;y=ty=o.caps[i].y-30;}
  else{x=tx=o.ball.x;y=ty=o.ball.y;}
  g.save();g.globalAlpha=reveal*(.16+.08*pulse);g.strokeStyle='#fff1bd';g.lineWidth=2;g.beginPath();g.ellipse(x,y,o.kind==='music'?37:43,o.kind==='music'?29:34,0,0,tau);g.stroke();
  if(wait>.01){g.globalAlpha=reveal*wait*.52;const u=ease(cycle),cx=lerp(x,tx,u),cy=lerp(y,ty,u)-Math.sin(u*Math.PI)*(o.kind==='nest'?42:12);star(g,cx,cy,4.2,'#fff0bc');if(o.kind==='rain'){g.globalAlpha*=.6;star(g,tx,ty-13,5.2+2*pulse,'#f3e6bd');}}
  g.restore();
 }
 function mushroom(c,x,y,k,pop,tm,hit){
  const bounce=Math.sin(pop*Math.PI)*9;c.save();c.translate(x,y+bounce);c.scale(1+pop*.08,1-pop*.19);
  oval(c,0,29,28,6,'rgba(31,70,76,.22)');
  line(c,[-5,30,-3,10,0,-1],'#447d76',15);line(c,[-5,28,-5,13,-2,1],'#b4d8b5',4);
  leaf(c,-10,24,26,7,-.5,'#6caa8d');leaf(c,10,26,24,6,.5,'#8bc4a2');
  oval(c,0,1,43,11,'#537b80');oval(c,0,0,41,8,'#c6d7be');
  for(let j=-3;j<=3;j++)line(c,[j*11,0,j*5,6],'rgba(80,120,117,.48)',.8);
  c.fillStyle=colors[k];c.beginPath();c.moveTo(-43,0);
  if(k===0){c.bezierCurveTo(-42,-32,-20,-48,0,-43);c.bezierCurveTo(23,-48,43,-29,43,0);}
  else if(k===1){c.bezierCurveTo(-39,-17,-22,-18,-9,-39);c.quadraticCurveTo(0,-53,10,-38);c.bezierCurveTo(24,-17,40,-18,43,0);}
  else{c.bezierCurveTo(-45,-25,-25,-35,-8,-31);c.quadraticCurveTo(4,-44,20,-30);c.bezierCurveTo(38,-31,46,-16,43,0);}
  c.quadraticCurveTo(0,12,-43,0);c.fill();
  c.fillStyle='rgba(255,253,221,.23)';c.beginPath();c.moveTo(-37,-4);c.quadraticCurveTo(-22,-33,-1,-38);c.quadraticCurveTo(-8,-11,-18,0);c.closePath();c.fill();
  line(c,[-36,2,-16,6,10,7,35,3],'#e0e8c9',1.4);
  const spots=mushroomSpots[k];
  for(const q of spots){oval(c,q[0],q[1],q[2],q[2]*.62,'#eff4d7');oval(c,q[0]-1,q[1]-.7,q[2]*.3,q[2]*.19,'#fbfce7');}
  if(pop>.02){c.globalAlpha=pop*.4;c.strokeStyle='#e4f4d0';c.lineWidth=1.3;c.beginPath();c.ellipse(0,-18,44+(1-pop)*23,28+(1-pop)*12,0,0,tau);c.stroke();}
  c.restore();if(hit){c.save();c.globalAlpha=.68;star(c,x,y-58-Math.sin(tm*1.5+k)*3,5,colors[k]);c.restore();}
 }
 function paint(o,tm){prepare();g.save();
  if(o.kind==='nest'){
   g.drawImage(atlas.nest,o.nx-130,o.ny-122,260,170);for(let i=0;i<3;i++){const f=o.friend[i],x=f.x,y=f.y+(f.held||f.join?0:Math.sin(tm*1.5+i*2)*8);g.save();g.translate(x,y);g.rotate(f.home?Math.sin(tm+i)*.025:Math.sin(tm*1.4+i)*.08);g.drawImage(atlas.friend[i],-33,-31,66,62);g.restore();}
   if(!o.done&&near(o)){g.strokeStyle='rgba(213,243,206,.35)';g.lineWidth=1.5;g.beginPath();g.ellipse(o.nx,o.ny-22,48+Math.sin(tm*1.8)*3,25,0,0,tau);g.stroke();}
   if(o.arch>.01){for(let i=0;i<9;i++){const a=Math.PI-i/8*Math.PI,x=o.nx+Math.cos(a)*125,y=o.ny+8-Math.sin(a)*160*o.arch;leaf(g,x,y,40*o.arch,12,a-.5,'#85c3a0');star(g,x,y,3+o.flare*2,colors[i%3]);}}
  }else if(o.kind==='rain'){
   const nextFlower=o.flowers.find(f=>!f.opened);for(let i=0;i<3;i++){const f=o.flowers[i];oval(g,f.x,f.y+11,30,6,'rgba(25,67,72,.23)');g.fillStyle='#8eaca0';g.beginPath();g.moveTo(f.x-25,f.y+3);g.quadraticCurveTo(f.x-20,f.y+17,f.x,f.y+17);g.quadraticCurveTo(f.x+20,f.y+17,f.x+25,f.y+3);g.closePath();g.fill();oval(g,f.x,f.y+3,25,7,'#c4d7b9');oval(g,f.x,f.y+3,19,4,'#527e70');line(g,[f.x-17,f.y+9,f.x-5,f.y+12,f.x+16,f.y+8],'#dae6c7',1.1);flower(g,f.x,f.y,f.u,i,tm,f.pop);if(f===nextFlower&&near(o)){const top=f.y-12-f.u*102;g.save();g.globalAlpha=.18+.08*Math.sin(tm*1.7);g.strokeStyle='#fff1b6';g.lineWidth=1.5;g.beginPath();g.ellipse(f.x,top,29,24,0,0,tau);g.stroke();g.restore();}}
   g.drawImage(atlas.cloud,o.cx-105,o.cy-64+Math.sin(tm*.9)*4,210,128);
   if(o.pour>.01){for(let j=0;j<18;j++){const phase=(tm*(.7+j%3*.13)+j*.127)%1,x=o.cx+(j%6-2.5)*16+Math.sin(j)*7,y=o.cy+36+phase*197;g.globalAlpha=Math.sin(phase*Math.PI)*.68*o.pour;g.fillStyle='#b7e8ed';g.beginPath();g.ellipse(x,y,1.7,6,0,0,tau);g.fill();}g.globalAlpha=1;}
   if(o.rainbow>.01){g.globalAlpha=o.rainbow*.28;g.lineWidth=4;for(let i=0;i<3;i++){g.strokeStyle=colors[i];g.beginPath();g.ellipse(o.x,o.y-115,155+i*5,125+i*4,0,Math.PI,Math.PI*2);g.stroke();}g.globalAlpha=1;}
  }else if(o.kind==='music'){
   for(let i=0;i<3;i++){const c=o.caps[i];mushroom(g,c.x,c.y,i,c.pop,tm,c.hit);}
   for(const n of o.notes){if(!n.on)continue;g.globalAlpha=1-n.t/2.1;const x=n.x+Math.sin(n.t*3+n.i)*15;oval(g,x,n.y,6,4,colors[n.i]);line(g,[x+5,n.y,x+5,n.y-25,x+17,n.y-20],colors[n.i],2.5);}g.globalAlpha=1;
   if(o.done){const b=Math.sin(tm*1.5)*3;g.drawImage(atlas.friend[1],o.x-27,o.y-139+b,54,51);if(o.chorus>.01){g.strokeStyle='rgba(197,241,220,.25)';g.lineWidth=2;g.beginPath();g.ellipse(o.x,o.y-83,160+Math.sin(tm*2)*8,55,0,0,tau);g.stroke();}}
  }else if(o.kind==='ball'){
   for(let i=0;i<3;i++){const p=o.pads[i];oval(g,p.x,o.y-1,37,8,p.hit?'#91c5a5':'#4e7779');if(!p.hit){g.globalAlpha=.7;star(g,p.x,o.y-45+Math.sin(tm+i)*4,6,colors[i]);g.globalAlpha=1;}else flower(g,p.x,o.y-4,p.u,i,tm,p.pop);}
   const b=o.ball;g.save();g.translate(b.x,b.y);g.rotate(b.turn);const squash=b.held?1:1+Math.min(.08,Math.abs(b.vy)*.0002);g.scale(1/squash,squash);g.drawImage(atlas.ball,-43,-43,86,86);g.restore();
   if(near(o)&&!o.done){g.globalAlpha=.25;g.strokeStyle='#d0ebdf';g.lineWidth=2;g.beginPath();g.ellipse(b.x,b.y,47+Math.sin(tm*1.5)*3,47,0,0,tau);g.stroke();g.globalAlpha=1;}
  }
  invitation(o,tm);g.restore();
 }
 function point(e){const r=cv.getBoundingClientRect();scratch.x=cam.x+(e.clientX-r.left)*DPR/S;scratch.y=cam.y+(e.clientY-r.top)*DPR/S;return scratch;}
 function hit(o,x,y){if(!near(o))return null;
  if(o.kind==='nest'){for(let i=0;i<3;i++){const f=o.friend[i];if(!f.home&&!f.join&&Math.hypot(x-f.x,y-f.y)<53)return{kind:'friend',i};}if(Math.hypot(x-o.nx,y-o.ny+20)<74)return{kind:'nest',i:0};}
  if(o.kind==='rain'){if(Math.abs(x-o.cx)<120&&Math.abs(y-o.cy)<72)return{kind:'cloud',i:0};for(let i=0;i<3;i++)if(Math.abs(x-o.flowers[i].x)<48&&y>o.y-155&&y<o.y+15)return{kind:'flower',i};}
  if(o.kind==='music'){for(let i=0;i<3;i++)if(Math.abs(x-o.caps[i].x)<48&&y>o.caps[i].y-60&&y<o.caps[i].y+37)return{kind:'note',i};}
  if(o.kind==='ball'&&Math.hypot(x-o.ball.x,y-o.ball.y)<59)return{kind:'ball',i:0};return null;
 }
 function take(e){if(held.id!==null&&held.id!==e.pointerId)return;if(DURUM!=='oyun'||P.ucus||e.target!==cv||e.pointerType==='mouse'&&e.button!==0)return;if(typeof dugmede==='function'&&dugmede(e.clientX,e.clientY))return;const p=point(e);
  for(const o of toys){const h=hit(o,p.x,p.y);if(!h)continue;o.idle=0;held.id=e.pointerId;held.o=o;held.kind=h.kind;held.i=h.i;held.x=held.px=p.x;held.y=held.py=p.y;held.distance=0;held.eventT=Number.isFinite(e.timeStamp)?e.timeStamp:clock*1000;
   if(h.kind==='friend'){o.selected=h.i;o.friend[h.i].held=true;}
   else if(h.kind==='nest'){if(o.selected>=0)friendHome(o,o.selected);else {const i=o.friend.findIndex(f=>!f.home&&!f.join);if(i>=0)friendHome(o,i);}}
   else if(h.kind==='cloud'){o.pour=1;}
   else if(h.kind==='flower')rainAt(o,h.i);
   else if(h.kind==='note')note(o,h.i);
   else if(h.kind==='ball'){o.ball.held=true;o.ball.vx=o.ball.vy=0;}
   try{cv.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();e.stopImmediatePropagation();return;
  }
 }
 function move(e){if(held.id!==e.pointerId||!held.o||DURUM!=='oyun')return;const p=point(e),o=held.o,dx=p.x-held.x,dy=p.y-held.y;held.px=held.x;held.py=held.y;held.x=p.x;held.y=p.y;held.distance+=Math.hypot(dx,dy);const stamp=Number.isFinite(e.timeStamp)?e.timeStamp:clock*1000,seconds=limit((stamp-held.eventT)/1000,1/240,.1);held.eventT=stamp;o.idle=0;
  if(held.kind==='friend'){const f=o.friend[held.i];f.x=limit(p.x,o.x-310,o.x+340);f.y=limit(p.y,300,o.y-35);if(Math.hypot(f.x-o.nx,f.y-(o.ny-20))<76)friendHome(o,held.i);}
  if(held.kind==='cloud'){o.targetX=limit(p.x,o.x-160,o.x+160);o.pour=1;}
  if(held.kind==='ball'){const b=o.ball;b.x=limit(p.x,o.min,o.max);b.y=limit(p.y,390,o.y-36);b.vx=limit(dx/seconds,-430,430);b.vy=limit(dy/seconds,-370,270);}
  if(held.kind==='note'){for(let i=0;i<3;i++)if(i!==held.i&&Math.abs(p.x-o.caps[i].x)<42&&Math.abs(p.y-o.caps[i].y)<63){note(o,i);held.i=i;break;}}
  e.preventDefault();e.stopImmediatePropagation();
 }
 function release(e){if(held.id!==e.pointerId)return;const o=held.o;if(o){if(held.kind==='friend'){const f=o.friend[held.i];f.held=false;if(Math.hypot(f.x-o.nx,f.y-(o.ny-20))<90)friendHome(o,held.i);}if(held.kind==='ball'){o.ball.held=false;if(held.distance<12)ballKick(o,P.x);}}
  held.id=null;held.o=null;held.kind='';
 }
 function cancel(){if(held.o&&held.kind==='friend')held.o.friend[held.i].held=false;if(held.o&&held.kind==='ball')held.o.ball.held=false;held.id=null;held.o=null;held.kind='';}
 addEventListener('pointerdown',take,true);addEventListener('pointermove',move,true);addEventListener('pointerup',release,true);addEventListener('pointercancel',e=>{if(held.id===e.pointerId)cancel();},true);addEventListener('lostpointercapture',e=>{if(held.id===e.pointerId)cancel();},true);addEventListener('blur',cancel);addEventListener('pagehide',cancel);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});OLAY.on('durum',d=>{if(d!=='oyun')cancel();});OLAY.on('boyut',cancel);
 addEventListener('keydown',e=>{if(e.code!=='KeyE'||e.repeat||DURUM!=='oyun'||P.ucus)return;let o=null,d=330;for(const q of toys){const a=Math.abs(q.x-P.x);if(a<d){d=a;o=q;}}if(!o)return;if(o.kind==='nest'){const i=o.friend.findIndex(f=>!f.home&&!f.join);if(i>=0)friendHome(o,i);}else if(o.kind==='rain')rainAt(o,o.flowers.findIndex(f=>!f.opened)<0?0:o.flowers.findIndex(f=>!f.opened));else if(o.kind==='music')note(o,o.plays%3);else ballKick(o,o.ball.x-70);e.preventDefault();},true);
 TUR.kaydet('k13Oyuncak',{kur:init,guncelle(o,dt){if(lastFrame!==now){lastFrame=now;if(Number.isFinite(dt)&&dt>0&&DURUM==='oyun')clock+=Math.min(dt,.05);}step(o,dt);},ciz(o,tm){if(visible(o.x,650))paint(o,tm);}});
 for(const spec of [['nest',66],['rain',157],['music',268],['ball',351]])NESNELER.push({tip:'k13Oyuncak',x:nx(spec[1]),y:720,id:'k13Oyuncak-'+spec[0],zkind:spec[0]});
 window.ZENGIN13={state(){return toys.map(o=>({kind:o.kind,x:o.x,done:o.done,plays:o.plays,held:held.o===o,progress:o.kind==='nest'?o.friend.filter(f=>f.home).length:o.kind==='rain'?o.flowers.filter(f=>f.opened).length:o.kind==='music'?o.caps.filter(c=>c.hit).length:o.pads.filter(p=>p.hit).length,ball:o.kind==='ball'?{x:o.ball.x,y:o.ball.y,vx:o.ball.vx,vy:o.ball.vy}:null}));},isit:prepare};
})();
