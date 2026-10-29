/* cosmos14.js — Annemle Yıldız Yolculuğu: kabartmalı, ışık alan gök cisimleri.
   Original code-native cut-paper/gouache illustrations, painted once at startup.
   No shader/noise work, gradients or pixel readbacks occur in the game loop.
   Sky/terrain own placement; this module owns each complete planet and rings. */
'use strict';
const COSMOS14=(()=>{
 const SIZE=1024,R=440,EMPTY=Object.freeze({}),KINDS=['earth','moon','jupiter','uranus'];
 const KEYS=['earth','moon','jupiter','uranus','uranus-ring-back','uranus-ring-front'];
 const FRAME={earth:{x:628,y:626,r:592,ry:577.5,shade:'#102f4b'},jupiter:{x:616,y:640,r:588,ry:588.5,shade:'#493a32'},uranus:{x:627,y:633,r:512,ry:512.5,shade:'#16424d'}};
 const items=Object.create(null),stats={draws:0,loads:0};
 const time=()=>typeof performance!=='undefined'&&performance.now?performance.now():0;
 const PAPER={earth:['#b7e1d5','#70b9c3','#4e7fa2'],moon:['#f2e6c9','#c7c8bf','#858faa'],jupiter:['#f3dfbe','#d3a58f','#8e829d'],uranus:['#c2ecdc','#77c9ce','#5285ae']};
 function oval(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
 function ribbon(c,pts,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(pts[0],pts[1]);c.bezierCurveTo(...pts.slice(2));c.stroke();}
 function land(c,points,color){c.save();c.translate(.018,.025);c.fillStyle='#466f853b';c.beginPath();for(let i=0;i<points.length;i+=2)i?c.lineTo(points[i],points[i+1]):c.moveTo(points[i],points[i+1]);c.closePath();c.fill();c.restore();c.fillStyle=color;c.beginPath();for(let i=0;i<points.length;i+=2)i?c.lineTo(points[i],points[i+1]):c.moveTo(points[i],points[i+1]);c.closePath();c.fill();c.strokeStyle='#f1e9c735';c.lineWidth=.009;c.stroke();}
 function plate(c,points,color){c.fillStyle=color;c.beginPath();for(let i=0;i<points.length;i+=2)i?c.lineTo(points[i],points[i+1]):c.moveTo(points[i],points[i+1]);c.closePath();c.fill();}
 function cloud(c,points,width){c.save();c.translate(.012,.032);ribbon(c,points,'#476f8c35',width*1.12);c.restore();ribbon(c,points,'#f5f0d9',width);c.save();c.translate(-.004,-.009);ribbon(c,points,'#fff9e78c',width*.28);c.restore();}
 function paperBody(key){
  const f=FRAME[key]||{x:512,y:512,r:440,ry:440},cv=document.createElement('canvas');cv.width=key==='jupiter'?1230:key==='moon'?1024:1254;cv.height=key==='jupiter'?1278:key==='moon'?1024:1254;
  const c=cv.getContext('2d'),p=PAPER[key];c.translate(f.x,f.y);c.scale(f.r,f.ry);c.save();c.beginPath();c.arc(0,0,1,0,Math.PI*2);c.clip();
  const base=c.createRadialGradient(-.4,-.45,.06,.18,.2,1.3);base.addColorStop(0,p[0]);base.addColorStop(.6,p[1]);base.addColorStop(1,p[2]);c.fillStyle=base;c.fillRect(-1,-1,2,2);
  if(key==='earth'){
   // Africa, Europe, Arabia and India face the child; broad coherent paper
   // silhouettes remain readable without satellite photography or tiny noise.
   land(c,[-.27,-.22,-.13,-.32,.11,-.3,.26,-.14,.29,.04,.2,.2,.12,.42,-.04,.65,-.17,.49,-.2,.29,-.3,.1,-.32,-.08],'#bbc99a');
   land(c,[-.4,-.59,-.27,-.73,-.07,-.74,.02,-.61,.15,-.58,.14,-.4,-.02,-.31,-.19,-.39,-.3,-.32,-.39,-.45],'#afc797');
   land(c,[.05,-.75,.3,-.84,.59,-.73,.83,-.55,.93,-.3,.78,-.12,.58,-.15,.49,-.28,.35,-.31,.23,-.42,.1,-.4,.17,-.57],'#c5c99b');
   land(c,[.22,-.25,.43,-.2,.52,-.02,.4,.1,.29,-.01],'#e1ce9d');land(c,[.51,-.2,.69,-.1,.61,.23,.53,.03],'#d2c89a');
   land(c,[.27,.36,.32,.38,.27,.61,.22,.56],'#b1c493');land(c,[-.78,-.72,-.64,-.8,-.48,-.67,-.58,-.49,-.73,-.44],'#d3d8af');
   land(c,[-.25,-.14,-.08,-.2,.17,-.16,.22,-.02,.06,.04,-.13,-.02],'#dfcf9f');land(c,[-.16,.15,.08,.07,.19,.2,.09,.42,-.05,.52],'#a1bb91');
   // Small folded highlands sit within the land silhouettes, with pale sunward
   // planes and quiet shadow planes rather than photographic relief noise.
   plate(c,[-.23,-.1,-.12,-.16,-.05,-.13,-.09,-.06],'#eddfb17a');plate(c,[-.12,-.16,-.09,-.06,-.01,-.08,-.05,-.13],'#b5b17d70');
   plate(c,[.18,-.55,.35,-.49,.45,-.39,.27,-.44],'#e8dcad');plate(c,[.35,-.49,.45,-.39,.57,-.34,.5,-.44],'#a9b19077');
   plate(c,[.04,.1,.12,.16,.09,.34,.04,.27],'#d6d5a075');plate(c,[.04,.1,.04,.27,-.015,.35,-.025,.18],'#7d9e8370');
   ribbon(c,[-.19,-.38,-.16,-.42,-.08,-.43,-.02,-.4],'#e7e3b587',.009);ribbon(c,[.31,-.3,.39,-.28,.42,-.24,.44,-.2],'#f5e3b476',.009);
   for(let j=0;j<5;j++)ribbon(c,[-.91,.15+j*.15,-.55,-.02+j*.15,.29,.15+j*.15,.86,.01+j*.15],'#d9eee330',.013);
   cloud(c,[-.83,-.3,-.58,-.47,-.35,-.43,-.12,-.4],.065);cloud(c,[.27,-.63,.5,-.64,.67,-.54,.81,-.36],.058);
   cloud(c,[-.6,.37,-.38,.27,-.26,.27,-.08,.35],.06);cloud(c,[.35,.32,.54,.29,.71,.35,.79,.48],.05);
   ribbon(c,[-.63,-.31,-.49,-.38,-.32,-.34,-.23,-.36],'#fffced',.022);ribbon(c,[-.39,.33,-.29,.3,-.2,.33,-.14,.35],'#fffced',.02);
  }else if(key==='moon'){
   oval(c,-.28,.14,.49,.53,'#a1abb431');oval(c,.45,-.37,.31,.35,'#929eb127');
   const craters=[[-.48,-.35,.2],[-.12,-.6,.11],[.34,-.43,.16],[.56,-.04,.12],[.1,.1,.24],[-.43,.38,.13],[.36,.52,.17],[-.1,.62,.08],[-.73,.02,.075],[.09,-.25,.065],[.67,.34,.055],[-.32,-.02,.07]];
   for(let j=0;j<craters.length;j++){const [x,y,r]=craters[j];oval(c,x+.012,y+.02,r*1.07,r*.82,'#7887a839');oval(c,x,y,r,r*.75,'#e2dcc0');oval(c,x+.018,y+.014,r*.77,r*.55,'#9da4ac');plate(c,[x-r*.54,y-r*.23,x-r*.12,y-r*.45,x+r*.38,y-r*.3,x+r*.04,y+r*.03],'#bac0b8');plate(c,[x+r*.04,y+r*.03,x+r*.38,y-r*.3,x+r*.7,y+r*.14,x+r*.27,y+r*.45],'#8594aa6b');c.strokeStyle='#f9edd0';c.lineWidth=.014+(j%3)*.003;c.beginPath();c.ellipse(x,y,r*.91,r*.68,0,Math.PI*(.82+j%3*.035),Math.PI*1.85);c.stroke();if(r>.12)ribbon(c,[x-r*.65,y+r*.44,x-r*.2,y+r*.66,x+r*.24,y+r*.59,x+r*.61,y+r*.39],'#7e8caa52',.009);}
   plate(c,[-.75,.1,-.46,.02,-.29,.19,-.54,.28],'#dbe0c52b');plate(c,[.28,-.7,.5,-.57,.47,-.35,.3,-.48],'#f5eccd35');
   ribbon(c,[-.82,.56,-.58,.62,-.27,.74,-.05,.81],'#e5dfc56b',.025);
  }else if(key==='jupiter'){
   const colors=['#e9d7b9','#dbc1a2','#b58f88','#f1debb','#d3a18c','#c18b7e','#ecd5b1','#b79aa3','#e7c5a0','#d1a18d','#f1dfbf','#b18c8e','#dfb596','#f1d9b6'];
   for(let j=0;j<14;j++){const y=-1.03+j*.154,h=.1+(j%3)*.028;c.fillStyle=colors[j];c.beginPath();c.moveTo(-1.1,y);c.bezierCurveTo(-.6,y+.07,.25,y-.045,1.1,y+.025);c.lineTo(1.1,y+h);c.bezierCurveTo(.25,y+h-.045,-.6,y+h+.07,-1.1,y+h);c.closePath();c.fill();ribbon(c,[-1.02,y+.015,-.52,y+.08,.35,y-.035,1.03,y+.035],'#f8e6c55c',.012);}
   for(let j=0;j<5;j++){const y=-.69+j*.3;ribbon(c,[-.8,y,-.31,y+.1,.1,y-.09,.78,y+.035],j%2?'#f4dfbf6b':'#a9798059',.025);}
   // Long tapered paper curls share the existing bands; they add eddies rather
   // than a second texture layer or a concentric printed storm symbol.
   const eddies=[[-.57,-.56,.15],[.38,-.31,.12],[-.33,.05,.18],[-.45,.52,.13],[.5,.67,.14]];
   for(let j=0;j<eddies.length;j++){const [x,y,s]=eddies[j];c.fillStyle=j%2?'#efd4b16b':'#ad85915a';c.beginPath();c.moveTo(x-s*1.6,y);c.bezierCurveTo(x-s*.3,y-s*.65,x+s*1.5,y-s*.4,x+s*1.7,y+s*.12);c.bezierCurveTo(x+s*.45,y-s*.13,x-s*.2,y+s*.27,x-s*1.6,y);c.fill();ribbon(c,[x-s,y-s*.02,x-s*.3,y-s*.27,x+s*.7,y-s*.15,x+s*1.1,y+s*.02],'#fae5bc5c',.008);}
   c.save();c.translate(.31,.28);c.rotate(-.12);oval(c,0,.015,.31,.155,'#9e747c');oval(c,-.012,-.012,.286,.13,'#d4967b');ribbon(c,[-.24,.025,-.15,-.1,.14,-.09,.23,.004],'#f4ce9e',.027);ribbon(c,[-.18,.035,-.06,.105,.2,.045,.14,-.012],'#b97874',.025);ribbon(c,[-.12,-.01,-.04,-.055,.08,-.043,.11,-.006],'#e6b38b',.019);c.restore();
   c.save();c.translate(.31,.28);c.rotate(-.12);plate(c,[-.19,.02,-.075,-.055,.075,-.058,.2,-.005,.085,.005,-.06,-.011],'#efc0928c');plate(c,[-.12,.065,-.03,.035,.13,.023,.19,.013,.105,.07,-.035,.09],'#a96f7969');c.restore();
  }else{
   c.save();c.rotate(-1.08);for(let j=0;j<10;j++){const y=-.85+j*.19;ribbon(c,[-1.1,y,-.55,y+.055,.42,y-.04,1.1,y+.018],j%3===0?'#e8f2da66':j%2?'#6cb8c665':'#a3dfd65c',.065+j%3*.018);}c.restore();
   plate(c,[-.78,-.43,-.25,-.78,.24,-.77,-.15,-.3],'#e1eddb1c');plate(c,[-.15,-.3,.24,-.77,.57,-.42,.14,.2],'#c5efde1c');plate(c,[.14,.2,.57,-.42,.83,.09,.44,.64],'#417caa13');
  }
  // Tactile print flecks and broad paper-fold shading are baked once, never
  // sprayed through the play space and never generated by a frame renderer.
  for(let j=0;j<1100;j++){const a=Math.sin(j*127.1+key.length)*43758.5453,b=Math.sin(j*71.7+3)*16839.47,x=(a-Math.floor(a))*2-1,y=(b-Math.floor(b))*2-1;c.fillStyle=j%3?'#fff8dc12':'#334e6f0b';c.fillRect(x,y,.0015+(j%4)*.0007,.0012);}
  const shade=c.createLinearGradient(-.85,-.5,.95,.55);shade.addColorStop(0,'#fff9df2b');shade.addColorStop(.48,'#fff8e500');shade.addColorStop(1,'#334c7c5e');c.fillStyle=shade;c.fillRect(-1,-1,2,2);c.restore();c.strokeStyle='#fff4d766';c.lineWidth=.012;c.beginPath();c.arc(0,0,.99,0,Math.PI*2);c.stroke();return cv;
 }
 function paperRings(front){const cv=document.createElement('canvas');cv.width=1800;cv.height=550;const c=cv.getContext('2d');c.translate(900,275);const colors=['#d8e4cf','#c0cfdc','#ede2cd','#a5c6ce'];for(let i=0;i<14;i++){c.strokeStyle=colors[i%4];c.globalAlpha=i%4===0?.75:.48;c.lineWidth=i%4===0?7:3.5;c.beginPath();c.ellipse(0,0,677+i*9,147+i*1.9,0,front?0:Math.PI,front?Math.PI:Math.PI*2);c.stroke();}c.globalAlpha=.7;for(let j=0;j<9;j++){const a=(front?0:Math.PI)+(j+.4)/9*Math.PI,rx=699+j%3*35,ry=152+j%3*7;oval(c,Math.cos(a)*rx,Math.sin(a)*ry,1.8,1.2,'#f8efda');}return cv;}
 function ensure(key){
  if(items[key])return items[key].promise;
  const state={key,img:null,settled:false,ready:false,error:null,start:time(),ms:0,promise:null};items[key]=state;
  state.promise=new Promise(resolve=>{
   try{if(typeof document==='undefined'||!document.createElement)throw Error('Canvas unavailable');state.img=key.startsWith('uranus-ring-')?paperRings(key.endsWith('front')):paperBody(key);stats.loads++;state.ready=!!state.img.width;}catch(e){state.error='Illustrated planet canvas unavailable';state.ready=false;}state.settled=true;state.ms=Math.max(0,time()-state.start);resolve(state.ready);
  });return state.promise;
 }
 function needed(kind){return kind==='uranus'?['uranus','uranus-ring-back','uranus-ring-front']:[kind];}
 function ready(kind){
  if(kind!==undefined&&!KINDS.includes(kind))return false;
  const list=kind===undefined?KEYS:needed(kind);for(let i=0;i<list.length;i++)if(!items[list[i]]||!items[list[i]].ready)return false;return true;
 }
 function warm(kind){
  const list=KINDS.includes(kind)?needed(kind):KEYS;
  for(let i=0;i<list.length;i++)if(!items[list[i]]){ensure(list[i]);break;}
  return ready(KINDS.includes(kind)?kind:undefined);
 }
 function loadAssets(){return Promise.all(KEYS.map(ensure)).then(results=>results.every(Boolean));}
 function twinkles(ctx,kind,r,tm,tilt){
  const t=Number.isFinite(tm)?tm:0,sz=Math.max(.8,Math.min(3,r*.012)),color=kind==='jupiter'?'#ffe8bd':kind==='uranus'?'#e2d6f2':'#d6f3ed';
  ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=.65;
  for(let i=0;i<3;i++){const a=-2.45+i*2.12,peak=Math.pow(.5+.5*Math.sin(t*.83+i*2.17),6);if(peak<.035)continue;
   let x=Math.cos(a)*r*1.035,y=Math.sin(a)*r*1.035;if(kind==='uranus'){const rx=r*1.57,xx=Math.cos(a)*rx,yy=Math.sin(a)*rx*.225;x=xx*Math.cos(tilt)-yy*Math.sin(tilt);y=xx*Math.sin(tilt)+yy*Math.cos(tilt);if(Math.hypot(x,y)<r*1.035)continue;}
   ctx.globalAlpha*=.16+peak*.43;ctx.beginPath();ctx.moveTo(x-sz,y);ctx.lineTo(x+sz,y);ctx.moveTo(x,y-sz*1.3);ctx.lineTo(x,y+sz*1.3);ctx.stroke();ctx.fillRect(x-.45,y-.45,.9,.9);ctx.globalAlpha/=(.16+peak*.43);
  }ctx.restore();
 }
 function draw(ctx,kind,cx,cy,r,tm,options){
  if(!ctx||!KINDS.includes(kind)||!Number.isFinite(cx)||!Number.isFinite(cy)||!Number.isFinite(r)||r<=0||!ready(kind))return false;
  const o=options||EMPTY,rot=Number.isFinite(o.rotation)?o.rotation:0,tilt=Number.isFinite(o.ringTilt)?o.ringTilt:-1.08,s=r/R,size=SIZE*s;
  ctx.save();ctx.translate(cx,cy);
  if(kind==='uranus'&&o.ring!==false){ctx.save();ctx.rotate(tilt);ctx.drawImage(items['uranus-ring-back'].img,-900*s,-275*s,1800*s,550*s);ctx.restore();}
  ctx.save();if(rot)ctx.rotate(rot);if(o.atmosphere===false||FRAME[kind]){ctx.beginPath();ctx.arc(0,0,r*(o.atmosphere===false?1:1.018),0,Math.PI*2);ctx.clip();}
  if(FRAME[kind]){const img=items[kind].img,f=FRAME[kind],k=r/f.r;
   // Original illustrated paper globes retain the accepted framing and slight
   // oblateness. No generated photograph is loaded or drawn by this module.
   ctx.fillStyle=f.shade;ctx.beginPath();ctx.ellipse(0,0,Math.max(.01,r-1),Math.max(.01,r*f.ry/f.r-1),0,0,Math.PI*2);ctx.fill();
   ctx.drawImage(img,-f.x*k,-f.y*k,img.width*k,img.height*k);
  }else ctx.drawImage(items[kind].img,-size*.5,-size*.5,size,size);ctx.restore();
  if(kind==='uranus'&&o.ring!==false){ctx.save();ctx.rotate(tilt);ctx.drawImage(items['uranus-ring-front'].img,-900*s,-275*s,1800*s,550*s);ctx.restore();}
  if(o.magic!==false&&(kind==='earth'||kind==='jupiter'||kind==='uranus'))twinkles(ctx,kind,r,tm,tilt);
  ctx.restore();stats.draws++;return true;
 }
 function info(){
  const loaded=KEYS.filter(k=>items[k]&&items[k].ready),pixels=loaded.reduce((n,k)=>n+items[k].img.width*items[k].img.height,0);
  return{ready:KINDS.filter(k=>ready(k)),pending:KEYS.filter(k=>items[k]&&!items[k].settled),errors:KEYS.filter(k=>items[k]&&items[k].error).map(k=>({key:k,error:items[k].error})),images:loaded.length,pixels,nominalRGBABytes:pixels*4,loads:stats.loads,draws:stats.draws,loadMS:loaded.map(k=>({kind:k,ms:items[k].ms})),runtimeShaderWork:false};
 }
 return{draw,warm,ready,loadAssets,info,urls:Object.freeze([])};
})();
if(typeof window!=='undefined')window.COSMOS14=COSMOS14;
