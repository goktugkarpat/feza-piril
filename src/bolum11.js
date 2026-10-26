/* bolum11.js — Ay Işığı Şatosu (on birinci rüya; sevimli vampir temalı Cadılar Bayramı gecesi). Tepedeki eski şatoda minik bir vampir
   ailesi yaşıyor: Vela (Feza yaşında vampir kız), Vampir Dede, Vampir Nine ve bebek Pıtır. Bu gece Ay Balosu var ama Ay bulutların ardına
   saklanmış, şatonun ışıkları sönmüş. Feza ile Pırıl, bulut aralığından inen tek ay ışığı huzmesini büyük süslü aynalarla aynadan aynaya
   sektirir; huzmenin ulaştığı yerde şatonun bir parçası aydınlanır ve canlanır. Üç küçük oyun (ayna salonu, org, pasta), pelerinle kuleye
   uçuş ve Ay Balosu. Korkutucu hiçbir şey yok (kan, tabut, mezar, örümcek, böcek yok).
   Ana patikada her basamak en çok iki kare. Uçuş boşluğu (609..764) yalnız pelerinle uçarak geçilir.
   Sözleşme: src/BOLUM11.md. Çizimler dunya11.js (dn11*), nesneler ayna11.js / pelerin11.js / vampir11.js / aynasalon11.js / org11.js /
   pasta11.js / ucus11.js / balo11.js. (İlk yerleşim CORE'dan; HARITA ajanı sözleşmedeki sütun düzenini koruyarak geliştirir.) */
'use strict';
const ROWS = 30, COLS = 880;
const grid = Array.from({length:ROWS},()=>new Uint8Array(COLS));
const ground=(a,b,h)=>{for(let c=a;c<=b;c++)for(let r=ROWS-h;r<ROWS;r++)grid[r][c]=1;};
const plat=(a,b,r)=>{for(let c=a;c<=b;c++)grid[r][c]=2;};
const topOf=c=>{c=Math.floor(c);if(c<0||c>=COLS)return ROWS;for(let r=0;r<ROWS;r++)if(grid[r][c]===1)return r;return ROWS;};
const cell=(c,r)=>c<0||c>=COLS?1:r<0||r>=ROWS?0:grid[r][c];
const yuzey=c=>topOf(c)*T;
const nx=c=>c*T+T/2;
function nesne(tip,c,y,o={}){const n=Object.assign({tip,x:nx(c),y,id:tip+NESNELER.length},o);NESNELER.push(n);return n;}

// ── Zemin: [ilk sütun, son sütun, yükseklik (alttan kare)]. Komşu iki parça arasında en çok iki kare fark. ──
for(const [a,b,h] of [
 [0,30,11],[31,46,12],[47,64,12],                                                     // giriş: şato tepesinin eteğinde bahçe kapısı
 [65,84,12],[85,104,13],[105,124,14],[125,146,15],[147,168,16],[169,190,17],[191,210,17], // sisli bahçe ve şatoya çıkan yokuş
 [211,254,17],                                                                        // ayna salonu (düz, geniş)
 [255,266,17],[303,320,17],                                                           // asma köprünün iki başı
 [321,340,16],[341,380,15],[381,400,16],[401,420,17],                                 // kristal mağara (hafif çukur)
 [421,466,17],                                                                        // org salonu (düz, geniş)
 [467,550,17],                                                                        // şato galerisi (portreler, perdeler)
 [551,598,17],                                                                        // şato mutfağı (düz, geniş)
 [599,608,18],                                                                        // kalkış balkonu
 [765,784,17],[785,879,18]])                                                          // kule terası ve balo salonu
 ground(a,b,h);
// asma köprünün altı: yumuşak sis yastığı çanağı (düşmek acıtmaz; iki ucunda basamak basamak çıkılır, yol hep yürünebilir)
for(const [a,b,h] of [[267,268,15],[269,300,13],[301,302,15]]) ground(a,b,h);

// ── Tek yönlü platformlar ──
plat(267,302,ROWS-17);   // asma köprü (zeminle aynı seviyede: yürüyerek geçilir; altı sis çanağı)
// isteğe bağlı oyuncak basamaklar (normal zıplamayla, 2–3 kare): girişte ve bahçede budanmış çit kütlesinin düz tepesi, mağarada kristal
// çıkıntılar, galeride yüksek pencerenin pervazı. dunya11 bölgeye göre çizer (çit / kristal / pervaz). Nesne sütunlarından uzak.
for(const [a,b,r] of [[19,21,ROWS-13],[94,97,ROWS-16],[150,153,ROWS-19],[352,355,ROWS-18],[396,399,ROWS-19],[476,479,ROWS-20]]) plat(a,b,r);

// ── Odalar (yalnız görüntü; dunya11 arka duvarı, tavanı, zemin döşemesini bunlardan çizer). tavan: dünya y'si (görsel; çarpışma yok) ──
// Mağaranın tavanı sütun sütun eğri büğrü (yuvarlak kaya + sarkan pastel kristaller); uyuyan yarasalar tavana asılır.
const BL11_ODA=[{ad:'salon',a:211,b:254,tavan:30},{ad:'magara',a:321,b:420,tavan:null},{ad:'org',a:421,b:466,tavan:-70},
 {ad:'galeri',a:467,b:550,tavan:40},{ad:'mutfak',a:551,b:598,tavan:70},{ad:'balo',a:785,b:879,tavan:null}];
const BL11_TAV=new Float32Array(COLS).fill(NaN);
for(const o of BL11_ODA)for(let c=o.a;c<=o.b;c++)BL11_TAV[c]=o.ad==='magara'?Math.round(Math.max(150,200+38*Math.sin(c*.19)+22*Math.sin(c*.53+1)-Math.max(0,6-(c-o.a))*26-Math.max(0,6-(o.b-c))*14)):o.ad==='balo'?-170:o.tavan;
const bl11Oda=c=>{c=Math.floor(c);for(const o of BL11_ODA)if(c>=o.a&&c<=o.b)return o;return null;};

const BOLUM={
 ad:'Ay Işığı Şatosu',baslangic:{x:nx(6),y:yuzey(6)},
 bolgeler:[{ad:'giris',x0:0,x1:65*T},{ad:'bahce',x0:65*T,x1:211*T},{ad:'salon',x0:211*T,x1:255*T},{ad:'kopru',x0:255*T,x1:321*T},
  {ad:'magara',x0:321*T,x1:421*T},{ad:'org',x0:421*T,x1:467*T},{ad:'galeri',x0:467*T,x1:551*T},{ad:'mutfak',x0:551*T,x1:599*T},
  {ad:'balkon',x0:599*T,x1:609*T},{ad:'yolculuk',x0:609*T,x1:765*T},{ad:'balo',x0:765*T,x1:COLS*T}],
 gol:null,gollar:[],
 // pelerinle uçuş koridoru (ucus11.js): balkondan ay ışığında, aydınlanan şatonun üstünden kule terasına iniş.
 // oyun.js uçuş kamerası BOLUM.ucus'u okur (yUst..yAlt ekrana sığar).
 kule:{x0:nx(604),x1:nx(766),yUst:40,yAlt:640,inisX:nx(770),inisY:yuzey(770)},
 balo:{x:nx(826),y:yuzey(826)},
 ayKaynak:{x:nx(14),y:-260},   // ilk huzmenin geldiği bulut aralığı (dünya koordinatı; ay gökte, bunun üstünde)
 aynaTop:12,
 // kamera: girişte geniş bahçe; köprüde aşağı bakar (altındaki sis çanağı görünsün); odalarda tavanın süsü üst kenarda kalır
 kamera:[{x0:0,x1:64*T,zoom:.9,yOfs:-80},{x0:65*T,x1:210*T,zoom:.86,yOfs:-110},{x0:211*T,x1:254*T,zoom:.84,yOfs:-50},
  {x0:255*T,x1:320*T,zoom:.8,yOfs:10},{x0:321*T,x1:420*T,zoom:.84,yOfs:-70},{x0:421*T,x1:466*T,zoom:.82,yOfs:-80},
  {x0:467*T,x1:550*T,zoom:.86,yOfs:-70},{x0:551*T,x1:598*T,zoom:.84,yOfs:-50},{x0:599*T,x1:608*T,zoom:.82,yOfs:-90},
  {x0:765*T,x1:COLS*T,zoom:.8,yOfs:-130}]
};
BOLUM.ucus=BOLUM.kule;
P.x=P.safeX=BOLUM.baslangic.x;P.y=P.safeY=BOLUM.baslangic.y;D.x=P.x-60;D.y=P.y-85;

// ── Pelerin seçimi (pelerin11.js): havada süzülen dört baloncuk ──
nesne('pelerinSec',14,yuzey(14),{});

// ── Ay ışığı aynaları (12; ayna11.js) ve her birinin aydınlattığı şato parçası (satoParca). Huzme: ayKaynak → ayna1 → parça1 → ayna2 → … ──
// [ayna sütunu, parça sütunu, parçanın zeminden yüksekliği (dy, yukarı eksi), parça türü]
const BL11_AYNA=[[26,40,0,'kapi'],[52,66,0,'cesme'],[86,102,0,'cali'],[122,140,-250,'pencere'],[158,176,-420,'bayrak'],[194,206,-460,'kule'],
 [312,324,-150,'fener'],[340,356,-60,'kristal'],[372,388,-300,'avize'],[404,414,-180,'hayalet'],[486,504,-220,'portre'],[522,540,-200,'perde']];
BL11_AYNA.forEach(([c,pc,dy,tur],i)=>{
 const pr=nesne('satoParca',pc,yuzey(pc)+dy,{tur,sira:i});
 nesne('ayAyna',c,yuzey(c),{sira:i,hedefId:pr.id,r:70});
});

// ── Vampir ailesinin karşılama durakları (vampir11.js; takip etmezler) ──
nesne('vampirDurak',38,yuzey(38),{kim:'kiz',an:'karsila'});
nesne('vampirDurak',536,yuzey(536),{kim:'bebek',an:'besik'});
// ── Dekor dostlar (vampir11.js): kıkırdayan pastel hayaletler, lila yarasalar ──
for(const c of [334,360,392]) nesne('hayaletDekor',c,yuzey(c)-120,{});
for(const [c,dy,uyku] of [[100,-300,0],[170,-360,0],[350,0,1],[384,0,1],[480,-330,0]])
 nesne('yarasaDekor',c,uyku?BL11_TAV[c]+34:yuzey(c)+dy,{uyku});   // uyuyanlar mağara tavanına asılı (gövde tavanın 34 altında)

// ── Yol boyu oyuncaklar (ayna11.js 'ay11Oyun'; isteğe bağlı küçük sevinçler, zorunlu değil): ay çanları (her biri başka nota),
// yarasa minderi (üstüne basınca yükseğe hoplatır; tepede gizli yıldız), kıkırdayan hayaletli sandık, ışık saçan kristaller,
// şarkı söyleyen dönen portreler, ay tokmaklı minik kapı (içinden lila yarasa el sallar). Ayna/parça sütunlarından uzak. ──
for(const [c,tur,nota] of [[72,'can',0],[112,'minder',0],[136,'can',2],[263,'can',4],[329,'sandik',0],[348,'kristal',1],[386,'kristal',5],
 [470,'kapi',0],[494,'portre',0],[513,'portre',1]])
 nesne('ay11Oyun',c,yuzey(c),{tur,nota});
// ── Köprünün altındaki sis yastığı: çanağa düşen Feza yumuşakça yukarı sıçrar ve köprüye geri konar (düşmek acıtmaz, takılmaz) ──
TUR.kaydet('bl11SisYastik',{kur(o){o.cisim={w:(301-269)*T,h:10,tip:'ziplat',guc:1080,aktif:true};},ciz(){}});
nesne('bl11SisYastik',285,yuzey(285),{x:(269*T+301*T)/2});
// (Not: oyun.js Feza'yı ekranın üst %87'sinde tutar; göğe bakış bu yüzden asıl uzaklaşmayla olur — kulede .57 ≈ külah ucu da görünür.)
// ── Yüksekteki canlanmalar (ön kulenin yıldızı, kule flamaları): 'satoCanlan' tur 'kule' | 'bayrak' gelince kamera ≈6 sn yumuşakça uzaklaşıp
// yukarı bakar (geçici kamera bölgesi, listenin başında; yUst: dünyanın tepesinin üstü — oyun.js okursa gök de görünür), sonra eski hâline döner ──
const BL11_KAMDIK={x0:-1e6,x1:-1e6,zoom:.86,yOfs:-110,yUst:-40,w:0,t:-99,tur:''};
BOLUM.kamera.unshift(BL11_KAMDIK);
OLAY.on('satoCanlan',e=>{const t=e&&e.tur;if(t!=='kule'&&t!=='bayrak')return;const x=e&&Number.isFinite(e.x)?e.x:P.x;
 BL11_KAMDIK.x0=Math.min(x,P.x)-14*T;BL11_KAMDIK.x1=Math.max(x,P.x)+12*T;BL11_KAMDIK.t=typeof now!=='undefined'?now:0;BL11_KAMDIK.tur=t;});
TUR.kaydet('bl11Kamera',{guncelle(){const K=BL11_KAMDIK,a=(typeof now!=='undefined'?now:0)-K.t;
 const w=a<0||a>6.5?0:smooth(clamp(a/.9,0,1))*(1-smooth(clamp((a-5)/1.5,0,1)));K.w=w;
 K.zoom=lerp(.86,K.tur==='kule'?.57:.74,w);K.yOfs=lerp(-110,K.tur==='kule'?-470:-230,w);K.yUst=lerp(-40,-420,w);if(w<=0){K.x0=K.x1=-1e6;}}});
nesne('bl11Kamera',0,0,{});
// ── Ayna dönüşü / şato canlanması: kamera kısa, yumuşak bir "nefes" alır (≈%3,5 yakınlaşıp geri; abartısız) ──
const BL11_NABIZ={x0:-1e6,x1:-1e6,zoom:.86,yOfs:-80,t:-99,z0:.86,y0:-80};
BOLUM.kamera.splice(1,0,BL11_NABIZ);
function bl11NabizBasla(x){const now0=typeof now!=='undefined'?now:0;if(now0-BL11_NABIZ.t<1.2)return;let k=null;for(let i=2;i<BOLUM.kamera.length;i++){const q=BOLUM.kamera[i];if(P.x>=q.x0&&P.x<=q.x1){k=q;break;}}
 if(!k)return;BL11_NABIZ.z0=k.zoom;BL11_NABIZ.y0=k.yOfs||0;BL11_NABIZ.x0=k.x0;BL11_NABIZ.x1=k.x1;BL11_NABIZ.t=now0;}
OLAY.on('aynaDondu',()=>bl11NabizBasla());OLAY.on('satoCanlan',e=>{if(e&&e.tur!=='kule'&&e.tur!=='bayrak')bl11NabizBasla();});
TUR.kaydet('bl11Nabiz',{guncelle(){const a=(typeof now!=='undefined'?now:0)-BL11_NABIZ.t;if(a<0||a>1.1){BL11_NABIZ.x0=BL11_NABIZ.x1=-1e6;return;}
 const w=Math.sin(Math.PI*clamp(a/1.1,0,1));BL11_NABIZ.zoom=BL11_NABIZ.z0*(1+.035*w);BL11_NABIZ.yOfs=BL11_NABIZ.y0+12*w;}});
nesne('bl11Nabiz',0,0,{});
// ── Mini oyun 1: ayna salonu (aynasalon11.js) ──
const bl11Salon=nesne('aynaSalonMini',232,yuzey(232),{x0:nx(215),x1:nx(250)});
nesne('miniKapi',253,yuzey(253),{bagId:bl11Salon.id,stil:'sato'});
// ── Mini oyun 2: org konseri (org11.js) ──
const bl11Org=nesne('orgMini',442,yuzey(442),{x0:nx(425),x1:nx(462)});
nesne('miniKapi',465,yuzey(465),{bagId:bl11Org.id,stil:'sato'});
// ── Mini oyun 3: Vampir Nine'nin çilekli pastası (pasta11.js) ──
const bl11Pasta=nesne('pastaMini',572,yuzey(572),{x0:nx(555),x1:nx(594)});
nesne('miniKapi',597,yuzey(597),{bagId:bl11Pasta.id,stil:'sato'});
// ── Pelerinle uçuş (ucus11.js; P.ucus ile fiziği devralır) ──
nesne('pelerinUcus',604,yuzey(604),{});
// ── Final: Ay Balosu (balo11.js) ──
nesne('ayBalosu',826,yuzey(826),{});

// ── Dekor imzaları (yalnız görüntü; dunya11.js zemin parçalarına bir kez boyar, çarpışma yok). Ayna (x±2 sütun) ve satoParca yerleri boş. ──
// cali: budanmış çalılar [sütun, ölçek, biçim 'yarasa'|'kalp'|'ay'|'top'] (ÇİÇEK YOK). agac: yuvarlak budanmış lolipop ağaçlar [sütun, ölçek, renk].
// fener: bahçe lambaları (ay ışığı topu) [sütun]. kristal: mağara [sütun, ölçek, renk 0 lila 1 nane 2 pembe].
// portre: galeride gülen aile portreleri [sütun, kim]. pencere: perdeli yüksek pencere [sütun, oda]. samdan: duvar şamdanı (ay ışığı topu).
// avize: [sütun]. ip: süs ipi [s0, dy0, s1, dy1, sarkma, adet, tür 'yarasa'|'yildiz'|'cilek'] (dy zeminden).
const DEKOR11={
 kuleTepe:{x:nx(206),y:-286},   // şatonun ön kulesinin (bahçe sonu) külah ucu: AYNA 'kule' parçasının yıldızı buraya oturur (dunya11 aynı ölçüyle çizer)
 cali:[[4,1,'top'],[11,.85,'kalp'],[31,.9,'ay'],[47,1,'yarasa'],[58,1.1,'kalp'],[74,1,'ay'],[80,.85,'top'],[110,1.1,'kalp'],[116,.9,'top'],
  [130,1,'yarasa'],[146,1,'ay'],[164,1.2,'yarasa'],[182,1,'ay'],[188,.9,'kalp'],[200,.9,'top'],[262,.8,'top'],[306,.85,'kalp']],
 agac:[[1,1.1,0],[17,1,1],[62,1.15,2],[78,.9,0],[114,1.05,1],[134,.95,2],[168,1.1,0],[198,1,1]],
 fener:[[8],[44],[70],[91],[118],[142],[170],[188],[208],[258],[600],[607],[767],[782]],
 kristal:[[326,.9,0],[331,.6,2],[344,1.1,1],[362,.7,0],[366,.8,2],[378,1.2,0],[396,1,1],[400,.6,2],[412,.9,2]],
 portre:[[472,'dede'],[490,'nine'],[526,'kiz']],
 pencere:[[478,'galeri'],[218,'salon'],[248,'salon'],[428,'org'],[456,'org'],[562,'mutfak'],[590,'mutfak']],
 samdan:[[214],[252],[424],[460],[482],[516],[528],[554],[596]],
 avize:[[232],[802],[850]],
 ip:[[4,-150,17,-170,40,9,'yarasa'],[58,-160,74,-150,40,9,'yildiz'],[110,-150,130,-160,46,11,'yarasa'],[164,-170,182,-160,40,9,'yildiz'],
  [216,-370,230,-370,50,9,'yildiz'],[234,-370,250,-370,50,9,'yildiz'],[555,-330,570,-330,40,9,'cilek'],[575,-330,594,-330,40,10,'cilek'],
  [786,-420,797,-420,50,7,'yarasa'],[797,-420,808,-420,50,7,'yildiz'],[844,-420,855,-420,50,7,'yildiz'],[855,-420,866,-420,50,7,'yarasa'],[866,-420,877,-420,50,7,'yildiz']]
};

// ── Test kancaları (başsız deneme; oyuna etkisi yok): B11T.isinla(sütun), B11T.bitir('salon'|'org'|'pasta'|'ucus'|'pelerin'|'aynalar') ──
window.B11T={
 isinla(c){const x=nx(c);let y=yuzey(c);for(let r=0;r<ROWS;r++)if(grid[r][c]){y=r*T;break;}P.x=P.safeX=x;P.y=P.safeY=y;P.vx=P.vy=0;P.ground=true;if(typeof D!=='undefined'){D.x=x-60;D.y=y-85;}if(typeof stepCam==='function')try{stepCam(0,true);}catch(e){}},
 bitir(ad){
  const tip={salon:'aynaSalonMini',org:'orgMini',pasta:'pastaMini',ucus:'pelerinUcus',pelerin:'pelerinSec',balo:'ayBalosu'}[ad];
  if(ad==='aynalarHizli'&&typeof AYNA11!=='undefined'&&typeof AYNA11.hepsi==='function'){AYNA11.hepsi();return;}
 if(ad==='aynalar'){for(const o of NESNELER)if(o.tip==='ayAyna'&&!o.donmus){const h=TUR.al('ayAyna');if(h&&h.dokun)h.dokun(o);}return;}
  const o=NESNELER.find(n=>n.tip===tip);const h=o&&TUR.al(tip);if(h&&typeof h.testBitir==='function')h.testBitir(o);
 }
};

const FLOWERS=[];
const TREE=null;
