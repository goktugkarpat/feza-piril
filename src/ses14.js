/* Annemle Yıldız Yolculuğu: kısa, geçerli ve seyrek konuşmalar.
   SES ortak ses bağlamı/sırasını kullanır. Yeni zamanlayıcı veya ses bağlamı yok.
   B12/B13'te yalnız beş yeni oyuncak ipucu; eski konuşmalar korunur. */
'use strict';
const SES14=(()=>{
  const asked=Object.create(null),heard=Object.create(null),plans=[];
  const TOY=[['p_uz_ay_arac','p_uz_ay_can','p_uz_ay_foto'],['p_uz_mars_gunes','p_uz_mars_arac','p_uz_mars_kum'],['p_uz_jupiter_serit','p_uz_jupiter_yelken','p_uz_jupiter_girdap'],['p_uz_uranus_isik','p_uz_uranus_can','p_uz_uranus_kay']];
  const HELP=TOY.map(row=>row.map(k=>k+'_yardim'));
  const lessons=new WeakMap(),lessonForKey=Object.create(null);
  const ARRIVE=['','p_uz_ay','p_uz_mars','p_uz_jupiter','p_uz_uranus'];
  const EXTRA={nest:'p_ip_oyuncak_yuva',rain:'p_ip_oyuncak_yagmur',music:'p_ip_oyuncak_muzik',ball:'p_ip_oyuncak_top'};
  let clock=0,lastEnd=-100,scan=0,boat=null,boatT=0,activeLesson=null;
  const bn=()=>typeof BOLUM_NO==='number'?BOLUM_NO:0;
  const dur=()=>typeof DURUM==='string'?DURUM:'';
  const playing=()=>dur()==='oyun'&&typeof P!=='undefined'&&Number.isFinite(P.x)&&Number.isFinite(P.y);
  const ustate=()=>{try{return window.UZAY14&&UZAY14.state?UZAY14.state():null;}catch(e){return null;}};
  const distance=(o,n)=>!!o&&typeof P!=='undefined'&&Math.abs(P.x-o.x)<n;
  const nearToy=o=>playing()&&o&&!o.done&&distance(o,620)&&Math.abs(P.y-o.y)<420;
  const toyKey=o=>o&&TOY[o.world]&&TOY[o.world][o.kind];
  const miniKey=k=>TOY.some((row,w)=>row.some((key,n)=>key===k||HELP[w][n]===k));
  function lesson(o){
    if(!o||!toyKey(o))return null;
    let l=lessons.get(o);
    if(!l){l={lastProgress:clock,introHeard:false,helpHeard:false,revision:0,helpRevision:-1};lessons.set(o,l);}
    return l;
  }
  function invite(o,delay=.2){
    const k=toyKey(o);if(!k)return;activeLesson=o;lesson(o);lessonForKey[k]=o;lessonForKey[k+'_yardim']=o;
    clearPlans(q=>miniKey(q.k)&&q.o!==o);
    plan(k,delay,o,30);
  }
  function stuckHint(o){
    const k=toyKey(o),l=lesson(o);if(!k||!l||!l.introHeard||l.helpHeard||!nearToy(o)||P.ucus||clock-l.lastProgress<20)return;
    const hint=k+'_yardim';if(asked[hint]||heard[hint]||plans.some(q=>q.k===hint))return;
    l.helpRevision=l.revision;plan(hint,0,o,8);
  }
  function region(){if(typeof dn14Region==='function')return dn14Region(P.x);const x=P.x/40;return x<180?0:x<570?1:x<990?2:x<1380?3:x<1770?4:0;}
  function gecerli(k,o){
    if(k==='p_q_ekmek')return bn()===12&&playing()&&P.ucus===boat&&boat&&boat.k&&boat.k.faz==='yol'&&!(typeof V12!=='undefined'&&V12.ekmek>0);
    if(/^p_ip_oyuncak_/.test(k))return bn()===13&&nearToy(o)&&!P.ucus&&!(typeof V13!=='undefined'&&V13.final);
    if(!/^(?:p|an|a)_uz_/.test(k)||bn()!==14)return false;
    if(k==='p_uz_uyku')return dur()==='giris';
    if(k==='p_uz_sabah')return dur()==='final'||dur()==='son';
    if(/^a_uz_final/.test(k)){
      if(k==='a_uz_final1'&&!(typeof V14!=='undefined'&&V14.reunited))return false;
      if(k==='a_uz_final1_dost'&&typeof V14!=='undefined'&&V14.reunited)return false;
      return dur()==='oyun'&&typeof V14!=='undefined'&&V14.final||dur()==='final'||dur()==='son';
    }
    if(!playing())return false;
    if(k==='p_uz_giris'||k==='p_uz_amac'||k==='an_uz_basla')return P.x<180*40&&!(typeof V14!=='undefined'&&V14.final);
    if(k==='p_uz_roket')return P.x<180*40;
    const st=ustate();
    if(k==='p_uz_ucus')return !!(st&&st.flight&&st.flight.to===1&&st.flight.phase!=='unboard');
    if(k==='p_uz_donus'||k==='p_uz_donus_dost')return !!(st&&st.flight&&st.flight.to===0)&&(k==='p_uz_donus')===!!(typeof V14!=='undefined'&&V14.reunited);
    if(k==='an_uz_final')return typeof V14!=='undefined'&&V14.final;
    if(k==='p_uz_kavusma')return !!(typeof V14!=='undefined'&&V14.reunited)&&region()===4;
    if(k==='p_uz_tamam')return typeof V14!=='undefined'&&V14.seals.every(Boolean)&&!V14.final;
    const seal=/^p_uz_muhur([0-3])$/.exec(k);
    if(seal)return typeof V14!=='undefined'&&!!V14.seals[+seal[1]]&&region()===+seal[1]+1;
    for(let w=0;w<4;w++)for(let n=0;n<3;n++)if(TOY[w][n]===k||HELP[w][n]===k){
      if(!nearToy(o)||P.ucus||activeLesson!==o||o.world!==w||o.kind!==n)return false;
      if(HELP[w][n]===k){const l=lessons.get(o);return !!l&&l.introHeard&&l.helpRevision===l.revision&&clock-l.lastProgress>=20;}
      return true;
    }
    if(k==='p_uz_ay_dunya')return region()===1&&!P.ucus;
    if(k==='an_uz_mars')return region()===2&&!P.ucus;
    for(let r=1;r<5;r++)if(ARRIVE[r]===k)return region()===r&&!P.ucus;
    return false;
  }
  function plan(k,delay,o,life){
    if(asked[k]||heard[k]||plans.some(q=>q.k===k))return;
    if(plans.length>=28)plans.shift();
    plans.push({k,at:clock+(delay||0),until:clock+(life||35),o:o||null});
  }
  function clearPlans(test){for(let i=plans.length-1;i>=0;i--)if(test(plans[i]))plans.splice(i,1);}
  function quiet(){return typeof SES!=='undefined'&&SES.soyle&&!SES.konusuyor()&&!SES.sira().length&&clock>=lastEnd+1.2;}
  function adim(dt){
    if(![12,13,14].includes(bn())||!Number.isFinite(dt)||dt<=0||typeof document!=='undefined'&&document.hidden)return;
    if(!playing())return;clock+=Math.min(dt,.1);scan+=Math.min(dt,.1);if(scan<.25)return;scan=0;
    if(bn()===12){
      if(P.ucus&&P.ucus.k&&P.ucus.k.faz==='yol'){if(boat!==P.ucus){boat=P.ucus;boatT=0;}boatT+=.25;if(boatT>=4)plan('p_q_ekmek',0,null,25);}
      else boatT=0;
    }else if(bn()===13&&!P.ucus&&!(typeof V13!=='undefined'&&V13.final)&&typeof NESNELER!=='undefined'){
      for(const o of NESNELER)if(o.tip==='k13Oyuncak'&&nearToy(o)){const k=EXTRA[o.kind||o.zkind];if(k)plan(k,0,o,25);}
    }else if(bn()===14&&activeLesson){
      if(nearToy(activeLesson)&&!P.ucus)stuckHint(activeLesson);
      else clearPlans(q=>miniKey(q.k)&&q.o===activeLesson);
    }
    for(let i=plans.length-1;i>=0;i--){const q=plans[i];if(clock>q.until||(clock>=q.at&&!gecerli(q.k,q.o)))plans.splice(i,1);}
    if(!quiet())return;
    const i=plans.findIndex(q=>clock>=q.at&&gecerli(q.k,q.o));if(i<0)return;
    const q=plans.splice(i,1)[0];asked[q.k]=true;SES.soyle(q.k,{oncelik:/^a_/.test(q.k)?3:2,o:q.o});
  }
  OLAY.on('konusma',e=>{
    if(![12,13,14].includes(bn())||!e||!e.anahtar)return;lastEnd=clock+Math.max(0,e.sure||0);heard[e.anahtar]=true;
    if(bn()!==14)return;
    const o=lessonForKey[e.anahtar];if(o){const l=lesson(o);if(e.anahtar.endsWith('_yardim'))l.helpHeard=true;else{l.introHeard=true;l.lastProgress=clock;}}
    if(e.anahtar==='p_uz_giris')plan('p_uz_amac',(e.sure||5)+1.6,null,40);
    if(e.anahtar==='p_uz_amac')plan('an_uz_basla',(e.sure||5)+2,null,30);
    if(e.anahtar==='p_uz_ay')plan('p_uz_ay_dunya',(e.sure||5)+3,null,35);
  });
  OLAY.on('k14Launch',()=>{if(bn()===14)plan('p_uz_roket',0,null,35);});
  OLAY.on('k14VoyageStart',e=>{
    if(bn()!==14||!e)return;activeLesson=null;clearPlans(q=>/^p_uz_(?:ay|mars|jupiter|uranus|muhur|kavusma)/.test(q.k)||q.k==='an_uz_mars');
    if(e.to===1)plan('p_uz_ucus',7,null,26);
    if(e.to===0)plan(typeof V14!=='undefined'&&V14.reunited?'p_uz_donus':'p_uz_donus_dost',4,null,28);
  });
  OLAY.on('k14VoyageDone',e=>{if(bn()!==14||!e||!ARRIVE[e.to])return;plan(ARRIVE[e.to],1,null,32);});
  OLAY.on('k14ActivityStart',e=>{if(bn()===14&&e&&e.o)invite(e.o);});
  OLAY.on('k14EncounterStart',e=>{if(bn()===14&&e&&e.o)invite(e.o);});
  OLAY.on('k14DemoStart',e=>{if(bn()===14&&e&&e.o)stuckHint(e.o);});
  OLAY.on('k14ActivityStep',e=>{
    if(bn()!==14||!e||!e.o||e.replay)return;
    const l=lesson(e.o);if(!l)return;l.lastProgress=clock;l.revision++;
    // A successful move makes any queued retry obsolete, including partial rubbing.
    clearPlans(q=>q.o===e.o&&q.k===toyKey(e.o)+'_yardim');
  });
  OLAY.on('k14ActivityDone',e=>{
    if(bn()!==14||!e)return;clearPlans(q=>q.o===e.o);
    if(activeLesson===e.o)activeLesson=null;
    if(e.seal)plan('p_uz_muhur'+e.world,2,null,28);
    if(e.world===3&&e.kind===2)plan('p_uz_kavusma',4,null,30);
    if(typeof V14!=='undefined'&&V14.seals.every(Boolean))plan('p_uz_tamam',10,null,38);
    if(e.world===1&&e.kind===0)plan('an_uz_mars',12,null,30);
  });
  OLAY.on('k14FinalStart',()=>{if(bn()===14){activeLesson=null;clearPlans(()=>true);plan('an_uz_final',5,null,23);}});
  // Final narration is requested by the shared bedside scene, where its actual
  // MP3 duration sets the animation timeline. No duplicate summary is started here.
  return{adim,gecerli,state:()=>({clock,asked:Object.keys(asked),heard:Object.keys(heard),pending:plans.map(q=>q.k),lastEnd,lesson:activeLesson?{world:activeLesson.world,kind:activeLesson.kind,...lessons.get(activeLesson)}:null})};
})();
if(typeof window!=='undefined')window.SES14=SES14;
