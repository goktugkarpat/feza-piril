/* cosmos14.js — Annemle Yıldız Yolculuğu: kabartmalı, ışık alan gök cisimleri.
   Local sprites combine original shader artwork with generated globe artwork.
   No shader/noise work, gradients or pixel readbacks occur in the game loop.
   Sky/terrain own placement; this module owns each complete planet and rings. */
'use strict';
const COSMOS14=(()=>{
 const SIZE=1024,R=440,EMPTY=Object.freeze({}),KINDS=['earth','moon','jupiter','uranus'];
 const KEYS=['earth','moon','jupiter','uranus','uranus-ring-back','uranus-ring-front'];
 const FRAME={earth:{x:628,y:626,r:592,ry:577.5,shade:'#102f4b'},jupiter:{x:616,y:640,r:588,ry:588.5,shade:'#493a32'},uranus:{x:627,y:633,r:512,ry:512.5,shade:'#16424d'}};
 const items=Object.create(null),stats={draws:0,loads:0};
 const url=key=>'assets/space14/'+(key==='earth'?'earth-globe-v1.png':key==='jupiter'?'jupiter-globe-v1.png':key==='uranus'?'uranus-globe-v1.png':'cosmos-'+key+'.png');
 const time=()=>typeof performance!=='undefined'&&performance.now?performance.now():0;
 function ensure(key){
  if(items[key])return items[key].promise;
  const state={key,img:null,settled:false,ready:false,error:null,start:time(),ms:0,promise:null};items[key]=state;
  state.promise=new Promise(resolve=>{
   if(typeof Image==='undefined'){state.error='Image unavailable';state.settled=true;resolve(false);return;}
   const im=new Image();state.img=im;stats.loads++;
   function finish(ok){if(state.settled)return;state.settled=true;state.ready=!!ok;state.ms=Math.max(0,time()-state.start);if(!ok)state.error='Local planet image unavailable';resolve(state.ready);}
   im.onload=()=>{if(typeof im.decode==='function'){try{Promise.resolve(im.decode()).then(()=>finish(im.width>0),()=>finish(im.width>0));}catch(e){finish(im.width>0);}}else finish(im.width>0);};
   im.onerror=()=>finish(false);im.decoding='async';im.src=url(key);
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
   // Generated cutouts retain their original PNG alpha. A matching dark body
   // undercoat prevents background stars/structures bleeding through the globe.
   // The slight original oblateness is retained, never stretched to a circle.
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
 return{draw,warm,ready,loadAssets,info,urls:Object.freeze(KEYS.map(url))};
})();
if(typeof window!=='undefined')window.COSMOS14=COSMOS14;
