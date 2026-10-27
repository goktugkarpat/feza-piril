/* Anneyle gölet keşfi: ördekleri besle, nilüferleri aç, kuşları göğe uğurla.
   Yazısız, kayıpsız; her dokunuş bir canlı tepki ve üç ayrı sahne. */
'use strict';
(() => {
  const renk=['#ffa5b5','#f8df84','#bc9de8','#8bd4ce','#f4b47e'];
  let aktif=null, isaret=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
  const dalga=(t,i)=>Math.sin(t*1.4+i*1.2);
  function el(x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
  function cizgi(x1,y1,x2,y2,c,w){g.strokeStyle=c;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  function yildiz(x,y,r,c){g.fillStyle=c;g.beginPath();g.moveTo(x,y-r);g.quadraticCurveTo(x+r*.23,y-r*.23,x+r,y);g.quadraticCurveTo(x+r*.23,y+r*.23,x,y+r);g.quadraticCurveTo(x-r*.23,y+r*.23,x-r,y);g.quadraticCurveTo(x-r*.23,y-r*.23,x,y-r);g.fill();}
  function ses(v){if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx('parilti',v);}catch(_) {}}
  function emit(ad,o,ek){OLAY.emit(ad,Object.assign({o,asama:o.kg12.faz},ek||{}));}
  function temizle(){isaret=null;if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
  function konum(e){const r=cv.getBoundingClientRect();return{x:cam.x+(e.clientX-r.left)*DPR/S,y:cam.y+(e.clientY-r.top)*DPR/S};}
  function ye(e){if(e.cancelable)e.preventDefault();e.stopPropagation();}
  function hedef(o,i,t){const k=o.kg12;
    if(k.faz===0){const base={x:o.x-195+i*125,y:o.y-125+dalga(t,i)*3};
      // Yalnız tutulan ördek, gölet sınırları içinde parmağın peşinden gelir.
      // Bırakınca beslendiği yerde kısa bir an kalır ve yuvasına yumuşak döner.
      if(isaret&&isaret.i===i&&isaret.surukle)return{x:isaret.x,y:isaret.y};
      const bekleyen=k.sira.find(z=>z.i===i&&z.bes);if(bekleyen)return{x:bekleyen.bes.x,y:bekleyen.bes.y};
      if(k.anim===i&&k.bes&&k.bes.i===i){const a=1-ease((k.t-.85)/.6);return{x:base.x+(k.bes.x-base.x)*a,y:base.y+(k.bes.y-base.y)*a};}
      return base;}
    if(k.faz===1)return{x:o.x-220+i*110,y:o.y-150+dalga(t,i)*2};
    return{x:o.x-200+i*100,y:o.y-205+Math.sin(t*1.6+i)*8};
  }
  function basla(o){if(aktif||o.done||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
    const k=o.kg12;aktif=o;k.aktif=true;k.faz=0;k.gor=[false,false,false,false,false];k.sira=[];k.anim=-1;k.bes=null;k.t=0;k.bekle=0;k.idle=0;k.yardimN=0;
    // Takipçinin son çizilen konumundan başla; etkileşimleri bekletme.
    k.anneBasX=typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.hazir&&Number.isFinite(ANNE12.x)?ANNE12.x:P.x+64;k.anneT=0;
    P.ucus=o;P.x=P.rx=o.x-290;P.y=P.ry=o.y;k.prX=P.x+50;k.prY=P.y-130;P.vx=P.vy=P.buf=P.kilit=P.fade=0;temizle();emit('kampusGoletBasla',o);}
  function bitir(o,tamam){const k=o.kg12;
    if(P.ucus===o){P.ucus=null;P.x=P.rx=o.x-290;P.y=P.ry=o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.kilit=P.air=0;P.ground=true;P.dj=true;P.f=1;}
    k.aktif=false;k.sira.length=0;if(aktif===o)aktif=null;temizle();
    if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
    if(typeof D!=='undefined'){D.x=P.x-65;D.y=P.y-110;D.vx=D.vy=0;}
    if(tamam&&!o.done){o.done=true;o.tk.bitti=true;emit('kampusGoletBitti',o);}else if(!tamam&&!o.done)k.faz=-1;
  }
  function dokun(o,i){const k=o.kg12,n=k.faz===0?4:5;if(!k.aktif||k.faz>2||k.anim>=0||k.bekle>0||i<0||i>=n||k.gor[i])return false;
    k.gor[i]=true;k.anim=i;k.t=0;k.idle=0;ses(.55);emit('kampusGoletDokun',o,{i});return true;}
  function sirala(o,i,bes){const k=o.kg12;if(i<0||k.gor[i]||k.sira.some(z=>z.i===i))return;
    if(k.anim>=0||k.sira.length){k.sira.push({i,bes});k.idle=0;ses(.22);}else if(dokun(o,i))k.bes=bes;}
  // Kesikli pointermove örnekleri arasında kalan kuşları da yakala.
  function ruzgarParca(o,a,b,aday){const dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,bul=[];
    for(let i=0;i<5;i++){const k=o.kg12;if(k.gor[i]||k.sira.some(z=>z.i===i)||aday.includes(i))continue;
      const q=hedef(o,i,k.saat),u=d2?clamp(((q.x-a.x)*dx+(q.y-a.y)*dy)/d2,0,1):0;
      if(Math.hypot(q.x-a.x-dx*u,q.y-a.y-dy*u)<=58)bul.push({i,u});}
    bul.sort((a,b)=>a.u-b.u);for(const v of bul)aday.push(v.i);}
  function bas(e){const o=aktif;if(!o||DURUM!=='oyun'||e.target!==cv||isaret||e.pointerType==='mouse'&&e.button!==0)return;
    const k=o.kg12;if(k.faz>2||k.bekle>0||k.sira.length>=5)return;const p=konum(e),n=k.faz===0?4:5;let sec=-1,en=Infinity;
    // Önce bütün fiziksel hedeflerin en yakınını bul. Seçilmiş veya sıradaki
    // hedefin kenarı komşu hedefe dönüşmemeli.
    for(let i=0;i<n;i++){const q=hedef(o,i,k.saat),d=Math.hypot(p.x-q.x,p.y-q.y);if(d<en){en=d;sec=i;}}
    const dolu=sec>=0&&(k.gor[sec]||k.sira.some(z=>z.i===sec));
    if(k.faz===2){if(en>82&&(Math.abs(p.x-o.x)>310||p.y<o.y-320||p.y>o.y-110))return;
      ye(e);k.idle=0;isaret={id:e.pointerId,i:en<=82&&!dolu?sec:-1,x0:p.x,y0:p.y,x:p.x,y:p.y,surukle:false,aday:[],iz:[p]};
      try{cv.setPointerCapture(e.pointerId);}catch(_){} return;}
    if(en>82||dolu)return;ye(e);k.idle=0;const q=hedef(o,sec,k.saat);isaret={id:e.pointerId,i:sec,x:q.x,y:q.y,x0:p.x,y0:p.y,dx:q.x-p.x,dy:q.y-p.y,surukle:false};try{cv.setPointerCapture(e.pointerId);}catch(_){} }
  function sur(e){if(!isaret||!aktif||DURUM!=='oyun'||e.pointerId!==isaret.id)return;const k=aktif.kg12;if(k.faz!==0&&k.faz!==2)return;const p=konum(e);if(!Number.isFinite(p.x)||!Number.isFinite(p.y))return;ye(e);
    if(k.faz===2){const a={x:isaret.x,y:isaret.y};if(Math.hypot(p.x-isaret.x0,p.y-isaret.y0)>12)isaret.surukle=true;
      if(isaret.surukle){if(isaret.iz.length===1)ruzgarParca(aktif,{x:isaret.x0,y:isaret.y0},p,isaret.aday);else ruzgarParca(aktif,a,p,isaret.aday);
        isaret.iz.push(p);if(isaret.iz.length>12)isaret.iz.shift();}isaret.x=p.x;isaret.y=p.y;k.idle=0;return;}
    if(Math.hypot(p.x-isaret.x0,p.y-isaret.y0)>12)isaret.surukle=true;
    isaret.x=clamp(p.x+isaret.dx,aktif.x-250,aktif.x+250);isaret.y=clamp(p.y+isaret.dy,aktif.y-165,aktif.y-85);aktif.kg12.idle=0;}
  function son(e){if(!isaret||!aktif||e.pointerId!==isaret.id)return;ye(e);const p=isaret,i=p.i,o=aktif,k=o.kg12;isaret=null;if(e.type!=='pointerup')return;
    if(k.faz===2&&p.surukle){for(const j of p.aday)sirala(o,j,null);return;}
    if(i<0)return;const bes=k.faz===0&&p.surukle?{i,x:p.x,y:p.y}:null;sirala(o,i,bes);}
  addEventListener('pointerdown',bas,true);addEventListener('pointermove',sur,true);addEventListener('pointerup',son,true);addEventListener('pointercancel',son,true);
  cv.addEventListener('lostpointercapture',e=>{if(isaret&&isaret.id===e.pointerId)isaret=null;});
  addEventListener('blur',()=>{isaret=null;});addEventListener('pagehide',()=>{isaret=null;});document.addEventListener('visibilitychange',()=>{if(document.hidden)isaret=null;});
  addEventListener('keydown',e=>{if(!aktif||DURUM!=='oyun'||e.repeat||e.target&&/^(BUTTON|INPUT|SELECT|TEXTAREA|A)$/.test(e.target.tagName))return;
    if(!/^(Space|Enter|KeyE|Digit[1-5])$/.test(e.code))return;const k=aktif.kg12,n=k.faz===0?4:5;let i=/^Digit/.test(e.code)?Number(e.code.slice(-1))-1:k.gor.slice(0,n).findIndex(v=>!v);if(i>=0&&dokun(aktif,i))ye(e);},true);
  OLAY.on('durum',d=>{isaret=null;if(aktif&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')bitir(aktif,false);});
  // İpucu ve geri dönüşte hedef değişse bile Pırıl sınırlı hızla uçar.
  function pirilAdim(o,dt){const k=o.kg12;let x=P.x+50,y=P.y-130;
    if(k.faz===3){x=P.x-65;y=P.y-110;}
    else if(k.idle>=8){const n=k.faz===0?4:5,i=k.gor.slice(0,n).findIndex(v=>!v);if(i>=0){const q=hedef(o,i,k.saat);x=q.x-60;y=q.y-65;}}
    const dx=x-k.prX,dy=y-k.prY,d=Math.hypot(dx,dy),u=d>0?Math.min(1,220*dt/d):0;k.prX+=dx*u;k.prY+=dy*u;
  }
  function guncelle(o,dt){const k=o.kg12;if(DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);k.saat+=dt;
    if(!k.aktif){if(!o.done&&!aktif&&!P.ucus&&P.ground&&P.x>o.x-370&&P.x<o.x-160&&Math.abs(P.y-o.y)<100)basla(o);return;}
    k.anneT+=dt;pirilAdim(o,dt);
    if(typeof omDikkat==='function'&&typeof omDkEkle==='function')omDikkat('kampusGolet',1.5,k.kameraFn,1,((typeof W==='number'&&typeof H==='number'&&H>0&&W/H<.55)?Math.max(.34,Math.min(.48,.93*W/H)):.48));
    if(k.faz===3){k.bekle-=dt;if(k.bekle<=0)bitir(o,true);return;}
    if(k.anim>=0){k.t+=dt;if(k.t>=1.45){k.anim=-1;k.bes=null;k.t=0;const n=k.faz===0?4:5;if(k.gor.slice(0,n).every(Boolean))k.bekle=1.1;}return;}
    if(k.bekle>0){k.bekle-=dt;if(k.bekle<=0){isaret=null;k.faz++;k.sira.length=0;k.gor=[false,false,false,false,false];k.idle=0;emit('kampusGoletAsama',o);ses(.8);if(k.faz===3)k.bekle=4;}return;}
    if(isaret)return;
    if(k.sira.length){const p=k.sira.shift();if(dokun(o,p.i))k.bes=p.bes;return;}
    k.idle+=dt;
    // Önce Pırıl bir hedefe süzülür; uzun süre yanıt gelmezse nazikçe bir adımda yardımcı olur.
    if(k.idle>=(k.yardimN?15:24)){
      const n=k.faz===0?4:5,i=k.gor.slice(0,n).findIndex(v=>!v);
      if(i>=0&&dokun(o,i)){k.yardimN++;emit('kampusGoletYardim',o,{i});}
    }
  }
  function ordek(x,y,t,bes,u){const bob=dalga(t,x*.01)*2;g.save();g.translate(x,y+bob);el(0,4,30,16,'#fff0c8');el(-8,-4,18,15,'#fff5d8');el(13,-11,13,13,'#fff5d8');el(16,-13,2,2,'#433c35');g.fillStyle='#edaa5e';g.beginPath();g.moveTo(24,-9);g.lineTo(34,-5);g.lineTo(23,-2);g.fill();el(-8,3,14,7,'#f3dca6');
    if(bes){for(let j=0;j<4;j++){const f=clamp(u-j*.08,0,1);el(28+Math.cos(j*1.7)*f*18,-22+f*22,2,2,'#f9d37a');}}g.restore();}
  function nilufer(x,y,t,ac,u,col){el(x,y+9,35,12,'#86b887');el(x-10,y+8,19,8,'#add099');const a=ac?ease(u):0.13;for(let j=0;j<5;j++){const an=j*Math.PI*2/5;g.save();g.translate(x+Math.sin(an)*11*a,y-1+Math.cos(an)*5*a);g.rotate(an);el(0,-9-7*a,6+2*a,13,col);g.restore();}el(x,y-2,6,5,'#ffe9a0');}
  function kus(x,y,t,uc,u,col){const rise=uc?ease(u)*110:0;g.save();g.translate(x,y-rise);const flap=Math.sin(t*9)*.25;el(0,0,15,9,col);g.save();g.rotate(flap);el(-5,-5,11,5,'#fff4df');g.restore();el(12,-3,7,7,col);el(14,-5,1.5,1.5,'#543e3b');g.fillStyle='#eeb875';g.beginPath();g.moveTo(18,-3);g.lineTo(24,0);g.lineTo(18,2);g.fill();g.restore();}
  function ciz(o,t){const k=o.kg12;if(o.x+450<cam.x||o.x-450>cam.x+VW)return;g.save();
    // Görünür su, arka planın göletidir. Bu çok hafif renk ve küçük ışık izleri
    // yalnızca oyun alanını sezdirir; etkileşim halkaları daha belirgindir.
    el(o.x,o.y-70,340,65,'rgba(112,190,190,.08)');el(o.x,o.y-85,307,47,'rgba(195,235,220,.06)');
    for(let j=0;j<9;j++){const x=o.x-250+j*65;el(x,o.y-65+dalga(t,j)*5,16+Math.sin(t+j)*4,1.5,'rgba(255,255,240,.28)');}
    if(k.aktif&&k.faz<3){const n=k.faz===0?4:5;for(let i=0;i<n;i++){const p=hedef(o,i,t),v=k.gor[i],u=k.anim===i?clamp(k.t/1.45,0,1):v?1:0;
      if(k.faz===0)ordek(p.x,p.y,t,v,u);else if(k.faz===1)nilufer(p.x,p.y,t,v,u,renk[i]);else kus(p.x,p.y,t,v,u,renk[i]);
      if(!v){g.save();const sirada=k.sira.some(z=>z.i===i)||(k.faz===2&&isaret&&isaret.aday&&isaret.aday.includes(i)),yardim=k.idle>=8&&i===k.gor.slice(0,n).findIndex(z=>!z);g.globalAlpha=(sirada?.9:yardim?.82:.48)+.08*Math.sin(t*3+i);g.strokeStyle=sirada?'#ffe28a':'#fffbe1';g.lineWidth=sirada||yardim?5:3;g.beginPath();g.ellipse(p.x,p.y,(sirada||yardim?50:43)+Math.sin(t*2+i)*3,sirada||yardim?37:31,0,0,Math.PI*2);g.stroke();
        if(yardim)for(let j=0;j<3;j++){const a=t*1.2+j*Math.PI*2/3;yildiz(p.x+Math.cos(a)*53,p.y+Math.sin(a)*40,4,'#fff7bd');}g.restore();}
      else if(k.anim===i){for(let j=0;j<3;j++)yildiz(p.x+Math.cos(t*4+j*2)*32,p.y-20-j*10,3,'#fff5cc');}
    }}
    // İzi yalnız parmak basılıyken ve en fazla 12 noktada çiz.
    if(k.aktif&&k.faz===2&&isaret&&isaret.surukle&&isaret.iz&&isaret.iz.length>1){g.save();g.strokeStyle='rgba(255,250,217,.55)';g.lineWidth=3;g.lineCap='round';g.lineJoin='round';g.beginPath();g.moveTo(isaret.iz[0].x,isaret.iz[0].y);for(let j=1;j<isaret.iz.length;j++)g.lineTo(isaret.iz[j].x,isaret.iz[j].y);g.stroke();g.restore();}
    if(k.aktif&&k.faz===3){for(let i=0;i<14;i++){const a=i*Math.PI*2/14+t*.35;yildiz(o.x+Math.cos(a)*125,o.y-210+Math.sin(a)*55,3+i%3,renk[i%5]);}}
    g.restore();}
  function cizOn(o,t){const k=o.kg12;if(!k.aktif||P.ucus!==o)return;
    if(typeof fezaCizPoz==='function')fezaCizPoz(g,P.x,P.y,1,k.faz===3?'sevinc':'ayakta_yan',t);
    // Girişte yerine yürür; dört saniyelik mevcut kutlama sırasında Feza'nın
    // yanına döner ve takipçinin devralacağı konuma/ölçeğe kesintisiz ulaşır.
    const gir=ease(k.anneT/2.4),cik=k.faz===3?ease((4-k.bekle)/3.2):0;
    const ax=k.anneBasX+(o.x+285-k.anneBasX)*gir,ayniYer=o.x-290+64;
    const anneX=ax+(ayniYer-ax)*cik,anneScale=(1-.08*gir)+(.08*gir)*cik;
    const yuruyor=k.faz===3?cik<.99:gir<.99;
    if(typeof anne12Ciz==='function')anne12Ciz(g,anneX,o.y,anneScale,t,{poz:yuruyor?'yuru':k.faz===3?'dans':'el',yon:k.faz===3?-1:1,hareket:yuruyor?1:.2});
    if(typeof pirilCizPoz==='function'){const bob=k.faz===3?ease(k.bekle/3):1;g.save();pirilCizPoz(g,k.prX,k.prY+Math.sin(t*2)*5*bob,.65,'ucus',t);g.restore();}}
  TUR.kaydet('kampusGolet',{
    kur(o){o.done=false;o.tk={bitti:false};o.kg12={aktif:false,faz:-1,gor:[false,false,false,false,false],sira:[],anim:-1,t:0,bekle:0,saat:0,idle:0,yardimN:0,anneBasX:0,anneT:0,prX:0,prY:0};
      o.adim=()=>{if(P.ucus===o){P.x=o.x-290;P.y=o.y;P.vx=P.vy=P.buf=0;P.ground=true;}};
      o.kg12.kameraFn=()=>{if(typeof omDkEkle==='function')omDkEkle(o.x-360,o.y-340,o.x+350,o.y+20);};},
    guncelle,ciz,cizOn,
    testBitir(o){if(!o.kg12.aktif)basla(o);if(aktif===o)bitir(o,true);}
  });
})();
