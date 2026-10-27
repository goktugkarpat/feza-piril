/* Kampüs göletinde anneyle yumuşak, yönlendirilebilir kayık gezisi.
   `nesne('kampusKayik', 190, yuzey(190), {inisX:nx(305),inisY:yuzey(305)})`.
   Kaybetme yok: dokunma/klavye su üzerinde yön verir, rota 45 saniyede ilerler. */
'use strict';
(() => {
 let aktif=null;
 const clamp12=(x,a,b)=>Math.max(a,Math.min(b,x));
 // Gölet görseli ekrana cover ile çizilir. Kayığın su çizgisini aynı resmin
 // içindeki su bandına bağla; fizik/iniş koordinatları yine dünya zemininde kalır.
 function suHazir(){return typeof DN12_LAKE!=='undefined'&&!!DN12_LAKE&&!!DN12_LAKE.complete&&!!DN12_LAKE.naturalWidth&&!!DN12_LAKE.naturalHeight;}
 function suOfset(k){
  if(typeof DN12_LAKE==='undefined'||!DN12_LAKE||!DN12_LAKE.complete||!DN12_LAKE.naturalWidth||!DN12_LAKE.naturalHeight||typeof W!=='number'||typeof H!=='number'||typeof S!=='number'||!(S>0)||typeof cam==='undefined'||!Number.isFinite(cam.y))return 0;
  const scale=Math.max(W/DN12_LAKE.naturalWidth,H/DN12_LAKE.naturalHeight),height=DN12_LAKE.naturalHeight*scale;
  // Gövde ve kürek merkezin altında da yer kapladığından orta hattı suyun
  // üst yarısına koy; yönlendirme sonunda da kıyı bitkilerine taşmasın.
  const screenY=height*.50-Math.max(0,height-H)*.25;
  const q=clamp12(k.suKar==null?1:k.suKar,0,1),u=q*q*(3-2*q);
  return (cam.y+screenY/S-k.y0)*u;
 }
 function ses(ad,v){if(typeof AU!=='undefined'&&AU&&AU.sfx)try{AU.sfx(ad,v);}catch(_) {}}
 function temizle(){if(typeof omHepsiniBirak==='function')omHepsiniBirak();}
 // anne12Ciz'in kayık pozundaki ön elinin dönüşümü: (.96 ölçek, sol yön,
 // oturuşta 18 birim aşağı ve .88 dikey ölçek). Kürek bu noktadan döner.
 function kurek(k,x,y){const a=.52+Math.sin(k.kurekT*2*Math.PI/2.7-.4)*.30,hx=x+22-23*.96,hy=y+24+.96*(18-51*.88),uzun=74;
  return {hx,hy,a,tx:hx+Math.cos(a)*uzun,ty:hy+Math.sin(a)*uzun,su:y+38};}
 function basla(o){if(aktif||P.ucus||o.done||DURUM!=='oyun'||!P.ground||P.fade>0||P.kilit>.05)return;
  const k=o.k12;aktif=o;k.aktif=true;k.t=0;k.yol=0;k.itki=0;k.komut=0;k.kurekT=0;k.x0=P.x;k.y0=o.y-60;k.y=k.y0;k.hedef=k.y0;k.sure=45;k.kurekIslak=false;k.suHalka.length=0;k.suKar=suHazir()?1:0;P.ucus=o;P.vx=P.vy=P.buf=P.kilit=P.fade=0;temizle();OLAY.emit('kampusKayikBasla',{o});}
 function birak(o,tamam){const k=o.k12;if(P.ucus===o){P.ucus=null;P.x=P.rx=tamam?o.inisX:k.x0;P.y=P.ry=tamam?o.inisY:o.y;P.safeX=P.x;P.safeY=P.y;P.vx=P.vy=P.buf=P.fade=P.kilit=P.air=0;P.ground=true;P.dj=true;P.f=1;}
  k.aktif=false;if(!tamam)o.x=k.baslangicX;if(aktif===o)aktif=null;temizle();if(tamam&&!o.done){o.done=true;o.tk.bitti=true;OLAY.emit('kampusKayikBitti',{o});}}
 function adim(o,dt,u){const k=o.k12;if(!k.aktif||P.ucus!==o||DURUM!=='oyun'||!(dt>0)||!Number.isFinite(dt))return;dt=Math.min(dt,.05);
  if(suHazir())k.suKar=Math.min(1,k.suKar+dt/.45);else k.suKar=0;
  k.t+=dt;const hareket=!!(u&&(u.basili||u.eksenX||u.eksenY));k.komut=hareket?.65:Math.max(0,k.komut-dt);k.itki+=((k.komut>0?1:0)-k.itki)*(1-Math.exp(-dt*4));
  k.yol+=dt*(1+.35*k.itki);k.kurekT+=dt*(1+.35*k.itki);const w=clamp12(k.yol/k.sure,0,1), easing=w*w*(3-2*w);P.x=k.x0+(o.inisX-k.x0)*easing; o.x=P.x;
  if(u){if(u.basili&&Number.isFinite(u.hedefY))k.hedef=clamp12(u.hedefY-suOfset(k),k.y0-25,k.y0+25);else if(u.eksenY)k.hedef=clamp12(k.hedef+u.eksenY*dt*110,k.y0-25,k.y0+25);}
  k.y+=(k.hedef-k.y)*(1-Math.exp(-dt*3));P.y=k.y+Math.sin(k.t*2)*3;P.vx=P.vy=P.buf=0;P.ground=false;
  // Halkalar teknenin ucuna yapışmaz: giriş anındaki dünya konumunda genişler.
  const r=kurek(k,P.x,P.y),islak=r.ty>=r.su;
  for(let i=k.suHalka.length-1;i>=0;i--){k.suHalka[i].yas+=dt;if(k.suHalka[i].yas>1.8)k.suHalka.splice(i,1);}
  if(islak&&!k.kurekIslak){k.suHalka.push({x:r.tx,y:r.su,yas:0});if(k.suHalka.length>4)k.suHalka.shift();}
  k.kurekIslak=islak;
  for(let i=0;i<k.halka.length;i++){const h=k.halka[i],hy=k.y0-5+Math.sin(i*2.4)*16;if(!h.hit&&Math.abs(P.x-h.x)<38&&Math.abs(P.y-hy)<48){h.hit=true;h.parla=1;ses('parilti',.45);OLAY.emit('kampusKayikHalka',{o,i});}h.parla=Math.max(0,h.parla-dt*.6);}
  if(w>=1)birak(o,true);
 }
 function oval(x,y,rx,ry,col){g.fillStyle=col;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
 // Teknenin boyası ve damarları bir kez küçük tuvallerde hazırlanır; hareket sırasında
 // gradyan, gölge filtresi ya da yeni tuval oluşturulmaz.
 let sanat=null;
 function hazirla(){
  if(sanat)return true;if(typeof document==='undefined'||!document.createElement)return false;
  const mk=()=>{const c=document.createElement('canvas');c.width=520;c.height=190;const q=c.getContext('2d');q.scale(2,2);q.translate(130,45);q.lineCap='round';q.lineJoin='round';return {c,q};};
  const ark=mk(),q=ark.q;let gr=q.createLinearGradient(0,-35,0,8);gr.addColorStop(0,'#f0c58d');gr.addColorStop(.3,'#b7784e');gr.addColorStop(1,'#744634');
  q.fillStyle=gr;q.beginPath();q.moveTo(-119,-12);q.quadraticCurveTo(-95,-31,-53,-31);q.quadraticCurveTo(6,-39,68,-29);q.quadraticCurveTo(100,-25,119,-12);q.lineTo(101,8);q.quadraticCurveTo(0,20,-101,8);q.closePath();q.fill();
  q.fillStyle='#674232';q.beginPath();q.ellipse(0,-12,104,15,0,0,Math.PI*2);q.fill();
  q.fillStyle='#946041';q.beginPath();q.ellipse(0,-10,96,11,0,0,Math.PI*2);q.fill();
  q.strokeStyle='rgba(255,224,173,.65)';q.lineWidth=3;q.beginPath();q.moveTo(-111,-13);q.quadraticCurveTo(-10,-34,110,-13);q.stroke();
  // İki kavisli oturak, arka oturakta katlı yumuşak minder.
  for(const x of [-39,38]){q.fillStyle='#ce9665';q.beginPath();q.roundRect(x-23,-20,46,9,4);q.fill();q.strokeStyle='#edbf89';q.lineWidth=1.5;q.stroke();}
  q.fillStyle='#f1c0a8';q.beginPath();q.roundRect(-50,-23,25,6,3);q.fill();
  const on=mk(),p=on.q;gr=p.createLinearGradient(0,-15,0,44);gr.addColorStop(0,'#e1af79');gr.addColorStop(.12,'#bb8057');gr.addColorStop(.55,'#98603f');gr.addColorStop(1,'#684638');
  p.beginPath();p.moveTo(-119,-14);p.quadraticCurveTo(-108,15,-83,28);p.quadraticCurveTo(-54,42,0,42);p.quadraticCurveTo(54,42,83,28);p.quadraticCurveTo(108,15,119,-14);p.quadraticCurveTo(48,-3,0,-4);p.quadraticCurveTo(-48,-3,-119,-14);p.closePath();p.fillStyle=gr;p.fill();
  p.save();p.clip();
  p.strokeStyle='rgba(90,46,29,.35)';p.lineWidth=1.2;for(const yy of [5,16,27,37]){p.beginPath();p.moveTo(-110,yy-4);p.quadraticCurveTo(0,yy+9,110,yy-4);p.stroke();}
  p.strokeStyle='rgba(255,220,173,.24)';p.lineWidth=1;for(let j=0;j<11;j++){const yy=2+j*3;p.beginPath();p.moveTo(-105+(j%3)*9,yy);p.bezierCurveTo(-54,yy+4,-25,yy-3,17,yy+2);p.bezierCurveTo(50,yy+5,75,yy,104,yy-2);p.stroke();}
  p.strokeStyle='rgba(255,229,181,.35)';p.lineWidth=2;p.beginPath();p.moveTo(-83,21);p.quadraticCurveTo(-20,35,66,23);p.stroke();p.restore();
  p.strokeStyle='#754a35';p.lineWidth=3;p.beginPath();p.moveTo(-119,-14);p.quadraticCurveTo(-66,-1,0,-4);p.quadraticCurveTo(66,-1,119,-14);p.stroke();
  p.strokeStyle='rgba(255,229,184,.9)';p.lineWidth=2;p.beginPath();p.moveTo(-113,-14);p.quadraticCurveTo(0,0,113,-14);p.stroke();
  for(const xx of [-82,-41,0,41,82]){p.fillStyle='#f4cf92';p.beginPath();p.arc(xx,-6+Math.abs(xx)*-.04,1.7,0,Math.PI*2);p.fill();}
  sanat={arka:ark.c,on:on.c};return true;
 }
 function ciz(o,t){const k=o.k12;if(!k.aktif)return;g.save();g.translate(0,suOfset(k));for(let i=0;i<k.halka.length;i++){const h=k.halka[i];if(h.x<cam.x-100||h.x>cam.x+VW+100)continue;
   const yy=k.y0-5+Math.sin(i*2.4)*16;g.strokeStyle=h.hit?'rgba(255,238,163,.4)':'rgba(255,241,170,.9)';g.lineWidth=7;g.beginPath();g.ellipse(h.x,yy,35+Math.sin(t*2+h.x)*3,17,0,0,Math.PI*2);g.stroke();}
  g.restore();}
 function on(o,t){const k=o.k12;if(!k.aktif||P.ucus!==o)return;const x=P.x,y=P.y,r=kurek(k,x,y);g.save();g.translate(0,suOfset(k));
  // Gölet yansıması gövdeye bağlanır, arkadaki su halkaları hareketle kayar.
  oval(x+3,y+38,110,8,'rgba(57,113,119,.2)');oval(x+4,y+41,75,3,'rgba(240,255,247,.25)');
  for(let i=0;i<4;i++){const u=(k.kurekT*.17+i*.24)%1;g.globalAlpha=(.35+k.itki*.15)*(1-u);g.strokeStyle='#e6fff9';g.lineWidth=1.8+k.itki*.5;g.beginPath();g.ellipse(x-65-i*27,y+38+i*3,26+u*24,4+u*5,0,.15,Math.PI*1.85);g.stroke();}g.globalAlpha=1;
  for(const h of k.suHalka){const u=clamp12(h.yas/1.8,0,1);g.globalAlpha=.55*(1-u);g.strokeStyle='#effff6';g.lineWidth=1.5;g.beginPath();g.ellipse(h.x,h.y,5+u*27,2+u*7,0,0,Math.PI*2);g.stroke();}g.globalAlpha=1;
  if(hazirla())g.drawImage(sanat.arka,x-130,y-45,260,95);
  // Aynı tekne oturağındalar: çizim sırası gövde önlüğünün bacakları örtmesini sağlar.
  if(typeof anne12Ciz==='function')anne12Ciz(g,x+22,y+24,.96,t,{poz:'kayik',yon:-1,hareket:.5});
  if(typeof fezaCizPoz==='function')fezaCizPoz(g,x-19,y+7,.91,'binis',t,null,{ruzgar:.12});
  if(typeof pirilCizPoz==='function')pirilCizPoz(g,x-78,y-84+Math.sin(t*2)*4,.57,'ucus',t);
  if(sanat)g.drawImage(sanat.on,x-130,y-45,260,95);
  // Sap gerçek el konumunda sabit kalır; palanın ucunda suya girme/çıkma görünür.
  g.save();g.translate(r.hx,r.hy);g.rotate(r.a);g.lineCap='round';g.strokeStyle='#805236';g.lineWidth=7;g.beginPath();g.moveTo(-6,0);g.lineTo(74,0);g.stroke();
  g.strokeStyle='#d7a16f';g.lineWidth=3.4;g.beginPath();g.moveTo(-6,-.8);g.lineTo(72,-.8);g.stroke();g.translate(74,0);oval(0,0,18,7,'#b98255');oval(-2,-2,14,2,'#f1c58e');g.restore();
  // Annenin eli sapı önden kavrar; ışık, avuçla birlikte hareket eder.
  oval(r.hx,r.hy,3.6,3.4,'#f2c8ac');oval(r.hx-1,r.hy-1,1.8,1,'#ffe5cc');
  g.restore();}
 OLAY.on('durum',d=>{if(aktif&&d!=='oyun'&&d!=='mola'&&d!=='duraklat')birak(aktif,false);});
 TUR.kaydet('kampusKayik',{
  kur(o){o.done=false;o.tk={bitti:false};if(!Number.isFinite(o.inisX))o.inisX=o.x+4500;if(!Number.isFinite(o.inisY))o.inisY=o.y;
   o.k12={aktif:false,t:0,yol:0,itki:0,komut:0,kurekT:0,baslangicX:o.x,y0:o.y-60,y:o.y-60,hedef:o.y-60,x0:o.x,sure:45,kurekIslak:false,suHalka:[],halka:Array.from({length:8},(_,i)=>({x:o.x+(o.inisX-o.x)*(i+1)/9,hit:false,parla:0}))};o.adim=(dt,u)=>adim(o,dt,u);},
  guncelle(o,dt){if(!sanat&&Math.abs(P.x-o.x)<1800)hazirla();if(DURUM==='oyun'&&!o.done&&!P.ucus&&P.x>o.x-70&&P.x<o.x+120&&Math.abs(P.y-o.y)<100)basla(o);},ciz,cizOn:on,
  testBitir(o){if(!o.k12.aktif)basla(o);if(o.k12.aktif)birak(o,true);}
 });
})();
