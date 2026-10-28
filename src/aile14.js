/* aile14.js — Feza ve annesinin yumuşak, eklemli astronot kostümleri.
   Dünya koordinatında ayak tabanı kökü. Kabin içindeki karakterler uzay14'ün
   aile14CizPoz çağrısına aittir; dışarıda her karakter tek kez çizilir. */
'use strict';
const AILE14 = (() => {
  const PI2=Math.PI*2, M={hazir:false,x:0,y:720,vx:0,yon:1,faz:0,yuru:0,pose:'ayakta',poseT:0,poseDur:0,opt:null,tm:0,ship:false,fezaFaz:0,fezaYuru:0,fezaX:NaN,talkT:0,wasGround:true,prevVy:0,landT:0,landForce:0};
  const FK={a_lidM:1,a_hx:0,a_hy:0,a_hw:0,a_shine:0,a_dim:null};
  const FR=typeof FZ_REST!=='undefined'?Object.assign({},FZ_REST):{};
  const PAL14={feza:{cloth:'#f7f4e8',shade:'#c5d7dd',edge:'#6f94a7',accent:'#4c94c9',dark:'#315c7b',light:'#b2e5eb',glove:'#f9f7e9',sole:'#47667a',seam:'#8da7ad'},
    anne:{cloth:'#fbf5ec',shade:'#d5d0e1',edge:'#9990aa',accent:'#ac99cc',dark:'#716180',light:'#e0d5ef',glove:'#fff9ed',sole:'#766a82',seam:'#b2a6b8'}};
  // Small high-resolution material parts are painted once. The frame only
  // transforms cached cloth/hardware; their gradients and seams never allocate
  // new full-body canvases while walking or during a voyage.
  const ART14=Object.create(null),ART_SCALE=3;let warmStage=0;
  const TEACH={o:null,w:0,active:false,side:-1,recover:false},TEACH_BOX={x0:0,y0:0,x1:0,y1:0};
  const FINITE=n=>Number.isFinite(n), cut=(n,a,b)=>Math.max(a,Math.min(b,n));
  const EMPTY14=Object.freeze({});
  const SM=t=>{t=cut(t,0,1);return t*t*(3-2*t);};
  function el(c,x,y,rx,ry,color,a=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),a,0,PI2);c.fill();}
  function path(c,pts,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)c.lineTo(pts[i],pts[i+1]);c.stroke();}
  function line(c,x0,y0,x1,y1,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();}
  function line3(c,x0,y0,x1,y1,x2,y2,color,width){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.lineTo(x2,y2);c.stroke();}
  function cap(c,x0,y0,x1,y1,r0,r1,color){const a=Math.atan2(y1-y0,x1-x0);c.fillStyle=color;c.beginPath();c.arc(x0,y0,r0,a+Math.PI/2,a-Math.PI/2);c.arc(x1,y1,r1,a-Math.PI/2,a+Math.PI/2);c.closePath();c.fill();}
  function rr(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.moveTo(x+r,y);c.lineTo(x+w-r,y);c.quadraticCurveTo(x+w,y,x+w,y+r);c.lineTo(x+w,y+h-r);c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);c.lineTo(x+r,y+h);c.quadraticCurveTo(x,y+h,x,y+h-r);c.lineTo(x,y+r);c.quadraticCurveTo(x,y,x+r,y);c.closePath();c.fill();}
  function star(c,x,y,r,col){c.fillStyle=col;c.beginPath();for(let i=0;i<10;i++){const a=i*Math.PI/5-Math.PI/2,q=i%2?r*.45:r;c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q);}c.closePath();c.fill();}
  function gradient(c,x0,y0,x1,y1,stops){const q=c.createLinearGradient(x0,y0,x1,y1);for(let i=0;i<stops.length;i++)q.addColorStop(stops[i][0],stops[i][1]);return q;}
  function sprite(w,h,paint){const cv=document.createElement('canvas');cv.width=Math.ceil(w*ART_SCALE);cv.height=Math.ceil(h*ART_SCALE);const cx=cv.getContext('2d');cx.scale(ART_SCALE,ART_SCALE);paint(cx);return{cv,w,h};}
  function art(pal){
    const id=pal===PAL14.anne?'anne':'feza';if(ART14[id])return ART14[id];
    const adult=id==='anne',A={};ART14[id]=A;
    A.segment=sprite(64,28,c=>{
      c.translate(7,14);
      const cloth=gradient(c,0,-9,0,9,[[0,'#fffdf4'],[.25,pal.cloth],[.7,pal.shade],[1,pal.edge]]);
      cap(c,0,0,50,0,8.7,7.7,cloth);
      c.strokeStyle='rgba(78,96,111,.25)';c.lineWidth=.55;c.beginPath();c.moveTo(2,7);c.quadraticCurveTo(25,9,47,6);c.stroke();
      rr(c,11,-6.5,25,6,2.2,gradient(c,0,-7,0,1,[[0,'#ffffffb0'],[1,pal.cloth]]));
      path(c,[12,-5.5,34,-5.5],'rgba(255,255,255,.72)',.65);
      path(c,[11,3.5,37,3.5],pal.seam,.45);
      c.setLineDash([1.3,1.2]);path(c,[10,5.2,39,5.2],'rgba(255,255,255,.74)',.45);c.setLineDash([]);
      rr(c,39,-7,4.5,13.8,1.5,pal.accent);path(c,[40,-5.5,40,4.8],pal.light,.65);
    });
    A.body=sprite(52,59,c=>{
      c.translate(26,5);const w=adult?15.7:14.3;
      c.fillStyle=gradient(c,-w,0,w,0,[[0,pal.edge],[.13,pal.shade],[.35,pal.cloth],[.65,'#fffdf4'],[1,pal.shade]]);
      c.beginPath();c.moveTo(-w+3,0);c.quadraticCurveTo(-w-3,7,-w+1,20);c.quadraticCurveTo(-w+5,32,-w+1,43);c.quadraticCurveTo(0,48,w+1,43);c.quadraticCurveTo(w-3,29,w+1,13);c.quadraticCurveTo(w+2,4,w-3,0);c.quadraticCurveTo(0,-3,-w+3,0);c.closePath();c.fill();
      c.fillStyle=gradient(c,0,1,0,14,[[0,pal.light],[.5,pal.accent],[1,pal.dark]]);c.beginPath();c.moveTo(-w+1,2);c.quadraticCurveTo(0,8,w,2);c.lineTo(w-1,10);c.quadraticCurveTo(0,15,-w+1,10);c.closePath();c.fill();
      path(c,[-w+1,2,-w+2,9,0,12,w-1,8,w,2],'rgba(255,255,255,.65)',.75);
      // Soft bib, rounded utility module and recessed color switches.
      rr(c,-9.2,13,21,17,3.8,pal.edge);rr(c,-8.5,13.6,19.6,15.6,3.2,pal.cloth);
      rr(c,-6.9,15.1,8.4,11.1,2,pal.dark);rr(c,-5.8,16,6.3,8.8,1.4,gradient(c,-6,15,1,25,[[0,pal.light],[1,pal.accent]]));
      path(c,[-4.9,18.5,-3,20,-1.5,17.5], '#eef9e5',.75);
      for(let i=0;i<3;i++){el(c,5.2,16.7+i*3.8,1.65,1.65,pal.shade);el(c,5.2,16.5+i*3.8,.9,.9,['#f6c575','#b8d3aa','#ded8ee'][i]);}
      path(c,[2.1,2,2.1,11],pal.dark,.5);path(c,[2.6,30.5,2.6,42],pal.edge,.55);
      rr(c,-w-.2,33,w*2+1,5.7,1.7,pal.accent);rr(c,-3,32.5,8.3,6.7,1.5,'#cdd4d5');rr(c,-1.4,33.5,5.3,4.1,.8,pal.dark);path(c,[-.4,34.6,2.8,34.6],pal.light,.6);
      for(let i=0;i<3;i++)path(c,[-w+2,39.5+i*1.8,-5.3,40+i*1.6],pal.seam,.4);
      rr(c,8.8,37,4.9,6.5,1.2,pal.shade);path(c,[10,38.5,12.5,38.5], '#fffaf1',.7);
      el(c,-9.6,7.2,3.65,3.9,'#d0b77e');el(c,-9.6,7.1,3.15,3.3,'#fbedd0');star(c,-9.6,7,2.2,pal.dark);
      c.setLineDash([1.3,1.25]);path(c,[-w+2,13,-w+3,28,-w+1,31],pal.seam,.55);path(c,[w-1,13,w-2,28,w,31],pal.seam,.55);c.setLineDash([]);
      path(c,[-11,1,-9,1], '#fffdf4',1);path(c,[-12,30,-8,31], '#fffdf4',.7);
    });
    A.pack=sprite(31,51,c=>{
      rr(c,4,3,24,43,5,pal.dark);rr(c,3,2,21,43,5,gradient(c,2,0,23,0,[[0,pal.edge],[.3,pal.shade],[.68,pal.cloth],[1,pal.shade]]));
      rr(c,1,7,6,31,2.2,pal.accent);path(c,[2.5,10,2.5,35],pal.light,1.1);rr(c,9,5,11,7,2,pal.cloth);
      for(let j=0;j<4;j++)path(c,[10,18+j*3,18,18+j*3],pal.edge,.8);
      rr(c,9,34,11,7,1.7,pal.accent);el(c,14.4,37.5,2.3,2.3,pal.dark);el(c,14.1,37.2,1,1,pal.light);
      path(c,[6,44,21,44],pal.edge,1.4);path(c,[7,4,20,4], '#ffffffb0',.8);
      for(const x of [7,21])for(const y of [5,41])el(c,x,y,.75,.75,'#eef5ed');
    });
    A.boot=sprite(31,22,c=>{
      rr(c,4,2,14,15,4,gradient(c,4,0,18,0,[[0,pal.shade],[.5,pal.cloth],[1,'#fffdf4']]));
      c.fillStyle=gradient(c,0,8,0,20,[[0,pal.cloth],[.6,pal.shade],[1,pal.edge]]);c.beginPath();c.moveTo(4,9);c.quadraticCurveTo(12,9,16,12);c.quadraticCurveTo(27,12,27,17);c.lineTo(26,20);c.lineTo(3,20);c.quadraticCurveTo(1,15,4,9);c.fill();
      rr(c,2,18,26,3,1.4,pal.sole);path(c,[5,18,23,18],pal.edge,.6);
      rr(c,6,3,10,4,1.2,pal.accent);path(c,[7,4,14,4],pal.light,.6);path(c,[15,12,22,14], '#fffdf3',1.1);
      path(c,[5,11,12,12],pal.seam,.55);path(c,[5,13,11,14],pal.seam,.5);
      for(let i=0;i<4;i++)path(c,[6+i*5,19.2,6+i*5,20.5], '#b4c0c0',.6);
    });
    const rx=adult?29:25,ry=adult?31:26;
    A.helmetBack=sprite(72,78,c=>{
      c.translate(36,38);el(c,0,0,rx+2,ry+2,pal.edge);
      el(c,0,0,rx+.8,ry+.8,gradient(c,-rx,-ry,rx,ry,[[0,'#f9ffff'],[.2,pal.light],[.48,'#bccad8'],[.78,pal.cloth],[1,pal.edge]]));
      el(c,0,0,rx-1,ry-1,'rgba(204,230,239,.2)');el(c,-1,-1,rx-2,ry-2,'rgba(240,249,251,.35)');
      c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=.75;c.beginPath();c.ellipse(0,0,rx+.6,ry+.6,0,3.3,5.55);c.stroke();
    });
    A.helmetFront=sprite(72,78,c=>{
      c.translate(36,38);c.strokeStyle='rgba(245,255,255,.8)';c.lineWidth=.8;c.beginPath();c.ellipse(0,0,rx-.5,ry-.5,0,0,PI2);c.stroke();
      // Reflection lives over the hair/outer glass; the eyes stay unobscured.
      c.fillStyle='rgba(255,255,255,.23)';c.beginPath();c.moveTo(-rx*.78,-ry*.4);c.bezierCurveTo(-rx*.68,-ry*.89,-rx*.1,-ry*1.03,rx*.22,-ry*.77);c.bezierCurveTo(-rx*.18,-ry*.86,-rx*.59,-ry*.62,-rx*.66,-ry*.31);c.closePath();c.fill();
      c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1.7;c.lineCap='round';c.beginPath();c.ellipse(-.4,-.5,rx-2,ry-2,0,3.8,4.52);c.stroke();
      c.strokeStyle='rgba(182,226,238,.45)';c.lineWidth=1.2;c.beginPath();c.ellipse(0,0,rx-1.8,ry-1.8,0,.45,1.36);c.stroke();
      rr(c,-rx*.65,ry-6,rx*1.3,7,3,pal.dark);rr(c,-rx*.67,ry-6.7,rx*1.34,4.8,2,pal.accent);path(c,[-rx*.53,ry-5.5,rx*.49,ry-5.5],pal.light,.75);
      for(const side of [-1,1]){el(c,side*(rx-.6),1.8,3.35,5.3,pal.cloth);el(c,side*(rx-.5),1.4,1.95,3.4,pal.edge);el(c,side*(rx-.55),1,1.1,2.25,pal.light);}
    });
    return A;
  }
  function blinkAt(tm,adult){const p=(tm+(adult?2.23:1.37))%(adult?5.3:4.7);if(p>.19)return 1;return p<.065?1-SM(p/.065)*.91:.09+SM((p-.065)/.125)*.91;}
  function eye(c,x,y,w,h,blink,look,lookY){
    if(blink<.2){line3(c,x-w,y,x,y+.55,x+w,y-.15,'#48362f',.55);return;}
    h*=blink;const gx=cut(look,-1,1)*w*.19,gy=cut(lookY||0,-1,1)*h*.23;
    c.fillStyle='#fff9ef';c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x-w*.08,y-h*1.53,x+w,y-.05);c.quadraticCurveTo(x+w*.07,y+h*.86,x-w,y);c.fill();
    el(c,x+gx,y+gy-.05,w*.44,h*.77,'#75816b');el(c,x+gx,y+gy+.02,w*.24,h*.57,'#33392f');el(c,x+gx-w*.12,y+gy-h*.36,w*.12,h*.17,'#fffdf6');el(c,x+gx+w*.15,y+gy+h*.23,w*.055,h*.09,'rgba(255,248,220,.6)');
    c.strokeStyle='#5c4338';c.lineWidth=.53;c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x-w*.08,y-h*1.53,x+w,y-.05);c.stroke();
    c.strokeStyle='rgba(152,103,83,.26)';c.lineWidth=.35;c.beginPath();c.moveTo(x-w*.82,y+.14);c.quadraticCurveTo(x,y+h*.78,x+w*.8,y+.1);c.stroke();
  }
  function motherFace(c,tm,o,hug){
    const blink=FINITE(o.blink)?cut(o.blink,0,1):blinkAt(tm,true),sm=FINITE(o.smile)?cut(o.smile,0,1):.82,gx=FINITE(o.gazeX)?o.gazeX:.35+Math.sin(tm*.57)*.15,gy=hug?Math.max(.4,FINITE(o.gazeY)?o.gazeY:0):FINITE(o.gazeY)?o.gazeY:.12;
    // Alçak at kuyruğu kaskın içinde topuz gibi kıvrılır; başı gizlemez.
    c.fillStyle='#4a342b';c.beginPath();c.moveTo(-11,2);c.bezierCurveTo(-22,1,-19,14,-12,15);c.bezierCurveTo(-8,13,-10,8,-8,6);c.closePath();c.fill();
    el(c,-1,-.6,12.4,16.2,'#e1ac91');el(c,.3,-1.5,11.6,15.4,'#f4cdb1');el(c,3,-4,9.1,11.3,'#f9dac0');
    el(c,-8,3,2.2,3.1,'#f2c7aa');el(c,-8.2,3.3,.9,1.6,'#dea88c');el(c,-8,6.7,.65,.7,'#fff6e5');
    el(c,1.5,5.8,3.9,1.7,'rgba(226,155,137,.2)');el(c,8,5.1,2,1.25,'rgba(226,155,137,.17)');
    c.fillStyle='#4a342b';c.beginPath();c.moveTo(10.7,-7);c.bezierCurveTo(10.2,-19,-4,-23,-12,-12);c.bezierCurveTo(-17,-5,-13,4,-9,7);c.bezierCurveTo(-8,0,-5,-9,3.8,-12.8);c.quadraticCurveTo(7.5,-11.6,10.7,-7);c.fill();
    c.strokeStyle='#866046';c.lineWidth=.75;c.beginPath();c.moveTo(5.5,-15);c.bezierCurveTo(-1,-18,-11,-11,-11,-5);c.moveTo(-2,-10);c.quadraticCurveTo(-7,-6,-8.5,-.5);c.stroke();
    eye(c,-.7,1.5,2.7,2.05,blink,gx,gy);eye(c,7.1,1.0,1.75,1.72,blink,gx,gy);
    c.strokeStyle='#6a4c3a';c.lineWidth=.7;c.lineCap='round';c.beginPath();c.moveTo(-3.5,-2.4);c.quadraticCurveTo(-.7,-4,2,-2.7);c.moveTo(5.3,-3.2);c.quadraticCurveTo(7,-4,8.8,-2.7);c.stroke();
    // Burun iki gözün arasında; dış profil çıkıntısı ya da yana taşan köprü yok.
    c.strokeStyle='rgba(170,108,82,.36)';c.lineWidth=.42;c.beginPath();c.moveTo(4.1,1.2);c.quadraticCurveTo(3.6,3,4,3.9);c.stroke();el(c,4.5,4.5,1.2,.65,'rgba(215,143,115,.24)');
    c.strokeStyle='rgba(173,100,80,.5)';c.beginPath();c.moveTo(3.5,4.9);c.quadraticCurveTo(4.7,5.4,5.5,4.6);c.stroke();el(c,4.5,4.2,.5,.35,'#ffe6cd');
    const speaking=FINITE(o.talk)?cut(o.talk,0,1):M.talkT>0?(.24+.3*Math.max(0,Math.sin(tm*13.5))):0;
    if(speaking>.05){el(c,3.35,9.1,2.2,1.25*speaking+.2,'#a7615c');el(c,3.4,8.75,1.7,.29,'#fff5e5');}
    c.strokeStyle='#af7068';c.lineWidth=.58;c.beginPath();c.moveTo(.6,8.7);c.quadraticCurveTo(3.4,9.9+sm*.5,6.1,8.3);c.stroke();
    line3(c,2.1,10.4,3.4,10.8,4.8,10.25,'rgba(224,146,136,.6)',.4);
  }
  function childFace(c,tm,o,hug){
    if(typeof fzHead==='function'&&typeof fzQ!=='undefined'&&typeof FZ_REST!=='undefined'){
      const previous=fzQ;try{FR.gx=FINITE(o.gazeX)?cut(o.gazeX,-1,1):.4+Math.sin(tm*.63)*.13;FR.gy=hug?Math.min(-.4,FINITE(o.gazeY)?o.gazeY:0):FINITE(o.gazeY)?cut(o.gazeY,-1,1):-.04+Math.sin(tm*.47)*.09;FR.lid=1.04;FR.happy=o.smile>.94?.12:0;FR.mSmile=FINITE(o.smile)?cut(o.smile,.2,.98):.82;FR.mOpen=0;FR.head=0;FR.breath=0;FR.brow=.08;
        FK.a_lidM=FINITE(o.blink)?cut(o.blink,0,1):blinkAt(tm,false);FK.a_hx=Math.sin(tm*1.5)*.14;FK.a_hy=Math.sin(tm*2)*.1;fzQ=FK;fzHead(c,FR,tm);
      }finally{fzQ=previous;}return;
    }
    el(c,0,0,11,12,'#f5cfb4');el(c,-1,-8,12,7,'#62432f');eye(c,-1,0,2,2,1,.5);eye(c,5.5,-.2,1.3,1.8,1,.5);line3(c,0,6,3,7.1,6,5.8,'#a85d54',.6);
  }
  function joint(c,x,y,r,pal,a){c.save();c.translate(x,y);c.rotate(a||0);el(c,0,0,r*1.02,r*.83,pal.edge);el(c,-r*.06,-r*.06,r*.86,r*.72,pal.shade);for(let i=-1;i<=1;i++){c.strokeStyle=i===0?pal.edge:pal.seam;c.lineWidth=.55;c.beginPath();c.moveTo(i*r*.35,-r*.63);c.quadraticCurveTo(i*r*.35+r*.16,0,i*r*.35,r*.63);c.stroke();}line(c,-r*.58,-r*.54,r*.45,-r*.54,'#ffffff70',.6);c.restore();}
  function segment(c,x0,y0,x1,y1,w,pal,far){
    const dx=x1-x0,dy=y1-y0,len=Math.max(.01,Math.hypot(dx,dy)),A=art(pal).segment;
    c.save();c.translate(x0,y0);c.rotate(Math.atan2(dy,dx));if(far)c.globalAlpha*=.94;
    c.drawImage(A.cv,-len*7/50,-w*1.61,len*64/50,w*3.22);c.restore();
  }
  function glove(c,x,y,a,w,pal,far){
    c.save();c.translate(x,y);c.rotate(a);
    rr(c,-3,-w*.85,5,w*1.7,1.4,pal.accent);line(c,-2,-w*.6,-2,w*.55,pal.light,.9);
    c.fillStyle=far?pal.shade:pal.glove;c.beginPath();c.moveTo(1,-w*.65);c.quadraticCurveTo(w*1.5,-w*.82,w*1.75,-w*.12);c.quadraticCurveTo(w*1.9,w*.7,w*.7,w*.78);c.lineTo(0,w*.66);c.quadraticCurveTo(-1,w*.1,1,-w*.65);c.fill();
    el(c,w*.23,w*.7,w*.6,w*.3,far?pal.shade:pal.glove,-.55);
    line(c,w*.53,-w*.45,w*1.2,-w*.28,pal.seam,.45);line(c,w*.52,w*.08,w*1.35,w*.13,pal.seam,.4);
    line(c,w*.44,-w*.56,w*1.18,-w*.42,'#fffdf6',.7);c.restore();
  }
  function limb(c,sx,sy,ex,ey,wx,wy,w,pal,far,glove){
    segment(c,sx,sy,ex,ey,w,pal,far);const a=Math.atan2(wy-ey,wx-ex);joint(c,ex,ey,w*.85,pal,a);segment(c,ex,ey,wx,wy,w*.8,pal,far);
    const dx=Math.cos(a),dy=Math.sin(a);cap(c,wx-dx*2.4,wy-dy*2.4,wx,wy,w*.8,w*.8,pal.accent);
    if(glove)drawGlove(c,wx,wy,a,w*.83,pal,far);
  }
  const drawGlove=glove;
  function boot(c,x,y,a,w,pal,far){const A=art(pal).boot;c.save();c.translate(x,y);c.rotate(a);if(far)c.globalAlpha*=.94;c.drawImage(A.cv,-w*.7,-w*1.97,w*2.91,w*2.065);c.restore();}
  function leg(c,hx,hy,fx,fy,l1,l2,w,pal,far,footA){
    let dx=fx-hx,dy=fy-w*.7-hy,d0=Math.max(.001,Math.hypot(dx,dy)),d=cut(d0,Math.abs(l1-l2)+.01,l1+l2-.01);const a=Math.atan2(dy,dx),k=Math.acos(cut((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1)),ax=hx+Math.cos(a)*d,ay=hy+Math.sin(a)*d;const kneeX=hx+Math.cos(a-k)*l1,kneeY=hy+Math.sin(a-k)*l1;
    limb(c,hx,hy,kneeX,kneeY,ax,ay,w,pal,far,false);boot(c,ax,ay+w*.7,footA,w,pal,far);
  }
  const HAND={x:0,y:0};
  function arm(c,sx,sy,swing,pose,reach,len,w,pal,far,tm,u,air,targetX,targetY){
    const adult=pal===PAL14.anne,wave=pose==='el_salla',joy=pose==='sevinc',hug=pose==='saril',up=pose==='uzan';
    let wx=sx+Math.sin(swing)*len*.82+len*.065,wy=sy+Math.cos(swing)*len*.91,bend=-1;
    let tx=wx,ty=wy,weight=0;
    if(joy||wave&&!far){tx=sx+len*(far?-.28:.36)+Math.sin(tm*5.8+(far?1.6:0))*len*.07;ty=sy-len*(joy?.81:.86)+Math.cos(tm*5.8)*len*.035;weight=u;bend=1;}
    else if(hug){tx=sx+len*(adult?(far?.72:.56):(far?.72:.9));ty=sy+len*(adult?(far?.72:.86):(far?-.12:-.32));weight=u;bend=-1;}
    else if(up||reach>0){const r=cut(up?Math.max(.8,reach):reach,0,1);tx=FINITE(targetX)?targetX:sx+len*.84;ty=FINITE(targetY)?targetY:sy-len*.22;weight=r*u;bend=ty<sy?1:-1;}
    else if(pose==='otur'){tx=sx+len*(far?.35:.54);ty=sy+len*.76;weight=u;bend=1;}
    else if(pose==='zipla'){tx=sx+len*(far?-.36:.42);ty=sy+len*(air<0?.49:.72);weight=.8*u;bend=-1;}
    if(weight>0&&u>0&&u<1){
      // Raise the hand around the shoulder, never through it. The endpoint
      // remains the accepted pose; the path avoids the zero-length direction
      // flip that a straight blend from a low hand to an overhead hand causes.
      const full=weight/u,ex=wx+(tx-wx)*full,ey=wy+(ty-wy)*full,a0=Math.atan2(wy-sy,wx-sx),a1=Math.atan2(ey-sy,ex-sx),da=((a1-a0+Math.PI*3)%PI2)-Math.PI;
      const r0=Math.hypot(wx-sx,wy-sy),r1=Math.hypot(ex-sx,ey-sy),a=a0+da*u,r=r0+(r1-r0)*u;wx=sx+Math.cos(a)*r;wy=sy+Math.sin(a)*r;
    }else{wx+=(tx-wx)*weight;wy+=(ty-wy)*weight;}
    const l1=len*.53,l2=len*.47,dx=wx-sx,dy=wy-sy,a=Math.atan2(dy,dx);
    let d=cut(Math.hypot(dx,dy),Math.abs(l1-l2)+.01,len-.05);
    // A 2-D elbow cannot change its bend side continuously unless the arm
    // straightens first. Ease through that straight chain, without stretching
    // either bone or flipping the elbow at the first frame of a new pose.
    if(bend===1){const straight=Math.pow(Math.sin(Math.PI*u),6);d+=(len-d)*straight;bend=u<.5?-1:1;}
    const k=Math.acos(cut((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1));
    // One actual two-bone chain: no elastic forearms when waving/reaching.
    wx=sx+Math.cos(a)*d;wy=sy+Math.sin(a)*d;
    const ex=sx+Math.cos(a+bend*k)*l1,ey=sy+Math.sin(a+bend*k)*l1;
    limb(c,sx,sy,ex,ey,wx,wy,w,pal,far,true);HAND.x=wx;HAND.y=wy;
  }
  function backpack(c,adult,pal,breath,shoulder){const A=art(pal).pack,k=adult?1:.72,y=shoulder+3,w=31*k,h=51*k;c.drawImage(A.cv,-w-5,y,w,h);
    c.strokeStyle=pal.edge;c.lineWidth=adult?2:1.5;c.beginPath();c.moveTo(-w+3,y+9*k);c.bezierCurveTo(-w+15,y+7*k,-w+12,y+24*k,-7,y+28*k+breath);c.stroke();
    c.strokeStyle=pal.light;c.lineWidth=.65;c.stroke();el(c,-7,y+28*k+breath,2.6*k,2.6*k,pal.accent);el(c,-7,y+28*k+breath,1.1*k,1.1*k,pal.light);
  }
  function suitBody(c,adult,pal,hip,shoulder,breath){const A=art(pal).body,k=adult?1:.84,h=hip-shoulder+12;c.drawImage(A.cv,-26*k,shoulder-4,52*k,h+9);
  }
  function helmet(c,adult,headY,tm,o,back){const pal=PAL14[adult?'anne':'feza'],A=art(pal)[back?'helmetBack':'helmetFront'];c.drawImage(A.cv,-36,headY-38,72,78);
  }
  const GAIT={run:0,duty:.5,stride:12,lift:7,cycle:48};
  function gait(adult,speed){const r=cut((speed-(adult?155:120))/(adult?200:180),0,1),d=.5-.22*r,s=(adult?18:12)+(adult?4:3)*r;GAIT.run=r;GAIT.duty=d;GAIT.stride=s;GAIT.lift=(adult?10:7)+(adult?5:4)*r;GAIT.cycle=2*s/d;return GAIT;}
  function stepX(u,stride,duty){return u<duty?stride*(1-2*u/duty):-stride+2*stride*SM((u-duty)/(1-duty));}
  function stepY(u,lift,duty){return u<duty?0:-Math.sin((u-duty)/(1-duty)*Math.PI)*lift;}
  function draw(c,x,y,s,who,pose,tm,opt){
    if(!c||!FINITE(x)||!FINITE(y)||!FINITE(s)||!FINITE(tm)||s<=0)return;
    const o=opt||EMPTY14,adult=who==='anne',pal=PAL14[adult?'anne':'feza'],dir=o.yon===-1?-1:1;
    const speed=Math.max(0,FINITE(o.hiz)?o.hiz:0),walk=FINITE(o.walk)?cut(o.walk,0,1):(pose==='yuru'?1:0),phase=FINITE(o.phase)?o.phase:tm*(adult?5.1:7),breath=Math.sin(tm*2.15)*(adult?.45:.36),pu=FINITE(o.poseU)?SM(o.poseU):1;
    const gp=gait(adult,speed),run=gp.run*walk,duty=gp.duty,stride=gp.stride*walk,lift=gp.lift*walk;
    // A real grounded flag wins over the remaining celebratory jump timer:
    // after a crater bounce both soles must touch down when physics lands.
    const seat=pose==='otur'?pu:0,jump=o.airborne===true||(o.airborne!==false&&pose==='zipla'),jumpW=o.airborne===true?1:jump?pu:0,joy=pose==='sevinc',air=FINITE(o.vy)?cut(o.vy/160,-1,1):-1,land=FINITE(o.land)?cut(o.land,0,1):0;
    const hug=pose==='saril'?pu:0;
    const hip=(adult?-56.1:-33.4)+seat*(adult?25.1:16.4)+walk*(adult?3.6:3.2)+run*(adult?2.5:2.3)+land*(adult?5:3.8)+hug*(adult?4.5:1.2)+Math.cos(phase*2)*(adult?1.1:.8)*walk*(1-jumpW)+(joy?Math.sin(tm*4.5)*1.3*pu:0);
    const shoulder=hip-(adult?34:22),headY=shoulder-(adult?27:18)+breath;
    const lean=run*.085+hug*(adult?.1:.075),upperX=-(shoulder-hip)*lean,headX=-(headY-hip)*run*.085-hug*(adult?6:1.5);
    c.save();c.translate(x,y);c.scale(s*dir,s);
    // The shadow stays on the real floor while Feza floats in lunar gravity.
    // Cabin owners explicitly disable it; no duplicate shadow over the seats.
    if(o.golge!==false){const height=FINITE(o.groundY)?Math.max(0,o.groundY-y):0;if(height<220){const k=cut(1-height/350,.55,1);c.save();c.globalAlpha*=cut(1-height/230,.12,1);el(c,0,height/s,(adult?25:18)*k,adult?3.4:2.6,'rgba(20,35,61,.17)');c.restore();}}
    const bob=0;
    c.save();c.translate(0,hip);c.transform(1,0,-lean,1,0,0);c.translate(0,-hip);backpack(c,adult,pal,breath,shoulder);c.restore();
    // Yere basan ayak yarım çevrim boyunca doğrusal geriler: gövde ilerlerken
    // temas noktası yerde kalır. Diğer yarım çevrim yumuşak yayla öne gelir.
    const nf=((phase/PI2)%1+1)%1,bf=(nf+.5)%1;
    const nearX=stepX(nf,stride,duty)+(1-walk)*4,farX=stepX(bf,stride,duty)-(1-walk)*4,nearY=stepY(nf,lift,duty),farY=stepY(bf,lift,duty);
    const groundN=nearX+((adult?13:10)-nearX)*jumpW,groundB=farX+((adult?-9:-6)-farX)*jumpW;
    const footN=groundN+((adult?29:24)-groundN)*seat,footB=groundB+((adult?16:14)-groundB)*seat;
    const legY=(nearY+((adult?-12:-9)*(1-air*.5)-nearY)*jumpW)*(1-seat),backY=(farY+((adult?-16:-11)*(1-air*.35)-farY)*jumpW)*(1-seat);
    const l1=adult?25:14,l2=adult?24:14,w=adult?6.4:5.1;
    arm(c,-9+upperX,shoulder+4,-Math.sin(phase)*(.45+run*.18)*walk*(1-jumpW)+.02,pose,0,adult?31:22,w*.72,pal,true,tm,pu,air,o.handX,o.handY);
    leg(c,-4,hip+3,footB,backY,l1,l2,w,pal,true,Math.max(0,-Math.cos(phase))*.12*walk*(1-jumpW)*(1-seat)-.04*seat-.08*jumpW*(1-seat));
    c.save();c.translate(0,hip);c.transform(1,0,-lean,1,0,0);c.translate(0,-hip);suitBody(c,adult,pal,hip,shoulder,breath);c.restore();
    leg(c,4,hip+3,footN,legY,l1,l2,w,pal,false,Math.max(0,Math.cos(phase))*.12*walk*(1-jumpW)*(1-seat)-.04*seat+.08*jumpW*(1-seat));
    // Küçük karşı baş hareketi kaskı adımlara dengeler; cam, yüz ve boyun halkası
    // aynı dönüşümü paylaşır, baş camın içinden kaymaz.
    const joyW=(joy?pu:0)*(1-jumpW),headTilt=-Math.sin(phase)*.028*walk*(1-jumpW)+Math.sin(tm*1.4)*.008*(1-jumpW-joyW)-.045*jumpW-.025*joyW+hug*(adult?.12:-.035);
    c.save();c.translate(headX,headY);c.rotate(headTilt);c.translate(0,-headY);
    helmet(c,adult,headY,tm,o,true);
    c.save();c.translate(adult?-1:1,headY+(adult?1:4));c.scale(adult?1.32:1.33,adult?1.32:1.33);c.rotate(Math.sin(tm*1.7)*.012*(1-jumpW)-.08*jumpW-(joy?.04*pu:0));
    if(adult)motherFace(c,tm,o,hug);else childFace(c,tm,o,hug);c.restore();
    helmet(c,adult,headY,tm,o,false);
    c.restore();
    arm(c,7+upperX,shoulder+4,Math.sin(phase)*(.48+run*.18)*walk*(1-jumpW)-.04,pose,FINITE(o.reach)?o.reach:0,adult?32:22,w*.78,pal,false,tm,pu,air,o.handX,o.handY);
    if(o.handOut){o.handOut.x=x+HAND.x*s*dir;o.handOut.y=y+(HAND.y+bob)*s;}
    c.restore();
  }
  function shipState(){try{return typeof UZAY14!=='undefined'&&UZAY14&&typeof UZAY14.state==='function'?UZAY14.state():null;}catch(e){return null;}}
  function adim(dt){
    dt=FINITE(dt)?cut(dt,0,.1):0;if(!dt||typeof P==='undefined'||!FINITE(P.x)||!FINITE(P.y))return;
    M.tm+=dt;
    M.talkT=Math.max(0,M.talkT-dt);
    if(M.poseT>0)M.poseT=Math.max(0,M.poseT-dt);
    const grounded=P.ground!==false;
    if(grounded&&!M.wasGround){M.landT=.28;M.landForce=cut(Math.abs(M.prevVy)/400,.12,.85);}
    else M.landT=Math.max(0,M.landT-dt);
    M.wasGround=grounded;M.prevVy=FINITE(P.vy)?P.vy:0;
    if(!M.hazir){M.x=P.x-96;M.y=P.y;M.hazir=true;M.fezaX=P.x;}
    const ship=shipState();M.ship=!!(ship&&ship.insideShip);
    if(M.ship){M.x=P.x-90;M.y=P.y;M.vx=0;M.yuru*=Math.exp(-dt*7);M.fezaYuru*=Math.exp(-dt*10);M.fezaX=P.x;TEACH.o=null;TEACH.w=0;TEACH.active=TEACH.recover=false;return;}
    if(typeof DURUM!=='undefined'&&DURUM!=='oyun')return;
    const pv=FINITE(P.vx)?P.vx:0,d=Math.abs(pv)>15?Math.sign(pv):P.f===-1?-1:P.f===1?1:M.yon,groundY=typeof yuzey==='function'?yuzey(P.x/(typeof T==='number'?T:40)):720;
    let target=P.x-d*(Math.abs(pv)>30?100:80);
    const toy=ship&&ship.activity,canTeach=!!(toy&&toy.started&&!toy.done&&FINITE(toy.x)&&FINITE(toy.y)&&Math.abs(P.x-toy.x)<500&&Math.abs(P.y-toy.y)<300&&Math.abs(pv)<110);
    if(canTeach){
      if(TEACH.o!==toy){TEACH.o=toy;TEACH.side=P.x>toy.x+110?1:-1;}
      // A narrow viewport can keep both faces while the child works on either
      // edge. Hysteresis avoids pacing back and forth across the toys.
      if(TEACH.side<0&&P.x>toy.x+150)TEACH.side=1;
      else if(TEACH.side>0&&P.x<toy.x-130)TEACH.side=-1;
    }
    TEACH.active=canTeach;TEACH.w+=(Number(canTeach)-TEACH.w)*(1-Math.exp(-dt*4.5));
    if(TEACH.o&&TEACH.w>.001){const width=TEACH.o.world===1&&TEACH.o.kind===1||TEACH.o.world===3&&TEACH.o.kind===2?330:300;
      // Keep a real standing space for the child during the first invitation.
      const teachX=TEACH.side<0?Math.min(TEACH.o.x-width,P.x-105):Math.max(TEACH.o.x+width,P.x+105);
      target+=(teachX-target)*TEACH.w;
    }
    TEACH.recover=!!TEACH.o&&!canTeach&&Math.abs(P.x-M.x)>175;
    if(!canTeach&&TEACH.w<.01&&!TEACH.recover)TEACH.o=null;
    if(typeof COLS==='number'&&typeof T==='number')target=cut(target,25,COLS*T-25);
    const ref=(Math.abs(pv)>15?pv:0)*(1-TEACH.w),desired=ref+cut((target-M.x)*3,-180,180),limit=TEACH.active?720:1500,acc=cut((desired-M.vx)*7,-limit,limit),old=M.x;
    M.vx=cut(M.vx+acc*dt,-420,420);M.x+=M.vx*dt;
    const ground=FINITE(groundY)?groundY:720;M.y+=(ground-M.y)*(1-Math.exp(-dt*12));
    if(TEACH.active&&TEACH.o)M.yon=TEACH.o.x>=M.x?1:-1;
    else if(Math.abs(M.vx)>15)M.yon=Math.sign(M.vx);else if(Math.abs(P.x-M.x)>20)M.yon=Math.sign(P.x-M.x);
    const adultCycle=gait(true,Math.abs(M.vx)).cycle;M.faz+=(M.x-old)*M.yon/adultCycle*PI2;
    M.yuru+=(cut(Math.abs(M.vx)/80,0,1)-M.yuru)*(1-Math.exp(-dt*8));
    const childCycle=gait(false,Math.abs(pv)).cycle,fd=FINITE(M.fezaX)?Math.abs(P.x-M.fezaX):0;M.fezaX=P.x;if(fd<200)M.fezaFaz+=fd/childCycle*PI2;M.fezaYuru+=(cut(Math.abs(pv)/70,0,1)-M.fezaYuru)*(1-Math.exp(-dt*10));
  }
  const OA={yon:1,hiz:0,walk:0,phase:0,smile:.86,reach:0,poseU:1,vy:0,gazeX:.4,gazeY:.3,groundY:720,handX:NaN,handY:NaN},OF={yon:1,hiz:0,walk:0,phase:0,smile:.86,reach:0,poseU:1,vy:0,land:0,gazeX:.4,gazeY:0,airborne:false,groundY:720,handX:NaN,handY:NaN};
  function poseWeight(){return M.poseT>0?SM((M.poseDur-M.poseT)/.22)*SM(M.poseT/.32):1;}
  function cizAnne(tm){if(!M.hazir||M.ship||typeof g==='undefined')return;
    OA.yon=M.yon;OA.hiz=Math.abs(M.vx);OA.walk=M.yuru;OA.phase=M.faz;OA.reach=M.poseT>0&&M.opt&&FINITE(M.opt.reach)?M.opt.reach:0;OA.poseU=poseWeight();
    OA.gazeX=cut((P.x-M.x)*M.yon/180,-.65,.7);OA.gazeY=cut((P.y-70-(M.y-110))/130,-.35,.55);
    if(TEACH.active&&TEACH.o){OA.gazeX=cut((TEACH.o.x-M.x)*M.yon/240,-.75,.75);OA.gazeY=.35;}
    OA.handX=M.poseT>0&&M.opt&&FINITE(M.opt.worldX)?(M.opt.worldX-M.x)*OA.yon:NaN;OA.handY=M.poseT>0&&M.opt&&FINITE(M.opt.worldY)?M.opt.worldY-M.y:NaN;
    if(FINITE(OA.handX)){OA.gazeX=cut(OA.handX/130,-.8,.8);OA.gazeY=FINITE(OA.handY)?cut((OA.handY+110)/90,-.6,.6):OA.gazeY;}
    const st=shipState(),welcome=st&&st.encounter;
    let show=M.poseT>0?M.pose:M.yuru>.1?'yuru':'ayakta';
    if(M.poseT<=0&&welcome&&welcome.phase==='welcome'&&M.yuru<.2){
      const u=SM(cut((welcome.age-.5)/.6,0,1))*SM(cut((4.7-welcome.age)/.6,0,1));
      show='uzan';OA.poseU=u;OA.reach=.65*u;
      OA.handX=(welcome.targetX-M.x)*OA.yon;OA.handY=welcome.targetY-M.y;
      OA.gazeX=cut(OA.handX/180,-.8,.8);OA.gazeY=cut((OA.handY+110)/150,-.5,.6);
    }
    OA.groundY=M.y;const hop=M.poseT>0&&M.pose==='zipla'?Math.sin(cut((M.poseDur-M.poseT)/Math.max(.01,M.poseDur),0,1)*Math.PI)*18:0;
    draw(g,M.x,M.y-hop,1,'anne',show,FINITE(tm)?tm:M.tm,OA);
  }
  function cizFeza(tm){
    if(M.ship)return true;if(typeof P==='undefined'||typeof g==='undefined')return false;
    OF.yon=P.f===-1?-1:P.f===1?1:(P.vx< -10?-1:1);OF.hiz=Math.abs(P.vx||0);OF.walk=M.fezaYuru;OF.phase=M.fezaFaz;OF.reach=M.poseT>0&&M.opt&&FINITE(M.opt.reach)?M.opt.reach:0;OF.poseU=poseWeight();OF.vy=FINITE(P.vy)?P.vy:0;
    OF.land=M.landT>0?Math.sin((1-M.landT/.28)*Math.PI)*M.landForce:0;OF.gazeY=P.ground===false?-.2:0;OF.gazeX=Math.abs(P.vx||0)<15&&Math.sin(M.tm*.7)>.5?-.35:.4;
    OF.airborne=P.ground===false;const gy=typeof yuzey==='function'?yuzey(P.x/(typeof T==='number'?T:40)):720;OF.groundY=FINITE(gy)?gy:720;
    OF.handX=M.poseT>0&&M.opt&&FINITE(M.opt.worldX)?(M.opt.worldX-P.x)*OF.yon:NaN;OF.handY=M.poseT>0&&M.opt&&FINITE(M.opt.worldY)?M.opt.worldY-P.y:NaN;
    if(FINITE(OF.handX)){OF.gazeX=cut(OF.handX/100,-.8,.8);OF.gazeY=FINITE(OF.handY)?cut((OF.handY+69)/90,-.6,.6):OF.gazeY;}
    const pose=M.poseT>0?M.pose:P.ground===false?'zipla':M.fezaYuru>.1?'yuru':'ayakta';
    draw(g,FINITE(P.rx)?P.rx:P.x,FINITE(P.ry)?P.ry:P.y,1,'feza',pose,FINITE(tm)?tm:M.tm,OF);return true;
  }
  function pose(name,opt){M.pose=typeof name==='string'?name:'ayakta';M.opt=opt||null;M.poseT=opt&&FINITE(opt.sure)?cut(opt.sure,0,30):1.4;M.poseDur=M.poseT;}
  // Kabin çıkışının son ayak temasından normal takibe teslim. Çağıran önce
  // insideShip'i kapatır; böylece iki beden görünmez veya anne geriye ışınlanmaz.
  function anchor(x,y,dir){
    if(!FINITE(x)||!FINITE(y))return false;
    M.x=x;M.y=y;M.vx=0;M.yuru=0;M.fezaYuru=0;M.fezaX=typeof P!=='undefined'&&FINITE(P.x)?P.x:NaN;M.hazir=true;M.ship=false;M.landT=0;M.wasGround=true;TEACH.o=null;TEACH.w=0;TEACH.active=TEACH.recover=false;
    if(dir===1||dir===-1)M.yon=dir;
    return true;
  }
  function state(){return M;}
  function cycleDistance(who,speed){return gait(who==='anne',FINITE(speed)?Math.abs(speed):0).cycle;}
  function isit(){if(warmStage===0){art(PAL14.feza);warmStage=1;return false;}if(warmStage===1){art(PAL14.anne);warmStage=2;}return true;}
  function cacheInfo(){let parts=0,pixels=0;for(const id of ['feza','anne'])for(const p of Object.values(ART14[id]||{})){parts++;pixels+=p.cv.width*p.cv.height;}return{parts,pixels,bytes:pixels*4,ready:parts===12};}
  function activityBox(){
    const o=TEACH.o;if(!o||M.ship||(!TEACH.active&&TEACH.w<.05&&!TEACH.recover)||typeof P==='undefined')return null;
    TEACH_BOX.x0=Math.min(o.x-350,M.x-45,P.x-45);TEACH_BOX.x1=Math.max(o.x+350,M.x+45,P.x+45);
    TEACH_BOX.y0=Math.min(o.y-390,M.y-155,P.y-110);TEACH_BOX.y1=Math.max(o.y+25,M.y+12,P.y+12);return TEACH_BOX;
  }
  if(typeof OLAY!=='undefined')OLAY.on('konusma',e=>{if(typeof BOLUM_NO!=='undefined'&&BOLUM_NO===14&&e&&/^an_uz_/.test(e.anahtar||''))M.talkT=FINITE(e.sure)?cut(e.sure,0,20):0;});
  return {adim,cizAnne,cizFeza,pose,anchor,state,draw,cycleDistance,isit,cacheInfo,activityBox};
})();
function aile14CizPoz(ctx,x,y,scale,who,pose,tm,opts){AILE14.draw(ctx,x,y,scale,who,pose,tm||0,opts);}
if(typeof window!=='undefined')window.AILE14=AILE14;
