/* final12.js — Anne ve Feza'nın kampüste birlikte geçirdiği günün sıcak finali.
   Otomatik, yazısız ve kesintilere dayanıklı; kampusFinalBitti sabahı başlatır. */
'use strict';
(() => {
  const SURE=29, PI2=Math.PI*2;
  const C=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=v=>{v=C(v,0,1);return v*v*(3-2*v);};
  let aktif=null;
  function oval(c,x,y,rx,ry,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,PI2);c.fill();}
  function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.moveTo(x,y-r);c.quadraticCurveTo(x+r*.18,y-r*.18,x+r,y);c.quadraticCurveTo(x+r*.18,y+r*.18,x,y+r);c.quadraticCurveTo(x-r*.18,y+r*.18,x-r,y);c.quadraticCurveTo(x-r*.18,y-r*.18,x,y-r);c.fill();}
  function soft(c,col,x,y,rx,ry,alpha){if(!(alpha>0))return;const a=c.globalAlpha;c.globalAlpha=a*C(alpha,0,1);if(typeof glow==='function'){const img=glow(col);c.drawImage(img,x-rx,y-ry,2*rx,2*ry);}else{oval(c,x,y,rx,ry,col);}c.globalAlpha=a;}
  function kalp(c,x,y,s,col){c.fillStyle=col;c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.2,y+s*.05,x-s*.85,y-s*.85,x,y-s*.3);c.bezierCurveTo(x+s*.85,y-s*.85,x+s*1.2,y+s*.05,x,y+s*.9);c.fill();}
  function kucukUcurtma(c,x,y,s,t){c.save();c.translate(x,y);c.rotate(Math.sin(t*.8)*.12);c.scale(s,s);
    c.strokeStyle='#fff0ce';c.lineWidth=2;c.beginPath();c.moveTo(0,20);c.bezierCurveTo(-15,42,15,50,0,70);c.stroke();
    c.fillStyle='#f68ea5';c.beginPath();c.moveTo(0,-26);c.lineTo(20,0);c.lineTo(0,27);c.lineTo(-20,0);c.closePath();c.fill();
    c.strokeStyle='#fff6de';c.lineWidth=2;c.beginPath();c.moveTo(0,-25);c.lineTo(0,26);c.moveTo(-19,0);c.lineTo(19,0);c.stroke();
    for(let i=0;i<3;i++){c.fillStyle=['#f8cd77','#96d9d2','#e9b0e9'][i];c.beginPath();c.ellipse(i%2?5:-5,33+i*11,7,3,.4,0,PI2);c.fill();}c.restore();}
  function kucukKayik(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);oval(c,0,12,42,6,'rgba(133,208,222,.5)');c.fillStyle='#c28d5c';c.beginPath();c.moveTo(-38,-6);c.quadraticCurveTo(-30,18,28,15);c.quadraticCurveTo(40,12,43,-6);c.closePath();c.fill();c.fillStyle='#f5d9ac';c.fillRect(-29,-7,60,4);c.strokeStyle='#faf4da';c.lineWidth=2;c.beginPath();c.moveTo(-12,-6);c.lineTo(-12,-42);c.stroke();c.fillStyle='#fff5da';c.beginPath();c.moveTo(-10,-39);c.lineTo(17,-12);c.lineTo(-10,-12);c.closePath();c.fill();c.restore();}
  function kucukKitap(c,x,y,s){c.save();c.translate(x,y);c.scale(s,s);c.fillStyle='#fff1d1';c.beginPath();c.moveTo(0,-15);c.quadraticCurveTo(-18,-23,-33,-15);c.lineTo(-33,19);c.quadraticCurveTo(-15,12,0,20);c.quadraticCurveTo(15,12,33,19);c.lineTo(33,-15);c.quadraticCurveTo(18,-23,0,-15);c.fill();c.strokeStyle='#cba98a';c.lineWidth=2;c.beginPath();c.moveTo(0,-15);c.lineTo(0,20);c.stroke();star(c,-17,0,6,'#f5c96f');kalp(c,15,0,6,'#ec9fb0');c.restore();}
  function basla(o){if(aktif||o.faz||P.ucus||DURUM!=='oyun'||!P.ground||P.fade>0)return;
    o.faz=1;o.t=0;o.fx=P.x;o.fy=o.y;o.mx=P.x+90;o.prx=P.x-110;o.pry=o.y-150;V12.final=true;aktif=o;P.ucus=o;P.vx=P.vy=P.buf=P.kilit=P.fade=0;
    if(typeof omHepsiniBirak==='function')omHepsiniBirak();OLAY.emit('kampusFinalBasla',{o,duration:SURE});
  }
  function birak(o,tamam){if(P.ucus===o){P.ucus=null;P.x=P.rx=o.fx;P.y=P.ry=o.fy;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.air=0;P.ground=true;P.dj=true;P.f=1;P.kilit=tamam?3:0;}
    if(aktif===o)aktif=null;
    if(typeof ANNE12!=='undefined'&&ANNE12&&ANNE12.reset)ANNE12.reset(P);
    if(typeof D!=='undefined'){D.x=P.x-70;D.y=P.y-115;D.vx=D.vy=0;if(tamam)D.dz=1;}
    if(typeof omHepsiniBirak==='function')omHepsiniBirak();
    if(tamam&&!o.done){o.done=true;OLAY.emit('kampusFinalBitti',{o});}else if(!tamam&&!o.done){o.faz=0;V12.final=false;}
  }
  OLAY.on('durum',d=>{if(aktif&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')birak(aktif,false);});
  TUR.kaydet('kampusFinal',{
    kur(o){o.t=0;o.faz=0;o.done=false;o.fx=o.x;o.fy=o.y;o.mx=o.x+90;o.prx=o.x-110;o.pry=o.y-150;
      o.adim=()=>{if(P.ucus===o){P.x=o.fx;P.y=o.fy;P.vx=P.vy=P.buf=0;P.ground=true;}};
      o.kameraFn=()=>{if(typeof omDkEkle==='function')omDkEkle(o.fx-280,o.fy-390,o.fx+300,o.fy+20);};},
    guncelle(o,dt){if(DURUM!=='oyun'||o.done||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);
      if(!o.faz&&Math.abs(P.x-o.x)<3*T&&P.ground&&!P.ucus)basla(o);
      if(!o.faz||P.ucus!==o)return;o.t+=dt;
      if(typeof omDikkat==='function')omDikkat('kampusFinal',1.5,o.kameraFn,1,.48);
      if(o.t>=SURE)birak(o,true);
    },
    ciz(o,tm){if(!o.faz||o.done||P.ucus!==o)return;const a=o.t,x=o.fx,y=o.fy, intro=ease(a/2),fade=a>SURE-2?C((SURE-a)/2,0,1):1;
      g.save();g.globalAlpha=intro*fade;
      // Gün batımı ve yansımalar; gradyanlar glow() içinde tek kez önbelleklenir.
      soft(g,'#ffcc89',x+230,y-290,300,240,.32);soft(g,'#ffdcb4',x+230,y-290,115,110,.7);oval(g,x+230,y-290,36,36,'#ffe6b0');
      // Anılar Pırıl'ın çevresinde birer birer canlanır: uçurtma, kitap ve kayık.
      const icons=[kucukUcurtma,kucukKitap,kucukKayik];for(let i=0;i<3;i++){
        const al=ease((a-(5+i*3.2))/1.5)*fade;if(al<=0)continue;const xx=x-215+i*215,yy=y-230-(i%2)*70+Math.sin(a*1.4+i)*7;
        g.save();g.globalAlpha*=al;soft(g,'#fff3d6',xx,yy,74,68,.45);icons[i](g,xx,yy,.8,tm);g.restore();}
      // Sınırlı parçacık bütçesi: samimi, yumuşak gün ışığı.
      for(let i=0;i<16;i++){const u=(a*.045+i*.131)%1,xx=x-290+i*37+Math.sin(a*.5+i)*8,yy=y-30-u*350;g.globalAlpha=intro*fade*Math.sin(Math.PI*u)*.75;star(g,xx,yy,2+i%3,i%2?'#ffe7a8':'#ffd3e1');}
      g.restore();
    },
    cizOn(o,tm){if(!o.faz||o.done||P.ucus!==o)return;const a=o.t,x=o.fx,y=o.fy, yakin=ease((a-1.2)/3),ayril=ease((a-25.5)/2.5),sari=ease((a-4.2)/1.6)*(1-ayril);
      const mx=x+90-74*yakin+48*ayril;
      // Aynı küçük hareket iki karaktere birlikte uygulanır; aralarındaki
      // sarılma mesafesi korunur, yaklaşırken etki yumuşakça başlar.
      const salinim=Math.sin(tm*2.2)*.8*sari,nefes=Math.sin(tm*1.9)*.35*sari;
      // Anne yaklaşır; Feza kollarını açar, sonra yan yana sarılıp hafifçe salınırlar.
      if(typeof anne12Ciz==='function')anne12Ciz(g,mx+salinim,y+nefes,1,tm,{poz:ayril>.98?'dur':sari>.5?'saril':yakin<.95?'yuru':'el',yon:ayril>.98?1:-1,hareket:yakin<.95?0.75:0});
      if(typeof fezaCizPoz==='function')fezaCizPoz(g,x+salinim,y+nefes,1,sari>.2?'kucak9':'ayakta_yan',tm,null,{u:sari,boy:.7});
      if(typeof pirilCizPoz==='function'){const px=x-90+Math.sin(a*.75)*24,py=y-145+Math.sin(a*1.5)*10;g.save();pirilCizPoz(g,px+(x-70-px)*ayril,py+(y-115-py)*ayril,.75+.25*ayril,'ucus',tm);g.restore();}
      if(sari>.3){g.save();g.globalAlpha=.55*sari;kalp(g,x+15+salinim,y-120+nefes+Math.sin(a*1.8)*5,7,'#ffb2c8');g.restore();}
    },
    testBitir(o){if(!o.faz)basla(o);if(P.ucus===o)birak(o,true);}
  });
})();
