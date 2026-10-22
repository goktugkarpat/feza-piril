/* dunya8.js — Balkabağı Gecesi'nin dünyası (Bölüm 8). Mor-lacivert, yıldızlı bir Cadılar Bayramı gecesi: kocaman, gülümseyen
   bal rengi ay, katman katman uzak tepeler (eğri büğrü sevimli evler, sıcak pencereler, tepede cadı evi), balkabağı tarlası
   (kıvrım kıvrım sarmaşıklar), eğri ağaçlı koru (asılı minik fenerler, şeker renkli mantarlar, lolipop ağaçları), kaldırım taşlı
   şeker sokağı (altı eğri ev, bayrak süsleri), Cadı Nine'nin bahçesi ve kulübesi, süpürge yolculuğunun gece manzarası (aşağıda
   köyün çatıları, ışıklı pencereler, yanan kabaklar; ayın önünden geçiş), köy meydanı. Yerde parlayan pembe-mor sis, havada
   ışık tozları (BÖCEK YOK). Fenerler yandıkça (dn8IsikOrani) dünya ısınır ve renklenir; finalden sonra pembe-altın sabah.
   Mimari dunya7.js ile aynı: büyük resimler yalnız önbellek tuvallerinde bir kez boyanır (gök, ay, tepe şeritleri, zemin
   parçaları, sprite'lar); karede yeni gradyan/filtre/gölge yok; parçacık havuzları sabit.
   oyun.js kancaları (omDr 'dn8' öneki): dn8Background dn8Motes dn8World dn8Petals dn8Foreground dn8Vignette, ısıtma dn8Isit.
   Diğer modüllere: dn8IsikOrani() 0..1, dn8Isik(x) yerel ışık 0..1, dn8IsikEkle(x, y, renk) ışık dalgası, dn8Iz(x, y, tip)
   ışık tozu izi, dn8Surface(x) zemin, dn8Ay() ayın dünya konumu {x, y, r}, dn8CatiY(x) uçuşta çatı hizası,
   dn8SaklanOn(tip, x, y) hayaletçik saklanma yerinin ön parçası ('baca' | 'agac'), DN8_KAPI (seker.js kapı boşluğu). */
'use strict';
const DN8={sky:null,dawn:null,ay:null,ayYuz:null,serit:[],chunks:new Map(),prep:0,fx:{},renk:0,sabah:0,fin:0,finT:null,dorukT:null,tamT:null,
 lit:[],kare:0,zeminKare:-9,gokAlt:0,yap:null,ay8:{x:0,y:0,r:80,w:0,sx:0,sy:0,sr:80},kirpT:0,kirpAc:false,evIsik:{},serFx:[],
 cKuyruk:[],dumanT:0,uckT:0,durumT:null};
const dn8Hash=v=>{const s=Math.sin(v*127.1+311.7)*43758.5453;return s-Math.floor(s);};   // sabit sözde rastgele (0..1)
// palet (sözleşme): gece mor-lacivert, ay balı, kabak turuncusu, sıcak fener ışığı, şeker pembesi, nane, limon, lila
const DN8_GECE='#2a1f4e',DN8_AYB='#ffe7a8',DN8_FENER='#ffd27a';
const DN8_SEKER=['#ff8fc8','#7dffc4','#e8ff8a','#c39bff','#ffb347','#8fd8ff'];
const DN8_KAB=['#ff9a3c','#ffb347','#e8702a'];
const DN8_TOZ=['#ffd27a','#ff8fc8','#c39bff','#7dffc4','#ffe7a8','#ffb347','#e8ff8a','#ffc0e0'];   // ışık tozu renkleri
const DN8_GAP0=651*T,DN8_GAP1=802*T;   // süpürge yolculuğu boşluğu (zemin yok; aşağıda köyün çatıları)
const DN8_KAPI={w:66,h:118,x0:-52,x1:74,y0:-178};   // seker.js kapı boşluğu (o.x / o.y'ye göre); evler bu alanı boş bırakır
const dn8Cv=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c;};
const dn8Mix=(a,b,t)=>{const A=hex(a),B=hex(b);return '#'+[0,1,2].map(i=>Math.round(lerp(A[i],B[i],t)).toString(16).padStart(2,'0')).join('');};
const dn8Rgb=h=>{const a=hex(h);return a[0]+','+a[1]+','+a[2];};
const dn8Gece=(col,k)=>dn8Mix(col,'#2a1f4e',k===undefined?.38:k);   // ay ışığında renk: gece moruna karıştır
function dn8Ready(){return W>0&&H>0&&S>0&&typeof cam!=='undefined'&&Number.isFinite(cam.x)&&Number.isFinite(cam.y);}
function dn8Glow(col,x,y,rx,ry,a){if(a<=.003)return;g.globalAlpha=a>1?1:a;g.drawImage(glow(col),x-rx,y-ry,rx*2,ry*2);g.globalAlpha=1;}
const dn8V8=()=>typeof V8!=='undefined'&&V8?V8:null;
// zemin yüzeyi (dünya y'si); boşlukta zemin yok (ROWS*T)
function dn8Surface(x){if(x>=DN8_GAP0&&x<DN8_GAP1)return ROWS*T;const c=Math.max(0,Math.min(COLS-1,Math.floor(x/T)));return topOf(c)*T;}
// bölge adı (BOLUM.bolgeler): giris tarla kabakYuz koru iskelet sokak bahce yolculuk meydan
function dn8Bolge(x){const B=typeof BOLUM!=='undefined'&&BOLUM.bolgeler;if(B)for(let i=0;i<B.length;i++)if(x>=B[i].x0&&x<B[i].x1)return B[i].ad;return 'giris';}

// ════════ Işık durumu: fenerler → yerel sıcak ışık dalgası + genel renklenme; final → hepsi; tamam → sabah ════════
function dn8IsikEkle(x,y,col,uzak){
 if(!Number.isFinite(x))return;if(DN8.lit.length>=48)DN8.lit.shift();
 DN8.lit.push({x,y:Number.isFinite(y)?y:dn8Surface(x)-40,t:now,col:col||DN8_FENER,r:uzak||1100});
}
function dn8OlayX(e){const o=e&&e.o;return o&&Number.isFinite(o.x)?o.x:e&&Number.isFinite(e.x)?e.x:(typeof P!=='undefined'?P.x:0);}
function dn8OlayY(e){const o=e&&e.o;return o&&Number.isFinite(o.y)?o.y-40:e&&Number.isFinite(e.y)?e.y-40:NaN;}
OLAY.on('kabakFener',e=>{dn8IsikEkle(dn8OlayX(e),dn8OlayY(e),'#ffb347');DN8.fenerSay=(DN8.fenerSay||0)+1;});
OLAY.on('hayaletBuldu',e=>dn8IsikEkle(dn8OlayX(e),dn8OlayY(e),'#e8d8ff',520));
OLAY.on('sekerKapi',e=>{const x=dn8OlayX(e);DN8.evIsik[Math.round(x)]=now;dn8IsikEkle(x,dn8OlayY(e),'#ffd27a',700);});
for(const ad of ['kabakYuzBitti','iskeletBitti','kazanBitti'])OLAY.on(ad,e=>{const o=e&&e.o?e:{x:P.x};dn8IsikEkle(dn8OlayX(o),NaN,'#ffd27a',1400);});
OLAY.on('cadiFinal',()=>{if(DN8.finT===null)DN8.finT=now;});
OLAY.on('cadiDoruk',()=>{DN8.dorukT=now;});
OLAY.on('cadiTamam',()=>{if(DN8.tamT===null)DN8.tamT=now;});
function dn8Durum(){
 // Süreye bağlı sönüm: 60/120 Hz aynı ışık geçişi, yinelenen zaman damgasında hareket yok.
 const adim=DN8.durumT===null?0:clamp((now-DN8.durumT)*60,0,15);DN8.durumT=now;
 const v=dn8V8(),top=v&&v.fenerTop?v.fenerTop:12,fe=v?Math.max(v.fener||0,DN8.fenerSay||0):0,f=clamp(fe/top,0,1);
 // fener olayı kaçtıysa (test ya da kayıttan devam): yanmış fenerleri ışık kaynağına ekle
 if(v&&fe>(DN8.fenerSay||0)){DN8.fenerSay=fe;let n=0;for(const o of NESNELER)if(o.tip==='kabakFener'&&(o.yandi||n<fe-(DN8.lit.length))){if(!DN8.lit.some(L=>Math.abs(L.x-o.x)<5)){dn8IsikEkle(o.x,o.y-40,'#ffb347');n++;}if(n>=fe)break;}}
 if(v&&v.final&&DN8.finT===null)DN8.finT=now;
 DN8.fin=DN8.finT===null?0:smooth(clamp((now-DN8.finT)/4,0,1));
 // mini oyunlar ve süpürge de köyü biraz daha aydınlatır
 const ek=v?((v.kabakYuz?1:0)+(v.iskelet?1:0)+(v.kazan?1:0)+(v.supurge?1:0))*.025:0;
 const hedef=Math.max(Math.min(1,smooth(f)*.86+ek),DN8.fin);DN8.renk+=(hedef-DN8.renk)*(1-Math.pow(.97,adim));if(adim>0&&Math.abs(hedef-DN8.renk)<.002)DN8.renk=hedef;
 // sabah: doruktan (28. sn) sonra gün ağarır, 'cadiTamam' (35. sn) ile tamamlanır: pembe-altın gün doğumu
 let sb=0;if(DN8.tamT!==null)sb=smooth(clamp((now-DN8.tamT)/3,0,1));if(DN8.finT!==null)sb=Math.max(sb,smooth(clamp((now-DN8.finT-30.5)/5.5,0,1)));   // doruktan sonra gün ağarmaya başlar
 DN8.sabah=sb;
}
// genel ışık oranı (yumuşatılmış; herkes kullanabilir)
function dn8IsikOrani(){return clamp(DN8.renk,0,1);}
// yerel ışık 0..1: yanan her fenerden saniyede 450 birim yayılan, ~1100 birimde duran yumuşak dalga (sütun başına karede bir kez)
const DN8_ISIK_C=new Float32Array(1024),DN8_ISIK_T=new Float64Array(1024).fill(-1);
function dn8Isik(x){
 const c=Math.max(0,Math.min(1023,Math.floor(x/T)));if(DN8_ISIK_T[c]===now)return DN8_ISIK_C[c];DN8_ISIK_T[c]=now;
 let a=DN8.renk*.32;const xx=c*T+T/2;
 for(let i=0;i<DN8.lit.length;i++){const L=DN8.lit[i],age=now-L.t;if(age<0)continue;const reach=Math.min(age*450,L.r),v=clamp((reach-Math.abs(xx-L.x))/320,0,1);if(v>a)a=v;}
 if(DN8.fin>a)a=DN8.fin;return DN8_ISIK_C[c]=a;
}

// ════════ Önbellek sprite'ları ════════
function dn8FxArt(){
 const F=DN8.fx;if(F.hazir)return F;
 // parıltı: dört köşeli küçük yıldız (ışık tozu, yıldız ışıltısı); sıcak (altın) sürümü
 const yildiz=(col)=>{const cv=dn8Cv(32,32),c=cv.getContext('2d');let gr=c.createRadialGradient(16,16,0,16,16,9);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba('+dn8Rgb(col)+',0)');c.fillStyle=gr;c.fillRect(0,0,32,32);
  c.fillStyle='rgba(255,255,255,.95)';c.beginPath();c.moveTo(16,0);c.quadraticCurveTo(17,15,32,16);c.quadraticCurveTo(17,17,16,32);c.quadraticCurveTo(15,17,0,16);c.quadraticCurveTo(15,15,16,0);c.fill();
  c.globalCompositeOperation='source-atop';c.fillStyle='rgba('+dn8Rgb(col)+',.45)';c.fillRect(0,0,32,32);return cv;};
 F.parilti=yildiz('#f4eaff');F.pariltiA=yildiz('#ffd8a0');F.pariltiP=yildiz('#ffb0dc');
 // kabak yüzü ışığı: oyulmuş göz-ağız biçimlerinin içten parlayan hali (3 çeşit; sıcak altın çekirdek + yumuşak hâle, bir kez gölgeyle)
 F.yuz=[0,1,2].map(v=>{const cv=dn8Cv(96,80),c=cv.getContext('2d');c.translate(48,44);c.shadowColor='#ffb347';c.shadowBlur=9;c.fillStyle='#ffe08a';dn8YuzYol(c,v,1);c.fill();c.shadowBlur=0;
  c.fillStyle='rgba(255,250,220,.9)';c.save();c.scale(.6,.6);dn8YuzYol(c,v,1);c.fill();c.restore();return cv;});
 // pus bandı: alttan yukarı sönen pembe-mor sis (yer sisi); ve yuvarlak sis bulutçuğu
 const bant=(col,a)=>{const cv=dn8Cv(8,128),c=cv.getContext('2d'),gr=c.createLinearGradient(0,0,0,128),r=dn8Rgb(col);gr.addColorStop(0,'rgba('+r+',0)');gr.addColorStop(.55,'rgba('+r+','+(a*.6)+')');gr.addColorStop(1,'rgba('+r+','+a+')');c.fillStyle=gr;c.fillRect(0,0,8,128);return cv;};
 F.pus=[bant('#7a5aa8',.85),bant('#b07ac0',.8),bant('#ffc8a8',.8)];
 const puf=(col,a,yass)=>{const cv=dn8Cv(64,64),c=cv.getContext('2d'),gr=c.createRadialGradient(32,32,0,32,32,32),r=dn8Rgb(col);gr.addColorStop(0,'rgba('+r+','+a+')');gr.addColorStop(.5,'rgba('+r+','+(a*.5)+')');gr.addColorStop(1,'rgba('+r+',0)');c.fillStyle=gr;c.fillRect(0,0,64,64);return cv;};
 F.sis=puf('#c89ae0',.7);F.sisP=puf('#ff9fd0',.6);F.duman=puf('#b8a8e0',.6);F.dumanS=puf('#ffd6c8',.6);
 // bulutçuklar: yassı, alt kenarı düz lavanta bulutlar (göğün önünden, ayın önünden süzülür)
 F.bulut=[0,1,2].map(v=>{const cv=dn8Cv(320,110),c=cv.getContext('2d'),R=rng(301+v*17);
  for(let k=0;k<9;k++){const x=40+R()*240,y=60+R()*20-Math.sin((x-40)/240*Math.PI)*24,r=22+R()*26,gr=c.createRadialGradient(x,y-r*.2,2,x,y,r);gr.addColorStop(0,'rgba(240,206,250,.5)');gr.addColorStop(.7,'rgba(196,160,230,.26)');gr.addColorStop(1,'rgba(180,140,220,0)');c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,6.283);c.fill();}
  c.globalCompositeOperation='destination-out';const gr=c.createLinearGradient(0,78,0,110);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');c.fillStyle=gr;c.fillRect(0,78,320,32);return cv;});
 // asılı kâğıt fener (koru dalları, şenlik ipleri): yuvarlak, çizgili; 4 renk
 F.fener=['#ffb347','#ff8fc8','#c39bff','#7dffc4'].map(col=>{const cv=dn8Cv(40,56),c=cv.getContext('2d');c.translate(20,30);
  c.fillStyle='#4a3050';c.fillRect(-5,-24,10,4);c.fillRect(-5,18,10,4);
  const gr=c.createRadialGradient(-3,-4,2,0,0,17);gr.addColorStop(0,dn8Mix(col,'#ffffff',.55));gr.addColorStop(.6,col);gr.addColorStop(1,dn8Mix(col,'#5a2a50',.35));c.fillStyle=gr;c.beginPath();c.ellipse(0,0,15,19,0,0,6.283);c.fill();
  c.strokeStyle=dn8Mix(col,'#5a2a50',.4);c.lineWidth=1.2;for(const k of [-8,0,8]){c.beginPath();c.ellipse(0,0,Math.abs(k)*1.4+1,19,0,0,6.283);c.stroke();}
  c.fillStyle='#ffd27a';c.beginPath();c.arc(0,24,2.2,0,6.283);c.fill();return cv;});
 // bayrak süsleri: kabak, yarasa (sevimli, yuvarlak), yıldız, üçgen — şeker renklerinde
 F.bayrak=[];
 for(let k=0;k<8;k++){const cv=dn8Cv(40,44),c=cv.getContext('2d'),col=DN8_SEKER[k%6];c.translate(20,4);
  c.fillStyle=dn8Gece(col,.18);c.beginPath();c.moveTo(-15,0);c.lineTo(15,0);c.lineTo(15,22);c.quadraticCurveTo(0,40,-15,22);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.22)';c.fillRect(-15,0,30,3);
  const tip=k%4;c.translate(0,15);
  if(tip===0){c.fillStyle='#ff9a3c';c.beginPath();c.ellipse(-3,0,5,6,0,0,6.283);c.ellipse(3,0,5,6,0,0,6.283);c.fill();c.fillStyle='#5a8a3a';c.fillRect(-1,-9,2,4);c.fillStyle='#5a2a20';c.beginPath();c.arc(-3,-1,1.2,0,6.283);c.arc(3,-1,1.2,0,6.283);c.fill();c.strokeStyle='#5a2a20';c.lineWidth=1;c.beginPath();c.arc(0,1,3,.3,2.84);c.stroke();}
  else if(tip===1){c.fillStyle='#7a5ab0';c.beginPath();c.moveTo(-12,-2);c.quadraticCurveTo(-8,-7,-4,-2);c.quadraticCurveTo(0,-5,4,-2);c.quadraticCurveTo(8,-7,12,-2);c.quadraticCurveTo(8,4,0,4);c.quadraticCurveTo(-8,4,-12,-2);c.fill();c.beginPath();c.arc(0,0,4.5,0,6.283);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(-1.6,-.6,1.3,0,6.283);c.arc(1.6,-.6,1.3,0,6.283);c.fill();}
  else if(tip===2){c.fillStyle='#ffe7a8';c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(Math.cos(an)*7,Math.sin(an)*7);c.lineTo(Math.cos(an+.628)*3,Math.sin(an+.628)*3);}c.closePath();c.fill();}
  else{c.fillStyle='#fff3e0';c.beginPath();c.arc(0,0,4,0,6.283);c.fill();c.fillStyle=col;c.beginPath();c.arc(0,0,2,0,6.283);c.fill();}
  F.bayrak.push(cv);}
 // ışık tozu izi: yerde yumuşak parlayan minik ayak izi
 F.iz=(()=>{const cv=dn8Cv(28,12),c=cv.getContext('2d'),gr=c.createRadialGradient(14,6,0,14,6,12);gr.addColorStop(0,'rgba(255,230,190,.9)');gr.addColorStop(.5,'rgba(230,170,255,.4)');gr.addColorStop(1,'rgba(230,170,255,0)');c.fillStyle=gr;c.beginPath();c.ellipse(14,6,13,5.5,0,0,6.283);c.fill();return cv;})();
 // yanan pencere camı (kemer / yuvarlak / kare): sıcak altın, ortası açık; çerçeve kayıtları gibi kayıtlı ölçüye gerilir (toplamalı)
 F.cam={};for(const st of ['kemer','yuvarlak','kare']){const cv=dn8Cv(64,80),c=cv.getContext('2d'),w=64,h=st==='yuvarlak'?64:80,x=32,y=h/2;
  const gr=c.createRadialGradient(x-6,y+4,2,x,y,h*.62);gr.addColorStop(0,'#fff0c0');gr.addColorStop(.45,'#ffc870');gr.addColorStop(1,'#e8783a');c.fillStyle=gr;c.beginPath();
  if(st==='yuvarlak')c.ellipse(x,y,w/2,h/2,0,0,6.283);else if(st==='kemer'){c.moveTo(0,h);c.lineTo(0,w/2);c.arc(x,w/2,w/2,Math.PI,0);c.lineTo(w,h);c.closePath();}else c.rect(0,0,w,h);c.fill();
  c.strokeStyle='rgba(120,60,40,.55)';c.lineWidth=4;c.beginPath();c.moveTo(x,0);c.lineTo(x,h);if(st!=='yuvarlak'){c.moveTo(0,h*.58);c.lineTo(w,h*.58);}else{c.moveTo(0,y);c.lineTo(w,y);}c.stroke();
  cv.h2=h;F.cam[st]=cv;}
 // gece örtüsü: fenerler yanmadan önce dünyanın alt kısmını hafifçe soğuk-mora boğar (yandıkça açılır); üst kenarı yumuşak
 F.sabahOrtu=(()=>{const cv=dn8Cv(8,128),c=cv.getContext('2d'),gr=c.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(255,214,190,0)');gr.addColorStop(.4,'rgba(255,200,176,.7)');gr.addColorStop(1,'rgba(250,180,170,.9)');c.fillStyle=gr;c.fillRect(0,0,8,128);return cv;})();
 F.ortu=(()=>{const cv=dn8Cv(8,128),c=cv.getContext('2d'),gr=c.createLinearGradient(0,0,0,128);gr.addColorStop(0,'rgba(20,12,56,0)');gr.addColorStop(.3,'rgba(20,12,56,.8)');gr.addColorStop(1,'rgba(20,12,56,1)');c.fillStyle=gr;c.fillRect(0,0,8,128);return cv;})();
 // vinyet: mor köşeler (yalnız kenar parçaları çizilir)
 F.vig=(()=>{const cv=dn8Cv(200,160),v=cv.getContext('2d'),vg=v.createRadialGradient(100,74,48,100,74,126);vg.addColorStop(0,'rgba(24,12,48,0)');vg.addColorStop(.45,'rgba(24,12,48,0)');vg.addColorStop(.6,'rgba(24,12,48,.03)');vg.addColorStop(1,'rgba(24,12,48,.4)');v.fillStyle=vg;v.fillRect(0,0,200,160);return cv;})();
 F.hazir=true;return F;
}
// kabak yüzü yolu (göz + burun + gülümseme); v: 0 yuvarlak gözlü gülen, 1 göz kırpan, 2 üçgen gözlü kocaman gülen — sivri diş yok
function dn8YuzYol(c,v,s){
 c.beginPath();
 if(v===1){c.moveTo(-15*s,-8*s);c.quadraticCurveTo(-10*s,-15*s,-5*s,-8*s);c.quadraticCurveTo(-10*s,-11*s,-15*s,-8*s);}
 else if(v===2){c.moveTo(-16*s,-5*s);c.quadraticCurveTo(-10*s,-18*s,-4*s,-5*s);c.closePath();}
 else c.ellipse(-10*s,-8*s,5*s,6.5*s,0,0,6.283);
 c.moveTo(16*s,-5*s);if(v===2){c.quadraticCurveTo(10*s,-18*s,4*s,-5*s);c.closePath();}else c.ellipse(10*s,-8*s,5*s,6.5*s,0,0,6.283);
 c.moveTo(-2.5*s,0);c.lineTo(2.5*s,0);c.lineTo(0,3.5*s);c.closePath();
 c.moveTo(-15*s,5*s);c.quadraticCurveTo(0,(v===2?22:17)*s,15*s,5*s);c.quadraticCurveTo(0,(v===2?13:10)*s,-15*s,5*s);c.closePath();
}

// ════════ Gök: gece (mor-lacivert, yıldızlar, pembe ufuk) ve sabah (pembe-altın) ════════
function dn8Sky(){
 if(DN8.sky)return;const R=rng(8081);
 let cv=DN8.sky=dn8Cv(768,600),c=cv.getContext('2d'),gr=c.createLinearGradient(0,0,0,600);
 gr.addColorStop(0,'#120a2c');gr.addColorStop(.22,'#1e1446');gr.addColorStop(.45,'#2a1f4e');gr.addColorStop(.64,'#3b2a6e');gr.addColorStop(.8,'#4a3585');gr.addColorStop(.92,'#6a4596');gr.addColorStop(1,'#8a559c');c.fillStyle=gr;c.fillRect(0,0,768,600);
 // ufukta sıcak pembe-turuncu ışıma (köyün ışıkları) ve göğün yumuşak mor bulut lekeleri
 let h=c.createRadialGradient(400,640,20,400,640,420);h.addColorStop(0,'rgba(255,150,140,.26)');h.addColorStop(.45,'rgba(210,110,170,.12)');h.addColorStop(1,'rgba(210,110,170,0)');c.fillStyle=h;c.fillRect(0,0,768,600);
 for(let j=0;j<26;j++){const x=R()*768,y=60+R()*360,r=50+R()*110;h=c.createRadialGradient(x,y,1,x,y,r);const col=j%3===0?'150,90,190':j%3===1?'90,70,170':'190,100,170';h.addColorStop(0,'rgba('+col+','+(.05+R()*.05)+')');h.addColorStop(1,'rgba('+col+',0)');c.fillStyle=h;c.fillRect(x-r,y-r,r*2,r*2);}
 // suluboya fırça izleri ve kâğıt dokusu
 for(let j=0;j<22;j++){const y=120+R()*320,x=R()*768,w=80+R()*220,hh=3+R()*8;c.fillStyle=j%3?'rgba(255,200,236,.04)':'rgba(40,20,90,.08)';c.beginPath();c.ellipse(x,y,w,hh,-.02,0,6.283);c.fill();}
 for(let j=0;j<7000;j++){c.fillStyle=j%2?'rgba(255,236,250,.018)':'rgba(16,8,40,.02)';c.fillRect(R()*768,R()*600,.8+R(),.6+R());}
 // sabit yıldızlar: çok sayıda minik (üstte yoğun), birkaç iri renkli
 for(let j=0;j<320;j++){const x=R()*768,y=R()*R()*470,s=.3+R()*.75;c.fillStyle='rgba(250,240,255,'+(.18+R()*.55)+')';c.beginPath();c.arc(x,y,s,0,6.283);c.fill();}
 for(let j=0;j<24;j++){const x=R()*768,y=R()*360,s=1+R()*.9;c.fillStyle=['rgba(255,226,170,.75)','rgba(255,190,226,.7)','rgba(200,190,255,.75)'][j%3];c.beginPath();c.arc(x,y,s,0,6.283);c.fill();}
 // sabah: lavanta tepe, pembe orta, altın ufuk
 cv=DN8.dawn=dn8Cv(768,600);c=cv.getContext('2d');gr=c.createLinearGradient(0,0,0,600);
 gr.addColorStop(0,'#6a70c8');gr.addColorStop(.3,'#a896dc');gr.addColorStop(.56,'#f2a8c4');gr.addColorStop(.8,'#ffcaa0');gr.addColorStop(1,'#fff0c8');c.fillStyle=gr;c.fillRect(0,0,768,600);
 h=c.createRadialGradient(480,560,10,480,560,420);h.addColorStop(0,'rgba(255,246,214,.85)');h.addColorStop(.3,'rgba(255,214,170,.32)');h.addColorStop(1,'rgba(255,214,170,0)');c.fillStyle=h;c.fillRect(0,0,768,600);
 for(let j=0;j<20;j++){const y=140+R()*300,x=R()*768,w=90+R()*220,hh=4+R()*9;c.fillStyle=j%2?'rgba(255,255,255,.16)':'rgba(255,210,230,.15)';c.beginPath();c.ellipse(x,y,w,hh,-.02,0,6.283);c.fill();}
}
const dn8SR=rng(8717),DN8_STARS=Array.from({length:44},(_,i)=>({x:dn8SR(),y:dn8SR()*dn8SR()*.6,r:.5+dn8SR()*1.3,ph:dn8SR()*6.283,sp:.5+dn8SR()*1.6,col:['#f4eaff','#ffe2b0','#ffc8e8','#d8d0ff'][i%4],yil:i%5===0}));

// ════════ Ay: kocaman, gülümseyen bal rengi ay — disk ve yüz ayrı tuvallerde (yüz, uçuş manzarasında yumuşakça yukarı kayar) ════════
const DN8_AYR=256;   // ay tuvalindeki disk yarıçapı (px)
function dn8AyArt(){
 if(DN8.ay)return;
 const n=DN8_AYR*2+32,R=DN8_AYR,Q=rng(9393);
 {const cv=DN8.ay=dn8Cv(n,n),c=cv.getContext('2d'),m=n/2;
  // disk: sol üstten aydınlık bal rengi, kenarda sıcak altın
  let gr=c.createRadialGradient(m-R*.35,m-R*.4,R*.05,m,m,R);gr.addColorStop(0,'#fffbe6');gr.addColorStop(.45,'#ffefb8');gr.addColorStop(.85,'#ffdc8c');gr.addColorStop(1,'#f4c672');
  c.fillStyle=gr;c.beginPath();c.arc(m,m,R,0,6.283);c.fill();
  c.save();c.beginPath();c.arc(m,m,R,0,6.283);c.clip();
  // yumuşak lekeler (ay denizleri) — tatlı, yuvarlak, soluk
  for(const [x,y,r] of [[-.42,-.5,.2],[.35,-.55,.14],[.55,.1,.16],[-.6,.25,.12],[.1,.68,.11],[-.18,-.78,.08],[.68,-.32,.07]]){c.fillStyle='rgba(226,168,96,.16)';c.beginPath();c.ellipse(m+x*R,m+y*R,r*R,r*R*.85,0,0,6.283);c.fill();c.fillStyle='rgba(255,250,226,.35)';c.beginPath();c.ellipse(m+x*R-r*R*.2,m+y*R-r*R*.25,r*R*.6,r*R*.35,0,0,6.283);c.fill();}
  for(let j=0;j<500;j++){c.fillStyle=j%2?'rgba(255,255,240,.06)':'rgba(214,150,80,.05)';c.beginPath();c.arc(m+(Q()-.5)*2*R,m+(Q()-.5)*2*R,1+Q()*3,0,6.283);c.fill();}
  // sağ alt kenarda sıcak gölge hilali (yuvarlaklık)
  gr=c.createRadialGradient(m-R*.25,m-R*.3,R*.7,m-R*.1,m-R*.12,R*1.25);gr.addColorStop(0,'rgba(240,160,90,0)');gr.addColorStop(1,'rgba(240,150,90,.35)');c.fillStyle=gr;c.fillRect(0,0,n,n);
  c.restore();
  // kenarda ince ışık çizgisi
  c.strokeStyle='rgba(255,252,236,.55)';c.lineWidth=5;c.beginPath();c.arc(m,m,R-4,Math.PI*.95,Math.PI*1.65);c.stroke();}
 // yüz: mutlu kapalı gözler (^ ^), pembe yanaklar, tatlı gülümseme (İRİ KOYU GÖZ YOK: kocaman ayda, yarısı örtülünce ürkütücü
 // okunabiliyordu). Tuvalin (fw×fh) yüz kökü (fw/2, FY) ay merkezine oturur; uçuşta yüz merkezden 0,38·r yukarı kayar.
 {const fw=Math.ceil(R*1.5),fh=Math.ceil(R*.7),cv=DN8.ayYuz=dn8Cv(fw,fh),c=cv.getContext('2d'),m=fw/2,o=R*.3;cv.kok=o;
  const ey=o-R*.14,ex=R*.3,my=o+R*.06;let gr;
  for(const s of [-1,1]){gr=c.createRadialGradient(m+s*R*.48,my+R*.02,2,m+s*R*.48,my+R*.02,R*.2);gr.addColorStop(0,'rgba(255,130,150,.55)');gr.addColorStop(1,'rgba(255,130,150,0)');c.fillStyle=gr;c.beginPath();c.ellipse(m+s*R*.48,my+R*.02,R*.21,R*.15,0,0,6.283);c.fill();}
  c.lineCap='round';c.strokeStyle='#6a3a24';c.lineWidth=R*.04;
  for(const s of [-1,1]){const x=m+s*ex;c.beginPath();c.arc(x,ey+R*.05,R*.09,Math.PI*1.12,Math.PI*1.88);c.stroke();}   // sade hilal gözler (kirpik yok: siluetlerle karışmasın)
  // gülümseme: yumuşak açık ağız, içinde pembe dil
  c.fillStyle='#8a4030';c.beginPath();c.moveTo(m-R*.17,my);c.quadraticCurveTo(m,my+R*.24,m+R*.17,my);c.quadraticCurveTo(m,my+R*.07,m-R*.17,my);c.fill();
  c.fillStyle='#ff9aa8';c.beginPath();c.ellipse(m+R*.01,my+R*.12,R*.07,R*.04,0,0,6.283);c.fill();}
}

// ════════ Ortak ressamlar (önbellek tuvallerinde bir kez): eğri ağaç, kabak, mantar, şeker mısırı, lolipop, çit, saman, mini ev ════════
// eğri büğrü sevimli ağaç: kıvrık tombul gövde (üst üste yuvarlaklarla yumuşak boru), sarmal uçlu dallar, yuvarlak sonbahar tacı.
// K: {gov, govA, koyu, tac, tacA, tacK}; detay: zemin parçaları için ayrıntı; L: asılı fener kaydı (dünya koordinatı) ya da null
function dn8Agac(c,x,base,h,R,K,detay,L,kovuk){
 const egim=(R()-.5)*.36,buk=(R()-.5)*.5,tw=kovuk?h*.08:h*(.055+R()*.02);
 const tx=x+egim*h*.3,ty=base-h*.6,cx1=x+buk*h*.32,cy1=base-h*.32;
 const nok=u=>{const a=(1-u)*(1-u),b=2*u*(1-u),d=u*u;return [a*x+b*cx1+d*tx,a*base+b*cy1+d*ty];};
 const ry=u=>tw*(1-u*.5)*(1+Math.max(0,.1-u)*7);
 // dallar (gövdeden önce: gövde dalların dibini örter)
 const dallar=[];const nd=detay?3:2;
 for(let k=0;k<nd;k++){const u=.5+k*.14+R()*.06,[bx,by]=nok(u),s=k%2?1:-1,L2=h*(.2+R()*.12),ex=bx+s*L2,ey=by-L2*(.35+R()*.3);dallar.push({bx,by,ex,ey,s,r:ry(u)*.45});}
 c.fillStyle=K.gov;
 c.strokeStyle=K.gov;c.lineCap='round';
 for(const d of dallar){let qx=d.bx,qy=d.by;for(let j=1;j<=12;j++){const u=j/12,px=lerp(d.bx,d.ex,u)+Math.sin(u*3.1)*d.s*6,py=lerp(d.by,d.ey,u)-Math.sin(u*3.1)*10;c.lineWidth=Math.max(1.8,d.r*2*(1-u*.72));c.beginPath();c.moveTo(qx,qy);c.lineTo(px,py);c.stroke();qx=px;qy=py;}
  // sarmal uç (kıvrık dal ucu)
  c.strokeStyle=K.gov;c.lineWidth=Math.max(1.6,d.r*.5);c.lineCap='round';c.beginPath();for(let j=0;j<=16;j++){const a=j/16*5.2,rr=10*(1-j/16)+1.5,px=d.ex+d.s*(Math.cos(a)*rr-10),py=d.ey-Math.sin(a)*rr;j?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();}
 // gövde: koyu boru + sol yanda açık ışık şeridi
 for(let j=0;j<=40;j++){const u=j/40,[px,py]=nok(u);c.fillStyle=K.gov;c.beginPath();c.arc(px,py,ry(u),0,6.283);c.fill();}
 for(let j=2;j<=38;j++){const u=j/40,[px,py]=nok(u),r=ry(u);c.fillStyle=K.govA;c.beginPath();c.arc(px-r*.38,py,r*.42,0,6.283);c.fill();}
 if(detay){c.strokeStyle=K.koyu;c.lineWidth=1.6;for(let k=0;k<5;k++){const u=.1+k*.15+R()*.05,[px,py]=nok(u),r=ry(u);c.beginPath();c.arc(px+r*.15,py,r*.45,-.6,1.6);c.stroke();}
  // kökler: yere yayılan yumuşak kıvrımlar
  c.fillStyle=K.gov;for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*tw*.6,base-tw*.9);c.quadraticCurveTo(x+s*tw*1.6,base-tw*.3,x+s*tw*2.6,base+2);c.lineTo(x+s*tw*.4,base+2);c.closePath();c.fill();}}
 // kovuk (hayaletçik saklanır): koyu oval, içi sıcak loş, kalın yumuşak kenar
 if(kovuk){const d=(base-kovuk.y)/h,uk=clamp((.64-Math.sqrt(Math.max(0,.4096-.16*d)))/.08,0,1),[kx]=nok(uk),ky=kovuk.y;c.fillStyle=K.koyu;c.beginPath();c.ellipse(kx,ky,30,36,0,0,6.283);c.fill();
  const gr=c.createRadialGradient(kx,ky-4,2,kx,ky-2,30);gr.addColorStop(0,'#a07aa8');gr.addColorStop(.55,'#5e3a78');gr.addColorStop(1,'#2e1a4a');c.fillStyle=gr;c.beginPath();c.ellipse(kx,ky,25,31,0,0,6.283);c.fill();
  // içi kara bir delik gibi durmasın: dipte sıcak loş ışık, yumuşak yosun minderi, üstte iki minik yıldız parıltısı
  // (alt yarısını saklanma ön parçası — dn8SaklanOn — örter; ışık bu yüzden görünen üst yarıda)
  c.fillStyle='rgba(255,210,122,.26)';c.beginPath();c.ellipse(kx,ky-2,17,12,0,0,6.283);c.fill();
  c.fillStyle='rgba(255,240,200,.7)';for(const [dx,dy,r] of [[-10,-14,2],[9,-6,1.5]]){c.beginPath();c.moveTo(kx+dx,ky+dy-r*2.2);c.lineTo(kx+dx+r*.6,ky+dy);c.lineTo(kx+dx,ky+dy+r*2.2);c.lineTo(kx+dx-r*.6,ky+dy);c.closePath();c.fill();c.beginPath();c.moveTo(kx+dx-r*2.2,ky+dy);c.lineTo(kx+dx,ky+dy+r*.6);c.lineTo(kx+dx+r*2.2,ky+dy);c.lineTo(kx+dx,ky+dy-r*.6);c.closePath();c.fill();}
  c.strokeStyle=K.govA;c.lineWidth=5;c.beginPath();c.ellipse(kx,ky,27,33,0,Math.PI*.95,Math.PI*1.9);c.stroke();kovuk.x=kx;kovuk.r=ry(uk);}
 // taç: yuvarlak yaprak bulutları (gölge + ana renk + parlak üst), kenarda minik yaprak noktaları
 const nb=detay?7:5,tcx=tx,tcy=ty-h*.16,blob=[];
 for(let k=0;k<nb;k++){const a=-Math.PI+k/(nb-1)*Math.PI+(R()-.5)*.3,rr=h*(.13+R()*.07),d=h*(.12+R()*.06);blob.push([tcx+Math.cos(a)*d*1.25,tcy+Math.sin(a)*d*.8+h*.04,rr]);}
 blob.push([tcx,tcy-h*.05,h*(.2+R()*.04)]);
 // yaprak kıvrımlı kenar: her yuvarlağın çevresinde küçük tümsekler (taç düz bir disk / gezegen gibi okunmasın)
 const tum=(dx,dy,kr,col)=>{c.fillStyle=col;for(const [bx,by,r] of blob){c.beginPath();c.arc(bx+dx*r,by+dy*r,r*kr,0,6.283);c.fill();const nk=detay?11:7;
  for(let j=0;j<nk;j++){const a=j/nk*6.283+bx*.01,rr=r*kr*(detay?.24:.2);c.beginPath();c.arc(bx+dx*r+Math.cos(a)*r*kr*.9,by+dy*r+Math.sin(a)*r*kr*.9,rr,0,6.283);c.fill();}}};
 tum(.08,.16,1,K.tacK);tum(0,0,.94,K.tac);
 c.fillStyle=K.tacA;for(const [bx,by,r] of blob){c.beginPath();c.arc(bx-r*.28,by-r*.3,r*.5,0,6.283);c.fill();}
 if(detay){c.fillStyle=dn8Mix(K.tac,K.tacK,.55);for(let k=0;k<18;k++){const [bx,by,r]=blob[k%blob.length],a=R()*6.283,d=.5+R()*.35;c.beginPath();c.ellipse(bx+Math.cos(a)*r*d,by+Math.sin(a)*r*d*.9,4.4,2,a+1.2,0,6.283);c.fill();}
  c.fillStyle='rgba(255,236,200,.16)';for(let k=0;k<14;k++){const [bx,by,r]=blob[k%blob.length];c.beginPath();c.arc(bx-r*.35+R()*r*.2,by-r*.45+R()*r*.2,r*.12,0,6.283);c.fill();}}
 // asılı fenerler: taç altındaki dallardan (karede salınarak çizilir; burada yalnız kayıt)
 if(L&&detay){for(let k=0;k<3;k++){const b=blob[1+k*2]||blob[0];L.push({x:b[0]+(R()-.5)*b[2]*.4,y:b[1]+b[2]*.7,len:18+R()*26,ci:Math.floor(R()*4),ph:R()*6.283});}}
 return {tx:tcx,ty:tcy,r:h*.3};
}
const DN8_AGACK=[   // taç renkleri: mor, kabak turuncusu, deniz mavisi, hardal (ay ışığında yumuşatılmış)
 {gov:'#4a2e52',govA:'#6a4870',koyu:'#2a1838',tac:'#7a4a9a',tacA:'#9a6ab8',tacK:'#55306e'},
 {gov:'#4a3048',govA:'#6c4a62',koyu:'#2a1830',tac:'#c0683e',tacA:'#de8a54',tacK:'#8a4430'},
 {gov:'#3a3050',govA:'#584a6c',koyu:'#221a36',tac:'#3e7e86',tacA:'#5a9ea2',tacK:'#2a5866'},
 {gov:'#4a3440',govA:'#6a4c5a',koyu:'#2a1a2a',tac:'#b89040',tacA:'#d4ae5a',tacK:'#806030'}];
// süs kabağı (taban ortası x,y): dilimli tombul gövde, sap, yaprak, kıvrık filiz; yuz ≥ 0 ise oyulmuş (sönük) yüz → kayıt
function dn8Kabak(c,x,y,s,col,yuz,kayit){
 const w=24*s,h=19*s,koyu=dn8Mix(col,'#2a1030',.5),ac=dn8Mix(col,'#ffe2b8',.28);
 c.fillStyle='rgba(20,10,40,.35)';c.beginPath();c.ellipse(x,y,w*1.15,h*.25,0,0,6.283);c.fill();
 c.fillStyle=koyu;c.beginPath();c.ellipse(x,y-h,w*1.06,h*1.04,0,0,6.283);c.fill();
 for(const [k,r] of [[-.55,.5],[.55,.5],[-.25,.55],[.25,.55],[0,.5]]){c.fillStyle=k===0?ac:Math.abs(k)>.4?col:dn8Mix(col,ac,.4);c.beginPath();c.ellipse(x+k*w*.9,y-h,w*r,h*.96,0,0,6.283);c.fill();}
 c.strokeStyle=koyu;c.lineWidth=1.2*s;for(const k of [-.42,0,.42]){c.beginPath();c.ellipse(x+k*w*.8,y-h,w*.18,h*.9,0,-1.3,1.3);c.stroke();}
 c.fillStyle='rgba(255,246,220,.35)';c.beginPath();c.ellipse(x-w*.35,y-h*1.45,w*.18,h*.22,-.5,0,6.283);c.fill();
 c.fillStyle='#5e6a34';c.beginPath();c.moveTo(x-2.6*s,y-h*1.85);c.quadraticCurveTo(x-1*s,y-h*2.5,x+4*s,y-h*2.6);c.lineTo(x+4.5*s,y-h*2.3);c.quadraticCurveTo(x+1.5*s,y-h*2.2,x+2.6*s,y-h*1.85);c.closePath();c.fill();
 c.fillStyle='#4a7a46';c.beginPath();c.ellipse(x-8*s,y-h*1.95,7*s,3.4*s,-.4,0,6.283);c.fill();
 c.strokeStyle='#5a8a4a';c.lineWidth=1.3*s;c.beginPath();c.moveTo(x+3*s,y-h*1.9);for(let j=0;j<=12;j++){const a=j/12*6,r=5*s*(1-j/14);c.lineTo(x+9*s+Math.cos(a)*r,y-h*2-Math.sin(a)*r);}c.stroke();
 if(yuz>=0){c.save();c.translate(x,y-h*.95);c.fillStyle='#3a1424';dn8YuzYol(c,yuz,s*.62);c.fill();c.restore();if(kayit)kayit.push({x,y:y-h*.95,s:s*.62,v:yuz,ph:dn8Hash(x*.13)*6.283});}
}
// şeker renkli mantar: krem sap, kubbe şapka, beyaz benekler → ışık kaydı
function dn8Mantar(c,x,y,s,col,kayit){
 const h=24*s,w=16*s,koyu=dn8Mix(col,'#2a1040',.45);
 c.fillStyle='#d8cce0';c.beginPath();c.moveTo(x-4*s,y);c.quadraticCurveTo(x-5*s,y-h*.5,x-3*s,y-h*.8);c.lineTo(x+3*s,y-h*.8);c.quadraticCurveTo(x+5*s,y-h*.5,x+4*s,y);c.closePath();c.fill();
 c.fillStyle='rgba(90,60,120,.35)';c.fillRect(x+1*s,y-h*.78,2.4*s,h*.76);
 c.fillStyle=koyu;c.beginPath();c.ellipse(x,y-h*.8,w*1.04,h*.22,0,0,6.283);c.fill();
 c.fillStyle=col;c.beginPath();c.moveTo(x-w,y-h*.78);c.bezierCurveTo(x-w,y-h*1.5,x+w,y-h*1.5,x+w,y-h*.78);c.quadraticCurveTo(x,y-h*.62,x-w,y-h*.78);c.fill();
 c.fillStyle='rgba(255,255,255,.85)';for(const [a,b,r] of [[-.5,1.1,.16],[.25,1.25,.2],[.62,.98,.12],[-.12,.95,.1]]){c.beginPath();c.arc(x+a*w,y-h*b,r*w,0,6.283);c.fill();}
 if(kayit)kayit.push({x,y:y-h*1.05,r:w*1.6,col,ph:dn8Hash(x*.7)*6.283});
}
// şeker mısırı (üçgen: sarı taban, turuncu orta, beyaz uç)
function dn8Misir(c,x,y,s,a){
 c.save();c.translate(x,y);c.rotate(a||0);const h=16*s,w=6*s;
 c.fillStyle='#f0c840';c.beginPath();c.moveTo(-w,0);c.quadraticCurveTo(0,2*s,w,0);c.lineTo(w*.62,-h*.38);c.lineTo(-w*.62,-h*.38);c.closePath();c.fill();
 c.fillStyle='#f08a3a';c.beginPath();c.moveTo(-w*.62,-h*.38);c.lineTo(w*.62,-h*.38);c.lineTo(w*.3,-h*.72);c.lineTo(-w*.3,-h*.72);c.closePath();c.fill();
 c.fillStyle='#fff4e6';c.beginPath();c.moveTo(-w*.3,-h*.72);c.lineTo(w*.3,-h*.72);c.quadraticCurveTo(0,-h*1.08,-w*.3,-h*.72);c.fill();
 c.fillStyle='rgba(255,255,255,.4)';c.fillRect(-w*.45,-h*.6,1.4*s,h*.45);c.restore();
}
// lolipop ağacı: çizgili şeker sopası, sarmal şeker disk, fiyonk → ışık kaydı
function dn8Lolipop(c,x,base,h,col,kayit){
 const r=h*.26,cy=base-h+r;
 c.fillStyle='#e8e0f0';c.fillRect(x-4,cy,8,base-cy);c.strokeStyle=dn8Gece('#ff8fc8',.2);c.lineWidth=3;for(let y=cy+8;y<base;y+=14){c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y-6);c.stroke();}
 c.fillStyle=dn8Gece(col,.3);c.beginPath();c.arc(x,cy,r,0,6.283);c.fill();
 c.strokeStyle='rgba(255,246,250,.8)';c.lineWidth=r*.16;c.lineCap='round';c.beginPath();for(let j=0;j<=60;j++){const a=j/60*14,rr=r*.92*j/60;j?c.lineTo(x+Math.cos(a)*rr,cy+Math.sin(a)*rr):c.moveTo(x,cy);}c.stroke();
 c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-r*.4,cy-r*.45,r*.28,r*.16,-.6,0,6.283);c.fill();
 c.fillStyle=dn8Gece('#ff8fc8',.2);for(const s of [-1,1]){c.beginPath();c.moveTo(x,cy+r+4);c.lineTo(x+s*14,cy+r-4);c.lineTo(x+s*14,cy+r+12);c.closePath();c.fill();}c.beginPath();c.arc(x,cy+r+4,4,0,6.283);c.fill();
 if(kayit)kayit.push({x,y:cy,r:r*1.8,col,ph:dn8Hash(x)*6.283});
}
// eğri tahta çit: yuvarlak uçlu kazıklar, iki kuşak, ara sıra kazık başında minik kabak
function dn8Cit(c,x0,x1,yf,kab){
 c.strokeStyle='#4e3a62';c.lineWidth=6;c.lineCap='round';
 for(const dy of [-30,-14]){c.beginPath();for(let x=x0;x<=x1;x+=10){const y=yf(x)+dy+Math.sin(x*.03)*2;x===x0?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
 for(let x=x0+6;x<=x1-4;x+=17){const y=yf(x),a=(dn8Hash(x)-.5)*.16,hh=40+dn8Hash(x*3)*12;c.save();c.translate(x,y+2);c.rotate(a);
  c.fillStyle='#5e4878';c.beginPath();c.moveTo(-5.5,0);c.lineTo(-5.5,-hh+5);c.quadraticCurveTo(0,-hh-4,5.5,-hh+5);c.lineTo(5.5,0);c.closePath();c.fill();
  c.fillStyle='rgba(200,180,240,.28)';c.fillRect(-5.5,-hh+4,2.4,hh-4);c.restore();
  if(kab&&dn8Hash(x*1.7)<.12)dn8Kabak(c,x,y-hh+3,.42,DN8_KAB[(x|0)%3],-1,null);}
}
// yuvarlak köşeli dikdörtgen yolu (roundRect yoksa düz)
function dn8Yk(c,x,y,w,h,r){c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else c.rect(x,y,w,h);}
// saman balyası (yuvarlak köşeli, saman telleri, iki ip)
function dn8Saman(c,x,y,w,h,R){
 c.fillStyle='#7a5a3a';dn8Yk(c,x-w/2,y-h,w,h,8);c.fill();
 c.fillStyle='#a8844c';dn8Yk(c,x-w/2+2,y-h+2,w-4,h-8,7);c.fill();
 c.strokeStyle='rgba(240,206,130,.45)';c.lineWidth=1.2;for(let k=0;k<w/3;k++){const xx=x-w/2+4+R()*(w-8),yy=y-h+4+R()*(h-12);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+(R()-.5)*8,yy+4+R()*6);c.stroke();}
 c.strokeStyle='#5a3a2a';c.lineWidth=2.4;for(const k of [.3,.7]){c.beginPath();c.moveTo(x-w/2+w*k,y-h+1);c.lineTo(x-w/2+w*k,y-2);c.stroke();}
 c.fillStyle='rgba(255,236,190,.22)';c.fillRect(x-w/2+4,y-h+3,w-8,3);
}
// mini ev (uzak tepeler ve köy manzarası için): eğri duvar, cadı şapkası / kubbe / dik çatı, baca, sıcak pencereler → kayıt
function dn8MiniEv(c,R,x,base,w,h,K,pen,sc,bacaL){
 const egim=(R()-.5)*.14,tur=Math.floor(R()*3),duvar=K.duvar[Math.floor(R()*K.duvar.length)],cati=K.cati[Math.floor(R()*K.cati.length)];
 c.save();c.translate(x,base);c.transform(1,0,egim,1,0,0);
 c.fillStyle=duvar;c.beginPath();c.moveTo(-w/2,0);c.lineTo(-w/2-2*sc,-h);c.lineTo(w/2+2*sc,-h);c.lineTo(w/2,0);c.closePath();c.fill();
 c.fillStyle=dn8Mix(duvar,'#1a1030',.3);c.fillRect(w*.18,-h,w*.32+2*sc,h);
 // baca
 const rh=h*(.6+R()*.5);
 if(R()<.75){const bx=(R()-.5)*w*.5;c.fillStyle=dn8Mix(cati,'#1a1030',.2);c.fillRect(bx-3.5*sc,-h-h*.55,7*sc,h*.4);c.fillRect(bx-5*sc,-h-h*.58,10*sc,3*sc);if(bacaL)bacaL.push({x:x+bx+egim*(-h-h*.58),y:base-h-h*.6});}
 c.fillStyle=cati;c.beginPath();
 if(tur===0){c.moveTo(-w/2-7*sc,-h+2);c.quadraticCurveTo(-w*.1,-h-rh*.45,w*.05,-h-rh);c.quadraticCurveTo(w*.16,-h-rh*1.08,w*.28,-h-rh*.98);c.quadraticCurveTo(w*.1,-h-rh*.85,w*.12,-h-rh*.6);c.quadraticCurveTo(w*.3,-h-rh*.3,w/2+7*sc,-h+2);}
 else if(tur===1){c.moveTo(-w/2-5*sc,-h+2);c.bezierCurveTo(-w/2,-h-rh*.9,w/2,-h-rh*.9,w/2+5*sc,-h+2);}
 else{c.moveTo(-w/2-6*sc,-h+2);c.lineTo(-w*.06,-h-rh*1.05);c.lineTo(w/2+6*sc,-h+2);}
 c.closePath();c.fill();c.fillStyle='rgba(255,230,250,.12)';c.beginPath();c.moveTo(-w/2-6*sc,-h+2);c.lineTo(-w*.06,-h-rh*.9);c.lineTo(-w*.2,-h+2);c.fill();
 // pencereler (loş sıcak; karede ayrıca parlar) ve kapı
 const nk=Math.max(1,Math.round(w/(16*sc))),nr=Math.max(1,Math.floor(h/(18*sc)));
 for(let r=0;r<nr;r++)for(let k=0;k<nk;k++){if(R()<.25)continue;const wx=-w/2+(k+.5)*w/nk,wy=-h+(r+.55)*h/nr-2*sc;if(r===nr-1&&Math.abs(wx)<w*.2&&nr>1)continue;
  const ww=4.4*sc,wh=5.6*sc;c.fillStyle=K.pen;dn8Yk(c,wx-ww/2,wy-wh/2,ww,wh,ww*.45);c.fill();
  if(pen)pen.push({x:x+wx+egim*wy,y:base+wy,r:7*sc,ph:R()*6.283,th:R()});}
 c.fillStyle=dn8Mix(duvar,'#140a24',.55);c.beginPath();c.moveTo(-3.5*sc,0);c.lineTo(-3.5*sc,-7*sc);c.arc(0,-7*sc,3.5*sc,Math.PI,0);c.lineTo(3.5*sc,0);c.fill();
 c.restore();
}

// ════════ Uzak katmanlar: 4 paralaks şeridi (yan yana döşenir) ════════
// 0: puslu uzak tepeler + minik evler · 1: yuvarlak tepeler + eğri evler, ağaçlar, çitler · 2: eğri ağaçlar sırası, asılı fener
// noktaları, kabak tarlası · 3: yakın koyu çalılar, kabak yaprakları, sarmaşıklar ve kabaklar. Karede: pencere / kabak ışıltıları.
const DN8_EXT=24,DN8_KW=256;
function dn8Kirp(cv){
 const w=cv.width,h=cv.height,n=Math.ceil(w/DN8_KW),ust=new Int16Array(n).fill(h);
 try{const d=cv.getContext('2d').getImageData(0,0,w,h).data;
  for(let k=0;k<n;k++){const xa=k*DN8_KW,xb=Math.min(w,xa+DN8_KW);let y=0;
   satir:for(;y<h;y++){const o=y*w*4;for(let x=xa;x<xb;x+=2)if(d[o+x*4+3]>2)break satir;}
   ust[k]=Math.max(0,y-2);}}catch(e){ust.fill(0);}
 cv.ust=ust;return cv;
}
// şeridi (x, y) köşesine, ekranda yAlt'a kadar karo karo çiz (saydam üst kısım atlanır; karo sınırları cihaz pikseline oturur)
function dn8SeritCiz(img,x,y,vw,yAlt){
 const ust=img.ust,n=ust.length,h=img.height;let k0=Math.max(0,Math.floor(-x/DN8_KW)),k1=Math.min(n-1,Math.floor((vw-x)/DN8_KW));
 const alt=Math.min(h,yAlt-y);if(alt<=0)return;
 for(let k=k0;k<=k1;k++){const u=ust[k];if(u>=alt)continue;const sx=k*DN8_KW,sw=Math.min(DN8_KW,img.width-sx),
  dx0=Math.round((x+sx)*S)/S,dx1=Math.round((x+sx+sw)*S)/S;g.drawImage(img,sx,u,sw,alt-u,dx0,y+u,dx1-dx0,alt-u);}
}
// 4: uçuş manzarasının uzak vadi köyü (yalnız boşluk görünürken; aşağıdan yükselerek belirir)
const DN8_SW=[2048,2048,1536,1536,2048],DN8_SH=[400,380,420,300,380],DN8_SF=[.035,.09,.2,.42,.28],DN8_SYF=[.04,.08,.16,.3,.2],DN8_SB=[470,515,560,625,600];
const DN8_SDOLGU=['#46357e','#38286c','#2a1d56','#1d1340','#2c1f5c'];
const DN8_EVK=[
 {duvar:['#6a56a0','#5e5a9c','#76589a'],cati:['#4a3a80','#54407e'],pen:'#c89878'},
 {duvar:['#6c4c8c','#56568e','#7a4c70','#4c6884','#6a5a7a'],cati:['#3e2a66','#5e3458','#34486a','#5a3a4a'],pen:'#e0a868'},
 {duvar:['#5a3e78','#46507a'],cati:['#2e2052','#4a2a48'],pen:'#f0b060'},
 {duvar:['#3a2a5a'],cati:['#22163e'],pen:'#ffc060'}];
function dn8Serit(l){
 if(DN8.serit[l])return DN8.serit[l];
 const Wd=DN8_SW[l],Hd=DN8_SH[l],cv=dn8Cv(Wd,Hd+DN8_EXT),c=cv.getContext('2d'),R=rng(4801+l*97),base=Hd;
 const fx={pen:[],kab:[],fen:[],baca:[]};DN8.serFx[l]=fx;
 const k1=[2,3,3,4,3][l],k2=[5,7,6,9,8][l],A1=[110,70,36,26,40][l],A2=[38,26,16,12,18][l],ph1=R()*6.28,ph2=R()*6.28,ofs=[70,40,28,10,150][l];
 const yAt=x=>base-ofs-A1*(.5+.5*Math.sin(x/Wd*6.2832*k1+ph1))-A2*(.5+.5*Math.sin(x/Wd*6.2832*k2+ph2));
 const dolgu=DN8_SDOLGU[l],ust=dn8Mix(dolgu,'#b090e0',[.22,.16,.1,.06,.12][l]);
 const tepe=()=>{const gr=c.createLinearGradient(0,base-ofs-A1-A2,0,base);gr.addColorStop(0,ust);gr.addColorStop(.6,dolgu);gr.addColorStop(1,dolgu);c.fillStyle=gr;
  c.beginPath();c.moveTo(0,Hd+DN8_EXT);for(let x=0;x<=Wd;x+=6)c.lineTo(x,yAt(x));c.lineTo(Wd,Hd+DN8_EXT);c.closePath();c.fill();
  c.strokeStyle=dn8Mix(ust,'#e8d0ff',.3);c.globalAlpha=.5;c.lineWidth=1.4;c.beginPath();for(let x=0;x<=Wd;x+=6)x?c.lineTo(x,yAt(x)+.8):c.moveTo(0,yAt(0)+.8);c.stroke();c.globalAlpha=1;};
 const per=(x,fn)=>{for(const o of [0,-Wd,Wd]){const xx=x+o;if(xx>-260&&xx<Wd+260)fn(xx,o===0);}};   // kenarı kesen şey öbür uçta da çizilir
 if(l===0||l===1){
  const K=DN8_EVK[l],sc=[.55,.9][l];
  tepe();
  let x=R()*40;
  while(x<Wd){const tip=R(),s=x;
   if(tip<.5){const w=(26+R()*30)*sc,h=(26+R()*30)*sc,sd=(x*13|0)+l*977;per(s,(xx,ana)=>dn8MiniEv(c,rng(sd),xx,yAt(xx)+4*sc,w,h,K,ana?fx.pen:null,sc,ana?fx.baca:null));x+=w+(8+R()*30)*sc;}
   else if(tip<.82){const h=(50+R()*50)*sc,col=['#6a4a9a','#9a4a7a','#3e6e8e','#5a4aa0','#b8604a'][Math.floor(R()*5)],KK={gov:dn8Mix(dolgu,'#1a1030',.3),govA:dn8Mix(dolgu,'#8a70c0',.2),koyu:dolgu,tac:dn8Mix(col,dolgu,[.55,.4][l]),tacA:dn8Mix(dn8Mix(col,'#ffffff',.2),dolgu,[.5,.36][l]),tacK:dn8Mix(col,dolgu,[.7,.6][l])},sd=(x*7|0)+l*31;
    per(s,xx=>dn8Agac(c,xx,yAt(xx)+3,h,rng(sd),KK,false,null));x+=h*.5+R()*20*sc;}
   else{const w=(40+R()*60)*sc;if(l===1)per(s,xx=>{c.fillStyle=dn8Mix(dolgu,'#c0a8e8',.2);for(let q=0;q<w;q+=9*sc){const yy=yAt(xx+q);c.fillRect(xx+q,yy-9*sc,2.2*sc,9*sc);}c.fillRect(xx,yAt(xx)-6*sc,w,1.6*sc);});
    // tepede küçük kabaklar (karede yanar)
    for(let q=0;q<3;q++){const kx=s+R()*w;per(kx,xx=>{c.fillStyle=dn8Mix('#c0602a',dolgu,[.45,.3][l]);c.beginPath();c.ellipse(xx,yAt(xx)-3*sc,4.4*sc,3.4*sc,0,0,6.283);c.fill();});fx.kab.push({x:kx,y:yAt(kx)-3*sc,r:9*sc,ph:R()*6.283});}
    x+=w;}
  }
 } else if(l===2){
  // eğri ağaç sırası: yan yana tombul taçlar; aralarında yanmayı bekleyen asılı fener noktaları
  tepe();
  let x=R()*20;while(x<Wd){const h=110+R()*120,col=['#5a3a8a','#7a3a6a','#2e5a7a','#3a3a8a','#6a3a7a'][Math.floor(R()*5)],sd=(x*7|0)+977;
   const KK={gov:'#24183e',govA:'#3a2a5a',koyu:'#1a1030',tac:dn8Mix(col,dolgu,.45),tacA:dn8Mix(dn8Mix(col,'#ffffff',.18),dolgu,.4),tacK:dn8Mix(col,'#140a24',.55)};
   const s=x;per(s,xx=>dn8Agac(c,xx,yAt(xx)+8,h,rng(sd),KK,false,null));
   if(R()<.55)fx.fen.push({x:s+(R()-.5)*h*.3,y:yAt(s)+8-h*.5,r:7,ph:R()*6.283,ci:Math.floor(R()*4)});
   x+=h*(.28+R()*.18);}
  // ağaçların dibinde kabak tarlası sırası
  c.fillStyle=dolgu;c.beginPath();c.moveTo(0,Hd+DN8_EXT);for(let xx=0;xx<=Wd;xx+=8)c.lineTo(xx,yAt(xx)+10+Math.sin(xx*.05)*3);c.lineTo(Wd,Hd+DN8_EXT);c.fill();
  for(let k=0;k<70;k++){const kx=R()*Wd,ky=yAt(kx)+16+R()*14,rx=6+R()*3,ry=4.5+R()*2;per(kx,xx=>{c.fillStyle=dn8Mix('#b8582a',dolgu,.42);c.beginPath();c.ellipse(xx,ky,rx,ry,0,0,6.283);c.fill();});if(R()<.4)fx.kab.push({x:kx,y:ky,r:11,ph:R()*6.283});}
 } else if(l===4){
  // vadi köyü: iki sıra eğri ev (arka puslu, ön daha iri ve sıcak), aralarda yuvarlak ağaçlar, çatıdan çatıya ampul ipleri,
  // pencere önlerinde gülen kabaklar; hepsinin ışıltısı karede (köy uçuşta hep sıcak yanar)
  tepe();
  const KA={duvar:['#5a4a8a','#4e5a8a','#6a4a7a','#46628a'],cati:['#3a2a66','#4e2e5a','#2e3e62'],pen:'#e8a860'},KO={duvar:['#7a5a9a','#5a6a9a','#8a5a78','#4e7090','#7a6a8a'],cati:['#4a2e6a','#6a3a52','#2e4a66','#5a3a6a'],pen:'#f0b868'};
  for(const [K,sc,dy,ad] of [[KA,.95,-26,24],[KO,1.35,4,16]]){let x=R()*30;
   while(x<Wd){const tip=R(),s0=x;
    if(tip<.8){const w=(30+R()*26)*sc,h=(34+R()*36)*sc,sd=(x*11|0)+(sc*100|0);per(s0,(xx,ana)=>dn8MiniEv(c,rng(sd),xx,yAt(xx)+dy,w,h,K,ana?fx.pen:null,sc,ana?fx.baca:null));
     if(sc>1&&R()<.4){const kx=s0+(R()-.5)*w*.5;fx.kab.push({x:kx,y:yAt(kx)+dy-h*.3,r:10,ph:R()*6.283});}
     x+=w+(ad*.4+R()*ad)*sc;}
    else{const h=(60+R()*40)*sc,col=['#5a3a8a','#7a3a6a','#2e5a7a','#3a3a8a'][Math.floor(R()*4)],KK={gov:dn8Mix(dolgu,'#1a1030',.3),govA:dn8Mix(dolgu,'#8a70c0',.2),koyu:dolgu,tac:dn8Mix(col,dolgu,.3),tacA:dn8Mix(dn8Mix(col,'#ffffff',.2),dolgu,.28),tacK:dn8Mix(col,dolgu,.55)},sd=(x*7|0)+51;
     per(s0,xx=>dn8Agac(c,xx,yAt(xx)+dy+4,h,rng(sd),KK,false,null));x+=h*.45;}}}
  // evlerin önü (aşağısı): kıvrıla kıvrıla inen ışıklı patika, yuvarlak ağaç tepeleri, parlayan kabak bahçeleri, pus
  for(let k=0;k<3;k++){const yy=base-118+k*34,a0=R()*6.28;c.strokeStyle=dn8Mix(dolgu,'#e8c8a0',.16);c.lineWidth=5-k;c.beginPath();
   for(let x=0;x<=Wd;x+=16){const y=yy+Math.sin(x/Wd*6.2832*(3+k)+a0)*14;x?c.lineTo(x,y):c.moveTo(0,y);}c.stroke();
   for(let x=R()*60;x<Wd;x+=46+R()*50){const y=yy+Math.sin(x/Wd*6.2832*(3+k)+a0)*14-5;c.fillStyle='#3a2a50';c.fillRect(x-1,y-8,2,9);fx.fen.push({x,y:y-9,r:3.2-k*.5,ph:R()*6.283,ci:k===1?0:(k*2+(x|0))%4});}}
  for(const [sy,n,rr] of [[-142,34,26],[-70,30,32]])for(let k=0;k<n;k++){const tx=(k+R()*.6)*Wd/n,ty=base+sy+R()*16,r=rr+R()*12,col=['#3a3a7a','#4a3070','#2e4a6e','#5a3a72'][(k+n)%4];per(tx,xx=>{c.fillStyle=dn8Mix(col,dolgu,.55);c.beginPath();c.arc(xx,ty,r,Math.PI,0);c.lineTo(xx+r,ty+r*.4);c.lineTo(xx-r,ty+r*.4);c.fill();c.fillStyle=dn8Mix(dn8Mix(col,'#ffffff',.14),dolgu,.5);c.beginPath();c.arc(xx-r*.3,ty-r*.38,r*.4,0,6.283);c.fill();});}
  for(let k=0;k<26;k++){const kx=R()*Wd,ky=base-100+R()*80;for(let j=0;j<3;j++){const px=kx+j*9-9;c.fillStyle=dn8Mix('#c0602a',dolgu,.25);c.beginPath();c.ellipse(px,ky,5,3.8,0,0,6.283);c.fill();}fx.kab.push({x:kx,y:ky,r:16,ph:R()*6.283});}
  // çatıdan çatıya ampul ipleri (ön sıra): ip çizgisi şeride, ampuller karede
  for(let k=0;k<16;k++){const x0=R()*Wd,x1=x0+80+R()*120,y0=yAt(x0)-50-R()*30,y1=yAt(x1)-50-R()*30;c.strokeStyle='rgba(20,10,40,.6)';c.lineWidth=1;c.beginPath();c.moveTo(x0,y0);c.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+24,x1,y1);c.stroke();
   for(let j=1;j<7;j++){const u=j/7,bx=(1-u)*(1-u)*x0+2*u*(1-u)*(x0+x1)/2+u*u*x1,by=(1-u)*(1-u)*y0+2*u*(1-u)*((y0+y1)/2+24)+u*u*y1;fx.fen.push({x:bx%Wd,y:by+2,r:3.4,ph:R()*6.283,ci:j%4});}}
 } else {
  // yakın çalılar: koyu yumuşak çalılık, kocaman kabak yaprakları, kıvrık filizler, kabaklar, ara sıra çit kazığı
  c.fillStyle=dolgu;c.beginPath();c.moveTo(0,Hd+DN8_EXT);for(let x=0;x<=Wd;x+=6)c.lineTo(x,yAt(x));c.lineTo(Wd,Hd+DN8_EXT);c.closePath();c.fill();
  let x=0;while(x<Wd){const r=16+R()*26,s=x;per(s,xx=>{c.fillStyle=dn8Mix(dolgu,'#3a2a66',.5);c.beginPath();c.arc(xx,yAt(xx)+r*.4,r,Math.PI,0);c.fill();c.fillStyle=dolgu;c.beginPath();c.arc(xx+r*.2,yAt(xx)+r*.55,r*.85,Math.PI,0);c.fill();});x+=r*1.2;}
  for(let k=0;k<26;k++){const lx=R()*Wd,s=.8+R()*.7;per(lx,xx=>{const y=yAt(xx);c.fillStyle='#22304a';c.beginPath();c.moveTo(xx,y+4);c.bezierCurveTo(xx-18*s,y-6*s,xx-24*s,y-26*s,xx-4*s,y-30*s);c.bezierCurveTo(xx+10*s,y-34*s,xx+22*s,y-14*s,xx,y+4);c.fill();
   c.strokeStyle='#2e4058';c.lineWidth=1.6;c.beginPath();c.moveTo(xx,y+2);c.quadraticCurveTo(xx-6*s,y-14*s,xx-4*s,y-26*s);c.stroke();});}
  c.strokeStyle='#2a3a50';c.lineWidth=2.2;c.lineCap='round';
  for(let k=0;k<30;k++){const vx=R()*Wd,s=.7+R()*.6;per(vx,xx=>{const y=yAt(xx)-4;c.beginPath();c.moveTo(xx,y);for(let j=0;j<=14;j++){const a=j/14*7,r=10*s*(1-j/16);c.lineTo(xx+j*1.4*s+Math.cos(a)*r,y-j*1.6*s-Math.sin(a)*r);}c.stroke();});}
  for(let k=0;k<13;k++){const kx=R()*Wd,s=.6+R()*.4,yz=Math.floor(R()*3);per(kx,xx=>dn8Kabak(c,xx,yAt(xx)+6,s,dn8Mix('#c0602a',dolgu,.35),yz,null));fx.kab.push({x:kx,y:yAt(kx)+6-19*s*.95,r:20*s,ph:R()*6.283,yuz:yz,s:s*.62});}
 }
 // alt dolgu + katman pusu şeride basılı (karede ayrı tam genişlik pus çizimi yok)
 const F=dn8FxArt();c.fillStyle=dolgu;c.fillRect(0,base-1,Wd,DN8_EXT+1);
 c.globalAlpha=[.75,.6,.42,.22,.55][l];c.drawImage(F.pus[l<2||l===4?1:0],0,base-[150,130,110,80,190][l],Wd,[170,150,130,100,210][l]);c.globalAlpha=1;
 dn8Kirp(cv);DN8.serit[l]=cv;return cv;
}
// ── Uzaktaki cadı evi: tepede eğri, kat kat, kıvrık sivri şapka çatılı, yuvarlak sıcak pencereli masal evi ──
function dn8CadiEviArt(){
 const F=dn8FxArt();if(F.cadiEvi)return F.cadiEvi;
 const cv=dn8Cv(420,520),c=cv.getContext('2d'),R=rng(6262);c.translate(210,500);const pen=[];
 // tepe
 const gr=c.createLinearGradient(0,-150,0,0);gr.addColorStop(0,'#5a4690');gr.addColorStop(1,'#46357e');c.fillStyle=gr;c.beginPath();c.moveTo(-210,0);c.bezierCurveTo(-150,-110,-60,-140,0,-140);c.bezierCurveTo(60,-140,150,-110,210,0);c.closePath();c.fill();
 c.strokeStyle='rgba(220,200,255,.3)';c.lineWidth=1.5;c.beginPath();c.moveTo(-170,-60);c.bezierCurveTo(-120,-118,-50,-138,0,-139);c.stroke();
 // yanlarda eğri ağaçlar (evin arkasında)
 dn8Agac(c,-120,-70,120,rng(71),DN8_AGACK[0],false,null);dn8Agac(c,128,-66,104,rng(73),DN8_AGACK[2],false,null);
 // kıvrık patika
 c.strokeStyle='rgba(255,220,170,.25)';c.lineWidth=5;c.beginPath();c.moveTo(-30,0);c.bezierCurveTo(-10,-40,30,-60,4,-130);c.stroke();
 // gövde: üç eğri kat (her biri bir öncekinden biraz kayık)
 const katlar=[[-46,-212,92,76,'#6a4a8a'],[-38,-284,80,72,'#7a5096'],[-28,-338,62,54,'#6a5aa0']];
 let egim=0;for(const [x,y,w,h,col] of katlar){egim+=(R()-.3)*8;c.fillStyle=col;c.beginPath();c.moveTo(x+egim,y+h);c.lineTo(x+egim-4,y);c.lineTo(x+w+egim+4,y);c.lineTo(x+w+egim,y+h);c.closePath();c.fill();
  c.fillStyle='rgba(20,10,40,.25)';c.fillRect(x+w*.58+egim,y,w*.42+4,h);
  c.fillStyle='#3a2a5a';c.fillRect(x+egim-8,y-6,w+16,8);
  for(let k=0;k<2;k++){const wx=x+egim+w*(.28+k*.44),wy=y+h*.48;c.fillStyle='#ffcf7a';c.beginPath();c.arc(wx,wy,8,0,6.283);c.fill();c.strokeStyle='#3a2a5a';c.lineWidth=2;c.beginPath();c.moveTo(wx-8,wy);c.lineTo(wx+8,wy);c.moveTo(wx,wy-8);c.lineTo(wx,wy+8);c.stroke();pen.push({x:wx,y:wy});}}
 // kapı + minik kabak
 c.fillStyle='#2a1a40';c.beginPath();c.moveTo(-12,-136);c.lineTo(-12,-160);c.arc(0,-160,12,Math.PI,0);c.lineTo(12,-136);c.fill();
 dn8Kabak(c,26,-136,.55,'#e8802a',0,null);
 // baca
 c.fillStyle='#5a3a5a';c.fillRect(18+egim,-386,12,40);c.fillRect(15+egim,-390,18,6);
 // kocaman kıvrık cadı şapkası çatı (ucunda yıldız)
 const ex=egim;c.fillStyle='#3e2a6a';c.beginPath();c.moveTo(-50+ex,-338);c.quadraticCurveTo(-14+ex,-376,-4+ex,-420);c.quadraticCurveTo(4+ex,-462,40+ex,-478);c.quadraticCurveTo(52+ex,-480,56+ex,-468);c.quadraticCurveTo(30+ex,-462,22+ex,-430);c.quadraticCurveTo(26+ex,-376,50+ex,-338);c.closePath();c.fill();
 c.fillStyle='rgba(200,170,255,.18)';c.beginPath();c.moveTo(-50+ex,-338);c.quadraticCurveTo(-14+ex,-376,-4+ex,-420);c.lineTo(4+ex,-412);c.quadraticCurveTo(-4+ex,-376,-20+ex,-338);c.fill();
 c.fillStyle='#ff9a3c';c.fillRect(-48+ex,-346,98,8);   // şapka bandı
 for(const [sx,sy] of [[-14,-376],[10,-400],[-2,-356]]){c.fillStyle='#ffe7a8';c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(sx+ex+Math.cos(an)*4,sy+Math.sin(an)*4);c.lineTo(sx+ex+Math.cos(an+.628)*1.8,sy+Math.sin(an+.628)*1.8);}c.fill();}
 c.fillStyle='#ffe7a8';c.beginPath();const stx=56+ex,sty=-472;for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(stx+Math.cos(an)*9,sty+Math.sin(an)*9);c.lineTo(stx+Math.cos(an+.628)*4,sty+Math.sin(an+.628)*4);}c.fill();
 pen.push({x:stx,y:sty,yildiz:true});
 F.cadiEvi=cv;F.cadiEviPen=pen;F.cadiEviBaca={x:24+egim,y:-392};return cv;
}

// ════════ Dünya yerleşimi: büyük dekor (ağaç, ev, kulübe, ambar, değirmen), küçük süsler, ışık kayıtları ════════
// Her şey tohumlu (aynı yer hep aynı); zemin parçaları bu listeden boyanır, karede yalnız ışıltılar/salınanlar çizilir.
const DN8_CW=768,DN8_CACHE=12;
function dn8Dolu(q){   // nesne sütunu ya da mini oyun alanı: önüne küçük süs konmaz
 for(const o of NESNELER){if(o.tip==='tohum'||o.tip==='konusma')continue;const x=nx(q);
  if(Math.abs(o.x-x)<2.2*T)return true;if(Number.isFinite(o.x0)&&Number.isFinite(o.x1)&&x>o.x0-T&&x<o.x1+T)return true;}
 return false;
}
function dn8Yapilar(){
 if(DN8.yap)return DN8.yap;
 const Y=DN8.yap={buyuk:[],kucuk:[],plat:[],yuz:[],mantar:[],ampul:[],pen:[],asili:[],baca:[],direk:[],ip:[],saklan:{},degirmen:[],lolipop:[]};
 const D8=typeof DEKOR8!=='undefined'?DEKOR8:{};
 const sy=c=>topOf(c)*T;
 // eğri ağaçlar (dünya derinliğinde, zeminin arkasında)
 for(const a of D8.agac||[]){const [col,s,ti,kov]=a,x=nx(col)+(dn8Hash(col)-.5)*14,h=380*s,b={tip:'agac',x,y:sy(col)+6,h,ti,seed:col*17+3,x0:x-h*.75,x1:x+h*.75,y0:sy(col)-h*1.12};
  if(kov){const o=NESNELER.find(n=>n.tip==='hayaletcik'&&n.saklan==='agac'),kx=o&&Number.isFinite(o.kovukX)?o.kovukX:x,ky=o&&Number.isFinite(o.kovukY)?o.kovukY:sy(col)-118;
   // gövde kovuk yüksekliğinde tam kovukX'ten geçsin: dn8Agac'ın ilk iki tohum çekilişi (eğim, bükülme) burada yeniden üretilir
   const R=rng(b.seed),eg=(R()-.5)*.36,bk=(R()-.5)*.5,d=(b.y-ky)/h,u=clamp((.64-Math.sqrt(Math.max(0,.4096-.16*d)))/.08,0,1);
   b.x=kx-(2*u*(1-u)*bk*h*.32+u*u*eg*h*.3);b.x0=b.x-h*.75;b.x1=b.x+h*.75;b.kovuk={x:kx,y:ky};}
  Y.buyuk.push(b);}
 for(const [col,h,ci] of D8.lolipop||[]){const x=nx(col)+8;Y.buyuk.push({tip:'lolipop',x,y:sy(col)+4,h,col:DN8_SEKER[ci%6],x0:x-h*.4,x1:x+h*.4,y0:sy(col)-h-10});}
 for(const e of D8.ev||[]){const x=nx(e.k),y=sy(e.k);Y.buyuk.push(Object.assign({tip:'ev',x,y,x0:x-e.w/2-40,x1:x+e.w/2+(e.kanat?e.kanat.w+20:40),y0:y-e.h-e.rh-80},e));}
 if(D8.kulube){const k=D8.kulube,x=nx(k.k),y=sy(k.k);Y.buyuk.push({tip:'kulube',x,y,x0:x-240,x1:x+240,y0:y-470});}
 if(D8.ambar){const k=D8.ambar,x=nx(k.k),y=sy(k.k);Y.buyuk.push({tip:'ambar',x,y,x0:x-200,x1:x+200,y0:y-330});}
 if(D8.degirmen){const k=D8.degirmen,x=nx(k.k),y=sy(k.k);Y.buyuk.push({tip:'degirmen',x,y,x0:x-150,x1:x+150,y0:y-460});Y.degirmen.push({x,y:y-300,r:130});}
 if(D8.kemer){const k=D8.kemer,x=nx(k.k),y=sy(k.k);Y.buyuk.push({tip:'kemer',x,y,x0:x-130,x1:x+130,y0:y-300});}
 for(const m of D8.meydanEv||[]){const x=nx(m.k),y=sy(m.k);Y.buyuk.push(Object.assign({tip:'ev',x,y,x0:x-m.w/2-40,x1:x+m.w/2+40,y0:y-m.h-m.rh-80,meydan:true},m));}
 if(D8.kule){const k=D8.kule,x=nx(k.k),y=sy(k.k);Y.buyuk.push({tip:'kule',x,y,h:k.h||520,x0:x-120,x1:x+120,y0:y-(k.h||520)-120});}
 for(const t of D8.tezgah||[]){const x=nx(t.k),y=sy(t.k);Y.buyuk.push({tip:'tezgah',x,y,ci:t.ci||0,x0:x-110,x1:x+110,y0:y-220});}
 for(const [a,b] of D8.cit||[])Y.buyuk.push({tip:'cit',x0:nx(a)-20,x1:nx(b)+20,x:nx(a),y0:Math.min(sy(a),sy(b))-60,kab:true});
 for(const [col,n] of D8.saman||[]){const x=nx(col);Y.buyuk.push({tip:'saman',x,y:sy(col)+3,n,x0:x-80,x1:x+80,y0:sy(col)-130,seed:col});}
 // uçurum kenarları (bahçenin ucu, meydanın başı)
 Y.buyuk.push({tip:'ucurum',x:DN8_GAP0,yon:1,x0:DN8_GAP0-120,x1:DN8_GAP0+120,y0:sy(650)-40});
 Y.buyuk.push({tip:'ucurum',x:DN8_GAP1,yon:-1,x0:DN8_GAP1-120,x1:DN8_GAP1+120,y0:sy(802)-40});
 // tek yönlü platformlar: tarlada saman balyası yığını, koruda kocaman şeker mantarı, başka yerde sarmaşıklı tahta raf
 for(let r=0;r<ROWS;r++){let c=0;while(c<COLS){if(grid[r][c]!==2){c++;continue;}let e=c;while(e+1<COLS&&grid[r][e+1]===2)e++;
  const x0=c*T,x1=(e+1)*T,b=dn8Bolge((x0+x1)/2),tab=Math.max(sy(c),sy(e));Y.plat.push({x0,x1,y:r*T,tab,tur:b==='tarla'?'saman':b==='koru'||b==='giris'?'mantar':'raf',seed:c*31+r*7});c=e+1;}}
 // küçük süsler: bölgeye göre sütun sütun (tohumlu); nesne sütunlarından ve mini oyun alanlarından kaçar
 for(let q=1;q<COLS-1;q++){const x=nx(q);if(x>=DN8_GAP0-T&&x<DN8_GAP1+T)continue;const t=topOf(q);if(t>=ROWS)continue;const y=t*T,Q=rng(q*977+5),b=dn8Bolge(x);
  if(topOf(q-1)!==t||topOf(q+1)!==t)continue;const dolu=dn8Dolu(q),k=Q();
  const ek=(tip,o)=>Y.kucuk.push(Object.assign({tip,x:x+(Q()-.5)*20,y},o));
  if(b==='tarla'){if(!dolu&&k<.42)ek('kabak',{s:.7+Q()*.8,col:DN8_KAB[Math.floor(Q()*3)],yuz:Q()<.45?Math.floor(Q()*3):-1});else if(k<.6)ek('sarmasik',{w:60+Q()*50,s:Q()});else if(!dolu&&k<.68)ek('misir',{n:2+Math.floor(Q()*3)});else if(!dolu&&k<.74)ek('aycicek',{});}
  else if(b==='giris'){if(!dolu&&k<.16)ek('mantar',{s:.8+Q()*.6,col:DN8_SEKER[Math.floor(Q()*6)],n:1+Math.floor(Q()*3)});else if(!dolu&&k<.26)ek('kabak',{s:.6+Q()*.5,col:DN8_KAB[Math.floor(Q()*3)],yuz:Q()<.3?Math.floor(Q()*3):-1});else if(!dolu&&k<.34)ek('misir',{n:2+Math.floor(Q()*3)});else if(k<.5)ek('ot',{});else if(k<.58)ek('sarmasik',{w:50+Q()*40,s:Q()});}
  else if(b==='koru'){if(!dolu&&k<.22)ek('mantar',{s:.9+Q()*.9,col:DN8_SEKER[Math.floor(Q()*6)],n:1+Math.floor(Q()*3)});else if(!dolu&&k<.3)ek('kabak',{s:.6+Q()*.5,col:DN8_KAB[Math.floor(Q()*3)],yuz:Q()<.5?Math.floor(Q()*3):-1});else if(k<.5)ek('ot',{});else if(k<.6)ek('sarmasik',{w:50+Q()*40,s:Q()});else if(!dolu&&k<.66)ek('misir',{n:2+Math.floor(Q()*2)});}
  else if(b==='kabakYuz'||b==='iskelet'){if(k<.3)ek('ot',{});else if(!dolu&&k<.36)ek('mantar',{s:.7+Q()*.5,col:DN8_SEKER[Math.floor(Q()*6)],n:1+Math.floor(Q()*2)});}
  else if(b==='sokak'){if(!dolu&&k<.12)ek('kabak',{s:.55+Q()*.4,col:DN8_KAB[Math.floor(Q()*3)],yuz:Q()<.6?Math.floor(Q()*3):-1});else if(!dolu&&k<.18)ek('misir',{n:2+Math.floor(Q()*2)});}
  else if(b==='bahce'){if(!dolu&&k<.3)ek('mantar',{s:.7+Q()*.5,col:DN8_SEKER[Math.floor(Q()*6)],n:1+Math.floor(Q()*2)});else if(!dolu&&k<.5)ek('aycicek',{});else if(k<.62)ek('ot',{});}
  else if(b==='meydan'){if(!dolu&&k<.1)ek('kabak',{s:.6+Q()*.5,col:DN8_KAB[Math.floor(Q()*3)],yuz:Math.floor(Q()*3)});}
 }
 // ipler: sokakta evden eve bayrak ipi (saçaktan saçağa), DEKOR8.ip (sahne üstü fenerler, meydan)
 const evler=Y.buyuk.filter(b=>b.tip==='ev'&&!b.meydan).sort((a,b)=>a.x-b.x);
 for(let k=0;k+1<evler.length;k++){const A=evler[k],B=evler[k+1],ax=A.x+A.w/2+(A.kanat?A.kanat.w:0)+(A.egim||0),bx=B.x-B.w/2+(B.egim||0);if(bx-ax>1300)continue;
  Y.ip.push({x0:ax-4,y0:A.y-(A.kanat?A.kanat.h:A.h)+8,x1:bx+4,y1:B.y-B.h+8,sag:60,n:Math.max(8,Math.round((bx-ax)/48)),tur:'bayrak',ph:k*1.7});}
 for(const [a,dya,b,dyb,sag,n,tur] of D8.ip||[])Y.ip.push({x0:nx(a),y0:sy(a)+dya,x1:nx(b),y1:sy(b)+dyb,sag,n,tur,ph:a*.37});
 for(const [col,yon] of D8.direk||[]){const x=nx(col);Y.buyuk.push({tip:'direk',x,y:sy(col)+2,yon:yon||1,x0:x-40,x1:x+40,y0:sy(col)-230});}
 Y.buyuk.sort((a,b)=>(a.z||0)-(b.z||0));
 return Y;
}
// çatı hizası (dünya y'si): sokak / meydan evinin saçağı; boşlukta süpürge yolculuğunun yakın köyü (supurge.js) ≈ 600; başka yerde zemin
function dn8CatiY(x){
 if(x>=DN8_GAP0&&x<DN8_GAP1)return 600;const Y=dn8Yapilar();
 for(const b of Y.buyuk)if(b.tip==='ev'&&x>=b.x-b.w/2&&x<=b.x+b.w/2+(b.kanat?b.kanat.w:0)){if(b.kanat&&x>b.x+b.w/2)return b.y-b.kanat.h;return b.y-b.h;}
 return dn8Surface(x);
}

// ── Zemin parçası: 768 genişlik, yalnız boyalı yükseklik kadar (üst saydam kısım için bellek ayrılmaz) ──
function dn8Chunk(i){
 if(DN8.chunks.has(i)){const a=DN8.chunks.get(i);DN8.chunks.delete(i);DN8.chunks.set(i,a);return a;}
 const Y=dn8Yapilar(),F=dn8FxArt(),x0=i*DN8_CW,L=x0-2,Rr=x0+DN8_CW+2;
 // üst sınır: zemin yüzeyi ve parçaya değen büyük dekor
 let ust=1200;for(let x=Math.floor(L);x<=Rr;x+=8){const s=dn8Surface(x);if(s<1200)ust=Math.min(ust,s-60);}
 for(const b of Y.buyuk)if(b.x1>L&&b.x0<Rr)ust=Math.min(ust,b.y0);
 for(const p of Y.plat)if(p.x1>L-20&&p.x0<Rr+20)ust=Math.min(ust,p.y-60);
 ust=Math.max(0,Math.floor(ust));
 const cv=dn8Cv(DN8_CW+4,1200-ust),c=cv.getContext('2d');c.translate(2-x0,-ust);cv.ust=ust;
 // ışık kayıtları (pencere, kabak yüzü, mantar...) her öğe ilk boyandığında bir kez eklenir (boyama tohumlu: hep aynı)
 let yeni=false;const kayit=o=>{if(o.kayitli)return null;o.kayitli=true;yeni=true;return Y;};
 // 1) büyük dekor (zeminin arkasında): sırayla (z)
 for(const b of Y.buyuk)if(b.x1>L&&b.x0<Rr)dn8BuyukCiz(c,b,kayit(b));
 // 2) zemin gövdesi: koyu erik toprak, derinde mor; yüzeyin altında yumuşak katmanlar
 const p=new Path2D();let open=false,prev=1200;
 for(let x=Math.floor(L);x<=Rr;x+=2){const y=dn8Surface(x);if(y>=1200){if(open){p.lineTo(x,prev);p.lineTo(x,1200);p.closePath();open=false;}prev=1200;continue;}
  if(!open){p.moveTo(x,1200);p.lineTo(x,y);open=true;prev=y;}else if(y!==prev){p.lineTo(x,prev);p.lineTo(x,y);prev=y;}}
 if(open){p.lineTo(Rr,prev);p.lineTo(Rr,1200);p.closePath();}
 let gr=c.createLinearGradient(0,600,0,1200);gr.addColorStop(0,'#3e2a62');gr.addColorStop(.25,'#2e1f50');gr.addColorStop(.6,'#20163e');gr.addColorStop(1,'#140c2a');c.fillStyle=gr;c.fill(p);
 c.save();c.clip(p);
 const Q=rng(i*733+61);
 // yüzeyin hemen altında ay ışığı alan yumuşak lila toprak bandı: ekranın altındaki toprak tek parça koyu, çamurlu bir şerit gibi durmasın
 for(const [dy,lw,a] of [[16,34,.13],[44,40,.07]]){c.strokeStyle='rgba(140,104,200,'+a+')';c.lineWidth=lw;c.lineJoin='round';c.beginPath();let on=false;
  for(let x=Math.floor(L)-20;x<=Rr+20;x+=10){const y=dn8Surface(x);if(y>=1200){on=false;continue;}on?c.lineTo(x,y+dy):c.moveTo(x,y+dy);on=true;}c.stroke();}
 // toprak katmanı çizgileri, gömülü yuvarlak taşlar, minik kökler, ışıl ışıl toprak kırıntıları
 c.strokeStyle='rgba(150,110,200,.12)';c.lineWidth=2.5;for(let k=0;k<34;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+40+Q()*200,ww=50+Q()*140;if(yy>1190)continue;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx+ww*.5,yy+6,xx+ww,yy);c.stroke();}
 // toprak cepleri (koyu yumuşak lekeler) ve daha açık bir katman bandı: geniş görünüşte toprak düz kalmasın
 for(let k=0;k<9;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+90+Q()*300,r=40+Q()*70;if(yy>1250)continue;c.fillStyle=k%3?'rgba(14,8,32,.22)':'rgba(120,90,180,.08)';c.beginPath();c.ellipse(xx,yy,r*1.6,r*.7,0,0,6.283);c.fill();}
 for(let k=0;k<14;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+50+Q()*320,r=6+Q()*16;if(yy>1190)continue;c.fillStyle=k%4?'#3a2a5e':'#463468';c.beginPath();c.ellipse(xx,yy,r*1.3,r,0,0,6.283);c.fill();c.fillStyle='rgba(170,140,220,.3)';c.beginPath();c.ellipse(xx-r*.2,yy-r*.5,r*.8,r*.3,0,0,6.283);c.fill();}
 // toprağa gömülü minik şeker taneleri ve kabak çekirdekleri (soluk, sevimli sürpriz)
 for(let k=0;k<10;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+40+Q()*260;if(yy>1190)continue;const col=DN8_SEKER[k%6];
  if(k%2){c.fillStyle=dn8Mix(col,'#2a1f4e',.55);c.beginPath();c.arc(xx,yy,3.4,0,6.283);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.arc(xx-1,yy-1,1.2,0,6.283);c.fill();}
  else{c.fillStyle='rgba(232,214,170,.28)';c.beginPath();c.ellipse(xx,yy,3.6,2,(Q()-.5)*1.5,0,6.283);c.fill();}}
 c.strokeStyle='rgba(90,60,90,.55)';c.lineWidth=2;c.lineCap='round';for(let k=0;k<10;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+14;if(yy>1190)continue;c.beginPath();c.moveTo(xx,yy);c.bezierCurveTo(xx+6,yy+14,xx-8,yy+24,xx+3,yy+34+Q()*20);c.stroke();}
 for(let k=0;k<120;k++){const xx=L+Q()*DN8_CW,yy=dn8Surface(xx)+8+Q()*120;c.fillStyle='rgba(255,220,250,'+(.08+Q()*.2)+')';c.fillRect(xx,yy,1.2,1.2);}
 c.restore();
 // 2b) uçurum ağzı: zeminin dik, düz kesik kenarını yuvarlak kaya yumrularıyla yumuşat (zeminin önünde, dudağın altında)
 for(const b of Y.buyuk)if(b.tip==='ucurum'&&b.x1>L&&b.x0<Rr)dn8UcurumAgiz(c,b);
 // 3) yüzey dudağı: bölgeye göre çimen (mor-deniz mavisi), kaldırım taşı (sokak) ya da döşeme (meydan)
 dn8Dudak(c,L,Rr);
 // 4) küçük süsler (yüzeyde)
 for(const s of Y.kucuk)if(s.x>L-80&&s.x<Rr+80)dn8KucukCiz(c,s,kayit(s));
 // 5) tek yönlü platformlar
 for(const pl of Y.plat)if(pl.x1>L-20&&pl.x0<Rr+20)dn8PlatCiz(c,pl,kayit(pl));
 if(yeni)dn8KayitSirala();
 DN8.chunks.set(i,cv);while(DN8.chunks.size>DN8_CACHE)DN8.chunks.delete(DN8.chunks.keys().next().value);return cv;
}
function dn8KayitSirala(){const Y=DN8.yap;
 // dalda baykuş / yarasa asılıysa (kabak.js geceDost, o.dalX/dalY) aynı yerdeki kâğıt fener kaldırılır: üst üste binmesinler
 if(typeof NESNELER!=='undefined')for(const o of NESNELER)if(o.tip==='geceDost'&&Number.isFinite(o.dalX)&&Number.isFinite(o.dalY))
  Y.asili=Y.asili.filter(p=>Math.abs(p.x-o.dalX)>(o.tur==='baykus'?58:34)||Math.abs(p.y-o.dalY)>140);
 for(const k of ['yuz','mantar','ampul','pen','asili','baca','lolipop'])Y[k].sort((a,b)=>a.x-b.x);}
// yüzey dudağı
function dn8Dudak(c,L,Rr){
 // çimen: koyu gölge, ana renk, ışıklı üst; basamak kenarında kendiliğinden saçak
 const tasli=x=>{const b=dn8Bolge(x);return b==='sokak'?1:b==='meydan'&&x>835*T?2:0;};
 for(const [col,dy,rx,ry] of [['rgba(30,16,60,.55)',9,13,8],['#3e3a7a',3,12,7.5],['#5a58a0',-1,8,3]]){c.fillStyle=col;
  for(let x=Math.floor(L/12)*12-12;x<Rr+12;x+=12){const xx=x+6,y=dn8Surface(xx);if(y>=1200||tasli(xx))continue;const w=dn8Hash(xx*.37);c.beginPath();c.ellipse(xx,y+dy-1+w*2,rx+w*3,ry+w*1.5,0,0,6.283);c.fill();}}
 // çimen telleri (kıvrık uçlu)
 c.lineCap='round';
 for(let x=Math.floor(L/7)*7;x<Rr;x+=7){const y=dn8Surface(x);if(y>=1200||tasli(x))continue;const h=dn8Hash(x*1.3);if(h<.35)continue;const hh=5+h*9,an=(dn8Hash(x*2.1)-.5)*.6;
  c.strokeStyle=h>.8?'#7a70c0':'#4e4c92';c.lineWidth=2;c.beginPath();c.moveTo(x,y+2);c.quadraticCurveTo(x+an*6,y-hh*.6,x+an*10,y-hh);c.stroke();}
 // kaldırım taşları (sokak) ve döşeme (meydan): yuvarlak taşlar, ay ışığında lila
 for(let x=Math.floor(L/22)*22-22;x<Rr+22;x+=22){const xx=x+11,t=tasli(xx);if(!t)continue;const y=dn8Surface(xx);if(y>=1200)continue;const h=dn8Hash(xx*.71);
  c.fillStyle='#2a1e4a';c.fillRect(xx-11,y-1,22,26);
  if(t===1){c.fillStyle=h<.5?'#6a5a96':'#5e5288';c.beginPath();c.ellipse(xx,y+4,10,6.5,0,0,6.283);c.fill();c.fillStyle='rgba(220,200,255,.3)';c.beginPath();c.ellipse(xx-2,y+1.5,6,2.4,0,0,6.283);c.fill();
   c.fillStyle=h<.5?'#4e4278':'#463c70';c.beginPath();c.ellipse(xx+11,y+15,10,6,0,0,6.283);c.fill();}
  else{c.fillStyle=h<.5?'#76669a':'#6a5c90';dn8Yk(c,xx-10,y-1,20,12,4);c.fill();c.fillStyle='rgba(236,220,255,.32)';c.fillRect(xx-8,y,16,2);c.fillStyle=h>.5?'#54487e':'#4c4276';dn8Yk(c,xx-21+(h>.3?11:0),y+12,20,11,4);c.fill();}}
 // kaldırım kenar taşı bandı
 for(let x=Math.floor(L/40)*40;x<Rr;x+=40){const t=tasli(x+20);if(!t)continue;const y=dn8Surface(x+20);if(y>=1200)continue;c.fillStyle='rgba(20,10,40,.4)';c.fillRect(x,y+24,40,4);}
}
// tek yönlü platform çizimi
function dn8PlatCiz(c,p,Y){
 const R=rng(p.seed),w=p.x1-p.x0,cx=(p.x0+p.x1)/2;
 if(p.tur==='saman'){
  // saman balyası yığını: üst kenar = platform; altta iki sıra balya (zemine kadar)
  const kat=Math.max(1,Math.round((p.tab-p.y)/60)),bh=(p.tab-p.y)/kat;
  for(let k=0;k<kat;k++){const yb=p.tab-k*bh,n=k===kat-1?2:3,bw=(w+(k===kat-1?0:30))/n;for(let j=0;j<n;j++)dn8Saman(c,cx-(n*bw)/2+bw*(j+.5),yb+(k===0?4:0),bw-4,bh+(k===0?4:2),R);}
  dn8Kabak(c,p.x0-18,p.tab+3,.9,'#e8802a',0,Y?Y.yuz:null);dn8Kabak(c,p.x1+14,p.tab+3,.6,'#ffa040',-1,null);
  c.fillStyle='rgba(255,230,170,.5)';c.fillRect(p.x0+6,p.y,w-12,2);
 } else if(p.tur==='mantar'){
  // kocaman şeker mantarı: şapkanın üstü platform
  const col=DN8_SEKER[p.seed%3===0?0:p.seed%3===1?3:1],koyu=dn8Mix(col,'#2a1040',.5),sapH=p.tab-p.y;
  c.fillStyle='#cfc2dc';c.beginPath();c.moveTo(cx-18,p.tab+4);c.quadraticCurveTo(cx-26,p.y+sapH*.5,cx-14,p.y+20);c.lineTo(cx+14,p.y+20);c.quadraticCurveTo(cx+26,p.y+sapH*.5,cx+18,p.tab+4);c.closePath();c.fill();
  c.fillStyle='rgba(80,50,110,.3)';c.fillRect(cx+4,p.y+20,9,sapH-16);
  c.fillStyle=koyu;c.beginPath();c.ellipse(cx,p.y+22,w*.5,14,0,0,6.283);c.fill();
  c.fillStyle=dn8Gece(col,.3);c.beginPath();c.moveTo(p.x0-6,p.y+20);c.bezierCurveTo(p.x0-4,p.y-30,p.x1+4,p.y-30,p.x1+6,p.y+20);c.quadraticCurveTo(cx,p.y+30,p.x0-6,p.y+20);c.fill();
  c.fillStyle='rgba(255,255,255,.8)';for(const [a,b,r] of [[-.3,-.2,13],[.18,-.32,10],[.36,.02,8],[-.05,.05,7],[-.4,.12,6]]){c.beginPath();c.ellipse(cx+a*w,p.y+b*40+4,r,r*.75,0,0,6.283);c.fill();}
  c.fillStyle='rgba(255,240,255,.4)';c.fillRect(p.x0+10,p.y-1,w-20,2);
  if(Y)Y.mantar.push({x:cx,y:p.y,r:w*.6,col,ph:R()*6.283});
 } else {
  // sarmaşıklı tahta raf
  c.fillStyle='#5a4070';dn8Yk(c,p.x0,p.y,w,14,6);c.fill();c.fillStyle='#7a5a90';c.fillRect(p.x0+4,p.y+1,w-8,3);
  c.strokeStyle='#3e7a5a';c.lineWidth=2;for(let x=p.x0+8;x<p.x1-8;x+=24){c.beginPath();c.moveTo(x,p.y+12);c.quadraticCurveTo(x+6,p.y+24,x,p.y+34);c.stroke();c.fillStyle='#4e8a62';c.beginPath();c.ellipse(x+3,p.y+28,4,2.4,.5,0,6.283);c.fill();}
 }
}

// ════════ Büyük dekor ressamları ════════
function dn8BuyukCiz(c,b,Y){
 const R=rng(b.seed||((b.x|0)*3+7));
 switch(b.tip){
  case 'agac':{const K=DN8_AGACK[b.ti%4];dn8Agac(c,b.x,b.y,b.h,R,K,true,Y?Y.asili:null,b.kovuk||null);
   if(b.kovuk){b.kovuk.x=b.kovuk.x||b.x;const Ys=DN8.yap;if(Ys)Ys.saklan.agac={x:b.kovuk.x,y:b.kovuk.y,K,r:b.kovuk.r||32};}break;}
  case 'lolipop':dn8Lolipop(c,b.x,b.y,b.h,b.col,Y?Y.lolipop:null);break;
  case 'ev':dn8Ev(c,b,R,Y);break;
  case 'kulube':dn8Kulube(c,b,R,Y);break;
  case 'ambar':dn8Ambar(c,b,R,Y);break;
  case 'degirmen':dn8Degirmen(c,b,R,Y);break;
  case 'kemer':dn8Kemer(c,b,R,Y);break;
  case 'kule':dn8Kule(c,b.x,b.y,b.h,R,Y,false);break;
  case 'tezgah':dn8Tezgah(c,b,R,Y);break;
  case 'cit':dn8Cit(c,b.x0+20,b.x1-20,x=>dn8Surface(x),true);break;
  case 'saman':for(let k=0;k<b.n;k++)dn8Saman(c,b.x+(k-(b.n-1)/2)*58,b.y,56,46,R);if(b.n>1)dn8Saman(c,b.x,b.y-44,56,44,R);break;
  case 'ucurum':dn8Ucurum(c,b,R);break;
  case 'direk':dn8Direk(c,b,Y);break;
 }
}
// ── Sokak evi: eğri duvar, bölgeye/komşuya özgü çatı (kabak kubbe, cadı şapkası, kedi kulakları, dantel saçak...),
// pencereler (kapı alanı DN8_KAPI boş), baca, saçakta renkli ampuller. Kapının kendisini seker.js çizer.
function dn8Ev(c,b,R,Y){
 const x=b.x,y=b.y,w=b.w,h=b.h,rh=b.rh,duvar=dn8Gece(b.duvar,.3),koyu=dn8Mix(duvar,'#140a28',.42),ac=dn8Mix(duvar,'#f0e0ff',.14),cati=dn8Gece(b.cati,.28);
 const xl=x-w/2,xr=x+w/2,ust=y-h,egim=b.egim||0;
 const kapiBos=(px,py,pw,ph)=>!b.meydan&&px+pw/2>x+DN8_KAPI.x0-18&&px-pw/2<x+DN8_KAPI.x1+18&&py+ph/2>y+DN8_KAPI.y0-14;
 // yan kanat (karaKedi evi: baca burada, hayaletçik saklanır)
 if(b.kanat){const K=b.kanat,kx0=xr-12,kx1=xr+K.w,ky=y-K.h,bx=K.bacaX;
  c.fillStyle=dn8Mix(duvar,'#1a1030',.12);c.fillRect(kx0,ky,kx1-kx0,K.h+4);
  c.strokeStyle=koyu;c.lineWidth=2;for(let yy=ky+14;yy<y;yy+=16){c.beginPath();c.moveTo(kx0,yy);c.lineTo(kx1,yy);c.stroke();}
  // kanat çatısı (yumuşak eğimli) ve baca (önbellek sprite'ı; ön parçası dn8SaklanOn ile hayaletin önüne de çizilir)
  const by=y-K.bacaH;dn8BacaArt();c.drawImage(DN8.fx.baca,bx-DN8.fx.baca.w2,by-6);
  if(Y)Y.saklan.baca={x:bx,y:by};
  c.fillStyle=cati;c.beginPath();c.moveTo(kx0-8,ky+4);c.quadraticCurveTo(kx0+(kx1-kx0)*.4,ky-60,kx1+14,ky+8);c.lineTo(kx1+14,ky+16);c.lineTo(kx0-8,ky+14);c.closePath();c.fill();
  c.fillStyle='rgba(255,230,250,.12)';c.beginPath();c.moveTo(kx0-8,ky+4);c.quadraticCurveTo(kx0+(kx1-kx0)*.4,ky-60,kx1+14,ky+8);c.quadraticCurveTo(kx0+(kx1-kx0)*.4,ky-46,kx0-8,ky+10);c.fill();
  dn8Pencere(c,kx0+(kx1-kx0)*.5,y-K.h*.52,26,32,'yuvarlak',b,Y,R);
  // kanat duvarı geniş ve boş kalmasın: iki küçük kepenkli pencere, altta çiçek saksıları ve duvara tırmanan sarmaşık
  dn8Pencere(c,kx0+(kx1-kx0)*.2,y-K.h*.55,28,34,'kare',b,Y,R);dn8Pencere(c,kx0+(kx1-kx0)*.8,y-K.h*.55,28,34,'kare',b,Y,R);
  for(let k=0;k<3;k++){const px=kx0+(kx1-kx0)*(.3+k*.2),py=y;c.fillStyle=dn8Gece('#c8704a',.3);c.beginPath();c.moveTo(px-11,py-20);c.lineTo(px+11,py-20);c.lineTo(px+8,py);c.lineTo(px-8,py);c.closePath();c.fill();
   c.fillStyle=dn8Gece('#4a8a5e',.3);c.beginPath();c.arc(px,py-24,9,0,6.283);c.fill();c.fillStyle=dn8Gece(DN8_SEKER[(k*2+1)%6],.25);for(let m=0;m<3;m++){c.beginPath();c.arc(px-6+m*6,py-28+(m%2)*5,3.2,0,6.283);c.fill();}}
  c.strokeStyle=dn8Gece('#3e7a52',.25);c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(kx1-14,y);c.bezierCurveTo(kx1-30,y-50,kx1-4,y-90,kx1-22,y-K.h+10);c.stroke();
  for(let m=1;m<7;m++){const u=m/7,lx=kx1-14-Math.sin(u*5)*10,ly=y-u*(K.h-10);c.fillStyle=dn8Gece(m%2?'#4e8a62':'#3e7a52',.25);c.beginPath();c.ellipse(lx+(m%2?6:-6),ly,6,3.4,m%2?.6:-.6,0,6.283);c.fill();}}
 // duvar: hafif eğri (üst kenar biraz kayık), sol yan aydınlık, sağ yan gölge
 c.fillStyle=duvar;c.beginPath();c.moveTo(xl,y+4);c.lineTo(xl+egim-4,ust);c.lineTo(xr+egim+4,ust);c.lineTo(xr,y+4);c.closePath();c.fill();
 c.fillStyle=koyu;c.globalAlpha=.55;c.beginPath();c.moveTo(xr-w*.22,y+4);c.lineTo(xr-w*.22+egim,ust);c.lineTo(xr+egim+4,ust);c.lineTo(xr,y+4);c.closePath();c.fill();c.globalAlpha=1;
 c.fillStyle=ac;c.globalAlpha=.4;c.fillRect(xl+2,ust,10,h);c.globalAlpha=1;
 // duvar dokusu: tahta (yatay), taş (yuvarlak taşlar) ya da sıva + kirişler
 c.save();c.beginPath();c.moveTo(xl,y+4);c.lineTo(xl+egim-4,ust);c.lineTo(xr+egim+4,ust);c.lineTo(xr,y+4);c.closePath();c.clip();
 if(b.doku==='tas'){for(let yy=ust+6,i=0;yy<y;yy+=22,i++)for(let xx=xl+(i%2?10:-6);xx<xr;xx+=34){if(kapiBos(xx+15,yy+9,30,18))continue;c.fillStyle=dn8Mix(duvar,i%3?'#ffffff':'#140a28',.08);dn8Yk(c,xx,yy,30,18,7);c.fill();c.strokeStyle=koyu;c.globalAlpha=.4;c.lineWidth=1.2;c.stroke();c.globalAlpha=1;}}
 else if(b.doku==='tahta'){c.strokeStyle=koyu;c.globalAlpha=.5;c.lineWidth=1.6;for(let yy=ust+12;yy<y;yy+=13){c.beginPath();c.moveTo(xl,yy+Math.sin(yy*.3)*1.5);c.lineTo(xr,yy);c.stroke();}c.globalAlpha=1;
  c.fillStyle='rgba(255,240,220,.18)';for(let k=0;k<30;k++){c.beginPath();c.arc(xl+R()*w,ust+R()*h,1.4,0,6.283);c.fill();}}
 else{c.strokeStyle=dn8Mix(koyu,'#000000',.1);c.lineWidth=5;c.beginPath();c.moveTo(xl,ust+h*.42);c.lineTo(xr,ust+h*.42);c.moveTo(xl+8,ust);c.lineTo(xl+8,y);c.moveTo(xr-8,ust);c.lineTo(xr-8,y);c.stroke();
  c.lineWidth=3;c.beginPath();c.moveTo(xl+8,ust+h*.42);c.lineTo(xl+w*.22,ust+6);c.moveTo(xr-8,ust+h*.42);c.lineTo(xr-w*.22,ust+6);c.stroke();}
 c.restore();
 // temel taşları
 c.fillStyle=dn8Mix(koyu,'#6a5a8a',.3);for(let xx=xl;xx<xr;xx+=26){if(kapiBos(xx+12,y-8,24,16))continue;dn8Yk(c,xx+1,y-14,24,16,6);c.fill();}
 // çatı
 dn8Cati(c,b,xl+egim,xr+egim,ust,rh,cati,R,Y);
 // pencereler: alt kat iki yanda (kapı alanından uzak), üst katta 1..3
 const pw=b.pw||34,ph=b.ph||44,st=b.pstil||'kemer';
 const alt=b.meydan?[xl+w*.2,xr-w*.2]:[Math.min(xl+w*.17,x+DN8_KAPI.x0-30-pw/2),Math.max(xr-w*.15,x+DN8_KAPI.x1+30+pw/2)];
 for(const px of alt){if(px-pw/2<xl+6||px+pw/2>xr-4||kapiBos(px,y-h*.36,pw,ph))continue;dn8Pencere(c,px,y-h*.36,pw,ph,st,b,Y,R);}
 if(h>230){const n=w>330?3:2,py=ust+ph*.45+20;for(let k=0;k<n;k++){const px=xl+w*(k+.5)/n+egim*.8;if(kapiBos(px,py,pw,ph))continue;dn8Pencere(c,px,py,pw*.92,ph*.9,st,b,Y,R);}}
 // saçakta renkli ampul dizisi (karede yanar)
 if(Y){const n=Math.floor(w/26);for(let k=0;k<=n;k++){const u=k/n,px=lerp(xl-6,xr+6,u)+egim,py=ust+4+Math.sin(u*Math.PI)*10;Y.ampul.push({x:px,y:py,col:DN8_SEKER[k%6],ph:R()*6.283,ev:b.x,r:5});}}
 c.strokeStyle='rgba(30,16,50,.7)';c.lineWidth=1.2;c.beginPath();for(let k=0;k<=20;k++){const u=k/20,px=lerp(xl-6,xr+6,u)+egim,py=ust+4+Math.sin(u*Math.PI)*10;k?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
 for(let k=0;k<=Math.floor(w/26);k++){const u=k/Math.floor(w/26),px=lerp(xl-6,xr+6,u)+egim,py=ust+4+Math.sin(u*Math.PI)*10;c.fillStyle=dn8Gece(DN8_SEKER[k%6],.5);c.beginPath();c.arc(px,py+3,3.6,0,6.283);c.fill();}
 // kapı önünde iki saksı kabak (kapı alanının dışında)
 if(!b.meydan){dn8Kabak(c,x+DN8_KAPI.x0-34,y+3,.85,DN8_KAB[b.k%3],(b.k>>1)%3,Y?Y.yuz:null);dn8Kabak(c,x+DN8_KAPI.x1+30,y+3,.6,DN8_KAB[(b.k+1)%3],-1,null);}
 // meydan evleri: kapısız kalmasın — kemerli, kepenk renginde kapı, yıldız tokmak, üstünde minik kabak çelenk, önünde paspas
 else{const dw=52,dh=Math.min(96,h*.42),dx=x+egim*.2,kp=dn8Gece(b.kepenk||'#7a4a2a',.3);
  c.fillStyle='#e8dcc8';c.beginPath();c.moveTo(dx-dw/2-5,y);c.lineTo(dx-dw/2-5,y-dh+dw/2);c.arc(dx,y-dh+dw/2,dw/2+5,Math.PI,0);c.lineTo(dx+dw/2+5,y);c.closePath();c.fill();
  c.fillStyle=kp;c.beginPath();c.moveTo(dx-dw/2,y);c.lineTo(dx-dw/2,y-dh+dw/2);c.arc(dx,y-dh+dw/2,dw/2,Math.PI,0);c.lineTo(dx+dw/2,y);c.closePath();c.fill();
  c.strokeStyle=dn8Mix(kp,'#140a28',.35);c.lineWidth=2;c.beginPath();for(const u of [-.25,0,.25]){c.moveTo(dx+u*dw,y-2);c.lineTo(dx+u*dw,y-dh+dw*.5-Math.cos(u*2)*dw*.2);}c.stroke();
  c.fillStyle='#ffd27a';c.beginPath();c.arc(dx+dw*.3,y-dh*.45,3.6,0,6.283);c.fill();
  c.fillStyle='rgba(255,231,168,.55)';c.beginPath();c.ellipse(dx,y-dh+dw*.42,9,7,0,0,6.283);c.fill();
  dn8Kabak(c,dx,y-dh-2,.5,DN8_KAB[b.k%3],1,Y?Y.yuz:null);
  c.fillStyle=dn8Gece('#ff8fc8',.35);dn8Yk(c,dx-dw/2-2,y-5,dw+4,7,3);c.fill();}
}
// çatı türleri
function dn8Cati(c,b,xl,xr,ust,rh,cati,R,Y){
 const w=xr-xl,cx=(xl+xr)/2,koyu=dn8Mix(cati,'#140a28',.4),ac=dn8Mix(cati,'#ffe0f0',.16),t=b.cati8||'dik';
 // baca(lar) çatının arkasında
 for(const bk of b.bacalar||[]){const bx=xl+w*bk,by=ust-rh*.55;c.fillStyle=dn8Mix(cati,'#5a3040',.45);c.fillRect(bx-9,by-40,18,60);c.fillStyle=dn8Mix(cati,'#2a1020',.3);c.fillRect(bx-12,by-46,24,8);if(Y)Y.baca.push({x:bx,y:by-48,ph:R()*6.283});}
 c.fillStyle=cati;c.beginPath();
 if(t==='kabak'){
  // kocaman balkabağı kubbe: dilimli turuncu, tepede kıvrık sap ve yaprak
  const kc=dn8Gece('#d8702e',.25);for(const [k,r] of [[-.36,.34],[.36,.34],[-.14,.36],[.14,.36],[0,.3]]){c.fillStyle=k===0?dn8Mix(kc,'#ffd0a0',.18):Math.abs(k)>.3?dn8Mix(kc,'#3a1428',.18):kc;c.beginPath();c.ellipse(cx+k*w*1.02,ust+4,w*r,rh,0,Math.PI,0);c.fill();}
  c.strokeStyle=dn8Mix(kc,'#3a1428',.5);c.lineWidth=2;for(const k of [-.28,0,.28]){c.beginPath();c.ellipse(cx+k*w*.9,ust+4,w*.1,rh*.96,0,Math.PI*1.08,Math.PI*1.92);c.stroke();}
  c.fillStyle='#5e6a34';c.beginPath();c.moveTo(cx-7,ust-rh+8);c.quadraticCurveTo(cx-4,ust-rh-26,cx+12,ust-rh-34);c.lineTo(cx+14,ust-rh-24);c.quadraticCurveTo(cx+4,ust-rh-18,cx+7,ust-rh+8);c.fill();
  c.fillStyle='#4a7a46';c.beginPath();c.ellipse(cx-26,ust-rh-6,22,10,-.35,0,6.283);c.fill();c.strokeStyle='#5a8a4a';c.lineWidth=3;c.beginPath();c.moveTo(cx+10,ust-rh);for(let j=0;j<=14;j++){const a=j/14*6.5,r=16*(1-j/16);c.lineTo(cx+34+Math.cos(a)*r,ust-rh-10-Math.sin(a)*r);}c.stroke();
  c.fillStyle=dn8Mix(kc,'#2a1020',.45);c.fillRect(xl-12,ust-2,w+24,10);
 } else if(t==='sapka'){
  // cadı şapkası: kıvrık sivri külah, bant, ucunda yıldız
  const tip=rh*1.25;c.moveTo(xl-26,ust+6);c.quadraticCurveTo(cx-w*.12,ust-rh*.4,cx-w*.04,ust-tip*.78);c.quadraticCurveTo(cx+w*.02,ust-tip*1.02,cx+w*.3,ust-tip*1.06);c.quadraticCurveTo(cx+w*.34,ust-tip*1.02,cx+w*.33,ust-tip*.97);
  c.quadraticCurveTo(cx+w*.14,ust-tip*.92,cx+w*.12,ust-tip*.7);c.quadraticCurveTo(cx+w*.2,ust-rh*.35,xr+26,ust+6);c.closePath();c.fill();
  c.fillStyle=ac;c.globalAlpha=.5;c.beginPath();c.moveTo(xl-26,ust+6);c.quadraticCurveTo(cx-w*.12,ust-rh*.4,cx-w*.04,ust-tip*.78);c.lineTo(cx,ust-tip*.7);c.quadraticCurveTo(cx-w*.06,ust-rh*.4,cx-w*.2,ust+6);c.fill();c.globalAlpha=1;
  c.fillStyle=dn8Gece('#ff9a3c',.3);c.beginPath();c.moveTo(xl-14,ust-8);c.quadraticCurveTo(cx,ust-26,xr+14,ust-8);c.lineTo(xr+18,ust+6);c.quadraticCurveTo(cx,ust-10,xl-18,ust+6);c.fill();
  c.fillStyle='#ffe7a8';const sx=cx+w*.33,sy=ust-tip*1.0;c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(sx+Math.cos(an)*13,sy+Math.sin(an)*13);c.lineTo(sx+Math.cos(an+.628)*5.5,sy+Math.sin(an+.628)*5.5);}c.fill();
  if(Y)Y.ampul.push({x:sx,y:sy,col:'#ffe7a8',ph:0,r:16,ev:b.x});
  for(let k=0;k<6;k++){const px=cx+(R()-.5)*w*.6,py=ust-R()*rh*.7-10;c.fillStyle='rgba(255,231,168,.55)';c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(px+Math.cos(an)*5,py+Math.sin(an)*5);c.lineTo(px+Math.cos(an+.628)*2,py+Math.sin(an+.628)*2);}c.fill();}
 } else if(t==='kedi'){
  // kedi kulaklı çatı: iki yanda yumuşak sivri kulak, ortada yuvarlak tavan penceresi (kedi gözü gibi)
  c.moveTo(xl-20,ust+6);c.lineTo(xl+w*.06,ust-rh*.95);c.quadraticCurveTo(xl+w*.12,ust-rh*1.25,xl+w*.2,ust-rh*.86);c.quadraticCurveTo(cx,ust-rh*.98,xr-w*.2,ust-rh*.86);c.quadraticCurveTo(xr-w*.12,ust-rh*1.25,xr-w*.06,ust-rh*.95);c.lineTo(xr+20,ust+6);c.closePath();c.fill();
  c.fillStyle=dn8Gece('#ff9fc8',.45);for(const s of [-1,1]){const ex=s<0?xl+w*.12:xr-w*.12;c.beginPath();c.moveTo(ex-w*.04,ust-rh*.88);c.quadraticCurveTo(ex,ust-rh*1.12,ex+w*.04,ust-rh*.88);c.fill();}
  c.strokeStyle=koyu;c.lineWidth=1.4;for(let yy=ust-rh*.7;yy<ust;yy+=12){c.beginPath();for(let xx=xl;xx<xr;xx+=14){c.moveTo(xx,yy);c.quadraticCurveTo(xx+7,yy+6,xx+14,yy);}c.stroke();}
  dn8Pencere(c,cx,ust-rh*.45,40,40,'yuvarlak',b,Y,R);
 } else if(t==='dantel'){
  // yumuşak yuvarlak çatı, beyaz dantel saçak; yanda yuvarlak kulecik
  c.moveTo(xl-18,ust+6);c.bezierCurveTo(xl-10,ust-rh*1.05,xr+10,ust-rh*1.05,xr+18,ust+6);c.closePath();c.fill();
  c.fillStyle=ac;c.globalAlpha=.45;c.beginPath();c.moveTo(xl-18,ust+6);c.bezierCurveTo(xl-10,ust-rh*1.05,cx,ust-rh*1.0,cx-w*.1,ust-rh*.7);c.quadraticCurveTo(xl+w*.1,ust-rh*.4,xl-6,ust+6);c.fill();c.globalAlpha=1;
  c.fillStyle='#e8e0f4';for(let xx=xl-14;xx<xr+14;xx+=16){c.beginPath();c.arc(xx+8,ust+6,8,0,Math.PI);c.fill();}c.fillStyle='rgba(80,60,120,.6)';for(let xx=xl-14;xx<xr+14;xx+=16){c.beginPath();c.arc(xx+8,ust+9,2.2,0,6.283);c.fill();}
  const tx=xl+w*.18;c.fillStyle=dn8Mix(cati,'#ffffff',.06);c.fillRect(tx-22,ust-rh*.95,44,rh*.7);c.fillStyle=cati;c.beginPath();c.moveTo(tx-30,ust-rh*.9);c.quadraticCurveTo(tx,ust-rh*1.6,tx+30,ust-rh*.9);c.fill();
  dn8Pencere(c,tx,ust-rh*.72,18,24,'yuvarlak',b,Y,R);
 } else if(t==='kubbe'){
  // tombul yeşil kiremit kubbe, üstünde sarmaşık ve minik kabaklar
  const yc=dn8Gece('#5a8a5a',.3);c.fillStyle=yc;c.moveTo(xl-18,ust+6);c.bezierCurveTo(xl-14,ust-rh*1.1,xr+14,ust-rh*1.1,xr+18,ust+6);c.closePath();c.fill();
  c.strokeStyle=dn8Mix(yc,'#102010',.35);c.lineWidth=1.5;for(let yy=ust-rh*.7;yy<ust;yy+=11){c.beginPath();for(let xx=xl-10;xx<xr+10;xx+=14){c.moveTo(xx,yy);c.quadraticCurveTo(xx+7,yy+7,xx+14,yy);}c.stroke();}
  c.strokeStyle='#4a7a46';c.lineWidth=3;c.beginPath();c.moveTo(xl+10,ust);c.bezierCurveTo(xl+w*.3,ust-rh*.8,xr-w*.3,ust-rh*.9,xr-10,ust-rh*.2);c.stroke();
  for(const u of [.3,.55,.78])dn8Kabak(c,lerp(xl+10,xr-10,u),ust-rh*.62-Math.sin(u*Math.PI)*rh*.2+20,.75,DN8_KAB[Math.floor(u*5)%3],Math.floor(u*7)%3,Y?Y.yuz:null);
 } else {
  // dik, eğri kiremit çatı; tepede hilal rüzgârgülü
  c.moveTo(xl-20,ust+6);c.lineTo(cx-w*.05,ust-rh);c.quadraticCurveTo(cx,ust-rh*1.05,cx+w*.05,ust-rh*.98);c.lineTo(xr+20,ust+6);c.closePath();c.fill();
  c.save();c.clip();c.strokeStyle=koyu;c.lineWidth=1.3;for(let yy=ust-rh;yy<ust+6;yy+=10){c.beginPath();for(let xx=xl-20;xx<xr+20;xx+=13){c.moveTo(xx,yy);c.quadraticCurveTo(xx+6.5,yy+6,xx+13,yy);}c.stroke();}c.restore();
  c.fillStyle=ac;c.globalAlpha=.35;c.beginPath();c.moveTo(xl-20,ust+6);c.lineTo(cx-w*.05,ust-rh);c.lineTo(cx-w*.1,ust-rh*.8);c.lineTo(xl,ust+6);c.fill();c.globalAlpha=1;
  c.strokeStyle='#3a2a4a';c.lineWidth=2.4;c.beginPath();c.moveTo(cx-w*.05,ust-rh);c.lineTo(cx-w*.05,ust-rh-34);c.stroke();
  c.fillStyle='#ffe7a8';c.beginPath();c.arc(cx-w*.05,ust-rh-44,10,0,6.283);c.fill();c.fillStyle=cati;c.beginPath();c.arc(cx-w*.05+5,ust-rh-47,9,0,6.283);c.fill();
  dn8Pencere(c,cx-w*.04,ust-rh*.45,26,30,'yuvarlak',b,Y,R);
 }
 // saçak gölgesi
 c.fillStyle='rgba(20,10,40,.35)';c.fillRect(xl-10,ust+4,w+20,6);
}
// pencere: çerçeve, sıcak cam (loş; karede parlar), kepenkler, saksı; stil 'kemer' | 'yuvarlak' | 'kare'. Kayıt → Y.pen
function dn8Pencere(c,x,y,w,h,st,b,Y,R){
 const cer='#e8dcc8',kep=dn8Gece(b&&b.kepenk||'#6a3a7a',.25);
 if(st!=='yuvarlak'&&w>22){c.fillStyle=kep;for(const s of [-1,1]){dn8Yk(c,x+s*(w/2+8)-8,y-h/2,16,h,4);c.fill();c.strokeStyle='rgba(20,10,40,.35)';c.lineWidth=1;for(let yy=y-h/2+6;yy<y+h/2-3;yy+=6){c.beginPath();c.moveTo(x+s*(w/2+8)-6,yy);c.lineTo(x+s*(w/2+8)+6,yy);c.stroke();}}}
 const yol=(ww,hh)=>{c.beginPath();if(st==='yuvarlak')c.ellipse(x,y,ww/2,hh/2,0,0,6.283);else if(st==='kemer'){c.moveTo(x-ww/2,y+hh/2);c.lineTo(x-ww/2,y-hh/2+ww/2);c.arc(x,y-hh/2+ww/2,ww/2,Math.PI,0);c.lineTo(x+ww/2,y+hh/2);c.closePath();}else c.rect(x-ww/2,y-hh/2,ww,hh);};
 c.fillStyle=cer;yol(w+7,h+7);c.fill();
 c.fillStyle='#4a3660';yol(w,h);c.fill();c.fillStyle='rgba(150,96,90,.45)';c.save();yol(w,h);c.clip();c.fillRect(x-w/2,y+h*.1,w,h*.4);
 c.fillStyle='rgba(220,200,255,.16)';c.fillRect(x-w/2,y-h/2,w*.36,h*.55);
 // pencerede minik siluet / perde (komşuya göre): kedi, dantel perde, saksı çiçeği
 if(b&&b.icerik==='kedi'&&R()<.6){c.fillStyle='rgba(40,20,50,.75)';c.beginPath();c.ellipse(x+w*.12,y+h*.3,w*.2,h*.2,0,0,6.283);c.fill();c.beginPath();c.arc(x+w*.12,y+h*.02,w*.13,0,6.283);c.fill();c.beginPath();c.moveTo(x+w*.02,y-h*.02);c.lineTo(x+w*.04,y-h*.16);c.lineTo(x+w*.1,y-h*.06);c.fill();c.beginPath();c.moveTo(x+w*.14,y-h*.06);c.lineTo(x+w*.2,y-h*.16);c.lineTo(x+w*.22,y-h*.02);c.fill();}
 if(b&&b.icerik==='dantel'){c.fillStyle='rgba(250,240,255,.5)';for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*w/2,y-h/2);c.quadraticCurveTo(x+s*w*.1,y,x+s*w/2,y+h/2);c.lineTo(x+s*w/2,y-h/2);c.fill();}}
 c.restore();
 c.strokeStyle=cer;c.lineWidth=2.4;c.beginPath();c.moveTo(x,y-h/2);c.lineTo(x,y+h/2);if(st!=='yuvarlak'){c.moveTo(x-w/2,y+h*.08);c.lineTo(x+w/2,y+h*.08);}else{c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);}c.stroke();
 if(st!=='yuvarlak'){c.fillStyle='#6a4058';c.fillRect(x-w/2-6,y+h/2+2,w+12,7);
  for(let k=0;k<4;k++){c.fillStyle=dn8Gece(DN8_SEKER[(k+(x|0))%6],.3);c.beginPath();c.arc(x-w/2+k*(w/3),y+h/2+1,3.4,0,6.283);c.fill();}}
 if(Y)Y.pen.push({x,y,w,h,st,ev:b?b.x:x,ph:R()*6.283,th:R()});
}
// baca sprite'ı (karaKedi evinin yan kanadı, hayaletçik saklanır): eğri tuğla gövde, yuvarlak kenarlı ağız
function dn8BacaArt(){
 const F=dn8FxArt();if(F.baca)return F.baca;
 const cv=dn8Cv(72,120),c=cv.getContext('2d');c.translate(36,6);
 c.fillStyle='#6a3a4a';c.beginPath();c.moveTo(-22,8);c.lineTo(-25,110);c.lineTo(25,110);c.lineTo(20,8);c.closePath();c.fill();
 c.fillStyle='rgba(20,10,30,.3)';c.fillRect(4,8,18,102);
 c.strokeStyle='rgba(30,14,30,.55)';c.lineWidth=1.4;for(let yy=18,i=0;yy<108;yy+=11,i++){c.beginPath();c.moveTo(-23,yy);c.lineTo(23,yy);c.stroke();c.beginPath();for(let xx=-22+(i%2?8:0);xx<22;xx+=16){c.moveTo(xx,yy);c.lineTo(xx,yy+11);}c.stroke();}
 c.fillStyle='#7e4a5a';dn8Yk(c,-30,-2,60,14,7);c.fill();c.fillStyle='rgba(255,220,230,.25)';c.fillRect(-26,-1,52,3);
 c.fillStyle='#1e1028';c.beginPath();c.ellipse(0,1,22,4,0,0,6.283);c.fill();
 cv.w2=36;F.baca=cv;return cv;
}
// hayaletçik saklanma yerinin ön parçası (kabak.js hayaletçiği çizdikten sonra çağırır; dünya dönüşümünde)
function dn8SaklanOn(tip,x,y){
 if(!dn8Ready()||!Number.isFinite(x)||!Number.isFinite(y))return;const F=dn8FxArt();
 if(tip==='baca'){const b=dn8BacaArt();g.drawImage(b,0,10,72,110,x-36,y+4,72,110);}   // ağzın altından aşağısı (kenar dudak + gövde)
 else if(tip==='agac'){const Y=dn8Yapilar(),A=Y.saklan.agac,K=(A&&A.K)||DN8_AGACK[3],r=(A&&A.r)||32;
  // kovuğun alt dudağından aşağısı: gövde parçası (aynı gölgeleme) — saklanan hayaletçiğin gövdesi kovuğun içinde kalır
  g.fillStyle=K.gov;g.beginPath();g.moveTo(x-r,y+4);g.quadraticCurveTo(x,y+30,x+r,y+4);g.lineTo(x+r*1.03,y+96);g.quadraticCurveTo(x,y+104,x-r*1.03,y+96);g.closePath();g.fill();
  g.fillStyle=K.govA;g.beginPath();g.ellipse(x-r*.38,y+58,r*.42,40,0,0,6.283);g.fill();
  g.strokeStyle=K.govA;g.lineWidth=5;g.beginPath();g.moveTo(x-r*.82,y+10);g.quadraticCurveTo(x,y+34,x+r*.82,y+10);g.stroke();
  g.strokeStyle=K.koyu;g.lineWidth=1.6;g.beginPath();g.arc(x+r*.2,y+70,r*.42,-.6,1.6);g.stroke();}
}

// ── Cadı Nine'nin kulübesi: taş duvar, kocaman kıvrık cadı şapkası çatı, yuvarlak yeşil kapı, yuvarlak pencereler, baca, saksılar ──
function dn8Kulube(c,b,R,Y){
 const x=b.x,y=b.y,w=250,h=170,xl=x-w/2,xr=x+w/2,ust=y-h;
 // duvar: yuvarlak taşlar
 c.fillStyle='#5e4a7a';dn8Yk(c,xl,ust,w,h+4,26);c.fill();
 c.save();dn8Yk(c,xl,ust,w,h+4,26);c.clip();
 for(let yy=ust+4,i=0;yy<y;yy+=24,i++)for(let xx=xl+(i%2?12:-8);xx<xr;xx+=38){c.fillStyle=dn8Mix('#6e5a8e',i%3?'#ffffff':'#1a1030',.07+(R()*.06));dn8Yk(c,xx,yy,34,20,9);c.fill();c.strokeStyle='rgba(30,20,50,.35)';c.lineWidth=1.3;c.stroke();}
 c.fillStyle='rgba(20,10,40,.3)';c.fillRect(x+w*.22,ust,w*.3,h+4);c.restore();
 // sarmaşık (sol köşe) ve ay işaretli tabela
 c.strokeStyle='#3e7a5a';c.lineWidth=3;c.beginPath();c.moveTo(xl+10,y);c.bezierCurveTo(xl+30,y-60,xl-6,y-110,xl+20,ust+10);c.stroke();
 for(let k=0;k<9;k++){const u=k/9,lx=xl+10+Math.sin(u*6)*12,ly=y-u*(h-10);c.fillStyle=k%2?'#4e8a62':'#3e7a5a';c.beginPath();c.ellipse(lx+(k%2?5:-5),ly,6,3,k%2?.5:-.5,0,6.283);c.fill();if(Y&&k%3===1)Y.ampul.push({x:lx,y:ly-3,col:'#ff8fc8',ph:R()*6.283,r:5});}
 // baca + kıvrık cadı şapkası çatı
 c.fillStyle='#5a3a5a';c.fillRect(x+56,ust-150,22,110);c.fillStyle='#6a4a6a';c.fillRect(x+51,ust-158,32,12);if(Y)Y.baca.push({x:x+67,y:ust-160,ph:1,pembe:true});
 const rc='#4a2e78';c.fillStyle=rc;c.beginPath();c.moveTo(xl-44,ust+16);c.quadraticCurveTo(x-60,ust-40,x-28,ust-150);c.quadraticCurveTo(x-14,ust-236,x+48,ust-262);c.quadraticCurveTo(x+70,ust-266,x+76,ust-248);c.quadraticCurveTo(x+40,ust-238,x+24,ust-176);c.quadraticCurveTo(x+30,ust-60,xr+44,ust+16);c.quadraticCurveTo(x,ust+2,xl-44,ust+16);c.fill();
 c.fillStyle='rgba(190,160,255,.16)';c.beginPath();c.moveTo(xl-44,ust+16);c.quadraticCurveTo(x-60,ust-40,x-28,ust-150);c.lineTo(x-14,ust-140);c.quadraticCurveTo(x-40,ust-40,x-40,ust+10);c.fill();
 // yamalar ve yıldızlar
 c.fillStyle='#6a4498';dn8Yk(c,x-30,ust-90,30,26,6);c.fill();c.strokeStyle='rgba(255,231,168,.7)';c.lineWidth=1.4;c.beginPath();for(let k=0;k<5;k++){c.moveTo(x-27+k*6,ust-92);c.lineTo(x-25+k*6,ust-88);c.moveTo(x-27+k*6,ust-62);c.lineTo(x-25+k*6,ust-66);}c.stroke();
 for(const [sx,sy,r] of [[x+6,ust-60,6],[x-46,ust-20,5],[x+30,ust-120,4],[x-10,ust-190,4]]){c.fillStyle='#ffe7a8';c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(sx+Math.cos(an)*r,sy+Math.sin(an)*r);c.lineTo(sx+Math.cos(an+.628)*r*.45,sy+Math.sin(an+.628)*r*.45);}c.fill();}
 c.fillStyle='#ff9a3c';c.beginPath();c.moveTo(xl-30,ust+2);c.quadraticCurveTo(x,ust-22,xr+30,ust+2);c.lineTo(xr+36,ust+14);c.quadraticCurveTo(x,ust-8,xl-36,ust+14);c.fill();
 c.fillStyle='#ffe7a8';const sx=x+78,sy=ust-252;c.beginPath();for(let m=0;m<5;m++){const an=-1.571+m*1.2566;c.lineTo(sx+Math.cos(an)*14,sy+Math.sin(an)*14);c.lineTo(sx+Math.cos(an+.628)*6,sy+Math.sin(an+.628)*6);}c.fill();
 if(Y)Y.ampul.push({x:sx,y:sy,col:'#ffe7a8',ph:0,r:18});
 // yuvarlak yeşil kapı (hilal pencereli), iki yuvarlak pencere, kapı feneri
 c.fillStyle='#e8dcc8';c.beginPath();c.moveTo(x-34,y);c.lineTo(x-34,y-62);c.arc(x,y-62,34,Math.PI,0);c.lineTo(x+34,y);c.fill();
 c.fillStyle='#3e7a5a';c.beginPath();c.moveTo(x-29,y);c.lineTo(x-29,y-62);c.arc(x,y-62,29,Math.PI,0);c.lineTo(x+29,y);c.fill();
 c.strokeStyle='#2e5a44';c.lineWidth=2;for(const k of [-14,0,14]){c.beginPath();c.moveTo(x+k,y);c.lineTo(x+k,y-80);c.stroke();}
 c.fillStyle='#ffd27a';c.beginPath();c.arc(x+18,y-44,3.4,0,6.283);c.fill();c.fillStyle='#ffcf7a';c.beginPath();c.arc(x,y-74,10,0,6.283);c.fill();c.fillStyle='#3e7a5a';c.beginPath();c.arc(x+5,y-77,9,0,6.283);c.fill();
 if(Y)Y.pen.push({x,y:y-74,w:20,h:20,st:'yuvarlak',ev:x,ph:2,th:0});
 dn8Pencere(c,x-82,y-96,40,40,'yuvarlak',{kepenk:'#3e7a5a'},Y,R);dn8Pencere(c,x+86,y-100,38,38,'yuvarlak',{kepenk:'#3e7a5a'},Y,R);
 // saksılar, kabaklar, kurutulmuş otlar
 for(const [px,s] of [[x-118,1],[x-50,.7],[x+52,.8]])dn8Kabak(c,px,y+3,s,DN8_KAB[(px|0)%3],s>.9?0:-1,Y?Y.yuz:null);
 for(const px of [x-140,x+124]){c.fillStyle='#8a5a5e';c.beginPath();c.moveTo(px-12,y-22);c.lineTo(px+12,y-22);c.lineTo(px+9,y);c.lineTo(px-9,y);c.fill();for(let k=0;k<5;k++){c.fillStyle=dn8Gece(DN8_SEKER[k],.25);c.beginPath();c.arc(px-8+k*4,y-28-(k%2)*6,4,0,6.283);c.fill();if(Y&&k===2)Y.ampul.push({x:px,y:y-30,col:DN8_SEKER[k],ph:R()*6,r:7});}}
}
// ── Tarlada ambar: yuvarlak çatılı sevimli ambar, yuvarlak samanlık penceresi, çapraz kapılar, kabak çelengi ──
function dn8Ambar(c,b,R,Y){
 const x=b.x,y=b.y,w=270,h=150,xl=x-w/2,xr=x+w/2,ust=y-h,dv=dn8Gece('#9a4a5a',.32),cat=dn8Gece('#5a3058',.3);
 c.fillStyle=dv;c.fillRect(xl,ust,w,h+4);c.strokeStyle=dn8Mix(dv,'#1a0a20',.4);c.lineWidth=1.4;for(let xx=xl+12;xx<xr;xx+=14){c.beginPath();c.moveTo(xx,ust);c.lineTo(xx,y);c.stroke();}
 c.fillStyle='rgba(20,10,30,.28)';c.fillRect(x+w*.2,ust,w*.3,h+4);
 c.fillStyle=cat;c.beginPath();c.moveTo(xl-18,ust+6);c.lineTo(xl+10,ust-70);c.quadraticCurveTo(x,ust-120,xr-10,ust-70);c.lineTo(xr+18,ust+6);c.closePath();c.fill();
 c.strokeStyle='#e8dcc8';c.lineWidth=5;c.beginPath();c.moveTo(xl-14,ust+4);c.lineTo(xl+10,ust-68);c.quadraticCurveTo(x,ust-116,xr-10,ust-68);c.lineTo(xr+14,ust+4);c.stroke();
 dn8Pencere(c,x,ust-46,40,40,'yuvarlak',{},Y,R);
 c.fillStyle='#e0b860';for(let k=0;k<8;k++){c.save();c.translate(x-14+k*4,ust-28);c.rotate((k-3.5)*.12);c.fillRect(-1,0,2,10);c.restore();}
 c.fillStyle=dn8Mix(dv,'#1a0a20',.25);c.fillRect(x-56,y-104,112,104);c.strokeStyle='#e8dcc8';c.lineWidth=5;c.strokeRect(x-56,y-104,112,104);
 c.beginPath();c.moveTo(x,y-104);c.lineTo(x,y);for(const s of [-1,1]){c.moveTo(x+s*56,y-104);c.lineTo(x,y);c.moveTo(x+s*56,y);c.lineTo(x,y-104);}c.stroke();
 // kabak çelengi
 c.strokeStyle='#3e7a5a';c.lineWidth=4;c.beginPath();c.arc(x,y-128,16,0,6.283);c.stroke();for(let k=0;k<6;k++){const a=k/6*6.283;c.fillStyle=DN8_KAB[k%3];c.beginPath();c.arc(x+Math.cos(a)*16,y-128+Math.sin(a)*16,4,0,6.283);c.fill();}
 dn8Pencere(c,xl+36,ust+50,30,38,'kare',{kepenk:'#5a3058'},Y,R);dn8Pencere(c,xr-36,ust+50,30,38,'kare',{kepenk:'#5a3058'},Y,R);
}
// ── Değirmen: kerpiç kule, yuvarlak pencereler; kanatlar karede döner (DN8.yap.degirmen) ──
function dn8Degirmen(c,b,R,Y){
 const x=b.x,y=b.y,dv=dn8Gece('#c0a0d0',.3);
 c.fillStyle=dv;c.beginPath();c.moveTo(x-70,y+4);c.lineTo(x-44,y-280);c.lineTo(x+44,y-280);c.lineTo(x+70,y+4);c.closePath();c.fill();
 c.fillStyle='rgba(20,10,40,.25)';c.beginPath();c.moveTo(x+10,y+4);c.lineTo(x+8,y-280);c.lineTo(x+44,y-280);c.lineTo(x+70,y+4);c.fill();
 c.strokeStyle='rgba(60,40,90,.3)';c.lineWidth=1.4;for(let yy=y-260;yy<y;yy+=20){const hw=lerp(70,44,(y-yy)/284);c.beginPath();c.moveTo(x-hw,yy);c.lineTo(x+hw,yy);c.stroke();}
 const cat=dn8Gece('#5a3a7a',.3);c.fillStyle=cat;c.beginPath();c.moveTo(x-58,y-272);c.quadraticCurveTo(x-40,y-350,x,y-372);c.quadraticCurveTo(x+40,y-350,x+58,y-272);c.closePath();c.fill();
 c.fillStyle='#ffe7a8';c.beginPath();c.arc(x,y-378,5,0,6.283);c.fill();
 for(const [py,r] of [[y-200,14],[y-120,16]])dn8Pencere(c,x,py,r*2,r*2,'yuvarlak',{},Y,R);
 c.fillStyle='#3a2a50';c.beginPath();c.moveTo(x-18,y+2);c.lineTo(x-18,y-38);c.arc(x,y-38,18,Math.PI,0);c.lineTo(x+18,y+2);c.fill();
 c.fillStyle='#4a3050';c.beginPath();c.arc(x,y-300,12,0,6.283);c.fill();
}
// değirmen kanatları sprite'ı (dört yumuşak kanat, çizgili bez)
function dn8KanatArt(){
 const F=dn8FxArt();if(F.kanat)return F.kanat;const cv=dn8Cv(300,300),c=cv.getContext('2d');c.translate(150,150);
 for(let k=0;k<4;k++){c.save();c.rotate(k*Math.PI/2);c.fillStyle='#3a2a4a';c.fillRect(-3,-140,6,140);
  c.fillStyle=k%2?'#c8b8e0':'#e0c8d8';c.globalAlpha=.85;dn8Yk(c,4,-136,34,104,8);c.fill();c.globalAlpha=1;c.strokeStyle='rgba(60,40,90,.5)';c.lineWidth=1.2;for(let yy=-130;yy<-36;yy+=13){c.beginPath();c.moveTo(6,yy);c.lineTo(36,yy);c.stroke();}c.restore();}
 c.fillStyle='#5a3a6a';c.beginPath();c.arc(0,0,12,0,6.283);c.fill();c.fillStyle='#ffd27a';c.beginPath();c.arc(0,0,4,0,6.283);c.fill();
 F.kanat=cv;return cv;
}
// ── Giriş kemeri: iki kıvrık sarmaşık direk, üstte kemer, ortada gülen kabak tabela; kemer boyunca ampuller ──
function dn8Kemer(c,b,R,Y){
 const x=b.x,y=b.y,w=210,hh=250;
 c.strokeStyle='#4a3060';c.lineWidth=12;c.lineCap='round';
 for(const s of [-1,1]){c.beginPath();c.moveTo(x+s*w/2,y+4);c.bezierCurveTo(x+s*(w/2+14),y-hh*.4,x+s*(w/2-14),y-hh*.7,x+s*w/2,y-hh*.82);c.stroke();}
 c.beginPath();c.moveTo(x-w/2,y-hh*.82);c.bezierCurveTo(x-w/2,y-hh*1.12,x+w/2,y-hh*1.12,x+w/2,y-hh*.82);c.stroke();
 c.strokeStyle='#3e7a5a';c.lineWidth=3;c.beginPath();for(let j=0;j<=60;j++){const u=j/60,a=u*Math.PI,px=x-Math.cos(a)*w/2+Math.sin(u*40)*5,py=y-hh*.82-Math.sin(a)*hh*.22;j?c.lineTo(px,py):c.moveTo(px,py);}c.stroke();
 for(let j=0;j<16;j++){const u=(j+.5)/16,a=u*Math.PI,px=x-Math.cos(a)*w/2,py=y-hh*.82-Math.sin(a)*hh*.22;c.fillStyle=j%2?'#4e8a62':'#3e7a5a';c.beginPath();c.ellipse(px,py-4,7,3.6,a,0,6.283);c.fill();if(Y&&j%2===0)Y.ampul.push({x:px,y:py+4,col:DN8_SEKER[j%6],ph:R()*6.283,r:6});c.fillStyle=dn8Gece(DN8_SEKER[j%6],.45);if(j%2===0){c.beginPath();c.arc(px,py+4,3.4,0,6.283);c.fill();}}
 for(const s of [-1,1])for(let j=0;j<8;j++){const u=j/8,px=x+s*w/2+Math.sin(u*9)*6,py=y-u*hh*.8;c.fillStyle=j%2?'#4e8a62':'#3e7a5a';c.beginPath();c.ellipse(px+s*6,py,7,3.4,s*.6,0,6.283);c.fill();}
 // asılı kabak tabela (gülen yüz)
 c.strokeStyle='#2a1a3a';c.lineWidth=2;c.beginPath();c.moveTo(x-18,y-hh*1.02);c.lineTo(x-14,y-hh*.86);c.moveTo(x+18,y-hh*1.02);c.lineTo(x+14,y-hh*.86);c.stroke();
 dn8Kabak(c,x,y-hh*.62,1.6,'#e8802a',0,Y?Y.yuz:null);
}
// ── Meydan saat kulesi / köy çan kulesi: eğri kule, balkabağı yüzlü saat (ışır), çan, şapka çatı ──
function dn8Kule(c,x,y,h,R,Y,koy){
 const w=koy?84:110,dv=dn8Gece(koy?'#9a78b8':'#8a70a8',koy?.28:.32),ust=y-h,xl=x-w/2,xr=x+w/2;
 c.fillStyle=dv;c.beginPath();c.moveTo(xl-6,y+4);c.lineTo(xl+4,ust);c.lineTo(xr-4,ust);c.lineTo(xr+6,y+4);c.closePath();c.fill();
 // taş örgü: şaşırtmalı yuvarlak köşeli taşlar (düz, soluk bir dikdörtgen gibi okunmasın), solda ay ışığı kenarı, sağda gölge
 const koyu=dn8Mix(dv,'#140a28',.38),acik=dn8Mix(dv,'#f0e0ff',.2);
 for(let yy=ust+4,i=0;yy<y-4;yy+=22,i++){const u=(yy-ust)/h,ka=lerp(xl+4,xl-6,u),kb=lerp(xr-4,xr+6,u);
  for(let xx=ka+(i%2?-14:0);xx<kb;xx+=30){const a=Math.max(xx,ka)+1.5,b=Math.min(xx+30,kb)-1.5;if(b-a<6)continue;
   c.fillStyle=(i*3+Math.round(xx/30))%5===0?dn8Mix(dv,'#b08ac0',.25):(i+Math.round(xx/30))%4===0?dn8Mix(dv,'#2a1a40',.12):dv;dn8Yk(c,a,yy+1.5,b-a,19,5);c.fill();}}
 c.strokeStyle=koyu;c.lineWidth=1.2;c.globalAlpha=.5;for(let yy=ust+4;yy<y;yy+=22){const u=(yy-ust)/h;c.beginPath();c.moveTo(lerp(xl+4,xl-6,u),yy);c.lineTo(lerp(xr-4,xr+6,u),yy);c.stroke();}c.globalAlpha=1;
 c.fillStyle='rgba(20,10,40,.3)';c.beginPath();c.moveTo(x+w*.14,ust);c.lineTo(xr-4,ust);c.lineTo(xr+6,y+4);c.lineTo(x+w*.18,y+4);c.closePath();c.fill();
 c.fillStyle=acik;c.globalAlpha=.55;c.beginPath();c.moveTo(xl+4,ust);c.lineTo(xl+14,ust);c.lineTo(xl+6,y+4);c.lineTo(xl-6,y+4);c.closePath();c.fill();c.globalAlpha=1;
 c.strokeStyle=koyu;c.lineWidth=2.4;c.beginPath();c.moveTo(xl-6,y+4);c.lineTo(xl+4,ust);c.lineTo(xr-4,ust);c.lineTo(xr+6,y+4);c.stroke();
 // temel kaidesi ve kemerli minik kapı (yıldız tokmak), yanında tırmanan sarmaşık
 c.fillStyle=dn8Mix(dv,'#140a28',.25);dn8Yk(c,xl-14,y-18,w+28,22,7);c.fill();c.fillStyle=acik;c.globalAlpha=.35;c.fillRect(xl-10,y-17,w+20,3);c.globalAlpha=1;
 if(!koy){const dw=34,dh=58;c.fillStyle='#e8dcc8';c.beginPath();c.moveTo(x-dw/2-4,y-16);c.lineTo(x-dw/2-4,y-dh+dw/2);c.arc(x,y-dh+dw/2,dw/2+4,Math.PI,0);c.lineTo(x+dw/2+4,y-16);c.fill();
  c.fillStyle=dn8Gece('#7a4a8a',.25);c.beginPath();c.moveTo(x-dw/2,y-16);c.lineTo(x-dw/2,y-dh+dw/2);c.arc(x,y-dh+dw/2,dw/2,Math.PI,0);c.lineTo(x+dw/2,y-16);c.fill();
  c.fillStyle='#ffd27a';c.beginPath();c.arc(x+dw*.28,y-36,2.8,0,6.283);c.fill();
  c.strokeStyle=dn8Gece('#3e7a52',.2);c.lineWidth=2.6;c.lineCap='round';c.beginPath();c.moveTo(xl+2,y-14);c.bezierCurveTo(xl+22,y-h*.2,xl-4,y-h*.35,xl+16,y-h*.5);c.stroke();
  for(let m=1;m<9;m++){const u=m/9,lx=xl+8+Math.sin(u*9)*9,ly=y-14-u*(h*.5-14);c.fillStyle=dn8Gece(m%2?'#4e8a62':'#3e7a52',.2);c.beginPath();c.ellipse(lx+(m%2?7:-7),ly,7,3.8,m%2?.6:-.6,0,6.283);c.fill();
   if(m%3===0){c.fillStyle=dn8Gece('#ff8fc8',.3);c.beginPath();c.arc(lx+(m%2?12:-12),ly-2,3,0,6.283);c.fill();}}}
 // çan yeri (kemerli açıklık, içinde altın çan) ve şapka çatı
 const cy=ust-70;c.fillStyle=dv;c.fillRect(xl+6,cy,w-12,72);c.fillStyle='#2a1a3e';c.beginPath();c.moveTo(x-22,cy+70);c.lineTo(x-22,cy+30);c.arc(x,cy+30,22,Math.PI,0);c.lineTo(x+22,cy+70);c.fill();
 c.fillStyle='#e0b050';c.beginPath();c.moveTo(x-12,cy+56);c.quadraticCurveTo(x-12,cy+26,x,cy+26);c.quadraticCurveTo(x+12,cy+26,x+12,cy+56);c.closePath();c.fill();c.fillStyle='#ffe7a8';c.beginPath();c.arc(x,cy+58,3,0,6.283);c.fill();
 const cat=dn8Gece('#4a2e78',.25);c.fillStyle=cat;c.beginPath();c.moveTo(xl-14,cy+4);c.quadraticCurveTo(x-10,cy-50,x-2,cy-104);c.quadraticCurveTo(x+6,cy-140,x+38,cy-150);c.quadraticCurveTo(x+16,cy-130,x+14,cy-100);c.quadraticCurveTo(x+16,cy-40,xr+14,cy+4);c.closePath();c.fill();
 c.fillStyle='#ffe7a8';c.beginPath();c.arc(x+40,cy-150,5,0,6.283);c.fill();
 // balkabağı saat: dilimli turuncu, oyulmuş gülen yüz (karede içi ışır), akrep-yelkovan yok — yüzü saat
 dn8Kabak(c,x,ust+86,koy?1.55:1.9,'#e8802a',0,Y?Y.yuz:null);
 if(!koy){dn8Pencere(c,x,ust+h*.55,26,34,'kemer',{},Y,R);dn8Pencere(c,x,ust+h*.78,26,34,'kemer',{},Y,R);}
 else for(let yy=ust+150;yy<y-40;yy+=70)dn8Pencere(c,x,yy,20,26,'kemer',{},Y,R);
}
// ── Meydan şeker tezgâhı: çizgili tente, kavanozlar, lolipoplar, kabaklar ──
function dn8Tezgah(c,b,R,Y){
 const x=b.x,y=b.y,w=180,cA=dn8Gece(DN8_SEKER[b.ci%6],.25),cB='#e8dcd0';
 c.fillStyle='#5a3a5a';c.fillRect(x-w/2+6,y-150,7,150);c.fillRect(x+w/2-13,y-150,7,150);
 c.fillStyle='#7a4a5a';c.fillRect(x-w/2,y-62,w,12);c.fillStyle='#5e3a4e';c.fillRect(x-w/2+8,y-50,w-16,50);
 for(let k=0;k<6;k++){const jx=x-w/2+22+k*27,jc=DN8_SEKER[(k+b.ci)%6];c.fillStyle='rgba(230,240,255,.45)';dn8Yk(c,jx-9,y-90,18,28,5);c.fill();c.fillStyle=dn8Gece(jc,.25);for(let m=0;m<4;m++){c.beginPath();c.arc(jx-4+(m%2)*8,y-70-Math.floor(m/2)*8,3.6,0,6.283);c.fill();}c.fillStyle='#e8dcc8';c.fillRect(jx-10,y-94,20,5);if(Y&&k%2===0)Y.ampul.push({x:jx,y:y-76,col:jc,ph:R()*6,r:8});}
 for(let k=0;k<3;k++)dn8Lolipop(c,x-w/2+30+k*60,y-62,60,DN8_SEKER[(k*2+b.ci)%6],null);
 for(let xx=x-w/2-8,i=0;xx<x+w/2+8;xx+=20,i++){c.fillStyle=i%2?cB:cA;c.fillRect(xx,y-170,20,26);c.beginPath();c.arc(xx+10,y-144,10,0,Math.PI);c.fill();}
 c.fillStyle='rgba(30,16,50,.25)';c.fillRect(x-w/2-8,y-150,w+16,6);
}
// ── Uçurum kenarı (bahçenin ucu / meydanın başı): yuvarlak kaya, sarkan kökler ve sarmaşıklar ──
// (kaya gövdesi artık dn8UcurumAgiz'de, zeminin önünde; burada yalnız sarkan sarmaşıklar ve kökler — dn8UcurumAgiz'den çağrılır)
function dn8Ucurum(c,b,R){
 const x=b.x,s=b.yon,top=dn8Surface(x-s*4);if(top>=1200||!b.agiz)return;
 c.strokeStyle='#3e7a5a';c.lineWidth=2.4;c.lineCap='round';for(let k=0;k<5;k++){const vx=x-s*(10+k*14)+s*30,L=60+R()*110;c.beginPath();c.moveTo(vx,top+6);c.bezierCurveTo(vx+s*10,top+L*.4,vx-s*6,top+L*.7,vx+s*4,top+L);c.stroke();
  for(let m=1;m<6;m++){const u=m/6;c.fillStyle=m%2?'#4e8a62':'#3e7a5a';c.beginPath();c.ellipse(vx+s*Math.sin(u*4)*5,top+L*u,4.5,2.4,m%2?.6:-.6,0,6.283);c.fill();}}
 c.strokeStyle='rgba(90,60,90,.7)';c.lineWidth=3;for(let k=0;k<3;k++){const rx=x+s*(4+k*8);c.beginPath();c.moveTo(rx,top+20);c.bezierCurveTo(rx+s*14,top+50,rx-s*4,top+80,rx+s*10,top+110+k*20);c.stroke();}
}
// uçurumun dik kenarı boyunca üst üste binen yuvarlak kaya yumruları: aşağı indikçe koyulaşır ve içeri çekilir (yüzen ada gibi)
function dn8UcurumAgiz(c,b){
 const s=b.yon,x=b.x,top=dn8Surface(x-s*4);if(top>=1200)return;const Q=rng((x|0)+417),y0=top+26,D=1200-y0;
 const ex=yy=>x+s*2-s*100*Math.pow(clamp((yy-y0)/D,0,1),1.5);   // kenarın derinliğe göre içeri çekilen çizgisi
 // dik kesik köşe: kenarın dışında kalan zemin silinir (arkadaki gece köyü görünür)
 c.save();c.globalCompositeOperation='destination-out';c.beginPath();c.moveTo(x+s*60,y0);for(let yy=y0;yy<=1200;yy+=24)c.lineTo(ex(yy),yy);c.lineTo(x+s*60,1200);c.closePath();c.fill();c.restore();
 for(let yy=y0-6;yy<1200;){const u=clamp((yy-top)/520,0,1),r=20+Q()*16+u*12,ix=ex(yy)-s*r*(.35+Q()*.15);
  c.fillStyle=dn8Mix('#3e2a62','#1a1232',u);c.beginPath();c.ellipse(ix,yy,r*.95,r,0,0,6.283);c.fill();
  c.fillStyle='rgba(170,140,220,'+(.18*(1-u))+')';c.beginPath();c.ellipse(ix+s*r*.2,yy-r*.45,r*.5,r*.2,0,0,6.283);c.fill();
  yy+=r*1.1;}
 b.agiz=true;dn8Ucurum(c,b,rng((x|0)+91));b.agiz=false;
}
// ── Sokak lambası: kıvrık demir direk, asılı fener camı (karede yerel ışıkla yanar) ──
function dn8Direk(c,b,Y){
 const x=b.x,y=b.y,s=b.yon;
 c.fillStyle='#2e2244';c.fillRect(x-4,y-196,8,196);c.fillRect(x-10,y-8,20,8);c.fillRect(x-7,y-110,14,5);
 c.strokeStyle='#2e2244';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(x,y-190);c.quadraticCurveTo(x,y-222,x+s*28,y-218);c.quadraticCurveTo(x+s*44,y-214,x+s*40,y-200);c.stroke();
 c.beginPath();c.moveTo(x,y-160);for(let j=0;j<=14;j++){const a=j/14*5,r=12*(1-j/16);c.lineTo(x-s*(10+Math.cos(a)*r)+s*10,y-176-Math.sin(a)*r);}c.stroke();
 const lx=x+s*40,ly=y-186;c.fillStyle='#3a2a50';c.beginPath();c.moveTo(lx-13,ly-14);c.lineTo(lx+13,ly-14);c.lineTo(lx+9,ly-20);c.lineTo(lx-9,ly-20);c.fill();
 c.fillStyle='#8a7088';c.beginPath();c.moveTo(lx-11,ly-14);c.lineTo(lx+11,ly-14);c.lineTo(lx+8,ly+12);c.lineTo(lx-8,ly+12);c.closePath();c.fill();
 c.strokeStyle='#3a2a50';c.lineWidth=2;c.beginPath();c.moveTo(lx,ly-14);c.lineTo(lx,ly+12);c.stroke();c.fillStyle='#3a2a50';c.fillRect(lx-10,ly+12,20,4);
 if(Y)Y.direk.push({x:lx,y:ly,ph:dn8Hash(x)*6.283});
}

// ════════ Küçük süsler (yüzeyde) ════════
function dn8KucukCiz(c,s,Y){
 const R=rng((s.x*7|0)+3);
 switch(s.tip){
  case 'kabak':dn8Kabak(c,s.x,s.y+3,s.s,dn8Gece(s.col,.3),s.yuz,Y?Y.yuz:null);break;
  case 'mantar':for(let k=0;k<s.n;k++){const ss=s.s*(1-k*.25),col=DN8_SEKER[(DN8_SEKER.indexOf(s.col)+k*2)%6];dn8Mantar(c,s.x+(k%2?1:-1)*k*14,s.y+3,ss,dn8Gece(col,.3),Y?Y.mantar:null);if(Y)Y.mantar[Y.mantar.length-1].col=col;}break;
  case 'misir':for(let k=0;k<s.n;k++)dn8Misir(c,s.x+(k-(s.n-1)/2)*11+R()*4,s.y+3,.8+R()*.3,(R()-.5)*.6);break;
  case 'sarmasik':{
   // kıvrım kıvrım kabak sarmaşığı: yerde dalgalı filiz, iri yaprak, sarmal uçlar, minik çiçek-ampuller (karede yanar)
   const w=s.w,x0=s.x-w/2;c.strokeStyle='#3e6a4a';c.lineWidth=2.6;c.lineCap='round';c.beginPath();
   for(let j=0;j<=24;j++){const u=j/24,xx=x0+u*w,yy=dn8Surface(xx)-2-Math.sin(u*Math.PI*3+s.s*6)*5;j?c.lineTo(xx,yy):c.moveTo(xx,yy);}c.stroke();
   for(let k=0;k<4;k++){const u=(k+.5)/4,xx=x0+u*w,yy=dn8Surface(xx)-4,sg=k%2?1:-1;
    c.fillStyle=k%2?'#3e7a52':'#4a8a5e';c.beginPath();c.moveTo(xx,yy);c.bezierCurveTo(xx+sg*14,yy-4,xx+sg*16,yy-20,xx+sg*4,yy-22);c.bezierCurveTo(xx-sg*6,yy-22,xx-sg*6,yy-8,xx,yy);c.fill();
    c.strokeStyle='#5a9a66';c.lineWidth=1.6;c.beginPath();c.moveTo(xx+sg*2,yy-6);for(let j=0;j<=12;j++){const a=j/12*6.6,r=8*(1-j/14);c.lineTo(xx-sg*6+Math.cos(a)*r*sg,yy-14-Math.sin(a)*r);}c.stroke();
    if(Y)Y.ampul.push({x:xx+sg*10,y:yy-14,col:k%2?'#ffb347':'#ff8fc8',ph:R()*6.283,r:5});
    c.fillStyle=dn8Gece(k%2?'#ffb347':'#ff8fc8',.4);c.beginPath();c.arc(xx+sg*10,yy-14,3.2,0,6.283);c.fill();}
   break;}
  case 'ot':{const x=s.x,y=s.y+2;c.strokeStyle='#4a4890';c.lineWidth=2.2;c.lineCap='round';for(let k=0;k<5;k++){const a=-1.57+(k-2)*.32+(R()-.5)*.2,L=10+R()*14;c.beginPath();c.moveTo(x+(k-2)*3,y);c.quadraticCurveTo(x+(k-2)*3+Math.cos(a)*L*.4,y+Math.sin(a)*L*.6,x+(k-2)*3+Math.cos(a)*L,y+Math.sin(a)*L);c.stroke();}break;}
  case 'aycicek':{const x=s.x,y=s.y+2,h=40+R()*26;c.strokeStyle='#3e6a4a';c.lineWidth=2.4;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+6,y-h*.5,x,y-h);c.stroke();
   c.fillStyle='#4a8a5e';c.beginPath();c.ellipse(x+5,y-h*.45,7,3,.5,0,6.283);c.fill();
   c.fillStyle='#e8dcff';for(let k=0;k<6;k++){const a=k/6*6.283;c.beginPath();c.ellipse(x+Math.cos(a)*5,y-h+Math.sin(a)*5,4.5,2.6,a,0,6.283);c.fill();}c.fillStyle='#ffe7a8';c.beginPath();c.arc(x,y-h,3,0,6.283);c.fill();
   if(Y)Y.ampul.push({x,y:y-h,col:'#e8dcff',ph:R()*6.283,r:7});break;}
 }
}

// ════════ Karede çizim: zemin parçaları ════════
function dn8Terrain(){
 g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);const a=Math.max(0,Math.floor(cam.x/DN8_CW)),b=Math.min(Math.ceil(COLS*T/DN8_CW),Math.floor((cam.x+VW)/DN8_CW));
 const ya=cam.y-2,yb=cam.y+H/S+2;DN8.zeminKare=DN8.kare;
 for(let i=a;i<=b;i++){const cv=dn8Chunk(i),o=cv.ust,y0=Math.max(o,Math.floor(ya)),y1=Math.min(1200,Math.ceil(yb));if(y1>y0)g.drawImage(cv,0,y0-o,cv.width,y1-y0,i*DN8_CW-2,y0,cv.width,y1-y0);}
 // bir sonraki parça (yürüme yönünde) önceden boyanır: karede en çok bir tane
 const yon=(typeof P!=='undefined'&&P.vx<-20)?-1:1,next=yon>0?b+1:a-1;if(next>=0&&next*DN8_CW<COLS*T&&!DN8.chunks.has(next))dn8Chunk(next);
}
// zemin parçalarının kesin örttüğü en üst ekran y'si (son karede zemin çizildiyse)
function dn8ZeminAlt(vh){
 if(DN8.zeminKare!==DN8.kare-1)return vh;
 const yb=1200-cam.y;if(yb<vh)return vh;let m=-1e9;
 for(let x=cam.x-8;x<=cam.x+VW+8;x+=16){const y=dn8Surface(x);if(y>=1200)return vh;if(y>m)m=y;}
 return Math.min(vh,m-cam.y+4);
}
// sıralı listede x'ten büyük-eşit ilk öğe (ikili arama)
function dn8Bas(L,x){let a=0,b=L.length;while(a<b){const m=(a+b)>>1;if(L[m].x<x)a=m+1;else b=m;}return a;}

// ════════ Ay konumu: normalde sağ üstte; uçuş koridorunda kocaman, yavaşça kayan (süpürge önünden geçer) ════════
const DN8_AYX=nx(690);   // uçuşta ayın bağlı olduğu dünya x'i (paralaks .12)
function dn8AyHesap(tm,vw,vh){
 const cx=cam.x+VW*.5,w=smooth(clamp((cx-(DN8_GAP0-700))/1100,0,1))*(1-smooth(clamp((cx-(DN8_GAP1-200))/900,0,1)));
 const nxs=vw*.79-cam.x*.0012%40,nys=vh*.17-cam.y*.012,nr=Math.min(vh*.13,82);
 const pxs=vw*.5+(DN8_AYX-cx)*.12,pys=vh*.38,pr=Math.min(vh*.34,232);
 const A=DN8.ay8;A.w=w;A.sx=lerp(nxs,pxs,w);A.sy=lerp(nys,pys,w)+Math.sin(tm*.3)*2.5;A.sr=lerp(nr,pr,w);
 // süpürge yolculuğu ayın konumunu verir (siluet anı: ay Feza'nın tam arkasında): onunla yumuşakça birleş
 if(typeof SUPURGE!=='undefined'&&SUPURGE&&typeof SUPURGE.ay==='function'){let S8=null;try{S8=SUPURGE.ay();}catch(e){S8=null;}
  if(S8&&Number.isFinite(S8.x)&&Number.isFinite(S8.y)&&Number.isFinite(S8.r)){const a=clamp(Number.isFinite(S8.a)?S8.a:1,0,1);A.sx=lerp(A.sx,S8.x-cam.x,a);A.sy=lerp(A.sy,S8.y-cam.y,a);A.sr=lerp(A.sr,S8.r,a);A.w=Math.max(A.w,a);}}
 A.x=cam.x+A.sx;A.y=cam.y+A.sy;A.r=A.sr;
 return A;
}
// ayın o karedeki dünya konumu ve yarıçapı (supurge.js siluet anı için)
function dn8Ay(){const A=DN8.ay8;return {x:A.x,y:A.y,r:A.r};}

// ════════ Arka plan ════════
// zeminin ekrandaki y'si normal yerinden (ekranın ~%87-88'i) ne kadar aşağıda: kamera yukarı kalkınca > 0. Yumuşatılır (basamak
// geçişinde zıplamasın), karede bir kez hesaplanır. Arka şerit ve ön plan yaprakları bunu kullanır (dünyaya bağlı, kaymadan iner/çıkar).
function dn8YerKay(vh){
 if(DN8.ykKare===DN8.kare)return DN8.yk||0;DN8.ykKare=DN8.kare;
 const x=cam.x+(W/S)*.5;let y=dn8Surface(x);if(y>=1200){const a=dn8Surface(x-260),b=dn8Surface(x+260);y=Math.min(a,b);}
 const hedef=y>=1200?0:Math.max(0,y-cam.y-vh*.885),k=Number.isFinite(DN8.yk)?DN8.yk:hedef;
 DN8.yk=Math.abs(hedef-k)<.5?hedef:k+(hedef-k)*.14;return DN8.yk;
}
function dn8Backdrop(tm){
 const vw=W/S,vh=H/S,F=dn8FxArt(),sb=DN8.sabah,gece=1-sb,A=dn8AyHesap(tm,vw,vh),pw=A.w;
 g.setTransform(S,0,0,S,0,0);
 // katman tabanları (ekran y'si): uçuş manzarasında uzak tepeler biraz alçalır (gök ve ay açılsın)
 // uçuş manzarasında (pw) yakın çalılar ve ağaç sırası aşağı çöker, arada vadi köyü (4) aşağıdan yükselir: toprak ayağımızın altından
 // çekilir, köy aşağıda kalır. Çizim sırası: 0, 1, 2, (4), 3
 const tab=DN8.tab||(DN8.tab=[0,0,0,0,0]),yZ=dn8ZeminAlt(vh),sira=pw>.005?DN8_SIRA5:DN8_SIRA4;
 // ay anı (supurge.js SUPURGE.ayAni 0..1): uzak köy ve tepeler ekranın ~%12'si kadar alçalır; biniciler köyün değil ayın temiz
 // alt yarısının önünde siluet olur (yumuşak giriş-çıkış)
 let aaH=0;if(typeof SUPURGE!=='undefined'&&SUPURGE&&typeof SUPURGE.ayAni==='function'){try{aaH=clamp(+SUPURGE.ayAni()||0,0,1);}catch(e){aaH=0;}}
 DN8.ayAniS=(DN8.ayAniS||0)+(aaH-(DN8.ayAniS||0))*.06;if(Math.abs(DN8.ayAniS-aaH)<.002)DN8.ayAniS=aaH;const aa=smooth(DN8.ayAniS)*vh*.14;
 // kamera yukarı kalkınca (Feza yüksek bir yerde) zemin ekranın altından iner: yakın çalı şeridi (3) ve ağaç sırasının dibi (2)
 // zeminle birlikte iner — yoksa normalde zeminin arkasında saklı duran çalı/kabak sırası alttan birden belirip kaybolur
 const yk=dn8YerKay(vh)*(1-pw);
 for(let l=0;l<5;l++)tab[l]=DN8_SB[l]-cam.y*DN8_SYF[l]+pw*[70,60,40,20,0][l]+[0,0,pw*110,pw*360,(1-pw)*520][l]+(l===3?0:aa)+yk*[0,0,.45,.7,0][l];
 const ort=DN8.ort||(DN8.ort=[0,0,0,0,0]);for(let i=0;i<sira.length;i++){let m=yZ;for(let j=i+1;j<sira.length;j++)if(tab[sira[j]]<m)m=tab[sira[j]];ort[sira[i]]=m;}
 let gokAlt=yZ;for(let i=0;i<sira.length;i++)if(tab[sira[i]]<gokAlt)gokAlt=tab[sira[i]];DN8.gokAlt=gokAlt;
 // gök (yalnız görünen üst kısım)
 g.setTransform(1,0,0,1,0,0);const gu=clamp(gokAlt/vh,0,1);
 if(gu>0){const hh=Math.ceil(H*gu)+2;if(sb<.996)g.drawImage(DN8.sky,0,0,768,Math.min(600,600*hh/H),0,0,W,Math.min(H,hh));
  if(sb>.004){g.globalAlpha=sb;g.drawImage(DN8.dawn,0,0,768,Math.min(600,600*hh/H),0,0,W,Math.min(H,hh));g.globalAlpha=1;}}
 g.setTransform(S,0,0,S,0,0);
 // ışıldayan yıldızlar (birkaçı dört köşeli parıltı)
 g.globalCompositeOperation='lighter';
 for(let i=0;i<DN8_STARS.length;i++){const s=DN8_STARS[i],y=s.y*vh;if(y>gokAlt)continue;const a=gece*(.35+.4*Math.sin(tm*s.sp+s.ph))*(1+DN8.fin*.3),x=s.x*vw;
  dn8Glow(s.col,x,y,s.r*5,s.r*5,a*.5);if(s.yil&&a>.4){const r=s.r*4.5*(a+.3);g.globalAlpha=a*.8;g.drawImage(F.parilti,x-r,y-r,r*2,r*2);g.globalAlpha=1;}}
 // ay: geniş bal rengi hâle (toplamalı), disk, yüz (ara sıra göz kırpar)
 if(gece>.02){const r=A.sr,x=A.sx,y=A.sy+DN8.sabah*vh*.18;
  dn8Glow('#ffd890',x,y,r*3.4,r*3.4,(.16+pw*.1)*gece);dn8Glow('#ffe7a8',x,y,r*1.9,r*1.9,(.3+pw*.12)*gece);dn8Glow('#ff9fb8',x,y+r*.4,r*2.6,r*1.6,.06*gece*(1+DN8.renk));
  g.globalCompositeOperation='source-over';
  // uçuş manzarasında (pw) yüz yukarı kayar: biniciler ayın temiz alt yarısının önünden geçer
  const k=r/DN8_AYR,n=DN8.ay.width,Y=DN8.ayYuz,pa=smooth(clamp((pw-.15)/.7,0,1));g.globalAlpha=gece;g.drawImage(DN8.ay,x-n/2*k,y-n/2*k,n*k,n*k);
  g.drawImage(Y,x-Y.width/2*k,y-(Y.kok+DN8_AYR*.38*pa)*k,Y.width*k,Y.height*k);g.globalAlpha=1;
  g.globalCompositeOperation='lighter';}
 g.globalCompositeOperation='source-over';
 // ay önünden süzülen lavanta bulutçuklar (yavaş, paralakslı)
 for(let j=0;j<4;j++){const sp=4+j*2.5,bw=[300,240,360,200][j],x=((j*530-tm*sp-cam.x*(.02+j*.01))%(vw+bw*2)+vw+bw*2)%(vw+bw*2)-bw,y=[.1,.24,.33,.16][j]*vh-cam.y*.015+pw*[20,40,60,10][j];
  if(y>gokAlt)continue;g.globalAlpha=[.34,.4,.28,.24][j]*(1-sb*.5);g.drawImage(F.bulut[j%3],x,y,bw,bw*.34);}
 g.globalAlpha=1;
 dn8KayanYildiz(tm,vw,vh);
 // uzak katmanlar (dolgu ve pus şeride basılı) + karede pencere / kabak / fener ışıltıları
 for(let i=0;i<sira.length;i++){const l=sira[i];
  const f=DN8_SF[l],img=dn8Serit(l),Wd=img.width,base=tab[l],alt=ort[l],off=((cam.x*f)%Wd+Wd)%Wd,y0=base-DN8_SH[l];
  if(y0>=alt)continue;   // tamamen örtülü
  for(let x=-off;x<vw;x+=Wd)dn8SeritCiz(img,x,y0,vw,alt);
  const yd=base+DN8_EXT-1;if(alt>yd){g.fillStyle=DN8_SDOLGU[l];g.fillRect(0,yd,vw,alt-yd);}
  dn8SeritFx(tm,l,off,y0,alt);
  if(l===0)dn8CadiEvi(tm,vw,vh,base,alt);
  if(l===4)dn8VadiOn(tm,vw,vh,base,alt,pw);
 }
 // ufukta köyün sıcak ışıması: fenerler yandıkça turuncu-pembe ısınır
 g.globalCompositeOperation='lighter';
 const R8=DN8.renk;dn8Glow('#ff9a5a',vw*.5,tab[1]-30,vw*.75,110,(.05+R8*.12+DN8.fin*.08)*gece);dn8Glow('#ff7ab8',vw*.2,tab[0]-40,vw*.4,90,(.03+R8*.06)*gece);
 if(sb>.01){dn8Glow('#ffd8a8',vw*.6,tab[1]-60,vw*.7,vh*.32,sb*.5);dn8Glow('#fff4d8',vw*.6,tab[1]-40,90,60,sb*.85);}
 g.globalCompositeOperation='source-over';
}
const DN8_SIRA4=[0,1,2,3],DN8_SIRA5=[0,1,2,4,3];
// katman ışıltıları: pencereler (sırayla yanar: her birinin eşiği), kabaklar, asılı fener noktaları, bacadan duman
function dn8SeritFx(tm,l,off,y0,alt){
 const fx=DN8.serFx[l];if(!fx)return;const vw=W/S,R8=DN8.renk,gece=1-DN8.sabah*.8,Wd=DN8_SW[l],F=DN8.fx,nb=dn8Nabiz();
 const koy=l===4;g.globalCompositeOperation='lighter';
 for(let x0=-off;x0<vw;x0+=Wd){
  for(const p of fx.pen){const x=x0+p.x,y=y0+p.y;if(x<-20||x>vw+20||y>alt)continue;const on=koy?.55+.45*R8:clamp((R8*1.25-p.th*.55)*2,0,1),fl=.85+.15*Math.sin(tm*(2+p.th*3)+p.ph);
   dn8Glow('#ffc070',x,y,p.r*1.6,p.r*1.6,(.12+on*.5+nb*.15)*fl*gece);}
  for(const p of fx.kab){const x=x0+p.x,y=y0+p.y;if(x<-30||x>vw+30||y>alt+10)continue;const on=koy?.6+.4*R8:clamp(R8*1.4-.1+dn8Hash(p.x)*.2,0,1);if(on<.02)continue;
   dn8Glow('#ff9a3c',x,y,p.r*1.5,p.r*1.2,on*.4*gece);if(p.yuz!==undefined&&p.s){const s=p.s;g.globalAlpha=on*.85*gece;g.drawImage(F.yuz[p.yuz],x-48*s,y-44*s,96*s,80*s);g.globalAlpha=1;}}
  for(const p of fx.fen){const x=x0+p.x,y=y0+p.y;if(x<-20||x>vw+20||y>alt)continue;const on=koy?.7+.3*R8:clamp(R8*1.3+.08,0,1),fl=.8+.2*Math.sin(tm*1.6+p.ph);dn8Glow(['#ffb347','#ff8fc8','#c39bff','#7dffc4'][p.ci],x,y,p.r*2.2,p.r*2.2,on*.55*fl*gece);}
 }
 g.globalCompositeOperation='source-over';
 // bacalardan ince duman (yakın tepe katmanı)
 if((l===1||l===4)&&fx.baca.length){for(let x0=-off;x0<vw;x0+=Wd)for(let i=0;i<fx.baca.length;i++){const bc=fx.baca[i],x=x0+bc.x,y=y0+bc.y;if(x<-20||x>vw+20||y>alt)continue;
  for(let j=0;j<3;j++){const u=(tm*.06+j/3+i*.13)%1,r=3+u*10;g.globalAlpha=Math.sin(u*Math.PI)*.3;g.drawImage(F.duman,x+u*14-r,y-u*44-r,r*2,r*2);}}g.globalAlpha=1;}
}
// vadi köyünün önünde: balkabağı saatli çan kulesi (tek bağ noktası) ve köyden göğe süzülen uçan kâğıt fenerler
const DN8_UCF=Array.from({length:14},(_,i)=>({u:dn8Hash(i*1.7+.3),v:dn8Hash(i*4.1+.9),sp:.014+dn8Hash(i*2.3)*.012,ci:i%4,ph:dn8Hash(i*8.8)*6.283,s:.45+dn8Hash(i*3.3)*.4}));
function dn8VadiOn(tm,vw,vh,base,alt,pw){
 const F=DN8.fx,gece=1-DN8.sabah,cx=cam.x+VW*.5;
 if(!F.kule){const cv=dn8Cv(260,560),c=cv.getContext('2d');dn8Kule(c,130,556,440,rng(11),null,true);F.kule=cv;}
 const sx=vw*.5+(nx(726)-cx)*.28,k=.6;if(sx>-120&&sx<vw+120){const by=base-150;g.drawImage(F.kule,0,0,260,Math.min(560,(alt-(by-556*k))/k),sx-130*k,by-556*k,260*k,Math.min(560*k,alt-(by-556*k)));
  g.globalCompositeOperation='lighter';const ky=by+(174-556)*k,s=1.55*.62*k;dn8Glow('#ff9a3c',sx,ky,70*k,60*k,.5*gece);g.globalAlpha=.95*gece;g.drawImage(F.yuz[0],sx-48*s,ky-44*s,96*s,80*s);g.globalAlpha=1;g.globalCompositeOperation='source-over';}
 // uçan fenerler: köyden yavaşça yükselir, yükseldikçe küçülüp söner
 if(gece<.05)return;const span=vw+300;
 for(const f of DN8_UCF){const x=((f.u*span*3-cam.x*.28+Math.sin(tm*.3+f.ph)*20)%span+span)%span-150,v=(f.v+tm*f.sp)%1,y=base-60-v*(base+40),s=f.s*(1-v*.45);
  const a=Math.min(1,v*5)*Math.min(1,(1-v)*3)*gece*pw;if(a<.02)continue;g.globalAlpha=a;g.drawImage(F.fener[f.ci],x-14*s,y-20*s,28*s,39*s);g.globalAlpha=1;
  g.globalCompositeOperation='lighter';dn8Glow(['#ffb347','#ff8fc8','#c39bff','#7dffc4'][f.ci],x,y,34*s,34*s,a*.5);g.globalCompositeOperation='source-over';}
}
// uzaktaki cadı evi: birkaç dünya noktasına bağlı (paralaks .05); pencereleri ve şapkanın ucundaki yıldız ışır, bacadan pembe duman
function dn8CadiEvi(tm,vw,vh,base,alt){
 const img=dn8CadiEviArt(),F=DN8.fx,f=.05,R8=DN8.renk,gece=1-DN8.sabah*.8,cx=cam.x+VW*.5;
 for(const A of [440*T]){const sx=vw*.5+(A-cx)*f;if(sx<-200||sx>vw+200)continue;const k=.4,bx=sx,by=base-56;
  if(by-500*k>alt)continue;g.drawImage(img,0,0,420,Math.min(520,(alt-(by-500*k))/k),bx-210*k,by-500*k,420*k,Math.min(520*k,alt-(by-500*k)));
  g.globalCompositeOperation='lighter';
  for(const p of F.cadiEviPen){const x=bx+p.x*k,y=by+p.y*k,fl=.85+.15*Math.sin(tm*3+p.x);if(p.yildiz){dn8Glow('#ffe7a8',x,y,26,26,(.35+.3*Math.sin(tm*1.3))*gece);const r=11+3*Math.sin(tm*1.3);g.globalAlpha=.8*gece;g.drawImage(F.parilti,x-r,y-r,r*2,r*2);g.globalAlpha=1;}
   else dn8Glow('#ffc070',x,y,14,14,(.4+R8*.4)*fl*gece);}
  dn8Glow('#ff9a5a',bx,by-150*k,110,80,(.08+R8*.1)*gece);
  g.globalCompositeOperation='source-over';
  const bc=F.cadiEviBaca;for(let j=0;j<4;j++){const u=(tm*.08+j/4)%1,r=(3+u*12),px=bx+bc.x*k+u*18+Math.sin(u*6+j)*3,py=by+bc.y*k-u*60;g.globalAlpha=Math.sin(u*Math.PI)*.4;g.drawImage(F.dumanS,px-r,py-r,r*2,r*2);}
  g.globalAlpha=1;}
}
function dn8KayanYildiz(tm,vw,vh){
 const gece=1-DN8.sabah;if(gece<.3)return;const P9=8,k=Math.floor(tm/P9),u=(tm-k*P9)/1.1;if(u>1)return;
 const h1=dn8Hash(k*1.3),h2=dn8Hash(k*2.7+5),sol=h1<.5,x0=vw*(.15+h1*.7),y0=vh*(.03+h2*.15),ang=sol?Math.PI-.42:.42,L=vw*.2;
 const x=x0+Math.cos(ang)*L*u,y=y0+Math.sin(ang)*L*u,a=Math.sin(u*Math.PI)*gece*.8;
 g.globalCompositeOperation='lighter';for(let j=0;j<6;j++){const b=j/6;dn8Glow(j%2?'#ffd8f0':'#fff2d8',x-Math.cos(ang)*b*60,y-Math.sin(ang)*b*60,4-b*3,4-b*3,a*(1-b)*.8);}
 dn8Glow('#ffffff',x,y,9,9,a);g.globalCompositeOperation='source-over';
}
// final nabzı (kabak.js cadiFinalNabiz, 0..1)
function dn8Nabiz(){if(DN8.finT===null||typeof cadiFinalNabiz!=='function')return 0;try{const v=+cadiFinalNabiz();return v>0?Math.min(1,v):0;}catch(e){return 0;}}
function dn8Background(tm){
 if(!dn8Ready())return;dn8Sky();dn8FxArt();dn8AyArt();dn8Durum();DN8.kare++;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';
 dn8Backdrop(tm);
}

// ════════ Dünya: zemin parçaları + yerel ışıltılar (kabak yüzleri, mantarlar, sarmaşık ampulleri, pencereler, lambalar) ════════
function dn8Isiltilar(tm){
 const Y=DN8.yap,F=DN8.fx,L0=cam.x-120,R0=cam.x+VW+120,gece=1-DN8.sabah*.7,nb=dn8Nabiz(),R8=DN8.renk;
 g.globalCompositeOperation='lighter';
 // pencereler: yerel ışıkla yanar; kapısı çalınan ev tam yanar; köy manzarasında hep sıcak
 for(let i=dn8Bas(Y.pen,L0);i<Y.pen.length;i++){const p=Y.pen[i];if(p.x>R0)break;
  let on=p.koy?.5+R8*.45-(p.r0||0)*.08:dn8Isik(p.x)*(.65+p.th*.35);const et=DN8.evIsik[Math.round(p.ev)];if(et!==undefined)on=Math.max(on,smooth(clamp((now-et)/1.2,0,1)));
  const fl=.9+.1*Math.sin(tm*(2.3+p.th*2)+p.ph),a=Math.min(1,(.06+on*.94+nb*.1)*fl)*gece,r=Math.max(p.w,p.h),cs=F.cam[p.st]||F.cam.kare;
  if(a>.01){g.globalAlpha=a;g.drawImage(cs,0,0,64,cs.h2,p.x-p.w/2,p.y-p.h/2,p.w,p.h);g.globalAlpha=1;dn8Glow('#ffb860',p.x,p.y+p.h*.1,r*1.35,r*1.2,a*.42);}}
 // kabak yüzleri: oyulmuş gözler-ağız içten yanar
 for(let i=dn8Bas(Y.yuz,L0);i<Y.yuz.length;i++){const p=Y.yuz[i];if(p.x>R0)break;const on=Math.max(dn8Isik(p.x),p.y>1000?0:0);if(on<.03)continue;
  const fl=.82+.18*Math.sin(tm*2.6+p.ph)*Math.sin(tm*1.7+p.ph*2),s=p.s;dn8Glow('#ff9a3c',p.x,p.y,40*s*1.6,34*s*1.6,on*.32*fl*gece);
  g.globalAlpha=Math.min(1,on*1.1)*fl;g.drawImage(F.yuz[p.v],p.x-48*s,p.y-44*s,96*s,80*s);g.globalAlpha=1;}
 // mantarlar ve lolipoplar: kendi renginde yumuşak hâle
 for(let i=dn8Bas(Y.mantar,L0);i<Y.mantar.length;i++){const p=Y.mantar[i];if(p.x>R0)break;const on=dn8Isik(p.x);const a=(.06+on*.3)*(.8+.2*Math.sin(tm*1.3+p.ph))*gece;dn8Glow(p.col,p.x,p.y,p.r*1.2,p.r,a);}
 for(let i=dn8Bas(Y.lolipop,L0);i<Y.lolipop.length;i++){const p=Y.lolipop[i];if(p.x>R0)break;const on=dn8Isik(p.x);dn8Glow(p.col,p.x,p.y,p.r,p.r,(.05+on*.25)*gece);}
 // sarmaşık / saçak ampulleri: önce soluk, ışık gelince renk renk ışıldar
 for(let i=dn8Bas(Y.ampul,L0);i<Y.ampul.length;i++){const p=Y.ampul[i];if(p.x>R0)break;let on=dn8Isik(p.x);const et=p.ev!==undefined?DN8.evIsik[Math.round(p.ev)]:undefined;if(et!==undefined)on=Math.max(on,smooth(clamp((now-et)/1.5,0,1)));
  const tw=.7+.3*Math.sin(tm*(1.5+(p.ph%1.3))+p.ph),a=(.05+on*.6+nb*.2)*tw*gece,r=p.r||5;dn8Glow(p.col,p.x,p.y,r*3,r*3,a*.7);if(on>.15)dn8Glow('#ffffff',p.x,p.y,r*.9,r*.9,a*.7);}
 // sokak lambaları
 for(let i=0;i<Y.direk.length;i++){const p=Y.direk[i];if(p.x<L0||p.x>R0)continue;const on=dn8Isik(p.x),fl=.9+.1*Math.sin(tm*5+p.ph)*Math.sin(tm*3.3);
  dn8Glow('#ffc870',p.x,p.y,70,70,(.06+on*.42)*fl*gece);dn8Glow('#fff0c0',p.x,p.y,14,18,(.15+on*.8)*fl);dn8Glow('#ffb860',p.x,p.y+186,90,16,on*.3*gece);}
 g.globalCompositeOperation='source-over';
}
// asılı kâğıt fenerler (koru dalları): iple salınır, ışık gelince yanar
function dn8Asililar(tm){
 const Y=DN8.yap,F=DN8.fx,L0=cam.x-60,R0=cam.x+VW+60,gece=1-DN8.sabah*.7;
 for(let i=dn8Bas(Y.asili,L0);i<Y.asili.length;i++){const p=Y.asili[i];if(p.x>R0)break;const sw=Math.sin(tm*1.1+p.ph)*.12,ex=p.x+Math.sin(sw)*p.len,ey=p.y+Math.cos(sw)*p.len;
  g.strokeStyle='rgba(30,16,40,.8)';g.lineWidth=1.2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(ex,ey);g.stroke();
  g.save();g.translate(ex,ey);g.rotate(-sw*.6);g.drawImage(F.fener[p.ci],-14,-4,28,39);g.restore();
  const on=dn8Isik(p.x);g.globalCompositeOperation='lighter';dn8Glow(['#ffb347','#ff8fc8','#c39bff','#7dffc4'][p.ci],ex,ey+16,34,34,(.08+on*.5)*gece);dn8Glow('#fff2d0',ex,ey+16,8,10,(.1+on*.7)*gece);g.globalCompositeOperation='source-over';}
}
// bayrak / ampul / fener ipleri (evden eve, sahnenin üstü, meydan, köy çatıları): ip eğrisi + salınan süsler
function dn8Ipler(tm){
 const Y=DN8.yap,F=DN8.fx,L0=cam.x-60,R0=cam.x+VW+60,gece=1-DN8.sabah*.7,nb=dn8Nabiz();
 for(const ip of Y.ip){if(ip.x1<L0||ip.x0>R0)continue;const mx=(ip.x0+ip.x1)/2,my=(ip.y0+ip.y1)/2+ip.sag*2*(1+.04*Math.sin(tm*.9+ip.ph));
  g.strokeStyle='rgba(30,16,46,.8)';g.lineWidth=1.4;g.beginPath();g.moveTo(ip.x0,ip.y0);g.quadraticCurveTo(mx,my,ip.x1,ip.y1);g.stroke();
  const on=dn8Isik(mx);
  for(let k=1;k<ip.n;k++){const u=k/ip.n,a=(1-u)*(1-u),b2=2*u*(1-u),d=u*u,x=a*ip.x0+b2*mx+d*ip.x1,y=a*ip.y0+b2*my+d*ip.y1;if(x<L0||x>R0)continue;
   if(ip.tur==='bayrak'){const sw=Math.sin(tm*1.8+k*.9+ip.ph)*.14;g.save();g.translate(x,y);g.rotate(sw);g.drawImage(F.bayrak[(k+(ip.ph*3|0))%8],-15,-2,30,33);g.restore();}
   else if(ip.tur==='fener'){const sw=Math.sin(tm*1.2+k+ip.ph)*.1;g.save();g.translate(x,y);g.rotate(sw);g.drawImage(F.fener[k%4],-12,-2,24,34);g.restore();g.globalCompositeOperation='lighter';dn8Glow(['#ffb347','#ff8fc8','#c39bff','#7dffc4'][k%4],x,y+16,30,30,(.1+on*.45+nb*.2)*gece);g.globalCompositeOperation='source-over';}
   else{g.globalCompositeOperation='lighter';const col=DN8_SEKER[(k+(ip.ph*5|0))%6],tw=.75+.25*Math.sin(tm*2+k*1.7);dn8Glow(col,x,y+3,13,13,(.25+on*.4+nb*.2)*tw*gece);dn8Glow('#ffffff',x,y+3,3,3,.5*tw*gece);g.globalCompositeOperation='source-over';}}
 }
}
// değirmen kanatları
function dn8Degirmenler(tm){const Y=DN8.yap;for(const d of Y.degirmen){if(d.x<cam.x-200||d.x>cam.x+VW+200)continue;const F=DN8.fx,img=dn8KanatArt(),on=dn8Isik(d.x);
 g.save();g.translate(d.x,d.y);g.rotate(tm*(.18+on*.25));g.drawImage(img,-d.r,-d.r,d.r*2,d.r*2);g.restore();}}
// bacalardan duman: yavaş yükselen, büyüdükçe sönen lila (Cadı Nine'nin bacası pembe)
function dn8Dumanlar(tm){
 const Y=DN8.yap,F=DN8.fx,L0=cam.x-80,R0=cam.x+VW+80;
 for(let i=dn8Bas(Y.baca,L0);i<Y.baca.length;i++){const b=Y.baca[i];if(b.x>R0)break;
  for(let j=0;j<4;j++){const u=(tm*.07+j/4+b.ph*.1)%1,r=(5+u*22)*(b.koy?.8:1),px=b.x+u*(26+Math.sin(tm*.3)*10)+Math.sin(u*6+j+b.ph)*4,py=b.y-u*110,al=Math.sin(u*Math.PI)*.38*(1-DN8.sabah*.5);
   g.globalAlpha=al;g.drawImage(b.pembe?F.dumanS:F.duman,px-r,py-r,r*2,r*2);}}
 g.globalAlpha=1;
}
// yer sisi: yüzeyde yavaşça sürüklenen pembe-mor ışıltılı bulutçuklar (boşlukta köyün çatılarının üstünde)
const DN8_SIS=Array.from({length:22},(_,i)=>({u:dn8Hash(i*3.1),sp:6+dn8Hash(i*7.7)*10,r:110+dn8Hash(i*5.3)*90,ph:dn8Hash(i*9.1)*6.283,p:i%2}));
function dn8Sis(tm,on){
 const F=DN8.fx,span=VW+600,a0=(on?.5:1)*(.18+DN8.renk*.06)*(1-DN8.sabah*.5);
 g.globalCompositeOperation='lighter';
 for(let i=0;i<DN8_SIS.length;i++){const s=DN8_SIS[i];if((i%3===0)!==!!on)continue;
  const gx=cam.x-300+(((s.u*span+tm*s.sp)%span)+span)%span;let y=dn8Surface(gx);if(y>=1200)continue;
  y+=on?6:-8;const r=s.r,a=a0*(.7+.3*Math.sin(tm*.4+s.ph));g.globalAlpha=a;g.drawImage(s.p?F.sisP:F.sis,gx-r,y-r*.32,r*2,r*.56);}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
}
// ── Işık tozu izi: Feza'nın adımlarında yerde yumuşak parlayan iz ve havalanan ışık tozu (sabit havuz) ──
const DN8_IZ_N=48,DN8_IZ=Array.from({length:DN8_IZ_N},()=>({x:0,y:0,t:-1e9,tip:'feza'}));let dn8IzI=0;
function dn8Iz(x,y,tip){DN8.izDis=now;dn8IzEkle(x,y,tip);}   // dışarıdan (feza.js vb.) çağrılınca kendi adım izim susar
function dn8IzEkle(x,y,tip){
 if(!Number.isFinite(x)||!Number.isFinite(y))return;const Z=DN8_IZ[dn8IzI];dn8IzI=(dn8IzI+1)%DN8_IZ_N;Z.x=x;Z.y=y;Z.t=now;Z.tip=tip||'feza';
}
function dn8Izler(tm){
 const F=DN8.fx,L0=cam.x-60,R0=cam.x+VW+60;
 for(let i=0;i<DN8_IZ_N;i++){const Z=DN8_IZ[i],age=now-Z.t,omur=Z.tip==='inis'?3:2.4;if(age<0||age>omur||Z.x<L0||Z.x>R0)continue;const u=age/omur;
  g.globalCompositeOperation='lighter';g.globalAlpha=(1-u)*(1-u)*.55;const w=Z.tip==='inis'?36:22;g.drawImage(F.iz,Z.x-w/2,Z.y-w*.2,w,w*.42);
  // havalanan ışık tozu (3 tane, tohumlu sapma)
  if(age<1.2){for(let j=0;j<(Z.tip==='inis'?6:3);j++){const h=dn8Hash(i*7.3+j*3.1),v=age/1.2,px=Z.x+(h-.5)*26+Math.sin(age*3+j)*4,py=Z.y-4-v*(22+h*26),col=DN8_TOZ[(i+j)%8];dn8Glow(col,px,py,5,5,(1-v)*.7);}}
  g.globalAlpha=1;g.globalCompositeOperation='source-over';}
}
// Feza yerde yürürken kendiliğinden iz bırak (feza.js dn8Iz çağırmasa da)
function dn8KendiIz(){
 if(typeof P==='undefined'||P.ucus||!P.ground||DURUM!=='oyun')return;if(Math.abs(P.vx||0)<40){DN8.izX=undefined;return;}
 if(DN8.izX===undefined||Math.abs(P.x-DN8.izX)>34){DN8.izX=P.x;if(!DN8.izDis||now-DN8.izDis>.6)dn8IzEkle(P.x,P.y,'feza');}
}
function dn8World(tm){
 if(!dn8Ready())return;dn8Yapilar();dn8Terrain();
 {const oa=.2*(1-DN8.renk)*(1-DN8.sabah),F=DN8.fx;g.setTransform(1,0,0,1,0,0);if(oa>.004){g.globalAlpha=oa;g.drawImage(F.ortu,0,0,8,128,0,H*.28,W,H*.72+1);}
  if(DN8.sabah>.004){g.globalAlpha=DN8.sabah*.32;g.drawImage(F.sabahOrtu,0,0,8,128,0,H*.2,W,H*.8+1);}g.globalAlpha=1;}   // sabah: dünya pembe-altın ısınır
 g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);
 dn8Sis(tm,false);dn8Dumanlar(tm);dn8Degirmenler(tm);dn8Isiltilar(tm);dn8Asililar(tm);dn8Ipler(tm);dn8KendiIz();dn8Izler(tm);
 // yanan fenerlerin yerdeki sıcak ışık havuzu ve yeni yananda yayılan halka + göğe yükselen ışık
 g.globalCompositeOperation='lighter';const gece=1-DN8.sabah*.7;
 for(const Lt of DN8.lit){if(Lt.x<cam.x-400||Lt.x>cam.x+VW+400)continue;const on=smooth(clamp((now-Lt.t)/1.5,0,1)),nb=.85+.15*Math.sin(tm*1.7+Lt.x),sy=dn8Surface(Lt.x);if(sy>=1200)continue;
  dn8Glow('#ff9a50',Lt.x,sy+2,170,30,on*.32*nb*gece);dn8Glow('#ffc070',Lt.x,sy-30,110,90,on*.12*nb*gece);}
 for(const Lt of DN8.lit){const age=now-Lt.t;if(age<0||age>3.2||Lt.x<cam.x-1100||Lt.x>cam.x+VW+1100)continue;const u=age/3.2,col=Lt.col||'#ffb347';
  dn8Glow(col,Lt.x,Lt.y+20,60+u*800,24+u*120,(1-u)*.16);
  const yu=Lt.y-u*u*800;for(let j=0;j<6;j++)dn8Glow(DN8_TOZ[j],Lt.x+Math.sin(age*6+j)*6,yu+j*24,10-j,20,(1-u)*(1-j/6)*.45);}
 // final: meydana sıcak ışık
 if(DN8.fin>.01&&BOLUM.meydan){const nb=.8+.2*Math.sin(tm*1.5)+dn8Nabiz()*.3;dn8Glow('#ffb347',BOLUM.meydan.x,BOLUM.meydan.y-120,520,260,DN8.fin*.14*nb);dn8Glow('#ff8fc8',BOLUM.meydan.x+260,BOLUM.meydan.y-200,300,200,DN8.fin*.07*nb);}
 g.globalCompositeOperation='source-over';g.globalAlpha=1;
}

// ════════ Işık tozu (havada süzülen; BÖCEK DEĞİL): arkada ve önde, fenerler yandıkça parlar ════════
const dn8R=rng(5858),DN8_TOZL=Array.from({length:70},(_,i)=>({x:dn8R()*6000,y:dn8R()*1300,z:.25+dn8R()*1.15,ph:dn8R()*6.283,r:.7+dn8R()*1.6,col:DN8_TOZ[i%8],sp:.4+dn8R()*.9}));
function dn8Motes(tm,zMin,zMax){
 if(!dn8Ready())return;const vw=W/S,vh=H/S,px=(Number.isFinite(P.rx)?P.rx:P.x)-cam.x,py=(Number.isFinite(P.ry)?P.ry:P.y)-cam.y-34,br=(.5+DN8.renk*.5)*(1-DN8.sabah*.5),F=dn8FxArt();
 g.setTransform(S,0,0,S,0,0);g.globalCompositeOperation='lighter';
 for(let i=0;i<DN8_TOZL.length;i++){const p=DN8_TOZL[i];if(p.z<zMin||p.z>=zMax)continue;
  const x=((p.x-cam.x*p.z+Math.sin(tm*.23+p.ph)*26)%(vw+100)+vw+100)%(vw+100)-50,y=((p.y-cam.y*p.z-tm*p.sp*9+Math.sin(tm*.19+p.ph)*14)%(vh+100)+vh+100)%(vh+100)-50;
  let a=(.28+.2*Math.sin(tm*1.3+p.ph))*(p.z>.8?.9:.6)*br;
  if(p.z>=.75){const dx=(x-px)/60,dy=(y-py)/80,d=dx*dx+dy*dy;if(d<1)a*=.15+.85*smooth(d);}
  dn8Glow(p.col,x,y,p.r*5,p.r*5,a*.6);if(i%5===0){const r=p.r*3.4;g.globalAlpha=a*.7;g.drawImage(F.parilti,x-r,y-r,r*2,r*2);g.globalAlpha=1;}
  else{g.fillStyle=p.col;g.globalAlpha=a;g.fillRect(x-p.r*.5,y-p.r*.5,p.r,p.r);g.globalAlpha=1;}}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
}
function dn8Petals(tm){
 if(!dn8Ready())return;dn8FxArt();g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);
 dn8Sis(tm,true);   // önde ince sis (ayakların önünden)
 // finalde meydana yağan şeker renkli ışık pulları
 if(DN8.fin>.01&&BOLUM.meydan){g.globalCompositeOperation='lighter';const ax=BOLUM.meydan.x,ay=BOLUM.meydan.y;
  for(let j=0;j<28;j++){const u=(tm*.075+j*.0357)%1,x=ax+Math.sin(j*2.3)*VW*.5+Math.sin(tm*.6+j)*30,y=ay-560+u*600;dn8Glow(DN8_SEKER[j%6],x,y,9,9,DN8.fin*Math.sin(u*Math.PI)*.4);}
  g.globalCompositeOperation='source-over';}
 g.globalAlpha=1;
}
// ════════ Ön plan: alt köşelerde koyu kabak yaprakları / çalılar, sokakta üstte bayrak ipi, uçuşta yanından geçen bulutçuklar ════════
function dn8OnArt(){
 const F=dn8FxArt();if(F.on)return F.on;
 F.on=[0,1].map(v=>{const cv=dn8Cv(560,300),c=cv.getContext('2d'),R=rng(811+v*31);c.scale(2,2);const w=280,h=150;
  // koyu tümsek + kocaman kabak yaprakları + kıvrık filizler + bir minik kabak
  c.fillStyle='#160c30';c.beginPath();c.moveTo(0,h);c.bezierCurveTo(w*.05,h*.7,w*.25,h*.55,w*.45,h*.62);c.bezierCurveTo(w*.62,h*.68,w*.8,h*.56,w*.94,h*.72);c.quadraticCurveTo(w,h*.86,w,h);c.closePath();c.fill();
  for(let k=0;k<5;k++){const x=w*(.1+k*.2)+R()*14,y=h*.66,s=.9+R()*.6;c.fillStyle=k%2?'#1a2438':'#1e2a40';c.beginPath();c.moveTo(x,y+10);c.bezierCurveTo(x-30*s,y-4*s,x-40*s,y-42*s,x-6*s,y-50*s);c.bezierCurveTo(x+16*s,y-56*s,x+36*s,y-22*s,x,y+10);c.fill();
   c.strokeStyle='#28344c';c.lineWidth=1.6;c.beginPath();c.moveTo(x,y+6);c.quadraticCurveTo(x-10*s,y-22*s,x-6*s,y-44*s);c.stroke();}
  c.strokeStyle='#22304a';c.lineWidth=2;c.lineCap='round';for(let k=0;k<4;k++){const x=w*(.18+k*.22),y=h*.62;c.beginPath();c.moveTo(x,y);for(let j=0;j<=16;j++){const a=j/16*7,r=12*(1-j/18);c.lineTo(x+j*1.6+Math.cos(a)*r,y-j*2.2-Math.sin(a)*r);}c.stroke();}
  if(v===0){c.fillStyle='#3a1a24';c.beginPath();c.ellipse(w*.62,h*.74,20,15,0,0,6.283);c.fill();c.fillStyle='#4a2430';c.beginPath();c.ellipse(w*.62,h*.74,9,15,0,0,6.283);c.fill();}
  return cv;});
 return F.on;
}
// ön plan yapraklarının konmadığı aralıklar: mini oyun alanları (sürüklenen parçaları ve sahneyi örtmesin) — bir kez hesaplanır
function dn8OnBos(){
 if(DN8.onBos)return DN8.onBos;const L=[];
 for(const o of NESNELER){if(!/Mini$/.test(o.tip)||o.tip==='supurgeMini')continue;const a=Number.isFinite(o.x0)?o.x0:o.x-700,b=Number.isFinite(o.x1)?o.x1:o.x+700;L.push(Math.min(a,o.x-380)-220,Math.max(b,o.x+360)+220);}
 return DN8.onBos=L;
}
// ön plan yaprağının örtmemesi gereken oyun nesneleri (bir kez toplanır)
function dn8OnNes(){if(DN8.onNes)return DN8.onNes;return DN8.onNes=NESNELER.filter(o=>/^(kabakFener|hayaletcik|sekerKapi)$/.test(o.tip)&&Number.isFinite(o.x));}
function dn8Foreground(tm){
 if(!dn8Ready())return;const F=dn8FxArt(),vw=W/S,vh=H/S;dn8OnArt();
 const ucus=typeof P!=='undefined'&&!!P.ucus&&P.ucus.tip==='supurgeMini';
 if(ucus)return;   // uçuşta ön plan yok (biniciler ve yakın köy supurge.js'te; önlerini kapatmasın)
 {
  // sokakta üstte salınan bayrak ipi (paralaks 1,12): yakın, şeker renkli
  const yer=dn8Bolge(cam.x+VW*.5);
  if(yer==='sokak'||yer==='meydan'){const f=1.12,span=760,off=((cam.x*f)%span+span)%span;g.setTransform(S,0,0,S,0,0);
   for(let q=-1;q<vw/span+1;q++){const x0=q*span-off,x1=x0+span,y0=-14;g.strokeStyle='rgba(24,12,40,.7)';g.lineWidth=1.6;g.beginPath();g.moveTo(x0,y0);g.quadraticCurveTo((x0+x1)/2,y0+90,x1,y0);g.stroke();
    for(let j=1;j<14;j++){const u=j/14,x=lerp(x0,x1,u),y=y0+180*u*(1-u),sw=Math.sin(tm*1.6+j+q*3)*.12;g.save();g.translate(x,y);g.rotate(sw);g.globalAlpha=.92;g.drawImage(F.bayrak[((j+q*5)%8+8)%8],-16,-3,32,35);g.restore();}}g.globalAlpha=1;}
  // alt: yakın koyu yapraklar; Feza'nın üstüne gelince saydamlaşır
  const fb=1.1,left=cam.x*fb-160,right=cam.x*fb+vw+160,px=(Number.isFinite(P.rx)?P.rx:P.x);g.setTransform(S,0,0,S,-cam.x*S*fb,0);
  const bos=dn8OnBos(),yk=dn8YerKay(vh);   // yk: zemin aşağı indikçe yapraklar da onunla (biraz hızlı, paralaks 1,1) ekrandan çıkar
  if(yk<vh*.4)
  for(let q=Math.floor(left/680);q<=Math.ceil(right/680);q++){const R=rng(q*71+883),x=q*680+R()*200,wx=x/fb;if(wx>DN8_GAP0-200&&wx<DN8_GAP1+100||wx>DN8_GAP1)continue;
   let kac=false;for(let i=0;i<bos.length;i+=2)if(wx>bos[i]&&wx<bos[i+1]){kac=true;break;}if(kac)continue;const k=.5+R()*.25;
   // ekranda yaprağın Feza'ya ya da oyun nesnesine (sönük fener, saklanan hayaletçik, kapı) uzaklığı → yumuşak saydamlaşma
   // (ani belirip kaybolma yok; yaprak paralaksla kaydığı için ekran konumuyla bakılır)
   const sx=x-cam.x*fb,yar=140*k*1.35;let d=Math.abs(sx-(px-cam.x))-yar;
   for(const o of dn8OnNes()){const e=Math.abs(sx-(o.x-cam.x))-yar;if(e<d)d=e;}
   const al=.2+.66*clamp((d+20)/110,0,1);
   g.save();g.translate(x,vh+30+yk*1.1);g.rotate(Math.sin(tm*.35+q)*.015);g.globalAlpha=al;g.drawImage(F.on[Math.abs(q)%2],-140*k*1.35,-150*k*1.35,280*k*1.35,150*k*1.35);g.restore();}
  g.globalAlpha=1;
 }
 // ekran geneli: fenerler yandıkça sıcak, sabahta altın ışık
 g.setTransform(S,0,0,S,0,0);g.globalCompositeOperation='lighter';
 const R8=DN8.renk,gece=1-DN8.sabah;if(R8>.02)dn8Glow('#ff9a5a',vw*.5,vh*.95,vw*.8,vh*.35,(.02+R8*.05+DN8.fin*.05)*gece);
 if(DN8.fin>.01)dn8Glow('#ff8fc8',vw*.75,vh*.1,vw*.5,vh*.4,DN8.fin*.05*gece);
 if(DN8.sabah>.01)dn8Glow('#ffc8a0',vw*.6,vh*.8,vw*.9,vh*.6,DN8.sabah*.22);
 g.globalCompositeOperation='source-over';
}
// vinyet: ortası saydam → yalnız dört kenar parçası
const DN8_VIG=[[0,0,200,16],[0,132,200,28],[0,16,42,116],[158,16,42,116]];
function dn8Vignette(){if(!dn8Ready())return;const F=dn8FxArt(),kx=W/200,ky=H/160;g.setTransform(1,0,0,1,0,0);g.globalAlpha=1-DN8.sabah*.6;
 for(const [x,y,w,h] of DN8_VIG){const dx=Math.round(x*kx),dy=Math.round(y*ky);g.drawImage(F.vig,x,y,w,h,dx,dy,Math.round((x+w)*kx)-dx,Math.round((y+h)*ky)-dy);}g.globalAlpha=1;}

// ════════ Isıtma: önbellekleri kareye yayarak hazırla (uyku girişi / karanlık altında) ════════
function dn8Isit(){
 if(!dn8Ready())return false;const p=DN8.prep;
 if(p===0){dn8Sky();DN8.prep++;return false;}
 if(p===1){dn8FxArt();dn8AyArt();DN8.prep++;return false;}
 if(p<6){dn8Serit(p-2);DN8.prep++;return false;}
 if(p===6){dn8CadiEviArt();dn8OnArt();dn8KanatArt();dn8BacaArt();DN8.prep++;return false;}
 if(p===7){dn8Yapilar();DN8.prep++;return false;}
 if(p<11){const i=Math.max(0,Math.floor(((typeof cam!=='undefined'?cam.x:0))/DN8_CW))+(p-8);dn8Chunk(i);DN8.prep++;return false;}
 for(const c of ['#ffd890','#ffe7a8','#ff9fb8','#ffc070','#ff9a3c','#ffb860','#ffe2a0','#fff0c0','#ffc870','#ff9a5a','#ff7ab8','#ffffff','#fff2d0','#ffb347','#ff8fc8','#c39bff','#7dffc4','#e8ff8a','#8fd8ff','#e8d8ff','#f4eaff','#ffe2b0','#ffc8e8','#d8d0ff'])glow(c);
 DN8.warm=true;return true;
}
