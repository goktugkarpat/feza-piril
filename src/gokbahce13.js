/* Göğün yaşayan sakinleri ve ışık çağlayanları. İpek Göğü'ne özgüdür.
   Saydam çizim atlasları bir kez hazırlanır; ayrı döngü veya ses bağlamı yok. */
'use strict';
(function(){
 if(typeof BOLUM_NO==='undefined'||BOLUM_NO!==13)return;
 const G={step:0,art:Object.create(null),ready:false,kopru:-99,iz:-99,perde:-99,finalT:-1,finalClock:0,finalAlpha:0,finalHello:false,gaze:{x:0,y:0,u:0}};
 const tau=Math.PI*2,rr=n=>{const v=Math.sin(n*91.173+7.73)*43758.5453;return v-Math.floor(v);};
 const rays=[{x:19280,y:300,s:.68,k:0,tap:-100},{x:21600,y:278,s:.86,k:1,tap:-100},{x:23950,y:240,s:.6,k:2,tap:-100}];
 const falls=[{x:5650,y:372,s:.75,k:0},{x:13940,y:278,s:.84,k:1},{x:17740,y:326,s:.68,k:2}];
 const finalRay={x:0,y:0,s:.92,k:3,tap:-100,final:true};
 const cv=(w,h)=>{const a=document.createElement('canvas');a.width=w;a.height=h;return a;};
 function glow(){
  const a=cv(256,256),c=a.getContext('2d'),im=c.createImageData(256,256),d=im.data;let seed=13107;
  // Büyütülmüş ışıkta GPU'nun düzenli gradient benekleri görünmesin.
  // Yalnız hazırlama sırasında yazılır; karede piksel okuma/yazma yoktur.
  for(let y=0;y<256;y++)for(let x=0;x<256;x++){
   const r=Math.hypot(x-127.5,y-127.5)/126,i=(y*256+x)*4;if(r>=1)continue;
   seed=(Math.imul(seed,1664525)+1013904223)|0;const noise=(seed>>>0)/4294967296-.5,u=smooth(Math.min(1,r/.58));
   d[i]=197+(85-197)*u;d[i+1]=252+(181-252)*u;d[i+2]=255+(244-255)*u;
   d[i+3]=Math.max(0,Math.min(255,.7*Math.exp(-3.6*r)*smooth(Math.min(1,(1-r)/.3))*255+noise*.65));
  }
  c.putImageData(im,0,0);return a;
 }
 function grain(c,x,y,w,h,n,seed){
  c.save();c.globalAlpha=.075;
  for(let i=0;i<n;i++){c.fillStyle=i%3?'#efffff':'#1d5179';const xx=x+rr(i+seed)*w,yy=y+rr(i*3+seed)*h,r=.45+rr(i*5+seed)*1.6;c.beginPath();c.ellipse(xx,yy,r*2.4,r,rr(i+2)*tau,0,tau);c.fill();}
  c.restore();
 }
 function body(){
  const a=cv(760,340),c=a.getContext('2d');c.translate(360,188);
  c.save();c.beginPath();c.moveTo(250,-8);c.bezierCurveTo(251,-58,196,-87,122,-82);c.bezierCurveTo(68,-113,-38,-91,-105,-51);c.bezierCurveTo(-148,-43,-164,-32,-190,-28);c.quadraticCurveTo(-162,-3,-135,1);c.bezierCurveTo(-76,65,79,82,191,43);c.quadraticCurveTo(252,29,250,-8);c.closePath();c.clip();
  const q=c.createLinearGradient(-60,-120,100,100);q.addColorStop(0,'#edfaff');q.addColorStop(.18,'#b8e9ed');q.addColorStop(.42,'#66b9cd');q.addColorStop(.72,'#427baf');q.addColorStop(1,'#505a9a');c.fillStyle=q;c.fillRect(-250,-145,540,270);
  c.fillStyle='rgba(242,255,248,.44)';c.beginPath();c.moveTo(-160,-26);c.bezierCurveTo(-47,-104,129,-112,224,-47);c.bezierCurveTo(154,-70,-10,-66,-160,-26);c.fill();
  c.fillStyle='rgba(231,218,255,.32)';c.beginPath();c.moveTo(-100,22);c.bezierCurveTo(9,61,151,45,239,4);c.bezierCurveTo(212,57,5,103,-100,22);c.fill();
  // Seyrek sedef lekeleri ve kesilen yumuşak kıvrımlar: yanakta paralel şerit yok.
  for(let j=0;j<13;j++){const x=-124+rr(j+42)*328,y=-56+rr(j*3+17)*108,r=18+rr(j*7+21)*32,q=c.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,j%3?'rgba(215,252,240,.11)':'rgba(183,162,237,.13)');q.addColorStop(1,'rgba(150,209,235,0)');c.fillStyle=q;c.fillRect(x-r,y-r,r*2,r*2);}
  for(let j=0;j<7;j++){const end=76+rr(j+13)*98;c.strokeStyle=j%3?'rgba(218,255,247,.12)':'rgba(52,97,148,.13)';c.lineWidth=.7+rr(j+8)*1.3;c.beginPath();c.moveTo(-136+j*9,-2+j*5);c.bezierCurveTo(-57+j*8,19+j*3,61+j*8,34-j*2,end,-7-j*.8);c.stroke();}
  grain(c,-195,-110,455,200,950,31);c.restore();
  // Organik bulut kıvrımları sert bir kontur yerine üst kenarda ışık yakalar.
  c.strokeStyle='rgba(229,255,254,.68)';c.lineWidth=2;c.beginPath();c.moveTo(-142,-38);c.bezierCurveTo(-76,-93,28,-102,102,-83);c.bezierCurveTo(152,-87,211,-71,235,-42);c.stroke();
  return a;
 }
 function wing(){
  // Kaplama tek kez boyanır. Yüzgecin kenarı ve damarları her karede esner;
  // bütün bir kartı döndürmek veya görünür dilimler birleştirmek gerekmez.
  const a=cv(430,350),c=a.getContext('2d');c.translate(350,280);
  const q=c.createLinearGradient(-230,-260,-70,55);q.addColorStop(0,'#e6fbf7');q.addColorStop(.25,'#a1e0e9');q.addColorStop(.56,'#66afd0');q.addColorStop(.8,'#577cae');q.addColorStop(1,'#555b96');c.fillStyle=q;c.fillRect(-350,-280,430,350);
  grain(c,-350,-280,430,350,850,117);return a;
 }
 function tail(){
  const a=cv(470,190),c=a.getContext('2d');c.translate(445,95);const q=c.createLinearGradient(-420,-20,0,45);q.addColorStop(0,'rgba(187,238,247,0)');q.addColorStop(.24,'rgba(144,222,232,.3)');q.addColorStop(.7,'#83bdd7');q.addColorStop(1,'#83bdd7');c.fillStyle=q;c.fillRect(-445,-95,470,190);grain(c,-420,-75,440,150,390,229);return a;
 }
 function source(){
  const a=cv(620,300),c=a.getContext('2d');c.translate(310,142);c.save();c.beginPath();c.moveTo(-228,-16);c.bezierCurveTo(-166,-69,-84,-61,-36,-78);c.bezierCurveTo(40,-114,143,-61,221,-17);c.bezierCurveTo(179,7,180,64,108,85);c.lineTo(67,123);c.lineTo(8,99);c.lineTo(-47,137);c.lineTo(-84,76);c.bezierCurveTo(-161,85,-201,48,-228,-16);c.closePath();c.clip();
  const q=c.createLinearGradient(0,-90,0,145);q.addColorStop(0,'#3b7980');q.addColorStop(.22,'#214d69');q.addColorStop(.6,'#142b4a');q.addColorStop(1,'#0b1b35');c.fillStyle=q;c.fillRect(-270,-130,550,300);
  for(let j=0;j<18;j++){const x=-225+rr(j+62)*450,y=-35+rr(j*5+17)*140;c.fillStyle=j%2?'rgba(115,176,174,.13)':'rgba(4,17,40,.26)';c.beginPath();c.moveTo(x,y);c.lineTo(x+38+rr(j)*70,y-27);c.lineTo(x+20,y+49);c.lineTo(x-43,y+8);c.fill();}
  grain(c,-240,-100,480,220,1400,305);c.restore();
  c.strokeStyle='#558f88';c.lineWidth=13;c.lineCap='round';c.beginPath();c.moveTo(-210,-21);c.bezierCurveTo(-126,-55,-69,-54,-32,-65);c.bezierCurveTo(65,-95,155,-41,207,-16);c.stroke();
  c.strokeStyle='rgba(158,225,188,.7)';c.lineWidth=2;c.beginPath();c.moveTo(-207,-27);c.bezierCurveTo(-104,-65,-71,-53,-29,-71);c.bezierCurveTo(46,-90,149,-44,201,-21);c.stroke();
  // Kenarda eğilmiş ince ışık otları; şelale bir plakanın altından çıkmaz.
  for(let j=0;j<36;j++){const x=-202+j*11.2,y=-27-Math.sin(j*.12)*25;c.strokeStyle=j%4?'#598c87':'#a3cdb1';c.lineWidth=.7+rr(j)*1.1;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-9,y-15,x+Math.sin(j)*9,y-22-rr(j+2)*23);c.stroke();}
  return a;
 }
 function stream(){
  const a=cv(160,650),c=a.getContext('2d');const q=c.createLinearGradient(0,0,0,650);q.addColorStop(0,'rgba(130,239,241,.6)');q.addColorStop(.25,'rgba(113,207,242,.28)');q.addColorStop(.75,'rgba(138,158,238,.1)');q.addColorStop(1,'rgba(132,170,240,0)');c.fillStyle=q;
  c.beginPath();c.moveTo(48,0);c.bezierCurveTo(29,100,60,166,34,274);c.bezierCurveTo(20,406,43,507,2,650);c.lineTo(155,650);c.bezierCurveTo(110,480,133,371,105,256);c.bezierCurveTo(93,146,125,78,109,0);c.closePath();c.fill();
  return a;
 }
 function isit(){
  if(G.ready)return true;
  const builders=[['halo',glow],['body',body],['wing',wing],['tail',tail],['source',source],['stream',stream]],b=builders[G.step++];
  if(b)G.art[b[0]]=b[1]();if(G.step>=builders.length)G.ready=true;return G.ready;
 }
 function fin(phase,aim){
  const bend=Math.sin(phase-.36)*29,tip=Math.sin(phase-.92)*51;
  g.save();g.rotate(Math.sin(phase)*.105+aim*.035);g.beginPath();g.moveTo(9,1);
  g.bezierCurveTo(-34,-31,-76,-79,-128,-111+bend*.4);
  g.bezierCurveTo(-185,-174+bend,-244,-226+tip,-308,-200+tip);
  g.bezierCurveTo(-272,-148+tip*.6,-245,-97+bend*.55,-203,-69+bend*.4);
  g.bezierCurveTo(-132,-33+bend*.3,-81,13,-20,20);g.quadraticCurveTo(-2,22,9,1);g.closePath();g.clip();
  g.drawImage(G.art.wing,-350,-280,430,350);
  g.lineWidth=1.15;
  for(let j=0;j<4;j++){g.strokeStyle=j%2?'rgba(231,255,248,.2)':'rgba(45,98,150,.14)';g.beginPath();g.moveTo(-38-j*9,-16-j*9);g.bezierCurveTo(-97,-53-j*5+bend*.2,-169,-80-j*12+bend*.55,-235+j*12,-160+j*3+tip*.65);g.stroke();}
  g.strokeStyle='rgba(232,255,251,.48)';g.lineWidth=1.7;g.beginPath();g.moveTo(-16,-9);g.bezierCurveTo(-102,-62,-158,-218+bend,-307,-200+tip);g.stroke();g.restore();
 }
 function flowingTail(phase){
  const a=Math.sin(phase-.6)*27,b=Math.sin(phase-1.4)*40;
  g.save();g.translate(-70,-7);g.beginPath();g.moveTo(7,-13);
  g.bezierCurveTo(-64,-40,-152,-46+a,-226,-13+a*.7);
  g.bezierCurveTo(-290,17+b*.5,-333,29+b,-409,7+b*.7);
  g.bezierCurveTo(-363,57+b*.7,-289,52+b*.4,-225,18+a*.7);
  g.bezierCurveTo(-136,-22+a,-68,25,8,21);g.closePath();g.clip();
  g.drawImage(G.art.tail,-445,-95,470,190);g.strokeStyle='rgba(208,252,248,.34)';g.lineWidth=1.1;g.beginPath();g.moveTo(0,-2);g.bezierCurveTo(-130,-42+a,-244,47+b,-403,14+b*.7);g.stroke();g.restore();
 }
 function rayX(o,t){return o.x+(o.final?0:Math.sin(t*.11+o.k*2)*140);}
 function rayY(o,t){const u=P.ucus&&P.ucus.tip==='k13Kurdele'?P.ucus.u||0:0,entry=!o.final&&o.k===0?56*(1-smooth(clamp(u/.11,0,1))):0;return o.y+entry+(o.final?0:Math.sin(t*.39+o.k)*28);}
 function cloudRay(o,t,alpha=1){
  const x=rayX(o,t),y=rayY(o,t);
  if(x+540<cam.x||x-540>cam.x+W/S)return;
  const near=Math.max(0,1-Math.abs(P.x-x)/550),aim=P.ucus&&P.ucus.tip==='k13Kurdele'?clamp((P.ucus.aim||0)/150,-1,1):0,phase=t*1.05+o.k,s=o.s,age=t-o.tap,hello=age>=0&&age<2?Math.sin(Math.PI*age/2):0;
  g.save();g.translate(x,y+hello*6);g.rotate(Math.sin(t*.36+o.k)*.025+aim*near*.035-hello*.025);g.scale(s*(1+Math.sin(phase-.3)*.006),s*(1+Math.sin(phase-.3)*.012));
  g.globalCompositeOperation='lighter';g.globalAlpha=(.25+near*.14)*alpha;g.drawImage(G.art.halo,-370,-240,740,480);g.globalCompositeOperation='source-over';
  g.globalAlpha=.76*alpha;flowingTail(phase);
  g.save();g.translate(-22,-28);g.rotate(-.08);g.globalAlpha=.73*alpha;fin(phase-.32,-aim*near);g.restore();
  g.globalAlpha=.91*alpha;g.drawImage(G.art.body,-360,-188,760,340);
  g.save();g.translate(25,6);g.rotate(.26-hello*.06);g.scale(.71,.66);g.globalAlpha=.88*alpha;fin(phase+hello*.45,aim*near);g.restore();
  // Sakin göz kırpma ve yumuşak gülüş, göğün bu sakinini bir nesneden ayırır.
  const blink=(t+o.k*2.1)%5.8,ey=blink<.14?.12:1,look=near*Math.max(0,Math.sin(t*.45+o.k));g.globalAlpha=.9*alpha;
  if(hello>.45){g.strokeStyle='#1c4965';g.lineWidth=2.4;g.lineCap='round';g.beginPath();g.moveTo(185,-20);g.quadraticCurveTo(190,-27,197,-21);g.stroke();}
  else {g.fillStyle='#1c4965';g.beginPath();g.ellipse(191-look,-21+look*2,5.2,6.2*ey,.1,0,tau);g.fill();g.fillStyle='#f1fffa';g.beginPath();g.ellipse(192-look,-23+look*2,1.8,2*ey,0,0,tau);g.fill();}
  g.strokeStyle='#377a90';g.lineWidth=1.4;g.beginPath();g.moveTo(208,7);g.quadraticCurveTo(219,12+hello*4,229,4);g.stroke();
  if(hello>.01){g.globalCompositeOperation='lighter';for(let j=0;j<7;j++){const u=age/2,an=-2.6+j*.53,rad=35+u*62,xx=205+Math.cos(an)*rad,yy=-13+Math.sin(an)*rad*.7;g.globalAlpha=hello*.35*alpha;g.drawImage(G.art.halo,xx-6,yy-6,12,12);}g.globalCompositeOperation='source-over';}
  g.restore();
 }
 function starfall(o,t){
  if(o.x+330<cam.x||o.x-330>cam.x+W/S)return;
  const react=o.k===0?V13.kopru:o.k===1?V13.kelebek:V13.perde,stamp=o.k===0?G.kopru:o.k===1?G.iz:G.perde,age=t-stamp,wake=age>=0&&age<3?Math.sin(age/3*Math.PI):0,ph=t*.6+o.k;
  g.save();g.translate(o.x,o.y+Math.sin(t*.24+o.k)*8);g.scale(o.s,o.s);g.globalAlpha=.65+react*.1;
  g.drawImage(G.art.stream,-80,-4,160,650);
  // Altı ince akış çizgisi, sabit paralel çubuklar yerine birlikte kıvrılır.
  g.save();g.globalAlpha=.36+react*.14+wake*.18;g.lineWidth=.7;g.strokeStyle='#c4f8ef';
  for(let j=0;j<6;j++){const xx=-24+j*9,sw=Math.sin(t*.9+j*.8)*8;g.beginPath();g.moveTo(xx,-3);g.bezierCurveTo(xx+sw,135,xx-sw*.8,290,xx+Math.sin(t*.8+j)*13,438+j*17);g.stroke();}g.restore();
  g.drawImage(G.art.source,-310,-142,620,300);
  g.globalCompositeOperation='lighter';g.globalAlpha=.19+react*.16+wake*.1;g.drawImage(G.art.halo,-190,-120,380,260);g.globalCompositeOperation='source-over';
  for(let j=0;j<12;j++){const u=(ph*.11+j*.083)%1,x=Math.sin(u*6+j)*26,y=25+u*510,a=Math.sin(u*Math.PI)*(.2+react*.3);g.globalAlpha=a;g.drawImage(G.art.halo,x-6,y-14,12,28);}
  g.restore();
 }
 function ciz(t){
  if(!G.ready||!(S>0)||!Number.isFinite(cam.x)||!Number.isFinite(t))return;
  G.gaze.u=0;
  g.save();g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);
  for(const o of falls)starfall(o,t);
  for(const o of rays){cloudRay(o,t);if(P.ucus&&P.ucus.tip==='k13Kurdele'){const x=rayX(o,t),near=Math.max(0,1-Math.abs(P.x-x)/570);if(near*.65>G.gaze.u){G.gaze.x=x+150*o.s;G.gaze.y=rayY(o,t)-15*o.s;G.gaze.u=near*.65;}}}
  const f=P.ucus;
  if(f&&f.tip==='k13Gok'){
   if(G.finalT<0||f.t<G.finalT){G.finalHello=false;finalRay.tap=-100;G.finalClock=t-f.t;}G.finalT=f.t;
   // Dekorun yumuşak yolu çizim saatiyle ilerler; 120Hz fizik adımlarını tekrar etmez.
   if(Math.abs(t-G.finalClock-f.t)>.05)G.finalClock=t-f.t;
   const ft=t-G.finalClock,u=clamp((ft-13.7)/9.3,0,1),fade=smooth(clamp(u/.18,0,1))*smooth(clamp((1-u)/.22,0,1));
   G.finalAlpha=fade*.7;finalRay.x=f.x-540+u*1120;finalRay.y=526-Math.sin(u*Math.PI)*20;
   if(G.finalAlpha>.002){cloudRay(finalRay,t,G.finalAlpha);G.gaze.x=finalRay.x+140;G.gaze.y=finalRay.y-15;G.gaze.u=fade*(1-smooth(clamp((ft-19)/1.5,0,1)));}
   if(fade>.7&&!G.finalHello){G.finalHello=true;OLAY.emit('ipekGokDost',{x:finalRay.x,y:finalRay.y,sira:3});}
  }else {G.finalT=-1;G.finalAlpha=0;}
  g.restore();
 }
 // Aynı uçuş kontrolü sürerken göğün dostuna dokunmak küçük bir selam verir.
 // Girdi yakalanmaz: yaprağın yönü ve alışılmış kontroller aynen çalışır.
 function dokun(e){
  if(!G.ready||!(S>0)||!Number.isFinite(e.clientX)||!Number.isFinite(e.clientY)||DURUM!=='oyun'||!P.ucus||(P.ucus.tip!=='k13Kurdele'&&P.ucus.tip!=='k13Gok')||e.target!==document.getElementById('c')||e.pointerType==='mouse'&&e.button!==0)return;
  const box=e.target.getBoundingClientRect(),px=cam.x+(e.clientX-box.left)*DPR/S,py=cam.y+(e.clientY-box.top)*DPR/S,t=now;
  for(let i=0;i<4;i++){const o=i<3?rays[i]:finalRay;if(o.final&&G.finalAlpha<.18)continue;const x=rayX(o,t),y=rayY(o,t),dx=((px-x)/o.s-45)/245,dy=((py-y)/o.s+8)/95;if(dx*dx+dy*dy>1.3)continue;if(t-o.tap<1.1)return;o.tap=t;OLAY.emit('ipekGokDost',{x,y,sira:o.k});return;}
 }
 addEventListener('pointerdown',dokun,true);
 if(typeof OLAY!=='undefined'){OLAY.on('ipekKopruAdim',()=>{G.kopru=now;});OLAY.on('ipekIz',()=>{G.iz=now;});OLAY.on('ipekPerdeAdim',()=>{G.perde=now;});}
 window.GOK13={isit,ciz,bakisHedef:()=>G.gaze,state(){let pixels=0;for(const k in G.art)pixels+=G.art[k].width*G.art[k].height;return{ready:G.ready,canvases:Object.keys(G.art).length,pixels,greetings:rays.filter(o=>o.tap>-100).length+(finalRay.tap>-100?1:0),finalAlpha:G.finalAlpha};}};
})();
