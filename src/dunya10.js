/* dunya10.js — Zamanın Uyuduğu Vadi: Ori/Gris esintili, elde çizilmiş saat bahçesi.
   Dört derinlik katmanı, cam damlalar, gökte usturlap halkaları, kum saati meyveleri,
   ışıklı taş patika, havada uyuyan yapraklar. Hareket, Feza'nın uyandırdığı yerlerde geri döner.
   Tüm büyük gradyanlar/süsler sprite önbelleğinde; arazi LRU en çok 8 parça. Karede filtre/gölge yok.
   API: dn10Background/Motes/World/Petals/Foreground/Vignette, dn10Isit, dn10IsikEkle, dn10Surface. */
'use strict';
function dn10Mix(a,b,t){const A=hex(a),B=hex(b);let out='#';for(let i=0;i<3;i++)out+=Math.round(clamp(lerp(A[i],B[i],t),0,255)).toString(16).padStart(2,'0');return out;}
const DN10={fx:null,sky:null,ridge:[],chunks:new Map(),prep:0,last:null,awake:0,fin:0,lit:[],walkX:null,step:0,art:null,chunkTick:0,scenes:[],skies:[],zone:0,zoneReady:false,moteT:0};
let DN10_TREE_IMAGE=null,DN10_SEASON_IMAGE=null;
const DN10_SEASON_RECTS=[];
if(typeof Image!=='undefined'){const im=new Image();im.onload=()=>{DN10_TREE_IMAGE=im;if(DN10.art)DN10.art.tree=dn10TreeArt();};im.onerror=()=>{};im.src='assets/zaman/enchanted-tree-v1.png';}
// Read only coarse alpha bounds once, so each illustrated tree keeps its own proportions.
// file:// may disallow pixel reads; in that case the complete, unmodified atlas tile is used.
function dn10SeasonRects(im){
 const tw=im.naturalWidth/2,th=im.naturalHeight/2,probe=dn10Cv(128,128),c=probe.getContext('2d',{willReadFrequently:true});
 for(let k=0;k<4;k++){const sx=k%2*tw,sy=Math.floor(k/2)*th;let x0=0,y0=0,x1=tw,y1=th;
  try{c.clearRect(0,0,128,128);c.drawImage(im,sx,sy,tw,th,0,0,128,128);const px=c.getImageData(0,0,128,128).data;let l=128,t=128,r=-1,b=-1;for(let y=0;y<128;y++)for(let x=0;x<128;x++)if(px[(y*128+x)*4+3]>10){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}if(r>=l){x0=Math.max(0,l-1)*tw/128;y0=Math.max(0,t-1)*th/128;x1=Math.min(128,r+2)*tw/128;y1=Math.min(128,b+2)*th/128;}}catch(_){/* Tainted file-origin readback keeps the proportional full-tile fallback. */}
  DN10_SEASON_RECTS[k]={x:sx+x0,y:sy+y0,w:x1-x0,h:y1-y0};
 }
}
if(typeof Image!=='undefined'){const im=new Image();im.onload=()=>{DN10_SEASON_IMAGE=im;dn10SeasonRects(im);for(const v of [0,2,3,6])DN10.scenes[v]=null;if(DN10.art){DN10.art.distant=dn10DistantTree();if(!DN10_TREE_IMAGE)DN10.art.tree=dn10TreeArt();}};im.onerror=()=>{};im.src='assets/zaman/seasonal-trees-v1.png';}
const DN10_COL=['#cdb4ff','#91f6e4','#ffe3a4','#f6bbdb'];
const dn10Hash=v=>{const a=Math.sin(v*127.1+311.7)*43758.5453;return a-Math.floor(a);};
const dn10Cv=(w,h)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c;};
const dn10Mod=(a,n)=>((a%n)+n)%n;
// Harita bu rüyada sabittir; sık zemin sorguları her seferinde 30 satır aramaz.
const DN10_SURFACE=Float32Array.from({length:COLS},(_,i)=>topOf(i)*T);
function dn10Surface(x){return DN10_SURFACE[clamp(Math.floor(x/T),0,COLS-1)];}
function dn10Ready(){return W>0&&H>0&&S>0&&typeof cam!=='undefined'&&Number.isFinite(cam.x)&&Number.isFinite(cam.y);}
function dn10IsikOrani(){return DN10.awake;}
function dn10IsikEkle(x,y,col,r){if(!Number.isFinite(x))return;if(DN10.lit.length>=24)DN10.lit.shift();DN10.lit.push({x,y:Number.isFinite(y)?y:dn10Surface(x)-30,c:col||'#ffe3a4',r:r||1200,t:now});}
function dn10Isik(x){let f=Math.max(DN10.fin,dn10BolgeUyanis(x)*.8);for(const p of DN10.lit){const age=Math.max(0,now-p.t),d=Math.abs(x-p.x),k=clamp((Math.min(p.r,age*380)-d)/220,0,1);if(k>f)f=k;}return f;}
function dn10Glow(col,x,y,rx,ry,a){if(a<.003)return;g.globalAlpha=clamp(a,0,1);g.drawImage(glow(col),x-rx,y-ry,rx*2,ry*2);g.globalAlpha=1;}
function dn10Ellipse(c,x,y,rx,ry,col,angle=0){c.fillStyle=col;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),angle,0,Math.PI*2);c.fill();}
function dn10Stroke(c,col,w,points){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(points[0],points[1]);for(let k=2;k<points.length;k+=2)c.lineTo(points[k],points[k+1]);c.stroke();}
function dn10GlowArt(c,col,x,y,r,a){const v=hex(col),gr=c.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba('+v.join(',')+','+a+')');gr.addColorStop(.4,'rgba('+v.join(',')+','+a*.34+')');gr.addColorStop(1,'rgba('+v.join(',')+',0)');c.fillStyle=gr;c.fillRect(x-r,y-r,r*2,r*2);}
function dn10Petal(c,x,y,l,w,ang,col){c.save();c.translate(x,y);c.rotate(ang);if(l>38){const q=c.createLinearGradient(-w,0,w,-l);q.addColorStop(0,dn10Mix(col,'#315a75',.3));q.addColorStop(.42,col);q.addColorStop(.68,dn10Mix(col,'#fff5df',.3));q.addColorStop(1,dn10Mix(col,'#596094',.18));c.fillStyle=q;}else c.fillStyle=col;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(-w,-l*.25,-w*.8,-l*.83,0,-l);c.bezierCurveTo(w*.8,-l*.83,w,-l*.25,0,0);c.fill();c.strokeStyle='rgba(255,250,225,.25)';c.lineWidth=.8;c.beginPath();c.moveTo(0,-3);c.quadraticCurveTo(w*.15,-l*.5,0,-l*.87);c.stroke();c.restore();}
function dn10Fx(){
 if(DN10.fx)return DN10.fx;const F={};
 F.star=(()=>{const im=dn10Cv(48,48),c=im.getContext('2d');dn10GlowArt(c,'#fff4ce',24,24,23,.7);c.fillStyle='#fff9e4';c.beginPath();c.moveTo(24,3);c.quadraticCurveTo(26,22,45,24);c.quadraticCurveTo(26,26,24,45);c.quadraticCurveTo(22,26,3,24);c.quadraticCurveTo(22,22,24,3);c.fill();return im;})();
 F.drop=(()=>{const im=dn10Cv(54,80),c=im.getContext('2d');const gr=c.createLinearGradient(8,8,42,74);gr.addColorStop(0,'#edffff');gr.addColorStop(.22,'#b5f2f0');gr.addColorStop(.6,'#5ac5cf');gr.addColorStop(.86,'#b3defa');gr.addColorStop(1,'#f9f1ff');c.fillStyle=gr;c.beginPath();c.moveTo(27,5);c.bezierCurveTo(24,24,7,40,7,55);c.bezierCurveTo(7,80,46,80,46,55);c.bezierCurveTo(46,39,30,23,27,5);c.fill();c.strokeStyle='#e9fff9';c.lineWidth=1.5;c.stroke();c.strokeStyle='rgba(255,255,255,.88)';c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(22,31);c.quadraticCurveTo(12,46,14,57);c.stroke();dn10Ellipse(c,33,62,7,3,'rgba(255,255,255,.55)',-.5);return im;})();
 F.leaf=DN10_COL.map(col=>{const im=dn10Cv(54,28),c=im.getContext('2d');c.translate(27,25);dn10Petal(c,0,0,47,13,Math.PI/2,col);return im;});
 F.frond=(()=>{const im=dn10Cv(240,160),c=im.getContext('2d');for(let j=0;j<7;j++){const x=120,y=160,ang=-2.7+j*.36,L=88+Math.sin(j*3)*25;c.strokeStyle=j%2?'#43567f':'#4d6d8c';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(ang)*L*.2,y+Math.sin(ang)*L*.8,x+Math.cos(ang)*L,y+Math.sin(ang)*L);c.stroke();for(let z=1;z<9;z++){const t=z/9,xx=x+Math.cos(ang)*L*t,yy=y+Math.sin(ang)*L*t;dn10Petal(c,xx,yy,17*(1-t)+6,6,ang+.2,j%2?'#527a92':'#566b99');dn10Petal(c,xx,yy,15*(1-t)+6,5,ang+2.2,j%2?'#436b89':'#4e608d');}}return im;})();
 F.vig=(()=>{const im=dn10Cv(320,200),c=im.getContext('2d'),q=c.createRadialGradient(160,80,65,160,90,190);q.addColorStop(0,'rgba(30,23,62,0)');q.addColorStop(.52,'rgba(30,23,62,0)');q.addColorStop(1,'rgba(24,20,58,.4)');c.fillStyle=q;c.fillRect(0,0,320,200);return im;})();
 F.mist=(()=>{const im=dn10Cv(256,100),c=im.getContext('2d');c.scale(2.56,1);dn10GlowArt(c,'#a9dfdf',50,50,50,.6);return im;})();
 DN10.fx=F;return F;
}
function dn10Sky(v=0){
 v=clamp(v|0,0,6);if(DN10.skies[v])return DN10.skies[v];const im=dn10Cv(900,600),c=im.getContext('2d'),R=rng(10074+v*91),P=DN10_PAL[v],q=c.createLinearGradient(0,0,0,600);
 q.addColorStop(0,P[0]);q.addColorStop(.3,P[1]);q.addColorStop(.7,P[2]);q.addColorStop(1,P[3]);c.fillStyle=q;c.fillRect(0,0,900,600);
 dn10GlowArt(c,P[5],680,430,390,v===4?.22:.46);dn10GlowArt(c,v===1?'#65f5d0':'#c9a4ff',150,220,330,.25);
 // Painted luminous cloud banks. Every patch has a lit upper rim and a cool underside.
 for(let j=0;j<4;j++){const yy=210+j*92;for(let k=0;k<10;k++){const xx=k*115-60+(j%2)*45,y=yy+Math.sin(k*.74+j)*32,r=43+R()*60;c.globalAlpha=.018+j*.006;dn10Ellipse(c,xx,y,r*1.8,r*.32,P[5],-.1);dn10Ellipse(c,xx+12,y+12,r*1.7,r*.25,P[0],-.08);}}c.globalAlpha=1;
 for(let i=0;i<210;i++){const x=R()*900,y=R()*R()*380,r=.35+R()*.7;dn10Ellipse(c,x,y,r,r,'rgba(255,242,213,'+(.18+R()*.42)+')');}
 // Light travels diagonally into the valley; the beams themselves remain frozen.
 c.save();c.globalAlpha=.027;c.fillStyle=P[5];for(let i=0;i<4;i++){c.beginPath();c.moveTo(630+i*42,-20);c.lineTo(654+i*42,-20);c.lineTo(310+i*95,600);c.lineTo(225+i*91,600);c.fill();}c.restore();
 for(let i=0;i<3400;i++){c.fillStyle=i%2?'rgba(255,244,216,.018)':'rgba(32,19,60,.025)';c.fillRect(R()*900,R()*600,1+R(),1+R());}
 DN10.skies[v]=im;if(v===0)DN10.sky=im;return im;
}
// Tekrar eden şeritte yükseklik ve eğim 1600 birimde tam tur yapar; dikey dağ dikişi oluşmaz.
function dn10RidgeY(x,v){const a=x*Math.PI*2/1600;return 170+Math.sin(a*2+v)*100+Math.sin(a*5+v*.7)*33;}
function dn10Ridge(v){
 if(DN10.ridge[v])return DN10.ridge[v];const im=dn10Cv(1600,650),c=im.getContext('2d'),R=rng(10100+v*71);let q=c.createLinearGradient(0,80,0,650);
 q.addColorStop(0,v?'#315b78':'#717ca2');q.addColorStop(.58,v?'#447f8b':'#7d98b0');q.addColorStop(1,v?'#67aaa5':'#a4c4c7');c.fillStyle=q;c.beginPath();c.moveTo(-10,650);
 for(let x=-80;x<=1700;x+=80){const y=dn10RidgeY(x,v);if(x===-80)c.lineTo(x,y);else c.quadraticCurveTo(x-40,y-35,x,y);}c.lineTo(1700,650);c.closePath();c.fill();
 // Kayanın doğal, yuvarlak taraçaları. Havada kalmış dikey şelaleler uzakta inci dizilerine döner.
 for(let i=0;i<20;i++){const x=140+R()*1320,y=230+R()*240,w=35+R()*90;c.strokeStyle=v?'rgba(180,229,218,.24)':'rgba(222,225,240,.25)';c.lineWidth=2;c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x,y+10,x+w,y-4);c.stroke();}
 for(let i=0;i<9;i++){const x=30+R()*1540,y=235+R()*100;for(let j=0;j<9;j++)dn10Ellipse(c,x+Math.sin(j)*1.5,y+j*12,1.1,3.2,'rgba(224,250,248,.38)');}
 // A quiet distant woodland with individual silhouettes and open gaps.
 for(let i=0;i<17;i++){const x=55+i*94+R()*15,y=405+Math.sin(x*Math.PI*4/1600)*30,h=64+R()*74,w=51+R()*35;const pal=v?['#416b7c','#527f88','#67969b','#8eb4b0']:['#687d9d','#7a95ad','#91aebf','#b0c6ce'];c.strokeStyle=pal[0];c.lineWidth=4;c.beginPath();c.moveTo(x,y+25);c.bezierCurveTo(x+7,y-h*.25,x-4,y-h*.6,x+2,y-h*.8);c.stroke();for(let j=0;j<3;j++){const sx=x+(j-1)*w*.23,sy=y-h*(.57+j%2*.24);c.lineWidth=2;c.beginPath();c.moveTo(x,y-h*.2);c.quadraticCurveTo(x+(j-1)*w*.15,sy+15,sx,sy);c.stroke();dn10Crown(c,sx,sy,w*(j===1?.8:.7),h*(j===1?.53:.43),pal,9000+i*3+j,.2);}}
 // Etek sise karışır; şeridin tekrarlandığı dikey kenarlar görünmez.
 c.globalCompositeOperation='destination-in';q=c.createLinearGradient(0,450,0,650);q.addColorStop(0,'rgba(0,0,0,1)');q.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=q;c.fillRect(0,0,1600,650);
 return DN10.ridge[v]=im;
}
// Organic wood is a tapered ribbon along one connected cubic curve, not a thick line.
// Every helper below paints only immutable cached scenery.
function dn10Limb(c,x0,y0,x1,y1,x2,y2,x3,y3,w0,w1,col,seed){
 const P=[],R=rng(seed);for(let i=0;i<=20;i++){const t=i/20,u=1-t,x=u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3,y=u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3,dx=3*u*u*(x1-x0)+6*u*t*(x2-x1)+3*t*t*(x3-x2),dy=3*u*u*(y1-y0)+6*u*t*(y2-y1)+3*t*t*(y3-y2),len=Math.max(.01,Math.hypot(dx,dy)),w=lerp(w0,w1,Math.pow(t,.75))*(1+Math.sin(t*12+seed)*.045);P.push({x,y,nx:-dy/len,ny:dx/len,w});}
 c.save();c.beginPath();for(let i=0;i<P.length;i++){const p=P[i],x=p.x+p.nx*p.w*.5,y=p.y+p.ny*p.w*.5;if(!i)c.moveTo(x,y);else c.lineTo(x,y);}for(let i=P.length-1;i>=0;i--){const p=P[i];c.lineTo(p.x-p.nx*p.w*.5,p.y-p.ny*p.w*.5);}c.closePath();
 const q=c.createLinearGradient(Math.min(x0,x3)-w0*.5,y0,Math.max(x0,x3)+w0*.6,y0);q.addColorStop(0,dn10Mix(col,'#162c35',.6));q.addColorStop(.3,col);q.addColorStop(.57,dn10Mix(col,'#e5c9a0',.34));q.addColorStop(.78,dn10Mix(col,'#53434f',.28));q.addColorStop(1,dn10Mix(col,'#1e2d38',.5));c.fillStyle=q;c.fill();c.clip();
 for(let j=0;j<9;j++){const f=(j-4)/10;c.strokeStyle=j%3?'rgba(30,35,40,.22)':'rgba(239,214,168,.27)';c.lineWidth=j%3?1.3:1.8;c.beginPath();for(let i=0;i<P.length;i++){const p=P[i],off=p.w*(f+Math.sin(i*.45+j+seed)*.025),x=p.x+p.nx*off,y=p.y+p.ny*off;if(!i)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();}
 for(let j=0;j<34;j++){const p=P[Math.floor(R()*P.length)],off=(R()-.5)*p.w;c.strokeStyle=j%2?'rgba(247,222,175,.17)':'rgba(25,34,42,.19)';c.lineWidth=.65;c.beginPath();c.moveTo(p.x+p.nx*off,p.y+p.ny*off);c.lineTo(p.x+p.nx*off+p.ny*4,p.y+p.ny*off-p.nx*4);c.stroke();}c.restore();
}
function dn10Crown(c,x,y,w,h,pal,seed,detail=1){
 const R=rng(seed),pts=[];for(let i=0;i<34;i++){const a=i*Math.PI*2/34,r=.9+Math.sin(a*5+seed)*.075+Math.sin(a*9+seed*.3)*.045+R()*.035;pts.push([x+Math.cos(a)*w*.5*r,y+Math.sin(a)*h*.5*r]);}
 c.save();c.beginPath();const p0=pts[0],pn=pts[pts.length-1];c.moveTo((pn[0]+p0[0])*.5,(pn[1]+p0[1])*.5);for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])*.5,(a[1]+b[1])*.5);}c.closePath();
 const q=c.createRadialGradient(x-w*.21,y-h*.28,2,x+w*.08,y+h*.12,Math.max(w,h)*.66);q.addColorStop(0,pal[3]);q.addColorStop(.27,pal[2]);q.addColorStop(.57,pal[1]);q.addColorStop(1,pal[0]);c.fillStyle=q;c.fill();c.clip();
 // Broad shadow pockets give volume. Small broken strokes suggest foliage without giant chips.
 for(let j=0;j<6;j++){const xx=x+(R()-.5)*w*.8,yy=y+(R()-.2)*h*.55,rx=w*(.1+R()*.12),ry=h*(.07+R()*.12);const z=c.createRadialGradient(xx,yy,0,xx,yy,Math.max(rx,ry));z.addColorStop(0,'rgba(15,34,41,.16)');z.addColorStop(1,'rgba(15,34,41,0)');c.fillStyle=z;c.fillRect(xx-rx*2,yy-ry*2,rx*4,ry*4);}
 const count=Math.floor((w*h/70)*detail);for(let i=0;i<count;i++){const a=R()*Math.PI*2,r=Math.sqrt(R()),xx=x+Math.cos(a)*w*.49*r,yy=y+Math.sin(a)*h*.49*r,light=clamp(.6-(xx-x)/w*.35-(yy-y)/h*.8,0,1),len=1.6+R()*3.4;c.strokeStyle=light>.7?pal[3]:light>.43?pal[2]:pal[1];c.globalAlpha=.3+R()*.4;c.lineWidth=.6+R()*.8;c.beginPath();c.moveTo(xx-len,yy+1);c.quadraticCurveTo(xx,yy-len*.5,xx+len*.4,yy);c.stroke();}c.globalAlpha=1;c.restore();
 // Just a few tiny edge leaves soften the painted contour; they remain attached to its mass.
 for(let i=0;i<28*detail;i++){const a=R()*Math.PI*2,r=.9+Math.sin(a*5+seed)*.075+Math.sin(a*9+seed*.3)*.045,xx=x+Math.cos(a)*w*.5*r,yy=y+Math.sin(a)*h*.5*r;dn10Petal(c,xx,yy,3+R()*4,1.1,a+Math.PI*.5,a>Math.PI?pal[2]:pal[1]);}
}
function dn10BotanicalTree(c,x,y,w,h,pal,seed,type=0){
 const crop=DN10_SEASON_RECTS[type%4];if(DN10_SEASON_IMAGE&&crop){const fit=Math.min(w*1.24/crop.w,h/crop.h),dw=crop.w*fit,dh=crop.h*fit;c.drawImage(DN10_SEASON_IMAGE,crop.x,crop.y,crop.w,crop.h,x-dw*.5,y-dh+2,dw,dh);return;}
 const R=rng(seed),lean=(R()-.5)*w*.16,bark=type===3?'#718494':type===1?'#785a68':'#626c63';
 // Unequal crowns overlap around fork ends, with intentional windows between the lower branches.
 const nodes=[[-.30,-.65,.46,.82],[-.09,-.84,.48,.97],[.22,-.73,.49,.91],[.35,-.48,.35,.88],[-.24,-.43,.32,.88]];
 dn10Crown(c,x+lean,y-h*.65,w*.42,w*.49,[pal[0],pal[0],pal[1],pal[2]],seed+1,.7);
 for(let j=0;j<5;j++){const side=j<2?-1:1,rx=x+side*(w*.18+j%3*w*.055),ry=y-2;dn10Limb(c,x,y-39,x+side*w*.05,y-8,rx-side*20,y-3,rx,ry,w*.095,1,bark,seed+10+j);}
 for(let i=0;i<nodes.length;i++){const a=nodes[i],xx=x+a[0]*w,yy=y+a[1]*h,sy=y-h*[.34,.52,.48,.26,.22][i],sx=x+lean*.5;dn10Limb(c,sx,sy,sx+(xx-sx)*.2,sy-h*.11,xx-(xx-sx)*.22,yy+h*.12,xx,yy,w*(.075-i*.008),1.2,bark,seed+50+i);for(let j=0;j<2;j++){const ex=xx+(j?-1:1)*w*.065,ey=yy-h*.05;dn10Limb(c,xx,yy+h*.08,xx,yy+h*.02,ex,ey+h*.02,ex,ey,w*.018,.4,bark,seed+80+i*3+j);}}
 dn10Limb(c,x,y,x+w*.035,y-h*.28,x-w*.08,y-h*.53,x+lean,y-h*.82,w*.16,4,bark,seed+30);
 for(let i=0;i<nodes.length;i++){const a=nodes[i],xx=x+a[0]*w,yy=y+a[1]*h,ww=w*a[2],hh=ww*a[3];dn10Crown(c,xx,yy,ww,hh,pal,seed+100+i,1);
  if(type===0){for(let j=0;j<7;j++){const sx=xx+(j-3)*ww*.09,sy=yy+hh*.17,len=25+R()*h*.13;c.strokeStyle=dn10Mix(pal[1],'#8aaf8b',.25);c.globalAlpha=.65;c.lineWidth=.8;c.beginPath();c.moveTo(sx,sy);c.quadraticCurveTo(sx-10,sy+len*.55,sx+Math.sin(j)*7,sy+len);c.stroke();c.globalAlpha=1;for(let k=1;k<6;k++){const ly=sy+len*k/6;dn10Petal(c,sx+Math.sin(j)*k,ly,5+R()*3,1.3,(j%2?-.4:.3),pal[2]);}}}
  if(type===1){for(let j=0;j<11;j++){const a=R()*Math.PI*2,r=R()*.4,fx=xx+Math.cos(a)*ww*r,fy=yy+Math.sin(a)*hh*r;dn10Petal(c,fx,fy,5.5,2.4,-.25,'#f8c1ce');dn10Petal(c,fx+1,fy,4,2,.35,'#ffe6d1');}}
  if(type===3){for(let j=0;j<4;j++){const fx=xx+(j-1.5)*ww*.15,fy=yy+hh*.25;c.strokeStyle='#a7c6bd';c.lineWidth=.7;c.beginPath();c.moveTo(fx,fy);c.lineTo(fx,fy+17);c.stroke();c.fillStyle=j%2?'#b5e9de':'#dfd9f5';c.beginPath();c.moveTo(fx,fy+15);c.lineTo(fx+4,fy+23);c.lineTo(fx,fy+32);c.lineTo(fx-4,fy+23);c.closePath();c.fill();}}
 }
 // A bark knot and low moss tie the trunk to the soil, without an oval pedestal.
 c.save();c.translate(x+w*.012,y-h*.25);c.rotate(-.16);c.strokeStyle='rgba(31,42,47,.45)';c.lineWidth=2;c.beginPath();c.ellipse(0,0,w*.027,h*.033,0,0,Math.PI*2);c.stroke();c.strokeStyle='rgba(232,210,161,.3)';c.lineWidth=1;c.beginPath();c.ellipse(-2,-1,w*.016,h*.023,0,0,Math.PI*2);c.stroke();c.restore();
 for(let j=0;j<9;j++)dn10Petal(c,x+(R()-.5)*w*.4,y,7+R()*9,2.5,(R()-.5)*1.6,pal[1]);
}
function dn10TreeArt(){
 const im=dn10Cv(660,720),c=im.getContext('2d');
 if(DN10_TREE_IMAGE&&DN10_TREE_IMAGE.complete&&DN10_TREE_IMAGE.naturalWidth){c.drawImage(DN10_TREE_IMAGE,90,15,480,720);return im;}
 dn10BotanicalTree(c,330,716,550,650,['#153f4d','#286a68','#6baa87','#c4d69e'],10101,0);return im;
}
function dn10HourArt(){const im=dn10Cv(70,116),c=im.getContext('2d');dn10GlowArt(c,'#ffdb94',35,60,34,.35);c.fillStyle='rgba(207,242,239,.22)';c.beginPath();c.moveTo(16,22);c.bezierCurveTo(13,42,25,48,31,57);c.bezierCurveTo(24,69,13,76,16,96);c.lineTo(54,96);c.bezierCurveTo(57,76,46,69,39,57);c.bezierCurveTo(45,48,57,42,54,22);c.closePath();c.fill();c.strokeStyle='#daeff0';c.lineWidth=1.7;c.stroke();c.fillStyle='#f7d58f';c.beginPath();c.moveTo(20,30);c.lineTo(50,30);c.lineTo(35,53);c.closePath();c.fill();c.beginPath();c.moveTo(19,91);c.quadraticCurveTo(35,72,51,91);c.closePath();c.fill();dn10Stroke(c,'#fff0b8',1,[35,55,35,79]);for(const y of [17,98]){dn10Ellipse(c,35,y,25,6,'#9c8b95');dn10Ellipse(c,35,y-2,24,3,'#edcc92');}c.strokeStyle='#f1d696';c.lineWidth=2;c.beginPath();c.arc(35,11,5,Math.PI,0);c.stroke();return im;}
function dn10FlowerArt(v){
 const im=dn10Cv(440,440),c=im.getContext('2d'),col=DN10_COL[v%4];c.lineCap='round';c.strokeStyle='#527c8d';c.lineWidth=10;c.beginPath();c.moveTo(230,438);c.bezierCurveTo(170,360,280,290,220,190);c.stroke();
 dn10Petal(c,221,352,95,32,-.95,'#75bdb2');dn10Petal(c,227,323,80,26,1.1,'#9dd7c1');dn10Petal(c,218,400,66,20,-1.55,'#779fa8');
 dn10GlowArt(c,col,220,164,153,.17);c.save();c.translate(220,165);
 for(let k=0;k<11;k++){const a=k*Math.PI*2/11;dn10Petal(c,Math.sin(a)*10,Math.cos(a)*10,118,32,a,col);c.save();c.rotate(a);dn10Ellipse(c,-9,-77,2,3.3,'rgba(255,253,232,.6)',-.3);dn10Ellipse(c,7,-92,1.2,2,'rgba(255,253,232,.48)',.2);c.strokeStyle='rgba(255,251,235,.14)';c.lineWidth=.8;c.beginPath();c.moveTo(-5,-24);c.quadraticCurveTo(-21,-58,-8,-94);c.stroke();c.restore();}
 for(let k=0;k<8;k++){const a=k*Math.PI/4+.25;dn10Petal(c,Math.sin(a)*4,Math.cos(a)*4,77,24,a,v===1?'#d7fff0':v===2?'#fff2d2':'#e5d9ff');}
 dn10Ellipse(c,0,0,33,27,'#a78c95');dn10Ellipse(c,-2,-5,30,22,'#f4d89f');for(let k=0;k<22;k++){const a=k*2.4,r=Math.sqrt(k/22)*22;dn10Ellipse(c,Math.cos(a)*r,Math.sin(a)*r-4,2.3,2.3,k%3?'#fff6cf':'#c79866');}c.restore();return im;
}
function dn10IslandArt(){
 const im=dn10Cv(490,300),c=im.getContext('2d');let q=c.createLinearGradient(0,70,0,260);q.addColorStop(0,'#9b9cb3');q.addColorStop(.45,'#797e9b');q.addColorStop(1,'#c2bfd5');c.fillStyle=q;c.beginPath();c.moveTo(35,85);c.bezierCurveTo(80,130,160,154,198,238);c.quadraticCurveTo(245,285,275,218);c.bezierCurveTo(325,168,380,138,455,85);c.closePath();c.fill();
 c.strokeStyle='rgba(208,211,230,.35)';c.lineWidth=2;for(let j=0;j<6;j++){c.beginPath();c.moveTo(80+j*48,110);c.quadraticCurveTo(130+j*27,150,210+j*13,220);c.stroke();}
 dn10Ellipse(c,245,84,212,48,'#77b6b2');dn10Ellipse(c,245,75,207,38,'#aad9ca');dn10Ellipse(c,235,63,185,27,'#cae8d2');
 for(let i=0;i<9;i++){let x=70+i*44;c.strokeStyle='#b4d8ca';c.lineWidth=2;c.beginPath();c.moveTo(x,112);c.bezierCurveTo(x-25,150,x+20,175,x-3,220-i%3*12);c.stroke();for(let k=0;k<3;k++)dn10Petal(c,x+(k%2?-5:3),140+k*23,19,7,k%2?-1:1,'#b4dcca');}
 const R=rng(10230);for(let i=0;i<60;i++){const x=65+R()*360,y=50+R()*42;dn10Petal(c,x,y,8+R()*12,3,(R()-.5)*1.5,i%3?'#6aafaa':'#d5ecd0');}
 return im;
}
function dn10ArchArt(){
 const im=dn10Cv(560,570),c=im.getContext('2d');c.lineCap='round';c.strokeStyle='#727e9c';c.lineWidth=38;c.beginPath();c.moveTo(70,565);c.bezierCurveTo(75,320,45,150,160,85);c.bezierCurveTo(285,15,450,105,477,235);c.stroke();c.strokeStyle='#b5c8cb';c.lineWidth=21;c.beginPath();c.moveTo(66,565);c.bezierCurveTo(71,320,41,150,156,85);c.bezierCurveTo(281,15,446,105,473,235);c.stroke();c.strokeStyle='#e3dbc2';c.lineWidth=2.2;c.beginPath();c.moveTo(65,550);c.bezierCurveTo(65,325,42,142,157,78);c.bezierCurveTo(287,13,455,112,480,241);c.stroke();
 // Taşın üzerindeki zaman işaretleri sayılar değildir: tohum, dalga, güneş.
 for(let k=0;k<8;k++){const a=3.4+k*.23,x=278+205*Math.cos(a),y=271+205*Math.sin(a);c.save();c.translate(x,y);c.rotate(a);dn10Ellipse(c,0,0,6,3,'#eddfad');c.restore();}
 const R=rng(10444);for(let k=0;k<25;k++){const x=45+R()*47,y=190+R()*370;dn10Petal(c,x,y,20+R()*15,8,(R()-.5)*2,'#92c6b9');}return im;
}
function dn10DistantTree(){const im=dn10Cv(800,760),c=im.getContext('2d');dn10BotanicalTree(c,400,750,650,660,['#626e8e','#79859e','#a0b1bc','#c3d1ce'],10191,3);return im;}
function dn10Art(){if(DN10.art)return DN10.art;return DN10.art={tree:dn10TreeArt(),hour:dn10HourArt(),flower:[dn10FlowerArt(0),dn10FlowerArt(1),dn10FlowerArt(2)],island:dn10IslandArt(),distant:dn10DistantTree(),moon:dn10MoonArt(),cloud:dn10CloudArt(),bird:dn10BirdArt(),wing:dn10WingArt()};}

// Fixed, hand-composed scenic canvases. Brushwork is built once, never in the animation loop.
function dn10MoonArt(){const im=dn10Cv(180,180),c=im.getContext('2d'),R=rng(107);dn10GlowArt(c,'#d9f5fb',90,90,89,.5);const q=c.createRadialGradient(65,54,5,90,90,59);q.addColorStop(0,'#fffce1');q.addColorStop(.65,'#d2ece6');q.addColorStop(1,'#92b9d3');c.fillStyle=q;c.beginPath();c.arc(90,90,58,0,Math.PI*2);c.fill();for(let i=0;i<35;i++)dn10Ellipse(c,54+R()*72,51+R()*79,2+R()*8,1+R()*4,'rgba(98,133,168,.14)',-.4);return im;}
function dn10CloudArt(){const im=dn10Cv(540,180),c=im.getContext('2d'),R=rng(121);for(let i=0;i<24;i++){const x=40+R()*465,y=80+R()*38,r=25+R()*48;const q=c.createRadialGradient(x-9,y-14,2,x,y,r);q.addColorStop(0,'rgba(255,236,219,.92)');q.addColorStop(.55,'rgba(206,183,220,.78)');q.addColorStop(1,'rgba(143,150,192,0)');c.fillStyle=q;c.fillRect(x-r,y-r,r*2,r*2);}return im;}
function dn10BirdArt(){const im=dn10Cv(110,75),c=im.getContext('2d');c.save();c.translate(54,39);let q=c.createLinearGradient(-30,-20,18,19);q.addColorStop(0,'#c4f3de');q.addColorStop(.35,'#4798a1');q.addColorStop(1,'#305579');dn10Petal(c,-21,3,42,9,-1.85,'#5782b2');c.fillStyle=q;c.beginPath();c.ellipse(0,0,24,15,-.17,0,Math.PI*2);c.fill();dn10Ellipse(c,14,-11,14,14,'#63aeb5');dn10Ellipse(c,5,7,17,8,'#f8d2a0',-.2);dn10Ellipse(c,18,-13,3.6,3.6,'#faf2d6');dn10Ellipse(c,19,-13,1.8,2.2,'#243b55');c.fillStyle='#d9ad6e';c.beginPath();c.moveTo(27,-9);c.lineTo(40,-5);c.lineTo(27,-3);c.fill();c.restore();return im;}
function dn10WingArt(){const im=dn10Cv(62,82),c=im.getContext('2d');c.translate(30,76);for(let i=0;i<5;i++)dn10Petal(c,-6+i*3,0,45+i*5,8,-.35+i*.11,['#33617f','#477d98','#6aa7ad','#b5e0ce','#79b8bc'][i]);return im;}
function dn10Rock(c,x,y,w,h,col,seed){
 const R=rng(seed),pts=[];for(let i=0;i<11;i++){const a=i*Math.PI*2/11,rr=.8+R()*.2;pts.push([x+Math.cos(a)*w*.5*rr,y+Math.sin(a)*h*.5*rr]);}
 c.save();c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<=pts.length;i++){const a=pts[(i-1)%pts.length],b=pts[i%pts.length];c.quadraticCurveTo(a[0],a[1],(a[0]+b[0])*.5,(a[1]+b[1])*.5);}c.closePath();const q=c.createLinearGradient(x-w*.3,y-h*.5,x+w*.3,y+h*.5);q.addColorStop(0,dn10Mix(col,'#fff0c2',.35));q.addColorStop(.32,col);q.addColorStop(.7,dn10Mix(col,'#202b4c',.28));q.addColorStop(1,dn10Mix(col,'#17243d',.55));c.fillStyle=q;c.fill();c.clip();
 for(let j=0;j<7;j++){c.strokeStyle=j%2?'rgba(229,239,210,.13)':'rgba(19,40,62,.18)';c.lineWidth=1+R()*3;c.beginPath();c.moveTo(x-w,y-h*.35+j*h*.13);c.bezierCurveTo(x-w*.2,y-h*.5+j*h*.13,x+w*.2,y-h*.3+j*h*.13,x+w,y-h*.4+j*h*.13);c.stroke();}
 for(let j=0;j<75;j++){const xx=x+(R()-.5)*w,yy=y+(R()-.5)*h;c.fillStyle=j%3?'rgba(227,242,216,.08)':'rgba(19,32,57,.12)';c.fillRect(xx,yy,1+R()*3,1+R()*2);}c.restore();
}
function dn10Brush(c,x,y,w,h,pal,seed,n=75){
 // Deep compact volumes with tiny edge detail replace large scattered leaf chips.
 if(h<w*.32){const count=Math.max(3,Math.ceil(w/Math.max(22,h*.9)));for(let i=0;i<count;i++){const xx=x-w*.43+i*w*.86/Math.max(1,count-1),hh=h*(.65+dn10Hash(seed+i)*.35);dn10Crown(c,xx,y+Math.sin(i*1.7)*h*.12,w/count*1.35,hh,pal,seed+i,.6);}return;}
 dn10Crown(c,x-w*.2,y+h*.1,w*.6,h*.77,[pal[0],pal[0],pal[1],pal[2]],seed,.8);
 dn10Crown(c,x+w*.2,y+h*.07,w*.64,h*.82,pal,seed+1,.8);
 dn10Crown(c,x-w*.07,y-h*.15,w*.67,h*.9,pal,seed+2,.9);
}
function dn10Root(c,x,y,w,h,col,mirror=1){
 c.save();c.translate(x,y);c.scale(mirror,1);
 for(let i=0;i<4;i++){const side=i%2?1:-1,rx=side*w*(.78+i*.12);dn10Limb(c,0,-h*.1,side*w*.14,-h*.025,rx*.75,-5,rx,0,w*.33,2,col,910+i);}
 for(let i=0;i<3;i++){const side=i%2?1:-1,sy=-h*(.43+i*.17),ex=side*w*(1.3+i*.2),ey=sy-h*.16;dn10Limb(c,0,sy,side*w*.3,sy-h*.04,ex*.7,ey,ex,ey,w*(.34-i*.05),2,col,930+i);}
 dn10Limb(c,0,0,-w*.18,-h*.32,w*.15,-h*.65,w*.12,-h,w*1.15,w*.22,col,920);
 c.restore();
}
function dn10GlassSpire(c,x,y,w,h){const q=c.createLinearGradient(x-w*.5,y,x+w*.5,y);q.addColorStop(0,'rgba(60,171,190,.3)');q.addColorStop(.28,'rgba(202,255,242,.68)');q.addColorStop(.43,'rgba(103,217,222,.32)');q.addColorStop(1,'rgba(62,130,174,.4)');c.fillStyle=q;c.beginPath();c.moveTo(x-w*.5,y);c.quadraticCurveTo(x-w*.15,y-h*.55,x,y-h);c.quadraticCurveTo(x+w*.25,y-h*.45,x+w*.5,y);c.closePath();c.fill();c.strokeStyle='rgba(213,255,249,.6)';c.lineWidth=1.3;c.beginPath();c.moveTo(x-w*.35,y-7);c.quadraticCurveTo(x-w*.1,y-h*.5,x,y-h);c.stroke();}
function dn10FramingTrees(c,left,right){
 // Full illustrated silhouettes reach below the path edge: connected roots, clear central doorway.
 const pal=['#365c66','#6c9c82','#a9c9a0','#e2e5af'];
 c.save();c.globalAlpha=.91;dn10BotanicalTree(c,235,816,365,720,pal,180,left);dn10BotanicalTree(c,1045,816,365,700,pal,181,right);c.restore();
}
function dn10Scene(v){
 if(DN10.scenes[v])return DN10.scenes[v];const im=dn10Cv(1280,800),c=im.getContext('2d'),R=rng(11000+v*103),P=DN10_PAL[v];
 if(v===0){
  // The entrance is a living root cathedral, not an empty strip between generic trees.
  dn10GlowArt(c,'#ffdda0',690,310,330,.3);if(DN10_SEASON_IMAGE)dn10FramingTrees(c,0,1);else{dn10Root(c,190,795,130,800,'#5b786e');dn10Root(c,1120,795,135,750,'#536c76',-1);
  c.strokeStyle='#4c6a68';c.lineWidth=50;c.lineCap='round';c.beginPath();c.moveTo(170,240);c.bezierCurveTo(380,55,820,40,1120,180);c.stroke();c.strokeStyle='#98b298';c.lineWidth=14;c.stroke();
  for(let i=0;i<9;i++)dn10Brush(c,170+i*118,120+Math.sin(i*.67)*65,220,145,['#284d60','#527d78','#82af91','#bbcc9f'],110+i,55);
  for(let i=0;i<16;i++){const x=175+i*62,y=230+Math.sin(i*.8)*50;c.strokeStyle='rgba(145,187,146,.58)';c.lineWidth=2;c.beginPath();c.moveTo(x,y-60);c.quadraticCurveTo(x+22,y-5,x-10,y+95);c.stroke();for(let j=0;j<4;j++)dn10Petal(c,x-7+j%2*8,y+j*23,18,6,j%2?1.1:-1,'#9bbfa0');}
  }
  for(let i=0;i<8;i++)dn10Rock(c,120+i*155,778,170,80,'#578783',120+i);
  if(!DN10_SEASON_IMAGE){dn10Brush(c,110,705,240,170,['#1d4b57','#387c73','#72b898','#bcd9a7'],140,75);dn10Brush(c,1170,709,250,150,['#314e66','#557e85','#8ab8a4','#d3dfa9'],141,75);}
 }else if(v===1){
  // Aquamarine grotto: sculpted, tilted strata surround a clear activity stage.
  dn10GlowArt(c,'#88f5df',650,350,330,.11);
  for(let side=0;side<2;side++)for(let i=0;i<8;i++){const x=side?1090+Math.sin(i)*53:170+Math.cos(i)*50,y=85+i*98;dn10Rock(c,x,y,340-i%3*25,185,'#347c85',210+side*20+i);}
  for(let i=0;i<8;i++)dn10Rock(c,210+i*130,100+Math.sin(i*.7)*45,200,160,'#3f8c91',260+i);
  for(let i=0;i<9;i++){const x=240+i*95,y=160+Math.sin(i)*27;dn10GlassSpire(c,x,y,18+R()*25,70+R()*75);dn10Brush(c,x,y-55,110,30,['#255a62','#3c8a7d','#7fba93','#b7e0b1'],280+i,18);}
  for(let i=0;i<6;i++){const x=i<3?135+i*48:1080+(i-3)*40;dn10GlassSpire(c,x,770,35+R()*24,120+R()*100);}
  for(let i=0;i<14;i++){const xx=210+i*64,yy=780+Math.sin(i*.7)*9;dn10Rock(c,xx,yy,92,32,'#427e83',290+i);}

 }else if(v===2){
  // One warm fox clearing, sheltered by a hollow elder and a blossom bower.
  dn10GlowArt(c,'#ffcd8b',640,330,300,.1);if(DN10_SEASON_IMAGE)dn10FramingTrees(c,1,2);else{dn10Root(c,190,790,180,665,'#806d6a');dn10Root(c,1130,790,150,750,'#6b5a68',-1);
  c.fillStyle='#354757';c.beginPath();c.ellipse(197,680,64,96,0,0,Math.PI*2);c.fill();c.strokeStyle='#b7ac87';c.lineWidth=14;c.stroke();dn10GlowArt(c,'#f7cf93',197,705,68,.24);
  for(let i=0;i<7;i++)dn10Brush(c,120+i*180,135+Math.sin(i*.6)*55,260,190,['#5f465e','#9b7182','#c89c94','#efd1a5'],310+i,80);
  dn10Brush(c,220,667,280,160,['#3f665a','#7ca178','#a8c494','#e1dda3'],330,100);dn10Brush(c,1110,670,260,160,['#5d526e','#998196','#c9aaa8','#ffe0b1'],331,95);
  }
  for(let i=0;i<10;i++)dn10Rock(c,110+i*120,785,145,48,'#768e78',340+i);
  // Seed cushions and weathered roots imply a soft play place, without a platform barrier.
  for(let i=0;i<5;i++){const x=250+i*190;dn10Ellipse(c,x,770,70,18,'#6d9079');dn10Ellipse(c,x-5,763,60,12,'#b4c89a');}
 }else if(v===3){
  // Four seasons live together on terraced banks: mint spring, rose summer, amber autumn, icy winter.
  dn10GlowArt(c,'#ffd9ad',620,340,310,.1);
  const cols=[['#365c66','#6c9c82','#a9c9a0','#e2e5af'],['#674769','#aa7395','#dcacc0','#ffe0cd'],['#725158','#b58370','#e6b77e','#ffdfab'],['#3e617f','#7fa2bc','#b5cbd8','#eef0db']];
  for(let k=0;k<4;k++){const x=170+k*300;dn10BotanicalTree(c,x,810,290,590+(k%2)*45,cols[k],400+k,k);}
  // A few upright weathered boulders frame the garden, with moss rooted along their bases.
  for(let side=0;side<2;side++){const xx=side?1110:165;dn10Rock(c,xx,745,135,110,'#426d70',451+side);dn10Rock(c,xx+(side?-73:73),776,98,58,'#5c8179',455+side);dn10Brush(c,xx+(side?47:-47),764,165,92,cols[side?2:0],470+side,45);}
  for(let i=0;i<20;i++){const xx=190+R()*900,yy=770+R()*18;dn10Petal(c,xx,yy,11+R()*14,5,-.4+R(),DN10_COL[i%4]);}

 }else if(v===4){
  // The memory lake has its own architecture: open stone observatory, brass orbit and deep water.
  dn10GlowArt(c,'#a6e7ef',650,390,310,.08);
  const water=c.createLinearGradient(0,675,0,790);water.addColorStop(0,'#195e7d');water.addColorStop(1,'#16364e');c.fillStyle=water;c.beginPath();c.moveTo(100,761);c.bezierCurveTo(285,681,455,747,610,712);c.bezierCurveTo(810,667,1050,723,1190,763);c.lineTo(1190,799);c.lineTo(100,799);c.closePath();c.fill();
  for(let i=0;i<18;i++){const xx=130+i*60,yy=770+Math.sin(i*.8)*9;dn10Rock(c,xx,yy,86,29,'#517978',570+i);}c.strokeStyle='rgba(141,222,221,.4)';c.lineWidth=1.2;for(let i=0;i<14;i++){const xx=300+R()*650,yy=724+R()*40;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+15+R()*45,yy);c.stroke();}
  for(let side=0;side<2;side++){const x=side?1130:150;for(let i=0;i<7;i++)dn10Rock(c,x+(i%2)*12,750-i*74,135-i*5,105,'#607f9b',510+side*10+i);dn10Rock(c,x,226,180,75,'#9aabb6',530+side);}
  c.lineCap='round';c.strokeStyle='#536b88';c.lineWidth=35;c.beginPath();c.moveTo(158,247);c.bezierCurveTo(370,42,895,42,1130,247);c.stroke();c.strokeStyle='#c4c3a4';c.lineWidth=5;c.stroke();
  c.strokeStyle='rgba(223,205,150,.68)';c.lineWidth=2;c.beginPath();c.ellipse(640,260,380,177,-.2,Math.PI,Math.PI*2);c.stroke();for(let i=0;i<12;i++){const a=Math.PI+i*Math.PI/11;dn10Ellipse(c,640+Math.cos(a)*380,260+Math.sin(a)*177,4,4,'#f1dba6');}
  // One telescope off to the side; the three memories remain the only large central circles.
  c.save();c.translate(1125,650);c.rotate(-.42);c.fillStyle='#6c8b9d';c.fillRect(-60,-15,118,32);c.fillStyle='#c4c3a0';c.fillRect(-64,-20,13,42);c.fillRect(49,-19,12,40);dn10Ellipse(c,-61,0,5,15,'#c3edf0');c.restore();dn10Stroke(c,'#899d9e',8,[1118,665,1090,764]);dn10Stroke(c,'#899d9e',7,[1118,665,1156,764]);
  dn10Brush(c,95,723,180,130,['#294f68','#497c8a','#7ea6a3','#c1cfb5'],550,60);dn10Brush(c,1190,736,155,125,['#294f68','#497c8a','#7ea6a3','#c1cfb5'],551,50);
 }else if(v===5){
  // The ride looks down on the valley: broken floating cliffs are scenery, never collision.
  for(let i=0;i<5;i++){const x=80+i*290,y=620+(i%2)*105;c.globalAlpha=.25+i*.1;c.drawImage(dn10Art().island,x-140,y,280,171);c.drawImage(dn10Art().cloud,x-220,y+60,460,153);}c.globalAlpha=1;
 }else{
  // A forest cathedral frames the foreground time tree. Its actual trunk and crown belong to the activity.
  dn10GlowArt(c,'#fff0bb',635,370,390,.35);if(DN10_SEASON_IMAGE)dn10FramingTrees(c,0,3);else{dn10Root(c,110,800,180,900,'#665e6b');dn10Root(c,1170,800,180,870,'#5f6c75',-1);
  c.strokeStyle='#60566a';c.lineWidth=60;c.lineCap='round';c.beginPath();c.moveTo(90,195);c.bezierCurveTo(320,70,890,35,1200,180);c.stroke();c.strokeStyle='#b1ae96';c.lineWidth=15;c.stroke();
  for(let i=0;i<9;i++)dn10Brush(c,70+i*145,130+Math.sin(i*.75)*48,240,160,['#4b486b','#7f7c97','#b9afa9','#e3d7b4'],610+i,75);
  for(let side=0;side<2;side++){const x=side?1130:150;dn10Brush(c,x,629,250,260,['#314f64','#63877d','#a0b69a','#e8dfae'],640+side,95);for(let i=0;i<4;i++){c.strokeStyle=i%2?'#9fae91':'#4d726f';c.lineWidth=16-i*2;c.beginPath();c.moveTo(x,685);c.bezierCurveTo(x+(side?-100:100),745,x+(side?-90:90)-i*17,760,x+(side?-170:170)-i*24,791);c.stroke();}}
  }
  for(let i=0;i<9;i++)dn10Rock(c,120+i*130,793,165,65,'#7f9889',660+i);
 }
 // Fine colour variation is painted into materials, not an opaque haze over the scene.
 DN10.scenes[v]=im;return im;
}
const DN10_SCENE_X=[860,90*T+20,156.5*T+20,270*T+20,365*T+20,421*T,460*T+20];
function dn10Scenery(){for(let i=0;i<DN10_SCENE_X.length;i++){const x=DN10_SCENE_X[i];if(x+660<cam.x||x-660>cam.x+VW)continue;g.drawImage(dn10Scene(i),x-640,720-800,1280,800);}}
const DN10_BIRDS=[[16,-320,1.1],[108,-255,.9],[145,-265,1],[178,-190,.8],[251,-260,1],[296,-235,.85],[350,-270,.85],[384,-220,1],[412,-210,.9],[437,-240,1],[476,-250,1.1]];
function dn10Birds(){const A=DN10.art;for(let i=0;i<DN10_BIRDS.length;i++){const b=DN10_BIRDS[i],demo=i===0&&DN10_DEMO.started;if(i===0&&!demo)continue;const x0=demo?DN10_DEMO.x:nx(b[0]);if(x0<cam.x-180||x0>cam.x+VW+180)continue;const alive=dn10BolgeUyanis(x0),local=dn10BolgeSaat(x0),t=local+(demo?DN10_DEMO.pose:0),x=demo?x0-95+DN10_DEMO.pose*90+Math.sin(local*.7)*65*alive:x0+Math.sin(t*.7+i)*65*alive,y=720+b[1]+Math.sin(t*1.3+i)*17*(demo?1:alive),k=b[2]*(demo?.9:.66),wing=-.9+Math.sin(t*8+i*.7)*.65;
 if(demo&&DN10_DEMO.emitted&&alive<.04){g.strokeStyle='rgba(250,230,174,.33)';g.lineWidth=1.5;g.beginPath();g.moveTo(x-65,y+4);g.lineTo(x-42,y+2);g.moveTo(x-58,y+14);g.lineTo(x-38,y+11);g.stroke();}
 g.save();if(demo)g.globalAlpha=clamp(DN10_DEMO.t/.25,0,1);g.translate(x,y);g.scale(k,k);g.save();g.rotate(wing);g.drawImage(A.wing,-30,-76,62,82);g.restore();g.drawImage(A.bird,-54,-39,110,75);g.restore();}}
const DN10_CW=960,DN10_CY=600;
function dn10Chunk(index){
 let hit=DN10.chunks.get(index);if(hit){hit.dn10Used=++DN10.chunkTick;return hit;}
 const cv=dn10Cv(DN10_CW+2,620),c=cv.getContext('2d'),R=rng(10170+index*43),x0=index*DN10_CW;c.translate(-x0,-DN10_CY);
 // The collision top stays perfectly walkable; the painted bank has soil, stone and roots.
 c.save();c.beginPath();c.rect(x0,720,DN10_CW+2,500);c.clip();
 for(let xx=x0;xx<x0+DN10_CW+2;xx+=40){const ph=dn10ScenePhase(xx+20),v=Math.floor(ph),u=ph-v,top=dn10Mix(DN10_PAL[v][4],DN10_PAL[Math.min(6,v+1)][4],u),q=c.createLinearGradient(0,710,0,1200);q.addColorStop(0,dn10Mix(top,'#284e43',.65));q.addColorStop(.12,'#283e3c');q.addColorStop(.55,'#263238');q.addColorStop(1,'#1a2633');c.fillStyle=q;c.fillRect(xx,720,41,500);}
 for(let i=0;i<48;i++){const xx=x0+R()*DN10_CW,yy=760+R()*400,rx=18+R()*75,ry=8+R()*32;dn10Ellipse(c,xx,yy,rx,ry,i%3?'rgba(173,180,158,.09)':'rgba(11,29,48,.16)',R()*.5);}
 for(let i=0;i<14;i++){const yy=768+i*28;c.strokeStyle=i%2?'rgba(190,187,156,.11)':'rgba(14,28,45,.2)';c.lineWidth=1.5;c.beginPath();c.moveTo(x0,yy);for(let xx=x0;xx<=x0+DN10_CW+5;xx+=35)c.lineTo(xx,yy+Math.sin(xx*.007+i*.7)*12);c.stroke();}
 for(let i=0;i<8;i++){const xx=x0+R()*DN10_CW;c.strokeStyle=i%2?'rgba(166,165,128,.19)':'rgba(17,39,49,.32)';c.lineWidth=3+R()*5;c.beginPath();c.moveTo(xx,724);c.bezierCurveTo(xx-40,786,xx+50,850,xx-30,920+R()*130);c.stroke();}
 for(let i=0;i<2300;i++){c.fillStyle=i%3?'rgba(223,230,196,.04)':'rgba(8,22,39,.08)';c.fillRect(x0+R()*DN10_CW,720+R()*500,1+R()*2,1+R());}c.restore();
 // A broken mineral rim and soft moss replace the old ruler-straight turquoise line.
 const a=Math.max(0,Math.floor(x0/T)),b=Math.min(COLS-1,Math.floor((x0+DN10_CW)/T));
 for(let j=a;j<=b;j++){const x=j*T,ph=dn10ScenePhase(x),v=Math.floor(ph),u=ph-v,col=dn10Mix(DN10_PAL[v][4],DN10_PAL[Math.min(6,v+1)][4],u),moss=dn10Mix(col,'#8bc99c',.36);c.fillStyle=col;c.fillRect(x,720,T+1,10);
  c.fillStyle=moss;c.beginPath();c.moveTo(x,721);c.quadraticCurveTo(x+8,716+Math.sin(j)*2,x+20,720);c.quadraticCurveTo(x+31,723,x+41,720);c.lineTo(x+41,727);c.quadraticCurveTo(x+20,732,x,727);c.fill();
  c.strokeStyle='rgba(234,226,181,.3)';c.lineWidth=1;c.beginPath();c.moveTo(x+3,721);c.quadraticCurveTo(x+15,719,x+28,721);c.stroke();
  if(j%4===0){dn10Rock(c,x+20,720,25+R()*17,12+R()*7,'#5b8175',700+j);}
  for(let i=0;i<5;i++){const xx=x+R()*T,h=8+R()*24;dn10Petal(c,xx,723,h,2.3,(R()-.5)*1.3,i%2?moss:'#32836d');}
 }
 for(let i=0;i<22;i++){const xx=x0+20+R()*(DN10_CW-40),yy=716,hh=5+R()*17;if(xx<0||xx>=COLS*T)continue;const col=DN10_COL[i%4];c.strokeStyle='#3b856c';c.lineWidth=1.5;c.beginPath();c.moveTo(xx,yy);c.quadraticCurveTo(xx-4,yy-hh*.5,xx,yy-hh);c.stroke();for(let k=0;k<5;k++)dn10Ellipse(c,xx+Math.cos(k*1.257)*3.2,yy-hh+Math.sin(k*1.257)*3.2,3,2.2,col,k*1.257);dn10Ellipse(c,xx,yy-hh,1.8,1.8,'#ffef9d');}

 cv.dn10Used=++DN10.chunkTick;DN10.chunks.set(index,cv);if(DN10.chunks.size>8){let oldest=-1,stamp=Infinity;for(const [key,value] of DN10.chunks)if(value.dn10Used<stamp){stamp=value.dn10Used;oldest=key;}if(oldest>=0)DN10.chunks.delete(oldest);}return cv;
}
// Yedi yaprak basamağı bir kez bulunur; her kare bütün ızgarayı taramak gerekmez.
const DN10_PLAT=[];
for(let r=0;r<ROWS;r++)for(let j=0;j<COLS;j++)if(grid[r][j]===2){let k=j;while(k+1<COLS&&grid[r][k+1]===2)k++;DN10_PLAT.push({x:j*T,w:(k-j+1)*T,y:r*T});j=k;}
function dn10Terrain(){
 const left=Math.max(0,Math.floor(cam.x/DN10_CW)),right=Math.min(Math.ceil(COLS*T/DN10_CW)-1,Math.floor((cam.x+VW)/DN10_CW));
 for(let i=left;i<=right;i++)g.drawImage(dn10Chunk(i),i*DN10_CW,DN10_CY);
 // Bonus yaprak basamakları yumuşak ay biçiminde; zemindeki güvenli yolu hiç kesmez.
 for(const p of DN10_PLAT){const x=p.x,w=p.w,y=p.y;if(x+w<cam.x-T||x>cam.x+VW+T)continue;g.fillStyle='#6b9fa9';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+w*.5,y+52,x+w,y);g.closePath();g.fill();g.strokeStyle='#d9e6c5';g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+w*.5,y+4,x+w,y);g.stroke();g.strokeStyle='rgba(220,240,219,.4)';g.lineWidth=1;for(let v=1;v<5;v++){g.beginPath();g.moveTo(x+w*.5,y+22);g.lineTo(x+w*v/5,y+3);g.stroke();}}
}
const DN10_MOTES=Array.from({length:46},(_,i)=>({u:dn10Hash(i*3.1),v:dn10Hash(i*8.7),r:.5+dn10Hash(i*2.9)*1.7,z:.3+dn10Hash(i*.7)*1.15,ph:dn10Hash(i*4.5)*6.28}));
const DN10_STEPS=Array.from({length:28},()=>({x:0,y:0,t:-100}));
const DN10_CLOCKS=Array.from({length:6},()=>({v:0,t:0}));
function dn10Zone(x){const c=x/T;return c<130?0:c<237?1:c<328?2:c<390?3:c<445?4:5;}
const DN10_WAKE=Array.from({length:6},()=>({r:-1}));
const DN10_WAKE_X=[90*T,156.5*T,270*T,365*T,419*T,460*T];
function dn10WakeAt(x){const i=dn10Zone(x),w=DN10_WAKE[i];return w.r<0?0:smooth(clamp((w.r-Math.abs(x-DN10_WAKE_X[i]))/150,0,1));}
const DN10_LOCAL_STEP=80,DN10_LOCAL_TIME=new Float64Array(Math.ceil(COLS*T/DN10_LOCAL_STEP)+1);
function dn10BolgeSaat(x){const q=clamp(x/DN10_LOCAL_STEP,0,DN10_LOCAL_TIME.length-1),a=Math.floor(q),b=Math.min(a+1,DN10_LOCAL_TIME.length-1),zone=dn10Zone(x);if(DN10_CLOCKS[zone].v<=0)return 0;const ta=DN10_LOCAL_TIME[a],tb=DN10_LOCAL_TIME[b];if(dn10Zone(a*DN10_LOCAL_STEP)!==zone)return tb;if(dn10Zone(b*DN10_LOCAL_STEP)!==zone)return ta;return lerp(ta,tb,q-a);}
function dn10LocalStep(dt){if(!(dt>0))return;for(let i=0;i<DN10_LOCAL_TIME.length;i++){const x=i*DN10_LOCAL_STEP,q=DN10_CLOCKS[dn10Zone(x)];if(q.v>0)DN10_LOCAL_TIME[i]+=dt*q.v*dn10WakeAt(x);}}
function dn10BolgeUyanis(x){return DN10_CLOCKS[dn10Zone(x)].v*dn10WakeAt(x);}
// The demonstration has a separate clock. It never advances the six sleeping regions.
const DN10_DEMO={t:0,pose:0,started:false,emitted:false,x:0};
function dn10DemoStep(dt){
 if(!(dt>0)||DURUM!=='oyun')return;
 if(!DN10_DEMO.started){
  if((typeof SAHNE!=='undefined'&&SAHNE.aktif&&SAHNE.aktif())||(typeof omPerde!=='undefined'&&omPerde.a>.08)||(P.fade||0)>0)return;
  DN10_DEMO.started=true;DN10_DEMO.x=Math.min(nx(16),cam.x+VW-160);
  // Restored/test positions far from the opening do not replay a hidden demonstration.
  if(Math.abs(P.x-DN10_DEMO.x)>950){DN10_DEMO.t=3;DN10_DEMO.pose=1.5;DN10_DEMO.emitted=true;return;}
 }
 DN10_DEMO.t=Math.min(3,DN10_DEMO.t+dt);DN10_DEMO.pose=clamp(DN10_DEMO.t-.35,0,1.5);
 if(DN10_DEMO.t>=1.85&&!DN10_DEMO.emitted){DN10_DEMO.emitted=true;if(OLAY&&typeof OLAY.emit==='function')OLAY.emit('zamanDondu');}
}
function dn10FreezeDemonstration(){
 const d=DN10_DEMO;if(!d.started||d.x+240<cam.x||d.x-180>cam.x+VW)return;
 const t=d.pose+dn10BolgeSaat(d.x),awake=dn10BolgeUyanis(d.x),frozen=d.emitted&&awake<.04,F=DN10.fx;
 // A splash held at an impossible point in its jump, with clear gaps between the droplets.
 g.fillStyle='rgba(98,191,173,.3)';g.beginPath();g.ellipse(d.x+15,707,108,8,0,0,Math.PI*2);g.fill();
 for(let j=0;j<6;j++){const u=dn10Mod(j/6+.17+t*.36,1),x=d.x-80+u*190,y=700-Math.sin(u*Math.PI)*166,r=7+j%3*1.6;
  if(frozen){g.strokeStyle='rgba(239,229,183,.3)';g.lineWidth=1.3;g.beginPath();g.moveTo(x-14,y+Math.cos(u*Math.PI)*12);g.lineTo(x-7,y+Math.cos(u*Math.PI)*6);g.stroke();}
  g.drawImage(F.drop,x-r,y-r*1.4,r*2,r*2.8);
 }
 // One gold leaf visibly falls, then stops halfway down, beside the suspended splash.
 const leafT=dn10Mod(t,3.4),lx=d.x-120+Math.sin(leafT*2)*18,ly=480+leafT*62;
 if(frozen){g.strokeStyle='rgba(255,231,171,.28)';g.lineWidth=1.4;g.beginPath();g.moveTo(lx-8,ly-50);g.quadraticCurveTo(lx-21,ly-36,lx-10,ly-27);g.stroke();}
 g.save();g.translate(lx,ly);g.rotate(.35+leafT*1.5);g.drawImage(F.leaf[2],-26,-13,52,26);g.restore();
 // A short warm ripple stops motion; it is neither an opaque screen wash nor winter frost.
 if(d.t>1.55&&d.t<2.65){const u=(d.t-1.55)/1.1,r=24+smooth(u)*520;g.globalAlpha=Math.sin(u*Math.PI)*.56;g.strokeStyle='#f5e1a8';g.lineWidth=2.2;g.beginPath();g.ellipse(d.x,550,r,r*.72,0,0,Math.PI*2);g.stroke();g.globalAlpha*=.4;g.lineWidth=6;g.beginPath();g.ellipse(d.x,550,r+8,(r+8)*.72,0,0,Math.PI*2);g.stroke();g.globalAlpha=1;}
}
function dn10WakeWaves(){
 for(let i=0;i<6;i++){const r=DN10_WAKE[i].r;if(r<12||r>2600)continue;const x=DN10_WAKE_X[i];if(x+r<cam.x||x-r>cam.x+VW)continue;g.globalAlpha=.23*Math.min(1,r/100)*clamp((2600-r)/650,0,1);g.strokeStyle='#b5edca';g.lineWidth=1.7;g.beginPath();g.ellipse(x,655,r,85+r*.13,0,0,Math.PI*2);g.stroke();}g.globalAlpha=1;
}
const DN10_PAL=[
 ['#192b49','#3f5d74','#84b5b8','#dbdfb3','#347f86','#e3d6a0'],
 ['#112840','#1f536a','#4a9ea9','#afd8d1','#277e8b','#b3f6e8'],
 ['#392445','#76506b','#cf8d91','#f5d4ab','#758e72','#ffd3a1'],
 ['#4c365f','#a16b93','#e5a6b0','#f4e3b5','#599e87','#ffc8d3'],
 ['#101c42','#284575','#678daf','#b4d4dc','#467e91','#bee9fc'],
 ['#33244f','#785c92','#d79db3','#f8d5b1','#687f9c','#fff0bf'],
 ['#302744','#855d74','#d8aa99','#ffe5b1','#719e8a','#ffe7a9']
];
function dn10SceneIndex(x){const c=x/T;return c<64?0:c<130?1:c<237?2:c<328?3:c<390?4:c<445?5:6;}
const DN10_SCENE_CENTERS=[32,94,178,282,359,419,475];
function dn10ScenePhase(x){const c=x/T,centers=DN10_SCENE_CENTERS;for(let i=0;i<centers.length-1;i++){const mid=(centers[i]+centers[i+1])*.5;if(c<mid+9){if(c<mid-9)return i;return i+smooth(clamp((c-mid+9)/18,0,1));}}return 6;}
function dn10Durum(){
 // Visible pauses stop the valley too. Refresh last even while paused, so resume never catches up.
 const dt=DN10.last===null||DURUM!=='oyun'?0:clamp(now-DN10.last,0,.1);DN10.last=now;DN10.dt=dt;const v=typeof V10!=='undefined'?V10:{};
 const aim=clamp((v.damla||0)/9*.22+(v.tilki||0)/6*.22+(v.bahce||0)/3*.22+(v.kure||0)/3*.22+(v.sandal?1:0)*.12,0,1);
 DN10.awake+=(aim-DN10.awake)*(1-Math.exp(-dt*1.8));const finGoal=v.final?(DN10.finalStarted&&!DN10.finalPeak?.08:1):0;DN10.fin+=(finGoal-DN10.fin)*(1-Math.exp(-dt*.7));
 for(let i=0;i<6;i++){const q=DN10_CLOCKS[i],local=i===0?(v.damla||0)/9:i===1?(v.tilki||0)/6:i===2?(v.bahce||0)/3:i===3?(v.kure||0)/3:i===4?(v.sandal?1:(v.sandalAsama||0)/3):0,goal=Math.max(DN10.finalStarted&&!DN10.finalPeak?0:DN10.fin,clamp(local,0,1));q.v+=(goal-q.v)*(1-Math.exp(-dt*1.7));q.t+=dt*q.v;const wake=DN10_WAKE[i];if(q.v>.00001){if(wake.r<0)wake.r=0;wake.r=Math.min(24000,wake.r+dt*760);}}
 dn10LocalStep(dt);dn10DemoStep(dt);DN10.moteT+=dt*dn10BolgeUyanis(P.x);
 DN10.step+=dt*DN10.awake;
 const target=dn10ScenePhase(P.x);if(!DN10.zoneReady){DN10.zone=target;DN10.zoneReady=true;}else DN10.zone+=(target-DN10.zone)*(1-Math.exp(-dt*1.5));
 if(P.ground&&DURUM==='oyun'&&Math.abs(P.vx||0)>30&&(DN10.walkX===null||Math.abs(P.x-DN10.walkX)>32)){DN10.walkX=P.x;const z=DN10_STEPS[DN10.footIndex||0];z.x=P.x;z.y=P.y;z.t=now;DN10.footIndex=((DN10.footIndex||0)+1)%DN10_STEPS.length;}
}
function dn10Background(tm){
 if(!dn10Ready())return;dn10Durum();const F=dn10Fx(),A=dn10Art(),vw=W/S,vh=H/S,z=clamp(DN10.zone,0,6),zi=Math.floor(z),blend=z-zi;
 g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.globalCompositeOperation='source-over';g.drawImage(dn10Sky(zi),0,0,W,H);if(blend>.005&&zi<6){g.globalAlpha=blend;g.drawImage(dn10Sky(zi+1),0,0,W,H);g.globalAlpha=1;}
 if(DN10.fin>.01&&zi<6){g.globalAlpha=DN10.fin*.55;g.drawImage(dn10Sky(6),0,0,W,H);g.globalAlpha=1;}
 g.setTransform(S,0,0,S,0,0);
 const moon=clamp(1-Math.abs(z-4),0,1),ride=typeof ZAMAN_YOL!=='undefined'&&ZAMAN_YOL.aktif?1:clamp(1-Math.abs(z-5),0,1);
 if(moon>.01){const mx=vw*.74,my=vh*.24;g.globalAlpha=moon*.9;g.drawImage(A.moon,mx-69,my-69,138,138);g.globalAlpha=1;}
 for(let v=0;v<2;v++){const f=v?.22:.1,ww=1600*(v?.75:.95),hh=650*(v?.75:.95),by=vh*(.31+ride*.25)-(cam.y-380)*f,start=-dn10Mod(cam.x*f,ww);g.globalAlpha=v?.64:.38;for(let x=start;x<vw;x+=ww)g.drawImage(dn10Ridge(v),x,by,ww+1,hh);g.globalAlpha=1;}
 // Below the magical ride, the valley becomes a sea of lit clouds and rooted islands.
 if(ride>.01){for(let i=0;i<6;i++){const x=dn10Mod(i*367-cam.x*.13,vw+520)-230,y=vh*(.58+(i%3)*.095);g.globalAlpha=ride*(.55-i%3*.08);g.drawImage(A.cloud,x,y,540,180);if(i%2===0)g.drawImage(A.island,x+140,y-100,245,150);}g.globalAlpha=1;}
 const tx=vw*.67+(BOLUM.zamanAgaci.x-P.x)*.025,ty=vh*.48-(cam.y-380)*.1,sz=.42+clamp(P.x/(COLS*T),0,1)*.2;
 if(tx>-500&&tx<vw+500&&z<.7){g.globalAlpha=.13;g.drawImage(A.distant,tx-400*sz,ty-470*sz,800*sz,760*sz);g.globalAlpha=1;}
 // Only the observatory has celestial rings; elsewhere clear coloured sky opens the composition.
 if(moon>.01){const cx=vw*.65,cy=vh*.26,r=Math.min(vw*.33,vh*.3);g.save();g.translate(cx,cy);g.rotate(-.3+DN10_CLOCKS[3].t*.025);g.strokeStyle='rgba(233,219,172,.34)';g.lineWidth=1;g.globalAlpha=moon;for(let i=0;i<3;i++){g.beginPath();g.ellipse(0,0,r*(1+i*.14),r*(.54+i*.11),i*.43,0,Math.PI*2);g.stroke();}g.restore();g.globalAlpha=1;}
}
const DN10_WATER=DEKOR10.selale.map(()=>({k:0,t:0}));
function dn10FrozenWater(){if(DN10.frozenWater)return DN10.frozenWater;const im=dn10Cv(180,480),c=im.getContext('2d'),drop=dn10Fx().drop;
 // Interrupted liquid ribbons and separate fat drops read as suspended flow, never icicles.
 for(let col=0;col<4;col++)for(let row=0;row<4;row++){const x=25+col*40+Math.sin(row*2+col)*9,y=12+row*116+(col%2)*17;c.strokeStyle='rgba(86,188,194,.32)';c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+12,y+21,x-13,y+39,x+2,y+57);c.stroke();c.strokeStyle='rgba(217,255,233,.7)';c.lineWidth=2.2;c.stroke();const r=6+(row+col)%3*2;c.drawImage(drop,x-r+2,y+71,r*2,r*2.7);c.strokeStyle='rgba(230,237,191,.26)';c.lineWidth=1;c.beginPath();c.moveTo(x-9,y+66);c.lineTo(x-8,y+73);c.stroke();}
 return DN10.frozenWater=im;
}
function dn10WaterRibbon(){if(DN10.waterRibbon)return DN10.waterRibbon;const im=dn10Cv(150,480),c=im.getContext('2d'),q=c.createLinearGradient(0,0,150,0);q.addColorStop(0,'rgba(94,212,220,0)');q.addColorStop(.22,'rgba(144,240,229,.5)');q.addColorStop(.55,'rgba(216,255,244,.58)');q.addColorStop(.8,'rgba(98,190,212,.3)');q.addColorStop(1,'rgba(98,190,212,0)');c.fillStyle=q;c.fillRect(0,0,150,480);return DN10.waterRibbon=im;}
function dn10Waterfalls(tm){
 const F=DN10.fx,L=cam.x-240,R=cam.x+VW+240;
 for(let si=0;si<DEKOR10.selale.length;si++){const [cc,h,w]=DEKOR10.selale[si],x=nx(cc),z=DN10_CLOCKS[dn10Zone(x)],state=DN10_WATER[si];state.k=dn10BolgeUyanis(x);state.t=dn10BolgeSaat(x);if(x+w<L||x-w>R)continue;const y=720-18,k=dn10BolgeUyanis(x),t=dn10BolgeSaat(x);
  dn10Glow('#b7f6ed',x,y-h*.46,w*.8,h*.5,.05+k*.08);
  // A suspended splash is a recognisable solid sculpture before time restarts.
  g.globalAlpha=.8-k*.5;g.drawImage(dn10FrozenWater(),x-w*.5,y-h,w,h);g.globalAlpha=1;
  if(k>.005){g.globalAlpha=k*.5;g.drawImage(dn10WaterRibbon(),x-w*.47,y-h,w*.94,h);g.globalAlpha=1;g.strokeStyle='rgba(218,255,241,.5)';g.lineWidth=1.5;for(let j=0;j<15;j++){const xx=x+(j%5-2)*w*.15,yy=y-h+dn10Mod(j*.137+t*.28,1)*h;g.beginPath();g.moveTo(xx,yy);g.lineTo(xx+Math.sin(j)*3,Math.min(y,yy+15+j%3*6));g.stroke();}}
  for(let j=0;j<8;j++){const q=dn10Mod(j/8+t*.22,1),xx=x+Math.sin(j*2.4)*w*(.3+q*.4),yy=y-12-Math.sin(q*Math.PI)*(38+j%3*18),r=3+j%3;g.globalAlpha=.72;g.drawImage(F.drop,xx-r,yy-r*1.3,r*2,r*2.6);}g.globalAlpha=1;
  g.strokeStyle='rgba(200,246,232,.35)';g.lineWidth=1.3;for(let j=0;j<3;j++){const u=dn10Mod(j/3+t*.23,1);g.globalAlpha=(1-u)*.7;g.beginPath();g.ellipse(x,y+2,w*(.3+u*.6),4+u*11,0,0,Math.PI*2);g.stroke();}g.globalAlpha=1;
 }
}
const DN10_FRUIT_X=[-135,87,175],DN10_FRUIT_Y=[325,435,285];
// Dekor selamı: sabit 17 durum, sayaç/görev yok; tohumlar parçacık listesine eklenmeden çizilir.
const DN10_FLOWERS=DEKOR10.cicek.map(a=>({x:nx(a[0]),y:dn10Surface(nx(a[0])),cc:a[0],k:a[1]*.75,v:a[2],touchAt:-1e9}));
function dn10FlowerAngle(f,lit){const age=now-f.touchAt,bow=age>=0&&age<2.4?Math.sin(age*2.6)*Math.sin(age*Math.PI/2.4)*.075:0;return Math.sin(dn10BolgeSaat(f.x)*.6+f.cc)*.018*dn10BolgeUyanis(f.x)+bow;}
function dn10FlowerTouch(e){
 if(e.button!==0||e.isPrimary===false||DURUM!=='oyun'||P.ucus||typeof V10!=='undefined'&&V10.final||typeof ZAMAN10!=='undefined'&&ZAMAN10.aktif)return;
 const b=cv.getBoundingClientRect(),sx=e.clientX-b.left,sy=e.clientY-b.top;
 if(b.width<=0||b.height<=0||sx<0||sy<0||sx>b.width||sy>b.height||sy<Math.max(88,b.height*.11)&&sx>b.width-Math.max(150,b.width*.16))return;
 const wx=cam.x+sx*cv.width/b.width/S,wy=cam.y+sy*cv.height/b.height/S;
 let hit=null,best=Infinity;
 for(const f of DN10_FLOWERS){if(f.x<cam.x-200||f.x>cam.x+VW+200)continue;const a=dn10FlowerAngle(f,dn10Isik(f.x)),hx=f.x+Math.sin(a)*275*f.k,hy=f.y-Math.cos(a)*275*f.k,dx=(wx-hx)/(122*f.k),dy=(wy-hy)/(128*f.k),d=dx*dx+dy*dy;if(d<1&&d<best){best=d;hit=f;}}
 if(hit&&now-hit.touchAt>=.8)hit.touchAt=now;
 // Pasif dinleyici: yürüme hedefi, parmak yakalama ve ev düğmesinin olaylarına hiç müdahale etmez.
}
cv.addEventListener('pointerdown',dn10FlowerTouch,{passive:true});
function dn10Decor(tm){
 const A=DN10.art,L=cam.x-650,R=cam.x+VW+650;dn10Scenery();
 // Small, deliberate links between the major locations, rather than identical stage dressing everywhere.
 for(const [cc,dy,sz] of DEKOR10.ada){const x=nx(cc);if(x<L||x>R)continue;const yy=720+dy+Math.sin(dn10BolgeSaat(x)*.4+cc)*3*dn10BolgeUyanis(x);g.globalAlpha=.82;g.drawImage(A.island,x-245*sz,yy,490*sz,300*sz);g.globalAlpha=1;}
 for(const [cc,sz] of DEKOR10.agac){const x=nx(cc);if(x<L||x>R)continue;const y=720,t=dn10BolgeSaat(x),lit=dn10Isik(x);g.save();g.translate(x,y);g.rotate(Math.sin(t*.45+cc)*.006*dn10BolgeUyanis(x));g.drawImage(A.tree,-330*sz,-720*sz,660*sz,720*sz);g.restore();
  if(!DN10_TREE_IMAGE)for(let j=0;j<2;j++){const xx=x+DN10_FRUIT_X[j]*sz,yy=y-DN10_FRUIT_Y[j]*sz,k=.44*sz;g.strokeStyle='rgba(214,202,149,.7)';g.lineWidth=1;g.beginPath();g.moveTo(xx,yy-44);g.quadraticCurveTo(xx+7,yy-23,xx,yy);g.stroke();g.save();g.translate(xx,yy);g.rotate(Math.sin(t*.7+cc+j)*.035);g.drawImage(A.hour,-35*k,0,70*k,116*k);g.restore();dn10Glow('#ffe2a6',xx,yy+30*k,25,34,.14+lit*.18);}
 }
 for(const f of DN10_FLOWERS){const x=f.x;if(x<L||x>R)continue;const k=f.k,y=f.y,lit=dn10Isik(x),a=dn10FlowerAngle(f,lit);g.save();g.translate(x,y);g.rotate(a);g.drawImage(A.flower[f.v],-220*k,-440*k,440*k,440*k);g.restore();dn10Glow(DN10_COL[f.v],x,y-275*k,80*k,80*k,.1+lit*.18);
  const age=now-f.touchAt;if(age>=0&&age<2.4){const u=age/2.4,hx=x+Math.sin(a)*275*k,hy=y-Math.cos(a)*275*k,al=Math.sin(Math.PI*u);dn10Glow('#ffe3a4',hx,hy,120*k,115*k,al*.42);dn10Glow('#91f6e4',hx-28*k,hy+12*k,65*k,65*k,al*.32);for(let j=0;j<4;j++){const xx=hx+Math.sin(j*2.4+.4)*(15+age*22)*k,yy=hy-16*k-age*(22+j*6),r=(4+j%2)*Math.sin(Math.PI*clamp(age/2.4,0,1));g.globalAlpha=(1-u)*.85;g.drawImage(DN10.fx.star,xx-r,yy-r,r*2,r*2);}g.globalAlpha=1;}
 }dn10Birds();
}
function dn10World(tm){
 if(!dn10Ready())return;dn10Fx();dn10Art();g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);g.globalAlpha=1;g.globalCompositeOperation='source-over';dn10Decor(tm);dn10Waterfalls(tm);dn10FreezeDemonstration();dn10WakeWaves();dn10Terrain();
 // Her adım yosunu yumuşak bir ışıkla uyandırır; büyü için ayrıca düğme gerekmez.
 for(const z of DN10_STEPS){const age=now-z.t;if(age<0||age>2.8||z.x<cam.x-50||z.x>cam.x+VW+50)continue;const a=(1-age/2.8)*.35;dn10Glow('#c2ffee',z.x,z.y-1,19+age*8,6+age*3,a);if(age<1.5){const rr=3+Math.sin(age*2)*3;g.globalAlpha=(1-age/1.5)*.6;g.drawImage(DN10.fx.star,z.x-rr,z.y-14-age*17-rr,rr*2,rr*2);g.globalAlpha=1;}}
 for(const p of DN10.lit){const age=now-p.t;if(age<0||age>4)continue;const r=age*210;if(p.x+r<cam.x||p.x-r>cam.x+VW)continue;dn10Glow(p.c,p.x,dn10Surface(p.x),60+r,18+r*.06,.22*(1-age/4));}
 g.globalAlpha=1;g.globalCompositeOperation='source-over';
}
function dn10Motes(tm,zMin,zMax){
 if(!dn10Ready())return;const F=dn10Fx(),vw=W/S,vh=H/S,t=DN10.moteT;g.setTransform(S,0,0,S,0,0);
 for(let i=0;i<DN10_MOTES.length;i++){const p=DN10_MOTES[i];if(p.z<zMin||p.z>=zMax)continue;const x=dn10Mod(p.u*(vw+100)-cam.x*p.z*.25+Math.sin(t*.2+p.ph)*12,vw+100)-50,y=dn10Mod(p.v*(vh+120)-cam.y*p.z*.12-t*(2+p.r),vh+120)-60;let a=.14+.1*Math.sin(t*.6+p.ph);if(Math.abs(x-(P.x-cam.x))<55&&Math.abs(y-(P.y-cam.y-35))<70)a*=.2;g.globalAlpha=a;g.drawImage(F.star,x-p.r*2,y-p.r*2,p.r*4,p.r*4);}g.globalAlpha=1;
}
function dn10Petals(tm){
 if(!dn10Ready())return;const F=dn10Fx(),L=cam.x-100,R=cam.x+VW+100;g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);
 const a=Math.floor(L/180),b=Math.ceil(R/180);for(let j=a;j<=b;j++){const x=j*180+dn10Hash(j)*130;if(x<0||x>COLS*T)continue;const alive=dn10BolgeUyanis(x),t=dn10BolgeSaat(x),y0=720-105-dn10Hash(j*3.3)*190,u=dn10Mod(t*.06+j*.177,1),y=y0+Math.sin(u*Math.PI*2)*35*alive,xx=x+Math.sin(t*.7+j)*28*alive,w=18+dn10Hash(j*7)*12;g.globalAlpha=.55+alive*.2;g.save();g.translate(xx,y);g.rotate((dn10Hash(j)*2-1)+Math.sin(t*.6+j)*.5*alive);g.drawImage(F.leaf[Math.abs(j)%4],-w/2,-w*.25,w,w*.52);g.restore();}g.globalAlpha=1;
}
const DN10_CLEAR=NESNELER.filter(o=>o.tip.startsWith('zaman')).map(o=>({x:o.x,r:o.tip==='zamanTilki'?115:o.tip==='zamanAgaci'?400:330}));
function dn10Foreground(tm){
 if(!dn10Ready())return;const F=dn10Fx(),vw=W/S,vh=H/S;g.setTransform(S,0,0,S,-cam.x*S,-cam.y*S);
 const a=Math.floor((cam.x-160)/420),b=Math.ceil((cam.x+vw+160)/420);for(let j=a;j<=b;j++){const x=j*420+dn10Hash(j)*100;if(x<0||x>COLS*T)continue;let blocked=false;for(const spot of DN10_CLEAR)if(Math.abs(spot.x-x)<spot.r){blocked=true;break;}if(blocked)continue;const y=dn10Surface(x)+65,k=.65+dn10Hash(j*3)*.35,d=Math.abs(P.x-x);g.globalAlpha=.12+.45*clamp((d-50)/200,0,1);g.drawImage(F.frond,x-120*k,y-160*k,240*k,160*k);}g.globalAlpha=1;
 // Şölen bütün manzarayı ısıtır; yüzlerin okunurluğu için ışık örtüsü hafiftir.
 if(DN10.fin>.005){g.setTransform(S,0,0,S,0,0);dn10Glow('#ffe2a4',vw*.52,vh*.66,vw*.75,vh*.7,DN10.fin*.11);}
}
// Merkez dikdörtgen tamamen saydamdır; aynı kenarlar çizilirken ekranın %39'u gereksiz harmanlanmaz.
const DN10_VIG_PARTS=[[0,0,320,20],[0,160,320,40],[0,20,70,140],[250,20,70,140]];
function dn10Vignette(){if(!dn10Ready())return;const im=dn10Fx().vig,kx=W/320,ky=H/200;g.setTransform(1,0,0,1,0,0);g.globalAlpha=.6;for(const part of DN10_VIG_PARTS){const [x,y,w,h]=part;g.drawImage(im,x,y,w,h,x*kx,y*ky,w*kx,h*ky);}g.globalAlpha=1;}
function dn10Upload(im){if(!im)return;g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.004;g.drawImage(im,0,0,2,2);g.restore();}
function dn10Isit(){
 if(!dn10Ready())return false;const p=DN10.prep++;
 if(p<7){dn10Upload(dn10Sky(p));return false;}if(p===7){const F=dn10Fx();for(const k in F)if(F[k].getContext)dn10Upload(F[k]);return false;}
 if(p===8||p===9){dn10Upload(dn10Ridge(p-8));return false;}
 if(p===10){const A=dn10Art();for(const k in A)if(A[k].getContext)dn10Upload(A[k]);for(const a of A.flower)dn10Upload(a);dn10Upload(dn10FrozenWater());dn10Upload(dn10WaterRibbon());return false;}
 if(p<18){dn10Upload(dn10Scene(p-11));return false;}
 if(p<21){dn10Upload(dn10Chunk(Math.max(0,Math.floor(P.x/DN10_CW))+p-18));return false;}
 for(const c of ['#ffe3a4','#f8d6ae','#b7f6ed','#ffe2a6','#c2ffee','#ffe2a4',...DN10_COL])glow(c);return true;
}
OLAY.on('zamanFinal',()=>{DN10.finalStarted=true;dn10IsikEkle(BOLUM.zamanAgaci.x,BOLUM.zamanAgaci.y-120,'#ffe3a4',1400);});
OLAY.on('zamanDoruk',()=>{DN10.finalPeak=true;dn10IsikEkle(BOLUM.zamanAgaci.x,BOLUM.zamanAgaci.y-160,'#91f6e4',COLS*T);});
