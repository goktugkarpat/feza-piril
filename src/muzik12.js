/* muzik12.js — Sabancı kampüsü için özgün ılık bir tema (MZ12).
   Mevcut AU bağlamını ve müzik kanalını kullanır: ayrı AudioContext açmaz.
   MZ12.adim() DURUM değişimlerinde ve rAF adımlarında çağrılır; AU.muzikCikis()
   erişimi ve Bölüm 12 sırasında eski beste planlayıcısının susması gerekir.
   ?sessiz, gizli sekme, duraklatma, iPad kilidi ve konuşma kısması AU ile birlikte işler. */
'use strict';
const MZ12 = (() => {
  const eighth=60/92/2;
  // Önce soru, sonra karşılık; her iki cümlede nefes boşlukları var.
  const melody=[76,79,81,0,79,76,74,0, 72,76,79,81,79,76,74,0,
    76,79,84,0,83,79,76,0, 74,77,81,79,77,76,72,0,
    76,79,81,84,83,79,76,0, 74,76,79,0,81,79,76,0,
    72,76,81,0,79,76,74,0, 77,81,79,76,74,72,0,0];
  const bass=[48,43,45,41,48,43,45,41];
  const chord=[[60,64,67],[59,62,67],[60,64,69],[60,65,69],
    [60,64,67],[59,62,67],[60,64,69],[60,65,69]];
  let context=null, output=null, amp=null, step=0, next=0, wasActive=false, lastArea='';
  const hz=n=>440*Math.pow(2,(n-69)/12);
  function silence(){
    wasActive=false;
    if(amp&&context&&context.state!=='closed'){
      const t=context.currentTime; try{amp.gain.cancelScheduledValues(t);amp.gain.setTargetAtTime(.0001,t,.06);}catch(e){}
    }
  }
  function note(midi,t,dur,volume,tone) {
    if(!midi || !context || !amp) return;
    const ac=context, oscillator=ac.createOscillator(), env=ac.createGain();
    oscillator.type=tone==='su'?'sine':tone==='bass'?'triangle':'sine';
    oscillator.frequency.setValueAtTime(hz(midi),t);
    env.gain.setValueAtTime(.0001,t);
    env.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.035);
    env.gain.exponentialRampToValueAtTime(.0001,t+Math.max(.09,dur));
    oscillator.connect(env);env.connect(amp);
    oscillator.onended=()=>{try{oscillator.disconnect();env.disconnect();}catch(e){}};
    oscillator.start(t);oscillator.stop(t+Math.max(.09,dur)+.035);
  }
  function area() {
    if(typeof BOLUM==='undefined'||!BOLUM||!BOLUM.bolgeler||typeof P==='undefined') return '';
    const b=BOLUM.bolgeler.find(v=>P.x>=v.x0 && P.x<v.x1); return b?String(b.ad||''):'';
  }
  function segment(i,t) {
    const bar=Math.floor(i/8)%8, k=i%8, mode=area(), lake=/gol|golet|kayik|su/.test(mode), show=/sahne|gosteri|dans|muzik/.test(mode), final=/final|kule/.test(mode);
    const m=melody[i%melody.length];
    if(m) note(m,t,lake?.78:.5,show?.048:.037,lake?'su':'celesta');
    // Arp her iki vuruşta, düşük oktav bas seyrek; gösteride cevap biraz canlı.
    if(k%2===0) note(chord[bar][(k/2)%3]+12,t,.42,lake?.013:.018,'arp');
    if(k===0) note(bass[bar],t,1.0,.023,'bass');
    if(show&&k===6) note(chord[bar][2]+24,t,.28,.014,'celesta');
    if(final&&k===4) note(chord[bar][0]+12,t,.8,.014,'su');
    lastArea=mode;
  }
  function adim(){
    const ok=typeof BOLUM_NO!=='undefined'&&BOLUM_NO===12&&typeof DURUM!=='undefined'&&(DURUM==='oyun'||DURUM==='final');
    const quiet=typeof SESSIZ!=='undefined'&&SESSIZ;
    if(!ok||quiet||(typeof document!=='undefined'&&document.hidden)||typeof AU==='undefined'||!AU||typeof AU.baglam!=='function'||typeof AU.muzikCikis!=='function'){if(wasActive)silence();return;}
    const ac=AU.baglam(), bus=AU.muzikCikis();
    if(!ac||!bus||ac.state!=='running'){if(wasActive)silence();return;}
    if(context!==ac||output!==bus||!amp){if(amp){try{amp.disconnect()}catch(e){}} context=ac;output=bus;amp=ac.createGain();amp.gain.value=.0001;amp.connect(bus);wasActive=false;}
    const now=ac.currentTime;
    if(!wasActive){amp.gain.cancelScheduledValues(now);amp.gain.setTargetAtTime(1,now,.4);next=now+.12;wasActive=true;}
    if(next<now)next=now+.04;
    // Kısa bakış penceresi: duraklatma ve görünürlükte birikmiş nota çalınmaz.
    while(next<now+.18){segment(step,next);step=(step+1)%melody.length;next+=eighth;}
  }
  // Çocuğun dokunduğu çalgı: dört farklı pentatonik ses; konuşma kısması ve ana ses ayarıyla aynı bus.
  let sonNota=-Infinity;
  function nota(i){
    if(typeof BOLUM_NO==='undefined'||BOLUM_NO!==12||typeof DURUM==='undefined'||DURUM!=='oyun'||
       (typeof SESSIZ!=='undefined'&&SESSIZ)||(typeof document!=='undefined'&&document.hidden)||
       !Number.isInteger(i)||i<0||i>3) return false;
    adim();
    if(!wasActive||!context||context.state!=='running'||!amp) return false;
    const t=context.currentTime;
    // Çok sık gelen yinelenen dokunmalar node yığmasın; dört gerçek tuş sırasız ve tekrarlı çalınabilir.
    if(t-sonNota<.065) return false;
    sonNota=t; note([72,76,79,81][i],t+.005,.48,.095,'celesta');return true;
  }
  function reset(){silence();step=0;next=0;lastArea='';sonNota=-Infinity;}
  if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>{if(document.hidden)silence();});
  if(typeof addEventListener==='function')addEventListener('pagehide',silence);
  return {adim,nota,reset,dur:silence, get durum(){return {active:wasActive,step,area:lastArea}}};
})();
