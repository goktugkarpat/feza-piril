/* fezapoz13.js — Feza'nın kendi modeliyle tohum dokunuşu, göğe uzanma ve sarılma.
   Normal yürüyüşün yalnız kolları değişir. P.ucus sırasında IP13CHAR tek Feza'yı çizer.
   Görüntü ve fizik ayrı kahramanlar oluşturmaz; B1–12'de bu dosya hiçbir şey yapmaz. */
'use strict';
const IP13FEZA = { el:{x:0,y:0}, el2:{x:0,y:0}, bas:{x:0,y:0} };
const FZ13_UST_ALAN = ['la1','la2','ba1','ba2','arm','hOpen','head','gx','gy','brow','mOpen','mSmile'];
const FZ13 = { dt:0, ad:'', sahip:false, yon:1, don:1, eskiYon:1, w:0, t:0,
  R:Object.assign({},FZ_REST), hedef:Object.assign({},FZ_REST), H:typeof fz12Hedef==='function'?fz12Hedef():null,
  Q:{a_R:null,a_hipY:0,a_hx:0,a_hy:0,a_lidM:1,vy:0,ik:null,ikUst:false,ara:null,a_tilt:0,
    a_noFar:false,a_cl:0,a_kenar:true,a_yaw:0,a_pil:0,a_shine:0,a_isik:0,a_dim:null,a_hw:0},
  ka:[0,0,1],kb:[0,0,1],pt:[0,0],o:{u:1,bak:-.3,sallan:.65,hedef:[25,-40]},
  c:null,x:null,ring:null,rx:null, renderT:-1,upperT:-1,reactT:0,awePulse:0,gazeW:0,gazeGX:0,gazeGY:0,gazeHead:0,reachX:17,reachY:-35,lookY:0,u:0 };
function fz13Actif() { return typeof BOLUM_NO!=='undefined'&&BOLUM_NO===13; }
function fz13Adim(dt,ad,o,ch) {
  if (!fz13Actif()) return;
  FZ13.dt = Number.isFinite(dt)?Math.max(0,Math.min(.05,dt)):0; FZ13.t += FZ13.dt;
  const own = !!P.ucus && !!ad && (!!o.sahip||ad==='yolculuk'||ad==='saril');
  if (own&&!FZ13.sahip) {
    Object.assign(FZ13.R,P.a_R||FZ_REST); FZ13.w = 0; FZ13.yon = P.a_side===-1?-1:1; FZ13.eskiYon=FZ13.yon; FZ13.don=1;FZ13.renderT=-1;
  }
  if (!own&&FZ13.sahip&&P.a_pose&&P.a_pv) {
    fzPack(FZ13.R,P.a_pose); P.a_pv.fill(0); Object.assign(P.a_R,FZ13.R);
    P.a_hx=FZ13.Q.a_hx; P.a_hy=FZ13.Q.a_hy; P.a_hvx=P.a_hvy=0;
  }
  FZ13.sahip = own; FZ13.ad = ad;
  const face=own?(o.yon===-1?-1:1):(P.a_side||1),px=Number.isFinite(o.fx)?o.fx:P.x,py=Number.isFinite(o.fy)?o.fy:P.y;
  const tx=Number.isFinite(o.x)?Math.max(10,Math.min(25,(o.x-px)*face)):18;
  const ty=Number.isFinite(o.y)?Math.max(-57,Math.min(-20,o.y-py)):-35;
  const follow=1-Math.exp(-FZ13.dt*6);FZ13.u+=((Number.isFinite(o.u)?Math.max(0,Math.min(1,o.u)):1)-FZ13.u)*follow;
  FZ13.reachX+=(tx-FZ13.reachX)*follow;FZ13.reachY+=(ty-FZ13.reachY)*follow;
  FZ13.lookY+=((ty+42)/32-FZ13.lookY)*(1-Math.exp(-FZ13.dt*4.5));
  FZ13.w += ((ad?1:0)-FZ13.w)*(1-Math.exp(-FZ13.dt*7));
  FZ13.gazeW=ad==='saril'?0:ch.gazeW||0;FZ13.awePulse=ch.awePulse||0;FZ13.reactT=Number.isFinite(ch.tepkiT)?ch.tepkiT:0;
  const gdx=(ch.gazeX-px)*face,gdy=ch.gazeY-(py-64);
  const gf=1-Math.exp(-FZ13.dt*4.5);
  FZ13.gazeGX+=(Math.max(-1,Math.min(1,gdx/170))-FZ13.gazeGX)*gf;
  FZ13.gazeGY+=(Math.max(-1,Math.min(1,gdy/140))-FZ13.gazeGY)*gf;
  FZ13.gazeHead+=(Math.max(-.31,Math.min(.15,Math.atan2(gdy,Math.abs(gdx)+65)*.22))-FZ13.gazeHead)*gf;
  FZ13.don = Math.min(1,FZ13.don+FZ13.dt/.32);
}
function fz13Bak(R){
  const w=FZ13.gazeW*.88;if(!(w>.002))return;
  R.head+=(FZ13.gazeHead-R.head)*w;R.gx+=(FZ13.gazeGX-R.gx)*w;R.gy+=(FZ13.gazeGY-R.gy)*w;
  R.happy*=Math.max(0,1-FZ13.gazeW*2.5);
  R.brow+=(.38+.4*FZ13.awePulse-R.brow)*w;R.mSmile+=(1-R.mSmile)*w;R.mOpen+=(.07+.25*FZ13.awePulse-R.mOpen)*w;
}
function fz13Ust(tm,ad,o,w) {
  if (!fz13Actif()||!P.a_R||P.ucus) return;
  const R=P.a_R, hip=P.a_hipY, T=FZ13.hedef;
  if(FZ13.upperT===FZ13.t){fz13Eller(R,hip,(P.rx??P.x)+(P.a_ox||0),(P.ry??P.y)+(P.a_oy||0),P.a_side||1);return;}FZ13.upperT=FZ13.t;
  Object.assign(T,R);
  let tx=0,ty=0,fx=0,fy=0, use=false;
  const sn=Math.sin(tm*1.45),wave=.5+.5*Math.sin(tm*.85);
  if (ad==='dokuma') {
    tx=FZ13.reachX+.8*sn;ty=FZ13.reachY-.7*sn;fx=tx-5;fy=ty+6;use=true;
    T.head=.04+Math.max(-.17,Math.min(.15,FZ13.lookY*.14));T.gy=Math.max(-.8,Math.min(.65,FZ13.lookY));T.gx=.7;T.brow=.26+.15*FZ13.u;T.mSmile=1;T.mOpen=.08+.12*FZ13.u;
  } else if(ad==='paylas'){
    const p=Math.sin(Math.max(0,Math.min(1,FZ13.reactT/1.4))*Math.PI);
    tx=13+2*p;ty=-33-5*p;fx=8;fy=-27;use=true;T.head=Math.max(-.14,Math.min(.14,FZ13.lookY*.12));T.gy=Math.max(-.7,Math.min(.65,FZ13.lookY));T.gx=.6;T.brow=.25+.12*p;T.mSmile=1;T.mOpen=.06+.1*p;
  } else if (ad==='perde') {
    tx=18-3*wave;ty=-49+2*sn;fx=11;fy=-36;use=true;T.head=-.17;T.gy=-.75;T.brow=.5;T.mOpen=.15;T.hOpen=.8;
  } else if (ad==='hayran') {
    const wonder=Math.max(FZ13.awePulse,Math.exp(-Math.pow((FZ13.reactT-.38)/.38,2))),r=Math.max(0,Math.min(1,(FZ13.reactT-1.15)/.8)),rest=r*r*(3-2*r);
    tx=15+1.2*sn;ty=-49-2*wave+11*rest;fx=9;fy=-32+4*rest;use=true;T.head=-.24;T.gy=-.98;T.gx=.45+.3*Math.sin(tm*.31);T.brow=.3+.3*wonder;T.mOpen=.07+.24*wonder;T.mSmile=1;T.hOpen=.85;
  } else if (ad==='minder') {
    const fall=Math.max(-1,Math.min(1,(P.vy||0)/300));
    T.la1=1.9+.08*sn-.16*fall;T.la2=.45+.14*Math.max(0,fall);T.ba1=1.4-.08*sn-.12*fall;T.ba2=.4+.1*Math.max(0,fall);T.hOpen=.9;T.mSmile=1;T.mOpen=.12+.13*Math.max(0,-fall);T.gy=-.65+.28*Math.max(0,fall);T.brow=.5;
  }
  else if(!(FZ13.gazeW>.002)){fz13Eller(R,hip,(P.rx??P.x)+(P.a_ox||0),(P.ry??P.y)+(P.a_oy||0),P.a_side||1);return;}
  if (use&&typeof fz12KolIK==='function') {
    fz12KolIK(T,T.hx,hip,T.lean,tx/FZ_SC,ty/FZ_SC,true,1.08,FZ13.ka);
    fz12KolIK(T,T.hx,hip,T.lean,fx/FZ_SC,fy/FZ_SC,false,1.08,FZ13.kb);
    T.la1=FZ13.ka[0];T.la2=FZ13.ka[1];T.ba1=FZ13.kb[0];T.ba2=FZ13.kb[1];T.arm=1.08;T.hOpen=ad==='dokuma'?.45+.4*FZ13.u:.85;
  }
  const z=Math.min(1,w)*(Math.abs(P.vx||0)>80?.7:1);
  for (let i=0;i<FZ13_UST_ALAN.length;i++) {const k=FZ13_UST_ALAN[i];R[k]+=(T[k]-R[k])*z;}
  fz13Bak(R);
  fz13Eller(R,hip,(P.rx??P.x)+(P.a_ox||0),(P.ry??P.y)+(P.a_oy||0),P.a_side||1);
}
function fz13Eller(R,hip,x,y,yon) {
  if (typeof fz12ElYeri!=='function') return;
  fz12ElYeri(R,hip,true,FZ13.pt);IP13FEZA.el.x=x+FZ13.pt[0]*FZ_SC*yon;IP13FEZA.el.y=y+FZ13.pt[1]*FZ_SC;
  fz12ElYeri(R,hip,false,FZ13.pt);IP13FEZA.el2.x=x+FZ13.pt[0]*FZ_SC*yon;IP13FEZA.el2.y=y+FZ13.pt[1]*FZ_SC;
  const by=-.28*R.breath-R.shr,cl=Math.cos(R.lean),sl=Math.sin(R.lean),qx=2.9+1.4*R.head,qy=-23.6+by;
  IP13FEZA.bas.x=x+(R.hx+qx*cl-qy*sl)*FZ_SC*yon;IP13FEZA.bas.y=y+(hip+qx*sl+qy*cl)*FZ_SC;
}
function fz13Tuval() {
  if (FZ13.c) return;
  FZ13.c=document.createElement('canvas');FZ13.ring=document.createElement('canvas');
  FZ13.c.width=FZ13.c.height=FZ13.ring.width=FZ13.ring.height=384;
  FZ13.x=FZ13.c.getContext('2d');FZ13.rx=FZ13.ring.getContext('2d');
}
function fz13Ciz(ctx,tm,ad,o,ch) {
  if (!fz13Actif()||!ctx||!P.ucus||!FZ13.H||typeof fzDraw!=='function') return;
  const R=FZ13.R,T=FZ13.hedef,Q=FZ13.Q,H=FZ13.H,O=FZ13.o;
  Object.assign(T,FZ_REST);T.breath=Math.sin(tm*2.2)*.55;T.mSmile=1;
  const yon=ad==='saril'?(ANNE12.x<P.x?-1:1):(o.yon===-1?-1:1);
  if (yon!==FZ13.yon&&FZ13.don>=.99) {FZ13.eskiYon=FZ13.yon;FZ13.yon=yon;FZ13.don=0;}
  if (ad==='yolculuk') {
    O.bak=-.25;O.sallan=.65;fz12Otur(H,O,tm,T);fz12Uygula(H,T,Q);
    if (ch.binme<.999) fz12OturGecis(T,Q,ch.binme,tm);
    const wonder=.5+.5*Math.sin(tm*.41),sway=Math.sin(tm*1.35);
    T.head-=.06+.08*wonder;T.gy=-.22-.55*wonder;T.gx=.5;T.mOpen=.18+.12*wonder;T.brow=.4;
    T.lean+=.018*sway*ch.binme;T.la1+=.05*sway*ch.binme;T.hOpen=.7;
  } else if (ad==='saril') {
    O.u=ch.u;O.otur=false;O.hedef[0]=Math.max(13,Math.min(27,Math.abs(ANNE12.x-P.x)-6));O.hedef[1]=-46;
    fz12Saril(H,O,tm,T,Q);fz12Uygula(H,T,Q);
  } else {
    fz12Dur(H,tm);fz12Uygula(H,T,Q);
    const sn=Math.sin(tm*1.45),hay=ad==='hayran',u=Math.max(0,Math.min(1,ch.u)),wave=.5+.5*Math.sin(tm*.9),restU=Math.max(0,Math.min(1,(FZ13.reactT-1.15)/.8)),rest=restU*restU*(3-2*restU);
    // Önce tohumu iki avucuyla korur; büyüdükçe elleri ve bakışı onunla yükselir.
    const tx=(hay?16:18+sn)/FZ_SC,ty=(hay?-51-2*wave+11*rest:-29-25*u-.8*sn)/FZ_SC;
    const fx=(hay?9:12-sn)/FZ_SC,fy=(hay?-34+4*rest:-25-23*u+.5*sn)/FZ_SC;
    fz12KolIK(T,T.hx,H.hy,T.lean,tx,ty,true,1.1,FZ13.ka);fz12KolIK(T,T.hx,H.hy,T.lean,fx,fy,false,1.1,FZ13.kb);
    T.la1=FZ13.ka[0];T.la2=FZ13.ka[1];T.ba1=FZ13.kb[0];T.ba2=FZ13.kb[1];T.arm=1.1;
    const wonder=Math.max(FZ13.awePulse,Math.exp(-Math.pow((FZ13.reactT-.38)/.38,2)));
    T.head=hay?-.23-.025*Math.sin(tm*.9):.11-.28*u;T.gy=hay?-.93-.05*wave:.5-1.35*u;T.gx=hay?.45+.3*Math.sin(tm*.31):.65;T.brow=hay?.3+.3*wonder:.35;T.mOpen=hay?.07+.24*wonder:.12+.12*u;T.hOpen=hay?.88:.6;

  }
  if(ad!=='saril')fz13Bak(T);
  // A layered/hug redraw or screenshot at the same simulation time must not
  // advance the joints again. Their rate follows adim, never draw count.
  if(FZ13.renderT!==FZ13.t){const w=1-Math.exp(-FZ13.dt*11);for(let i=0;i<FZ_KEYS.length;i++){const k=FZ_KEYS[i];R[k]+=(T[k]-R[k])*w;}FZ13.renderT=FZ13.t;}
  Q.a_R=R;Q.a_hipY=-Math.max(fzFy(R.lt1,R.lt2),fzFy(R.bt1,R.bt2))+R.bob;
  const blink=((tm+1.5)%3.9+3.9)%3.9,bp=blink<.045?blink/.045:1-(blink-.045)/.095,bl=Math.max(0,Math.min(1,bp));Q.a_lidM=blink<.14?1-bl*bl*(3-2*bl)*.94:1;Q.a_hx=Math.sin(tm*2.4)*.16;Q.a_hy=Math.sin(tm*2.4-.7)*.1;
  Q.a_cl=ad==='yolculuk'?.2*Math.sin(tm*2.3):0;
  const du=FZ13.don,side=du<.5?FZ13.eskiYon:FZ13.yon,wide=1-.14*Math.sin(Math.PI*du);
  const px=Number.isFinite(o.fx)?o.fx:P.x,py=Number.isFinite(o.fy)?o.fy:P.y;
  fz13Eller(R,Q.a_hipY,px,py,side*wide);
  fz13Tuval();const x=FZ13.x,rx=FZ13.rx,k=3,C=FZ13.c,RC=FZ13.ring;
  x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,384,384);x.setTransform(k*FZ_SC*wide,0,0,k*FZ_SC,192,294);
  const oldQ=fzQ,oldKos=fzKos,oldM=fz8M;
  try {fzQ=Q;fzKos=null;if(du>.26&&du<.74&&typeof fzDrawFront==='function')fzDrawFront(x,tm);else fzDraw(x,tm);} finally {fzQ=oldQ;fzKos=oldKos;fz8M=oldM;}
  rx.setTransform(1,0,0,1,0,0);rx.globalCompositeOperation='source-over';rx.clearRect(0,0,384,384);
  rx.drawImage(C,0,0);rx.globalCompositeOperation='source-in';rx.fillStyle='#fff0dc';rx.fillRect(0,0,384,384);rx.globalCompositeOperation='source-over';
  ctx.save();ctx.translate(px,py);ctx.scale(side,1);ctx.globalAlpha=.26;
  ctx.drawImage(RC,-64-.5,-98,128,128);ctx.drawImage(RC,-64+.5,-98,128,128);ctx.drawImage(RC,-64,-98-.5,128,128);ctx.drawImage(RC,-64,-98+.5,128,128);
  ctx.globalAlpha=1;ctx.drawImage(C,-64,-98,128,128);ctx.restore();
}
if(typeof window!=='undefined')window.IP13FEZA=IP13FEZA;
