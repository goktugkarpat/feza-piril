/* İsteğe bağlı çiçeklik: Feza yaklaşınca üç kelebek eşlik eder, sonra konar.
   Girdi, kapı, görev, kayıt ve ilerleme değiştirmez. TUR türü: kampusKelebek. */
'use strict';
(() => {
 const C=['#f3a0b5','#f8cd78','#a7c4ea'];
 const offsets=[-42,0,42];
 // Birden fazla çiçeklik yerleştirilse bile yalnız en yakın küme çizilir:
 // cihazda aynı anda üçten fazla kelebek animasyonu çalışmaz.
 function secili(o){if(typeof NESNELER==='undefined'||!Array.isArray(NESNELER)||typeof P==='undefined'||!Number.isFinite(P.x))return true;let best=null,d=Infinity;
  for(const n of NESNELER)if(n.tip==='kampusKelebek'&&Number.isFinite(n.x)){const dd=Math.abs(n.x-P.x);if(dd<d){d=dd;best=n;}}return !best||best===o;}
 function oval(x,y,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
 function flower(x,y,col){g.strokeStyle='#6ca478';g.lineWidth=2;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-18);g.stroke();
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;oval(x+Math.cos(a)*5,y-21+Math.sin(a)*5,4,4,col);}oval(x,y-21,3,3,'#ffe5a5');}
 function fly(x,y,col,t,i){const flap=.35+.65*Math.abs(Math.sin(t*5+i*1.5));g.save();g.translate(x,y);g.rotate(Math.sin(t*1.8+i)*.12);
  oval(-6,-3,7*flap,10,col);oval(6,-3,7*flap,10,col);oval(-5,-2,3*flap,4,'rgba(255,255,255,.6)');oval(5,-2,3*flap,4,'rgba(255,255,255,.6)');oval(0,0,2,8,'#826e76');g.restore();}
 TUR.kaydet('kampusKelebek',{
  kur(o){o.kb12={near:false,flight:0,clock:0,cool:0,bugs:offsets.map((v,i)=>({x:o.x+v,y:o.y-30,i}))};},
  guncelle(o,dt){const k=o.kb12;if(!k||typeof DURUM==='undefined'||DURUM!=='oyun'||typeof P==='undefined'||P.ucus||!Number.isFinite(P.x)||!Number.isFinite(P.y)||!secili(o)||(typeof document!=='undefined'&&document.hidden)||!(dt>0)||!Number.isFinite(dt))return;
   dt=Math.min(dt,.05);k.cool=Math.max(0,k.cool-dt);const dx=Math.abs(P.x-o.x),near=dx<115&&Math.abs(P.y-o.y)<110;
   if(dx>190)k.near=false;
   if(near&&!k.near){k.near=true;k.flight=4.8;if(k.cool<=0&&!(typeof SESSIZ!=='undefined'&&SESSIZ)&&typeof AU!=='undefined'&&AU&&typeof AU.sfx==='function')try{AU.sfx('parilti',.18);k.cool=8;}catch(_) {}}
   if(dx>1200&&k.flight<=0)return;k.clock+=dt;k.flight=Math.max(0,k.flight-dt);
   for(const b of k.bugs){const i=b.i,air=k.flight>0,tx=air?P.x+(i-1)*35:o.x+offsets[i],ty=air?P.y-112-(i%2)*20+Math.sin(k.clock*2+i)*9:o.y-30;
    const u=1-Math.exp(-dt*(air?2.1:1.5));b.x+=(tx-b.x)*u;b.y+=(ty-b.y)*u;}
  },
  ciz(o){const k=o.kb12;if(!k||typeof P==='undefined'||P.ucus||!secili(o)||(typeof document!=='undefined'&&document.hidden)||typeof cam==='undefined'||!Number.isFinite(cam.x)||typeof VW!=='number')return;
   g.save();if(o.x+150>=cam.x-40&&o.x-150<=cam.x+VW+40)for(let i=0;i<3;i++)flower(o.x+offsets[i],o.y,C[i]);
   // Oyun motoru nesnenin sabit merkezini kamera dışında 500 birimde keser.
   // Takip eden kelebekler hâlâ ekranda olsa bile o sınıra yaklaşırken
   // yumuşakça silinir; son karede aniden kaybolmazlar.
   const kenar=Math.max(0,Math.min(1,(o.x-(cam.x-500))/120,(cam.x+VW+500-o.x)/120));
   g.globalAlpha*=kenar;for(const b of k.bugs)if(b.x>=cam.x-40&&b.x<=cam.x+VW+40)fly(b.x,b.y,C[b.i],k.clock,b.i);
   g.restore();
  }
 });
})();
