/* İpek Göğü: yaşayan gök bahçeleri. Arp ve flüt arasında soru-cevap,
   uçuşta açılan, sarılmada sakinleşen özgün masal teması. Ortak AU motorunu kullanır. */
'use strict';
const MZ13=(()=>{
 let K=null,bar=0,mode='kiyi',finishAt=Infinity,finished=false,peak=false,focusUntil=-Infinity;
 const cooldown=Object.create(null);
 const CH=[{root:38,n:[50,54,57,61,64]},{root:43,n:[55,59,62,66,69]},{root:47,n:[54,57,59,62,66]},{root:45,n:[57,61,64,66,71]},{root:40,n:[52,55,59,62,66]},{root:42,n:[54,57,61,64,69]}];
 const HARMONY=[0,0,1,3,2,1,4,3,0,5,1,3,2,4,3,0];
 // Sekizlik konumu, MIDI, sekizlik uzunluğu; ikinci cümle ilkine sıcak bir cevap verir.
 const A=[[[0,78,1],[1,81,2],[3,83,1],[4,81,2]],[[0,79,2],[3,78,1],[4,74,2]],[[0,78,1],[1,81,1],[2,86,2],[4,83,2]],[[0,81,3],[4,78,2]],[[0,78,2],[2,76,1],[3,74,1],[4,76,2]],[[0,79,2],[3,83,1],[4,81,2]],[[0,78,1],[1,76,1],[2,74,2],[4,73,1],[5,76,1]],[[0,78,4]]];
 const B=[[[0,81,2],[2,83,1],[3,86,2]],[[0,85,2],[3,81,2]],[[0,83,1],[1,86,2],[3,88,1],[4,86,2]],[[0,83,3],[4,81,2]],[[0,79,2],[2,78,1],[3,76,2]],[[0,78,2],[3,81,1],[4,83,2]],[[0,81,1],[1,79,1],[2,78,2],[4,76,2]],[[0,78,5]]];
 const active=()=>typeof BOLUM_NO!=='undefined'&&BOLUM_NO===13;
 function phase(){
  if(typeof DURUM!=='undefined'&&DURUM==='final')return 'sabah';
  const u=typeof P!=='undefined'&&P.ucus;
  if(u&&u.tip==='k13Gok')return u.t<12.5?'dokuma':u.t<20?'tac':'saril';
  if(typeof V13!=='undefined'&&V13.final)return 'saril';
  if(u&&u.tip==='k13Kurdele')return 'ucus';
  const x=typeof P!=='undefined'?P.x/40:0;
  return x<90?'kiyi':x<170?'kopru':x<285?'bulut':x<390?'bahce':x<470?'koru':x<630?'ucus':'meydan';
 }
 function bagla(kit){K=kit;bar=0;mode='kiyi';finishAt=Infinity;finished=false;peak=false;focusUntil=-Infinity;for(const k in cooldown)delete cooldown[k];}
 function pad(ch,t,d,v){
  if(!K||!K.ac)return;
  for(let j=0;j<3;j++){if(!K.yerVar(1,t,t+d+1.5,false,1))continue;const out=K.zarf(t,.72,v*(j===0?.8:.6),d+1.15,K.panla(K.B.pad,(j-1)*.25));K.osc('sine',K.NOTE(ch.n[j]),t,t+d+1.55,out);}
 }
 function cubuk(t,d){
  if(!K||!active())return 2;mode=phase();
  if(mode==='sabah'&&finishAt===Infinity)finishAt=t+5.8;
  if(t>=finishAt){finished=true;return 2.4;}
  const flight=mode==='ucus',cloud=mode==='bulut',quiet=mode==='saril'||mode==='sabah',rise=mode==='tac';
  const eighth=30/(flight?114:cloud?108:quiet?82:rise?96:98),dur=eighth*6;
  const ci=quiet?0:rise?[1,3,0,0][bar%4]:HARMONY[bar%16],ch=CH[ci],breath=!flight&&!rise&&bar%8===7,focused=!quiet&&!flight&&!rise&&t<focusUntil,level=quiet?.72:focused?.86:1;
  if(bar%2===0||quiet||rise){pad(ch,t,dur*1.5,(rise?.034:quiet?.027:.024)*level);K.bas(ch.root,t,.033*level,'uzun',dur*1.35);}
  const order=flight?[0,2,4,1,3,4]:[0,2,3,1,2,4],count=quiet?3:breath?4:6;
  for(let i=0;i<count;i++)K.arp(ch.n[order[i]]+12,t+i*eighth*(quiet?1.8:1),(i===0?.045:.032)*level,(i%2?1:-1)*.3,quiet?2:1.65,K.B.arp);
  if(!breath){
   const answer=Math.floor(bar/8)%2,melody=(answer?B:A)[bar%8];
   for(let i=0;i<melody.length;i++){const n=melody[i],oct=quiet?-12:0,vol=mode==='bahce'?.023:quiet?.026:rise?.042:.035;if((quiet||focused)&&i>1)break;K.flut(n[1]+oct,t+n[0]*eighth,n[2]*eighth*.9,vol,answer?-.18:.18,K.B.flut,true);}
   if(bar%4===1&&!quiet)K.flut(ch.n[2],t+4*eighth,1.4*eighth,.022,-.25,K.B.flut,false);
  }
  if((cloud||flight)&&bar%2===0){K.tus(ch.n[3]+12,t+3*eighth,.032,1.15,-.25,true,K.B.tus);K.tus(ch.n[4]+12,t+4.5*eighth,.026,1.1,.25,true,K.B.tus);}
  if(rise){K.sopranoCan(ch.n[3]+12,t,.016,.2,K.B.soprano);if(bar%2===0)K.zil(K.NOTE(ch.n[4]+12),t+eighth,.022,2.2,0,K.B.zil,true);}
  else if(bar%8===3&&!quiet)K.zil(K.NOTE(ch.n[3]+12),t+4*eighth,.014,1.7,.28,K.B.zil,true);
  if((mode==='kiyi'||mode==='koru')&&bar%12===9)K.kus(t+dur*.65,.13);
  if(mode==='sabah')K.tus(78,t+eighth,.03,2.5,0,false,K.B.tus);
  bar++;return dur;
 }
 function karisim(t,d){
  if(!K||!active())return;mode=phase();const quiet=mode==='saril'||mode==='sabah',rise=mode==='tac';
  const focused=!quiet&&!rise&&mode!=='ucus'&&t<focusUntil;
  const levels={arp:quiet?.72:.92,pad:rise?.94:.8,tus:.82,flut:.93,zil:.72,soprano:rise?.65:.3,bas:.56};
  for(const n in K.TEMEL)if(K.B[n])K.hedefle(K.B[n].gain,K.TEMEL[n]*(levels[n]||0)*(focused?(n==='flut'||n==='tus'?.74:n==='arp'?.86:1):1),t,1.25);
  if(K.revMuzik)K.hedefle(K.revMuzik.gain,.57,t,1.8);
  if(K.dly&&K.dly.fbG)K.hedefle(K.dly.fbG.gain,.23,t,1.8);
  if(K.ruzgarG)K.hedefle(K.ruzgarG.gain,mode==='ucus'?.009:.003,t,1.5);
 }
 function sfx(name,value){
  if(!/^k13/.test(name)||!active())return false;if(!K||!K.calabilir())return true;
  const t=K.zaman(),gap=name==='k13Mantar'?.12:name==='k13Iz'?.42:name==='k13Gok'?4:name==='k13Dost'?1.6:.65;
  const key=name==='k13Mantar'?name+':'+Math.max(0,Math.min(4,Math.floor(Number(value)||0))):name;
  if(t-(cooldown[key]??-100)<gap)return true;cooldown[key]=t;
  if(name!=='k13Gok'&&name!=='k13Dost')focusUntil=t+2.8;
  const notes=[74,78,81,83,86],i=Math.max(0,Math.min(4,Math.floor(Number(value)||0)));
  if(name==='k13Mantar'){K.ksilofon([74,78,81][i%3],t,.044,(i-1)*.25,'ahsap',K.sfxG);K.arp([74,78,81][i%3]+12,t+.06,.025,(i-1)*.18,1.5,K.sfxG);}
  else if(name==='k13Minder'){K.ton(t,'sine',165,315,.3,.05,.025,0,.1,K.sfxG);K.gur(t,.3,'bandpass',850,1800,.8,.014,.045,0,.12,K.sfxG);K.tus(74,t+.08,.034,.6,.12,true,K.sfxG);}
  else if(name==='k13Perde'){K.gur(t,.65,'bandpass',1000,2200,.7,.02,.12,0,.15,K.sfxG);K.flut(notes[i]-12,t+.12,.45,.026,.12,K.sfxG,false);}
  else if(name==='k13Dokuma'||name==='k13Tohum'){K.tus(notes[i]-12,t,.05,.6,-.1,false,K.sfxG);K.arp(notes[i],t+.08,.044,.1,1.35,K.sfxG);K.gur(t,.2,'bandpass',650,1400,.8,.011,.035,0,.05,K.sfxG);}
  else if(name==='k13Gok'){[62,66,69,74,78,81].forEach((n,j)=>K.arp(n,t+j*.12,.057,(j-2.5)*.1,2.7,K.sfxG));K.flut(81,t+.45,1.6,.04,0,K.sfxG,true);}
  else if(name==='k13Dost'){K.ton(t,'sine',196,254,.42,.037,.07,0,.19,K.sfxG);K.flut(62,t+.12,.72,.031,-.12,K.sfxG,false);K.arp(69,t+.3,.024,.18,1.2,K.sfxG);}
  else K.arp(notes[i]+(name==='k13Iz'?12:0),t,.036,0,1.3,K.sfxG);
  return true;
 }
 const emit=(n,v)=>{if(active()&&typeof AU!=='undefined'&&AU.sfx)AU.sfx(n,v);};
 if(typeof OLAY!=='undefined'){
  OLAY.on('ipekPonpon',e=>emit('k13Tohum',e&&e.o?e.o.sira%4:0));
  OLAY.on('ipekKopruAdim',e=>emit('k13Dokuma',Math.floor((e&&e.u||0)*4)));
  OLAY.on('ipekMinder',()=>emit('k13Minder',0));OLAY.on('ipekDilek',e=>emit('k13Ilmek',e&&e.sira||0));
  OLAY.on('ipekIz',e=>emit('k13Iz',Math.floor((e&&e.u||0)*4)));
  OLAY.on('ipekPerdeAdim',e=>emit('k13Perde',Math.floor((e&&e.u||0)*4)));
  OLAY.on('ipekGokDost',()=>emit('k13Dost',0));
  OLAY.on('ipekGokYukseldi',()=>{peak=true;emit('k13Gok',0);});
  OLAY.on('ipekZenginNote',e=>emit('k13Mantar',e&&e.note||0));
  OLAY.on('ipekYuvaDost',e=>emit('k13Dost',e&&e.i||0));
  OLAY.on('ipekYagmurBloom',e=>emit('k13Tohum',e&&e.i||0));
  OLAY.on('ipekBulutTop',()=>emit('k13Minder',0));
  OLAY.on('ipekBulutPad',e=>emit('k13Tohum',e&&e.i||0));
 }
 return{bagla,cubuk,karisim,sfx,birak(){finished=true;},get bitti(){return finished;},get durum(){return{bar,mode,peak};}};
})();
