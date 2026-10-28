/* İpek Göğü: yaklaşırken bir kez öğreten, konusu geçince sıradan düşen sesler.
   Ana döngü IP13SES.adim(dt) çağırır. Yeni zamanlayıcı/ses bağlamı kurulmaz. */
'use strict';
(function(){
  if(typeof BOLUM_NO==='undefined'||BOLUM_NO!==13)return;
  const said=Object.create(null),groups=Object.create(null);
  const hints=[
    {k:'p_ip_kopru',tip:'k13Dokuma',bolge:'kopru'},
    {k:'p_ip_minder',tip:'k13Minder',bolge:'tepeler'},
    {k:'p_ip_kelebek',tip:'k13Kelebek',bolge:'kelebek'},
    {k:'p_ip_perde',tip:'k13Perde',bolge:'perde'}
  ];
  let ready=false,scan=0,last=-100,lastEnd=-100,idleToy=null,idleTime=0;
  const time=()=>typeof now==='number'?now:0;
  const oyun=()=>typeof DURUM!=='undefined'&&DURUM==='oyun'&&typeof P!=='undefined'&&Number.isFinite(P.x)&&Number.isFinite(P.y);
  function hazir(){
    if(ready||typeof NESNELER==='undefined'||!NESNELER.length)return;
    for(const h of hints)groups[h.tip]=[];
    groups.k13Ponpon=[];
    for(const o of NESNELER)if(groups[o.tip])groups[o.tip].push(o);
    for(const h of hints)h.alan=typeof BOLUM!=='undefined'&&BOLUM.bolgeler?BOLUM.bolgeler.find(b=>b.ad===h.bolge):null;
    ready=true;
  }
  function bitmedi(k,o){
    if(!o)return false;
    if(k==='p_ip_yardim')return !o.done&&!(o.u>=.995)&&!(o.hits>0);
    if(k==='p_ip_minder')return !o.done&&!(o.hits>0);
    return !o.done&&!(o.u>=.995)&&!(o.target>=.995);
  }
  function yakin(o,r){return !!o&&Math.abs(P.x-o.x)<=r&&Math.abs(P.y-o.y)<300;}
  function gecerli(k,o){
    if(!oyun())return false;
    hazir();
    if(k==='a_ip_final1')return true;
    if(k==='p_ip_binis')return !!P.ucus&&P.ucus.tip==='k13Kurdele'&&!P.ucus.done&&(P.ucus.u||0)<.25;
    if(k==='p_ip_final')return !!P.ucus&&P.ucus.tip==='k13Gok'&&!P.ucus.done&&(P.ucus.t||0)<12.5;
    if(k==='p_ip_gok')return !!P.ucus&&P.ucus.tip==='k13Gok'&&!P.ucus.done;
    if(P.ucus||typeof V13!=='undefined'&&V13.final)return false;
    if(k==='p_ip_koprubitti')return yakin(o,700);
    if(k==='p_ip_yardim')return P.x<90*T&&Math.abs(P.vx||0)<18&&yakin(o,170)&&bitmedi(k,o);
    for(const h of hints)if(h.k===k){
      const a=h.alan;
      if(a&&(P.x<a.x0-200||P.x>a.x1+40))return false;
      if(!o){const list=groups[h.tip]||[];for(const n of list)if(bitmedi(k,n)&&P.x>=n.x-560&&P.x<=n.x+250){o=n;break;}}
      return !!o&&o.tip===h.tip&&bitmedi(k,o)&&P.x>=o.x-560&&P.x<=o.x+250&&Math.abs(P.y-o.y)<300;
    }
    return true;
  }
  function play(key,priority,o){
    if(said[key]||typeof SES==='undefined'||!SES.soyle)return false;
    if(!gecerli(key,o))return false;
    said[key]=true;last=time();SES.soyle(key,{oncelik:priority||2,o:o||null});return true;
  }
  function sakin(){
    return typeof SES!=='undefined'&&!SES.konusuyor()&&!SES.sira().length&&time()-last>=8&&time()-lastEnd>=2.8;
  }
  function adim(dt){
    if(!oyun()||typeof document!=='undefined'&&document.hidden||!(dt>0)){if(!oyun()){idleToy=null;idleTime=0;}return;}
    scan+=Math.min(dt,.05);if(scan<.4)return;const passed=scan;scan=0;hazir();
    if(P.ucus||typeof V13!=='undefined'&&V13.final){idleToy=null;idleTime=0;return;}
    // Henüz dokunulmamış ilk ponponun yanında sakin bekleyen çocuğa tek yardım.
    let toy=null;
    if(P.x<90*T&&Math.abs(P.vx||0)<18)for(const o of groups.k13Ponpon||[])if(bitmedi('p_ip_yardim',o)&&yakin(o,170)){toy=o;break;}
    if(toy&&toy===idleToy)idleTime+=passed;else{idleToy=toy;idleTime=0;}
    if(!sakin())return;
    for(const h of hints){
      if(said[h.k])continue;
      for(const o of groups[h.tip]||[])if(gecerli(h.k,o)){play(h.k,2,o);return;}
    }
    if(toy&&idleTime>=8)play('p_ip_yardim',2,toy);
  }
  // Konuşma gerçekten başladığında nefes payı onun bitişinden hesaplanır.
  OLAY.on('konusma',e=>{if(e&&e.anahtar)lastEnd=time()+Math.max(0,e.sure||0);});
  OLAY.on('ipekKopruBasla',e=>play('p_ip_kopru',2,e&&e.o));
  OLAY.on('ipekKopruTamam',e=>play('p_ip_koprubitti',2,e&&e.o));
  OLAY.on('ipekIz',e=>play('p_ip_kelebek',2,e&&e.o));
  OLAY.on('ipekPerdeAdim',e=>play('p_ip_perde',2,e&&e.o));
  OLAY.on('ipekYolculukBasla',e=>play('p_ip_binis',2,e&&e.o));
  OLAY.on('ipekFinalBasla',e=>play('p_ip_final',3,e&&e.o));
  OLAY.on('ipekGokYukseldi',e=>{
    play('p_ip_gok',3,e&&e.o);
    // Göğü seyrettikten sonra sarılma boyunca anlatıcı son sözü tamamlar.
    if(typeof omZamanla==='function')omZamanla(6.5,()=>{if(typeof DURUM!=='undefined'&&DURUM==='oyun')play('a_ip_final1',3);});
  });
  window.IP13SES={adim,gecerli,state:()=>({said:Object.keys(said),idleTime,last,lastEnd})};
}());
