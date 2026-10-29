/* anne13.js — İpek Göğü: aynı anne, yaşayan yıldız köklerini merakla izleyen eller.
   anne12.js'in ayrıntılı modeli, ayak basışı, dönüşü ve saç yayları korunur.
   IP13CHAR tek çizim sahibidir; hiçbir etkinlik ikinci bir anne yaratmaz. */
'use strict';

const IP13CHAR = (() => {
  const i13ch = { ad: '', kalan: 0, zaman: 0, agirlik: 0, u: 0, o: {}, sahip: false,
    tx: NaN, ty: NaN, sonTx: NaN, sonTy: NaN, vref: 0, vyref: 0, vy: 0,
    binme: 0, sonPoz: '', cizSay: 0, anaFeza: true, reachX: 25, reachY: -76,
    gazeX:0,gazeY:0,gazeW:0,aweT:-1,awePulse:0, bakY: 0, merak: 0, merakT: 0, merakY: 610, tepkiT: 0, sonIstek: -10, izSon: -10, zenginSon:-10 };
  const i13co = { gorunum:'gok13', poz: 'dur', yon: 1, hiz: 0, bak: 0, egil: 0, u: 0, ust: undefined,
    bakisX:0,bakisY:0,bakisW:0,hayret:0, ustW: 0, ustO: null, ifade: 'mutlu', ifadeW: 0.7, golge: true };
  const i13isik={t:-1,owner:null,x:0,y:0,w:0};
  const i13cu = { u: 0 }, i13bas = { x:0, y:0, rx:25, ry:29 };
  const i13cl = (v,a,b) => v < a ? a : v > b ? b : v;
  const i13sm = v => { v = i13cl(v,0,1); return v*v*(3-2*v); };
  const i13ac = (v,h,dt,k) => v+(h-v)*(1-Math.exp(-dt*k));
  const i13actif = () => typeof BOLUM_NO !== 'undefined' && BOLUM_NO === 13;
  const i13var = v => Number.isFinite(v);
  // Aynı yolculuk/final fiziği hâlâ sahibiyken son poz korunur; bir sahne perdesi
  // güncellemeyi durdurduğunda görünür karakterler bir anlığına kaybolmaz.
  const i13Etkin = () => i13ch.kalan>0 || (typeof P!=='undefined'&&!!P.ucus&&i13ch.o.sahip===P.ucus);

  function i13Dokuma(R,tm,o) {
    anPozDur(R,tm,o);
    const s=Math.sin(tm*1.45),u=i13sm(o&&i13var(o.u)?o.u:1);
    const low=i13sm((i13ch.reachY+100)/53),x=i13cl(i13ch.reachX,12,32),y=i13cl(i13ch.reachY,-107,-51);
    // Kökün önünde çömelmeden eğilir; yakın avuç tohumu okşar, öbürü altından destekler.
    R[A_GV]+=.10+.23*low;R[A_HY]+=3.2*low;R[A_HX]-=1.8*low;R[A_BA]=-R[A_GV]*.45+.02;
    R[A_OMZ]+=.22*s;R[A_OEL]=1.07;
    anElTut(R,A_OEX,true,x+1.2*s,y-.9*s,-.55);
    anElTut(R,A_UEX,false,x-6,y+7+.6*s,-.9);
    R[A_OEK]=-.55+.09*s;R[A_UEK]=-.9;R[A_OEA]=.55+.3*u+.06*s;R[A_UEA]=.5+.2*u;
    R[A_BKY]=i13ch.bakY;R[A_BKX]=.75;R[A_GUL]=1;R[A_AGZ]=0;R[A_KAS]=.28+.16*u;R[A_CNT]=0;
  }
  function i13Perde(R,tm,o) {
    anPozDur(R,tm,o);
    const u=i13sm(o&&i13var(o.u)?o.u:0),nf=Math.sin(tm*1.3);
    R[A_HX]-=1.4*u;R[A_GV]-=.025*u;R[A_BA]=-.12-.06*u;
    anElTut(R,A_OEX,true,28-7*u,-104+6*u+.7*nf,-.6);
    anElTut(R,A_UEX,false,21-5*u,-94+4*u,-.8);
    R[A_OEK]=-.6;R[A_UEK]=-.8;R[A_OEA]=.85;R[A_UEA]=.75;
    R[A_GUL]=1;R[A_BKY]=-.65;R[A_KAS]=.45;R[A_CNT]=0;
  }
  function i13Hayran(R,tm,o){
    anPozDur(R,tm,o);const s=Math.sin(tm*.9),wave=.5+.5*Math.sin(tm*1.15),awe=i13ch.gazeW,reaction=Math.max(i13ch.awePulse,Math.exp(-Math.pow((i13ch.tepkiT-.38)/.38,2))),rest=i13sm((i13ch.tepkiT-1.15)/.8);
    R[A_GV]-=.025;R[A_BA]=-.15-.025*s;R[A_OMZ]+=.35*wave;
    anElTut(R,A_OEX,true,26+1.5*s+1.1*awe,-100-3*wave-2*awe+12*rest,-.5);
    anElTut(R,A_UEX,false,10,-81+5*rest,-1.1);
    R[A_OEA]=.85+.1*awe-.12*rest;R[A_UEA]=.6+.12*awe;R[A_OEK]=-.5;R[A_UEK]=-1.1;
    R[A_BKY]=-.81-.06*wave;R[A_BKX]=.4+.32*Math.sin(tm*.29+.6);R[A_GUL]=1;R[A_AGZ]=0;R[A_KAS]=.28+.27*reaction;R[A_CNT]=0;
  }
  function i13Minder(R,tm,o) {
    anPozDur(R,tm,o);
    const w=.6+.4*Math.sin(tm*1.7),t=i13ch.tepkiT,clap=t>.18&&t<.86?Math.pow(Math.sin((t-.18)/.68*Math.PI*2),2):0,settle=i13sm((t-.9)/.8);
    anElMutlak(R,A_OEX,true,25-5*clap,-72-5*w+11*settle);anElMutlak(R,A_UEX,false,17+2*clap,-74-4*w+9*settle);
    R[A_OEA]=R[A_UEA]=.9;R[A_OEK]=-.65;R[A_UEK]=-.7;
    R[A_BKY]=i13ch.bakY;R[A_BA]=-.17+.12*settle;R[A_GUL]=1;R[A_KAS]=.55-.18*settle;R[A_MUT]=.55-.2*settle;
  }
  function i13Paylas(R,tm,o){
    anPozDur(R,tm,o);const u=i13cl(i13ch.tepkiT/1.4,0,1),p=Math.sin(u*Math.PI);
    // Gerçek başarısını fark eder; nesneyi uzaktan tutuyormuş gibi yapmaz.
    R[A_GV]+=.02*p;R[A_BA]=.025+.04*p;anElMutlak(R,A_OEX,true,23+3*p,-70-8*p);anElMutlak(R,A_UEX,false,10,-65);
    R[A_OEK]=-.65;R[A_UEK]=-1;R[A_OEA]=.7+.15*p;R[A_UEA]=.5;R[A_BKY]=i13ch.bakY;R[A_BKX]=.65;R[A_GUL]=1;R[A_AGZ]=0;R[A_KAS]=.25+.1*p;R[A_CNT]=0;
  }
  function i13Yolculuk(R,tm,o) {
    anPozOtur(R,tm,o);
    const u = i13sm(o && i13var(o.u) ? o.u : 1), s = Math.sin(tm*1.35),look=.5+.5*Math.sin(tm*.36);
    R[A_GV] += .035*s*u; R[A_BA] -= (.06+.055*look)*u;
    if (u > 0.01) {
      anElMutlak(R,A_OEX,true,29,-26+1.1*s);
      anElMutlak(R,A_UEX,false,-12,-6);
      R[A_OEK] = -0.8; R[A_UEK] = -1.2; R[A_OEA] = 0.55; R[A_UEA] = 0.6;
      R[A_BKY] = -.25-.4*look; R[A_GUL] = 1; R[A_KAS] = .28;
    }
    R[A_CNT] = 0; AN_ST.sacEk = -0.11*u+0.07*Math.sin(tm*2.1);
  }
  function i13Saril(R,tm,o) {
    anPozSaril(R,tm,o);
    const u=i13sm(((o&&i13var(o.u)?o.u:1)-.45)/.55);
    // Ön kol çocuğun göğsünü sarar; gözlerini/yanaklarını örtmez.
    R[A_OEY] += 14*u; R[A_OEK] += .12*u;
  }
  function i13Hazir() {
    if (!i13actif() || typeof ANNE12 === 'undefined' || typeof AN_POZ === 'undefined') return false;
    if (!AN_POZ.i13dokuma) {
      AN_POZ.i13dokuma = [i13Dokuma,'ayakta'];
      AN_POZ.i13perde = [i13Perde,'ayakta'];
      AN_POZ.i13minder = [i13Minder,'ayakta'];
      AN_POZ.i13hayran = [i13Hayran,'ayakta'];
      AN_POZ.i13paylas = [i13Paylas,'ayakta'];
      AN_POZ.i13yolculuk = [i13Yolculuk,'otur'];
      AN_POZ.i13saril = [i13Saril,'ayakta'];
    }
    if (!ANNE12.hazir) ANNE12.reset(P);
    return true;
  }
  function i13Yer() { return 720; }
  function i13Poz(ad,opt) {
    if (!i13actif()) return false;
    if (!ad) { i13ch.kalan = 0; return true; }
    const o = opt && typeof opt === 'object' ? opt : {};
    if(ad==='kok'||ad==='tohum')ad='dokuma';
    if(ad!==i13ch.ad||i13ch.kalan<=0||ad==='minder'&&i13ch.zaman-i13ch.sonIstek>.6)i13ch.tepkiT=0;
    i13ch.sonIstek=i13ch.zaman;
    if (i13ch.ad !== ad) { i13ch.sonPoz = i13ch.ad; i13ch.ad = ad; }
    i13ch.o = o; i13ch.kalan = i13var(o.sure) ? Math.max(.08,o.sure) : 1.8;
    return true;
  }
  function i13Adim(dt) {
    if (!i13Hazir()) return;
    dt = i13var(dt) ? i13cl(dt,0,.05) : 0;
    if (!(dt > 0)) return;
    i13ch.zaman += dt;i13ch.tepkiT+=dt;i13ch.kalan = Math.max(0,i13ch.kalan-dt);
    const o = i13ch.o, etkin = i13Etkin(), ad = i13ch.ad;
    i13ch.agirlik = i13ac(i13ch.agirlik,etkin?1:0,dt,etkin?6:4);
    i13ch.u = i13ac(i13ch.u,i13var(o.u)?i13cl(o.u,0,1):1,dt,9);
    const ust = etkin && (ad==='dokuma'||ad==='perde'||ad==='minder'||ad==='hayran'||ad==='paylas');
    const tam = etkin && !!P.ucus && (!!o.sahip || ad==='yolculuk'||ad==='saril');
    const hedef = etkin && i13var(o.ax) && (tam || Math.abs(o.ax-P.x)<230);
    const elle = tam || hedef;
    if (elle) {
      if (!i13ch.sahip) {
        ANNE12.devral('ipek13'); i13ch.sahip = true; i13ch.sonTx = ANNE12.x; i13ch.sonTy = ANNE12.y;
        i13ch.vref = 0; i13ch.vyref = 0; i13ch.vy = 0;
      }
      const tx = i13var(o.ax)?o.ax:P.x-64, ty = i13var(o.ay)?o.ay:720;
      const vx = i13var(i13ch.sonTx)?i13cl((tx-i13ch.sonTx)/dt,-420,420):0;
      const vy = i13var(i13ch.sonTy)?i13cl((ty-i13ch.sonTy)/dt,-300,300):0;
      i13ch.sonTx = tx; i13ch.sonTy = ty;
      i13ch.vref = i13ac(i13ch.vref,vx,dt,8); i13ch.vyref = i13ac(i13ch.vyref,vy,dt,8);
      // Canlı yaprağın hızı önden izlenir; yay biniş ve inişi kesintisiz yumuşatır.
      const om = tam?7:4.5;
      const ax = om*om*(tx-ANNE12.x)+2*om*(i13ch.vref-ANNE12.vx);
      ANNE12.vx = i13cl(ANNE12.vx+i13cl(ax,-1100,1100)*dt,-480,480);
      ANNE12.x += ANNE12.vx*dt;
      const ay = om*om*(ty-ANNE12.y)+2*om*(i13ch.vyref-i13ch.vy);
      i13ch.vy = i13cl(i13ch.vy+i13cl(ay,-900,900)*dt,-330,330); ANNE12.y += i13ch.vy*dt;
      const dif = P.x-ANNE12.x;
      if (Math.abs(ANNE12.vx)>25 && ad!=='yolculuk') ANNE12.yon = Math.sign(ANNE12.vx);
      else if (Math.abs(dif)>8) ANNE12.yon = Math.sign(dif);
      ANNE12.poz = Math.abs(ANNE12.vx)>230?'kos':Math.abs(ANNE12.vx)>13?'yuru':'dur';
      ANNE12.derin = i13ac(ANNE12.derin,0,dt,5);
    } else {
      if (i13ch.sahip) { ANNE12.birak('ipek13'); i13ch.sahip = false; i13ch.vy = 0; }
      ANNE12.adim(dt,P,i13Yer);
    }
    const bin = etkin && ad==='yolculuk' ? (i13var(o.binme)?o.binme:1) : 0;
    i13ch.binme = i13ac(i13ch.binme,i13cl(bin,0,1),dt,4.8);
    if(etkin&&(ad==='dokuma'||ad==='perde'||ad==='hayran'||ad==='paylas')&&i13var(o.x)&&Math.abs(ANNE12.vx)<22&&Math.abs(o.x-ANNE12.x)>12)ANNE12.yon=Math.sign(o.x-ANNE12.x);
    let targetX=i13var(o.x)?o.x:P.x,targetY=i13var(o.y)?o.y:P.y-55;
    if(ad==='minder')targetY=P.y-58;
    if(tam&&ad==='dokuma'){targetX=ANNE12.x+ANNE12.yon*26;targetY=ANNE12.y-65-24*i13ch.u;}
    else if(ad==='hayran'&&!i13var(o.y))targetY=P.y-245;
    i13ch.reachX=i13ac(i13ch.reachX,(targetX-ANNE12.x)*ANNE12.yon,dt,6);
    i13ch.reachY=i13ac(i13ch.reachY,targetY-ANNE12.y,dt,6);
    i13ch.bakY=i13ac(i13ch.bakY,i13cl((targetY-ANNE12.y+112)/70,-.9,.75),dt,4.5);
    // Etrafına amaçsız bakmak yerine yakındaki filizin ışığını veya sıçrayan Feza'yı izler.
    i13ch.merakT-=dt;
    if(i13ch.merakT<=0){
      i13ch.merakT=.35;let best=null,dist=225;
      if(typeof NESNELER!=='undefined')for(const n of NESNELER){if(!/^(k13Ponpon|k13Ilmek|k13YeniDal)$/.test(n.tip))continue;const d=Math.abs(n.x-ANNE12.x);if(d<dist){dist=d;best=n;}}
      i13ch.merakY=best?best.y-80:P.y-58;i13ch.merakH=best ? .65 : 0;
    }
    i13ch.merak=i13ac(i13ch.merak,i13ch.merakH||0,dt,2.8);
    if(!etkin)i13ch.bakY=i13ac(i13ch.bakY,i13cl((Math.min(i13ch.merakY,P.y-58)-ANNE12.y+112)/70,-.9,.75),dt,3.2);
    if(i13isik.t>=0){
      i13isik.t+=dt;const u=i13cl(i13isik.t/2.1,0,1),k=i13sm(u);
      if(ad==='saril'||!P.ucus||i13isik.t>2.1){i13isik.t=-1;i13isik.w=0;}
      else if(typeof ANNE12_ELLER!=='undefined'&&typeof IP13FEZA!=='undefined'){
        const a=IP13FEZA.el,b=ANNE12_ELLER;
        i13isik.x=a.x+(b.onX-a.x)*k;i13isik.y=a.y+(b.onY-a.y)*k-Math.sin(u*Math.PI)*9;
        i13isik.w=Math.sin(u*Math.PI);
      }
    }
    const dost=typeof GOK13!=='undefined'&&typeof GOK13.bakisHedef==='function'?GOK13.bakisHedef():null;
    let gw=dost&&i13var(dost.x)&&i13var(dost.y)&&ad!=='saril'?i13cl(dost.u||0,0,1):0;
    if(dost&&gw>.001){if(i13ch.gazeW<.01){i13ch.gazeX=dost.x;i13ch.gazeY=dost.y;}else{i13ch.gazeX=i13ac(i13ch.gazeX,dost.x,dt,4);i13ch.gazeY=i13ac(i13ch.gazeY,dost.y,dt,4);}}
    if(i13isik.w>.04&&gw<.15&&ad!=='saril'){if(i13ch.gazeW<.01){i13ch.gazeX=i13isik.x;i13ch.gazeY=i13isik.y;}else{i13ch.gazeX=i13ac(i13ch.gazeX,i13isik.x,dt,7);i13ch.gazeY=i13ac(i13ch.gazeY,i13isik.y,dt,7);}gw=i13isik.w*.82;}
    i13ch.gazeW=i13ac(i13ch.gazeW,gw,dt,gw>i13ch.gazeW?3.8:6);
    if(gw>.3){if(i13ch.aweT<0)i13ch.aweT=0;else i13ch.aweT+=dt;}else if(gw<.08)i13ch.aweT=-1;
    i13ch.awePulse=i13ch.aweT>=0?Math.exp(-Math.pow((i13ch.aweT-.48)/.43,2)):0;
    i13ch.anaFeza = !tam;
    if (typeof fz13Adim==='function') fz13Adim(dt,etkin?ad:'',o,i13ch);
  }
  function i13Ciz(tm) {
    if (!i13Hazir()) return;
    const o = i13ch.o, ad = i13Etkin()?i13ch.ad:'', w = i13ch.agirlik;
    const tam = !!P.ucus && !!ad && (!!o.sahip||ad==='yolculuk'||ad==='saril');
    const moving = Math.abs(ANNE12.vx)>22 && ad!=='yolculuk';
    const cp = ad==='dokuma'?'i13dokuma':ad==='perde'?'i13perde':ad==='minder'?'i13minder':ad==='hayran'?'i13hayran':ad==='paylas'?'i13paylas':ad==='saril'?'i13saril':ad==='yolculuk'?'i13yolculuk':'';
    i13co.poz = cp && !moving?cp:ANNE12.poz; i13co.yon = ANNE12.yon; i13co.hiz = Math.abs(ANNE12.vx);
    if(ad==='perde'&&!moving&&i13var(o.x)&&Math.abs(o.x-ANNE12.x)>12)i13co.yon=Math.sign(o.x-ANNE12.x);
    i13co.u = ad==='yolculuk'?i13ch.binme:i13ch.u; i13co.bak = ad==='hayran'?-.8:ad==='minder'?i13ch.bakY:ad==='dokuma'?0:ad==='yolculuk'?-.15+.4*Math.sin(tm*.28):i13ch.bakY*i13ch.merak+ANNE12.bak*(.6-i13ch.merak*.3);
    i13co.egil = ANNE12.egil*.5; i13co.golge = ad!=='yolculuk';
    i13co.ust = moving&&cp&&ad!=='saril'?cp:undefined; i13co.ustW = w;
    i13cu.u = i13ch.u; i13co.ustO = i13cu;
    i13co.ifade = ad==='saril'?'sevgi':ad==='hayran'?'sasir':ad==='minder'?'gulen':'mutlu';
    i13co.ifadeW = ad==='saril'?i13sm(i13ch.u):ad==='minder'?.8-.4*i13sm((i13ch.tepkiT-.9)/.8):ad==='hayran'?.22+.45*Math.max(i13ch.awePulse,Math.exp(-Math.pow((i13ch.tepkiT-.38)/.38,2))):.55;
    i13co.bakisX=i13ch.gazeX;i13co.bakisY=i13ch.gazeY;i13co.bakisW=ad==='saril'?0:i13ch.gazeW;i13co.hayret=i13ch.awePulse;
    i13co.aci = -.65;
    const sarma = tam&&ad==='saril'&&i13ch.u>.35&&!moving;
    i13co.katman = undefined;
    if(i13isik.w>.01&&typeof sh13Glow==='function'){
      g.save();sh13Glow(g,i13isik.x,i13isik.y,7.5,'#b7ffe4',i13isik.w*.38);g.globalAlpha=i13isik.w*.85;g.fillStyle='#f2f5d4';g.beginPath();g.arc(i13isik.x,i13isik.y,1.35,0,Math.PI*2);g.fill();g.restore();
    }
    anne12Ciz(g,ANNE12.x,ANNE12.y-8*ANNE12.derin,1-.06*ANNE12.derin,tm,i13co);
    if(typeof anBX==='number'&&typeof anBY==='number'){
      const scale=1-.06*ANNE12.derin,turn=AN_ST.donU<1?1-.34*Math.sin(Math.PI*AN_ST.donU):1;
      i13bas.x=ANNE12.x+anBX*i13co.yon*turn*scale;i13bas.y=ANNE12.y-8*ANNE12.derin+anBY*scale;
    }
    i13ch.cizSay++;
    if (tam && typeof fz13Ciz==='function') fz13Ciz(g,tm,ad,o,i13ch);
    else if (typeof fz13Ust==='function') fz13Ust(tm,ad,o,w);
    if(sarma){
      // Sarılan kolun omuz tarafı arkada, çocuğun göğsünü saran kısmı öndedir.
      // Yanağı ve gözleri bu doğal katman sınırının üstünde açık kalır.
      g.save();g.beginPath();g.rect(ANNE12.x-150,P.y-44,300,180);g.clip();
      i13co.katman='on';i13co.golge=false;anne12Ciz(g,ANNE12.x,ANNE12.y-8*ANNE12.derin,1-.06*ANNE12.derin,tm,i13co);
      g.restore();i13co.katman=undefined;
    }
  }
  function i13State() { return {x:typeof ANNE12!=='undefined'?ANNE12.x:0,y:typeof ANNE12!=='undefined'?ANNE12.y:720,
    vx:typeof ANNE12!=='undefined'?ANNE12.vx:0,poz:i13ch.ad,kalan:i13ch.kalan,sahip:i13ch.sahip,fezaSahip:!i13ch.anaFeza,binme:i13ch.binme,cizSay:i13ch.cizSay,isikT:i13isik.t,bakisW:i13ch.gazeW}; }
  if(typeof OLAY!=='undefined')OLAY.on('ipekGokIlmek',e=>{
    if(!i13actif()||!e||!e.o||e.o===i13isik.owner||e.o.t<3||e.o.t>8||typeof IP13FEZA==='undefined'||typeof ANNE12_ELLER==='undefined')return;
    const a=IP13FEZA.el,b=ANNE12_ELLER;
    if(!i13var(a.x)||!i13var(b.onX)||Math.hypot(a.x-b.onX,a.y-b.onY)>135)return;
    i13isik.owner=e.o;i13isik.t=0;i13isik.x=a.x;i13isik.y=a.y;i13isik.w=0;
  });
  if(typeof OLAY!=='undefined')OLAY.on('ipekIz',e=>{
    if(!i13actif()||typeof DURUM==='undefined'||DURUM!=='oyun'||!e||!i13var(e.x)||!i13var(e.y)||i13Etkin()||P.ucus||i13ch.zaman-i13ch.izSon<3.4||Math.abs(e.x-P.x)>430)return;
    // Parmak izinden yükselen filizi fark eder; başka bir etkinlik pozunun önüne geçmez.
    i13ch.izSon=i13ch.zaman;i13Poz('hayran',{sure:1.65,x:e.x,y:e.y-40});
  });
  if(typeof OLAY!=='undefined')for(const event of ['ipekYuvaDost','ipekYagmurBloom','ipekOrkestra','ipekBulutBahce'])OLAY.on(event,e=>{
    if(!i13actif()||typeof DURUM==='undefined'||DURUM!=='oyun'||!e||!i13var(e.x)||!i13var(e.y)||P.ucus||Math.abs(e.x-P.x)>430||i13ch.zaman-i13ch.zenginSon<2.4||i13Etkin()&&i13ch.ad!=='paylas')return;
    i13ch.zenginSon=i13ch.zaman;i13Poz('paylas',{sure:1.6,x:e.x,y:e.y-65,u:1});
  });
  return {adim:i13Adim,ciz:i13Ciz,poz:i13Poz,state:i13State,bas:i13bas};
})();
if (typeof window!=='undefined') window.IP13CHAR = IP13CHAR;
