/* ipek13.js — İpek Göğü: yaşayan kök köprüsü, tohumdan büyüyen gerçek dallar, bulut minderleri,
   parmak izinden uyanan yıldız bitkileri, rüzgâr perdesi, bulut yaprağında anneyle uçuş ve canlı gök bahçesi. */
'use strict';
(function () {
 if (typeof BOLUM_NO==='undefined'||BOLUM_NO!==13) return;
 const i13Tau=Math.PI*2, i13R=rng(130927), i13Cols=['#8fe3cf','#a3dbea','#b6afe4','#e2d7ad'];
 const i13Obj={pon:[],dok:[],min:[],kel:[],per:[],knot:[],ride:null,fin:null};
 const i13Targets=new Set(['k13Ponpon','k13Dokuma','k13Kelebek','k13Perde','k13Kurdele','k13Ilmek','k13Gok']);
 const i13Atlas={ready:false};
 const i13Trail=Array.from({length:96},()=>({on:false,x:0,y:0,x0:0,y0:0,t:0,life:0,k:0}));
 const i13Fly=Array.from({length:36},()=>({on:false,x:0,y:0,tx:0,ty:0,t:0,life:0,k:0,ph:0,ang:0}));
 const i13Glow=Array.from({length:40},()=>({on:false,x:0,y:0,vx:0,vy:0,t:0,life:0,k:0,s:0}));
 const i13Pulse=Array.from({length:8},()=>({on:false,sx:0,ex:0,t:0,life:0,k:0}));
 const i13Echo=Array.from({length:4},()=>({on:false,points:new Float32Array(128),n:0,t:0,x:0,y:0,k:1,angle:0}));
 const i13Hand={on:false,id:null,kind:'',o:null,x:0,y:0,px:0,py:0,dr:0,path:new Float32Array(128),pathN:0};
 const i13Temp={x:0,y:0};

 let i13Clock=0,i13Active=null,i13PoolN=0,i13BridgeStarted=false;
 const i13Clamp=v=>clamp(v,0,1),i13Ease=v=>smooth(i13Clamp(v));
 const i13Near=(o,r)=>Math.abs(P.x-o.x)<r&&Math.abs(P.y-o.y)<260;
 function i13Ev(ad,o,u){OLAY.emit(ad,{o,x:o.x,y:o.y,u:u===undefined?o.u||0:u});}
 function i13Pose(ad,opt){if(window.IP13CHAR&&typeof window.IP13CHAR.poz==='function')window.IP13CHAR.poz(ad,opt);}
 function i13Vis(x,r){return typeof cam==='undefined'||x+r>cam.x-100&&x-r<cam.x+VW+100;}
 function i13New(pool){for(let i=0;i<pool.length;i++){const p=pool[i];if(!p.on)return p;}return pool[(i13PoolN++)%pool.length];}
 function i13Spark(x,y,n,k=0){for(let i=0;i<n;i++){const p=i13New(i13Glow),a=i13R()*i13Tau,v=25+i13R()*65;p.on=true;p.x=x;p.y=y;p.vx=Math.cos(a)*v;p.vy=Math.sin(a)*v-40;p.t=0;p.life=.65+i13R()*.8;p.k=(k+i)%4;p.s=3+i13R()*5;}}
 function i13Line(x0,y0,x,y,k=0){const p=i13New(i13Trail);p.on=true;p.x0=x0;p.y0=y0;p.x=x;p.y=y;p.t=0;p.life=3.8;p.k=k;}
 function i13Butter(x,y,tx,ty,k=0,follow=false){const p=i13New(i13Fly);p.on=true;p.x=x;p.y=y;p.tx=tx;p.ty=ty;p.t=0;p.life=7+i13R()*4;p.k=k%4;p.ph=i13R()*i13Tau;p.ang=0;p.follow=follow;}
 function i13CapturePoint(x,y){
  let n=i13Hand.pathN;const p=i13Hand.path;if(n&&Math.hypot(x-p[(n-1)*2],y-p[(n-1)*2+1])<9)return;
  if(n>=64){for(let j=0;j<32;j++){p[j*2]=p[j*4];p[j*2+1]=p[j*4+1];}n=32;}
  p[n*2]=x;p[n*2+1]=y;i13Hand.pathN=n+1;
 }
 function i13WakeDrawing(o){
  if(i13Hand.pathN<3)return;let e=null;for(let j=0;j<i13Echo.length;j++)if(!i13Echo[j].on){e=i13Echo[j];break;}if(!e)return;
  e.on=true;e.n=i13Hand.pathN;e.t=0;e.k=1+o.sira%2*2;e.x=i13Hand.path[0];e.y=i13Hand.path[1];e.angle=0;for(let j=0;j<e.n*2;j++)e.points[j]=i13Hand.path[j];
 }
 function i13Canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
 function i13Oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,i13Tau);c.fill();}
 function i13Star(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,rr=i%2?r*.25:r;i?c.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr):c.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}c.closePath();c.fill();}
 function i13Leaf(c,x,y,len,wid,ang,col){
  c.save();c.translate(x,y);c.rotate(ang);const gr=c.createLinearGradient(0,-wid,0,wid);gr.addColorStop(0,'#cfefd8');gr.addColorStop(.24,col);gr.addColorStop(1,'#164a4e');c.fillStyle=gr;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(len*.22,-wid,len*.78,-wid*.68,len,0);c.bezierCurveTo(len*.65,wid*.72,len*.26,wid,0,0);c.fill();c.strokeStyle='rgba(180,242,220,.38)';c.lineWidth=.9;c.beginPath();c.moveTo(2,0);c.quadraticCurveTo(len*.48,-wid*.08,len-3,0);c.stroke();c.restore();
 }
 // Warmup-only analytic veil pixels avoid the ordered dither of translucent GPU gradients.
 function i13VeilField(){
  const field=new Float32Array(270*440),kernel=new Float32Array(256);for(let i=0;i<256;i++)kernel[i]=Math.exp(-.5*(i/64)*(i/64));
  for(let y=0;y<440;y++){const x0=122+Math.sin(y*.017+1.3)*66+Math.cos(y*.006)*17,x1=130+Math.sin(y*.022-1.7)*78+Math.sin(y*.008+2)*9,x2=125+Math.sin(y*.013+3.1)*87+Math.cos(y*.025)*13,w0=18+Math.sin(y*.009+.2)*5,w1=24+Math.sin(y*.015+1)*4,w2=16+Math.cos(y*.012+1.5)*5,ey=Math.min(i13Ease(y/65),i13Ease((439-y)/90));
   for(let x=0;x<270;x++){const a0=Math.floor(Math.abs(x-x0)/w0*64),a1=Math.floor(Math.abs(x-x1)/w1*64),a2=Math.floor(Math.abs(x-x2)/w2*64),a=(a0<256?kernel[a0]*.1:0)+(a1<256?kernel[a1]*.085:0)+(a2<256?kernel[a2]*.065:0);field[y*270+x]=a*ey*Math.min(i13Ease(x/55),i13Ease((269-x)/55));}}
  return field;
 }
 function i13VeilPaint(c,k){
  const field=i13Atlas.veilField||(i13Atlas.veilField=i13VeilField()),im=c.createImageData(270,440),d=im.data,mid=parseInt(i13Cols[k].slice(1),16),mr=mid>>16,mg=mid>>8&255,mb=mid&255;let seed=13019+k*977;
  for(let y=0;y<440;y++){const u=y/439,t=u<.45?u/.45:(u-.45)/.55,r=u<.45?lerp(183,mr,t):lerp(mr,167,t),gg=u<.45?lerp(168,mg,t):lerp(mg,212,t),b=u<.45?lerp(218,mb,t):lerp(mb,220,t);for(let x=0;x<270;x++){const p=y*270+x,i=p*4;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;d[i]=r;d[i+1]=gg;d[i+2]=b;d[i+3]=Math.round(field[p]*255+((seed>>>0)/4294967296-.5)*.7);}}
  c.putImageData(im,0,0);
 }
 function i13Isit(){
  if(i13Atlas.ready)return true;i13Atlas.ready=true;
  i13Atlas.podParts=[];i13Atlas.leafPaint=[];i13Atlas.min=[];i13Atlas.wing=[];i13Atlas.veil=[];i13Atlas.skyLeaf=[];i13Atlas.dreamSeed=[];
  for(let k=0;k<4;k++){
   let a=i13Canvas(288,128),c=a.getContext('2d');
   for(let side=0;side<2;side++){c.save();c.translate(side*96+48,111);c.scale(side?1:-1,1);const shell=c.createLinearGradient(-4,-88,29,-8);shell.addColorStop(0,'#c2e3c8');shell.addColorStop(.33,['#6fac91','#75a6b0','#938ead','#a4ae8b'][k]);shell.addColorStop(1,'#214b50');c.fillStyle=shell;c.beginPath();c.moveTo(-2,1);c.bezierCurveTo(37,-12,32,-64,2,-91);c.bezierCurveTo(10,-50,-6,-31,-2,1);c.fill();c.strokeStyle='rgba(215,241,215,.45)';c.lineWidth=1.1;c.beginPath();c.moveTo(1,-5);c.bezierCurveTo(19,-29,17,-56,2,-85);c.stroke();c.restore();}
   c.save();c.translate(240,77);const core=c.createRadialGradient(0,-9,1,0,-9,39);core.addColorStop(0,'rgba(237,248,210,.7)');core.addColorStop(.32,'rgba(175,226,191,.35)');core.addColorStop(1,'rgba(130,214,206,0)');c.fillStyle=core;c.fillRect(-45,-56,90,90);i13Oval(c,0,-9,5,12,'#e3f2cf');c.restore();i13Atlas.podParts.push(a);
   a=i13Canvas(320,128);c=a.getContext('2d');const wash=c.createLinearGradient(0,-10,20,128);wash.addColorStop(0,'#d0e7c5');wash.addColorStop(.17,['#86bfa0','#8fbac1','#a6adc7','#b3bf9a'][k]);wash.addColorStop(.55,['#4e927c','#558d98','#7588a3','#7f997c'][k]);wash.addColorStop(1,'#214c52');c.fillStyle=wash;c.fillRect(0,0,320,128);const grain=rng(611+k);for(let j=0;j<290;j++){c.globalAlpha=.02+grain()*.04;c.fillStyle=j%3?'#e4f0d4':'#1c4b53';c.beginPath();c.ellipse(grain()*320,grain()*128,1+grain()*5,.4+grain()*1.6,-.2,0,i13Tau);c.fill();}c.globalAlpha=1;i13Atlas.leafPaint.push(a);
   a=i13Canvas(250,105);c=a.getContext('2d');const cl=c.createLinearGradient(0,5,0,102);cl.addColorStop(0,'#e0f4ed');cl.addColorStop(.35,'#a5d2d9');cl.addColorStop(.72,'#729abf');cl.addColorStop(1,'#334d7b');c.fillStyle=cl;c.beginPath();c.moveTo(15,85);c.bezierCurveTo(4,58,20,39,52,44);c.bezierCurveTo(49,18,83,6,106,27);c.bezierCurveTo(124,2,166,11,172,34);c.bezierCurveTo(207,17,244,40,233,66);c.bezierCurveTo(255,92,198,110,129,100);c.bezierCurveTo(72,107,29,104,15,85);c.fill();c.globalAlpha=.48;i13Oval(c,91,42,42,22,'#e6faf2');i13Oval(c,161,46,48,19,'#d6eff0');c.globalAlpha=1;i13Atlas.min.push(a);
   a=i13Canvas(90,82);c=a.getContext('2d');if(k%2===0){
    c.fillStyle=i13Cols[k];c.beginPath();c.moveTo(45,43);c.bezierCurveTo(11,4,1,36,32,46);c.bezierCurveTo(7,49,24,80,44,49);c.bezierCurveTo(66,82,84,47,57,46);c.bezierCurveTo(91,28,70,2,45,43);c.fill();c.strokeStyle='#e8fbef';c.lineWidth=1.3;c.beginPath();c.moveTo(45,50);c.lineTo(45,31);c.stroke();
   }else{
    const gr=c.createRadialGradient(40,37,3,45,43,32);gr.addColorStop(0,'#effbee');gr.addColorStop(.6,i13Cols[k]);gr.addColorStop(1,'#527a9e');c.fillStyle=gr;c.beginPath();c.moveTo(45,10);c.quadraticCurveTo(56,31,75,37);c.quadraticCurveTo(64,49,67,65);c.quadraticCurveTo(45,61,29,71);c.quadraticCurveTo(30,51,13,43);c.quadraticCurveTo(35,31,45,10);c.fill();i13Oval(c,38,43,2.3,3.3,'#223c59');i13Oval(c,52,43,2.3,3.3,'#223c59');c.strokeStyle='#3c6481';c.lineWidth=1.3;c.beginPath();c.arc(45,49,4,.2,Math.PI-.2);c.stroke();
   }i13Atlas.wing.push(a);
   a=i13Canvas(270,440);c=a.getContext('2d');i13VeilPaint(c,k);i13Atlas.veil.push(a);
  }
  i13Atlas.veilField=null;
  for(let k=0;k<3;k++){
   let a=i13Canvas(144,90),c=a.getContext('2d');const fog=c.createRadialGradient(75,43,3,75,43,65);fog.addColorStop(0,'rgba(174,236,220,.12)');fog.addColorStop(1,'rgba(133,209,222,0)');c.fillStyle=fog;c.fillRect(0,0,144,90);i13Leaf(c,15,45,112,22,-.03,['#75bca4','#8ebccc','#a6abd0'][k]);i13Atlas.skyLeaf.push(a);
   a=i13Canvas(90,80);c=a.getContext('2d');const q=c.createRadialGradient(41,34,2,45,43,31);q.addColorStop(0,'#e5f7e8');q.addColorStop(.65,i13Cols[k+1]);q.addColorStop(1,'#4a7393');c.fillStyle=q;c.beginPath();c.moveTo(44,14);c.quadraticCurveTo(57,28,73,36);c.quadraticCurveTo(69,52,63,63);c.quadraticCurveTo(44,68,27,64);c.quadraticCurveTo(22,50,13,43);c.quadraticCurveTo(31,31,44,14);c.fill();c.strokeStyle='#29475c';c.lineWidth=1.5;c.lineCap='round';for(const x of [36,52]){c.beginPath();c.moveTo(x-4,43);c.quadraticCurveTo(x,47,x+4,43);c.stroke();}i13Atlas.dreamSeed.push(a);
  }
  let a=i13Canvas(120,115),c=a.getContext('2d');const heart=c.createLinearGradient(0,12,0,112);heart.addColorStop(0,'#96d1aa');heart.addColorStop(.45,'#4b967a');heart.addColorStop(1,'#1e5a55');c.fillStyle=heart;c.beginPath();c.moveTo(20,103);c.bezierCurveTo(-5,60,33,19,61,24);c.bezierCurveTo(98,6,128,60,96,91);c.quadraticCurveTo(61,115,20,103);c.fill();i13Leaf(c,45,31,35,11,-2.1,'#74b594');i13Leaf(c,69,28,31,10,-.85,'#87c7a4');c.strokeStyle='#1d5f55';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(24,105);c.bezierCurveTo(12,72,39,71,42,38);c.moveTo(91,103);c.bezierCurveTo(107,68,84,73,82,40);c.stroke();i13Oval(c,52,63,3,4,'#173d48');i13Oval(c,72,61,3,4,'#173d48');c.strokeStyle='#244d52';c.lineWidth=1.8;c.beginPath();c.arc(63,72,7,.15,2.9);c.stroke();i13Atlas.rootFriend=a;
  a=i13Canvas(430,155);c=a.getContext('2d');
  const wind=c.createLinearGradient(0,0,0,155);wind.addColorStop(0,'#d9f5e6');wind.addColorStop(.25,'#8aceb7');wind.addColorStop(.68,'#438e8a');wind.addColorStop(1,'#284d77');c.fillStyle=wind;c.beginPath();c.moveTo(20,51);c.bezierCurveTo(69,68,124,-8,194,30);c.bezierCurveTo(273,51,351,-14,412,41);c.bezierCurveTo(382,64,389,103,331,105);c.bezierCurveTo(255,135,151,122,91,103);c.bezierCurveTo(55,94,33,72,20,51);c.fill();c.strokeStyle='rgba(211,247,221,.56)';c.lineWidth=2;c.beginPath();c.moveTo(26,49);c.bezierCurveTo(160,53,279,57,407,50);c.stroke();
  for(let j=0;j<7;j++){c.strokeStyle='rgba(194,239,218,.27)';c.lineWidth=1;c.beginPath();c.moveTo(115+j*35,54);c.quadraticCurveTo(120+j*29,86,100+j*32,105);c.stroke();}
  c.globalAlpha=.66;const mist=c.createLinearGradient(0,85,0,150);mist.addColorStop(0,'#c3e5dc');mist.addColorStop(1,'#406d96');c.fillStyle=mist;c.beginPath();c.moveTo(70,95);c.bezierCurveTo(100,76,144,96,168,91);c.bezierCurveTo(206,91,247,85,279,97);c.bezierCurveTo(316,85,361,104,342,125);c.bezierCurveTo(315,143,248,151,213,137);c.bezierCurveTo(165,153,112,138,83,127);c.quadraticCurveTo(62,115,70,95);c.fill();c.globalAlpha=1;i13Atlas.cloudLeaf=a;
  a=i13Canvas(160,70);c=a.getContext('2d');const haze=c.createRadialGradient(80,35,2,80,35,78);haze.addColorStop(0,'rgba(169,224,218,.24)');haze.addColorStop(.5,'rgba(129,190,206,.11)');haze.addColorStop(1,'rgba(109,165,204,0)');c.fillStyle=haze;c.fillRect(0,0,160,70);i13Atlas.wake=a;
  return true;
 }
 function i13LeafSurface(o,tm,width){
  const u=o.unfurl===undefined?i13Ease((o.growth-.02)/.76):o.unfurl,contact=Math.max(8,o.cisim.w*.5-6),half=contact+6,variety=o.sira%3,depth=(7+u*width*.105)*(variety===0?.78:variety===1?.9:1.14);
  const settle=Math.sin((o.growAge||0)*7+o.sira)*Math.exp(-(o.growAge||0)*1.8)*u*2.5+Math.sin(tm*7+o.sira)*(o.pop||0)*1.2,curl=(1-u)*(24+width*.1),breathe=Math.sin(tm*1.1+o.sira)*u*.9,lx=-half-5-(variety===2?11:6)*u,ly=-curl-(variety===2?18:6)*u,rx=half+6+(variety===1?25:variety===2?17:12)*u,ry=-curl*.74-(variety===1?34:variety===2?14:22)*u+settle;
  g.save();g.translate(o.x,o.y-o.cisim.h);g.scale(o.sira%2?-1:1,1);g.globalAlpha*=i13Ease(o.growth/.055);
  // The opaque central fold supports the player; the unequal free lobes curl beyond it.
  g.beginPath();g.moveTo(lx,ly);g.bezierCurveTo(lx*.79,-curl-25*u,-half*.5,-19*u,-half*.13,-4*u);g.bezierCurveTo(half*.26,-19*u,half*.64,-7*u,rx,ry);g.bezierCurveTo(rx-9,13*u+breathe,half*.58,depth+6,half*.15,depth-4);g.bezierCurveTo(half*.1,depth+2,-half*.12,depth+8,-half*.34,depth-1);g.bezierCurveTo(-half*.71,depth*.95,-half*.98,depth*.45,lx,ly);g.closePath();
  g.save();g.clip();g.drawImage(i13Atlas.leafPaint[o.sira%4],-width*.67,-curl-32*u-7,width*1.4,depth+curl+32*u+23);
  g.globalAlpha*=.12+.13*(1-u);g.fillStyle='#e0edcc';g.beginPath();g.moveTo(-half*.15,-4*u);g.bezierCurveTo(half*.25,-19*u,half*.64,-7*u,rx,ry);g.bezierCurveTo(half*.69,ry+14*u,half*.38,-2*u,-half*.15,-4*u);g.fill();g.restore();
  g.save();g.globalAlpha*=.075*u;g.fillStyle='#e3edcc';g.beginPath();g.moveTo(-contact+7,.5);g.bezierCurveTo(-contact*.46,1.6,-contact*.18,-1.1,0,.2);g.bezierCurveTo(contact*.24,1.5,contact*.58,-1.2,contact-6,.8);g.bezierCurveTo(contact*.56,5,contact*.24,3.7,0,4.4);g.bezierCurveTo(-contact*.31,3.2,-contact*.64,5.2,-contact+7,.5);g.fill();g.restore();
  g.lineCap='round';g.strokeStyle='rgba(212,235,199,.25)';g.lineWidth=.8;g.beginPath();g.moveTo(lx+7,ly+3);g.bezierCurveTo(-half*.52,2,half*.2,1.7,half*.55,-5*u);g.quadraticCurveTo(half*.83,-7*u,rx-5,ry+3);g.stroke();
  g.strokeStyle='rgba(218,237,204,.14)';g.lineWidth=.65;g.beginPath();for(let j=0;j<4;j++){const xx=half*(-.62+j*.37),y=j>1?-3*u:1,side=j%2?-1:1;g.moveTo(xx,y+2);g.bezierCurveTo(xx+8,y+side*depth*.14,xx+18,y+side*depth*.35,xx+22,y+side*depth*.49);}g.stroke();
  g.save();g.globalAlpha*=u*.1;g.strokeStyle='#183e4c';g.lineWidth=1.3;g.beginPath();g.moveTo(half*.18,depth-3);g.quadraticCurveTo(half*.59,depth*.73,rx-3,ry+5);g.stroke();g.restore();
  if(u<.99){g.strokeStyle='rgba(224,243,209,.35)';g.lineWidth=.9;g.beginPath();g.moveTo(lx,ly);g.quadraticCurveTo(lx+12,ly+15,-contact*.56,-3*u);g.moveTo(rx,ry);g.quadraticCurveTo(rx-11,ry+16,contact*.55,-5*u);g.stroke();}g.restore();
 }
 function i13Branch(o,tm,width=190){
  const u=o.growth===undefined?o.u||0:o.growth;if(u<=.0001)return;const h=o.cisim?o.cisim.h:110*u,top=o.y-h,bend=Math.sin(tm*.7+o.sira)*Math.min(5,h*.025),sap=o.sap||0;
  g.save();g.lineCap='round';g.globalAlpha*=i13Ease(u/.045);g.strokeStyle='#234f4d';g.lineWidth=4+4*u;g.beginPath();g.moveTo(o.x,o.y+7);g.bezierCurveTo(o.x-10*u,o.y-h*.26,o.x+11*u+bend,o.y-h*.73,o.x,top+7);g.stroke();g.strokeStyle='#76b198';g.lineWidth=1.1;g.stroke();
  for(let j=0;j<3;j++){const v=(sap*.48+j*.33)%1,yy=o.y-h*v,x=o.x+Math.sin(v*Math.PI*2)*5*u;g.save();g.globalAlpha*=Math.sin(v*Math.PI)*(.16+.35*(o.pop||0));g.drawImage(i13Atlas.wake,x-12,yy-11,24,22);g.restore();}
  for(let j=0;j<3;j++){const reveal=i13Ease((u-.14-j*.17)/.45);if(reveal<=0)continue;const side=j%2?-1:1,yy=o.y-h*(.22+j*.23),ang=side<0?lerp(-1.78,-2.8,reveal):lerp(-1.4,-.45,reveal);g.save();g.translate(o.x,yy);g.rotate(ang+Math.sin(tm*1.1+j)*.025*reveal);g.globalAlpha*=reveal;g.drawImage(i13Atlas.skyLeaf[(o.sira+j)%3],-3,-8,17+31*reveal,14+16*reveal);g.restore();}
  g.restore();i13LeafSurface(o,tm,width);
 }
 function i13DrawPod(o,tm,scale=1,opening){
  const u=opening===undefined?o.podOpen||0:opening,a=i13Atlas.podParts[(o.sira||0)%4],breath=Math.sin(tm*1.2+o.sira)*.025,settle=(o.foldV||0)*.012;
  g.save();g.translate(o.x,o.y-6);g.scale(scale*(1-u*.32),scale*(1-u*.32));g.save();g.globalAlpha=.45+.4*u+.12*(o.pop||0);g.drawImage(a,192,0,96,128,-48,-114,96,128);g.restore();
  for(let side=-1;side<=1;side+=2){g.save();g.translate(side*u*5,-8);g.rotate(side*(u*.86+breath+settle));g.drawImage(a,side<0?0:96,0,96,128,-48,-111,96,128);g.restore();}g.restore();
 }
 function i13Pop(o){o.pop=1;i13Spark(o.x,o.y-48,9,o.sira);}
 function i13Pon(o){if(o.cd>0)return;o.cd=.65;o.pop=1;o.hits++;o.target=1;i13Spark(o.x,o.y-63,6,o.sira);if(o.hits===1)i13Ev('ipekPonpon',o);else if(o.growth>.8)i13Butter(o.x,o.y-o.cisim.h-20,P.x+Math.sin(o.hits)*90,P.y-135,o.sira+1);i13Pose('dokuma',{sure:1.4,x:o.x,y:o.y-70,u:o.growth,ax:o.x-45,ay:720});}
 function i13Weave(o,n=.26){
  if(o.u>=1){o.pop=.65;if(i13Clock-(o.lastReplay||-99)>.45){o.lastReplay=i13Clock;i13Spark(o.x,o.y-66,6,o.sira);}return;}
  if(!o.started){o.started=true;if(!i13BridgeStarted){i13BridgeStarted=true;i13Ev('ipekKopruBasla',o);}}
  const before=o.u;o.u=i13Clamp(o.u+n);o.pop=1;o.drag=0;
  if(Math.floor(o.u*4)>Math.floor(before*4)||o.u>=1){i13Ev('ipekKopruAdim',o,(o.sira+o.u)/4);i13Spark(o.x,o.y-70,7,o.sira);}
  let tot=0;for(let j=0;j<i13Obj.dok.length;j++)tot+=i13Obj.dok[j].u;V13.kopru=tot/4;
  i13Pose('dokuma',{sure:1.1,u:o.u,x:o.x,y:o.y-65,ax:o.x-45,ay:720});
  if(o.u>=1&&!o.done){o.done=true;if(V13.kopru>.999)i13Ev('ipekKopruTamam',o,1);}
 }
 function i13Pillow(o,launch){
  if(o.cd>0)return;o.cd=.9;o.pop=1;o.wiggle=1;o.cloudV=(o.cloudV||0)-142;o.hits++;if(!o.done){o.done=true;let count=0;for(let j=0;j<i13Obj.min.length;j++)if(i13Obj.min[j].done)count++;V13.minder=count/Math.max(1,i13Obj.min.length);}
  i13Ev('ipekMinder',o);i13Spark(o.x,o.y-45,10,o.sira);
  i13Pose('minder',{sure:2,x:P.x,y:P.y,hedefX:o.x,u:1});
  for(let j=0;j<i13Obj.min.length;j++){const q=i13Obj.min[j];if(q===o)continue;const distance=Math.abs(q.x-o.x);if(Math.abs(q.sira-o.sira)===1){q.waveDue=i13Clock+distance/1250;q.waveCol=o.sira%4;const wave=i13New(i13Pulse);wave.on=true;wave.sx=o.x;wave.ex=q.x;wave.t=0;wave.life=distance/1250;wave.k=o.sira%4;}}
  if(launch&&!P.ucus&&Math.abs(P.x-o.x)<125&&P.y>o.y-70){P.vy=-630-o.sira*22;P.ground=false;P.dj=true;P.buf=0;P.bounce=true;P.jumpT=0;P.coyote=0;P.air=0;}
 }
 function i13Garden(o,x,y,n,stroke){
  const old=o.u;o.pop=1;
  if(stroke){i13Line(stroke.x,stroke.y,x,y,o.sira);o.path+=Math.hypot(x-stroke.x,y-stroke.y);}
  let chosen=null,distance=Infinity;for(let i=0;i<o.dallar.length;i++){const q=o.dallar[i],d=Math.abs(q.x-x);if(d<distance){distance=d;chosen=q;}}
  if(chosen){chosen.target=i13Clamp(chosen.target+n*5.5);chosen.pop=Math.min(1,(chosen.pop||0)+n*3);}
  let total=0;for(let i=0;i<o.dallar.length;i++)total+=o.dallar[i].target;o.u=total/Math.max(1,o.dallar.length);
  if(i13Clock-o.lastFly>.28){o.lastFly=i13Clock;i13Butter(o.x,o.y-45,x,Math.min(y,o.y-75),o.sira);}
  if(i13Clock-o.lastEvent>.5){o.lastEvent=i13Clock;OLAY.emit('ipekIz',{o,x,y,u:o.u});}
  let sum=0;for(let i=0;i<i13Obj.kel.length;i++)sum+=i13Obj.kel[i].u;V13.kelebek=sum/4;
  if(old<1&&o.u>.999){o.done=true;i13Spark(x,y,9,o.sira);for(let j=0;j<3;j++)i13Butter(x,y,x+(j-1)*70,y-70,j+1);if(V13.kelebek>.999)i13Ev('ipekKelebekTamam',o,1);}
 }
 function i13Pattern(o,x,y){
  o.pattern=(o.pattern+1)%2;o.patternT=0;o.patternNext=0;o.patternOn=true;o.patternX=clamp(x,o.x-150,o.x+150);o.patternY=clamp(y,390,590);o.playCount++;
  i13Pose('hayran',{sure:2.7,x:o.patternX,y:o.patternY-80});
 }
 function i13PatternStep(o,dt){
  if(!o.patternOn)return;o.patternT+=dt;const n=Math.min(34,Math.floor(o.patternT/2.2*34));
  while(o.patternNext<n){const j=o.patternNext++,u=j/34,u0=Math.max(0,(j-1)/34),x=o.x-150+u*300,y=lerp(o.y-50,o.patternY,u)+Math.sin(u*Math.PI*2)*22,x0=o.x-150+u0*300,y0=lerp(o.y-50,o.patternY,u0)+Math.sin(u0*Math.PI*2)*22;i13Line(x0,y0,x,y,o.sira);if(j%4===0)i13Garden(o,x,y,.12,null);}
  if(o.patternNext>=34)o.patternOn=false;
 }
 function i13KnotPlay(o){if(o.cd>0)return;o.cd=.8;o.flash=1;o.plays++;o.turn+=.3;o.target=1;if(!o.done){o.done=true;o.lift=0;}i13Spark(o.x,o.y-65,6,o.sira);i13Pose('dokuma',{sure:1.4,x:o.x,y:o.y-80,u:o.growth,ax:o.x-45,ay:720});OLAY.emit('ipekDilek',{o,x:o.x,y:o.y-75,sira:o.sira});}
 function i13DrawKnot(o,tm){
  i13Branch(o,tm,190);g.save();g.strokeStyle='#467c68';g.lineCap='round';g.lineWidth=6;for(let j=0;j<3;j++){g.beginPath();g.moveTo(o.x-39,o.y-17+j*5);g.quadraticCurveTo(o.x,o.y-3+j*3,o.x+39,o.y-18+j*5);g.stroke();}g.restore();
  if(!o.done||o.lift<.45){g.save();g.globalAlpha=1-i13Ease(o.lift/.45);g.translate(o.x,o.y-47+Math.sin(tm*.8+o.sira)*2);g.rotate(Math.sin(tm*.7+o.sira)*.045);g.drawImage(i13Atlas.dreamSeed[o.sira],-30,-29,60,53);g.restore();}
 }
 function i13DrawConstellations(tm){
  for(let k=0;k<i13Obj.knot.length;k++){
   const o=i13Obj.knot[k];if(!o.done)continue;const lift=i13Ease(o.lift/2.4),fin=i13Obj.fin,join=fin&&fin.phase?i13Ease((fin.t-3-k*1.3)/9):0,spread=fin&&fin.phase?i13Ease((fin.t-12)/7):0;
   const visit=fin&&fin.phase&&k===1?i13Ease((fin.t-19)/3):0,cx=lerp(lerp(o.x,fin?fin.x+(k-1)*265:o.x,join),P.x+105,visit)+Math.sin(tm*.45+k)*8,cy=lerp(lerp(o.y-65-205*lift,355+(k===1?-60:0),join),P.y-185,visit);if(!i13Vis(cx,180))continue;
   g.save();g.globalAlpha=i13Ease(o.lift/.45);g.translate(cx,cy);g.rotate(Math.sin(tm+k)*.08);g.drawImage(i13Atlas.wing[k%2*2+1],-26,-25,52,49);g.restore();
   if(join<.99){g.save();g.globalAlpha=.13*(1-join);g.strokeStyle='#9cd9c6';g.lineWidth=1;g.beginPath();g.moveTo(o.x,o.y-60);g.quadraticCurveTo(o.x-26,cy+100,cx,cy+20);g.stroke();g.restore();}
  }
 }
 function i13Part(o,n){
  const old=o.target;o.target=i13Clamp(o.target+n);o.pop=1;o.sway=1;
  if(Math.floor(o.target*4)>Math.floor(old*4)){i13Ev('ipekPerdeAdim',o,(o.sira+o.target)/3);i13Spark(o.x,o.y-180,6,o.sira);}
  let total=0;for(let i=0;i<i13Obj.per.length;i++)total+=i13Obj.per[i].target;V13.perde=total/3;
  i13Pose('perde',{sure:1.35,x:o.x,y:o.y-100,ax:o.x-175,ay:720,u:o.target});
  if(o.target>=1&&!o.done){o.done=true;i13Butter(o.x,o.y-140,P.x+120,P.y-135,1);if(V13.perde>.999)i13Ev('ipekPerdeTamam',o,1);}
 }
 function i13DrawPon(o,tm){
  i13Branch(o,tm,205);i13DrawPod(o,tm,.76);
  if(o.growth>.95){const a=tm*.8+o.sira;i13Star(g,o.x+Math.sin(a)*35,o.y-o.cisim.h-28+Math.cos(a)*6,4,'#daf6df');}
 }
 function i13DrawWeave(o,tm){
  const u=o.growth||0,y=o.y;
  // The world always draws the complete walking bridge. Touch only sends living sap through it.
  if(u>.001){g.save();g.lineCap='round';for(let j=0;j<3;j++){const v=((o.sap||0)*.17+j/3)%1,x=o.x-170+v*340,yy=y+23+Math.sin(v*Math.PI*2+o.sira)*6;g.globalAlpha=Math.sin(v*Math.PI)*u*(.16+.18*(o.pop||0));g.drawImage(i13Atlas.wake,x-42,yy-11,84,22);}g.restore();}
  // A living root tip curls up to the child's hand; a new broad leaf is a real optional perch.
  i13Branch(o,tm,218);
  const cy=y-55-Math.sin(tm*1.5+o.sira)*5;
  g.strokeStyle='#4d9b85';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(o.x-50,y+6);g.bezierCurveTo(o.x-78,y-80,o.x+37,y-115,o.x+29,cy);g.stroke();g.strokeStyle='#a7dfba';g.lineWidth=2;g.stroke();
  g.save();g.translate(o.x+29,cy);g.rotate(-.35+o.pop*.14);g.drawImage(i13Atlas.rootFriend,-22,-72,80,77);g.restore();
  if(o.u<1){const a=tm*1.4;g.globalAlpha=.4;g.strokeStyle='#9cccb7';g.lineWidth=1.2;g.beginPath();g.arc(o.x+45,cy-34,22,-1.8+Math.sin(a)*.2,.7);g.stroke();g.globalAlpha=1;i13Star(g,o.x+45+Math.cos(a)*22,cy-34+Math.sin(a)*15,3.6,'#c2e7ce');}

 }
 function i13DrawPillow(o,tm){
  const h=o.h,spread=1+(44-h)*.004+o.wave*.018;g.save();g.globalAlpha=.16;g.fillStyle='#16334e';g.beginPath();g.ellipse(o.x,o.y+4,108,13,0,0,i13Tau);g.fill();g.restore();
  g.save();g.translate(o.x,o.y+8);g.scale(spread,1);g.drawImage(i13Atlas.min[o.sira%4],-125,-h-18,250,h+34);g.restore();
  if(o.pop>.05||o.wave>.05){g.save();g.globalAlpha=Math.max(o.pop,o.wave)*.3;g.strokeStyle=i13Cols[o.waveCol%4];g.lineWidth=2;g.beginPath();g.ellipse(o.x,o.y+2,112+(1-o.pop)*28,15+(1-o.pop)*8,0,0,i13Tau);g.stroke();g.restore();}
  const by=o.y-145-15*Math.sin(tm*.9+o.sira);o.orbX=o.x+52;o.orbY=by;
  if(o.orbShow>.001){const r=i13Ease(o.orbShow);g.save();g.globalAlpha=r;g.translate(o.orbX,by+18*(1-r));g.rotate(Math.sin(tm)*.1);g.drawImage(i13Atlas.wing[(o.sira%2)*2+1],-23,-22,46,44);g.restore();}
  if(o.rewardBloom>.001){const u=o.rewardBloom,x=o.x+115;for(let j=0;j<3;j++){const v=i13Ease((u-j*.1)/.8),h=(25+j*13)*v;g.save();g.lineCap='round';g.strokeStyle='#6f9e9b';g.lineWidth=2;g.beginPath();g.moveTo(x+j*9,o.y);g.quadraticCurveTo(x-7+j*12,o.y-h*.5,x+j*8,o.y-h);g.stroke();g.translate(x+j*8,o.y-h);g.rotate(lerp(-1.55,j%2?-2.5:-.5,v));g.globalAlpha=v;g.drawImage(i13Atlas.skyLeaf[(o.sira+j)%3],-2,-8,35,22);g.restore();}}
 }
 function i13DrawGarden(o,tm){
  for(let j=0;j<o.dallar.length;j++){const q=o.dallar[j],a=1-i13Ease(q.growth/.38);if(a<=.001)continue;const side=j%2?-1:1;g.save();g.globalAlpha=a;g.lineCap='round';g.strokeStyle='#397c6b';g.lineWidth=6;g.beginPath();g.moveTo(q.x,o.y+2);g.bezierCurveTo(q.x+side*24,o.y-27,q.x-side*32,o.y-33,q.x-side*12,o.y-58);g.stroke();g.strokeStyle='#82bca4';g.lineWidth=1.6;g.stroke();g.beginPath();g.arc(q.x-side*4,o.y-56,10,side<0?.2:2.8,side<0?5.2:7.8);g.stroke();g.save();g.translate(q.x+side*8,o.y-17);g.rotate(side<0?-2.7:-.5);g.drawImage(i13Atlas.skyLeaf[j%3],0,-17,61,38);g.restore();i13Star(g,q.x-side*12,o.y-73+Math.sin(tm*1.2+j)*4,3,'#b9e8cc');g.restore();}
  if(o.u<.95&&(o.nearGlow||0)>.001){const a=(tm*.2)%1,x=o.x-155+a*310,y=o.y-150-Math.sin(a*Math.PI)*50;g.globalAlpha=.25*(o.nearGlow||0)*i13Ease((.95-o.u)/.2);g.strokeStyle='#99cebc';g.lineWidth=1.1;g.beginPath();g.moveTo(o.x-155,o.y-150);g.quadraticCurveTo(o.x,o.y-250,o.x+155,o.y-150);g.stroke();g.globalAlpha=(o.nearGlow||0)*i13Ease((.95-o.u)/.2);i13Star(g,x,y,4.2,'#c8eee0');g.globalAlpha=1;}
  if(o.patternOn){const u=i13Clamp(o.patternT/2.2),prev=Math.max(0,(o.patternNext-1)/34),x=o.x-150+u*300,y=lerp(o.y-50,o.patternY,u)+Math.sin(u*Math.PI*2)*22;g.save();g.strokeStyle='rgba(203,239,216,.8)';g.lineWidth=1.3;g.beginPath();g.moveTo(o.x-150+prev*300,lerp(o.y-50,o.patternY,prev)+Math.sin(prev*Math.PI*2)*22);g.lineTo(x,y);g.stroke();g.globalAlpha=.65;g.drawImage(i13Atlas.wake,x-20,y-14,40,28);g.globalAlpha=1;i13Star(g,x,y,4,'#def3cf');g.restore();}
 }
 function i13Curtain(o,tm,on){
  const u=o.u,top=o.y-385;
  if(!on){i13Branch(o,tm,235);for(let j=0;j<5;j++){const v=i13Ease((u-j*.07)/.72),x=o.x-130+j*65,h=(37+j%3*17)*v,side=j%2?-1:1;g.save();g.globalAlpha=.3+.7*v;g.lineCap='round';g.strokeStyle='#477f79';g.lineWidth=2.2;g.beginPath();g.moveTo(x,o.y+2);g.quadraticCurveTo(x+side*(8+v*9),o.y-h*.5,x+side*8,o.y-h);g.stroke();g.translate(x+side*8,o.y-h);g.rotate(lerp(-1.55,side<0?-2.65:-.45,v)+Math.sin(tm*.8+j)*.025);g.drawImage(i13Atlas.skyLeaf[(j+o.sira)%3],-2,-10,24+23*v,22);g.restore();}return;}
  // Moving aurora is rooted wind, with no cloth panel, rail or hanging edge.
  for(let side=-1;side<=1;side+=2){g.save();g.translate(o.x+side*(20+u*175),top);g.scale(side*(1-u*.55),1);g.rotate(side*(-.06-u*.19)+Math.sin(tm*.8+o.sira)*.035);g.globalAlpha=.8-u*.28;g.drawImage(i13Atlas.veil[o.sira%4],-135,0,270,405);g.restore();}
  if(u<.95&&(o.nearGlow||0)>.001){g.save();g.globalAlpha=(o.nearGlow||0)*i13Ease((.95-u)/.15);const a=Math.sin(tm*1.8)*25;for(let side=-1;side<=1;side+=2)i13Star(g,o.x+side*(50+a),o.y-130+Math.sin(tm+side)*8,4,'#c3efdd');g.restore();}
 }
 function i13FlightStart(o){
  if(o.done||P.ucus||DURUM!=='oyun'||!P.ground)return;
  i13Isit();o.phase='binis';o.t=0;o.u=0;o.fx=Number.isFinite(omSimX)?omSimX:P.x;o.fy=720;o.sx=o.fx;o.sy=P.y;o.roll=0;o.aim=0;o.vy=0;o.wind=0;o.px=D.x;o.py=D.y;o.lastAn=-1;
  i13Active=o;P.ucus=o;P.vx=P.vy=0;P.ground=true;P.kilit=0;P.buf=0;P.dj=true;
  V13.yolculukAktif=true;i13Hand.on=false;i13Ev('ipekYolculukBasla',o,0);
 }
 function i13FlightEnd(o,interrupted){
  if(P.ucus===o){P.ucus=null;P.x=P.safeX=o.fx;P.y=P.safeY=720;P.vx=P.vy=0;P.ground=true;P.dj=true;P.buf=0;P.kilit=0;}
  o.phase=interrupted?'bekle':'bitti';V13.yolculukAktif=false;i13Active=null;
  if(!interrupted){o.done=true;V13.yolculuk=true;i13Ev('ipekYolculukBitti',o,1);OLAY.emit('ucusBitti',{o});}
 }
 function i13FlightStep(o,dt,U){
  if(!(dt>0)||!Number.isFinite(dt)||P.ucus!==o||DURUM!=='oyun')return;dt=Math.min(dt,.05);o.t+=dt;
  const oldX=o.fx,oldY=o.fy;
  if(o.phase==='binis'){
   o.fy=lerp(o.sy,720,i13Ease(o.t/1.8));if(o.t>=2.4){o.phase='ucus';o.t=0;}
  }else{
   const held=!!(U&&(U.basili||U.eksenX>0||U.eksenY));o.u=i13Clamp(o.u+dt/(held?40.2:44.5));
   const lift=Math.min(i13Ease(o.u/.08),i13Ease((1-o.u)/.1));
   let aim=0;if(U&&Number.isFinite(U.hedefY)&&U.basili)aim=clamp(U.hedefY-440,-150,150);if(U&&U.eksenY)aim=U.eksenY*125;
   o.aim=lerp(o.aim,aim,1-Math.exp(-dt*2.8));
   o.fx=lerp(o.sx,o.inisX,i13Ease(o.u));o.fy=720-lift*(280-o.aim)+Math.sin(o.t*1.3)*5*lift;
   o.wind=held?1:lerp(o.wind,0,1-Math.exp(-dt*2));
   const an=Math.floor(o.u*7);if(an>o.lastAn){o.lastAn=an;i13Ev('ipekYolculukAn',o,o.u);}
   for(let i=0;i<o.rings.length;i++){const a=o.rings[i];a.pop=Math.max(0,a.pop-dt*1.4);a.fade=lerp(a.fade===undefined?1:a.fade,a.done?0:1,1-Math.exp(-dt*3.5));if(!a.done&&Math.abs(o.fx-a.x)<105&&Math.abs(o.fy-45-a.y)<90){a.done=true;a.pop=1;i13Spark(a.x,a.y,7,i);i13Butter(a.x,a.y,P.x+110,P.y-90,1+i%2*2,true);i13Ev('ipekKurdeleIlmek',o,i/5);}}
  }
  o.x=o.fx;
  o.roll=lerp(o.roll,clamp((o.fy-oldY)/Math.max(.001,dt)*.0009,-.12,.12),1-Math.exp(-dt*3));
  P.x=o.fx;P.y=o.fy;P.vx=(o.fx-oldX)/dt;P.vy=(o.fy-oldY)/dt;P.f=1;P.ground=true;
  const aboard=o.phase==='binis'?i13Ease(o.t/2):Math.min(1,(1-o.u)/.04);
  i13Pose('yolculuk',{sahip:o,sure:.16,u:o.u,fx:P.x,fy:P.y,ax:P.x-67,ay:P.y+2,yon:1,binme:aboard,egim:o.roll});
  o.px=lerp(o.px,P.x+124,1-Math.exp(-dt*3));o.py=lerp(o.py,P.y-110+Math.sin(o.t*2)*12,1-Math.exp(-dt*3));
  D.x=o.px;D.y=o.py;D.f=1;
  if(o.phase==='ucus'&&o.u>=1)i13FlightEnd(o,false);
 }
 function i13DrawRibbon(o,tm,on){
  if(!on){const flying=P.ucus===o,x=flying?P.x-34:o.x,y=flying?P.y:720;if(!flying&&o.done)return;
   g.save();g.translate(x,y+3);g.rotate(flying?o.roll:Math.sin(tm*.8)*.015);g.scale(1+Math.sin(tm)*.012,1+Math.sin(tm*1.5)*.035);g.drawImage(i13Atlas.cloudLeaf,-182,-32,364,131);g.save();g.translate(-182,-32);g.scale(364/430,131/155);g.beginPath();g.moveTo(20,51);g.bezierCurveTo(69,68,124,-8,194,30);g.bezierCurveTo(273,51,351,-14,412,41);g.bezierCurveTo(382,64,389,103,331,105);g.bezierCurveTo(255,135,151,122,91,103);g.bezierCurveTo(55,94,33,72,20,51);g.clip();g.globalAlpha=.13;const sheen=(tm*.09%1)*650-115;g.drawImage(i13Atlas.wake,sheen-100,22,200,88);g.restore();for(let side=-1;side<=1;side+=2){g.save();g.translate(side<0?-151:151,side<0?5:-3);g.rotate(side<0?2.9+Math.sin(tm*2)*.13-(o.aim||0)*.0007:-.5+Math.sin(tm*2+.8)*.13+(o.aim||0)*.0011);g.drawImage(i13Atlas.skyLeaf[side<0?0:1],-7,-15,90,40);g.restore();}g.restore();
   if(flying){for(let j=0;j<4;j++){g.save();g.globalAlpha=.3*(1-j/4);g.translate(x-158-j*40,y+29+Math.sin(tm*1.9-j)*7);g.drawImage(i13Atlas.wake,-65,-22,130,46);g.restore();}
    for(let i=0;i<o.rings.length;i++){const a=o.rings[i];if(!i13Vis(a.x,130))continue;g.save();g.translate(a.x,a.y);g.globalAlpha=(a.fade===undefined?1:a.fade)*.6+a.pop*.25;g.strokeStyle=i13Cols[i%4];g.lineWidth=2.5;g.beginPath();g.ellipse(0,0,54+a.pop*16,84+a.pop*10,Math.sin(tm*.5+i)*.08,-2.2,1.4);g.stroke();g.rotate(tm*.3+i);i13Star(g,52,0,6,'#d4f4df');g.restore();}
   }else i13DrawPod(o.bud,tm,.43,0);
  }else if(P.ucus===o){i13FallbackPair(o,tm);i13DrawPiril(o,tm);}
 }
 function i13FallbackPair(o,tm){if(window.IP13CHAR)return;if(typeof anne12Ciz==='function')anne12Ciz(g,P.x-65,P.y,1,tm,{poz:o.tip==='k13Kurdele'?'otur':'dur',yon:1,u:1,hiz:0,golge:false});if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,'ayakta',tm);}
 function i13DrawPiril(o,tm){if(typeof pirilCizPoz!=='function')return;g.save();g.translate(o.px,o.py);g.rotate(Math.sin(tm*1.5)*.045);pirilCizPoz(g,0,0,.86,'ucus',tm);g.restore();}
 function i13SkyGift(o,x,y){
  if(o.t-o.lastGift<.16)return;o.lastGift=o.t;let nearest=null,distance=Infinity;for(let n=0;n<o.gifts.length;n++){const a=o.gifts[n];if(!a.on)continue;const d=Math.hypot(a.x-x,a.y-y);if(d<distance){nearest=a;distance=d;}if(d<85){a.flash=1;i13Butter(a.x,a.y-35,a.x+55,a.y-95,a.k%2*2+1);return;}}
  if(o.giftCount>=o.gifts.length){if(nearest){nearest.flash=1;i13Butter(nearest.x,nearest.y-35,nearest.x+55,nearest.y-95,nearest.k%2*2+1);}return;}
  const q=o.gifts[o.giftCount++];q.on=true;q.age=0;q.flash=1;q.x=clamp(x,o.x-440,o.x+440);q.y=clamp(y,220,490);q.k=o.giftCount%3;o.tapBoost=Math.min(1,o.tapBoost+.045);i13Spark(o.x+100,o.y-110,4,q.k);
 }
 function i13FinalStart(o){
  if(o.phase||P.ucus||!P.ground||DURUM!=='oyun')return;o.phase='dokuma';o.t=0;o.fx=Number.isFinite(omSimX)?omSimX:P.x;o.fy=720;o.sx=o.fx;o.px=D.x;o.py=D.y;o.weave=0;o.lastStitch=-1;o.ax=o.fx-75;o.tapBoost=0;o.giftCount=0;o.lastGift=-99;for(let j=0;j<o.gifts.length;j++)o.gifts[j].on=false;
  i13Active=o;P.ucus=o;P.kilit=0;P.buf=0;P.vx=P.vy=0;P.ground=true;V13.final=true;i13Hand.on=false;i13Ev('ipekFinalBasla',o,0);
  if(typeof omHepsiniBirak==='function')omHepsiniBirak();
 }
 function i13FinalStep(o,dt,U){
  if(!(dt>0)||!Number.isFinite(dt)||P.ucus!==o||DURUM!=='oyun')return;dt=Math.min(dt,.05);o.t+=dt;const t=o.t;for(let j=0;j<o.gifts.length;j++)if(o.gifts[j].on){o.gifts[j].age=Math.min(4,o.gifts[j].age+dt);o.gifts[j].flash=Math.max(0,o.gifts[j].flash-dt*.8);}
  const prev=o.fx;o.fx=lerp(o.sx,o.x+27,i13Ease(t/3.8));o.fy=720;P.x=o.fx;P.y=o.fy;P.vx=(o.fx-prev)/dt;P.vy=0;P.f=t<20?1:-1;P.ground=true;
  const weave=i13Clamp((t-1.6)/10.4);o.weave=Math.max(o.weave,weave);
  const an=Math.floor(Math.max(0,t-2)/1.3);if(t<13&&an>o.lastStitch){o.lastStitch=an;i13Spark(o.x-170+(an%8)*48,695,4,an%4);i13Ev('ipekGokIlmek',o,o.weave);}
  if(t<12.5){o.phase='dokuma';i13Pose('dokuma',{sahip:o,sure:.16,u:o.weave,fx:P.x,fy:720,ax:P.x-75,ay:720,yon:1});}
  else if(t<20){o.phase='hayran';i13Pose('hayran',{sahip:o,sure:.16,u:i13Clamp((t-12.5)/6),fx:P.x,fy:720,ax:P.x-75+36*i13Ease((t-16)/4),ay:720,yon:1});}
  else {o.phase='saril';i13Pose('saril',{sahip:o,sure:.16,u:i13Ease((t-20)/2.5),fx:P.x,fy:720,ax:P.x-28,ay:720,yon:1});}
  o.px=lerp(o.px,P.x+95+Math.sin(t*.7)*18,1-Math.exp(-dt*2));o.py=lerp(o.py,720-150-Math.sin(t*.8)*12,1-Math.exp(-dt*2));D.x=o.px;D.y=o.py;
  if(t>=13&&!o.risen){o.risen=true;i13Ev('ipekGokYukseldi',o,1);}
  if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('ipekFinal',1.3,o.cameraFn,1,.73);
  if(t>=30&&!o.done){o.done=true;i13Ev('ipekFinalBitti',o,1);}
 }
 function i13SkyGarden(x,y,scale,kind,open,tm){
  const a=window.IP13GARDEN;if(a&&typeof a.ciz==='function'){a.ciz(x,y,scale,kind,open,tm);return;}
  g.save();g.translate(x,y);g.scale(scale,scale);g.globalAlpha*=.8;g.drawImage(i13Atlas.wake,-145,-35,290,85);for(let n=0;n<5;n++){g.save();g.translate((n-2)*24,-18);g.rotate(-2.4+n*.47+Math.sin(tm*.5+n)*.04);const w=75*open;g.drawImage(i13Atlas.skyLeaf[(kind+n)%3],0,-w*.3,w,w*.625);g.restore();}g.restore();
 }
 function i13RootPath(b,x,y,start,end,offset){
  g.beginPath();g.moveTo(x+b.points[start*2]+offset,y+b.points[start*2+1]);const last=Math.floor(end);
  for(let i=start+1;i<=last;i++)g.lineTo(x+b.points[i*2]+offset,y+b.points[i*2+1]);
  if(last<20){const f=end-last;g.lineTo(x+lerp(b.points[last*2],b.points[last*2+2],f)+offset,y+lerp(b.points[last*2+1],b.points[last*2+3],f));}
 }
 function i13DrawQuilt(o,tm,on){
  const t=o.phase?o.t:0,x=o.x+100,y=o.y,grow=Math.max(i13Ease((t-1.5)/10.5),o.tapBoost||0),sky=i13Ease((t-12)/7);
  if(!on){
   if(!o.phase){i13DrawPod(o.seed,tm,.84,0);return;}g.save();g.globalAlpha=1-sky;i13DrawPod(o.seed,tm,.84,i13Ease(t/3.1));g.restore();
   g.lineCap='round';g.save();g.globalAlpha=(1-sky)*(1-sky);g.strokeStyle='#2b6860';g.lineWidth=14*grow;for(let side=-1;side<=1;side+=2){g.beginPath();g.moveTo(x,y);g.bezierCurveTo(x+side*45*grow,y+4,x+side*120*grow,y+20,x+side*195*grow,y+13);g.stroke();}
   g.restore();
   // Each branch grows from its parent rather than appearing as a decoration toggle.
   for(let j=0;j<o.tree.length;j++){const b=o.tree[j],u=j===0?i13Ease(Math.min(1,grow*1.7)):i13Ease((grow-b.delay)/b.span);if(u<=0)continue;const n=u*20;g.save();g.globalAlpha=(1-sky)*(1-sky);for(let chunk=0;chunk<n;chunk+=4){const end=Math.min(n,chunk+4),width=b.width*(1-chunk/25*.7)*(j===0?Math.min(1,grow*2.5):.25+.75*u);i13RootPath(b,x,y,chunk,end,0);g.strokeStyle='#20464a';g.lineWidth=width+1.6;g.stroke();g.strokeStyle=j===0?'#347362':'#437e70';g.lineWidth=width;g.stroke();}i13RootPath(b,x,y,0,n,-b.width*.14);g.strokeStyle='#93c8a8';g.lineWidth=Math.max(1,b.width*.065);g.stroke();g.restore();
    if(j>0&&u>.52){const ni=Math.floor(n),nf=n-ni,tipX=x+lerp(b.points[ni*2],b.points[Math.min(40,ni*2+2)],nf),tipY=y+lerp(b.points[ni*2+1],b.points[Math.min(41,ni*2+3)],nf),bud=i13Ease((u-.52)/.48),place=o.skyPlaces[j-1],px=lerp(tipX,o.x+place.x,sky)+Math.sin(tm*.25+j)*7*sky,py=lerp(tipY+48,place.y,sky)+Math.sin(tm*.37+j)*5*sky;g.save();g.globalAlpha=bud*lerp(.52,place.a,sky);i13SkyGarden(px,py,place.s,place.k,i13Ease((t-10-j*.19)/7.2),tm+j);g.restore();}
   }
   for(let j=0;j<o.gifts.length;j++){const q=o.gifts[j];if(!q.on)continue;const u=i13Ease(q.age/1.4),m=1-u,sx=o.x+100,sy=o.y-110,px=m*m*m*sx+3*m*m*u*(sx+80)+3*m*u*u*q.x+u*u*u*q.x,py=m*m*m*sy+3*m*m*u*(sy-110)+3*m*u*u*(q.y+45)+u*u*u*q.y;if(q.age<1.6){g.save();g.globalAlpha=1-i13Ease((q.age-1.25)/.35);i13Star(g,px,py,5.2,'#ccefd5');g.restore();}if(q.age>1){g.save();g.globalAlpha=i13Ease((q.age-1)/.65);i13SkyGarden(q.x,q.y,.48,q.k,i13Ease((q.age-1.3)/2.4),tm+j);if(q.flash>.001){g.globalAlpha*=q.flash*.2;g.drawImage(i13Atlas.wake,q.x-45,q.y-65,90,65);}g.restore();}}
   if(t>0&&t<15){const f=window.IP13FEZA&&window.IP13FEZA.el,a=typeof ANNE12_ELLER!=='undefined'?ANNE12_ELLER:null,fOk=f&&Number.isFinite(f.x)&&Math.abs(f.x-P.x)<180,aOk=a&&Number.isFinite(a.onX)&&Math.abs(a.onX-P.x)<200;
    const fx=fOk?f.x:P.x-16,fy=fOk?f.y:668,ax=aOk?a.onX:P.x-75,ay=aOk?a.onY:640;g.strokeStyle='#a7d8c4';g.lineWidth=1.25;g.beginPath();g.moveTo(fx,fy);g.bezierCurveTo(fx+38,fy+17,x+82,fy+12,x,y-160-grow*80);g.moveTo(ax,ay);g.bezierCurveTo(ax+40,ay+22,x+67,ay+19,x-15,y-155-grow*90);g.stroke();}
  }else if(o.phase){
   i13FallbackPair(o,tm);
   i13DrawPiril(o,tm);
   if(t>21){const u=i13Ease((t-21)/2);for(let j=0;j<7;j++){const a=tm*.22+j*2.399,r=50+(j%3)*14;g.globalAlpha=u*(.22+.25*Math.sin(tm*1.4+j));i13Star(g,P.x-18+Math.cos(a)*r,y-125-Math.sin(a*.7+j)*46,2.3,'#c6efdd');}g.globalAlpha=1;}
  }
 }
 function i13TreeBuild(){
  const specs=[[0,0,-52,-125,66,-240,24,-360,0,1,15],
   [2,-150,-60,-170,-85,-235,-170,-272,.26,.74,6],[4,-195,80,-215,119,-281,205,-300,.34,.66,5.5],
   [0,-247,-85,-264,-119,-336,-236,-355,.38,.5,4.5],[2,-275,76,-301,136,-347,265,-358,.44,.48,4.5],
   [5,-317,-43,-348,-92,-396,-157,-427,.5,.45,4],[6,-340,72,-379,117,-418,177,-443,.56,.43,4],
   [6,-353,-12,-407,15,-460,4,-485,.62,.37,3.5]];
  const built=[];return specs.map((a,j)=>{if(j){const parent=built[0].points;let near=0;for(let n=1;n<=20;n++)if(Math.abs(parent[n*2+1]-a[1])<Math.abs(parent[near*2+1]-a[1]))near=n;const shift=parent[near*2]-a[0];a[0]+=shift;a[2]+=shift*.5;}const points=new Float32Array(42);for(let i=0;i<=20;i++){const u=i/20,m=1-u;points[i*2]=m*m*m*a[0]+3*m*m*u*a[2]+3*m*u*u*a[4]+u*u*u*a[6];points[i*2+1]=m*m*m*a[1]+3*m*m*u*a[3]+3*m*u*u*a[5]+u*u*u*a[7];}const branch={points,delay:a[8],span:a[9],width:a[10],angle:j%2?-.5:3.3};built.push(branch);return branch;});
 }
 function i13PoolStep(dt){
  if(!(dt>0)||DURUM!=='oyun')return;i13Clock+=dt;
  for(let i=0;i<i13Trail.length;i++){const p=i13Trail[i];if(p.on&&(p.t+=dt)>=p.life)p.on=false;}
  for(let i=0;i<i13Pulse.length;i++){const p=i13Pulse[i];if(p.on&&(p.t+=dt)>=p.life)p.on=false;}
  for(let j=0;j<i13Echo.length;j++){const e=i13Echo[j];if(!e.on)continue;e.t+=dt;if(e.t>=5.8){e.on=false;continue;}const travel=i13Ease(e.t/3.25)*(e.n-1),i=Math.min(e.n-2,Math.floor(travel)),f=travel-i,x=lerp(e.points[i*2],e.points[i*2+2],f),y=lerp(e.points[i*2+1],e.points[i*2+3],f),join=i13Ease((e.t-3.3)/1.8);e.x=lerp(x,P.x+64+Math.sin(e.t*1.5)*12,join);e.y=lerp(y,P.y-140+Math.sin(e.t*1.2)*8,join);e.angle=lerp(e.angle,Math.atan2(e.points[i*2+3]-e.points[i*2+1],e.points[i*2+2]-e.points[i*2])*.12,1-Math.exp(-dt*4));}
  for(let i=0;i<i13Fly.length;i++){const p=i13Fly[i];if(!p.on)continue;p.t+=dt;if(p.t>=p.life){p.on=false;continue;}const a=p.t*.7+p.ph,tx=(p.follow?P.x+70:p.tx)+Math.sin(a)*42,ty=(p.follow?P.y-120:p.ty)-35+Math.cos(a*.7)*28;p.x=lerp(p.x,tx,1-Math.exp(-dt*1.2));p.y=lerp(p.y,ty,1-Math.exp(-dt*1.2));p.ang=Math.sin(a)*.24;}
  for(let i=0;i<i13Glow.length;i++){const p=i13Glow[i];if(!p.on)continue;p.t+=dt;if(p.t>=p.life){p.on=false;continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=20*dt;p.vx*=Math.exp(-dt*1.5);}
 }
 function i13PoolBack(tm){i13Isit();g.save();g.lineCap='round';
  for(let i=0;i<i13Trail.length;i++){const p=i13Trail[i];if(!p.on||!i13Vis(p.x,300))continue;const a=Math.min(1,p.t*8)*(1-i13Ease((p.t/p.life-.45)/.55));g.globalAlpha=a*.12;g.strokeStyle=i13Cols[p.k%4];g.lineWidth=8;g.beginPath();g.moveTo(p.x0,p.y0);g.lineTo(p.x,p.y);g.stroke();g.globalAlpha=a*.92;g.strokeStyle='#c8f1de';g.lineWidth=1.4;g.stroke();}
  for(let j=0;j<i13Echo.length;j++){const e=i13Echo[j];if(!e.on||!i13Vis(e.x,70))continue;g.save();g.globalAlpha=i13Ease(e.t/.28)*(1-i13Ease((e.t-4.8)/1));g.translate(e.x,e.y);g.rotate(e.angle);g.drawImage(i13Atlas.wake,-34,-27,68,54);g.drawImage(i13Atlas.wing[e.k],-27,-25,54,50);g.restore();}
 g.restore();}
 function i13PoolDraw(tm){
  i13Isit();g.save();g.lineCap='round';
  for(let i=0;i<i13Pulse.length;i++){const p=i13Pulse[i];if(!p.on)continue;const u=i13Clamp(p.t/p.life),x=lerp(p.sx,p.ex,u),y=709-Math.sin(u*Math.PI)*22,dir=Math.sign(p.ex-p.sx);if(!i13Vis(x,110))continue;g.globalAlpha=.78;g.strokeStyle=i13Cols[p.k];g.lineWidth=4;g.beginPath();g.moveTo(x-dir*80,y+7);g.quadraticCurveTo(x-dir*30,y-11,x,y);g.stroke();g.globalAlpha=1;i13Star(g,x,y,6,'#ffeac0');}
  for(let i=0;i<i13Fly.length;i++){const p=i13Fly[i];if(!p.on||!i13Vis(p.x,70))continue;const a=Math.min(1,p.t*2.5)*(1-i13Ease((p.t/p.life-.75)/.25)),w=.25+.7*Math.abs(Math.sin(tm*3.4+p.ph));g.save();g.globalAlpha=a;g.translate(p.x,p.y);g.rotate(p.ang);g.scale(w,.78);g.drawImage(i13Atlas.wing[p.k],-35,-30,70,60);g.restore();}
  for(let i=0;i<i13Glow.length;i++){const p=i13Glow[i];if(!p.on||!i13Vis(p.x,20))continue;g.globalAlpha=(1-p.t/p.life)*.9;i13Star(g,p.x,p.y,p.s*(1-p.t/p.life*.45),i13Cols[p.k]);}g.restore();
 }
 function i13Point(e){const r=cv.getBoundingClientRect();i13Temp.x=cam.x+(e.clientX-r.left)*DPR/S;i13Temp.y=cam.y+(e.clientY-r.top)*DPR/S;return i13Temp;}
 function i13Hit(x,y){
  if(P.ucus)return null;
  for(let i=0;i<i13Obj.pon.length;i++){const o=i13Obj.pon[i];if(Math.abs(x-o.x)<65&&Math.abs(y-o.y+46)<75&&i13Near(o,500))return{o,kind:'pon'};}
  for(let i=0;i<i13Obj.dok.length;i++){const o=i13Obj.dok[i];if(Math.abs(x-o.x)<126&&y>o.y-155&&y<o.y+30&&i13Near(o,530))return{o,kind:'dok'};}
  for(let i=0;i<i13Obj.min.length;i++){const o=i13Obj.min[i];if(o.hits&&!o.rewardTaken&&Math.hypot(x-o.orbX,y-o.orbY)<66&&i13Near(o,430))return{o,kind:'fruit'};if(Math.abs(x-o.x)<125&&y>o.y-120&&y<o.y+35&&i13Near(o,450))return{o,kind:'min'};}
  for(let i=0;i<i13Obj.kel.length;i++){const o=i13Obj.kel[i];if(Math.abs(x-o.x)<350&&y>220&&y<o.y-24&&i13Near(o,600))return{o,kind:'kel'};}
  for(let i=0;i<i13Obj.knot.length;i++){const o=i13Obj.knot[i];if(Math.abs(x-o.x)<95&&y>o.y-157&&y<o.y+10&&i13Near(o,450))return{o,kind:'knot'};}
  for(let i=0;i<i13Obj.per.length;i++){const o=i13Obj.per[i];if(Math.abs(x-o.x)<218&&y>230&&y<o.y+15&&i13Near(o,550))return{o,kind:'per'};}
  return null;
 }
 function i13Down(e){
  if(DURUM!=='oyun'||e.target!==cv||e.pointerType==='mouse'&&e.button!==0)return;
  const p=i13Point(e);
  if(i13Active&&i13Active.tip==='k13Gok'){i13Active.weave=i13Clamp(i13Active.weave+.045);i13SkyGift(i13Active,p.x,p.y);return;}
  if(P.ucus)return;
  // Normal jump region belongs to the same familiar control, even when a toy sits behind it.
  if(typeof dugmede==='function'&&dugmede(e.clientX,e.clientY))return;
  const h=i13Hit(p.x,p.y);if(!h)return;
  i13Hand.on=true;i13Hand.id=e.pointerId;i13Hand.kind=h.kind;i13Hand.o=h.o;i13Hand.x=i13Hand.px=p.x;i13Hand.y=i13Hand.py=p.y;i13Hand.dr=0;
  if(h.kind==='pon')i13Pon(h.o);else if(h.kind==='dok')i13Weave(h.o,.26);else if(h.kind==='min')i13Pillow(h.o,true);else if(h.kind==='fruit')i13CloudReward(h.o);else if(h.kind==='kel'){i13Hand.pathN=0;i13CapturePoint(p.x,p.y);i13Garden(h.o,p.x,p.y,.12,{x:p.x-3,y:p.y-3});}else if(h.kind==='per')i13Part(h.o,.26);else if(h.kind==='knot')i13KnotPlay(h.o);
  try{cv.setPointerCapture(e.pointerId);}catch(_){}
  e.preventDefault();e.stopPropagation();
 }
 function i13Move(e){
  if(!i13Hand.on||i13Hand.id!==e.pointerId||DURUM!=='oyun')return;const p=i13Point(e),dx=p.x-i13Hand.x,dy=p.y-i13Hand.y,d=Math.hypot(dx,dy);if(d<4)return;
  const o=i13Hand.o;i13Hand.px=i13Hand.x;i13Hand.py=i13Hand.y;i13Hand.x=p.x;i13Hand.y=p.y;i13Hand.dr+=d;
  if(i13Hand.kind==='dok'&&i13Hand.dr>44){i13Hand.dr=0;i13Weave(o,.14);i13Spark(o.x+50,o.y-80,3,o.sira);}
  else if(i13Hand.kind==='kel'){o.patternOn=false;i13CapturePoint(p.x,p.y);i13Garden(o,p.x,p.y,Math.min(d,70)*.00095,{x:i13Hand.px,y:i13Hand.py});}
  else if(i13Hand.kind==='per')i13Part(o,Math.min(Math.abs(dx),65)*.0028+Math.min(Math.abs(dy),65)*.0008);
  else if(i13Hand.kind==='knot'&&i13Hand.dr>70){i13Hand.dr=0;i13KnotPlay(o);}
  else if(i13Hand.kind==='min'&&i13Hand.dr>65){i13Hand.dr=0;i13Pillow(o,true);}
  e.preventDefault();e.stopPropagation();
 }
 function i13Up(e){if(i13Hand.on&&i13Hand.id===e.pointerId){if(e.type==='pointerup'&&i13Hand.kind==='kel'){if(i13Hand.dr<24)i13Pattern(i13Hand.o,i13Hand.x,i13Hand.y);else if(i13Hand.dr>=70)i13WakeDrawing(i13Hand.o);}i13Hand.on=false;i13Hand.o=null;i13Hand.pathN=0;}}
 addEventListener('pointerdown',i13Down,true);addEventListener('pointermove',i13Move,true);addEventListener('pointerup',i13Up,true);addEventListener('pointercancel',i13Up,true);addEventListener('lostpointercapture',i13Up,true);addEventListener('blur',i13Cancel);addEventListener('pagehide',i13Cancel);
 if(typeof document.addEventListener==='function')document.addEventListener('visibilitychange',()=>{if(document.hidden)i13Cancel();});
 function i13Cancel(){i13Hand.on=false;i13Hand.o=null;i13Hand.id=null;i13Hand.pathN=0;}
 OLAY.on('boyut',i13Cancel);
 OLAY.on('durum',d=>{
  i13Hand.on=false;i13Hand.o=null;
  if(d==='son'||d==='baslik'){if(i13Active&&P.ucus===i13Active){const o=i13Active;if(o.tip==='k13Kurdele')i13FlightEnd(o,true);else{P.ucus=null;P.kilit=0;P.vx=P.vy=0;P.ground=true;}}i13Active=null;}
 });
 function i13Grow(o,dt,height){
  const c=o.cisim,old=c.h;if(o.perchW===undefined)o.perchW=c.w;
  o.growth=lerp(o.growth,o.target,1-Math.exp(-dt*1.65));if(o.target-o.growth<.00005)o.growth=o.target;
  o.growAge=(o.growAge||0)+(o.target>0?dt:0);o.sap=(o.sap||0)+dt*(o.target-o.growth>.015?1.8:.45);
  const target=i13Ease((o.growth-.015)/.82),omega=8.2,damp=.76,wd=omega*Math.sqrt(1-damp*damp),a=(o.fold||0)-target,v=o.foldV||0,b=(v+damp*omega*a)/wd,e=Math.exp(-damp*omega*dt),sn=Math.sin(wd*dt),cs=Math.cos(wd*dt);
  o.fold=target+e*(a*cs+b*sn);o.foldV=e*(v*cs-(damp*omega*b+wd*a)*sn);o.unfurl=i13Clamp(o.fold);o.podOpen=lerp(o.podOpen||0,i13Ease((o.growth-.02)/.64),1-Math.exp(-dt*3.2));
  c.h=height*o.growth;c.w=24+(o.perchW-24)*o.unfurl;c.aktif=o.growth>.06&&c.w>29;c.dy=old-c.h;
 }
 function i13CloudReward(o){if(o.rewardTaken)return;o.rewardTaken=true;o.rewardDelay=7;o.rewardCount++;o.pop=1;i13Spark(o.orbX||o.x,o.orbY||o.y-140,7,o.sira);for(let j=0;j<3;j++)i13Butter(o.x,o.y-140,P.x+70+j*35,P.y-125-j*15,j*2+1,true);i13Pose('hayran',{sure:1.8,x:o.x,y:o.y-180});}
 TUR.kaydet('k13Ponpon',{kur(o){o.pop=0;o.cd=0;o.hits=0;o.done=false;o.growth=0;o.target=0;o.cisim={w:145,h:0,tip:'ustten',aktif:false,dx:0,dy:0};i13Obj.pon.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.cd=Math.max(0,o.cd-dt);o.pop=Math.max(0,o.pop-dt*1.5);i13Grow(o,dt,60+o.sira*14);if(o.growth>.985)o.done=true;},dokun(o){if(DURUM==='oyun')i13Pon(o);},ustune(o){i13Pon(o);},ciz(o,tm){i13Isit();i13DrawPon(o,tm);}});
 TUR.kaydet('k13Dokuma',{kur(o){o.u=0;o.growth=0;o.target=0;o.pop=0;o.near=0;o.auto=0;o.started=false;o.done=false;o.cisim={w:155,h:0,tip:'ustten',aktif:false,dx:0,dy:0};i13Obj.dok.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.pop=Math.max(0,o.pop-dt*1.5);o.target=o.u;i13Grow(o,dt,105);if(i13Near(o,330)){o.near+=dt;o.auto+=dt;if(o.auto>1.15&&o.near>3.5){o.auto=0;i13Weave(o,.14);}if(P.x>o.x-150&&!o.done)i13Weave(o,dt*.65);if(P.x>o.x+270&&!o.done)i13Weave(o,1);}else{o.near=0;o.auto=0;}},ciz(o,tm){i13Isit();i13DrawWeave(o,tm);}});
 TUR.kaydet('k13Minder',{kur(o){o.h=44;o.cloudV=0;o.orbShow=0;o.rewardBloom=0;o.pop=0;o.cd=0;o.wiggle=0;o.hits=0;o.done=false;o.rewardTaken=false;o.rewardDelay=0;o.rewardCount=0;o.orbX=o.x+52;o.orbY=o.y-145;o.wave=0;o.waveDue=-1;o.waveCol=o.sira%4;o.cisim={w:178,h:44,tip:'ustten',guc:690+o.sira*20,aktif:true,dx:0,dy:0};i13Obj.min.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.cd=Math.max(0,o.cd-dt);o.pop=Math.max(0,o.pop-dt*1.25);o.wiggle=Math.max(0,o.wiggle-dt);o.wave=Math.max(0,o.wave-dt*.85);if(o.waveDue>=0&&i13Clock>=o.waveDue){o.waveDue=-1;o.wave=1;}const target=44+Math.sin(i13Clock*1.1+o.sira)*2.3+o.wave*5.5,omega=10.5,damp=.59,wd=omega*Math.sqrt(1-damp*damp),a=o.h-target,v=o.cloudV||0,b=(v+damp*omega*a)/wd,e=Math.exp(-damp*omega*dt),sn=Math.sin(wd*dt),cs=Math.cos(wd*dt);o.h=clamp(target+e*(a*cs+b*sn),29,61);o.cloudV=e*(v*cs-(damp*omega*b+wd*a)*sn);o.cisim.dy=o.cisim.h-o.h;o.cisim.h=o.h;o.orbShow=lerp(o.orbShow||0,o.hits&&!o.rewardTaken?1:0,1-Math.exp(-dt*4));o.rewardBloom=lerp(o.rewardBloom||0,o.rewardCount?1:0,1-Math.exp(-dt*1.4));if(o.rewardTaken){o.rewardDelay-=dt;if(o.rewardDelay<=0)o.rewardTaken=false;}if(o.hits&&!o.rewardTaken&&!P.ucus&&Math.hypot(P.x-o.orbX,P.y-35-o.orbY)<65)i13CloudReward(o);},ustune(o){i13Pillow(o,false);P.vy=-(690+o.sira*20);P.ground=false;P.dj=true;P.buf=0;},ciz(o,tm){i13Isit();i13DrawPillow(o,tm);}});
 TUR.kaydet('k13Kelebek',{kur(o){o.u=0;o.pop=0;o.near=0;o.auto=0;o.path=0;o.lastFly=-99;o.lastEvent=-99;o.done=false;o.pattern=0;o.patternOn=false;o.patternT=0;o.patternNext=0;o.playCount=0;i13Obj.kel.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.pop=Math.max(0,o.pop-dt);i13PatternStep(o,dt);o.nearGlow=lerp(o.nearGlow||0,i13Near(o,420)?1:0,1-Math.exp(-dt*2.5));if(i13Near(o,350)){o.near+=dt;o.auto+=dt;if(o.auto>1.5&&o.near>4){o.auto=0;const j=Math.floor(o.near/1.5)%3,q=o.dallar[j];i13Garden(o,q.x,o.y-q.hedefH-45,.075,null);}if(P.x>o.x+30&&!o.done)i13Garden(o,P.x,P.y-120,dt*.25,null);}else{o.near=0;o.auto=0;}},ciz(o,tm){i13Isit();i13DrawGarden(o,tm);}});
 TUR.kaydet('k13YeniDal',{kur(o){o.growth=0;o.target=0;o.pop=0;o.cisim={w:102,h:0,tip:'ustten',aktif:false,dx:0,dy:0};},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.pop=Math.max(0,o.pop-dt*1.6);i13Grow(o,dt,o.hedefH);},ustune(o){o.pop=1;i13Butter(o.x,o.y-o.cisim.h-30,P.x+80,P.y-100,1+o.sira%2);},ciz(o,tm){i13Isit();i13Branch(o,tm,143);}});
 TUR.kaydet('k13Perde',{kur(o){o.u=0;o.growth=0;o.target=0;o.pop=0;o.sway=0;o.near=0;o.auto=0;o.done=false;o.cisim={w:167,h:0,tip:'ustten',aktif:false,dx:0,dy:0};i13Obj.per.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.u=lerp(o.u,o.target,1-Math.exp(-dt*2.4));o.pop=Math.max(0,o.pop-dt*1.4);o.sway=Math.max(0,o.sway-dt*.75);i13Grow(o,dt,104);o.nearGlow=lerp(o.nearGlow||0,i13Near(o,380)?1:0,1-Math.exp(-dt*2.5));if(i13Near(o,320)){o.near+=dt;o.auto+=dt;if(o.auto>1.1&&o.near>4){o.auto=0;i13Part(o,.14);}if(P.x>o.x-180&&!o.done)i13Part(o,dt*1.1);}else{o.near=0;o.auto=0;}},ciz(o,tm){i13Isit();i13Curtain(o,tm,false);},cizOn(o,tm){i13Curtain(o,tm,true);}});
 TUR.kaydet('k13Kurdele',{kur(o){o.phase='bekle';o.done=false;o.bud={x:o.x-124,y:720,sira:0};o.fx=o.x;o.fy=o.y;o.u=0;o.t=0;o.rings=[{x:nx(515),y:430,done:false,pop:0},{x:nx(540),y:300,done:false,pop:0},{x:nx(565),y:550,done:false,pop:0},{x:nx(590),y:325,done:false,pop:0},{x:nx(615),y:515,done:false,pop:0}];o.adim=(dt,u)=>i13FlightStep(o,dt,u);i13Obj.ride=o;},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;if(!o.done&&o.phase==='bekle'&&!P.ucus&&P.ground&&Math.abs(P.x-o.x)<104)i13FlightStart(o);if(i13Active===o&&P.ucus!==o)i13FlightEnd(o,true);},ciz(o,tm){i13Isit();i13DrawRibbon(o,tm,false);},cizOn(o,tm){i13DrawRibbon(o,tm,true);}});
 TUR.kaydet('k13Ilmek',{kur(o){o.done=false;o.lift=0;o.flash=0;o.cd=0;o.plays=0;o.turn=0;o.target=0;o.growth=0;o.cisim={w:135,h:0,tip:'ustten',aktif:false,dx:0,dy:0};i13Obj.knot.push(o);},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;o.cd=Math.max(0,o.cd-dt);o.flash=Math.max(0,o.flash-dt*.8);i13Grow(o,dt,95+o.sira*16);if(o.done)o.lift=Math.min(2.4,o.lift+dt);else if(!P.ucus&&P.ground&&P.x>o.x+45&&i13Near(o,240))i13KnotPlay(o);},ciz(o,tm){i13Isit();i13DrawKnot(o,tm);}});
 TUR.kaydet('k13Gok',{kur(o){o.phase='';o.done=false;o.risen=false;o.t=0;o.seed={x:o.x+100,y:o.y,sira:1};o.weave=0;o.tapBoost=0;o.giftCount=0;o.lastGift=-99;o.gifts=Array.from({length:12},()=>({on:false,age:0,x:0,y:0,k:0,flash:0}));o.tree=i13TreeBuild();o.skyPlaces=[{x:-275,y:442,s:.82,k:0,a:.95},{x:-445,y:310,s:.34,k:1,a:.58},{x:-104,y:397,s:.30,k:2,a:.65},{x:35,y:382,s:.98,k:1,a:1},{x:165,y:435,s:.35,k:0,a:.65},{x:445,y:325,s:.29,k:1,a:.5},{x:285,y:455,s:.78,k:2,a:.95}];o.cameraFn=()=>{const u=i13Ease((o.t-20)/2.8),cx=lerp(o.x,Number.isFinite(o.fx)?o.fx:o.x,u),half=lerp(365,clamp(W/Math.max(H,1)*145,120,210),u);omDkEkle(cx-half,lerp(155,485,u),cx+half,770);};o.adim=(dt,u)=>i13FinalStep(o,dt,u);i13Obj.fin=o;},guncelle(o,dt){if(!(dt>0)||!Number.isFinite(dt)||DURUM!=='oyun')return;if(!o.phase&&!P.ucus&&P.ground&&Math.abs(P.x-o.x)<125)i13FinalStart(o);if(i13Active===o&&P.ucus!==o){i13Active=null;o.phase='';V13.final=false;}},ciz(o,tm){i13Isit();i13DrawQuilt(o,tm,false);},cizOn(o,tm){i13DrawQuilt(o,tm,true);}});
 TUR.kaydet('k13Ritim',{guncelle(o,dt){o.x=P.x;if(!i13Atlas.ready){if(!i13Atlas.veilField)i13Atlas.veilField=i13VeilField();else i13Isit();}if(window.IP13GARDEN&&typeof IP13GARDEN.isit==='function')IP13GARDEN.isit();if(Number.isFinite(dt))i13PoolStep(Math.min(Math.max(dt,0),.1));},ciz(o,tm){i13PoolBack(tm);},cizOn(o,tm){i13PoolDraw(tm);i13DrawConstellations(tm);}});
 window.IPEK13={
  kopruU(x){let closest=null,d=Infinity;for(let i=0;i<i13Obj.dok.length;i++){const o=i13Obj.dok[i],n=Math.abs(o.x-x);if(n<d){d=n;closest=o;}}return closest?closest.growth||0:0;},
  hedef(){if(V13.final||P.ucus)return null;let best=null;for(let i=0;i<NESNELER.length;i++){const o=NESNELER[i];if(!i13Targets.has(o.tip)||o.done||o.x<P.x-160)continue;if(!best||o.x<best.x)best=o;}return best;},
  isit:i13Isit,
  state(){return{time:i13Clock,active:i13Active?i13Active.tip:null,gesture:i13Hand.on?i13Hand.kind:null,bridge:i13Obj.dok.map(o=>o.u),pillows:i13Obj.min.map(o=>({x:o.x,h:o.h,hits:o.hits,top:o.y-o.h,wave:o.wave,rewards:o.rewardCount})),butterflies:i13Obj.kel.map(o=>o.u),patterns:i13Obj.kel.map(o=>({active:o.patternOn,kind:'growth',plays:o.playCount,plants:o.dallar.map(q=>({x:q.x,growth:q.growth,top:q.y-q.cisim.h}))})),knots:i13Obj.knot.map(o=>({done:o.done,lift:o.lift,plays:o.plays})),curtains:i13Obj.per.map(o=>o.u),flight:i13Obj.ride?{phase:i13Obj.ride.phase,u:i13Obj.ride.u,t:i13Obj.ride.t,x:i13Obj.ride.fx,y:i13Obj.ride.fy,done:i13Obj.ride.done,rings:i13Obj.ride.rings.filter(o=>o.done).length}:null,final:i13Obj.fin?{phase:i13Obj.fin.phase,t:i13Obj.fin.t,weave:i13Obj.fin.weave,risen:i13Obj.fin.risen,done:i13Obj.fin.done,gifts:Math.min(i13Obj.fin.giftCount,12)}:null,pool:{drawFriends:i13Echo.filter(p=>p.on).length,waves:i13Pulse.filter(p=>p.on).length,trail:i13Trail.filter(p=>p.on).length,butterfly:i13Fly.filter(p=>p.on).length,spark:i13Glow.filter(p=>p.on).length},finite:Number.isFinite(P.x)&&Number.isFinite(P.y)&&Number.isFinite(P.vx)&&Number.isFinite(P.vy)};},
  // Deterministic read-only-state diagnostics above; these convenience actions require explicit development flags.
  test(ad,n){if(typeof Q==='undefined'||!Q.has('atla'))return false;if(ad==='dokuma'){const o=i13Obj.dok[n||0];if(o)i13Weave(o,1);}else if(ad==='perde'){const o=i13Obj.per[n||0];if(o)i13Part(o,1);}else if(ad==='kelebek'){const o=i13Obj.kel[n||0];if(o)for(const q of o.dallar)i13Garden(o,q.x,o.y-q.hedefH,1,null);}else if(ad==='minder'){const o=i13Obj.min[n||0];if(o)i13Pillow(o,false);}else if(ad==='ilmek'){const o=i13Obj.knot[n||0];if(o)i13KnotPlay(o);}else if(ad==='desen'){const o=i13Obj.kel[n||0];if(o)i13Pattern(o,o.x,o.y-240);}else if(ad==='ucus')i13FlightStart(i13Obj.ride);else if(ad==='final')i13FinalStart(i13Obj.fin);else return false;return true;}
 };
})();
