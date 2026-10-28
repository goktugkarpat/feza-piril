/* Annemle Yıldız Yolculuğu: beş ayrı renk, tek sıcak aile teması.
   Ortak AU çalgıları/limitleyicisi kullanılır; yeni ses bağlamı ve sürekli osilatör yok. */
'use strict';
const MZ14=(()=>{
 let K=null,bar=0,lastPlace=-1,phrase=0,finishAt=Infinity,finished=false;
 const cd=Object.create(null);
 const CH=[
  [[38,50,54,57,61,64],[43,50,55,59,62,66],[45,52,57,61,64,69],[40,52,55,59,62,66]],
  [[38,50,57,61,64,69],[45,52,57,61,66,69],[47,54,57,62,66,69],[43,50,55,59,64,67]],
  [[40,52,55,59,62,66],[45,52,57,60,64,67],[43,50,55,59,62,67],[38,50,54,57,62,66]],
  [[41,53,57,60,64,67],[48,55,60,64,67,72],[46,53,58,62,65,69],[43,55,59,62,65,69]],
  [[42,54,58,61,65,68],[47,54,59,63,66,70],[44,56,59,63,66,71],[49,56,61,65,68,73]]
 ];
 const MELODY=[
  [[0,78,2],[2,81,1],[3,83,2],[5,81,1]],[[0,78,2],[3,76,2],[5,74,1]],
  [[0,78,1],[1,81,1],[2,86,2],[4,83,2]],[[0,81,3],[4,78,2]],
  [[0,76,2],[2,78,1],[3,81,2]],[[0,79,2],[3,78,2],[5,74,1]],
  [[0,76,1],[1,78,1],[2,81,2],[4,76,1]],[[0,74,5]]
 ];
 const ORDER=[0,0,1,2,0,3,1,0,2,1,3,2,0,3,1,0];
 const active=()=>typeof BOLUM_NO!=='undefined'&&BOLUM_NO===14;
 const region=()=>typeof dn14Region==='function'?dn14Region():0;
 function mode(){
  if(typeof DURUM!=='undefined'&&DURUM==='final')return 'sabah';
  if(typeof V14!=='undefined'&&V14.final)return 'eve';
  if(typeof P!=='undefined'&&P.ucus&&P.ucus.tip==='k14Voyage')return 'ucus';
  return 'gezegen';
 }
 function bagla(kit){K=kit;bar=phrase=0;lastPlace=-1;finishAt=Infinity;finished=false;for(const n in cd)delete cd[n];}
 function pad(ch,t,d,v){
  if(!K||!K.ac)return;
  for(let i=1;i<5;i++){if(!K.yerVar(1,t,t+d+1.8,false,1))continue;const out=K.zarf(t,.85,v*(i===1?.7:.4),d+1.3,K.panla(K.B.pad,(i-2.5)*.16));K.osc('sine',K.NOTE(ch[i]),t,t+d+1.8,out);}
 }
 function cubuk(t){
  if(!K||!active())return 2;
  const r=region(),m=mode(),quiet=m==='eve'||m==='sabah',flying=m==='ucus';
  if(lastPlace!==r){lastPlace=r;phrase=0;} // yeni gezegen: aynı melodinin yeni çalgı cevabı
  if(m==='sabah'&&finishAt===Infinity)finishAt=t+7.5;
  if(t>=finishAt){finished=true;return 2.6;}
  const bpm=quiet?72:flying?106:[88,82,102,88,76][r],e=30/bpm,d=e*6;
  const ch=CH[r][ORDER[phrase%16]],breath=phrase%8===7,vol=quiet?.65:1;
  if(phrase%2===0||quiet){pad(ch,t,d*1.6,.020*vol);K.bas(ch[0],t,.026*vol,'uzun',d*1.5);}
  const seq=flying?[1,3,5,2,4,5]:r===2?[1,2,4,3,2,5]:[1,3,4,2,3,5];
  const n=quiet?3:breath?4:6;
  for(let i=0;i<n;i++){
   const note=ch[seq[i]]+(r===4?12:0),at=t+i*e*(quiet?1.75:1),v=(i===0?.039:.027)*vol;
   if(r===4)K.cam(K.NOTE(note),at,v*.72,2.6,(i%2?1:-1)*.32,K.B.tus,true);
   else if(r===2)K.ksilofon(note,at,v*.9,(i%2?1:-1)*.22,'ahsap',K.B.arp);
   else K.arp(note+(flying?12:0),at,v,(i%2?1:-1)*.26,r===1?2.5:1.9,K.B.arp);
  }
  if(!breath){
   const tune=MELODY[phrase%8],transpose=r===3?3:r===4?4:0;
   for(let i=0;i<tune.length;i++){
    if(quiet&&i>1)break;const q=tune[i],note=q[1]+transpose-(quiet?12:0),at=t+q[0]*e;
    if(r===1||r===4)K.tus(note,at,(quiet?.025:.032),q[2]*e+1.5,(phrase%2?-.15:.15),true,K.B.tus);
    else K.flut(note,at,q[2]*e*.93,.031*vol,phrase%2?-.18:.18,K.B.flut,true);
   }
   if(r===3&&phrase%4===2)K.flut(ch[3]+12,t+e*3,2.3*e,.021,-.25,K.B.flut,false);
  }
  if(flying&&phrase%2===0){K.tus(ch[4]+12,t+3*e,.028,1.9,.22,true,K.B.tus);K.zil(K.NOTE(ch[5]+12),t+4.5*e,.012,2.5,-.2,K.B.zil,true);}
  if(r===4&&phrase%4===0)K.sopranoCan(ch[3]+12,t+2*e,.011,.24,K.B.soprano);
  if(quiet&&phrase%2===0)K.tus(74,t+e,.025,3,0,false,K.B.tus);
  phrase++;bar++;return d;
 }
 function karisim(t){
  if(!K||!active())return;const r=region(),m=mode(),q=m==='eve'||m==='sabah';
  const levels={arp:q?.66:.88,pad:r===3?.95:.82,tus:r===4?1:.83,flut:q?.7:.91,zil:.6,soprano:r===4?.5:.15,bas:.5};
  for(const n in K.TEMEL)if(K.B[n])K.hedefle(K.B[n].gain,K.TEMEL[n]*(levels[n]||0),t,1.6);
  if(K.revMuzik)K.hedefle(K.revMuzik.gain,r===4?.64:r===1?.59:.49,t,2);
  if(K.dly&&K.dly.fbG)K.hedefle(K.dly.fbG.gain,r===1||r===4?.24:.17,t,2);
  // Ay'da atmosfer/rüzgâr yok. Mars'ın fırtınası kaskın ardından çok yumuşak duyulur.
  if(K.ruzgarG)K.hedefle(K.ruzgarG.gain,r===2&&m==='gezegen'?.003:0,t,2);
 }
 function sfx(name,value){
  if(!active()||!/^k14/.test(name))return false;
  if(!K||!K.calabilir())return true;const t=K.zaman(),v=value||{},part=Number.isFinite(v.part)?v.part:Number.isFinite(v.index)?v.index:0;
  const gap=name==='k14Touch'?.14:name==='k14Step'?.16:name==='k14Ice'?.14:name==='k14Dust'?.18:name==='k14Lift'?2:name==='k14Done'?1.6:.45;
  if(t-(cd[name]??-100)<gap)return true;cd[name]=t;
  const notes=[74,78,81,83,86],i=Math.max(0,Math.min(4,Math.floor(part)%5)),bus=K.sfxG;
  if(name==='k14Touch'){
    // A tiny immediate tactile answer; the longer melody belongs to a real solved step.
    if(v.world===1&&(v.kind===0||v.kind===2)){K.gur(t,.16,'bandpass',v.kind===0?1850:950,620,.6,.007,.02,.06,.06,bus);K.ton(t,'sine',680,860,.11,.009,.015,0,.07,bus);}
    else if(v.world===2){K.ton(t,'sine',510,760,.16,.011,.025,0,.1,bus);}
    else if(v.world===3){K.ton(t,'sine',1280,1120,.18,.013,.008,0,.14,bus);K.ton(t,'sine',1920,1820,.12,.005,.008,0,.09,bus);}
    else if(v.world===0&&v.kind===2){K.gur(t,.09,'bandpass',2300,1100,.6,.006,.006,0,.06,bus);}
    else {K.ton(t,'sine',520,660,.12,.011,.015,0,.08,bus);}
  }
  else if(name==='k14Lift'){K.ton(t,'sine',65,104,1.7,.022,.35,0,.8,bus);K.gur(t,1.9,'lowpass',560,1000,.65,.016,.4,0,.8,bus);[62,69,74].forEach((n,j)=>K.arp(n,t+.3+j*.19,.034,(j-1)*.18,2.6,bus));}
  else if(name==='k14Land'){K.ton(t,'sine',180,95,.32,.031,.03,0,.19,bus);K.gur(t,.42,'lowpass',1200,480,.7,.009,.05,0,.16,bus);K.tus(74,t+.22,.028,1.6,0,true,bus);}
  else if(name==='k14Dust'){K.gur(t,.25,'bandpass',1700,820,.6,.013,.04,.16,.05,bus);}
  else if(name==='k14Ice'){K.cam(K.NOTE(notes[i]+12),t,.036,2.8,(i-2)*.13,bus,true);K.tus(notes[i],t+.08,.026,1.9,0,true,bus);}
  else if(name==='k14Done'){[62,66,69,74,78,81].forEach((n,j)=>K.arp(n,t+j*.095,.045,(j-2.5)*.1,2.7,bus));K.flut(81,t+.45,1,.028,.08,bus,true);}
  else if(name==='k14Final'){[50,57,62,66,69,74,78,81].forEach((n,j)=>K.arp(n,t+j*.14,.044,(j-3.5)*.07,3.4,bus));K.flut(78,t+.8,2.3,.031,0,bus,true);}
  else if(name==='k14Step'&&v.world===1&&v.kind===0){K.gur(t,.2,'bandpass',1450,730,.6,.009,.03,.1,.04,bus);K.tus(notes[i],t+.1,.027,1,0,false,bus);}
  else if(name==='k14Step'&&v.world===2){K.flut(notes[i],t,.42,.028,.1,bus,false);K.arp(notes[i]-12,t,.025,-.1,1.5,bus);}
  else {K.tus(notes[i],t,.038,1.5,(i-2)*.12,true,bus);if(name==='k14Star')K.arp(notes[i]+12,t+.07,.027,.1,1.6,bus);}
  return true;
 }
 const emit=(name,v)=>{if(active()&&typeof AU!=='undefined'&&AU.sfx)AU.sfx(name,v);};
 if(typeof OLAY!=='undefined'){
  OLAY.on('k14VoyageStart',v=>emit('k14Lift',v));OLAY.on('k14VoyageDone',v=>emit('k14Land',v));
  OLAY.on('k14VoyageStar',v=>emit('k14Star',v));OLAY.on('k14Launch',v=>emit('k14Star',v));
  OLAY.on('k14ActivityTouch',v=>emit('k14Touch',v));
  OLAY.on('k14ActivityStep',v=>emit(v&&v.world===3?'k14Ice':'k14Step',v));
  OLAY.on('k14ActivityDone',v=>emit('k14Done',v));OLAY.on('k14FinalStart',v=>emit('k14Final',v));
 }
 return{bagla,cubuk,karisim,sfx,birak(){finished=true;},get bitti(){return finished;},get durum(){return{bar,place:lastPlace,mode:mode()};}};
})();
